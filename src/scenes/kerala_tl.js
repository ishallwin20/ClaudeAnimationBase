// kerala_tl.js: the timeline of "Kerala was pulled out of the SEA" (ad 62), from the voice (kerala_vo.js, written by
// tools/sarvam_tts.mjs from tools/kerala_vo.json), shared by the scene (kerala.js) and the sound (tools/kerala_sfx.mjs,
// which loads both with vm). Shots cut halfway between two lines; the throw lands on the word THREW.
const TL = (() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const T = {
    A0: 0, B0: mid('hook', 'won'), C0: mid('won', 'kashyapa'), D0: mid('kashyapa', 'mbh'), E0: mid('mbh', 'legend'), F0: mid('legend', 'varuna'),
    THROW: Wd('throw', 0, 2), H0: mid('throw', 'flight'), KANYA: Wd('kanya', 0, 3), I0: mid('kanya', 'name'), J0: mid('name', 'sci'),
    RISE0: LN.sea.a, K0: mid('sea', 'back'), KUTT: LN.kuttanad.a, L0: mid('kuttanad', 'same'), M0: mid('same', 'piravi'), ASK: LN.ask.a,
    CARD: LN.ask.end + 1.6,
  };
  T.SWEEP0 = T.H0; T.SWEEP1 = T.KANYA + .5;
  T.END = T.CARD + 6.8;
  Object.assign(T, { CAP_T: T.CARD + .35, COVERS: T.CARD + .7, PRICE: T.CARD + 1.25, PILL: T.CARD + 1.65, FOLLOW: T.CARD + 1.95 });
  return T;
})();
