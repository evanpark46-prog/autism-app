/* ==========================================================================
   Safety Superheroes — Certificate (certificate.html)
   A printable "Certificate of Achievement" for a completed lesson, shown
   with that lesson's own hero. Requires the topic to actually be complete
   (same levelCompletes signal the home page checkmark / badges page use) --
   visiting with no id, an unknown id, or an unfinished topic sends the
   learner to their badges instead of printing a certificate for nothing.
   ========================================================================== */

function initCertificatePage(){
  const root = document.querySelector('[data-certificate-root]');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const meta = params.get('id') ? getTopicMeta(params.get('id')) : null;
  if (!meta){
    window.location.href = 'badges.html';
    return;
  }

  const analytics = loadAnalytics();
  const done = !!(analytics.topics[meta.id] && analytics.topics[meta.id].levelCompletes > 0);

  const LEARNER_NAME_KEY = 'safetylib_learner_name';
  function getLearnerName(){ try { return localStorage.getItem(LEARNER_NAME_KEY) || ''; } catch (e) { return ''; } }
  function setLearnerName(name){ try { localStorage.setItem(LEARNER_NAME_KEY, name); } catch (e) { /* ignore */ } }

  function render(){
    const lang = getLang();

    if (!done){
      root.innerHTML = `
        <section class="hero">
          <h1 data-i18n="certificate_locked_title">Not finished yet</h1>
          <p>${escapeHtml(t('certificate_locked_body', { title: getTopicSummary(meta.id, lang).title }))}</p>
          <p class="hero-actions">
            <a class="btn btn-primary" href="topic.html?id=${encodeURIComponent(meta.id)}">${t('certificate_locked_cta')}</a>
          </p>
        </section>`;
      applyStaticI18n(root);
      return;
    }

    const content = getTopicSummary(meta.id, lang);
    const hero = heroFor(meta.id);
    const heroData = hero ? (hero[lang] || hero.en) : null;
    const today = new Date().toLocaleDateString(lang === 'es' ? 'es' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    root.innerHTML = `
      <section class="hero no-print">
        <h1 data-i18n="certificate_title">Certificate of Achievement</h1>
        <p data-i18n="certificate_lead">Print this out, or just admire it on screen.</p>
      </section>
      <div class="certificate-sheet comic-panel" data-theme="${meta.theme}">
        ${heroData ? heroPortraitHtml(meta.id, lang, meta.theme, 110) : ''}
        <p class="certificate-kicker font-comic">${t('certificate_kicker')}</p>
        <label class="certificate-name-label visually-hidden" for="certificate-name">${t('certificate_name_label')}</label>
        <input type="text" id="certificate-name" class="certificate-name" data-certificate-name
          placeholder="${escapeHtml(t('certificate_name_placeholder'))}" value="${escapeHtml(getLearnerName())}">
        <p class="certificate-body">${escapeHtml(t('certificate_body', { title: content.title }))}</p>
        ${heroData ? `<p class="certificate-hero font-comic">${escapeHtml(t('certificate_hero_line', { name: heroData.name, power: heroData.power }))}</p>` : ''}
        <p class="certificate-date">${escapeHtml(today)}</p>
      </div>
      <p class="hero-actions no-print">
        <button type="button" class="btn btn-primary btn-lg" data-certificate-print>${t('certificate_print_btn')}</button>
        <a class="btn btn-secondary" href="badges.html">${t('certificate_back_link')}</a>
      </p>`;

    const nameInput = root.querySelector('[data-certificate-name]');
    if (nameInput) nameInput.addEventListener('input', () => setLearnerName(nameInput.value));
    const printBtn = root.querySelector('[data-certificate-print]');
    if (printBtn) printBtn.addEventListener('click', () => window.print());
  }

  render();
  window.addEventListener('safetylib:langchange', render);
}
