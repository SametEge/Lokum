#!/usr/bin/env python3
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
"""Release helpers used by the GitHub workflows.

  release.py plan      decide whether to release and compute the next version
  release.py assemble  write latest.json, SHA256SUMS.txt and release notes
"""
import argparse
import datetime
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lokumbuild.util import ROOT, read_json, sha256  # noqa: E402

PRODUCT_DETAILS = "https://product-details.mozilla.org/1.0/firefox_versions.json"


def parse_version(v):
    core = str(v).lstrip("v").split("-")[0].split("+")[0]
    parts = [int(p) if p.isdigit() else 0 for p in core.split(".")]
    return tuple((parts + [0, 0, 0])[:3])


def fmt(parts):
    return ".".join(str(p) for p in parts)


def github(path, token=None):
    url = f"https://api.github.com{path}"
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "lokum-release"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as ex:
        if ex.code == 404:
            return None
        raise


def fetch_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "lokum-release"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.load(resp)


def set_output(name, value):
    out = os.environ.get("GITHUB_OUTPUT")
    line = f"{name}={value}"
    print(line)
    if out:
        with open(out, "a", encoding="utf-8") as f:
            f.write(line + "\n")


# ------------------------------------------------------------------ plan

def cmd_plan(args):
    repo = args.repo
    token = os.environ.get("GITHUB_TOKEN")
    base = read_json(os.path.join(ROOT, "version.json"), {}) or {}
    base_version = parse_version(base.get("version", "1.0.0"))

    latest = github(f"/repos/{repo}/releases/latest", token)
    latest_version = parse_version(latest["tag_name"]) if latest else None
    latest_firefox = ""
    if latest:
        m = re.search(r"<!--\s*firefox:([\d.]+[a-z0-9]*)\s*-->", latest.get("body") or "")
        if m:
            latest_firefox = m.group(1)

    pin = read_json(os.path.join(ROOT, "firefox.json"), {}) or {}
    if args.firefox_version:
        firefox = args.firefox_version
    elif pin.get("version"):
        firefox = pin["version"]
    else:
        firefox = fetch_json(PRODUCT_DETAILS)["LATEST_FIREFOX_VERSION"]

    event = args.event
    if event == "schedule":
        should = firefox != latest_firefox
        reason = f"Firefox {firefox} is new (last release used {latest_firefox or 'none'})" if should else \
            f"Firefox {firefox} already released"
    elif event == "workflow_dispatch":
        should = True
        reason = "manual release"
    else:
        should = True
        reason = f"new commits on {os.environ.get('GITHUB_REF_NAME', 'main')}"

    if latest_version is None or base_version > latest_version:
        version = base_version
    else:
        version = (latest_version[0], latest_version[1], latest_version[2] + 1)
    version = fmt(version)
    if args.prerelease:
        version = f"{version}-beta.{os.environ.get('GITHUB_RUN_NUMBER', '1')}"

    set_output("should_release", "true" if should else "false")
    set_output("version", version)
    set_output("firefox_version", firefox)
    set_output("previous_tag", latest["tag_name"] if latest else "")
    set_output("reason", reason)


# -------------------------------------------------------------- assemble

def git(*args):
    try:
        return subprocess.check_output(["git", *args], cwd=ROOT, stderr=subprocess.DEVNULL).decode().strip()
    except subprocess.CalledProcessError:
        return ""


def changelog(previous_tag):
    rng = f"{previous_tag}..HEAD" if previous_tag and git("rev-parse", "-q", "--verify", previous_tag) else "HEAD~30..HEAD"
    lines = git("log", rng, "--no-merges", "--pretty=format:%s (%h)").splitlines()
    lines = [l for l in lines if l and not l.lower().startswith(("chore(release)", "merge "))]
    return lines[:60]


def cmd_assemble(args):
    dist = args.dist
    repo = args.repo
    version = args.version
    tag = f"v{version}"
    base_url = f"https://github.com/{repo}/releases/download/{tag}"
    builds = []
    for name in sorted(os.listdir(dist)):
        if name.startswith("build-") and name.endswith(".json"):
            builds.append(read_json(os.path.join(dist, name)))
    if not builds:
        raise SystemExit("no build-*.json files found in " + dist)
    firefox = builds[0]["firefox"]

    assets = {}
    for build in builds:
        entry = assets.setdefault(build["platform"], {})
        for artifact in build["artifacts"]:
            entry[artifact["kind"]] = {
                "name": artifact["name"],
                "url": f"{base_url}/{artifact['name']}",
                "sha256": artifact["sha256"],
                "size": artifact["size"],
            }

    commits = changelog(args.previous_tag)
    notes_lines = []
    if args.reason:
        notes_lines.append(f"_{args.reason}_")
        notes_lines.append("")
    notes_lines.append(f"**Firefox {firefox}** · Lokum {version}")
    notes_lines.append("")
    if commits:
        notes_lines.append("### Changes")
        notes_lines += [f"- {c}" for c in commits]
    else:
        notes_lines.append("- Updated to the latest Firefox release with all of its security fixes.")
    short_notes = "\n".join(notes_lines)

    now = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    latest = {
        "version": version,
        "firefox": firefox,
        "date": now,
        "url": f"https://github.com/{repo}/releases/tag/{tag}",
        "notes": short_notes,
        "assets": assets,
    }
    with open(os.path.join(dist, "latest.json"), "w", encoding="utf-8") as f:
        json.dump(latest, f, indent=2, ensure_ascii=False)
        f.write("\n")

    sums = []
    for name in sorted(os.listdir(dist)):
        path = os.path.join(dist, name)
        if os.path.isfile(path) and not name.startswith("build-") and name != "SHA256SUMS.txt" and not name.endswith(".md"):
            sums.append(f"{sha256(path)}  {name}")
    with open(os.path.join(dist, "SHA256SUMS.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(sums) + "\n")

    win = assets.get("win64", {})
    setup = win.get("installer", {}).get("name", "")
    zip_name = win.get("archive", {}).get("name", "")
    linux = assets.get("linux-x86_64", {}).get("archive", {}).get("name", "")
    body = f"""<p align="center"><img src="https://raw.githubusercontent.com/{repo}/main/docs/images/banner.png" alt="Lokum" width="720"></p>

## 🍬 Lokum {version}

{short_notes}

### ⬇️ Download

| Platform | File |
| --- | --- |
| **Windows 10/11 (64-bit) — installer** | [{setup}]({base_url}/{setup}) |
| Windows (64-bit) — zip, no install | [{zip_name}]({base_url}/{zip_name}) |
| Linux (x86_64) — tarball | [{linux}]({base_url}/{linux}) |

**Windows:** run `{setup}`. Lokum installs for your user only (no admin rights) and updates itself automatically.
If SmartScreen says *"Windows protected your PC"*, click **More info → Run anyway** (Lokum is open source but not code-signed yet).

**Türkçe:** `{setup}` dosyasını indirip çalıştırın. Yönetici izni gerekmez; Lokum kendini otomatik günceller.
SmartScreen uyarısında **Ek bilgi → Yine de çalıştır**'a tıklayın.

### 🔐 Verify

SHA-256 checksums are in `SHA256SUMS.txt`. The built-in updater verifies every download against `latest.json` before installing it.

<!-- firefox:{firefox} -->
"""
    with open(os.path.join(dist, "RELEASE_NOTES.md"), "w", encoding="utf-8") as f:
        f.write(body)
    print(f"assembled release {tag}: {', '.join(sorted(assets))}")


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("plan")
    p.add_argument("--repo", default=os.environ.get("GITHUB_REPOSITORY", "SametEge/Lokum"))
    p.add_argument("--event", default=os.environ.get("GITHUB_EVENT_NAME", "push"))
    p.add_argument("--firefox-version", default="")
    p.add_argument("--prerelease", action="store_true")
    a = sub.add_parser("assemble")
    a.add_argument("--dist", default=os.path.join(ROOT, "dist"))
    a.add_argument("--repo", default=os.environ.get("GITHUB_REPOSITORY", "SametEge/Lokum"))
    a.add_argument("--version", required=True)
    a.add_argument("--previous-tag", default="")
    a.add_argument("--reason", default="")
    args = ap.parse_args()
    {"plan": cmd_plan, "assemble": cmd_assemble}[args.cmd](args)


if __name__ == "__main__":
    main()
