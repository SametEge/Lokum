"""Repacking Firefox's omni.ja archives: language packs and branding."""
import json
import os
import re
import shutil
import tempfile
import zipfile

from .util import ROOT, log, run

# Language pack "chrome_resources" platform keys -> chrome.manifest flags.
OS_FLAGS = {
    "macosx": " os=Darwin",
    "linux": " os=LikeUnix",
    "win": " os=WINNT",
    "android": " os=Android",
}

FIXED_DATE = (2010, 1, 1, 0, 0, 0)

BRAND_NAME = "Lokum"
TRADEMARK = ("Lokum is an independent browser built on Mozilla Firefox. "
             "Firefox and the Firefox logos are trademarks of the Mozilla Foundation.")


def unzip(archive, dest):
    """Extracts a (possibly Mozilla-optimized) jar. `unzip` returns 1/2 for
    the harmless "extra bytes" warnings those jars trigger."""
    os.makedirs(dest, exist_ok=True)
    run(["unzip", "-q", "-o", archive, "-d", dest], quiet=True, ok_codes=(0, 1, 2))
    if not os.listdir(dest):
        raise RuntimeError(f"failed to extract {archive}")


def zip_dir(src_dir, archive):
    """Writes a deterministic zip of src_dir (sorted, fixed timestamps)."""
    tmp = archive + ".tmp"
    with zipfile.ZipFile(tmp, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for dirpath, dirnames, filenames in os.walk(src_dir):
            dirnames.sort()
            for name in sorted(filenames):
                full = os.path.join(dirpath, name)
                arc = os.path.relpath(full, src_dir).replace(os.sep, "/")
                info = zipfile.ZipInfo(arc, date_time=FIXED_DATE)
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o644 << 16
                with open(full, "rb") as f:
                    zf.writestr(info, f.read(), compresslevel=9)
    os.replace(tmp, archive)


class Omni:
    """Both omni.ja archives of an application directory, unpacked."""

    def __init__(self, app_dir, work_dir):
        self.app_dir = app_dir
        self.gre_jar = os.path.join(app_dir, "omni.ja")
        self.browser_jar = os.path.join(app_dir, "browser", "omni.ja")
        self.gre = os.path.join(work_dir, "omni-gre")
        self.browser = os.path.join(work_dir, "omni-browser")
        for d in (self.gre, self.browser):
            if os.path.isdir(d):
                shutil.rmtree(d)

    def __enter__(self):
        unzip(self.gre_jar, self.gre)
        unzip(self.browser_jar, self.browser)
        return self

    def __exit__(self, exc_type, exc, tb):
        if exc_type is None:
            zip_dir(self.gre, self.gre_jar)
            zip_dir(self.browser, self.browser_jar)
        shutil.rmtree(self.gre, ignore_errors=True)
        shutil.rmtree(self.browser, ignore_errors=True)

    # ------------------------------------------------------------ locales

    def packaged_locales(self):
        path = os.path.join(self.gre, "res", "multilocale.txt")
        if not os.path.exists(path):
            return ["en-US"]
        with open(path, encoding="utf-8") as f:
            return [l.strip() for l in f.read().replace("\n", ",").split(",") if l.strip()]

    def set_packaged_locales(self, locales):
        path = os.path.join(self.gre, "res", "multilocale.txt")
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(",".join(locales))

    def merge_langpack(self, xpi):
        """Merges a Mozilla language pack into the omni.ja trees, exactly like
        a multi-locale build does."""
        with tempfile.TemporaryDirectory() as tmp:
            unzip(xpi, tmp)
            with open(os.path.join(tmp, "manifest.json"), encoding="utf-8") as f:
                manifest = json.load(f)
            locale = manifest["langpack_id"]
            languages = manifest.get("languages", {})
            lang = languages.get(locale) or next(iter(languages.values()))
            chrome_resources = lang.get("chrome_resources", {})

            # Fluent
            copied = 0
            for src, dst in (
                (os.path.join(tmp, "localization", locale), os.path.join(self.gre, "localization", locale)),
                (os.path.join(tmp, "browser", "localization", locale), os.path.join(self.browser, "localization", locale)),
            ):
                if os.path.isdir(src):
                    shutil.copytree(src, dst, dirs_exist_ok=True)
                    copied += 1
            if not copied:
                raise RuntimeError(f"{xpi}: no Fluent resources found")

            # Legacy chrome packages (DTD/properties)
            gre_lines, browser_lines = [], []
            for package, value in sorted(chrome_resources.items()):
                entries = value.items() if isinstance(value, dict) else [(None, value)]
                for os_key, path in entries:
                    flag = OS_FLAGS.get(os_key, "") if os_key else ""
                    path = path.rstrip("/") + "/"
                    if path.startswith("browser/chrome/"):
                        rel = path[len("browser/chrome/"):]
                        target_root, lines = self.browser, browser_lines
                    elif path.startswith("chrome/"):
                        rel = path[len("chrome/"):]
                        target_root, lines = self.gre, gre_lines
                    else:
                        log(f"{locale}: unexpected chrome path {path}", level="warn")
                        continue
                    src = os.path.join(tmp, path)
                    if os.path.isdir(src):
                        shutil.copytree(src, os.path.join(target_root, "chrome", rel), dirs_exist_ok=True)
                    lines.append(f"locale {package} {locale} {rel}{flag}")
            self._append_manifest(self.gre, gre_lines)
            self._append_manifest(self.browser, browser_lines)
        return locale

    @staticmethod
    def _append_manifest(root, lines):
        if not lines:
            return
        path = os.path.join(root, "chrome", "chrome.manifest")
        with open(path, encoding="utf-8") as f:
            existing = f.read()
        new = [l for l in lines if l not in existing]
        if new:
            with open(path, "a", encoding="utf-8") as f:
                if not existing.endswith("\n"):
                    f.write("\n")
                f.write("\n".join(new) + "\n")

    # ------------------------------------------------------------ branding

    def rebrand(self, branding_dir):
        """Replaces Firefox's names and logos with Lokum's."""
        count = 0
        loc_root = os.path.join(self.browser, "localization")
        for locale in os.listdir(loc_root):
            brand = os.path.join(loc_root, locale, "branding", "brand.ftl")
            if os.path.exists(brand):
                rewrite_brand_ftl(brand)
                count += 1
        chrome_root = os.path.join(self.browser, "chrome")
        for locale in os.listdir(chrome_root):
            props = os.path.join(chrome_root, locale, "locale", "branding", "brand.properties")
            if os.path.exists(props):
                rewrite_brand_properties(props)
            dtd = os.path.join(chrome_root, locale, "locale", "branding", "brand.dtd")
            if os.path.exists(dtd):
                rewrite_brand_dtd(dtd)
        target = os.path.join(self.browser, "chrome", "browser", "content", "branding")
        for name in os.listdir(branding_dir):
            shutil.copy(os.path.join(branding_dir, name), os.path.join(target, name))
        log(f"rebranded {count} locales", level="ok")


def rewrite_brand_ftl(path):
    with open(path, encoding="utf-8") as f:
        lines = f.read().splitlines()
    out = []
    for line in lines:
        m = re.match(r"^(-brand-[\w-]+)\s*=", line)
        if m:
            out.append(f"{m.group(1)} = {BRAND_NAME}")
        elif line.startswith("trademarkInfo"):
            out.append(f"trademarkInfo = {TRADEMARK}")
        elif re.match(r"^-vendor-short-name\s*=", line):
            out.append(line)  # Mozilla still provides Sync, accounts, add-ons.
        else:
            out.append(line.replace("Mozilla Firefox", BRAND_NAME).replace("Firefox", BRAND_NAME)
                       if not line.startswith("#") else line)
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")


def rewrite_brand_properties(path):
    with open(path, encoding="utf-8") as f:
        lines = f.read().splitlines()
    out = []
    for line in lines:
        m = re.match(r"^(brand\w*Name)\s*=", line)
        if m:
            out.append(f"{m.group(1)}={BRAND_NAME}")
        elif line.startswith("#"):
            out.append(line)
        else:
            out.append(line.replace("Mozilla Firefox", BRAND_NAME).replace("Firefox", BRAND_NAME))
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")


def rewrite_brand_dtd(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    text = re.sub(r'(<!ENTITY\s+brand\w*Name\s+")[^"]*(")', rf"\g<1>{BRAND_NAME}\g<2>", text)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def branding_source():
    return os.path.join(ROOT, "branding", "generated", "firefox-branding")
