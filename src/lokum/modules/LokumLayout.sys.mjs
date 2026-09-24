/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Translates Lokum's layout choice into Firefox preferences and toolbar
 * placements.
 *
 *  - "arc":        Arc-style. Tabs, address bar and navigation live in a
 *                  full-height sidebar; the page floats on the flavor frame.
 *  - "vertical":   Firefox's vertical tabs with the address bar on top.
 *  - "horizontal": Classic tabs above the address bar.
 */

import { LokumPrefs } from "chrome://lokum/content/modules/LokumPrefs.sys.mjs";

import { defineFirefoxModuleGetters } from "chrome://lokum/content/modules/LokumCompat.sys.mjs";

const lazy = {};
defineFirefoxModuleGetters(lazy, ["CustomizableUI"]);

export const LAYOUTS = Object.freeze(["arc", "vertical", "horizontal"]);

// Toolbar items Lokum wants first in the navigation bar, in order.
const NAV_LEADING = ["back-button", "forward-button", "stop-reload-button"];
// Items that would not fit in the narrow Arc sidebar toolbar. The sidebar
// button is deliberately NOT removed: Firefox turns vertical tabs off when it
// leaves the toolbar (bug 1970015), so the Arc layout hides it with CSS.
const ARC_REMOVE = ["home-button", "alltabs-button", "fxa-toolbar-menu-button"];
const ARC_TRAILING = ["unified-extensions-button", "downloads-button"];

// Placement arrangements are applied once per layout switch; bump this to
// re-run them for everyone after a Lokum update.
const ARRANGEMENT_VERSION = 2;
const PREF_ARRANGED = "lokum.layout.arranged";

export const LokumLayout = {
  get current() {
    const value = LokumPrefs.get("lokum.layout");
    return LAYOUTS.includes(value) ? value : "arc";
  },

  get isVertical() {
    return this.current !== "horizontal";
  },

  /**
   * Makes Firefox's own prefs agree with lokum.layout. Called at startup and
   * whenever the Lokum layout pref changes.
   */
  syncFirefoxPrefs() {
    const layout = this.current;
    const vertical = layout !== "horizontal";
    const prefs = Services.prefs;
    if (!prefs.getBoolPref("sidebar.revamp", false)) {
      prefs.setBoolPref("sidebar.revamp", true);
    }
    if (prefs.getBoolPref("sidebar.verticalTabs", false) !== vertical) {
      prefs.setBoolPref("sidebar.verticalTabs", vertical);
    }
    // Firefox moves sidebar.visibility to a value valid for the orientation
    // by itself; vertical layouts additionally need the launcher shown
    // (Lokum's compact mode replaces Firefox's "hide sidebar").
    if (vertical && prefs.getStringPref("sidebar.visibility", "") !== "always-show") {
      prefs.setStringPref("sidebar.visibility", "always-show");
    }
    const startPosition = LokumPrefs.get("lokum.sidebar.position") !== "right";
    if (prefs.getBoolPref("sidebar.position_start", true) !== startPosition) {
      prefs.setBoolPref("sidebar.position_start", startPosition);
    }
  },

  /** Rearranges the navigation bar for a layout (only when needed). */
  arrangeToolbars(layout = this.current) {
    const marker = `${layout}:${ARRANGEMENT_VERSION}`;
    if (LokumPrefs.get(PREF_ARRANGED, "") === marker) {
      return;
    }
    const CUI = lazy.CustomizableUI;
    const navbar = CUI.AREA_NAVBAR;
    CUI.beginBatchUpdate();
    try {
      if (layout === "arc") {
        for (const id of ARC_REMOVE) {
          if (CUI.getPlacementOfWidget(id)?.area === navbar) {
            CUI.removeWidgetFromArea(id);
          }
        }
      } else if (
        layout === "vertical" &&
        !CUI.getPlacementOfWidget("sidebar-button")
      ) {
        CUI.addWidgetToArea("sidebar-button", navbar, 0);
      }

      let index = CUI.getPlacementOfWidget("sidebar-button")?.area === navbar ? 1 : 0;
      for (const id of NAV_LEADING) {
        const placement = CUI.getPlacementOfWidget(id);
        if (!placement) {
          CUI.addWidgetToArea(id, navbar, index);
        } else if (placement.area === navbar) {
          CUI.moveWidgetWithinArea(id, index);
        } else {
          continue;
        }
        index++;
      }

      if (layout === "arc") {
        for (const id of ARC_TRAILING) {
          const placement = CUI.getPlacementOfWidget(id);
          if (!placement || placement.area === navbar) {
            if (placement) {
              CUI.moveWidgetWithinArea(id, CUI.getWidgetIdsInArea(navbar).length);
            } else {
              CUI.addWidgetToArea(id, navbar);
            }
          }
        }
      }
    } catch (ex) {
      console.error("Lokum: could not arrange toolbars", ex);
    } finally {
      CUI.endBatchUpdate();
    }
    LokumPrefs.set(PREF_ARRANGED, marker);
  },

  set(layout) {
    if (!LAYOUTS.includes(layout)) {
      return;
    }
    LokumPrefs.set("lokum.layout", layout);
  },

  /** Applies the current layout to Firefox prefs and toolbars. */
  applyNow() {
    this.syncFirefoxPrefs();
    // CustomizableUI reacts to sidebar.verticalTabs synchronously; arrange
    // afterwards so our order wins over the orientation migration.
    Services.tm.dispatchToMainThread(() => this.arrangeToolbars());
  },
};
