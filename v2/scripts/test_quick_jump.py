"""Smoke-test the simple debug page selector using headless Edge."""
from pathlib import Path
import json
import subprocess
from html.parser import HTMLParser

root = Path(__file__).resolve().parents[1]
test = root / 'quick-jump-test.html'
edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
script = '''<script>
setTimeout(() => {
  const params = new URLSearchParams(location.search);
  const debug = params.get('debug') === '1';
  const target = debug ? Number(params.get('page') || 1)-1 : 0;
  const result = {target:target+1, actual:current+1,
    passed:current===target && !document.getElementById('simpleDebugTransit') &&
      Boolean(document.getElementById('simpleDebug'))===debug &&
      gsap.globalTimeline.timeScale()===1};
  const output=document.createElement('pre');output.id='quick-result';
  output.textContent=JSON.stringify(result);document.body.append(output);
},5000);
</script>'''

class Parser(HTMLParser):
    active = False
    value = ''
    def handle_starttag(self, tag, attrs):
        if dict(attrs).get('id') == 'quick-result': self.active = True
    def handle_endtag(self, tag):
        if tag == 'pre': self.active = False
    def handle_data(self, data):
        if self.active: self.value += data

try:
    html=(root/'xian_v4_fixed.html').read_text(encoding='utf-8')
    test.write_text(html.replace('</body>',script+'</body>'),encoding='utf-8')
    for query in ['?page=5','?debug=1&page=2','?debug=1&page=3','?debug=1&page=4','?debug=1&page=5']:
        r=subprocess.run([edge,'--headless','--disable-gpu','--no-first-run','--disable-extensions',
            '--user-data-dir='+str(root/'.edge-quick-test'),'--virtual-time-budget=6000',
            '--run-all-compositor-stages-before-draw','--dump-dom',test.as_uri()+query],
            capture_output=True,timeout=45,creationflags=subprocess.CREATE_NO_WINDOW)
        parser=Parser(); parser.feed(r.stdout.decode('utf-8',errors='replace'))
        assert parser.value, 'No browser result'
        result=json.loads(parser.value)
        print(json.dumps(result), flush=True)
        assert result['passed'],query
finally:
    test.unlink(missing_ok=True)
