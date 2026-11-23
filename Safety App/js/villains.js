/* ==========================================================================
   Safety Superheroes — lesson villains
   One goofy villain per lesson. Each villain is an UNSAFE HABIT (rushing,
   hiding an ouch, clicking everything...), never a kind of person, so the
   lessons' message ("most people are fine; watch for unsafe behavior")
   stays intact. Drawn as original SVG, silly not scary. Every monster has
   its own silhouette, palette and features (see VILLAIN_ART below), tied
   to its habit where that's funny. Battles live in villain.html.
   ========================================================================== */

const VILLAIN_INK = '#2b2b2b';

/* color = the monster's main body colour (its full design is in VILLAIN_ART). */
const VILLAINS = {
  'stranger-safety': { color: '#9067d8',
    en: { name: 'Sneaky Sneak-Off', taunt: 'Someone offers a treat or a puppy? Just go along! Don\'t check with your grown-up first! Hee-hee!', reform: 'Okay, okay! You always check with your grown-up first. You saw right through my sneaky plan!' },
    es: { name: 'Escapadito', taunt: '¿Alguien te ofrece un dulce o un perrito? ¡Ve con él! ¡No le preguntes primero a tu adulto! ¡Ji, ji!', reform: '¡Está bien, está bien! Siempre le preguntas primero a tu adulto. ¡Descubriste mi plan!' } },
  'street-safety': { color: '#ff6a48',
    en: { name: 'Captain Rush', taunt: 'Stop? Look? Wait for the light? Boring! Zoom across the street with me!', reform: 'Whoa... stopping and looking both ways really is the fastest way to stay safe. I\'ll wait for the walk sign!' },
    es: { name: 'Capitán Prisa', taunt: '¿Parar? ¿Mirar? ¿Esperar la luz? ¡Qué aburrido! ¡Cruza la calle volando conmigo!', reform: 'Vaya... parar y mirar a los dos lados sí es la mejor forma de estar seguro. ¡Esperaré la señal para cruzar!' } },
  'lost-safety': { color: '#7fd0f5',
    en: { name: 'Wander Wobble', taunt: 'Lost? Just keep wandering around! Don\'t ask anyone for help!', reform: 'Huh! Staying put and asking a worker for help gets you back to your family. Smart hero!' },
    es: { name: 'Paseo Perdido', taunt: '¿Perdido? ¡Sigue caminando por ahí! ¡No le pidas ayuda a nadie!', reform: '¡Vaya! Quedarse quieto y pedirle ayuda a un trabajador te lleva de vuelta con tu familia. ¡Qué listo!' } },
  'emergency-safety': { color: '#bfe9ff',
    en: { name: 'Freezy', taunt: 'Brrr! When something goes wrong, just freeze and do nothing! Don\'t call anyone!', reform: 'You melted my freeze! Calling 911 and saying where you are is the hero move.' },
    es: { name: 'Congelito', taunt: '¡Brrr! Cuando algo sale mal, ¡quédate congelado y no hagas nada! ¡No llames a nadie!', reform: '¡Derretiste mi hielo! Llamar al 911 y decir dónde estás es lo que hace un héroe.' } },
  'fire-safety': { color: '#a8aeb8',
    en: { name: 'Smokey Smog', taunt: 'Puff puff! Stay inside and grab all your toys first. Smoke is no big deal!', reform: 'Cough! You got low and went out fast. I can\'t catch a hero like you!' },
    es: { name: 'Humo Humito', taunt: '¡Puf, puf! Quédate adentro y agarra todos tus juguetes primero. ¡El humo no es nada!', reform: '¡Cof! Te agachaste y saliste rápido. ¡No puedo atrapar a un héroe como tú!' } },
  'earthquake-safety': { color: '#cfa46c',
    en: { name: 'Rumble Grumble', taunt: 'RUMBLE! Run around and stand next to the windows when I shake things up!', reform: 'Drop, cover, and hold on... you didn\'t even wobble! I give up!' },
    es: { name: 'Gruñón Temblón', taunt: '¡RUMMM! ¡Corre por todos lados y párate junto a las ventanas cuando yo sacuda todo!', reform: 'Agáchate, cúbrete y sujétate... ¡ni siquiera te tambaleaste! ¡Me rindo!' } },
  'rainyweather-safety': { color: '#7f9cff',
    en: { name: 'Splashzilla', taunt: 'Ooh, a flooded street! Jump right in and splash! And play outside in the thunder!', reform: 'Fine! Flood water is not for playing, and thunder means go inside. You win, hero!' },
    es: { name: 'Chapotezilla', taunt: '¡Uy, una calle inundada! ¡Salta y chapotea! ¡Y juega afuera con los truenos!', reform: '¡Bueno! El agua de inundación no es para jugar y los truenos significan ir adentro. ¡Ganaste!' } },
  'selfadvocacy-safety': { color: '#3fb8b0',
    en: { name: 'Señor Shush', taunt: 'Shhh! Don\'t tell anyone what you need. Just stay quiet, even when it\'s hard!', reform: 'Wow, you used your words! Asking for help or a break is a super power.' },
    es: { name: 'Señor Shhh', taunt: '¡Shhh! No le digas a nadie lo que necesitas. ¡Quédate callado aunque sea difícil!', reform: '¡Guau, usaste tus palabras! Pedir ayuda o un descanso es un súper poder.' } },
  'body-boundaries-safety': { color: '#ff8fc0',
    en: { name: 'Bubble Popper', taunt: 'POP! I don\'t care about anybody\'s space bubble. Pop, pop, pop!', reform: 'You said "No, stop!" loud and clear. Everyone\'s body bubble is safe from me now.' },
    es: { name: 'Revientaburbujas', taunt: '¡PUM! No me importa el espacio de nadie. ¡Pum, pum, pum!', reform: 'Dijiste "¡No, para!" bien fuerte. Ahora la burbuja de todos está a salvo de mí.' } },
  'secrets-safety': { color: '#6b5bd6',
    en: { name: 'Whisper Wisp', taunt: 'Psst... keep this yucky secret, and don\'t tell your family. Ever!', reform: 'You told a trusted grown-up! Yucky secrets lose all their power when you tell.' },
    es: { name: 'Susurro Secreto', taunt: 'Psst... guarda este secreto feo y no se lo digas a tu familia. ¡Nunca!', reform: '¡Se lo dijiste a un adulto de confianza! Los secretos feos pierden su poder cuando los cuentas.' } },
  'reporting-safety': { color: '#bcc6d0',
    en: { name: 'Shrug-o-Tron', taunt: 'Beep boop. Something wrong? Shrug! Don\'t bother telling anyone. Beep!', reform: 'Error! Error! You kept telling until someone helped. That is not tattling, that is heroic!' },
    es: { name: 'Encogetrón', taunt: 'Bip bup. ¿Algo anda mal? ¡Encógete de hombros! No se lo digas a nadie. ¡Bip!', reform: '¡Error! ¡Error! Seguiste contando hasta que alguien te ayudó. ¡Eso no es chismear, es ser un héroe!' } },
  'awareness-safety': { color: '#d6f5f1',
    en: { name: 'Daydream Drifter', taunt: 'Keep your eyes glued to the screen! Who needs to look where they\'re going?', reform: 'You looked up and noticed everything around you. I can\'t sneak up on you!' },
    es: { name: 'Soñador Distraído', taunt: '¡Mantén los ojos pegados a la pantalla! ¿Quién necesita mirar por dónde camina?', reform: 'Levantaste la vista y notaste todo a tu alrededor. ¡No te puedo sorprender!' } },
  'plan-safety': { color: '#ffc83a',
    en: { name: 'Scramble', taunt: 'Plans are silly! When something happens, everybody just run in different directions!', reform: 'A meeting spot and a practiced plan? I can\'t scramble a team that ready!' },
    es: { name: 'Revoltijo', taunt: '¡Los planes son tontos! Cuando pase algo, ¡que todos corran para lados distintos!', reform: '¿Un lugar de reunión y un plan practicado? ¡No puedo revolver a un equipo tan preparado!' } },
  'privacy-safety': { color: '#4fc38a',
    en: { name: 'Snoopsnatch', taunt: 'Ooh, tell me your address and your password! I\'ll keep them... for me!', reform: 'You kept your private things private! There\'s nothing for me to snatch.' },
    es: { name: 'Fisgón', taunt: '¡Uy, dime tu dirección y tu contraseña! Yo las guardo... ¡para mí!', reform: '¡Mantuviste en privado tus cosas privadas! No hay nada que pueda robar.' } },
  'bullying-safety': { color: '#5876d6',
    en: { name: 'Grumblegrump', taunt: 'Being mean is fun! And nobody will stand up for anybody. Grumble grumble!', reform: 'You walked away, told a grown-up, and stood by a friend. Being kind wins!' },
    es: { name: 'Gruñegruñe', taunt: '¡Ser malo es divertido! Y nadie va a defender a nadie. ¡Grr, grr!', reform: 'Te alejaste, le dijiste a un adulto y acompañaste a un amigo. ¡La bondad gana!' } },
  'online-safety': { color: '#4a9dff',
    en: { name: 'Captain Click', taunt: 'Click every link! Answer every message! Meet your online pals in person!', reform: 'You closed it and told a grown-up. My clicks can\'t trick you!' },
    es: { name: 'Capitán Clic', taunt: '¡Haz clic en todo! ¡Contesta todos los mensajes! ¡Conoce en persona a tus amigos de internet!', reform: 'Lo cerraste y se lo dijiste a un adulto. ¡Mis clics no te pueden engañar!' } },
  'cyberbullying-safety': { color: '#e0569b',
    en: { name: 'Troll-o-Bot', taunt: 'Bzzt! Send mean messages back! Make it bigger! Bzzt bzzt!', reform: 'You didn\'t answer, you saved it, and you blocked me. My batteries are empty!' },
    es: { name: 'Trolebot', taunt: '¡Bzzt! ¡Contesta con mensajes groseros! ¡Hazlo más grande! ¡Bzzt, bzzt!', reform: 'No contestaste, lo guardaste y me bloqueaste. ¡Se me acabaron las pilas!' } },
  'citizenship-safety': { color: '#a2b84a',
    en: { name: 'Litterbug', taunt: 'Toss trash anywhere! Cut in line! Who cares about helping out?', reform: 'You helped your community and treated people kindly. Okay, I\'ll use the trash can!' },
    es: { name: 'Bicho Basurero', taunt: '¡Tira la basura donde sea! ¡Cuélate en la fila! ¿A quién le importa ayudar?', reform: 'Ayudaste a tu comunidad y trataste bien a la gente. ¡Está bien, usaré el bote de basura!' } },
  'rights-safety': { color: '#d97a4e',
    en: { name: 'The No-Way Wall', taunt: 'You can\'t ask for help! You can\'t ask for what you need! No way!', reform: 'You know your rights! You can be safe and ask for help. I\'m crumbling!' },
    es: { name: 'El Muro del No', taunt: '¡No puedes pedir ayuda! ¡No puedes pedir lo que necesitas! ¡De ninguna manera!', reform: '¡Conoces tus derechos! Puedes estar seguro y pedir ayuda. ¡Me estoy derrumbando!' } },
  'water-safety': { color: '#ff8a78',
    en: { name: 'Captain Cannonball', taunt: 'Jump in the deep end all alone! Life jackets? Nah! SPLASH!', reform: 'Swimming with a grown-up and wearing a life jacket... that\'s how real water heroes do it!' },
    es: { name: 'Capitán Clavado', taunt: '¡Salta solito en lo hondo! ¿Chaleco salvavidas? ¡Nah! ¡SPLASH!', reform: 'Nadar con un adulto y usar chaleco salvavidas... ¡así lo hacen los verdaderos héroes del agua!' } },
  'home-safety': { color: '#8fe0b0',
    en: { name: 'Candy Copycat', taunt: 'Hee-hee! This medicine looks just like candy. Try some! And open the door for anyone!', reform: 'Medicine only from a grown-up, and no opening the door to people you don\'t know. You\'re home-safe!' },
    es: { name: 'Dulce Impostor', taunt: '¡Ji, ji! Esta medicina parece un dulce. ¡Pruébala! ¡Y ábrele la puerta a cualquiera!', reform: 'La medicina solo de un adulto, y no abrirle la puerta a quien no conoces. ¡Tu casa está segura!' } },
  'bike-safety': { color: '#9fd64a',
    en: { name: 'Wobble Wheelie', taunt: 'Helmets are for babies! Ride on the wrong side and don\'t look!', reform: 'Helmet on, right side of the road, eyes up. I can\'t wobble a hero like you!' },
    es: { name: 'Rueda Loca', taunt: '¡Los cascos son para bebés! ¡Anda por el lado equivocado y no mires!', reform: 'Casco puesto, por la derecha y mirando. ¡No puedo tambalear a un héroe como tú!' } },
  'peer-pressure-safety': { color: '#ff9a3c',
    en: { name: 'Double-Dare', taunt: 'Everybody\'s doing it! I double-dare you to do the unsafe thing!', reform: 'You said "No thanks" and walked away. Real friends don\'t dare you into danger!' },
    es: { name: 'Doble Reto', taunt: '¡Todos lo hacen! ¡Te reto dos veces a hacer lo peligroso!', reform: 'Dijiste "No, gracias" y te alejaste. ¡Los verdaderos amigos no te retan a hacer cosas peligrosas!' } },
  'elopement-safety': { color: '#ffd23f',
    en: { name: 'Zoom Zoom', taunt: 'Run off without telling anyone! Zoom zoom zoom!', reform: 'You stopped, squeezed your hands, and told a grown-up where you were going. Zoom... over.' },
    es: { name: 'Zum Zum', taunt: '¡Sal corriendo sin decirle a nadie! ¡Zum, zum, zum!', reform: 'Paraste, apretaste tus manos y le dijiste a un adulto adónde ibas. Zum... se acabó.' } },
  'safehelper-safety': { color: '#e06bd2',
    en: { name: 'The Mixer-Upper', taunt: 'Who\'s a safe helper? I\'ll mix you up so you can\'t tell!', reform: 'Uniforms, name tags, workers at the counter... you know exactly who can help!' },
    es: { name: 'El Revoltoso', taunt: '¿Quién es un ayudante seguro? ¡Te voy a confundir para que no sepas!', reform: 'Uniformes, gafetes, trabajadores en el mostrador... ¡sabes muy bien quién puede ayudar!' } },
  'medical-safety': { color: '#c6a3ef',
    en: { name: 'Hide-the-Ouch', taunt: 'Shh, don\'t tell anyone when something hurts! Just hide it!', reform: 'You told a grown-up about your ouch and asked questions. Doctors and heroes make a great team!' },
    es: { name: 'Esconde-Ayes', taunt: '¡Shh, no le digas a nadie cuando algo te duela! ¡Escóndelo!', reform: 'Le dijiste a un adulto lo que te dolía e hiciste preguntas. ¡Los médicos y los héroes hacen un gran equipo!' } },
  'selfregulation-safety': { color: '#a065e0',
    en: { name: 'Fizzy Fume', taunt: 'Fizz fizz! Let those big feelings bubble over! Don\'t take a breath!', reform: 'Smell the flower, blow out the candle... you calmed my fizz right down. Ahhh.' },
    es: { name: 'Burbuja Furiosa', taunt: '¡Fiz, fiz! ¡Deja que esas emociones grandes se desborden! ¡No respires!', reform: 'Huele la flor, sopla la vela... calmaste todas mis burbujas. Ahhh.' } },
  'firstaid-safety': { color: '#b5cf3a',
    en: { name: 'Grimy Germ', taunt: 'Don\'t wash that cut! Leave it dirty! Germs love a party!', reform: 'Washed and bandaged! You know your first aid, hero. No germ party today.' },
    es: { name: 'Germen Mugroso', taunt: '¡No laves esa cortada! ¡Déjala sucia! ¡A los gérmenes les encanta la fiesta!', reform: '¡Lavada y con curita! Sabes primeros auxilios, héroe. Hoy no hay fiesta de gérmenes.' } },
  'seizure-safety': { color: '#ffab5e',
    en: { name: 'Grabby Hands', taunt: 'If someone has a seizure, hold them down tight! And walk away!', reform: 'You moved things away, stayed with them, and got a grown-up. That\'s exactly how to help!' },
    es: { name: 'Manos Agarronas', taunt: 'Si alguien tiene una convulsión, ¡sujétalo fuerte! ¡Y vete!', reform: 'Apartaste las cosas, te quedaste con la persona y buscaste a un adulto. ¡Así se ayuda!' } },
  'money-safety': { color: '#b8e68a',
    en: { name: 'Scam Spam', taunt: 'You won a prize! Just send me your bank card and PIN! Hurry!', reform: 'You never share your PIN and you checked with a grown-up. My scams don\'t work on you!' },
    es: { name: 'Estafa Spam', taunt: '¡Ganaste un premio! ¡Solo mándame tu tarjeta del banco y tu PIN! ¡Rápido!', reform: 'Nunca compartes tu PIN y lo consultaste con un adulto. ¡Mis estafas no funcionan contigo!' } },
  'dating-safety': { color: '#f2545b',
    en: { name: 'Pressure Cooker', taunt: 'Ssss! Keep pushing even when someone says no! Don\'t tell anyone where you are!', reform: 'Respect means listening to "no", and you told a trusted grown-up your plans. My steam is gone!' },
    es: { name: 'Olla de Presión', taunt: '¡Sss! ¡Sigue insistiendo aunque te digan que no! ¡No le digas a nadie dónde estás!', reform: 'Respetar es escuchar el "no", y le contaste tus planes a un adulto de confianza. ¡Se me acabó el vapor!' } },
};

function villainFor(topicId){ return VILLAINS[topicId] || null; }
function villainData(topicId, lang){
  const v = VILLAINS[topicId];
  return v ? (v[lang] || v.en) : null;
}

let villainSvgSeq = 0;

function villainShade(hex, amt){
  const n = parseInt(hex.slice(1), 16);
  const f = c => Math.max(0, Math.min(255, Math.round(c * (1 - amt))));
  return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(x => x.toString(16).padStart(2, '0')).join('');
}
function villainTint(hex, amt){
  const n = parseInt(hex.slice(1), 16);
  const f = c => Math.max(0, Math.min(255, Math.round(c + (255 - c) * amt)));
  return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(x => x.toString(16).padStart(2, '0')).join('');
}

/* Drawing kit shared by every monster, so 31 very different bodies still
   share one ink style: the same outline weight, eye and mouth shapes, rim
   shading, rosy cheeks and dizzy "defeated" eyes. `D` = defeated. */
function villainKit(n, D){
  const ink = VILLAIN_INK;
  const MOUTH = '#7a2335', TONGUE = '#ff8fa3';
  let clipSeq = 0;
  const f1 = x => Math.round(x * 10) / 10;
  const st = sw => sw ? ` stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"` : '';
  const k = {
    D, ink,
    shade: villainShade, tint: villainTint,
    p: (d, fill = 'none', sw = 2.6, x = '') => `<path d="${d}" fill="${fill}"${st(sw)} ${x}/>`,
    c: (cx, cy, r, fill = 'none', sw = 2.6, x = '') => `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="${fill}"${st(sw)} ${x}/>`,
    e: (cx, cy, rx, ry, fill = 'none', sw = 2.6, x = '') => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${fill}"${st(sw)} ${x}/>`,
    r: (x, y, w, h, rx, fill = 'none', sw = 2.6, xt = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${st(sw)} ${xt}/>`,
    line: (d, color = ink, w = 2.6, x = '') => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${x}/>`,
    // A two-tone stroke (ink outline + colour), for arms, legs, necks, tentacles.
    limb: (d, color, w = 5.6) => `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${w + 4.4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`,
    hand: (x, y, r = 5.5, fill = '#fff') => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${fill}"${st(2.2)}/>`,
    g: (inner, tf) => `<g transform="${tf}">${inner}</g>`,
    // Idle-motion wrapper (CSS in styles.css). Never carries a transform itself.
    a: (cls, origin, inner) => `<g class="vm-${cls}" style="transform-origin:${origin}">${inner}</g>`,
    // Body fill + rim shadow (lower-right) + optional shine + inner details, all clipped.
    body: (d, fill, o = {}) => {
      const id = `vc${n}_${++clipSeq}`;
      const rim = o.rim === undefined ? 5 : o.rim;
      const dark = o.dark || villainShade(fill, 0.2);
      const shine = o.shine ? `<ellipse cx="${o.shine[0]}" cy="${o.shine[1]}" rx="${o.shine[2]}" ry="${o.shine[3]}" fill="#fff" opacity=".42" transform="rotate(${o.shine[4] || -25} ${o.shine[0]} ${o.shine[1]})"/>` : '';
      return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${dark}"/>`
        + `<g clip-path="url(#${id})"><path d="${d}" fill="${fill}" transform="translate(${-rim * 0.7} ${-rim})"/>${o.inner || ''}${shine}</g>`
        + `<path d="${d}" fill="none"${st(o.sw || 2.8)}/>`;
    },
    clip: (d, inner) => { const id = `vc${n}_${++clipSeq}`; return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`; },
    // Bumpy cloud/foam/smoke made of circles, with the inner overlaps hidden.
    puff: (circles, fill, sw = 2.4) => circles.map(([x, y, r]) => k.c(x, y, r, fill, sw)).join('') + circles.map(([x, y, r]) => k.c(x, y, r - sw * 0.5, fill, 0)).join(''),
    cheeks: (x1, y1, x2, y2, r = 5) => `<circle cx="${x1}" cy="${y1}" r="${r}" fill="#ff8fa3" opacity=".55"/><circle cx="${x2}" cy="${y2}" r="${r}" fill="#ff8fa3" opacity=".55"/>`,
    spark: (x, y, s = 4, fill = '#ffd23f') => `<path d="M${x} ${y - s} Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s} Z" fill="${fill}"${st(1.4)}/>`,
    spiral: (cx, cy, r, color = ink) => `<path d="M${f1(cx - r)} ${f1(cy)} a${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0 a${f1(r * 0.62)} ${f1(r * 0.62)} 0 1 0 ${f1(-r * 1.24)} 0 a${f1(r * 0.25)} ${f1(r * 0.25)} 0 1 0 ${f1(r * 0.5)} 0" fill="none" stroke="${color}" stroke-width="${r < 5 ? 1.8 : 2.4}" stroke-linecap="round"/>`,
    /* Cartoon eye. o.look=[dx,dy] (-1..1), o.lid='sleepy'|'shifty' (+o.lidColor),
       o.slit (cat pupil), o.iris (coloured iris), o.dollar, o.squeeze (+1 / -1). */
    eye: (cx, cy, r, o = {}) => {
      const ry = o.ry || r * 1.08;
      const sw = r < 6 ? 2 : 2.4;
      if (D) return k.e(cx, cy, r, ry, '#fff', sw) + k.spiral(cx, cy, r * 0.78);
      if (o.squeeze){
        const s = o.squeeze, w = r * 0.8;
        return k.line(`M${f1(cx - s * w)} ${f1(cy - w)} L${f1(cx + s * w)} ${f1(cy)} L${f1(cx - s * w)} ${f1(cy + w)}`, ink, 3);
      }
      const [lx, ly] = o.look || [0.15, 0.15];
      const px = cx + lx * r * 0.42, py = cy + ly * ry * 0.42;
      const pr = o.pupil || r * 0.5;
      let s = k.e(cx, cy, r, ry, '#fff', sw);
      if (o.iris) s += k.c(px, py, pr * 1.45, o.iris, 1.6);
      if (o.dollar) s += `<text x="${f1(px)}" y="${f1(py + r * 0.5)}" font-size="${f1(r * 1.5)}" font-weight="900" text-anchor="middle" font-family="Arial, sans-serif" fill="#1f7a3a">$</text>`;
      else if (o.slit) s += k.e(px, py, pr * 0.42, pr * 1.3, ink, 0);
      else s += k.c(px, py, pr, ink, 0) + k.c(px + pr * 0.38, py - pr * 0.42, Math.max(1, pr * 0.32), '#fff', 0);
      if (o.lid){
        const h = o.lid === 'sleepy' ? 0 : ry * 0.38;
        const y = cy - h, dx = r * Math.sqrt(1 - (h / ry) * (h / ry));
        s += `<path d="M${f1(cx - dx)} ${f1(y)} A${f1(r)} ${f1(ry)} 0 0 1 ${f1(cx + dx)} ${f1(y)} Z" fill="${o.lidColor || '#ccc'}"${st(sw)}/>`;
      }
      return s;
    },
    /* Mouths: grin laugh tongue buck o smirk wavy toothy underbite cat pout chatter goldtooth */
    mouth: (type, cx, cy, w = 10) => {
      if (D) return k.line(`M${f1(cx - w)} ${f1(cy)} q${f1(w * 0.5)} ${f1(-w * 0.4)} ${f1(w)} 0 t${f1(w)} 0`, ink, 2.6);
      const fl = (d, fill) => k.p(d, fill, 2.4);
      switch (type){
        case 'laugh': return fl(`M${cx - w} ${cy} H${cx + w} C${cx + w} ${f1(cy + w * 1.25)} ${cx - w} ${f1(cy + w * 1.25)} ${cx - w} ${cy} Z`, MOUTH)
          + `<path d="M${f1(cx - w * 0.5)} ${f1(cy + w * 0.78)} Q${cx} ${f1(cy + w * 0.42)} ${f1(cx + w * 0.5)} ${f1(cy + w * 0.78)} Q${cx} ${f1(cy + w * 0.98)} ${f1(cx - w * 0.5)} ${f1(cy + w * 0.78)} Z" fill="${TONGUE}"/>`
          + k.line(`M${f1(cx - w * 0.72)} ${f1(cy + 1.8)} H${f1(cx + w * 0.72)}`, '#fff', 2.6);
        case 'tongue': return k.p(`M${cx} ${f1(cy + w * 0.28)} V${f1(cy + w * 0.78)} A${f1(w * 0.23)} ${f1(w * 0.23)} 0 0 0 ${f1(cx + w * 0.46)} ${f1(cy + w * 0.78)} V${f1(cy + w * 0.2)}`, TONGUE, 2)
          + k.line(`M${f1(cx + w * 0.23)} ${f1(cy + w * 0.4)} V${f1(cy + w * 0.7)}`, '#e0607a', 1.4)
          + k.line(`M${cx - w} ${cy} Q${cx} ${f1(cy + w * 0.62)} ${cx + w} ${cy}`, ink, 2.8);
        case 'buck': return k.r(f1(cx - w * 0.32), f1(cy + w * 0.22), f1(w * 0.32), f1(w * 0.42), 1.5, '#fff', 1.6) + k.r(cx, f1(cy + w * 0.22), f1(w * 0.32), f1(w * 0.42), 1.5, '#fff', 1.6)
          + k.line(`M${cx - w} ${cy} Q${cx} ${f1(cy + w * 0.6)} ${cx + w} ${cy}`, ink, 2.8);
        case 'o': return k.e(cx, cy, w * 0.42, w * 0.52, MOUTH, 2.2);
        case 'smirk': return k.line(`M${cx - w} ${f1(cy + w * 0.05)} Q${f1(cx - w * 0.05)} ${f1(cy + w * 0.6)} ${cx + w} ${f1(cy - w * 0.35)}`, ink, 2.8)
          + k.line(`M${f1(cx + w * 0.85)} ${f1(cy - w * 0.62)} q${f1(w * 0.32)} ${f1(w * 0.18)} ${f1(w * 0.12)} ${f1(w * 0.52)}`, ink, 1.8);
        case 'wavy': return k.line(`M${cx - w} ${cy} l${f1(w / 3)} ${f1(-w * 0.28)} l${f1(w / 3)} ${f1(w * 0.28)} l${f1(w / 3)} ${f1(-w * 0.28)} l${f1(w / 3)} ${f1(w * 0.28)} l${f1(w / 3)} ${f1(-w * 0.28)} l${f1(w / 3)} ${f1(w * 0.28)}`, ink, 2.6);
        case 'toothy': return fl(`M${cx - w} ${cy} Q${cx} ${f1(cy + w * 1.15)} ${cx + w} ${cy} Q${cx} ${f1(cy + w * 0.3)} ${cx - w} ${cy} Z`, MOUTH)
          + [-0.45, 0, 0.45].map(t => k.r(f1(cx + t * w - w * 0.16), f1(cy + w * 0.12 + Math.abs(t) * -w * 0.1), f1(w * 0.32), f1(w * 0.3), 1.4, '#fff', 1.3)).join('');
        case 'goldtooth': return fl(`M${cx - w} ${cy} Q${cx} ${f1(cy + w * 1.15)} ${cx + w} ${cy} Q${cx} ${f1(cy + w * 0.3)} ${cx - w} ${cy} Z`, MOUTH)
          + k.r(f1(cx + w * 0.12), f1(cy + w * 0.18), f1(w * 0.34), f1(w * 0.34), 1.4, '#ffd23f', 1.3);
        case 'underbite': {
          const tooth = (x, y) => k.p(`M${f1(x - 2.6)} ${f1(y + 0.6)} Q${f1(x - 1.4)} ${f1(y - 5.6)} ${f1(x)} ${f1(y - 6)} Q${f1(x + 1.4)} ${f1(y - 5.6)} ${f1(x + 2.6)} ${f1(y + 0.6)} Z`, '#fff', 1.4);
          return k.line(`M${cx - w} ${cy} Q${cx} ${f1(cy + w * 0.5)} ${cx + w} ${cy}`, ink, 3) + tooth(cx - w * 0.5, cy + w * 0.2) + tooth(cx + w * 0.5, cy + w * 0.2);
        }
        case 'cat': return k.line(`M${cx - w} ${cy} Q${f1(cx - w * 0.5)} ${f1(cy + w * 0.7)} ${cx} ${cy} Q${f1(cx + w * 0.5)} ${f1(cy + w * 0.7)} ${cx + w} ${cy}`, ink, 2.4);
        case 'pout': return k.line(`M${cx - w} ${f1(cy + w * 0.3)} Q${cx} ${f1(cy - w * 0.35)} ${cx + w} ${f1(cy + w * 0.3)}`, ink, 3);
        case 'chatter': return k.r(cx - w, f1(cy - w * 0.38), 2 * w, f1(w * 0.76), f1(w * 0.3), '#fff', 2.2)
          + k.line(`M${cx - w} ${cy} H${cx + w} M${f1(cx - w * 0.5)} ${f1(cy - w * 0.38)} V${f1(cy + w * 0.38)} M${cx} ${f1(cy - w * 0.38)} V${f1(cy + w * 0.38)} M${f1(cx + w * 0.5)} ${f1(cy - w * 0.38)} V${f1(cy + w * 0.38)}`, ink, 1.4);
        default: return fl(`M${cx - w} ${cy} Q${cx} ${f1(cy + w * 1.1)} ${cx + w} ${cy} Q${cx} ${f1(cy + w * 0.28)} ${cx - w} ${cy} Z`, MOUTH)
          + k.r(f1(cx - w * 0.42), f1(cy + w * 0.12), f1(w * 0.3), f1(w * 0.3), 1.2, '#fff', 1.2);
      }
    },
    zigzag: (x1, y1, x2, y2, n2, amp) => {
      const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
      let d = `M${f1(x1)} ${f1(y1)}`;
      for (let i = 1; i < n2; i++){ const t = i / n2, s = i % 2 ? amp : -amp; d += ` L${f1(x1 + dx * t + nx * s)} ${f1(y1 + dy * t + ny * s)}`; }
      return d + ` L${f1(x2)} ${f1(y2)}`;
    },
  };
  return k;
}

/* ---------- The 31 monsters, in lesson-map order ----------
   Each: top = where the dizzy stars sit, shadow = [cx, rx] of the ground
   shadow (or false), draw(k) = the SVG. */
const VILLAIN_ART = {
  /* Tall tiptoeing pear on stilt legs: top hat, bandit mask, curly mustache, lollipop lure */
  'stranger-safety': { top: [58, 22], shadow: [60, 24], draw(k){
    const B = '#9067d8', BL = '#dccaf8', HAT = '#3b3452';
    const body = 'M60 28 C72 28 76 40 76 50 C76 60 88 68 88 82 C88 94 76 100 60 100 C44 100 32 94 32 82 C32 68 44 60 44 50 C44 40 48 28 60 28 Z';
    const candy = (x, y) => k.c(x, y, 8, '#ff7aa8', 2.2) + k.line(`M${x - 4} ${y - 3} Q${x} ${y - 7} ${x + 4} ${y - 2} Q${x + 5} ${y + 4} ${x} ${y + 4} Q${x - 4} ${y + 3} ${x - 3} ${y - 1}`, '#fff', 2);
    const lure = k.D
      ? k.limb('M82 72 Q92 80 94 92', B, 4.6) + k.hand(94, 92, 4.6) + k.line('M98 112 L112 104', '#f6f0e0', 3) + k.line('M98 112 L112 104', k.ink, 1) + candy(108, 104)
      : k.limb('M82 70 Q94 66 98 56', B, 4.6) + k.hand(98, 56, 4.6) + k.a('sway', '0% 100%', k.line('M99 54 L103 34', k.ink, 4.6) + k.line('M99 54 L103 34', '#f6f0e0', 2.4) + candy(104, 30));
    return k.limb('M40 72 Q28 78 30 88', B, 4.6) + k.hand(30, 88, 4.6)
      + k.limb('M51 96 Q48 104 45 110', B, 4.2) + k.limb('M69 96 Q72 104 75 110', B, 4.2)
      + k.e(43, 113, 7.5, 3.6, HAT, 2.2, 'transform="rotate(-14 43 113)"') + k.e(77, 113, 7.5, 3.6, HAT, 2.2, 'transform="rotate(14 77 113)"')
      + k.body(body, B, { shine: [52, 40, 4, 8, -10], inner: k.e(60, 86, 18, 11, BL, 0) + k.line('M44 72 Q60 78 76 72', villainShade(B, 0.15), 2) })
      + k.cheeks(46, 58, 74, 58, 3.6)
      + k.p('M41 45 Q48 38 60 42 Q72 38 79 45 Q77 53 68 52 Q62 51 60 48 Q58 51 52 52 Q43 53 41 45 Z', '#2b2b2b', 1.6)
      + k.line('M42 45 Q34 40 28 43 M42 47 Q35 50 31 55', '#2b2b2b', 2.4)
      + k.eye(52, 46, 4.8, { look: [0.7, 0.1], lid: 'shifty', lidColor: '#2b2b2b' }) + k.eye(68, 46, 4.8, { look: [0.7, 0.1], lid: 'shifty', lidColor: '#2b2b2b' })
      + k.mouth('smirk', 61, 62, 6)
      + k.p('M60 56 C55 52 49 53 47 57 C46 60 42 60 42 57 C43 62 52 63 60 59 C68 63 77 62 78 57 C78 60 74 60 73 57 C71 53 65 52 60 56 Z', '#5a3a26', 1.6)
      + k.g(k.r(48, 8, 24, 20, 3, HAT, 2.2) + k.r(48, 19, 24, 4, 0, '#e8559b', 0) + k.r(40, 25, 40, 6, 3, HAT, 2.2), k.D ? 'rotate(-28 60 30) translate(-6 2)' : 'rotate(-10 60 30)')
      + lure;
  } },

  /* Forward-leaning bullet with a jet-flame tail, goggles and striped racing sneakers */
  'street-safety': { top: [72, 26], shadow: [64, 32], draw(k){
    const B = '#ff6a48', BL = '#ffd36b';
    const body = 'M16 70 C30 58 40 32 68 30 C92 28 106 48 104 68 C102 88 86 100 64 100 C40 100 28 82 16 70 Z';
    const shoe = (x, y, r) => k.g(k.p('M-11 4 C-11 -4 -5 -6 0 -6 C6 -6 13 -2 13 4 Z', '#fff', 2.2) + k.r(-12, 3, 26, 4, 2, '#e04848', 1.8) + k.line('M-4 -4 L-1 2 M2 -5 L5 2', '#3d8bff', 2.2), `translate(${x} ${y}) rotate(${r})`);
    const jet = k.D ? k.puff([[12, 72, 5], [6, 66, 3.5]], '#c9ccd2', 2)
      : k.a('flicker', '100% 50%', k.p('M20 62 C10 58 2 64 4 70 C2 76 10 82 20 78 Z', '#ffb52e', 2.4) + k.p('M18 66 C12 64 8 68 10 70 C8 72 12 76 18 74 Z', '#fff3a0', 0))
        + k.line('M6 48 H20 M2 92 H16 M10 100 H22', '#ffffff', 3.4) + k.line('M6 48 H20 M2 92 H16 M10 100 H22', k.ink, 1.2, 'opacity=".5"');
    return jet
      + k.limb(k.D ? 'M54 98 L50 110' : 'M54 98 L44 108', B, 5) + k.limb(k.D ? 'M76 98 L80 110' : 'M76 96 L88 104', B, 5)
      + (k.D ? shoe(48, 112, 0) + shoe(82, 112, 0) : shoe(42, 110, -8) + shoe(92, 104, -24))
      + k.limb('M40 66 Q30 60 28 52', B) + k.hand(28, 52)
      + k.body(body, B, { shine: [60, 42, 10, 6, -12], inner: k.e(72, 88, 22, 11, BL, 0) + k.line('M36 54 Q50 46 60 48 M34 62 Q48 54 58 56', '#fff', 3, 'opacity=".7"') })
      + k.cheeks(66, 72, 96, 72, 4.5)
      + k.eye(72, 58, 8, { look: [0.6, 0] }) + k.eye(90, 58, 7, { look: [0.6, 0] })
      + k.line('M62 46 Q70 42 80 47 M84 47 Q92 44 98 48', k.ink, 3)
      + (k.D ? k.g(k.c(0, 0, 6, '#bfefff', 2.2) + k.c(13, 0, 6, '#bfefff', 2.2), 'translate(62 36) rotate(-10)')
        : k.line('M60 36 Q74 30 100 40', '#3b3b45', 3) + k.c(70, 33, 6, '#bfefff', 2.2) + k.c(84, 34, 6, '#bfefff', 2.2) + k.c(70, 33, 6, 'none', 0, 'stroke="#ffd23f" stroke-width="2"') + k.c(84, 34, 6, 'none', 0, 'stroke="#ffd23f" stroke-width="2"'))
      + k.mouth('laugh', 84, 76, 10)
      + k.limb(k.D ? 'M100 76 Q108 84 108 92' : 'M100 72 Q110 66 112 56', B) + k.hand(k.D ? 108 : 112, k.D ? 92 : 56);
  } },

  /* Snail with a swirly shell and two eyeball stalks looking in opposite directions */
  'lost-safety': { top: [96, 30], shadow: [60, 50], draw(k){
    const B = '#7fd0f5', SH = '#ff9ec7', SP = '#d6458f';
    const body = 'M10 114 C8 106 18 102 32 102 H84 C84 90 84 74 88 64 C92 52 108 52 110 64 C112 78 106 94 108 110 C108 115 104 116 100 116 H16 C12 116 10 116 10 114 Z';
    let sp = 'M50 74';
    for (let t = 0.3; t <= 22.5; t += 0.3){ const r = 1.2 + t * 1.12; sp += ` L${(50 + Math.cos(t) * r).toFixed(1)} ${(74 + Math.sin(t) * r).toFixed(1)}`; }
    const stalkL = k.D ? 'M94 58 Q90 46 82 44' : 'M94 58 Q88 42 84 32', stalkR = k.D ? 'M102 58 Q108 48 114 50' : 'M102 58 Q108 44 110 34';
    return k.a('sway', '50% 100%', k.limb(stalkL, B, 3.2) + k.eye(k.D ? 81 : 84, k.D ? 42 : 30, 7, { look: [-0.7, -0.3] }))
      + k.a('sway2', '50% 100%', k.limb(stalkR, B, 3.2) + k.eye(k.D ? 113 : 110, k.D ? 48 : 32, 6.5, { look: [0.7, 0.5] }))
      + k.body(body, B, { shine: [94, 66, 3, 7, 0], inner: k.c(26, 108, 2.4, '#fff', 0, 'opacity=".5"') + k.c(76, 110, 2, '#fff', 0, 'opacity=".5"') })
      + k.cheeks(92, 76, 107, 76, 3.6)
      + k.mouth('wavy', 99, 86, 6)
      + k.body('M50 46 A28 28 0 1 1 49.9 46 Z', SH, { shine: [38, 58, 6, 4, -35], inner: k.line(sp, SP, 3) })
      + (k.D ? '' : `<text x="22" y="40" font-size="20" font-weight="900" font-family="Arial, sans-serif" fill="#7a5cd6" stroke="${k.ink}" stroke-width="1.2" text-anchor="middle">?</text>`);
  } },

  /* Lime blob wobbling on a unicycle, no helmet, magenta mohawk, buck teeth, freckles */
  'bike-safety': { top: [60, 24], shadow: [60, 20], draw(k){
    const B = '#9fd64a', MO = '#e8559b', RED = '#ff5a5a';
    const body = 'M60 28 C80 28 90 44 90 60 C90 76 78 86 60 86 C42 86 30 76 30 60 C30 44 40 28 60 28 Z';
    const wheel = k.c(60, 104, 13, '#3b3b45', 2.6) + k.c(60, 104, 8.5, '#d9dde3', 1.6) + k.line('M60 96 V112 M52 104 H68 M54 98 L66 110 M66 98 L54 110', '#8a909a', 1.2) + k.c(60, 104, 2.4, RED, 1.4);
    const top = k.p('M44 36 Q40 20 50 26 Q50 10 58 22 Q62 8 68 22 Q76 12 76 28 Q82 26 78 36 Z', MO, 2.4)
      + k.limb(k.D ? 'M33 62 Q20 72 18 84' : 'M33 60 Q20 48 8 54', B) + k.hand(k.D ? 18 : 8, k.D ? 84 : 54)
      + k.limb(k.D ? 'M87 62 Q100 72 102 84' : 'M87 58 Q98 64 106 52', B) + k.hand(k.D ? 102 : 106, k.D ? 84 : 52)
      + k.body(body, B, { shine: [46, 40, 7, 5, -30] })
      + k.cheeks(40, 66, 80, 66, 4.5) + k.c(38, 62, 1.1, '#5a7a1e', 0) + k.c(42, 63, 1.1, '#5a7a1e', 0) + k.c(78, 62, 1.1, '#5a7a1e', 0) + k.c(82, 63, 1.1, '#5a7a1e', 0)
      + k.eye(50, 52, 8, { look: [-0.4, 0] }) + k.eye(71, 50, 9.5, { look: [0.4, -0.2] })
      + k.mouth('buck', 60, 68, 9);
    return wheel + k.limb('M60 102 V84', RED, 3.4) + k.e(60, 84, 10, 3.6, RED, 2.2)
      + k.limb('M51 84 L52 98', B, 4) + k.limb('M69 84 L68 108', B, 4) + k.e(52, 100, 5, 3, '#3d8bff', 1.8) + k.e(68, 109, 5, 3, '#3d8bff', 1.8)
      + (k.D ? k.g(top, 'rotate(18 60 86)') : k.a('wobble', '50% 100%', k.g(top, 'rotate(8 60 86)')))
      + (k.D ? '' : k.line('M38 98 Q34 104 38 110 M82 98 Q86 104 82 110', k.ink, 1.8));
  } },

  /* Floating ghost sheet glued to a glowing phone, with a dreamy thought bubble */
  'awareness-safety': { top: [60, 16], shadow: [60, 22], draw(k){
    const B = '#d6f5f1';
    const body = 'M60 16 C84 16 94 36 94 58 V96 Q88 106 82 96 Q76 108 70 98 Q64 110 58 98 Q52 108 46 98 Q40 106 34 96 Q30 104 26 96 V58 C26 36 36 16 60 16 Z';
    const phone = k.D ? k.g(k.r(-10, -6, 20, 12, 3, '#2f3b66', 2.2) + k.r(-7, -3.5, 14, 7, 1.5, '#55606f', 0), 'translate(96 112) rotate(-8)')
      : k.r(49, 62, 22, 24, 4, '#2f3b66', 2.4) + k.r(52, 65, 16, 18, 2, '#7fe0ff', 0) + k.p('M60 78 l-3.5 -3.5 a2.2 2.2 0 0 1 3.5 -2.6 a2.2 2.2 0 0 1 3.5 2.6 Z', '#ff6fa5', 0);
    return k.a('float', '50% 50%',
      k.body(body, B, { dark: '#a9ded8', shine: [44, 32, 7, 10, -20] })
      + k.line('M60 17 C57 8 66 5 67 11 C67 15 62 15 62 12', k.ink, 2.4)
      + (k.D ? '' : `<path d="M50 62 L42 46 H78 L70 62 Z" fill="#bff3ff" opacity=".45"/>`)
      + k.cheeks(40, 54, 80, 54, 4.5)
      + k.eye(49, 44, 7, { look: [0.2, 0.7], lid: 'sleepy', lidColor: '#bfe9e3' }) + k.eye(71, 44, 7, { look: [0.2, 0.7], lid: 'sleepy', lidColor: '#bfe9e3' })
      + k.mouth('o', 60, 55, 5)
      + k.limb(k.D ? 'M28 64 Q24 76 26 84' : 'M28 64 Q38 74 49 74', B, 4.6) + k.limb(k.D ? 'M92 64 Q96 76 94 84' : 'M92 64 Q82 74 71 74', B, 4.6)
      + phone)
      + (k.D ? '' : k.c(88, 28, 2, '#fff', 1.6) + k.c(94, 21, 3, '#fff', 1.8) + k.puff([[104, 12, 6], [112, 11, 5], [108, 6, 4.5]], '#fff', 1.8) + k.spark(108, 10, 2.6));
  } },

  /* Tiny round body on huge ostrich legs, sweatband, tiny useless feathered wings */
  'elopement-safety': { top: [58, 16], shadow: [62, 26], draw(k){
    const B = '#ffd23f', LEG = '#ff8c42', BAND = '#3d8bff';
    const body = 'M58 18 A22 22 0 1 1 57.9 18 Z';
    const toes = (x, y, r) => k.g(k.limb('M0 0 l8 2 M0 0 l6 6 M0 0 l-2 7', LEG, 2.4), `translate(${x} ${y}) rotate(${r})`);
    const legs = k.D
      ? k.limb('M50 58 L38 84 L44 106', LEG, 4.4) + toes(44, 106, 0) + k.limb('M66 58 L80 84 L76 106', LEG, 4.4) + toes(76, 106, 0)
      : k.limb('M52 58 L44 84 L54 106', LEG, 4.4) + toes(54, 106, 0) + k.limb('M66 58 L86 74 L100 70', LEG, 4.4) + toes(100, 70, -70);
    return (k.D ? '' : k.line('M6 32 H22 M2 44 H20 M8 56 H22', k.ink, 2.4, 'opacity=".55"') + k.puff([[18, 110, 5], [28, 112, 6], [10, 104, 3.5]], '#e6e1d6', 1.8))
      + legs
      + k.limb(k.D ? 'M40 48 Q34 58 36 66' : 'M38 46 Q30 52 28 60', B, 4.2) + k.hand(k.D ? 36 : 28, k.D ? 66 : 60, 4.4)
      + k.line('M54 19 C50 8 56 4 57 12 M60 19 C61 7 68 6 64 16', k.ink, 2.6)
      + k.body(body, B, { shine: [48, 30, 6, 4, -30], inner: k.c(70, 52, 3, '#ffb02e', 0) + k.c(42, 52, 2.2, '#ffb02e', 0) + k.c(76, 44, 2, '#ffb02e', 0) })
      + k.clip(body, k.r(30, 24, 60, 7, 0, BAND, 0) + k.r(30, 26.5, 60, 2, 0, '#fff', 0)) + k.line('M37 24 H80 M37 31 H80', k.ink, 1.6)
      + (k.D ? '' : k.p('M37 27 L24 22 L26 32 Z', BAND, 2))
      + k.cheeks(44, 48, 72, 48, 3.8)
      + k.eye(52, 40, 6.5, { look: [0.6, 0] }) + k.eye(66, 40, 6.5, { look: [0.6, 0] })
      + k.mouth('tongue', 59, 51, 8)
      + k.a('flap', '0% 60%', k.p(k.D ? 'M78 46 C84 52 88 58 86 62 C82 60 80 58 76 52 Z' : 'M78 38 C86 30 96 32 98 36 C94 38 96 40 92 42 C94 44 92 46 88 46 C84 48 80 46 78 44 Z', '#ffe98a', 2.2));
  } },

  /* Magenta tornado with crossed eyes, a propeller beanie and a whisk, debris orbiting */
  'safehelper-safety': { top: [60, 18], shadow: [58, 18], draw(k){
    const B = '#e06bd2', SW = '#7fe6d4';
    const body = 'M20 30 C20 18 100 18 100 30 C100 44 92 52 86 62 C80 72 74 84 68 96 C64 104 62 110 58 114 C54 110 52 102 50 94 C46 80 40 70 32 60 C26 52 20 42 20 30 Z';
    const whisk = k.line('M104 42 L108 30', '#8a5a2b', 3.4) + k.e(110, 22, 3.6, 8, 'none', 1.8, 'transform="rotate(14 110 22)"') + k.e(110, 22, 1.4, 8, 'none', 1.6, 'transform="rotate(14 110 22)"');
    return (k.D ? '' : k.a('orbit', '50% 50%', `<text x="12" y="84" font-size="16" font-weight="900" font-family="Arial, sans-serif" fill="#ffd23f" stroke="${k.ink}" stroke-width="1.2" text-anchor="middle">?</text>`
        + k.g(k.r(-8, -5, 16, 10, 2, '#fff', 1.8) + k.r(-8, -5, 16, 3.4, 1.5, '#3d8bff', 0) + k.line('M-4 2 H4', k.ink, 1.4), 'translate(106 76) rotate(18)') + k.spark(18, 104, 3.4, SW)))
      + k.limb(k.D ? 'M32 52 Q22 60 20 70' : 'M32 50 Q18 50 12 42', B, 4.6) + k.hand(k.D ? 20 : 12, k.D ? 70 : 42, 4.8)
      + k.limb(k.D ? 'M88 52 Q98 60 100 70' : 'M88 52 Q100 50 104 42', B, 4.6)
      + (k.D ? k.hand(100, 70, 4.8) : whisk + k.hand(104, 42, 4.8))
      + k.a('wobble', '50% 100%',
        k.body(body, B, { inner: k.line('M22 40 Q60 52 98 38 M30 62 Q60 72 88 58 M40 80 Q60 88 78 76 M48 96 Q58 100 68 94', SW, 4.4) + k.e(60, 24, 36, 5, villainShade(B, 0.18), 0) })
        + k.cheeks(36, 46, 84, 46, 4)
        + k.eye(46, 36, 8, { look: [-0.6, -0.6] }) + k.eye(72, 38, 6, { look: [0.7, 0.6] })
        + k.mouth('grin', 60, 50, 7)
        + k.p('M52 21 A8 8 0 0 1 68 21 Z', '#ffd23f', 2) + k.line('M60 13 V9', k.ink, 2)
        + k.a('spin', '50% 50%', k.e(53, 9, 7, 2.4, '#ff5a5a', 1.6) + k.e(67, 9, 7, 2.4, '#3d8bff', 1.6)) + k.c(60, 9, 1.8, k.ink, 0));
  } },

  /* Ice cube with icicle horns, a wool beanie, a drippy nose and chattering teeth */
  'emergency-safety': { top: [62, 12], shadow: false, draw(k){
    const B = '#bfe9ff', DEEP = '#5aa6dd', HAT = '#ff5d6c';
    const front = 'M30 40 H84 Q90 40 90 46 V94 Q90 100 84 100 H30 Q24 100 24 94 V46 Q24 40 30 40 Z';
    return k.e(60, 116, 38, 4.5, '#9fdcff', 0, 'opacity=".75"')
      + k.p('M26 41 L38 29 H98 L89 40 Z', '#e8f8ff', 2.6) + k.p('M89 40 L98 29 V87 L89 99 Z', '#9fd4f2', 2.6)
      + k.p('M38 33 Q36 18 42 8 Q46 20 49 32 Z', '#f2fbff', 2.2) + k.p('M80 32 Q82 18 90 9 Q91 22 90 31 Z', '#f2fbff', 2.2)
      + k.e(40, 108, 9, 5, DEEP, 2.4) + k.e(74, 108, 9, 5, DEEP, 2.4)
      + k.limb('M25 70 Q14 72 12 80', B, 4.6) + k.hand(12, 80, 5, '#fff') + k.limb('M97 66 Q108 70 108 78', B, 4.6) + k.hand(108, 78, 5, '#fff')
      + k.body(front, B, { dark: '#9fd4f2', shine: [36, 50, 5, 9, 0], inner: k.r(78, 46, 4, 34, 2, '#fff', 0, 'opacity=".5"') })
      + k.g(k.p('M54 30 A11 10 0 0 1 76 30 Z', HAT, 2.2) + k.r(52, 27, 26, 5, 2.5, '#ffd0d5', 2) + k.c(65, 19, 4, '#fff', 2), k.D ? 'rotate(-30 65 30) translate(-8 4)' : 'rotate(-6 65 30)')
      + k.cheeks(36, 74, 80, 74, 4.5)
      + k.eye(45, 60, 8, { look: [0, -0.3] }) + k.eye(70, 60, 8, { look: [0, -0.3] })
      + k.line('M37 48 L52 45 M63 45 L78 48', k.ink, 3)
      + k.e(58, 71, 4.2, 3.4, '#8fc6ee', 2) + (k.D ? '' : k.p('M58 75 Q54.5 81 58 84 Q61.5 81 58 75 Z', '#9fe0ff', 1.6))
      + k.mouth('chatter', 58, 88, 9)
      + (k.D ? k.p('M58 75 Q55 79 58 81 Q61 79 58 75 Z', '#9fe0ff', 1.4) : k.a('shiver', '50% 50%', k.line('M14 52 Q10 58 14 64 M8 48 Q2 58 8 68 M106 44 Q110 52 106 58 M112 40 Q118 50 112 60', DEEP, 2.2)))
      + k.spark(100, 102, 3, '#fff') + k.spark(18, 34, 3, '#fff');
  } },

  /* Puffy smoke cloud wearing a brick-chimney top hat, hugging a teddy it grabbed */
  'fire-safety': { top: [36, 24], shadow: [60, 30], draw(k){
    const B = '#a8aeb8', HAT = '#3d3d48', BRICK = '#c95f3f';
    const body = 'M28 106 C12 106 8 88 20 80 C10 66 22 50 38 54 C40 40 56 34 66 42 C76 32 96 38 96 52 C110 54 114 72 104 80 C114 90 106 106 92 106 Z';
    const teddy = k.e(104, 104, 6.5, 7, '#c98b52', 2) + k.c(100, 93.5, 2.4, '#c98b52', 1.6) + k.c(109, 93.5, 2.4, '#c98b52', 1.6) + k.c(104.5, 97, 5.5, '#c98b52', 2) + k.c(102.6, 96.4, 0.9, k.ink, 0) + k.c(106.6, 96.4, 0.9, k.ink, 0) + k.e(104.6, 99, 1.8, 1.3, '#f1d2ad', 0);
    const smoke = k.a('puff', '0% 100%', k.puff([[80, 10, 4.5], [90, 7, 5.5], [101, 10, 4.5]], '#d8dce2', 1.8));
    return (k.D ? '' : smoke)
      + k.e(40, 110, 8, 4.5, '#5a5f68', 2.2) + k.e(78, 110, 8, 4.5, '#5a5f68', 2.2)
      + k.limb(k.D ? 'M20 84 Q10 90 10 100' : 'M20 84 Q8 80 8 68', B) + k.hand(k.D ? 10 : 8, k.D ? 100 : 68)
      + k.body(body, B, { shine: [36, 64, 7, 4, -25] })
      + k.g(k.r(48, 16, 26, 26, 2, BRICK, 2.4) + k.line('M48 25 H74 M48 33 H74 M58 16 V25 M66 25 V33 M56 33 V42', '#8a3a24', 1.6) + k.r(45, 12, 32, 6, 2, HAT, 2.2) + k.r(38, 40, 46, 5, 2.5, HAT, 2.2), k.D ? 'rotate(16 60 44) translate(4 2)' : 'rotate(-4 60 44)')
      + k.cheeks(36, 80, 84, 80, 5) + k.c(32, 86, 1.3, '#5a5f68', 0) + k.c(36, 89, 1.3, '#5a5f68', 0) + k.c(84, 86, 1.3, '#5a5f68', 0) + k.c(88, 89, 1.3, '#5a5f68', 0)
      + k.eye(48, 70, 8, { look: [0.2, 0.3], lid: 'sleepy', lidColor: '#8e949e' }) + k.eye(72, 70, 8, { look: [0.2, 0.3], lid: 'sleepy', lidColor: '#8e949e' })
      + k.mouth('toothy', 60, 86, 11)
      + (k.D ? k.limb('M100 84 Q108 92 108 100', B) + k.hand(108, 100) + k.g(teddy, 'translate(-84 6) rotate(-20 104 104)')
        : k.limb('M100 84 Q108 90 106 98', B) + teddy + k.hand(100, 100));
  } },

  /* Wide craggy rock lump with purple crystal spikes, moss, three eyes and a unibrow */
  'earthquake-safety': { top: [62, 34], shadow: [60, 50], draw(k){
    const B = '#cfa46c', CR = '#b48cf0';
    const body = 'M10 112 C8 96 14 84 22 76 C24 62 34 52 48 50 C54 40 70 38 80 46 C92 46 102 56 104 68 C112 76 114 92 110 112 Z';
    const crystal = (x, y, h, r) => k.g(k.p(`M-5 0 L-5 ${-h + 5} L0 ${-h} L5 ${-h + 5} L5 0 Z`, CR, 2.2) + k.line(`M0 ${-h + 1} V-2`, '#fff', 1.4, 'opacity=".7"'), `translate(${x} ${y}) rotate(${r})`);
    const shake = k.D ? '' : k.line('M3 94 Q0 100 3 106 M117 90 Q120 98 117 104', k.ink, 1.8) + k.c(4, 114, 2.4, '#a07c4a', 1.4) + k.c(116, 112, 2, '#a07c4a', 1.4);
    return shake
      + crystal(46, 56, 20, -25) + crystal(62, 46, 24, 0) + crystal(80, 52, 18, 25)
      + k.e(32, 114, 13, 5, '#8a6a3e', 2.4) + k.e(88, 114, 13, 5, '#8a6a3e', 2.4)
      + k.limb(k.D ? 'M18 92 Q8 98 8 108' : 'M18 88 Q6 84 7 72', B, 6) + k.hand(k.D ? 8 : 7, k.D ? 108 : 72, 6, '#b8915c')
      + k.limb(k.D ? 'M104 92 Q112 98 112 108' : 'M104 88 Q114 84 112 72', B, 6) + k.hand(112, k.D ? 108 : 72, 6, '#b8915c')
      + k.a('rumble', '50% 100%',
        k.body(body, B, { shine: [36, 66, 8, 4, -30], inner: k.line('M88 60 L93 68 L89 74 L95 82 M24 96 L30 100 L28 106 M60 104 L64 110', '#8a6a3e', 2) + k.c(84, 96, 3, '#b8915c', 0) + k.c(34, 86, 2.4, '#b8915c', 0) })
        + k.p('M22 76 Q22 68 28 69 Q30 62 36 65 Q40 59 45 63 Q42 67 36 69 Q30 72 22 78 Z', '#7cbf4a', 2)
        + k.cheeks(32, 88, 84, 88, 4.5)
        + k.eye(40, 78, 6, { look: [0, 0.2] }) + k.eye(58, 73, 7, { look: [0, 0.2] }) + k.eye(76, 78, 6, { look: [0, 0.2] })
        + k.line('M30 67 Q40 59 50 64 Q58 60 66 64 Q76 59 86 67', k.ink, 4.4)
        + k.mouth('toothy', 58, 94, 13));
  } },

  /* Periwinkle dino with aqua back plates, tiny T-rex arms, yellow rain boots and its own rain cloud */
  'rainyweather-safety': { top: [70, 22], shadow: [64, 34], draw(k){
    const B = '#7f9cff', BL = '#dbe5ff', PL = '#5fe0cf', BOOT = '#ffd23f';
    const body = 'M44 104 C34 96 34 76 44 66 C42 56 44 40 56 32 C68 24 86 26 98 36 C106 42 106 54 96 58 C90 60 84 62 82 66 C92 76 94 96 84 104 C74 112 54 112 44 104 Z';
    const plate = (x, y, r, s) => k.g(k.p(`M${-s} 0 Q${-s * 0.25} ${-s * 1.5} 0 ${-s * 1.7} Q${s * 0.25} ${-s * 1.5} ${s} 0 Z`, PL, 2), `translate(${x} ${y}) rotate(${r})`);
    const boot = x => k.p(`M${x - 6} 102 H${x + 5} V110 Q${x + 12} 110 ${x + 12} 114 V116 H${x - 6} Z`, BOOT, 2.2);
    const cloud = k.puff([[60, 15, 6], [70, 11.5, 8], [81, 15, 6]], '#cfd8e8', 2) + k.r(56, 15, 30, 5, 2.5, '#cfd8e8', 0)
      + (k.D ? '' : k.a('rain', '50% 0%', k.p('M62 22 q-2 4 0 5 q2 -1 0 -5 Z M74 23 q-2 4 0 5 q2 -1 0 -5 Z M85 21 q-2 4 0 5 q2 -1 0 -5 Z', '#5aa0f0', 1.2)));
    return k.e(66, 116, 30, 4, '#8ec8ff', 0, 'opacity=".7"')
      + k.a('wag', '100% 50%', k.limb('M44 92 C30 98 16 100 10 92 C6 86 10 80 16 84', B, 7) + plate(22, 96, -150, 3.5) + plate(12, 88, -110, 3))
      + plate(52, 33, -40, 5) + plate(44, 46, -62, 5.5) + plate(40, 62, -80, 5.5) + plate(39, 78, -95, 5) + plate(40, 92, -112, 4.5)
      + boot(52) + boot(76)
      + k.body(body, B, { shine: [64, 36, 8, 4, -15], inner: k.e(64, 88, 14, 15, BL, 0) + k.line('M54 82 H74 M52 90 H76 M55 98 H73', villainShade(BL, 0.12), 1.6) })
      + k.c(98, 41, 1.4, k.ink, 0) + k.c(102, 43, 1.4, k.ink, 0)
      + k.cheeks(84, 50, 84, 50, 4)
      + k.eye(72, 42, 8.5, { look: [0.5, -0.1] }) + k.line('M63 31 Q72 27 81 32', k.ink, 3)
      + k.mouth('grin', 90, 52, 8)
      + k.limb(k.D ? 'M82 72 Q86 78 84 82' : 'M82 72 Q88 72 91 76', B, 3.6) + k.hand(k.D ? 84 : 91, k.D ? 82 : 76, 3.2)
      + (k.D ? k.g(cloud, 'translate(-26 16) rotate(-12 70 12)') : k.a('float', '50% 50%', cloud))
      + (k.D ? '' : k.p('M46 110 q-6 -6 -10 -2 M90 110 q6 -6 10 -2', 'none', 1.8));
  } },

  /* Coral jelly-octopus: curly tentacles, swim goggles, a captain's cap */
  'water-safety': { top: [60, 12], shadow: [60, 34], draw(k){
    const B = '#ff8a78', SPOT = '#ffc2b5', NAVY = '#2e4a8a', LENS = '#2ec4c4';
    const head = 'M60 22 C86 22 98 40 98 58 C98 70 92 76 84 78 H36 C28 76 22 70 22 58 C22 40 34 22 60 22 Z';
    const t = (d, cls, o) => k.a(cls, o, k.limb(d, B, 6.4));
    const wave = k.D ? 'M88 74 C98 80 104 90 108 100 q2 6 -4 6' : 'M88 70 C98 64 106 52 104 40 q-1 -6 -6 -4';
    return (k.D ? '' : k.p('M8 58 q-2 4 0 5 q2 -1 0 -5 Z M14 48 q-2 4 0 5 q2 -1 0 -5 Z M112 94 q-2 4 0 5 q2 -1 0 -5 Z', '#7fd6ff', 1.4))
      + t('M32 74 C24 86 18 96 12 102 q-5 4 -6 -2', 'wiggle', '100% 0%') + t('M42 76 C40 90 34 100 30 108 q-2 6 4 6', 'wiggle2', '50% 0%')
      + t('M54 78 C54 92 50 102 52 110 q2 5 7 2', 'wiggle', '50% 0%') + t('M66 78 C66 92 70 102 68 110 q-2 5 -7 2', 'wiggle2', '50% 0%')
      + t('M78 76 C80 90 86 100 90 108 q2 6 -4 6', 'wiggle', '0% 0%') + t(wave, 'wave', '0% 100%')
      + k.c(100, 50, 1.6, SPOT, 0) + k.c(102, 58, 1.6, SPOT, 0)
      + k.body(head, B, { shine: [40, 34, 8, 5, -30], inner: k.c(84, 30, 3.5, SPOT, 0) + k.c(30, 66, 3, SPOT, 0) + k.c(92, 66, 2.4, SPOT, 0) })
      + k.cheeks(34, 66, 86, 66, 4.5)
      + k.line('M22 50 H98', NAVY, 3.6)
      + k.eye(47, 50, 7, { look: [0.1, 0.2] }) + k.eye(73, 50, 7, { look: [0.1, 0.2] })
      + k.c(47, 50, 10, 'none', 0, `stroke="${LENS}" stroke-width="4"`) + k.c(73, 50, 10, 'none', 0, `stroke="${LENS}" stroke-width="4"`)
      + k.c(47, 50, 12, 'none', 1.6) + k.c(73, 50, 12, 'none', 1.6) + k.line('M58 50 H62', LENS, 3)
      + k.mouth('laugh', 60, 64, 8)
      + k.g(k.p('M46 22 Q46 8 60 8 Q74 8 74 22 Z', '#fff', 2.2) + k.r(44, 18, 32, 6, 3, NAVY, 2) + k.p('M46 24 Q60 30 74 24', 'none', 0, `stroke="${NAVY}" stroke-width="4" stroke-linecap="round"`) + k.c(60, 14, 2.6, '#ffd23f', 1.4), k.D ? 'rotate(-24 60 24) translate(-6 2)' : 'rotate(8 60 24)');
  } },

  /* Mint wrapped candy with cat ears, whiskers and a curly striped tail */
  'home-safety': { top: [60, 34], shadow: [60, 30], draw(k){
    const B = '#8fe0b0', PK = '#ff7fb5';
    const body = 'M60 50 C80 50 92 64 92 78 C92 92 80 104 60 104 C40 104 28 92 28 78 C28 64 40 50 60 50 Z';
    return k.a('wag', '0% 50%', k.limb('M80 98 C96 106 110 104 110 90 C110 82 102 82 102 88', B, 5) + k.line('M94 104 l1 -5 M104 100 l-3 -3', PK, 2.4))
      + k.p('M40 58 L34 36 L56 52 Z', B, 2.4) + k.p('M41 54 L38 42 L50 52 Z', PK, 0)
      + k.p('M80 58 L86 36 L64 52 Z', B, 2.4) + k.p('M79 54 L82 42 L70 52 Z', PK, 0)
      + k.p('M30 74 L8 60 Q4 78 8 96 L30 82 Z', PK, 2.4) + k.line('M10 66 L28 75 M8 78 H28 M10 90 L28 81', '#fff', 1.6)
      + k.p('M90 74 L112 60 Q116 78 112 96 L90 82 Z', PK, 2.4) + k.line('M110 66 L92 75 M112 78 H92 M110 90 L92 81', '#fff', 1.6)
      + k.e(48, 108, 7, 4.5, B, 2.2) + k.e(72, 108, 7, 4.5, B, 2.2)
      + k.body(body, B, { shine: [42, 62, 7, 4, -30], inner: k.line('M30 60 L58 106 M48 50 L82 106 M70 48 L96 86', '#fff', 5, 'opacity=".45"') })
      + k.c(29, 78, 4, PK, 2) + k.c(91, 78, 4, PK, 2)
      + k.cheeks(42, 82, 78, 82, 4.5)
      + k.eye(49, 70, 7, { slit: true, look: [0.5, 0], lid: 'shifty', lidColor: '#6fcf98' }) + k.eye(71, 70, 7, { slit: true, look: [0.5, 0], lid: 'shifty', lidColor: '#6fcf98' })
      + k.p('M57 79 H63 L60 82 Z', PK, 1.4) + k.mouth('cat', 60, 84, 5.5)
      + k.line('M42 82 H28 M42 86 L29 90 M78 82 H92 M78 86 L91 90', k.ink, 1.6);
  } },

  /* Cracked egg with scribbly hair, four flailing arms and chicken feet */
  'plan-safety': { top: [60, 20], shadow: [60, 22], draw(k){
    const B = '#ffc83a', SHELL = '#fff4da', FT = '#ff8a3d';
    const body = 'M60 18 C80 18 92 46 92 70 C92 92 80 106 60 106 C40 106 28 92 28 70 C28 46 40 18 60 18 Z';
    const zig = 'M20 76 L30 68 L38 78 L48 68 L56 78 L66 68 L74 78 L84 68 L92 78 L100 70';
    const foot = x => k.limb(`M${x} 104 V110 M${x} 110 l-5 4 M${x} 110 v5 M${x} 110 l5 4`, FT, 2.2);
    const arms = k.D
      ? k.limb('M30 60 Q20 68 18 78', B, 4) + k.hand(18, 78, 4.6) + k.limb('M90 60 Q100 68 102 78', B, 4) + k.hand(102, 78, 4.6)
      : k.a('flail', '100% 100%', k.limb('M31 56 Q18 48 13 34', B, 4) + k.hand(13, 34, 4.6)) + k.limb('M29 82 Q16 88 11 98', B, 4) + k.hand(11, 98, 4.6)
        + k.a('flail2', '0% 100%', k.limb('M89 56 Q102 46 107 32', B, 4) + k.hand(107, 32, 4.6)) + k.limb('M91 82 Q104 88 109 98', B, 4) + k.hand(109, 98, 4.6);
    return arms + foot(48) + foot(72)
      + k.body(body, B, { shine: [46, 34, 5, 9, -20], inner: k.p(zig + ' V124 H20 Z', SHELL, 0) + k.line(zig, k.ink, 2.2) + k.line('M44 86 L48 92 L46 98 M76 88 L72 94', '#d8c8a0', 1.6) })
      + k.line(k.D ? 'M50 22 C48 16 56 14 56 20 M60 20 C60 14 68 14 66 20' : 'M50 22 C44 10 56 8 54 18 C52 6 66 4 62 16 C64 6 76 10 68 20 M46 18 q-6 -2 -6 -8', k.ink, 2.4)
      + k.cheeks(39, 60, 81, 60, 4.5)
      + k.eye(50, 46, 8, { look: [-0.6, -0.5] }) + k.eye(70, 48, 8, { look: [0.6, 0.6] })
      + k.mouth('laugh', 60, 59, 8)
      + (k.D ? '' : k.line('M7 50 l-3 -2 M6 60 h-3 M113 50 l3 -2 M114 60 h3', k.ink, 1.8));
  } },

  /* Chartreuse germ puffball with purple bobble nubs, three eyes and a party hat */
  'firstaid-safety': { top: [44, 34], shadow: [60, 26], draw(k){
    const B = '#b5cf3a', NUB = '#8a5cc0', HAT = '#ff7ab8';
    const body = 'M60 40 A28 28 0 1 1 59.9 40 Z';
    let nubs = '';
    for (let a = 0; a < 360; a += 32){
      if (a > 55 && a < 125) continue; if (a > 240 && a < 300) continue;
      const rad = a * Math.PI / 180, cx = 60 + Math.cos(rad) * 35, cy = 68 + Math.sin(rad) * 35;
      nubs += k.line(`M${(60 + Math.cos(rad) * 26).toFixed(1)} ${(68 + Math.sin(rad) * 26).toFixed(1)} L${cx.toFixed(1)} ${cy.toFixed(1)}`, k.ink, 3) + k.c(cx, cy, 4.6, NUB, 2);
    }
    return (k.D ? '' : k.a('puff', '50% 100%', k.line('M10 40 q4 -4 0 -8 q-4 -4 0 -8 M110 44 q4 -4 0 -8 q-4 -4 0 -8', '#8fae2a', 2.2)))
      + nubs
      + k.limb('M46 92 L44 104', B, 4) + k.limb('M56 95 L55 107', B, 4) + k.limb('M66 95 L67 107', B, 4) + k.limb('M76 91 L78 103', B, 4)
      + k.e(43, 106, 4.6, 3, NUB, 1.8) + k.e(54, 109, 4.6, 3, NUB, 1.8) + k.e(68, 109, 4.6, 3, NUB, 1.8) + k.e(79, 105, 4.6, 3, NUB, 1.8)
      + k.body(body, B, { shine: [46, 52, 7, 4, -30], inner: k.c(82, 82, 4, '#8fae2a', 0) + k.c(38, 86, 3, '#8fae2a', 0) + k.c(78, 52, 2.6, '#8fae2a', 0) })
      + k.cheeks(40, 74, 80, 74, 4.4)
      + k.eye(45, 62, 6.4, { look: [-0.3, 0] }) + k.eye(60, 55, 7.6, { look: [0, -0.3] }) + k.eye(75, 62, 6.4, { look: [0.3, 0] })
      + k.mouth('tongue', 60, 76, 11)
      + k.g(k.p('M50 44 L63 12 L74 42 Q62 47 50 44 Z', HAT, 2.2) + k.line('M55 33 Q63 35 70 32 M59 23 Q63 24 67 22', '#ffd23f', 3) + k.c(63, 11, 4, '#ffd23f', 1.8), k.D ? 'rotate(-50 62 44) translate(-2 6)' : 'rotate(8 62 44)');
  } },

  /* Tiny apricot body with enormous noodle arms ending in giant grabby gloves */
  'seizure-safety': { top: [60, 58], shadow: [60, 26], draw(k){
    const B = '#ffab5e', CUFF = '#9b6ad8';
    const body = 'M60 64 C74 64 80 76 80 88 C80 100 72 106 60 106 C48 106 40 100 40 88 C40 76 46 64 60 64 Z';
    const glove = (x, y, rot, flip) => k.g(
      k.e(-7, -9, 3.6, 7, '#fff', 2, 'transform="rotate(-22 -7 -9)"') + k.e(0, -12, 3.6, 7.5, '#fff', 2) + k.e(7, -9, 3.6, 7, '#fff', 2, 'transform="rotate(22 7 -9)"')
      + k.e(-11, 0, 3.4, 5.5, '#fff', 2, 'transform="rotate(-60 -11 0)"') + k.c(0, 0, 9, '#fff', 2.2) + k.r(-8, 7, 16, 6, 2.5, CUFF, 2), `translate(${x} ${y}) rotate(${rot}) scale(${flip} 1)`);
    const arms = k.D
      ? k.limb('M44 86 C34 90 28 96 26 100', B, 5) + k.g(glove(0, 0, -80, 1), 'translate(26 101) scale(.8)') + k.limb('M76 86 C86 90 92 96 94 100', B, 5) + k.g(glove(0, 0, 80, -1), 'translate(94 101) scale(.8)')
      : k.limb('M46 80 C36 72 28 60 26 46', B, 5) + k.a('grab', '50% 100%', glove(24, 34, -18, 1)) + k.limb('M74 80 C84 72 92 60 94 46', B, 5) + k.a('grab2', '50% 100%', glove(96, 34, 18, -1));
    return arms
      + k.limb('M52 104 V110', B, 4.4) + k.limb('M68 104 V110', B, 4.4) + k.e(48, 112, 9, 4.5, CUFF, 2.2) + k.e(72, 112, 9, 4.5, CUFF, 2.2)
      + k.limb('M54 65 Q50 56 46 52', B, 2.4) + k.c(46, 51, 3.6, CUFF, 1.8) + k.limb('M66 65 Q70 56 74 52', B, 2.4) + k.c(74, 51, 3.6, CUFF, 1.8)
      + k.body(body, B, { shine: [50, 74, 4, 6, -20] })
      + k.cheeks(46, 90, 74, 90, 3.8)
      + k.eye(53, 81, 6, { look: [0, -0.6] }) + k.eye(67, 81, 6, { look: [0, -0.6] })
      + k.mouth('buck', 60, 93, 6.5)
      + (k.D ? '' : k.line('M8 20 l-4 -4 M12 14 l-2 -6 M112 20 l4 -4 M108 14 l2 -6', k.ink, 1.8));
  } },

  /* Pink elephant-ish blob with flappy ears and a trunk aimed at a bubble */
  'body-boundaries-safety': { top: [60, 30], shadow: [60, 30], draw(k){
    const B = '#ff8fc0', BL = '#ffd3e6', BUB = 'rgba(190,230,255,.6)';
    const body = 'M60 34 C82 34 94 52 94 74 C94 98 80 110 60 110 C40 110 26 98 26 74 C26 52 38 34 60 34 Z';
    const bubble = (x, y, r) => k.c(x, y, r, BUB, 1.6) + `<path d="M${x - r * 0.5} ${y - r * 0.2} q${r * 0.15} ${-r * 0.4} ${r * 0.5} ${-r * 0.45}" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    const trunk = k.D ? 'M60 62 C60 78 62 90 70 96 C74 99 78 96 76 92' : 'M60 62 C60 78 72 84 80 74 C86 66 92 52 98 42';
    return bubble(16, 22, 6) + bubble(25, 11, 3.5) + bubble(104, 100, 5)
      + (k.D ? k.c(100, 26, 2, 'none', 1.4) + k.line('M94 20 l-3 -3 M106 20 l3 -3 M94 32 l-3 3 M106 32 l3 3', '#5fb4f0', 1.6) : bubble(105, 28, 8))
      + k.a('flap', '100% 30%', k.p(k.D ? 'M36 58 C24 54 14 64 16 80 C18 94 28 96 34 86 Z' : 'M36 56 C20 40 6 50 8 68 C10 84 24 86 34 76 Z', B, 2.6) + k.p(k.D ? 'M33 64 C26 62 21 70 22 80 C24 88 29 88 32 82 Z' : 'M33 60 C24 52 16 58 16 68 C17 78 25 80 31 74 Z', BL, 0))
      + k.a('flap2', '0% 30%', k.p(k.D ? 'M84 58 C96 54 106 64 104 80 C102 94 92 96 86 86 Z' : 'M84 56 C100 40 114 50 112 68 C110 84 96 86 86 76 Z', B, 2.6) + k.p(k.D ? 'M87 64 C94 62 99 70 98 80 C96 88 91 88 88 82 Z' : 'M87 60 C96 52 104 58 104 68 C103 78 95 80 89 74 Z', BL, 0))
      + k.e(42, 110, 11, 5.5, villainShade(B, 0.12), 2.4) + k.e(78, 110, 11, 5.5, villainShade(B, 0.12), 2.4) + k.line('M36 110 v2 M42 111 v2 M48 110 v2 M72 110 v2 M78 111 v2 M84 110 v2', '#fff', 1.6)
      + k.body(body, B, { shine: [44, 46, 7, 4, -30], inner: k.e(60, 98, 18, 10, BL, 0) })
      + k.line('M56 35 Q54 26 58 28 M61 34 Q62 24 66 28', k.ink, 2.2)
      + k.cheeks(38, 64, 82, 64, 4.5)
      + k.eye(47, 52, 7, { look: [0.5, -0.4] }) + k.eye(73, 52, 7, { look: [0.5, -0.4] })
      + k.line('M38 41 Q46 38 53 43 M67 43 Q74 38 82 41', k.ink, 2.6)
      + k.mouth('smirk', 46, 82, 6)
      + k.limb(trunk, B, 8) + (k.D ? '' : k.e(98.5, 41, 4.6, 3.6, BL, 2, 'transform="rotate(-40 98.5 41)"'));
  } },

  /* Indigo wisp with a curly flame-tip, bat wings, sideways eyes and a cupped whisper hand */
  'secrets-safety': { top: [60, 18], shadow: [62, 20], draw(k){
    const B = '#6b5bd6', W = '#4a3ca8', GLOW = '#9d90f0';
    const body = 'M60 20 C78 20 92 36 92 56 C92 76 82 88 72 96 C66 102 66 110 74 112 C62 116 54 108 58 100 C42 96 28 80 28 58 C28 36 42 20 60 20 Z';
    const wingL = k.D ? 'M32 60 C24 64 16 72 14 82 C18 80 20 82 22 86 C24 82 28 80 32 82 Z' : 'M32 52 C22 36 10 32 4 38 C8 42 8 48 6 52 C12 50 16 54 16 58 C20 56 26 58 30 64 Z';
    const wingR = k.D ? 'M88 60 C96 64 104 72 106 82 C102 80 100 82 98 86 C96 82 92 80 88 82 Z' : 'M88 52 C98 36 110 32 116 38 C112 42 112 48 114 52 C108 50 104 54 104 58 C100 56 94 58 90 64 Z';
    return k.a('flap', '100% 100%', k.p(wingL, W, 2.4)) + k.a('flap2', '0% 100%', k.p(wingR, W, 2.4))
      + k.a('float', '50% 50%',
        k.body(body, B, { shine: [44, 34, 6, 9, -25], inner: k.e(60, 70, 20, 18, GLOW, 0, 'opacity=".55"') })
        + k.line('M60 21 C58 11 66 6 70 12 C72 16 66 18 64 14', k.ink, 2.6)
        + k.cheeks(42, 60, 76, 62, 4)
        + k.eye(50, 48, 7, { look: [0.8, 0.1], lid: 'shifty', lidColor: '#5a4bc0' }) + k.eye(70, 48, 7, { look: [0.8, 0.1], lid: 'shifty', lidColor: '#5a4bc0' })
        + k.mouth('smirk', 55, 64, 6)
        + (k.D ? k.limb('M86 72 Q92 80 90 88', B, 4.2) + k.hand(90, 88, 4.6, GLOW)
          : k.limb('M86 74 Q88 66 72 64', B, 4.2) + k.hand(70, 63.5, 4.8, GLOW) + k.c(80, 55, 1.3, '#fff', 0) + k.c(85, 52, 1.7, '#fff', 0) + k.c(91, 48, 2.1, '#fff', 0)))
      + k.spark(22, 22, 3.4) + k.spark(100, 18, 2.8) + k.spark(102, 96, 3) + k.spark(20, 98, 2.6);
  } },

  /* Square silver robot on tank treads, screen face, shrugging accordion-spring arms */
  'reporting-safety': { top: [60, 30], shadow: [60, 34], draw(k){
    const B = '#bcc6d0', ORG = '#ff9a3c', SCR = '#1f4f5c', CY = '#7ff5e6';
    const box = 'M37 34 H83 Q92 34 92 43 V83 Q92 92 83 92 H37 Q28 92 28 83 V43 Q28 34 37 34 Z';
    const spring = (x1, y1, x2, y2) => k.line(k.zigzag(x1, y1, x2, y2, 9, 3.4), k.ink, 4.6) + k.line(k.zigzag(x1, y1, x2, y2, 9, 3.4), '#e6ebf0', 2);
    const palm = (x, y) => k.p(`M${x - 7} ${y} Q${x} ${y + 9} ${x + 7} ${y} Z`, B, 2.2) + k.line(`M${x - 5} ${y} l-2 -4 M${x} ${y} v-4 M${x + 5} ${y} l2 -4`, k.ink, 2);
    const arms = k.D ? spring(29, 60, 16, 84) + palm(16, 88) + spring(91, 60, 104, 84) + palm(104, 88)
      : k.a('shrug', '50% 100%', spring(29, 42, 14, 24) + palm(13, 20)) + k.a('shrug', '50% 100%', spring(91, 42, 106, 24) + palm(107, 20));
    const face = k.D ? k.spiral(50, 55, 5.5, CY) + k.spiral(70, 55, 5.5, CY) + k.line('M48 66 q3 -3 6 0 t6 0 t6 0', CY, 2)
      : k.e(50, 55, 4, 5, CY, 0) + k.e(70, 55, 4, 5, CY, 0) + k.line('M43 46 L54 44 M66 44 L77 46', CY, 2) + k.line('M48 66 q3 -3 6 0 t6 0 t6 0', CY, 2);
    return arms
      + k.r(30, 98, 60, 16, 8, '#4a5260', 2.6) + [40, 52, 64, 76].map(x => k.c(x + 2, 106, 4, '#9aa4b0', 1.6)).join('') + k.r(51, 91, 18, 8, 2, '#7d8794', 2.2)
      + k.r(22, 54, 7, 16, 2, '#9aa4b0', 2.2) + k.r(91, 54, 7, 16, 2, '#9aa4b0', 2.2)
      + k.line(k.zigzag(60, 34, 60, 17, 6, 2.6), k.ink, 2.2) + k.c(60, 13, 5, k.D ? '#8a8f96' : ORG, 2.2)
      + (k.D ? '' : k.line('M52 8 l-3 -3 M68 8 l3 -3 M60 5 v-3', ORG, 2))
      + k.body(box, B, { shine: [36, 40, 6, 3, -10] })
      + k.r(36, 42, 48, 30, 5, SCR, 2.4) + face
      + k.c(46, 82, 3, '#ff5a5a', 1.6) + k.c(56, 82, 3, '#ffd23f', 1.6) + k.c(66, 82, 3, '#5fd08a', 1.6) + k.line('M74 79 H84 M74 83 H84 M74 87 H84', '#7d8794', 1.6)
      + [[33, 39], [87, 39], [33, 87], [87, 87]].map(([x, y]) => k.c(x, y, 1.5, '#7d8794', 0)).join('');
  } },

  /* Round low body with a periscope neck, one giant eye, satellite ears and a magnifying glass */
  'privacy-safety': { top: [62, 18], shadow: [60, 34], draw(k){
    const B = '#4fc38a', BL = '#c9f2dc', GOLD = '#ffcb3c';
    const body = 'M28 96 C28 80 42 72 60 72 C78 72 92 80 92 96 C92 108 80 112 60 112 C40 112 28 108 28 96 Z';
    const headY = k.D ? 46 : 34, headX = k.D ? 48 : 62;
    const neck = k.D ? 'M58 76 C54 66 50 58 48 50' : 'M58 76 C52 64 66 56 62 46';
    const glass = k.D ? k.g(k.line('M0 0 L5 10', '#8a5a2b', 4.4) + k.c(0, 0, 8, 'rgba(200,240,255,.6)', 0, `stroke="${GOLD}" stroke-width="3.4"`) + k.c(0, 0, 9.8, 'none', 1.6), 'translate(104 108) rotate(70)')
      : k.line('M100 72 L103 64', '#8a5a2b', 4.4) + k.c(106, 56, 8, 'rgba(200,240,255,.6)', 0, `stroke="${GOLD}" stroke-width="3.4"`) + k.c(106, 56, 9.8, 'none', 1.6) + k.line('M101 52 q2 -3 5 -3', '#fff', 1.8);
    return k.e(44, 113, 8, 4, villainShade(B, 0.25), 2.2) + k.e(76, 113, 8, 4, villainShade(B, 0.25), 2.2)
      + k.limb('M32 92 Q20 92 16 82', B, 4.6) + (k.D ? '' : k.c(14, 70, 4, 'none', 0, `stroke="${GOLD}" stroke-width="3"`) + k.line('M14 74 V80 M14 78 h3', GOLD, 3)) + k.hand(16, 82, 5)
      + k.body(body, B, { shine: [40, 82, 7, 3.6, -15], inner: k.e(60, 102, 18, 8, BL, 0) + k.c(80, 86, 3, villainShade(B, 0.12), 0) + k.c(36, 100, 2.4, villainShade(B, 0.12), 0) })
      + k.cheeks(44, 94, 76, 94, 4)
      + k.mouth('grin', 60, 91, 9)
      + k.a('sway', '50% 100%', k.limb(neck, B, 9)
        + k.e(headX - 21, headY - 12, 8, 10, B, 2.4, `transform="rotate(-30 ${headX - 21} ${headY - 12})"`) + k.e(headX - 21, headY - 12, 4, 6, BL, 0, `transform="rotate(-30 ${headX - 21} ${headY - 12})"`)
        + k.e(headX + 21, headY - 12, 8, 10, B, 2.4, `transform="rotate(30 ${headX + 21} ${headY - 12})"`) + k.e(headX + 21, headY - 12, 4, 6, BL, 0, `transform="rotate(30 ${headX + 21} ${headY - 12})"`)
        + k.body(`M${headX} ${headY - 19} A19 19 0 1 1 ${headX - 0.1} ${headY - 19} Z`, B, { rim: 3.5 })
        + k.eye(headX, headY + 1, 13, { iris: '#ff9f1c', look: [0.3, 0.3], pupil: 4, lid: 'shifty', lidColor: villainShade(B, 0.08) })
        + k.line(`M${headX - 12} ${headY - 15} Q${headX} ${headY - 21} ${headX + 12} ${headY - 15}`, k.ink, 3.2))
      + k.limb(k.D ? 'M88 92 Q98 98 100 106' : 'M88 90 Q100 86 100 74', B, 4.6) + glass + k.hand(k.D ? 100 : 100, k.D ? 106 : 74, 5);
  } },

  /* Fuzzy lilac pom-pom with long floppy ears, paws hiding its mouth, a sneaky band-aid */
  'medical-safety': { top: [60, 46], shadow: [60, 28], draw(k){
    const B = '#c6a3ef', IN = '#ffb3d1', TAN = '#ffd8a8';
    let fur = '';
    const N = 22;
    for (let i = 0; i <= N; i++){
      const a = (i / N) * Math.PI * 2 - Math.PI / 2;
      const x = (60 + Math.cos(a) * 31).toFixed(1), y = (76 + Math.sin(a) * 31).toFixed(1);
      fur += i === 0 ? `M${x} ${y}` : ` A5 5 0 0 1 ${x} ${y}`;
    }
    fur += ' Z';
    const bandaid = (x, y, r) => k.g(k.r(-8, -3, 16, 6, 3, TAN, 1.6) + k.r(-2.5, -3, 5, 6, 0, '#f2bf86', 0) + k.c(-5.5, 0, 0.6, '#c99'), `translate(${x} ${y}) rotate(${r})`);
    const earL = k.D ? 'M46 50 C38 32 22 34 16 48 C10 62 12 84 16 100 C20 106 28 104 28 96 C28 80 34 64 44 56 Z' : 'M46 50 C40 28 24 24 18 38 C12 52 14 76 20 92 C24 98 32 96 32 88 C32 74 34 60 44 54 Z';
    const earR = k.D ? 'M74 50 C82 32 98 34 104 48 C110 62 108 84 104 100 C100 106 92 104 92 96 C92 80 86 64 76 56 Z' : 'M74 50 C80 28 96 24 102 38 C108 52 106 76 100 92 C96 98 88 96 88 88 C88 74 86 60 76 54 Z';
    return k.e(46, 109, 8, 4.5, villainShade(B, 0.2), 2.2) + k.e(74, 109, 8, 4.5, villainShade(B, 0.2), 2.2)
      + k.body(fur, B, { shine: [46, 58, 7, 4, -30], sw: 2.6 })
      + k.line('M54 46 q2 -6 6 -2 q2 -6 6 0', k.ink, 2.2)
      + k.a('flop', '50% 0%', k.p(earL, B, 2.6) + k.e(k.D ? 22 : 24, k.D ? 74 : 62, 4, 16, IN, 0, `transform="rotate(${k.D ? 4 : 8} 24 64)"`) + bandaid(24, 80, -30))
      + k.a('flop2', '50% 0%', k.p(earR, B, 2.6) + k.e(k.D ? 98 : 96, k.D ? 74 : 62, 4, 16, IN, 0, `transform="rotate(${k.D ? -4 : -8} 96 64)"`))
      + k.cheeks(44, 78, 76, 78, 4)
      + k.eye(51, 68, 7, { look: [0.7, 0.2] }) + k.eye(69, 68, 7, { look: [0.7, 0.2] })
      + k.line('M43 58 Q48 57 55 53 M65 53 Q72 57 77 58', k.ink, 2.6)
      + (k.D ? k.mouth('grin', 60, 84, 7) : k.e(54, 85, 6.4, 5, villainShade(B, 0.08), 2.2) + k.e(66, 85, 6.4, 5, villainShade(B, 0.08), 2.2) + k.p('M82 50 q-4 6 0 8 q4 -2 0 -8 Z', '#9fe0ff', 1.6))
      + bandaid(80, 98, 24);
  } },

  /* Cherry-red cooking pot with a rattling lid, steam puffs, squeezed eyes and a pressure gauge */
  'dating-safety': { top: [60, 26], shadow: [60, 32], draw(k){
    const B = '#f2545b', LID = '#c8d0d8';
    const body = 'M22 50 H98 C98 74 96 96 86 104 C80 108 40 108 34 104 C24 96 22 74 22 50 Z';
    const lid = k.p('M24 44 C24 28 96 28 96 44 Z', LID, 2.6) + k.e(60, 27, 6, 4.4, '#3d3d48', 2.2) + k.line('M34 38 Q46 32 58 33', '#fff', 2, 'opacity=".7"');
    const steam = k.puff([[26, 30, 6], [19, 24, 4]], '#fff', 2) + k.puff([[94, 28, 6], [101, 21, 4.6]], '#fff', 2) + k.puff([[74, 14, 4], [80, 8, 3.4]], '#fff', 1.8);
    return (k.D ? '' : k.a('puff', '50% 100%', steam))
      + k.e(40, 110, 7, 4, '#3d3d48', 2.2) + k.e(80, 110, 7, 4, '#3d3d48', 2.2)
      + k.line('M18 58 Q8 58 8 66 Q8 72 18 72 M102 58 Q112 58 112 66 Q112 72 102 72', k.ink, 6.4) + k.line('M18 58 Q8 58 8 66 Q8 72 18 72 M102 58 Q112 58 112 66 Q112 72 102 72', '#5a5f68', 3)
      + k.body(body, B, { shine: [32, 62, 4, 9, 0] })
      + k.r(18, 44, 84, 9, 4.5, villainShade(B, 0.15), 2.6)
      + (k.D ? k.g(lid, 'translate(0 4)') : k.a('rattle', '50% 100%', k.g(lid, 'rotate(-6 60 44) translate(0 -3)')))
      + k.cheeks(36, 76, 84, 76, 5.5)
      + k.eye(46, 64, 7.5, { squeeze: 1 }) + k.eye(74, 64, 7.5, { squeeze: -1 })
      + k.mouth('toothy', 56, 80, 11)
      + k.c(86, 92, 7.5, '#fff', 2.2) + k.p('M80 92 A6 6 0 0 1 92 92', 'none', 0, 'stroke="#5fd08a" stroke-width="2"') + k.p('M88.5 86.5 A6 6 0 0 1 92 92', 'none', 0, 'stroke="#ff3b3b" stroke-width="2.4"')
      + k.line(k.D ? 'M86 92 L81 89' : 'M86 92 L91 87.5', k.ink, 1.8) + k.c(86, 92, 1.4, k.ink, 0);
  } },

  /* Computer-mouse creature: two click buttons, a red scroll-wheel nose, a cord-and-plug tail */
  'online-safety': { top: [60, 18], shadow: [60, 30], draw(k){
    const B = '#4a9dff', BL = '#a8d4ff', RED = '#ff5a5a';
    const body = 'M60 22 C86 22 96 46 96 72 C96 98 82 108 60 108 C38 108 24 98 24 72 C24 46 34 22 60 22 Z';
    const cord = k.D ? 'M60 23 C60 12 70 8 80 12 C90 16 92 26 96 34 C100 42 106 46 110 50' : 'M60 23 C60 10 74 4 86 8 C98 12 104 22 100 32';
    const plug = k.D ? k.g(k.r(-4, -5, 8, 10, 2, '#e6ebf0', 2) + k.line('M-2 -5 v-3 M2 -5 v-3', k.ink, 1.6), 'translate(110 54) rotate(-40)')
      : k.g(k.r(-4, -5, 8, 10, 2, '#e6ebf0', 2) + k.line('M-2 5 v3 M2 5 v3', k.ink, 1.6), 'translate(99 36) rotate(-20)');
    return k.e(46, 112, 8, 4.5, villainShade(B, 0.3), 2.2) + k.e(74, 112, 8, 4.5, villainShade(B, 0.3), 2.2)
      + k.a('wag', '0% 100%', k.line(cord, k.ink, 5) + k.line(cord, '#3a4256', 2.6) + plug)
      + k.limb(k.D ? 'M27 80 Q18 88 18 98' : 'M27 78 Q14 76 12 66', B) + k.hand(k.D ? 18 : 12, k.D ? 98 : 66)
      + k.body(body, B, { shine: [40, 40, 5, 9, -20], inner: k.p('M0 0 H120 V52 Q60 62 0 52 Z', BL, 0) })
      + k.line('M60 23 V54 M25 52 Q60 62 95 52', k.ink, 2.2)
      + k.r(56, 30, 8, 15, 4, RED, 2)
      + (k.D ? '' : k.line('M44 24 l-3 -4 M40 31 h-5 M80 24 l3 -4', k.ink, 1.8))
      + k.cheeks(38, 82, 82, 82, 4.5)
      + k.eye(48, 72, 7.5, { look: [0.4, -0.3] }) + k.eye(72, 72, 7.5, { look: [0.4, -0.3] })
      + k.mouth('laugh', 60, 87, 8)
      + (k.D ? k.limb('M93 80 Q102 88 102 98', B) + k.hand(102, 98)
        : k.limb('M93 76 Q104 72 107 62', B) + k.e(110, 54, 2.6, 5.4, '#fff', 2, 'transform="rotate(22 110 54)"') + k.hand(107, 62));
  } },

  /* Magenta phone with a troll-doll hair poof, curly horns, raspberry tongue and a #@! bubble */
  'cyberbullying-safety': { top: [44, 36], shadow: [60, 22], draw(k){
    const B = '#e0569b', SCR = '#28304a', HAIR = '#ff9c3a', HORN = '#fff0d0';
    const phone = 'M46 40 H74 Q84 40 84 50 V98 Q84 108 74 108 H46 Q36 108 36 98 V50 Q36 40 46 40 Z';
    const hair = k.D ? 'M46 44 C40 36 46 30 52 34 C52 28 60 26 62 32 C66 26 76 30 72 36 C78 34 80 40 74 44 Z' : 'M46 44 C36 30 44 18 52 24 C48 10 60 2 62 14 C66 2 80 8 72 20 C82 16 86 32 74 44 Z';
    return k.a('sway', '50% 100%', k.p(hair, HAIR, 2.4) + (k.D ? '' : k.line('M54 38 Q52 28 56 22 M64 38 Q66 28 68 22', villainShade(HAIR, 0.2), 1.6)))
      + k.p('M40 46 C30 44 26 36 32 31 C33 37 37 40 44 42 Z', HORN, 2) + k.p('M80 46 C90 44 94 36 88 31 C87 37 83 40 76 42 Z', HORN, 2)
      + k.limb('M52 106 L50 112', B, 3) + k.limb('M68 106 L70 112', B, 3) + k.e(48, 113, 6, 3.4, SCR, 1.8) + k.e(72, 113, 6, 3.4, SCR, 1.8)
      + k.limb(k.D ? 'M37 76 Q28 84 28 94' : 'M37 72 Q24 70 20 60', B, 4) + k.hand(k.D ? 28 : 20, k.D ? 94 : 60, 4.6)
      + k.body(phone, B, { shine: [42, 50, 2.4, 6, 0] })
      + k.r(41, 48, 38, 52, 4, SCR, 2) + k.c(60, 44, 1.4, SCR, 0)
      + (k.D ? '' : k.c(82, 42, 5, '#ff3b3b', 1.8) + k.line('M82 39.6 V42.4 M82 44.6 V44.7', '#fff', 1.8))
      + k.cheeks(48, 74, 72, 74, 3.6)
      + k.eye(52, 64, 5.5, { look: [0, 0.2] }) + k.eye(68, 64, 5.5, { look: [0, 0.2] })
      + (k.D ? '' : k.line('M46 55 L56 58 M74 55 L64 58', '#fff', 2.4))
      + k.mouth('tongue', 60, 78, 8)
      + (k.D ? k.limb('M83 76 Q92 84 92 94', B, 4) + k.hand(92, 94, 4.6)
        : k.limb('M83 72 Q96 68 98 58', B, 4) + k.hand(98, 58, 4.6)
          + k.p('M92 22 H112 Q118 22 118 28 V36 Q118 42 112 42 H104 L98 48 L99 42 H96 Q90 42 90 36 V28 Q90 22 96 22 Z', '#fff', 2)
          + `<text x="104" y="36.5" font-size="10" font-weight="900" text-anchor="middle" font-family="Arial, sans-serif" fill="${B}">#@!</text>`);
  } },

  /* Olive caterpillar-bug with bug wings, antennae and a banana-peel hat, tossing litter */
  'citizenship-safety': { top: [84, 30], shadow: [56, 46], draw(k){
    const B = '#a2b84a', SP = '#7a8a32', PEEL = '#ffe066', WING = 'rgba(225,242,255,.85)';
    const seg = (x, y, r) => k.body(`M${x} ${y - r} A${r} ${r} 0 1 1 ${x - 0.1} ${y - r} Z`, B, { rim: 3, inner: k.c(x + r * 0.2, y - r * 0.3, r * 0.22, SP, 0) });
    const peel = k.p('M86 42 C78 42 72 48 71 57 C75 52 80 50 85 50 Z', PEEL, 2) + k.p('M86 42 C94 42 100 48 101 57 C97 52 92 50 87 50 Z', PEEL, 2)
      + k.p('M80 46 C80 36 92 36 92 46 Q86 50 80 46 Z', PEEL, 2) + k.line('M86 37 L86 31', '#7a5a2b', 3) + k.c(75, 53, 0.9, '#7a5a2b', 0) + k.c(97, 52, 0.9, '#7a5a2b', 0);
    return (k.D ? '' : k.line('M42 58 Q34 54 30 60', k.ink, 1.4, 'stroke-dasharray="2 3"') + k.c(26, 64, 5, '#f4f4f4', 1.8) + k.line('M23 62 l4 3 M28 61 l-2 5', '#b8b8b8', 1.2))
      + k.g(k.r(-4, -6, 8, 12, 2, '#ff5a5a', 1.8) + k.r(-4, -1.5, 8, 3, 0, '#fff', 0), 'translate(106 110) rotate(70)')
      + [[18, 113], [32, 111], [48, 110], [64, 107]].map(([x, y]) => k.e(x, y, 4, 2.6, SP, 1.6)).join('')
      + seg(18, 100, 11) + seg(32, 96, 12.5) + seg(48, 94, 13.5) + seg(64, 90, 14)
      + k.a('flap', '80% 100%', k.e(46, 72, 7, 14, WING, 1.8, `transform="rotate(${k.D ? -70 : -30} 46 80)"`) + k.e(57, 70, 7, 14, WING, 1.8, `transform="rotate(${k.D ? 60 : 8} 57 80)"`))
      + k.limb(k.D ? 'M78 48 Q70 44 64 48' : 'M78 48 Q70 36 66 30', B, 2.2) + k.c(k.D ? 63 : 66, k.D ? 49 : 28, 3.4, SP, 1.6)
      + k.limb(k.D ? 'M94 48 Q102 44 108 48' : 'M94 48 Q102 38 108 34', B, 2.2) + k.c(k.D ? 109 : 108, k.D ? 49 : 33, 3.4, SP, 1.6)
      + k.body('M86 44 A21 21 0 1 1 85.9 44 Z', B, { shine: [76, 54, 5, 3, -30] })
      + (k.D ? k.g(peel, 'translate(-64 54) rotate(-20 86 44)') : peel)
      + k.cheeks(74, 74, 98, 74, 3.6)
      + k.eye(78, 63, 6, { look: [-0.3, 0] }) + k.eye(94, 63, 6, { look: [-0.3, 0] })
      + k.mouth('buck', 86, 75, 7);
  } },

  /* Teal pear with a tiny head, a huge droopy mustache, a zipped-shut mouth and a "shh" finger */
  'selfadvocacy-safety': { top: [60, 20], shadow: [60, 28], draw(k){
    const B = '#3fb8b0', BL = '#c2efe9', MU = '#6b4a2e', FT = '#ffb347';
    const body = 'M60 22 C70 22 74 32 72 42 C70 50 90 60 94 80 C98 100 84 112 60 112 C36 112 22 100 26 80 C30 60 50 50 48 42 C46 32 50 22 60 22 Z';
    const zipper = k.line('M50 61 H70', k.ink, 2.4) + k.line('M52 59 V63 M55 59 V63 M58 59 V63 M61 59 V63 M64 59 V63 M67 59 V63', k.ink, 1.2) + k.r(69, 59, 4, 7, 1.4, '#c8d0d8', 1.6);
    return k.e(42, 113, 10, 4.5, FT, 2.2) + k.e(78, 113, 10, 4.5, FT, 2.2)
      + k.limb('M31 76 Q18 82 26 94', B, 4.8) + k.hand(26, 94, 5)
      + k.body(body, B, { shine: [52, 32, 3.4, 6, -10], inner: k.e(60, 92, 22, 15, BL, 0) })
      + k.line('M60 23 C58 14 66 12 66 18 C66 22 61 21 62 18', k.ink, 2.2)
      + k.cheeks(44, 64, 76, 64, 4)
      + k.eye(54, 36, 4.4, { look: [0, -0.2] }) + k.eye(66, 36, 4.4, { look: [0, -0.2] })
      + k.line('M49 29 Q54 26 58 29 M62 29 Q66 26 71 29', MU, 3)
      + (k.D ? k.mouth('grin', 60, 60, 7) : zipper)
      + k.p('M60 46 C54 42 44 44 42 50 C40 56 36 58 32 56 C36 62 50 60 60 54 C70 60 84 62 88 56 C84 58 80 56 78 50 C76 44 66 42 60 46 Z', MU, 1.8)
      + (k.D ? k.limb('M89 78 Q100 86 96 96', B, 4.8) + k.hand(96, 96, 5)
        : k.limb('M89 80 Q92 68 78 66', B, 4.8) + k.e(76, 57, 2.6, 6, '#fff', 1.8) + k.hand(76, 65, 5) + k.line('M84 54 q4 -2 7 0 M86 49 q4 -2 7 0', k.ink, 1.6));
  } },

  /* Wide terracotta castle-wall with crenellations, a jaunty crown, stern eyes and crossed arms */
  'rights-safety': { top: [60, 30], shadow: [60, 50], draw(k){
    const B = '#d97a4e', MORT = '#f6dfc4', GOLD = '#ffd23f';
    const wall = 'M14 106 V40 H28 V32 H42 V40 H54 V32 H66 V40 H78 V32 H92 V40 H106 V106 Z';
    const bricks = k.line('M0 52 H120 M0 64 H120 M0 76 H120 M0 88 H120 M0 100 H120 M34 40 V52 M70 40 V52 M22 52 V64 M52 52 V64 M86 52 V64 M34 64 V76 M70 64 V76 M22 76 V88 M52 76 V88 M86 76 V88 M34 88 V100 M70 88 V100', MORT, 2, 'opacity=".8"');
    const crown = k.p('M50 32 L50 18 L55 24 L60 14 L65 24 L70 18 L70 32 Z', GOLD, 2.2) + k.c(60, 27, 2, '#ff5a8a', 1.2);
    return k.e(34, 112, 11, 5, villainShade(B, 0.3), 2.4) + k.e(86, 112, 11, 5, villainShade(B, 0.3), 2.4)
      + k.body(wall, B, { rim: 4, inner: bricks + (k.D ? k.line('M40 40 L46 54 L42 64 L50 78 M84 48 L80 60 L86 70', '#7a3a1e', 2.2) : '') })
      + (k.D ? k.g(crown, 'translate(-36 74) rotate(-30 60 32)') + k.r(98, 108, 10, 6, 1.5, B, 1.8) + k.r(6, 110, 9, 5, 1.5, B, 1.8) : k.g(crown, 'rotate(10 60 32) translate(2 0)'))
      + k.cheeks(32, 72, 88, 72, 5)
      + k.eye(42, 59, 8, { lid: 'shifty', lidColor: villainShade(B, 0.12), look: [0, 0.3] }) + k.eye(78, 59, 8, { lid: 'shifty', lidColor: villainShade(B, 0.12), look: [0, 0.3] })
      + k.line('M32 46 L52 51 M88 46 L68 51', k.ink, 3.4)
      + k.mouth('pout', 60, 74, 7)
      + (k.D ? k.limb('M16 82 Q8 92 10 102', villainShade(B, 0.1), 6) + k.hand(10, 102, 5.5, MORT) + k.limb('M104 82 Q112 92 110 102', villainShade(B, 0.1), 6) + k.hand(110, 102, 5.5, MORT)
        : k.limb('M16 84 Q36 100 72 92', villainShade(B, 0.1), 6) + k.hand(72, 92, 5.5, MORT) + k.limb('M104 84 Q84 100 48 92', villainShade(B, 0.1), 6) + k.hand(48, 92, 5.5, MORT))
      + k.line('M110 116 Q108 108 110 102', '#5fae3a', 2) + k.p('M110 108 q-5 -2 -6 2 q4 2 6 -2 Z', '#7cc95a', 1.2)
      + [0, 72, 144, 216, 288].map(a => k.c(110 + Math.cos(a * Math.PI / 180) * 3, 99 + Math.sin(a * Math.PI / 180) * 3, 2.2, '#fff', 1)).join('') + k.c(110, 99, 1.6, GOLD, 0);
  } },

  /* Top-heavy blue grump: one striped unicorn horn, big unibrow, gorilla arms, tiny legs */
  'bullying-safety': { top: [60, 22], shadow: [60, 34], draw(k){
    const B = '#5876d6', BL = '#adc0f4', HORN = '#ffd23f', DK = '#3e58b0';
    const body = 'M16 50 C16 32 34 24 60 24 C86 24 104 32 104 50 C104 70 92 92 80 100 H40 C28 92 16 70 16 50 Z';
    const horn = k.p('M53 28 Q57 10 60 3 Q64 12 67 28 Z', HORN, 2.2) + k.line('M55 22 L65 19 M56.5 15 L63 13', '#e0a800', 1.8);
    return (k.D ? k.g(horn, 'rotate(-22 60 28)') : horn)
      + k.c(18, 40, 6, B, 2.2) + k.c(102, 40, 6, B, 2.2)
      + k.limb('M48 98 V107', B, 4.6) + k.limb('M72 98 V107', B, 4.6) + k.e(46, 110, 8, 4, DK, 2.2) + k.e(74, 110, 8, 4, DK, 2.2)
      + k.limb(k.D ? 'M22 64 Q12 82 18 100' : 'M22 62 Q8 76 12 92', B, 7.4) + k.hand(k.D ? 18 : 12, k.D ? 102 : 94, 7, DK)
      + k.limb(k.D ? 'M98 64 Q108 82 102 100' : 'M98 62 Q112 76 108 92', B, 7.4) + k.hand(k.D ? 102 : 108, k.D ? 102 : 94, 7, DK)
      + k.body(body, B, { shine: [36, 36, 8, 4, -20], inner: k.e(60, 82, 22, 15, BL, 0) + k.line('M16 64 Q28 60 32 70 M104 64 Q92 60 88 70 M22 82 Q32 78 36 86 M98 82 Q88 78 84 86 M30 34 Q36 38 36 46 M90 34 Q84 38 84 46', DK, 3.4) })
      + k.cheeks(36, 62, 84, 62, 5)
      + k.eye(46, 53, 6.4, { lid: 'shifty', lidColor: DK, look: [0, 0.3] }) + k.eye(74, 53, 6.4, { lid: 'shifty', lidColor: DK, look: [0, 0.3] })
      + k.line('M34 44 Q44 38 54 44 Q60 46 66 44 Q76 38 86 44', k.ink, 5)
      + k.mouth('underbite', 60, 70, 14)
      + (k.D ? '' : k.line('M86 22 l5 -5 M92 26 l6 -3 M34 22 l-5 -5 M28 26 l-6 -3', k.ink, 2));
  } },

  /* Two-headed orange egg-on: ram-horn head with two eyes + cyclops head with nub horns, pointing a dare */
  'peer-pressure-safety': { top: [60, 22], shadow: [60, 32], draw(k){
    const B = '#ff9a3c', BL = '#ffe0b0', HORN = '#fff0d6', NUB = '#e8505b';
    const body = 'M60 60 C84 60 96 76 96 92 C96 106 82 114 60 114 C38 114 24 106 24 92 C24 76 36 60 60 60 Z';
    const headL = k.D ? [36, 50] : [38, 46], headR = k.D ? [84, 48] : [82, 42];
    const hb = ([x, y], r) => `M${x} ${y - r} A${r} ${r} 0 1 1 ${x - 0.1} ${y - r} Z`;
    return k.a('wag', '0% 100%', k.limb('M90 104 Q108 112 110 98', B, 4.4) + k.puff([[110, 94, 5], [114, 90, 3.4], [106, 90, 3.4]], BL, 1.8))
      + k.e(46, 115, 9, 4, villainShade(B, 0.3), 2.2) + k.e(74, 115, 9, 4, villainShade(B, 0.3), 2.2)
      + k.limb('M27 88 Q14 92 18 102', B, 5) + k.hand(18, 102, 5)
      + k.body(body, B, { shine: [40, 74, 6, 3.4, -25], inner: k.e(60, 98, 20, 12, BL, 0) + k.c(84, 76, 3, villainShade(B, 0.12), 0) + k.c(32, 98, 2.4, villainShade(B, 0.12), 0) })
      + k.limb(`M${headL[0] - 12} ${headL[1] - 8} C${headL[0] - 22} ${headL[1] - 18} ${headL[0] - 32} ${headL[1] - 4} ${headL[0] - 24} ${headL[1] + 4} C${headL[0] - 20} ${headL[1] + 8} ${headL[0] - 14} ${headL[1] + 2} ${headL[0] - 18} ${headL[1] - 2}`, HORN, 4.8)
      + k.body(hb(headL, 18), B, { rim: 3.5 })
      + k.e(headR[0] - 7, headR[1] - 17, 4, 5, NUB, 2) + k.e(headR[0] + 7, headR[1] - 17, 4, 5, NUB, 2)
      + k.body(hb(headR, 18), B, { rim: 3.5 })
      + k.cheeks(headL[0] - 10, headL[1] + 8, headL[0] + 10, headL[1] + 8, 3.6) + k.cheeks(headR[0] - 11, headR[1] + 6, headR[0] + 11, headR[1] + 6, 3.6)
      + k.eye(headL[0] - 6, headL[1] - 2, 5.2, { look: [0.7, -0.2] }) + k.eye(headL[0] + 6, headL[1] - 2, 5.2, { look: [0.7, -0.2] })
      + k.line(`M${headL[0] - 11} ${headL[1] - 11} Q${headL[0] - 6} ${headL[1] - 14} ${headL[0] - 2} ${headL[1] - 11} M${headL[0] + 2} ${headL[1] - 13} Q${headL[0] + 6} ${headL[1] - 17} ${headL[0] + 11} ${headL[1] - 13}`, k.ink, 2.2)
      + k.mouth('smirk', headL[0], headL[1] + 9, 6)
      + k.eye(headR[0], headR[1] - 3, 8.6, { look: [-0.6, -0.2] })
      + k.mouth('laugh', headR[0], headR[1] + 7, 6.5)
      + (k.D ? k.limb('M93 86 Q104 94 102 104', B, 5) + k.hand(102, 104, 5)
        : k.limb('M93 84 Q106 80 109 70', B, 5) + k.e(111, 62, 2.6, 5.4, '#fff', 1.8, 'transform="rotate(18 111 62)"') + k.hand(109, 70, 5));
  } },

  /* Grape-soda bottle erupting a foam mohawk, cap flying off, face on the label, no feet */
  'selfregulation-safety': { top: [60, 24], shadow: [60, 30], draw(k){
    const B = '#a065e0', LAB = '#ffd23f', FOAM = '#ffffff';
    const body = 'M50 30 H70 V40 C70 48 90 50 90 64 V102 C90 108 86 112 80 112 H40 C34 112 30 108 30 102 V64 C30 50 50 48 50 40 Z';
    const foam = k.D ? k.puff([[54, 30, 4.5], [62, 28, 5], [68, 31, 3.6]], FOAM, 2)
      : k.a('fizz', '50% 100%', k.puff([[50, 26, 7], [62, 20, 9], [72, 26, 6.5], [56, 12, 6], [66, 8, 4.5]], FOAM, 2.2) + k.p('M50 30 q-3 8 0 11 q3 -2 1 -11 Z M71 31 q-1 6 1 8 q2 -2 0 -8 Z', FOAM, 1.6));
    const bub = [[40, 100, 2], [46, 92, 1.4], [82, 98, 2.2], [78, 104, 1.4], [38, 58, 1.6], [84, 60, 1.8]].map(([x, y, r]) => k.c(x, y, r, '#fff', 0, 'opacity=".6"')).join('');
    return (k.D ? '' : k.g(k.r(-8, -3, 16, 6, 2, '#ff5a5a', 2) + k.line('M-5 3 v2 M-1.7 3 v2 M1.7 3 v2 M5 3 v2', k.ink, 1.2), 'translate(90 12) rotate(30)') + k.line('M84 20 l-3 3 M88 24 l-2 4', k.ink, 1.6))
      + (k.D ? '' : k.c(14, 36, 3, 'none', 1.6) + k.c(20, 26, 2, 'none', 1.4) + k.c(106, 40, 3, 'none', 1.6) + k.c(110, 30, 2, 'none', 1.4))
      + k.limb(k.D ? 'M31 72 Q22 82 22 94' : 'M31 70 Q18 64 14 52', B, 4.4) + k.hand(k.D ? 22 : 14, k.D ? 94 : 52, 5)
      + k.limb(k.D ? 'M89 72 Q98 82 98 94' : 'M89 70 Q102 64 106 52', B, 4.4) + k.hand(k.D ? 98 : 106, k.D ? 94 : 52, 5)
      + k.a('jiggle', '50% 100%', k.body(body, B, { shine: [37, 70, 2.6, 14, 0], inner: k.r(0, 66, 120, 22, 0, LAB, 0) + k.line('M0 66 H120 M0 88 H120', k.ink, 2.2) + bub })
        + k.cheeks(38, 84, 82, 84, 4.6)
        + k.eye(48, 76, 7, { look: [0, -0.2] }) + k.eye(72, 76, 7, { look: [0, -0.2] })
        + k.line('M40 64 Q47 60 54 64 M66 64 Q73 60 80 64', k.ink, 2.6)
        + k.mouth('laugh', 60, 93, 9))
      + foam;
  } },

  /* Pale-green envelope flying on dragonfly wings, dollar-sign eyes, gold tooth, stamp */
  'money-safety': { top: [60, 40], shadow: [60, 28], draw(k){
    const B = '#b8e68a', FLAP = '#8fcf5e', WING = 'rgba(215,240,255,.85)', GOLD = '#ffd23f';
    const env = 'M26 48 H94 Q100 48 100 54 V94 Q100 100 94 100 H26 Q20 100 20 94 V54 Q20 48 26 48 Z';
    const coin = (x, y) => k.c(x, y, 5.5, GOLD, 1.8) + `<text x="${x}" y="${y + 3}" font-size="8" font-weight="900" text-anchor="middle" font-family="Arial, sans-serif" fill="#8a6a00">$</text>`;
    const wings = side => {
      const s = side;
      const up = k.D ? 30 : -25, lo = k.D ? 50 : 12;
      return k.e(60 + s * 24, 32, 18, 6.5, WING, 1.8, `transform="rotate(${s * up} ${60 + s * 8} 46)"`) + k.e(60 + s * 24, 46, 15, 5.5, WING, 1.8, `transform="rotate(${s * lo} ${60 + s * 8} 48)"`);
    };
    return k.a('flap', '100% 100%', wings(-1)) + k.a('flap2', '0% 100%', wings(1))
      + k.limb(k.D ? 'M56 48 Q52 40 46 38' : 'M56 48 Q52 36 46 30', B, 2) + coin(k.D ? 44 : 45, k.D ? 38 : 27)
      + k.limb(k.D ? 'M64 48 Q68 40 74 38' : 'M64 48 Q68 36 74 30', B, 2) + coin(k.D ? 76 : 75, k.D ? 38 : 27)
      + k.line('M34 99 q-2 6 -6 10 M50 99 q0 7 -2 12 M70 99 q0 7 2 12 M86 99 q2 6 6 10', k.ink, 2.4)
      + k.body(env, B, { shine: [30, 92, 5, 2.4, 0] })
      + k.p('M22 50 L60 81 L98 50 Z', FLAP, 2.4)
      + k.cheeks(38, 86, 82, 86, 4.4)
      + k.eye(47, 60, 6.6, { dollar: true }) + k.eye(73, 60, 6.6, { dollar: true })
      + k.mouth('goldtooth', 60, 88, 9)
      + k.r(24, 82, 11, 12, 1.5, '#ff5a5a', 1.8) + k.line('M29.5 85 V89 M29.5 91.4 V91.5', '#fff', 1.8)
      + (k.D ? coin(14, 112) + coin(104, 112) : coin(10, 74) + coin(110, 82));
  } },
};

function villainSvg(topicId, defeated){
  const v = VILLAINS[topicId];
  const art = VILLAIN_ART[topicId];
  if (!v || !art) return '';
  const n = ++villainSvgSeq;
  const k = villainKit(n, !!defeated);
  const seed = (topicId.length * 7 + n) % 97;
  const ink = VILLAIN_INK;
  const shadow = art.shadow === false ? '' : `<ellipse cx="${art.shadow[0]}" cy="117" rx="${art.shadow[1]}" ry="4" fill="#1c2340" opacity=".1"/>`;
  // Defeated: the whole monster sags (squashed toward the ground, tipped over)
  // with dizzy stars circling its head; each drawing also droops its own bits.
  const pose = defeated ? 'translate(60 117) rotate(-3) scale(.96 .9) translate(-60 -117)' : '';
  const [sx, sy] = art.top;
  const ty = defeated ? 117 - (117 - sy) * 0.9 : sy;
  const dizzy = defeated
    ? `<g class="vm-dizzy" style="transform-origin:${sx}px ${ty}px"><ellipse cx="${sx}" cy="${ty}" rx="17" ry="5" fill="none" stroke="${ink}" stroke-width="1.2" stroke-dasharray="3 3" opacity=".5"/>`
      + k.spark(sx - 15, ty, 4.4) + k.spark(sx + 14, ty - 2, 3.6, '#7fd0ff') + `<circle cx="${sx + 2}" cy="${ty + 5}" r="2.4" fill="#ff8fc0" stroke="${ink}" stroke-width="1"/></g>`
    : '';
  return `<svg class="villain villain--${topicId}${defeated ? ' villain--defeated' : ''}" viewBox="0 0 120 124" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">`
    + `<defs><filter id="vwob${n}" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter></defs>`
    + `<g filter="url(#vwob${n})">${shadow}`
    + (pose ? `<g transform="${pose}">${art.draw(k)}</g>` : art.draw(k))
    + dizzy
    + `</g></svg>`;
}

/* The final boss of boss-battle.html: the Safety Monster, every silly habit
   rolled into one. Same kit and ink style as the lesson villains, but bigger
   and fancier: bat wings, curly ram horns, a third eye, a crown that's too
   small, a lightning-bolt tail and a giant lollipop scepter. When beaten it
   sags, goes dizzy and waves a little white "I give up" flag. */
function villainBossSvg(defeated){
  const n = ++villainSvgSeq;
  const k = villainKit(n, !!defeated);
  const D = k.D, ink = VILLAIN_INK;
  const B = '#8d6bd6', BL = '#ffe3a3', WING = '#ff7ab8', WIN = '#ffc2dc', HORN = '#fff0d0', GOLD = '#ffd23f', FOOT = '#ff9a3c';
  const body = 'M80 30 C108 30 122 54 122 82 C122 114 104 134 80 134 C56 134 38 114 38 82 C38 54 52 30 80 30 Z';
  const wingL = D ? 'M50 70 C36 74 22 86 14 104 C20 102 24 106 24 112 C30 106 36 108 38 114 C42 106 48 104 52 106 Z'
    : 'M52 66 C40 40 22 26 6 30 C12 36 12 44 8 50 C16 48 20 52 20 60 C26 56 32 60 34 68 C40 64 46 66 52 74 Z';
  const wingR = D ? 'M110 70 C124 74 138 86 146 104 C140 102 136 106 136 112 C130 106 124 108 122 114 C118 106 112 104 108 106 Z'
    : 'M108 66 C120 40 138 26 154 30 C148 36 148 44 152 50 C144 48 140 52 140 60 C134 56 128 60 126 68 C120 64 114 66 108 74 Z';
  const memL = D ? '' : k.p('M48 64 C40 46 28 36 18 36 C22 44 24 54 30 62 Z', WIN, 0, 'opacity=".9"');
  const memR = D ? '' : k.p('M112 64 C120 46 132 36 142 36 C138 44 136 54 130 62 Z', WIN, 0, 'opacity=".9"');
  const crown = k.p('M68 32 L68 18 L74 24 L80 13 L86 24 L92 18 L92 32 Z', GOLD, 2.2) + k.c(80, 27, 2.4, '#ff5a8a', 1.2) + k.c(71.5, 28.5, 1.5, '#5fc7ff', 1) + k.c(88.5, 28.5, 1.5, '#5fd08a', 1);
  const pop = (x, y) => k.c(x, y, 12, '#fff', 2.4) + k.line(`M${x} ${y} m-1 0 a2 2 0 1 1 3 1 a4.5 4.5 0 1 1 -7 -2 a7 7 0 1 1 11 4 a9.5 9.5 0 0 1 -14 4`, '#ff5a8a', 3) + k.line(`M${x} ${y} m3 -2 a5.5 5.5 0 0 0 -8 -1`, '#5fc7ff', 2.4);
  const scepter = D
    ? k.g(k.line('M0 0 H34', ink, 6) + k.line('M0 0 H34', '#fff', 3.2) + k.line('M6 0 h4 M18 0 h4 M30 0 h3', '#ff5a8a', 3.2) + pop(40, 0), 'translate(96 139) rotate(-6)')
    : k.a('sway', '50% 100%', k.line('M136 98 V46', ink, 6) + k.line('M136 98 V46', '#fff', 3.2) + k.line('M136 52 v4 M136 66 v4 M136 80 v4 M136 92 v3', '#ff5a8a', 3.2) + pop(136, 36));
  const tail = k.limb(D ? 'M112 120 C126 132 138 130 142 122' : 'M112 118 C136 126 150 112 146 92', B, 7)
    + k.g(k.p('M0 -14 L-7 0 H0 L-5 12 L9 -4 H2 L7 -14 Z', GOLD, 2.2), D ? 'translate(143 115) rotate(60)' : 'translate(146 84)');
  const flag = D ? k.line('M31 118 L26 64', k.ink, 5.4) + k.line('M31 118 L26 64', '#c98b52', 2.8) + k.a('wag', '0% 50%', k.p('M27 66 Q36 60 44 66 Q52 72 60 66 L58 86 Q50 92 42 86 Q34 80 29 86 Z', '#fff', 2.2)) : '';
  const art =
      k.a('wag', '0% 100%', tail)
    + k.a('flap', '100% 100%', k.p(wingL, WING, 2.6) + memL) + k.a('flap2', '0% 100%', k.p(wingR, WING, 2.6) + memR)
    + k.e(62, 137, 16, 7, FOOT, 2.6) + k.e(98, 137, 16, 7, FOOT, 2.6) + k.line('M54 137 v-3 M62 135 v-3 M70 137 v-3 M90 137 v-3 M98 135 v-3 M106 137 v-3', '#fff', 1.8)
    + k.limb(D ? 'M44 98 Q34 110 32 118' : 'M44 90 Q28 82 22 68', B, 7) + (D ? '' : k.hand(22, 68, 7))
    + k.body(body, B, { shine: [58, 48, 10, 6, -30], inner: k.e(80, 110, 27, 21, BL, 0) + k.c(68, 104, 3, '#ffd07a', 0) + k.c(92, 116, 3.6, '#ffd07a', 0) + k.c(84, 100, 2.2, '#ffd07a', 0)
        + k.c(108, 70, 4, '#a98ae6', 0) + k.c(48, 96, 3.4, '#a98ae6', 0) + k.c(112, 98, 2.6, '#a98ae6', 0) })
    + k.limb(D ? 'M54 44 C44 40 36 48 40 56 C44 62 52 58 50 54' : 'M56 44 C44 34 32 42 36 54 C40 63 52 60 48 52', HORN, 6.4)
    + k.limb(D ? 'M106 44 C116 40 124 48 120 56 C116 62 108 58 110 54' : 'M104 44 C116 34 128 42 124 54 C120 63 108 60 112 52', HORN, 6.4)
    + (D ? '' : k.line('M40 42 l3 4 M33 50 l5 1 M120 42 l-3 4 M127 50 l-5 1', '#e0c890', 1.6))
    + k.cheeks(56, 80, 104, 80, 6) + k.c(52, 76, 1.2, '#5b3fa0', 0) + k.c(56, 74, 1.2, '#5b3fa0', 0) + k.c(104, 74, 1.2, '#5b3fa0', 0) + k.c(108, 76, 1.2, '#5b3fa0', 0)
    + k.eye(80, 48, 6.6, { look: [0, -0.4] })
    + k.eye(65, 64, 9, { look: [0.3, 0.2] }) + k.eye(95, 64, 9, { look: [0.3, 0.2] })
    + (D ? '' : k.line('M54 52 Q62 48 72 53 M88 53 Q98 48 106 52', ink, 3.2))
    + k.mouth('laugh', 80, 80, 15)
    + (D ? '' : k.r(73, 81, 6, 6, 1.5, '#fff', 1.4) + k.r(81, 81, 6, 6, 1.5, '#fff', 1.4))
    + (D ? k.g(crown, 'translate(-46 96) rotate(-70 80 24)') : k.g(crown, 'rotate(-12 80 32)'))
    + (D ? flag + k.hand(31, 118, 7) : '')
    + (D ? k.limb('M116 98 Q126 110 126 120', B, 7) + k.hand(126, 120, 7) : k.limb('M117 88 Q130 90 136 80', B, 7) + k.hand(136, 80, 7))
    + scepter;
  const pose = D ? 'translate(80 143) rotate(-3) scale(.96 .9) translate(-80 -143)' : '';
  const ty = D ? 143 - (143 - 26) * 0.9 : 26;
  const dizzy = D ? `<g class="vm-dizzy" style="transform-origin:80px ${ty}px"><ellipse cx="80" cy="${ty}" rx="22" ry="6" fill="none" stroke="${ink}" stroke-width="1.3" stroke-dasharray="3 3" opacity=".5"/>`
    + k.spark(60, ty, 5) + k.spark(99, ty - 2, 4.4, '#7fd0ff') + k.spark(80, ty + 6, 3.4, '#ff8fc0') + '</g>' : '';
  return `<svg class="villain villain--boss${D ? ' villain--defeated' : ''}" viewBox="0 0 160 150" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">`
    + `<defs><filter id="vwob${n}" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="${n % 97}"/><feDisplacementMap in="SourceGraphic" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs>`
    + `<g filter="url(#vwob${n})"><ellipse cx="80" cy="143" rx="50" ry="4.5" fill="#1c2340" opacity=".1"/>`
    + (pose ? `<g transform="${pose}">${art}</g>` : art) + dizzy + `</g></svg>`;
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
