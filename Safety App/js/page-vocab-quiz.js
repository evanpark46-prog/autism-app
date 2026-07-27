/* ==========================================================================
   Safety Superheroes — Word Power Quiz (vocab-quiz.html)
   A vocabulary quiz built from the same glossary words already used for
   hover/focus definitions elsewhere (js/glossary.js) -- "What does X mean?"
   with 3 distractor definitions pulled from other glossary words. Every 5
   correct in a row unlocks an optional "Sky Chase" bonus mission: a short
   (20s), no-fail, tap-to-zap mini-game. Bonus missions are fully optional --
   skippable per-offer, and can be turned off entirely from the intro screen
   -- and never offered at all under prefers-reduced-motion, since the
   mission is inherently a moving-elements mechanic.
   ========================================================================== */

const VOCAB_BONUS_STREAK = 5;
const VOCAB_MISSION_MS = 20000;
const VOCAB_VILLAIN_NAME = { en: 'Dr. Confuzzle', es: 'Dr. Confusión' };

let vocabState = null;
let vocabMissionTimers = [];

function getVocabBestStreak(){
  try { return parseInt(localStorage.getItem('safetylib_vocab_best_streak'), 10) || 0; } catch (e) { return 0; }
}
function saveVocabBestStreak(streak){
  try {
    if (streak > getVocabBestStreak()) localStorage.setItem('safetylib_vocab_best_streak', String(streak));
  } catch (e) { /* ignore */ }
}

function vocabShuffledOrder(n){
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function vocabReducedMotion(){
  return typeof window !== 'undefined' && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function buildVocabRounds(lang){
  const dict = GLOSSARY[lang] || GLOSSARY.en;
  const seen = new Set();
  const unique = [];
  Object.keys(dict).forEach(word => {
    const def = dict[word];
    if (seen.has(def)) return;
    seen.add(def);
    unique.push({ word, definition: def });
  });
  const roundOrder = vocabShuffledOrder(unique.length);
  return roundOrder.map(i => {
    const item = unique[i];
    const pool = unique.filter(u => u.definition !== item.definition);
    const distractorIdx = vocabShuffledOrder(pool.length).slice(0, Math.min(3, pool.length));
    const options = [{ text: item.definition, correct: true }]
      .concat(distractorIdx.map(j => ({ text: pool[j].definition, correct: false })));
    const shuffled = vocabShuffledOrder(options.length).map(k => options[k]);
    return { word: item.word, definition: item.definition, choices: shuffled };
  });
}

function getVocabBonusEnabled(){
  try { return localStorage.getItem('safetylib_vocab_bonus') !== 'off'; } catch (e) { return true; }
}
function setVocabBonusEnabled(on){
  try { localStorage.setItem('safetylib_vocab_bonus', on ? 'on' : 'off'); } catch (e) { /* ignore */ }
}

function resetVocabQuiz(){
  const lang = getLang();
  vocabState = {
    lang,
    phase: 'intro',
    bonusEnabled: getVocabBonusEnabled(),
    rounds: buildVocabRounds(lang),
    index: 0,
    answered: false,
    chosenIndex: null,
    correctCount: 0,
    streak: 0,
    bestStreak: 0,
    missionZapped: 0,
  };
}

/* ---------------- Sky Chase bonus mission ---------------- */

function villainSvg(){
  return `<svg viewBox="0 0 26 26" width="100%" height="100%" focusable="false">
    <path d="M13 3 5 8v8a8 8 0 0 0 16 0V8Z" fill="#8d6bd6"/>
    <circle cx="7" cy="7.5" r="1.9" fill="#8d6bd6"/><circle cx="19" cy="7.5" r="1.9" fill="#8d6bd6"/>
    <circle cx="9.5" cy="12.5" r="2.1" fill="#2b2b2b"/><circle cx="16.5" cy="12.5" r="2.1" fill="#2b2b2b"/>
    <path d="M9 17.5q4 2.5 8 0" stroke="#2b2b2b" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  </svg>`;
}

function clearVocabMissionTimers(){
  vocabMissionTimers.forEach(id => { clearTimeout(id); clearInterval(id); });
  vocabMissionTimers = [];
}

function startSkyChase(root, lang, onDone){
  const villainName = VOCAB_VILLAIN_NAME[lang] || VOCAB_VILLAIN_NAME.en;
  let zapped = 0;
  const field = root.querySelector('[data-chase-field]');
  const timerBar = root.querySelector('[data-chase-timer]');
  const zapCount = root.querySelector('[data-chase-count]');

  const startedAt = Date.now();
  function spawnVillain(){
    if (!field.isConnected) return;
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'chase-villain';
    el.style.left = `${8 + Math.random() * 78}%`;
    el.innerHTML = villainSvg();
    el.setAttribute('aria-label', 'Zap');
    field.appendChild(el);
    // Trigger the fall on the next frame so the transition actually runs.
    requestAnimationFrame(() => { el.style.top = '92%'; });
    const fallTimer = setTimeout(() => { if (el.isConnected) el.remove(); }, 3200);
    vocabMissionTimers.push(fallTimer);
    el.addEventListener('click', () => {
      if (!el.isConnected) return;
      zapped += 1;
      if (zapCount) zapCount.textContent = String(zapped);
      el.classList.add('is-zapped');
      if (typeof playZapSound === 'function') playZapSound();
      setTimeout(() => { if (el.isConnected) el.remove(); }, 220);
    });
  }

  const spawnInterval = setInterval(spawnVillain, 850);
  vocabMissionTimers.push(spawnInterval);
  spawnVillain();

  const tickInterval = setInterval(() => {
    const elapsed = Date.now() - startedAt;
    const pct = Math.max(0, 100 - (elapsed / VOCAB_MISSION_MS) * 100);
    if (timerBar) timerBar.style.width = `${pct}%`;
  }, 100);
  vocabMissionTimers.push(tickInterval);

  const endTimer = setTimeout(() => {
    clearVocabMissionTimers();
    if (field) field.querySelectorAll('.chase-villain').forEach(el => el.remove());
    onDone(zapped, villainName);
  }, VOCAB_MISSION_MS);
  vocabMissionTimers.push(endTimer);
}

/* ---------------- render ---------------- */

function renderVocabQuiz(){
  const root = document.querySelector('[data-vocab-root]');
  if (!root) return;
  const lang = getLang();
  if (!vocabState || vocabState.lang !== lang) resetVocabQuiz();

  if (vocabState.phase === 'intro'){
    const bonusOn = vocabState.bonusEnabled;
    root.innerHTML = `
      <section class="hero">
        <h1 data-i18n="vocab_title">Word Power Quiz</h1>
        <p data-i18n="vocab_intro_body">Match each word to what it means.</p>
        <div class="vocab-bonus-toggle">
          <span>${t('vocab_bonus_toggle_label')}</span>
          <button type="button" class="btn btn-secondary" data-vocab-bonus-toggle>
            ${bonusOn ? t('vocab_bonus_toggle_on') : t('vocab_bonus_toggle_off')}
          </button>
        </div>
        <div class="hero-actions"><button type="button" class="btn btn-primary btn-lg" data-vocab-start>${t('vocab_intro_cta')}</button></div>
      </section>`;
    root.querySelector('[data-vocab-bonus-toggle]').addEventListener('click', () => {
      vocabState.bonusEnabled = !vocabState.bonusEnabled;
      setVocabBonusEnabled(vocabState.bonusEnabled);
      renderVocabQuiz();
    });
    root.querySelector('[data-vocab-start]').addEventListener('click', () => {
      vocabState.phase = 'playing';
      renderVocabQuiz();
    });
    return;
  }

  if (vocabState.phase === 'playing'){
    const round = vocabState.rounds[vocabState.index];
    const choicesHtml = round.choices.map((choice, i) => {
      let cls = 'choice-btn';
      if (vocabState.answered && i === vocabState.chosenIndex) cls += choice.correct ? ' correct' : ' incorrect';
      else if (vocabState.answered && choice.correct) cls += ' correct';
      return `<button type="button" class="${cls}" data-vocab-choice="${i}" ${vocabState.answered ? 'disabled' : ''}>${escapeHtml(choice.text)}</button>`;
    }).join('');

    let feedbackHtml = '';
    let footerHtml = '';
    if (vocabState.answered){
      const chosen = round.choices[vocabState.chosenIndex];
      feedbackHtml = chosen.correct
        ? `<div class="comic-panel power-hit"><p class="font-comic power-hit__text">${t('vocab_hit_text', { streak: vocabState.streak })}</p></div>`
        : `<div class="comic-panel"><p class="power-hit__text">${t('vocab_miss_text', { definition: escapeHtml(round.definition) })}</p></div>`;
      const isLast = vocabState.index >= vocabState.rounds.length - 1;
      footerHtml = `<button type="button" class="btn btn-primary" data-vocab-next>${isLast ? t('vocab_finish_btn') : t('vocab_next_btn')}</button>`;
    }

    root.innerHTML = `
      <div class="card">
        <div class="rush-status-row">
          <p class="review-progress">${t('vocab_progress', { current: vocabState.index + 1, total: vocabState.rounds.length })}</p>
          <span class="rush-streak" title="${t('rush_streak_label')}">🔥 ${vocabState.streak}</span>
        </div>
        <h2 class="review-question">${t('vocab_question', { word: escapeHtml(round.word) })}</h2>
        <div class="story-choices">${choicesHtml}</div>
        ${feedbackHtml}
        <div class="flashcard-controls">${footerHtml}</div>
      </div>`;

    if (!vocabState.answered){
      root.querySelectorAll('[data-vocab-choice]').forEach(btn => {
        btn.addEventListener('click', () => {
          vocabState.answered = true;
          vocabState.chosenIndex = Number(btn.dataset.vocabChoice);
          if (round.choices[vocabState.chosenIndex].correct){
            vocabState.correctCount += 1;
            vocabState.streak += 1;
            vocabState.bestStreak = Math.max(vocabState.bestStreak, vocabState.streak);
            if (typeof playCorrectDing === 'function') playCorrectDing();
          } else {
            vocabState.streak = 0;
          }
          renderVocabQuiz();
        });
      });
    } else {
      root.querySelector('[data-vocab-next]').addEventListener('click', () => {
        const reachedBonus = vocabState.streak > 0 && vocabState.streak % VOCAB_BONUS_STREAK === 0;
        const isLast = vocabState.index >= vocabState.rounds.length - 1;
        if (reachedBonus && vocabState.bonusEnabled && !vocabReducedMotion() && !isLast){
          vocabState.phase = 'bonusOffer';
        } else if (isLast){
          vocabState.phase = 'done';
        } else {
          vocabState.index += 1;
          vocabState.answered = false;
          vocabState.chosenIndex = null;
        }
        renderVocabQuiz();
      });
    }
    return;
  }

  if (vocabState.phase === 'bonusOffer'){
    const villainName = VOCAB_VILLAIN_NAME[lang] || VOCAB_VILLAIN_NAME.en;
    root.innerHTML = `
      <section class="hero">
        <h1 data-i18n="vocab_bonus_offer_title">5 in a row!</h1>
        <p>${t('vocab_bonus_offer_body', { villain: villainName })}</p>
        <div class="hero-actions">
          <button type="button" class="btn btn-primary btn-lg" data-vocab-bonus-play>${t('vocab_bonus_play_btn')}</button>
          <button type="button" class="btn btn-secondary" data-vocab-bonus-skip>${t('vocab_bonus_skip_btn')}</button>
        </div>
      </section>`;
    root.querySelector('[data-vocab-bonus-play]').addEventListener('click', () => {
      vocabState.streak = 0;
      vocabState.phase = 'bonusMission';
      renderVocabQuiz();
    });
    root.querySelector('[data-vocab-bonus-skip]').addEventListener('click', () => {
      vocabState.streak = 0;
      vocabState.index += 1;
      vocabState.answered = false;
      vocabState.chosenIndex = null;
      vocabState.phase = 'playing';
      renderVocabQuiz();
    });
    return;
  }

  if (vocabState.phase === 'bonusMission'){
    root.innerHTML = `
      <section class="hero">
        <h1 data-i18n="vocab_bonus_title">Sky Chase!</h1>
        <p data-i18n="vocab_bonus_hint">Tap the villains before they reach the ground.</p>
      </section>
      <div class="chase-hud">
        <div class="chase-timer-track"><div class="chase-timer-bar" data-chase-timer></div></div>
        <span class="rush-streak">⚡ <span data-chase-count>0</span></span>
      </div>
      <div class="chase-field" data-chase-field aria-hidden="true">
        <div class="chase-hero" aria-hidden="true">
          <svg viewBox="0 0 120 70" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
            <path d="M52 18 C30 14 14 26 10 44 C24 40 40 40 54 34 Z" fill="var(--rose)"/>
            <ellipse cx="66" cy="36" rx="16" ry="14" fill="var(--rose-dark)"/>
            <circle cx="88" cy="26" r="11" fill="#fff"/>
            <circle cx="81" cy="17" r="4" fill="#fff"/><circle cx="93" cy="17" r="4" fill="#fff"/>
            <circle cx="81" cy="18" r="2" fill="#3b3b3b" opacity=".5"/><circle cx="93" cy="18" r="2" fill="#3b3b3b" opacity=".5"/>
            <path d="M79 24c4-4 14-4 18 0 0 4-4 6-9 6s-9-2-9-6Z" fill="#3b3b3b"/>
          </svg>
        </div>
      </div>`;
    startSkyChase(root, lang, (zapped, villainName) => {
      vocabState.missionZapped = zapped;
      vocabState.phase = 'bonusDone';
      renderVocabQuiz();
      vocabState._lastVillainName = villainName;
    });
    return;
  }

  if (vocabState.phase === 'bonusDone'){
    const villainName = vocabState._lastVillainName || VOCAB_VILLAIN_NAME[lang] || VOCAB_VILLAIN_NAME.en;
    root.innerHTML = `
      <section class="hero">
        <h1 data-i18n="vocab_bonus_done_title">Mission complete!</h1>
        <p>${t('vocab_bonus_done_body', { villain: villainName, zapped: vocabState.missionZapped })}</p>
        <div class="hero-actions"><button type="button" class="btn btn-primary btn-lg" data-vocab-bonus-continue>${t('vocab_bonus_continue_btn')}</button></div>
      </section>`;
    root.querySelector('[data-vocab-bonus-continue]').addEventListener('click', () => {
      const isLast = vocabState.index >= vocabState.rounds.length - 1;
      if (isLast){
        vocabState.phase = 'done';
      } else {
        vocabState.index += 1;
        vocabState.answered = false;
        vocabState.chosenIndex = null;
        vocabState.phase = 'playing';
      }
      renderVocabQuiz();
    });
    return;
  }

  // phase === 'done'
  saveVocabBestStreak(vocabState.bestStreak);
  root.innerHTML = `
    <section class="hero">
      <h1 data-i18n="vocab_done_title">Word Power complete!</h1>
      <p>${t('vocab_done_body', { correct: vocabState.correctCount, total: vocabState.rounds.length, streak: vocabState.bestStreak })}</p>
      <p class="rush-alltime-best">${t('rush_alltime_best', { streak: getVocabBestStreak() })}</p>
      <div class="hero-actions">
        <button type="button" class="btn btn-secondary" data-vocab-again>${t('vocab_again_btn')}</button>
        <a class="btn btn-primary btn-lg" href="games.html">${t('rush_back_btn')}</a>
      </div>
    </section>`;
  root.querySelector('[data-vocab-again]').addEventListener('click', () => {
    resetVocabQuiz();
    renderVocabQuiz();
  });
}

function initVocabQuizPage(){
  renderVocabQuiz();
  window.addEventListener('safetylib:langchange', () => { vocabState = null; renderVocabQuiz(); });
}
