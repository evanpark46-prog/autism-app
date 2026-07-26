/* ==========================================================================
   Safety Scouts — Topic page (topic.html)
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Topic page                                                             */
/* ---------------------------------------------------------------------- */

function initTopicPage(){
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get('id');
  // No id at all -> friendly default (first topic). An id that doesn't match
  // any known topic is a broken/stale link -- redirect home instead of
  // silently rendering an unrelated topic.
  const meta = requestedId ? getTopicMeta(requestedId) : TOPICS[0];
  if (!meta){
    window.location.href = 'index.html';
    return;
  }

  const heroEl = document.querySelector('[data-topic-hero]');
  const titleEl = document.querySelector('[data-topic-title]');
  const taglineEl = document.querySelector('[data-topic-tagline]');

  trackEvent(meta.id, 'topic_open');

  let mode = 'story';
  const storyState = {
    level: null, index: 0, answered: false, lastCorrect: false, trackedComplete: false,
    missed: [], missedSteps: new Set(),
  };
  let activeTypewriterClear = null;
  function stopActiveTypewriter(){
    if (activeTypewriterClear){ activeTypewriterClear(); activeTypewriterClear = null; }
  }

  // Records a question the learner got wrong on their first attempt at a given
  // step (deduped per step object), so it can be re-shown as a review flashcard
  // on the level-complete screen. Doesn't fire again on repeat wrong attempts.
  function recordMiss(step, front, back){
    if (storyState.missedSteps.has(step)) return;
    storyState.missedSteps.add(step);
    storyState.missed.push({ front, back });
  }
  const flashState = { level: null, index: 0, flipped: false };
  let flashMode = 'alone';

  // "Guided" walks the learner through every card in two phases: (1) drill —
  // repeat each phrase several times before moving to the next card, since
  // repetition matters most for younger/less-verbal learners; then (2) a
  // supportive, Quizlet-style multiple-choice quiz over the same deck.
  const guidedState = {
    level: null, phase: 'drill',
    order: [], cardPos: 0, reps: 0, repsNeeded: 4,
    listening: false, activeRecognition: null, manual: false,
    lastHeardMatched: null, transcript: '',
    quizOrder: [], quizIndex: 0, quizChoices: [],
    quizWrongTries: 0, quizHint: false, quizRevealed: false,
    quizCorrect: 0, quizTotal: 0,
  };
  function repsForLevel(levelIdx){
    const reps = [5, 4, 3];
    return reps[levelIdx] || 3;
  }
  function shuffledOrder(n){
    const arr = Array.from({ length: n }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function resetGuided(levelIdx, cardCount){
    guidedState.phase = 'drill';
    guidedState.order = shuffledOrder(cardCount);
    guidedState.cardPos = 0;
    guidedState.reps = 0;
    guidedState.repsNeeded = repsForLevel(levelIdx);
    guidedState.listening = false;
    guidedState.activeRecognition = null;
    guidedState.manual = false;
    guidedState.lastHeardMatched = null;
    guidedState.transcript = '';
    guidedState.quizOrder = [];
    guidedState.quizIndex = 0;
    guidedState.quizChoices = [];
    guidedState.quizWrongTries = 0;
    guidedState.quizHint = false;
    guidedState.quizRevealed = false;
    guidedState.quizCorrect = 0;
    guidedState.quizTotal = 0;
  }
  function buildQuizChoices(cards, correctIdx){
    const correctCard = cards[correctIdx];
    const otherIdxs = cards.map((_, i) => i).filter(i => i !== correctIdx);
    const shuffledOthers = shuffledOrder(otherIdxs.length).map(i => otherIdxs[i]);
    const distractors = shuffledOthers.slice(0, Math.min(3, shuffledOthers.length))
      .map(i => ({ text: cards[i].back, correct: false, eliminated: false }));
    const choices = [{ text: correctCard.back, correct: true, eliminated: false }, ...distractors];
    return shuffledOrder(choices.length).map(i => choices[i]);
  }
  const videoState = { previewing: false, previewIndex: 0, previewAnswered: false, player: null, nextCheckpoint: 0, awaitingAnswer: false, checkpointTimer: null, embedRetried: false };

  function currentContent(){
    return getTopicContent(meta.id, getLang());
  }

  function renderHero(){
    const content = currentContent();
    if (heroEl) heroEl.dataset.theme = meta.theme;
    if (titleEl) titleEl.textContent = content.title;
    if (taglineEl) taglineEl.textContent = content.tagline;
    document.title = `${content.title} — ${t('brand')}`;
    renderHeroPin();
  }

  function renderHeroPin(){
    const pinBtn = document.querySelector('[data-topic-hero-pin]');
    if (!pinBtn || typeof isFavorite !== 'function') return;
    const pinned = isFavorite(meta.id);
    pinBtn.hidden = false;
    pinBtn.classList.toggle('is-pinned', pinned);
    pinBtn.textContent = pinned ? '★' : '☆';
    pinBtn.setAttribute('aria-pressed', String(pinned));
    const label = t(pinned ? 'topic_card_unpin_label' : 'topic_card_pin_label');
    pinBtn.setAttribute('aria-label', label);
    pinBtn.title = label;
    pinBtn.onclick = () => {
      toggleFavorite(meta.id);
      renderHeroPin();
    };
  }

  function setActiveTab(nextMode){
    stopSpeaking();
    stopActiveTypewriter();
    if (mode === 'video' && nextMode !== 'video'){
      // Switching away from the Video tab shouldn't leave the video playing
      // (audio and checkpoint-skipping alike) somewhere the learner can't see it.
      clearCheckpointWatch();
      if (videoState.player && typeof videoState.player.pauseVideo === 'function'){
        videoState.player.pauseVideo();
      }
    }
    mode = nextMode;
    document.querySelectorAll('.mode-tab').forEach(tab => {
      const isActive = tab.dataset.mode === mode;
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });
    document.querySelectorAll('.mode-panel').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.panel === mode);
    });
    if (mode === 'flashcards') trackEvent(meta.id, 'flashcards_open');
    else if (mode === 'video') trackEvent(meta.id, 'video_open');
    renderActivePanel();
  }

  function renderActivePanel(){
    if (mode === 'story') renderStory();
    else if (mode === 'flashcards') renderFlashcards();
    else if (mode === 'video') renderVideo();
  }

  /* ---------------- Story mode ---------------- */

  function renderLevelChooser(panel){
    const levelKeys = [
      ['level1_label', 'level1_desc'],
      ['level2_label', 'level2_desc'],
      ['level3_label', 'level3_desc'],
    ];
    panel.innerHTML = `
      <div class="story-stage">
        <div class="story-body">
          <h2>${t('level_select_heading')}</h2>
          <p class="story-text">${t('level_select_lead')}</p>
          <div class="level-grid">
            ${levelKeys.map(([labelKey, descKey], i) => `
              <button type="button" class="level-card" data-level="${i}">
                <span class="level-card__num">${i + 1}</span>
                <span class="level-card__label">${t(labelKey)}</span>
                <span class="level-card__desc">${t(descKey)}</span>
              </button>`).join('')}
          </div>
        </div>
      </div>`;
    panel.querySelectorAll('[data-level]').forEach(btn => {
      btn.addEventListener('click', () => {
        storyState.level = Number(btn.dataset.level);
        storyState.index = 0;
        storyState.answered = false;
        storyState.chosenIndex = undefined;
        storyState.trackedComplete = false;
        storyState.missed = [];
        storyState.missedSteps = new Set();
        trackEvent(meta.id, 'level_start', { level: storyState.level });
        renderStory();
      });
    });
  }

  // Builds the "review what tripped you up" section shown on the level-complete
  // screen: one flip-card per question missed on its first attempt this
  // playthrough (front = the question, back = the correct answer + why).
  function renderReviewSectionHtml(missed){
    if (!missed.length){
      return `<p class="story-feedback good mt-lg">${t('story_review_empty')}</p>`;
    }
    return `
      <div class="mt-lg">
        <h3>${t('story_review_heading')}</h3>
        <p class="story-text">${t('story_review_lead')}</p>
        <div class="review-grid">
          ${missed.map(m => `
            <div class="review-card" data-review-card tabindex="0" role="button" aria-label="${t('flash_flip')}">
              <div class="review-card__inner">
                <div class="review-card__face review-card__face--front">${escapeHtml(m.front)}</div>
                <div class="review-card__face review-card__face--back">${escapeHtml(m.back)}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  function renderStory(){
    const panel = document.querySelector('[data-panel="story"]');
    if (!panel) return;
    stopSpeaking();
    stopActiveTypewriter();

    if (storyState.level === null){
      renderLevelChooser(panel);
      return;
    }

    const content = currentContent();
    const story = content.story;
    const level = story.levels[storyState.level];
    const steps = level.steps;
    const changeLevelBtn = `<button type="button" class="btn btn-ghost" data-change-level>${t('level_change')}</button>`;

    if (storyState.index >= steps.length){
      let justCompleted = false;
      if (!storyState.trackedComplete){
        storyState.trackedComplete = true;
        justCompleted = true;
        trackEvent(meta.id, 'level_complete', { level: storyState.level });
        if (typeof playCompletionChime === 'function') playCompletionChime();
      }
      const practiceHtml = content.practicePrompt ? `
        <div class="practice-card">
          <div class="practice-card__label">${t('story_practice_heading')}</div>
          <p>${escapeHtml(content.practicePrompt)}</p>
        </div>` : '';
      panel.innerHTML = `
        <div class="story-stage">
          <div class="story-complete">
            <div class="topic-badge ${justCompleted ? 'topic-badge--stamp' : ''}" data-theme="${meta.theme}">
              <img src="${meta.image}" alt="" width="58" height="58">
            </div>
            <h2>${t('story_complete_title')}</h2>
            <div class="speak-row center">
              <p style="margin:0" data-recap-lead>${escapeHtml(t('story_complete_lead'))}</p>
              ${speakButtonHtml()}
            </div>
            <ul class="recap-list">${level.recap.map((r, i) => `<li data-recap-item="${i}">${typeof wrapGlossaryHtml === 'function' ? wrapGlossaryHtml(r, getLang()) : escapeHtml(r)}</li>`).join('')}</ul>
            ${renderReviewSectionHtml(storyState.missed)}
            ${practiceHtml}
            <div class="hero-actions mt-lg">
              <button type="button" class="btn btn-primary" data-story-replay>${t('story_replay')}</button>
              <button type="button" class="btn btn-secondary" data-story-review-flashcards>${t('story_review_flashcards_btn')}</button>
              ${changeLevelBtn}
              <a class="btn btn-secondary" href="index.html">${t('story_back_to_topics')}</a>
            </div>
          </div>
        </div>`;
      panel.querySelector('[data-story-replay]').addEventListener('click', () => {
        storyState.index = 0;
        storyState.answered = false;
        storyState.trackedComplete = false;
        storyState.missed = [];
        storyState.missedSteps = new Set();
        renderStory();
      });
      panel.querySelector('[data-change-level]').addEventListener('click', () => {
        storyState.level = null;
        renderStory();
      });
      panel.querySelector('[data-story-review-flashcards]').addEventListener('click', () => {
        flashState.level = storyState.level;
        flashState.index = 0;
        flashState.flipped = false;
        flashMode = 'alone';
        document.querySelector('[data-mode="flashcards"]').click();
      });
      panel.querySelectorAll('[data-review-card]').forEach(card => {
        const toggle = () => card.classList.toggle('flipped');
        card.addEventListener('click', toggle);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); } });
      });
      const recapSegments = [{ el: panel.querySelector('[data-recap-lead]'), text: t('story_complete_lead') }]
        .concat(level.recap.map((r, i) => ({ el: panel.querySelector(`[data-recap-item="${i}"]`), text: r })));
      wireSpeakButtonHighlighted(panel, recapSegments, null, '. ');
      return;
    }

    const step = steps[storyState.index];
    // Visible "Step X of Y" alongside the dot row -- so a learner always
    // knows how much is left, not just relative progress from the dots.
    const dots = `
      <span class="story-progress__label">${t('story_of', { current: storyState.index + 1, total: steps.length })}</span>
      <span class="story-progress__dots">${steps.map((_, i) => {
        const cls = i < storyState.index ? 'done' : (i === storyState.index ? 'current' : '');
        return `<span class="story-progress__dot ${cls}"></span>`;
      }).join('')}</span>`;

    if (step.type === 'dialogue'){
      renderDialogueStep(panel, step, steps, dots, changeLevelBtn);
      return;
    }
    if (step.type === 'matching'){
      renderMatchingStep(panel, step, steps, dots, changeLevelBtn);
      return;
    }

    const isChoiceStep = step.type === 'decision' || step.type === 'sequence';
    let choicesHtml = '';
    let footerHtml = '';
    let feedbackHtml = '';
    const sequenceHtml = step.type === 'sequence' && step.stepsSoFar
      ? `<ol class="sequence-list">${step.stepsSoFar.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ol>`
      : '';

    if (isChoiceStep){
      choicesHtml = `<div class="story-choices">${step.choices.map((choice, i) => {
        let cls = 'choice-btn';
        if (storyState.answered && i === storyState.chosenIndex){
          cls += choice.correct ? ' correct' : ' incorrect';
        }
        return `<button type="button" class="${cls}" data-choice="${i}" ${storyState.answered ? 'disabled' : ''}>${escapeHtml(choice.text)}</button>`;
      }).join('')}</div>`;

      if (storyState.answered){
        const chosen = step.choices[storyState.chosenIndex];
        feedbackHtml = `<div class="story-feedback ${chosen.correct ? 'good' : 'bad'}">${escapeHtml(chosen.feedback || (chosen.correct ? t('feedback_good_default') : t('feedback_bad_default')))}</div>`;
        footerHtml = chosen.correct
          ? `<button type="button" class="btn btn-primary" data-story-next>${t('story_continue')}</button>`
          : `<button type="button" class="btn btn-secondary" data-story-retry>${t('story_try_again')}</button>`;
      }
    } else {
      footerHtml = `<button type="button" class="btn btn-primary" data-story-next>${t('story_next')}</button>`;
    }

    const chosenForIllustration = isChoiceStep && storyState.answered ? step.choices[storyState.chosenIndex] : null;
    const showWrongIllustration = !!(chosenForIllustration && !chosenForIllustration.correct);

    panel.innerHTML = `
      <div class="story-stage">
        <div class="story-level-bar">${changeLevelBtn}</div>
        <div class="story-progress">${dots}</div>
        <div class="story-illustration">${getIllustration(step.illustration, showWrongIllustration)}</div>
        <div class="story-body">
          <div class="story-kicker">${escapeHtml(step.kicker)}</div>
          ${sequenceHtml}
          ${typeof symbolRowHtml === 'function' ? symbolRowHtml(step.text, getLang()) : ''}
          <div class="speak-row">
            <p class="story-text">${typeof wrapGlossaryHtml === 'function' ? wrapGlossaryHtml(step.text, getLang()) : escapeHtml(step.text)}</p>
            ${speakButtonHtml()}
          </div>
          ${choicesHtml}
          ${feedbackHtml}
          <div class="story-footer">
            ${footerHtml}
          </div>
        </div>
      </div>`;

    panel.querySelector('[data-change-level]').addEventListener('click', () => {
      storyState.level = null;
      renderStory();
    });

    if (isChoiceStep){
      panel.querySelectorAll('[data-choice]').forEach(btn => {
        btn.addEventListener('click', () => {
          storyState.answered = true;
          storyState.chosenIndex = Number(btn.dataset.choice);
          const chosen = step.choices[storyState.chosenIndex];
          if (!chosen.correct){
            const correctChoice = step.choices.find(c => c.correct);
            recordMiss(step, step.text, correctChoice.feedback || correctChoice.text);
          }
          renderStory();
        });
      });
      const retry = panel.querySelector('[data-story-retry]');
      if (retry) retry.addEventListener('click', () => {
        storyState.answered = false;
        storyState.chosenIndex = undefined;
        renderStory();
      });
    }
    const speakSegments = [{ el: panel.querySelector('.story-text'), text: step.text }];
    if (isChoiceStep){
      panel.querySelectorAll('[data-choice]').forEach((btn, i) => {
        speakSegments.push({ el: btn, text: step.choices[i].text });
      });
    }
    wireSpeakButtonHighlighted(panel, speakSegments, null, '. ');
    const next = panel.querySelector('[data-story-next]');
    if (next) next.addEventListener('click', () => {
      storyState.index += 1;
      storyState.answered = false;
      storyState.chosenIndex = undefined;
      renderStory();
    });
  }

  /* ---------------- Matching step (tap-to-pair) ---------------- */

  function renderMatchingStep(panel, step, steps, dots, changeLevelBtn){
    const pairs = step.pairs;
    const rightOrder = pairs.map((_, i) => i);
    for (let i = rightOrder.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = rightOrder[i]; rightOrder[i] = rightOrder[j]; rightOrder[j] = tmp;
    }
    let selectedLeft = null;
    const matchedLeft = new Set();
    const matchedRight = new Set();
    let missRecorded = false;

    function allMatched(){ return matchedLeft.size === pairs.length; }

    function render(){
      const leftHtml = pairs.map((p, i) => {
        let cls = 'matching-item';
        if (matchedLeft.has(i)) cls += ' matched';
        else if (selectedLeft === i) cls += ' selected';
        return `<button type="button" class="${cls}" data-left="${i}" ${matchedLeft.has(i) ? 'disabled' : ''}>${escapeHtml(p.left)}</button>`;
      }).join('');
      const rightHtml = rightOrder.map((origIdx, slot) => {
        let cls = 'matching-item';
        if (matchedRight.has(slot)) cls += ' matched';
        return `<button type="button" class="${cls}" data-right="${slot}" ${matchedRight.has(slot) ? 'disabled' : ''}>${escapeHtml(pairs[origIdx].right)}</button>`;
      }).join('');
      const footerHtml = allMatched()
        ? `<button type="button" class="btn btn-primary" data-story-next>${t('story_continue')}</button>`
        : '';

      panel.innerHTML = `
        <div class="story-stage">
          <div class="story-level-bar">${changeLevelBtn}</div>
          <div class="story-progress">${dots}</div>
          <div class="story-illustration">${getIllustration(step.illustration)}</div>
          <div class="story-body">
            <div class="story-kicker">${escapeHtml(step.kicker || '')}</div>
            <div class="speak-row">
              <p class="story-text">${typeof wrapGlossaryHtml === 'function' ? wrapGlossaryHtml(step.text, getLang()) : escapeHtml(step.text)}</p>
              ${speakButtonHtml()}
            </div>
            <div class="matching-grid">
              <div class="matching-col">${leftHtml}</div>
              <div class="matching-col">${rightHtml}</div>
            </div>
            <div class="story-footer">
              ${footerHtml}
            </div>
          </div>
        </div>`;

      panel.querySelector('[data-change-level]').addEventListener('click', () => {
        storyState.level = null;
        renderStory();
      });
      wireSpeakButtonHighlighted(panel, [{ el: panel.querySelector('.story-text'), text: step.text }]);

      panel.querySelectorAll('[data-left]').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedLeft = selectedLeft === Number(btn.dataset.left) ? null : Number(btn.dataset.left);
          render();
        });
      });
      panel.querySelectorAll('[data-right]').forEach(btn => {
        btn.addEventListener('click', () => {
          if (selectedLeft === null) return;
          const slot = Number(btn.dataset.right);
          const origIdx = rightOrder[slot];
          if (origIdx === selectedLeft){
            matchedLeft.add(selectedLeft);
            matchedRight.add(slot);
            selectedLeft = null;
            render();
            return;
          }
          btn.classList.add('wrong');
          const leftBtn = panel.querySelector(`[data-left="${selectedLeft}"]`);
          if (leftBtn) leftBtn.classList.add('wrong');
          if (!missRecorded){
            missRecorded = true;
            const correctSummary = pairs.map(p => `${p.left} → ${p.right}`).join(' · ');
            recordMiss(step, step.text, correctSummary);
          }
          setTimeout(() => {
            selectedLeft = null;
            render();
          }, 700);
        });
      });

      const next = panel.querySelector('[data-story-next]');
      if (next) next.addEventListener('click', () => {
        storyState.index += 1;
        storyState.answered = false;
        storyState.chosenIndex = undefined;
        renderStory();
      });
    }

    render();
  }

  /* ---------------- Dialogue mode (talk-to-a-character steps) ---------------- */

  function getDialogueSceneNumber(){
    const levels = currentContent().story.levels;
    let sceneNumber = 0;
    for (let levelIndex = 0; levelIndex < levels.length; levelIndex++){
      const levelSteps = levels[levelIndex].steps;
      for (let stepIndex = 0; stepIndex < levelSteps.length; stepIndex++){
        if (levelSteps[stepIndex].type !== 'dialogue') continue;
        sceneNumber += 1;
        if (levelIndex === storyState.level && stepIndex === storyState.index){
          return sceneNumber;
        }
      }
    }
    return 1;
  }

  function renderDialogueStep(panel, step, steps, dots, changeLevelBtn){
    let lineIndex = 0;
    let answered = false;
    const dialogueSceneNumber = getDialogueSceneNumber();
    // Tappable exploration is an optional bonus layer, piloted at Level 1
    // only — it never blocks the core lesson, which still advances by
    // tapping the dialogue box regardless of whether a hotspot was found.
    const hotspots = storyState.level === 0 ? getDialogueHotspots(meta.id, dialogueSceneNumber, getLang()) : [];

    function setConsequenceVisual(showConsequence){
      const sceneEl = panel.querySelector('[data-dialogue-scene]');
      const imageEl = panel.querySelector('[data-dialogue-image]');
      const file = dialogueArtworkFile(meta.id, dialogueSceneNumber, showConsequence);
      if (imageEl && file) imageEl.src = file;
      if (sceneEl) sceneEl.classList.toggle('is-consequence', showConsequence);
    }

    function goToNextStep(){
      storyState.index += 1;
      storyState.answered = false;
      storyState.chosenIndex = undefined;
      renderStory();
    }

    function setFooter(html){
      panel.querySelector('[data-dialogue-footer]').innerHTML = html;
    }

    function showNextFooter(label){
      setFooter(`<button type="button" class="btn btn-primary" data-dialogue-go-next>${label}</button>`);
      panel.querySelector('[data-dialogue-go-next]').addEventListener('click', goToNextStep);
    }

    function showRetryFooter(){
      setFooter(`<button type="button" class="btn btn-secondary" data-dialogue-retry>${t('story_try_again')}</button>`);
      panel.querySelector('[data-dialogue-retry]').addEventListener('click', () => {
        answered = false;
        setConsequenceVisual(false);
        panel.querySelector('[data-dialogue-box]').classList.remove('is-consequence');
        setFooter('');
        showLine(step.lines.length - 1, { instant: true });
      });
    }

    function revealChoices(){
      const choicesEl = panel.querySelector('[data-dialogue-choices]');
      choicesEl.hidden = false;
      choicesEl.innerHTML = step.choices.map((c, i) =>
        `<button type="button" class="choice-btn" data-choice="${i}">${escapeHtml(c.text)}</button>`).join('');
      choicesEl.querySelectorAll('[data-choice]').forEach(btn => {
        btn.addEventListener('click', () => {
          const choice = step.choices[Number(btn.dataset.choice)];
          answered = true;
          choicesEl.querySelectorAll('[data-choice]').forEach(b => { b.disabled = true; });
          btn.classList.add(choice.correct ? 'correct' : 'incorrect');
          if (!choice.correct){
            const correctChoice = step.choices.find(c => c.correct);
            const lastLine = step.lines[step.lines.length - 1];
            recordMiss(step, lastLine.text, correctChoice.feedback || correctChoice.text);
          }
          showReplyLine(choice);
        });
      });
    }

    function showReplyLine(choice){
      const text = choice.feedback || (choice.correct ? t('feedback_good_default') : t('feedback_bad_default'));
      const speakerEl = panel.querySelector('[data-dialogue-speaker]');
      const textEl = panel.querySelector('[data-dialogue-text]');
      const advanceEl = panel.querySelector('[data-dialogue-advance]');
      const replySpeaker = step.replySpeaker || step.lines[step.lines.length - 1].speaker || '';
      const showConsequence = !choice.correct;
      const displayedSpeaker = showConsequence ? t('story_consequence_label') : replySpeaker;
      setConsequenceVisual(showConsequence);
      panel.querySelector('[data-dialogue-box]').classList.toggle('is-consequence', showConsequence);
      speakerEl.textContent = displayedSpeaker;
      advanceEl.style.visibility = 'hidden';
      wireDialogueSpeakHighlighted(textEl, text, displayedSpeaker);
      const controller = typeWriter(textEl, text, () => {
        activeTypewriterClear = null;
        if (choice.correct) showNextFooter(t('story_continue'));
        else showRetryFooter();
      });
      activeTypewriterClear = () => controller.finish();
    }

    // Word-highlighted read-aloud for dialogue lines needs the typewriter
    // reveal to be finished first -- both write into the same element, and
    // the typewriter's own ticking would otherwise stomp the word <span>s
    // this wraps the text in mid-speech. Clicking the speak button while a
    // line is still revealing just finishes it instantly (the same thing
    // that would happen a moment later anyway) before speaking it.
    function wireDialogueSpeakHighlighted(textEl, text, speaker){
      if (!SPEECH_SUPPORTED) return;
      const btn = panel.querySelector('[data-speak-btn]');
      if (!btn) return;
      btn.onclick = (e) => {
        e.stopPropagation();
        if (activeTypewriterClear) activeTypewriterClear();
        speakWithHighlight([{ el: textEl, text }], speaker);
      };
    }

    function showLine(idx, opts){
      lineIndex = idx;
      const line = step.lines[idx];
      const speakerEl = panel.querySelector('[data-dialogue-speaker]');
      const textEl = panel.querySelector('[data-dialogue-text]');
      const advanceEl = panel.querySelector('[data-dialogue-advance]');
      const choicesEl = panel.querySelector('[data-dialogue-choices]');
      choicesEl.hidden = true;
      choicesEl.innerHTML = '';
      setFooter('');
      speakerEl.textContent = line.speaker || '';
      advanceEl.style.visibility = 'hidden';
      wireDialogueSpeakHighlighted(textEl, line.text, line.speaker);
      const controller = typeWriter(textEl, line.text, () => {
        activeTypewriterClear = null;
        const isLast = idx === step.lines.length - 1;
        if (isLast && step.choices && !answered){
          revealChoices();
        } else if (isLast && !step.choices){
          showNextFooter(t('story_next'));
        } else {
          advanceEl.style.visibility = 'visible';
        }
      }, { instant: opts && opts.instant });
      activeTypewriterClear = () => controller.finish();
    }

    function handleBoxActivate(){
      if (activeTypewriterClear){ activeTypewriterClear(); return; }
      const isLast = lineIndex === step.lines.length - 1;
      if (!isLast) showLine(lineIndex + 1);
    }

    panel.innerHTML = `
      <div class="story-stage">
        <div class="story-level-bar">${changeLevelBtn}</div>
        <div class="story-progress">${dots}</div>
        <div class="story-illustration dialogue-scene" data-dialogue-scene>
          <div class="dialogue-art">
            <div class="dialogue-art-inner">
              ${getDialogueIllustration(meta.id, dialogueSceneNumber, t('story_dialogue_image_alt'))}
              ${hotspots.map((h, i) => `
                <button type="button" class="dialogue-hotspot" data-hotspot="${i}"
                  style="left:${h.x}%; top:${h.y}%" aria-label="${escapeHtml(h.label)}"></button>`).join('')}
              <div class="dialogue-hotspot-tip" data-hotspot-tip hidden></div>
            </div>
          </div>
        <div class="dialogue-box" data-dialogue-box tabindex="0" role="button" aria-label="${t('story_next')}">
          <div class="dialogue-speaker" data-dialogue-speaker></div>
          <div class="speak-row">
            <p class="dialogue-text" data-dialogue-text></p>
            ${speakButtonHtml()}
          </div>
          <span class="dialogue-advance" data-dialogue-advance aria-hidden="true">▼</span>
        </div>
        </div>
        <div class="story-body">
          <div class="story-choices" data-dialogue-choices hidden></div>
          <div class="story-footer">
            <div data-dialogue-footer></div>
          </div>
        </div>
      </div>`;

    panel.querySelector('[data-change-level]').addEventListener('click', () => {
      storyState.level = null;
      renderStory();
    });
    const box = panel.querySelector('[data-dialogue-box]');
    box.addEventListener('click', handleBoxActivate);
    box.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); handleBoxActivate(); }
    });

    panel.querySelectorAll('[data-hotspot]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = Number(btn.dataset.hotspot);
        const spot = hotspots[idx];
        const tip = panel.querySelector('[data-hotspot-tip]');
        const wasOpenOnThis = tip.dataset.openIdx === String(idx) && !tip.hidden;
        btn.classList.add('is-discovered');
        if (wasOpenOnThis){
          tip.hidden = true;
          tip.dataset.openIdx = '';
          return;
        }
        tip.textContent = spot.text;
        tip.style.left = `${spot.x}%`;
        tip.style.top = `${spot.y}%`;
        tip.hidden = false;
        tip.dataset.openIdx = String(idx);
        speak(spot.text);
      });
    });

    showLine(0);
  }

  /* ---------------- Flashcards mode ---------------- */

  // Topics migrated to level-specific flashcards store them on
  // story.levels[i].flashcards; topics not yet migrated only have one flat
  // topic-level flashcards array, which is used for every level as a fallback.
  function getFlashcardsForLevel(content, levelIdx){
    const level = content.story.levels[levelIdx];
    if (level && level.flashcards && level.flashcards.length) return level.flashcards;
    return content.flashcards || [];
  }

  function renderFlashLevelChooser(panel){
    const levelKeys = [
      ['level1_label', 'level1_desc'],
      ['level2_label', 'level2_desc'],
      ['level3_label', 'level3_desc'],
    ];
    panel.innerHTML = `
      <div class="flashcard-wrap">
        <h2>${t('flash_level_select_heading')}</h2>
        <p class="story-text">${t('flash_level_select_lead')}</p>
        <div class="level-grid">
          ${levelKeys.map(([labelKey, descKey], i) => `
            <button type="button" class="level-card" data-flash-level="${i}">
              <span class="level-card__num">${i + 1}</span>
              <span class="level-card__label">${t(labelKey)}</span>
              <span class="level-card__desc">${t(descKey)}</span>
            </button>`).join('')}
        </div>
      </div>`;
    panel.querySelectorAll('[data-flash-level]').forEach(btn => {
      btn.addEventListener('click', () => {
        flashState.level = Number(btn.dataset.flashLevel);
        flashState.index = 0;
        flashState.flipped = false;
        renderFlashcards();
      });
    });
  }

  function flashModeToggleHtml(active){
    return `
      <div class="flash-mode-toggle" role="group" aria-label="${t('flash_mode_group_label')}">
        <button type="button" class="flash-mode-btn ${active === 'alone' ? 'is-active' : ''}" data-flash-mode="alone" aria-pressed="${active === 'alone'}">${t('flash_mode_alone')}</button>
        <button type="button" class="flash-mode-btn ${active === 'guided' ? 'is-active' : ''}" data-flash-mode="guided" aria-pressed="${active === 'guided'}">${t('flash_mode_guided')}</button>
      </div>`;
  }

  function wireFlashChrome(panel){
    const changeLevelBtn = panel.querySelector('[data-flash-change-level]');
    if (changeLevelBtn) changeLevelBtn.addEventListener('click', () => {
      flashState.level = null;
      renderFlashcards();
    });
    panel.querySelectorAll('[data-flash-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.flashMode === flashMode) return;
        flashMode = btn.dataset.flashMode;
        renderFlashcards();
      });
    });
  }

  function renderFlashcards(){
    const panel = document.querySelector('[data-panel="flashcards"]');
    if (!panel) return;
    stopSpeaking();

    if (flashState.level === null){
      renderFlashLevelChooser(panel);
      return;
    }

    if (flashMode === 'guided'){
      renderGuided(panel);
      return;
    }

    const cards = getFlashcardsForLevel(currentContent(), flashState.level);
    const card = cards[flashState.index];
    const changeLevelBtn = `<button type="button" class="btn btn-ghost" data-flash-change-level>${t('level_change')}</button>`;

    panel.innerHTML = `
      <div class="flashcard-wrap">
        <div class="flash-level-bar">${changeLevelBtn}</div>
        ${flashModeToggleHtml('alone')}
        <div class="flashcard ${flashState.flipped ? 'flipped' : ''}" data-flashcard tabindex="0" role="button"
             aria-pressed="${flashState.flipped}" aria-label="${t('flash_flip')}">
          <div class="flashcard__inner">
            <div class="flashcard__face flashcard__face--front">
              <div class="flashcard__label">${t('flash_front_label')}</div>
              <div class="flashcard__text">${typeof wrapGlossaryHtml === 'function' ? wrapGlossaryHtml(card.front, getLang()) : escapeHtml(card.front)}</div>
            </div>
            <div class="flashcard__face flashcard__face--back">
              <div class="flashcard__label">${t('flash_back_label')}</div>
              <div class="flashcard__text">${typeof wrapGlossaryHtml === 'function' ? wrapGlossaryHtml(card.back, getLang()) : escapeHtml(card.back)}</div>
            </div>
          </div>
        </div>
        <div class="flashcard-controls">
          ${speakButtonHtml()}
          <button type="button" class="btn btn-secondary" data-flash-prev ${flashState.index === 0 ? 'disabled' : ''}>${t('flash_prev')}</button>
          <span class="flashcard-counter">${t('flash_counter', { current: flashState.index + 1, total: cards.length })}</span>
          <button type="button" class="btn btn-secondary" data-flash-next ${flashState.index === cards.length - 1 ? 'disabled' : ''}>${t('flash_next')}</button>
        </div>
        <button type="button" class="btn btn-ghost" data-flash-restart>${t('flash_restart')}</button>
      </div>`;

    const flashTextEl = panel.querySelector(flashState.flipped ? '.flashcard__face--back .flashcard__text' : '.flashcard__face--front .flashcard__text');
    wireSpeakButtonHighlighted(panel, [{ el: flashTextEl, text: flashState.flipped ? card.back : card.front }]);
    wireFlashChrome(panel);

    const flip = () => { flashState.flipped = !flashState.flipped; renderFlashcards(); };
    const cardEl = panel.querySelector('[data-flashcard]');
    cardEl.addEventListener('click', flip);
    cardEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); flip(); }
    });
    panel.querySelector('[data-flash-prev]').addEventListener('click', () => {
      if (flashState.index > 0){ flashState.index -= 1; flashState.flipped = false; renderFlashcards(); }
    });
    panel.querySelector('[data-flash-next]').addEventListener('click', () => {
      if (flashState.index < cards.length - 1){ flashState.index += 1; flashState.flipped = false; renderFlashcards(); }
    });
    panel.querySelector('[data-flash-restart]').addEventListener('click', () => {
      flashState.index = 0; flashState.flipped = false; renderFlashcards();
    });
  }

  function stopGuidedListening(){
    if (guidedState.activeRecognition){
      try { guidedState.activeRecognition.abort(); } catch (err) { /* already stopped */ }
      guidedState.activeRecognition = null;
    }
    guidedState.listening = false;
  }

  function startGuidedListening(card, onHeard){
    if (!SPEECH_RECOGNITION_SUPPORTED){
      guidedState.manual = true;
      renderFlashcards();
      return;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = getLang() === 'es' ? 'es-ES' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    guidedState.activeRecognition = recognition;
    guidedState.listening = true;
    renderFlashcards();

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      guidedState.activeRecognition = null;
      guidedState.listening = false;
      guidedState.transcript = transcript;
      guidedState.lastHeardMatched = speechMatches(transcript, card.back);
      onHeard();
    };
    recognition.onerror = (e) => {
      guidedState.activeRecognition = null;
      guidedState.listening = false;
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'permission-denied'){
        guidedState.manual = true;
      }
      renderFlashcards();
    };
    recognition.onend = () => {
      if (guidedState.listening){
        guidedState.activeRecognition = null;
        guidedState.listening = false;
        renderFlashcards();
      }
    };
    try {
      recognition.start();
    } catch (err){
      guidedState.activeRecognition = null;
      guidedState.listening = false;
      guidedState.manual = true;
      renderFlashcards();
    }
  }

  function renderGuided(panel){
    stopSpeaking();
    const cards = getFlashcardsForLevel(currentContent(), flashState.level);
    if (guidedState.level !== flashState.level){
      guidedState.level = flashState.level;
      resetGuided(flashState.level, cards.length);
    }
    if (guidedState.phase === 'drill') { renderGuidedDrill(panel, cards); return; }
    if (guidedState.phase === 'quiz') { renderGuidedQuiz(panel, cards); return; }
    renderGuidedDone(panel, cards);
  }

  function renderGuidedDrill(panel, cards){
    const changeLevelBtn = `<button type="button" class="btn btn-ghost" data-flash-change-level>${t('level_change')}</button>`;
    const card = cards[guidedState.order[guidedState.cardPos]];
    const showManual = guidedState.manual || !SPEECH_RECOGNITION_SUPPORTED;

    let matchNoteHtml = '';
    if (guidedState.lastHeardMatched !== null){
      matchNoteHtml = `<p class="speak-transcript">${guidedState.lastHeardMatched ? t('guided_drill_heard_match') : t('guided_drill_heard_note')} “${escapeHtml(guidedState.transcript)}”</p>`;
    }

    let controlsHtml;
    if (showManual){
      controlsHtml = `
        <p class="speak-manual-note">${SPEECH_RECOGNITION_SUPPORTED ? t('guided_manual_note') : t('guided_no_mic_note')}</p>
        <button type="button" class="btn btn-primary" data-guided-manual-rep>${t('guided_said_it_btn')}</button>
        ${SPEECH_RECOGNITION_SUPPORTED ? `<button type="button" class="btn btn-ghost" data-speak-mic-retry>${t('speak_mic_retry_toggle')}</button>` : ''}
      `;
    } else if (guidedState.listening){
      controlsHtml = `
        <button type="button" class="mic-btn is-listening" data-guided-cancel aria-label="${t('speak_cancel_btn')}">🎤</button>
        <p class="speak-hint">${t('speak_listening')}</p>
      `;
    } else {
      controlsHtml = `
        <button type="button" class="mic-btn" data-guided-mic aria-label="${t('speak_mic_btn')}">🎤</button>
        <p class="speak-hint">${t('guided_tap_to_repeat')}</p>
        <button type="button" class="btn btn-ghost" data-speak-manual-toggle>${t('speak_manual_toggle')}</button>
      `;
    }

    const dots = Array.from({ length: guidedState.repsNeeded }, (_, i) =>
      `<span class="rep-dot ${i < guidedState.reps ? 'done' : ''}"></span>`).join('');

    panel.innerHTML = `
      <div class="flashcard-wrap">
        <div class="flash-level-bar">${changeLevelBtn}</div>
        ${flashModeToggleHtml('guided')}
        <p class="guided-phase-label">${t('guided_drill_phase_label')}</p>
        <div class="speak-quiz-card">
          <div class="flashcard__label">${t('speak_prompt_label')}</div>
          <div class="flashcard__text">${typeof wrapGlossaryHtml === 'function' ? wrapGlossaryHtml(card.front, getLang()) : escapeHtml(card.front)}</div>
          <div class="guided-target-phrase" data-guided-target>${typeof wrapGlossaryHtml === 'function' ? wrapGlossaryHtml(card.back, getLang()) : escapeHtml(card.back)}</div>
          ${speakButtonHtml()}
        </div>
        <div class="rep-dots">${dots}</div>
        <p class="speak-hint">${t('guided_rep_indicator', { done: guidedState.reps, total: guidedState.repsNeeded })}</p>
        <div class="speak-controls">${controlsHtml}</div>
        ${matchNoteHtml}
        <div class="flashcard-controls">
          <span class="flashcard-counter">${t('flash_counter', { current: guidedState.cardPos + 1, total: cards.length })}</span>
        </div>
      </div>`;

    wireSpeakButtonHighlighted(panel, [{ el: panel.querySelector('[data-guided-target]'), text: card.back }]);
    wireFlashChrome(panel);

    const advanceRep = () => {
      guidedState.reps += 1;
      if (guidedState.reps >= guidedState.repsNeeded){
        guidedState.cardPos += 1;
        guidedState.reps = 0;
        guidedState.lastHeardMatched = null;
        guidedState.transcript = '';
        if (guidedState.cardPos >= cards.length){
          guidedState.phase = 'quiz';
          guidedState.quizOrder = shuffledOrder(cards.length);
        }
      }
      renderFlashcards();
    };

    const manualRepBtn = panel.querySelector('[data-guided-manual-rep]');
    if (manualRepBtn) manualRepBtn.addEventListener('click', advanceRep);
    const micBtn = panel.querySelector('[data-guided-mic]');
    if (micBtn) micBtn.addEventListener('click', () => startGuidedListening(card, advanceRep));
    const cancelBtn = panel.querySelector('[data-guided-cancel]');
    if (cancelBtn) cancelBtn.addEventListener('click', () => { stopGuidedListening(); renderFlashcards(); });
    const manualToggle = panel.querySelector('[data-speak-manual-toggle]');
    if (manualToggle) manualToggle.addEventListener('click', () => { guidedState.manual = true; renderFlashcards(); });
    const micRetry = panel.querySelector('[data-speak-mic-retry]');
    if (micRetry) micRetry.addEventListener('click', () => { guidedState.manual = false; renderFlashcards(); });
  }

  function renderGuidedQuiz(panel, cards){
    const changeLevelBtn = `<button type="button" class="btn btn-ghost" data-flash-change-level>${t('level_change')}</button>`;

    if (guidedState.quizIndex >= guidedState.quizOrder.length){
      guidedState.phase = 'done';
      renderGuidedDone(panel, cards);
      return;
    }

    const cardIdx = guidedState.quizOrder[guidedState.quizIndex];
    const card = cards[cardIdx];
    if (!guidedState.quizChoices.length){
      guidedState.quizChoices = buildQuizChoices(cards, cardIdx);
    }

    const gotItRight = guidedState.quizChoices.some(c => c.correct && c.picked);
    const showNext = gotItRight || guidedState.quizRevealed;

    const choicesHtml = guidedState.quizChoices.map((choice, i) => {
      let cls = 'choice-btn';
      if (choice.picked) cls += choice.correct ? ' correct' : ' incorrect';
      else if (choice.correct && guidedState.quizRevealed) cls += ' correct';
      const disabled = choice.eliminated || showNext;
      return `<button type="button" class="${cls}" data-quiz-choice="${i}" ${disabled ? 'disabled' : ''}>${escapeHtml(choice.text)}</button>`;
    }).join('');

    let feedbackHtml = '';
    if (gotItRight){
      feedbackHtml = `<div class="story-feedback good">${t('feedback_good_default')}</div>`;
    } else if (guidedState.quizWrongTries > 0 && !guidedState.quizRevealed){
      feedbackHtml = `<div class="story-feedback bad">${t('guided_quiz_try_again')}</div>`;
    }

    const helpHtml = showNext ? '' : `
      <div class="guided-quiz-help">
        ${!guidedState.quizHint ? `<button type="button" class="btn btn-ghost" data-quiz-hint>${t('guided_quiz_hint_btn')}</button>` : ''}
        <button type="button" class="btn btn-ghost" data-quiz-reveal>${t('guided_quiz_reveal_btn')}</button>
      </div>`;

    panel.innerHTML = `
      <div class="flashcard-wrap">
        <div class="flash-level-bar">${changeLevelBtn}</div>
        ${flashModeToggleHtml('guided')}
        <p class="guided-phase-label">${t('guided_quiz_phase_label')}</p>
        <div class="speak-quiz-card">
          <div class="flashcard__label">${t('speak_prompt_label')}</div>
          <div class="flashcard__text">${typeof wrapGlossaryHtml === 'function' ? wrapGlossaryHtml(card.front, getLang()) : escapeHtml(card.front)}</div>
          ${speakButtonHtml()}
        </div>
        <div class="story-choices">${choicesHtml}</div>
        ${feedbackHtml}
        ${helpHtml}
        <div class="flashcard-controls">
          <span class="flashcard-counter">${t('flash_counter', { current: guidedState.quizIndex + 1, total: guidedState.quizOrder.length })}</span>
          ${showNext ? `<button type="button" class="btn btn-primary" data-quiz-next>${t('flash_next')}</button>` : ''}
        </div>
      </div>`;

    wireSpeakButtonHighlighted(panel, [{ el: panel.querySelector('.speak-quiz-card .flashcard__text'), text: card.front }]);
    wireFlashChrome(panel);

    panel.querySelectorAll('[data-quiz-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.quizChoice);
        const choice = guidedState.quizChoices[i];
        choice.picked = true;
        if (choice.correct){
          guidedState.quizCorrect += 1;
          guidedState.quizTotal += 1;
        } else {
          choice.eliminated = true;
          guidedState.quizWrongTries += 1;
        }
        renderFlashcards();
      });
    });
    const hintBtn = panel.querySelector('[data-quiz-hint]');
    if (hintBtn) hintBtn.addEventListener('click', () => {
      guidedState.quizHint = true;
      const remainingWrong = guidedState.quizChoices.filter(c => !c.correct && !c.eliminated);
      if (remainingWrong.length > 1) remainingWrong[0].eliminated = true;
      renderFlashcards();
    });
    const revealBtn = panel.querySelector('[data-quiz-reveal]');
    if (revealBtn) revealBtn.addEventListener('click', () => {
      guidedState.quizRevealed = true;
      guidedState.quizTotal += 1;
      renderFlashcards();
    });
    const nextBtn = panel.querySelector('[data-quiz-next]');
    if (nextBtn) nextBtn.addEventListener('click', () => {
      guidedState.quizIndex += 1;
      guidedState.quizChoices = [];
      guidedState.quizWrongTries = 0;
      guidedState.quizHint = false;
      guidedState.quizRevealed = false;
      renderFlashcards();
    });
  }

  function renderGuidedDone(panel, cards){
    const changeLevelBtn = `<button type="button" class="btn btn-ghost" data-flash-change-level>${t('level_change')}</button>`;
    panel.innerHTML = `
      <div class="flashcard-wrap">
        <div class="flash-level-bar">${changeLevelBtn}</div>
        ${flashModeToggleHtml('guided')}
        <div class="speak-summary">
          <div class="story-complete__badge">🎉</div>
          <h2>${t('guided_done_heading')}</h2>
          <p>${t('guided_done_body', { total: cards.length })}</p>
          ${guidedState.quizTotal > 0 ? `<p>${t('guided_done_quiz_note', { correct: guidedState.quizCorrect, total: guidedState.quizTotal })}</p>` : ''}
          <button type="button" class="btn btn-primary" data-guided-restart>${t('flash_restart')}</button>
        </div>
      </div>`;
    wireFlashChrome(panel);
    panel.querySelector('[data-guided-restart]').addEventListener('click', () => {
      resetGuided(flashState.level, cards.length);
      renderFlashcards();
    });
  }

  /* ---------------- Video mode ---------------- */

  function renderVideo(){
    const panel = document.querySelector('[data-panel="video"]');
    if (!panel) return;
    stopSpeaking();
    const video = currentContent().video;

    if (!video.youtubeId){
      renderVideoPreviewMode(panel, video);
      return;
    }
    renderVideoPlayerMode(panel, video);
  }

  function renderVideoPreviewMode(panel, video){
    if (videoState.previewing){
      const cp = video.checkpoints[videoState.previewIndex];
      if (!cp){
        panel.innerHTML = `
          <div class="story-stage">
            <div class="story-complete">
              <div class="story-complete__badge">✅</div>
              <h2>${t('story_complete_title')}</h2>
              <button type="button" class="btn btn-secondary mt-lg" data-video-preview-again>${t('video_preview_btn')}</button>
            </div>
          </div>`;
        panel.querySelector('[data-video-preview-again]').addEventListener('click', () => {
          videoState.previewIndex = 0;
          videoState.previewAnswered = false;
          renderVideo();
        });
        return;
      }

      let feedback = '';
      let footer = '';
      const choicesHtml = cp.choices.map((choice, i) => {
        let cls = 'choice-btn';
        if (videoState.previewAnswered && i === videoState.chosenIndex){
          cls += choice.correct ? ' correct' : ' incorrect';
        }
        return `<button type="button" class="${cls}" data-choice="${i}" ${videoState.previewAnswered ? 'disabled' : ''}>${escapeHtml(choice.text)}</button>`;
      }).join('');

      if (videoState.previewAnswered){
        const chosen = cp.choices[videoState.chosenIndex];
        feedback = `<div class="story-feedback ${chosen.correct ? 'good' : 'bad'}">${chosen.correct ? t('feedback_good_default') : t('feedback_bad_default')}</div>`;
        footer = chosen.correct
          ? `<button type="button" class="btn btn-primary" data-story-next>${t('story_continue')}</button>`
          : `<button type="button" class="btn btn-secondary" data-story-retry>${t('story_try_again')}</button>`;
      }

      panel.innerHTML = `
        <div class="story-stage">
          <div class="story-body">
            <div class="story-kicker">${t('video_checkpoint_label', { time: formatTime(cp.time) })}</div>
            <div class="speak-row">
              <p class="story-text">${typeof wrapGlossaryHtml === 'function' ? wrapGlossaryHtml(cp.question, getLang()) : escapeHtml(cp.question)}</p>
              ${speakButtonHtml()}
            </div>
            <div class="story-choices">${choicesHtml}</div>
            ${feedback}
            <div class="story-footer">${footer}</div>
          </div>
        </div>`;

      const previewSegments = [{ el: panel.querySelector('.story-text'), text: cp.question }]
        .concat([...panel.querySelectorAll('[data-choice]')].map((btn, i) => ({ el: btn, text: cp.choices[i].text })));
      wireSpeakButtonHighlighted(panel, previewSegments, null, '. ');
      panel.querySelectorAll('[data-choice]').forEach(btn => {
        btn.addEventListener('click', () => {
          videoState.previewAnswered = true;
          videoState.chosenIndex = Number(btn.dataset.choice);
          renderVideo();
        });
      });
      const retry = panel.querySelector('[data-story-retry]');
      if (retry) retry.addEventListener('click', () => {
        videoState.previewAnswered = false;
        renderVideo();
      });
      const next = panel.querySelector('[data-story-next]');
      if (next) next.addEventListener('click', () => {
        videoState.previewIndex += 1;
        videoState.previewAnswered = false;
        renderVideo();
      });
      return;
    }

    const chips = video.checkpoints.map(cp => `<span class="checkpoint-chip">${t('video_checkpoint_label', { time: formatTime(cp.time) })}</span>`).join('');
    panel.innerHTML = `
      <div class="story-stage">
        <div class="story-body center">
          <div style="font-size:2.4rem">🎬</div>
          <h3>${t('video_no_id_title')}</h3>
          <p>${t('video_no_id_body')}</p>
          <button type="button" class="btn btn-primary" data-video-preview>${t('video_preview_btn')}</button>
          <p class="video-note" style="margin-top:18px;font-weight:800;">${t('video_checkpoints_heading')}</p>
          <div class="checkpoint-list center" style="justify-content:center">${chips}</div>
          <p class="video-note">${t('video_setup_note')}</p>
          <a class="btn btn-secondary mt-lg" href="worksheet.html?id=${encodeURIComponent(meta.id)}">${t('video_worksheet_btn')}</a>
        </div>
      </div>`;
    panel.querySelector('[data-video-preview]').addEventListener('click', () => {
      videoState.previewing = true;
      videoState.previewIndex = 0;
      videoState.previewAnswered = false;
      renderVideo();
    });
  }

  // Shows a static thumbnail + play button instead of embedding the
  // YouTube player right away -- opening a topic (video is the default
  // tab) shouldn't eagerly load YouTube's iframe API and player for a
  // video the learner may not even watch. The real embed only loads once
  // tapped. (Previously used the youtube-nocookie.com host for privacy,
  // but removed it while chasing a real embed failure -- it wasn't the
  // cause, so this stays on the default host until there's a reason to
  // believe nocookie is safe to bring back.)
  function renderVideoPlayerMode(panel, video){
    videoState.embedRetried = false;
    const chips = video.checkpoints.map(cp => `<span class="checkpoint-chip">${t('video_checkpoint_label', { time: formatTime(cp.time) })}</span>`).join('');
    const thumbUrl = `https://img.youtube.com/vi/${encodeURIComponent(video.youtubeId)}/hqdefault.jpg`;
    panel.innerHTML = `
      <div class="video-frame-wrap">
        <button type="button" class="video-play-facade" data-video-play aria-label="${t('video_play_label')}">
          <img src="${thumbUrl}" alt="" loading="lazy" decoding="async">
          <span class="video-play-facade__icon" aria-hidden="true">▶</span>
        </button>
      </div>
      <p class="video-note" style="font-weight:800;">${t('video_checkpoints_heading')}</p>
      <div class="checkpoint-list">${chips}</div>
      <p><a class="btn btn-secondary mt-lg" href="worksheet.html?id=${encodeURIComponent(meta.id)}">${t('video_worksheet_btn')}</a></p>`;

    const playBtn = panel.querySelector('[data-video-play]');
    if (playBtn) playBtn.addEventListener('click', () => startVideoPlayer(panel, video), { once: true });
  }

  function startVideoPlayer(panel, video){
    const frameWrap = panel.querySelector('.video-frame-wrap');
    if (!frameWrap) return;
    frameWrap.innerHTML = `
      <div data-yt-player></div>
      <div class="checkpoint-overlay" data-checkpoint-overlay>
        <div class="speak-row" style="color:#fff">
          <h3 data-checkpoint-question style="margin:0"></h3>
          ${speakButtonHtml()}
        </div>
        <div class="story-choices" data-checkpoint-choices></div>
        <button type="button" class="btn btn-primary" data-video-resume hidden>${t('video_resume')}</button>
      </div>`;

    videoState.nextCheckpoint = 0;
    videoState.awaitingAnswer = false;

    loadYouTubeApi().then(YT => {
      const target = panel.querySelector('[data-yt-player]');
      if (!target) return;
      videoState.player = new YT.Player(target, {
        videoId: video.youtubeId,
        playerVars: { rel: 0, origin: window.location.origin, autoplay: 1 },
        events: {
          onStateChange(e){
            if (e.data === YT.PlayerState.PLAYING){
              startCheckpointWatch(panel, video);
            }
          },
          onError(){
            // Some browsers/extensions strip the referrer YouTube needs to
            // confirm the embed, or the first attempt is just a transient
            // hiccup -- try once more (fresh player instance) before
            // settling on the calm fallback with a direct YouTube link.
            if (!videoState.embedRetried){
              videoState.embedRetried = true;
              if (videoState.player && typeof videoState.player.destroy === 'function'){
                videoState.player.destroy();
              }
              videoState.player = null;
              setTimeout(() => startVideoPlayer(panel, video), 400);
              return;
            }
            renderVideoEmbedError(panel, video);
          },
        },
      });
    });
  }

  function renderVideoEmbedError(panel, video){
    const frameWrap = panel.querySelector('.video-frame-wrap');
    if (!frameWrap) return;
    const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(video.youtubeId)}`;
    frameWrap.innerHTML = `
      <div class="story-stage">
        <div class="story-body center">
          <div style="font-size:2.4rem">🎬</div>
          <h3>${t('video_embed_error_title')}</h3>
          <p>${t('video_embed_error_body')}</p>
          <div class="hero-actions">
            <button type="button" class="btn btn-secondary" data-video-retry>${t('video_try_again_btn')}</button>
            <a class="btn btn-primary" href="${watchUrl}" target="_blank" rel="noopener">${t('video_watch_on_youtube_btn')}</a>
          </div>
        </div>
      </div>`;
    const retryBtn = frameWrap.querySelector('[data-video-retry]');
    if (retryBtn) retryBtn.addEventListener('click', () => {
      videoState.embedRetried = false;
      startVideoPlayer(panel, video);
    });
  }

  // requestAnimationFrame is throttled or fully suspended by the browser
  // while the tab isn't in the foreground, which used to let the video
  // keep playing unnoticed past a checkpoint until the learner switched
  // back -- setInterval keeps running (at worst throttled to ~1/sec) even
  // in a background tab, so a checkpoint is never missed by more than a
  // second or so. If we land past the checkpoint's time -- whether from
  // that background drift or from someone dragging the YouTube seek bar
  // forward to skip it -- snap back to the checkpoint's exact time before
  // showing it, instead of leaving the video sitting mid-sentence past it.
  // Seeking backward is never blocked, only forward drift/skips past an
  // unanswered checkpoint.
  function startCheckpointWatch(panel, video){
    clearCheckpointWatch();
    videoState.checkpointTimer = setInterval(() => {
      if (!videoState.player || videoState.awaitingAnswer) return;
      if (typeof videoState.player.getCurrentTime !== 'function') return;
      const t = videoState.player.getCurrentTime();
      const cp = video.checkpoints[videoState.nextCheckpoint];
      if (!cp || t < cp.time) return;
      videoState.awaitingAnswer = true;
      videoState.player.pauseVideo();
      if (t > cp.time + 1 && typeof videoState.player.seekTo === 'function'){
        videoState.player.seekTo(cp.time, true);
      }
      showCheckpointOverlay(panel, cp);
    }, 300);
  }

  function clearCheckpointWatch(){
    if (videoState.checkpointTimer){
      clearInterval(videoState.checkpointTimer);
      videoState.checkpointTimer = null;
    }
  }

  function showCheckpointOverlay(panel, cp){
    stopSpeaking();
    const overlay = panel.querySelector('[data-checkpoint-overlay]');
    const questionEl = panel.querySelector('[data-checkpoint-question]');
    const choicesEl = panel.querySelector('[data-checkpoint-choices]');
    const resumeBtn = panel.querySelector('[data-video-resume]');
    const speakBtn = panel.querySelector('[data-speak-btn]');

    questionEl.innerHTML = typeof wrapGlossaryHtml === 'function' ? wrapGlossaryHtml(cp.question, getLang()) : escapeHtml(cp.question);
    choicesEl.innerHTML = cp.choices.map((choice, i) =>
      `<button type="button" class="choice-btn" data-choice="${i}">${escapeHtml(choice.text)}</button>`).join('');
    resumeBtn.hidden = true;
    overlay.classList.add('active');

    if (speakBtn){
      const checkpointSegments = [{ el: questionEl, text: cp.question }]
        .concat([...choicesEl.querySelectorAll('[data-choice]')].map((btn, i) => ({ el: btn, text: cp.choices[i].text })));
      speakBtn.onclick = () => speakWithHighlight(checkpointSegments, null, '. ');
    }

    choicesEl.querySelectorAll('[data-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = cp.choices[Number(btn.dataset.choice)];
        choicesEl.querySelectorAll('[data-choice]').forEach(b => b.disabled = true);
        btn.classList.add(choice.correct ? 'correct' : 'incorrect');
        if (choice.correct){
          resumeBtn.hidden = false;
        } else {
          setTimeout(() => {
            choicesEl.querySelectorAll('[data-choice]').forEach(b => { b.disabled = false; b.classList.remove('incorrect'); });
          }, 1200);
        }
      });
    });

    resumeBtn.onclick = () => {
      overlay.classList.remove('active');
      videoState.awaitingAnswer = false;
      videoState.nextCheckpoint += 1;
      videoState.player.playVideo();
    };
  }

  let ytApiPromise = null;
  function loadYouTubeApi(){
    if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
    if (ytApiPromise) return ytApiPromise;
    ytApiPromise = new Promise(resolve => {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        resolve(window.YT);
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    });
    return ytApiPromise;
  }

  /* ---------------- Tabs + wiring ---------------- */

  document.querySelectorAll('.mode-tab').forEach((tab, i, tabs) => {
    tab.addEventListener('click', () => setActiveTab(tab.dataset.mode));
    tab.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      setActiveTab(next.dataset.mode);
    });
  });

  window.addEventListener('safetylib:langchange', () => {
    renderHero();
    renderActivePanel();
  });
  window.addEventListener('safetylib:symbolmodechange', () => {
    if (mode === 'story') renderActivePanel();
  });

  const storyPanel = document.querySelector('[data-panel="story"]');
  if (storyPanel) storyPanel.innerHTML = `<p class="center">${t('topic_loading')}</p>`;

  ensureTopicContentLoaded(meta.id).then(() => {
    renderHero();
    setActiveTab('video');
  }).catch(() => {
    if (storyPanel) storyPanel.innerHTML = `<p class="center">${t('topic_load_error')}</p>`;
  });
}

