"""End-to-end final-page checks, including real reload/map/restart navigation."""
from pathlib import Path
from html.parser import HTMLParser
import subprocess,json
root=Path(__file__).resolve().parents[1]
temp=root/'ending-test.html'
edge=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
test=r'''<script>
(() => {
  const key='xian-ending-test';
  const state=JSON.parse(sessionStorage.getItem(key)||'null')||{stage:'ending',checks:[]};
  const check=(name,pass)=>state.checks.push({name,pass:Boolean(pass)});
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const ticker=setInterval(()=>gsap.ticker.tick(),16);
  function done(){clearInterval(ticker);sessionStorage.removeItem(key);const p=document.createElement('pre');p.id='ending-results';p.textContent=JSON.stringify(state.checks);document.body.append(p);}
  async function until(predicate){let n=0;while(!predicate()&&n++<350)await wait(80);}
  async function run(){try{
    if(state.stage==='ending'){
      await until(()=>current===7&&!document.getElementById('simpleDebugTransit'));
      check('debug arrives at eighth',current===7);
      check('eight timelines and sections',timelines.length===8&&pages.length===8);
      check('buttons hidden until completion',document.querySelector('.ending-actions').inert||!busy);
      await until(()=>!busy);
      check('ends at stable character',getComputedStyle(document.querySelector('.ending-character')).visibility==='visible');
      check('words fade after convergence',[...document.querySelectorAll('.ending-word')].every(w=>Number(getComputedStyle(w).opacity)<.01));
      check('all eight language terms',document.querySelectorAll('.ending-word').length===8);
      check('distinguishes word categories',document.querySelectorAll('.ending-word[data-kind="food"]').length===3&&document.querySelector('.ending-legend').textContent.includes('并非完全等义'));
      check('actions available',!document.querySelector('.ending-actions').inert);
      check('final prose complete',document.querySelector('.ending-copy').textContent.includes('也记得鲜从何而来'));
      check('no horizontal overflow',pages[7].scrollWidth<=pages[7].clientWidth+1);
      document.querySelector('[data-ending="sources"]').click();
      check('source dialog functional',document.querySelector('.ending-sources').open&&document.querySelectorAll('.ending-source-list a').length>=4);
      document.querySelector('.ending-close').click();
      check('source dialog closes',!document.querySelector('.ending-sources').open);
      prevBtn.click();await wait(1200);
      check('back to lab',current===6&&!busy);
      nextBtn.click();await until(()=>current===7);
      check('lab-to-ocean transition',current===7);
      tl8.pause().progress(1,false);
      check('repeat ending clears state',!busy&&!document.querySelector('.ending-actions').inert);
      check('no lab opacity residue',document.querySelector('#s7 .lab-content').style.opacity==='');
      // Exercise the normal presentation path too: no debug UI on return to map.
      const normalURL=new URL(location.href);normalURL.search='';history.replaceState(null,'',normalURL);
      state.stage='map';sessionStorage.setItem(key,JSON.stringify(state));
      document.querySelector('[data-ending="map"]').click();
    }else if(state.stage==='map'){
      await until(()=>current===4&&!document.getElementById('simpleDebugTransit'));
      check('real map button navigation',current===4&&!busy&&!document.getElementById('simpleDebug'));
      state.stage='restart';sessionStorage.setItem(key,JSON.stringify(state));
      endingPage.restart();
    }else{
      check('real restart returns clean first page',current===0&&!busy&&!location.search&&!document.getElementById('simpleDebug'));
      check('restart resets lab selection',[...document.querySelectorAll('.lab-card')].every(c=>c.getAttribute('aria-pressed')==='false'));
      done();
    }
  }catch(e){check(e.stack,false);done();}}
  run();
})();
</script>'''
class Parser(HTMLParser):
    active=False
    text=''
    def handle_starttag(self,tag,attrs):
        if dict(attrs).get('id')=='ending-results':self.active=True
    def handle_endtag(self,tag):
        if tag=='pre':self.active=False
    def handle_data(self,data):
        if self.active:self.text+=data
try:
    h=(root/'xian_v4_fixed.html').read_text(encoding='utf-8')
    temp.write_text(h.replace('</body>',test+'</body>'),encoding='utf-8')
    for size,extra in [('1366,900',[]),('390,844',[]),('1366,900',['--force-prefers-reduced-motion'])]:
        output=subprocess.run([edge,'--headless','--disable-gpu','--no-first-run','--disable-extensions',
            '--user-data-dir='+str(root/'.edge-ending-test'),'--window-size='+size,
            '--virtual-time-budget=45000','--dump-dom',*extra,temp.as_uri()+'?debug=1&page=8'],
            capture_output=True,timeout=75,creationflags=subprocess.CREATE_NO_WINDOW)
        p=Parser();p.feed(output.stdout.decode('utf-8',errors='replace'))
        assert p.text,'No final test result for '+size
        checks=json.loads(p.text);failures=[c for c in checks if not c['pass']]
        print(size,str(extra),len(checks),'checks; failures:',json.dumps(failures,ensure_ascii=False),flush=True)
        assert not failures
finally:temp.unlink(missing_ok=True)
