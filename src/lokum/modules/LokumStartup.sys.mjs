/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Entry point of Lokum. Called from lokum.cfg (autoconfig) very early during
 * startup, before any window exists and before the profile's user prefs have
 * been read.
 */

import { LokumPrefs } from "chrome://lokum/content/modules/LokumPrefs.sys.mjs";

const lazy = {};
ChromeUtils.defineESModuleGetters(lazy, {
  LokumAboutPages: "chrome://lokum/content/modules/LokumAboutPages.sys.mjs",
  LokumContentStyles: "chrome://lokum/content/modules/LokumContentStyles.sys.mjs",
  LokumI18n: "chrome://lokum/content/modules/LokumI18n.sys.mjs",
  LokumLayout: "chrome://lokum/content/modules/LokumLayout.sys.mjs",
  LokumSelfTest: "chrome://lokum/content/modules/LokumSelfTest.sys.mjs",
  LokumShell: "chrome://lokum/content/modules/LokumShell.sys.mjs",
  LokumSpaces: "chrome://lokum/content/modules/LokumSpaces.sys.mjs",
  LokumTabs: "chrome://lokum/content/modules/LokumTabs.sys.mjs",
  LokumUpdater: "chrome://lokum/content/modules/LokumUpdater.sys.mjs",
  LokumVersion: "chrome://lokum/content/modules/LokumVersion.sys.mjs",
  LokumWindow: "chrome://lokum/content/modules/LokumWindow.sys.mjs",
});

const BROWSER_URL = "chrome://browser/content/browser.xhtml";

function safely(label, fn) {
  try {
    return fn();
  } catch (ex) {
    console.error(`Lokum: ${label} failed`, ex);
    return undefined;
  }
}

export const LokumStartup = {
  _initialized: false,
  _firstWindowSeen: false,

  init() {
    if (this._initialized) {
      return;
    }
    this._initialized = true;

    safely("defaults", () => LokumPrefs.applyDefaults());
    safely("about pages", () => lazy.LokumAboutPages.register());

    Services.obs.addObserver(this, "profile-after-change");
    Services.obs.addObserver(this, "final-ui-startup");
    Services.obs.addObserver(this, "chrome-document-global-created");
    Services.obs.addObserver(this, "browser-delayed-startup-finished");
    Services.obs.addObserver(this, "quit-application");
  },

  observe(subject, topic, data) {
    switch (topic) {
      case "profile-after-change":
        // User prefs are available from here on.
        safely("migrate", () => this._migrate());
        break;

      case "final-ui-startup":
        safely("locale", () => lazy.LokumI18n.initAppLocale());
        safely("layout prefs", () => lazy.LokumLayout.syncFirefoxPrefs());
        safely("content styles", () => lazy.LokumContentStyles.register());
        safely("shell", () => lazy.LokumShell.init());
        break;

      case "chrome-document-global-created":
        this._onChromeWindowCreated(subject);
        break;

      case "browser-delayed-startup-finished":
        safely("window", () => lazy.LokumWindow.init(subject));
        if (!this._firstWindowSeen) {
          this._firstWindowSeen = true;
          safely("first window", () => this._onFirstWindow(subject));
        }
        break;

      case "quit-application":
        safely("updater quit", () => lazy.LokumUpdater.onQuit(data));
        safely("spaces flush", () => lazy.LokumSpaces.flush());
        break;
    }
  },

  _onChromeWindowCreated(win) {
    win.addEventListener(
      "DOMContentLoaded",
      () => {
        if (win.location.href === BROWSER_URL) {
          safely("early window", () => lazy.LokumWindow.earlyInit(win));
        }
      },
      { once: true }
    );
  },

  _onFirstWindow(win) {
    lazy.LokumSpaces.init();
    lazy.LokumTabs.init();
    lazy.LokumUpdater.init();

    const selfTestOutput = Services.env.get("LOKUM_SELFTEST");
    if (selfTestOutput) {
      lazy.LokumSelfTest.run(win, selfTestOutput);
      return;
    }

    if (!LokumPrefs.get("lokum.onboarding.done")) {
      lazy.LokumWindow.showOnboarding(win);
    } else {
      this._maybeShowWhatsNew(win);
    }
  },

  _maybeShowWhatsNew(win) {
    const current = lazy.LokumVersion.version;
    const last = LokumPrefs.get("lokum.lastVersion");
    LokumPrefs.set("lokum.lastVersion", current);
    if (last && last !== current) {
      lazy.LokumWindow.showUpdatedToast(win, last, current);
    }
  },

  _migrate() {
    // First launch of this profile with Lokum: remember the version so that
    // the "updated" toast only appears after real updates.
    if (!LokumPrefs.get("lokum.lastVersion")) {
      LokumPrefs.set("lokum.lastVersion", lazy.LokumVersion.version);
    }
  },
};
