/* Qualitative ingredient model. No flavour scores or measured-intensity claims. */
const labIngredients = {
  kombu:{name:'昆布',category:'glutamate',compound:'谷氨酸 · 氨基酸类',description:'代表性呈味物质为谷氨酸。',
    art:'<path d="M25 8Q12 22 23 36T21 73L40 73Q51 57 39 43T42 10Z" fill="#567756"/><path d="M33 13Q24 31 32 46T30 70" stroke="#b8c58d" stroke-width="3" fill="none"/>'},
  fish:{name:'鱼干',category:'nucleotide',compound:'肌苷酸等 · 呈味核苷酸类',description:'可含有肌苷酸等呈味物质，具体情况取决于品种和加工方法。',
    art:'<path d="M9 39Q33 13 58 39Q33 65 9 39Z" fill="#8d9d9f"/><path d="M55 39L75 23L70 39L75 55Z" fill="#526f7d"/><circle cx="22" cy="35" r="3" fill="#193b4e"/><path d="M30 30L43 47M39 28L49 42" stroke="#ecdfb9" stroke-width="2"/>'},
  shiitake:{name:'香菇',category:'nucleotide',compound:'鸟苷酸等 · 呈味核苷酸类',description:'代表性呈味物质包括鸟苷酸，含量受干燥、复水等加工条件影响。',
    art:'<path d="M33 42L29 72Q39 79 50 70L45 41Z" fill="#e7d5b3"/><path d="M6 43Q8 7 39 8Q70 9 74 43Q39 60 6 43Z" fill="#875c3f"/><path d="M26 20L50 39M49 20L27 40" stroke="#f0dfb4" stroke-width="4" stroke-linecap="round"/>'},
  tomato:{name:'番茄',category:'glutamate',compound:'谷氨酸等 · 氨基酸类',description:'含有谷氨酸等呈味物质，含量随成熟等条件变化。',
    art:'<path d="M39 23C8 10 0 56 21 70Q39 80 58 69C79 54 68 11 39 23Z" fill="#c96b49"/><path d="M39 26L23 17L35 18L40 6L45 19L58 15L48 27L39 22L29 30Z" fill="#5c7d50"/><path d="M19 39Q12 49 20 58" fill="none" stroke="#efb38a" stroke-width="4" stroke-linecap="round"/>'}
};
const labPage = (() => {
  const page=document.getElementById('s7');
  const pantry=page.querySelector('.lab-ingredients');
  const water=page.querySelector('.lab-water');
  const items=page.querySelector('.lab-pot-items');
  const insight=page.querySelector('.lab-insight');
  const selected=new Set(), flights=new Map(), effects=new Set();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let synergy=false;
  const icon=key=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" aria-hidden="true">${labIngredients[key].art}</svg>`;
  for(const [key,data] of Object.entries(labIngredients)) {
    const button=document.createElement('button');button.type='button';button.className='lab-card';button.dataset.ingredient=key;button.setAttribute('aria-pressed','false');
    button.innerHTML=icon(key)+`<strong>${data.name}</strong><small>${data.compound}</small><span class="lab-card-info">${data.description}</span>`;
    pantry.append(button);
  }
  const steam=gsap.to(page.querySelectorAll('.lab-steam span'),{y:-20,opacity:.6,duration:3.5,stagger:.5,yoyo:true,repeat:-1,ease:'sine.inOut',paused:true});
  const waves=gsap.to(water,{backgroundPosition:'35px 6px',duration:8,yoyo:true,repeat:-1,ease:'sine.inOut',paused:true});
  function cancelFlight(key) {const f=flights.get(key);if(f){f.animation.kill();f.node.remove();flights.delete(key);}}
  function ring(gold=false) {
    if(reduced.matches)return;
    const node=document.createElement('span');node.className='lab-ring'+(gold?' is-gold':'');page.querySelector('.lab-ripples').append(node);
    const effect={node,animation:null};effects.add(effect);
    effect.animation=gsap.fromTo(node,{scale:.45,opacity:.75},{scale:1.65,opacity:0,duration:gold?1.1:.6,ease:'sine.out',onComplete:()=>{node.remove();effects.delete(effect);}});
  }
  function drawItems() {
    items.replaceChildren();
    for(const key of selected){const node=document.createElement('span');node.dataset.potIngredient=key;node.innerHTML=icon(key);node.setAttribute('aria-label',labIngredients[key].name);if(flights.has(key))node.style.opacity='0';items.append(node);}
  }
  function update(animate=true) {
    const data=[...selected].map(key=>labIngredients[key]);
    page.querySelector('.lab-selection').textContent=data.length?'当前所选：'+data.map(d=>d.name).join('、')+'。':'尚未选择食材。';
    const list=page.querySelector('.lab-compounds');list.replaceChildren();
    data.forEach(d=>{const li=document.createElement('li');const strong=document.createElement('strong');strong.textContent=d.name+' · '+d.compound;const text=document.createElement('div');text.textContent=d.description;li.append(strong,text);list.append(li);});
    const next=data.some(d=>d.category==='glutamate')&&data.some(d=>d.category==='nucleotide');
    insight.textContent=next?'发现鲜味协同组合！谷氨酸与部分呈味核苷酸在适当条件下可以相互增强鲜味感知。':data.length?'这里展示的是食材中的代表性呈味物质；可以加入另一类来源，探索可能的协同作用。':'选择一种食材，看看鲜味从哪里来。';
    insight.classList.toggle('is-synergy',next);
    gsap.killTweensOf(insight);
    if(animate&&!reduced.matches)gsap.fromTo(insight,{opacity:.2,y:4},{opacity:1,y:0,duration:.5,ease:'sine.out'});
    else gsap.set(insight,{opacity:1,y:0});
    if(next&&!synergy&&animate)ring(true);
    synergy=next;
    pantry.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(selected.has(button.dataset.ingredient))));
    drawItems();
  }
  function fly(key,button) {
    if(reduced.matches){ring();return;}
    const a=button.querySelector('svg').getBoundingClientRect(),b=water.getBoundingClientRect();
    const start={x:a.left+a.width/2-28,y:a.top+a.height/2-28};
    const end={x:b.left+b.width/2-28,y:b.top+b.height/2-28};
    const control={x:(start.x+end.x)/2,y:Math.min(start.y,end.y)-70};
    const node=document.createElement('div');node.className='lab-flying-icon';node.innerHTML=icon(key);
    node.setAttribute('aria-hidden','true');node.style.cssText='position:fixed;left:0;top:0;width:56px;height:56px;pointer-events:none;z-index:90';
    document.body.append(node);gsap.set(node,{x:start.x,y:start.y});
    const position={t:0},flight={node,animation:null};flights.set(key,flight);
    flight.animation=gsap.to(position,{t:1,duration:.8,ease:'sine.inOut',onUpdate:()=>{
      const t=position.t,u=1-t;
      gsap.set(node,{x:u*u*start.x+2*u*t*control.x+t*t*end.x,y:u*u*start.y+2*u*t*control.y+t*t*end.y,opacity:1-.2*t});
    },onComplete:()=>{
      node.remove();flights.delete(key);
      if(page.classList.contains('active')&&selected.has(key)){drawItems();ring();}
    }});
  }
  function toggle(key,button) {
    cancelFlight(key);
    if(selected.has(key))selected.delete(key);else{selected.add(key);fly(key,button);}
    update();
  }
  function clearTemporary() {
    [...flights.keys()].forEach(cancelFlight);
    effects.forEach(effect=>{effect.animation.kill();effect.node.remove();});effects.clear();
    gsap.killTweensOf(insight);
  }
  function resetExperiment() {clearTemporary();selected.clear();synergy=false;update(false);}
  function stop(){clearTemporary();steam.pause();waves.pause();}
  function reset(){stop();resetExperiment();page.scrollTop=0;gsap.set(page.querySelectorAll('.lab-header,.lab-card,.lab-kitchen,.lab-discovery,.lab-footer'),{autoAlpha:0,y:12});steam.pause(0);waves.pause(0);sync();}
  function sync(){const play=page.classList.contains('active')&&!document.hidden&&!reduced.matches;[steam,waves].forEach(animation=>play?animation.resume():animation.pause());}
  pantry.addEventListener('click',event=>{const button=event.target.closest('[data-ingredient]');if(button)toggle(button.dataset.ingredient,button);});
  page.querySelector('.lab-reset').addEventListener('click',resetExperiment);
  page.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key))event.stopPropagation();});
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  window.addEventListener('resize',()=>{clearTemporary();drawItems();});
  page.addEventListener('scroll',()=>{if(flights.size){[...flights.keys()].forEach(cancelFlight);drawItems();}},{passive:true});
  resetExperiment();
  return {reset,stop,resetExperiment};
})();
const tl7=gsap.timeline({paused:true,defaults:{immediateRender:false}})
  .to('#s7 .lab-header',{autoAlpha:1,y:0,duration:.7,ease:'sine.out'},0)
  .to('#s7 .lab-card',{autoAlpha:1,y:0,duration:.4,stagger:.1,ease:'sine.out'},.15)
  .to('#s7 .lab-kitchen,#s7 .lab-discovery,#s7 .lab-footer',{autoAlpha:1,y:0,duration:.7,ease:'sine.out'},.2);
