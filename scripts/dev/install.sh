#!/usr/bin/env bash
# Copies the Lokum layer into an unpacked Firefox directory for development.
# usage: scripts/dev/install.sh /path/to/firefox
set -euo pipefail
FF="${1:?firefox directory}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
rm -f "$FF/defaults/pref/autoconfig.js" "$FF/mozilla.cfg"
cp -r "$ROOT/src/app/." "$FF/"
rm -rf "$FF/lokum" "$FF/browser/lokum"
cp -r "$ROOT/src/lokum" "$FF/browser/lokum"
echo "Lokum layer installed into $FF"
