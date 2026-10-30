// pushpak_tl.js: the timeline of "The whole Ramayan in one flight" (ad 64), from the voice (pushpak_vo.js), shared by the
// scene (pushpak.js) and the sound (tools/pushpak_sfx.mjs, which loads both with vm).
const TL = (() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const T = {
    // the shots: each starts between two lines
    B0: mid('hook', 'setup'), C0: mid('setup', 'hurry'), D0: mid('hurry', 'lanka'), E0: mid('lanka', 'setu'), F0: mid('setu', 'mainaka'),
    G0: mid('mainaka', 'kish'), H0: mid('rains', 'pampa'), I0: mid('pampa', 'jatayu'), J0: mid('jatayu', 'panch'), K0: mid('panch', 'ashram'),
    L0: mid('years', 'chitra'), M0: mid('chitra', 'rivers'), N0: mid('rivers', 'ayodhya'), O0: mid('ayodhya', 'land'), P0: mid('land', 'hanuman'),
    Q0: mid('hanuman', 'close'), R0: mid('close', 'ask'),
    CARD: LN.ask.end + 1.3,
    // the words things land on
    PUSHPAK: Wd('setup', 0, 8), SITA: Wd('setup', 1, 2), VALMIKI: Wd('setup', 1, 6),
    HURRY: Wd('hurry', 0, 4), BHARATA: Wd('hurry', 0, 5), YEARS14: Wd('hurry', 1, 3), FIRE: Wd('hurry', 1, 10),
    LANKA: Wd('lanka', 0, 2), RAVANA1: Wd('lanka', 0, 4),
    BRIDGE: Wd('setu', 0, 1), DAYS5: Wd('setu', 0, 4),
    MAINAKA: Wd('mainaka', 0, 1), HANUMAN1: Wd('mainaka', 0, 9),
    KISH: Wd('kish', 0, 0), VALI: Wd('kish', 0, 4), MONTHS4: Wd('rains', 0, 3),
    RISHYA: Wd('pampa', 0, 0), SUGRIVA: Wd('pampa', 0, 4), PAMPA: Wd('pampa', 1, 0), WEPT: Wd('pampa', 1, 3), SHABARI: Wd('pampa', 1, 8),
    JATAYU: Wd('jatayu', 0, 1), FELL: Wd('jatayu', 0, 6),
    PANCH: Wd('panch', 0, 0), KHARA: Wd('panch', 0, 3), HUT: Wd('panch', 1, 3), RAVANA2: Wd('panch', 1, 4),
    AGASTYA: Wd('ashram', 0, 3), ATRI: Wd('ashram', 0, 5), ANASUYA: Wd('ashram', 0, 7), YEARS10: Wd('years', 0, 2),
    CHITRA: Wd('chitra', 0, 0), BHARATA2: Wd('chitra', 0, 2), SANDALS: Wd('chitra', 1, 3),
    YAMUNA: Wd('rivers', 0, 1), GANGA: Wd('rivers', 0, 3), GUHA: Wd('rivers', 0, 4),
    THERE: Wd('ayodhya', 0, 1), AYODHYA: Wd('ayodhya', 0, 2), BOW: Wd('ayodhya', 0, 3),
    YEAR14: Wd('land', 0, 1), PANCHAMI: Wd('land', 1, 1), LANDED: Wd('land', 1, 3), BHARADVAJA: Wd('land', 1, 5),
    HANUMAN2: Wd('hanuman', 0, 3), RACING: Wd('hanuman', 0, 4), HOME: Wd('hanuman', 0, 10),
    LANKA2: Wd('close', 0, 0), AYODHYA2: Wd('close', 0, 2), ONE: Wd('close', 0, 7),
    YOU: Wd('ask', 0, 6), NUMBER: Wd('ask', 0, 10),
  };
  T.END = T.CARD + 7;
  return T;
})();
