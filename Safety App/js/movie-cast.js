/* ==========================================================================
   Safety Superheroes — Hero Movies: the recurring CAST (series bible in code)
   Every Hero Movie uses these exact characters. Change a look here and it
   changes in every episode, so episodes stay consistent. Add NEW guest
   characters and props at the bottom; don't restyle the core cast.
   See tools/movies/SERIES-BIBLE.md for who they are and how they act.

   Each character is a hand-drawn 2D rig (inline SVG): parts pivot at joints
   so the movie engine can walk, wave, talk, blink and emote them.
   Local coords: feet at (0,0), up is -y, facing right. All ink is #2b2b2b.
   ========================================================================== */

const MC_INK = '#2b2b2b';

// ---- tiny SVG helpers -----------------------------------------------------
const mcStroke = (w) => `stroke="${MC_INK}" stroke-width="${w || 4}" stroke-linejoin="round" stroke-linecap="round"`;
function mcLimb(x1, y1, x2, y2, w, fill){ // a rounded capsule limb
  const a = Math.atan2(y2 - y1, x2 - x1), l = Math.hypot(x2 - x1, y2 - y1);
  return `<rect x="${x1}" y="${y1 - w / 2}" width="${l}" height="${w}" rx="${w / 2}" fill="${fill}" ${mcStroke(4)} transform="rotate(${a * 180 / Math.PI} ${x1} ${y1})"/>`;
}
const mcShine = (cx, cy, rx, ry, rot) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".45" transform="rotate(${rot || -25} ${cx} ${cy})"/>`;
const mcShade = (d, op) => `<path d="${d}" fill="#000" opacity="${op || 0.1}"/>`;

// Eyes: a group the engine squashes to blink. Big friendly eyes with two glints.
function mcEyes(cx, cy, gap, r, o){
  o = o || {};
  const one = (x) => `<ellipse cx="${x}" cy="${cy}" rx="${r * 0.82}" ry="${r}" fill="${MC_INK}"/>`
    + `<circle cx="${x + r * 0.28}" cy="${cy - r * 0.38}" r="${r * 0.34}" fill="#fff"/>`
    + `<circle cx="${x - r * 0.3}" cy="${cy + r * 0.38}" r="${r * 0.15}" fill="#fff"/>`;
  const dizzy = (x) => `<path d="M${x} ${cy} m-${r * 0.7} 0 a${r * 0.7} ${r * 0.7} 0 1 1 ${r * 0.7} ${r * 0.7} a${r * 0.45} ${r * 0.45} 0 1 1 -${r * 0.4} -${r * 0.55}" fill="none" ${mcStroke(3.2)}/>`;
  return `<g class="mc-eyes" data-cy="${cy}">${one(cx - gap)}${one(cx + gap)}</g>`
    + `<g class="mc-eyes-dizzy" style="display:none">${dizzy(cx - gap)}${dizzy(cx + gap)}</g>`
    + `<g class="mc-brows">`
    + `<path class="mc-brow-l" d="M${cx - gap - r * 0.8} ${cy - r * 1.55} q${r * 0.8} -${r * 0.5} ${r * 1.6} 0" fill="none" ${mcStroke(3.4)}/>`
    + `<path class="mc-brow-r" d="M${cx + gap - r * 0.8} ${cy - r * 1.55} q${r * 0.8} -${r * 0.5} ${r * 1.6} 0" fill="none" ${mcStroke(3.4)}/>`
    + `</g>`;
}
// Mouths: the engine shows one at a time (smile / open / frown / o / grin).
function mcMouths(cx, cy, w, o){
  o = o || {};
  const tongue = o.tongue || '#ff8fa3';
  return `<g class="mc-mouth">`
    + `<path class="m-smile" d="M${cx - w} ${cy} q${w} ${w * 0.9} ${w * 2} 0" fill="none" ${mcStroke(3.6)}/>`
    + `<g class="m-open" style="display:none"><path d="M${cx - w} ${cy - 2} q${w} ${w * 1.6} ${w * 2} 0 z" fill="#6b2737" ${mcStroke(3.2)}/><path d="M${cx - w * 0.5} ${cy + w * 0.55} q${w * 0.5} -${w * 0.4} ${w} 0" fill="${tongue}"/></g>`
    + `<g class="m-grin" style="display:none"><path d="M${cx - w * 1.15} ${cy - 3} q${w * 1.15} ${w * 1.9} ${w * 2.3} 0 z" fill="#6b2737" ${mcStroke(3.2)}/><path d="M${cx - w * 0.9} ${cy - 2} h${w * 1.8} v${w * 0.35} h-${w * 1.8} z" fill="#fff"/></g>`
    + `<path class="m-frown" style="display:none" d="M${cx - w * 0.9} ${cy + w * 0.6} q${w * 0.9} -${w * 0.8} ${w * 1.8} 0" fill="none" ${mcStroke(3.6)}/>`
    + `<ellipse class="m-o" style="display:none" cx="${cx}" cy="${cy + w * 0.3}" rx="${w * 0.42}" ry="${w * 0.55}" fill="#6b2737" ${mcStroke(3.2)}/>`
    + `<path class="m-wobble" style="display:none" d="M${cx - w} ${cy + w * 0.4} q${w * 0.33} -${w * 0.4} ${w * 0.66} 0 t${w * 0.66} 0 t${w * 0.66} 0" fill="none" ${mcStroke(3.4)}/>`
    + `</g>`;
}
// Lollipop (prop) drawn so it can sit in any hand
function mcLollipop(x, y, s){
  s = s || 1;
  let sw = '';
  for (let i = 0; i < 10; i++){
    const a0 = i / 10 * Math.PI * 2, a1 = (i + 1) / 10 * Math.PI * 2, r = 17 * s;
    sw += `<path d="M${x} ${y - 30 * s} L${x + Math.cos(a0) * r} ${y - 30 * s + Math.sin(a0) * r} A${r} ${r} 0 0 1 ${x + Math.cos(a1) * r} ${y - 30 * s + Math.sin(a1) * r} Z" fill="${i % 2 ? '#fff' : '#ff4f8b'}"/>`;
  }
  return `<g class="mc-prop-candy" style="display:none"><rect x="${x - 2.5 * s}" y="${y - 30 * s}" width="${5 * s}" height="${34 * s}" rx="2" fill="#fff" ${mcStroke(2.5)}/>${sw}<circle cx="${x}" cy="${y - 30 * s}" r="${17 * s}" fill="none" ${mcStroke(3.5)}/>${mcShine(x - 6 * s, y - 37 * s, 5 * s, 3 * s)}</g>`;
}

/* --------------------------------------------------------------------------
   The biped rig. Parts (all optional) are drawn by the character spec:
   legB legF (pivot at hips), armB armF (pivot at shoulders), torso, tail,
   head (pivot at neck) with earL earR (pivot at ear bases), face.
   -------------------------------------------------------------------------- */
function mcBiped(spec){
  const P = spec.pivots;
  const g = (cls, inner, extra) => `<g class="${cls}" ${extra || ''}>${inner || ''}</g>`;
  const svg = `<g class="mc-rig mc-${spec.id}">`
    + `<ellipse class="mc-shadow" cx="0" cy="2" rx="${spec.shadow || 50}" ry="${(spec.shadow || 50) * 0.22}" fill="#2b4a1e" opacity=".22"/>`
    + `<g class="mc-bob">`
    + g('mc-tail', spec.tail || '')
    + g('mc-leg-b', spec.legB || '')
    + g('mc-arm-b', spec.armB || '')
    + g('mc-leg-f', spec.legF || '')
    + g('mc-torso', spec.torso || '')
    + g('mc-head', g('mc-ear-l', spec.earL || '') + g('mc-ear-r', spec.earR || '') + (spec.head || '') + (spec.face || ''))
    + g('mc-arm-f', (spec.armF || '') + (spec.hand ? mcLollipop(spec.hand[0], spec.hand[1], spec.propScale) : ''))
    + (spec.over || '')
    + `</g></g>`;
  return { id: spec.id, svg, pivots: P, height: spec.height, name: spec.name, talkVoice: spec.voice };
}

/* ==========================================================================
   CORE CAST
   ========================================================================== */

// ALEX — the curious little bunny who makes understandable mistakes.
// Look: lavender-white fur, pink inner ears, sunflower hoodie, blue jeans,
// orange sneakers. Signature: says "Boing!", ears droop when unsure,
// ears shoot up when Alex gets it right.
function mcAlex(){
  const fur = '#f6f1ff', furShade = '#ded3f5', pink = '#ffb3c7', hood = '#ffc928', hoodDark = '#f0a800', jeans = '#3d7be0', shoe = '#ff7a1a';
  const leg = (x) => mcLimb(x, -62, x, -16, 26, jeans) + `<path d="M${x - 15} -4 q0 -16 15 -16 q20 0 22 12 q1 8 -8 8 h-29 z" fill="${shoe}" ${mcStroke(4)}/><path d="M${x - 15} -4 h37" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`;
  const arm = (sx) => mcLimb(sx, -118, sx + 4, -76, 22, hood) + `<circle cx="${sx + 5}" cy="-70" r="12" fill="${fur}" ${mcStroke(4)}/>`;
  const ear = (x, rot) => `<g transform="rotate(${rot} ${x} -212)"><ellipse cx="${x}" cy="-250" rx="15" ry="44" fill="${fur}" ${mcStroke(4)}/><ellipse cx="${x}" cy="-246" rx="7.5" ry="31" fill="${pink}"/></g>`;
  return mcBiped({
    id: 'alex', name: 'Alex', height: 300, shadow: 46, voice: 'alex',
    pivots: { hipF: [8, -62], hipB: [-10, -62], shF: [12, -118], shB: [-14, -118], neck: [0, -140], earL: [-16, -212], earR: [18, -212] },
    tail: `<circle cx="-40" cy="-78" r="15" fill="#fff" ${mcStroke(4)}/>`,
    legB: leg(-10), legF: leg(8),
    armB: arm(-14),
    torso: `<path d="M-34 -58 q-6 -60 10 -72 q24 -12 48 0 q16 12 10 72 q-34 8 -68 0 z" fill="${hood}" ${mcStroke(4.5)}/>`
      + mcShade('M-34 -58 q-6 -60 10 -72 q8 -4 14 -5 q-14 30 -4 82 q-10 -1 -20 -5 z', 0.08)
      + `<path d="M-20 -78 h36 q4 0 3 6 l-3 12 h-36 l-3 -12 q-1 -6 3 -6 z" fill="${hoodDark}" ${mcStroke(3)}/>`
      + `<path d="M-8 -128 v18 M8 -128 v18" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>`,
    earL: ear(-16, -10), earR: ear(18, 8),
    head: `<path d="M-30 -132 q-12 6 -6 14 q20 6 60 0 q6 -8 -6 -14" fill="${hoodDark}" ${mcStroke(3.5)}/>`
      + `<ellipse cx="0" cy="-176" rx="50" ry="46" fill="${fur}" ${mcStroke(4.5)}/>`
      + mcShade('M-50 -176 a50 46 0 0 0 40 45 q-34 -12 -40 -45 z', 0.07)
      + `<ellipse cx="-30" cy="-162" rx="10" ry="6.5" fill="${pink}" opacity=".8"/><ellipse cx="36" cy="-162" rx="10" ry="6.5" fill="${pink}" opacity=".8"/>`
      + `<ellipse cx="4" cy="-158" rx="17" ry="12" fill="#fff"/>`,
    face: mcEyes(4, -184, 18, 8.5) + `<path d="M-1 -166 q5 -4 10 0 q-5 6 -10 0 z" fill="#ff6f91" ${mcStroke(2.5)}/>` + mcMouths(4, -154, 8),
    armF: arm(12), hand: [17, -66], propScale: 0.9,
  });
}

// NUTTY — the squirrel sidekick (comic relief). Notices trouble FIRST:
// tail puffs up and an orange "notice" spark pops over the trouble.
// Running gag: drops acorns (usually on himself). Signature: "Oof! Nuts!"
function mcNutty(){
  const fur = '#e9772b', belly = '#ffe2bd';
  return mcBiped({
    id: 'nutty', name: 'Nutty', height: 120, shadow: 26, voice: 'nutty',
    pivots: { hipF: [6, -20], hipB: [-6, -20], shF: [12, -58], shB: [-6, -58], neck: [6, -66], earL: [-6, -104], earR: [16, -104] },
    tail: `<path class="mc-tail-fluff" d="M-14 -18 C-70 -10 -78 -70 -50 -96 C-30 -116 -4 -104 -14 -84 C-28 -96 -46 -86 -40 -66 C-34 -46 -6 -46 -14 -18 Z" fill="${fur}" ${mcStroke(4)}/><path d="M-50 -82 C-56 -64 -44 -50 -30 -48" stroke="#ffb37a" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    legB: `<ellipse cx="-6" cy="-8" rx="14" ry="9" fill="${fur}" ${mcStroke(3.5)}/>`,
    legF: `<ellipse cx="12" cy="-8" rx="14" ry="9" fill="${fur}" ${mcStroke(3.5)}/>`,
    armB: mcLimb(-6, -56, -2, -36, 10, fur),
    torso: `<ellipse cx="2" cy="-40" rx="26" ry="32" fill="${fur}" ${mcStroke(4)}/><ellipse cx="8" cy="-36" rx="15" ry="22" fill="${belly}"/>`,
    earL: `<path d="M-12 -100 l4 -22 l12 18 z" fill="${fur}" ${mcStroke(3.5)}/>`,
    earR: `<path d="M10 -102 l8 -22 l8 20 z" fill="${fur}" ${mcStroke(3.5)}/>`,
    head: `<ellipse cx="6" cy="-82" rx="26" ry="23" fill="${fur}" ${mcStroke(4)}/><ellipse cx="18" cy="-74" rx="13" ry="9" fill="${belly}"/>`,
    face: mcEyes(10, -88, 9, 5) + `<ellipse cx="28" cy="-80" rx="4" ry="3.2" fill="${MC_INK}"/>` + mcMouths(20, -70, 5),
    armF: mcLimb(12, -56, 22, -38, 10, fur) + `<g class="mc-prop-acorn"><ellipse cx="26" cy="-34" rx="8" ry="9" fill="#b9773a" ${mcStroke(3)}/><path d="M17 -38 q9 -9 18 0 z" fill="#7a4a22" ${mcStroke(3)}/></g>`,
  });
}

// THE LESSON HERO — each episode's own caped animal hero from the app
// (js/animal-heroes.js). Calm expert: notices first, never lectures.
// Signature: raises one wing/paw and a soft "ding" when something matters.
// Sign-off: "Be safe, be super!"
function mcHeroSvg(topicId, theme){
  if (typeof animalHeroSvg !== 'function') return '';
  return animalHeroSvg(topicId, theme || 'indigo', '', {}).replace(' width="100%" height="100%"', ' x="-90" y="-180" width="180" height="180"');
}

/* ==========================================================================
   GUEST CAST (one or two per episode; reuse when a lesson fits)
   ========================================================================== */

// A grown-up Alex doesn't know. Deliberately ORDINARY and friendly-looking:
// strangers look like anyone else. Never drawn as scary or mean.
function mcGoat(){
  const fur = '#efe3cf', furShade = '#d9c8ad', cardi = '#25a99a', pants = '#c7ae82', shoe = '#6b4a33';
  const leg = (x) => mcLimb(x, -118, x, -18, 30, pants) + `<path d="M${x - 16} -4 q0 -16 16 -16 q22 0 24 12 q1 8 -9 8 z" fill="${shoe}" ${mcStroke(4)}/>`;
  const arm = (sx) => mcLimb(sx, -222, sx + 6, -142, 26, cardi) + `<ellipse cx="${sx + 7}" cy="-134" rx="12" ry="13" fill="${fur}" ${mcStroke(4)}/>`;
  return mcBiped({
    id: 'goat', name: 'Grown-up', height: 400, shadow: 56, voice: 'goat',
    pivots: { hipF: [10, -118], hipB: [-12, -118], shF: [16, -222], shB: [-18, -222], neck: [2, -236], earL: [-30, -292], earR: [34, -292] },
    legB: leg(-12), legF: leg(10), armB: arm(-18),
    torso: `<path d="M-42 -112 q-8 -100 12 -118 q32 -14 64 0 q20 18 12 118 q-44 10 -88 0 z" fill="${cardi}" ${mcStroke(4.5)}/>`
      + `<path d="M-6 -228 l6 18 l6 -18" fill="#fff" ${mcStroke(3)}/><path d="M0 -210 v96" stroke="${MC_INK}" stroke-width="3"/>`
      + [0, 1, 2].map(i => `<circle cx="7" cy="${-196 + i * 28}" r="4" fill="#ffe680" ${mcStroke(2)}/>`).join('')
      + `<rect x="-34" y="-166" width="22" height="18" rx="4" fill="#1f8e81" ${mcStroke(3)}/>`,
    earL: `<ellipse cx="-44" cy="-284" rx="22" ry="9" fill="${fur}" ${mcStroke(4)} transform="rotate(20 -44 -284)"/>`,
    earR: `<ellipse cx="48" cy="-284" rx="22" ry="9" fill="${fur}" ${mcStroke(4)} transform="rotate(-20 48 -284)"/>`,
    head: `<path d="M-22 -318 q-10 -24 -2 -34 q4 16 12 26 z" fill="#b7b0a3" ${mcStroke(3.5)}/><path d="M26 -318 q10 -24 2 -34 q-4 16 -12 26 z" fill="#b7b0a3" ${mcStroke(3.5)}/>`
      + `<path d="M-36 -290 q0 -36 38 -36 q38 0 38 36 v34 q0 30 -38 30 q-38 0 -38 -30 z" fill="${fur}" ${mcStroke(4.5)}/>`
      + mcShade('M-36 -290 q0 -36 38 -36 q-26 8 -26 40 v40 q0 22 22 28 q-34 -2 -34 -30 z', 0.07)
      + `<path d="M-6 -228 q8 22 16 0" fill="#fff" ${mcStroke(3)}/>`,
    face: mcEyes(4, -282, 16, 7)
      + `<circle cx="-12" cy="-282" r="14" fill="none" stroke="#5a3d2b" stroke-width="3.5"/><circle cx="20" cy="-282" r="14" fill="none" stroke="#5a3d2b" stroke-width="3.5"/><path d="M2 -284 h4" stroke="#5a3d2b" stroke-width="3.5"/>`
      + `<ellipse cx="4" cy="-254" rx="9" ry="6" fill="#c9a98a" ${mcStroke(2.5)}/>` + mcMouths(4, -240, 9),
    armF: arm(16), hand: [24, -128],
  });
}

// LIFEGUARD BRUNO — a trusted helper at the pool. Big, warm, calm bear.
function mcBear(){
  const fur = '#b5743f', muzzle = '#f0cfa0', shirt = '#ec3b2e', shorts = '#203a7a';
  const leg = (x) => mcLimb(x, -112, x, -22, 34, fur) + `<rect x="${x - 19}" y="-120" width="38" height="44" rx="10" fill="${shorts}" ${mcStroke(4)}/><path d="M${x - 18} -4 q0 -18 18 -18 q24 0 26 12 q1 8 -9 8 z" fill="#fff" ${mcStroke(4)}/>`;
  const arm = (sx) => mcLimb(sx, -228, sx + 6, -146, 30, fur) + `<rect x="${sx - 17}" y="-238" width="34" height="34" rx="12" fill="${shirt}" ${mcStroke(4)}/><circle cx="${sx + 7}" cy="-138" r="15" fill="${fur}" ${mcStroke(4)}/>`;
  return mcBiped({
    id: 'bear', name: 'Lifeguard Bruno', height: 410, shadow: 62, voice: 'bear',
    pivots: { hipF: [14, -112], hipB: [-16, -112], shF: [26, -226], shB: [-28, -226], neck: [0, -246], earL: [-38, -322], earR: [40, -322] },
    legB: leg(-16), legF: leg(14), armB: arm(-28),
    torso: `<path d="M-52 -104 q-10 -110 14 -128 q38 -16 76 0 q24 18 14 128 q-52 12 -104 0 z" fill="${shirt}" ${mcStroke(4.5)}/>`
      + `<g class="mc-flipfix"><text x="0" y="-160" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="22" fill="#fff">GUARD</text></g>`
      + `<path d="M-22 -232 q22 40 44 0" fill="none" stroke="#ffd23f" stroke-width="5"/><rect x="-6" y="-200" width="14" height="22" rx="4" fill="#ffd23f" ${mcStroke(3)}/>`,
    earL: `<circle cx="-40" cy="-322" r="16" fill="${fur}" ${mcStroke(4)}/><circle cx="-40" cy="-322" r="8" fill="${muzzle}"/>`,
    earR: `<circle cx="42" cy="-322" r="16" fill="${fur}" ${mcStroke(4)}/><circle cx="42" cy="-322" r="8" fill="${muzzle}"/>`,
    head: `<ellipse cx="0" cy="-286" rx="54" ry="48" fill="${fur}" ${mcStroke(4.5)}/>`
      + mcShade('M-54 -286 a54 48 0 0 0 44 47 q-38 -14 -44 -47 z', 0.08)
      + `<ellipse cx="6" cy="-266" rx="26" ry="19" fill="${muzzle}" ${mcStroke(3.5)}/>`
      + `<path d="M-52 -312 q52 -26 104 0 l-4 10 q-48 -20 -96 0 z" fill="#fff" ${mcStroke(3.5)}/><path d="M18 -306 q34 -6 50 8 q-22 4 -46 2 z" fill="#fff" ${mcStroke(3.5)}/>`,
    face: mcEyes(6, -292, 18, 7) + `<ellipse cx="8" cy="-274" rx="9" ry="6.5" fill="${MC_INK}"/>` + mcMouths(8, -258, 10),
    armF: arm(26),
  });
}

/* ==========================================================================
   PROPS + MOTIFS
   ========================================================================== */

// The orange "notice this" spark: pops over whatever the viewer should notice.
function mcSparkSvg(){
  return `<g class="mc-spark"><circle r="34" fill="#ff8a00" opacity=".22"/>`
    + `<path d="M0 -30 L8 -9 L30 -8 L12 6 L19 28 L0 15 L-19 28 L-12 6 L-30 -8 L-8 -9 Z" fill="#ff9d1c" ${mcStroke(4)}/>`
    + `<text x="0" y="9" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="26" fill="#fff">!</text></g>`;
}
function mcCar(color){ // an ordinary parked car (soft, friendly, nothing menacing)
  color = color || '#8ec5ff';
  return `<g class="mc-car">`
    + `<path d="M-150 -40 q0 -40 40 -46 l40 -50 q10 -12 30 -12 h90 q20 0 30 14 l34 46 q46 4 46 48 v22 h-310 z" fill="${color}" ${mcStroke(5)}/>`
    + `<path d="M-62 -90 l30 -40 q6 -8 18 -8 h40 v48 z" fill="#d9f1ff" ${mcStroke(4)}/><path d="M38 -90 v-48 h30 q10 0 16 8 l28 40 z" fill="#d9f1ff" ${mcStroke(4)}/>`
    + `<path d="M-40 -126 l18 -10" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`
    + `<circle cx="-86" cy="-16" r="30" fill="#3a3a44" ${mcStroke(4)}/><circle cx="-86" cy="-16" r="13" fill="#dfe6ee"/>`
    + `<circle cx="90" cy="-16" r="30" fill="#3a3a44" ${mcStroke(4)}/><circle cx="90" cy="-16" r="13" fill="#dfe6ee"/>`
    + `<ellipse cx="150" cy="-56" rx="9" ry="7" fill="#fff6b0" ${mcStroke(3)}/><path d="M-10 -78 h18" ${mcStroke(4)}/></g>`;
}

// Sound motifs (Web Audio, no files): the 3-note "notice" sting, the warm
// safe chime, plus comedy sounds. All gentle and short.
const MovieSfx = (() => {
  let ctx = null;
  const ac = () => { if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); } if (ctx.state === 'suspended') ctx.resume(); return ctx; };
  function tone(f, t0, d, type, vol, slideTo){
    const c = ac(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0;
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + d + 0.05);
  }
  function noise(t0, d, vol, f0, f1){
    const c = ac(); if (!c) return;
    const n = c.createBufferSource(), b = c.createBuffer(1, c.sampleRate * d, c.sampleRate), x = b.getChannelData(0);
    for (let i = 0; i < x.length; i++) x[i] = Math.random() * 2 - 1;
    const f = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime + t0;
    f.type = 'bandpass'; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + d); f.Q.value = 1.2;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    n.buffer = b; n.connect(f).connect(g).connect(c.destination); n.start(t);
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
    rewind(){ noise(0, 1.1, 0.12, 3000, 500); for (let i = 0; i < 9; i++) tone(900 - i * 50, i * 0.11, 0.08, 'square', 0.03); },
    sparkle(){ [1319, 1568, 1760, 2093, 2637].forEach((f, i) => tone(f, i * 0.07, 0.5, 'sine', 0.07)); },
    step(){ noise(0, 0.07, 0.05, 600, 300); },
    unlock(){ ac(); },
  };
})();

const MOVIE_CAST = { alex: mcAlex, nutty: mcNutty, goat: mcGoat, bear: mcBear };
