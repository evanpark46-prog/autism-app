/* ==========================================================================
   Safety Library — page logic
   Reads TOPICS/CONTENT (js/data.js), t()/i18n (js/i18n.js) and
   getIllustration() (js/story.js) and renders whichever page is active,
   based on document.body.dataset.page ("home" | "topic" | "parents").
   ========================================================================== */

function formatTime(seconds){
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function escapeHtml(str){
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ---------------------------------------------------------------------- */
/* Read-aloud (Web Speech API)                                            */
/* ---------------------------------------------------------------------- */

const SPEECH_SUPPORTED = typeof window !== 'undefined' && 'speechSynthesis' in window;

let cachedVoices = [];
function refreshVoiceCache(){
  if (!SPEECH_SUPPORTED) return;
  cachedVoices = window.speechSynthesis.getVoices() || [];
}
if (SPEECH_SUPPORTED){
  refreshVoiceCache();
  window.speechSynthesis.addEventListener('voiceschanged', refreshVoiceCache);
}

function hashStr(s){
  let h = 0;
  for (let i = 0; i < s.length; i++){ h = (h * 31 + s.charCodeAt(i)) | 0; }
  return Math.abs(h);
}

// Prefer higher-quality network voices (e.g. Chrome's "Google" voices) over
// the default, more robotic-sounding local OS voices, when both are present.
function rankVoice(v){
  if (/google/i.test(v.name)) return 0;
  if (/natural|online|neural/i.test(v.name)) return 1;
  return 2;
}

function voicesForLang(lang){
  const prefix = lang === 'es' ? 'es' : 'en';
  return cachedVoices
    .filter(v => v.lang && v.lang.toLowerCase().startsWith(prefix))
    .sort((a, b) => rankVoice(a) - rankVoice(b));
}

// Gives each named character a consistent voice + pitch across the app,
// without needing every line of content tagged with age/gender metadata.
function voiceProfileFor(speaker){
  const pool = voicesForLang(getLang());
  if (!speaker || speaker === 'Narrator' || !pool.length){
    return { voice: pool[0] || null, pitch: 1, rate: 0.95 };
  }
  const isChild = /alex/i.test(speaker);
  const idx = pool.length > 1 ? hashStr(speaker) % pool.length : 0;
  const voice = pool[idx];
  return {
    voice,
    pitch: isChild ? 1.35 : 0.9 + (hashStr(speaker) % 20) / 100, // adults: ~0.90-1.09
    rate: isChild ? 1.05 : 0.93,
  };
}

function speak(text, speaker){
  if (!SPEECH_SUPPORTED || !text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = getLang() === 'es' ? 'es-ES' : 'en-US';
  const profile = voiceProfileFor(speaker);
  if (profile.voice) utter.voice = profile.voice;
  utter.pitch = profile.pitch;
  utter.rate = profile.rate;
  window.speechSynthesis.speak(utter);
}

function stopSpeaking(){
  if (SPEECH_SUPPORTED) window.speechSynthesis.cancel();
}

function speakButtonHtml(){
  return SPEECH_SUPPORTED
    ? `<button type="button" class="speak-btn" data-speak-btn aria-label="${t('read_aloud')}" title="${t('read_aloud')}">🔊</button>`
    : '';
}

function wireSpeakButton(root, text, speaker){
  if (!SPEECH_SUPPORTED) return;
  const btn = root.querySelector('[data-speak-btn]');
  if (btn) btn.addEventListener('click', () => speak(text, speaker));
}

function wireDialogueSpeak(root, text, speaker){
  if (!SPEECH_SUPPORTED) return;
  const btn = root.querySelector('[data-speak-btn]');
  if (btn) btn.onclick = (e) => { e.stopPropagation(); speak(text, speaker); };
}

/* ---------------------------------------------------------------------- */
/* Typewriter effect (for dialogue-mode text boxes)                       */
/* ---------------------------------------------------------------------- */

function typeWriter(el, text, onDone, opts){
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const instant = (opts && opts.instant) || reduceMotion || !text;
  let done = false;
  if (instant){
    el.textContent = text || '';
    done = true;
    if (onDone) onDone();
    return { finish(){}, isDone(){ return true; } };
  }
  let i = 0;
  el.textContent = '';
  const id = setInterval(() => {
    i += 1;
    el.textContent = text.slice(0, i);
    if (i >= text.length){
      clearInterval(id);
      done = true;
      if (onDone) onDone();
    }
  }, 22);
  return {
    finish(){
      if (done) return;
      clearInterval(id);
      el.textContent = text;
      done = true;
      if (onDone) onDone();
    },
    isDone(){ return done; },
  };
}

/* ---------------------------------------------------------------------- */
/* Home page: topic grid                                                  */
/* ---------------------------------------------------------------------- */

function renderTopicGrid(){
  const grid = document.querySelector('[data-topic-grid]');
  if (!grid) return;
  const lang = getLang();
  grid.innerHTML = TOPICS.map(meta => {
    const content = getTopicContent(meta.id, lang);
    return `
      <a class="topic-card" data-theme="${meta.theme}" href="topic.html?id=${encodeURIComponent(meta.id)}">
        <div class="topic-card__icon"><img src="${meta.image}" alt="" loading="lazy"></div>
        <h3>${escapeHtml(content.title)}</h3>
        <p>${escapeHtml(content.tagline)}</p>
        <div class="topic-card__tags">
          <span class="tag">${t('mode_story')}</span>
          <span class="tag">${t('mode_flashcards')}</span>
          <span class="tag">${t('mode_video')}</span>
        </div>
      </a>`;
  }).join('');
}

function initHomePage(){
  renderTopicGrid();
  window.addEventListener('safetylib:langchange', renderTopicGrid);
}

/* ---------------------------------------------------------------------- */
/* Topic page                                                             */
/* ---------------------------------------------------------------------- */

function initTopicPage(){
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get('id');
  const meta = getTopicMeta(requestedId) || TOPICS[0];
  if (!meta){
    window.location.href = 'index.html';
    return;
  }

  const heroEl = document.querySelector('[data-topic-hero]');
  const titleEl = document.querySelector('[data-topic-title]');
  const taglineEl = document.querySelector('[data-topic-tagline]');

  let mode = 'story';
  const storyState = { level: null, index: 0, answered: false, lastCorrect: false };
  let activeTypewriterClear = null;
  function stopActiveTypewriter(){
    if (activeTypewriterClear){ activeTypewriterClear(); activeTypewriterClear = null; }
  }
  const flashState = { index: 0, flipped: false };
  const videoState = { previewing: false, previewIndex: 0, previewAnswered: false, player: null, nextCheckpoint: 0, awaitingAnswer: false };

  function currentContent(){
    return getTopicContent(meta.id, getLang());
  }

  function renderHero(){
    const content = currentContent();
    if (heroEl) heroEl.dataset.theme = meta.theme;
    if (titleEl) titleEl.textContent = content.title;
    if (taglineEl) taglineEl.textContent = content.tagline;
    document.title = `${content.title} — ${t('brand')}`;
  }

  function setActiveTab(nextMode){
    stopSpeaking();
    stopActiveTypewriter();
    mode = nextMode;
    document.querySelectorAll('.mode-tab').forEach(tab => {
      const isActive = tab.dataset.mode === mode;
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });
    document.querySelectorAll('.mode-panel').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.panel === mode);
    });
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
        renderStory();
      });
    });
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

    const story = currentContent().story;
    const level = story.levels[storyState.level];
    const steps = level.steps;
    const changeLevelBtn = `<button type="button" class="btn btn-ghost" data-change-level>${t('level_change')}</button>`;

    if (storyState.index >= steps.length){
      panel.innerHTML = `
        <div class="story-stage">
          <div class="story-complete">
            <div class="story-complete__badge">🎉</div>
            <h2>${t('story_complete_title')}</h2>
            <div class="speak-row center">
              <p style="margin:0">${t('story_complete_lead')}</p>
              ${speakButtonHtml()}
            </div>
            <ul class="recap-list">${level.recap.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
            <div class="hero-actions mt-lg">
              <button type="button" class="btn btn-primary" data-story-replay>${t('story_replay')}</button>
              ${changeLevelBtn}
              <a class="btn btn-secondary" href="index.html">${t('story_back_to_topics')}</a>
            </div>
          </div>
        </div>`;
      panel.querySelector('[data-story-replay]').addEventListener('click', () => {
        storyState.index = 0;
        storyState.answered = false;
        renderStory();
      });
      panel.querySelector('[data-change-level]').addEventListener('click', () => {
        storyState.level = null;
        renderStory();
      });
      wireSpeakButton(panel, `${t('story_complete_lead')} ${level.recap.join('. ')}`);
      return;
    }

    const step = steps[storyState.index];
    const dots = steps.map((_, i) => {
      const cls = i < storyState.index ? 'done' : (i === storyState.index ? 'current' : '');
      return `<span class="story-progress__dot ${cls}"></span>`;
    }).join('');

    if (step.type === 'dialogue'){
      renderDialogueStep(panel, step, steps, dots, changeLevelBtn);
      return;
    }

    let choicesHtml = '';
    let footerHtml = '';
    let feedbackHtml = '';

    if (step.type === 'decision'){
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

    panel.innerHTML = `
      <div class="story-stage">
        <div class="story-level-bar">${changeLevelBtn}</div>
        <div class="story-progress">${dots}</div>
        <div class="story-illustration">${getIllustration(step.illustration)}</div>
        <div class="story-body">
          <div class="story-kicker">${escapeHtml(step.kicker)}</div>
          <div class="speak-row">
            <p class="story-text">${escapeHtml(step.text)}</p>
            ${speakButtonHtml()}
          </div>
          ${choicesHtml}
          ${feedbackHtml}
          <div class="story-footer">
            <span class="visually-hidden">${t('story_of', { current: storyState.index + 1, total: steps.length })}</span>
            ${footerHtml}
          </div>
        </div>
      </div>`;

    panel.querySelector('[data-change-level]').addEventListener('click', () => {
      storyState.level = null;
      renderStory();
    });

    if (step.type === 'decision'){
      panel.querySelectorAll('[data-choice]').forEach(btn => {
        btn.addEventListener('click', () => {
          storyState.answered = true;
          storyState.chosenIndex = Number(btn.dataset.choice);
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
    wireSpeakButton(panel, step.type === 'decision'
      ? `${step.text} ${step.choices.map(c => c.text).join('. ')}`
      : step.text);
    const next = panel.querySelector('[data-story-next]');
    if (next) next.addEventListener('click', () => {
      storyState.index += 1;
      storyState.answered = false;
      storyState.chosenIndex = undefined;
      renderStory();
    });
  }

  /* ---------------- Dialogue mode (talk-to-a-character steps) ---------------- */

  function renderDialogueStep(panel, step, steps, dots, changeLevelBtn){
    let lineIndex = 0;
    let answered = false;

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
      speakerEl.textContent = replySpeaker;
      advanceEl.style.visibility = 'hidden';
      wireDialogueSpeak(panel, text, replySpeaker);
      const controller = typeWriter(textEl, text, () => {
        activeTypewriterClear = null;
        if (choice.correct) showNextFooter(t('story_continue'));
        else showRetryFooter();
      });
      activeTypewriterClear = () => controller.finish();
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
      wireDialogueSpeak(panel, line.text, line.speaker);
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
        <div class="story-illustration dialogue-scene">${getIllustration(step.illustration)}</div>
        <div class="dialogue-box" data-dialogue-box tabindex="0" role="button" aria-label="${t('story_next')}">
          <div class="dialogue-speaker" data-dialogue-speaker></div>
          <div class="speak-row">
            <p class="dialogue-text" data-dialogue-text></p>
            ${speakButtonHtml()}
          </div>
          <span class="dialogue-advance" data-dialogue-advance aria-hidden="true">▼</span>
        </div>
        <div class="story-body">
          <div class="story-choices" data-dialogue-choices hidden></div>
          <div class="story-footer">
            <span class="visually-hidden">${t('story_of', { current: storyState.index + 1, total: steps.length })}</span>
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

    showLine(0);
  }

  /* ---------------- Flashcards mode ---------------- */

  function renderFlashcards(){
    const panel = document.querySelector('[data-panel="flashcards"]');
    if (!panel) return;
    stopSpeaking();
    const cards = currentContent().flashcards;
    const card = cards[flashState.index];

    panel.innerHTML = `
      <div class="flashcard-wrap">
        <div class="flashcard ${flashState.flipped ? 'flipped' : ''}" data-flashcard tabindex="0" role="button"
             aria-pressed="${flashState.flipped}" aria-label="${t('flash_flip')}">
          <div class="flashcard__inner">
            <div class="flashcard__face flashcard__face--front">
              <div class="flashcard__label">${t('flash_front_label')}</div>
              <div class="flashcard__text">${escapeHtml(card.front)}</div>
            </div>
            <div class="flashcard__face flashcard__face--back">
              <div class="flashcard__label">${t('flash_back_label')}</div>
              <div class="flashcard__text">${escapeHtml(card.back)}</div>
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

    wireSpeakButton(panel, flashState.flipped ? card.back : card.front);

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
              <p class="story-text">${escapeHtml(cp.question)}</p>
              ${speakButtonHtml()}
            </div>
            <div class="story-choices">${choicesHtml}</div>
            ${feedback}
            <div class="story-footer">${footer}</div>
          </div>
        </div>`;

      wireSpeakButton(panel, `${cp.question} ${cp.choices.map(c => c.text).join('. ')}`);
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
        </div>
      </div>`;
    panel.querySelector('[data-video-preview]').addEventListener('click', () => {
      videoState.previewing = true;
      videoState.previewIndex = 0;
      videoState.previewAnswered = false;
      renderVideo();
    });
  }

  function renderVideoPlayerMode(panel, video){
    const chips = video.checkpoints.map(cp => `<span class="checkpoint-chip">${t('video_checkpoint_label', { time: formatTime(cp.time) })}</span>`).join('');
    panel.innerHTML = `
      <div class="video-frame-wrap">
        <div data-yt-player></div>
        <div class="checkpoint-overlay" data-checkpoint-overlay>
          <div class="speak-row" style="color:#fff">
            <h3 data-checkpoint-question style="margin:0"></h3>
            ${speakButtonHtml()}
          </div>
          <div class="story-choices" data-checkpoint-choices></div>
          <button type="button" class="btn btn-primary" data-video-resume hidden>${t('video_resume')}</button>
        </div>
      </div>
      <p class="video-note" style="font-weight:800;">${t('video_checkpoints_heading')}</p>
      <div class="checkpoint-list">${chips}</div>`;

    videoState.nextCheckpoint = 0;
    videoState.awaitingAnswer = false;

    loadYouTubeApi().then(YT => {
      videoState.player = new YT.Player(panel.querySelector('[data-yt-player]'), {
        videoId: video.youtubeId,
        playerVars: { rel: 0 },
        events: {
          onStateChange(e){
            if (e.data === YT.PlayerState.PLAYING){
              startCheckpointWatch(panel, video);
            }
          },
        },
      });
    });
  }

  function startCheckpointWatch(panel, video){
    const tick = () => {
      if (!videoState.player || videoState.awaitingAnswer) return;
      const t = videoState.player.getCurrentTime ? videoState.player.getCurrentTime() : 0;
      const cp = video.checkpoints[videoState.nextCheckpoint];
      if (cp && t >= cp.time){
        videoState.awaitingAnswer = true;
        videoState.player.pauseVideo();
        showCheckpointOverlay(panel, cp);
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function showCheckpointOverlay(panel, cp){
    stopSpeaking();
    const overlay = panel.querySelector('[data-checkpoint-overlay]');
    const questionEl = panel.querySelector('[data-checkpoint-question]');
    const choicesEl = panel.querySelector('[data-checkpoint-choices]');
    const resumeBtn = panel.querySelector('[data-video-resume]');
    const speakBtn = panel.querySelector('[data-speak-btn]');

    questionEl.textContent = cp.question;
    if (speakBtn) speakBtn.onclick = () => speak(`${cp.question} ${cp.choices.map(c => c.text).join('. ')}`);
    choicesEl.innerHTML = cp.choices.map((choice, i) =>
      `<button type="button" class="choice-btn" data-choice="${i}">${escapeHtml(choice.text)}</button>`).join('');
    resumeBtn.hidden = true;
    overlay.classList.add('active');

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

  renderHero();
  setActiveTab('video');
}

/* ---------------------------------------------------------------------- */
/* Boot                                                                    */
/* ---------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  applyStaticI18n();
  initLangSwitcher();

  const page = document.body.dataset.page;
  if (page === 'home') initHomePage();
  else if (page === 'topic') initTopicPage();

  window.addEventListener('safetylib:langchange', () => applyStaticI18n());
});
