/* ==========================================================================
   Safety Superheroes — content for the research-based hero games
   (hero-route.html, spot-danger.html, help-call.html).

   Why these three games (see parents.html / the games page notes):
   - Hero Route follows Behavioral Skills Training: the hero SHOWS the safe
     steps first ("Watch me" = video modeling), then the learner rehearses
     them with instant, gentle feedback. Its street crossing is a small
     version of the desktop/VR street-crossing trainers used in autism
     research: wait for the walk sign AND an empty road, look both ways.
   - Spot the Danger is hazard recognition (home / poison safety studies
     teach "don't touch, move away, tell a grown-up").
   - Practice 911 Call is a role-play rehearsal of an emergency call.
   All three are no-fail and errorless: a wrong tap is explained, then the
   safe choice is shown so the learner always finishes on success.

   Keep sentences short and literal -- every line is also read aloud.
   ========================================================================== */

const HERO_ROUTES = {
  en: [
    {
      id: 'park', hero: 'street-safety', emoji: '🌳', title: 'Walk to the Park',
      blurb: 'Help your hero walk safely to the park with a grown-up.',
      steps: [
        { scene: '🏠🧍‍♂️🧒', say: 'We are walking to the park with Dad. We come to the end of the sidewalk.', prompt: 'What do we do at the edge of the street?',
          choices: [
            { t: 'Stop at the edge and hold Dad’s hand.', ok: true, why: 'Stop at the edge. Hold a grown-up’s hand near cars.' },
            { t: 'Run across fast.', ok: false, why: 'Running into the street is not safe. Cars can come fast. Always stop first.' },
          ] },
        { type: 'cross', scene: '🚦', say: 'Now we cross the street. Wait for the walking person sign. Look left, look right, look left again.' },
        { scene: '⚽💨🛣️', say: 'Oh no! Your ball rolls into the street.', prompt: 'What should you do?',
          choices: [
            { t: 'Let the ball go. Ask Dad to get it.', ok: true, why: 'A ball is not worth getting hurt. A grown-up can get it safely.' },
            { t: 'Run into the street to get it.', ok: false, why: 'Never run into the street, even for a ball. Ask a grown-up.' },
          ] },
        { scene: '🐕🧍‍♀️', say: 'A lady is walking a big dog. You want to pet it.', prompt: 'What should you do first?',
          choices: [
            { t: 'Ask, “Can I pet your dog?”', ok: true, why: 'Always ask the owner first. Some dogs do not like to be touched.' },
            { t: 'Hug the dog right away.', ok: false, why: 'A dog you do not know might be scared. Ask the owner first.' },
          ] },
      ],
      end: 'We made it to the park safely! Great job, hero!',
    },
    {
      id: 'store', hero: 'lost-safety', emoji: '🛒', title: 'Lost at the Store',
      blurb: 'You can’t see your grown-up. Find help the hero way.',
      steps: [
        { scene: '🛒❓', say: 'You are at the store. You look up. You can’t see Mom.', prompt: 'What should you do first?',
          choices: [
            { t: 'Stop. Stay where I am. Take a deep breath.', ok: true, why: 'Stop and stay put. It is easier for Mom to find you.' },
            { t: 'Run around the store looking.', ok: false, why: 'Running around makes you harder to find. Stop and stay put.' },
            { t: 'Go out to the parking lot.', ok: false, why: 'Never leave the store. Cars are outside. Stay inside.' },
          ] },
        { scene: '🧑‍💼🪪', say: 'Mom is still not here. You need a helper.', prompt: 'Who is a safe helper at the store?',
          choices: [
            { t: 'A store worker with a name tag.', ok: true, why: 'Workers with name tags, or the person at the cash register, are safe helpers.' },
            { t: 'Someone in the parking lot.', ok: false, why: 'Stay inside. Look for a worker with a name tag.' },
          ] },
        { scene: '🗣️🧑‍💼', say: 'You find a worker with a name tag.', prompt: 'What do you say?',
          choices: [
            { t: '“I am lost. My name is Alex. I can’t find my mom.”', ok: true, why: 'Say you are lost and say your name. That helps them help you.' },
            { t: 'Say nothing and walk away.', ok: false, why: 'Use your words. Say, “I am lost,” and say your name.' },
          ] },
        { scene: '📢🧑‍💼', say: 'The worker says, “Stay with me. I will call your mom on the speaker.”', prompt: 'What do you do?',
          choices: [
            { t: 'Stay with the worker and wait.', ok: true, why: 'Stay with the safe helper until your grown-up comes.' },
            { t: 'Go look for Mom by myself.', ok: false, why: 'Stay with the helper. Mom is on her way.' },
          ] },
      ],
      end: 'Mom is here! You stayed calm and found a safe helper. Hero job!',
    },
    {
      id: 'fire', hero: 'fire-safety', emoji: '🔥', title: 'Smoke Alarm!',
      blurb: 'The smoke alarm is beeping. Get out and stay out.',
      steps: [
        { scene: '🚨🔊🏠', say: 'Beep! Beep! Beep! The smoke alarm is loud. It is OK to cover your ears.', prompt: 'What do you do?',
          choices: [
            { t: 'Get out of the house.', ok: true, why: 'When the alarm beeps, get out fast. Cover your ears if it is too loud.' },
            { t: 'Hide under my bed.', ok: false, why: 'Never hide. Firefighters need to find you. Get out of the house.' },
          ] },
        { scene: '🌫️🧎', say: 'There is smoke in the hall.', prompt: 'How do you move?',
          choices: [
            { t: 'Get low and crawl under the smoke.', ok: true, why: 'Smoke goes up. The air is cleaner down low. Crawl out.' },
            { t: 'Stand up tall and walk slowly.', ok: false, why: 'Smoke is up high. Get low and crawl.' },
          ] },
        { scene: '🚪✋🔥', say: 'You come to a door. You touch it with the back of your hand. It feels hot.', prompt: 'What do you do?',
          choices: [
            { t: 'Do not open it. Use another way out.', ok: true, why: 'A hot door means fire is behind it. Go another way.' },
            { t: 'Open the door fast.', ok: false, why: 'A hot door means fire. Keep it closed and go another way.' },
          ] },
        { scene: '🌳👨‍👩‍👧', say: 'You are outside! Your family has a meeting spot by the big tree.', prompt: 'Where do you go?',
          choices: [
            { t: 'Go to the meeting spot and stay there.', ok: true, why: 'Go to your meeting spot so your family knows you are safe.' },
            { t: 'Go back inside for my toy.', ok: false, why: 'Never go back inside. Toys can be replaced. You can’t.' },
          ] },
      ],
      end: 'You got out and stayed out. Firefighters are proud of you!',
    },
    {
      id: 'pool', hero: 'water-safety', emoji: '🏊', title: 'Pool Day',
      blurb: 'Have fun at the pool and follow the water rules.',
      steps: [
        { scene: '🏊💧', say: 'You see the pool. It looks so fun!', prompt: 'What do you do before you get in?',
          choices: [
            { t: 'Wait for a grown-up to say yes and watch me.', ok: true, why: 'Only swim when a grown-up is watching you.' },
            { t: 'Jump in right away.', ok: false, why: 'Wait for a grown-up. Never swim alone.' },
          ] },
        { scene: '💦🏃', say: 'The ground by the pool is wet.', prompt: 'How do you move?',
          choices: [
            { t: 'Walk slowly.', ok: true, why: 'Wet ground is slippery. Walk, don’t run.' },
            { t: 'Run fast.', ok: false, why: 'You could slip and fall. Walk slowly.' },
          ] },
        { scene: '🙋🌊🛟', say: 'A friend is splashing in the deep water. They look scared. They need help.', prompt: 'What do you do?',
          choices: [
            { t: 'Yell for a grown-up. Throw a float.', ok: true, why: 'Get a grown-up and throw something that floats. Do not jump in.' },
            { t: 'Jump in to grab them.', ok: false, why: 'Jumping in can hurt you both. Yell for a grown-up and throw a float.' },
          ] },
        { scene: '⛈️⚡🏊', say: 'You hear thunder. Boom!', prompt: 'What do you do?',
          choices: [
            { t: 'Get out of the water right away.', ok: true, why: 'Thunder means lightning. Get out of the water and go inside.' },
            { t: 'Keep swimming.', ok: false, why: 'Lightning is dangerous in water. Get out now.' },
          ] },
      ],
      end: 'What a safe pool day! You followed every water rule.',
    },
  ],
  es: [
    {
      id: 'park', hero: 'street-safety', emoji: '🌳', title: 'Camino al parque',
      blurb: 'Ayuda a tu héroe a caminar seguro al parque con un adulto.',
      steps: [
        { scene: '🏠🧍‍♂️🧒', say: 'Vamos al parque con papá. Llegamos al final de la acera.', prompt: '¿Qué hacemos en la orilla de la calle?',
          choices: [
            { t: 'Parar en la orilla y tomar la mano de papá.', ok: true, why: 'Para en la orilla. Toma la mano de un adulto cerca de los carros.' },
            { t: 'Cruzar corriendo rápido.', ok: false, why: 'Correr a la calle no es seguro. Los carros pueden venir rápido. Siempre para primero.' },
          ] },
        { type: 'cross', scene: '🚦', say: 'Ahora cruzamos la calle. Espera la señal de la persona caminando. Mira a la izquierda, a la derecha y otra vez a la izquierda.' },
        { scene: '⚽💨🛣️', say: '¡Ay no! Tu pelota rueda a la calle.', prompt: '¿Qué debes hacer?',
          choices: [
            { t: 'Dejar la pelota. Pedirle a papá que la traiga.', ok: true, why: 'Una pelota no vale lastimarse. Un adulto la puede traer con cuidado.' },
            { t: 'Correr a la calle por la pelota.', ok: false, why: 'Nunca corras a la calle, ni por una pelota. Pide ayuda a un adulto.' },
          ] },
        { scene: '🐕🧍‍♀️', say: 'Una señora pasea un perro grande. Quieres acariciarlo.', prompt: '¿Qué haces primero?',
          choices: [
            { t: 'Preguntar: “¿Puedo acariciar a su perro?”', ok: true, why: 'Siempre pregunta primero al dueño. A algunos perros no les gusta que los toquen.' },
            { t: 'Abrazar al perro de inmediato.', ok: false, why: 'Un perro que no conoces puede asustarse. Pregunta primero al dueño.' },
          ] },
      ],
      end: '¡Llegamos al parque sanos y salvos! ¡Muy bien, héroe!',
    },
    {
      id: 'store', hero: 'lost-safety', emoji: '🛒', title: 'Perdido en la tienda',
      blurb: 'No ves a tu adulto. Busca ayuda como un héroe.',
      steps: [
        { scene: '🛒❓', say: 'Estás en la tienda. Miras hacia arriba. No ves a mamá.', prompt: '¿Qué haces primero?',
          choices: [
            { t: 'Parar. Quedarme donde estoy. Respirar hondo.', ok: true, why: 'Para y quédate ahí. Así es más fácil que mamá te encuentre.' },
            { t: 'Correr por toda la tienda buscando.', ok: false, why: 'Si corres, es más difícil encontrarte. Para y quédate ahí.' },
            { t: 'Salir al estacionamiento.', ok: false, why: 'Nunca salgas de la tienda. Afuera hay carros. Quédate adentro.' },
          ] },
        { scene: '🧑‍💼🪪', say: 'Mamá todavía no está. Necesitas un ayudante.', prompt: '¿Quién es un ayudante seguro en la tienda?',
          choices: [
            { t: 'Un trabajador de la tienda con gafete.', ok: true, why: 'Los trabajadores con gafete, o la persona de la caja, son ayudantes seguros.' },
            { t: 'Alguien en el estacionamiento.', ok: false, why: 'Quédate adentro. Busca a un trabajador con gafete.' },
          ] },
        { scene: '🗣️🧑‍💼', say: 'Encuentras a un trabajador con gafete.', prompt: '¿Qué le dices?',
          choices: [
            { t: '“Estoy perdido. Me llamo Alex. No encuentro a mi mamá.”', ok: true, why: 'Di que estás perdido y di tu nombre. Así te pueden ayudar.' },
            { t: 'No decir nada e irme.', ok: false, why: 'Usa tus palabras. Di: “Estoy perdido”, y di tu nombre.' },
          ] },
        { scene: '📢🧑‍💼', say: 'El trabajador dice: “Quédate conmigo. Voy a llamar a tu mamá por el altavoz.”', prompt: '¿Qué haces?',
          choices: [
            { t: 'Quedarme con el trabajador y esperar.', ok: true, why: 'Quédate con el ayudante seguro hasta que llegue tu adulto.' },
            { t: 'Ir a buscar a mamá yo solo.', ok: false, why: 'Quédate con el ayudante. Mamá ya viene.' },
          ] },
      ],
      end: '¡Mamá llegó! Te quedaste tranquilo y encontraste un ayudante seguro. ¡Trabajo de héroe!',
    },
    {
      id: 'fire', hero: 'fire-safety', emoji: '🔥', title: '¡Alarma de humo!',
      blurb: 'La alarma de humo suena. Sal y quédate afuera.',
      steps: [
        { scene: '🚨🔊🏠', say: '¡Bip! ¡Bip! ¡Bip! La alarma de humo suena fuerte. Está bien taparte los oídos.', prompt: '¿Qué haces?',
          choices: [
            { t: 'Salir de la casa.', ok: true, why: 'Cuando suena la alarma, sal rápido. Tápate los oídos si es muy fuerte.' },
            { t: 'Esconderme debajo de la cama.', ok: false, why: 'Nunca te escondas. Los bomberos necesitan encontrarte. Sal de la casa.' },
          ] },
        { scene: '🌫️🧎', say: 'Hay humo en el pasillo.', prompt: '¿Cómo te mueves?',
          choices: [
            { t: 'Agacharme y gatear debajo del humo.', ok: true, why: 'El humo sube. Abajo el aire está más limpio. Sal gateando.' },
            { t: 'Pararme derecho y caminar despacio.', ok: false, why: 'El humo está arriba. Agáchate y gatea.' },
          ] },
        { scene: '🚪✋🔥', say: 'Llegas a una puerta. La tocas con el dorso de la mano. Está caliente.', prompt: '¿Qué haces?',
          choices: [
            { t: 'No abrirla. Buscar otra salida.', ok: true, why: 'Una puerta caliente significa que hay fuego detrás. Ve por otro lado.' },
            { t: 'Abrir la puerta rápido.', ok: false, why: 'Una puerta caliente significa fuego. Déjala cerrada y ve por otro lado.' },
          ] },
        { scene: '🌳👨‍👩‍👧', say: '¡Estás afuera! Tu familia tiene un punto de encuentro junto al árbol grande.', prompt: '¿A dónde vas?',
          choices: [
            { t: 'Ir al punto de encuentro y quedarme ahí.', ok: true, why: 'Ve a tu punto de encuentro para que tu familia sepa que estás bien.' },
            { t: 'Volver adentro por mi juguete.', ok: false, why: 'Nunca vuelvas adentro. Los juguetes se pueden reemplazar. Tú no.' },
          ] },
      ],
      end: 'Saliste y te quedaste afuera. ¡Los bomberos están orgullosos de ti!',
    },
    {
      id: 'pool', hero: 'water-safety', emoji: '🏊', title: 'Día de piscina',
      blurb: 'Diviértete en la piscina y sigue las reglas del agua.',
      steps: [
        { scene: '🏊💧', say: 'Ves la piscina. ¡Se ve muy divertida!', prompt: '¿Qué haces antes de entrar?',
          choices: [
            { t: 'Esperar a que un adulto diga que sí y me mire.', ok: true, why: 'Solo nada cuando un adulto te esté mirando.' },
            { t: 'Saltar al agua de inmediato.', ok: false, why: 'Espera a un adulto. Nunca nades solo.' },
          ] },
        { scene: '💦🏃', say: 'El piso junto a la piscina está mojado.', prompt: '¿Cómo te mueves?',
          choices: [
            { t: 'Caminar despacio.', ok: true, why: 'El piso mojado resbala. Camina, no corras.' },
            { t: 'Correr rápido.', ok: false, why: 'Te puedes resbalar y caer. Camina despacio.' },
          ] },
        { scene: '🙋🌊🛟', say: 'Un amigo chapotea en el agua honda. Se ve asustado. Necesita ayuda.', prompt: '¿Qué haces?',
          choices: [
            { t: 'Gritar para llamar a un adulto. Lanzar un flotador.', ok: true, why: 'Busca a un adulto y lanza algo que flote. No saltes al agua.' },
            { t: 'Saltar para agarrarlo.', ok: false, why: 'Saltar puede lastimarlos a los dos. Llama a un adulto y lanza un flotador.' },
          ] },
        { scene: '⛈️⚡🏊', say: 'Oyes un trueno. ¡Bum!', prompt: '¿Qué haces?',
          choices: [
            { t: 'Salir del agua de inmediato.', ok: true, why: 'El trueno significa rayos. Sal del agua y entra a un lugar cerrado.' },
            { t: 'Seguir nadando.', ok: false, why: 'Los rayos son peligrosos en el agua. Sal ahora.' },
          ] },
      ],
      end: '¡Qué día de piscina tan seguro! Seguiste todas las reglas del agua.',
    },
  ],
};

// Spot the Danger: items sit on a picture-free "room" made of emoji.
// x / y are percentages inside the scene. danger:true items are the ones to find.
const DANGER_SCENES = {
  en: [
    { id: 'kitchen', hero: 'home-safety', emoji: '🍳', title: 'Kitchen', wall: '#fde9c9', floor: '#e2b98a',
      intro: 'Find the 4 things in the kitchen that could hurt you.',
      items: [
        { e: '🔪', x: 12, y: 38, danger: true, name: 'Sharp knife', tip: 'Knives are sharp. Don’t touch. Tell a grown-up.' },
        { e: '🍳', x: 60, y: 30, danger: true, name: 'Hot pan on the stove', tip: 'The stove is hot. Stay back. Only grown-ups cook.' },
        { e: '🧴', x: 82, y: 74, danger: true, name: 'Cleaning spray', tip: 'Cleaning spray is not food or a toy. Don’t touch it.' },
        { e: '🔌', x: 18, y: 76, danger: true, name: 'Plug and outlet', tip: 'Never put things in an outlet. Ask a grown-up.' },
        { e: '🍎', x: 85, y: 36, danger: false, name: 'Apple', tip: 'An apple is a safe snack.' },
        { e: '🥛', x: 36, y: 30, danger: false, name: 'Glass of milk', tip: 'Milk is safe to drink.' },
        { e: '🧸', x: 50, y: 78, danger: false, name: 'Teddy bear', tip: 'A teddy bear is safe.' },
      ] },
    { id: 'bathroom', hero: 'medical-safety', emoji: '🛁', title: 'Bathroom', wall: '#d9f0f5', floor: '#a9cfd8',
      intro: 'Find the 3 things in the bathroom that could hurt you.',
      items: [
        { e: '💊', x: 14, y: 32, danger: true, name: 'Pills', tip: 'Medicine is only from a grown-up you trust. It is not candy.' },
        { e: '🪒', x: 40, y: 34, danger: true, name: 'Razor', tip: 'Razors are sharp. Don’t touch them.' },
        { e: '🛁', x: 78, y: 68, danger: true, name: 'Bath with water and no grown-up', tip: 'Only take a bath when a grown-up is with you.' },
        { e: '🧼', x: 44, y: 74, danger: false, name: 'Soap', tip: 'Soap keeps your hands clean.' },
        { e: '🪥', x: 66, y: 30, danger: false, name: 'Toothbrush', tip: 'Brushing your teeth is a healthy habit.' },
        { e: '🧻', x: 14, y: 74, danger: false, name: 'Toilet paper', tip: 'Toilet paper is safe.' },
      ] },
    { id: 'living', hero: 'fire-safety', emoji: '🛋️', title: 'Living Room', wall: '#efe3f7', floor: '#c9b6a0',
      intro: 'Find the 3 things in the living room that could hurt you.',
      items: [
        { e: '🕯️', x: 13, y: 36, danger: true, name: 'Lit candle', tip: 'Fire is hot. Never touch a candle. Tell a grown-up.' },
        { e: '🔋', x: 58, y: 76, danger: true, name: 'Small batteries', tip: 'Small batteries are dangerous to swallow. Give them to a grown-up.' },
        { e: '🪟', x: 86, y: 26, danger: true, name: 'Open window', tip: 'Don’t climb by open windows. You could fall.' },
        { e: '📚', x: 37, y: 40, danger: false, name: 'Books', tip: 'Books are safe and fun.' },
        { e: '🧩', x: 24, y: 76, danger: false, name: 'Puzzle', tip: 'A puzzle is a safe toy.' },
        { e: '📺', x: 61, y: 34, danger: false, name: 'TV', tip: 'The TV is safe to watch.' },
      ] },
    { id: 'outside', hero: 'awareness-safety', emoji: '🌳', title: 'Outside', wall: '#cfeefc', floor: '#9fd68a',
      intro: 'Find the 4 things outside that could be unsafe.',
      items: [
        { e: '🚗', x: 87, y: 72, danger: true, name: 'Moving car', tip: 'Stay away from cars. Hold a grown-up’s hand in parking lots.' },
        { e: '🍄', x: 24, y: 82, danger: true, name: 'Wild mushroom', tip: 'Never eat plants or mushrooms you find. Some are poison.' },
        { e: '🐕', x: 62, y: 72, danger: true, name: 'Dog you don’t know', tip: 'Ask the owner before you pet a dog.' },
        { e: '🔥', x: 44, y: 50, danger: true, name: 'Campfire', tip: 'Stay back from fire. Let grown-ups take care of it.' },
        { e: '⚽', x: 12, y: 52, danger: false, name: 'Ball', tip: 'Playing ball is fun and safe.' },
        { e: '🪁', x: 30, y: 18, danger: false, name: 'Kite', tip: 'Flying a kite is fun.' },
        { e: '🌳', x: 74, y: 28, danger: false, name: 'Tree', tip: 'A tree gives nice shade.' },
      ] },
    { id: 'online', hero: 'online-safety', emoji: '💻', title: 'On the Tablet', wall: '#e7ecf3', floor: '#c4cedb', screen: true,
      intro: 'Find the 3 messages that are not safe.',
      items: [
        { e: '📍', x: 34, y: 14, danger: true, label: 'Tell me where you live!', name: 'Someone asks where you live', tip: 'Never share where you live online. Show a grown-up.' },
        { e: '🎁', x: 64, y: 32, danger: true, label: 'You won! Tap here!', name: 'A “you won” pop-up', tip: 'Pop-ups that say you won are tricks. Don’t tap. Tell a grown-up.' },
        { e: '👤', x: 38, y: 51, danger: true, label: 'Hi, I’m new. Be my secret friend?', name: 'A stranger wants a secret', tip: 'Safe friends don’t ask for secrets. Show a grown-up.' },
        { e: '👩', x: 64, y: 70, danger: false, label: 'Mom: Dinner is ready!', name: 'A message from Mom', tip: 'A message from family you know is safe.' },
        { e: '⭐', x: 36, y: 88, danger: false, label: 'Level complete!', name: 'Game message', tip: 'That is just your game. It is safe.' },
      ] },
  ],
  es: [
    { id: 'kitchen', hero: 'home-safety', emoji: '🍳', title: 'Cocina', wall: '#fde9c9', floor: '#e2b98a',
      intro: 'Encuentra las 4 cosas de la cocina que te pueden lastimar.',
      items: [
        { e: '🔪', x: 12, y: 38, danger: true, name: 'Cuchillo filoso', tip: 'Los cuchillos cortan. No los toques. Avisa a un adulto.' },
        { e: '🍳', x: 60, y: 30, danger: true, name: 'Sartén caliente en la estufa', tip: 'La estufa está caliente. Aléjate. Solo los adultos cocinan.' },
        { e: '🧴', x: 82, y: 74, danger: true, name: 'Líquido de limpieza', tip: 'El líquido de limpieza no es comida ni juguete. No lo toques.' },
        { e: '🔌', x: 18, y: 76, danger: true, name: 'Enchufe', tip: 'Nunca metas cosas en un enchufe. Pide ayuda a un adulto.' },
        { e: '🍎', x: 85, y: 36, danger: false, name: 'Manzana', tip: 'Una manzana es un bocadillo seguro.' },
        { e: '🥛', x: 36, y: 30, danger: false, name: 'Vaso de leche', tip: 'La leche se puede tomar.' },
        { e: '🧸', x: 50, y: 78, danger: false, name: 'Osito de peluche', tip: 'Un osito de peluche es seguro.' },
      ] },
    { id: 'bathroom', hero: 'medical-safety', emoji: '🛁', title: 'Baño', wall: '#d9f0f5', floor: '#a9cfd8',
      intro: 'Encuentra las 3 cosas del baño que te pueden lastimar.',
      items: [
        { e: '💊', x: 14, y: 32, danger: true, name: 'Pastillas', tip: 'La medicina solo te la da un adulto de confianza. No es dulce.' },
        { e: '🪒', x: 40, y: 34, danger: true, name: 'Rastrillo', tip: 'Los rastrillos cortan. No los toques.' },
        { e: '🛁', x: 78, y: 68, danger: true, name: 'Tina con agua y sin adulto', tip: 'Báñate solo cuando un adulto esté contigo.' },
        { e: '🧼', x: 44, y: 74, danger: false, name: 'Jabón', tip: 'El jabón te limpia las manos.' },
        { e: '🪥', x: 66, y: 30, danger: false, name: 'Cepillo de dientes', tip: 'Cepillarte los dientes es un buen hábito.' },
        { e: '🧻', x: 14, y: 74, danger: false, name: 'Papel de baño', tip: 'El papel de baño es seguro.' },
      ] },
    { id: 'living', hero: 'fire-safety', emoji: '🛋️', title: 'Sala', wall: '#efe3f7', floor: '#c9b6a0',
      intro: 'Encuentra las 3 cosas de la sala que te pueden lastimar.',
      items: [
        { e: '🕯️', x: 13, y: 36, danger: true, name: 'Vela encendida', tip: 'El fuego quema. Nunca toques una vela. Avisa a un adulto.' },
        { e: '🔋', x: 58, y: 76, danger: true, name: 'Pilas pequeñas', tip: 'Tragar pilas pequeñas es peligroso. Dáselas a un adulto.' },
        { e: '🪟', x: 86, y: 26, danger: true, name: 'Ventana abierta', tip: 'No te subas cerca de una ventana abierta. Te puedes caer.' },
        { e: '📚', x: 37, y: 40, danger: false, name: 'Libros', tip: 'Los libros son seguros y divertidos.' },
        { e: '🧩', x: 24, y: 76, danger: false, name: 'Rompecabezas', tip: 'Un rompecabezas es un juguete seguro.' },
        { e: '📺', x: 61, y: 34, danger: false, name: 'Televisión', tip: 'La tele es segura para ver.' },
      ] },
    { id: 'outside', hero: 'awareness-safety', emoji: '🌳', title: 'Afuera', wall: '#cfeefc', floor: '#9fd68a',
      intro: 'Encuentra las 4 cosas de afuera que pueden ser peligrosas.',
      items: [
        { e: '🚗', x: 87, y: 72, danger: true, name: 'Carro en movimiento', tip: 'Aléjate de los carros. Toma la mano de un adulto en el estacionamiento.' },
        { e: '🍄', x: 24, y: 82, danger: true, name: 'Hongo silvestre', tip: 'Nunca comas plantas ni hongos que encuentres. Algunos son venenosos.' },
        { e: '🐕', x: 62, y: 72, danger: true, name: 'Perro que no conoces', tip: 'Pregunta al dueño antes de acariciar a un perro.' },
        { e: '🔥', x: 44, y: 50, danger: true, name: 'Fogata', tip: 'Aléjate del fuego. Deja que los adultos lo cuiden.' },
        { e: '⚽', x: 12, y: 52, danger: false, name: 'Pelota', tip: 'Jugar a la pelota es divertido y seguro.' },
        { e: '🪁', x: 30, y: 18, danger: false, name: 'Papalote', tip: 'Volar un papalote es divertido.' },
        { e: '🌳', x: 74, y: 28, danger: false, name: 'Árbol', tip: 'Un árbol da buena sombra.' },
      ] },
    { id: 'online', hero: 'online-safety', emoji: '💻', title: 'En la tableta', wall: '#e7ecf3', floor: '#c4cedb', screen: true,
      intro: 'Encuentra los 3 mensajes que no son seguros.',
      items: [
        { e: '📍', x: 34, y: 14, danger: true, label: '¡Dime dónde vives!', name: 'Alguien pregunta dónde vives', tip: 'Nunca digas dónde vives en internet. Enséñaselo a un adulto.' },
        { e: '🎁', x: 64, y: 32, danger: true, label: '¡Ganaste! ¡Toca aquí!', name: 'Un anuncio de “ganaste”', tip: 'Los anuncios que dicen que ganaste son trampas. No toques. Avisa a un adulto.' },
        { e: '👤', x: 38, y: 51, danger: true, label: 'Hola, soy nuevo. ¿Quieres ser mi amigo secreto?', name: 'Un desconocido quiere un secreto', tip: 'Los amigos seguros no piden secretos. Enséñaselo a un adulto.' },
        { e: '👩', x: 64, y: 70, danger: false, label: 'Mamá: ¡La cena está lista!', name: 'Un mensaje de mamá', tip: 'Un mensaje de tu familia es seguro.' },
        { e: '⭐', x: 36, y: 88, danger: false, label: '¡Nivel completado!', name: 'Mensaje del juego', tip: 'Es solo tu juego. Es seguro.' },
      ] },
  ],
};

// Practice 911 Call: dial, then answer the dispatcher. The dispatcher's
// lines are read aloud; `say` lines are what the learner chooses to say.
const HELP_CALLS = {
  en: [
    { id: 'fall', emoji: '👴', title: 'Grandpa fell down', situation: 'Grandpa fell down. He won’t wake up. No other grown-up is home.',
      what: 'My grandpa fell down and he won’t wake up.' },
    { id: 'smoke', emoji: '🔥', title: 'Smoke in the house', situation: 'There is smoke and fire in your house. You got outside. Now you call for help.',
      what: 'There is a fire in my house. I am outside.' },
    { id: 'hurt', emoji: '🩹', title: 'A friend is badly hurt', situation: 'Your friend fell off the swing. They are bleeding a lot and can’t get up. No grown-up is close.',
      what: 'My friend is hurt. They are bleeding a lot.' },
  ],
  es: [
    { id: 'fall', emoji: '👴', title: 'El abuelo se cayó', situation: 'El abuelo se cayó. No se despierta. No hay otro adulto en casa.',
      what: 'Mi abuelo se cayó y no se despierta.' },
    { id: 'smoke', emoji: '🔥', title: 'Humo en la casa', situation: 'Hay humo y fuego en tu casa. Ya saliste. Ahora llamas para pedir ayuda.',
      what: 'Hay un incendio en mi casa. Estoy afuera.' },
    { id: 'hurt', emoji: '🩹', title: 'Un amigo está muy lastimado', situation: 'Tu amigo se cayó del columpio. Le sale mucha sangre y no se puede levantar. No hay un adulto cerca.',
      what: 'Mi amigo está lastimado. Le sale mucha sangre.' },
  ],
};

// The call script. {what} is replaced with the scenario's line.
const HELP_CALL_SCRIPT = {
  en: [
    { q: '9 1 1. What is your emergency?', choices: [
      { t: '{what}', ok: true, why: 'Yes! Say what happened in short, clear words.' },
      { t: 'Hi! How are you?', ok: false, why: 'Tell them what happened right away. That is what they need to know first.' },
      { t: 'Hang up the phone.', ok: false, why: 'Never hang up. They are there to help you.' },
    ] },
    { q: 'Where are you? What is your address?', address: true, choices: [
      { t: 'Say my address. My street and my house number.', ok: true, why: 'Great! Your address tells helpers where to go. Practice it with a grown-up.' },
      { t: 'I don’t know.', ok: false, why: 'That’s OK! Say what you see, like a street sign or a store. Then learn your address with a grown-up.' },
    ] },
    { q: 'What is your name?', choices: [
      { t: 'Say my first and last name.', ok: true, why: 'Good! Say your whole name, clear and slow.' },
      { t: 'Say nothing.', ok: false, why: 'Tell them your name. It helps them help you.' },
    ] },
    { q: 'Help is on the way. Stay on the phone with me.', choices: [
      { t: 'Stay on the phone and listen.', ok: true, why: 'Yes! Stay on the phone until they tell you it is OK to hang up.' },
      { t: 'Hang up now.', ok: false, why: 'Stay on the phone. They may tell you what to do next.' },
    ] },
  ],
  es: [
    { q: '9 1 1. ¿Cuál es su emergencia?', choices: [
      { t: '{what}', ok: true, why: '¡Sí! Di lo que pasó con palabras cortas y claras.' },
      { t: '¡Hola! ¿Cómo está?', ok: false, why: 'Di lo que pasó de inmediato. Eso es lo primero que necesitan saber.' },
      { t: 'Colgar el teléfono.', ok: false, why: 'Nunca cuelgues. Están ahí para ayudarte.' },
    ] },
    { q: '¿Dónde estás? ¿Cuál es tu dirección?', address: true, choices: [
      { t: 'Decir mi dirección. Mi calle y el número de mi casa.', ok: true, why: '¡Muy bien! Tu dirección les dice a los ayudantes a dónde ir. Practícala con un adulto.' },
      { t: 'No sé.', ok: false, why: '¡Está bien! Di lo que ves, como un letrero de la calle o una tienda. Luego aprende tu dirección con un adulto.' },
    ] },
    { q: '¿Cómo te llamas?', choices: [
      { t: 'Decir mi nombre y mi apellido.', ok: true, why: '¡Bien! Di tu nombre completo, claro y despacio.' },
      { t: 'No decir nada.', ok: false, why: 'Diles tu nombre. Así te pueden ayudar.' },
    ] },
    { q: 'La ayuda ya va en camino. Quédate en el teléfono conmigo.', choices: [
      { t: 'Quedarme en el teléfono y escuchar.', ok: true, why: '¡Sí! Quédate en el teléfono hasta que te digan que puedes colgar.' },
      { t: 'Colgar ya.', ok: false, why: 'Quédate en el teléfono. Te pueden decir qué hacer.' },
    ] },
  ],
};

/* ---------------------------------------------------------------------------
   Round 2 games: Sign Match, Freeze!, Who Can Help?, Pack the Go-Bag
   --------------------------------------------------------------------------- */

// Sign Match (sign-match.html): a memory game pairing a community safety
// sign with what it means. `sign` is the look of the sign card (styled in
// css .sm-sign--<kind>); `label` is the text printed on it.
const SAFETY_SIGNS = {
  en: [
    { id: 'stop', kind: 'stop', label: 'STOP', mean: 'Stop and wait.', e: '✋', say: 'A stop sign means stop and wait.' },
    { id: 'walk', kind: 'walk', label: '🚶', mean: 'You may walk. Look first!', e: '👀', say: 'The walking person means you may walk. Look both ways first!' },
    { id: 'dontwalk', kind: 'dontwalk', label: '✋', mean: 'Don’t start walking.', e: '⏸️', say: 'The red hand means don’t start walking.' },
    { id: 'exit', kind: 'exit', label: 'EXIT', mean: 'The way out.', e: '🚪', say: 'Exit means the way out of a building.' },
    { id: 'poison', kind: 'poison', label: '☠️', mean: 'Poison. Don’t touch!', e: '🚫', say: 'This sign means poison. Don’t touch it, and tell a grown-up.' },
    { id: 'restroom', kind: 'restroom', label: '🚻', mean: 'Bathroom.', e: '🚽', say: 'This sign shows where the bathroom is.' },
    { id: 'hospital', kind: 'hospital', label: 'H', mean: 'Hospital. Doctors help here.', e: '🩺', say: 'A big H means hospital. Doctors and nurses help people there.' },
    { id: 'noswim', kind: 'noswim', label: '🏊', mean: 'No swimming here.', e: '🚫', say: 'This sign means no swimming here.' },
  ],
  es: [
    { id: 'stop', kind: 'stop', label: 'ALTO', mean: 'Para y espera.', e: '✋', say: 'La señal de alto significa para y espera.' },
    { id: 'walk', kind: 'walk', label: '🚶', mean: 'Puedes caminar. ¡Mira primero!', e: '👀', say: 'La persona caminando significa que puedes caminar. ¡Primero mira a los dos lados!' },
    { id: 'dontwalk', kind: 'dontwalk', label: '✋', mean: 'No empieces a caminar.', e: '⏸️', say: 'La mano roja significa que no empieces a caminar.' },
    { id: 'exit', kind: 'exit', label: 'SALIDA', mean: 'Por aquí se sale.', e: '🚪', say: 'Salida significa por dónde se sale del edificio.' },
    { id: 'poison', kind: 'poison', label: '☠️', mean: 'Veneno. ¡No lo toques!', e: '🚫', say: 'Esta señal significa veneno. No lo toques y avisa a un adulto.' },
    { id: 'restroom', kind: 'restroom', label: '🚻', mean: 'Baño.', e: '🚽', say: 'Esta señal muestra dónde está el baño.' },
    { id: 'hospital', kind: 'hospital', label: 'H', mean: 'Hospital. Aquí ayudan los doctores.', e: '🩺', say: 'Una H grande significa hospital. Ahí los doctores y enfermeros ayudan a la gente.' },
    { id: 'noswim', kind: 'noswim', label: '🏊', mean: 'Prohibido nadar aquí.', e: '🚫', say: 'Esta señal significa que no se puede nadar aquí.' },
  ],
};

// Freeze! (freeze.html): the hero walks; STOP the moment a stop signal
// shows, and only GO when it's safe again. Practicing a fast, reliable
// response to "Stop!" is a core skill for staying safe near streets,
// parking lots and water.
const FREEZE_CUES = {
  en: {
    stop: [
      { e: '🗣️', t: 'Your grown-up says, “Stop!”' },
      { e: '🛑', t: 'A stop sign!' },
      { e: '🚦', t: 'The light turns red.' },
      { e: '🛣️', t: 'You reach the edge of the street.' },
      { e: '🌊', t: 'You reach the edge of the pool.' },
      { e: '🚗', t: 'A car is backing up.' },
      { e: '✋', t: 'The sign shows a red hand.' },
      { e: '🅿️', t: 'You are in a busy parking lot.' },
    ],
    go: [
      { e: '👍', t: 'Your grown-up says, “OK, let’s go.”' },
      { e: '🟢', t: 'The light is green and you looked both ways.' },
      { e: '🚶', t: 'The walk sign is on. The road is clear.' },
      { e: '🤝', t: 'You are holding your grown-up’s hand.' },
    ],
  },
  es: {
    stop: [
      { e: '🗣️', t: 'Tu adulto dice: “¡Alto!”' },
      { e: '🛑', t: '¡Una señal de alto!' },
      { e: '🚦', t: 'El semáforo se pone en rojo.' },
      { e: '🛣️', t: 'Llegas a la orilla de la calle.' },
      { e: '🌊', t: 'Llegas a la orilla de la piscina.' },
      { e: '🚗', t: 'Un carro va en reversa.' },
      { e: '✋', t: 'La señal muestra una mano roja.' },
      { e: '🅿️', t: 'Estás en un estacionamiento con muchos carros.' },
    ],
    go: [
      { e: '👍', t: 'Tu adulto dice: “Bien, vamos.”' },
      { e: '🟢', t: 'El semáforo está en verde y miraste a los dos lados.' },
      { e: '🚶', t: 'La señal de caminar está encendida. La calle está libre.' },
      { e: '🤝', t: 'Estás tomando la mano de tu adulto.' },
    ],
  },
};

// Who Can Help? (who-helps.html): you are lost -- tap the safe helpers.
// Same tap-the-picture engine as Spot the Danger; `ok:true` = safe helper.
const HELPER_SCENES = {
  en: [
    { id: 'store', hero: 'safehelper-safety', emoji: '🏬', title: 'At the Store', wall: '#fff1d9', floor: '#e8d3b0',
      intro: 'You are lost in the store. Find the 3 safe helpers.',
      items: [
        { e: '🧑‍💼', x: 16, y: 40, ok: true, label: 'Name tag', name: 'A worker with a name tag', tip: 'Workers with name tags are safe helpers. Say, “I am lost.”' },
        { e: '💁', x: 50, y: 34, ok: true, label: 'Cash register', name: 'The person at the cash register', tip: 'The person at the register works here. They can call your grown-up.' },
        { e: '👩‍👧‍👦', x: 82, y: 42, ok: true, name: 'A mom with kids', tip: 'A mom with kids is a good helper to ask.' },
        { e: '🚗', x: 82, y: 80, ok: false, name: 'Someone in a car who says, “Come here”', tip: 'Never go to a car. Stay inside and find a worker.' },
        { e: '🕶️', x: 22, y: 78, ok: false, name: 'Someone who says, “Come with me, I’ll find your mom”', tip: 'Don’t leave with someone. Stay put and find a worker or the register.' },
        { e: '🛒', x: 52, y: 76, ok: false, name: 'A shopping cart', tip: 'That’s a shopping cart. Look for a person with a name tag.' },
      ] },
    { id: 'park', hero: 'lost-safety', emoji: '🌳', title: 'At the Park', wall: '#d6f1ff', floor: '#a8dc8f',
      intro: 'You can’t find your grown-up at the park. Find the 3 safe helpers.',
      items: [
        { e: '👮', x: 18, y: 42, ok: true, name: 'A police officer', tip: 'Police officers help kids who are lost.' },
        { e: '🧑‍🏫', x: 50, y: 36, ok: true, label: 'Teacher', name: 'A teacher with a class', tip: 'A teacher with a group of kids is a safe helper.' },
        { e: '👨‍👧', x: 82, y: 44, ok: true, name: 'A dad with his kid', tip: 'A parent with kids is a good helper to ask.' },
        { e: '🍭', x: 22, y: 78, ok: false, name: 'Someone who offers candy to go with them', tip: 'Never go with someone for candy or a treat. Find a safe helper.' },
        { e: '🚐', x: 80, y: 78, ok: false, name: 'Someone in a van who says, “Want to see a puppy?”', tip: 'That is a trick. Stay away from the van. Find a police officer or a parent with kids.' },
        { e: '🐿️', x: 52, y: 70, ok: false, name: 'A squirrel', tip: 'A squirrel can’t help you! Look for a safe grown-up.' },
      ] },
    { id: 'school', hero: 'reporting-safety', emoji: '🏫', title: 'At School', wall: '#ffe9ef', floor: '#d9c2a5',
      intro: 'You feel sick and need help at school. Find the 3 safe helpers.',
      items: [
        { e: '🧑‍🏫', x: 18, y: 40, ok: true, name: 'Your teacher', tip: 'Your teacher is a safe helper. Tell them how you feel.' },
        { e: '🧑‍⚕️', x: 50, y: 34, ok: true, label: 'Nurse', name: 'The school nurse', tip: 'The school nurse helps when you feel sick or hurt.' },
        { e: '🦺', x: 82, y: 42, ok: true, label: 'Crossing guard', name: 'The crossing guard', tip: 'The crossing guard works at your school and keeps kids safe.' },
        { e: '📱', x: 22, y: 78, ok: false, name: 'A stranger online', tip: 'Someone online can’t help you at school. Find a grown-up who works there.' },
        { e: '🧒', x: 78, y: 78, ok: false, name: 'A little kid', tip: 'A little kid can’t help with this. Find a grown-up who works at school.' },
        { e: '🎒', x: 50, y: 74, ok: false, name: 'A backpack', tip: 'That’s a backpack! Look for a teacher or the nurse.' },
      ] },
  ],
  es: [
    { id: 'store', hero: 'safehelper-safety', emoji: '🏬', title: 'En la tienda', wall: '#fff1d9', floor: '#e8d3b0',
      intro: 'Te perdiste en la tienda. Encuentra a los 3 ayudantes seguros.',
      items: [
        { e: '🧑‍💼', x: 16, y: 40, ok: true, label: 'Gafete', name: 'Un trabajador con gafete', tip: 'Los trabajadores con gafete son ayudantes seguros. Di: “Estoy perdido.”' },
        { e: '💁', x: 50, y: 34, ok: true, label: 'Caja', name: 'La persona de la caja', tip: 'La persona de la caja trabaja aquí. Puede llamar a tu adulto.' },
        { e: '👩‍👧‍👦', x: 82, y: 42, ok: true, name: 'Una mamá con niños', tip: 'Una mamá con niños es buena para pedirle ayuda.' },
        { e: '🚗', x: 82, y: 80, ok: false, name: 'Alguien en un carro que dice: “Ven acá”', tip: 'Nunca vayas a un carro. Quédate adentro y busca a un trabajador.' },
        { e: '🕶️', x: 22, y: 78, ok: false, name: 'Alguien que dice: “Ven conmigo, yo busco a tu mamá”', tip: 'No te vayas con nadie. Quédate ahí y busca a un trabajador o la caja.' },
        { e: '🛒', x: 52, y: 76, ok: false, name: 'Un carrito', tip: 'Es un carrito del súper. Busca a una persona con gafete.' },
      ] },
    { id: 'park', hero: 'lost-safety', emoji: '🌳', title: 'En el parque', wall: '#d6f1ff', floor: '#a8dc8f',
      intro: 'No encuentras a tu adulto en el parque. Encuentra a los 3 ayudantes seguros.',
      items: [
        { e: '👮', x: 18, y: 42, ok: true, name: 'Un policía', tip: 'Los policías ayudan a los niños perdidos.' },
        { e: '🧑‍🏫', x: 50, y: 36, ok: true, label: 'Maestra', name: 'Una maestra con su grupo', tip: 'Una maestra con un grupo de niños es una ayudante segura.' },
        { e: '👨‍👧', x: 82, y: 44, ok: true, name: 'Un papá con su hija', tip: 'Un papá o una mamá con niños es bueno para pedirle ayuda.' },
        { e: '🍭', x: 22, y: 78, ok: false, name: 'Alguien que te ofrece dulces para que te vayas con él', tip: 'Nunca te vayas con alguien por un dulce. Busca a un ayudante seguro.' },
        { e: '🚐', x: 80, y: 78, ok: false, name: 'Alguien en una camioneta que dice: “¿Quieres ver un perrito?”', tip: 'Es una trampa. Aléjate de la camioneta. Busca a un policía o a un papá con niños.' },
        { e: '🐿️', x: 52, y: 70, ok: false, name: 'Una ardilla', tip: '¡Una ardilla no te puede ayudar! Busca a un adulto seguro.' },
      ] },
    { id: 'school', hero: 'reporting-safety', emoji: '🏫', title: 'En la escuela', wall: '#ffe9ef', floor: '#d9c2a5',
      intro: 'Te sientes mal y necesitas ayuda en la escuela. Encuentra a los 3 ayudantes seguros.',
      items: [
        { e: '🧑‍🏫', x: 18, y: 40, ok: true, name: 'Tu maestra', tip: 'Tu maestra es una ayudante segura. Dile cómo te sientes.' },
        { e: '🧑‍⚕️', x: 50, y: 34, ok: true, label: 'Enfermera', name: 'La enfermera de la escuela', tip: 'La enfermera ayuda cuando te sientes mal o te lastimas.' },
        { e: '🦺', x: 82, y: 42, ok: true, label: 'Guardia', name: 'El guardia del cruce', tip: 'El guardia del cruce trabaja en tu escuela y cuida a los niños.' },
        { e: '📱', x: 22, y: 78, ok: false, name: 'Un desconocido en internet', tip: 'Alguien en internet no te puede ayudar en la escuela. Busca a un adulto que trabaje ahí.' },
        { e: '🧒', x: 78, y: 78, ok: false, name: 'Un niño pequeño', tip: 'Un niño pequeño no puede ayudarte con esto. Busca a un adulto de la escuela.' },
        { e: '🎒', x: 50, y: 74, ok: false, name: 'Una mochila', tip: '¡Es una mochila! Busca a tu maestra o a la enfermera.' },
      ] },
  ],
};

// Pack the Go-Bag (go-bag.html): tap what belongs in an emergency bag.
const GO_BAG = {
  en: {
    intro: 'A storm is coming! Help pack the family go-bag. Tap the 8 things you need.',
    items: [
      { e: '💧', ok: true, name: 'Water', tip: 'Water to drink. Yes!' },
      { e: '🔦', ok: true, name: 'Flashlight', tip: 'A flashlight helps if the lights go out.' },
      { e: '🩹', ok: true, name: 'First aid kit', tip: 'Bandages for small cuts.' },
      { e: '🥫', ok: true, name: 'Snacks', tip: 'Food that won’t go bad.' },
      { e: '🎧', ok: true, name: 'Headphones', tip: 'Headphones help if things get loud.' },
      { e: '🧸', ok: true, name: 'Comfort toy', tip: 'Your favorite toy helps you feel calm.' },
      { e: '📇', ok: true, name: 'Card with phone numbers', tip: 'Your family’s phone numbers, written down.' },
      { e: '🔋', ok: true, name: 'Batteries', tip: 'Batteries for the flashlight.' },
      { e: '📺', ok: false, name: 'TV', tip: 'A TV is too big for a bag!' },
      { e: '🎳', ok: false, name: 'Bowling ball', tip: 'A bowling ball is too heavy!' },
      { e: '🪴', ok: false, name: 'Plant', tip: 'The plant can stay home.' },
      { e: '🛹', ok: false, name: 'Skateboard', tip: 'You don’t need a skateboard in an emergency.' },
    ],
    end: 'The go-bag is ready! Keep it by the door so your family can grab it fast.',
  },
  es: {
    intro: '¡Viene una tormenta! Ayuda a llenar la mochila de emergencia. Toca las 8 cosas que necesitas.',
    items: [
      { e: '💧', ok: true, name: 'Agua', tip: 'Agua para tomar. ¡Sí!' },
      { e: '🔦', ok: true, name: 'Linterna', tip: 'Una linterna ayuda si se va la luz.' },
      { e: '🩹', ok: true, name: 'Botiquín', tip: 'Curitas para cortaditas.' },
      { e: '🥫', ok: true, name: 'Comida', tip: 'Comida que no se echa a perder.' },
      { e: '🎧', ok: true, name: 'Audífonos', tip: 'Los audífonos ayudan si hay mucho ruido.' },
      { e: '🧸', ok: true, name: 'Juguete favorito', tip: 'Tu juguete favorito te ayuda a sentirte tranquilo.' },
      { e: '📇', ok: true, name: 'Tarjeta con teléfonos', tip: 'Los teléfonos de tu familia, escritos en papel.' },
      { e: '🔋', ok: true, name: 'Pilas', tip: 'Pilas para la linterna.' },
      { e: '📺', ok: false, name: 'Televisión', tip: '¡La tele es muy grande para una mochila!' },
      { e: '🎳', ok: false, name: 'Bola de boliche', tip: '¡La bola de boliche pesa mucho!' },
      { e: '🪴', ok: false, name: 'Planta', tip: 'La planta se puede quedar en casa.' },
      { e: '🛹', ok: false, name: 'Patineta', tip: 'No necesitas una patineta en una emergencia.' },
    ],
    end: '¡La mochila está lista! Déjala junto a la puerta para que tu familia la tome rápido.',
  },
};
