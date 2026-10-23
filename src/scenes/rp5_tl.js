// rp5_tl.js: the timeline of Ramayan Part 5, "One Man, 14,000 Demons" (no voice: captions and retro cartoon SFX, a soft
// tanpura only under the hug). Every shot and beat in video seconds; rp5.js draws to it, tools/rp5_sfx.mjs times the
// sounds from it (loaded with vm). 69.7 s.
const TL = {
  // A the hook: Ram, bow drawn, against the horde
  ALONE0: 1.6,
  // B the ident
  B0: 3.6,
  // C Panchavati: Surpanakha walks in and falls for Ram; "I'm married, try my brother"; sent back; she lunges; the sword
  C0: 6.4, WALKIN: 8.2, MARRIED: 10.0, SENT: 13.3, LUNGED: 15.6, CUT: 17.8,
  // D Khara: she runs screaming to him; he sends fourteen; Ram's arrows finish them
  D0: 20.4, FOURTEEN: 23.0, FINISHED: 25.4,
  // E Khara comes with 14,000; Sita and Lakshman into the cave; Ram faces them alone
  E0: 27.7, CAVE: 31.1, FACED: 33.5,
  // F the battle: arrows like rain, the counter; Dushana, Trishira, Khara fall; 72 minutes; 3 a second
  F0: 35.8, DUSH: 38.3, TRISH: 40.3, LASTK: 42.3, MUH: 44.7, MIN72: 47.3, SEC3: 49.7,
  // G Sita runs out and hugs him
  G0: 53.0,
  // H one demon escapes to Ravana
  H0: 55.8,
  // I the Part 6 tease: the golden deer
  I0: 59.2,
  // K the follow card
  K0: 62.7, END: 69.7,
};
TL.BROTHER = TL.MARRIED + .85; TL.KHARA = TL.D0 + .6; TL.ARMY = TL.E0 + .85; TL.RAIN = TL.F0 + .5; TL.HUGGED = TL.G0 + 1.4;
TL.ESCAPED = TL.H0 + .5; TL.RAVANA = TL.H0 + .85; TL.DEER = TL.I0 + .85;
TL.CARD = { head: TL.K0 + .1, title: TL.K0 + .5, pill: TL.K0 + 1.0, ask: TL.K0 + 2.6, books: TL.K0 + 3.6 };
// the captions: [first line's time, gone by, ...lines]; *gold*, ^ a huge gold line; each line pops in .35 s after the last
TL.CAPS = [
  [-1, TL.B0 - .1, 'Ram fought', '*14,000 DEMONS…*', '^ALONE!'],
  [TL.C0 + .15, TL.MARRIED - .1, 'In *PANCHAVATI,*', 'the demoness *SURPANAKHA*', '^FELL FOR RAM!'],
  [TL.MARRIED, TL.SENT - .1, 'Ram said:', '"I\'m *MARRIED.*', 'Try my brother!"'],
  [TL.SENT, TL.LUNGED - .1, 'Lakshman sent her', '^RIGHT BACK!'],
  [TL.LUNGED, TL.CUT - .1, 'Furious, she', '^LUNGED AT SITA!'],
  [TL.CUT, TL.D0 - .1, 'Lakshman cut off', 'her *NOSE AND EARS!*'],
  [TL.D0 + .15, TL.FOURTEEN - .1, 'She ran screaming', 'to her brother *KHARA.*'],
  [TL.FOURTEEN, TL.FINISHED - .1, 'He sent *14 DEMONS*', 'to kill Ram…'],
  [TL.FINISHED, TL.E0 - .1, "Ram's arrows", '^FINISHED THEM!'],
  [TL.E0 + .15, TL.CAVE - .1, 'Then Khara came himself,', 'with', '^14,000!'],
  [TL.CAVE, TL.FACED - .1, 'Ram sent Sita and Lakshman', 'into a *CAVE…*'],
  [TL.FACED, TL.F0 - .1, 'and faced them', '^ALONE.'],
  [TL.F0 + .15, TL.DUSH - .1, 'His arrows fell', '^LIKE RAIN!'],
  [TL.DUSH, TL.TRISH - .1, '*DUSHANA* fell.'],
  [TL.TRISH, TL.LASTK - .1, '*TRISHIRA* fell.'],
  [TL.LASTK, TL.MUH - .1, 'And at last…', '^KHARA!'],
  [TL.MUH, TL.MIN72 - .1, 'Valmiki says it took', 'one and a half *MUHURTAS:*'],
  [TL.MIN72, TL.SEC3 - .1, 'about', '^72 MINUTES!'],
  [TL.SEC3, TL.G0 - .1, "That's over", '*3 DEMONS*', '^EVERY SECOND!'],
  [TL.G0 + .15, TL.H0 - .1, 'Sita ran out of the cave', '^AND HUGGED HIM.'],
  [TL.H0 + .15, TL.I0 - .1, 'But one demon *ESCAPED…*', 'and ran to', '^RAVANA!'],
  [TL.I0 + .15, TL.K0 - .1, '*NEXT, PART 6:*', "Ravana's trap…", '^A GOLDEN DEER!'],
];
