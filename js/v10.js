/* ============================================================
   海味山东 · v10.js —— 美工素材版补充交互
   - 右侧翻页键（与滚轮/键盘/顶部导航并存）
   - 尾页海报墙 + 点击看大图
   - 页面小装饰（采纳「ds如是说」建议：40–60px、微浮动）
   - 四时转盘中心罗盘
   ============================================================ */
(function () {
  "use strict";

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* ---------------- 海报墙 ---------------- */
  var POSTERS = [1, 2, 3, 4, 5];

  function openLightbox(src) {
    var lb = document.getElementById("v10Lightbox");
    if (!lb) {
      lb = document.createElement("div");
      lb.id = "v10Lightbox";
      lb.className = "v10-lightbox";
      lb.innerHTML = '<img alt="海报大图">';
      document.body.appendChild(lb);
      lb.addEventListener("click", function () { lb.classList.remove("open"); });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") lb.classList.remove("open");
      });
    }
    lb.querySelector("img").src = src;
    lb.classList.add("open");
  }

  function initPosterWall() {
    var strip = document.getElementById("posterStrip");
    if (!strip) return;
    strip.innerHTML = POSTERS.map(function (n) {
      return '<img src="assets/img/poster-' + n + '.webp" alt="《海味山东》主视觉海报 ' + n + '" loading="lazy" draggable="false">';
    }).join("");
    strip.addEventListener("click", function (e) {
      var img = e.target.closest ? e.target.closest("img") : null;
      if (img) openLightbox(img.getAttribute("src"));
    });
  }

  /* ---------------- 右侧翻页键 ---------------- */
  function initPager() {
    var pager = document.getElementById("pager");
    if (!pager) return;
    var now = document.getElementById("pgNow");
    var total = document.getElementById("pgTotal");
    var prev = document.getElementById("pgPrev");
    var next = document.getElementById("pgNext");

    function sync() {
      if (!window.HXDeck) return;
      var i = window.HXDeck.index();
      var n = window.HXDeck.pages().length;
      if (now) now.textContent = String(i + 1);
      if (total) total.textContent = String(n);
      if (prev) prev.disabled = i <= 0;
      if (next) next.disabled = i >= n - 1;
    }

    if (prev) prev.addEventListener("click", function () { if (window.HXDeck) window.HXDeck.prev(); });
    if (next) next.addEventListener("click", function () { if (window.HXDeck) window.HXDeck.next(); });
    document.addEventListener("hx:pagechange", sync);
    window.setTimeout(sync, 60);
    window.setTimeout(sync, 700);
  }

  /* ---------------- 页面小装饰 ---------------- */
  var DECOR = {
    boat: "assets/img/decor-boat.webp",
    compass: "assets/img/decor-compass.webp",
    bowl: "assets/img/decor-bowl.webp",
    net: "assets/img/decor-net.webp",
    star: "assets/img/decor-star.webp"
  };

  function addDecor(page, key, x, y, size, opacity) {
    if (!page || page.querySelector(".decor-img[data-key='" + key + "']")) return;
    var img = document.createElement("img");
    img.className = "decor-img decor-" + key;
    img.setAttribute("data-key", key);
    img.src = DECOR[key];
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    if (x.indexOf("r:") === 0) img.style.right = x.slice(2); else img.style.left = x;
    img.style.top = y;
    if (size) img.style.width = size + "px";
    if (opacity) img.style.opacity = opacity;
    page.appendChild(img);
  }

  function decorate() {
    var byId = function (id) { return document.getElementById(id); };
    addDecor(byId("home"), "boat", "r:7%", "62%", 76, 0.95);
    addDecor(byId("home"), "compass", "r:5%", "15%", 60, 0.9);
    addDecor(byId("ports"), "net", "86%", "10%", 64, 0.9);
    addDecor(byId("lexicon"), "star", "4%", "12%", 44, 0.8);
    addDecor(byId("glyph"), "compass", "5%", "76%", 52, 0.7);
    addDecor(byId("banquet"), "star", "90%", "9%", 46, 0.8);
    addDecor(byId("tide"), "boat", "3%", "72%", 52, 0.8);
    addDecor(byId("tide"), "compass", "8%", "30%", 48, 0.7);
    addDecor(byId("craft"), "bowl", "88%", "10%", 60, 0.85);
    addDecor(byId("quiz"), "star", "6%", "76%", 42, 0.7);
    addDecor(byId("timeline"), "compass", "5%", "10%", 46, 0.6);
    addDecor(byId("about"), "net", "6%", "10%", 56, 0.6);
  }

  /* ---------------- 启动 ---------------- */
  function init() {
    initPosterWall();
    initPager();
    decorate();
    /* 页面获得焦点，避免“先点一下滚轮才有反应” */
    document.addEventListener("click", function () {
      try { window.focus(); } catch (e) { /* ignore */ }
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
