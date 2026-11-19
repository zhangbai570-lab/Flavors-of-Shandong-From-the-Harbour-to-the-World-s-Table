/* 用 CDP 驱动 Chrome 截图（真实时间渲染，过渡/动画都会正常跑完）
 * 用法：node tools/shot.mjs <url> <out.png> [width] [height] [waitMs]
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const url = process.argv[2];
const out = process.argv[3];
const W = Number(process.argv[4] || 1600);
const H = Number(process.argv[5] || 900);
const WAIT = Number(process.argv[6] || 2500);

const userDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-"));
const port = 9300 + Math.floor(Math.random() * 500);

const chrome = spawn(CHROME, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-extensions",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDir}`,
  `--window-size=${W},${H}`,
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getTarget() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch (e) { /* not ready */ }
    await sleep(200);
  }
  throw new Error("CDP not ready");
}

const wsUrl = await getTarget();
const ws = new WebSocket(wsUrl);
let id = 0;
const pending = new Map();

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const msgId = ++id;
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve, { once: true });
  ws.addEventListener("error", reject, { once: true });
});

ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const p = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
    else p.resolve(msg.result);
  }
});

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: W, height: H, deviceScaleFactor: 1, mobile: false,
});
const errors = [];
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.method === "Runtime.exceptionThrown") {
    errors.push(msg.params.exceptionDetails.text + " " + (msg.params.exceptionDetails.exception?.description || ""));
  }
  if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
    errors.push(msg.params.args.map((a) => a.value || a.description).join(" "));
  }
});

await send("Page.navigate", { url });
await sleep(WAIT);

const isJpg = /\.jpe?g$/i.test(out);
const shot = await send("Page.captureScreenshot", isJpg ? { format: "jpeg", quality: 90 } : { format: "png" });
fs.writeFileSync(out, Buffer.from(shot.data, "base64"));
const info = await send("Runtime.evaluate", {
  expression: "(function(){var d=document.getElementById('deck');return JSON.stringify({idx: window.HXDeck?window.HXDeck.index():-1, top: d?Math.round(d.scrollTop):-1, hash: location.hash, body: document.body.className});})()",
  returnByValue: true,
});
console.log("state:", info.result.value);
if (errors.length) console.log("JS-ERRORS:\n" + errors.join("\n"));

ws.close();
chrome.kill();
process.exit(0);
