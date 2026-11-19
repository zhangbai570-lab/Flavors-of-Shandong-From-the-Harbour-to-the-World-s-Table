/* ============================================================
   海味山东 · deck.js —— 上下滑动 + 整页吸附
   只保留滚动翻页：滚轮一次手势翻一页，触摸交给原生吸附
   ============================================================ */
(function () {
  "use strict";

  var deck = document.getElementById("deck");
  if (!deck) return;

  var pages = [];
  var current = 0;
  var nav = document.getElementById("nav");
  var progressBar = document.getElementById("progressBar");
  var modal = document.getElementById("aiModal");

  var ticking = false;
  var fitTimer = null;
  var wheelAcc = 0;
  var wheelLock = false;
  var wheelEndTimer = null;
  var animId = null;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function clamp(n) { return Math.max(0, Math.min(pages.length - 1, n)); }

  /* ---------------- 页面准备 ---------------- */
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

  /* ---------------- 位置 ---------------- */
  function pageTop(i) {
    var p = pages[i];
    if (!p) return 0;
    var deckRect = deck.getBoundingClientRect();
    return p.getBoundingClientRect().top - deckRect.top + deck.scrollTop;
  }

  function indexFromScroll() {
    var top = deck.scrollTop;
    var best = 0;
    var bestDist = Infinity;
    for (var i = 0; i < pages.length; i++) {
      var d = Math.abs(pageTop(i) - top);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
  }

  function revealPage(p) {
    if (!p) return;
    var els = p.querySelectorAll(".reveal");
    for (var i = 0; i < els.length; i++) els[i].classList.add("in");
  }

  /* ---------------- 翻页 ---------------- */
  function stopAnim() {
    if (animId) {
      window.clearTimeout(animId);
      animId = null;
    }
    deck.classList.remove("is-animating");
  }

  function animateTo(top, index) {
    stopAnim();
    var start = deck.scrollTop;
    var delta = top - start;
    if (Math.abs(delta) < 2 || reduceMotion) {
      deck.scrollTop = top;
      if (index != null) { current = index; updateUI(); revealPage(pages[index]); }
      return;
    }
    var dur = 560;
    var t0 = Date.now();
    deck.classList.add("is-animating");
    function step() {
      var p = Math.min(1, (Date.now() - t0) / dur);
      var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      deck.scrollTop = start + delta * e;
      if (p < 1) {
        animId = window.setTimeout(step, 16);
      } else {
        animId = null;
        deck.scrollTop = top;
        deck.classList.remove("is-animating");
        if (index != null) { current = index; updateUI(); revealPage(pages[index]); }
      }
    }
    animId = window.setTimeout(step, 16);
  }

  function goTo(index, instant) {
    var i = clamp(index);
    if (!pages[i]) return;
    var top = pageTop(i);
    var far = Math.abs(i - current) > 1;
    if (instant || far) {
      stopAnim();
      deck.scrollTop = top;
      current = i;
      updateUI();
      revealPage(pages[i]);
    } else {
      animateTo(top, i);
    }
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* ---------------- 界面状态 ---------------- */
  function updateUI() {
    if (progressBar) {
      var ratio = pages.length > 1 ? current / (pages.length - 1) : 1;
      progressBar.style.transform = "scaleX(" + ratio + ")";
    }
    if (nav) nav.classList.toggle("solid", current > 0);

    pages.forEach(function (p, idx) {
      p.setAttribute("aria-hidden", idx === current ? "false" : "true");
    });

    var page = pages[current];
    var links = document.querySelectorAll(".nav-links a");
    for (var j = 0; j < links.length; j++) {
      var id = (links[j].getAttribute("href") || "").replace(/^#/, "");
      links[j].classList.toggle("on", !!page && id === page.id);
    }

    /* v10：广播翻页事件，供右侧翻页键 / 页面状态使用 */
    document.dispatchEvent(new CustomEvent("hx:pagechange", {
      detail: { index: current, total: pages.length }
    }));
  }

  /* ---------------- 内容高度兜底 ----------------
     极小屏/特殊语言下若超出，等比缩小，仍然一屏一页 */
  function fitPages() {
    pages.forEach(function (p) {
      var wrap = p.querySelector(":scope > .wrap");
      if (!wrap) return;
      wrap.style.transform = "";
      if (p.classList.contains("page-quiz")) return;

      var prev = wrap.style.justifyContent;
      wrap.style.justifyContent = "flex-start";
      var natural = wrap.scrollHeight;
      var avail = wrap.clientHeight;
      wrap.style.justifyContent = prev;

      if (avail > 0 && natural > avail + 6) {
        var s = Math.max(0.5, avail / natural);
        wrap.style.transform = "scale(" + s + ")";
        wrap.style.transformOrigin = "center center";
        p.classList.add("is-scaled");
      } else {
        p.classList.remove("is-scaled");
      }
    });
  }

  function fitSoon(delay) {
    window.clearTimeout(fitTimer);
    fitTimer = window.setTimeout(fitPages, delay == null ? 120 : delay);
  }

  /* ---------------- 事件 ---------------- */
  function bind() {
    /* 锚点：首屏「启航」、档案卡「看它的做法」、顶部导航 */
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute("href").slice(1);
      for (var i = 0; i < pages.length; i++) {
        if (pages[i].id === id) {
          e.preventDefault();
          goTo(i);
          return;
        }
      }
    }, true);

    /* 键盘 */
    document.addEventListener("keydown", function (e) {
      if (document.querySelector(".modal.open")) return;
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

    /* 滚轮：一次滚动手势 = 翻一页（不会停在页面中间）
       v10：监听挂到 window（capture），不再要求先点击页面/焦点在 .deck 上 */
    window.addEventListener("wheel", function (e) {
      if (document.querySelector(".modal.open")) return;
      if (e.ctrlKey) return;
      // 横向滚动（如年表）交还给浏览器
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;


      e.preventDefault();
      wheelAcc += e.deltaY;

      window.clearTimeout(wheelEndTimer);
      wheelEndTimer = window.setTimeout(function () {
        wheelAcc = 0;
        wheelLock = false;
      }, 650);

      if (wheelLock) return;
      if (Math.abs(wheelAcc) >= 36) {
        wheelLock = true;
        var dir = wheelAcc > 0 ? 1 : -1;
        wheelAcc = 0;
        goTo(current + dir);
      }
    }, { passive: false, capture: true });

    /* 滚动 = 翻页，状态由滚动位置驱动（触摸/系统滚动也能更新） */
    deck.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.setTimeout(function () {
        ticking = false;
        var idx = indexFromScroll();
        if (idx !== current) {
          current = idx;
          updateUI();
          revealPage(pages[idx]);
        }
      }, 80);
    });

    /* 语言切换 */
    document.addEventListener("hx:langchange", function () {
      window.setTimeout(function () {
        fitPages();
        goTo(current, true);
      }, 80);
    });

    /* 尺寸变化（手机地址栏伸缩等） */
    var resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        fitPages();
        goTo(current, true);
      }, 200);
    });

    var toTop = document.getElementById("toTop");
    if (toTop) toTop.addEventListener("click", function () { goTo(0, true); });
  }

  /* ---------------- 启动 ---------------- */
  function init() {
    collectPages();
    if (pages.length === 0) return;
    current = 0;
    deck.scrollTop = 0;
    updateUI();
    revealPage(pages[0]);
    bind();
    window.setTimeout(fitPages, 300);
    window.setTimeout(fitPages, 1200);
  }

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
