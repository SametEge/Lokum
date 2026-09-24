#!/usr/bin/env python3
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
"""Builds Lokum from an official Firefox release.

Examples:
  # Windows installer + zip from the latest Firefox release
  python3 scripts/build.py --platform win64

  # Linux tarball against a specific Firefox version
  python3 scripts/build.py --platform linux-x86_64 --firefox-version 156.0

  # Use an already unpacked Firefox (development, no downloads)
  python3 scripts/build.py --platform linux-x86_64 --firefox-dir ~/firefox --no-locales

Steps: download + verify (SHA512SUMS) -> unpack -> merge language packs into
omni.ja -> replace Firefox branding -> add the Lokum layer (autoconfig,
policies, chrome://lokum) -> rename/rebrand the executable -> package.
"""
import argparse
import os
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from lokumbuild import app, firefox, omni, package  # noqa: E402
from lokumbuild.util import ROOT, log, read_json, require, rmtree  # noqa: E402


def main():
    base = read_json(os.path.join(ROOT, "version.json"), {}) or {}
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--platform", default="win64", choices=sorted(firefox.PLATFORMS))
    ap.add_argument("--firefox-version", help="Firefox release to build on (default: pinned or latest)")
    ap.add_argument("--version", help="Lokum version (default: version.json + -dev)")
    ap.add_argument("--channel", default=base.get("channel", "stable"))
    ap.add_argument("--repo", default=os.environ.get("GITHUB_REPOSITORY", base.get("repo", "SametEge/Lokum")))
    ap.add_argument("--firefox-dir", help="use this unpacked Firefox instead of downloading")
    ap.add_argument("--langpacks-dir", help="directory with <locale>.xpi files to merge")
    ap.add_argument("--no-locales", action="store_true", help="skip language packs")
    ap.add_argument("--no-installer", action="store_true", help="skip the NSIS installer")
    ap.add_argument("--app-only", action="store_true", help="stop after preparing the app directory")
    ap.add_argument("--work", default=os.path.join(ROOT, ".work"))
    ap.add_argument("--cache", default=os.path.join(ROOT, ".cache"))
    ap.add_argument("--dist", default=os.path.join(ROOT, "dist"))
    args = ap.parse_args()

    require("unzip")
    if args.platform.startswith("win") and not args.firefox_dir:
        require("7z")
    if args.platform.startswith("win"):
        require("node")

    version = args.version or f"{base.get('version', '0.0.0')}-dev"
    work = os.path.join(args.work, args.platform)
    app_dir = os.path.join(work, "Lokum")
    rmtree(work)
    os.makedirs(work)

    # 1. Firefox --------------------------------------------------------------
    if args.firefox_dir:
        log(f"copying Firefox from {args.firefox_dir}", level="step")
        shutil.copytree(args.firefox_dir, app_dir, symlinks=True)
        ff_version = firefox.detect_version(app_dir)
        langpacks = {}
        if args.langpacks_dir and not args.no_locales:
            for name in sorted(os.listdir(args.langpacks_dir)):
                if name.endswith(".xpi"):
                    langpacks[name[:-4]] = os.path.join(args.langpacks_dir, name)
    else:
        ff_version = firefox.resolve_version(args.firefox_version)
        release = firefox.FirefoxRelease(ff_version, args.platform, args.cache)
        log(f"Firefox {ff_version} for {args.platform}", level="step")
        archive = release.fetch_app()
        firefox.extract_app(archive, args.platform, app_dir)
        langpacks = {} if args.no_locales else release.fetch_langpacks()

    if not os.path.exists(os.path.join(app_dir, "omni.ja")):
        raise SystemExit(f"{app_dir} does not look like a Firefox build (no omni.ja)")

    # 2. omni.ja: languages + branding ------------------------------------------
    log("repacking omni.ja (languages and branding)", level="step")
    with omni.Omni(app_dir, work) as jars:
        locales = jars.packaged_locales()
        for locale, xpi in sorted(langpacks.items()):
            merged = jars.merge_langpack(xpi)
            if merged not in locales:
                locales.append(merged)
            log(f"merged language {merged}", level="ok")
        jars.set_packaged_locales(locales)
        jars.rebrand(omni.branding_source())
    log(f"packaged locales: {', '.join(locales)}", level="ok")

    # 3. Lokum layer -------------------------------------------------------------
    log("adding the Lokum layer", level="step")
    app.clean(app_dir, args.platform)
    info = app.install_layer(app_dir, version=version, firefox_version=ff_version,
                             platform=args.platform, channel=args.channel, repo=args.repo)
    if args.platform.startswith("win"):
        app.brand_windows(app_dir, version=version, firefox_version=ff_version)
        app.write_install_manifest(app_dir)
    else:
        app.brand_linux(app_dir)

    if args.app_only:
        log(f"app directory ready: {app_dir}", level="ok")
        return

    # 4. Packages ----------------------------------------------------------------
    log("packaging", level="step")
    result = package.package(app_dir, args.dist, platform=args.platform, version=version,
                             firefox_version=ff_version,
                             make_installer=args.platform.startswith("win") and not args.no_installer)
    for artifact in result["artifacts"]:
        log(f"{artifact['name']}  {artifact['size'] / 1e6:.1f} MB  sha256 {artifact['sha256'][:16]}…", level="ok")
    log(f"Lokum {version} (Firefox {ff_version}, build {info['build']}) is ready 🍬", level="ok")


if __name__ == "__main__":
    main()
