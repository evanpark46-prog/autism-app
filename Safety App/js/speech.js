/* ==========================================================================
   Safety Superheroes — speech (topic.html only)
   Text-to-speech playback, speech-recognition matching for the guided
   flashcard drill, and the narrative typewriter effect. Nothing outside
   initTopicPage (js/page-topic.js) uses any of this.
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Read-aloud (Web Speech API)                                            */
/* ---------------------------------------------------------------------- */

const SPEECH_SUPPORTED = typeof window !== 'undefined' && 'speechSynthesis' in window;
// Voice ranking, the grown-up's chosen voice (readingVoice) and the voice
// picker live in js/speechrate.js, which every page loads.

// Lets other modules (the hero music, js/music.js) react to read-aloud
// without touching speechSynthesis themselves. Fired once per read-aloud
// (not once per sentence) so the music doesn't pump up and down.
let speechBusy = false;
let speechRun = 0;
function fireSpeech(name){ window.dispatchEvent(new CustomEvent(name)); }

// Tapping a 🔊 button while the app is already talking stops it instead of
// starting over -- so a learner can always cut reading short.
function speakOrStop(fn){
  if (speechBusy){ stopSpeaking(); return; }
  fn();
}

// A floating "Stop reading" button that appears only while the app talks.
function initStopReadingButton(){
  if (!SPEECH_SUPPORTED || document.querySelector('[data-stop-reading]')) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'stop-reading-btn';
  btn.setAttribute('data-stop-reading', '');
  btn.hidden = true;
  const label = () => { btn.innerHTML = `<span aria-hidden="true">⏹</span> ${escapeHtml(t('stop_reading'))}`; };
  label();
  btn.addEventListener('click', () => { stopSpeaking(); btn.hidden = true; });
  document.body.appendChild(btn);
  let hideTimer = null;
  window.addEventListener('safetylib:speechstart', () => { clearTimeout(hideTimer); label(); btn.hidden = false; });
  window.addEventListener('safetylib:speechend', () => { clearTimeout(hideTimer); hideTimer = setTimeout(() => { if (!speechBusy) btn.hidden = true; }, 400); });
}
if (typeof document !== 'undefined'){
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initStopReadingButton);
  else initStopReadingButton();
}

function hashStr(s){
  let h = 0;
  for (let i = 0; i < s.length; i++){ h = (h * 31 + s.charCodeAt(i)) | 0; }
  return Math.abs(h);
}

// One clear voice for everything -- switching voices for each character
// usually meant dropping to a worse voice, and a steady voice is easier to
// follow. Characters only get a very slight pitch change (big pitch shifts
// are what make voices sound robotic / chipmunky).
function voiceProfileFor(speaker){
  const voice = typeof readingVoice === 'function' ? readingVoice(getLang()) : null;
  const rate = 0.92;
  if (!speaker || speaker === 'Narrator') return { voice, pitch: 1, rate };
  const customName = typeof learnerName === 'function' ? learnerName() : '';
  const isChild = /alex/i.test(speaker) || (!!customName && speaker.indexOf(customName) !== -1);
  return { voice, pitch: isChild ? 1.06 : 0.97 + (hashStr(speaker) % 5) / 100, rate };
}

// Make text sound right WITHOUT changing its length (word highlighting maps
// the engine's character offsets back onto the page): emoji and symbols
// become spaces (otherwise they're read out as "star", "superhero"…), dashes
// become commas (a natural pause), quote marks are dropped.
function cleanForSpeech(s){
  return s
    .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}\u{20E3}]/gu, m => ' '.repeat(m.length))
    .replace(/[←→↑↓✓✔✖✕★☆•·…]/g, m => m === '…' ? '.' : ' ')
    .replace(/[—–]/g, ',')
    .replace(/[“”«»"]/g, ' ')
    .replace(/\s\/\s/g, m => ' , ');
}

// Sentence-sized pieces: Chrome silently stops long utterances after ~15 s
// with its (much nicer) Google voices, and short pieces give natural pauses.
function speechChunks(text){
  const chunks = [];
  const re = /[^.!?;:\n]*(?:[.!?;:\n]+|$)/g;
  let m;
  let buf = null;
  while ((m = re.exec(text)) && m[0] !== ''){
    const piece = { start: m.index, text: m[0] };
    if (buf && buf.text.length + piece.text.length < 60){ buf.text += piece.text; }
    else { if (buf) chunks.push(buf); buf = piece; }
    if (re.lastIndex >= text.length) break;
  }
  if (buf) chunks.push(buf);
  // Split any very long sentence at commas.
  return chunks.flatMap(c => {
    if (c.text.length <= 220) return [c];
    const out = []; let start = 0;
    c.text.replace(/[^,]*(,|$)/g, (p, _c, off) => {
      if (!p) return p;
      if (out.length && out[out.length - 1].text.length + p.length < 160) out[out.length - 1].text += p;
      else out.push({ start: c.start + off, text: p });
      return p;
    });
    return out.length ? out : [c];
  }).filter(c => /[\p{L}\p{N}]/u.test(c.text));
}

// Speaks `text` sentence by sentence. hooks: { boundary(globalCharIndex),
// chunkStart(chunk), done() }.
function speakQueue(text, profile, hooks){
  hooks = hooks || {};
  const run = ++speechRun;
  const clean = cleanForSpeech(text);
  const chunks = speechChunks(clean);
  if (!chunks.length) return;
  window.speechSynthesis.cancel();
  speechBusy = true;
  fireSpeech('safetylib:speechstart');
  let i = 0;
  const finish = () => {
    if (run !== speechRun) return;
    speechBusy = false;
    fireSpeech('safetylib:speechend');
    if (hooks.done) hooks.done();
  };
  const next = () => {
    if (run !== speechRun) return;
    if (i >= chunks.length){ finish(); return; }
    const c = chunks[i++];
    const u = new SpeechSynthesisUtterance(c.text);
    if (profile.voice){ u.voice = profile.voice; u.lang = profile.voice.lang; }
    else u.lang = getLang() === 'es' ? 'es-US' : 'en-US';
    u.pitch = profile.pitch;
    u.rate = profile.rate * (typeof getSpeechRateMultiplier === 'function' ? getSpeechRateMultiplier() : 1);
    let started = false;
    const begin = () => { if (started || run !== speechRun) return; started = true; if (hooks.chunkStart) hooks.chunkStart(c, u.rate); };
    u.onstart = begin;
    // Some engines never fire onstart; don't let the highlight wait forever.
    setTimeout(begin, 350);
    u.onboundary = e => { if (run === speechRun && hooks.boundary && (!e.name || e.name === 'word')) hooks.boundary(c.start + e.charIndex); };
    let ended = false;
    const end = () => { if (ended) return; ended = true; next(); };
    u.onend = end;
    u.onerror = e => { if (e && (e.error === 'interrupted' || e.error === 'canceled')) return; end(); };
    window.speechSynthesis.speak(u);
  };
  next();
}

function speak(text, speaker){
  if (!SPEECH_SUPPORTED || !text) return;
  speakQueue(text, voiceProfileFor(speaker));
}

let activeHighlightSpan = null;
let activeFallbackTimer = null;
function clearActiveHighlight(){
  if (activeHighlightSpan){
    activeHighlightSpan.classList.remove('is-speaking-word');
    activeHighlightSpan = null;
  }
  if (activeFallbackTimer){
    clearInterval(activeFallbackTimer);
    activeFallbackTimer = null;
  }
}

function stopSpeaking(){
  speechRun++;
  if (SPEECH_SUPPORTED) window.speechSynthesis.cancel();
  speechBusy = false;
  clearActiveHighlight();
  window.dispatchEvent(new CustomEvent('safetylib:speechend'));
}

// Reads one or more elements aloud, highlighting the word being spoken.
// Uses the engine's word-boundary events where they exist; where they don't
// (many mobile browsers) it estimates, re-syncing at every sentence.
// `segments` is [{ el, text }]; each el's content is replaced with one
// <span> per word so the matching word can be highlighted.
function speakWithHighlight(segments, speaker, joiner){
  if (!SPEECH_SUPPORTED) return;
  stopSpeaking();

  let fullText = '';
  const wordSpans = [];
  segments.forEach((seg, si) => {
    if (!seg.el) return;
    if (si > 0) fullText += (joiner || ' ');
    seg.el.innerHTML = '';
    seg.text.split(/(\s+)/).forEach(token => {
      if (token === '') return;
      const start = fullText.length;
      if (/^\s+$/.test(token)){
        seg.el.appendChild(document.createTextNode(token));
      } else {
        const span = document.createElement('span');
        span.className = 'read-highlight-word';
        span.textContent = token;
        if (typeof getGlossaryDefinition === 'function'){
          const bare = token.replace(/[“”"‘’.,!?¡¿]/g, '');
          const def = getGlossaryDefinition(bare, getLang());
          if (def){
            span.classList.add('glossary-term');
            span.setAttribute('data-definition', def);
            span.tabIndex = 0;
          }
        }
        seg.el.appendChild(span);
        wordSpans.push({ span, start, end: start + token.length });
      }
      fullText += token;
    });
    // A sentence break between segments, so each paragraph gets its own pause.
    if (!/[.!?:;]["”»]?\s*$/.test(seg.text)) fullText += '.';
  });
  if (!fullText) return;

  let usedRealBoundary = false;
  const highlightSpan = span => {
    if (activeHighlightSpan) activeHighlightSpan.classList.remove('is-speaking-word');
    span.classList.add('is-speaking-word');
    activeHighlightSpan = span;
  };
  const stopFallback = () => { if (activeFallbackTimer){ clearInterval(activeFallbackTimer); activeFallbackTimer = null; } };

  speakQueue(fullText, voiceProfileFor(speaker), {
    chunkStart(chunk, rate){
      if (usedRealBoundary) return;
      stopFallback();
      const end = chunk.start + chunk.text.length;
      let idx = wordSpans.findIndex(w => w.end > chunk.start);
      if (idx < 0) return;
      const msPerWord = Math.max(140, 60000 / (160 * (rate || 1)));
      highlightSpan(wordSpans[idx].span);
      activeFallbackTimer = setInterval(() => {
        idx += 1;
        if (idx >= wordSpans.length || wordSpans[idx].start >= end){ stopFallback(); return; }
        highlightSpan(wordSpans[idx].span);
      }, msPerWord);
    },
    boundary(charIndex){
      const match = wordSpans.find(w => charIndex >= w.start && charIndex < w.end);
      if (!match) return;
      usedRealBoundary = true;
      stopFallback();
      highlightSpan(match.span);
    },
    done: clearActiveHighlight,
  });
}

// `autoRead` (default true): when the learner's profile has "read
// everything aloud" on, the segments are spoken automatically once wired.
function wireSpeakButtonHighlighted(root, segments, speaker, joiner, autoRead){
  if (!SPEECH_SUPPORTED) return;
  const btn = root.querySelector('[data-speak-btn]');
  if (btn) btn.addEventListener('click', () => speakOrStop(() => speakWithHighlight(segments, speaker, joiner)));
  if (btn && autoRead !== false && typeof maybeAutoRead === 'function') maybeAutoRead(btn);
}

function speakButtonHtml(){
  return SPEECH_SUPPORTED
    ? `<button type="button" class="speak-btn" data-speak-btn aria-label="${t('read_aloud')}" title="${t('read_aloud')}">🔊</button>`
    : '';
}

function wireSpeakButton(root, text, speaker){
  if (!SPEECH_SUPPORTED) return;
  const btn = root.querySelector('[data-speak-btn]');
  if (btn) btn.addEventListener('click', () => speakOrStop(() => speak(text, speaker)));
}

/* ---------------------------------------------------------------------- */
/* Speak-it-back practice (Web Speech API speech recognition)            */
/* ---------------------------------------------------------------------- */

const SpeechRecognitionCtor = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;
const SPEECH_RECOGNITION_SUPPORTED = !!SpeechRecognitionCtor;

function normalizeForCompare(str){
  return String(str)
    .toLowerCase()
    .replace(/[“”"‘’.,!?¡¿]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Short phrases rarely come back word-for-word from speech recognition
// (especially with atypical prosody/articulation), so this checks for a
// substring match either direction, or a generous word-overlap ratio,
// rather than requiring an exact match.
function speechMatches(transcript, target){
  const heard = normalizeForCompare(transcript);
  const goal = normalizeForCompare(target);
  if (!heard || !goal) return false;
  if (heard === goal || heard.includes(goal) || goal.includes(heard)) return true;
  const heardWords = new Set(heard.split(' '));
  const goalWords = goal.split(' ').filter(Boolean);
  if (!goalWords.length) return false;
  const hits = goalWords.filter(w => heardWords.has(w)).length;
  return hits / goalWords.length >= 0.6;
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

