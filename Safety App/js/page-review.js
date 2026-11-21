/* ==========================================================================
   Safety Superheroes — Cumulative review (review.html)
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Cumulative review — one fresh question from every topic                */
/* ---------------------------------------------------------------------- */

let reviewState = null;
let reviewLoadToken = 0;
const REVIEW_HISTORY_KEY = 'safetylib_review_question_history_v2';
const REVIEW_LEVEL_KEY = 'safetylib_review_level';
const REVIEW_ROUND_SIZE = 10;
// Easy = the Pre-K–K story level (short, plain questions, 2 answer choices
// max) from the lessons meant for young kids, so every age can play;
// Medium / Challenge use the older story levels and more lessons.
const REVIEW_LEVELS = [
  { id: 'easy', levelIndex: 0, maxChoices: 2, bands: ['toddler'], labelKey: 'review_level_easy' },
  { id: 'medium', levelIndex: 1, maxChoices: 3, bands: ['toddler', 'youth'], labelKey: 'review_level_medium' },
  { id: 'hard', levelIndex: 2, maxChoices: 4, bands: null, labelKey: 'review_level_hard' },
];

function currentReviewLevel(){
  let id = null;
  try { id = localStorage.getItem(REVIEW_LEVEL_KEY); } catch (e) { /* ignore */ }
  return REVIEW_LEVELS.find(l => l.id === id) || REVIEW_LEVELS[0];
}

// Keep the right answer plus up to (max - 1) wrong ones, in shuffled order.
function reviewChoicesFor(question, maxChoices){
  const right = question.choices.filter(c => c.correct);
  const wrong = question.choices.filter(c => !c.correct);
  const keepWrong = shuffledIndexOrder(wrong.length).slice(0, Math.max(1, maxChoices - 1)).map(i => wrong[i]);
  const all = right.concat(keepWrong);
  return shuffledIndexOrder(all.length).map(i => all[i]);
}

function buildReviewQuestionBank(lang, reviewLevel){
  return TOPICS.flatMap(meta => {
    if (reviewLevel.bands && !(meta.ageBands || []).some(b => reviewLevel.bands.includes(b))) return [];
    const content = getTopicContent(meta.id, lang);
    if (!content || !content.story || !Array.isArray(content.story.levels) || !content.story.levels.length) return [];
    const levelIndex = Math.min(reviewLevel.levelIndex, content.story.levels.length - 1);
    const steps = content.story.levels[levelIndex].steps || [];
    return steps.map((step, stepIndex) => {
      // Stand-alone questions only: conversation lines don't make sense
      // without the story around them.
      if (!['decision', 'sequence'].includes(step.type) || !step.text) return null;
      if (!step.choices || step.choices.length < 2 || step.choices.filter(c => c.correct).length !== 1) return null;
      const prev = steps[stepIndex - 1];
      return {
        id: `${meta.id}:${levelIndex}:${stepIndex}`,
        topicId: meta.id,
        topicTitle: content.title,
        theme: meta.theme,
        scene: prev && prev.type === 'narrative' ? prev.text : '',
        question: step.text,
        choices: step.choices,
      };
    }).filter(Boolean);
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

function selectReviewQuestions(questionBank, lang, reviewLevel){
  const allHistory = readReviewHistory(lang);
  const history = allHistory[reviewLevel.id] && typeof allHistory[reviewLevel.id] === 'object' ? allHistory[reviewLevel.id] : {};
  const byTopic = new Map();
  questionBank.forEach(question => {
    if (!byTopic.has(question.topicId)) byTopic.set(question.topicId, []);
    byTopic.get(question.topicId).push(question);
  });

  // One not-yet-seen question per topic...
  const perTopic = [];
  byTopic.forEach((topicQuestions, topicId) => {
    const seen = Array.isArray(history[topicId]) ? history[topicId] : [];
    const unseen = topicQuestions.filter(q => !seen.includes(q.id));
    const candidates = unseen.length ? unseen : topicQuestions;
    perTopic.push(candidates[Math.floor(Math.random() * candidates.length)]);
  });

  // ...then REVIEW_ROUND_SIZE different topics, favouring topics that have
  // gone longest without a turn.
  const rotation = Array.isArray(history._topics) ? history._topics : [];
  const shuffled = shuffledIndexOrder(perTopic.length).map(i => perTopic[i]);
  shuffled.sort((a, b) => rotation.indexOf(a.topicId) - rotation.indexOf(b.topicId));
  const round = shuffled.slice(0, REVIEW_ROUND_SIZE)
    .map(q => Object.assign({}, q, { choices: reviewChoicesFor(q, reviewLevel.maxChoices) }));

  round.forEach(q => {
    const seen = Array.isArray(history[q.topicId]) ? history[q.topicId] : [];
    const total = byTopic.get(q.topicId).length;
    const next = seen.includes(q.id) ? seen : seen.concat(q.id);
    history[q.topicId] = next.length >= total ? [] : next;
  });
  history._topics = rotation.filter(id => !round.some(q => q.topicId === id)).concat(round.map(q => q.topicId));
  allHistory[reviewLevel.id] = history;
  writeReviewHistory(lang, allHistory);
  return round;
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

  const reviewLevel = currentReviewLevel();
  const questionBank = buildReviewQuestionBank(lang, reviewLevel);
  const questions = selectReviewQuestions(questionBank, lang, reviewLevel);
  reviewState = {
    lang,
    level: reviewLevel.id,
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
  const hero = typeof animalHeroSvg === 'function' ? animalHeroSvg(q.topicId, q.theme || 'blue', '') : '';
  const levelPicker = reviewState.index === 0 && !reviewState.answered ? `
      <div class="review-level" role="group" aria-label="${escapeHtml(t('review_level_label'))}">
        <span class="review-level__label">${escapeHtml(t('review_level_label'))}</span>
        ${REVIEW_LEVELS.map(l => `<button type="button" class="review-level__btn" data-review-level="${l.id}" aria-pressed="${l.id === reviewState.level}">${escapeHtml(t(l.labelKey))}</button>`).join('')}
      </div>` : '';
  const canSpeak = typeof speak === 'function' && typeof SPEECH_SUPPORTED !== 'undefined' && SPEECH_SUPPORTED;
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
    const right = q.choices.find(c => c.correct);
    const why = (chosen.correct ? chosen.feedback : (chosen.feedback || (right && right.feedback))) || '';
    feedbackHtml = `<div class="story-feedback ${chosen.correct ? 'good' : 'bad'}" role="status"><strong>${chosen.correct ? t('feedback_good_default') : t('feedback_bad_default')}</strong>${why ? ` ${escapeHtml(why)}` : ''}</div>`;
    footerHtml = `<button type="button" class="btn btn-primary" data-review-next>${t('flash_next')}</button>`;
  }

  root.innerHTML = `
    <div class="card review-card-wrap">
      ${levelPicker}
      <p class="review-progress">${t('review_progress', { current: reviewState.index + 1, total: reviewState.order.length, pool: reviewState.questionBankSize })}</p>
      <div class="review-progress-bar" aria-hidden="true"><span style="width:${Math.round(reviewState.index / reviewState.order.length * 100)}%"></span></div>
      <p class="review-topic-tag">${hero ? `<span class="review-hero" aria-hidden="true">${hero}</span>` : ''}${escapeHtml(q.topicTitle)}</p>
      ${q.scene ? `<p class="review-scene">${escapeHtml(q.scene)}</p>` : ''}
      <h2 class="review-question">${escapeHtml(q.question)}</h2>
      ${canSpeak ? `<button type="button" class="btn btn-secondary review-listen" data-review-listen>${escapeHtml(t('review_listen'))}</button>` : ''}
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
  root.querySelectorAll('[data-review-level]').forEach(btn => btn.addEventListener('click', () => {
    try { localStorage.setItem(REVIEW_LEVEL_KEY, btn.dataset.reviewLevel); } catch (e) { /* ignore */ }
    resetReview();
  }));
  const listen = root.querySelector('[data-review-listen]');
  if (listen) listen.addEventListener('click', () => {
    const parts = [q.scene, q.question].concat(q.choices.map((c, i) => `${i + 1}. ${c.text}`)).filter(Boolean);
    speak(parts.join(' '));
  });
  const nextBtn = root.querySelector('[data-review-next]');
  if (nextBtn) nextBtn.addEventListener('click', () => {
    if (typeof stopSpeaking === 'function') stopSpeaking();
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

