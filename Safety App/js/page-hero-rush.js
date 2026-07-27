/* ==========================================================================
   Safety Superheroes — Hero Quiz Rush (hero-rush.html)
   A quick, no-fail quiz across every topic's existing checkpoint question
   (same data source as review.html / boss-battle.html). Unlike the Safety
   Showdown, this is available any time (nothing to unlock) and plays all 23
   questions in one shuffled run. There is no countdown timer -- time
   pressure works against this app's calm, low-anxiety design for autistic
   learners -- the "rush" comes from the streak counter and hero power-ups,
   not from a clock. A missed question just resets the streak; it never
   ends the game or lowers the running correct-answer count.
   ========================================================================== */

let rushState = null;

function getRushBestStreak(){
  try { return parseInt(localStorage.getItem('safetylib_rush_best_streak'), 10) || 0; } catch (e) { return 0; }
}
function saveRushBestStreak(streak){
  try {
    if (streak > getRushBestStreak()) localStorage.setItem('safetylib_rush_best_streak', String(streak));
  } catch (e) { /* ignore */ }
}

function rushShuffledOrder(n){
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function buildRushRounds(lang){
  const withQuestions = TOPICS.map(meta => {
    const content = getTopicSummary(meta.id, lang);
    const cp = content.video && content.video.checkpoints && content.video.checkpoints[0];
    const hero = heroFor(meta.id);
    if (!cp || !hero) return null;
    return { topicId: meta.id, theme: meta.theme, question: cp.question, choices: cp.choices, hero: hero[lang] || hero.en };
  }).filter(Boolean);
  const order = rushShuffledOrder(withQuestions.length);
  return order.map(i => withQuestions[i]);
}

function rushHeroRosterHtml(lang){
  return TOPICS.map(meta => {
    const hero = heroFor(meta.id);
    if (!hero) return '';
    const data = hero[lang] || hero.en;
    return `<div class="roster-cell">${heroBadgeHtml(meta.id, lang, meta.theme, 48)}<span>${escapeHtml(data.name)}</span></div>`;
  }).join('');
}

function resetRush(){
  const lang = getLang();
  rushState = {
    lang,
    phase: 'intro',
    rounds: buildRushRounds(lang),
    index: 0,
    answered: false,
    chosenIndex: null,
    correctCount: 0,
    streak: 0,
    bestStreak: 0,
  };
}

function renderRush(){
  const root = document.querySelector('[data-rush-root]');
  if (!root) return;
  const lang = getLang();
  if (!rushState || rushState.lang !== lang) resetRush();

  if (rushState.phase === 'intro'){
    root.innerHTML = `
      <section class="hero">
        <h1 data-i18n="rush_title">Hero Quiz Rush</h1>
        <p data-i18n="rush_intro_body">Answer safety questions from every lesson and keep your streak going.</p>
        <div class="hero-actions"><button type="button" class="btn btn-primary btn-lg" data-rush-start>${t('rush_intro_cta')}</button></div>
      </section>
      <div class="roster-grid">${rushHeroRosterHtml(lang)}</div>`;
    root.querySelector('[data-rush-start]').addEventListener('click', () => {
      rushState.phase = 'playing';
      renderRush();
    });
    return;
  }

  if (rushState.phase === 'playing'){
    const round = rushState.rounds[rushState.index];
    const choicesHtml = round.choices.map((choice, i) => {
      let cls = 'choice-btn';
      if (rushState.answered && i === rushState.chosenIndex) cls += choice.correct ? ' correct' : ' incorrect';
      else if (rushState.answered && choice.correct) cls += ' correct';
      return `<button type="button" class="${cls}" data-rush-choice="${i}" ${rushState.answered ? 'disabled' : ''}>${escapeHtml(choice.text)}</button>`;
    }).join('');

    let feedbackHtml = '';
    let footerHtml = '';
    if (rushState.answered){
      const chosen = round.choices[rushState.chosenIndex];
      feedbackHtml = chosen.correct
        ? `<div class="comic-panel power-hit">
            <div class="comic-burst power-hit__burst"><span class="font-comic">${t('battle_pow_label')}</span></div>
            <p class="font-comic power-hit__text">${t('rush_hit_text', { hero: round.hero.name, power: round.hero.power })}</p>
          </div>`
        : `<div class="comic-panel">
            <p class="power-hit__text">${t('rush_miss_text', { hero: round.hero.name })}</p>
          </div>`;
      const isLast = rushState.index >= rushState.rounds.length - 1;
      footerHtml = `<button type="button" class="btn btn-primary" data-rush-next>${isLast ? t('rush_finish_btn') : t('rush_next_btn')}</button>`;
    }

    root.innerHTML = `
      <div class="card">
        <div class="rush-status-row">
          <p class="review-progress">${t('rush_progress', { current: rushState.index + 1, total: rushState.rounds.length })}</p>
          <span class="rush-streak" title="${t('rush_streak_label')}">🔥 ${rushState.streak}</span>
        </div>
        <div class="battle-question-row">${heroBadgeHtml(round.topicId, lang, round.theme, 48)}<h2 class="review-question">${escapeHtml(round.question)}</h2></div>
        <div class="story-choices">${choicesHtml}</div>
        ${feedbackHtml}
        <div class="flashcard-controls">${footerHtml}</div>
      </div>`;

    if (!rushState.answered){
      root.querySelectorAll('[data-rush-choice]').forEach(btn => {
        btn.addEventListener('click', () => {
          rushState.answered = true;
          rushState.chosenIndex = Number(btn.dataset.rushChoice);
          if (round.choices[rushState.chosenIndex].correct){
            rushState.correctCount += 1;
            rushState.streak += 1;
            rushState.bestStreak = Math.max(rushState.bestStreak, rushState.streak);
            if (typeof playCorrectDing === 'function') playCorrectDing();
          } else {
            rushState.streak = 0;
          }
          renderRush();
        });
      });
    } else {
      root.querySelector('[data-rush-next]').addEventListener('click', () => {
        if (rushState.index >= rushState.rounds.length - 1){
          rushState.phase = 'done';
        } else {
          rushState.index += 1;
          rushState.answered = false;
          rushState.chosenIndex = null;
        }
        renderRush();
      });
    }
    return;
  }

  // phase === 'done'
  saveRushBestStreak(rushState.bestStreak);
  root.innerHTML = `
    <section class="hero">
      <h1 data-i18n="rush_done_title">Rush complete!</h1>
      <p>${t('rush_done_body', { correct: rushState.correctCount, total: rushState.rounds.length, streak: rushState.bestStreak })}</p>
      <p class="rush-alltime-best">${t('rush_alltime_best', { streak: getRushBestStreak() })}</p>
      <div class="hero-actions">
        <button type="button" class="btn btn-secondary" data-rush-again>${t('rush_again_btn')}</button>
        <a class="btn btn-primary btn-lg" href="games.html">${t('rush_back_btn')}</a>
      </div>
    </section>
    <div class="roster-grid">${rushHeroRosterHtml(lang)}</div>`;
  root.querySelector('[data-rush-again]').addEventListener('click', () => {
    resetRush();
    renderRush();
  });
}

function initHeroRushPage(){
  renderRush();
  window.addEventListener('safetylib:langchange', () => { rushState = null; renderRush(); });
}
