// rp8_tl.js: the timeline of Ramayan Part 8, "The Arrow from Behind a Tree" (no voice: captions and retro cartoon SFX,
// a soft tanpura only under the anklets and Vali's last words). Every shot and beat in video seconds; rp8.js draws to
// it, tools/rp8_sfx.mjs times the sounds from it (loaded with vm). 67.2 s.
const TL = {
  // A the hook: Ram behind a tree, bow drawn; was it fair?
  // B the ident
  B0: 3.6,
  // C lake Pampa: Hanuman comes as a monk; Ram amazed by his speech
  C0: 6.4, AMAZED: 9.8,
  // D Sugriva shows the jewels; Lakshman knows only the anklets
  D0: 13.0, EARR: 16.4, ANK: 19.0,
  // E Vali threw Sugriva out and took his wife
  E0: 22.6,
  // F the first fight: too alike to shoot; the garland; they fight again
  F0: 26.0, ALIKE: 28.2, GARL: 31.2,
  // G from behind a tree, Ram's arrow strikes Vali
  G0: 34.6,
  // H "is that dharma?"; Ram's answer; Vali accepts and entrusts Angad
  H0: 37.8, TOOK: 41.4, BHARAT: 44.2, ACCEPT: 47.8,
  // I the ask: was it fair? yes or no
  I0: 51.2, YESNO: 53.4,
  // J the Part 9 tease: Hanuman on the sea cliff
  J0: 56.4,
  // K the follow card
  K0: 60.2, END: 67.2,
};
TL.FAIR0 = 1.2; TL.HANU = TL.C0 + 1.6; TL.JEWELS = TL.D0 + 1.4; TL.BOWED = TL.ANK + 1.6; TL.THROWN = TL.E0 + 1.0; TL.WIFE = TL.E0 + 2.0;
TL.BEATEN = TL.ALIKE + 1.5; TL.STRUCK = TL.G0 + 2.0; TL.DHARMA = TL.H0 + 1.4; TL.ANGAD = TL.ACCEPT + 1.4; TL.LEAPS = TL.J0 + 1.2;
TL.CARD = { head: TL.K0 + .1, title: TL.K0 + .5, pill: TL.K0 + 1.0, ask: TL.K0 + 2.6, books: TL.K0 + 3.6 };
// the captions: [first line's time, gone by, ...lines]; *gold*, ^ a huge gold line; each line pops in .35 s after the last
TL.CAPS = [
  [-1, TL.B0 - .1, 'Ram shot *VALI*', 'from behind a tree.', '^WAS IT FAIR?'],
  [TL.C0 + .15, TL.AMAZED - .1, 'By lake *PAMPA*,', '*HANUMAN* came to Ram,', 'dressed as a monk.'],
  [TL.AMAZED, TL.D0 - .1, 'Ram was amazed:', 'not one mistake', '^IN HIS SPEECH!'],
  [TL.D0 + .1, TL.EARR - .1, "Hanuman's king *SUGRIVA*", 'showed Ram the jewels', 'Sita had dropped.'],
  [TL.EARR, TL.ANK - .1, 'Lakshman: "I don\'t know', 'her earrings…"'],
  [TL.ANK, TL.E0 - .1, '"But these *ANKLETS*, I know.', 'I bowed at her feet', '^EVERY DAY."'],
  [TL.E0 + .1, TL.F0 - .1, "Sugriva's brother *VALI*", 'threw him out,', '^AND TOOK HIS WIFE.'],
  [TL.F0 + .1, TL.ALIKE - .1, 'Sugriva challenged *VALI*.'],
  [TL.ALIKE, TL.GARL - .1, 'But they looked so alike,', '^RAM COULDN\'T SHOOT!'],
  [TL.GARL, TL.G0 - .1, 'So Sugriva wore', 'a *GARLAND OF FLOWERS*…', '^AND FOUGHT AGAIN!'],
  [TL.G0 + .1, TL.H0 - .1, 'From behind a tree,', "Ram's arrow", '^STRUCK VALI!'],
  [TL.H0 + .1, TL.TOOK - .1, 'Dying, Vali asked:', '"You hid and shot me.', '^IS THAT DHARMA?"'],
  [TL.TOOK, TL.BHARAT - .1, 'Ram: "You took', 'your brother\'s *WIFE.*'],
  [TL.BHARAT, TL.ACCEPT - .1, 'This land is *BHARAT\'S*,', 'and I punish wrong', '^IN HIS NAME."'],
  [TL.ACCEPT, TL.I0 - .1, 'Vali accepted,', 'and asked Ram to protect', 'his son *ANGAD.*'],
  [TL.I0 + .1, TL.YESNO - .1, 'So, was it', '^FAIR?'],
  [TL.YESNO, TL.J0 - .1, 'Comment', '^YES OR NO!'],
  [TL.J0 + .1, TL.K0 - .1, '*NEXT, PART 9:*', 'Hanuman', '^LEAPS THE OCEAN!'],
];
