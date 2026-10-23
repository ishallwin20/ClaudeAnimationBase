// rp3_tl.js: the timeline of Ramayan Part 3, "The King's Curse" (no voice: captions and SFX, a soft tanpura under the
// three sad scenes). Every shot and beat in video seconds; rp3.js draws to it, tools/rp3_sfx.mjs times the sounds from
// it (loaded with vm). 68.6 s.
const TL = {
  // A the hook: the young prince draws in the dark and looses; red light on "him"
  KILLED: 1.4, HIM: 2.6,
  // B the ident
  B0: 3.7,
  // C Ram leaves; the city weeps; the old king runs after the chariot and falls
  C0: 6.5, WEPT: 9.3, RAN: 9.8,
  // D days later: the charioteer comes back alone
  D0: 13.6, ALONE: 15.6,
  // E that night he tells Kausalya
  E0: 17.1, SECRET: 18.7,
  // F the flashback at the Sarayu: listening, the sound, the elephant, the shot, the boy
  F0: 20.7, SKILL: 21.5, BYSOUND: 22.4, F1: 23.3, SOUND: 24.4, ELEPH: 26.2, SHOT: 28.5, BOY: 29.0,
  ASCETIC: 31.1, BLIND: 33.0, TAKE: 34.5, DIED: 36.7,
  // G the blind parents: "son, why so quiet?"; the truth; the curse
  G0: 38.9, QUIET: 40.0, TRUTH: 41.7, CURSED: 44.1, GRIEV: 46.0,
  // H the twist: no son at all
  H0: 48.1, NOSON: 49.0,
  // I crying for Ram, he dies that night (the lamp goes out, then silence)
  I0: 51.7, CRYING: 52.2, VERY: 54.0,
  // J the Part 4 tease: the crow and the blade of grass
  J0: 56.2, CROW: 57.6, GRASS: 60.0,
  // K the follow card
  K0: 61.6, END: 68.6,
};
TL.CARD = { head: TL.K0 + .1, title: TL.K0 + .5, pill: TL.K0 + 1.0, ask: TL.K0 + 2.6, books: TL.K0 + 3.6 };
// the captions: [first line's time, gone by, ...lines]; *gold*, ^ a huge gold line; each line pops in .35 s after the last
TL.CAPS = [
  [-1, TL.B0 - .1, 'Young *DASHARATHA* killed', 'a boy by mistake.', '^Years later, it killed HIM.'],
  [TL.C0 + .15, TL.WEPT - .1, 'Ram left for the *FOREST*', 'with *SITA* and *LAKSHMAN.*'],
  [TL.WEPT, TL.D0 - .1, 'All Ayodhya *WEPT.*', 'The old king ran', '^AFTER THE CHARIOT!'],
  [TL.D0 + .15, TL.E0 - .1, 'Days later,', 'the charioteer came back…', '^ALONE.'],
  [TL.E0 + .15, TL.F0 - .1, 'That night, the king', 'told Queen *KAUSALYA*', '*a SECRET…*'],
  [TL.F0 + .15, TL.F1 + .1, 'As a prince, he could hit', 'a target *BY SOUND ALONE.*'],
  [TL.F1 + .2, TL.ELEPH - .1, 'One rainy night by the *SARAYU,*', 'he heard a sound…'],
  [TL.ELEPH, TL.SHOT - .1, 'He thought:', '*"An ELEPHANT, drinking!"*'],
  [TL.SHOT, TL.ASCETIC - .1, '^He SHOT.', 'And a *BOY* cried out!'],
  [TL.ASCETIC, TL.TAKE - .1, 'A young *ASCETIC,*', 'filling a pot for his', '^BLIND PARENTS.'],
  [TL.TAKE, TL.DIED - .1, '"Take them', '*this WATER…"*'],
  [TL.DIED, TL.G0 - .1, 'And he', '^DIED.'],
  [TL.G0 + .15, TL.TRUTH - .1, 'His blind parents asked:', '*"Son, why so QUIET?"*'],
  [TL.TRUTH, TL.CURSED - .1, 'The prince had to tell them', '^THE TRUTH.'],
  [TL.CURSED, TL.H0 - .1, 'The father cursed him:', '"You too will die', '^GRIEVING FOR YOUR SON!"'],
  [TL.H0 + .15, TL.I0 - .1, 'But back then,', 'Dasharatha had', '^NO SON AT ALL!'],
  [TL.I0 + .15, TL.J0 - .1, 'Now, crying for *RAM,*', 'the king died', '^THAT VERY NIGHT.'],
  [TL.J0 + .15, TL.GRASS - 1, '*NEXT, PART 4:*', 'a crow attacks *SITA…*'],
  [TL.GRASS - .9, TL.K0 - .1, 'and Ram picks up', '^A BLADE OF GRASS.'],
];
