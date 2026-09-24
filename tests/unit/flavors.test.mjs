// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// Checks that every flavor is complete and readable: the accent must be
// legible on the accent text color and the text on the frame.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contrastRatio } from "../../src/lokum/modules/LokumCore.sys.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(here, "../../src/lokum/modules/LokumFlavors.sys.mjs"), "utf8");
const dataBlock = source.slice(source.indexOf("const FLAVOR_DATA = {"), source.indexOf("export const FLAVOR_IDS"));
// Evaluate the plain data literal without the chrome:// imports.
const FLAVOR_DATA = new Function(`${dataBlock.replace("const FLAVOR_DATA =", "return")}`)();

const en = JSON.parse(fs.readFileSync(path.join(here, "../../src/lokum/locales/en.json"), "utf8"));

test("there are twelve flavors", () => {
  assert.equal(Object.keys(FLAVOR_DATA).length, 12);
});

for (const [id, f] of Object.entries(FLAVOR_DATA)) {
  test(`flavor ${id} is complete and readable`, () => {
    for (const key of ["frame", "accent", "accentText", "text", "muted", "cube"]) {
      assert.ok(f[key], `${id}.${key} missing`);
    }
    assert.equal(f.frame.length, 3);
    for (const scheme of [0, 1]) {
      const bg = f.frame[1][scheme];
      assert.ok(contrastRatio(f.text[scheme], bg) >= 4.5, `${id} text contrast (${scheme ? "dark" : "light"})`);
      assert.ok(contrastRatio(f.accentText[scheme], f.accent[scheme]) >= 3, `${id} accent contrast (${scheme ? "dark" : "light"})`);
    }
    assert.ok(en[`flavor.${id}`], `flavor.${id} string`);
    assert.ok(en[`flavor.${id}.desc`], `flavor.${id}.desc string`);
  });
}
