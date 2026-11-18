"""Headless Edge acceptance checks for page seven, including all 16 combinations."""
from pathlib import Path
from html.parser import HTMLParser
import json, subprocess
root=Path(__file__).resolve().parents[1]
temporary=root/'umami-test.html'
edge=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
test=r'''<script>
(() => {
  const results=[];
  const check=(name,pass)=>results.push({name,pass:Boolean(pass)});
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const ticker=setInterval(()=>gsap.ticker.tick(),16);
  async function run(){
    try{
      let attempts=0;
      while((current!==6 || busy || document.getElementById('simpleDebugTransit')) && attempts++<150)await wait(80);
      check('debug direct seventh page',current===6&&!busy);
      const cards=[...document.querySelectorAll('#s7 .lab-card')];
      check('four independent cards',cards.length===4);
      check('initial empty',cards.every(c=>c.getAttribute('aria-pressed')==='false'));
      check('science sources',document.querySelectorAll('#s7 .lab-sources a').length===3);
      for(let mask=0;mask<16;mask++){
        labPage.resetExperiment();
        cards.forEach((card,i)=>{if(mask&(1<<i))card.click();});
        const expected=Boolean((mask&9)&&(mask&6));
        check('combination '+mask,document.querySelector('#s7 .lab-insight').classList.contains('is-synergy')===expected);
        check('selection '+mask,cards.every((c,i)=>(c.getAttribute('aria-pressed')==='true')===Boolean(mask&(1<<i))));
      }
      labPage.resetExperiment();cards[0].click();await wait(100);
      const flying=document.querySelector('.lab-flying-icon');
      check('flight fixed size',flying&&Math.abs(flying.getBoundingClientRect().width-56)<1);
      cards[0].click();check('cancel removes in-flight clone',!document.querySelector('.lab-flying-icon'));
      cards[1].click();document.querySelector('#s7 .lab-reset').click();
      check('reset removes animation and ingredients',!document.querySelector('.lab-flying-icon')&&!document.querySelector('[data-pot-ingredient]')&&cards.every(c=>c.getAttribute('aria-pressed')==='false'));
      cards[2].click();await wait(1000);
      check('ingredient arrives in soup',!document.querySelector('.lab-flying-icon')&&document.querySelector('[data-pot-ingredient="shiitake"]'));
      cards[0].click();await wait(600);
      check('synergy text readable',document.querySelector('#s7 .lab-insight').textContent.includes('适当条件')&&Number(getComputedStyle(document.querySelector('#s7 .lab-insight')).opacity)>.99);
      check('no horizontal overflow',pages[6].scrollWidth<=pages[6].clientWidth+1);
      check('native keyboard controls',cards.every(c=>c.tagName==='BUTTON'&&c.tabIndex===0));
      cards[3].click();prevBtn.click();await wait(1600);
      check('leave cleans transient animation',current===5&&!document.querySelector('.lab-flying-icon')&&!document.querySelector('.lab-ring'));
      nextBtn.click();await wait(1200);
      check('re-entry clean and playable',current===6&&!busy&&cards.every(c=>c.getAttribute('aria-pressed')==='false'));
      cards[3].click();check('re-entry interactions work',cards[3].getAttribute('aria-pressed')==='true');
    }catch(e){check(e.stack,false);}
    clearInterval(ticker);
    const p=document.createElement('pre');p.id='lab-results';p.textContent=JSON.stringify(results);document.body.append(p);
  }
  run();
})();
</script>'''
class Parser(HTMLParser):
    active=False
    text=''
    def handle_starttag(self,tag,attrs):
        if dict(attrs).get('id')=='lab-results':self.active=True
    def handle_endtag(self,tag):
        if tag=='pre':self.active=False
    def handle_data(self,data):
        if self.active:self.text+=data
try:
    html=(root/'xian_v4_fixed.html').read_text(encoding='utf-8')
    temporary.write_text(html.replace('</body>',test+'</body>'),encoding='utf-8')
    for size in ['1366,900','390,844']:
        output=subprocess.run([edge,'--headless','--disable-gpu','--no-first-run','--disable-extensions',
            '--user-data-dir='+str(root/'.edge-lab-test'),'--window-size='+size,
            '--virtual-time-budget=16000','--dump-dom',temporary.as_uri()+'?debug=1&page=7'],
            capture_output=True,timeout=60,creationflags=subprocess.CREATE_NO_WINDOW)
        parser=Parser();parser.feed(output.stdout.decode('utf-8',errors='replace'))
        assert parser.text,'No browser result for '+size
        results=json.loads(parser.text)
        failures=[r for r in results if not r['pass']]
        print(size,len(results),'checks; failures:',json.dumps(failures,ensure_ascii=False),flush=True)
        assert not failures
finally:temporary.unlink(missing_ok=True)
