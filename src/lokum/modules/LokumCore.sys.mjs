/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Pure helpers with no Firefox dependencies. They are shared by the chrome
 * modules and unit-tested with Node (tests/unit).
 */

/** Compares two dotted versions ("1.2.10" > "1.2.9"). Pre-release tags sort first. */
export function compareVersions(a, b) {
  const parse = v => {
    const clean = String(v).trim().replace(/^v/i, "").split("+")[0];
    const dash = clean.indexOf("-");
    const core = dash >= 0 ? clean.slice(0, dash) : clean;
    const pre = dash >= 0 ? clean.slice(dash + 1) : "";
    return { nums: core.split(".").map(n => parseInt(n, 10) || 0), pre };
  };
  const pa = parse(a);
  const pb = parse(b);
  const len = Math.max(pa.nums.length, pb.nums.length);
  for (let i = 0; i < len; i++) {
    const diff = (pa.nums[i] || 0) - (pb.nums[i] || 0);
    if (diff) {
      return diff > 0 ? 1 : -1;
    }
  }
  if (pa.pre === pb.pre) {
    return 0;
  }
  if (!pa.pre) {
    return 1;
  }
  if (!pb.pre) {
    return -1;
  }
  // Compare pre-release identifiers numerically where possible (beta.10 > beta.9).
  const ia = pa.pre.split(".");
  const ib = pb.pre.split(".");
  for (let i = 0; i < Math.max(ia.length, ib.length); i++) {
    if (ia[i] === undefined) {
      return -1;
    }
    if (ib[i] === undefined) {
      return 1;
    }
    const na = Number(ia[i]);
    const nb = Number(ib[i]);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) {
      if (na !== nb) {
        return na > nb ? 1 : -1;
      }
    } else if (ia[i] !== ib[i]) {
      return ia[i] > ib[i] ? 1 : -1;
    }
  }
  return 0;
}

/** Lowercases and strips accents; Turkish dotless ı matches i. */
export function fold(str) {
  return String(str)
    .toLocaleLowerCase()
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Subsequence fuzzy score; higher is better, -1 means no match. */
export function fuzzyScore(query, text) {
  const q = fold(query).trim();
  const s = fold(text);
  if (!q) {
    return 0;
  }
  const direct = s.indexOf(q);
  if (direct >= 0) {
    return 1000 - direct * 2 - (s.length - q.length) * 0.1 + (direct === 0 ? 200 : 0);
  }
  let score = 0;
  let si = 0;
  let streak = 0;
  for (const ch of q) {
    if (ch === " ") {
      continue;
    }
    const found = s.indexOf(ch, si);
    if (found < 0) {
      return -1;
    }
    streak = found === si ? streak + 1 : 0;
    const wordStart = found === 0 || /[\s\-_./]/.test(s[found - 1]);
    score += 10 + streak * 6 + (wordStart ? 14 : 0) - (found - si) * 0.5;
    si = found + 1;
  }
  return score;
}

/** Lokum's dictionaries, with the Firefox locale each one maps to. */
export const LOKUM_LOCALES = Object.freeze([
  { code: "en", firefox: "en-US", name: "English", flag: "🇬🇧" },
  { code: "tr", firefox: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "de", firefox: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", firefox: "fr", name: "Français", flag: "🇫🇷" },
  { code: "it", firefox: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "rm", firefox: "rm", name: "Rumantsch", flag: "🇨🇭" },
  { code: "es", firefox: "es-ES", name: "Español", flag: "🇪🇸" },
  { code: "sv", firefox: "sv-SE", name: "Svenska", flag: "🇸🇪" },
  { code: "ko", firefox: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ja", firefox: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh-CN", firefox: "zh-CN", name: "简体中文", flag: "🇨🇳" },
  { code: "zh-TW", firefox: "zh-TW", name: "繁體中文", flag: "🇹🇼" },
]);

/** Maps any BCP 47 tag ("es-MX", "zh-Hant-TW", "de-CH", "gsw") to one of ours. */
export function matchLokumLocale(tag, fallback = "en") {
  if (!tag) {
    return fallback;
  }
  const lower = String(tag).toLowerCase();
  if (lower.startsWith("zh")) {
    return /(tw|hk|mo|hant)/.test(lower) ? "zh-TW" : "zh-CN";
  }
  if (lower.startsWith("gsw")) {
    return "de"; // Swiss German
  }
  const lang = lower.split(/[-_]/)[0];
  const found = LOKUM_LOCALES.find(l => l.code === lang);
  return found ? found.code : fallback;
}

/** Fills {name} placeholders. Unknown placeholders are left untouched. */
export function formatTemplate(template, args) {
  if (!args) {
    return template;
  }
  return String(template).replace(/\{(\w+)\}/g, (match, name) =>
    Object.hasOwn(args, name) ? String(args[name]) : match
  );
}

/** Relative luminance of a #rrggbb color (0..1). */
export function luminance(hex) {
  const channel = i => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/** WCAG contrast ratio between two #rrggbb colors. */
export function contrastRatio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function isHexColor(value) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}
