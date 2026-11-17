/* ============================================================
   海味山东 · deck.js —— 一屏一页的点击翻页控制器
   支持：点击按钮 / 圆点跳页 / 方向键 / 滚轮 / 触屏上下滑
   页面内容过长时（矮屏、手机）该页内部可滚动
   ============================================================ */
(function () {
  "use strict";

  var deck = document.getElementById("deck");
  if (!deck) return;

  var pages = [];
  var current = 0;
  var nav = document.getElementById("nav");
  var prevBtn = document.getElementById("pagePrev");
  var nextBtn = document.getElementById("pageNext");
  var counter = document.getElementById("pageCount");
  var dotsBox = document.getElementById("pagerDots");
  var progressBar = document.getElementById("progressBar");
  var modal = document.getElementById("aiModal");
  var pager = document.getElementById("pager");
  var fitTimer = null;
  var pagerTimer = null;
  var wheelLock = false;
  var touchStart = null;

  var PAGE_KEYS = {
    home: "nav_home",
    ports: "nav_ports",
    lexicon: "nav_lex",
    banquet: "nav_banquet",
    craft: "nav_craft",
    quiz: "nav_quiz",
    timeline: "nav_time",
    about: "nav_about"
  };

  function lang() { return document.documentElement.lang || "zh"; }
  function t(key) {
    var d = window.I18N[lang()] || window.I18N.zh;
    return d[key] != null ? d[key] : (window.I18N.zh[key] || key);
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function clamp(n) { return Math.max(0, Math.min(pages.length - 1, n)); }

  /* ---------------- 初始化页面 ---------------- */
  function collectPages() {
    var list = Array.prototype.slice.call(
      deck.querySelectorAll("#home, main > section, #deck > footer")
    );
    list = list.filter(function (el, i) { return list.indexOf(el) === i; });
    pages = list;
    pages.forEach(function (p, i) {
      p.classList.add("page");
      if (p.id) p.classList.add("page-" + p.id);
      p.setAttribute("data-page", String(i));
      p.setAttribute("aria-hidden", "true");
    });
  }

  function buildDots() {
    dotsBox.innerHTML = "";
    pages.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("data-dot", String(i));
      b.setAttribute("data-label", t(PAGE_KEYS[p.id] || "nav_home"));
      b.setAttribute("aria-label", t(PAGE_KEYS[p.id] || "nav_home"));
      dotsBox.appendChild(b);
    });
  }

  function updateDotLabels() {
    var btns = dotsBox.querySelectorAll("button");
    pages.forEach(function (p, i) {
      if (!btns[i]) return;
      var label = t(PAGE_KEYS[p.id] || "nav_home");
      btns[i].setAttribute("data-label", label);
      btns[i].setAttribute("aria-label", label);
    });
  }

  /* ---------------- 翻页 ---------------- */
  function applyClasses() {
    pages.forEach(function (p, i) {
      p.classList.toggle("is-active", i === current);
      p.classList.toggle("is-above", i < current);
      p.setAttribute("aria-hidden", i === current ? "false" : "true");
    });
  }

  function revealPage(p) {
    if (!p) return;
    var els = p.querySelectorAll(".reveal");
    for (var i = 0; i < els.length; i++) els[i].classList.add("in");
  }

  function goTo(index, instant) {
    var i = clamp(index);
    if (i === current) return;

    if (instant) {
      pages.forEach(function (p) { p.style.transition = "none"; });
      current = i;
      applyClasses();
      void deck.offsetWidth;
      pages.forEach(function (p) { p.style.transition = ""; });
    } else {
      current = i;
      applyClasses();
    }

    var page = pages[current];
    if (page) {
      page.scrollTop = 0;
      revealPage(page);
    }
    if (pager) pager.classList.remove("is-hidden");
    updateUI();
    refreshFitSoon();
    document.dispatchEvent(new CustomEvent("hx:page", { detail: { index: current, id: page ? page.id : "" } }));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* ---------------- 界面状态 ---------------- */
  function updateUI() {
    if (counter) counter.textContent = pad(current + 1) + " / " + pad(pages.length);
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === pages.length - 1;
    if (progressBar) {
      var ratio = pages.length > 1 ? current / (pages.length - 1) : 1;
      progressBar.style.transform = "scaleX(" + ratio + ")";
    }

    var dots = dotsBox.querySelectorAll("button");
    for (var i = 0; i < dots.length; i++) dots[i].classList.toggle("on", i === current);

    var page = pages[current];
    var isLight = !!(page && page.classList.contains("sec-paper"));
    dotsBox.classList.toggle("light", isLight);
    document.body.classList.toggle("page-light", isLight);

    if (nav) nav.classList.toggle("solid", current > 0);

    var links = document.querySelectorAll(".nav-links a");
    for (var j = 0; j < links.length; j++) {
      var id = (links[j].getAttribute("href") || "").replace(/^#/, "");
      links[j].classList.toggle("on", !!page && id === page.id);
    }
  }

  /* ---------------- 内容高度检测 ---------------- */
  function measureTall(page) {
    var wrap = page.querySelector(":scope > .wrap");
    if (!wrap) return false;
    var prev = wrap.style.justifyContent;
    wrap.style.justifyContent = "flex-start";
    var tall = wrap.scrollHeight > wrap.clientHeight + 6;
    wrap.style.justifyContent = prev;
    return tall;
  }

  function refreshFit() {
    pages.forEach(function (p) {
      if (!p.querySelector(":scope > .wrap")) {
        p.classList.remove("is-tall");
        return;
      }
      p.classList.toggle("is-tall", measureTall(p));
    });
  }

  function refreshFitSoon() {
    window.clearTimeout(fitTimer);
    fitTimer = window.setTimeout(refreshFit, 120);
  }

  /* ---------------- 事件 ---------------- */
  function bind() {
    if (prevBtn) prevBtn.addEventListener("click", prev);
    if (nextBtn) nextBtn.addEventListener("click", next);

    dotsBox.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-dot]") : null;
      if (!b) return;
      var idx = Number(b.getAttribute("data-dot"));
      goTo(idx, Math.abs(idx - current) > 1);
    });

    /* 页面内锚点（首屏「启航」、档案卡「看它的做法」等） */
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute("href").slice(1);
      for (var i = 0; i < pages.length; i++) {
        if (pages[i].id === id) {
          e.preventDefault();
          goTo(i, Math.abs(i - current) > 1);
          return;
        }
      }
    }, true);

    /* 键盘 */
    document.addEventListener("keydown", function (e) {
      if (modal && modal.classList.contains("open")) return;
      var tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      var inControl = e.target.closest && e.target.closest("button, a");
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === " " || e.key === "Spacebar") {
        if (inControl) return;
        e.preventDefault();
        next();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0, true);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(pages.length - 1, true);
      }
    });

    /* 滚轮：整页翻动；页面本身可滚动时让位给页面滚动 */
    deck.addEventListener("wheel", function (e) {
      if (modal && modal.classList.contains("open")) return;
      var page = pages[current];
      if (page && page.classList.contains("is-tall")) return;
      if (Math.abs(e.deltaY) < 18) return;
      e.preventDefault();
      if (wheelLock) return;
      wheelLock = true;
      window.setTimeout(function () { wheelLock = false; }, 900);
      if (e.deltaY > 0) next(); else prev();
    }, { passive: false });

    /* 触屏上下滑 */
    deck.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) { touchStart = null; return; }
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    deck.addEventListener("touchend", function (e) {
      if (!touchStart) return;
      var dx = e.changedTouches[0].clientX - touchStart.x;
      var dy = e.changedTouches[0].clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dy) < 70 || Math.abs(dx) > Math.abs(dy)) return;
      var page = pages[current];
      if (page && page.classList.contains("is-tall")) {
        var atTop = page.scrollTop <= 2;
        var atBottom = page.scrollTop + page.clientHeight >= page.scrollHeight - 4;
        if ((dy < 0 && !atBottom) || (dy > 0 && !atTop)) return;
      }
      if (dy < 0) next(); else prev();
    }, { passive: true });

    /* 语言切换：更新圆点标签 + 重新测高 */
    document.addEventListener("hx:langchange", function () {
      updateDotLabels();
      window.setTimeout(refreshFit, 80);
    });

    /* 内容交互后重新测高（答题反馈会变长） */
    deck.addEventListener("click", refreshFitSoon);

    window.addEventListener("resize", function () {
      window.clearTimeout(fitTimer);
      fitTimer = window.setTimeout(refreshFit, 200);
    });

    var toTop = document.getElementById("toTop");
    if (toTop) toTop.addEventListener("click", function () { goTo(0, true); });
  }

  /* ---------------- 启动 ---------------- */
  function init() {
    collectPages();
    if (pages.length === 0) return;
    buildDots();
    current = 0;
    applyClasses();
    updateUI();
    revealPage(pages[0]);
    bind();
    window.setTimeout(refreshFit, 400);
    window.setTimeout(refreshFit, 1200);
  }

  /* 暴露给调试/自动化测试 */
  window.HXDeck = {
    go: goTo,
    next: next,
    prev: prev,
    index: function () { return current; },
    pages: function () { return pages.slice(); }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
