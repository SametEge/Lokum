/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Operating system integration.
 *
 * On Windows the Lokum installer registers its own ProgIDs (LokumHTML /
 * LokumURL) instead of Firefox's, so "Make default" must open the Windows
 * "Default apps" page for Lokum rather than running Firefox's helper.exe.
 * We also record the profile path so the uninstaller can offer to remove
 * browsing data.
 */

import { defineFirefoxModuleGetters } from "chrome://lokum/content/modules/LokumCompat.sys.mjs";

const lazy = {};
defineFirefoxModuleGetters(lazy, ["ShellService"]);

const REG_KEY = "Software\\Lokum";

function isWindows() {
  return Services.appinfo.OS === "WINNT";
}

function writeRegistry(name, value) {
  const key = Cc["@mozilla.org/windows-registry-key;1"].createInstance(Ci.nsIWindowsRegKey);
  key.create(key.ROOT_KEY_CURRENT_USER, REG_KEY, key.ACCESS_WRITE);
  try {
    key.writeStringValue(name, value);
  } finally {
    key.close();
  }
}

function openDefaultAppsSettings() {
  const uri = Services.io.newURI("ms-settings:defaultapps?registeredAppUser=Lokum");
  Cc["@mozilla.org/uriloader/external-protocol-service;1"]
    .getService(Ci.nsIExternalProtocolService)
    .loadURI(uri, Services.scriptSecurityManager.getSystemPrincipal());
}

export const LokumShell = {
  init() {
    if (!isWindows()) {
      return;
    }
    try {
      writeRegistry("ProfilePath", PathUtils.profileDir);
      writeRegistry("LocalProfilePath", PathUtils.localProfileDir);
    } catch (ex) {
      console.warn("Lokum: could not record profile path", ex);
    }
    this._patchShellService();
  },

  _patchShellService() {
    let shell;
    try {
      shell = lazy.ShellService;
    } catch (ex) {
      return;
    }
    if (!shell || shell.__lokumPatched) {
      return;
    }
    shell.__lokumPatched = true;
    const original = shell.setDefaultBrowser?.bind(shell);
    shell.setDefaultBrowser = async function () {
      try {
        openDefaultAppsSettings();
      } catch (ex) {
        console.error("Lokum: could not open default apps settings", ex);
        return original?.(...arguments);
      }
      return undefined;
    };
  },

  isDefaultBrowser() {
    try {
      return lazy.ShellService.isDefaultBrowser(false, false);
    } catch (ex) {
      return false;
    }
  },

  setAsDefault() {
    if (isWindows()) {
      openDefaultAppsSettings();
      return;
    }
    try {
      lazy.ShellService.setDefaultBrowser(false);
    } catch (ex) {
      console.error(ex);
    }
  },
};
