// "Why does Shailputri ride a bull?": a captioned explainer for Rishi Katha's Navadurga picture books. Nandi proves what
// a bull is (he shatters a boulder, stands through a gale, waits a whole night in the snow), then all that power bows
// to the lotus in her hand; she rides, and flowers bloom where he walks. Nine niches, nine forms, and the book.
// 42 s, 1080×1920 (a vertical reel). Storyboard: STORYBOARD.md. Sets and props: shailputri_props.js.
// Characters: src/nandi.js, src/shailputri.js. Sound: tools/shailputri_sfx.mjs (it copies the times below).
//
// Every pose is a pure function of film time (nandiO, sheO), so the shots only choose a set, a camera, captions and
// their transitions. Frame 0 is a finished picture with its caption already up: no fade in.
(() => {
  // HOLD: the title card of shot B ("Daughter of the Mountain…") holds this much longer. Every later shot is written in
  // scene time and simply starts HOLD later (see shots() at the end); the SFX cue list shifts the same way.
  const HOLD = 1.8;
  const A0 = 0, B0 = 3.6, C0 = 9.6, D0 = 18.6, E0 = 27.0, F0 = 34.2;
  const QMARK = 1.5, PAT = 2.3;
  const SHAIL = 5.0, PUTRI = 6.7, HEART = [6.9, 8.0], TITLE = 8.2, WIPE_BC = 9.3;
  const RANDOM = 9.9, LOOK = 10.5, ROLL = [10.8, 11.4], IMPACT = 11.4, BURST = 11.55, SNORT = 12.3,
    WIND = [12.6, 14.6], W_STAB = 13.2, BIRD_IN = [13.0, 13.8], CHIRP = 14.8, LAPSE = [15.0, 17.2], W_STEAD = 15.6, SHE_IN = [17.4, 18.3];
  const SHAKE = 18.9, STOMP = 19.2, PALM = 19.8, TOUCH = 20.6, BOW = [21.0, 21.7], SWIRL = [22.2, 22.8], SEATED = 22.5,
    RISE = [22.6, 23.1], RIDE = 23.1, MEANING = 23.6, DUSK = [26.2, 27.0], ARCH_IRIS = [26.4, 27.0];
  const LIGHT0 = 28.2, LIGHT_STEP = .3, FIRST = 30.6, TEASE = 32.4, Q_TRISHUL = 32.8, Q_LOTUS = 33.3, WINK = 33.7, WIPE_EF = 33.9;
  const CARD = { book: 34.5, fan: 35.0, logo: 35.5, series: 35.9, sub: 36.3, pill: 36.7, follow: 37.3 };

  const HERO = { nx: 460, gy: 1420, un: 40, us: 24 };            // the riding pair: frame 0, shot B, the ride
  const SLOPE = { nx: 250, gy: 1400, un: 38, sheX: 845, us: 22 };  // Nandi alone (C), and her standing before him (D)
  const groundY = x => 1400 - Math.max(0, x - 900) * .7;          // the slope: flat, rising to the right
  const BOULDER_R = 200;
  const bump = (t, t0, a = .1, b = .25) => seg(t, t0 - a, t0) * (1 - seg(t, t0, t0 + b));   // 0 → 1 → 0 around t0
  const bumps = (t, evs, a, b) => evs.reduce((m, e) => Math.max(m, bump(t, e, a, b)), 0);
  // the ride: he eases into his walk. rideD = seconds of full-speed walking done by t; rideT is its inverse.
  const RATE = 1.15, SPEED = 170, rd = a => a - .4 * (1 - Math.exp(-a / .4));
  const rideD = t => rd(Math.max(0, t - RIDE));
  const rideT = d => { let lo = 0, hi = 12; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (rd(m) < d) lo = m; else hi = m; } return RIDE + lo; };

  // ---------------- Nandi ----------------
  function nandiO(t) {
    if (t < C0) {   // A, B: standing under her
      const o = { x: HERO.nx, y: HERO.gy, u: HERO.un, seed: 1, bell: .3 * spring(t, -.15, 3, 10), nod: .03 * Math.sin(t * 1.3) };
      o.lookX = kf(t, [[1.4, .6], [1.65, -.6], [2.9, -.6], [3.3, .4]]);
      o.ear = -.55 * bump(t, QMARK + .08, .08, .25);
      if (t > QMARK && t < 2.4) { o.emote = '?'; o.emoteK = seg(t, QMARK, QMARK + .2) * (1 - seg(t, 2.1, 2.3)); o.emoteAge = t - QMARK; }
      if (t > PAT + .1 && t < 3.3) { o.eyes = 'happy'; o.tail = Math.sin(t * 14) * .8; }
      if (t > HEART[0] && t < TITLE) { o.lookX = .3; o.lookY = -.8; }
      return o;
    }
    if (t >= SEATED) {   // she is up: he rises and walks
      const up = seg(t, RISE[0], RISE[1]), d = rideD(t);
      const o = { x: HERO.nx, y: HERO.gy, u: HERO.un, seed: 1, eyes: 'happy', kneel: 1 - backOut(up), nod: .6 * (1 - ease(up)) + .04 * Math.sin(t * 2) };
      if (t > RIDE) { o.walk = RATE * d; o.bell = .3 * Math.sin(o.walk * TAU * 2) * Math.min(1, d * 2); o.wind = .12 * Math.min(1, d); }
      return o;
    }
    const o = { x: SLOPE.nx, y: SLOPE.gy, u: SLOPE.un, seed: 1, nod: 0, eyes: 'normal', lookX: .5 };
    if (t < LOOK) { o.nod = .05 + .03 * Math.sin(t * 10); o.ear = -.45 * bump(t, 10.2, .08, .2); }
    else if (t < ROLL[0]) {
      o.eyes = 'wide'; o.lookX = 1; o.lookY = -.7; o.emote = '!'; o.emoteK = seg(t, LOOK, LOOK + .15) * (1 - seg(t, ROLL[0] - .12, ROLL[0])); o.emoteAge = t - LOOK;
      o.sq = take(t, LOOK, .5).sq; o.ear = .3;
    } else if (t < WIND[0]) {   // he braces, takes the boulder on his forehead, and snorts
      const br = ease(seg(t, ROLL[0], ROLL[0] + .35)), up = ease(seg(t, 11.9, 12.2));
      o.eyes = t < 11.9 ? 'determined' : 'happy'; o.lookX = 1;
      o.nod = br * (1 - up) - .12 * up * (1 - seg(t, 12.35, 12.6));
      o.dx = -.35 * bump(t, ROLL[0] + .22, .22, .2) + .2 * br * (1 - up);
      o.sq = .05 * spring(t, IMPACT, 8, 30);
      if (t > SNORT) o.snort = seg(t, SNORT, SNORT + .4);
    } else if (t < LAPSE[0]) {   // the gale: nothing moves but his ears and tail
      const w = ease(seg(t, WIND[0], WIND[0] + .4)) * (1 - ease(seg(t, WIND[1] - .3, WIND[1] + .1)));
      o.wind = w; o.eyes = w > .3 ? 'determined' : 'normal'; o.nod = .18 * w; o.dx = .12 * w; o.lookX = 1;
      if (t > CHIRP - .2) { o.lookX = -.2; o.lookY = -1; }
    } else if (t < D0) {   // the long night, then she comes
      o.snow = seg(t, 15.3, 17.0); o.lookX = .8;
      if (nightK(t) > .6) o.eyes = 'closed';
      if (t > SHE_IN[0] + .3) { o.eyes = 'happy'; o.tail = Math.sin(t * 14) * .8; o.ear = .25 * Math.sin(t * 9); }
    } else {   // the mighty shake, the stomp; then the lotus, and he bows
      const cr = ease(seg(t, D0, SHAKE)) * (1 - seg(t, SHAKE, SHAKE + .08));
      o.snow = t < SHAKE + .04 ? 1 : 0;
      o.sq = .13 * cr + .1 * spring(t, STOMP, 7, 26) + .04 * spring(t, BOW[1], 8, 20);
      o.lift = ease(seg(t, SHAKE, SHAKE + .14)) * (1 - easeIn(seg(t, STOMP - .12, STOMP)));
      o.dx = t > SHAKE && t < STOMP ? .15 * Math.sin(t * 70) : 0;
      o.eyes = t < SHAKE ? 'happy' : t < PALM ? 'wide' : t < TOUCH - .15 ? 'normal' : 'closed'; o.lookX = 1;
      o.wind = t > SHAKE && t < STOMP + .2 ? .6 * Math.abs(Math.sin(t * 40)) : 0;
      if (t > STOMP + .1 && t < STOMP + .6) o.snort = seg(t, STOMP + .1, STOMP + .55);
      o.nod = -.2 * o.lift + .5 * ease(seg(t, PALM + .3, TOUCH)) + .1 * ease(seg(t, BOW[0], BOW[1]));
      o.bell = .35 * spring(t, TOUCH, 4, 14);
      o.kneel = ease(seg(t, BOW[0], BOW[1]));
      o.tail = t < PALM ? Math.sin(t * 16) * .8 : undefined;
    }
    return o;
  }
  const nightK = t => ease(seg(t, LAPSE[0], LAPSE[0] + .8)) * (1 - ease(seg(t, 16.5, LAPSE[1])));

  // ---------------- Shailputri ----------------
  const sEmo = (t, keys, o) => emotions(t, keys.map(([k, n, ov]) => [k, n, { ...SHL_SKIN, ...(ov || {}) }]), o);
  const HAND_R = [3.4, -14.6], HAND_L = [-4.2, -14.2];
  const mixP = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  function sheO(t) {
    const face = sEmo(t, [[0, 'gentle'], [PAT, 'delight'], [3.2, 'gentle'], [PUTRI + .15, 'delight'], [TITLE, 'gentle'], [SHAKE + .1, 'delight'], [PALM, 'serene'], [SEATED, 'gentle']], { take: .5 });
    if (t < C0 || t >= SEATED) {   // riding
      const o = { ...face, sit: 1, u: HERO.us, mode: 'ride', seed: 2 }, d = rideD(t);
      o.hair = t < C0 ? .12 + .5 * spring(t, -.15, 3, 8) : .2 + .6 * Math.min(1, d) + .08 * Math.sin(t * 5);
      const pat = ease(seg(t, PAT - .15, PAT + .1)) * (1 - ease(seg(t, 2.85, 3.1))), wave = ease(seg(t, PUTRI, PUTRI + .3)) * (1 - ease(seg(t, TITLE - .3, TITLE)));
      o.handR = mixP(mixP(HAND_R, [5.5, -14.2 - .5 * bumps(t, [PAT + .2, PAT + .5], .12, .12)], pat), [4.7 + .6 * Math.sin(t * 9), -19.3], wave);
      o.lean = 1.3 * pat; o.hx = .5 * pat; o.lookY = (face.lookY || 0) - .8 * wave; o.htilt = -.08 * wave;
      if (t > RIDE) { o.swing = Math.sin(RATE * d * TAU * 2 - 1); o.trishulA = .03 * Math.sin(RATE * d * TAU * 2 - .6); }
      return o;
    }
    if (t < SHE_IN[0]) return null;
    // standing before him, turned his way: the trishul behind her, the lotus toward him
    const k = ease(seg(t, SHE_IN[0], SHE_IN[1])), step = ease(seg(t, PALM, PALM + .45)), x = lerp(1240, SLOPE.sheX, k) - 62 * step, moving = t < SHE_IN[1];
    const o = { ...face, x, y: SLOPE.gy + 8, u: SLOPE.us, mode: 'stand', flip: true, hx: .5, seed: 2 };
    if (moving || (step > 0 && step < 1)) { o.walk = (1240 - x) / (3.2 * SLOPE.us); o.hair = .45 * Math.sin(k * Math.PI); }
    o.lean = -1.7 * bump(t, SHAKE + .22, .2, .55);
    const n = nandiO(Math.max(t, TOUCH)), fh = nandiHead(n.x, n.y, n.u, n);
    const target = shailputriReach(x, o.y, o.u, o, fh[0] + 14, fh[1] + 2.5 * o.u);
    o.handR = mixP(HAND_R, target, ease(seg(t, PALM + .1, PALM + .6)));
    o.lookX = .8;
    return o;
  }

  // ---------------- the sets ----------------
  // A, B: the pair at the foot of the mountain. `wide` 0..1 = how far the camera has pulled back (dressing fades in).
  function stageHero(t, wide) {
    const S = {};
    sky(S, true); bigPeak(S);
    cloud(-150 + t * 8, -640, 300, S, wide); cloud(1230 - t * 6, -250, 220, S, wide);
    if (wide > 0) { pine(-210, 1440, 460, 0, S); pine(-420, 1470, 340, 0, S); pine(1310, 1440, 430, 0, S); pine(1500, 1480, 320, 0, S); flags(1130, 930, 1560, 1010, t, 0, S, 500); }
    snowGround(0, S, () => 1420, -520, 1600, 2330);
    hoofPrints(330, 1500, 9, wide);
    const n = nandiO(t), s = sheO(t), seat = nandiSeat(n.x, n.y, n.u, n);
    nandi(n.x, n.y, n.u, n);
    shailputri(seat[0], seat[1], s.u, s);
    return { n, s, seat };
  }
  // C, D: the slope. Returns the light it used.
  function stageSlope(t) {
    const nk = t < D0 ? nightK(t) : 0, S = { night: nk, warm: .3 * ease(seg(t, 16.6, 17.4)) };
    const wind = t > WIND[0] - .1 && t < LAPSE[0] ? ease(seg(t, WIND[0], WIND[0] + .4)) * (1 - ease(seg(t, WIND[1] - .3, WIND[1] + .1))) : 0;
    sky(S);
    stars(nk, t);
    if (t > LAPSE[0] - .01) {
      const a = seg(t, LAPSE[0], LAPSE[0] + .7), m = seg(t, 15.6, 16.7), r = seg(t, 16.5, LAPSE[1]);
      if (a < 1) sunDisc(lerp(900, 640, a), lerp(790, 1080, easeIn(a)), 60, 1);
      if (m > 0 && m < 1) moonDisc(lerp(1000, 80, m), 900 - 70 * Math.sin(m * Math.PI), 46, Math.min(1, Math.sin(m * Math.PI) * 3));
      if (r > 0) sunDisc(lerp(120, 215, r), lerp(1080, 800, easeOut(r)), 60, 1);
    }
    ridge(0, { y: 1250, h: 330, period: 420, seed: 2.1, col: spTone(SP.mtnFar, S), snow: spTone(SP.snow, S) });
    ridge(140, { y: 1340, h: 430, period: 640, seed: 7.7, col: spTone(SP.mtn, S), snow: spTone(SP.snow, S) });
    flags(130, 740, 1140, 690, t, wind, S, 680);
    pine(60, 1408, 400, -.1 * wind + .012 * Math.sin(t * 1.7), S);
    pine(1010, groundY(1010) + 8, 330, -.12 * wind + .012 * Math.sin(t * 1.4 + 1), S);
    snowGround(0, S, groundY);
    return { S, wind };
  }
  // the little bird: blown in by the gale, clinging to his horn, asleep through the night, off at the shake
  function birdAt(t, n) {
    if (t < BIRD_IN[0] || t > SHAKE + .9) return;
    const tip = nandiHornTip(n.x, n.y, n.u, n), w = n.wind || 0;
    if (t < BIRD_IN[1]) {
      const k = seg(t, BIRD_IN[0], BIRD_IN[1]), p = arcPt([1180, 760], [tip[0] + 30, tip[1]], -60, easeOut(k));
      return bird(p[0], p[1], 34, { rot: -k * 9, flap: Math.sin(t * 50) * .9, flip: true });
    }
    if (t < SHAKE) {
      const cling = t < WIND[1] + .1 ? ease(w) : 0, fl = cling * Math.sin(t * 44);
      return bird(tip[0] + 4 - cling * 26, tip[1] + 2 + cling * 8 + fl * 3, 34, { flip: true, rot: cling * (1.25 + .1 * fl), flap: cling * (.8 + .5 * fl),
        chirp: bump(t, CHIRP, .06, .08) + bump(t, CHIRP + .16, .06, .08) + bump(t, SHE_IN[0] + .5, .06, .1), sleep: nightK(t) > .4 || (t > 15.6 && t < SHE_IN[0] + .35) });
    }
    const k = seg(t, SHAKE, SHAKE + .9), p = arcPt([tip[0], tip[1]], [1240, 520], 220, easeOut(k));
    bird(p[0], p[1], 34, { flap: Math.sin(t * 46) * 1.1, rot: -.3 });
  }

  // ---------------- captions ----------------
  // a word of the list in shot C: it stamps in marigold, turns cream when the next one lands, and fades with the list
  function word(txt, y, t, t0, t1) {
    if (t < t0) return;
    letter(txt, W * .47, y, 72, t < t1 ? SP.marigold : PAL.cream, { screen: true, pop: (t - t0) * 5, rot: -.02, alpha: 1 - seg(t, 18.15, 18.4), stroke: PAL.ink, sw: .22, ink: false, maxW: 800 });
  }

  // ---------------- A + B: the hook, and who she is ----------------
  function shotHero(t) {
    const [cx, cy, z] = kf(t, [[0, [540, 960, 1]], [3.0, [540, 952, 1.04]], [5.0, [540, 520, .56]], [C0 + HOLD, [540, 500, .59]]]);
    const wide = ease(seg(t, 3.5, 4.5));
    camBegin(cx, cy, z);
    // poses run on scene time: the longer hold stretches the last stretch of it, so nothing freezes
    const tp = t < TITLE ? t : TITLE + (t - TITLE) * (C0 - TITLE - .01) / (C0 + HOLD - TITLE);
    const { seat, s } = stageHero(tp, wide);
    // the summit glints, then the whole peak glows under its name
    const gl = bump(t, 4.8, .25, .5);
    if (gl > 0) { glow(540, -400, 420 * gl, '#FFF1CF', gl); boilSeed('glint'); paint(starPts(540, -415, 120 * gl, .2, 4), { wash: SP.cream, ink: null }); }
    const pk = ease(seg(t, SHAIL, SHAIL + .4)) * (1 - ease(seg(t, PUTRI - .4, PUTRI)));
    if (pk > 0) glow(540, 60, 900, '#FFE9B8', .45 * pk * (.85 + .15 * Math.sin(t * 5)));
    // a heart floats from her up to her mountain
    if (t > HEART[0] && t < HEART[1] + .2) {
      const k = seg(t, HEART[0], HEART[1]), p = arcPt([seat[0] + 90, seat[1] - 330], [560, -150], 260, ease(k));
      emote('heart', p[0], p[1], lerp(70, 150, k), seg(t, HEART[0], HEART[0] + .2) * (1 - seg(t, HEART[1], HEART[1] + .2)), t - HEART[0]);
    }
    camEnd();
    snowfall(t, 8, 0, [400, 720]);
    // the hook is already up on frame 0
    caption('WHY DOES SHAILPUTRI', 498, t + 1, { life: 4.2, size: 70 });
    caption('RIDE A BULL?', 606, t + 1, { life: 4.2, size: 104, color: SP.marigold });
    caption('SHAIL = mountain', 600, t - SHAIL, { life: PUTRI - SHAIL - .1, size: 76 });
    caption('PUTRI = daughter', 1000, t - PUTRI, { life: TITLE - PUTRI - .1, size: 70 });
    caption('Daughter of the Mountain', 560, t - TITLE, { life: 1.25 + HOLD, size: 80, color: SP.marigold });
    caption("the first of Maa Durga's nine forms", 655, t - TITLE - .25, { life: 1 + HOLD, size: 56 });
    flushLetters();
    if (t > WIPE_BC + HOLD) brushWipe((t - WIPE_BC - HOLD) / .6, [SP.snowDk, SP.snow]);
  }

  // ---------------- C: the bull ----------------
  const N_HIT = (() => { let c; return () => c || (c = (() => { const n = nandiO(IMPACT); return nandiHead(n.x, n.y, n.u, n); })()); })();
  function boulderAt(t) {
    const h = N_HIT(), by = SLOPE.gy - BOULDER_R, dy = by - h[1], bx = h[0] + Math.sqrt(Math.max(0, BOULDER_R * BOULDER_R - dy * dy)) - 6;
    if (t < ROLL[0] - .25 || t > BURST + 1.2) return;
    if (t < BURST) {
      const k = Math.pow(seg(t, ROLL[0] - .25, IMPACT), 1.5), x = lerp(1420, bx, k) + 10 * spring(t, IMPACT, 9, 40), y = groundY(x) - BOULDER_R;
      boulder(x, y, BOULDER_R, -(1420 - x) / BOULDER_R, t > IMPACT ? seg(t, IMPACT, BURST) : 0);
    } else shards(bx, by, BOULDER_R, t - BURST, SLOPE.gy);
    return [h, bx, by];
  }
  function shotC(t) {
    const sh = t > IMPACT && t < IMPACT + .35 ? shakeXY(t, 16 * (1 - seg(t, IMPACT, IMPACT + .35))) : [0, 0];
    camBegin(540 + 6 * Math.sin(t * .5) + sh[0], 960 + sh[1], 1.01 + .012 * seg(t, C0, D0));
    const { wind } = stageSlope(t), n = nandiO(t), hit = N_HIT();
    boulderAt(t);
    nandi(n.x, n.y, n.u, n);
    if (t > BURST + 1.2) shards(0, 0, 0, -1);
    if (t >= BURST) { const h = hit, by = SLOPE.gy - BOULDER_R, bx = h[0] + Math.sqrt(Math.max(0, BOULDER_R * BOULDER_R - (by - h[1]) ** 2)) - 6; pebbles(bx, t - BURST); }
    dustPuff(hit[0] + 30, SLOPE.gy - 10, 150, t - IMPACT, SP.snow);
    if (t > IMPACT && t < IMPACT + .3) { boilSeed('hitstar'); paint(starPts(hit[0] + 46, hit[1] - 10, 84 * (1 - seg(t, IMPACT, IMPACT + .3) * .5), .4, 7, t * 3), { wash: SP.cream, ink: SP.ink, sw: 1.2 }); }
    birdAt(t, n);
    const s = sheO(t);
    if (s) shailputri(s.x, s.y, s.u, s);
    if (t > CHIRP - .05 && t < CHIRP + .5) { const tip = nandiHornTip(n.x, n.y, n.u, n); emote('music', tip[0] + 66, tip[1] - 56, 40, seg(t, CHIRP - .05, CHIRP + .1) * (1 - seg(t, CHIRP + .3, CHIRP + .5)), t - CHIRP); }
    if (t > 15.7 && t < SHE_IN[0] + .3) { const tip = nandiHornTip(n.x, n.y, n.u, n); emote('zzz', tip[0] + 64, tip[1] - 30, 34, seg(t, 15.7, 15.9) * (1 - seg(t, SHE_IN[0], SHE_IN[0] + .3)), t - 15.7); }
    camEnd();
    gust(t, wind);
    snowfall(t, Math.round(8 + 46 * wind), wind, wind > .1 ? null : [400, 720]);
    caption("Her bull isn't random.", 520, t - RANDOM, { life: 1.15, size: 70 });
    word('STRENGTH', 472, t, IMPACT + .05, W_STAB);
    word('STABILITY', 572, t, W_STAB, W_STEAD);
    word('STEADFASTNESS', 672, t, W_STEAD, 99);
    flushLetters();
    if (t < C0 + .3) brushWipe(.5 + (t - C0) / .6, [SP.snowDk, SP.snow]);
  }
  // the three pebbles the boulder leaves (they sit still once shards() has landed them)
  function pebbles(bx, age) {
    if (age < 1.2) return;
    for (let i = 0; i < 3; i++) {
      boilSeed('pebble' + i);
      const x = bx - 40 + i * 120, y = SLOPE.gy - 14, s = 26 - i * 4, pts = [];
      for (let j = 0; j < 6; j++) { const b = j / 6 * TAU, q = s * (.7 + .3 * hash(i * 9 + j)); pts.push([x + Math.cos(b) * q, y + Math.sin(b) * q]); }
      paint(pts, { wash: i % 2 ? SP.rock : SP.rockDk, ink: SP.ink, sw: 1.1 });
    }
  }

  // ---------------- D: the deeper meaning ----------------
  function stageRide(t) {
    const d = rideD(t), scroll = SPEED * d, S = { warm: ease(seg(t, RIDE - .3, RIDE + 2)), dusk: ease(seg(t, DUSK[0], DUSK[1])) };
    sky(S);
    ridge(scroll * .07, { y: 1260, h: 420, period: 460, seed: 5.3, col: spTone(SP.mtnFar, S), snow: spTone(SP.snow, S) });
    ridge(scroll * .235 + 300, { y: 1390, h: 720, period: 820, seed: 2.9, col: spTone(SP.mtn, S), snow: spTone(SP.snow, S) });
    snowGround(scroll, S, () => HERO.gy);
    // a flower blooms at every front hoof-fall (the near one at walk = n + .25, the far one half a step later), then more behind
    const blooms = [], hx = HERO.nx + 4.5 * HERO.un;
    for (let m = 0; m < 12; m++) {
      const tn = rideT((m * .5 + .25) / RATE); if (tn > t) break;
      for (let j = 0; j < 3; j++) {
        const x = hx + (m % 2 ? 34 : 0) - SPEED * (d - rideD(tn)) - j * 70 + 60 * hash(m * 3 + j), y = HERO.gy + (m % 2 ? -14 : 12) + j * 62 + 20 * hash(m * 7 + j);
        if (x > -80) blooms.push([x, y, 62 + 22 * hash(m + j * 5), (t - tn - j * .22) * 3.2, (m + j) % 2, m + '.' + j]);
      }
    }
    const n = nandiO(t), s = sheO(t), seat = nandiSeat(n.x, n.y, n.u, n);
    for (const b of blooms) if (b[1] < HERO.gy) flower(...b);
    nandi(n.x, n.y, n.u, n);
    shailputri(seat[0], seat[1], s.u, s);
    for (const b of blooms.sort((a, b) => a[1] - b[1])) if (b[1] >= HERO.gy) flower(...b);
  }
  const ARCH = archPts(139, 535, 802, 850, 16);   // niche 1 as the camera sees it when shot E opens (zoom 3.4)
  function shotD(t) {
    const riding = t >= SEATED;
    if (!riding) {
      const sh = t > STOMP && t < STOMP + .4 ? shakeXY(t, 18 * (1 - seg(t, STOMP, STOMP + .4))) : [0, 0];
      const [cx, cy, z] = kf(t, [[D0, [540, 960, 1.022]], [PALM, [540, 960, 1.022]], [TOUCH, [590, 1050, 1.12]]]);
      camBegin(cx + sh[0], cy + sh[1], z);
      stageSlope(t);
      const n = nandiO(t), s = sheO(t);
      pebbles(N_HIT()[0] + 150, 2);
      nandi(n.x, n.y, n.u, n);
      snowBurst(n.x + 20, n.y - 9 * n.u, 150, t - SHAKE - .03);
      dustPuff(n.x + 3.6 * n.u, n.y, 130, t - STOMP, SP.snow);
      birdAt(t, n);
      shailputri(s.x, s.y, s.u, s);
      // the lotus glows as she offers it
      const g = ease(seg(t, PALM + .2, TOUCH)), lh = shailputriHand(s.x, s.y, s.u, s, 1);
      if (g > 0) glow(lh[0], lh[1] - 2.3 * s.u, 90 + 190 * g + 14 * Math.sin(t * 6), '#FFD27A', .85 * g);
      camEnd();
    } else {
      camBegin(540, 960 + 49 * ease(seg(t, DUSK[0], DUSK[1])), 1);
      stageRide(t);
      camEnd();
    }
    snowfall(t, 8, 0, [400, 720]);
    caption('All that power…', 500, t - (SHAKE + .1), { life: 1.5, size: 84 });
    caption('…bows to her calm.', 500, t - BOW[0], { life: 1.35, size: 78, color: SP.marigold });
    caption('Divine strength,\ngently guiding the\nmightiest forces on earth.', 545, t - MEANING, { life: 2.7, size: 64 });
    flushLetters();
    // she mounts under a burst of light and petals (the cut to the riding pair is under full cover)
    flash(seg(t, SWIRL[0], SEATED - .06) * (1 - seg(t, SEATED + .06, SWIRL[1] + .1)), '#FFF1CF');
    petalSwirl(540, 1080, seg(t, SWIRL[0] - .1, SWIRL[1] + .35));
    if (t > ARCH_IRIS[0]) {
      const k = lerp(3.4, 1, ease(seg(t, ARCH_IRIS[0], ARCH_IRIS[1])));
      irisShape(ARCH.map(([x, y]) => [540 + (x - 540) * k, 960 + (y - 960) * k]), SP.teal);
    }
  }

  // ---------------- E: nine nights ----------------
  const cell = i => [508 + ((i - 1) % 3 - 1) * 256, 765 + Math.floor((i - 1) / 3) * 270];
  const MINI = { nx: cell(1)[0] - 23.5, gy: cell(1)[1] + 121, un: 40 / 3.4, us: 24 / 3.4 };
  function shotE(t) {
    const c1 = cell(1);
    const [cx, cy, z] = kf(t, [[E0, [c1[0], c1[1], 3.4]], [E0 + .25, [c1[0], c1[1], 3.4]], [LIGHT0, [540, 960, 1]], [TEASE, [540, 960, 1]], [TEASE + .6, [c1[0] + 40, c1[1] - 6, 2.5]]]);
    camBegin(cx, cy, z);
    boilSeed('wall'); paint(rectPts(-60, -60, W + 120, H + 120), { wash: SP.teal, ink: null });
    boilSeed('walldots'); for (let i = 0; i < 26; i++) paint(starPts(40 + hash(i * 3.1) * 1000, 430 + hash(i * 7.3) * 1100, 7, .4, 4), { wash: SP.tealLt, ink: null });
    const first = ease(seg(t, FIRST, FIRST + .3)) * (1 - ease(seg(t, TEASE - .4, TEASE)));
    for (let i = 1; i <= 9; i++) {
      const [x, y] = cell(i), lit = i === 1 ? 1 : ease(seg(t, LIGHT0 + (i - 2) * LIGHT_STEP, LIGHT0 + (i - 2) * LIGHT_STEP + .25));
      niche(i, x, y, 236, 250, lit, t);
      if (i === 1) glow(x, y, 210 + 90 * first + 12 * Math.sin(t * 5), SP.gold, .35 + .55 * first);
      else if (lit > 0) glow(x, y + 60, 150 * lit, SP.warm, .4 * lit);
      if (i > 1) { deviSil(i, x, y + 24, 262, seg(t, LIGHT0 + (i - 2) * LIGHT_STEP, LIGHT0 + (i - 2) * LIGHT_STEP + .3)); diya(x + 84, y + 121, 17, t, lit, i); }
    }
    // niche 1: the two of them, in colour
    const n = { x: MINI.nx, y: MINI.gy, u: MINI.un, seed: 1, eyes: 'happy', tail: Math.sin(t * 2) * .5, noShadow: true, nod: .03 * Math.sin(t * 1.3), swMul: 1.25 };
    const lT = ease(seg(t, Q_TRISHUL - .3, Q_TRISHUL)) * (1 - ease(seg(t, Q_LOTUS - .25, Q_LOTUS))), lL = ease(seg(t, Q_LOTUS - .3, Q_LOTUS)) * (1 - ease(seg(t, WINK - .1, WINK + .1)));
    const s = { ...sEmo(t, [[E0, 'serene'], [TEASE + .2, 'gentle'], [WINK, 'gentle', { eyes: 'wink' }]], { take: .4 }), sit: 1, seed: 2, swMul: 1.25,
      handL: mixP(HAND_L, [-4.9, -16.4], lT), trishulA: -.12 * lT + .04 * lT * Math.sin(t * 20), handR: mixP(HAND_R, [4.4, -17.2], lL), lookX: lL - lT, lookY: -.5 * Math.max(lT, lL) };
    const seat = nandiSeat(n.x, n.y, n.u, n);
    nandi(n.x, n.y, n.u, n);
    shailputri(seat[0], seat[1], MINI.us, s);
    const hl = shailputriHand(seat[0], seat[1], MINI.us, s, -1), hr = shailputriHand(seat[0], seat[1], MINI.us, s, 1);
    if (lT > 0) { glow(hl[0], hl[1] - 9 * MINI.us, 46 * lT, '#DDE8FF', lT); emote('?', hl[0] - 30, hl[1] - 9 * MINI.us, 11, seg(t, Q_TRISHUL - .1, Q_TRISHUL + .1) * lT, t - Q_TRISHUL); }
    if (lL > 0) { glow(hr[0], hr[1] - 2.3 * MINI.us, 46 * lL, '#FFC6D6', lL); emote('?', hr[0] + 34, hr[1] - 3 * MINI.us, 11, seg(t, Q_LOTUS - .1, Q_LOTUS + .1) * lL, t - Q_LOTUS); }
    camEnd();
    caption('Nine nights.\nNine forms of Maa Durga.', 525, t - LIGHT0, { life: 2.3, size: 62 });
    caption('Navratri begins with her:\nstrong, steady, grounded.', 525, t - FIRST, { life: 1.7, size: 60, color: SP.goldLt });
    caption('Why a trishul?', 480, t - (Q_TRISHUL - .2), { life: 2, size: 74 });
    caption('Why a lotus?', 575, t - (Q_LOTUS - .15), { life: 2, size: 74 });
    flushLetters();
    if (t > WIPE_EF) brushWipe((t - WIPE_EF) / .6, [SP.rkOrange, SP.peach]);
  }

  // ---------------- F: the book ----------------
  function shotF(t) {
    endCard(t, CARD);
    caption("That's another story…", 512, t - (CARD.book - .1), { life: 1.05, size: 70, color: SP.rkOrange, stroke: SP.cream });
    // a sparkle crossing the cover while the card holds
    const k = frac((t - CARD.follow) / 1.6);
    if (t > CARD.follow) { flushLetters(); boilSeed('sparkle'); paint(starPts(lerp(300, 720, k), lerp(1040, 660, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
    if (t < F0 + .3) { flushLetters(); brushWipe(.5 + (t - F0) / .6, [SP.rkOrange, SP.peach]); }
  }

  const late = f => t => f(t - HOLD);
  shots([[A0, shotHero], [C0 + HOLD, late(shotC)], [D0 + HOLD, late(shotD)], [E0 + HOLD, late(shotE)], [F0 + HOLD, late(shotF)]]);
})();
