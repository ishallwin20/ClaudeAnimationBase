// rp12_tl.js: the timeline of Ramayan Part 12, "The Last Arrow", the series finale (no voice: captions and retro
// cartoon SFX, a soft tanpura under the hymn and the homecoming). Every shot and beat in video seconds; rp12.js draws to
// it, tools/rp12_sfx.mjs times the sounds from it (loaded with vm). 60.0 s.
const TL = {
  // A the hook: Ram's arrow cuts off a head; it grows back
  GROWS: 1.6,
  // B the ident
  B0: 3.6,
  // C the battle: Ravana in his chariot, Ram on foot; Indra sends his chariot with Matali
  C0: 6.4, INDRA: 9.2,
  // D the sage Agastya teaches Ram the Aditya Hridayam; three times; new strength
  D0: 12.8, THRICE: 16.4,
  // E the heads grow back, again and again
  E0: 19.6, HUNDRED: 23.0,
  // F Matali: "use the Brahmastra!"
  F0: 26.0,
  // G the Brahmastra: it strikes Ravana's heart; Ravana falls; the arrow comes back to the quiver
  G0: 29.0, HEART: 31.0, FELL: 33.6, BACK: 36.0,
  // H the gods shower flowers; the army cheers
  H0: 38.6,
  // I home to Ayodhya on the Pushpaka; Ram is crowned
  I0: 41.6, KING: 45.0,
  // J the end: "Jai Shri Ram"
  J0: 48.6,
  // K the finale card: missed a part? start from Part 1
  K0: 52.0, END: 60.0,
};
TL.CUT = .9; TL.MATALI = TL.INDRA + .6; TL.AGASTYA = TL.D0 + .4; TL.STRONG = TL.THRICE + 1.4; TL.CUTS = [TL.E0 + .6, TL.E0 + 1.7, TL.E0 + 2.6, TL.E0 + 3.4, TL.E0 + 4.0, TL.E0 + 4.5, TL.E0 + 4.9, TL.E0 + 5.3];
TL.LOOSE = TL.HEART - .5; TL.CROWN = TL.KING + .5;
TL.CARD = { head: TL.K0 + .1, title: TL.K0 + .5, pill: TL.K0 + 1.0, ask: TL.K0 + 2.6, books: TL.K0 + 3.6 };
// the captions: [first line's time, gone by, ...lines]; *gold*, ^ a huge gold line; each line pops in .35 s after the last
TL.CAPS = [
  [-1, TL.B0 - .1, "Ram cut off Ravana's head…", '^IT GREW BACK!'],
  [TL.C0 + .1, TL.INDRA - .1, 'Ravana fought from a chariot.', 'Ram, on foot.'],
  [TL.INDRA, TL.D0 - .1, 'So Indra sent his own chariot,', 'driven by *MATALI*!'],
  [TL.D0 + .1, TL.THRICE - .1, 'The sage *AGASTYA* taught Ram', 'a hymn to the Sun:', '^ADITYA HRIDAYAM.'],
  [TL.THRICE, TL.E0 - .1, 'Ram chanted it 3 times…', '^AND FELT NEW STRENGTH!'],
  [TL.E0 + .1, TL.HUNDRED - .1, "Ram cut off Ravana's heads…", 'but they kept', '^GROWING BACK!'],
  [TL.HUNDRED, TL.F0 - .1, 'Again and again…', '^A HUNDRED TIMES!'],
  [TL.F0 + .1, TL.G0 - .1, 'Then Matali said:', '^"USE THE BRAHMASTRA!"'],
  [TL.G0 + .1, TL.HEART - .1, 'Ram chanted,', 'and let it fly…'],
  [TL.HEART, TL.FELL - .1, "It struck Ravana's", '^HEART.'],
  [TL.FELL, TL.BACK - .1, 'And Ravana', '^FELL.'],
  [TL.BACK, TL.H0 - .1, 'The arrow flew back', "into Ram's quiver."],
  [TL.H0 + .1, TL.I0 - .1, 'The gods showered', '^FLOWERS!'],
  [TL.I0 + .1, TL.KING - .1, 'Ram, Sita and Lakshman', 'flew home to *AYODHYA*…'],
  [TL.KING, TL.J0 - .1, '…and Ram', '^BECAME KING.'],
  [TL.J0 + .1, TL.K0 - .1, 'THE END.', '^JAI SHRI RAM!'],
];
