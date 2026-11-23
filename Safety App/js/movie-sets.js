/* ==========================================================================
   Safety Superheroes — Hero Movies: SETS (recurring locations)
   Hand-drawn storybook places in bright fairytale colors. Each set is a
   stack of parallax layers (the movie camera pans them at different
   speeds for depth):  sky (fixed) · far · hills · world · fore.
   Coordinates: the view is 1600x900; the world layer is set.width wide.
   Reuse a set in any episode; add new sets at the bottom.
   ========================================================================== */

const MS_INK = '#2b2b2b';
const msS = (w) => `stroke="${MS_INK}" stroke-width="${w || 4}" stroke-linejoin="round" stroke-linecap="round"`;
function msRng(seed){ return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// ---------- reusable scenery pieces ----------
function msCloud(x, y, s){
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-80 20 q-30 0 -30 -24 q0 -26 30 -26 q6 -34 46 -34 q30 0 42 22 q14 -14 36 -10 q30 6 30 34 q26 4 26 22 q0 16 -24 16 z" fill="#fff" ${msS(4)}/><path d="M-70 8 q40 10 100 0" stroke="#dbeaff" stroke-width="8" fill="none" stroke-linecap="round"/></g>`;
}
function msTree(x, y, s, kind, r){
  const leaf = kind === 'blossom' ? ['#ffb3d1', '#ff8fbd'] : kind === 'apple' ? ['#5cc85a', '#43a947'] : ['#7bd36b', '#56b84c'];
  let t = `<g transform="translate(${x} ${y}) scale(${s})">`
    + `<path d="M-14 0 q4 -60 2 -110 h24 q-2 50 2 110 z" fill="#9a6337" ${msS(4)}/>`
    + `<path d="M-2 -70 q-20 -10 -30 -30 M8 -86 q18 -6 26 -24" stroke="#9a6337" stroke-width="9" fill="none" stroke-linecap="round"/>`
    + `<path d="M-2 -70 q-20 -10 -30 -30 M8 -86 q18 -6 26 -24" ${msS(3)} fill="none" opacity=".0"/>`
    + `<path d="M-86 -140 q-20 -60 34 -80 q14 -50 66 -40 q50 -14 70 34 q50 16 34 66 q10 46 -40 52 q-30 30 -70 8 q-40 20 -70 -10 q-40 -6 -24 -30 z" fill="${leaf[0]}" ${msS(4.5)}/>`
    + `<path d="M-60 -150 q30 -50 80 -40" stroke="#fff" stroke-width="7" opacity=".35" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 9; i++){
    const px = -60 + r() * 120, py = -200 + r() * 90;
    t += kind === 'apple' ? `<circle cx="${px}" cy="${py}" r="8" fill="#ff4d4d" ${msS(2.5)}/>` : `<circle cx="${px}" cy="${py}" r="${6 + r() * 8}" fill="${leaf[1]}" opacity=".85"/>`;
  }
  return t + `</g>`;
}
function msFlower(x, y, color, s){
  s = s || 1;
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 v-22" stroke="#3f9b3a" stroke-width="4"/><path d="M0 -10 q-12 -6 -14 2 q8 4 14 -2" fill="#5cc85a"/>`
    + [0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-30" rx="5.5" ry="8" fill="${color}" ${msS(2)} transform="rotate(${a} 0 -22)"/>`).join('')
    + `<circle cx="0" cy="-22" r="5" fill="#ffd23f" ${msS(2)}/></g>`;
}
function msTulip(x, y, color){
  return `<g transform="translate(${x} ${y})"><path d="M0 0 v-26" stroke="#3f9b3a" stroke-width="4"/><path d="M-9 -26 q-2 -18 4 -20 l5 8 l5 -8 q6 2 4 20 q-9 6 -18 0 z" fill="${color}" ${msS(2.5)}/></g>`;
}
function msMushroom(x, y, s){
  return `<g transform="translate(${x} ${y}) scale(${s || 1})"><path d="M-8 0 q-2 -14 0 -22 h16 q2 8 0 22 z" fill="#fff6e6" ${msS(3)}/><path d="M-26 -20 q0 -26 26 -26 q26 0 26 26 z" fill="#ff4d4d" ${msS(3.5)}/><circle cx="-10" cy="-30" r="4" fill="#fff"/><circle cx="8" cy="-36" r="5" fill="#fff"/><circle cx="14" cy="-24" r="3" fill="#fff"/></g>`;
}
function msButterfly(x, y, c, cls){
  return `<g transform="translate(${x} ${y})"><g class="${cls || 'mv-flutter'}"><g class="mv-wings"><path d="M0 0 q-22 -24 -26 -4 q2 16 26 4 z M0 0 q22 -24 26 -4 q-2 16 -26 4 z" fill="${c}" ${msS(2.5)}/></g><path d="M0 -8 v14" ${msS(3)}/></g></g>`;
}
function msGrassTuft(x, y, s, c){
  return `<path d="M${x - 14 * s} ${y} q${4 * s} ${-26 * s} ${8 * s} ${-30 * s} q${0} ${18 * s} ${4 * s} ${26 * s} q${4 * s} ${-24 * s} ${12 * s} ${-34 * s} q${-2 * s} ${20 * s} ${2 * s} ${34 * s} q${6 * s} ${-16 * s} ${14 * s} ${-22 * s} q${-4 * s} ${12 * s} ${-2 * s} ${26 * s} z" fill="${c || '#4fae46'}" ${msS(2.5)}/>`;
}

/* ==========================================================================
   SET: Sunny Meadow Park (playground, duck pond, pool with a lifeguard)
   ========================================================================== */
function msParkSet(){
  const W = 3200, r = msRng(42);
  // ---- sky (fixed; x from -800 to 800) ----
  let sky = `<defs>
    <linearGradient id="msSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb8ff"/><stop offset=".55" stop-color="#a9dcff"/><stop offset="1" stop-color="#fff1cf"/></linearGradient>
    <radialGradient id="msSunGlow"><stop offset="0" stop-color="#fff6a8"/><stop offset=".6" stop-color="#ffe066" stop-opacity=".5"/><stop offset="1" stop-color="#ffe066" stop-opacity="0"/></radialGradient>
    <linearGradient id="msWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fd3ff"/><stop offset="1" stop-color="#2f9fe0"/></linearGradient>
    <linearGradient id="msPool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ff0ff"/><stop offset="1" stop-color="#21b5e6"/></linearGradient>
    <linearGradient id="msGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fdc5e"/><stop offset="1" stop-color="#5cbf45"/></linearGradient>
  </defs>`
    + `<rect x="-900" y="-100" width="1800" height="1100" fill="url(#msSky)"/>`
    + `<g transform="translate(-560 150)"><circle r="150" fill="url(#msSunGlow)"/><g class="mv-spin">`
    + Array.from({ length: 12 }, (_, i) => `<path d="M0 -84 l10 -34 l-20 0 z" fill="#ffd23f" ${msS(3)} transform="rotate(${i * 30})"/>`).join('')
    + `</g><circle r="66" fill="#ffd93b" ${msS(5)}/><circle cx="-22" cy="-10" r="7" fill="${MS_INK}"/><circle cx="22" cy="-10" r="7" fill="${MS_INK}"/><path d="M-26 14 q26 24 52 0" fill="none" ${msS(5)}/><circle cx="-38" cy="10" r="9" fill="#ff9f6b" opacity=".7"/><circle cx="38" cy="10" r="9" fill="#ff9f6b" opacity=".7"/></g>`
    + `<g class="mv-drift">${msCloud(-250, 110, 0.9)}${msCloud(330, 70, 0.7)}${msCloud(620, 170, 0.55)}</g>`
    + `<g class="mv-drift mv-drift--slow">${msCloud(80, 200, 0.45)}${msCloud(-700, 260, 0.4)}</g>`
    + `<g class="mv-birds"><path d="M120 120 q10 -10 20 0 q10 -10 20 0" fill="none" ${msS(3)}/><path d="M170 96 q8 -8 16 0 q8 -8 16 0" fill="none" ${msS(3)}/></g>`;
  // ---- far: rainbow, lavender mountains, a fairytale castle (x -820..1300) ----
  let far = `<g opacity=".9">` + ['#ff6b6b', '#ffa94d', '#ffe066', '#69db7c', '#4dabf7', '#9775fa'].map((c, i) =>
      `<path d="M-520 600 A${640 - i * 22} ${520 - i * 22} 0 0 1 ${760 - i * 44} 600" fill="none" stroke="${c}" stroke-width="22" opacity=".75"/>`).join('') + `</g>`
    + `<path d="M-900 560 L-620 330 L-470 450 L-260 280 L-40 470 L180 310 L420 480 L640 300 L900 470 L1120 340 L1400 560 Z" fill="#b9b3f5" ${msS(4)}/>`
    + `<path d="M-620 330 l-50 44 l30 -6 l20 22 l26 -26 l24 8 z M-260 280 l-56 52 l34 -4 l22 18 l26 -28 l30 4 z M640 300 l-50 48 l30 -4 l22 20 l28 -28 l24 6 z" fill="#fff"/>`
    + `<path d="M-900 600 q300 -110 600 -40 q300 -90 640 0 q300 -80 560 -10 q240 -60 500 10 V700 H-900 Z" fill="#9fd98a" ${msS(4)}/>`
    // castle on the hill
    + `<g transform="translate(260 520)">`
    + `<rect x="-90" y="-120" width="180" height="120" fill="#ffc7e0" ${msS(4)}/>`
    + [-90, -30, 30].map(x => `<rect x="${x}" y="-136" width="20" height="18" fill="#ffc7e0" ${msS(3)}/>`).join('')
    + [[-110, -190, 40], [70, -190, 40], [-20, -250, 46]].map(([x, y, w]) =>
        `<rect x="${x}" y="${y}" width="${w}" height="${-y}" fill="#ffd6ea" ${msS(4)}/><path d="M${x - 8} ${y} L${x + w / 2} ${y - 70} L${x + w + 8} ${y} Z" fill="#9b6cff" ${msS(4)}/><path d="M${x + w / 2} ${y - 70} v-30" ${msS(3)}/><path class="mv-flag" d="M${x + w / 2} ${y - 100} l28 8 l-28 10 z" fill="#ffd23f" ${msS(2.5)}/><rect x="${x + w / 2 - 7}" y="${y + 30}" width="14" height="20" rx="7" fill="#7a4fc9" ${msS(2.5)}/>`).join('')
    + `<path d="M-22 0 v-44 q22 -26 44 0 v44 z" fill="#9a6337" ${msS(4)}/></g>`;
  // ---- hills: rolling patchwork fields + a windmill (x -620..1900) ----
  let hills = `<path d="M-700 640 q260 -120 520 -30 q280 -110 560 -10 q300 -100 620 0 q260 -70 600 20 V760 H-700 Z" fill="#7fce5c" ${msS(4)}/>`;
  for (let i = 0; i < 14; i++){
    const x = -600 + i * 180 + r() * 40, y = 610 + r() * 40;
    hills += `<path d="M${x} ${y} l70 -18 l60 14 l-70 20 z" fill="${['#b6e36a', '#ffe58a', '#a3d977', '#c8ef8a'][i % 4]}" opacity=".9"/>`;
  }
  for (let i = 0; i < 16; i++){
    const x = -640 + i * 160 + r() * 60, y = 600 + r() * 30;
    hills += `<g transform="translate(${x} ${y}) scale(.35)"><path d="M-6 0 v-40 h12 v40 z" fill="#9a6337"/><circle cx="0" cy="-60" r="34" fill="${r() > .5 ? '#56b84c' : '#4aa83f'}" ${msS(5)}/></g>`;
  }
  hills += `<g transform="translate(1180 600)"><path d="M-30 0 l10 -120 h40 l10 120 z" fill="#fff4e0" ${msS(4)}/><path d="M-26 -120 l26 -34 l26 34 z" fill="#ff7b7b" ${msS(4)}/><rect x="-8" y="-30" width="16" height="30" rx="8" fill="#9a6337" ${msS(3)}/>`
    + `<g transform="translate(0 -118)"><g class="mv-spin mv-spin--slow">` + [0, 90, 180, 270].map(a => `<g transform="rotate(${a})"><rect x="-6" y="-92" width="12" height="86" fill="#c98a4b" ${msS(3)}/><rect x="6" y="-90" width="26" height="70" fill="#fff" ${msS(3)}/></g>`).join('') + `<circle r="8" fill="#ffd23f" ${msS(3)}/></g></g></g>`;
  // ---- world (x 0..3200) ----
  let world = `<rect x="-400" y="560" width="${W + 800}" height="400" fill="url(#msGround)"/>`;
  // back tree line + hedges
  for (let i = 0; i < 22; i++){
    const x = -300 + i * 170 + r() * 60;
    if (x > 1580 && x < 2120) continue; // keep the pond open
    world += msTree(x, 600 + r() * 20, 0.62 + r() * 0.2, ['round', 'blossom', 'apple'][i % 3], r);
  }
  world += `<path d="M-400 640 q100 -30 200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 v40 h-${W + 800} z" fill="#4cae44" ${msS(4)}/>`;
  for (let i = 0; i < 60; i++) world += `<circle cx="${-380 + i * 66 + r() * 30}" cy="${640 + r() * 26}" r="${5 + r() * 4}" fill="${['#ff8fbd', '#fff', '#ffd23f', '#b197fc'][i % 4]}" ${msS(1.5)}/>`;
  // the parking pad + car (far left)
  world += `<path d="M-400 690 H640 Q680 690 690 720 L700 860 H-400 Z" fill="#a7adb7" ${msS(4)}/>`
    + [60, 260, 460].map(x => `<rect x="${x}" y="700" width="10" height="150" fill="#f4f1e6"/>`).join('')
    + `<g transform="translate(330 800)">${typeof mcCar === 'function' ? mcCar('#8ec5ff') : ''}</g>`;
  // the winding sandy path
  world += `<path d="M640 740 C900 720 1100 780 1400 760 C1700 740 1900 790 2200 770 C2500 750 2800 780 ${W + 400} 760 L${W + 400} 830 C2800 850 2500 820 2200 840 C1900 860 1700 810 1400 830 C1100 850 900 790 640 820 Z" fill="#f5dc9b" ${msS(4)}/>`;
  for (let i = 0; i < 70; i++) world += `<ellipse cx="${660 + i * 40 + r() * 20}" cy="${775 + r() * 45}" rx="${3 + r() * 4}" ry="${2 + r() * 2}" fill="#d9b874"/>`;
  // park sign
  world += `<g transform="translate(760 720)"><rect x="-6" y="-90" width="12" height="90" fill="#9a6337" ${msS(3.5)}/><rect x="-96" y="-150" width="192" height="64" rx="16" fill="#ffe7a3" ${msS(4)}/><text x="0" y="-126" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="22" fill="#b4541b">Sunny Meadow</text><text x="0" y="-100" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="22" fill="#b4541b">Park</text>${msFlower(-70, -150, '#ff6fa8', 0.8)}${msFlower(74, -150, '#9775fa', 0.8)}</g>`;
  // castle-tower slide
  world += `<g transform="translate(990 735)">`
    + `<rect x="-60" y="-250" width="120" height="250" fill="#b197fc" ${msS(5)}/>`
    + Array.from({ length: 10 }, (_, i) => `<rect x="${-56 + (i % 3) * 40 + (Math.floor(i / 3) % 2) * 18}" y="${-230 + Math.floor(i / 3) * 56}" width="30" height="16" rx="4" fill="#9775fa"/>`).join('')
    + [-60, -20, 20].map(x => `<rect x="${x}" y="-276" width="28" height="28" fill="#b197fc" ${msS(4)}/>`).join('')
    + `<path d="M-70 -276 L0 -380 L70 -276 Z" fill="#ff6fa8" ${msS(5)}/><path d="M0 -380 v-40" ${msS(4)}/><path class="mv-flag" d="M0 -420 l40 12 l-40 14 z" fill="#ffd23f" ${msS(3)}/>`
    + `<path d="M-22 -150 q22 -30 44 0 v40 h-44 z" fill="#5a3d8a" ${msS(4)}/><path d="M-30 0 v-60 q30 -40 60 0 v60 z" fill="#7a4fc9" ${msS(4)}/>`
    + `<path d="M60 -170 C150 -150 160 -60 230 -14 L250 0 L216 8 C140 -40 130 -120 60 -136 Z" fill="#ffd23f" ${msS(5)}/><path d="M70 -160 C140 -140 150 -70 216 -24" stroke="#fff" stroke-width="6" fill="none" opacity=".6" stroke-linecap="round"/>`
    + `</g>`;
  // swing set
  world += `<g transform="translate(1405 692) scale(.78)"><path d="M-90 0 L-60 -170 L-30 0 M30 0 L60 -170 L90 0" fill="none" stroke="#ff7a1a" stroke-width="12" stroke-linecap="round"/><path d="M-90 0 L-60 -170 L-30 0 M30 0 L60 -170 L90 0" fill="none" ${msS(3)} opacity=".0"/><rect x="-70" y="-178" width="140" height="14" rx="7" fill="#ff7a1a" ${msS(3.5)}/>`
    + `<g class="mv-swing"><path d="M-22 -164 v120 M2 -164 v120" ${msS(3)}/><rect x="-30" y="-48" width="40" height="10" rx="4" fill="#3d7be0" ${msS(3)}/></g>`
    + `<g class="mv-swing mv-swing--b"><path d="M30 -164 v110 M50 -164 v110" ${msS(3)}/><rect x="22" y="-58" width="36" height="10" rx="4" fill="#ff4f8b" ${msS(3)}/></g></g>`;
  // the big oak where Nutty lives (branch for the squirrel at ~1440,470)
  const props = `<g transform="translate(1500 700)"><path d="M-36 0 q10 -140 0 -300 h60 q-6 150 12 300 z" fill="#9a6337" ${msS(5)}/><path d="M-6 -200 q-60 -10 -110 -30" stroke="#9a6337" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M-6 -200 q-60 -10 -110 -30" ${msS(4)} fill="none" opacity=".0"/><ellipse cx="4" cy="-150" rx="12" ry="16" fill="#5a3a20"/>`
    + `<path d="M-200 -330 q-40 -110 60 -140 q30 -90 130 -70 q100 -30 140 60 q90 20 70 120 q30 80 -70 100 q-60 40 -130 10 q-80 30 -140 -20 q-90 -10 -60 -60 z" fill="#5cc85a" ${msS(5)}/>`
    + `<path d="M-150 -360 q60 -90 160 -80" stroke="#fff" stroke-width="10" opacity=".3" fill="none" stroke-linecap="round"/>`
    + Array.from({ length: 10 }, () => `<circle cx="${-150 + r() * 300}" cy="${-430 + r() * 150}" r="9" fill="#ff4d4d" ${msS(2.5)}/>`).join('') + `</g>`;
  // duck pond with lily pads and a little red bridge
  world += `<g transform="translate(1860 690)"><ellipse cx="0" cy="0" rx="250" ry="56" fill="url(#msWater)" ${msS(5)}/><path d="M-170 -12 q40 -10 80 0 M40 10 q50 -10 100 0" stroke="#fff" stroke-width="5" opacity=".6" fill="none" stroke-linecap="round"/>`
    + [[-130, 18], [-40, -20], [150, -8], [70, 26]].map(([x, y]) => `<path d="M${x} ${y} a22 10 0 1 1 1 0 l-1 -10 z" fill="#3fae4a" ${msS(2.5)}/>`).join('')
    + `<g class="mv-bob"><g transform="translate(-60 -6)"><ellipse cx="0" cy="0" rx="22" ry="13" fill="#ffd93b" ${msS(3)}/><circle cx="16" cy="-14" r="10" fill="#ffd93b" ${msS(3)}/><path d="M24 -14 l12 3 l-12 4 z" fill="#ff8a1a" ${msS(2)}/><circle cx="18" cy="-16" r="2.4" fill="${MS_INK}"/></g></g>`
    + `<g class="mv-bob mv-bob--b"><g transform="translate(30 4) scale(.7)"><ellipse cx="0" cy="0" rx="22" ry="13" fill="#ffd93b" ${msS(3)}/><circle cx="16" cy="-14" r="10" fill="#ffd93b" ${msS(3)}/><path d="M24 -14 l12 3 l-12 4 z" fill="#ff8a1a" ${msS(2)}/><circle cx="18" cy="-16" r="2.4" fill="${MS_INK}"/></g></g>`
    + `<g class="mv-bob mv-bob--c"><g transform="translate(80 -2) scale(.6)"><ellipse cx="0" cy="0" rx="22" ry="13" fill="#ffd93b" ${msS(3)}/><circle cx="16" cy="-14" r="10" fill="#ffd93b" ${msS(3)}/><path d="M24 -14 l12 3 l-12 4 z" fill="#ff8a1a" ${msS(2)}/><circle cx="18" cy="-16" r="2.4" fill="${MS_INK}"/></g></g>`
    + `<path d="M-250 0 q-10 -40 4 -70 M-236 4 q0 -50 16 -76 M230 4 q8 -46 -6 -72" stroke="#3f9b3a" stroke-width="5" fill="none"/><ellipse cx="-246" cy="-70" rx="5" ry="14" fill="#8a5a34"/><ellipse cx="-220" cy="-72" rx="5" ry="14" fill="#8a5a34"/><ellipse cx="224" cy="-68" rx="5" ry="14" fill="#8a5a34"/>`
    + `<path d="M120 20 q60 -80 120 0" fill="none" stroke="#e8453c" stroke-width="12"/><path d="M120 20 q60 -80 120 0" fill="none" ${msS(3)} opacity=".0"/>` + [130, 160, 190, 220].map(x => `<path d="M${x} ${x < 175 ? 16 - (x - 120) * 0.8 : -28 + (x - 180) * 0.8} v22" stroke="#e8453c" stroke-width="5"/>`).join('') + `</g>`;
  // the picnic spot: a big blossom tree for shade, gingham blanket, basket, lemonade, Dad's book
  world += msTree(2620, 640, 1.15, 'blossom', r);
  world += `<g transform="translate(2470 770)">`
    + `<path d="M-190 10 L-150 -46 L170 -46 L210 10 Z" fill="#ff6b6b" ${msS(4.5)}/>`
    + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${-170 + i * 46} 10 L${-136 + i * 40} -46 L${-116 + i * 40} -46 L${-148 + i * 46} 10 Z" fill="#fff" opacity=".85"/>`).join('')
    + [0, 1].map(i => `<path d="M${-182 + i * 4} ${-8 - i * 20} L${200 - i * 6} ${-8 - i * 20}" stroke="#fff" stroke-width="9" opacity=".7"/>`).join('')
    + `<g transform="translate(90 -40)"><path d="M-40 0 q-6 -46 6 -50 h68 q12 4 6 50 z" fill="#d9a05b" ${msS(4)}/>`
    + [0, 1, 2].map(i => `<path d="M-38 ${-14 - i * 12} h76" stroke="#b97f3d" stroke-width="4"/>`).join('')
    + `<path d="M-30 -50 q30 -40 60 0" fill="none" stroke="#b97f3d" stroke-width="7"/><path d="M-30 -50 q30 -40 60 0" fill="none" ${msS(3)} opacity=".0"/>`
    + `<path d="M-30 -52 q10 -12 22 -4 q10 -10 22 0 q8 -8 16 2 z" fill="#ff6b6b" ${msS(3)}/></g>`
    + `<g transform="translate(-60 -46)"><rect x="-14" y="-46" width="28" height="44" rx="8" fill="#fff8b0" opacity=".9" ${msS(3.5)}/><rect x="-14" y="-26" width="28" height="24" rx="6" fill="#ffd93b"/><rect x="-14" y="-46" width="28" height="44" rx="8" fill="none" ${msS(3.5)}/><circle cx="-4" cy="-18" r="4" fill="#fff6a0"/><path d="M14 -36 q12 4 0 18" fill="none" ${msS(3.5)}/></g>`
    + `<g transform="translate(10 -40)"><path d="M-18 -4 h36 l-4 10 h-28 z" fill="#fff" ${msS(3)}/><path d="M-14 -4 q4 -12 14 -10 q12 -2 14 10" fill="#ffd1a1" ${msS(3)}/><path d="M-13 -6 h26" stroke="#7bd36b" stroke-width="4"/></g>`
    + `</g>`;
  // kite stuck in the blossom tree (just for fun)
  world += `<g transform="translate(2740 450) rotate(18)"><path d="M0 -40 L28 0 L0 46 L-28 0 Z" fill="#4dabf7" ${msS(4)}/><path d="M0 -40 V46 M-28 0 H28" ${msS(3)}/><path d="M0 46 q-20 30 0 50 q20 20 0 50" fill="none" ${msS(3)}/><path class="mv-flag" d="M-6 70 l12 -6 v12 z" fill="#ff6fa8"/></g>`;
  // a little park lamp + bench along the path
  world += `<g transform="translate(2160 740)"><rect x="-90" y="-46" width="180" height="12" rx="5" fill="#c98a4b" ${msS(3.5)}/><rect x="-90" y="-80" width="180" height="12" rx="5" fill="#c98a4b" ${msS(3.5)}/><path d="M-76 -34 v34 M76 -34 v34 M-76 -80 v46 M76 -80 v46" ${msS(5)}/></g>`;
  // flower beds along the path (back edge) and a few mushrooms
  const cols = ['#ff6fa8', '#ffd23f', '#9775fa', '#ff8a5c', '#4dabf7', '#ffffff'];
  for (let i = 0; i < 70; i++){
    const x = 600 + i * 40 + r() * 30;
    if ((x > 950 && x < 1260) || (x > 2260 && x < 2700)) continue;
    world += r() > 0.4 ? msFlower(x, 742 + r() * 8, cols[i % cols.length], 0.9) : msTulip(x, 744, cols[(i + 2) % cols.length]);
  }
  world += msMushroom(1180, 744, 0.9) + msMushroom(2150, 750, 0.7) + msMushroom(1620, 748, 0.8);
  // butterflies (flutter along with CSS)
  world += msButterfly(1160, 560, '#ff8fbd') + msButterfly(1720, 520, '#b197fc', 'mv-flutter mv-flutter--b') + msButterfly(2600, 560, '#4dabf7', 'mv-flutter mv-flutter--c');
  // ---- fore (parallax 1.2): grass, flowers, stones right at the bottom ----
  let fore = '';
  for (let i = 0; i < 90; i++){
    const x = -100 + i * 44 + r() * 30, y = 905 + r() * 10;
    fore += msGrassTuft(x, y, 0.9 + r() * 0.8, i % 2 ? '#4fae46' : '#62c24f');
    if (i % 5 === 0) fore += msFlower(x + 12, y - 4, cols[(i / 5) % cols.length], 1.2);
    if (i % 11 === 0) fore += `<ellipse cx="${x + 30}" cy="${y - 6}" rx="26" ry="14" fill="#c9c2b8" ${msS(3.5)}/>`;
  }
  return { id: 'park', width: W, layers: { sky, far, hills, world, props, fore }, parallax: { sky: 0, far: 0.15, hills: 0.4, world: 1, props: 1, fore: 1.2 } };
}

const MOVIE_SETS = { park: msParkSet };
