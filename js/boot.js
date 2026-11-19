/* 海味山东 · 首屏加载等待层
   预加载首屏背景、词源纸纹、卡片框，加载完成后再淡出 */
(function () {
  var loader = document.getElementById("bootLoader");
  if (!loader) return;

  var started = Date.now();
  var hidden = false;

  function hide() {
    if (hidden) return;
    hidden = true;
    var wait = Math.max(0, 450 - (Date.now() - started));
    window.setTimeout(function () {
      loader.classList.add("done");
      window.setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 650);
    }, wait);
  }

  function preload(src) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(true); };
      img.onerror = function () { resolve(false); };
      img.src = src;
    });
  }

  if (!window.Promise) {
    window.setTimeout(hide, 1500);
    return;
  }

  var hero = preload("assets/img/hero-bg.webp").then(function (ok) {
    return ok ? true : preload("assets/img/hero-bg.jpg");
  });

  Promise.all([
    hero,
    preload("assets/img/lex-bg.webp"),
    preload("assets/img/card-frame.webp"),
  ]).then(function () { hide(); }).catch(function () { hide(); });

  // 兜底：8 秒还没好就直接放行，避免一直卡在等待层
  window.setTimeout(hide, 8000);
})();