// rp10_tl.js: the timeline of Ramayan Part 10, "Lanka Burns" (no voice: captions and retro cartoon SFX, a soft tanpura
// only under Sita's prayer). Every shot and beat in video seconds; rp10.js draws to it, tools/rp10_sfx.mjs times the
// sounds from it (loaded with vm). 69.6 s.
const TL = {
  // A the hook: Hanuman on a rooftop at night, his tail ablaze, grinning
  // B the ident
  B0: 3.4,
  // C the grove: Sita's hair jewel; "let's test Ravana!"; he smashes the grove, all but Sita's tree
  C0: 6.2, THINK: 9.0, SMASH: 12.0,
  // D the army, then Akshaya: all bonked
  D0: 15.0, SON: 17.8,
  // E Indrajit's Brahmastra; Hanuman lets it hold him (a wink)
  E0: 21.0, LET: 24.0,
  // F the court: "give Sita back!"; "kill him!"; Vibhishana: "never kill a messenger!"
  F0: 27.4, KILL: 30.8, VIBH: 33.0,
  // G the tail: "set his tail on fire!"; Sita prays to Agni; the fire feels cool
  G0: 36.2, PRAY: 39.4, COOL: 42.6,
  // H roof to roof; Lanka burns; Vibhishana's house spared
  H0: 44.4, BURN: 47.6, SPARE: 50.0,
  // I the sea: the tail dipped; "is Sita safe?!"; she is
  I0: 52.6, SAFE: 55.6,
  // J the Part 11 tease: Ram at the shore
  J0: 58.6,
  // K the follow card
  K0: 62.4, END: 69.6,
};
TL.GEM = TL.C0 + .9; TL.BULB = TL.THINK + .3; TL.ARMY = TL.D0 + .4; TL.ROPES = TL.E0 + 1.2; TL.WINK = TL.LET + .8;
TL.RET = TL.F0 + 1.4; TL.LIGHT = TL.G0 + 1.8; TL.AHH = TL.COOL + .3; TL.SLIP = TL.H0 + .3; TL.DIP = TL.I0 + .4; TL.PANIC = TL.I0 + 1.4;
TL.CARD = { head: TL.K0 + .1, title: TL.K0 + .5, pill: TL.K0 + 1.0, ask: TL.K0 + 2.6, books: TL.K0 + 3.6 };
// the captions: [first line's time, gone by, ...lines]; *gold*, ^ a huge gold line; each line pops in .35 s after the last
TL.CAPS = [
  [-1, TL.B0 - .1, "Ravana set Hanuman's", 'tail on fire…', '^BIG MISTAKE!'],
  [TL.C0 + .1, TL.THINK - .1, 'Sita gave Hanuman', 'her *HAIR JEWEL*, for Ram.'],
  [TL.THINK, TL.SMASH - .1, 'Then he thought:', '^"LET\'S TEST RAVANA!"'],
  [TL.SMASH, TL.D0 - .1, 'He smashed the whole grove…', "^EXCEPT SITA'S TREE!"],
  [TL.D0 + .1, TL.SON - .1, 'Ravana sent his *ARMY*…'],
  [TL.SON, TL.E0 - .1, '…even his son *AKSHAYA*.', '^ALL DEFEATED!'],
  [TL.E0 + .1, TL.LET - .1, 'Then *INDRAJIT* fired', 'the *BRAHMASTRA*!'],
  [TL.LET, TL.F0 - .1, 'Hanuman let it hold him…', '^TO MEET RAVANA!'],
  [TL.F0 + .1, TL.KILL - .1, "In Ravana's court,", 'Hanuman said:', '^"GIVE SITA BACK!"'],
  [TL.KILL, TL.VIBH - .1, 'Ravana roared:', '^"KILL HIM!"'],
  [TL.VIBH, TL.G0 - .1, 'But *VIBHISHANA* said:', '^"NEVER KILL A MESSENGER!"'],
  [TL.G0 + .1, TL.PRAY - .1, 'So Ravana said:', '^"SET HIS TAIL ON FIRE!"'],
  [TL.PRAY, TL.COOL - .1, 'Sita prayed to *AGNI*:', '^"BE COOL FOR HIM!"'],
  [TL.COOL, TL.H0 - .1, 'And the fire…', '^FELT COOL!'],
  [TL.H0 + .1, TL.BURN - .1, 'He slipped his ropes,', '^LEAPT ROOF TO ROOF…'],
  [TL.BURN, TL.SPARE - .1, '…and', '^LANKA BURNED!'],
  [TL.SPARE, TL.I0 - .1, 'But he spared', "*VIBHISHANA'S* house."],
  [TL.I0 + .1, TL.SAFE - .1, 'Then he panicked:', '^"IS SITA SAFE?!"'],
  [TL.SAFE, TL.J0 - .1, 'She was.', '^NOT ONE HAIR BURNED.'],
  [TL.J0 + .1, TL.K0 - .1, '*NEXT, PART 11:*', 'Ram vs', '^THE OCEAN!'],
];
