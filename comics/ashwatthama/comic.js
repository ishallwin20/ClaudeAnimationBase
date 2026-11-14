// CHIRANJEEVI Issue 1 · ASHWATTHAMA: the pages, their panels and their words (the script, with every verse: SCRIPT.md
// beside this file). A page is 1080 × 1350; a panel's r = [x, y, w, h] on the page. Words sit in PANEL units, and a
// number in (0, 1] is a fraction of the panel (x of its width, y of its height):
//   box:   [{ text, x, y, w, small, list, size }]      a caption box, its top-left at (x, y), at most w wide
//   say:   [{ text, x, y, w, tail, kind, size }]       a balloon centred at (x, y); tail [x, y] points at the speaker;
//                                                     kind 'speech' (default) | 'thought' | 'whisper' | 'sky'
//   sfx:   [{ text, x, y, size, rot, col }]            a sound effect
//   title: [{ text, x, y, size, col, font }]           display lettering (Marcellus; font 'Kalam' for a subtitle)
// art names ART[art] in src/scenes/ashwatthama_comic.js; a panel without art yet is drawn grey with its note.
// rows(spec): panel rects for a page from [[height weight, [column weights]], ...], margins 24, gutters 16.
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
const pg = (spec, panels, o = {}) => { const R = rows(spec); return { ...o, panels: panels.map((p, i) => ({ r: R[i], ...p })) }; };
const FULL = [[1, [1]]];

const COMIC = {
  slug: 'ashwatthama', title: 'Ashwatthama', series: 'CHIRANJEEVI', issue: 1, lang: 'en',
  pages: {
    // ---------- cover and cold open ----------
    1: pg(FULL, [{ art: 'cover', note: 'Ashwatthama from the chest up, head bowed, eyes up at us; the gem the only bright thing. Behind him the banyan full of crows, the owl\'s two eyes in it.',
      title: [{ text: 'CHIRANJEEVI · 1', y: .07, size: 40 }, { text: 'ASHWATTHAMA', y: .8, size: 116, col: '#FFE7A6' }, { text: 'The night he didn\'t sleep', y: .875, size: 46, font: 'Kalam' }] }]),
    2: pg(FULL, [{ art: 'coldWalk', note: 'A forest at night, any century. A cloaked figure walks away from us between the trees, alone.',
      box: [{ text: 'There is a prayer Hindus have recited for centuries. It names eight people who never die.', w: 520 },
        { text: 'अश्वत्थामा बलिर्व्यासो हनूमांश्च विभीषणः ।\nकृपः परशुरामश्च सप्तैते चिरजीविनः ॥', y: .7, w: 760 },
        { text: 'The first name in it is his.', x: .55, y: .86, w: 420 }] }]),
    3: pg(FULL, [{ art: 'coldTurn', note: 'Splash. The figure turns his head: a cloth wound round his forehead, one eye.',
      box: [{ text: 'This is how it began.', w: 380 }], title: [{ text: 'ASHWATTHAMA', y: .86, size: 110, col: '#FFE7A6' }] }]),

    // ---------- Act 1: who he was ----------
    4: pg([[1.1, [1]], [1, [1, 1]]], [
      { art: 'birthHut', note: 'Dawn at Drona\'s ashram hut. Kripi holds a newborn; Drona beside her.',
        box: [{ text: 'Long before the war: the ashram of Drona, a teacher of archery, and his wife Kripi.', w: 520 }] },
      { art: 'babyCry', note: 'Close: the baby\'s mouth wide open.', sfx: [{ text: 'HIIIEEEHH!', x: .5, y: .45, size: 70, rot: -.14 }] },
      { art: 'skyVoice', note: 'Drona looks up; light falls from the sky.',
        say: [{ text: 'He neighs like a horse, and the sound has reached every direction. Let him be called Ashwatthama.', x: .5, y: .42, w: 380, kind: 'sky', size: 28 }],
        box: [{ text: 'Ashwa means horse.', x: 20, y: .84, w: 300, small: true }] },
    ]),
    5: pg([[1.2, [1]], [.9, [1, 1, 1]], [.45, [1]]], [
      { art: 'gemBaby', note: 'Close on the baby\'s forehead: a small blue gem, part of him.', box: [{ text: 'He was born with a gem on his forehead.', w: 460 }] },
      { art: 'gemWeapon', note: 'Symbol: arrows snapping against a blue light.', box: [{ text: 'No weapon.', x: 16, y: .8, w: 300 }] },
      { art: 'gemHunger', note: 'Symbol: an empty bowl, a dry field, and the blue light.', box: [{ text: 'No hunger.', x: 16, y: .8, w: 300 }] },
      { art: 'gemDisease', note: 'Symbol: a fever\'s red haze held off by the light.', box: [{ text: 'No disease.', x: 16, y: .8, w: 300 }] },
      { art: 'gemStrip', note: 'Black strip, the gem glowing.', box: [{ text: '"Whoever wears it fears no weapon, no disease, no hunger. Not even gods, demons or nagas," he would say one day.', x: 24, y: 18, w: 900 }] },
    ]),
    6: pg([[1.3, [1]], [1, [1]]], [
      { art: 'dronaTeach', note: 'Drona teaching archery to the young Kuru princes; the boy Ashwatthama at his side.',
        box: [{ text: 'His father Drona became the teacher of every Kuru prince, the Pandavas and the Kauravas alike.', w: 520 }] },
      { art: 'warRanks', note: 'Years later: Drona and his grown son in armour, in the Kaurava ranks at Kurukshetra.',
        box: [{ text: 'When the great war came, father and son fought for the Kauravas.', w: 480 }] },
    ]),
    7: pg([[1, [1]], [1, [1, 1]], [.9, [1]]], [
      { art: 'dronaRage', note: 'Day 15. Drona\'s chariot cutting through the Pandava army.', box: [{ text: 'Day 15 of the war. No one could stop Drona.', w: 460 }] },
      { art: 'krishnaPlan', note: 'Krishna speaking to the Pandavas.',
        say: [{ text: 'Put dharma aside and win. If Ashwatthama falls, Drona won\'t fight. Let someone tell him so.', x: .5, y: .38, w: 380, tail: [.4, .95] }] },
      { art: 'arjunaNo', note: 'Arjuna turning away.', box: [{ text: 'Arjuna refused. The others agreed. Yudhishthira, only just.', x: 16, y: .62, w: 380 }] },
      { art: 'elephant', note: 'Bhima\'s mace coming down; an elephant falls. Dust.',
        box: [{ text: 'Bhima killed an elephant from his own army. Its name was Ashwatthama.', w: 560 }], sfx: [{ text: 'THOOM', x: .78, y: .55, size: 80, rot: .1 }] },
    ]),
    8: pg([[.95, [1]], [1, [1, 1]], [1, [1]]], [
      { art: 'bhimaShout', note: 'Bhima shouting across the field, not meeting anyone\'s eye.',
        box: [{ text: 'Ashamed, he shouted it at Drona.', w: 400 }], say: [{ text: 'ASHWATTHAMA IS DEAD!', x: .62, y: .55, w: 560, size: 50, tail: [.25, .9] }] },
      { art: 'dronaAsks', note: 'Drona, shaken, turns to Yudhishthira: the one man who never lies.', say: [{ text: 'Yudhishthira. Is my son dead?', x: .5, y: .3, w: 340, tail: [.45, .8] }] },
      { art: 'yudhiLies', note: 'Yudhishthira, eyes down.',
        say: [{ text: 'Ashwatthama is dead.', x: .45, y: .25, w: 320, tail: [.5, .75] }, { text: '…the elephant.', x: .7, y: .62, w: 220, kind: 'whisper', size: 24, tail: [.55, .8] }] },
      { art: 'chariotTouches', note: 'Close on Yudhishthira\'s chariot wheels touching the earth, dust rising.',
        box: [{ text: 'His chariot had always run four fingers above the ground. Now its wheels touched the earth.', w: 620 }] },
    ]),
    9: pg([[1, [1, 1]], [1.25, [1]]], [
      { art: 'dronaDown', note: 'Drona lays down his bow on the chariot floor.', box: [{ text: 'Drona put down his weapons.', w: 380 }] },
      { art: 'arjunaShout', note: 'Arjuna, far off, shouting, hand out.', say: [{ text: 'Bring him alive! Don\'t kill him!', x: .5, y: .35, w: 360, tail: [.5, .85] }] },
      { art: 'dronaDeath', note: 'Dhrishtadyumna on Drona\'s chariot, sword raised against the sky. Cut before the stroke. Far across the field, a small figure: Ashwatthama.',
        box: [{ text: 'Dhrishtadyumna cut off his head.', w: 440 }, { text: 'His son was across the field. He never forgot that name.', x: .5, y: .8, w: 460 }] },
    ]),
    10: pg([[1, [1]], [1, [1, 1]], [.6, [1]]], [
      { art: 'lakeDusk', note: 'Dusk by a lake. Duryodhana on the ground, thighs broken, his mace beside him.',
        box: [{ text: 'Day 18. The war is lost. Duryodhana lies by a lake, his thighs broken by Bhima.', w: 560 }] },
      { art: 'ashVow', note: 'Ashwatthama kneeling by him, fist clenched.',
        say: [{ text: 'Tonight I will send every Panchala to Yama, with Krishna watching. Give me your leave.', x: .5, y: .34, w: 380, tail: [.5, .85] }] },
      { art: 'anoint', note: 'Kripa pours water from a pot over Ashwatthama\'s head; Duryodhana watching from the ground.',
        say: [{ text: 'Kripa, bring water. Make Drona\'s son my commander.', x: .5, y: .26, w: 340, tail: [.2, .9] }],
        box: [{ text: 'Commander of an army that no longer existed.', x: 16, y: .78, w: 380, small: true }] },
      { art: 'riders', note: 'Three silhouettes riding into the dark forest.',
        box: [{ text: 'Three men were left: Ashwatthama, his uncle Kripa, and Kritavarma. They fled into a forest.', w: 760 }] },
    ]),

    // ---------- Act 2: the last night (11–14: the drawn style test) ----------
    11: { panels: [
      { r: [24, 24, 1032, 560], art: 'banyanWide',
        box: [{ text: 'Night. Deep in the forest, the three lay down under a great banyan.', x: 24, y: 22, w: 430 }] },
      { r: [24, 600, 1032, 330], art: 'sleepers',
        box: [{ text: 'Kripa and Kritavarma, who had always slept on costly beds, fell asleep on the bare ground.', x: 24, y: 20, w: 470 }] },
      { r: [24, 946, 1032, 380], art: 'eyesStrip', ink: { edge0: .14, edge1: .3 },
        box: [{ text: "Drona's son could not sleep.", x: 24, y: 22, w: 330 }, { text: 'He lay hissing like a snake, burning with rage.', x: 560, y: 262, w: 450 }] },
    ] },
    12: { panels: [
      { r: [24, 24, 640, 1302], art: 'crowsTree',
        box: [{ text: 'Above him, in the banyan, thousands of crows slept, each on its own perch.', x: 24, y: 22, w: 330 }] },
      { r: [680, 24, 376, 643], art: 'lookUp', ink: { edge0: .14, edge1: .3 } },
      { r: [680, 683, 376, 643], art: 'owlEyes',
        box: [{ text: 'Then he saw it coming.', x: 24, y: 560, w: 300 }] },
    ] },
    13: { panels: [
      { r: [24, 24, 1032, 880], art: 'owlDive',
        box: [{ text: 'A huge owl, terrible to look at, as fast as Garuda.', x: 24, y: 22, w: 360 }],
        sfx: [{ text: 'hoo…', x: 860, y: 120, size: 44, rot: -.12, col: '#E9D9A8' }] },
      { r: [24, 920, 508, 406], art: 'talons' },
      { r: [548, 920, 508, 406], art: 'feathers',
        box: [{ text: 'It tore off wings. It cut off heads. It broke legs. It killed every crow it could see.', x: 20, y: 20, w: 300 }] },
    ] },
    14: { panels: [
      { r: [24, 24, 1032, 300], art: 'eyeReflect', ink: { edge0: .14, edge1: .3 } },
      { r: [24, 340, 1032, 620], art: 'faceFierce', ink: { edge0: .14, edge1: .3 },
        say: [{ text: 'This bird has just taught me how to fight.', x: 790, y: 150, w: 330, tail: [520, 250], kind: 'thought' }] },
      { r: [24, 976, 1032, 350], art: 'owlPerch',
        say: [{ text: 'In a fair fight, the Pandavas will kill me. But asleep, at night…', x: 260, y: 150, w: 380, tail: [330, -30], kind: 'thought' }],
        box: [{ text: 'Mahabharata, Sauptika Parva 10.1.34–52', x: 24, y: 296, w: 460, small: true }] },
    ] },
    15: pg([[1, [1, 1]], [1, [1]], [.8, [1]]], [
      { art: 'wakeThem', note: 'He shakes Kripa and Kritavarma awake under the banyan.', box: [{ text: 'He woke them and told them his plan. They were too ashamed to answer.', w: 440 }] },
      { art: 'kripaAdvice', note: 'Kripa, old and gentle, sitting up.', say: [{ text: 'Let us go to Dhritarashtra, Gandhari and Vidura, and ask them what to do.', x: .5, y: .36, w: 380, tail: [.4, .9] }] },
      { art: 'ashRefuse', note: 'Ashwatthama close, eyes wet with rage, the gem bright.',
        say: [{ text: 'My father had laid down his weapons when Dhrishtadyumna killed him. How can I sleep?', x: .7, y: .4, w: 440, tail: [.35, .55] }] },
      { art: 'kripaWarn', note: 'Kripa\'s hand on his arm; he is already turning away.',
        say: [{ text: 'Killing men in their sleep is never honoured in this world.', x: .3, y: .36, w: 420, tail: [.15, .9] }],
        box: [{ text: 'He went anyway. They followed him.', x: .62, y: .62, w: 360 }] },
    ]),
    16: pg(FULL, [{ art: 'gateBeing', note: 'Splash: at the camp gate stands a being bright as sun and moon, in a tiger skin dripping blood, a black antelope skin, a great snake for a sacred thread, many arms raised with weapons, a mouth of flames, a thousand eyes; out of the flames pour countless Krishnas with conch, discus and mace. Ashwatthama small before it.',
      box: [{ text: 'At the gate of the Pandava camp, something stood guard.', w: 460 },
        { text: 'A tiger skin dripping blood. A great snake for a sacred thread. A thousand eyes. And out of its flames came hundreds, thousands of Krishnas.', x: .44, y: .8, w: 560 }] }]),
    17: pg([[1, [1, 1]], [1, [1, 1]]], [
      { art: 'arrowsEaten', note: 'His arrows vanish into the being\'s open mouth.', box: [{ text: 'It swallowed his arrows.', w: 320 }] },
      { art: 'spearBreaks', note: 'His spear shatters against it like a meteor striking the sun.', box: [{ text: 'His spear shattered.', w: 320 }] },
      { art: 'swordGone', note: 'His sword dissolving into it like a tuft of cotton.', box: [{ text: 'His sword melted into it like cotton.', w: 360 }] },
      { art: 'skyKrishnas', note: 'Empty hands. The whole sky crowded with Krishnas.',
        box: [{ text: 'Then the sky filled with Krishnas, and his hands were empty.', w: 400 }], say: [{ text: 'I didn\'t listen to Kripa.', x: .6, y: .72, w: 300, kind: 'thought', tail: [.3, .95] }] },
    ]),
    18: pg([[1, [1]], [1.25, [1]]], [
      { art: 'praise', note: 'He kneels, hands joined, eyes shut.', box: [{ text: 'He knelt and called on Shiva, name after name: Ugra, Sthanu, Rudra, Sharva, Ishana, Girisha…', w: 560 }] },
      { art: 'intoFire', note: 'A golden fire altar; strange beings crowding in the dark; he climbs into the flames, arms up.',
        say: [{ text: 'I offer myself to you. Accept me, if I cannot beat them.', x: .7, y: .3, w: 400, tail: [.45, .55] }] },
    ]),
    19: pg([[1.15, [1]], [1, [1, 1]]], [
      { art: 'shivaAppears', note: 'Shiva appears in the fire, half smiling.',
        say: [{ text: 'Krishna has worshipped me with truth, purity and devotion. No one is dearer to me. For him, I protected the Panchalas.', x: .7, y: .38, w: 440, tail: [.45, .5] }] },
      { art: 'shivaTime', note: 'Close on Shiva\'s eyes.', say: [{ text: 'But time has overtaken them. Tonight their lives are over.', x: .5, y: .3, w: 360, tail: [.5, .8] }] },
      { art: 'swordGiven', note: 'Shiva hands him a shining sword and enters his body. He blazes.',
        box: [{ text: 'Shiva gave him a sword and entered his body. Unseen beings ran with him into the camp.', w: 420 }] },
    ]),
    20: pg([[1, [1]], [1, [1, 1]]], [
      { art: 'noGate', note: 'He slips into the sleeping camp at a place with no gate.', box: [{ text: 'He went in where there was no gate, and walked softly to one tent.', w: 480 }] },
      { art: 'dhrSleep', note: 'Dhrishtadyumna asleep on white silk, flowers and incense.', box: [{ text: 'Dhrishtadyumna, asleep on white silk.', w: 360 }] },
      { art: 'kickWake', note: 'A foot nudges him. His eyes open: he knows who it is.', box: [{ text: 'He woke him with his foot.', w: 340 }] },
    ]),
    21: pg([[1, [1]], [1, [1]], [.55, [1]]], [
      { art: 'dhrPinned', note: 'Dhrishtadyumna pinned by the hair, gasping.',
        say: [{ text: 'Son of my teacher, kill me with a weapon. Don\'t delay. Let me go to the worlds of the brave.', x: .66, y: .4, w: 460, tail: [.3, .6] }] },
      { art: 'ashAnswer', note: 'Ashwatthama above him, lit from below, the gem blazing.',
        say: [{ text: 'There are no worlds for men who kill their teacher. You don\'t deserve a weapon.', x: .34, y: .4, w: 460, tail: [.7, .55] }] },
      { art: 'black', note: 'Black panel.' },
    ]),
    22: pg([[1, [1, 1]], [1.2, [1]]], [
      { art: 'women', note: 'Women of the tent in terror.', say: [{ text: 'Is it a rakshasa or a man? We don\'t know!', x: .5, y: .3, w: 330, tail: [.4, .8] }] },
      { art: 'guardsFall', note: 'Warriors rushing in, falling to a burst of light.', box: [{ text: 'The warriors who rushed at him fell to the weapon of Rudra.', w: 380 }] },
      { art: 'campWide', note: 'Wide: the camp in silhouette, tents; one figure moving through it.', box: [{ text: 'He moved through the camp like Death sent by Time.', w: 460 }] },
    ]),
    23: pg([[1.1, [1]], [1, [1, 1]]], [
      { art: 'fiveBows', note: 'Draupadi\'s five sons, roused from sleep, bows drawn at one figure.', box: [{ text: 'Draupadi\'s five sons woke and fought him.', w: 420 }] },
      { art: 'droppedBows', note: 'Five bows on the ground.' },
      { art: 'shikhandi', note: 'A sword stroke in silhouette.', box: [{ text: 'Shikhandi fell too.', w: 300 }] },
    ]),
    24: pg([[1, [1, 1]], [1.15, [1]]], [
      { art: 'gateKill', note: 'At the gate, Kripa and Kritavarma strike at the men running out.', box: [{ text: 'At the gate, Kripa and Kritavarma let no one out alive.', w: 380 }] },
      { art: 'fireThree', note: 'Fire set to the camp in three places.', box: [{ text: 'They set the camp on fire in three places.', w: 380 }] },
      { art: 'firelight', note: 'In the firelight, his silhouette with the sword.', box: [{ text: 'By the light of the fire, he went on.', w: 380 }, { text: 'By dawn, the camp was silent.', x: .55, y: .82, w: 420 }] },
    ]),
    25: pg([[1, [1]], [1, [1, 1]]], [
      { art: 'dawnLake', note: 'Dawn by the lake. The three kneel by the dying Duryodhana.',
        say: [{ text: 'The Pandavas have no sons now. Their camp is gone. I killed Dhrishtadyumna like an animal.', x: .62, y: .32, w: 480, tail: [.3, .8] }] },
      { art: 'duryoSmile', note: 'Duryodhana, almost smiling.', say: [{ text: 'Not Bhishma, not Karna, not your father did for me what you did tonight.', x: .5, y: .32, w: 380, tail: [.5, .85] }] },
      { art: 'duryoDies', note: 'His head falls back.', say: [{ text: 'Farewell. We will meet in heaven.', x: .5, y: .28, w: 320, tail: [.5, .8] }],
        box: [{ text: 'Then the king of the Kurus died.', x: 16, y: .8, w: 380, small: true }] },
    ]),
    26: pg([[1.1, [1]], [1, [1, 1]]], [
      { art: 'draupadiGrief', note: 'Morning. Draupadi among the dead of the camp.', box: [{ text: 'In one night, Draupadi had lost her five sons.', w: 440 }] },
      { art: 'draupadiFast', note: 'Draupadi to Yudhishthira, sitting down on the ground.', say: [{ text: 'If he is not punished, I will sit here and fast until I die.', x: .5, y: .3, w: 360, tail: [.5, .85] }] },
      { art: 'draupadiGem', note: 'Draupadi, eyes hard.', say: [{ text: 'He was born with a gem on his head. Bring it to me.', x: .5, y: .3, w: 340, tail: [.5, .85] }] },
    ]),
    27: pg([[1, [1]], [1, [1]]], [
      { art: 'bhimaGoes', note: 'Bhima\'s chariot racing out alone.', box: [{ text: 'Bhima set out alone to kill him.', w: 380 }] },
      { art: 'krishnaFollows', note: 'Krishna\'s chariot with Arjuna and Yudhishthira, Garuda on the flag.',
        say: [{ text: 'Bhima has gone alone. And Drona\'s son knows the Brahmashira: a weapon that could burn the earth.', x: .62, y: .35, w: 480, tail: [.3, .75] }] },
    ]),

    // ---------- Act 3: the weapon and the curse ----------
    28: pg([[.85, [1]], [1, [1, 1]], [.85, [1]]], [
      { art: 'krishnaTells', note: 'Krishna on the racing chariot, remembering.', say: [{ text: 'He once came to me in Dwaraka and offered me that weapon for my discus.', x: .62, y: .4, w: 480, tail: [.25, .7] }] },
      { art: 'liftLeft', note: 'Flashback, warm light: young Ashwatthama gripping the Sudarshana with his left hand.', box: [{ text: 'He took hold of it with his left hand,', w: 330 }] },
      { art: 'liftAll', note: 'Both hands, straining. It doesn\'t move.', box: [{ text: 'then his right, then with all his strength. It would not move.', w: 330 }] },
      { art: 'krishnaRash', note: 'Back on the chariot. Krishna\'s face.', say: [{ text: 'He asked for the one thing no one had ever asked me for.', x: .62, y: .4, w: 460, tail: [.25, .7] }] },
    ]),
    29: pg([[1, [1, 1]], [1, [1, 1]], [.85, [1]]], [
      { art: 'gangaBank', note: 'The bank of the Ganga: Vyasa among rishis. Beside them, Ashwatthama in a cloth of kusha grass, smeared with ghee, his hair full of dust.',
        box: [{ text: 'They found him by the Ganga, sitting near Vyasa: in a cloth of kusha grass, his hair full of dust.', w: 440, size: 27 }] },
      { art: 'bhimaStop', note: 'Bhima, bow drawn, arrow on the string.', say: [{ text: 'Stop! Stop!', x: .5, y: .3, w: 260, size: 44, tail: [.5, .8] }] },
      { art: 'grass', note: 'His left hand closing on a blade of grass.', box: [{ text: 'He picked up a blade of grass.', w: 340 }] },
      { art: 'apandavaya', note: 'Close on his mouth, shouting.', say: [{ text: 'APANDAVAYA! For a world without Pandavas!', x: .5, y: .4, w: 380, size: 38, tail: [.5, .9] }] },
      { art: 'grassFire', note: 'The grass bursts into fire.', box: [{ text: 'A fire was born in the grass, as if to burn the three worlds.', w: 560 }] },
    ]),
    30: pg([[1, [1]], [1, [1, 1]]], [
      { art: 'krishnaNow', note: 'Krishna turns to Arjuna.', say: [{ text: 'Arjuna, now. The weapon Drona taught you.', x: .62, y: .4, w: 420, tail: [.3, .7] }] },
      { art: 'arjunaPeace', note: 'Arjuna steps down from the chariot and bows.', say: [{ text: 'Peace to my teacher\'s son. Peace to me. Peace to my brothers.', x: .5, y: .3, w: 360, tail: [.5, .85] }] },
      { art: 'arjunaRelease', note: 'Arjuna releases his arrow.', say: [{ text: 'Let this weapon quiet that weapon.', x: .5, y: .3, w: 340, tail: [.5, .85] }] },
    ]),
    31: pg(FULL, [{ art: 'twoFires', note: 'Splash: two spheres of fire facing each other across the river; meteors falling; the earth shaking with its mountains and trees.',
      sfx: [{ text: 'KRRRAAAKK', x: .5, y: .12, size: 96, rot: -.05 }] }]),
    32: pg([[1.2, [1]], [1, [1]]], [
      { art: 'sagesBetween', note: 'Narada and Vyasa standing between the two fires, blazing like fires themselves.',
        box: [{ text: 'Then two sages appeared and stood between the weapons: Narada, and Vyasa.', w: 520 }] },
      { art: 'sagesSpeak', note: 'The two sages, calm, facing both warriors.',
        say: [{ text: 'The great warriors who died here knew such weapons. Not one of them ever used it on human beings. What have you done?', x: .5, y: .45, w: 640, tail: [.5, .95] }] },
    ]),
    33: pg([[1, [1]], [1, [1, 1]]], [
      { art: 'arjunaWithdraws', note: 'Arjuna\'s fire folding back into his arrow.', box: [{ text: 'Arjuna called his weapon back. Only a man who had kept his vows could do that.', w: 560 }] },
      { art: 'ashStrains', note: 'Ashwatthama straining; his fire does not return.' },
      { art: 'ashCant', note: 'Ashwatthama to Vyasa, desperate.', say: [{ text: 'I can\'t take it back. I let it go to destroy the Pandavas.', x: .5, y: .3, w: 340, tail: [.5, .85] }] },
    ]),
    34: pg([[1, [1, 1]], [1, [1, 1]]], [
      { art: 'vyasaGem', note: 'Vyasa, stern.', say: [{ text: 'Give them the gem on your head, and they will give you your life.', x: .5, y: .3, w: 340, tail: [.5, .85] }] },
      { art: 'ashGemHand', note: 'His hand on the gem.', say: [{ text: 'This gem is worth more than all the wealth of the Kurus and the Pandavas.', x: .5, y: .3, w: 340, tail: [.5, .85] }] },
      { art: 'ashTurns', note: 'He holds out the gem in one hand; the burning grass in the other.', say: [{ text: 'Here is the gem. Here am I. But the grass will fall on the wombs of the Pandava women.', x: .5, y: .32, w: 360, tail: [.5, .85] }] },
      { art: 'fireTurns', note: 'The fire swerves away from the men, downward.', box: [{ text: 'And he sent it into the unborn.', w: 340 }] },
    ]),
    35: pg([[1, [1]], [1, [1]]], [
      { art: 'krishnaProphecy', note: 'Krishna, calm, almost cheerful.',
        say: [{ text: 'A brahmin once told Uttara: when the Kurus are all but gone, a son will be born to you. He will be Parikshit.', x: .62, y: .42, w: 520, tail: [.25, .75] }] },
      { art: 'ashDefy', note: 'Ashwatthama, furious.', say: [{ text: 'It won\'t happen, Keshava. My weapon will fall on the child you want to save.', x: .38, y: .42, w: 520, tail: [.75, .75] }] },
    ]),
    36: pg([[1, [1]], [1, [1, 1]]], [
      { art: 'krishnaCalm', note: 'Krishna, close.', say: [{ text: 'Your weapon will fall. The child will be born dead. And he will live, a long life.', x: .62, y: .4, w: 480, tail: [.25, .7] }] },
      { art: 'curse1', note: 'Krishna\'s eyes, hard.', say: [{ text: 'Every wise man knows you now: a coward, a killer of children.', x: .5, y: .3, w: 360, tail: [.5, .85] }] },
      { art: 'curse2', note: 'Ashwatthama hearing it.', say: [{ text: 'For three thousand years you will wander this earth, and no one will talk to you.', x: .5, y: .3, w: 360, tail: [.3, -.05] }] },
    ]),
    37: pg(FULL, [{ art: 'curseSplash', note: 'Splash: Ashwatthama alone in a dark, empty land, the gem still on his forehead but dimming; Krishna\'s words over him.',
      say: [{ text: 'You will have no place among people. You will smell of pus and blood. You will live in the wild, carrying every disease.', x: .5, y: .18, w: 640, size: 36 }] }]),
    38: pg([[1, [1, 1]], [1, [1]], [.42, [1]]], [
      { art: 'givesGem', note: 'He gives the gem to the Pandavas.', box: [{ text: 'He gave the Pandavas his gem.', w: 340 }] },
      { art: 'walksAway', note: 'He walks into the forest as they watch.', box: [{ text: 'And walked into the forest as they watched.', w: 360 }] },
      { art: 'draupadiGemGiven', note: 'Bhima gives Draupadi the gem.', say: [{ text: 'This gem is yours. The killer of your sons is beaten. Get up.', x: .62, y: .35, w: 440, tail: [.3, .75] }] },
      { art: 'gemStripEnd', note: 'Black strip; the gem in Draupadi\'s hand.', box: [{ text: 'The gem that kept weapons, hunger and disease away from him stayed behind. He took the diseases with him.', x: 24, y: 18, w: 900 }] },
    ]),

    // ---------- close ----------
    39: pg(FULL, [{ art: 'coldWalkEnd', note: 'The cold open\'s forest again. The figure walks on, smaller.',
      box: [{ text: 'Three thousand years, said Krishna.', w: 420 }, { text: 'The prayer says he never dies.', x: .3, y: .36, w: 420 }, { text: 'Some people say they have met him.', x: .5, y: .6, w: 440 },
        { text: 'Next: HANUMAN. The one who chose to stay.', x: .38, y: .9, w: 560, small: true }] }]),
    40: pg(FULL, [{ art: 'paper', note: 'Plain dark page.',
      title: [{ text: 'FACTS USED', y: .055, size: 54 }],
      box: [{ list: true, x: 30, y: .1, w: 970, text: 'Every scene is from the Mahabharata (critical edition), book.chapter.verse:\n' +
        '• Neighs at birth, named by a voice from the sky: Adi 1.121.12–14\n• The elephant, "Ashwatthama is dead", the chariot touches the ground: Drona 7.164.68–109\n' +
        '• Drona killed, Arjuna shouts "bring him alive": Drona 7.165.46–52\n• Made commander: Shalya 9.64.35–40\n• The banyan, the owl and the crows: Sauptika 10.1.30–55\n' +
        '• Kripa\'s counsel: 10.2.31, 10.5.9   • "How can I sleep?": 10.5.17–26\n• The being at the gate: 10.6.3–18   • Shiva enters him: 10.7.2–66\n' +
        '• Dhrishtadyumna: 10.8.10–21   • The camp: 10.8.29–104\n• Duryodhana\'s last words: 10.9.50–55   • Draupadi and the gem: 10.11.14–20\n' +
        '• The discus in Dwaraka: 10.12.2–23   • The blade of grass: 10.13.13–20\n• Arjuna, Narada and Vyasa: 10.14.1–16, 10.15.1–17\n• The gem, the unborn, the curse: 10.15.27–33, 10.16.1–26' },
        { list: true, x: 30, y: .66, w: 970, text: 'What the texts don\'t say\n' +
        '• The Mahabharata gives the curse as 3,000 years (10.16.10). "He never dies" is from the Chiranjeevi prayer, a later verse.\n' +
        '• It describes no bleeding wound on his forehead. It says he would smell of pus and blood and carry every disease (10.16.12).\n' +
        '• Sightings, at Asirgarh fort, by the Narmada and elsewhere, are local legends, not scripture.\n' +
        '• Some retellings say he cut the gem out; the epic says he gave it (10.16.19).' }] }]),
    41: pg(FULL, [{ art: 'backPage', note: 'The Season 1 line-up: eight silhouettes, the next (Hanuman) lit. RK logo.',
      title: [{ text: 'CHIRANJEEVI', y: .12, size: 84, col: '#FFE7A6' }, { text: 'Season 1: the eight who never died', y: .19, size: 40, font: 'Kalam' }, { text: 'Next: HANUMAN', y: .7, size: 64 }],
      box: [{ text: 'Get the Season Pass at rishikatha.com\nFollow @therishikatha', x: .27, y: .8, w: 520, size: 34 }] }]),
  },
};
