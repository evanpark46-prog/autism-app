/* ==========================================================================
   Safety Superheroes — Hero Movies: the recurring CAST (series bible in code)
   Every Hero Movie uses these exact characters. Change a look here and it
   changes in every episode. Add NEW guest characters and props at the
   bottom; don't restyle the core cast. Who they are and how they act:
   tools/movies/SERIES-BIBLE.md.

   Rig (v2, "TV cut-out" style): every character is built from jointed parts
   so the engine can act with them like a cartoon:
     legs = thigh > shin > foot (knees bend)   arms = upper > forearm > hand
     head turns (face slides for a 3/4 look), eyes look at things, real
     eyelids, brows and a mouth that are reshaped every frame (emotions +
     lip sync to the voice), floppy ears / tails on springs, squash+stretch.
   Local coords: feet at (0,0), up is -y, facing right. Ink is #2b2b2b.
   ========================================================================== */

const MC_INK = '#2b2b2b';
const mcS = (w) => `stroke="${MC_INK}" stroke-width="${w || 4}" stroke-linejoin="round" stroke-linecap="round"`;
let mcUid = 0;

// Tapered capsule between two points (w1 at the start, w2 at the end).
function mcSeg(x1, y1, x2, y2, w1, w2, fill, extra){
  const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a), ny = Math.cos(a);
  const r1 = w1 / 2, r2 = w2 / 2;
  const p = (x, y, r, s) => `${(x + nx * r * s).toFixed(1)} ${(y + ny * r * s).toFixed(1)}`;
  return `<path d="M${p(x1, y1, r1, 1)} L${p(x2, y2, r2, 1)} A${r2} ${r2} 0 0 0 ${p(x2, y2, r2, -1)} L${p(x1, y1, r1, -1)} A${r1} ${r1} 0 0 0 ${p(x1, y1, r1, 1)} Z" fill="${fill}" ${mcS(4)} ${extra || ''}/>`;
}
const mcShine = (cx, cy, rx, ry, rot) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".42" transform="rotate(${rot == null ? -25 : rot} ${cx} ${cy})"/>`;
const mcShade = (d, op) => `<path d="${d}" fill="#000" opacity="${op || 0.09}"/>`;

// Mouth path from (open 0..1, smile -1..1): the engine calls this every frame.
function mcMouthPath(mx, my, w, open, smile){
  const lift = smile * w * 0.32, cx = mx;
  const lx = mx - w, rx = mx + w, ly = my - lift, ry = my - lift;
  if (open < 0.04) return `M${lx.toFixed(1)} ${ly.toFixed(1)} Q${cx.toFixed(1)} ${(my + smile * w * 0.75).toFixed(1)} ${rx.toFixed(1)} ${ry.toFixed(1)}`;
  const top = my + smile * w * 0.28 - open * w * 0.12, bot = my + smile * w * 0.5 + open * w * 1.25 + 2;
  return `M${lx.toFixed(1)} ${ly.toFixed(1)} Q${cx.toFixed(1)} ${top.toFixed(1)} ${rx.toFixed(1)} ${ry.toFixed(1)} Q${cx.toFixed(1)} ${bot.toFixed(1)} ${lx.toFixed(1)} ${ly.toFixed(1)} Z`;
}

// Lollipop prop (shown in a hand when an actor holds 'candy').
function mcLollipop(x, y, s){
  s = s || 1; let sw = '';
  for (let i = 0; i < 10; i++){
    const a0 = i / 10 * Math.PI * 2, a1 = (i + 1) / 10 * Math.PI * 2, r = 17 * s, cy = y - 30 * s;
    sw += `<path d="M${x} ${cy} L${(x + Math.cos(a0) * r).toFixed(1)} ${(cy + Math.sin(a0) * r).toFixed(1)} A${r} ${r} 0 0 1 ${(x + Math.cos(a1) * r).toFixed(1)} ${(cy + Math.sin(a1) * r).toFixed(1)} Z" fill="${i % 2 ? '#fff' : '#ff4f8b'}"/>`;
  }
  return `<g class="mc-prop-candy" style="display:none"><rect x="${x - 2.5 * s}" y="${y - 30 * s}" width="${5 * s}" height="${34 * s}" rx="2" fill="#fff" ${mcS(2.5)}/>${sw}<circle cx="${x}" cy="${y - 30 * s}" r="${17 * s}" fill="none" ${mcS(3.5)}/>${mcShine(x - 6 * s, y - 37 * s, 5 * s, 3 * s)}</g>`;
}
function mcGoldAcorn(x, y, s){
  s = s || 1;
  return `<g class="mc-prop-acorn" style="display:none"><ellipse cx="${x}" cy="${y - 10 * s}" rx="${11 * s}" ry="${13 * s}" fill="#ffd23f" ${mcS(3)}/><path d="M${x - 13 * s} ${y - 15 * s} q${13 * s} -${15 * s} ${26 * s} 0 z" fill="#e0a100" ${mcS(3)}/><path d="M${x} ${y - 25 * s} v-${6 * s}" ${mcS(3)}/>${mcShine(x - 4 * s, y - 12 * s, 3 * s, 5 * s)}</g>`;
}

/* --------------------------------------------------------------------------
   mcRig(spec): assembles a jointed character. spec gives proportions,
   colors and drawing hooks; the result has .svg plus the joint map the
   engine needs (pivots, face anchors, sizes).
   -------------------------------------------------------------------------- */
function mcRig(o){
  const uid = 'mc' + (++mcUid);
  const L = o.leg, T = o.torso, SW = o.shoulderW, A = o.arm, R = o.headR;
  const hipY = -L, shY = -L - T + o.shDrop, neckY = -L - T + 4, headY = neckY - R * (o.headLift || 0.86);
  const hx = o.hipX || SW * 0.45;
  const P = {
    hipF: [hx * 0.5, hipY], kneeF: [hx * 0.5, hipY + L * 0.5], hipB: [-hx * 0.5, hipY], kneeB: [-hx * 0.5, hipY + L * 0.5],
    shF: [SW * 0.62, shY], elF: [SW * 0.62, shY + A * 0.5], shB: [-SW * 0.62, shY], elB: [-SW * 0.62, shY + A * 0.5],
    neck: [0, neckY], head: [0, headY], tail: o.tailAt || [-SW * 0.9, hipY + 6],
  };
  const fc = [R * 0.14, headY + R * (o.faceDrop || 0.12)];
  const leg = (k) => {
    const [x, y] = P['hip' + k], [, ky] = P['knee' + k];
    return `<g class="mc-hip${k}">${mcSeg(x, y, x, ky, o.legW, o.legW * 0.9, o.pants)}`
      + `<g class="mc-knee${k}">${mcSeg(x, ky, x, -o.footH, o.legW * 0.9, o.legW * 0.78, o.shin || o.pants)}`
      + `<g class="mc-foot${k}">${o.foot(x)}</g></g>${o.legOver ? o.legOver(x, y, ky) : ''}</g>`;
  };
  const arm = (k) => {
    const [x, y] = P['sh' + k], [, ey] = P['el' + k];
    return `<g class="mc-sh${k}">${mcSeg(x, y, x, ey, o.armW, o.armW * 0.92, o.sleeve)}`
      + `<g class="mc-el${k}">${mcSeg(x, ey, x, y + A - o.handR * 0.6, o.armW * 0.9, o.armW * 0.8, o.fore || o.sleeve)}`
      + (o.cuff ? `<ellipse cx="${x}" cy="${ey + 4}" rx="${o.armW * 0.55}" ry="${o.armW * 0.2}" fill="${o.cuff}" ${mcS(3)}/>` : '')
      + `<g class="mc-hand${k}"><circle cx="${x}" cy="${y + A}" r="${o.handR}" fill="${o.hand}" ${mcS(4)}/>${mcShine(x - o.handR * 0.35, y + A - o.handR * 0.4, o.handR * 0.3, o.handR * 0.18)}`
      + (k === 'F' ? mcLollipop(x + 2, y + A + 2, o.propScale || 1) + mcGoldAcorn(x + 2, y + A + 6, o.propScale || 1) : '')
      + `</g></g></g>`;
  };
  const ear = (k) => o.ear ? `<g class="mc-ear${k}">${o.ear(k, P, headY)}</g>` : '';
  // eyes: white + pupil (moves) + eyelid (clipped to the eye) + happy-arc
  const E = o.eye, ex = (s) => fc[0] + s * E.gap, ey = fc[1] + E.dy;
  let defs = `<defs>`, eyes = '';
  for (const [i, s] of [[0, -1], [1, 1]]) {
    defs += `<clipPath id="${uid}e${i}"><ellipse cx="${ex(s)}" cy="${ey}" rx="${E.rx}" ry="${E.ry}"/></clipPath>`;
    eyes += `<g class="mc-eye" data-i="${i}">`
      + `<ellipse cx="${ex(s)}" cy="${ey}" rx="${E.rx}" ry="${E.ry}" fill="#fff"/>`
      + `<g clip-path="url(#${uid}e${i})"><g class="mc-pupil"><ellipse cx="${ex(s)}" cy="${ey + E.ry * 0.12}" rx="${E.rx * 0.62}" ry="${E.ry * 0.7}" fill="${E.iris || MC_INK}"/>`
      + (E.iris ? `<ellipse cx="${ex(s)}" cy="${ey + E.ry * 0.12}" rx="${E.rx * 0.36}" ry="${E.ry * 0.42}" fill="${MC_INK}"/>` : '')
      + `<circle cx="${ex(s) + E.rx * 0.22}" cy="${ey - E.ry * 0.2}" r="${E.rx * 0.24}" fill="#fff"/><circle cx="${ex(s) - E.rx * 0.2}" cy="${ey + E.ry * 0.38}" r="${E.rx * 0.11}" fill="#fff"/></g>`
      + `<rect class="mc-lid" x="${ex(s) - E.rx - 2}" y="${ey - E.ry - 2}" width="${E.rx * 2 + 4}" height="0" fill="${o.lid || o.fur}"/></g>`
      + `<ellipse cx="${ex(s)}" cy="${ey}" rx="${E.rx}" ry="${E.ry}" fill="none" ${mcS(3.2)}/>`
      + `<path class="mc-lidline" d="" fill="none" ${mcS(3.2)}/>`
      + `</g>`
      + `<path class="mc-happy" style="display:none" d="M${ex(s) - E.rx} ${ey + 2} q${E.rx} -${E.ry * 1.3} ${E.rx * 2} 0" fill="none" ${mcS(4)}/>`;
  }
  defs += `</defs>`;
  const brows = `<path class="mc-brow" data-i="0" d="" fill="none" ${mcS(o.browW || 4)}/><path class="mc-brow" data-i="1" d="" fill="none" ${mcS(o.browW || 4)}/>`;
  const M = o.mouth; // {dx, dy, w}
  const face = `<g class="mc-face">`
    + (o.cheeks ? `<ellipse cx="${fc[0] - E.gap - E.rx * 0.6}" cy="${ey + E.ry * 1.6}" rx="${E.rx * 1.05}" ry="${E.rx * 0.65}" fill="${o.cheeks}" opacity=".75"/><ellipse cx="${fc[0] + E.gap + E.rx * 0.6}" cy="${ey + E.ry * 1.6}" rx="${E.rx * 1.05}" ry="${E.rx * 0.65}" fill="${o.cheeks}" opacity=".75"/>` : '')
    + (o.muzzle ? o.muzzle(fc) : '')
    + `<g class="mc-eyes">${eyes}</g>${brows}`
    + `<path class="mc-mouth" d="${mcMouthPath(fc[0] + M.dx, fc[1] + M.dy, M.w, 0, 0.6)}" fill="#7a2a3c" ${mcS(3.4)}/>`
    + (o.nose ? o.nose(fc) : '')
    + (o.glasses ? o.glasses(fc, E) : '')
    + `</g>`;
  const svg = `<g class="mc-rig mc-${o.id}">${defs}`
    + `<ellipse class="mc-shadow" cx="0" cy="2" rx="${o.shadow}" ry="${o.shadow * 0.2}" fill="#244a18" opacity=".2"/>`
    + `<g class="mc-body">`
    + (o.tail ? `<g class="mc-tail">${o.tail(P.tail)}</g>` : '')
    + ear('B')
    + leg('B') + arm('B') + leg('F')
    + `<g class="mc-torso">${o.torsoSvg(P, L, T, SW)}</g>`
    + `<g class="mc-head">${o.headBack ? o.headBack(P, headY, R) : ''}${o.headSvg(P, headY, R)}${face}${o.headFront ? o.headFront(P, headY, R, fc) : ''}</g>`
    + ear('F')
    + arm('F')
    + `</g></g>`;
  return { id: o.id, name: o.name, svg, P, fc, eye: E, mouth: { x: fc[0] + M.dx, y: fc[1] + M.dy, w: M.w }, height: o.height, legLen: L, headR: R,
    earDroop: o.earDroop || 0, earSpring: o.earSpring !== false, tailSpring: !!o.tailSpring, turnDx: o.turnDx || R * 0.22, brow: o.brow || { w: E.rx * 0.95, h: E.ry * 1.8 } };
}

// Bunny ear in two segments (base + floppy tip), pivoting at the head.
function mcBunnyEar(fur, inner, len, wid){
  return (k, P, headY) => {
    const bx = k === 'F' ? 24 : -22, by = headY - 36, mid = by - len * 0.48, tip = by - len;
    return `<g class="mc-ear-base" data-px="${bx}" data-py="${by}">`
      + `<path d="M${bx - wid} ${by + 4} C${bx - wid - 2} ${mid + 10} ${bx - wid + 2} ${mid - 4} ${bx} ${mid - 6} C${bx + wid - 2} ${mid - 4} ${bx + wid + 2} ${mid + 10} ${bx + wid} ${by + 4} Z" fill="${fur}" ${mcS(4)}/>`
      + `<path d="M${bx - wid * 0.45} ${by} C${bx - wid * 0.5} ${mid + 8} ${bx} ${mid - 2} ${bx} ${mid - 2} C${bx} ${mid - 2} ${bx + wid * 0.5} ${mid + 8} ${bx + wid * 0.45} ${by} Z" fill="${inner}"/>`
      + `<g class="mc-ear-tip" data-px="${bx}" data-py="${mid}">`
      + `<path d="M${bx - wid + 1} ${mid + 6} C${bx - wid - 2} ${mid - 10} ${bx - wid * 0.7} ${tip + 4} ${bx} ${tip} C${bx + wid * 0.7} ${tip + 4} ${bx + wid + 2} ${mid - 10} ${bx + wid - 1} ${mid + 6} Z" fill="${fur}" ${mcS(4)}/>`
      + `<path d="M${bx - wid * 0.45} ${mid + 4} C${bx - wid * 0.5} ${mid - 10} ${bx - wid * 0.2} ${tip + 12} ${bx} ${tip + 10} C${bx + wid * 0.2} ${tip + 12} ${bx + wid * 0.5} ${mid - 10} ${bx + wid * 0.45} ${mid + 4} Z" fill="${inner}"/>`
      + `</g></g>`;
  };
}
const mcSneaker = (col, w) => (x) => `<path d="M${x - w * 0.55} -2 q0 -${w * 0.75} ${w * 0.6} -${w * 0.75} q${w * 0.85} 0 ${w * 0.95} ${w * 0.5} q.5 ${w * 0.25} -${w * 0.3} ${w * 0.25} z" fill="${col}" ${mcS(4)}/><path d="M${x - w * 0.55} -3 h${w * 1.5}" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`;

/* ==========================================================================
   CORE CAST
   ========================================================================== */

// ALEX — the curious little bunny (about 5). Lavender-white fur, pink inner
// ears, sunflower hoodie, blue jeans, orange sneakers. Says "Boing!", ears
// droop when unsure and spring up after a safe choice.
function mcAlex(){
  const fur = '#f6f1ff', pink = '#ffb3c7', hood = '#ffc928', hoodDark = '#eea600', jeans = '#3d7be0';
  return mcRig({
    id: 'alex', name: 'Alex', height: 305, shadow: 46,
    leg: 64, torso: 76, shoulderW: 30, arm: 62, headR: 50, shDrop: 12, hipX: 34,
    legW: 25, armW: 21, handR: 12, footH: 14, propScale: 0.9,
    fur, pants: jeans, sleeve: hood, hand: fur, foot: mcSneaker('#ff7a1a', 26),
    torsoSvg: (P, L, T) => `<path d="M-34 ${-L + 8} q-6 -${T - 6} 10 -${T + 4} q24 -12 48 0 q16 10 10 ${T + 4} q-34 9 -68 0 z" fill="${hood}" ${mcS(4.5)}/>`
      + mcShade(`M-34 ${-L + 8} q-6 -${T - 6} 10 -${T + 4} q8 -4 13 -5 q-14 30 -3 ${T + 12} q-10 -1 -20 -4 z`, 0.08)
      + `<path d="M-20 ${-L - 14} h36 q4 0 3 6 l-3 12 h-36 l-3 -12 q-1 -6 3 -6 z" fill="${hoodDark}" ${mcS(3)}/>`
      + `<path d="M-6 ${-L - T + 4} v18 M10 ${-L - T + 4} v18" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>`,
    tail: (t) => `<circle cx="${t[0]}" cy="${t[1]}" r="15" fill="#fff" ${mcS(4)}/>`,
    tailAt: [-36, -72],
    ear: mcBunnyEar(fur, pink, 92, 15),
    headSvg: (P, hy, R) => `<path d="M-30 ${hy + R * 0.86} q-12 6 -6 14 q20 6 60 0 q6 -8 -6 -14" fill="${hoodDark}" ${mcS(3.5)}/>`
      + `<ellipse cx="0" cy="${hy}" rx="${R}" ry="${R * 0.93}" fill="${fur}" ${mcS(4.5)}/>`
      + mcShade(`M-${R} ${hy} a${R} ${R * 0.93} 0 0 0 ${R * 0.8} ${R * 0.9} q-${R * 0.7} -${R * 0.25} -${R * 0.8} -${R * 0.9} z`, 0.07),
    muzzle: (fc) => `<ellipse cx="${fc[0] + 2}" cy="${fc[1] + 22}" rx="18" ry="12" fill="#fff"/>`,
    nose: (fc) => `<path d="M${fc[0] - 4} ${fc[1] + 12} q5 -4 10 0 q-5 6 -10 0 z" fill="#ff6f91" ${mcS(2.5)}/>`,
    eye: { gap: 18, dy: -6, rx: 9, ry: 11 }, cheeks: pink, mouth: { dx: 2, dy: 26, w: 9 },
  });
}

// DAD — Alex's dad: a tall, gentle, goofy bunny. Grey-lilac fur, green
// striped polo, brown trousers, a floppy sun hat. Tells terrible jokes,
// plays along with every game, and is always where Alex can find him.
function mcDad(){
  const fur = '#d9cfe8', inner = '#f2b6c8', polo = '#3fae6a', stripe = '#2f8c53', trousers = '#8a6a4f';
  return mcRig({
    id: 'dad', name: 'Dad', height: 450, shadow: 60,
    leg: 118, torso: 116, shoulderW: 44, arm: 104, headR: 54, shDrop: 14, hipX: 46,
    legW: 30, armW: 25, handR: 15, footH: 16,
    fur, pants: trousers, sleeve: polo, fore: fur, cuff: polo, hand: fur, foot: mcSneaker('#5a4a7a', 32),
    torsoSvg: (P, L, T) => `<path d="M-48 ${-L + 10} q-8 -${T - 10} 12 -${T + 4} q36 -14 72 0 q20 14 12 ${T + 4} q-48 11 -96 0 z" fill="${polo}" ${mcS(4.5)}/>`
      + [0, 1, 2].map(i => `<path d="M-46 ${-L - 20 - i * 30} q46 8 92 0" stroke="${stripe}" stroke-width="7" fill="none"/>`).join('')
      + `<path d="M-14 ${-L - T + 2} l14 18 l14 -18" fill="#fff" ${mcS(3)}/>` + mcShade(`M-48 ${-L + 10} q-8 -${T - 10} 12 -${T + 4} q8 -3 14 -4 q-16 40 -6 ${T + 14} z`, 0.08),
    tail: (t) => `<circle cx="${t[0]}" cy="${t[1]}" r="17" fill="#fff" ${mcS(4)}/>`,
    tailAt: [-48, -126],
    ear: mcBunnyEar(fur, inner, 110, 17),
    headSvg: (P, hy, R) => `<ellipse cx="0" cy="${hy}" rx="${R}" ry="${R * 0.95}" fill="${fur}" ${mcS(4.5)}/>` + mcShade(`M-${R} ${hy} a${R} ${R * 0.95} 0 0 0 ${R * 0.8} ${R * 0.92} q-${R * 0.7} -${R * 0.25} -${R * 0.8} -${R * 0.92} z`, 0.07),
    headFront: (P, hy, R) => `<path d="M-${R + 16} ${hy - R * 0.45} q${R + 16} -22 ${2 * R + 32} 0 q-6 10 -${R + 10} 8 q-${R} 2 -${R + 22} -8 z" fill="#f4d58d" ${mcS(4)}/><path d="M-${R * 0.7} ${hy - R * 0.5} q${R * 0.7} -${R * 0.75} ${R * 1.4} 0 z" fill="#f4d58d" ${mcS(4)}/><path d="M-${R * 0.68} ${hy - R * 0.56} q${R * 0.68} 8 ${R * 1.36} 0" stroke="#e05d5d" stroke-width="7" fill="none"/>`,
    muzzle: (fc) => `<ellipse cx="${fc[0] + 2}" cy="${fc[1] + 24}" rx="21" ry="14" fill="#fff"/>`,
    nose: (fc) => `<path d="M${fc[0] - 5} ${fc[1] + 13} q6 -5 12 0 q-6 7 -12 0 z" fill="#c2577a" ${mcS(2.5)}/>`,
    eye: { gap: 19, dy: -4, rx: 8, ry: 9.5 }, mouth: { dx: 2, dy: 30, w: 11 }, browW: 5,
  });
}

// NUTTY — the squirrel sidekick. Notices trouble FIRST (tail puffs up, the
// orange "notice" spark pops). Running gag: drops acorns, usually on himself.
function mcNutty(){
  const fur = '#e9772b', belly = '#ffe2bd';
  return mcRig({
    id: 'nutty', name: 'Nutty', height: 125, shadow: 26,
    leg: 20, torso: 38, shoulderW: 18, arm: 26, headR: 25, shDrop: 6, hipX: 18, headLift: 0.7,
    legW: 13, armW: 9, handR: 6, footH: 5, propScale: 0.55,
    fur, pants: fur, sleeve: fur, hand: fur, foot: (x) => `<ellipse cx="${x + 5}" cy="-4" rx="11" ry="6" fill="${fur}" ${mcS(3.5)}/>`,
    torsoSvg: (P, L, T) => `<ellipse cx="2" cy="${-L - T * 0.45}" rx="22" ry="${T * 0.62}" fill="${fur}" ${mcS(4)}/><ellipse cx="7" cy="${-L - T * 0.4}" rx="13" ry="${T * 0.45}" fill="${belly}"/>`,
    tailAt: [-12, -24], tailSpring: true,
    tail: (t) => `<g class="mc-tail-base" data-px="${t[0]}" data-py="${t[1]}"><path class="mc-tail-fluff" d="M${t[0]} ${t[1]} C${t[0] - 50} ${t[1] + 4} ${t[0] - 62} ${t[1] - 46} ${t[0] - 40} ${t[1] - 66} L${t[0] - 14} ${t[1] - 52} C${t[0] - 30} ${t[1] - 36} ${t[0] - 14} ${t[1] - 16} ${t[0]} ${t[1]} Z" fill="${fur}" ${mcS(4)}/>`
      + `<g class="mc-tail-tip" data-px="${t[0] - 28}" data-py="${t[1] - 60}"><path d="M${t[0] - 42} ${t[1] - 64} C${t[0] - 60} ${t[1] - 90} ${t[0] - 30} ${t[1] - 112} ${t[0] - 8} ${t[1] - 98} C${t[0] + 4} ${t[1] - 90} ${t[0] - 4} ${t[1] - 74} ${t[0] - 14} ${t[1] - 52} Z" fill="${fur}" ${mcS(4)}/><path d="M${t[0] - 40} ${t[1] - 80} C${t[0] - 40} ${t[1] - 96} ${t[0] - 22} ${t[1] - 102} ${t[0] - 12} ${t[1] - 96}" stroke="#ffb37a" stroke-width="5" fill="none" stroke-linecap="round"/></g></g>`,
    ear: (k, P, hy) => { const x = k === 'F' ? 12 : -6; return `<g class="mc-ear-base" data-px="${x}" data-py="${hy - 18}"><path d="M${x - 7} ${hy - 16} l5 -22 l11 18 z" fill="${fur}" ${mcS(3.5)}/></g>`; },
    earSpring: true,
    headSvg: (P, hy, R) => `<ellipse cx="4" cy="${hy}" rx="${R}" ry="${R * 0.9}" fill="${fur}" ${mcS(4)}/>`,
    muzzle: (fc) => `<ellipse cx="${fc[0] + 10}" cy="${fc[1] + 9}" rx="12" ry="8.5" fill="${belly}"/>`,
    nose: (fc) => `<ellipse cx="${fc[0] + 20}" cy="${fc[1] + 3}" rx="4" ry="3.2" fill="${MC_INK}"/>`,
    eye: { gap: 8.5, dy: -5, rx: 5, ry: 6 }, mouth: { dx: 12, dy: 13, w: 5 }, browW: 3,
  });
}

// THE LESSON HERO — each episode's own caped animal hero from the app
// (js/animal-heroes.js). Calm expert. Swoops in to save the day, rewinds
// time, leaves a Hero Tip. Sign-off: "Be safe, be super!"
function mcHeroSvg(topicId, theme){
  if (typeof animalHeroSvg !== 'function') return '';
  return animalHeroSvg(topicId, theme || 'indigo', '', {}).replace(' width="100%" height="100%"', ' x="-90" y="-180" width="180" height="180"');
}

/* ==========================================================================
   GUEST CAST
   ========================================================================== */

// A grown-up Alex doesn't know (goat). Deliberately ORDINARY and friendly-
// looking: strangers look like anyone else. Never drawn scary or mean.
function mcGoat(){
  const fur = '#efe3cf', cardi = '#25a99a', pants = '#c7ae82';
  return mcRig({
    id: 'goat', name: 'Grown-up', height: 405, shadow: 56,
    leg: 116, torso: 110, shoulderW: 40, arm: 100, headR: 44, shDrop: 14, hipX: 44, headLift: 1.0, faceDrop: 0.18,
    legW: 29, armW: 25, handR: 13, footH: 15,
    fur, pants, sleeve: cardi, hand: fur, foot: mcSneaker('#6b4a33', 30),
    torsoSvg: (P, L, T) => `<path d="M-44 ${-L + 8} q-8 -${T - 6} 12 -${T + 4} q32 -14 64 0 q20 12 12 ${T + 4} q-44 10 -88 0 z" fill="${cardi}" ${mcS(4.5)}/>`
      + `<path d="M-6 ${-L - T + 2} l6 18 l6 -18" fill="#fff" ${mcS(3)}/><path d="M0 ${-L - T + 20} v${T - 18}" stroke="${MC_INK}" stroke-width="3"/>`
      + [0, 1, 2].map(i => `<circle cx="7" cy="${-L - T + 34 + i * 26}" r="4" fill="#ffe680" ${mcS(2)}/>`).join('')
      + `<rect x="-36" y="${-L - 52}" width="22" height="18" rx="4" fill="#1f8e81" ${mcS(3)}/>`,
    ear: (k, P, hy) => { const s = k === 'F' ? 1 : -1, x = s * 40; return `<g class="mc-ear-base" data-px="${s * 30}" data-py="${hy - 8}"><ellipse cx="${x}" cy="${hy - 4}" rx="22" ry="9" fill="${fur}" ${mcS(4)} transform="rotate(${-s * 20} ${x} ${hy - 4})"/></g>`; },
    headBack: (P, hy) => `<path d="M-22 ${hy - 30} q-10 -24 -2 -34 q4 16 12 26 z" fill="#b7b0a3" ${mcS(3.5)}/><path d="M26 ${hy - 30} q10 -24 2 -34 q-4 16 -12 26 z" fill="#b7b0a3" ${mcS(3.5)}/>`,
    headSvg: (P, hy, R) => `<path d="M-${R * 0.82} ${hy - 6} q0 -${R * 0.8} ${R * 0.86} -${R * 0.8} q${R * 0.86} 0 ${R * 0.86} ${R * 0.8} v${R * 0.7} q0 ${R * 0.7} -${R * 0.86} ${R * 0.7} q-${R * 0.86} 0 -${R * 0.86} -${R * 0.7} z" fill="${fur}" ${mcS(4.5)}/>`
      + `<path d="M-6 ${hy + R * 1.25} q8 22 16 0" fill="#fff" ${mcS(3)}/>`,
    muzzle: (fc) => `<ellipse cx="${fc[0]}" cy="${fc[1] + 26}" rx="20" ry="13" fill="#f7efe1"/>`,
    nose: (fc) => `<ellipse cx="${fc[0]}" cy="${fc[1] + 18}" rx="8" ry="5.5" fill="#c9a98a" ${mcS(2.5)}/>`,
    glasses: (fc, E) => `<circle cx="${fc[0] - E.gap}" cy="${fc[1] + E.dy}" r="${E.rx + 6}" fill="none" stroke="#5a3d2b" stroke-width="3.5"/><circle cx="${fc[0] + E.gap}" cy="${fc[1] + E.dy}" r="${E.rx + 6}" fill="none" stroke="#5a3d2b" stroke-width="3.5"/><path d="M${fc[0] - E.gap + E.rx + 6} ${fc[1] + E.dy} h${2 * (E.gap - E.rx - 6)}" stroke="#5a3d2b" stroke-width="3.5"/>`,
    eye: { gap: 16, dy: -4, rx: 7, ry: 8 }, mouth: { dx: 0, dy: 34, w: 9 },
  });
}

// LIFEGUARD BRUNO (bear) — a trusted helper for pool / beach episodes.
function mcBear(){
  const fur = '#b5743f', muzzle = '#f0cfa0', shirt = '#ec3b2e';
  return mcRig({
    id: 'bear', name: 'Lifeguard Bruno', height: 420, shadow: 62,
    leg: 108, torso: 120, shoulderW: 48, arm: 100, headR: 54, shDrop: 14, hipX: 50,
    legW: 34, armW: 29, handR: 15, footH: 16,
    fur, pants: '#203a7a', shin: fur, sleeve: shirt, fore: fur, hand: fur, foot: mcSneaker('#fff', 34),
    torsoSvg: (P, L, T) => `<path d="M-52 ${-L + 8} q-10 -${T - 6} 14 -${T + 4} q38 -16 76 0 q24 14 14 ${T + 4} q-52 12 -104 0 z" fill="${shirt}" ${mcS(4.5)}/><g class="mc-flipfix"><text x="0" y="${-L - 46}" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="22" fill="#fff">GUARD</text></g>`,
    ear: (k, P, hy) => { const x = k === 'F' ? 40 : -38; return `<g class="mc-ear-base" data-px="${x}" data-py="${hy - 30}"><circle cx="${x}" cy="${hy - 36}" r="16" fill="${fur}" ${mcS(4)}/><circle cx="${x}" cy="${hy - 36}" r="8" fill="${muzzle}"/></g>`; },
    earSpring: false,
    headSvg: (P, hy, R) => `<ellipse cx="0" cy="${hy}" rx="${R}" ry="${R * 0.9}" fill="${fur}" ${mcS(4.5)}/>`,
    muzzle: (fc) => `<ellipse cx="${fc[0]}" cy="${fc[1] + 22}" rx="26" ry="18" fill="${muzzle}" ${mcS(3.5)}/>`,
    nose: (fc) => `<ellipse cx="${fc[0] + 2}" cy="${fc[1] + 12}" rx="9" ry="6.5" fill="${MC_INK}"/>`,
    eye: { gap: 18, dy: -8, rx: 7, ry: 8.5 }, mouth: { dx: 2, dy: 30, w: 10 },
  });
}

/* ==========================================================================
   PROPS + MOTIFS
   ========================================================================== */
function mcSparkSvg(){
  return `<g class="mc-spark"><circle r="34" fill="#ff8a00" opacity=".22"/>`
    + `<path d="M0 -30 L8 -9 L30 -8 L12 6 L19 28 L0 15 L-19 28 L-12 6 L-30 -8 L-8 -9 Z" fill="#ff9d1c" ${mcS(4)}/>`
    + `<text x="0" y="9" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="26" fill="#fff">!</text></g>`;
}
function mcCar(color){
  color = color || '#8ec5ff';
  return `<g class="mc-car">`
    + `<path d="M-150 -40 q0 -40 40 -46 l40 -50 q10 -12 30 -12 h90 q20 0 30 14 l34 46 q46 4 46 48 v22 h-310 z" fill="${color}" ${mcS(5)}/>`
    + `<path d="M-62 -90 l30 -40 q6 -8 18 -8 h40 v48 z" fill="#d9f1ff" ${mcS(4)}/><path d="M38 -90 v-48 h30 q10 0 16 8 l28 40 z" fill="#d9f1ff" ${mcS(4)}/>`
    + `<path d="M-40 -126 l18 -10" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`
    + `<circle cx="-86" cy="-16" r="30" fill="#3a3a44" ${mcS(4)}/><circle cx="-86" cy="-16" r="13" fill="#dfe6ee"/>`
    + `<circle cx="90" cy="-16" r="30" fill="#3a3a44" ${mcS(4)}/><circle cx="90" cy="-16" r="13" fill="#dfe6ee"/>`
    + `<ellipse cx="150" cy="-56" rx="9" ry="7" fill="#fff6b0" ${mcS(3)}/><path d="M-10 -78 h18" ${mcS(4)}/></g>`;
}
// Little comic effects that pop near a character's head.
const MC_EMOTE = {
  '!': `<g><path d="M-7 -40 h14 l-3 30 h-8 z" fill="#ff4d4d" ${mcS(3.5)}/><circle cx="0" cy="0" r="7" fill="#ff4d4d" ${mcS(3.5)}/></g>`,
  '?': `<g><path d="M-12 -30 q0 -16 14 -16 q16 0 16 14 q0 10 -12 14 v8" fill="none" stroke="#1f7ae0" stroke-width="10" stroke-linecap="round"/><path d="M-12 -30 q0 -16 14 -16 q16 0 16 14 q0 10 -12 14 v8" fill="none" stroke="${MC_INK}" stroke-width="3" stroke-linecap="round" opacity=".0"/><circle cx="6" cy="2" r="6" fill="#1f7ae0" ${mcS(3)}/></g>`,
  sweat: `<path d="M0 -26 q14 18 0 26 q-14 -8 0 -26 z" fill="#9fdcff" ${mcS(3)}/>`,
  heart: `<path d="M0 6 C-26 -10 -16 -34 0 -22 C16 -34 26 -10 0 6 Z" fill="#ff5d8f" ${mcS(3.5)}/>`,
  sparkle: `<g fill="#ffd23f" ${mcS(2.5)}><path d="M0 -26 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6z"/><path d="M26 -30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z"/></g>`,
  notes: `<g fill="${MC_INK}"><path d="M0 0 v-30 l18 -6 v28" fill="none" ${mcS(3.5)}/><ellipse cx="-4" cy="0" rx="6" ry="4.5"/><ellipse cx="14" cy="-8" rx="6" ry="4.5"/></g>`,
};
function mcDustSvg(){
  return `<g class="mv-dust">${[-1, 1].map(s => `<circle cx="${s * 16}" cy="-8" r="12" fill="#fff6e0" ${mcS(3)}/><circle cx="${s * 34}" cy="-4" r="8" fill="#fff6e0" ${mcS(3)}/>`).join('')}</g>`;
}

// Sound motifs (Web Audio, no files).
const MovieSfx = (() => {
  let ctx = null;
  const ac = () => { if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); } if (ctx.state === 'suspended') ctx.resume(); return ctx; };
  function tone(f, t0, d, type, vol, slideTo, dest){
    const c = ac(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0;
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(dest || c.destination); o.start(t); o.stop(t + d + 0.05);
  }
  function noise(t0, d, vol, f0, f1){
    const c = ac(); if (!c) return;
    const n = c.createBufferSource(), b = c.createBuffer(1, Math.max(1, c.sampleRate * d), c.sampleRate), x = b.getChannelData(0);
    for (let i = 0; i < x.length; i++) x[i] = Math.random() * 2 - 1;
    const f = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime + t0;
    f.type = 'bandpass'; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + d); f.Q.value = 1.2;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    n.buffer = b; n.connect(f).connect(g).connect(c.destination); n.start(t);
  }
  // A gentle original underscore: soft pad + kalimba arpeggio. Moods change the
  // chords; it ducks under voices.
  let music = null;
  const CH = { happy: [[60, 64, 67, 71], [57, 60, 64, 67], [65, 69, 72, 76], [67, 71, 74, 77]],
    tense: [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 56, 59]],
    hero: [[60, 64, 67, 72], [65, 69, 72, 77], [67, 71, 74, 79], [60, 64, 67, 72]] };
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  function startMusic(){
    const c = ac(); if (!c || music) return;
    const bus = c.createGain(); bus.gain.value = 0.0001; bus.connect(c.destination);
    bus.gain.exponentialRampToValueAtTime(0.5, c.currentTime + 1.5);
    music = { bus, mood: 'happy', step: 0, duck: 1, timer: null, on: true };
    const beat = 60 / 92 / 2;
    const tick = () => {
      if (!music) return;
      const chords = CH[music.mood] || CH.happy, bar = Math.floor(music.step / 8) % 4, ch = chords[bar], i = music.step % 8;
      const vol = music.mood === 'tense' ? 0.05 : 0.07;
      if (i === 0) ch.forEach(n => tone(hz(n - 12), 0, beat * 8.2, 'triangle', 0.018, null, bus));
      if (i === 0) tone(hz(ch[0] - 24), 0, beat * 3, 'sine', 0.06, null, bus);
      if (music.mood !== 'tense' || i % 2 === 0) tone(hz(ch[[0, 2, 1, 3, 2, 1, 3, 2][i] % ch.length] + 12), 0, beat * 2.5, 'sine', vol, null, bus);
      music.step++;
      music.timer = setTimeout(tick, beat * 1000);
    };
    tick();
  }
  return {
    notice(){ tone(784, 0, 0.18, 'triangle', 0.16); tone(988, 0.14, 0.18, 'triangle', 0.16); tone(1175, 0.28, 0.32, 'triangle', 0.16); },
    safe(){ [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.9, 'sine', 0.12)); },
    uhoh(){ tone(523, 0, 0.32, 'triangle', 0.15); tone(415, 0.3, 0.5, 'triangle', 0.15); },
    boing(){ tone(220, 0, 0.35, 'sine', 0.18, 520); },
    bonk(){ tone(380, 0, 0.12, 'square', 0.06, 160); noise(0, 0.08, 0.12, 900, 400); },
    quack(){ tone(520, 0, 0.12, 'sawtooth', 0.06, 380); tone(500, 0.16, 0.14, 'sawtooth', 0.06, 360); },
    whoosh(){ noise(0, 0.5, 0.18, 400, 2400); },
    pop(){ tone(660, 0, 0.09, 'sine', 0.16, 1200); },
    boop(){ tone(880, 0, 0.08, 'sine', 0.1, 600); },
    rewind(){ noise(0, 1.1, 0.12, 3000, 500); for (let i = 0; i < 9; i++) tone(900 - i * 50, i * 0.11, 0.08, 'square', 0.03); },
    sparkle(){ [1319, 1568, 1760, 2093, 2637].forEach((f, i) => tone(f, i * 0.07, 0.5, 'sine', 0.07)); },
    thud(){ tone(110, 0, 0.18, 'sine', 0.2, 60); noise(0, 0.1, 0.08, 400, 150); },
    giggle(){ [0, 1, 2, 3].forEach(i => tone(900 + (i % 2) * 140, i * 0.09, 0.08, 'sine', 0.08)); },
    unlock(){ ac(); },
    music: { start: startMusic, mood(m){ if (music) music.mood = m; },
      duck(on){ if (!music) return; const c = ac(); music.bus.gain.cancelScheduledValues(c.currentTime); music.bus.gain.setTargetAtTime(on ? 0.16 : (music.on ? 0.5 : 0.0001), c.currentTime, 0.15); },
      set(on){ if (!music) return; music.on = on; const c = ac(); music.bus.gain.setTargetAtTime(on ? 0.5 : 0.0001, c.currentTime, 0.2); },
      stop(){ if (music) { clearTimeout(music.timer); const c = ac(); music.bus.gain.setTargetAtTime(0.0001, c.currentTime, 0.2); music = null; } } },
    ctx: ac,
  };
})();

const MOVIE_CAST = { alex: mcAlex, dad: mcDad, nutty: mcNutty, goat: mcGoat, bear: mcBear };
