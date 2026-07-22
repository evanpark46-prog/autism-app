/* ==========================================================================
   Safety Scouts — read-aloud speed picker
   Purely a multiplier applied on top of each voice's own base rate in
   js/app.js — never overrides the per-character pitch/voice profile.
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
}
