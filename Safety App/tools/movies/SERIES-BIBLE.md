# Hero Movies: Series Bible

Hero Movies are short interactive cartoons, one for each lesson. They play in `movie.html?id=<lesson-id>`. Use the cast and world below in every episode. Don't change how anyone looks, sounds or acts unless the project owner asks. Each episode uses only the characters its scenario needs.

Where things live:

- **Characters, props and sounds:** `js/movie-cast.js`. Reuse it as is. Only add new guest characters and props at the bottom of the file.
- **Places:** `js/movie-sets.js`. Add new sets at the bottom.
- **Episodes:** `js/movie-data.js`.
- **The player:** `js/page-movie.js`.
- **Voices:** run `node tools/build-movie-lines.js`, then `tools/voice/movie.py`.

## Core cast

### 1. Alex, the curious bunny
- **Role:** the everyday kid who makes understandable mistakes, so the viewer can choose for Alex.
- **Look:** lavender-white bunny with long ears and pink inner ears. Sunflower-yellow hoodie with a pocket and white strings, blue jeans, orange sneakers. Alex is always the brightest thing in the frame.
- **Personality:** bouncy, cheerful, curious. Rushes a little. Is never "bad".
- **Signature:** "Boing!" and a hop. Ears droop when unsure and shoot up after a safe choice. Alex looks at the viewer and asks "What should I do?" right before each choice.
- **Voice:** EN `af_sky`, ES `ef_dora`.

### 2. The lesson's superhero (the calm expert)
- **Role:** shows the safe path. Patient and never lectures. In this episode it's Captain Caution the owl; each lesson uses its own caped animal hero from `js/animal-heroes.js`.
- **Look:** the app's own hero drawing: caped animal, hero mask, emblem on the chest, in the lesson's theme color.
- **Signature:** **saves the day.** When a wrong choice plays out, the hero swoops in and rewinds time, then leaves a **Hero Tip** card. At the end the hero lands, cheers, gives the lesson's rule and signs off with **"Be safe, be super!"**
- **Voice:** EN `bm_fable`, ES `em_santa`.

### 3. Nutty, the squirrel sidekick (comic relief)
- **Role:** notices trouble first, before anyone else does.
- **Look:** small orange squirrel with a cream belly and a huge bushy tail. Usually holding an acorn.
- **Signature:** his tail puffs up and the orange "notice" spark pops when something needs attention.
- **Running gag:** he drops acorns, usually on his own head ("Oof! Nuts!"). He tells the joke near the end of each episode.
- **Sign-off:** "Nuts about safety!"
- **Voice:** EN `am_puck`, ES `em_alex`.

### Narrator
- A warm storyteller who opens each episode with "Once upon a time...". Short, simple sentences. Voice: EN `af_heart`, ES `ef_dora`.

## Guest cast (reuse when a lesson fits)
- **A grown-up Alex doesn't know** (goat): teal cardigan, round glasses, khaki pants. Deliberately ordinary and friendly-looking, because strangers look like anyone else. Never drawn as scary or mean. Voice: EN `am_michael`, ES `em_alex`.
- **Lifeguard Bruno** (bear): red GUARD shirt, white visor, whistle. A trusted helper who is big, warm and calm. Voice: EN `am_onyx`, ES `em_santa`.

## World
- **Sunny Meadow Park** (set `park`): a smiling sun, a rainbow, a pink castle on a far hill, a windmill, a castle-tower slide, swings, Nutty's apple oak, a duck pond with a red bridge, and a pool with a lifeguard chair. Bright fairytale colors and lots of flowers.
- **Ideas for future sets:** Alex's cozy house (kitchen, bathroom), Maple Street crosswalk, the school, the library, the beach, the grocery store.
- **Visual motif:** the orange **"notice" spark** (a star with a "!") pops over whatever the viewer should notice.
- **Sound motifs:** a 3-note rising sting with the spark, a warm 4-note chime for a safe choice, two gentle falling notes for "uh-oh", and a tape-rewind warble when the hero turns back time.
- **Banners:** "What happens next?" (orange, ✗) while a wrong choice plays out, and "Safe choice!" (blue, ✓) for the right one. The ✗ and ✓ shapes carry the meaning, not just the color.

## How every episode works
- **Format:** "what would you do" branching. Other formats to try in later episodes: "spot the trouble" scenes, a before/after comparison, or a quick-tip episode. Say which format each episode uses.
- **Cold open:** 3–5 seconds of a funny moment before the title, usually Nutty.
- **Story:** "Once upon a time..." introduces the setting and characters.
- **Choices:** each scene pauses on the lesson's real question. Wrong choices act out the lesson's own "what happens next" beats, gently. The hero then rescues, rewinds and leaves a tip, and the wrong choice is crossed out. Right choices play the safe ending and continue.
- **Ending:** the hero lands and cheers, Nutty tells a joke, and the rule appears in big words, then the sign-offs. The viewer earns the lesson's **sticker** (the hero's power name), and first-try safe choices earn stars. Both are saved in `safetylib_movies_v1`.
- **Pace:** lines are recorded slowly, with a pause after each one. 🐢 Slow mode adds more pause. Every line has captions, plus speech bubbles in the scene. Pause and Repeat are always available, and a Hero Tip waits until the viewer taps "Try again".

## Content rules
- Humor comes from the characters (Nutty's acorns, Alex's bounciness, puns), never from harm or the unsafe moment.
- Consequences stay gentle and realistic. The furthest they go is "nobody can find Alex" or "Alex feels mixed up". Nothing scary or graphic.
- Strangers and "unsafe" characters are ordinary people. The unsafe thing is the situation or the habit, never a kind of person or animal.
- Keep sentences short and level-appropriate (Level 1 is Pre-K to K). Say "grown-up", not "trusted adult".
- The emotional arc of every episode: curiosity, then a little tension, then relief.

## Continuity log
- **Ep 1, Someone I Don't Know (stranger-safety):** a goat Alex doesn't know offers candy at Sunny Meadow Park. Alex learns to stay back, say "No, thank you!" and walk to Lifeguard Bruno to tell, including what the person looked like. Alex earns the **Stranger Sense** sticker. Nutty's acorn-bonk gag starts here.
- **Callback ideas for later episodes:** the Stranger Sense sticker is on Alex's backpack, Lifeguard Bruno waves from the pool, Nutty now checks for acorns overhead (and still misses one), and Alex gradually starts reminding others of the rules.
