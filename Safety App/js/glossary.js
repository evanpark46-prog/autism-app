/* ==========================================================================
   Safety Superheroes — glossary (hover/focus word definitions)
   A curated set of the more abstract vocabulary words used across the
   lessons -- not every word, just the ones a learner is less likely to
   already know (skips simple words like "help" or "car"). Matching words
   in story/flashcard text get a dotted underline; hovering or focusing
   one (keyboard-reachable, not mouse-only) shows a short, plain-language
   definition via a CSS tooltip -- see .glossary-term in styles.css.
   ========================================================================== */

// Plural/variant forms are listed explicitly (not derived by stripping a
// trailing "s") -- that blind stripping used to match verb forms like
// "trusts" against the noun "trust" and show a mismatched definition.
const GLOSSARY = {
  en: {
    stranger: 'Someone you don’t know well.',
    strangers: 'Someone you don’t know well.',
    'grown-up': 'An adult who helps keep you safe, like a parent or teacher.',
    'grown-ups': 'An adult who helps keep you safe, like a parent or teacher.',
    grownup: 'An adult who helps keep you safe, like a parent or teacher.',
    secret: 'Something you don’t tell other people.',
    secrets: 'Something you don’t tell other people.',
    privacy: 'Keeping some things about yourself just for you, or for people you choose.',
    private: 'Just for you, or for people you choose to share with.',
    boundary: 'A rule about what feels okay or not okay for your body and space.',
    boundaries: 'A rule about what feels okay or not okay for your body and space.',
    emergency: 'A sudden problem that needs help right away.',
    emergencies: 'A sudden problem that needs help right away.',
    consequence: 'What happens because of something you did.',
    consequences: 'What happens because of something you did.',
    respect: 'Treating someone the way you’d like to be treated.',
    bystander: 'Someone who sees something happen but isn’t part of it.',
    bystanders: 'Someone who sees something happen but isn’t part of it.',
    citizenship: 'Being a helpful, caring part of a group or community.',
    rights: 'Things everyone deserves, like being safe and treated fairly.',
    lifeguard: 'A person whose job is to keep people safe at the pool or beach.',
    lifeguards: 'A person whose job is to keep people safe at the pool or beach.',
    evacuate: 'To leave a place quickly to stay safe.',
  },
  es: {
    extraño: 'Alguien que no conoces bien.',
    extraños: 'Alguien que no conoces bien.',
    desconocido: 'Alguien que no conoces bien.',
    desconocida: 'Alguien que no conoces bien.',
    adulto: 'Una persona mayor que ayuda a mantenerte seguro, como un padre o un maestro.',
    secreto: 'Algo que no le cuentas a otras personas.',
    secretos: 'Algo que no le cuentas a otras personas.',
    privacidad: 'Guardar algunas cosas sobre ti solo para ti, o para las personas que tú eliges.',
    privado: 'Solo para ti, o para las personas con quienes tú eliges compartir.',
    límite: 'Una regla sobre lo que se siente bien o mal para tu cuerpo y tu espacio.',
    límites: 'Una regla sobre lo que se siente bien o mal para tu cuerpo y tu espacio.',
    emergencia: 'Un problema repentino que necesita ayuda de inmediato.',
    consecuencia: 'Lo que pasa por algo que hiciste.',
    consecuencias: 'Lo que pasa por algo que hiciste.',
    respeto: 'Tratar a alguien como te gustaría que te trataran a ti.',
    espectador: 'Alguien que ve que algo pasa pero no es parte de eso.',
    ciudadanía: 'Ser una parte útil y solidaria de un grupo o comunidad.',
    derechos: 'Cosas que todos merecen, como estar seguros y ser tratados con justicia.',
    salvavidas: 'Una persona cuyo trabajo es mantener seguras a las personas en la piscina o la playa.',
    evacuar: 'Salir de un lugar rápidamente para estar a salvo.',
  },
};

function getGlossaryDefinition(word, lang){
  const dict = GLOSSARY[lang] || GLOSSARY.en;
  return dict[String(word).toLowerCase()] || null;
}

// Splits text into whitespace-preserving tokens and wraps any glossary
// match in a focusable, hoverable span -- used for the initial static
// render of story/flashcard text (dialogue text gets this once read-aloud
// rebuilds it into per-word spans; see speakWithHighlight in js/speech.js).
function wrapGlossaryHtml(text, lang){
  return String(text).split(/(\s+)/).map(token => {
    if (token === '' || /^\s+$/.test(token)) return token;
    const bare = token.replace(/[“”"‘’.,!?¡¿]/g, '');
    const def = getGlossaryDefinition(bare, lang);
    const escaped = escapeHtml(token);
    if (!def) return escaped;
    return `<span class="glossary-term" tabindex="0" data-definition="${escapeHtml(def)}">${escaped}</span>`;
  }).join('');
}
