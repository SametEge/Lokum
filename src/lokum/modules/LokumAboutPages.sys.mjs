/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Registers Lokum's about: pages. They are privileged chrome documents that
 * load in the parent process, like about:preferences.
 */

const PAGES = {
  lokum: "chrome://lokum/content/pages/settings/settings.html",
  "lokum-welcome": "chrome://lokum/content/pages/welcome/welcome.html",
};

const FLAGS =
  Ci.nsIAboutModule.ALLOW_SCRIPT |
  Ci.nsIAboutModule.IS_SECURE_CHROME_UI |
  Ci.nsIAboutModule.HIDE_FROM_ABOUTABOUT;

class AboutModule {
  constructor(target) {
    this.target = target;
    this.QueryInterface = ChromeUtils.generateQI(["nsIAboutModule"]);
  }

  newChannel(uri, loadInfo) {
    const channel = Services.io.newChannelFromURIWithLoadInfo(
      Services.io.newURI(this.target),
      loadInfo
    );
    channel.originalURI = uri;
    return channel;
  }

  getURIFlags() {
    return FLAGS;
  }

  getChromeURI() {
    return Services.io.newURI(this.target);
  }
}

let registered = false;

export const LokumAboutPages = {
  pages: PAGES,

  register() {
    if (registered) {
      return;
    }
    registered = true;
    const registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
    for (const [name, target] of Object.entries(PAGES)) {
      const contract = `@mozilla.org/network/protocol/about;1?what=${name}`;
      if (registrar.isContractIDRegistered(contract)) {
        continue;
      }
      const module = new AboutModule(target);
      const factory = {
        createInstance(iid) {
          return module.QueryInterface(iid);
        },
        QueryInterface: ChromeUtils.generateQI(["nsIFactory"]),
      };
      registrar.registerFactory(
        Services.uuid.generateUUID(),
        `about:${name}`,
        contract,
        factory
      );
    }
  },
};
