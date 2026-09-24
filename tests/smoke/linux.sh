#!/usr/bin/env bash
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Unpacks the Linux tarball and runs Lokum's self-test headless.
# usage: tests/smoke/linux.sh dist/Lokum-x.y.z-linux-x86_64.tar.xz
set -euo pipefail
ARCHIVE="${1:?tarball}"
WORK="$(mktemp -d)"
tar -xJf "$ARCHIVE" -C "$WORK"
APP="$WORK/lokum"
test -x "$APP/lokum"
test -f "$APP/browser/lokum/chrome.manifest"
mkdir -p "$WORK/profile"
export LOKUM_SELFTEST="$WORK/selftest.json"
export MOZ_CRASHREPORTER_DISABLE=1
timeout 240 "$APP/lokum" --headless --no-remote --profile "$WORK/profile" || true
python3 - "$LOKUM_SELFTEST" <<'PY'
import json, sys
report = json.load(open(sys.argv[1]))
failed = [r for r in report["results"] if not r["ok"]]
for r in report["results"]:
    print(("  ✓ " if r["ok"] else "  ✗ ") + r["name"] + ("" if r["ok"] else f"  {r.get('detail', '')}"))
print(f"  Firefox {report['firefox']}, locale {report['locale']}, Lokum {report['lokum']['version']}")
sys.exit(1 if failed else 0)
PY
echo "All Linux smoke checks passed 🍬"
