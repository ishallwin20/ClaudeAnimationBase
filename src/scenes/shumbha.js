// shumbha.js: "A DEMON KING proposed to MAA DURGA", a ~63 s captioned reel for Navratri (Part 4 of Sher): Shumbha
// and Nishumbha steal heaven, Chanda and Munda spot Maa on the Himalaya, the proposal ("Marry Shumbha… or his brother")
// and her condition ("Whoever beats me in BATTLE, I'll marry him"), then everyone who tried: Dhumralochana (HUM: ash),
// Chanda and Munda (Kali: CHAMUNDA), Raktabija, Nishumbha, and Shumbha alone ("I am ALONE. They are ALL ME."). The
// garland lands on Sher. The card sells Books 1–3. Storyboard: STORYBOARD.md. Sets and effects: shumbha_props.js. All
// times are video time (t); the SFX (tools/shumbha_sfx.mjs) uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/shumbha_sfx.mjs)
  const WHIP = 2.4, B0 = 4.6;
  const MEET = 4.75, ELE = 7.5, TRUMPET = 8.2, C0 = 10.2;
  const SPY = 10.3, POPUP = 10.6, JAW = 11.5, REPORT = 12.7, EXCEPT = 13.9, HEARTS = 14.2, D0 = 16.0;
  const PROP = 16.1, UNROLL = 16.6, CHOICE = 18.4, SNORT = 19.3, SURE = 20.7, FINGER = 21.0, COND = 22.7, MARRY = 23.7, GULP = 24.4, SNAP = 25.4, E0 = 26.6;
  const GEN = 26.7, ONE = 29.1, HUM = 30.6, ASH = 30.85, ASHCAP = 31.9, SHERRUN = 33.9, F0 = 36.2;
  const CM = 36.3, DARK = 37.2, BURST = 38.3, KLAND = 38.7, KALI = 38.9, BONK = 40.0, CHAMU = 41.0, G0 = 43.3;
  const RB = 43.3, RBPOP = 44.2, NISH = 45.4, FLING = 46.0, H0 = 47.5;
  const CHEAT = 47.6, ALONE = 50.0, MERGE = 50.5, ALLME = 51.2, BLAZE = 51.9, ONE1 = 53.0, DROP = 53.2, STRIKE = 53.6, TW = 54.6, I0 = 55.3;
  const ASK = 55.4, GARL = 55.7, WIPE = 58.5;
  const CARD = 58.8, CARD_CAP = 58.9, COVERS = 59.1, PRICE = 59.9, LOGO = 60.2, PILL = 60.5, FOLLOW = 60.9;

  const GOLDC = '#F5C542';
  const inW = (t, a, b) => t >= a && t < b;
  const talkK = (t, sp = 13, ph = 0) => .35 + .75 * Math.abs(Math.sin(t * sp + ph));
  const camK = (t, keys, sh = [0, 0]) => { const c = kf(t, keys); camBegin(c[0] + sh[0], c[1] + sh[1], c[2]); return c; };
  const wipeIn = (lt, cols = [TK.marigold, TK.peach]) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (t, t1, cols = [TK.marigold, TK.peach]) => { if (t > t1 - .3) { flushLetters(); brushWipe((t - (t1 - .3)) / .6, cols); } };
  const whipIn = (t, t0, dir = 1) => { if (t < t0 + .18) whipH(1 - seg(t, t0, t0 + .18), dir, t); };
  const whipOut = (t, t1, dir = 1) => { if (t > t1 - .15) whipH(seg(t, t1 - .15, t1), dir, t); };

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['A DEMON KING proposed', 500, -1, WHIP + .9, 66], ['to MAA DURGA.', 615, -1, WHIP + .9, 112, GOLDC],
    ['Her answer?', 500, WHIP + .1, B0 - WHIP - .2, 70], ['LEGENDARY.', 620, WHIP + .5, B0 - WHIP - .6, 124, GOLDC],
    ['Meet SHUMBHA & NISHUMBHA,', 480, MEET, ELE - MEET - .1, 62, GOLDC], ['demon brothers who STOLE heaven.', 575, MEET + .3, ELE - MEET - .4, 52],
    ["Indra's throne. Indra's ELEPHANT.", 480, ELE, C0 - ELE - .1, 54], ['The best of EVERYTHING.', 578, ELE + .6, C0 - ELE - .7, 68, GOLDC],
    ['His spies, CHANDA & MUNDA,', 480, SPY, REPORT - SPY - .1, 60, GOLDC], ['saw MAA on the Himalaya.', 575, SPY + .3, REPORT - SPY - .4, 58],
    ['"Boss, you have the best', 470, REPORT, D0 - REPORT - .1, 58], ['of EVERYTHING…"', 555, REPORT + .25, D0 - REPORT - .35, 58], ['"…except HER."', 665, EXCEPT, D0 - EXCEPT - .1, 100, GOLDC],
    ['So he sent a', 480, PROP, CHOICE - PROP - .1, 58], ['MARRIAGE PROPOSAL.', 585, PROP + .25, CHOICE - PROP - .35, 86, GOLDC],
    ['"Marry SHUMBHA…"', 480, CHOICE, SURE - CHOICE - .1, 74, GOLDC], ['"…or his BROTHER.', 580, CHOICE + .6, SURE - CHOICE - .7, 62], ['Your choice."', 670, CHOICE + 1.0, SURE - CHOICE - 1.1, 62],
    ['"Sure! One TINY condition…"', 500, SURE, COND - SURE - .1, 60],
    ['"Whoever beats me', 460, COND, E0 - COND - .3, 64], ['in BATTLE…"', 550, COND + .3, E0 - COND - .6, 78, GOLDC], ['"…I\'ll marry HIM."', 655, MARRY, E0 - MARRY - .3, 92, GOLDC],
    ['So Shumbha sent a general', 480, GEN, ONE - GEN - .1, 58], ['and 60,000 DEMONS.', 580, GEN + .3, ONE - GEN - .4, 78, GOLDC],
    ['Maa said ONE word:', 480, ONE, ASHCAP - ONE - .1, 62], ['HUM.', 625, HUM, ASHCAP - HUM - .1, 180, GOLDC],
    ['He turned to ASH.', 520, ASHCAP, SHERRUN - ASHCAP - .1, 92, GOLDC],
    ['Sher took care of', 480, SHERRUN, F0 - SHERRUN - .1, 62], ['the other 60,000.', 580, SHERRUN + .3, F0 - SHERRUN - .4, 80, GOLDC],
    ['Then came', 480, CM, KALI - CM - .1, 60], ['CHANDA & MUNDA.', 580, CM + .25, KALI - CM - .35, 84, GOLDC],
    ['Out of her forehead:', 480, KALI, CHAMU - KALI - .1, 60], ['MAA KALI.', 600, KALI + .2, CHAMU - KALI - .3, 132, GOLDC],
    ['So she was named', 480, CHAMU, G0 - CHAMU - .1, 60], ['CHAMUNDA.', 600, CHAMU + .25, G0 - CHAMU - .35, 132, GOLDC], ['(CHAnda + MUNDA)', 720, CHAMU + .8, G0 - CHAMU - .9, 54],
    ['Then RAKTABIJA…', 480, RB, NISH - RB - .1, 76, GOLDC], ['(you know THAT one)', 580, RB + .4, NISH - RB - .5, 54],
    ['Then NISHUMBHA.', 500, NISH, H0 - NISH - .1, 86, GOLDC],
    ['"You CHEAT!"', 480, CHEAT, ALONE - CHEAT - .1, 96], ['"You only win with HELP!"', 590, CHEAT + .4, ALONE - CHEAT - .5, 62],
    ['"I am ALONE', 470, ALONE, ONE1 - ALONE - .1, 74], ['in this world."', 565, ALONE + .3, ONE1 - ALONE - .4, 64], ['"They are ALL ME."', 685, ALLME, ONE1 - ALLME - .1, 100, GOLDC],
    ['One on one.', 480, ONE1, I0 - ONE1 - .1, 70], ['She WON.', 595, ONE1 + .5, I0 - ONE1 - .6, 128, GOLDC],
    ['Is your name', 470, ASK, WIPE - ASK + .1, 60], ['AMBIKA, CHANDIKA,', 565, ASK + .15, WIPE - ASK, 74, GOLDC], ['KAUSHIKI or CHAMUNDA?', 660, ASK + .3, WIPE - ASK - .1, 70, GOLDC], ['Comment it!', 770, ASK + .7, WIPE - ASK - .5, 64],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // the garland held in two hands (world points), sagging
  const heldGarland = (pL, pR, sag, r, key) => varmala(garlandPath(pL, pR, sag), r, key);
  // the garland hanging from one hand (a loop)
  const hangGarland = (p, w, h, r, key) => varmala([[p[0] - w * .1, p[1]], [p[0] - w * .5, p[1] + h * .55], [p[0] - w * .1, p[1] + h], [p[0] + w * .4, p[1] + h * .6], [p[0] + w * .15, p[1]]], r, key);

  // ================= A · the hook =================
  function shotHook(t, lt) {
    const durgaUp = t > WHIP + .09;
    camK(t, [[0, [540, 960, 1.0]], [WHIP, [540, 940, 1.04]], [WHIP + .01, [540, 960, 1.02]], [B0, [540, 940, 1.07]]]);
    roseSet(t);
    if (!durgaUp) {
      const sw = Math.sin(t * 2.2), o = { kind: 'shumbha', boilKey: 'shook', eyes: 'heart', mouth: 'smile', blush: .9, htilt: sw * .05, lean: sw * .2,
        handL: [-5.0, -18.2 + Math.sin(t * 3) * .2], handR: [5.0, -18.4 - Math.sin(t * 3) * .2], emote: 'hearts', emoteK: 1, emoteAge: t, sq: Math.sin(t * 4) * .015 };
      asura(540, 1990, 42, o);
      heldGarland(asuraHand(540, 1990, 42, o, -1), asuraHand(540, 1990, 42, o, 1), 340, 24, 'hookgarl');
    } else {
      const a = t - WHIP;
      durga(410, 2080, 40, { ...DRG_SKIN, boilKey: 'dhook', eyes: 'normal', lookX: .5, mouth: 'smile', browL: ease(seg(t, WHIP + .3, WHIP + .6)), hx: .12, handL: [-5.4, -18.6], trishulA: -.2, hair: .2, sq: spring(t, WHIP + .45, 9, 18) * .025 });
      lion(870, 1990, 32, { boilKey: 'shook', eyes: 'wide', mouth: 'O', lookX: -.6, hx: -.25, inhale: .3, take: spring(t, WHIP + .7, 9, 20) * .08, tail: Math.sin(t * 3) * .5 });
      if (a < .5) sparkleBurst(520, 1110, 70, a - .3, 'browsp', 6);
    }
    camEnd();
    if (inW(t, WHIP - .15, WHIP + .2)) whipH(1 - Math.abs(t - WHIP) / .2, 1, t);
    caps(t);
    wipeOut(t, B0);
  }

  // ================= B · stolen heaven (and C2, the spies' report) =================
  const THX = 540, THY = 1430, THS = 58, SU = 30;
  const shumbhaSeat = o => {   // Shumbha on the throne: drawn from the belt up, behind the cushion
    asura(THX, THY - .5 * THS + 9.3 * SU, SU, { kind: 'shumbha', upper: true, noShadow: true, ...o });
    boilSeed('cushion');
    paint(rrPts(THX - 3.0 * THS, THY - .9 * THS, 6 * THS, 1.3 * THS, .6 * THS), { wash: MH.red, fill: MH.redDk, fillOp: 50, tex: .5, ink: MH.ink, sw: 1.6 });
  };
  function shotHeaven(t, lt) {
    camK(t, [[B0, [540, 1180, 1.0]], [C0, [540, 1200, 1.05]]]);
    heavenSet(t);
    throne(THX, THY, THS);
    // Airavata, sulking
    const tr = inW(t, TRUMPET, TRUMPET + .8);
    const ao = { boilKey: 'aira', eyes: tr ? 'closed' : 'sad', trunk: tr ? 'up' : 'limp', ear: Math.sin(t * 1.5) * .2, earOut: 0, lookX: -.5 };
    airavata(870, 1830, 27, ao);
    if (tr) { boilSeed('tearA'); const k = seg(t, TRUMPET + .2, TRUMPET + .8); paint(ellPts(825, 1585 + k * 60, 8, 11, 8), { wash: '#BFE0F4', ink: MH.ink, sw: .6 }); }
    // Shumbha lounging on Indra's throne, the garland over his hand
    const so = { boilKey: 'sthrone', eyes: 'happy', mouth: 'smirk', lean: .5 + Math.sin(t * 1.4) * .15, hx: .15, handL: [-4.6, -11.6], handR: [5.2, -14.6 + Math.sin(t * 2) * .2], brows: .3 };
    shumbhaSeat(so);
    const gh = asuraHand(THX, THY - .5 * THS + 9.3 * SU, SU, { kind: 'shumbha', upper: true, ...so }, 1);
    hangGarland(gh, 110, 170, 12, 'thgarl');
    // Nishumbha counting gems
    const no = { kind: 'nishumbha', boilKey: 'nish', eyes: 'happy', mouth: 'grin', handL: [-1.8, -12.4], handR: [1.6, -13.0 + Math.abs(Math.sin(t * 5)) * .6], hx: -.1 };
    asura(205, 1780, 24, no);
    const gp = asuraHand(205, 1780, 24, no, 1); boilSeed('gem');
    paint([[gp[0], gp[1] - 30], [gp[0] + 18, gp[1] - 12], [gp[0], gp[1] + 6], [gp[0] - 18, gp[1] - 12]], { wash: '#4AA6E0', ink: MH.ink, sw: 1.2 });
    sparkleBurst(gp[0], gp[1] - 14, 40, frac((t - B0) / .9) * .8, 'gemsp', 4);
    camEnd();
    wipeIn(lt);
    caps(t);
    whipOut(t, C0, -1);
  }
  function shotReport(t, lt) {
    camK(t, [[REPORT, [540, 1070, 1.0]], [D0, [540, 1060, 1.03]]]);
    heavenSet(t);
    throne(THX, THY, THS);
    const love = t > HEARTS;
    shumbhaSeat({ boilKey: 'sthrone', eyes: love ? 'heart' : 'normal', mouth: love ? 'smile' : 'flat', blush: love ? ease(seg(t, HEARTS, HEARTS + .4)) : 0, lookX: love ? 0 : -.5, brows: .2,
      handL: love ? [-1.2, -13.8] : [-4.6, -11.6], handR: [5.2, -14.6], take: spring(t, HEARTS, 8, 18) * .06,
      emote: love ? 'hearts' : undefined, emoteK: backOut(seg(t, HEARTS, HEARTS + .35)), emoteAge: t - HEARTS, sq: love ? Math.sin(t * 9) * .02 : 0 });
    hangGarland(asuraHand(THX, THY - .5 * THS + 9.3 * SU, SU, { kind: 'shumbha', upper: true, handR: [5.2, -14.6] }, 1), 110, 170, 12, 'thgarl');
    // the two spies in the foreground, turned to the boss, talking
    asura(185, 1960, 22, { kind: 'chanda', boilKey: 'chr', eyes: 'happy', mouth: 'laugh', mouthK: talkK(t), hx: .5, lookX: .8, sword: false, shield: false, handL: [-4.4, -15.5 + Math.sin(t * 7) * .6], handR: [4.4, -13], noShadow: true });
    asura(900, 1960, 22, { kind: 'munda', boilKey: 'mur', eyes: t > EXCEPT ? 'wide' : 'happy', mouth: t > EXCEPT ? 'grin' : 'laugh', mouthK: talkK(t, 11, 1), hx: -.5, lookX: -.8, sword: false, shield: false, handR: t > EXCEPT ? [5.6, -19.5] : [4.6, -14], handL: [-4.2, -12.5], noShadow: true });
    camEnd();
    whipIn(t, REPORT, -1);
    caps(t);
    wipeOut(t, D0);
  }

  // ================= C · the spies on the Himalaya =================
  function shotSpies(t, lt) {
    camK(t, [[C0, [560, 1230, 1.12]], [REPORT, [560, 1250, 1.16]]]);
    himalayaSet(t, 1);
    glow(640, 1300, 420, '#FFE7A8', .6);
    durga(640, 1610, 20, { ...DRG_SKIN, boilKey: 'dhim', eyes: 'closed', mouth: 'smile', aura: .7, fire: .5, hair: .25 + Math.sin(t * 1.3) * .1, handL: [-5.4, -18.6], trishulA: -.2 });
    lion(880, 1630, 15, { boilKey: 'shim', eyes: 'happy', mouth: 'smile', tail: Math.sin(t * 2.5) * .5, hx: -.2 });
    // the spies pop up behind the rock
    const pop = (d) => (1 - backOut(seg(t, POPUP + d, POPUP + d + .35))) * 13, jaw = t > JAW;
    asura(215, 1840, 25, { kind: 'chanda', boilKey: 'chs', upper: true, noShadow: true, dy: pop(0), eyes: jaw ? 'wide' : 'normal', mouth: jaw ? 'O' : 'flat', hx: .45, lookX: .9, sword: false, shield: false, handL: [-3.8, -14.5], handR: [3.6, -14.8], take: spring(t, JAW, 8, 18) * .08 });
    asura(445, 1855, 25, { kind: 'munda', boilKey: 'mus', upper: true, noShadow: true, dy: pop(.18), eyes: jaw ? 'heart' : 'normal', mouth: jaw ? 'O' : 'flat', hx: .45, lookX: .9, sword: false, shield: false, handL: [-3.6, -14.8], handR: [3.8, -14.5], take: spring(t, JAW + .1, 8, 18) * .08 });
    boulder(320, 2060, 760, 470, 'spyrock');
    camEnd();
    caps(t);
    whipOut(t, REPORT, -1);
  }

  // ================= D · the proposal =================
  const DX = 330, DY = 1610, DU = 24, MX = 760, MY = 1630, MU = 19;
  function shotProposal(t, lt) {
    const sure = t > SURE;
    camK(t, [[D0, [540, 1120, 1.0]], [SURE, [540, 1120, 1.0]], [SURE + .4, [500, 1110, 1.03]], [GULP, [500, 1110, 1.03]], [GULP + .4, [540, 1120, 1.0]]]);
    himalayaSet(t, 1);
    glow(DX, 1300, 380, '#FFE7A8', .5);
    // Maa: serene; the finger; the sweet condition
    const dO = { ...DRG_SKIN, boilKey: 'dprop', eyes: 'normal', lookX: .7, hx: .15, mouth: 'smile', aura: .4, handL: [-5.4, -18.6], trishulA: -.2, hair: .2 };
    if (inW(t, FINGER, COND + .2)) { dO.handR = [3.8, -22.5]; dO.browL = .7; dO.eyes = 'happy'; }
    if (t > COND) { dO.eyes = t > MARRY ? 'wink' : 'normal'; dO.lookX = t > MARRY ? 0 : .7; dO.hx = 0; }
    dO.sq = spring(t, FINGER, 9, 18) * .02;
    durga(DX, DY, DU, dO);
    // Sher at the far left: side-eye at the messenger, then snorting with laughter, then a grin at us
    const lo = { boilKey: 'sprop', eyes: 'side', mouth: 'smirk', lookX: 1, hx: .2, tail: Math.sin(t * 2.5) * .5 };
    if (inW(t, SNORT, SURE)) { lo.eyes = 'squeeze'; lo.mouth = 'grin'; lo.pawR = [.8, -10.4]; lo.pawShapeR = 'pad'; lo.dy = -Math.abs(Math.sin(t * 16)) * .25; lo.hx = 0; }
    if (t > MARRY) { lo.eyes = 'happy'; lo.mouth = 'grin'; lo.lookX = 0; lo.hx = 0; }
    lion(105, 1700, 18, lo);
    // the messenger and his scroll
    const run = seg(t, SNAP + .45, E0), gulp = t > GULP;
    const mo = { kind: 'messenger', boilKey: 'mess', eyes: gulp ? 'wide' : t > CHOICE ? 'happy' : 'normal', mouth: gulp ? 'wobble' : 'smile', hx: -.5, lookX: -.8,
      handL: [-2.4, -13.6], handR: [2.4, -13.6], sweat: gulp ? frac(t * 1.5) : 0, shake: inW(t, GULP, SNAP) ? 1 : 0, dx: easeIn(run) * 30, walk: run > 0 ? t * 3 : undefined };
    if (t > SNAP + .2) { mo.eyes = 'swirl'; mo.mouth = 'O'; mo.handL = [-4.5, -19]; mo.handR = [4.5, -19]; }
    if (t < SNAP + .45 || run < 1) asura(MX, MY, MU, mo);
    if (t < SNAP + .2) {
      const hL = asuraHand(MX, MY, MU, mo, -1), hR = asuraHand(MX, MY, MU, mo, 1), p0 = [(hL[0] + hR[0]) / 2, (hL[1] + hR[1]) / 2 + 8];
      const k = t < SNAP ? easeOut(seg(t, UNROLL, UNROLL + 1.1)) : 1 - easeIn(seg(t, SNAP, SNAP + .2));
      propScroll(p0, [1060, 2400], 170, k, 'scroll');
    }
    const mh = asuraHead(MX, MY, MU, mo);
    impact(mh[0], mh[1] - 30, t - (SNAP + .2), 60, 'bonk');
    camEnd();
    wipeIn(lt);
    caps(t);
    wipeOut(t, E0, [MH.red, TK.marigold]);
  }

  // ================= E · Dhumralochana: HUM =================
  const EDX = 250, EDY = 1680, EDU = 21, GX = 790, GY = 1690, GU = 20;
  function shotHum(t, lt) {
    const dO = { ...DRG_SKIN, boilKey: 'dhum', eyes: 'normal', lookX: .8, hx: .15, mouth: 'smile', handL: [-5.4, -18.6], trishulA: -.2, hair: .3, fire: .6 };
    const hd = durgaHead(EDX, EDY, EDU, dO);
    const push = t < HUM ? ease(seg(t, ONE, ONE + 1.2)) : 1 - easeOut(seg(t, HUM + .05, HUM + .25));
    const sh = shakeXY(t, 14 * Math.max(0, 1 - Math.abs(t - HUM - .05) / .25));
    camBegin(lerp(540, hd[0], push) + sh[0], lerp(1200, hd[1] + 60, push) + sh[1], lerp(1, 2.4, push));
    battleSet(t, {});
    const flee = ease(seg(t, SHERRUN + .3, SHERRUN + 1.8)), laughing = t < ASH;
    army(t, { laugh: laughing, flee });
    // Maa: a breath in, eyes closed; HUM; then calm
    if (inW(t, ONE + .3, HUM - .15)) { dO.eyes = 'closed'; dO.mouth = 'flat'; dO.lookX = 0; dO.hx = 0; }
    if (inW(t, HUM - .15, HUM + .5)) { dO.eyes = 'determined'; dO.mouth = 'O'; dO.eye3 = 1; dO.aura = .8; dO.fire = 1; dO.lookX = .4; }
    dO.sq = spring(t, HUM, 9, 18) * .04;
    durga(EDX, EDY, EDU, dO);
    // Dhumralochana struts in, points, laughs; ash
    if (t < ASH) {
      const w = seg(t, E0, GEN + 1.0), x = lerp(1180, GX, easeOut(w));
      asura(x, GY, GU, { kind: 'dhumra', boilKey: 'dhumra', eyes: t > HUM - .1 ? 'wide' : 'happy', mouth: t > HUM - .1 ? 'O' : 'laugh', mouthK: talkK(t, 12), walk: w < 1 ? t * 2.5 : undefined,
        handL: w < 1 ? undefined : [-6.4, -16.5], handR: [5.6, -19.2], swordA: -.25, hx: -.3, lookX: -.8, shield: false, fistL: false });
    }
    vanishPuff(GX, GY - 9 * GU, 260, t - ASH, 'ashpuff', ['#B4B0BE', '#DAD6E4']);
    ashPile(GX, GY, 160, t - ASH, 'ashpile');
    const mp = [hd[0] + 8, hd[1] + 40];
    humWave(mp[0], mp[1], t - HUM, 140, 'humwave');
    // Sher takes the other 60,000
    if (inW(t, SHERRUN, F0)) {
      const k = seg(t, SHERRUN, SHERRUN + 1.9), x = lerp(-320, 1450, k);
      lionRun(x, 1840, 21, { boilKey: 'shrun', run: t * 2.6, eyes: 'angry', mouth: 'roar', mouthK: 1 });
      dust(x - 240, 1830, 90, frac((t - SHERRUN) * 3) * .6, 'srdust');
    }
    camEnd();
    wipeIn(lt, [MH.red, TK.marigold]);
    caps(t);
    whipOut(t, F0);
  }

  // ================= F · Chanda & Munda: Chamunda =================
  const FDX = 230, FDY = 1690, FDU = 21, CHX = 700, MUX = 950, CMY = 1700, CMU = 18, KX = 830, KY = 1660, KU = 22;
  function shotChamunda(t, lt) {
    const dark = ease(seg(t, DARK, DARK + .7)) * (1 - ease(seg(t, CHAMU, CHAMU + .6)));
    const dO = { ...DRG_SKIN, boilKey: 'dcm', eyes: dark > .3 ? 'angry' : 'normal', lookX: .8, hx: .1, mouth: dark > .3 ? 'flat' : 'smile', handL: [-5.4, -18.6], trishulA: -.2, hair: .3,
      tint: '#2A2050', tintK: dark * .55, eye3: dark, fire: .5 + dark * .5, wild: dark };
    if (t > CHAMU) { dO.eyes = 'happy'; dO.mouth = 'smile'; dO.handR = [5.2, -18]; dO.lookX = .9; }
    const push = ease(seg(t, DARK, DARK + .9)) * (1 - ease(seg(t, BURST, BURST + .3)));
    const sh = shakeXY(t, 16 * Math.max(0, 1 - Math.abs(t - KLAND) / .3));
    camBegin(lerp(540, 330, push) + sh[0], lerp(1200, 1300, push) + sh[1], lerp(1, 1.5, push));
    battleSet(t, {});
    durga(FDX, FDY, FDU, dO);
    if (inW(t, BURST, KLAND + .05)) streak(durgaEye3(FDX, FDY, FDU, dO), [KX + 120, -700], easeIn(seg(t, BURST, KLAND)), t, 'cstreak');
    // Kali lands behind the two, roaring; grabs their heads; bonk
    const bonkK = easeIn(seg(t, BONK - .3, BONK)), fall = ease(seg(t, BONK + .45, BONK + .95));
    if (t > KLAND) {
      const land = seg(t, KLAND, KLAND + .2), kd = (1 - easeOut(land)) * -30;
      kali(KX, KY, KU, { boilKey: 'kcm', dy: kd, eyes: t > BONK + .3 ? 'happy' : 'angry', mouth: 'roar', tongue: 1, tongueWag: Math.sin(t * 5) * .4, hair: .2, wild: 1, eye3: 1,
        handL: t > BONK - .5 && t < BONK + .5 ? [-4.6 + bonkK * 1.2, -12.6] : [-5, -15], handR: t > BONK - .5 && t < BONK + .5 ? [4.6 - bonkK * 1.2, -12.6] : [5, -15], sq: spring(t, KLAND + .2, 8, 16) * .12 });
      crack(KX, KY, t - KLAND - .2, 300, 'kcrack');
      if (t < KLAND + .2) streak([KX + 120, -700], [KX, KY - KU * 20 + kd * KU], 1, t, 'kstreak2');
    }
    // the two charge in; gulp; bonk; topple
    for (const [kind, x0, s, x1, key, d] of [['chanda', CHX, -1, CHX + 70, 'chcm', 0], ['munda', MUX, 1, MUX - 70, 'mucm', .15]]) {
      const run = seg(t, CM + d, CM + d + .9), x = lerp(x0 + 520, x0, easeOut(run)), scared = t > KLAND + .2;
      const bx = lerp(x, x1, bonkK);
      asura(bx, CMY, CMU, { kind, boilKey: key, walk: run < 1 ? t * 3 : undefined, eyes: t > BONK ? 'swirl' : scared ? 'scared' : 'angry', mouth: t > BONK ? 'O' : scared ? 'wobble' : 'roar', hx: s * .3, lookX: -.8,
        handR: scared ? [5, -17] : [5.8, -19.5], swordA: -.3, shake: inW(t, KLAND + .2, BONK - .3) ? 1 : 0, sweat: scared ? frac(t * 1.4) : 0, rot: s * fall * 1.45, sq: spring(t, BONK, 9, 20) * .1,
        emote: t > BONK + .1 ? 'stars' : undefined, emoteK: 1, emoteAge: t - BONK, noShadow: fall > .3 });
    }
    impact((CHX + MUX) / 2, CMY - 19.5 * CMU, t - BONK, 90, 'cmbonk');
    camEnd();
    whipIn(t, F0);
    caps(t);
    whipOut(t, G0, -1);
  }

  // ================= G · the rest: Raktabija, Nishumbha =================
  function shotRB(t, lt) {
    camBegin(560, 1330, 1.25 + .03 * seg(t, RB, NISH));
    battleSet(t, { embers: .6 });
    const slurp = t > RBPOP;
    kali(470, 1790, 30, { boilKey: 'krb', eyes: slurp ? 'happy' : 'angry', mouth: 'roar', tongue: 1, tongueLen: slurp ? 3 : 4.2, tongueWag: Math.sin(t * 6) * .6, wild: .7, eye3: 1, lookX: .6, hx: .2 });
    if (!slurp) raktabija(800, 1800, 18, { boilKey: 'rbg', eyes: 'scared', mouth: 'wobble', sweat: frac(t * 1.6), shake: 1, lookX: -.8 });
    vanishPuff(810, 1730, 120, t - RBPOP, 'rbpop', ['#FF8A96', '#FFD0D4']);
    camEnd();
    whipIn(t, RB, -1);
    caps(t);
    whipOut(t, NISH);
  }
  const SX = 300, SGY = 1640, LU = 24, DRU = LU * .6;
  function shotNish(t, lt) {
    const sh = shakeXY(t, 14 * Math.max(0, 1 - Math.abs(t - FLING) / .25));
    camBegin(540 + sh[0], 1240 + sh[1], 1.0);
    battleSet(t, {});
    const jab = ease(seg(t, FLING - .25, FLING)) * (1 - ease(seg(t, FLING + .3, FLING + .7)));
    const so = { boilKey: 'snish', eyes: 'angry', mouth: t > FLING ? 'grin' : 'roar', crouch: jab * .5 };
    const ds = lionRunSeat(SX, SGY, LU, so);
    lionRun(SX, SGY, LU, { ...so, rider: () => durga(ds[0], ds[1], DRU, { ...DRG_SKIN, sit: 1, boilKey: 'drn', noShadow: true, eyes: 'determined', mouth: t > FLING ? 'smile' : 'flat', trishulA: lerp(-.2, 1.1, jab), handL: [lerp(-5.4, -2, jab) + jab * 6, lerp(-18.6, -15, jab)], hair: .5, wild: .6 }) });
    const fl = seg(t, FLING, FLING + .9);
    if (fl < 1) {
      const p = fl > 0 ? arcPt([820, 1650], [960, 760], 500, easeOut(fl)) : [820, 1650];
      asura(p[0], p[1], 18 * (1 - fl * .85), { kind: 'nishumbha', boilKey: 'nfl', eyes: fl > 0 ? 'swirl' : 'angry', mouth: fl > 0 ? 'O' : 'roar', handR: [5.8, -19.5], sword: fl === 0, shield: fl === 0, rot: fl * 9, noShadow: fl > 0, hx: -.3 });
    }
    impact(800, 1350, t - FLING, 80, 'nimp');
    twinkle(960, 760, t - (FLING + .9), 46, 'ntw');
    camEnd();
    whipIn(t, NISH);
    caps(t);
    wipeOut(t, H0, [MH.red, MH.redDk]);
  }

  // ================= H · Shumbha alone: "They are ALL ME." =================
  const HDX = 330, HDY = 1690, HDU = 23, HSX = 830, HSY = 1700, HSU = 22, KAX = 105;
  function shotAlone(t, lt) {
    const blaze = ease(seg(t, BLAZE, BLAZE + .6));
    const sh = shakeXY(t, 12 * Math.max(0, 1 - Math.abs(t - STRIKE) / .3) + 6 * Math.max(0, 1 - Math.abs(t - BLAZE) / .4));
    const push = ease(seg(t, ALONE, ALONE + 1)) * (1 - ease(seg(t, ONE1 - .3, ONE1 + .2)));
    camBegin(lerp(540, 420, push) + sh[0], lerp(1220, 1190, push) + sh[1], lerp(1, 1.1, push));
    battleSet(t, { dawn: blaze * .85 });
    if (t < BLAZE) veil('#5A1020', .18 * (1 - seg(t, BLAZE - .3, BLAZE)));
    const dO = { ...DRG_SKIN, boilKey: 'dal', eyes: t < ALONE ? 'normal' : t < BLAZE ? 'closed' : 'determined', mouth: 'smile', lookX: .8, hx: .1, handL: [-5.4, -18.6], trishulA: -.2, hair: .3,
      aura: lerp(.3, 1, blaze), fire: lerp(.5, 1, blaze), eye3: blaze, wild: blaze * .5, sq: spring(t, BLAZE, 8, 16) * .05 };
    const strike = ease(seg(t, STRIKE - .2, STRIKE)) * (1 - ease(seg(t, STRIKE + .4, STRIKE + .8)));
    if (t > STRIKE - .2) { dO.trishulA = lerp(-.2, 1.35, strike); dO.handL = [lerp(-5.4, 4.5, strike), lerp(-18.6, -15.5, strike)]; dO.lean = strike * 1.2; dO.mouth = strike > .3 ? 'roar' : 'smile'; }
    if (t > TW) { dO.eyes = 'happy'; dO.mouth = 'smile'; }
    const chest = (() => { const h = durgaHead(HDX, HDY, HDU, dO); return [h[0], h[1] + 5 * HDU]; })();
    // the shaktis in an arc round her, and Kali at her side, until they fly into her
    const orbAt = i => { const a = Math.PI * (1.08 + i * .14); return [HDX + Math.cos(a) * 300, 1260 + Math.sin(a) * 260 + Math.sin(t * 2 + i) * 12]; };
    for (let i = 0; i < 7; i++) {
      const t0 = MERGE + .35 + i * .14, k = seg(t, t0, t0 + .35); if (k >= 1) continue;
      const p = k > 0 ? arcPt(orbAt(i), chest, -60, easeIn(k)) : orbAt(i);
      shaktiOrb(p[0], p[1], 34 * (1 - k * .6), SHAKTI[i], 1, 'sh' + i);
    }
    const kk = seg(t, MERGE, MERGE + .35);
    if (kk > 0 && kk < 1) glow(KAX + kk * (chest[0] - KAX) * .4, 1700 - 10 * 17 * (1 - kk * .8), 220 * (1 - kk * .5), '#5A6CFF', .9 * Math.sin(kk * Math.PI));
    if (kk < 1) kali(KAX + kk * (chest[0] - KAX) * .4, 1700, 17 * (1 - kk * .8), { boilKey: 'kal', eyes: 'happy', mouth: 'roar', tongue: 1, wild: .6, eye3: 1, lookX: .8, noShadow: kk > .2 });
    if (kk > .4 && kk < 1) shaktiOrb(lerp(KAX + 60, chest[0], easeIn((kk - .4) / .6)), lerp(1450, chest[1], easeIn((kk - .4) / .6)), 36, '#2D4C9E', 1, 'shk');
    durga(HDX, HDY, HDU, dO);
    sparkleBurst(chest[0], chest[1], 70, t - (MERGE + .35), 'arrk', 5);   // each light lands in her heart with a sparkle
    for (let i = 0; i < 7; i++) sparkleBurst(chest[0], chest[1], 60, t - (MERGE + .7 + i * .14), 'arr' + i, 5);
    // Shumbha: pointing, CHEAT!; gulp; launched
    const fl = seg(t, STRIKE + .05, TW);
    if (fl < 1) {
      const gulp = t > DROP, p = fl > 0 ? arcPt([HSX, HSY], [880, 780], 600, easeOut(fl)) : [HSX, HSY];
      const so = { kind: 'shumbha', boilKey: 'sal', eyes: fl > 0 ? 'swirl' : gulp ? 'scared' : t > ALONE ? 'wide' : 'angry', mouth: fl > 0 ? 'O' : gulp ? 'wobble' : t < ALONE ? 'roar' : 'O', mouthK: talkK(t, 12),
        handL: t < ALONE ? [-6.6, -16.8 + Math.sin(t * 8) * .4] : [-4.2, -13], handR: [4.8, -12.6], hx: -.3, lookX: -.8, sweat: gulp ? frac(t * 1.6) : 0, shake: (t < ALONE || gulp) && fl === 0 ? 1 : 0,
        rot: fl * 8, noShadow: fl > 0 };
      const u = HSU * (1 - fl * .85);
      asura(p[0], p[1], u, so);
      if (fl === 0) hangGarland(asuraHand(p[0], p[1], u, so, 1), 100, 150, 11, 'algarl');
    }
    impact(HSX - 20, HSY - 12 * HSU, t - STRIKE, 110, 'alimp');
    twinkle(880, 780, t - TW, 50, 'altw');
    camEnd();
    zoomLines(chest[0], chest[1], (1 - seg(t, BLAZE, BLAZE + .8)) * (t > BLAZE ? 1 : 0), t);
    if (t > BLAZE && t < BLAZE + .3) flash(.85 * (1 - seg(t, BLAZE, BLAZE + .3)), '#FFF6DC');
    wipeIn(lt, [MH.red, MH.redDk]);
    caps(t);
    if (t > I0 - .35) { flushLetters(); flash(ease(seg(t, I0 - .35, I0)), '#FFF6DC'); }
  }

  // ================= I · the garland, the ask =================
  const IDX = 340, IDY = 1700, IDU = 23, ILX = 790, ILY = 1730, ILU = 27;
  function shotGarland(t, lt) {
    camK(t, [[I0, [540, 1250, 1.0]], [WIPE, [540, 1250, 1.04]]]);
    battleSet(t, { dawn: 1, embers: .3 });
    const landed = t > GARL;
    durga(IDX, IDY, IDU, { ...DRG_SKIN, boilKey: 'dgar', eyes: landed ? 'happy' : 'normal', mouth: landed ? 'grin' : 'smile', lookX: .8, hx: .15, handL: [-5.4, -18.6], trishulA: -.2, aura: .5, hair: .3,
      handR: landed ? [1.2, -18.8] : undefined, sq: landed ? Math.abs(Math.sin(t * 11)) * .02 : 0 });
    const lo = { boilKey: 'sgar', eyes: landed ? 'happy' : 'wide', mouth: landed ? 'grin' : 'O', lookY: landed ? 0 : -1, blush: landed ? ease(seg(t, GARL, GARL + .4)) : 0, inhale: landed ? .5 : 0,
      take: spring(t, GARL, 8, 18) * .1, tail: Math.sin(t * 4) * .7, emote: landed ? 'hearts' : undefined, emoteK: backOut(seg(t, GARL + .2, GARL + .5)), emoteAge: t - GARL };
    lion(ILX, ILY, ILU, lo);
    const hp = lionHead(ILX, ILY, ILU, lo);
    if (!landed) {   // it falls out of the sky, a loop turning
      const k = seg(t, I0, GARL), cx = hp[0] + Math.sin(k * 5) * 40 * (1 - k), cy = lerp(-200, hp[1] + 2.6 * ILU, easeIn(k)), w = 3.4 * ILU, a = Math.sin(k * 4) * .4;
      const P = []; for (let i = 0; i <= 14; i++) { const q = i / 14 * TAU; P.push([cx + Math.cos(q + a) * w, cy + Math.sin(q) * w * .35]); }
      varmala(P, 17, 'fallgarl');
    } else {
      const sp = spring(t, GARL, 7, 16) * 14;
      varmala(garlandPath([hp[0] - 3.6 * ILU, hp[1] + 1.2 * ILU], [hp[0] + 3.6 * ILU, hp[1] + 1.2 * ILU], 5.6 * ILU + sp), 18, 'sgarl');
    }
    camEnd();
    if (lt < .4) flash(1 - seg(t, I0, I0 + .4), '#FFF6DC');
    if (t > ASK) veil(MH.ink, .32 * seg(t, ASK, ASK + .4));
    caps(t);
    if (t > WIPE) { flushLetters(); brushWipe((t - WIPE) / .6, [MH.red, TK.marigold]); }
  }

  // ================= the card =================
  function shotCard(t, lt) {
    rkCard3(t, { cap: CARD_CAP, covers: COVERS, price: PRICE, logo: LOGO, pill: PILL, follow: FOLLOW });
    const k = frac((t - FOLLOW) / 1.6);
    if (t > FOLLOW) { flushLetters(); boilSeed('sparkle'); paint(starPts(lerp(240, 700, k), lerp(1000, 760, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [MH.red, TK.marigold]); }
  }

  shots([[0, shotHook], [B0, shotHeaven], [C0, shotSpies], [REPORT, shotReport], [D0, shotProposal], [E0, shotHum], [F0, shotChamunda], [G0, shotRB], [NISH, shotNish], [H0, shotAlone], [I0, shotGarland], [CARD, shotCard]]);
})();
