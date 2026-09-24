"""Finding, downloading and verifying official Firefox releases."""
import os
import re
import tarfile
import urllib.parse

from .util import ROOT, download, fetch_json, log, read_json, run, sha512

ARCHIVE = "https://archive.mozilla.org/pub/firefox/releases"
PRODUCT_DETAILS = "https://product-details.mozilla.org/1.0/firefox_versions.json"

# Firefox locales bundled into Lokum (en-US is the base build).
LOCALES = ["tr", "de", "fr", "it", "rm", "es-ES", "sv-SE", "ko", "ja", "zh-CN", "zh-TW"]

PLATFORMS = {
    "win64": {"dir": "win64", "installer": "Firefox Setup {v}.exe"},
    "win-arm64": {"dir": "win64-aarch64", "installer": "Firefox Setup {v}.exe"},
    "linux-x86_64": {"dir": "linux-x86_64", "archives": ["firefox-{v}.tar.xz", "firefox-{v}.tar.bz2"]},
}


def resolve_version(explicit=None, channel="release"):
    """Returns the Firefox version to build against.

    Priority: explicit argument, firefox.json pin in the repo, the latest
    release published by Mozilla.
    """
    if explicit:
        return explicit
    pin = read_json(os.path.join(ROOT, "firefox.json"), {}) or {}
    if pin.get("version"):
        log(f"using pinned Firefox {pin['version']} from firefox.json")
        return pin["version"]
    data = fetch_json(PRODUCT_DETAILS)
    key = {"release": "LATEST_FIREFOX_VERSION", "esr": "FIREFOX_ESR"}[channel]
    version = data[key]
    log(f"latest Firefox ({channel}) is {version}")
    return version


def _quote(path):
    return urllib.parse.quote(path)


class FirefoxRelease:
    def __init__(self, version, platform, cache_dir):
        if platform not in PLATFORMS:
            raise SystemExit(f"unknown platform {platform}")
        self.version = version
        self.platform = platform
        self.info = PLATFORMS[platform]
        self.cache = os.path.join(cache_dir, "firefox", version)
        self._sums = None

    @property
    def base(self):
        return f"{ARCHIVE}/{self.version}"

    def sums(self):
        """Parses SHA512SUMS (path relative to the release dir -> hash)."""
        if self._sums is None:
            path = download(f"{self.base}/SHA512SUMS", os.path.join(self.cache, "SHA512SUMS"))
            sums = {}
            with open(path, encoding="utf-8") as f:
                for line in f:
                    parts = line.strip().split(None, 1)
                    if len(parts) == 2:
                        sums[parts[1].lstrip("*")] = parts[0]
            self._sums = sums
        return self._sums

    def fetch(self, relpath):
        """Downloads a file of the release and verifies it against SHA512SUMS."""
        dest = os.path.join(self.cache, relpath)
        download(f"{self.base}/{_quote(relpath)}", dest)
        expected = self.sums().get(relpath)
        if not expected:
            raise SystemExit(f"{relpath} is not listed in SHA512SUMS")
        actual = sha512(dest)
        if actual != expected:
            os.remove(dest)
            raise SystemExit(f"checksum mismatch for {relpath}")
        log(f"verified {relpath}", level="ok")
        return dest

    def fetch_app(self):
        d = self.info["dir"]
        if "installer" in self.info:
            return self.fetch(f"{d}/en-US/{self.info['installer'].format(v=self.version)}")
        for pattern in self.info["archives"]:
            rel = f"{d}/en-US/{pattern.format(v=self.version)}"
            if rel in self.sums():
                return self.fetch(rel)
        raise SystemExit(f"no Firefox archive found for {self.platform} {self.version}")

    def fetch_langpacks(self, locales=LOCALES):
        paths = {}
        for locale in locales:
            rel = f"{self.info['dir']}/xpi/{locale}.xpi"
            if rel not in self.sums():
                log(f"no language pack for {locale}; skipping", level="warn")
                continue
            paths[locale] = self.fetch(rel)
        return paths


def extract_app(archive, platform, dest):
    """Unpacks the official build so that `dest` is the application directory."""
    os.makedirs(dest, exist_ok=True)
    work = dest + ".extract"
    if os.path.isdir(work):
        import shutil
        shutil.rmtree(work)
    os.makedirs(work)
    if platform.startswith("win"):
        # The full installer is a 7-Zip SFX: setup.exe + core/.
        run(["7z", "x", "-y", f"-o{work}", archive], quiet=True)
        src = os.path.join(work, "core")
        if not os.path.isdir(src):
            src = work
    else:
        with tarfile.open(archive) as tar:
            try:
                tar.extractall(work, filter="tar")
            except TypeError:  # Python < 3.12
                tar.extractall(work)
        src = os.path.join(work, "firefox")
    import shutil
    for name in os.listdir(src):
        shutil.move(os.path.join(src, name), os.path.join(dest, name))
    shutil.rmtree(work)
    return dest


def detect_version(app_dir):
    """Reads the Firefox version of an unpacked build."""
    for name in ("application.ini", "platform.ini"):
        path = os.path.join(app_dir, name)
        if os.path.exists(path):
            with open(path, encoding="utf-8", errors="replace") as f:
                text = f.read()
            m = re.search(r"^(?:Version|Milestone)=(.+)$", text, re.M)
            if m:
                return m.group(1).strip()
    return "unknown"
