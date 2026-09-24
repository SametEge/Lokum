"""Turning an unpacked Firefox directory into Lokum."""
import datetime
import os
import shutil
import subprocess

from .util import ROOT, copytree, log, rmtree, run, write_json

# Files of the official build that must not ship with Lokum: Mozilla's
# updater (it would replace Lokum with Firefox), telemetry/crash uploaders,
# and helpers hard-wired to firefox.exe.
REMOVE_COMMON = [
    "updater.ini",
    "update-settings.ini",
    "precomplete",
    "removed-files",
    "installation_telemetry.json",
    "install.log",
]
REMOVE_WINDOWS = [
    "updater.exe",
    "maintenanceservice.exe",
    "maintenanceservice_installer.exe",
    "default-browser-agent.exe",
    "private_browsing.exe",
    "private_browsing.VisualElementsManifest.xml",
    "pingsender.exe",
    "crashreporter.exe",
    "crashreporter.ini",
    "nmhproxy.exe",
    "firefox.exe.sig",
    "desktop-launcher",
    "uninstall",
    "browser/VisualElements/PrivateBrowsing_150.png",
    "browser/VisualElements/PrivateBrowsing_70.png",
]
REMOVE_LINUX = [
    "updater",
    "pingsender",
    "crashreporter",
    "crashreporter.ini",
]

SRC = os.path.join(ROOT, "src")
BRANDING = os.path.join(ROOT, "branding", "generated")


def git_commit():
    try:
        return subprocess.check_output(["git", "rev-parse", "--short=10", "HEAD"], cwd=ROOT,
                                       stderr=subprocess.DEVNULL).decode().strip()
    except Exception:  # noqa: BLE001
        return ""


def clean(app_dir, platform):
    removed = 0
    for rel in REMOVE_COMMON + (REMOVE_WINDOWS if platform.startswith("win") else REMOVE_LINUX):
        path = os.path.join(app_dir, rel)
        if os.path.exists(path):
            rmtree(path)
            removed += 1
    log(f"removed {removed} Firefox-only files", level="ok")


def install_layer(app_dir, *, version, firefox_version, platform, channel, repo):
    """Copies Lokum's autoconfig, policies and the chrome://lokum package."""
    copytree(os.path.join(SRC, "app"), app_dir)
    target = os.path.join(app_dir, "browser", "lokum")
    rmtree(target)
    shutil.copytree(os.path.join(SRC, "lokum"), target,
                    ignore=shutil.ignore_patterns("*.map", ".DS_Store"))
    now = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0)
    commit = git_commit()
    info = {
        "version": version,
        "firefox": firefox_version,
        "channel": channel,
        "platform": platform,
        "buildDate": now.isoformat().replace("+00:00", "Z"),
        "commit": commit,
        "repo": repo,
        "build": f"{version}+fx{firefox_version}+{commit or 'local'}+{now.strftime('%Y%m%d%H%M%S')}",
    }
    write_json(os.path.join(target, "version.json"), info)
    log(f"installed Lokum layer {version} ({info['build']})", level="ok")
    return info


def brand_windows(app_dir, *, version, firefox_version):
    exe = os.path.join(app_dir, "firefox.exe")
    lokum_exe = os.path.join(app_dir, "lokum.exe")
    if os.path.exists(exe):
        os.replace(exe, lokum_exe)
    if not os.path.exists(lokum_exe):
        raise SystemExit("lokum.exe missing after rename")

    pe_dir = os.path.join(ROOT, "scripts", "pe")
    if not os.path.isdir(os.path.join(pe_dir, "node_modules")):
        run(["npm", "ci" if os.path.exists(os.path.join(pe_dir, "package-lock.json")) else "install",
             "--no-audit", "--no-fund"], cwd=pe_dir)
    run(["node", os.path.join(pe_dir, "set-resources.mjs"), lokum_exe,
         "--icon", os.path.join(BRANDING, "lokum.ico"),
         "--doc-icon", os.path.join(BRANDING, "lokum-document.ico"),
         "--version", version, "--firefox", firefox_version])

    # Start menu tile
    old_manifest = os.path.join(app_dir, "firefox.VisualElementsManifest.xml")
    if os.path.exists(old_manifest):
        os.remove(old_manifest)
    ve_dir = os.path.join(app_dir, "browser", "VisualElements")
    os.makedirs(ve_dir, exist_ok=True)
    for name in ("VisualElements_150.png", "VisualElements_70.png"):
        shutil.copy(os.path.join(BRANDING, "visual-elements", name), os.path.join(ve_dir, name))
    with open(os.path.join(app_dir, "lokum.VisualElementsManifest.xml"), "w", encoding="utf-8") as f:
        f.write("""<Application xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>
  <VisualElements
      ShowNameOnSquare150x150Logo='on'
      Square150x150Logo='browser\\VisualElements\\VisualElements_150.png'
      Square70x70Logo='browser\\VisualElements\\VisualElements_70.png'
      ForegroundText='light'
      BackgroundColor='#d23c78'/>
</Application>
""")

    # Window icons (used when a window asks for an icon by its id).
    icons = os.path.join(app_dir, "browser", "chrome", "icons", "default")
    os.makedirs(icons, exist_ok=True)
    for name in ("main-window.ico", "default.ico"):
        shutil.copy(os.path.join(BRANDING, "lokum.ico"), os.path.join(icons, name))
    shutil.copy(os.path.join(BRANDING, "lokum.ico"), os.path.join(app_dir, "lokum.ico"))
    shutil.copy(os.path.join(BRANDING, "lokum-document.ico"), os.path.join(app_dir, "lokum-document.ico"))
    log("Windows branding applied", level="ok")


def brand_linux(app_dir):
    icons = os.path.join(app_dir, "browser", "chrome", "icons", "default")
    os.makedirs(icons, exist_ok=True)
    for size in (16, 32, 48, 64, 128):
        shutil.copy(os.path.join(BRANDING, "icons", f"lokum-{size}.png"), os.path.join(icons, f"default{size}.png"))
    os.makedirs(os.path.join(app_dir, "icons"), exist_ok=True)
    for size in (48, 128, 256):
        shutil.copy(os.path.join(BRANDING, "icons", f"lokum-{size}.png"), os.path.join(app_dir, "icons", f"lokum-{size}.png"))
    launcher = os.path.join(app_dir, "lokum")
    with open(launcher, "w", encoding="utf-8") as f:
        f.write("""#!/bin/sh
# Lokum launcher: a separate window class and remoting name keep Lokum
# apart from any installed Firefox.
HERE="$(dirname "$(readlink -f "$0")")"
exec "$HERE/firefox" --name lokum --class Lokum "$@"
""")
    os.chmod(launcher, 0o755)
    with open(os.path.join(app_dir, "lokum.desktop"), "w", encoding="utf-8") as f:
        f.write("""[Desktop Entry]
Version=1.0
Type=Application
Name=Lokum
GenericName=Web Browser
Comment=A sweeter way to browse
Exec=lokum %u
Icon=lokum
Terminal=false
Categories=Network;WebBrowser;
MimeType=text/html;text/xml;application/xhtml+xml;x-scheme-handler/http;x-scheme-handler/https;
StartupNotify=true
StartupWMClass=Lokum
""")
    with open(os.path.join(app_dir, "install-desktop-entry.sh"), "w", encoding="utf-8") as f:
        f.write("""#!/bin/sh
# Adds Lokum to your application menu (per user, no root needed).
set -e
HERE="$(dirname "$(readlink -f "$0")")"
mkdir -p "$HOME/.local/share/applications" "$HOME/.local/share/icons/hicolor/256x256/apps" "$HOME/.local/bin"
cp "$HERE/icons/lokum-256.png" "$HOME/.local/share/icons/hicolor/256x256/apps/lokum.png"
sed "s|^Exec=lokum|Exec=$HERE/lokum|" "$HERE/lokum.desktop" > "$HOME/.local/share/applications/lokum.desktop"
ln -sf "$HERE/lokum" "$HOME/.local/bin/lokum"
echo "Lokum added to your applications menu."
""")
    os.chmod(os.path.join(app_dir, "install-desktop-entry.sh"), 0o755)
    log("Linux branding applied", level="ok")


def write_install_manifest(app_dir):
    """Lists the top-level entries the installer owns, so updates and the
    uninstaller only ever delete what Lokum installed."""
    names = sorted(n for n in os.listdir(app_dir) if n not in ("lokum-manifest.txt",))
    with open(os.path.join(app_dir, "lokum-manifest.txt"), "w", encoding="ascii", newline="\r\n") as f:
        f.write("\n".join(names) + "\n")
    return names
