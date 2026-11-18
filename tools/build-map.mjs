import fs from "node:fs";

/* 海岸线：山东半岛手绘轮廓（viewBox 760×620）
   北岸自西北的渤海湾向东北（黄河口→莱州湾→蓬莱→烟台→威海→荣成岬），
   南岸自荣成向西南（石岛湾→海阳→胶州湾→日照→苏鲁边界），西侧与西南为内陆。 */
const COAST = `M 148 196
  C 176 188 200 200 214 216
  C 222 226 229 213 237 224
  C 247 235 253 217 263 230
  C 278 245 292 262 308 278
  C 322 292 336 306 352 308
  C 366 309 374 294 386 282
  C 402 266 422 250 443 240
  C 459 232 477 226 495 220
  C 509 216 521 222 533 228
  C 549 234 563 240 579 248
  C 597 257 617 265 635 275
  C 649 283 665 288 679 294
  C 693 300 701 310 691 318
  C 681 326 665 329 651 334
  C 635 340 621 346 605 354
  C 590 361 574 360 566 366
  C 560 371 566 378 556 379
  C 538 381 521 388 508 394
  C 499 399 492 406 483 411
  C 474 417 465 426 458 436
  C 453 444 449 452 443 462
  C 435 474 421 486 403 496
  C 383 506 359 512 335 518
  C 307 524 281 530 255 538
  C 227 546 197 556 169 570
  C 143 582 97 598 41 610`;

const LAND = COAST + ` L 0 616 L 0 140 L 110 172 Z`;

const mapSvg = `<svg class="map" viewBox="0 0 760 620" role="img" aria-label="山东半岛手绘示意图">
              <defs>
                <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#0a2233" opacity=".16"/>
                </pattern>
                <pattern id="seaGrid" width="46" height="46" patternUnits="userSpaceOnUse">
                  <path d="M46 0 H0 V46" fill="none" stroke="#0a2233" stroke-width=".5" opacity=".07"/>
                </pattern>
                <pattern id="coastHatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                  <line x1="0" y1="0" x2="0" y2="7" stroke="#0a2233" stroke-width=".8" stroke-opacity=".3"/>
                </pattern>
                <pattern id="seaWave" width="34" height="18" patternUnits="userSpaceOnUse">
                  <path d="M2 9 q 5 -4 10 0" fill="none" stroke="#1e6f7a" stroke-width=".9" stroke-opacity=".22"/>
                  <path d="M18 15 q 4 -3 8 0" fill="none" stroke="#1e6f7a" stroke-width=".9" stroke-opacity=".14"/>
                </pattern>
                <linearGradient id="landFill" x1="0" y1="0" x2=".2" y2="1">
                  <stop offset="0%" stop-color="#f2e9d8"/>
                  <stop offset="55%" stop-color="#eaddc7"/>
                  <stop offset="100%" stop-color="#ddcdb1"/>
                </linearGradient>
                <linearGradient id="seaFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#e9f3f1"/>
                  <stop offset="60%" stop-color="#dbeae8"/>
                  <stop offset="100%" stop-color="#cde2e0"/>
                </linearGradient>
                <linearGradient id="fadeWest" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stop-color="#e6f0ee" stop-opacity=".95"/>
                  <stop offset=".55" stop-color="#e6f0ee" stop-opacity=".62"/>
                  <stop offset="1" stop-color="#e6f0ee" stop-opacity="0"/>
                </linearGradient>
                <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="7" stdDeviation="9" flood-color="#0a2233" flood-opacity=".16"/>
                </filter>
              </defs>

              <!-- 海 -->
              <rect width="760" height="620" fill="url(#seaFill)"/>
              <rect width="760" height="620" fill="url(#seaGrid)"/>
              <rect width="760" height="620" fill="url(#seaWave)"/>

              <!-- 海流 -->
              <g class="sea-currents" fill="none" stroke="#1e6f7a" stroke-width="1.1" stroke-opacity=".24">
                <path d="M340 110 C 430 130 516 108 606 142 C 668 166 704 196 722 230"/>
                <path d="M392 146 C 476 166 556 152 632 182"/>
                <path d="M486 468 C 552 492 616 496 682 522"/>
                <path d="M64 512 C 142 544 210 532 288 558"/>
              </g>

              <!-- 海域名 -->
              <text x="238" y="128" class="sea-label">渤 海</text>
              <text x="644" y="540" class="sea-label">黄 海</text>
              <text x="452" y="418" class="sea-small" text-anchor="end">胶州湾</text>
              <text x="392" y="296" class="sea-small">莱州湾</text>
              <text x="498" y="162" class="sea-small">长 山 列 岛</text>
              <text x="714" y="60" class="map-title" text-anchor="end">山东半岛</text>
              <text x="714" y="76" class="map-title-en" text-anchor="end">SHANDONG PENINSULA</text>

              <!-- 黄海上的一只小帆船 -->
              <g transform="translate(596 476) scale(.62)" opacity=".5">
                <path d="M0 -34 V6" stroke="#1e6f7a" stroke-opacity=".6" stroke-width="1.6"/>
                <path d="M3 -30 C 20 -20 24 -8 24 4 L 24 8 C 16 6 10 5 3 5 Z" fill="#1e6f7a" fill-opacity=".22" stroke="#1e6f7a" stroke-opacity=".45"/>
                <path d="M-3 -26 C -16 -16 -20 -6 -20 4 L -20 8 C -14 6 -10 5 -3 5 Z" fill="#1e6f7a" fill-opacity=".16" stroke="#1e6f7a" stroke-opacity=".35"/>
                <path d="M-24 8 C -13 19 13 19 24 8 C 20 20 10 24 0 24 C -10 24 -20 20 -24 8 Z" fill="#1e6f7a" fill-opacity=".3" stroke="#1e6f7a" stroke-opacity=".5"/>
              </g>

              <!-- 庙岛群岛 -->
              <g fill="#8fb9b6" opacity=".8" stroke="#0a2233" stroke-opacity=".22" stroke-width=".6">
                <ellipse cx="470" cy="198" rx="4.6" ry="2.6"/>
                <ellipse cx="482" cy="189" rx="3.4" ry="2"/>
                <ellipse cx="492" cy="182" rx="2.4" ry="1.5"/>
                <ellipse cx="501" cy="176" rx="1.7" ry="1.1"/>
              </g>
              <!-- 石岛外的小岛 -->
              <g fill="#8fb9b6" opacity=".7" stroke="#0a2233" stroke-opacity=".2" stroke-width=".5">
                <ellipse cx="706" cy="342" rx="3.2" ry="2"/>
                <ellipse cx="713" cy="352" rx="2" ry="1.3"/>
                <ellipse cx="508" cy="432" rx="3.6" ry="2.2"/>
              </g>

              <!-- 陆地 -->
              <path class="land" filter="url(#softShadow)" d="${LAND}" fill="url(#landFill)"/>
              <path class="land-dots" d="${LAND}" fill="url(#dots)"/>

              <!-- 海岸晕染：排纹 + 双线 -->
              <path class="land-coast-wash" d="${COAST}"
                fill="none" stroke="url(#coastHatch)" stroke-width="14" stroke-opacity=".6"/>
              <path class="land-coast" d="${COAST}"
                fill="none" stroke="#0a2233" stroke-width="1.8" stroke-opacity=".7"/>
              <path class="land-coast2" d="${COAST}"
                fill="none" stroke="#0a2233" stroke-width=".6" stroke-opacity=".28" transform="translate(1.6,2.4)"/>

              <!-- 胶州湾：内湾细线 -->
              <g fill="none" stroke="#0a2233" stroke-opacity=".26" stroke-width=".9">
                <path d="M508 394 C 497 400 489 406 481 411 C 472 417 464 425 458 434"/>
                <path d="M501 401 C 494 407 487 411 480 416"/>
              </g>

              <!-- 西侧内陆淡出，视线收向海岸 -->
              <rect x="0" y="0" width="230" height="620" fill="url(#fadeWest)"/>

              <!-- 黄河与三角洲 -->
              <path d="M0 292 C 52 282 96 262 136 244 C 172 228 204 226 236 224"
                fill="none" stroke="#1e6f7a" stroke-width="1.8" stroke-opacity=".55"/>
              <path d="M236 224 c 7 5 12 1 14 7 M232 219 c 5 5 9 1 11 7 M240 229 c 4 4 7 2 9 7"
                fill="none" stroke="#1e6f7a" stroke-width="1" stroke-opacity=".45"/>
              <text x="150" y="266" class="river-label">黄 河</text>

              <!-- 山脊 -->
              <path class="land-ridge" d="M96 402 C 158 368 214 352 272 348 C 318 346 350 356 384 368"
                fill="none" stroke="#0a2233" stroke-width=".8" stroke-dasharray="1 6" opacity=".2"/>
              <path class="land-ridge" d="M94 432 C 148 410 196 402 246 404 C 286 406 318 418 344 430"
                fill="none" stroke="#0a2233" stroke-width=".8" stroke-dasharray="1 6" opacity=".14"/>
              <text x="272" y="396" class="land-label">山 东</text>
              <text x="132" y="482" class="land-small">沂 蒙</text>

              <!-- 航线 -->
              <path id="seaRoute" class="route" d="M533 226
                C 592 186 666 212 684 272
                C 696 318 644 356 586 372
                C 546 383 514 392 492 402
                C 474 412 458 434 448 446"
                fill="none" stroke="#b8452f" stroke-width="1.5" stroke-dasharray="7 9" stroke-opacity=".7"/>

              <!-- 罗盘 -->
              <g class="map-compass" transform="translate(86,88)" fill="none" stroke="#0a2233" stroke-width="1">
                <circle r="30" opacity=".4"/>
                <circle r="20" opacity=".22"/>
                <path d="M0 -30 V-42 M0 30 V42 M-30 0 H-42 M30 0 H42" opacity=".4"/>
                <path d="M0 -18 L6 6 L0 2 L-6 6 Z" fill="#b8452f" stroke="none"/>
                <g stroke="none" fill="#b8452f" opacity=".3">
                  <circle cx="21" cy="21" r="1.6"/><circle cx="-21" cy="21" r="1.6"/>
                </g>
                <text x="0" y="-48" text-anchor="middle" font-size="11" fill="#0a2233" stroke="none" letter-spacing="2">N</text>
              </g>

              <!-- 港口由 JS 渲染 -->
              <g id="portLayer"></g>
            </svg>`;

fs.writeFileSync("tools/map-new.svg", mapSvg, "utf8");
console.log("map-new.svg written", mapSvg.length);
