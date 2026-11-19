/* 海味山东 · 首屏加载等待层
   先把整站图片（首屏背景、纸纹、菜品、工序、年表、装饰）全部加载完，
   再淡出等待页，避免翻到后面才突然出现贴图 */
(function () {
  var loader = document.getElementById("bootLoader");
  if (!loader) return;

  var IMAGES = [
    "assets/img/hero-bg.webp",
    "assets/img/lex-bg.webp",
    "assets/img/card-frame.webp",
    "assets/img/craft-1.webp",
    "assets/img/craft-2.webp",
    "assets/img/craft-3.webp",
    "assets/img/craft-4.webp",
    "assets/img/craft-5.webp",
    "assets/img/craft-6.webp",
    "assets/img/decor-boat.webp",
    "assets/img/decor-bowl.webp",
    "assets/img/decor-compass.webp",
    "assets/img/decor-net.webp",
    "assets/img/decor-star.webp",
    "assets/img/dish-clam.webp",
    "assets/img/dish-dumpling.webp",
    "assets/img/dish-haishen.webp",
    "assets/img/dish-jelly.webp",
    "assets/img/dish-noodle.webp",
    "assets/img/dish-prawn.webp",
    "assets/img/dish-soup.webp",
    "assets/img/dish-urchin.webp",
    "assets/img/time-ming.webp",
    "assets/img/time-now.webp",
    "assets/img/time-qing.webp",
    "assets/img/time-tang.webp",
    "assets/img/time-yuan.webp"
  ];

  var started = Date.now();
  var hidden = false;
  var heroOk = false;

  function hide() {
    if (hidden) return;
    hidden = true;
    var wait = Math.max(0, 500 - (Date.now() - started));
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
    window.setTimeout(hide, 2000);
    return;
  }

  var first = preload(IMAGES[0]).then(function (ok) {
    heroOk = ok;
    if (!ok) return preload("assets/img/hero-bg.jpg");
    return true;
  });

  var rest = IMAGES.slice(1).map(function (src) { return preload(src); });

  Promise.all([first].concat(rest)).then(function () { hide(); }).catch(function () { hide(); });

  // 兜底：20 秒还没全部好就直接放行
  window.setTimeout(hide, 20000);
})();
