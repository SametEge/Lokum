/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Lokum "flavors" are the themes of the browser, each one named after a kind
 * of Turkish delight. A flavor is a small palette; every token is emitted as
 * a CSS light-dark() pair so the engine picks the right half from the
 * window's color-scheme without any JavaScript involvement.
 */

import { isHexColor, luminance } from "chrome://lokum/content/modules/LokumCore.sys.mjs";

// [light, dark] pairs.
const FLAVOR_DATA = {
  gul: {
    emoji: "🌹",
    frame: [
      ["#ffe4ee", "#2b1421"],
      ["#fac6da", "#3a1a2d"],
      ["#f1a2c2", "#4f203b"],
    ],
    accent: ["#d23c78", "#ff80b3"],
    accentText: ["#ffffff", "#2b0f1d"],
    text: ["#4a1730", "#fbe7f0"],
    muted: ["#8b5271", "#c9a0b5"],
    cube: ["#f7a8c8", "#e1729f"],
  },
  fistik: {
    emoji: "🌰",
    frame: [
      ["#f0f7e4", "#141d0e"],
      ["#d9ecc3", "#1d2a14"],
      ["#b9d894", "#2a3b1c"],
    ],
    accent: ["#55852a", "#a9d774"],
    accentText: ["#ffffff", "#15210b"],
    text: ["#24351a", "#e9f4dc"],
    muted: ["#5b7147", "#a9bd94"],
    cube: ["#bfdf94", "#86b85a"],
  },
  limon: {
    emoji: "🍋",
    frame: [
      ["#fffbe7", "#211d0b"],
      ["#fff0b6", "#2d2710"],
      ["#fbe184", "#3c3414"],
    ],
    accent: ["#a87800", "#ffd84d"],
    accentText: ["#ffffff", "#2a2200"],
    text: ["#3d3210", "#fff6d6"],
    muted: ["#7a6a30", "#c9bb88"],
    cube: ["#fce98f", "#f2c93c"],
  },
  nar: {
    emoji: "🍎",
    frame: [
      ["#ffe6e8", "#250a10"],
      ["#f8c0c6", "#351019"],
      ["#ec8d98", "#4a1623"],
    ],
    accent: ["#b01f3b", "#ff6d83"],
    accentText: ["#ffffff", "#2b060d"],
    text: ["#45101c", "#ffe3e7"],
    muted: ["#8c4250", "#d39aa4"],
    cube: ["#ee6f82", "#b8243f"],
  },
  portakal: {
    emoji: "🍊",
    frame: [
      ["#fff1e4", "#24150a"],
      ["#ffd9b6", "#331f0f"],
      ["#fcb880", "#452b14"],
    ],
    accent: ["#cf5b15", "#ffa15c"],
    accentText: ["#ffffff", "#2b1406"],
    text: ["#452612", "#ffebdc"],
    muted: ["#8a5c3c", "#d4a98a"],
    cube: ["#ffbf85", "#f18d3d"],
  },
  nane: {
    emoji: "🌿",
    frame: [
      ["#e9f8f2", "#0b201a"],
      ["#c8ede0", "#102c24"],
      ["#9cdbc6", "#153a2f"],
    ],
    accent: ["#1b8766", "#60e0b6"],
    accentText: ["#ffffff", "#062119"],
    text: ["#123a2f", "#ddf7ee"],
    muted: ["#4d796b", "#93c4b4"],
    cube: ["#a6e3cf", "#4fc39f"],
  },
  lavanta: {
    emoji: "💜",
    frame: [
      ["#f4efff", "#19132f"],
      ["#e2d6ff", "#221a40"],
      ["#c8b3fa", "#2f2456"],
    ],
    accent: ["#6a46d8", "#b8a0ff"],
    accentText: ["#ffffff", "#1b1136"],
    text: ["#2b1d52", "#eee8ff"],
    muted: ["#6a5a94", "#ada2d6"],
    cube: ["#cdb8ff", "#9a7cf0"],
  },
  sakiz: {
    emoji: "🤍",
    frame: [
      ["#fffdf7", "#1e1b15"],
      ["#f6f0e1", "#28241b"],
      ["#eadfc4", "#343023"],
    ],
    accent: ["#8a7141", "#e3cf9d"],
    accentText: ["#ffffff", "#262015"],
    text: ["#3a3121", "#f6f0e1"],
    muted: ["#7d735e", "#b8ae95"],
    cube: ["#fbf6e8", "#e2d3ad"],
  },
  hindistan: {
    emoji: "🥥",
    frame: [
      ["#ffffff", "#151517"],
      ["#f3f3f5", "#1d1d20"],
      ["#e5e5e9", "#28282c"],
    ],
    accent: ["#3f3f46", "#e4e4e7"],
    accentText: ["#ffffff", "#18181b"],
    text: ["#1e1e22", "#f4f4f5"],
    muted: ["#6b6b73", "#a1a1aa"],
    cube: ["#ffffff", "#d9d9de"],
  },
  kahve: {
    emoji: "☕",
    frame: [
      ["#f8eee5", "#1a110c"],
      ["#ead6c4", "#251912"],
      ["#d8b99e", "#332218"],
    ],
    accent: ["#6d4125", "#d9a676"],
    accentText: ["#ffffff", "#20140c"],
    text: ["#33200f", "#f5e6d8"],
    muted: ["#7a5a42", "#bfa288"],
    cube: ["#b98a64", "#7a4d2e"],
  },
  gece: {
    emoji: "🌙",
    frame: [
      ["#eeeaf7", "#0e0b1b"],
      ["#d7cfec", "#16112a"],
      ["#b9acdc", "#21193c"],
    ],
    accent: ["#4a3a8b", "#a192ff"],
    accentText: ["#ffffff", "#120d26"],
    text: ["#1f1838", "#eae6ff"],
    muted: ["#5d5680", "#9e97c7"],
    cube: ["#6c5bb3", "#2e2560"],
  },
  karisik: {
    emoji: "🎨",
    frame: [
      ["#ffe4ee", "#2b1421"],
      ["#fff0b6", "#2d2710"],
      ["#d9ecc3", "#1d2a14"],
    ],
    accent: ["#d23c78", "#ff80b3"],
    accentText: ["#ffffff", "#2b0f1d"],
    text: ["#3f2233", "#fbe7f0"],
    muted: ["#7f5a6e", "#c9a0b5"],
    cube: ["#f7a8c8", "#bfdf94"],
    animated: true,
  },
};

export const FLAVOR_IDS = Object.freeze(Object.keys(FLAVOR_DATA));
export const DEFAULT_FLAVOR = "gul";

const pair = ([light, dark]) => `light-dark(${light}, ${dark})`;

export const LokumFlavors = {
  ids: FLAVOR_IDS,

  has(id) {
    return Object.hasOwn(FLAVOR_DATA, id);
  },

  get(id) {
    return FLAVOR_DATA[this.has(id) ? id : DEFAULT_FLAVOR];
  },

  /** Light/dark swatches used by pickers (cubes, dots, previews). */
  swatch(id) {
    const f = this.get(id);
    return {
      id: this.has(id) ? id : DEFAULT_FLAVOR,
      emoji: f.emoji,
      light: {
        frame: f.frame.map(p => p[0]),
        accent: f.accent[0],
        cube: f.cube[0],
        text: f.text[0],
      },
      dark: {
        frame: f.frame.map(p => p[1]),
        accent: f.accent[1],
        cube: f.cube[1],
        text: f.text[1],
      },
      animated: !!f.animated,
    };
  },

  /**
   * CSS custom properties for a flavor. `customAccent` (a #rrggbb string)
   * replaces the accent in both schemes.
   */
  cssVariables(id, { customAccent = "" } = {}) {
    const f = this.get(id);
    const vars = {
      "--lk-frame-1": pair(f.frame[0]),
      "--lk-frame-2": pair(f.frame[1]),
      "--lk-frame-3": pair(f.frame[2]),
      "--lk-accent": pair(f.accent),
      "--lk-accent-text": pair(f.accentText),
      "--lk-text": pair(f.text),
      "--lk-text-muted": pair(f.muted),
      "--lk-cube-1": pair([f.cube[0], f.cube[0]]),
      "--lk-cube-2": pair([f.cube[1], f.cube[1]]),
    };
    if (isHexColor(customAccent)) {
      vars["--lk-accent"] = customAccent;
      vars["--lk-accent-text"] =
        luminance(customAccent) > 0.45 ? "#1b1b1f" : "#ffffff";
    }
    return vars;
  },

  /** Applies a flavor to an element (usually a document root). */
  apply(element, id, options = {}) {
    const flavorId = this.has(id) ? id : DEFAULT_FLAVOR;
    const vars = this.cssVariables(flavorId, options);
    for (const [name, value] of Object.entries(vars)) {
      element.style.setProperty(name, value);
    }
    element.setAttribute("lokum-flavor", flavorId);
    element.toggleAttribute("lokum-flavor-animated", !!this.get(flavorId).animated);
  },
};
