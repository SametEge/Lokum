/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Lokum boots through Firefox's enterprise "autoconfig" mechanism.
// These three prefs make Firefox run <install dir>/lokum.cfg with chrome
// privileges right after the default preferences have been read.
pref("general.config.filename", "lokum.cfg");
pref("general.config.obscure_value", 0);
pref("general.config.sandbox_enabled", false);
