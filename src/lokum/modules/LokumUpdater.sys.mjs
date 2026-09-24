/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Lokum's auto-updater.
 *
 * Every release published by the GitHub workflow carries a `latest.json`
 * manifest (version, notes, and per-platform assets with SHA-256 hashes).
 * The updater:
 *   1. checks the manifest a minute after startup and then every few hours,
 *   2. downloads the Windows installer in the background,
 *   3. verifies its SHA-256,
 *   4. installs silently when Lokum quits (or right away when the user
 *      clicks "Restart to update"), then relaunches Lokum.
 *
 * Firefox's own updater is disabled by policy because it would replace
 * Lokum with plain Firefox.
 */

import { LokumPrefs } from "chrome://lokum/content/modules/LokumPrefs.sys.mjs";
import { LokumVersion, compareVersions } from "chrome://lokum/content/modules/LokumVersion.sys.mjs";

import { defineFirefoxModuleGetters } from "chrome://lokum/content/modules/LokumCompat.sys.mjs";

const lazy = {};
ChromeUtils.defineESModuleGetters(lazy, {
  LokumI18n: "chrome://lokum/content/modules/LokumI18n.sys.mjs",
  LokumToast: "chrome://lokum/content/modules/LokumToast.sys.mjs",
});
defineFirefoxModuleGetters(lazy, ["BrowserWindowTracker"]);

const TOPIC = "lokum-update-state";
const FIRST_CHECK_DELAY_MS = 60 * 1000;
const HTML_NS = "http://www.w3.org/1999/xhtml";
const ALLOWED_HOSTS = [
  "github.com",
  "objects.githubusercontent.com",
  "release-assets.githubusercontent.com",
  "github-releases.githubusercontent.com",
];

export const UpdateState = Object.freeze({
  IDLE: "idle",
  CHECKING: "checking",
  UP_TO_DATE: "up-to-date",
  AVAILABLE: "available",
  DOWNLOADING: "downloading",
  READY: "ready",
  INSTALLING: "installing",
  ERROR: "error",
  UNSUPPORTED: "unsupported",
});

function platformKey() {
  const os = Services.appinfo.OS;
  const abi = Services.appinfo.XPCOMABI || "";
  if (os === "WINNT") {
    return abi.startsWith("aarch64") ? "win-arm64" : "win64";
  }
  if (os === "Linux") {
    return "linux-x86_64";
  }
  return os.toLowerCase();
}

function isPortable() {
  try {
    const marker = Services.dirsvc.get("GreD", Ci.nsIFile);
    marker.append("lokum-portable");
    return marker.exists();
  } catch (ex) {
    return false;
  }
}

function hostAllowed(url) {
  try {
    const host = new URL(url).host;
    return ALLOWED_HOSTS.some(h => host === h || host.endsWith("." + h));
  } catch (ex) {
    return false;
  }
}

async function sha256OfFile(path) {
  const file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
  file.initWithPath(path);
  const stream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(
    Ci.nsIFileInputStream
  );
  stream.init(file, -1, -1, 0);
  try {
    const hash = Cc["@mozilla.org/security/hash;1"].createInstance(Ci.nsICryptoHash);
    hash.init(Ci.nsICryptoHash.SHA256);
    hash.updateFromStream(stream, -1);
    const bytes = hash.finish(false);
    return [...bytes].map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");
  } finally {
    stream.close();
  }
}

const state = {
  status: UpdateState.IDLE,
  manifest: null,
  progress: 0,
  receivedBytes: 0,
  totalBytes: 0,
  error: "",
  installerPath: "",
  lastCheck: 0,
};

let timer = null;
let checking = null;
let downloading = null;
const windowCards = new Set();

function setState(changes) {
  Object.assign(state, changes);
  Services.obs.notifyObservers(null, TOPIC, JSON.stringify(LokumUpdater.snapshot()));
  for (const card of windowCards) {
    try {
      card.render();
    } catch (ex) {}
  }
}

/* -------------------------------------------------------------------------
 * Sidebar card
 * ----------------------------------------------------------------------- */

class UpdateCard {
  constructor(controller) {
    this.controller = controller;
    this.win = controller.win;
    this.doc = controller.doc;
    const doc = this.doc;
    const make = (tag, cls) => {
      const n = doc.createElementNS(HTML_NS, tag);
      if (cls) {
        n.className = cls;
      }
      return n;
    };
    this.card = make("div", "lk-update-card");
    this.card.id = "lokum-update-card";
    this.card.setAttribute("slot", "tabstrip");
    this.card.hidden = true;
    const icon = make("span", "lk-update-icon");
    icon.textContent = "🍬";
    const text = make("div", "lk-update-text");
    this.title = make("span", "lk-update-title");
    this.subtitle = make("span", "lk-update-subtitle");
    text.append(this.title, this.subtitle);
    this.bar = make("div", "lk-update-progress");
    this.barFill = make("div", "lk-update-progress-fill");
    this.bar.append(this.barFill);
    this.button = make("button", "lk-update-button");
    this.button.addEventListener("click", () => this.onAction());
    this.later = make("button", "lk-update-later");
    this.later.textContent = "×";
    this.later.addEventListener("click", () => {
      this.dismissed = state.manifest?.version || true;
      this.render();
    });
    this.card.append(icon, text, this.button, this.later, this.bar);
    const anchor = doc.getElementById("lokum-media-card") || doc.getElementById("lokum-sidebar-footer");
    if (anchor) {
      anchor.before(this.card);
    } else {
      doc.getElementById("vertical-tabs")?.after(this.card);
    }
    this.render();
  }

  onAction() {
    if (state.status === UpdateState.READY) {
      LokumUpdater.installNow();
    } else if (state.status === UpdateState.AVAILABLE) {
      if (LokumUpdater.canInstall) {
        LokumUpdater.download();
      } else {
        this.win.openWebLinkIn(state.manifest?.url || `https://github.com/${LokumVersion.repo}/releases/latest`, "tab");
      }
    } else if (state.status === UpdateState.ERROR) {
      LokumUpdater.check({ userInitiated: true });
    }
  }

  render() {
    const t = lazy.LokumI18n.t.bind(lazy.LokumI18n);
    const version = state.manifest?.version || "";
    const show =
      [UpdateState.AVAILABLE, UpdateState.DOWNLOADING, UpdateState.READY, UpdateState.INSTALLING].includes(state.status) &&
      this.dismissed !== version;
    this.card.hidden = !show;
    if (!show) {
      return;
    }
    this.card.setAttribute("state", state.status);
    this.title.textContent = t("update.card.title", { version });
    this.bar.hidden = state.status !== UpdateState.DOWNLOADING;
    this.barFill.style.width = `${Math.round(state.progress * 100)}%`;
    switch (state.status) {
      case UpdateState.AVAILABLE:
        this.subtitle.textContent = t("update.card.available");
        this.button.textContent = LokumUpdater.canInstall ? t("update.download") : t("update.openPage");
        this.button.hidden = false;
        break;
      case UpdateState.DOWNLOADING:
        this.subtitle.textContent = t("update.card.downloading", { percent: Math.round(state.progress * 100) });
        this.button.hidden = true;
        break;
      case UpdateState.READY:
        this.subtitle.textContent = t("update.card.ready");
        this.button.textContent = t("update.restart");
        this.button.hidden = false;
        break;
      case UpdateState.INSTALLING:
        this.subtitle.textContent = t("update.card.installing");
        this.button.hidden = true;
        break;
    }
  }

  destroy() {
    windowCards.delete(this);
    this.card.remove();
  }
}

/* -------------------------------------------------------------------------
 * Updater
 * ----------------------------------------------------------------------- */

export const LokumUpdater = {
  TOPIC,
  State: UpdateState,

  get canInstall() {
    return platformKey().startsWith("win") && !isPortable();
  },

  snapshot() {
    return {
      status: state.status,
      version: state.manifest?.version || "",
      firefox: state.manifest?.firefox || "",
      notes: state.manifest?.notes || "",
      date: state.manifest?.date || "",
      url: state.manifest?.url || "",
      progress: state.progress,
      receivedBytes: state.receivedBytes,
      totalBytes: state.totalBytes,
      error: state.error,
      lastCheck: LokumPrefs.get("lokum.update.lastCheck"),
      current: LokumVersion.version,
      currentFirefox: Services.appinfo.version,
      canInstall: this.canInstall,
      portable: isPortable(),
      platform: platformKey(),
    };
  },

  init() {
    if (timer) {
      return;
    }
    timer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
    timer.initWithCallback(() => this._scheduledCheck(), FIRST_CHECK_DELAY_MS, Ci.nsITimer.TYPE_ONE_SHOT);
    this._cleanupOldInstallers();
  },

  _scheduledCheck() {
    const hours = Math.max(1, LokumPrefs.get("lokum.update.intervalHours"));
    timer.initWithCallback(() => this._scheduledCheck(), hours * 3600 * 1000, Ci.nsITimer.TYPE_ONE_SHOT);
    if (!LokumPrefs.get("lokum.update.enabled") || LokumVersion.isDevBuild) {
      return;
    }
    const last = LokumPrefs.get("lokum.update.lastCheck") * 1000;
    if (Date.now() - last < (hours * 3600 * 1000) / 2) {
      return;
    }
    this.check({ userInitiated: false }).catch(() => {});
  },

  attachWindow(controller) {
    const card = new UpdateCard(controller);
    windowCards.add(card);
    controller.onCleanup(() => card.destroy());
  },

  async _fetchManifest() {
    const channel = LokumPrefs.get("lokum.update.channel");
    if (channel === "beta") {
      const response = await fetch(LokumPrefs.get("lokum.update.releasesAPI"), {
        cache: "no-store",
        headers: { Accept: "application/vnd.github+json" },
      });
      if (!response.ok) {
        throw new Error(`GitHub API ${response.status}`);
      }
      const releases = (await response.json()).filter(r => !r.draft);
      releases.sort((a, b) => compareVersions(b.tag_name, a.tag_name));
      for (const release of releases) {
        const asset = release.assets?.find(a => a.name === "latest.json");
        if (asset) {
          const m = await fetch(asset.browser_download_url, { cache: "no-store" });
          if (m.ok) {
            return m.json();
          }
        }
      }
      throw new Error("No release manifest found");
    }
    const response = await fetch(LokumPrefs.get("lokum.update.manifestURL"), { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  },

  /** Checks GitHub for a newer Lokum. */
  check({ userInitiated = false, window = null } = {}) {
    if (checking) {
      return checking;
    }
    if ([UpdateState.DOWNLOADING, UpdateState.INSTALLING].includes(state.status)) {
      return Promise.resolve(this.snapshot());
    }
    setState({ status: UpdateState.CHECKING, error: "" });
    checking = (async () => {
      try {
        const manifest = await this._fetchManifest();
        LokumPrefs.set("lokum.update.lastCheck", Math.floor(Date.now() / 1000));
        if (!manifest?.version) {
          throw new Error("Malformed manifest");
        }
        const newer =
          compareVersions(manifest.version, LokumVersion.version) > 0 &&
          manifest.version !== LokumPrefs.get("lokum.update.skippedVersion");
        if (!newer) {
          setState({ status: UpdateState.UP_TO_DATE, manifest });
          if (userInitiated && window) {
            lazy.LokumToast.show(window, { icon: "check", text: lazy.LokumI18n.t("update.upToDate") });
          }
          return this.snapshot();
        }
        if (state.status === UpdateState.READY && state.manifest?.version === manifest.version) {
          return this.snapshot();
        }
        setState({ status: UpdateState.AVAILABLE, manifest, progress: 0 });
        if (this.canInstall && (LokumPrefs.get("lokum.update.auto") || userInitiated)) {
          this.download().catch(() => {});
        }
      } catch (ex) {
        console.warn("Lokum update check failed:", ex);
        setState({ status: UpdateState.ERROR, error: String(ex.message || ex) });
      } finally {
        checking = null;
      }
      return this.snapshot();
    })();
    return checking;
  },

  _asset() {
    const assets = state.manifest?.assets?.[platformKey()];
    return assets?.installer || null;
  },

  _updatesDir() {
    return PathUtils.join(PathUtils.tempDir, "lokum-updates");
  },

  /** Streams the installer to disk and verifies it. */
  download() {
    if (downloading) {
      return downloading;
    }
    const asset = this._asset();
    if (!asset?.url || !asset?.sha256 || !hostAllowed(asset.url)) {
      setState({ status: UpdateState.ERROR, error: "No installer for this platform" });
      return Promise.reject(new Error("no asset"));
    }
    downloading = (async () => {
      const dir = this._updatesDir();
      const name = `Lokum-Setup-${state.manifest.version}.exe`.replace(/[^\w.\-]/g, "_");
      const target = PathUtils.join(dir, name);
      const partial = target + ".part";
      try {
        await IOUtils.makeDirectory(dir, { ignoreExisting: true });
        // Reuse a previous complete download.
        if (await IOUtils.exists(target)) {
          if ((await sha256OfFile(target)) === asset.sha256.toLowerCase()) {
            setState({ status: UpdateState.READY, installerPath: target, progress: 1 });
            this._announceReady();
            return;
          }
          await IOUtils.remove(target);
        }
        setState({ status: UpdateState.DOWNLOADING, progress: 0, receivedBytes: 0, totalBytes: asset.size || 0 });
        const response = await fetch(asset.url, { cache: "no-store" });
        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status}`);
        }
        const total = Number(response.headers.get("content-length")) || asset.size || 0;
        await IOUtils.write(partial, new Uint8Array(0));
        const reader = response.body.getReader();
        let received = 0;
        let lastNotify = 0;
        let pending = [];
        let pendingBytes = 0;
        const flush = async () => {
          if (!pendingBytes) {
            return;
          }
          const chunk = new Uint8Array(pendingBytes);
          let offset = 0;
          for (const part of pending) {
            chunk.set(part, offset);
            offset += part.length;
          }
          pending = [];
          pendingBytes = 0;
          await IOUtils.write(partial, chunk, { mode: "append" });
        };
        for (;;) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          pending.push(value);
          pendingBytes += value.length;
          received += value.length;
          if (pendingBytes > 1 << 20) {
            await flush();
          }
          const now = Date.now();
          if (now - lastNotify > 250) {
            lastNotify = now;
            setState({ progress: total ? received / total : 0, receivedBytes: received, totalBytes: total });
          }
        }
        await flush();
        const digest = await sha256OfFile(partial);
        if (digest !== asset.sha256.toLowerCase()) {
          await IOUtils.remove(partial, { ignoreAbsent: true });
          throw new Error("Checksum mismatch");
        }
        await IOUtils.move(partial, target);
        setState({ status: UpdateState.READY, installerPath: target, progress: 1, receivedBytes: received });
        this._announceReady();
      } catch (ex) {
        console.warn("Lokum update download failed:", ex);
        setState({ status: UpdateState.ERROR, error: String(ex.message || ex) });
      } finally {
        downloading = null;
      }
    })();
    return downloading;
  },

  _announceReady() {
    const win = lazy.BrowserWindowTracker.getTopWindow();
    if (!win || win.document.documentElement.hasAttribute("lokum-vertical")) {
      return; // The sidebar card is enough.
    }
    lazy.LokumToast.show(win, {
      icon: "sparkle",
      text: lazy.LokumI18n.t("update.card.title", { version: state.manifest.version }),
      action: { label: lazy.LokumI18n.t("update.restart"), callback: () => this.installNow() },
      duration: 12000,
    });
  },

  _launchInstaller({ relaunch }) {
    if (!state.installerPath || !this.canInstall) {
      return false;
    }
    const file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
    file.initWithPath(state.installerPath);
    if (!file.exists()) {
      return false;
    }
    const args = ["/S", "/UPDATE", `/PID=${Services.appinfo.processID}`];
    if (relaunch) {
      args.push("/RELAUNCH");
    }
    const process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
    process.init(file);
    process.startHidden = true;
    process.noShell = true;
    process.runw(false, args, args.length);
    return true;
  },

  /** "Restart to update": start the installer, then quit Lokum. */
  installNow() {
    if (state.status !== UpdateState.READY) {
      return;
    }
    setState({ status: UpdateState.INSTALLING });
    if (!this._launchInstaller({ relaunch: true })) {
      setState({ status: UpdateState.ERROR, error: "Installer missing" });
      return;
    }
    this._installedOnQuit = true;
    Services.startup.quit(Ci.nsIAppStartup.eAttemptQuit);
  },

  /**
   * Called on "quit-application": install a downloaded update silently.
   * @param {string} reason "shutdown" or "restart"
   */
  onQuit(reason) {
    if (this._installedOnQuit) {
      return;
    }
    if (state.status !== UpdateState.READY || !LokumPrefs.get("lokum.update.auto")) {
      return;
    }
    // Only on a real shutdown; Firefox restarting itself would race with
    // the installer (the next real quit will install it).
    if (reason === "restart") {
      return;
    }
    this._installedOnQuit = this._launchInstaller({ relaunch: false });
  },

  skipVersion() {
    if (state.manifest?.version) {
      LokumPrefs.set("lokum.update.skippedVersion", state.manifest.version);
      setState({ status: UpdateState.IDLE });
    }
  },

  async _cleanupOldInstallers() {
    try {
      const dir = this._updatesDir();
      if (!(await IOUtils.exists(dir))) {
        return;
      }
      for (const path of await IOUtils.getChildren(dir)) {
        const name = PathUtils.filename(path);
        const match = /^Lokum-Setup-(.+)\.exe(\.part)?$/.exec(name);
        if (match && compareVersions(match[1], LokumVersion.version) <= 0) {
          await IOUtils.remove(path, { ignoreAbsent: true });
        }
      }
    } catch (ex) {}
  },
};
