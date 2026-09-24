#!/usr/bin/env python3
"""Checks Lokum's locale dictionaries against English.

Fails when a dictionary is missing, has keys that English does not have,
or uses different {placeholders} than English. Missing translations are
reported (English is used as fallback at runtime).
"""
import json
import os
import re
import sys

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
LOCALES = os.path.join(ROOT, "src", "lokum", "locales")
EXPECTED = ["en", "tr", "de", "fr", "it", "rm", "es", "sv", "ko", "ja", "zh-CN", "zh-TW"]
PLACEHOLDER = re.compile(r"\{(\w+)\}")


def load(code):
    with open(os.path.join(LOCALES, f"{code}.json"), encoding="utf-8") as f:
        return json.load(f)


def main():
    en = load("en")
    errors = 0
    for code in EXPECTED:
        path = os.path.join(LOCALES, f"{code}.json")
        if not os.path.exists(path):
            print(f"✗ {code}: dictionary missing")
            errors += 1
            continue
        data = load(code)
        extra = sorted(set(data) - set(en))
        missing = sorted(set(en) - set(data))
        bad = []
        for key, value in data.items():
            if key in en and set(PLACEHOLDER.findall(value)) != set(PLACEHOLDER.findall(en[key])):
                bad.append(key)
        status = "✓" if not (extra or bad) else "✗"
        print(f"{status} {code}: {len(data)}/{len(en)} strings"
              + (f", {len(missing)} untranslated" if missing else "")
              + (f", extra keys: {extra[:5]}" if extra else "")
              + (f", placeholder mismatch: {bad[:5]}" if bad else ""))
        if extra or bad:
            errors += 1
        if missing and "--strict" in sys.argv:
            print("  missing: " + ", ".join(missing[:20]))
            errors += 1
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
