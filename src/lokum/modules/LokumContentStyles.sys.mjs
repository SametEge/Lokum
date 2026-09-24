/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Global user stylesheet that dresses Firefox's own pages (new tab, settings,
 * add-ons...) in Lokum colors. Registered through the stylesheet service so
 * it also reaches pages rendered in content processes.
 */

const SHEET = "chrome://lokum/content/styles/lokum-content.css";

let registered = false;

export const LokumContentStyles = {
  register() {
    if (registered) {
      return;
    }
    registered = true;
    const sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(
      Ci.nsIStyleSheetService
    );
    const uri = Services.io.newURI(SHEET);
    if (!sss.sheetRegistered(uri, sss.USER_SHEET)) {
      sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
    }
  },
};
