// som1_tl.js: ad 120's timeline (12 JYOTIRLINGAS Episode 1, Somnath I), built from the voice (som1_vo.js), so a new
// take moves the picture and the SFX with it. Loaded by the scene and by tools/som1_sfx.mjs.
const Wd = (id, word, n = 0) => { const hits = []; VO.caps.filter(c => c.id === id).forEach(c => c.text.split(/\s+/).filter(w => w && w !== '|').forEach((w, i) => { if (w.replace(/[*“”"'’.,:?!…]/g, '').toLowerCase() === word.toLowerCase()) hits.push(c.at[i]); })); if (hits[n] == null) throw new Error(`no ${word} in ${id}`); return hits[n]; };
const LN = VO.lines, CAPS = (id) => VO.caps.filter(c => c.id === id);
const TL = {
  STAND: LN.standing.a - .1, ID0: LN.standing.end + .15, S0: LN.daksha.a - .2,
  N27: Wd('daksha', '27'), MOON: Wd('daksha', 'moon'), ROH0: CAPS('daksha')[1].a, ROHINI: Wd('daksha', 'rohini'),
  CURSE0: LN.curse.a - .1, CURSED: Wd('curse', 'cursed'), WASTE: Wd('curse', 'waste'),
  PR0: LN.prabhas.a - .15, PRABHASA: Wd('prabhas', 'prabhasa'), CHANT: Wd('prabhas', 'chanted'), SIX: Wd('prabhas', 'six'),
  BOON0: LN.boon.a - .15, WANE: Wd('boon', 'wane'), GROW: Wd('boon', 'grow'),
  ST0: LN.stayed.a - .15, SOMNATH: Wd('stayed', 'somnath'), LORD: Wd('stayed', 'lord'),
  LK0: LN.look.a - .15, MARU: Wd('look', 'maru-gurjara'), AR0: LN.arrow.a - .1, ARROW: Wd('arrow', 'arrow'),
  RD0: LN.raiders.a - .2, YR: CAPS('years').flatMap(c => c.at), NM0: LN.names.a - .1, NAMES: Wd('names', 'names'),
  BK0: LN.back.a - .15, BACK: Wd('back', 'back'), R: CAPS('roll').map(c => c.at[0] - .05), RL1: LN.roll.end + .35,
  AH0: LN.ahilya.a - .15, AHNAME: Wd('ahilya', 'ahilyabai'), AH2: LN.ahilya2.a - .15, SON: Wd('ahilya2', 'son'), YEARS28: Wd('ahilya2', '28'),
  AH3: LN.ahilya3.a - .15, BADRI: Wd('ahilya3', 'badrinath'), RAMES: Wd('ahilya3', 'rameswaram'),
  PT0: LN.patel.a - .15, PATEL: Wd('patel', 'sardar'), REBUILD: Wd('patel', 'rebuild'), PT2: LN.patel2.a - .15, ONE: Wd('patel2', 'one'),
  GA0: LN.gandhi.a - .15, PEOPLE: Wd('gandhi', 'people'), LT0: LN.letter.a - .15, PRASAD: Wd('letter', 'rajendra'), ANYWAY: Wd('letter', 'anyway'),
  IN0: LN.install.a - .15, LINGA: Wd('install', 'linga'),
  MY0: LN.myth.a - .15, NO: Wd('myth', 'no'), MY2: LN.myth2.a - .1, GHAZNI: Wd('myth2', 'ghazni'), M3: LN.myth3.a - .1, ONE1: Wd('myth3', 'one'),
  M4: LN.myth4.a - .1, FIVE: Wd('myth4', 'five'), Y700: Wd('myth4', '700'),
  ASK: LN.ask.a - .15, JAI: Wd('ask', 'jai'), NX0: LN.next.a - .15, POLE: Wd('next', 'pole'), CARD: LN.next.end + .6,
};
TL.END = TL.CARD + 6.2;
