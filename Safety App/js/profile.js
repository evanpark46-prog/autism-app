/* ==========================================================================
   Safety Superheroes — "My Profile" personalization + access options
   Loaded on every page (before boot.js). Stores one local-only profile
   (never sent anywhere):
     - name     : replaces the story character "Alex" everywhere lesson
                  content is read (stories, flashcards, worksheets, review)
     - avatar   : emoji shown in the header button + home greeting
     - adults   : the learner's own trusted grown-ups (shown on the home
                  greeting and printed on practice worksheets)
     - look     : 'playful' (bright, colorful default) or 'calm' (the
                  original quiet look). Calm Mode also forces the calm look.
     - autoRead : read every story step aloud automatically (blind/low-vision
                  learners, early/non-readers)
     - contrast : high-contrast colors (low vision)
     - easyFont : Atkinson Hyperlegible, a typeface designed for low vision
     - captions : always turn on video captions (deaf/hard-of-hearing)
   ========================================================================== */

const PROFILE_KEY = 'safetylib_profile_v1';
const PROFILE_AVATARS = ['🦁', '🐯', '🐼', '🦊', '🐸', '🐙', '🦄', '🐲', '🐢', '🐬', '🦉', '🚀', '⭐', '🌈', '⚽', '🎨'];
const PROFILE_DEFAULTS = {
  name: '', avatar: '⭐', adults: ['', '', ''],
  look: 'playful', autoRead: false, readChoices: true, contrast: false, easyFont: false, captions: false,
};

function getProfile(){
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}') || {}; } catch (e) { saved = {}; }
  const p = Object.assign({}, PROFILE_DEFAULTS, saved);
  p.adults = Array.isArray(p.adults) ? p.adults.concat(['', '', '']).slice(0, 3) : ['', '', ''];
  return p;
}

function saveProfile(p){
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch (e) { /* storage unavailable */ }
  _personalizedCache.clear();
  applyProfileAttrs();
  window.dispatchEvent(new CustomEvent('safetylib:profilechange'));
}

function applyProfileAttrs(){
  const p = getProfile();
  const root = document.documentElement;
  root.setAttribute('data-look', p.look === 'calm' ? 'calm' : 'playful');
  root.toggleAttribute('data-contrast', !!p.contrast);
  root.toggleAttribute('data-easy-font', !!p.easyFont);
}

function cleanName(s){
  return String(s || '').replace(/[<>{}]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20);
}

function learnerName(){ return cleanName(getProfile().name) || ''; }
function isAutoRead(){ return !!getProfile().autoRead; }
function readChoicesAloud(){ return getProfile().readChoices !== false; }
function wantsCaptions(){ return !!getProfile().captions; }
function trustedAdults(){ return getProfile().adults.map(cleanName).filter(Boolean); }

/* ---------- Name personalization of lesson content ---------- */

function personalizeText(str){
  const name = learnerName();
  if (!name || typeof str !== 'string') return str;
  return str.replace(/\bAlex\b/g, name);
}

function deepPersonalize(value){
  if (typeof value === 'string') return personalizeText(value);
  if (Array.isArray(value)) return value.map(deepPersonalize);
  if (value && typeof value === 'object'){
    const out = {};
    for (const k of Object.keys(value)){
      // Never rewrite ids / asset keys -- only human-readable text.
      out[k] = (k === 'illustration' || k === 'image' || k === 'youtubeId' || k === 'id' || k === 'type')
        ? value[k] : deepPersonalize(value[k]);
    }
    return out;
  }
  return value;
}

// Personalized copies are cached so the same step object is returned on
// every render (page-topic.js tracks missed steps by object identity).
const _personalizedCache = new Map();
function _wrapContentGetter(fnName){
  const original = window[fnName];
  if (typeof original !== 'function') return;
  window[fnName] = function(id, lang){
    const content = original(id, lang);
    const name = learnerName();
    if (!content || !name) return content;
    const key = `${fnName}|${id}|${lang}|${name}`;
    if (!_personalizedCache.has(key) || _personalizedCache.get(key).src !== content){
      _personalizedCache.set(key, { src: content, out: deepPersonalize(content) });
    }
    return _personalizedCache.get(key).out;
  };
}
_wrapContentGetter('getTopicContent');
_wrapContentGetter('getTopicSummary');

/* ---------- Auto read-aloud helper (used by speech.js / page-topic.js) ---------- */

function maybeAutoRead(btn, delay){
  if (!btn || !isAutoRead()) return;
  setTimeout(() => {
    if (!document.contains(btn)) return;
    // Clear any reading still going from the previous step first; otherwise
    // the 🔊 button's tap-to-stop behavior would stop instead of read.
    if (typeof stopSpeaking === 'function') stopSpeaking();
    btn.click();
  }, delay == null ? 250 : delay);
}

function maybeAutoSpeak(text, delay){
  if (!text || !isAutoRead() || typeof speak !== 'function') return;
  setTimeout(() => speak(text), delay == null ? 300 : delay);
}

/* ---------- Header button + profile dialog ---------- */

function profileButtonHtml(){
  const p = getProfile();
  const name = learnerName();
  return `<span class="profile-btn__avatar" aria-hidden="true">${escapeHtml(p.avatar)}</span>
    <span class="profile-btn__label">${escapeHtml(name || t('profile_btn'))}</span>`;
}

function injectProfileButton(){
  const settings = document.querySelector('.display-settings');
  if (!settings || document.querySelector('[data-profile-open]')) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'profile-btn';
  btn.setAttribute('data-profile-open', '');
  btn.innerHTML = profileButtonHtml();
  btn.addEventListener('click', openProfileDialog);
  settings.parentNode.insertBefore(btn, settings);
  const refresh = () => { btn.innerHTML = profileButtonHtml(); btn.setAttribute('aria-label', t('profile_dialog_title')); };
  refresh();
  window.addEventListener('safetylib:profilechange', refresh);
  window.addEventListener('safetylib:langchange', refresh);
}

function toggleRowHtml(key, labelKey, hintKey, on){
  return `
    <label class="profile-toggle">
      <input type="checkbox" data-profile-flag="${key}" ${on ? 'checked' : ''}>
      <span class="profile-toggle__text"><strong>${t(labelKey)}</strong><small>${t(hintKey)}</small></span>
    </label>`;
}

function openProfileDialog(){
  let dlg = document.querySelector('[data-profile-dialog]');
  if (!dlg){
    dlg = document.createElement('dialog');
    dlg.className = 'profile-dialog';
    dlg.setAttribute('data-profile-dialog', '');
    document.body.appendChild(dlg);
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  }
  const p = getProfile();
  const skin = typeof getSkin === 'function' ? getSkin() : 'rose';
  const skins = typeof SKINS !== 'undefined' ? SKINS : [];
  dlg.innerHTML = `
    <form method="dialog" class="profile-form" data-profile-form>
      <div class="profile-form__head">
        <h2>${t('profile_dialog_title')}</h2>
        <button type="button" class="profile-form__close" data-profile-close aria-label="${t('profile_close')}">✕</button>
      </div>

      <fieldset class="profile-section">
        <legend>${t('profile_section_me')}</legend>
        <label class="profile-field">
          <span>${t('profile_name_label')}</span>
          <input type="text" maxlength="20" autocomplete="off" data-profile-name value="${escapeHtml(p.name)}" placeholder="${t('profile_name_placeholder')}">
          <small>${t('profile_name_hint')}</small>
        </label>
        <div class="profile-field">
          <span id="profile-avatar-label">${t('profile_avatar_label')}</span>
          <div class="profile-avatars" role="radiogroup" aria-labelledby="profile-avatar-label">
            ${PROFILE_AVATARS.map(a => `<button type="button" class="profile-avatar ${a === p.avatar ? 'is-picked' : ''}" role="radio" aria-checked="${a === p.avatar}" data-profile-avatar="${a}">${a}</button>`).join('')}
          </div>
        </div>
        ${skins.length ? `
        <div class="profile-field">
          <span id="profile-color-label">${t('profile_color_label')}</span>
          <div class="skin-switch" role="radiogroup" aria-labelledby="profile-color-label">
            ${skins.map(s => `<button type="button" class="skin-switch__swatch skin-swatch-${s.code}" role="radio" aria-checked="${s.code === skin}" aria-pressed="${s.code === skin}" data-profile-skin="${s.code}" aria-label="${t(s.labelKey)}" title="${t(s.labelKey)}"></button>`).join('')}
          </div>
        </div>` : ''}
      </fieldset>

      <fieldset class="profile-section">
        <legend>${t('profile_section_adults')}</legend>
        <small class="profile-section__hint">${t('profile_adults_hint')}</small>
        ${p.adults.map((a, i) => `<input type="text" maxlength="30" autocomplete="off" class="profile-adult" data-profile-adult="${i}" value="${escapeHtml(a)}" placeholder="${t('profile_adult_placeholder_' + (i + 1))}" aria-label="${t('profile_adult_aria', { n: i + 1 })}">`).join('')}
      </fieldset>

      <fieldset class="profile-section">
        <legend>${t('profile_section_look')}</legend>
        <div class="profile-looks">
          <label class="profile-look"><input type="radio" name="profile-look" value="playful" ${p.look !== 'calm' ? 'checked' : ''}><span class="profile-look__swatch profile-look__swatch--playful" aria-hidden="true"></span><strong>${t('profile_look_playful')}</strong></label>
          <label class="profile-look"><input type="radio" name="profile-look" value="calm" ${p.look === 'calm' ? 'checked' : ''}><span class="profile-look__swatch profile-look__swatch--calm" aria-hidden="true"></span><strong>${t('profile_look_calm')}</strong></label>
        </div>
      </fieldset>

      <fieldset class="profile-section">
        <legend>${t('profile_section_access')}</legend>
        ${toggleRowHtml('autoRead', 'profile_autoread', 'profile_autoread_hint', p.autoRead)}
        ${toggleRowHtml('readChoices', 'profile_readchoices', 'profile_readchoices_hint', p.readChoices !== false)}
        ${toggleRowHtml('contrast', 'profile_contrast', 'profile_contrast_hint', p.contrast)}
        ${toggleRowHtml('easyFont', 'profile_easyfont', 'profile_easyfont_hint', p.easyFont)}
        ${toggleRowHtml('captions', 'profile_captions', 'profile_captions_hint', p.captions)}
        <p class="profile-section__hint"><a href="parents.html#every-learner">${t('profile_access_more')}</a></p>
      </fieldset>

      <div class="profile-form__actions">
        <button type="button" class="btn btn-ghost" data-profile-reset>${t('profile_reset')}</button>
        <button type="submit" class="btn btn-primary" data-profile-save>${t('profile_save')}</button>
      </div>
    </form>`;

  let avatar = p.avatar;
  dlg.querySelectorAll('[data-profile-avatar]').forEach(b => b.addEventListener('click', () => {
    avatar = b.dataset.profileAvatar;
    dlg.querySelectorAll('[data-profile-avatar]').forEach(x => {
      x.classList.toggle('is-picked', x === b);
      x.setAttribute('aria-checked', String(x === b));
    });
  }));
  dlg.querySelectorAll('[data-profile-skin]').forEach(b => b.addEventListener('click', () => {
    if (typeof setSkin === 'function') setSkin(b.dataset.profileSkin);
    dlg.querySelectorAll('[data-profile-skin]').forEach(x => {
      x.setAttribute('aria-checked', String(x === b));
      x.setAttribute('aria-pressed', String(x === b));
    });
  }));
  dlg.querySelector('[data-profile-close]').addEventListener('click', () => dlg.close());
  dlg.querySelector('[data-profile-reset]').addEventListener('click', () => {
    saveProfile(Object.assign({}, PROFILE_DEFAULTS));
    dlg.close();
    window.location.reload();
  });
  dlg.querySelector('[data-profile-form]').addEventListener('submit', e => {
    e.preventDefault();
    const before = getProfile();
    const next = {
      name: cleanName(dlg.querySelector('[data-profile-name]').value),
      avatar,
      adults: [0, 1, 2].map(i => cleanName(dlg.querySelector(`[data-profile-adult="${i}"]`).value).slice(0, 30)),
      look: (dlg.querySelector('input[name="profile-look"]:checked') || {}).value === 'calm' ? 'calm' : 'playful',
    };
    dlg.querySelectorAll('[data-profile-flag]').forEach(cb => { next[cb.dataset.profileFlag] = cb.checked; });
    saveProfile(next);
    dlg.close();
    // A new name changes every lesson string already on screen -- simplest
    // correct refresh is a reload (content is re-personalized on load).
    if (before.name !== next.name || before.captions !== next.captions) window.location.reload();
  });

  if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  const first = dlg.querySelector('[data-profile-name]');
  if (first) first.focus();
}

/* ---------- Colorful rainbow-letter headings (playful look) ---------- */

// Wraps each letter of a heading in a colored span for the playful look.
// The original text stays available to screen readers via aria-label on the
// element and aria-hidden on the letter spans, so it is never read letter
// by letter. Calm look hides the colors purely with CSS.
function rainbowize(el){
  if (!el || el.dataset.rainbow === 'done') return;
  const text = el.textContent;
  if (!text.trim()) return;
  el.dataset.rainbow = 'done';
  el.setAttribute('aria-label', text.trim());
  let i = 0;
  const words = text.split(/(\s+)/);
  el.innerHTML = words.map(w => {
    if (/^\s+$/.test(w)) return w;
    return `<span class="rainbow-word" aria-hidden="true">${[...w].map(ch => `<span class="rainbow-letter rainbow-c${(i++ % 6)}">${escapeHtml(ch)}</span>`).join('')}</span>`;
  }).join('');
}

function applyRainbowHeadings(){
  document.querySelectorAll('.brand > [data-i18n="brand"], .hero h1, [data-rainbow-heading]').forEach(el => {
    el.dataset.rainbow = '';
    el.removeAttribute('aria-label');
    rainbowize(el);
  });
}

/* ---------- Home greeting ---------- */

function renderHomeGreeting(){
  const hero = document.querySelector('body[data-page="home"] .hero');
  if (!hero) return;
  let card = hero.querySelector('[data-profile-greeting]');
  if (!card){
    card = document.createElement('div');
    card.className = 'profile-greeting';
    card.setAttribute('data-profile-greeting', '');
    const h1 = hero.querySelector('h1');
    hero.insertBefore(card, h1 || hero.firstChild);
  }
  const p = getProfile();
  const name = learnerName();
  const adults = trustedAdults();
  card.innerHTML = `
    <span class="profile-greeting__avatar" aria-hidden="true">${escapeHtml(p.avatar)}</span>
    <div class="profile-greeting__body">
      <p class="profile-greeting__hi">${escapeHtml(name ? t('profile_greeting_named', { name }) : t('profile_greeting_anon'))}</p>
      ${adults.length ? `<p class="profile-greeting__adults">${escapeHtml(t('profile_greeting_adults', { list: adults.join(', ') }))}</p>` : ''}
    </div>
    <button type="button" class="btn btn-secondary profile-greeting__btn" data-profile-greeting-btn>${t(name ? 'profile_greeting_edit' : 'profile_greeting_setup')}</button>`;
  card.querySelector('[data-profile-greeting-btn]').addEventListener('click', openProfileDialog);
}

function injectSky(){
  if (document.querySelector('.pl-sky')) return;
  const sky = document.createElement('div');
  sky.className = 'pl-sky';
  sky.setAttribute('aria-hidden', 'true');
  sky.innerHTML = '<div class="pl-sun"><div class="pl-rays"></div></div>'
    + [1, 2, 3, 4, 5, 6].map(i => `<div class="pl-cloud c${i}"></div>`).join('')
    + [1, 2, 3, 4, 5, 6, 7, 8].map(i => `<span class="pl-twinkle t${i}">✦</span>`).join('');
  document.body.insertBefore(sky, document.body.firstChild);
}

function initProfile(){
  applyProfileAttrs();
  injectSky();
  injectProfileButton();
  applyRainbowHeadings();
  renderHomeGreeting();
  // boot.js re-applies static i18n text on langchange after this listener
  // runs, so re-color on the next tick.
  window.addEventListener('safetylib:langchange', () => setTimeout(() => { applyRainbowHeadings(); renderHomeGreeting(); }, 0));
  window.addEventListener('safetylib:profilechange', renderHomeGreeting);
}
