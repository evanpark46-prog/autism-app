/* ==========================================================================
   Safety Superheroes — Cumulative review (review.html)
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Cumulative review — one shuffled question from every topic            */
/* ---------------------------------------------------------------------- */

let reviewState = null;

function buildReviewQuestions(lang){
  return TOPICS.map(meta => {
    const content = getTopicSummary(meta.id, lang);
    const cp = content.video && content.video.checkpoints && content.video.checkpoints[0];
    if (!cp) return null;
    return { topicId: meta.id, topicTitle: content.title, question: cp.question, choices: cp.choices };
  }).filter(Boolean);
}

function shuffledIndexOrder(n){
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function resetReview(){
  const lang = getLang();
  const questions = buildReviewQuestions(lang);
  reviewState = {
    lang,
    questions,
    order: shuffledIndexOrder(questions.length),
    index: 0,
    correct: 0,
    answered: false,
    chosenIndex: null,
    missed: [],
  };
}

function renderReview(){
  const root = document.querySelector('[data-review-root]');
  if (!root) return;
  if (!reviewState || reviewState.lang !== getLang()) resetReview();

  if (reviewState.index >= reviewState.order.length){
    renderReviewDone(root);
    return;
  }

  const q = reviewState.questions[reviewState.order[reviewState.index]];
  const choicesHtml = q.choices.map((choice, i) => {
    let cls = 'choice-btn';
    if (reviewState.answered && i === reviewState.chosenIndex){
      cls += choice.correct ? ' correct' : ' incorrect';
    } else if (reviewState.answered && choice.correct){
      cls += ' correct';
    }
    return `<button type="button" class="${cls}" data-review-choice="${i}" ${reviewState.answered ? 'disabled' : ''}>${escapeHtml(choice.text)}</button>`;
  }).join('');

  let feedbackHtml = '';
  let footerHtml = '';
  if (reviewState.answered){
    const chosen = q.choices[reviewState.chosenIndex];
    feedbackHtml = `<div class="story-feedback ${chosen.correct ? 'good' : 'bad'}">${chosen.correct ? t('feedback_good_default') : t('feedback_bad_default')}</div>`;
    footerHtml = `<button type="button" class="btn btn-primary" data-review-next>${t('flash_next')}</button>`;
  }

  root.innerHTML = `
    <div class="card review-card-wrap">
      <p class="review-progress">${t('review_progress', { current: reviewState.index + 1, total: reviewState.order.length })}</p>
      <p class="review-topic-tag">${escapeHtml(q.topicTitle)}</p>
      <h2 class="review-question">${escapeHtml(q.question)}</h2>
      <div class="story-choices">${choicesHtml}</div>
      ${feedbackHtml}
      <div class="flashcard-controls">${footerHtml}</div>
    </div>`;

  root.querySelectorAll('[data-review-choice]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (reviewState.answered) return;
      const i = Number(btn.dataset.reviewChoice);
      reviewState.answered = true;
      reviewState.chosenIndex = i;
      if (q.choices[i].correct){
        reviewState.correct += 1;
      } else {
        reviewState.missed.push({ id: q.topicId, title: q.topicTitle });
      }
      renderReview();
    });
  });
  const nextBtn = root.querySelector('[data-review-next]');
  if (nextBtn) nextBtn.addEventListener('click', () => {
    reviewState.index += 1;
    reviewState.answered = false;
    reviewState.chosenIndex = null;
    renderReview();
  });
}

function renderReviewDone(root){
  const total = reviewState.order.length;
  const seen = new Set();
  const missedUnique = [];
  reviewState.missed.forEach(m => { if (!seen.has(m.id)){ seen.add(m.id); missedUnique.push(m); } });

  const missedHtml = missedUnique.length ? `
    <div class="review-missed">
      <h3>${t('review_missed_heading')}</h3>
      <ul class="recap-list review-missed-list">
        ${missedUnique.map(m => `<li><a href="topic.html?id=${encodeURIComponent(m.id)}">${escapeHtml(m.title)}</a></li>`).join('')}
      </ul>
    </div>` : `<p class="review-perfect">${t('review_perfect_note')}</p>`;

  root.innerHTML = `
    <div class="card review-card-wrap">
      <div class="speak-summary">
        <div class="story-complete__badge">${missedUnique.length ? '🎉' : '🏆'}</div>
        <h2>${t('review_done_heading')}</h2>
        <p>${t('review_done_score', { correct: reviewState.correct, total })}</p>
        ${missedHtml}
        <button type="button" class="btn btn-primary" data-review-restart>${t('review_restart_btn')}</button>
      </div>
    </div>`;

  root.querySelector('[data-review-restart]').addEventListener('click', () => {
    resetReview();
    renderReview();
  });
}

function initReviewPage(){
  resetReview();
  renderReview();
  window.addEventListener('safetylib:langchange', () => { resetReview(); renderReview(); });
}

