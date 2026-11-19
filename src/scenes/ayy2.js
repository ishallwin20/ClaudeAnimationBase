// ayy2.js: "A 12-year-old went for TIGER'S MILK. He came back RIDING A TIGER." (ad 103, Ayyappa series Part 2, Painted,
// Bangers captions, retro SFX, no voice). Read on 19 Nov 2026 (STORYBOARD.md has the facts with chapter numbers):
//   Bhoothanathopakhyanam (Malayalam kilippattu, 1929), ch. 4 the hunt by the Pampa, the crying baby, the old brahmin
//   (Vishnu): "take him; in twelve years you will know"; ch. 5 the queen's own son Rajarajan, the crowning planned at
//   twelve, the minister's three plots (sorcery: Shiva as a sannyasi heals him; poison: Garuda's amrit; the queen talked
//   into a feigned headache, his vaidya: tigress's milk), the promise, "you have become Ram, I Dasharatha", the bundle
//   and the three-eyed coconut, "bring us tiger cubs" "I will"; ch. 6 Indra as the tiger, the devis as tigresses, the
//   devas as cubs, the town flees, the queen well since the day he left, the king: "who are you?"
//   (Janmabhumi's prose serial, 2014)
// Props and the extra cast are in ayy2_props.js; the kit is src/ayyappa_series.js (+ hanuman_series.js).
// Times are video time (t); tools/ayy2_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/ayy2_sfx.mjs)
  const RING = 1.6, PURR = 2.7;
  const B0 = 5.0, CRY = 7.4, C0 = 10.0, PART = 10.5, BRAH = 12.0, BGONE = 14.7;
  const D0 = 15.4, SON = 18.2, E0 = 20.4, HATE = 22.9, F0 = 25.2, HEAL = 27.3, G0 = 30.0, GAR = 31.6;
  const H0 = 34.6, NOD = 37.4, I0 = 39.0, VAID = 40.6, MILK = 41.6, J0 = 44.4, PROM = 46.0, LETGO = 47.7;
  const K0 = 49.4, FLOP = 50.3, L0 = 54.4, M0 = 59.0, WILL = 61.4, N0 = 63.8, TIGIN = 65.2;
  const O0 = 69.0, INDRA = 69.6, BACK = 71.2, CROWNS = 72.2, P0 = 74.6, WELL = 76.4, Q0 = 79.0, KNEEL = 80.2, R0 = 84.4, CARD = 89.4;
  const CARDC = hsCardTimes(CARD);

  const GOLDC = '#F5C542';
  const popk = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const talk = (t, a, b, rest = 'smile', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const hop = (g, a = .3, f = 8, d = 1.6) => g > 0 ? -a * Math.abs(Math.sin(g * f)) * Math.exp(-g * d) : 0;
  const hearts = (x, y, t, t0, key, n = 3, s = 22) => { if (t < t0) return; boilSeed(key); for (let i = 0; i < n; i++) { const a = t - t0 - i * .22; if (a < 0 || a > 1.6) continue; const px = x + (i - 1) * s * 2.1 + Math.sin(a * 5 + i) * s * .6, py = y - a * s * 7, r = s * backOut(clamp(a * 4)) * (1 - clamp((a - 1.1) / .5)); paint(heartPts(px, py, r), { wash: '#F2557A', ink: HSK.ink, sw: .8 }); } };
  const bellSw = (t, ts) => { let a = Math.sin(T * 2.6) * .1; for (const t0 of ts) if (t > t0) a += .6 * Math.exp(-(t - t0) * 3) * Math.sin((t - t0) * 16); return a; };
  const ting = (x, y, t, t0, key, s = 60) => { if (t > t0 && t < t0 + .8) sparkleBurst(x, y, s, (t - t0), key, 8, ['#FFFFFF', GOLDC]); };
  const HALLW = [A2.wall, A2.laterite], FORW = [A2.leaf, A2.sky], ROOMW = [A2.night, '#6E4A7A'], STW = [A2.street, '#BFE0EA'], PEACH = [HSK.marigold, HSK.petal];

  // ---- the cast's fixed options
  const AY = { boilKey: 'ayy', seed: 7 };
  const KG = { boilKey: 'kng', seed: 51 };
  const QN = { boilKey: 'qun', seed: 53 };
  const MN = { boilKey: 'min', seed: 57 };
  const BELLHAND = { handR: [.75, -5.7], bendR: -1, handShapeR: 'point' };
  // the tiger he rides (Indra, ch. 6): Chandraghanta's tigress rig in side view, a little bigger
  const TU = 30;
  const tigerRide = (x, y, u, t, o = {}, ao = {}) => {
    const to = { kind: 'tiger', boilKey: o.boilKey || 'tgr', eyes: 'happy', mouth: 'smile', ...o };
    lionRun(x, y, u, { ...to, rider: () => {
      const [sx, sy] = lionRunSeat(x, y, u, to);
      ayyappa(sx + (to.flip ? 8 : -8) * u / 15, sy + u * 1.6, u * .66, { ...AY, pose: 'sit', noShadow: true, eyes: 'happy', mouth: 'smile', blush: .5, ...ao });
    } });
    if (o.crownK > 0) { const [hx, hy] = lionRunHead(x, y, u, to); a2Crown(hx + (to.flip ? 12 : -12), hy - u * 3.4, u * 3.2 * backOut(clamp(o.crownK)), 'tcr', to.flip ? .15 : -.15); }
  };

  // ---- every caption: [text, y, t0, life, size, colour]
  const fit = (txt, max) => Math.min(max, Math.floor(1960 / txt.length));
  const two = (a, b, t0, life, sa = 72, sb = 76, gold = 1) => { sa = fit(a, sa); sb = fit(b, sb); return [[a, 470, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 470 + (sa + sb) * .68, t0 + .35, life - .35, sb, gold === 1 ? GOLDC : undefined]]; };
  const three = (a, b, c, t0, life, sa = 60, sb = 60, sc = 70, gold = 2) => { sa = fit(a, sa); sb = fit(b, sb); sc = fit(c, sc); return [[a, 466, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 466 + (sa + sb) * .68, t0 + .4, life - .4, sb, gold === 1 ? GOLDC : undefined], [c, 466 + (sa + sb) * .68 + (sb + sc) * .68, t0 + 1.2, life - 1.2, sc, gold === 2 ? GOLDC : undefined]]; };
  const at = (rows, i, t0, t1, col) => rows.map((c, j) => j === i ? [c[0], c[1], t0, t1 - t0 - .1, c[4], col ?? c[5]] : c);
  const small = (txt, rows, size = 30, d = .3) => { const l = rows[rows.length - 1]; return [txt, l[1] + l[4] * .62 + size * .9, l[2] + d, l[3] - d, size]; };
  const R_C = three('AN OLD BRAHMIN APPEARED:', '"TAKE HIM HOME. IN 12 YEARS', 'YOU\'LL KNOW WHO HE IS."', C0, 5.4, 66, 62, 70);
  const R_I = at(three('THE QUEEN FAKED A HEADACHE.', 'HIS VAIDYA SAID ONLY ONE CURE WORKS:', 'TIGER\'S MILK.', I0, 5.4, 64, 50, 118), 2, MILK - .2, J0);
  const R_K = three('THE KING CRIED:', '"YOU HAVE BECOME RAM.', 'AND I AM DASHARATHA!"', K0, 5.0, 70, 72, 74);
  const R_L = two('HE LEFT ALONE, A BUNDLE ON HIS HEAD,', 'WITH A THREE-EYED COCONUT INSIDE.', L0, 4.6, 54, 56, -1);
  const R_N = three('PANDALAM RAN FOR ITS LIFE.', 'MANIKANTA WAS BACK...', 'RIDING A TIGER.', N0, 5.2, 66, 72, 110);
  const R_Q = three('THE KING WHO FOUND HIM AS A BABY', 'FOLDED HIS HANDS:', '"WHO ARE YOU, REALLY?"', Q0, 5.4, 56, 66, 80);
  const R_R = two('WHO IN YOUR FAMILY WOULD YOU', 'SEND FOR TIGER\'S MILK?', R0, 5.0, 60, 76, 1);
  const CAPS = [
    ['A 12-YEAR-OLD WENT', 474, -1, B0 + .85, 74], ['FOR TIGER\'S MILK.', 574, -1, B0 + .85, 74], ['HE CAME BACK', 680, -1, B0 + .85, 74], ['RIDING A TIGER.', 806, -1, B0 + .85, 128, GOLDC],
    ...at(three('THE KING OF PANDALAM', 'WAS HUNTING BY THE PAMPA.', 'THEN HE HEARD A BABY CRY.', B0, 5.0, 74, 62, 66), 2, CRY - .3, C0),
    ...R_C, small('IT WAS VISHNU, IN DISGUISE', R_C, 32, .5),
    ...at(three('THEY HAD NO CHILD.', 'THEY RAISED HIM AS THEIR OWN.', 'LATER, THE QUEEN HAD A SON TOO.', D0, 5.0, 80, 60, 58, 1), 2, SON - .2, E0),
    ...at(three('AT 12, THE KING ANNOUNCED:', '"MANIKANTA WILL BE CROWN PRINCE."', 'ONE MAN HATED THAT.', E0, 4.8, 66, 56, 76, 1), 2, HATE - .2, F0),
    ...at(two('THE MINISTER TRIED BLACK MAGIC.', 'SHIVA CAME AS A SADHU AND HEALED HIM.', F0, 4.8, 62, 52), 1, HEAL - .5, G0),
    ...at(two('THEN HE TRIED POISON.', 'GARUDA DROPPED AMRIT IN THE FOOD.', G0, 4.6, 76, 56), 1, GAR, H0),
    ...three('PLAN 3. HE TOLD THE QUEEN:', '"YOUR OWN SON SHOULD BE KING.', 'FAKE A HEADACHE."', H0, 4.4, 66, 60, 76, 2),
    ...R_I,
    ...at(at(three('MANIKANTA SAID: "I\'LL GO."', 'THE KING SAID NO. SO HE ASKED', 'FOR A PROMISE FIRST...', J0, 5.0, 66, 58, 70, 0), 1, PROM - .5, K0), 2, PROM + .4, K0),
    ...R_K, small('BHOOTHANATHOPAKHYANAM · CH. 5', R_K, 30, .5),
    ...R_L, small('EVERY SABARIMALA PILGRIM STILL CARRIES ONE', R_L, 32, .6),
    ...at(three('THE PALACE WOMEN TEASED HIM:', '"BRING US TIGER CUBS TOO!"', 'HE SAID: "I WILL."', M0, 4.8, 64, 66, 84), 2, WILL - .2, N0),
    ...R_N, small('(WHAT HE DID IN THE FOREST IS PART 3)', R_N, 30, .6),
    ...at(at(three('THE TIGER WAS INDRA.', 'THE TIGRESSES WERE GODDESSES.', 'THE CUBS WERE THE DEVAS.', O0, 5.6, 84, 62, 70, 0), 1, CROWNS - .4, P0), 2, CROWNS + .2, P0),
    ...at(two('AND THE QUEEN\'S HEADACHE?', 'IT WAS GONE THE DAY HE LEFT.', P0, 4.4, 72, 64), 1, WELL - .3, Q0),
    ...R_Q, small('NEXT: THE DEMON IN THE FOREST', R_Q, 34, .6),
    ...R_R, small('TAG THEM · SWAMIYE SHARANAM AYYAPPA', R_R, 36),
  ];
  // the series marks: the part pill and the source line show in the opening only, then fade out
  const MARKS = C0 + 3.4;
  const caps = t => {
    for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color });
    if (t < MARKS && t > B0) { ayPill(2, (1 - seg(t, MARKS - .3, MARKS)) * clamp((t - B0) * 4)); aySource('BHOOTHANATHOPAKHYANAM · CH. 4–6', t - B0 - .3, MARKS - B0 - .3); }
  };

  // ================= A · the hook: Manikanta riding the tiger =================
  function shotHook(t, lt, dur) {
    const r = t - RING, p = t - PURR;
    camBegin(540, 1200, 1.0 + .006 * lt);
    warmBack(t, 'wbA', 540, 1380);
    glow(540, 1480, 460, '#FFE9A8', .5);
    const flick = r > -.5 && r < .5;
    const to = { boilKey: 'tgA', run: t * .7, stride: .25, eyes: p > 0 && p < 1.2 ? 'happy' : 'normal', mouth: p > 0 && p < 1.0 ? 'open' : 'smile', mouthK: .5, nod: p > 0 && p < 1 ? .1 * Math.sin(p * 9) : 0, hx: .5, tail: Math.sin(t * 2) * .6 };
    tigerRide(560, 1840, TU, t, to, { eyes: r > -.5 && r < 1 ? 'look' : 'happy', lookY: flick ? .9 : 0, mouth: r > .3 ? 'giggle' : 'smile', bellSwing: bellSw(t, [RING]), htilt: .05 * Math.sin(t * 2.2), ...(flick ? BELLHAND : {}) });
    const [sx, sy] = lionRunSeat(560, 1840, TU, to);
    ting(sx - 10, sy - TU * 4.5, t, RING, 'tgA', 80);
    hearts(380, 1150, t, PURR + .2, 'hA', 3, 20);
    camEnd();
    caps(t);
    wipeOut(lt, dur, FORW);
  }

  // ================= B · the hunt by the Pampa: a baby's cry (ch. 4) =================
  function shotHunt(t, lt, dur) {
    const c = t - CRY, w = clamp((t - B0) / 2.2);
    camBegin(540, 1300, 1.0 + .008 * lt);
    a2Forest(t, 'foB');
    const kx = lerp(-120, 380, ease(w));
    king(kx, 1840, 21, { ...KG, walk: w < 1 ? t * 2 : undefined, eyes: c > 0 ? 'wide' : 'normal', mouth: c > 0 ? 'O' : 'smile', hx: c > 0 ? .5 : .3, lookX: c > 0 ? .8 : .4,
      handR: c > .2 ? [5.2, -20.5] : undefined, bendR: -1, emote: c > 0 ? '!?' : null, emoteK: popk(t, CRY, 5), emoteAge: c });
    if (c > 0) { boilSeed('cryB'); for (let i = 0; i < 3; i++) { const a = frac(c * 1.2 + i / 3); inkLine([[880 + a * 40, 1540 - i * 30 - a * 60], [910 + a * 50, 1520 - i * 30 - a * 70]], 2, '#FFFFFF', 'ink', .4); } }
    a2Bush(860, 1700, 300, 0, 'bsB');
    camEnd();
    caps(t);
    wipeIn(lt, FORW);
  }

  // ================= C · the baby in the light; the old brahmin (Vishnu) =================
  function shotFind(t, lt, dur) {
    const o = clamp((t - PART) / .8), b = t - BRAH, g = t - BGONE;
    camBegin(560, 1330, 1.04 + .006 * lt);
    a2Forest(t, 'foB');
    glow(700, 1650, 360 * ease(o), '#FFF2C0', .9 * o);
    const cry = t < PART + 1.0;
    ayyappa(720, 1800, 15, { ...AY, pose: 'sit', glowK: .7 * o, eyes: cry ? 'squeeze' : 'happy', mouth: cry ? 'wail' : 'giggle', blush: .6, bellSwing: bellSw(t, [PART + 1.2]), dy: hop(t - PART - 1.2, .3, 9, 2) });
    ting(720, 1640, t, PART + 1.2, 'tgC', 60);
    a2Bush(720, 1840, 300, ease(o), 'bsC');
    king(250, 1840, 21, { ...KG, eyes: o > .5 ? (b > 0 ? 'normal' : 'wide') : 'normal', mouth: b > .2 ? 'O' : o > .5 ? 'grin' : 'O', hx: b > 0 ? .5 : .4, lookX: .8, lookY: .5, blush: o > .5 && b < 0 ? .4 : 0,
      handL: o < 1 ? [4.6, -14] : undefined, handR: o < 1 ? [6.2, -15] : undefined, bendL: -1, bendR: -1 });
    hearts(250, 1150, t, PART + 1.3, 'hC', 3, 18);
    // the old brahmin, leaning on his stick
    if (b > 0 && g < .15) {
      poof(960, 1550, 200, b / .6, 'pfC', ['#FFFFFF', '#D6E6FA']);
      const k = popk(t, BRAH + .1, 5), ro = { boilKey: 'brm', eyes: g > -1.2 ? 'happy' : 'normal', mouth: talk(t, BRAH + .5, BGONE - 1.2), hx: -.5, lookX: -.8, handR: [3.8, -12], bendR: -1, sq: (1 - k) * .3 };
      a2Stick(960 + 3.8 * 19 - 8, 1840 - 12 * 19, 960 + 3.8 * 19 + 10, 1840, 'stC');
      rishi(960, 1840, 19 * (.7 + .3 * k), 0, ro);
    }
    if (g > 0) { poof(960, 1550, 220, g / .6, 'pfC2', ['#FFFFFF', '#9CC8EE']); sparkleBurst(960, 1450, 220, g * .6, 'spC', 10, ['#3E6CB8', GOLDC]); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, HALLW);
  }

  // ================= D · the palace: raised as their own; the queen's own son =================
  function shotRaised(t, lt, dur) {
    const s = t - SON;
    camBegin(540, 1330, 1.0 + .006 * lt);
    a2Hall(t, 'hlD');
    king(230, 1840, 20, { ...KG, eyes: 'happy', mouth: 'grin', hx: .4, lookX: .7, lookY: .4 });
    const qo = { ...QN, eyes: 'happy', mouth: 'smile', hx: -.4, lookX: -.7, lookY: .4, handR: s > 0 ? [1.2, -13.2] : undefined, handL: s > 0 ? [-2.4, -12.6] : undefined, bendR: -1, bendL: 1 };
    queen(850, 1840, 20, qo);
    if (s > 0) { const [hx, hy] = parvatiHand(850, 1840, 20, qo, 1); poof(hx - 20, hy - 30, 120, s / .5, 'pfD'); babyPrince(hx - 22, hy + 40, 6.5 * popk(t, SON, 5), { boilKey: 'bpD', pose: 'sit', noShadow: true, eyes: 'happy', mouth: 'giggle', blush: .5 }); }
    const gg = t - D0;
    ayyappa(540, 1840, 22, { ...AY, pose: 'stand', eyes: s > 0 ? 'look' : 'happy', lookX: s > 0 ? .6 : 0, mouth: s > 0 ? 'smile' : 'giggle', blush: .5, bellSwing: bellSw(t, [D0 + .8]), dy: s < 0 ? hop(gg % 1.2, .25, 8, 2) : 0 });
    hearts(540, 1300, t, D0 + .5, 'hD', 3, 18);
    if (s > .3) hearts(780, 1320, t, SON + .3, 'hD2', 2, 14);
    camEnd();
    caps(t);
    wipeIn(lt, HALLW);
  }

  // ================= E · at twelve: crown prince; one man hated that (ch. 5) =================
  function shotCrown(t, lt, dur) {
    const h = t - HATE, ck = popk(t, E0 + 1.2, 3);
    camBegin(540, 1330, 1.0 + .006 * lt);
    a2Hall(t, 'hlD');
    king(250, 1840, 20, { ...KG, eyes: 'happy', mouth: talk(t, E0 + .3, E0 + 2.2, 'grin'), hx: .4, lookX: .7, handR: [6.4, -17], bendR: -1, puff: .4 });
    ayyappa(560, 1840, 24, { ...AY, pose: 'stand', eyes: ck > .5 ? 'sparkle' : 'normal', mouth: 'grin', blush: .6, lookY: -.4, bellSwing: bellSw(t, []) });
    if (ck > 0) { const [hx, hy] = bkHead(560, 1840, 24, { pose: 'stand' }); a2Crown(hx, hy - 150 - 10 * Math.sin(t * 3), 120 * ck, 'crE'); sparkleBurst(hx, hy - 200, 140, (t - E0 - 1.2) * .5, 'spE', 8); }
    minister(900, 1840, 20, { ...MN, eyes: h > 0 ? 'angry' : 'smug', mouth: h > 0 ? 'frown' : 'smug', hx: -.5, lookX: -.8, brow: h > 0 ? -1 : 0, dy: h > 0 ? .1 * Math.sin(t * 40) * Math.exp(-h * 2) : 0,
      emote: h > 0 ? 'anger' : null, emoteK: popk(t, HATE, 5), emoteAge: h, tint: h > 0 ? '#D8394E' : undefined, tintK: h > 0 ? .25 * clamp(h * 2) : 0 });
    camEnd();
    caps(t);
    wipeOut(lt, dur, ROOMW);
  }

  // ================= F · black magic; Shiva as a sadhu heals him =================
  const sadhu = (x, y, u, o = {}) => bhikshu(x, y, u, { tilak: false, ...o, pal: { hair: '#2A2438', hairLt: '#4E4660', dhoti: '#E8742A', dhotiDk: '#B8501A', shawl: '#F2994A', shawlDk: '#C46A22', ...(o.pal || {}) },
    hat: (uu, sw) => {   // the ash tripundra and, for those who look closely, the crescent moon in his hair
      boilSeed('sadhu ash');
      for (const k of [-22.0, -22.45, -22.9]) inkLine(U([[-1.3, k], [0, k - .12], [1.3, k]], uu), sw * 1.4, '#F6F2EA', 'ink', 0);
      paint(U([[1.4, -25.6], [2.2, -25.5], [2.7, -24.9], [2.6, -24.2], [2.2, -24.7], [1.8, -25.0]], uu), { wash: '#FFF6D8', ink: SHS_PAL.ink, sw: sw * .5, curv: .5 });
    } });
  function shotMagic(t, lt, dur) {
    const h = t - HEAL, w = clamp((t - F0 - .3) / 1.4);
    camBegin(540, 1330, 1.0 + .006 * lt);
    a2Room(t, 'rmF');
    a2Mat(420, 1830, 520, 'mtF');
    const sick = h < .3;
    const ao = { ...AY, pose: 'sit', eyes: sick ? 'sad' : 'happy', mouth: sick ? 'frown' : 'giggle', blush: sick ? 0 : .5, tint: sick ? '#8A9A6A' : undefined, tintK: sick ? .25 : 0, hx: .3, lookX: .5, dy: hop(h - .3, .3, 9, 2) };
    ayyappa(420, 1810, 22, ao);
    if (sick) { boilSeed('soresF'); const [hx, hy] = bkHead(420, 1810, 22, ao); for (const [dx, dy] of [[-38, 20], [42, 40], [-62, 120], [58, 140], [0, 172], [-26, 86]]) paint(ellPts(hx + dx, hy + dy, 9, 8, 8), { wash: '#C8506A', ink: HSK.ink, sw: .5 }); }
    if (h > 0) sparkleBurst(420, 1500, 240, h * .6, 'spF', 10, ['#FFFFFF', GOLDC]);
    const sx = lerp(1180, 760, ease(w));
    sadhu(sx, 1840, 20, { boilKey: 'sdF', walk: w < 1 ? t * 2 : undefined, eyes: 'happy', mouth: 'smile', hx: -.5, lookX: -.8, lookY: .4, bow: w >= 1 ? .35 : 0,
      handR: w >= 1 && h < 1 ? [-6.6, -15.5] : undefined, bendR: 1 });
    hearts(420, 1300, t, HEAL + .5, 'hF', 3, 18);
    camEnd();
    caps(t);
    wipeIn(lt, ROOMW);
    wipeOut(lt, dur, HALLW);
  }

  // ================= G · poison; Garuda drops amrit in the food =================
  function shotPoison(t, lt, dur) {
    const g = t - GAR, fl = clamp(g / 1.6), drop = g > .5;
    camBegin(540, 1330, 1.0 + .006 * lt);
    a2Hall(t, 'hlG', { lamps: false });
    a2Lamp(140, 1700, 120, 1, 'lG');
    const eat = g > 1.4;
    ayyappa(380, 1800, 22, { ...AY, pose: 'sit', eyes: eat ? 'closed' : g > 0 ? 'look' : 'happy', lookY: g > 0 && !eat ? -.9 : 0, lookX: g > 0 && !eat ? .3 : 0, mouth: eat ? 'chew' : 'smile', blush: .5,
      handR: eat ? [2.2, -9.8 + Math.abs(Math.sin(t * 6)) * 1.2] : undefined, bendR: -1, nod: eat ? .2 * Math.sin(t * 10) : 0 });
    a2Leaf(400, 1880, 300, 'lfG', g > .8 ? clamp(1 - (g - .8) / 1.6) : 0);
    if (g > .8 && g < 2.4) sparkleBurst(400, 1830, 160, (g - .8) * .7, 'spG', 8, ['#FFFFFF', GOLDC]);
    // the minister, rubbing his hands, then the shock
    const shock = g > 1.4;
    minister(820, 1840, 20, { ...MN, eyes: shock ? 'wide' : 'smug', mouth: shock ? 'O' : 'smug', hx: -.5, lookX: -.8, lookY: .5, sweat: shock ? 1 : 0,
      handL: shock ? [-5.4, -20] : [-.8, -14.6 + Math.sin(t * 12) * .4], handR: shock ? [5.4, -20] : [.8, -14.2 - Math.sin(t * 12) * .4], bendL: 1, bendR: -1,
      emote: shock ? '!!' : null, emoteK: popk(t, GAR + 1.4, 5), emoteAge: g - 1.4 });
    // Garuda
    if (g > -.2 && g < 2.2) {
      const gx = lerp(-200, 1300, fl), gy = 1180 + Math.sin(fl * Math.PI) * 140;
      kamaParrot(gx, gy, 20, { pal: GARUDA_PAL, ring: false, hat: garudaCrown, fly: true, flap: Math.sin(t * 18), boilKey: 'grG', eyes: 'normal' });
      if (drop) { boilSeed('amG'); for (let i = 0; i < 6; i++) { const q = frac(g * 1.4 + i / 6), dx = lerp(gx - 60, 400, q * .9); paint(ellPts(dx, lerp(gy + 40, 1850, q), 9, 12, 8), { wash: '#FFE38A', ink: HSK.ink, sw: .4 }); } }
    }
    camEnd();
    caps(t);
    wipeIn(lt, HALLW);
    wipeOut(lt, dur, ROOMW);
  }

  // ================= H · plan 3: the minister talks the queen into a feigned headache =================
  function shotWhisper(t, lt, dur) {
    const n = t - NOD;
    camBegin(540, 1330, 1.04 + .006 * lt);
    a2Room(t, 'rmH');
    const mo = { ...MN, eyes: 'sad', mouth: talk(t, H0 + .3, NOD - .2, 'frown', 'open'), hx: .5, lookX: .8, lean: 1.2, bow: .15, handR: [4.6, -17], bendR: -1 };
    minister(330, 1840, 21, mo);
    const [ex, ey] = naradaEye(330, 1840, 21, mo, 1);
    tears(ex, ey + 10, t, 'trH', .7);
    queen(770, 1840, 21, { ...QN, eyes: n > 0 ? 'closed' : 'sad', mouth: n > 0 ? 'flat' : 'O', hx: -.5, lookX: -.8, worry: .6, nod: n > 0 ? .4 * clamp(n * 2) : 0, handL: [-1.4, -14.2], bendL: 1 });
    camEnd();
    caps(t);
    wipeIn(lt, ROOMW);
    wipeOut(lt, dur, HALLW);
  }

  // ================= I · the headache; the vaidya: tiger's milk =================
  function shotHeadache(t, lt, dur) {
    const v = t - VAID, m = t - MILK;
    camBegin(540, 1330, 1.0 + .006 * lt);
    a2Hall(t, 'hlI');
    const peek = t > I0 + 1.5 && t < I0 + 2.3;
    queen(180, 1840, 19, { ...QN, eyes: peek ? ['squeeze', 'normal'] : 'squeeze', lookX: peek ? 1 : 0, mouth: peek ? 'smirk' : 'open', handR: [1.6, -21.4], bendR: -1, htilt: -.1 + .05 * Math.sin(t * 6), worry: 1 });
    king(470, 1840, 20, { ...KG, eyes: m > 0 ? 'wide' : 'sad', mouth: m > 0 ? 'O' : 'frown', hx: m > 0 ? .4 : -.4, lookX: m > 0 ? .8 : -.8, worry: 1, sweat: m > 0 ? 1 : 0 });
    vaidya(800, 1840, 20, { boilKey: 'vdI', eyes: v > 0 ? 'closed' : 'normal', mouth: talk(t, VAID, VAID + 1.4, 'smile'), hx: -.4, lookX: -.7, handL: v > 0 ? [-3.4, -22] : undefined, bendL: 1, puff: .3 });
    const bk = popk(t, MILK, 4);
    a2Bubble(700, 1250, 300, 200, bk, 'bbI', 790, 1390);
    if (bk > .8) { lion(640, 1345, 7, { kind: 'tiger', boilKey: 'tbI', eyes: 'angry', mouth: 'roar', mouthK: .6, noShadow: true }); letter('+', 725, 1260, 46, A2.ink, { ink: false, rot: 0 }); a2MilkPot(795, 1330, 90, 'mpI'); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, HALLW);
  }

  // ================= J · "I'll go"; the king says no; the promise =================
  function shotPromise(t, lt, dur) {
    const p = t - PROM, l = t - LETGO;
    camBegin(540, 1330, 1.02 + .006 * lt);
    a2Hall(t, 'hlI');
    const sw = p > 0 && l < .4;
    king(320, 1840, 21, { ...KG, eyes: l > .4 ? 'wide' : sw ? 'swirl' : 'sad', mouth: l > .4 ? 'scream' : sw ? 'smile' : talk(t, J0 + 1.4, PROM - .3, 'frown'), hx: .4, lookX: .8,
      shake: t > J0 + 1.4 && p < 0 ? .25 * Math.sin(t * 14) : 0, nod: sw ? .3 * Math.abs(Math.sin(p * 4)) : 0, handR: sw ? [5.8, -14.4] : undefined, bendR: -1,
      emote: l > .4 ? '!!' : null, emoteK: popk(t, LETGO + .4, 5), emoteAge: l });
    const ao = { ...AY, pose: 'stand', eyes: p > 0 ? 'happy' : 'normal', mouth: talk(t, J0 + .2, J0 + 1.2, 'smile', 'open'), hx: -.4, lookX: -.8, lookY: -.5, blush: .4,
      handL: p > 0 && l < .4 ? [-3.8, -8.6] : t < J0 + 1.4 ? [-.4, -7.6] : undefined, bendL: 1, handShapeL: p > 0 ? 'open' : undefined };
    ayyappa(720, 1840, 24, ao);
    if (sw) { boilSeed('mayaJ'); for (let i = 0; i < 6; i++) { const a = t * 2 + i / 6 * TAU; paint(starPts(520 + Math.cos(a) * 90, 1360 + Math.sin(a) * 40, 14, .35, 4, a), { wash: '#C8A6EA', ink: null }); } }
    camEnd();
    caps(t);
  }

  // ================= K · "you have become Ram, and I Dasharatha!" =================
  function shotRam(t, lt, dur) {
    const f = t - FLOP, fk = easeOut(clamp(f / .35));
    camBegin(540, 1330, 1.06 + .006 * lt);
    a2Hall(t, 'hlI');
    const ko = { ...KG, sit: f > 0 ? 1 : 0, eyes: 'squeeze', mouth: 'scream', hx: .3, lookX: .5, handL: [-3.4, -22.6], handR: [3.4, -22.6], bendL: 1, bendR: -1, dy: f > 0 ? hop(f, .4, 10, 3) : 0 };
    king(380, 1840, 21, ko);
    const [hx, hy] = naradaHead(380, 1840, 21, ko);
    tears(hx - 30, hy + 10, t, 'trK0', .9); tears(hx + 30, hy + 10, t + .3, 'trK1', .9);
    ayyappa(760, 1840, 24, { ...AY, pose: 'stand', eyes: 'sad', mouth: 'flat', hx: -.4, lookX: -.8, lookY: .5, worry: .6, handL: f > 1 ? [-4.2, -10.4 + Math.sin(t * 5) * .4] : undefined, bendL: 1 });
    if (f > 0 && f < .5) { boilSeed('dustK'); for (let i = 0; i < 6; i++) paint(ellPts(380 + (i - 2.5) * 70 * (1 + f * 2), 1830 - f * 40, 30 * (1 - f * 1.6), 16 * (1 - f * 1.6), 8), { wash: '#E8C8A8', washOp: 200, ink: null }); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, STW);
  }

  // ================= L · he leaves alone: the bundle and the three-eyed coconut =================
  function shotLeave(t, lt, dur) {
    const w = clamp((t - L0 - .4) / (dur - .8));
    camBegin(540, 1330, 1.0 + .006 * lt);
    a2Street(t, 'stL', { gateX: 300 });
    const kx = 300;
    const ko = { ...KG, eyes: 'sad', mouth: 'smile', hx: .4, lookX: .8, handR: [5.6, -22 + Math.sin(t * 9) * 1.2], bendR: -1, worry: .6 };
    king(kx, 1750, 17, ko);
    const [khx, khy] = naradaEye(kx, 1750, 17, ko, 1);
    tears(khx, khy + 8, t, 'trL', .6);
    const ax = lerp(560, 860, w);
    const ao = { ...AY, pose: 'stand', walk: t * 2.2, eyes: 'happy', mouth: 'smile', hx: -.2, lookX: -.4, blush: .4 };
    ayyappa(ax, 1880, 24, ao);
    const [hx, hy] = bkHead(ax, 1880, 24, ao);
    a2Bundle(hx, hy - 76 + Math.abs(Math.sin(t * 4.4)) * -4, 170, 'bdL');
    camEnd();
    caps(t);
    wipeIn(lt, STW);
  }

  // ================= M · "bring us tiger cubs!" "I will." =================
  function shotTease(t, lt, dur) {
    const wl = t - WILL;
    camBegin(540, 1330, 1.0 + .006 * lt);
    a2Street(t, 'stL', { gateX: 300 });
    for (let i = 0; i < 2; i++) {
      const x = 170 + i * 220, laugh = wl < 0;
      lady(x, 1840, 18, i, { boilKey: 'ldM' + i, eyes: laugh ? 'happy' : 'wide', mouth: laugh ? 'laugh' : 'O', hx: .4, lookX: .8, handR: laugh ? [1.2, -18.6] : undefined, bendR: -1, dy: laugh ? -.15 * Math.abs(Math.sin(t * 11 + i)) : 0 });
    }
    const ao = { ...AY, pose: 'stand', eyes: wl > 0 ? ['happy', 'normal'] : 'normal', mouth: wl > 0 ? 'grin' : 'smile', hx: -.5, lookX: -.8, blush: .4, nod: wl > 0 && wl < .6 ? .5 * Math.sin(wl * 10) : 0 };
    ayyappa(820, 1880, 24, ao);
    const [hx, hy] = bkHead(820, 1880, 24, ao);
    a2Bundle(hx, hy - 76, 170, 'bdL');
    if (wl > 0) sparkleBurst(hx - 60, hy - 20, 90, wl * .7, 'spM', 6, ['#FFFFFF', GOLDC]);
    camEnd();
    caps(t);
    wipeOut(lt, dur, STW);
  }

  // ================= N · Pandalam runs: he is back, riding a tiger, with a whole pack =================
  function shotReturn(t, lt, dur) {
    const g = t - TIGIN, w = clamp(g / 2.6);
    camBegin(540, 1330, 1.0 + .006 * lt);
    a2Street(t, 'stN', { gateX: 540 });
    // the townsfolk run screaming, right to left
    for (let i = 0; i < 3; i++) {
      const q = clamp((t - N0 - i * .45) / 1.8); if (q <= 0 || q >= 1) continue;
      const x = lerp(1250, -200, q), y = 1860 + i * 20;
      if (i === 1) lady(x, y, 17, 2, { boilKey: 'ldN', walk: t * 4, flip: true, eyes: 'wide', mouth: 'scream', hx: .6, lookX: 1, handL: [-3, -22], handR: [3, -22], bendL: 1, bendR: -1, sweat: 1 });
      else townsman(x, y, 17, i / 2, { boilKey: 'tmN' + i, walk: t * 4, flip: true, eyes: 'wide', mouth: 'scream', hx: .6, lookX: 1, handL: [-3.4, -23], handR: [3.4, -23], bendL: 1, bendR: -1, sweat: 1 });
    }
    if (g > 0) {
      // the pack behind him
      for (let i = 0; i < 2; i++) { const x = lerp(1600 + i * 300, 860 + i * 250, ease(w)); lionRun(x, 1720 + i * 40, 17, { kind: 'tiger', flip: true, boilKey: 'tgN' + i, run: t * 1.4 + i, stride: .4, eyes: 'happy', mouth: 'smile' }); }
      for (let i = 0; i < 3; i++) { const x = lerp(1500 + i * 180, 700 + i * 170, ease(w)), y = 2000 - (i % 2) * 20; lion(x, y + hop((t * 1.8 + i * .3) % 1, 1, 6, 0) * 20, 9, { kind: 'tiger', boilKey: 'cbN' + i, eyes: 'happy', mouth: 'open', mouthK: .4, blush: .6 }); }
      const x = lerp(1400, 420, ease(w));
      tigerRide(x, 1860, TU, t, { boilKey: 'tgR', flip: true, run: t * 1.4, stride: w < 1 ? .45 : .1, eyes: 'happy', mouth: 'smile', hx: .4 }, { eyes: 'happy', mouth: 'grin', bellSwing: bellSw(t, [TIGIN + 2.8]), hx: -.3 });
    }
    camEnd();
    caps(t);
    wipeIn(lt, STW);
  }

  // ================= O · the tiger was Indra; the tigresses goddesses; the cubs the devas (ch. 6) =================
  function shotReveal(t, lt, dur) {
    const i0 = t - INDRA, b = t - BACK, c = t - CROWNS;
    camBegin(540, 1330, 1.0 + .006 * lt);
    a2Street(t, 'stN', { gateX: 540 });
    for (let i = 0; i < 2; i++) { const x = 860 + i * 250, y = 1720 + i * 40, to = { kind: 'tiger', flip: true, boilKey: 'tgN' + i, eyes: 'happy', mouth: 'smile', hx: .5 };
      lionRun(x, y, 17, to); if (c > i * .2) { const [hx, hy] = lionRunHead(x, y, 17, to); a2Crown(hx + 8, hy - 52, 70 * popk(t, CROWNS + i * .2, 5), 'cO' + i, .15); } }
    for (let i = 0; i < 3; i++) { const x = 700 + i * 170, y = 2000 - (i % 2) * 20; lion(x, y, 9, { kind: 'tiger', boilKey: 'cbN' + i, eyes: 'happy', mouth: c > .4 + i * .15 ? 'grin' : 'open', mouthK: .4, blush: .6, nod: .05 * Math.sin(t * 4 + i) });
      if (c > .4 + i * .15) { const [hx, hy] = lionHead(x, y, 9, {}); a2Crown(hx, hy - 44, 56 * popk(t, CROWNS + .4 + i * .15, 5), 'cc' + i); } }
    const isIndra = i0 > .15 && b < .15;
    if (!isIndra) tigerRide(420, 1860, TU, t, { boilKey: 'tgR', flip: true, eyes: b > 0 ? 'happy' : 'normal', mouth: 'smile', hx: .4, crownK: b > 0 ? (t - BACK - .1) * 4 : 0 }, { eyes: 'happy', mouth: 'grin', hx: -.3 });
    else {
      cloudPuff(230, 1560, 130, 'cpO', 255, '#FFFFFF', '#E6D6C0');
      ayyappa(230, 1520, 20, { ...AY, pose: 'sit', noShadow: true, eyes: 'happy', mouth: 'giggle', blush: .5, dy: hop(i0 - .15, .3, 9, 2) });
      indra(470, 1820, 44, { boilKey: 'inO', eyes: 'happy', mouth: 'sheepish', lookX: -.4, handR: [3.4, -8.6 + Math.sin(t * 12) * .5], vajra: 0, sweat: 1 });
    }
    if (i0 > 0 && i0 < .7) poof(420, 1600, 380, i0 / .7, 'pfO0', ['#FFFFFF', '#FFE38A']);
    if (b > 0 && b < .7) poof(420, 1600, 380, b / .7, 'pfO1', ['#FFFFFF', '#FFE38A']);
    if (c > 0) sparkleBurst(900, 1450, 300, c * .5, 'spO', 12, ['#FFFFFF', GOLDC]);
    camEnd();
    caps(t);
    wipeOut(lt, dur, HALLW);
  }

  // ================= P · the queen's headache was gone the day he left =================
  function shotWell(t, lt, dur) {
    const w = t - WELL;
    camBegin(540, 1330, 1.0 + .006 * lt);
    a2Hall(t, 'hlP');
    const to = { kind: 'tiger', boilKey: 'tgR', eyes: 'happy', mouth: 'smile', hx: .5, flip: true };
    tigerRide(800, 1880, 20, t, { ...to, crownK: 1 }, { eyes: 'happy', mouth: 'smile', hx: -.3, lookX: -.5 });
    a2MilkPot(500, 1880, 120, 'mpP');
    queen(240, 1840, 20, { ...QN, eyes: w > 0 ? 'happy' : 'wide', mouth: w > 0 ? 'sheepish' : 'O', hx: .4, lookX: .8, blush: w > 0 ? .7 : 0, sweat: w > 0 ? 1 : 0, handL: w > 0 ? [-1, -21.2] : undefined, bendL: 1,
      handR: w < 0 ? [5.4, -14] : undefined, bendR: -1, emote: w > 0 ? null : '!', emoteK: popk(t, P0 + .3, 5), emoteAge: t - P0 });
    camEnd();
    caps(t);
    wipeIn(lt, HALLW);
  }

  // ================= Q · the king folds his hands: "who are you, really?" =================
  function shotWho(t, lt, dur) {
    const k = t - KNEEL;
    camBegin(560, 1340, 1.04 + .01 * lt);
    a2Hall(t, 'hlQ');
    glow(720, 1500, 420, '#FFF2C0', .6 * clamp((t - Q0) / 1.5));
    king(330, 1840, 21, { ...KG, bow: k > 0 ? .45 * clamp(k * 2) : 0, pray: k > 0 ? clamp(k * 2) : 0, eyes: k > .6 ? 'closed' : 'wide', mouth: k > 0 ? 'smile' : 'O', hx: .4, lookX: .8, lookY: -.3 });
    const ao = { ...AY, pose: 'stand', glowK: .7, eyes: 'happy', mouth: 'smile', hx: -.4, lookX: -.8, blush: .4, bellSwing: bellSw(t, [Q0 + 3.6]), handR: k > 1.4 ? [3.2, -10.4] : undefined, handShapeR: 'open', bendR: -1 };
    ayyappa(740, 1840, 25, ao);
    const [bx, by] = bkChest(740, 1840, 25, ao);
    ting(bx, by + 40, t, Q0 + 3.6, 'tgQ', 70);
    camEnd();
    caps(t);
    wipeOut(lt, dur, PEACH);
  }

  // ================= R · the ask (the hook's picture) =================
  function shotAsk(t, lt, dur) {
    const g = t - R0, rings = [R0 + 1.0, R0 + 2.8];
    camBegin(540, 1200, 1.0 + .006 * lt);
    warmBack(t, 'wbR', 540, 1380);
    glow(540, 1480, 460, '#FFE9A8', .5);
    const to = { boilKey: 'tgA', run: t * .7, stride: .25, eyes: 'happy', mouth: 'smile', hx: .5, tail: Math.sin(t * 2) * .6, crownK: 1 };
    const flick = rings.some(r => t > r - .3 && t < r + .4);
    tigerRide(560, 1840, TU, t, to, { eyes: 'happy', mouth: 'grin', bellSwing: bellSw(t, rings), ...(flick ? BELLHAND : {}), handL: g > 1.6 && g < 2.4 ? [-3.8, -12 + Math.sin(t * 14) * .6] : undefined, bendL: 1 });
    const [sx, sy] = lionRunSeat(560, 1840, TU, to);
    for (const r of rings) ting(sx - 10, sy - TU * 4.5, t, r, 'tgR' + r, 80);
    lion(220, 1960, 9, { kind: 'tiger', boilKey: 'cbR', eyes: 'happy', mouth: 'grin', blush: .6, nod: .05 * Math.sin(t * 4) });
    { const [hx, hy] = lionHead(220, 1960, 9, {}); a2Crown(hx, hy - 44, 56, 'ccR'); }
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
  }

  function shotCard(t, lt, dur) { hsCard(t, CARDC); }

  shots([[0, shotHook], [B0, shotHunt], [C0, shotFind], [D0, shotRaised], [E0, shotCrown], [F0, shotMagic], [G0, shotPoison], [H0, shotWhisper], [I0, shotHeadache],
    [J0, shotPromise], [K0, shotRam], [L0, shotLeave], [M0, shotTease], [N0, shotReturn], [O0, shotReveal], [P0, shotWell], [Q0, shotWho], [R0, shotAsk], [CARD, shotCard]]);
})();
