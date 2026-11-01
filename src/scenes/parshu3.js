// parshu3.js: "His father ordered PARSHURAMA to KILL HIS MOTHER" (ad 70, Parshurama series Part 3, ~87 s, Bangers
// captions, SFX, no voice). Mahabharata 3.116.1-18 (Vana Parva, Akritavrana to Yudhishthira): Jamadagni and Renuka have
// five sons, Rama the youngest; while the sons are out gathering fruit, Renuka goes to bathe, sees King Chitraratha of
// Martikavata playing in the water with his wife, a lotus garland on him, and longs for him; she comes home shaken and
// wet; Jamadagni sees her radiance gone and cries "dhik!"; he orders each son to kill her; the four elder stand dumb and
// he curses them into the dullness of beasts and birds; Rama comes last: "Kill your mother, son, and do not grieve"; he
// takes the axe and does it (off screen: a lamp goes out); the sage's anger is gone: "you did a hard thing at my word:
// ask for boons"; Rama asks for his mother's life, her forgetting, his brothers' minds (and no sin on him, no equal in
// battle, a long life); all granted. A fast cold open (cuts of 0.7-2.8 s, like Part 1), then Part 2's slow pace:
// two-line captions ≥ 3.5 s, quotes ≥ 4.5 s, picture alone between them. Violence never on screen.
// STORYBOARD.md has the plan and the sources; sets and props are in parshu3_props.js (and parshu1/2_props.js). All
// times are video time (t); tools/parshu3_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/parshu3_sfx.mjs)
  const B0 = 3.4, C0 = 4.8, D0 = 7.6;
  const E0 = 10.2, WALK = 13.6;
  const F0 = 15.2, G0 = 20.6;
  const H0 = 25.6, OPEN = 27.4, DHIK = 30.4;
  const I0 = 34.0, J0 = 39.4, CURSE = 40.6;
  const K0 = 45.0, FATHER = 47.2, REACT = 49.6;
  const L0 = 51.6, LAMP = 55.1, M0 = 59.0;
  const N0 = 64.2, B1 = 65.0, B2 = 67.6, B3 = 70.2;
  const O0 = 73.8, P0 = 79.0, CARD = 83.4;
  const CARDC = { cap: CARD + .1, covers: CARD + .3, line: CARD + 1.0, logo: CARD + 1.3, pill: CARD + 1.6, bio: CARD + 1.9, follow: CARD + 2.2 };

  const GOLDC = '#F5C542', CREAM = '#FFF5E2', REDC = '#FF6A4A', VIOC = '#C9A2FF';
  const pop = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const talk = (t, a, b, rest = 'flat', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const shake = (t, t0, d, a) => (t > t0 && t < t0 + d) ? shakeXY(t, a * (1 - (t - t0) / d)) : [0, 0];
  const cutFlash = (lt, col = '#FFFFFF', d = .12, a = .6) => { if (lt < d) flash(a * (1 - lt / d), col); };
  const GOLD = [GOLDC, '#F39A2E'], BLOOD = [P3.blood, P3.bloodMid], NIGHT = [P3.night, '#2A2E5A'];

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['HIS FATHER ORDERED', 470, -1, B0 + 1, 84], ['PARSHURAMA', 580, -1, B0 + 1, 124, GOLDC], ['TO KILL HIS MOTHER.', 695, -1, B0 + 1, 88, REDC],
    ['4 SONS REFUSED.', 470, C0 + .15, D0 - C0 - .2, 104],
    ['ONE DIDN\'T.', 470, D0 + .2, E0 - D0 - .4, 130, GOLDC],
    ['SAGE JAMADAGNI AND RENUKA', 470, E0 + .4, 4.6, 66, GOLDC], ['HAD 5 SONS. RAMA WAS THE YOUNGEST.', 570, E0 + .6, 4.4, 56],
    ['ONE DAY AT THE RIVER, SHE SAW', 470, F0 + .4, 4.8, 64], ['A KING PLAYING IN THE WATER.', 570, F0 + .6, 4.6, 66, GOLDC],
    ['FOR ONE MOMENT,', 470, G0 + .4, 4.4, 90], ['HER HEART WANDERED.', 585, G0 + .6, 4.2, 90, GOLDC],
    ['SHE CAME HOME, SHAKING.', 470, H0 + .3, 4.2, 74], ['THE SAGE SAW IT IN HER FACE.', 570, OPEN + .2, 2.6, 66, GOLDC],
    ['"DHIK!"', 520, DHIK + .05, I0 - DHIK - .3, 200, REDC], ['(SHAME!)', 680, DHIK + .5, I0 - DHIK - .75, 72],
    ['HE ORDERED EACH SON:', 470, I0 + .4, 4.7, 78], ['"KILL YOUR MOTHER."', 580, I0 + .8, 4.3, 92, REDC],
    ['THEY STOOD SILENT.', 470, J0 + .3, 5.0, 84], ['HIS CURSE TOOK THEIR MINDS.', 575, CURSE + .6, K0 - CURSE - .9, 70, VIOC],
    ['"KILL YOUR MOTHER, SON.', 470, FATHER + .1, L0 - FATHER - .2, 80, REDC], ['AND DO NOT GRIEVE."', 580, FATHER + .5, L0 - FATHER - .6, 88],
    ['HE OBEYED.', 900, LAMP + .6, M0 - LAMP - .9, 120, CREAM],
    ['"WHAT YOU DID WAS HARD, SON.', 470, M0 + .4, 4.6, 70], ['ASK FOR ANY BOON."', 575, M0 + .7, 4.3, 92, GOLDC],
    ['RAMA ASKED:', 460, N0 + .3, O0 - N0 - .5, 86, GOLDC], ['1. BRING MY MOTHER BACK.', 565, B1, O0 - B1 - .2, 68],
    ['2. LET HER NEVER REMEMBER IT.', 655, B2, O0 - B2 - .2, 62], ['3. HEAL MY BROTHERS.', 745, B3, O0 - B3 - .2, 68],
    ['SHE WOKE UP SMILING…', 470, O0 + .4, 4.6, 80], ['SHE NEVER KNEW.', 580, O0 + 1.4, 3.6, 104, GOLDC],
    ['4 SONS REFUSED. 1 OBEYED.', 470, P0 + .2, CARD - P0 - .2, 76], ['WHO WAS RIGHT?', 575, P0 + .5, CARD - P0 - .5, 104, GOLDC], ['COMMENT BELOW', 690, P0 + 1.0, CARD - P0 - 1.0, 70],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // Rama: young (clean-shaven), his right hand on screen left (flip: 1)
  const RAMA = { flip: 1, beard: false, quiver: false, boilKey: 'rama', seed: 7 };
  const rama = (x, y, u, o = {}) => parshurama(x, y, u, { ...RAMA, ...o });

  // ================= A · the hook =================
  function shotHook(t, lt, dur) {
    camBegin(540, 960 - lt * 10, 1 + .02 * lt);
    bloodGround(t, 540, 1150);
    const tr = Math.sin(t * 31) * .04;   // the hand that holds the axe trembles
    rama(540, 2290, 52, { axe: 'hold', axeA: tr, axeGlow: .25, eyes: 'wide', lookX: 0, lookY: .15, brow: .9, mouth: 'frown', sweat: true, wind: .4, dy: tr * .5 });
    camEnd();
    caps(t);
    if (lt > dur - .1) flash(.7, '#FFFFFF');
  }

  // ================= B · the order (a flash of it) =================
  function shotOrder(t, lt, dur) {
    const sh = shake(t, B0, .5, 12);
    camBegin(540 + sh[0], 1150 + sh[1], 1.05 + .04 * lt);
    bloodGround(t, 540, 900);
    glow(540, 700, 700, P3.redDk, .6);
    const o = { boilKey: 'jamb', seed: 5, eyes: 'angry', brow: -1, mouth: 'open', lookX: -.8, hx: -.3, handL: [-10.5, -17.6], bendL: .15 };
    jamadagni(560, 2080, 44, o);
    const [hx, hy] = naradaHead(560, 2080, 44, o);
    eyeBlaze(hx, hy + .3 * 44, 44, .8, P3.red, 'bblaze');
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .14, .8);
  }

  // ================= C · four sons refuse: whip-pans from one to the next =================
  function shotRefuse(t, lt, dur) {
    const i = Math.min(3, Math.floor(lt / .7)), l = lt - i * .7;
    camBegin(540, 1200, 1.08);
    bloodGround(t, 540, 1000);
    // each turns his face away and shakes his head
    const no = Math.sin(clamp(l / .55) * Math.PI * 3) * .7;
    brother(i, 540, 2010, 36, { eyes: 'closed', brow: .8, mouth: 'frown', hx: no, htilt: .05 * no, wind: .2 });
    camEnd();
    whipStreaks(l < .08 ? 1 - l / .08 : l > .62 ? (l - .62) / .08 : 0);
    caps(t);
  }

  // ================= D · one didn't =================
  function shotOne(t, lt, dur) {
    const hb = Math.max(0, Math.sin((t - D0) * 2 * Math.PI * 1.1)) ** 8;   // heartbeat pulse
    camBegin(540, 1180, 1.25 + .05 * lt);
    bloodGround(t, 540, 1100);
    glow(540, 1150, 500, '#FF4A2A', .25 + .2 * hb);
    const opened = t > D0 + .7;
    rama(540, 2060, 40, { axe: 'hold', axeGlow: .3 + .5 * hb, eyes: opened ? 'look' : 'closed', lookX: 0, lookY: 0, brow: -.7, mouth: 'flat', wind: .5 });
    camEnd();
    whipStreaks(lt < .08 ? 1 - lt / .08 : 0);
    caps(t);
    if (lt > dur - .4) { flushLetters(); iris(540, 1150, lerp(1700, 0, easeIn((lt - dur + .4) / .4)), '#0A0408'); }
  }

  // ================= E · the family =================
  function shotFamily(t, lt, dur) {
    camBegin(545, 1380 - lt * 6, 1.15 + .01 * lt);
    ashramSet(t, 'day');
    jamadagni(175, 1640, 16, { boilKey: 'jame', seed: 5, sit: 1, mudra: 1, eyes: 'closed', mouth: 'smile' });
    renuka(320, 1650, 17, { boilKey: 'rene', seed: 9, eyes: blinkAt(t, 12.4) ? 'closed' : 'happy', mouth: 'smile', pray: .5 });
    // five sons in a row, the youngest (Rama, no beard) last; then they set off to gather fruit (3.116.5)
    const go = ease(seg(t, WALK, WALK + 1.6));
    for (let i = 0; i < 5; i++) {
      const x = 500 + i * 108 + go * 620, y = 1660, u = 13.5 - i * .35, w = t > WALK ? t * 8 + i : 0;
      if (i < 4) brother(i, x, y, u, { walk: w, eyes: 'happy', mouth: 'smile', lookX: go > 0 ? 1 : 0, noShadow: false });
      else rama(x, y, u, { axe: 'shoulder', walk: w, eyes: 'happy', mouth: 'smile', lookX: go > 0 ? 1 : -.4 });
    }
    if (t < WALK && t > E0 + 1.2) { const k = pop(t, E0 + 1.2); boilSeed('erama'); glow(932, 1480, 130 * k, '#FFE6A0', .5); }
    if (t < WALK) nameTag('RAMA', 932, 1715, pop(t, E0 + 1.6), 'etag');
    camEnd();
    caps(t);
    if (lt < .45) { flushLetters(); iris(540, 1300, lerp(0, 1700, easeOut(lt / .45)), '#0A0408'); }
  }

  // ================= F/G · the river; her heart wandered =================
  function riverFigures(t) {
    const sp = Math.sin(t * 3.1);
    chitraratha(720, 1430, 11, { boilKey: 'citra', seed: 31, eyes: 'happy', mouth: 'grin', handR: [5.5, -22 + sp * 2], bendR: .4, handL: [-4, -14], hx: .3 });
    lotusGarland(720, 1430 - 16.4 * 11, 4.6 * 11, 'citrag');
    citraQueen(850, 1440, 10.5, { boilKey: 'cq', seed: 33, eyes: 'happy', mouth: 'open', handL: [-5, -21 - sp * 2], bendL: .4, lookX: -1 });
    boilSeed('fsplash');
    for (let i = 0; i < 9; i++) { const a = frac(t * 1.2 + i / 9), x = 690 + i * 22, y = 1340 - Math.sin(a * Math.PI) * 120; paint(ellPts(x + a * 40, y, 7 * (1 - a) + 2, 7 * (1 - a) + 2, 6), { wash: P3.waterLt, ink: null }); }
    glow(780, 1220, 220, '#FFE6A0', .35);   // the king's gold catches the sun
  }
  function shotRiver(t, lt, dur) {
    camBegin(600, 1420, 1.22 + .02 * lt);
    riverSet(t, () => riverFigures(t), { waistY: 1340, bankY: 1590 });
    renuka(330, 1960, 25, { boilKey: 'renf', seed: 9, eyes: 'normal', lookX: 1, lookY: .1, hx: .5, mouth: 'smile', handL: [-4.6, -11], bendL: .6, armL: (u, sw) => waterPot(u, sw, .9) });
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, ['#8CC8EA', '#E8F4F2']); }
  }
  function shotGaze(t, lt, dur) {
    camBegin(560, 1150, 1 + .03 * lt);
    boilSeed('gbg'); paint(rectPts(-200, -300, W + 400, H + 600), { wash: '#7EB8D8', ink: null });
    for (let i = 0; i < 9; i++) { boilSeed('bokeh' + i); glow(100 + hash(i * 4.3) * 900, 500 + hash(i * 2.2) * 900, 70 + 60 * hash(i), i % 3 ? '#FFF2C8' : '#FFD27A', .35 + .15 * Math.sin(t * 1.3 + i)); }
    const k = seg(t, G0 + .3, G0 + 2.5);
    renuka(560, 2300, 46, { boilKey: 'reng', seed: 9, eyes: 'look', lookX: .8, lookY: -.05, hx: .25, mouth: 'smile', blush: .35 * k, eyeStars: .7 * k });
    camEnd();
    caps(t);
    cutFlash(lt, '#FFF6DA', .2, .3);
    if (lt > dur - .5) grade('dusk', (lt - dur + .5) / .5 * 1.6);
  }

  // ================= H · she comes home; the sage sees; "DHIK!" =================
  function shotReturn(t, lt, dur) {
    camBegin(560, 1420, 1.2 + .015 * lt);
    ashramSet(t, 'dusk'); grade('dusk', .6);
    const opened = t > OPEN, wk = ease(seg(t, H0, H0 + 1.8)), tr = Math.sin(t * 40) * .05;
    const gk = 1 - ease(seg(t, OPEN + .3, OPEN + 1.6));
    jamadagni(280, 1660, 17, { boilKey: 'jamh', seed: 5, sit: 1, mudra: opened ? 0 : 1, eyes: opened ? 'look' : 'closed', lookX: 1, brow: opened ? -1 : 0, mouth: 'flat' });
    if (opened) { const [hx, hy] = naradaHead(280, 1660, 17, { sit: 1 }); eyeBlaze(hx + 3, hy + 6, 17, .5 * ease(seg(t, OPEN, OPEN + .5)), '#FF9A5A', 'hblaze'); }
    const rx = lerp(1180, 760, wk);
    glow(rx, 1660 - 12 * 19, 220, '#FFE0A0', .55 * gk);   // her radiance, going (3.116.9)
    renuka(rx, 1660, 19, { boilKey: 'renh', seed: 9, walk: wk < 1 ? t * 6 : 0, eyes: 'sad', lookX: -.3, lookY: .8, mouth: 'frown', dx: tr, handL: [-4.6, -11], bendL: .6, armL: (u, sw) => waterPot(u, sw, .9) });
    drips(rx, 1660 - 10 * 19, 6 * 19, 1660, t, 'hdrip', 8);
    grade('dusk', .25);
    if (opened) eyeBlaze(...naradaHead(280, 1660, 17, { sit: 1 }), 17, .35 * ease(seg(t, OPEN, OPEN + .5)), '#FF9A5A', 'hblaze2');
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, NIGHT); }
  }
  function shotDhik(t, lt, dur) {
    const sh = shake(t, DHIK, .8, 22);
    camBegin(540 + sh[0], 1150 + sh[1], 1.12 - .04 * easeOut(clamp(lt / .4)));
    bloodGround(t, 540, 800);
    glow(540, 800, 900, '#FF3A1A', .45);
    const o = { boilKey: 'jamd', seed: 5, eyes: 'angry', brow: -1, mouth: lt < 1.3 ? 'roar' : 'open', lookX: 0, lookY: .2 };
    jamadagni(540, 2330, 48, o);
    const [hx, hy] = naradaHead(540, 2330, 48, o);
    eyeBlaze(hx, hy + .3 * 48, 48, 1, P3.red, 'dblaze');
    if (lt < 1.2) shockRing(540, hy, 200 + lt * 1300, 1 - lt / 1.2, 'dring', '#FFB08A', .45);
    camEnd();
    caps(t);
    if (lt < .2) flash(.9 * (1 - lt / .2), '#FFE8D8');
  }

  // ================= I/J · each son is ordered; they stand silent; the curse =================
  const BX = [560, 700, 840, 980];
  function shotSons(t, lt, dur) {
    const cursing = t > CURSE, a = (t - CURSE) / 1.4;
    camBegin(540, 960, 1);
    ashramSet(t, cursing ? 'violet' : 'dusk'); grade(cursing ? 'violet' : 'dusk', .5);
    const jo = { boilKey: 'jams', seed: 5, eyes: 'angry', brow: -1, mouth: talk(t, I0 + .3, I0 + 2.2, 'frown', 'open'), lookX: 1, handR: [10, -17], bendR: .1 };
    jamadagni(230, 1700, 21, jo);
    if (cursing) { const [hx, hy] = naradaHead(230, 1700, 21, jo); eyeBlaze(hx, hy + 6, 21, 1 - .5 * clamp(a - 1), P3.violet, 'jblaze'); curseWave(hx, hy + 300, clamp(a), 'jcurse'); }
    // the four elder sons, frozen; then dazed, slumped, blank-eyed (3.116.12)
    BX.forEach((x, i) => {
      const hit = clamp((t - CURSE - .35 - i * .12) * 2.5), sl = ease(hit), turn = Math.sin(t * .9 + i * 1.3);
      const o = hit > 0
        ? { eyes: 'blank', mouth: 'wobble', brow: .4, bow: .35 * sl, dy: .9 * sl, hx: .25 * turn, htilt: .12 * turn, handR: [3.4, -7.4], handL: [-3.2, -7.6], bendR: -.2, bendL: -.2 }
        : { eyes: 'wide', mouth: 'flat', brow: .9, lookX: -1, sweat: t > I0 + 1.6 + i * .3, dy: -.06 * Math.sin(t * 30 + i) };
      brother(i, x, 1720 + (i % 2) * 18, 15, o);
      dazed(x, 1720 + (i % 2) * 18, 15, { flip: 1, ...o }, sl, 'dz' + i);
      if (t < CURSE + .1) nameTag(BROS[i].name, x, 1790 + (i % 2) * 18 + (i % 2 ? 50 : 0), pop(t, I0 + 2.4 + i * .25), 'tag' + i);
    });
    grade(cursing ? 'violet' : 'dusk', .35);
    camEnd();
    caps(t);
    if (lt < .25) flash(.5 * (1 - lt / .25), '#FFD8C8');
    if (cursing && a < .3) flash(.6 * (1 - a / .3), '#E6D2FF');
  }

  // ================= K · Rama comes home; the order; his face =================
  function shotRamaHome(t, lt, dur) {
    camBegin(540, 1250, 1.02 + .01 * lt);
    sunsetRidge(t, { top: 1660 });
    const wk = ease(seg(t, K0, K0 + 1.4)), stop = t > K0 + 1.4;
    rama(lerp(-80, 420, wk), 1690, 20, { axe: 'shoulder', walk: wk < 1 ? t * 7 : 0, eyes: stop ? 'wide' : 'normal', lookX: stop ? 1 : 1, brow: stop ? .8 : 0, mouth: stop ? 'O' : 'smile', wind: .5 });
    // his brothers, dazed, at the edge of the frame
    for (let i = 0; i < 2; i++) { const bo = { eyes: 'blank', mouth: 'wobble', bow: .35, dy: .9, hx: .3 * Math.sin(t + i), handR: [3.4, -7.4], handL: [-3.2, -7.6] }; brother(i + 2, 860 + i * 150, 1700, 15, bo); dazed(860 + i * 150, 1700, 15, { flip: 1, ...bo }, 1, 'kdz' + i); }
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [P3.sunset, '#F28A3A']); }
  }
  function shotFather(t, lt, dur) {
    camBegin(560, 1100, 1.15 + .05 * lt);
    bloodGround(t, 600, 800);
    glow(600, 760, 800, '#FF5A1A', .4);
    const o = { boilKey: 'jamf', seed: 5, eyes: 'angry', brow: -1, mouth: talk(t, FATHER + .1, FATHER + 2.0, 'flat', 'open'), lookX: -.8, lookY: .2, hx: -.3 };
    jamadagni(620, 2120, 46, o);
    const [hx, hy] = naradaHead(620, 2120, 46, o);
    eyeBlaze(hx, hy + .3 * 46, 46, .7, P3.red, 'fblaze');
    camEnd();
    caps(t);
    cutFlash(lt);
  }
  function shotReact(t, lt, dur) {
    camBegin(520, 1120, 1.2 + .06 * lt);
    sunsetRidge(t, { top: 2100, sunX: 200 });
    const fall = ease(seg(t, REACT + .3, REACT + 1.2));
    rama(520, 2160, 46, { axe: 'shoulder', eyes: fall > .5 ? 'teary' : 'wide', lookX: .6, lookY: fall * .3, brow: .9, mouth: fall > .5 ? 'frown' : 'O', hx: .2 * fall, wind: .6 });
    if (fall > .9) { const [hx, hy] = naradaHead(520, 2160, 46, {}); tears(hx - 30, hy + 30, t - REACT - 1.2, 'rtear', .8); }
    camEnd();
    caps(t);
    cutFlash(lt);
  }

  // ================= L · he obeyed (off screen: the lamp goes out) =================
  const SIL = { ...silPal(PSR), white: '#1C0E16', iris: '#1C0E16' };
  function shotObey(t, lt, dur) {
    if (t < LAMP) {
      // against the sun, a silhouette slowly lifting the axe; a heartbeat slowing
      camBegin(540, 1300 - lt * 15, 1.0 + .03 * lt);
      sunsetRidge(t, { top: 1640 });
      glow(540, 1180, 700, '#FF5A2A', .3);
      const up = ease(seg(t, L0 + .6, L0 + 2.8));
      rama(540, 1660, 24, { axe: up > .5 ? 'raise' : 'shoulder', axeA: up > .5 ? -.3 * (1 - up) : 0, pal: SIL, col: '#1C0E16', dk: '#1C0E16', lt: '#1C0E16', tilak: false, eyes: 'closed', mouth: 'flat', wind: .7, noShadow: true });
      camEnd();
      caps(t);
      if (lt < .2) flash(.5 * (1 - lt / .2), '#FFD8B0');
      if (t > LAMP - .5) { flushLetters(); paint(rectPts(-100, -100, W + 200, H + 200), { wash: '#06030A', washOp: 255 * easeIn((t - LAMP + .5) / .5), ink: null }); }
      return;
    }
    // the ashram's lamp, close; the flame goes out; black
    camBegin(540, 1180, 1);
    boilSeed('lbg'); paint(rectPts(-200, -300, W + 400, H + 600), { wash: '#06030A', ink: null });
    const a = t - LAMP;
    diya(470, 1280, 120, a < .08 ? 1 - a / .08 : 0, 'llamp');
    wick(470 + 120 * .95, 1280 - 120 * .8, 26, a, 'lwick');
    camEnd();
    caps(t);
    if (lt > dur - .4) { flushLetters(); paint(rectPts(-100, -100, W + 200, H + 200), { wash: '#06030A', washOp: 255 * (lt - dur + .4) / .4, ink: null }); }
  }

  // ================= M · the anger is gone; "ask for any boon" =================
  function shotBoon(t, lt, dur) {
    camBegin(540, 1220, 1.06 + .02 * lt);
    ashramSet(t, 'night');
    glow(420, 1250, 500, '#FFE6B0', .25 * ease(clamp(lt / 1.5)));
    const o = { boilKey: 'jamm', seed: 5, eyes: lt < 1 ? 'closed' : 'normal', brow: .2, mouth: talk(t, M0 + .4, M0 + 2.6, 'smile', 'o'), lookX: .8, lookY: .3, handR: [6.4, -14.6], bendR: .8 };
    jamadagni(420, 1700, 24, o);
    rama(800, 1700, 16, { sit: 1, pray: 1, bow: .5, eyes: 'closed', mouth: 'frown', axe: false, lookX: -1, noShadow: true });
    grade('night', .25);
    camEnd();
    caps(t);
    if (lt < .6) { flushLetters(); paint(rectPts(-100, -100, W + 200, H + 200), { wash: '#06030A', washOp: 255 * (1 - lt / .6), ink: null }); }
  }

  // ================= N · the boons: the lamp lights again; she rises; the brothers wake =================
  function shotBoons(t, lt, dur) {
    camBegin(540, 1280, 1.0 + .01 * lt);
    ashramSet(t, 'night');
    const lit = ease(seg(t, B1 + .4, B1 + 1.0)), rise = ease(seg(t, B1 + .9, B1 + 2.6)), woke = clamp((t - B3 - .4) * 2);
    // the lamp at the hut's door, and its gold light spreading
    if (lit > 0) glow(560, 1560, 900 * lit, '#FFD27A', .45 * lit);
    diya(640, 1700, 34, lit, 'nlamp');
    // she comes back out of the light: first a glow, then her form, eyes closed
    if (rise > 0) { glow(560, 1700 - 12 * 19, 300 * rise, '#FFF0C8', .7 * rise); renuka(560, 1700, 19, { boilKey: 'renn', seed: 9, eyes: 'closed', mouth: 'smile', pray: 0, dy: (1 - rise) * 2 }); }
    if (rise > 0 && rise < 1) { flushLetters(); sparkleBurst(560, 1500, 200, (t - B1 - .9) / 1.7 * .8, 'nsp', 12); }
    // the four brothers at the side, blank-eyed until the third boon
    BX.forEach((x, i) => {
      if (i > 1) return;
      const bx = 820 + i * 130, bo = woke > 0 ? { eyes: woke < .5 ? 'closed' : 'look', lookX: -1, mouth: 'O', brow: .6 } : { eyes: 'blank', mouth: 'wobble', bow: .35, dy: .9, handR: [3.4, -7.4], handL: [-3.2, -7.6] };
      brother(i, bx, 1720, 14, bo);
      dazed(bx, 1720, 14, { flip: 1, ...bo }, 1 - woke, 'ndz' + i);
      if (woke > 0 && woke < 1) sparkleBurst(bx, 1720 - 20 * 14, 70, woke * .8, 'nbs' + i, 6);
    });
    rama(230, 1740, 17, { sit: 1, pray: 1, bow: .2, eyes: rise > .5 ? 'teary' : 'closed', lookX: 1, lookY: -.3, mouth: talk(t, B1, B1 + 1.2, 'frown', 'open') === 'open' || talk(t, B2, B2 + 1.4, 'x', 'open') === 'open' || talk(t, B3, B3 + 1.1, 'x', 'open') === 'open' ? 'open' : (rise > .5 ? 'smile' : 'frown'), axe: false });
    grade('night', .35 * (1 - lit * .7));
    camEnd();
    caps(t);
  }

  // ================= O · she never knew =================
  function shotNeverKnew(t, lt, dur) {
    camBegin(600, 1250 - lt * 5, 1.25 + .015 * lt);
    ashramSet(t, 'dawn');
    glow(620, 1200, 500, '#FFE6B0', .35);
    const reach = ease(seg(t, O0 + .3, O0 + 1.3)), RX = 520, RY = 1720, RU = 20, NX = 690, NY = 1720, NU = 21;
    const ro = { sit: 1, pray: 1, bow: .25 - .2 * reach, eyes: 'teary', lookX: 1, lookY: -.5, hx: .3, mouth: 'smile', axe: false };
    const [hx, hy] = naradaHead(RX, RY, RU, { ...RAMA, ...ro });
    // her right hand (screen left) comes to rest on his head
    const target = [(hx + 10 - NX) / NU, (hy - 3.6 * RU - NY) / NU];
    renuka(NX, NY, NU, { boilKey: 'reno', seed: 9, eyes: blinkAt(t, O0 + 2.6) ? 'closed' : 'happy', mouth: 'smile', lookX: -1, lookY: .4, blush: .3,
      handR: [lerp(-3, target[0], reach), lerp(-8, target[1], reach)], bendR: .9 });
    rama(RX, RY, RU, ro);
    if (t > O0 + 1.4) { boilSeed('oheart'); emote('heart', NX + 120, NY - 26 * NU, 26, pop(t, O0 + 1.6), t - O0 - 1.6); }
    camEnd();
    caps(t);
    if (lt < .4) flash(.8 * (1 - lt / .4), '#FFF0C8');
  }

  // ================= P · the ask: four refused, one obeyed =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1200 - lt * 4, 1 + .01 * lt);
    bloodGround(t, 540, 1150);
    for (let i = 0; i < 4; i++) brother(i, 110 + i * 125, 1880 + (i % 2) * 14, 16, { eyes: 'normal', mouth: 'flat', lookX: .6, brow: .3 });
    glow(830, 1400, 480, '#FFB050', .35);
    rama(830, 1920, 26, { axe: 'hold', axeGlow: .4 + .2 * Math.sin(t * 3), eyes: blinkAt(t, 81.6) ? 'closed' : 'normal', lookX: 0, brow: -.3, mouth: 'flat', wind: .5, aura: .4 });
    boilSeed('askvs'); letter('VS', 625, 1560, 80, CREAM, { screen: false, ink: false, rot: -.05, pop: pop(t, P0 + .8) * 2 });
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, BLOOD); }
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, BLOOD); }
  }

  function shotCard(t, lt) {
    navCard(t, CARDC);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, BLOOD); }
  }

  shots([[0, shotHook], [B0, shotOrder], [C0, shotRefuse], [D0, shotOne], [E0, shotFamily], [F0, shotRiver], [G0, shotGaze],
    [H0, shotReturn], [DHIK, shotDhik], [I0, shotSons], [K0, shotRamaHome], [FATHER, shotFather], [REACT, shotReact],
    [L0, shotObey], [M0, shotBoon], [N0, shotBoons], [O0, shotNeverKnew], [P0, shotAsk], [CARD, shotCard]]);
})();
