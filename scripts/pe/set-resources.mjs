// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/**
 * Rebrands a Windows executable: replaces every icon group with Lokum's
 * icons and rewrites the version information strings.
 *
 * usage: node set-resources.mjs <exe> --icon lokum.ico [--doc-icon doc.ico]
 *          --version 1.2.3 --firefox 156.0 [--name Lokum] [--file lokum.exe]
 */

import fs from "node:fs";
import * as PE from "pe-library";
import * as ResEdit from "resedit";

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      args[a.slice(2)] = argv[i + 1];
      i++;
    } else {
      args._.push(a);
    }
  }
  return args;
}

function numericVersion(v) {
  const parts = String(v).split(/[.\-+]/).map(n => parseInt(n, 10)).filter(n => !Number.isNaN(n));
  while (parts.length < 4) {
    parts.push(0);
  }
  return parts.slice(0, 4);
}

const args = parseArgs(process.argv.slice(2));
const exePath = args._[0];
if (!exePath || !args.icon) {
  console.error("usage: set-resources.mjs <exe> --icon file.ico [--doc-icon file.ico] --version x.y.z --firefox x.y");
  process.exit(2);
}

const exe = PE.NtExecutable.from(fs.readFileSync(exePath), { ignoreCert: true });
const res = PE.NtExecutableResource.from(exe);

// --- Icons -----------------------------------------------------------------
const appIcon = ResEdit.Data.IconFile.from(fs.readFileSync(args.icon));
const docIcon = args["doc-icon"] ? ResEdit.Data.IconFile.from(fs.readFileSync(args["doc-icon"])) : appIcon;
const groups = ResEdit.Resource.IconGroupEntry.fromEntries(res.entries);
if (!groups.length) {
  throw new Error("No icon groups found in " + exePath);
}
// The first icon group is the application icon; later ones are document and
// private-browsing icons. All of them become Lokum icons.
const sortedIds = [...new Set(groups.map(g => g.id))].sort((a, b) => {
  const na = typeof a === "number" ? a : Number.MAX_SAFE_INTEGER;
  const nb = typeof b === "number" ? b : Number.MAX_SAFE_INTEGER;
  return na - nb;
});
groups.forEach(group => {
  const icon = group.id === sortedIds[0] ? appIcon : docIcon;
  ResEdit.Resource.IconGroupEntry.replaceIconsForResource(
    res.entries,
    group.id,
    group.lang,
    icon.icons.map(item => item.data)
  );
});

// --- Version info -------------------------------------------------------------
const name = args.name || "Lokum";
const version = args.version || "0.0.0";
const firefox = args.firefox || "";
const [maj, min, mic, rev] = numericVersion(version);
const infos = ResEdit.Resource.VersionInfo.fromEntries(res.entries);
const vi = infos[0] || ResEdit.Resource.VersionInfo.createEmpty();
const languages = vi.getAvailableLanguages();
if (!languages.length) {
  languages.push({ lang: 1033, codepage: 1200 });
}
const strings = {
  CompanyName: "Lokum Project",
  FileDescription: name,
  ProductName: name,
  InternalName: name.toLowerCase(),
  OriginalFilename: args.file || "lokum.exe",
  LegalCopyright: `Lokum contributors. Built on Mozilla Firefox ${firefox}. MPL 2.0.`,
  Comments: "Lokum — a Turkish-delight flavored browser based on Firefox.",
  FileVersion: version,
  ProductVersion: version,
};
for (const lang of languages) {
  vi.setStringValues(lang, strings);
  for (const key of ["LegalTrademarks", "BuildID", "PrivateBuild", "SpecialBuild"]) {
    try {
      vi.removeStringValue(lang, key, false);
    } catch (ex) {
      // Not present.
    }
  }
}
vi.setFileVersion(maj, min, mic, rev);
vi.setProductVersion(maj, min, mic, rev);
vi.outputToResourceEntries(res.entries);

res.outputResource(exe);
fs.writeFileSync(exePath, Buffer.from(exe.generate()));
console.log(`rebranded ${exePath}: ${groups.length} icon group(s), version ${version}`);
