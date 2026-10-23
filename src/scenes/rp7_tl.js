// rp7_tl.js: the timeline of Ramayan Part 7, "Ravana Takes Sita" (no voice: captions and retro cartoon SFX, a soft
// tanpura only under the sad scenes: the empty hut, Jatayu dying, the pyre). Every shot and beat in video seconds;
// rp7.js draws to it, tools/rp7_sfx.mjs times the sounds from it (loaded with vm). 69.2 s.
const TL = {
  // A the hook: Sita's jewels falling from the sky
  // B the ident
  B0: 3.6,
  // C Sita welcomes the holy man as a guest; he shows his true face: Ravana
  C0: 6.4, FACE: 9.0,
  // D "be my queen"; "a jackal wants a lioness?"
  D0: 12.2, ANSW: 14.6,
  // E he grabs her; the golden chariot rises; pulled by donkeys
  E0: 18.0, DONKEYS: 21.4,
  // F she cries to the trees, the river, the deer: tell Ram!
  F0: 23.8,
  // G Jatayu fights for her until Ravana cuts his wings
  G0: 27.2, CUT: 30.2,
  // H over a hill, five monkeys; she ties her jewels in her scarf and drops them
  H0: 32.8, TIED: 35.8,
  // I Ram comes home to an empty hut; he searches, calling her
  I0: 39.2, SEARCH: 41.8,
  // J dying Jatayu: "Ravana took her"
  J0: 44.6, BREATH: 46.8,
  // K Ram cremates him like his own father
  K1: 49.8,
  // L the twist: one of the five monkeys was Hanuman
  L0: 53.0, HANU: 55.6,
  // M the Part 8 tease: Ram meets Hanuman; the arrow from behind a tree
  M0: 58.2,
  // N the follow card
  K0: 62.2, END: 69.2,
};
TL.GUEST = TL.C0 + .5; TL.QUEEN = TL.D0 + .3; TL.LIONESS = TL.ANSW + 1.3; TL.GRAB = TL.E0 + .3; TL.ROSE = TL.E0 + 1.2;
TL.TREES = TL.F0 + .5; TL.RIVER = TL.F0 + 1.1; TL.DEER = TL.F0 + 1.6; TL.TELL = TL.F0 + 2.2; TL.FIVE = TL.H0 + 1.4; TL.DROPPED = TL.TIED + 1.5;
TL.TOOK = TL.BREATH + 1.1; TL.TREE = TL.M0 + 2.6;
TL.CARD = { head: TL.K0 + .1, title: TL.K0 + .5, pill: TL.K0 + 1.0, ask: TL.K0 + 2.6, books: TL.K0 + 3.6 };
// the captions: [first line's time, gone by, ...lines]; *gold*, ^ a huge gold line; each line pops in .35 s after the last
TL.CAPS = [
  [-1, TL.B0 - .1, 'Sita dropped her *JEWELS*', 'from the sky.', '^GUESS WHO', '^FOUND THEM?'],
  [TL.C0 + .15, TL.FACE - .1, 'Sita welcomed a *HOLY MAN*', 'as her guest.'],
  [TL.FACE, TL.D0 - .1, 'Then he showed', 'his true face:', '^RAVANA!'],
  [TL.D0 + .1, TL.ANSW - .1, 'Ravana: "Be my', '^QUEEN!"'],
  [TL.ANSW, TL.E0 - .1, 'Sita: "A *JACKAL*', 'wants a', '^LIONESS?"'],
  [TL.E0 + .1, TL.DONKEYS - .1, 'He grabbed her, and his', '*GOLDEN CHARIOT*', '^ROSE INTO THE SKY!'],
  [TL.DONKEYS, TL.F0 - .1, 'Pulled by…', '^DONKEYS!'],
  [TL.F0 + .1, TL.G0 - .1, 'Sita cried to the trees,', 'the river, the deer:', '^"TELL RAM!"'],
  [TL.G0 + .1, TL.CUT - .1, 'Old *JATAYU*, the eagle king,', '^FOUGHT FOR HER!'],
  [TL.CUT, TL.H0 - .1, 'Until Ravana', '^CUT HIS WINGS.'],
  [TL.H0 + .1, TL.TIED - .1, 'Over a hill,', 'Sita saw', '^FIVE MONKEYS.'],
  [TL.TIED, TL.I0 - .1, 'She tied her jewels', 'in her scarf…', '^AND DROPPED THEM!'],
  [TL.I0 + .1, TL.SEARCH - .1, 'Ram came home', 'to an *EMPTY HUT.*'],
  [TL.SEARCH, TL.J0 - .1, 'He searched everywhere,', '^CALLING HER NAME.'],
  [TL.J0 + .1, TL.BREATH - .1, 'He found Jatayu, *DYING.*'],
  [TL.BREATH, TL.K1 - .1, 'With his last breath:', '^"RAVANA TOOK HER."'],
  [TL.K1 + .1, TL.L0 - .1, 'Ram cremated him', 'like his own', '^FATHER.'],
  [TL.L0 + .1, TL.HANU - .1, 'And those five monkeys', 'on the hill?'],
  [TL.HANU, TL.M0 - .1, 'One of them was', '^HANUMAN!'],
  [TL.M0 + .1, TL.K0 - .1, '*NEXT, PART 8:*', 'Ram meets Hanuman,', 'and the arrow from', '^BEHIND A TREE!'],
];
