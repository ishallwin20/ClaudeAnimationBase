// savitri.js: "She OUTSMARTED YAMRAJ with ONE wish." (ad 24, ~60 s, captions in Bangers, SFX, no voiceover). The
// Mahabharata's Savitri (Vana Parva 277–283): she chooses Satyavan though Narad warns he'll die in a year; on the day
// Yama draws out his thumb-sized soul and walks south; she follows, talks dharma, wins three boons (anything but his
// life), then a fourth, a hundred sons by Satyavan, and holds Yama to it; he laughs and sets him free for four hundred
// years. Vat Savitri; the ask; the 15K Family Deal card. STORYBOARD.md has the plan and the sources; sets, palettes and
// props are in savitri_props.js. All times are video time (t); tools/savitri_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/savitri_sfx.mjs)
  const SIDE = 1.7, GULP = 2.6, B0 = 3.6;
  const SEE = 4.2, WARN = 6.1, ONCE = 8.8, C0 = 11.0;
  const CHOP1 = 11.55, CHOP2 = 12.25, HURT = 12.75, C2 = 13.8;
  const RED = 15.6, YIN = 16.0, D0 = 18.4;
  const THROW = 18.7, LOOP = 19.2, PULL = 19.7, TURNS = 21.2, RISE = 21.6, E0 = 23.4;
  const GOBACK = 23.5, BOON = 26.0, F0 = 28.8;
  const B1 = 28.8, B2 = 31.2, B3 = 33.6, G0 = 36.0;
  const TATH = 38.8, TRAP = 40.4, TAKE = 41.6, H0 = 43.6;
  const LET = 44.6, H2 = 46.0, LAND = 46.45, WAKE = 46.8, JOY = 47.3, I0 = 48.8;
  const J0 = 52.2, WINK = 54.2, CARD = 55.6;
  const CAP_T = CARD + .1, COVERS = CARD + .4, PRICE = CARD + 1.2, STRIKE = CARD + 1.7, DEAD = CARD + 2.2, PILL = CARD + 2.7, SUB = CARD + 3.2, FOLLOW = CARD + 3.6;
  const CARDC = { cap: CAP_T, covers: COVERS, price: PRICE, strike: STRIKE, dead: DEAD, pill: PILL, sub: SUB, follow: FOLLOW, logo: CAP_T - .1 };

  const GOLDC = '#F5C542', G = 1480;

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['She OUTSMARTED', 480, -1, B0 - .1 + 1, 72], ['YAMRAJ', 600, -1, B0 - .1 + 1, 132, GOLDC], ['with ONE wish.', 722, -1, B0 - .1 + 1, 78],
    ['Princess SAVITRI chose', 480, B0 + .15, WARN - B0 - .25, 66], ['SATYAVAN, a forest prince.', 572, B0 + .45, WARN - B0 - .55, 62, GOLDC],
    ['Narad Muni WARNED:', 480, WARN, ONCE - WARN - .1, 70], ['"He will DIE in ONE year!"', 578, WARN + .35, ONCE - WARN - .45, 74, GOLDC],
    ['She said: "I chose ONCE.', 480, ONCE, C0 - ONCE - .1, 66], ['I won\'t choose AGAIN."', 574, ONCE + .35, C0 - ONCE - .45, 76, GOLDC],
    ['One year later.', 480, C0 + .1, C2 - C0 - .2, 70], ['The LAST day.', 582, C0 + .4, C2 - C0 - .5, 92, GOLDC],
    ['His head HURT…', 480, C2 + .1, RED - C2 - .2, 72], ['he lay down in her lap.', 576, C2 + .4, RED - C2 - .5, 66],
    ['And then…', 480, RED, D0 - RED - .1, 70], ['YAMRAJ came.', 592, RED + .5, D0 - RED - .6, 112, GOLDC],
    ['He pulled out his SOUL,', 480, D0 + .2, TURNS - D0 - .3, 68], ['no bigger than a THUMB.', 576, D0 + .5, TURNS - D0 - .6, 72, GOLDC],
    ['He walked away…', 480, TURNS, E0 - TURNS - .1, 70], ['and Savitri FOLLOWED.', 578, TURNS + .4, E0 - TURNS - .5, 78, GOLDC],
    ['"Go BACK!" But she kept', 480, E0 + .1, BOON - E0 - .2, 66], ['walking… and talking DHARMA.', 572, E0 + .45, BOON - E0 - .55, 58, GOLDC],
    ['"Ask a BOON.', 480, BOON, F0 - BOON - .1, 76], ['Anything but his LIFE."', 582, BOON + .35, F0 - BOON - .45, 78, GOLDC],
    ['Boon 1: her blind father-in-law', 480, B1, B2 - B1 - .08, 56], ['could SEE again.', 566, B1 + .3, B2 - B1 - .38, 80, GOLDC],
    ['Boon 2: his lost KINGDOM.', 500, B2, B3 - B2 - .08, 70, GOLDC],
    ['Boon 3: 100 SONS', 480, B3, G0 - B3 - .08, 84, GOLDC], ['for her father.', 582, B3 + .3, G0 - B3 - .38, 66],
    ['Boon 4: "100 sons for ME…', 480, G0 + .1, TATH - G0 - .2, 64], ['with SATYAVAN."', 576, G0 + .45, TATH - G0 - .55, 86, GOLDC],
    ['"TATHASTU!"', 500, TATH, TRAP - TATH - .05, 112, GOLDC], ['(So be it!)', 610, TATH + .3, TRAP - TATH - .35, 56],
    ['"You gave me 100 sons…', 480, TRAP, H0 - TRAP - .1, 66], ['and you\'re taking my HUSBAND?"', 576, TRAP + .5, H0 - TRAP - .6, 62, GOLDC],
    ['Yamraj LAUGHED…', 480, H0 + .1, H2 - H0 - .2, 76], ['and set him FREE.', 582, H0 + .4, H2 - H0 - .5, 86, GOLDC],
    ['"He\'ll live with you', 480, H2 + .2, I0 - H2 - .3, 68], ['400 more YEARS!"', 582, H2 + .5, I0 - H2 - .6, 94, GOLDC],
    ['That\'s why on VAT SAVITRI,', 480, I0 + .1, J0 - I0 - .2, 70, GOLDC], ['wives still FAST for their husbands.', 572, I0 + .45, J0 - I0 - .55, 56],
    ['If YAMRAJ gave YOU one wish,', 480, J0 + .1, CARD - J0 - .25, 62], ['what would you ASK?', 580, J0 + .4, CARD - J0 - .55, 88, GOLDC], ['Comment!', 684, J0 + .7, CARD - J0 - .85, 72],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };
  const camK = (t, keys) => { const c = kf(t, keys, ease); camBegin(c[0], c[1], c[2]); return c; };
  const talkM = (t, a, b, f = 17) => t > a && t < b ? (Math.sin((t - a) * f) > -.2 ? 'open' : 'smile') : null;
  // a face over time (emotions()), with the rig's own skin pinned (emotions() hands over Clawd's colours mid-change)
  const face = (t, keys, skin, o = { take: .4 }) => { const f = emotions(t, keys, o); delete f.dx; delete f.rot; delete f.aL; delete f.aR; delete f.tint; delete f.tintK; return { ...f, col: skin.col, dk: skin.dk, lt: skin.lt }; };
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const GREEN = [SV.leafDk, SV.leaf], GOLDW = [SV.goldLeafDk, SV.goldSky], REDW = [SV.redDk, SV.red], DUSK = [SV.hillDk, SV.duskMid], PEACH = [TK.marigold, TK.petal];

  // the cast
  const sav = (x, y, u, o) => parvati(x, y, u, { boilKey: 'sav', seed: 3, ...o, pal: SAV, ...SAV_SKIN });
  const sat = (x, y, u, o) => narada(x, y, u, { boilKey: 'sat', seed: 2, veena: false, topknot: false, hat: bunHat, ...o, pal: SATYA, ...SATYA_SKIN });
  const nar = (x, y, u, o) => narada(x, y, u, { boilKey: 'nar', seed: 1, ...o, ...NRD_SKIN });
  const ym = (x, y, u, o) => yama(x, y, u, { boilKey: 'yama', seed: 4, gada: false, ...o });
  // a world point → a hand target (body u) for a rig standing at (x, y, u) (no flip, no lean)
  const hand = (x, y, u, px, py) => [(px - x) / u, (py - y) / u];
  // Satyavan lying on his back, head to screen-left, on the line y (his middle); hx = the head's x
  const SATU = 19, lieX = hx => hx + 20.6 * SATU * 1.0;
  const lying = (hx, y, o = {}) => sat(lieX(hx), y, SATU, { boilKey: 'satl', rot: -Math.PI / 2 + .05, noShadow: true, eyes: 'closed', mouth: 'flat', ...o });
  const chest = (hx, y) => [lieX(hx) - 14.6 * SATU, y];
  // Savitri sitting with his head in her lap: she's sunk SINK u into the ground and her saree spreads round her
  const SVU = 20, SINK = 8.0;
  const seated = (x, o = {}) => { sav(x, G + SINK * SVU, SVU, { noShadow: true, crown: false, ...o }); };
  const groundFront = (col, y = G + 8) => { boilSeed('gfront'); paint(rectPts(-200, y, W + 400, H - y + 400), { wash: col, ink: null }); };

  // ================= A · Yama close: stern; a glance aside, a sweat drop, a gulp =================
  const YX = 560, YG = 2250, YU = 46;
  function shotHook(t, lt) {
    const c = camK(t, [[0, [540, 960, 1]], [B0, [540, 940, 1.04]]]);
    redGround(t, YX, 1180, 1);
    const f = face(t, [
      [0, 'angry', { eyes: 'normal', mouth: 'flat', brow: -.8, emote: null }],
      [SIDE, 'nervous', { eyes: 'look', mouth: 'flat', brow: .5, emote: null }],
      [GULP, 'nervous', { eyes: 'wide', mouth: 'O', brow: .8, emote: null }],
    ], YAMA_SKIN, { take: .25 });
    const side = ease(seg(t, SIDE - .15, SIDE + .2));
    ym(YX, YG, YU, { ...f, hx: -.25 * side, lookX: -.9 * side, lookY: side * .2, glow: .35 * (1 - side), sweat: t > SIDE + .2 ? 1 : 0, dy: (f.dy || 0) * .2 + (t > GULP && t < GULP + .3 ? Math.sin(seg(t, GULP, GULP + .3) * Math.PI) * .25 : 0), sq: (f.sq || 0) * .3,
      handL: [-4.4, -17.6], bendL: -1.2, noShadow: true });
    camEnd();
    wipeOut(lt, B0, GREEN);
    caps(t);
  }

  // ================= B · the forest: she chooses him; Narad's warning; "I chose ONCE" =================
  function shotChoose(t, lt) {
    const c = camK(t, [[B0, [540, 1010, 1.0]], [WARN, [540, 1015, 1.02]], [ONCE, [520, 1035, 1.06]], [C0, [500, 1045, 1.08]]]);
    forestSet(t, 0, { hut: [880, G - 300] });
    // Satyavan, the axe over his shoulder, walks in from the right and stops
    const inK = easeOut(seg(t, B0, B0 + 1.2)), sx = lerp(1150, 800, inK);
    const sf = face(t, [[0, 'happy', { eyes: 'normal', mouth: 'smile' }], [SEE + .4, 'shy', { eyes: 'happy', mouth: 'smile', blush: .8 }], [WARN + .3, 'surprised', { eyes: 'wide', mouth: 'O' }], [ONCE + .5, 'love', { eyes: 'normal', mouth: 'smile', blush: .9 }]], SATYA_SKIN);
    sat(sx, G, 19, { ...sf, walk: inK < 1 ? (t - B0) * 1.7 : undefined, hx: t < WARN ? -.5 : t < ONCE ? -.2 : -.6, lookX: t < WARN ? -.8 : t < ONCE ? -.3 : -.8, lookY: t > WARN && t < ONCE ? -.7 : 0,
      handR: [3.0, -18.6], bendR: 1.6, armR: (u, sw) => axe(u * 1.15, sw, -.5), dy: (sf.dy || 0) * .3, sq: (sf.sq || 0) * .3 });
    // Savitri, a princess, sees him: hearts; then resolute, a hand on her heart, chin up
    const vf = face(t, [
      [0, 'neutral', { eyes: 'look', mouth: 'smile' }],
      [SEE, 'love', { eyes: 'normal', mouth: 'smile', emote: 'hearts', blush: 1 }],
      [WARN + .4, 'scared', { eyes: 'wide', mouth: 'O', emote: null }],
      [ONCE, 'determined', { eyes: 'normal', mouth: 'flat', emote: null }],
    ], SAV_SKIN);
    const res = ease(seg(t, ONCE - .1, ONCE + .3));
    sav(280, G, 20, { ...vf, hx: t < WARN + .3 ? .5 : t < ONCE ? .2 : .3, lookX: t < WARN + .3 ? .8 : t < ONCE ? .3 : .6, lookY: t > WARN + .3 && t < ONCE ? -.7 : 0, htilt: -.12 * res,
      handL: res > 0 ? [lerp(-2.6, -.4, res), lerp(-11.2, -15.2, res)] : undefined, bendL: -.5, dy: (vf.dy || 0) * .3, sq: (vf.sq || 0) * .3, mouth: talkM(t, ONCE + .15, ONCE + 1.6) || vf.mouth });
    // Narad pops in on his cloud above them, points at Satyavan, warns
    if (t > WARN - .15) {
      const pk = backOut(clamp((t - WARN + .15) / .45)), pt = ease(seg(t, WARN + .3, WARN + .6));
      const nf = face(t, [[0, 'surprised', { eyes: 'wide', mouth: 'O' }], [WARN + .5, 'scared', { eyes: 'wide', mouth: 'open', brow: 1 }], [ONCE, 'sad', { eyes: 'normal', mouth: 'frown', brow: 1 }]], NRD_SKIN);
      nar(560, 1150 - (1 - pk) * 500, 15, { ...nf, cloud: 1, hx: t < ONCE ? .5 : -.4, lookX: t < ONCE ? .7 : -.6, lookY: .4, mouth: talkM(t, WARN + .4, WARN + 2.0) || nf.mouth, dy: Math.sin(t * 2.4) * .25,
        handR: pt > 0 ? [lerp(3.45, 6.4, pt), lerp(-10.8, -17.4, pt)] : undefined, bendR: .4 });
    }
    camEnd();
    wipeIn(lt, GREEN);
    wipeOut(lt, C0 - B0, GOLDW);
    caps(t);
  }

  // ================= C1 · the last day: he chops wood; his head hurts; he sways =================
  function shotChop(t, lt) {
    const c = camK(t, [[C0, [540, 1010, 1.0]], [HURT, [560, 1032, 1.05]], [C2, [500, 1060, 1.12]]]);
    forestSet(t, 1, {});
    // the log on its stump
    boilSeed('log');
    paint(rrPts(780, G - 70, 200, 80, 20), { wash: SV.bark, ink: SV.ink, sw: 1 });
    paint(ellPts(980, G - 30, 22, 40, 14), { wash: '#C9A06A', ink: SV.ink, sw: .8 });
    // Savitri watches, hands clasped, worried
    const vf = face(t, [[0, 'nervous', { eyes: 'look', mouth: 'flat', emote: null }], [HURT + .2, 'scared', { eyes: 'wide', mouth: 'O', emote: '!' }]], SAV_SKIN, { take: .7 });
    const reach = ease(seg(t, HURT + .3, HURT + .7));
    sav(250, G, 20, { ...vf, crown: false, hx: .4, lookX: .7, pray: t < HURT ? .8 : 0, handR: reach > 0 ? [lerp(3.4, 6.2, reach), lerp(-11, -16.6, reach)] : undefined, bendR: .3, dy: (vf.dy || 0) * .4, sq: (vf.sq || 0) * .4 });
    // Satyavan: two chops, then the pain
    const ch = t < HURT ? Math.min(seg(t, C0 + .1, CHOP1), 1) : 1;
    const swing = t < CHOP1 ? ease(seg(t, CHOP1 - .5, CHOP1 - .08)) * (1 - easeIn(seg(t, CHOP1 - .08, CHOP1))) : t < CHOP2 ? ease(seg(t, CHOP2 - .5, CHOP2 - .08)) * (1 - easeIn(seg(t, CHOP2 - .08, CHOP2))) : 0;
    const hurt = ease(seg(t, HURT, HURT + .25)), sway = t > HURT ? Math.sin((t - HURT) * 5) * .07 * seg(t, HURT, HURT + .3) : 0, sink = easeIn(seg(t, C2 - .5, C2));
    const sf = face(t, [[0, 'determined', { eyes: 'normal', mouth: 'flat' }], [HURT, 'dizzy', { eyes: 'squeeze', mouth: 'wobble', sweat: 1 }]], SATYA_SKIN, { take: .6 });
    const so = { ...sf, hx: .3, lookX: .4, lookY: .5, rot: sway, dy: (sf.dy || 0) * .3 + sink * 3, sq: (sf.sq || 0) * .3 };
    if (hurt > 0) { so.handL = [lerp(-3.4, -2.8, hurt), lerp(-10.8, -23.4, hurt)]; so.handR = [lerp(5.2, 2.8, hurt), lerp(-14, -23.6, hurt)]; so.bendL = 1.4; so.bendR = 1.4; }
    else { so.handR = [lerp(6.2, 2.6, swing), lerp(-9.0, -27.4, swing)]; so.bendR = lerp(.6, 1.2, swing); so.armR = (u, sw) => axe(u * 1.2, sw, lerp(2.4, -.6, swing)); so.handL = [lerp(-3.4, 1.8, ch * .5), -13.2]; }
    sat(640, G, 21, so);
    // wood chips on each chop; the axe dropping on the pain
    for (const [k, tc] of [[0, CHOP1], [1, CHOP2]]) if (t > tc && t < tc + .6) { boilSeed('chip' + k); for (let i = 0; i < 4; i++) { const q = (t - tc) / .6, a = -1.2 - i * .4; paint(rectPts(860 + Math.cos(a) * q * 160, G - 90 - Math.sin(-a) * q * 140 + q * q * 160, 14, 8), { wash: '#E2C08A', ink: SV.ink, sw: .5 }); } }
    if (t > HURT) { boilSeed('axefall'); const q = easeIn(seg(t, HURT, HURT + .35)); push(); translate(lerp(640 + 6.2 * 21, 760, q), lerp(G - 9 * 21, G - 30, q)); axe(25, 1, lerp(2.4, 4.4, q)); pop(); }
    camEnd();
    wipeIn(lt, GOLDW);
    if (t > C2 - .12) { flushLetters(); flash(seg(t, C2 - .12, C2), '#FFF1D6'); }
    caps(t);
  }

  // ================= C2 + D · the lap; Yama comes; the noose; the soul; he walks off, she follows =================
  const SVX = 300, HDX = 425, LY = G - 3.4 * SATU, YMX = 820, YMU = 19;
  function shotLap(t, lt) {
    const c = camK(t, [[C2, [520, 1088, 1.2]], [RED, [540, 1075, 1.16]], [YIN + 1, [600, 1028, 1.04]], [D0, [600, 1010, 1.0]], [THROW + .4, [580, 1060, 1.12]], [PULL + .2, [560, 1120, 1.32]], [TURNS - .2, [575, 1120, 1.34]], [TURNS + .5, [640, 1020, 1.02]], [E0, [700, 1000, .98]]]);
    forestSet(t, 1, { mid: false });
    const red = ease(seg(t, RED - .2, RED + .8));
    if (red > 0) { boilSeed('redwash'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: SV.red, washOp: 150 * red, ink: null }); glow(YMX, G - 280, 520, '#FF4A2E', .45 * red); }
    // Yama descends in red light, his buffalo with him; then throws the noose
    const yk = easeOut(seg(t, YIN, YIN + 1.1)), away = ease(seg(t, TURNS, TURNS + .35)), wk = seg(t, TURNS + .2, E0);
    const yx = YMX + wk * 520;
    const thr = ease(seg(t, THROW - .25, THROW)) * (1 - ease(seg(t, PULL + .3, PULL + .8)));
    let yo = null;
    if (t > YIN) {
      if (yk < 1) { boilSeed('smoke'); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + t, r = 90 + yk * 60; paint(ellPts(YMX + Math.cos(a) * r, G - 30 + Math.sin(a) * 26, 70 * (1 - yk * .5), 34, 12), { wash: '#5E1A2A', washOp: 200 * (1 - yk), ink: null }); } }
      const yf = face(t, [[0, 'angry', { eyes: 'normal', mouth: 'flat', brow: -.8, emote: null }], [PULL + .4, 'neutral', { eyes: 'normal', mouth: 'flat', brow: -.4 }]], YAMA_SKIN, { take: .2 });
      yamaBuffalo(yx + 230, G - 10, 15, { boilKey: 'buf', run: wk > 0 ? (t - TURNS) * 1.2 : null, stride: .35, dy: -(1 - yk) * 18, noShadow: yk < .6 });
      yo = { ...yf, glow: t < PULL ? .7 * yk : .2, dy: -(1 - yk) * 18, hx: lerp(-.5, .5, away), lookX: lerp(-.8, .8, away), lookY: .4 * (1 - away), walk: wk > 0 ? (t - TURNS) * 1.6 : undefined,
        handL: [lerp(-3.6, -6.4, thr), lerp(-11.4, -18.6, thr)], bendL: lerp(.4, -.6, thr), pasha: t > THROW ? .35 : 1, noShadow: yk < .6 };
      ym(yx, G - 10, YMU, yo);
    }
    // the couple: she sits with his head in her lap, then rises and follows
    const rise = ease(seg(t, RISE, RISE + .5)), goK = seg(t, RISE + .5, E0), svx = lerp(SVX, SVX + 380, ease(goK));
    const vf = face(t, [
      [0, 'sad', { eyes: 'look', mouth: 'frown' }],
      [RED + .2, 'scared', { eyes: 'wide', mouth: 'O', emote: '!' }],
      [PULL + .2, 'cry', { eyes: 'wide', mouth: 'wail', emote: null }],
      [RISE, 'determined', { eyes: 'normal', mouth: 'flat', emote: null }],
    ], SAV_SKIN, { take: .6 });
    const hp = [HDX + 10, LY - 1.5 * SATU];
    const svo = { ...vf, crown: false, noShadow: rise < .9, hx: t < RED + .2 ? .2 : .5, lookX: t < RED + .2 ? .3 : .8, lookY: t < RED + .2 ? .8 : -.3, dy: (vf.dy || 0) * .3 + (1 - rise) * SINK, sq: (vf.sq || 0) * .3,
      walk: goK > 0 && goK < 1 ? (t - RISE) * 1.8 : undefined };
    if (rise < .3) { svo.handR = hand(SVX, G + SINK * SVU, SVU, hp[0] + 20, hp[1] - 6); svo.handL = hand(SVX, G + SINK * SVU, SVU, hp[0] - 50, hp[1] + 26); svo.bendR = -.4; if (t > PULL + .2 && t < RISE) svo.handL = [5.6, -17.4]; }
    sav(svx, G, SVU, svo);
    groundFront(mixCol(SV.goldGround, SV.red, .55 * red), G + 8);
    if (rise < 1) lapMound(SVX, G, SVU * (1 - rise * .85));
    // Satyavan lying; when she rises, his head sinks to the ground
    const ly = lerp(LY, G - 3.1 * SATU, rise);
    lying(HDX, ly, { eyes: 'closed', mouth: t < YIN ? 'wobble' : 'flat', handR: t < YIN ? [2.6, -19.5] : undefined, bendR: 1.2 });
    const lieHX = HDX;
    // the noose: out to his chest, then the soul drawn up out of him, then towed on the rope
    if (t > THROW && yo) {
      const [hx, hy] = shaniHand(yx, G - 10, YMU, yo, -1);
      const [cx, cy] = chest(lieHX, ly);
      const fly = seg(t, THROW, LOOP);
      const out = ease(seg(t, PULL, PULL + .9));
      const tow = wk > 0 ? [hx - 150 - Math.sin(t * 3) * 10, hy + 90 + Math.sin(t * 2.3) * 12] : null;
      const sp = tow ? [lerp(lerp(cx, hx - 150, out), tow[0], ease(seg(t, TURNS, TURNS + .6))), lerp(lerp(cy - 20, hy + 90, out), tow[1], ease(seg(t, TURNS, TURNS + .6)))] : [lerp(cx, hx - 150, out), lerp(cy - 20, hy + 90 - Math.sin(out * Math.PI) * 120, out)];
      const end = t < PULL ? [cx, cy - 30] : sp;
      yamaNoose([[hx, hy + 30], [lerp(hx, end[0], .5), Math.min(hy, end[1]) - 80 * (1 - out) + (t > PULL ? 40 : 0)], end], t < LOOP ? fly : 1, 'rope', 1.6, t < PULL ? 1.3 : .5);
      if (t > PULL) soul(sp[0], sp[1] + 40, 6, { boilKey: 'soul', eyes: 'closed', rot: Math.sin(t * 2.4) * .12, pray: 1 });
      if (t > PULL && t < PULL + .5) { glow(cx, cy, 160, '#FFE08A', .8 * (1 - seg(t, PULL, PULL + .5))); sparkleBurst(cx, cy, 60, t - PULL, 'pullburst'); }
    }
    camEnd();
    if (lt < .3) { flushLetters(); flash(1 - lt / .3, '#FFF1D6'); }
    wipeOut(lt, E0 - C2, DUSK);
    caps(t);
  }

  // ================= E · F · G · the road south: "Go back!"; the boons; the trap =================
  const RYX = 690, RSX = 300, RU = 18;
  const vig = {
    eyes: (cx, cy, k, t) => { narada(cx, cy + 150, 11, { pal: DYU, col: DYU.skin, dk: DYU.skinDk, lt: DYU.skinLt, beard: '#EDE6DC', veena: false, topknot: false, hat: crownHat, boilKey: 'dyu', seed: 7, eyes: k > 0 ? 'wide' : 'closed', mouth: k > 0 ? 'grin' : 'flat', noShadow: true, handR: k > 0 ? [4.4, -20] : undefined, bendR: 1 }); if (k > 0) sparkleBurst(cx, cy - 100, 90, k, 'eyeburst', 10); },
    crown: (cx, cy, k, t) => { const drop = easeIn(clamp(k / .35)); narada(cx, cy + 150, 11, { pal: DYU, col: DYU.skin, dk: DYU.skinDk, lt: DYU.skinLt, beard: '#EDE6DC', veena: false, topknot: false, boilKey: 'dyu', seed: 7, eyes: 'happy', mouth: k > .35 ? 'grin' : 'smile', noShadow: true,
      hat: (u, sw) => { push(); translate(0, -(1 - drop) * 14 * u); crownHat(u, sw); pop(); }, dy: k > .35 ? -Math.abs(Math.sin((k - .35) * 12)) * .6 : 0 }); if (k > .35) sparkleBurst(cx, cy - 100, 90, k - .35, 'crownburst', 10); },
    sons: (cx, cy, k, t) => { narada(cx, cy + 150, 11, { pal: ASV, col: ASV.skin, dk: ASV.skinDk, lt: ASV.skinLt, beard: '#4A3E4E', veena: false, topknot: false, hat: crownHat, boilKey: 'asv', seed: 8, eyes: k > 0 ? 'wide' : 'happy', mouth: k > 0 ? 'grin' : 'smile', noShadow: true, handL: [-4.4, -20], handR: [4.4, -20], bendL: -1, bendR: 1 }); babies(cx, cy + 40, 14, t, k * 1.4, 'sons'); },
  };
  function shotRoad(t, lt) {
    const inG = ease(seg(t, G0 - .2, G0 + .8));
    const c = camK(t, [[E0, [560, 1010, 1.0]], [F0, [560, 1010, 1.0]], [G0 - .2, [560, 1010, 1.0]], [G0 + .8, [500, 1130, 1.32]], [TAKE, [520, 1135, 1.34]], [H0, [530, 1140, 1.36]], [LET + .3, [520, 1090, 1.2]], [H2, [520, 1080, 1.16]]]);
    const stop = ease(seg(t, TAKE - .05, TAKE + .2));   // the take stops everyone in their tracks
    const walkT = t < TAKE ? t : TAKE + (t - TAKE) * (1 - stop);
    southRoad(t, { pan: -(walkT - E0) * 70 });
    // the buffalo plods behind Yama
    yamaBuffalo(RYX + 240, G - 6, 15, { boilKey: 'buf', run: walkT * 1.2, stride: .3 * (1 - stop), emote: t > TAKE + .3 && t < H0 + .4 ? '?' : null, emoteK: clamp((t - TAKE - .3) * 4) });
    // Yama: "Go back!" over his shoulder; listens; softens; offers a boon; three tathastus; the absent-minded fourth; the take; the laugh
    const back = t < BOON ? ease(seg(t, GOBACK, GOBACK + .25)) * (1 - ease(seg(t, GOBACK + 1.5, GOBACK + 1.9))) : 0;
    const yf = face(t, [
      [0, 'angry', { eyes: 'normal', mouth: 'open', brow: -1, emote: null }],
      [GOBACK + 1.0, 'angry', { eyes: 'normal', mouth: 'flat', brow: -.8, emote: null }],
      [GOBACK + 1.7, 'thinking', { eyes: 'look', mouth: 'flat', brow: .2 }],
      [BOON - .3, 'happy', { eyes: 'normal', mouth: 'smile', brow: .6 }],
      [G0, 'bored', { eyes: 'normal', mouth: 'flat', lid: .55, brow: 0 }],
      [TAKE, 'surprised', { eyes: 'wide', mouth: 'open', brow: 1, emote: '!' }],
      [H0, 'laugh', { eyes: 'closed', mouth: 'laugh', brow: .8, emote: null }],
    ], YAMA_SKIN, { take: .6 });
    const boonK = (b) => ease(seg(t, b + .35, b + .6)) * (1 - ease(seg(t, b + 1.6, b + 2.0)));
    const palm = Math.max(t > BOON && t < F0 ? ease(seg(t, BOON + .1, BOON + .4)) : 0, boonK(B1), boonK(B2), boonK(B3));
    const wave = t > TATH - .1 && t < TRAP ? Math.sin((t - TATH) * 9) * .5 + .5 : 0, waveK = ease(seg(t, TATH - .15, TATH + .1)) * (1 - ease(seg(t, TRAP - .3, TRAP)));
    const turnTo = t < BOON ? back : t < G0 ? ease(seg(t, BOON - .2, BOON + .2)) * .8 : t < TAKE ? 0 : 1;
    const laugh = t > H0 ? Math.abs(Math.sin((t - H0) * 11)) : 0;
    const yo = { ...yf, walk: walkT * 1.6, hx: lerp(.45, -.6, turnTo), lookX: lerp(.7, -.9, turnTo), lookY: 0, lid: t > G0 && t < TAKE ? .55 : 0,
      dy: (yf.dy || 0) * .4 - laugh * .4 - (t > TAKE && t < TAKE + .35 ? Math.sin(seg(t, TAKE, TAKE + .35) * Math.PI) * 1.4 : 0), sq: (yf.sq || 0) * .5, sweat: t > TAKE + .1 && t < H0 + .2 ? 1 : 0, htilt: t > H0 ? -.08 : 0, emoteK: clamp((t - TAKE) * 4) };
    if (back > 0) { yo.handR = [lerp(3.45, 5.6, back) + Math.sin(t * 14) * .3 * back, lerp(-10.8, -21.2, back)]; yo.bendR = 1.2; }
    else if (palm > 0) { yo.handR = [lerp(3.45, 5.0, palm), lerp(-10.8, -19.6, palm)]; yo.bendR = 1.3; }
    else if (waveK > 0) { yo.handR = [lerp(3.45, 5.8, waveK) + wave * .6, lerp(-10.8, -17.6, waveK) - wave * .4]; yo.bendR = 1.2; }
    // the soul on the rope, from his left (screen-left) hand, floating between them; at LET the loop opens
    const slack = t > TAKE ? ease(seg(t, TAKE, TAKE + .3)) * .6 : 0;
    yo.handL = [-4.0, -12.2 + slack * 2]; yo.bendL = .4; yo.pasha = .35;
    ym(RYX, G, RU, yo);
    const [hx, hy] = shaniHand(RYX, G, RU, yo, -1);
    const free = seg(t, LET, LET + 1.0);
    const sx0 = hx - 170 + Math.sin(t * 2.2) * 14, sy0 = hy + 150 + Math.sin(t * 1.7) * 12 + slack * 70;
    const fp = free > 0 ? [lerp(sx0, -200, easeIn(free)), lerp(sy0, 700, easeIn(free)) - Math.sin(free * Math.PI) * 200] : [sx0, sy0];
    yamaNoose([[hx, hy + 30], [lerp(hx, sx0, .5), lerp(hy, sy0, .5) + 30 + slack * 60], [sx0, sy0 - 46]], 1, 'rope', 1.6, free > 0 ? .9 + free : .5);
    if (free > 0) goldTrail([[sx0, sy0], [lerp(sx0, -200, .5), lerp(sy0, 700, .5) - 200], [-200, 700]], easeIn(free), 'freetrail');
    soul(fp[0], fp[1], 6, { boilKey: 'soul', eyes: free > 0 ? 'happy' : 'closed', mouth: 'smile', rot: Math.sin(t * 2.4) * .12 + free * -.6, pray: free > 0 ? 0 : 1 });
    // Savitri follows, talks, asks with joined palms, springs the trap with a sweet smile
    const vf = face(t, [
      [0, 'determined', { eyes: 'normal', mouth: 'flat' }],
      [BOON + .4, 'happy', { eyes: 'normal', mouth: 'smile' }],
      [G0, 'happy', { eyes: 'normal', mouth: 'smile' }],
      [TRAP, 'smug', { eyes: ['normal', 'wink'], mouth: 'smirk' }],
      [TAKE + .3, 'smug', { eyes: 'normal', mouth: 'smirk' }],
      [H0 + .3, 'love', { eyes: 'closed', mouth: 'smile', emote: 'hearts', blush: 1 }],
    ], SAV_SKIN, { take: .4 });
    const asking = (t > B1 && t < G0 && ((t - B1) % 2.4) < 1.0) || (t > G0 && t < TATH);
    const pr = asking ? 1 : t > H0 + .3 ? ease(seg(t, H0 + .3, H0 + .7)) : 0;
    const gest = t > E0 + 1.0 && t < BOON ? ease(seg(t, E0 + 1.0, E0 + 1.3)) : 0;
    const speak = talkM(t, E0 + 1.0, BOON - .2) || (t > B1 && t < G0 && ((t - B1) % 2.4) < .9 ? talkM(t, B1, G0) : null) || talkM(t, G0 + .1, TATH - .2) || talkM(t, TRAP + .1, TAKE - .1);
    sav(RSX, G, RU * 1.05, { ...vf, crown: false, walk: walkT * 1.8, hx: .5, lookX: .8, lookY: -.3, mouth: speak || vf.mouth, pray: pr, dy: (vf.dy || 0) * .3, sq: (vf.sq || 0) * .3,
      handR: gest > 0 ? [lerp(3.4, 5.2, gest) + Math.sin(t * 6) * .4, lerp(-11, -17.4, gest)] : t > TRAP && t < H0 ? [2.0, -13.4] : undefined, handL: t > TRAP && t < H0 ? [-2.0, -13.0] : undefined, bendR: .5 });
    // the boon bubbles, between them
    for (const [b, kind] of [[B1, 'eyes'], [B2, 'crown'], [B3, 'sons']]) {
      const k = seg(t, b + .1, b + .4) * (1 - seg(t, b + 2.15, b + 2.38));
      if (k > 0) bubble(560, 890, 215, k, () => vig[kind](560, 890, t > b + .9 ? (t - b - .9) : 0, t), 380, 1010, 'bub' + kind);
      if (palm > .5 && t > b + .45 && t < b + 1.2) { const [px, py] = shaniHand(RYX, G, RU, yo, 1); sparkleBurst(px, py - 20, 60, t - b - .45, 'palm' + kind); glow(px, py, 90, '#FFE08A', .5); }
    }
    if (t > TATH && t < TATH + 1) { const [px, py] = shaniHand(RYX, G, RU, yo, 1); sparkleBurst(px, py - 20, 70, t - TATH, 'palm4', 10); }
    camEnd();
    wipeIn(lt, DUSK);
    if (t > H2 - .3) { flushLetters(); brushWipe((t - (H2 - .3)) / .6, [SV.goldLeafDk, SV.soul]); }
    caps(t);
  }

  // ================= H2 · the soul comes home; he wakes as if from sleep =================
  function shotWake(t, lt) {
    const c = camK(t, [[H2, [520, 1088, 1.2]], [I0, [520, 1107, 1.26]]]);
    forestSet(t, 1, { mid: false });
    boilSeed('nightwash'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#5E3E7A', washOp: 70, ink: null });
    const vf = face(t, [[0, 'nervous', { eyes: 'look', mouth: 'flat' }], [LAND, 'surprised', { eyes: 'wide', mouth: 'O' }], [JOY, 'love', { eyes: 'closed', mouth: 'grin', emote: 'hearts', blush: 1 }]], SAV_SKIN, { take: .5 });
    const hp = [HDX + 10, LY - 1.5 * SATU];
    seated(SVX, { ...vf, hx: .2, lookX: .4, lookY: .8, handR: hand(SVX, G + SINK * SVU, SVU, hp[0] + 20, hp[1] - 6), handL: t > JOY ? [-2.2, -15.6] : hand(SVX, G + SINK * SVU, SVU, hp[0] - 50, hp[1] + 26), bendR: -.4, emoteK: clamp((t - JOY) * 3) });
    groundFront(mixCol(SV.goldGround, '#3E2A5E', .3), G + 8);
    lapMound(SVX, G, SVU);
    const wake = t > WAKE, yawn = t > WAKE && t < WAKE + .9, str = ease(seg(t, WAKE, WAKE + .4)) * (1 - ease(seg(t, WAKE + .9, WAKE + 1.3)));
    lying(HDX, LY, { eyes: wake ? (yawn ? 'squeeze' : 'normal') : 'closed', mouth: yawn ? 'yawn' : wake ? 'smile' : 'flat', lookX: wake ? -.5 : 0, lookY: -.6,
      handR: str > 0 ? [lerp(3.45, 2.4, str), lerp(-10.8, -27, str)] : undefined, handL: str > 0 ? [lerp(-3.45, -2.6, str), lerp(-10.8, -26, str)] : undefined, bendR: 1, bendL: -1, tint: t > LAND && t < LAND + .6 ? '#FFE08A' : null, tintK: .4 * (1 - seg(t, LAND, LAND + .6)) });
    // the soul flies in from the top-left, along a gold arc, into his chest
    const [cx, cy] = chest(HDX, LY), k = seg(t, H2, LAND);
    if (t < LAND) { const p = [[40, 720], [250, 830], [cx, cy - 20]]; goldTrail(p, ease(k), 'hometrail'); const P = through(p), q = P[Math.floor(ease(k) * (P.length - 1))]; soul(q[0], q[1], 6, { boilKey: 'soul', eyes: 'happy', mouth: 'smile', rot: -.5 }); }
    else if (t < LAND + .5) { glow(cx, cy, 220, '#FFE08A', .9 * (1 - seg(t, LAND, LAND + .5))); sparkleBurst(cx, cy, 90, t - LAND, 'homeburst', 10); }
    camEnd();
    wipeIn(lt, [SV.goldLeafDk, SV.soul]);
    wipeOut(lt, I0 - H2, ['#C9B27A', '#F7D79A']);
    caps(t);
  }

  // ================= I · Vat Savitri: the banyan wound with threads =================
  const WIFE = { saree: '#C8243A', sareeDk: '#961A2C', sareeLt: '#E8606E', blouse: '#E8A82E', blouseDk: '#B8801E', bangle: '#D2283A', veil: '#E8404E', veilDk: '#B82A3A' };
  function shotBanyan(t, lt) {
    const c = camK(t, [[I0, [540, 1080, 1.0]], [J0, [540, 1100, 1.06]]]);
    const k = seg(t, I0, J0), ph = (t - I0) * 1.3;
    banyan(t, 540, G, .45 + k * .55);
    // a wife circles the tree, a thread from her hand to the trunk; she walks behind it and out again
    const s = Math.sin(ph), front = Math.cos(ph) > 0, wx = 540 + s * 260;
    const draw = () => { parvati(wx, G - (front ? 0 : 60), front ? 17 : 14, { pal: WIFE, col: PRV.skin, dk: PRV.skinDk, lt: PRV.skinLt, crown: false, veil: 1, walk: t * 1.6, flip: Math.cos(ph) < 0, boilKey: 'wife', seed: 5, eyes: 'closed', mouth: 'smile', pray: .0, handR: [4.4, -14.6], handL: [-2.6, -13.2], noShadow: !front }); };
    if (!front) draw();
    if (front) { draw(); boilSeed('wthread'); inkLine([[wx + (Math.cos(ph) < 0 ? -1 : 1) * 4.4 * 17, G - 14.6 * 17], [540 + s * 120, G - 200 - k * 160]], 1.6, SV.thread, 'inkfine', .3); }
    camEnd();
    wipeIn(lt, ['#C9B27A', '#F7D79A']);
    wipeOut(lt, J0 - I0, REDW);
    caps(t);
  }

  // ================= J · Yama again: smiling, the noose slack, a wink =================
  function shotWink(t, lt) {
    const c = camK(t, [[J0, [540, 940, 1.04]], [CARD, [540, 960, 1.0]]]);
    redGround(t, YX, 1180, .7);
    const wink = t > WINK && t < WINK + .7;
    ym(YX, YG, YU, { eyes: wink ? ['normal', 'closed'] : 'normal', mouth: wink ? 'grin' : 'smile', brow: .5, hx: .1 + Math.sin(t * 1.4) * .05, lookX: 0, htilt: wink ? .06 : Math.sin(t * 2) * .02, noShadow: true,
      handL: [-3.8, -12.6], bendL: .4, pasha: .35, dy: wink ? -.15 : 0 });
    camEnd();
    wipeIn(lt, REDW);
    if (t > CARD - .3) { flushLetters(); brushWipe((t - (CARD - .3)) / .6, PEACH); }
    caps(t);
  }

  // ================= K · the card =================
  function shotCard(t, lt) {
    dealCard(t, CARDC);
    dealStrike(t, CARDC);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, PEACH); }
  }

  shots([[0, shotHook], [B0, shotChoose], [C0, shotChop], [C2, shotLap], [E0, shotRoad], [H2, shotWake], [I0, shotBanyan], [J0, shotWink], [CARD, shotCard]]);
})();
