/* ==========================================================================
   Safety Superheroes — Say It Like a Hero word library (say-it.html)
   Safety words to learn to say out loud. Each word has:
     w      the word
     syl    its syllables (the stressed one is listed in `stress`, 0-based)
     sounds an easy "sounds like" guide (English only; Spanish is read as
            written, so the syllables are the guide)
     mean   what it means, in kid words
     ex     an example sentence
     cat    group on the shelf (see SAY_IT_CATEGORIES)
     lvl    0 = Pre-K–K, 1 = 1st–3rd, 2 = 4th+
     topic  the lesson / Hero Story where it comes up
   ========================================================================== */

const SAY_IT_CATEGORIES = [
  { id: 'helpers', emoji: '🦸' },
  { id: 'emergency', emoji: '🚨' },
  { id: 'body', emoji: '✋' },
  { id: 'feelings', emoji: '💛' },
  { id: 'outside', emoji: '🚦' },
  { id: 'online', emoji: '💻' },
];

const SAFETY_WORDS = {
  en: [
    { w: 'safe', syl: ['safe'], stress: 0, sounds: 'SAYF', mean: 'Not in danger. Okay and protected.', ex: 'I feel safe with my family.', cat: 'helpers', lvl: 0, topic: 'stranger-safety' },
    { w: 'help', syl: ['help'], stress: 0, sounds: 'HELP', mean: 'What you ask for when you need someone.', ex: 'I can say, “Help, please!”', cat: 'helpers', lvl: 0, topic: 'emergency-safety' },
    { w: 'stranger', syl: ['stran', 'ger'], stress: 0, sounds: 'STRAYN-jer', mean: 'Someone you don’t know.', ex: 'I don’t go anywhere with a stranger.', cat: 'helpers', lvl: 0, topic: 'stranger-safety' },
    { w: 'grown-up', syl: ['grown', 'up'], stress: 0, sounds: 'GROHN-up', mean: 'An adult, like a parent or teacher.', ex: 'I tell a grown-up I trust.', cat: 'helpers', lvl: 0, topic: 'safehelper-safety' },
    { w: 'trusted', syl: ['trust', 'ed'], stress: 0, sounds: 'TRUST-id', mean: 'Someone you know will keep you safe.', ex: 'My teacher is a trusted grown-up.', cat: 'helpers', lvl: 0, topic: 'safehelper-safety' },
    { w: 'teacher', syl: ['teach', 'er'], stress: 0, sounds: 'TEE-cher', mean: 'A grown-up who helps you learn at school.', ex: 'I can ask my teacher for help.', cat: 'helpers', lvl: 0, topic: 'reporting-safety' },
    { w: 'police officer', syl: ['po', 'lice', 'of', 'fi', 'cer'], stress: 1, sounds: 'puh-LEES AW-fih-ser', mean: 'A helper whose job is to keep people safe.', ex: 'A police officer can help me if I am lost.', cat: 'helpers', lvl: 1, topic: 'lost-safety' },
    { w: 'lifeguard', syl: ['life', 'guard'], stress: 0, sounds: 'LYFE-gard', mean: 'A helper who keeps people safe in the water.', ex: 'I swim where the lifeguard can see me.', cat: 'helpers', lvl: 1, topic: 'water-safety' },
    { w: 'emergency', syl: ['e', 'mer', 'gen', 'cy'], stress: 1, sounds: 'ih-MUR-jun-see', mean: 'A big problem that needs help right away.', ex: 'In an emergency, I call 9-1-1.', cat: 'emergency', lvl: 1, topic: 'emergency-safety' },
    { w: 'nine one one', syl: ['nine', 'one', 'one'], stress: 0, sounds: 'NYNE WUN WUN', mean: 'The number to call for help in an emergency.', ex: 'I only call nine one one for a real emergency.', cat: 'emergency', lvl: 0, topic: 'emergency-safety' },
    { w: 'ambulance', syl: ['am', 'bu', 'lance'], stress: 0, sounds: 'AM-byoo-lunss', mean: 'A truck that takes hurt or sick people to the hospital.', ex: 'The ambulance has a loud siren.', cat: 'emergency', lvl: 1, topic: 'medical-safety' },
    { w: 'fire', syl: ['fire'], stress: 0, sounds: 'FY-er', mean: 'Hot flames that can burn.', ex: 'If there is a fire, I get out fast.', cat: 'emergency', lvl: 0, topic: 'fire-safety' },
    { w: 'firefighter', syl: ['fire', 'fight', 'er'], stress: 0, sounds: 'FY-er-fy-ter', mean: 'A helper who puts out fires.', ex: 'A firefighter may wear a big mask.', cat: 'emergency', lvl: 0, topic: 'fire-safety' },
    { w: 'smoke alarm', syl: ['smoke', 'a', 'larm'], stress: 2, sounds: 'SMOHK uh-LARM', mean: 'A beeper that goes off when there is smoke.', ex: 'When the smoke alarm beeps, I go outside.', cat: 'emergency', lvl: 1, topic: 'fire-safety' },
    { w: 'evacuate', syl: ['e', 'vac', 'u', 'ate'], stress: 1, sounds: 'ih-VAK-yoo-ayt', mean: 'To leave a place fast to stay safe.', ex: 'We evacuate the building during a fire drill.', cat: 'emergency', lvl: 2, topic: 'fire-safety' },
    { w: 'earthquake', syl: ['earth', 'quake'], stress: 0, sounds: 'URTH-kwayk', mean: 'When the ground shakes.', ex: 'In an earthquake, I drop, cover, and hold on.', cat: 'emergency', lvl: 1, topic: 'earthquake-safety' },
    { w: 'seizure', syl: ['sei', 'zure'], stress: 0, sounds: 'SEE-zher', mean: 'When the brain sends mixed-up signals and the body may shake.', ex: 'If a friend has a seizure, I get a grown-up.', cat: 'emergency', lvl: 2, topic: 'seizure-safety' },
    { w: 'no', syl: ['no'], stress: 0, sounds: 'NOH', mean: 'A strong word you can always use to stop something.', ex: 'I can say no in a big voice.', cat: 'body', lvl: 0, topic: 'body-boundaries-safety' },
    { w: 'stop', syl: ['stop'], stress: 0, sounds: 'STOP', mean: 'A word that means “don’t keep going.”', ex: 'Stop! I don’t like that.', cat: 'body', lvl: 0, topic: 'body-boundaries-safety' },
    { w: 'private', syl: ['pri', 'vate'], stress: 0, sounds: 'PRY-vit', mean: 'Just for you, not for everyone.', ex: 'The parts under my swimsuit are private.', cat: 'body', lvl: 1, topic: 'body-boundaries-safety' },
    { w: 'boundary', syl: ['bound', 'a', 'ry'], stress: 0, sounds: 'BOWN-dree', mean: 'A rule about what feels okay for your body and space.', ex: 'Asking for space is a boundary.', cat: 'body', lvl: 1, topic: 'body-boundaries-safety' },
    { w: 'secret', syl: ['se', 'cret'], stress: 0, sounds: 'SEE-krit', mean: 'Something someone wants you not to tell.', ex: 'I don’t keep secrets that make me feel bad.', cat: 'body', lvl: 0, topic: 'secrets-safety' },
    { w: 'surprise', syl: ['sur', 'prise'], stress: 1, sounds: 'ser-PRYZ', mean: 'A happy secret that everyone finds out soon.', ex: 'A birthday surprise is okay to keep.', cat: 'body', lvl: 1, topic: 'secrets-safety' },
    { w: 'calm', syl: ['calm'], stress: 0, sounds: 'KAHM', mean: 'Quiet and relaxed inside.', ex: 'I take deep breaths to feel calm.', cat: 'feelings', lvl: 0, topic: 'selfregulation-safety' },
    { w: 'scared', syl: ['scared'], stress: 0, sounds: 'SKAIRD', mean: 'Feeling afraid.', ex: 'When I feel scared, I tell a grown-up.', cat: 'feelings', lvl: 0, topic: 'reporting-safety' },
    { w: 'uncomfortable', syl: ['un', 'com', 'for', 'ta', 'ble'], stress: 1, sounds: 'un-KUMF-ter-bul', mean: 'Feeling not okay, uneasy, or upset.', ex: 'That makes me feel uncomfortable.', cat: 'feelings', lvl: 2, topic: 'body-boundaries-safety' },
    { w: 'break', syl: ['break'], stress: 0, sounds: 'BRAYK', mean: 'A short rest when you feel too much.', ex: 'Can I have a break, please?', cat: 'feelings', lvl: 0, topic: 'selfadvocacy-safety' },
    { w: 'respect', syl: ['re', 'spect'], stress: 1, sounds: 'rih-SPEKT', mean: 'Treating people the way you want to be treated.', ex: 'I show respect when I listen.', cat: 'feelings', lvl: 1, topic: 'citizenship-safety' },
    { w: 'crosswalk', syl: ['cross', 'walk'], stress: 0, sounds: 'KRAWS-wawk', mean: 'The striped part of the road where you cross.', ex: 'I cross at the crosswalk.', cat: 'outside', lvl: 0, topic: 'street-safety' },
    { w: 'helmet', syl: ['hel', 'met'], stress: 0, sounds: 'HEL-mit', mean: 'A hard hat that protects your head.', ex: 'I wear my helmet on my bike.', cat: 'outside', lvl: 0, topic: 'bike-safety' },
    { w: 'seat belt', syl: ['seat', 'belt'], stress: 0, sounds: 'SEET belt', mean: 'The strap that keeps you safe in a car.', ex: 'I click my seat belt every time.', cat: 'outside', lvl: 0, topic: 'street-safety' },
    { w: 'lost', syl: ['lost'], stress: 0, sounds: 'LAWST', mean: 'When you can’t find your grown-up.', ex: 'If I am lost, I stay in one place.', cat: 'outside', lvl: 0, topic: 'lost-safety' },
    { w: 'address', syl: ['ad', 'dress'], stress: 0, sounds: 'AD-dress', mean: 'Where you live: your street and number.', ex: 'I know my address by heart.', cat: 'outside', lvl: 1, topic: 'plan-safety' },
    { w: 'password', syl: ['pass', 'word'], stress: 0, sounds: 'PASS-wurd', mean: 'A secret word that keeps your accounts safe.', ex: 'I only share my password with my parent.', cat: 'online', lvl: 1, topic: 'online-safety' },
    { w: 'privacy', syl: ['pri', 'va', 'cy'], stress: 0, sounds: 'PRY-vuh-see', mean: 'Keeping your information just for you.', ex: 'Privacy means I don’t share my address online.', cat: 'online', lvl: 2, topic: 'privacy-safety' },
    { w: 'online', syl: ['on', 'line'], stress: 0, sounds: 'AWN-lyne', mean: 'On the internet.', ex: 'I am careful when I am online.', cat: 'online', lvl: 1, topic: 'online-safety' },
    { w: 'cyberbullying', syl: ['cy', 'ber', 'bul', 'ly', 'ing'], stress: 0, sounds: 'SY-ber-bul-ee-ing', mean: 'Being mean to someone on phones or the internet.', ex: 'I tell a grown-up about cyberbullying.', cat: 'online', lvl: 2, topic: 'cyberbullying-safety' },
    { w: 'block', syl: ['block'], stress: 0, sounds: 'BLOK', mean: 'To stop someone from messaging you.', ex: 'I can block someone who is mean.', cat: 'online', lvl: 1, topic: 'cyberbullying-safety' },
  ],
  es: [
    { w: 'seguro', syl: ['se', 'gu', 'ro'], stress: 1, mean: 'Sin peligro. Bien y protegido.', ex: 'Me siento seguro con mi familia.', cat: 'helpers', lvl: 0, topic: 'stranger-safety' },
    { w: 'ayuda', syl: ['a', 'yu', 'da'], stress: 1, mean: 'Lo que pides cuando necesitas a alguien.', ex: 'Puedo decir: «¡Ayuda, por favor!»', cat: 'helpers', lvl: 0, topic: 'emergency-safety' },
    { w: 'desconocido', syl: ['des', 'co', 'no', 'ci', 'do'], stress: 3, mean: 'Alguien que no conoces.', ex: 'No voy a ningún lado con un desconocido.', cat: 'helpers', lvl: 1, topic: 'stranger-safety' },
    { w: 'adulto', syl: ['a', 'dul', 'to'], stress: 1, mean: 'Una persona mayor, como un papá o una maestra.', ex: 'Le cuento a un adulto de confianza.', cat: 'helpers', lvl: 0, topic: 'safehelper-safety' },
    { w: 'confianza', syl: ['con', 'fian', 'za'], stress: 1, mean: 'Saber que alguien te va a cuidar.', ex: 'Mi maestra es una adulta de confianza.', cat: 'helpers', lvl: 1, topic: 'safehelper-safety' },
    { w: 'maestra', syl: ['ma', 'es', 'tra'], stress: 1, mean: 'Una persona que te ayuda a aprender en la escuela.', ex: 'Le pido ayuda a mi maestra.', cat: 'helpers', lvl: 0, topic: 'reporting-safety' },
    { w: 'policía', syl: ['po', 'li', 'cí', 'a'], stress: 2, mean: 'Una persona que trabaja para cuidar a la gente.', ex: 'Un policía me puede ayudar si me pierdo.', cat: 'helpers', lvl: 0, topic: 'lost-safety' },
    { w: 'salvavidas', syl: ['sal', 'va', 'vi', 'das'], stress: 2, mean: 'Una persona que cuida a la gente en el agua.', ex: 'Nado donde el salvavidas me puede ver.', cat: 'helpers', lvl: 1, topic: 'water-safety' },
    { w: 'emergencia', syl: ['e', 'mer', 'gen', 'cia'], stress: 2, mean: 'Un problema grande que necesita ayuda ya.', ex: 'En una emergencia, llamo al 9-1-1.', cat: 'emergency', lvl: 1, topic: 'emergency-safety' },
    { w: 'nueve uno uno', syl: ['nue', 've', 'u', 'no', 'u', 'no'], stress: 0, mean: 'El número para pedir ayuda en una emergencia.', ex: 'Solo llamo al nueve uno uno en una emergencia de verdad.', cat: 'emergency', lvl: 0, topic: 'emergency-safety' },
    { w: 'ambulancia', syl: ['am', 'bu', 'lan', 'cia'], stress: 2, mean: 'Un carro que lleva al hospital a personas heridas o enfermas.', ex: 'La ambulancia tiene una sirena fuerte.', cat: 'emergency', lvl: 1, topic: 'medical-safety' },
    { w: 'fuego', syl: ['fue', 'go'], stress: 0, mean: 'Llamas calientes que pueden quemar.', ex: 'Si hay fuego, salgo rápido.', cat: 'emergency', lvl: 0, topic: 'fire-safety' },
    { w: 'bombero', syl: ['bom', 'be', 'ro'], stress: 1, mean: 'Una persona que apaga incendios.', ex: 'El bombero puede usar una máscara grande.', cat: 'emergency', lvl: 0, topic: 'fire-safety' },
    { w: 'alarma de humo', syl: ['a', 'lar', 'ma', 'de', 'hu', 'mo'], stress: 1, mean: 'Un aparato que suena cuando hay humo.', ex: 'Cuando suena la alarma de humo, salgo afuera.', cat: 'emergency', lvl: 1, topic: 'fire-safety' },
    { w: 'evacuar', syl: ['e', 'va', 'cuar'], stress: 2, mean: 'Salir rápido de un lugar para estar a salvo.', ex: 'Evacuamos la escuela en el simulacro.', cat: 'emergency', lvl: 2, topic: 'fire-safety' },
    { w: 'terremoto', syl: ['te', 'rre', 'mo', 'to'], stress: 2, mean: 'Cuando la tierra tiembla.', ex: 'En un terremoto, me agacho, me cubro y me agarro.', cat: 'emergency', lvl: 1, topic: 'earthquake-safety' },
    { w: 'convulsión', syl: ['con', 'vul', 'sión'], stress: 2, mean: 'Cuando el cerebro manda señales mezcladas y el cuerpo puede temblar.', ex: 'Si un amigo tiene una convulsión, busco a un adulto.', cat: 'emergency', lvl: 2, topic: 'seizure-safety' },
    { w: 'no', syl: ['no'], stress: 0, mean: 'Una palabra fuerte que siempre puedes usar para parar algo.', ex: 'Puedo decir que no con voz fuerte.', cat: 'body', lvl: 0, topic: 'body-boundaries-safety' },
    { w: 'alto', syl: ['al', 'to'], stress: 0, mean: 'Una palabra que quiere decir «no sigas».', ex: '¡Alto! No me gusta eso.', cat: 'body', lvl: 0, topic: 'body-boundaries-safety' },
    { w: 'privado', syl: ['pri', 'va', 'do'], stress: 1, mean: 'Solo para ti, no para todos.', ex: 'Las partes debajo de mi traje de baño son privadas.', cat: 'body', lvl: 1, topic: 'body-boundaries-safety' },
    { w: 'límite', syl: ['lí', 'mi', 'te'], stress: 0, mean: 'Una regla sobre lo que se siente bien para tu cuerpo y tu espacio.', ex: 'Pedir espacio es un límite.', cat: 'body', lvl: 1, topic: 'body-boundaries-safety' },
    { w: 'secreto', syl: ['se', 'cre', 'to'], stress: 1, mean: 'Algo que alguien quiere que no cuentes.', ex: 'No guardo secretos que me hacen sentir mal.', cat: 'body', lvl: 0, topic: 'secrets-safety' },
    { w: 'sorpresa', syl: ['sor', 'pre', 'sa'], stress: 1, mean: 'Un secreto feliz que todos sabrán pronto.', ex: 'Una sorpresa de cumpleaños se puede guardar.', cat: 'body', lvl: 1, topic: 'secrets-safety' },
    { w: 'calma', syl: ['cal', 'ma'], stress: 0, mean: 'Sentirse tranquilo por dentro.', ex: 'Respiro profundo para sentir calma.', cat: 'feelings', lvl: 0, topic: 'selfregulation-safety' },
    { w: 'miedo', syl: ['mie', 'do'], stress: 0, mean: 'Sentirse asustado.', ex: 'Cuando tengo miedo, se lo digo a un adulto.', cat: 'feelings', lvl: 0, topic: 'reporting-safety' },
    { w: 'incómodo', syl: ['in', 'có', 'mo', 'do'], stress: 1, mean: 'Sentirse mal, inquieto o molesto.', ex: 'Eso me hace sentir incómodo.', cat: 'feelings', lvl: 1, topic: 'body-boundaries-safety' },
    { w: 'descanso', syl: ['des', 'can', 'so'], stress: 1, mean: 'Un ratito para relajarte cuando sientes demasiado.', ex: '¿Me puedo tomar un descanso, por favor?', cat: 'feelings', lvl: 0, topic: 'selfadvocacy-safety' },
    { w: 'respeto', syl: ['res', 'pe', 'to'], stress: 1, mean: 'Tratar a los demás como quieres que te traten.', ex: 'Muestro respeto cuando escucho.', cat: 'feelings', lvl: 1, topic: 'citizenship-safety' },
    { w: 'cruce peatonal', syl: ['cru', 'ce', 'pe', 'a', 'to', 'nal'], stress: 5, mean: 'La parte de la calle con rayas por donde se cruza.', ex: 'Cruzo por el cruce peatonal.', cat: 'outside', lvl: 1, topic: 'street-safety' },
    { w: 'casco', syl: ['cas', 'co'], stress: 0, mean: 'Un gorro duro que protege tu cabeza.', ex: 'Me pongo el casco para andar en bici.', cat: 'outside', lvl: 0, topic: 'bike-safety' },
    { w: 'cinturón', syl: ['cin', 'tu', 'rón'], stress: 2, mean: 'La correa que te protege en el carro.', ex: 'Me abrocho el cinturón siempre.', cat: 'outside', lvl: 0, topic: 'street-safety' },
    { w: 'perdido', syl: ['per', 'di', 'do'], stress: 1, mean: 'Cuando no encuentras a tu adulto.', ex: 'Si estoy perdido, me quedo en un lugar.', cat: 'outside', lvl: 0, topic: 'lost-safety' },
    { w: 'dirección', syl: ['di', 'rec', 'ción'], stress: 2, mean: 'Donde vives: tu calle y tu número.', ex: 'Me sé mi dirección de memoria.', cat: 'outside', lvl: 1, topic: 'plan-safety' },
    { w: 'contraseña', syl: ['con', 'tra', 'se', 'ña'], stress: 2, mean: 'Una palabra secreta que protege tus cuentas.', ex: 'Solo comparto mi contraseña con mi papá o mi mamá.', cat: 'online', lvl: 1, topic: 'online-safety' },
    { w: 'privacidad', syl: ['pri', 'va', 'ci', 'dad'], stress: 3, mean: 'Guardar tu información solo para ti.', ex: 'Privacidad es no compartir mi dirección en internet.', cat: 'online', lvl: 2, topic: 'privacy-safety' },
    { w: 'internet', syl: ['in', 'ter', 'net'], stress: 2, mean: 'La red de computadoras y teléfonos.', ex: 'Tengo cuidado cuando uso internet.', cat: 'online', lvl: 1, topic: 'online-safety' },
    { w: 'ciberacoso', syl: ['ci', 'be', 'ra', 'co', 'so'], stress: 3, mean: 'Ser malo con alguien por el teléfono o internet.', ex: 'Le cuento a un adulto sobre el ciberacoso.', cat: 'online', lvl: 2, topic: 'cyberbullying-safety' },
    { w: 'bloquear', syl: ['blo', 'que', 'ar'], stress: 2, mean: 'Hacer que alguien ya no te pueda escribir.', ex: 'Puedo bloquear a alguien que es malo.', cat: 'online', lvl: 1, topic: 'cyberbullying-safety' },
  ],
};
