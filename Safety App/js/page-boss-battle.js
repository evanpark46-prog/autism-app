/* ==========================================================================
   Safety Superheroes — The Safety Showdown (boss-battle.html)
   Unlocks once every topic is complete (see js/page-badges.js banner).
   A celebratory capstone, not a test: every round always lands its "hit" on
   the monster regardless of the answer picked, consistent with the app's
   no-fail tone -- the point is reviewing everything learned while feeling
   like the team of heroes wins, not gatekeeping the ending behind a score.
   ========================================================================== */

const BATTLE_ROUNDS = 8;

let battleState = null;

function shuffledOrder(n){
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function buildBattleRounds(lang){
  const withQuestions = TOPICS.map(meta => {
    const content = getTopicSummary(meta.id, lang);
    const cp = content.video && content.video.checkpoints && content.video.checkpoints[0];
    const hero = heroFor(meta.id);
    if (!cp || !hero) return null;
    return { topicId: meta.id, theme: meta.theme, question: cp.question, choices: cp.choices, hero: hero[lang] || hero.en };
  }).filter(Boolean);
  const order = shuffledOrder(withQuestions.length).slice(0, Math.min(BATTLE_ROUNDS, withQuestions.length));
  return order.map(i => withQuestions[i]);
}

function resetBattle(){
  const lang = getLang();
  battleState = {
    lang,
    phase: 'intro',
    rounds: buildBattleRounds(lang),
    index: 0,
    answered: false,
    chosenIndex: null,
  };
}

function monsterSvg(defeated){
  const eyes = defeated
    ? '<path d="M8 13q2-2 4 0M14 13q2-2 4 0" stroke="#2b2b2b" stroke-width="2" stroke-linecap="round" fill="none"/>'
    : '<circle cx="9.5" cy="12.5" r="2.4" fill="#2b2b2b"/><circle cx="16.5" cy="12.5" r="2.4" fill="#2b2b2b"/>';
  const mouth = defeated
    ? '<path d="M9 18q4 2 8 0" stroke="#2b2b2b" stroke-width="2" stroke-linecap="round" fill="none"/>'
    : '<path d="M9 18q4 3 8 0" stroke="#2b2b2b" stroke-width="2" stroke-linecap="round" fill="none"/>';
  return `<svg viewBox="0 0 26 26" width="100%" height="100%" focusable="false">
    <path d="M13 2 4 8v9a9 9 0 0 0 18 0V8Z" fill="#8d6bd6"/>
    <circle cx="6.5" cy="7" r="2.1" fill="#8d6bd6"/>
    <circle cx="19.5" cy="7" r="2.1" fill="#8d6bd6"/>
    ${eyes}${mouth}
  </svg>`;
}

function heroRosterHtml(lang){
  return TOPICS.map(meta => {
    const hero = heroFor(meta.id);
    if (!hero) return '';
    const data = hero[lang] || hero.en;
    return `<div class="roster-cell">${heroBadgeHtml(meta.id, lang, meta.theme, 48)}<span>${escapeHtml(data.name)}</span></div>`;
  }).join('');
}

function renderBattle(){
  const root = document.querySelector('[data-battle-root]');
  if (!root) return;
  const lang = getLang();
  const analytics = loadAnalytics();
  const completedIds = new Set(Object.keys(analytics.topics).filter(id => analytics.topics[id].levelCompletes > 0));

  if (completedIds.size < TOPICS.length){
    root.innerHTML = `
      <section class="hero">
        <h1>${t('battle_locked_title')}</h1>
        <p>${t('battle_locked_body', { done: completedIds.size, total: TOPICS.length })}</p>
        <div class="hero-actions"><a class="btn btn-primary btn-lg" href="badges.html">${t('battle_locked_cta')}</a></div>
      </section>`;
    return;
  }

  if (!battleState || battleState.lang !== lang) resetBattle();

  if (battleState.phase === 'intro'){
    root.innerHTML = `
      <section class="hero">
        <div class="battle-monster battle-monster--intro">${monsterSvg(false)}</div>
        <h1>${t('battle_intro_title')}</h1>
        <p>${t('battle_intro_body')}</p>
        <div class="hero-actions"><button type="button" class="btn btn-primary btn-lg" data-battle-start>${t('battle_intro_cta')}</button></div>
      </section>
      <div class="roster-grid">${heroRosterHtml(lang)}</div>`;
    root.querySelector('[data-battle-start]').addEventListener('click', () => {
      battleState.phase = 'battle';
      renderBattle();
    });
    return;
  }

  if (battleState.phase === 'battle'){
    const round = battleState.rounds[battleState.index];
    const choicesHtml = round.choices.map((choice, i) => {
      let cls = 'choice-btn';
      if (battleState.answered && i === battleState.chosenIndex) cls += choice.correct ? ' correct' : ' incorrect';
      else if (battleState.answered && choice.correct) cls += ' correct';
      return `<button type="button" class="${cls}" data-battle-choice="${i}" ${battleState.answered ? 'disabled' : ''}>${escapeHtml(choice.text)}</button>`;
    }).join('');

    let feedbackHtml = '';
    let footerHtml = '';
    if (battleState.answered){
      feedbackHtml = `
        <div class="comic-panel power-hit">
          <div class="comic-burst power-hit__burst"><span class="font-comic">${t('battle_pow_label')}</span></div>
          <p class="font-comic power-hit__text">${t('battle_hit_text', { hero: round.hero.name, power: round.hero.power })}</p>
        </div>`;
      const isLast = battleState.index >= battleState.rounds.length - 1;
      footerHtml = `<button type="button" class="btn btn-primary" data-battle-next>${isLast ? t('battle_finish_btn') : t('flash_next')}</button>`;
    }

    const healthPct = Math.round(100 - (battleState.index / battleState.rounds.length) * 100);
    root.innerHTML = `
      <div class="battle-arena">
        <div class="battle-monster">${monsterSvg(false)}</div>
        <div class="battle-health" role="img" aria-label="${t('battle_health_label')}">
          <div class="battle-health__bar" style="width:${healthPct}%"></div>
        </div>
      </div>
      <div class="card">
        <p class="review-progress">${t('battle_round_progress', { current: battleState.index + 1, total: battleState.rounds.length })}</p>
        <div class="battle-question-row">${heroBadgeHtml(round.topicId, lang, round.theme, 48)}<h2 class="review-question">${escapeHtml(round.question)}</h2></div>
        <div class="story-choices">${choicesHtml}</div>
        ${feedbackHtml}
        <div class="flashcard-controls">${footerHtml}</div>
      </div>`;

    if (!battleState.answered){
      root.querySelectorAll('[data-battle-choice]').forEach(btn => {
        btn.addEventListener('click', () => {
          battleState.answered = true;
          battleState.chosenIndex = Number(btn.dataset.battleChoice);
          renderBattle();
        });
      });
    } else {
      root.querySelector('[data-battle-next]').addEventListener('click', () => {
        if (battleState.index >= battleState.rounds.length - 1){
          battleState.phase = 'done';
        } else {
          battleState.index += 1;
          battleState.answered = false;
          battleState.chosenIndex = null;
        }
        renderBattle();
      });
    }
    return;
  }

  // phase === 'done'
  root.innerHTML = `
    <section class="hero">
      <div class="battle-monster battle-monster--defeated">${monsterSvg(true)}</div>
      <h1>${t('battle_done_title')}</h1>
      <p>${t('battle_done_body')}</p>
      <div class="hero-actions">
        <button type="button" class="btn btn-secondary" data-battle-again>${t('battle_again_btn')}</button>
        <a class="btn btn-primary btn-lg" href="badges.html">${t('battle_done_cta')}</a>
      </div>
    </section>
    <div class="roster-grid">${heroRosterHtml(lang)}</div>`;
  root.querySelector('[data-battle-again]').addEventListener('click', () => {
    resetBattle();
    renderBattle();
  });
}

function initBossBattlePage(){
  renderBattle();
  window.addEventListener('safetylib:langchange', () => { battleState = null; renderBattle(); });
}
