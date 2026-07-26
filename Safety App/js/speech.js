/* ==========================================================================
   Safety Scouts — speech (topic.html only)
   Text-to-speech playback, speech-recognition matching for the guided
   flashcard drill, and the narrative typewriter effect. Nothing outside
   initTopicPage (js/page-topic.js) uses any of this.
   ========================================================================== */

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
  utter.rate = profile.rate * getSpeechRateMultiplier();
  window.speechSynthesis.speak(utter);
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
  if (SPEECH_SUPPORTED) window.speechSynthesis.cancel();
  clearActiveHighlight();
}

// Reads one or more elements aloud as a single utterance, highlighting the
// word being spoken as it goes -- a progressive enhancement: it depends on
// SpeechSynthesisUtterance's `onboundary` event, which reliably fires with
// word offsets on desktop Chrome/Edge/Firefox/Safari but is inconsistent on
// many mobile browsers. Where it doesn't fire, this silently falls back to
// plain read-aloud with no highlighting -- never breaks speech itself.
// `segments` is [{ el, text }]; each el's content is replaced with one
// <span> per word so the matching word can be highlighted.
function speakWithHighlight(segments, speaker, joiner){
  if (!SPEECH_SUPPORTED) return;
  window.speechSynthesis.cancel();
  clearActiveHighlight();

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
  });
  if (!fullText) return;

  const utter = new SpeechSynthesisUtterance(fullText);
  utter.lang = getLang() === 'es' ? 'es-ES' : 'en-US';
  const profile = voiceProfileFor(speaker);
  if (profile.voice) utter.voice = profile.voice;
  utter.pitch = profile.pitch;
  utter.rate = profile.rate * getSpeechRateMultiplier();

  // onboundary is the accurate path, but plenty of mobile browsers never
  // fire it at all, which used to mean no highlight ever appeared there --
  // if no real boundary shows up shortly after speech starts, fall back to
  // advancing through the words on an estimated per-word timer instead.
  // Not perfectly in sync, but far better than nothing. A real boundary
  // event arriving later (some engines fire it late/sparsely rather than
  // never) always takes back over from the estimate.
  let usedRealBoundary = false;
  let fallbackIndex = 0;

  // Swaps which word is highlighted without touching the fallback timer --
  // clearActiveHighlight() (module-level) also stops that timer, which
  // would be wrong to do from inside a tick of the timer itself.
  function highlightSpan(span){
    if (activeHighlightSpan) activeHighlightSpan.classList.remove('is-speaking-word');
    span.classList.add('is-speaking-word');
    activeHighlightSpan = span;
  }

  function stopFallback(){
    if (activeFallbackTimer){ clearInterval(activeFallbackTimer); activeFallbackTimer = null; }
  }

  function startFallback(){
    if (usedRealBoundary || activeFallbackTimer || !wordSpans.length) return;
    const wordsPerMinute = 165 * (utter.rate || 1);
    const msPerWord = Math.max(120, 60000 / wordsPerMinute);
    activeFallbackTimer = setInterval(() => {
      if (fallbackIndex >= wordSpans.length){ stopFallback(); return; }
      highlightSpan(wordSpans[fallbackIndex].span);
      fallbackIndex += 1;
    }, msPerWord);
  }

  utter.onstart = () => setTimeout(() => { if (!usedRealBoundary) startFallback(); }, 350);
  utter.onboundary = (e) => {
    if (e.name && e.name !== 'word') return;
    const match = wordSpans.find(w => e.charIndex >= w.start && e.charIndex < w.end);
    if (!match) return;
    usedRealBoundary = true;
    stopFallback();
    highlightSpan(match.span);
  };
  utter.onend = clearActiveHighlight;
  utter.onerror = clearActiveHighlight;

  window.speechSynthesis.speak(utter);
}

function wireSpeakButtonHighlighted(root, segments, speaker, joiner){
  if (!SPEECH_SUPPORTED) return;
  const btn = root.querySelector('[data-speak-btn]');
  if (btn) btn.addEventListener('click', () => speakWithHighlight(segments, speaker, joiner));
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

