// "2 AM Modak Run": Bal Bappa's midnight craving, Parvati's padlock, a Swarga-Mart order, and Vayu on delivery.
// 35 s, 1080×1920 (a vertical reel). Storyboard: STORYBOARD.md. Sets and props: modak_props.js. Sound: tools/sfx.mjs.
(() => {
  const R = ROOM, BAG = 92;

  // emotions() cross-fades body colours from feel(), which default to Clawd's clay: give every key the character's own
  const skinKeys = (keys, c) => keys.map(([k, n, o]) => [k, n, { ...c, ...(o || {}) }]);
  const BSKIN = { col: BAL.skin, dk: BAL.skinDk, lt: BAL.skinLt }, VSKIN = { col: VAY.skin, dk: VAY.skinDk, lt: VAY.skinLt };
  const bEmo = (t, keys, o) => emotions(t, skinKeys(keys, BSKIN), o), vEmo = (t, keys, o) => emotions(t, skinKeys(keys, VSKIN), o);

  // Where the tip of Bal Bappa's trunk is (mirrors bal_bappa.js: trunk pose, blend, sway, squash, standing lift, head turn).
  function trunkTipAt(x, y, u, o) {
    let tp = balTrunk(o.trunk);
    if (o.trunk2 && o.trunkK > 0) { const a = resample(tp, 9), b = resample(balTrunk(o.trunk2), 9); tp = a.map((p, i) => [lerp(p[0], b[i][0], o.trunkK), lerp(p[1], b[i][1], o.trunkK)]); }
    const [lx, ly] = tp[tp.length - 1], sq = (o.sq || 0) + (o.take || 0), sx = (o.flip ? -1 : 1) * (1 + sq * .6), sy = 1 - sq, HY = (o.stand || 0) > .5 ? 2.6 : 0;
    return [x + (o.dx || 0) * u + sx * ((o.hx || 0) * .5 + lx + (o.trunkSway || 0)) * u, y + (o.dy || 0) * u + sy * (ly - (o.trunkTap || 0) * .7 - HY) * u];
  }
  // extra trunk poses, in bappa()'s coordinates: dipping down-left into the bag, and curled back to the mouth
  const DIP = [[0, -11.2], [-.4, -10.2], [-1.4, -9.4], [-2.6, -8.6], [-3.4, -7.4], [-3.8, -6.2]];
  const EAT = [[0, -11.2], [.15, -10.2], [-.1, -9.3], [-.55, -8.75], [-1.15, -8.85], [-1.35, -9.5]];
  const GRAB = [[0, -11.2], [.5, -10.4], [1.6, -10], [2.8, -10.1], [3.9, -10.6], [4.9, -11.2]];   // stretched out to the lock

  // Little painted squiggles that pulse out from a point: the gurgle/rumble marks. k = strength 0..1.
  function rumbleMarks(t, x, y, rx, ry, k, key) {
    if (k <= .02) return;
    for (let i = 0; i < 3; i++) {
      boilSeed('rumble ' + key + i);
      const ph = frac(t * 2.4 + i / 3), r = 1.02 + .5 * ph, w = (1 - ph) * 2.6 * k;
      for (const s of [-1, 1]) {
        const pts = []; for (let j = 0; j <= 8; j++) { const a = (j / 8 - .5) * 1.1; pts.push([x + s * Math.cos(a) * rx * r + s * 8 * Math.sin(j * 2.4 + t * 30), y + Math.sin(a) * ry * r]); }
        inkLine(pts, w, PAL.ink, 'ink', .4);
      }
    }
  }
  // a small smoke tuft rising from (x, y), age since the puff
  function smoke(x, y, s, age, key) {
    if (age < 0 || age > 1.4) return;
    for (let i = 0; i < 3; i++) {
      boilSeed('smoke ' + key + i);
      const a = age - i * .12; if (a < 0) continue;
      const r = s * (.35 + .5 * a) * (1 - seg(a, .9, 1.3));
      if (r > 2) paint(ellPts(x + (i - 1) * s * .35 + s * .3 * a, y - s * a * 1.4, r, r * .85, 14, r * .08), { wash: '#8F8AA3', fill: '#5E5875', fillOp: 60, tex: .5, ink: PAL.ink, sw: .7 });
    }
  }

  // ======================= A · 0–4.0 · 2 AM, studying =======================
  function study(t, lt) {
    camBegin(600, 965, 1.24 + .015 * lt);
    roomBack(t);
    sleepMooshak(t, R.mooX, R.mooY, R.mooU);
    const nod = seg(t, 1.5, 2.3), droop = t < 2.42 ? easeIn(nod) : 0;
    const mood = bEmo(t, [[0, 'sleepy', { emote: null, lookY: .7 }], [2.42, 'neutral', { lookY: .7 }], [3.3, 'neutral', { lookY: 1, lookX: -.15 }]], { take: .7 });
    const gurg = spring(t, 3.35, 5, 34) * .5;
    const o = { ...mood, htilt: .2 * droop, sq: (mood.sq || 0) + .07 * droop + .08 * gurg, dy: (mood.dy || 0) + .35 * droop, aL: lerp(.42, .3, droop), aR: lerp(.4, .3, droop), trunkSway: .3 * droop, boilKey: 'bap' };
    balBappa(R.bapX, R.bapY, R.bapU, o);
    const hl = balHand(R.bapX, R.bapY, R.bapU, o, -1), hr = balHand(R.bapX, R.bapY, R.bapU, o, 1);
    palmLeaf(hl[0] + 8, hl[1] - 6, hr[0] - 8, hr[1] - 6, 46, 'held');
    roomFront(t);
    rumbleMarks(t, R.bapX, R.bapY - 4.3 * R.bapU, 3.2 * R.bapU, 2.4 * R.bapU, .5 * seg(t, 3.35, 3.45) * (1 - seg(t, 3.75, 3.95)), 'a');
    const ds = toScreen(R.diyaX + 40, R.diyaY - 50);
    camEnd();
    caption('Even the Gods get\n2 AM cravings.', 250, lt - .5, { life: 3.1, size: 76 });
    flushLetters();
    if (lt < .8) iris(ds[0], ds[1], lerp(0, 1900, easeIn(seg(lt, .04, .8))));
  }

  // ======================= B · 4.0–7.4 · the rumble =======================
  function rumble(t, lt) {
    if (t < 5.2) {   // belly close-up: the stomach quakes
      const env = seg(t, 4.0, 4.08), sh = shakeXY(t, 16 * env);
      camBegin(540 - sh[0], 960 - sh[1], 1);
      boilSeed('close wall');
      paint(rectPts(-100, -100, W + 200, H + 200), { wash: MK.wall, ink: null });
      paint(rectPts(-100, -100, W + 200, 520, 20), { fill: MK.wallDk, fillOp: 110, bleed: .2, tex: .6, ink: null });
      glow(-60, 1250, 900, MK.warm, .8);
      const u = 110, x = 540, y = 1490;
      const mood = bEmo(t, [[3.9, 'neutral', { lookY: 1 }], [4.32, 'surprised', { lookY: .9, emote: null }]], { take: .8 });
      const quake = Math.sin(t * TAU * 11) * env;
      balBappa(x, y, u, { ...mood, sq: (mood.sq || 0) + .045 * quake, dx: .06 * Math.sin(t * TAU * 13) * env, aL: .42, aR: .4, ear: .25 * env + .15 * Math.abs(quake), boilKey: 'bapclose' });
      boilSeed('close desk');
      paint(rectPts(-100, 1600, W + 200, 60, 3), { wash: MK.woodLt, fill: MK.wood, fillOp: 60, tex: .5, ink: MK.ink, sw: 1.6 });
      paint(rectPts(-100, 1660, W + 200, 400, 3), { wash: MK.wood, fill: MK.woodDk, fillOp: 80, tex: .6, ink: MK.ink, sw: 1.6 });
      rumbleMarks(t, x, y - 4.3 * u, 3.1 * u, 2.3 * u, env, 'b');
      camEnd();
      return;
    }
    // wide: the whole room shakes, the lota falls, Mooshak bolts awake; then Bappa's reaction and a push in
    const env = 1 - seg(t, 5.25, 6.1), sh = shakeXY(t, 20 * env);
    const push_ = ease(seg(t, 6.0, 7.1)), whip = easeIn(seg(t, 7.12, 7.4));
    camBegin(lerp(600, 660, push_) + whip * 1100 - sh[0], lerp(965, 1000, push_) - sh[1], lerp(1.26, 1.6, push_));
    roomBack(t, { lotaT: 5.3, shake: 6 * env });
    // Mooshak: asleep → jolted awake ("!!") → looks at Bappa → then where Bappa looks
    const hop = jump(t, 5.45, 5.85, 3.2);
    const mo = t < 5.4 ? { eyes: 'closed', emote: 'zzz', emoteK: 1 } : t < 6.1 ? { eyes: 'wide', mouth: 'O', emote: '!!', emoteK: seg(t, 5.45, 5.6), emoteAge: t - 5.45 }
      : t < 6.75 ? { eyes: 'look', lookX: .8, emote: '?', emoteK: seg(t, 6.1, 6.25), emoteAge: t - 6.1 } : { eyes: 'narrow', lookX: 1, mouth: 'smirk' };
    mooshak(R.mooX, R.mooY, R.mooU, { ...mo, dy: hop.dy, sq: hop.sq + (t < 5.4 ? .1 : 0), boilKey: 'moo' });
    const mood = bEmo(t, [[4.32, 'surprised', { lookY: .6, emote: null }], [6.05, 'shy'], [6.75, 'mischief', { lookX: 1, hx: .45 }]], { take: .8 });
    const quake = Math.sin(t * TAU * 11) * env;
    const o = { ...mood, sq: (mood.sq || 0) + .04 * quake, ear: t < 6.05 ? .3 * env : 0, boilKey: 'bap' };
    if (t < 6.05) { o.aL = 1.1; o.aR = 1.05; }
    balBappa(R.bapX, R.bapY, R.bapU, o);
    roomFront(t, { shake: 5 * env, leafJump: env * Math.max(0, Math.sin(t * TAU * 5)), gutter: env });
    palmLeaf(560, 1188 - 20 * env * Math.max(0, Math.sin(t * TAU * 6 + 1)), 790, 1184, 40, 'dropped');
    rumbleMarks(t, R.bapX, R.bapY - 4.3 * R.bapU, 3.2 * R.bapU, 2.4 * R.bapU, env * .8, 'bw');
    camEnd();
    whipSmear(seg(t, 7.12, 7.4), 1);
  }

  // ======================= C · 7.4–11.4 · tiptoe to the kitchen =======================
  const STEP = BEAT, WALK0 = 7.55, FLOAT0 = 9.55, FLOAT1 = 10.3;
  function sneakX(t) {   // tiptoe steps (one per beat, each eased), then drifting on the smell
    if (t < WALK0) return 520;
    const n = (Math.min(t, FLOAT0) - WALK0) / STEP, i = Math.floor(n), f = n - i, x = 520 + (i + ease(f)) * 300;
    if (t < FLOAT0) return x;
    const x9 = 520 + ((FLOAT0 - WALK0) / STEP) * 300;
    return lerp(x9, 2170, ease(seg(t, FLOAT0, FLOAT1)));
  }
  function tiptoe(t, lt, dur) {
    const push_ = ease(seg(t, 11.0, 11.4));
    const cx = kf(t, [[7.4, 620], [9.6, 1580], [10.5, 2330], [11.0, 2380]], ease);
    camBegin(lerp(cx, 2470, push_), lerp(1060, 1040, push_), lerp(1.15, 1.5, push_));
    const gust = 0; corridor(t, { gust });
    padlock(HALL.doorX + HALL.doorW / 2, HALL.lockY, 170, { key: 'hall' });
    const u = 30, fy = HALL.floorY, x = sneakX(t);
    const n = (Math.min(t, FLOAT0) - WALK0) / STEP, f = frac(Math.max(0, n)), walking = t > WALK0 && t < FLOAT0;
    const fl = seg(t, FLOAT0 - .1, FLOAT0 + .3) * (1 - seg(t, FLOAT1 - .15, FLOAT1 + .05));
    const mood = bEmo(t, [[7.4, 'mischief', { lookX: .8, hx: .4 }], [9.35, 'love', { lookX: 1 }], [10.55, 'surprised', { lookX: 1, lookY: -.4 }]], { take: .9 });
    const o = { ...mood, stand: 1, walk: walking ? Math.max(0, n) * .5 : undefined, boilKey: 'bap' };
    o.dy = (mood.dy || 0) - (walking ? 1.3 * Math.sin(f * Math.PI) : 0) - 1.6 * fl + .25 * Math.sin(t * TAU * .8) * fl;
    o.sq = (mood.sq || 0) + (walking ? .07 * Math.cos(f * TAU) : 0);
    o.rot = walking ? .05 * Math.sin(f * Math.PI) : .04 * fl;
    if (t < 9.35) { o.aL = .75 + .08 * Math.sin(t * TAU * .9); o.aR = .55 + .1 * Math.sin(t * TAU * .9 + 1.4); o.hx = .4 * Math.sin(t * 1.9); o.lookX = Math.sin(t * 1.9) > 0 ? .9 : -.6; }
    o.trunk2 = 'hold'; o.trunkK = ease(seg(t, 9.15, 9.55)) * (1 - ease(seg(t, 10.5, 10.75)));
    // Mooshak copies him a few steps behind (offset in time, so they never step together)
    const tm = t - .28, xm = sneakX(tm) - 200, nm = (Math.min(tm, FLOAT0) - WALK0) / STEP, fm = frac(Math.max(0, nm)), wm = tm > WALK0 && tm < FLOAT0;
    mooshak(xm, fy, 15, { eyes: t < 9.4 ? 'narrow' : t < 10.6 ? 'heart' : 'wide', mouth: t < 9.4 ? 'smirk' : t < 10.6 ? 'cat' : 'O', lookX: 1, dy: -(wm ? 1.4 * Math.sin(fm * Math.PI) : 0) - 1.2 * seg(tm, FLOAT0, FLOAT0 + .3) * (1 - seg(tm, FLOAT1 - .1, FLOAT1 + .1)), sq: wm ? .06 * Math.cos(fm * TAU) : 0, boilKey: 'moo' });
    balBappa(x, fy, u, o);
    const tip = trunkTipAt(x, fy, u, o);
    smellWisps(t, seg(t, 8.8, 9.6), tip[0] + 20, tip[1]);
    camEnd();
    whipSmear(1 - seg(t, 7.4, 7.62), 1);
  }

  // ======================= D · 11.4–16.2 · the padlock =======================
  const ZAP = 13.0, LAND = 13.42;
  function lockShot(t, lt) {
    const shk = shakeXY(t, 24 * Math.exp(-(t - ZAP) * 5) * (t > ZAP ? 1 : 0));
    const toPhone = easeIn(seg(t, 15.85, 16.2));
    const u = 30, fy = HALL.floorY, lx = HALL.doorX + HALL.doorW / 2, ly = HALL.lockY;
    const zoom = 1.5 + .05 * seg(t, 11.4, 15.8) + 1.4 * toPhone;
    // the pose first (the camera ends on his phone)
    const fly = seg(t, ZAP + .02, LAND), x = t < ZAP ? 2428 : lerp(2428, 2330, easeOut(fly));
    const mood = bEmo(t, [[11.4, 'determined', { lookY: -.8, lookX: .4 }], [12.45, 'scared', { lookY: -1, lookX: .35, emote: null }], [ZAP, 'ko'], [13.8, 'sad', { lookY: .3 }], [15.35, 'idea']], { take: .9 });
    const o = { ...mood, boilKey: 'bap' };
    if (t < ZAP) {
      const tug = Math.sin(seg(t, 11.5, 12.4) * Math.PI * 3), frz = seg(t, 12.45, 12.55);
      // he hangs off the lock by one hand and his trunk, feet kicking, heaving on it
      const hang = ease(seg(t, 11.4, 11.6)), kick = t < 12.45 ? t * 3.2 : undefined;
      Object.assign(o, { stand: 1, walk: kick, aL: 1.3 + .1 * tug, aR: .9, trunk: GRAB, dy: -2.4 * hang + .25 * Math.abs(tug) * (1 - frz), rot: -.1 * Math.abs(tug) * (1 - frz), sq: (mood.sq || 0) - .06 * Math.abs(tug) });
    } else if (t < LAND) {
      Object.assign(o, { stand: t < ZAP + .18 ? 1 : 0, dy: lerp(-2.4, 0, fly) - 3.2 * Math.sin(fly * Math.PI), dx: -3 * Math.sin(fly * Math.PI), rot: -.6 * Math.sin(fly * Math.PI), sq: -.12, ear: 1.1, aL: 1.3, aR: 1.3, trunk: 'up' });
    } else {
      const a = t - LAND;
      o.stand = 0; o.sq = (mood.sq || 0) + .25 * Math.exp(-a * 7) * Math.cos(a * 20); o.rot = t < 13.8 ? .08 : o.rot;
      o.ear = 1 * Math.exp(-a * 2.5) + .12 * Math.sin(a * 16) * Math.exp(-a * 3);
      if (t > 13.8 && t < 15.35) { o.trunk = 'down'; o.aL = -1; o.aR = -1; }
      if (t >= 15.35) { o.aR = 1.45; o.aL = .3; }
    }
    const pk = backOut(seg(t, 15.55, 15.8)), phoneW = 64;
    if (t >= 15.55) o.armR = (uu, sw) => { push(); translate(uu * .3, -uu * 1.6); rotate(.15); scale(pk); phone(0, 0, phoneW, 'splash', { pop: 1, glowK: .6 + toPhone }); pop(); };
    const hand = balHand(x, fy, u, o, 1), pc = [hand[0] + u * .3, hand[1] - u * 1.6];
    const cx = lerp(2470, pc[0], toPhone), cy = lerp(1040, pc[1], toPhone);
    camBegin(cx - shk[0], cy - shk[1], zoom);
    corridor(t, {});
    const eye = t < 12.45 ? 0 : t < 14.3 ? backOut(seg(t, 12.45, 12.7)) : 1 - ease(seg(t, 14.3, 14.7));
    padlock(lx, ly, 170, { key: 'hall', eye, lookX: t > LAND ? -.8 : -.2, narrow: seg(t, 13.25, 13.5), glare: eye * (t < 13.6 ? .9 : .4), rattle: t < 12.45 && t > 11.5 ? 7 : 0 });
    balBappa(x, fy, u, o);
    smoke(x + 10, fy - 17 * u, u * 1.2, t - LAND, 'turban');
    // Mooshak scurries in to comfort him
    const mx = lerp(2120, 2215, ease(seg(t, 13.95, 14.35))), pat = t > 14.4 ? Math.abs(Math.sin((t - 14.4) * TAU * 1.6)) : 0;
    if (t > 13.9) mooshak(mx, fy, 14, { eyes: t < 15.35 ? 'sad' : 'wide', mouth: t < 15.35 ? 'frown' : 'O', lookX: 1, dy: -(t < 14.35 ? 1.2 * Math.abs(Math.sin(t * TAU * 4)) : .5 * pat), rot: .1 * pat, boilKey: 'moo' });
    if (t > ZAP && t < ZAP + .28) {
      const k = 1 - seg(t, ZAP + .12, ZAP + .28);
      zapBolt(lx, ly, 2420, fy - 13 * u, k * 1.2, 'a'); zapBolt(lx + 20, ly + 40, 2480, fy - 8 * u, k, 'b');
    }
    camEnd();
    if (t >= ZAP) flash(1 - seg(t, ZAP, ZAP + .12), MK.violetLt);
    flash(seg(t, 16.02, 16.2), '#FFF1CF');   // the phone's glow fills the frame: match cut to its screen
  }

  // ======================= E · 16.2–19.8 · Swarga-Mart =======================
  const TAPS = Array.from({ length: 20 }, (_, k) => 17.62 + .9 * Math.pow(k / 19, .62));
  const TAP_ORDER = 19.45;
  function order(t, lt) {
    boilSeed('order bg');
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#262A58', ink: null });
    glow(300, 1500, 900, MK.warm, .45); glow(900, 300, 500, MK.violet, .35);
    const bob = 8 * wob(t, .45), cx = 540, cy = 930 + bob, w = 700, h = w * 2.02, sy = cy - h * .44, sH = h * .88;
    const plus = [cx + w * .27, sy + sH * .66], btn = [cx, sy + sH * .83];
    // taps: how many have landed, and how recently
    let n = 0, last = -9; for (const tk of TAPS) if (t >= tk) { n++; last = tk; }
    const press = Math.exp(-(t - last) * 22), count = Math.min(21, 1 + n);
    const screen = t < 17.25 ? 'splash' : 'order';
    phone(cx, cy, w, screen, { pop: seg(t, 16.25, 16.75), count, countPop: t - last, plusK: press * (t < 18.6 ? 1 : 0), btnK: seg(t, TAP_ORDER, TAP_ORDER + .06), bolt: seg(t, TAP_ORDER + .05, TAP_ORDER + .3), glowK: .3 });
    if (t > 17.2 && t < 17.3) flash(1 - seg(t, 17.2, 17.3), MK.screen);
    // the trunk tip: in, tap-tap-tap on +, up in triumph, over to the order key, a hover, TAP
    const hover = [plus[0] + 30, plus[1] - 70], up = [plus[0] + 90, plus[1] - 230], bh = [btn[0] + 40, btn[1] - 80];
    let tx, ty, pr = 0;
    if (t < 17.62) { const k = ease(seg(t, 17.2, 17.58)); tx = lerp(1250, hover[0], k); ty = lerp(2200, hover[1], k); }
    else if (t < 18.58) { tx = lerp(hover[0], plus[0], .9) + 4 * Math.sin(t * 40); ty = lerp(hover[1], plus[1], press); pr = press; }
    else if (t < 18.95) { const k = backOut(seg(t, 18.58, 18.85)); tx = lerp(plus[0], up[0], k); ty = lerp(plus[1], up[1], k) + 20 * Math.sin((t - 18.58) * 20) * Math.exp(-(t - 18.58) * 6); }
    else if (t < TAP_ORDER - .08) { const k = ease(seg(t, 18.95, 19.25)); tx = lerp(up[0], bh[0], k) + (t > 19.25 ? 8 * Math.sin(t * 30) : 0); ty = lerp(up[1], bh[1], k); }
    else { const a = t - (TAP_ORDER - .08), k = a < .08 ? easeIn(a / .08) : Math.exp(-(a - .08) * 10); tx = bh[0] - 30 * Math.min(1, a / .08); ty = lerp(bh[1], btn[1], k); pr = k; }
    trunkTip(1300, 2250, tx, ty, 62, pr);
    flash(seg(t, 19.66, 19.8), '#FFF6E0');
  }

  // ======================= F · 19.8–23.6 · the meteor run =======================
  const ROLL0 = 20.68, ROLL1 = 21.12, DUCK = 21.62, DIVE = 22.85;
  function meteorRun(t, lt) {
    const scroll = lt * 1500 + 600 * seg(t, DIVE, 23.6);
    cosmos(t, { scroll });
    // far meteors, small and quick
    for (let i = 0; i < 5; i++) {
      const p = frac((t - 19.8) * .55 + hash(i * 4.4)), x = lerp(1250, -200, p) + hash(i) * 300, y = lerp(-100, 1500, p) + hash(i * 3) * 400;
      meteor(x, y, 14 + 10 * hash(i * 7), 2.3, 'far' + i, .8);
    }
    // Kailash rises up out of the bottom of the frame at the end
    const rise = ease(seg(t, 22.1, 23.1)), kx = 600, ky = H + 700 - 1150 * rise, ks = 820;
    if (rise > 0) { boilSeed('run ground'); paint(rectPts(-100, ky - 4, W + 200, 2000), { wash: MK.rock, fill: MK.wallDk, fillOp: 60, tex: .5, ink: null }); }
    if (rise > 0) kailash(kx, ky, ks, { key: 'run', window: 1 + 1.5 * seg(t, 23.3, 23.5), sw: 1.4 });
    const win = [kx + .4 * ks, ky - .58 * ks];
    // Vayu's path: in from the top left, a loop-the-loop past the big meteor, a duck, then the dive into the window
    const inK = easeOut(seg(t, 19.85, 20.45)), home = [520, 820];
    let vx = lerp(-250, home[0], inK), vy = lerp(-300, home[1], inK), rot = .55, u = 34, spin = 0, sq = 0;
    vx += 25 * wob(t, .7); vy += 20 * wob(t, .9, .3);
    if (t > ROLL0 && t < ROLL1 + .3) {
      const k = seg(t, ROLL0, ROLL1); spin = TAU * ease(k); const [ax, ay] = arcPt([0, 0], [0, 0], -220, k);
      vx += ax - 120 * Math.sin(k * Math.PI); vy += ay; sq = -.1 * Math.sin(k * Math.PI) + .12 * spring(t, ROLL1, 8, 20);
    }
    const duck = Math.sin(seg(t, DUCK - .08, DUCK + .3) * Math.PI);
    sq += .24 * duck; vy += 90 * duck; vx -= 30 * duck;
    const dv = ease(seg(t, DIVE, 23.45));
    if (dv > 0) { vx = lerp(vx, win[0], dv); vy = lerp(vy, win[1], dv); u = lerp(34, 2, easeIn(dv)); rot = lerp(.55, 1.1, dv); }
    // the big meteor, straight at him, and the one he ducks
    const m1 = seg(t, 20.2, 21.35), m2 = seg(t, 21.2, 22.0);
    if (m1 > 0 && m1 < 1) meteor(lerp(1400, -400, m1), lerp(1900, -150, m1), 105, -2.3 + Math.PI, 'big', 1.1);
    const vay = vEmo(t, [[19.8, 'cool', { shades: 1 }], [ROLL0 - .05, 'excited', { shades: 1, emote: null }], [ROLL1 + .15, 'cool', { shades: 1 }], [DUCK - .1, 'surprised', { shades: 1, emote: null }], [DUCK + .35, 'smug', { shades: 1 }]], { take: .6 });
    if (dv > .02) inkLine([[vx, vy], [lerp(home[0], vx, .2), lerp(home[1], vy, .2)]], 3 * (1 - dv) + 1, VAY.cloud, 'dry', 0);   // the streak behind him
    push(); translate(vx, vy); rotate(rot + spin);
    vayu(0, 0, u, { ...vay, shades: 1, speed: 1, aL: -2.5, aR: -2.3, sq: (vay.sq || 0) + sq, rot: 0, glowK: .6, crownTilt: 0, boilKey: 'vayu' });
    pop();
    if (m2 > 0 && m2 < 1) meteor(lerp(1350, -350, m2), lerp(430, 520, m2), 62, Math.PI - .06, 'duck', 1);
    if (dv > .9) glow(win[0], win[1], 260 * seg(t, 23.35, 23.55), '#DDF0FF', 1);
    flash(1 - seg(t, 19.8, 20.02), '#FFF6E0');
    flash(seg(t, 23.46, 23.6), '#EAF4FF');
  }

  // ======================= G+H · 23.6–31.0 · the delivery, the bite, five stars =======================
  const HAND = 25.9, OPEN = 26.35, DIPT = 27.2, BITE1 = 27.98, BITE2 = 28.2, RATE = 28.4, SALUTE = 29.95, EXIT = 30.3;
  const STAR_T = [28.86, 28.98, 29.1, 29.22, 29.34];
  function delivery(t, lt) {
    const u = 30, fy = HALL.floorY, bx = 2330, gust = 1 - seg(t, 23.7, 24.7);
    const push_ = ease(seg(t, 26.4, 29.0));
    camBegin(lerp(2190, 2240, push_), lerp(1170, 1190, push_), lerp(1.45, 1.6, push_));
    corridor(t, { gust: t < 24.8 ? gust : 0, winFlare: 1 - seg(t, 23.6, 24.0) });
    padlock(HALL.doorX + HALL.doorW / 2, HALL.lockY, 170, { key: 'hall' });
    // Bappa
    const mood = bEmo(t, [[23.6, 'surprised', { lookX: -1, emote: null }], [25.35, 'starstruck', { lookX: -.6 }], [26.45, 'love', { lookX: -.4, lookY: .5 }],
      [27.25, 'hopeful', { lookX: -.6, lookY: .6 }], [28.25, 'love', { emote: 'hearts' }], [28.75, 'happy'], [SALUTE + .1, 'happy', { lookX: -1 }]], { take: .7 });
    const o = { ...mood, boilKey: 'bap' };
    o.rot = (o.rot || 0) + .12 * gust * (t < 24.8 ? 1 : 0); o.ear = (t < 24.8 ? 1.1 * gust : 0) + (t > BITE2 && t < 28.9 ? .5 * Math.abs(Math.sin((t - BITE2) * 12)) : 0);
    if (t < 25.35) { o.aL = .1; o.aR = .1; }
    if (t > 25.45 && t < 26.3) { o.aL = .6; o.aR = .15; }
    if (t >= 26.3 && t < 27.25) { o.aL = lerp(.6, .1, ease(seg(t, 26.3, 26.5))); o.aR = .1; }
    if (t >= 27.25 && t < SALUTE) { o.aL = .1; o.aR = .1; }
    if (t >= SALUTE) { o.aL = 1.0 + .25 * Math.sin((t - SALUTE) * TAU * 2.2); o.aR = .1; }
    if (t >= HAND && t < 26.42) o.armL = (uu) => paperBag(0, BAG * 1.3, BAG, { key: 'bag' });
    // the trunk: dips into the bag, comes back curled to the mouth with a modak
    const dip = ease(seg(t, DIPT, DIPT + .3)), lift = ease(seg(t, DIPT + .38, DIPT + .7));
    if (t > DIPT && t < 28.6) { o.trunk = lift > 0 ? DIP : undefined; o.trunk2 = lift > 0 ? EAT : DIP; o.trunkK = lift > 0 ? lift : dip; }
    if (t >= 28.6) { o.trunk2 = EAT; o.trunkK = 1 - ease(seg(t, 28.6, 28.9)); o.trunk = undefined; }
    balBappa(bx, fy, u, o);
    // the bag on the floor, open
    if (t >= 26.42) paperBag(2190, fy + 2, BAG, { key: 'bag', open: ease(seg(t, OPEN + .05, OPEN + .4)), rot: -.04 });
    if (t > DIPT + .38 && t < 28.36) {
      const tip = trunkTipAt(bx, fy, u, o), bite = t < BITE1 ? 0 : t < BITE2 ? .45 : 1;
      mkModak(tip[0] - 4, tip[1] + 30, 52, bite, 'eaten');
    }
    // Mooshak: blown flat by the gust, gets up, gazes at the bag
    const mo = t < 24.6 ? { flat: gust, eyes: 'squeeze' } : t < OPEN + .3 ? { eyes: 'wide', lookX: -1 } : { eyes: 'heart', mouth: 'cat', lookX: -1 };
    mooshak(2545, fy, 14, { ...mo, dy: t > 24.6 && t < 24.9 ? -1.5 * Math.sin(seg(t, 24.6, 24.9) * Math.PI) : 0, boilKey: 'moo' });
    // Vayu: in through the window on the gust, shades up, hands it over; waits on the rating; salutes; gone
    const arrive = seg(t, 23.6, 23.88), win = [2060, 830], hov = [2032, 1352];
    let vx = lerp(win[0], hov[0], easeOut(arrive)), vy = lerp(win[1], hov[1], easeOut(arrive)) + 14 * Math.sin(t * TAU * .8) + 40 * spring(t, 23.88, 5, 12);
    const ex = seg(t, EXIT, EXIT + .35);
    if (ex > 0) { const p = arcPt(hov, [2060, 520], 120, easeIn(ex)); vx = p[0]; vy = p[1]; }
    const vm = vEmo(t, [[23.6, 'cool', { shades: 1, emote: null }], [24.55, 'happy'], [25.1, 'neutral', { lookX: .8 }], [26.5, 'happy'], [RATE + .1, 'hopeful', { lookX: .6, lookY: .5 }],
      [29.4, 'proud', { emote: 'spark', tintK: 0 }], [SALUTE, 'happy', { emote: null }], [EXIT - .05, 'cool', { shades: 1, emote: null }]], { take: .6 });
    const shades = t < 24.5 ? 1 : t < EXIT - .1 ? 1 - ease(seg(t, 24.5, 24.85)) : 1;
    const vo = { ...vm, shades, speed: t < 23.95 ? 1 : ex > 0 ? 1 : 0, boilKey: 'vayu', glowK: arrive < 1 || ex > 0 ? .5 : 0 };
    vo.aL = t > 24.35 && t < 24.95 ? 1.9 : t > SALUTE && t < EXIT ? 1.75 : -1.1;
    vo.aR = t > 24.8 && t < HAND ? .05 : -1.05;
    if (t < HAND) vo.armR = (uu) => paperBag(0, BAG * 1.3, BAG, { key: 'bag' });
    const vu = lerp(26, 10, easeIn(ex));
    if (t > 29.4 && t < SALUTE + .5) glow(vx, vy - 5 * vu, 9 * vu, '#FFD86A', seg(t, 29.4, 29.6) * (1 - seg(t, SALUTE + .2, SALUTE + .5)));   // pride, as light
    if (ex < 1) vayu(vx, vy, vu, { ...vo, rot: arrive < 1 ? .5 * (1 - arrive) : ex > 0 ? -.6 * ex : (vo.rot || 0) * .5 });
    if (ex > 0 && ex < 1) inkLine([[vx, vy], [lerp(hov[0], vx, .3), lerp(hov[1], vy, .3)]], 4 * (1 - ex), VAY.cloud, 'dry', 0);
    camEnd();
    // the rating: the phone rises into the foreground, the trunk taps five stars, it drops away
    const ph = ease(seg(t, RATE, RATE + .3)) * (1 - easeIn(seg(t, 29.72, 29.98)));
    if (ph > 0) {
      const pw = 560, pcx = 560, pcy = lerp(2600, 1060, ph), sy = pcy - pw * 2.02 * .44, sH = pw * 2.02 * .88;
      let n = 0, last = -9; for (const s of STAR_T) if (t >= s) { n++; last = s; }
      phone(pcx, pcy, pw, 'stars', { stars: n > 0 ? n - 1 + clamp((t - last) * 6) : 0, glowK: .4 });
      const k = Math.min(4, n), sx_ = pcx + (k - 2) * pw * .16, syy = sy + sH * .6, pr = Math.exp(-(t - last) * 18);
      const tt = t < STAR_T[0] ? ease(seg(t, RATE + .15, STAR_T[0])) : 1;
      trunkTip(1250, 2350, lerp(1150, sx_ + 10, tt), lerp(2100, syy - 60 + 60 * pr, tt), 44, pr);
    }
    windSwirl((t - 30.45) / 1.1);
  }

  // ======================= I · 31.0–35.0 · after; and the lock knows =======================
  const BURP = 31.95;
  function after(t, lt) {
    if (t < 32.72) {
      const whip = easeIn(seg(t, 32.45, 32.72)), bsh = shakeXY(t, 10 * Math.exp(-(t - BURP) * 6) * (t > BURP ? 1 : 0));
      camBegin(600 + whip * 1100 - bsh[0], 965 - bsh[1], 1.26 + .02 * seg(t, 31, 32.5));
      roomBack(t, {});
      // Mooshak on his cushion, hugging modak no. 21
      mooshak(R.mooX, R.mooY, R.mooU, { eyes: t > BURP && t < 32.3 ? 'wide' : 'happy', mouth: 'cat', sq: .05 + .03 * Math.sin(t * 5), boilKey: 'moo' });
      mkModak(R.mooX, R.mooY - 4, 62, .35, 'moo21');
      const mood = bEmo(t, [[31.0, 'happy', { blush: .5 }], [BURP, 'surprised', { emote: null, mouth: 'O' }], [32.25, 'shy']], { take: .6 });
      balBappa(R.bapX, R.bapY, R.bapU, { ...mood, sq: (mood.sq || 0) + .1 + .03 * Math.sin(t * TAU * .5), aL: t < BURP ? -.2 : mood.aL, aR: t < BURP ? .1 : mood.aR, boilKey: 'bap' });
      roomFront(t, { gutter: t > BURP ? Math.exp(-(t - BURP) * 4) : 0 });
      paperBag(860, 1198, 70, { key: 'empty', rot: 1.35 });   // the empty bag, tipped over on the desk
      // the burp: a little puff from the mouth
      const pa = t - BURP;
      if (pa > 0 && pa < 1) {
        boilSeed('burp');
        const r = 26 + 40 * easeOut(pa / .6);
        paint(ellPts(R.bapX - 60 - 30 * pa, R.bapY - 250 - 90 * pa, r * (1 - seg(pa, .7, 1)), r * .75 * (1 - seg(pa, .7, 1)), 14, 2), { wash: PAL.cream, washOp: 230, ink: PAL.ink, sw: .8 });
      }
      rumbleMarks(t, R.bapX, R.bapY - 4.3 * R.bapU, 3.3 * R.bapU, 2.5 * R.bapU, .6 * (t > BURP ? Math.exp(-(t - BURP) * 3) : 0), 'burp');
      camEnd();
      windSwirl((t - 30.45) / 1.1);
      whipSmear(seg(t, 32.45, 32.72), 1);
      return;
    }
    // the kitchen door, close: the padlock's eye opens, looks toward his room, narrows. An eye-shaped iris shuts on it.
    const z = 1 + .05 * seg(t, 32.72, 35), lx = 540, ly = 980, s = 560;
    camBegin(540, 960, z);
    boilSeed('sting door');
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: MK.wood, fill: MK.woodDk, fillOp: 90, bleed: .08, tex: .7, border: .5, ink: null });
    glow(540, 2000, 900, MK.warm, .5);
    for (const [px, py] of [[90, 120], [620, 120], [90, 1300], [620, 1300]]) paint(rectPts(px, py, 370, 520, 3), { wash: MK.woodLt, fill: MK.wood, fillOp: 60, tex: .5, ink: MK.ink, sw: 1.4 });
    inkLine([[540, -60], [540, 700]], 2, MK.ink, 'ink', 0); inkLine([[540, 1250], [540, 2000]], 2, MK.ink, 'ink', 0);
    for (const sd of [-1, 1]) {
      paint(ellPts(lx + sd * 110, ly - 500, 40, 40, 14), { wash: MK.brassDk, ink: MK.ink, sw: 1.4 });
      paint(ribbon(ellPts(lx + sd * 110, ly - 380, 80, 110, 18), 22, 22), { wash: MK.brass, ink: MK.ink, sw: 1.2 });
    }
    const eye = ease(seg(t, 33.05, 33.6)), look = ease(seg(t, 33.65, 33.95)), nar = ease(seg(t, 33.95, 34.2));
    padlock(lx, ly, s, { key: 'sting', eye, lookX: -look, narrow: nar, glare: .25 + .5 * nar });
    camEnd();
    whipSmear(1 - seg(t, 32.72, 32.95), 1, [MK.wood, MK.woodLt, MK.woodDk]);
    const p = seg(t, 34.25, 34.8), eh = .56 * s * z;
    if (t > 34.25) eyeIris(lx, 960 + (ly - 960) * z - .02 * s * z, lerp(4200, eh * 1.25, easeOut(p)), 1 - seg(t, 34.78, 34.92));
  }

  shots([[0, study], [4.0, rumble], [7.4, tiptoe], [11.4, lockShot], [16.2, order], [19.8, meteorRun], [23.6, delivery], [31.0, after]]);
})();
