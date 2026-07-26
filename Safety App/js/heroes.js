/* ==========================================================================
   Safety Scouts — superhero buddies
   One comic-style hero per topic, tied to that lesson's real safety skill.
   A hero "accompanies" a lesson simply by living in the topic-hero header
   (js/page-topic.js renderHero()), which stays visible across the Video/
   Flashcards/Story tabs already -- no extra wiring needed for that part.
   Completing a topic "unlocks" that hero's superpower (see the story-
   complete screen in page-topic.js, and the badges page).
   ========================================================================== */

// Small library of bold, single-color emblem shapes (24x24 viewBox, paths
// only) reused across heroes -- variety comes from combining an emblem with
// each topic's own theme color, same pattern as the 5 existing topic themes.
const HERO_EMBLEMS = {
  shield: '<path d="M12 2 L20 5.5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5.5 Z" fill="#fff"/>',
  'heart-shield': '<path d="M12 2 L20 5.5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5.5 Z" fill="#fff"/><path d="M12 9.5c.9-1.6 3.4-1.6 3.4.6 0 1.7-1.9 2.9-3.4 4-1.5-1.1-3.4-2.3-3.4-4 0-2.2 2.5-2.2 3.4-.6Z" fill="currentColor"/>',
  radar: '<circle cx="12" cy="12" r="9" fill="none" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="1.6" fill="#fff"/>',
  compass: '<circle cx="12" cy="12" r="9" fill="none" stroke="#fff" stroke-width="2"/><path d="M15.5 8.5 13 13 8.5 15.5 11 11 Z" fill="#fff"/>',
  bolt: '<path d="M13 2 4 14h6l-1.5 8L19 10h-6z" fill="#fff"/>',
  flame: '<path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c1 1 1.5 2.3 1.5 3.5A4.5 4.5 0 0 1 12 22a5.5 5.5 0 0 1-5.5-5.5C6.5 12 9 9 12 2Z" fill="#fff"/>',
  mountain: '<path d="M3 19 9 8l3 5 2-3 7 9Z" fill="#fff"/>',
  storm: '<path d="M6 13a4 4 0 0 1 .3-8 5.5 5.5 0 0 1 10.6 1.6A3.8 3.8 0 0 1 17 14H7Z" fill="#fff"/><path d="M13 15l-3 4h2.4l-1.7 4L16 16h-2.4Z" fill="#fff"/>',
  speech: '<path d="M4 5h16v10H9l-4 4v-4H4Z" fill="#fff"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2" fill="#fff"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#fff" stroke-width="2"/>',
  checklist: '<rect x="5" y="3" width="14" height="18" rx="2" fill="#fff"/><path d="M8.5 12l2 2 4-4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  heart: '<path d="M12 21S4 15.5 4 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.5 12 21 12 21Z" fill="#fff"/>',
  screen: '<rect x="3" y="5" width="18" height="12" rx="2" fill="#fff"/><path d="M9 21h6M12 17v4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
  scroll: '<rect x="5" y="4" width="14" height="16" rx="2" fill="#fff"/><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  drop: '<path d="M12 2c4 5.5 7 9.3 7 13a7 7 0 0 1-14 0c0-3.7 3-7.5 7-13Z" fill="#fff"/>',
  house: '<path d="M12 3 3 10v11h6v-6h6v6h6V10Z" fill="#fff"/>',
  wheel: '<circle cx="12" cy="12" r="9" fill="none" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="#fff"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6" stroke="#fff" stroke-width="1.6"/>',
  star: '<path d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7Z" fill="#fff"/>',
};

const HEROES = {
  'stranger-safety':        { emblem: 'shield',       en: { name: 'Captain Caution',   power: 'Stranger Sense',    tagline: 'Knows when to keep a safe distance.' }, es: { name: 'Capitán Cautela',     power: 'Sentido de Alerta',     tagline: 'Sabe cuándo mantener una distancia segura.' } },
  'street-safety':          { emblem: 'radar',        en: { name: 'Crosswalk Guardian', power: 'Look-Both-Ways Vision', tagline: 'Never crosses without checking twice.' }, es: { name: 'Guardián del Cruce',  power: 'Visión de Ambos Lados', tagline: 'Nunca cruza sin mirar dos veces.' } },
  'lost-safety':             { emblem: 'compass',      en: { name: 'Wayfinder',         power: 'Steady Ground',      tagline: 'Stays put and finds a helper when lost.' }, es: { name: 'Guía Segura',        power: 'Terreno Firme',         tagline: 'Se queda quieta y busca ayuda si se pierde.' } },
  'emergency-safety':        { emblem: 'bolt',         en: { name: 'Rescue Ray',        power: 'Emergency Signal',   tagline: 'Calls for help fast when it matters most.' }, es: { name: 'Rayo de Rescate',    power: 'Señal de Emergencia',   tagline: 'Pide ayuda rápido cuando más importa.' } },
  'fire-safety':             { emblem: 'flame',        en: { name: 'Blaze Guard',       power: 'Flame Shield',       tagline: 'Drops, covers, and gets to safety.' }, es: { name: 'Guardián de las Llamas', power: 'Escudo de Fuego',    tagline: 'Se agacha, se cubre y llega a un lugar seguro.' } },
  'earthquake-safety':       { emblem: 'mountain',     en: { name: 'Tremor Titan',      power: 'Steady Stance',      tagline: 'Drops, covers, and holds on tight.' }, es: { name: 'Titán del Temblor',  power: 'Postura Firme',         tagline: 'Se agacha, se cubre y se sostiene fuerte.' } },
  'rainyweather-safety':     { emblem: 'storm',        en: { name: 'Storm Sentinel',    power: 'Weather Watch',      tagline: 'Always knows when to head indoors.' }, es: { name: 'Centinela de la Tormenta', power: 'Vigía del Clima',  tagline: 'Siempre sabe cuándo entrar a un lugar seguro.' } },
  'selfadvocacy-safety':     { emblem: 'speech',       en: { name: 'Voice Vanguard',    power: 'Bold Voice',         tagline: 'Speaks up clearly for what she needs.' }, es: { name: 'Vanguardia de la Voz', power: 'Voz Valiente',        tagline: 'Habla con claridad sobre lo que necesita.' } },
  'body-boundaries-safety':  { emblem: 'heart-shield', en: { name: 'Boundary Champion', power: 'Personal Shield',    tagline: 'Protects her own space with confidence.' }, es: { name: 'Campeón de los Límites', power: 'Escudo Personal',    tagline: 'Protege su espacio con confianza.' } },
  'secrets-safety':          { emblem: 'lock',         en: { name: 'Truth Teller',      power: 'Secret Sense',       tagline: 'Knows a safe secret from a warning sign.' }, es: { name: 'Portavoz de la Verdad', power: 'Sentido del Secreto', tagline: 'Distingue un secreto seguro de una señal de alerta.' } },
  'reporting-safety':        { emblem: 'speech',       en: { name: 'Report Ranger',     power: 'Clear Signal',       tagline: 'Tells a trusted adult right away.' }, es: { name: 'Guardabosques del Reporte', power: 'Señal Clara',    tagline: 'Le cuenta a un adulto de confianza de inmediato.' } },
  'awareness-safety':        { emblem: 'radar',        en: { name: 'Radar',             power: 'Surroundings Sight', tagline: 'Always aware of what’s happening nearby.' }, es: { name: 'Radar',              power: 'Vista del Entorno',     tagline: 'Siempre atenta a lo que pasa cerca.' } },
  'plan-safety':             { emblem: 'checklist',    en: { name: 'Plan Master',       power: 'Ready Plan',         tagline: 'Always has a safety plan ready to go.' }, es: { name: 'Maestro del Plan',   power: 'Plan Listo',            tagline: 'Siempre tiene un plan de seguridad preparado.' } },
  'privacy-safety':          { emblem: 'scroll',       en: { name: 'Privacy Guardian',  power: 'Info Shield',        tagline: 'Keeps personal information safe.' }, es: { name: 'Guardián de la Privacidad', power: 'Escudo de Datos', tagline: 'Mantiene segura la información personal.' } },
  'bullying-safety':         { emblem: 'heart',        en: { name: 'Kindness Knight',   power: 'Stand Tall',         tagline: 'Stands tall and asks for help when bullied.' }, es: { name: 'Caballero de la Bondad', power: 'Postura Firme',      tagline: 'Se mantiene firme y pide ayuda si la molestan.' } },
  'online-safety':           { emblem: 'screen',       en: { name: 'Cyber Scout',       power: 'Safe Click',         tagline: 'Thinks before clicking or sharing online.' }, es: { name: 'Explorador Cibernético', power: 'Clic Seguro',       tagline: 'Piensa antes de hacer clic o compartir en línea.' } },
  'cyberbullying-safety':    { emblem: 'speech',       en: { name: 'Net Defender',      power: 'Block & Tell',       tagline: 'Blocks unkind messages and tells a grown-up.' }, es: { name: 'Defensor de la Red', power: 'Bloquear y Contar',     tagline: 'Bloquea mensajes crueles y avisa a un adulto.' } },
  'citizenship-safety':      { emblem: 'heart',        en: { name: 'Upstander',         power: 'Helper’s Heart', tagline: 'Steps in and helps when someone needs it.' }, es: { name: 'Defensor Activo',    power: 'Corazón Solidario',     tagline: 'Ayuda cuando alguien lo necesita.' } },
  'rights-safety':           { emblem: 'scroll',       en: { name: 'Rights Ranger',     power: 'Know-My-Rights',     tagline: 'Knows the rights every kid deserves.' }, es: { name: 'Guardabosques de Derechos', power: 'Conoce-Mis-Derechos', tagline: 'Conoce los derechos que todo niño merece.' } },
  'water-safety':            { emblem: 'drop',         en: { name: 'Aqua Sentinel',     power: 'Tide Control',       tagline: 'Always swims with a buddy and a grown-up.' }, es: { name: 'Centinela Acuático', power: 'Control de Marea',      tagline: 'Siempre nada con un compañero y un adulto.' } },
  'home-safety':             { emblem: 'house',        en: { name: 'Home Hero',         power: 'Check-First Sense',  tagline: 'Always checks first before opening the door.' }, es: { name: 'Héroe del Hogar',    power: 'Sentido de Verificar',  tagline: 'Siempre verifica antes de abrir la puerta.' } },
  'bike-safety':             { emblem: 'wheel',        en: { name: 'Pedal Patrol',      power: 'Helmet Force',       tagline: 'Never rides without a helmet on.' }, es: { name: 'Patrulla de Pedales', power: 'Fuerza del Casco',     tagline: 'Nunca anda en bici sin casco.' } },
  'peer-pressure-safety':    { emblem: 'star',         en: { name: 'Willpower',         power: 'Strong No',          tagline: 'Says a strong "no" and means it.' }, es: { name: 'Fuerza de Voluntad', power: 'No Firme',              tagline: 'Dice un "no" firme y lo sostiene.' } },
};

function heroFor(topicId){
  return HEROES[topicId] || null;
}

// Returns just the inner markup (no wrapping <svg>) so callers can drop it
// into any sized container -- same pattern as mascotSvg() in js/boot.js.
function heroEmblemInner(emblemKey){
  return HERO_EMBLEMS[emblemKey] || HERO_EMBLEMS.star;
}

function heroBadgeHtml(topicId, lang, theme, size){
  const hero = heroFor(topicId);
  if (!hero) return '';
  const data = hero[lang] || hero.en;
  const px = size || 64;
  return `<div class="hero-badge" data-theme="${theme}" style="width:${px}px;height:${px}px" title="${escapeHtml(data.name)}">
    <svg viewBox="0 0 24 24" width="62%" height="62%" focusable="false">${heroEmblemInner(hero.emblem)}</svg>
  </div>`;
}
