/* ==========================================================================
   Safety Superheroes — Villain Battle (villain.html?id=<topic>&level=<n>)
   The lesson's hero vs. the lesson's villain, using questions from the
   story level the learner just finished. No-fail by design: a safe answer
   lands a hit; an unsafe one just makes the villain laugh, shows why, and
   that answer gets crossed out so the learner can try again. Every battle
   ends with the hero winning and the villain learning the safe habit.
   ========================================================================== */

const VILLAIN_ROUNDS = 4;
let villainState = null;

function villainParams(){
  const q = new URLSearchParams(location.search);
  const id = q.get('id') || '';
  const level = Math.max(0, parseInt(q.get('level'), 10) || 0);
  return { id, level };
}

function vShuffle(list){
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function buildVillainRounds(content, level){
  const levels = (content.story && content.story.levels) || [];
  const lvl = levels[Math.min(level, levels.length - 1)];
  const steps = (lvl && lvl.steps) || [];
  const oneRight = q => q.choices && q.choices.length > 1 && q.choices.filter(c => c.correct).length === 1;
  // This level's own stand-alone questions first; top up from the lesson's
  // video quiz so every battle has VILLAIN_ROUNDS rounds.
  const story = vShuffle(steps.filter(s => ['decision', 'sequence'].includes(s.type) && s.text && oneRight(s))
    .map(s => ({ question: s.text, choices: s.choices })));
  const video = vShuffle(((content.video && content.video.checkpoints) || []).filter(c => c.question && oneRight(c))
    .map(c => ({ question: c.question, choices: c.choices })));
  const seen = new Set();
  const qs = story.concat(video).filter(q => !seen.has(q.question) && seen.add(q.question));
  const maxChoices = level === 0 ? 2 : 3;
  return qs.slice(0, VILLAIN_ROUNDS).map(q => {
    const right = q.choices.filter(c => c.correct).slice(0, 1);
    const wrong = vShuffle(q.choices.filter(c => !c.correct)).slice(0, maxChoices - 1);
    return { question: q.question, choices: vShuffle(right.concat(wrong)) };
  });
}

function villainSpeak(text){
  if (typeof speak === 'function' && typeof SPEECH_SUPPORTED !== 'undefined' && SPEECH_SUPPORTED) speak(text);
}
function villainSpeakBtn(text){
  if (typeof SPEECH_SUPPORTED === 'undefined' || !SPEECH_SUPPORTED) return '';
  return `<button type="button" class="villain-speak" data-villain-say="${escapeHtml(text)}" aria-label="${escapeHtml(t('villain_listen'))}">🔊</button>`;
}

function villainArenaHtml(meta, state, lang){
  const hero = typeof flyingHeroSvg === 'function' ? flyingHeroSvg(meta.id, meta.theme) : '';
  const hpPct = Math.round(state.hp * 100);
  const vd = villainData(meta.id, lang);
  return `
    <div class="villain-arena ${state.fx ? 'fx-' + state.fx : ''}" aria-hidden="true">
      <div class="villain-arena__hero">${hero}</div>
      <div class="villain-arena__vs">${escapeHtml(t(state.phase === 'won' ? 'villain_win_badge' : 'villain_vs'))}</div>
      <div class="villain-arena__villain">
        ${state.phase === 'battle' ? `<div class="villain-hp"><span style="width:${hpPct}%"></span></div>` : ''}
        ${villainSvg(meta.id, state.phase === 'won')}
        ${state.fx === 'hit' ? `<div class="villain-pow"><span>${escapeHtml(t('battle_pow_label'))}</span></div>` : ''}
      </div>
    </div>
    <p class="villain-name">${escapeHtml(vd.name)}</p>`;
}

function renderVillain(){
  const root = document.querySelector('[data-villain-root]');
  if (!root) return;
  const lang = getLang();
  const { id, level } = villainParams();
  const meta = typeof getTopicMeta === 'function' ? getTopicMeta(id) : null;
  if (!meta || !villainFor(id)){
    root.innerHTML = `<section class="hero"><h1>${escapeHtml(t('villain_missing'))}</h1><div class="hero-actions"><a class="btn btn-primary" href="index.html">${escapeHtml(t('story_back_to_topics'))}</a></div></section>`;
    return;
  }
  const content = getTopicContent(id, lang);
  if (!content){
    root.innerHTML = `<div class="card"><p role="status">${escapeHtml(t('review_loading'))}</p></div>`;
    ensureTopicContentLoaded(id).then(renderVillain).catch(() => {
      root.innerHTML = `<div class="card"><p role="alert">${escapeHtml(t('review_load_error'))}</p></div>`;
    });
    return;
  }
  if (!villainState || villainState.lang !== lang || villainState.id !== id){
    villainState = { lang, id, level, phase: 'intro', rounds: buildVillainRounds(content, level), index: 0, hp: 1, tried: [], solved: false, fx: '', laugh: 0 };
  }
  const st = villainState;
  const vd = villainData(id, lang);
  const heroInfo = typeof heroFor === 'function' && heroFor(id) ? (heroFor(id)[lang] || heroFor(id).en) : null;
  document.title = `${vd.name} — ${t('villain_page_title')}`;

  if (st.phase === 'intro'){
    root.innerHTML = `
      <section class="villain-stage">
        <p class="villain-kicker">${escapeHtml(content.title)} · ${escapeHtml(t('villain_page_title'))}</p>
        ${villainArenaHtml(meta, st, lang)}
        <div class="villain-bubble"><p>${escapeHtml(vd.taunt)}</p>${villainSpeakBtn(vd.taunt)}</div>
        <p class="villain-lead">${escapeHtml(t('villain_intro_lead', { hero: heroInfo ? heroInfo.name : '', villain: vd.name }))}</p>
        <div class="hero-actions"><button type="button" class="btn btn-primary btn-lg" data-villain-start>${escapeHtml(t('villain_intro_cta'))}</button></div>
      </section>`;
    root.querySelector('[data-villain-start]').addEventListener('click', () => { st.phase = st.rounds.length ? 'battle' : 'won'; render(); });
    wireSay(root);
    if (typeof maybeAutoSpeak === 'function') maybeAutoSpeak(vd.taunt);
    return;
  }

  if (st.phase === 'battle'){
    const r = st.rounds[st.index];
    const right = r.choices.find(c => c.correct);
    const lastWrong = st.tried.length ? r.choices[st.tried[st.tried.length - 1]] : null;
    const choicesHtml = r.choices.map((c, i) => {
      let cls = 'choice-btn';
      if (st.tried.includes(i)) cls += ' incorrect';
      if (st.solved && c.correct) cls += ' correct';
      const off = st.solved || st.tried.includes(i);
      return `<button type="button" class="${cls}" data-villain-choice="${i}" ${off ? 'disabled' : ''}>${escapeHtml(c.text)}</button>`;
    }).join('');
    let bubble = '';
    if (st.solved){
      bubble = `<div class="villain-hit" role="status">
          <p class="villain-hit__text">${escapeHtml(heroInfo ? t('battle_hit_text', { hero: heroInfo.name, power: heroInfo.power }) : t('villain_ouch_1'))}</p>
          <p class="villain-hit__ouch">${escapeHtml(vd.name)}: “${escapeHtml(t('villain_ouch_' + (1 + st.index % 3)))}”</p>
          ${right && right.feedback ? `<p class="villain-why">${escapeHtml(right.feedback)}</p>` : ''}
        </div>`;
    } else if (lastWrong){
      bubble = `<div class="villain-laugh" role="status">
          <p><strong>${escapeHtml(vd.name)}:</strong> “${escapeHtml(t('villain_laugh_' + (1 + st.laugh % 4)))}”</p>
          ${lastWrong.feedback ? `<p class="villain-why">${escapeHtml(lastWrong.feedback)}</p>` : ''}
          <p class="villain-try">${escapeHtml(t('villain_try_again', { villain: vd.name }))}</p>
        </div>`;
    }
    const isLast = st.index >= st.rounds.length - 1;
    root.innerHTML = `
      <section class="villain-stage villain-stage--battle">
        ${villainArenaHtml(meta, st, lang)}
        <div class="card villain-card">
          <p class="review-progress">${escapeHtml(t('villain_round', { current: st.index + 1, total: st.rounds.length }))}</p>
          <h2 class="review-question">${escapeHtml(r.question)}</h2>
          ${villainSpeakBtn([r.question].concat(r.choices.map((c, i) => `${i + 1}. ${c.text}`)).join(' '))}
          <div class="story-choices">${choicesHtml}</div>
          ${bubble}
          <div class="flashcard-controls">${st.solved ? `<button type="button" class="btn btn-primary" data-villain-next>${escapeHtml(isLast ? t('villain_finish_btn') : t('flash_next'))}</button>` : ''}</div>
        </div>
      </section>`;
    root.querySelectorAll('[data-villain-choice]').forEach(btn => btn.addEventListener('click', () => {
      const i = Number(btn.dataset.villainChoice);
      if (st.solved || st.tried.includes(i)) return;
      if (r.choices[i].correct){
        st.solved = true;
        st.hp = Math.max(0, 1 - (st.index + 1) / st.rounds.length);
        st.fx = 'hit';
        if (typeof playCorrectDing === 'function') playCorrectDing();
      } else {
        st.tried.push(i);
        st.laugh += 1;
        st.fx = 'laugh';
        if (typeof playZapSound === 'function') playZapSound();
      }
      render();
      const fb = document.querySelector('.villain-hit, .villain-laugh');
      if (fb && fb.scrollIntoView) fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }));
    const next = root.querySelector('[data-villain-next]');
    if (next) next.addEventListener('click', () => {
      if (typeof stopSpeaking === 'function') stopSpeaking();
      if (isLast){ st.phase = 'won'; st.fx = ''; }
      else { st.index += 1; st.tried = []; st.solved = false; st.fx = ''; }
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    wireSay(root);
    return;
  }

  // won
  if (!st.recorded){
    st.recorded = true;
    markVillainBeaten(id, level);
    const fanfared = typeof playHeroFanfare === 'function' && playHeroFanfare();
    if (!fanfared && typeof playCompletionChime === 'function') playCompletionChime();
  }
  root.innerHTML = `
    <section class="villain-stage villain-stage--won">
      <div class="villain-confetti" aria-hidden="true">${'<span>★</span>'.repeat(14)}</div>
      <h1 class="villain-win-title">${escapeHtml(t('villain_win_title', { villain: vd.name }))}</h1>
      ${villainArenaHtml(meta, st, lang)}
      <div class="villain-bubble villain-bubble--reform"><p>${escapeHtml(vd.reform)}</p>${villainSpeakBtn(vd.reform)}</div>
      <div class="hero-actions">
        <a class="btn btn-primary btn-lg" href="topic.html?id=${encodeURIComponent(id)}">${escapeHtml(t('villain_back_btn'))}</a>
        <button type="button" class="btn btn-secondary" data-villain-again>${escapeHtml(t('villain_again_btn'))}</button>
        <a class="btn btn-secondary" href="index.html">${escapeHtml(t('story_back_to_topics'))}</a>
      </div>
    </section>`;
  root.querySelector('[data-villain-again]').addEventListener('click', () => { villainState = null; render(); });
  wireSay(root);
  if (typeof maybeAutoSpeak === 'function') maybeAutoSpeak(vd.reform);

  function render(){ renderVillain(); }
}

function wireSay(root){
  root.querySelectorAll('[data-villain-say]').forEach(b => b.addEventListener('click', () => villainSpeak(b.dataset.villainSay)));
}

function initVillainPage(){
  renderVillain();
  window.addEventListener('safetylib:langchange', () => { villainState = null; renderVillain(); });
}
