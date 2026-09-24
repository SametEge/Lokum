<p align="center">
  <img src="../images/banner.png" alt="Lokum — ett sötare sätt att surfa" width="820">
</p>

<p align="center">
  <a href="../../README.md">English</a> ·
  <a href="README.tr.md">Türkçe</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.it.md">Italiano</a> ·
  <a href="README.rm.md">Rumantsch</a> ·
  <a href="README.es.md">Español</a> ·
  <b>Svenska</b> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a>
</p>

<p align="center">
  <a href="https://github.com/SametEge/Lokum/releases/latest"><img alt="Senaste versionen" src="https://img.shields.io/github/v/release/SametEge/Lokum?label=h%C3%A4mta&color=d23c78"></a>
  <a href="https://github.com/SametEge/Lokum/releases"><img alt="Hämtningar" src="https://img.shields.io/github/downloads/SametEge/Lokum/total?label=h%C3%A4mtningar&color=f1a2c2"></a>
  <img alt="Windows 10/11" src="https://img.shields.io/badge/Windows-10%20%7C%2011-6a46d8">
  <img alt="Linux x86-64" src="https://img.shields.io/badge/Linux-x86--64-55852a">
  <a href="../../LICENSE"><img alt="MPL 2.0" src="https://img.shields.io/badge/licens-MPL%202.0-8a7141"></a>
</p>

**Lokum** är en webbläsare byggd på Mozilla Firefox, smaksatt som turkisk
konfekt. Den tar motorn, säkerheten och tilläggen som du redan litar på och
slår in dem i ett sidofält i Arc‑stil, tolv handblandade färg‑”smaker”,
utrymmen (Spaces), en kommandopalett, mjuka animationer och en ovanligt
genomarbetad första start — på tolv språk. Den uppdaterar sig själv, tyst, via
GitHub Releases så fort en ny version är klar.

<p align="center">
  <img src="../images/screenshots/arc-light.webp" alt="Lokum med sidofält i Arc-stil och smaken Ros" width="49%">
  <img src="../images/screenshots/arc-dark.webp" alt="Lokum i mörkt läge med smaken Midnatt" width="49%">
</p>

---

## Innehåll

<!-- toc -->
- [Hämta](#hämta)
- [Höjdpunkter](#höjdpunkter)
- [Smaker](#smaker)
- [Layouter: sidofält eller klassiska flikar](#layouter-sidofält-eller-klassiska-flikar)
- [Utrymmen](#utrymmen)
- [Kommandopalett och kommandofält](#kommandopalett-och-kommandofält)
- [Flikar som städar sig själva](#flikar-som-städar-sig-själva)
- [Välkomstturen](#välkomstturen)
- [Inställningar](#inställningar)
- [Integritet](#integritet)
- [Språk](#språk)
- [Automatiska uppdateringar](#automatiska-uppdateringar)
- [Kortkommandon](#kortkommandon)
- [Installation](#installation)
- [Bygga från källkod](#bygga-från-källkod)
- [Så fungerar Lokum](#så-fungerar-lokum)
- [Versioner och kontinuerlig integration](#versioner-och-kontinuerlig-integration)
- [Vanliga frågor](#vanliga-frågor)
- [Bidra](#bidra)
- [Licens och varumärken](#licens-och-varumärken)
<!-- /toc -->

---

## Hämta

Hämta den senaste versionen från **[versionssidan](https://github.com/SametEge/Lokum/releases/latest)**.

| Fil | För | Kommentar |
| --- | --- | --- |
| `Lokum-Setup-<version>-x64.exe` | Windows 10 / 11 (64‑bitars) | **Rekommenderas.** Installeras bara för din användare, kräver ingen administratör och uppdaterar sig själv. |
| `Lokum-<version>-win64.zip` | Windows, portabel | Packa upp var som helst (även på ett USB‑minne) och starta `lokum.exe`. Talar om när det finns uppdateringar. |
| `Lokum-<version>-linux-x86_64.tar.xz` | Linux (64‑bitars) | Packa upp och kör `./lokum`; `install-desktop-entry.sh` lägger till den i programmenyn. |
| `latest.json`, `SHA256SUMS.txt` | Alla | Uppdateringsmanifestet som den inbyggda uppdateraren använder och SHA‑256‑summor för varje fil. |

> **Windows SmartScreen.** Lokum är ännu inte kodsignerad (certifikat är dyra
> för ett hobbyprojekt), så Windows kan säga *”Windows skyddade datorn”* första
> gången. Klicka på **Mer information → Kör ändå**. Du kan alltid kontrollera
> filen mot `SHA256SUMS.txt` på versionssidan.

---

## Höjdpunkter

- 🍬 **Tolv smaker** — varje tema är en sorts lokum: Ros, Pistage, Citron, Granatäpple, Apelsin, Mynta, Lavendel, Mastix, Kokos, Turkiskt kaffe, Midnatt och en animerad ask *Blandade*. Var och en med ett ljust och ett mörkt recept.
- 🧭 **Sidofält i Arc‑stil _eller_ klassiska flikar** — ett sidofält i full höjd med adressfältet inuti, Firefox vertikala flikar eller den klassiska flikraden. Byt när du vill; fönstret ordnar om sig direkt.
- 🗂️ **Utrymmen** — håll isär Personligt, Jobb, Skola och Nöje, var och en med egna flikar, egen ikon, egen smak och (om du vill) egen behållare. Svep eller tryck <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>←</kbd>/<kbd>→</kbd> för att byta.
- ⌨️ **Kommandopalett** (<kbd>Ctrl</kbd>+<kbd>K</kbd>) — ungefärlig sökning bland öppna flikar och fler än 40 åtgärder, plus ett stort **svävande kommandofält** när du klickar i adressfältet.
- 🎵 **Minispelare** — spela, pausa, hoppa och stäng av ljudet för musik och video i andra flikar direkt i sidofältet.
- 🧹 **Flikar som städar sig själva** — arkivera oanvända flikar automatiskt, låt bakgrundsflikar sova och öppna allt igen från arkivet.
- 🌟 **En välkomsttur som ingen annan** — välj smak genom att släppa sockerpudrade 3D‑lokumkuber, se webbläsaren ordna om sig bakom guiden, skapa utrymmen från mallar, importera från din gamla webbläsare och välj integritetsnivå. Konfetti ingår.
- ⚙️ **Inställningar som är ett nöje** — tolv avsnitt, direktsökning, liveförhandsvisning, export/import av dina Lokum‑inställningar.
- 🔒 **Privat från början** — ingen telemetri, inga studier, inget sponsrat innehåll; strikt spårningsskydd ett klick bort; uBlock Origin, säker DNS, endast HTTPS, GPC och skydd mot fingeravtryck i inställningarna.
- 🌍 **Tolv språk** — engelska, turkiska, tyska, franska, italienska, rätoromanska, spanska, svenska, koreanska, japanska samt förenklad och traditionell kinesiska — för både Lokum och Firefox själv.
- 🔄 **Automatiska uppdateringar** — nya versioner byggs av GitHub Actions vid varje ändring och varje gång Mozilla släpper en ny Firefox, och installeras tyst när du stänger Lokum.
- 🦊 **Äkta Firefox inuti** — officiella Mozilla‑byggen, Gecko‑motorn, alla Firefox‑tillägg, Firefox Sync och Mozillas säkerhetsrättelser så fort de släpps.

---

## Smaker

En smak färgar hela webbläsaren: fönsterramen, sidofältet, accentfärgen på
knappar och reglage, sidan Ny flik och Lokums egna sidor. Varje smak har ett
ljust och ett mörkt recept, och du kan byta accenten mot valfri färg. Utrymmen
kan ha en egen smak, så fönstret byter färg när du byter utrymme.

| | Smak | Känsla |
| --- | --- | --- |
| 🌹 | **Ros** (Gül) | Den klassiska lokumen med rosenvatten, rodnande rosa. *(standard)* |
| 🌰 | **Pistage** (Fıstık) | Frisk pistagegrön, lugn och fokuserad. |
| 🍋 | **Citron** (Limon) | Solig citronzest för ljusa morgnar. |
| 🍎 | **Granatäpple** (Nar) | Djupt granatäppelröd, djärv och saftig. |
| 🍊 | **Apelsin** (Portakal) | Varmt sken av apelsin och bergamott. |
| 🌿 | **Mynta** (Nane) | Sval mynta, frisk som en vårbris. |
| 💜 | **Lavendel** (Lavanta) | Mjuk lavendel för drömska eftermiddagar. |
| 🤍 | **Mastix** (Sakız) | Krämigt mastixelfenben, stilla och elegant. |
| 🥥 | **Kokos** (Hindistan cevizi) | Kokosvit, ren och minimalistisk. |
| ☕ | **Turkiskt kaffe** (Kahve) | Turkiskt kaffes fylliga bruna toner. |
| 🌙 | **Midnatt** (Gece) | Stjärnklart midnattsplommon för nattugglor. |
| 🎨 | **Blandade** (Karışık) | En ask blandade godsaker som långsamt glider genom alla färger. |

Testsviten kontrollerar varje palett: text måste nå en WCAG‑kontrast på 4,5:1
mot sin ram och accentknappar 3:1 — i både ljust och mörkt läge.

Extra detaljer som du kan slå på eller av: **florsocker** (små glittrande korn
i sidofältet), **mjukt korn** (en diskret papperstextur), rundade sidhörn,
ramavstånd, sidskugga, täthet i gränssnittet (kompakt / normal / luftig),
gränssnittets typsnitt (system / rundat / serif) och tre animationsnivåer
(fullständiga, reducerade — färger tonar men inget rör sig — eller av). Lokum
respekterar också systeminställningen *minska rörelse*.

<p align="center">
  <img src="../images/screenshots/settings-appearance.webp" alt="Avsnittet Utseende i Lokums inställningar med tolv smakkuber" width="80%">
</p>

---

## Layouter: sidofält eller klassiska flikar

| Layout | Så ser den ut |
| --- | --- |
| **Sidofält (Arc‑stil)** *(standard)* | Flikar, adressfält och navigeringsknappar bor i ett och samma sidofält i full höjd. Sidan svävar över din smak som ett rundat kort, med en smal titelrad ovanför som visar sidans titel, webbplatsen och knappen *Kopiera länk*. |
| **Vertikala flikar** | Firefox egna vertikala flikar i ett sidofält, adressfältet högst upp. Välbekant och rymligt. |
| **Klassiska flikar** | Flikar längs överkanten, som i alla webbläsare — fortfarande klädda i din smak. |

<p align="center">
  <img src="../images/screenshots/classic-tabs.webp" alt="Lokum med klassiska flikar och smaken Pistage" width="80%">
</p>

Fler layoutalternativ:

- **Sidofältets sida** — vänster eller höger.
- **Dölj sidofältet (kompakt läge)** — <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd>. Sidan tar hela fönstret och sidofältet glider fram när pekaren når fönsterkanten.
- **Svävande kommandofält** — adressfältet öppnas stort och centrerat över sidan, som i Arc.
- **Nya flikar hamnar** överst eller nederst i listan.
- **Stängknapp på flikar** vid hovring, alltid eller aldrig.
- **Fästa flikar blir favoriter** — ett rutnät av stora ikoner högst upp i sidofältet som är detsamma i varje utrymme.
- **Bokmärkesfält**, **minispelare** och **anpassning av verktygsfältet**.

---

## Utrymmen

Utrymmen håller isär olika delar av ditt liv. Varje utrymme har sin egen
fliklista, ett namn, en emoji‑ikon, en valfri smak som färgar om fönstret så
länge du är där och en valfri Firefox‑**behållare** — så att till exempel ditt
jobbutrymme förblir inloggat på dina jobbkonton.

- Byt med ikonerna längst ned i sidofältet, genom att **svepa i sidled** över sidofältet (eller <kbd>Skift</kbd> + mushjul), med <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>←</kbd>/<kbd>→</kbd>, eller hoppa direkt till ett med <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>1</kbd>…<kbd>9</kbd>.
- **Dra en flik till ett utrymmes ikon** för att flytta den, eller använd *Flytta till utrymme* i flikens snabbmeny.
- Högerklicka på utrymmets namn för att byta namn, ikon, smak eller behållare, rensa dess flikar eller skapa och ta bort utrymmen.
- Hantera allt — även ordningen — i **Inställningar → Utrymmen**.
- Utrymmen sparas i din profil (`lokum/spaces.json`) och varje flik minns sitt utrymme även efter omstart.

<p align="center">
  <img src="../images/screenshots/spaces.webp" alt="Jobbutrymmet färgat av smaken Mynta" width="80%">
</p>

---

## Kommandopalett och kommandofält

Tryck <kbd>Ctrl</kbd>+<kbd>K</kbd> var som helst. Skriv några bokstäver så
hittar Lokum öppna flikar och åtgärder med ungefärlig matchning: ny flik/nytt
fönster/nytt privat fönster, öppna stängd flik igen, duplicera, fäst, kopiera
länk, **delad vy** med senaste fliken, läsvy, bild‑i‑bild, skärmbild, sök,
skriv ut, zoom, hämtningar, historik, bokmärken, tillägg, utvecklarverktyg,
rensa senaste historik, mörkt läge, varje layout, varje smak, varje utrymme
samt Lokums eller Firefox inställningar. Allt annat blir en webbsökning.

<p align="center">
  <img src="../images/screenshots/command-palette.webp" alt="Kommandopaletten över en sida" width="49%">
  <img src="../images/screenshots/command-bar.webp" alt="Det svävande kommandofältet" width="49%">
</p>

När du klickar i adressfältet (eller trycker <kbd>Ctrl</kbd>+<kbd>L</kbd>) i
sidofältslayouten växer det till ett stort **svävande kommandofält** mitt i
fönstret — med alla Firefox förslag, sökgenvägar och historik, och gott om
utrymme.

---

## Flikar som städar sig själva

- **Automatisk arkivering** — ofästa flikar som du inte öppnat på 12 timmar, en dag, en vecka eller en månad stängs och sparas i **arkivet** (upp till 600 flikar). Sök och öppna igen i **Inställningar → Arkiv** eller via biblioteksknappen i sidofältet.
- **Sovande flikar** — bakgrundsflikar kan avlastas efter ett antal minuter för att spara minne och batteri; de kommer tillbaka när du klickar på dem.
- **Minispelare** — när en flik spelar media visar ett litet kort i sidofältet omslag, titel och artist med föregående / spela‑pausa / nästa och ljud av.
- Plus allt som Firefox har: **flikgrupper**, **delad vy**, förhandsvisning av flikar vid hovring, automatisk **bild‑i‑bild** och sessionsåterställning.

---

## Välkomstturen

Första gången du startar Lokum öppnas en välkomsttur i helskärm över
webbläsaren — och webbläsaren ändras live bakom den medan du väljer.

<p align="center">
  <img src="../images/screenshots/welcome-flavor.webp" alt="Välkomstturen: välj din smak" width="49%">
  <img src="../images/screenshots/welcome-layout.webp" alt="Välkomstturen: välj din layout" width="49%">
</p>

1. **Välkommen** — en svävande 3D‑lokumkub, virvlande socker och ett språkval.
2. **Smak** — tolv sockrade kuber faller ned i ett fat; tryck på en så byter hela webbläsaren färg i ett moln av florsocker. Välj ljust, mörkt eller automatiskt — eller tryck **Överraska mig** för ett smakroulette.
3. **Layout** — sidofält i Arc‑stil, vertikala eller klassiska flikar, sidofältets sida och kompakt läge, med liveförhandsvisning.
4. **Utrymmen** — börja med Personligt och lägg till Jobb, Skola och Nöje med ett tryck vardera.
5. **Import** — Lokum hittar de andra webbläsarna på datorn (Chrome, Edge, Brave, Opera, Vivaldi…) och tar med bokmärken, lösenord, historik och mer.
6. **Integritet** — balanserat eller strikt spårningsskydd, uBlock Origin, säker DNS; telemetri är alltid av.
7. **Klart** — en sammanfattning av dina val, *gör Lokum till min standardwebbläsare* och konfetti.

Du kan köra turen igen när som helst via **Inställningar → Avancerat →
Välkomstturen**.

---

## Inställningar

Öppna **Lokum‑inställningarna** med <kbd>Ctrl</kbd>+<kbd>,</kbd>, från
huvudmenyn, från sidofältet eller genom att skriva `about:lokum`. Varje
alternativ gäller direkt och sökrutan hittar alla inställningar på namn.

| Avsnitt | Vad du kan göra |
| --- | --- |
| **Utseende** | Smakgalleri, ljust/mörkt/automatiskt, egen accentfärg, florsocker, korn, animationer, hörnrundning, ramavstånd, sidskugga, täthet, gränssnittets typsnitt. |
| **Layout** | Arc‑sidofält / vertikalt / klassiskt, sidofältets sida, kompakt läge, svävande kommandofält, placering av nya flikar, stängknappar, minispelare, bokmärkesfält, anpassa verktygsfältet. |
| **Utrymmen** | Slå på utrymmen, färga fönstret efter utrymme, svep för att byta; lägg till, byt namn, ikon och smak, sortera och ta bort utrymmen; välj behållare. |
| **Flikar** | Automatisk arkivering, sovande flikar, återställ vid start, förhandsvisning av flikar, flikgrupper, delad vy, automatisk bild‑i‑bild, bekräfta innan du avslutar. |
| **Arkiv** | Sök, öppna och ta bort arkiverade flikar; töm arkivet. |
| **Integritet och säkerhet** | Balanserat/strikt spårningsskydd, uBlock Origin med ett klick, endast HTTPS‑läge, säker DNS (Cloudflare, Quad9, Mullvad, NextDNS, AdGuard…), Global Privacy Control, skydd mot fingeravtryck, rensa historik vid avslut, blockera popup‑fönster. |
| **Sök** | Standardsökmotor, förslag, populära sökningar, hantera sökmotorer. |
| **Kortkommandon** | Alla Lokums kortkommandon, med ett reglage för att stänga av dem om de krockar med en webbplats. |
| **Språk** | Gränssnittsspråk (tolv ingår), stavningskontroll, föredragna språk för webbplatser. |
| **Uppdateringar** | Aktuell version, sök nu, automatisk sökning och installation, kanal stabil/beta, intervall, versionsinformation, alla versioner. |
| **Avancerat** | Standardwebbläsare, import från en annan webbläsare, välkomstturen, exportera/importera Lokum‑inställningar (JSON), profilmapp, återställ Lokum‑inställningar, mjuk rullning, egen `userChrome.css`, alla Firefox‑inställningar, `about:config`. |
| **Om Lokum** | Version, Firefox‑motor, byggdatum, plattform, profil; länkar för att rapportera problem, versionsinformation och licenser. |

<p align="center">
  <img src="../images/screenshots/settings-updates.webp" alt="Avsnittet Uppdateringar i Lokums inställningar" width="80%">
</p>

Allt som Firefox erbjuder finns kvar ett klick bort i **Firefox‑inställningarna**
(`about:preferences`).

---

## Integritet

Lokum börjar privat och förblir så:

- **Ingen telemetri, inga studier, ingen kraschrapportering, ingen standardwebbläsaragent.** De stängs av med företagspolicyer (`distribution/policies.json`) och tas bort ur paketet.
- **Inget sponsrat innehåll** — inga sponsrade genvägar eller artiklar på sidan Ny flik, ingen Pocket, inga ”rekommenderade” tillägg eller funktioner.
- **Förbättrat spårningsskydd** i läget *Balanserat* som standard, *Strikt* ett klick bort.
- **uBlock Origin** installeras med ett klick från välkomstturen eller inställningarna.
- Förinställningar för **säker DNS**, läget **endast HTTPS**, **Global Privacy Control**, **skydd mot fingeravtryck** och **rensa vid avslut** i avsnittet Integritet.

Det Lokum själv ansluter till: `github.com` / `api.github.com` för att söka
efter uppdateringar (kan stängas av i **Inställningar → Uppdateringar**). Allt
annat är vanligt Firefox‑beteende — till exempel listor för säker surfning, data
om återkallade certifikat och tilläggsbutiken — som du hanterar i Firefox egna
integritetsinställningar.

---

## Språk

Lokum levereras med tolv språk och använder vid första starten språket som
valdes i installationsprogrammet eller operativsystemets språk. Byt när som
helst i **Inställningar → Språk** (en omstart slutför bytet överallt).

| Språk | Kod | | Språk | Kod |
| --- | --- | --- | --- | --- |
| Engelska (English) | `en` | | Spanska (Español) | `es-ES` |
| Turkiska (Türkçe) | `tr` | | Svenska | `sv-SE` |
| Tyska (Deutsch) | `de` | | Koreanska (한국어) | `ko` |
| Franska (Français) | `fr` | | Japanska (日本語) | `ja` |
| Italienska (Italiano) | `it` | | Kinesiska, förenklad (简体中文) | `zh-CN` |
| Rätoromanska (Rumantsch) | `rm` | | Kinesiska, traditionell (繁體中文) | `zh-TW` |

Firefox eget gränssnitt kommer från Mozillas officiella språkpaket, som bygget
lägger in i programmet; Lokums tillägg (sidofält, inställningar, välkomsttur,
uppdaterare…) använder små JSON‑ordlistor i `src/lokum/locales/`. Ett test ser
till att varje ordlista är komplett och behåller samma `{platshållare}` som
engelskan. Windows‑installationsprogrammet finns på alla dessa språk utom
rätoromanska.

---

## Automatiska uppdateringar

1. Var sjätte timme (inställbart) hämtar Lokum den lilla filen `latest.json` från den senaste GitHub‑versionen.
2. Om det finns en nyare version visas ett kort i sidofältet och installationsprogrammet hämtas i bakgrunden — bara från GitHubs nedladdningsservrar för versioner.
3. Filens **SHA‑256** jämförs med `latest.json`; allt som inte stämmer kastas.
4. När du stänger Lokum installeras uppdateringen tyst i bakgrunden. Nästa gång du öppnar Lokum kör du den nya versionen, och ett meddelande *”Lokum har uppdaterats”* länkar till versionsinformationen. **Starta om och uppdatera** installerar direkt och öppnar Lokum igen.

Välj kanalen **Stabil** eller **Beta**, sökintervallet, eller stäng av
automatisk installation i **Inställningar → Uppdateringar**. Den portabla
zip‑utgåvan meddelar bara. Mozillas egen Firefox‑uppdaterare är avstängd —
Lokum‑versionerna tar med den nya Firefox åt dig.

---

## Kortkommandon

| Kortkommando | Åtgärd |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>K</kbd> | Kommandopalett |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd> | Visa / dölj sidofältet (kompakt läge) |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>→</kbd> / <kbd>←</kbd> | Nästa / föregående utrymme |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>1</kbd> … <kbd>9</kbd> | Gå till utrymme 1–9 |
| <kbd>Ctrl</kbd>+<kbd>Skift</kbd>+<kbd>C</kbd> | Kopiera sidans länk |
| <kbd>Ctrl</kbd>+<kbd>,</kbd> | Lokum‑inställningar |
| <kbd>Ctrl</kbd>+<kbd>T</kbd> | Ny flik |
| <kbd>Ctrl</kbd>+<kbd>L</kbd> | Adressfältet (svävande kommandofält) |
| <kbd>Ctrl</kbd>+<kbd>Skift</kbd>+<kbd>T</kbd> | Öppna stängd flik igen |

Alla andra kortkommandon i Firefox fungerar som vanligt. Lokums egna
kortkommandon kan stängas av i **Inställningar → Kortkommandon**.

---

## Installation

### Windows (installationsprogram)

1. Hämta `Lokum-Setup-<version>-x64.exe` från [senaste versionen](https://github.com/SametEge/Lokum/releases/latest).
2. Kör det (se SmartScreen‑kommentaren ovan), välj språk, om du vill ha en genväg på skrivbordet och om Lokum ska bli standardwebbläsare, och klicka på **Installera**.
3. Lokum installeras i `%LOCALAPPDATA%\Programs\Lokum` — per användare, utan administratörsrättigheter — och registrerar sig som webbläsare, så att du kan välja den i **Windows‑inställningar → Standardappar**.

Kommandoradsväxlar för skriptade installationer:

| Växel | Betydelse |
| --- | --- |
| `/S` | Tyst installation |
| `/D=C:\sökväg\Lokum` | Installationsmapp (måste stå sist) |
| `/DESKTOP=0` | Ingen genväg på skrivbordet (standard `1`) |
| `/UPDATE` | Uppdatera en befintlig installation (används av uppdateraren) |
| `/RELAUNCH` | Starta Lokum när det är klart |

Avinstallera via **Windows‑inställningar → Appar → Lokum**. Avinstallationen
frågar om din profil (bokmärken, lösenord, historik) ska behållas eller också
tas bort.

### Windows (portabel)

Packa upp `Lokum-<version>-win64.zip` var som helst och kör `lokum.exe`. Den
portabla utgåvan rör inte registret och meddelar bara om uppdateringar.

### Linux

```sh
tar -xJf Lokum-<version>-linux-x86_64.tar.xz
cd Lokum
./lokum                      # kör
./install-desktop-entry.sh   # valfritt: lägg till Lokum i programmenyn
```

### Var dina data finns

Lokum har en egen profil, skild från eventuellt installerade Firefox.
**Inställningar → Avancerat → Profilmapp** öppnar den. Lokum‑specifika data
(utrymmen, flikarkiv) finns i mappen `lokum` i profilen.

---

## Bygga från källkod

Lokum kompilerar inte Firefox. Bygget hämtar en **officiell Firefox‑version**
från `archive.mozilla.org`, kontrollerar den mot Mozillas `SHA512SUMS` och gör
om den till Lokum. Ett fullständigt Windows‑bygge tar några minuter på en
vanlig dator, och Windows‑paket kan byggas på Linux.

**Krav**

- Python 3.10+
- Node.js 20+ (skriver om ikoner och versionsinformation i `lokum.exe` med [resedit](https://github.com/jet2jet/resedit-js))
- `7z` (p7zip) för att packa upp Firefox installationsprogram för Windows, `tar` och `xz`
- NSIS 3 (`makensis`) för Windows‑installationsprogrammet

På Ubuntu/Debian: `sudo apt install python3 nodejs npm p7zip-full nsis xz-utils`

**Bygga**

```sh
git clone https://github.com/SametEge/Lokum.git
cd Lokum
npm ci --prefix scripts/pe          # en gång, för Windows-byggen

# Windows-installationsprogram + portabel zip från senaste Firefox
python3 scripts/build.py --platform win64

# Linux-arkiv på en viss Firefox-version
python3 scripts/build.py --platform linux-x86_64 --firefox-version 156.0
```

Resultaten hamnar i `dist/`. Användbara alternativ:

| Alternativ | Betydelse |
| --- | --- |
| `--platform {win64,win-arm64,linux-x86_64}` | Målplattform |
| `--firefox-version X` | Firefox‑version att bygga på (standard: fäst i `firefox.json`, annars den senaste) |
| `--version X` | Lokum‑version (standard: `version.json` + `-dev`) |
| `--firefox-dir MAPP` | Använd en redan uppackad Firefox i stället för att hämta |
| `--no-locales` | Hoppa över språkpaketen (snabbare) |
| `--no-installer` | Hoppa över NSIS |
| `--app-only` | Stanna när programmappen är förberedd |

**Utveckla mot en uppackad Firefox**

```sh
scripts/dev/install.sh /sökväg/till/firefox        # kopierar in Lokum-lagret
/sökväg/till/firefox/firefox --profile /tmp/lokum-dev --no-remote
```

De flesta ändringar i `src/lokum` kräver bara en omstart av webbläsaren.

**Tester**

```sh
node --test "tests/unit/*.test.mjs"      # kärnlogik, smakernas kontrast
python3 tests/check_locales.py --strict  # alla ordlistor kompletta
node scripts/dev/make_content_css.mjs --check
LOKUM_SELFTEST=out.json ./lokum --headless   # 25 kontroller i webbläsaren
```

`LOKUM_SELFTEST` får en riktig Lokum att köra ett självtest (layout, utrymmen,
smaker, kommandopalett, inställnings‑ och välkomstsidor, språk, varumärke,
uppdaterare och policyer), skriva resultatet som JSON och avsluta. CI kör det på
Windows och Linux efter att ha installerat de nybyggda paketen.

---

## Så fungerar Lokum

```
officiell Firefox-version ──► kontrollera SHA512 ──► packa upp
        │
        ├─ lägg in 11 språkpaket från Mozilla i omni.ja (+ flerspråkslista)
        ├─ byt Firefox-varumärket (namn, logotyper, ikoner) mot Lokums
        ├─ lägg till Lokum-lagret:  defaults/pref/lokum-autoconfig.js
        │                           lokum.cfg  (autoconfig-start)
        │                           distribution/policies.json
        │                           browser/lokum/  (paketet chrome://lokum)
        ├─ ta bort uppdaterare, kraschrapportering och telemetri
        ├─ firefox.exe → lokum.exe, nya ikoner och versionsinformation
        └─ paketera: NSIS-installationsprogram · portabel zip · Linux-arkiv
```

Vid start läser Firefox `lokum-autoconfig.js`, som laddar `lokum.cfg`. Den lilla
startkoden registrerar paketet `chrome://lokum/` och startar
`LokumStartup.sys.mjs`, som kopplar ihop allt annat:

| Modul | Uppgift |
| --- | --- |
| `LokumStartup` | Start/avslut, välkomsttur, meddelandet ”uppdaterad”, självtest |
| `LokumWindow` | Styrning per fönster: stilmallar, rotattribut, titelrad, kompakt läge, svävande kommandofält, kortkommandon |
| `LokumFlavors` | De tolv paletterna som CSS‑variabler med `light-dark()` |
| `LokumLayout` | Översätter Lokums layout till Firefox inställningar för sidofält/vertikala flikar och verktygsfältens placering |
| `LokumSpaces` | Utrymmen: lagring, byte, sidofältets rubrik och fot, menyer, dra och släpp |
| `LokumTabs` | Automatisk arkivering och sovande flikar |
| `LokumCommandPalette` | Paletten <kbd>Ctrl</kbd>+<kbd>K</kbd> |
| `LokumMediaCard` | Minispelaren i sidofältet |
| `LokumUpdater` | Uppdateringskontroll, verifierade hämtningar, tyst installation vid avslut |
| `LokumI18n` | Lokums ordlistor och språkval vid första start |
| `LokumShell` | Windows‑integration som standardwebbläsare |
| `LokumContentStyles` | Klär sidan Ny flik och Firefox inställningar i den aktiva smaken |
| `LokumAboutPages` | `about:lokum` (inställningar) och `about:lokum-welcome` (tur) |
| `LokumSelfTest` | Självtest i webbläsaren som CI använder |

Repositoryts struktur:

```
src/app/            filer som kopieras bredvid Firefox programfil (autoconfig, policyer)
src/lokum/          paketet chrome://lokum
  modules/          JavaScript-moduler (ovan)
  styles/           gränssnittets stilar (tokens, ram, layout, komponenter, animationer)
  pages/            inställningarna about:lokum och välkomstturen
  locales/          Lokums ordlistor (12 språk)
  images/           ikoner och logotyper
scripts/build.py    bygget (se scripts/lokumbuild/)
scripts/release.py  versionsplanering, latest.json, versionsinformation
scripts/pe/         resurser i Windows-programfilen (resedit)
installer/          NSIS-installationsprogram och dess översättningar
branding/           logotypkällor och genererade ikoner
tests/              enhetstester, språkkontroller, röktester
.github/workflows/  CI, byggen och automatiska versioner
```

---

## Versioner och kontinuerlig integration

- **Varje pull request och varje push till en gren** kör enhets‑ och språktester, bygger Windows‑ och Linux‑paket, installerar dem på riktiga Windows‑ och Linux‑maskiner och kör självtestet i webbläsaren.
- **Varje push till `main`** gör samma sak och publicerar sedan en **ny GitHub‑version** med installationsprogram, portabel zip, Linux‑arkiv, `latest.json`, `SHA256SUMS.txt` och genererad versionsinformation. Installerade kopior uppdaterar sig därifrån.
- **Var sjätte timme** frågar ett schemalagt jobb Mozilla efter den senaste Firefox‑versionen; är den nyare än den i senaste versionen byggs Lokum om på den och publiceras automatiskt — så säkerhetsrättelser når dig utan att någon behöver lyfta ett finger.
- Versioner kan också startas för hand (**Actions → Release → Run workflow**), valfritt på en viss Firefox‑version eller som beta.

Versionsnumren kommer från `version.json`; varje version räknar upp
patchnumret automatiskt. Vid behov kan du låsa en Firefox‑version med filen
`firefox.json` (`{"version": "156.0"}`).

---

## Vanliga frågor

**Är Lokum en fork av Firefox?**
Inte i betydelsen en egen motor. Lokum paketerar om Mozillas officiella
Firefox‑byggen och lägger till ett eget gränssnittslager — du får alltså exakt
Firefox motor, prestanda, webbkompatibilitet och säkerhetsrättelser.

**Fungerar Firefox‑tillägg?**
Ja — alla tillägg från [addons.mozilla.org](https://addons.mozilla.org) fungerar.

**Kan jag använda Firefox Sync?**
Ja. Logga in via **Firefox‑inställningar → Sync** för att synkronisera
bokmärken, lösenord, historik, flikar och tillägg med Firefox på dina andra
enheter.

**Ändrar eller läser Lokum min befintliga Firefox?**
Nej. Lokum har en egen profil. Använd importsteget (eller **Inställningar →
Avancerat → Importera**) om du vill ta med dina data.

**Varför varnar mitt antivirus / SmartScreen?**
Installationsprogrammet är ännu inte kodsignerat. Jämför filen med
`SHA256SUMS.txt` på versionssidan, eller bygg Lokum själv.

**Finns det en macOS‑version?**
Inte ännu. Windows och Linux byggs och testas vid varje ändring.

**Något ser fel ut efter en uppdatering. Hur återställer jag?**
**Inställningar → Avancerat → Återställ Lokum‑inställningar** återställer varje
Lokum‑alternativ men behåller dina flikar, utrymmen och data.

---

## Bidra

Felrapporter, idéer, översättningar och pull requests är mycket välkomna.

- Rapportera fel och idéer under [Issues](https://github.com/SametEge/Lokum/issues).
- För att förbättra en översättning, redigera `src/lokum/locales/<kod>.json` (och `installer/strings.nsh` för installationsprogrammet) och kör `python3 tests/check_locales.py --strict`.
- För att lägga till en smak, lägg till en palett i `src/lokum/modules/LokumFlavors.sys.mjs` och dess namn och beskrivning i varje ordlista, och kör `node scripts/dev/make_content_css.mjs` och enhetstesterna (de kontrollerar kontrasten).
- Kör gärna testerna ovan innan du öppnar en pull request.

---

## Licens och varumärken

Lokums källkod är licensierad under [Mozilla Public License 2.0](../../LICENSE),
samma licens som Firefox.

Firefox och Firefox‑logotypen är varumärken som tillhör Mozilla Foundation.
Lokum är ett oberoende projekt som varken är knutet till eller godkänt av
Mozilla; det byggs från Mozillas officiella versioner och tar bort
Firefox‑varumärket från dem. Arc är ett varumärke som tillhör The Browser
Company, som inte heller har någon koppling till Lokum — Lokum är bara
inspirerat av dess idéer. uBlock Origin är skapat av Raymond Hill och bidragsgivare.

<p align="center"><sub>Gjord med 🍬 och Firefox.</sub></p>
