// onemoon_tl.js: the timeline of "One moon" (ad 114), from the voice (onemoon_vo.js), shared by the scene (onemoon.js)
// and the sound (tools/onemoon_sfx.mjs, which loads both files with vm).
(() => {
  for (let i = 0; i < VO.caps.length - 1; i++) { const a = VO.caps[i], b = VO.caps[i + 1]; if (b.a - a.b < 1.2) a.b = b.a - .02; }
})();
const TL = (() => {
  const LN = VO.lines, mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const norm = s => s.replace(/[*“”"'’.,:?!…]/g, '').toLowerCase();
  const Wd = (id, word, n = 0) => {
    const hits = [];
    VO.caps.filter(c => c.id === id).forEach(c => c.text.split(/\s+/).filter(w => w && w !== '|').forEach((w, i) => { if (norm(w) === norm(word)) hits.push(c.at[i]); }));
    if (hits[n] == null) throw new Error(`no "${word}" in ${id}`); return hits[n];
  };
  const T = {
    // the shots
    A2: LN.khong.a - .15,                 // the hero krathong close: Phra Mae Khongkha
    A3: LN.khong.end - .2,                // the tilt up: Yi Peng
    B0: LN.kashi.a - .55,                 // the moon → Kashi
    C0: mid('kashi', 'aruna'),            // the moon → Arunachala
    D0: mid('aruna', 'far'),              // the map: three lights
    D1: LN.coin.a - .2,                   // coincidence? → Thailand
    E0: LN.sea.a - .35,                   // the boats of Boita Bandana
    E1: Wd('boita', 'for') - .25,         // the sea route
    F0: mid('boita', 'script'),           // the script
    G0: mid('script', 'city'),            // Ayodhya → Ayutthaya
    H0: mid('city', 'song'),              // the prang: the Tamil hymns
    I0: mid('song', 'close'),             // one moon: Thailand
    I1: Wd('close', 'under') - .1,        //   Kashi
    I2: Wd('close', 'one') - .05,         //   Arunachala
    I3: Wd('close', 'one', 1) - .35,      //   the map, all lit
    J0: mid('close', 'ask'),              // the ask
    CARD: LN.ask.end + 1.3,
    // the words
    GANGA: Wd('hook', 'ganga'), MOTHER: Wd('khong', 'mother'), KASHI: Wd('kashi', 'kashi'), GODS: Wd('kashi', 'gods'), ARUNA: Wd('aruna', 'arunachala'), FIRE: Wd('aruna', 'fire'),
    KM: Wd('far', '2000'), SNIGHT: Wd('far', 'night'), SMOON: Wd('far', 'moon'),
    COIN: Wd('coin', 'coincidence'), RAMA: Wd('coin', 'rama'), HINDU: Wd('coin', 'hindu'),
    SEA: Wd('sea', 'sea'), ODISHA: Wd('boita', 'odisha'), BOATS: Wd('boita', 'boats'), BALI: Wd('boita', 'bali'), JAVA: Wd('boita', 'java'),
    SCRIPT: Wd('script', 'script'), LETTER: Wd('script', 'letter'), KA: Wd('script', 'ka'),
    CITY: Wd('city', 'city'), AYUTTHAYA: Wd('city', 'ayutthaya'), AYODHYA: Wd('city', 'ayodhya'),
    SONGS: Wd('song', 'songs'), TAMIL: Wd('song', 'tamil'), SHIVA: Wd('song', 'shiva'),
    FAMILY: Wd('close', 'family'), SAME: Wd('close', 'same'), LAMP: Wd('close', 'lamp'),
    YOU: Wd('ask', 'you'), CITY2: Wd('ask', 'city'),
  };
  T.END = T.CARD + 6.5;
  return T;
})();
