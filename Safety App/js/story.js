/* ==========================================================================
   Safety Library — story illustrations
   Real illustrations from Storyset (Freepik) — see img/ATTRIBUTION.txt for
   licensing. Each key below maps to a downloaded file in img/.

   TO ADD A NEW ILLUSTRATION:
   Download an SVG into img/, add a key here pointing to it, then reference
   that key from a step's "illustration" field in js/data.js.
   ========================================================================== */

const ILLUSTRATIONS = {
  'park-approach': { file: 'img/hello-amico.svg', alt: 'Illustration of someone waving hello.' },
  'park-safe': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'street-corner': { file: 'img/pedestrian-crossing-amico.svg', alt: 'Illustration of people at a pedestrian crossing.' },
  'street-crossing': { file: 'img/pedestrian-crossing-amico.svg', alt: 'Illustration of people crossing at a pedestrian crossing.' },
  'store-lost': { file: 'img/grocery-shopping-rafiki.svg', alt: 'Illustration of a person grocery shopping.' },
  'store-helper': { file: 'img/supermarket-workers-rafiki.svg', alt: 'Illustration of supermarket workers helping a customer.' },

  /* Topic-specific illustrations sourced from Storyset (see img/ATTRIBUTION.txt). */
  'emergency-call': { file: 'img/emergency-call-amico.svg', alt: 'Illustration of someone on the phone calling for emergency help.' },
  'emergency-help': { file: 'img/ambulance-pana.svg', alt: 'Illustration of an ambulance responding to help.' },
  'fire-alert': { file: 'img/warning-amico.svg', alt: 'Illustration of a warning alert going off.' },
  'fire-safe': { file: 'img/fire-prevention-amico.svg', alt: 'Illustration of someone learning fire prevention and safety steps.' },
  'earthquake-shake': { file: 'img/warning-rafiki.svg', alt: 'Illustration of someone reacting to a sudden warning alert.' },
  'earthquake-safe': { file: 'img/family-amico.svg', alt: 'Illustration of a family staying safe together.' },
  'storm-outside': { file: 'img/storm-amico.svg', alt: 'Illustration of a storm with wind and rain outside.' },
  'storm-safe': { file: 'img/umbrella-pana.svg', alt: 'Illustration of someone sheltered safely from the rain.' },
  'advocacy-uncomfortable': { file: 'img/self-confidence-rafiki.svg', alt: 'Illustration of someone building the confidence to speak up.' },
  'advocacy-help': { file: 'img/self-confidence-amico.svg', alt: 'Illustration of someone speaking up with confidence.' },

  'boundaries-uncomfortable': { file: 'img/consent-amico.svg', alt: 'Illustration of someone being asked before a hug or touch.' },
  'boundaries-safe': { file: 'img/consent-pana.svg', alt: 'Illustration of two people respecting a personal boundary.' },
  'secret-worried': { file: 'img/top-secret-amico.svg', alt: 'Illustration of someone holding onto a secret.' },
  'secret-safe': { file: 'img/conversation-cuate.svg', alt: 'Illustration of someone talking openly with a trusted adult.' },
  'report-unsure': { file: 'img/thinking-face-amico.svg', alt: 'Illustration of someone thinking about whether to tell an adult.' },
  'report-help': { file: 'img/conversation-bro.svg', alt: 'Illustration of someone talking a problem through with another person.' },
  'awareness-scan': { file: 'img/location-search-amico.svg', alt: 'Illustration of someone looking around and paying attention to their surroundings.' },
  'awareness-safe': { file: 'img/paper-map-amico.svg', alt: 'Illustration of someone checking a map to stay aware of where they are.' },
  'plan-before': { file: 'img/checklist-amico.svg', alt: 'Illustration of someone making a safety checklist before heading out.' },
  'plan-safe': { file: 'img/to-do-list-pana.svg', alt: 'Illustration of someone following through on a safety plan.' },
  'privacy-uncomfortable': { file: 'img/dressing-room-amico.svg', alt: 'Illustration of someone wanting privacy while changing.' },
  'privacy-safe': { file: 'img/dressing-room-pana.svg', alt: 'Illustration of someone having their privacy respected.' },
  'bully-uncomfortable': { file: 'img/bullying-rafiki.svg', alt: 'Illustration of someone being bullied and feeling upset.' },
  'bully-help': { file: 'img/bullying-amico.svg', alt: 'Illustration of someone getting help after being bullied.' },
  'online-screen': { file: 'img/devices-bro.svg', alt: 'Illustration of someone using a phone or computer screen.' },
  'online-safe': { file: 'img/security-on-amico.svg', alt: 'Illustration of someone keeping their online accounts and information secure.' },
  'cyberbully-uncomfortable': { file: 'img/cyber-bullying-rafiki.svg', alt: 'Illustration of someone feeling upset by a mean message online.' },
  'cyberbully-help': { file: 'img/cyber-bullying-amico.svg', alt: 'Illustration of someone getting help after being cyberbullied.' },
  'citizenship-bystander': { file: 'img/community-bro.svg', alt: 'Illustration of a group of people nearby while something happens.' },
  'citizenship-help': { file: 'img/solidarity-amico.svg', alt: 'Illustration of people supporting and helping one another.' },
  'rights-voice': { file: 'img/group-discussion-rafiki.svg', alt: 'Illustration of someone trying to be heard in a group discussion.' },
  'rights-safe': { file: 'img/solidarity-pana.svg', alt: 'Illustration of people making sure everyone gets heard and included.' },
  'water-play': { file: 'img/children-playing-in-the-pool-pana.svg', alt: 'Illustration of children playing in a swimming pool.' },
  'water-safe': { file: 'img/beach-lifeguard-amico.svg', alt: 'Illustration of a lifeguard watching over people at the beach.' },
  'home-alone': { file: 'img/warning-cuate.svg', alt: 'Illustration of someone noticing something unexpected at home and staying alert.' },
  'home-safe': { file: 'img/cooking-pana.svg', alt: 'Illustration of someone being careful in the kitchen at home.' },
  'bike-ride': { file: 'img/road-cycling-amico.svg', alt: 'Illustration of someone getting ready to ride a bicycle.' },
  'bike-safe': { file: 'img/road-cycling-pana.svg', alt: 'Illustration of someone riding a bicycle safely.' },
  'peer-pressure-moment': { file: 'img/group-amico.svg', alt: 'Illustration of a group of friends pressuring someone to join in.' },
  'peer-pressure-safe': { file: 'img/team-spirit-amico.svg', alt: 'Illustration of a group supporting someone’s own safe choice.' },
};

function getIllustration(key){
  const pic = ILLUSTRATIONS[key];
  if (!pic) return '';
  return `<img src="${pic.file}" alt="${pic.alt}" loading="lazy">`;
}
