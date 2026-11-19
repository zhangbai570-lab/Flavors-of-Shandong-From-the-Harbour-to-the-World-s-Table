/* ============================================================
   海味山东 · main.js
   纯原生 JS，无任何外部依赖，file:// 双击即可运行
   ============================================================ */
(function () {
  "use strict";

  var I18N = window.I18N;
  var SITE = window.SITE;
  var LANGS = I18N.order;
  var LANG_KEY = "haixei-shandong-lang";
  var lang = "zh";
  var activeCityId = SITE.cities[0].id;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /* ---------------- 工具 ---------------- */
  function t(key) {
    var dict = I18N[lang] || I18N.zh;
    var v = dict[key];
    return v != null ? v : (I18N.zh[key] != null ? I18N.zh[key] : key);
  }
  function fmt(str, map) {
    return String(str).replace(/\{(\w+)\}/g, function (m, k) {
      return map[k] != null ? map[k] : m;
    });
  }
  function L(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] != null ? obj[lang] : (obj.zh || obj.en || "");
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function pickLang() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved && I18N[saved]) return saved;
    } catch (e) { /* file:// 下可能被禁用 */ }
    return "zh";
  }
  function saveLang(v) {
    try { localStorage.setItem(LANG_KEY, v); } catch (e) { /* ignore */ }
  }

  /* ---------------- 线稿图标 ---------------- */
  var SVG_OPEN = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var SVG_CLOSE = "</svg>";
  function ic(paths) { return SVG_OPEN + paths + SVG_CLOSE; }

  var ICONS = {
    /* 菜品 */
    cucumber: ic('<path d="M16 41c-3-9 3-17 13-19 9-2 17 2 19 9 2 7-4 12-13 14-8 2-16 2-19-4Z"/><path d="M27 22l-2-5M35 20l1-5M43 22l3-4M15 37l-5-2"/><path d="M29 32c2-1 4-1 6 0s4 1 6 0M29 38c2-1 4-1 6 0"/>'),
    prawn: ic('<path d="M46 16C30 16 18 28 20 40"/><path d="M46 16l6-4M46 16l8 1M46 16l5-6"/><path d="M20 40l-8 6M20 40l-9 1M20 40l-2 9"/><path d="M25 32l-5 4M29 26l-4 4"/><path d="M30 21c3 2 5 5 6 8M24 27c3 2 5 5 6 8"/>'),
    dumpling: ic('<path d="M8 40c2-14 13-22 25-20 10 2 17 8 20 15 1 3-2 6-6 6H14c-4 0-7-1-6-1Z"/><path d="M14 40c5-2 10-2 16 0s11 2 16 0"/><path d="M17 20c1 4 4 7 8 8M27 17c1 4 4 7 8 8M37 19c1 4 4 6 8 7"/>'),
    clam: ic('<path d="M32 50C18 48 9 39 9 29c0-2 2-3 4-3h38c2 0 4 1 4 3 0 10-9 19-23 21Z"/><path d="M32 50V29M22 47l5-19M42 47l-5-19M13 29H8M51 29h5"/><path d="M27 35c2-1 3-1 5 0s3 1 5 0"/>'),
    jelly: ic('<path d="M18 22l14-7 14 7-14 7-14-7Z"/><path d="M18 22v19l14 7 14-7V22"/><path d="M22 26l10-5M36 40l6-3"/>'),
    soup: ic('<path d="M11 29h42c-2 12-10 19-21 19S13 41 11 29Z"/><path d="M9 29h46M20 21c2-3 2-5 0-8M30 20c2-3 2-5 0-8M40 21c2-3 2-5 0-8"/>'),
    noodle: ic('<path d="M11 31h42c-2 12-10 18-21 18S13 43 11 31Z"/><path d="M20 26c4-5 8 4 12-1s8 3 12-2"/><path d="M40 12l-8 15M48 15l-9 13"/>'),
    urchin: ic('<circle cx="32" cy="26" r="10"/><path d="M32 16V6M32 36v10M22 26H12M42 26h10M25 19l-7-7M39 19l7-7M25 33l-7 7M39 33l7 7"/><path d="M20 50h24" opacity=".6"/><path d="M24 55h16" opacity=".4"/>'),

    /* 工序 */
    fish: ic('<path d="M10 33c8-9 21-11 30-4 3 2 5 5 6 8-8 8-22 9-30 2-2-2-5-4-6-6Z"/><path d="M46 26l8-5v21l-8-5"/><circle cx="20" cy="31" r="1.6"/><path d="M31 27c2 3 2 6 0 9"/>'),
    knife: ic('<path d="M8 46l18-30 9 5-18 30-9-5Z"/><path d="M27 21l9 5M10 43l9 5"/><path d="M40 44l14 8M46 36l10 5"/>'),
    bowl: ic('<path d="M11 32h38c-2 11-9 17-19 17S13 43 11 32Z"/><path d="M9 32h42"/><path d="M24 23c3-4 7-4 10 0s7 4 10 0"/><path d="M32 12v8"/>'),
    chive: ic('<path d="M22 48c-4-10-4-22 0-32M32 48c-2-11-2-24 0-34M42 48c4-10 4-22 0-32"/><path d="M18 38h28M20 26l-4-4M32 22l3-5M42 26l4-4"/>'),
    roller: ic('<rect x="10" y="24" width="34" height="12" rx="6"/><path d="M44 30h6M50 26v8"/><path d="M18 40v10M36 40v10"/><path d="M12 42h10M32 42h10"/>'),
    pot: ic('<path d="M12 30h40v12c0 5-4 8-9 8H21c-5 0-9-3-9-8V30Z"/><path d="M10 30h44M22 30v-5h20v5"/><path d="M20 18c2-2 2-4 0-6M32 17c2-2 2-4 0-6M44 18c2-2 2-4 0-6"/>')
  };

  /* ---------------- 壹 · 港口地图 ---------------- */
  var panel = $("#portPanel");
  var portLayer = $("#portLayer");
  var mapHotspots = $("#mapHotspots");
  /* v10：美工山东地图上的点位（百分比，按图片 1400×933 量取） */
  var MAP_POINT = {
    qingdao: { x: 63.22, y: 58.22 },
    yantai: { x: 75.97, y: 17.29 },
    weihai: { x: 94.3, y: 42.26 },
    rizhao: { x: 50.12, y: 74.52 }
  };

  function renderPorts() {
    portLayer.innerHTML = SITE.cities.map(function (c) {
      var name = L(c.name);
      var dish = L(c.dish);
      var anchor = c.labelAnchor || "middle";
      var on = c.id === activeCityId ? " active" : "";
      return (
        '<g class="port' + on + '" data-id="' + c.id + '" tabindex="0" role="button" aria-label="' + esc(name + " · " + dish) + '">' +
          '<circle class="port-halo" cx="' + c.x + '" cy="' + c.y + '" r="18"></circle>' +
          '<circle class="port-pulse" cx="' + c.x + '" cy="' + c.y + '" r="6"></circle>' +
          '<circle class="port-core" cx="' + c.x + '" cy="' + c.y + '" r="4.6"></circle>' +
          '<text class="port-label" x="' + (c.x + c.labelDx) + '" y="' + (c.y + c.labelDy) + '" text-anchor="' + anchor + '">' + esc(name) + "</text>" +
          '<text class="port-label-en" x="' + (c.x + c.labelDx) + '" y="' + (c.y + c.labelDy + 13) + '" text-anchor="' + anchor + '">' + esc(c.en) + "</text>" +
        "</g>"
      );
    }).join("");

    if (mapHotspots) {
      mapHotspots.innerHTML = SITE.cities.map(function (c) {
        var pt = MAP_POINT[c.id] || { x: 50, y: 50 };
        var on = c.id === activeCityId ? " on" : "";
        var left = (c.id === "weihai" || c.id === "rizhao") ? " left" : "";
        return (
          '<button type="button" class="map-pin' + on + left + '" data-id="' + c.id + '"' +
            ' style="--mx:' + pt.x + "%;--my:" + pt.y + '%"' +
            ' aria-label="' + esc(L(c.name) + " · " + L(c.dish)) + '">' +
            '<i class="map-pin-dot"></i>' +
            '<span class="map-pin-label">' + esc(L(c.name)) + "<em>" + esc(c.en) + "</em></span>" +
          "</button>"
        );
      }).join("");
    }
  }

  function setActivePort(id) {
    activeCityId = id;
    if (mapHotspots) {
      $$(".map-pin", mapHotspots).forEach(function (b) {
        b.classList.toggle("on", b.getAttribute("data-id") === id);
      });
    }
    $$(".port", portLayer).forEach(function (g) {
      g.classList.toggle("active", g.getAttribute("data-id") === id);
    });
    renderPanel(true);
    if (window.matchMedia("(max-width: 1000px)").matches) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function renderPanel(animate) {
    var c = SITE.cities.filter(function (x) { return x.id === activeCityId; })[0] || SITE.cities[0];
    var forms = c.forms.map(function (f) {
      return "<li><span>" + esc(t("lname_" + f.key)) + "</span><b>" + esc(f.word) + "</b></li>";
    }).join("");
    var subName = lang === "zh" ? c.en : c.name.zh;

    panel.innerHTML =
      '<div class="pp-head">' +
        '<span class="pp-no">PORT ' + c.no + "</span>" +
        '<span class="pp-region">' + esc(L(c.region)) + "</span>" +
      "</div>" +
      '<h3 class="pp-name">' + esc(L(c.name)) + "<em>" + esc(subName) + "</em></h3>" +
      '<div class="pp-block">' +
        '<span class="pp-label">' + esc(t("panel_climate")) + "</span>" +
        "<p>" + esc(L(c.climate)) + "</p>" +
      "</div>" +
      '<div class="pp-block">' +
        '<span class="pp-label">' + esc(t("panel_customs")) + "</span>" +
        "<p>" + esc(L(c.customs)) + "</p>" +
      "</div>" +
      '<p class="pp-dialect-line"><b>' + esc(t("panel_dialect")) + "</b>" + esc(L(c.dialect)) + "</p>" +
      '<div class="pp-block pp-story-block">' +
        '<span class="pp-label">' + esc(t("panel_story")) + "</span>" +
        "<p>" + esc(L(c.story)) + "</p>" +
      "</div>" +
      '<a class="pp-link" href="#banquet">' + esc(t("panel_link")) + "</a>";

    if (animate) {
      panel.classList.remove("anim");
      void panel.offsetWidth;
      panel.classList.add("anim");
    }
  }

  /* ---------------- 贰 · 词源翻卡 ---------------- */
  var lexGrid = $("#lexGrid");

  function renderLexicon() {
    lexGrid.innerHTML = SITE.lexicon.map(function (w, i) {
      var forms = w.forms.map(function (f) {
        return "<li><span>" + esc(t("lname_" + f.key)) + "</span><b>" + esc(f.word) + "</b></li>";
      }).join("");
      var preview = w.forms.filter(function (f) { return f.key !== "zh"; }).slice(0, 3).map(function (f) {
        return "<span>" + esc(f.word) + "</span>";
      }).join("");
      return (
        '<div class="lex-card" role="button" tabindex="0" data-i="' + i + '" aria-label="' + esc(L(w.word)) + ' · ' + esc(t("common_flip")) + '">' +
          '<div class="lex-inner">' +
            '<div class="lex-face lex-front">' +
              '<span class="lex-watermark">' + w.no + "</span>" +
              '<div class="lex-top"><span class="lex-no">LEXICON · ' + w.no + '</span><span class="lex-pinyin">' + esc(w.pinyin) + "</span></div>" +
              '<div class="lex-glyph">' + esc(w.glyph) + "</div>" +
              '<div class="lex-preview">' + preview + "</div>" +
              '<div><p class="lex-word">' + esc(L(w.word)) + "</p></div>" +
              '<span class="lex-flip">' + esc(t("common_flip")) + " <i>↻</i></span>" +
            "</div>" +
            '<div class="lex-face lex-back">' +
              '<div class="lex-back-top"><b>' + esc(w.glyph) + " · " + esc(L(w.word)) + '</b><span>LEXICON</span></div>' +
              '<ul class="lex-forms">' + forms + "</ul>" +
              '<p class="lex-story">' + esc(L(w.story)) + "</p>" +
              '<p class="lex-backfoot">' + esc(t("common_back")) + " ↺</p>" +
            "</div>" +
          "</div>" +
        "</div>"
      );
    }).join("");
    window.requestAnimationFrame(fitLexBacks);
  }

  function toggleFlip(card) {
    if (!card) return;
    var on = card.classList.toggle("flipped");
    card.setAttribute("aria-pressed", on ? "true" : "false");
    if (on && !card.querySelector(".lex-back").style.fontSize) {
      fitLexBacks();
    }
  }

  /* 词源卡背面：自动选一个「刚好放满卡片」的字号（不再需要卡片内滚动） */
  function bestLexSize(back) {
    if (!back || !back.clientHeight) return 0;
    var max = window.innerWidth <= 860 ? 18 : 24;
    var lo = 7, hi = max, best = 7, i, mid;
    for (i = 0; i < 9; i++) {
      mid = (lo + hi) / 2;
      back.style.fontSize = mid + "px";
      if (back.scrollHeight <= back.clientHeight + 1) { best = mid; lo = mid; }
      else { hi = mid; }
    }
    return best;
  }
  /* 统一字号：所有卡片都用「内容最多那张」刚好放满的尺寸 */
  function fitLexBacks() {
    var backs = Array.prototype.slice.call(document.querySelectorAll(".lex-back"));
    if (!backs.length) return;
    document.body.classList.add("lex-measuring");
    var min = Infinity;
    backs.forEach(function (b) {
      var s = bestLexSize(b);
      if (s) min = Math.min(min, s);
    });
    document.body.classList.remove("lex-measuring");
    if (!isFinite(min)) return;
    backs.forEach(function (b) { b.style.fontSize = min + "px"; });
  }

  /* ---------------- 叁 · 宴席 ---------------- */
  var dishGrid = $("#dishGrid");

  function renderDishes() {
    var others = ["zh", "en", "ja", "ko"].filter(function (k) { return k !== lang; });
    dishGrid.innerHTML = SITE.dishes.map(function (d, i) {
      var rows = others.map(function (k) {
        return '<div class="float-row"><span>' + esc(t("lname_" + k)) + "</span><b>" + esc(d.names[k] || L(d.names)) + "</b></div>";
      }).join("");
      return (
        '<article class="dish-card" data-id="' + d.id + '" tabindex="0">' +
          '<span class="dish-no">' + ("0" + (i + 1)).slice(-2) + "</span>" +
          '<div class="dish-plate"><img class="dish-art" src="assets/img/dish-' + d.id + '.webp" alt="' + esc(L(d.names)) + '" draggable="false" onerror="this.style.display=\'none\'"><span class="dish-char">' + esc(d.char || "") + "</span></div>" +
          '<h3 class="dish-name">' + esc(L(d.names)) + "</h3>" +
          '<p class="dish-pinyin">' + esc(d.pinyin) + "</p>" +
          '<p class="dish-tag">' + esc(L(d.tag)) + "</p>" +
          '<div class="dish-float">' + rows + '<p class="float-hint">' + esc(t("banquet_hint")) + "</p></div>" +
        "</article>"
      );
    }).join("");
  }

  /* ---------------- 肆 · 工序 ---------------- */
  var craftGrid = $("#craftGrid");

  function renderCraft() {
    craftGrid.innerHTML = SITE.craft.map(function (s) {
      var big = s.verb.zh;
      var small = lang === "zh" ? s.verb.en : s.verb[lang];
      return (
        '<article class="craft-step">' +
          '<span class="step-no">' + esc(t("step")) + " " + s.no + "</span>" +
          '<div class="step-verb-row"><span class="step-verb">' + esc(big) + '</span><span class="step-verb-en">' + esc(small) + "</span></div>" +
          '<div class="step-icon"><img class="step-art" src="assets/img/craft-' + parseInt(s.no, 10) + '.webp" alt="' + esc(L(s.title)) + '" draggable="false" onerror="this.style.display=\'none\'"></div>' +
          '<h3 class="step-title">' + esc(L(s.title)) + "</h3>" +
          '<p class="step-desc">' + esc(L(s.desc)) + "</p>" +
          '<p class="step-meta">' + esc(L(s.meta)) + "</p>" +
        "</article>"
      );
    }).join("");
  }

  /* ---------------- 伍 · 词源侦探 ---------------- */
  var quizBox = $("#quizBox");

  function shuffled(n) {
    var a = [];
    for (var i = 0; i < n; i++) a.push(i);
    for (var j = a.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var tmp = a[j]; a[j] = a[k]; a[k] = tmp;
    }
    return a;
  }
  function buildOrders() {
    return SITE.quiz.map(function (q) { return shuffled(q.options.length); });
  }

  var quiz = { index: 0, score: 0, answered: false, picked: -1, finished: false, orders: buildOrders() };

  function quizRank(score) {
    if (score >= 5) return 1;
    if (score >= 3) return 2;
    return 3;
  }

  function renderQuiz() {
    var total = SITE.quiz.length;

    if (quiz.finished) {
      var rank = quizRank(quiz.score);
      quizBox.innerHTML =
        '<div class="quiz-result">' +
          '<p class="qr-score">' + quiz.score + "<small> / " + total + "</small></p>" +
          '<p class="qr-rank">' + esc(t("quiz_result_" + rank)) + "</p>" +
          '<p class="qr-desc">' + esc(t("quiz_explain")) + " · " + esc(t("s5_lead")) + "</p>" +
          '<div class="qr-actions"><button type="button" class="btn btn-primary btn-small" data-restart>' + esc(t("quiz_again")) + "</button></div>" +
        "</div>";
      return;
    }

    var q = SITE.quiz[quiz.index];
    var order = quiz.orders[quiz.index] || [0, 1, 2, 3];
    var opts = order.map(function (orig, pos) {
      var cls = "quiz-opt";
      if (quiz.answered) {
        if (orig === q.answer) cls += " correct";
        else if (orig === quiz.picked) cls += " wrong";
        else cls += " dim";
      }
      return (
        '<button type="button" class="' + cls + '" data-opt="' + orig + '"' + (quiz.answered ? " disabled" : "") + ">" +
          "<i>" + "ABCD".charAt(pos) + "</i><span>" + esc(L(q.options[orig].text)) + "</span>" +
        "</button>"
      );
    }).join("");

    var pct = Math.round(((quiz.index + (quiz.answered ? 1 : 0)) / total) * 100);
    var ok = quiz.answered && quiz.picked === q.answer;
    var feedback = quiz.answered
      ? '<div class="quiz-feedback show">' +
          '<div class="qf-head' + (ok ? "" : " bad") + '"><i>' + (ok ? "✓" : "×") + "</i>" + esc(ok ? t("quiz_correct") : t("quiz_wrong")) + "</div>" +
          '<p class="qf-expl">' + esc(t("quiz_explain")) + "：" + esc(L(q.explain)) + "</p>" +
          '<div class="quiz-actions"><button type="button" class="btn btn-primary btn-small" data-next>' + esc(t("quiz_next")) + " →</button></div>" +
        "</div>"
      : "";

    quizBox.innerHTML =
      '<div class="quiz-top"><span>' + fmt(t("quiz_progress"), { n: quiz.index + 1, m: total }) + "</span><span>" + fmt(t("quiz_score"), { s: quiz.score }) + "</span></div>" +
      '<div class="quiz-bar"><i style="width:' + pct + '%"></i></div>' +
      '<p class="quiz-q">' + esc(L(q.q)) + "</p>" +
      '<div class="quiz-opts">' + opts + "</div>" +
      feedback;
  }

  function answerQuiz(i) {
    if (quiz.answered || quiz.finished) return;
    quiz.picked = i;
    quiz.answered = true;
    if (i === SITE.quiz[quiz.index].answer) quiz.score += 1;
    renderQuiz();
  }

  function nextQuiz() {
    if (quiz.index >= SITE.quiz.length - 1) {
      quiz.finished = true;
    } else {
      quiz.index += 1;
      quiz.answered = false;
      quiz.picked = -1;
    }
    renderQuiz();
  }

  function restartQuiz() {
    quiz = { index: 0, score: 0, answered: false, picked: -1, finished: false, orders: buildOrders() };
    renderQuiz();
  }

  /* ---------------- 陆 · 年表 ---------------- */
  var timeTrack = $("#timeTrack");
  var timeDots = $("#timeDots");
  var timePrev = $("#timePrev");
  var timeNext = $("#timeNext");

  var TIME_ART = ["tang", "yuan", "ming", "qing", "now"];

  function renderTimeline() {
    timeTrack.innerHTML = SITE.timeline.map(function (item, i) {
      return (
        '<article class="time-card">' +
          '<div class="time-art"><img src="assets/img/time-' + (TIME_ART[i] || "now") + '.webp" alt="' + esc(L(item.title)) + '" draggable="false"></div>' +
          '<p class="time-year">' + esc(item.year) + "</p>" +
          '<p class="time-date">' + esc(L(item.dateLabel)) + "</p>" +
          '<h3 class="time-title">' + esc(L(item.title)) + "</h3>" +
          '<p class="time-text">' + esc(L(item.text)) + "</p>" +
        "</article>"
      );
    }).join("");

    timeDots.innerHTML = SITE.timeline.map(function (item, i) {
      return '<button type="button" data-dot="' + i + '" aria-label="' + esc(L(item.title)) + '"' + (i === 0 ? ' class="on"' : "") + "></button>";
    }).join("");
    updateTimeNav();
  }

  function timeStep() {
    var card = $(".time-card", timeTrack);
    if (!card) return 320;
    return card.offsetWidth + 16;
  }
  function updateTimeNav() {
    if (!timeTrack) return;
    var max = timeTrack.scrollWidth - timeTrack.clientWidth - 2;
    timePrev.disabled = timeTrack.scrollLeft <= 2;
    timeNext.disabled = timeTrack.scrollLeft >= max;
    updateTimeDots();
  }
  function updateTimeDots() {
    var step = timeStep();
    var idx = Math.round(timeTrack.scrollLeft / step);
    $$("button", timeDots).forEach(function (b, i) {
      b.classList.toggle("on", i === idx);
    });
  }

  /* ---------------- 语言切换 ---------------- */
  function applyStaticText() {
    $$("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh" : lang);
    $$(".lang button").forEach(function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function renderAll() {
    applyStaticText();
    renderPorts();
    renderPanel(false);
    renderLexicon();
    renderDishes();
    renderCraft();
    renderQuiz();
    renderTimeline();
  }

  function setLang(next) {
    if (!I18N[next] || next === lang) return;
    lang = next;
    saveLang(lang);
    renderAll();
    window.requestAnimationFrame(fitLexBacks);
    document.dispatchEvent(new CustomEvent("hx:langchange", { detail: { lang: lang } }));
  }

  /* ---------------- 弹窗 ---------------- */
  var modal = $("#aiModal");
  var lastFocus = null;

  function openAI() {
    lastFocus = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var btn = $(".modal-x", modal);
    if (btn) btn.focus();
  }
  function closeAI() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function renderAI() {
    $("#aiBody").innerHTML = SITE.aiStatement.map(function (b) {
      return "<h4>" + esc(b.h) + "</h4><p>" + esc(b.p) + "</p>";
    }).join("");
  }

  /* ---------------- 滚动相关 ---------------- */
  function initScrollFx() {
    var nav = $("#nav");
    var bar = $("#progressBar");
    var ticking = false;
    function update() {
      var y = window.scrollY || document.documentElement.scrollTop;
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var p = docH > 0 ? Math.min(1, y / docH) : 0;
      nav.classList.toggle("scrolled", y > 40);
      bar.style.transform = "scaleX(" + p + ")";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  function initReveal() {
    var els = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- 事件绑定 ---------------- */
  function bindEvents() {
    /* 语言 */
    $$(".lang button").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
    });

    /* 港口 */
    portLayer.addEventListener("click", function (e) {
      var g = e.target.closest ? e.target.closest(".port") : null;
      if (g) setActivePort(g.getAttribute("data-id"));
    });
    portLayer.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
      var g = e.target.closest ? e.target.closest(".port") : null;
      if (g) { e.preventDefault(); setActivePort(g.getAttribute("data-id")); }
    });

    /* v10：美工地图热区 */
    if (mapHotspots) {
      mapHotspots.addEventListener("click", function (e) {
        var b = e.target.closest ? e.target.closest(".map-pin") : null;
        if (b) setActivePort(b.getAttribute("data-id"));
      });
    }

    /* 翻卡 */
    lexGrid.addEventListener("click", function (e) {
      var card = e.target.closest ? e.target.closest(".lex-card") : null;
      if (card) toggleFlip(card);
    });
    lexGrid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
      var card = e.target.closest ? e.target.closest(".lex-card") : null;
      if (card) { e.preventDefault(); toggleFlip(card); }
    });

    /* 宴席（触屏点击展开） */
    dishGrid.addEventListener("click", function (e) {
      var card = e.target.closest ? e.target.closest(".dish-card") : null;
      if (!card) return;
      var on = card.classList.contains("show");
      $$(".dish-card", dishGrid).forEach(function (c) { c.classList.remove("show"); });
      if (!on) card.classList.add("show");
    });

    /* 小游戏 */
    quizBox.addEventListener("click", function (e) {
      var opt = e.target.closest ? e.target.closest("[data-opt]") : null;
      if (opt) { answerQuiz(Number(opt.getAttribute("data-opt"))); return; }
      if (e.target.closest("[data-next]")) { nextQuiz(); return; }
      if (e.target.closest("[data-restart]")) { restartQuiz(); }
    });

    /* 年表 */
    timePrev.addEventListener("click", function () {
      timeTrack.scrollBy({ left: -timeStep(), behavior: "smooth" });
    });
    timeNext.addEventListener("click", function () {
      timeTrack.scrollBy({ left: timeStep(), behavior: "smooth" });
    });
    timeDots.addEventListener("click", function (e) {
      var b = e.target.closest("[data-dot]");
      if (!b) return;
      var i = Number(b.getAttribute("data-dot"));
      timeTrack.scrollTo({ left: i * timeStep(), behavior: "smooth" });
    });
    timeTrack.addEventListener("scroll", function () {
      window.requestAnimationFrame(updateTimeNav);
    }, { passive: true });
    window.addEventListener("resize", updateTimeNav);

    /* 拖动年表 */
    var drag = { on: false, startX: 0, startLeft: 0, moved: false };
    timeTrack.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      drag.on = true;
      drag.startX = e.clientX;
      drag.startLeft = timeTrack.scrollLeft;
      drag.moved = false;
      timeTrack.classList.add("dragging");
    });
    window.addEventListener("pointermove", function (e) {
      if (!drag.on) return;
      var dx = e.clientX - drag.startX;
      if (Math.abs(dx) > 4) drag.moved = true;
      timeTrack.scrollLeft = drag.startLeft - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!drag.on) return;
      drag.on = false;
      timeTrack.classList.remove("dragging");
    });

    /* 弹窗 */
    $$("[data-open-ai]").forEach(function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); openAI(); });
    });
    $$("[data-close-ai]").forEach(function (b) {
      b.addEventListener("click", closeAI);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) closeAI();
    });

    /* 回到顶部 */
    $("#toTop").addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- 启动 ---------------- */
  function init() {
    lang = pickLang();
    renderAI();
    renderAll();
    bindEvents();
    initScrollFx();
    initReveal();
    window.requestAnimationFrame(fitLexBacks);
    var lexFitTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(lexFitTimer);
      lexFitTimer = window.setTimeout(fitLexBacks, 200);
    });
    /* 参考列表（中文文献名） */
    $("#refList").innerHTML = SITE.refs.map(function (r) {
      return "<li>" + esc(r) + "</li>";
    }).join("");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
