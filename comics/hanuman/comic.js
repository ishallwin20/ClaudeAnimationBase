// CHIRANJEEVI Issue 2 · HANUMAN: the pages, their panels and their words (the script, with every verse: SCRIPT.md
// beside this file). A page is 1080 × 1350; a panel's r = [x, y, w, h] on the page. Words sit in PANEL units, and a
// number in (0, 1] is a fraction of the panel (x of its width, y of its height):
//   box:   [{ text, x, y, w, small, list, size }]      a caption box, its top-left at (x, y), at most w wide
//   say:   [{ text, x, y, w, tail, kind, size }]       a balloon centred at (x, y); tail [x, y] points at the speaker;
//                                                     kind 'speech' (default) | 'thought' | 'whisper' | 'sky'
//   sfx:   [{ text, x, y, size, rot, col }]            a sound effect
//   title: [{ text, x, y, size, col, font }]           display lettering (Marcellus; font 'Kalam' for a subtitle)
// art names ART[art] in src/scenes/hanuman_*.js; a panel without art yet is drawn grey with its note.
// Pages 1–8 are the free preview: page 8 must end on the worst moment.
function rows(spec) {
  const M = 24, G = 16, PW = 1080, PH = 1350, out = [];
  const hs = spec.reduce((s, r) => s + r[0], 0), availH = PH - 2 * M - G * (spec.length - 1);
  let y = M;
  for (const [hw, cols] of spec) {
    const h = Math.round(availH * hw / hs), ws = cols.reduce((s, c) => s + c, 0), availW = PW - 2 * M - G * (cols.length - 1);
    let x = M;
    for (const cw of cols) { const w = Math.round(availW * cw / ws); out.push([x, y, w, h]); x += w + G; }
    y += h + G;
  }
  return out;
}
const pg = (spec, panels, o = {}) => { const R = rows(spec); return { ...o, panels: panels.map((p, i) => ({ r: p.r || R[i], ...p })) }; };
const FULL = [[1, [1]]];
const numbered = (L) => Object.fromEntries(L.map((p, i) => [i + 1, p]));
const FACE = { edge0: .14, edge1: .3 };   // gentler ink on faces (COMIC_GUIDE.md)

const COMIC = {
  slug: 'hanuman', title: 'Hanuman', series: 'CHIRANJEEVI', issue: 2, lang: 'en',
  pages: numbered([
    // ================= FREE PREVIEW (1–8) =================
    // 1 · cover
    pg(FULL, [{ art: 'cover', ink: FACE, note: 'Bal Hanuman, tiny, at full stretch in the sky, one paw reaching for a sun red as a hibiscus that fills the top half. From the top corner a white-violet bolt is already coming.',
      title: [{ text: 'CHIRANJEEVI · 2', y: .05, size: 40 }, { text: 'HANUMAN', y: .8, size: 132, col: '#FFE7A6' }, { text: 'He could die any day he chose.', y: .88, size: 46, font: 'Kalam' }] }]),
    // 2 · the question (7.35.1–18)
    pg([[1.15, [1]], [.8, [1.25, 1]], [.8, [1]]], [
      { art: 'valiSugriva', note: 'Flashback in cool blues: Vali, huge, beating Sugriva down on a rocky hill. Behind them a young vanara stands with his fists at his sides and does nothing.',
        box: [{ text: 'After the war, in Ayodhya, Ram asked the sage Agastya a question in front of the whole court.', w: 560 }] },
      { art: 'ramAsks', ink: FACE, note: 'Ram on his throne (right), leaning forward.',
        say: [{ text: 'Vali and Ravana had strength no one could match. Neither was equal to Hanuman.', x: .3, y: .42, w: 300, size: 26, tail: [.62, .4] }] },
      { art: 'ramAsks2', ink: FACE, note: 'Close on Ram: the real question.',
        say: [{ text: 'So when Vali hunted his friend Sugriva, why didn\'t Hanuman burn him like a dry creeper?', x: .28, y: .45, w: 230, size: 24, tail: [.58, .55] }] },
      { art: 'hanBowed', ink: FACE, note: 'Hanuman at Ram\'s feet, head bowed, eyes closed. Agastya speaks from off panel.',
        say: [{ text: 'Because he didn\'t know he could.', x: .26, y: .3, w: 340, tail: [-.02, .2] }, { text: 'Listen to what he did as a child.', x: .26, y: .7, w: 340, tail: [-.02, .62] }] },
    ]),
    // 3 · hungry (7.35.19–23)
    pg([[1, [1, 1]], [.9, [1]], [1.05, [1]]], [
      { art: 'anjanaLeaves', ink: FACE, note: 'Dawn on Meru. Anjana kisses the sleeping newborn on his curl and slips away into the woods with a basket.',
        box: [{ text: 'On Mount Meru, his mother Anjana left him for a moment, to gather fruit.', w: 400 }] },
      { art: 'babyWail', ink: FACE, note: 'He wakes alone on a rock, golden as ripe rice, and cries hard, tiny fists up.',
        box: [{ text: 'He was a newborn. He was hungry.', x: .05, y: .82, w: 380 }], sfx: [{ text: 'WAAAH!', x: .8, y: .6, size: 60, rot: .12 }] },
      { art: 'sunRise', note: 'Over the hills the rising sun, red as a hibiscus. No text.' },
      { art: 'babyFruit', ink: FACE, note: 'Close: the wet eyes go wide, a red disc in each. Tears stop. Drool.',
        say: [{ text: 'Fruit.', x: .8, y: .26, w: 200, kind: 'thought', size: 48 }] },
    ]),
    // 4 · the leap (7.35.23–29) · splash
    pg(FULL, [{ art: 'leap', ink: FACE, note: 'Splash: the newborn launched into the sky, the forest dropping away, a trail of torn leaves; the sun ahead. Inset bottom right: Vayu flying behind him, breathing snow.',
      box: [{ text: 'He jumped at the sun.', x: .05, y: .04, w: 400 }, { text: 'Gods, demons and siddhas watched him go. "Not the Wind, not Garuda, not even the mind moves like this. If this is the baby, what will he be when he\'s grown?"', x: .5, y: .62, w: 470, small: true },
        { text: 'His father, the Wind, flew behind him, cold as snow, so the sun would not burn him.', x: .5, y: .88, w: 480, small: true }],
      sfx: [{ text: 'WHOOOSH', x: .3, y: .3, size: 96, rot: -.25 }] }]),
    // 5 · the sun · Rahu (7.35.30–42)
    pg([[1.1, [1]], [1, [1, 1]], [.85, [1]]], [
      { art: 'surya', ink: FACE, note: 'The sun\'s fire filling the panel, Surya\'s face in the flames looking down, gently, at the small gold shape coming.',
        box: [{ text: 'The Sun did not burn him.', w: 320 }, { text: '"He\'s a child. He doesn\'t know what he\'s doing. And great work waits for him."', x: .03, y: .3, w: 360 }] },
      { art: 'rahu', note: 'Out of the dark beside the sun: a colossal head with no body, teeth bared.',
        box: [{ text: 'It was an eclipse day. Rahu had come to eat the sun.', w: 380 }] },
      { art: 'babyGrabs', ink: FACE, note: 'The baby turns from the sun and lunges at Rahu, delighted; the giant head recoils.',
        box: [{ text: 'The baby grabbed for him instead.', x: .05, y: .82, w: 380 }] },
      { art: 'rahuFlees', ink: FACE, note: 'Rahu fleeing across the sky, screaming; the baby chasing, tail streaming.',
        say: [{ text: 'INDRA! INDRA!', x: .56, y: .3, w: 340, size: 52, tail: [.3, .5] }] },
    ]),
    // 6 · a bigger fruit (7.35.33–46)
    pg([[1.1, [1]], [1, [1, 1]], [.8, [1]]], [
      { art: 'indraRides', note: 'Indra on Airavata, the white four-tusked elephant, gold garland, Rahu flying ahead.',
        box: [{ text: 'Indra, king of the gods, came on his elephant.', w: 420 }], say: [{ text: 'Don\'t be afraid. I\'ll kill it.', x: .2, y: .78, w: 300, tail: [.5, .3] }] },
      { art: 'babyBigger', ink: FACE, note: 'The baby sees Airavata: bigger, whiter, rounder than the sun. Eyes huge, drool.',
        say: [{ text: 'Bigger fruit.', x: .7, y: .2, w: 240, kind: 'thought', size: 40 }] },
      { art: 'babyBlaze', ink: FACE, note: 'He charges, and for a moment his small body blazes like fire.',
        box: [{ text: 'For a moment he blazed like Indra and Agni together.', x: .05, y: .78, w: 400 }] },
      { art: 'vajraLeaves', note: 'Indra\'s hand opens; the vajra leaves it.',
        box: [{ text: 'Indra wasn\'t even very angry.', x: .55, y: .72, w: 420 }] },
    ]),
    // 7 · the vajra (7.35.46–47) · splash
    pg([[2, [1]], [1, [1]]], [
      { art: 'vajraHit', note: 'The thunderbolt strikes the tiny body: a white-violet star, the child\'s silhouette black inside it.',
        sfx: [{ text: 'KRA-KOOM', x: .5, y: .2, size: 130, rot: -.08 }] },
      { art: 'babyFallen', ink: FACE, note: 'A small golden body on black rock, still. Blood at the corner of the mouth.',
        box: [{ text: 'He fell onto a mountain. His left jaw broke.', w: 420 }, { text: 'Jaw, in Sanskrit: hanu.', x: .6, y: .78, w: 360, small: true }] },
    ]),
    // 8 · the wind stops (7.35.48–51) · the preview's last page
    pg([[1, [1, 1]], [1.1, [1]]], [
      { art: 'vayuLifts', ink: FACE, note: 'Vayu kneels and lifts the limp child. Grief turning to rage.',
        box: [{ text: 'The Wind was furious with Indra.', w: 360 }] },
      { art: 'vayuCave', note: 'Vayu walks into a cave with the child; grass, banners and flames all bend toward the cave mouth.',
        box: [{ text: 'He took his son into a cave. And he took his breath with him.', w: 380 }] },
      { art: 'choke', note: 'A rishi at his fire, hands at his throat; a deer on its knees; the fire standing dead straight; a god in the clouds clutching his chest.',
        box: [{ text: 'Out of every living body in the three worlds.', w: 520 }, { text: 'Gods. Demons. Humans. Everything that breathed began to choke.', x: .4, y: .82, w: 600 }] },
    ]),

    // ================= Act 1 · The boy who forgot (9–16) =================
    // 9 · hell (7.35.49–51)
    pg(FULL, [{ art: 'hell', note: 'Splash: the three worlds without air. Bodies stiff as wood, a gandharva frozen mid-fall, fires out, a city of people standing still as walls.',
      box: [{ text: 'Their joints cracked. Their bodies went stiff as wood. No offering went up, no prayer.', w: 520 }, { text: 'The three worlds looked like hell.', x: .5, y: .88, w: 480 }] }]),
    // 10 · to Brahma (7.35.52–63)
    pg([[1.1, [1]], [1, [1]], [.7, [1]]], [
      { art: 'godsBrahma', note: 'The gods, bellies swollen, gasping, at Brahma\'s lotus; gandharvas, asuras, men behind.',
        say: [{ text: 'You made the Wind lord of our lives. Why has he shut himself up inside us?', x: .3, y: .3, w: 420, tail: [.25, .7] }] },
      { art: 'brahmaSpeaks', ink: FACE, note: 'Brahma, four faces, grave.',
        say: [{ text: 'Indra struck down his son today. Without the Wind, a body is no different from dust.', x: .66, y: .38, w: 440, tail: [.3, .55] }] },
      { art: 'brahmaRises', note: 'Brahma rising from his lotus; everyone following.',
        say: [{ text: 'Come. We beg him, or we all die.', x: .76, y: .4, w: 380, tail: [.5, .4] }] },
    ]),
    // 11 · alive (7.35.64–7.36.6)
    pg([[1, [1]], [.9, [1, 1]], [1, [1]]], [
      { art: 'caveLap', ink: FACE, note: 'The cave: Vayu sits with the child in his lap; the child glows like sun, fire and gold. Brahma and every god crowd the mouth.' },
      { art: 'vayuBows', note: 'Vayu, holding the boy, falls at Brahma\'s feet.' },
      { art: 'brahmaTouch', ink: FACE, note: 'Brahma\'s hand on the small head. The eyes open.',
        box: [{ text: 'At one touch the child came back, like a crop given water.', x: .04, y: .82, w: 460, small: true }] },
      { art: 'windReturns', note: 'The wind rushes out of the cave: grass, cloth, hair streaming; people gasping, laughing.',
        box: [{ text: 'Seeing his son breathe, the Wind moved through every living thing again.', w: 560 }] },
    ]),
    // 12 · the boons, 1 (7.36.7–16)
    pg([[.7, [1]], [1, [1, 1]], [1, [1, 1]]], [
      { art: 'brahmaAsks', ink: FACE, note: 'Brahma, the boy on Vayu\'s shoulder, the gods around.',
        say: [{ text: 'This child will do work for you all. Give him boons.', x: .48, y: .4, w: 380, tail: [.25, .5] }] },
      { art: 'boonIndra', ink: FACE, note: 'Indra with a lotus garland.',
        say: [{ text: 'My vajra broke his jaw, his hanu. He will be called Hanuman. My vajra will never kill him.', x: .5, y: .2, w: 440, size: 24, tail: [.5, .46] }] },
      { art: 'boonSurya', ink: FACE, note: 'Surya, his light pouring into the child.',
        say: [{ text: 'A hundredth of my own light. And when he\'s old enough, I will teach him everything.', x: .5, y: .2, w: 440, size: 24, tail: [.5, .46] }] },
      { art: 'boonVaruna', ink: FACE, note: 'Varuna with his noose and water.',
        say: [{ text: 'No noose of mine, no water will kill him.', x: .5, y: .2, w: 440, size: 24, tail: [.5, .46] }] },
      { art: 'boonYama', ink: FACE, note: 'Yama with his staff.',
        say: [{ text: 'My staff won\'t touch him. He\'ll never be ill.', x: .5, y: .2, w: 440, size: 24, tail: [.5, .46] }] },
    ]),
    // 13 · the boons, 2 (7.36.17–25)
    pg([[1, [1, 1]], [1, [1, 1]], [1.1, [1]]], [
      { art: 'boonKubera', ink: FACE, note: 'Kubera with his mace.', say: [{ text: 'My mace won\'t kill him.', x: .5, y: .22, w: 340, size: 26, tail: [.5, .44] }] },
      { art: 'boonShiva', ink: FACE, note: 'Shiva with the trishul.', say: [{ text: 'Neither I nor my weapons.', x: .5, y: .22, w: 340, size: 26, tail: [.5, .44] }] },
      { art: 'boonBrahma', ink: FACE, note: 'Brahma.', say: [{ text: 'No weapon of mine.', x: .5, y: .22, w: 340, size: 26, tail: [.5, .44] }] },
      { art: 'boonVishva', ink: FACE, note: 'Vishvakarma with his tools.', say: [{ text: 'Nothing I ever forged.', x: .5, y: .22, w: 340, size: 26, tail: [.5, .44] }] },
      { art: 'boonEnd', ink: FACE, note: 'Brahma to Vayu; the boy on Vayu\'s shoulder, grinning hugely.',
        say: [{ text: 'Your son will be a terror to his enemies. Unconquerable. He will take any form he wants and go anywhere.', x: .48, y: .3, w: 460, tail: [.22, .4] }] },
    ]),
    // 14 · trouble (7.36.28–31)
    pg([[1, [1, 1]], [1, [1]], [.4, [1]]], [
      { art: 'ladle', ink: FACE, note: 'A forest ashram. The boy flips a rishi\'s ladle into the air; sacrificial pots flying.', sfx: [{ text: 'CLANG!', x: .7, y: .2, size: 60, rot: .2 }] },
      { art: 'barkSwing', ink: FACE, note: 'He swings on a line of drying bark-cloth until it tears. A rishi\'s face goes red.', sfx: [{ text: 'RRRIP', x: .3, y: .2, size: 56, rot: -.1 }] },
      { art: 'parentsNo', ink: FACE, note: 'Kesari, Vayu and Anjana, all three wagging fingers. The boy already gone; only a tail tip in frame.',
        say: [{ text: 'NO!', x: .62, y: .14, w: 200, size: 56, tail: [.5, .3] }] },
      { art: 'stripDark', note: 'Black strip.',
        box: [{ text: 'Brahma had made him safe from any rishi\'s curse. So they put up with him. Again. And again.', x: 24, y: 14, w: 900 }] },
    ]),
    // 15 · the curse (7.36.32–34)
    pg([[1.1, [1]], [.9, [1]], [1, [1]]], [
      { art: 'rishisCurse', note: 'The rishis of Bhrigu\'s and Angiras\'s lines, hands raised.',
        box: [{ text: 'Then they lost patience. Only a little.', w: 380 }],
        say: [{ text: 'You trouble us because you trust your strength. Then you will not know it. For a long, long time.', x: .68, y: .27, w: 440, tail: [.42, .45] }] },
      { art: 'eyesDim', ink: FACE, note: 'Close: the boy\'s eyes. The gold light in them goes out.' },
      { art: 'gentle', ink: FACE, note: 'The boy walking gently past the same ashram, carrying a pot of water for them.',
        box: [{ text: 'After that he went through the ashrams gently.', w: 420 }] },
    ]),
    // 16 · the answer (7.36.38–43)
    pg([[1, [1]], [1, [1]], [.8, [1]]], [
      { art: 'valiAgain', note: 'The p2 flashback, understood: Vali beating Sugriva; young Hanuman still, fists clenched, nothing coming.',
        box: [{ text: 'So when Vali drove out Sugriva, his closest friend, Hanuman just stood there. He didn\'t know what he was.', w: 560 }] },
      { art: 'agastya', ink: FACE, note: 'Agastya in the court.',
        say: [{ text: 'Who in the world is his equal? He is the ocean when it rises to drown the worlds, the fire when it wants to burn them, Death at the end of everything.', x: .6, y: .45, w: 560, tail: [.2, .7] }] },
      { art: 'hanBowed2', ink: FACE, note: 'Hanuman at Ram\'s feet, eyes still lowered.',
        box: [{ text: 'But one day, someone reminded him.', x: .05, y: .4, w: 440 }] },
    ]),

    // ================= Act 2 · Remember (17–21) =================
    // 17 · the shore (4.64)
    pg([[1.2, [1]], [1, [1, 1, 1, 1]], [1, [1]]], [
      { art: 'shore', note: 'The southern ocean at dusk, endless. A vast army of vanaras on the beach.',
        box: [{ text: 'Years later. Sita had been taken across this sea: a hundred yojanas of water to Lanka.', w: 560 }] },
      { art: 'leap10', note: 'A vanara.', say: [{ text: 'Ten yojanas.', x: .5, y: .2, w: 200, tail: [.5, .5] }] },
      { art: 'leap20', note: 'Another.', say: [{ text: 'Twenty.', x: .5, y: .2, w: 180, tail: [.5, .5] }] },
      { art: 'leap30', note: 'Another.', say: [{ text: 'Thirty.', x: .5, y: .2, w: 180, tail: [.5, .5] }] },
      { art: 'leap50', note: 'Another, faces falling.', say: [{ text: 'Fifty.', x: .5, y: .2, w: 180, tail: [.5, .5] }] },
      { art: 'hanAlone', ink: FACE, note: 'Far from them, alone on a rock, Hanuman sits silent.' },
    ]),
    // 18 · Jambavan (4.65.1–28)
    pg([[1, [1]], [1, [1, 1]], [1, [1]]], [
      { art: 'jambavan', ink: FACE, note: 'Jambavan, an old grey bear, leaning on a staff, beside Hanuman.',
        say: [{ text: 'Why do you sit alone and silent? You\'re greater than every living thing. Why don\'t you know who you are?', x: .53, y: .3, w: 440, tail: [.28, .45] }] },
      { art: 'jambaMemory', note: 'Gold flashback: the newborn leaping at the sun.',
        say: [{ text: 'As a baby you leapt at the rising sun. Indra\'s vajra broke your jaw. That\'s why you\'re called Hanuman.', x: .5, y: .22, w: 420, size: 26, tail: [.0, .5] }] },
      { art: 'hanEyes', ink: FACE, note: 'Close on Hanuman\'s eyes, lifting.',
        say: [{ text: 'When Indra saw you healed, he gave you a boon: you will die only when you choose.', x: .5, y: .2, w: 420, size: 26, tail: [-.05, .3] }] },
      { art: 'jambaWind', ink: FACE, note: 'Jambavan\'s hand on his shoulder.',
        say: [{ text: 'You are the Wind\'s own son. In leaping, you are his equal.', x: .5, y: .2, w: 420, tail: [.26, .4] }] },
    ]),
    // 19 · rise (4.65.32–36)
    pg([[1, [1, 1]], [1.4, [1]]], [
      { art: 'jambaOld', ink: FACE, note: 'Jambavan, old.', say: [{ text: 'I\'m old now. My strength is gone. Yours is the time.', x: .5, y: .2, w: 400, tail: [.5, .38] }] },
      { art: 'jambaGetUp', ink: FACE, note: 'Jambavan pointing at the sea.', say: [{ text: 'Get up. Cross the ocean. The whole army wants to see what you are.', x: .5, y: .2, w: 400, tail: [.45, .38] }] },
      { art: 'hanRises', ink: FACE, note: 'Hanuman rising to his feet, the vanaras turning toward him.' },
    ]),
    // 20 · he grows (4.66.1–7) · splash
    pg(FULL, [{ art: 'hanGrows', ink: FACE, note: 'Splash: Hanuman swelling to the size of a hill, tail lashing, yawning like a lion in a cave, face blazing like smokeless fire. Vanaras tiny at his feet.',
      box: [{ text: 'As they praised him, he grew. He yawned like a lion waking in its cave.', w: 520 }],
      say: [{ text: 'I am the Wind\'s own son. No one alive can leap like me.', x: .5, y: .8, w: 560, size: 36, tail: [.5, .62] }] }]),
    // 21 · Mahendra (5.1.10–21) · splash
    pg(FULL, [{ art: 'mahendra', note: 'Splash: he crouches on Mount Mahendra and pushes; water bursts from the rock, trees drop their flowers, snakes bite the rocks which catch fire.',
      box: [{ text: 'He gripped the mountain with his hands and feet. It bled water like an elephant in rut. Snakes bit the rocks, and the rocks burst into flame.', w: 560 }],
      sfx: [{ text: 'KRRRAKK', x: .6, y: .7, size: 110, rot: -.1 }] }]),

    // ================= Act 3 · Lanka (22–40) =================
    // 22 · the leap
    pg(FULL, [{ art: 'oceanLeap', note: 'Splash: Hanuman stretched across the sky over the ocean, the sea pulled up in his wake.',
      box: [{ text: 'A hundred yojanas of sea.', x: .05, y: .88, w: 420 }] }]),
    // 23 · Simhika (5.1.166–174)
    pg([[1, [1]], [1, [1]], [1.2, [1]]], [
      { art: 'simhikaRises', note: 'Something huge rising out of the water below.',
        box: [{ text: 'In the sea lived Simhika, a rakshasi who caught things by their shadow.', w: 520 }] },
      { art: 'shadowCaught', note: 'His shadow on the water seized; Hanuman jerked to a stop mid-air like a ship in a headwind.' },
      { art: 'simhikaMouth', note: 'He grows. Her mouth opens, wide as the sky, deep as the underworld.' },
    ]),
    // 24 · inside (5.1.175–179)
    pg([[.8, [1]], [1.6, [1]], [.7, [1]]], [
      { art: 'hanShrinks', note: 'He shrinks to nothing and dives into her mouth.',
        box: [{ text: 'The siddhas watched him vanish into her, like the moon swallowed by Rahu.', w: 560 }] },
      { art: 'burstOut', note: 'He bursts out of her body, nails red, her vitals torn out.',
        box: [{ text: 'With his nails he tore out her vitals, and flew out.', x: .5, y: .85, w: 480 }], sfx: [{ text: 'SHRRAKK', x: .3, y: .2, size: 120, rot: -.12 }] },
      { art: 'simhikaSinks', note: 'She sinks dead.', say: [{ text: 'A terrible thing, and well done.', x: .7, y: .4, w: 380, kind: 'sky' }] },
    ]),
    // 25 · the golden city (5.2–5.10)
    pg([[1.1, [1]], [1, [1]], [1, [1]]], [
      { art: 'lankaNight', note: 'Lanka at night on its mountain, gold walls, a hundred thousand guards.' },
      { art: 'roofs', note: 'Hanuman, small now, slipping across moonlit roofs, peering into palaces.' },
      { art: 'wallDawn', ink: FACE, note: 'Hanuman on a wall at dawn, nowhere left to look.',
        box: [{ text: 'He looked everywhere. She wasn\'t anywhere.', w: 420 }], say: [{ text: 'Not giving up is the root of every good thing.', x: .7, y: .6, w: 360, kind: 'thought' }] },
    ]),
    // 26 · two months (5.13–5.20)
    pg([[1, [1]], [1.1, [1]], [.9, [1]]], [
      { art: 'grove', note: 'The Ashoka grove. Sita under a shimshapa tree, thin, rakshasis around her.' },
      { art: 'ravanaThreat', ink: FACE, note: 'Ravana, ten crowned heads, looming over her.',
        say: [{ text: 'Two months. If you don\'t come to my bed by then, my cooks will cut you up in the kitchen for my breakfast.', x: .35, y: .3, w: 520, tail: [.65, .6] }] },
      { art: 'eyesLeaves', ink: FACE, note: 'In the leaves above: Hanuman\'s eyes. His fist closes on a branch until the bark splits.', sfx: [{ text: 'krk', x: .75, y: .7, size: 50 }] },
    ]),
    // 27 · the ring (5.33–5.36)
    pg([[1, [1]], [1, [1, 1]]], [
      { art: 'ringOffer', ink: FACE, note: 'Hanuman drops softly to her; she recoils. He holds out Ram\'s ring.' },
      { art: 'ringFace', ink: FACE, note: 'Sita pressing the ring to her face.' },
      { art: 'jewelGive', ink: FACE, note: 'She gives him her hair jewel for Ram.' },
    ]),
    // 28 · a message for Ravana (5.39–5.40)
    pg(FULL, [{ art: 'groveSmash', note: 'Hanuman tearing the grove apart: trees uprooted, pavilions smashed. One tree untouched: hers.',
      say: [{ text: 'I found her. Now let them see what Ram\'s messenger is.', x: .3, y: .12, w: 460, kind: 'thought' }], sfx: [{ text: 'KRASSH', x: .7, y: .6, size: 110, rot: .1 }] }]),
    // 29 · eighty thousand (5.40.23–29; 5.41.5–9) · splash
    pg(FULL, [{ art: 'kinkaras', ink: FACE, note: 'Splash: at the grove gate Hanuman, big as a hill, lashes his tail; eighty thousand kinkaras with hammers and maces pour at him like moths into a fire. He roars.',
      box: [{ text: 'Ravana sent the kinkaras: eighty thousand, huge-bellied, huge-fanged.', w: 480 }],
      say: [{ text: 'VICTORY TO RAM! I AM HANUMAN, SERVANT OF RAM! A THOUSAND RAVANAS COULD NOT STAND AGAINST ME!', x: .5, y: .82, w: 760, size: 44, tail: [.5, .55] }] }]),
    // 30 · the iron bar (5.40.31–34)
    pg([[1, [1, 1]], [1.2, [1]], [.9, [1]]], [
      { art: 'beamTear', ink: FACE, note: 'He tears the iron beam out of the gate.' },
      { art: 'beamFrame', note: 'Close on the beam ripping free.', sfx: [{ text: 'SKREEE', x: .5, y: .3, size: 60 }] },
      { art: 'beamSwing', note: 'The beam swinging through bodies; rakshasas broken and flying.', sfx: [{ text: 'KRUNCH', x: .7, y: .3, size: 110, rot: .12 }] },
      { art: 'gateSit', ink: FACE, note: 'Hanuman sitting on the gate, the ground covered in dead.',
        box: [{ text: 'He killed them all, then sat back down on the gate, waiting for more.', w: 520 }] },
    ]),
    // 31 · more (5.40.36–5.44)
    pg([[1, [1]], [1, [1]], [1, [1]]], [
      { art: 'jambumali', note: 'Jambumali, Prahasta\'s son, with his bow.' },
      { art: 'ministersSons', note: 'The ministers\' seven sons in their chariots.' },
      { art: 'generals', note: 'Five generals with their armies. Each ends under the same gate.' },
    ]),
    // 32 · Aksha (5.45.1–25)
    pg([[1, [1]], [1, [1]], [1, [1]]], [
      { art: 'ravanaLooks', ink: FACE, note: 'Ravana on his throne turning his eyes on his young son.', box: [{ text: 'Then Ravana looked at his son Aksha.', w: 420 }] },
      { art: 'aksha', ink: FACE, note: 'Aksha: young, beautiful, gold-painted bow, a chariot of eight horses, rising like a fire fed with ghee.' },
      { art: 'akshaArrows', ink: FACE, note: 'Aksha\'s arrows punch into Hanuman\'s chest. Hanuman roars.', sfx: [{ text: 'THUK THUK', x: .3, y: .3, size: 70 }] },
    ]),
    // 33 · the young sun (5.45.26–29)
    pg([[1.2, [1]], [1, [1.4, 1]]], [
      { art: 'hanAdmires', ink: FACE, note: 'Hanuman, blood on his chest, looking at the boy with something like admiration.',
        say: [{ text: 'He\'s just a boy, bright as the young sun, and he fights like a man. I don\'t want to kill him.', x: .35, y: .3, w: 500, kind: 'thought' }] },
      { art: 'hanDecides', ink: FACE, note: 'Hanuman\'s eyes hardening.', say: [{ text: 'But a fire that keeps growing can\'t be ignored.', x: .5, y: .3, w: 400, kind: 'thought' }] },
      { art: 'babyInset', ink: FACE, note: 'Small, gold, the only warm panel: the newborn from p4, leaping at the young sun.' },
    ]),
    // 34 · whirled (5.45.31–39)
    pg([[.8, [1]], [1.6, [1]], [.8, [1]]], [
      { art: 'horsesDie', note: 'His palms kill the eight horses; the chariot crashes; Aksha leaps into the air with his sword.' },
      { art: 'whirl', note: 'Hanuman catches him by both feet in mid-air and whirls him round and round, a blur, as Garuda whirls a snake.', sfx: [{ text: 'WHUMWHUMWHUM', x: .5, y: .15, size: 90, rot: -.06 }] },
      { art: 'akshaDead', note: 'The body on the ground, broken.',
        box: [{ text: 'The gods and the great rishis stared.', w: 400 }, { text: 'He went back to the gate, like Death at the end of the world, and waited.', x: .45, y: .55, w: 520 }] },
    ]),
    // 35 · bound (5.46)
    pg([[1, [1]], [1, [1, 1]]], [
      { art: 'indrajit', ink: FACE, note: 'Indrajit in his chariot, drawing the Brahma weapon.' },
      { art: 'bound', note: 'Hanuman wrapped in its coils, falling.' },
      { art: 'calmEyes', ink: FACE, note: 'His eyes, calm: he lets it hold him, to meet Ravana.' },
    ]),
    // 36 · Ravana's court (5.47–5.51)
    pg([[1.2, [1]], [.8, [1, 1]], [.8, [1, 1]]], [
      { art: 'court', note: 'Ravana on a crystal throne blazing with gems; Hanuman bound before him.' },
      { art: 'hanSpeaks', ink: FACE, note: 'Hanuman.', say: [{ text: 'Give Sita back.', x: .5, y: .25, w: 300, tail: [.5, .65] }] },
      { art: 'ravanaKill', ink: FACE, note: 'Ravana.', say: [{ text: 'Kill him.', x: .5, y: .25, w: 220, tail: [.5, .65] }] },
      { art: 'vibhishana', ink: FACE, note: 'Vibhishana.', say: [{ text: 'A messenger is never killed.', x: .5, y: .25, w: 340, tail: [.5, .65] }] },
      { art: 'ravanaBurn', ink: FACE, note: 'Ravana.', say: [{ text: 'Then burn his tail.', x: .5, y: .25, w: 300, tail: [.5, .65] }] },
    ]),
    // 37 · be cool (5.51)
    pg([[1, [1]], [1, [1]], [1, [1]]], [
      { art: 'tailRags', note: 'Oiled rags wound round his tail; torches; the crowd jeering as he\'s dragged through the streets.' },
      { art: 'sitaPrays', ink: FACE, note: 'In the grove, Sita hears and prays to the fire.',
        say: [{ text: 'If I have been faithful to one husband, be cool for Hanuman.', x: .62, y: .4, w: 440, tail: [.3, .6] }] },
      { art: 'tailCool', ink: FACE, note: 'The tail in full flame. Hanuman\'s face: surprised. It doesn\'t burn.' },
    ]),
    // 38 · Lanka burns, 1
    pg(FULL, [{ art: 'burn1', note: 'Splash: Hanuman bursts his ropes and runs roof to roof, tail a torch. Palaces of gold catch.',
      box: [{ text: 'Mansions of gold and pearl came crashing down, like the palaces of the blessed falling out of heaven when their merit runs out.', w: 560 }] }]),
    // 39 · Lanka burns, 2
    pg(FULL, [{ art: 'burn2', note: 'Splash: the whole city on fire from above; rivers of melted gold, silver and gems running out of the houses.',
      box: [{ text: 'Fire is never full of wood. Hanuman was never full of killing.', x: .4, y: .88, w: 560 }] }]),
    // 40 · Sita (5.53.1–7)
    pg([[1, [1]], [.9, [1, 1]], [1, [1]]], [
      { art: 'shoreLooks', note: 'Hanuman on the shore, his tail out in the sea, Lanka burning behind him.', box: [{ text: 'Then he looked at what he\'d done.', w: 400 }] },
      { art: 'horror', ink: FACE, note: 'His face in horror.', say: [{ text: 'If Lanka burned, Sita burned. I\'ve killed the one I came to save.', x: .5, y: .28, w: 400, tail: [.5, .7] }] },
      { art: 'wisdom', ink: FACE, note: 'Hanuman, head in hands.', say: [{ text: 'Blessed are those who put out their anger with wisdom, as water puts out fire.', x: .5, y: .28, w: 400, kind: 'thought' }] },
      { art: 'sitaAlive', ink: FACE, note: 'He flies back over the smoke to the grove: Sita, alive, under her tree.' },
    ]),

    // ================= Act 4 · The war (41–42) =================
    pg(FULL, [{ art: 'mountain', note: 'Splash: night battlefield, the army dying below; Hanuman crossing the sky holding a whole mountain peak bright as the sun.',
      box: [{ text: 'In the war, when Ram\'s army lay dying, he brought back a mountain.', w: 520 }] }]),
    pg([[1, [1]], [1, [1, 1]]], [
      { art: 'ravanaFalls', note: 'Ravana falls.' },
      { art: 'ramSita', ink: FACE, note: 'Sita and Ram.' },
      { art: 'crowned', ink: FACE, note: 'Ram crowned, Hanuman at his feet.',
        box: [{ text: 'Ravana fell. Ram was crowned. And everyone who had fought for him came to Ayodhya.', x: .05, y: .72, w: 420 }] },
    ]),

    // ================= Act 5 · The choice (43–46) =================
    pg([[1, [1]], [1, [1]], [1, [1]]], [
      { art: 'gifts', note: 'The court: Sugriva, Vibhishana, the vanaras and bears receiving gold and jewels, taking leave.' },
      { art: 'hanAsks', ink: FACE, note: 'Hanuman bowing, hands joined.', say: [{ text: 'My love for you will never move. My devotion goes nowhere else.', x: .65, y: .4, w: 440, tail: [.3, .6] }] },
      { art: 'hanAsks2', ink: FACE, note: 'Closer.', say: [{ text: 'As long as I can hear Ram\'s story on this earth, let my life stay in my body.', x: .65, y: .4, w: 440, tail: [.3, .6] }] },
    ]),
    pg(FULL, [{ art: 'embrace', ink: FACE, note: 'Splash: Ram rises from the throne and holds him.',
      say: [{ text: 'So it will be. As long as the worlds stand, my story will stand. And as long as it is told, your life stays in your body.', x: .5, y: .12, w: 680, tail: [.45, .4] }],
      box: [{ text: 'He took the necklace from his own neck, bright as the moon, and put it on Hanuman. Hanuman looked like a golden mountain with the moon on its peak.', x: .05, y: .82, w: 620 }] }]),
    pg([[.9, [1, 1]], [1.2, [1]]], [
      { art: 'ashwatthama', ink: FACE, note: 'Cool colours: Ashwatthama from Issue 1, the wound on his forehead.', box: [{ text: 'Ashwatthama cannot die. It is a curse.', x: .05, y: .78, w: 400 }] },
      { art: 'jambaEcho', ink: FACE, note: 'Jambavan, remembered.', say: [{ text: 'You will die only when you choose.', x: .5, y: .3, w: 360, tail: [.5, .7] }] },
      { art: 'steps', ink: FACE, note: 'Hanuman alone on the palace steps at night, the necklace catching the moon.',
        box: [{ text: 'Hanuman could die any day he chose. He chose to stay and listen.', x: .4, y: .78, w: 560 }] },
    ]),
    pg([[1, [1]], [1.3, [1]]], [
      { art: 'ramLast', ink: FACE, note: 'Ram, at the end of his reign.',
        say: [{ text: 'You set your mind on living. Don\'t break your promise. As long as my stories go through the world, keep your life.', x: .62, y: .4, w: 520, tail: [.25, .65] }] },
      { art: 'sarayu', note: 'Ram walking into the Sarayu with all who followed him; on the bank, from behind, one figure who stays.' },
    ]),

    // ================= Coda · An age later (47–50) =================
    pg([[1, [1]], [1.2, [1]]], [
      { art: 'bhimaGrove', note: 'Gandhamadana. Bhima smashing through a grove of golden plantains.', box: [{ text: 'An age later. Another son of the Wind.', w: 420 }] },
      { art: 'oldMonkey', ink: FACE, note: 'An old monkey asleep across the path on a broad stone, his tail across the way; he opens his eyes a little.' },
    ]),
    pg([[1, [1, 1]], [1, [1, 1]]], [
      { art: 'tailOneHand', note: 'Bhima takes the tail in one hand, carelessly.' },
      { art: 'tailTwoHands', ink: FACE, note: 'Both hands; sweat, eyes rolling. It does not move.' },
      { art: 'bhimaBows', ink: FACE, note: 'Bhima, bowing.', say: [{ text: 'Who are you?', x: .5, y: .25, w: 260, tail: [.5, .65] }] },
      { art: 'iAmHanuman', ink: FACE, note: 'The old monkey, smiling.', say: [{ text: 'I am Hanuman.', x: .5, y: .25, w: 280, tail: [.5, .65] }] },
    ]),
    pg([[1, [1]], [1.2, [1]]], [
      { art: 'oldTells', ink: FACE, note: 'Old Hanuman, telling.',
        say: [{ text: 'When Ram was crowned, I asked him: as long as Ram\'s story is told in the worlds, let me live. He said: so be it.', x: .62, y: .4, w: 520, tail: [.25, .65] }] },
      { art: 'singing', ink: FACE, note: 'Hanuman, eyes closed, in the plantain grove; gandharvas and apsaras singing around him.',
        say: [{ text: 'Here, they sing his deeds to me.', x: .3, y: .15, w: 380, tail: [.45, .5] }] },
    ]),
    pg(FULL, [{ art: 'lastPage', ink: FACE, note: 'The same old eyes, closed, smiling; the young sun rising red behind the Himalaya.',
      box: [{ text: 'He asked to live as long as Ram\'s story is told.', x: .08, y: .08, w: 560 }, { text: 'You just read fifty pages of it.', x: .4, y: .86, w: 560 }] }]),

    // ================= back matter =================
    pg(FULL, [{ art: 'paper', note: 'Plain dark page.',
      title: [{ text: 'FACTS USED', y: .05, size: 54 }],
      box: [{ list: true, x: 30, y: .09, w: 970, size: 22, text: 'Valmiki Ramayana (critical edition), kanda.sarga.verse:\n' +
        '• Ram\'s question, Agastya\'s answer: 7.35.1–18 · the birth, the leap, Vayu\'s snow: 7.35.19–29\n' +
        '• The Sun spares him; Rahu; Indra on Airavata; the vajra; the left jaw: 7.35.30–47\n' +
        '• The Wind stops; the worlds like hell; Brahma; the cave: 7.35.48–65\n' +
        '• Revived; the boons and the name: 7.36.1–25 · the ashrams, the curse: 7.36.28–34 · the answer: 7.36.38–43\n' +
        '• The shore: 4.64 · Jambavan, the death-at-will boon: 4.65.1–35 · he grows: 4.66.1–7\n' +
        '• Mahendra: 5.1.10–21 · Simhika: 5.1.166–179 · Lanka: 5.3.34, 5.10.10 · Ravana\'s threat: 5.20.8–9\n' +
        '• The ring and the jewel: 5.33–36 · the grove, the kinkaras, the war cry: 5.40–41\n' +
        '• Aksha: 5.45 · Indrajit: 5.46 · the court and the tail: 5.47–51 · Sita\'s prayer: 5.51.24–27\n' +
        '• Lanka burns: 5.52.10–13 · his horror: 5.53.1–7 · the mountain: 6.61.33, 63\n' +
        '• The gifts, his ask, the embrace and the necklace: 7.39.14–21 · Ram\'s last words to him: 7.98.24–25\n' +
        'Mahabharata (critical edition): Bhima and the old monkey 3.146–147; "so be it" 3.147.37; they sing to him 3.147.39' }] }]),
    pg(FULL, [{ art: 'paper', note: 'Plain dark page.',
      title: [{ text: 'WHAT THE TEXTS DON\'T SAY', y: .05, size: 48 }],
      box: [{ list: true, x: 30, y: .1, w: 970, size: 24, text:
        '• He swallowed the sun: the Hanuman Chalisa. In Valmiki he leaps to seize it.\n' +
        '• The sun looked like a mango: popular retellings. Valmiki compares it to a hibiscus (japa) flower.\n' +
        '• "You\'ll remember your strength when someone reminds you": the popular form of the curse. The text says only "for a long time" (7.36.33); Jambavan\'s reminder is how it ends in the Kishkindha Kanda.\n' +
        '• A throne of his tail in Ravana\'s court, the tail growing as they ran out of cloth: later tellings.\n' +
        '• Hanuman is present wherever the Ramayana is recited: an old prayer, not traced to a source text.\n' +
        '• Jambavan says Indra struck him in anger (4.65.21); the Uttara says "not very angry" (7.35.46). The childhood pages follow the Uttara.' }] }]),
    pg(FULL, [{ art: 'backPage', note: 'The Season 1 line-up; Bali lit, holding out his hands to a small brahmin boy.',
      title: [{ text: 'CHIRANJEEVI', y: .12, size: 84, col: '#FFE7A6' }, { text: 'Next: BALI', y: .66, size: 64 }, { text: 'The king who gave away everything', y: .72, size: 40, font: 'Kalam' }],
      box: [{ text: 'Issue 1, ASHWATTHAMA, is out now.\nrishikatha.com\nFollow @therishikatha', x: .27, y: .8, w: 520, size: 32 }] }]),
  ]),
};
