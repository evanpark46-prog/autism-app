/* ==========================================================================
   Safety Superheroes — the research-based hero games
     hero-route.html   Hero Route        (watch the hero, then your turn)
     spot-danger.html  Spot the Danger   (find what could hurt you)
     help-call.html    Practice 911 Call (role-play an emergency call)
   Content lives in js/hero-games-data.js. Everything is no-fail: a wrong
   tap explains why and points to the safe choice, so every round ends on
   success (errorless learning). Progress: localStorage safetylib_herogames_v1.
   ========================================================================== */

const HG_UI = {
  en: {
    route_title: 'Hero Route', route_lead: 'Go on a trip with your hero. Watch the hero do it first, then it’s your turn!',
    danger_title: 'Spot the Danger', danger_lead: 'Look closely! Tap the things that could hurt you.',
    call_title: 'Practice 911 Call', call_lead: 'Practice what to say when you call for help. This is pretend — it does not call anyone.',
    watch: '👀 Watch the hero first', myturn: '▶ My turn', your_turn: 'Your turn!', again: '🔁 Play again',
    back: '← All games', back_list: '← Back', next: 'Next ▶', finish: 'Finish 🏁', read: '🔊 Read to me',
    watching: 'Watch the hero', hero_picks: 'The hero picks the safe choice:', think_again: 'Let’s think again.',
    try_glow: 'Try the glowing choice.', correct: 'Yes! That’s the safe choice.', done_badge: '✓ Done',
    route_done: 'Route complete!', steps: 'Stop {n} of {total}',
    look_left: '👈 Look left', look_right: '👉 Look right', cross: '🚶 Cross now', looked: 'Looked:',
    cross_need_look: 'First look left, look right, then look left again.',
    cross_hand: 'Wait! The red hand means stop. Wait for the walking person.',
    cross_car: 'Wait! A car is coming. Wait until the road is empty.',
    cross_ok: 'You waited for the walking person and looked both ways. Safe crossing!',
    cross_demo: 'I wait for the walking person. I look left, right, and left again. No cars. Now I cross.',
    sign_walk: 'Walk', sign_stop: 'Stop',
    rule_title: 'When you see danger:', rule1: '✋ Don’t touch', rule2: '🚶 Move away', rule3: '🗣️ Tell a grown-up',
    found: 'Found {n} of {total}', hint: '💡 Hint', danger_word: 'Danger!', safe_word: 'That’s safe.',
    all_found: 'You found them all! Super hero eyes!', next_room: 'Next place ▶',
    practice_banner: '🎭 This is practice. Only call 911 for a real emergency.',
    dial_prompt: 'Call for help. Dial 9, 1, 1.', dial_hint: 'Press 9, then 1, then 1.', call_btn: 'Call', ringing: 'Ringing…',
    you_say: 'What do you say?', dispatcher: '911 helper', you: 'You',
    say_address: 'Now say your address out loud. 🗣️', said_it: 'I said it!',
    adult_note: 'Grown-ups: practice your child’s full name and address together.',
    call_done: 'Great practice call!', call_tips: 'Say what happened · Say where you are · Say your name · Stay on the phone',
    pick_call: 'Pick a practice call', delete: 'Delete',
  },
  es: {
    route_title: 'Ruta de héroe', route_lead: 'Sal de paseo con tu héroe. Primero mira cómo lo hace el héroe, ¡y luego te toca a ti!',
    danger_title: 'Encuentra el peligro', danger_lead: '¡Mira bien! Toca las cosas que te pueden lastimar.',
    call_title: 'Practica llamar al 911', call_lead: 'Practica qué decir cuando llamas para pedir ayuda. Es de mentiritas: no llama a nadie.',
    watch: '👀 Primero mira al héroe', myturn: '▶ Me toca', your_turn: '¡Te toca!', again: '🔁 Jugar otra vez',
    back: '← Todos los juegos', back_list: '← Volver', next: 'Siguiente ▶', finish: 'Terminar 🏁', read: '🔊 Léemelo',
    watching: 'Mira al héroe', hero_picks: 'El héroe elige la opción segura:', think_again: 'Pensemos otra vez.',
    try_glow: 'Prueba la opción que brilla.', correct: '¡Sí! Esa es la opción segura.', done_badge: '✓ Hecho',
    route_done: '¡Ruta completa!', steps: 'Parada {n} de {total}',
    look_left: '👈 Mirar a la izquierda', look_right: '👉 Mirar a la derecha', cross: '🚶 Cruzar ahora', looked: 'Miraste:',
    cross_need_look: 'Primero mira a la izquierda, a la derecha y otra vez a la izquierda.',
    cross_hand: '¡Espera! La mano roja significa alto. Espera a la persona caminando.',
    cross_car: '¡Espera! Viene un carro. Espera a que la calle esté vacía.',
    cross_ok: 'Esperaste a la persona caminando y miraste a los dos lados. ¡Cruzaste seguro!',
    cross_demo: 'Espero a la persona caminando. Miro a la izquierda, a la derecha y otra vez a la izquierda. No hay carros. Ahora cruzo.',
    sign_walk: 'Siga', sign_stop: 'Alto',
    rule_title: 'Cuando veas un peligro:', rule1: '✋ No lo toques', rule2: '🚶 Aléjate', rule3: '🗣️ Avisa a un adulto',
    found: 'Encontraste {n} de {total}', hint: '💡 Pista', danger_word: '¡Peligro!', safe_word: 'Eso es seguro.',
    all_found: '¡Los encontraste todos! ¡Ojos de superhéroe!', next_room: 'Siguiente lugar ▶',
    practice_banner: '🎭 Esto es práctica. Solo llama al 911 en una emergencia de verdad.',
    dial_prompt: 'Llama para pedir ayuda. Marca 9, 1, 1.', dial_hint: 'Oprime 9, luego 1, luego 1.', call_btn: 'Llamar', ringing: 'Sonando…',
    you_say: '¿Qué dices?', dispatcher: 'Ayudante del 911', you: 'Tú',
    say_address: 'Ahora di tu dirección en voz alta. 🗣️', said_it: '¡Ya lo dije!',
    adult_note: 'Adultos: practiquen juntos el nombre completo y la dirección del niño.',
    call_done: '¡Muy buena llamada de práctica!', call_tips: 'Di qué pasó · Di dónde estás · Di tu nombre · Quédate en el teléfono',
    pick_call: 'Elige una llamada de práctica', delete: 'Borrar',
  },
};

function hgT(key, vars){
  const lang = getLang();
  let s = (HG_UI[lang] && HG_UI[lang][key]) || HG_UI.en[key] || key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
  return s;
}

const HG_KEY = 'safetylib_herogames_v1';
function hgProgress(){
  try { return JSON.parse(localStorage.getItem(HG_KEY)) || {}; } catch (e){ return {}; }
}
function hgMark(game, id){
  try {
    const p = hgProgress();
    p[game] = p[game] || {};
    p[game][id] = (p[game][id] || 0) + 1;
    localStorage.setItem(HG_KEY, JSON.stringify(p));
  } catch (e){}
}
function hgDone(game, id){ const p = hgProgress(); return !!(p[game] && p[game][id]); }

function hgSay(text, onDone){
  if (typeof SPEECH_SUPPORTED === 'undefined' || !SPEECH_SUPPORTED || !text){ if (onDone) onDone(); return; }
  speakQueue(text, voiceProfileFor('Narrator'), { done: onDone });
}
function hgStop(){ if (typeof stopSpeaking === 'function') stopSpeaking(); }
function hgAutoRead(){ return typeof isAutoRead === 'function' && isAutoRead(); }
function hgDing(){ if (typeof playCorrectDing === 'function') playCorrectDing(); }
function hgCheer(){ if (typeof playCompletionChime === 'function') playCompletionChime(); }

function hgHero(topicId, size){
  const meta = typeof getTopicMeta === 'function' ? getTopicMeta(topicId) : null;
  if (!meta || typeof heroPortraitHtml !== 'function') return '<span class="hg-hero-fallback" aria-hidden="true">🦸</span>';
  return heroPortraitHtml(topicId, getLang(), meta.theme, size || 64);
}

function hgTopBar(backHref){
  return `<div class="hg-toolbar">${backHref ? `<a class="hg-back" href="${backHref}">${escapeHtml(hgT('back'))}</a>` : `<button type="button" class="hg-back" data-hg-list>${escapeHtml(hgT('back_list'))}</button>`}</div>`;
}

function hgShelf(root, title, lead, items, game, open){
  root.innerHTML = `
    ${hgTopBar('games.html')}
    <section class="hg-head">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(lead)}</p>
    </section>
    <ul class="hg-shelf">
      ${items.map(it => `
        <li><button type="button" class="hg-tile ${hgDone(game, it.id) ? 'is-done' : ''}" data-hg-open="${escapeHtml(it.id)}">
          <span class="hg-tile__hero">${hgHero(it.hero || 'emergency-safety', 56)}</span>
          <span class="hg-tile__emoji" aria-hidden="true">${it.emoji}</span>
          <span class="hg-tile__title">${escapeHtml(it.title)}</span>
          ${it.blurb ? `<span class="hg-tile__blurb">${escapeHtml(it.blurb)}</span>` : ''}
          ${hgDone(game, it.id) ? `<span class="hg-tile__done">${escapeHtml(hgT('done_badge'))}</span>` : ''}
        </button></li>`).join('')}
    </ul>`;
  root.querySelectorAll('[data-hg-open]').forEach(b => b.addEventListener('click', () => open(b.dataset.hgOpen)));
}

// A choice question that can't be failed: wrong taps explain and make the
// safe answer glow; the safe answer shows its reason and calls onRight.
function hgChoices(box, choices, opts){
  opts = opts || {};
  const order = choices.map((c, i) => i);
  if (!opts.keepOrder){
    for (let i = order.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  }
  box.innerHTML = `
    <div class="hg-choices">${order.map(i => `<button type="button" class="hg-choice" data-hg-choice="${i}">${escapeHtml(choices[i].t)}</button>`).join('')}</div>
    <div class="hg-feedback" aria-live="polite"></div>`;
  const fb = box.querySelector('.hg-feedback');
  const btns = [...box.querySelectorAll('[data-hg-choice]')];
  const right = btns.find(b => choices[+b.dataset.hgChoice].ok);
  const pick = btn => {
    const c = choices[+btn.dataset.hgChoice];
    if (c.ok){
      btns.forEach(b => { b.disabled = true; b.classList.remove('is-glow'); });
      btn.classList.add('is-right');
      fb.className = 'hg-feedback hg-feedback--right';
      fb.innerHTML = `<strong>✅ ${escapeHtml(hgT('correct'))}</strong> ${escapeHtml(c.why)}`;
      hgDing();
      hgSay(c.why);
      if (opts.onRight) opts.onRight(c);
    } else {
      btn.disabled = true;
      btn.classList.add('is-wrong');
      if (right) right.classList.add('is-glow');
      fb.className = 'hg-feedback hg-feedback--think';
      fb.innerHTML = `<strong>🤔 ${escapeHtml(hgT('think_again'))}</strong> ${escapeHtml(c.why)} <em>${escapeHtml(hgT('try_glow'))}</em>`;
      hgSay(c.why);
    }
  };
  btns.forEach(b => b.addEventListener('click', () => pick(b)));
  if (opts.demo && right){
    // Watch mode: the hero "taps" the safe choice for the learner.
    btns.forEach(b => { b.disabled = true; });
    right.classList.add('is-demo');
    const c = choices[+right.dataset.hgChoice];
    fb.className = 'hg-feedback hg-feedback--right';
    fb.innerHTML = `<strong>🦸 ${escapeHtml(hgT('hero_picks'))}</strong> “${escapeHtml(c.t)}” ${escapeHtml(c.why)}`;
  }
}

/* ======================================================================
   Hero Route
   ====================================================================== */

let routeState = null;

function initHeroRoutePage(){
  const root = document.querySelector('[data-hg-root]');
  if (!root) return;
  const showList = () => {
    hgStop(); routeState = null;
    hgShelf(root, hgT('route_title'), hgT('route_lead'), HERO_ROUTES[getLang()], 'route', id => routeIntro(root, id));
  };
  root.addEventListener('click', e => { if (e.target.closest('[data-hg-list]')) showList(); });
  window.addEventListener('safetylib:langchange', showList);
  const want = new URLSearchParams(location.search).get('r');
  if (want && HERO_ROUTES[getLang()].some(r => r.id === want)) routeIntro(root, want); else showList();
}

function routeById(id){ return HERO_ROUTES[getLang()].find(r => r.id === id); }

function routeIntro(root, id){
  const r = routeById(id);
  hgStop();
  root.innerHTML = `
    ${hgTopBar()}
    <section class="hg-card hg-intro">
      <div class="hg-intro__hero">${hgHero(r.hero, 110)}</div>
      <h1>${r.emoji} ${escapeHtml(r.title)}</h1>
      <p>${escapeHtml(r.blurb)}</p>
      <div class="hg-actions">
        <button type="button" class="btn btn-secondary btn-lg" data-hg-watch>${escapeHtml(hgT('watch'))}</button>
        <button type="button" class="btn btn-primary btn-lg" data-hg-play>${escapeHtml(hgT('myturn'))}</button>
      </div>
    </section>`;
  root.querySelector('[data-hg-watch]').addEventListener('click', () => routeStart(root, id, true));
  root.querySelector('[data-hg-play]').addEventListener('click', () => routeStart(root, id, false));
}

function routeStart(root, id, demo){
  routeState = { id, demo, step: 0 };
  routeRender(root);
}

function routePathHtml(r, at){
  const n = r.steps.length;
  const pct = i => (n ? (i / n) * 100 : 0);
  return `
    <div class="hg-path" role="img" aria-label="${escapeHtml(hgT('steps', { n: Math.min(at + 1, n), total: n }))}">
      <div class="hg-path__line"></div>
      ${r.steps.map((s, i) => `<span class="hg-path__stop ${i < at ? 'is-done' : ''} ${i === at ? 'is-now' : ''}" style="left:${pct(i)}%"></span>`).join('')}
      <span class="hg-path__flag" style="left:100%" aria-hidden="true">🏁</span>
      <span class="hg-path__hero" style="left:${pct(at)}%">${hgHero(r.hero, 44)}</span>
    </div>`;
}

function routeRender(root){
  const st = routeState;
  const r = routeById(st.id);
  if (!r) return;
  hgStop();
  if (st.step >= r.steps.length){ routeFinish(root, r); return; }
  const step = r.steps[st.step];
  const isLast = st.step === r.steps.length - 1;
  root.innerHTML = `
    ${hgTopBar()}
    <section class="hg-card hg-route ${st.demo ? 'is-demo' : ''}">
      <div class="hg-route__top">
        <p class="hg-kicker">${st.demo ? `👀 ${escapeHtml(hgT('watching'))} · ` : ''}${escapeHtml(hgT('steps', { n: st.step + 1, total: r.steps.length }))}</p>
        <button type="button" class="hg-read" data-hg-read>${escapeHtml(hgT('read'))}</button>
      </div>
      ${routePathHtml(r, st.step)}
      ${step.type === 'cross' ? '' : `<div class="hg-scene" aria-hidden="true">${step.scene}</div>`}
      <p class="hg-say">${escapeHtml(step.say)}</p>
      ${step.prompt ? `<h2 class="hg-prompt">${escapeHtml(step.prompt)}</h2>` : ''}
      <div data-hg-step></div>
      <div class="hg-actions hg-next" hidden><button type="button" class="btn btn-primary btn-lg" data-hg-next>${escapeHtml(isLast ? hgT('finish') : hgT('next'))}</button></div>
    </section>`;
  const box = root.querySelector('[data-hg-step]');
  const nextWrap = root.querySelector('.hg-next');
  const showNext = () => { nextWrap.hidden = false; };
  root.querySelector('[data-hg-next]').addEventListener('click', () => { st.step += 1; routeRender(root); });
  const readText = [step.say, step.prompt].filter(Boolean).join(' ');
  root.querySelector('[data-hg-read]').addEventListener('click', () => hgSay(readText));

  if (step.type === 'cross'){
    crossGame(box, { demo: st.demo, onDone: showNext });
    if (!st.demo && hgAutoRead()) hgSay(step.say);
    return;
  }
  if (st.demo){
    hgChoices(box, step.choices, { demo: true });
    const right = step.choices.find(c => c.ok);
    hgSay(`${readText} ${right.t} ${right.why}`);
    showNext();
  } else {
    hgChoices(box, step.choices, { onRight: showNext });
    if (hgAutoRead()) hgSay(readText);
  }
}

function routeFinish(root, r){
  const wasDemo = routeState.demo;
  if (!wasDemo) hgMark('route', r.id);
  hgCheer();
  root.innerHTML = `
    ${hgTopBar()}
    <section class="hg-card hg-done">
      ${routePathHtml(r, r.steps.length)}
      <div class="hg-burst" aria-hidden="true">🎉</div>
      <h1>${escapeHtml(wasDemo ? hgT('your_turn') : hgT('route_done'))}</h1>
      <p class="hg-say">${escapeHtml(r.end)}</p>
      <div class="hg-actions">
        ${wasDemo
          ? `<button type="button" class="btn btn-primary btn-lg" data-hg-play>${escapeHtml(hgT('myturn'))}</button>`
          : `<button type="button" class="btn btn-secondary" data-hg-play>${escapeHtml(hgT('again'))}</button>
             <button type="button" class="btn btn-primary btn-lg" data-hg-list>${escapeHtml(hgT('back_list'))}</button>`}
      </div>
    </section>`;
  hgSay(wasDemo ? hgT('your_turn') : r.end);
  root.querySelector('[data-hg-play]').addEventListener('click', () => routeStart(root, r.id, false));
}

/* ---------- the street-crossing challenge ----------
   A walk sign cycles between the red hand and the walking person, and cars
   drive past while the hand is showing (plus, sometimes, one turning car
   right as the walk sign comes on -- so looking still matters). Crossing
   counts only after looking left, right, left, with the walk sign on and an
   empty road. */
function crossGame(box, opts){
  const calm = document.documentElement.getAttribute('data-calm-mode') === 'on';
  box.innerHTML = `
    <div class="hg-street" data-hg-street>
      <div class="hg-street__sign" data-hg-sign><span class="hg-sign__icon">✋</span><span class="hg-sign__word"></span></div>
      <div class="hg-street__walk-top"></div>
      <div class="hg-street__road"><div class="hg-street__zebra"></div><div class="hg-street__cars" data-hg-cars></div></div>
      <div class="hg-street__walk-bottom"><span class="hg-street__kid" data-hg-kid>${hgHero('street-safety', 46)}</span></div>
      <div class="hg-street__eyes" data-hg-eyes aria-hidden="true"></div>
    </div>
    <p class="hg-looked">${escapeHtml(hgT('looked'))} <span data-hg-looks></span></p>
    <div class="hg-choices hg-choices--row">
      <button type="button" class="hg-choice" data-hg-look="L">${escapeHtml(hgT('look_left'))}</button>
      <button type="button" class="hg-choice" data-hg-look="R">${escapeHtml(hgT('look_right'))}</button>
      <button type="button" class="hg-choice hg-choice--go" data-hg-cross>${escapeHtml(hgT('cross'))}</button>
    </div>
    <div class="hg-feedback" aria-live="polite"></div>`;
  const street = box.querySelector('[data-hg-street]');
  const sign = box.querySelector('[data-hg-sign]');
  const carsEl = box.querySelector('[data-hg-cars]');
  const looksEl = box.querySelector('[data-hg-looks]');
  const eyes = box.querySelector('[data-hg-eyes]');
  const fb = box.querySelector('.hg-feedback');
  const btns = [...box.querySelectorAll('button')];
  let walk = false, looks = [], done = false, cars = 0, firstWalk = true;
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); if (box.isConnected && !done) fn(); }, ms); timers.add(id); return id; };
  const carMs = calm ? 3200 : 2400;

  const setSign = w => {
    walk = w;
    sign.classList.toggle('is-walk', w);
    sign.querySelector('.hg-sign__icon').textContent = w ? '🚶' : '✋';
    sign.querySelector('.hg-sign__word').textContent = w ? hgT('sign_walk') : hgT('sign_stop');
  };
  const spawnCar = fromRight => {
    const car = document.createElement('span');
    car.className = 'hg-car' + (fromRight ? ' hg-car--rtl' : '');
    car.textContent = ['🚗', '🚙', '🚌', '🚕', '🚚'][Math.floor(Math.random() * 5)];
    car.style.animationDuration = carMs + 'ms';
    carsEl.appendChild(car);
    cars += 1;
    const id = setTimeout(() => { timers.delete(id); car.remove(); cars -= 1; }, carMs);
    timers.add(id);
  };
  // Signal cycle: ~5 s hand (cars driving), ~7 s walk.
  const handPhase = () => {
    setSign(false);
    later(() => spawnCar(false), 300);
    later(() => spawnCar(true), 1700);
    later(() => spawnCar(false), 3100);
    later(walkPhase, 3100 + carMs + 200);
  };
  const walkPhase = () => {
    setSign(true);
    if (firstWalk || Math.random() < 0.4) later(() => spawnCar(Math.random() < 0.5), 150); // a turning car
    firstWalk = false;
    later(handPhase, 7500);
  };
  const showLooks = () => {
    looksEl.textContent = looks.map(l => (l === 'L' ? '👈' : '👉')).join(' ') || '—';
  };
  const lookOk = () => looks.slice(-3).join('') === 'LRL';
  const look = dir => {
    looks.push(dir); if (looks.length > 6) looks.shift();
    showLooks();
    eyes.textContent = dir === 'L' ? '👀⬅️' : '➡️👀';
    eyes.className = 'hg-street__eyes is-' + dir;
    later(() => { eyes.textContent = ''; }, 900);
  };
  const say = (cls, msg) => { fb.className = 'hg-feedback ' + cls; fb.textContent = msg; hgSay(msg); };
  const tryCross = () => {
    if (!lookOk()){ say('hg-feedback--think', hgT('cross_need_look')); return false; }
    if (!walk){ say('hg-feedback--think', hgT('cross_hand')); looks = []; showLooks(); return false; }
    if (cars > 0){ say('hg-feedback--think', hgT('cross_car')); looks = []; showLooks(); return false; }
    done = true;
    timers.forEach(clearTimeout); timers.clear();
    btns.forEach(b => { b.disabled = true; });
    street.classList.add('is-crossing');
    hgDing();
    fb.className = 'hg-feedback hg-feedback--right';
    fb.innerHTML = `<strong>✅</strong> ${escapeHtml(hgT('cross_ok'))}`;
    hgSay(hgT('cross_ok'));
    if (opts.onDone) setTimeout(opts.onDone, 1200);
    return true;
  };
  box.querySelectorAll('[data-hg-look]').forEach(b => b.addEventListener('click', () => look(b.dataset.hgLook)));
  box.querySelector('[data-hg-cross]').addEventListener('click', tryCross);
  showLooks();
  handPhase();

  if (opts.demo){
    // The hero models it: wait for walk + empty road, look L-R-L, then cross.
    btns.forEach(b => { b.disabled = true; });
    hgSay(hgT('cross_demo'));
    const press = sel => { const b = box.querySelector(sel); if (b){ b.classList.add('is-demo'); setTimeout(() => b.classList.remove('is-demo'), 600); } };
    const waitClear = () => {
      if (done || !box.isConnected) return;
      if (!(walk && cars === 0)){ later(waitClear, 300); return; }
      press('[data-hg-look="L"]'); look('L');
      later(() => { press('[data-hg-look="R"]'); look('R'); }, 900);
      later(() => { press('[data-hg-look="L"]'); look('L'); }, 1800);
      later(() => {
        if (walk && cars === 0){ press('[data-hg-cross]'); tryCross(); }
        else { looks = []; showLooks(); later(waitClear, 300); }
      }, 2700);
    };
    later(waitClear, 400);
  }
}

/* ======================================================================
   Spot the Danger
   ====================================================================== */

function initSpotDangerPage(){
  const root = document.querySelector('[data-hg-root]');
  if (!root) return;
  const showList = () => {
    hgStop();
    hgShelf(root, hgT('danger_title'), hgT('danger_lead'), DANGER_SCENES[getLang()].map(s => Object.assign({ blurb: s.intro }, s)), 'danger', id => dangerPlay(root, id));
  };
  root.addEventListener('click', e => { if (e.target.closest('[data-hg-list]')) showList(); });
  window.addEventListener('safetylib:langchange', showList);
  const want = new URLSearchParams(location.search).get('s');
  if (want && DANGER_SCENES[getLang()].some(s => s.id === want)) dangerPlay(root, want); else showList();
}

function dangerPlay(root, id){
  hgStop();
  const scenes = DANGER_SCENES[getLang()];
  const idx = scenes.findIndex(s => s.id === id);
  const sc = scenes[idx];
  const dangers = sc.items.filter(i => i.danger);
  const found = new Set();
  root.innerHTML = `
    ${hgTopBar()}
    <section class="hg-card hg-danger">
      <div class="hg-route__top">
        <p class="hg-kicker">${sc.emoji} ${escapeHtml(sc.title)}</p>
        <button type="button" class="hg-read" data-hg-read>${escapeHtml(hgT('read'))}</button>
      </div>
      <p class="hg-say">${escapeHtml(sc.intro)}</p>
      <ul class="hg-rule" aria-label="${escapeHtml(hgT('rule_title'))}">
        <li>${escapeHtml(hgT('rule1'))}</li><li>${escapeHtml(hgT('rule2'))}</li><li>${escapeHtml(hgT('rule3'))}</li>
      </ul>
      <div class="hg-room ${sc.screen ? 'hg-room--screen' : ''}" style="--wall:${sc.wall};--floor:${sc.floor}">
        ${sc.items.map((it, i) => `
          <button type="button" class="hg-item ${it.label ? 'hg-item--msg' : ''}" data-hg-item="${i}" style="left:${it.x}%;top:${it.y}%" aria-label="${escapeHtml(it.name)}">
            <span class="hg-item__e" aria-hidden="true">${it.e}</span>${it.label ? `<span class="hg-item__label">${escapeHtml(it.label)}</span>` : ''}
          </button>`).join('')}
      </div>
      <div class="hg-danger__bar">
        <p class="hg-count" data-hg-count></p>
        <button type="button" class="btn btn-secondary" data-hg-hint>${escapeHtml(hgT('hint'))}</button>
      </div>
      <div class="hg-feedback" aria-live="polite"></div>
      <div data-hg-end></div>
    </section>`;
  const fb = root.querySelector('.hg-feedback');
  const count = root.querySelector('[data-hg-count]');
  const showCount = () => { count.textContent = `⚠️ ${hgT('found', { n: found.size, total: dangers.length })}`; };
  showCount();
  root.querySelector('[data-hg-read]').addEventListener('click', () => hgSay(`${sc.intro} ${hgT('rule_title')} ${hgT('rule1')}. ${hgT('rule2')}. ${hgT('rule3')}.`));
  if (hgAutoRead()) hgSay(sc.intro);
  const items = [...root.querySelectorAll('[data-hg-item]')];
  items.forEach(btn => btn.addEventListener('click', () => {
    const it = sc.items[+btn.dataset.hgItem];
    items.forEach(b => b.classList.remove('is-hint'));
    if (it.danger){
      btn.classList.add('is-danger');
      if (!found.has(it)){ found.add(it); hgDing(); }
      fb.className = 'hg-feedback hg-feedback--danger';
      fb.innerHTML = `<strong>⚠️ ${escapeHtml(hgT('danger_word'))} ${escapeHtml(it.name)}.</strong> ${escapeHtml(it.tip)}`;
      hgSay(`${it.name}. ${it.tip}`);
    } else {
      btn.classList.add('is-safe');
      fb.className = 'hg-feedback hg-feedback--right';
      fb.innerHTML = `<strong>✅ ${escapeHtml(it.name)}.</strong> ${escapeHtml(it.tip)}`;
      hgSay(`${it.name}. ${it.tip}`);
    }
    showCount();
    if (found.size === dangers.length) dangerFinish(root, sc, scenes[idx + 1]);
  }));
  root.querySelector('[data-hg-hint]').addEventListener('click', () => {
    const left = items.find(b => { const it = sc.items[+b.dataset.hgItem]; return it.danger && !found.has(it); });
    if (left){ left.classList.remove('is-hint'); void left.offsetWidth; left.classList.add('is-hint'); }
  });
}

function dangerFinish(root, sc, nextScene){
  hgMark('danger', sc.id);
  root.querySelector('[data-hg-hint]').hidden = true;
  const end = root.querySelector('[data-hg-end]');
  end.innerHTML = `
    <div class="hg-win">
      <div class="hg-burst" aria-hidden="true">🦸‍♀️🎉</div>
      <h2>${escapeHtml(hgT('all_found'))}</h2>
      <ul class="hg-recap">${sc.items.filter(i => i.danger).map(i => `<li><span aria-hidden="true">${i.e}</span> <strong>${escapeHtml(i.name)}:</strong> ${escapeHtml(i.tip)}</li>`).join('')}</ul>
      <div class="hg-actions">
        <button type="button" class="btn btn-secondary" data-hg-list>${escapeHtml(hgT('back_list'))}</button>
        ${nextScene ? `<button type="button" class="btn btn-primary btn-lg" data-hg-nextscene>${escapeHtml(hgT('next_room'))}</button>` : ''}
      </div>
    </div>`;
  setTimeout(() => { hgCheer(); hgSay(hgT('all_found')); }, 1400);
  const nb = end.querySelector('[data-hg-nextscene]');
  if (nb) nb.addEventListener('click', () => dangerPlay(root, nextScene.id));
  end.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ======================================================================
   Practice 911 Call
   ====================================================================== */

function initHelpCallPage(){
  const root = document.querySelector('[data-hg-root]');
  if (!root) return;
  const showList = () => {
    hgStop();
    hgShelf(root, hgT('call_title'), hgT('call_lead'), HELP_CALLS[getLang()].map(c => Object.assign({ hero: 'emergency-safety', blurb: c.situation }, c)), 'call', id => callPlay(root, id));
    root.querySelector('.hg-head').insertAdjacentHTML('beforeend', `<p class="hg-banner">${escapeHtml(hgT('practice_banner'))}</p>`);
  };
  root.addEventListener('click', e => { if (e.target.closest('[data-hg-list]')) showList(); });
  window.addEventListener('safetylib:langchange', showList);
  const want = new URLSearchParams(location.search).get('c');
  if (want && HELP_CALLS[getLang()].some(c => c.id === want)) callPlay(root, want); else showList();
}

function callTone(){
  // Two soft phone rings (WebAudio, no sound files).
  try {
    const ctx = typeof getSharedAudioCtx === 'function' ? getSharedAudioCtx() : new (window.AudioContext || window.webkitAudioContext)();
    if (!ctx) return;
    [0, 1.2].forEach(t0 => {
      const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 440; o2.frequency.value = 480;
      g.gain.setValueAtTime(0, ctx.currentTime + t0);
      g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + t0 + 0.05);
      g.gain.setValueAtTime(0.06, ctx.currentTime + t0 + 0.8);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + t0 + 0.9);
      o.connect(g); o2.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime + t0); o2.start(ctx.currentTime + t0);
      o.stop(ctx.currentTime + t0 + 1); o2.stop(ctx.currentTime + t0 + 1);
    });
  } catch (e){}
}

function callPlay(root, id){
  hgStop();
  const call = HELP_CALLS[getLang()].find(c => c.id === id);
  const script = HELP_CALL_SCRIPT[getLang()].map(q => Object.assign({}, q, { choices: q.choices.map(c => Object.assign({}, c, { t: c.t.replace('{what}', call.what) })) }));
  root.innerHTML = `
    ${hgTopBar()}
    <section class="hg-card hg-call">
      <p class="hg-banner">${escapeHtml(hgT('practice_banner'))}</p>
      <div class="hg-call__situation">
        <span class="hg-scene hg-scene--sm" aria-hidden="true">${call.emoji}</span>
        <p class="hg-say">${escapeHtml(call.situation)}</p>
        <button type="button" class="hg-read" data-hg-read>${escapeHtml(hgT('read'))}</button>
      </div>
      <div class="hg-phone" data-hg-phone>
        <div class="hg-phone__screen">
          <div class="hg-phone__digits" data-hg-digits aria-live="polite"></div>
          <div class="hg-phone__chat" data-hg-chat aria-live="polite"></div>
        </div>
        <div data-hg-pad></div>
      </div>
      <div data-hg-answer></div>
    </section>`;
  const readSituation = () => hgSay(`${call.situation} ${hgT('dial_prompt')}`);
  root.querySelector('[data-hg-read]').addEventListener('click', readSituation);
  readSituation();
  const digitsEl = root.querySelector('[data-hg-digits]');
  const chat = root.querySelector('[data-hg-chat]');
  const pad = root.querySelector('[data-hg-pad]');
  const answer = root.querySelector('[data-hg-answer]');
  const target = '911';
  let typed = '';
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  pad.innerHTML = `
    <p class="hg-phone__hint">${escapeHtml(hgT('dial_prompt'))}</p>
    <div class="hg-keypad">${keys.map(k => `<button type="button" class="hg-key" data-hg-key="${k}">${k}</button>`).join('')}</div>
    <button type="button" class="hg-callbtn" data-hg-call disabled>📞 ${escapeHtml(hgT('call_btn'))}</button>`;
  const hintNext = () => {
    pad.querySelectorAll('.hg-key').forEach(b => b.classList.toggle('is-next', typed.length < 3 && b.dataset.hgKey === target[typed.length]));
  };
  const callBtn = pad.querySelector('[data-hg-call]');
  pad.querySelectorAll('[data-hg-key]').forEach(b => b.addEventListener('click', () => {
    if (typed.length >= 3) return;
    const k = b.dataset.hgKey;
    if (k === target[typed.length]){
      typed += k;
      digitsEl.textContent = typed;
      if (typed === target){ callBtn.disabled = false; callBtn.classList.add('is-ready'); }
    } else {
      b.classList.add('is-wrong'); setTimeout(() => b.classList.remove('is-wrong'), 500);
      hgSay(hgT('dial_hint'));
    }
    hintNext();
  }));
  hintNext();
  const bubble = (who, text, cls) => {
    chat.insertAdjacentHTML('beforeend', `<p class="hg-bubble hg-bubble--${cls}"><span class="hg-bubble__who">${escapeHtml(who)}</span>${escapeHtml(text)}</p>`);
    chat.scrollTop = chat.scrollHeight;
  };
  callBtn.addEventListener('click', () => {
    hgStop();
    pad.innerHTML = `<p class="hg-phone__ringing">📞 ${escapeHtml(hgT('ringing'))}</p>`;
    callTone();
    setTimeout(() => ask(0), 2400);
  });
  const ask = i => {
    if (!root.contains(answer)) return;
    if (i >= script.length){ callFinish(root, call, answer); return; }
    const q = script[i];
    bubble(hgT('dispatcher'), q.q, 'them');
    pad.innerHTML = '';
    answer.innerHTML = `<h2 class="hg-prompt">${escapeHtml(hgT('you_say'))}</h2><div data-hg-q></div><div class="hg-actions hg-next" hidden><button type="button" class="btn btn-primary btn-lg" data-hg-next>${escapeHtml(hgT('next'))}</button></div>`;
    hgSay(q.q);
    hgChoices(answer.querySelector('[data-hg-q]'), q.choices, {
      onRight: c => {
        bubble(hgT('you'), c.t, 'me');
        const next = answer.querySelector('.hg-next');
        if (q.address){
          next.insertAdjacentHTML('beforebegin', `<div class="hg-address"><p><strong>${escapeHtml(hgT('say_address'))}</strong></p><p class="hg-adult-note">${escapeHtml(hgT('adult_note'))}</p></div>`);
        }
        next.hidden = false;
        next.querySelector('[data-hg-next]').addEventListener('click', () => ask(i + 1));
      },
    });
  };
}

function callFinish(root, call, answer){
  hgMark('call', call.id);
  hgCheer();
  answer.innerHTML = `
    <div class="hg-win">
      <div class="hg-burst" aria-hidden="true">📞🎉</div>
      <h2>${escapeHtml(hgT('call_done'))}</h2>
      <p class="hg-tips">${escapeHtml(hgT('call_tips'))}</p>
      <div class="hg-actions">
        <button type="button" class="btn btn-secondary" data-hg-again>${escapeHtml(hgT('again'))}</button>
        <button type="button" class="btn btn-primary btn-lg" data-hg-list>${escapeHtml(hgT('back_list'))}</button>
      </div>
    </div>`;
  hgSay(`${hgT('call_done')} ${hgT('call_tips').replace(/ · /g, '. ')}.`);
  answer.querySelector('[data-hg-again]').addEventListener('click', () => callPlay(root, call.id));
}
