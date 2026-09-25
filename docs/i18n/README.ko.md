<p align="center">
  <img src="../images/banner-ko.png" alt="Lokum — 빠름 · 강력함 · 데이터를 절대 훔치지 않음" width="820">
</p>

<p align="center">
  <a href="../../README.md">English</a> ·
  <a href="README.tr.md">Türkçe</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.it.md">Italiano</a> ·
  <a href="README.rm.md">Rumantsch</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.sv.md">Svenska</a> ·
  <b>한국어</b> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a>
</p>

<p align="center">
  <a href="https://github.com/SametEge/Lokum/releases/latest"><img alt="최신 릴리스" src="https://img.shields.io/github/v/release/SametEge/Lokum?label=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C&color=d23c78"></a>
  <a href="https://github.com/SametEge/Lokum/releases"><img alt="다운로드 수" src="https://img.shields.io/github/downloads/SametEge/Lokum/total?color=f1a2c2"></a>
  <img alt="Windows 10/11" src="https://img.shields.io/badge/Windows-10%20%7C%2011-6a46d8">
  <img alt="Linux x86-64" src="https://img.shields.io/badge/Linux-x86--64-55852a">
  <a href="../../LICENSE"><img alt="MPL 2.0" src="https://img.shields.io/badge/license-MPL%202.0-8a7141"></a>
</p>

**Lokum**(로쿰)은 Mozilla Firefox를 기반으로 만든, 터키 디저트 로쿰의 맛을
담은 웹 브라우저입니다. 이미 신뢰하고 있는 엔진과 보안, 확장 기능을 그대로
가져와 전체 높이 사이드바, 손으로 섞은 열두 가지 색 "맛(flavor)", 스페이스,
명령 팔레트, 부드러운 애니메이션, 그리고 유난히 공들인 첫 실행 경험으로
감쌌습니다 — 열두 개 언어로. 새 버전이 준비되면 GitHub Releases를 통해 조용히
스스로 업데이트합니다.

<p align="center">
  <img src="../images/screenshots/sidebar-light.webp" alt="사이드바 레이아웃과 장미 맛을 적용한 Lokum" width="49%">
  <img src="../images/screenshots/sidebar-dark.webp" alt="한밤 맛을 적용한 다크 모드 Lokum" width="49%">
</p>

---

## 목차

<!-- toc -->
- [다운로드](#다운로드)
- [주요 기능](#주요-기능)
- [맛](#맛)
- [레이아웃: 사이드바 또는 클래식 탭](#레이아웃-사이드바-또는-클래식-탭)
- [스페이스](#스페이스)
- [명령 팔레트와 명령 표시줄](#명령-팔레트와-명령-표시줄)
- [스스로 정리되는 탭](#스스로-정리되는-탭)
- [환영 투어](#환영-투어)
- [설정](#설정)
- [개인 정보 보호](#개인-정보-보호)
- [언어](#언어)
- [자동 업데이트](#자동-업데이트)
- [키보드 단축키](#키보드-단축키)
- [설치](#설치)
- [소스에서 빌드하기](#소스에서-빌드하기)
- [Lokum의 작동 방식](#lokum의-작동-방식)
- [릴리스와 지속적 통합](#릴리스와-지속적-통합)
- [자주 묻는 질문](#자주-묻는-질문)
- [기여하기](#기여하기)
- [라이선스와 상표](#라이선스와-상표)
<!-- /toc -->

---

## 다운로드

**[릴리스 페이지](https://github.com/SametEge/Lokum/releases/latest)**에서 최신 버전을 받으세요.

| 파일 | 대상 | 설명 |
| --- | --- | --- |
| `Lokum-Setup-<버전>-x64.exe` | Windows 10 / 11 (64비트) | **추천.** 현재 사용자에게만 설치되며 관리자 권한이 필요 없고, 스스로 업데이트합니다. |
| `Lokum-<버전>-win64.zip` | Windows 포터블 | 원하는 곳(USB 메모리도 가능)에 압축을 풀고 `lokum.exe`를 실행하세요. 업데이트가 있으면 알려 줍니다. |
| `Lokum-<버전>-linux-x86_64.tar.xz` | Linux (64비트) | 압축을 풀고 `./lokum`을 실행하세요. `install-desktop-entry.sh`로 앱 메뉴에 추가할 수 있습니다. |
| `latest.json`, `SHA256SUMS.txt` | 모두 | 내장 업데이터가 사용하는 업데이트 매니페스트와 모든 파일의 SHA‑256 체크섬. |

> **Windows SmartScreen.** Lokum은 아직 코드 서명이 되어 있지 않습니다(취미
> 프로젝트에게 인증서는 너무 비쌉니다). 그래서 처음 실행할 때 Windows가 *"Windows의
> PC 보호"* 창을 띄울 수 있습니다. **추가 정보 → 실행**을 누르세요. 파일은 언제든
> 릴리스 페이지의 `SHA256SUMS.txt`와 비교해 확인할 수 있습니다.

---

## 주요 기능

- 🍬 **열두 가지 맛** — 모든 테마는 로쿰의 한 종류입니다: 장미, 피스타치오, 레몬, 석류, 오렌지, 민트, 라벤더, 매스틱, 코코넛, 터키 커피, 한밤, 그리고 움직이는 *모둠* 상자. 각각 라이트와 다크 레시피가 있습니다.
- 🧭 **사이드바 _또는_ 클래식 탭** — 주소 표시줄이 안에 들어 있는 전체 높이 사이드바, Firefox의 세로 탭, 또는 클래식 탭 줄. 언제든 바꿀 수 있고 창이 실시간으로 재배치됩니다.
- 🗂️ **스페이스** — 개인, 업무, 학교, 여가를 나누세요. 스페이스마다 탭, 아이콘, 맛, (선택적으로) 컨테이너가 따로 있습니다. 밀어서 넘기거나 <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>←</kbd>/<kbd>→</kbd>로 전환합니다.
- ⌨️ **명령 팔레트** (<kbd>Ctrl</kbd>+<kbd>K</kbd>) — 열린 탭과 40개가 넘는 작업을 퍼지 검색하고, 주소 표시줄을 클릭하면 커다란 **떠 있는 명령 표시줄**이 나타납니다.
- 🎵 **미니 플레이어** — 다른 탭의 음악이나 동영상을 사이드바에서 바로 재생·일시 정지·건너뛰기·음소거합니다.
- 🧹 **스스로 정리되는 탭** — 한동안 열지 않은 탭은 자동 보관하고, 백그라운드 탭은 절전시키고, 보관함에서 무엇이든 다시 엽니다.
- 🌟 **어디에도 없던 환영 투어** — 설탕 가루를 입힌 3D 로쿰 큐브를 떨어뜨려 맛을 고르고, 마법사 뒤에서 브라우저가 재배치되는 모습을 보고, 프리셋으로 스페이스를 만들고, 예전 브라우저에서 가져오고, 개인 정보 보호 수준을 고르세요. 색종이도 포함입니다.
- ⚙️ **쓰는 재미가 있는 설정** — 열두 개 섹션, 즉시 검색, 실시간 미리 보기, Lokum 설정 내보내기/가져오기.
- 🔒 **기본값부터 비공개** — 원격 측정 없음, 연구 없음, 스폰서 콘텐츠 없음. 엄격한 추적 방지는 클릭 한 번, uBlock Origin·보안 DNS·HTTPS 전용 모드·GPC·핑거프린팅 방지가 설정에 들어 있습니다.
- 🌍 **열두 개 언어** — 영어, 터키어, 독일어, 프랑스어, 이탈리아어, 로만시어, 스페인어, 스웨덴어, 한국어, 일본어, 중국어 간체와 번체 — Lokum과 Firefox 모두에 적용됩니다.
- 🔄 **자동 업데이트** — 변경이 있을 때마다, 그리고 Mozilla가 새 Firefox를 낼 때마다 GitHub Actions가 새 버전을 빌드하고, Lokum을 닫을 때 조용히 설치됩니다.
- 🦊 **속은 진짜 Firefox** — Mozilla 공식 빌드, Gecko 엔진, 모든 Firefox 부가 기능, Firefox Sync, 그리고 나오는 즉시 적용되는 Mozilla의 보안 수정.

---

## 맛

맛은 브라우저 전체를 물들입니다: 창 테두리, 사이드바, 버튼과 스위치의 강조 색,
새 탭 페이지, Lokum 자체 페이지까지. 모든 맛에는 라이트와 다크 레시피가 있으며,
강조 색은 원하는 색으로 바꿀 수 있습니다. 스페이스마다 맛을 따로 지정할 수 있어
스페이스를 바꾸면 창 색도 바뀝니다.

| | 맛 | 분위기 |
| --- | --- | --- |
| 🌹 | **장미** | 장미수로 만든 클래식 로쿰, 발그레한 분홍빛. *(기본값)* |
| 🌰 | **피스타치오** | 싱그러운 피스타치오 그린, 차분하고 집중되는 색. |
| 🍋 | **레몬** | 밝은 아침을 위한 햇살 같은 레몬 제스트. |
| 🍎 | **석류** | 깊은 석류빛 빨강, 대담하고 상큼하게. |
| 🍊 | **오렌지** | 따뜻한 오렌지와 베르가못의 빛. |
| 🌿 | **민트** | 봄바람처럼 상쾌한 시원한 민트. |
| 💜 | **라벤더** | 꿈같은 오후를 위한 부드러운 라벤더. |
| 🤍 | **매스틱** | 크리미한 매스틱 아이보리, 조용하고 우아하게. |
| 🥥 | **코코넛** | 코코넛 화이트, 깔끔하고 미니멀하게. |
| ☕ | **터키 커피** | 진한 터키 커피의 갈색. |
| 🌙 | **한밤** | 올빼미족을 위한 별빛 가득한 한밤의 자두색. |
| 🎨 | **모둠** | 모든 색을 천천히 흘러가는 모둠 로쿰 한 상자. |

테스트가 모든 팔레트를 검사합니다: 텍스트는 테두리 위에서 WCAG 대비 4.5:1,
강조 버튼은 3:1 이상이어야 하며, 라이트·다크 모드 모두 해당됩니다.

켜고 끌 수 있는 추가 효과: **슈가 파우더**(사이드바에서 반짝이는 작은 빛),
**부드러운 질감**(은은한 종이 질감), 페이지 모서리 둥글기, 테두리 간격, 페이지
그림자, 인터페이스 밀도(촘촘하게 / 보통 / 여유롭게), 인터페이스 글꼴(시스템 /
둥근 글꼴 / 세리프), 세 단계의 애니메이션(전체, 줄이기 — 색은 바뀌지만 움직임은
없음 — , 끄기). Lokum은 운영 체제의 *움직임 줄이기* 설정도 따릅니다.

<p align="center">
  <img src="../images/screenshots/settings-appearance.webp" alt="열두 가지 맛 큐브가 있는 Lokum 설정의 모양 섹션" width="80%">
</p>

---

## 레이아웃: 사이드바 또는 클래식 탭

| 레이아웃 | 모습 |
| --- | --- |
| **사이드바** *(기본값)* | 탭, 주소 표시줄, 탐색 버튼이 전체 높이의 사이드바 하나에 모여 있습니다. 페이지는 둥근 카드처럼 맛 위에 떠 있고, 그 위의 얇은 제목 줄에 페이지 제목, 사이트, *링크 복사* 버튼이 표시됩니다. |
| **세로 탭** | 사이드바에 Firefox의 기본 세로 탭, 위쪽에 주소 표시줄. 익숙하고 넉넉합니다. |
| **클래식 탭** | 여느 브라우저처럼 탭이 위쪽에 — 여전히 선택한 맛으로 꾸며집니다. |

<p align="center">
  <img src="../images/screenshots/classic-tabs.webp" alt="클래식 탭과 피스타치오 맛을 적용한 Lokum" width="80%">
</p>

그 밖의 레이아웃 옵션:

- **사이드바 위치** — 왼쪽 또는 오른쪽.
- **사이드바 숨기기 (컴팩트 모드)** — <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd>. 페이지가 창 전체를 차지하고, 포인터가 창 가장자리에 닿으면 사이드바가 미끄러져 나옵니다.
- **떠 있는 명령 표시줄** — 주소 표시줄이 페이지 위 가운데에 크게 열립니다.
- **새 탭 위치** — 목록의 맨 위 또는 맨 아래.
- **탭 닫기 버튼** — 마우스를 올렸을 때, 항상, 표시 안 함.
- **고정한 탭은 즐겨찾기로** — 사이드바 위쪽에 큰 아이콘 격자로 표시되며 모든 스페이스에서 같습니다.
- **북마크 도구 모음**, **미니 플레이어**, **도구 모음 사용자 지정**.

---

## 스페이스

스페이스는 삶의 여러 부분을 나누어 줍니다. 스페이스마다 고유한 탭 목록, 이름,
이모지 아이콘, 그 안에 있는 동안 창 색을 바꾸는 선택적 맛, 그리고 선택적 Firefox
**컨테이너**가 있습니다. 예를 들어 업무 스페이스는 업무 계정에 로그인된 상태를
유지할 수 있습니다.

- 사이드바 아래쪽의 아이콘, 사이드바 위에서 **옆으로 밀기**(또는 <kbd>Shift</kbd> + 마우스 휠), <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>←</kbd>/<kbd>→</kbd>로 전환하거나, <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>1</kbd>…<kbd>9</kbd>로 바로 이동하세요.
- 탭을 옮기려면 **스페이스 아이콘 위로 끌어다 놓거나**, 탭의 컨텍스트 메뉴에서 *스페이스로 이동*을 사용하세요.
- 스페이스 이름을 오른쪽 클릭해 이름 바꾸기, 아이콘·맛·컨테이너 변경, 탭 비우기, 스페이스 만들기와 삭제를 할 수 있습니다.
- 순서를 포함한 모든 것은 **설정 → 스페이스**에서 관리합니다.
- 스페이스는 프로필(`lokum/spaces.json`)에 저장되고, 각 탭은 다시 시작해도 자신의 스페이스를 기억합니다.

<p align="center">
  <img src="../images/screenshots/spaces.webp" alt="민트 맛으로 물든 업무 스페이스" width="80%">
</p>

---

## 명령 팔레트와 명령 표시줄

어디서든 <kbd>Ctrl</kbd>+<kbd>K</kbd>를 누르세요. 몇 글자만 입력하면 Lokum이
퍼지 매칭으로 열린 탭과 작업을 찾아 줍니다: 새 탭/새 창/사생활 보호 창, 닫은 탭
다시 열기, 탭 복제, 고정, 링크 복사, 마지막 탭과 **분할 보기**, 읽기 보기, 화면 속
화면, 스크린샷, 찾기, 인쇄, 확대/축소, 다운로드, 기록, 북마크, 확장 기능, 개발자
도구, 최근 기록 지우기, 다크 모드, 모든 레이아웃, 모든 맛, 모든 스페이스, 그리고
Lokum 또는 Firefox 설정. 그 밖의 입력은 웹 검색이 됩니다.

<p align="center">
  <img src="../images/screenshots/command-palette.webp" alt="페이지 위의 명령 팔레트" width="49%">
  <img src="../images/screenshots/command-bar.webp" alt="떠 있는 명령 표시줄" width="49%">
</p>

사이드바 레이아웃에서 주소 표시줄을 클릭하거나 <kbd>Ctrl</kbd>+<kbd>L</kbd>를
누르면, 창 가운데에 커다란 **떠 있는 명령 표시줄**이 열립니다 — Firefox의 모든
제안, 검색 바로 가기, 기록을 여유 있는 공간에서 볼 수 있습니다.

---

## 스스로 정리되는 탭

- **자동 보관** — 12시간, 하루, 일주일 또는 한 달 동안 열지 않은 고정되지 않은 탭은 닫히고 **보관함**에 저장됩니다(최대 600개). **설정 → 보관함**이나 사이드바의 라이브러리 버튼에서 검색하고 다시 열 수 있습니다.
- **탭 절전** — 백그라운드 탭은 몇 분 뒤에 메모리와 배터리를 아끼도록 내려 둘 수 있고, 클릭하면 다시 불러옵니다.
- **미니 플레이어** — 탭에서 미디어가 재생되면 사이드바의 작은 카드에 앨범 아트, 제목, 아티스트와 이전 / 재생·일시 정지 / 다음, 음소거 버튼이 표시됩니다.
- 그리고 Firefox가 제공하는 모든 것: **탭 그룹**, **분할 보기**, 탭 미리 보기, 자동 **화면 속 화면**, 세션 복원.

---

## 환영 투어

Lokum을 처음 실행하면 브라우저 위로 전체 화면 환영 투어가 열립니다 — 그리고
선택하는 대로 뒤쪽의 브라우저가 실시간으로 바뀝니다.

<p align="center">
  <img src="../images/screenshots/welcome-intro.webp" alt="환영 투어: Lokum에 오신 것을 환영합니다" width="49%">
  <img src="../images/screenshots/welcome-flavor.webp" alt="환영 투어: 맛 고르기" width="49%">
</p>

1. **환영** — 떠다니는 3D 로쿰 큐브, 흩날리는 설탕, 언어 선택.
2. **맛** — 설탕을 입힌 큐브 열두 개가 쟁반에 떨어집니다. 하나를 누르면 슈가 파우더가 터지며 브라우저 전체의 색이 바뀝니다. 라이트, 다크, 자동을 고르거나 **놀라게 해 줘**로 맛 룰렛을 돌려 보세요.
3. **레이아웃** — 전체 높이 사이드바, 세로 탭, 클래식 탭, 사이드바 위치와 컴팩트 모드를 실시간으로 미리 봅니다.
4. **스페이스** — 개인으로 시작하고 업무, 학교, 여가 프리셋을 한 번씩 눌러 추가하세요.
5. **가져오기** — Lokum이 컴퓨터의 다른 브라우저(Chrome, Edge, Brave, Opera, Vivaldi…)를 찾아 북마크, 비밀번호, 기록 등을 가져옵니다.
6. **개인 정보** — 균형 또는 엄격한 추적 방지, uBlock Origin, 보안 DNS. 원격 측정은 항상 꺼져 있습니다.
7. **완료** — 선택 요약, *Lokum을 기본 브라우저로 설정*, 그리고 색종이.

**설정 → 고급 → 환영 투어**에서 언제든 다시 실행할 수 있습니다.

---

## 설정

<kbd>Ctrl</kbd>+<kbd>,</kbd>, 메인 메뉴, 사이드바, 또는 `about:lokum` 입력으로
**Lokum 설정**을 여세요. 모든 옵션은 즉시 적용되며, 검색 상자로 어떤 설정이든
이름으로 찾을 수 있습니다.

| 섹션 | 할 수 있는 일 |
| --- | --- |
| **모양** | 맛 갤러리, 라이트/다크/자동, 사용자 강조 색, 슈가 파우더, 질감, 애니메이션, 모서리 둥글기, 테두리 간격, 페이지 그림자, 밀도, 인터페이스 글꼴. |
| **레이아웃** | 사이드바 / 세로 / 클래식, 사이드바 위치, 컴팩트 모드, 떠 있는 명령 표시줄, 새 탭 위치, 닫기 버튼, 미니 플레이어, 북마크 도구 모음, 도구 모음 사용자 지정. |
| **스페이스** | 스페이스 사용, 스페이스별 창 색, 밀어서 전환; 스페이스 추가·이름 바꾸기·아이콘과 맛 변경·순서 변경·삭제; 컨테이너 선택. |
| **탭** | 자동 보관, 탭 절전, 시작 시 복원, 탭 미리 보기, 탭 그룹, 분할 보기, 자동 화면 속 화면, 종료 전 확인. |
| **보관함** | 보관된 탭 검색·다시 열기·삭제, 보관함 비우기. |
| **개인 정보 및 보안** | 균형/엄격 추적 방지, 클릭 한 번으로 uBlock Origin, HTTPS 전용 모드, 보안 DNS(Cloudflare, Quad9, Mullvad, NextDNS, AdGuard…), Global Privacy Control, 핑거프린팅 방지, 종료 시 기록 지우기, 팝업 차단. |
| **검색** | 기본 검색 엔진, 검색 제안, 인기 검색어, 검색 엔진 관리. |
| **단축키** | 모든 Lokum 단축키와, 사용하는 사이트와 겹칠 때 끌 수 있는 스위치. |
| **언어** | 인터페이스 언어(열두 개 포함), 맞춤법 검사, 웹사이트 선호 언어. |
| **업데이트** | 현재 버전, 지금 확인, 자동 확인과 설치, 안정/베타 채널, 확인 간격, 릴리스 노트, 모든 릴리스. |
| **고급** | 기본 브라우저, 다른 브라우저에서 가져오기, 환영 투어, Lokum 설정 내보내기/가져오기(JSON), 프로필 폴더, Lokum 설정 초기화, 부드러운 스크롤, 사용자 `userChrome.css`, 모든 Firefox 설정, `about:config`. |
| **Lokum 정보** | 버전, Firefox 엔진, 빌드 날짜, 플랫폼, 프로필; 문제 신고, 릴리스 노트, 라이선스 링크. |

<p align="center">
  <img src="../images/screenshots/settings-updates.webp" alt="Lokum 설정의 업데이트 섹션" width="80%">
</p>

Firefox가 제공하는 모든 기능은 여전히 **Firefox 설정**(`about:preferences`)에서
클릭 한 번이면 됩니다.

---

## 개인 정보 보호

Lokum은 처음부터 비공개이며 계속 그렇게 유지됩니다.

- **원격 측정, 연구, 충돌 보고기, 기본 브라우저 에이전트가 모두 없습니다.** 엔터프라이즈 정책(`distribution/policies.json`)으로 꺼지고 패키지에서 제거됩니다.
- **스폰서 콘텐츠 없음** — 새 탭 페이지에 스폰서 바로 가기나 기사가 없고, Pocket도, "추천" 확장 기능이나 기능도 없습니다.
- **향상된 추적 방지**는 기본 *균형* 모드이며, *엄격* 모드는 클릭 한 번입니다.
- **uBlock Origin**은 환영 투어나 설정에서 클릭 한 번으로 설치됩니다.
- 개인 정보 섹션에 **보안 DNS** 프리셋, **HTTPS 전용** 모드, **Global Privacy Control**, **핑거프린팅 방지**, **종료 시 지우기**가 있습니다.

Lokum 자체가 연결하는 곳: 업데이트 확인을 위한 `github.com` / `api.github.com`
(**설정 → 업데이트**에서 끌 수 있습니다). 그 밖의 모든 것은 일반적인 Firefox
동작이며 — 예를 들어 세이프 브라우징 목록, 인증서 폐기 데이터, 부가 기능
스토어 — Firefox의 개인 정보 설정에서 관리할 수 있습니다.

---

## 언어

Lokum에는 열두 개 언어가 들어 있으며, 처음 실행할 때 설치 프로그램에서 고른 언어나
운영 체제 언어를 사용합니다. **설정 → 언어**에서 언제든 바꿀 수 있습니다(모든
곳에 적용하려면 다시 시작하세요).

| 언어 | 코드 | | 언어 | 코드 |
| --- | --- | --- | --- | --- |
| 영어 (English) | `en` | | 스페인어 (Español) | `es-ES` |
| 터키어 (Türkçe) | `tr` | | 스웨덴어 (Svenska) | `sv-SE` |
| 독일어 (Deutsch) | `de` | | 한국어 | `ko` |
| 프랑스어 (Français) | `fr` | | 일본어 (日本語) | `ja` |
| 이탈리아어 (Italiano) | `it` | | 중국어 간체 (简体中文) | `zh-CN` |
| 로만시어 (Rumantsch) | `rm` | | 중국어 번체 (繁體中文) | `zh-TW` |

Firefox 자체의 인터페이스는 빌드 과정에서 애플리케이션에 합쳐지는 Mozilla 공식
언어 팩에서 오고, Lokum이 추가한 부분(사이드바, 설정, 환영 투어, 업데이터…)은
`src/lokum/locales/`의 작은 JSON 사전을 사용합니다. 테스트가 모든 사전이 완전하고
영어와 같은 `{자리표시자}`를 유지하는지 확인합니다. Windows 설치 프로그램은
로만시어를 제외한 모든 언어로 제공됩니다.

---

## 자동 업데이트

1. Lokum은 6시간마다(변경 가능) 최신 GitHub 릴리스의 작은 `latest.json` 파일을 받아 옵니다.
2. 더 새로운 버전이 있으면 사이드바에 카드가 나타나고 설치 프로그램이 백그라운드에서 다운로드됩니다 — GitHub 릴리스 다운로드 서버에서만.
3. 파일의 **SHA‑256**을 `latest.json`과 비교하며, 일치하지 않으면 폐기합니다.
4. Lokum을 닫으면 업데이트가 백그라운드에서 조용히 설치됩니다. 다음에 열면 새 버전이며, *"Lokum이 업데이트되었습니다"* 알림에서 릴리스 노트로 이동할 수 있습니다. **다시 시작하고 업데이트**를 누르면 바로 설치하고 Lokum을 다시 엽니다.

**설정 → 업데이트**에서 **안정** 또는 **베타** 채널, 확인 간격을 고르거나 자동
설치를 끌 수 있습니다. 포터블 zip 에디션은 알림만 합니다. Mozilla의 Firefox
업데이터는 꺼져 있습니다 — 새 Firefox는 Lokum 릴리스가 대신 가져다줍니다.

---

## 키보드 단축키

| 단축키 | 동작 |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>K</kbd> | 명령 팔레트 |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd> | 사이드바 보이기 / 숨기기 (컴팩트 모드) |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>→</kbd> / <kbd>←</kbd> | 다음 / 이전 스페이스 |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>1</kbd> … <kbd>9</kbd> | 스페이스 1–9로 이동 |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd> | 페이지 링크 복사 |
| <kbd>Ctrl</kbd>+<kbd>,</kbd> | Lokum 설정 |
| <kbd>Ctrl</kbd>+<kbd>T</kbd> | 새 탭 |
| <kbd>Ctrl</kbd>+<kbd>L</kbd> | 주소 표시줄 (떠 있는 명령 표시줄) |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd> | 닫은 탭 다시 열기 |

그 밖의 Firefox 단축키는 모두 평소처럼 작동합니다. Lokum 전용 단축키는
**설정 → 단축키**에서 끌 수 있습니다.

---

## 설치

### Windows (설치 프로그램)

1. [최신 릴리스](https://github.com/SametEge/Lokum/releases/latest)에서 `Lokum-Setup-<버전>-x64.exe`를 받으세요.
2. 실행한 뒤(위의 SmartScreen 안내 참고) 언어, 바탕 화면 바로 가기 여부, Lokum을 기본 브라우저로 할지 고르고 **설치**를 누르세요.
3. Lokum은 `%LOCALAPPDATA%\Programs\Lokum`에 설치되고 — 사용자별, 관리자 권한 없이 — 브라우저로 등록되므로 **Windows 설정 → 기본 앱**에서 선택할 수 있습니다.

스크립트 설치용 명령줄 옵션:

| 옵션 | 의미 |
| --- | --- |
| `/S` | 자동(무인) 설치 |
| `/D=C:\경로\Lokum` | 설치 폴더(맨 마지막에 와야 함) |
| `/DESKTOP=0` | 바탕 화면 바로 가기 없음(기본값 `1`) |
| `/UBLOCK=0` | uBlock Origin 설치 안 함(기본값 `1`: 첫 실행 시 설치) |
| `/UPDATE` | 기존 설치 업데이트(업데이터가 사용) |
| `/RELAUNCH` | 완료 후 Lokum 실행 |

제거하려면 **Windows 설정 → 앱 → Lokum**을 사용하세요. 제거 프로그램이
프로필(북마크, 비밀번호, 기록)을 남길지, 함께 지울지 묻습니다.

### Windows (포터블)

`Lokum-<버전>-win64.zip`을 원하는 곳에 풀고 `lokum.exe`를 실행하세요. 포터블
에디션은 레지스트리를 건드리지 않으며 업데이트는 알림만 합니다.

### Linux

```sh
tar -xJf Lokum-<버전>-linux-x86_64.tar.xz
cd lokum
./lokum                      # 실행
./install-desktop-entry.sh   # 선택: 앱 메뉴에 Lokum 추가
```

### 데이터 위치

Lokum은 설치된 Firefox와 분리된 자체 프로필을 사용합니다. **설정 → 고급 →
프로필 폴더**로 열 수 있습니다. Lokum 전용 데이터(스페이스, 탭 보관함)는 프로필
안의 `lokum` 폴더에 있습니다.

---

## 소스에서 빌드하기

Lokum은 Firefox를 컴파일하지 않습니다. 빌드는 `archive.mozilla.org`에서 **공식
Firefox 릴리스**를 받아 Mozilla의 `SHA512SUMS`로 검증한 뒤 Lokum으로
바꿉니다. 일반적인 컴퓨터에서 Windows 전체 빌드는 몇 분이면 끝나며, Windows
패키지를 Linux에서 만들 수 있습니다.

**필요한 것**

- Python 3.10+
- Node.js 20+ ([resedit](https://github.com/jet2jet/resedit-js)로 `lokum.exe`의 아이콘과 버전 정보를 다시 씀)
- Windows용 Firefox 설치 프로그램을 풀기 위한 `7z`(p7zip), `tar`, `xz`
- Windows 설치 프로그램용 NSIS 3(`makensis`)

Ubuntu/Debian: `sudo apt install python3 nodejs npm p7zip-full nsis xz-utils`

**빌드**

```sh
git clone https://github.com/SametEge/Lokum.git
cd Lokum
npm ci --prefix scripts/pe          # Windows 빌드용, 한 번만

# 최신 Firefox 릴리스로 Windows 설치 프로그램 + 포터블 zip 만들기
python3 scripts/build.py --platform win64

# 특정 Firefox 버전으로 Linux 압축 파일 만들기
python3 scripts/build.py --platform linux-x86_64 --firefox-version 156.0
```

결과물은 `dist/`에 생깁니다. 유용한 옵션:

| 옵션 | 의미 |
| --- | --- |
| `--platform {win64,win-arm64,linux-x86_64}` | 대상 플랫폼 |
| `--firefox-version X` | 기반 Firefox 버전(기본값: `firefox.json` 고정값, 없으면 최신) |
| `--version X` | Lokum 버전(기본값: `version.json` + `-dev`) |
| `--firefox-dir 폴더` | 다운로드 대신 이미 풀어 둔 Firefox 사용 |
| `--no-locales` | 언어 팩 건너뛰기(더 빠름) |
| `--no-installer` | NSIS 건너뛰기 |
| `--app-only` | 애플리케이션 폴더 준비 후 중지 |

**풀어 둔 Firefox로 개발하기**

```sh
scripts/dev/install.sh /경로/firefox        # Lokum 레이어를 복사해 넣음
/경로/firefox/firefox --profile /tmp/lokum-dev --no-remote
```

`src/lokum`의 변경은 대부분 브라우저를 다시 시작하기만 하면 됩니다.

**테스트**

```sh
node --test "tests/unit/*.test.mjs"      # 핵심 로직, 맛 대비
python3 tests/check_locales.py --strict  # 모든 사전이 완전한지
node scripts/dev/make_content_css.mjs --check
LOKUM_SELFTEST=out.json ./lokum --headless   # 브라우저 안에서 25가지 검사
```

`LOKUM_SELFTEST`를 설정하면 실제 Lokum이 자체 테스트(레이아웃, 스페이스, 맛,
명령 팔레트, 설정·환영 페이지, 언어, 브랜딩, 업데이터, 정책)를 실행하고 결과를
JSON으로 쓴 뒤 종료합니다. CI는 새로 빌드한 패키지를 설치한 뒤 Windows와 Linux에서
이를 실행합니다.

---

## Lokum의 작동 방식

```
공식 Firefox 릴리스 ──► SHA512 검증 ──► 압축 해제
        │
        ├─ Mozilla 언어 팩 11개를 omni.ja에 병합 (+ 다국어 목록)
        ├─ Firefox 브랜딩(이름, 로고, 아이콘)을 Lokum 것으로 교체
        ├─ Lokum 레이어 추가:  defaults/pref/lokum-autoconfig.js
        │                      lokum.cfg  (autoconfig 부트스트랩)
        │                      distribution/policies.json
        │                      browser/lokum/  (chrome://lokum 패키지)
        ├─ 업데이터, 충돌 보고기, 원격 측정 도구 제거
        ├─ firefox.exe → lokum.exe, 새 아이콘과 버전 정보
        └─ 패키징: NSIS 설치 프로그램 · 포터블 zip · Linux 압축 파일
```

Firefox는 시작할 때 `lokum-autoconfig.js`를 읽고, 이것이 `lokum.cfg`를 불러옵니다.
이 작은 부트스트랩이 `chrome://lokum/` 패키지를 등록하고 나머지를 모두 연결하는
`LokumStartup.sys.mjs`를 시작합니다.

| 모듈 | 역할 |
| --- | --- |
| `LokumStartup` | 시작/종료 훅, 첫 실행 투어, "업데이트됨" 알림, 자체 테스트 |
| `LokumWindow` | 창별 컨트롤러: 스타일시트, 루트 속성, 제목 줄, 컴팩트 모드, 떠 있는 명령 표시줄, 단축키 |
| `LokumFlavors` | CSS `light-dark()` 변수로 된 열두 개 팔레트 |
| `LokumLayout` | Lokum 레이아웃을 Firefox의 사이드바/세로 탭 설정과 도구 모음 배치로 변환 |
| `LokumSpaces` | 스페이스: 저장, 전환, 사이드바 머리글과 바닥글, 메뉴, 끌어서 놓기 |
| `LokumTabs` | 자동 보관과 탭 절전 |
| `LokumCommandPalette` | <kbd>Ctrl</kbd>+<kbd>K</kbd> 팔레트 |
| `LokumMediaCard` | 사이드바 미니 플레이어 |
| `LokumUpdater` | 업데이트 확인, 검증된 다운로드, 종료 시 조용한 설치 |
| `LokumI18n` | Lokum 사전과 첫 실행 시 언어 선택 |
| `LokumShell` | Windows 기본 브라우저 통합 |
| `LokumContentStyles` | 새 탭 페이지와 Firefox 설정에 현재 맛을 입힘 |
| `LokumAboutPages` | `about:lokum`(설정)과 `about:lokum-welcome`(투어) |
| `LokumSelfTest` | CI가 사용하는 브라우저 내 자체 테스트 |

저장소 구조:

```
src/app/            Firefox 실행 파일 옆에 복사되는 파일(autoconfig, 정책)
src/lokum/          chrome://lokum 패키지
  modules/          JavaScript 모듈(위 표)
  styles/           브라우저 UI 스타일(토큰, 테두리, 레이아웃, 컴포넌트, 애니메이션)
  pages/            about:lokum 설정과 환영 투어
  locales/          Lokum 사전(12개 언어)
  images/           아이콘과 로고
scripts/build.py    빌드(scripts/lokumbuild/ 참고)
scripts/release.py  릴리스 계획, latest.json, 릴리스 노트
scripts/pe/         Windows 실행 파일 리소스(resedit)
installer/          NSIS 설치 프로그램과 번역
branding/           로고 원본과 생성된 아이콘
tests/              단위 테스트, 언어 검사, 스모크 테스트
.github/workflows/  CI, 빌드, 자동 릴리스
```

---

## 릴리스와 지속적 통합

- **모든 풀 리퀘스트와 브랜치 푸시**는 단위·언어 테스트를 실행하고, Windows와 Linux 패키지를 빌드해 실제 Windows·Linux 러너에 설치한 뒤 브라우저 내 자체 테스트를 실행합니다.
- **`main`으로의 모든 푸시**는 같은 과정을 거친 뒤 설치 프로그램, 포터블 zip, Linux 압축 파일, `latest.json`, `SHA256SUMS.txt`, 자동 생성된 릴리스 노트가 담긴 **새 GitHub 릴리스**를 게시합니다. 설치된 Lokum은 여기에서 스스로 업데이트합니다.
- **6시간마다** 예약된 작업이 Mozilla에 최신 Firefox 버전을 묻고, 마지막 릴리스보다 새로우면 그 위에 Lokum을 다시 빌드해 자동으로 게시합니다 — 누구도 손대지 않아도 보안 수정이 전달됩니다.
- 릴리스는 수동으로도 시작할 수 있습니다(**Actions → Release → Run workflow**). 특정 Firefox 버전이나 베타 사전 릴리스로도 가능합니다.

버전 번호는 `version.json`에서 오며, 릴리스마다 패치 번호가 자동으로 올라갑니다.
필요하면 `firefox.json` 파일(`{"version": "156.0"}`)로 Firefox 버전을 고정할 수
있습니다.

---

## 자주 묻는 질문

**Lokum은 Firefox의 포크인가요?**
별도의 엔진이라는 의미에서는 아닙니다. Lokum은 Mozilla의 공식 Firefox 빌드를
다시 패키징하고 자체 인터페이스 레이어를 더합니다. 그래서 Firefox의 엔진, 성능,
웹 호환성, 보안 수정을 그대로 얻습니다.

**Firefox 확장 기능이 작동하나요?**
네 — [addons.mozilla.org](https://addons.mozilla.org)의 모든 부가 기능이 작동합니다.

**Firefox Sync를 쓸 수 있나요?**
네. **Firefox 설정 → Sync**에서 로그인하면 북마크, 비밀번호, 기록, 탭, 부가
기능을 다른 기기의 Firefox와 동기화할 수 있습니다.

**Lokum이 기존 Firefox를 바꾸거나 읽나요?**
아니요. Lokum은 자체 프로필을 사용합니다. 데이터를 옮기고 싶다면 가져오기 단계
(또는 **설정 → 고급 → 가져오기**)를 사용하세요.

**백신 / SmartScreen이 왜 경고하나요?**
설치 프로그램이 아직 코드 서명되지 않았기 때문입니다. 릴리스 페이지의
`SHA256SUMS.txt`와 파일을 비교하거나 Lokum을 직접 빌드하세요.

**macOS 버전이 있나요?**
아직 없습니다. Windows와 Linux는 변경이 있을 때마다 빌드되고 테스트됩니다.

**업데이트 후 뭔가 이상해 보여요. 어떻게 초기화하나요?**
**설정 → 고급 → Lokum 설정 초기화**는 모든 Lokum 옵션을 되돌리지만 탭, 스페이스,
데이터는 그대로 둡니다.

---

## 기여하기

버그 보고, 아이디어, 번역, 풀 리퀘스트 모두 환영합니다.

- 버그와 아이디어는 [Issues](https://github.com/SametEge/Lokum/issues)에 남겨 주세요.
- 번역을 개선하려면 `src/lokum/locales/<코드>.json`(설치 프로그램은 `installer/strings.nsh`)을 수정하고 `python3 tests/check_locales.py --strict`를 실행하세요.
- 새 맛을 추가하려면 `src/lokum/modules/LokumFlavors.sys.mjs`에 팔레트를, 모든 사전에 이름과 설명을 추가한 뒤 `node scripts/dev/make_content_css.mjs`와 단위 테스트(대비를 검사합니다)를 실행하세요.
- 풀 리퀘스트를 열기 전에 위 테스트를 실행해 주세요.

---

## 라이선스와 상표

Lokum의 소스 코드는 Firefox와 같은 [Mozilla Public License 2.0](../../LICENSE)
라이선스를 따릅니다.

Firefox와 Firefox 로고는 Mozilla Foundation의 상표입니다. Lokum은 독립 프로젝트로
Mozilla와 관련이 없고 Mozilla의 보증을 받지 않았습니다. Mozilla의 공식 릴리스로
빌드되며 그 안의 Firefox 브랜딩을 제거합니다. uBlock Origin은 Raymond Hill과 기여자들이 만들었습니다.

<p align="center"><sub>🍬와 Firefox로 만들었습니다.</sub></p>
