/* ==========================================================================
   Safety Superheroes — natural recorded voice
   Every sentence the app reads aloud is pre-recorded once with a neural
   text-to-speech voice (Kokoro, open source / Apache-2.0) by
   tools/voice/generate.py and saved as audio/voice/<lang>/<key>.mp3.
   At read-aloud time js/speech.js looks each sentence up here; when every
   sentence of a read has a recording it plays those (a warm, human-sounding
   voice that is the same on every device), otherwise it falls back to the
   device's own speech voice. No account, no API key, works offline once
   heard (the service worker keeps the files).

   This file is also loaded by Node (tools/build-voice-list.js) so the
   sentence splitting and keys always match what the browser asks for.
   ========================================================================== */

const VOICE_AUDIO_BASE = 'audio/voice/';

// Make text sound right WITHOUT changing its length (word highlighting maps
// character offsets back onto the page): emoji and symbols become spaces
// (otherwise they're read out as "star", "superhero"…), dashes become commas
// (a natural pause), quote marks are dropped.
function cleanForSpeech(s){
  return String(s)
    .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}\u{20E3}]/gu, m => ' '.repeat(m.length))
    .replace(/[←→↑↓✓✔✖✕★☆•·…]/g, m => m === '…' ? '.' : ' ')
    .replace(/[—–]/g, ',')
    .replace(/[“”«»"]/g, ' ')
    .replace(/\s\/\s/g, () => ' , ');
}

// Sentence pieces of already-cleaned text, with their start offsets.
function speechSentences(clean){
  const out = [];
  const re = /[^.!?;:\n]*(?:[.!?;:\n]+|$)/g;
  let m;
  while ((m = re.exec(clean)) && m[0] !== ''){
    if (/[\p{L}\p{N}]/u.test(m[0])) out.push({ start: m.index, text: m[0] });
    if (re.lastIndex >= clean.length) break;
  }
  return out;
}

function voiceSentenceNorm(s){
  return String(s).replace(/\s+/g, ' ').replace(/^[\s,]+|[\s,]+$/g, '');
}

// FNV-1a (32-bit) + length: short, stable file names.
function voiceKey(sentence){
  const s = voiceSentenceNorm(sentence);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++){
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0') + s.length.toString(36);
}

if (typeof module !== 'undefined' && module.exports){
  module.exports = { cleanForSpeech, speechSentences, voiceSentenceNorm, voiceKey };
}

/* ---------------------------------------------------------------------- */
/* Browser side                                                           */
/* ---------------------------------------------------------------------- */

const voiceManifest = { en: null, es: null };
const voiceManifestLoading = {};
function loadVoiceManifest(lang){
  if (typeof fetch === 'undefined' || typeof window === 'undefined') return Promise.resolve(null);
  if (voiceManifest[lang]) return Promise.resolve(voiceManifest[lang]);
  if (!voiceManifestLoading[lang]){
    voiceManifestLoading[lang] = fetch(VOICE_AUDIO_BASE + lang + '/index.json')
      .then(r => r.ok ? r.json() : [])
      .then(list => { voiceManifest[lang] = new Set(list || []); return voiceManifest[lang]; })
      .catch(() => { voiceManifest[lang] = new Set(); return voiceManifest[lang]; });
  }
  return voiceManifestLoading[lang];
}

// Is the recorded voice switched on for this language? (It's the default;
// a grown-up can pick a device voice instead in the Display panel.)
function naturalVoiceOn(lang){
  if (typeof getVoicePrefs !== 'function') return true;
  return !getVoicePrefs()[lang];
}

// The recording keys for these sentences, or null if any is missing.
function recordedKeys(lang, sentences){
  const set = voiceManifest[lang];
  if (!set || !set.size || !naturalVoiceOn(lang)) return null;
  const keys = sentences.map(s => voiceKey(s.text));
  return keys.every(k => set.has(k)) ? keys : null;
}

const voiceBlobCache = new Map(); // url -> Promise<objectURL>
function fetchVoiceClip(lang, key){
  const url = VOICE_AUDIO_BASE + lang + '/' + key + '.mp3';
  if (!voiceBlobCache.has(url)){
    voiceBlobCache.set(url, fetch(url)
      .then(r => { if (!r.ok) throw new Error('missing ' + url); return r.blob(); })
      .then(b => URL.createObjectURL(b))
      .catch(e => { voiceBlobCache.delete(url); throw e; }));
    if (voiceBlobCache.size > 80){
      const first = voiceBlobCache.keys().next().value;
      const p = voiceBlobCache.get(first);
      voiceBlobCache.delete(first);
      p.then(u => URL.revokeObjectURL(u)).catch(() => {});
    }
  }
  return voiceBlobCache.get(url);
}

if (typeof window !== 'undefined' && typeof document !== 'undefined'){
  const warm = () => { try { loadVoiceManifest(typeof getLang === 'function' ? getLang() : 'en'); } catch (e){} };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', warm); else warm();
  window.addEventListener('safetylib:langchange', warm);
}
