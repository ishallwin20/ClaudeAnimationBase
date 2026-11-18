// ayy1.js: "His father is SHIVA. His mother is VISHNU." (ad 101, Ayyappa series Part 1, 86.6 s, Painted, Bangers
// captions, retro SFX, no voice). Read on 18 Nov 2026 (STORYBOARD.md has the facts with chapter numbers):
//   Bhoothanathopakhyanam (Malayalam kilippattu, 1929), ch. 1 Mahishi's tapas and boon; ch. 2 the churning, Mohini's
//   "close your eyes" test; ch. 3 Shiva asks to see Mohini, the garden, the champak, the ruby ball, the birth, the hugs,
//   Parvati and Lakshmi's milk, Brahma's thousand names; ch. 4 the twelve years among humans, Shiva's gold bell, the
//   Pampa (Janmabhumi's prose serial, 2014)
//   Kanda Puranam (Tamil, Kachiyappa Sivachariyar), Asura Kandam, Maha Sastha Padalam: the birth, "Harihara-putra"
//   Bhagavata 8.12.18: the garden and the ball (no child in the Bhagavata)
// Props are in ayy1_props.js; the kit is src/ayyappa_series.js (+ hanuman_series.js for the card and small props).
// Times are video time (t); tools/ayy1_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/ayy1_sfx.mjs)
  const RING = 1.6, GIG = 2.4;
  const B0 = 4.6, BRAHMA = 7.4, C0 = 9.6, BUB = 11.4, LAUGH = 12.9, D0 = 15.0, BUFF = 15.5, FLEE = 16.7;
  const E0 = 19.0, MPOP = 19.4, F0 = 24.0, SHUT = 26.4, G0 = 29.0, SERVE = 30.2, PEEKA = 31.6;
  const H0 = 33.0, VANISH = 36.4, I0 = 37.6, SEE = 39.5, J0 = 43.0, CATCH = 45.6;
  const K0 = 47.4, OPEN = 49.4, L0 = 52.6, MPOOF = 54.8, HOP = 55.8, M0 = 58.0, LKS = 59.8, ALL4 = 61.0;
  const N0 = 63.4, O0 = 67.6, TIE = 70.2, P0 = 73.6, LAND = 75.4, Q0 = 78.4, CARD = 83.0;
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
  const PEAKW = [A1.duskLo, A1.duskSky], HVW = [A1.heavenLo, A1.gold], SHW = [A1.seaDk, A1.sand], VKW = [A1.vk, '#FFFFFF'], GDW = [A1.grass, '#F7C64A'],
    LTW = ['#FFF4DA', '#FFE6A0'], KSW = [A1.kSky, A1.snow], PMW = [A1.night, A1.river], PEACH = [HSK.marigold, HSK.petal];

  // ---- the cast's fixed options
  const AY = { boilKey: 'ayy', seed: 7 };
  const SH = { boilKey: 'shv', seed: 21 };
  const MO = { boilKey: 'moh', seed: 33 };
  const MH = { boilKey: 'mhi', seed: 41 };
  const BELLHAND = { handR: [.75, -5.7], bendR: -1, handShapeR: 'point' };

  // ---- every caption: [text, y, t0, life, size, colour]
  const fit = (txt, max) => Math.min(max, Math.floor(1960 / txt.length));
  const two = (a, b, t0, life, sa = 72, sb = 76, gold = 1) => { sa = fit(a, sa); sb = fit(b, sb); return [[a, 470, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 470 + (sa + sb) * .68, t0 + .35, life - .35, sb, gold === 1 ? GOLDC : undefined]]; };
  const three = (a, b, c, t0, life, sa = 60, sb = 60, sc = 70, gold = 2) => { sa = fit(a, sa); sb = fit(b, sb); sc = fit(c, sc); return [[a, 466, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 466 + (sa + sb) * .68, t0 + .4, life - .4, sb, gold === 1 ? GOLDC : undefined], [c, 466 + (sa + sb) * .68 + (sb + sc) * .68, t0 + 1.2, life - 1.2, sc, gold === 2 ? GOLDC : undefined]]; };
  const at = (rows, i, t0, t1, col) => rows.map((c, j) => j === i ? [c[0], c[1], t0, t1 - t0 - .1, c[4], col ?? c[5]] : c);
  const small = (txt, rows, size = 30, d = .3) => { const l = rows[rows.length - 1]; return [txt, l[1] + l[4] * .62 + size * .9, l[2] + d, l[3] - d, size]; };
  const R_F = three('SHE TOLD THE ASURAS:', '"CLOSE YOUR EYES. THE ONE WHO', 'OPENS THEM LAST MARRIES ME."', F0, 5.0, 68, 60, 64);
  const R_I = three('A GARDEN APPEARED. UNDER', 'A CHAMPAK TREE, MOHINI', 'PLAYED WITH A RUBY BALL.', I0, 5.4, 64, 66, 64);
  const R_K = three('FROM THE TWO OF THEM,', 'A CHILD OF LIGHT WAS BORN:', 'HARIHARA-PUTRA.', K0, 5.2, 70, 64, 104);
  const R_P = at(at(three('...AND SENT HIM TO THE PAMPA.', 'THE BELL GAVE HIM HIS NAME:', 'MANIKANTA.', P0, 4.8, 60, 62, 118), 1, LAND + .2, Q0), 2, LAND + .6, Q0);
  const R_Q = two('AYYAPPA. MANIKANTA. SHASTA.', 'WHAT DOES YOUR FAMILY CALL HIM?', Q0, 4.6, 62, 58, 1);
  const CAPS = [
    ['HIS FATHER IS SHIVA.', 474, -1, B0 + .85, 72], ['HIS MOTHER IS', 572, -1, B0 + .85, 72], ['VISHNU.', 702, -1, B0 + .85, 156, GOLDC],
    ...three('IT BEGAN WITH MAHISHI,', 'MAHISHASURA\'S SISTER.', 'SHE WANTED REVENGE ON THE GODS.', B0, 5.0, 70, 70, 58, 1),
    ...at(three('BRAHMA GAVE HER A BOON:', 'NOTHING COULD KILL HER. EXCEPT', 'A SON OF SHIVA AND VISHNU.', C0, 5.4, 66, 60, 62), 2, BUB - .2, D0),
    ...two('SHE TOOK HEAVEN.', 'INDRA LOST HIS THRONE.', D0, 4.0, 84, 72, 0),
    ...three('LATER, THE OCEAN WAS CHURNED.', 'VISHNU BECAME MOHINI', 'TO WIN THE AMRIT BACK FROM THE ASURAS.', E0, 5.0, 62, 80, 50, 1),
    ...R_F, small('KERALA\'S BHOOTHANATHOPAKHYANAM · CH. 2', R_F),
    ...at(two('THEY WAITED, EYES SHUT.', 'THE DEVAS GOT ALL THE AMRIT.', G0, 4.0, 72, 62), 1, SERVE, H0),
    ...three('SHIVA HEARD ABOUT MOHINI', 'AND ASKED VISHNU:', '"SHOW ME THAT FORM."', H0, 4.6, 64, 70, 86),
    ...R_I, small('THE BHAGAVATA (8.12) TELLS THE GARDEN AND THE BALL TOO', R_I, 28),
    ...at(two('SHE RAN. SHIVA RAN AFTER HER.', 'AND WHEN HE CAUGHT HER...', J0, 4.4, 62, 72), 1, CATCH - .4, K0),
    ...R_K, small('SON OF HARI AND HARA · KANDA PURANAM (TAMIL)', R_K, 30, .5),
    ...at(at(three('SHIVA HUGGED HIM.', 'VISHNU LEFT THE MOHINI FORM', 'AND HUGGED HIM TOO.', L0, 5.4, 78, 62, 74, 2), 1, MPOOF - .2, M0), 2, HOP, M0),
    ...at(three('AND THEN PARVATI AND LAKSHMI', 'BOTH FED HIM MILK.', 'LOVED BY ALL FOUR.', M0, 5.4, 60, 78, 84, 2), 2, ALL4, N0),
    ...two('BRAHMA GAVE HIM', 'A THOUSAND NAMES.', N0, 4.2, 80, 84, 1),
    ...at(three('TO DEFEAT MAHISHI, HE FIRST HAD', 'TO SERVE A HUMAN FOR 12 YEARS.', 'SO SHIVA TIED A GOLD BELL AT HIS THROAT', O0, 6.0, 60, 62, 50, 2), 2, TIE - .5, P0),
    ...R_P, small('NEXT: THE KING WHO FOUND HIM', R_P, 34, .2),
    ...R_Q, small('COMMENT BELOW · SWAMIYE SHARANAM AYYAPPA', R_Q, 36),
  ];
  // the series marks: the part pill and the source line show in the opening only, then fade out
  const MARKS = C0 + 3.6;
  const caps = t => {
    for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color });
    if (t < MARKS && t > B0) { ayPill(1, (1 - seg(t, MARKS - .3, MARKS)) * clamp((t - B0) * 4)); aySource('BHOOTHANATHOPAKHYANAM · KANDA PURANAM', t - B0 - .3, MARKS - B0 - .3); }
  };

  // ================= A · the hook: little Ayyappa rings his bell =================
  function shotHook(t, lt, dur) {
    const r = t - RING, g = t - GIG;
    camBegin(540, 1200, 1.0 + .006 * lt);
    warmBack(t, 'wbA', 540, 1380);
    glow(540, 1420, 420, '#FFE9A8', .5);
    const flick = r > -.5 && r < .5;
    ayyappa(540, 1740, 44, { ...AY, pose: 'sit', eyes: g > 0 ? 'happy' : r > -.5 ? 'look' : 'normal', lookY: r > -.5 && g < 0 ? .9 : 0, mouth: g > 0 ? 'giggle' : 'smile', blush: .5,
      htilt: .05 * Math.sin(t * 2.2), bellSwing: bellSw(t, [RING]), dy: hop(g, .35, 9, 1.8), ...(flick ? BELLHAND : {}) });
    const [bx, by] = bkChest(540, 1740, 44, { pose: 'sit' });
    ting(bx, by + 60, t, RING, 'tgA', 90);
    hearts(540, 1120, t, GIG + .3, 'hA', 3, 22);
    camEnd();
    caps(t);
    wipeOut(lt, dur, PEAKW);
  }

  // ================= B · Mahishi's tapas on the Vindhya (ch. 1) =================
  function shotTapas(t, lt, dur) {
    const b = t - BRAHMA;
    camBegin(540, 1300 - lt * 4, 1.0 + .01 * lt);
    a1Peak(t, 'pkB');
    // the wind of her tapas
    for (let i = 0; i < 5; i++) { const q = frac(t * .6 + i / 5); boilSeed('wdB' + i); inkLine([[300 + i * 120 - q * 200, 1640 - q * 260], [360 + i * 120 - q * 200, 1620 - q * 280], [420 + i * 120 - q * 200, 1640 - q * 260]], 1.2, '#FFE6C8', 'inkfine', .6); }
    if (b > 0) { glow(250, 1240, 300, '#FFF2C0', .5 * clamp(b * 3)); poof(250, 1260, 120, b / .7, 'pfB'); brahma(250, 1360 - 30 * (1 - popk(t, BRAHMA, 3)), 9.5, { boilKey: 'brB', bless: clamp(b * 2), eyes: 'normal', mouth: 'smile', lookX: .6 }); }
    mahishi(560, 1712, 21, { ...MH, pray: 1, handL: [-.5, -12.8], handR: [.5, -12.8], eyes: b > .3 ? 'wide' : 'closed', mouth: b > .3 ? 'O' : 'flat', shake: b > 0 ? 0 : .25, hx: b > .3 ? -.4 : 0, lookX: b > .3 ? -.8 : 0 });
    camEnd();
    caps(t);
    wipeIn(lt, PEAKW);
  }

  // ================= C · the boon: nothing could kill her, except a son of Shiva and Vishnu =================
  function shotBoon(t, lt, dur) {
    const s = t - BUB, l = t - LAUGH;
    camBegin(540, 1290, 1.14 + .006 * lt);
    a1Peak(t, 'pkB');
    brahma(250, 1360, 9.5, { boilKey: 'brB', bless: 1, eyes: 'normal', mouth: talk(t, C0 + .2, C0 + 1.6), lookX: .6 });
    const bk = popk(t, BUB, 4) * (1 - seg(t, D0 - .5, D0 - .2));
    a1Bubble(450, 1150, 290, 170, bk, 'bbC', 590, 1270);
    if (bk > .8) {
      a1Moon(350, 1150, 32, 'mnC'); letter('+', 412, 1154, 46, A1.ink, { ink: false, rot: 0 }); a1Chakra(478, 1150, 32, t, 'ckC');
      letter('= ?', 548, 1154, 44, A1.ink, { ink: false, rot: 0 });
    }
    mahishi(640, 1712, 21, { ...MH, eyes: l > 0 ? 'happy' : s > 0 ? 'normal' : 'wide', mouth: l > 0 ? 'laugh' : s > 0 ? 'smirk' : 'O', hx: -.3, lookX: s > 0 && l < 0 ? .4 : -.6, lookY: s > 0 && l < 0 ? -.6 : 0,
      handL: l > 0 ? [-4.2, -11] : [-4.9, -10.2], handR: l > 0 ? [4.4, -11] : [4.9, -10.2], dy: l > 0 ? -.3 * Math.abs(Math.sin(l * 14)) : 0 });
    camEnd();
    caps(t);
    wipeOut(lt, dur, HVW);
  }

  // ================= D · she takes heaven; Indra loses his throne =================
  function shotHeaven(t, lt, dur) {
    const f = t - FLEE;
    camBegin(540, 1250, 1.0 + .006 * lt);
    a1Heaven(t, 'hvD');
    a1Throne(540, 1700, 330, 'thD');
    for (let i = 0; i < 4; i++) {
      const t0 = BUFF + i * .35, k = popk(t, t0, 5); if (k <= 0) continue;
      const x = [190, 890, 100, 980][i], y = [1830, 1830, 1720, 1720][i];
      poof(x, y - 60, 110, (t - t0) / .5, 'pfD' + i);
      mahishBuffalo(x, y, 9 * k, { boilKey: 'bfD' + i, flip: i % 2 === 1, snort: .5 + .5 * Math.sin(t * 4 + i), eyes: 'angry', run: t * 2 + i, stride: .2 });
    }
    mahishi(540, 1735, 19, { ...MH, eyes: 'happy', mouth: 'laugh', handL: [-4.2, -11], handR: [4.4, -11], dy: -.2 * Math.abs(Math.sin(t * 9)) });
    // Indra, on a little cloud, slipping away
    const ix = f > 0 ? 840 + easeIn(clamp(f / 1.4)) * 600 : 840, iy = 1220 + Math.sin(t * 3) * 6;
    cloudPuff(ix, iy + 30, 80, 'cpD', 255, '#FFFFFF', '#E6D6C0');
    indra(ix, iy, 13, { boilKey: 'inD', eyes: 'wide', mouth: f > 0 ? 'O' : 'frown', sweat: 1, lookX: -.8, brows: 1 });
    if (f > -1.2 && f < .4) emote('!', ix - 20, iy - 170, 26, popk(t, FLEE - 1.2, 6), f + 1.2);
    camEnd();
    caps(t);
    wipeIn(lt, HVW);
    wipeOut(lt, dur, SHW);
  }

  // ================= E · the churning: Vishnu becomes Mohini (ch. 2) =================
  const asuraRow = (t, o = {}) => {
    const ey = o.shut ? 'closed' : o.heart ? 'heart' : 'normal', mo = o.shut ? 'grin' : 'O';
    asura(300, 1640, 11, { boilKey: 'asE2', kind: 'dhumra', eyes: ey, mouth: mo, lookX: .6, hx: .3, dy: o.shut ? .1 * Math.sin(t * 9) : 0 });
    asura(130, 1790, 13, { boilKey: 'asE0', kind: 'chanda', eyes: o.peek ? ['closed', 'wide'] : ey, mouth: o.peek ? 'O' : mo, lookX: .7, hx: .3, sweat: o.shut ? .6 : 0, emote: o.peek ? '?' : null, emoteK: o.peekK || 0, emoteAge: t });
    asura(410, 1840, 13, { boilKey: 'asE1', kind: 'munda', eyes: ey, mouth: mo, lookX: .5, hx: .25, sweat: o.shut ? .6 : 0 });
  };
  function shotMohini(t, lt, dur) {
    const m = t - MPOP;
    camBegin(540, 1290, 1.0 + .006 * lt);
    a1Shore(t, 'shE');
    asuraRow(t, { heart: m > .6 });
    if (m < .2) { a1Pot(760, 1730, 110, 'potE0', .8); }
    poof(760, 1500, 220, m / .7, 'pfE', ['#FFF6D8', '#FFE38A']);
    if (m > .15) {
      const k = popk(t, MPOP + .15, 5);
      const mo = { ...MO, eyes: m > 1.6 ? 'wink' : 'happy', mouth: 'smile', glowK: .6, handR: [3.3, -13.6], bendR: -1, hx: -.2, lookX: -.5, sq: (1 - k) * .3 };
      mohini(760, 1760, 25 * (.6 + .4 * k), mo);
      const [px, py] = parvatiHand(760, 1760, 25 * (.6 + .4 * k), mo, 1);
      a1Pot(px, py + 50, 90, 'potE', .7);
    }
    hearts(270, 1310, t, MPOP + .7, 'hE', 3, 18);
    camEnd();
    caps(t);
    wipeIn(lt, SHW);
  }

  // ================= F · "close your eyes; the one who opens them last marries me" =================
  function shotTest(t, lt, dur) {
    const s = t - SHUT;
    camBegin(540, 1290, 1.0 + .006 * lt);
    a1Shore(t, 'shE');
    asuraRow(t, { heart: s < 0, shut: s > 0 });
    const mo = { ...MO, eyes: s > 0 ? 'wink' : 'happy', mouth: talk(t, F0 + .3, SHUT - .2), glowK: .5, handR: [3.3, -13.6], bendR: -1, handL: s > 0 ? [-1.6, -17.8] : [-4.2, -19 + Math.sin(t * 5) * .5], bendL: 1, hx: -.25, lookX: -.6 };
    mohini(760, 1760, 25, mo);
    const [px, py] = parvatiHand(760, 1760, 25, mo, 1);
    a1Pot(px, py + 50, 90, 'potE', .7);
    if (s > 0 && s < 1) emote('!', 300, 1330, 26, popk(t, SHUT, 6), s);
    camEnd();
    caps(t);
    wipeOut(lt, dur, SHW);
  }

  // ================= G · they wait, eyes shut; the devas get all the amrit =================
  function shotServe(t, lt, dur) {
    const v = t - SERVE, p = t - PEEKA, w = clamp((t - G0 - .2) / 1.0);
    camBegin(540, 1290, 1.0 + .006 * lt);
    a1Shore(t, 'shG');
    asuraRow(t, { shut: true, peek: p > 0, peekK: popk(t, PEEKA, 6) });
    // the devas, young again
    surya(870, 1830, 12, { boilKey: 'suG', eyes: v > .4 ? 'happy' : 'normal', mouth: v > .4 ? 'grin' : 'smile', lookX: -.6, halo: .8 });
    cloudPuff(740, 1660, 80, 'cpG', 255, '#FFFFFF', '#E6D6C0');
    indra(740, 1630, 13, { boilKey: 'inG', eyes: v > .2 ? 'happy' : 'wide', mouth: v > .2 ? 'smile' : 'O', lookX: -.6 });
    if (v > .2) sparkleBurst(740, 1500, 130, (v - .2) * .8, 'spG0', 8);
    if (v > .9) sparkleBurst(870, 1600, 130, (v - .9) * .8, 'spG1', 8);
    // Mohini tiptoes across with the pot and pours
    const mx = lerp(470, 560, w), pour = v > 0;
    const mo = { ...MO, walk: w < 1 ? t * 2.2 : undefined, eyes: 'happy', mouth: 'grin', glowK: .4, hx: .4, lookX: .7, handR: pour ? [4.6, -15] : [3.3, -13.6], bendR: -1, handL: [-1.4, -17.8], bendL: 1, dy: w < 1 ? -.15 * Math.abs(Math.sin(t * 9)) : 0 };
    mohini(mx, 1760, 23, mo);
    const [px, py] = parvatiHand(mx, 1760, 23, mo, 1);
    push(); translate(px, py + 30); rotate(pour ? -.7 : 0); translate(-px, -(py + 30)); a1Pot(px, py + 70, 80, 'potG', .6); pop();
    if (pour) { boilSeed('amG'); for (let i = 0; i < 6; i++) { const q = frac(t * 1.6 + i / 6); paint(ellPts(px + 50 + q * 50, py + 10 + q * 120, 7, 9, 8), { wash: '#FFF2B0', ink: null }); } glow(px + 80, py + 80, 90, '#FFF2B0', .5); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, VKW);
  }

  // ================= H · Shiva asks Vishnu: "show me that form" (ch. 3) =================
  function shotAsk(t, lt, dur) {
    const v = t - VANISH;
    camBegin(540, 1270, 1.0 + .006 * lt);
    a1Vaikuntha(t, 'vkH');
    if (v < .1) { shesha(790, 1560, 26, { boilKey: 'shsH', sway: .05 * Math.sin(t * 1.4), eyes: 'normal' }); vishnu(790, 1560, 26, { boilKey: 'vsH', eyes: t > VANISH - 1.0 ? 'happy' : 'normal', wink: t > VANISH - 1.0, mouth: 'smile', lookX: -.6, chakraSpin: t * 2 }); }
    poof(790, 1440, 260, v / .7, 'pfH', ['#FFFFFF', '#FFF2C8']);
    const so = { ...SH, eyes: v > .2 ? 'wide' : 'happy', mouth: v > .2 ? 'O' : talk(t, H0 + .3, H0 + 2.6), hx: .35, lookX: .7, trishul: 1, handR: v < .2 && t < H0 + 2.8 ? [5.4, -17 + Math.sin(t * 4) * .6] : undefined, bendR: -1, emote: v > .2 ? '?' : null, emoteK: popk(t, VANISH + .2, 6), emoteAge: v };
    shivaStand(300, 1790, 21, so);
    camEnd();
    caps(t);
    wipeIn(lt, VKW);
    wipeOut(lt, dur, GDW);
  }

  // ================= I · the garden: under a champak tree, Mohini plays with a ruby ball (ch. 3; Bhagavata 8.12.18) =================
  const ballY = (t, base) => base - 210 * Math.abs(Math.sin(t * 3.1));
  function shotGarden(t, lt, dur) {
    const s = t - SEE, w = clamp((t - I0 - .4) / 1.8);
    camBegin(540, 1290, 1.0 + .004 * lt);
    a1Garden(t, 'gdI');
    const mo = { ...MO, eyes: s > .8 ? 'happy' : 'normal', mouth: 'smile', lookY: -.6, handR: [3.6, -21 + 2 * Math.abs(Math.sin(t * 3.1))], bendR: -1, hx: s > .8 ? -.3 : .1, lookX: s > .8 ? -.6 : .2, blush: s > .8 ? .6 : .3 };
    mohini(720, 1760, 24, mo);
    const [px, py] = parvatiHand(720, 1760, 24, mo, 1);
    a1Ball(px + 6, ballY(t, py - 50), 36, 'blI', t * 3);
    const sx = lerp(-80, 250, ease(w));
    shivaStand(sx, 1800, 21, { ...SH, walk: w < 1 ? t * 2.2 : undefined, eyes: s > 0 ? 'heart' : 'normal', mouth: s > 0 ? 'O' : 'smile', hx: .4, lookX: .8, trishul: 1, blush: s > 0 ? .7 : 0, emote: s > 0 ? 'hearts' : null, emoteK: popk(t, SEE, 5), emoteAge: s });
    camEnd();
    caps(t);
    wipeIn(lt, GDW);
  }

  // ================= J · she runs, he runs after her; he catches her =================
  function shotChase(t, lt, dur) {
    const c = t - CATCH, run = clamp((t - J0) / (CATCH - J0));
    camBegin(lerp(500, 720, ease(run)), 1290, 1.0);
    a1Garden(t, 'gdI', 1020);
    const mx = lerp(620, 900, ease(run)), sx = lerp(60, 760, easeIn(run));
    const mo = { ...MO, walk: c < 0 ? t * 3 : undefined, eyes: 'happy', mouth: c > 0 ? "O" : "laugh", hx: c > 0 ? -.4 : -.5, lookX: -.8, blush: .7, handL: c > 0 ? [-4.6, -13] : undefined, bendL: 1,
      dy: c < 0 ? -.2 * Math.abs(Math.sin(t * 10)) : 0, lean: c < 0 ? .6 : 0 };
    mohini(mx, 1760, 24, mo);
    const bx = 1000 + run * 120, by = 1790 - 60 * Math.abs(Math.sin(t * 6)) * (1 - run * .7);
    a1Ball(bx, by, 30, 'blJ', t * 6);
    shivaStand(sx, 1800, 21, { ...SH, walk: c < 0 ? t * 3.2 : undefined, eyes: 'heart', mouth: 'grin', hx: .4, lookX: .8, trishul: 1, blush: .7, lean: c < 0 ? 1 : 0,
      handR: c > -.4 ? [6.4, -13] : undefined, bendR: -1 });
    if (c > 0) { sparkleBurst(mx - 120, 1460, 260, c * .5, 'spJ', 12, ['#FFFFFF', GOLDC]); glow(mx - 120, 1460, 600 * clamp(c * 2), '#FFF6D8', .9 * clamp(c * 2)); }
    camEnd();
    if (c > 0) flash(clamp((c - .9) / .8), '#FFF8EA');
    caps(t);
  }

  // ================= K · a child of light: Harihara-putra (ch. 3; Kanda Puranam) =================
  function shotBirth(t, lt, dur) {
    const o = t - OPEN, k = clamp((t - K0) / 1.6);
    camBegin(540, 1280, 1.0 + .008 * lt);
    a1Light(t, 'ltK', 1, 540, 1360);
    flash(1 - clamp((t - K0) / .6), '#FFF8EA');
    shivaStand(170, 1800, 15, { ...SH, boilKey: 'shvK', eyes: o > 0 ? 'happy' : 'wide', mouth: o > 0 ? 'grin' : 'O', hx: .5, lookX: .8, trishul: 1 });
    mohini(910, 1760, 16, { ...MO, boilKey: 'mohK', eyes: o > 0 ? 'happy' : 'wide', mouth: o > 0 ? 'smile' : 'O', hx: -.5, lookX: -.8, glowK: .3 });
    glow(540, 1430, 360, '#FFFFFF', .8);
    orb(540, 1400, 80 * (1 - k * .6), '#FFF2C0', t, 'obK');
    const kk = easeOut(k);
    if (kk > .05) ayyappa(540, 1700, 40 * (.4 + .6 * kk), { ...AY, bell: false, pose: 'sit', glowK: .8, eyes: o > 0 ? 'happy' : 'closed', mouth: o > 0 ? 'grin' : 'smile', blush: .5, dy: -1.2 * (1 - kk) + hop(o, .3, 8, 2), sq: (1 - kk) * .2 });
    if (o > 0) sparkleBurst(540, 1300, 300, o * .5, 'spK', 12, ['#FFFFFF', GOLDC]);
    hearts(540, 1250, t, OPEN + .4, 'hK', 3, 22);
    camEnd();
    caps(t);
    wipeOut(lt, dur, LTW);
  }

  // ================= L · Shiva hugs him; Vishnu leaves the Mohini form and hugs him too =================
  function shotHugs(t, lt, dur) {
    const m = t - MPOOF, h = t - HOP, hk = clamp(h / .55);
    camBegin(540, 1290, 1.0 + .006 * lt);
    a1Vaikuntha(t, 'vkL');
    // Vishnu on a cloud (after the poof); Mohini before it
    const VX = 790, VY = 1640;
    if (m < .15) mohini(VX, 1780, 21, { ...MO, boilKey: 'mohL', eyes: 'happy', mouth: 'smile', hx: -.4, lookX: -.7, glowK: .4 });
    poof(VX, 1500, 230, m / .7, 'pfL', ['#FFFFFF', '#FFF2C8']);
    if (m > .15) { cloudPuff(VX, VY + 50, 170, 'cpL', 255, '#FFFFFF', '#D6E2F2'); vishnu(VX, VY, 32, { boilKey: 'vsL', eyes: 'happy', mouth: h > .5 ? 'open' : 'smile', lookX: -.6, chakraSpin: t * 2, handL: hk >= 1 ? [-2.2, -2.6] : undefined, handR: hk >= 1 ? [2.2, -2.6] : undefined, lotus: hk < 1 }); }
    // Shiva holds him up
    const so = { ...SH, eyes: 'happy', mouth: 'grin', hx: .2, lookX: .3, handL: h < 0 ? [-2.6, -17.4] : [-3.4, -12], handR: h < 0 ? [2.6, -17.4] : [5.2, -14], bendL: 1, bendR: -1, snake: true };
    shivaStand(300, 1800, 21, so);
    const [cx0, cy0] = naradaLocal(300, 1800, 21, so, 0, -16.2);
    const p0 = [cx0, cy0 + 110], p1 = [VX, VY + 74];
    const [ax, ay] = h < 0 ? p0 : arcPt(p0, p1, 260, ease(hk));
    ayyappa(ax, ay, 14, { ...AY, bell: false, pose: 'sit', noShadow: true, eyes: 'happy', mouth: h > 0 && hk < 1 ? 'open' : 'giggle', blush: .6, glowK: .4, handL: hk > 0 && hk < 1 ? [-3.6, -11.5] : undefined, handR: hk > 0 && hk < 1 ? [3.6, -11.5] : undefined, dy: hk >= 1 ? hop(h - .55, .25, 9, 2) : 0 });
    hearts(300, 1200, t, L0 + .6, 'hL0', 3, 18);
    hearts(VX, 1260, t, HOP + .7, 'hL1', 3, 18);
    camEnd();
    caps(t);
    wipeIn(lt, LTW);
    wipeOut(lt, dur, PEACH);
  }

  // ================= M · Parvati and Lakshmi both feed him milk =================
  function shotMilk(t, lt, dur) {
    const g = t - M0, l = t - LKS, a = t - ALL4;
    camBegin(540, 1290, 1.0 + .006 * lt);
    warmBack(t, 'wbM', 540, 1380);
    const pin = easeOut(clamp(g / .9)), lin = easeOut(clamp((g - .4) / .9));
    const drinkP = g > 1.0 && l < 0, drinkL = l > .2 && a < .4;
    const po = { boilKey: 'prvM', eyes: 'happy', mouth: 'smile', hx: .4, lookX: .7, handR: drinkP ? [4.6, -12.6] : [3.4, -12.4], bendR: -1, lean: drinkP ? .5 : 0 };
    const px = lerp(-80, 250, pin);
    parvati(px, 1790, 20, po);
    const [pbx, pby] = parvatiHand(px, 1790, 20, po, 1);
    a1Bowl(pbx + 10, pby - 6, 34, 'bwP', drinkP ? 1 - clamp((g - 1.0) / .7) : 1);
    const lo = { boilKey: 'lksM', coins: 0, kalash: false, eyes: 'happy', mouth: 'smile', hx: -.4, lookX: -.7, flip: true, handR: drinkL ? [4.6, -12.6] : [3.4, -12.4], bendR: -1, lean: drinkL ? .5 : 0, glowK: .4 };
    const lx = lerp(1160, 830, lin);
    lakshmi(lx, 1790, 20, lo);
    const [lbx, lby] = parvatiHand(lx, 1790, 20, { ...lo, handR: lo.handR }, 1);
    a1Bowl(lbx - 10, lby - 6, 34, 'bwL', drinkL ? 1 - clamp((l - .2) / .7) : 1);
    const ao = { ...AY, bell: false, pose: 'sit', eyes: drinkP || drinkL ? 'closed' : 'happy', mouth: drinkP || drinkL ? 'puff' : a > 0 ? 'giggle' : 'smile', blush: .6, hx: drinkP ? -.4 : drinkL ? .4 : 0,
      dy: hop(a, .3, 9, 1.6), nod: drinkP || drinkL ? .3 * Math.sin(t * 10) : 0 };
    ayyappa(540, 1760, 30, ao);
    if (g > 1.6) { const [mx, my] = bkMouth(540, 1760, 30, ao); a1Milk(mx, my - 8, 26 + (l > .9 ? 8 : 0), 'mkM'); }
    if (a > 0) {   // all four
      for (const [x, y, i] of [[180, 1060, 0], [380, 990, 1], [700, 990, 2], [900, 1060, 3]]) { const k = popk(t, ALL4 + i * .15, 5); boilSeed('h4' + i); paint(heartPts(x, y + Math.sin(t * 3 + i) * 8, 30 * k), { wash: '#F2557A', ink: HSK.ink, sw: .9 }); }
    }
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, LTW);
  }

  // ================= N · Brahma gives him a thousand names (ch. 3) =================
  function shotNames(t, lt, dur) {
    const g = t - N0;
    camBegin(540, 1290, 1.0 + .006 * lt);
    a1Light(t, 'ltN', .6, 540, 1300);
    brahma(220, 1500, 9, { boilKey: 'brN', bless: 1, eyes: 'happy', mouth: talk(t, N0 + .4, N0 + 3), lookX: .6 });
    ayyappa(640, 1780, 30, { ...AY, bell: false, pose: 'sit', eyes: 'happy', mouth: 'grin', blush: .5, hx: -.2, lookX: -.4, dy: hop(g - 1, .2, 9, 2) });
    const N = [['BHUTANATHA', 470, 1010], ['DHARMA SHASTA', 760, 1100], ['ARYATATA', 480, 1220], ['HARIHARA-PUTRA', 800, 1260], ['+ 996 MORE', 600, 1350]];
    N.forEach(([txt, x, y], i) => a1Badge(txt, x + Math.sin(t * 1.4 + i) * 6, y + Math.cos(t * 1.2 + i) * 6, i === 4 ? 34 : 42, (t - N0 - .8 - i * .45) * 3, i === 4 ? HSK.teal : HSK.orange, 'bN' + i));
    camEnd();
    caps(t);
    wipeIn(lt, LTW);
    wipeOut(lt, dur, KSW);
  }

  // ================= O · Shiva ties a gold bell at his throat (ch. 4) =================
  function shotBell(t, lt, dur) {
    const b = t - TIE;
    camBegin(560, 1330 - lt * 2, 1.1 + .008 * lt);
    a1Kailash(t, 'ksO');
    const so = { ...SH, bow: .45, eyes: 'happy', mouth: 'smile', hx: .5, lookX: .8, lookY: .4, handL: b < .3 ? [3.4, -11.6] : [-3.4, -10.8], handR: b < .3 ? [6.4, -11.4] : [5.6, -10.8], bendL: -1, bendR: -1, snake: true };
    shivaStand(330, 1810, 22, so);
    const ao = { ...AY, bell: b > 0, pose: 'stand', eyes: b > .4 ? 'happy' : 'normal', mouth: b > .4 ? 'grin' : 'smile', lookX: b > .4 && b < 1.4 ? 0 : -.6, lookY: b > .4 && b < 1.4 ? 1 : -.5, hx: -.3, blush: .5, bellSwing: bellSw(t, [TIE, TIE + 1.4]),
      ...(b > 1.2 && b < 2.0 ? BELLHAND : {}), dy: hop(b - 1.6, .3, 9, 1.8) };
    ayyappa(690, 1800, 24, ao);
    const [bx, by] = bkChest(690, 1800, 24, ao);
    ting(bx, by + 40, t, TIE, 'tgO0', 80); ting(bx, by + 40, t, TIE + 1.4, 'tgO1', 80);
    hearts(690, 1300, t, TIE + 1.8, 'hO', 3, 18);
    camEnd();
    caps(t);
    wipeIn(lt, KSW);
    wipeOut(lt, dur, PMW);
  }

  // ================= P · he goes down to the Pampa (ch. 4) =================
  function shotPampa(t, lt, dur) {
    const d = clamp((t - P0 - .2) / (LAND - P0 - .2)), l = t - LAND;
    camBegin(540, 1330, 1.0 + .006 * lt);
    a1Pampa(t, 'pmP');
    const y = lerp(820, 1760, ease(d));
    glow(540, y - 150, 260, '#FFF2C0', .7);
    if (l > 0) sparkleBurst(540, 1640, 200, l * .6, 'spP', 10, ['#FFFFFF', GOLDC]);
    ayyappa(540, y, 24, { ...AY, pose: 'sit', noShadow: l < 0, glowK: .6, eyes: l > .4 ? 'happy' : 'closed', mouth: l > .4 ? 'grin' : 'smile', blush: .5, bellSwing: bellSw(t, [LAND + .5]), dy: hop(l, .3, 8, 2),
      ...(l > .4 && l < 1.1 ? BELLHAND : {}) });
    ting(540, 1560, t, LAND + .5, 'tgP', 70);
    camEnd();
    caps(t);
    wipeOut(lt, dur, PEACH);
  }

  // ================= Q · the ask (the hook's picture, now with his names) =================
  function shotAsk2(t, lt, dur) {
    const g = t - Q0;
    camBegin(540, 1200, 1.0 + .006 * lt);
    warmBack(t, 'wbQ', 540, 1380);
    glow(540, 1420, 420, '#FFE9A8', .5);
    const rings = [Q0 + .9, Q0 + 2.6];
    const wave = g > 1.6 && g < 2.4;
    ayyappa(540, 1740, 40, { ...AY, pose: 'sit', eyes: 'happy', mouth: 'grin', blush: .5, htilt: .05 * Math.sin(t * 2.2), bellSwing: bellSw(t, rings),
      ...(rings.some(r => t > r - .3 && t < r + .4) ? BELLHAND : {}), handL: wave ? [-3.8, -12 + Math.sin(t * 14) * .6] : undefined, bendL: 1, dy: hop(g - 2.6, .3, 9, 1.8) });
    const [bx, by] = bkChest(540, 1740, 40, { pose: 'sit' });
    for (const r of rings) ting(bx, by + 50, t, r, 'tgQ' + r, 80);
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
  }

  function shotCard(t, lt, dur) { hsCard(t, CARDC); }

  shots([[0, shotHook], [B0, shotTapas], [C0, shotBoon], [D0, shotHeaven], [E0, shotMohini], [F0, shotTest], [G0, shotServe], [H0, shotAsk], [I0, shotGarden], [J0, shotChase],
    [K0, shotBirth], [L0, shotHugs], [M0, shotMilk], [N0, shotNames], [O0, shotBell], [P0, shotPampa], [Q0, shotAsk2], [CARD, shotCard]]);
})();
