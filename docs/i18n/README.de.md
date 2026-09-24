<p align="center">
  <img src="../images/banner-de.png" alt="Lokum — Schnell · Leistungsstark · Stiehlt nie Ihre Daten" width="820">
</p>

<p align="center">
  <a href="../../README.md">English</a> ·
  <a href="README.tr.md">Türkçe</a> ·
  <b>Deutsch</b> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.it.md">Italiano</a> ·
  <a href="README.rm.md">Rumantsch</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.sv.md">Svenska</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a>
</p>

<p align="center">
  <a href="https://github.com/SametEge/Lokum/releases/latest"><img alt="Neueste Version" src="https://img.shields.io/github/v/release/SametEge/Lokum?label=download&color=d23c78"></a>
  <a href="https://github.com/SametEge/Lokum/releases"><img alt="Downloads" src="https://img.shields.io/github/downloads/SametEge/Lokum/total?color=f1a2c2"></a>
  <img alt="Windows 10/11" src="https://img.shields.io/badge/Windows-10%20%7C%2011-6a46d8">
  <img alt="Linux x86-64" src="https://img.shields.io/badge/Linux-x86--64-55852a">
  <a href="../../LICENSE"><img alt="MPL 2.0" src="https://img.shields.io/badge/Lizenz-MPL%202.0-8a7141"></a>
</p>

**Lokum** ist ein Webbrowser auf Basis von Mozilla Firefox mit dem Geschmack
von türkischem Lokum. Er nimmt die Engine, die Sicherheit und die Erweiterungen,
denen Sie bereits vertrauen, und verpackt sie in eine Seitenleiste im Stil von
Arc, zwölf von Hand gemischte Farb‑„Sorten“, Bereiche (Spaces), eine
Befehlspalette, sanfte Animationen und eine ungewöhnlich liebevolle
Ersteinrichtung — in zwölf Sprachen. Sobald eine neue Version bereitsteht,
aktualisiert er sich still über GitHub Releases.

<p align="center">
  <img src="../images/screenshots/arc-light.webp" alt="Lokum mit Arc-Seitenleiste und der Sorte Rose" width="49%">
  <img src="../images/screenshots/arc-dark.webp" alt="Lokum im dunklen Modus mit der Sorte Mitternacht" width="49%">
</p>

---

## Inhalt

<!-- toc -->
- [Download](#download)
- [Höhepunkte](#höhepunkte)
- [Sorten](#sorten)
- [Layouts: Seitenleiste oder klassische Tabs](#layouts-seitenleiste-oder-klassische-tabs)
- [Bereiche](#bereiche)
- [Befehlspalette und Befehlsleiste](#befehlspalette-und-befehlsleiste)
- [Tabs, die sich selbst aufräumen](#tabs-die-sich-selbst-aufräumen)
- [Die Willkommenstour](#die-willkommenstour)
- [Einstellungen](#einstellungen)
- [Datenschutz](#datenschutz)
- [Sprachen](#sprachen)
- [Automatische Updates](#automatische-updates)
- [Tastenkürzel](#tastenkürzel)
- [Installation](#installation)
- [Aus dem Quellcode bauen](#aus-dem-quellcode-bauen)
- [Wie Lokum funktioniert](#wie-lokum-funktioniert)
- [Veröffentlichungen und kontinuierliche Integration](#veröffentlichungen-und-kontinuierliche-integration)
- [FAQ](#faq)
- [Mitmachen](#mitmachen)
- [Lizenz und Marken](#lizenz-und-marken)
<!-- /toc -->

---

## Download

Die neueste Version gibt es auf der **[Release-Seite](https://github.com/SametEge/Lokum/releases/latest)**.

| Datei | Für | Hinweise |
| --- | --- | --- |
| `Lokum-Setup-<Version>-x64.exe` | Windows 10 / 11 (64 Bit) | **Empfohlen.** Installiert nur für Ihr Benutzerkonto, ohne Administratorrechte, aktualisiert sich selbst. |
| `Lokum-<Version>-win64.zip` | Windows, portabel | Irgendwo entpacken (sogar auf einem USB‑Stick) und `lokum.exe` starten. Meldet verfügbare Updates. |
| `Lokum-<Version>-linux-x86_64.tar.xz` | Linux (64 Bit) | Entpacken und `./lokum` starten; `install-desktop-entry.sh` fügt Lokum dem Anwendungsmenü hinzu. |
| `latest.json`, `SHA256SUMS.txt` | Alle | Update‑Manifest für den eingebauten Updater und SHA‑256‑Prüfsummen aller Dateien. |

> **Windows SmartScreen.** Lokum ist noch nicht codesigniert (Zertifikate sind
> für ein Hobbyprojekt teuer), daher meldet Windows beim ersten Start eventuell
> *„Der Computer wurde durch Windows geschützt“*. Klicken Sie auf **Weitere
> Informationen → Trotzdem ausführen**. Sie können die Datei jederzeit mit
> `SHA256SUMS.txt` auf der Release‑Seite vergleichen.

---

## Höhepunkte

- 🍬 **Zwölf Sorten** — jedes Theme ist eine Lokum‑Sorte: Rose, Pistazie, Zitrone, Granatapfel, Orange, Minze, Lavendel, Mastix, Kokos, Türkischer Kaffee, Mitternacht und eine animierte *Gemischt*‑Schachtel. Jede mit hellem und dunklem Rezept.
- 🧭 **Seitenleiste im Arc‑Stil _oder_ klassische Tabs** — eine Seitenleiste über die volle Höhe mit Adressleiste, die vertikalen Tabs von Firefox oder die klassische Tableiste. Jederzeit umschaltbar; das Fenster ordnet sich live neu an.
- 🗂️ **Bereiche** — trennen Sie Privat, Arbeit, Schule und Freizeit, jeweils mit eigenen Tabs, eigenem Symbol, eigener Sorte und (optional) eigener Umgebung (Container). Wischen oder <kbd>Strg</kbd>+<kbd>Alt</kbd>+<kbd>←</kbd>/<kbd>→</kbd> zum Wechseln.
- ⌨️ **Befehlspalette** (<kbd>Strg</kbd>+<kbd>K</kbd>) — unscharfe Suche über offene Tabs und mehr als 40 Aktionen, dazu eine große **schwebende Befehlsleiste**, sobald Sie die Adressleiste anklicken.
- 🎵 **Mini‑Player** — Musik und Videos anderer Tabs direkt in der Seitenleiste abspielen, pausieren, überspringen und stummschalten.
- 🧹 **Tabs, die sich selbst aufräumen** — lange nicht geöffnete Tabs automatisch archivieren, Hintergrund‑Tabs schlafen legen und alles aus dem Archiv wieder öffnen.
- 🌟 **Eine Willkommenstour wie keine andere** — wählen Sie Ihre Sorte, indem Sie gezuckerte 3D‑Lokumwürfel fallen lassen, sehen Sie zu, wie sich der Browser hinter dem Assistenten umbaut, legen Sie Bereiche aus Vorlagen an, importieren Sie Ihren alten Browser und wählen Sie Ihre Datenschutzstufe. Konfetti inklusive.
- ⚙️ **Einstellungen, die Freude machen** — zwölf Abschnitte, Sofortsuche, Live‑Vorschau, Export/Import der Lokum‑Einstellungen.
- 🔒 **Privat ab Werk** — keine Telemetrie, keine Studien, keine gesponserten Inhalte; strenger Tracking‑Schutz einen Klick entfernt; uBlock Origin, sicheres DNS, Nur‑HTTPS, GPC und Fingerprinting‑Schutz direkt in den Einstellungen.
- 🌍 **Zwölf Sprachen** — Englisch, Türkisch, Deutsch, Französisch, Italienisch, Rätoromanisch, Spanisch, Schwedisch, Koreanisch, Japanisch, vereinfachtes und traditionelles Chinesisch — für Lokum und für Firefox selbst.
- 🔄 **Automatische Updates** — neue Versionen werden bei jeder Änderung und bei jeder neuen Firefox‑Version von GitHub Actions gebaut und beim Schließen von Lokum still installiert.
- 🦊 **Echtes Firefox im Inneren** — offizielle Mozilla‑Builds, die Gecko‑Engine, alle Firefox‑Add‑ons, Firefox Sync und Mozillas Sicherheitskorrekturen, sobald sie erscheinen.

---

## Sorten

Eine Sorte färbt den ganzen Browser: den Fensterrahmen, die Seitenleiste, die
Akzentfarbe von Schaltflächen und Schaltern, die Seite „Neuer Tab“ und Lokums
eigene Seiten. Jede Sorte hat ein helles und ein dunkles Rezept, und den Akzent
können Sie durch eine beliebige Farbe ersetzen. Bereiche können eine eigene
Sorte haben — beim Wechseln ändert das Fenster dann seine Farbe.

| | Sorte | Stimmung |
| --- | --- | --- |
| 🌹 | **Rose** (Gül) | Das klassische Rosenwasser‑Lokum, zartrosa. *(Standard)* |
| 🌰 | **Pistazie** (Fıstık) | Frisches Pistaziengrün, ruhig und konzentriert. |
| 🍋 | **Zitrone** (Limon) | Sonnige Zitronenschale für helle Morgen. |
| 🍎 | **Granatapfel** (Nar) | Tiefes Granatapfelrot, kräftig und saftig. |
| 🍊 | **Orange** (Portakal) | Warmes Leuchten von Orange und Bergamotte. |
| 🌿 | **Minze** (Nane) | Kühle Minze, frisch wie eine Frühlingsbrise. |
| 💜 | **Lavendel** (Lavanta) | Sanfter Lavendel für verträumte Nachmittage. |
| 🤍 | **Mastix** (Sakız) | Cremiges Mastix‑Elfenbein, still und elegant. |
| 🥥 | **Kokos** (Hindistan cevizi) | Kokosweiß, klar und minimalistisch. |
| ☕ | **Türkischer Kaffee** (Kahve) | Die satten Brauntöne türkischen Kaffees. |
| 🌙 | **Mitternacht** (Gece) | Sternenklare Mitternachtspflaume für Nachteulen. |
| 🎨 | **Gemischt** (Karışık) | Eine Schachtel gemischter Lokum, die langsam durch alle Farben gleitet. |

Die Testsuite prüft jede Palette: Text muss auf seinem Rahmen einen
WCAG‑Kontrast von 4,5:1 erreichen und Akzent‑Schaltflächen 3:1 — im hellen wie
im dunklen Modus.

Zusätzliche Details zum Ein‑ und Ausschalten: **Puderzucker** (winzige
Glitzerpunkte in der Seitenleiste), **sanfte Körnung** (eine dezente
Papierstruktur), abgerundete Seitenecken, Rahmenabstand, Seitenschatten,
Oberflächendichte (kompakt / normal / bequem), Oberflächenschrift (System /
abgerundet / Serif) und drei Animationsstufen (voll, reduziert — Farben blenden
über, aber nichts bewegt sich — oder aus). Lokum beachtet außerdem die
Systemeinstellung *Bewegung reduzieren*.

<p align="center">
  <img src="../images/screenshots/settings-appearance.webp" alt="Abschnitt Aussehen der Lokum-Einstellungen mit zwölf Sortenwürfeln" width="80%">
</p>

---

## Layouts: Seitenleiste oder klassische Tabs

| Layout | So sieht es aus |
| --- | --- |
| **Seitenleiste (Arc‑Stil)** *(Standard)* | Tabs, Adressleiste und Navigationsknöpfe leben in einer Seitenleiste über die volle Höhe. Die Seite schwebt als abgerundete Karte über Ihrer Sorte, darüber eine schmale Titelzeile mit Seitentitel, Website und einer Schaltfläche *Link kopieren*. |
| **Vertikale Tabs** | Die nativen vertikalen Tabs von Firefox in einer Seitenleiste, Adressleiste oben. Vertraut und geräumig. |
| **Klassische Tabs** | Tabs oben, wie in jedem Browser — aber in Ihrer Sorte gekleidet. |

<p align="center">
  <img src="../images/screenshots/classic-tabs.webp" alt="Lokum mit klassischen Tabs und der Sorte Pistazie" width="80%">
</p>

Weitere Layout‑Optionen:

- **Seite der Seitenleiste** — links oder rechts.
- **Seitenleiste ausblenden (Kompaktmodus)** — <kbd>Strg</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd>. Die Seite nutzt das ganze Fenster; die Seitenleiste gleitet herein, wenn der Mauszeiger den Fensterrand berührt.
- **Schwebende Befehlsleiste** — die Adressleiste öffnet sich groß und zentriert über der Seite, wie bei Arc.
- **Neue Tabs erscheinen** oben oder unten in der Liste.
- **Tab‑Schließen‑Knopf** beim Überfahren, immer oder nie.
- **Angeheftete Tabs werden Favoriten** — ein Raster großer Symbole oben in der Seitenleiste, das in jedem Bereich gleich bleibt.
- **Lesezeichen‑Symbolleiste**, **Mini‑Player** und **Symbolleiste anpassen**.

---

## Bereiche

Bereiche halten die verschiedenen Teile Ihres Lebens auseinander. Jeder Bereich
hat eine eigene Tab‑Liste, einen Namen, ein Emoji‑Symbol, eine optionale Sorte,
die das Fenster umfärbt, solange Sie darin sind, und eine optionale
Firefox‑**Umgebung** (Container) — so bleibt etwa Ihr Arbeitsbereich bei Ihren
Arbeitskonten angemeldet.

- Wechseln Sie über die Symbole unten in der Seitenleiste, durch **seitliches Wischen** auf der Seitenleiste (oder <kbd>Umschalt</kbd> + Mausrad), mit <kbd>Strg</kbd>+<kbd>Alt</kbd>+<kbd>←</kbd>/<kbd>→</kbd> oder springen Sie mit <kbd>Strg</kbd>+<kbd>Alt</kbd>+<kbd>1</kbd>…<kbd>9</kbd> direkt zu einem.
- **Ziehen Sie einen Tab auf ein Bereichssymbol**, um ihn zu verschieben, oder nutzen Sie *In Bereich verschieben* im Kontextmenü des Tabs.
- Rechtsklick auf den Bereichsnamen: umbenennen, Symbol, Sorte oder Umgebung ändern, Tabs leeren, Bereiche anlegen und löschen.
- Alles — auch die Reihenfolge — verwalten Sie unter **Einstellungen → Bereiche**.
- Bereiche werden im Profil (`lokum/spaces.json`) gespeichert, und jeder Tab merkt sich seinen Bereich über Neustarts hinweg.

<p align="center">
  <img src="../images/screenshots/spaces.webp" alt="Der Bereich Arbeit in der Sorte Minze" width="80%">
</p>

---

## Befehlspalette und Befehlsleiste

Drücken Sie überall <kbd>Strg</kbd>+<kbd>K</kbd>. Ein paar Buchstaben genügen,
und Lokum findet offene Tabs und Aktionen per unscharfer Suche: neuer
Tab/neues Fenster/privates Fenster, geschlossenen Tab wiederherstellen,
duplizieren, anheften, Link kopieren, **geteilte Ansicht** mit dem letzten Tab,
Leseansicht, Bild‑im‑Bild, Bildschirmfoto, Suchen, Drucken, Zoom, Downloads,
Chronik, Lesezeichen, Erweiterungen, Entwicklerwerkzeuge, neueste Chronik
löschen, dunkler Modus, jedes Layout, jede Sorte, jeder Bereich sowie Lokum‑
oder Firefox‑Einstellungen. Alles andere wird zur Websuche.

<p align="center">
  <img src="../images/screenshots/command-palette.webp" alt="Befehlspalette über einer Seite" width="49%">
  <img src="../images/screenshots/command-bar.webp" alt="Schwebende Befehlsleiste" width="49%">
</p>

Wenn Sie im Seitenleisten‑Layout auf die Adressleiste klicken (oder
<kbd>Strg</kbd>+<kbd>L</kbd> drücken), wird sie zu einer großen **schwebenden
Befehlsleiste** in der Fenstermitte — mit allen Firefox‑Vorschlägen,
Suchkürzeln und der Chronik, und mit viel Platz.

---

## Tabs, die sich selbst aufräumen

- **Automatisches Archiv** — nicht angeheftete Tabs, die Sie 12 Stunden, einen Tag, eine Woche oder einen Monat nicht geöffnet haben, werden geschlossen und im **Archiv** aufbewahrt (bis zu 600 Tabs). Unter **Einstellungen → Archiv** oder über die Bibliotheksschaltfläche in der Seitenleiste durchsuchen und wieder öffnen.
- **Schlafende Tabs** — Hintergrund‑Tabs können nach einigen Minuten entladen werden, um Speicher und Akku zu sparen; beim Anklicken kommen sie zurück.
- **Mini‑Player** — spielt ein Tab Medien ab, zeigt eine kleine Karte in der Seitenleiste Cover, Titel und Interpret mit Zurück / Wiedergabe‑Pause / Weiter und Stumm.
- Dazu alles, was Firefox mitbringt: **Tab‑Gruppen**, **geteilte Ansicht**, Tab‑Vorschau beim Überfahren, automatisches **Bild‑im‑Bild** und Sitzungswiederherstellung.

---

## Die Willkommenstour

Beim ersten Start öffnet sich eine Vollbild‑Willkommenstour über dem Browser —
und der Browser verändert sich dahinter live, während Sie wählen.

<p align="center">
  <img src="../images/screenshots/welcome-flavor.webp" alt="Willkommenstour: Sorte wählen" width="49%">
  <img src="../images/screenshots/welcome-layout.webp" alt="Willkommenstour: Layout wählen" width="49%">
</p>

1. **Willkommen** — ein schwebender 3D‑Lokumwürfel, rieselnder Zucker und eine Sprachauswahl.
2. **Sorte** — zwölf gezuckerte Würfel fallen in eine Schale; tippen Sie einen an, und der ganze Browser wechselt mit einer Puderzuckerwolke die Farbe. Hell, dunkel oder automatisch wählen — oder **Überrasch mich** für ein Sorten‑Roulette.
3. **Layout** — Arc‑Seitenleiste, vertikale oder klassische Tabs, Seite der Leiste und Kompaktmodus, live in der Vorschau.
4. **Bereiche** — starten Sie mit Privat und fügen Sie Arbeit, Schule und Freizeit mit je einem Tipp hinzu.
5. **Import** — Lokum erkennt andere Browser auf Ihrem Computer (Chrome, Edge, Brave, Opera, Vivaldi…) und übernimmt Lesezeichen, Passwörter, Chronik und mehr.
6. **Datenschutz** — ausgewogener oder strenger Tracking‑Schutz, uBlock Origin, sicheres DNS; Telemetrie ist immer aus.
7. **Fertig** — eine Zusammenfassung Ihrer Wahl, *Lokum als Standardbrowser festlegen* und Konfetti.

Die Tour lässt sich jederzeit unter **Einstellungen → Erweitert →
Willkommenstour** erneut starten.

---

## Einstellungen

Öffnen Sie die **Lokum‑Einstellungen** mit <kbd>Strg</kbd>+<kbd>,</kbd>, über
das Hauptmenü, die Seitenleiste oder durch Eingabe von `about:lokum`. Jede
Option wirkt sofort, und das Suchfeld findet jede Einstellung beim Namen.

| Abschnitt | Was Sie tun können |
| --- | --- |
| **Aussehen** | Sortengalerie, hell/dunkel/automatisch, eigene Akzentfarbe, Puderzucker, Körnung, Animationen, Eckenrundung, Rahmenabstand, Seitenschatten, Dichte, Oberflächenschrift. |
| **Layout** | Arc‑Seitenleiste / vertikal / klassisch, Seite der Leiste, Kompaktmodus, schwebende Befehlsleiste, Position neuer Tabs, Schließen‑Knöpfe, Mini‑Player, Lesezeichen‑Symbolleiste, Symbolleiste anpassen. |
| **Bereiche** | Bereiche an/aus, Fenster nach Bereich färben, Wischen zum Wechseln; Bereiche anlegen, umbenennen, Symbol und Sorte ändern, sortieren und löschen; Umgebungen wählen. |
| **Tabs** | Automatisches Archiv, schlafende Tabs, beim Start wiederherstellen, Tab‑Vorschau, Tab‑Gruppen, geteilte Ansicht, automatisches Bild‑im‑Bild, Bestätigung vor dem Beenden. |
| **Archiv** | Archivierte Tabs durchsuchen, öffnen und entfernen; Archiv leeren. |
| **Datenschutz & Sicherheit** | Ausgewogener/strenger Tracking‑Schutz, uBlock Origin per Klick, Nur‑HTTPS‑Modus, sicheres DNS (Cloudflare, Quad9, Mullvad, NextDNS, AdGuard…), Global Privacy Control, Fingerprinting‑Schutz, Chronik beim Beenden löschen, Pop‑up‑Blocker. |
| **Suche** | Standardsuchmaschine, Vorschläge, beliebte Suchen, Suchmaschinen verwalten. |
| **Tastenkürzel** | Alle Lokum‑Kürzel, mit einem Schalter zum Abschalten, falls sie mit einer Website kollidieren. |
| **Sprache** | Oberflächensprache (zwölf enthalten), Rechtschreibprüfung, bevorzugte Sprachen für Websites. |
| **Updates** | Aktuelle Version, jetzt suchen, automatische Suche und Installation, Kanal stabil/Beta, Prüfintervall, Versionshinweise, alle Versionen. |
| **Erweitert** | Standardbrowser, Import aus anderem Browser, Willkommenstour, Lokum‑Einstellungen exportieren/importieren (JSON), Profilordner, Lokum‑Einstellungen zurücksetzen, sanftes Scrollen, eigenes `userChrome.css`, alle Firefox‑Einstellungen, `about:config`. |
| **Über Lokum** | Version, Firefox‑Engine, Build‑Datum, Plattform, Profil, Links zu Problemmeldung, Versionshinweisen und Lizenzen. |

<p align="center">
  <img src="../images/screenshots/settings-updates.webp" alt="Abschnitt Updates der Lokum-Einstellungen" width="80%">
</p>

Alles, was Firefox bietet, bleibt in den **Firefox‑Einstellungen**
(`about:preferences`) einen Klick entfernt.

---

## Datenschutz

Lokum startet privat und bleibt es:

- **Keine Telemetrie, keine Studien, kein Absturzmelder, kein Standardbrowser‑Agent.** Sie werden per Unternehmensrichtlinie (`distribution/policies.json`) abgeschaltet und aus dem Paket entfernt.
- **Keine gesponserten Inhalte** — keine gesponserten Verknüpfungen oder Artikel auf der Seite „Neuer Tab“, kein Pocket, keine „empfohlenen“ Erweiterungen oder Funktionen.
- **Verbesserter Schutz vor Aktivitätenverfolgung** standardmäßig *ausgewogen*, *streng* einen Klick entfernt.
- **uBlock Origin** installiert sich mit einem Klick aus der Willkommenstour oder den Einstellungen.
- Voreinstellungen für **sicheres DNS**, **Nur‑HTTPS‑Modus**, **Global Privacy Control**, **Fingerprinting‑Schutz** und **beim Beenden löschen** im Abschnitt Datenschutz.

Womit Lokum selbst sich verbindet: `github.com` / `api.github.com`, um nach
Updates zu suchen (abschaltbar unter **Einstellungen → Updates**). Alles andere
ist normales Firefox‑Verhalten — etwa Safe‑Browsing‑Listen, Daten zum
Zertifikatswiderruf und der Add‑on‑Store — und lässt sich in den
Datenschutzeinstellungen von Firefox verwalten.

---

## Sprachen

Lokum enthält zwölf Sprachen und verwendet beim ersten Start die im
Installationsprogramm gewählte oder die Sprache Ihres Betriebssystems. Wechseln
Sie jederzeit unter **Einstellungen → Sprache** (ein Neustart schließt den
Wechsel überall ab).

| Sprache | Code | | Sprache | Code |
| --- | --- | --- | --- | --- |
| Englisch (English) | `en` | | Spanisch (Español) | `es-ES` |
| Türkisch (Türkçe) | `tr` | | Schwedisch (Svenska) | `sv-SE` |
| Deutsch | `de` | | Koreanisch (한국어) | `ko` |
| Französisch (Français) | `fr` | | Japanisch (日本語) | `ja` |
| Italienisch (Italiano) | `it` | | Chinesisch, vereinfacht (简体中文) | `zh-CN` |
| Rätoromanisch (Rumantsch) | `rm` | | Chinesisch, traditionell (繁體中文) | `zh-TW` |

Die Oberfläche von Firefox selbst stammt aus den offiziellen Sprachpaketen von
Mozilla, die der Build in die Anwendung einfügt; Lokums Ergänzungen
(Seitenleiste, Einstellungen, Willkommenstour, Updater…) nutzen kleine
JSON‑Wörterbücher in `src/lokum/locales/`. Ein Test stellt sicher, dass jedes
Wörterbuch vollständig ist und dieselben `{Platzhalter}` wie Englisch behält.
Das Windows‑Installationsprogramm gibt es in all diesen Sprachen außer
Rätoromanisch.

---

## Automatische Updates

1. Alle sechs Stunden (einstellbar) lädt Lokum die kleine Datei `latest.json` der neuesten GitHub‑Version.
2. Gibt es eine neuere Version, erscheint eine Karte in der Seitenleiste und das Installationsprogramm wird im Hintergrund geladen — nur von den Release‑Download‑Servern von GitHub.
3. Die **SHA‑256**‑Prüfsumme wird mit `latest.json` verglichen; alles, was nicht passt, wird verworfen.
4. Beim Schließen von Lokum wird das Update still im Hintergrund installiert. Beim nächsten Start sind Sie auf der neuen Version, und ein Hinweis *„Lokum wurde aktualisiert“* verlinkt die Versionshinweise. **Neu starten & aktualisieren** installiert sofort und öffnet Lokum wieder.

Unter **Einstellungen → Updates** wählen Sie den Kanal **Stabil** oder
**Beta**, das Prüfintervall oder schalten die automatische Installation ab. Die
portable ZIP‑Ausgabe meldet Updates nur. Mozillas eigener Firefox‑Updater ist
deaktiviert — Lokum‑Versionen bringen das neue Firefox für Sie mit.

---

## Tastenkürzel

| Kürzel | Aktion |
| --- | --- |
| <kbd>Strg</kbd>+<kbd>K</kbd> | Befehlspalette |
| <kbd>Strg</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd> | Seitenleiste ein/aus (Kompaktmodus) |
| <kbd>Strg</kbd>+<kbd>Alt</kbd>+<kbd>→</kbd> / <kbd>←</kbd> | Nächster / vorheriger Bereich |
| <kbd>Strg</kbd>+<kbd>Alt</kbd>+<kbd>1</kbd> … <kbd>9</kbd> | Zu Bereich 1–9 |
| <kbd>Strg</kbd>+<kbd>Umschalt</kbd>+<kbd>C</kbd> | Link der Seite kopieren |
| <kbd>Strg</kbd>+<kbd>,</kbd> | Lokum‑Einstellungen |
| <kbd>Strg</kbd>+<kbd>T</kbd> | Neuer Tab |
| <kbd>Strg</kbd>+<kbd>L</kbd> | Adressleiste (schwebende Befehlsleiste) |
| <kbd>Strg</kbd>+<kbd>Umschalt</kbd>+<kbd>T</kbd> | Geschlossenen Tab wiederherstellen |

Alle anderen Firefox‑Tastenkürzel funktionieren wie gewohnt. Lokums eigene
Kürzel lassen sich unter **Einstellungen → Tastenkürzel** abschalten.

---

## Installation

### Windows (Installationsprogramm)

1. Laden Sie `Lokum-Setup-<Version>-x64.exe` aus der [neuesten Version](https://github.com/SametEge/Lokum/releases/latest) herunter.
2. Starten Sie es (siehe SmartScreen‑Hinweis oben), wählen Sie Ihre Sprache, ob Sie eine Desktop‑Verknüpfung möchten und ob Lokum Standardbrowser werden soll, und klicken Sie auf **Installieren**.
3. Lokum wird nach `%LOCALAPPDATA%\Programs\Lokum` installiert — pro Benutzer, ohne Administratorrechte — und registriert sich als Browser, sodass Sie ihn unter **Windows‑Einstellungen → Standard‑Apps** auswählen können.

Befehlszeilenoptionen für skriptgesteuerte Installationen:

| Option | Bedeutung |
| --- | --- |
| `/S` | Stille Installation |
| `/D=C:\Pfad\Lokum` | Installationsordner (muss zuletzt stehen) |
| `/DESKTOP=0` | Keine Desktop‑Verknüpfung (Standard `1`) |
| `/UPDATE` | Bestehende Installation aktualisieren (vom Updater genutzt) |
| `/RELAUNCH` | Lokum nach Abschluss starten |

Zum Deinstallieren nutzen Sie **Windows‑Einstellungen → Apps → Lokum**. Das
Deinstallationsprogramm fragt, ob Ihr Profil (Lesezeichen, Passwörter, Chronik)
erhalten oder ebenfalls entfernt werden soll.

### Windows (portabel)

Entpacken Sie `Lokum-<Version>-win64.zip` an einen beliebigen Ort und starten Sie
`lokum.exe`. Die portable Ausgabe verändert die Registry nicht und meldet
Updates nur.

### Linux

```sh
tar -xJf Lokum-<Version>-linux-x86_64.tar.xz
cd lokum
./lokum                      # starten
./install-desktop-entry.sh   # optional: Lokum ins Anwendungsmenü aufnehmen
```

### Wo Ihre Daten liegen

Lokum hat ein eigenes Profil, getrennt von einem eventuell installierten
Firefox. **Einstellungen → Erweitert → Profilordner** öffnet es. Lokum‑eigene
Daten (Bereiche, Tab‑Archiv) liegen im Ordner `lokum` innerhalb des Profils.

---

## Aus dem Quellcode bauen

Lokum kompiliert Firefox nicht. Der Build lädt eine **offizielle
Firefox‑Version** von `archive.mozilla.org`, prüft sie gegen Mozillas
`SHA512SUMS` und verwandelt sie in Lokum. Ein vollständiger Windows‑Build dauert
auf einem normalen Rechner wenige Minuten, und Windows‑Pakete lassen sich unter
Linux bauen.

**Voraussetzungen**

- Python 3.10+
- Node.js 20+ (schreibt Symbole und Versionsinfos von `lokum.exe` mit [resedit](https://github.com/jet2jet/resedit-js) um)
- `7z` (p7zip) zum Entpacken des Windows‑Firefox‑Installers, `tar` und `xz`
- NSIS 3 (`makensis`) für das Windows‑Installationsprogramm

Unter Ubuntu/Debian: `sudo apt install python3 nodejs npm p7zip-full nsis xz-utils`

**Bauen**

```sh
git clone https://github.com/SametEge/Lokum.git
cd Lokum
npm ci --prefix scripts/pe          # einmalig, für Windows-Builds

# Windows-Installer + portable ZIP aus der neuesten Firefox-Version
python3 scripts/build.py --platform win64

# Linux-Archiv auf einer bestimmten Firefox-Version
python3 scripts/build.py --platform linux-x86_64 --firefox-version 156.0
```

Die Ergebnisse landen in `dist/`. Nützliche Optionen:

| Option | Bedeutung |
| --- | --- |
| `--platform {win64,win-arm64,linux-x86_64}` | Zielplattform |
| `--firefox-version X` | Firefox‑Version als Basis (Standard: Pin in `firefox.json`, sonst die neueste) |
| `--version X` | Lokum‑Version (Standard: `version.json` + `-dev`) |
| `--firefox-dir ORDNER` | Ein bereits entpacktes Firefox statt eines Downloads verwenden |
| `--no-locales` | Sprachpakete überspringen (schneller) |
| `--no-installer` | NSIS überspringen |
| `--app-only` | Nach dem Vorbereiten des Anwendungsordners anhalten |

**Entwickeln mit einem entpackten Firefox**

```sh
scripts/dev/install.sh /pfad/zu/firefox        # kopiert die Lokum-Schicht hinein
/pfad/zu/firefox/firefox --profile /tmp/lokum-dev --no-remote
```

Die meisten Änderungen an `src/lokum` brauchen nur einen Neustart des Browsers.

**Tests**

```sh
node --test "tests/unit/*.test.mjs"      # Kernlogik, Sortenkontrast
python3 tests/check_locales.py --strict  # alle Wörterbücher vollständig
node scripts/dev/make_content_css.mjs --check
LOKUM_SELFTEST=out.json ./lokum --headless   # 25 Prüfungen im Browser
```

`LOKUM_SELFTEST` lässt ein echtes Lokum einen Selbsttest ausführen (Layout,
Bereiche, Sorten, Befehlspalette, Einstellungs‑ und Willkommensseiten, Sprachen,
Branding, Updater und Richtlinien), das Ergebnis als JSON schreiben und sich
beenden. Die CI führt ihn nach der Installation der frisch gebauten Pakete unter
Windows und Linux aus.

---

## Wie Lokum funktioniert

```
offizielles Firefox ──► SHA512 prüfen ──► entpacken
        │
        ├─ 11 Mozilla-Sprachpakete in omni.ja einfügen (+ Mehrsprachenliste)
        ├─ Firefox-Branding (Namen, Logos, Symbole) durch Lokum ersetzen
        ├─ Lokum-Schicht hinzufügen:  defaults/pref/lokum-autoconfig.js
        │                             lokum.cfg  (Autoconfig-Start)
        │                             distribution/policies.json
        │                             browser/lokum/  (Paket chrome://lokum)
        ├─ Updater, Absturzmelder, Telemetrie-Helfer entfernen
        ├─ firefox.exe → lokum.exe, neue Symbole und Versionsinfos
        └─ verpacken: NSIS-Installer · portable ZIP · Linux-Archiv
```

Beim Start liest Firefox `lokum-autoconfig.js`, das `lokum.cfg` lädt. Dieser
winzige Startcode registriert das Paket `chrome://lokum/` und startet
`LokumStartup.sys.mjs`, das alles Weitere verbindet:

| Modul | Aufgabe |
| --- | --- |
| `LokumStartup` | Start‑/Beenden‑Hooks, Ersteinrichtung, „aktualisiert“‑Hinweis, Selbsttest |
| `LokumWindow` | Steuerung pro Fenster: Stylesheets, Wurzelattribute, Titelzeile, Kompaktmodus, schwebende Befehlsleiste, Tastenkürzel |
| `LokumFlavors` | Die zwölf Paletten als CSS‑Variablen mit `light-dark()` |
| `LokumLayout` | Übersetzt das Lokum‑Layout in Firefox‑Einstellungen für Seitenleiste/vertikale Tabs und Symbolleisten |
| `LokumSpaces` | Bereiche: Speicherung, Wechsel, Kopf‑ und Fußzeile der Seitenleiste, Menüs, Drag & Drop |
| `LokumTabs` | Automatisches Archiv und schlafende Tabs |
| `LokumCommandPalette` | Palette mit <kbd>Strg</kbd>+<kbd>K</kbd> |
| `LokumMediaCard` | Mini‑Player in der Seitenleiste |
| `LokumUpdater` | Update‑Prüfung, verifizierte Downloads, stille Installation beim Beenden |
| `LokumI18n` | Lokum‑Wörterbücher und Sprachwahl beim ersten Start |
| `LokumShell` | Windows‑Integration als Standardbrowser |
| `LokumContentStyles` | Kleidet die Seite „Neuer Tab“ und die Firefox‑Einstellungen in die aktive Sorte |
| `LokumAboutPages` | `about:lokum` (Einstellungen) und `about:lokum-welcome` (Tour) |
| `LokumSelfTest` | Selbsttest im Browser, genutzt von der CI |

Aufbau des Repositorys:

```
src/app/            Dateien neben der Firefox-Programmdatei (Autoconfig, Richtlinien)
src/lokum/          das Paket chrome://lokum
  modules/          JavaScript-Module (siehe oben)
  styles/           Stile der Browser-Oberfläche (Tokens, Rahmen, Layout, Komponenten, Animationen)
  pages/            about:lokum-Einstellungen und die Willkommenstour
  locales/          Lokums Wörterbücher (12 Sprachen)
  images/           Symbole und Logos
scripts/build.py    der Build (siehe scripts/lokumbuild/)
scripts/release.py  Versionsplanung, latest.json, Versionshinweise
scripts/pe/         Ressourcen der Windows-Programmdatei (resedit)
installer/          NSIS-Installer und seine Übersetzungen
branding/           Logo-Quellen und erzeugte Symbole
tests/              Unit-Tests, Sprachprüfungen, Smoke-Tests
.github/workflows/  CI, Builds und automatische Veröffentlichungen
```

---

## Veröffentlichungen und kontinuierliche Integration

- **Jeder Pull‑Request und jeder Branch‑Push** führt Unit‑ und Sprachtests aus, baut Windows‑ und Linux‑Pakete, installiert sie auf echten Windows‑ und Linux‑Runnern und führt den Selbsttest im Browser aus.
- **Jeder Push auf `main`** tut dasselbe und veröffentlicht danach eine **neue GitHub‑Version** mit Installationsprogramm, portabler ZIP, Linux‑Archiv, `latest.json`, `SHA256SUMS.txt` und automatisch erzeugten Versionshinweisen. Installierte Kopien aktualisieren sich daraus.
- **Alle sechs Stunden** fragt ein geplanter Job bei Mozilla die neueste Firefox‑Version ab; ist sie neuer als die der letzten Veröffentlichung, wird Lokum darauf neu gebaut und automatisch veröffentlicht — Sicherheitskorrekturen kommen so ohne manuelles Zutun bei Ihnen an.
- Veröffentlichungen lassen sich auch von Hand starten (**Actions → Release → Run workflow**), optional mit einer bestimmten Firefox‑Version oder als Beta‑Vorabversion.

Versionsnummern stammen aus `version.json`; jede Veröffentlichung erhöht die
Patch‑Nummer automatisch. Bei Bedarf lässt sich eine Firefox‑Version mit einer
Datei `firefox.json` (`{"version": "156.0"}`) festlegen.

---

## FAQ

**Ist Lokum ein Fork von Firefox?**
Nicht im Sinne einer eigenen Engine. Lokum verpackt Mozillas offizielle
Firefox‑Builds neu und fügt eine eigene Oberflächenschicht hinzu — Sie bekommen
also exakt Firefox' Engine, Leistung, Webkompatibilität und Sicherheitskorrekturen.

**Funktionieren Firefox‑Erweiterungen?**
Ja — jedes Add‑on von [addons.mozilla.org](https://addons.mozilla.org) funktioniert.

**Kann ich Firefox Sync nutzen?**
Ja. Melden Sie sich unter **Firefox‑Einstellungen → Sync** an, um Lesezeichen,
Passwörter, Chronik, Tabs und Add‑ons mit Firefox auf Ihren anderen Geräten zu
synchronisieren.

**Verändert oder liest Lokum mein bestehendes Firefox?**
Nein. Lokum hat ein eigenes Profil. Nutzen Sie den Import‑Schritt (oder
**Einstellungen → Erweitert → Importieren**), wenn Sie Ihre Daten übernehmen möchten.

**Warum warnt mein Virenscanner / SmartScreen?**
Das Installationsprogramm ist noch nicht codesigniert. Vergleichen Sie die Datei
mit `SHA256SUMS.txt` auf der Release‑Seite oder bauen Sie Lokum selbst.

**Gibt es eine macOS‑Version?**
Noch nicht. Windows und Linux werden bei jeder Änderung gebaut und getestet.

**Nach einem Update sieht etwas falsch aus. Wie setze ich zurück?**
**Einstellungen → Erweitert → Lokum‑Einstellungen zurücksetzen** stellt jede
Lokum‑Option wieder her, behält aber Ihre Tabs, Bereiche und Daten.

---

## Mitmachen

Fehlerberichte, Ideen, Übersetzungen und Pull‑Requests sind sehr willkommen.

- Fehler und Ideen bitte unter [Issues](https://github.com/SametEge/Lokum/issues) melden.
- Um eine Übersetzung zu verbessern, bearbeiten Sie `src/lokum/locales/<Code>.json` (und `installer/strings.nsh` für den Installer) und führen Sie `python3 tests/check_locales.py --strict` aus.
- Für eine neue Sorte fügen Sie eine Palette in `src/lokum/modules/LokumFlavors.sys.mjs` sowie Name und Beschreibung in jedes Wörterbuch ein und führen `node scripts/dev/make_content_css.mjs` und die Unit‑Tests (sie prüfen den Kontrast) aus.
- Bitte führen Sie vor einem Pull‑Request die obigen Tests aus.

---

## Lizenz und Marken

Der Quellcode von Lokum steht unter der [Mozilla Public License 2.0](../../LICENSE),
derselben Lizenz wie Firefox.

Firefox und das Firefox‑Logo sind Marken der Mozilla Foundation. Lokum ist ein
unabhängiges Projekt, weder mit Mozilla verbunden noch von Mozilla unterstützt;
es wird aus Mozillas offiziellen Versionen gebaut und entfernt daraus das
Firefox‑Branding. Arc ist eine Marke von The Browser Company, die ebenfalls
nicht mit Lokum verbunden ist — Lokum ist lediglich von ihren Ideen inspiriert.
uBlock Origin stammt von Raymond Hill und Mitwirkenden.

<p align="center"><sub>Gemacht mit 🍬 und Firefox.</sub></p>
