/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * A mini player that appears at the bottom of the sidebar when a tab you
 * are not looking at plays audio (Arc's "media controls").
 */

import { LokumPrefs } from "chrome://lokum/content/modules/LokumPrefs.sys.mjs";

const lazy = {};
ChromeUtils.defineESModuleGetters(lazy, {
  LokumI18n: "chrome://lokum/content/modules/LokumI18n.sys.mjs",
});

const HTML_NS = "http://www.w3.org/1999/xhtml";

function el(doc, tag, cls, attrs = {}) {
  const node = doc.createElementNS(HTML_NS, tag);
  if (cls) {
    node.className = cls;
  }
  for (const [k, v] of Object.entries(attrs)) {
    node.setAttribute(k, v);
  }
  return node;
}

function iconButton(doc, name, title, onClick) {
  const button = el(doc, "button", "lk-media-button", { title });
  const img = el(doc, "img", "lk-icon", {
    src: `chrome://lokum/content/images/icons/${name}.svg`,
    alt: "",
  });
  button.append(img);
  button.addEventListener("click", e => {
    e.stopPropagation();
    onClick();
  });
  return { button, img };
}

export class LokumMediaCard {
  constructor(controller) {
    this.controller = controller;
    this.win = controller.win;
    this.doc = controller.doc;
    this.tab = null;
    this.mediaController = null;
    this.build();
    const tc = this.win.gBrowser.tabContainer;
    controller.listen(tc, "TabAttrModified", e => this.onTabAttr(e));
    controller.listen(tc, "TabSelect", () => this.update());
    controller.listen(tc, "TabClose", e => {
      if (e.target === this.tab) {
        this.setTab(null);
      }
    });
  }

  build() {
    const doc = this.doc;
    const t = lazy.LokumI18n.t.bind(lazy.LokumI18n);
    this.card = el(doc, "div", "lk-media-card", { id: "lokum-media-card", slot: "tabstrip", hidden: "true" });
    this.art = el(doc, "img", "lk-media-art", { alt: "" });
    const text = el(doc, "div", "lk-media-text");
    this.title = el(doc, "span", "lk-media-title");
    this.subtitle = el(doc, "span", "lk-media-subtitle");
    text.append(this.title, this.subtitle);
    const controls = el(doc, "div", "lk-media-controls");
    this.prev = iconButton(doc, "prev", t("media.previous"), () => this.mediaController?.prevTrack());
    this.play = iconButton(doc, "pause", t("media.playPause"), () => this.togglePlay());
    this.next = iconButton(doc, "next", t("media.next"), () => this.mediaController?.nextTrack());
    this.mute = iconButton(doc, "volume", t("media.mute"), () => {
      this.tab?.toggleMuteAudio();
      this.update();
    });
    controls.append(this.prev.button, this.play.button, this.next.button, this.mute.button);
    const close = iconButton(doc, "close", t("media.dismiss"), () => this.setTab(null, true));
    close.button.classList.add("lk-media-close");
    this.card.append(this.art, text, controls, close.button);
    this.card.addEventListener("click", () => {
      if (this.tab && !this.tab.closing) {
        this.win.gBrowser.selectedTab = this.tab;
      }
    });
    const footer = doc.getElementById("lokum-sidebar-footer");
    const verticalTabs = doc.getElementById("vertical-tabs");
    if (footer) {
      footer.before(this.card);
    } else if (verticalTabs) {
      verticalTabs.after(this.card);
    }
  }

  destroy() {
    this.detachController();
    this.card?.remove();
  }

  onTabAttr(event) {
    const changed = event.detail?.changed || [];
    if (!changed.includes("soundplaying") && !changed.includes("muted") && event.target !== this.tab) {
      return;
    }
    const tab = event.target;
    if (tab.hasAttribute("soundplaying") && tab !== this.tab) {
      this.setTab(tab);
    } else {
      this.update();
    }
  }

  setTab(tab, dismissed = false) {
    this.detachController();
    this.tab = tab;
    this._dismissed = dismissed;
    if (tab) {
      try {
        this.mediaController = tab.linkedBrowser.browsingContext?.mediaController || null;
      } catch (ex) {
        this.mediaController = null;
      }
      if (this.mediaController) {
        this._onChange = () => this.update();
        for (const type of ["metadatachange", "playbackstatechange", "supportedkeyschange"]) {
          this.mediaController.addEventListener(type, this._onChange);
        }
      }
    }
    this.update();
  }

  detachController() {
    if (this.mediaController && this._onChange) {
      for (const type of ["metadatachange", "playbackstatechange", "supportedkeyschange"]) {
        try {
          this.mediaController.removeEventListener(type, this._onChange);
        } catch (ex) {}
      }
    }
    this.mediaController = null;
  }

  togglePlay() {
    const mc = this.mediaController;
    if (!mc) {
      return;
    }
    if (mc.isPlaying) {
      mc.pause();
    } else {
      mc.play();
    }
    this.win.setTimeout(() => this.update(), 150);
  }

  update() {
    const tab = this.tab;
    const visible =
      LokumPrefs.get("lokum.mediaCard") &&
      tab &&
      !tab.closing &&
      !tab.selected &&
      !this._dismissed &&
      this.doc.documentElement.hasAttribute("lokum-vertical");
    this.card.hidden = !visible;
    if (!visible) {
      return;
    }
    let meta = null;
    try {
      meta = this.mediaController?.getMetadata();
    } catch (ex) {
      // No media session metadata; fall back to the tab.
    }
    this.title.textContent = meta?.title || tab.label;
    let host = "";
    try {
      host = tab.linkedBrowser.currentURI.host.replace(/^www\./, "");
    } catch (ex) {}
    this.subtitle.textContent = meta?.artist || host;
    const artwork = meta?.artwork?.find(a => a.src)?.src;
    this.art.src = artwork || tab.getAttribute("image") || "chrome://global/skin/icons/defaultFavicon.svg";
    const playing = this.mediaController ? this.mediaController.isPlaying : tab.hasAttribute("soundplaying");
    this.play.img.src = `chrome://lokum/content/images/icons/${playing ? "pause" : "play"}.svg`;
    this.mute.img.src = `chrome://lokum/content/images/icons/${tab.hasAttribute("muted") ? "volume-off" : "volume"}.svg`;
    const keys = this.mediaController?.supportedKeys || [];
    this.prev.button.hidden = !keys.includes("previoustrack");
    this.next.button.hidden = !keys.includes("nexttrack");
    this.card.toggleAttribute("playing", !!playing);
  }
}
