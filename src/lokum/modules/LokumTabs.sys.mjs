/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Tab housekeeping:
 *  - Auto-archive (Arc): unpinned tabs you haven't looked at for a while are
 *    closed and kept in a searchable archive (settings -> Archive).
 *  - Sleep: background tabs are unloaded after N minutes to save memory.
 */

import { LokumPrefs } from "chrome://lokum/content/modules/LokumPrefs.sys.mjs";

import { defineFirefoxModuleGetters } from "chrome://lokum/content/modules/LokumCompat.sys.mjs";

const lazy = {};
defineFirefoxModuleGetters(lazy, ["SessionStore", "BrowserWindowTracker", "PrivateBrowsingUtils"]);

const ARCHIVE_FILE = "archive.json";
const ARCHIVE_LIMIT = 600;
const TICK_MS = 60 * 1000;

let archive = null;
let timer = null;
let saveQueued = false;

function archivePath() {
  return PathUtils.join(PathUtils.profileDir, "lokum", ARCHIVE_FILE);
}

async function loadArchive() {
  if (archive) {
    return archive;
  }
  try {
    const data = await IOUtils.readJSON(archivePath());
    archive = Array.isArray(data.items) ? data.items : [];
  } catch (ex) {
    archive = [];
  }
  return archive;
}

function saveArchive() {
  if (saveQueued) {
    return;
  }
  saveQueued = true;
  Promise.resolve().then(async () => {
    saveQueued = false;
    try {
      await IOUtils.makeDirectory(PathUtils.parent(archivePath()), { ignoreExisting: true });
      await IOUtils.writeJSON(archivePath(), { version: 1, items: archive }, {
        tmpPath: archivePath() + ".tmp",
      });
    } catch (ex) {
      console.error("Lokum: could not save archive", ex);
    }
    Services.obs.notifyObservers(null, "lokum-archive-changed");
  });
}

function isBusy(tab) {
  return (
    tab.selected ||
    tab.pinned ||
    tab.closing ||
    tab.hasAttribute("soundplaying") ||
    tab.hasAttribute("sharing") ||
    tab.multiselected ||
    tab.linkedBrowser?._sharingState?.webRTC?.sharing
  );
}

export const LokumTabs = {
  init() {
    if (timer) {
      return;
    }
    timer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
    timer.initWithCallback(() => this.tick(), TICK_MS, Ci.nsITimer.TYPE_REPEATING_SLACK);
  },

  tick() {
    const archiveHours = LokumPrefs.get("lokum.tabs.autoArchiveHours");
    const sleepMinutes = LokumPrefs.get("lokum.tabs.sleepMinutes");
    if (!archiveHours && !sleepMinutes) {
      return;
    }
    const now = Date.now();
    for (const win of lazy.BrowserWindowTracker.orderedWindows) {
      if (win.closed || !win.gBrowser || lazy.PrivateBrowsingUtils?.isWindowPrivate?.(win)) {
        continue;
      }
      const gBrowser = win.gBrowser;
      const toArchive = [];
      for (const tab of gBrowser.tabs) {
        if (isBusy(tab)) {
          continue;
        }
        const idle = now - (tab.lastAccessed || now);
        if (archiveHours && !tab.group && idle > archiveHours * 3600 * 1000) {
          toArchive.push(tab);
        } else if (
          sleepMinutes &&
          idle > sleepMinutes * 60 * 1000 &&
          tab.linkedPanel &&
          !tab.hasAttribute("pending")
        ) {
          try {
            gBrowser.discardBrowser(tab);
          } catch (ex) {}
        }
      }
      if (toArchive.length) {
        this.archiveTabs(win, toArchive);
      }
    }
  },

  async archiveTabs(win, tabs) {
    await loadArchive();
    const now = Date.now();
    for (const tab of tabs) {
      const browser = tab.linkedBrowser;
      const url = browser?.currentURI?.spec;
      if (!url || url.startsWith("about:newtab") || url === "about:blank" || url.startsWith("about:home")) {
        continue;
      }
      archive.unshift({
        url,
        title: tab.label || url,
        icon: tab.getAttribute("image") || "",
        archivedAt: now,
        lastAccessed: tab.lastAccessed || now,
        space: lazy.SessionStore.getCustomTabValue(tab, "lokumSpace") || "",
      });
    }
    archive.length = Math.min(archive.length, ARCHIVE_LIMIT);
    saveArchive();
    win.gBrowser.removeTabs(tabs, { animate: false, skipSessionStore: false });
  },

  async getArchive() {
    return [...(await loadArchive())];
  },

  async removeFromArchive(url, archivedAt) {
    await loadArchive();
    archive = archive.filter(i => !(i.url === url && i.archivedAt === archivedAt));
    saveArchive();
  },

  async clearArchive() {
    archive = [];
    saveArchive();
  },
};

