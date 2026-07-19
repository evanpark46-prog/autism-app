/* ==========================================================================
   Safety Library — i18n
   Small dictionary-based translation system. No build step, no fetch:
   everything lives in memory so the site works from a plain file:// open too.
   To add a language: copy the "en" block below, translate every value,
   and add the language to LANGUAGES.
   ========================================================================== */

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

const UI_STRINGS = {
  en: {
    brand: 'Safety Scouts',
    nav_library: 'Home',
    nav_parents: 'Parents & Educators',
    lang_label: 'Language',
    skin_label: 'Color theme',
    skin_rose: 'Rose (default)',
    skin_ocean: 'Ocean',
    skin_sunset: 'Sunset',
    skin_meadow: 'Meadow',
    skin_berry: 'Berry',

    home_title: 'A calm place to practice staying safe',
    home_lead: 'Pick a topic below. Each one has a story, flashcards, and a video with questions along the way. No sign-in needed — just click and start.',
    home_topics_heading: 'Choose a topic',
    home_for_families: 'Looking for the parent & educator resources?',
    home_for_families_link: 'Go to Parents & Educators →',

    mode_story: 'Safety Scenario',
    mode_flashcards: 'Flashcards',
    mode_video: 'Video',

    read_aloud: 'Read aloud',

    story_next: 'Next →',
    story_try_again: 'Try again',
    story_continue: 'Continue',
    story_back_to_topics: '← Back to Safety Scouts',
    story_of: 'Step {current} of {total}',
    story_complete_title: 'Great job!',
    story_complete_lead: 'Here are the safety rules from this story:',
    story_replay: 'Play the story again',
    feedback_good_default: 'Good choice — that keeps you safe!',
    feedback_bad_default: 'Let’s think about that one again.',

    level_select_heading: 'Choose a level',
    level_select_lead: 'Pick how much of a challenge you want for this scenario.',
    level1_label: 'Level 1',
    level1_desc: 'Pre-K–Kindergarten — simple, clear choices',
    level2_label: 'Level 2',
    level2_desc: '1st–3rd grade — a bit more to think about',
    level3_label: 'Level 3',
    level3_desc: '4th grade & up — trickier situations',
    level_change: '← Change level',
    level_start: 'Start',

    flash_front_label: 'Question',
    flash_back_label: 'Key point',
    flash_flip: 'Flip card',
    flash_prev: '← Previous',
    flash_next: 'Next →',
    flash_counter: 'Card {current} of {total}',
    flash_restart: 'Start over',

    video_checkpoints_heading: 'Questions in this video',
    video_no_id_title: '🎬 Video coming soon',
    video_no_id_body: 'This lesson doesn’t have a video linked yet. Below is a preview of the questions that will pop up while it plays.',
    video_preview_btn: 'Preview the checkpoint questions',
    video_checkpoint_label: 'Checkpoint at {time}',
    video_resume: 'Resume video',
    video_setup_note: 'Educators: add a real YouTube video ID and adjust checkpoint timestamps in js/data.js — see the README.',

    parents_title: 'For Parents & Educators',
    parents_lead: 'Background on Safety Scouts, how to use it alongside a learner, and resources to go further.',
    parents_about_heading: 'About Safety Scouts',
    parents_about_body: 'Safety Scouts is a free, browser-based collection of independent-living safety lessons for autistic learners and anyone who benefits from clear, predictable practice. There is no sign-in and nothing is installed — every lesson combines a short illustrated story with a decision point, a flashcard review, and a video with built-in comprehension checkpoints.',
    parents_how_heading: 'How to use it with a learner',
    parents_how_body: 'Sit with the learner for the first pass through a topic so you can pause on any step and talk it through in your own words. The stories are intentionally short and low-stimulation — no timers, no flashing effects, and every wrong answer gets a calm explanation instead of a "fail" state. Flashcards are a good stand-alone warm-up or review once a story has been completed once.',
    parents_resources_heading: 'Resources & further reading',
    parents_curriculum_heading: 'Tentative curriculum & teaching activities',
    parents_curriculum_lead: 'A starting point for pairing each topic with an offline activity. Adjust freely to the learner’s age and goals.',
    parents_feedback_heading: 'Have feedback?',
    parents_feedback_body: 'Safety Scouts is actively growing. If you are a special education specialist, therapist, or parent with suggestions for new topics, wording changes, or things that didn’t work for your learner, we’d like to hear it.',
    parents_feedback_note: 'A feedback form isn’t wired up yet — for now, use the contact details your organization shared with you, or see the README for how to add one.',

    footer_note: 'Safety Scouts — a free resource. No accounts, no tracking beyond what your browser does by default.',

    parents_analytics_heading: 'Usage insights (this device only)',
    parents_analytics_body: 'A private dashboard showing which lessons have been opened and completed on this specific browser/device. It reads only from this device’s local storage — nothing is uploaded or shared, and it won’t show activity from a learner’s device unless you check it on that same device.',
    parents_analytics_link: 'Open usage insights →',

    analytics_title: 'Usage Insights',
    analytics_lead: 'A private view of lesson activity recorded on this device. Nothing here is uploaded anywhere — it only reflects what has happened in this browser.',
    analytics_note: 'This page is not linked from the main navigation. Data is stored only in this browser’s local storage; clearing your browser data will erase it, and it never syncs across devices.',
    analytics_stat_total_opens: 'Topic opens',
    analytics_stat_total_completes: 'Levels completed',
    analytics_stat_topics_active: 'Topics visited',
    analytics_stat_last_activity: 'Last activity',
    analytics_col_topic: 'Topic',
    analytics_col_opens: 'Opens',
    analytics_col_starts: 'Levels started',
    analytics_col_completes: 'Levels completed',
    analytics_col_flashcards: 'Flashcards opened',
    analytics_col_video: 'Video opened',
    analytics_col_last: 'Last visited',
    analytics_empty: 'No activity recorded yet on this device. Once a lesson is opened, it will show up here.',
    analytics_clear_btn: 'Clear all usage data',
    analytics_clear_confirm: 'This will permanently erase all recorded usage data on this device. Continue?',
    analytics_never: 'Never',
  },
  es: {
    brand: 'Exploradores de Seguridad',
    nav_library: 'Inicio',
    nav_parents: 'Padres y Educadores',
    lang_label: 'Idioma',
    skin_label: 'Color del tema',
    skin_rose: 'Rosa (predeterminado)',
    skin_ocean: 'Océano',
    skin_sunset: 'Atardecer',
    skin_meadow: 'Pradera',
    skin_berry: 'Baya',

    home_title: 'Un lugar tranquilo para practicar cómo mantenerse seguro',
    home_lead: 'Elige un tema abajo. Cada uno tiene una historia, tarjetas de repaso y un video con preguntas en el camino. No necesitas iniciar sesión — solo haz clic y empieza.',
    home_topics_heading: 'Elige un tema',
    home_for_families: '¿Buscas los recursos para padres y educadores?',
    home_for_families_link: 'Ir a Padres y Educadores →',

    mode_story: 'Escenario de seguridad',
    mode_flashcards: 'Tarjetas',
    mode_video: 'Video',

    read_aloud: 'Leer en voz alta',

    story_next: 'Siguiente →',
    story_try_again: 'Intentar de nuevo',
    story_continue: 'Continuar',
    story_back_to_topics: '← Volver a Exploradores de Seguridad',
    story_of: 'Paso {current} de {total}',
    story_complete_title: '¡Muy bien!',
    story_complete_lead: 'Estas son las reglas de seguridad de esta historia:',
    story_replay: 'Ver la historia de nuevo',
    feedback_good_default: '¡Buena elección! Eso te mantiene seguro.',
    feedback_bad_default: 'Pensemos en esa opción otra vez.',

    level_select_heading: 'Elige un nivel',
    level_select_lead: 'Elige cuánto reto quieres para este escenario.',
    level1_label: 'Nivel 1',
    level1_desc: 'Preescolar–Kínder — opciones simples y claras',
    level2_label: 'Nivel 2',
    level2_desc: '1.º–3.º grado — un poco más para pensar',
    level3_label: 'Nivel 3',
    level3_desc: '4.º grado en adelante — situaciones más difíciles',
    level_change: '← Cambiar de nivel',
    level_start: 'Empezar',

    flash_front_label: 'Pregunta',
    flash_back_label: 'Idea clave',
    flash_flip: 'Girar tarjeta',
    flash_prev: '← Anterior',
    flash_next: 'Siguiente →',
    flash_counter: 'Tarjeta {current} de {total}',
    flash_restart: 'Empezar de nuevo',

    video_checkpoints_heading: 'Preguntas en este video',
    video_no_id_title: '🎬 Video próximamente',
    video_no_id_body: 'Esta lección todavía no tiene un video enlazado. Abajo hay una vista previa de las preguntas que aparecerán durante la reproducción.',
    video_preview_btn: 'Ver una vista previa de las preguntas',
    video_checkpoint_label: 'Pausa en {time}',
    video_resume: 'Continuar el video',
    video_setup_note: 'Educadores: agreguen un ID real de video de YouTube y ajusten los tiempos de pausa en js/data.js — vean el README.',

    parents_title: 'Para Padres y Educadores',
    parents_lead: 'Información sobre esta biblioteca, cómo usarla junto a un estudiante, y recursos para profundizar.',
    parents_about_heading: 'Sobre esta biblioteca',
    parents_about_body: 'Biblioteca de Seguridad es una colección gratuita, basada en el navegador, de lecciones de seguridad para la vida independiente, pensada para personas autistas y para cualquiera que se beneficie de una práctica clara y predecible. No requiere iniciar sesión ni instalar nada — cada lección combina una historia ilustrada breve con un punto de decisión, un repaso con tarjetas y un video con pausas de comprensión integradas.',
    parents_how_heading: 'Cómo usarla con un estudiante',
    parents_how_body: 'Acompañe al estudiante la primera vez que recorra un tema, para poder pausar en cualquier paso y explicarlo con sus propias palabras. Las historias son intencionalmente breves y de baja estimulación — sin temporizadores, sin efectos parpadeantes, y cada respuesta incorrecta recibe una explicación tranquila en lugar de un estado de "fallo". Las tarjetas funcionan bien como calentamiento independiente o repaso después de completar una historia por primera vez.',
    parents_resources_heading: 'Recursos y lecturas adicionales',
    parents_curriculum_heading: 'Currículo tentativo y actividades de enseñanza',
    parents_curriculum_lead: 'Un punto de partida para combinar cada tema con una actividad fuera de línea. Ajústelo libremente según la edad y las metas del estudiante.',
    parents_feedback_heading: '¿Tiene comentarios?',
    parents_feedback_body: 'Esta biblioteca está en crecimiento activo. Si usted es especialista en educación especial, terapeuta o padre/madre con sugerencias sobre nuevos temas, cambios de redacción, o cosas que no funcionaron para su estudiante, nos gustaría saberlo.',
    parents_feedback_note: 'Todavía no hay un formulario de comentarios conectado — por ahora, use los datos de contacto que le compartió su organización, o consulte el README para saber cómo agregar uno.',

    footer_note: 'Biblioteca de Seguridad — un recurso gratuito. Sin cuentas, sin rastreo más allá de lo que hace su navegador por defecto.',

    parents_analytics_heading: 'Información de uso (solo este dispositivo)',
    parents_analytics_body: 'Un panel privado que muestra qué lecciones se han abierto y completado en este navegador o dispositivo específico. Solo lee el almacenamiento local de este dispositivo — no se sube ni se comparte nada, y no mostrará la actividad del dispositivo de un estudiante a menos que lo revise en ese mismo dispositivo.',
    parents_analytics_link: 'Abrir información de uso →',

    analytics_title: 'Información de uso',
    analytics_lead: 'Una vista privada de la actividad de las lecciones registrada en este dispositivo. Nada de esto se sube a ningún lado — solo refleja lo que ha pasado en este navegador.',
    analytics_note: 'Esta página no está enlazada desde la navegación principal. Los datos se guardan solo en el almacenamiento local de este navegador; borrar los datos de su navegador los eliminará, y nunca se sincronizan entre dispositivos.',
    analytics_stat_total_opens: 'Temas abiertos',
    analytics_stat_total_completes: 'Niveles completados',
    analytics_stat_topics_active: 'Temas visitados',
    analytics_stat_last_activity: 'Última actividad',
    analytics_col_topic: 'Tema',
    analytics_col_opens: 'Aberturas',
    analytics_col_starts: 'Niveles iniciados',
    analytics_col_completes: 'Niveles completados',
    analytics_col_flashcards: 'Tarjetas abiertas',
    analytics_col_video: 'Video abierto',
    analytics_col_last: 'Última visita',
    analytics_empty: 'Todavía no hay actividad registrada en este dispositivo. Cuando se abra una lección, aparecerá aquí.',
    analytics_clear_btn: 'Borrar todos los datos de uso',
    analytics_clear_confirm: 'Esto borrará permanentemente todos los datos de uso registrados en este dispositivo. ¿Continuar?',
    analytics_never: 'Nunca',
  },
};

function getLang(){
  const saved = localStorage.getItem('safetylib_lang');
  if (saved && UI_STRINGS[saved]) return saved;
  const browser = (navigator.language || 'en').slice(0,2);
  return UI_STRINGS[browser] ? browser : 'en';
}

function setLang(code){
  if (!UI_STRINGS[code]) return;
  localStorage.setItem('safetylib_lang', code);
}

function t(key, vars){
  const lang = getLang();
  let str = (UI_STRINGS[lang] && UI_STRINGS[lang][key]) || (UI_STRINGS.en[key]) || key;
  if (vars){
    Object.keys(vars).forEach(k => { str = str.replace(`{${k}}`, vars[k]); });
  }
  return str;
}

function applyStaticI18n(root = document){
  root.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  root.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
  const htmlLang = document.documentElement;
  if (htmlLang) htmlLang.setAttribute('lang', getLang());
}

function initLangSwitcher(){
  const select = document.querySelector('[data-lang-select]');
  if (!select) return;
  select.innerHTML = LANGUAGES.map(l => `<option value="${l.code}">${l.label}</option>`).join('');
  select.value = getLang();
  select.addEventListener('change', () => {
    setLang(select.value);
    window.dispatchEvent(new CustomEvent('safetylib:langchange'));
    applyStaticI18n();
    if (typeof window.onLangChange === 'function') window.onLangChange();
  });
}
