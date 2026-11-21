/* ==========================================================================
   Safety Superheroes — Printable worksheets (worksheet.html)
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Printable worksheets (derived from each topic's video checkpoints)    */
/* ---------------------------------------------------------------------- */

function renderWorksheetChooser(){
  const grid = document.querySelector('[data-worksheet-grid]');
  if (!grid) return;
  const lang = getLang();
  grid.innerHTML = TOPICS.map(meta => {
    const content = getTopicSummary(meta.id, lang);
    return `
      <a class="topic-card" data-theme="${meta.theme}" href="worksheet.html?id=${encodeURIComponent(meta.id)}">
        <div class="topic-card__icon"><img src="${meta.image}" alt="" loading="lazy" decoding="async" width="64" height="64"></div>
        <h3>${escapeHtml(content.title)}</h3>
        <p>${escapeHtml(content.tagline)}</p>
      </a>`;
  }).join('');
}

function renderWorksheet(id){
  const root = document.querySelector('[data-worksheet-root]');
  if (!root) return;
  const meta = getTopicMeta(id);
  if (!meta){
    root.innerHTML = `
      <p>${t('worksheet_not_found')}</p>
      <p><a href="worksheet.html">${t('worksheet_choose_another')}</a></p>`;
    return;
  }

  const content = getTopicSummary(id, getLang());
  const checkpoints = (content.video && content.video.checkpoints) || [];

  const questionsHtml = checkpoints.map((cp, i) => `
    <div class="worksheet-question">
      <p class="worksheet-question__text"><strong>${i + 1}.</strong> ${escapeHtml(cp.question)}</p>
      <div class="worksheet-choices">
        ${cp.choices.map(c => `
          <label class="worksheet-choice">
            <span class="worksheet-checkbox" aria-hidden="true">☐</span> ${escapeHtml(c.text)}
          </label>`).join('')}
      </div>
    </div>`).join('');

  const answerKeyHtml = checkpoints.map((cp, i) => {
    const correct = cp.choices.find(c => c.correct);
    return `<li>${escapeHtml(cp.question)} — <strong>${escapeHtml(correct ? correct.text : '')}</strong></li>`;
  }).join('');

  root.innerHTML = `
    <div class="worksheet-page">
      <div class="worksheet-toolbar no-print">
        <a href="topic.html?id=${encodeURIComponent(id)}" class="btn btn-ghost">${t('worksheet_back_to_topic')}</a>
        <button type="button" class="btn btn-primary" data-worksheet-print>${t('worksheet_print_btn')}</button>
      </div>
      <div class="worksheet-sheet">
        <div class="worksheet-fields">
          <span>${t('worksheet_name_label')} _______________________</span>
          <span>${t('worksheet_date_label')} _______________________</span>
        </div>
        <h1>${escapeHtml(content.title)}</h1>
        <p class="worksheet-instructions">${t('worksheet_instructions')}</p>
        ${checkpoints.length ? questionsHtml : `<p class="worksheet-empty">${t('worksheet_no_checkpoints')}</p>`}
        <p class="worksheet-writing-prompt">${t('worksheet_writing_prompt')}</p>
        <div class="worksheet-writing-lines">
          <div class="worksheet-line"></div>
          <div class="worksheet-line"></div>
          <div class="worksheet-line"></div>
        </div>
      </div>
      ${checkpoints.length ? `
      <div class="worksheet-answer-key no-print">
        <h2>${t('worksheet_answer_key_heading')}</h2>
        <ol>${answerKeyHtml}</ol>
      </div>` : ''}
    </div>`;

  const printBtn = root.querySelector('[data-worksheet-print]');
  if (printBtn) printBtn.addEventListener('click', () => window.print());
}

/* ---------------------------------------------------------------------- */
/* Practice-at-home worksheet for one story level (?id=X&level=N)         */
/* Auto-built from the level's story steps, "what happens next" outcome   */
/* chains, flashcards, recap and practicePrompt -- no per-topic authoring. */
/* ---------------------------------------------------------------------- */

const PRACTICE_TALK_MAX = 5;

function practiceSituationText(step){
  if (step.type === 'dialogue'){
    return step.lines.map(l => `${l.speaker ? l.speaker + ': ' : ''}${l.text}`).join('\n');
  }
  const before = step.type === 'sequence' && step.stepsSoFar
    ? step.stepsSoFar.map((s, i) => `${i + 1}. ${s}`).join('\n') + '\n'
    : '';
  return before + (step.text || '');
}

function renderPracticeWorksheet(id, levelIdx){
  const root = document.querySelector('[data-worksheet-root]');
  if (!root) return;
  const meta = getTopicMeta(id);
  const content = meta && getTopicContent(id, getLang());
  const level = content && content.story && content.story.levels[levelIdx];
  if (!level){
    root.innerHTML = `
      <p>${t('worksheet_not_found')}</p>
      <p><a href="worksheet.html">${t('worksheet_choose_another')}</a></p>`;
    return;
  }

  const choiceSteps = level.steps.filter(s => s.choices && s.choices.some(c => c.correct));
  const talkItems = [];
  choiceSteps.forEach(step => {
    const wrong = step.choices.find(c => !c.correct && c.outcome);
    if (wrong && talkItems.length < PRACTICE_TALK_MAX) talkItems.push({ step, wrong });
  });
  const cards = (level.flashcards && level.flashcards.length ? level.flashcards : (content.flashcards || [])).slice(0, 8);
  const recap = level.recap || [];
  const lines = n => `<div class="worksheet-writing-lines">${'<div class="worksheet-line"></div>'.repeat(n)}</div>`;
  const multiline = s => escapeHtml(s).replace(/\n/g, '<br>');

  const situationsHtml = choiceSteps.map((step, i) => `
    <div class="worksheet-question">
      <p class="worksheet-question__text"><strong>${i + 1}.</strong> ${multiline(practiceSituationText(step))}</p>
      <div class="worksheet-choices">
        ${step.choices.map(c => `
          <div class="worksheet-choice"><span class="worksheet-checkbox" aria-hidden="true">☐</span> ${escapeHtml(c.text)}</div>`).join('')}
      </div>
    </div>`).join('');

  const talkHtml = talkItems.map(({ wrong }, i) => `
    <div class="worksheet-question">
      <p class="worksheet-question__text"><strong>${String.fromCharCode(65 + i)}.</strong> ${escapeHtml(t('practice_ws_what_if', { choice: wrong.text }))}</p>
      <ol class="practice-ws-chain">
        <li>${escapeHtml(t('practice_ws_first'))} ____________________________</li>
        <li>${escapeHtml(t('practice_ws_then'))} ____________________________</li>
        <li>${escapeHtml(t('practice_ws_so'))} ____________________________</li>
      </ol>
    </div>`).join('');

  const sayHtml = cards.map(card => `
    <div class="practice-ws-say">
      <span class="worksheet-checkbox" aria-hidden="true">☐</span>
      <div><div class="practice-ws-say__front">${escapeHtml(card.front)}</div>
      <div class="practice-ws-say__back">${escapeHtml(card.back)}</div></div>
    </div>`).join('');

  const answerKeyHtml = `
    <h2>${t('practice_ws_key_heading')}</h2>
    <h3>${t('practice_ws_part1')}</h3>
    <ol>${choiceSteps.map(step => {
      const right = step.choices.find(c => c.correct);
      return `<li><strong>${escapeHtml(right.text)}</strong>${right.feedback ? ` — ${escapeHtml(right.feedback)}` : ''}</li>`;
    }).join('')}</ol>
    ${talkItems.length ? `<h3>${t('practice_ws_part2')}</h3>
    <ol type="A">${talkItems.map(({ wrong }) => `
      <li><em>${escapeHtml(wrong.text)}</em>
        <ol class="practice-ws-chain">${wrong.outcome.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ol>
        <p class="practice-ws-lesson">${escapeHtml(wrong.feedback || '')}</p>
      </li>`).join('')}</ol>` : ''}`;

  root.innerHTML = `
    <div class="worksheet-page">
      <div class="worksheet-toolbar no-print">
        <a href="topic.html?id=${encodeURIComponent(id)}" class="btn btn-ghost">${t('worksheet_back_to_topic')}</a>
        <label class="practice-ws-keytoggle"><input type="checkbox" data-print-key checked> ${t('practice_ws_print_key')}</label>
        <button type="button" class="btn btn-primary" data-worksheet-print>${t('worksheet_print_btn')}</button>
      </div>
      <div class="worksheet-sheet">
        <div class="worksheet-fields">
          <span>${t('worksheet_name_label')} _______________________</span>
          <span>${t('worksheet_date_label')} _______________________</span>
        </div>
        <p class="practice-ws-kicker">${t('practice_ws_kicker')} · ${t(`level${levelIdx + 1}_label`)} — ${t(`level${levelIdx + 1}_desc`)}</p>
        <h1>${escapeHtml(content.title)}</h1>
        <div class="practice-ws-howto">
          <strong>${t('practice_ws_howto_heading')}</strong>
          <ol>
            <li>${t('practice_ws_howto_1')}</li>
            <li>${t('practice_ws_howto_2')}</li>
            <li>${t('practice_ws_howto_3')}</li>
          </ol>
        </div>

        <h2>${t('practice_ws_part1')}</h2>
        <p class="worksheet-instructions">${t('practice_ws_part1_lead')}</p>
        ${situationsHtml}

        ${talkItems.length ? `
        <h2>${t('practice_ws_part2')}</h2>
        <p class="worksheet-instructions">${t('practice_ws_part2_lead')}</p>
        ${talkHtml}` : ''}

        ${cards.length ? `
        <h2>${t('practice_ws_part3')}</h2>
        <p class="worksheet-instructions">${t('practice_ws_part3_lead')}</p>
        <div class="practice-ws-say-grid">${sayHtml}</div>` : ''}

        <h2>${t('practice_ws_part4')}</h2>
        ${content.practicePrompt ? `<p class="practice-ws-prompt">${escapeHtml(content.practicePrompt)}</p>` : ''}
        <div class="practice-ws-adults">
          <strong>${t('practice_ws_my_adults')}</strong>
          <ol>${[0, 1, 2].map(i => {
            const adults = typeof trustedAdults === 'function' ? trustedAdults() : [];
            return `<li>${adults[i] ? escapeHtml(adults[i]) : '______________________'}</li>`;
          }).join('')}</ol>
        </div>
        <ul class="practice-ws-checklist">${recap.map(r => `<li><span class="worksheet-checkbox" aria-hidden="true">☐</span> ${escapeHtml(r)}</li>`).join('')}</ul>
        <p class="worksheet-writing-prompt">${t('worksheet_writing_prompt')}</p>
        ${lines(3)}
      </div>
      <div class="worksheet-answer-key practice-ws-key" data-practice-key>${answerKeyHtml}</div>
    </div>`;

  const keyEl = root.querySelector('[data-practice-key]');
  const toggle = root.querySelector('[data-print-key]');
  const syncKey = () => keyEl.classList.toggle('no-print', !toggle.checked);
  toggle.addEventListener('change', syncKey);
  syncKey();
  root.querySelector('[data-worksheet-print]').addEventListener('click', () => window.print());
  if (typeof trackEvent === 'function') trackEvent(id, 'practice_worksheet', { level: levelIdx });
}

function practiceWorksheetLinksHtml(id){
  return `
    <div class="practice-ws-links no-print">
      <h2>${t('practice_ws_links_heading')}</h2>
      <p>${t('practice_ws_links_lead')}</p>
      <div class="hero-actions">
        ${[0, 1, 2].map(i => `<a class="btn btn-secondary" href="worksheet.html?id=${encodeURIComponent(id)}&level=${i}">${t(`level${i + 1}_label`)}</a>`).join('')}
      </div>
    </div>`;
}

function initWorksheetPage(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const levelParam = params.get('level');
  const intro = document.querySelector('[data-worksheet-intro]');
  const grid = document.querySelector('[data-worksheet-grid]');
  const root = document.querySelector('[data-worksheet-root]');

  if (!id){
    if (root) root.innerHTML = '';
    renderWorksheetChooser();
    window.addEventListener('safetylib:langchange', renderWorksheetChooser);
    return;
  }

  if (intro) intro.hidden = true;
  if (grid) grid.hidden = true;

  if (levelParam !== null && /^[0-2]$/.test(levelParam) && getTopicMeta(id)){
    const levelIdx = Number(levelParam);
    if (root) root.innerHTML = `<p>${t('practice_ws_loading')}</p>`;
    ensureTopicContentLoaded(id)
      .then(() => {
        renderPracticeWorksheet(id, levelIdx);
        window.addEventListener('safetylib:langchange', () => renderPracticeWorksheet(id, levelIdx));
      })
      .catch(() => { if (root) root.innerHTML = `<p>${t('worksheet_not_found')}</p>`; });
    return;
  }

  const renderVideoSheet = () => {
    renderWorksheet(id);
    if (root && getTopicMeta(id)) root.insertAdjacentHTML('afterbegin', practiceWorksheetLinksHtml(id));
  };
  renderVideoSheet();
  window.addEventListener('safetylib:langchange', renderVideoSheet);
}

