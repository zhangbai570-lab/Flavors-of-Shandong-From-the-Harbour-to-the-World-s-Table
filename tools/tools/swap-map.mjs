import fs from "node:fs";

const html = fs.readFileSync("index.html", "utf8");
const mapSvg = fs.readFileSync("tools/map-new.svg", "utf8");

const start = html.indexOf('<svg class="map"');
if (start < 0) { console.error("map start not found"); process.exit(1); }
const end = html.indexOf("</svg>", start);
if (end < 0) { console.error("map end not found"); process.exit(1); }

const before = html.slice(0, start);
const after = html.slice(end + "</svg>".length);
const out = before + mapSvg.trimEnd() + after;
fs.writeFileSync("index.html", out, "utf8");
console.log("map swapped. new length", out.length);
