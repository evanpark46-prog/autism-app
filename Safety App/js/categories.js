/* ==========================================================================
   Safety Scouts — topic categories
   Shared by the home page grid and the badge collection page. Each
   topic's `theme` (js/data.js) is already assigned per category (see the
   comment there), so a category's color and its topics' card colors
   always match.
   ========================================================================== */

const TOPIC_CATEGORIES = [
  { key: 'out_about', color: 'green', topics: ['stranger-safety', 'street-safety', 'lost-safety', 'bike-safety', 'awareness-safety'] },
  { key: 'emergencies', color: 'red', topics: ['emergency-safety', 'fire-safety', 'earthquake-safety', 'rainyweather-safety', 'water-safety', 'home-safety', 'plan-safety'] },
  { key: 'body', color: 'purple', topics: ['body-boundaries-safety', 'secrets-safety', 'reporting-safety', 'privacy-safety'] },
  { key: 'online', color: 'blue', topics: ['online-safety', 'cyberbullying-safety', 'citizenship-safety'] },
  { key: 'speaking_up', color: 'amber', topics: ['selfadvocacy-safety', 'rights-safety', 'bullying-safety', 'peer-pressure-safety'] },
];

const CATEGORY_ACCENT_VAR = {
  blue: 'var(--blue-dark)', green: 'var(--green)', purple: 'var(--purple)',
  red: 'var(--red)', amber: 'var(--amber)',
};
