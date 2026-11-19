/* ============================================================
   海味山东 · art.js —— 插画层（SVG 线稿、装饰与四时插画）
   ① 首屏水墨场景（山/日/帆船/海鸥/浪）
   ② 八道菜的插画（线描 + 淡彩）
   ③ 词源卡水印纹样
   ④ 六道工序插画
   ⑤ 解字页「鲜」/ 四时页转盘
   ⑥ 版面装饰、视差与色调同步
   原则：不改动任何原有文案，只在它上面叠加绘画与动效。
   ============================================================ */
(function () {
  "use strict";

  var I18N = window.I18N || { order: ["zh"], zh: {} };
  var SITE = window.SITE || {};
  var LANG_KEY = "haixei-shandong-lang";

  var lang = "zh";
  try {
    var saved = localStorage.getItem(LANG_KEY);
    if (saved && I18N[saved]) lang = saved;
  } catch (e) { /* file:// 下可能被禁用 */ }

  function t(k) {
    var d = I18N[lang] || I18N.zh || {};
    return d[k] != null ? d[k] : ((I18N.zh && I18N.zh[k] != null) ? I18N.zh[k] : k);
  }
  function L(o) {
    if (o == null) return "";
    if (typeof o === "string") return o;
    return o[lang] != null ? o[lang] : (o.zh || o.en || "");
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ============================================================
     0 · 共享渐变与笔触图案
     ============================================================ */
  var DEFS =
    '<svg id="artDefs" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">' +
    "<defs>" +
      /* 瓷器 */
      '<radialGradient id="g-plate" cx="46%" cy="38%" r="68%">' +
        '<stop offset="0" stop-color="#fffdf7"/><stop offset=".62" stop-color="#f8f1e1"/><stop offset="1" stop-color="#eadfc8"/>' +
      "</radialGradient>" +
      /* 虾 */
      '<linearGradient id="g-prawn" x1="0" y1="0" x2=".4" y2="1">' +
        '<stop offset="0" stop-color="#e9884f"/><stop offset=".55" stop-color="#cf5c33"/><stop offset="1" stop-color="#a83a22"/>' +
      "</linearGradient>" +
      /* 汤 */
      '<radialGradient id="g-broth" cx="50%" cy="40%" r="60%">' +
        '<stop offset="0" stop-color="#f7e6bd"/><stop offset="1" stop-color="#dcbe86"/>' +
      "</radialGradient>" +
      /* 蛋羹 */
      '<radialGradient id="g-custard" cx="45%" cy="35%" r="65%">' +
        '<stop offset="0" stop-color="#fdf3cf"/><stop offset="1" stop-color="#eed69a"/>' +
      "</radialGradient>" +
      /* 海胆黄 */
      '<radialGradient id="g-roe" cx="40%" cy="30%" r="70%">' +
        '<stop offset="0" stop-color="#f4b45a"/><stop offset=".6" stop-color="#dd8a2c"/><stop offset="1" stop-color="#c06f1c"/>' +
      "</radialGradient>" +
      /* 凉粉 */
      '<linearGradient id="g-jelly" x1="0" y1="0" x2=".6" y2="1">' +
        '<stop offset="0" stop-color="#e2f2ec"/><stop offset="1" stop-color="#a9d2c8"/>' +
      "</linearGradient>" +
      /* 首屏天与海 */
      '<linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#08222f"/><stop offset=".55" stop-color="#0d4050"/><stop offset="1" stop-color="#17687a"/>' +
      "</linearGradient>" +
      '<linearGradient id="g-seascene" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#17647a"/><stop offset=".45" stop-color="#0d3f52"/><stop offset="1" stop-color="#061821"/>' +
      "</linearGradient>" +
      '<radialGradient id="g-sun" cx="50%" cy="50%" r="50%">' +
        '<stop offset="0" stop-color="#fff6e2"/><stop offset=".45" stop-color="#f7dfae"/><stop offset="1" stop-color="#e8bd7c"/>' +
      "</radialGradient>" +
      '<radialGradient id="g-moonwash" cx="50%" cy="50%" r="50%">' +
        '<stop offset="0" stop-color="#f7dfae" stop-opacity=".38"/><stop offset="1" stop-color="#f7dfae" stop-opacity="0"/>' +
      "</radialGradient>" +
      /* 笔墨 */
      '<linearGradient id="g-ridge" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#0a2c3c"/><stop offset="1" stop-color="#05161f"/>' +
      "</linearGradient>" +
      '<linearGradient id="g-ridge2" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#123f52" stop-opacity=".9"/><stop offset="1" stop-color="#082430" stop-opacity=".95"/>' +
      "</linearGradient>" +
      /* 木砧板 */
      '<linearGradient id="g-wood" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#d9c3a0"/><stop offset="1" stop-color="#c1a67d"/>' +
      "</linearGradient>" +
      /* 斜线排纹（海岸晕染） */
      '<pattern id="p-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">' +
        '<line x1="0" y1="0" x2="0" y2="6" stroke="#0a2233" stroke-width=".7" stroke-opacity=".22"/>' +
      "</pattern>" +
      /* 水面短横 */
      '<pattern id="p-ripple" width="26" height="14" patternUnits="userSpaceOnUse">' +
        '<path d="M2 7 q5 -3 10 0" fill="none" stroke="#1e6f7a" stroke-width=".8" stroke-opacity=".28"/>' +
        '<path d="M14 11 q4 -2 8 0" fill="none" stroke="#1e6f7a" stroke-width=".8" stroke-opacity=".18"/>' +
      "</pattern>" +
      /* 鱼皮／蒸汽柔化 */
      '<filter id="f-soft" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur stdDeviation="4"/>' +
      "</filter>" +
      '<filter id="f-haze" x="-40%" y="-40%" width="180%" height="180%">' +
        '<feGaussianBlur stdDeviation="10"/>' +
      "</filter>" +
      /* 首屏裁剪 */
      '<clipPath id="clip-hero"><circle cx="300" cy="300" r="223"/></clipPath>' +
    "</defs>" +
    "</svg>";

  /* ============================================================
     1 · 首屏水墨场景（替换罗盘内的线稿）
     ============================================================ */
  var HERO_SCENE =
    '<g clip-path="url(#clip-hero)">' +
      /* 天空 */
      '<rect x="70" y="70" width="460" height="470" fill="url(#g-sky)"/>' +
      /* 日与光晕 */
      '<circle class="sun-halo" cx="300" cy="252" r="104" fill="url(#g-moonwash)"/>' +
      '<circle class="sun-disc" cx="300" cy="252" r="58" fill="url(#g-sun)" opacity=".95"/>' +
      /* 远山 */
      '<path d="M70 306 C 118 288 140 300 166 288 C 190 277 206 292 232 282 C 258 272 274 288 300 280 C 326 272 344 286 370 280 C 398 273 416 290 444 284 C 472 278 496 294 530 288 L530 330 L70 330 Z" fill="#0b3446" opacity=".75"/>' +
      '<path d="M70 320 C 104 310 128 322 158 314 C 188 306 210 320 246 312 C 282 304 306 318 340 312 C 372 306 396 320 430 314 C 462 308 494 320 530 314 L530 340 L70 340 Z" fill="#092a3a" opacity=".85"/>' +
      /* 山脊的留白笔触 */
      '<g stroke="#8fd3d6" stroke-opacity=".18" stroke-width="1" fill="none">' +
        '<path d="M120 300 C 146 292 164 298 186 292"/>' +
        '<path d="M250 290 C 272 284 292 290 314 286"/>' +
        '<path d="M372 292 C 396 286 416 292 438 288"/>' +
      "</g>" +
      /* 海面 */
      '<rect x="70" y="326" width="460" height="220" fill="url(#g-seascene)"/>' +
      '<g class="glitter" fill="#f8e3b6">' +
        '<rect class="gl g1" x="266" y="332" width="68" height="4" rx="2" opacity=".55"/>' +
        '<rect class="gl g2" x="276" y="344" width="48" height="3.4" rx="1.7" opacity=".45"/>' +
        '<rect class="gl g3" x="258" y="357" width="84" height="3" rx="1.5" opacity=".32"/>' +
        '<rect class="gl g4" x="282" y="371" width="40" height="2.6" rx="1.3" opacity=".26"/>' +
      "</g>" +
      /* 帆船 */
      '<g class="scene-boat">' +
        '<ellipse cx="300" cy="386" rx="74" ry="7" fill="#02101a" opacity=".55" filter="url(#f-soft)"/>' +
        '<path d="M300 236 L300 372" stroke="#cfe6e2" stroke-opacity=".5" stroke-width="2"/>' +
        '<path d="M304 244 C 348 268 366 306 366 350 L366 366 C 344 360 322 358 304 358 Z" fill="#f3ead5" stroke="#cbbfa2" stroke-width=".8"/>' +
        '<g stroke="#a89a7d" stroke-width=".9" opacity=".75">' +
          '<path d="M305 262 L364 286"/><path d="M305 288 L366 314"/><path d="M305 314 L366 340"/><path d="M305 338 L366 360"/>' +
        "</g>" +
        '<path d="M296 256 C 260 282 246 314 246 350 L246 358 C 264 354 282 354 296 354 Z" fill="#e9dcbe" opacity=".92" stroke="#c3b494" stroke-width=".8"/>' +
        '<g stroke="#a89a7d" stroke-width=".85" opacity=".7">' +
          '<path d="M295 276 L248 300"/><path d="M295 300 L247 326"/><path d="M295 324 L247 350"/>' +
        "</g>" +
        '<path d="M300 232 L322 228 L300 240 Z" fill="#b8452f" opacity=".9"/>' +
        '<g stroke="#cfe6e2" stroke-opacity=".35" stroke-width=".8" fill="none">' +
          '<path d="M300 240 L246 352"/><path d="M300 240 L366 356"/>' +
        "</g>" +
        /* 船身 */
        '<path d="M236 366 C 260 384 340 384 364 366 C 358 384 344 392 324 394 L276 394 C 256 392 242 384 236 366 Z" fill="#081c26" stroke="#0f3b4c" stroke-width="1.2"/>' +
        '<path d="M240 371 C 266 386 334 386 360 371" fill="none" stroke="#79cfd6" stroke-opacity=".28" stroke-width="1"/>' +
        /* 水花 */
        '<g stroke="#bfe8e5" stroke-opacity=".35" stroke-width="1.2" fill="none">' +
          '<path d="M226 392 c 10 -6 18 -6 26 0"/><path d="M348 392 c 10 -6 18 -6 26 0"/>' +
        "</g>" +
      "</g>" +
      /* 海鸥 */
      '<g class="gulls" stroke="#e7f3f2" stroke-opacity=".75" stroke-width="1.6" fill="none" stroke-linecap="round">' +
        '<path class="gull gu1" d="M196 214 q 9 -9 18 0 q 9 -9 18 0"/>' +
        '<path class="gull gu2" d="M372 178 q 7 -7 14 0 q 7 -7 14 0"/>' +
        '<path class="gull gu3" d="M406 236 q 6 -6 12 0 q 6 -6 12 0"/>' +
      "</g>" +
      /* 星点 */
      '<g class="scene-stars" fill="#bfe8e5">' +
        '<circle class="st st1" cx="164" cy="150" r="1.6"/><circle class="st st2" cx="228" cy="120" r="1.1"/>' +
        '<circle class="st st3" cx="352" cy="132" r="1.3"/><circle class="st st4" cx="424" cy="168" r="1"/>' +
        '<circle class="st st5" cx="132" cy="230" r="1"/>' +
      "</g>" +
      /* 近景浪 */
      '<g class="near-waves" stroke="#8fd3d6" stroke-opacity=".22" stroke-width="1.4" fill="none" stroke-linecap="round">' +
        '<path class="nw nw1" d="M108 430 c 22 -16 40 -16 62 0 s 40 16 62 0 s 40 -16 62 0"/>' +
        '<path class="nw nw2" d="M150 458 c 22 -16 40 -16 62 0 s 40 16 62 0 s 40 -16 62 0"/>' +
        '<path class="nw nw3" d="M212 488 c 20 -14 36 -14 56 0 s 36 14 56 0"/>' +
      "</g>" +
      /* 墨点收边 */
      '<g fill="#0a2233" opacity=".5">' +
        '<circle cx="112" cy="392" r="2.4"/><circle cx="146" cy="406" r="1.5"/>' +
        '<circle cx="470" cy="418" r="2"/><circle cx="494" cy="398" r="1.2"/>' +
      "</g>" +
    "</g>";

  /* ============================================================
     2 · 八道菜的插画（viewBox 200×116）
     ============================================================ */
  function steam(x, y) {
    return '<g class="steam" stroke="#0a2233" stroke-opacity=".2" stroke-width="1.5" fill="none" stroke-linecap="round">' +
      '<path d="M' + x + " " + y + " c -5 -7 5 -11 0 -18" + '"/>' +
      '<path d="M' + (x + 11) + " " + (y + 4) + " c -5 -7 5 -11 0 -18" + '"/>' +
      "</g>";
  }

  function plate(cx, cy, rx, ry) {
    return '<ellipse cx="' + cx + '" cy="' + (cy + 6) + '" rx="' + (rx + 2) + '" ry="' + (ry - 2) + '" fill="#0a2233" opacity=".07"/>' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="url(#g-plate)" stroke="#0a2233" stroke-opacity=".28"/>' +
      '<ellipse cx="' + cx + '" cy="' + (cy + 1) + '" rx="' + (rx - 13) + '" ry="' + (ry - 4) + '" fill="none" stroke="#0a2233" stroke-opacity=".1"/>';
  }

  function prawn(x, y, rot, s, tone) {
    tone = tone || "url(#g-prawn)";
    return '<g transform="translate(' + x + " " + y + ") rotate(" + rot + ") scale(" + s + ')">' +
      '<path d="M-30 2 c 0 -9 9 -15 21 -15 c 13 0 22 5 24 12 c 1 6 -5 11 -14 13 l-6 2" fill="' + tone + '" stroke="#8c3018" stroke-width="1.1" stroke-linejoin="round"/>' +
      '<g stroke="#8c3018" stroke-width=".9" fill="none" opacity=".7">' +
        '<path d="M-2 -9 c 4 4 5 9 3 14"/><path d="M7 -7 c 4 4 5 9 3 14"/><path d="M16 -4 c 3 4 4 8 2 12"/>' +
      "</g>" +
      '<ellipse cx="-16" cy="-3" rx="9.5" ry="7.4" fill="#d0673a" stroke="#8c3018" stroke-width="1.1"/>' +
      '<circle cx="-19" cy="-5" r="1.5" fill="#1a0f08"/>' +
      '<path d="M-24 -8 c -7 -5 -13 -5 -17 0 M-25 -3 c -8 -2 -13 1 -16 6" stroke="#8c3018" stroke-width=".9" fill="none" stroke-linecap="round"/>' +
      '<path d="M20 12 c 7 4 11 9 8 13 c -4 2 -10 -2 -13 -7" fill="#e07b45" stroke="#8c3018" stroke-width="1"/>' +
      '<path d="M-14 -6 c 6 -3 14 -3 20 1" stroke="#ffd9b8" stroke-opacity=".55" stroke-width="1.4" fill="none"/>' +
      "</g>";
  }

  function dumpling(x, y, s, rot) {
    return '<g transform="translate(' + x + " " + y + ") rotate(" + rot + ") scale(" + s + ')">' +
      '<path d="M-19 6 c -1 -12 8 -20 19 -20 c 11 0 20 8 19 20 q -19 8 -38 0 Z" fill="#faf4e3" stroke="#0a2233" stroke-opacity=".38" stroke-width="1.1"/>' +
      '<path d="M-15 6 q 15 6 30 0" fill="none" stroke="#0a2233" stroke-opacity=".18" stroke-width="1"/>' +
      '<g stroke="#0a2233" stroke-opacity=".26" fill="none" stroke-width=".95">' +
        '<path d="M-10 -6 q 3 6 6 1"/><path d="M-2 -10 q 3 7 6 2"/><path d="M7 -9 q 3 6 6 1"/>' +
      "</g>" +
      '<path d="M-13 -1 q 13 -7 26 0" stroke="#ffffff" stroke-opacity=".8" fill="none" stroke-width="1.8"/>' +
      "</g>";
  }

  function clam(x, y, s, rot) {
    return '<g transform="translate(' + x + " " + y + ") rotate(" + rot + ") scale(" + s + ')">' +
      '<path d="M0 8 C -13 8 -19 1 -19 -4 C -19 -6 -17 -7 -14.5 -7 L14.5 -7 C 17 -7 19 -6 19 -4 C 19 1 13 8 0 8 Z" fill="#f2e7cf" stroke="#0a2233" stroke-opacity=".38" stroke-width="1.1"/>' +
      '<g stroke="#0a2233" stroke-opacity=".22" fill="none" stroke-width=".9">' +
        '<path d="M0 7 L-9 -6"/><path d="M0 7 L-3.5 -7"/><path d="M0 7 L3.5 -7"/><path d="M0 7 L9 -6"/>' +
      "</g>" +
      '<ellipse cx="0" cy="-2.6" rx="6.4" ry="3.2" fill="#e0c49c" stroke="#0a2233" stroke-opacity=".28" stroke-width=".9"/>' +
      '<path d="M-19 -4 q 19 7 38 0" fill="none" stroke="#0a2233" stroke-opacity=".26" stroke-width="1"/>' +
      "</g>";
  }

  function chili(x, y, rot, s) {
    return '<g transform="translate(' + x + " " + y + ") rotate(" + rot + ") scale(" + s + ')">' +
      '<path d="M0 0 c 9 2 14 8 14 15 c 0 2 -2 3 -3.4 .8 c -3 -5 -7 -9 -12 -12 Z" fill="#c4402c" stroke="#8a2318" stroke-width=".8"/>' +
      '<path d="M0 0 c -3 -2 -6 -1 -7 2" stroke="#5f7d3f" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      "</g>";
  }

  function cube(x, y, s) {
    return '<g transform="translate(' + x + " " + y + ") scale(" + s + ')">' +
      '<path d="M0 -11 L17 -1 L0 9 L-17 -1 Z" fill="url(#g-jelly)" stroke="#4b7a72" stroke-opacity=".45" stroke-width=".9"/>' +
      '<path d="M-17 -1 L0 9 L0 21 L-17 11 Z" fill="#9cc6bd" opacity=".8" stroke="#4b7a72" stroke-opacity=".35" stroke-width=".9"/>' +
      '<path d="M17 -1 L0 9 L0 21 L17 11 Z" fill="#7cb2a8" opacity=".85" stroke="#4b7a72" stroke-opacity=".35" stroke-width=".9"/>' +
      '<path d="M-11 -1 L0 -7 L11 -1" stroke="#ffffff" stroke-opacity=".55" fill="none" stroke-width="1"/>' +
      "</g>";
  }

  function bowl(cx, cy, w, fill) {
    var h = w * .62, rx = w / 2;
    return '<g class="bowl">' +
      '<path d="M' + (cx - rx) + " " + cy + " q " + rx + " " + (h * 1.25) + " " + w + " 0 q -6 " + (-h * .1) + " " + (-w) + ' 0 Z" fill="#0a2233" opacity=".07" transform="translate(0,5)"/>' +
      '<path d="M' + (cx - rx) + " " + cy + " q " + rx + " " + (h * 1.2) + " " + w + " 0 q -4 -6 -10 -7 l " + (-w + 20) + ' 0 q -6 1 -10 7 Z" fill="' + fill + '" stroke="#0a2233" stroke-opacity=".35" stroke-width="1.3"/>' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + (rx * .17) + '" fill="#fffdf7" stroke="#0a2233" stroke-opacity=".35" stroke-width="1.3"/>' +
      "</g>";
  }

  function noodleStrand(x, y, w, amp) {
    var d = "M" + x + " " + y;
    var step = w / 4;
    for (var i = 0; i < 4; i++) {
      d += " q " + (step / 2) + " " + (i % 2 === 0 ? -amp : amp) + " " + step + " 0";
    }
    return '<path d="' + d + '" fill="none" stroke="#eaddbc" stroke-width="3" stroke-linecap="round" opacity=".95"/>';
  }

  var DISH_ART = {
    /* 葱烧海参 */
    haishen: function () {
      return plate(100, 84, 70, 14) +
        '<ellipse cx="100" cy="83" rx="47" ry="9" fill="#4a2a17" opacity=".85"/>' +
        '<ellipse cx="100" cy="81" rx="32" ry="5.5" fill="#66391f" opacity=".5"/>' +
        /* 后排海参 */
        '<path d="M104 74 c -1 -6 6 -10 16 -10 c 9 0 15 4 15 8 c 0 5 -8 8 -16 8 c -8 0 -14 -2 -15 -6 Z" fill="#1d120c" stroke="#0d0805" stroke-width=".9"/>' +
        /* 前排海参 */
        '<path d="M60 79 c -2 -9 9 -14 22 -14 c 13 0 22 5 22 11 c 0 6 -10 9 -22 9 c -12 0 -21 -2 -22 -6 Z" fill="#2b1a12" stroke="#120b07" stroke-width="1"/>' +
        '<g fill="#3d2718">' +
          '<circle cx="70" cy="71" r="1.7"/><circle cx="78" cy="68.5" r="1.9"/><circle cx="87" cy="68" r="1.8"/>' +
          '<circle cx="96" cy="69" r="1.9"/><circle cx="103" cy="71" r="1.6"/>' +
        "</g>" +
        '<path d="M66 75 c 9 -4 21 -5 31 -2" stroke="#8d6740" stroke-width="1.2" fill="none" opacity=".75"/>' +
        '<path d="M72 78 c 9 -3 17 -3 23 -1" stroke="#d3b384" stroke-width=".9" fill="none" opacity=".4"/>' +
        /* 葱段 */
        '<g fill="#f7f0dc" stroke="#0a2233" stroke-opacity=".4" stroke-width="1">' +
          '<rect x="120" y="72" width="21" height="7.2" rx="3.5" transform="rotate(-9 130 75)"/>' +
          '<rect x="48" y="79" width="18" height="6.6" rx="3.2" transform="rotate(7 57 82)"/>' +
        "</g>" +
        '<g fill="#7e9d55" stroke="#0a2233" stroke-opacity=".28" stroke-width=".9">' +
          '<rect x="132" y="77" width="13" height="5.6" rx="2.8" transform="rotate(-15 138 80)"/>' +
          '<rect x="44" y="86" width="11" height="5" rx="2.5" transform="rotate(12 49 88)"/>' +
        "</g>" +
        steam(112, 60);
    },

    /* 油焖大虾 */
    prawn: function () {
      return plate(100, 84, 72, 14) +
        '<ellipse cx="100" cy="84" rx="52" ry="9" fill="#8b3a20" opacity=".35"/>' +
        prawn(118, 72, 16, .82, "url(#g-prawn)") +
        prawn(94, 80, -8, 1) +
        '<g fill="#7e9d55" stroke="#0a2233" stroke-opacity=".25" stroke-width=".8">' +
          '<rect x="54" y="82" width="16" height="5.4" rx="2.7" transform="rotate(10 62 85)"/>' +
          '<rect x="128" y="88" width="14" height="5" rx="2.5" transform="rotate(-8 135 90)"/>' +
        "</g>" +
        '<ellipse cx="84" cy="90" rx="9" ry="2.4" fill="#c8763f" opacity=".35"/>' +
        steam(74, 58);
    },

    /* 鲅鱼水饺 */
    dumpling: function () {
      return plate(100, 86, 72, 14) +
        '<ellipse cx="100" cy="86" rx="56" ry="10" fill="#efe6d3" opacity=".7"/>' +
        dumpling(78, 76, .78, -6) +
        dumpling(122, 76, .78, 7) +
        dumpling(100, 74, .86, 0) +
        dumpling(92, 92, .95, 3) +
        dumpling(114, 93, .9, -5) +
        /* 醋碟 */
        '<g><ellipse cx="158" cy="100" rx="16" ry="6" fill="#f7f0dd" stroke="#0a2233" stroke-opacity=".3"/>' +
          '<ellipse cx="158" cy="100" rx="10" ry="3.4" fill="#6b4326" opacity=".6"/></g>' +
        steam(64, 60);
    },

    /* 辣炒蛤蜊 */
    clam: function () {
      return '<ellipse cx="100" cy="88" rx="74" ry="15" fill="#0a2233" opacity=".1"/>' +
        '<ellipse cx="100" cy="84" rx="72" ry="14" fill="#2f3a3d" stroke="#0a2233" stroke-opacity=".45"/>' +
        '<ellipse cx="100" cy="85" rx="58" ry="10" fill="#3d4b4d" opacity=".6"/>' +
        '<ellipse cx="100" cy="84" rx="48" ry="8" fill="#7a3a22" opacity=".55"/>' +
        clam(78, 78, 1.05, -12) + clam(112, 76, 1, 10) + clam(96, 84, 1.15, 0) + clam(126, 88, .9, -18) +
        chili(62, 74, -18, 1) + chili(134, 78, 14, 1.1) +
        '<g fill="#c4402c" opacity=".5"><circle cx="86" cy="92" r="1.6"/><circle cx="108" cy="93" r="1.3"/><circle cx="120" cy="90" r="1.1"/></g>' +
        '<g fill="#f2e7cf" stroke="#0a2233" stroke-opacity=".25" stroke-width=".8" opacity=".9">' +
          '<ellipse cx="70" cy="89" rx="5" ry="2.4"/><ellipse cx="130" cy="83" rx="4.4" ry="2.2"/>' +
        "</g>" +
        steam(108, 58);
    },

    /* 海凉粉 */
    jelly: function () {
      return plate(100, 88, 68, 13) +
        '<ellipse cx="100" cy="88" rx="52" ry="9" fill="#dceee6" opacity=".7"/>' +
        '<g opacity=".92">' + cube(80, 72, 1.05) + cube(116, 76, .95) + cube(96, 84, 1.15) + cube(128, 92, .8) + "</g>" +
        '<g stroke="#6f9a5f" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".85">' +
          '<path d="M64 86 c 8 -4 14 -2 20 2"/><path d="M70 92 c 8 -3 13 -1 18 3"/>' +
          '<path d="M132 84 c 8 -3 14 -1 18 3"/>' +
        "</g>" +
        '<g fill="#0a2233" opacity=".14"><circle cx="92" cy="94" r="1.2"/><circle cx="104" cy="97" r="1"/><circle cx="84" cy="97" r=".9"/></g>' +
        steam(72, 58);
    },

    /* 海鲜疙瘩汤 */
    soup: function () {
      return bowl(100, 66, 124, "#f8f2e4") +
        '<ellipse cx="100" cy="66" rx="52" ry="9" fill="url(#g-broth)" stroke="#0a2233" stroke-opacity=".28"/>' +
        /* 面疙瘩 */
        '<g fill="#fbf3dd" stroke="#c9b489" stroke-width=".7">' +
          '<ellipse cx="86" cy="64" rx="6" ry="4"/><ellipse cx="104" cy="68" rx="5.4" ry="3.6"/>' +
          '<ellipse cx="118" cy="63" rx="4.6" ry="3.2"/><ellipse cx="74" cy="69" rx="4.2" ry="3"/>' +
          '<ellipse cx="96" cy="60" rx="3.8" ry="2.8"/><ellipse cx="112" cy="70" rx="3.4" ry="2.6"/>' +
        "</g>" +
        /* 虾尾 */
        '<g transform="translate(122 62) rotate(-28) scale(.55)">' +
          '<path d="M0 0 c 10 0 16 4 16 9 c 0 4 -6 6 -12 6" fill="url(#g-prawn)" stroke="#8c3018" stroke-width="1"/>' +
          '<path d="M15 13 c 5 3 8 7 6 10 c -4 1 -8 -2 -10 -6" fill="#e07b45" stroke="#8c3018" stroke-width="1"/>' +
        "</g>" +
        /* 海菜 */
        '<g stroke="#3f6b52" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".9">' +
          '<path d="M76 62 c 6 -6 12 -6 18 -2"/><path d="M92 66 c 5 -5 11 -5 16 -2"/>' +
        "</g>" +
        /* 汤面油花 */
        '<g fill="#e8c78a" opacity=".8"><circle cx="80" cy="59" r="1.4"/><circle cx="108" cy="64" r="1.2"/><circle cx="98" cy="71" r="1.1"/></g>' +
        /* 勺 */
        '<g transform="translate(150 78) rotate(-24)">' +
          '<ellipse cx="0" cy="0" rx="11" ry="6" fill="#f4ecdb" stroke="#0a2233" stroke-opacity=".3"/>' +
          '<path d="M9 2 l 22 8" stroke="#0a2233" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>' +
        "</g>" +
        steam(84, 44);
    },

    /* 蓬莱小面 */
    noodle: function () {
      return bowl(100, 64, 116, "#f7f0e0") +
        '<ellipse cx="100" cy="64" rx="48" ry="8" fill="url(#g-broth)" stroke="#0a2233" stroke-opacity=".26"/>' +
        noodleStrand(62, 62, 76, 3.2) +
        noodleStrand(64, 66, 72, 3) +
        noodleStrand(66, 70, 68, 2.6) +
        /* 蛋 */
        '<g transform="translate(122 62)"><ellipse cx="0" cy="0" rx="10" ry="6.4" fill="#fdf8e8" stroke="#c8b793" stroke-width=".8"/>' +
          '<ellipse cx="0" cy="0" rx="5.4" ry="3.4" fill="#e8a92e"/></g>' +
        '<g fill="#5c8a4f" opacity=".9"><circle cx="80" cy="70" r="1.6"/><circle cx="88" cy="73" r="1.3"/><circle cx="74" cy="66" r="1.2"/></g>' +
        '<g stroke="#7ea86b" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"><path d="M94 72 c 4 -4 8 -4 12 -1"/></g>' +
        steam(72, 40);
    },

    /* 海胆蒸蛋 */
    urchin: function () {
      return '<ellipse cx="100" cy="92" rx="62" ry="10" fill="#0a2233" opacity=".08"/>' +
        '<path d="M52 78 q 48 26 96 0 q -6 22 -48 22 q -42 0 -48 -22 Z" fill="#f6efdf" stroke="#0a2233" stroke-opacity=".35" stroke-width="1.3"/>' +
        '<ellipse cx="100" cy="78" rx="50" ry="9" fill="#f8f1e0" stroke="#0a2233" stroke-opacity=".35" stroke-width="1.3"/>' +
        '<ellipse cx="100" cy="78" rx="41" ry="6.6" fill="url(#g-custard)" stroke="#d8c091" stroke-width=".9"/>' +
        /* 海胆黄 */
        '<g fill="url(#g-roe)" stroke="#a85f16" stroke-width=".7">' +
          '<ellipse cx="86" cy="77" rx="10" ry="5.4" transform="rotate(-8 86 77)"/>' +
          '<ellipse cx="104" cy="75.6" rx="9.4" ry="5" transform="rotate(6 104 76)"/>' +
          '<ellipse cx="118" cy="78" rx="7" ry="4" transform="rotate(-4 118 78)"/>' +
        "</g>" +
        '<g fill="#f6c878" opacity=".55"><circle cx="84" cy="76" r=".9"/><circle cx="88" cy="78" r=".7"/><circle cx="102" cy="74.6" r=".8"/><circle cx="106" cy="76.4" r=".6"/></g>' +
        '<g stroke="#5c8a4f" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".85"><path d="M70 74 c 4 -4 8 -3 11 0"/><path d="M126 80 c 4 -3 7 -2 9 1"/></g>' +
        steam(112, 52);
    }
  };

  /* ============================================================
     3 · 词源卡水印纹样（viewBox 0 0 120 120）
     ============================================================ */
  var LEX_MOTIF = {
    "茶": '<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">' +
      '<path d="M24 96 q 12 -8 26 -6 q 16 2 24 8 q -18 10 -34 6 q -12 -3 -16 -8 Z"/>' +
      '<path d="M34 90 q 6 -26 10 -40"/><path d="M44 50 q -14 -4 -18 -16 q 14 0 18 16 Z"/><path d="M44 50 q 14 -6 16 -20 q -14 2 -16 20 Z"/>' +
      '<path d="M70 74 c 0 -14 16 -22 30 -18 c -2 14 -16 24 -30 18 Z"/></g>',

    "参": '<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">' +
      '<path d="M30 78 c 0 -12 10 -18 22 -18 c 12 0 20 6 20 12 c 0 6 -10 10 -22 10 c -12 0 -20 -1 -20 -4 Z"/>' +
      '<g stroke-width="1"><circle cx="38" cy="66" r="2"/><circle cx="46" cy="63" r="2.2"/><circle cx="56" cy="62" r="2"/><circle cx="66" cy="64" r="2"/><circle cx="72" cy="67" r="1.8"/></g>' +
      '<path d="M20 96 c 10 -8 20 -8 30 0 c 10 8 20 8 30 0 c 10 -8 20 -8 30 0"/>' +
      '<path d="M20 106 c 10 -8 20 -8 30 0 c 10 8 20 8 30 0 c 10 -8 20 -8 30 0"/></g>',

    "蛤": '<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">' +
      '<path d="M60 96 C 34 96 20 80 20 68 C 20 62 26 58 34 58 L86 58 C 94 58 100 62 100 68 C 100 80 86 96 60 96 Z"/>' +
      '<path d="M60 94 L40 60"/><path d="M60 94 L54 58"/><path d="M60 94 L66 58"/><path d="M60 94 L80 60"/>' +
      '<ellipse cx="60" cy="70" rx="12" ry="6"/></g>',

    "昆": '<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">' +
      '<path d="M46 108 C 40 84 42 58 52 34"/><path d="M68 108 C 74 82 74 56 66 32"/>' +
      '<path d="M50 44 q -16 8 -14 26 q 14 -2 16 -22"/><path d="M64 40 q 18 6 18 26 q -16 0 -20 -22"/>' +
      '<path d="M52 70 q -18 6 -18 26 q 16 0 20 -22"/><path d="M64 66 q 18 8 16 28 q -16 -2 -18 -24"/></g>',

    "鲍": '<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">' +
      '<path d="M60 100 C 30 100 16 82 20 64 C 24 46 44 30 62 30 C 86 30 102 46 102 66 C 102 86 84 100 60 100 Z"/>' +
      '<path d="M24 66 C 40 52 62 46 86 50"/><path d="M28 78 C 44 62 66 56 92 60"/><path d="M36 88 C 50 74 70 68 96 72"/>' +
      '<circle cx="34" cy="60" r="4"/><circle cx="36" cy="74" r="3"/><circle cx="40" cy="86" r="2.6"/></g>',

    "帆": '<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">' +
      '<path d="M60 26 L60 92"/><path d="M64 32 C 88 46 96 66 96 84 L96 88 C 84 84 74 84 64 84 Z"/>' +
      '<path d="M56 40 C 38 52 32 70 32 84 L32 88 C 42 85 50 85 56 85 Z"/>' +
      '<path d="M28 94 C 40 104 80 104 92 94"/></g>'
  };

  /* ============================================================
     4 · 工序插画（viewBox 0 0 120 84，线条走 currentColor）
     ============================================================ */
  var CRAFT_ART = {
    fish: '<ellipse cx="60" cy="72" rx="46" ry="6" fill="currentColor" opacity=".08"/>' +
      '<path d="M14 40 C 40 22 76 24 96 38 C 84 52 46 58 14 40 Z" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="1.5"/>' +
      '<path d="M96 38 l 14 -8 v 18 l -14 -4" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="1.5"/>' +
      '<circle cx="32" cy="36" r="2" fill="currentColor"/>' +
      '<path d="M52 30 c 4 5 4 10 0 14" stroke="currentColor" stroke-width="1.1" fill="none" opacity=".6"/>' +
      '<path d="M28 24 c 6 -8 14 -10 22 -8" stroke="currentColor" stroke-width="1.2" fill="none" opacity=".5"/>' +
      '<g stroke="currentColor" stroke-width="1.2" fill="none" opacity=".55"><path d="M22 62 c 8 -6 16 -6 24 0"/><path d="M62 64 c 8 -5 15 -5 22 1"/></g>',

    knife: '<path d="M18 74 C 44 60 66 42 84 20 L 96 28 C 76 48 54 66 30 80 Z" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.5"/>' +
      '<path d="M84 20 L 96 28" stroke="currentColor" stroke-width="3"/>' +
      '<path d="M18 74 L 30 80" stroke="currentColor" stroke-width="3"/>' +
      '<path d="M44 46 C 56 44 66 48 72 56" stroke="currentColor" stroke-width="1.1" fill="none" opacity=".55"/>' +
      '<g stroke="currentColor" stroke-width="1.1" fill="none" opacity=".45"><path d="M14 84 c 10 -5 20 -5 30 0"/><path d="M50 84 c 10 -6 22 -6 32 0"/></g>',

    bowl: '<path d="M22 46 h 76 c -3 20 -18 30 -38 30 s -35 -10 -38 -30 Z" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="1.5"/>' +
      '<path d="M18 46 h 84" stroke="currentColor" stroke-width="1.5"/>' +
      '<path d="M60 42 v -26" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M46 22 c 10 -6 20 6 30 0" stroke="currentColor" stroke-width="1.1" fill="none" opacity=".5"/>' +
      '<g stroke="currentColor" stroke-width="1.2" fill="none" opacity=".5"><path d="M40 56 c 12 -6 28 -6 40 0"/><path d="M44 64 c 10 -4 22 -4 30 0"/></g>' +
      '<circle cx="60" cy="42" r="3" fill="currentColor" opacity=".5"/>',

    chive: '<g stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round">' +
      '<path d="M40 74 C 34 56 36 38 44 22"/><path d="M60 74 C 56 54 56 36 62 20"/><path d="M80 74 C 84 56 82 38 76 22"/>' +
      '<path d="M44 22 l -6 -8"/><path d="M62 20 l 4 -9"/><path d="M76 22 l 7 -7"/>' +
      '<path d="M36 52 c -10 -2 -16 -8 -16 -16" opacity=".6"/><path d="M84 52 c 10 -2 16 -8 16 -16" opacity=".6"/></g>' +
      '<path d="M32 76 h 56" stroke="currentColor" stroke-width="1.2" opacity=".4"/>' +
      '<circle cx="46" cy="80" r="2" fill="currentColor" opacity=".35"/><circle cx="58" cy="82" r="1.6" fill="currentColor" opacity=".25"/>',

    roller: '<rect x="16" y="30" width="62" height="16" rx="8" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="1.5"/>' +
      '<path d="M78 38 h 10 M 88 32 v 12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M30 50 v 14 M 66 50 v 14" stroke="currentColor" stroke-width="1.5"/>' +
      '<circle cx="30" cy="68" r="4" stroke="currentColor" stroke-width="1.4" fill="none"/>' +
      '<circle cx="66" cy="68" r="4" stroke="currentColor" stroke-width="1.4" fill="none"/>' +
      '<g stroke="currentColor" stroke-width="1" fill="none" opacity=".4"><path d="M14 74 c 8 -4 16 -4 24 0"/><path d="M58 76 c 8 -5 16 -5 24 0"/></g>' +
      '<g fill="currentColor" opacity=".3"><circle cx="20" cy="22" r="1.4"/><circle cx="34" cy="16" r="1.1"/><circle cx="48" cy="20" r="1.3"/><circle cx="96" cy="58" r="1.4"/><circle cx="104" cy="66" r="1"/></g>',

    pot: '<path d="M20 36 h 80 v 24 c 0 10 -8 16 -18 16 H 38 c -10 0 -18 -6 -18 -16 Z" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="1.5"/>' +
      '<path d="M14 36 h 92" stroke="currentColor" stroke-width="1.6"/>' +
      '<path d="M40 36 v -10 h 40 v 10" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
      '<g stroke="currentColor" stroke-width="1.3" fill="none" opacity=".55" stroke-linecap="round">' +
        '<path d="M44 18 c 4 -6 4 -10 0 -14"/><path d="M60 16 c 4 -6 4 -10 0 -14"/><path d="M76 18 c 4 -6 4 -10 0 -14"/></g>' +
      '<g fill="currentColor" opacity=".35"><ellipse cx="46" cy="44" rx="7" ry="3.4"/><ellipse cx="62" cy="42" rx="6.4" ry="3"/><ellipse cx="76" cy="45" rx="6" ry="3"/></g>' +
      '<path d="M20 30 c -6 0 -10 4 -10 8" stroke="currentColor" stroke-width="1.4" fill="none" opacity=".5"/>' +
      '<path d="M100 30 c 6 0 10 4 10 8" stroke="currentColor" stroke-width="1.4" fill="none" opacity=".5"/>'
  };

  /* ============================================================
     5 · 解字页「鲜」
     ============================================================ */
  var GLYPH_ART =
    '<svg class="glyph-svg" viewBox="0 0 420 420" role="img" aria-label="鲜：鱼与羊">' +
      '<defs>' +
        '<filter id="g-rough" x="-20%" y="-20%" width="140%" height="140%">' +
          '<feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" result="n"/>' +
          '<feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/>' +
        "</filter>" +
        '<radialGradient id="g-glyphwash" cx="50%" cy="45%" r="55%">' +
          '<stop offset="0" stop-color="#79cfd6" stop-opacity=".17"/><stop offset="1" stop-color="#79cfd6" stop-opacity="0"/>' +
        "</radialGradient>" +
      "</defs>" +
      '<circle cx="210" cy="196" r="196" fill="url(#g-glyphwash)"/>' +
      '<circle cx="210" cy="196" r="178" fill="none" stroke="#79cfd6" stroke-opacity=".2" stroke-dasharray="1 7"/>' +
      '<circle cx="210" cy="196" r="162" fill="none" stroke="#79cfd6" stroke-opacity=".1"/>' +
      /* 中央大字：鲜 */
      '<text class="gy-char" x="210" y="206" text-anchor="middle" font-size="182" font-family="var(--serif, serif)" fill="#f7f0dc" filter="url(#g-rough)">鲜</text>' +
      '<text class="gy-pinyin" x="210" y="248" text-anchor="middle" font-size="12" letter-spacing="9" fill="#79cfd6" fill-opacity=".6">x i ā n</text>' +
      /* 牵引虚线 */
      '<g stroke="#79cfd6" stroke-opacity=".3" stroke-width="1" stroke-dasharray="2 5" fill="none">' +
        '<path d="M168 262 C 156 282 146 292 132 300"/>' +
        '<path d="M252 262 C 264 282 274 292 288 300"/>' +
      "</g>" +
      /* 鱼：左 */
      '<g class="gy-fish" stroke="#bfe8e5" stroke-opacity=".9" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
        '<g transform="translate(108 314)">' +
          '<path d="M-54 0 C -32 -22 -2 -22 22 -4 C -2 16 -32 18 -54 0 Z" fill="#79cfd6" fill-opacity=".1"/>' +
          '<path d="M22 -4 l 18 -13 v 26 l -18 -5" fill="#79cfd6" fill-opacity=".1"/>' +
          '<circle cx="-38" cy="-4" r="2.8" fill="#bfe8e5" stroke="none"/>' +
          '<path d="M-12 -13 c 5 8 5 17 0 25" stroke-opacity=".45"/>' +
          '<path d="M-46 -14 c 8 -10 18 -13 26 -11" stroke-opacity=".45"/>' +
        "</g>" +
      "</g>" +
      /* 羊：右 */
      '<g class="gy-sheep" stroke="#f0d5a8" stroke-opacity=".9" fill="none" stroke-width="1.7" stroke-linecap="round">' +
        '<g transform="translate(310 312)">' +
          '<path d="M-30 -2 c -8 -2 -12 -8 -10 -15 c 2 -7 9 -11 16 -10 c 3 -9 12 -14 21 -12 c 9 2 15 9 15 17" fill="#f0d5a8" fill-opacity=".1"/>' +
          '<path d="M-30 -2 c 4 10 14 16 26 16 c 13 0 23 -7 26 -18" fill="#f0d5a8" fill-opacity=".06"/>' +
          '<path d="M-26 -16 c 3 -6 9 -9 15 -8" stroke-opacity=".55"/>' +
          '<path d="M-8 -25 c 4 -6 11 -8 16 -5" stroke-opacity=".55"/>' +
          '<circle cx="24" cy="-14" r="9"/>' +
          '<path d="M17 -22 c -6 -3 -9 1 -7 5" />' +
          '<path d="M31 -22 c 8 -4 13 2 10 8 c -2 4 -7 5 -10 2" />' +
          '<circle cx="27" cy="-16" r="1.5" fill="#f0d5a8" stroke="none"/>' +
          '<path d="M-18 14 v 14 M-6 16 v 14 M 8 16 v 14 M 18 12 v 15" stroke-opacity=".5"/>' +
        "</g>" +
      "</g>" +
      /* 鱼 / 羊 小注 */
      '<text class="gy-label" x="108" y="374" text-anchor="middle" font-size="13" letter-spacing="4" fill="#bfe8e5" fill-opacity=".55">鱼</text>' +
      '<text class="gy-label" x="312" y="374" text-anchor="middle" font-size="13" letter-spacing="4" fill="#f0d5a8" fill-opacity=".55">羊</text>' +
      /* 墨迹 */
      '<g fill="#0a2233" opacity="0"><circle cx="86" cy="120" r="3"/></g>' +
    "</svg>";

  /* ============================================================
     6 · 四时页
     ============================================================ */
  var SEASON_ICON = {
    spring: '<g stroke="#0a2233" stroke-opacity=".55" fill="none" stroke-width="1.6" stroke-linecap="round">' +
      '<path d="M48 74 C 78 46 118 40 146 56 C 124 78 84 84 48 74 Z" fill="#cfe4de" fill-opacity=".8"/>' +
      '<path d="M146 56 l 18 -10 v 22 l -18 -4" fill="#cfe4de" fill-opacity=".8"/>' +
      '<circle cx="68" cy="68" r="2.4" fill="#0a2233" stroke="none"/>' +
      '<path d="M96 56 c 5 6 5 12 0 18" stroke-opacity=".4"/>' +
      '<g stroke="#1e6f7a" stroke-opacity=".5"><path d="M26 88 c 12 -8 24 -8 36 0"/><path d="M86 90 c 12 -8 24 -8 36 0"/></g></g>',
    summer: '<g stroke="#0a2233" stroke-opacity=".55" fill="none" stroke-width="1.6" stroke-linecap="round">' +
      '<path d="M60 84 C 40 84 30 70 30 60 C 30 56 34 54 40 54 L 96 54 C 102 54 106 56 106 60 C 106 70 96 84 60 84 Z" fill="#f2e7cf" fill-opacity=".85"/>' +
      '<path d="M60 82 L 44 56"/><path d="M60 82 L 56 54"/><path d="M60 82 L 66 54"/><path d="M60 82 L 76 56"/>' +
      '<path d="M112 52 c 12 4 18 12 18 22 c 0 3 -3 4 -5 1 c -5 -8 -10 -13 -16 -18 Z" fill="#c4402c" stroke="#8a2318"/>' +
      '<g stroke="#1e6f7a" stroke-opacity=".45"><path d="M24 92 c 12 -8 24 -8 36 0"/><path d="M84 94 c 12 -8 24 -8 36 0"/></g></g>',
    autumn: '<g stroke="#0a2233" stroke-opacity=".55" fill="none" stroke-width="1.6" stroke-linecap="round">' +
      '<ellipse cx="74" cy="68" rx="30" ry="20" fill="#e6a562" fill-opacity=".75"/>' +
      '<path d="M44 62 c 10 -12 40 -12 50 0" stroke-opacity=".45"/>' +
      '<path d="M48 44 l -6 -10 M 66 40 l -3 -11 M 84 40 l 3 -11 M 100 44 l 6 -10"/>' +
      '<circle cx="62" cy="54" r="2" fill="#0a2233" stroke="none"/><circle cx="88" cy="54" r="2" fill="#0a2233" stroke="none"/>' +
      '<g stroke="#b8452f"><path d="M112 78 c 8 -10 14 -10 18 -4" /><path d="M118 84 c 8 -8 14 -8 18 -2"/></g></g>',
    winter: '<g stroke="#0a2233" stroke-opacity=".55" fill="none" stroke-width="1.6" stroke-linecap="round">' +
      '<path d="M40 76 C 28 76 24 64 32 58 C 30 46 44 40 54 46 C 62 38 78 44 78 54 C 90 56 92 70 80 74 Z" fill="#dfeae6" fill-opacity=".8"/>' +
      '<path d="M104 84 C 92 84 86 74 92 66 C 88 56 100 48 110 54 C 118 46 132 52 132 62 C 142 66 142 80 130 82 Z" fill="#dfeae6" fill-opacity=".7"/>' +
      '<g stroke="#1e6f7a" stroke-opacity=".4"><path d="M30 96 c 12 -8 24 -8 36 0"/><path d="M90 98 c 12 -8 24 -8 36 0"/></g>' +
      '<g fill="#bfe8e5" opacity=".7" stroke="none"><circle cx="46" cy="30" r="1.6"/><circle cx="70" cy="22" r="1.2"/><circle cx="98" cy="28" r="1.4"/><circle cx="124" cy="20" r="1"/></g></g>'
  };

  /* 四时圆心插画：内容对应当季小字（鲅鱼 / 蛤蜊 / 梭子蟹 / 牡蛎） */
  var SEASON_ILLUS = {
    spring:
      '<g>' +
        '<path d="M118 214 C 142 186 188 178 222 194 C 200 220 158 230 118 214 Z" fill="#d7e9e3" stroke="#1d4e63" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M222 194 l 26 -15 v 32 l -26 -8" fill="#d7e9e3" stroke="#1d4e63" stroke-width="2" stroke-linejoin="round"/>' +
        '<circle cx="146" cy="204" r="3.2" fill="#1d4e63"/>' +
        '<path d="M168 186 c 7 8 7 16 0 24" stroke="#1d4e63" stroke-opacity=".45" fill="none" stroke-width="1.6"/>' +
        '<path d="M150 214 c 4 6 4 12 0 18" stroke="#1d4e63" stroke-opacity=".3" fill="none"/>' +
      "</g>" +
      '<g fill="none" stroke="#2f6f74" stroke-opacity=".32" stroke-linecap="round"><path d="M130 246 c 14 -8 28 -8 42 0 s 28 8 42 0"/><path d="M146 258 c 12 -7 24 -7 36 0"/></g>',
    summer:
      '<g>' +
        '<path d="M200 168 C 158 168 128 198 128 228 C 152 252 248 252 272 228 C 272 198 242 168 200 168 Z" fill="#f6e4d8" stroke="#1d4e63" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M200 172 L 156 240 M 200 172 L 178 246 M 200 172 L 200 248 M 200 172 L 222 246 M 200 172 L 244 240" stroke="#1d4e63" stroke-opacity=".35" fill="none"/>' +
        '<path d="M128 228 C 152 248 248 248 272 228" stroke="#1d4e63" stroke-opacity=".6" fill="none" stroke-width="2"/>' +
      "</g>" +
      '<g fill="none" stroke="#2f6f74" stroke-opacity=".32" stroke-linecap="round"><path d="M130 258 c 14 -8 28 -8 42 0 s 28 8 42 0"/></g>',
    autumn:
      '<g stroke="#b8452f" stroke-width="2" fill="none" stroke-linecap="round">' +
        '<ellipse cx="200" cy="206" rx="44" ry="28" fill="#f6cdb0"/>' +
        '<circle cx="184" cy="198" r="2.6" fill="#b8452f" stroke="none"/><circle cx="216" cy="198" r="2.6" fill="#b8452f" stroke="none"/>' +
        '<path d="M160 198 C 140 188 132 170 142 164 C 150 160 158 172 154 184"/>' +
        '<path d="M240 198 C 260 188 268 170 258 164 C 250 160 242 172 246 184"/>' +
        '<path d="M164 228 C 154 244 152 254 160 258 M 180 234 C 174 250 176 260 184 264 M 220 234 C 226 250 224 260 216 264 M 236 228 C 246 244 248 254 240 258"/>' +
        '<path d="M178 176 l -4 -10 M 200 170 l 0 -12 M 222 176 l 4 -10" stroke-opacity=".7"/>' +
      "</g>" +
      '<g fill="none" stroke="#2f6f74" stroke-opacity=".32" stroke-linecap="round"><path d="M132 268 c 14 -8 28 -8 42 0 s 28 8 42 0"/></g>',
    winter:
      '<g>' +
        '<path d="M200 160 C 168 160 146 182 150 214 C 154 244 176 260 200 260 C 224 260 246 244 250 214 C 254 182 232 160 200 160 Z" fill="#e1ebe7" stroke="#1d4e63" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M200 166 C 186 192 186 232 200 254 M 200 166 C 214 192 214 232 200 254" stroke="#1d4e63" stroke-opacity=".35" fill="none"/>' +
        '<circle cx="200" cy="210" r="13" fill="#f7f1e3" stroke="#1d4e63" stroke-opacity=".4"/>' +
      "</g>" +
      '<g fill="none" stroke="#2f6f74" stroke-opacity=".32" stroke-linecap="round"><path d="M130 268 c 14 -8 28 -8 42 0 s 28 8 42 0"/></g>'
  };


  var DECO_DARK =
    '<svg viewBox="0 0 1440 260" preserveAspectRatio="none">' +
      '<path class="iw" d="M0 128 C 220 92 380 172 600 146 C 820 120 980 70 1200 100 C 1320 116 1400 140 1440 132 L1440 260 L0 260 Z" fill="rgba(30,111,122,.16)"/>' +
      '<path class="iw iw2" d="M0 172 C 240 140 420 210 660 182 C 900 154 1040 118 1260 144 C 1360 156 1420 178 1440 170 L1440 260 L0 260 Z" fill="rgba(13,58,76,.42)"/>' +
      '<path class="iw iw3" d="M0 214 C 260 190 460 240 720 218 C 980 196 1120 176 1440 206 L1440 260 L0 260 Z" fill="rgba(3,15,22,.6)"/>' +
      '<g fill="none" stroke="#79cfd6" stroke-opacity=".1" stroke-width="1.2">' +
        '<path d="M60 236 c 60 -18 120 -18 180 0 s 120 18 180 0 s 120 -18 180 0 s 120 18 180 0"/>' +
        '<path d="M660 250 c 60 -16 120 -16 180 0 s 120 16 180 0"/>' +
      "</g>" +
      '<g fill="#79cfd6" opacity=".12">' +
        '<circle cx="180" cy="96" r="1.6"/><circle cx="240" cy="74" r="1.1"/><circle cx="1020" cy="86" r="1.4"/><circle cx="1090" cy="66" r="1"/>' +
      "</g>" +
    "</svg>";

  var DECO_PAPER =
    '<svg viewBox="0 0 1440 260" preserveAspectRatio="none">' +
      '<path class="iw" d="M0 150 C 180 120 300 84 520 104 C 700 120 820 88 1020 108 C 1180 124 1330 148 1440 138 L1440 260 L0 260 Z" fill="rgba(10,34,51,.05)"/>' +
      '<path class="iw iw2" d="M0 196 C 200 172 360 214 580 196 C 800 178 940 152 1160 172 C 1300 184 1390 200 1440 194 L1440 260 L0 260 Z" fill="rgba(30,111,122,.07)"/>' +
      '<g fill="none" stroke="#0a2233" stroke-opacity=".12" stroke-width="1.1">' +
        '<path d="M40 224 c 60 -16 120 -16 180 0 s 120 16 180 0 s 120 -16 180 0 s 120 16 180 0 s 120 -16 180 0"/>' +
        '<path d="M120 244 c 60 -14 120 -14 180 0 s 120 14 180 0 s 120 -14 180 0"/>' +
      "</g>" +
      '<g fill="#0a2233" opacity=".1">' +
        '<circle cx="1260" cy="72" r="1.6"/><circle cx="1310" cy="96" r="1.1"/><circle cx="180" cy="60" r="1.3"/>' +
      "</g>" +
    "</svg>";

  function paintSectionDeco() {
    var secs = document.querySelectorAll("main > section");
    for (var i = 0; i < secs.length; i++) {
      var s = secs[i];
      if (s.querySelector(".ink-deco")) continue;
      if (s.id === "home") continue;
      var dark = /sec-dark/.test(s.className);
      var d = document.createElement("div");
      d.className = "ink-deco";
      d.setAttribute("aria-hidden", "true");
      d.innerHTML = dark ? DECO_DARK : DECO_PAPER;
      s.insertBefore(d, s.firstChild);
    }
  }

  /* ============================================================
     6.8 · 尾页收束场景（一片海，一只船，一行字）
     ============================================================ */
  function paintFooterArt() {
    var about = document.getElementById("about");
    if (!about || about.querySelector(".close-art")) return;
    var d = document.createElement("div");
    d.className = "close-art";
    d.setAttribute("aria-hidden", "true");
    d.innerHTML =
      '<svg viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice">' +
        '<defs>' +
          '<linearGradient id="g-closeSea" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#17687a" stop-opacity=".5"/>' +
            '<stop offset="1" stop-color="#04121a" stop-opacity="0"/>' +
          "</linearGradient>" +
          '<radialGradient id="g-closeMoon" cx="50%" cy="50%" r="50%">' +
            '<stop offset="0" stop-color="#fff6e2"/><stop offset=".5" stop-color="#f7dfae" stop-opacity=".75"/>' +
            '<stop offset="1" stop-color="#f7dfae" stop-opacity="0"/>' +
          "</radialGradient>" +
        "</defs>" +
        /* 日与倒影 */
        '<circle cx="1180" cy="96" r="56" fill="url(#g-closeMoon)" opacity=".5"/>' +
        '<circle cx="1180" cy="96" r="26" fill="none" stroke="#f7dfae" stroke-opacity=".35"/>' +
        '<circle cx="1180" cy="96" r="25" fill="#f7dfae" fill-opacity=".18"/>' +
        '<g fill="#f8e3b6" opacity=".25">' +
          '<rect x="1152" y="132" width="56" height="3" rx="1.5"/>' +
          '<rect x="1162" y="144" width="36" height="2.6" rx="1.3"/>' +
          '<rect x="1170" y="155" width="22" height="2.2" rx="1.1"/>' +
        "</g>" +
        /* 远山 */
        '<path d="M0 236 C 180 214 320 232 500 220 C 680 208 840 230 1020 218 C 1200 206 1320 226 1440 216 L1440 300 L0 300 Z" fill="url(#g-closeSea)"/>' +
        /* 水纹 */
        '<g fill="none" stroke="#79cfd6" stroke-opacity=".14" stroke-width="1.2">' +
          '<path d="M0 250 c 80 -14 160 -14 240 0 s 160 14 240 0 s 160 -14 240 0 s 160 14 240 0 s 160 -14 240 0"/>' +
          '<path d="M120 272 c 80 -14 160 -14 240 0 s 160 14 240 0 s 160 -14 240 0 s 160 14 240 0"/>' +
        "</g>" +
        /* 小帆船 */
        '<g transform="translate(812 188)"><g class="close-boat">' +
          '<ellipse cx="0" cy="42" rx="56" ry="5" fill="#02101a" fill-opacity=".4"/>' +
          '<path d="M0 -62 V16" stroke="#cfe6e2" stroke-opacity=".38" stroke-width="1.6"/>' +
          '<path d="M4 -58 C 36 -38 44 -14 44 6 L44 14 C 28 10 17 9 4 9 Z" fill="#f3ead5" fill-opacity=".6"/>' +
          '<path d="M-4 -52 C -28 -32 -34 -10 -34 8 L-34 14 C -24 11 -14 10 -4 10 Z" fill="#e9dcbe" fill-opacity=".42"/>' +
          '<g stroke="#a89a7d" stroke-opacity=".3" stroke-width=".8">' +
            '<path d="M5 -42 L42 -22"/><path d="M5 -26 L44 -4"/>' +
          "</g>" +
          '<path d="M-40 12 C -22 30 22 30 40 12 C 34 32 18 40 0 40 C -18 40 -34 32 -40 12 Z" fill="#08181f" stroke="#0f3b4c" stroke-width="1.1"/>' +
          '<path d="M-36 16 C -18 30 18 30 36 16" fill="none" stroke="#79cfd6" stroke-opacity=".18"/>' +
        "</g></g>" +
        /* 大字落款 */
        '<text class="close-word" x="72" y="150" font-family="var(--serif, serif)" font-size="74" letter-spacing="16" fill="none" stroke="#79cfd6" stroke-opacity=".22" stroke-width="1">海味山东</text>' +
        '<text class="close-en" x="76" y="186" font-size="11" letter-spacing="8" fill="#79cfd6" fill-opacity=".3">FLAVORS OF SHANDONG</text>' +
      "</svg>";
    about.appendChild(d);
  }

  /* ============================================================
     7 · 注入与渲染
     ============================================================ */
  function injectDefs() {
    if (document.getElementById("artDefs")) return;
    var box = document.createElement("div");
    box.innerHTML = DEFS;
    document.body.insertBefore(box.firstChild, document.body.firstChild);
  }

  /* 首屏：把罗盘里的线稿换成水墨场景（保留原来的环与环文） */
  function paintHero() {
    var svg = document.querySelector(".hero-art .compass");
    if (!svg || svg.getAttribute("data-painted") === "1") return;
    var oldBoat = svg.querySelector(".art-boat");
    var oldWaves = svg.querySelector(".art-waves");
    var oldStars = svg.querySelector(".art-star");
    var holder = document.createElementNS("http://www.w3.org/2000/svg", "g");
    holder.innerHTML = HERO_SCENE;
    var ref = svg.querySelector(".ring-c");
    if (ref && ref.parentNode) ref.parentNode.insertBefore(holder, ref);
    else svg.appendChild(holder);
    [oldBoat, oldWaves, oldStars].forEach(function (n) {
      if (n && n.parentNode) n.parentNode.removeChild(n);
    });
    var inner = svg.querySelector("circle[fill='url(#innerSea)']");
    if (inner) inner.parentNode.removeChild(inner);
    var c = svg.querySelector(".ring-c");
    if (c) { c.setAttribute("r", "223"); c.style.opacity = ".42"; }
    svg.setAttribute("data-painted", "1");
    svg.classList.add("painted");
  }

  /* 菜卡插画 */
  function paintDishes() {
    var cards = document.querySelectorAll(".dish-card");
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var plate = card.querySelector(".dish-plate");
      if (!plate) continue;
      if (plate.getAttribute("data-art") === "done") continue;
      /* v10：已使用美工菜品图，跳过 SVG 插画 */
      if (plate.querySelector("img.dish-art")) { plate.setAttribute("data-art", "done"); continue; }
      var id = card.getAttribute("data-id");
      var fn = DISH_ART[id] || DISH_ART.haishen;
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "dish-art");
      svg.setAttribute("viewBox", "0 0 200 116");
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.setAttribute("aria-hidden", "true");
      svg.innerHTML = fn();
      plate.appendChild(svg);
      plate.setAttribute("data-art", "done");
    }
  }

  /* 词源卡水印 */
  function paintLexicon() {
    var cards = document.querySelectorAll(".lex-card");
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var front = card.querySelector(".lex-front");
      if (!front || front.getAttribute("data-art") === "done") continue;
      var glyphEl = front.querySelector(".lex-glyph");
      var glyph = glyphEl ? glyphEl.textContent.trim() : "";
      var motif = LEX_MOTIF[glyph] || LEX_MOTIF["参"];
      var holder = document.createElement("div");
      holder.className = "lex-motif";
      holder.innerHTML = '<svg viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' + motif + "</svg>";
      front.insertBefore(holder, front.firstChild);
      front.setAttribute("data-art", "done");
    }
  }

  /* 工序插画 */
  function paintCraft() {
    var steps = document.querySelectorAll(".craft-step");
    for (var i = 0; i < steps.length; i++) {
      var step = steps[i];
      var box = step.querySelector(".step-icon");
      if (!box || box.getAttribute("data-art") === "done") continue;
      /* v10：已使用美工工序图，跳过 SVG 插画 */
      if (box.querySelector("img.step-art")) { box.setAttribute("data-art", "done"); continue; }
      var svgMarkup = box.querySelector("svg");
      var key = null;
      var keys = ["fish", "knife", "bowl", "chive", "roller", "pot"];
      /* 用原图标路径特征判断太麻烦，直接按顺序取 */
      key = keys[i % 6];
      box.innerHTML = '<svg class="craft-art" viewBox="0 0 120 84" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' + CRAFT_ART[key] + "</svg>";
      box.setAttribute("data-art", "done");
    }
  }

  /* 年表页底部的航海图 */
  function paintTimeline() {
    var sec = document.getElementById("timeline");
    if (!sec || sec.querySelector(".time-art")) return;
    var wrap = sec.querySelector(".wrap");
    if (!wrap) return;
    var d = document.createElement("div");
    d.className = "time-art";
    d.setAttribute("aria-hidden", "true");
    d.innerHTML =
      '<svg viewBox="0 0 1200 120" preserveAspectRatio="none">' +
        '<path class="ta-route" d="M40 86 C 240 40 420 108 640 62 C 860 16 1020 74 1160 44" fill="none" stroke="#79cfd6" stroke-opacity=".35" stroke-width="1.4" stroke-dasharray="6 10"/>' +
        '<g stroke="#79cfd6" stroke-opacity=".16" stroke-width="1.2" fill="none">' +
          '<path d="M0 104 c 60 -18 120 -18 180 0 s 120 18 180 0 s 120 -18 180 0 s 120 18 180 0 s 120 -18 180 0 s 120 18 180 0"/>' +
          '<path d="M0 116 c 60 -18 120 -18 180 0 s 120 18 180 0 s 120 -18 180 0 s 120 18 180 0 s 120 -18 180 0 s 120 18 180 0"/>' +
        "</g>" +
      "</svg>" +
      '<div class="ta-boat">' +
        '<svg viewBox="0 0 60 48">' +
          '<path d="M6 34 C 16 42 44 42 54 34 C 50 44 44 46 30 46 C 16 46 10 44 6 34 Z" fill="#0a2233" stroke="#79cfd6" stroke-opacity=".6"/>' +
          '<path d="M30 6 L30 34" stroke="#79cfd6" stroke-opacity=".7" stroke-width="1.6"/>' +
          '<path d="M32 10 C 46 18 50 26 50 32 L32 32 Z" fill="#79cfd6" fill-opacity=".3" stroke="#79cfd6" stroke-opacity=".6"/>' +
          '<path d="M28 14 C 18 20 16 26 16 32 L28 32 Z" fill="#79cfd6" fill-opacity=".3" stroke="#79cfd6" stroke-opacity=".6"/>' +
        "</svg>" +
      "</div>";
    wrap.appendChild(d);
  }

  /* 侦探页：右侧手绘图腾 */
  function paintQuiz() {
    var sec = document.getElementById("quiz");
    if (!sec || sec.querySelector(".quiz-art")) return;
    var wrap = sec.querySelector(".wrap");
    var d = document.createElement("div");
    d.className = "quiz-art";
    d.setAttribute("aria-hidden", "true");
    d.innerHTML =
      '<svg viewBox="0 0 260 340" preserveAspectRatio="xMidYMid meet">' +
        '<g stroke="#1e6f7a" stroke-opacity=".35" fill="none" stroke-width="1.4" stroke-linecap="round">' +
          '<circle cx="112" cy="120" r="74"/>' +
          '<circle cx="112" cy="120" r="60" stroke-opacity=".2"/>' +
          '<path d="M168 176 l 54 62" stroke-width="6" stroke-opacity=".3" stroke-linecap="round"/>' +
          '<path d="M60 92 c 18 -20 44 -26 68 -18" stroke-opacity=".28"/>' +
          '<g stroke-opacity=".18" stroke-dasharray="1 6"><circle cx="112" cy="120" r="86"/></g>' +
        "</g>" +
        '<g stroke="#0a2233" stroke-opacity=".16" fill="none" stroke-width="1.2">' +
          '<path d="M14 296 c 30 -14 60 -14 90 0 s 60 14 90 0"/>' +
          '<path d="M14 316 c 30 -14 60 -14 90 0 s 60 14 90 0"/>' +
          '<path d="M14 336 c 30 -14 60 -14 90 0 s 60 14 90 0"/>' +
        "</g>" +
        '<g fill="#b8452f" opacity=".5"><circle cx="196" cy="60" r="3"/><circle cx="212" cy="76" r="1.8"/></g>' +
      "</svg>";
    wrap.appendChild(d);
  }

  /* 解字页 */
  function paintGlyphPage() {
    var holder = document.getElementById("glyphArt");
    if (!holder || holder.getAttribute("data-art") === "done") return;
    holder.innerHTML = GLYPH_ART;
    holder.setAttribute("data-art", "done");

    var words = document.getElementById("glyphWords");
    if (words && !words.getAttribute("data-art")) {
      words.innerHTML =
        '<li class="gw-item" data-w="1"><b>鲜</b><span>' + esc(t("g_w1")) + "</span></li>" +
        '<li class="gw-item" data-w="2"><b>旨味 · umami</b><span>' + esc(t("g_w2")) + "</span></li>" +
        '<li class="gw-item" data-w="3"><b>감칠맛</b><span>' + esc(t("g_w3")) + "</span></li>";
      words.setAttribute("data-art", "done");
    }
  }

  /* 四时页 */
  function paintTidePage() {
    var wheel = document.getElementById("tideWheel");
    var tabs = document.getElementById("tideTabs");
    var body = document.getElementById("tideBody");
    if (!wheel || !tabs || !body) return;
    var seasons = (SITE.seasons || []);
    if (!seasons.length) return;

    if (!wheel.getAttribute("data-art")) {
      var arcs = "";
      for (var i = 0; i < 4; i++) {
        var a0 = (-90 + i * 90) * Math.PI / 180;
        var a1 = (-90 + (i + 1) * 90) * Math.PI / 180;
        var R = 158, r = 96;
        var x0 = 200 + R * Math.cos(a0), y0 = 200 + R * Math.sin(a0);
        var x1 = 200 + R * Math.cos(a1), y1 = 200 + R * Math.sin(a1);
        var x2 = 200 + r * Math.cos(a1), y2 = 200 + r * Math.sin(a1);
        var x3 = 200 + r * Math.cos(a0), y3 = 200 + r * Math.sin(a0);
        arcs += '<path class="td-sector" data-i="' + i + '" d="M' + x0.toFixed(1) + " " + y0.toFixed(1) +
          " A " + R + " " + R + " 0 0 1 " + x1.toFixed(1) + " " + y1.toFixed(1) +
          " L " + x2.toFixed(1) + " " + y2.toFixed(1) +
          " A " + r + " " + r + " 0 0 0 " + x3.toFixed(1) + " " + y3.toFixed(1) + ' Z"/>';
      }
      wheel.innerHTML =
        '<svg class="td-svg" viewBox="0 0 400 400" role="img" aria-label="四时海味">' +
          '<circle cx="200" cy="200" r="192" fill="none" stroke="#0a2233" stroke-opacity=".12"/>' +
          '<circle cx="200" cy="200" r="188" fill="none" stroke="#0a2233" stroke-opacity=".06" stroke-dasharray="1 6"/>' +
          arcs +
          '<g class="td-spin">' +
            '<circle cx="200" cy="200" r="176" fill="none" stroke="#1e6f7a" stroke-opacity=".3" stroke-dasharray="2 12"/>' +
            '<g fill="#1e6f7a" opacity=".45">' +
              '<path d="M200 20 l 7 8 -7 8 -7 -8 Z"/><path d="M380 200 l -8 7 -8 -7 8 -7 Z"/>' +
              '<path d="M200 380 l 7 -8 -7 -8 -7 8 Z"/><path d="M20 200 l 8 7 8 -7 -8 -7 Z"/>' +
            "</g>" +
          "</g>" +
          '<circle cx="200" cy="200" r="94" fill="#f7f1e3" stroke="#0a2233" stroke-opacity=".14"/>' +
          '<g class="td-pic" id="tidePic"></g>' +
          '<g class="td-labels">' +
            '<text x="289" y="111" text-anchor="middle" class="td-lab" data-i="0"></text>' +
            '<text x="289" y="293" text-anchor="middle" class="td-lab" data-i="1"></text>' +
            '<text x="111" y="293" text-anchor="middle" class="td-lab" data-i="2"></text>' +
            '<text x="111" y="111" text-anchor="middle" class="td-lab" data-i="3"></text>' +
          "</g>" +
        "</svg>";
      wheel.setAttribute("data-art", "done");
    }

    if (!tabs.getAttribute("data-art")) {
      tabs.innerHTML = seasons.map(function (s, i) {
        return '<button type="button" class="td-tab" data-i="' + i + '">' +
          "<b>" + esc(L(s.season)) + "</b><span>" + esc(L(s.dish)) + "</span></button>";
      }).join("");
      tabs.setAttribute("data-art", "done");
    }

    var labels = wheel.querySelectorAll(".td-lab");
    for (var k = 0; k < labels.length; k++) {
      var s = seasons[k];
      if (s) labels[k].textContent = L(s.season) + " · " + L(s.dish);
    }

    function show(i) {
      var s = seasons[i];
      if (!s) return;
      var id = s.id;
      var pic = wheel.querySelector("#tidePic");
      pic.innerHTML =
        '<g class="td-illus">' + (SEASON_ILLUS[id] || SEASON_ILLUS.spring) + "</g>" +
        '<text class="td-illus-sub" x="200" y="286" text-anchor="middle">' + esc(L(s.dish)) + "</text>";
      wheel.querySelectorAll(".td-sector").forEach(function (p, idx) {
        p.classList.toggle("on", idx === i);
      });
      tabs.querySelectorAll(".td-tab").forEach(function (b, idx) {
        b.classList.toggle("on", idx === i);
      });
      body.innerHTML =
        '<p class="td-word">' + esc(L(s.word)) + "</p>" +
        '<p class="td-line">' + esc(L(s.line)) + "</p>" +
        '<p class="td-note">' + esc(L(s.note)) + "</p>" +
        '<p class="td-meta">' + esc(L(s.meta)) + "</p>";
      body.classList.remove("anim");
      void body.offsetWidth;
      body.classList.add("anim");
    }

    wheel.addEventListener("click", function (e) {
      var p = e.target.closest ? e.target.closest(".td-sector") : null;
      if (p) show(Number(p.getAttribute("data-i")));
    });
    tabs.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest(".td-tab") : null;
      if (b) show(Number(b.getAttribute("data-i")));
    });

    if (!wheel.getAttribute("data-shown")) {
      wheel.setAttribute("data-shown", "1");
      show(0);
    }
  }

  /* 页面色调：让固定导航在纸色页自动变深 */
  function syncTone() {
    var deck = document.getElementById("deck");
    if (!deck || !window.HXDeck) return;
    var pages = window.HXDeck.pages ? window.HXDeck.pages() : [];
    var idx = window.HXDeck.index ? window.HXDeck.index() : 0;
    var page = pages[idx];
    var paper = false;
    if (page) {
      var cls = page.className || "";
      var id = page.id || "";
      paper = /sec-paper/.test(cls) || id === "tide" || id === "ports" || id === "banquet" || id === "quiz";
    }
    document.body.classList.toggle("on-paper", paper);
  }

  function apply() {
    injectDefs();
    paintHero();
    paintSectionDeco();
    paintDishes();
    paintLexicon();
    paintCraft();
    paintTimeline();
    paintQuiz();
    paintFooterArt();
    paintGlyphPage();
    paintTidePage();
    syncTone();
  }

  /* 视差：让首屏的水墨层随鼠标轻轻移动 */
  function bindParallax() {
    var art = document.querySelector(".hero-art");
    if (!art || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var layers = [
      { sel: ".sun-halo", k: 8 },
      { sel: ".sun-disc", k: 5 },
      { sel: ".scene-boat", k: 14 },
      { sel: ".gulls", k: 22 }
    ].map(function (l) { return { el: art.querySelector(l.sel), k: l.k }; });

    var tx = 0, ty = 0, raf = null;
    function run() {
      raf = null;
      layers.forEach(function (l) {
        if (!l.el) return;
        l.el.style.transform = "translate(" + (tx * l.k) + "px," + (ty * l.k) + "px)";
      });
    }
    window.addEventListener("mousemove", function (e) {
      tx = (e.clientX / window.innerWidth - .5) * 2;
      ty = (e.clientY / window.innerHeight - .5) * 2;
      if (!raf) raf = window.requestAnimationFrame(run);
    }, { passive: true });
  }

  /* 翻页时给当前页一个轻微入场（装饰层） */
  function bindPageIn() {
    var deck = document.getElementById("deck");
    if (!deck) return;
    var timer = null;
    deck.addEventListener("scroll", function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        syncTone();
        var pages = window.HXDeck && window.HXDeck.pages ? window.HXDeck.pages() : [];
        var idx = window.HXDeck && window.HXDeck.index ? window.HXDeck.index() : 0;
        pages.forEach(function (p, i) { p.classList.toggle("is-current", i === idx); });
      }, 120);
    }, { passive: true });
  }

  function init() {
    apply();
    bindParallax();
    bindPageIn();
    document.addEventListener("hx:langchange", function (e) {
      if (e && e.detail && e.detail.lang) lang = e.detail.lang;
      window.setTimeout(apply, 60);
    });
    window.addEventListener("resize", function () {
      window.setTimeout(syncTone, 200);
    });
  }

  window.HXArt = { apply: apply, dish: DISH_ART, defs: DEFS };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
