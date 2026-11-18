"""Build an embedded, static Mercator map from Natural Earth 1:50m land.

Source: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_land.geojson
Natural Earth data is public domain. No invented or hand-drawn coastline.
Run from any directory: python scripts/build_voyage_map.py
"""
import hashlib
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'assets/ne_50m_land.geojson'
HTML = ROOT / 'xian_v4_fixed.html'
WEST, EAST, SOUTH, NORTH = 102, 149, 6, 49
WIDTH = 900
mercator_y = lambda lat: math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))
SCALE = WIDTH / math.radians(EAST - WEST)
HEIGHT = (mercator_y(NORTH) - mercator_y(SOUTH)) * SCALE


def project(lon, lat):
    return ((math.radians(lon - WEST)) * SCALE,
            (mercator_y(NORTH) - mercator_y(max(-89.9, min(89.9, lat)))) * SCALE)


def point(lon, lat):
    x, y = project(lon, lat)
    return f'{x:.2f},{y:.2f}'


def overlaps(ring):
    xs, ys = zip(*[(p[0], p[1]) for p in ring])
    return max(xs) >= WEST and min(xs) <= EAST and max(ys) >= SOUTH and min(ys) <= NORTH


data = json.loads(DATA.read_text(encoding='utf-8'))
paths = []
for feature in data['features']:
    geometry = feature['geometry']
    polygons = [geometry['coordinates']] if geometry['type'] == 'Polygon' else geometry['coordinates']
    for polygon in polygons:
        if not overlaps(polygon[0]):
            continue
        # Keep every source vertex; clip in SVG so no invented coastline is drawn.
        path = ''.join('M' + 'L'.join(point(*p[:2]) for p in ring) + 'Z' for ring in polygon)
        paths.append(f'<path d="{path}"/>')

grid = []
for lon in range(105, 150, 10):
    grid.append(f'<path d="M{point(lon,SOUTH)}L{point(lon,NORTH)}"/>')
for lat in range(10, 50, 10):
    grid.append(f'<path d="M{point(WEST,lat)}L{point(EAST,lat)}"/>')

labels = []
for name, lon, lat in [('中国',112,35), ('朝鲜半岛',127.6,38.3), ('日本',139.2,37.8),
                       ('越南',106.5,17.5), ('台湾岛',121,23.7), ('南海',116.5,15),
                       ('东海',125.5,28), ('日本海',135,41)]:
    x, y = project(lon, lat)
    labels.append(f'<text x="{x:.2f}" y="{y:.2f}">{name}</text>')

# Approximate city locations (longitude, latitude), not historical harbour sites.
# Ningbo/Hanoi: UNGEGN city gazetteer; Nagasaki: PSMSL station 1100;
# Busan: approximate city centre. All geometry uses project(), including controls.
cities = [
    ('ningbo', '中国·宁波', 121.55, 29.88, -16, 29, 'end'),
    ('nagasaki', '日本·长崎', 129.8661, 32.735, 16, 28, 'start'),
    ('busan', '韩国·釜山', 129.04, 35.10, -16, -18, 'end'),
    ('hanoi', '越南·河内', 105.80194, 21.00975, 16, -18, 'start'),
]
origin = project(cities[0][2], cities[0][3])
routes, anchors = [], []
controls = {'nagasaki': (126, 27.5), 'busan': (124, 35.5), 'hanoi': (116, 18)}
for key, name, lon, lat, dx, dy, anchor in cities:
    x, y = project(lon, lat)
    anchors.append(f'''<g class="voyage-anchor" data-city="{key}" role="button" tabindex="0" aria-pressed="false" aria-label="查看{name}">
      <title>{name} · 城市位置示意</title><circle class="anchor-hit" cx="{x:.2f}" cy="{y:.2f}" r="25"/>
      <circle class="anchor-ring" cx="{x:.2f}" cy="{y:.2f}" r="12"/>
      <circle class="anchor-core" cx="{x:.2f}" cy="{y:.2f}" r="5"/>
      <text x="{x+dx:.2f}" y="{y+dy:.2f}" text-anchor="{anchor}">{name}</text></g>''')
    if key == 'ningbo':
        continue
    cx, cy = project(*controls[key])
    d = f'M{origin[0]:.2f},{origin[1]:.2f}Q{cx:.2f},{cy:.2f} {x:.2f},{y:.2f}'
    routes.append(f'''<g class="voyage-route" data-city="{key}" role="button" tabindex="0" aria-pressed="false" aria-label="宁波至{name}文化交流示意，非已证实历史航线">
      <title>宁波至{name} · 文化交流示意</title>
      <path class="route-hit" d="{d}"/>
      <path class="route-line" id="voyage-route-{key}" d="{d}"/>
      <circle class="route-dot" data-path="voyage-route-{key}" cx="{origin[0]:.2f}" cy="{origin[1]:.2f}" r="4"/>
    </g>''')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT:.2f}"
  role="group" aria-labelledby="voyageMapTitle voyageMapDesc" preserveAspectRatio="xMidYMid meet">
  <title id="voyageMapTitle">东亚与东南亚海岸地图</title>
  <desc id="voyageMapDesc">Natural Earth 1:50m 真实陆地数据，墨卡托投影。范围为东经102至149度、北纬6至49度，覆盖中国东部沿海、朝鲜半岛、日本和越南。灰绿色为陆地，深蓝色为海域。</desc>
  <metadata>Natural Earth v5.1.2 ne_50m_land; public domain; SHA256 {hashlib.sha256(DATA.read_bytes()).hexdigest()}; spherical Mercator; no coastline simplification.</metadata>
  <defs><clipPath id="voyageMapClip"><rect width="{WIDTH}" height="{HEIGHT:.2f}"/></clipPath></defs>
  <rect width="{WIDTH}" height="{HEIGHT:.2f}" fill="#092c43"/>
  <g clip-path="url(#voyageMapClip)">
    <g fill="none" stroke="#b8d5df" stroke-opacity=".10" stroke-width=".6">{''.join(grid)}</g>
    <g fill="#819b8b" fill-rule="evenodd" stroke="#c2d2bd" stroke-width=".65" stroke-linejoin="round">{''.join(paths)}</g>
    <g fill="#edf3e8" font-family="Noto Serif SC,Songti SC,serif" font-size="17" text-anchor="middle" paint-order="stroke" stroke="#173e43" stroke-width="3" stroke-linejoin="round">{''.join(labels)}</g>
    <g id="voyageRoutes">{''.join(routes)}</g>
    <g id="voyageAnchors">{''.join(anchors)}</g>
  </g>
</svg>'''
(ROOT / 'assets/voyage-map.svg').write_text(svg, encoding='utf-8')
html = HTML.read_text(encoding='utf-8')
before = re.findall(r'<section id="s[1-4]"[\s\S]*?</section>', html)
html, count = re.subn(r'<!-- VOYAGE_MAP_START -->[\s\S]*?<!-- VOYAGE_MAP_END -->',
                     '<!-- VOYAGE_MAP_START -->\n' + svg + '\n<!-- VOYAGE_MAP_END -->', html)
assert count == 1, 'Expected exactly one fifth-page map placeholder'
assert before == re.findall(r'<section id="s[1-4]"[\s\S]*?</section>', html)
HTML.write_text(html, encoding='utf-8')
print(f'Embedded {len(paths)} source polygons; SVG {len(svg.encode())} bytes; first four sections unchanged.')
