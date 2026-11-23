/* ==========================================================================
   Safety Superheroes — Hero Movies: EPISODES
   One interactive cartoon per lesson. A scene plays, then it pauses on a
   question. A wrong answer plays out what happens next (gently), then the
   lesson's superhero swoops in, rewinds time and leaves a Hero Tip. A right
   answer plays the safe ending and the story moves on.

   Step types (see js/page-movie.js):
     {say, en, es, mood?, look?, to?, shot?:'close'|'two', emote?, arm?}
     {do:'walk'|'face'|'look'|'pose'|'cam'|'wait'|'sfx'|'music'|'spark'|'emote'|'hero'|'gag'|'layer'|'title'|'wipe', ...}
     {par:[steps]} {seq:[steps]}
     {ask:{q, choices:[{en, es, icon, ok, then:[steps], tip:{en,es}}]}}
     {end:true}  (sign-off lines, then ep.tag, then the sticker card)
   Lines are recorded by tools/voice/movie.py (run tools/build-movie-lines.js first).
   ========================================================================== */

const MOVIE_EPISODES = {
  'stranger-safety': {
    n: 1, set: 'park', theme: 'green', format: 'what-would-you-do',
    title: { en: 'The Golden Acorn', es: 'La bellota dorada' },
    sticker: { en: 'Stranger Sense', es: 'Sentido de Alerta' },
    names: { en: { goat: 'Grown-up', dad: 'Dad' }, es: { goat: 'Adulto desconocido', dad: 'Papá' } },
    heroTip: {
      en: 'If someone you don’t know asks you to go with them, say “No!” and go tell a grown-up you trust.',
      es: 'Si alguien que no conoces te pide que vayas con él, di “¡No!” y ve a contarle a un adulto de confianza.' },
    cast: {
      alex: { x: 2240, y: 805, face: 1 },
      dad: { x: 2420, y: 795, face: -1 },
      nutty: { x: 1420, y: 478, face: 1 },
      goat: { x: -260, y: 795, face: 1 },
    },
    cam: { x: 1440, zoom: 1.7 },
    steps: [
      // ---------- cold open: Nutty and the acorn ----------
      { do: 'cam', x: 1440, y: 560, zoom: 1.7, dur: 0 },
      { say: 'nutty', mood: 'grin', look: 'camera', en: 'One acorn for now... one acorn for later... and one acorn for... oops!', es: 'Una bellota para ahora... una para después... y una para... ¡uy!' },
      { do: 'gag', name: 'acorn-bonk', a: 'nutty' },
      { say: 'nutty', mood: 'dizzy', en: 'Oof! Nuts!', es: '¡Ay! ¡Qué nueces!' },
      { do: 'title' },
      // ---------- the picnic ----------
      { do: 'cam', x: 2330, zoom: 1.28, dur: 0, cut: true },
      { do: 'music', mood: 'happy' },
      { say: 'narrator', en: 'Once upon a time, Alex and Dad had a picnic at Sunny Meadow Park.', es: 'Había una vez, Alex y Papá hicieron un pícnic en el Parque Pradera Soleada.' },
      { say: 'dad', mood: 'grin', arm: 'point', en: 'Captain Alex! Your mission: find the golden acorn. I hid it by the castle slide!', es: '¡Capitana Alex! Tu misión: encontrar la bellota dorada. ¡La escondí junto al tobogán del castillo!' },
      { par: [{ do: 'pose', a: 'dad', arm: 'down' }, { do: 'pose', a: 'alex', hop: 2, arm: 'hi', mood: 'grin', ears: 'up' }] },
      { say: 'alex', mood: 'grin', en: 'Aye aye, Captain Dad! Boing! Boing!', es: '¡A la orden, Capitán Papá! ¡Boing! ¡Boing!' },
      { do: 'pose', a: 'alex', arm: 'down' },
      { say: 'dad', mood: 'smile', shot: 'two', to: 'alex', en: 'Remember our rule. Stay where you can see me, and I can see you.', es: 'Recuerda nuestra regla. Quédate donde tú me puedas ver, y yo te pueda ver.' },
      { say: 'alex', mood: 'grin', en: 'Got it! And if I find the treasure, can I keep it?', es: '¡Entendido! Y si encuentro el tesoro, ¿me lo puedo quedar?' },
      { say: 'dad', mood: 'proud', arm: 'hips', en: 'Only if I get the first bite.', es: 'Solo si yo le doy la primera mordida.' },
      { say: 'alex', mood: 'laugh', en: 'Dad! You can’t eat an acorn!', es: '¡Papá! ¡No te puedes comer una bellota!' },
      { do: 'pose', a: 'dad', arm: 'down' },
      { say: 'dad', mood: 'grin', en: 'Not with that attitude!', es: '¡No con esa actitud!' },
      { do: 'sfx', s: 'giggle' },
      // ---------- the treasure hunt ----------
      { do: 'face', a: 'alex', dir: -1 },
      { par: [
        { do: 'walk', a: 'alex', x: 1260, speed: 250 },
        { do: 'cam', follow: 'alex' },
        { seq: [{ do: 'wait', s: 1.8 }, { do: 'sfx', s: 'quack' }, { say: 'alex', mood: 'grin', en: 'Hi, ducks! Can’t stop! Treasure hunt!', es: '¡Hola, patitos! ¡No puedo parar! ¡Busco un tesoro!' }] },
      ] },
      { do: 'cam', x: 1230, zoom: 1.4, dur: 0.8 },
      { do: 'look', a: 'alex', at: null },
      { do: 'pose', a: 'alex', arm: 'reach', mood: 'surprised' }, { do: 'wait', s: 0.4 },
      { par: [{ do: 'pose', a: 'alex', hold: 'acorn', arm: 'hi', mood: 'grin', ears: 'up' }, { do: 'sfx', s: 'sparkle' }, { do: 'emote', a: 'alex', e: 'sparkle' }] },
      { say: 'alex', mood: 'grin', look: 'camera', en: 'I found it! The golden acorn!', es: '¡La encontré! ¡La bellota dorada!' },
      { par: [{ do: 'walk', a: 'nutty', x: 1330, y: 805, speed: 420 }, { do: 'emote', a: 'nutty', e: 'heart' }] },
      { say: 'nutty', mood: 'grin', to: 'alex', en: 'Ooh! Shiny!', es: '¡Uy! ¡Qué brillante!' },
      { do: 'gag', name: 'grab-acorn', a: 'nutty', from: 'alex' },
      { par: [{ do: 'walk', a: 'nutty', x: 1440, y: 478, speed: 300 }, { do: 'pose', a: 'alex', arm: 'reach', mood: 'surprised' }, { do: 'emote', a: 'alex', e: '!' }] },
      { say: 'alex', mood: 'worried', arm: 'point', en: 'Hey! Nutty! That’s my treasure!', es: '¡Oye! ¡Nutty! ¡Ese es mi tesoro!' },
      { say: 'nutty', mood: 'grin', en: 'Finders keepers! Hee hee!', es: '¡El que lo encuentra se lo queda! ¡Ji, ji!' },
      { do: 'pose', a: 'alex', arm: 'hips', mood: 'thinking' },
      // ---------- someone Alex doesn't know ----------
      { do: 'cam', x: 1000, zoom: 1.08, dur: 1.4 },
      { par: [
        { do: 'walk', a: 'goat', x: 1050, speed: 150 },
        { say: 'narrator', en: 'Just then, a grown-up walks over. Alex does not know them.', es: 'En ese momento, un adulto se acerca. Alex no lo conoce.' },
      ] },
      { do: 'pose', a: 'alex', arm: 'down', mood: 'smile' },
      { do: 'face', a: 'alex', dir: -1 },
      { do: 'cam', x: 1170, zoom: 1.38, dur: 1.0 },
      { say: 'narrator', en: 'Most grown-ups are nice. But this is someone Alex does not know.', es: 'La mayoría de los adultos son amables. Pero esta es una persona que Alex no conoce.' },
      { par: [{ do: 'gag', name: 'tail-puff', a: 'nutty' }, { do: 'spark', a: 'goat', at: 'head' }] },
      { say: 'nutty', mood: 'surprised', to: 'alex', en: 'Psst! Alex! You don’t know that grown-up!', es: '¡Psst! ¡Alex! ¡No conoces a ese adulto!' },
      { say: 'goat', mood: 'grin', arm: 'wave', to: 'alex', en: 'Hello there, little bunny! Lost something?', es: '¡Hola, conejita! ¿Perdiste algo?' },
      { do: 'pose', a: 'goat', arm: 'down' },
      { say: 'alex', look: 'camera', mood: 'surprised', en: 'Um... what should I do?', es: 'Mmm... ¿qué debo hacer?' },
      { ask: {
        q: { en: 'Someone Alex does not know is close by. What should Alex do first?', es: 'Alguien que Alex no conoce está cerca. ¿Qué debería hacer Alex primero?' },
        choices: [
          { icon: '🤗', ok: false, en: 'Hop right up close to say hi.', es: 'Saltar muy cerca para saludar.',
            then: [
              { par: [{ do: 'pose', a: 'alex', hop: 1, sfx: false }, { do: 'walk', a: 'alex', x: 1145, speed: 280 }] },
              { say: 'narrator', en: 'Alex hops right up close.', es: 'Alex salta muy, muy cerca.' },
              { par: [{ do: 'pose', a: 'goat', lean: 12, mood: 'grin' }, { do: 'cam', x: 1100, zoom: 1.7, dur: 0.8 }] },
              { say: 'narrator', en: 'Now the grown-up is very, very close.', es: 'Ahora el adulto está muy, muy cerca.' },
              { par: [{ do: 'pose', a: 'alex', mood: 'dizzy', ears: 'droop' }, { do: 'emote', a: 'alex', e: 'sweat' }] },
              { say: 'narrator', en: 'Alex feels mixed up. It is hard to step away.', es: 'Alex se siente confundida. Es difícil alejarse.' },
            ],
            tip: { en: 'Getting close right away is not safe. Stay back first, about two big hops away.', es: 'Acercarse de inmediato no es seguro. Primero mantente alejado, como a dos saltos grandes.' } },
          { icon: '👀', ok: true, en: 'Stay back a little and watch.', es: 'Mantenerse un poco alejada y observar.',
            then: [
              { do: 'walk', a: 'alex', x: 1320, speed: 120, back: true },
              { do: 'pose', a: 'alex', mood: 'thinking', ears: 'up', arm: 'think' },
              { say: 'alex', mood: 'thinking', en: 'I’ll stay back and watch.', es: 'Me quedaré lejos y observaré.' },
              { do: 'pose', a: 'alex', arm: 'down' },
              { say: 'narrator', en: 'Smart! Staying back gives Alex room to think.', es: '¡Muy bien! Mantenerse alejada le da espacio a Alex para pensar.' },
            ] },
          { icon: '🙈', ok: false, en: 'Run and hide, and don’t tell anyone.', es: 'Correr y esconderse, sin contarle a nadie.',
            then: [
              { do: 'face', a: 'alex', dir: 1 },
              { par: [{ do: 'walk', a: 'alex', x: 1535, speed: 320, y: 722 }, { say: 'narrator', en: 'Alex runs and hides behind the big tree.', es: 'Alex corre y se esconde detrás del árbol grande.' }] },
              { do: 'layer', a: 'alex', layer: 'back' },
              { do: 'pose', a: 'alex', mood: 'worried', ears: 'droop', lock: true }, { do: 'face', a: 'alex', dir: -1 },
              { do: 'cam', x: 2340, zoom: 1.35, dur: 1.4 },
              { par: [{ do: 'pose', a: 'dad', mood: 'worried' }, { do: 'emote', a: 'dad', e: '?' }] },
              { say: 'dad', mood: 'worried', look: 'camera', en: 'Alex? Alex, where are you?', es: '¿Alex? Alex, ¿dónde estás?' },
              { do: 'walk', a: 'dad', x: 2250, speed: 110 },
              { do: 'cam', x: 1500, zoom: 1.5, dur: 1.4 },
              { do: 'emote', a: 'alex', e: 'sweat' },
              { say: 'narrator', en: 'Dad can’t see Alex anymore. Everyone is worried, and Alex feels scared and alone.', es: 'Papá ya no puede ver a Alex. Todos están preocupados, y Alex se siente asustada y sola.' },
            ],
            tip: { en: 'You don’t have to hide! Stay back, and go tell your grown-up.', es: '¡No tienes que esconderte! Mantente alejado y ve a contarle a tu adulto.' } },
        ] } },
      // ---------- the candy ----------
      { par: [{ do: 'pose', a: 'goat', hold: 'candy', arm: 'offer', lean: 0 }, { do: 'cam', x: 1180, zoom: 1.38, dur: 0.6 }] },
      { do: 'spark', a: 'goat', at: 'hand' },
      { say: 'goat', mood: 'grin', to: 'alex', en: 'Here, I have candy for you. It’s yummy!', es: 'Toma, tengo un dulce para ti. ¡Está riquísimo!' },
      { say: 'nutty', mood: 'grin', shot: 'close', en: 'Ooh, candy! I love candy!', es: '¡Uy, dulces! ¡Me encantan los dulces!' },
      { say: 'nutty', mood: 'surprised', emote: '!', en: 'Wait. Nope! We don’t know that grown-up.', es: 'Un momento. ¡No, no! No conocemos a ese adulto.' },
      { say: 'alex', look: 'camera', mood: 'thinking', en: 'Hmm. I do not know this grown-up.', es: 'Mmm. No conozco a este adulto.' },
      { ask: {
        q: { en: 'The grown-up offers Alex candy. What should Alex do?', es: 'El adulto le ofrece un dulce a Alex. ¿Qué debería hacer Alex?' },
        choices: [
          { icon: '🍭', ok: false, en: 'Take the candy.', es: 'Tomar el dulce.',
            then: [
              { do: 'walk', a: 'alex', x: 1165, speed: 160 },
              { do: 'pose', a: 'alex', arm: 'reach' }, { do: 'wait', s: 0.5 },
              { par: [{ do: 'pose', a: 'goat', hold: null, arm: 'down' }, { do: 'pose', a: 'alex', hold: 'candy', arm: 'hold' }, { do: 'sfx', s: 'pop' }] },
              { say: 'narrator', en: 'Alex takes the candy.', es: 'Alex toma el dulce.' },
              { do: 'face', a: 'goat', dir: -1 }, { do: 'pose', a: 'goat', arm: 'point', lock: true },
              { say: 'goat', mood: 'grin', en: 'Come get more candy by my car!', es: '¡Ven por más dulces a mi carro!' },
              { do: 'pose', a: 'goat', arm: 'down', lock: false },
              { do: 'cam', x: 850, zoom: 1.15, dur: 1.4 },
              { par: [{ do: 'walk', a: 'goat', x: 640, speed: 140 }, { do: 'walk', a: 'alex', x: 900, speed: 120, delay: 0.5 }] },
              { par: [{ do: 'pose', a: 'alex', mood: 'worried', ears: 'droop' }, { do: 'emote', a: 'alex', e: 'sweat' }] },
              { say: 'narrator', en: 'Now Alex is walking away from Dad. It feels harder to say no.', es: 'Ahora Alex se aleja de Papá. Es más difícil decir que no.' },
            ],
            tip: { en: 'It is not safe to take things from people you do not know. Say, “No, thank you!”', es: 'No es seguro tomar cosas de personas que no conoces. Di: “¡No, gracias!”' } },
          { icon: '✋', ok: true, en: 'Say, “No, thank you!”', es: 'Decir: “¡No, gracias!”',
            then: [
              { do: 'pose', a: 'alex', arm: 'stop', mood: 'proud', ears: 'up' },
              { say: 'alex', mood: 'proud', shot: 'close', en: 'No, thank you!', es: '¡No, gracias!' },
              { do: 'pose', a: 'alex', arm: 'down' },
              { say: 'goat', mood: 'smile', en: 'Oh. Okay.', es: 'Ah. Está bien.' },
            ] },
        ] } },
      // ---------- the puppy in the car ----------
      { do: 'pose', a: 'goat', hold: null, arm: 'down' },
      { par: [{ do: 'walk', a: 'goat', x: 1095, speed: 80 }, { say: 'goat', mood: 'grin', to: 'alex', en: 'I have a cute puppy in my car. Want to come see?', es: 'Tengo un perrito muy lindo en mi carro. ¿Quieres venir a verlo?' }] },
      { do: 'face', a: 'goat', dir: 1 }, { do: 'pose', a: 'goat', arm: 'wave' },
      { say: 'narrator', en: 'The grown-up wants Alex to go with them.', es: 'El adulto quiere que Alex vaya con él.' },
      { do: 'pose', a: 'goat', arm: 'down' },
      { say: 'alex', look: 'camera', mood: 'worried', en: 'What should I do now?', es: '¿Qué hago ahora?' },
      { ask: {
        q: { en: 'The grown-up asks Alex to come see a puppy in their car. What should Alex do?', es: 'El adulto le pide a Alex que vaya a ver un perrito en su carro. ¿Qué debería hacer Alex?' },
        choices: [
          { icon: '🐶', ok: false, en: 'Go see the puppy.', es: 'Ir a ver el perrito.',
            then: [
              { do: 'cam', x: 760, zoom: 1.1, dur: 1.2 },
              { par: [
                { do: 'walk', a: 'goat', x: 470, speed: 140 },
                { do: 'walk', a: 'alex', x: 640, speed: 130, delay: 0.6 },
                { say: 'narrator', en: 'Alex walks to the car to see the puppy.', es: 'Alex camina al carro para ver el perrito.' },
              ] },
              { do: 'cam', x: 2340, zoom: 1.3, dur: 1.4 },
              { par: [{ do: 'pose', a: 'dad', mood: 'worried' }, { do: 'emote', a: 'dad', e: '?' }] },
              { say: 'dad', mood: 'worried', look: 'camera', en: 'Alex? Where did you go?', es: '¿Alex? ¿Adónde fuiste?' },
              { do: 'cam', x: 700, zoom: 1.25, dur: 1.4 },
              { par: [{ do: 'pose', a: 'alex', mood: 'worried', ears: 'droop' }, { do: 'emote', a: 'alex', e: 'sweat' }] },
              { say: 'narrator', en: 'Now Alex is far from the picnic, and Dad can’t see Alex at all.', es: 'Ahora Alex está lejos del pícnic, y Papá no la puede ver.' },
            ],
            tip: { en: 'Never go anywhere with someone you don’t know, not even to see a puppy. Say no, and go back to your grown-up.', es: 'Nunca vayas a ningún lugar con alguien que no conoces, ni siquiera para ver un perrito. Di que no y regresa con tu adulto.' } },
          { icon: '🏃', ok: true, en: 'Say “No!” and run back to Dad.', es: 'Decir “¡No!” y correr con Papá.',
            then: [
              { do: 'pose', a: 'alex', arm: 'stop', mood: 'proud', ears: 'up' },
              { say: 'alex', mood: 'proud', shot: 'close', en: 'No! I’m going back to my dad!', es: '¡No! ¡Voy a regresar con mi papá!' },
              { do: 'pose', a: 'alex', arm: 'down' },
              { do: 'face', a: 'alex', dir: 1 },
              { par: [
                { do: 'walk', a: 'alex', x: 2270, speed: 290 },
                { do: 'walk', a: 'nutty', x: 2160, y: 815, speed: 300, delay: 0.8 },
                { do: 'cam', follow: 'alex' },
              ] },
              { do: 'cam', x: 2340, zoom: 1.45, dur: 0.6 },
              { do: 'pose', a: 'alex', arm: 'tell' },
              { say: 'alex', mood: 'worried', to: 'dad', en: 'Dad! A grown-up I don’t know gave me candy... and wanted me to see a puppy in their car!', es: '¡Papá! Un adulto que no conozco me ofreció un dulce... ¡y quería que fuera a ver un perrito en su carro!' },
              { do: 'pose', a: 'alex', arm: 'down' },
              { par: [{ do: 'emote', a: 'dad', e: '!' }, { do: 'pose', a: 'dad', mood: 'surprised' }] },
              { say: 'dad', mood: 'proud', to: 'alex', shot: 'two', en: 'You said no, and you came straight back to tell me. That was exactly right!', es: 'Dijiste que no y viniste directo a contármelo. ¡Eso fue exactamente lo correcto!' },
              { say: 'dad', mood: 'smile', to: 'alex', en: 'Can you tell me what they looked like?', es: '¿Me puedes decir cómo era?' },
              { say: 'alex', mood: 'smile', to: 'dad', en: 'A green sweater and round glasses.', es: 'Un suéter verde y lentes redondos.' },
              { say: 'dad', mood: 'smile', en: 'Thank you. That really helps. From now on, let’s play close together.', es: 'Gracias. Eso me ayuda mucho. De ahora en adelante, juguemos cerquita.' },
              { par: [{ do: 'pose', a: 'dad', arm: 'hug', armB: 'hug', lean: 8, mood: 'proud' }, { do: 'pose', a: 'alex', arm: 'hug', armB: 'hug', mood: 'laugh' }, { do: 'emote', a: 'alex', e: 'heart' }] },
              { do: 'wait', s: 1.4 },
              { par: [{ do: 'pose', a: 'dad', arm: 'down', armB: 'down', lean: 0 }, { do: 'pose', a: 'alex', arm: 'down', armB: 'down', mood: 'smile' }] },
              { do: 'cam', x: 900, zoom: 1.1, dur: 1.4 },
              { do: 'face', a: 'goat', dir: -1 },
              { par: [{ do: 'walk', a: 'goat', x: 380, speed: 150 }, { say: 'narrator', en: 'The grown-up walks back to their car. Alex is safe with Dad.', es: 'El adulto vuelve a su carro. Alex está a salvo con Papá.' }] },
              { do: 'cam', x: 2260, zoom: 1.3, dur: 1.4 },
              { say: 'nutty', mood: 'grin', shot: 'two', to: 'alex', en: 'Um... I believe this is yours. I was, uh... keeping it safe!', es: 'Eh... creo que esto es tuyo. ¡Lo estaba... cuidando!' },
              { par: [{ do: 'gag', name: 'grab-acorn', a: 'alex', from: 'nutty' }, { do: 'pose', a: 'alex', arm: 'hi', mood: 'laugh' }] },
              { say: 'dad', mood: 'laugh', en: 'Ha! Nutty the safety squirrel!', es: '¡Ja! ¡Nutty, la ardilla de la seguridad!' },
              { do: 'pose', a: 'alex', arm: 'down' },
            ] },
        ] } },
      // ---------- the hero saves the day ----------
      { do: 'cam', x: 2220, zoom: 1.22, dur: 1.0 },
      { do: 'music', mood: 'hero' },
      { do: 'hero', mode: 'land', x: 2040 },
      { say: 'hero', en: 'Hoo-ray! Alex, you saved the day! You’re a real safety superhero!', es: '¡Ju-rra! ¡Alex, salvaste el día! ¡Eres una verdadera súper heroína de la seguridad!' },
      { par: [{ do: 'pose', a: 'alex', hop: 2, big: true, arm: 'cheer', armB: 'cheer', mood: 'laugh' }, { do: 'sfx', s: 'sparkle' }, { do: 'emote', a: 'alex', e: 'sparkle' }] },
      { do: 'pose', a: 'alex', arm: 'down', armB: 'down', mood: 'grin' },
      { say: 'nutty', mood: 'grin', to: 'hero', en: 'Hey, Captain! Why do owls love safety?', es: 'Oye, Capitán, ¿por qué a los búhos les encanta la seguridad?' },
      { say: 'nutty', mood: 'laugh', look: 'camera', en: 'Because they really give a HOOT!', es: '¡Porque siempre dicen: ju-jú, cuidado tú!' },
      { par: [{ do: 'pose', a: 'dad', mood: 'laugh', hop: 1, sfx: false }, { say: 'dad', mood: 'laugh', en: 'Ha ha! That’s even worse than my jokes!', es: '¡Ja, ja! ¡Ese es peor que mis chistes!' }] },
      { end: true },
    ],
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
    // a little family tag after the sign-off, before the sticker
    tag: [
      { say: 'dad', mood: 'grin', arm: 'point', to: 'alex', en: 'New game! It’s called... Safety Spies!', es: '¡Nuevo juego! Se llama... ¡Espías de la Seguridad!' },
      { par: [{ do: 'pose', a: 'alex', hop: 3, arm: 'cheer', mood: 'laugh' }, { say: 'alex', mood: 'laugh', en: 'Boing! Best game ever!', es: '¡Boing! ¡El mejor juego del mundo!' }] },
    ],
  },
};

const MOVIE_UI = {
  en: { whatNext: 'What happens next?', safe: 'Safe choice!', tip: 'Hero Tip', tryAgain: 'Try again', play: 'Play', pause: 'Pause', repeat: 'Repeat', slow: 'Slow', captions: 'Captions', music: 'Music', rewind: 'Rewind!', episode: 'Episode', movie: 'Hero Movie', start: '▶ Start the movie', again: 'Watch again', back: 'Back to the lesson', more: 'More Hero Movies', sticker: 'New sticker!', stars: 'First-try safe choices', skip: 'Skip', yourTurn: 'Your turn! What should Alex do?', listen: 'Listen', tapToContinue: 'Tap to continue', lead: 'Watch the story. When it stops, you choose! Wrong choices show what could happen, then the hero rewinds time.' },
  es: { whatNext: '¿Qué pasa después?', safe: '¡Decisión segura!', tip: 'Consejo del Héroe', tryAgain: 'Intentar otra vez', play: 'Reproducir', pause: 'Pausa', repeat: 'Repetir', slow: 'Lento', captions: 'Subtítulos', music: 'Música', rewind: '¡A regresar!', episode: 'Episodio', movie: 'Película de Héroes', start: '▶ Empezar la película', again: 'Ver otra vez', back: 'Volver a la lección', more: 'Más películas', sticker: '¡Nueva calcomanía!', stars: 'Decisiones seguras al primer intento', skip: 'Saltar', yourTurn: '¡Tu turno! ¿Qué debería hacer Alex?', listen: 'Escuchar', tapToContinue: 'Toca para continuar', lead: 'Mira la historia. Cuando se detenga, ¡tú eliges! Las decisiones equivocadas muestran lo que podría pasar, y luego el héroe regresa el tiempo.' },
};

if (typeof module !== 'undefined' && module.exports) module.exports = { MOVIE_EPISODES, MOVIE_UI };
