// rp6_tl.js: the timeline of Ramayan Part 6, "The Golden Deer" (no voice: captions and retro cartoon SFX, a soft
// tanpura only under Sita alone at the end). Every shot and beat in video seconds; rp6.js draws to it, tools/rp6_sfx.mjs
// times the sounds from it (loaded with vm). 78.5 s.
const TL = {
  // A the hook: the cute golden deer, and its shadow is a demon
  SHADOW: .7,
  // B the ident
  B0: 3.6,
  // C Ravana hears what Ram did and wants revenge
  C0: 6.4, REVENGE: 7.9,
  // D he goes to Maricha, who shakes with fear
  D0: 9.8, SHOOK: 11.2,
  // E years ago (sepia): the boy Ram's arrow throws him into the ocean, a hundred yojanas
  E0: 13.3, SHOT: 14.4, YOJ: 16.7,
  // F Ravana: help me or die; Maricha: better Ram's arrow
  F0: 19.1, CHOSE: 21.7,
  // G he becomes the golden deer: silver spots, jewelled antlers
  G0: 25.1, SPOTS: 27.5,
  // H Sita: catch it for me; Lakshman: it's Maricha
  H0: 30.1, WARN: 33.3,
  // I Ram: guard Sita; he chases it; it vanishes and appears
  I0: 36.7, CHASED: 38.9,
  // J the arrow strikes; the dying demon cries in Ram's voice: Ha Sita! Ha Lakshman!
  J0: 42.3, VOICE: 44.7, HA: 47.3,
  // K Sita begs; Lakshman: no; her harsh words; he goes
  K1: 49.7, NO: 52.1, HARSH: 54.3,
  // L no line: there is no Lakshman Rekha in Valmiki
  L0: 57.5, REKHA: 59.9,
  // M Sita alone; a holy man at the door
  M0: 63.1, HOLY: 65.3,
  // N the Part 7 tease: the holy man was Ravana (his shadow has ten heads)
  N0: 67.9,
  // O the follow card
  K0: 71.5, END: 78.5,
};
TL.ARROW = TL.CHOSE + 1.6; TL.TURN = TL.G0 + .7; TL.CATCH = TL.H0 + .7; TL.GUARD = TL.I0 + .2; TL.STRUCK = TL.J0 + .6;
TL.LINE = TL.L0 + .2; TL.RAVANA7 = TL.N0 + 1.4;
TL.CARD = { head: TL.K0 + .1, title: TL.K0 + .5, pill: TL.K0 + 1.0, ask: TL.K0 + 2.6, books: TL.K0 + 3.6 };
// the captions: [first line's time, gone by, ...lines]; *gold*, ^ a huge gold line; each line pops in .35 s after the last
TL.CAPS = [
  [-1, TL.B0 - .1, 'That cute golden deer', 'was a', '^DEMON!'],
  [TL.C0 + .15, TL.D0 - .1, 'Ravana heard what Ram did,', 'and wanted', '^REVENGE!'],
  [TL.D0 + .1, TL.E0 - .1, 'He went to *MARICHA* for help.', 'But Maricha', '^SHOOK WITH FEAR!'],
  [TL.E0 + .1, TL.YOJ - .1, 'Years ago, a *BOY* named Ram', 'had shot him', '^INTO THE OCEAN!'],
  [TL.YOJ, TL.F0 - .1, 'He flew', '^100 YOJANAS!'],
  [TL.F0 + .1, TL.CHOSE - .1, 'Ravana: "Help me,', 'or *DIE* by my sword!"'],
  [TL.CHOSE, TL.G0 - .1, 'Maricha thought:', '"Better to die by', '^RAM\'S ARROW."'],
  [TL.G0 + .1, TL.SPOTS - .1, 'He turned into a', '^GOLDEN DEER!'],
  [TL.SPOTS, TL.H0 - .1, '*SILVER SPOTS!*', '*JEWELLED ANTLERS!*'],
  [TL.H0 + .1, TL.WARN - .1, 'Sita gasped:', '"Catch it for me,', '^PLEASE!"'],
  [TL.WARN, TL.I0 - .1, 'Lakshman: "No deer', 'looks like that.', '^IT\'S MARICHA!"'],
  [TL.I0 + .1, TL.CHASED - .1, 'Ram: "Guard Sita."'],
  [TL.CHASED, TL.J0 - .1, 'He chased it,', 'but it kept *VANISHING…*', '^AND APPEARING!'],
  [TL.J0 + .1, TL.VOICE - .1, 'At last,', '^HIS ARROW STRUCK!'],
  [TL.VOICE, TL.HA - .1, 'The dying demon cried', 'in *RAM\'S OWN VOICE:*'],
  [TL.HA, TL.K1 - .1, '^"HA SITA!', '^HA LAKSHMAN!"'],
  [TL.K1 + .1, TL.NO - .1, 'Sita begged:', '"*GO, HELP HIM!*"'],
  [TL.NO, TL.HARSH - .1, 'Lakshman:', '^"NO."'],
  [TL.HARSH, TL.L0 - .1, 'Then her words were', 'so *HARSH,*', 'he had to go.'],
  [TL.L0 + .1, TL.REKHA - .1, 'And no,', 'he drew *NO LINE!*'],
  [TL.REKHA, TL.M0 - .1, 'There is', '*NO LAKSHMAN REKHA*', '^IN VALMIKI!'],
  [TL.M0 + .1, TL.HOLY - .1, 'Sita was alone…'],
  [TL.HOLY, TL.N0 - .1, 'Then a *HOLY MAN*', 'came to the door…'],
  [TL.N0 + .1, TL.K0 - .1, '*NEXT, PART 7:*', 'the holy man', '^WAS RAVANA!'],
];
