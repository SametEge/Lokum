/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Spaces ("Alanlar"): Arc-style groups of tabs. Each space has a name, an
 * emoji icon and optionally its own flavor and container. A window shows one
 * space at a time; the tabs of other spaces are hidden with the standard
 * gBrowser.hideTab() API, so they keep running and are restored by session
 * restore. Pinned tabs are global "favorites" and appear in every space.
 */

import { LokumPrefs } from "chrome://lokum/content/modules/LokumPrefs.sys.mjs";
import { LokumFlavors } from "chrome://lokum/content/modules/LokumFlavors.sys.mjs";

import { defineFirefoxModuleGetters, importFirefoxModule } from "chrome://lokum/content/modules/LokumCompat.sys.mjs";

const lazy = {};
ChromeUtils.defineESModuleGetters(lazy, {
  LokumI18n: "chrome://lokum/content/modules/LokumI18n.sys.mjs",
  LokumToast: "chrome://lokum/content/modules/LokumToast.sys.mjs",
});
defineFirefoxModuleGetters(lazy, ["SessionStore"]);

const TAB_KEY = "lokumSpace";
const WINDOW_KEY = "lokumSpace";
const HIDDEN_BY = "lokum-spaces";
const HTML_NS = "http://www.w3.org/1999/xhtml";
const FILE_NAME = "spaces.json";

export const SPACE_ICONS = [
  "🌸", "💼", "🏠", "🎨", "📚", "🎮", "🎧", "✈️", "🛒", "🍳", "💡", "🧪",
  "⚽", "🎬", "📷", "🌿", "🌙", "☕", "🍋", "🍓", "🧁", "🍬", "💜", "⭐",
  "🔥", "🌊", "🏔️", "🐱", "🐶", "🦊", "🧘", "💰", "📈", "🗂️", "🔒", "🚀",
];

const DEFAULT_SPACES = () => [
  { id: "home", name: "", icon: "🌸", flavor: null, container: 0 },
];

function uid() {
  return Services.uuid.generateUUID().toString().slice(1, 9);
}

function el(doc, tag, attrs = {}, ...children) {
  const node = doc.createElementNS(HTML_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) {
      continue;
    }
    if (k === "class") {
      node.className = v;
    } else if (k === "text") {
      node.textContent = v;
    } else if (k.startsWith("on") && typeof v === "function") {
      node.addEventListener(k.slice(2), v);
    } else {
      node.setAttribute(k, v === true ? "" : v);
    }
  }
  node.append(...children.filter(Boolean));
  return node;
}

function iconImg(doc, name) {
  const img = el(doc, "img", {
    class: "lk-icon",
    src: `chrome://lokum/content/images/icons/${name}.svg`,
    alt: "",
    role: "presentation",
  });
  return img;
}

/* -------------------------------------------------------------------------
 * Store
 * ----------------------------------------------------------------------- */

const store = {
  spaces: DEFAULT_SPACES(),
  loaded: false,
  _saveTask: null,

  get file() {
    return PathUtils.join(PathUtils.profileDir, "lokum", FILE_NAME);
  },

  load() {
    if (this.loaded) {
      return;
    }
    this.loaded = true;
    try {
      const file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
      file.initWithPath(this.file);
      if (file.exists()) {
        const data = JSON.parse(Cu.readUTF8File(file));
        if (Array.isArray(data.spaces) && data.spaces.length) {
          this.spaces = data.spaces
            .filter(s => s && typeof s.id === "string")
            .map(s => ({
              id: s.id,
              name: String(s.name || ""),
              icon: String(s.icon || "🌸"),
              flavor: s.flavor && LokumFlavors.has(s.flavor) ? s.flavor : null,
              container: Number(s.container) || 0,
            }));
        }
      }
    } catch (ex) {
      console.error("Lokum: could not read spaces", ex);
    }
    if (!this.spaces.length) {
      this.spaces = DEFAULT_SPACES();
    }
  },

  save() {
    if (this._saveTask) {
      return;
    }
    this._saveTask = Promise.resolve().then(async () => {
      this._saveTask = null;
      await this.flush();
    });
  },

  async flush() {
    try {
      await IOUtils.makeDirectory(PathUtils.parent(this.file), { ignoreExisting: true });
      await IOUtils.writeJSON(this.file, { version: 1, spaces: this.spaces }, {
        tmpPath: this.file + ".tmp",
      });
    } catch (ex) {
      console.error("Lokum: could not save spaces", ex);
    }
  },

  get(id) {
    return this.spaces.find(s => s.id === id) || null;
  },
};

/* -------------------------------------------------------------------------
 * Per window
 * ----------------------------------------------------------------------- */

class WindowSpaces {
  constructor(controller) {
    this.controller = controller;
    this.win = controller.win;
    this.doc = controller.doc;
    this.gBrowser = this.win.gBrowser;
    this.lastSelected = new Map(); // spaceId -> WeakRef(tab)
    this.activeId = null;
    this._wheelLock = 0;
  }

  get enabled() {
    return (
      LokumPrefs.get("lokum.spaces.enabled") &&
      this.doc.documentElement.getAttribute("lokum-layout") !== "horizontal"
    );
  }

  get active() {
    return store.get(this.activeId) || store.spaces[0];
  }

  init() {
    const saved = lazy.SessionStore.getCustomWindowValue(this.win, WINDOW_KEY);
    this.activeId = store.get(saved) ? saved : store.spaces[0].id;
    this.buildUI();

    const tc = this.gBrowser.tabContainer;
    const listen = (target, type, fn) => this.controller.listen(target, type, fn);
    listen(tc, "TabOpen", e => this.onTabOpen(e.target));
    listen(tc, "TabSelect", e => this.onTabSelect(e.target));
    listen(tc, "TabClose", e => this.onTabClose(e.target));
    listen(tc, "SSTabRestoring", e => this.onTabRestoring(e.target));
    listen(this.win, "SSWindowRestored", () => this.applyVisibility());
    lazy.SessionStore.promiseAllWindowsRestored.then(() => {
      if (!this.win.closed) {
        this.applyVisibility();
      }
    });
    this.applyVisibility();
    this.render();
  }

  /* --------------------------- tabs ------------------------------------ */

  spaceOfTab(tab) {
    const value = lazy.SessionStore.getCustomTabValue(tab, TAB_KEY);
    return store.get(value) ? value : null;
  }

  assign(tab, spaceId) {
    if (tab.pinned) {
      return;
    }
    lazy.SessionStore.setCustomTabValue(tab, TAB_KEY, spaceId);
  }

  onTabOpen(tab) {
    if (!this.enabled || tab.pinned) {
      return;
    }
    // Restored tabs get their space from session data (SSTabRestoring).
    // Everything else belongs to the space it was opened in.
    Services.tm.dispatchToMainThread(() => {
      if (tab.closing || !tab.isConnected || this.spaceOfTab(tab)) {
        return;
      }
      this.assign(tab, this.activeId);
      const space = this.active;
      if (space.container && !tab.userContextId && !tab.openerTab) {
        // Containers are applied when opening new tabs from the space (see
        // openNewTab); links keep their opener's container.
      }
      if (
        LokumPrefs.get("lokum.tabs.newTabPosition") === "top" &&
        !tab.openerTab &&
        !tab.group &&
        tab.linkedBrowser?.currentURI?.spec?.startsWith("about:")
      ) {
        this.moveToTop(tab);
      }
    });
  }

  moveToTop(tab) {
    const first = this.gBrowser.visibleTabs.find(t => !t.pinned && t !== tab);
    if (first && first._tPos < tab._tPos && !first.group) {
      try {
        this.gBrowser.moveTabTo(tab, { tabIndex: first._tPos });
      } catch (ex) {}
    }
  }

  onTabRestoring(tab) {
    if (!this.enabled) {
      return;
    }
    const space = this.spaceOfTab(tab);
    if (space && space !== this.activeId && !tab.selected) {
      this.gBrowser.hideTab(tab, HIDDEN_BY);
    } else if (tab.hidden && lazy.SessionStore.getCustomTabValue(tab, "hiddenBy") === HIDDEN_BY) {
      this.gBrowser.showTab(tab);
    }
  }

  onTabSelect(tab) {
    if (!this.enabled || tab.pinned) {
      this.render();
      return;
    }
    const space = this.spaceOfTab(tab);
    if (space && space !== this.activeId) {
      // Selected from the tab list / search / another window: follow it.
      this.switchTo(space, { select: false, animate: true });
      return;
    }
    this.lastSelected.set(this.activeId, Cu.getWeakReference(tab));
    this.render();
  }

  onTabClose(tab) {
    if (!this.enabled || tab.pinned || !tab.selected) {
      this.renderSoon();
      return;
    }
    // Closing the last tab of a space: keep the space alive with a new tab
    // instead of jumping into another space.
    const remaining = this.tabsOf(this.activeId).filter(t => t !== tab && !t.closing);
    if (!remaining.length) {
      Services.tm.dispatchToMainThread(() => {
        if (!this.win.closed && !this.tabsOf(this.activeId).length) {
          this.openNewTab();
        }
      });
    }
    this.renderSoon();
  }

  tabsOf(spaceId) {
    const fallback = store.spaces[0].id;
    return this.gBrowser.tabs.filter(tab => {
      if (tab.pinned || tab.closing) {
        return false;
      }
      const space = this.spaceOfTab(tab);
      if (space) {
        return space === spaceId;
      }
      // Unassigned tabs belong to the active space if visible, else to the
      // first space.
      return !tab.hidden ? spaceId === this.activeId : spaceId === fallback;
    });
  }

  openNewTab(url = null) {
    const space = this.active;
    const tab = this.gBrowser.addTrustedTab(url || this.win.BROWSER_NEW_TAB_URL || "about:newtab", {
      userContextId: space.container || 0,
    });
    this.assign(tab, space.id);
    this.gBrowser.selectedTab = tab;
    if (!url) {
      this.win.gURLBar?.select();
    }
    return tab;
  }

  /** Shows the tabs of the active space and hides everything else. */
  applyVisibility() {
    if (!this.enabled) {
      for (const tab of this.gBrowser.tabs) {
        if (tab.hidden && lazy.SessionStore.getCustomTabValue(tab, "hiddenBy") === HIDDEN_BY) {
          this.gBrowser.showTab(tab);
        }
      }
      this.render();
      return;
    }
    const selected = this.gBrowser.selectedTab;
    const selectedSpace = selected.pinned ? null : this.spaceOfTab(selected);
    if (selectedSpace && selectedSpace !== this.activeId) {
      this.activeId = selectedSpace;
    }
    for (const tab of this.gBrowser.tabs) {
      if (tab.pinned) {
        continue;
      }
      let space = this.spaceOfTab(tab);
      if (!space) {
        space = tab.hidden ? store.spaces[0].id : this.activeId;
        if (!tab.hidden || lazy.SessionStore.getCustomTabValue(tab, "hiddenBy") === HIDDEN_BY) {
          this.assign(tab, space);
        } else {
          continue; // Hidden by an extension; leave it alone.
        }
      }
      if (space === this.activeId) {
        if (tab.hidden && lazy.SessionStore.getCustomTabValue(tab, "hiddenBy") === HIDDEN_BY) {
          this.gBrowser.showTab(tab);
        }
      } else if (!tab.hidden && !tab.selected) {
        this.gBrowser.hideTab(tab, HIDDEN_BY);
      }
    }
    lazy.SessionStore.setCustomWindowValue(this.win, WINDOW_KEY, this.activeId);
    this.controller.applyFlavor();
    this.render();
  }

  /* --------------------------- switching -------------------------------- */

  switchTo(spaceId, { select = true, animate = true } = {}) {
    if (!this.enabled || !store.get(spaceId)) {
      return;
    }
    const previous = this.activeId;
    if (previous === spaceId) {
      return;
    }
    // Remember tabs of the space we leave.
    for (const tab of this.gBrowser.visibleTabs) {
      if (!tab.pinned && !this.spaceOfTab(tab)) {
        this.assign(tab, previous);
      }
    }
    const order = store.spaces.map(s => s.id);
    const direction = order.indexOf(spaceId) > order.indexOf(previous) ? "next" : "prev";
    this.activeId = spaceId;

    const targets = this.tabsOf(spaceId);
    for (const tab of targets) {
      this.gBrowser.showTab(tab);
    }
    if (select) {
      const remembered = this.lastSelected.get(spaceId)?.get();
      let target =
        remembered && !remembered.closing && remembered.isConnected && targets.includes(remembered)
          ? remembered
          : targets.toSorted((a, b) => b.lastAccessed - a.lastAccessed)[0];
      if (target) {
        this.gBrowser.selectedTab = target;
      } else if (!this.gBrowser.selectedTab.pinned) {
        this.openNewTab();
      }
    }
    for (const tab of this.gBrowser.tabs) {
      if (!tab.pinned && !tab.hidden && !targets.includes(tab) && !tab.selected) {
        this.gBrowser.hideTab(tab, HIDDEN_BY);
      }
    }
    lazy.SessionStore.setCustomWindowValue(this.win, WINDOW_KEY, spaceId);
    this.controller.applyFlavor();

    if (animate && LokumPrefs.get("lokum.animations") !== "off") {
      const root = this.doc.documentElement;
      root.setAttribute("lokum-space-anim", direction);
      this.win.clearTimeout(this._animTimer);
      this._animTimer = this.win.setTimeout(() => root.removeAttribute("lokum-space-anim"), 420);
    }
    this.render();
    this.controller.peekSidebar?.();
  }

  cycle(step) {
    const ids = store.spaces.map(s => s.id);
    const index = ids.indexOf(this.activeId);
    const next = ids[(index + step + ids.length) % ids.length];
    this.switchTo(next);
  }

  moveTab(tab, spaceId) {
    if (tab.pinned || !store.get(spaceId)) {
      return;
    }
    this.assign(tab, spaceId);
    if (spaceId !== this.activeId) {
      if (tab.selected) {
        const others = this.tabsOf(this.activeId).filter(t => t !== tab);
        if (others.length) {
          this.gBrowser.selectedTab = others.toSorted((a, b) => b.lastAccessed - a.lastAccessed)[0];
        } else {
          this.openNewTab();
        }
      }
      this.gBrowser.hideTab(tab, HIDDEN_BY);
      lazy.LokumToast.show(this.win, {
        text: lazy.LokumI18n.t("spaces.tabMoved", { space: displayName(store.get(spaceId)) }),
      });
    }
    this.render();
  }

  /** Arc's "Clear": closes the unpinned tabs of the current space. */
  clearTabs() {
    const tabs = this.tabsOf(this.activeId);
    if (!tabs.length) {
      return;
    }
    this.openNewTab();
    this.gBrowser.removeTabs(tabs, { animate: true });
  }

  /* --------------------------- UI --------------------------------------- */

  buildUI() {
    const doc = this.doc;
    const t = lazy.LokumI18n.t.bind(lazy.LokumI18n);

    // Header: goes between the favorites grid and the tab list.
    this.header = el(doc, "div", { id: "lokum-space-header", class: "lk-space-header" },
      el(doc, "span", { class: "lk-space-icon" }),
      el(doc, "span", { class: "lk-space-name", tabindex: "-1" }),
      el(doc, "button", {
        class: "lk-space-clear",
        title: t("spaces.clear.tooltip"),
        onclick: () => this.clearTabs(),
      }, el(doc, "span", { text: t("spaces.clear") })),
      el(doc, "button", {
        class: "lk-space-more",
        title: t("spaces.options"),
        onclick: e => this.openSpaceMenu(e.currentTarget, this.activeId),
      }, iconImg(doc, "more"))
    );
    const nameNode = this.header.querySelector(".lk-space-name");
    nameNode.addEventListener("dblclick", () => this.startRename(nameNode));
    this.header.addEventListener("contextmenu", e => {
      e.preventDefault();
      this.openSpaceMenu(this.header, this.activeId, e);
    });

    const tabs = doc.getElementById("tabbrowser-tabs");
    const scrollbox = doc.getElementById("tabbrowser-arrowscrollbox");
    if (tabs && scrollbox?.parentNode === tabs) {
      tabs.insertBefore(this.header, scrollbox);
    }

    // Footer: space switcher dots + library + new space.
    this.dots = el(doc, "div", { class: "lk-space-dots", role: "tablist" });
    this.footer = el(doc, "div", { id: "lokum-sidebar-footer", slot: "tabstrip" },
      el(doc, "button", {
        class: "lk-footer-button lk-library-button",
        title: t("sidebar.library"),
        onclick: e => this.openLibraryMenu(e.currentTarget),
      }, iconImg(doc, "library")),
      this.dots,
      el(doc, "button", {
        class: "lk-footer-button lk-new-space",
        title: t("spaces.new"),
        onclick: () => this.createSpaceInteractive(),
      }, iconImg(doc, "plus"))
    );
    const verticalTabs = doc.getElementById("vertical-tabs");
    if (verticalTabs) {
      verticalTabs.after(this.footer);
    }

    // Horizontal wheel / two-finger swipe over the sidebar switches spaces.
    const sidebar = doc.getElementById("sidebar-container");
    if (sidebar) {
      this.controller.listen(sidebar, "wheel", e => this.onWheel(e), { passive: true });
    }
    this.controller.listen(this.dots, "wheel", e => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        this.cycleByWheel(e.deltaY);
      }
    }, { passive: true });

    this.addTabContextMenu();
  }

  onWheel(event) {
    if (!LokumPrefs.get("lokum.spaces.swipe")) {
      return;
    }
    const dx = event.deltaX || (event.shiftKey ? event.deltaY : 0);
    if (Math.abs(dx) < 24 || Math.abs(dx) < Math.abs(event.deltaY) * 1.5 && !event.shiftKey) {
      return;
    }
    this.cycleByWheel(dx);
  }

  cycleByWheel(delta) {
    const now = Date.now();
    if (now - this._wheelLock < 650) {
      return;
    }
    this._wheelLock = now;
    this.cycle(delta > 0 ? 1 : -1);
  }

  renderSoon() {
    if (this._renderQueued) {
      return;
    }
    this._renderQueued = true;
    this.win.requestAnimationFrame(() => {
      this._renderQueued = false;
      this.render();
    });
  }

  render() {
    const root = this.doc.documentElement;
    root.toggleAttribute("lokum-spaces", this.enabled);
    if (!this.header) {
      return;
    }
    const space = this.active;
    this.header.querySelector(".lk-space-icon").textContent = space.icon;
    const nameNode = this.header.querySelector(".lk-space-name");
    if (!nameNode.isContentEditable) {
      nameNode.textContent = displayName(space);
    }
    const flavor = LokumFlavors.swatch(space.flavor || LokumPrefs.get("lokum.flavor"));
    this.header.style.setProperty("--space-accent", `light-dark(${flavor.light.accent}, ${flavor.dark.accent})`);

    const doc = this.doc;
    const existing = new Map([...this.dots.children].map(d => [d.dataset.space, d]));
    const wanted = store.spaces.map(s => s.id);
    for (const [id, node] of existing) {
      if (!wanted.includes(id)) {
        node.remove();
      }
    }
    store.spaces.forEach((s, index) => {
      let dot = existing.get(s.id);
      if (!dot) {
        dot = el(doc, "button", {
          class: "lk-space-dot",
          role: "tab",
          "data-space": s.id,
          onclick: () => this.switchTo(s.id),
          oncontextmenu: e => {
            e.preventDefault();
            this.openSpaceMenu(dot, s.id, e);
          },
        }, el(doc, "span", { class: "lk-space-dot-icon" }));
        dot.addEventListener("dragover", e => this.onDotDragOver(e, s.id));
        dot.addEventListener("dragleave", () => dot.removeAttribute("dragover"));
        dot.addEventListener("drop", e => this.onDotDrop(e, s.id));
      }
      const f = LokumFlavors.swatch(s.flavor || LokumPrefs.get("lokum.flavor"));
      dot.style.setProperty("--dot-color", `light-dark(${f.light.accent}, ${f.dark.accent})`);
      dot.querySelector(".lk-space-dot-icon").textContent = s.icon;
      dot.title = displayName(s) + (index < 9 ? `  (Ctrl+Alt+${index + 1})` : "");
      dot.toggleAttribute("selected", s.id === this.activeId);
      dot.setAttribute("aria-selected", s.id === this.activeId);
      this.dots.append(dot);
    });
    this.footer.toggleAttribute("single", store.spaces.length === 1);
  }

  onDotDragOver(event, spaceId) {
    const dt = event.dataTransfer;
    if (dt.types.includes("application/x-moz-tabbrowser-tab")) {
      event.preventDefault();
      dt.dropEffect = "move";
      event.currentTarget.setAttribute("dragover", "true");
      if (spaceId !== this.activeId) {
        // Hovering a dot while dragging switches after a short delay, like Arc.
        this.win.clearTimeout(this._dragSwitch);
      }
    }
  }

  onDotDrop(event, spaceId) {
    event.preventDefault();
    event.currentTarget.removeAttribute("dragover");
    const dt = event.dataTransfer;
    const tab = dt.mozGetDataAt("application/x-moz-tabbrowser-tab", 0);
    if (tab && tab.ownerGlobal === this.win) {
      this.moveTab(tab, spaceId);
    }
  }

  startRename(node) {
    node.contentEditable = "true";
    node.focus();
    const sel = this.win.getSelection();
    sel.selectAllChildren(node);
    const finish = commit => {
      node.contentEditable = "false";
      node.removeEventListener("keydown", onKey);
      node.removeEventListener("blur", onBlur);
      if (commit) {
        const value = node.textContent.trim().slice(0, 40);
        LokumSpaces.update(this.activeId, { name: value });
      }
      this.render();
    };
    const onKey = e => {
      if (e.key === "Enter") {
        e.preventDefault();
        finish(true);
      } else if (e.key === "Escape") {
        e.preventDefault();
        finish(false);
      }
      e.stopPropagation();
    };
    const onBlur = () => finish(true);
    node.addEventListener("keydown", onKey);
    node.addEventListener("blur", onBlur);
  }

  createSpaceInteractive() {
    const used = new Set(store.spaces.map(s => s.flavor));
    const flavor = LokumFlavors.ids.find(id => !used.has(id) && id !== "karisik") || "fistik";
    const icon = SPACE_ICONS.find(i => !store.spaces.some(s => s.icon === i)) || "⭐";
    const space = LokumSpaces.create({ name: "", icon, flavor });
    this.switchTo(space.id);
    this.openNewTab();
    // Let the user name it right away.
    this.win.setTimeout(() => {
      const nameNode = this.header?.querySelector(".lk-space-name");
      if (nameNode) {
        this.startRename(nameNode);
      }
    }, 80);
  }

  /* --------------------------- menus ------------------------------------ */

  openSpaceMenu(anchor, spaceId, event) {
    const doc = this.doc;
    const t = lazy.LokumI18n.t.bind(lazy.LokumI18n);
    const space = store.get(spaceId);
    if (!space) {
      return;
    }
    let popup = doc.getElementById("lokum-space-menu");
    popup?.remove();
    popup = doc.createXULElement("menupopup");
    popup.id = "lokum-space-menu";

    const item = (label, fn, attrs = {}) => {
      const mi = doc.createXULElement("menuitem");
      mi.setAttribute("label", label);
      for (const [k, v] of Object.entries(attrs)) {
        mi.setAttribute(k, v);
      }
      mi.addEventListener("command", fn);
      popup.append(mi);
      return mi;
    };
    const sep = () => popup.append(doc.createXULElement("menuseparator"));

    item(t("spaces.rename"), () => {
      if (spaceId !== this.activeId) {
        this.switchTo(spaceId);
      }
      this.win.setTimeout(() => this.startRename(this.header.querySelector(".lk-space-name")), 50);
    });

    // Icon picker
    const iconMenu = doc.createXULElement("menu");
    iconMenu.setAttribute("label", t("spaces.icon"));
    const iconPopup = doc.createXULElement("menupopup");
    iconPopup.classList.add("lk-emoji-grid");
    for (const emoji of SPACE_ICONS) {
      const mi = doc.createXULElement("menuitem");
      mi.setAttribute("label", emoji);
      mi.classList.add("lk-emoji-item");
      if (emoji === space.icon) {
        mi.setAttribute("checked", "true");
      }
      mi.addEventListener("command", () => LokumSpaces.update(spaceId, { icon: emoji }));
      iconPopup.append(mi);
    }
    iconMenu.append(iconPopup);
    popup.append(iconMenu);

    // Flavor picker
    const flavorMenu = doc.createXULElement("menu");
    flavorMenu.setAttribute("label", t("spaces.flavor"));
    const flavorPopup = doc.createXULElement("menupopup");
    const inherit = doc.createXULElement("menuitem");
    inherit.setAttribute("type", "radio");
    inherit.setAttribute("label", t("spaces.flavor.global"));
    if (!space.flavor) {
      inherit.setAttribute("checked", "true");
    }
    inherit.addEventListener("command", () => LokumSpaces.update(spaceId, { flavor: null }));
    flavorPopup.append(inherit, doc.createXULElement("menuseparator"));
    for (const id of LokumFlavors.ids) {
      const f = LokumFlavors.swatch(id);
      const mi = doc.createXULElement("menuitem");
      mi.setAttribute("type", "radio");
      mi.setAttribute("label", `${f.emoji}  ${t(`flavor.${id}`)}`);
      if (space.flavor === id) {
        mi.setAttribute("checked", "true");
      }
      mi.addEventListener("command", () => LokumSpaces.update(spaceId, { flavor: id }));
      flavorPopup.append(mi);
    }
    flavorMenu.append(flavorPopup);
    popup.append(flavorMenu);

    // Container picker
    const identities = this._containers();
    if (identities.length) {
      const cMenu = doc.createXULElement("menu");
      cMenu.setAttribute("label", t("spaces.container"));
      const cPopup = doc.createXULElement("menupopup");
      const none = doc.createXULElement("menuitem");
      none.setAttribute("type", "radio");
      none.setAttribute("label", t("spaces.container.none"));
      if (!space.container) {
        none.setAttribute("checked", "true");
      }
      none.addEventListener("command", () => LokumSpaces.update(spaceId, { container: 0 }));
      cPopup.append(none);
      for (const identity of identities) {
        const mi = doc.createXULElement("menuitem");
        mi.setAttribute("type", "radio");
        mi.setAttribute("label", identity.label);
        if (space.container === identity.id) {
          mi.setAttribute("checked", "true");
        }
        mi.addEventListener("command", () => LokumSpaces.update(spaceId, { container: identity.id }));
        cPopup.append(mi);
      }
      cMenu.append(cPopup);
      popup.append(cMenu);
    }

    sep();
    item(t("spaces.clear.tooltip"), () => {
      if (spaceId !== this.activeId) {
        this.switchTo(spaceId);
      }
      this.clearTabs();
    });
    item(t("spaces.new"), () => this.createSpaceInteractive());
    if (store.spaces.length > 1) {
      sep();
      item(t("spaces.delete"), () => LokumSpaces.remove(spaceId, this.win));
    }

    doc.getElementById("mainPopupSet").append(popup);
    if (event) {
      popup.openPopupAtScreen(event.screenX, event.screenY, true);
    } else {
      popup.openPopup(anchor, "after_start", 0, 4, false, false);
    }
  }

  openLibraryMenu(anchor) {
    const doc = this.doc;
    const win = this.win;
    const t = lazy.LokumI18n.t.bind(lazy.LokumI18n);
    let popup = doc.getElementById("lokum-library-menu");
    popup?.remove();
    popup = doc.createXULElement("menupopup");
    popup.id = "lokum-library-menu";
    const entries = [
      ["sidebar.history", () => win.SidebarController?.toggle("viewHistorySidebar")],
      ["sidebar.bookmarks", () => win.SidebarController?.toggle("viewBookmarksSidebar")],
      ["sidebar.downloads", () => win.DownloadsPanel?.showDownloadsHistory?.() ?? win.BrowserCommands?.downloadsUI?.()],
      ["sidebar.archive", () => win.__lokum && lazy.LokumSpaces.openArchive(win)],
      ["sidebar.extensions", () => win.BrowserAddonUI?.openAddonsMgr("addons://list/extension")],
      [null],
      ["sidebar.settings", () => win.__lokum && ChromeUtils.importESModule("chrome://lokum/content/modules/LokumWindow.sys.mjs").LokumWindow.openSettings(win)],
    ];
    for (const [key, fn] of entries) {
      if (!key) {
        popup.append(doc.createXULElement("menuseparator"));
        continue;
      }
      const mi = doc.createXULElement("menuitem");
      mi.setAttribute("label", t(key));
      mi.addEventListener("command", () => {
        try {
          fn();
        } catch (ex) {
          console.error(ex);
        }
      });
      popup.append(mi);
    }
    doc.getElementById("mainPopupSet").append(popup);
    popup.openPopup(anchor, "before_start", 0, -4, false, false);
  }

  addTabContextMenu() {
    const doc = this.doc;
    const context = doc.getElementById("tabContextMenu");
    if (!context || doc.getElementById("lokum-context-move-space")) {
      return;
    }
    const menu = doc.createXULElement("menu");
    menu.id = "lokum-context-move-space";
    menu.setAttribute("label", lazy.LokumI18n.t("spaces.moveTab"));
    const popup = doc.createXULElement("menupopup");
    menu.append(popup);
    const anchor = doc.getElementById("context_moveTabOptions") || context.firstElementChild;
    anchor?.after(menu);

    this.controller.listen(context, "popupshowing", e => {
      if (e.target !== context) {
        return;
      }
      const tab = this.win.TabContextMenu?.contextTab;
      menu.hidden = !this.enabled || !tab || tab.pinned || store.spaces.length < 2;
      if (menu.hidden) {
        return;
      }
      popup.replaceChildren();
      const current = this.spaceOfTab(tab) || this.activeId;
      for (const s of store.spaces) {
        const mi = doc.createXULElement("menuitem");
        mi.setAttribute("label", `${s.icon}  ${displayName(s)}`);
        mi.setAttribute("type", "radio");
        if (s.id === current) {
          mi.setAttribute("checked", "true");
          mi.setAttribute("disabled", "true");
        }
        mi.addEventListener("command", () => {
          const tabs = this.win.TabContextMenu.contextTab.multiselected
            ? this.gBrowser.selectedTabs
            : [this.win.TabContextMenu.contextTab];
          for (const t of tabs) {
            this.moveTab(t, s.id);
          }
        });
        popup.append(mi);
      }
    });
  }

  _containers() {
    try {
      if (!Services.prefs.getBoolPref("privacy.userContext.enabled", false)) {
        return [];
      }
      const ContextualIdentityService = importFirefoxModule("ContextualIdentityService");
      return ContextualIdentityService.getPublicIdentities().map(i => ({
        id: i.userContextId,
        label: ContextualIdentityService.getUserContextLabel(i.userContextId),
      }));
    } catch (ex) {
      return [];
    }
  }
}

function displayName(space) {
  if (space?.name) {
    return space.name;
  }
  const index = store.spaces.indexOf(space);
  return index <= 0
    ? lazy.LokumI18n.t("spaces.defaultName")
    : lazy.LokumI18n.t("spaces.numbered", { n: index + 1 });
}

/* -------------------------------------------------------------------------
 * Public API
 * ----------------------------------------------------------------------- */

const windows = new Map(); // window -> WindowSpaces

export const LokumSpaces = {
  init() {
    store.load();
  },

  flush() {
    return store.flush();
  },

  get spaces() {
    store.load();
    return store.spaces.map(s => ({ ...s, displayName: displayName(s) }));
  },

  attachWindow(controller) {
    store.load();
    const ws = new WindowSpaces(controller);
    windows.set(controller.win, ws);
    ws.init();
  },

  detachWindow(controller) {
    windows.delete(controller.win);
  },

  forWindow(win) {
    return windows.get(win) || null;
  },

  flavorForWindow(win) {
    const ws = windows.get(win);
    if (!ws || !ws.enabled) {
      return null;
    }
    return ws.active?.flavor || null;
  },

  activeSpace(win) {
    return windows.get(win)?.active || store.spaces[0];
  },

  switchTo(win, id) {
    windows.get(win)?.switchTo(id);
  },

  switchToIndex(win, index) {
    const space = store.spaces[index];
    if (space) {
      windows.get(win)?.switchTo(space.id);
    }
  },

  cycle(win, step) {
    windows.get(win)?.cycle(step);
  },

  newTabInSpace(win) {
    return windows.get(win)?.openNewTab();
  },

  create({ name = "", icon = "⭐", flavor = null, container = 0 } = {}) {
    store.load();
    const space = {
      id: uid(),
      name: String(name).slice(0, 40),
      icon,
      flavor: flavor && LokumFlavors.has(flavor) ? flavor : null,
      container: Number(container) || 0,
    };
    store.spaces.push(space);
    store.save();
    this._rerender();
    Services.obs.notifyObservers(null, "lokum-spaces-changed");
    return space;
  },

  update(id, changes) {
    const space = store.get(id);
    if (!space) {
      return;
    }
    if ("name" in changes) {
      space.name = String(changes.name || "").slice(0, 40);
    }
    if ("icon" in changes && changes.icon) {
      space.icon = String(changes.icon);
    }
    if ("flavor" in changes) {
      space.flavor = changes.flavor && LokumFlavors.has(changes.flavor) ? changes.flavor : null;
    }
    if ("container" in changes) {
      space.container = Number(changes.container) || 0;
    }
    store.save();
    for (const ws of windows.values()) {
      ws.render();
      ws.controller.applyFlavor();
    }
    Services.obs.notifyObservers(null, "lokum-spaces-changed");
  },

  move(id, toIndex) {
    const from = store.spaces.findIndex(s => s.id === id);
    if (from < 0) {
      return;
    }
    const [space] = store.spaces.splice(from, 1);
    store.spaces.splice(Math.max(0, Math.min(store.spaces.length, toIndex)), 0, space);
    store.save();
    this._rerender();
    Services.obs.notifyObservers(null, "lokum-spaces-changed");
  },

  /** Deletes a space; its tabs move to the first remaining space. */
  remove(id, win = null) {
    if (store.spaces.length < 2 || !store.get(id)) {
      return;
    }
    const index = store.spaces.findIndex(s => s.id === id);
    store.spaces.splice(index, 1);
    const fallback = store.spaces[Math.max(0, index - 1)].id;
    for (const ws of windows.values()) {
      for (const tab of ws.gBrowser.tabs) {
        if (lazy.SessionStore.getCustomTabValue(tab, TAB_KEY) === id) {
          ws.assign(tab, fallback);
        }
      }
      if (ws.activeId === id) {
        ws.activeId = fallback;
      }
      ws.applyVisibility();
    }
    store.save();
    Services.obs.notifyObservers(null, "lokum-spaces-changed");
    if (win) {
      lazy.LokumToast.show(win, { text: lazy.LokumI18n.t("spaces.deleted") });
    }
  },

  onEnabledChanged(controller) {
    windows.get(controller.win)?.applyVisibility();
  },

  openArchive(win) {
    ChromeUtils.importESModule("chrome://lokum/content/modules/LokumWindow.sys.mjs")
      .LokumWindow.openSettings(win, "archive");
  },

  _rerender() {
    for (const ws of windows.values()) {
      ws.render();
    }
  },
};
