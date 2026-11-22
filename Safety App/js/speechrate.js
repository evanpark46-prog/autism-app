/* ==========================================================================
   Safety Superheroes — read-aloud speed picker
   Purely a multiplier applied on top of each voice's own base rate in
   js/speech.js — never overrides the per-character pitch/voice profile.
   ========================================================================== */

const SPEECH_RATES = [
  { code: 'slow', labelKey: 'rate_slow', multiplier: 0.7 },
  { code: 'medium', labelKey: 'rate_medium', multiplier: 0.85 },
  { code: 'normal', labelKey: 'rate_normal', multiplier: 1 },
  { code: 'fast', labelKey: 'rate_fast', multiplier: 1.3 },
];

function getSpeechRateCode(){
  const saved = localStorage.getItem('safetylib_speech_rate');
  return SPEECH_RATES.some(r => r.code === saved) ? saved : 'normal';
}

function setSpeechRateCode(code){
  if (!SPEECH_RATES.some(r => r.code === code)) return;
  localStorage.setItem('safetylib_speech_rate', code);
}

function getSpeechRateMultiplier(){
  const current = getSpeechRateCode();
  const match = SPEECH_RATES.find(r => r.code === current);
  return match ? match.multiplier : 1;
}

function initSpeechRateSwitcher(){
  const select = document.querySelector('[data-rate-select]');
  if (!select) return;
  function render(){
    const current = getSpeechRateCode();
    select.innerHTML = SPEECH_RATES.map(r =>
      `<option value="${r.code}" ${r.code === current ? 'selected' : ''}>${t(r.labelKey)}</option>`).join('');
  }
  render();
  select.addEventListener('change', () => setSpeechRateCode(select.value));
  window.addEventListener('safetylib:langchange', render);
  initVoicePicker();
}

/* ---------------------------------------------------------------------- */
/* Reading voice: ranking + picker (shared by every page's Display panel) */
/* ---------------------------------------------------------------------- */

const TTS_OK = typeof window !== 'undefined' && 'speechSynthesis' in window;
const VOICE_PREF_KEY = 'safetylib_voice_v1'; // { en: "voice name", es: "voice name" }

let cachedVoices = [];
function refreshVoiceCache(){
  if (!TTS_OK) return;
  cachedVoices = window.speechSynthesis.getVoices() || [];
  window.dispatchEvent(new CustomEvent('safetylib:voiceschanged'));
}
if (TTS_OK){
  refreshVoiceCache();
  window.speechSynthesis.addEventListener('voiceschanged', refreshVoiceCache);
}

// Apple's joke / robotic voices (Zarvox, Bubbles, Bad News…), the
// Eloquence voices (Eddy, Flo, Grandpa…) and eSpeak-style engines should
// never read to a child, even when nothing better is installed.
const NOVELTY_VOICE = /\b(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|junior|kathy|organ|princess|ralph|superstar|trinoids|whisper|wobble|zarvox|fred|grandma|grandpa|eddy|flo|reed|rocko|sandy|shelley|espeak|compact|pico)\b/i;
const NICE_SYSTEM_VOICE = /\b(samantha|ava|allison|susan|tom|nicky|karen|daniel|moira|tessa|serena|kate|paulina|m[oó]nica|juan|jorge|diego|marisol|ang[eé]lica|francisca)\b/i;

// Lower = better.
function rankVoice(v){
  const name = v.name || '';
  if (NOVELTY_VOICE.test(name)) return 9;
  if (/natural|neural|premium/i.test(name)) return 0;      // Edge "Online (Natural)", Apple Premium
  if (/enhanced|siri/i.test(name)) return 1;
  if (/google/i.test(name)) return 1;                      // Chrome network voices
  if (/online/i.test(name)) return 1;
  if (NICE_SYSTEM_VOICE.test(name)) return 2;
  if (/microsoft/i.test(name)) return 4;                   // old Windows desktop voices (David, Zira…)
  return 3;
}

// Within a tier prefer the accent kids here will expect.
function localeScore(v, lang){
  const l = (v.lang || '').toLowerCase().replace('_', '-');
  if (lang === 'es') return /^es-(us|mx|419)/.test(l) ? 0 : (l === 'es-es' ? 1 : 2);
  return l === 'en-us' ? 0 : (/^en-(gb|ca|au)/.test(l) ? 1 : 2);
}

function voicesForLang(lang){
  const prefix = lang === 'es' ? 'es' : 'en';
  return cachedVoices
    .filter(v => v.lang && v.lang.toLowerCase().startsWith(prefix))
    .sort((a, b) => (rankVoice(a) - rankVoice(b)) || (localeScore(a, lang) - localeScore(b, lang)) || ((b.localService ? 0 : 1) - (a.localService ? 0 : 1)));
}

function getVoicePrefs(){
  try { return JSON.parse(localStorage.getItem(VOICE_PREF_KEY)) || {}; } catch (e){ return {}; }
}
function setVoicePref(lang, name){
  try { const p = getVoicePrefs(); if (name) p[lang] = name; else delete p[lang]; localStorage.setItem(VOICE_PREF_KEY, JSON.stringify(p)); } catch (e){}
}

// The one voice used for reading in this language: the grown-up's pick if
// it is installed here, otherwise the best-sounding voice available.
function readingVoice(lang){
  const list = voicesForLang(lang || (typeof getLang === 'function' ? getLang() : 'en'));
  if (!list.length) return null;
  const want = getVoicePrefs()[lang || getLang()];
  return (want && list.find(v => v.name === want)) || list[0];
}

function voiceLabel(v){
  const name = v.name.replace(/^(Microsoft|Google)\s+/i, '').replace(/\s*\((Natural|Enhanced|Premium)\)/i, ' ✨').replace(/\s+Online/i, '');
  return `${name} (${v.lang})`;
}

function initVoicePicker(){
  const groups = document.querySelectorAll('[data-voice-select]');
  if (!groups.length) return;
  if (!TTS_OK){ groups.forEach(s => { const g = s.closest('.display-panel__group'); if (g) g.hidden = true; }); return; }
  const render = () => groups.forEach(select => {
    const lang = getLang();
    const list = voicesForLang(lang).filter(v => rankVoice(v) < 9);
    const current = readingVoice(lang);
    const testBtn = select.parentElement && select.parentElement.querySelector('[data-voice-test]');
    if (testBtn){ testBtn.setAttribute('aria-label', t('voice_test')); testBtn.title = t('voice_test'); }
    const auto = getVoicePrefs()[lang] ? '' : 'selected';
    select.innerHTML = `<option value="" ${auto}>${escapeHtml(t('voice_auto'))}${current ? ` — ${escapeHtml(voiceLabel(current))}` : ''}</option>` +
      list.map(v => `<option value="${escapeHtml(v.name)}" ${!auto && current && v.name === current.name ? 'selected' : ''}>${escapeHtml(voiceLabel(v))}</option>`).join('');
  });
  groups.forEach(select => {
    select.addEventListener('change', () => {
      setVoicePref(getLang(), select.value);
      render();
      voicePreview();
    });
    const test = select.parentElement && select.parentElement.querySelector('[data-voice-test]');
    if (test) test.addEventListener('click', voicePreview);
  });
  render();
  window.addEventListener('safetylib:voiceschanged', render);
  window.addEventListener('safetylib:langchange', render);
}

// A short sample in the chosen voice so a grown-up can compare voices.
function voicePreview(){
  if (!TTS_OK) return;
  const v = readingVoice(getLang());
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t('voice_sample'));
  if (v){ u.voice = v; u.lang = v.lang; }
  u.rate = 0.92 * getSpeechRateMultiplier();
  window.speechSynthesis.speak(u);
}
