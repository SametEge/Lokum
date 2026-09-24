/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * uBlock Origin, which Lokum offers in the Windows installer, the welcome
 * tour and Settings. It always comes from addons.mozilla.org, so it is
 * signed by Mozilla and keeps itself up to date like any other add-on.
 */

import { LokumPrefs } from "chrome://lokum/content/modules/LokumPrefs.sys.mjs";
import { importFirefoxModule } from "chrome://lokum/content/modules/LokumCompat.sys.mjs";

export const UBLOCK_ID = "uBlock0@raymondhill.net";
export const UBLOCK_URL =
  "https://addons.mozilla.org/firefox/downloads/latest/ublock-origin/latest.xpi";

let pending = null;

export const LokumAddons = {
  /** The choices made in the Windows installer (distribution/lokum-install.json). */
  installerChoices() {
    try {
      const file = Services.dirsvc.get("GreD", Ci.nsIFile);
      file.append("distribution");
      file.append("lokum-install.json");
      if (file.exists()) {
        return JSON.parse(Cu.readUTF8File(file)) || {};
      }
    } catch (ex) {
      console.warn("Lokum: could not read installer choices", ex);
    }
    return {};
  },

  async getUBlock() {
    return importFirefoxModule("AddonManager").getAddonByID(UBLOCK_ID);
  },

  /** Installs uBlock Origin unless it is already there. Resolves to true when installed. */
  installUBlock(source = "lokum") {
    if (pending) {
      return pending;
    }
    pending = (async () => {
      const AM = importFirefoxModule("AddonManager");
      if (await AM.getAddonByID(UBLOCK_ID)) {
        return true;
      }
      const install = await AM.getInstallForURL(UBLOCK_URL, {
        telemetryInfo: { source },
      });
      await install.install();
      LokumPrefs.set("lokum.ublock.installedByLokum", true);
      return true;
    })()
      .catch(ex => {
        console.warn("Lokum: could not install uBlock Origin", ex);
        return false;
      })
      .finally(() => {
        pending = null;
      });
    return pending;
  },

  /** Removes uBlock Origin again, but only if Lokum installed it. */
  async removeUBlockIfOurs() {
    // Let an install that is still running finish first, so it cannot
    // reappear right after being turned off.
    await pending;
    if (!LokumPrefs.get("lokum.ublock.installedByLokum")) {
      return;
    }
    const addon = await this.getUBlock();
    if (addon) {
      await addon.uninstall();
    }
    LokumPrefs.set("lokum.ublock.installedByLokum", false);
  },

  /**
   * First run of a profile: apply what the installer asked for. The checkbox
   * is on by default, so clicking "Next" through the installer installs
   * uBlock Origin.
   */
  applyInstallerChoices() {
    if (LokumPrefs.get("lokum.install.applied")) {
      return;
    }
    LokumPrefs.set("lokum.install.applied", true);
    if (this.installerChoices().ublock === true) {
      this.installUBlock("lokum-installer");
    }
  },
};
