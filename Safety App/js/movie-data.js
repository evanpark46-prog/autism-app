/* ==========================================================================
   Safety Superheroes — Hero Movies: EPISODES
   One interactive cartoon per lesson. A scene plays, then it pauses on a
   question. A wrong answer plays out what happens next (gently), then the
   lesson's superhero swoops in, rewinds time and leaves a Hero Tip. A right
   answer plays the safe ending and the story moves on.

   Step types (see js/page-movie.js):
     {say, en, es, mood?, look?}        a line (voice + caption + bubble)
     {do:'walk'|'face'|'pose'|'cam'|'wait'|'sfx'|'spark'|'hero'|'gag'|'layer'|'title', ...}
     {par:[steps]}                      run steps at the same time
     {ask:{q, choices:[{en, es, icon, ok, then:[steps], tip:{en,es}}]}}
     {end:true}                         sticker + hero tip + sign-off
   Lines are recorded by tools/voice/movie.py (run tools/build-movie-lines.js first).
   ========================================================================== */

const MOVIE_EPISODES = {
  'stranger-safety': {
    n: 1, set: 'park', theme: 'green', format: 'what-would-you-do',
    title: { en: 'Someone I Don’t Know', es: 'Alguien que no conozco' },
    sticker: { en: 'Stranger Sense', es: 'Sentido de Alerta' },
    heroTip: {
      en: 'If someone you don’t know asks you to go with them, say “No!” and tell a grown-up you trust.',
      es: 'Si alguien que no conoces te pide que vayas con él, di “¡No!” y avisa a un adulto de confianza.' },
    cast: {
      alex: { x: 1250, y: 805, face: 1 },
      nutty: { x: 1420, y: 478, face: 1, scale: 1 },
      goat: { x: -200, y: 795, face: 1 },
      bear: { x: 2500, y: 790, face: -1 },
    },
    cam: { x: 1250, zoom: 1.0 },
    steps: [
      // ---------- cold open: Nutty and the acorn ----------
      { do: 'cam', x: 1440, y: 560, zoom: 1.7, dur: 0 },
      { say: 'nutty', en: 'One acorn for later... and one acorn for... oops!', es: 'Una bellota para después... y una bellota para... ¡uy!' },
      { do: 'gag', name: 'acorn-bonk', a: 'nutty' },
      { say: 'nutty', mood: 'dizzy', en: 'Oof! Nuts!', es: '¡Ay! ¡Qué nueces!' },
      { do: 'title' },
      // ---------- once upon a time ----------
      { do: 'cam', x: 1250, zoom: 1.0, dur: 0 },
      { say: 'narrator', en: 'Once upon a time, in Sunny Meadow Park, there lived a bouncy little bunny named Alex.', es: 'Había una vez, en el Parque Pradera Soleada, una conejita muy saltarina llamada Alex.' },
      { do: 'cam', x: 1270, zoom: 1.4, dur: 1.2 },
      { par: [{ do: 'pose', a: 'alex', hop: 3 }, { do: 'sfx', s: 'boing' }] },
      { say: 'alex', mood: 'grin', en: 'Boing! Boing! I’m the bounciest bunny in the whole wide world!', es: '¡Boing! ¡Boing! ¡Soy la conejita más saltarina del mundo entero!' },
      { do: 'sfx', s: 'quack' },
      { say: 'alex', mood: 'grin', en: 'Hi, ducks!', es: '¡Hola, patitos!' },
      { do: 'hero', mode: 'flyby' },
      { say: 'hero', en: 'Hoo-hoo! I’m Captain Caution! Today, YOU can help Alex make super safe choices.', es: '¡Ju-ju! ¡Soy el Capitán Cautela! Hoy, TÚ puedes ayudar a Alex a tomar decisiones súper seguras.' },
      { say: 'hero', en: 'Watch closely, hero. I’ll be nearby if anyone needs me!', es: 'Mira con atención, héroe. ¡Estaré cerca por si alguien me necesita!' },
      { do: 'hero', mode: 'out' },
      // ---------- someone Alex doesn't know ----------
      { do: 'cam', x: 1000, zoom: 1.05, dur: 1.6 },
      { par: [
        { do: 'walk', a: 'goat', x: 1030, speed: 150 },
        { say: 'narrator', en: 'A grown-up walks over. Alex does not know them.', es: 'Un adulto se acerca. Alex no lo conoce.' },
      ] },
      { do: 'face', a: 'alex', dir: -1 },
      { do: 'cam', x: 1150, zoom: 1.38, dur: 1.2 },
      { say: 'narrator', en: 'Most grown-ups are nice. But this is someone Alex does not know.', es: 'La mayoría de los adultos son amables. Pero esta es una persona que Alex no conoce.' },
      { par: [{ do: 'gag', name: 'tail-puff', a: 'nutty' }, { do: 'spark', a: 'goat', at: 'head' }] },
      { say: 'nutty', mood: 'surprised', en: 'Psst! Alex! You don’t know that grown-up!', es: '¡Psst! ¡Alex! ¡No conoces a ese adulto!' },
      { say: 'goat', mood: 'grin', en: 'Hello there, little bunny!', es: '¡Hola, conejita!' },
      { say: 'alex', look: 'camera', mood: 'surprised', en: 'Um... what should I do?', es: 'Mmm... ¿qué debo hacer?' },
      { ask: {
        q: { en: 'Someone Alex does not know is close by. What should Alex do first?', es: 'Alguien que Alex no conoce está cerca. ¿Qué debería hacer Alex primero?' },
        choices: [
          { icon: '🤗', ok: false, en: 'Hop right up close to say hi.', es: 'Saltar muy cerca para saludar.',
            then: [
              { par: [{ do: 'walk', a: 'alex', x: 1135, speed: 260 }, { say: 'narrator', en: 'Alex hops right up close.', es: 'Alex salta muy, muy cerca.' }] },
              { do: 'pose', a: 'goat', lean: 12 },
              { say: 'narrator', en: 'Now the grown-up is very, very close.', es: 'Ahora el adulto está muy, muy cerca.' },
              { do: 'pose', a: 'alex', mood: 'dizzy', ears: 'droop' },
              { say: 'narrator', en: 'Alex feels mixed up. It is hard to step away.', es: 'Alex se siente confundida. Es difícil alejarse.' },
            ],
            tip: { en: 'Getting close right away is not safe. Stay back first, about two big hops away.', es: 'Acercarse de inmediato no es seguro. Primero mantente alejado, como a dos saltos grandes.' } },
          { icon: '👀', ok: true, en: 'Stay back a little and watch.', es: 'Mantenerse un poco alejada y observar.',
            then: [
              { do: 'walk', a: 'alex', x: 1310, speed: 120, back: true },
              { do: 'pose', a: 'alex', mood: 'thinking', ears: 'up' },
              { say: 'alex', mood: 'thinking', en: 'I’ll stay back and watch.', es: 'Me quedaré lejos y observaré.' },
              { say: 'narrator', en: 'Smart! Staying back gives Alex room to think.', es: '¡Muy bien! Mantenerse alejada le da espacio a Alex para pensar.' },
            ] },
          { icon: '🙈', ok: false, en: 'Run and hide, and don’t tell anyone.', es: 'Correr y esconderse, sin contarle a nadie.',
            then: [
              { do: 'face', a: 'alex', dir: 1 },
              { par: [{ do: 'walk', a: 'alex', x: 1530, speed: 300, y: 720 }, { say: 'narrator', en: 'Alex runs and hides behind the big tree.', es: 'Alex corre y se esconde detrás del árbol grande.' }] },
              { do: 'layer', a: 'alex', layer: 'back' },
              { do: 'cam', x: 2470, zoom: 1.35, dur: 1.6 },
              { do: 'pose', a: 'bear', mood: 'worried' },
              { say: 'bear', mood: 'worried', en: 'Alex? Where did Alex go?', es: '¿Alex? ¿Adónde se fue Alex?' },
              { do: 'cam', x: 1500, zoom: 1.4, dur: 1.6 },
              { do: 'pose', a: 'alex', mood: 'worried', ears: 'droop' },
              { say: 'narrator', en: 'Nobody can find Alex. Everyone is worried, and Alex feels scared and alone.', es: 'Nadie encuentra a Alex. Todos están preocupados, y Alex se siente asustada y sola.' },
            ],
            tip: { en: 'You don’t have to hide! Stay back, and tell a grown-up you trust.', es: '¡No tienes que esconderte! Mantente alejado y cuéntale a un adulto de confianza.' } },
        ] } },
      // ---------- the candy ----------
      { do: 'pose', a: 'goat', hold: 'candy', arm: 'offer' },
      { do: 'spark', a: 'goat', at: 'hand' },
      { say: 'goat', mood: 'grin', en: 'Hi! Want some candy? It’s yummy!', es: '¡Hola! ¿Quieres un dulce? ¡Está riquísimo!' },
      { say: 'nutty', mood: 'grin', en: 'Ooh, candy! I love candy!', es: '¡Uy, dulces! ¡Me encantan los dulces!' },
      { say: 'nutty', mood: 'surprised', en: 'Wait. Nope! We don’t know that grown-up.', es: 'Un momento. ¡No, no! No conocemos a ese adulto.' },
      { say: 'alex', look: 'camera', mood: 'thinking', en: 'Hmm. I do not know this grown-up.', es: 'Mmm. No conozco a este adulto.' },
      { ask: {
        q: { en: 'The grown-up offers Alex candy. What should Alex do?', es: 'El adulto le ofrece un dulce a Alex. ¿Qué debería hacer Alex?' },
        choices: [
          { icon: '🍭', ok: false, en: 'Take the candy.', es: 'Tomar el dulce.',
            then: [
              { do: 'walk', a: 'alex', x: 1150, speed: 160 },
              { do: 'pose', a: 'alex', arm: 'reach' }, { do: 'wait', s: 0.5 },
              { par: [{ do: 'pose', a: 'goat', hold: null, arm: 'down' }, { do: 'pose', a: 'alex', hold: 'candy', arm: 'down' }, { do: 'sfx', s: 'pop' }] },
              { say: 'narrator', en: 'Alex takes the candy.', es: 'Alex toma el dulce.' },
              { do: 'face', a: 'goat', dir: -1 }, { do: 'pose', a: 'goat', arm: 'point' },
              { say: 'goat', mood: 'grin', en: 'Come get more candy by my car!', es: '¡Ven por más dulces a mi carro!' },
              { do: 'cam', x: 850, zoom: 1.15, dur: 1.4 },
              { do: 'pose', a: 'goat', arm: 'down' },
              { par: [{ do: 'walk', a: 'goat', x: 640, speed: 140 }, { do: 'walk', a: 'alex', x: 900, speed: 120, delay: 0.5 }] },
              { do: 'pose', a: 'alex', mood: 'worried', ears: 'droop' },
              { say: 'narrator', en: 'Now Alex is walking away from the park. It feels harder to say no.', es: 'Ahora Alex se aleja del parque. Es más difícil decir que no.' },
            ],
            tip: { en: 'It is not safe to take things from people you do not know. Say, “No, thank you!”', es: 'No es seguro tomar cosas de personas que no conoces. Di: “¡No, gracias!”' } },
          { icon: '✋', ok: true, en: 'Say, “No, thank you!”', es: 'Decir: “¡No, gracias!”',
            then: [
              { do: 'pose', a: 'alex', arm: 'stop', mood: 'grin', ears: 'up' },
              { say: 'alex', mood: 'grin', en: 'No, thank you!', es: '¡No, gracias!' },
              { do: 'pose', a: 'alex', arm: 'down' },
              { say: 'goat', mood: 'smile', en: 'Oh. Okay.', es: 'Ah. Está bien.' },
            ] },
        ] } },
      // ---------- the grown-up keeps talking ----------
      { par: [{ do: 'walk', a: 'goat', x: 1080, speed: 90 }, { say: 'goat', mood: 'grin', en: 'Are you sure? I have lots and lots of candy...', es: '¿Estás segura? Tengo muchísimos dulces...' }] },
      { say: 'narrator', en: 'The grown-up keeps talking.', es: 'El adulto sigue hablando.' },
      { say: 'alex', look: 'camera', mood: 'thinking', en: 'What should I do now?', es: '¿Qué hago ahora?' },
      { ask: {
        q: { en: 'The grown-up keeps talking to Alex. What should Alex do now?', es: 'El adulto sigue hablándole a Alex. ¿Qué debería hacer Alex ahora?' },
        choices: [
          { icon: '💬', ok: false, en: 'Stay and keep talking, all alone.', es: 'Quedarse y seguir hablando, sola.',
            then: [
              { say: 'narrator', en: 'Alex stays and keeps talking.', es: 'Alex se queda y sigue hablando.' },
              { par: [{ do: 'walk', a: 'goat', x: 1180, speed: 70 }, { do: 'pose', a: 'goat', lean: 10 }] },
              { say: 'narrator', en: 'The grown-up steps closer.', es: 'El adulto se acerca más.' },
              { do: 'face', a: 'bear', dir: 1 },
              { do: 'cam', x: 2450, zoom: 1.2, dur: 1.6 },
              { say: 'narrator', en: 'The lifeguard is far away, watching the pool. No grown-up Alex trusts is close by to help.', es: 'El salvavidas está lejos, mirando la piscina. No hay ningún adulto de confianza cerca para ayudar.' },
              { do: 'cam', x: 1170, zoom: 1.38, dur: 1.6 },
              { do: 'pose', a: 'alex', mood: 'worried', ears: 'droop' },
            ],
            tip: { en: 'It is safer to walk away to a grown-up you trust, like a lifeguard, a teacher or your family.', es: 'Es más seguro alejarse e ir con un adulto de confianza, como un salvavidas, un maestro o tu familia.' } },
          { icon: '🚶', ok: true, en: 'Walk to a grown-up Alex trusts.', es: 'Caminar hacia un adulto de confianza.',
            then: [
              { say: 'alex', mood: 'grin', ears: 'up', en: 'I’m going to find Lifeguard Bruno!', es: '¡Voy a buscar al salvavidas Bruno!' },
              { do: 'face', a: 'alex', dir: 1 },
              { par: [
                { do: 'walk', a: 'alex', x: 2380, speed: 210 },
                { do: 'walk', a: 'nutty', x: 2290, y: 815, speed: 230, delay: 0.6 },
                { do: 'cam', follow: 'alex', dur: 6 },
                { seq: [{ do: 'wait', s: 2.2 }, { do: 'sfx', s: 'quack' }, { say: 'alex', mood: 'grin', en: 'Not now, ducks! I’m on a safety mission!', es: '¡Ahora no, patitos! ¡Estoy en una misión de seguridad!' }] },
              ] },
              { do: 'cam', x: 2430, zoom: 1.38, dur: 0.8 },
              { do: 'pose', a: 'alex', arm: 'tell' },
              { say: 'alex', en: 'Lifeguard Bruno! A grown-up I don’t know offered me candy.', es: '¡Salvavidas Bruno! Un adulto que no conozco me ofreció un dulce.' },
              { do: 'pose', a: 'alex', arm: 'down' },
              { say: 'bear', mood: 'grin', en: 'You did the right thing telling me! What did they look like?', es: '¡Hiciste muy bien en contármelo! ¿Cómo era?' },
              { say: 'alex', en: 'They had a green sweater and round glasses.', es: 'Tenía un suéter verde y lentes redondos.' },
              { say: 'bear', mood: 'smile', en: 'Thank you! That helps me a lot. You can stay right here with me.', es: '¡Gracias! Eso me ayuda mucho. Puedes quedarte aquí conmigo.' },
              { do: 'cam', x: 900, zoom: 1.1, dur: 1.6 },
              { do: 'face', a: 'goat', dir: -1 },
              { par: [{ do: 'walk', a: 'goat', x: 420, speed: 150 }, { say: 'narrator', en: 'The grown-up walks back to their car. Alex is safe.', es: 'El adulto vuelve a su carro. Alex está a salvo.' }] },
              { do: 'cam', x: 2360, zoom: 1.22, dur: 1.6 },
            ] },
        ] } },
      // ---------- the hero saves the day ----------
      { do: 'hero', mode: 'land', x: 2120 },
      { say: 'hero', en: 'Hoo-ray! Alex, you saved the day! You’re a real safety superhero!', es: '¡Ju-rra! ¡Alex, salvaste el día! ¡Eres una verdadera súper heroína de la seguridad!' },
      { par: [{ do: 'pose', a: 'alex', hop: 2, arm: 'cheer', mood: 'grin' }, { do: 'sfx', s: 'sparkle' }] },
      { say: 'nutty', mood: 'grin', en: 'Hey, Captain! Why do owls love safety?', es: 'Oye, Capitán, ¿por qué a los búhos les encanta la seguridad?' },
      { say: 'nutty', mood: 'grin', en: 'Because they really give a HOOT!', es: '¡Porque siempre dicen: ju-jú, cuidado tú!' },
      { par: [{ do: 'pose', a: 'bear', mood: 'grin', hop: 1 }, { say: 'bear', mood: 'grin', en: 'Ha ha! Good one, Nutty.', es: '¡Ja, ja! Muy bueno, Nutty.' }] },
      { do: 'pose', a: 'alex', arm: 'down' },
      { end: true },
    ],
    // Hero rescue lines (one is picked each time a wrong choice plays out)
    rescue: [
      { en: 'Hoo! Hero to the rescue! Let’s rewind time and try again.', es: '¡Ju! ¡El héroe al rescate! Vamos a regresar el tiempo e intentarlo otra vez.' },
      { en: 'Hold on, Alex! Captain Caution is here! Rewind time!', es: '¡Espera, Alex! ¡El Capitán Cautela está aquí! ¡A regresar el tiempo!' },
      { en: 'Uh-oh! Time for some hero magic. Rewind!', es: '¡Uy! Es hora de magia de héroe. ¡A regresar!' },
    ],
    signoff: [
      { who: 'hero', en: 'Remember: Say NO. GO to a grown-up. TELL them.', es: 'Recuerda: Di NO. VE con un adulto. CUÉNTALE.' },
      { who: 'hero', en: 'Be safe, be super!', es: '¡Sé precavido, sé súper!' },
      { who: 'nutty', en: 'Nuts about safety!', es: '¡Locos por la seguridad!' },
    ],
  },
};

// Narrator voice also reads questions, choices and tips (who: 'narrator' / 'hero').
const MOVIE_UI = {
  en: { whatNext: 'What happens next?', safe: 'Safe choice!', tip: 'Hero Tip', tryAgain: 'Try again', play: 'Play', pause: 'Pause', repeat: 'Repeat', slow: 'Slow', captions: 'Captions', rewind: 'Rewind!', episode: 'Episode', movie: 'Hero Movie', start: '▶ Start the movie', again: 'Watch again', back: 'Back to the lesson', more: 'More Hero Movies', sticker: 'New sticker!', stars: 'First-try safe choices', skip: 'Skip', yourTurn: 'Your turn! What should Alex do?', listen: 'Listen', tapToContinue: 'Tap to continue', lead: 'Watch the story. When it stops, you choose! Wrong choices show what could happen, then the hero rewinds time.' },
  es: { whatNext: '¿Qué pasa después?', safe: '¡Decisión segura!', tip: 'Consejo del Héroe', tryAgain: 'Intentar otra vez', play: 'Reproducir', pause: 'Pausa', repeat: 'Repetir', slow: 'Lento', captions: 'Subtítulos', rewind: '¡A regresar!', episode: 'Episodio', movie: 'Película de Héroes', start: '▶ Empezar la película', again: 'Ver otra vez', back: 'Volver a la lección', more: 'Más películas', sticker: '¡Nueva calcomanía!', stars: 'Decisiones seguras al primer intento', skip: 'Saltar', yourTurn: '¡Tu turno! ¿Qué debería hacer Alex?', listen: 'Escuchar', tapToContinue: 'Toca para continuar', lead: 'Mira la historia. Cuando se detenga, ¡tú eliges! Las decisiones equivocadas muestran lo que podría pasar, y luego el héroe regresa el tiempo.' },
};

if (typeof module !== 'undefined' && module.exports) module.exports = { MOVIE_EPISODES, MOVIE_UI };
