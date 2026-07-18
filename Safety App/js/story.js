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
};

function getIllustration(key){
  const pic = ILLUSTRATIONS[key];
  if (!pic) return '';
  return `<img src="${pic.file}" alt="${pic.alt}" loading="lazy">`;
}
