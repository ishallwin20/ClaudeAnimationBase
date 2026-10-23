// rp2_tl.js: the timeline of Ramayan Part 2, "The Two Boons" (no voice: captions, a Lyria score and SFX). Every shot and
// beat in video seconds; rp2.js draws to it, tools/rp2_sfx.mjs times the sounds from it (loaded with vm), and the score's
// brief (tools/rp2_score.txt) was written against it: 90 BPM, 26 bars, 69.4 s.
const TL = {
  // A the hook: Kaikeyi with a heart, then cold, pointing away
  SEND: 1.7,
  // B the ident
  B0: 3.6,
  // C the court: "Tomorrow, Ram will be crowned!"
  C0: 6.4, TOMORROW: 7.1, CROWNED: 8.2,
  // D Ayodhya lit up; Manthara at the terrace
  D0: 10.4, LIT: 10.7, MANTH: 12.6, WATCH: 13.2,
  // E–F Kaikeyi's chamber
  E0: 15.2, RAN: 15.3, OVERJOY: 17.6, GAVE: 18.4, JEWEL: 19.2, NODIFF: 20.2, THREW: 22.8, WAKE: 23.5, BANISH: 25.6, WORSE: 26.6,
  // G the war (sepia): two boons
  G0: 28.0, WAR: 28.3, SAVED: 29.2, TWO: 31.4, USE: 32.6,
  // H–K the room of anger
  H0: 34.0, TORE: 34.4, LAY: 35.6, ANGER: 36.4, FOUND: 37.5, SWORE: 39.2, RAMS: 40.0,
  FIRST: 41.1, CROWNB: 41.8, SECOND: 43.5, FOREST: 44.3, YEARS: 45.3, FELL: 47.0, BEGGED: 47.9, NIGHT: 48.5, MOVE: 49.9,
  // L dawn: "Let it be. I will go."
  L0: 51.7, HEARD: 52.3, FACE: 53.3, LETBE: 54.7, GO: 55.9,
  // M the Part 3 tease
  M0: 58.0, CURSE: 59.0, YOUTH: 60.0, TRUE: 61.3,
  // N the follow card
  K0: 62.4, END: 69.4,
};
TL.CARD = { head: TL.K0 + .1, title: TL.K0 + .5, pill: TL.K0 + 1.0, ask: TL.K0 + 2.6, books: TL.K0 + 3.6 };
// the captions: [first line's time, gone by, ...lines]; *gold*, ^ a huge gold line; each line pops in .35 s after the last
TL.CAPS = [
  [-1, TL.B0 - .1, 'Kaikeyi *LOVED* Ram.', 'So why did she', '^SEND HIM AWAY?'],
  [TL.C0 + .15, TL.D0 - .1, 'King *DASHARATHA* announced:', '*"Tomorrow, RAM*', '*will be CROWNED!"*'],
  [TL.D0 + .15, TL.MANTH - .1, '*AYODHYA* lit up', 'all night!'],
  [TL.MANTH, TL.E0 - .1, 'But one maid was *NOT* happy:', '^MANTHARA.'],
  [TL.E0 + .15, TL.OVERJOY - .1, 'She ran to Queen *KAIKEYI:*', '*"Ram will be KING!"*'],
  [TL.OVERJOY, TL.NODIFF - .1, 'Kaikeyi was *OVERJOYED!*', '"Take this jewel as a *GIFT!"*'],
  [TL.NODIFF, TL.THREW - .1, '"Ram and *BHARAT*', '*are the SAME to me!"*'],
  [TL.THREW, TL.WAKE + 1.2, '^Manthara THREW it away!'],
  [TL.WAKE + 1.3, TL.G0 - .1, '"Wake up! Ram will *BANISH*', '*your Bharat, or WORSE!"*'],
  [TL.G0 + .15, TL.TWO - .5, '"Remember the *WAR?*', 'You *SAVED* the king\'s life,'],
  [TL.TWO - .4, TL.H0 - .1, 'and he gave you *TWO BOONS.*', '^USE THEM NOW!"'],
  [TL.H0 + .15, TL.FOUND - .1, 'So Kaikeyi tore off her jewels,', 'and lay in the', '^ROOM OF ANGER.'],
  [TL.FOUND + .1, TL.FIRST - .1, 'The king found her there:', '"Anything you want!', '*I swear it, by RAM!"*'],
  [TL.FIRST, TL.SECOND - .1, '"*FIRST:*', '*crown BHARAT.*'],
  [TL.SECOND, TL.FELL - .1, '*SECOND:* send Ram', 'to the *FOREST,*', '^for 14 YEARS!"'],
  [TL.FELL, TL.MOVE - .4, '^Dasharatha FELL.', 'He begged her *ALL NIGHT…*'],
  [TL.MOVE - .3, TL.L0 - .1, 'She would', '^NOT MOVE.'],
  [TL.L0 + .15, TL.LETBE - .1, 'At dawn, *RAM* heard it.', 'His face did *NOT* change.'],
  [TL.LETBE, TL.M0 - .1, '"Let it be.', '^I WILL GO."'],
  [TL.M0 + .1, TL.K0 - .1, '*NEXT, PART 3:*', 'a *CURSE* from the king\'s youth', '^comes TRUE.'],
];
