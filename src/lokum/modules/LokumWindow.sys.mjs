/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Per-window Lokum UI. Every browser window gets a LokumWindowController
 * that owns the Lokum-specific DOM (sidebar header/footer, title strip,
 * media card, update card, command palette...) and keeps the root element's
 * attributes in sync with the lokum.* preferences.
 */

import { LokumPrefs } from "chrome://lokum/content/modules/LokumPrefs.sys.mjs";
import { LokumFlavors } from "chrome://lokum/content/modules/LokumFlavors.sys.mjs";

const lazy = {};
ChromeUtils.defineESModuleGetters(lazy, {
  LokumCommandPalette: "chrome://lokum/content/modules/LokumCommandPalette.sys.mjs",
  LokumI18n: "chrome://lokum/content/modules/LokumI18n.sys.mjs",
  LokumLayout: "chrome://lokum/content/modules/LokumLayout.sys.mjs",
  LokumMediaCard: "chrome://lokum/content/modules/LokumMediaCard.sys.mjs",
  LokumSpaces: "chrome://lokum/content/modules/LokumSpaces.sys.mjs",
  LokumToast: "chrome://lokum/content/modules/LokumToast.sys.mjs",
  LokumUpdater: "chrome://lokum/content/modules/LokumUpdater.sys.mjs",
});

const HTML_NS = "http://www.w3.org/1999/xhtml";
const SHEETS = {
  author: "chrome://lokum/content/styles/lokum.css",
  user: "chrome://lokum/content/styles/lokum-shadow.css",
};
const ONBOARDING_URL = "chrome://lokum/content/pages/welcome/welcome.html";

const controllers = new Set();

function isBrowserWindow(win) {
  return (
    win &&
    !win.closed &&
    win.document?.documentElement?.getAttribute("windowtype") === "navigator:browser"
  );
}

/** Creates an HTML element with attributes and children. */
export function h(doc, tag, attrs = {}, ...children) {
  const el = doc.createElementNS(HTML_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === false || value === null || value === undefined) {
      continue;
    }
    if (key === "class") {
      el.className = value;
    } else if (key === "text") {
      el.textContent = value;
    } else if (key.startsWith("on") && typeof value === "function") {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === "dataset") {
      Object.assign(el.dataset, value);
    } else if (key === "style" && typeof value === "object") {
      for (const [prop, v] of Object.entries(value)) {
        el.style.setProperty(prop, v);
      }
    } else {
      el.setAttribute(key, value === true ? "" : value);
    }
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) {
      continue;
    }
    el.append(typeof child === "string" ? doc.createTextNode(child) : child);
  }
  return el;
}

/** An inline SVG icon from lokum/images/icons (uses context-fill). */
export function icon(doc, name, cls = "lk-icon") {
  return h(doc, "img", {
    class: cls,
    src: `chrome://lokum/content/images/icons/${name}.svg`,
    alt: "",
    role: "presentation",
    draggable: "false",
  });
}

class LokumWindowController {
  constructor(win) {
    this.win = win;
    this.doc = win.document;
    this.root = this.doc.documentElement;
    this._cleanups = [];
    this._resizeObserver = null;
  }

  get t() {
    return lazy.LokumI18n.t.bind(lazy.LokumI18n);
  }

  init() {
    this.syncAttributes();
    this.applyFlavor();
    this._buildVeilAndEdge();
    this._buildTitleStrip();
    this._observeSizes();
    this._watchUrlbar();
    this._setupCompactPeek();
    this._setupShortcuts();
    this._setupMenus();
    try {
      lazy.LokumSpaces.attachWindow(this);
    } catch (ex) {
      console.error("Lokum: spaces", ex);
    }
    try {
      this.mediaCard = new lazy.LokumMediaCard(this);
    } catch (ex) {
      console.error("Lokum: media card", ex);
    }
    try {
      lazy.LokumUpdater.attachWindow(this);
    } catch (ex) {
      console.error("Lokum: updater card", ex);
    }
    this.win.addEventListener("unload", () => this.destroy(), { once: true });
  }

  destroy() {
    controllers.delete(this);
    for (const fn of this._cleanups.splice(0)) {
      try {
        fn();
      } catch (ex) {}
    }
    this._resizeObserver?.disconnect();
    this.mediaCard?.destroy();
    lazy.LokumSpaces.detachWindow?.(this);
  }

  onCleanup(fn) {
    this._cleanups.push(fn);
  }

  listen(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    this._cleanups.push(() => target.removeEventListener(type, handler, options));
  }

  /* ---------------------------------------------------------------------
   * Root attributes & theme
   * ------------------------------------------------------------------- */

  syncAttributes() {
    syncRootAttributes(this.win);
  }

  /** Flavor of the active space when spaces tint the frame, else global. */
  get effectiveFlavor() {
    const spaceFlavor = LokumPrefs.get("lokum.spaces.tintFrame")
      ? lazy.LokumSpaces.flavorForWindow?.(this.win)
      : null;
    return spaceFlavor || LokumPrefs.get("lokum.flavor");
  }

  applyFlavor() {
    LokumFlavors.apply(this.root, this.effectiveFlavor, {
      customAccent: LokumPrefs.get("lokum.accent.custom"),
    });
  }

  /* ---------------------------------------------------------------------
   * DOM additions
   * ------------------------------------------------------------------- */

  _buildVeilAndEdge() {
    const doc = this.doc;
    const veil = h(doc, "div", { id: "lokum-veil" });
    const edge = h(doc, "div", { id: "lokum-edge" });
    doc.body.append(veil, edge);
    this.listen(veil, "mousedown", () => this.win.gURLBar?.view?.close());
  }

  _buildTitleStrip() {
    const doc = this.doc;
    const tabbox = doc.getElementById("tabbrowser-tabbox");
    if (!tabbox) {
      return;
    }
    const favicon = h(doc, "img", { class: "lk-strip-favicon", alt: "" });
    const title = h(doc, "span", { class: "lk-strip-title" });
    const host = h(doc, "span", { class: "lk-strip-host" });
    const copy = h(
      doc,
      "button",
      {
        class: "lk-strip-button",
        title: this.t("titlestrip.copyLink"),
        onclick: () => this.copyCurrentUrl(),
      },
      icon(doc, "link")
    );
    const strip = h(doc, "div", { id: "lokum-titlestrip" }, favicon, title, host, copy);
    tabbox.prepend(strip);
    this.titleStrip = { strip, favicon, title, host };

    const update = () => this._updateTitleStrip();
    this.listen(this.win.gBrowser.tabContainer, "TabSelect", update);
    this.listen(this.win.gBrowser.tabContainer, "TabAttrModified", event => {
      if (event.target.selected) {
        update();
      }
    });
    const progress = {
      onLocationChange: () => update(),
      QueryInterface: ChromeUtils.generateQI([
        "nsIWebProgressListener",
        "nsISupportsWeakReference",
      ]),
    };
    this.win.gBrowser.addProgressListener(progress);
    this.onCleanup(() => this.win.gBrowser.removeProgressListener(progress));
    update();
  }

  _updateTitleStrip() {
    const tab = this.win.gBrowser.selectedTab;
    const browser = tab.linkedBrowser;
    const { favicon, title, host } = this.titleStrip;
    title.textContent = tab.label || "";
    let hostText = "";
    try {
      const uri = browser.currentURI;
      if (uri && /^https?$/.test(uri.scheme)) {
        hostText = uri.host.replace(/^www\./, "");
      }
    } catch (ex) {}
    host.textContent = hostText;
    host.hidden = !hostText;
    const iconURL = tab.getAttribute("image");
    favicon.hidden = !iconURL;
    if (iconURL) {
      favicon.src = iconURL;
    }
  }

  copyCurrentUrl() {
    const uri = this.win.gBrowser.currentURI;
    if (!uri) {
      return;
    }
    const clipboard = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(
      Ci.nsIClipboardHelper
    );
    clipboard.copyString(uri.displaySpec);
    lazy.LokumToast.show(this.win, {
      icon: "link",
      text: this.t("toast.linkCopied"),
    });
  }

  /* ---------------------------------------------------------------------
   * Measurements shared with CSS
   * ------------------------------------------------------------------- */

  _observeSizes() {
    const doc = this.doc;
    const sidebar = doc.getElementById("sidebar-container");
    const toolbox = doc.getElementById("navigator-toolbox");
    const tabbox = doc.getElementById("tabbrowser-tabbox");
    const RO = this.win.ResizeObserver;
    this._resizeObserver = new RO(entries => {
      for (const entry of entries) {
        const box = entry.borderBoxSize?.[0];
        if (!box) {
          continue;
        }
        if (entry.target === sidebar && !this._isCompactLike()) {
          if (box.inlineSize > 60) {
            this.root.style.setProperty("--lk-sidebar-width", `${Math.round(box.inlineSize)}px`);
          }
        } else if (entry.target === toolbox) {
          this.root.style.setProperty("--lk-toolbox-height", `${Math.ceil(box.blockSize)}px`);
        } else if (entry.target === tabbox) {
          const rect = tabbox.getBoundingClientRect();
          this.root.style.setProperty(
            "--lk-content-center",
            `${Math.round(rect.left + rect.width / 2)}px`
          );
        }
      }
    });
    for (const el of [sidebar, toolbox, tabbox]) {
      if (el) {
        this._resizeObserver.observe(el);
      }
    }
  }

  _isCompactLike() {
    return this.root.hasAttribute("lokum-compact") || this.root.hasAttribute("inFullscreen");
  }

  /* ---------------------------------------------------------------------
   * Floating address bar (Arc command bar)
   * ------------------------------------------------------------------- */

  _watchUrlbar() {
    const urlbar = this.doc.getElementById("urlbar");
    if (!urlbar) {
      return;
    }
    const update = () => {
      const floating =
        this.root.getAttribute("lokum-layout") === "arc" &&
        this.root.hasAttribute("lokum-floating-urlbar") &&
        urlbar.hasAttribute("breakout-extend");
      this.root.toggleAttribute("lokum-urlbar-floating", floating);
    };
    const mo = new this.win.MutationObserver(update);
    mo.observe(urlbar, { attributes: true, attributeFilter: ["breakout-extend"] });
    this.onCleanup(() => mo.disconnect());
  }

  /* ---------------------------------------------------------------------
   * Compact mode: reveal the sidebar from the window edge.
   * ------------------------------------------------------------------- */

  _setupCompactPeek() {
    const doc = this.doc;
    const edge = doc.getElementById("lokum-edge");
    const sidebar = doc.getElementById("sidebar-container");
    const toolbox = doc.getElementById("navigator-toolbox");
    let hideTimer = null;

    const show = () => {
      this.win.clearTimeout(hideTimer);
      this.root.setAttribute("lokum-sidebar-peek", "true");
    };
    const busy = () =>
      !!doc.querySelector(
        "menupopup[open], panel[panelopen], panel[animating]"
      ) || this.doc.getElementById("urlbar")?.hasAttribute("focused");
    const scheduleHide = () => {
      this.win.clearTimeout(hideTimer);
      hideTimer = this.win.setTimeout(() => {
        if (busy()) {
          scheduleHide();
          return;
        }
        const hovered = [sidebar, toolbox].some(el => el?.matches(":hover"));
        if (!hovered) {
          this.root.removeAttribute("lokum-sidebar-peek");
        }
      }, 420);
    };
    this.listen(edge, "mouseenter", show);
    for (const el of [sidebar, toolbox]) {
      if (el) {
        this.listen(el, "mouseenter", () => {
          if (this.root.hasAttribute("lokum-sidebar-peek")) {
            show();
          }
        });
        this.listen(el, "mouseleave", scheduleHide);
      }
    }
    this.peekSidebar = (duration = 1600) => {
      if (!this._isCompactLike()) {
        return;
      }
      show();
      hideTimer = this.win.setTimeout(scheduleHide, duration);
    };
  }

  toggleCompact() {
    LokumPrefs.set("lokum.compact", !LokumPrefs.get("lokum.compact"));
  }

  /* ---------------------------------------------------------------------
   * Keyboard shortcuts
   * ------------------------------------------------------------------- */

  _setupShortcuts() {
    const handler = event => {
      if (!LokumPrefs.get("lokum.shortcuts.enabled") || event.defaultPrevented) {
        return;
      }
      const accel = event.ctrlKey || event.metaKey;
      const key = event.key;
      let handled = true;

      if (accel && event.altKey && !event.shiftKey && (key === "s" || key === "S" || event.code === "KeyS")) {
        this.toggleCompact();
      } else if (accel && !event.altKey && !event.shiftKey && (event.code === "KeyK")) {
        lazy.LokumCommandPalette.toggle(this.win);
      } else if (accel && event.altKey && event.code === "ArrowRight") {
        lazy.LokumSpaces.cycle(this.win, 1);
      } else if (accel && event.altKey && event.code === "ArrowLeft") {
        lazy.LokumSpaces.cycle(this.win, -1);
      } else if (accel && event.altKey && /^Digit[1-9]$/.test(event.code)) {
        lazy.LokumSpaces.switchToIndex(this.win, Number(event.code.slice(5)) - 1);
      } else if (accel && event.shiftKey && !event.altKey && event.code === "KeyC" && event.target?.ownerGlobal === this.win && this.doc.activeElement?.id !== "urlbar-input") {
        this.copyCurrentUrl();
      } else if (accel && event.code === "Comma" && !event.altKey && !event.shiftKey) {
        openLokumSettings(this.win);
      } else {
        handled = false;
      }
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    // Capture phase so we see keys before web content handles them.
    this.listen(this.win, "keydown", handler, true);
  }

  /* ---------------------------------------------------------------------
   * App menu entry
   * ------------------------------------------------------------------- */

  _setupMenus() {
    const doc = this.doc;
    // The hamburger menu subview is lazily inserted from a template; add our
    // item whenever it is shown.
    const onShowing = event => {
      const view = event.target;
      if (view?.id !== "appMenu-mainView" || view.querySelector("#appMenu-lokum-settings")) {
        return;
      }
      const settings = view.querySelector("#appMenu-settings-button");
      if (!settings) {
        return;
      }
      const item = doc.createXULElement("toolbarbutton");
      item.id = "appMenu-lokum-settings";
      item.className = "subviewbutton";
      item.setAttribute("label", this.t("menu.lokumSettings"));
      item.addEventListener("command", () => openLokumSettings(this.win));
      settings.before(item);
    };
    this.listen(doc, "ViewShowing", onShowing, true);
  }
}

/* -------------------------------------------------------------------------
 * Root attributes shared by all windows
 * ----------------------------------------------------------------------- */

function syncRootAttributes(win) {
  const root = win.document.documentElement;
  const layout = lazy.LokumLayout.current;
  const set = (name, value) => {
    if (value === true) {
      root.setAttribute(name, "true");
    } else if (value === false || value === null || value === undefined || value === "") {
      root.removeAttribute(name);
    } else {
      root.setAttribute(name, String(value));
    }
  };
  set("lokum", true);
  set("lokum-layout", layout);
  set("lokum-vertical", layout !== "horizontal");
  set("lokum-compact", LokumPrefs.get("lokum.compact") && layout !== "horizontal");
  set("lokum-sidebar-end", LokumPrefs.get("lokum.sidebar.position") === "right");
  set("lokum-floating-urlbar", LokumPrefs.get("lokum.floatingUrlbar"));
  set("lokum-sugar", LokumPrefs.get("lokum.sugarDust"));
  set("lokum-grain", LokumPrefs.get("lokum.grain"));
  set("lokum-animations", LokumPrefs.get("lokum.animations"));
  set("lokum-density", LokumPrefs.get("lokum.density"));
  set("lokum-font", LokumPrefs.get("lokum.font.ui"));
  set("lokum-close-button", LokumPrefs.get("lokum.tabs.closeButton"));
  set("lokum-newtab-top", LokumPrefs.get("lokum.tabs.newTabPosition") === "top");
  set("lokum-content-shadow", LokumPrefs.get("lokum.content.shadow"));
  set("lokum-spaces", LokumPrefs.get("lokum.spaces.enabled") && layout !== "horizontal");

  const radius = Math.max(0, Math.min(28, LokumPrefs.get("lokum.content.radius")));
  const margin = Math.max(0, Math.min(24, LokumPrefs.get("lokum.content.margin")));
  root.style.setProperty("--lk-radius", `${radius}px`);
  root.style.setProperty("--lk-margin", `${margin}px`);
  if (!root.hasAttribute("lokum-compact")) {
    root.removeAttribute("lokum-sidebar-peek");
  }
}

function loadSheets(win) {
  const utils = win.windowUtils;
  for (const [type, url] of Object.entries(SHEETS)) {
    try {
      utils.loadSheetUsingURIString(
        url,
        type === "user" ? utils.USER_SHEET : utils.AUTHOR_SHEET
      );
    } catch (ex) {
      console.error("Lokum: could not load " + url, ex);
    }
  }
}

export function openLokumSettings(win, section = "") {
  const url = "about:lokum" + (section ? "#" + section : "");
  win.switchToTabHavingURI(url, true, {
    replaceQueryString: true,
    ignoreFragment: "whenComparingAndReplace",
    triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
  });
}

/* -------------------------------------------------------------------------
 * Pref observers (once for all windows)
 * ----------------------------------------------------------------------- */

let prefsWatched = false;

function watchPrefs() {
  if (prefsWatched) {
    return;
  }
  prefsWatched = true;
  LokumPrefs.observe("lokum.", pref => {
    if (pref === "lokum.layout" || pref === "lokum.sidebar.position") {
      lazy.LokumLayout.applyNow();
    }
    if (pref === "lokum.appearance") {
      applyAppearance();
    }
    for (const c of controllers) {
      c.syncAttributes();
      if (
        pref === "lokum.flavor" ||
        pref === "lokum.accent.custom" ||
        pref === "lokum.spaces.tintFrame"
      ) {
        c.applyFlavor();
      }
      if (pref === "lokum.spaces.enabled") {
        lazy.LokumSpaces.onEnabledChanged?.(c);
      }
    }
  });
}

/** Light / dark / automatic chrome, driven by Firefox's toolbar theme pref. */
function applyAppearance() {
  const value = LokumPrefs.get("lokum.appearance");
  const map = { dark: 0, light: 1, auto: 2 };
  Services.prefs.setIntPref("browser.theme.toolbar-theme", map[value] ?? 2);
  // Web pages follow the content theme; "automatic" (2) website appearance
  // below derives from it, so pages match Lokum's light/dark choice.
  Services.prefs.setIntPref("browser.theme.content-theme", map[value] ?? 2);
  Services.prefs.setIntPref(
    "layout.css.prefers-color-scheme.content-override",
    2
  );
}

export const LokumWindow = {
  /** Before first paint: stylesheets + root attributes. */
  earlyInit(win) {
    if (!isBrowserWindow(win)) {
      return;
    }
    watchPrefs();
    loadSheets(win);
    syncRootAttributes(win);
    const effective = LokumPrefs.get("lokum.flavor");
    LokumFlavors.apply(win.document.documentElement, effective, {
      customAccent: LokumPrefs.get("lokum.accent.custom"),
    });
  },

  /** After browser-delayed-startup-finished. */
  init(win) {
    if (!isBrowserWindow(win) || win.__lokum) {
      return;
    }
    watchPrefs();
    const controller = new LokumWindowController(win);
    win.__lokum = controller;
    controllers.add(controller);
    controller.init();
    if (controllers.size === 1) {
      lazy.LokumLayout.arrangeToolbars();
      applyAppearance();
    }
  },

  get controllers() {
    return [...controllers];
  },

  forWindow(win) {
    return win?.__lokum || null;
  },

  showOnboarding(win) {
    const doc = win.document;
    if (doc.getElementById("lokum-onboarding")) {
      return;
    }
    const frame = doc.createElementNS(HTML_NS, "iframe");
    frame.id = "lokum-onboarding";
    frame.setAttribute("src", ONBOARDING_URL);
    frame.setAttribute("allowtransparency", "true");
    doc.documentElement.setAttribute("lokum-onboarding", "true");
    doc.body.append(frame);
    win.focus();
  },

  closeOnboarding(win) {
    const doc = win.document;
    const frame = doc.getElementById("lokum-onboarding");
    if (!frame) {
      return;
    }
    frame.classList.add("lk-leaving");
    doc.documentElement.removeAttribute("lokum-onboarding");
    win.setTimeout(() => frame.remove(), 900);
  },

  showUpdatedToast(win, from, to) {
    lazy.LokumToast.show(win, {
      icon: "sparkle",
      text: lazy.LokumI18n.t("toast.updated", { version: to }),
      action: {
        label: lazy.LokumI18n.t("toast.whatsNew"),
        callback: () => openLokumSettings(win, "updates"),
      },
      duration: 9000,
    });
  },

  openSettings: openLokumSettings,
};
