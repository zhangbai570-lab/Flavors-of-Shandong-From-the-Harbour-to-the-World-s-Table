/* ============================================================
   海味山东 · v11.js —— 首屏标题逐字入场
   把「海味山东」拆成单字，交给你 css/v11.css 的 v11Char 动画
   ============================================================ */
(function () {
  "use strict";

  function splitHeroTitle() {
    var el = document.querySelector(".hero-title .ht-cn");
    if (!el || el.getAttribute("data-v11") === "1") return;
    var text = (el.textContent || "").trim();
    if (!text) return;
    el.textContent = "";
    text.split("").forEach(function (ch, i) {
      var s = document.createElement("span");
      s.className = "v11-char";
      s.textContent = ch;
      s.style.setProperty("--i", i);
      s.style.setProperty("--rot", i % 2 ? "1.5deg" : "-1.5deg");
      el.appendChild(s);
    });
    el.setAttribute("data-v11", "1");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", splitHeroTitle);
  } else {
    splitHeroTitle();
  }
})();
