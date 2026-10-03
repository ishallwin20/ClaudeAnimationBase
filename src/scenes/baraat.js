// baraat.js: "The SCARIEST baraat in history", a 45.6 s captioned reel and ad for Book 3 (Maa Chandraghanta).
// Storyboard: STORYBOARD.md. Sets and props: baraat_props.js. All times are video time (t); the SFX
// (tools/baraat_sfx.mjs) uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/baraat_sfx.mjs)
  const DHAM1 = .35, DHAM2 = .75, WHIP_A = 1.05, MENA_IN = 1.25, GHOST_POP = 1.45, MENA_TAKE = 1.6, FAINT0 = 1.85,
    FLOOR = 2.15, THALI_LAND = 2.6, CAP_A2 = 2.05, PEEK = 2.75, CAP_A3 = 3.3, A_OUT = 4.0, B0 = 4.4;
  const SHIVA_CAP = 4.6, HOOF = [4.8, 5.4, 6.0, 6.6], STOP1 = 7.0, BADGE1 = 7.2,
    STOP2 = 9.2, BADGE2 = 9.4, DHOL_HITS = [9.5, 9.9, 10.3, 10.55, 10.8],
    STOP3 = 11.4, BADGE3 = 11.6, EYE_FOOD = 12.0, GULP = 12.5, BURP = 13.1,
    STOP4 = 13.6, BADGE4 = 13.8, SNAP = 14.4, CHECK = 14.6, Q4 = 14.9, B_OUT = 15.4, C0 = 15.8;
  const SIT_UP = 16.0, MENA_SEES = 16.4, REFUSE = 16.7, TURN_AWAY = 17.6, BRIDE_IN = 18.2, CAP_C2 = 18.6, BRIDE_LOOK = 19.0,
    CAP_C3 = 19.4, BRIDE_DET = 19.6, EYES_SHUT = 20.4, D0 = 21.0;
  const MOON0 = 21.3, BURST = 22.0, REVEAL = 22.35, ARMS = [22.45, 22.65, 22.85, 23.05, 23.25], NAME_CAP = 22.5,
    D2 = 24.7, RINGS = [24.9, 25.2, 25.5], STICKS_FREEZE = 25.0, CAP_D2 = 25.0, CAP_D3 = 25.7, BOW = 25.9,
    D3 = 27.0, CHANDRA = 27.2, GHANTA = 28.6, D_OUT = 29.6, E0 = 30.0;
  const CAP_E1 = 30.2, BROW = 30.5, SHIVA_Q = 30.95, GULP_S = 31.3, POOF = 31.6, GROOM = 32.1, CAP_E2 = 32.3, NOD = 32.8,
    WHIP_E = 33.5, PEEK_E = 33.6, MENA_HEART = 33.8, CAP_E3 = 34.1, FAINT2 = 34.25, E_OUT = 35.3, F0 = 35.6;
  const GARLAND = 35.9, CAP_F1 = 36.1, LINEUP = 37.7, CAP_F2 = 37.8, WAVES = [38.0, 38.15, 38.3, 38.45],
    BELL_IRIS = 39.3, CARD = 39.8;
  const CARD_CAP = 40.0, COVER = 40.1, FAN = 40.5, LOGO = 41.1, SERIES = 41.4, PRICE = 41.8, PILL = 42.2, FOLLOW = 42.8;

  const GOLDC = '#F5C542', REDC = '#FF8A70';
  const bump = (t, t0, a = .1, b = .25) => seg(t, t0 - a, t0) * (1 - seg(t, t0, t0 + b));
  const skinKeys = (keys, c) => keys.map(([k, n, o]) => [k, n, { ...c, ...(o || {}) }]);
  const mEmo = (t, keys, o) => emotions(t, skinKeys(keys, PRV_SKIN), o);
  const sEmo = (t, keys, o) => emotions(t, skinKeys(keys, SHV_SKIN), o);
  const cEmo = (t, keys, o) => emotions(t, skinKeys(keys, SHL_SKIN), o);
  const gEmo = (t, keys, o) => { const e = emotions(t, keys, o); delete e.col; delete e.dk; delete e.lt; delete e.tint; return e; };   // ganas keep their own colours
  const hits = (t, list, a = .06, b = .2) => list.reduce((m, h) => Math.max(m, bump(t, h, a, b)), 0);

  // ---- every caption in the film, in one list (they can run across a cut): [text, y, t0, life, size, colour]
  const CAPS = [
    ['The SCARIEST', 470, -1, WHIP_A + 1.08, 78], ['BARAAT', 590, -1, WHIP_A + 1.08, 150, GOLDC], ['in history', 708, -1, WHIP_A + 1.08, 64],
    ['Her mother FAINTED.', 480, CAP_A2, 3.2 - CAP_A2, 76], ["It was SHIVA'S baraat.", 575, 2.35, 3.2 - 2.35, 64, GOLDC],
    ['Wait till you see what', 480, CAP_A3, 4.9 - CAP_A3, 56], ['the BRIDE did…', 565, CAP_A3 + .15, 4.9 - CAP_A3 - .15, 84, GOLDC],
    ['The groom came in ASH,', 480, SHIVA_CAP + .4, 6.9 - SHIVA_CAP - .4, 60], ['with SNAKES for garlands', 560, 5.6, 6.9 - 5.6, 60], ['and GHOSTS for guests.', 645, 6.2, 6.9 - 6.2, 66, GOLDC],
    ['the NAGIN DANCER', 520, BADGE1, 9.0 - BADGE1, 72],
    ['the DHOL-WALA', 520, BADGE2, 11.2 - BADGE2, 72],
    ['came only for', 480, BADGE3, 13.4 - BADGE3, 60], ['the FOOD', 565, BADGE3 + .1, 13.4 - BADGE3 - .1, 84],
    ['not in his own', 480, BADGE4, 15.4 - BADGE4, 60], ['SELFIE', 565, BADGE4 + .1, 15.4 - BADGE4 - .1, 90],
    ['“I will NOT give my daughter', 480, REFUSE, 18.4 - REFUSE, 60], ['to HIM!”', 575, REFUSE + .15, 18.4 - REFUSE - .15, 96, REDC],
    ['Everyone was scared.', 480, CAP_C2, 20.6 - CAP_C2, 60], ['Except the BRIDE.', 575, CAP_C3, 20.6 - CAP_C3, 90, GOLDC],
    ['MAA', 470, NAME_CAP, 24.5 - NAME_CAP, 70], ['CHANDRAGHANTA', 575, NAME_CAP + .12, 24.5 - NAME_CAP - .12, 112, GOLDC],
    ['Her bell rang out…', 470, CAP_D2, 26.9 - CAP_D2, 60], ['and every FEAR went silent.', 560, CAP_D3, 26.9 - CAP_D3, 76, GOLDC],
    ['CHANDRA', 1330, CHANDRA, 28.45 - CHANDRA, 110, GOLDC], ['= the moon', 1428, CHANDRA + .15, 28.45 - CHANDRA - .15, 58],
    ['GHANTA', 1330, GHANTA, 29.55 - GHANTA, 110, GOLDC], ['= the bell', 1428, GHANTA + .15, 29.55 - GHANTA - .15, 58],
    ['Then she gave the groom', 470, CAP_E1, 31.5 - CAP_E1, 60], ['ONE look.', 570, CAP_E1 + .3, 31.5 - CAP_E1 - .3, 100, GOLDC],
    ['GLOW-UP.', 480, CAP_E2, 33.4 - CAP_E2, 110, GOLDC], ['The most handsome groom ever.', 590, CAP_E2 + .25, 33.4 - CAP_E2 - .25, 56],
    ['Mom fainted AGAIN.', 480, CAP_E3, 35.3 - CAP_E3, 78], ['(happily)', 570, CAP_E3 + .35, 35.3 - CAP_E3 - .35, 54, '#FFB3C7'],
    ['Navratri Day 3:', 470, CAP_F1, 37.5 - CAP_F1, 56], ['Maa Chandraghanta', 555, CAP_F1 + .1, 37.5 - CAP_F1 - .1, 90, GOLDC], ['who turns fear into COURAGE.', 645, CAP_F1 + .25, 37.5 - CAP_F1 - .25, 56],
    ['Which baraati are YOU?', 520, CAP_F2, BELL_IRIS - CAP_F2, 84, GOLDC], ['Comment 1, 2, 3 or 4', 625, CAP_F2 + .2, BELL_IRIS - CAP_F2 - .2, 64],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // ---------------- A: the hook ----------------
  const GH = { x: 540, y: 1680, u: 46 };   // the dhol ghost, frame 0
  function dholHook(t, x, y, u, key, over = {}) {
    const h = hits(t, [DHAM1, DHAM2, GHOST_POP + .05]), hl = hits(t, [.55, .95]);
    const b = pulse(t, 5);
    dholGhost(x, y, u, { ...gEmo(t, [[0, 'excited', { eyes: 'happy', mouth: 'grin' }]], { take: 0 }), blush: .6, hit: h, hitL: hl, sq: .07 * h - .03 * b, dy: -.4 * b, key, ...over });
    for (const d of [DHAM1, DHAM2]) { soundArcs(x - .6 * u - 2.6 * u, y - 5.4 * u, t - d, u * 2.4, TK.cream, Math.PI, key + 'al' + d); soundArcs(x + 4 * u, y - 5.4 * u, t - d, u * 2.4, TK.cream, 0, key + 'ar' + d); }
  }
  function shotA1(t) {
    const wk = easeIn(seg(t, .9, WHIP_A));
    camBegin(540 + wk * 700, 960, 1);
    duskSky(540, 1150);
    dholHook(t, GH.x, GH.y, GH.u, 'hookghost', { emote: null });
    camEnd();
    whipH(seg(t, .88, WHIP_A), 1, t);
    caps(t);
  }
  // Menavati at her door (A2, C, E2)
  const MV = { x: 720, y: 1560, u: 26 };
  const thaliTummy = o => menavatiWorld(MV.x, MV.y, MV.u, o, -.4, -9.6);
  function menaA(t) {
    const fk = easeIn(seg(t, FAINT0, FLOOR)) - .04 * spring(t, FLOOR, 7, 22);
    const e = mEmo(t, [[0, 'gentle', { lookX: .2 }], [MENA_TAKE, 'scared', { eyes: 'wide', mouth: 'O', lookX: .9, emote: '!!' }], [FLOOR + .05, 'ko', { eyes: 'swirl', mouth: 'wobble', emote: 'stars' }]], { take: 1.2 });
    if (t > FAINT0) { e.rot = 0; e.dx = 0; e.dy = 0; }
    return { ...e, faint: clamp(fk, 0, 1.02), thali: t < FAINT0, sq: t > FAINT0 ? 0 : e.sq };
  }
  // the thali flies off on an arc, spinning, and lands flat on her tummy
  function thaliFlight(t, o) {
    const p0 = menavatiThali(MV.x, MV.y, MV.u, { faint: 0 }), p1 = thaliTummy({ faint: 1 });
    let p, sx = 1, r = 0;
    if (t < THALI_LAND) { const k = seg(t, FAINT0, THALI_LAND); p = arcPt(p0, p1, 330, easeOut(k * .9) / easeOut(.9)); sx = Math.cos(k * TAU * 2); r = k * 2.2; }
    else { p = [p1[0], p1[1] - 26 * Math.abs(spring(t, THALI_LAND, 8, 26))]; }
    push(); translate(p[0], p[1]); rotate(r); scale(Math.abs(sx) < .12 ? .12 : sx, 1);
    boilSeed('thaliflight'); aartiThali(MV.u, 1.3, 1); pop();
    if (t >= THALI_LAND && t < THALI_LAND + .5) sparkleBurst(p1[0], p1[1] - 30, 70, t - THALI_LAND, 'clang', 6);
  }
  function camA2(t) {
    const wi = 1 - easeOut(seg(t, WHIP_A, WHIP_A + .22)), fk = ease(seg(t, FAINT0 - .05, FLOOR + .25)), out = easeIn(seg(t, A_OUT, B0));
    return [lerp(540, 470, fk) - wi * 700 + out * 900, 960, lerp(1, .88, fk)];
  }
  function shotA2(t) {
    const [cx, cy, z] = camA2(t);
    camBegin(cx, cy, z);
    palaceSet({ t });
    const o = menaA(t);
    menavati(MV.x, MV.y, MV.u, { ...o, boilKey: 'mena' });
    if (t >= FAINT0) thaliFlight(t, o);
    // the ghost pops up beside her, then floats over to peek at her
    const pop = backOut(seg(t, GHOST_POP - .12, GHOST_POP + .18)), pk = ease(seg(t, PEEK - .25, PEEK + .2));
    const gx = lerp(870, 560, pk), gy = lerp(lerp(2350, 1830, pop), 1720, pk);
    const ge = gEmo(t, [[0, 'excited', { eyes: 'happy', mouth: 'grin' }], [FLOOR, 'surprised', { eyes: 'wide', mouth: 'o' }], [PEEK, 'confused', { emote: '?', lookX: -.8, lookY: .8 }]], { take: .6 });
    if (t > GHOST_POP - .15) dholGhost(gx, gy, 26, { ...ge, blush: .5, hit: hits(t, [GHOST_POP + .05]), rot: -.35 * pk, key: 'popghost' });
    if (t > GHOST_POP) soundArcs(gx - 60, gy - 140, t - GHOST_POP - .05, 70, TK.cream, Math.PI, 'popar');
    if (t >= FLOOR && t < FLOOR + .5) vanishPuff(thaliTummy({ faint: 1 })[0] - 120, MV.y - 20, 90, t - FLOOR, 'thud', ['#D8C2B0', '#BCA48E']);
    camEnd();
    whipH(1 - seg(t, WHIP_A, WHIP_A + .25), 1, t); whipH(seg(t, A_OUT + .1, B0), 1, t);
    caps(t);
  }

  // ---------------- B: the baraat roll call ----------------
  const RD = 1560;   // the road's ground line (world)
  const STOPS = [[STOP1, -460], [STOP2, -1460], [STOP3, -2460], [STOP4, -3460]];
  function camB(t) {
    const keys = [[B0, 1150], [B0 + .4, 540]];
    let prev = 540;
    for (const [s, x] of STOPS) { keys.push([s - .3, prev], [s + .15, x]); prev = x; }
    keys.push([B_OUT, prev], [C0, prev - 900]);
    const k0 = keys.findIndex(([a]) => a > t);
    return kf(t, keys, ease) + (k0 > 2 ? -60 * spring(t, keys[k0 - 1][0], 7, 16) * (t > keys[k0 - 1][0] ? 1 : 0) : 0);
  }
  const NV = { u: 30 };
  function shivaRide(nx, ny, nu, no, so, su, key) {
    nandi(nx, ny, nu, { ...no, boilKey: key + 'n' });
    const [sx, sy] = nandiSeat(nx, ny, nu, no);
    shiva(sx, sy + su * .55, su, { ...SHV_SKIN, ...so, boilKey: key + 's' });
    return [sx, sy];
  }
  function shotB(t) {
    const cx = camB(t);
    camBegin(cx, 960, 1);
    roadSet(cx, t, RD - 40);
    // the groom: Nandi walks in from the right with Shiva on his back, ash puffing off at every step
    const wk = seg(t, B0, 6.4), nx = lerp(1180, 560, easeOut(wk)), walking = t < 6.4;
    const no = { flip: true, walk: walking ? t * 1.25 : undefined, nod: walking ? .05 * Math.sin(t * 7.8) : .03 * Math.sin(t * 2), seed: 2 };
    shivaRide(nx, RD, NV.u, no, { ash: 1, eyes: 'closed', mouth: 'smile', snakeUp: .4 + .3 * Math.sin(t * 2.2), snakeEyes: 'happy', snakeLook: -.5 }, 18, 'bshiva');
    HOOF.forEach((h, i) => { const hp = nandiHoof(nx, RD, NV.u, no, i % 2); vanishPuff(hp[0], hp[1] - 10, 60, t - h, 'hoof' + i, ['#E9E2E6', '#BDB7BE']); });
    // #1 the nagin dancer and his cobra
    const ph = bpOf(t) / 2, glance = bump(t, 8.3, .2, .6);
    naginImp(-580, RD, 30, { ...gEmo(t, [[0, 'happy', { eyes: 'happy', mouth: 'grin' }], [8.2, 'playful', { eyes: 'normal', lookX: .9, mouth: 'grin' }]], { take: .4 }), ph, blush: .5, key: 'imp1' });
    cobra(-280, RD, 340, { ph: ph + .5, look: -glance, key: 'cobra1' });
    // #2 the dhol-wala, drumming like mad
    dholGhost(-1460, RD, 32, { ...gEmo(t, [[0, 'excited', { eyes: 'happy', mouth: 'grin' }]], { take: 0 }), blush: .6, hit: hits(t, DHOL_HITS.filter((_, i) => i % 2 === 0)), hitL: hits(t, DHOL_HITS.filter((_, i) => i % 2)), dy: -.5 * pulse(t, 5), key: 'dhol2' });
    for (const [i, d] of DHOL_HITS.entries()) soundArcs(-1460 + (i % 2 ? -130 : 130), RD - 190, t - d, 80, TK.cream, i % 2 ? Math.PI : 0, 'dha' + i);
    // #3 the foodie: he spots the laddoo tower, opens wide, and it's gone
    const op = kf(t, [[EYE_FOOD + .15, 0], [EYE_FOOD + .4, 1], [GULP - .02, 1], [GULP + .08, 0]], easeOut), full = kf(t, [[GULP, 0], [GULP + .1, 1], [13.0, .7], [BURP, .2], [BURP + .3, .35]]);
    foodBhoot(-2380, RD, 34, { ...gEmo(t, [[0, 'happy', { eyes: 'normal', mouth: 'smile' }], [EYE_FOOD, 'excited', { eyes: 'shine', lookX: -1 }], [GULP + .1, 'love', { eyes: 'happy', mouth: 'cat' }]], { take: .7 }), open: op, full, blush: .3 + .5 * full, key: 'food3' });
    const tw0 = [-2700, RD], mouthP = [-2380, RD - 3.8 * 34], fly = seg(t, GULP - .22, GULP);
    if (t < GULP) { const p = arcPt(tw0, mouthP, 120, easeIn(fly)); laddooTower(p[0], p[1], 30 * (1 - .55 * fly), 'tower', -1.2 * fly); }
    if (t >= BURP && t < BURP + .6) vanishPuff(-2380 + 50, RD - 4.6 * 34, 80, t - BURP, 'burp', ['#D9C2E6', '#B9A0CC']);
    // #4 the selfie ghost
    const phn = ease(seg(t, CHECK, CHECK + .25)), sc = ease(seg(t, Q4 + .15, Q4 + .35));
    selfieGhost(-3420, RD, 28, { ...gEmo(t, [[0, 'happy', { eyes: 'happy', mouth: 'smile' }], [BADGE4, 'cool', { eyes: 'wink', mouth: 'pout' }], [CHECK + .1, 'neutral', { eyes: 'normal', mouth: 'flat', lookY: .6 }], [Q4, 'confused', { emote: '?' }]], { take: .5 }), phone: phn, scratch: sc, key: 'selfie4' });
    const flashP = toScreen(-3420 + 5.2 * 28, RD - 18.5 * 28);
    // the badges
    STOPS.forEach(([s, x], i) => badge(x + [-250, -240, -250, -230][i], 930, i + 1, t - [BADGE1, BADGE2, BADGE3, BADGE4][i], 70));
    camEnd();
    // the flash, and the selfie he checks
    if (t >= SNAP && t < SNAP + .35) { const k = 1 - seg(t, SNAP, SNAP + .35); glow(flashP[0], flashP[1], 400 * k + 60, '#FFFFFF', k); veil('#FFFDF6', .55 * k * k); }
    phoneInset(800, 1020, 220, 380, seg(t, CHECK + .05, CHECK + .3) * (1 - seg(t, B_OUT - .05, B_OUT + .1)), t);
    whipH(1 - seg(t, B0, B0 + .3), -1, t); whipH(seg(t, B_OUT + .05, C0), -1, t);
    caps(t);
  }

  // ---------------- C: the refusal ----------------
  const PV = { y: 1560, u: 29 };
  function camC(t) {
    const wi = 1 - easeOut(seg(t, C0, C0 + .25)), up = ease(seg(t, REFUSE, REFUSE + .7)), push_ = ease(seg(t, EYES_SHUT, D0));
    const base = [lerp(470, 540, up) + wi * 700, 960, lerp(.88, 1, up)];
    return [lerp(base[0], 360, push_), lerp(base[1], 840, push_), lerp(base[2], 1.38, push_)];
  }
  function shotC(t) {
    const [cx, cy, z] = camC(t);
    camBegin(cx, cy, z);
    palaceSet({ t });
    // baraatis peeking in at the right edge
    dholGhost(1010, 1580, 20, { ...gEmo(t, [[0, 'nervous', { eyes: 'look', lookX: -1, mouth: 'wobble' }]], { take: 0 }), dy: -1.2 + .6 * Math.sin(t * 2), key: 'cpeek' });
    cobra(940, 1580, 170, { ph: t * .5, look: -1, key: 'ccobra' });
    // she sits up, sees them, gets up, crosses her arms and turns away
    const fk = kf(t, [[C0, 1], [SIT_UP, 1], [SIT_UP + .3, .62], [REFUSE - .05, .62], [REFUSE + .3, 0]], easeOut);
    const e = mEmo(t, [[C0, 'ko', { eyes: 'swirl', mouth: 'wobble' }], [MENA_SEES, 'surprised', { eyes: 'wide', mouth: 'O', lookX: 1 }], [REFUSE, 'angry', { mouth: 'teeth', lookX: 1 }], [TURN_AWAY, 'angry', { mouth: 'huff', hx: -.8, lookX: -1, emote: 'anger' }]], { take: .9 });
    if (t < REFUSE + .3) { e.dx = 0; e.dy = 0; e.rot = 0; }
    menavati(MV.x, MV.y, MV.u, { ...e, faint: fk, thali: false, crossed: ease(seg(t, REFUSE + .2, REFUSE + .5)), boilKey: 'mena' });
    // the thali: on her tummy, then it slides off onto the floor as she gets up
    const tp = t < REFUSE ? thaliTummy({ faint: fk }) : arcPt(thaliTummy({ faint: .62 }), [MV.x - 130, MV.y - 8], 60, easeIn(seg(t, REFUSE, REFUSE + .3)));
    push(); translate(tp[0], tp[1]); boilSeed('cthali'); aartiThali(MV.u, 1.3, 1); pop();
    // the bride walks in from the left, looks at her mother, then at the baraat
    const wk = seg(t, BRIDE_IN, BRIDE_IN + .7);
    if (t > BRIDE_IN - .05) {
      const pe = mEmo(t, [[BRIDE_IN, 'gentle', { hx: .2 }], [BRIDE_LOOK, 'sad', { hx: .7, lookX: 1 }], [BRIDE_DET, 'determined', { hx: .25, lookX: .8 }], [EYES_SHUT, 'serene', { eyes: 'closed', hx: 0 }]], { take: .6 });
      parvati(lerp(-160, 360, easeOut(wk)), PV.y, PV.u, { ...pe, walk: wk < 1 ? t * 1.5 : undefined, boilKey: 'bride' });
    }
    camEnd();
    whipH(1 - seg(t, C0, C0 + .3), -1, t);
    caps(t);
  }

  // ---------------- D: Maa Chandraghanta ----------------
  const CG1 = { x: 540, y: 1900, u: 40 };
  function goldGround(k, key = 'gold') {
    if (k < 1) {   // the night, lit up from her by added light (no pigment mixing, so no mud)
      duskSky(540, 1200, key);
      glow(540, 1150, 500 + 1300 * k, '#FFB040', .9 * k); glow(540, 1150, 300 + 800 * k, '#FFE7A0', .8 * k);
      return;
    }
    boilSeed(key + 'bg'); paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#F4B648', ink: null });
    boilSeed(key + 'g'); paint(ellPts(540, 1050, 640, 820, 36, 4), { fill: '#FFD98A', fillOp: 200, bleed: .3, tex: .3, ink: null }); glow(540, 1050, 900, '#FFE7B0', .5);
  }
  function shotD1(t) {
    goldGround(t < REVEAL ? .85 * seg(t, MOON0, REVEAL) : 1, 'd1');
    if (t < REVEAL) {
      parvati(CG1.x, CG1.y, CG1.u, { ...PRV_SKIN, ...feel('serene', t, { eyes: 'closed', mouth: 'smile' }), boilKey: 'brideD' });
      // the moon-bell draws itself on her forehead, glowing
      const mk = backOut(seg(t, MOON0, MOON0 + .35));
      if (mk > .01) { const fy = CG1.y - 21.85 * CG1.u; glow(CG1.x, fy, 60 + 160 * seg(t, MOON0, BURST), '#FFE7A0', .9); push(); translate(CG1.x, fy); scale(mk); boilSeed('pmoon'); moonBell(.95 * CG1.u * 1.18, 1.6); pop(); }
    } else {
      const e = cEmo(t, [[REVEAL, 'serene', { eyes: 'closed' }], [22.95, 'gentle', { brows: -.3, mouth: 'smile' }]], { take: .5 });
      chandraghanta(CG1.x, CG1.y, CG1.u, { ...e, arms: seg(t, REVEAL + .05, 23.35), aura: .85 * easeOut(seg(t, REVEAL, 23.0)), moonGlow: .6, boilKey: 'cgD1' });
      ARMS.forEach((a, i) => { if (i < 4) { const A = CGH_BACK[i]; for (const s of [-1, 1]) sparkleBurst(CG1.x + (s < 0 ? A.at[0] : -A.at[0]) * CG1.u, CG1.y + A.at[1] * CG1.u, 50, t - a - .12, 'clink' + i + s, 5); } });
    }
    petalSwirl(CG1.x, CG1.y, CG1.u, kf(t, [[BURST - .1, 0], [BURST + .25, 1], [REVEAL + .1, 1], [REVEAL + .55, 0]]), t);
    if (t > BURST - .05) flash(Math.max(.45 * (1 - seg(t, BURST, BURST + .25)), bump(t, REVEAL, .12, .3)), '#FFF4D0');
    caps(t);
  }
  // D2: the bell. A wide shot of the door: she on the step at the left, the baraat on the right.
  const CG2 = { x: 300, y: 1560, u: 30 };
  function shotD2(t) {
    camBegin(800, 1260, .8);
    palaceSet({ t });
    const ringAmt = RINGS.reduce((m, r) => m + (t > r ? Math.exp(-(t - r) * 4) * Math.sin((t - r) * 26) : 0), 0);
    const raise = ease(seg(t, D2, D2 + .2));
    const co = { ...SHL_SKIN, ...feel('gentle', t, { brows: -.3 }), arms: 1, aura: 1, moonGlow: .5 + .5 * hits(t, RINGS, .02, .4), ring: ringAmt, handL: [lerp(-4.5, -5.4, raise), lerp(-14.4, -20.5, raise)], boilKey: 'cgD2' };
    chandraghanta(CG2.x, CG2.y, CG2.u, co);
    const bh = chandraghantaHand(CG2.x, CG2.y, CG2.u, co, -1), bell = toScreen(bh[0], bh[1] + 1.8 * CG2.u);
    // the baraat: Shiva on Nandi at the back, the ganas in front; the dhol stops dead, then they bow
    const bowK = d => easeOut(seg(t, BOW + d, BOW + d + .35));
    shivaRide(1140, 1520, 22, { flip: true, nod: .1 * bowK(.5), seed: 3 }, { ash: 1, eyes: t > BOW ? 'normal' : 'closed', lookX: -1, mouth: 'smile', snakeUp: .3 }, 13, 'd2shiva');
    const frozen = t >= STICKS_FREEZE;
    dholGhost(880, 1660, 22, { ...gEmo(t, [[D2, 'excited', { eyes: 'happy', mouth: 'grin' }], [STICKS_FREEZE, 'surprised', { eyes: 'wide', mouth: 'o' }], [BOW, 'shy', { eyes: 'happy', mouth: 'smile' }]], { take: .8 }), hit: frozen ? 0 : hits(t, [24.8]), sticksUp: frozen ? 1 : 0, bow: bowK(0), key: 'd2dhol' });
    naginImp(1030, 1680, 19, { ...gEmo(t, [[D2, 'happy', { eyes: 'happy' }], [STICKS_FREEZE, 'surprised', { eyes: 'wide', mouth: 'o' }]], { take: .6 }), ph: frozen ? 0 : bpOf(t) / 2, bow: bowK(.15), key: 'd2imp' });
    foodBhoot(1170, 1690, 19, { ...gEmo(t, [[D2, 'happy'], [STICKS_FREEZE, 'surprised', { eyes: 'wide', mouth: 'o' }]], { take: .6 }), bow: bowK(.3), key: 'd2food' });
    selfieGhost(1300, 1650, 17, { ...gEmo(t, [[D2, 'happy'], [STICKS_FREEZE, 'surprised', { eyes: 'wide', mouth: 'o' }]], { take: .6 }), bow: bowK(.45), key: 'd2self' });
    camEnd();
    RINGS.forEach((r, i) => bellRings(bell[0], bell[1], (t - r) / 1.1, 'ring' + i));
    caps(t);
  }
  // D3: the name, close on her forehead
  const CG3 = { x: 540, y: 2304, u: 60 };
  function shotD3(t) {
    const lt = t - D3, wo = easeIn(seg(t, D_OUT, E0));
    goldGround(1, 'd3');
    camBegin(540 + wo * 700, 960 - 30 * seg(t, D3, D_OUT), 1 + .05 * seg(t, D3, D_OUT));
    const co = { ...SHL_SKIN, ...feel('gentle', t), arms: 1, aura: .9, moonGlow: .5 + .5 * bump(t, CHANDRA + .2, .2, 1.0) + .6 * bump(t, GHANTA + .1, .1, .8), boilKey: 'cgD3' };
    chandraghanta(CG3.x, CG3.y, CG3.u, co);
    const m = chandraghantaMoon(CG3.x, CG3.y, CG3.u, co), ms = toScreen(m[0], m[1]);
    camEnd();
    bellRings(ms[0], ms[1], (t - GHANTA) / 1, 'd3ring');
    whipH(seg(t, D_OUT, E0), 1, t);
    caps(t);
  }

  // ---------------- E: the glow-up ----------------
  const CG4 = { x: 170, y: 1700, u: 30 };
  function shotE1(t) {
    const wi = 1 - easeOut(seg(t, E0, E0 + .25)), wo = easeIn(seg(t, WHIP_E - .15, WHIP_E));
    camBegin(540 - wi * 700 - wo * 700, 960, 1);
    duskSky(700, 1150, 'e1');
    glow(150, 1150, 700, '#FFC766', .45);
    boilSeed('e1floor'); paint(rectPts(-800, 1540, 2600, 800), { wash: BRT.road, fill: BRT.hill, fillOp: 40, tex: .5, ink: null });
    // her look: one brow up, the eyes go down his outfit and back up
    const br = ease(seg(t, BROW, BROW + .35)) * (1 - ease(seg(t, GROOM + .2, GROOM + .5)));
    const ly = kf(t, [[BROW + .2, 0], [BROW + .5, .7], [BROW + .85, -.5], [BROW + 1.1, 0]]);
    const e = cEmo(t, [[E0, 'gentle', { lookX: .9 }], [BROW, 'neutral', { mouth: 'flat', lookX: .9 }], [GROOM + .3, 'delight', { blush: .6 }]], { take: .3 });
    chandraghanta(CG4.x, CG4.y, CG4.u, { ...e, arms: 1, aura: .6, moonGlow: .4, browR: br, lookY: ly, boilKey: 'cgE' });
    // Shiva on Nandi: '?', a sweat drop, a gulp, POOF, the groom
    const gr = t > POOF + .28;
    const se = sEmo(t, [[E0, 'serene'], [SHIVA_Q, 'surprised', { eyes: 'normal', mouth: 'o', lookX: -1, emote: '?' }], [GULP_S, 'nervous', { eyes: 'normal', mouth: 'wobble', lookX: -1, emote: 'sweat' }], [GROOM, 'serene', { mouth: 'smile' }], [NOD, 'proud', { eyes: 'closed', mouth: 'smile', emote: 'spark' }]], { take: .6 });
    se.sq = (se.sq || 0) + .08 * bump(t, GULP_S + .15, .08, .2);
    se.htilt = .12 * bump(t, NOD + .1, .15, .35);
    const [sx, sy] = shivaRide(790, 1580, 28, { flip: true, seed: 4, nod: .03 * Math.sin(t * 2) }, { ...se, ash: gr ? 0 : 1, groom: gr ? 1 : 0, snakeUp: .3, snakeEyes: gr ? 'happy' : 'open' }, 17, 'eshiva');
    glowPoof(sx, sy - 140, 380, (t - POOF) / .8, 'poof');
    if (t > GROOM - .05) { sparkleBurst(sx - 120, sy - 260, 90, t - GROOM, 'gs1', 7); sparkleBurst(sx + 110, sy - 120, 80, t - GROOM - .15, 'gs2', 6); }
    camEnd();
    whipH(1 - seg(t, E0, E0 + .25), 1, t); whipH(seg(t, WHIP_E - .2, WHIP_E), -1, t);
    caps(t);
  }
  const MV2 = { x: 780, y: 1560, u: 24 };
  function shotE2(t) {
    const wi = 1 - easeOut(seg(t, WHIP_E, WHIP_E + .22)), fz = ease(seg(t, FAINT2, FAINT2 + .5));
    camBegin(lerp(540, 470, fz) + wi * 700, 960, lerp(1, .9, fz));
    palaceSet({ t });
    const e = mEmo(t, [[WHIP_E, 'angry', { mouth: 'huff', hx: -.8, lookX: -1 }], [PEEK_E, 'surprised', { eyes: 'wide', mouth: 'o', hx: .7, lookX: 1 }], [MENA_HEART, 'love', { eyes: 'heart', mouth: 'smile', blush: 1, hx: .5, lookX: 1, emote: 'hearts' }], [FAINT2 + .35, 'love', { eyes: 'happy', mouth: 'smile', blush: 1, emote: 'hearts' }]], { take: .8 });
    const fk = easeIn(seg(t, FAINT2, FAINT2 + .5)) - .03 * spring(t, FAINT2 + .5, 7, 20);
    if (t > FAINT2) { e.dx = 0; e.dy = 0; e.rot = 0; }
    menavati(MV2.x, MV2.y, MV2.u, { ...e, thali: false, crossed: 1 - ease(seg(t, MENA_HEART, MENA_HEART + .3)), faint: clamp(fk, 0, 1.02), boilKey: 'menaE' });
    camEnd();
    whipH(1 - seg(t, WHIP_E, WHIP_E + .25), -1, t);
    caps(t);
    if (t > E_OUT) brushWipe(seg(t, E_OUT, F0) * .5, [TK.petalDk, TK.goldLt]);
  }

  // ---------------- F: the wedding and the comment beat ----------------
  const BRF = { x: 360, y: 1560, u: 30 }, SHF = { x: 720, y: 1420, u: 17 };
  function shotF(t) {
    weddingSet(t);
    fallingPetals(t, .9, 22);
    platform(SHF.x, SHF.y + 20, 380);
    shiva(SHF.x, SHF.y, SHF.u, { ...SHV_SKIN, ...feel('serene', t, { mouth: 'smile' }), groom: 1, snakeUp: .3, snakeEyes: 'happy', boilKey: 'fshiva' });
    // the bride lifts the varmala and lays it over his shoulders
    const lift = ease(seg(t, F0, GARLAND)), lean = ease(seg(t, GARLAND, GARLAND + .35)) * (1 - ease(seg(t, GARLAND + .7, GARLAND + 1.1)));
    const po = { ...PRV_SKIN, ...feel('gentle', t, { eyes: t > GARLAND + .6 ? 'happy' : 'normal', blush: .6, hx: .4, lookX: .6 }), lean: 2.4 * lean, handL: [lerp(-1.4, -.8, lift), lerp(-12.6, -16.5, lift)], handR: [lerp(1.4, 2.4, lift), lerp(-12.6, -16.8, lift)], boilKey: 'brideF' };
    parvati(BRF.x, BRF.y, BRF.u, po);
    const hL = parvatiHand(BRF.x, BRF.y, BRF.u, po, -1), hR = parvatiHand(BRF.x, BRF.y, BRF.u, po, 1);
    const neckL = [SHF.x - 70, SHF.y - 10 * SHF.u], neckR = [SHF.x + 70, SHF.y - 10 * SHF.u], gk = ease(seg(t, GARLAND + .25, GARLAND + .6));
    const a = arcPt(hL, neckL, 90, gk), b = arcPt(hR, neckR, 90, gk);
    garland(a, b, lerp(80, 95, gk), 'varmala', 19, ['#FFF5E2', '#E8576E', '#B8324A']);
    if (t > GARLAND + .6) sparkleBurst(SHF.x, SHF.y - 10 * SHF.u, 120, t - GARLAND - .6, 'vsp', 8);
    // the lineup: the four baraatis pop up in the foreground, numbered
    const pop = i => backOut(seg(t, LINEUP + i * .08, LINEUP + i * .08 + .3)), wave = i => -2.5 * bump(t, WAVES[i], .12, .25);
    const row = [[160, 1640], [395, 1640], [630, 1640], [860, 1640]];
    if (t > LINEUP - .1) veil(BRT.roseLt, .45 * ease(seg(t, LINEUP - .1, LINEUP + .2)));
    if (t > LINEUP) {
      const L = i => ({ dy: (1 - pop(i)) * 24 + wave(i) });
      naginImp(row[0][0], row[0][1], 17, { ...gEmo(t, [[0, 'happy', { eyes: 'happy', mouth: 'grin' }]], { take: 0 }), ph: bpOf(t) / 2, ...L(0), key: 'l1' });
      dholGhost(row[1][0], row[1][1], 15, { ...gEmo(t, [[0, 'excited', { eyes: 'happy', mouth: 'grin' }]], { take: 0 }), hit: pulse(t, 6), ...L(1), key: 'l2' });
      foodBhoot(row[2][0], row[2][1], 16, { ...gEmo(t, [[0, 'happy', { eyes: 'happy', mouth: 'cat' }]], { take: 0 }), full: .3, ...L(2), key: 'l3' });
      selfieGhost(row[3][0], row[3][1], 14, { ...gEmo(t, [[0, 'cool', { eyes: 'wink', mouth: 'pout' }]], { take: 0 }), ...L(3), key: 'l4' });
      [1330, 1300, 1390, 1310].forEach((y, i) => badge(row[i][0], y + (1 - pop(i)) * 300, i + 1, t - LINEUP - .2 - i * .08, 48));
    }
    if (t < F0 + .4) brushWipe(.5 + seg(t, F0, F0 + .4) * .5, [TK.petalDk, TK.goldLt]);
    caps(t);
    if (t > BELL_IRIS) { flushLetters(); const k = ease(seg(t, BELL_IRIS, CARD)); boilSeed('belliris'); irisShape(bellPts(540, 1150, lerp(1200, 0, k) + 1), TK.peach); }
  }

  // ---------------- the card ----------------
  const CARDC = { book: COVER, fan: FAN, logo: LOGO, series: SERIES, sub: PRICE, pill: PILL, follow: FOLLOW };
  function shotCard(t) {
    endCard(t, CARDC, 'book3', ['book1', 'book2'], { series: 'The Navadurga Series', sub: 'Picture books · Ages 4–8 · Set of 3 for ₹600', follow: 'Follow @therishikatha for all 9 forms of Maa' });
    const age = t - CARD_CAP, life = LOGO - CARD_CAP - .05;
    if (age >= 0 && age < life) {
      const a = 1 - seg(age, life - .2, life);
      letter('Navratri Day 3: Maa Chandraghanta', 540, 462, 54, TK.teal, { screen: true, font: '54px Marcellus', ink: false, pop: age * 5, alpha: a, maxW: 900 });
      letter('The Fierce Protector is Book 3!', 540, 548, 38, TK.rkOrange, { screen: true, font: '500 38px Poppins', ink: false, pop: Math.max(0, age - .1) * 5, alpha: a, maxW: 880 });
    }
    const k = frac((t - FOLLOW) / 1.6);
    if (t > FOLLOW) { flushLetters(); boilSeed('sparkle'); paint(starPts(lerp(300, 720, k), lerp(1040, 660, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
  }

  shots([[0, shotA1], [WHIP_A, shotA2], [B0, shotB], [C0, shotC], [D0, shotD1], [D2, shotD2], [D3, shotD3], [E0, shotE1], [WHIP_E, shotE2], [F0, shotF], [CARD, shotCard]]);
})();
