/* ==========================================================================
   Safety Superheroes — symbol support (scoped version)
   Real AAC symbol sets (Widgit/PCS/etc.) are commercially licensed, so
   this uses a curated keyword-to-emoji dictionary instead -- not a full
   AAC system, but a lightweight visual-support layer over the existing
   text: when on, a small row of icons for the key words in the current
   sentence appears above it. Toggle lives in the Display panel, same
   on/off pattern as Calm Mode.
   ========================================================================== */

const SYMBOL_MODE_KEY = 'safetylib_symbol_mode';

const SYMBOL_MAP = {
  en: {
    stranger: '🧑', 'grown-up': '🧑', grownup: '🧑', adult: '🧑', parent: '🧑',
    police: '👮', officer: '👮', lifeguard: '🏊', teacher: '🍎',
    help: '🆘', stop: '🛑', no: '🙅', yes: '✅', safe: '🛡️', unsafe: '⚠️', danger: '⚠️', dangerous: '⚠️',
    fire: '🔥', water: '💧', earthquake: '🫨', rain: '🌧️', storm: '⛈️', thunder: '⛈️', lightning: '⚡',
    car: '🚗', street: '🛣️', road: '🛣️', crosswalk: '🚸', bike: '🚲', bicycle: '🚲', helmet: '🪖',
    phone: '📱', emergency: '🚨', house: '🏠', home: '🏠', door: '🚪',
    secret: '🤫', secrets: '🤫', body: '🧍', hug: '🤗', touch: '✋',
    privacy: '🔒', private: '🔒', internet: '💻', online: '💻', computer: '💻', screenshot: '📸',
    bully: '😠', bullying: '😠', friend: '🧑‍🤝‍🧑',
    happy: '😊', sad: '😢', scared: '😨', afraid: '😨', angry: '😠',
    rules: '📋', plan: '📝', school: '🏫', park: '🌳', store: '🏬',
    lost: '🧭', found: '🔍', wait: '⏳', listen: '👂', look: '👀', talk: '🗣️', tell: '🗣️', ask: '❓',
    trust: '🤝', rights: '⚖️', right: '⚖️', swim: '🏊', swimming: '🏊', pool: '🏊', beach: '🏖️', lake: '🏞️',
    respect: '🙏', bystander: '👀', boundary: '🚧', boundaries: '🚧',
  },
  es: {
    extraño: '🧑', desconocido: '🧑', adulto: '🧑',
    policía: '👮', salvavidas: '🏊', maestro: '🍎', maestra: '🍎',
    ayuda: '🆘', alto: '🛑', detente: '🛑', no: '🙅', sí: '✅', seguro: '🛡️', segura: '🛡️', peligro: '⚠️', peligroso: '⚠️',
    fuego: '🔥', incendio: '🔥', agua: '💧', terremoto: '🫨', lluvia: '🌧️', tormenta: '⛈️', rayo: '⚡',
    auto: '🚗', carro: '🚗', calle: '🛣️', cruce: '🚸', bicicleta: '🚲', casco: '🪖',
    teléfono: '📱', emergencia: '🚨', casa: '🏠', puerta: '🚪',
    secreto: '🤫', secretos: '🤫', cuerpo: '🧍', abrazo: '🤗', toque: '✋',
    privacidad: '🔒', privado: '🔒', internet: '💻', computadora: '💻', captura: '📸',
    acoso: '😠', amigo: '🧑‍🤝‍🧑', amiga: '🧑‍🤝‍🧑',
    feliz: '😊', triste: '😢', asustado: '😨', enojado: '😠', enojada: '😠',
    reglas: '📋', plan: '📝', escuela: '🏫', parque: '🌳', tienda: '🏬',
    perdido: '🧭', encontrado: '🔍', esperar: '⏳', escuchar: '👂', mirar: '👀', hablar: '🗣️', preguntar: '❓',
    confianza: '🤝', derechos: '⚖️', nadar: '🏊', piscina: '🏊', playa: '🏖️', lago: '🏞️', respeto: '🙏',
  },
};

function getSymbolMode(){
  try { return localStorage.getItem(SYMBOL_MODE_KEY) === 'on'; } catch (e) { return false; }
}

function setSymbolMode(on){
  try { localStorage.setItem(SYMBOL_MODE_KEY, on ? 'on' : 'off'); } catch (e) { /* ignore */ }
}

// Returns up to `max` unique emoji for the key words found in `text`, in the
// order those words first appear. Not a translation of the sentence --
// just a handful of visual anchors for its main concepts.
function getSymbolsForText(text, lang, max){
  const dict = SYMBOL_MAP[lang] || SYMBOL_MAP.en;
  const words = String(text).toLowerCase().replace(/[“”"‘’.,!?¡¿]/g, '').split(/\s+/);
  const seen = new Set();
  const out = [];
  words.forEach(word => {
    if (out.length >= (max || 5)) return;
    const bare = word.replace(/s$/, '');
    const emoji = dict[word] || dict[bare];
    if (!emoji || seen.has(emoji)) return;
    seen.add(emoji);
    out.push(emoji);
  });
  return out;
}

function symbolRowHtml(text, lang){
  if (!getSymbolMode()) return '';
  const symbols = getSymbolsForText(text, lang, 5);
  if (!symbols.length) return '';
  return `<div class="symbol-row" aria-hidden="true">${symbols.map(s => `<span class="symbol-row__icon">${s}</span>`).join('')}</div>`;
}

function initSymbolModeToggle(){
  const wrap = document.querySelector('[data-symbolmode-switch]');
  if (!wrap) return;
  function render(){
    const on = getSymbolMode();
    wrap.innerHTML = `
      <button type="button" class="calmmode-toggle ${on ? 'is-on' : ''}" data-symbolmode-btn role="switch" aria-checked="${on}">
        <span class="calmmode-toggle__track"><span class="calmmode-toggle__thumb"></span></span>
        <span>${t(on ? 'symbolmode_on' : 'symbolmode_off')}</span>
      </button>`;
    wrap.querySelector('[data-symbolmode-btn]').addEventListener('click', () => {
      setSymbolMode(!getSymbolMode());
      render();
      window.dispatchEvent(new CustomEvent('safetylib:symbolmodechange'));
    });
  }
  render();
  window.addEventListener('safetylib:langchange', render);
}
