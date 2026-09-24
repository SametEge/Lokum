<p align="center">
  <img src="../images/banner-it.png" alt="Lokum — Veloce · Potente · Non ruba mai i tuoi dati" width="820">
</p>

<p align="center">
  <a href="../../README.md">English</a> ·
  <a href="README.tr.md">Türkçe</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.fr.md">Français</a> ·
  <b>Italiano</b> ·
  <a href="README.rm.md">Rumantsch</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.sv.md">Svenska</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a>
</p>

<p align="center">
  <a href="https://github.com/SametEge/Lokum/releases/latest"><img alt="Ultima versione" src="https://img.shields.io/github/v/release/SametEge/Lokum?label=scarica&color=d23c78"></a>
  <a href="https://github.com/SametEge/Lokum/releases"><img alt="Download" src="https://img.shields.io/github/downloads/SametEge/Lokum/total?color=f1a2c2"></a>
  <img alt="Windows 10/11" src="https://img.shields.io/badge/Windows-10%20%7C%2011-6a46d8">
  <img alt="Linux x86-64" src="https://img.shields.io/badge/Linux-x86--64-55852a">
  <a href="../../LICENSE"><img alt="MPL 2.0" src="https://img.shields.io/badge/licenza-MPL%202.0-8a7141"></a>
</p>

**Lokum** è un browser web basato su Mozilla Firefox e aromatizzato come un
lokum, la delizia turca. Prende il motore, la sicurezza e le estensioni di cui
ti fidi già e li avvolge in una barra laterale in stile Arc, dodici «gusti» di
colore mescolati a mano, gli Spazi, una tavolozza dei comandi, animazioni
delicate e una prima configurazione insolitamente curata — in dodici lingue. Si
aggiorna da solo, in silenzio, tramite GitHub Releases non appena una nuova
versione è pronta.

<p align="center">
  <img src="../images/screenshots/arc-light.webp" alt="Lokum con la barra laterale in stile Arc e il gusto Rosa" width="49%">
  <img src="../images/screenshots/arc-dark.webp" alt="Lokum in modalità scura con il gusto Mezzanotte" width="49%">
</p>

---

## Indice

<!-- toc -->
- [Download](#download)
- [In breve](#in-breve)
- [Gusti](#gusti)
- [Layout: barra laterale o schede classiche](#layout-barra-laterale-o-schede-classiche)
- [Spazi](#spazi)
- [Tavolozza e barra dei comandi](#tavolozza-e-barra-dei-comandi)
- [Schede che si riordinano da sole](#schede-che-si-riordinano-da-sole)
- [Il tour di benvenuto](#il-tour-di-benvenuto)
- [Impostazioni](#impostazioni)
- [Privacy](#privacy)
- [Lingue](#lingue)
- [Aggiornamenti automatici](#aggiornamenti-automatici)
- [Scorciatoie da tastiera](#scorciatoie-da-tastiera)
- [Installazione](#installazione)
- [Compilare dai sorgenti](#compilare-dai-sorgenti)
- [Come funziona Lokum](#come-funziona-lokum)
- [Versioni e integrazione continua](#versioni-e-integrazione-continua)
- [Domande frequenti](#domande-frequenti)
- [Contribuire](#contribuire)
- [Licenza e marchi](#licenza-e-marchi)
<!-- /toc -->

---

## Download

Scarica la versione più recente dalla **[pagina delle versioni](https://github.com/SametEge/Lokum/releases/latest)**.

| File | Per | Note |
| --- | --- | --- |
| `Lokum-Setup-<versione>-x64.exe` | Windows 10 / 11 (64 bit) | **Consigliato.** Si installa solo per il tuo utente, senza diritti di amministratore, e si aggiorna da solo. |
| `Lokum-<versione>-win64.zip` | Windows, portatile | Estrai ovunque (anche su una chiavetta USB) e avvia `lokum.exe`. Ti avvisa degli aggiornamenti. |
| `Lokum-<versione>-linux-x86_64.tar.xz` | Linux (64 bit) | Estrai e avvia `./lokum`; `install-desktop-entry.sh` lo aggiunge al menu delle applicazioni. |
| `latest.json`, `SHA256SUMS.txt` | Tutti | Manifesto usato dall'aggiornamento integrato e checksum SHA‑256 di ogni file. |

> **Windows SmartScreen.** Lokum non ha ancora una firma del codice (i
> certificati costano troppo per un progetto amatoriale), quindi al primo avvio
> Windows potrebbe dire *«PC protetto da Windows»*. Fai clic su **Ulteriori
> informazioni → Esegui comunque**. Puoi sempre confrontare il file con
> `SHA256SUMS.txt` nella pagina della versione.

---

## In breve

- 🍬 **Dodici gusti** — ogni tema è un tipo di lokum: Rosa, Pistacchio, Limone, Melograno, Arancia, Menta, Lavanda, Mastice, Cocco, Caffè turco, Mezzanotte e una scatola *Assortiti* animata. Ognuno con una ricetta chiara e una scura.
- 🧭 **Barra laterale in stile Arc _oppure_ schede classiche** — una barra laterale a tutta altezza con dentro la barra degli indirizzi, le schede verticali di Firefox o la classica barra delle schede. Cambia quando vuoi: la finestra si riorganizza dal vivo.
- 🗂️ **Spazi** — separa Personale, Lavoro, Scuola e Svago, ognuno con le sue schede, la sua icona, il suo gusto e (a scelta) il suo contenitore. Scorri oppure usa <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>←</kbd>/<kbd>→</kbd> per cambiare.
- ⌨️ **Tavolozza dei comandi** (<kbd>Ctrl</kbd>+<kbd>K</kbd>) — ricerca approssimativa tra le schede aperte e oltre 40 azioni, più una grande **barra dei comandi fluttuante** quando fai clic sulla barra degli indirizzi.
- 🎵 **Mini lettore** — riproduci, metti in pausa, salta e silenzia musica e video delle altre schede direttamente dalla barra laterale.
- 🧹 **Schede che si riordinano da sole** — archivia automaticamente le schede inutilizzate, metti in sospensione quelle in background e riapri tutto dall'Archivio.
- 🌟 **Un tour di benvenuto senza pari** — scegli il tuo gusto facendo cadere cubetti di lokum 3D ricoperti di zucchero, guarda il browser riorganizzarsi dietro la procedura, crea Spazi da modelli, importa il tuo vecchio browser e scegli il livello di privacy. Coriandoli inclusi.
- ⚙️ **Impostazioni che fanno piacere** — dodici sezioni, ricerca istantanea, anteprime dal vivo, esportazione/importazione delle impostazioni di Lokum.
- 🔒 **Privato per impostazione predefinita** — nessuna telemetria, nessuno studio, nessun contenuto sponsorizzato; protezione antitracciamento restrittiva a un clic; uBlock Origin, DNS sicuro, modalità solo HTTPS, GPC e protezione dal fingerprinting nelle impostazioni.
- 🌍 **Dodici lingue** — inglese, turco, tedesco, francese, italiano, romancio, spagnolo, svedese, coreano, giapponese, cinese semplificato e tradizionale, sia per Lokum sia per Firefox stesso.
- 🔄 **Aggiornamenti automatici** — le nuove versioni vengono compilate da GitHub Actions a ogni modifica e a ogni nuova versione di Firefox, poi installate in silenzio quando chiudi Lokum.
- 🦊 **Dentro c'è il vero Firefox** — build ufficiali di Mozilla, il motore Gecko, tutti i componenti aggiuntivi di Firefox, Firefox Sync e le correzioni di sicurezza di Mozilla appena escono.

---

## Gusti

Un gusto colora tutto il browser: la cornice della finestra, la barra laterale,
il colore di accento di pulsanti e interruttori, la pagina Nuova scheda e le
pagine di Lokum. Ogni gusto ha una ricetta chiara e una scura, e puoi sostituire
l'accento con il colore che preferisci. Gli Spazi possono avere un gusto
proprio, così la finestra cambia colore quando cambi Spazio.

| | Gusto | Atmosfera |
| --- | --- | --- |
| 🌹 | **Rosa** (Gül) | Il classico lokum all'acqua di rose, rosa delicato. *(predefinito)* |
| 🌰 | **Pistacchio** (Fıstık) | Verde pistacchio fresco, calmo e concentrato. |
| 🍋 | **Limone** (Limon) | Scorza di limone solare per mattine luminose. |
| 🍎 | **Melograno** (Nar) | Rosso melograno intenso, deciso e succoso. |
| 🍊 | **Arancia** (Portakal) | Il caldo bagliore di arancia e bergamotto. |
| 🌿 | **Menta** (Nane) | Menta fresca, frizzante come una brezza di primavera. |
| 💜 | **Lavanda** (Lavanta) | Lavanda morbida per pomeriggi sognanti. |
| 🤍 | **Mastice** (Sakız) | Avorio cremoso al mastice, sobrio ed elegante. |
| 🥥 | **Cocco** (Hindistan cevizi) | Bianco cocco, pulito e minimale. |
| ☕ | **Caffè turco** (Kahve) | I ricchi marroni del caffè turco. |
| 🌙 | **Mezzanotte** (Gece) | Prugna di mezzanotte stellata per i nottambuli. |
| 🎨 | **Assortiti** (Karışık) | Una scatola di lokum assortiti che scivola lentamente attraverso tutti i colori. |

La suite di test controlla ogni tavolozza: il testo deve raggiungere un
contrasto WCAG di 4,5:1 sulla sua cornice e i pulsanti di accento 3:1, sia in
modalità chiara sia scura.

Tocchi extra da attivare o disattivare: **zucchero a velo** (minuscoli
brillantini nella barra laterale), **grana morbida** (una sottile texture di
carta), angoli arrotondati della pagina, spaziatura della cornice, ombra della
pagina, densità dell'interfaccia (compatta / normale / comoda), carattere
dell'interfaccia (sistema / arrotondato / con grazie) e tre livelli di
animazione (complete, ridotte — i colori sfumano ma nulla si muove — o
disattivate). Lokum rispetta anche l'impostazione di sistema *riduci
movimento*.

<p align="center">
  <img src="../images/screenshots/settings-appearance.webp" alt="La sezione Aspetto delle impostazioni di Lokum con dodici cubetti" width="80%">
</p>

---

## Layout: barra laterale o schede classiche

| Layout | Com'è |
| --- | --- |
| **Barra laterale (stile Arc)** *(predefinito)* | Schede, barra degli indirizzi e pulsanti di navigazione vivono in un'unica barra laterale a tutta altezza. La pagina fluttua sul tuo gusto come una scheda arrotondata, sormontata da una sottile striscia del titolo con il titolo della pagina, il sito e un pulsante *Copia link*. |
| **Schede verticali** | Le schede verticali native di Firefox in una barra laterale, con la barra degli indirizzi in alto. Familiare e spaziosa. |
| **Schede classiche** | Schede in alto, come in ogni browser — sempre vestite del tuo gusto. |

<p align="center">
  <img src="../images/screenshots/classic-tabs.webp" alt="Lokum con schede classiche e il gusto Pistacchio" width="80%">
</p>

Altre opzioni di layout:

- **Lato della barra laterale** — sinistra o destra.
- **Nascondi la barra laterale (modalità compatta)** — <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd>. La pagina occupa tutta la finestra; la barra laterale scivola dentro quando il puntatore tocca il bordo.
- **Barra dei comandi fluttuante** — la barra degli indirizzi si apre grande e centrata sopra la pagina, come in Arc.
- **Le nuove schede compaiono** in cima o in fondo all'elenco.
- **Pulsante di chiusura delle schede** al passaggio del mouse, sempre o mai.
- **Le schede fissate diventano preferiti** — una griglia di grandi icone in cima alla barra laterale, uguale in ogni Spazio.
- **Barra dei segnalibri**, **mini lettore** e **personalizzazione della barra degli strumenti**.

---

## Spazi

Gli Spazi tengono separate le varie parti della tua vita. Ogni Spazio ha il suo
elenco di schede, un nome, un'icona emoji, un gusto facoltativo che ricolora la
finestra mentre ci sei e un **contenitore** Firefox facoltativo, così per
esempio lo Spazio Lavoro resta collegato ai tuoi account di lavoro.

- Cambia Spazio con le icone in fondo alla barra laterale, **scorrendo lateralmente** sulla barra laterale (o <kbd>Maiusc</kbd> + rotellina), con <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>←</kbd>/<kbd>→</kbd>, o salta direttamente a uno con <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>1</kbd>…<kbd>9</kbd>.
- **Trascina una scheda sull'icona di uno Spazio** per spostarla, oppure usa *Sposta nello spazio* nel menu contestuale della scheda.
- Fai clic destro sul nome dello Spazio per rinominarlo, cambiare icona, gusto o contenitore, svuotarne le schede, creare ed eliminare Spazi.
- Gestisci tutto — anche l'ordine — in **Impostazioni → Spazi**.
- Gli Spazi vengono salvati nel profilo (`lokum/spaces.json`) e ogni scheda ricorda il suo Spazio anche dopo il riavvio.

<p align="center">
  <img src="../images/screenshots/spaces.webp" alt="Lo Spazio Lavoro colorato dal gusto Menta" width="80%">
</p>

---

## Tavolozza e barra dei comandi

Premi <kbd>Ctrl</kbd>+<kbd>K</kbd> ovunque. Digita qualche lettera e Lokum trova
schede aperte e azioni con la ricerca approssimativa: nuova scheda/finestra/
finestra anonima, riapri la scheda chiusa, duplica, fissa, copia link, **vista
divisa** con l'ultima scheda, modalità lettura, Picture‑in‑Picture, schermata,
trova, stampa, zoom, download, cronologia, segnalibri, estensioni, strumenti per
sviluppatori, cancella la cronologia recente, modalità scura, ogni layout, ogni
gusto, ogni Spazio e le impostazioni di Lokum o di Firefox. Tutto il resto
diventa una ricerca sul web.

<p align="center">
  <img src="../images/screenshots/command-palette.webp" alt="La tavolozza dei comandi sopra una pagina" width="49%">
  <img src="../images/screenshots/command-bar.webp" alt="La barra dei comandi fluttuante" width="49%">
</p>

Quando fai clic sulla barra degli indirizzi (o premi
<kbd>Ctrl</kbd>+<kbd>L</kbd>) nel layout con barra laterale, diventa una grande
**barra dei comandi fluttuante** al centro della finestra — con tutti i
suggerimenti, le scorciatoie di ricerca e la cronologia di Firefox, e spazio per
respirare.

---

## Schede che si riordinano da sole

- **Archiviazione automatica** — le schede non fissate che non apri da 12 ore, un giorno, una settimana o un mese vengono chiuse e conservate nell'**Archivio** (fino a 600 schede). Cerca e riapri ciò che vuoi in **Impostazioni → Archivio** o dal pulsante libreria nella barra laterale.
- **Schede in sospensione** — le schede in background possono essere scaricate dopo alcuni minuti per risparmiare memoria e batteria; tornano quando ci fai clic.
- **Mini lettore** — quando una scheda riproduce contenuti multimediali, una piccola scheda nella barra laterale mostra copertina, titolo e artista con precedente / riproduci‑pausa / successivo e silenzia.
- E tutto ciò che porta Firefox: **gruppi di schede**, **vista divisa**, anteprime al passaggio del mouse, **Picture‑in‑Picture** automatico e ripristino della sessione.

---

## Il tour di benvenuto

Al primo avvio di Lokum si apre un tour di benvenuto a schermo intero sopra il
browser — e il browser cambia dal vivo dietro di esso mentre scegli.

<p align="center">
  <img src="../images/screenshots/welcome-flavor.webp" alt="Tour di benvenuto: scegli il tuo gusto" width="49%">
  <img src="../images/screenshots/welcome-layout.webp" alt="Tour di benvenuto: scegli il layout" width="49%">
</p>

1. **Benvenuto** — un cubetto di lokum 3D fluttuante, zucchero che volteggia e un selettore della lingua.
2. **Gusto** — dodici cubetti zuccherati cadono in un vassoio; toccane uno e tutto il browser cambia colore in una nuvola di zucchero a velo. Scegli chiaro, scuro o automatico, oppure premi **Sorprendimi** per una roulette dei gusti.
3. **Layout** — barra laterale stile Arc, schede verticali o classiche, lato della barra e modalità compatta, con anteprima dal vivo.
4. **Spazi** — inizia con Personale e aggiungi Lavoro, Scuola e Svago con un tocco ciascuno.
5. **Importa** — Lokum rileva gli altri browser del computer (Chrome, Edge, Brave, Opera, Vivaldi…) e porta con sé segnalibri, password, cronologia e altro.
6. **Privacy** — protezione antitracciamento Bilanciata o Restrittiva, uBlock Origin, DNS sicuro; la telemetria è sempre disattivata.
7. **Fatto** — un riepilogo delle tue scelte, *rendi Lokum il mio browser predefinito* e coriandoli.

Puoi rifarlo quando vuoi da **Impostazioni → Avanzate → Tour di benvenuto**.

---

## Impostazioni

Apri le **Impostazioni di Lokum** con <kbd>Ctrl</kbd>+<kbd>,</kbd>, dal menu
principale, dalla barra laterale o digitando `about:lokum`. Ogni opzione si
applica all'istante e la casella di ricerca trova qualsiasi impostazione per
nome.

| Sezione | Cosa puoi fare |
| --- | --- |
| **Aspetto** | Galleria dei gusti, chiaro/scuro/automatico, colore di accento personalizzato, zucchero a velo, grana, animazioni, arrotondamento degli angoli, spaziatura della cornice, ombra della pagina, densità, carattere dell'interfaccia. |
| **Layout** | Barra laterale Arc / verticale / classica, lato della barra, modalità compatta, barra dei comandi fluttuante, posizione delle nuove schede, pulsanti di chiusura, mini lettore, barra dei segnalibri, personalizzazione della barra degli strumenti. |
| **Spazi** | Attiva gli Spazi, colora la finestra in base allo Spazio, scorri per cambiare; aggiungi, rinomina, cambia icona e gusto, riordina ed elimina Spazi; scegli i contenitori. |
| **Schede** | Archiviazione automatica, schede in sospensione, ripristino all'avvio, anteprime, gruppi di schede, vista divisa, Picture‑in‑Picture automatico, conferma prima di uscire. |
| **Archivio** | Cerca, riapri e rimuovi schede archiviate; svuota l'archivio. |
| **Privacy e sicurezza** | Protezione antitracciamento Bilanciata/Restrittiva, uBlock Origin con un clic, modalità solo HTTPS, DNS sicuro (Cloudflare, Quad9, Mullvad, NextDNS, AdGuard…), Global Privacy Control, protezione dal fingerprinting, cancellazione della cronologia alla chiusura, blocco dei pop‑up. |
| **Ricerca** | Motore di ricerca predefinito, suggerimenti, ricerche di tendenza, gestione dei motori. |
| **Scorciatoie** | Tutte le scorciatoie di Lokum, con un interruttore per disattivarle se entrano in conflitto con un sito. |
| **Lingua** | Lingua dell'interfaccia (dodici incluse), controllo ortografico, lingue preferite per i siti web. |
| **Aggiornamenti** | Versione attuale, controlla ora, controlli e installazioni automatici, canale stabile/beta, intervallo, note di rilascio, tutte le versioni. |
| **Avanzate** | Browser predefinito, importazione da un altro browser, tour di benvenuto, esportazione/importazione delle impostazioni di Lokum (JSON), cartella del profilo, ripristino delle impostazioni di Lokum, scorrimento fluido, `userChrome.css` personalizzato, tutte le impostazioni di Firefox, `about:config`. |
| **Informazioni su Lokum** | Versione, motore Firefox, data di compilazione, piattaforma, profilo; link per segnalare un problema, note di rilascio e licenze. |

<p align="center">
  <img src="../images/screenshots/settings-updates.webp" alt="La sezione Aggiornamenti delle impostazioni di Lokum" width="80%">
</p>

Tutto ciò che offre Firefox resta a un clic nelle **impostazioni di Firefox**
(`about:preferences`).

---

## Privacy

Lokum parte privato e resta tale:

- **Nessuna telemetria, nessuno studio, nessun segnalatore di arresti anomali, nessun agente del browser predefinito.** Sono disattivati tramite criteri aziendali (`distribution/policies.json`) e rimossi dal pacchetto.
- **Nessun contenuto sponsorizzato** — nessuna scorciatoia o storia sponsorizzata nella pagina Nuova scheda, niente Pocket, nessuna estensione o funzione «consigliata».
- **Protezione antitracciamento avanzata** in modalità *Bilanciata* per impostazione predefinita, *Restrittiva* a un clic.
- **uBlock Origin** si installa con un clic dal tour di benvenuto o dalle impostazioni.
- Preimpostazioni di **DNS sicuro**, modalità **solo HTTPS**, **Global Privacy Control**, **protezione dal fingerprinting** e **cancellazione alla chiusura** nella sezione Privacy.

A cosa si collega Lokum stesso: `github.com` / `api.github.com` per cercare
aggiornamenti (disattivabile in **Impostazioni → Aggiornamenti**). Tutto il
resto è il normale comportamento di Firefox — per esempio gli elenchi di
Navigazione sicura, i dati di revoca dei certificati e il catalogo dei
componenti aggiuntivi — che puoi gestire nelle impostazioni di privacy di
Firefox.

---

## Lingue

Lokum include dodici lingue e al primo avvio usa quella scelta nel programma di
installazione o la lingua del sistema operativo. Cambiala quando vuoi in
**Impostazioni → Lingua** (un riavvio completa il cambio ovunque).

| Lingua | Codice | | Lingua | Codice |
| --- | --- | --- | --- | --- |
| Inglese (English) | `en` | | Spagnolo (Español) | `es-ES` |
| Turco (Türkçe) | `tr` | | Svedese (Svenska) | `sv-SE` |
| Tedesco (Deutsch) | `de` | | Coreano (한국어) | `ko` |
| Francese (Français) | `fr` | | Giapponese (日本語) | `ja` |
| Italiano | `it` | | Cinese semplificato (简体中文) | `zh-CN` |
| Romancio (Rumantsch) | `rm` | | Cinese tradizionale (繁體中文) | `zh-TW` |

L'interfaccia di Firefox proviene dai pacchetti linguistici ufficiali di
Mozilla, che la compilazione integra nell'applicazione; le aggiunte di Lokum
(barra laterale, impostazioni, tour di benvenuto, aggiornamenti…) usano piccoli
dizionari JSON in `src/lokum/locales/`. Un test verifica che ogni dizionario sia
completo e mantenga gli stessi `{segnaposto}` dell'inglese. Il programma di
installazione per Windows è disponibile in tutte queste lingue tranne il
romancio.

---

## Aggiornamenti automatici

1. Ogni sei ore (configurabile) Lokum scarica il piccolo file `latest.json` dell'ultima versione su GitHub.
2. Se c'è una versione più recente, nella barra laterale compare una scheda e il programma di installazione si scarica in background — solo dai server di download delle versioni di GitHub.
3. Il **SHA‑256** del file viene confrontato con `latest.json`; tutto ciò che non corrisponde viene scartato.
4. Quando chiudi Lokum, l'aggiornamento si installa in silenzio in background. Alla successiva apertura sei sulla nuova versione e un avviso *«Lokum è stato aggiornato»* porta alle note di rilascio. **Riavvia e aggiorna** installa subito e riapre Lokum.

Scegli il canale **Stabile** o **Beta**, l'intervallo di controllo, oppure
disattiva l'installazione automatica in **Impostazioni → Aggiornamenti**.
L'edizione zip portatile si limita ad avvisarti. L'aggiornamento di Firefox di
Mozilla è disattivato — le versioni di Lokum portano il nuovo Firefox per te.

---

## Scorciatoie da tastiera

| Scorciatoia | Azione |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>K</kbd> | Tavolozza dei comandi |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd> | Mostra / nascondi la barra laterale (modalità compatta) |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>→</kbd> / <kbd>←</kbd> | Spazio successivo / precedente |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>1</kbd> … <kbd>9</kbd> | Vai allo Spazio 1–9 |
| <kbd>Ctrl</kbd>+<kbd>Maiusc</kbd>+<kbd>C</kbd> | Copia il link della pagina |
| <kbd>Ctrl</kbd>+<kbd>,</kbd> | Impostazioni di Lokum |
| <kbd>Ctrl</kbd>+<kbd>T</kbd> | Nuova scheda |
| <kbd>Ctrl</kbd>+<kbd>L</kbd> | Barra degli indirizzi (barra dei comandi fluttuante) |
| <kbd>Ctrl</kbd>+<kbd>Maiusc</kbd>+<kbd>T</kbd> | Riapri la scheda chiusa |

Tutte le altre scorciatoie di Firefox funzionano come sempre. Le scorciatoie di
Lokum si possono disattivare in **Impostazioni → Scorciatoie**.

---

## Installazione

### Windows (programma di installazione)

1. Scarica `Lokum-Setup-<versione>-x64.exe` dall'[ultima versione](https://github.com/SametEge/Lokum/releases/latest).
2. Avvialo (vedi la nota su SmartScreen qui sopra), scegli la lingua, se vuoi un collegamento sul desktop e se rendere Lokum il browser predefinito, poi fai clic su **Installa**.
3. Lokum si installa in `%LOCALAPPDATA%\Programs\Lokum` — per utente, senza diritti di amministratore — e si registra come browser, così puoi sceglierlo in **Impostazioni di Windows → App predefinite**.

Opzioni da riga di comando per installazioni automatizzate:

| Opzione | Significato |
| --- | --- |
| `/S` | Installazione silenziosa |
| `/D=C:\percorso\Lokum` | Cartella di installazione (deve essere l'ultima) |
| `/DESKTOP=0` | Nessun collegamento sul desktop (predefinito `1`) |
| `/UPDATE` | Aggiorna un'installazione esistente (usato dall'aggiornamento) |
| `/RELAUNCH` | Avvia Lokum al termine |

Per disinstallare usa **Impostazioni di Windows → App → Lokum**. Il programma
di disinstallazione chiede se conservare il profilo (segnalibri, password,
cronologia) o rimuovere anche quello.

### Windows (portatile)

Estrai `Lokum-<versione>-win64.zip` ovunque e avvia `lokum.exe`. L'edizione
portatile non tocca il registro e si limita ad avvisarti degli aggiornamenti.

### Linux

```sh
tar -xJf Lokum-<versione>-linux-x86_64.tar.xz
cd lokum
./lokum                      # avvia
./install-desktop-entry.sh   # facoltativo: aggiunge Lokum al menu delle applicazioni
```

### Dove sono i tuoi dati

Lokum usa un profilo proprio, separato da qualsiasi Firefox installato.
**Impostazioni → Avanzate → Cartella del profilo** lo apre. I dati specifici di
Lokum (Spazi, archivio delle schede) si trovano nella cartella `lokum` del
profilo.

---

## Compilare dai sorgenti

Lokum non compila Firefox. La compilazione scarica una **versione ufficiale di
Firefox** da `archive.mozilla.org`, la verifica con i `SHA512SUMS` di Mozilla e
la trasforma in Lokum. Una compilazione completa per Windows richiede pochi
minuti su un computer normale, e i pacchetti Windows si possono creare su
Linux.

**Requisiti**

- Python 3.10+
- Node.js 20+ (riscrive icone e informazioni di versione di `lokum.exe` con [resedit](https://github.com/jet2jet/resedit-js))
- `7z` (p7zip) per estrarre il programma di installazione di Firefox per Windows, `tar` e `xz`
- NSIS 3 (`makensis`) per il programma di installazione di Windows

Su Ubuntu/Debian: `sudo apt install python3 nodejs npm p7zip-full nsis xz-utils`

**Compilare**

```sh
git clone https://github.com/SametEge/Lokum.git
cd Lokum
npm ci --prefix scripts/pe          # una volta, per le build Windows

# Programma di installazione Windows + zip portatile dall'ultimo Firefox
python3 scripts/build.py --platform win64

# Archivio Linux su una versione specifica di Firefox
python3 scripts/build.py --platform linux-x86_64 --firefox-version 156.0
```

I risultati finiscono in `dist/`. Opzioni utili:

| Opzione | Significato |
| --- | --- |
| `--platform {win64,win-arm64,linux-x86_64}` | Piattaforma di destinazione |
| `--firefox-version X` | Versione di Firefox di base (predefinita: fissata in `firefox.json`, altrimenti l'ultima) |
| `--version X` | Versione di Lokum (predefinita: `version.json` + `-dev`) |
| `--firefox-dir CARTELLA` | Usa un Firefox già estratto invece di scaricarlo |
| `--no-locales` | Salta i pacchetti linguistici (più veloce) |
| `--no-installer` | Salta NSIS |
| `--app-only` | Fermati dopo aver preparato la cartella dell'applicazione |

**Sviluppare con un Firefox estratto**

```sh
scripts/dev/install.sh /percorso/firefox        # copia dentro lo strato di Lokum
/percorso/firefox/firefox --profile /tmp/lokum-dev --no-remote
```

La maggior parte delle modifiche a `src/lokum` richiede solo il riavvio del
browser.

**Test**

```sh
node --test "tests/unit/*.test.mjs"      # logica di base, contrasto dei gusti
python3 tests/check_locales.py --strict  # dizionari completi
node scripts/dev/make_content_css.mjs --check
LOKUM_SELFTEST=out.json ./lokum --headless   # 25 controlli nel browser
```

`LOKUM_SELFTEST` fa eseguire a un vero Lokum un autotest (layout, Spazi, gusti,
tavolozza dei comandi, pagine di impostazioni e di benvenuto, lingue, marchio,
aggiornamenti e criteri), scrivere il risultato in JSON e uscire. La CI lo
esegue su Windows e Linux dopo aver installato i pacchetti appena compilati.

---

## Come funziona Lokum

```
versione ufficiale di Firefox ──► verifica SHA512 ──► estrai
        │
        ├─ integra 11 pacchetti linguistici Mozilla in omni.ja (+ elenco multilingua)
        ├─ sostituisci il marchio Firefox (nomi, loghi, icone) con quello di Lokum
        ├─ aggiungi lo strato di Lokum:  defaults/pref/lokum-autoconfig.js
        │                                lokum.cfg  (avvio autoconfig)
        │                                distribution/policies.json
        │                                browser/lokum/  (pacchetto chrome://lokum)
        ├─ rimuovi aggiornamento, segnalatore di arresti, telemetria
        ├─ firefox.exe → lokum.exe, nuove icone e informazioni di versione
        └─ impacchetta: programma di installazione NSIS · zip portatile · archivio Linux
```

All'avvio Firefox legge `lokum-autoconfig.js`, che carica `lokum.cfg`. Questo
piccolo avvio registra il pacchetto `chrome://lokum/` e avvia
`LokumStartup.sys.mjs`, che collega tutto il resto:

| Modulo | Compito |
| --- | --- |
| `LokumStartup` | Avvio/chiusura, tour di benvenuto, avviso «aggiornato», autotest |
| `LokumWindow` | Controller per finestra: fogli di stile, attributi radice, striscia del titolo, modalità compatta, barra dei comandi fluttuante, scorciatoie |
| `LokumFlavors` | Le dodici tavolozze come variabili CSS `light-dark()` |
| `LokumLayout` | Traduce il layout di Lokum nelle preferenze di Firefox (barra laterale, schede verticali) e nella disposizione delle barre degli strumenti |
| `LokumSpaces` | Spazi: salvataggio, cambio, intestazione e piè della barra laterale, menu, trascinamento |
| `LokumTabs` | Archiviazione automatica e schede in sospensione |
| `LokumCommandPalette` | Tavolozza <kbd>Ctrl</kbd>+<kbd>K</kbd> |
| `LokumMediaCard` | Mini lettore della barra laterale |
| `LokumUpdater` | Controllo degli aggiornamenti, download verificati, installazione silenziosa all'uscita |
| `LokumI18n` | Dizionari di Lokum e scelta della lingua al primo avvio |
| `LokumShell` | Integrazione con Windows come browser predefinito |
| `LokumContentStyles` | Veste la pagina Nuova scheda e le impostazioni di Firefox del gusto attivo |
| `LokumAboutPages` | `about:lokum` (impostazioni) e `about:lokum-welcome` (tour) |
| `LokumSelfTest` | Autotest nel browser usato dalla CI |

Struttura del repository:

```
src/app/            file copiati accanto all'eseguibile di Firefox (autoconfig, criteri)
src/lokum/          il pacchetto chrome://lokum
  modules/          moduli JavaScript (sopra)
  styles/           stili dell'interfaccia (token, cornice, layout, componenti, animazioni)
  pages/            impostazioni about:lokum e tour di benvenuto
  locales/          dizionari di Lokum (12 lingue)
  images/           icone e loghi
scripts/build.py    la compilazione (vedi scripts/lokumbuild/)
scripts/release.py  pianificazione delle versioni, latest.json, note di rilascio
scripts/pe/         risorse dell'eseguibile Windows (resedit)
installer/          programma di installazione NSIS e traduzioni
branding/           sorgenti del logo e icone generate
tests/              test unitari, controllo delle lingue, smoke test
.github/workflows/  CI, compilazioni e pubblicazioni automatiche
```

---

## Versioni e integrazione continua

- **Ogni pull request e ogni push su un ramo** esegue i test unitari e linguistici, compila i pacchetti Windows e Linux, li installa su vere macchine Windows e Linux ed esegue l'autotest nel browser.
- **Ogni push su `main`** fa lo stesso e poi pubblica una **nuova versione su GitHub** con programma di installazione, zip portatile, archivio Linux, `latest.json`, `SHA256SUMS.txt` e note di rilascio generate. Le copie installate si aggiornano da lì.
- **Ogni sei ore** un'attività pianificata chiede a Mozilla l'ultima versione di Firefox; se è più recente di quella dell'ultima pubblicazione, Lokum viene ricompilato su di essa e pubblicato automaticamente — così le correzioni di sicurezza ti arrivano senza che nessuno muova un dito.
- Le pubblicazioni si possono avviare anche a mano (**Actions → Release → Run workflow**), eventualmente su una versione di Firefox scelta o come pre‑release beta.

I numeri di versione vengono da `version.json`; ogni pubblicazione incrementa
automaticamente il numero di patch. Se serve, fissa una versione di Firefox con
un file `firefox.json` (`{"version": "156.0"}`).

---

## Domande frequenti

**Lokum è un fork di Firefox?**
Non nel senso di un motore separato. Lokum ri‑impacchetta le build ufficiali di
Firefox di Mozilla e aggiunge un proprio strato di interfaccia: ottieni
esattamente il motore, le prestazioni, la compatibilità web e le correzioni di
sicurezza di Firefox.

**Le estensioni di Firefox funzionano?**
Sì — tutti i componenti aggiuntivi di [addons.mozilla.org](https://addons.mozilla.org) funzionano.

**Posso usare Firefox Sync?**
Sì. Accedi da **Impostazioni di Firefox → Sync** per sincronizzare segnalibri,
password, cronologia, schede e componenti aggiuntivi con Firefox sugli altri
dispositivi.

**Lokum modifica o legge il mio Firefox esistente?**
No. Lokum ha un profilo proprio. Usa il passaggio di importazione (o
**Impostazioni → Avanzate → Importa**) se vuoi trasferire i tuoi dati.

**Perché l'antivirus / SmartScreen mi avvisa?**
Il programma di installazione non ha ancora una firma del codice. Confronta il
file con `SHA256SUMS.txt` nella pagina della versione, oppure compila Lokum da te.

**Esiste una versione per macOS?**
Non ancora. Windows e Linux vengono compilati e testati a ogni modifica.

**Dopo un aggiornamento qualcosa non va. Come ripristino?**
**Impostazioni → Avanzate → Ripristina le impostazioni di Lokum** riporta ogni
opzione di Lokum al valore predefinito ma conserva schede, Spazi e dati.

---

## Contribuire

Segnalazioni di bug, idee, traduzioni e pull request sono benvenute.

- Segnala bug e idee nelle [Issues](https://github.com/SametEge/Lokum/issues).
- Per migliorare una traduzione modifica `src/lokum/locales/<codice>.json` (e `installer/strings.nsh` per il programma di installazione) ed esegui `python3 tests/check_locales.py --strict`.
- Per aggiungere un gusto, aggiungi una tavolozza in `src/lokum/modules/LokumFlavors.sys.mjs`, nome e descrizione in ogni dizionario, poi esegui `node scripts/dev/make_content_css.mjs` e i test unitari (controllano il contrasto).
- Esegui i test qui sopra prima di aprire una pull request.

---

## Licenza e marchi

Il codice sorgente di Lokum è distribuito con la
[Mozilla Public License 2.0](../../LICENSE), la stessa licenza di Firefox.

Firefox e il logo di Firefox sono marchi della Mozilla Foundation. Lokum è un
progetto indipendente, non affiliato né approvato da Mozilla; è costruito a
partire dalle versioni ufficiali di Mozilla e ne rimuove il marchio Firefox.
Arc è un marchio di The Browser Company, anch'essa non affiliata a Lokum — Lokum
si ispira semplicemente alle sue idee. uBlock Origin è opera di Raymond Hill e
dei suoi collaboratori.

<p align="center"><sub>Fatto con 🍬 e Firefox.</sub></p>
