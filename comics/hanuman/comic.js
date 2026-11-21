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
  slug: 'hanuman', title: 'Hanuman', series: 'CHIRANJEEVI', issue: 2, lang: 'en', subtitle: 'He could die any day he chose',
  uuid: 'urn:uuid:0cc3d721-0b20-41f0-b3f6-5630a68cc570',
  description: 'As a baby, Hanuman leapt at the Sun, thinking it was a fruit. Indra struck him down, the Wind stopped, and the three worlds began to choke. The gods gave the child eight boons; the rishis made him forget his strength; Jambavan made him remember. Then came Lanka. A 58-page comic from the Valmiki Ramayana and the Mahabharata (critical editions), with the verse numbers at the back.',
  subjects: ['Comics & Graphic Novels / Mythology', 'Hanuman', 'Ramayana', 'Hindu mythology', 'Chiranjeevi'],
  toc: [[1, 'Cover'], [2, 'The question'], [9, 'Act 1 · The boy who forgot'], [18, 'Act 2 · Remember'], [25, 'Act 3 · Lanka'], [45, 'Act 4 · The war'], [47, 'Act 5 · The choice'], [51, 'Coda · An age later'], [56, 'Facts used'], [57, 'What the texts don\'t say']],
  pages: numbered([
    // ================= FREE PREVIEW (1–8) =================
    // 1 · cover
    pg(FULL, [{ art: 'cover', ink: FACE, note: 'Bal Hanuman, tiny, at full stretch in the sky, one paw reaching for a sun red as a hibiscus that fills the top half. From the top corner a white-violet bolt is already coming.',
      title: [{ text: 'CHIRANJEEVI · 2', y: .05, size: 40 }, { text: 'HANUMAN', y: .8, size: 132, col: '#FFE7A6' }, { text: 'He could die any day he chose.', y: .9, size: 48, font: 'Kalam' }] }]),
    // 2 · the question (7.35.1–18)
    pg([[1.15, [1]], [.8, [1.25, 1]], [.8, [1]]], [
      { art: 'valiSugriva', note: 'Flashback in cool blues: Vali, huge, beating Sugriva down on a rocky hill. Behind them a young vanara stands with his fists at his sides and does nothing.',
        box: [{ text: 'After the war, in Ayodhya, Ram asked the sage Agastya a question in front of the whole court.', w: 560 }] },
      { art: 'ramAsks', ink: FACE, note: 'Ram on his throne (right), leaning forward.',
        say: [{ text: 'Vali and Ravana had strength no one could match. Neither was equal to Hanuman.', x: .3, y: .42, w: 300, size: 26, tail: [.62, .4] }] },
      { art: 'ramAsks2', ink: FACE, note: 'Close on Ram: the real question.',
        say: [{ text: 'So when Vali hunted his friend Sugriva, why didn\'t Hanuman burn him like a dry creeper?', x: .245, y: .45, w: 230, size: 24, tail: [.58, .55] }] },
      { art: 'hanBowed', ink: FACE, note: 'Hanuman at Ram\'s feet, head bowed, eyes closed. Agastya speaks from off panel.',
        say: [{ text: 'Because he didn\'t know he could.', x: .26, y: .3, w: 340, tail: [-.02, .2] }, { text: 'Listen to what he did as a child.', x: .26, y: .7, w: 340, tail: [-.02, .62] }] },
    ]),
    // 3 · hungry (7.35.19–23)
    pg([[1, [1, 1]], [.9, [1]], [1.05, [1]]], [
      { art: 'anjanaLeaves', ink: FACE, note: 'Dawn on Meru. Anjana kisses the sleeping newborn on his curl and slips away into the woods with a basket.',
        box: [{ text: 'On Mount Meru, his mother Anjana left him for a moment, to gather fruit.', x: 14, y: 14, w: 300 }] },
      { art: 'babyWail', ink: FACE, note: 'He wakes alone on a rock, golden as ripe rice, and cries hard, tiny fists up.',
        box: [{ text: 'He was a newborn. He was hungry.', x: .05, y: .82, w: 380 }], sfx: [{ text: 'WAAAH!', x: .8, y: .6, size: 60, rot: .12 }] },
      { art: 'sunRise', note: 'Over the hills the rising sun, red as a hibiscus. No text.' },
      { art: 'babyFruit', ink: FACE, note: 'Close: the wet eyes go wide, a red disc in each. Tears stop. Drool.',
        say: [{ text: 'Fruit.', x: .8, y: .26, w: 200, kind: 'thought', size: 48 }] },
    ]),
    // 4 · the leap (7.35.23–29) · splash
    pg(FULL, [{ art: 'leap', ink: FACE, note: 'Splash: the newborn launched into the sky, the forest dropping away, a trail of torn leaves; the sun ahead. Inset bottom right: Vayu flying behind him, breathing snow.',
      box: [{ text: 'He jumped at the sun.', x: .05, y: .04, w: 400 }, { text: 'Gods, demons and siddhas watched him go. "Not the Wind, not Garuda, not even the mind moves like this. If this is the baby, what will he be when he\'s grown?"', x: .44, y: .555, w: 560 },
        { note: true, text: 'SIDDHAS are not sadhus.\nA sadhu is a person on earth, still on the path. A siddha is a being of the sky, already perfected, born with powers.', x: .03, y: .735, w: 440 },
        { text: 'His father, the Wind, flew behind him, cold as snow, so the sun would not burn him.', x: .5, y: .835, w: 500 }],
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
    pg([[1.1, [1]], [1, [1, 1]], [.95, [1]]], [
      { art: 'indraRides', note: 'Indra on Airavata, the white four-tusked elephant, gold garland, Rahu flying ahead.',
        box: [{ text: 'Indra, king of the gods, came on his elephant.', w: 420 }], say: [{ text: 'Don\'t be afraid. I\'ll kill it.', x: .2, y: .78, w: 300, tail: [.5, .3] }] },
      { art: 'babyBigger', ink: FACE, note: 'The baby sees Airavata: bigger, whiter, rounder than the sun. Eyes huge, drool.',
        say: [{ text: 'Bigger fruit.', x: .7, y: .2, w: 240, kind: 'thought', size: 40 }] },
      { art: 'babyBlaze', ink: FACE, note: 'He charges, and for a moment his small body blazes like fire.',
        box: [{ text: 'For a moment he blazed like Indra and Agni together.', x: .05, y: .78, w: 400 }] },
      { art: 'vajraLeaves', note: 'Indra\'s hand opens; the vajra leaves it.',
        box: [{ text: 'The Sun had spared him: he was only a child. Indra, not even very angry, threw the vajra at a newborn.', x: .42, y: .58, w: 580 }] },
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
        box: [{ text: 'He took his son into a cave. And he took his wind with him.', w: 380 }] },
      { art: 'choke', note: 'A rishi at his fire, hands at his throat; a deer on its knees; the fire standing dead straight; a god in the clouds clutching his chest.',
        box: [{ text: 'Out of every living body in the three worlds.', w: 520 }, { text: 'Gods. Demons. Humans. Everything that breathed began to choke.', x: .4, y: .82, w: 600 }] },
    ]),

    // ================= Act 1 · The boy who forgot (9–16) =================
    // 9 · hell (7.35.49–51): three panels, the three worlds
    pg([[1, [1]], [1, [1]], [1, [1]]], [
      { art: 'hellHeaven', ink: FACE, note: 'Heaven: the gods on their clouds, hands at their throats, eyes bulging; a gandharva dropping his veena.',
        box: [{ text: 'In heaven, the gods couldn\'t breathe.', x: .03, y: .06, w: 420 }] },
      { art: 'hellEarth', ink: FACE, note: 'Earth: a rishi at a dead fire, choking; villagers frozen mid-step behind; a cow on its knees.',
        box: [{ text: 'On earth, joints cracked. Bodies went stiff as wood. No offering went up, no prayer.', x: .03, y: .06, w: 440 }] },
      { art: 'hellBelow', ink: FACE, note: 'Below: the asuras in their dark halls, choking too; the lamps burning dead straight.',
        box: [{ text: 'Below the earth, even the asuras choked.', x: .03, y: .06, w: 420 }, { text: 'The three worlds looked like hell.', x: .5, y: .8, w: 500 }] },
    ]),
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
        box: [{ text: 'At one touch the child came back, like a crop given water.', x: .04, y: .74, w: 470, small: true }] },
      { art: 'windReturns', note: 'The wind rushes out of the cave: grass, cloth, hair streaming; people gasping, laughing.',
        box: [{ text: 'Seeing his son breathe, the Wind moved through every living thing again.', w: 560 }] },
    ]),
    // 12–14 · the eight boons (7.36.7–25): one numbered row per god: his name, who he is, his words and the gift
    pg([[.8, [1]], [1, [1]], [1, [1]], [1, [1]]], [
      { art: 'brahmaAsks', ink: FACE, note: 'Brahma, the boy on Vayu\'s shoulder, the gods around.',
        say: [{ text: 'This child will do work for you all. Give him boons.', x: .48, y: .4, w: 380, tail: [.25, .5] }] },
      { art: 'boonIndra', ink: FACE, note: 'Indra, king of the gods.',
        title: [{ text: '1 · INDRA', x: 0.6, y: .13, size: 46, col: '#FFE7A6' }, { text: 'king of the gods', x: 0.6, y: .28, size: 30, font: 'Kalam' }],
        say: [{ text: 'My vajra broke his jaw, his hanu. So he will be called Hanuman.', x: 0.6, y: .55, w: 600, size: 29, tail: [0.3, .42] }],
        box: [{ gift: true, text: 'Gift: a name, and the vajra can\'t kill him', x: 0.3, y: .76, w: 620, size: 28 }] },
      { art: 'boonSurya', ink: FACE, note: 'Surya, the Sun.',
        title: [{ text: '2 · SURYA', x: 0.4, y: .13, size: 46, col: '#FFE7A6' }, { text: 'the Sun', x: 0.4, y: .28, size: 30, font: 'Kalam' }],
        say: [{ text: 'A hundredth of my own light. And when he\'s old enough, I\'ll teach him everything.', x: 0.4, y: .55, w: 600, size: 29, tail: [0.7, .42] }],
        box: [{ gift: true, text: 'Gift: the Sun\'s light, and every shastra', x: 0.1, y: .76, w: 620, size: 28 }] },
      { art: 'boonVaruna', ink: FACE, note: 'Varuna, lord of the waters.',
        title: [{ text: '3 · VARUNA', x: 0.6, y: .13, size: 46, col: '#FFE7A6' }, { text: 'lord of the waters', x: 0.6, y: .28, size: 30, font: 'Kalam' }],
        say: [{ text: 'No noose of mine, no water will ever kill him.', x: 0.6, y: .55, w: 600, size: 29, tail: [0.3, .42] }],
        box: [{ gift: true, text: 'Gift: no death by water or noose', x: 0.3, y: .76, w: 620, size: 28 }] },
    ]),
    pg([[1, [1]], [1, [1]], [1, [1]], [1, [1]]], [
      { art: 'boonYama', ink: FACE, note: 'Yama, lord of death.',
        title: [{ text: '4 · YAMA', x: 0.4, y: .13, size: 46, col: '#FFE7A6' }, { text: 'lord of death', x: 0.4, y: .28, size: 30, font: 'Kalam' }],
        say: [{ text: 'My staff won\'t touch him. He\'ll never be ill.', x: 0.4, y: .55, w: 600, size: 29, tail: [0.7, .42] }],
        box: [{ gift: true, text: 'Gift: safe from Death\'s staff, never ill', x: 0.1, y: .76, w: 620, size: 28 }] },
      { art: 'boonKubera', ink: FACE, note: 'Kubera, lord of wealth.',
        title: [{ text: '5 · KUBERA', x: 0.6, y: .13, size: 46, col: '#FFE7A6' }, { text: 'lord of wealth', x: 0.6, y: .28, size: 30, font: 'Kalam' }],
        say: [{ text: 'My mace won\'t kill him in battle.', x: 0.6, y: .55, w: 600, size: 29, tail: [0.3, .42] }],
        box: [{ gift: true, text: 'Gift: safe from Kubera\'s mace', x: 0.3, y: .76, w: 620, size: 28 }] },
      { art: 'boonShiva', ink: FACE, note: 'Shiva, Mahadeva, the great god.',
        title: [{ text: '6 · SHIVA', x: 0.4, y: .13, size: 46, col: '#FFE7A6' }, { text: 'Mahadeva, the great god', x: 0.4, y: .28, size: 30, font: 'Kalam' }],
        say: [{ text: 'Neither I nor my weapons will ever kill him.', x: 0.4, y: .55, w: 600, size: 29, tail: [0.7, .42] }],
        box: [{ gift: true, text: 'Gift: safe from Shiva and his weapons', x: 0.1, y: .76, w: 620, size: 28 }] },
      { art: 'boonBrahma', ink: FACE, note: 'Brahma, the creator.',
        title: [{ text: '7 · BRAHMA', x: 0.6, y: .13, size: 46, col: '#FFE7A6' }, { text: 'the creator', x: 0.6, y: .28, size: 30, font: 'Kalam' }],
        say: [{ text: 'No Brahma-weapon will kill him. He\'ll live long.', x: 0.6, y: .55, w: 600, size: 29, tail: [0.3, .42] }],
        box: [{ gift: true, text: 'Gift: safe from Brahma\'s weapons, long life', x: 0.3, y: .76, w: 620, size: 28 }] },
    ]),
    pg([[1, [1]], [1.6, [1]]], [
      { art: 'boonVishva', ink: FACE, note: 'Vishvakarma, architect of the gods, who forged their weapons.',
        title: [{ text: '8 · VISHVAKARMA', x: 0.4, y: .13, size: 44, col: '#FFE7A6' }, { text: 'architect of the gods, who forged their weapons', x: 0.4, y: .28, size: 26, font: 'Kalam' }],
        say: [{ text: 'Nothing I ever forged will kill him. He\'ll live long.', x: 0.4, y: .55, w: 600, size: 29, tail: [0.7, .42] }],
        box: [{ gift: true, text: 'Gift: safe from every weapon he forged', x: 0.1, y: .76, w: 620, size: 28 }] },
      { art: 'boonEnd', ink: FACE, note: 'Brahma to Vayu; the boy on Vayu\'s shoulder, grinning hugely.',
        box: [{ text: 'Eight gods. Eight gifts.', x: .34, y: .03, w: 400 }],
        say: [{ text: 'Your son will be a terror to his enemies. Unconquerable. He will take any form he wants and go anywhere.', x: .5, y: .3, w: 460, tail: [.22, .4] }] },
    ]),
    // trouble (7.36.28–31: Kesari, Vayu and Anjana forbade him, 36.31)
    pg([[1, [1, 1]], [1.05, [1]], [.4, [1]]], [
      { art: 'ladle', ink: FACE, note: 'A forest ashram. The boy flips a rishi\'s ladle into the air; sacrificial pots flying.', sfx: [{ text: 'CLANG!', x: .7, y: .2, size: 60, rot: .2 }] },
      { art: 'barkSwing', ink: FACE, note: 'He swings on a line of drying bark-cloth until it tears. A rishi\'s face goes red.', sfx: [{ text: 'RRRIP', x: .3, y: .2, size: 56, rot: -.1 }] },
      { art: 'parentsNo', ink: FACE, note: 'Kesari, Vayu and Anjana, all three wagging fingers. The boy already gone; only a tail tip in frame.',
        say: [{ text: 'Hanuman! Leave the rishis\' things alone!', x: .19, y: .17, w: 300, size: 30, tail: [.2, .4] }, { text: 'Come back here, right now!', x: .81, y: .17, w: 280, size: 30, tail: [.76, .4] }],
        title: [{ text: 'KESARI, his father', x: .2, y: .93, size: 28, font: 'Kalam' }, { text: 'VAYU, the Wind', x: .48, y: .93, size: 28, font: 'Kalam' }, { text: 'ANJANA, his mother', x: .77, y: .93, size: 28, font: 'Kalam' }] },
      { art: 'stripDark', note: 'Black strip.',
        box: [{ text: 'All three told him no. He did it anyway. And Brahma had made him safe from any rishi\'s curse, so the rishis put up with him. Again. And again.', x: 24, y: 12, w: 980 }] },
    ]),
    // the curse (7.36.32–34)
    pg([[1.1, [1]], [.9, [1]], [1, [1]]], [
      { art: 'rishisCurse', note: 'The rishis of Bhrigu\'s and Angiras\'s lines, hands raised.',
        box: [{ text: 'Then they lost patience. Only a little.', w: 380 }],
        say: [{ text: 'You trouble us because you trust your strength. Then you will not know it. For a long, long time.', x: .68, y: .27, w: 440, tail: [.42, .45] }] },
      { art: 'dizzy', ink: FACE, note: 'The boy sits down hard, head spinning: spiral eyes, little stars circling, his gold glow drifting off him.',
        box: [{ text: 'He still had all his strength. He just couldn\'t remember it.', x: .03, y: .08, w: 400 }] },
      { art: 'gentle', ink: FACE, note: 'The boy walking gently past the same ashram, carrying a pot of water for them.',
        box: [{ text: 'After that he went through the ashrams gently.', w: 420 }] },
    ]),
    // the answer (7.36.38–43)
    pg([[1, [1]], [1, [1]], [.8, [1]]], [
      { art: 'valiAgain', note: 'The p2 flashback, understood: Vali beating Sugriva; young Hanuman still, fists clenched, nothing coming.',
        box: [{ text: 'So when Vali drove out Sugriva, his closest friend, Hanuman just stood there. He didn\'t know what he was.', w: 560 }] },
      { art: 'agastya', ink: FACE, note: 'Agastya in the court.',
        say: [{ text: 'Who in the world is his equal? He is the ocean when it rises to drown the worlds, the fire when it wants to burn them, Death at the end of everything.', x: .6, y: .45, w: 560, tail: [.2, .7] }] },
      { art: 'hanBowed2', ink: FACE, note: 'Hanuman at Ram\'s feet, eyes still lowered.',
        box: [{ text: 'But one day, someone reminded him.', x: .05, y: .4, w: 440 }] },
    ]),

    // ================= Act 2 · Remember =================
    // the search (Kishkindha 40–58; 4.64.1–2)
    pg([[1.1, [1]], [1, [1]], [1, [1]]], [
      { art: 'searchParty', note: 'Vanaras fanning out over forest and mountains, searching.',
        box: [{ text: 'Years later, Ravana, king of Lanka, carried off Ram\'s wife Sita. Sugriva sent the vanaras to search the whole earth for her.', w: 600 }] },
      { art: 'shore', note: 'The southern ocean at dusk, endless. A vast army of vanaras on the beach.',
        box: [{ text: 'The party that went south, led by Prince Angad, reached the sea. An old vulture, Sampati, told them where she was: Lanka, an island a hundred yojanas across the water.', w: 640 }] },
      { art: 'angadAsks', ink: FACE, note: 'Angad, the young prince, turning to the army.',
        say: [{ text: 'Who among us can leap a hundred yojanas?', x: .64, y: .34, w: 420, tail: [.36, .42] }],
        box: [{ note: true, text: 'A yojana is a measure of distance: several kilometres. A hundred of them is a long way over open sea.', x: .42, y: .66, w: 570 }] },
    ]),
    // the leaps (4.64.3–19)
    pg([[.3, [1]], [1, [1, 1, 1, 1]], [1, [1, 1, 1, 1]], [1.15, [1, 1]]], [
      { art: 'stripDark', note: 'Black strip.', box: [{ text: 'One by one, the leaders said how far each could leap.', x: 24, y: 12, w: 980 }] },
      { art: 'leap10', ink: FACE, note: 'Gaja.', say: [{ text: 'Ten yojanas.', x: .5, y: .17, w: 220, size: 30, tail: [.5, .4] }], title: [{ text: 'GAJA', x: .5, y: .92, size: 32, col: '#FFE7A6' }] },
      { art: 'leap20', ink: FACE, note: 'Gavaksha.', say: [{ text: 'Twenty.', x: .5, y: .17, w: 220, size: 30, tail: [.5, .4] }], title: [{ text: 'GAVAKSHA', x: .5, y: .92, size: 32, col: '#FFE7A6' }] },
      { art: 'leap30', ink: FACE, note: 'Gavaya.', say: [{ text: 'Thirty.', x: .5, y: .17, w: 220, size: 30, tail: [.5, .4] }], title: [{ text: 'GAVAYA', x: .5, y: .92, size: 32, col: '#FFE7A6' }] },
      { art: 'leap40', ink: FACE, note: 'Sharabha.', say: [{ text: 'Forty.', x: .5, y: .17, w: 220, size: 30, tail: [.5, .4] }], title: [{ text: 'SHARABHA', x: .5, y: .92, size: 32, col: '#FFE7A6' }] },
      { art: 'leap50', ink: FACE, note: 'Gandhamadana.', say: [{ text: 'Fifty.', x: .5, y: .17, w: 220, size: 30, tail: [.5, .4] }], title: [{ text: 'GANDHAMADANA', x: .5, y: .92, size: 23, col: '#FFE7A6' }] },
      { art: 'leap60', ink: FACE, note: 'Mainda.', say: [{ text: 'Sixty.', x: .5, y: .17, w: 220, size: 30, tail: [.5, .4] }], title: [{ text: 'MAINDA', x: .5, y: .92, size: 32, col: '#FFE7A6' }] },
      { art: 'leap70', ink: FACE, note: 'Dvivida.', say: [{ text: 'Seventy.', x: .5, y: .17, w: 220, size: 30, tail: [.5, .4] }], title: [{ text: 'DVIVIDA', x: .5, y: .92, size: 32, col: '#FFE7A6' }] },
      { art: 'leap80', ink: FACE, note: 'Sushena.', say: [{ text: 'Eighty.', x: .5, y: .17, w: 220, size: 30, tail: [.5, .4] }], title: [{ text: 'SUSHENA', x: .5, y: .92, size: 32, col: '#FFE7A6' }] },
      { art: 'leap90', ink: FACE, note: 'Jambavan, old.', say: [{ text: 'Ninety. Once I could leap farther. Now I\'m old.', x: .6, y: .22, w: 250, size: 30, tail: [.4, .42] }], title: [{ text: 'JAMBAVAN', x: .5, y: .92, size: 34, col: '#FFE7A6' }] },
      { art: 'leap100', ink: FACE, note: 'Angad.', say: [{ text: 'A hundred. But I can\'t be sure I\'d make it back.', x: .4, y: .22, w: 250, size: 30, tail: [.6, .42] }], title: [{ text: 'ANGAD', x: .5, y: .92, size: 34, col: '#FFE7A6' }] },
    ]),
    // Jambavan (4.64.11–16, 4.65.30; 4.65.1–2)
    pg([[1.2, [1]], [1, [1]], [1, [1]]], [
      { art: 'trivikrama', note: 'Gold flashback: Vishnu as Trivikrama, a giant striding across the worlds; a young bear racing round his foot.',
        box: [{ text: 'Jambavan, king of the bears, was the oldest in the army. Ages ago, when Vishnu grew into Trivikrama and strode across the worlds, young Jambavan ran around him, and around the whole earth, twenty-one times.', x: .03, y: .04, w: 560 }] },
      { art: 'jambaNow', ink: FACE, note: 'Jambavan now: old, grey, leaning on his staff, looking across the army.',
        box: [{ text: 'Now he was too old to leap that far. But he remembered things everyone else had forgotten.', x: .45, y: .08, w: 520 }] },
      { art: 'hanAlone', ink: FACE, note: 'Far from them, alone on a rock, Hanuman sits silent.',
        box: [{ text: 'And he saw Hanuman, sitting apart from them all, saying nothing.', w: 460 }] },
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
    pg([[.8, [1]], [1.5, [1]], [.85, [1]]], [
      { art: 'hanShrinks', note: 'He shrinks to nothing and dives into her mouth.',
        box: [{ text: 'The siddhas watched him vanish into her, like the moon swallowed by Rahu.', w: 560 }] },
      { art: 'burstOut', note: 'He bursts out of her body, nails red, her vitals torn out.',
        box: [{ text: 'With his nails he tore out her vitals, and flew out.', x: .5, y: .85, w: 480 }], sfx: [{ text: 'SHRRAKK', x: .3, y: .2, size: 120, rot: -.12 }] },
      { art: 'simhikaSinks', note: 'She sinks dead.', box: [{ text: 'The beings of the sky cheered him on:', x: .03, y: .08, w: 380 }],
        say: [{ text: 'A fearsome deed! You\'ve killed a mighty creature. Go on, and do what you came to do.', x: .6, y: .56, w: 500, kind: 'sky' }] },
    ]),
    // 25 · the golden city (5.2–5.10)
    pg([[1.1, [1]], [1, [1]], [1, [1]]], [
      { art: 'lankaNight', note: 'Lanka at night on its mountain, gold walls, a hundred thousand guards.',
        box: [{ text: 'He landed on the far shore and saw Lanka: a city of gold on a mountain top, guarded by a hundred thousand rakshasas.', x: .03, y: .6, w: 560 }] },
      { art: 'roofs', note: 'Hanuman, small now, slipping across moonlit roofs, peering into palaces.',
        box: [{ text: 'He waited for night, made himself small, and searched every house and palace.', x: .03, y: .06, w: 470 }] },
      { art: 'wallDawn', ink: FACE, note: 'Hanuman on a wall at dawn, nowhere left to look.',
        box: [{ text: 'He looked everywhere. She wasn\'t anywhere.', w: 420 }], say: [{ text: 'Not giving up is the root of every good thing.', x: .7, y: .6, w: 360, kind: 'thought' }] },
    ]),
    // 26 · two months (5.13–5.20)
    pg([[1, [1]], [1.1, [1]], [.9, [1]]], [
      { art: 'grove', note: 'The Ashoka grove. Sita under a shimshapa tree, thin, rakshasis around her.',
        box: [{ text: 'At last, in Ravana\'s Ashoka grove, he found her: Sita, thin and grieving under a shimshapa tree, rakshasis all around her.', x: .03, y: .05, w: 600 }] },
      { art: 'ravanaThreat', ink: FACE, note: 'Ravana, ten crowned heads, looming over her.',
        say: [{ text: 'Two months. If you still refuse to take me as your husband, my cooks will cut you up in the kitchen for my breakfast.', x: .35, y: .3, w: 520, tail: [.65, .6] }] },
      { art: 'eyesLeaves', ink: FACE, note: 'In the leaves above: Hanuman\'s eyes. His fist closes on a branch until the bark splits.', sfx: [{ text: 'krk', x: .75, y: .7, size: 50 }],
        box: [{ text: 'Hidden in the tree above her, Hanuman heard every word.', x: .03, y: .06, w: 420 }] },
    ]),
    // 27 · the ring (5.34.2–3; the jewel 5.36.52)
    pg([[1.3, [1]], [1, [1, 1]]], [
      { art: 'ringOffer', ink: FACE, note: 'Hanuman kneels before her, Ram\'s ring glowing on his open palm.',
        box: [{ text: 'When Ravana had gone, he came down to her softly.', x: .03, y: .04, w: 420 }],
        say: [{ text: 'I am Ram\'s messenger. See this ring: it bears his name. He sent me to find you.', x: .66, y: .16, w: 440, tail: [.74, .36] }] },
      { art: 'ringFace', ink: FACE, note: 'Sita holding the ring close, as if he had come (5.34.3–4).',
        box: [{ text: 'She held her husband\'s ring as if he himself had come. Her face shone like the moon set free from Rahu.', x: .05, y: .03, w: .9 }] },
      { art: 'jewelGive', ink: FACE, note: 'She puts her hair jewel into his hands, for Ram.',
        box: [{ text: 'She gave him the jewel from her hair, for Ram: proof that he had found her.', x: .05, y: .03, w: .9 }] },
    ]),
    // 28 · a message for Ravana (5.39–5.40)
    pg(FULL, [{ art: 'groveSmash', note: 'Hanuman tearing the grove apart: trees uprooted, pavilions smashed. One tree untouched: hers.',
      box: [{ text: 'Then, so that Ravana would know who had come, he tore apart the Ashoka grove where Sita was held.', x: .03, y: .86, w: 560 }],
      say: [{ text: 'I found her. Now let them see what Ram\'s messenger is.', x: .3, y: .12, w: 460, kind: 'thought' }], sfx: [{ text: 'KRASSH', x: .7, y: .6, size: 110, rot: .1 }] }]),
    // 29 · eighty thousand (5.40.23–29; 5.41.5–9) · splash
    pg(FULL, [{ art: 'kinkaras', ink: FACE, note: 'Splash: at the grove gate Hanuman, big as a hill, lashes his tail; eighty thousand kinkaras with hammers and maces pour at him like moths into a fire. He roars.',
      box: [{ text: 'Ravana sent the kinkaras: eighty thousand, huge-bellied, huge-fanged.', x: .03, y: .9, w: 480 }],
      say: [{ text: 'VICTORY TO RAM! I AM HANUMAN, SERVANT OF RAM! A THOUSAND RAVANAS COULD NOT STAND AGAINST ME!', x: .5, y: .13, w: 760, size: 44, tail: [.5, .3] }] }]),
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
      { art: 'jambumali', note: 'Jambumali, Prahasta\'s son, with his bow.', box: [{ text: 'Then came Jambumali, Prahasta\'s son, with his bow.', w: 420 }] },
      { art: 'ministersSons', note: 'The ministers\' seven sons in their chariots.', box: [{ text: 'Then the seven sons of Ravana\'s ministers.', w: 420 }] },
      { art: 'generals', note: 'Five generals with their armies. Each ends under the same gate.', box: [{ text: 'Then five generals with their armies. Every one of them ended under the same gate.', x: .3, y: .03, w: 420 }] },
    ]),
    // 32 · Aksha (5.45.1–25)
    pg([[1, [1]], [1, [1]], [1, [1]]], [
      { art: 'ravanaLooks', ink: FACE, note: 'Ravana on his throne turning his eyes on his young son.', box: [{ text: 'Then Ravana looked at his young son, Prince Aksha, whom many know as Akshayakumara.', w: 520 }] },
      { art: 'aksha', ink: FACE, note: 'Aksha: young, beautiful, gold-painted bow, a chariot of eight horses, rising like a fire fed with ghee.',
        box: [{ text: 'Aksha rode out in a chariot of eight horses, blazing like a fire fed with ghee.', x: .5, y: .06, w: 480 }] },
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
    // 35 · bound (5.46.35–52)
    pg([[1, [1]], [1, [1, 1]]], [
      { art: 'indrajit', ink: FACE, note: 'Indrajit in his chariot, drawing the Brahma weapon.',
        box: [{ text: 'Then Ravana sent Indrajit, his son who had once beaten Indra himself. (Later tellings call him Meghnad.) He loosed the Brahma weapon.', x: .5, y: .06, w: 480 }] },
      { art: 'bound', note: 'Hanuman wrapped in its coils, falling.',
        box: [{ text: 'It bound Hanuman fast. It couldn\'t harm him, and he let it hold him: now he would meet Ravana.', x: .04, y: .05, w: 440 }] },
      { art: 'calmEyes', ink: FACE, note: 'His eyes, calm: he lets it hold him, to meet Ravana.',
        box: [{ text: 'The rakshasas tied him with ropes and dragged him to Ravana\'s court.', x: .05, y: .05, w: 420 }] },
    ]),
    // 36 · Ravana's court (5.47–5.51)
    pg([[1.2, [1]], [.8, [1, 1]], [.8, [1, 1]]], [
      { art: 'court', note: 'Ravana on a crystal throne blazing with gems; Hanuman bound before him.',
        box: [{ text: 'Ravana sat on a throne of crystal, blazing with gems. Hanuman stood before him, tied.', x: .03, y: .04, w: 480 }] },
      { art: 'hanSpeaks', ink: FACE, note: 'Hanuman.', say: [{ text: 'Give Sita back.', x: .5, y: .2, w: 300, tail: [.5, .44] }] },
      { art: 'ravanaKill', ink: FACE, note: 'Ravana.', say: [{ text: 'Kill him.', x: .5, y: .2, w: 220, tail: [.5, .42] }] },
      { art: 'vibhishana', ink: FACE, note: 'Vibhishana.', say: [{ text: 'A messenger is never killed.', x: .5, y: .2, w: 340, tail: [.5, .46] }], title: [{ text: 'VIBHISHANA, Ravana\'s brother', x: .5, y: .93, size: 28, font: 'Kalam' }] },
      { art: 'ravanaBurn', ink: FACE, note: 'Ravana.', say: [{ text: 'Then burn his tail.', x: .5, y: .2, w: 300, tail: [.5, .42] }] },
    ]),
    // 37 · the tail (5.51.3–7) · splash
    pg(FULL, [{ art: 'tailRags', ink: FACE, note: 'Splash: Hanuman bound with ropes, his tail wound in oiled rags and set alight, dragged through Lanka\'s streets by jeering rakshasas with torches.',
      box: [{ text: 'They wrapped his tail in old cloth soaked in oil, set it on fire, and dragged him through the streets of Lanka.', x: .03, y: .04, w: 560 }],
      sfx: [{ text: 'FWOOMP', x: .8, y: .3, size: 80, rot: .1 }] }]),
    // be cool (5.51.24–33)
    pg([[1, [1]], [1.2, [1]]], [
      { art: 'sitaPrays', ink: FACE, note: 'In the grove, Sita hears and prays to the fire.',
        box: [{ text: 'In the grove, Sita heard what they were doing.', x: .03, y: .05, w: 400 }],
        say: [{ text: 'If I have been faithful to one husband, be cool for Hanuman.', x: .62, y: .5, w: 440, tail: [.3, .6] }] },
      { art: 'tailCool', ink: FACE, note: 'The tail in full flame. Hanuman\'s face: surprised. It doesn\'t burn.',
        box: [{ text: 'The fire blazed on his tail, but it felt as cool as snow.', x: .03, y: .05, w: 440 }] },
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
      { art: 'horror', ink: FACE, note: 'His face in horror.', say: [{ text: 'If Lanka burned, Sita burned. I\'ve killed the one I came to save.', x: .5, y: .22, w: 420, tail: [.5, .44] }] },
      { art: 'wisdom', ink: FACE, note: 'Hanuman, head in hands.', say: [{ text: 'Blessed are those who put out their anger with wisdom, as water puts out fire.', x: .5, y: .26, w: 440, kind: 'thought' }] },
      { art: 'sitaAlive', ink: FACE, note: 'He flies back over the smoke to the grove: Sita, alive, under her tree (5.54.1).',
        box: [{ text: 'Then he heard the charanas in the sky: "Lanka is burnt, but Sita is not! A wonder!" The fire hadn\'t touched her.', x: .03, y: .04, w: 520 }],
        say: [{ text: 'By good fortune, I see you unharmed.', x: .8, y: .2, w: 280, tail: [.76, .42] }] },
    ]),

    // ================= Act 4 · The war (41–42) =================
    pg(FULL, [{ art: 'mountain', note: 'Splash: night battlefield, the army dying below; Hanuman crossing the sky holding a whole mountain peak bright as the sun.',
      box: [{ text: 'In the war, Ravana\'s spear struck Lakshman down. Hanuman flew to the Himalaya for the Herb Mountain. He couldn\'t tell which herbs were which, so he brought back the whole peak.', w: 560 },
        { note: true, text: 'Valmiki calls it simply the Herb Mountain. Later tellings name it Dronagiri.', x: .5, y: .88, w: 480 }] }]),
    pg([[1, [1]], [1, [1, 1]]], [
      { art: 'ravanaFalls', note: 'Ravana falls.' },
      { art: 'ramSita', ink: FACE, note: 'Sita and Ram.' },
      { art: 'crowned', ink: FACE, note: 'Ram crowned, Hanuman at his feet.',
        box: [{ text: 'Ravana fell. Ram was crowned. And everyone who had fought for him came to Ayodhya.', x: .05, y: .72, w: 420 }] },
    ]),

    // ================= Act 5 · The choice (43–46) =================
    pg([[1, [1]], [1, [1]], [1, [1]]], [
      { art: 'gifts', note: 'The court: Sugriva, Vibhishana, the vanaras and bears receiving gold and jewels, taking leave.' },
      { art: 'hanAsks', ink: FACE, note: 'Hanuman bowing, hands joined.', say: [{ text: 'My love for you will never move. My devotion goes nowhere else.', x: .67, y: .4, w: 440, tail: [.4, .46] }] },
      { art: 'hanAsks2', ink: FACE, note: 'Closer.', say: [{ text: 'As long as I can hear Ram\'s story on this earth, let my life stay in my body.', x: .67, y: .4, w: 440, tail: [.4, .5] }] },
    ]),
    pg(FULL, [{ art: 'embrace', ink: FACE, note: 'Splash: Ram rises from the throne and holds him.',
      say: [{ text: 'So it will be. As long as the worlds stand, my story will stand. And as long as it is told, your life stays in your body.', x: .5, y: .12, w: 680, tail: [.45, .4] }],
      box: [{ text: 'He took the necklace from his own neck, bright as the moon, and put it on Hanuman. Hanuman looked like a golden mountain with the moon on its peak.', x: .05, y: .82, w: 620 }] }]),
    pg([[.9, [1, 1]], [1.2, [1]]], [
      { art: 'ashwatthama', ink: FACE, note: 'Cool colours: Ashwatthama from Issue 1, the wound on his forehead.', box: [{ text: 'Ashwatthama cannot die. It is a curse.', x: .05, y: .78, w: 400 }] },
      { art: 'jambaEcho', ink: FACE, note: 'Jambavan, remembered.', say: [{ text: 'You will die only when you choose.', x: .5, y: .22, w: 380, tail: [.5, .44] }] },
      { art: 'steps', ink: FACE, note: 'Hanuman alone on the palace steps at night, the necklace catching the moon.',
        box: [{ text: 'Hanuman could die any day he chose. He chose to stay and listen.', x: .4, y: .78, w: 560 }] },
    ]),
    pg([[1, [1]], [1.3, [1]]], [
      { art: 'ramLast', ink: FACE, note: 'Ram, at the end of his reign.',
        say: [{ text: 'You set your mind on living. Don\'t break your promise. As long as my stories go through the world, keep your life.', x: .64, y: .4, w: 520, tail: [.34, .44] }] },
      { art: 'sarayu', note: 'Ram walking into the Sarayu with all who followed him; on the bank, from behind, one figure who stays.' },
    ]),

    // ================= Coda · An age later =================
    // a new age (MBh 3.146.1–42; the yugas 3.148)
    pg([[1, [1]], [1.1, [1]], [1, [1]]], [
      { art: 'newAge', note: 'The Himalaya at sunrise, the same peaks, centuries on.',
        box: [{ text: 'An age passed. Ram\'s age, the Treta Yuga, ended. The Dvapara Yuga began: the age of the Mahabharata.', x: .03, y: .05, w: 560 }] },
      { art: 'draupadiLotus', ink: FACE, note: 'Draupadi in the forest, a golden thousand-petalled lotus in her hands; Bhima beside her.',
        box: [{ text: 'The five Pandava brothers lived in exile in the Himalaya with their wife Draupadi. One day the wind carried a golden lotus to her, with a wonderful scent.', x: .03, y: .04, w: 520 }],
        say: [{ text: 'Bhima, bring me more of these.', x: .24, y: .8, w: 320, tail: [.56, .62] }] },
      { art: 'bhimaSets', ink: FACE, note: 'Bhima with his mace, setting off up the mountain.',
        box: [{ text: 'BHIMA, the strongest of the brothers, and like Hanuman a son of the Wind, set off up Mount Gandhamadana to find them.', x: .42, y: .06, w: 560 }] },
    ]),
    pg([[1, [1]], [1.2, [1]]], [
      { art: 'bhimaGrove', note: 'Gandhamadana. Bhima smashing through a grove of golden plantains.',
        box: [{ text: 'He smashed through the forest, roaring, until he reached a grove of plantains many yojanas wide.', x: .03, y: .05, w: 460 }] },
      { art: 'oldMonkey', ink: FACE, note: 'An old monkey asleep across the path on a broad stone, his tail across the way; he opens his eyes a little.',
        box: [{ text: 'On a rock across the path lay an old monkey, asleep, his tail right across the way.', x: .45, y: .05, w: 520 }] },
    ]),
    // the tail (3.146.74–3.147.21)
    pg([[.85, [1, 1]], [1.1, [1]], [1.1, [1]]], [
      { art: 'bhimaRoars', ink: FACE, note: 'Bhima, standing over him, shouting.', say: [{ text: 'Get up, monkey! Give me the path!', x: .5, y: .2, w: 300, tail: [.5, .44] }], title: [{ text: 'BHIMA', x: .5, y: .93, size: 32, col: '#FFE7A6' }] },
      { art: 'oldSpeaks', ink: FACE, note: 'The old monkey, one eye open.', say: [{ text: 'I\'m old and sick. I can\'t get up. Move my tail aside yourself, and go.', x: .5, y: .22, w: 340, tail: [.5, .5] }] },
      { art: 'tailOneHand', ink: FACE, note: 'Bhima grips the old monkey\'s tail in his left hand, carelessly.',
        box: [{ text: 'Bhima took the tail in his left hand, carelessly. It didn\'t move.', x: .03, y: .05, w: 440 }] },
      { art: 'tailTwoHands', ink: FACE, note: 'Both hands; sweat, eyes rolling. It does not move.',
        box: [{ text: 'Then both hands. He strained until he sweated. He couldn\'t even lift it.', x: .03, y: .05, w: 440 }] },
    ]),
    pg([[1, [1, 1]], [1, [1]], [1.2, [1]]], [
      { art: 'bhimaBows', ink: FACE, note: 'Bhima, bowing.', say: [{ text: 'Forgive my rude words. Who are you?', x: .5, y: .2, w: 300, tail: [.5, .44] }] },
      { art: 'iAmHanuman', ink: FACE, note: 'The old monkey, smiling.', say: [{ text: 'I am Hanuman, your brother.', x: .5, y: .2, w: 300, tail: [.5, .44] }] },
      { art: 'oldTells', ink: FACE, note: 'Old Hanuman, telling.',
        say: [{ text: 'When Ram was crowned, I asked him: as long as Ram\'s story is told in the worlds, let me live. He said: so be it.', x: .64, y: .4, w: 520, tail: [.34, .46] }] },
      { art: 'singing', ink: FACE, note: 'Hanuman, eyes closed, in the plantain grove; gandharvas and apsaras singing around him.',
        say: [{ text: 'Here, they sing his deeds to me.', x: .3, y: .15, w: 380, tail: [.45, .5] }] },
    ]),
    pg(FULL, [{ art: 'lastPage', ink: FACE, note: 'The same old eyes, closed, smiling; the young sun rising red behind the Himalaya.',
      box: [{ text: 'He asked to live as long as Ram\'s story is told.', x: .08, y: .08, w: 560 }, { text: 'You just read fifty-five pages of it.', x: .4, y: .86, w: 560 }] }]),

    // ================= back matter =================
    pg(FULL, [{ art: 'paper', note: 'Plain dark page.',
      title: [{ text: 'FACTS USED', y: .05, size: 54 }],
      box: [{ list: true, x: 30, y: .09, w: 970, size: 22, text: 'Valmiki Ramayana (critical edition), kanda.sarga.verse:\n' +
        '• Ram\'s question, Agastya\'s answer: 7.35.1–18 · the birth, the leap, Vayu\'s snow: 7.35.19–29\n' +
        '• The Sun spares him; Rahu; Indra on Airavata; the vajra; the left jaw: 7.35.30–47\n' +
        '• The Wind stops; the worlds like hell; Brahma; the cave: 7.35.48–65\n' +
        '• Revived; the eight boons and the name: 7.36.1–25 · the ashrams, Kesari, Vayu and Anjana forbid him: 7.36.28–31 · the curse: 7.36.32–34 · the answer: 7.36.38–43\n' +
        '• The search parties: 4.39–42 · Sampati: Lanka, a hundred yojanas away: 4.57.19–23 · Angad asks; each leader\'s leap, Jambavan\'s 90, Angad\'s 100: 4.64.1–19 · Jambavan round Trivikrama: 4.64.15, 4.65.30 · the death-at-will boon: 4.65.1–35 · he grows: 4.66.1–7\n' +
        '• Mahendra: 5.1.10–21 · Simhika: 5.1.166–180 · Lanka: 5.3.34, 5.10.10 · Ravana\'s threat: 5.20.8–9\n' +
        '• The ring "marked with Ram\'s name": 5.34.2–4 · the jewel: 5.36.52 · the grove, her tree spared, the kinkaras, the war cry: 5.39–41 · Jambumali, the ministers\' sons, the generals: 5.42–44\n' +
        '• Prince Aksha (kumāram akṣam; Akshayakumara in later tellings): 5.45 · the crystal throne: 5.47.9 · "a messenger is never killed": 5.50 · the tail: 5.51.3–7 · Sita\'s prayer: 5.51.24–27 · the fire cold as frost: 5.51.29–30\n' +
        '• Indrajit binds him; the ropes; to Ravana: 5.46.35–52 · Lanka burns: 5.52.10–13 · his horror: 5.53.1–12 · the charanas, Sita unharmed: 5.53.18–26, 5.54.1 · Lakshman, the Herb Mountain: 6.88.31–35, 6.89.14–24\n' +
        '• The gifts, his ask, the embrace and the necklace: 7.39.14–21 · Ram\'s last words to him: 7.98.24–25 · the Sarayu: 7.100.5\n' +
        'Mahabharata (critical edition): Draupadi\'s lotus, Gandhamadana, the plantain grove 3.146.8–60; the yugas 3.148.5–37; Bhima and the old monkey 3.146.72–3.147.21; the tail, one hand then both: 3.147.17–20; "so be it" 3.147.37; they sing to him 3.147.39' }] }]),
    pg(FULL, [{ art: 'paper', note: 'Plain dark page.',
      title: [{ text: 'WHAT THE TEXTS DON\'T SAY', y: .05, size: 48 }],
      box: [{ list: true, x: 30, y: .1, w: 970, size: 24, text:
        '• He swallowed the sun: the Hanuman Chalisa. In Valmiki he leaps to seize it.\n' +
        '• The sun looked like a mango: popular retellings. Valmiki compares it to a hibiscus (japa) flower.\n' +
        '• "You\'ll remember your strength when someone reminds you": the popular form of the curse. The text says only "for a long time" (7.36.33); Jambavan\'s reminder is how it ends in the Kishkindha Kanda.\n' +
        '• A throne of his tail in Ravana\'s court, the tail growing as they ran out of cloth: later tellings.\n' +
        '• Hanuman is present wherever the Ramayana is recited: an old prayer, not traced to a source text.\n' +
        '• Hanuman spared the Ashoka grove on purpose: not in Valmiki. He wrecked the grove himself (5.39–40) and, after the fire, feared Sita had burned (5.53); only the rakshasis say her tree was spared (5.40.17–19).\n' +
        '• Dronagiri, Meghnad and Akshayakumara: names from later tellings. Valmiki says "the Herb Mountain", Indrajit and Prince Aksha.\n' +
        '• Jambavan says Indra struck him in anger (4.65.21); the Uttara says "not very angry" (7.35.46). The childhood pages follow the Uttara.' }] }]),
    pg(FULL, [{ art: 'backPage', note: 'The Season 1 line-up; Bali lit, holding out his hands to a small brahmin boy.',
      title: [{ text: 'CHIRANJEEVI', y: .12, size: 84, col: '#FFE7A6' }, { text: 'Next: BALI', y: .66, size: 64 }, { text: 'The king who gave away everything', y: .72, size: 40, font: 'Kalam' }],
      box: [{ text: 'Issue 1, ASHWATTHAMA, is out now.\nrishikatha.com\nFollow @therishikatha', x: .27, y: .8, w: 520, size: 32 }] }]),
  ]),
};
