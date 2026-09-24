// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// Unit tests for Lokum's pure helpers. Run with: node --test tests/unit/
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  compareVersions,
  contrastRatio,
  fold,
  formatTemplate,
  fuzzyScore,
  isHexColor,
  matchLokumLocale,
} from "../../src/lokum/modules/LokumCore.sys.mjs";

test("compareVersions orders releases", () => {
  assert.equal(compareVersions("1.2.10", "1.2.9"), 1);
  assert.equal(compareVersions("1.2.9", "1.2.10"), -1);
  assert.equal(compareVersions("v1.0.0", "1.0.0"), 0);
  assert.equal(compareVersions("1.0", "1.0.0"), 0);
  assert.equal(compareVersions("2.0.0", "1.99.99"), 1);
});

test("compareVersions handles pre-releases", () => {
  assert.equal(compareVersions("1.0.0", "1.0.0-beta.1"), 1);
  assert.equal(compareVersions("1.0.0-beta.2", "1.0.0-beta.10"), -1);
  assert.equal(compareVersions("1.0.1-beta.1", "1.0.0"), 1);
  assert.equal(compareVersions("1.0.0-ci.5", "1.0.0-ci.5"), 0);
  assert.equal(compareVersions("0.0.0-dev", "1.0.0"), -1);
});

test("fold normalizes Turkish and accents", () => {
  assert.equal(fold("İSTANBUL"), "istanbul");
  assert.equal(fold("Işık"), "isik");
  assert.equal(fold("Crème Brûlée"), "creme brulee");
});

test("fuzzyScore ranks direct and prefix matches first", () => {
  const prefix = fuzzyScore("set", "Settings");
  const inner = fuzzyScore("set", "Reset zoom");
  const loose = fuzzyScore("stg", "Settings");
  assert.ok(prefix > inner, "prefix beats inner match");
  assert.ok(inner > loose, "substring beats subsequence");
  assert.equal(fuzzyScore("xyz", "Settings"), -1);
  assert.ok(fuzzyScore("ayar", "Lokum Ayarları") > 0);
  assert.ok(fuzzyScore("yeni sekme", "Yeni sekme") > 0);
});

test("matchLokumLocale maps tags to dictionaries", () => {
  assert.equal(matchLokumLocale("tr-TR"), "tr");
  assert.equal(matchLokumLocale("de-CH"), "de");
  assert.equal(matchLokumLocale("gsw"), "de");
  assert.equal(matchLokumLocale("rm"), "rm");
  assert.equal(matchLokumLocale("es-MX"), "es");
  assert.equal(matchLokumLocale("sv-SE"), "sv");
  assert.equal(matchLokumLocale("zh-Hant-TW"), "zh-TW");
  assert.equal(matchLokumLocale("zh-HK"), "zh-TW");
  assert.equal(matchLokumLocale("zh-CN"), "zh-CN");
  assert.equal(matchLokumLocale("ja-JP"), "ja");
  assert.equal(matchLokumLocale("pt-BR"), "en");
  assert.equal(matchLokumLocale(""), "en");
});

test("formatTemplate fills placeholders", () => {
  assert.equal(formatTemplate("Lokum {version}", { version: "1.2.3" }), "Lokum 1.2.3");
  assert.equal(formatTemplate("{a} {b}", { a: 1 }), "1 {b}");
  assert.equal(formatTemplate("plain", null), "plain");
});

test("colors", () => {
  assert.ok(isHexColor("#d23c78"));
  assert.ok(!isHexColor("red"));
  assert.ok(contrastRatio("#ffffff", "#000000") > 20);
});
