/* ============================================================
   海味山东 · v12.js —— 首屏海报的滚动视差
   参考品牌官网开场：首屏主视觉随滚动轻微下移 + 淡出，进入下一屏
   尊重 prefers-reduced-motion
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init() {
    if (reduce) return;
    var deck = document.getElementById("deck");
    var stage = document.querySelector(".hero-v14-inner, .poster-stage");
    if (!deck || !stage) return;

    var ticking = false;
    function update() {
      ticking = false;
      var p = Math.min(1, Math.max(0, deck.scrollTop / window.innerHeight));
      stage.style.opacity = String(1 - p * 0.92);
      stage.style.transform =
        "translate3d(0," + (-p * 64).toFixed(1) + "px,0) scale(" + (1 - p * 0.02).toFixed(3) + ")";
    }

    deck.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
