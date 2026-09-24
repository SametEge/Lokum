/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Smoke test used by CI. When Lokum starts with LOKUM_SELFTEST=<file>, it
 * exercises its main features in the first window, writes a JSON report to
 * <file> and quits. The release workflow refuses to publish a build whose
 * report contains failures.
 */

import { LokumPrefs } from "chrome://lokum/content/modules/LokumPrefs.sys.mjs";

const lazy = {};
ChromeUtils.defineESModuleGetters(lazy, {
  LokumFlavors: "chrome://lokum/content/modules/LokumFlavors.sys.mjs",
  LokumI18n: "chrome://lokum/content/modules/LokumI18n.sys.mjs",
  LokumLayout: "chrome://lokum/content/modules/LokumLayout.sys.mjs",
  LokumSpaces: "chrome://lokum/content/modules/LokumSpaces.sys.mjs",
  LokumUpdater: "chrome://lokum/content/modules/LokumUpdater.sys.mjs",
  LokumVersion: "chrome://lokum/content/modules/LokumVersion.sys.mjs",
  LokumCommandPalette: "chrome://lokum/content/modules/LokumCommandPalette.sys.mjs",
});

const EXPECTED_LOCALES = ["en-US", "tr", "de", "fr", "it", "rm", "es-ES", "sv-SE", "ko", "ja", "zh-CN", "zh-TW"];

function wait(win, ms) {
  return new Promise(resolve => win.setTimeout(resolve, ms));
}

async function waitFor(win, predicate, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      if (predicate()) {
        return true;
      }
    } catch (ex) {}
    await wait(win, 100);
  }
  return false;
}

async function brandName() {
  const l10n = new Localization(["branding/brand.ftl", "browser/browser.ftl"], false);
  // A message that embeds -brand-short-name.
  const [msg] = await l10n.formatValues([{ id: "browser-main-window-default-title" }]);
  return msg || "";
}

export const LokumSelfTest = {
  async run(win, outputPath) {
    const results = [];
    const check = async (name, fn) => {
      try {
        // A check passes by returning true; anything else (false or a
        // string describing the problem) is a failure.
        const value = await fn();
        const ok = value === true;
        results.push({ name, ok, detail: ok ? undefined : String(value) });
      } catch (ex) {
        results.push({ name, ok: false, detail: String(ex && (ex.stack || ex)) });
      }
    };
    const doc = win.document;
    const root = doc.documentElement;

    await wait(win, 1500);

    await check("lokum root attribute", () => root.hasAttribute("lokum"));
    await check("controller attached", () => !!win.__lokum);
    await check("chrome package", () => {
      const reg = Cc["@mozilla.org/chrome/chrome-registry;1"].getService(Ci.nsIChromeRegistry);
      return !!reg.convertChromeURL(Services.io.newURI("chrome://lokum/content/modules/LokumStartup.sys.mjs"));
    });
    await check("stylesheet applied", () => {
      const value = win.getComputedStyle(root).getPropertyValue("--lk-frame-gradient");
      return value.includes("gradient") || `missing: ${value}`;
    });
    await check("flavor variables", () => {
      const accent = win.getComputedStyle(root).getPropertyValue("--lk-accent").trim();
      return (!!accent && accent !== "") || "no accent";
    });
    await check("layout arc", () => {
      lazy.LokumLayout.set("arc");
      return root.getAttribute("lokum-layout") === "arc";
    });
    await check("vertical tabs enabled", async () => {
      await waitFor(win, () => Services.prefs.getBoolPref("sidebar.verticalTabs"));
      return Services.prefs.getBoolPref("sidebar.verticalTabs");
    });
    await check("sidebar footer", () => !!doc.getElementById("lokum-sidebar-footer"));
    await check("space header", () => !!doc.getElementById("lokum-space-header"));
    await check("title strip", () => !!doc.getElementById("lokum-titlestrip"));
    await check("urlbar exists", () => !!doc.getElementById("urlbar"));
    await check("toolbox inside sidebar (arc)", () => {
      const toolbox = doc.getElementById("navigator-toolbox").getBoundingClientRect();
      const sidebar = doc.getElementById("sidebar-container").getBoundingClientRect();
      return (toolbox.width <= sidebar.width + 2 && Math.abs(toolbox.left - sidebar.left) < 2) ||
        `toolbox ${toolbox.left},${toolbox.width} sidebar ${sidebar.left},${sidebar.width}`;
    });
    await check("content card rounded", () => {
      const container = doc.querySelector("#tabbrowser-tabpanels .browserContainer");
      const radius = parseFloat(win.getComputedStyle(container).borderTopLeftRadius);
      return radius > 0 || `radius ${radius}`;
    });

    await check("spaces create/switch/delete", async () => {
      const gBrowser = win.gBrowser;
      const before = lazy.LokumSpaces.spaces.length;
      const firstTab = gBrowser.selectedTab;
      const space = lazy.LokumSpaces.create({ name: "Test", icon: "🧪", flavor: "fistik" });
      lazy.LokumSpaces.switchTo(win, space.id);
      await wait(win, 300);
      const inNewSpace = !firstTab.selected && firstTab.hidden;
      lazy.LokumSpaces.switchTo(win, lazy.LokumSpaces.spaces[0].id);
      await wait(win, 300);
      const back = !firstTab.hidden;
      lazy.LokumSpaces.remove(space.id);
      await wait(win, 200);
      const after = lazy.LokumSpaces.spaces.length;
      return (inNewSpace && back && after === before) || `inNew=${inNewSpace} back=${back} count=${after}/${before}`;
    });

    await check("flavor switch", async () => {
      for (const id of lazy.LokumFlavors.ids) {
        LokumPrefs.set("lokum.flavor", id);
        if (root.getAttribute("lokum-flavor") !== id) {
          return `flavor ${id} not applied`;
        }
      }
      LokumPrefs.reset("lokum.flavor");
      return true;
    });

    await check("layout horizontal and back", async () => {
      lazy.LokumLayout.set("horizontal");
      await waitFor(win, () => !Services.prefs.getBoolPref("sidebar.verticalTabs"));
      const horizontal = root.getAttribute("lokum-layout") === "horizontal";
      lazy.LokumLayout.set("arc");
      await waitFor(win, () => Services.prefs.getBoolPref("sidebar.verticalTabs"));
      return horizontal || "horizontal attr missing";
    });

    await check("command palette", async () => {
      lazy.LokumCommandPalette.toggle(win);
      await wait(win, 200);
      const palette = doc.getElementById("lokum-palette");
      const open = palette && !palette.hidden && palette.querySelectorAll(".lk-palette-row").length > 5;
      lazy.LokumCommandPalette.toggle(win);
      return open || "palette did not open";
    });

    await check("i18n dictionaries", () => {
      const missing = lazy.LokumI18n.locales
        .filter(l => l.code !== "en")
        .filter(l => lazy.LokumI18n.t("app.tagline", null, l.code) === lazy.LokumI18n.t("app.tagline", null, "en"))
        .map(l => l.code);
      return !missing.length || `untranslated: ${missing.join(", ")}`;
    });

    await check("about:lokum loads", async () => {
      const tab = win.gBrowser.addTrustedTab("about:lokum");
      win.gBrowser.selectedTab = tab;
      const ok = await waitFor(win, () => {
        const d = tab.linkedBrowser.contentDocument;
        return d?.readyState === "complete" && d.querySelector("[data-section]");
      }, 15000);
      const title = tab.linkedBrowser.contentDocument?.title || "";
      win.gBrowser.removeTab(tab);
      return ok || `settings page did not render (${title})`;
    });

    await check("welcome page loads", async () => {
      const tab = win.gBrowser.addTrustedTab("about:lokum-welcome");
      win.gBrowser.selectedTab = tab;
      const ok = await waitFor(win, () => {
        const d = tab.linkedBrowser.contentDocument;
        return d?.readyState === "complete" && d.querySelector(".lk-step");
      }, 15000);
      win.gBrowser.removeTab(tab);
      return ok || "welcome page did not render";
    });

    await check("branding", async () => {
      const title = await brandName();
      return /Lokum/.test(title) || `window title: ${title}`;
    });

    await check("packaged locales", () => {
      const available = Services.locale.packagedLocales;
      const missing = EXPECTED_LOCALES.filter(l => !available.includes(l));
      if (lazy.LokumVersion.isDevBuild) {
        return true; // Dev runs use a single-locale Firefox.
      }
      return !missing.length || `missing: ${missing.join(", ")}`;
    });

    await check("updater state", () => {
      const snap = lazy.LokumUpdater.snapshot();
      return typeof snap.status === "string" || "no status";
    });
    await check("firefox updater disabled", () => {
      return !Services.policies || !Services.policies.isAllowed("appUpdate") || "app update allowed";
    });
    await check("telemetry off", () => {
      return !Services.prefs.getBoolPref("datareporting.healthreport.uploadEnabled", false) || "telemetry on";
    });

    const report = {
      lokum: lazy.LokumVersion.info,
      firefox: Services.appinfo.version,
      os: Services.appinfo.OS,
      locale: Services.locale.appLocaleAsBCP47,
      passed: results.every(r => r.ok),
      results,
    };
    await IOUtils.writeJSON(outputPath, report);
    if (!Services.env.get("LOKUM_SELFTEST_KEEP_OPEN")) {
      Services.startup.quit(Ci.nsIAppStartup.eForceQuit);
    }
  },
};
