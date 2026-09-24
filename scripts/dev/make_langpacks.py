#!/usr/bin/env python3
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

"""Builds Firefox language packs from Mozilla's l10n sources.

The normal build downloads Mozilla's official language packs. When
archive.mozilla.org cannot be reached, this script makes equivalent XPIs from
https://github.com/mozilla-l10n/firefox-l10n and the en-US resources of the
Firefox build itself, the same way a multi-locale build merges them:

  * Fluent (.ftl) files are taken from the l10n repository; messages missing
    there fall back to en-US at runtime.
  * .properties and .dtd files are merged key by key onto the en-US file, so
    every key Firefox expects exists. A translation is only used when it keeps
    the same printf placeholders / entity references as en-US.

usage:
  python3 scripts/dev/make_langpacks.py --firefox-dir DIR --l10n DIR --out DIR \\
      [--locales tr de ...]

The resulting <locale>.xpi files can be passed to build.py --langpacks-dir.
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lokumbuild.firefox import LOCALES  # noqa: E402

OS_KEYS = {"os=WINNT": "win", "os=Darwin": "macosx", "os=LikeUnix": "linux", "os=Android": "android"}

PRINTF = re.compile(r"%(?:\d+\$)?(?:ll|l|h)?[SsdiuxXcfg@]")
ENTITY_REF = re.compile(r"&([A-Za-z_][\w.\-]*);")
XML_ENTITIES = {"amp", "lt", "gt", "quot", "apos"}


def extract(omni, dest):
    # omni.ja is a zip with a leading central directory; unzip copes with it
    # and exits with 1/2 for the harmless warnings it prints.
    result = subprocess.run(["unzip", "-q", "-o", omni, "-d", dest], capture_output=True)
    if result.returncode not in (0, 1, 2):
        raise SystemExit(f"could not unpack {omni}: {result.stderr.decode(errors='replace')}")


# ---------------------------------------------------------------- parsers

def parse_properties(text):
    """Returns an ordered {key: raw value} dict (continuation lines joined)."""
    entries = {}
    lines = text.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        i += 1
        stripped = line.lstrip()
        if not stripped or stripped[0] in "#!":
            continue
        while line.endswith("\\") and not line.endswith("\\\\") and i < len(lines):
            line = line[:-1] + lines[i].lstrip()
            i += 1
        m = re.match(r"\s*([^=:\s]+)\s*[=:]\s?(.*)$", line)
        if m:
            entries[m.group(1)] = m.group(2)
    return entries


def merge_properties(en_text, l10n_text):
    l10n = parse_properties(l10n_text)
    out = []
    used = 0
    lines = en_text.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        i += 1
        stripped = line.lstrip()
        if not stripped or stripped[0] in "#!":
            out.append(line)
            continue
        full = line
        while full.endswith("\\") and not full.endswith("\\\\") and i < len(lines):
            full = full[:-1] + lines[i].lstrip()
            i += 1
        m = re.match(r"(\s*)([^=:\s]+)(\s*[=:]\s?)(.*)$", full)
        if not m:
            out.append(full)
            continue
        key, en_value = m.group(2), m.group(4)
        value = l10n.get(key)
        if value is not None and placeholders_match(en_value, value):
            out.append(f"{m.group(1)}{key}{m.group(3)}{value}")
            used += 1
        else:
            out.append(full)
    return "\n".join(out) + "\n", used


def placeholders_match(en_value, value):
    def count(v):
        # Plural forms repeat placeholders per form; compare the first form.
        return sorted(set(PRINTF.findall(v.split(";")[0].replace("%%", ""))))
    en = count(en_value)
    tr = count(value)
    if en == tr:
        return True
    # "%S … %S" in en-US may become "%1$S … %2$S" in a translation.
    positional = [p for p in tr if "$" in p]
    return bool(positional) and len(positional) == len(PRINTF.findall(en_value.split(";")[0]))


DTD_ENTITY = re.compile(r"<!ENTITY\s+([\w.\-]+)\s+(\"[^\"]*\"|'[^']*')\s*>", re.S)


def merge_dtd(en_text, l10n_text):
    l10n = {m.group(1): m.group(2) for m in DTD_ENTITY.finditer(l10n_text)}
    used = 0

    def replace(m):
        nonlocal used
        name, en_value = m.group(1), m.group(2)
        value = l10n.get(name)
        if value is None:
            return m.group(0)
        refs = set(ENTITY_REF.findall(value)) - XML_ENTITIES
        if not refs <= set(ENTITY_REF.findall(en_value)):
            return m.group(0)
        used += 1
        return f"<!ENTITY {name} {value}>"

    return DTD_ENTITY.sub(replace, en_text), used


# ------------------------------------------------------------ l10n lookup

class L10nIndex:
    def __init__(self, root):
        self.root = root
        self.files = []
        for dirpath, _dirs, names in os.walk(root):
            for name in names:
                self.files.append(os.path.relpath(os.path.join(dirpath, name), root).replace(os.sep, "/"))

    def find(self, rel, prefer=()):
        """The l10n file whose path ends with rel (longest, preferred first)."""
        candidates = [f for f in self.files if f == rel or f.endswith("/" + rel)]
        if not candidates and rel.startswith("branding/"):
            rest = rel[len("branding/"):]
            candidates = [f for f in self.files if f == "browser/branding/official/" + rest]
        if not candidates:
            return None
        candidates.sort(key=lambda f: (not f.startswith(prefer) if prefer else False, len(f)))
        return os.path.join(self.root, candidates[0])


# ------------------------------------------------------------ building

def chrome_packages(manifest_path):
    """{package: [(path, os_key or None)]} for the en-US locale lines."""
    packages = {}
    with open(manifest_path, encoding="utf-8") as f:
        for line in f:
            parts = line.split()
            if len(parts) >= 4 and parts[0] == "locale" and parts[2] == "en-US":
                flags = [p for p in parts[4:] if p.startswith("os=")]
                os_key = OS_KEYS.get(flags[0]) if flags else None
                packages.setdefault(parts[1], []).append((parts[3], os_key))
    return packages


def semantic_rel(chrome_path, filename):
    """Maps a packaged chrome file to its path in the l10n repository tail."""
    path = chrome_path.rstrip("/") + "/" + filename
    for prefix in ("en-US/locale/en-US/", "en-US/locale/"):
        if path.startswith(prefix):
            return path[len(prefix):]
    return None


def build_locale(locale, trees, l10n_root, out_dir, version):
    index = L10nIndex(os.path.join(l10n_root, locale))
    stage = tempfile.mkdtemp(prefix=f"lp-{locale}-")
    stats = {"ftl": 0, "ftl_missing": 0, "props": 0, "keys": 0}
    try:
        chrome_resources = {}
        for area, root in trees.items():
            base = "" if area == "gre" else "browser/"
            prefer = ("browser/",) if area == "browser" else ("toolkit/", "dom/", "netwerk/", "security/", "devtools/")

            # Fluent
            loc_root = os.path.join(root, "localization", "en-US")
            for dirpath, _dirs, names in os.walk(loc_root):
                for name in names:
                    if not name.endswith(".ftl"):
                        continue
                    rel = os.path.relpath(os.path.join(dirpath, name), loc_root).replace(os.sep, "/")
                    src = index.find(rel, prefer)
                    if not src:
                        # Fluent drops a whole locale from a document when one
                        # of its resources is missing, so untranslated files
                        # ship in English (as compare-locales merges do).
                        src = os.path.join(dirpath, name)
                        stats["ftl_missing"] += 1
                    else:
                        stats["ftl"] += 1
                    dst = os.path.join(stage, base, "localization", locale, rel)
                    os.makedirs(os.path.dirname(dst), exist_ok=True)
                    shutil.copyfile(src, dst)

            # Legacy chrome packages
            for package, entries in chrome_packages(os.path.join(root, "chrome", "chrome.manifest")).items():
                for chrome_path, os_key in entries:
                    if not chrome_path.startswith("en-US/"):
                        continue  # e.g. app-marketplace-icons: not localizable
                    en_dir = os.path.join(root, "chrome", chrome_path)
                    if not os.path.isdir(en_dir):
                        continue
                    target_rel = chrome_path.replace("en-US", locale)
                    for dirpath, _dirs, names in os.walk(en_dir):
                        for name in names:
                            en_file = os.path.join(dirpath, name)
                            rel_in_pkg = os.path.relpath(en_file, en_dir).replace(os.sep, "/")
                            dst = os.path.join(stage, base, "chrome", target_rel, rel_in_pkg)
                            os.makedirs(os.path.dirname(dst), exist_ok=True)
                            srel = semantic_rel(chrome_path, rel_in_pkg)
                            src = index.find(srel, prefer) if srel else None
                            if src and name.endswith((".properties", ".dtd")):
                                with open(en_file, encoding="utf-8") as f:
                                    en_text = f.read()
                                with open(src, encoding="utf-8") as f:
                                    l10n_text = f.read()
                                merge = merge_properties if name.endswith(".properties") else merge_dtd
                                text, used = merge(en_text, l10n_text)
                                with open(dst, "w", encoding="utf-8") as f:
                                    f.write(text)
                                stats["props"] += 1
                                stats["keys"] += used
                            else:
                                shutil.copyfile(en_file, dst)
                    resource = base + "chrome/" + target_rel
                    if os_key:
                        existing = chrome_resources.get(package)
                        if not isinstance(existing, dict):
                            existing = {}
                        existing[os_key] = resource
                        chrome_resources[package] = existing
                    else:
                        chrome_resources[package] = resource

        manifest = {
            "langpack_id": locale,
            "manifest_version": 2,
            "name": f"Language: {locale}",
            "version": version,
            "languages": {locale: {"version": version, "chrome_resources": chrome_resources}},
            "sources": {"browser": {"base_path": "browser/"}},
        }
        with open(os.path.join(stage, "manifest.json"), "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2, ensure_ascii=False)

        xpi = os.path.join(out_dir, f"{locale}.xpi")
        with zipfile.ZipFile(xpi, "w", zipfile.ZIP_DEFLATED) as z:
            for dirpath, _dirs, names in os.walk(stage):
                for name in sorted(names):
                    full = os.path.join(dirpath, name)
                    z.write(full, os.path.relpath(full, stage).replace(os.sep, "/"))
        return xpi, stats
    finally:
        shutil.rmtree(stage, ignore_errors=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--firefox-dir", required=True, help="unpacked Firefox (with omni.ja)")
    parser.add_argument("--l10n", required=True, help="checkout of mozilla-l10n/firefox-l10n")
    parser.add_argument("--out", required=True)
    parser.add_argument("--locales", nargs="*", default=LOCALES)
    args = parser.parse_args()

    os.makedirs(args.out, exist_ok=True)
    with open(os.path.join(args.firefox_dir, "platform.ini"), encoding="utf-8") as f:
        version = re.search(r"Milestone=(\S+)", f.read()).group(1)

    work = tempfile.mkdtemp(prefix="lokum-langpacks-")
    try:
        trees = {"gre": os.path.join(work, "gre"), "browser": os.path.join(work, "browser")}
        extract(os.path.join(args.firefox_dir, "omni.ja"), trees["gre"])
        extract(os.path.join(args.firefox_dir, "browser", "omni.ja"), trees["browser"])
        for locale in args.locales:
            if not os.path.isdir(os.path.join(args.l10n, locale)):
                print(f"skip {locale}: not in the l10n checkout")
                continue
            xpi, s = build_locale(locale, trees, args.l10n, args.out, version)
            print(f"{locale}: {s['ftl']} Fluent files (+{s['ftl_missing']} untranslated, shipped in English), "
                  f"{s['props']} properties/DTD files with {s['keys']} translated keys -> {xpi}")
    finally:
        shutil.rmtree(work, ignore_errors=True)


if __name__ == "__main__":
    main()
