"""Headless Edge checks for the embedded language page on desktop and mobile."""
from pathlib import Path
from html.parser import HTMLParser
import json
import subprocess

root=Path(__file__).resolve().parents[1]
temporary=root/'language-test.html'
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
      while((current!==5 || busy || document.getElementById('simpleDebugTransit')) && attempts++<150) await wait(80);
      check('debug direct page six',current===5 && !busy);
      check('eight pages and timelines',pages.length===8 && timelines.length===8);
      check('initial traditional character',document.querySelector('.language-glyphs').textContent==='鮮');
      check('entry visible',getComputedStyle(document.querySelector('.language-stage')).visibility==='visible');
      check('global fish hidden',getComputedStyle(fish).visibility==='hidden');
      for(const [key,text] of [['zh','xiān'],['ja','セン'],['ko','감칠맛'],['vi','nước mắm']]){
        document.querySelector(`[data-language="${key}"]`).click(); await wait(700);
        check('content '+key,document.querySelector('.language-detail').textContent.includes(text));
        check('selected '+key,document.querySelector(`[data-language="${key}"]`).getAttribute('aria-pressed')==='true');
        check('audio unconfigured '+key,document.querySelector('.language-audio').disabled);
      }
      for(const key of ['zh','ja','ko','vi']) document.querySelector(`[data-language="${key}"]`).click();
      await wait(750);
      check('rapid changes settle on latest',document.querySelector('.language-detail h2').textContent==='越南越南语');
      check('no overlapping glyphs',document.querySelector('.language-glyphs').children.length===1);
      check('switch content visible',Number(getComputedStyle(document.querySelector('.language-detail')).opacity)>.99);
      check('no horizontal overflow',pages[5].scrollWidth<=pages[5].clientWidth+1);
      nextBtn.click(); await wait(1200); check('six to seventh laboratory',current===6 && !busy);
      prevBtn.click(); await wait(1600);
      check('return from seventh resets entry',current===5 && !busy && document.querySelector('.language-glyphs').textContent==='鮮');
      prevBtn.click(); check('back to map',current===4);
      nextBtn.click(); await wait(1600);
      check('return from fifth',current===5 && !busy);
      document.querySelector('[data-language="zh"]').focus();
      check('buttons keyboard focusable',document.activeElement.dataset.language==='zh');
    }catch(e){check(e.stack,false);}
    clearInterval(ticker);
    const p=document.createElement('pre');p.id='language-results';p.textContent=JSON.stringify(results);document.body.append(p);
  }
  run();
})();
</script>'''
class Parser(HTMLParser):
    active=False
    text=''
    def handle_starttag(self,tag,attrs):
        if dict(attrs).get('id')=='language-results':self.active=True
    def handle_endtag(self,tag):
        if tag=='pre':self.active=False
    def handle_data(self,data):
        if self.active:self.text+=data
try:
    html=(root/'xian_v4_fixed.html').read_text(encoding='utf-8')
    temporary.write_text(html.replace('</body>',test+'</body>'),encoding='utf-8')
    for size in ['1366,900','390,844']:
        output=subprocess.run([edge,'--headless','--disable-gpu','--no-first-run','--disable-extensions',
            '--user-data-dir='+str(root/'.edge-language-test'),'--window-size='+size,
            '--virtual-time-budget=16000','--dump-dom',temporary.as_uri()+'?debug=1&page=6'],
            capture_output=True,timeout=60,creationflags=subprocess.CREATE_NO_WINDOW)
        parser=Parser();parser.feed(output.stdout.decode('utf-8',errors='replace'))
        assert parser.text,'No browser result for '+size
        results=json.loads(parser.text)
        for item in results: print(size, 'PASS' if item['pass'] else 'FAIL',item['name'],flush=True)
        assert all(item['pass'] for item in results)
finally:temporary.unlink(missing_ok=True)
