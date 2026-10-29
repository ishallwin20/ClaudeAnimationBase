// parshu1.js: "PARSHURAMA was born a WARRIOR because of a KHEER MIX-UP" (ad 63, Parshurama series Part 1, ~73 s,
// Bangers captions, cartoon SFX, no voice). Bhagavata 9.15.4–14 (with Vishnu Purana 4.7 and MBh 12.49): King Gadhi asks
// the sage Richika for a thousand moon-white horses with one black ear; Richika gets them from Varuna and marries
// Satyavati; mother and daughter both want a son, so he prepares two charus, a brahmana's for his wife and a kshatriya's
// for her mother, and goes to bathe; the mother, sure her daughter's is better, asks for it and they swap; Richika says
// her son will be a fierce warrior; she begs, and it passes to her grandson: Jamadagni is born a sage, and his son is
// Parshurama. The mother's son is Vishvamitra (VP 4.7, MBh 12.49).
// STORYBOARD.md has the plan and the sources; sets and props are in parshu1_props.js. All times are video time (t);
// tools/parshu1_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/parshu1_sfx.mjs)
  const SWAP = 1.2, B0 = 3.6;
  const WALK0 = 3.7, FOLD = 4.7, SLY = 6.6, C0 = 8.6;
  const FINGER = 8.8, BUBBLE = 11.2, RICH = 13.4, D0 = 15.6;
  const LIFT = 15.8, HEAVE = 16.2, HORSE0 = 16.9, GJAW = 19.0, WED = 19.8, E0 = 22.0;
  const BOWLS = 25.0, VIS = 25.6, LABEL = 27.2, BATHE = 29.6, F0 = 30.6;
  const EYE = 30.8, WHISPER = 32.2, NOD = 33.0, SWAP2 = 33.5, EAT = 34.6, DOOR = 36.6, G0 = 37.6;
  const KNOW = 38.0, SCARED = 40.2, H0 = 43.0;
  const PLEA = 43.2, SIGH = 45.4, PALM = 45.8, DRIFT = 46.4, I0 = 49.2;
  const YAWN = 50.6, LAPSE = 52.4, J0 = 54.6;
  const REVEAL = 56.4, K0 = 60.6;
  const VISH = 62.6, L0 = 65.4;
  const ASK = 66.0, CARD = 69.0;
  const CARDC = { cap: CARD + .1, covers: CARD + .3, price: CARD + 1.1, logo: CARD + 1.4, pill: CARD + 1.7, follow: CARD + 2.1 };
  const HORSES = 9, HORSE_GAP = .32;

  const GOLDC = '#F5C542', CREAM = '#FFF5E2', REDC = '#FF8A5A';
  const pop = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const talk = (t, a, b, rest = 'smile', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const GOLD = [GOLDC, '#F39A2E'], PEACH = [TK.marigold, TK.petal], DUSK = [PK.dusk, PK.night], EMBER = [PK.war, '#C8323A'];
  const shake = (t, t0, d, a) => (t > t0 && t < t0 + d) ? shakeXY(t, a * (1 - (t - t0) / d)) : [0, 0];

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['PARSHURAMA', 470, -1, 4.5, 120, GOLDC], ['WAS BORN A WARRIOR', 590, -1, 4.5, 84], ['BECAUSE OF A KHEER MIX-UP!', 690, -1, 4.5, 72, GOLDC],
    ['SAGE RICHIKA ASKED', 470, 3.8, 2.7, 84], ['TO MARRY PRINCESS SATYAVATI.', 580, 3.95, 2.55, 70, GOLDC],
    ['KING GADHI SMILED…', 520, 6.6, 1.95, 92, GOLDC],
    ['"FINE. BRING ME', 470, FINGER, 4.55, 86], ['1,000 WHITE HORSES…', 585, FINGER + .15, 2.25, 92, GOLDC],
    ['…EACH WITH ONE BLACK EAR!"', 585, BUBBLE, 2.15, 78, GOLDC],
    ['THE KING WAS SURE', 470, RICH + .1, 2.1, 86], ['HE COULD NEVER DO IT.', 580, RICH + .25, 1.95, 88, GOLDC],
    ['HE GOT THEM FROM VARUNA,', 470, HORSE0 - .3, 3.0, 76], ['LORD OF THE WATERS!', 580, HORSE0 - .1, 2.8, 90, GOLDC],
    ['WEDDING: DONE!', 520, WED + .1, 2.0, 110, GOLDC],
    ['BOTH MOTHER AND DAUGHTER', 470, E0 + .2, 2.7, 74], ['WANTED A SON.', 580, E0 + .35, 2.55, 100, GOLDC],
    ['HE MADE TWO BOWLS', 470, BOWLS + .1, 2.05, 90], ['OF SACRED KHEER:', 580, BOWLS + .25, 1.9, 90, GOLDC],
    ['GOLD: A WISE SAGE, FOR HIS WIFE.', 470, LABEL, 2.9, 62, GOLDC], ['RED: A WARRIOR, FOR HER MOTHER.', 570, LABEL + .3, 2.6, 62, REDC],
    ['HER MOTHER THOUGHT:', 470, EYE, 3.2, 84], ['"HIS WIFE\'S BOWL MUST BE BETTER!"', 575, EYE + .3, 2.9, 62, GOLDC],
    ['SO THEY SWAPPED.', 520, SWAP2 + .4, 2.3, 104, GOLDC],
    ['"WHAT HAVE YOU DONE?"', 520, KNOW + .1, 2.1, 96, GOLDC],
    ['"YOUR SON WILL BE', 470, SCARED, 2.8, 90], ['A FIERCE WARRIOR!"', 585, SCARED + .15, 2.65, 100, REDC],
    ['"NOT MY SON, PLEASE!"', 520, PLEA, 2.2, 92, GOLDC],
    ['"THEN…', 470, SIGH + .2, 3.4, 96], ['YOUR GRANDSON."', 585, SIGH + .6, 3.0, 110, REDC],
    ['HER SON, JAMADAGNI,', 470, I0 + .2, 3.0, 84, GOLDC], ['WAS BORN A CALM SAGE.', 580, I0 + .35, 2.85, 84],
    ['YEARS LATER…', 900, LAPSE + .1, 2.0, 116, CREAM],
    ['AND HIS SON…', 520, J0 + .2, 2.0, 100],
    ['PARSHURAMA', 470, REVEAL, 4.1, 132, GOLDC], ["A BRAHMIN WITH A WARRIOR'S FIRE.", 590, REVEAL + 1.2, 2.9, 60, REDC],
    ["AND THE QUEEN'S SON?", 520, K0 + .2, 2.2, 92],
    ['VISHVAMITRA:', 470, VISH, 2.75, 112, GOLDC], ['THE KING WHO BECAME A SAGE.', 590, VISH + .2, 2.55, 70],
    ['ONE BOWL SWAPPED.', 470, L0 + .1, 3.5, 86], ['TWO LEGENDS.', 580, L0 + .35, 3.25, 104, GOLDC],
    ['COMMENT "JAI PARSHURAM"', 1430, ASK, 3.0, 70, GOLDC],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // the two bowls' looks: gold = the sage's charu (his wife's), red = the warrior's (her mother's)
  const SAGEB = { glow: '#FFD86A' }, WARB = { glow: '#FF6A3A' };

  // ================= A · the hook: the two bowls, swapped =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1100 - lt * 8, 1 + .025 * lt);
    boilSeed('hookbg');
    paint(rectPts(-200, -300, W + 400, H + 600), { wash: PR.peach, ink: null });
    paint(ellPts(540, 1260, 620, 480, 30), { fill: PR.peachLt, fillOp: 170, bleed: .3, tex: .4, ink: null });
    boilSeed('hookshadow');
    for (const x of [300, 780]) paint(ellPts(x, 1402, 210, 30, 16), { wash: PR.peachDk, washOp: 160, ink: null });
    const k = ease(seg(t, SWAP, SWAP + .7));
    const g = arcPt([300, 1400], [780, 1400], 200, k), r = arcPt([780, 1400], [300, 1400], -70, k);
    kheerBowl(r[0], r[1], 380, { ...WARB, key: 'hr', steam: t > 2.4 ? 1 : .6, gk: .8 + .2 * Math.sin(t * 5) });
    kheerBowl(g[0], g[1], 380, { ...SAGEB, key: 'hg', steam: .6, tilt: Math.sin(k * Math.PI) * -.15 });
    if (k > 0 && k < 1) { boilSeed('hookswish'); for (let i = 0; i < 4; i++) inkLine([[540 - 120 + i * 60, 1250 - i * 20], [540 + 60 * i, 1180 - i * 20]], 2, CREAM, 'inkfine', 0); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, GOLD);
  }

  // ================= B · the court: Richika asks for Satyavati =================
  const THX = 520, THY = 1470, THS = 470;
  const gadhiAt = (t, o = {}) => { throne(THX, THY, THS, 'throne'); return gadhi(THX, THY - THS * .08, 21, { sit: 1, boilKey: 'gadhi', seed: 11, ...o }); };
  function shotCourt(t, lt, dur) {
    camBegin(540, 1180, .96);
    court(t);
    const sly = t > SLY;
    gadhiAt(t, { eyes: sly ? 'smug' : (blinkAt(t, 5.4) ? 'closed' : 'normal'), mouth: sly ? 'smug' : 'smile', lookX: -.8, brow: sly ? .4 : 0, hx: -.2 });
    satyavati(880, 1600, 21, { boilKey: 'satya', seed: 12, eyes: 'look', lookX: -1, mouth: 'smile', blush: t > FOLD ? .6 : 0, hx: -.3 });
    const k = ease(seg(t, WALK0, FOLD)), x = lerp(-160, 210, k), walking = t < FOLD;
    richika(x, 1610, 21, { boilKey: 'rich', seed: 13, walk: walking ? (x + 160) / 70 : 0, pray: clamp((t - FOLD) * 3), bow: t > FOLD + .3 && t < FOLD + 1.4 ? .3 : 0, eyes: 'normal', mouth: 'smile', lookX: .6 });
    camEnd();
    caps(t);
    wipeIn(lt, GOLD);
  }

  // ================= C · the bride price =================
  function shotPrice(t, lt, dur) {
    camBegin(560, 1010, 1.3 + .03 * lt);
    court(t);
    const o = { eyes: 'smug', mouth: talk(t, FINGER, BUBBLE + 1.6, 'smug', 'open'), brow: .5, lookX: -.3, handR: [3.6, -24.5], bendR: .4 };
    if (t > BUBBLE + 1.7) { o.eyes = 'happy'; o.mouth = 'smug'; }
    gadhiAt(t, o);
    // the thought bubble: one white horse with one black ear, ×1000
    if (t > BUBBLE - .1) {
      const kk = clamp((t - BUBBLE + .1) * 4), bx = 360, by = 935;
      thoughtBubble(bx, by, 370, 270, kk, 470, 1020, 'pricetb');
      if (kk > .6) {
        suryaHorse(bx - 30, by + 50, 14, { boilKey: 'tbhorse', gallop: t * .8, harness: false, mane: '#F4EEE4', coat: '#FFFFFF', coatDk: '#E4DDD2', ear: '#241C26' });
        letter('×1000', bx + 95, by - 70, 56, '#B8862A', { stroke: PK.ink, sw: .2, ink: false, pop: (t - BUBBLE - .3) * 5 });
      }
    }
    camEnd();
    caps(t);
  }
  function shotCalm(t, lt, dur) {
    camBegin(540, 1080, 1.55);
    ashram(t);
    const o = { boilKey: 'richc', seed: 13, eyes: t > RICH + .5 ? 'happy' : 'normal', mouth: 'smile', lookX: .2, bow: t > RICH + .9 && t < RICH + 1.5 ? .15 : 0 };
    richika(540, 1650, 27, o);
    camEnd();
    caps(t);
  }

  // ================= D · Varuna's horses =================
  const horsePath = (t, i) => {   // each horse runs out of the surge toward camera-left along the bank
    const k = seg(t, HORSE0 + i * HORSE_GAP, HORSE0 + i * HORSE_GAP + 2.0);
    return { k, x: lerp(700, -320, easeIn(k) * .4 + k * .6), y: lerp(1330, 1700, k), u: lerp(7, 32, easeIn(k) * .5 + k * .5) };
  };
  function shotRiver(t, lt, dur) {
    camBegin(560, 1150, 1.18);
    riverBank(t);
    // the far bank: a long line of tiny horses already trotting off to the right (there are a thousand)
    if (t > HORSE0 + .4) for (let i = 0; i < 14; i++) {
      const x = 760 + i * 46 + (t - HORSE0) * 40 - (i % 2) * 8; if (x > 1200) continue;
      suryaHorse(x, 1132, 2.6, { boilKey: 'far' + i, gallop: t * 1.4 + i * .3, harness: false, mane: '#F4EEE4', coat: '#FFFFFF', coatDk: '#E4DDD2', ear: '#241C26', noShadow: true });
    }
    waterSurge(720, 1330, 260, seg(t, HEAVE, HEAVE + 1), t, 'surge');
    const near = [];
    for (let i = 0; i < HORSES; i++) { const h = horsePath(t, i); if (h.k > 0 && h.k < 1) near.push(h); }
    near.sort((a, b) => a.y - b.y).forEach((h, j) => suryaHorse(h.x, h.y, h.u, { boilKey: 'nh' + j, gallop: t * 1.6 + j * .37, flip: 1, harness: false, mane: '#F4EEE4', coat: '#FFFFFF', coatDk: '#E4DDD2', ear: '#241C26' }));
    const up = clamp((t - LIFT) * 3);
    richika(930, 1590, 21, { boilKey: 'richr', seed: 13, eyes: t > HORSE0 ? 'happy' : 'closed', mouth: 'smile', handL: [-4.4, -24 * up - 12 * (1 - up)], handR: [4.4, -24 * up - 12 * (1 - up)], bendL: .4, bendR: .4, hx: -.4 });
    camEnd();
    caps(t);
  }
  function shotJaw(t, lt, dur) {
    const sh = shake(t, GJAW, .4, 10);
    camBegin(540 + sh[0], 1060 + sh[1], 1.9);
    court(t);
    const tk = take(t, GJAW + .05, 1.4);
    gadhiAt(t, { eyes: 'wide', mouth: 'scream', brow: 1, htilt: .1 + .05 * Math.sin(t * 30) * (lt < .4 ? 1 : 0), sq: tk.sq, dy: tk.dy, sweat: true, handR: [3.6, -21.5], handL: [-3.6, -21.5] });
    const h = naradaHead(THX, THY - THS * .08, 21, { sit: 1 });
    boilSeed('jawemote'); emote('!!', h[0] + 90, h[1] - 120, 40, pop(t, GJAW + .05, 6), t - GJAW);
    camEnd();
    caps(t);
    wipeOut(lt, dur, PEACH);
  }
  function shotWed(t, lt, dur) {
    camBegin(540, 1150, 1.05);
    court(t);
    const r = { boilKey: 'richw', seed: 13, eyes: 'happy', mouth: 'smile', pray: 1, hx: .2 };
    const s = { boilKey: 'satyw', seed: 12, eyes: 'happy', mouth: 'smile', blush: .7, pray: 1, hx: -.2 };
    richika(390, 1620, 23, r);
    satyavati(690, 1620, 23, s);
    garland(390, 1620 - 16.4 * 23, 4.6 * 23, 'g1');
    garland(690, 1620 - 16.6 * 23 * 1.0, 4.2 * 23, 'g2');
    petals(t, WED, 'wedp');
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, GOLD);
  }

  // ================= E · two wishes, two bowls =================
  function shotWish(t, lt, dur) {
    camBegin(540, 1180, 1);
    ashram(t);
    richika(250, 1650, 21, { sit: 1, mudra: 1, boilKey: 'richs', seed: 13, eyes: blinkAt(t, 23.6) ? 'closed' : 'normal', mouth: 'smile', lookX: .7, hx: .3 });
    queen(620, 1640, 21, { boilKey: 'queen', seed: 14, pray: 1, eyes: 'look', lookX: -1, mouth: 'smile', hx: -.3 });
    satyavati(860, 1640, 21, { boilKey: 'satya2', seed: 12, pray: 1, eyes: 'look', lookX: -1, mouth: 'smile', blush: .4, hx: -.3 });
    for (const [x, d] of [[620, .2], [860, .6]]) { const a = t - E0 - .6 - d; if (a > 0 && a < 1.6) { boilSeed('wishheart' + x); emote('heart', x + 80, 1640 - 27 * 21, 26, pop(t, E0 + .6 + d), a); } }
    camEnd();
    caps(t);
    wipeIn(lt, GOLD);
  }
  function shotBowls(t, lt, dur) {
    camBegin(540, 1180 - lt * 6, 1.08 + .02 * lt);
    ashram(t);
    const rising = t > BATHE ? ease(seg(t, BATHE, BATHE + .4)) : 0, walk = seg(t, BATHE + .3, F0);
    const ro = { boilKey: 'richb', seed: 13, eyes: 'closed', mouth: talk(t, BOWLS, BATHE - .2, 'smile', 'O'), hx: 0 };
    if (rising > 0) Object.assign(ro, { eyes: 'happy', mouth: 'smile', hx: .5, armR: towel, handR: [3.6, -12], walk: walk * 6 });
    if (rising < .5) richika(540, 1520, 20, { ...ro, sit: 1, mudra: 1 });
    else richika(540 + walk * 700, 1600, 20, ro);
    yagnaKund(540, 1640, 260, t, 0, 'kund');
    kheerBowl(300, 1720, 230, { ...SAGEB, key: 'bg', steam: .8, gk: .5 + .5 * seg(t, VIS, VIS + .6) });
    kheerBowl(780, 1720, 230, { ...WARB, key: 'br', steam: .8, gk: .5 + .5 * seg(t, VIS + .3, VIS + .9) });
    sageVision(300, 1600, 330, ease(seg(t, VIS, VIS + .8)) * (1 - seg(t, F0 - .4, F0)), 'sv');
    warriorVision(780, 1600, 360, ease(seg(t, VIS + .3, VIS + 1.1)) * (1 - seg(t, F0 - .4, F0)), 'wv');
    camEnd();
    caps(t);
    wipeOut(lt, dur, DUSK);
  }

  // ================= F · the swap, by lamplight =================
  const QX = 300, SX = 650, FY = 1640, FU = 22;
  function shotSwap(t, lt, dur) {
    camBegin(560, 1200, 1.05);
    kitchen(t, 1, 'kt');
    chulha(140, 1660, 220, t, 'chulha');
    // where each bowl is: in the women's hands; during the swap they arc past each other
    const sk = ease(seg(t, SWAP2, SWAP2 + .8)), eat = seg(t, EAT, EAT + .5) * (1 - seg(t, DOOR - .3, DOOR));
    const qo = { boilKey: 'queenf', seed: 14, eyes: 'look', lookX: .9, mouth: 'smile', hx: .4 };
    const so = { boilKey: 'satyaf', seed: 12, eyes: 'normal', mouth: 'smile', hx: -.2 };
    // the queen eyes her daughter's gold bowl, whispers; Satyavati hesitates, then nods
    if (t > EYE && t < WHISPER) { qo.eyes = 'smug'; qo.mouth = 'smug'; qo.lookX = 1; }
    if (t > WHISPER && t < NOD) { qo.mouth = talk(t, WHISPER, NOD - .1, 'smug', 'O'); qo.lean = .6; so.eyes = 'wide'; so.lookX = -1; so.mouth = 'O'; }
    if (t > NOD && t < SWAP2) { so.eyes = blinkAt(t, NOD + .1, .3) ? 'closed' : 'normal'; so.lookX = -1; so.mouth = 'flat'; so.dy = -.15 * Math.abs(Math.sin((t - NOD) * 10)); }
    if (t > SWAP2) { qo.eyes = 'happy'; qo.mouth = 'grin'; so.eyes = 'normal'; so.lookX = -.5; }
    if (t > DOOR) { qo.eyes = 'wide'; qo.mouth = 'O'; qo.lookX = 1; so.eyes = 'wide'; so.mouth = 'O'; so.lookX = 1; qo.sweat = so.sweat = true; }
    // hands: holding the bowls at the waist, reaching across in the swap, lifted to the mouth to eat
    const reach = Math.sin(sk * Math.PI);
    qo.handR = [lerp(2.6, 5.5, reach), lerp(-11.5, -14, reach) - eat * 6.5]; qo.bendR = .5;
    so.handL = [lerp(-2.6, -5.5, reach), lerp(-11.5, -14, reach) - eat * 6.5]; so.bendL = .5;
    queen(QX, FY, FU, qo);
    satyavati(SX, FY, FU, so);
    const qh = parvatiHand(QX, FY, FU, qo, 1), sh = parvatiHand(SX, FY, FU, so, -1);
    // the gold bowl starts with Satyavati, the red with her mother; they trade
    const gp = arcPt(sh, qh, 90, sk), rp = arcPt(qh, sh, -40, sk);
    const lvl = 1 - seg(t, EAT + .2, DOOR - .6);
    const tilt = eat * .5;
    kheerBowl(gp[0], gp[1] + 40, 150, { ...SAGEB, key: 'fg', gk: .7, level: lvl, steam: .4 * lvl, tilt: sk >= 1 ? tilt : 0 });
    kheerBowl(rp[0], rp[1] + 40, 150, { ...WARB, key: 'fr', gk: .7, level: lvl, steam: .4 * lvl, tilt: sk >= 1 ? -tilt : 0 });
    // Richika in the doorway
    if (t > DOOR) {
      const tk = take(t, DOOR, .8);
      richika(960, 1590, 19, { boilKey: 'richd', seed: 13, eyes: 'wide', mouth: 'O', lookX: -1, hx: -.4, sq: tk.sq, dy: tk.dy, armR: towel, handR: [3.6, -12] });
    }
    if (t > DOOR + .1) { const h = parvatiHand(QX, FY, FU, qo, 1); boilSeed('swapemote'); emote('!', QX + 70, FY - 28 * FU, 30, pop(t, DOOR + .1, 6), t - DOOR); emote('!', SX + 70, FY - 28 * FU, 30, pop(t, DOOR + .2, 6), t - DOOR); }
    camEnd();
    caps(t);
    wipeIn(lt, DUSK);
  }

  // ================= G · busted =================
  function shotKnow(t, lt, dur) {
    camBegin(540, 1000, 1.7);
    kitchen(t, 1, 'kt');
    const knew = t > KNOW + .2, tk = take(t, KNOW + .2, 1);
    if (knew) { boilSeed('knowring'); const a = clamp((t - KNOW - .2) / .8); shockRing(540, 860, 80 + a * 520, 1 - a, 'kr', '#FFF2C0', .9); glow(540, 900, 360, '#FFE6A0', .5 * (1 - a)); }
    const o = { boilKey: 'richk', seed: 13, eyes: knew ? 'angry' : 'look', lookY: knew ? 0 : .9, lookX: 0, brow: knew ? -1 : 0, mouth: knew ? talk(t, KNOW + .3, KNOW + 1.6, 'frown', 'open') : 'flat', sq: tk.sq, dy: tk.dy };
    richika(540, 1700, 34, o);
    kheerBowl(400, 1820, 190, { key: 'kg', level: 0, gk: 0 });
    kheerBowl(690, 1830, 190, { key: 'kr', level: 0, gk: 0, tilt: .3 });
    camEnd();
    caps(t);
  }
  function shotScared(t, lt, dur) {
    camBegin(560, 1000, 1.6);
    kitchen(t, .8, 'kt');
    const pulseK = .5 + .5 * Math.sin(t * 6);
    glow(560, 1420, 300, PK.war, .3 + .2 * pulseK);
    satyavati(560, 1720, 34, { boilKey: 'satyas', seed: 12, eyes: 'wide', mouth: 'O', brow: 1, sweat: true, lookX: .4, handL: [-1.3, -15.6], handR: [1.3, -15.6], bendL: .3, bendR: .3, dy: -.05 * Math.sin(t * 40) });
    camEnd();
    caps(t);
    wipeOut(lt, dur, GOLD);
  }

  // ================= H · the plea =================
  function shotPlea(t, lt, dur) {
    camBegin(540, 1150, 1.15);
    kitchen(t, 1, 'kt');
    const soft = t > SIGH, palm = ease(seg(t, PALM, PALM + .5));
    const so = { boilKey: 'satyap', seed: 12, pray: 1, bow: 0, eyes: soft && t > PALM + .8 ? 'happy' : 'look', lookX: 1, lookY: -.4, mouth: soft && t > PALM + .8 ? 'smile' : 'frown', brow: soft ? .2 : 1, lean: .4 };
    satyavati(330, 1660, 24, so);
    if (!(soft && t > PALM + .8)) tears(330 - 30, 1660 - 19.6 * 24 * 1.04, t - PLEA, 'pleatears', 1);
    const ro = { boilKey: 'richp', seed: 13, eyes: soft ? (t < PALM ? 'closed' : 'happy') : 'angry', brow: soft ? .3 : -.8, mouth: soft ? 'smile' : 'frown', lookX: -1, hx: -.3,
      handR: palm > 0 ? [lerp(3.4, 3.8, palm), lerp(-10.8, -20.5, palm)] : undefined, bendR: .6 };
    richika(760, 1670, 24, ro);
    // the red glow (the warrior's fire) leaves her and drifts up and off, into the future
    if (t > DRIFT) {
      const k = ease(seg(t, DRIFT, DRIFT + 2.2)), p = arcPt([330, 1340], [1260, 520], 300, k);
      boilSeed('drift'); glow(p[0], p[1], 120, PK.war, .7 * (1 - k * .4));
      paint(ellPts(p[0], p[1], 34, 34, 16), { wash: PK.warLt, washOp: 230, ink: null });
      for (let i = 1; i < 6; i++) { const q = arcPt([330, 1340], [1260, 520], 300, Math.max(0, k - i * .04)); paint(starPts(q[0], q[1], 12 - i * 1.6, .35, 4), { wash: '#FFD0A0', washOp: 220 - i * 30, ink: null }); }
    }
    camEnd();
    caps(t);
    wipeOut(lt, dur, GOLD);
  }

  // ================= I · baby Jamadagni; the years =================
  function shotBaby(t, lt, dur) {
    camBegin(540, 1440, 1.9 + .03 * lt);
    ashram(t);
    glow(540, 1420, 420, '#FFD86A', .5);
    const rock = Math.sin(t * 2.2) * .05;
    cradle(540, 1640, 420, rock, 'cradle', () => babyJamadagni(-50, -200, 66, { key: 'bj', eyes: t > YAWN + .9 ? 'open' : 'closed', yawn: t > YAWN && t < YAWN + .8 ? Math.sin(seg(t, YAWN, YAWN + .8) * Math.PI) : 0 }));
    if (t > YAWN + .9) { boilSeed('babysp'); sparkleBurst(470, 1440, 60, t - YAWN - .9, 'bjs'); }
    camEnd();
    caps(t);
    wipeIn(lt, GOLD);
    if (t > LAPSE - .3 && t < LAPSE) { flushLetters(); brushWipe((t - LAPSE + .3) / .6, GOLD); }
  }
  function shotYears(t, lt, dur) {
    camBegin(540, 960, 1);
    skyLapse(t, (t - LAPSE) * 1.6, 'yl');
    camEnd();
    caps(t);
    wipeIn(lt, GOLD);
    wipeOut(lt, dur, EMBER);
  }

  // ================= J · Parshurama =================
  const SIL = Object.fromEntries(Object.keys(PSR).map(k => [k, '#1E1022']));
  function shotParshu(t, lt, dur) {
    const lit = t > REVEAL, a = t - REVEAL, sh = shake(t, REVEAL, .5, 16);
    const c = kf(t, [[J0, [540, 1100, .95]], [REVEAL - .05, [540, 1000, 1.05]], [REVEAL + .2, [540, 830, 1.2]], [K0, [540, 800, 1.26]]], ease);
    camBegin(c[0] + sh[0], c[1] + sh[1], c[2]);
    sunsetRidge(t, { top: 1480, wind: 1 });
    const o = { flip: 1, boilKey: 'psr', seed: 5, axe: lit ? 'raise' : 'hold', axeA: lit ? -.55 : 0, axeGlow: lit ? .6 + .4 * Math.sin(t * 4) : 0, wind: .8, aura: lit ? clamp(a * 2) : 0,
      eyes: lit ? 'normal' : 'closed', brow: -.5, mouth: 'flat', lookY: -.1 };
    if (!lit) o.pal = SIL;
    else { const tk = take(t, REVEAL, 1.2); o.sq = tk.sq; o.dy = tk.dy; }
    if (!lit) glow(540, 1100, 420, '#FFB040', .45);
    parshurama(540, 1490, 27, o);
    if (lit && a < 1) { shockRing(540, 1460, 140 + a * 900, 1 - a, 'psring', '#FFE6A0', .3); }
    camEnd();
    caps(t);
    if (lit && a < .25) flash(.5 * (1 - a / .25), '#FFF0C8');
    wipeIn(lt, EMBER);
    wipeOut(lt, dur, GOLD);
  }

  // ================= K · the twist: Vishvamitra =================
  function shotVish(t, lt, dur) {
    camBegin(540, 1180, 1.1 + .02 * lt);
    sunsetRidge(t, { top: 1520, cool: .55 });
    const shown = t > VISH - .25, k = ease(seg(t, VISH - .25, VISH + .4));
    if (shown) glow(540, 1260, 440 * k, '#FFD86A', .55 * k);
    // before the name: the queen's cradle, in gold light; then the king who became a sage
    if (!shown) {
      glow(540, 1380, 360, '#FFD86A', .45);
      cradle(540, 1560, 380, Math.sin(t * 2.2) * .05, 'qcradle', () => babyJamadagni(-50, -150, 56, { key: 'bv', eyes: 'closed' }));
    } else {
      crownProp(820, 1530, 120, 'vcrown');
      vishvamitra(520, 1530, 25, { sit: 1, mudra: 1, boilKey: 'vish', seed: 21, eyes: 'closed', mouth: 'smile', sq: -.04 * (1 - k) });
      if (t - VISH < .8) poof(520, 1300, 220, (t - VISH + .25) / 1.05, 'vpoof');
    }
    camEnd();
    caps(t);
    wipeIn(lt, GOLD);
    wipeOut(lt, dur, PEACH);
  }

  // ================= L · the ask: the two bowls, the two legends =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1180, 1 + .015 * lt);
    peachGround(t, 540, 1250);
    parshurama(330, 1470, 17, { flip: 1, boilKey: 'psra', seed: 5, axe: 'shoulder', eyes: blinkAt(t, 67.4) ? 'closed' : 'normal', mouth: 'smile', aura: .5, wind: .3 });
    vishvamitra(760, 1470, 17, { sit: 1, mudra: 1, boilKey: 'visha', seed: 21, eyes: 'closed', mouth: 'smile' });
    glow(760, 1300, 260, '#FFD86A', .35);
    kheerBowl(330, 1660, 220, { ...WARB, key: 'ar', steam: .7 });
    kheerBowl(760, 1660, 220, { ...SAGEB, key: 'ag', steam: .7 });
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, PEACH);
  }

  function shotCard(t, lt) {
    pcCard(t, CARDC);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, PEACH); }
  }

  shots([[0, shotHook], [B0, shotCourt], [C0, shotPrice], [RICH, shotCalm], [D0, shotRiver], [GJAW, shotJaw], [WED, shotWed],
    [E0, shotWish], [BOWLS, shotBowls], [F0, shotSwap], [G0, shotKnow], [SCARED, shotScared], [H0, shotPlea], [I0, shotBaby],
    [LAPSE, shotYears], [J0, shotParshu], [K0, shotVish], [L0, shotAsk], [CARD, shotCard]]);
})();
