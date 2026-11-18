/* Final chapter: semantic word categories, deterministic paths, stable character. */
const endingPage=(() => {
  const page=document.getElementById('s8'),sea=page.querySelector('.ending-sea');
  const wordsData=[
    ['鲜','汉字 · 中文','han','zh-Hans',19,18],['鮮','繁体及日语汉字等形式','han','zh-Hant',71,15],
    ['新鮮','しんせん · 日语汉字词','han','ja',42,33],['신선','韩语汉字词','han','ko',82,40],
    ['旨味 / うま味','umami · 日语味觉词','food','ja',29,58],['감칠맛','韩语鲜味相关表达','food','ko',72,67],
    ['tiên','汉越音 · 历史读音','reading','vi',17,85],['nước mắm','越南鱼露 · 饮食词','food','vi',49,88]
  ];
  const words=wordsData.map(([text,label,kind,lang,x,y])=>{
    const word=document.createElement('div');word.className='ending-word';word.dataset.kind=kind;word.lang=lang;word.style.left=x+'%';word.style.top=y+'%';
    const name=document.createElement('span');name.textContent=text;const small=document.createElement('small');small.textContent=label;small.lang='zh-Hans';word.append(name,small);page.querySelector('.ending-words').append(word);return word;
  });
  const stars=Array.from({length:20},(_,i)=>{
    const dot=document.createElement('span');dot.className='ending-star';dot.style.left=(5+i*37%90)+'%';dot.style.top=(5+i*23%85)+'%';page.querySelector('.ending-stars').append(dot);return dot;
  });
  const sparks=Array.from({length:18},(_,i)=>{
    const dot=document.createElement('span');dot.className='ending-spark';dot.style.left=(10+i*31%80)+'%';dot.style.top=(9+i*19%82)+'%';page.querySelector('.ending-sparks').append(dot);return dot;
  });
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const drift=gsap.to(stars,{y:-14,duration:7,stagger:.12,yoyo:true,repeat:-1,ease:'sine.inOut',paused:true});
  const progress={t:0};let paths=[];
  const actions=page.querySelector('.ending-actions');
  const dialog=page.querySelector('dialog');
  function move(){const t=progress.t,u=1-t;paths.forEach((p,i)=>gsap.set(words[i],{x:2*u*t*p.cx+t*t*p.x,y:2*u*t*p.cy+t*t*p.y}));}
  function reset(){
    stop();progress.t=0;page.scrollTop=0;
    gsap.set(page.querySelectorAll('.ending-header,.ending-legend,.ending-word,.ending-character,.ending-copy,.ending-actions,.ending-star,.ending-spark'),{autoAlpha:0,x:0,y:0});
    gsap.set(words,{xPercent:-50,yPercent:-50});
    paths=words.map((word,i)=>{const x=sea.clientWidth/2-word.offsetLeft,y=sea.clientHeight/2-word.offsetTop;return{x,y,cx:x*.5+(i%2?24:-24),cy:y*.5-24};});
    actions.inert=true;
    gsap.set(sparks,{x:0,y:0});drift.pause(0);sync();
  }
  function stop(){drift.pause();if(dialog.open)dialog.close();}
  function sync(){if(page.classList.contains('active')&&!document.hidden&&!reduced.matches)drift.resume();else drift.pause();}
  function finish(){actions.inert=false;}
  function restart(){const url=new URL(location.href);url.search='';url.hash='';location.assign(url.href);}
  function map(){const url=new URL(location.href);url.hash='';url.searchParams.delete('scene');url.searchParams.delete('end');
    if(url.searchParams.get('debug')==='1'){url.searchParams.set('page','5');url.searchParams.delete('start');}
    else{url.searchParams.delete('page');url.searchParams.set('start','5');}location.assign(url.href);}
  const list=page.querySelector('.ending-source-list'),seen=new Set();
  document.querySelectorAll('#s5 .map-source a,#s7 .lab-sources a').forEach(source=>{
    if(seen.has(source.href))return;seen.add(source.href);
    const li=document.createElement('li');li.append(source.cloneNode(true));list.append(li);
  });
  page.querySelector('[data-ending="restart"]').addEventListener('click',restart);
  page.querySelector('[data-ending="map"]').addEventListener('click',map);
  page.querySelector('[data-ending="sources"]').addEventListener('click',()=>dialog.showModal());
  page.querySelector('.ending-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  page.addEventListener('keydown',event=>{if(dialog.open||event.target.closest('button'))event.stopPropagation();});
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  return {reset,stop,finish,restart,map,move,progress,reduced,words,sparks,sea};
})();
const tl8=gsap.timeline({paused:true,defaults:{immediateRender:false}})
  .to('#s8 .ending-header',{autoAlpha:1,duration:.6},0)
  .to('#s8 .ending-legend',{autoAlpha:1,duration:.6},.3)
  .to('#s8 .ending-star',{autoAlpha:.35,duration:1.2},.3)
  .fromTo(endingPage.words,{autoAlpha:0,y:10},{autoAlpha:1,y:0,duration:.7,stagger:.12,ease:'sine.out'},.7)
  .to(endingPage.words,{y:-4,duration:.45,yoyo:true,repeat:1,ease:'sine.inOut'},2.5)
  .to(endingPage.progress,{t:1,duration:2.2,ease:'sine.inOut',onUpdate:endingPage.move},3.5)
  .to(endingPage.sparks,{autoAlpha:.6,duration:.6},3.5)
  .to(endingPage.sparks,{x:(_,dot)=>endingPage.sea.clientWidth/2-dot.offsetLeft,y:(_,dot)=>endingPage.sea.clientHeight/2-dot.offsetTop,duration:2.2,ease:'sine.inOut'},3.5)
  .to(endingPage.words,{autoAlpha:0,duration:.7},5)
  .to('#s8 .ending-legend',{autoAlpha:0,duration:.7},5)
  .to(endingPage.sparks,{autoAlpha:0,duration:.8},5.5)
  .to('#s8 .ending-character',{autoAlpha:1,duration:1,ease:'sine.inOut'},5.6)
  .fromTo('#s8 .ending-copy',{y:10,autoAlpha:0},{y:0,autoAlpha:1,duration:1.2,ease:'sine.out'},6.7)
  .to('#s8 .ending-actions',{autoAlpha:1,duration:.7},8)
  .to({},{duration:.3});
