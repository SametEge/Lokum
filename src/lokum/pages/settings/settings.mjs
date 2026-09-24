/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* about:lokum — Lokum settings. */

import {
  LokumPrefs,
  LokumFlavors,
  LokumI18n,
  LokumVersion,
  LokumLayout,
  LokumSpaces,
  SPACE_ICONS,
  LokumUpdater,
  LokumTabs,
  LokumShell,
  importFirefoxModule,
  LokumAddons,
  UBLOCK_ID,
  t,
  el,
  icon,
  initPage,
  onPref,
  getPref,
  setPref,
  toggleControl,
  segmentedControl,
  selectControl,
  rangeControl,
  formatBytes,
  formatDate,
  relativeTime,
  renderMarkdown,
} from "chrome://lokum/content/pages/shared/page.mjs";

const topWindow = () =>
  window.browsingContext?.topChromeWindow ||
  Services.wm.getMostRecentWindow("navigator:browser");

const SECTIONS = [
  { id: "appearance", icon: "palette", build: buildAppearance },
  { id: "layout", icon: "layout", build: buildLayout },
  { id: "spaces", icon: "cube", build: buildSpaces },
  { id: "tabs", icon: "tabs", build: buildTabs },
  { id: "archive", icon: "archive", build: buildArchive },
  { id: "privacy", icon: "shield", build: buildPrivacy },
  { id: "search", icon: "search", build: buildSearch },
  { id: "shortcuts", icon: "keyboard", build: buildShortcuts },
  { id: "language", icon: "language", build: buildLanguage },
  { id: "updates", icon: "update", build: buildUpdates },
  { id: "advanced", icon: "gear", build: buildAdvanced },
  { id: "about", icon: "heart", build: buildAbout },
];

const built = new Map();

/* ------------------------------------------------------------- building */

function hero(id) {
  return el("header", { class: "lk-hero" },
    el("div", { class: "lk-hero-icon" }, icon(SECTIONS.find(s => s.id === id).icon)),
    el("div", {},
      el("h1", { text: t(`settings.${id}`) }),
      el("p", { text: t(`settings.${id}.subtitle`) })
    )
  );
}

function group(titleKey, ...children) {
  return el("section", { class: "lk-group lk-card" },
    titleKey ? el("h2", { class: "lk-group-title", text: t(titleKey) }) : null,
    ...children
  );
}

/** A setting row. `key` resolves "<key>" (title) and "<key>.desc". */
function row(key, control, { block = false, descArgs } = {}) {
  const title = t(key);
  const descKey = `${key}.desc`;
  const desc = t(descKey, descArgs);
  const hasDesc = desc !== descKey;
  const node = el("div", { class: `lk-row${block ? " lk-block" : ""}`, dataset: { key } },
    el("div", { class: "lk-row-text" },
      el("div", { class: "lk-row-title", text: title }),
      hasDesc ? el("div", { class: "lk-row-desc", text: desc }) : null
    ),
    control ? el("div", { class: "lk-row-control" }, control) : null
  );
  node.dataset.search = `${title} ${hasDesc ? desc : ""}`.toLowerCase();
  return node;
}

function buildSection(id) {
  if (built.has(id)) {
    return built.get(id);
  }
  const section = SECTIONS.find(s => s.id === id);
  const node = el("div", { class: "lk-section", id: `section-${id}`, dataset: { section: id } });
  node.append(hero(id));
  try {
    const content = section.build();
    node.append(...(Array.isArray(content) ? content : [content]));
  } catch (ex) {
    console.error(`Lokum settings: section ${id} failed`, ex);
    node.append(group(null, el("div", { class: "lk-empty", text: String(ex) })));
  }
  built.set(id, node);
  return node;
}

/* ------------------------------------------------------------ appearance */

function flavorCube(id) {
  const s = LokumFlavors.swatch(id);
  const cube = el("div", { class: "lk-cube" }, ...Array.from({ length: 6 }, () => el("i")));
  cube.style.setProperty("--c1", `light-dark(${s.light.cube}, ${s.dark.cube})`);
  cube.style.setProperty("--c2", `light-dark(${s.light.accent}, ${s.dark.accent})`);
  return cube;
}

function flavorGallery({ pref = "lokum.flavor" } = {}) {
  const grid = el("div", { class: "lk-flavors", role: "radiogroup", "aria-label": t("settings.appearance.flavor") });
  const cards = [];
  for (const id of LokumFlavors.ids) {
    const s = LokumFlavors.swatch(id);
    const card = el("button", {
      class: "lk-flavor",
      role: "radio",
      title: t(`flavor.${id}.desc`),
      onclick: () => setPref(pref, id),
    },
      el("span", { class: "lk-flavor-check" }, icon("check")),
      el("span", { class: "lk-flavor-emoji", text: s.emoji }),
      flavorCube(id),
      el("span", { class: "lk-flavor-name", text: t(`flavor.${id}`) })
    );
    card.style.setProperty("--f1", `light-dark(${s.light.frame[0]}, ${s.dark.frame[0]})`);
    card.style.setProperty("--f3", `light-dark(${s.light.frame[2]}, ${s.dark.frame[2]})`);
    card.style.setProperty("--ft", `light-dark(${s.light.text}, ${s.dark.text})`);
    card.dataset.flavor = id;
    cards.push(card);
    grid.append(card);
  }
  const refresh = () => {
    for (const card of cards) {
      card.setAttribute("aria-checked", String(card.dataset.flavor === getPref(pref)));
    }
  };
  refresh();
  onPref(pref, refresh);
  return grid;
}

function accentControl() {
  const input = el("input", { type: "color", class: "lk-color", "aria-label": t("settings.appearance.accent") });
  const reset = el("button", { class: "lk-button ghost", text: t("settings.reset") });
  const read = () => {
    const custom = getPref("lokum.accent.custom");
    input.value = custom || rgbToHex(getComputedStyle(document.documentElement).getPropertyValue("--lk-accent"));
    reset.hidden = !custom;
  };
  input.addEventListener("input", () => setPref("lokum.accent.custom", input.value));
  reset.addEventListener("click", () => LokumPrefs.reset("lokum.accent.custom"));
  onPref("lokum.accent.custom", () => setTimeout(read, 50));
  onPref("lokum.flavor", () => setTimeout(read, 800));
  setTimeout(read, 0);
  return el("div", { class: "lk-row-control" }, reset, input);
}

function rgbToHex(value) {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(value || "");
  if (!m) {
    return "#d23c78";
  }
  return "#" + m.slice(1, 4).map(n => Number(n).toString(16).padStart(2, "0")).join("");
}

function buildAppearance() {
  return [
    group("settings.appearance.flavor", flavorGallery()),
    group(null,
      row("settings.appearance.mode", segmentedControl({
        pref: "lokum.appearance",
        options: [
          { value: "auto", label: t("settings.appearance.mode.auto"), icon: "sparkle" },
          { value: "light", label: t("settings.appearance.mode.light"), icon: "sun" },
          { value: "dark", label: t("settings.appearance.mode.dark"), icon: "moon" },
        ],
      })),
      row("settings.appearance.accent", accentControl()),
      row("settings.appearance.sugar", toggleControl({ pref: "lokum.sugarDust" })),
      row("settings.appearance.grain", toggleControl({ pref: "lokum.grain" })),
      row("settings.appearance.animations", segmentedControl({
        pref: "lokum.animations",
        options: [
          { value: "full", label: t("settings.appearance.animations.full") },
          { value: "reduced", label: t("settings.appearance.animations.reduced") },
          { value: "off", label: t("settings.appearance.animations.off") },
        ],
      }))
    ),
    group("settings.appearance.shape",
      row("settings.appearance.radius", rangeControl({ pref: "lokum.content.radius", min: 0, max: 28 })),
      row("settings.appearance.margin", rangeControl({ pref: "lokum.content.margin", min: 0, max: 24 })),
      row("settings.appearance.shadow", toggleControl({ pref: "lokum.content.shadow" })),
      row("settings.appearance.density", segmentedControl({
        pref: "lokum.density",
        options: [
          { value: "compact", label: t("settings.appearance.density.compact") },
          { value: "normal", label: t("settings.appearance.density.normal") },
          { value: "comfy", label: t("settings.appearance.density.comfy") },
        ],
      })),
      row("settings.appearance.font", segmentedControl({
        pref: "lokum.font.ui",
        options: [
          { value: "system", label: t("settings.appearance.font.system") },
          { value: "rounded", label: t("settings.appearance.font.rounded") },
          { value: "serif", label: t("settings.appearance.font.serif") },
        ],
      }))
    ),
  ];
}

/* ---------------------------------------------------------------- layout */

function layoutMock(id) {
  const mock = el("div", { class: `lk-mock ${id}` });
  const side = () =>
    el("div", { class: "m-side" },
      id === "arc" ? el("div", { class: "m-url" }) : null,
      el("div", { class: "m-tab" }), el("div", { class: "m-tab sel" }), el("div", { class: "m-tab" }), el("div", { class: "m-tab" })
    );
  if (id === "arc") {
    mock.append(side(), el("div", { class: "m-page" }));
  } else if (id === "vertical") {
    mock.append(el("div", { class: "m-top" }), side(), el("div", { class: "m-page" }));
  } else {
    mock.append(
      el("div", { class: "m-tabs" }, el("div", { class: "m-tab sel" }), el("div", { class: "m-tab" }), el("div", { class: "m-tab" })),
      el("div", { class: "m-top" }),
      el("div", { class: "m-page" })
    );
  }
  return mock;
}

function layoutPicker() {
  const wrap = el("div", { class: "lk-choices", role: "radiogroup" });
  const cards = [];
  for (const id of ["arc", "vertical", "horizontal"]) {
    const card = el("button", { class: "lk-choice", role: "radio", onclick: () => LokumLayout.set(id) },
      layoutMock(id),
      el("span", { class: "lk-choice-title", text: t(`layout.${id}`) }),
      el("span", { class: "lk-choice-desc", text: t(`layout.${id}.desc`) })
    );
    card.dataset.layout = id;
    cards.push(card);
    wrap.append(card);
  }
  const refresh = () => cards.forEach(c => c.setAttribute("aria-checked", String(c.dataset.layout === LokumLayout.current)));
  refresh();
  onPref("lokum.layout", refresh);
  return wrap;
}

function buildLayout() {
  return [
    group("settings.layout.style", layoutPicker()),
    group(null,
      row("settings.layout.position", segmentedControl({
        pref: "lokum.sidebar.position",
        options: [
          { value: "left", label: t("settings.layout.position.left") },
          { value: "right", label: t("settings.layout.position.right") },
        ],
      })),
      row("settings.layout.compact", toggleControl({ pref: "lokum.compact" })),
      row("settings.layout.floatingUrlbar", toggleControl({ pref: "lokum.floatingUrlbar" })),
      row("settings.layout.newTabPosition", segmentedControl({
        pref: "lokum.tabs.newTabPosition",
        options: [
          { value: "top", label: t("settings.layout.newTabPosition.top") },
          { value: "bottom", label: t("settings.layout.newTabPosition.bottom") },
        ],
      })),
      row("settings.layout.closeButton", segmentedControl({
        pref: "lokum.tabs.closeButton",
        options: [
          { value: "hover", label: t("settings.layout.closeButton.hover") },
          { value: "always", label: t("settings.layout.closeButton.always") },
          { value: "never", label: t("settings.layout.closeButton.never") },
        ],
      })),
      row("settings.layout.mediaCard", toggleControl({ pref: "lokum.mediaCard" })),
      row("settings.layout.bookmarksBar", selectControl({
        pref: "browser.toolbars.bookmarks.visibility",
        options: [
          { value: "never", label: t("settings.layout.bookmarksBar.never") },
          { value: "newtab", label: t("settings.layout.bookmarksBar.newtab") },
          { value: "always", label: t("settings.layout.bookmarksBar.always") },
        ],
      })),
      row("settings.layout.customize", el("button", {
        class: "lk-button",
        text: t("settings.layout.customize.button"),
        onclick: () => topWindow()?.gCustomizeMode?.enter(),
      }))
    ),
  ];
}

/* ---------------------------------------------------------------- spaces */

function buildSpaces() {
  const list = el("div", { class: "lk-space-list" });
  let picker = null;

  const flavorOptions = [
    { value: "", label: t("spaces.flavor.global") },
    ...LokumFlavors.ids.map(id => ({ value: id, label: `${LokumFlavors.swatch(id).emoji} ${t(`flavor.${id}`)}` })),
  ];
  const containerOptions = () => {
    const options = [{ value: 0, label: t("spaces.container.none") }];
    try {
      if (Services.prefs.getBoolPref("privacy.userContext.enabled", false)) {
        const CIS = importFirefoxModule("ContextualIdentityService");
        for (const identity of CIS.getPublicIdentities()) {
          options.push({ value: identity.userContextId, label: CIS.getUserContextLabel(identity.userContextId) });
        }
      }
    } catch (ex) {}
    return options;
  };

  const render = () => {
    picker?.remove();
    picker = null;
    const spaces = LokumSpaces.spaces;
    list.replaceChildren(...spaces.map((space, index) => {
      const emoji = el("button", { class: "lk-space-emoji", text: space.icon, title: t("spaces.icon") });
      const s = LokumFlavors.swatch(space.flavor || getPref("lokum.flavor"));
      emoji.style.setProperty("--space-soft", `light-dark(${s.light.frame[1]}, ${s.dark.frame[1]})`);
      emoji.addEventListener("click", () => {
        picker?.remove();
        picker = el("div", { class: "lk-emoji-picker" }, ...SPACE_ICONS.map(i =>
          el("button", { text: i, onclick: () => LokumSpaces.update(space.id, { icon: i }) })
        ));
        item.after(picker);
      });
      const name = el("input", { class: "lk-input", value: space.name, placeholder: space.displayName, maxLength: 40 });
      name.addEventListener("change", () => LokumSpaces.update(space.id, { name: name.value }));
      const flavor = el("select", { class: "lk-select" }, ...flavorOptions.map(o => el("option", { value: o.value, text: o.label })));
      flavor.value = space.flavor || "";
      flavor.addEventListener("change", () => LokumSpaces.update(space.id, { flavor: flavor.value || null }));
      const cOptions = containerOptions();
      const container = el("select", { class: "lk-select", hidden: cOptions.length < 2 }, ...cOptions.map(o => el("option", { value: String(o.value), text: o.label })));
      container.value = String(space.container || 0);
      container.addEventListener("change", () => LokumSpaces.update(space.id, { container: Number(container.value) }));
      const up = el("button", { class: "lk-icon-button", title: t("settings.spaces.up"), disabled: index === 0, onclick: () => LokumSpaces.move(space.id, index - 1) }, icon("arrow-left"));
      up.firstChild.style.transform = "rotate(90deg)";
      const down = el("button", { class: "lk-icon-button", title: t("settings.spaces.down"), disabled: index === spaces.length - 1, onclick: () => LokumSpaces.move(space.id, index + 1) }, icon("arrow-right"));
      down.firstChild.style.transform = "rotate(90deg)";
      const del = el("button", {
        class: "lk-icon-button",
        title: t("spaces.delete"),
        disabled: spaces.length < 2,
        onclick: () => {
          if (confirm(t("settings.spaces.confirmDelete", { space: space.displayName }))) {
            LokumSpaces.remove(space.id, topWindow());
          }
        },
      }, icon("trash"));
      const item = el("div", { class: "lk-space-item" }, emoji, name, flavor, container, up, down, del);
      return item;
    }));
  };
  render();
  const obs = () => render();
  Services.obs.addObserver(obs, "lokum-spaces-changed");
  window.addEventListener("unload", () => Services.obs.removeObserver(obs, "lokum-spaces-changed"));

  const add = el("button", {
    class: "lk-button primary",
    onclick: () => {
      const used = new Set(LokumSpaces.spaces.map(s => s.flavor));
      const flavor = LokumFlavors.ids.find(id => !used.has(id) && id !== "karisik") || "nane";
      const iconChoice = SPACE_ICONS.find(i => !LokumSpaces.spaces.some(s => s.icon === i)) || "⭐";
      LokumSpaces.create({ icon: iconChoice, flavor });
    },
  }, icon("plus"), t("spaces.new"));

  return [
    group(null,
      row("settings.spaces.enabled", toggleControl({ pref: "lokum.spaces.enabled" })),
      row("settings.spaces.tint", toggleControl({ pref: "lokum.spaces.tintFrame" })),
      row("settings.spaces.swipe", toggleControl({ pref: "lokum.spaces.swipe" }))
    ),
    group("settings.spaces.list", list, el("div", { class: "lk-row" }, el("div", { class: "lk-row-text lk-muted", text: t("settings.spaces.hint") }), add)),
  ];
}

/* ------------------------------------------------------------------ tabs */

function buildTabs() {
  const hours = [0, 12, 24, 168, 720];
  const minutes = [0, 15, 30, 60, 120, 240];
  return [
    group(null,
      row("settings.tabs.autoArchive", selectControl({
        pref: "lokum.tabs.autoArchiveHours",
        options: hours.map(h => ({ value: h, label: h ? t(`settings.tabs.hours.${h}`) : t("settings.never") })),
      })),
      row("settings.tabs.sleep", selectControl({
        pref: "lokum.tabs.sleepMinutes",
        options: minutes.map(m => ({ value: m, label: m ? t("settings.tabs.minutes", { n: m }) : t("settings.never") })),
      })),
      row("settings.tabs.restore", toggleControl({
        get: () => Services.prefs.getIntPref("browser.startup.page", 1) === 3,
        set: v => Services.prefs.setIntPref("browser.startup.page", v ? 3 : 1),
      })),
      row("settings.tabs.hoverPreview", toggleControl({ pref: "browser.tabs.hoverPreview.enabled" })),
      row("settings.tabs.groups", toggleControl({ pref: "browser.tabs.groups.enabled" })),
      row("settings.tabs.splitView", toggleControl({ pref: "browser.tabs.splitView.enabled" })),
      row("settings.tabs.pip", toggleControl({ pref: "media.videocontrols.picture-in-picture.enable-when-switching-tabs.enabled" })),
      row("settings.tabs.warnOnQuit", toggleControl({ pref: "browser.warnOnQuitShortcut" }))
    ),
  ];
}

/* --------------------------------------------------------------- archive */

function buildArchive() {
  const search = el("input", { class: "lk-input", type: "search", placeholder: t("settings.archive.search") });
  const clear = el("button", { class: "lk-button danger", text: t("settings.archive.clear") });
  const list = el("div", { class: "lk-archive-list" });
  let items = [];

  const render = () => {
    const q = search.value.trim().toLowerCase();
    const shown = items.filter(i => !q || i.title.toLowerCase().includes(q) || i.url.toLowerCase().includes(q));
    if (!shown.length) {
      list.replaceChildren(el("div", { class: "lk-empty" },
        el("span", { class: "big", text: "🗃️" }),
        items.length ? t("settings.archive.noMatch") : t("settings.archive.empty")
      ));
      return;
    }
    list.replaceChildren(...shown.slice(0, 300).map(item => {
      const fav = el("img", { class: "fav", src: item.icon && /^(data:|https:)/.test(item.icon) ? item.icon : `page-icon:${item.url}`, alt: "" });
      fav.addEventListener("error", () => (fav.src = "chrome://global/skin/icons/defaultFavicon.svg"), { once: true });
      return el("div", { class: "lk-archive-item" },
        fav,
        el("div", { class: "t" }, el("span", { text: item.title }), el("span", { text: `${relativeTime(item.archivedAt)} · ${item.url}` })),
        el("button", {
          class: "lk-button ghost",
          text: t("settings.archive.reopen"),
          onclick: async () => {
            const win = topWindow();
            win?.openTrustedLinkIn(item.url, "tab");
            await LokumTabs.removeFromArchive(item.url, item.archivedAt);
          },
        }),
        el("button", {
          class: "lk-icon-button",
          title: t("settings.archive.remove"),
          onclick: () => LokumTabs.removeFromArchive(item.url, item.archivedAt),
        }, icon("close"))
      );
    }));
  };
  const load = async () => {
    items = await LokumTabs.getArchive();
    clear.disabled = !items.length;
    render();
  };
  search.addEventListener("input", render);
  clear.addEventListener("click", async () => {
    if (confirm(t("settings.archive.confirmClear"))) {
      await LokumTabs.clearArchive();
    }
  });
  const obs = () => load();
  Services.obs.addObserver(obs, "lokum-archive-changed");
  window.addEventListener("unload", () => Services.obs.removeObserver(obs, "lokum-archive-changed"));
  load();
  return [
    group(null,
      row("settings.tabs.autoArchive", selectControl({
        pref: "lokum.tabs.autoArchiveHours",
        options: [0, 12, 24, 168, 720].map(h => ({ value: h, label: h ? t(`settings.tabs.hours.${h}`) : t("settings.never") })),
      }))
    ),
    group("settings.archive.list", el("div", { class: "lk-archive-toolbar" }, search, clear), list),
  ];
}

/* --------------------------------------------------------------- privacy */

const DOH = {
  off: { mode: 5, uri: "" },
  default: { mode: 2, uri: "" },
  cloudflare: { mode: 2, uri: "https://mozilla.cloudflare-dns.com/dns-query" },
  quad9: { mode: 2, uri: "https://dns.quad9.net/dns-query" },
  mullvad: { mode: 2, uri: "https://dns.mullvad.net/dns-query" },
  "mullvad-adblock": { mode: 2, uri: "https://adblock.dns.mullvad.net/dns-query" },
  nextdns: { mode: 2, uri: "https://firefox.dns.nextdns.io/" },
  adguard: { mode: 2, uri: "https://dns.adguard-dns.com/dns-query" },
};

function currentDoh() {
  const mode = Services.prefs.getIntPref("network.trr.mode", 0);
  if (mode !== 2 && mode !== 3) {
    return "off";
  }
  const uri = Services.prefs.getStringPref("network.trr.uri", "");
  const hit = Object.entries(DOH).find(([k, v]) => v.uri && v.uri === uri);
  return hit ? hit[0] : "default";
}

function setDoh(key) {
  const preset = DOH[key] || DOH.off;
  if (preset.uri) {
    Services.prefs.setStringPref("network.trr.uri", preset.uri);
    Services.prefs.setStringPref("network.trr.custom_uri", preset.uri);
  } else {
    Services.prefs.clearUserPref("network.trr.uri");
  }
  Services.prefs.setIntPref("network.trr.mode", preset.mode);
}

function adblockControl() {
  const button = el("button", { class: "lk-button primary" });
  const status = el("span", { class: "lk-badge", hidden: true });
  const AM = importFirefoxModule("AddonManager");
  const refresh = async () => {
    const addon = await AM.getAddonByID(UBLOCK_ID);
    if (addon) {
      button.hidden = true;
      status.hidden = false;
      status.textContent = addon.isActive ? t("settings.privacy.adblock.active") : t("settings.privacy.adblock.disabled");
    } else {
      button.hidden = false;
      status.hidden = true;
      button.textContent = t("settings.privacy.adblock.install");
    }
  };
  button.addEventListener("click", async () => {
    button.disabled = true;
    button.textContent = t("settings.privacy.adblock.installing");
    if (!(await LokumAddons.installUBlock("lokum-settings"))) {
      button.textContent = t("settings.privacy.adblock.failed");
    }
    button.disabled = false;
    refresh();
  });
  refresh();
  return el("div", { class: "lk-row-control" }, status, button);
}

function buildPrivacy() {
  return [
    group(null,
      row("settings.privacy.tracking", segmentedControl({
        get: () => Services.prefs.getStringPref("browser.contentblocking.category", "standard"),
        set: v => Services.prefs.setStringPref("browser.contentblocking.category", v),
        pref: "browser.contentblocking.category",
        options: [
          { value: "standard", label: t("settings.privacy.tracking.standard") },
          { value: "strict", label: t("settings.privacy.tracking.strict") },
        ],
      })),
      row("settings.privacy.adblock", adblockControl()),
      row("settings.privacy.https", toggleControl({ pref: "dom.security.https_only_mode" })),
      row("settings.privacy.doh", selectControl({
        get: currentDoh,
        set: setDoh,
        options: Object.keys(DOH).map(k => ({ value: k, label: t(`settings.privacy.doh.${k}`) })),
      })),
      row("settings.privacy.gpc", toggleControl({ pref: "privacy.globalprivacycontrol.enabled" })),
      row("settings.privacy.fingerprinting", toggleControl({ pref: "privacy.fingerprintingProtection" })),
      row("settings.privacy.clearOnExit", toggleControl({ pref: "privacy.sanitize.sanitizeOnShutdown" })),
      row("settings.privacy.popups", toggleControl({ pref: "dom.disable_open_during_load" }))
    ),
    group(null,
      row("settings.privacy.telemetry", el("span", { class: "lk-badge", text: t("settings.privacy.telemetry.off") })),
      row("settings.privacy.more", el("button", {
        class: "lk-button",
        onclick: () => topWindow()?.openPreferences("privacy"),
      }, t("settings.openFirefox"), icon("external")))
    ),
  ];
}

/* ---------------------------------------------------------------- search */

function buildSearch() {
  const select = el("select", { class: "lk-select", disabled: true }, el("option", { text: "…" }));
  (async () => {
    try {
      await Services.search.init();
      const engines = await Services.search.getVisibleEngines();
      const current = await Services.search.getDefault();
      select.replaceChildren(...engines.map(e => el("option", { value: e.name, text: e.name })));
      select.value = current?.name || "";
      select.disabled = false;
      select.addEventListener("change", async () => {
        const engine = Services.search.getEngineByName(select.value);
        if (engine) {
          await Services.search.setDefault(engine, Ci.nsISearchService.CHANGE_REASON_USER);
        }
      });
    } catch (ex) {
      console.error(ex);
    }
  })();
  return [
    group(null,
      row("settings.search.engine", select),
      row("settings.search.suggest", toggleControl({ pref: "browser.search.suggest.enabled" })),
      row("settings.search.urlbarSuggest", toggleControl({ pref: "browser.urlbar.suggest.searches" })),
      row("settings.search.trending", toggleControl({ pref: "browser.urlbar.trending.featureGate" })),
      row("settings.search.manage", el("button", {
        class: "lk-button",
        onclick: () => topWindow()?.openPreferences("search"),
      }, t("settings.openFirefox"), icon("external")))
    ),
  ];
}

/* ------------------------------------------------------------- shortcuts */

const SHORTCUTS = [
  ["shortcut.palette", "Ctrl+K"],
  ["shortcut.compact", "Ctrl+Alt+S"],
  ["shortcut.nextSpace", "Ctrl+Alt+→"],
  ["shortcut.prevSpace", "Ctrl+Alt+←"],
  ["shortcut.space", "Ctrl+Alt+1 … 9"],
  ["shortcut.copyUrl", "Ctrl+Shift+C"],
  ["shortcut.settings", "Ctrl+,"],
  ["shortcut.newTab", "Ctrl+T"],
  ["shortcut.focusUrl", "Ctrl+L"],
  ["shortcut.reopen", "Ctrl+Shift+T"],
  ["shortcut.split", "—"],
];

function buildShortcuts() {
  const table = el("div", { class: "lk-shortcuts" });
  for (const [key, keys] of SHORTCUTS) {
    table.append(el("div", { text: t(key) }), el("div", {}, el("kbd", { text: keys })));
  }
  return [
    group(null, row("settings.shortcuts.enabled", toggleControl({ pref: "lokum.shortcuts.enabled" }))),
    group("settings.shortcuts.list", table),
  ];
}

/* -------------------------------------------------------------- language */

function buildLanguage() {
  const grid = el("div", { class: "lk-langs", role: "radiogroup" });
  const notice = el("div", { class: "lk-notice", hidden: true },
    el("span", { text: "🔄" }),
    el("span", { class: "grow", text: t("settings.language.restart") }),
    el("button", {
      class: "lk-button primary",
      text: t("settings.language.restartNow"),
      onclick: () => {
        const cancel = Cc["@mozilla.org/supports-PRBool;1"].createInstance(Ci.nsISupportsPRBool);
        Services.obs.notifyObservers(cancel, "quit-application-requested", "restart");
        if (!cancel.data) {
          Services.startup.quit(Ci.nsIAppStartup.eAttemptQuit | Ci.nsIAppStartup.eRestart);
        }
      },
    })
  );
  const available = new Set(Services.locale.availableLocales);
  const current = () => LokumI18n.locale;
  const buttons = [];
  for (const locale of LokumI18n.locales) {
    const ok = available.has(locale.firefox);
    const button = el("button", {
      class: "lk-lang",
      role: "radio",
      disabled: !ok,
      title: ok ? locale.name : t("settings.language.unavailable"),
      onclick: () => {
        LokumI18n.setUILocale(locale.code);
        notice.hidden = false;
        refresh();
      },
    }, el("span", { class: "flag", text: locale.flag }), el("span", { text: locale.name }));
    button.dataset.code = locale.code;
    buttons.push(button);
    grid.append(button);
  }
  const refresh = () => {
    const requested = Services.locale.requestedLocales[0] || Services.locale.appLocaleAsBCP47;
    for (const b of buttons) {
      const entry = LokumI18n.locales.find(l => l.code === b.dataset.code);
      b.setAttribute("aria-checked", String(entry.firefox === requested || (!Services.locale.requestedLocales.length && entry.code === current())));
    }
  };
  refresh();
  return [
    group("settings.language.ui", notice, grid),
    group(null,
      row("settings.language.spellcheck", toggleControl({
        get: () => Services.prefs.getIntPref("layout.spellcheckDefault", 1) > 0,
        set: v => Services.prefs.setIntPref("layout.spellcheckDefault", v ? 1 : 0),
      })),
      row("settings.language.web", el("button", {
        class: "lk-button",
        onclick: () => topWindow()?.openPreferences("general"),
      }, t("settings.openFirefox"), icon("external")))
    ),
  ];
}

/* --------------------------------------------------------------- updates */

function buildUpdates() {
  const status = el("div", { class: "lk-update-status" }, el("span", { class: "lk-dot" }), el("span"));
  const progress = el("div", { class: "lk-progress", hidden: true }, el("div"));
  const checkButton = el("button", { class: "lk-button primary" }, icon("update"), el("span", { text: t("settings.updates.check") }));
  const actionButton = el("button", { class: "lk-button", hidden: true });
  const notes = el("div");
  const info = LokumVersion.info;

  const heroCard = el("div", { class: "lk-update-hero lk-card" },
    el("div", { class: "lk-brand-cube" }, el("div", { class: "lk-logo-cube" }, ...Array.from({ length: 6 }, () => el("i")))),
    el("div", { class: "lk-update-versions" },
      el("strong", { text: `Lokum ${info.version}` }),
      el("span", { class: "lk-muted", text: t("settings.updates.firefox", { version: Services.appinfo.version }) }),
      status,
      progress
    ),
    el("div", { class: "lk-row-control" }, actionButton, checkButton)
  );

  const render = () => {
    const snap = LokumUpdater.snapshot();
    status.dataset.status = snap.status;
    const label = status.lastChild;
    const lastCheck = snap.lastCheck ? relativeTime(snap.lastCheck * 1000) : t("settings.never");
    const map = {
      idle: t("settings.updates.status.idle", { time: lastCheck }),
      checking: t("settings.updates.status.checking"),
      "up-to-date": t("settings.updates.status.upToDate", { time: lastCheck }),
      available: t("settings.updates.status.available", { version: snap.version }),
      downloading: t("settings.updates.status.downloading", {
        version: snap.version,
        done: formatBytes(snap.receivedBytes),
        total: formatBytes(snap.totalBytes),
      }),
      ready: t("settings.updates.status.ready", { version: snap.version }),
      installing: t("update.card.installing"),
      error: t("settings.updates.status.error", { error: snap.error }),
    };
    label.textContent = map[snap.status] || snap.status;
    progress.hidden = snap.status !== "downloading";
    progress.firstChild.style.width = `${Math.round(snap.progress * 100)}%`;
    checkButton.disabled = ["checking", "downloading", "installing"].includes(snap.status);
    checkButton.querySelector(".lk-icon").classList.toggle("lk-spin", snap.status === "checking");

    actionButton.hidden = true;
    if (snap.status === "ready") {
      actionButton.hidden = false;
      actionButton.textContent = t("update.restart");
      actionButton.className = "lk-button primary";
      actionButton.onclick = () => LokumUpdater.installNow();
      checkButton.hidden = true;
    } else if (snap.status === "available") {
      actionButton.hidden = false;
      actionButton.textContent = snap.canInstall ? t("update.download") : t("update.openPage");
      actionButton.className = "lk-button primary";
      actionButton.onclick = () =>
        snap.canInstall ? LokumUpdater.download() : topWindow()?.openWebLinkIn(snap.url || `https://github.com/${info.repo}/releases/latest`, "tab");
      checkButton.hidden = false;
    } else {
      checkButton.hidden = false;
    }

    notes.replaceChildren();
    if (snap.notes && ["available", "downloading", "ready", "up-to-date"].includes(snap.status)) {
      notes.append(group(null,
        el("div", { class: "lk-row" },
          el("div", { class: "lk-row-text" },
            el("div", { class: "lk-row-title", text: t("settings.updates.notes", { version: snap.version }) }),
            el("div", { class: "lk-row-desc", text: formatDate(snap.date) })
          ),
          snap.url ? el("a", { href: snap.url, target: "_blank", text: t("settings.updates.github") }) : null
        ),
        renderMarkdown(snap.notes)
      ));
    }
  };
  checkButton.addEventListener("click", () => LokumUpdater.check({ userInitiated: true }));
  const obs = () => render();
  Services.obs.addObserver(obs, LokumUpdater.TOPIC);
  window.addEventListener("unload", () => Services.obs.removeObserver(obs, LokumUpdater.TOPIC));
  render();

  const snap = LokumUpdater.snapshot();
  return [
    heroCard,
    group(null,
      row("settings.updates.enabled", toggleControl({ pref: "lokum.update.enabled" })),
      row("settings.updates.auto", toggleControl({ pref: "lokum.update.auto" }), {}),
      row("settings.updates.channel", segmentedControl({
        pref: "lokum.update.channel",
        options: [
          { value: "stable", label: t("settings.updates.channel.stable") },
          { value: "beta", label: t("settings.updates.channel.beta") },
        ],
      })),
      row("settings.updates.interval", selectControl({
        pref: "lokum.update.intervalHours",
        options: [1, 3, 6, 12, 24].map(h => ({ value: h, label: t("settings.updates.everyHours", { n: h }) })),
      })),
      snap.portable ? row("settings.updates.portable", null) : null,
      row("settings.updates.releases", el("a", {
        class: "lk-button",
        href: `https://github.com/${info.repo}/releases`,
        target: "_blank",
      }, "GitHub", icon("external")))
    ),
    notes,
  ];
}

/* -------------------------------------------------------------- advanced */

function buildAdvanced() {
  const fileInput = el("input", { type: "file", accept: "application/json,.json", hidden: true });
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) {
      return;
    }
    try {
      const data = JSON.parse(await file.text());
      LokumPrefs.importUserValues(data.prefs);
      for (const space of data.spaces || []) {
        if (!LokumSpaces.spaces.some(s => s.id === space.id)) {
          LokumSpaces.create(space);
        }
      }
      alert(t("settings.advanced.imported"));
    } catch (ex) {
      alert(t("settings.advanced.importFailed"));
    }
    fileInput.value = "";
  });

  const defaultButton = el("button", { class: "lk-button primary", text: t("settings.advanced.makeDefault") });
  const refreshDefault = () => {
    const isDefault = LokumShell.isDefaultBrowser();
    defaultButton.textContent = isDefault ? t("settings.advanced.isDefault") : t("settings.advanced.makeDefault");
    defaultButton.disabled = isDefault;
  };
  defaultButton.addEventListener("click", () => {
    LokumShell.setAsDefault();
    setTimeout(refreshDefault, 4000);
  });
  refreshDefault();

  return [
    group(null,
      row("settings.advanced.default", defaultButton),
      row("settings.advanced.import", el("button", {
        class: "lk-button",
        onclick: () => {
          try {
            const MU = importFirefoxModule("MigrationUtils");
            MU.showMigrationWizard(topWindow(), { entrypoint: MU.MIGRATION_ENTRYPOINTS?.PREFERENCES });
          } catch (ex) {
            topWindow()?.openPreferences("general");
          }
        },
      }, icon("import"), t("settings.advanced.import.button"))),
      row("settings.advanced.onboarding", el("button", {
        class: "lk-button",
        text: t("settings.advanced.onboarding.button"),
        onclick: () => topWindow()?.openTrustedLinkIn("about:lokum-welcome", "tab"),
      }))
    ),
    group("settings.advanced.data",
      row("settings.advanced.export", el("button", {
        class: "lk-button",
        onclick: () => {
          const data = { lokum: LokumVersion.version, exported: new Date().toISOString(), prefs: LokumPrefs.exportUserValues(), spaces: LokumSpaces.spaces };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
          const a = el("a", { href: URL.createObjectURL(blob), download: `lokum-settings-${Date.now()}.json` });
          document.body.append(a);
          a.click();
          a.remove();
        },
      }, icon("download"), t("settings.advanced.export.button"))),
      row("settings.advanced.importSettings", el("button", { class: "lk-button", onclick: () => fileInput.click() }, icon("import"), t("settings.advanced.importSettings.button"))),
      fileInput,
      row("settings.advanced.profile", el("button", {
        class: "lk-button",
        onclick: () => Services.dirsvc.get("ProfD", Ci.nsIFile).reveal(),
      }, icon("folder"), t("settings.advanced.profile.button"))),
      row("settings.advanced.reset", el("button", {
        class: "lk-button danger",
        text: t("settings.advanced.reset.button"),
        onclick: () => {
          if (confirm(t("settings.advanced.reset.confirm"))) {
            LokumPrefs.resetAll();
          }
        },
      }))
    ),
    group("settings.advanced.firefox",
      row("settings.advanced.smoothScroll", toggleControl({ pref: "general.smoothScroll" })),
      row("settings.advanced.userChrome", toggleControl({ pref: "toolkit.legacyUserProfileCustomizations.stylesheets" })),
      row("settings.advanced.firefoxSettings", el("button", { class: "lk-button", onclick: () => topWindow()?.openPreferences() }, t("settings.openFirefox"), icon("external"))),
      row("settings.advanced.config", el("button", { class: "lk-button", onclick: () => topWindow()?.openTrustedLinkIn("about:config", "tab") }, "about:config", icon("external")))
    ),
  ];
}

/* ----------------------------------------------------------------- about */

function buildAbout() {
  const info = LokumVersion.info;
  const repo = `https://github.com/${info.repo}`;
  let profile = "";
  try {
    profile = Services.dirsvc.get("ProfD", Ci.nsIFile).path;
  } catch (ex) {}
  return [
    group(null,
      el("div", { class: "lk-about" },
        el("div", { class: "lk-brand-cube" }, el("div", { class: "lk-logo-cube" }, ...Array.from({ length: 6 }, () => el("i")))),
        el("h1", { text: "Lokum" }),
        el("p", { class: "lk-muted", text: t("app.tagline") }),
        el("div", { class: "links" },
          el("a", { class: "lk-button", href: repo, target: "_blank" }, "GitHub", icon("external")),
          el("a", { class: "lk-button", href: `${repo}/issues/new/choose`, target: "_blank" }, t("settings.about.bug"), icon("external")),
          el("a", { class: "lk-button", href: `${repo}/releases`, target: "_blank" }, t("settings.about.releases"), icon("external")),
          el("button", { class: "lk-button ghost", onclick: () => topWindow()?.openTrustedLinkIn("about:license", "tab") }, t("settings.about.licenses"))
        )
      ),
      el("div", { class: "lk-facts" },
        el("div", { class: "lk-fact" }, el("span", { text: t("settings.about.version") }), el("strong", { text: info.version })),
        el("div", { class: "lk-fact" }, el("span", { text: t("settings.about.firefox") }), el("strong", { text: Services.appinfo.version })),
        el("div", { class: "lk-fact" }, el("span", { text: t("settings.about.built") }), el("strong", { text: info.buildDate ? formatDate(info.buildDate) : "—" })),
        el("div", { class: "lk-fact" }, el("span", { text: t("settings.about.platform") }), el("strong", { text: `${Services.appinfo.OS} · ${Services.appinfo.XPCOMABI}` })),
        el("div", { class: "lk-fact" }, el("span", { text: t("settings.about.profile") }), el("strong", { text: profile }))
      )
    ),
    group(null,
      el("div", { class: "lk-row" }, el("div", { class: "lk-row-text" },
        el("div", { class: "lk-row-title", text: t("settings.about.credits") }),
        el("div", { class: "lk-row-desc", text: t("settings.about.credits.desc") })
      ))
    ),
  ];
}

/* ------------------------------------------------------------ navigation */

const main = document.getElementById("main");
const nav = document.getElementById("nav");
const searchInput = document.getElementById("search");
let currentId = null;

function renderNav() {
  nav.replaceChildren(...SECTIONS.map(s =>
    el("a", { class: "lk-nav-item", href: `#${s.id}`, dataset: { id: s.id } }, icon(s.icon), el("span", { text: t(`settings.${s.id}`) }))
  ));
  const updateBadge = () => {
    const snap = LokumUpdater.snapshot();
    const item = nav.querySelector('[data-id="updates"]');
    item?.querySelector(".lk-nav-badge")?.remove();
    if (["available", "downloading", "ready"].includes(snap.status)) {
      item?.append(el("span", { class: "lk-badge lk-nav-badge", text: snap.version }));
    }
  };
  updateBadge();
  const obs = () => updateBadge();
  Services.obs.addObserver(obs, LokumUpdater.TOPIC);
  window.addEventListener("unload", () => Services.obs.removeObserver(obs, LokumUpdater.TOPIC));
}

function show(id, { focusKey = null } = {}) {
  if (!SECTIONS.some(s => s.id === id)) {
    id = "appearance";
  }
  searchInput.value = "";
  main.querySelector(".lk-search-results")?.remove();
  for (const section of main.querySelectorAll(".lk-section")) {
    section.hidden = true;
  }
  const node = buildSection(id);
  if (!node.isConnected) {
    main.append(node);
  }
  node.hidden = false;
  // Restart the entrance animation.
  node.style.animation = "none";
  void node.offsetWidth;
  node.style.animation = "";
  currentId = id;
  for (const link of nav.querySelectorAll(".lk-nav-item")) {
    if (link.dataset.id === id) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }
  document.title = `${t(`settings.${id}`)} · Lokum`;
  if (focusKey) {
    const target = node.querySelector(`[data-key="${CSS.escape(focusKey)}"]`);
    if (target) {
      target.scrollIntoView({ block: "center", behavior: "smooth" });
      target.classList.remove("lk-highlight");
      void target.offsetWidth;
      target.classList.add("lk-highlight");
    }
  } else {
    window.scrollTo({ top: 0 });
  }
}

function runSearch() {
  const q = searchInput.value.trim().toLowerCase();
  main.querySelector(".lk-search-results")?.remove();
  if (!q) {
    show(currentId || "appearance");
    return;
  }
  for (const section of main.querySelectorAll(".lk-section")) {
    section.hidden = true;
  }
  const results = el("div", { class: "lk-section lk-search-results" },
    el("header", { class: "lk-hero" },
      el("div", { class: "lk-hero-icon" }, icon("search")),
      el("div", {}, el("h1", { text: t("settings.search.results") }), el("p", { text: `“${searchInput.value.trim()}”` }))
    )
  );
  let count = 0;
  for (const s of SECTIONS) {
    const node = buildSection(s.id);
    const rows = [...node.querySelectorAll(".lk-row[data-search]")].filter(r => r.dataset.search.includes(q));
    const titleMatch = t(`settings.${s.id}`).toLowerCase().includes(q);
    if (!rows.length && !titleMatch) {
      continue;
    }
    results.append(el("div", { class: "lk-result-section", text: t(`settings.${s.id}`) }));
    const list = el("div", { class: "lk-group lk-card" });
    for (const r of rows.length ? rows : []) {
      const link = el("div", {
        class: "lk-row",
        style: { cursor: "pointer" },
        onclick: () => {
          location.hash = s.id;
          show(s.id, { focusKey: r.dataset.key });
        },
      },
        el("div", { class: "lk-row-text" },
          el("div", { class: "lk-row-title", text: r.querySelector(".lk-row-title")?.textContent }),
          el("div", { class: "lk-row-desc", text: r.querySelector(".lk-row-desc")?.textContent || "" })
        ),
        icon("arrow-right")
      );
      list.append(link);
      count++;
    }
    if (!rows.length) {
      list.append(el("div", { class: "lk-row", style: { cursor: "pointer" }, onclick: () => (location.hash = s.id) },
        el("div", { class: "lk-row-text" }, el("div", { class: "lk-row-title", text: t(`settings.${s.id}`) })), icon("arrow-right")));
      count++;
    }
    results.append(list);
  }
  if (!count) {
    results.append(el("div", { class: "lk-search-empty", text: t("settings.search.none") }));
  }
  main.append(results);
}

function route() {
  const id = (location.hash || "#appearance").slice(1).split("?")[0];
  show(id);
}

/* ---------------------------------------------------------------- start */

initPage();
document.getElementById("brand-version").textContent = `${LokumVersion.version} · Firefox ${Services.appinfo.version}`;
document.getElementById("nav-footer").textContent = t("settings.footer");
searchInput.placeholder = t("settings.search.placeholder");
searchInput.addEventListener("input", runSearch);
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key === "f") {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
});
renderNav();
window.addEventListener("hashchange", route);
route();

// Rebuild everything when the UI language changes.
const offLocale = LokumI18n.onChange(() => {
  built.clear();
  main.replaceChildren();
  renderNav();
  route();
});
window.addEventListener("unload", offLocale);
