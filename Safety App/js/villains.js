/* ==========================================================================
   Safety Superheroes — lesson villains
   One goofy villain per lesson. Each villain is an UNSAFE HABIT (rushing,
   hiding an ouch, clicking everything...), never a kind of person, so the
   lessons' message ("most people are fine; watch for unsafe behavior")
   stays intact. Drawn as original SVG, silly not scary: big eyes, rosy
   cheeks, a snaggle-tooth grin. Battles live in villain.html.
   ========================================================================== */

const VILLAIN_INK = '#2b2b2b';

/* shape: blob | cloud | box | drop | bean
   extras: mask, mustache, horns, antenna, hat, smoke, bolt, rain, wheels,
           cape, crown, goggles, screen, spikes, bubble, coins, germs */
const VILLAINS = {
  'stranger-safety': { shape: 'bean', color: '#a77bdc', extras: ['mask', 'mustache', 'hat'],
    en: { name: 'Sneaky Sneak-Off', taunt: 'Someone offers a treat or a puppy? Just go along! Don\'t check with your grown-up first! Hee-hee!', reform: 'Okay, okay! You always check with your grown-up first. You saw right through my sneaky plan!' },
    es: { name: 'Escapadito', taunt: '¿Alguien te ofrece un dulce o un perrito? ¡Ve con él! ¡No le preguntes primero a tu adulto! ¡Ji, ji!', reform: '¡Está bien, está bien! Siempre le preguntas primero a tu adulto. ¡Descubriste mi plan!' } },
  'street-safety': { shape: 'drop', color: '#ff7a59', extras: ['goggles', 'cape'],
    en: { name: 'Captain Rush', taunt: 'Stop? Look? Wait for the light? Boring! Zoom across the street with me!', reform: 'Whoa... stopping and looking both ways really is the fastest way to stay safe. I\'ll wait for the walk sign!' },
    es: { name: 'Capitán Prisa', taunt: '¿Parar? ¿Mirar? ¿Esperar la luz? ¡Qué aburrido! ¡Cruza la calle volando conmigo!', reform: 'Vaya... parar y mirar a los dos lados sí es la mejor forma de estar seguro. ¡Esperaré la señal para cruzar!' } },
  'lost-safety': { shape: 'cloud', color: '#7cc6ff', extras: ['antenna'],
    en: { name: 'Wander Wobble', taunt: 'Lost? Just keep wandering around! Don\'t ask anyone for help!', reform: 'Huh! Staying put and asking a worker for help gets you back to your family. Smart hero!' },
    es: { name: 'Paseo Perdido', taunt: '¿Perdido? ¡Sigue caminando por ahí! ¡No le pidas ayuda a nadie!', reform: '¡Vaya! Quedarse quieto y pedirle ayuda a un trabajador te lleva de vuelta con tu familia. ¡Qué listo!' } },
  'emergency-safety': { shape: 'box', color: '#9fd8ff', extras: ['spikes'],
    en: { name: 'Freezy', taunt: 'Brrr! When something goes wrong, just freeze and do nothing! Don\'t call anyone!', reform: 'You melted my freeze! Calling 911 and saying where you are is the hero move.' },
    es: { name: 'Congelito', taunt: '¡Brrr! Cuando algo sale mal, ¡quédate congelado y no hagas nada! ¡No llames a nadie!', reform: '¡Derretiste mi hielo! Llamar al 911 y decir dónde estás es lo que hace un héroe.' } },
  'fire-safety': { shape: 'cloud', color: '#9aa0a6', extras: ['smoke'],
    en: { name: 'Smokey Smog', taunt: 'Puff puff! Stay inside and grab all your toys first. Smoke is no big deal!', reform: 'Cough! You got low and went out fast. I can\'t catch a hero like you!' },
    es: { name: 'Humo Humito', taunt: '¡Puf, puf! Quédate adentro y agarra todos tus juguetes primero. ¡El humo no es nada!', reform: '¡Cof! Te agachaste y saliste rápido. ¡No puedo atrapar a un héroe como tú!' } },
  'earthquake-safety': { shape: 'box', color: '#c8a26b', extras: ['bolt'],
    en: { name: 'Rumble Grumble', taunt: 'RUMBLE! Run around and stand next to the windows when I shake things up!', reform: 'Drop, cover, and hold on... you didn\'t even wobble! I give up!' },
    es: { name: 'Gruñón Temblón', taunt: '¡RUMMM! ¡Corre por todos lados y párate junto a las ventanas cuando yo sacuda todo!', reform: 'Agáchate, cúbrete y sujétate... ¡ni siquiera te tambaleaste! ¡Me rindo!' } },
  'rainyweather-safety': { shape: 'cloud', color: '#6f8fb3', extras: ['rain'],
    en: { name: 'Splashzilla', taunt: 'Ooh, a flooded street! Jump right in and splash! And play outside in the thunder!', reform: 'Fine! Flood water is not for playing, and thunder means go inside. You win, hero!' },
    es: { name: 'Chapotezilla', taunt: '¡Uy, una calle inundada! ¡Salta y chapotea! ¡Y juega afuera con los truenos!', reform: '¡Bueno! El agua de inundación no es para jugar y los truenos significan ir adentro. ¡Ganaste!' } },
  'selfadvocacy-safety': { shape: 'bean', color: '#f4a6c8', extras: ['mask'],
    en: { name: 'Señor Shush', taunt: 'Shhh! Don\'t tell anyone what you need. Just stay quiet, even when it\'s hard!', reform: 'Wow, you used your words! Asking for help or a break is a super power.' },
    es: { name: 'Señor Shhh', taunt: '¡Shhh! No le digas a nadie lo que necesitas. ¡Quédate callado aunque sea difícil!', reform: '¡Guau, usaste tus palabras! Pedir ayuda o un descanso es un súper poder.' } },
  'body-boundaries-safety': { shape: 'blob', color: '#ffb35c', extras: ['bubble'],
    en: { name: 'Bubble Popper', taunt: 'POP! I don\'t care about anybody\'s space bubble. Pop, pop, pop!', reform: 'You said "No, stop!" loud and clear. Everyone\'s body bubble is safe from me now.' },
    es: { name: 'Revientaburbujas', taunt: '¡PUM! No me importa el espacio de nadie. ¡Pum, pum, pum!', reform: 'Dijiste "¡No, para!" bien fuerte. Ahora la burbuja de todos está a salvo de mí.' } },
  'secrets-safety': { shape: 'drop', color: '#8e7cc3', extras: ['mask'],
    en: { name: 'Whisper Wisp', taunt: 'Psst... keep this yucky secret, and don\'t tell your family. Ever!', reform: 'You told a trusted grown-up! Yucky secrets lose all their power when you tell.' },
    es: { name: 'Susurro Secreto', taunt: 'Psst... guarda este secreto feo y no se lo digas a tu familia. ¡Nunca!', reform: '¡Se lo dijiste a un adulto de confianza! Los secretos feos pierden su poder cuando los cuentas.' } },
  'reporting-safety': { shape: 'blob', color: '#b5b5b5', extras: ['antenna'],
    en: { name: 'Shrug-o-Tron', taunt: 'Beep boop. Something wrong? Shrug! Don\'t bother telling anyone. Beep!', reform: 'Error! Error! You kept telling until someone helped. That is not tattling, that is heroic!' },
    es: { name: 'Encogetrón', taunt: 'Bip bup. ¿Algo anda mal? ¡Encógete de hombros! No se lo digas a nadie. ¡Bip!', reform: '¡Error! ¡Error! Seguiste contando hasta que alguien te ayudó. ¡Eso no es chismear, es ser un héroe!' } },
  'awareness-safety': { shape: 'bean', color: '#7ad1a8', extras: [],
    en: { name: 'Daydream Drifter', taunt: 'Keep your eyes glued to the screen! Who needs to look where they\'re going?', reform: 'You looked up and noticed everything around you. I can\'t sneak up on you!' },
    es: { name: 'Soñador Distraído', taunt: '¡Mantén los ojos pegados a la pantalla! ¿Quién necesita mirar por dónde camina?', reform: 'Levantaste la vista y notaste todo a tu alrededor. ¡No te puedo sorprender!' } },
  'plan-safety': { shape: 'cloud', color: '#f2c94c', extras: ['spikes'],
    en: { name: 'Scramble', taunt: 'Plans are silly! When something happens, everybody just run in different directions!', reform: 'A meeting spot and a practiced plan? I can\'t scramble a team that ready!' },
    es: { name: 'Revoltijo', taunt: '¡Los planes son tontos! Cuando pase algo, ¡que todos corran para lados distintos!', reform: '¿Un lugar de reunión y un plan practicado? ¡No puedo revolver a un equipo tan preparado!' } },
  'privacy-safety': { shape: 'blob', color: '#6fcf97', extras: ['goggles', 'mustache'],
    en: { name: 'Snoopsnatch', taunt: 'Ooh, tell me your address and your password! I\'ll keep them... for me!', reform: 'You kept your private things private! There\'s nothing for me to snatch.' },
    es: { name: 'Fisgón', taunt: '¡Uy, dime tu dirección y tu contraseña! Yo las guardo... ¡para mí!', reform: '¡Mantuviste en privado tus cosas privadas! No hay nada que pueda robar.' } },
  'bullying-safety': { shape: 'box', color: '#e57373', extras: ['horns'],
    en: { name: 'Grumblegrump', taunt: 'Being mean is fun! And nobody will stand up for anybody. Grumble grumble!', reform: 'You walked away, told a grown-up, and stood by a friend. Being kind wins!' },
    es: { name: 'Gruñegruñe', taunt: '¡Ser malo es divertido! Y nadie va a defender a nadie. ¡Grr, grr!', reform: 'Te alejaste, le dijiste a un adulto y acompañaste a un amigo. ¡La bondad gana!' } },
  'online-safety': { shape: 'box', color: '#56ccf2', extras: ['antenna'],
    en: { name: 'Captain Click', taunt: 'Click every link! Answer every message! Meet your online pals in person!', reform: 'You closed it and told a grown-up. My clicks can\'t trick you!' },
    es: { name: 'Capitán Clic', taunt: '¡Haz clic en todo! ¡Contesta todos los mensajes! ¡Conoce en persona a tus amigos de internet!', reform: 'Lo cerraste y se lo dijiste a un adulto. ¡Mis clics no te pueden engañar!' } },
  'cyberbullying-safety': { shape: 'blob', color: '#bb6bd9', extras: ['antenna', 'horns'],
    en: { name: 'Troll-o-Bot', taunt: 'Bzzt! Send mean messages back! Make it bigger! Bzzt bzzt!', reform: 'You didn\'t answer, you saved it, and you blocked me. My batteries are empty!' },
    es: { name: 'Trolebot', taunt: '¡Bzzt! ¡Contesta con mensajes groseros! ¡Hazlo más grande! ¡Bzzt, bzzt!', reform: 'No contestaste, lo guardaste y me bloqueaste. ¡Se me acabaron las pilas!' } },
  'citizenship-safety': { shape: 'bean', color: '#a3b18a', extras: ['germs'],
    en: { name: 'Litterbug', taunt: 'Toss trash anywhere! Cut in line! Who cares about helping out?', reform: 'You helped your community and treated people kindly. Okay, I\'ll use the trash can!' },
    es: { name: 'Bicho Basurero', taunt: '¡Tira la basura donde sea! ¡Cuélate en la fila! ¿A quién le importa ayudar?', reform: 'Ayudaste a tu comunidad y trataste bien a la gente. ¡Está bien, usaré el bote de basura!' } },
  'rights-safety': { shape: 'box', color: '#8d99ae', extras: ['crown'],
    en: { name: 'The No-Way Wall', taunt: 'You can\'t ask for help! You can\'t ask for what you need! No way!', reform: 'You know your rights! You can be safe and ask for help. I\'m crumbling!' },
    es: { name: 'El Muro del No', taunt: '¡No puedes pedir ayuda! ¡No puedes pedir lo que necesitas! ¡De ninguna manera!', reform: '¡Conoces tus derechos! Puedes estar seguro y pedir ayuda. ¡Me estoy derrumbando!' } },
  'water-safety': { shape: 'drop', color: '#4fb3d9', extras: ['goggles'],
    en: { name: 'Captain Cannonball', taunt: 'Jump in the deep end all alone! Life jackets? Nah! SPLASH!', reform: 'Swimming with a grown-up and wearing a life jacket... that\'s how real water heroes do it!' },
    es: { name: 'Capitán Clavado', taunt: '¡Salta solito en lo hondo! ¿Chaleco salvavidas? ¡Nah! ¡SPLASH!', reform: 'Nadar con un adulto y usar chaleco salvavidas... ¡así lo hacen los verdaderos héroes del agua!' } },
  'home-safety': { shape: 'blob', color: '#f7a8a8', extras: ['mask'],
    en: { name: 'Candy Copycat', taunt: 'Hee-hee! This medicine looks just like candy. Try some! And open the door for anyone!', reform: 'Medicine only from a grown-up, and no opening the door to people you don\'t know. You\'re home-safe!' },
    es: { name: 'Dulce Impostor', taunt: '¡Ji, ji! Esta medicina parece un dulce. ¡Pruébala! ¡Y ábrele la puerta a cualquiera!', reform: 'La medicina solo de un adulto, y no abrirle la puerta a quien no conoces. ¡Tu casa está segura!' } },
  'bike-safety': { shape: 'box', color: '#f2994a', extras: ['wheels', 'goggles'],
    en: { name: 'Wobble Wheelie', taunt: 'Helmets are for babies! Ride on the wrong side and don\'t look!', reform: 'Helmet on, right side of the road, eyes up. I can\'t wobble a hero like you!' },
    es: { name: 'Rueda Loca', taunt: '¡Los cascos son para bebés! ¡Anda por el lado equivocado y no mires!', reform: 'Casco puesto, por la derecha y mirando. ¡No puedo tambalear a un héroe como tú!' } },
  'peer-pressure-safety': { shape: 'bean', color: '#ffa94d', extras: ['horns', 'mustache'],
    en: { name: 'Double-Dare', taunt: 'Everybody\'s doing it! I double-dare you to do the unsafe thing!', reform: 'You said "No thanks" and walked away. Real friends don\'t dare you into danger!' },
    es: { name: 'Doble Reto', taunt: '¡Todos lo hacen! ¡Te reto dos veces a hacer lo peligroso!', reform: 'Dijiste "No, gracias" y te alejaste. ¡Los verdaderos amigos no te retan a hacer cosas peligrosas!' } },
  'elopement-safety': { shape: 'drop', color: '#f6c344', extras: ['cape'],
    en: { name: 'Zoom Zoom', taunt: 'Run off without telling anyone! Zoom zoom zoom!', reform: 'You stopped, squeezed your hands, and told a grown-up where you were going. Zoom... over.' },
    es: { name: 'Zum Zum', taunt: '¡Sal corriendo sin decirle a nadie! ¡Zum, zum, zum!', reform: 'Paraste, apretaste tus manos y le dijiste a un adulto adónde ibas. Zum... se acabó.' } },
  'safehelper-safety': { shape: 'cloud', color: '#c39bd3', extras: ['hat'],
    en: { name: 'The Mixer-Upper', taunt: 'Who\'s a safe helper? I\'ll mix you up so you can\'t tell!', reform: 'Uniforms, name tags, workers at the counter... you know exactly who can help!' },
    es: { name: 'El Revoltoso', taunt: '¿Quién es un ayudante seguro? ¡Te voy a confundir para que no sepas!', reform: 'Uniformes, gafetes, trabajadores en el mostrador... ¡sabes muy bien quién puede ayudar!' } },
  'medical-safety': { shape: 'blob', color: '#9be7c4', extras: ['mask'],
    en: { name: 'Hide-the-Ouch', taunt: 'Shh, don\'t tell anyone when something hurts! Just hide it!', reform: 'You told a grown-up about your ouch and asked questions. Doctors and heroes make a great team!' },
    es: { name: 'Esconde-Ayes', taunt: '¡Shh, no le digas a nadie cuando algo te duela! ¡Escóndelo!', reform: 'Le dijiste a un adulto lo que te dolía e hiciste preguntas. ¡Los médicos y los héroes hacen un gran equipo!' } },
  'selfregulation-safety': { shape: 'cloud', color: '#ff8a80', extras: ['smoke'],
    en: { name: 'Fizzy Fume', taunt: 'Fizz fizz! Let those big feelings bubble over! Don\'t take a breath!', reform: 'Smell the flower, blow out the candle... you calmed my fizz right down. Ahhh.' },
    es: { name: 'Burbuja Furiosa', taunt: '¡Fiz, fiz! ¡Deja que esas emociones grandes se desborden! ¡No respires!', reform: 'Huele la flor, sopla la vela... calmaste todas mis burbujas. Ahhh.' } },
  'firstaid-safety': { shape: 'blob', color: '#9ccc65', extras: ['germs'],
    en: { name: 'Grimy Germ', taunt: 'Don\'t wash that cut! Leave it dirty! Germs love a party!', reform: 'Washed and bandaged! You know your first aid, hero. No germ party today.' },
    es: { name: 'Germen Mugroso', taunt: '¡No laves esa cortada! ¡Déjala sucia! ¡A los gérmenes les encanta la fiesta!', reform: '¡Lavada y con curita! Sabes primeros auxilios, héroe. Hoy no hay fiesta de gérmenes.' } },
  'seizure-safety': { shape: 'bean', color: '#ffcc80', extras: ['spikes'],
    en: { name: 'Grabby Hands', taunt: 'If someone has a seizure, hold them down tight! And walk away!', reform: 'You moved things away, stayed with them, and got a grown-up. That\'s exactly how to help!' },
    es: { name: 'Manos Agarronas', taunt: 'Si alguien tiene una convulsión, ¡sujétalo fuerte! ¡Y vete!', reform: 'Apartaste las cosas, te quedaste con la persona y buscaste a un adulto. ¡Así se ayuda!' } },
  'money-safety': { shape: 'box', color: '#6fcf97', extras: ['coins', 'mustache'],
    en: { name: 'Scam Spam', taunt: 'You won a prize! Just send me your bank card and PIN! Hurry!', reform: 'You never share your PIN and you checked with a grown-up. My scams don\'t work on you!' },
    es: { name: 'Estafa Spam', taunt: '¡Ganaste un premio! ¡Solo mándame tu tarjeta del banco y tu PIN! ¡Rápido!', reform: 'Nunca compartes tu PIN y lo consultaste con un adulto. ¡Mis estafas no funcionan contigo!' } },
  'dating-safety': { shape: 'drop', color: '#f48fb1', extras: ['smoke'],
    en: { name: 'Pressure Cooker', taunt: 'Ssss! Keep pushing even when someone says no! Don\'t tell anyone where you are!', reform: 'Respect means listening to "no", and you told a trusted grown-up your plans. My steam is gone!' },
    es: { name: 'Olla de Presión', taunt: '¡Sss! ¡Sigue insistiendo aunque te digan que no! ¡No le digas a nadie dónde estás!', reform: 'Respetar es escuchar el "no", y le contaste tus planes a un adulto de confianza. ¡Se me acabó el vapor!' } },
};

function villainFor(topicId){ return VILLAINS[topicId] || null; }
function villainData(topicId, lang){
  const v = VILLAINS[topicId];
  return v ? (v[lang] || v.en) : null;
}

function villainShapePath(shape){
  switch (shape){
    case 'cloud': return 'M30 104 C12 104 8 82 22 74 C14 56 32 40 46 47 C50 28 78 26 84 46 C100 40 114 58 104 74 C116 84 108 104 92 104 Z';
    case 'box': return 'M34 26 H86 Q102 26 102 42 V92 Q102 106 86 106 H34 Q18 106 18 92 V42 Q18 26 34 26 Z';
    case 'drop': return 'M60 12 C78 38 102 54 102 78 C102 98 84 110 60 110 C36 110 18 98 18 78 C18 54 42 38 60 12 Z';
    case 'bean': return 'M60 16 C88 16 98 40 98 64 C98 94 82 110 60 110 C38 110 22 94 22 64 C22 40 32 16 60 16 Z';
    default: return 'M60 20 C90 20 106 42 106 68 C106 94 88 108 60 108 C32 108 14 94 14 68 C14 42 30 20 60 20 Z';
  }
}

function villainExtrasSvg(v, behind){
  const ex = v.extras || [];
  const ink = VILLAIN_INK;
  let s = '';
  if (behind){
    if (ex.includes('cape')) s += `<path d="M30 60 C18 82 14 100 8 114 L112 114 C106 100 102 82 90 60 Z" fill="#5b3fa0" stroke="${ink}" stroke-width="2.4" stroke-linejoin="round"/>`;
    if (ex.includes('smoke')) s += `<g fill="#cfd3d8" stroke="${ink}" stroke-width="2"><circle cx="38" cy="16" r="9"/><circle cx="52" cy="9" r="7"/><circle cx="86" cy="14" r="8"/></g>`;
    if (ex.includes('bubble')) s += `<circle cx="60" cy="64" r="58" fill="rgba(160,220,255,.18)" stroke="#7cc6ff" stroke-width="2.5" stroke-dasharray="6 6"/>`;
    if (ex.includes('rain')) s += `<g stroke="#4f8fd6" stroke-width="3" stroke-linecap="round"><path d="M30 112 l-3 8M50 114 l-3 8M70 114 l-3 8M90 112 l-3 8"/></g>`;
    return s;
  }
  if (ex.includes('horns')) s += `<path d="M38 30 Q30 14 40 8 Q44 20 50 26 Z M82 30 Q90 14 80 8 Q76 20 70 26 Z" fill="#ffd23f" stroke="${ink}" stroke-width="2.2" stroke-linejoin="round"/>`;
  if (ex.includes('antenna')) s += `<path d="M60 22 V8" stroke="${ink}" stroke-width="2.6"/><circle cx="60" cy="7" r="5" fill="#ffd23f" stroke="${ink}" stroke-width="2.2"/>`;
  if (ex.includes('hat')) s += `<rect x="40" y="2" width="40" height="22" rx="3" fill="#333a4d" stroke="${ink}" stroke-width="2.2"/><rect x="30" y="22" width="60" height="7" rx="3.5" fill="#333a4d" stroke="${ink}" stroke-width="2.2"/><rect x="40" y="16" width="40" height="5" fill="#e05a5a"/>`;
  if (ex.includes('crown')) s += `<path d="M38 28 L40 10 L50 20 L60 6 L70 20 L80 10 L82 28 Z" fill="#ffd23f" stroke="${ink}" stroke-width="2.2" stroke-linejoin="round"/>`;
  if (ex.includes('bolt')) s += `<path d="M66 2 L52 22 H62 L54 38 L74 16 H64 Z" fill="#ffd23f" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>`;
  if (ex.includes('spikes')) s += `<path d="M32 34 L36 22 L44 30 L52 18 L60 28 L68 18 L76 30 L84 22 L88 34" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`;
  if (ex.includes('wheels')) s += `<g stroke="${ink}" stroke-width="2.4"><circle cx="36" cy="108" r="10" fill="#444"/><circle cx="84" cy="108" r="10" fill="#444"/><circle cx="36" cy="108" r="3" fill="#ddd"/><circle cx="84" cy="108" r="3" fill="#ddd"/></g>`;
  if (ex.includes('germs')) s += `<g fill="#b5d96b" stroke="${ink}" stroke-width="1.8"><circle cx="14" cy="40" r="6"/><circle cx="108" cy="34" r="5"/><circle cx="104" cy="96" r="4.5"/></g>`;
  if (ex.includes('coins')) s += `<g fill="#ffd23f" stroke="${ink}" stroke-width="1.8"><circle cx="14" cy="96" r="7"/><circle cx="106" cy="92" r="7"/></g><g fill="${ink}" font-size="8" font-weight="700" text-anchor="middle" font-family="sans-serif"><text x="14" y="99">$</text><text x="106" y="95">$</text></g>`;
  if (false && ex.includes('screen')) s += `<rect x="70" y="82" width="34" height="24" rx="4" fill="#2f3b55" stroke="${ink}" stroke-width="2.2"/><rect x="74" y="86" width="26" height="16" rx="2" fill="#7fe0ff"/>`;
  return s;
}

/* Per-villain character: eye style, mouth, body pattern, and a prop that
   shows the habit. Gives each villain its own personality instead of one
   template with different colors. */
const VILLAIN_STYLE = {
  'stranger-safety':        { eyes: 'shifty', mouth: 'smirk', pattern: 'none',    prop: 'candy' },
  'street-safety':          { eyes: 'pair',   mouth: 'laugh', pattern: 'none',    prop: 'speed' },
  'lost-safety':            { eyes: 'sleepy', mouth: 'wavy',  pattern: 'spots',   prop: 'map' },
  'emergency-safety':       { eyes: 'pair',   mouth: 'o',     pattern: 'spots',   prop: 'none' },
  'fire-safety':            { eyes: 'sleepy', mouth: 'smirk', pattern: 'none',    prop: 'none' },
  'earthquake-safety':      { eyes: 'three',  mouth: 'fangs', pattern: 'stripes', prop: 'none' },
  'rainyweather-safety':    { eyes: 'one',    mouth: 'laugh', pattern: 'none',    prop: 'none' },
  'selfadvocacy-safety':    { eyes: 'pair',   mouth: 'o',     pattern: 'none',    prop: 'finger' },
  'body-boundaries-safety': { eyes: 'pair',   mouth: 'laugh', pattern: 'spots',   prop: 'none' },
  'secrets-safety':         { eyes: 'shifty', mouth: 'smirk', pattern: 'none',    prop: 'finger' },
  'reporting-safety':       { eyes: 'sleepy', mouth: 'wavy',  pattern: 'stripes', prop: 'none' },
  'awareness-safety':       { eyes: 'sleepy', mouth: 'o',     pattern: 'none',    prop: 'screen' },
  'plan-safety':            { eyes: 'three',  mouth: 'wavy',  pattern: 'spots',   prop: 'none' },
  'privacy-safety':         { eyes: 'one',    mouth: 'grin',  pattern: 'none',    prop: 'magnifier' },
  'bullying-safety':        { eyes: 'pair',   mouth: 'fangs', pattern: 'stripes', prop: 'none' },
  'online-safety':          { eyes: 'pair',   mouth: 'laugh', pattern: 'none',    prop: 'cursor' },
  'cyberbullying-safety':   { eyes: 'three',  mouth: 'fangs', pattern: 'stripes', prop: 'none' },
  'citizenship-safety':     { eyes: 'one',    mouth: 'grin',  pattern: 'spots',   prop: 'peel' },
  'rights-safety':          { eyes: 'pair',   mouth: 'smirk', pattern: 'bricks',  prop: 'none' },
  'water-safety':           { eyes: 'pair',   mouth: 'laugh', pattern: 'stripes', prop: 'none' },
  'home-safety':            { eyes: 'shifty', mouth: 'grin',  pattern: 'none',    prop: 'candy' },
  'bike-safety':            { eyes: 'pair',   mouth: 'wavy',  pattern: 'none',    prop: 'none' },
  'peer-pressure-safety':   { eyes: 'shifty', mouth: 'smirk', pattern: 'none',    prop: 'none' },
  'elopement-safety':       { eyes: 'pair',   mouth: 'laugh', pattern: 'none',    prop: 'speed' },
  'safehelper-safety':      { eyes: 'three',  mouth: 'wavy',  pattern: 'spots',   prop: 'none' },
  'medical-safety':         { eyes: 'shifty', mouth: 'wavy',  pattern: 'none',    prop: 'bandage' },
  'selfregulation-safety':  { eyes: 'pair',   mouth: 'fangs', pattern: 'none',    prop: 'fizz' },
  'firstaid-safety':        { eyes: 'one',    mouth: 'fangs', pattern: 'spots',   prop: 'none' },
  'seizure-safety':         { eyes: 'pair',   mouth: 'grin',  pattern: 'none',    prop: 'none' },
  'money-safety':           { eyes: 'shifty', mouth: 'smirk', pattern: 'none',    prop: 'envelope' },
  'dating-safety':          { eyes: 'pair',   mouth: 'o',     pattern: 'none',    prop: 'none' },
};

let villainSvgSeq = 0;

function villainShade(hex, amt){
  const n = parseInt(hex.slice(1), 16);
  const f = c => Math.max(0, Math.min(255, Math.round(c * (1 - amt))));
  return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(x => x.toString(16).padStart(2, '0')).join('');
}

function villainEyesSvg(style, v, defeated){
  const ink = VILLAIN_INK;
  const spiral = (cx, cy, r) => `<path d="M${cx} ${cy} m-${r} 0 a${r} ${r} 0 1 0 ${2 * r} 0 a${r * 0.62} ${r * 0.62} 0 1 0 -${r * 1.24} 0 a${r * 0.25} ${r * 0.25} 0 1 0 ${r * 0.5} 0" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/>`;
  const lid = villainShade(v.color, 0.12);
  switch (style.eyes){
    case 'one':
      return defeated ? spiral(60, 52, 11)
        : `<ellipse cx="60" cy="52" rx="17" ry="18" fill="#fff" stroke="${ink}" stroke-width="2.6"/><circle cx="64" cy="55" r="8" fill="${ink}"/><circle cx="66.5" cy="52" r="2.4" fill="#fff"/>`
          + `<path d="M42 30 Q60 24 78 34" stroke="${ink}" stroke-width="3.4" stroke-linecap="round"/>`;
    case 'three':
      return defeated ? spiral(40, 58, 6) + spiral(60, 48, 6) + spiral(80, 58, 6)
        : [[40, 58], [60, 47], [80, 58]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8.5" fill="#fff" stroke="${ink}" stroke-width="2.3"/><circle cx="${x + 2}" cy="${y + 1.5}" r="4" fill="${ink}"/><circle cx="${x + 3}" cy="${y}" r="1.2" fill="#fff"/>`).join('')
          + `<path d="M31 46 L48 50 M89 46 L72 50" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
    case 'shifty':
      return defeated ? spiral(44, 56, 8) + spiral(76, 56, 8)
        : `<ellipse cx="44" cy="56" rx="11" ry="9" fill="#fff" stroke="${ink}" stroke-width="2.4"/><ellipse cx="76" cy="56" rx="11" ry="9" fill="#fff" stroke="${ink}" stroke-width="2.4"/>`
          + `<circle cx="50" cy="58" r="4.5" fill="${ink}"/><circle cx="82" cy="58" r="4.5" fill="${ink}"/>`
          + `<path d="M32 52 Q44 46 56 51 L56 47 Q44 41 32 48 Z M64 51 Q76 46 88 52 L88 48 Q76 41 64 47 Z" fill="${lid}" stroke="${ink}" stroke-width="2.2" stroke-linejoin="round"/>`
          + `<path d="M33 40 Q44 36 54 42 M66 42 Q76 36 87 40" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
    case 'sleepy':
      return defeated ? spiral(44, 56, 8) + spiral(76, 56, 8)
        : `<ellipse cx="44" cy="56" rx="11" ry="11" fill="#fff" stroke="${ink}" stroke-width="2.4"/><ellipse cx="76" cy="56" rx="11" ry="11" fill="#fff" stroke="${ink}" stroke-width="2.4"/>`
          + `<circle cx="45" cy="61" r="4.5" fill="${ink}"/><circle cx="77" cy="61" r="4.5" fill="${ink}"/>`
          + `<path d="M33 56 A11 11 0 0 1 55 56 Z M65 56 A11 11 0 0 1 87 56 Z" fill="${lid}" stroke="${ink}" stroke-width="2.3" stroke-linejoin="round"/>`;
    default: // pair
      return defeated ? spiral(44, 55, 8) + spiral(76, 55, 8)
        : `<ellipse cx="44" cy="55" rx="11" ry="12" fill="#fff" stroke="${ink}" stroke-width="2.4"/><ellipse cx="76" cy="55" rx="10" ry="11" fill="#fff" stroke="${ink}" stroke-width="2.4"/>`
          + `<circle cx="47" cy="57" r="5" fill="${ink}"/><circle cx="79" cy="57" r="4.6" fill="${ink}"/>`
          + `<circle cx="48.6" cy="54.6" r="1.6" fill="#fff"/><circle cx="80.4" cy="54.8" r="1.5" fill="#fff"/>`
          + `<path d="M31 41 Q42 40 54 46 M88 39 Q78 39 66 46" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`;
  }
}

function villainMouthSvg(style, defeated){
  const ink = VILLAIN_INK;
  if (defeated) return `<path d="M46 85 Q52 79 60 85 Q68 91 74 85" fill="none" stroke="${ink}" stroke-width="2.8" stroke-linecap="round"/>`;
  switch (style.mouth){
    case 'smirk':
      return `<path d="M42 80 Q58 92 78 76" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><path d="M76 72 Q80 76 78 80" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`;
    case 'fangs':
      return `<path d="M40 77 Q60 95 80 77 Q60 82 40 77 Z" fill="#7a2335" stroke="${ink}" stroke-width="2.4" stroke-linejoin="round"/>`
        + `<path d="M47 79 l3 6 l3 -5 Z M67 79 l3 5 l3 -6 Z" fill="#fff" stroke="${ink}" stroke-width="1.3" stroke-linejoin="round"/>`;
    case 'laugh':
      return `<path d="M40 75 Q60 106 80 75 Z" fill="#7a2335" stroke="${ink}" stroke-width="2.4" stroke-linejoin="round"/><path d="M50 90 Q60 82 70 90 Q60 97 50 90 Z" fill="#ff8fa3"/><path d="M44 77 H76" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>`;
    case 'wavy':
      return `<path d="M41 82 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4" fill="none" stroke="${ink}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'o':
      return `<ellipse cx="60" cy="83" rx="6.5" ry="7.5" fill="#7a2335" stroke="${ink}" stroke-width="2.4"/>`;
    default: // grin with a snaggle tooth
      return `<path d="M40 78 Q60 96 80 78 Z" fill="#7a2335" stroke="${ink}" stroke-width="2.4" stroke-linejoin="round"/><path d="M52 81 h7 v6 h-7 z" fill="#fff" stroke="${ink}" stroke-width="1.4"/>`;
  }
}

function villainPatternSvg(style, v){
  const d = villainShade(v.color, 0.22);
  switch (style.pattern){
    case 'spots': return `<g fill="${d}" opacity=".55"><circle cx="30" cy="44" r="6"/><circle cx="92" cy="82" r="7"/><circle cx="84" cy="34" r="4"/><circle cx="26" cy="92" r="4.5"/></g>`;
    case 'stripes': return `<g stroke="${d}" stroke-width="7" opacity=".45"><path d="M0 34 H120 M0 98 H120"/></g>`;
    case 'bricks': return `<g stroke="${d}" stroke-width="2.4" opacity=".7" fill="none"><path d="M10 44 H110 M10 70 H110 M10 96 H110 M40 26 V44 M80 26 V44 M24 44 V70 M60 44 V70 M96 44 V70 M40 70 V96 M80 70 V96"/></g>`;
    default: return '';
  }
}

function villainPropSvg(style, behind){
  const ink = VILLAIN_INK;
  const p = style.prop;
  if (behind){
    if (p === 'speed') return `<g stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".9"><path d="M2 50 H14 M0 66 H12 M4 82 H14"/></g>`;
    if (p === 'fizz') return `<g fill="#fff" stroke="${ink}" stroke-width="1.6"><circle cx="30" cy="10" r="5"/><circle cx="44" cy="4" r="3.5"/><circle cx="82" cy="8" r="4.5"/><circle cx="94" cy="18" r="3"/></g>`;
    return '';
  }
  switch (p){
    case 'candy': return `<g transform="translate(104 44) rotate(-20)"><path d="M-12 0 l-6 -6 v12 Z M12 0 l6 -6 v12 Z" fill="#ff7aa8" stroke="${ink}" stroke-width="1.8" stroke-linejoin="round"/><ellipse rx="12" ry="8" fill="#ff7aa8" stroke="${ink}" stroke-width="2"/><path d="M-6 -6 Q0 0 -6 6 M2 -7 Q8 0 2 7" stroke="#fff" stroke-width="2" fill="none"/></g>`;
    case 'map': return `<g transform="translate(104 42) rotate(12)"><path d="M-14 -10 L-5 -13 L5 -10 L14 -13 V11 L5 14 L-5 11 L-14 14 Z" fill="#fff3c4" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/><path d="M-9 2 Q-2 -6 4 3 T10 -4" stroke="#e05a5a" stroke-width="2" fill="none" stroke-dasharray="3 2"/><text x="2" y="10" font-size="9" font-weight="800" fill="${ink}" font-family="sans-serif">?</text></g>`;
    case 'finger': return `<rect x="56" y="70" width="8" height="22" rx="4" fill="#fff" stroke="${ink}" stroke-width="2"/>`;
    case 'screen': return `<g transform="translate(104 46) rotate(-8)"><rect x="-13" y="-18" width="26" height="36" rx="5" fill="#2f3b55" stroke="${ink}" stroke-width="2.2"/><rect x="-9" y="-13" width="18" height="24" rx="2" fill="#7fe0ff"/></g>`;
    case 'magnifier': return `<g transform="translate(104 42)"><path d="M6 8 L16 20" stroke="#8a5a2b" stroke-width="5" stroke-linecap="round"/><circle r="11" fill="rgba(200,240,255,.6)" stroke="${ink}" stroke-width="3"/><path d="M-5 -4 Q-3 -7 1 -7" stroke="#fff" stroke-width="2" fill="none"/></g>`;
    case 'cursor': return `<g transform="translate(98 26) rotate(-10)"><path d="M0 0 L0 24 L6 18 L11 28 L16 26 L11 16 L19 16 Z" fill="#fff" stroke="${ink}" stroke-width="2.2" stroke-linejoin="round"/></g>`;
    case 'peel': return `<g transform="translate(104 46)"><path d="M0 -12 C6 -4 10 4 6 12 C2 6 -2 6 -6 12 C-10 4 -6 -4 0 -12 Z" fill="#ffe066" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/><path d="M0 -12 V-16" stroke="#8a5a2b" stroke-width="3" stroke-linecap="round"/></g>`;
    case 'bandage': return `<g transform="translate(36 40) rotate(-30)"><rect x="-13" y="-5" width="26" height="10" rx="5" fill="#ffd8b0" stroke="${ink}" stroke-width="1.8"/><rect x="-4" y="-5" width="8" height="10" fill="#f6c18f"/></g>`;
    case 'envelope': return `<g transform="translate(104 44) rotate(-12)"><rect x="-14" y="-10" width="28" height="20" rx="3" fill="#fff" stroke="${ink}" stroke-width="2"/><path d="M-14 -9 L0 3 L14 -9" fill="none" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/><circle cx="9" cy="-8" r="5" fill="#e05a5a" stroke="${ink}" stroke-width="1.6"/><text x="9" y="-5.5" font-size="7" font-weight="800" text-anchor="middle" fill="#fff" font-family="sans-serif">!</text></g>`;
    default: return '';
  }
}

function villainSvg(topicId, defeated){
  const v = VILLAINS[topicId];
  if (!v) return '';
  const style = VILLAIN_STYLE[topicId] || { eyes: 'pair', mouth: 'grin', pattern: 'none', prop: 'none' };
  const ink = VILLAIN_INK;
  const ex = v.extras || [];
  const n = ++villainSvgSeq;
  const dark = villainShade(v.color, 0.28);
  const body = villainShapePath(v.shape);
  const handsUp = style.prop && style.prop !== 'none' && !['speed', 'fizz', 'finger', 'bandage'].includes(style.prop);
  // Stubby arms with cartoon gloves; the right one holds the habit prop.
  const arm = (x1, y1, cx, cy, x2, y2) =>
    `<path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" stroke="${ink}" stroke-width="10" stroke-linecap="round" fill="none"/>`
    + `<path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" stroke="${dark}" stroke-width="5.6" stroke-linecap="round" fill="none"/>`
    + `<circle cx="${x2}" cy="${y2}" r="6.5" fill="#fff" stroke="${ink}" stroke-width="2.2"/>`;
  const arms = defeated
    ? arm(22, 74, 8, 82, 8, 96) + arm(98, 74, 112, 82, 112, 96)
    : arm(22, 72, 6, 70, 8, 56) + (handsUp ? arm(98, 70, 108, 64, 104, 54) : arm(98, 72, 114, 76, 112, 90));
  const feet = ex.includes('wheels') ? '' : `<ellipse cx="43" cy="113" rx="11" ry="6.5" fill="${dark}" stroke="${ink}" stroke-width="2.3"/><ellipse cx="77" cy="113" rx="11" ry="6.5" fill="${dark}" stroke="${ink}" stroke-width="2.3"/>`;
  const usePairExtras = style.eyes === 'pair' || style.eyes === 'shifty';
  const mask = ex.includes('mask') && !defeated && usePairExtras
    ? `<path d="M27 52 Q38 42 54 49 Q60 51 66 49 Q82 42 93 52 Q91 64 78 64 Q67 64 60 57 Q53 64 42 64 Q29 64 27 52 Z" fill="${ink}" opacity=".82"/>`
      + `<ellipse cx="44" cy="56" rx="7" ry="7" fill="#fff"/><ellipse cx="76" cy="56" rx="7" ry="7" fill="#fff"/><circle cx="47" cy="57.5" r="3.5" fill="${ink}"/><circle cx="79" cy="57.5" r="3.5" fill="${ink}"/>`
    : '';
  const goggles = ex.includes('goggles') && !defeated
    ? (style.eyes === 'one'
      ? `<circle cx="60" cy="52" r="21" fill="none" stroke="#ffd23f" stroke-width="4.5"/><path d="M20 50 H39 M81 50 H100" stroke="${ink}" stroke-width="3"/>`
      : `<path d="M20 53 H31 M89 53 H100" stroke="${ink}" stroke-width="3"/><circle cx="44" cy="55" r="14" fill="none" stroke="#ffd23f" stroke-width="4"/><circle cx="76" cy="55" r="14" fill="none" stroke="#ffd23f" stroke-width="4"/><path d="M58 55 H62" stroke="#ffd23f" stroke-width="4"/>`)
    : '';
  const mustache = ex.includes('mustache') && !defeated
    ? `<path d="M60 74 C52 68 42 70 38 76 C36 72 32 72 30 74 C36 80 48 80 60 76 C72 80 84 80 90 74 C88 72 84 72 82 76 C78 70 68 68 60 74 Z" fill="#3b2a1e" stroke="${ink}" stroke-width="1.4"/>`
    : '';
  const dizzy = defeated
    ? `<g fill="#ffd23f" stroke="${ink}" stroke-width="1.2"><path d="M30 14 l2 4 4 .5-3 2.6.8 4-3.8-2-3.8 2 .8-4-3-2.6 4-.5z"/><path d="M88 10 l2 4 4 .5-3 2.6.8 4-3.8-2-3.8 2 .8-4-3-2.6 4-.5z"/><circle cx="60" cy="6" r="3"/></g>`
    : '';
  const seed = (topicId.length * 7 + n) % 97;
  return `<svg class="villain${defeated ? ' villain--defeated' : ''}" viewBox="0 0 120 124" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">`
    + `<defs><clipPath id="vclip${n}"><path d="${body}"/></clipPath>`
    + `<filter id="vwob${n}" x="-8%" y="-8%" width="116%" height="116%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter></defs>`
    + `<g filter="url(#vwob${n})">`
    + villainExtrasSvg(v, true) + villainPropSvg(style, true)
    + feet + arms
    + `<path d="${body}" fill="${v.color}"/>`
    + `<g clip-path="url(#vclip${n})">`
    +   villainPatternSvg(style, v)
    +   `<ellipse cx="74" cy="114" rx="62" ry="34" fill="${dark}" opacity=".28"/>`
    +   `<ellipse cx="38" cy="34" rx="15" ry="9" fill="#fff" opacity=".4" transform="rotate(-28 38 34)"/>`
    + `</g>`
    + `<path d="${body}" stroke="${ink}" stroke-width="2.8" stroke-linejoin="round"/>`
    + `<circle cx="29" cy="74" r="6" fill="#ff8fa3" opacity=".5"/><circle cx="91" cy="74" r="6" fill="#ff8fa3" opacity=".5"/>`
    + villainEyesSvg(style, v, defeated) + mask + goggles + villainMouthSvg(style, defeated) + mustache
    + villainExtrasSvg(v, false) + (defeated ? '' : villainPropSvg(style, false)) + dizzy
    + `</g></svg>`;
}

/* Which villains a learner has beaten: { topicId: [levelIndex, ...] } */
const VILLAIN_WINS_KEY = 'safetylib_villain_wins_v1';
function villainWins(){
  try { return JSON.parse(localStorage.getItem(VILLAIN_WINS_KEY) || '{}') || {}; } catch (e) { return {}; }
}
function markVillainBeaten(topicId, level){
  const w = villainWins();
  const list = Array.isArray(w[topicId]) ? w[topicId] : [];
  if (!list.includes(level)) list.push(level);
  w[topicId] = list;
  try { localStorage.setItem(VILLAIN_WINS_KEY, JSON.stringify(w)); } catch (e) { /* ignore */ }
}
function villainBeaten(topicId, level){
  const list = villainWins()[topicId];
  return Array.isArray(list) && (level === undefined ? list.length > 0 : list.includes(level));
}
