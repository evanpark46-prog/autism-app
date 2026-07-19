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

  /* Placeholder art reused from the set above — swap these for topic-specific
     illustrations whenever you get the chance (see img/ATTRIBUTION.txt). */
  'emergency-call': { file: 'img/hello-amico.svg', alt: 'Illustration of someone reaching out for help.' },
  'emergency-help': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'fire-alert': { file: 'img/hello-amico.svg', alt: 'Illustration of someone noticing something is wrong.' },
  'fire-safe': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'earthquake-shake': { file: 'img/hello-amico.svg', alt: 'Illustration of someone reacting to a sudden event.' },
  'earthquake-safe': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'storm-outside': { file: 'img/hello-amico.svg', alt: 'Illustration of someone outside.' },
  'storm-safe': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'advocacy-uncomfortable': { file: 'img/hello-amico.svg', alt: 'Illustration of someone expressing how they feel.' },
  'advocacy-help': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },

  'boundaries-uncomfortable': { file: 'img/hello-amico.svg', alt: 'Illustration of someone in a social moment.' },
  'boundaries-safe': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'secret-worried': { file: 'img/hello-amico.svg', alt: 'Illustration of someone sharing something quietly.' },
  'secret-safe': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'report-unsure': { file: 'img/hello-amico.svg', alt: 'Illustration of someone unsure what to do.' },
  'report-help': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'awareness-scan': { file: 'img/hello-amico.svg', alt: 'Illustration of someone out and about.' },
  'awareness-safe': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'plan-before': { file: 'img/hello-amico.svg', alt: 'Illustration of someone about to head out.' },
  'plan-safe': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'privacy-uncomfortable': { file: 'img/hello-amico.svg', alt: 'Illustration of someone wanting privacy.' },
  'privacy-safe': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'bully-uncomfortable': { file: 'img/hello-amico.svg', alt: 'Illustration of someone feeling upset.' },
  'bully-help': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'online-screen': { file: 'img/hello-amico.svg', alt: 'Illustration of someone using a device.' },
  'online-safe': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'cyberbully-uncomfortable': { file: 'img/hello-amico.svg', alt: 'Illustration of someone feeling upset by a message.' },
  'cyberbully-help': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'citizenship-bystander': { file: 'img/hello-amico.svg', alt: 'Illustration of someone noticing a situation.' },
  'citizenship-help': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'rights-voice': { file: 'img/hello-amico.svg', alt: 'Illustration of someone speaking up.' },
  'rights-safe': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'water-play': { file: 'img/hello-amico.svg', alt: 'Illustration of someone near water.' },
  'water-safe': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'home-alone': { file: 'img/hello-amico.svg', alt: 'Illustration of someone at home.' },
  'home-safe': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
  'bike-ride': { file: 'img/pedestrian-crossing-amico.svg', alt: 'Illustration of someone near traffic.' },
  'bike-safe': { file: 'img/pedestrian-crossing-amico.svg', alt: 'Illustration of people at a pedestrian crossing.' },
  'peer-pressure-moment': { file: 'img/hello-amico.svg', alt: 'Illustration of a group social moment.' },
  'peer-pressure-safe': { file: 'img/volunteering-amico.svg', alt: 'Illustration of people helping each other.' },
};

function getIllustration(key){
  const pic = ILLUSTRATIONS[key];
  if (!pic) return '';
  return `<img src="${pic.file}" alt="${pic.alt}" loading="lazy">`;
}
