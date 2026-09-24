/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Build information written by scripts/build.py into lokum/version.json.
 */

import { compareVersions } from "chrome://lokum/content/modules/LokumCore.sys.mjs";

const FALLBACK = {
  version: "0.0.0-dev",
  firefox: "",
  channel: "dev",
  buildDate: "",
  commit: "",
  repo: "SametEge/Lokum",
  platform: "",
};

let cached = null;

function load() {
  if (cached) {
    return cached;
  }
  let data = {};
  try {
    data = JSON.parse(
      Cu.readUTF8URI(Services.io.newURI("chrome://lokum/content/version.json"))
    );
  } catch (ex) {
    // Development checkouts don't have a generated version.json.
  }
  cached = Object.freeze({ ...FALLBACK, ...data });
  return cached;
}

export { compareVersions };

export const LokumVersion = {
  get info() {
    return load();
  },
  get version() {
    return load().version;
  },
  get firefox() {
    return load().firefox || Services.appinfo.version;
  },
  get repo() {
    return load().repo;
  },
  get isDevBuild() {
    return load().channel === "dev";
  },
  compare: compareVersions,
};
