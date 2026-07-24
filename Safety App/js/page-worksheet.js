/* ==========================================================================
   Safety Scouts — Printable worksheets (worksheet.html)
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
        <div class="topic-card__icon"><img src="${meta.image}" alt="" loading="lazy"></div>
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

function initWorksheetPage(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
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
  renderWorksheet(id);
  window.addEventListener('safetylib:langchange', () => renderWorksheet(id));
}

