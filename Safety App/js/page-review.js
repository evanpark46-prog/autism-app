/* ==========================================================================
   Safety Superheroes — Cumulative review (review.html)
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Cumulative review — one fresh question from every topic                */
/* ---------------------------------------------------------------------- */

let reviewState = null;
let reviewLoadToken = 0;
const REVIEW_HISTORY_KEY = 'safetylib_review_question_history_v1';

function buildReviewQuestionBank(lang){
  return TOPICS.flatMap(meta => {
    const content = getTopicContent(meta.id, lang);
    if (!content || !content.story || !Array.isArray(content.story.levels)) return [];
    return content.story.levels.flatMap((level, levelIndex) => (level.steps || [])
      .filter(step => ['decision', 'sequence', 'dialogue'].includes(step.type)
        && step.choices && step.choices.length > 1
        && step.choices.filter(choice => choice.correct).length === 1)
      .map((step, stepIndex) => {
        const dialogueLine = step.type === 'dialogue' && step.lines && step.lines[step.lines.length - 1];
        const question = dialogueLine
          ? t('review_dialogue_question', { text: dialogueLine.text })
          : step.text;
        if (!question) return null;
        return {
          id: `${meta.id}:${levelIndex}:${stepIndex}`,
          topicId: meta.id,
          topicTitle: content.title,
          question,
          choices: step.choices,
        };
      })
      .filter(Boolean));
  });
}

function readReviewHistory(lang){
  try {
    const allHistory = JSON.parse(localStorage.getItem(REVIEW_HISTORY_KEY) || '{}');
    return allHistory[lang] && typeof allHistory[lang] === 'object' ? allHistory[lang] : {};
  } catch (e) { return {}; }
}

function writeReviewHistory(lang, history){
  try {
    const allHistory = JSON.parse(localStorage.getItem(REVIEW_HISTORY_KEY) || '{}');
    allHistory[lang] = history;
    localStorage.setItem(REVIEW_HISTORY_KEY, JSON.stringify(allHistory));
  } catch (e) { /* storage may be unavailable */ }
}

function selectReviewQuestions(questionBank, lang){
  const history = readReviewHistory(lang);
  const byTopic = new Map();
  questionBank.forEach(question => {
    if (!byTopic.has(question.topicId)) byTopic.set(question.topicId, []);
    byTopic.get(question.topicId).push(question);
  });

  const selected = [];
  byTopic.forEach((topicQuestions, topicId) => {
    const availableIds = new Set(topicQuestions.map(question => question.id));
    const seen = (Array.isArray(history[topicId]) ? history[topicId] : [])
      .filter(id => availableIds.has(id));
    const unseen = topicQuestions.filter(question => !seen.includes(question.id));
    const candidates = unseen.length ? unseen : topicQuestions;
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    selected.push(chosen);
    history[topicId] = unseen.length ? seen.concat(chosen.id) : [chosen.id];
  });

  writeReviewHistory(lang, history);
  return selected;
}

function shuffledIndexOrder(n){
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

async function resetReview(){
  const lang = getLang();
  const token = ++reviewLoadToken;
  reviewState = { lang, loading: true };
  renderReview();
  try {
    await Promise.all(TOPICS.map(meta => ensureTopicContentLoaded(meta.id)));
  } catch (error) {
    if (token !== reviewLoadToken || lang !== getLang()) return;
    reviewState = { lang, error: true };
    renderReview();
    return;
  }
  if (token !== reviewLoadToken || lang !== getLang()) return;

  const questionBank = buildReviewQuestionBank(lang);
  const questions = selectReviewQuestions(questionBank, lang);
  reviewState = {
    lang,
    questions,
    questionBankSize: questionBank.length,
    order: shuffledIndexOrder(questions.length),
    index: 0,
    correct: 0,
    answered: false,
    chosenIndex: null,
    missed: [],
  };
  renderReview();
}

function renderReview(){
  const root = document.querySelector('[data-review-root]');
  if (!root) return;
  if (!reviewState || reviewState.lang !== getLang()){
    resetReview();
    return;
  }
  if (reviewState.loading){
    root.innerHTML = `<div class="card review-card-wrap"><p role="status">${escapeHtml(t('review_loading'))}</p></div>`;
    return;
  }
  if (reviewState.error){
    root.innerHTML = `<div class="card review-card-wrap"><p role="alert">${escapeHtml(t('review_load_error'))}</p><button type="button" class="btn btn-primary" data-review-retry>${escapeHtml(t('review_retry_btn'))}</button></div>`;
    root.querySelector('[data-review-retry]').addEventListener('click', resetReview);
    return;
  }

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
      <p class="review-progress">${t('review_progress', { current: reviewState.index + 1, total: reviewState.order.length, pool: reviewState.questionBankSize })}</p>
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
  });
}

function initReviewPage(){
  resetReview();
  window.addEventListener('safetylib:langchange', resetReview);
}

