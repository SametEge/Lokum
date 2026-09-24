/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * The Lokum command palette (Ctrl+K): fuzzy search over browser actions,
 * spaces, flavors, layouts and every open tab in the window.
 */

import { LokumPrefs } from "chrome://lokum/content/modules/LokumPrefs.sys.mjs";
import { LokumFlavors } from "chrome://lokum/content/modules/LokumFlavors.sys.mjs";
import { fuzzyScore } from "chrome://lokum/content/modules/LokumCore.sys.mjs";

import { defineFirefoxModuleGetters } from "chrome://lokum/content/modules/LokumCompat.sys.mjs";

const lazy = {};
ChromeUtils.defineESModuleGetters(lazy, {
  LokumI18n: "chrome://lokum/content/modules/LokumI18n.sys.mjs",
  LokumLayout: "chrome://lokum/content/modules/LokumLayout.sys.mjs",
  LokumSpaces: "chrome://lokum/content/modules/LokumSpaces.sys.mjs",
  LokumUpdater: "chrome://lokum/content/modules/LokumUpdater.sys.mjs",
  LokumWindow: "chrome://lokum/content/modules/LokumWindow.sys.mjs",
});
defineFirefoxModuleGetters(lazy, ["SessionStore"]);

const HTML_NS = "http://www.w3.org/1999/xhtml";

function el(doc, tag, cls, text) {
  const node = doc.createElementNS(HTML_NS, tag);
  if (cls) {
    node.className = cls;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
}

function commandsFor(win) {
  const t = lazy.LokumI18n.t.bind(lazy.LokumI18n);
  const gBrowser = win.gBrowser;
  const cmd = id => () => win.document.getElementById(id)?.doCommand();
  const list = [
    { id: "new-tab", icon: "plus", label: t("palette.newTab"), keys: "Ctrl+T", run: () => lazy.LokumSpaces.newTabInSpace(win) || cmd("cmd_newNavigatorTab")() },
    { id: "new-window", icon: "window", label: t("palette.newWindow"), keys: "Ctrl+N", run: cmd("cmd_newNavigator") },
    { id: "private", icon: "private", label: t("palette.privateWindow"), keys: "Ctrl+Shift+P", run: cmd("Tools:PrivateBrowsing") },
    { id: "reopen", icon: "undo", label: t("palette.reopenTab"), keys: "Ctrl+Shift+T", run: () => win.undoCloseTab?.() ?? lazy.SessionStore.undoCloseTab(win, 0) },
    { id: "close-tab", icon: "close", label: t("palette.closeTab"), keys: "Ctrl+W", run: () => gBrowser.removeTab(gBrowser.selectedTab, { animate: true }) },
    { id: "duplicate", icon: "copy", label: t("palette.duplicateTab"), run: () => gBrowser.selectedTab = gBrowser.duplicateTab(gBrowser.selectedTab) },
    { id: "pin", icon: "pin", label: t("palette.pinTab"), run: () => gBrowser.selectedTab.pinned ? gBrowser.unpinTab(gBrowser.selectedTab) : gBrowser.pinTab(gBrowser.selectedTab) },
    { id: "copy-url", icon: "link", label: t("palette.copyUrl"), keys: "Ctrl+Shift+C", run: () => win.__lokum?.copyCurrentUrl() },
    { id: "split", icon: "split", label: t("palette.splitView"), run: () => openSplitView(win) },
    { id: "compact", icon: "sidebar", label: t("palette.toggleSidebar"), keys: "Ctrl+Alt+S", run: () => LokumPrefs.set("lokum.compact", !LokumPrefs.get("lokum.compact")) },
    { id: "new-space", icon: "sparkle", label: t("spaces.new"), run: () => lazy.LokumSpaces.forWindow(win)?.createSpaceInteractive() },
    { id: "clear-space", icon: "broom", label: t("spaces.clear.tooltip"), run: () => lazy.LokumSpaces.forWindow(win)?.clearTabs() },
    { id: "reader", icon: "reader", label: t("palette.readerMode"), keys: "F9", run: () => win.AboutReaderParent?.toggleReaderMode({ target: gBrowser.selectedBrowser }) ?? cmd("View:ReaderView")() },
    { id: "pip", icon: "pip", label: t("palette.pip"), run: cmd("View:PictureInPicture") },
    { id: "screenshot", icon: "camera", label: t("palette.screenshot"), keys: "Ctrl+Shift+S", run: cmd("Browser:Screenshot") },
    { id: "find", icon: "search", label: t("palette.find"), keys: "Ctrl+F", run: cmd("cmd_find") },
    { id: "print", icon: "print", label: t("palette.print"), keys: "Ctrl+P", run: cmd("cmd_print") },
    { id: "zoom-in", icon: "zoom-in", label: t("palette.zoomIn"), keys: "Ctrl++", run: () => win.FullZoom.enlarge() },
    { id: "zoom-out", icon: "zoom-out", label: t("palette.zoomOut"), keys: "Ctrl+-", run: () => win.FullZoom.reduce() },
    { id: "zoom-reset", icon: "zoom", label: t("palette.zoomReset"), keys: "Ctrl+0", run: () => win.FullZoom.reset() },
    { id: "downloads", icon: "download", label: t("sidebar.downloads"), keys: "Ctrl+Shift+Y", run: cmd("Tools:Downloads") },
    { id: "history", icon: "history", label: t("sidebar.history"), keys: "Ctrl+H", run: () => win.SidebarController?.toggle("viewHistorySidebar") },
    { id: "bookmarks", icon: "bookmark", label: t("sidebar.bookmarks"), keys: "Ctrl+B", run: () => win.SidebarController?.toggle("viewBookmarksSidebar") },
    { id: "bookmark-page", icon: "star", label: t("palette.bookmarkPage"), keys: "Ctrl+D", run: cmd("Browser:AddBookmarkAs") },
    { id: "extensions", icon: "puzzle", label: t("sidebar.extensions"), keys: "Ctrl+Shift+A", run: () => win.BrowserAddonUI?.openAddonsMgr("addons://list/extension") },
    { id: "settings", icon: "settings", label: t("menu.lokumSettings"), keys: "Ctrl+,", run: () => lazy.LokumWindow.openSettings(win) },
    { id: "ff-settings", icon: "gear", label: t("palette.firefoxSettings"), run: () => win.openPreferences() },
    { id: "updates", icon: "update", label: t("palette.checkUpdates"), run: () => lazy.LokumUpdater.check({ userInitiated: true, window: win }) },
    { id: "dark", icon: "moon", label: t("palette.toggleDark"), run: () => LokumPrefs.set("lokum.appearance", isDark(win) ? "light" : "dark") },
    { id: "devtools", icon: "code", label: t("palette.devtools"), keys: "F12", run: cmd("key_toggleToolbox") },
    { id: "clear-data", icon: "broom", label: t("palette.clearData"), keys: "Ctrl+Shift+Del", run: cmd("Tools:Sanitize") },
  ];

  for (const layout of lazy.LokumLayoutIds) {
    list.push({
      id: `layout-${layout}`,
      icon: "layout",
      label: t("palette.layout", { layout: t(`layout.${layout}`) }),
      run: () => lazy.LokumLayout.set(layout),
    });
  }
  for (const id of LokumFlavors.ids) {
    const f = LokumFlavors.swatch(id);
    list.push({
      id: `flavor-${id}`,
      emoji: f.emoji,
      label: t("palette.flavor", { flavor: t(`flavor.${id}`) }),
      run: () => LokumPrefs.set("lokum.flavor", id),
    });
  }
  lazy.LokumSpaces.spaces.forEach((space, i) => {
    list.push({
      id: `space-${space.id}`,
      emoji: space.icon,
      label: t("palette.goToSpace", { space: space.displayName }),
      keys: i < 9 ? `Ctrl+Alt+${i + 1}` : "",
      run: () => lazy.LokumSpaces.switchTo(win, space.id),
    });
  });
  return list;
}

ChromeUtils.defineLazyGetter(lazy, "LokumLayoutIds", () => ["arc", "vertical", "horizontal"]);

function isDark(win) {
  return win.matchMedia("(prefers-color-scheme: dark)").matches;
}

function openSplitView(win) {
  const gBrowser = win.gBrowser;
  const current = gBrowser.selectedTab;
  const tabs = gBrowser.visibleTabs.filter(t => t !== current && !t.pinned);
  const other = tabs.toSorted((a, b) => b.lastAccessed - a.lastAccessed)[0];
  try {
    if (other && typeof gBrowser.addTabSplitView === "function") {
      gBrowser.addTabSplitView([current, other]);
      return;
    }
  } catch (ex) {
    console.error(ex);
  }
  win.document.getElementById("context_moveTabToSplitView")?.doCommand();
}

class Palette {
  constructor(win) {
    this.win = win;
    this.doc = win.document;
    this.items = [];
    this.selected = 0;
    this.build();
  }

  build() {
    const doc = this.doc;
    const t = lazy.LokumI18n.t.bind(lazy.LokumI18n);
    this.root = el(doc, "div", "lk-palette");
    this.root.id = "lokum-palette";
    this.root.hidden = true;
    this.root.setAttribute("role", "dialog");
    this.root.setAttribute("aria-label", t("palette.title"));

    this.box = el(doc, "div", "lk-palette-box");
    const head = el(doc, "div", "lk-palette-head");
    const glyph = el(doc, "img", "lk-icon lk-palette-glyph");
    glyph.src = "chrome://lokum/content/images/icons/command.svg";
    this.input = el(doc, "input", "lk-palette-input");
    this.input.setAttribute("placeholder", t("palette.placeholder"));
    this.input.setAttribute("aria-autocomplete", "list");
    this.input.setAttribute("aria-controls", "lokum-palette-list");
    const hint = el(doc, "kbd", "lk-palette-hint", "Esc");
    head.append(glyph, this.input, hint);

    this.list = el(doc, "div", "lk-palette-list");
    this.list.id = "lokum-palette-list";
    this.list.setAttribute("role", "listbox");
    this.box.append(head, this.list);
    this.root.append(this.box);
    doc.body.append(this.root);

    this.input.addEventListener("input", () => this.refresh());
    this.input.addEventListener("keydown", e => this.onKey(e));
    this.root.addEventListener("mousedown", e => {
      if (e.target === this.root) {
        this.hide();
      }
    });
  }

  get isOpen() {
    return !this.root.hidden;
  }

  show(prefill = "") {
    this.root.hidden = false;
    this.doc.documentElement.setAttribute("lokum-palette-open", "true");
    this.input.value = prefill;
    this.refresh();
    this.win.requestAnimationFrame(() => {
      this.root.setAttribute("open", "true");
      this.input.focus();
    });
  }

  hide() {
    this.root.removeAttribute("open");
    this.doc.documentElement.removeAttribute("lokum-palette-open");
    this.win.setTimeout(() => {
      if (!this.root.hasAttribute("open")) {
        this.root.hidden = true;
      }
    }, 180);
    this.win.gBrowser.selectedBrowser.focus();
  }

  refresh() {
    const query = this.input.value;
    const t = lazy.LokumI18n.t.bind(lazy.LokumI18n);
    const commands = commandsFor(this.win).map(c => ({ ...c, kind: "command" }));
    const tabs = this.win.gBrowser.tabs
      .filter(tab => !tab.closing && !tab.selected)
      .toSorted((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0))
      .map(tab => ({
        kind: "tab",
        id: "tab",
        label: tab.label,
        detail: safeHost(tab),
        favicon: tab.getAttribute("image"),
        run: () => {
          this.win.gBrowser.selectedTab = tab;
        },
      }));

    let results;
    if (!query.trim()) {
      results = [
        ...tabs.slice(0, 5).map(r => ({ ...r, section: t("palette.section.tabs") })),
        ...commands.slice(0, 12).map(r => ({ ...r, section: t("palette.section.actions") })),
      ];
    } else {
      results = [...tabs, ...commands]
        .map(item => ({ item, score: Math.max(fuzzyScore(query, item.label), fuzzyScore(query, item.detail || "") - 50) }))
        .filter(r => r.score >= 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 14)
        .map(r => r.item);
      if (/\S/.test(query)) {
        results.push({
          kind: "search",
          icon: "search",
          label: t("palette.searchWeb", { query: query.trim() }),
          run: () => {
            this.win.gURLBar.value = query.trim();
            this.win.gURLBar.handleCommand();
          },
        });
      }
    }
    this.items = results;
    this.selected = 0;
    this.render();
  }

  render() {
    const doc = this.doc;
    this.list.replaceChildren();
    let lastSection = null;
    this.items.forEach((item, index) => {
      if (item.section && item.section !== lastSection) {
        lastSection = item.section;
        this.list.append(el(doc, "div", "lk-palette-section", item.section));
      }
      const row = el(doc, "div", "lk-palette-row");
      row.setAttribute("role", "option");
      row.dataset.index = index;
      let lead;
      if (item.favicon || item.kind === "tab") {
        lead = el(doc, "img", "lk-palette-favicon");
        lead.src = item.favicon || "chrome://global/skin/icons/defaultFavicon.svg";
      } else if (item.emoji) {
        lead = el(doc, "span", "lk-palette-emoji", item.emoji);
      } else {
        lead = el(doc, "img", "lk-icon");
        lead.src = `chrome://lokum/content/images/icons/${item.icon || "sparkle"}.svg`;
      }
      const label = el(doc, "span", "lk-palette-label", item.label);
      row.append(lead, label);
      if (item.detail) {
        row.append(el(doc, "span", "lk-palette-detail", item.detail));
      }
      if (item.keys) {
        row.append(el(doc, "kbd", "lk-palette-keys", item.keys));
      }
      row.addEventListener("mousemove", () => this.select(index));
      row.addEventListener("click", () => this.activate(index));
      this.list.append(row);
    });
    if (!this.items.length) {
      this.list.append(el(doc, "div", "lk-palette-empty", lazy.LokumI18n.t("palette.empty")));
    }
    this.select(0);
  }

  select(index) {
    const rows = this.list.querySelectorAll(".lk-palette-row");
    if (!rows.length) {
      return;
    }
    this.selected = (index + rows.length) % rows.length;
    rows.forEach((row, i) => row.toggleAttribute("selected", i === this.selected));
    rows[this.selected].scrollIntoView({ block: "nearest" });
    this.input.setAttribute("aria-activedescendant", "");
  }

  activate(index) {
    const item = this.items[index];
    this.hide();
    if (item) {
      try {
        item.run();
      } catch (ex) {
        console.error("Lokum palette:", ex);
      }
    }
  }

  onKey(e) {
    switch (e.key) {
      case "ArrowDown":
        this.select(this.selected + 1);
        break;
      case "ArrowUp":
        this.select(this.selected - 1);
        break;
      case "Enter":
        this.activate(this.selected);
        break;
      case "Escape":
        this.hide();
        break;
      default:
        return;
    }
    e.preventDefault();
    e.stopPropagation();
  }
}

function safeHost(tab) {
  try {
    return tab.linkedBrowser.currentURI.host.replace(/^www\./, "");
  } catch (ex) {
    return "";
  }
}

const palettes = new WeakMap();

export const LokumCommandPalette = {
  toggle(win) {
    let palette = palettes.get(win);
    if (!palette) {
      palette = new Palette(win);
      palettes.set(win, palette);
    }
    if (palette.isOpen) {
      palette.hide();
    } else {
      palette.show();
    }
  },
  fuzzyScore,
};
