/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Lokum's own strings (sidebar, settings, onboarding, updater...).
 *
 * Firefox's UI is localized by the language packs merged into omni.ja at
 * build time; Lokum's additions use small JSON dictionaries stored in
 * lokum/locales/<code>.json with English as the fallback.
 */

import { LokumPrefs } from "chrome://lokum/content/modules/LokumPrefs.sys.mjs";
import {
  LOKUM_LOCALES,
  formatTemplate as format,
  matchLokumLocale,
} from "chrome://lokum/content/modules/LokumCore.sys.mjs";

export { LOKUM_LOCALES, matchLokumLocale };

const FALLBACK = "en";
const cache = new Map();
const listeners = new Set();

function readDictionary(code) {
  if (cache.has(code)) {
    return cache.get(code);
  }
  let dict = {};
  try {
    dict = JSON.parse(
      Cu.readUTF8URI(
        Services.io.newURI(`chrome://lokum/content/locales/${code}.json`)
      )
    );
  } catch (ex) {
    if (code !== FALLBACK) {
      console.warn(`Lokum: missing dictionary for ${code}`, ex);
    }
  }
  cache.set(code, dict);
  return dict;
}

export const LokumI18n = {
  locales: LOKUM_LOCALES,

  /** The dictionary code matching Firefox's current UI language. */
  get locale() {
    return matchLokumLocale(Services.locale.appLocaleAsBCP47);
  },

  get dir() {
    return Services.locale.isAppLocaleRTL ? "rtl" : "ltr";
  },

  /** Returns a localized string, falling back to English, then to the key. */
  t(key, args, locale = this.locale) {
    const dict = readDictionary(locale);
    let value = dict[key];
    if (value === undefined && locale !== FALLBACK) {
      value = readDictionary(FALLBACK)[key];
    }
    if (value === undefined) {
      return key;
    }
    return format(value, args);
  },

  /** Plural helper: keys "<key>.one" / "<key>.other". */
  tp(key, count, args = {}, locale = this.locale) {
    const rule = new Intl.PluralRules(locale).select(count);
    const dict = readDictionary(locale);
    const pluralKey = dict[`${key}.${rule}`] !== undefined ? `${key}.${rule}` : `${key}.other`;
    return this.t(pluralKey, { count, ...args }, locale);
  },

  /** All strings for a locale merged over English; used by pages. */
  dictionary(locale = this.locale) {
    return { ...readDictionary(FALLBACK), ...readDictionary(locale) };
  },

  /**
   * Localizes a DOM subtree. Elements use:
   *   data-lk="key"                 -> textContent
   *   data-lk-attrs="title:key,..." -> attributes
   *   data-lk-args='{"n": 3}'       -> template arguments
   */
  localize(root, locale = this.locale) {
    const doc = root.ownerDocument || root;
    const nodes = root.querySelectorAll("[data-lk], [data-lk-attrs]");
    for (const node of nodes) {
      let args;
      if (node.dataset.lkArgs) {
        try {
          args = JSON.parse(node.dataset.lkArgs);
        } catch (ex) {}
      }
      if (node.dataset.lk) {
        node.textContent = this.t(node.dataset.lk, args, locale);
      }
      if (node.dataset.lkAttrs) {
        for (const pair of node.dataset.lkAttrs.split(",")) {
          const [attr, key] = pair.split(":").map(s => s.trim());
          if (attr && key) {
            node.setAttribute(attr, this.t(key, args, locale));
          }
        }
      }
    }
    if (doc.documentElement && root === doc) {
      doc.documentElement.lang = locale;
    }
  },

  /** Language names for the picker, only for locales Firefox can display. */
  availableUILocales() {
    const available = new Set(Services.locale.availableLocales);
    return LOKUM_LOCALES.filter(l => available.has(l.firefox));
  },

  /** Switches Firefox (and therefore Lokum) to the given dictionary code. */
  setUILocale(code) {
    const entry = LOKUM_LOCALES.find(l => l.code === code);
    if (!entry) {
      return false;
    }
    Services.locale.requestedLocales = [entry.firefox];
    return true;
  },

  /**
   * First launch: follow the language chosen in the installer, or else the
   * operating system language, if Lokum ships that language.
   */
  initAppLocale() {
    if (LokumPrefs.get("lokum.locale.initialized")) {
      return;
    }
    LokumPrefs.set("lokum.locale.initialized", true);
    if (Services.prefs.prefHasUserValue("intl.locale.requested")) {
      return; // The user already picked something.
    }

    const available = Services.locale.availableLocales;
    let wanted = [];
    const installerChoice = this._installerLocale();
    if (installerChoice) {
      wanted.push(installerChoice);
    }
    try {
      const os = Cc["@mozilla.org/intl/ospreferences;1"].getService(
        Ci.mozIOSPreferences
      );
      wanted.push(...os.systemLocales);
    } catch (ex) {}
    wanted = wanted.map(tag => {
      const code = matchLokumLocale(tag);
      const entry = LOKUM_LOCALES.find(l => l.code === code);
      return code === FALLBACK && !String(tag).toLowerCase().startsWith("en")
        ? tag
        : entry.firefox;
    });

    const negotiated = Services.locale.negotiateLanguages(
      wanted,
      available,
      Services.locale.defaultLocale,
      Services.locale.langNegStrategyLookup
    );
    const best = negotiated[0];
    if (best && best !== Services.locale.appLocaleAsBCP47) {
      Services.locale.requestedLocales = [best];
    }
  },

  _installerLocale() {
    try {
      const file = Services.dirsvc.get("GreD", Ci.nsIFile);
      file.append("distribution");
      file.append("lokum-install.json");
      if (file.exists()) {
        return JSON.parse(Cu.readUTF8File(file)).locale || null;
      }
    } catch (ex) {}
    return null;
  },

  onChange(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  _notify() {
    for (const cb of listeners) {
      try {
        cb(this.locale);
      } catch (ex) {
        console.error(ex);
      }
    }
  },
};

Services.obs.addObserver(() => LokumI18n._notify(), "intl:app-locales-changed");
