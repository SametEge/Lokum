/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Lokum preferences.
 *
 * All Lokum specific settings live under the "lokum." branch. They are
 * registered on the *default* branch at startup so that users only ever
 * store the values they changed, and so that "Reset" in the settings page is
 * simply a matter of clearing user values.
 */

export const LOKUM_DEFAULTS = Object.freeze({
  // Appearance ------------------------------------------------------------
  "lokum.flavor": "gul",
  "lokum.appearance": "auto", // auto | light | dark
  "lokum.accent.custom": "", // "" or a #rrggbb color overriding the flavor accent
  "lokum.sugarDust": true, // sparkling powdered-sugar particles in the frame
  "lokum.grain": true, // subtle paper grain over the frame gradient
  "lokum.animations": "full", // full | reduced | off
  "lokum.content.radius": 12,
  "lokum.content.margin": 8,
  "lokum.content.shadow": true,
  "lokum.density": "normal", // compact | normal | comfy
  "lokum.font.ui": "system", // system | rounded | serif

  // Layout ------------------------------------------------------------------
  "lokum.layout": "arc", // arc | vertical | horizontal
  "lokum.sidebar.position": "left", // left | right
  "lokum.compact": false, // auto-hide the sidebar / toolbars
  "lokum.floatingUrlbar": true, // centered command bar when the address bar is focused
  "lokum.tabs.closeButton": "hover", // hover | always | never
  "lokum.tabs.newTabPosition": "top", // top | bottom (vertical layouts)
  "lokum.mediaCard": true, // mini player for tabs playing audio

  // Spaces ------------------------------------------------------------------
  "lokum.spaces.enabled": true,
  "lokum.spaces.swipe": true, // horizontal scroll on the sidebar switches spaces
  "lokum.spaces.tintFrame": true, // each space recolors the window with its flavor

  // Tabs ----------------------------------------------------------------------
  "lokum.tabs.autoArchiveHours": 0, // 0 = never; 12, 24, 168, 720
  "lokum.tabs.sleepMinutes": 0, // 0 = never; unload background tabs after N minutes

  // Updates -------------------------------------------------------------------
  "lokum.update.enabled": true,
  "lokum.update.auto": true, // download silently and install when Lokum closes
  "lokum.update.channel": "stable", // stable | beta
  "lokum.update.intervalHours": 6,
  "lokum.update.lastCheck": 0,
  "lokum.update.manifestURL":
    "https://github.com/SametEge/Lokum/releases/latest/download/latest.json",
  "lokum.update.releasesAPI":
    "https://api.github.com/repos/SametEge/Lokum/releases?per_page=10",
  "lokum.update.skippedVersion": "",

  // First run & misc ----------------------------------------------------------
  "lokum.onboarding.done": false,
  "lokum.onboarding.version": 0,
  "lokum.lastVersion": "",
  "lokum.locale.initialized": false,
  "lokum.shortcuts.enabled": true,
  "lokum.install.applied": false, // installer choices (e.g. uBlock Origin) were applied
  "lokum.ublock.installedByLokum": false,
});

/**
 * Firefox preferences whose defaults Lokum changes. Users can still change
 * every one of them; nothing here is locked.
 */
export const FIREFOX_DEFAULTS = Object.freeze({
  // Lokum brings its own first-run experience, update flow and branding.
  "browser.aboutwelcome.enabled": false,
  "termsofuse.bypassNotification": true,
  "startup.homepage_welcome_url": "",
  "startup.homepage_welcome_url.additional": "",
  "startup.homepage_override_url": "",
  "browser.startup.homepage_override.mstone": "ignore",
  "browser.shell.checkDefaultBrowser": false,
  "browser.shell.didSkipDefaultBrowserCheckOnFirstRun": true,
  "browser.preferences.moreFromMozilla": false,
  "browser.aboutConfig.showWarning": false,
  "browser.disableResetPrompt": true,
  "app.releaseNotesURL": "https://github.com/SametEge/Lokum/releases",
  "app.releaseNotesURL.aboutDialog": "https://github.com/SametEge/Lokum/releases",
  "app.update.url.manual": "https://github.com/SametEge/Lokum/releases/latest",
  "app.update.url.details": "https://github.com/SametEge/Lokum/releases",
  "browser.nova.enabled": false,

  // Arc-like chrome: revamped sidebar, vertical tabs, tabs in the titlebar.
  "sidebar.revamp": true,
  "sidebar.verticalTabs": true,
  "sidebar.visibility": "always-show",
  "sidebar.new-sidebar.has-used": true,
  "sidebar.verticalTabs.dragToPinPromo.dismissed": true,
  "sidebar.main.tools": "history,bookmarks",
  "browser.tabs.inTitlebar": 1,
  "browser.toolbars.bookmarks.visibility": "never",
  "browser.compactmode.show": true,
  "browser.tabs.hoverPreview.enabled": true,
  "browser.tabs.hoverPreview.showThumbnails": true,
  "browser.tabs.groups.enabled": true,
  "browser.tabs.splitView.enabled": true,
  "browser.tabs.tabmanager.enabled": false,
  "browser.download.autohideButton": true,
  "browser.startup.page": 3, // restore the previous session, like Arc
  "browser.tabs.closeWindowWithLastTab": false,
  "toolkit.legacyUserProfileCustomizations.stylesheets": true,
  "layout.css.prefers-color-scheme.content-override": 2,
  "media.videocontrols.picture-in-picture.enable-when-switching-tabs.enabled": true,
  "general.smoothScroll.msdPhysics.enabled": true,
  "browser.tabs.loadBookmarksInTabs": false,

  // A calm, ad-free new tab page.
  "browser.newtabpage.activity-stream.showSponsored": false,
  "browser.newtabpage.activity-stream.showSponsoredTopSites": false,
  "browser.newtabpage.activity-stream.showSponsoredCheckboxes": false,
  "browser.newtabpage.activity-stream.feeds.section.topstories": false,
  "browser.newtabpage.activity-stream.feeds.snippets": false,
  "browser.newtabpage.activity-stream.section.highlights.includePocket": false,
  "browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons": false,
  "browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features": false,
  "browser.newtabpage.activity-stream.showWeather": false,
  "browser.newtabpage.activity-stream.logowordmark.alwaysVisible": false,
  "browser.urlbar.suggest.quicksuggest.sponsored": false,
  "browser.urlbar.suggest.quicksuggest.nonsponsored": false,
  "browser.urlbar.quicksuggest.enabled": false,
  "extensions.pocket.enabled": false,
  "browser.discovery.enabled": false,
  "extensions.getAddons.showPane": true,
  "extensions.htmlaboutaddons.recommendations.enabled": false,

  // Privacy: no telemetry, no studies, no crash uploads.
  "datareporting.healthreport.uploadEnabled": false,
  "datareporting.policy.dataSubmissionEnabled": false,
  "datareporting.usage.uploadEnabled": false,
  "toolkit.telemetry.enabled": false,
  "toolkit.telemetry.unified": false,
  "toolkit.telemetry.archive.enabled": false,
  "toolkit.telemetry.newProfilePing.enabled": false,
  "toolkit.telemetry.shutdownPingSender.enabled": false,
  "toolkit.telemetry.updatePing.enabled": false,
  "toolkit.telemetry.bhrPing.enabled": false,
  "toolkit.telemetry.firstShutdownPing.enabled": false,
  "toolkit.telemetry.reportingpolicy.firstRun": false,
  "app.shield.optoutstudies.enabled": false,
  "app.normandy.enabled": false,
  "messaging-system.rsexperimentloader.enabled": false,
  "browser.crashReports.unsubmittedCheck.enabled": false,
  "browser.crashReports.unsubmittedCheck.autoSubmit2": false,
  "browser.tabs.crashReporting.sendReport": false,
  "breakpad.reportURL": "",
  "browser.ping-centre.telemetry": false,
  "privacy.globalprivacycontrol.enabled": true,
  "privacy.globalprivacycontrol.functionality.enabled": true,
  "browser.contentblocking.category": "standard",
});

const PREF_TYPES = {
  boolean: "Bool",
  number: "Int",
  string: "String",
};

function setDefault(branch, name, value) {
  const type = PREF_TYPES[typeof value];
  if (!type) {
    throw new Error(`Unsupported pref type for ${name}`);
  }
  try {
    branch[`set${type}Pref`](name, value);
  } catch (ex) {
    // A pref with a different type already exists (e.g. changed upstream).
    // Never let one bad default break startup.
    console.warn(`Lokum: could not set default for ${name}`, ex);
  }
}

export const LokumPrefs = {
  applyDefaults() {
    const branch = Services.prefs.getDefaultBranch("");
    for (const [name, value] of Object.entries(LOKUM_DEFAULTS)) {
      setDefault(branch, name, value);
    }
    for (const [name, value] of Object.entries(FIREFOX_DEFAULTS)) {
      setDefault(branch, name, value);
    }
  },

  get(name, fallback = LOKUM_DEFAULTS[name]) {
    const prefs = Services.prefs;
    switch (prefs.getPrefType(name)) {
      case prefs.PREF_BOOL:
        return prefs.getBoolPref(name);
      case prefs.PREF_INT:
        return prefs.getIntPref(name);
      case prefs.PREF_STRING:
        return prefs.getStringPref(name);
      default:
        return fallback;
    }
  },

  set(name, value) {
    const prefs = Services.prefs;
    switch (typeof value) {
      case "boolean":
        prefs.setBoolPref(name, value);
        break;
      case "number":
        prefs.setIntPref(name, Math.round(value));
        break;
      default:
        prefs.setStringPref(name, String(value));
    }
  },

  reset(name) {
    Services.prefs.clearUserPref(name);
  },

  /** Clears every user-set lokum.* pref except bookkeeping ones. */
  resetAll() {
    const keep = new Set([
      "lokum.onboarding.done",
      "lokum.onboarding.version",
      "lokum.lastVersion",
      "lokum.locale.initialized",
      "lokum.update.lastCheck",
    ]);
    for (const name of Services.prefs.getChildList("lokum.")) {
      if (!keep.has(name)) {
        Services.prefs.clearUserPref(name);
      }
    }
  },

  /** Returns every user-changed lokum.* pref, used for settings export. */
  exportUserValues() {
    const out = {};
    for (const name of Services.prefs.getChildList("lokum.")) {
      if (Services.prefs.prefHasUserValue(name)) {
        out[name] = this.get(name);
      }
    }
    return out;
  },

  importUserValues(values) {
    for (const [name, value] of Object.entries(values || {})) {
      if (name.startsWith("lokum.") && name in LOKUM_DEFAULTS) {
        if (typeof value === typeof LOKUM_DEFAULTS[name]) {
          this.set(name, value);
        }
      }
    }
  },

  /**
   * Watches a pref (or a branch when name ends with ".") and returns a
   * function that stops watching.
   */
  observe(name, callback) {
    const observer = {
      observe(subject, topic, data) {
        callback(data);
      },
    };
    Services.prefs.addObserver(name, observer);
    return () => Services.prefs.removeObserver(name, observer);
  },
};
