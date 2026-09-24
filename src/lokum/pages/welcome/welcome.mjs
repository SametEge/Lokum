/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* The Lokum first-run wizard ("Hoş geldin"). Every choice is applied live,
 * so the browser behind the glass changes as you pick. */

import {
  LokumPrefs,
  LokumFlavors,
  LokumI18n,
  LokumLayout,
  LokumSpaces,
  LokumShell,
  importFirefoxModule,
  t,
  tp,
  el,
  icon,
  initPage,
  applyTheme,
  getPref,
  setPref,
  toggleControl,
  segmentedControl,
} from "chrome://lokum/content/pages/shared/page.mjs";

const OVERLAY = window.frameElement?.id === "lokum-onboarding";
const topWindow = () =>
  window.browsingContext?.topChromeWindow ||
  Services.wm.getMostRecentWindow("navigator:browser");
const reduceMotion = () =>
  getPref("lokum.animations") === "off" || matchMedia("(prefers-reduced-motion: reduce)").matches;

const STEPS = ["intro", "flavor", "layout", "spaces", "import", "privacy", "finish"];
let index = 0;
const choices = {
  spaces: new Set(["personal"]),
  imported: new Set(),
};

/* ================================================================ sugar */

const Sugar = {
  canvas: document.getElementById("sugar"),
  particles: [],
  bursts: [],
  running: false,
  last: 0,

  init() {
    this.ctx = this.canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
    const count = Math.round((innerWidth * innerHeight) / 14000);
    for (let i = 0; i < count; i++) {
      this.particles.push(this.spawn(true));
    }
    this.start();
    document.addEventListener("visibilitychange", () => (document.hidden ? this.stop() : this.start()));
  },

  resize() {
    const dpr = devicePixelRatio || 1;
    this.canvas.width = innerWidth * dpr;
    this.canvas.height = innerHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  },

  spawn(anywhere = false) {
    return {
      x: Math.random() * innerWidth,
      y: anywhere ? Math.random() * innerHeight : -10,
      r: 0.6 + Math.random() * 1.9,
      vy: 8 + Math.random() * 22,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.4 + Math.random() * 1.2,
      twinkle: Math.random() * Math.PI * 2,
    };
  },

  /** Powdered sugar puff (when a cube is picked). */
  burst(x, y, color = "255,255,255", amount = 46) {
    if (reduceMotion()) {
      return;
    }
    for (let i = 0; i < amount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 90 + Math.random() * 260;
      this.bursts.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 120,
        r: 1 + Math.random() * 3,
        life: 1,
        decay: 0.55 + Math.random() * 0.6,
        color: Math.random() < 0.7 ? "255,255,255" : color,
      });
    }
    this.start();
  },

  /** Confetti of tiny lokum cubes (finish step). */
  confetti(colors) {
    if (reduceMotion()) {
      return;
    }
    for (let i = 0; i < 160; i++) {
      this.bursts.push({
        x: innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: innerHeight * 0.42,
        vx: (Math.random() - 0.5) * 900,
        vy: -300 - Math.random() * 500,
        r: 3 + Math.random() * 5,
        life: 1,
        decay: 0.25 + Math.random() * 0.3,
        square: true,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 10,
        color: colors[i % colors.length],
      });
    }
    this.start();
  },

  start() {
    if (this.running || reduceMotion()) {
      if (reduceMotion()) {
        this.drawStatic();
      }
      return;
    }
    this.running = true;
    this.last = performance.now();
    const tick = now => {
      if (!this.running) {
        return;
      }
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.step(dt);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },

  stop() {
    this.running = false;
  },

  drawStatic() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  step(dt) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of this.particles) {
      p.y += p.vy * dt;
      p.sway += p.swaySpeed * dt;
      p.twinkle += dt * 2;
      p.x += Math.sin(p.sway) * 12 * dt;
      if (p.y > innerHeight + 10) {
        Object.assign(p, this.spawn());
      }
      const alpha = 0.35 + Math.sin(p.twinkle) * 0.3;
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0.05, alpha)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      b.vy += 520 * dt;
      b.vx *= 0.985;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= b.decay * dt;
      if (b.life <= 0 || b.y > innerHeight + 40) {
        this.bursts.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = Math.max(0, b.life);
      ctx.fillStyle = b.color.startsWith("#") ? b.color : `rgb(${b.color})`;
      if (b.square) {
        b.rot += b.vr * dt;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.beginPath();
        ctx.roundRect(-b.r, -b.r, b.r * 2, b.r * 2, b.r * 0.4);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  },
};

function buildFloaters() {
  const host = document.getElementById("floaters");
  const specs = [
    { x: 6, y: 12, size: 150, blur: 18 },
    { x: 82, y: 8, size: 110, blur: 14 },
    { x: 90, y: 62, size: 190, blur: 26 },
    { x: 4, y: 70, size: 120, blur: 12 },
    { x: 44, y: 88, size: 90, blur: 10 },
    { x: 64, y: 30, size: 70, blur: 22 },
  ];
  for (const [i, s] of specs.entries()) {
    host.append(el("div", {
      class: "lk-floater",
      style: {
        left: `${s.x}%`,
        top: `${s.y}%`,
        "--size": `${s.size}px`,
        "--blur": `${s.blur}px`,
        "--rot": `${i * 23}deg`,
        "--dx": `${(i % 2 ? -1 : 1) * (20 + i * 6)}px`,
        "--dy": `${(i % 3 ? 1 : -1) * (26 + i * 5)}px`,
        "--dur": `${9 + i * 2}s`,
        "--delay": `${-i}s`,
      },
    }));
  }
  // Gentle parallax with the pointer.
  if (!reduceMotion()) {
    window.addEventListener("pointermove", e => {
      const dx = (e.clientX / innerWidth - 0.5) * 18;
      const dy = (e.clientY / innerHeight - 0.5) * 18;
      host.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    host.style.transition = "transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1)";
  }
}

/* ============================================================= helpers */

/** Headline with falling words; [brackets] mark the shimmering part. */
function headline(text) {
  const h = el("h1", { class: "lk-title" });
  const parts = String(text).split(/(\[[^\]]+\])/);
  let i = 0;
  const segmenter = new Intl.Segmenter(LokumI18n.locale, { granularity: "word" });
  for (const part of parts) {
    if (!part) {
      continue;
    }
    const grad = part.startsWith("[");
    const content = grad ? part.slice(1, -1) : part;
    const target = grad ? el("span", { class: "lk-grad" }) : h;
    for (const { segment } of segmenter.segment(content)) {
      target.append(el("span", { class: "lk-word", style: { "--i": String(i++) }, text: segment }));
    }
    if (grad) {
      h.append(target);
    }
  }
  return h;
}

function cube(id, cls = "lk-cube") {
  const s = LokumFlavors.swatch(id);
  const node = el("div", { class: cls }, ...Array.from({ length: 6 }, () => el("i")));
  node.style.setProperty("--c1", `light-dark(${s.light.cube}, ${s.dark.cube})`);
  node.style.setProperty("--c2", `light-dark(${s.light.accent}, ${s.dark.accent})`);
  return node;
}

function heroCube() {
  return el("div", { class: "lk-hero-cube" }, ...Array.from({ length: 6 }, () => el("i")));
}

function accentRGB() {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--lk-accent");
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(value);
  return m ? `${m[1]},${m[2]},${m[3]}` : "210,60,120";
}

/* =============================================================== steps */

const builders = {
  intro() {
    return [
      el("div", { class: "lk-hero-cube-wrap" }, heroCube()),
      el("div", { class: "lk-hero-shadow" }),
      el("span", { class: "lk-eyebrow" }, "🍬 ", t("welcome.intro.eyebrow")),
      headline(t("welcome.intro.title")),
      el("p", { class: "lk-subtitle", text: t("welcome.intro.subtitle") }),
    ];
  },

  flavor() {
    const caption = el("div", { class: "lk-flavor-caption" });
    const tray = el("div", { class: "lk-tray", role: "radiogroup", "aria-label": t("welcome.flavor.title") });
    const pieces = [];
    const describe = id => {
      caption.textContent = `${LokumFlavors.swatch(id).emoji}  ${t(`flavor.${id}`)} — ${t(`flavor.${id}.desc`)}`;
    };
    const select = (id, piece, { burst = true } = {}) => {
      setPref("lokum.flavor", id);
      for (const p of pieces) {
        p.setAttribute("aria-checked", String(p.dataset.flavor === id));
      }
      describe(id);
      if (piece && burst) {
        piece.classList.remove("jump");
        void piece.offsetWidth;
        piece.classList.add("jump");
        const rect = piece.querySelector(".lk-cube").getBoundingClientRect();
        const s = LokumFlavors.swatch(id);
        const hex = s.light.accent;
        const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(",");
        setTimeout(() => Sugar.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, rgb), 220);
      }
    };
    LokumFlavors.ids.forEach((id, i) => {
      const piece = el("button", {
        class: "lk-piece",
        role: "radio",
        style: { "--i": String(i) },
        onclick: () => select(id, piece),
        onmouseenter: () => describe(id),
        onmouseleave: () => describe(getPref("lokum.flavor")),
        onfocus: () => describe(id),
      }, cube(id), el("span", { class: "lk-piece-name", text: t(`flavor.${id}`) }));
      piece.dataset.flavor = id;
      piece.setAttribute("aria-checked", String(id === getPref("lokum.flavor")));
      pieces.push(piece);
      tray.append(piece);
    });
    describe(getPref("lokum.flavor"));

    const surprise = el("button", {
      class: "lk-button",
      onclick: async () => {
        surprise.disabled = true;
        const order = LokumFlavors.ids;
        const target = Math.floor(Math.random() * order.length);
        const spins = order.length * 2 + target;
        for (let s = 0; s <= spins; s++) {
          const p = pieces[s % order.length];
          pieces.forEach(x => x.classList.toggle("roulette", x === p));
          await new Promise(r => setTimeout(r, reduceMotion() ? 0 : 40 + (s / spins) ** 3 * 220));
        }
        pieces.forEach(x => x.classList.remove("roulette"));
        select(order[target], pieces[target]);
        surprise.disabled = false;
      },
    }, "🎲 ", t("welcome.flavor.surprise"));

    return [
      el("span", { class: "lk-eyebrow" }, "🎨 ", t("welcome.flavor.eyebrow")),
      headline(t("welcome.flavor.title")),
      el("p", { class: "lk-subtitle", text: t("welcome.flavor.subtitle") }),
      tray,
      caption,
      el("div", { class: "lk-row-inline" },
        segmentedControl({
          pref: "lokum.appearance",
          options: [
            { value: "auto", label: t("settings.appearance.mode.auto"), icon: "sparkle" },
            { value: "light", label: t("settings.appearance.mode.light"), icon: "sun" },
            { value: "dark", label: t("settings.appearance.mode.dark"), icon: "moon" },
          ],
        }),
        surprise
      ),
    ];
  },

  layout() {
    const wrap = el("div", { class: "lk-layouts", role: "radiogroup" });
    const cards = [];
    const mock = id => {
      const side = () => el("div", { class: "side" },
        id === "arc" ? el("div", { class: "url" }) : null,
        el("div", { class: "tab sel" }), el("div", { class: "tab" }), el("div", { class: "tab" }), el("div", { class: "tab" }));
      if (id === "arc") {
        return el("div", { class: "lk-mock arc" }, side(), el("div", { class: "page" }));
      }
      if (id === "vertical") {
        return el("div", { class: "lk-mock vertical" }, el("div", { class: "top" }), side(), el("div", { class: "page" }));
      }
      return el("div", { class: "lk-mock horizontal" },
        el("div", { class: "tabs" }, el("div", { class: "tab sel" }), el("div", { class: "tab" }), el("div", { class: "tab" })),
        el("div", { class: "top" }), el("div", { class: "page" }));
    };
    ["arc", "vertical", "horizontal"].forEach((id, i) => {
      const card = el("button", {
        class: "lk-layout",
        role: "radio",
        style: { "--i": String(i) },
        onclick: () => {
          LokumLayout.set(id);
          cards.forEach(c => c.setAttribute("aria-checked", String(c.dataset.layout === id)));
        },
      }, mock(id), el("h3", { text: t(`layout.${id}`) }), el("p", { text: t(`layout.${id}.desc`) }));
      card.dataset.layout = id;
      card.setAttribute("aria-checked", String(id === LokumLayout.current));
      cards.push(card);
      wrap.append(card);
    });
    return [
      el("span", { class: "lk-eyebrow" }, "🧭 ", t("welcome.layout.eyebrow")),
      headline(t("welcome.layout.title")),
      el("p", { class: "lk-subtitle", text: t("welcome.layout.subtitle") }),
      wrap,
      el("div", { class: "lk-mini-options" },
        el("label", { class: "lk-mini-option" }, t("settings.layout.position"),
          segmentedControl({
            pref: "lokum.sidebar.position",
            options: [
              { value: "left", label: t("settings.layout.position.left") },
              { value: "right", label: t("settings.layout.position.right") },
            ],
          })),
        el("label", { class: "lk-mini-option" }, toggleControl({ pref: "lokum.compact" }), t("settings.layout.compact"))
      ),
    ];
  },

  spaces() {
    const presets = [
      { id: "personal", emoji: "🌸", flavor: null, name: t("welcome.spaces.personal"), desc: t("welcome.spaces.personal.desc") },
      { id: "work", emoji: "💼", flavor: "fistik", name: t("welcome.spaces.work"), desc: t("welcome.spaces.work.desc") },
      { id: "school", emoji: "📚", flavor: "lavanta", name: t("welcome.spaces.school"), desc: t("welcome.spaces.school.desc") },
      { id: "fun", emoji: "🎮", flavor: "portakal", name: t("welcome.spaces.fun"), desc: t("welcome.spaces.fun.desc") },
    ];
    const grid = el("div", { class: "lk-space-presets" });
    presets.forEach((p, i) => {
      const s = LokumFlavors.swatch(p.flavor || getPref("lokum.flavor"));
      const card = el("button", {
        class: "lk-preset",
        role: "checkbox",
        style: {
          "--i": String(i),
          "--p1": `light-dark(${s.light.frame[0]}, ${s.dark.frame[0]})`,
          "--p3": `light-dark(${s.light.frame[2]}, ${s.dark.frame[2]})`,
          "--pa": `light-dark(${s.light.accent}, ${s.dark.accent})`,
          "--pt": `light-dark(${s.light.text}, ${s.dark.text})`,
        },
        onclick: () => {
          if (p.id === "personal") {
            return; // The first space always exists.
          }
          if (choices.spaces.has(p.id)) {
            choices.spaces.delete(p.id);
          } else {
            choices.spaces.add(p.id);
            const r = card.getBoundingClientRect();
            Sugar.burst(r.left + r.width / 2, r.top + 40, accentRGB(), 24);
          }
          card.setAttribute("aria-checked", String(choices.spaces.has(p.id)));
        },
      },
        el("span", { class: "tick" }, icon("check")),
        el("span", { class: "emoji", text: p.emoji }),
        el("strong", { text: p.name }),
        el("span", { text: p.desc })
      );
      card.setAttribute("aria-checked", String(choices.spaces.has(p.id)));
      grid.append(card);
    });
    builders._presets = presets;
    return [
      el("span", { class: "lk-eyebrow" }, "🗂️ ", t("welcome.spaces.eyebrow")),
      headline(t("welcome.spaces.title")),
      el("p", { class: "lk-subtitle", text: t("welcome.spaces.subtitle") }),
      grid,
      el("p", { class: "lk-subtitle", style: { "font-size": "13px" }, text: t("welcome.spaces.hint") }),
    ];
  },

  import() {
    const list = el("div", { class: "lk-browsers" }, el("span", { class: "lk-muted", text: "…" }));
    const BROWSERS = {
      chrome: ["Google Chrome", "#4285f4", "◉"],
      "chromium-edge": ["Microsoft Edge", "#0c7cd5", "◐"],
      brave: ["Brave", "#fb542b", "🦁"],
      opera: ["Opera", "#ff1b2d", "O"],
      "opera-gx": ["Opera GX", "#fa1e4e", "O"],
      vivaldi: ["Vivaldi", "#ef3939", "V"],
      firefox: ["Firefox", "#ff7139", "🦊"],
      chromium: ["Chromium", "#4c8bf5", "◎"],
      "chrome-beta": ["Chrome Beta", "#4285f4", "◉"],
      "chrome-dev": ["Chrome Dev", "#4285f4", "◉"],
      canary: ["Chrome Canary", "#f4b400", "◉"],
      safari: ["Safari", "#1e90ff", "🧭"],
    };
    (async () => {
      const found = [];
      try {
        const MU = importFirefoxModule("MigrationUtils");
        for (const key of MU.availableMigratorKeys || Object.keys(BROWSERS)) {
          if (!BROWSERS[key]) {
            continue;
          }
          try {
            if (await MU.getMigrator(key)) {
              found.push(key);
            }
          } catch (ex) {}
        }
        list.replaceChildren();
        found.forEach((key, i) => {
          const [name, color, glyph] = BROWSERS[key];
          const button = el("button", {
            class: `lk-browser${choices.imported.has(key) ? " done" : ""}`,
            style: { "--i": String(i), "--b": color },
            onclick: () => {
              MU.showMigrationWizard(topWindow(), { migratorKey: key, entrypoint: MU.MIGRATION_ENTRYPOINTS?.FIRSTRUN });
              choices.imported.add(key);
              button.classList.add("done");
            },
          }, el("span", { class: "logo", text: glyph }), el("span", { text: name }), icon("import"));
          list.append(button);
        });
        if (!found.length) {
          list.append(el("p", { class: "lk-subtitle", text: t("welcome.import.none") }));
        }
        list.append(el("button", {
          class: "lk-browser",
          style: { "--i": String(found.length) },
          onclick: () => MU.showMigrationWizard(topWindow(), { entrypoint: MU.MIGRATION_ENTRYPOINTS?.FIRSTRUN }),
        }, el("span", { class: "logo", text: "📄" }), el("span", { text: t("welcome.import.file") })));
      } catch (ex) {
        console.error(ex);
        list.replaceChildren(el("p", { class: "lk-subtitle", text: t("welcome.import.none") }));
      }
    })();
    return [
      el("span", { class: "lk-eyebrow" }, "📦 ", t("welcome.import.eyebrow")),
      headline(t("welcome.import.title")),
      el("p", { class: "lk-subtitle", text: t("welcome.import.subtitle") }),
      list,
    ];
  },

  privacy() {
    const shields = el("div", { class: "lk-privacy", role: "radiogroup" });
    const levels = [
      { id: "standard", emoji: "🛡️" },
      { id: "strict", emoji: "🔒" },
    ];
    const cards = [];
    for (const level of levels) {
      const card = el("button", {
        class: "lk-shield",
        role: "radio",
        onclick: () => {
          Services.prefs.setStringPref("browser.contentblocking.category", level.id);
          cards.forEach(c => c.setAttribute("aria-checked", String(c.dataset.level === level.id)));
        },
      }, el("span", { class: "big", text: level.emoji }), el("h3", { text: t(`welcome.privacy.${level.id}`) }), el("p", { text: t(`welcome.privacy.${level.id}.desc`) }));
      card.dataset.level = level.id;
      card.setAttribute("aria-checked", String(Services.prefs.getStringPref("browser.contentblocking.category", "standard") === level.id));
      cards.push(card);
      shields.append(card);
    }
    const toggleRow = (emoji, key, control) =>
      el("label", { class: "lk-toggle-row" },
        el("span", { class: "emoji", text: emoji }),
        el("span", { class: "text" }, el("strong", { text: t(key) }), el("span", { text: t(`${key}.desc`) })),
        control);

    choices.adblock = choices.adblock ?? true;
    return [
      el("span", { class: "lk-eyebrow" }, "🔐 ", t("welcome.privacy.eyebrow")),
      headline(t("welcome.privacy.title")),
      el("p", { class: "lk-subtitle", text: t("welcome.privacy.subtitle") }),
      shields,
      el("div", { class: "lk-toggles" },
        toggleRow("🧹", "welcome.privacy.adblock", toggleControl({ get: () => choices.adblock, set: v => (choices.adblock = v) })),
        toggleRow("🔗", "settings.privacy.https", toggleControl({ pref: "dom.security.https_only_mode" })),
        toggleRow("🌐", "welcome.privacy.doh", toggleControl({
          get: () => [2, 3].includes(Services.prefs.getIntPref("network.trr.mode", 0)),
          set: v => Services.prefs.setIntPref("network.trr.mode", v ? 2 : 5),
        })),
        toggleRow("📡", "welcome.privacy.telemetry", el("span", { class: "lk-badge", text: t("settings.privacy.telemetry.off") }))
      ),
    ];
  },

  finish() {
    const summary = el("div", { class: "lk-summary" },
      el("span", { class: "lk-badge", text: `${LokumFlavors.swatch(getPref("lokum.flavor")).emoji} ${t(`flavor.${getPref("lokum.flavor")}`)}` }),
      el("span", { class: "lk-badge", text: `🧭 ${t(`layout.${LokumLayout.current}`)}` }),
      el("span", { class: "lk-badge", text: `🗂️ ${tp("welcome.finish.spaces", choices.spaces.size)}` })
    );
    const defaultButton = el("button", {
      class: "lk-button lk-big-button",
      onclick: () => {
        LokumShell.setAsDefault();
        defaultButton.textContent = "✓ " + t("welcome.finish.defaultDone");
      },
    }, "⭐ ", t("welcome.finish.default"));
    if (LokumShell.isDefaultBrowser()) {
      defaultButton.hidden = true;
    }
    setTimeout(() => {
      const colors = LokumFlavors.ids.map(id => LokumFlavors.swatch(id).light.cube);
      Sugar.confetti(colors);
    }, 350);
    return [
      el("div", { class: "lk-finish-cube" }, heroCube()),
      el("span", { class: "lk-eyebrow" }, "✨ ", t("welcome.finish.eyebrow")),
      headline(t("welcome.finish.title")),
      el("p", { class: "lk-subtitle", text: t("welcome.finish.subtitle") }),
      summary,
      el("div", { class: "lk-finish-actions" },
        defaultButton,
        el("button", { class: "lk-button primary lk-big-button", onclick: () => finish() }, t("welcome.finish.start"), icon("arrow-right"))
      ),
    ];
  },
};

/* ========================================================== navigation */

const stage = document.getElementById("stage");
const nextButton = document.getElementById("next");
const backButton = document.getElementById("back");
const dots = document.getElementById("steps");

function renderChrome() {
  backButton.replaceChildren(icon("arrow-left"), el("span", { text: t("welcome.back") }));
  backButton.hidden = index === 0;
  const last = index === STEPS.length - 1;
  nextButton.hidden = last;
  nextButton.replaceChildren(
    el("span", { text: index === 0 ? t("welcome.start") : t("welcome.next") }),
    icon("arrow-right")
  );
  dots.replaceChildren(...STEPS.map((id, i) => {
    const dot = el("button", {
      class: "lk-step-dot",
      role: "tab",
      title: t(`welcome.step.${id}`),
      "aria-selected": String(i === index),
      onclick: () => go(i),
    });
    dot.dataset.state = i < index ? "done" : i === index ? "current" : "todo";
    return dot;
  }));
  document.getElementById("skip").textContent = t("welcome.skip");
}

function go(target) {
  if (target < 0 || target >= STEPS.length || target === index && stage.firstElementChild) {
    return;
  }
  const forward = target >= index;
  const old = stage.firstElementChild;
  if (old) {
    old.classList.add(forward ? "leave-next" : "leave-prev");
    setTimeout(() => old.remove(), reduceMotion() ? 0 : 470);
  }
  index = target;
  const step = el("section", { class: `lk-step ${forward ? "enter-next" : "enter-prev"}`, dataset: { step: STEPS[index] } });
  step.append(...builders[STEPS[index]]());
  stage.append(step);
  renderChrome();
  nextButton.focus({ preventScroll: true });
}

function applySpaces() {
  const presets = builders._presets || [];
  const existing = LokumSpaces.spaces;
  for (const p of presets) {
    if (p.id === "personal" || !choices.spaces.has(p.id)) {
      continue;
    }
    if (!existing.some(s => s.icon === p.emoji)) {
      LokumSpaces.create({ name: p.name, icon: p.emoji, flavor: p.flavor });
    }
  }
}

async function installAdblock() {
  if (!choices.adblock) {
    return;
  }
  try {
    const AM = importFirefoxModule("AddonManager");
    if (await AM.getAddonByID("uBlock0@raymondhill.net")) {
      return;
    }
    const install = await AM.getInstallForURL(
      "https://addons.mozilla.org/firefox/downloads/latest/ublock-origin/latest.xpi",
      { telemetryInfo: { source: "lokum-onboarding" } }
    );
    install.install().catch(ex => console.warn("Lokum: uBlock install failed", ex));
  } catch (ex) {
    console.warn("Lokum: could not install uBlock Origin", ex);
  }
}

function finish() {
  applySpaces();
  installAdblock();
  setPref("lokum.onboarding.done", true);
  setPref("lokum.onboarding.version", 1);
  const win = topWindow();
  if (OVERLAY) {
    const { LokumWindow } = ChromeUtils.importESModule("chrome://lokum/content/modules/LokumWindow.sys.mjs");
    LokumWindow.closeOnboarding(win);
    const { LokumToast } = ChromeUtils.importESModule("chrome://lokum/content/modules/LokumToast.sys.mjs");
    win.setTimeout(() => LokumToast.show(win, { icon: "sparkle", text: t("welcome.toast") }), 700);
  } else {
    const tab = win?.gBrowser?.getTabForBrowser(window.docShell?.chromeEventHandler);
    if (tab) {
      win.gBrowser.removeTab(tab);
    } else {
      window.close();
    }
  }
}

function setupLanguage() {
  const select = document.getElementById("lang");
  const flag = document.getElementById("lang-flag");
  const available = new Set(Services.locale.availableLocales);
  const locales = LokumI18n.locales.filter(l => available.has(l.firefox));
  select.replaceChildren(...locales.map(l => el("option", { value: l.code, text: l.name })));
  const refresh = () => {
    select.value = LokumI18n.locale;
    flag.textContent = LokumI18n.locales.find(l => l.code === LokumI18n.locale)?.flag || "🌐";
  };
  refresh();
  select.hidden = locales.length < 2;
  select.addEventListener("change", () => LokumI18n.setUILocale(select.value));
  const off = LokumI18n.onChange(() => {
    initPage();
    refresh();
    const current = index;
    stage.replaceChildren();
    index = current;
    const step = el("section", { class: "lk-step enter-next", dataset: { step: STEPS[index] } });
    step.append(...builders[STEPS[index]]());
    stage.append(step);
    renderChrome();
  });
  window.addEventListener("unload", off);
}

/* ================================================================ start */

if (OVERLAY) {
  document.documentElement.setAttribute("overlay", "true");
}
initPage();
buildFloaters();
Sugar.init();
setupLanguage();

nextButton.addEventListener("click", () => go(index + 1));
backButton.addEventListener("click", () => go(index - 1));
document.getElementById("skip").addEventListener("click", () => finish());
document.addEventListener("keydown", e => {
  if (e.target.closest?.("select, input")) {
    return;
  }
  if (e.key === "ArrowRight" || e.key === "Enter" && e.target === document.body) {
    go(index + 1);
  } else if (e.key === "ArrowLeft") {
    go(index - 1);
  } else if (e.key === "Escape" && OVERLAY) {
    finish();
  }
});

go(0);
