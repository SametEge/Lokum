"""Small helpers shared by the build steps."""
import hashlib
import json
import os
import shutil
import subprocess
import sys
import time
import urllib.request

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", ".."))

_COLORS = sys.stdout.isatty()


def log(message, *, level="info"):
    prefix = {"info": "🍬", "step": "▶", "warn": "⚠", "ok": "✓"}.get(level, "·")
    if _COLORS and level == "step":
        message = f"\033[1m{message}\033[0m"
    print(f"{prefix} {message}", flush=True)


def run(cmd, *, cwd=None, check=True, quiet=False, ok_codes=(0,)):
    if not quiet:
        log("$ " + " ".join(str(c) for c in cmd), level="·")
    proc = subprocess.run([str(c) for c in cmd], cwd=cwd,
                          stdout=subprocess.PIPE if quiet else None,
                          stderr=subprocess.STDOUT if quiet else None)
    if check and proc.returncode not in ok_codes:
        raise RuntimeError(f"command failed ({proc.returncode}): {' '.join(map(str, cmd))}")
    return proc.returncode


def which(tool):
    return shutil.which(tool)


def require(*tools):
    missing = [t for t in tools if not which(t)]
    if missing:
        raise SystemExit(f"Missing build tools: {', '.join(missing)}")


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def sha512(path):
    h = hashlib.sha512()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def download(url, dest, *, attempts=4):
    """Downloads url to dest (atomically), retrying with backoff."""
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return dest
    tmp = dest + ".part"
    delay = 2
    for attempt in range(1, attempts + 1):
        try:
            log(f"downloading {url}")
            req = urllib.request.Request(url, headers={"User-Agent": "lokum-build"})
            with urllib.request.urlopen(req, timeout=120) as resp, open(tmp, "wb") as out:
                shutil.copyfileobj(resp, out, 1 << 20)
            os.replace(tmp, dest)
            return dest
        except Exception as ex:  # noqa: BLE001 - retry any network failure
            if attempt == attempts:
                raise
            log(f"download failed ({ex}); retrying in {delay}s", level="warn")
            time.sleep(delay)
            delay *= 2
    return dest


def fetch_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "lokum-build", "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.load(resp)


def rmtree(path):
    if os.path.isdir(path):
        shutil.rmtree(path)
    elif os.path.exists(path):
        os.remove(path)


def copytree(src, dst):
    shutil.copytree(src, dst, dirs_exist_ok=True)


def read_json(path, default=None):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return default


def write_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
