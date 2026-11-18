/* Sixth page: data, pronunciation-file interface, repeatable entry and switching. */
const languageData = {
  zh:{name:'中国汉语',lang:'zh-Hans',glyphs:['鲜','鮮'],note:'简体：鲜 · 繁体：鮮',
    facts:[['拼音','xiān'],['核心意义','新鲜、鲜美，也有其他语境中的不同含义。']],
    description:'在汉语中，“鲜”既可以描述食材的新鲜，也可以描述味道的鲜美。它为中国人理解食物与海洋提供了一个生动的文化入口。'},
  ja:{name:'日本日语',lang:'ja',glyphs:['鮮'],note:'汉字：鮮',
    facts:[['音读','セン（sen）'],['关联词','新鮮（しんせん / shinsen）'],['味觉词汇','旨味（うま味）']],
    description:'汉字传入日本后，“鮮”成为日语汉字词汇的一部分。日语仍使用“新鮮”等词描述新鲜，而表示鲜美滋味的“旨味（うま味）”则具有自己的语言和饮食文化背景。“鮮”与“旨味”并不是同一个词。'},
  ko:{name:'韩国韩语',lang:'ko',glyphs:['선'],note:'汉字：鮮 · 韩语汉字音：선',
    facts:[['汉字音','선（seon）'],['关联词','신선（新鮮，sinseon）'],['味觉表达','감칠맛（gamchilmat）']],
    description:'在朝鲜半岛的汉字文化传统中，“鮮”进入了汉字词体系。现代韩语通常使用谚文书写，而“감칠맛”等词体现了当地描述鲜美滋味的方式。'},
  vi:{name:'越南越南语',lang:'vi',glyphs:['tiên'],note:'历史汉字：鮮 · 汉越音：tiên',
    facts:[['汉越音','tiên'],['当代饮食关联词','nước mắm（鱼露）']],
    description:'越南历史上曾广泛使用汉字和喃字，汉越音保存了部分历史语言交流的痕迹。现代越南语主要使用国语字。鱼露是重要的本地饮食文化，但其名称并非“鲜”字的直接翻译。'}
};
// Set each URL to a real pronunciation recording, e.g. audio/xian-zh.mp3.
// Keep empty until a recording has been supplied; no synthetic voice fallback.
const pronunciationSources = {zh:'',ja:'',ko:'',vi:''};
const languagePage = (() => {
  const page = document.getElementById('s6');
  const glyphs = page.querySelector('.language-glyphs');
  const note = page.querySelector('.language-glyph-note');
  const detail = page.querySelector('.language-detail');
  const buttons = [...page.querySelectorAll('[data-language]')];
  const audioButton = page.querySelector('.language-audio');
  const audioNote = page.querySelector('.language-audio-note');
  const audio = new Audio();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let change = null;
  let selected = null;
  const ripple = gsap.to(page.querySelector('.language-ripple'), {
    backgroundPosition:'80px 30px',duration:16,repeat:-1,yoyo:true,ease:'sine.inOut',paused:true
  });
  function stopAudio() { audio.pause(); audio.removeAttribute('src'); }
  function configureAudio(key) {
    audioButton.disabled = !key || !pronunciationSources[key];
    audioButton.textContent = audioButton.disabled ? '发音（尚未配置）' : '播放真实发音';
    audioNote.textContent = audioButton.disabled ? '尚未配置真实音频，不会播放模拟语音。' : '点击播放已配置的真实录音。';
  }
  function render(key) {
    const data = languageData[key];
    const spans = (data ? data.glyphs : ['鮮']).map(text => {
      const span = document.createElement('span'); span.textContent = text; return span;
    });
    glyphs.replaceChildren(...spans);
    glyphs.lang = data?.lang || 'zh-Hant';
    note.textContent = data?.note || '一个汉字，四种语言的回声';
    detail.querySelector('h2').textContent = data?.name || '选择一种语言';
    const facts = detail.querySelector('dl'); facts.replaceChildren();
    for (const [label,value] of data?.facts || []) {
      const dt = document.createElement('dt'); dt.textContent = label;
      const dd = document.createElement('dd'); dd.textContent = value; dd.lang = data.lang;
      facts.append(dt,dd);
    }
    detail.querySelector('p').textContent = data?.description || '从字形、读音与现代用词，看看这个汉字如何进入不同的语言生活。';
    configureAudio(key);
  }
  function choose(key) {
    if (selected === key) return;
    selected = key;
    stopAudio();
    change?.kill();
    buttons.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.language === key)));
    const textNodes = [glyphs,note,detail];
    change = gsap.timeline()
      .to(textNodes,{autoAlpha:0,y:-8,duration:.20,ease:'sine.in'})
      .call(() => render(key))
      .set(textNodes,{y:10})
      .to([glyphs,note],{autoAlpha:1,y:0,duration:.25,ease:'sine.out'})
      .to(detail,{autoAlpha:1,y:0,duration:.25,ease:'sine.out'},.30);
  }
  function stop() { change?.kill(); change=null; ripple.pause(); stopAudio(); }
  function reset() {
    stop(); selected=null; render(null);
    buttons.forEach(button => button.setAttribute('aria-pressed','false'));
    gsap.set([glyphs,note,detail],{autoAlpha:1,y:0});
    gsap.set(page.querySelectorAll('.language-header,.language-stage,.language-info,.language-buttons button'),{autoAlpha:0,y:16});
    ripple.pause(0);
    if (!reduced.matches) ripple.play();
    page.scrollTop=0;
  }
  buttons.forEach(button => button.addEventListener('click',()=>choose(button.dataset.language)));
  audioButton.addEventListener('click',async () => {
    const key=selected;
    if (!key || !pronunciationSources[key]) return;
    stopAudio(); audio.src=pronunciationSources[key];
    try { await audio.play(); if(selected===key) audioNote.textContent='正在播放真实录音。'; }
    catch (_) { if(selected===key) audioNote.textContent='录音暂时无法播放，请检查音频文件路径。'; }
  });
  audio.addEventListener('ended',()=>configureAudio(selected));
  function syncRipple() {
    if (current===5 && !document.hidden && !reduced.matches) ripple.resume(); else ripple.pause();
  }
  document.addEventListener('visibilitychange',syncRipple);
  reduced.addEventListener('change',syncRipple);
  return {reset,stop,choose};
})();
const tl6=gsap.timeline({paused:true,defaults:{immediateRender:false}})
  .to('#s6 .language-header',{autoAlpha:1,y:0,duration:.6,ease:'sine.out'},0)
  .to('#s6 .language-stage',{autoAlpha:1,y:0,duration:.8,ease:'sine.out'},.15)
  .to('#s6 .language-buttons button',{autoAlpha:1,y:0,duration:.4,stagger:.12,ease:'sine.out'},.5)
  .to('#s6 .language-info',{autoAlpha:1,y:0,duration:.45,ease:'sine.out'},.9);

