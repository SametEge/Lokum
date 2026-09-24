/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Shared helpers for Lokum's privileged pages (about:lokum, the welcome
 * wizard): module access, live theming, i18n and pref-bound controls.
 */

const M = path => ChromeUtils.importESModule(`chrome://lokum/content/modules/${path}.sys.mjs`);

export const { LokumPrefs } = M("LokumPrefs");
export const { LokumFlavors } = M("LokumFlavors");
export const { LokumI18n } = M("LokumI18n");
export const { LokumVersion, compareVersions } = M("LokumVersion");
export const { LokumLayout } = M("LokumLayout");
export const { LokumSpaces, SPACE_ICONS } = M("LokumSpaces");
export const { LokumUpdater } = M("LokumUpdater");
export const { LokumTabs } = M("LokumTabs");
export const { LokumShell } = M("LokumShell");
export const { importFirefoxModule } = M("LokumCompat");
export const { LokumAddons, UBLOCK_ID } = M("LokumAddons");

export const t = (key, args) => LokumI18n.t(key, args);
export const tp = (key, count, args) => LokumI18n.tp(key, count, args);

const HTML_NS = "http://www.w3.org/1999/xhtml";

/** Tiny hyperscript helper. */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElementNS(HTML_NS, tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (value === false || value === null || value === undefined) {
      continue;
    }
    if (key === "class") {
      node.className = value;
    } else if (key === "text") {
      node.textContent = value;
    } else if (key === "html") {
      throw new Error("el(): html is not supported");
    } else if (key === "style" && typeof value === "object") {
      for (const [p, v] of Object.entries(value)) {
        node.style.setProperty(p, v);
      }
    } else if (key === "dataset") {
      Object.assign(node.dataset, value);
    } else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key in node && typeof value !== "string") {
      node[key] = value;
    } else {
      node.setAttribute(key, value === true ? "" : value);
    }
  }
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) {
      continue;
    }
    node.append(typeof child === "string" || typeof child === "number" ? String(child) : child);
  }
  return node;
}

export function icon(name, cls = "lk-icon") {
  return el("img", { class: cls, src: `chrome://lokum/content/images/icons/${name}.svg`, alt: "", role: "presentation" });
}

/* ----------------------------------------------------------------- theme */

let themeFlavorOverride = null;

export function applyTheme(flavor = null) {
  const root = document.documentElement;
  const id = flavor || themeFlavorOverride || LokumPrefs.get("lokum.flavor");
  LokumFlavors.apply(root, id, { customAccent: LokumPrefs.get("lokum.accent.custom") });
  root.setAttribute("lokum-animations", LokumPrefs.get("lokum.animations"));
}

/** Pages can preview a flavor without saving it (welcome wizard hover). */
export function previewFlavor(id) {
  themeFlavorOverride = id;
  applyTheme();
}

/* ------------------------------------------------------------------ prefs */

const prefListeners = new Map();
const observer = {
  observe(subject, topic, name) {
    for (const [prefix, callbacks] of prefListeners) {
      if (name === prefix || (prefix.endsWith(".") && name.startsWith(prefix))) {
        for (const cb of callbacks) {
          try {
            cb(name);
          } catch (ex) {
            console.error(ex);
          }
        }
      }
    }
  },
  QueryInterface: ChromeUtils.generateQI(["nsIObserver", "nsISupportsWeakReference"]),
};

export function onPref(name, callback) {
  if (!prefListeners.has(name)) {
    prefListeners.set(name, new Set());
    Services.prefs.addObserver(name, observer, true);
  }
  prefListeners.get(name).add(callback);
}

window.addEventListener("unload", () => {
  for (const name of prefListeners.keys()) {
    try {
      Services.prefs.removeObserver(name, observer);
    } catch (ex) {}
  }
  prefListeners.clear();
});

export function getPref(name, fallback) {
  return LokumPrefs.get(name, fallback);
}

export function setPref(name, value) {
  LokumPrefs.set(name, value);
}

/* --------------------------------------------------------------- controls */

let idCounter = 0;
const uid = prefix => `${prefix}-${++idCounter}`;

/** Toggle switch bound to a boolean pref (optionally inverted / custom). */
export function toggleControl({ pref, invert = false, get, set, onChange, label }) {
  const input = el("input", { type: "checkbox", role: "switch", "aria-label": label || pref || "" });
  const read = () => (get ? get() : invert ? !getPref(pref) : !!getPref(pref));
  input.checked = read();
  input.addEventListener("change", () => {
    const value = input.checked;
    if (set) {
      set(value);
    } else {
      setPref(pref, invert ? !value : value);
    }
    onChange?.(value);
  });
  if (pref) {
    onPref(pref, () => (input.checked = read()));
  }
  const wrapper = el("label", { class: "lk-toggle" }, input, el("span", { class: "lk-toggle-track" }));
  wrapper.refresh = () => (input.checked = read());
  return wrapper;
}

/** Segmented control. options: [{value, label, icon?}] */
export function segmentedControl({ pref, options, get, set, name = uid("seg"), onChange }) {
  const read = () => String(get ? get() : getPref(pref));
  const wrapper = el("div", { class: "lk-segmented", role: "radiogroup" });
  const inputs = [];
  for (const option of options) {
    const input = el("input", { type: "radio", name, value: String(option.value) });
    input.checked = read() === String(option.value);
    input.addEventListener("change", () => {
      if (!input.checked) {
        return;
      }
      const value = typeof option.value === "number" ? Number(input.value) : option.value;
      if (set) {
        set(value);
      } else {
        setPref(pref, value);
      }
      onChange?.(value);
    });
    inputs.push(input);
    wrapper.append(el("label", {}, input, el("span", {}, option.icon ? icon(option.icon) : null, option.label)));
  }
  const refresh = () => {
    const value = read();
    for (const input of inputs) {
      input.checked = input.value === value;
    }
  };
  if (pref) {
    onPref(pref, refresh);
  }
  wrapper.refresh = refresh;
  return wrapper;
}

/** <select> bound to a pref. options: [{value, label}] */
export function selectControl({ pref, options, get, set, onChange, label }) {
  const select = el("select", { class: "lk-select", "aria-label": label || pref || "" });
  const fill = opts => {
    select.replaceChildren(...opts.map(o => el("option", { value: String(o.value), text: o.label })));
  };
  fill(options);
  const read = () => String(get ? get() : getPref(pref));
  select.value = read();
  select.addEventListener("change", () => {
    const option = options.find(o => String(o.value) === select.value);
    const value = option ? option.value : select.value;
    if (set) {
      set(value);
    } else {
      setPref(pref, value);
    }
    onChange?.(value);
  });
  if (pref) {
    onPref(pref, () => (select.value = read()));
  }
  select.setOptions = opts => {
    options = opts;
    fill(opts);
    select.value = read();
  };
  select.refresh = () => (select.value = read());
  return select;
}

/** Range slider bound to an integer pref. */
export function rangeControl({ pref, min, max, step = 1, unit = "px" }) {
  const input = el("input", { type: "range", min, max, step });
  const output = el("output");
  const paint = () => {
    const value = Number(input.value);
    output.textContent = `${value}${unit}`;
    input.style.setProperty("--fill", `${((value - min) / (max - min)) * 100}%`);
  };
  input.value = getPref(pref);
  paint();
  input.addEventListener("input", () => {
    paint();
    setPref(pref, Number(input.value));
  });
  onPref(pref, () => {
    input.value = getPref(pref);
    paint();
  });
  return el("div", { class: "lk-range" }, input, output);
}

/* ------------------------------------------------------------------- misc */

export function formatBytes(bytes) {
  if (!bytes) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${units[i]}`;
}

export function formatDate(value) {
  if (!value) {
    return "";
  }
  const date = typeof value === "number" ? new Date(value) : new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(LokumI18n.locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function relativeTime(ms) {
  const diff = ms - Date.now();
  const rtf = new Intl.RelativeTimeFormat(LokumI18n.locale, { numeric: "auto" });
  const abs = Math.abs(diff);
  const units = [
    ["year", 365 * 864e5],
    ["month", 30 * 864e5],
    ["week", 7 * 864e5],
    ["day", 864e5],
    ["hour", 36e5],
    ["minute", 6e4],
  ];
  for (const [unit, size] of units) {
    if (abs >= size) {
      return rtf.format(Math.round(diff / size), unit);
    }
  }
  return rtf.format(0, "minute");
}

/**
 * Minimal, safe Markdown renderer for release notes: headings, lists, bold,
 * italics, inline code and links. Produces DOM nodes (never innerHTML).
 */
export function renderMarkdown(text) {
  const container = el("div", { class: "lk-markdown" });
  let list = null;
  const inline = line => {
    const out = [];
    const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    let last = 0;
    let m;
    while ((m = re.exec(line))) {
      if (m.index > last) {
        out.push(line.slice(last, m.index));
      }
      const token = m[0];
      if (token.startsWith("**")) {
        out.push(el("strong", { text: token.slice(2, -2) }));
      } else if (token.startsWith("`")) {
        out.push(el("code", { text: token.slice(1, -1) }));
      } else if (token.startsWith("[")) {
        const [, label, href] = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
        if (/^https:\/\//.test(href)) {
          out.push(el("a", { href, text: label, target: "_blank", rel: "noopener" }));
        } else {
          out.push(label);
        }
      } else {
        out.push(el("em", { text: token.slice(1, -1) }));
      }
      last = m.index + token.length;
    }
    if (last < line.length) {
      out.push(line.slice(last));
    }
    return out;
  };
  for (const raw of String(text || "").split(/\r?\n/)) {
    const line = raw.trimEnd();
    const bullet = /^\s*[-*+]\s+(.*)$/.exec(line);
    if (bullet) {
      if (!list) {
        list = el("ul");
        container.append(list);
      }
      list.append(el("li", {}, inline(bullet[1])));
      continue;
    }
    list = null;
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      container.append(el(`h${Math.min(4, heading[1].length + 2)}`, {}, inline(heading[2])));
    } else if (line.trim()) {
      container.append(el("p", {}, inline(line)));
    }
  }
  return container;
}

/** Common page bootstrap: theme, direction, language, live updates. */
export function initPage() {
  const root = document.documentElement;
  root.lang = LokumI18n.locale;
  root.dir = LokumI18n.dir;
  applyTheme();
  onPref("lokum.flavor", () => applyTheme());
  onPref("lokum.accent.custom", () => applyTheme());
  onPref("lokum.animations", () => applyTheme());
}
