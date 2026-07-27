/* ==========================================================================
   Safety Superheroes — Sort It Out (sort-it-out.html)
   A quick two-bin sorting game built from the same checkpoint-question
   choices already used by review.html / hero-rush.html -- every possible
   answer across every topic (not just the correct one) becomes its own
   sortable card, tagged "Safe Choice" or "Needs a Rethink" by the same
   `correct` flag the quiz games use. No new content authoring, no fail
   state: an incorrect sort just shows which zone it belonged in and moves on.
   ========================================================================== */

let sortState = null;

function sortShuffledOrder(n){
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function buildSortCards(lang){
  const cards = [];
  TOPICS.forEach(meta => {
    const content = getTopicSummary(meta.id, lang);
    const cp = content.video && content.video.checkpoints && content.video.checkpoints[0];
    if (!cp || !cp.choices) return;
    cp.choices.forEach(choice => {
      cards.push({ text: choice.text, correct: choice.correct, topicId: meta.id, theme: meta.theme });
    });
  });
  const order = sortShuffledOrder(cards.length);
  return order.map(i => cards[i]);
}

function getSortBestStreak(){
  try { return parseInt(localStorage.getItem('safetylib_sort_best_streak'), 10) || 0; } catch (e) { return 0; }
}
function saveSortBestStreak(streak){
  try {
    if (streak > getSortBestStreak()) localStorage.setItem('safetylib_sort_best_streak', String(streak));
  } catch (e) { /* ignore */ }
}

function resetSort(){
  const lang = getLang();
  sortState = {
    lang,
    phase: 'intro',
    cards: buildSortCards(lang),
    index: 0,
    answered: false,
    chosenSafe: null,
    correctCount: 0,
    streak: 0,
    bestStreak: 0,
  };
}

function renderSort(){
  const root = document.querySelector('[data-sort-root]');
  if (!root) return;
  const lang = getLang();
  if (!sortState || sortState.lang !== lang) resetSort();

  if (sortState.phase === 'intro'){
    root.innerHTML = `
      <section class="hero">
        <h1 data-i18n="sort_title">Sort It Out</h1>
        <p data-i18n="sort_intro_body">Read each choice and sort it into the right zone.</p>
        <div class="hero-actions"><button type="button" class="btn btn-primary btn-lg" data-sort-start>${t('sort_intro_cta')}</button></div>
      </section>`;
    root.querySelector('[data-sort-start]').addEventListener('click', () => {
      sortState.phase = 'playing';
      renderSort();
    });
    return;
  }

  if (sortState.phase === 'playing'){
    const card = sortState.cards[sortState.index];
    let feedbackHtml = '';
    let footerHtml = '';
    let binsHtml;
    if (sortState.answered){
      const gotItRight = sortState.chosenSafe === card.correct;
      feedbackHtml = `
        <div class="comic-panel power-hit">
          <p class="power-hit__text">${gotItRight ? t('sort_correct_text') : t('sort_incorrect_text')}</p>
        </div>`;
      const isLast = sortState.index >= sortState.cards.length - 1;
      footerHtml = `<button type="button" class="btn btn-primary" data-sort-next>${isLast ? t('sort_finish_btn') : t('sort_next_btn')}</button>`;
      binsHtml = `
        <div class="sort-bins">
          <div class="sort-bin sort-bin--safe ${card.correct ? 'is-answer' : ''}">${t('sort_safe_label')}</div>
          <div class="sort-bin sort-bin--rethink ${!card.correct ? 'is-answer' : ''}">${t('sort_rethink_label')}</div>
        </div>`;
    } else {
      binsHtml = `
        <div class="sort-bins">
          <button type="button" class="sort-bin sort-bin--safe" data-sort-choice="safe">${t('sort_safe_label')}</button>
          <button type="button" class="sort-bin sort-bin--rethink" data-sort-choice="rethink">${t('sort_rethink_label')}</button>
        </div>`;
    }

    root.innerHTML = `
      <div class="card">
        <div class="rush-status-row">
          <p class="review-progress">${t('sort_progress', { current: sortState.index + 1, total: sortState.cards.length })}</p>
          <span class="rush-streak" title="${t('rush_streak_label')}">🔥 ${sortState.streak}</span>
        </div>
        <div class="battle-question-row">${heroBadgeHtml(card.topicId, lang, card.theme, 48)}<h2 class="review-question sort-card-text">${escapeHtml(card.text)}</h2></div>
        ${binsHtml}
        ${feedbackHtml}
        <div class="flashcard-controls">${footerHtml}</div>
      </div>`;

    if (!sortState.answered){
      root.querySelectorAll('[data-sort-choice]').forEach(btn => {
        btn.addEventListener('click', () => {
          sortState.answered = true;
          sortState.chosenSafe = btn.dataset.sortChoice === 'safe';
          if (sortState.chosenSafe === card.correct){
            sortState.correctCount += 1;
            sortState.streak += 1;
            sortState.bestStreak = Math.max(sortState.bestStreak, sortState.streak);
            if (typeof playCorrectDing === 'function') playCorrectDing();
          } else {
            sortState.streak = 0;
          }
          renderSort();
        });
      });
    } else {
      root.querySelector('[data-sort-next]').addEventListener('click', () => {
        if (sortState.index >= sortState.cards.length - 1){
          sortState.phase = 'done';
        } else {
          sortState.index += 1;
          sortState.answered = false;
          sortState.chosenSafe = null;
        }
        renderSort();
      });
    }
    return;
  }

  // phase === 'done'
  saveSortBestStreak(sortState.bestStreak);
  root.innerHTML = `
    <section class="hero">
      <h1 data-i18n="sort_done_title">Sorting complete!</h1>
      <p>${t('sort_done_body', { correct: sortState.correctCount, total: sortState.cards.length, streak: sortState.bestStreak })}</p>
      <p class="rush-alltime-best">${t('rush_alltime_best', { streak: getSortBestStreak() })}</p>
      <div class="hero-actions">
        <button type="button" class="btn btn-secondary" data-sort-again>${t('sort_again_btn')}</button>
        <a class="btn btn-primary btn-lg" href="games.html">${t('rush_back_btn')}</a>
      </div>
    </section>`;
  root.querySelector('[data-sort-again]').addEventListener('click', () => {
    resetSort();
    renderSort();
  });
}

function initSortItOutPage(){
  renderSort();
  window.addEventListener('safetylib:langchange', () => { sortState = null; renderSort(); });
}
