/* ==========================================================================
   Safety Superheroes — emotion check-in
   A small, optional, never-blocking "how are you feeling?" prompt on the
   home page. Seconds to use, teaches emotion labeling, and warms up a
   session -- shown at most once per day, always dismissible without
   answering. Answers are stored locally only, purely so the moment
   doesn't repeat the same day; nothing is analyzed or shown elsewhere.
   ========================================================================== */

const EMOTION_LAST_SHOWN_KEY = 'safetylib_emotion_last_shown';
const EMOTIONS = [
  { code: 'happy', emoji: '😊', labelKey: 'emotion_happy' },
  { code: 'okay', emoji: '🙂', labelKey: 'emotion_okay' },
  { code: 'meh', emoji: '😐', labelKey: 'emotion_meh' },
  { code: 'sad', emoji: '😢', labelKey: 'emotion_sad' },
  { code: 'mad', emoji: '😠', labelKey: 'emotion_mad' },
];

function todayStamp(){
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function initEmotionCheckin(){
  const mount = document.querySelector('[data-emotion-checkin]');
  if (!mount) return;
  let shownToday = false;
  try { shownToday = localStorage.getItem(EMOTION_LAST_SHOWN_KEY) === todayStamp(); } catch (e) { /* ignore */ }
  if (shownToday) return;

  function markShownToday(){
    try { localStorage.setItem(EMOTION_LAST_SHOWN_KEY, todayStamp()); } catch (e) { /* ignore */ }
  }

  function render(){
    mount.innerHTML = `
      <div class="emotion-checkin" data-emotion-card>
        <button type="button" class="emotion-checkin__close" data-emotion-close aria-label="${t('emotion_dismiss')}">✕</button>
        <p class="emotion-checkin__prompt">${t('emotion_prompt')}</p>
        <div class="emotion-checkin__faces">
          ${EMOTIONS.map(e => `
            <button type="button" class="emotion-checkin__face" data-emotion="${e.code}" aria-label="${t(e.labelKey)}" title="${t(e.labelKey)}">
              <span aria-hidden="true">${e.emoji}</span>
            </button>`).join('')}
        </div>
      </div>`;

    mount.querySelector('[data-emotion-close]').addEventListener('click', () => {
      markShownToday();
      mount.innerHTML = '';
    });
    mount.querySelectorAll('[data-emotion]').forEach(btn => {
      btn.addEventListener('click', () => {
        markShownToday();
        mount.innerHTML = `<div class="emotion-checkin emotion-checkin--thanks"><p>${t('emotion_thanks')}</p></div>`;
        setTimeout(() => { mount.innerHTML = ''; }, 2200);
      });
    });
  }

  render();
  window.addEventListener('safetylib:langchange', () => {
    if (mount.querySelector('[data-emotion-card]')) render();
  });
}
