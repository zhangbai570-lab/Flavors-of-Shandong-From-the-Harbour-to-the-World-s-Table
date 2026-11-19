/* 海味山东 · 首屏加载等待层
   等首屏背景图（webp 优先，jpg 回退）加载完成后再淡出 */
(function () {
  var loader = document.getElementById("bootLoader");
  if (!loader) return;

  var started = Date.now();
  var hidden = false;

  function hide() {
    if (hidden) return;
    hidden = true;
    // 至少展示 450ms，避免缓存命中时闪一下
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
    window.setTimeout(hide, 1200);
    return;
  }

  preload("assets/img/hero-bg.webp")
    .then(function (ok) {
      if (ok) return true;
      return preload("assets/img/hero-bg.jpg");
    })
    .then(function () { hide(); })
    .catch(function () { hide(); });

  // 兜底：8 秒还没好就直接放行，避免一直卡在等待层
  window.setTimeout(hide, 8000);
})();
