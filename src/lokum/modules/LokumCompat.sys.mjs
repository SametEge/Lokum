/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Firefox moves its internal modules around between releases (for example
 * from resource:///modules/ to moz-src:///). Lokum follows Firefox releases
 * automatically, so every Firefox module is imported through this table of
 * known locations instead of a single hard-coded URL.
 */

const LOCATIONS = {
  AddonManager: ["resource://gre/modules/AddonManager.sys.mjs"],
  BrowserWindowTracker: [
    "resource:///modules/BrowserWindowTracker.sys.mjs",
    "moz-src:///browser/components/BrowserWindowTracker.sys.mjs",
  ],
  ContextualIdentityService: [
    "moz-src:///toolkit/components/contextualidentity/ContextualIdentityService.sys.mjs",
    "resource://gre/modules/ContextualIdentityService.sys.mjs",
  ],
  CustomizableUI: [
    "moz-src:///browser/components/customizableui/CustomizableUI.sys.mjs",
    "resource:///modules/CustomizableUI.sys.mjs",
  ],
  MigrationUtils: [
    "resource:///modules/MigrationUtils.sys.mjs",
    "moz-src:///browser/components/migration/MigrationUtils.sys.mjs",
  ],
  PrivateBrowsingUtils: ["resource://gre/modules/PrivateBrowsingUtils.sys.mjs"],
  SessionStore: [
    "moz-src:///browser/components/sessionstore/SessionStore.sys.mjs",
    "resource:///modules/sessionstore/SessionStore.sys.mjs",
  ],
  ShellService: [
    "moz-src:///browser/components/shell/ShellService.sys.mjs",
    "resource:///modules/ShellService.sys.mjs",
  ],
  SearchService: [
    "moz-src:///toolkit/components/search/SearchService.sys.mjs",
    "resource://gre/modules/SearchService.sys.mjs",
  ],
};

const cache = new Map();

export function importFirefoxModule(name) {
  if (cache.has(name)) {
    return cache.get(name);
  }
  const urls = LOCATIONS[name] || [];
  let lastError = null;
  for (const url of urls) {
    try {
      const module = ChromeUtils.importESModule(url);
      if (module[name]) {
        cache.set(name, module[name]);
        return module[name];
      }
    } catch (ex) {
      lastError = ex;
    }
  }
  throw new Error(`Lokum: could not import ${name}: ${lastError}`);
}

/** Defines lazy getters on `target` for Firefox modules, like defineESModuleGetters. */
export function defineFirefoxModuleGetters(target, names) {
  for (const name of names) {
    Object.defineProperty(target, name, {
      configurable: true,
      enumerable: true,
      get() {
        const value = importFirefoxModule(name);
        Object.defineProperty(target, name, { value, enumerable: true });
        return value;
      },
    });
  }
}

export const LokumCompat = {
  importFirefoxModule,
  defineFirefoxModuleGetters,
  locations: LOCATIONS,
};
