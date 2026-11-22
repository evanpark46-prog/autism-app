/* ==========================================================================
   Safety Superheroes — Word Builder word list (words.html)

   Three levels of the words kids meet in the safety lessons, taught the way
   early vocabulary is usually taught: a picture, a short kid-friendly
   meaning, an example sentence, then practice finding and using the word.

     Level 1  about Pre-K – 1st grade   6 units x 6 words
     Level 2  about 2nd – 3rd grade     4 units x 6 words
     Level 3  about 4th grade and up    3 units x 6 words

   Each word (per language):
     w     the word exactly as it appears in `fill`
     def   the meaning, in short simple words
     ex    an example sentence
     fill  a sentence with ___ where the word goes
   VOCAB_AVOID lists words that would ALSO fit a word's fill-in sentence,
   so they are never offered as the "wrong" choices for it.
   ========================================================================== */

const VOCAB_LEVELS = [
  { id: 'l1', color: 'green', grade: { en: 'About Pre-K – 1st grade', es: 'Aprox. preescolar a 1.º' }, name: { en: 'Level 1 · First Words', es: 'Nivel 1 · Primeras palabras' },
    units: [
      { id: 'stopgo', e: '🚦', title: { en: 'Stop and Go', es: 'Alto y siga' }, words: ['stop', 'go', 'wait', 'look', 'listen', 'walk'] },
      { id: 'helpers', e: '🦸', title: { en: 'People Who Help', es: 'Personas que ayudan' }, words: ['grownup', 'helper', 'police', 'firefighter', 'doctor', 'teacher'] },
      { id: 'feelings', e: '💛', title: { en: 'Feelings', es: 'Sentimientos' }, words: ['happy', 'sad', 'scared', 'angry', 'calm', 'brave'] },
      { id: 'danger', e: '⚠️', title: { en: 'Safe or Danger?', es: '¿Seguro o peligro?' }, words: ['safe', 'danger', 'hot', 'sharp', 'hurt', 'poison'] },
      { id: 'places', e: '🗺️', title: { en: 'Places', es: 'Lugares' }, words: ['home', 'school', 'street', 'store', 'park', 'pool'] },
      { id: 'asking', e: '🗣️', title: { en: 'Asking for Help', es: 'Pedir ayuda' }, words: ['help', 'yes', 'no', 'please', 'lost', 'name'] },
    ] },
  { id: 'l2', color: 'blue', grade: { en: 'About 2nd – 3rd grade', es: 'Aprox. 2.º a 3.º' }, name: { en: 'Level 2 · Growing Words', es: 'Nivel 2 · Palabras que crecen' },
    units: [
      { id: 'people', e: '🤝', title: { en: 'People and Secrets', es: 'Personas y secretos' }, words: ['stranger', 'trusted', 'private', 'secret', 'surprise', 'permission'] },
      { id: 'onthego', e: '🚸', title: { en: 'On the Go', es: 'En camino' }, words: ['crosswalk', 'signal', 'traffic', 'helmet', 'seatbelt', 'lifeguard'] },
      { id: 'emergency', e: '🚨', title: { en: 'Emergencies', es: 'Emergencias' }, words: ['emergency', 'alarm', 'address', 'smoke', 'medicine', 'firstaid'] },
      { id: 'choices', e: '🧠', title: { en: 'Feelings and Choices', es: 'Sentimientos y decisiones' }, words: ['nervous', 'frustrated', 'break', 'choice', 'rule', 'boundary'] },
    ] },
  { id: 'l3', color: 'purple', grade: { en: 'About 4th grade and up', es: 'Aprox. 4.º en adelante' }, name: { en: 'Level 3 · Big Words', es: 'Nivel 3 · Palabras grandes' },
    units: [
      { id: 'online', e: '💻', title: { en: 'Online Safety', es: 'Seguridad en internet' }, words: ['password', 'personalinfo', 'online', 'block', 'report', 'scam'] },
      { id: 'relationships', e: '💬', title: { en: 'Respect and Trust', es: 'Respeto y confianza' }, words: ['consent', 'respect', 'pressure', 'uncomfortable', 'bully', 'trust'] },
      { id: 'plans', e: '🗺️', title: { en: 'Emergency Plans', es: 'Planes de emergencia' }, words: ['evacuate', 'hazard', 'shelter', 'contact', 'route', 'advocate'] },
    ] },
];

// Picture for each word (same in both languages).
const VOCAB_PICS = {
  stop: '🛑', go: '🟢', wait: '⏳', look: '👀', listen: '👂', walk: '🚶',
  grownup: '🧑', helper: '🙋', police: '👮', firefighter: '🧑‍🚒', doctor: '🧑‍⚕️', teacher: '🧑‍🏫',
  happy: '😀', sad: '😢', scared: '😨', angry: '😠', calm: '😌', brave: '💪',
  safe: '🛡️', danger: '⚠️', hot: '🔥', sharp: '🔪', hurt: '🤕', poison: '☠️',
  home: '🏠', school: '🏫', street: '🛣️', store: '🏪', park: '🌳', pool: '🏊',
  help: '🆘', yes: '👍', no: '🙅', please: '🙏', lost: '🧭', name: '📛',
  stranger: '🧍', trusted: '🤝', private: '🔒', secret: '🤫', surprise: '🎁', permission: '✅',
  crosswalk: '🚸', signal: '🚦', traffic: '🚗', helmet: '⛑️', seatbelt: '💺', lifeguard: '🛟',
  emergency: '🚨', alarm: '🔔', address: '📍', smoke: '🌫️', medicine: '💊', firstaid: '🩹',
  nervous: '😬', frustrated: '😤', break: '⏸️', choice: '🤔', rule: '📋', boundary: '🚧',
  password: '🔑', personalinfo: '🪪', online: '🌐', block: '🚫', report: '🚩', scam: '🎣',
  consent: '🙋‍♀️', respect: '💗', pressure: '🗯️', uncomfortable: '😣', bully: '😈', trust: '🫶',
  evacuate: '🏃', hazard: '☢️', shelter: '🏚️', contact: '📇', route: '🛤️', advocate: '📣',
};

// Words that also fit a word's fill-in sentence (never used as wrong choices).
const VOCAB_AVOID = {
  stop: ['wait'], wait: ['stop', 'look', 'listen'], go: ['walk'], walk: ['go'], look: ['listen'], listen: ['look'],
  grownup: ['helper', 'police', 'firefighter', 'doctor', 'teacher'], helper: ['grownup', 'police', 'firefighter', 'doctor', 'teacher'],
  police: ['helper', 'grownup'], firefighter: ['helper', 'grownup'], doctor: ['helper', 'grownup'], teacher: ['helper', 'grownup'],
  happy: ['calm', 'safe', 'brave'], sad: ['angry', 'scared', 'hurt', 'frustrated', 'nervous'], scared: ['sad', 'nervous', 'uncomfortable'],
  angry: ['sad', 'frustrated'], calm: ['happy', 'safe'], brave: ['calm', 'safe'],
  safe: ['calm', 'happy'], danger: ['hazard', 'emergency'], hot: [], sharp: [], hurt: [], poison: ['danger', 'hazard'],
  home: ['school', 'park'], school: ['home'], street: ['crosswalk'], store: [], park: ['pool', 'school'], pool: ['park'],
  help: ['please'], yes: ['please', 'no'], no: ['stop', 'help'], please: [], lost: ['scared', 'sad', 'nervous'], name: ['address'],
  stranger: [], trusted: [], private: ['secret'], secret: ['surprise', 'private'], surprise: ['secret'], permission: [],
  crosswalk: ['street'], signal: [], traffic: [], helmet: [], seatbelt: [], lifeguard: ['helper'],
  emergency: ['danger', 'hazard'], alarm: [], address: ['name'], smoke: [], medicine: [], firstaid: [],
  nervous: ['scared', 'sad', 'uncomfortable'], frustrated: ['angry', 'sad'], break: [], choice: [], rule: [], boundary: ['rule'],
  password: [], personalinfo: ['address', 'name', 'password'], online: [], block: ['report'], report: ['block'], scam: [],
  consent: ['permission', 'respect'], respect: ['trust'], pressure: [], uncomfortable: ['scared', 'nervous', 'sad'], bully: ['stranger'], trust: ['respect'],
  evacuate: [], hazard: ['danger', 'emergency'], shelter: ['home'], contact: ['helper', 'trusted'], route: [], advocate: [],
};

const VOCAB_WORDS = {
  en: {
    // ---- Level 1: Stop and Go
    stop: { w: 'stop', def: 'Stop means do not move.', ex: 'Stop at the edge of the street.', fill: 'At the street, I ___ and hold a grown-up’s hand.' },
    go: { w: 'go', def: 'Go means start moving.', ex: 'Green means go.', fill: 'The light is green. Now we can ___.' },
    wait: { w: 'wait', def: 'Wait means stay where you are until it is time.', ex: 'I wait for the walking person sign.', fill: 'I stand in line and ___ for my turn.' },
    look: { w: 'look', def: 'Look means use your eyes to see.', ex: 'Look left and look right.', fill: 'I use my eyes to ___ for cars.' },
    listen: { w: 'listen', def: 'Listen means use your ears to hear.', ex: 'Listen to your grown-up.', fill: 'I use my ears to ___.' },
    walk: { w: 'walk', def: 'Walk means move on your feet, slowly. Not run.', ex: 'Walk by the pool.', fill: 'The floor is wet, so I ___ slowly.' },
    // ---- People Who Help
    grownup: { w: 'grown-up', def: 'A grown-up is an adult, like Mom, Dad, or a teacher.', ex: 'Hold a grown-up’s hand near cars.', fill: 'A ___ can help me cross the street.' },
    helper: { w: 'helper', def: 'A helper is a person who helps you.', ex: 'A store worker with a name tag is a helper.', fill: 'When I need help, I can ask a ___.' },
    police: { w: 'police officer', def: 'A police officer helps keep people safe.', ex: 'A police officer can help if I am lost.', fill: 'The ___ wears a badge and keeps us safe.' },
    firefighter: { w: 'firefighter', def: 'A firefighter puts out fires and helps people.', ex: 'A firefighter can wear a mask. Don’t hide from them!', fill: 'The ___ sprays water on the fire.' },
    doctor: { w: 'doctor', def: 'A doctor helps you when you are sick or hurt.', ex: 'The doctor checks my ears.', fill: 'When I am sick, the ___ helps me feel better.' },
    teacher: { w: 'teacher', def: 'A teacher helps you learn at school.', ex: 'I tell my teacher when I need help.', fill: 'At school, my ___ helps me learn.' },
    // ---- Feelings
    happy: { w: 'happy', def: 'Happy is a good feeling. It can make you smile.', ex: 'I feel happy when I play.', fill: 'I got a big hug. I feel ___.' },
    sad: { w: 'sad', def: 'Sad is a feeling that can make you cry.', ex: 'It is OK to feel sad. I can tell a grown-up.', fill: 'My toy broke. I feel ___.' },
    scared: { w: 'scared', def: 'Scared means you feel afraid.', ex: 'If I feel scared, I go to a grown-up.', fill: 'The loud thunder makes me feel ___.' },
    angry: { w: 'angry', def: 'Angry means you feel mad.', ex: 'When I feel angry, I take a deep breath.', fill: 'He took my toy. I feel ___.' },
    calm: { w: 'calm', def: 'Calm means quiet and relaxed inside.', ex: 'Slow breaths help me feel calm.', fill: 'I take slow, deep breaths to feel ___.' },
    brave: { w: 'brave', def: 'Brave means you do a hard thing, even if you feel scared.', ex: 'Superheroes are brave. I can be brave too!', fill: 'I felt scared, but I was ___ and told a grown-up.' },
    // ---- Safe or Danger?
    safe: { w: 'safe', def: 'Safe means nothing will hurt you.', ex: 'I feel safe with my family.', fill: 'I hold Mom’s hand to stay ___.' },
    danger: { w: 'danger', def: 'Danger is something that could hurt you.', ex: 'A busy street is a danger. Hold a hand.', fill: 'Fire is a ___. Stay away!' },
    hot: { w: 'hot', def: 'Hot things can burn your skin.', ex: 'The stove is hot. Only grown-ups cook.', fill: 'Don’t touch the stove. It is ___!' },
    sharp: { w: 'sharp', def: 'Sharp things can cut you.', ex: 'Knives are sharp. Don’t touch them.', fill: 'Don’t touch the knife. It is ___!' },
    hurt: { w: 'hurt', def: 'Hurt means a part of your body feels pain.', ex: 'If I get hurt, I tell a grown-up.', fill: 'I fell down. My knee is ___.' },
    poison: { w: 'poison', def: 'Poison can make you very sick if it goes in your mouth.', ex: 'Cleaning spray can be poison.', fill: 'That bottle is ___. Don’t drink it!' },
    // ---- Places
    home: { w: 'home', def: 'Home is where you live with your family.', ex: 'I feel safe at home.', fill: 'I sleep in my bed at ___.' },
    school: { w: 'school', def: 'School is where you go to learn.', ex: 'At school, I stay with my class.', fill: 'I go to ___ to learn with my teacher.' },
    street: { w: 'street', def: 'A street is a road where cars drive.', ex: 'I hold a hand by the street.', fill: 'Cars drive on the ___.' },
    store: { w: 'store', def: 'A store is a place where you buy things.', ex: 'At the store, I stay close to my grown-up.', fill: 'We buy food at the ___.' },
    park: { w: 'park', def: 'A park is a place with grass and swings.', ex: 'I play at the park where my grown-up can see me.', fill: 'I play on the swings at the ___.' },
    pool: { w: 'pool', def: 'A pool is a big place full of water to swim in.', ex: 'I only swim in the pool when a grown-up is watching.', fill: 'We swim in the ___.' },
    // ---- Asking for Help
    help: { w: 'help', def: 'Help is when someone does something for you that you need.', ex: 'It is OK to ask for help.', fill: 'I am stuck. I say, “___ me, please!”' },
    yes: { w: 'yes', def: 'Yes means OK, I want it.', ex: 'Nod your head for yes.', fill: 'Do you want a snack? ___, please!' },
    no: { w: 'no', def: 'No means I don’t want it. Stop.', ex: 'I can say no if a touch does not feel OK.', fill: 'If someone touches me and I don’t like it, I say, “___!”' },
    please: { w: 'please', def: 'Please is a kind word you say when you ask for something.', ex: 'Can I have a turn, please?', fill: 'Can I have some water, ___?' },
    lost: { w: 'lost', def: 'Lost means you can’t find your grown-up or your way.', ex: 'If I am lost, I stop and look for a helper.', fill: 'I can’t find Mom. I am ___.' },
    name: { w: 'name', def: 'Your name is what people call you.', ex: 'My name is on my backpack.', fill: 'When I am lost, I tell a helper my ___.' },

    // ---- Level 2: People and Secrets
    stranger: { w: 'stranger', def: 'A stranger is someone you don’t know.', ex: 'If a stranger asks me to go with them, I say no and tell a grown-up.', fill: 'I don’t know that man. He is a ___.' },
    trusted: { w: 'trusted', def: 'Trusted means you know that person will keep you safe.', ex: 'My grandma is a trusted grown-up.', fill: 'When something is wrong, I tell a ___ grown-up.' },
    private: { w: 'private', def: 'Private means just for you, not for sharing.', ex: 'My body parts under my swimsuit are private.', fill: 'My diary is ___. I don’t share it.' },
    secret: { w: 'secret', def: 'A secret is something someone tells you not to tell.', ex: 'Never keep a secret that makes you feel bad. Tell a trusted grown-up.', fill: 'If a grown-up says, “Don’t tell your mom,” that is a bad ___.' },
    surprise: { w: 'surprise', def: 'A surprise is a happy secret that everyone finds out soon, like a present.', ex: 'Surprises are fun because everyone finds out.', fill: 'We are making a birthday ___ for Dad.' },
    permission: { w: 'permission', def: 'Permission means a grown-up says it is OK.', ex: 'I get permission before I use the stove.', fill: 'I ask for ___ before I go to a friend’s house.' },
    // ---- On the Go
    crosswalk: { w: 'crosswalk', def: 'A crosswalk is the striped path where people cross the street.', ex: 'We cross at the crosswalk, not in the middle of the street.', fill: 'We cross the street at the ___.' },
    signal: { w: 'signal', def: 'A signal is a light or sign that tells you what to do.', ex: 'The red hand signal means wait.', fill: 'The walk ___ shows a walking person.' },
    traffic: { w: 'traffic', def: 'Traffic is all the cars, buses, and trucks on the road.', ex: 'Look and listen for traffic before you cross.', fill: 'There is a lot of ___ on the busy road.' },
    helmet: { w: 'helmet', def: 'A helmet is a hard hat that protects your head.', ex: 'My helmet must be buckled to keep me safe.', fill: 'I wear my ___ when I ride my bike.' },
    seatbelt: { w: 'seat belt', def: 'A seat belt holds you safely in your seat in the car.', ex: 'A seat belt keeps you safe if the car stops fast.', fill: 'Click! I buckle my ___ in the car.' },
    lifeguard: { w: 'lifeguard', def: 'A lifeguard watches swimmers and keeps them safe.', ex: 'I listen to the lifeguard at the pool.', fill: 'At the pool, the ___ watches the swimmers.' },
    // ---- Emergencies
    emergency: { w: 'emergency', def: 'An emergency is when someone is in danger or badly hurt and needs help right now.', ex: 'In an emergency, call 911.', fill: 'A house fire is an ___. Call 911!' },
    alarm: { w: 'alarm', def: 'An alarm is a loud sound that warns you.', ex: 'When the fire alarm beeps, I get out.', fill: 'Beep, beep! The smoke ___ means get out.' },
    address: { w: 'address', def: 'Your address tells where you live: your street and house number.', ex: 'I practice my address with a grown-up.', fill: 'I tell 911 my ___ so help can find me.' },
    smoke: { w: 'smoke', def: 'Smoke is the gray cloud that comes from fire.', ex: 'Smoke goes up, so I get low.', fill: 'If there is ___, I get low and go out.' },
    medicine: { w: 'medicine', def: 'Medicine helps sick people get better. Only a grown-up should give it to you.', ex: 'Medicine is not candy.', fill: 'I only take ___ from a trusted grown-up.' },
    firstaid: { w: 'first aid', def: 'First aid is quick help for a hurt, like cleaning a cut and adding a bandage.', ex: 'We keep a first aid kit at home.', fill: 'Mom used ___ to clean my cut and put on a bandage.' },
    // ---- Feelings and Choices
    nervous: { w: 'nervous', def: 'Nervous is a worried feeling, like butterflies in your tummy.', ex: 'New places can make me feel nervous.', fill: 'I feel ___ on the first day of school.' },
    frustrated: { w: 'frustrated', def: 'Frustrated is how you feel when something is too hard.', ex: 'When I feel frustrated, I can take a break.', fill: 'This puzzle is too hard! I feel ___.' },
    break: { w: 'break', def: 'A break is a short rest to feel calm again.', ex: 'It is OK to ask for a break.', fill: 'I feel upset, so I ask for a ___.' },
    choice: { w: 'choice', def: 'A choice is when you pick one thing.', ex: 'Superheroes make safe choices.', fill: 'I can make a safe ___.' },
    rule: { w: 'rule', def: 'A rule tells you what you should do.', ex: 'Rules help keep everyone safe.', fill: 'The pool ___ says walk, don’t run.' },
    boundary: { w: 'boundary', def: 'A boundary is a limit, like how close people can be to you.', ex: 'Everyone has a boundary. Ask before you touch someone.', fill: 'Saying “Please don’t hug me” is setting a ___.' },

    // ---- Level 3: Online Safety
    password: { w: 'password', def: 'A password is a secret code that keeps your account safe.', ex: 'Only my parent and I know my password.', fill: 'I never share my ___ with friends.' },
    personalinfo: { w: 'personal information', def: 'Personal information is facts about you, like your full name, address, or school.', ex: 'Keep personal information private online.', fill: 'I don’t post my ___ online.' },
    online: { w: 'online', def: 'Online means on the internet.', ex: 'People online are not always who they say they are.', fill: 'When I play games ___, I only talk to people I know.' },
    block: { w: 'block', def: 'To block someone means they can’t message you anymore.', ex: 'I can block anyone who is mean.', fill: 'Someone is mean in the game, so I ___ them.' },
    report: { w: 'report', def: 'To report means to tell a trusted adult or the app about a problem.', ex: 'I report mean messages instead of answering them.', fill: 'I ___ the problem to a trusted adult.' },
    scam: { w: 'scam', def: 'A scam is a trick to take your money or information.', ex: 'Free prizes from strangers are usually a scam.', fill: 'A message that says, “You won a free phone!” is a ___.' },
    // ---- Respect and Trust
    consent: { w: 'consent', def: 'Consent means asking first and getting a clear yes. You can change your mind anytime.', ex: 'Consent means everyone gets to decide about their own body.', fill: 'Before a hug, I ask first and wait for a clear yes. That is ___.' },
    respect: { w: 'respect', def: 'Respect means treating people, their bodies, and their choices kindly.', ex: 'I show respect when I listen.', fill: 'When my friend says no, I show ___ and stop.' },
    pressure: { w: 'pressure', def: 'Pressure is when others push you to do something you don’t want to do.', ex: 'I can say no to pressure and walk away.', fill: 'My friends kept saying, “Do it!” That was peer ___.' },
    uncomfortable: { w: 'uncomfortable', def: 'Uncomfortable is a not-OK feeling in your body or mind.', ex: 'If something feels uncomfortable, I tell someone I trust.', fill: 'If a touch makes me feel ___, I can say no and tell someone.' },
    bully: { w: 'bully', def: 'A bully is someone who is mean to others again and again.', ex: 'Telling an adult about a bully is not tattling.', fill: 'The ___ keeps taking my lunch, so I tell a teacher.' },
    trust: { w: 'trust', def: 'To trust someone means you believe they will be honest and keep you safe.', ex: 'Trust is earned over time.', fill: 'I ___ my grandma. I can tell her anything.' },
    // ---- Emergency Plans
    evacuate: { w: 'evacuate', def: 'Evacuate means leave a place quickly because of danger.', ex: 'We practice how to evacuate in a fire drill.', fill: 'When the fire alarm rings, we ___ the building.' },
    hazard: { w: 'hazard', def: 'A hazard is something that could cause harm.', ex: 'Toys on the stairs are a hazard.', fill: 'A wet floor is a ___. Someone could slip.' },
    shelter: { w: 'shelter', def: 'A shelter is a safe place to stay during danger.', ex: 'In a tornado, we go to our shelter.', fill: 'During the storm, we stayed in the ___ in the basement.' },
    contact: { w: 'emergency contact', def: 'An emergency contact is a person to call if something goes wrong.', ex: 'My emergency contact’s number is on a card in my bag.', fill: 'Grandma is my ___. Her number is on my card.' },
    route: { w: 'route', def: 'A route is the way you go to get somewhere.', ex: 'I know a safe route to school.', fill: 'I take the same safe ___ to school every day.' },
    advocate: { w: 'advocate', def: 'To advocate for yourself means to speak up for what you need.', ex: 'Asking for headphones in a loud room is how I advocate for myself.', fill: 'I ___ for myself when I say, “I need a break.”' },
  },
  es: {
    stop: { w: 'parar', def: 'Parar significa no moverse.', ex: 'Hay que parar en la orilla de la calle.', fill: 'En la calle, tengo que ___ y tomar la mano de un adulto.' },
    go: { w: 'avanzar', def: 'Avanzar significa empezar a moverse.', ex: 'El verde significa avanzar.', fill: 'El semáforo está en verde. Ya podemos ___.' },
    wait: { w: 'esperar', def: 'Esperar significa quedarte donde estás hasta que sea hora.', ex: 'Tengo que esperar la señal de la persona caminando.', fill: 'Estoy en la fila y tengo que ___ mi turno.' },
    look: { w: 'mirar', def: 'Mirar significa usar los ojos para ver.', ex: 'Hay que mirar a la izquierda y a la derecha.', fill: 'Uso los ojos para ___ si vienen carros.' },
    listen: { w: 'escuchar', def: 'Escuchar significa usar las orejas para oír.', ex: 'Hay que escuchar a tu adulto.', fill: 'Uso las orejas para ___.' },
    walk: { w: 'caminar', def: 'Caminar significa moverte con los pies, despacio. Sin correr.', ex: 'Junto a la piscina, hay que caminar.', fill: 'El piso está mojado, así que voy a ___ despacio.' },
    grownup: { w: 'adulto', def: 'Un adulto es una persona grande, como mamá, papá o una maestra.', ex: 'Toma la mano de un adulto cerca de los carros.', fill: 'Un ___ me puede ayudar a cruzar la calle.' },
    helper: { w: 'ayudante', def: 'Un ayudante es una persona que te ayuda.', ex: 'Un trabajador de la tienda con gafete es un ayudante.', fill: 'Cuando necesito ayuda, le puedo pedir a un ___.' },
    police: { w: 'policía', def: 'Un policía ayuda a cuidar a la gente.', ex: 'Un policía me puede ayudar si me pierdo.', fill: 'El ___ lleva una placa y nos cuida.' },
    firefighter: { w: 'bombero', def: 'Un bombero apaga incendios y ayuda a la gente.', ex: 'Un bombero puede usar una máscara. ¡No te escondas de él!', fill: 'El ___ echa agua al fuego.' },
    doctor: { w: 'doctor', def: 'Un doctor te ayuda cuando estás enfermo o lastimado.', ex: 'El doctor revisa mis oídos.', fill: 'Cuando estoy enfermo, el ___ me ayuda a sentirme mejor.' },
    teacher: { w: 'maestra', def: 'Una maestra te ayuda a aprender en la escuela.', ex: 'Le digo a mi maestra cuando necesito ayuda.', fill: 'En la escuela, mi ___ me ayuda a aprender.' },
    happy: { w: 'feliz', def: 'Feliz es un sentimiento bonito. Te puede hacer sonreír.', ex: 'Me siento feliz cuando juego.', fill: 'Me dieron un abrazo grande. Me siento ___.' },
    sad: { w: 'triste', def: 'Triste es un sentimiento que te puede hacer llorar.', ex: 'Está bien sentirse triste. Se lo puedo decir a un adulto.', fill: 'Se rompió mi juguete. Me siento ___.' },
    scared: { w: 'asustado', def: 'Asustado significa que sientes miedo.', ex: 'Si me siento asustado, voy con un adulto.', fill: 'El trueno fuerte me hace sentir ___.' },
    angry: { w: 'enojado', def: 'Enojado significa que estás molesto.', ex: 'Cuando estoy enojado, respiro hondo.', fill: 'Me quitó mi juguete. Estoy ___.' },
    calm: { w: 'tranquilo', def: 'Tranquilo significa quieto y relajado por dentro.', ex: 'Respirar despacio me ayuda a estar tranquilo.', fill: 'Respiro lento y hondo para estar ___.' },
    brave: { w: 'valiente', def: 'Valiente significa hacer algo difícil aunque tengas miedo.', ex: 'Los superhéroes son valientes. ¡Yo también puedo ser valiente!', fill: 'Tenía miedo, pero fui ___ y le dije a un adulto.' },
    safe: { w: 'seguro', def: 'Seguro significa que nada te va a lastimar.', ex: 'Me siento seguro con mi familia.', fill: 'Tomo la mano de mamá para estar ___.' },
    danger: { w: 'peligro', def: 'Un peligro es algo que te puede lastimar.', ex: 'Una calle con muchos carros es un peligro. Toma una mano.', fill: 'El fuego es un ___. ¡Aléjate!' },
    hot: { w: 'caliente', def: 'Las cosas calientes te pueden quemar la piel.', ex: 'La estufa está caliente. Solo los adultos cocinan.', fill: 'No toques la estufa. ¡Está ___!' },
    sharp: { w: 'filoso', def: 'Las cosas filosas te pueden cortar.', ex: 'Los cuchillos son filosos. No los toques.', fill: 'No toques el cuchillo. ¡Está ___!' },
    hurt: { w: 'dolor', def: 'Dolor es cuando una parte de tu cuerpo se siente mal.', ex: 'Si tengo dolor, se lo digo a un adulto.', fill: 'Me caí y tengo ___ en la rodilla.' },
    poison: { w: 'veneno', def: 'El veneno te puede enfermar mucho si te entra a la boca.', ex: 'El líquido de limpieza puede ser veneno.', fill: 'Esa botella tiene ___. ¡No la tomes!' },
    home: { w: 'casa', def: 'Tu casa es donde vives con tu familia.', ex: 'Me siento seguro en casa.', fill: 'Duermo en mi cama en mi ___.' },
    school: { w: 'escuela', def: 'La escuela es donde vas a aprender.', ex: 'En la escuela, me quedo con mi grupo.', fill: 'Voy a la ___ a aprender con mi maestra.' },
    street: { w: 'calle', def: 'Una calle es un camino por donde van los carros.', ex: 'Tomo una mano cerca de la calle.', fill: 'Los carros van por la ___.' },
    store: { w: 'tienda', def: 'Una tienda es un lugar donde compras cosas.', ex: 'En la tienda, me quedo cerca de mi adulto.', fill: 'Compramos comida en la ___.' },
    park: { w: 'parque', def: 'Un parque es un lugar con pasto y columpios.', ex: 'Juego en el parque donde mi adulto me puede ver.', fill: 'Juego en los columpios del ___.' },
    pool: { w: 'piscina', def: 'Una piscina es un lugar grande lleno de agua para nadar.', ex: 'Solo nado en la piscina cuando un adulto me mira.', fill: 'Nadamos en la ___.' },
    help: { w: 'ayuda', def: 'Ayuda es cuando alguien hace algo que tú necesitas.', ex: 'Está bien pedir ayuda.', fill: 'Estoy atorado. Digo: “¡___, por favor!”' },
    yes: { w: 'sí', def: 'Sí significa que está bien, que lo quiero.', ex: 'Mueve la cabeza hacia abajo para decir sí.', fill: '¿Quieres un bocadillo? ¡___, por favor!' },
    no: { w: 'no', def: 'No significa que no lo quiero. Para.', ex: 'Puedo decir que no si un toque no se siente bien.', fill: 'Si alguien me toca y no me gusta, digo: “¡___!”' },
    please: { w: 'por favor', def: 'Por favor son palabras amables para pedir algo.', ex: '¿Me prestas un turno, por favor?', fill: '¿Me das agua, ___?' },
    lost: { w: 'perdido', def: 'Perdido significa que no encuentras a tu adulto o el camino.', ex: 'Si estoy perdido, me detengo y busco a un ayudante.', fill: 'No encuentro a mamá. Estoy ___.' },
    name: { w: 'nombre', def: 'Tu nombre es como te llama la gente.', ex: 'Mi nombre está en mi mochila.', fill: 'Si me pierdo, le digo mi ___ a un ayudante.' },

    stranger: { w: 'desconocido', def: 'Un desconocido es alguien que no conoces.', ex: 'Si un desconocido me pide que me vaya con él, digo que no y le aviso a un adulto.', fill: 'No conozco a ese señor. Es un ___.' },
    trusted: { w: 'de confianza', def: 'De confianza significa que sabes que esa persona te va a cuidar.', ex: 'Mi abuela es una adulta de confianza.', fill: 'Cuando algo está mal, se lo digo a un adulto ___.' },
    private: { w: 'privado', def: 'Privado significa solo para ti, no para compartir.', ex: 'Las partes de mi cuerpo que cubre el traje de baño son privadas.', fill: 'Mi diario es ___. No lo comparto.' },
    secret: { w: 'secreto', def: 'Un secreto es algo que alguien te dice que no cuentes.', ex: 'Nunca guardes un secreto que te haga sentir mal. Díselo a un adulto de confianza.', fill: 'Si un adulto dice: “No le digas a tu mamá”, es un ___ malo.' },
    surprise: { w: 'sorpresa', def: 'Una sorpresa es un secreto feliz que todos descubren pronto, como un regalo.', ex: 'Las sorpresas son divertidas porque todos se enteran.', fill: 'Estamos preparando una ___ de cumpleaños para papá.' },
    permission: { w: 'permiso', def: 'Permiso significa que un adulto dice que está bien.', ex: 'Pido permiso antes de usar la estufa.', fill: 'Pido ___ antes de ir a la casa de un amigo.' },
    crosswalk: { w: 'cruce peatonal', def: 'El cruce peatonal es el camino con rayas por donde se cruza la calle.', ex: 'Cruzamos por el cruce peatonal, no a media calle.', fill: 'Cruzamos la calle por el ___.' },
    signal: { w: 'señal', def: 'Una señal es una luz o un letrero que te dice qué hacer.', ex: 'La señal de la mano roja significa esperar.', fill: 'La ___ para caminar muestra a una persona caminando.' },
    traffic: { w: 'tráfico', def: 'El tráfico son todos los carros, autobuses y camiones en la calle.', ex: 'Mira y escucha si hay tráfico antes de cruzar.', fill: 'Hay mucho ___ en la avenida.' },
    helmet: { w: 'casco', def: 'Un casco es un sombrero duro que protege tu cabeza.', ex: 'Mi casco tiene que estar abrochado para cuidarme.', fill: 'Me pongo el ___ cuando ando en bici.' },
    seatbelt: { w: 'cinturón de seguridad', def: 'El cinturón de seguridad te mantiene seguro en tu asiento del carro.', ex: 'El cinturón de seguridad te protege si el carro frena de golpe.', fill: '¡Clic! Me abrocho el ___ en el carro.' },
    lifeguard: { w: 'salvavidas', def: 'Un salvavidas cuida a los que nadan.', ex: 'Escucho al salvavidas en la piscina.', fill: 'En la piscina, el ___ cuida a los nadadores.' },
    emergency: { w: 'emergencia', def: 'Una emergencia es cuando alguien está en peligro o muy lastimado y necesita ayuda ya.', ex: 'En una emergencia, llama al 911.', fill: 'Un incendio en la casa es una ___. ¡Llama al 911!' },
    alarm: { w: 'alarma', def: 'Una alarma es un sonido fuerte que te avisa.', ex: 'Cuando suena la alarma de incendio, salgo.', fill: '¡Bip, bip! La ___ de humo significa que hay que salir.' },
    address: { w: 'dirección', def: 'Tu dirección dice dónde vives: tu calle y el número de tu casa.', ex: 'Practico mi dirección con un adulto.', fill: 'Le digo mi ___ al 911 para que la ayuda me encuentre.' },
    smoke: { w: 'humo', def: 'El humo es la nube gris que sale del fuego.', ex: 'El humo sube, así que me agacho.', fill: 'Si hay ___, me agacho y salgo.' },
    medicine: { w: 'medicina', def: 'La medicina ayuda a los enfermos a mejorar. Solo un adulto te la debe dar.', ex: 'La medicina no es un dulce.', fill: 'Solo tomo ___ de un adulto de confianza.' },
    firstaid: { w: 'primeros auxilios', def: 'Los primeros auxilios son ayuda rápida para una herida, como limpiar una cortada y poner una curita.', ex: 'En casa tenemos un botiquín de primeros auxilios.', fill: 'Mamá me dio ___: limpió mi cortada y me puso una curita.' },
    nervous: { w: 'nervioso', def: 'Nervioso es un sentimiento de preocupación, como mariposas en la panza.', ex: 'Los lugares nuevos me pueden poner nervioso.', fill: 'Me siento ___ el primer día de escuela.' },
    frustrated: { w: 'frustrado', def: 'Frustrado es como te sientes cuando algo es muy difícil.', ex: 'Cuando me siento frustrado, puedo tomar un descanso.', fill: '¡Este rompecabezas es muy difícil! Me siento ___.' },
    break: { w: 'descanso', def: 'Un descanso es una pausa corta para volver a estar tranquilo.', ex: 'Está bien pedir un descanso.', fill: 'Estoy molesto, así que pido un ___.' },
    choice: { w: 'decisión', def: 'Una decisión es cuando eliges una cosa.', ex: 'Los superhéroes toman decisiones seguras.', fill: 'Puedo tomar una ___ segura.' },
    rule: { w: 'regla', def: 'Una regla te dice lo que debes hacer.', ex: 'Las reglas nos ayudan a estar seguros.', fill: 'La ___ de la piscina dice: camina, no corras.' },
    boundary: { w: 'límite', def: 'Un límite es hasta dónde está bien para ti, como qué tan cerca puede estar la gente.', ex: 'Todos tenemos un límite. Pregunta antes de tocar a alguien.', fill: 'Decir “Por favor, no me abraces” es poner un ___.' },

    password: { w: 'contraseña', def: 'Una contraseña es un código secreto que protege tu cuenta.', ex: 'Solo mi papá o mamá y yo sabemos mi contraseña.', fill: 'Nunca comparto mi ___ con mis amigos.' },
    personalinfo: { w: 'información personal', def: 'La información personal son datos sobre ti, como tu nombre completo, tu dirección o tu escuela.', ex: 'Mantén tu información personal en privado en internet.', fill: 'No publico mi ___ en internet.' },
    online: { w: 'en línea', def: 'En línea significa en internet.', ex: 'La gente en línea no siempre es quien dice ser.', fill: 'Cuando juego ___, solo hablo con gente que conozco.' },
    block: { w: 'bloquear', def: 'Bloquear a alguien significa que ya no te puede mandar mensajes.', ex: 'Puedo bloquear a cualquiera que sea grosero.', fill: 'Alguien es grosero en el juego, así que lo voy a ___.' },
    report: { w: 'reportar', def: 'Reportar significa contarle un problema a un adulto de confianza o a la aplicación.', ex: 'Es mejor reportar los mensajes groseros que contestarlos.', fill: 'Voy a ___ el problema a un adulto de confianza.' },
    scam: { w: 'estafa', def: 'Una estafa es un engaño para quitarte dinero o información.', ex: 'Los premios gratis de desconocidos casi siempre son una estafa.', fill: 'Un mensaje que dice “¡Ganaste un teléfono gratis!” es una ___.' },
    consent: { w: 'consentimiento', def: 'Consentimiento significa preguntar primero y recibir un sí claro. Puedes cambiar de opinión cuando quieras.', ex: 'Con el consentimiento, cada persona decide sobre su propio cuerpo.', fill: 'Antes de un abrazo, pregunto y espero un sí claro. Eso es ___.' },
    respect: { w: 'respeto', def: 'Respeto significa tratar con amabilidad a las personas, sus cuerpos y sus decisiones.', ex: 'Muestro respeto cuando escucho.', fill: 'Cuando mi amigo dice que no, le muestro ___ y paro.' },
    pressure: { w: 'presión', def: 'La presión es cuando otros te empujan a hacer algo que no quieres.', ex: 'Puedo decir que no a la presión y alejarme.', fill: 'Mis amigos me decían: “¡Hazlo!”. Eso era ___ de grupo.' },
    uncomfortable: { w: 'incómodo', def: 'Incómodo es un sentimiento de que algo no está bien en tu cuerpo o en tu mente.', ex: 'Si algo me hace sentir incómodo, se lo digo a alguien de confianza.', fill: 'Si un toque me hace sentir ___, puedo decir que no y contarlo.' },
    bully: { w: 'acosador', def: 'Un acosador es alguien que es malo con otros una y otra vez.', ex: 'Contarle a un adulto sobre un acosador no es chismear.', fill: 'El ___ me quita mi almuerzo, así que se lo digo a la maestra.' },
    trust: { w: 'confianza', def: 'Tenerle confianza a alguien significa creer que será honesto y te cuidará.', ex: 'La confianza se gana con el tiempo.', fill: 'Le tengo ___ a mi abuela. Le puedo contar todo.' },
    evacuate: { w: 'evacuar', def: 'Evacuar significa salir rápido de un lugar por un peligro.', ex: 'En el simulacro practicamos cómo evacuar.', fill: 'Cuando suena la alarma de incendio, tenemos que ___ el edificio.' },
    hazard: { w: 'riesgo', def: 'Un riesgo es algo que puede causar daño.', ex: 'Los juguetes en la escalera son un riesgo.', fill: 'Un piso mojado es un ___. Alguien se puede resbalar.' },
    shelter: { w: 'refugio', def: 'Un refugio es un lugar seguro para quedarse durante un peligro.', ex: 'En un tornado, vamos a nuestro refugio.', fill: 'Durante la tormenta, nos quedamos en el ___ del sótano.' },
    contact: { w: 'contacto de emergencia', def: 'Un contacto de emergencia es una persona a quien llamar si algo sale mal.', ex: 'El número de mi contacto de emergencia está en una tarjeta en mi mochila.', fill: 'Mi abuela es mi ___. Su número está en mi tarjeta.' },
    route: { w: 'ruta', def: 'Una ruta es el camino que tomas para llegar a un lugar.', ex: 'Conozco una ruta segura a la escuela.', fill: 'Tomo la misma ___ segura a la escuela todos los días.' },
    advocate: { w: 'defenderme', def: 'Defenderme significa decir lo que necesito.', ex: 'Pedir audífonos en un salón ruidoso es una forma de defenderme.', fill: 'Puedo ___ con palabras: “Necesito un descanso.”' },
  },
};
