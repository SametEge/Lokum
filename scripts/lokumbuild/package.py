"""Packaging: installer (NSIS), zip and tarball, plus checksums."""
import os
import shutil
import tarfile
import zipfile

from .util import ROOT, log, run, sha256, which, write_json

INSTALLER_DIR = os.path.join(ROOT, "installer")


def zip_app(app_dir, out_path, top="Lokum"):
    tmp = out_path + ".tmp"
    with zipfile.ZipFile(tmp, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for dirpath, dirnames, filenames in os.walk(app_dir):
            dirnames.sort()
            for name in sorted(filenames):
                full = os.path.join(dirpath, name)
                arc = os.path.join(top, os.path.relpath(full, app_dir)).replace(os.sep, "/")
                zf.write(full, arc)
    os.replace(tmp, out_path)
    return out_path


def tar_app(app_dir, out_path, top="lokum"):
    tmp = out_path + ".tmp"
    with tarfile.open(tmp, "w:xz", preset=6) as tar:
        tar.add(app_dir, arcname=top)
    os.replace(tmp, out_path)
    return out_path


def nsis(app_dir, out_path, *, version, firefox_version, arch="x64"):
    makensis = which("makensis")
    if not makensis:
        raise SystemExit("makensis not found (apt install nsis / choco install nsis)")
    numeric = ".".join((version.split("-")[0].split("+")[0].split(".") + ["0", "0", "0"])[:4])
    run([makensis, "-V3", "-INPUTCHARSET", "UTF8",
         f"-DVERSION={version}",
         f"-DVERSION_NUMERIC={numeric}",
         f"-DFIREFOX_VERSION={firefox_version}",
         f"-DAPP_DIR={os.path.abspath(app_dir)}",
         f"-DOUTFILE={os.path.abspath(out_path)}",
         f"-DARCH={arch}",
         os.path.join(INSTALLER_DIR, "lokum.nsi")])
    return out_path


def describe(path, kind):
    return {
        "name": os.path.basename(path),
        "kind": kind,
        "size": os.path.getsize(path),
        "sha256": sha256(path),
    }


def package(app_dir, dist_dir, *, platform, version, firefox_version, make_installer=True):
    os.makedirs(dist_dir, exist_ok=True)
    artifacts = []
    if platform.startswith("win"):
        arch = "arm64" if platform == "win-arm64" else "x64"
        if make_installer:
            setup = os.path.join(dist_dir, f"Lokum-Setup-{version}-{arch}.exe")
            nsis(app_dir, setup, version=version, firefox_version=firefox_version, arch=arch)
            artifacts.append(describe(setup, "installer"))
            log(f"installer: {setup}", level="ok")
        # The zip edition runs from any folder; the updater only notifies.
        marker = os.path.join(app_dir, "lokum-portable")
        with open(marker, "w", encoding="utf-8") as f:
            f.write("This copy of Lokum was unpacked from a zip. Update it by downloading a new zip.\n")
        try:
            archive = os.path.join(dist_dir, f"Lokum-{version}-{platform}.zip")
            zip_app(app_dir, archive)
            artifacts.append(describe(archive, "archive"))
            log(f"zip: {archive}", level="ok")
        finally:
            os.remove(marker)
    else:
        archive = os.path.join(dist_dir, f"Lokum-{version}-{platform}.tar.xz")
        tar_app(app_dir, archive)
        artifacts.append(describe(archive, "archive"))
        log(f"tarball: {archive}", level="ok")

    info = {
        "version": version,
        "firefox": firefox_version,
        "platform": platform,
        "artifacts": artifacts,
    }
    write_json(os.path.join(dist_dir, f"build-{platform}.json"), info)
    return info
