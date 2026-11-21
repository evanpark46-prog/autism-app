/* ========================================================================
   Safety Superheroes — local practice-path recommendations
   Curated goal mappings and on-device lesson progress; no AI service or
   learner details are sent anywhere.
   ======================================================================== */

const PRACTICE_PATH_KEY = 'safetylib_practice_path_v1';
const PRACTICE_PATH_GOALS = [
  { id: 'outings', labelKey: 'practice_path_goal_outings', topics: ['plan-safety', 'street-safety', 'lost-safety', 'safehelper-safety'] },
  { id: 'emergency', labelKey: 'practice_path_goal_emergency', topics: ['emergency-safety', 'fire-safety', 'firstaid-safety', 'seizure-safety', 'plan-safety'] },
  { id: 'boundaries', labelKey: 'practice_path_goal_boundaries', topics: ['selfadvocacy-safety', 'body-boundaries-safety', 'reporting-safety', 'dating-safety'] },
  { id: 'online', labelKey: 'practice_path_goal_online', topics: ['online-safety', 'privacy-safety', 'cyberbullying-safety', 'citizenship-safety'] },
  { id: 'speaking', labelKey: 'practice_path_goal_speaking', topics: ['selfadvocacy-safety', 'reporting-safety', 'peer-pressure-safety', 'bullying-safety', 'rights-safety'] },
];

function readPracticePath(){
  try {
    const saved = JSON.parse(localStorage.getItem(PRACTICE_PATH_KEY) || 'null');
    if (!saved || !PRACTICE_PATH_GOALS.some(goal => goal.id === saved.goal)) return null;
    const topicIds = Array.isArray(saved.topicIds)
      ? saved.topicIds.filter(id => getTopicMeta(id))
      : [];
    if (!topicIds.length) return null;
    return {
      goal: saved.goal,
      length: saved.length === 2 ? 2 : 3,
      prioritizeNew: saved.prioritizeNew !== false,
      topicIds,
    };
  } catch (e) { return null; }
}

function writePracticePath(path){
  try { localStorage.setItem(PRACTICE_PATH_KEY, JSON.stringify(path)); } catch (e) { /* storage may be unavailable */ }
}

function eligiblePathTopics(goal, ageBand){
  return goal.topics.filter(id => {
    const meta = getTopicMeta(id);
    return meta && topicMatchesAgeBand(meta, ageBand);
  });
}

function renderPracticePath(){
  const section = document.querySelector('[data-practice-path]');
  const content = document.querySelector('[data-practice-path-content]');
  if (!section || !content) return;
  if (typeof hasChosenAgeBand === 'function' && !hasChosenAgeBand()){
    section.hidden = true;
    return;
  }

  section.hidden = false;
  const ageBand = typeof getAgeBand === 'function' ? getAgeBand() : 'all';
  const availableGoals = PRACTICE_PATH_GOALS.filter(goal => eligiblePathTopics(goal, ageBand).length);
  const saved = readPracticePath();
  const selectedGoal = availableGoals.find(goal => goal.id === (saved && saved.goal)) || availableGoals[0];
  const selectedLength = saved ? saved.length : 3;
  const prioritizeNew = saved ? saved.prioritizeNew : true;
  const goalOptions = PRACTICE_PATH_GOALS.map(goal => {
    const unavailable = !eligiblePathTopics(goal, ageBand).length;
    const label = t(goal.labelKey) + (unavailable ? ' — ' + t('practice_path_goal_unavailable') : '');
    return `<option value="${goal.id}" ${selectedGoal && selectedGoal.id === goal.id ? 'selected' : ''} ${unavailable ? 'disabled' : ''}>${escapeHtml(label)}</option>`;
  }).join('');

  let resultHtml = '';
  if (saved){
    const goal = PRACTICE_PATH_GOALS.find(item => item.id === saved.goal);
    const analytics = loadAnalytics();
    const completedCount = saved.topicIds.filter(id => analytics.topics[id] && analytics.topics[id].levelCompletes > 0).length;
    const steps = saved.topicIds.map((id, index) => {
      const summary = getTopicSummary(id, getLang());
      const done = analytics.topics[id] && analytics.topics[id].levelCompletes > 0;
      return `<li class="practice-path__step">
        <span class="practice-path__number" aria-hidden="true">${index + 1}</span>
        <a href="topic.html?id=${encodeURIComponent(id)}">${escapeHtml(summary.title)}</a>
        <span class="practice-path__status">${escapeHtml(t(done ? 'practice_path_done' : 'practice_path_next'))}</span>
      </li>`;
    }).join('');
    resultHtml = `
      <div class="practice-path__result" aria-live="polite">
        <div class="practice-path__result-head">
          <h3>${escapeHtml(t('practice_path_result_title'))}: ${escapeHtml(t(goal.labelKey))}</h3>
          <button type="button" class="btn btn-small" data-practice-path-clear>${escapeHtml(t('practice_path_clear_btn'))}</button>
        </div>
        <p class="practice-path__saved">${escapeHtml(t('practice_path_saved'))}</p>
        <ol class="practice-path__steps">${steps}</ol>
        ${completedCount === saved.topicIds.length ? `<p class="practice-path__note">${escapeHtml(t('practice_path_all_done'))}</p>` : ''}
      </div>`;
  }

  content.innerHTML = `
    <form class="practice-path__form" data-practice-path-form>
      <label class="practice-path__field">
        ${escapeHtml(t('practice_path_goal_label'))}
        <select name="goal" data-practice-path-goal>${goalOptions}</select>
      </label>
      <label class="practice-path__field">
        ${escapeHtml(t('practice_path_length_label'))}
        <select name="length" data-practice-path-length>
          <option value="2" ${selectedLength === 2 ? 'selected' : ''}>${escapeHtml(t('practice_path_length_two'))}</option>
          <option value="3" ${selectedLength === 3 ? 'selected' : ''}>${escapeHtml(t('practice_path_length_three'))}</option>
        </select>
      </label>
      <label class="practice-path__check">
        <input type="checkbox" name="prioritizeNew" data-practice-path-prioritize ${prioritizeNew ? 'checked' : ''}>
        <span>${escapeHtml(t('practice_path_prioritize_label'))}</span>
      </label>
      <button type="submit" class="btn btn-primary">${escapeHtml(t('practice_path_build_btn'))}</button>
    </form>
    ${resultHtml}`;

  const form = content.querySelector('[data-practice-path-form]');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const goal = PRACTICE_PATH_GOALS.find(item => item.id === form.querySelector('[data-practice-path-goal]').value);
    if (!goal) return;
    const ids = eligiblePathTopics(goal, ageBand);
    if (!ids.length){
      content.querySelector('[data-practice-path-result-message]')?.remove();
      form.insertAdjacentHTML('afterend', `<p class="practice-path__note" data-practice-path-result-message>${escapeHtml(t('practice_path_empty'))}</p>`);
      return;
    }
    const analytics = loadAnalytics();
    const prioritize = form.querySelector('[data-practice-path-prioritize]').checked;
    const ordered = prioritize
      ? ids.sort((a, b) => Number(!!(analytics.topics[a] && analytics.topics[a].levelCompletes)) - Number(!!(analytics.topics[b] && analytics.topics[b].levelCompletes)))
      : ids;
    const length = Number(form.querySelector('[data-practice-path-length]').value) === 2 ? 2 : 3;
    writePracticePath({ goal: goal.id, length, prioritizeNew: prioritize, topicIds: ordered.slice(0, length) });
    renderPracticePath();
  });

  const clearButton = content.querySelector('[data-practice-path-clear]');
  if (clearButton){
    clearButton.addEventListener('click', () => {
      try { localStorage.removeItem(PRACTICE_PATH_KEY); } catch (e) { /* ignore */ }
      renderPracticePath();
    });
  }
}

function initPracticePath(){
  renderPracticePath();
  window.addEventListener('safetylib:langchange', renderPracticePath);
  window.addEventListener('safetylib:agebandchange', renderPracticePath);
}