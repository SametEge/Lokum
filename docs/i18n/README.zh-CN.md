<p align="center">
  <img src="../images/banner-zh-CN.png" alt="Lokum — 快速 · 强大 · 绝不窃取你的数据" width="820">
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
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ja.md">日本語</a> ·
  <b>简体中文</b> ·
  <a href="README.zh-TW.md">繁體中文</a>
</p>

<p align="center">
  <a href="https://github.com/SametEge/Lokum/releases/latest"><img alt="最新版本" src="https://img.shields.io/github/v/release/SametEge/Lokum?label=%E4%B8%8B%E8%BD%BD&color=d23c78"></a>
  <a href="https://github.com/SametEge/Lokum/releases"><img alt="下载次数" src="https://img.shields.io/github/downloads/SametEge/Lokum/total?color=f1a2c2"></a>
  <img alt="Windows 10/11" src="https://img.shields.io/badge/Windows-10%20%7C%2011-6a46d8">
  <img alt="Linux x86-64" src="https://img.shields.io/badge/Linux-x86--64-55852a">
  <a href="../../LICENSE"><img alt="MPL 2.0" src="https://img.shields.io/badge/license-MPL%202.0-8a7141"></a>
</p>

**Lokum** 是一款基于 Mozilla Firefox、带着土耳其软糖（Lokum）风味的网页浏览器。
它保留了你早已信任的引擎、安全性和扩展，再用全高侧边栏、十二种手工调制的
颜色“口味”、空间（Spaces）、命令面板、柔和的动画，以及格外用心的首次设置把它们
包装起来——支持十二种语言。新版本一准备好，它就会通过 GitHub Releases 悄悄地自动
更新。

<p align="center">
  <img src="../images/screenshots/sidebar-light.webp" alt="使用侧边栏布局和玫瑰口味的 Lokum" width="49%">
  <img src="../images/screenshots/sidebar-dark.webp" alt="深色模式、午夜口味的 Lokum" width="49%">
</p>

---

## 目录

<!-- toc -->
- [下载](#下载)
- [亮点](#亮点)
- [口味](#口味)
- [布局：侧边栏或经典标签页](#布局侧边栏或经典标签页)
- [空间](#空间)
- [命令面板与命令栏](#命令面板与命令栏)
- [会自己整理的标签页](#会自己整理的标签页)
- [欢迎导览](#欢迎导览)
- [设置](#设置)
- [隐私](#隐私)
- [语言](#语言)
- [自动更新](#自动更新)
- [键盘快捷键](#键盘快捷键)
- [安装](#安装)
- [从源代码构建](#从源代码构建)
- [Lokum 的工作原理](#lokum-的工作原理)
- [发布与持续集成](#发布与持续集成)
- [常见问题](#常见问题)
- [参与贡献](#参与贡献)
- [许可证与商标](#许可证与商标)
<!-- /toc -->

---

## 下载

请在 **[发布页面](https://github.com/SametEge/Lokum/releases/latest)** 获取最新版本。

| 文件 | 适用于 | 说明 |
| --- | --- | --- |
| `Lokum-Setup-<版本>-x64.exe` | Windows 10 / 11（64 位） | **推荐。** 只为当前用户安装，无需管理员权限，会自动更新。 |
| `Lokum-<版本>-win64.zip` | Windows 便携版 | 解压到任意位置（U 盘也可以）并运行 `lokum.exe`。有更新时会提醒你。 |
| `Lokum-<版本>-linux-x86_64.tar.xz` | Linux（64 位） | 解压后运行 `./lokum`；`install-desktop-entry.sh` 可将其添加到应用菜单。 |
| `latest.json`、`SHA256SUMS.txt` | 所有人 | 内置更新程序使用的更新清单，以及每个文件的 SHA‑256 校验和。 |

> **关于 Windows SmartScreen。** Lokum 目前还没有代码签名（对个人项目来说证书太贵），
> 所以首次运行时 Windows 可能会提示 *“Windows 已保护你的电脑”*。请点击
> **更多信息 → 仍要运行**。你随时可以用发布页面上的 `SHA256SUMS.txt` 校验文件。

---

## 亮点

- 🍬 **十二种口味** —— 每个主题都是一种软糖：玫瑰、开心果、柠檬、石榴、橙子、薄荷、薰衣草、乳香、椰子、土耳其咖啡、午夜，以及会动的 *什锦* 礼盒。每种都有浅色和深色配方。
- 🧭 **侧边栏，_或_ 经典标签页** —— 内含地址栏的全高侧边栏、Firefox 的垂直标签页，或经典的标签栏。随时切换，窗口会实时重新排布。
- 🗂️ **空间** —— 把个人、工作、学习和娱乐分开，每个空间都有自己的标签页、图标、口味，以及（可选的）身份容器。滑动或按 <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>←</kbd>/<kbd>→</kbd> 切换。
- ⌨️ **命令面板**（<kbd>Ctrl</kbd>+<kbd>K</kbd>）—— 在已打开的标签页和 40 多个操作中模糊搜索；点击地址栏时还会出现一个大大的 **悬浮命令栏**。
- 🎵 **迷你播放器** —— 直接在侧边栏播放、暂停、切歌和静音其他标签页中的音乐或视频。
- 🧹 **会自己整理的标签页** —— 自动归档一段时间没打开的标签页，让后台标签页休眠，随时从归档中重新打开。
- 🌟 **独一无二的欢迎导览** —— 让裹着糖粉的 3D 软糖方块落下来挑选口味，看着浏览器在向导后面重新排布，用模板创建空间，从旧浏览器导入数据，选择隐私级别。还有彩纸庆祝。
- ⚙️ **用起来很愉快的设置页** —— 十二个分区、即时搜索、实时预览，并可导出/导入 Lokum 设置。
- 🔒 **默认即隐私** —— 没有遥测、没有研究、没有赞助内容；严格的跟踪保护一键可得；uBlock Origin、安全 DNS、HTTPS-Only 模式、GPC 和指纹识别保护都在设置中。
- 🌍 **十二种语言** —— 英语、土耳其语、德语、法语、意大利语、罗曼什语、西班牙语、瑞典语、韩语、日语、简体中文和繁体中文，Lokum 和 Firefox 本身都适用。
- 🔄 **自动更新** —— 每次有改动、以及 Mozilla 每次发布新 Firefox 时，GitHub Actions 都会构建新版本，并在你关闭 Lokum 时静默安装。
- 🦊 **内核是真正的 Firefox** —— Mozilla 官方构建、Gecko 引擎、所有 Firefox 附加组件、Firefox Sync，以及 Mozilla 第一时间发布的安全修复。

---

## 口味

口味会为整个浏览器上色：窗口边框、侧边栏、按钮和开关的强调色、新标签页，以及 Lokum
自己的页面。每种口味都有浅色和深色配方，强调色也可以换成你喜欢的任何颜色。空间可以
拥有自己的口味——切换空间时，窗口颜色也会随之改变。

| | 口味 | 氛围 |
| --- | --- | --- |
| 🌹 | **玫瑰** | 经典玫瑰水软糖，泛着红晕的粉色。*（默认）* |
| 🌰 | **开心果** | 清新的开心果绿，平静而专注。 |
| 🍋 | **柠檬** | 阳光般的柠檬皮，点亮明媚的早晨。 |
| 🍎 | **石榴** | 深邃的石榴红，大胆又多汁。 |
| 🍊 | **橙子** | 橙子与佛手柑的温暖光泽。 |
| 🌿 | **薄荷** | 清凉薄荷，像春风一样清爽。 |
| 💜 | **薰衣草** | 柔和的薰衣草，陪你度过梦幻的午后。 |
| 🤍 | **乳香** | 奶油般的乳香象牙白，安静而优雅。 |
| 🥥 | **椰子** | 椰子白，干净而简约。 |
| ☕ | **土耳其咖啡** | 浓郁的土耳其咖啡棕。 |
| 🌙 | **午夜** | 为夜猫子准备的星空午夜梅紫。 |
| 🎨 | **什锦** | 一盒什锦软糖，缓缓流转过每一种颜色。 |

测试会检查每个调色板：无论浅色还是深色模式，文字在边框上的 WCAG 对比度都必须达到
4.5:1，强调按钮必须达到 3:1。

可以开关的额外细节：**糖粉**（侧边栏中闪烁的细小光点）、**柔和颗粒**（细腻的纸张
纹理）、页面圆角、边框间距、页面阴影、界面密度（紧凑 / 标准 / 宽松）、界面字体
（系统 / 圆体 / 衬线），以及三档动画（完整、减弱——颜色渐变但不移动——或关闭）。
Lokum 也会遵循系统的 *减少动态效果* 设置。

<p align="center">
  <img src="../images/screenshots/settings-appearance.webp" alt="Lokum 设置的外观分区，展示十二个口味方块" width="80%">
</p>

---

## 布局：侧边栏或经典标签页

| 布局 | 外观 |
| --- | --- |
| **侧边栏** *（默认）* | 标签页、地址栏和导航按钮都在同一个全高侧边栏中。页面像一张圆角卡片悬浮在口味之上，上方的细标题条显示页面标题、网站和 *复制链接* 按钮。 |
| **垂直标签页** | 侧边栏中是 Firefox 原生的垂直标签页，地址栏在顶部。熟悉又宽敞。 |
| **经典标签页** | 像所有浏览器一样把标签页放在顶部——依然穿着你选的口味。 |

<p align="center">
  <img src="../images/screenshots/classic-tabs.webp" alt="经典标签页与开心果口味的 Lokum" width="80%">
</p>

更多布局选项：

- **侧边栏位置** —— 左侧或右侧。
- **隐藏侧边栏（紧凑模式）** —— <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd>。页面占满整个窗口，指针碰到窗口边缘时侧边栏会滑出。
- **悬浮命令栏** —— 地址栏在页面中央大幅展开。
- **新标签页出现在** 列表顶部或底部。
- **标签页关闭按钮** —— 悬停时、始终或从不显示。
- **固定的标签页变成收藏** —— 侧边栏顶部的大图标网格，在所有空间中保持一致。
- **书签工具栏**、**迷你播放器** 和 **定制工具栏**。

---

## 空间

空间让生活的不同部分各归其位。每个空间都有自己的标签页列表、名称、表情图标、一个
可选的口味（在该空间时为窗口重新上色）以及一个可选的 Firefox **身份容器**——例如，
工作空间可以一直保持工作账号的登录状态。

- 用侧边栏底部的图标、在侧边栏上 **左右滑动**（或 <kbd>Shift</kbd> + 滚轮）、按 <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>←</kbd>/<kbd>→</kbd> 切换，或用 <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>1</kbd>…<kbd>9</kbd> 直接跳转。
- **把标签页拖到空间图标上** 即可移动，也可以在标签页的右键菜单中选择 *移动到空间*。
- 右键点击空间名称可以重命名、更改图标、口味或容器、清空标签页，以及新建和删除空间。
- 在 **设置 → 空间** 中管理一切，包括排序。
- 空间保存在你的配置文件中（`lokum/spaces.json`），每个标签页在重启后仍会记得自己属于哪个空间。

<p align="center">
  <img src="../images/screenshots/spaces.webp" alt="薄荷口味着色的工作空间" width="80%">
</p>

---

## 命令面板与命令栏

随时按 <kbd>Ctrl</kbd>+<kbd>K</kbd>。输入几个字母，Lokum 就会用模糊匹配找到已打开的
标签页和操作：新建标签页/窗口/隐私窗口、重新打开关闭的标签页、复制、固定、复制链接、
与上一个标签页 **分屏**、阅读视图、画中画、截图、查找、打印、缩放、下载、历史记录、
书签、扩展、开发者工具、清除最近的历史记录、深色模式、每种布局、每种口味、每个空间，
以及 Lokum 或 Firefox 设置。其他输入都会变成网页搜索。

<p align="center">
  <img src="../images/screenshots/command-palette.webp" alt="页面上方的命令面板" width="49%">
  <img src="../images/screenshots/command-bar.webp" alt="悬浮命令栏" width="49%">
</p>

在侧边栏布局中点击地址栏（或按 <kbd>Ctrl</kbd>+<kbd>L</kbd>）时，它会变成窗口中央的
大号 **悬浮命令栏**——Firefox 的所有建议、搜索快捷方式和历史记录都在其中，空间充裕。

---

## 会自己整理的标签页

- **自动归档** —— 12 小时、一天、一周或一个月未打开的未固定标签页会被关闭并保存在 **归档** 中（最多 600 个）。在 **设置 → 归档** 或侧边栏的“我的足迹”按钮中搜索并重新打开。
- **休眠标签页** —— 后台标签页可在几分钟后卸载，以节省内存和电量；点击时会重新加载。
- **迷你播放器** —— 标签页播放媒体时，侧边栏中的小卡片会显示封面、标题和艺术家，并提供上一首 / 播放‑暂停 / 下一首和静音。
- 以及 Firefox 自带的一切：**标签页组**、**分屏视图**、标签页悬停预览、自动 **画中画** 和会话恢复。

---

## 欢迎导览

首次启动 Lokum 时，浏览器上方会打开全屏的欢迎导览——你每做一个选择，背后的浏览器
都会实时变化。

<p align="center">
  <img src="../images/screenshots/welcome-intro.webp" alt="欢迎导览：欢迎使用 Lokum" width="49%">
  <img src="../images/screenshots/welcome-flavor.webp" alt="欢迎导览：挑选口味" width="49%">
</p>

1. **欢迎** —— 悬浮的 3D 软糖方块、飘落的糖粉，以及语言切换。
2. **口味** —— 十二块裹着糖粉的方块落进托盘；点一块，整个浏览器就会在一阵糖粉中变色。选择浅色、深色或自动，或点 **给我惊喜** 来一次口味轮盘。
3. **布局** —— 全高侧边栏、垂直标签页或经典标签页，以及侧边栏位置和紧凑模式，实时预览。
4. **空间** —— 从个人开始，一键添加工作、学习和娱乐模板。
5. **导入** —— Lokum 会检测电脑上的其他浏览器（Chrome、Edge、Brave、Opera、Vivaldi……），并导入书签、密码、历史记录等。
6. **隐私** —— 平衡或严格的跟踪保护、uBlock Origin、安全 DNS；遥测始终关闭。
7. **完成** —— 你的选择摘要、*将 Lokum 设为默认浏览器*，还有彩纸。

你可以随时在 **设置 → 高级 → 欢迎导览** 中重新运行。

---

## 设置

用 <kbd>Ctrl</kbd>+<kbd>,</kbd>、主菜单、侧边栏或输入 `about:lokum` 打开
**Lokum 设置**。所有选项即时生效，搜索框可以按名称找到任何设置。

| 分区 | 你可以做什么 |
| --- | --- |
| **外观** | 口味画廊、浅色/深色/自动、自定义强调色、糖粉、颗粒、动画、圆角程度、边框间距、页面阴影、密度、界面字体。 |
| **布局** | 侧边栏 / 垂直 / 经典、侧边栏位置、紧凑模式、悬浮命令栏、新标签页位置、关闭按钮、迷你播放器、书签工具栏、定制工具栏。 |
| **空间** | 启用空间、按空间为窗口着色、滑动切换；添加、重命名、更换图标和口味、排序和删除空间；选择身份容器。 |
| **标签页** | 自动归档、休眠标签页、启动时恢复、标签页预览、标签页组、分屏视图、自动画中画、退出前确认。 |
| **归档** | 搜索、重新打开和移除已归档的标签页；清空归档。 |
| **隐私与安全** | 平衡/严格跟踪保护、一键安装 uBlock Origin、HTTPS-Only 模式、安全 DNS（Cloudflare、Quad9、Mullvad、NextDNS、AdGuard……）、Global Privacy Control、指纹识别保护、退出时清除历史记录、拦截弹出式窗口。 |
| **搜索** | 默认搜索引擎、搜索建议、热门搜索、管理搜索引擎。 |
| **快捷键** | 所有 Lokum 快捷键，以及在与网站冲突时关闭它们的开关。 |
| **语言** | 界面语言（内置十二种）、拼写检查、网站首选语言。 |
| **更新** | 当前版本、立即检查、自动检查与安装、稳定版/测试版通道、检查间隔、发行说明、所有版本。 |
| **高级** | 默认浏览器、从其他浏览器导入、欢迎导览、导出/导入 Lokum 设置（JSON）、配置文件夹、重置 Lokum 设置、平滑滚动、自定义 `userChrome.css`、所有 Firefox 设置、`about:config`。 |
| **关于 Lokum** | 版本、Firefox 引擎、构建日期、平台、配置文件；报告问题、发行说明和许可证链接。 |

<p align="center">
  <img src="../images/screenshots/settings-updates.webp" alt="Lokum 设置的更新分区" width="80%">
</p>

Firefox 提供的一切，依然在 **Firefox 设置**（`about:preferences`）中一键可达。

---

## 隐私

Lokum 从一开始就注重隐私，并一直如此：

- **没有遥测、没有研究、没有崩溃报告器、没有默认浏览器代理。** 它们通过企业策略（`distribution/policies.json`）关闭，并从安装包中移除。
- **没有赞助内容** —— 新标签页上没有赞助的快捷方式或文章，没有 Pocket，也没有“推荐”的扩展或功能。
- **增强型跟踪保护** 默认为 *平衡* 模式，*严格* 模式一键可得。
- **uBlock Origin** 可在欢迎导览或设置中一键安装。
- 隐私分区中提供 **安全 DNS** 预设、**HTTPS-Only** 模式、**Global Privacy Control**、**指纹识别保护** 和 **退出时清除**。

Lokum 自身会连接的地址：用于检查更新的 `github.com` / `api.github.com`（可在
**设置 → 更新** 中关闭）。其他一切都是 Firefox 的正常行为——例如安全浏览列表、证书
吊销数据和附加组件商店——你可以在 Firefox 自己的隐私设置中管理。

---

## 语言

Lokum 内置十二种语言，首次启动时使用安装程序中选择的语言或操作系统语言。可随时在
**设置 → 语言** 中切换（重启后在所有地方生效）。

| 语言 | 代码 | | 语言 | 代码 |
| --- | --- | --- | --- | --- |
| 英语（English） | `en` | | 西班牙语（Español） | `es-ES` |
| 土耳其语（Türkçe） | `tr` | | 瑞典语（Svenska） | `sv-SE` |
| 德语（Deutsch） | `de` | | 韩语（한국어） | `ko` |
| 法语（Français） | `fr` | | 日语（日本語） | `ja` |
| 意大利语（Italiano） | `it` | | 简体中文 | `zh-CN` |
| 罗曼什语（Rumantsch） | `rm` | | 繁体中文（繁體中文） | `zh-TW` |

Firefox 自身的界面来自 Mozilla 官方语言包，构建时会被合并进应用；Lokum 新增的部分
（侧边栏、设置、欢迎导览、更新程序……）使用 `src/lokum/locales/` 中的小型 JSON
词典。有测试确保每个词典都完整，并与英文保持相同的 `{占位符}`。Windows 安装程序
支持除罗曼什语以外的所有这些语言。

---

## 自动更新

1. Lokum 每六小时（可调整）从最新的 GitHub 版本下载小小的 `latest.json` 文件。
2. 如果有更新的版本，侧边栏会出现一张卡片，安装程序在后台下载——只从 GitHub 的版本下载服务器获取。
3. 文件的 **SHA‑256** 会与 `latest.json` 比对，不一致的一律丢弃。
4. 关闭 Lokum 时，更新会在后台静默安装。下次打开时你已经在使用新版本，*“Lokum 已更新”* 通知会带你查看发行说明。**重启并更新** 会立即安装并重新打开 Lokum。

可在 **设置 → 更新** 中选择 **稳定版** 或 **测试版** 通道、检查间隔，或关闭自动安装。
便携 zip 版只会提醒。Mozilla 自己的 Firefox 更新程序已被禁用——新的 Firefox 会随
Lokum 版本一起送达。

---

## 键盘快捷键

| 快捷键 | 操作 |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>K</kbd> | 命令面板 |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd> | 显示 / 隐藏侧边栏（紧凑模式） |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>→</kbd> / <kbd>←</kbd> | 下一个 / 上一个空间 |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>1</kbd> … <kbd>9</kbd> | 前往空间 1–9 |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd> | 复制页面链接 |
| <kbd>Ctrl</kbd>+<kbd>,</kbd> | Lokum 设置 |
| <kbd>Ctrl</kbd>+<kbd>T</kbd> | 新建标签页 |
| <kbd>Ctrl</kbd>+<kbd>L</kbd> | 地址栏（悬浮命令栏） |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd> | 重新打开关闭的标签页 |

其他 Firefox 快捷键照常可用。Lokum 自己的快捷键可在 **设置 → 快捷键** 中关闭。

---

## 安装

### Windows（安装程序）

1. 从 [最新版本](https://github.com/SametEge/Lokum/releases/latest) 下载 `Lokum-Setup-<版本>-x64.exe`。
2. 运行它（参见上面的 SmartScreen 说明），选择语言、是否创建桌面快捷方式、是否将 Lokum 设为默认浏览器，然后点击 **安装**。
3. Lokum 会安装到 `%LOCALAPPDATA%\Programs\Lokum`——按用户安装，无需管理员权限——并注册为浏览器，因此你可以在 **Windows 设置 → 默认应用** 中选择它。

用于脚本化安装的命令行参数：

| 参数 | 含义 |
| --- | --- |
| `/S` | 静默安装 |
| `/D=C:\路径\Lokum` | 安装目录（必须放在最后） |
| `/DESKTOP=0` | 不创建桌面快捷方式（默认 `1`） |
| `/UBLOCK=0` | 不安装 uBlock Origin（默认 `1`：首次启动时安装） |
| `/UPDATE` | 更新现有安装（供更新程序使用） |
| `/RELAUNCH` | 完成后启动 Lokum |

卸载请使用 **Windows 设置 → 应用 → Lokum**。卸载程序会询问是保留你的配置文件
（书签、密码、历史记录）还是一并删除。

### Windows（便携版）

将 `Lokum-<版本>-win64.zip` 解压到任意位置并运行 `lokum.exe`。便携版不会改动注册表，
只会提醒更新。

### Linux

```sh
tar -xJf Lokum-<版本>-linux-x86_64.tar.xz
cd lokum
./lokum                      # 运行
./install-desktop-entry.sh   # 可选：将 Lokum 添加到应用菜单
```

### 数据存放位置

Lokum 使用独立的配置文件，与已安装的任何 Firefox 分开。**设置 → 高级 → 配置文件夹**
可以打开它。Lokum 专属的数据（空间、标签页归档）位于配置文件中的 `lokum` 文件夹。

---

## 从源代码构建

Lokum 不编译 Firefox。构建过程会从 `archive.mozilla.org` 下载 **Firefox 官方版本**，
用 Mozilla 的 `SHA512SUMS` 校验，然后把它变成 Lokum。在普通电脑上完整构建 Windows
版只需几分钟，而且可以在 Linux 上构建 Windows 安装包。

**环境要求**

- Python 3.10+
- Node.js 20+（使用 [resedit](https://github.com/jet2jet/resedit-js) 改写 `lokum.exe` 的图标和版本信息）
- 用于解压 Windows 版 Firefox 安装程序的 `7z`（p7zip），以及 `tar` 和 `xz`
- 用于 Windows 安装程序的 NSIS 3（`makensis`）

Ubuntu/Debian：`sudo apt install python3 nodejs npm p7zip-full nsis xz-utils`

**构建**

```sh
git clone https://github.com/SametEge/Lokum.git
cd Lokum
npm ci --prefix scripts/pe          # 仅需一次，用于 Windows 构建

# 基于最新 Firefox 构建 Windows 安装程序 + 便携 zip
python3 scripts/build.py --platform win64

# 基于指定 Firefox 版本构建 Linux 压缩包
python3 scripts/build.py --platform linux-x86_64 --firefox-version 156.0
```

构建结果位于 `dist/`。常用选项：

| 选项 | 含义 |
| --- | --- |
| `--platform {win64,win-arm64,linux-x86_64}` | 目标平台 |
| `--firefox-version X` | 作为基础的 Firefox 版本（默认：`firefox.json` 中固定的版本，否则为最新版） |
| `--version X` | Lokum 版本（默认：`version.json` + `-dev`） |
| `--firefox-dir 目录` | 使用已解压的 Firefox，而不是下载 |
| `--no-locales` | 跳过语言包（更快） |
| `--no-installer` | 跳过 NSIS |
| `--app-only` | 准备好应用目录后停止 |

**基于已解压的 Firefox 开发**

```sh
scripts/dev/install.sh /path/to/firefox        # 复制 Lokum 层进去
/path/to/firefox/firefox --profile /tmp/lokum-dev --no-remote
```

对 `src/lokum` 的大多数修改只需重启浏览器即可生效。

**测试**

```sh
node --test "tests/unit/*.test.mjs"      # 核心逻辑、口味对比度
python3 tests/check_locales.py --strict  # 所有词典是否完整
node scripts/dev/make_content_css.mjs --check
LOKUM_SELFTEST=out.json ./lokum --headless   # 浏览器内 25 项检查
```

设置 `LOKUM_SELFTEST` 后，真实的 Lokum 会运行自检（布局、空间、口味、命令面板、设置和
欢迎页面、语言、品牌、更新程序和策略），把结果写成 JSON 后退出。CI 会在安装刚构建好的
安装包后，在 Windows 和 Linux 上运行它。

---

## Lokum 的工作原理

```
Firefox 官方版本 ──► 校验 SHA512 ──► 解压
        │
        ├─ 将 11 个 Mozilla 语言包合并进 omni.ja（+ 多语言列表）
        ├─ 用 Lokum 的品牌（名称、标志、图标）替换 Firefox 品牌
        ├─ 添加 Lokum 层：  defaults/pref/lokum-autoconfig.js
        │                   lokum.cfg  （autoconfig 引导）
        │                   distribution/policies.json
        │                   browser/lokum/  （chrome://lokum 包）
        ├─ 移除更新程序、崩溃报告器和遥测组件
        ├─ firefox.exe → lokum.exe，新的图标和版本信息
        └─ 打包：NSIS 安装程序 · 便携 zip · Linux 压缩包
```

启动时，Firefox 读取 `lokum-autoconfig.js`，后者加载 `lokum.cfg`。这段小小的引导代码
注册 `chrome://lokum/` 包，并启动负责串联其他一切的 `LokumStartup.sys.mjs`：

| 模块 | 职责 |
| --- | --- |
| `LokumStartup` | 启动/关闭钩子、首次运行导览、“已更新”通知、自检 |
| `LokumWindow` | 每个窗口的控制器：样式表、根属性、标题条、紧凑模式、悬浮命令栏、快捷键 |
| `LokumFlavors` | 以 CSS `light-dark()` 变量表示的十二个调色板 |
| `LokumLayout` | 把 Lokum 布局转换为 Firefox 的侧边栏/垂直标签页首选项和工具栏布局 |
| `LokumSpaces` | 空间：存储、切换、侧边栏页眉与页脚、菜单、拖放 |
| `LokumTabs` | 自动归档和休眠标签页 |
| `LokumCommandPalette` | <kbd>Ctrl</kbd>+<kbd>K</kbd> 命令面板 |
| `LokumMediaCard` | 侧边栏迷你播放器 |
| `LokumUpdater` | 检查更新、校验下载、退出时静默安装 |
| `LokumI18n` | Lokum 词典和首次启动时的语言选择 |
| `LokumShell` | Windows 默认浏览器集成 |
| `LokumContentStyles` | 用当前口味装扮新标签页和 Firefox 设置 |
| `LokumAboutPages` | `about:lokum`（设置）和 `about:lokum-welcome`（导览） |
| `LokumSelfTest` | CI 使用的浏览器内自检 |

仓库结构：

```
src/app/            复制到 Firefox 可执行文件旁的文件（autoconfig、策略）
src/lokum/          chrome://lokum 包
  modules/          JavaScript 模块（见上表）
  styles/           浏览器界面样式（令牌、边框、布局、组件、动画）
  pages/            about:lokum 设置页和欢迎导览
  locales/          Lokum 词典（12 种语言）
  images/           图标和标志
scripts/build.py    构建脚本（见 scripts/lokumbuild/）
scripts/release.py  版本规划、latest.json、发行说明
scripts/pe/         Windows 可执行文件资源（resedit）
installer/          NSIS 安装程序及其翻译
branding/           标志源文件和生成的图标
tests/              单元测试、语言检查、冒烟测试
.github/workflows/  CI、构建和自动发布
```

---

## 发布与持续集成

- **每个拉取请求和每次分支推送** 都会运行单元测试和语言测试，构建 Windows 和 Linux 安装包，把它们安装到真实的 Windows 和 Linux 运行器上，并运行浏览器内自检。
- **每次推送到 `main`** 都会执行同样的流程，然后发布一个 **新的 GitHub 版本**，包含安装程序、便携 zip、Linux 压缩包、`latest.json`、`SHA256SUMS.txt` 和自动生成的发行说明。已安装的 Lokum 会从这里自动更新。
- **每六小时** 一个定时任务会向 Mozilla 查询最新的 Firefox 版本；如果比上一个版本使用的更新，就会基于它重新构建 Lokum 并自动发布——安全修复无需任何人动手就能送达你手中。
- 也可以手动发布（**Actions → Release → Run workflow**），可选指定 Firefox 版本或作为测试版预发布。

版本号来自 `version.json`；每次发布都会自动递增补丁号。如有需要，可以用
`firefox.json` 文件（`{"version": "156.0"}`）固定 Firefox 版本。

---

## 常见问题

**Lokum 是 Firefox 的分支吗？**
不是另起炉灶的引擎。Lokum 重新打包 Mozilla 官方的 Firefox 构建，并加入自己的界面层，
所以你得到的正是 Firefox 的引擎、性能、网页兼容性和安全修复。

**Firefox 扩展能用吗？**
能——[addons.mozilla.org](https://addons.mozilla.org) 上的所有附加组件都可以使用。

**可以使用 Firefox Sync 吗？**
可以。在 **Firefox 设置 → 同步** 中登录，即可与其他设备上的 Firefox 同步书签、密码、
历史记录、标签页和附加组件。

**Lokum 会修改或读取我现有的 Firefox 吗？**
不会。Lokum 有自己的配置文件。如果想迁移数据，请使用导入步骤（或
**设置 → 高级 → 导入**）。

**为什么杀毒软件 / SmartScreen 会发出警告？**
安装程序还没有代码签名。请用发布页面上的 `SHA256SUMS.txt` 校验文件，或自己构建 Lokum。

**有 macOS 版本吗？**
暂时没有。Windows 和 Linux 在每次改动时都会构建和测试。

**更新后有些地方看起来不对，如何重置？**
**设置 → 高级 → 重置 Lokum 设置** 会恢复所有 Lokum 选项，但保留你的标签页、空间和数据。

---

## 参与贡献

非常欢迎错误报告、想法、翻译和拉取请求。

- 在 [Issues](https://github.com/SametEge/Lokum/issues) 中报告问题和提出想法。
- 改进翻译请编辑 `src/lokum/locales/<代码>.json`（安装程序为 `installer/strings.nsh`），并运行 `python3 tests/check_locales.py --strict`。
- 添加新口味：在 `src/lokum/modules/LokumFlavors.sys.mjs` 中加入调色板，在每个词典中加入名称和描述，然后运行 `node scripts/dev/make_content_css.mjs` 和单元测试（会检查对比度）。
- 提交拉取请求前请先运行上面的测试。

---

## 许可证与商标

Lokum 的源代码采用与 Firefox 相同的 [Mozilla 公共许可证 2.0](../../LICENSE)。

Firefox 和 Firefox 标志是 Mozilla 基金会的商标。Lokum 是独立项目，与 Mozilla 无关，
也未获得 Mozilla 的认可；它基于 Mozilla 的官方版本构建，并移除了其中的 Firefox 品牌。
uBlock Origin 由 Raymond Hill 及贡献者开发。

<p align="center"><sub>用 🍬 和 Firefox 制作。</sub></p>
