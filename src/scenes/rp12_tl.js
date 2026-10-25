// rp12_tl.js: the timeline of Ramayan Part 12, "The Last Arrow", the series finale (no voice: captions and retro
// cartoon SFX, a soft tanpura under the hymn and the homecoming). Every shot and beat in video seconds; rp12.js draws to
// it, tools/rp12_sfx.mjs times the sounds from it (loaded with vm). 67.0 s.
const TL = {
  // A the hook: Ram's arrow cuts off a head; it grows back
  GROWS: 1.6,
  // B the ident
  B0: 3.6,
  // C the battle, each in its own frame: Ravana's chariot rolls in; Ram on foot; Indra's chariot comes down with Matali
  C0: 6.4, FOOT: 8.5, INDRA: 10.6,
  // D the sage Agastya teaches Ram the Aditya Hridayam; three times; new strength
  D0: 14.0, THRICE: 17.6,
  // E the heads grow back (Ravana alone, the arrows from off frame), then a quickening cut between the two: a hundred times
  E0: 20.8, HUNDRED: 24.2,
  // F Matali, in Indra's chariot with Ram: "use the Brahmastra!"
  F0: 27.2,
  // G the Brahmastra: G0 Ram charges it in close-up; LOOSE it flies; FLY across the sky; RV Ravana sees it coming (his
  // faces change slowly); HEART the strike; TOPPLE the zoom out and the fall from his chariot (FELL he hits the ground);
  // BACK the arrow home to Ram's quiver
  G0: 30.2, LOOSE: 33.2, FLY: 33.9, RV: 35.5, HEART: 38.7, TOPPLE: 40.0, FELL: 41.5, BACK: 43.0,
  // H the gods shower flowers; the army cheers
  H0: 45.6,
  // I home to Ayodhya on the Pushpaka; Ram is crowned
  I0: 48.6, KING: 52.0,
  // J the end: "Jai Shri Ram"
  J0: 55.6,
  // K the finale card: missed a part? start from Part 1
  K0: 59.0, END: 67.0,
};
TL.CUT = .9; TL.MATALI = TL.INDRA + 1.6; TL.AGASTYA = TL.D0 + .4; TL.STRONG = TL.THRICE + 1.4; TL.CUTS = [TL.E0 + .6, TL.E0 + 1.5, TL.E0 + 2.2, TL.E0 + 2.8];
// E's quickening intercut after HUNDRED: [from (s after HUNDRED), 'ram' | 'rv']; Ram panting holds the last .7 s
TL.MIX = [[0, 'rv'], [.55, 'ram'], [1.0, 'rv'], [1.4, 'ram'], [1.7, 'rv'], [1.95, 'ram'], [2.15, 'rv'], [2.3, 'ram']];
TL.CHANT = TL.G0 + .4; TL.DRAW = TL.G0 + 1.9; TL.HUSH = TL.HEART - .3;
TL.CROWN = TL.KING + .5;
TL.CARD = { head: TL.K0 + .1, title: TL.K0 + .5, pill: TL.K0 + 1.0, ask: TL.K0 + 2.6, books: TL.K0 + 3.6 };
// the captions: [first line's time, gone by, ...lines]; *gold*, ^ a huge gold line; each line pops in .35 s after the last
TL.CAPS = [
  [-1, TL.B0 - .1, "Ram cut off Ravana's head…", '^IT GREW BACK!'],
  [TL.C0, TL.FOOT - .1, 'Ravana fought', 'from a *CHARIOT*…'],
  [TL.FOOT, TL.INDRA - .1, '…and Ram,', '^ON FOOT.'],
  [TL.INDRA + .1, TL.D0 - .1, 'So Indra sent his own chariot,', 'driven by *MATALI*!'],
  [TL.D0 + .1, TL.THRICE - .1, 'The sage *AGASTYA* taught Ram', 'a hymn to the Sun:', '^ADITYA HRIDAYAM.'],
  [TL.THRICE, TL.E0 - .1, 'Ram chanted it 3 times…', '^AND FELT NEW STRENGTH!'],
  [TL.E0 + .1, TL.HUNDRED - .1, "Ram cut off Ravana's heads…", 'but they kept', '^GROWING BACK!'],
  [TL.HUNDRED, TL.F0 - .1, 'Again and again…', '^A HUNDRED TIMES!'],
  [TL.F0 + .1, TL.G0 - .1, 'Then Matali said:', '^"USE THE BRAHMASTRA!"'],
  [TL.G0 + .1, TL.LOOSE + .5, 'Ram chanted the mantras', 'and drew the *BRAHMASTRA*…'],
  [TL.FLY, TL.RV + 1.6, 'It flew,', '^BLAZING LIKE THE SUN!'],
  [TL.HEART, TL.FELL - .1, "It struck Ravana's", '^HEART.'],
  [TL.FELL, TL.BACK + .5, 'And Ravana', '^FELL.'],
  [TL.BACK + .6, TL.H0, 'The arrow flew back', "into Ram's quiver."],
  [TL.H0 + .1, TL.I0 - .1, 'The gods showered', '^FLOWERS!'],
  [TL.I0 + .1, TL.KING - .1, 'Ram, Sita and Lakshman', 'flew home to *AYODHYA*…'],
  [TL.KING, TL.J0 - .1, '…and Ram', '^BECAME KING.'],
  [TL.J0 + .1, TL.K0 - .1, 'THE END.', '^JAI SHRI RAM!'],
];
