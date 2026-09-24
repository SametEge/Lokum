<p align="center">
  <img src="../images/banner-tr.png" alt="Lokum — Hızlı · Güçlü · Verilerinizi çalmaz" width="820">
</p>

<p align="center">
  <a href="../../README.md">English</a> ·
  <b>Türkçe</b> ·
  <a href="README.de.md">Deutsch</a> ·
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
  <a href="https://github.com/SametEge/Lokum/releases/latest"><img alt="Son sürüm" src="https://img.shields.io/github/v/release/SametEge/Lokum?label=indir&color=d23c78"></a>
  <a href="https://github.com/SametEge/Lokum/releases"><img alt="İndirme" src="https://img.shields.io/github/downloads/SametEge/Lokum/total?label=indirme&color=f1a2c2"></a>
  <img alt="Windows 10/11" src="https://img.shields.io/badge/Windows-10%20%7C%2011-6a46d8">
  <img alt="Linux x86-64" src="https://img.shields.io/badge/Linux-x86--64-55852a">
  <a href="../../LICENSE"><img alt="MPL 2.0" src="https://img.shields.io/badge/lisans-MPL%202.0-8a7141"></a>
</p>

**Lokum**, Mozilla Firefox üzerine kurulu, Türk lokumu tadında bir web
tarayıcısıdır. Zaten güvendiğiniz motoru, güvenliği ve eklentileri alır;
onları Arc tarzı bir kenar çubuğuna, elle karıştırılmış on iki renk
"lezzetine", Alanlar'a (Spaces), bir komut paletine, yumuşak animasyonlara ve
alışılmadık derecede ayrıntılı bir ilk kurulum deneyimine sarar — on iki dilde.
Yeni bir sürüm hazır olduğu anda kendini GitHub Releases üzerinden sessizce
günceller.

<p align="center">
  <img src="../images/screenshots/arc-light.webp" alt="Arc tarzı kenar çubuğu ve Gül lezzetiyle Lokum" width="49%">
  <img src="../images/screenshots/arc-dark.webp" alt="Gece lezzetiyle karanlık modda Lokum" width="49%">
</p>

---

## İçindekiler

<!-- toc -->
- [İndir](#i̇ndir)
- [Öne çıkanlar](#öne-çıkanlar)
- [Lezzetler](#lezzetler)
- [Düzenler: kenar çubuğu ya da klasik sekmeler](#düzenler-kenar-çubuğu-ya-da-klasik-sekmeler)
- [Alanlar](#alanlar)
- [Komut paleti ve komut çubuğu](#komut-paleti-ve-komut-çubuğu)
- [Kendini toparlayan sekmeler](#kendini-toparlayan-sekmeler)
- [Karşılama turu](#karşılama-turu)
- [Ayarlar](#ayarlar)
- [Gizlilik](#gizlilik)
- [Diller](#diller)
- [Otomatik güncellemeler](#otomatik-güncellemeler)
- [Klavye kısayolları](#klavye-kısayolları)
- [Kurulum](#kurulum)
- [Kaynaktan derleme](#kaynaktan-derleme)
- [Lokum nasıl çalışır](#lokum-nasıl-çalışır)
- [Sürümler ve sürekli entegrasyon](#sürümler-ve-sürekli-entegrasyon)
- [SSS](#sss)
- [Katkıda bulunma](#katkıda-bulunma)
- [Lisans ve ticari markalar](#lisans-ve-ticari-markalar)
<!-- /toc -->

---

## İndir

En yeni sürümü **[Sürümler sayfasından](https://github.com/SametEge/Lokum/releases/latest)** indirin.

| Dosya | Kimin için | Notlar |
| --- | --- | --- |
| `Lokum-Setup-<sürüm>-x64.exe` | Windows 10 / 11 (64 bit) | **Önerilen.** Yalnızca sizin kullanıcınıza kurulur, yönetici izni gerekmez, kendini günceller. |
| `Lokum-<sürüm>-win64.zip` | Windows, taşınabilir | Herhangi bir yere (USB belleğe bile) açın ve `lokum.exe`'yi çalıştırın. Güncellemeleri size haber verir. |
| `Lokum-<sürüm>-linux-x86_64.tar.xz` | Linux (64 bit) | Açın ve `./lokum` ile çalıştırın; `install-desktop-entry.sh` uygulama menünüze ekler. |
| `latest.json`, `SHA256SUMS.txt` | Herkes | Yerleşik güncelleyicinin kullandığı güncelleme bildirimi ve tüm dosyaların SHA‑256 özetleri. |

> **Windows SmartScreen.** Lokum henüz kod imzalı değil (sertifikalar bir hobi
> projesi için pahalı), bu yüzden Windows ilk açılışta *"Windows bilgisayarınızı
> korudu"* diyebilir. **Ek bilgi → Yine de çalıştır**'a tıklayın. Dosyayı her
> zaman sürüm sayfasındaki `SHA256SUMS.txt` ile karşılaştırabilirsiniz.

---

## Öne çıkanlar

- 🍬 **On iki lezzet** — her tema bir lokum çeşidi: Gül, Fıstık, Limon, Nar, Portakal, Nane, Lavanta, Sakız, Hindistan cevizi, Türk kahvesi, Gece ve hareketli bir *Karışık* kutusu. Her birinin açık ve koyu tarifi var.
- 🧭 **Arc tarzı kenar çubuğu _ya da_ klasik sekmeler** — adres çubuğunun içinde olduğu tam boy bir kenar çubuğu, Firefox'un dikey sekmeleri veya klasik sekme şeridi. İstediğiniz an değiştirin; pencere canlı olarak yeniden düzenlenir.
- 🗂️ **Alanlar** — Kişisel, İş, Okul ve Eğlence'yi ayırın; her birinin kendi sekmeleri, simgesi, lezzeti ve (isteğe bağlı) kapsayıcısı olur. Kaydırarak ya da <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>←</kbd>/<kbd>→</kbd> ile geçiş yapın.
- ⌨️ **Komut paleti** (<kbd>Ctrl</kbd>+<kbd>K</kbd>) — açık sekmeler ve 40'tan fazla işlem arasında bulanık arama; adres çubuğuna odaklandığınızda da büyük bir **yüzen komut çubuğu**.
- 🎵 **Mini oynatıcı** — diğer sekmelerdeki müziği veya videoları kenar çubuğundan oynatın/duraklatın, geçin ve sessize alın.
- 🧹 **Kendini toparlayan sekmeler** — bir süredir açmadığınız sekmeleri otomatik arşivleyin, arka plandaki sekmeleri uyutun ve her şeyi Arşiv'den geri açın.
- 🌟 **Eşi görülmemiş bir karşılama turu** — lezzetinizi şekerli 3D lokum küplerini düşürerek seçin, sihirbazın arkasında tarayıcının yeniden düzenlenmesini izleyin, hazır şablonlardan Alanlar oluşturun, eski tarayıcınızı içe aktarın ve gizlilik seviyenizi seçin. Konfeti dahil.
- ⚙️ **Kullanması keyifli bir ayarlar sayfası** — on iki bölüm, anında arama, canlı önizlemeler, Lokum ayarlarınızı dışa/içe aktarma.
- 🔒 **Varsayılan olarak gizli** — telemetri yok, çalışma (study) yok, sponsorlu içerik yok; katı izleme koruması bir tık uzakta; uBlock Origin, Güvenli DNS, Yalnızca HTTPS, GPC ve parmak izi koruması ayarların içinde.
- 🌍 **On iki dil** — İngilizce, Türkçe, Almanca, Fransızca, İtalyanca, Romanşça, İspanyolca, İsveççe, Korece, Japonca, Basitleştirilmiş ve Geleneksel Çince; hem Lokum hem Firefox'un kendisi için.
- 🔄 **Otomatik güncellemeler** — yeni sürümler her değişiklikte ve Mozilla yeni bir Firefox yayımladığında GitHub Actions tarafından derlenir, ardından Lokum'u kapattığınızda sessizce kurulur.
- 🦊 **İçinde gerçek Firefox** — resmi Mozilla derlemeleri, Gecko motoru, tüm Firefox eklentileri, Firefox Sync ve Mozilla'nın güvenlik düzeltmeleri yayımlandığı anda.

---

## Lezzetler

Bir lezzet tüm tarayıcıyı renklendirir: pencere çerçevesini, kenar çubuğunu,
düğmelerin ve anahtarların vurgu rengini, yeni sekme sayfasını ve Lokum'un kendi
sayfalarını. Her lezzetin açık ve koyu bir tarifi vardır ve vurgu rengini
istediğiniz herhangi bir renkle değiştirebilirsiniz. Alanların kendi lezzeti
olabilir; böylece alan değiştirdiğinizde pencerenin rengi de değişir.

| | Lezzet | Havası |
| --- | --- | --- |
| 🌹 | **Gül** | Klasik gül suyu lokumu, pembe yanaklı. *(varsayılan)* |
| 🌰 | **Fıstık** | Taze fıstık yeşili, sakin ve odaklı. |
| 🍋 | **Limon** | Aydınlık sabahlar için güneşli limon kabuğu. |
| 🍎 | **Nar** | Koyu nar kırmızısı, cesur ve sulu. |
| 🍊 | **Portakal** | Portakal ve bergamotun sıcak parıltısı. |
| 🌿 | **Nane** | Serin nane, bahar esintisi kadar ferah. |
| 💜 | **Lavanta** | Hayalperest öğleden sonralar için yumuşak lavanta. |
| 🤍 | **Sakız** | Kremsi sakız fildişi, sakin ve zarif. |
| 🥥 | **Hindistan cevizi** | Hindistan cevizi beyazı, temiz ve sade. |
| ☕ | **Türk kahvesi** | Türk kahvesinin zengin kahverengileri. |
| 🌙 | **Gece** | Gece kuşları için yıldızlı gece eriği. |
| 🎨 | **Karışık** | Yavaşça tüm renklerin arasında süzülen bir kutu karışık lokum. |

Her palet test paketi tarafından denetlenir: metin, çerçevesi üzerinde WCAG
4.5:1 kontrastına, vurgu düğmeleri ise hem açık hem koyu modda 3:1'e ulaşmak
zorundadır.

Açıp kapatabileceğiniz ek dokunuşlar: **pudra şekeri** (kenar çubuğunda
parıldayan minik ışıltılar), **yumuşak doku** (ince bir kâğıt dokusu), sayfanın
yuvarlak köşeleri, çerçeve boşluğu, sayfa gölgesi, arayüz yoğunluğu (sıkı /
normal / rahat), arayüz yazı tipi (sistem / yuvarlak / serif) ve üç animasyon
seviyesi (tam, azaltılmış — renkler geçiş yapar ama hiçbir şey hareket etmez —
veya kapalı). Lokum sisteminizin *hareketi azalt* ayarına da uyar.

<p align="center">
  <img src="../images/screenshots/settings-appearance.webp" alt="On iki lezzet küpüyle Lokum Ayarları'nın Görünüm bölümü" width="80%">
</p>

---

## Düzenler: kenar çubuğu ya da klasik sekmeler

| Düzen | Nasıl görünür |
| --- | --- |
| **Kenar çubuğu (Arc tarzı)** *(varsayılan)* | Sekmeler, adres çubuğu ve gezinme düğmeleri tam boy tek bir kenar çubuğunda yaşar. Sayfa, lezzetinizin üzerinde yuvarlak bir kart olarak süzülür; üstünde sayfa başlığını, siteyi ve *bağlantıyı kopyala* düğmesini gösteren ince bir başlık şeridi bulunur. |
| **Dikey sekmeler** | Firefox'un yerleşik dikey sekmeleri kenar çubuğunda, adres çubuğu üstte. Tanıdık ve ferah. |
| **Klasik sekmeler** | Bildiğiniz her tarayıcı gibi sekmeler üstte — yine lezzetinizle giydirilmiş. |

<p align="center">
  <img src="../images/screenshots/classic-tabs.webp" alt="Klasik sekmeler ve Fıstık lezzetiyle Lokum" width="80%">
</p>

Diğer düzen seçenekleri:

- **Kenar çubuğu tarafı** — sol veya sağ.
- **Kenar çubuğunu gizle (kompakt mod)** — <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd>. Sayfa tüm pencereyi kaplar; imleciniz pencere kenarına değdiğinde kenar çubuğu kayarak gelir.
- **Yüzen komut çubuğu** — adres çubuğu, Arc'taki gibi sayfanın üstünde büyük ve ortalanmış açılır.
- **Yeni sekmeler** listenin üstünde veya altında açılır.
- **Sekme kapatma düğmesi** üzerine gelince, her zaman veya hiçbir zaman.
- **Sabitlenmiş sekmeler favori olur** — kenar çubuğunun üstünde, her Alan'da aynı kalan büyük simgelerden bir ızgara.
- **Yer imleri araç çubuğu**, **mini oynatıcı** ve **araç çubuğunu özelleştirme**.

---

## Alanlar

Alanlar hayatınızın farklı parçalarını birbirinden ayrı tutar. Her Alan'ın kendi
sekme listesi, bir adı, bir emoji simgesi, içindeyken pencereyi yeniden
renklendiren isteğe bağlı bir lezzeti ve isteğe bağlı bir Firefox
**kapsayıcısı** vardır; böylece örneğin İş alanınız iş hesaplarınızda oturum
açık kalır.

- Kenar çubuğunun altındaki simgelerle, kenar çubuğunda **yana kaydırarak** (veya <kbd>Shift</kbd> + fare tekerleği), <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>←</kbd>/<kbd>→</kbd> ile geçin ya da <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>1</kbd>…<kbd>9</kbd> ile doğrudan birine atlayın.
- Bir sekmeyi taşımak için **bir Alan simgesinin üzerine sürükleyin** veya sekmenin sağ tık menüsündeki *Alana taşı*'yı kullanın.
- Alan adına sağ tıklayarak yeniden adlandırın, simgesini, lezzetini veya kapsayıcısını değiştirin, sekmelerini temizleyin ya da Alan oluşturup silin.
- Sıralama dahil her şeyi **Ayarlar → Alanlar**'dan yönetin.
- Alanlar profilinize (`lokum/spaces.json`) kaydedilir ve her sekme yeniden başlatmalarda da kendi Alanını hatırlar.

<p align="center">
  <img src="../images/screenshots/spaces.webp" alt="Nane lezzetiyle renklenen İş alanı" width="80%">
</p>

---

## Komut paleti ve komut çubuğu

Her yerde <kbd>Ctrl</kbd>+<kbd>K</kbd>'ye basın. Birkaç harf yazın; Lokum açık
sekmeleri ve işlemleri bulanık eşleştirmeyle bulur: yeni sekme/pencere/gizli
pencere, kapatılan sekmeyi yeniden aç, çoğalt, sabitle, bağlantıyı kopyala, son
sekmeyle **bölünmüş görünüm**, okuyucu görünümü, Görüntü içinde görüntü, ekran
görüntüsü, bul, yazdır, yakınlaştır, indirmeler, geçmiş, yer imleri, eklentiler,
geliştirici araçları, yakın geçmişi temizle, karanlık mod, her düzen, her
lezzet, her Alan ve Lokum ya da Firefox ayarları. Geri kalan her şey bir web
aramasına dönüşür.

<p align="center">
  <img src="../images/screenshots/command-palette.webp" alt="Sayfanın üzerinde komut paleti" width="49%">
  <img src="../images/screenshots/command-bar.webp" alt="Yüzen komut çubuğu" width="49%">
</p>

Kenar çubuğu düzeninde adres çubuğuna tıkladığınızda (veya
<kbd>Ctrl</kbd>+<kbd>L</kbd>'ye bastığınızda) pencerenin ortasında büyük bir
**yüzen komut çubuğuna** dönüşür — Firefox'un tüm önerileri, arama kısayolları
ve geçmişiyle, rahat nefes alacak alanla.

---

## Kendini toparlayan sekmeler

- **Otomatik arşiv** — 12 saat, bir gün, bir hafta veya bir ay boyunca açmadığınız sabitlenmemiş sekmeler kapatılır ve **Arşiv**'de saklanır (600 sekmeye kadar). **Ayarlar → Arşiv**'den veya kenar çubuğundaki kitaplık düğmesinden arayıp istediğinizi geri açın.
- **Uyuyan sekmeler** — arka plandaki sekmeler, bellek ve pilden tasarruf için belirli bir dakikadan sonra boşaltılabilir; tıkladığınızda geri gelirler.
- **Mini oynatıcı** — bir sekme medya oynatırken kenar çubuğundaki küçük bir kart kapak görselini, başlığı ve sanatçıyı önceki / oynat‑duraklat / sonraki ve sessiz düğmeleriyle gösterir.
- Ve Firefox'un getirdiği her şey: **sekme grupları**, **bölünmüş görünüm**, üzerine gelince sekme önizlemeleri, otomatik **Görüntü içinde görüntü** ve oturumu geri yükleme.

---

## Karşılama turu

Lokum'u ilk kez başlattığınızda tarayıcının üzerinde tam ekran bir karşılama
turu açılır — ve siz seçtikçe tarayıcı arkada canlı olarak değişir.

<p align="center">
  <img src="../images/screenshots/welcome-flavor.webp" alt="Karşılama turu: lezzetinizi seçin" width="49%">
  <img src="../images/screenshots/welcome-layout.webp" alt="Karşılama turu: düzeninizi seçin" width="49%">
</p>

1. **Hoş geldiniz** — süzülen 3D bir lokum küpü, uçuşan şeker ve dil seçici.
2. **Lezzet** — on iki şekerli küp bir tepsiye düşer; birine dokunun, tüm tarayıcı bir pudra şekeri patlamasıyla renk değiştirir. Açık, koyu veya otomatiği seçin ya da lezzet ruleti için **Beni şaşırt**'a basın.
3. **Düzen** — Arc tarzı kenar çubuğu, dikey sekmeler veya klasik sekmeler; kenar çubuğu tarafı ve kompakt mod, canlı önizlemeyle.
4. **Alanlar** — Kişisel ile başlayın; İş, Okul ve Eğlence şablonlarını tek dokunuşla ekleyin.
5. **İçe aktar** — Lokum bilgisayarınızdaki diğer tarayıcıları (Chrome, Edge, Brave, Opera, Vivaldi…) algılar; yer imlerini, parolaları, geçmişi ve daha fazlasını taşır.
6. **Gizlilik** — Dengeli veya Katı izleme koruması, uBlock Origin, Güvenli DNS; telemetri her zaman kapalı.
7. **Bitti** — seçimlerinizin özeti, *Lokum'u varsayılan tarayıcım yap* ve konfeti.

Turu dilediğiniz zaman **Ayarlar → Gelişmiş → Karşılama turu**'ndan yeniden
başlatabilirsiniz.

---

## Ayarlar

**Lokum Ayarları**'nı <kbd>Ctrl</kbd>+<kbd>,</kbd> ile, ana menüden, kenar
çubuğundan veya `about:lokum` yazarak açın. Her seçenek anında uygulanır ve
arama kutusu herhangi bir ayarı adıyla bulur.

| Bölüm | Neler yapabilirsiniz |
| --- | --- |
| **Görünüm** | Lezzet galerisi, açık/koyu/otomatik, özel vurgu rengi, pudra şekeri, doku, animasyonlar, köşe yuvarlaklığı, çerçeve boşluğu, sayfa gölgesi, yoğunluk, arayüz yazı tipi. |
| **Düzen** | Arc kenar çubuğu / dikey / klasik, kenar çubuğu tarafı, kompakt mod, yüzen komut çubuğu, yeni sekme konumu, kapatma düğmeleri, mini oynatıcı, yer imleri araç çubuğu, araç çubuğunu özelleştirme. |
| **Alanlar** | Alanları açma/kapama, pencereyi alana göre renklendirme, kaydırarak geçiş; Alan ekleme, yeniden adlandırma, simge ve lezzet değiştirme, sıralama ve silme; kapsayıcı seçme. |
| **Sekmeler** | Otomatik arşiv, uyuyan sekmeler, başlangıçta geri yükleme, sekme önizlemeleri, sekme grupları, bölünmüş görünüm, otomatik Görüntü içinde görüntü, çıkmadan önce onay. |
| **Arşiv** | Arşivlenmiş sekmeleri arama, geri açma ve kaldırma; arşivi boşaltma. |
| **Gizlilik ve Güvenlik** | Dengeli/Katı izleme koruması, tek tıkla uBlock Origin, Yalnızca HTTPS modu, Güvenli DNS (Cloudflare, Quad9, Mullvad, NextDNS, AdGuard…), Global Privacy Control, parmak izi koruması, çıkışta geçmişi temizleme, açılır pencere engelleme. |
| **Arama** | Varsayılan arama motoru, öneriler, popüler aramalar, motorları yönetme. |
| **Kısayollar** | Tüm Lokum kısayolları; kullandığınız bir siteyle çakışırsa hepsini kapatma anahtarı. |
| **Dil** | Arayüz dili (on iki dil dahil), yazım denetimi, web siteleri için tercih edilen diller. |
| **Güncellemeler** | Mevcut sürüm, şimdi denetle, otomatik denetim ve kurulum, kararlı/beta kanalı, denetim aralığı, sürüm notları, tüm sürümler. |
| **Gelişmiş** | Varsayılan tarayıcı, başka tarayıcıdan içe aktarma, karşılama turu, Lokum ayarlarını dışa/içe aktarma (JSON), profil klasörü, Lokum ayarlarını sıfırlama, yumuşak kaydırma, özel `userChrome.css`, tüm Firefox ayarları, `about:config`. |
| **Lokum hakkında** | Sürüm, Firefox motoru, derleme tarihi, platform, profil; sorun bildirme, sürüm notları ve lisans bağlantıları. |

<p align="center">
  <img src="../images/screenshots/settings-updates.webp" alt="Lokum Ayarları'nın Güncellemeler bölümü" width="80%">
</p>

Firefox'un sunduğu her şey hâlâ **Firefox ayarları**'nda (`about:preferences`)
bir tık uzağınızda.

---

## Gizlilik

Lokum gizli başlar ve öyle kalır:

- **Telemetri yok, çalışma yok, çökme raporlayıcı yok, varsayılan tarayıcı ajanı yok.** Kurumsal ilkelerle (`distribution/policies.json`) kapatılırlar ve paketten çıkarılırlar.
- **Sponsorlu içerik yok** — yeni sekme sayfasında sponsorlu kısayol veya haber yok, Pocket yok, "önerilen" eklenti ya da özellik yok.
- Varsayılan olarak *Dengeli* modda **Gelişmiş İzleme Koruması**, *Katı* mod bir tık uzakta.
- **uBlock Origin** karşılama turundan veya Ayarlar'dan tek tıkla kurulur.
- Gizlilik bölümünde **Güvenli DNS** hazır ayarları, **Yalnızca HTTPS** modu, **Global Privacy Control**, **parmak izi koruması** ve **çıkışta temizle**.

Lokum'un kendisinin bağlandığı yerler: güncellemeleri denetlemek için
`github.com` / `api.github.com` (**Ayarlar → Güncellemeler**'den
kapatabilirsiniz). Geri kalan her şey normal Firefox davranışıdır — örneğin
Güvenli Gezinti listeleri, sertifika iptal verileri ve eklenti mağazası — ve
bunları Firefox'un kendi gizlilik ayarlarından yönetebilirsiniz.

---

## Diller

Lokum on iki dille gelir ve ilk açılışta kurulum sihirbazında seçilen dili veya
işletim sisteminizin dilini kullanır. **Ayarlar → Dil**'den dilediğiniz zaman
değiştirebilirsiniz (her yerde geçerli olması için yeniden başlatma gerekir).

| Dil | Kod | | Dil | Kod |
| --- | --- | --- | --- | --- |
| İngilizce (English) | `en` | | İspanyolca (Español) | `es-ES` |
| Türkçe | `tr` | | İsveççe (Svenska) | `sv-SE` |
| Almanca (Deutsch) | `de` | | Korece (한국어) | `ko` |
| Fransızca (Français) | `fr` | | Japonca (日本語) | `ja` |
| İtalyanca (Italiano) | `it` | | Basitleştirilmiş Çince (简体中文) | `zh-CN` |
| Romanşça (Rumantsch) | `rm` | | Geleneksel Çince (繁體中文) | `zh-TW` |

Firefox'un kendi arayüzü, derlemenin uygulamaya birleştirdiği resmi Mozilla dil
paketlerinden gelir; Lokum'un eklemeleri (kenar çubuğu, ayarlar, karşılama turu,
güncelleyici…) `src/lokum/locales/` içindeki küçük JSON sözlüklerini kullanır.
Bir test, her sözlüğün eksiksiz olduğundan ve İngilizce ile aynı
`{yer tutucuları}` koruduğundan emin olur. Windows kurulum sihirbazı Romanşça
dışındaki tüm bu dillerde mevcuttur.

---

## Otomatik güncellemeler

1. Lokum her altı saatte bir (ayarlanabilir) en yeni GitHub sürümündeki küçük `latest.json` dosyasını indirir.
2. Daha yeni bir sürüm varsa kenar çubuğunda bir kart görünür ve kurulum dosyası arka planda iner — yalnızca GitHub'ın sürüm indirme sunucularından.
3. Dosyanın **SHA‑256** özeti `latest.json` ile karşılaştırılır; uyuşmayan her şey atılır.
4. Lokum'u kapattığınızda güncelleme arka planda sessizce kurulur. Bir sonraki açılışta yeni sürümdesiniz ve *"Lokum güncellendi"* bildirimi sürüm notlarına bağlantı verir. **Yeniden başlat ve güncelle** hemen kurar ve Lokum'u yeniden açar.

**Ayarlar → Güncellemeler**'den **Kararlı** veya **Beta** kanalını, denetim
aralığını seçin ya da otomatik kurulumu kapatın. Taşınabilir zip sürümü yalnızca
güncelleme olduğunu haber verir. Mozilla'nın kendi Firefox güncelleyicisi
devre dışıdır — yeni Firefox'u size Lokum sürümleri getirir.

---

## Klavye kısayolları

| Kısayol | İşlem |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>K</kbd> | Komut paleti |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd> | Kenar çubuğunu göster / gizle (kompakt mod) |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>→</kbd> / <kbd>←</kbd> | Sonraki / önceki Alan |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>1</kbd> … <kbd>9</kbd> | 1–9 numaralı Alana git |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd> | Sayfa bağlantısını kopyala |
| <kbd>Ctrl</kbd>+<kbd>,</kbd> | Lokum Ayarları |
| <kbd>Ctrl</kbd>+<kbd>T</kbd> | Yeni sekme |
| <kbd>Ctrl</kbd>+<kbd>L</kbd> | Adres çubuğuna odaklan (yüzen komut çubuğu) |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd> | Kapatılan sekmeyi yeniden aç |

Diğer tüm Firefox kısayolları her zamanki gibi çalışır. Lokum'un kendi
kısayolları **Ayarlar → Kısayollar**'dan kapatılabilir.

---

## Kurulum

### Windows (kurulum sihirbazı)

1. [Son sürümden](https://github.com/SametEge/Lokum/releases/latest) `Lokum-Setup-<sürüm>-x64.exe`'yi indirin.
2. Çalıştırın (yukarıdaki SmartScreen notuna bakın), dilinizi seçin, masaüstü kısayolu isteyip istemediğinizi ve Lokum'u varsayılan tarayıcı yapıp yapmayacağınızı belirleyin ve **Kur**'a tıklayın.
3. Lokum `%LOCALAPPDATA%\Programs\Lokum` klasörüne kurulur — kullanıcı başına, yönetici izni olmadan — ve kendini tarayıcı olarak kaydeder; böylece **Windows Ayarları → Varsayılan uygulamalar**'dan seçebilirsiniz.

Betikli kurulumlar için komut satırı seçenekleri:

| Seçenek | Anlamı |
| --- | --- |
| `/S` | Sessiz kurulum |
| `/D=C:\yol\Lokum` | Kurulum klasörü (en sonda olmalı) |
| `/DESKTOP=0` | Masaüstü kısayolu yok (varsayılan `1`) |
| `/UPDATE` | Mevcut kurulumu güncelle (güncelleyici kullanır) |
| `/RELAUNCH` | Bitince Lokum'u başlat |

Kaldırmak için **Windows Ayarları → Uygulamalar → Lokum**'u kullanın. Kaldırıcı
profilinizi (yer imleri, parolalar, geçmiş) saklamak mı yoksa onu da silmek mi
istediğinizi sorar.

### Windows (taşınabilir)

`Lokum-<sürüm>-win64.zip` dosyasını herhangi bir yere açın ve `lokum.exe`'yi
çalıştırın. Taşınabilir sürüm kayıt defterine dokunmaz ve güncellemeleri yalnızca
haber verir.

### Linux

```sh
tar -xJf Lokum-<sürüm>-linux-x86_64.tar.xz
cd lokum
./lokum                      # çalıştır
./install-desktop-entry.sh   # isteğe bağlı: Lokum'u uygulama menüsüne ekle
```

### Verileriniz nerede

Lokum, kurulu olabilecek herhangi bir Firefox'tan ayrı, kendi profilini kullanır.
**Ayarlar → Gelişmiş → Profil klasörü** onu açar. Lokum'a özgü veriler (Alanlar,
sekme arşivi) profilin içindeki `lokum` klasöründe durur.

---

## Kaynaktan derleme

Lokum Firefox'u derlemez. Derleme, `archive.mozilla.org`'dan **resmi bir
Firefox sürümü** indirir, Mozilla'nın `SHA512SUMS` dosyasıyla doğrular ve onu
Lokum'a dönüştürür. Tam bir Windows derlemesi sıradan bir makinede birkaç
dakika sürer ve Windows paketlerini Linux üzerinde derleyebilirsiniz.

**Gereksinimler**

- Python 3.10+
- Node.js 20+ (`lokum.exe`'nin simgelerini ve sürüm bilgisini [resedit](https://github.com/jet2jet/resedit-js) ile yeniden yazar)
- Windows Firefox kurulumunu açmak için `7z` (p7zip), `tar` ve `xz`
- Windows kurulum sihirbazı için NSIS 3 (`makensis`)

Ubuntu/Debian'da: `sudo apt install python3 nodejs npm p7zip-full nsis xz-utils`

**Derleme**

```sh
git clone https://github.com/SametEge/Lokum.git
cd Lokum
npm ci --prefix scripts/pe          # Windows derlemeleri için bir kez

# En son Firefox sürümünden Windows kurulum sihirbazı + taşınabilir zip
python3 scripts/build.py --platform win64

# Belirli bir Firefox sürümünde Linux arşivi
python3 scripts/build.py --platform linux-x86_64 --firefox-version 156.0
```

Çıktılar `dist/` klasörüne düşer. Yararlı seçenekler:

| Seçenek | Anlamı |
| --- | --- |
| `--platform {win64,win-arm64,linux-x86_64}` | Hedef platform |
| `--firefox-version X` | Üzerine kurulacak Firefox sürümü (varsayılan: `firefox.json` sabitlemesi, yoksa en yenisi) |
| `--version X` | Lokum sürümü (varsayılan: `version.json` + `-dev`) |
| `--firefox-dir KLASÖR` | İndirmek yerine zaten açılmış bir Firefox kullan |
| `--no-locales` | Dil paketlerini atla (daha hızlı) |
| `--no-installer` | NSIS'i atla |
| `--app-only` | Uygulama klasörü hazırlandıktan sonra dur |

**Açılmış bir Firefox üzerinde geliştirme**

```sh
scripts/dev/install.sh /yol/firefox        # Lokum katmanını içine kopyalar
/yol/firefox/firefox --profile /tmp/lokum-dev --no-remote
```

`src/lokum` içindeki değişikliklerin çoğu yalnızca tarayıcıyı yeniden başlatmayı
gerektirir.

**Testler**

```sh
node --test "tests/unit/*.test.mjs"      # çekirdek mantık, lezzet kontrastı
python3 tests/check_locales.py --strict  # tüm sözlükler eksiksiz mi
node scripts/dev/make_content_css.mjs --check
LOKUM_SELFTEST=out.json ./lokum --headless   # tarayıcı içinde 25 kontrol
```

`LOKUM_SELFTEST`, gerçek bir Lokum'un kendi kendini test etmesini (düzen,
Alanlar, lezzetler, komut paleti, ayarlar ve karşılama sayfaları, diller, marka,
güncelleyici ve ilkeler), sonuçları JSON olarak yazmasını ve kapanmasını sağlar.
CI, yeni derlenen paketleri kurduktan sonra bunu Windows ve Linux'ta çalıştırır.

---

## Lokum nasıl çalışır

```
resmi Firefox sürümü ──► SHA512 doğrula ──► aç
        │
        ├─ 11 Mozilla dil paketini omni.ja'ya birleştir (+ çok dilli liste)
        ├─ Firefox markasını (adlar, logolar, simgeler) Lokum'unkiyle değiştir
        ├─ Lokum katmanını ekle:  defaults/pref/lokum-autoconfig.js
        │                         lokum.cfg  (autoconfig önyüklemesi)
        │                         distribution/policies.json
        │                         browser/lokum/  (chrome://lokum paketi)
        ├─ güncelleyiciyi, çökme raporlayıcıyı, telemetri yardımcılarını kaldır
        ├─ firefox.exe → lokum.exe, yeni simgeler ve sürüm bilgisi
        └─ paketle: NSIS kurulum sihirbazı · taşınabilir zip · Linux arşivi
```

Firefox açılışta `lokum-autoconfig.js`'yi okur, o da `lokum.cfg`'yi yükler. Bu
minik önyükleme `chrome://lokum/` paketini kaydeder ve diğer her şeyi bağlayan
`LokumStartup.sys.mjs`'yi başlatır:

| Modül | Görevi |
| --- | --- |
| `LokumStartup` | Açılış/kapanış kancaları, ilk çalıştırma turu, "güncellendi" bildirimi, self‑test |
| `LokumWindow` | Pencere başına denetleyici: stil sayfaları, kök öznitelikler, başlık şeridi, kompakt mod, yüzen komut çubuğu, kısayollar |
| `LokumFlavors` | CSS `light-dark()` değişkenleri olarak on iki palet |
| `LokumLayout` | Lokum düzenini Firefox'un kenar çubuğu/dikey sekme tercihlerine ve araç çubuğu yerleşimlerine eşler |
| `LokumSpaces` | Alanlar: depolama, geçiş, kenar çubuğu başlığı ve altlığı, menüler, sürükle bırak |
| `LokumTabs` | Otomatik arşiv ve uyuyan sekmeler |
| `LokumCommandPalette` | <kbd>Ctrl</kbd>+<kbd>K</kbd> paleti |
| `LokumMediaCard` | Kenar çubuğu mini oynatıcısı |
| `LokumUpdater` | Güncelleme denetimi, doğrulanmış indirmeler, çıkışta sessiz kurulum |
| `LokumI18n` | Lokum sözlükleri ve ilk açılışta dil seçimi |
| `LokumShell` | Windows varsayılan tarayıcı entegrasyonu |
| `LokumContentStyles` | Yeni sekme sayfasını ve Firefox ayarlarını etkin lezzetle giydirir |
| `LokumAboutPages` | `about:lokum` (ayarlar) ve `about:lokum-welcome` (tur) |
| `LokumSelfTest` | CI'ın kullandığı tarayıcı içi self‑test |

Depo yapısı:

```
src/app/            Firefox ikili dosyasının yanına kopyalanan dosyalar (autoconfig, ilkeler)
src/lokum/          chrome://lokum paketi
  modules/          JavaScript modülleri (yukarıda)
  styles/           tarayıcı arayüzü stilleri (tokenlar, çerçeve, düzen, bileşenler, animasyonlar)
  pages/            about:lokum ayarları ve karşılama turu
  locales/          Lokum sözlükleri (12 dil)
  images/           simgeler ve logolar
scripts/build.py    derleme (bkz. scripts/lokumbuild/)
scripts/release.py  sürüm planlama, latest.json, sürüm notları
scripts/pe/         Windows yürütülebilir dosya kaynakları (resedit)
installer/          NSIS kurulum sihirbazı ve çevirileri
branding/           logo kaynakları ve üretilen simgeler
tests/              birim testleri, dil denetimleri, duman testleri
.github/workflows/  CI, derlemeler ve otomatik sürümler
```

---

## Sürümler ve sürekli entegrasyon

- **Her pull request ve dal gönderimi** birim ve dil testlerini çalıştırır, Windows ve Linux paketlerini derler, bunları gerçek Windows ve Linux makinelerine kurar ve tarayıcı içi self‑test'i çalıştırır.
- **`main`'e yapılan her gönderim** aynısını yapar ve ardından kurulum sihirbazı, taşınabilir zip, Linux arşivi, `latest.json`, `SHA256SUMS.txt` ve otomatik sürüm notlarıyla **yeni bir GitHub sürümü** yayımlar. Kurulu kopyalar kendilerini buradan günceller.
- **Her altı saatte bir** zamanlanmış bir iş Mozilla'ya en son Firefox sürümünü sorar; son sürümdekinden daha yeniyse Lokum onun üzerine yeniden derlenir ve otomatik olarak yayımlanır — böylece güvenlik düzeltmeleri kimse parmağını kıpırdatmadan size ulaşır.
- Sürümler elle de başlatılabilir (**Actions → Release → Run workflow**), isteğe bağlı olarak seçilen bir Firefox sürümüyle veya beta ön sürümü olarak.

Sürüm numaraları `version.json`'dan gelir; her sürüm yama numarasını otomatik
artırır. Gerekirse belirli bir Firefox sürümünü `firefox.json` dosyasıyla
(`{"version": "156.0"}`) sabitleyebilirsiniz.

---

## SSS

**Lokum bir Firefox çatalı mı?**
Ayrı bir motor anlamında hayır. Lokum, Mozilla'nın resmi Firefox derlemelerini
yeniden paketler ve kendi arayüz katmanını ekler; böylece Firefox'un motorunu,
performansını, web uyumluluğunu ve güvenlik düzeltmelerini birebir alırsınız.

**Firefox eklentileri çalışıyor mu?**
Evet — [addons.mozilla.org](https://addons.mozilla.org)'daki tüm eklentiler çalışır.

**Firefox Sync kullanabilir miyim?**
Evet. Yer imlerini, parolaları, geçmişi, sekmeleri ve eklentileri diğer
cihazlarınızdaki Firefox ile eşitlemek için **Firefox ayarları → Sync**'ten
oturum açın.

**Lokum mevcut Firefox'umu değiştirir veya okur mu?**
Hayır. Lokum'un kendi profili vardır. İsterseniz verilerinizi taşımak için içe
aktarma adımını (veya **Ayarlar → Gelişmiş → İçe aktar**) kullanın.

**Antivirüsüm / SmartScreen neden uyarıyor?**
Kurulum dosyası henüz kod imzalı değil. Dosyayı sürüm sayfasındaki
`SHA256SUMS.txt` ile karşılaştırın veya Lokum'u kendiniz derleyin.

**macOS sürümü var mı?**
Henüz yok. Windows ve Linux her değişiklikte derlenip test ediliyor.

**Bir güncellemeden sonra bir şey tuhaf görünüyor. Nasıl sıfırlarım?**
**Ayarlar → Gelişmiş → Lokum ayarlarını sıfırla** her Lokum seçeneğini geri
yükler ama sekmelerinizi, Alanlarınızı ve verilerinizi korur.

---

## Katkıda bulunma

Hata bildirimleri, fikirler, çeviriler ve pull request'ler çok değerli.

- Hataları ve fikirleri [Issues](https://github.com/SametEge/Lokum/issues) bölümüne yazın.
- Bir çeviriyi iyileştirmek için `src/lokum/locales/<kod>.json` dosyasını (kurulum sihirbazı için `installer/strings.nsh`) düzenleyin; `python3 tests/check_locales.py --strict` çalıştırın.
- Yeni bir lezzet eklemek için `src/lokum/modules/LokumFlavors.sys.mjs`'ye bir palet, her sözlüğe adını ve açıklamasını ekleyin; `node scripts/dev/make_content_css.mjs` ve birim testlerini (kontrastı denetlerler) çalıştırın.
- Pull request açmadan önce lütfen yukarıdaki testleri çalıştırın.

---

## Lisans ve ticari markalar

Lokum'un kaynak kodu, Firefox ile aynı lisans olan
[Mozilla Kamu Lisansı 2.0](../../LICENSE) altındadır.

Firefox ve Firefox logosu Mozilla Foundation'ın ticari markalarıdır. Lokum
bağımsız bir projedir; Mozilla ile bağlantılı değildir ve Mozilla tarafından
onaylanmamıştır. Mozilla'nın resmi sürümlerinden derlenir ve Firefox markasını
bunlardan çıkarır. Arc, The Browser Company'nin ticari markasıdır; onun da
Lokum ile bir bağlantısı yoktur — Lokum yalnızca fikirlerinden ilham alır.
uBlock Origin, Raymond Hill ve katkıda bulunanlar tarafından geliştirilmektedir.

<p align="center"><sub>🍬 ve Firefox ile yapıldı.</sub></p>
