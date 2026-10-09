// rakt.js: "Why is Maa Kali's TONGUE out?", a ~61.6 s captioned reel (Part 3 of Sher): two reasons. Reason 1:
// Raktabija, the blood-SEED demon whose every drop that touched the ground sprouted another him; Durga and Sher made it
// worse; Kali burst out of Durga's forehead and rolled out her tongue like a red carpet. Reason 2: she danced, Shiva lay
// down in her path, she stepped on him and bit her tongue: OOPS. The card sells Books 1–3 (Book 7 coming soon).
// Storyboard: STORYBOARD.md. Sets and effects: rakt_props.js. All times are video time (t); the SFX
// (tools/rakt_sfx.mjs) uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/rakt_sfx.mjs)
  const BLEP = 1.0, TWO = 2.7, FALL = 4.15, B0 = 4.6;
  const LAND = 4.75, SPROUT = 5.0, POP0 = 5.45, MEET = 6.9, BOON = 9.3, POKE = 9.6, DRIP = 9.8, LAND2 = 10.4, POP2 = 11.6, HI5 = 12.6, SMUG = 13.2, C0 = 14.4;
  const ROAR = 14.6, SLAP1 = 16.0, POPS1 = 16.5, MORE = 16.7, SLAP2 = 17.7, POPS2 = 18.2, FACEPALM = 18.3, CHAKRA = 19.0, COUNT = [19.2, 19.7, 20.2], THOUS = 20.7, GAGS = 22.6, D0 = 24.6;
  const ANGRY = 24.7, EYE3 = 25.8, BURST = 26.8, KLAND = 27.3, KALI = 28.6, GULP = 29.0, CARPET = 30.6;
  const UNROLL = 31.0, UNROLLED = 32.2, NOTONE = 33.0, NODROPS = 35.6, SELFIE = 36.0, FLASH = 36.5, BOOP = 36.9, ORIG = 37.8, FINGER = 38.4, SLAP3 = 39.0, DEFLATE = 39.1, TWINK = 39.95, SLURP = 40.0, F0 = 40.4;
  const R2 = 40.4, DANCE = 41.0, SHOOK = 42.4, SHIVA = 44.8, LIE = 45.6, HOPON = 46.6, STEP = 47.0, WAIT = 47.2, HUSB = 47.9, BITE = 49.2, OOPS = 49.3, THUMB = 49.8, BLEP2 = 50.4;
  const RECAP = 51.6, ASK = 53.9, WIPE = 56.8;
  const CARD = 57.1, CARD_CAP = 57.2, COVER = 57.4, ROW = 58.0, PRICE = 58.4, LOGO = 58.7, PILL = 59.0, FOLLOW = 59.4;

  const GOLDC = '#F5C542';
  const inW = (t, a, b) => t >= a && t < b;
  const talkK = (t, sp = 13, ph = 0) => .35 + .75 * Math.abs(Math.sin(t * sp + ph));
  const camK = (t, keys, sh = [0, 0]) => { const c = kf(t, keys); camBegin(c[0] + sh[0], c[1] + sh[1], c[2]); return c; };
  // grow for a clone whose seedling appears at t0 and POPS at t1
  const growAt = (t, t0, t1) => t < t1 ? lerp(0, .34, seg(t, t0, t1 - .1)) : lerp(.35, 1, seg(t, t1, t1 + .38));

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ["Why is Maa KALI's", 1290, -1, TWO - .1 + 1, 64], ['TONGUE out?', 1405, -1, TWO - .1 + 1, 118, GOLDC],
    ['There are TWO reasons.', 1230, TWO, B0 - TWO - .1, 60], ['One is EPIC.', 1328, TWO + .35, B0 - TWO - .45, 72, GOLDC], ['One is HILARIOUS.', 1424, TWO + .7, B0 - TWO - .8, 72, GOLDC],
    ['REASON #1', 500, LAND + .05, MEET - LAND - .15, 100, GOLDC], ['(the EPIC one)', 600, LAND + .35, MEET - LAND - .45, 50],
    ['Meet RAKTABIJA:', 500, MEET, BOON - MEET - .1, 86, GOLDC], ['the demon who MULTIPLIES.', 598, MEET + .3, BOON - MEET - .4, 56],
    ['Every drop of his blood', 500, BOON, POP2 - BOON - .1, 60], ['that touched the ground…', 588, BOON + .3, POP2 - BOON - .4, 60],
    ['…became ANOTHER HIM.', 520, POP2, C0 - POP2 - .1, 80, GOLDC], ['(Rakta = BLOOD. Bija = SEED.)', 618, POP2 + .7, C0 - POP2 - .8, 44],
    ['So Maa Durga and Sher', 500, C0 + .1, MORE - C0 - .2, 60], ['attacked.', 592, C0 + .4, MORE - C0 - .5, 86, GOLDC],
    ['But every hit made MORE.', 520, MORE, CHAKRA - MORE + .1, 66],
    ['4…', 540, COUNT[0], COUNT[1] - COUNT[0], 104, GOLDC], ['16…', 540, COUNT[1], COUNT[2] - COUNT[1], 118, GOLDC], ['300…', 540, COUNT[2], THOUS - COUNT[2], 130, GOLDC],
    ['THOUSANDS.', 560, THOUS, GAGS - THOUS - .1, 136, GOLDC],
    ['Sher was NOT helping.', 500, GAGS + .1, D0 - GAGS - .15, 70],
    ['Maa Durga got SO angry…', 1360, ANGRY, BURST - ANGRY + .1, 62],
    ['…out of her FOREHEAD came', 520, BURST + .1, KALI - BURST - .2, 60],
    ['MAA KALI.', 560, KALI, CARPET - KALI - .1, 140, GOLDC],
    ['She rolled out her TONGUE…', 500, CARPET, NOTONE - CARPET - .1, 60], ['like a RED CARPET.', 592, CARPET + .5, NOTONE - CARPET - .6, 76, GOLDC],
    ['Now NOT ONE drop', 500, NOTONE, NODROPS - NOTONE - .1, 66], ['touched the ground.', 592, NOTONE + .3, NODROPS - NOTONE - .4, 66, GOLDC],
    ['No drops = no clones.', 520, NODROPS, ORIG - NODROPS - .1, 70, GOLDC],
    ['The original?', 500, ORIG + .1, DEFLATE - ORIG - .1, 66], ['DEFLATED.', 520, DEFLATE, F0 - DEFLATE - .05, 110, GOLDC],
    ['REASON #2', 500, R2 + .05, SHOOK - R2 - .15, 100, GOLDC], ['(the HILARIOUS one)', 600, R2 + .35, SHOOK - R2 - .45, 50],
    ['She was SO happy, she danced…', 500, SHOOK, SHIVA - SHOOK - .1, 56], ['…and the WORLD shook.', 590, SHOOK + .6, SHIVA - SHOOK - .7, 72, GOLDC],
    ['So SHIVA', 500, SHIVA, STEP - SHIVA, 120, GOLDC], ['lay down in her path.', 610, SHIVA + .4, STEP - SHIVA - .4, 60],
    ['Wait…', 500, WAIT, BITE - WAIT - .05, 84], ['…is that my HUSBAND?', 598, HUSB, BITE - HUSB - .05, 66, GOLDC],
    ['In Bengal, biting your tongue', 500, OOPS, RECAP - OOPS - .1, 56], ['means: OOPS!', 600, OOPS + .45, RECAP - OOPS - .55, 104, GOLDC],
    ['#1: She caught EVERY drop.', 500, RECAP, ASK - RECAP - .1, 56], ['#2: She stepped on her HUSBAND.', 590, RECAP + .7, ASK - RECAP - .8, 56, GOLDC],
    ['Did you know BOTH?', 1325, ASK, WIPE - ASK + .1, 70, GOLDC], ['Comment JAI MAA KALI', 1425, ASK + .2, WIPE - ASK - .1, 56],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // ================= A · the hook: Kali's face, tongue out =================
  function shotHook(t, lt) {
    boilSeed('hookbg');
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: RK.plain, ink: null });
    glow(540, 900, 900, '#3A44A0', .55);
    const fall = easeIn(seg(t, FALL, B0)), blep = inW(t, BLEP, BLEP + .95);
    const lookX = kf(t, [[BLEP, 0], [BLEP + .15, -1], [BLEP + .45, -1], [BLEP + .6, 1], [BLEP + .9, 1], [BLEP + 1.05, 0]], ease);
    kali(540, 2164 - fall * 1500, 62, { boilKey: 'khook', noShadow: true, eyes: t > FALL - .2 ? 'wide' : 'normal', lookX, lookY: t > FALL - .2 ? -.8 + 1.6 * fall : 0, brows: .2,
      tongueWag: blep ? Math.sin((t - BLEP) * 15) * .55 : Math.sin(t * 2) * .08, tongueLen: 3 + (blep ? .3 * Math.abs(Math.sin((t - BLEP) * 15)) : 0),
      hair: .2 * Math.sin(t * 1.1), wild: .7, aura: .4, auraCol: '#5A6CFF', swMul: .85, sq: blep ? .012 * Math.sin((t - BLEP) * 15) : 0 });
    // the drop that falls past her face, and the whip down after it
    const dk = seg(t, FALL, B0 + .1);
    if (dk > 0) bloodSeed(560, lerp(-80, 2100, easeIn(dk)), 30, Math.PI, 'hookdrop', 2.2);
    whipV(seg(t, FALL + .1, B0), t);
    caps(t);
  }

  // ================= B · Raktabija: the seed, the boon =================
  const OX = 680, OY = 1600, OU = 38, TX = 340;
  function rbOrigB(t) {
    const g = growAt(t, SPROUT, POP0);
    const o = { boilKey: 'orig', grow: g, seed: 1, sq: spring(t, POP0 + .3, 8, 16) * .1 - seg(t, POP0 + .4, POP0 + .7) * (1 - seg(t, POP0 + .7, POP0 + 1.1)) * .08,
      eyes: t < POP0 + .7 ? 'closed' : 'normal', mouth: t < POP0 + .7 ? 'O' : 'grin', lookX: kf(t, [[POP0 + .7, 0], [POP0 + .9, -1], [POP0 + 1.2, -1], [POP0 + 1.35, 1], [POP0 + 1.6, 1], [POP0 + 1.8, 0]], ease) };
    if (t > POP0 + .5 && t < POP0 + .9) { o.handL = [-4.6, -9.4]; o.handR = [4.6, -9.4]; o.handShapeL = 'open'; o.mace = false; o.handShapeR = 'open'; }   // the stretch
    if (inW(t, MEET, BOON)) {   // twirls the mace overhead, laughing
      o.eyes = 'happy'; o.mouth = 'open'; o.mouthK = talkK(t, 16); o.handR = [3.6, -10.2]; o.maceA = (t - MEET) * 9; o.handL = [-4.2, -4.4]; o.hop = Math.abs(Math.sin((t - MEET) * Math.PI * 1.87)) * .6;
    }
    if (t >= BOON) {   // looks at the spike, touches it: OW, the hand jerks back and shakes
      const reach = ease(seg(t, BOON + .05, POKE)), jerk = seg(t, POKE, POKE + .12), shk = inW(t, POKE, POKE + .7) ? Math.sin(t * 46) * .45 : 0;
      o.handR = [3.0, -7.6]; o.maceA = -.62;
      o.handL = jerk > 0 ? [lerp(.6, -4.8, ease(jerk)), lerp(-9.9, -7.2, ease(jerk)) + shk] : [lerp(-4.0, .6, reach), lerp(-3.4, -9.9, reach)];
      o.eyes = t < POKE ? 'normal' : t < POKE + .6 ? 'squeeze' : t < POP2 ? 'normal' : 'wide';
      o.lookX = t < POKE ? .5 : t < LAND2 ? -.8 : -1; o.lookY = t < POKE ? -1 : .9;
      o.mouth = t < POKE ? 'flat' : t < POKE + .7 ? 'O' : t < POP2 ? 'wobble' : 'O';
      o.hop = inW(t, POKE, POKE + .4) ? Math.sin(seg(t, POKE, POKE + .4) * Math.PI) * 1.2 : 0;
      o.sq = (o.sq || 0) + spring(t, POKE, 10, 20) * .08;
      if (t > POP2) { o.lookY = 0; o.sq += spring(t, POP2, 9, 18) * .1; }
      if (t > POP2 + .45) { o.eyes = 'normal'; o.mouth = 'grin'; o.lookX = -1; }
      if (t > HI5 - .45) {   // the high-five: his left hand meets the twin's right overhead
        const k = ease(seg(t, HI5 - .45, HI5)), back = ease(seg(t, HI5 + .35, HI5 + .7));
        o.handL = [lerp(-4.8, -4.5, k), lerp(-7.2, -10.6, k) + back * 4]; o.handShapeL = 'open'; o.eyes = 'happy'; o.mouth = 'open'; o.mouthK = .9;
      }
      if (t > SMUG) { o.eyes = 'normal'; o.mouth = 'smirk'; o.lookX = 0; o.lookY = 0; o.brows = .5; o.handL = [-4.2, -3.6]; o.handShapeL = 'fist'; }
    }
    return o;
  }
  function rbTwinB(t) {
    const o = { boilKey: 'twin', seed: 2, grow: growAt(t, LAND2 + .2, POP2), mace: false, eyes: 'normal', mouth: 'grin', lookX: 1, sq: spring(t, POP2 + .35, 8, 16) * .1 };
    if (t < POP2 + .4) { o.eyes = 'closed'; o.mouth = 'O'; }
    if (t > HI5 - .45) { const k = ease(seg(t, HI5 - .45, HI5)), back = ease(seg(t, HI5 + .35, HI5 + .7)); o.handR = [lerp(4.0, 4.5, k), lerp(-2.6, -10.6, k) + back * 7]; o.handShapeR = 'open'; o.eyes = 'happy'; o.mouth = 'open'; }
    if (t > SMUG) { o.eyes = 'normal'; o.mouth = 'smirk'; o.lookX = 0; o.brows = .5; o.handR = [4.2, -3.6]; o.handShapeR = 'fist'; }
    return o;
  }
  function shotSeed(t, lt) {
    camK(t, [[B0, [520, 1100, 1.3]], [LAND, [520, 1135, 1.3]], [MEET, [520, 1140, 1.3]], [BOON, [505, 1150, 1.32]], [POP2, [505, 1140, 1.3]], [C0, [505, 1150, 1.33]]]);
    nightSet(t, { moonX: 490, moonY: 1060 });
    // the first drop lands, ripples, sprouts, POPS
    const dk = seg(t, B0, LAND);
    if (dk < 1) bloodSeed(OX, lerp(560, OY, easeIn(dk)), 14, Math.PI, 'bdrop', 1.4);
    ripple(OX, OY, t - LAND, 50, 'brip');
    raktabija(OX, OY, OU, rbOrigB(t));
    vanishPuff(OX + 60, OY - 60, 110, t - POP0, 'bpop', ['#6A5070', '#9A86A8']);
    // the drop off his finger, the twin
    const hp = rbHand(OX, OY, OU, rbOrigB(DRIP), -1);
    dropArc(hp, [TX, OY], 50, seg(t, DRIP, LAND2), 'b2drop', 11, 1.3);
    ripple(TX, OY, t - LAND2, 34, 'brip2');
    if (t > LAND2 + .2) raktabija(TX, OY, OU, rbTwinB(t));
    vanishPuff(TX - 60, OY - 60, 110, t - POP2, 'bpop2', ['#6A5070', '#9A86A8']);
    if (t > HI5) { const a = rbHand(OX, OY, OU, rbOrigB(t), -1); sparkleBurst(a[0], a[1] - 20, 70, t - HI5, 'hi5', 8, ['#FFF4DC', '#FFD27A']); }
    camEnd();
    whipV(1 - seg(t, B0, B0 + .3), t);
    whipH(seg(t, C0 - .4, C0), 1, t);
    caps(t);
  }

  // ================= C · the fight makes it worse =================
  const DX = 230, DY = 1650, DU = 15, SHX = 500, SHY = 1650, SHU = 19, CX = 740, CY = 1640, CU = 22, TWX = 880, TWY = 1620, TWU = 20;
  const SELF = [1000, 1775, 22], BABY = [626, 1658, 9], BURIED = [660, 1800, 22];
  // slap wind-ups and hits: [t] → Sher's paw
  function sherC(t) {
    const o = { boilKey: 'sherc', eyes: 'angry', mouth: 'frown', tail: Math.sin(t * 3) * .6, seed: 3 };
    if (inW(t, ROAR, ROAR + .9)) { o.mouth = 'roar'; o.mouthK = .9; o.inhale = .6; o.mane = .6; }
    const swing = (t0, tgt, lunge) => {   // wind-up .45 s before, hit at t0, back by t0 + .55
      const w = ease(seg(t, t0 - .45, t0 - .08)), h = seg(t, t0 - .08, t0), b = ease(seg(t, t0 + .25, t0 + .6));
      if (w <= 0 || b >= 1) return false;
      o.pawR = h > 0 ? [lerp(2.6, tgt[0], ease(h)) * (1 - b) + 1.05 * b, lerp(-11, tgt[1], ease(h)) * (1 - b) - .55 * b] : [lerp(1.05, 2.6, w), lerp(-.55, -11, w)];
      o.pawShapeR = 'pad'; o.dx = (h > 0 ? lunge : -.5 * w) * (1 - b); o.lean = o.dx * .4; o.mouth = 'roar'; o.mouthK = .7; o.eyes = 'angry';
      return true;
    };
    swing(SLAP1, [6.8, -7.0], 4) || swing(SLAP2, [6.0, -3.6], 2);
    if (inW(t, MORE + .2, SLAP2 - .5)) { o.pawR = [2.0, -10.8]; o.pawShapeR = 'pad'; o.eyes = 'wide'; o.mouth = 'O'; o.lookX = .4; o.lookY = .3; }
    if (inW(t, POPS2 + .2, GAGS)) { o.eyes = 'wide'; o.lookY = -1; o.lookX = 0; o.mouth = 'wobble'; }
    if (t > GAGS) { o.eyes = 'happy'; o.mouth = 'grin'; o.pawR = [1.6, -13.4]; o.pawShapeR = 'rest'; o.pawAR = -2.6; o.htilt = -.1; o.tail = .2 + Math.sin(t * 2) * .2; }
    return o;
  }
  function durgaC(t) {
    const o = { ...DRG_SKIN, boilKey: 'durc', eyes: 'determined', mouth: 'flat', hair: .3, wild: .3, fire: .5, eye3: .2, handL: [-5.4, -18.6], trishulA: -.25, lookX: .6 };
    if (inW(t, ROAR, ROAR + .9)) o.mouth = 'roar';
    if (inW(t, FACEPALM, CHAKRA - .05)) { o.handR = [.9, -20.2]; o.eyes = 'closed'; o.mouth = 'flat'; o.sq = spring(t, FACEPALM, 8, 16) * .03; }
    if (inW(t, CHAKRA - .2, CHAKRA + .9)) { o.eyes = 'angry'; o.mouth = 'roar'; o.gifts = { chakra: t < CHAKRA + .05 || t > CHAKRA + .85 ? 1 : 0 }; }
    if (t > GAGS) { o.eyes = 'normal'; o.browL = .9; o.mouth = 'flat'; o.lookX = .8; }
    return o;
  }
  // the original and the twin in C: grinning, spun by the slap, then pointing at each other (which one is the original?)
  function origC(t) {
    const spin = seg(t, SLAP1, SLAP1 + .9), sp = spin > 0 && spin < 1;
    const o = { boilKey: 'orig', seed: 1, eyes: sp ? 'swirl' : t > SLAP1 && t < SLAP1 + 1.4 ? 'swirl' : 'happy', mouth: sp ? 'O' : 'open', mouthK: talkK(t, 12), handR: [4.4, -8.6 + .6 * Math.sin(t * 7)], maceA: Math.sin(t * 7) * .4 };
    if (sp) { o.sx = Math.cos(spin * TAU * 3.5); o.hop = Math.sin(spin * Math.PI) * 2.5; o.dx = spin * 1.2; }
    else if (t > SLAP1) o.dx = 1.2;
    if (t > GAGS) { o.eyes = 'angry'; o.mouth = 'teeth'; o.mace = false; o.handR = [6.4, -6.6]; o.handShapeR = 'point'; o.dx = 1.2; o.lean = .3; }
    return o;
  }
  function twinC(t) {
    const o = { boilKey: 'twin', seed: 2, mace: false, eyes: 'happy', mouth: 'open', mouthK: talkK(t, 11, 1), handR: [3.4, -9 + .5 * Math.sin(t * 8)], handShapeR: 'fist' };
    if (t > GAGS) { o.eyes = 'angry'; o.mouth = 'teeth'; o.handL = [-6.4, -6.6]; o.handShapeL = 'point'; o.lean = -.3; o.handR = [4.0, -2.6]; }
    return o;
  }
  function selfieOpts(t, flash) {
    return { boilKey: 'selfie', seed: 7, mace: false, eyes: flash > .3 ? 'squeeze' : 'happy', mouth: 'grin', handL: [-4.6, -10.6], handShapeL: 'hold',
      armL: (u, sw) => rbPhone(u, sw, flash), handR: [3.4, -8.8], handShapeR: 'point', lean: -.15, htilt: -.1 };
  }
  // the clone that sprouted on Sher's head, wearing Part 1's headband
  function headClone(t, sx, sy, su, so, key = 'headc') {
    const g = growAt(t, POPS2, POPS2 + .3);
    const [hx, hy] = lionHead(sx, sy, su, so), top = [hx, hy - su * 4.7];
    raktabija(top[0], top[1], su * .55, { boilKey: key, seed: 9, grow: g, hat: t > POPS2 + .9 ? rbBand() : undefined, eyes: 'happy', mouth: 'open', mouthK: talkK(t, 10), handR: [4.0, -9 + .6 * Math.sin(t * 9)], noShadow: true, maceA: Math.sin(t * 9) * .5 });
  }
  function shotFight(t, lt) {
    const gag = t >= GAGS;
    const sh = shakeXY(t, 10 * (Math.max(0, 1 - Math.abs(t - SLAP1) / .25) + Math.max(0, 1 - Math.abs(t - SLAP2) / .25)));
    const c = gag ? camK(t, [[GAGS, [740, 1330, 1.15]], [D0, [750, 1320, 1.2]]], sh)
      : camK(t, [[C0, [580, 1200, 1.15]], [SLAP2 + .6, [590, 1200, 1.17]], [CHAKRA, [585, 1190, 1.12]], [THOUS, [560, 1110, .52]], [GAGS, [560, 1100, .5]]], sh);
    nightSet(t);
    // the crowd behind the stage (and, wide, all of it)
    drawCrowd(t, { zoom: c[2], cull: s => gag && s.y > 1340, lodBelow: 12 });
    // Durga, Sher (with the clone on his head, the baby on his tail)
    durga(DX, DY, DU, durgaC(t));
    const so = sherC(t);
    lion(SHX, SHY, SHU, so);
    if (t > POPS2) headClone(t, SHX, SHY, SHU, so);
    if (t > POPS2 + .1) {
      const tail = [SHX + 5.4 * SHU, SHY - 4.8 * SHU], [bx, by] = BABY;
      raktabija(bx, by, BABY[2], { boilKey: 'baby', seed: 11, grow: growAt(t, POPS2 + .1, POPS2 + .45), mace: false, eyes: 'happy', mouth: 'grin', handL: [(tail[0] - bx) / BABY[2] - .3, (tail[1] - by) / BABY[2]], handR: [(tail[0] - bx) / BABY[2] + .6, (tail[1] - by) / BABY[2] + .4], handShapeL: 'hold', handShapeR: 'hold', lean: -.4 });
    }
    // the original and the twin
    raktabija(CX, CY, CU, origC(t));
    raktabija(TWX, TWY, TWU, twinC(t));
    // the gag stage: the selfie clone, the upside-down one
    if (t > CHAKRA + .4) raktabija(SELF[0], SELF[1], SELF[2], { ...selfieOpts(t, inW(t, GAGS + .8, GAGS + 1.1) ? 1 - seg(t, GAGS + .8, GAGS + 1.1) : 0), grow: growAt(t, CHAKRA + .4, CHAKRA + .7) });
    if (t > CHAKRA + .5) buriedClone(BURIED[0], BURIED[1], BURIED[2], t - CHAKRA - .5, 'buried');
    // the drops: SLAP1 → the first wave; SLAP2 → the second (and one onto Sher's head); the chakra → everything
    CROWD.forEach((s, i) => {
      if (t > s.born || t < s.born - .45) return;
      const from = s.born < 17 ? [CX, CY - CU * 6] : s.born < 19 ? [650, 1748 - 23 * 6] : chakraAt(Math.max(CHAKRA, s.born - .45));
      dropArc(from, [s.x, s.y], 140, seg(t, s.born - .45, s.born), 'cd' + s.seed, 10 * clamp(s.u / 20, .5, 1.4), 1.2);
    });
    if (inW(t, POPS2 - .45, POPS2)) { const hd = lionHead(SHX, SHY, SHU, so); dropArc([650, 1610], [hd[0], hd[1] - SHU * 5], 160, seg(t, POPS2 - .45, POPS2), 'cdhead', 10, 1.2); }
    CROWD.forEach(s => { if (t > s.born && t < s.born + .5) ripple(s.x, s.y, t - s.born, 26 * s.u / 20, 'cr' + s.seed); });
    // the chakra's boomerang through them
    if (inW(t, CHAKRA, CHAKRA + .9)) { const [x, y] = chakraAt(t); push(); translate(x, y); glow(0, 0, 90, '#9C8CF0', .8); chakra(DU * 1.4, 1.4, t * 30); pop(); }
    impact(CX - 70, CY - CU * 6, t - SLAP1, 130, 'ci1');
    impact(650, 1748 - 23 * 5, t - SLAP2, 110, 'ci2');
    camEnd();
    if (inW(t, GAGS, GAGS + .3)) zoomLines(540, 960, 1 - seg(t, GAGS, GAGS + .3), t);
    whipH(1 - seg(t, C0, C0 + .3), 1, t);
    caps(t);
  }
  // the chakra's path: out from Durga's back hand, round through the crowd, and back
  function chakraAt(t) {
    const k = seg(t, CHAKRA, CHAKRA + .9), a = k * TAU;
    return [lerp(DX - 90, DX - 90, k) + Math.sin(a / 2) * 1300 * (1 - .15 * Math.sin(a)), DY - 380 + Math.sin(a) * 260 - Math.sin(a / 2) * 80];
  }

  // ================= D · Durga's anger → Kali bursts out =================
  function shotAnger(t, lt) {
    camBegin(560, 1250, .62);
    nightSet(t);
    drawCrowd(t, { zoom: .62, lodBelow: 99 });
    camEnd();
    veil(RK.skyTop, .25 + .25 * seg(t, ANGRY, BURST));
    const dark = seg(t, ANGRY + .3, BURST - .2), e3 = seg(t, EYE3, EYE3 + .4), shk = (inW(t, EYE3, BURST + .3) ? 1 : dark * .4) * Math.sin(t * 55) * .06;
    const o = { ...DRG_SKIN, boilKey: 'dura', eyes: t < ANGRY + .4 ? 'determined' : 'angry', mouth: t > EYE3 ? 'teeth' : 'flat', brows: -1, tint: '#2A2A6A', tintK: dark * .55,
      eye3: e3, fire: .5 + .5 * dark, wild: .3 + .6 * dark, hair: .3 + .4 * Math.sin(t * 1.7), aura: dark * .6, dx: shk, swMul: .85, handL: [-5.4, -18.6], trishulA: -.25 };
    durga(540, 1708, 40, o);
    const e3p = durgaEye3(540, 1708, 40, o);
    if (t > EYE3) glow(e3p[0], e3p[1], 120 + 200 * seg(t, EYE3, BURST), '#FF5A3A', .5 + .4 * seg(t, EYE3, BURST));
    streak(e3p, [e3p[0] + 260, -400], easeIn(seg(t, BURST, KLAND)), t, 'dstreak');
    if (t > BURST) flash(.45 * (1 - seg(t, BURST, BURST + .2)), '#C8D2FF');
    if (inW(t, BURST, KLAND)) zoomLines(e3p[0], e3p[1], .8, t, '#C8D2FF');
    caps(t);
  }

  // ================= E · Kali lands; the tongue =================
  const KX = 260, KY = 1820, KU = 38, LY = 1845, ROOT = [325, 1848], LW = 124, SX3 = 480;
  const LR = [990, 1845, 20];   // the log-roller
  const frontAt = t => t < UNROLL ? ROOT[0] : t < SLURP ? lerp(ROOT[0], 1380, ease(seg(t, UNROLL, UNROLLED))) : lerp(1380, ROOT[0], easeIn(seg(t, SLURP, SLURP + .3)));
  const rollAt = t => t < UNROLLED ? 100 * (1 - .55 * seg(t, UNROLL, UNROLLED)) : 0;
  function kaliE(t) {
    const land = seg(t, KLAND, KLAND + .16), rise = seg(t, KLAND + .2, KLAND + .7);
    const o = { boilKey: 'kalie', eyes: 'angry', brows: -1, wild: 1, hair: .3 * Math.sin(t * 1.3), aura: .5, auraCol: '#5A6CFF', tongueWag: Math.sin(t * 3) * .15, seed: 4,
      dy: -(1 - land) * 40, sq: land < 1 ? -.15 : (1 - ease(rise)) * .22 + spring(t, KLAND + .7, 8, 16) * .05 };
    if (t > CARPET) { o.eyes = 'determined'; o.tongueOff = t < SLURP + .3; }
    if (inW(t, NOTONE, NODROPS)) o.backR = [6.2 + 1.8 * Math.sin((t - NOTONE) * 9), -19.5 + 1.5 * Math.cos((t - NOTONE) * 9)];   // the khadga swings
    if (inW(t, BOOP - .3, BOOP + .4)) o.eyes = 'wink';
    if (t > SLURP + .3) { o.eyes = 'happy'; o.brows = 0; o.tongueWag = Math.sin(t * 9) * .3; }
    return o;
  }
  function origE(t) {
    const o = { boilKey: 'orig', seed: 1, eyes: 'happy', mouth: 'open', mouthK: talkK(t, 12), handR: [4.4, -8.6 + .6 * Math.sin(t * 7)], maceA: Math.sin(t * 7) * .4 };
    if (t > GULP) { o.eyes = 'scared'; o.mouth = 'wobble'; o.shake = .6; o.sweat = frac(t * .9); o.brows = .9; o.handR = [4.0, -2.6]; o.maceA = .3; }
    if (t > ORIG) { o.mace = false; o.handR = [4.2, -3]; }
    if (t > FINGER) {
      o.handL = [-3.6, -9.6]; o.handShapeL = 'point'; o.mouth = 'grin'; o.eyes = 'normal'; o.lookX = -1; o.shake = .3;
      const tip = seg(t, FINGER + .25, SLAP3); o.dx = tip * 1.4; o.walk = tip > 0 ? t * 2.2 : undefined; o.hop = Math.abs(Math.sin(t * 13)) * .3 * (tip > 0 ? 1 : 0);
    }
    return o;
  }
  function sherE(t) {
    const o = { boilKey: 'shere', eyes: t > GULP ? 'angry' : 'wide', mouth: 'frown', tail: Math.sin(t * 3) * .6, seed: 3 };
    if (inW(t, NOTONE, NODROPS)) {   // slapping away, left right
      const ph = (t - NOTONE) * 2.4, k = Math.abs(Math.sin(ph * Math.PI));
      o.pawR = [lerp(2.4, 6.2, k), lerp(-10, -6.5, k)]; o.pawShapeR = 'pad'; o.dx = k * 1.2; o.mouth = 'roar'; o.mouthK = .6;
    }
    if (t > ORIG) { o.eyes = 'side'; o.lookX = 1; o.mouth = 'smirk'; }
    const w = ease(seg(t, SLAP3 - .45, SLAP3 - .08)), h = seg(t, SLAP3 - .08, SLAP3), b = ease(seg(t, SLAP3 + .3, SLAP3 + .7));
    if (w > 0 && b < 1) { o.pawR = h > 0 ? [lerp(2.6, 6.8, ease(h)) * (1 - b) + 1.05 * b, lerp(-11, -7, ease(h)) * (1 - b) - .55 * b] : [lerp(1.05, 2.6, w), lerp(-.55, -11, w)]; o.pawShapeR = 'pad'; o.dx = (h > 0 ? 4 : -.5 * w) * (1 - b); o.lean = o.dx * .4; o.mouth = 'roar'; o.eyes = 'angry'; }
    if (t > SLAP3 + .4) { o.eyes = 'happy'; o.mouth = 'grin'; o.inhale = .5; }
    return o;
  }
  function shotKali(t, lt) {
    const sh = shakeXY(t, 16 * Math.max(0, 1 - Math.abs(t - (KLAND + .16)) / .4) + 6 * Math.max(0, 1 - Math.abs(t - SLAP3) / .25));
    const c = camK(t, [[KLAND, [560, 1300, .74]], [KALI, [560, 1320, .76]], [CARPET, [600, 1340, .72]], [UNROLLED, [660, 1330, .68]], [NOTONE, [660, 1330, .68]], [NODROPS, [720, 1450, .92]],
      [ORIG, [700, 1500, 1.08]], [DEFLATE, [700, 1460, 1.0]], [TWINK, [700, 1340, .86]], [F0, [660, 1340, .84]]], sh);
    nightSet(t, { moonX: 760, moonY: 930 });
    const front = frontAt(t);
    // the crowd behind the lane, then Durga and Sher, the original
    const back = s => s.y > LANE[0];
    drawCrowd(t, { zoom: c[2], gulp: GULP, lodBelow: 12, cull: s => back(s) || (s.x < 640 && s.y > 1690) || (s.x < 470 && s.y > 1480) || s.y > LANE[0], over: s => s.seed === 2 && t > GULP + .3 ? { rot: Math.min(1.5, (t - GULP - .3) * 6), eyes: 'swirl', mouth: 'O' } : null });
    durga(60, 1660, 15, { ...DRG_SKIN, boilKey: 'dure', eyes: t > GULP ? 'happy' : 'wide', mouth: 'smile', hair: .3, wild: .3, fire: .5, handL: [-5.4, -18.6], trishulA: -.25, lookX: .8 });
    const so = sherE(t);
    lion(SX3, SHY, SHU, so);
    if (t < 33.3) headClone(t, SX3, SHY, SHU, so, 'heade');
    vanishPuff(SX3, SHY - SHU * 17, 70, t - 33.3, 'headpop', RK.puff);
    // the original: alone at the end; slapped; deflates into the moon
    const df = seg(t, DEFLATE, TWINK);
    if (t < TWINK) {
      const oo = origE(t);
      if (df > 0) {
        const x = lerp(760, 780, df) + 230 * Math.sin(df * 13) * (1 - df), y = lerp(CY, 960, easeIn(df)) + 90 * Math.cos(df * 17) * (1 - df);
        raktabija(x, y, CU * lerp(.9, .25, df), { ...oo, eyes: 'swirl', mouth: 'O', rot: df * 26, sx: 1 - .35 * df, sy: .8 - .3 * df, noShadow: true, hop: 0, walk: undefined, dx: 0, shake: 0 });
      } else raktabija(CX - 40, CY, CU, oo);
    }
    twinkle(760, 960, t - TWINK, 50, 'etw');
    // the selfie clone (boop!), and the slots in front of the lane
    const selfAlive = t < BOOP + .1, fl = inW(t, FLASH, FLASH + .3) ? 1 - seg(t, FLASH, FLASH + .3) : 0;
    if (selfAlive) {
      const bo = seg(t, BOOP - .05, BOOP + .1);
      raktabija(SELF[0], SELF[1], SELF[2], { ...selfieOpts(t, fl), ...(t > GULP && t < SELFIE ? { eyes: 'scared', mouth: 'wobble', shake: .5 } : {}), ...(t > SELFIE ? { eyes: fl > .3 ? 'squeeze' : 'happy', mouth: 'grin', handR: [3.4, -8.8], handShapeR: 'point' } : {}), hop: bo * 3, sq: -bo * .2 });
    }
    vanishPuff(SELF[0], SELF[1] - 140, 150, t - (BOOP + .1), 'selfpop', RK.puff);
    if (t > BOOP + .1) {   // the phone falls onto the tongue
      const pk = seg(t, BOOP + .1, BOOP + .6), pp = arcPt([SELF[0] - 100, SELF[1] - 240], [SELF[0] - 60, LY - 10], 120, easeIn(pk));
      push(); translate(pp[0], pp[1]); rotate(pk * 9); boilSeed('phonefall'); rbPhone(SELF[2], 1.1, 0); pop();
    }
    // the tongue: hanging while she roars, then unrolled along the lane
    const ko = kaliE(t);
    const drops = [];
    CROWD.forEach(s => { const a = t - (s.dies + .32); if (a > 0 && a < .5 && s.x > ROOT[0]) drops.push([clamp(s.x, ROOT[0] + 40, 1340), a]); });
    if (inW(t, SLAP3 + .35, SLAP3 + .9)) drops.push([840, t - SLAP3 - .35]);
    // the log-roller: caught on the roll, running on top of it, flung into the sky
    {
      const caught = front >= LR[0] - 40 && t < SLURP, fly = seg(t, UNROLLED - .25, UNROLLED + .5);
      if (!caught && t < UNROLL + 1) raktabija(LR[0], LR[1], LR[2], { boilKey: 'logr', seed: 12, eyes: t > GULP ? 'scared' : 'happy', mouth: t > GULP ? 'wobble' : 'grin', shake: t > GULP ? .5 : 0, mace: false });
      else if (caught && fly < 1) {
        const r = rollAt(t), base = [front, LY - r * .55 - r];
        const p = fly > 0 ? arcPt([front, base[1]], [1060, 520], 500, easeOut(fly)) : base;
        raktabija(p[0], p[1], LR[2], { boilKey: 'logr', seed: 12, eyes: 'wide', mouth: 'O', walk: t * 5, hop: 0, mace: false, handL: [-4.8, -9.5 + Math.sin(t * 20)], handR: [4.8, -9.5 - Math.sin(t * 20)], handShapeL: 'open', handShapeR: 'open', noShadow: true, rot: fly * 8, sq: -.05 });
      }
      twinkle(1060, 520, t - (UNROLLED + .5), 44, 'lrtw');
    }
    // the upside-down one
    const burT = UNROLL + (UNROLLED - UNROLL) * .12;
    if (t < burT) buriedClone(BURIED[0], BURIED[1], BURIED[2], t - CHAKRA - .5, 'buried');
    vanishPuff(BURIED[0], BURIED[1] - 80, 130, t - burT, 'burpop', RK.puff);
    // the blown-away slots at her landing
    [[KX + 240, KY + 30, 200, .18], [KX + 560, KY + 60, 230, .26], [KX + 880, KY + 40, 220, .34], [KX - 60, KY + 60, 180, .22]].forEach(([x, y, r, d], k) => dust(x, y, r, t - KLAND - d, 'blow' + k));
    // the drops of every hit, flying from the clones onto the tongue
    CROWD.forEach(s => { const k = seg(t, s.dies, s.dies + .32); if (k > 0 && k < 1) dropArc([s.x, s.y - s.u * 6], [clamp(s.x, ROOT[0] + 40, 1340), LY], 120, k, 'ed' + s.seed, 9 * clamp(s.u / 20, .6, 1.4), 1.2); });
    if (inW(t, SLAP3, SLAP3 + .35)) dropArc([CX + 20, CY - CU * 12], [840, LY], 160, seg(t, SLAP3, SLAP3 + .35), 'lastdrop', 12, 1.3);
    // Kali, in front of everything; the chakra looping through them
    kali(KX, KY, KU, ko);
    if (t > CARPET && t < SLURP + .3) {
      tongueCarpet({ mouth: kaliMouth(KX, KY, KU, ko), root: ROOT, front: Math.max(ROOT[0] + 1, front), y: LY, w: LW, u: KU, roll: rollAt(t), drops, key: 'tcar',
        bump: inW(t, BOOP - .2, BOOP + .4) ? { x: SELF[0], k: Math.sin(seg(t, BOOP - .2, BOOP + .4) * Math.PI) * .8 } : null });
    }
    if (inW(t, NOTONE + .1, NODROPS - .1)) { const a = (t - NOTONE) * 4.2; push(); translate(1000 + Math.cos(a) * 520, 1450 + Math.sin(a) * 200); glow(0, 0, 80, '#9C8CF0', .8); chakra(20, 1.4, t * 30); pop(); }
    // her landing
    crack(KX, KY, t - KLAND - .16, 340, 'kcrack');
    dust(KX - 160, KY - 20, 160, t - KLAND - .16, 'kd1'); dust(KX + 200, KY - 10, 150, t - KLAND - .2, 'kd2');
    if (t < KLAND + .16) streak([KX + 260, -900], [KX, KY - KU * 20], 1, t, 'estreak');
    impact(KX, KY - KU * 10, t - KLAND - .16, 360, 'kimp');
    impact(CX + 30, CY - CU * 6, t - SLAP3, 70, 'eimp');
    camEnd();
    if (lt < .5) zoomLines(540, 900, 1 - lt / .5, t, '#C8D2FF');
    if (inW(t, F0 - .3, F0)) whipH(seg(t, F0 - .3, F0), 1, t);
    caps(t);
  }

  // ================= F + G · reason 2: the dance, Shiva, OOPS; the recap and the ask =================
  const FKX = 640, FKY = 1700, FKU = 24, SWX = 600, SWY = 1800, SWU = 15, FSX = 360, FSY = 1730, FSU = 15, FDX = 200, FDY = 1720, FDU = 13;
  const beatAge = t => { const b = bpOf(t); return frac(b) * BEAT; };
  function kaliF(t) {
    const dancing = inW(t, DANCE, HOPON), b = bpOf(t), side = Math.floor(b) % 2 ? 1 : -1, ph = frac(b);
    const o = { boilKey: 'kalif', eyes: 'happy', wild: 1, aura: .4, auraCol: '#5A6CFF', seed: 4, tongueWag: Math.sin(t * 8) * .3, hair: .3 * Math.sin(t * 2) };
    if (t < DANCE) { o.eyes = 'happy'; o.sq = spring(t, R2, 8, 16) * .04; }
    if (dancing) {
      const up = Math.sin(ph * Math.PI), k = clamp((t - DANCE) / 1.2);
      o.dy = -up * 1.4 * k; o.rot = side * .09 * k * Math.sin(ph * Math.PI); o.walk = b * .5; o.lean = side * .6 * k;
      o.handL = [-4.6 - side * .8, -15 - up * 2.5]; o.backR = [6.4, -21 - up * 1.5]; o.backL = [-6.6, -20 + up * 1.2]; o.handR = [5.2, -16 + up * 2];
      o.hair = side * .6; o.sq = (ph < .15 ? .08 : 0) * k; o.tongueWag = side * .5;
    }
    // the hop onto him, the stomp, the freeze; "wait…"; the bite
    const hop = seg(t, HOPON, STEP), chest = shivaLieChest(SWX, SWY, SWU);
    o.pos = hop > 0 ? arcPt([FKX, FKY], [chest[0] + 6, chest[1] + 12], 160, ease(hop)) : [FKX, FKY];
    if (hop > 0) { o.dy = 0; o.rot = hop < 1 ? -.08 * Math.sin(hop * Math.PI) : 0; o.walk = undefined; o.lean = 0; o.sq = hop < 1 ? -.06 : spring(t, STEP, 8, 14) * .1; o.handL = [-5, -15]; o.handR = [5.2, -15]; o.backR = undefined; o.backL = undefined; o.hair = .2; }
    if (t > WAIT) { o.eyes = 'normal'; o.lookY = 1; o.lookX = -.4; o.tongueWag = 0; o.brows = .2; o.hx = -.15; }
    if (t > HUSB) { o.eyes = 'wide'; o.brows = 1; o.emote = 'sweat'; o.emoteK = backOut(seg(t, HUSB, HUSB + .3)); }
    if (t > BITE) {
      const k = ease(seg(t, BITE, BITE + .25));
      o.bite = 1; o.tongue = .62; o.tongueLen = 2.6; o.eyes = 'wide'; o.lookY = .4; o.lookX = -.3; o.brows = .8; o.emote = undefined;
      o.handL = [lerp(-5, -2.7, k), lerp(-15, -18.3, k)]; o.handR = [lerp(5.2, 2.7, k), lerp(-15, -18.3, k)]; o.kapala = k < .5; o.abhaya = k < .5;
      o.sq = spring(t, BITE, 9, 18) * .05; o.htilt = .06 * Math.sin(t * 2);
    }
    if (t > ASK) { o.eyes = 'happy'; o.brows = 0; o.handR = [5.6, -19 + Math.sin(t * 9) * .8]; o.abhaya = true; }
    return o;
  }
  function shotDance(t, lt) {
    const dancing = inW(t, DANCE, HOPON), ba = dancing ? beatAge(t) : 9;
    const sh = shakeXY(t, (dancing ? 14 * Math.max(0, 1 - ba / .25) * clamp((t - DANCE) / 1.5 + .4) : 0) + 12 * Math.max(0, 1 - Math.abs(t - STEP) / .2));
    const freeze = inW(t, STEP, STEP + .25);
    const c = camK(t, [[F0, [560, 1330, 1.12]], [SHIVA, [560, 1340, 1.1]], [STEP, [560, 1340, 1.1]], [STEP + .2, [540, 1420, 1.2]], [BITE, [540, 1420, 1.22]], [RECAP, [550, 1400, 1.14]], [ASK, [560, 1360, 1.0]], [WIPE, [560, 1360, 1.02]]], sh);
    nightSet(t, { bounce: dancing ? clamp((t - DANCE) / 1.5 + .3) : 0, beat: ba, moonX: 760, moonY: 870 });
    const hopK = dancing ? Math.max(0, 1 - ba / .3) * Math.sin(Math.min(1, ba / .3) * Math.PI) : 0;
    // Durga: holding on to her mukut; laughing behind her hand later
    const dO = { ...DRG_SKIN, boilKey: 'durf', eyes: t > SHOOK ? 'wide' : 'happy', mouth: t > SHOOK ? 'O' : 'smile', hair: .3, wild: .3, fire: .5, handL: [-5.4, -18.6], trishulA: -.25, lookX: .8, dy: -hopK * 1.2 };
    if (t > SHOOK && t < SHIVA + .8) { dO.handR = [.8, -25.5]; }
    if (t > SHIVA + .8) { dO.eyes = 'normal'; dO.mouth = 'flat'; dO.browL = .6; }
    if (t > OOPS) { dO.eyes = 'happy'; dO.mouth = 'smile'; dO.handR = [.5, -18.3]; dO.sq = Math.abs(Math.sin(t * 12)) * .02; dO.browL = 0; }
    durga(FDX, FDY, FDU, dO);
    // Sher: bounced into the air by every stomp; then the blep
    const shO = { boilKey: 'sherf', eyes: t > SHOOK ? 'swirl' : 'happy', mouth: t > SHOOK ? 'O' : 'grin', tail: Math.sin(t * 3) * .6, dy: -hopK * (t > SHOOK ? 5 : 2.5), seed: 3, nod: hopK * .4 };
    if (t > SHIVA + .3) { shO.eyes = 'normal'; shO.mouth = 'O'; shO.lookX = .6; shO.dy = 0; }
    if (t > BITE) { shO.eyes = 'wide'; shO.mouth = 'O'; }
    if (t > BLEP2) { shO.eyes = 'happy'; shO.mouth = 'tongue'; }
    lion(FSX, FSY, FSU, shO);
    // Shiva glides in, lies down; the thumbs-up
    if (t > SHIVA) {
      const g = seg(t, SHIVA, LIE), x = lerp(-520, SWX, easeOut(g)), fl = (1 - easeOut(g)) * 30;
      shivaLie(x, SWY - fl, SWU, { boilKey: 'shivf', thumb: ease(seg(t, THUMB, THUMB + .35)), peek: t > THUMB - .2, mouth: t > THUMB ? 'grin' : 'smile', breathe: Math.sin(t * 1.4) * .06, noShadow: fl > 4 });
      dust(SWX - 120, SWY - 10, 120, t - LIE, 'lied');
    }
    // Kali
    const ko = kaliF(freeze ? STEP + .02 : t), [kx, ky] = ko.pos;
    kali(kx, ky, FKU, { ...ko, noShadow: t > HOPON });
    impact(kx - 80, ky + 10, t - STEP, 70, 'stepimp');
    camEnd();
    if (lt < .4) flash(1 - seg(t, F0, F0 + .4), '#FFF6DC');
    if (t > ASK) veil(RK.ink, .36 * seg(t, ASK, ASK + .4));
    caps(t);
    if (t > WIPE) { flushLetters(); brushWipe((t - WIPE) / .6, [RK.crimson, TK.marigold]); }
  }

  // ================= the card =================
  function shotCard(t, lt) {
    rkCard(t, { cap: CARD_CAP, cover: COVER, row: ROW, price: PRICE, logo: LOGO, pill: PILL, follow: FOLLOW });
    const k = frac((t - FOLLOW) / 1.6);
    if (t > FOLLOW) { flushLetters(); boilSeed('sparkle'); paint(starPts(lerp(240, 700, k), lerp(1000, 760, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [RK.crimson, TK.marigold]); }
  }

  shots([[0, shotHook], [B0, shotSeed], [C0, shotFight], [D0, shotAnger], [KLAND, shotKali], [F0, shotDance], [CARD, shotCard]]);
})();
