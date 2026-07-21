/* ==========================================================================
   Safety Library — story illustrations
   Original kid-friendly illustrations generated for this project. Each key
   below maps to an optimized WebP file in img/generated/.

   TO ADD A NEW ILLUSTRATION:
   Add an image to img/generated/, add a key here pointing to it, then reference
   that key from a step's "illustration" field in js/data.js.
   ========================================================================== */

const ILLUSTRATIONS = {
  'park-approach': { file: 'img/generated/park-approach.webp', alt: 'A child keeps a safe distance from an unfamiliar adult in a park.' },
  'park-safe': { file: 'img/generated/park-safe.webp', alt: 'A child asks a uniformed park helper for help.' },
  'street-corner': { file: 'img/generated/street-corner.webp', alt: 'A child waits safely at the corner before crossing the street.' },
  'street-crossing': { file: 'img/generated/street-crossing.webp', alt: 'A child crosses calmly at a marked crosswalk with the walk signal.' },
  'store-lost': { file: 'img/generated/store-lost.webp', alt: 'A child stays calm after becoming separated in a grocery store.' },
  'store-helper': { file: 'img/generated/store-helper.webp', alt: 'A child asks a grocery store cashier for help.' },

  /* Topic-specific original illustrations. */
  'emergency-call': { file: 'img/generated/emergency-safety.webp', alt: 'A child alerts a grown-up after hearing a smoke alarm.' },
  'emergency-help': { file: 'img/generated/emergency-safety.webp', alt: 'A grown-up safely turns off a smoking pan after a child speaks up.' },
  'fire-alert': { file: 'img/generated/fire-safety.webp', alt: 'A class calmly follows its teacher during a fire drill.' },
  'fire-safe': { file: 'img/generated/fire-safety.webp', alt: 'A class gathers at its outdoor meeting spot during a fire drill.' },
  'earthquake-shake': { file: 'img/generated/earthquake-safety.webp', alt: 'Children drop, cover, and hold on under sturdy classroom desks.' },
  'earthquake-safe': { file: 'img/generated/earthquake-safety.webp', alt: 'A child protects their head and neck under a desk during an earthquake drill.' },
  'storm-outside': { file: 'img/generated/rainyweather-safety.webp', alt: 'A child stays safely indoors during a thunderstorm.' },
  'storm-safe': { file: 'img/generated/rainyweather-safety.webp', alt: 'A child dries off and watches a storm safely from indoors.' },
  'advocacy-uncomfortable': { file: 'img/generated/selfadvocacy-safety.webp', alt: 'A child uses headphones and asks a teacher for a sensory break.' },
  'advocacy-help': { file: 'img/generated/selfadvocacy-safety.webp', alt: 'A teacher listens as a child calmly asks for a break.' },

  'boundaries-uncomfortable': { file: 'img/generated/body-boundaries-safety.webp', alt: 'A child confidently offers a high-five instead of a hug.' },
  'boundaries-safe': { file: 'img/generated/body-boundaries-safety.webp', alt: 'An adult warmly respects a child’s choice and returns a high-five.' },
  'secret-worried': { file: 'img/generated/secrets-safety.webp', alt: 'Children share a happy birthday surprise with a parent.' },
  'secret-safe': { file: 'img/generated/secrets-safety.webp', alt: 'A family enjoys a temporary birthday surprise together.' },
  'report-unsure': { file: 'img/generated/reporting-safety.webp', alt: 'Two children calmly talk beside the playground swings.' },
  'report-help': { file: 'img/generated/reporting-safety.webp', alt: 'A classmate makes room so another child can take a turn on the swing.' },
  'awareness-scan': { file: 'img/generated/awareness-safety.webp', alt: 'A child puts away a toy and pays attention in a parking lot.' },
  'awareness-safe': { file: 'img/generated/awareness-safety.webp', alt: 'A child looks both ways and holds a grown-up’s hand in a parking lot.' },
  'plan-before': { file: 'img/generated/plan-safety.webp', alt: 'A child checks with a parent before visiting a friend.' },
  'plan-safe': { file: 'img/generated/plan-safety.webp', alt: 'A family shares contact details before a child visits a friend.' },
  'privacy-uncomfortable': { file: 'img/generated/privacy-safety.webp', alt: 'A child knocks and waits outside a closed bedroom door.' },
  'privacy-safe': { file: 'img/generated/privacy-safety.webp', alt: 'Siblings smile after one knocks and waits before entering.' },
  'bully-uncomfortable': { file: 'img/generated/bullying-safety.webp', alt: 'A child calmly tells a trusted teacher about a playground problem.' },
  'bully-help': { file: 'img/generated/bullying-safety.webp', alt: 'A teacher listens closely and supports a child who reports bullying.' },
  'online-screen': { file: 'img/generated/online-safety.webp', alt: 'A child shows an unfamiliar online request to a parent.' },
  'online-safe': { file: 'img/generated/online-safety.webp', alt: 'A parent helps a child choose a safe response to an online request.' },
  'cyberbully-uncomfortable': { file: 'img/generated/cyberbullying-safety.webp', alt: 'A child shows an upsetting online message to an older sibling.' },
  'cyberbully-help': { file: 'img/generated/cyberbullying-safety.webp', alt: 'An older sibling helps a child block and report an unkind message.' },
  'citizenship-bystander': { file: 'img/generated/citizenship-safety.webp', alt: 'A child checks on a classmate who fell at the playground.' },
  'citizenship-help': { file: 'img/generated/citizenship-safety.webp', alt: 'A child calls a nearby playground supervisor to help a classmate.' },
  'rights-voice': { file: 'img/generated/rights-safety.webp', alt: 'A child raises a hand and waits for a turn to speak in a class circle.' },
  'rights-safe': { file: 'img/generated/rights-safety.webp', alt: 'A teacher makes sure every child gets a turn to share.' },
  'water-play': { file: 'img/generated/water-safety.webp', alt: 'A child waits on the pool deck for a grown-up to supervise.' },
  'water-safe': { file: 'img/generated/water-safety.webp', alt: 'A child fastens a life jacket while a grown-up supervises the pool.' },
  'home-alone': { file: 'img/generated/home-safety.webp', alt: 'Two siblings keep the front door closed when an unfamiliar visitor arrives.' },
  'home-safe': { file: 'img/generated/home-safety.webp', alt: 'Two siblings call a parent instead of opening the door.' },
  'bike-ride': { file: 'img/generated/bike-safety.webp', alt: 'A child fastens a bicycle helmet before riding.' },
  'bike-safe': { file: 'img/generated/bike-safety.webp', alt: 'A grown-up checks that a child’s bicycle helmet fits snugly.' },
  'peer-pressure-moment': { file: 'img/generated/peer-pressure-safety.webp', alt: 'A child calmly declines an unsafe playground suggestion.' },
  'peer-pressure-safe': { file: 'img/generated/peer-pressure-safety.webp', alt: 'A child and a supportive friend choose the safe play area.' },
};

function getIllustration(key){
  const pic = ILLUSTRATIONS[key];
  if (!pic) return '';
  return `<img src="${pic.file}" alt="${pic.alt}" loading="lazy">`;
}

/* Dialogue scenes use their own panel for every conversation instead of
   reusing the topic card artwork. Four topics also have a second generated
   panel that shows the immediate, kid-friendly consequence of a wrong answer. */
const DIALOGUE_SCENE_COUNTS = {
  'stranger-safety': 10,
  'street-safety': 6,
  'lost-safety': 6,
  'emergency-safety': 6,
  'fire-safety': 6,
  'earthquake-safety': 6,
  'rainyweather-safety': 6,
  'selfadvocacy-safety': 6,
  'body-boundaries-safety': 6,
  'secrets-safety': 6,
  'reporting-safety': 6,
  'awareness-safety': 6,
  'plan-safety': 6,
  'privacy-safety': 6,
  'bullying-safety': 6,
  'online-safety': 6,
  'cyberbullying-safety': 6,
  'citizenship-safety': 6,
  'rights-safety': 6,
  'water-safety': 6,
  'home-safety': 6,
  'bike-safety': 6,
  'peer-pressure-safety': 6,
};

const DIALOGUE_CONSEQUENCE_ART = new Set([
  'street-safety',
  'lost-safety',
  'emergency-safety',
  'fire-safety',
]);

function dialogueArtworkFile(topicId, sceneNumber, consequence){
  const count = DIALOGUE_SCENE_COUNTS[topicId];
  if (!count || sceneNumber < 1 || sceneNumber > count) return '';
  const kind = consequence && DIALOGUE_CONSEQUENCE_ART.has(topicId)
    ? 'consequence'
    : 'dialogue';
  return `img/generated/dialogue/${topicId}/${kind}-${String(sceneNumber).padStart(2, '0')}.jpg`;
}

function getDialogueIllustration(topicId, sceneNumber, alt){
  const file = dialogueArtworkFile(topicId, sceneNumber, false);
  if (!file) return '';
  return `<img src="${file}" alt="${alt || ''}" loading="eager" data-dialogue-image>`;
}

/* Tappable exploration hotspots for Level 1 scenes — a low-stakes, optional
   bonus layer on top of the core lesson. Each hotspot points at something
   visible in that scene's artwork and reveals a short reinforcing phrase
   (spoken aloud) when tapped. x/y are percentages within the rendered
   image. Pilot: stranger-safety's three Level 1 scenes only. */
const DIALOGUE_HOTSPOTS = {
  'stranger-safety': {
    1: [
      {
        x: 74, y: 46,
        en: { label: 'How she feels', text: 'I’m not sure about this. It’s okay to feel unsure.' },
        es: { label: 'Cómo se siente', text: 'No estoy segura de esto. Está bien sentirse insegura.' },
      },
      {
        x: 24, y: 40,
        en: { label: 'Stranger', text: 'Someone you don’t know is called a stranger.' },
        es: { label: 'Desconocido', text: 'Alguien que no conoces se llama un desconocido.' },
      },
    ],
    2: [
      {
        x: 27, y: 58,
        en: { label: 'Telling a helper', text: 'It’s always okay to tell a helper what happened.' },
        es: { label: 'Contarle a un ayudante', text: 'Siempre está bien contarle a un ayudante lo que pasó.' },
      },
      {
        x: 70, y: 40,
        en: { label: 'Lifeguard', text: 'A lifeguard is a helper you can trust.' },
        es: { label: 'Salvavidas', text: 'Un salvavidas es un ayudante en quien puedes confiar.' },
      },
    ],
    3: [
      {
        x: 28, y: 36,
        en: { label: 'Staying near a helper', text: 'Staying near a helper keeps you safe.' },
        es: { label: 'Quedarte cerca de un ayudante', text: 'Quedarte cerca de un ayudante te mantiene segura.' },
      },
      {
        x: 72, y: 54,
        en: { label: 'Feeling safe', text: 'It’s okay to feel better once you’re safe.' },
        es: { label: 'Sentirse segura', text: 'Está bien sentirse mejor una vez que estás segura.' },
      },
    ],
  },
};

function getDialogueHotspots(topicId, sceneNumber, lang){
  const topicSpots = DIALOGUE_HOTSPOTS[topicId];
  const spots = topicSpots && topicSpots[sceneNumber];
  if (!spots) return [];
  return spots.map(spot => ({
    x: spot.x, y: spot.y,
    label: (spot[lang] || spot.en).label,
    text: (spot[lang] || spot.en).text,
  }));
}
