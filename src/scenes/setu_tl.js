// setu_tl.js: the timeline of "This bridge across the SEA was built in FIVE DAYS." (ad 42), from the voice (setu_vo.js),
// shared by the scene (setu.js) and the sound (tools/setu_sfx.mjs, which loads both files with vm). Re-render the voice
// and the picture and the sound move with it.
const TL = (() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const T = {
    B0: mid('hook', 'name'), C0: mid('name', 'reach'), D0: mid('reach', 'nights'), E0: mid('nights', 'bow'), F0: mid('bow', 'god'),
    G0: mid('god', 'nala'), H0: mid('nala', 'rocks'), I0: mid('rocks', 'd1'), J0: mid('d5', 'size'), K0: mid('size', 'milky'),
    L0: mid('milky', 'cross'), M0: mid('cross', 'today'), N0: mid('today', 'ask'),
    CARD: LN.ask.end + 1.4,
    // words the picture lands on
    SEA: Wd('hook', 0, 4), FIVE: Wd('hook', 0, 8), SETU: Wd('name', 0, 1), WASNT: Wd('name', 0, 5), RAM2: Wd('name', 0, 6),
    VANARAS: Wd('reach', 0, 3), LANKA: Wd('reach', 1, 0), NIGHTS: Wd('nights', 0, 2), OCEAN: Wd('nights', 0, 7), NEVER: Wd('nights', 1, 1),
    BOW: Wd('bow', 0, 4), WAVES: Wd('bow', 0, 7), MOUNTAINS: Wd('bow', 0, 10),
    GOD: Wd('god', 0, 1), CANNOT: Wd('god', 0, 5), NALA: Wd('nala', 0, 1), VISHWA: Wd('nala', 0, 4), BRIDGE: Wd('nala', 1, 3), HOLD: Wd('nala', 1, 7),
    HURLED: Wd('rocks', 0, 2), TREES: Wd('rocks', 0, 3), ROCKS: Wd('rocks', 0, 5), ELEPHANTS: Wd('rocks', 1, 3),
    D: [1, 2, 3, 4, 5].map(k => Wd('d' + k, 0, 0)), DN: [1, 2, 3, 4, 5].map(k => Wd('d' + k, 0, 2)),
    HUNDRED: Wd('size', 0, 0), TEN: Wd('size', 0, 3), GODS: Wd('milky', 0, 1), SKY: Wd('milky', 0, 5), MILKY: Wd('milky', 0, 10),
    XRAM: Wd('cross', 0, 0), HANUMAN: Wd('cross', 0, 3), LAKSHMAN: Wd('cross', 1, 0), ANGAD: Wd('cross', 1, 2),
    KM: Wd('today', 0, 2), SHOALS: Wd('today', 0, 6), INDIA: Wd('today', 1, 1), LANKA2: Wd('today', 1, 3), HINDUS: Wd('today', 2, 0), SETU2: Wd('today', 2, 3),
    RAMESWARAM: Wd('ask', 0, 4), CITY: Wd('ask', 1, 2),
  };
  T.DEND = mid('d5', 'size') - .2;
  T.END = T.CARD + 7.6;
  Object.assign(T, { CAP_T: T.CARD + .1, COVERS: T.CARD + .4, PRICE: T.CARD + 1.2, STRIKE: T.CARD + 1.7, DEAD: T.CARD + 2.2, PILL: T.CARD + 2.7, SUB: T.CARD + 3.2, FOLLOW: T.CARD + 3.7 });
  return T;
})();
// the bridge's length after each day (yojanas): 14, 20, 21, 22, 23 (Valmiki, Yuddha Kanda 22.66–70)
const DAYS = [14, 20, 21, 22, 23], CUM = DAYS.map((_, i) => DAYS.slice(0, i + 1).reduce((a, b) => a + b, 0));
