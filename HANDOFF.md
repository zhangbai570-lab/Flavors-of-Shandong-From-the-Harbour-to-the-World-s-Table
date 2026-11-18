# AI 交接文档 ·《海味山东：从渔港到世界餐桌》

> 给接手的 AI / 开发者：这是一份「读完就能继续干」的交接说明。
> 最后更新：2026-11-17 23:45 ｜ 当前版本：**v6-nopager**（备份在 `backup/v6-nopager/`）
> 工作目录：`D:\Users\ROG\Desktop\蓝色创想`（Windows，无 Git 仓库，靠 `backup/` 手工版本管理）

---

## 0. 一句话现状

纯静态单页网站，**8 屏、一屏一页、上下滑动整页吸附**（滑一下走一页，不停在页面中间）。
已经删掉底部「← 02/08 →」点击翻页控件和右侧圆点，**只剩滑动翻页**；顶部导航和键盘仍可跳页。
内容：山东海洋饮食 + 四语（中/英/日/韩）+ 港口地图 + 词源翻卡 + 8 道菜 + 6 道工序 + 5 题小游戏 + 时间轴 + AI 说明。

---

## 1. 背景与硬约束（不要违背）

- 比赛：山东大学翻译学院「蓝色创想 · 以语为桥」跨文化传播创新实践大赛，**数字传播赛道**。
- 截稿：**2026-11-19 24:00**；邮箱 `fanyuan_keyan@163.com`；邮件/压缩包命名 `蓝色创想+数字传播+团队名称`。
- 团队分工：当前仓库是 **模块 A（网页开发/核心交互）** 的交付物；B 负责样式+部署，C 视觉，D 文案多语，E 核查/测试/录屏/提交。
- **用户明确要求（最高优先级）：**
  1. 浏览方式 = **上下滑动 + 整页吸附**；往下滑下一页、往上滑上一页，**绝不停在两页之间**。
  2. **不要恢复底部点击翻页控件 / 右侧圆点**（已按用户要求删除）。
  3. 手机端翻页控件不能遮内容（现在已无底部控件，保持即可）。
  4. 答题页提交答案时不能「突然空一下」/位置跳动。
  5. 整体方框不要太尖锐（已统一圆角 8–18px），首屏红印章是**椭圆印**，不要改回方形。
- 作品必须**双击 `index.html` 可运行**：无 CDN、无字体外链、无构建、无 fetch；`file://` 下可用。

---

## 2. 文件结构与职责

```
蓝色创想/
├── index.html          # 唯一页面结构；含 8 个 page + OG meta + 弹窗
├── css/
│   ├── base.css        # 设计变量、导航、首屏、章节外壳、按钮、弹窗、reveal
│   ├── sections.css    # 地图/翻卡/宴席/工序/答题/年表/尾页 + 末尾圆角柔化
│   └── deck.css        # 【翻页核心】滚动吸附容器、每页高度、手机压缩布局
├── js/
│   ├── i18n.js         # UI 文案（zh/en/ja/ko），键必须四语齐全
│   ├── data.js         # 全部内容数据（四语对象），改文案只动这里
│   ├── main.js         # 内容渲染 + 卡片/地图/答题/时间轴/弹窗/语言切换
│   └── deck.js         # 【翻页核心】滚动位置→当前页、滚轮手势、动画、fit 兜底
├── tools/
│   ├── og-cover.html   # 1200×630 分享封面源文件（headless 截图生成 preview/og-cover.png/jpg）
│   └── set-site-url.ps1# 部署后把 index.html 的 __SITE_URL__ 替换成实际域名（UTF-8 BOM）
├── preview/            # 页面截图（8 桌面 + 2 手机）+ og-cover.jpg/png
├── README.md           # 给人类队友的使用说明
├── AI创作说明.md        # 300–500 字提交版（正文约 440 字）
├── HANDOFF.md          # 本文件
└── backup/             # 版本备份（v1…v6），用户确认后才可删
```

**加载顺序**：`base.css → sections.css → deck.css`；`i18n.js → data.js → main.js → deck.js`（都是普通 `<script>`，不能用 `type="module"`，否则 `file://` 会挂）。

---

## 3. 页面结构（DOM 顺序 = 翻页顺序）

| # | id | 类 | 说明 |
|---|---|---|---|
| 0 | `home` | `hero` | 首屏：标题、四语导航、启航、数据、罗盘、椭圆印 |
| 1 | `ports` | `section sec-paper page-ports` | 山东半岛手绘地图 + 港口档案 |
| 2 | `lexicon` | `section sec-dark page-lexicon` | 6 张词源翻卡 |
| 3 | `banquet` | `section sec-paper page-banquet` | 8 道菜（汉字作「盘」） |
| 4 | `craft` | `section sec-dark page-craft` | 鲅鱼水饺六道工序 |
| 5 | `quiz` | `section sec-paper page-quiz` | 5 道词源题 |
| 6 | `timeline` | `section sec-dark page-timeline` | 山东海味出海记 |
| 7 | `about` | `footer footer page-about` | 创作理念/参考/团队/AI 说明 |

- `deck.js` 在启动时给这些节点加 `page`、`page-<id>`、`data-page`、`aria-hidden`。
- 页面顺序由 DOM 决定；新增页面就加一个 `<section class="section ...">` 到 `</footer>` 之前。
- 顶部导航链接是 `href="#id"`，`deck.js` 捕获后调用 `goTo`。
- 底部**没有** `.pager` / `.pager-dots`；不要加回来。

---

## 4. 翻页实现（核心，改之前先读懂）

### 4.1 CSS（`css/deck.css`）

```css
body.deck { overflow: hidden; height: 100%; background: var(--deep); }
body.deck .deck {
  position: fixed; inset: 0;
  overflow-y: auto; overflow-x: hidden;
  scroll-snap-type: y mandatory;        /* 整页吸附 */
  overscroll-behavior-y: contain;
  scrollbar-width: none;
}
body.deck .deck.is-animating { scroll-snap-type: none; }  /* 自定义动画期间临时关闭 */
body.deck #deck main > section,
body.deck #deck > footer {
  height: 100%; min-height: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;             /* 一次只走一页，防惯性跳过 */
  display: flex; flex-direction: column;
  overflow: hidden;
}
```

- `body` 必须有 `class="deck"`（在 `index.html` 里）。
- `main` 用 `display: contents`，让页面直接相对 `.deck` 定位。
- 页面高度用 `height: 100%`（相对滚动容器），不要改成 `100vh`（手机地址栏会错位）。
- 手机不再有底部控制条，**不要**再给 `.deck` 加 `bottom: 54px`。

### 4.2 JS（`js/deck.js`）

- `collectPages()`：收集 `#home, main > section, #deck > footer`，共 8 个。
- `pageTop(i)`：页面相对滚动容器的偏移；`indexFromScroll()`：按最近页判断当前页。
- `goTo(i, instant)`：跳页；相邻页用 `animateTo()` 自定义 560ms 缓动；远距离/instant 直接设 `scrollTop`。
- `animateTo()`：**用 `setTimeout(16)` 逐帧改 `scrollTop`**，不要换成 `requestAnimationFrame`（无头浏览器/虚拟时间下不跑，且之前踩过坑）；动画期间给 `.deck` 加 `.is-animating` 关闭吸附。
- **滚轮手势归一化**：`wheel` 监听里累计 `deltaY`，阈值 36，一次手势只翻一页；`preventDefault` 阻止原生滚轮半页滚动；手势静默 650ms 后解锁。
  - `deltaX` 占主导时（年表横向）直接放行。
  - `.port-panel` / `.lex-back` 内部可滚动时，先让内部滚完再翻页。
- 触摸滑动：**不写 JS**，交给原生 scroll + CSS snap。
- 键盘：↑↓ / ←→ / PageUp/PageDown / 空格 / Home/End。
- 滚动事件：80ms 节流更新当前页、进度条、顶部导航高亮、`aria-hidden`。
- `fitPages()`：进页/切语言/缩放时检测 `.wrap` 是否超高，超过则 `transform: scale()`（最低 0.5）兜底；**跳过 `.page-quiz`**（答题区固定高度，缩放会引发跳动）。
- 暴露 `window.HXDeck = { go, next, prev, index, pages }`，方便调试/自动化测试。

### 4.3 当前页状态

- 顶部进度条 `#progressBar`：`scaleX(current/(n-1))`。
- 顶部导航 `.nav-links a.on` 高亮当前页；`current > 0` 时 `#nav` 加 `.solid`。
- 没有页码计数器（已随 pager 删除）；如需提示可加，但**不要做成点击翻页按钮**。

---

## 5. 内容数据（D 模块主要改这里）

### 5.1 `js/data.js`

所有可改内容都是四语对象 `{ zh, en, ja, ko }`：

| 字段 | 说明 |
|---|---|
| `cities[]` | 4 个港口：`name/dish/region/dialect/story/forms/note/pinyin`，`x/y` 是地图 SVG（760×620）坐标 |
| `lexicon[]` | 6 个词源：`glyph/pinyin/word/forms/story` |
| `dishes[]` | 8 道菜：`char`（盘心汉字）/`names`/`tag`/`pinyin` |
| `craft[]` | 6 道工序：`verb`（中英日韩）/`title`/`desc`/`meta`/`icon` |
| `quiz[]` | 5 题：`q/options[{text}]/answer(0 起)/explain`，选项运行时随机 |
| `timeline[]` | 5 个节点：`year/dateLabel/title/text` |
| `refs[]` | 中文参考列表 |
| `aiStatement[]` | 页面内 AI 说明弹窗（`h/p`） |

### 5.2 `js/i18n.js`

- 四种语言必须有**同一批 key**，否则切换回退中文。
- 常用键：`s1_title/s1_lead`、`map_hint`、`panel_*`、`quiz_*`、`about_*`、`footer_note`、`scroll_hint`。
- 团队占位符：`about_team`、`about_team2`（四语各改一次）。
- 文件里还残留 `pager_prev/pager_next/pager_hint/nav_home`（已无 UI 使用），可删可留。

### 5.3 语言切换链路

`main.js` 里 `setLang()` → `renderAll()` → `document.dispatchEvent(new CustomEvent("hx:langchange"))`；
`deck.js` 监听后 `fitPages()` + `goTo(current, true)` 对齐当前页。
新增动态内容时，要在 `renderAll()` 里重新渲染，并在 `hx:langchange` 后保持当前页不变。

---

## 6. 关键坑 / 不要踩

1. **Windows 写文件偶发 `ReplaceFileW EIO (Win32 1175)`**：通常是 Edge/OneDrive/杀软占用。重试即可；先 `Stop-Process` 掉 headless Edge（`CommandLine -match 'headless'`）。
2. **CSS 里不要再加 `scroll-behavior: smooth` 到 `.deck`**：会让无头验证拿不到 `scrollTop`，且与自定义动画打架。平滑由 `animateTo` 负责。
3. **`#home` / `#about` 的 padding 需要高优先级选择器**：`body.deck #deck #home`（双 id），否则被页面通用规则覆盖。
4. **答题区不要改回自适应高度**：`.page-quiz .quiz-shell` 固定 `height: clamp(360px, 52vh, 500px)`，改了就重新出现「空一下」。
5. **不要给手机加回底部控制条**；页面高度必须整屏。
6. **没有外部图片/字体/CDN**；所有图标是内联 SVG，菜卡是汉字排版。加图请放本地 `assets/` 并用相对路径。
7. `file://` 下 `localStorage` 可能被禁用，`main.js` 已 try/catch 回退中文，别移除。
8. `index.html` 里 4 处 `__SITE_URL__` 是 OG 占位符：**部署后才替换**，本地不要乱填；替换脚本见 `tools/set-site-url.ps1`（UTF-8 BOM，Windows PowerShell 5.1 可用）。
9. 无头 Edge 有**最小窗口宽度 ≈504px**，无法直接截 390px 真机图；390 端靠手机压缩 CSS + `fitPages` 兜底，必要时用 DevTools 设备模拟人工确认。

---

## 7. 自测 / 验收（可直接复制）

### 7.1 渲染节点检查

```powershell
$dir = "D:\Users\ROG\Desktop\蓝色创想"
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$uri = ([System.Uri]($dir + "\index.html")).AbsoluteUri
$out = & $edge --headless=new --disable-gpu --no-first-run --no-default-browser-check `
  --user-data-dir="$env:TEMP\dsh-check" --virtual-time-budget=6000 --dump-dom $uri 2>$null | Out-String
"pages = " + ([regex]::Matches($out,'data-page="\d+"')).Count          # 期望 8
"lex   = " + ([regex]::Matches($out,'class="lex-card"')).Count         # 期望 6
"dish  = " + ([regex]::Matches($out,'class="dish-card"')).Count        # 期望 8
"pager = " + ([regex]::Matches($out,'id="pager"')).Count               # 期望 0（用户要求删除）
"og    = " + ([regex]::Matches($out,'property="og:image"')).Count      # 期望 1
```

### 7.2 滚轮翻页 + 吸附测试（注入临时脚本，测完删掉临时文件）

```powershell
$html = Get-Content (Join-Path $dir "index.html") -Raw -Encoding UTF8
$inject = @'
<script>
window.__errs=[];window.addEventListener('error',function(e){window.__errs.push(e.message)});
window.addEventListener('load',function(){setTimeout(function(){
 var d=document.getElementById('deck');var log=[];
 function w(dy){return d.dispatchEvent(new WheelEvent('wheel',{deltaY:dy,bubbles:true,cancelable:true}));}
 log.push('a='+HXDeck.index()+'/'+d.scrollTop);
 w(120);
 setTimeout(function(){
   log.push('b='+HXDeck.index()+'/'+d.scrollTop);
   w(-120);
   setTimeout(function(){
     log.push('c='+HXDeck.index()+'/'+d.scrollTop);
     d.scrollTop = d.clientHeight*1.45;      // 故意停在两页之间
     setTimeout(function(){
       log.push('snap='+HXDeck.index()+'/'+Math.round(d.scrollTop));
       var pre=document.createElement('pre');pre.id='t';pre.style.display='none';
       pre.textContent=log.join(' | ')+' | errors='+(window.__errs.join(';')||'none');
       document.body.appendChild(pre);
     },700);
   },900);
 },900);
},600);});
</script>
'@
$html = $html -replace '</body>', ($inject + '</body>')
Set-Content -Path (Join-Path $dir "_test.html") -Value $html -Encoding UTF8
& $edge --headless=new --disable-gpu --no-first-run --no-default-browser-check `
  --user-data-dir="$env:TEMP\dsh-wheel" --window-size=1440,900 --virtual-time-budget=12000 `
  --dump-dom ([System.Uri]($dir + "\_test.html")).AbsoluteUri 2>$null | Out-String
# 期望：a=0/0 | b=1/805 | c=0/0 | snap≈805（回到整页） | errors=none
Remove-Item (Join-Path $dir "_test.html") -Force
```

### 7.3 逐页截图（临时探头页）

```powershell
$html = Get-Content (Join-Path $dir "index.html") -Raw -Encoding UTF8
$inject = '<script>window.addEventListener("load",function(){var p=new URLSearchParams(location.search);if(window.HXDeck)window.HXDeck.go(Number(p.get("page")||0),true);});</script>'
$html = $html -replace '</body>', ($inject + '</body>')
Set-Content -Path (Join-Path $dir "_probe.html") -Value $html -Encoding UTF8
# 然后：_probe.html?page=3 截图
& $edge --headless=new --disable-gpu --hide-scrollbars --no-first-run --no-default-browser-check `
  --user-data-dir="$env:TEMP\dsh-shot" --window-size=1440,900 --virtual-time-budget=6000 `
  --screenshot="$dir\_page3.png" ([System.Uri]($dir + "\_probe.html")).AbsoluteUri
# 注意：?page=N 要拼在 URI 后面；测完删 _probe.html 和截图
```

手机尺寸用 `--window-size=504,900`（无头最小宽度限制）；真实 390px 请用浏览器 F12 设备模拟。

### 7.4 验收清单

- [ ] 滚轮往下/往上都是一页一页，松手停在整页；故意滚到两页之间会自动吸附回页首。
- [ ] 8 页顺序与顶部导航一致；没有底部翻页条、没有右侧圆点。
- [ ] 四语切换后仍停留在当前页，内容完整。
- [ ] 港口点击、词源卡翻面、答题、时间轴、AI 弹窗均可用。
- [ ] 1440×900、1280×720、504×900 下每页内容不被裁切；手机无底部遮挡。
- [ ] 答题提交前后，标题/题目位置不跳。
- [ ] `index.html` 双击（`file://`）可直接运行，无控制台报错。

---

## 8. 待办（下一任优先做）

1. **替换团队信息**：`js/i18n.js` → `about_team` / `about_team2`（4 语各一次）。
2. **部署**：Netlify Drop / GitHub Pages / Vercel；得到网址后运行
   `powershell -ExecutionPolicy Bypass -File tools/set-site-url.ps1 https://你的域名`
   （替换 4 处 `__SITE_URL__`），再用 opengraph.xyz / 微信分享验证卡片。
3. **真实手机复核**：港口页与答题页各过一遍，确认一屏一页、无裁切；极窄屏如需可调 `deck.css` 手机块字号。
4. **录 2–3 分钟演示视频**：滑动翻页 → 地图点击 → 词源翻卡 → 四语切换 → 答题 → 工序。
5. **打包提交**：`index.html`、`css/`、`js/`、`README.md`、`AI创作说明.md`；`backup/`、`preview/` 可删（不影响运行）。
6. 如果用户后续想「纯滑动、不要顶部导航」，把 `.nav-links` 移除并去掉 `goTo` 的锚点拦截即可。

---

## 9. 修改速查

| 想改什么 | 改哪里 |
|---|---|
| 菜名/故事/译名/题目 | `js/data.js`（四语对象一起改） |
| 界面文案/团队名 | `js/i18n.js` |
| 配色 | `css/base.css` 顶部 `:root`（`--cinnabar`/`--teal`/`--paper`/`--deep`） |
| 翻页手感 | `js/deck.js`：滚轮阈值 36、静默 650ms、动画 560ms、`fitPages` 最低 0.5 |
| 每页留白/字号 | `css/deck.css` 的 `.sec-head`、页面分块、手机 `@media (max-width:860px)` |
| 卡片圆角 | `css/sections.css` 末尾「圆角柔化」块（8–18px） |
| 首屏印章 | `index.html` 的 `.seal-oval` SVG + `css/base.css` 的 `.seal-oval` |
| 分享封面 | `tools/og-cover.html` → headless 截图 → 转 `preview/og-cover.jpg` |
| 新增一页 | 复制一个 `<section class="section sec-paper">`，加 id 和顶部导航 `<a href="#新id">`；`deck.js` 自动收集 |

---

## 10. 版本备份规则（用户强制要求）

- **每次改动前**：把当前可用版本复制到 `backup/vN-描述/`，不要覆盖旧版本。
- 版本清单在 `backup/versions.md`，记录「改了什么 + 时间」。
- 现有备份：`v1-scroll`（最早滚动版）、`v2-deck`（点击翻页）、`v3-fixes`、`v4-current`、`v5-scrollsnap`、`v6-nopager`（当前）。
- **在用户明确说「可以删了」之前，不要删除任何 `backup/` 内容。**
- 恢复方法：把对应版本里的 `index.html`、`css/`、`js/`、`tools/` 覆盖回根目录即可。

---

## 11. 联系/上下文

- 当前执行者是团队模块 A；用户是团队成员，审阅时偏好看实际效果截图。
- 用户历史反馈（已修）：手机翻页球遮内容、缺 OG、答题跳动、方框太尖锐、印章太方正、点击翻页不想要。
- 交互基调：**克制的排版 + 海洋蓝/宣纸米/朱砂 + 汉字当视觉主体**；不要引入花哨第三方库或大面积动画。

---

## 12. v9 · 插画层与两个新页（2026-11-18）

在**不删除任何原有内容**的前提下，给版面加了一层「绘画」：

- 新增文件：css/art.css、js/art.js（零依赖、ile:// 双击可跑）。加载顺序在 deck.js 之后。
- **首屏**：罗盘内的线稿换成水墨场景（日 / 远山 / 帆船 / 海鸥 / 浪 / 星），多层轻微动效 + 鼠标视差；环文与红印章保留。
- **地图**：海岸线重画（莱州湾、胶州湾、荣成岬、黄河三角洲、长山列岛），加海岸排线晕染、内湾细线、黄海小帆船、西侧内陆淡出。
- **八道菜**：.dish-plate 里的单字换成对应插画（线描 + 淡彩），单字降为卡片角落水印；hover 有蒸汽。
- **词源卡**：六张卡各有一枚水印纹样（茶 / 参 / 蛤 / 昆布 / 鲍 / 帆）。
- **工序**：六步换成更大的线描插画。
- **新增两页**（章节号顺延重排）：
  - 叁 · 解字「鲜」（#glyph）：鱼 + 羊 拆字插画，配三语「鲜」的说法。页内已注明「鱼+羊」是民间解字、不是考据结论。
  - 伍 · 四时（#tide）：可点击的四季转盘（春鲅鱼 / 夏蛤蜊 / 秋梭子蟹 / 冬牡蛎），数据在 js/data.js 的 SITE.seasons。
- **尾页**：#about 底部加收束场景（海平线 + 帆船 + 大字落款），填掉原来空着的下半屏。
- **导航**：新增「解字」「四时」；导航条按页面底色在深/浅间自动切换（ody.on-paper，由 rt.js 的 syncTone() 负责）。
- **无障碍**：装饰层全部 ria-hidden；prefers-reduced-motion: reduce 时动画关闭。
- **开发工具**：	ools/shot.mjs（CDP 真实渲染截图）、	ools/build-map.mjs（生成地图 SVG）。这两个只用于本地检查，不影响运行。

章节编号现状：壹 港口 / 贰 词源 / 叁 解字 / 肆 宴席 / 伍 四时 / 陆 工序 / 柒 侦探 / 捌 年表。
四语 kicker 数字（TABLE·04 / CRAFT·06 / QUIZ·07 / CHRONICLE·08）已同步改在 js/i18n.js。

> ⚠️ 待团队确认：js/data.js → aiStatement 与 AI创作说明.md 里写着「地图、图标与插画为团队手写 SVG」。
> 本轮新增插画是 AI 生成的 SVG（团队可再调色/改写）。若比赛要求如实申报，建议在那两处补一句说明。
