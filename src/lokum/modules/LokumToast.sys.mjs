/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Small, springy notifications that pop up from the bottom of the window
 * ("Link copied", "Lokum was updated"...).
 */

const HTML_NS = "http://www.w3.org/1999/xhtml";

function el(doc, tag, cls, text) {
  const node = doc.createElementNS(HTML_NS, tag);
  if (cls) {
    node.className = cls;
  }
  if (text) {
    node.textContent = text;
  }
  return node;
}

export const LokumToast = {
  /**
   * @param {Window} win
   * @param {object} options
   * @param {string} options.text
   * @param {string} [options.icon] icon name from lokum/images/icons
   * @param {{label: string, callback: Function}} [options.action]
   * @param {number} [options.duration] milliseconds
   */
  show(win, { text, icon, action, duration = 3200 } = {}) {
    const doc = win.document;
    let host = doc.getElementById("lokum-toasts");
    if (!host) {
      host = el(doc, "div");
      host.id = "lokum-toasts";
      host.setAttribute("role", "status");
      host.setAttribute("aria-live", "polite");
      doc.body.append(host);
    }
    const toast = el(doc, "div", "lk-toast");
    if (icon) {
      const img = el(doc, "img", "lk-icon");
      img.src = `chrome://lokum/content/images/icons/${icon}.svg`;
      img.alt = "";
      toast.append(img);
    }
    toast.append(el(doc, "span", "lk-toast-text", text));
    const close = () => {
      if (toast.classList.contains("lk-out")) {
        return;
      }
      toast.classList.add("lk-out");
      win.setTimeout(() => toast.remove(), 320);
    };
    if (action) {
      const button = el(doc, "button", "lk-toast-action", action.label);
      button.addEventListener("click", () => {
        close();
        action.callback();
      });
      toast.append(button);
    }
    host.append(toast);
    // Keep at most three toasts on screen.
    while (host.children.length > 3) {
      host.firstElementChild.remove();
    }
    win.setTimeout(close, duration);
    return close;
  },
};
