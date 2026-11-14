// CHIRANJEEVI Issue 1 · ASHWATTHAMA: the pages, their panels and their words (the script: SCRIPT.md beside this file).
// Units: a page is 1080 × 1350; a panel's r = [x, y, w, h] on the page; words are placed in PANEL units:
//   box: [{ text, x, y, w }]                  a caption box, its top-left at (x, y), w wide
//   say: [{ text, x, y, w, tail, kind }]      a balloon centred at (x, y), the text w wide; tail [x, y] points at the
//                                            speaker; kind 'speech' (default) | 'thought' | 'whisper' | 'sky'
//   sfx: [{ text, x, y, size, rot, col }]     a sound effect
// The art for each panel is ART[art] in src/scenes/ashwatthama_comic.js. lang.hi (later) holds the Hindi words.
const COMIC = {
  slug: 'ashwatthama', title: 'Ashwatthama', series: 'CHIRANJEEVI', issue: 1, lang: 'en',
  pages: {
    11: { panels: [
      { r: [24, 24, 1032, 560], art: 'banyanWide',
        box: [{ text: 'The 18th night of Kurukshetra. Only three men of the Kaurava army are still alive.', x: 24, y: 22, w: 430 }] },
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
  },
};
