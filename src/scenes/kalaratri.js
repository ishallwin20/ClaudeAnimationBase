// kalaratri.js: "Why does the SCARIEST goddess ride a DONKEY?", a 54 s captioned reel and ad for Book 7 (Maa Kalaratri).
// Storyboard: STORYBOARD.md. Sets and props: kalaratri_props.js. All times are video time (t); the SFX
// (tools/kalaratri_sfx.mjs) uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/kalaratri_sfx.mjs)
  const CRACK0 = .15, FIRE0 = .45, PULL0 = .9, PULL1 = 1.5, GRIN = 1.55, BRAY_A = 1.65, LOOKDOWN = 2.4, BLINK = 2.8, WHIP_A = 3.9, B0 = 4.2;
  const NAME = 4.4, KAAL = 6.6, RATRI = 7.3, LABELS = [8.9, 9.5, 10.1, 10.7], WIPE_B = 11.6, C0 = 11.8;
  const WHY = 12.0, TWIRL = 13.2, ARROW = 14.0, DROP_LAND = 14.9, POPS = [15.4, 15.8, 16.2, 16.5, 16.8], BONK = 16.4,
    DURGA = 17.0, INK0 = 17.4, EYE3 = 18.6, BOLT = 18.8, SLASH = 19.4, ZAPS = [19.6, 19.8, 20.0, 20.2, 20.4, 20.6],
    ALONE = 21.0, FLASH = 21.4, D0 = 22.0;
  const LINEUP = [22.3, 22.7, 23.1, 23.5, 23.9], DONKEY_IN = 24.4, BRAY_D = 24.65, JAW = 24.9, PASTURE = 26.6, EYES = 27.0,
    HORSE = 27.2, PLANT = 28.0, BRAY_W = 28.2, CREEP = 28.6, SPIN = 28.95, KICK = 29.1, TWINKLE = 29.8, FARMERS = 30.2,
    RIDE_IN = 32.2, SCRATCH = 34.4, E0 = 36.6;
  const SCARY = 36.8, WINDOW = 37.4, SOFT = 37.9, SHUBH = 39.9, LICK = 40.8, DARK_LINE = 42.2, F0 = 44.4;
  const COMMENT = 44.5, WAVES = [44.9, 45.1, 45.3], IRIS = 47.8, CARD = 48.3, CARD_CAP = 48.5, COVER7 = 48.7, ROW13 = 49.4,
    PRICE = 49.8, LOGO = 50.3, PILL = 50.6, FOLLOW = 51.1;

  const GOLDC = '#F5C542', REDC = '#FF8A70';
  const bump = (t, t0, a = .1, b = .25) => seg(t, t0 - a, t0) * (1 - seg(t, t0, t0 + b));
  const hits = (t, list, a = .06, b = .2) => list.reduce((m, h) => Math.max(m, bump(t, h, a, b)), 0);
  const clean = e => { delete e.col; delete e.dk; delete e.lt; delete e.tint; delete e.aL; delete e.aR; return e; };
  const kEmo = (t, keys, o) => clean(emotions(t, keys, o));   // Kalaratri / Raktabija keep their own colours

  // ---- every caption in the film, in one list: [text, y, t0, life, size, colour]
  const CAPS = [
    ['The SCARIEST form of', 470, -1, 4.0 + 1, 64], ['MAA DURGA…', 575, -1, 4.0 + 1, 120, GOLDC], ['…rides a DONKEY?!', 690, BRAY_A, 4.0 - BRAY_A, 96, REDC],
    ['Navratri Day 7:', 470, NAME, KAAL - NAME, 56], ['MAA KALARATRI', 565, NAME + .15, KAAL - NAME - .15, 112, GOLDC],
    ['KAAL = dark', 480, KAAL, 8.8 - KAAL, 90, GOLDC], ['RATRI = night', 590, RATRI, 8.8 - RATRI, 90, GOLDC],
    ['Why so scary?', 470, WHY, ARROW - WHY, 78], ['Because of ONE demon.', 565, WHY + .3, ARROW - WHY - .3, 64],
    ['Every drop that touched', 470, ARROW + .1, DURGA - ARROW - .1, 60], ['the ground…', 545, ARROW + .25, DURGA - ARROW - .25, 60], ['…became ANOTHER him.', 640, DROP_LAND + .05, DURGA - DROP_LAND - .05, 78, GOLDC],
    ['So Durga became', 470, DURGA + .05, SLASH - DURGA - .05, 60], ['the NIGHT.', 575, DURGA + .25, SLASH - DURGA - .25, 120, GOLDC],
    ['Not ONE drop', 470, SLASH + .1, 21.6 - SLASH - .1, 84, GOLDC], ['touched the ground.', 565, SLASH + .25, 21.6 - SLASH - .25, 64],
    ['Gods ride LIONS,', 470, 22.4, DONKEY_IN - 22.4, 60], ['PEACOCKS, SWANS…', 555, 22.6, DONKEY_IN - 22.6, 60],
    ['She picked a', 470, DONKEY_IN + .05, PASTURE - DONKEY_IN - .05, 64], ['DONKEY.', 575, DONKEY_IN + .2, PASTURE - DONKEY_IN - .2, 130, GOLDC],
    ['A HORSE runs from a wolf.', 470, HORSE + .05, 30.1 - HORSE - .05, 64], ['A DONKEY doesn’t.', 565, PLANT, 30.1 - PLANT, 96, GOLDC],
    ['Farmers still keep donkeys', 470, FARMERS, RIDE_IN - FARMERS, 58], ['to guard their sheep.', 548, FARMERS + .15, RIDE_IN - FARMERS - .15, 58],
    ['The goddess who kills FEAR', 470, RIDE_IN + .1, SCRATCH - RIDE_IN - .1, 62], ['rides the one who won’t RUN.', 562, RIDE_IN + .3, SCRATCH - RIDE_IN - .3, 70, GOLDC],
    ['The FIERCEST goddess', 470, SCRATCH + .1, 36.4 - SCRATCH - .1, 64], ['on the HUMBLEST ride.', 565, SCRATCH + .3, 36.4 - SCRATCH - .3, 84, GOLDC],
    ['Scary to demons…', 470, SCARY, SHUBH - SCARY, 64], ['…GENTLE to her children.', 565, SOFT, SHUBH - SOFT, 80, GOLDC],
    ['Her other name:', 470, SHUBH, DARK_LINE - SHUBH, 56], ['SHUBHANKARI', 565, SHUBH + .15, DARK_LINE - SHUBH - .15, 110, GOLDC], ['the one who brings only GOOD.', 660, SHUBH + .4, DARK_LINE - SHUBH - .4, 54],
    ['The dark isn’t scary', 470, DARK_LINE, 44.3 - DARK_LINE, 70], ['when SHE is in it.', 565, DARK_LINE + .2, 44.3 - DARK_LINE - .2, 84, GOLDC],
    ['Is your name', 470, COMMENT, IRIS - COMMENT, 60], ['KALI, KALIKA,', 560, COMMENT + .15, IRIS - COMMENT - .15, 92, GOLDC], ['SHYAMA or SHUBHA?', 665, COMMENT + .3, IRIS - COMMENT - .3, 92, GOLDC],
    ['Comment your NAME below', 765, COMMENT + .6, IRIS - COMMENT - .6, 54], ['(or tag one!)', 835, COMMENT + .75, IRIS - COMMENT - .75, 48],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // ---- the night ground under the rider (A, B)
  function nightGround(cx, gy) {
    boilSeed('nground');
    paint(rectPts(cx - 1500, gy - 30, 3000, 1200), { wash: '#161A3E', ink: null });
    paint(ellPts(cx, gy - 20, 900, 90, 30, 6), { wash: '#1E2350', ink: null });
    inkLine([[cx - 1200, gy - 28], [cx, gy - 36], [cx + 1200, gy - 26]], 1.2, KR.ink, 'inkfine', .3);
    for (let i = 0; i < 16; i++) { const x = cx - 600 + hash(i * 5.1) * 1200, y = gy + hash(i * 2.9) * 260, s = 8 + 8 * hash(i); inkLine([[x - s, y], [x - s * .3, y - s * 1.2 - 3 * Math.sin(T * 2 + i)], [x, y]], 1.4, '#2E3570', 'inkfine', .3); }
  }
  // ---- the rider: the donkey, and Kalaratri side-saddle on him; returns her options and seat
  function rider(x, y, du, ku, dO, kO) {
    donkey(x, y, du, { boilKey: 'dk', ...dO });
    const s = donkeySeat(x, y, du, dO), ko = { sit: 1, boilKey: 'kal', ...kO };
    kalaratri(s[0], s[1], ku, ko);
    return { s, ko };
  }

  // ---------------- A: the hook ----------------
  const RA = { x: 470, y: 1500, du: 34, ku: 24 }, WIDE = [520, 932];   // the two-shot: zoom 1.3, crown at screen y ≈ 770
  function riderA(t) {
    const bray = seg(t, BRAY_A, BRAY_A + .12) * (1 - seg(t, 2.2, 2.4)), honk = bray * (.6 + .4 * Math.abs(Math.sin((t - BRAY_A) * 9)));
    const ups = t > BLINK ? 1 : 0, flop = t > 3.0 ? -1 + .2 * spring(t, 3.0, 6, 14) : 0;
    const dO = { grin: seg(t, GRIN, GRIN + .15), bray: honk, ears: -.6 * bray, earR: flop || -.6 * bray, eyes: t > 2.9 && t < 3.0 ? 'closed' : bray > .3 ? 'closed' : 'normal',
      lookX: ups ? -.3 : 0, lookY: ups ? -1 : .1, nod: -.15 * ups, sq: -.04 * bray, emote: t > 3.05 ? '?' : null, emoteK: seg(t, 3.05, 3.25), emoteAge: t - 3.05 };
    const e = kEmo(t, [[0, 'fierce', { hx: .3, lookX: -.1 }], [LOOKDOWN, 'fierce', { eyes: 'normal', mouth: 'flat', brows: -.15, hx: .55, lookX: .9, lookY: .9 }]], { take: .3 });
    const kO = { ...e, dy: (e.dy || 0) - .25 * bray * Math.abs(Math.sin((t - BRAY_A) * 18)), fire: seg(t, FIRE0, FIRE0 + .08) * (1 - seg(t, 1.0, 1.25)), fireAge: t - FIRE0, fireDir: 1, aura: .25 };
    return rider(RA.x, RA.y, RA.du, RA.ku, dO, kO);
  }
  function shotA(t) {
    // the close-up of her face (zoom 2.2, face at screen y 1150) eases back to the wide two-shot
    const s0 = donkeySeat(RA.x, RA.y, RA.du, {}), h0 = kalaratriHead(s0[0], s0[1], RA.ku, { sit: 1, hx: .3 });
    const k = ease(seg(t, PULL0, PULL1)), z = lerp(2.5 + .03 * t, 1.3, k);
    const close = [h0[0], h0[1] - 240 / 2.5], wide = WIDE;
    const wk = easeIn(seg(t, WHIP_A, B0));
    camBegin(lerp(close[0], wide[0], k) + wk * 900, lerp(close[1], wide[1], k), z);
    nightSky(520, 1000, { moon: null });
    nightGround(520, RA.y);
    const { s, ko } = riderA(t);
    // the opening crack: three bolts jump off the necklace, and the third eye flares
    if (t < .45) {
      const [nx, ny] = kalaratriNeck(s[0], s[1], RA.ku, ko), [ex, ey] = kalaratriEye3(s[0], s[1], RA.ku, ko), c = seg(t, CRACK0, CRACK0 + .05) * (1 - seg(t, .3, .45));
      if (c > 0) { [[-70, 40], [80, 60], [-20, 90]].forEach(([dx, dy], i) => zap(nx, ny, nx + dx, ny + dy, 'crack' + i, c, .5)); glow(ex, ey, 90 * c, '#FF6A3A', c); }
    }
    camEnd();
    whipH(seg(t, WHIP_A - .05, B0), 1, t, ['#DCE4FF', '#8E9AE0']);
    caps(t);
  }

  // ---------------- B: who she is (+ the roll call) ----------------
  const RB = { x: 470, y: 1500, du: 34, ku: 24 };
  function shotB(t) {
    const kaal = ease(seg(t, KAAL, KAAL + .5)) * (1 - ease(seg(t, RATRI, RATRI + .4)) * .6), stars = 1 - ease(seg(t, KAAL, KAAL + .4)) + ease(seg(t, RATRI, RATRI + .9));
    const rc = ease(seg(t, 8.75, 9.25));   // the roll call push-in
    const lt = LABELS, snort = seg(t, lt[1], lt[1] + .08) * (1 - seg(t, WIPE_B - .1, WIPE_B));   // she keeps snorting while her label is up
    const dO = { eyes: 'normal', lookX: .2, tail: Math.sin(t * 2) * .6, earL: .1 * Math.sin(t * 1.7), nod: .03 * Math.sin(t * 1.3) };
    const e = kEmo(t, [[0, 'fierce', { hx: .15 }], [lt[1] - .1, 'fierce', { hx: -.35, lookX: -.4 }], [lt[2], 'fierce', { hx: 0, lookX: 0 }]], { take: .2 });
    const kO = { ...e, fire: snort, fireAge: t - lt[1], fireDir: -1, aura: .25 + .3 * kaal };
    // where things are (computed before the camera so it can frame her)
    const s0 = donkeySeat(RB.x, RB.y, RB.du, dO), hd = kalaratriHead(s0[0], s0[1], RB.ku, { ...kO, sit: 1 });
    const wi = 1 - easeOut(seg(t, B0, B0 + .3));
    const cw = WIDE, cr = [hd[0] + 10, hd[1] + (960 - 700) / 2.5];
    camBegin(lerp(cw[0], cr[0], rc) - wi * 900, lerp(cw[1], cr[1], rc), lerp(1.3 + .02 * (t - B0), 2.5, rc));
    nightSky(520, 1000, { stars: clamp(stars), dark: kaal });
    nightGround(520, RB.y);
    const { s, ko } = rider(RB.x, RB.y, RB.du, RB.ku, dO, kO);
    const nose = kalaratriNose(s[0], s[1], RB.ku, ko), flame = [nose[0] - 3.4 * RB.ku, nose[1] + 1.9 * RB.ku];   // the label points at the flames, not into her face
    const P = [kalaratriEye3(s[0], s[1], RB.ku, ko), flame, kalaratriNeck(s[0], s[1], RB.ku, ko), kalaratriMala(s[0], s[1], RB.ku, ko)].map(([a, b]) => toScreen(a, b));
    // the label beats: the third eye flares, the necklace throws sparks
    const fl = bump(t, lt[0] + .1, .1, .5);
    if (fl > 0) { const [ex, ey] = kalaratriEye3(s[0], s[1], RB.ku, ko); glow(ex, ey, 60 * fl, '#FF6A3A', fl); }
    const zp = seg(t, lt[2], lt[2] + .05) * (1 - seg(t, lt[2] + .3, lt[2] + .45));
    if (zp > 0) { const [nx, ny] = kalaratriNeck(s[0], s[1], RB.ku, ko); [[-60, 30], [70, 40], [10, 70]].forEach(([dx, dy], i) => zap(nx, ny, nx + dx, ny + dy, 'bz' + i, zp, .35)); }
    camEnd();
    whipH(wi, 1, t, ['#DCE4FF', '#8E9AE0']);
    // the roll call: labels with leader lines to each feature, popping in one by one
    const L = [['THIRD EYE', 790, 500, 0], ['BREATH\nOF FIRE', 200, 1000, 1], ['LIGHTNING\nNECKLACE', 790, 1080, 2], ['A GARLAND\nOF SKULLS', 210, 1330, 3]];
    for (const [txt, lx, ly, i] of L) {
      const age = t - lt[i]; if (age < 0 || t > WIPE_B) continue;
      // a short leader from just outside the label to just short of the feature, and a gold dot on the feature
      const [fx, fy] = P[i], d = Math.hypot(fx - lx, fy - ly) || 1, ux = (fx - lx) / d, uy = (fy - ly) / d, k = easeOut(clamp(age / .25));
      const ax = lx + ux * 90, ay = ly + uy * 55, bx = fx - ux * 22, by = fy - uy * 22, ex = lerp(ax, bx, k), ey = lerp(ay, by, k);
      boilSeed('lead' + i);
      inkLine([[ax, ay], [ex, ey]], 4.5, KR.ink, 'ink', 0);
      inkLine([[ax, ay], [ex, ey]], 2, '#FFF5E2', 'inkfine', 0);
      if (k > .9) { paint(ellPts(fx, fy, 10, 10, 10), { wash: GOLDC, ink: KR.ink, sw: 2 }); }
      caption(txt, ly, age, { life: WIPE_B - lt[i], size: 56, x: lx, color: i === 3 ? '#FFF5E2' : GOLDC, rot: 0 });
    }
    caps(t);
    if (t > WIPE_B) brushWipe(seg(t, WIPE_B, C0) * .5, [KR.warLt, KR.war]);
  }

  // ---------------- C1: Raktabija and his clones ----------------
  const RK = { x: 560, y: 1480, u: 38 };
  // the clones: [x, y, u, pop time, seed]; drawn back to front
  const CLONES = [
    [290, 1480, 38, DROP_LAND, 1],
    [140, 1300, 26, POPS[0], 2], [880, 1300, 26, POPS[0], 3],
    [380, 1300, 26, POPS[1], 4], [640, 1300, 26, POPS[1], 5], [830, 1480, 38, POPS[1], 6], [1010, 1480, 30, POPS[1], 7],
    [80, 1160, 18, POPS[2], 8], [270, 1160, 18, POPS[2], 9], [460, 1160, 18, POPS[2], 10], [660, 1160, 18, POPS[2], 11],
    [850, 1160, 18, POPS[3], 12], [1020, 1160, 18, POPS[3], 13],
    [730, 1540, 13, POPS[4], 14], [60, 1480, 30, POPS[4], 15],
  ];
  function shotC1(t) {
    const wi = 1 - seg(t, C0, C0 + .35), pull = ease(seg(t, POPS[0], 17));
    camBegin(540, lerp(1150, 1060, pull), lerp(1.3, .95, pull));
    warSky(t, 540, 1000, 1);
    boilSeed('wground'); paint(rectPts(-600, RK.y - 360, 2300, 1400), { wash: KR.warGround, ink: null }); paint(ellPts(540, RK.y - 360, 1200, 60, 30, 8), { wash: '#3E1622', ink: null });
    // the clones, back rows first
    const order = CLONES.map((c, i) => i).sort((a, b) => CLONES[a][1] - CLONES[b][1]);
    const drawRak = (x, y, u, o) => raktabija(x, y, u, o);
    const front = [];
    for (const i of order) {
      const [x, y, u, tp, sd] = CLONES[i], age = t - tp;
      if (age < 0) continue;
      const k = backOut(clamp(age / .3));
      const e = kEmo(t, [[tp, 'surprised', { lookX: (sd % 3 - 1) * .6 }], [tp + .35, sd % 2 ? 'laugh' : 'happy', { lookX: (sd % 3 - 1) * .6 }]], { take: .6 });
      const bonk = (sd === 4 || sd === 5) ? bump(t, BONK + .1, .15, .5) : 0;
      const o = { ...e, rot: (e.rot || 0) + (sd === 4 ? .32 : sd === 5 ? -.32 : 0) * bonk, key: 'clone' + i, seed: sd, emote: bonk > .4 || (sd === 4 || sd === 5) && t > BONK + .2 && t < BONK + 1.2 ? 'stars' : e.emote, emoteK: 1, emoteAge: t - BONK };
      if (y >= RK.y) front.push(() => drawRak(x, y, u * k, o)); else drawRak(x, y, u * k, o);
      vanishPuff(x, y - u * 4, u * 4, age, 'cpuff' + i, ['#E86A6A', '#FFB0A0']);
    }
    // the original: struts in, twirls, gets pinged, watches the drop, delighted
    const wx = lerp(1050, RK.x, easeOut(seg(t, WHY, 13.0)));
    const e = kEmo(t, [[0, 'smug', { lookX: -.6 }], [ARROW + .15, 'surprised', { lookX: -1 }], [ARROW + .45, 'surprised', { lookX: -.6, lookY: 1, emote: null }], [DROP_LAND + .1, 'laugh', { lookX: -.6 }]], { take: .9 });
    const ro = { ...e, flip: true, run: t < 13.0 ? t * 2.2 : null, twirl: bump(t, TWIRL + .3, .25, .4), key: 'rak' };
    front.forEach(f => f());
    raktabija(wx, RK.y, RK.u, ro);
    // the arrow: flies in from the left, pings off his arm, spins away
    if (t > ARROW - .2 && t < ARROW + .8) {
      const hit = [RK.x - 4.8 * RK.u, RK.y - 4 * RK.u], f = seg(t, ARROW - .2, ARROW);
      const p = f < 1 ? [lerp(-120, hit[0], f), lerp(1150, hit[1], f)] : arcPt(hit, [hit[0] - 260, hit[1] - 80], 220, seg(t, ARROW, ARROW + .8));
      const a = f < 1 ? .25 : .25 - 9 * seg(t, ARROW, ARROW + .8);
      boilSeed('arrow'); push(); translate(p[0], p[1]); rotate(a);
      inkLine([[-90, 0], [0, 0]], 4, '#8A5A32', 'ink', 0); paint([[0, -9], [22, 0], [0, 9]], { wash: '#C9D3DF', ink: KR.ink, sw: 1 }); paint([[-90, 0], [-104, -12], [-80, 0], [-104, 12]], { wash: TK.marigold, ink: null });
      pop();
      if (t > ARROW && t < ARROW + .25) sparkleBurst(hit[0], hit[1], 40, t - ARROW, 'ping', 6);
      // the drop: falls in slow motion from his arm to the ground
      const df = easeIn(seg(t, ARROW + .15, DROP_LAND));
      if (t > ARROW + .15 && t < DROP_LAND) bloodDrop(hit[0] - 40 * df, lerp(hit[1], RK.y - 10, df), 22, 'drop');
    }
    if (t > DROP_LAND && t < DROP_LAND + .5) { const k = seg(t, DROP_LAND, DROP_LAND + .5); boilSeed('splat'); for (let i = 0; i < 6; i++) { const a = -Math.PI * (i + .5) / 6; paint(ellPts(CLONES[0][0] + 60 + Math.cos(a) * 40 * k, RK.y - 10 + Math.sin(a) * 30 * k, 7 * (1 - k), 7 * (1 - k), 6), { wash: KR.blood, ink: null }); } }
    camEnd();
    caps(t);
    if (t < C0 + .35) brushWipe(.5 + seg(t, C0, C0 + .35) * .5, [KR.warLt, KR.war]);
  }

  // ---------------- C2: Durga becomes the night ----------------
  const DG = { x: 540, y: 1520, u: 26 };
  function shotC2(t) {
    const drain = easeIn(seg(t, INK0, 18.6)), dark = ease(seg(t, 17.5, 18.5)), crack = bump(t, BOLT + .05, .05, .35);
    const sh = shakeXY(t, crack * 14);
    camBegin(540 + sh[0], 1000 + sh[1], 1 + .04 * (t - DURGA));
    warSky(t, 540, 1000, 1);
    // the ink: night pours down the sky from the top, with drips on its edge, and the stars come out in it
    if (drain > 0) {
      const ey = lerp(-300, 2200, drain);
      boilSeed('ink');
      const p = [[-700, -1500], [1800, -1500]];
      for (let i = 0; i <= 24; i++) { const x = 1800 - i * 104, d = 60 * Math.sin(i * 1.7) + 90 * Math.max(0, Math.sin(i * 2.9 + 1)); p.push([x, ey + d]); }
      paint(p, { wash: KR.night, ink: null, curv: .4 });
      boilSeed('inkstars');
      for (let i = 0; i < 30; i++) { const x = hash(i * 1.7) * 1080, y = 300 + hash(i * 3.9) * 1300; if (y < ey - 60) paint(starPts(x, y, (3 + 5 * hash(i * 2.3)) * (.6 + .4 * Math.sin(T * 2 + i)), .3, 4), { wash: KR.star, ink: null }); }
    }
    boilSeed('dground'); paint(rectPts(-400, DG.y - 20, 1900, 900), { wash: mixCol(KR.warGround, '#141838', drain), ink: null });
    const e = kEmo(t, [[0, 'serene'], [EYE3 + .1, 'fierce', { emote: null }]], { take: .4 });
    const ko = { ...e, dark, wild: ease(seg(t, 17.9, 18.6)), hair: .5 * seg(t, 17.6, 18) * (1 - seg(t, 19, 19.4)), arms: seg(t, 18.15, 18.7), eye3: ease(seg(t, EYE3, EYE3 + .15)),
      bolt: seg(t, BOLT, BOLT + .1), skulls: seg(t, BOLT, BOLT + .5), aura: .55 + .3 * crack, auraCol: mixCol('#FFB850', '#6E86FF', dark), boilKey: 'dg' };
    kalaratri(DG.x, DG.y, DG.u, ko);
    if (t > EYE3 && t < EYE3 + .5) { const [ex, ey] = kalaratriEye3(DG.x, DG.y, DG.u, ko); sparkStar(ex, ey, 30 * Math.sin(seg(t, EYE3, EYE3 + .5) * Math.PI), 'e3s', '#FF8A5A'); }
    if (crack > 0) { const [nx, ny] = kalaratriNeck(DG.x, DG.y, DG.u, ko); [[-260, -120], [250, -60], [-200, 180], [230, 200], [0, -330]].forEach(([dx, dy], i) => zap(nx, ny, nx + dx, ny + dy, 'cz' + i, crack * 1.5, .7)); }
    camEnd();
    flash(crack * .45, '#DCE8FF');
    caps(t);
  }

  // ---------------- C3: not one drop ----------------
  const KB = { x: 290, y: 1500, u: 21 };
  const FOES = [[700, 1500, 26], [860, 1440, 22], [990, 1500, 26], [760, 1390, 18], [930, 1370, 18], [620, 1420, 20]];
  const OG = [840, 1520, 30];
  function shotC3(t) {
    const sl = seg(t, SLASH, SLASH + .25);
    camBegin(560, 1150, 1.15);
    nightSky(540, 1000, { stars: 1, dark: .4 });
    boilSeed('c3ground'); paint(rectPts(-400, 1480, 1900, 900), { wash: '#141838', ink: null }); inkLine([[-100, 1482], [1200, 1478]], 1.2, KR.ink, 'inkfine', .3);
    // the clones charge (left), each one drops a drop as the slash passes, and goes POOF as the lightning takes it
    FOES.forEach(([x0, y, u], i) => {
      const zt = ZAPS[i], gone = t > zt + .05;
      const x = x0 - 120 * easeOut(seg(t, SLASH - .4, SLASH + .1));
      if (!gone) raktabija(x, y, u, { ...kEmo(t, [[0, 'angry'], [SLASH + .1, 'scared', { lookX: -1 }]], { take: .5 }), flip: true, run: t < SLASH + .1 ? t * 2.5 + i * .3 : null, arms: seg(t, SLASH + .1, SLASH + .3), key: 'foe' + i, seed: i });
      vanishPuff(x, y - u * 4, u * 4, t - zt - .05, 'fpuff' + i, ['#E86A6A', '#FFB0A0']);
      // the drop: flies up off him at the slash, arcs toward the ground; the zap catches it
      const d0 = SLASH + .15 + i * .05, f = seg(t, d0, zt);
      if (t > d0 && t < zt) { const p = arcPt([x, y - u * 6], [x - 120 - 40 * i, y - 40], 260, f * .85); bloodDrop(p[0], p[1], 13, 'fd' + i); }
      if (t > zt - .02 && t < zt + .18) {
        const p = arcPt([x, y - u * 6], [x - 120 - 40 * i, y - 40], 260, .85), [nx, ny] = kalaratriNeck(KB.x, KB.y, KB.u, { eye3: 1 });
        zap(nx, ny, p[0], p[1], 'z' + i, seg(t, zt - .02, zt + .03) * 1.1, .8);
      }
      sparkleBurst(...arcPt([x, y - u * 6], [x - 120 - 40 * i, y - 40], 260, .85), 45, t - zt, 'zs' + i, 7, ['#FFFBEA', '#9CC8FF']);
    });
    // the original, behind them all: alone at the end, a gulp, "?", then the flash takes him
    if (t < FLASH) raktabija(OG[0], OG[1], OG[2], { ...kEmo(t, [[0, 'angry'], [SLASH + .2, 'scared', { lookX: -1 }], [ALONE, 'nervous', { emote: '?', lookX: -1 }]], { take: .8 }), flip: true, key: 'og', seed: 9 });
    vanishPuff(OG[0], OG[1] - 120, 160, t - FLASH, 'ogpuff', ['#E86A6A', '#FFB0A0']);
    if (t > FLASH) {   // his moustache floats down like a leaf
      const k = seg(t, FLASH, D0), mx = OG[0] + 40 * Math.sin(k * 7), my = lerp(OG[1] - 175, OG[1] - 20, k);
      boilSeed('stache'); push(); translate(mx, my); rotate(.4 * Math.sin(k * 7));
      for (const s of [-1, 1]) paint(ribbon(U([[s * .15, 0], [s * 1.2, .2], [s * 2.3, 0], [s * 2.9, -.55], [s * 2.9, -1.2]], 30), 22, 4), { wash: KR.stache, ink: KR.ink, sw: 1 });
      pop();
    }
    // Kalaratri: the slash, her lightning, fierce
    const sw = ease(sl), ko = { ...kEmo(t, [[0, 'fierce'], [ALONE + .3, 'fierce', { browL: -.2, browR: .6, lookX: 1 }]], { take: .3 }), hx: .3, lookX: .8, aura: .4,
      backR: [lerp(6.1, 7.4, sw), lerp(-20, -12.5, sw)], khadgaA: lerp(.12, 1.9, sw), boilKey: 'kb' };
    kalaratri(KB.x, KB.y, KB.u, ko);
    const [hx, hy] = kalaratriBackHand(KB.x, KB.y, KB.u, ko, 1);
    slashArc(hx + 40, hy + 40, 300, -1.3, 1.1, seg(t, SLASH, SLASH + .5), 'slash');
    if (t > FLASH - .05 && t < FLASH + .15) { const [nx, ny] = kalaratriNeck(KB.x, KB.y, KB.u, ko); zap(nx, ny, OG[0], OG[1] - 150, 'zog', 1.2, 1.4); }
    camEnd();
    flash(bump(t, FLASH + .05, .05, .3) * .8 + seg(t, 21.7, D0), '#FFFDF6');
    caps(t);
  }

  // ---------------- D1: the gods' rides ----------------
  const PED = [300, 680, 1060, 1440, 1820, 2200], PY = 1330;
  function shotD1(t) {
    const camX = kf(t, [[D0, 180], [LINEUP[0], 300], [LINEUP[1], 680], [LINEUP[2], 1060], [LINEUP[3], 1440], [LINEUP[4], 1820], [DONKEY_IN, 2040], [JAW - .1, 2040], [JAW + .4, 1820]], ease);
    const z = lerp(1.2, 1, ease(seg(t, JAW - .1, JAW + .4)));
    camBegin(camX, 1040, z);
    boilSeed('stage');
    paint(rectPts(-700, -600, 3800, 3000), { wash: KR.stage, ink: null });
    for (let i = 0; i < 9; i++) { const x = -200 + i * 330; glow(x, 700, 260, '#8E7FD8', .25); }
    paint(rectPts(-700, PY + 120, 3800, 1200), { wash: '#2A2250', ink: null });
    inkLine([[-600, PY + 122], [3000, PY + 118]], 1.4, KR.ink, 'inkfine', .2);
    PED.forEach((x, i) => pedestal(x, PY, 250, 'ped' + i));
    nandi(PED[0], PY, 14, { eyes: 'happy', boilKey: 'ln', seed: 1, nod: .05 * Math.sin(t * 2) });
    mooshak(PED[1], PY, 26, { ...clean(feel('proud', t)), boilKey: 'lm' });
    swanV(PED[2], PY, 30, { key: 'ls' });
    const jaw = ease(seg(t, JAW, JAW + .2)), droop = ease(seg(t, JAW + .1, JAW + .6));
    peacockV(PED[3], PY, 21, { key: 'lp', droop, eyes: droop > .3 ? 'sad' : 'happy', lookX: .6 });
    lionV(PED[4], PY, 25, { key: 'll', jaw, eyes: jaw > .3 ? 'wide' : 'cool', lookX: jaw > .3 ? 1 : 0, emote: t > JAW + .1 ? 'sweat' : null, emoteK: seg(t, JAW + .1, JAW + .3), emoteAge: t - JAW });
    // the donkey trots in from the right and hops up onto the last pedestal
    const tr = seg(t, DONKEY_IN - .35, BRAY_D - .05), hop = Math.sin(seg(t, BRAY_D - .25, BRAY_D - .05) * Math.PI) * 1.2;
    const bray = seg(t, BRAY_D, BRAY_D + .1) * (1 - seg(t, 25.25, 25.45));
    if (t > DONKEY_IN - .35) donkey(lerp(2700, PED[5], easeOut(tr)), PY - (t > BRAY_D - .1 ? 0 : 0), 18, { flip: true, walk: tr < 1 ? t * 2.6 : null, dy: -hop, bray: bray * (.6 + .4 * Math.abs(Math.sin((t - BRAY_D) * 9))), ears: -.6 * bray, grin: t > 25.3 ? 1 : 0,
      eyes: bray > .3 ? 'closed' : 'normal', lookX: -.2, boilKey: 'ld' });
    LINEUP.forEach((lt, i) => sparkleBurst(PED[i], PY - 300, 70, t - lt, 'ting' + i, 6));
    camEnd();
    flash(1 - seg(t, D0, D0 + .3), '#FFFDF6');
    caps(t);
    if (t > PASTURE - .25) brushWipe(seg(t, PASTURE - .25, PASTURE) * .5, [KR.skyLt, KR.sky]);
  }

  // ---------------- D2: the wolf ----------------
  const GY = 1480;
  function shotD2(t) {
    camBegin(540 + 8 * Math.sin(t * .5), 1130, 1.3);
    pastureSet(t, 540, 1040, GY);
    bush(860, GY - 10, 110, 'bush1'); bush(150, GY - 5, 80, 'bush2');
    wolfEyes(860, GY - 100, 13, ease(seg(t, EYES, EYES + .3)) * (1 - seg(t, CREEP, CREEP + .1)));
    // the sheep, huddled; later they trot over to their guard
    const run = ease(seg(t, FARMERS, FARMERS + .7));
    [[230, 17, 1], [330, 16, 2], [280, 14, 3]].forEach(([x, u, i]) => {
      const tx = 360 + i * 50;
      sheep(lerp(x, tx, run), GY + (i === 3 ? 20 : 0), u, { key: 'sh' + i, seed: i, walk: run > 0 && run < 1 ? t * 3 : null, hop: run >= 1 ? Math.abs(Math.sin((t + i) * 6)) * .5 * (1 - seg(t, 31.4, 31.8)) : 0,
        eyes: t > EYES && t < FARMERS ? 'scared' : run >= 1 ? 'happy' : 'normal', lookX: t > EYES && t < FARMERS ? 1 : .3, emote: run >= 1 ? 'heart' : null, emoteK: seg(t, FARMERS + .6, FARMERS + .8), emoteAge: t - FARMERS - .6 });
    });
    // the horse: rears at the eyes, turns, bolts off screen-left
    const hr = bump(t, HORSE + .2, .2, .4), hgo = seg(t, HORSE + .45, HORSE + 1.1);
    if (hgo < 1) horse(lerp(330, -600, easeIn(hgo)), GY - 40, 24, { key: 'hz', rear: hr, flip: hgo > 0, gallop: hgo > 0 ? t * 3.5 : null, eyes: 'wide', emote: t > HORSE && t < HORSE + .6 ? '!!' : null, emoteK: seg(t, HORSE, HORSE + .15), emoteAge: t - HORSE });
    if (hgo > 0 && hgo < 1) vanishPuff(lerp(330, -600, easeIn(hgo)) + 160, GY - 30, 70, (t - HORSE - .45) % .3, 'dust', ['#6A7AA0', '#8A98BA']);
    // the donkey: plants, brays, spins round, KICKS
    const spun = t > SPIN, kick = seg(t, KICK - .05, KICK + .05) * (1 - seg(t, KICK + .35, KICK + .55));
    const bray = seg(t, BRAY_W, BRAY_W + .1) * (1 - seg(t, 28.55, 28.7));
    const dO = { flip: spun, plant: spun ? 0 : ease(seg(t, PLANT, PLANT + .2)), ears: t > PLANT && t < 29.6 ? 1 : 0, kick, bray: bray * (.6 + .4 * Math.abs(Math.sin((t - BRAY_W) * 9))),
      eyes: t > PLANT && t < 29.6 ? (bray > .3 ? 'closed' : 'angry') : t > FARMERS ? 'happy' : 'normal', lookX: spun ? 0 : .6, sq: -.1 * bump(t, SPIN + .03, .05, .12), boilKey: 'pd',
      tail: kick > .1 ? -1 : undefined, emote: t > 30.6 ? 'heart' : null, emoteK: seg(t, 30.6, 30.8), emoteAge: t - 30.6 };
    donkey(600, GY, 26, dO);
    // the wolf: creeps out, gets kicked, tumbles away over the hills
    const fly = seg(t, KICK, TWINKLE - .05);
    if (t > CREEP && t < TWINKLE) {
      const cx = lerp(890, 790, easeOut(seg(t, CREEP, SPIN))), p = fly > 0 ? arcPt([cx, GY], [780, 760], 420, easeOut(fly)) : [cx, GY];
      wolf(p[0], p[1], lerp(20, 3, fly), { key: 'wf', creep: fly > 0 ? 0 : 1, walk: fly > 0 ? null : t * 2, tumble: fly * 14, eyes: fly > 0 ? 'x' : 'glow' });
    }
    if (t > KICK - .02 && t < KICK + .35) { const k = seg(t, KICK - .02, KICK + .35); boilSeed('thwack'); glow(760, GY - 110, 140 * (1 - k), '#FFE39A', 1); paint(starPts(760, GY - 110, 110 * Math.sin(k * Math.PI) + 10, .4, 9, .3), { wash: '#FFF5E2', ink: KR.ink, sw: 1.4 }); }
    if (t > TWINKLE) sparkStar(780, 760, 26 * Math.sin(seg(t, TWINKLE, TWINKLE + .6) * Math.PI), 'twinkle');
    camEnd();
    caps(t);
    if (t < PASTURE + .3) brushWipe(.5 + seg(t, PASTURE, PASTURE + .3) * .5, [KR.skyLt, KR.sky]);
    whipH(seg(t, RIDE_IN - .2, RIDE_IN), 1, t, ['#DCE4FF', '#8E9AE0']);
  }

  // ---------------- D3: she rides in; the ear scratch ----------------
  const RD = { x: 470, y: GY, du: 30, ku: 21 };
  function shotD3(t) {
    camBegin(500, 1130, 1.3);
    pastureSet(t, 540, 1040, GY);
    bush(860, GY - 10, 110, 'bush1');
    sheep(760, GY + 10, 15, { key: 's1', seed: 1, flip: true, eyes: 'happy', lookX: -.4 });
    sheep(200, GY + 30, 14, { key: 's2', seed: 2, eyes: 'normal', lookX: .5 });
    const walk = seg(t, RIDE_IN, 33.2), x = lerp(-150, RD.x, easeOut(walk)), proud = ease(seg(t, 33.3, 33.6));
    const sc = t > SCRATCH, lean = ease(seg(t, SCRATCH, SCRATCH + .4));
    const dO = { walk: walk < 1 ? t * 1.8 : null, plant: .45 * proud * (1 - lean), nod: -.2 * proud * (1 - lean) + .2 * lean, eyes: sc ? 'happy' : proud > .5 ? 'happy' : 'normal', grin: proud * (1 - lean),
      earR: sc ? .25 + .15 * Math.sin(t * 9) : 0, emote: t > 34.9 ? 'heart' : null, emoteK: seg(t, 34.9, 35.1), emoteAge: t - 34.9 };
    const s = donkeySeat(x, RD.y, RD.du, dO);
    let ko = { ...kEmo(t, [[0, 'fierce', { hx: .2, lookX: .3 }], [33.4, 'gentle', { hx: .2, lookX: .4 }], [SCRATCH, 'delight', { hx: .5, lookX: 1, lookY: .6 }]], { take: .3 }), sit: 1, trishul: false, aura: .2 };
    if (lean > 0) {   // her right hand reaches his ear and scratches it
      const [ex, ey] = donkeyWorld(x, RD.y, RD.du, dO, 5.5, -11.4, true), tgt = shailputriReach(s[0], s[1], RD.ku, ko, ex, ey), rest = [4.3, -13.5];
      const sw = Math.sin(t * 22) * .25 * seg(t, SCRATCH + .35, SCRATCH + .5);
      ko.handR = [lerp(rest[0], tgt[0] + sw, lean), lerp(rest[1], tgt[1] - Math.abs(sw), lean)];
    }
    rider(x, RD.y, RD.du, RD.ku, dO, ko);
    camEnd();
    whipH(1 - seg(t, RIDE_IN, RIDE_IN + .25), 1, t, ['#DCE4FF', '#8E9AE0']);
    caps(t);
    if (t > 36.4) brushWipe(seg(t, 36.4, E0) * .5, ['#E8A860', '#7A4A30']);
  }

  // ---------------- E + F: Shubhankari, and the comment beat ----------------
  const BOYP = { x: 400, y: 1430, u: 30 }, WIN = [630, 700, 290, 560];
  function shotE(t) {
    const warm = ease(seg(t, SOFT, SOFT + .7)), rise = backOut(seg(t, WINDOW, WINDOW + .4)), drise = backOut(seg(t, WINDOW + .2, WINDOW + .6));
    const pb = ease(seg(t, F0, F0 + 1));
    camBegin(540, 1060 + 30 * pb, lerp(1.02 + .006 * (t - E0), .95, pb));
    bedroomSet(t, warm, { window: WIN });
    if (t > WINDOW - .1) glow(WIN[0] + WIN[2] / 2, WIN[1] + WIN[3] * .5, 300, warm > .5 ? '#FFD27A' : '#9CB4FF', .45 * seg(t, WINDOW - .1, WINDOW + .2));
    // her, rising into the window; the donkey's head beside her
    const wav = t > F0 ? Math.sin((t - WAVES[1]) * 9) * seg(t, WAVES[1], WAVES[1] + .2) : 0;
    const ko = { ...kEmo(t, [[0, 'gentle', { lookX: -1 }], [SOFT, 'delight', { lookX: -1, hx: -.3 }], [SOFT + .6, 'gentle', { lookX: -1, hx: -.35, mouth: 'smile' }], [LICK, 'delight', { hx: -.35 }], [F0, 'gentle', { lookX: -.6, hx: -.2 }]], { take: .2 }),
      arms: 0, trishul: false, boltSoft: warm, bolt: 1, aura: .2 + .3 * warm, auraCol: '#FFC870', noShadow: true, boilKey: 'kw',
      handR: t > F0 ? [4.4 + wav * .6, -19 - Math.abs(wav) * .3] : undefined, bendR: t > F0 ? 1.4 : undefined };
    if (t > WINDOW - .05) kalaratri(812, lerp(1820, 1300, rise), 18, ko);
    const lk = bump(t, LICK + .25, .3, .7), dO = { flip: true, eyes: lk > .3 ? 'happy' : 'normal', lookX: .4, grin: t > SOFT + .4 ? .8 : 0, lick: lk, nod: .15 * lk, earL: t > F0 ? .5 * Math.sin((t - WAVES[2]) * 12) * seg(t, WAVES[2], WAVES[2] + .2) : 0, boilKey: 'dw' };
    if (t > WINDOW + .15) {   // place him by his head: it rises over the sill at the window's left, and stretches to the boy for the lick
      const hd = donkeyHead(0, 0, 22, dO), tx = lerp(712, 555, lk), ty = lerp(1500, 1150, drise) - 95 * lk;
      donkey(tx - hd[0], ty - hd[1], 22, dO);
    }
    windowFront(warm, { window: WIN });
    // the coat on its hook and its shadow: a monster, then a bunny
    coatAndShadow(150, 600, 300, 800, 120, ease(seg(t, SOFT + .1, SOFT + .8)), warm);
    // the boy in bed, the blanket up to his nose; he startles, calms, giggles, waves
    bed(BOYP.x, BOYP.y, 640, warm);
    const scared = t < SOFT + .35, startle = bump(t, WINDOW + .1, .05, .3), giggle = t > LICK + .15 && t < DARK_LINE + .5;
    const blank = scared ? 1 : 1 - ease(seg(t, SOFT + .35, SOFT + .9));
    push(); translate(0, -14 * startle);
    boyFront(BOYP.x, BOYP.y, BOYP.u, {
      eyes: scared ? 'wide' : giggle ? 'happy' : 'open', lookX: scared ? (t > WINDOW ? 1 : -1) : .7, lookY: scared && t < WINDOW ? -1 : -.2,
      worry: scared ? 1 : 0, tremble: scared ? (t > WINDOW ? 1 : .6) : 0, mouth: scared ? (t > WINDOW ? 'O' : 'wobble') : giggle ? 'grin' : 'smile', blush: giggle ? .9 : t > SOFT ? .3 : 0,
      tilt: giggle ? -.12 + .05 * Math.sin(t * 14) : 0, rim: warm, glow: warm * .4, noShadow: true,
      handL: [lerp(-3, -2.6, blank), lerp(-7, -10.4, blank)], handR: t > F0 ? [6.5 + Math.sin((t - WAVES[0]) * 10) * .8 * seg(t, WAVES[0], WAVES[0] + .2), -12.5] : [lerp(3, 2.6, blank), lerp(-7, -10.4, blank)],
      held: (u, sw) => { const top = lerp(-6.4, -10.9, blank); paint([[-5.2 * u, top * u], [0, (top - .25) * u], [5.2 * u, top * u], [5.4 * u, -1 * u], [-5.4 * u, -1 * u]], { wash: mixCol(KR.blanket, '#C88A6A', warm * .35), ink: KR.ink, sw, curv: .3 }); inkLine([[-5 * u, (top + .5) * u], [5 * u, (top + .5) * u]], sw * 2.2, KR.blanketLt, 'ink', .3); },
    });
    pop();
    blanket(BOYP.x, BOYP.y + 60, 640, warm);
    const kh = kalaratriHead(812, lerp(1820, 1300, rise), 18, ko);
    const ks = toScreen(kh[0], kh[1]);
    camEnd();
    veil('#FFB060', .08 * warm);
    caps(t);
    if (t < E0 + .3) brushWipe(.5 + seg(t, E0, E0 + .3) * .5, ['#E8A860', '#7A4A30']);
    // the crescent-moon iris closes on her smiling face and opens on the card's peach
    if (t > IRIS) {
      flushLetters(); const k = ease(seg(t, IRIS, CARD)), r = lerp(1300, 0, k) + 2; boilSeed('moniris');
      iris(ks[0], ks[1], r, TK.peach);
      if (r > 20) { const e = ellPts(ks[0], ks[1], r, r, 40); inkLine([...e, e[0], e[1]], 10, '#F5ECD6', 'ink', .5); }
    }
  }

  // ---------------- the card ----------------
  function shotCard(t) {
    kalaCard(t, { cover: COVER7, row: ROW13, price: PRICE, logo: LOGO, pill: PILL, follow: FOLLOW });
    const age = t - CARD_CAP, life = LOGO - CARD_CAP - .05;
    if (age >= 0 && age < life) {
      const a = 1 - seg(age, life - .2, life);
      letter('Navratri Day 7: Maa Kalaratri', 508, 462, 54, TK.teal, { screen: true, font: '54px Marcellus', ink: false, pop: age * 5, alpha: a, maxW: 900 });
      letter('Book 7 is on its way!', 508, 540, 38, TK.rkOrange, { screen: true, font: '500 38px Poppins', ink: false, pop: Math.max(0, age - .1) * 5, alpha: a, maxW: 880 });
    }
    const k = frac((t - FOLLOW) / 1.6);
    if (t > FOLLOW) { flushLetters(); boilSeed('sparkle'); paint(starPts(lerp(320, 700, k), lerp(1000, 640, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
  }

  shots([[0, shotA], [B0, shotB], [C0, shotC1], [DURGA, shotC2], [SLASH, shotC3], [D0, shotD1], [PASTURE, shotD2], [RIDE_IN, shotD3], [E0, shotE], [CARD, shotCard]]
    .map(([s0, fn]) => [s0, t => fn(t)]));
})();
