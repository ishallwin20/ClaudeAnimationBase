// tortoise.js: "This Is Why You Don't Need To Reply To Everyone" (format test: a wordless moral story, Painted, ~31 s).
// Panchatantra, Book 1: the tortoise Kambugriva and the swans Sankata and Vikata. A drought; the swans will leave for a
// far lake; the tortoise proposes the plan (he bites the middle of a stick, they carry the ends); they warn him not to
// open his mouth; over a town the people say it looks like a cart wheel; he opens his mouth to answer and falls.
// The format: a black 9:16 frame, a two-line headline (one word yellow), the story in a band in the middle, no words in
// the story: only acting and thought bubbles with pencil doodles. STORYBOARD.md has the plan and the sources;
// the cast, the bubbles and the frame are in src/fable.js (the Fable style, FABLE_GUIDE.md). All times are video time; tools/tortoise_sfx.mjs uses the same ones.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/tortoise_sfx.mjs)
  const DRY0 = .6, DRY1 = 1.6, SIGH = 1.75, LANDB = 1.95, LANDA = 2.3;
  const LAKE0 = 2.9, LAKE1 = 4.6, NODB = [3.7, 4.05], WING0 = 4.8, WING1 = 6.2, IDEA = 6.3, PLAN0 = 6.6, PLAN1 = 8.3, AGREE = 7.9;
  const ZIP0 = 8.5, ZIP1 = 9.9, NODT = 9.45, DIP = 10.0, CHOMP = 10.3, UPS = 10.45, SWOOP0 = 11.0, GRAB = 11.5, LIFT = 11.75, B0 = 12.4;
  const KIDS = 14.4, POINT = 15.0, WHEEL0 = 15.6, WHEEL1 = 17.6, FROWN = 17.7, LEGS0 = 18.8, LEGS1 = 20.6, PUFF = 20.7;
  const WARN0 = 21.7, WARN1 = 23.3, ROLL = 23.4, SNAP = 24.6, DROP = 24.72, POPB = 25.45, LOOKD = 25.4, THUD = 26.5;
  const LAST0 = 26.9, LAST1 = 28.4, GO = 28.5, END = PROJECT.duration;
  const BAND = [600, 1380];

  const pop = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const blinkAt = (t, ts, d = .12) => ts.some(b => t > b && t < b + d);

  // ---- the frame: black bars and the headline (the reel's only words), from src/fable.js
  const HEADLINE = ['This Is Why You Don\u2019t Need', 'To *Reply* To Everyone'];
  const frame = (fade = 0) => fableFrame(HEADLINE, fade);
  const life = fableLife;

  // ---- sets
  const SKY = '#EADCC0', SKYLT = '#F4EBDA', HAZE = '#DCCBA8';
  function sky(key, drift = 0) {
    boilSeed(key + 'sky');
    paint(rectPts(-200, BAND[0] - 300, W + 400, 1200), { wash: SKY, ink: null });
    paint(rectPts(-200, 950, W + 400, 300), { fill: SKYLT, fillOp: 160, bleed: .25, tex: .2, border: .2, ink: null });
    for (let i = 0; i < 6; i++) {   // soft clouds, drifting left
      const span = W + 700, x = ((hash(i * 7.3) * span - drift * (.6 + hash(i) * .5)) % span + span) % span - 350, y = 650 + hash(i * 3.1) * 420;
      boilSeed(key + 'cloud' + i);
      paint(ellPts(x, y, 120 + 90 * hash(i * 1.7), 26 + 14 * hash(i * 2.9), 18, 4), { fill: SKYLT, fillOp: 190, bleed: .2, tex: .3, border: .3, ink: null });
    }
  }
  const GROUND = '#CDAA76', MUD = '#BF9963', CRACK = '#8E6C43';
  function pond(t) {
    sky('pond', t * 8);
    boilSeed('hills'); paint([[-200, 1080], [150, 1030], [420, 1060], [700, 1020], [1000, 1055], [1300, 1040], [1300, 1120], [-200, 1120]], { fill: HAZE, fillOp: 200, bleed: .1, tex: .3, ink: null, curv: .5 });
    boilSeed('ground'); paint(rectPts(-200, 1065, W + 400, 500), { wash: GROUND, ink: null });
    paint(rectPts(-200, 1065, W + 400, 40), { fill: '#BE9B68', fillOp: 120, bleed: .15, tex: .4, ink: null });
    boilSeed('bed'); paint(ellPts(560, 1300, 520, 105, 30, 3), { wash: MUD, fill: '#AE8754', fillOp: 70, tex: .6, ink: null });
    boilSeed('cracks');
    for (let i = 0; i < 16; i++) {   // the cracked pond bed
      const x0 = 120 + hash(i * 2.3) * 880, y0 = 1225 + hash(i * 5.1) * 150, P = [[x0, y0]];
      for (let k = 1; k < 4; k++) P.push([P[k - 1][0] + (hash(i * 9 + k) - .5) * 90, P[k - 1][1] + (hash(i * 4 + k) - .5) * 26]);
      inkLine(P, 1.1, CRACK, 'inkfine', 0);
    }
    boilSeed('reeds');   // a dead reed clump, and a bare far tree
    for (let i = 0; i < 6; i++) inkLine([[70 + i * 12, 1215], [60 + i * 15 + hash(i) * 20, 1105 + hash(i * 3) * 40]], 2.2, '#9C7E52', 'ink', .4);
    inkLine([[985, 1068], [990, 990], [972, 960]], 4, '#9A8466', 'ink', .4); inkLine([[990, 1000], [1012, 972]], 3, '#9A8466', 'ink', .4);
    // the last puddle, drying
    const k = 1 - seg(t, DRY0, DRY1);
    if (k > 0) { boilSeed('puddle'); paint(ellPts(785, 1312, 46 * k + 4, 11 * k + 2, 16), { wash: '#93A8A2', ink: PAL.ink, sw: .6 }); }
    else if (t < DRY1 + .5) { boilSeed('puddle'); paint(ellPts(785, 1312, 30, 7, 14), { wash: '#B18B58', ink: null }); }
  }
  // the stick: a dry reed, about 520 long, centred at (x, y), angle a
  const STICK = 540;
  function stick(x, y, a = 0, key = 'stick') {
    boilSeed(key);
    const c = Math.cos(a), s = Math.sin(a), h = STICK / 2;
    paint(ribbon([[x - c * h, y - s * h], [x, y + 2], [x + c * h, y + s * h]], 13, 10), { wash: '#9C7A4C', ink: PAL.ink, sw: 1.2 });
    inkLine([[x + c * h * .4, y + s * h * .4], [x + c * h * .4 + 18, y + s * h * .4 - 16]], 3, '#9C7A4C', 'ink', 0);   // a little twig
  }
  // the town below: a row of houses drifting left, kids behind a mud wall (drawn by the shot)
  function town(t, drift) {
    for (let i = 0; i < 8; i++) {
      const span = 1500, x = ((i * 190 + 900 - drift) % span + span) % span - 250, w = 120 + hash(i * 3.3) * 60, h = 70 + hash(i * 1.9) * 50, y = 1335;
      if (x < -250 || x > W + 250) continue;
      boilSeed('house' + i);
      paint(rectPts(x - w / 2, y - h, w, h + 20), { wash: i % 2 ? '#D8B985' : '#CFAE7A', ink: PAL.ink, sw: .8 });
      paint([[x - w / 2 - 14, y - h + 4], [x - w / 4, y - h - 36], [x + w / 4, y - h - 36], [x + w / 2 + 14, y - h + 4]], { wash: i % 3 ? '#B9694B' : '#A85A40', ink: PAL.ink, sw: .9 });
      for (let k = 0; k < 4; k++) inkLine([[x - w / 2 + k * w / 3.5, y - h], [x - w / 4 + k * w / 7, y - h - 34]], .6, '#7E3E2C', 'inkfine', 0);
      if (i % 2) paint(rrPts(x - 12, y - 48, 24, 40, 10), { wash: '#6B4A32', ink: null });
    }
  }
  function wall(drift) {
    boilSeed('wall');
    paint(rectPts(-200, 1322, W + 400, 140), { wash: '#C69D69', fill: '#B08654', fillOp: 70, tex: .6, ink: null });
    inkLine([[-50, 1324], [W + 50, 1322]], 1.6, PAL.ink, 'ink', 0);
    for (let i = 0; i < 9; i++) { const x = ((i * 140 - drift) % 1260 + 1260) % 1260 - 90; inkLine([[x, 1340], [x + 30, 1352]], .8, '#94703F', 'inkfine', 0); }
  }

  // ---- the kids (Kartikeya's rig, recoloured)
  const BOY = { skin: '#C78A5C', skinDk: '#A06A42', skinLt: '#E3AE84', hair: '#2A2230', teal: '#D9A23A', tealDk: '#A87A22', tealLt: '#F0C76A', sash: '#B5452C', sashDk: '#8A3220' };
  const GIRL = { skin: '#E2A77C', skinDk: '#BD8058', skinLt: '#F6C9A3', hair: '#2E2436', teal: '#C8506A', tealDk: '#963A50', tealLt: '#E98DA0', sash: '#E0A33A', sashDk: '#A87A22' };
  const kidBase = { feather: false, spear: false, shield: false, tilak: false, noShadow: true };
  function kid(t, x, which) {
    const girl = which === 1, u = 19, y = 1472, seed = girl ? 2 : 5;
    if (t < KIDS + which * .25) return;
    const up = backOut(clamp((t - KIDS - which * .25) * 3));   // pop up from behind the wall
    const o = { ...kidBase, pal: girl ? GIRL : BOY, girl: girl ? 1 : 0, boilKey: 'kid' + which, seed, dy: (1 - up) * 9, eyes: 'normal', mouth: 'O', lookX: -.6, lookY: -1, hx: -.25 };
    if (t > POINT + which * .2) { const k = ease(seg(t, POINT + which * .2, POINT + .3 + which * .2)); o.aL = lerp(-1.3, girl ? .9 : 1.1, k); o.eyes = 'wide'; }
    const laughing = (t > WHEEL0 + 1.0 && t < WHEEL1 + .6) || (t > LEGS0 + 1.0 && t < SNAP + .15);
    if (laughing) {
      const hard = t > LEGS0 + 1.0 ? 1.6 : 1;
      o.eyes = 'happy'; o.mouth = 'laugh'; o.dy += -.18 * hard * Math.abs(Math.sin((t + which * .37) * 15));
      if (t > LEGS0 + 1.0) { o.aR = .2 + .4 * Math.sin(t * 9 + which); o.aL = girl ? -.2 : 1.1; }   // clutching, slapping the wall
      if (t > ROLL && !girl) o.rot = -.22 * ease(seg(t, ROLL, ROLL + .4)) + .05 * Math.sin(t * 12);
      if (t > ROLL && girl) o.htilt = .15 * Math.sin(t * 10);
    }
    if (t > SNAP + .15) {   // he falls: they stop, watch him go down, flinch at the thud
      o.mouth = 'O'; o.eyes = 'wide'; o.aL = lerp(o.aL ?? -1.3, -1.3, ease(seg(t, SNAP + .15, SNAP + .6))); o.rot = (o.rot || 0) * (1 - seg(t, SNAP + .15, SNAP + .5));
      o.lookY = lerp(-1, 1, ease(seg(t, DROP + .1, DROP + .6))); o.hx = -.15;
      if (t > THUD) { const tk = take(t, THUD, .8); o.sq = tk.sq; o.dy += tk.dy; o.eyes = t < THUD + .5 ? 'squeeze' : 'wide'; }
      if (t > 29.4) { const k = ease(seg(t, 29.4, 29.9)); o.lookY = lerp(1, 0, k); o.lookX = lerp(-.6, girl ? .9 : -.9, k); o.hx = girl ? .25 * k : -.3; o.mouth = t > 30.1 ? 'flat' : 'O'; }
    }
    if (blinkAt(t, girl ? [16.9, 22.4] : [17.3, 21.9])) o.eyes = 'closed';
    kartikeya(x, y, u, o);
  }

  // ---- the trio in flight: the stick's centre and its bob
  const flyPos = t => {
    const settle = easeOut(seg(t, B0, B0 + .55)), go = easeIn(seg(t, GO, GO + 1.3));
    const x = 520 + 30 * Math.sin(t * .35) + go * 900, y = 800 + (1 - settle) * 700 + 10 * Math.sin(t * 2.2) - go * 60;
    return [x, y];
  };
  const swanFly = (bx, by, u, o) => { const b = hamsaBeak(0, 0, u, o); hamsa(bx - b[0], by - b[1], u, o); };

  // ================= A · the dry pond =================
  function actPond(t, lt, dur) {
    const tilt = easeIn(seg(t, LIFT + .1, B0)) * 900;
    const pan = 70 * ease(seg(t, SWOOP0, GRAB));   // the camera eases right as the swans take the stick
    camBegin(560 + pan, 1105 - tilt, 1.2 + .004 * lt);
    pond(t);
    const TX = 560, TY = 1300, TU = 26, SU = 22, GY = 1330;

    // the tortoise
    const o = { boilKey: 'tort', neck: .55, neckA: .3, lid: .5, eyes: 'sad', mouth: 'frown', lookX: .5, lookY: .6 };
    if (t > DRY1 && t < LANDB) { const k = ease(seg(t, SIGH, SIGH + .4)); o.neckA = .3 + .15 * k; o.dy = .06 * k; o.lid = .6; }
    if (t > LANDB) { o.neckA = .05; o.neck = .45; o.eyes = 'wide'; o.lookY = -.3; o.lookX = -.4; o.mouth = 'flat'; o.lid = 0; }
    if (t > LANDA) { o.lookX = .7; }
    if (t > LAKE0 + .2) { o.eyes = 'normal'; o.lid = .2; o.lookX = .5; o.lookY = -1; o.neckA = -.15; o.mouth = 'flat'; }
    if (t > LAKE1 - .3) { o.eyes = 'sad'; o.lid = .5; o.mouth = 'frown'; o.lookY = .2; o.neckA = .15; }
    if (t > WING0) { o.lookY = -.6; o.neckA = .25 + .1 * Math.sin((t - WING0) * 2); }
    if (t > IDEA) { const tk = take(t, IDEA, 1); o.sq = tk.sq; o.dy = tk.dy; o.eyes = 'wide'; o.mouth = 'grin'; o.neck = .8; o.neckA = -.25; o.lookY = -.8; o.lookX = .2; o.lid = 0; }
    if (t > PLAN0 + .4) { o.eyes = 'normal'; o.lid = .15; o.mouth = 'smile'; o.lookY = -.8; }
    if (t > AGREE + .2) { o.lookX = .8; o.lookY = -.6; }
    if (t > ZIP0) { o.eyes = 'normal'; o.lid = 0; o.mouth = 'flat'; o.lookX = .9; o.lookY = -.6; }
    if (t > NODT && t < DIP) { o.htilt = .25 * Math.sin((t - NODT) * 26); o.eyes = 'happy'; o.mouth = 'smile'; }
    // the dip, the bite, the head comes up with the stick
    const DOWN = { neck: 1, neckA: 1.0, htilt: .3, rot: .2 }, UPP = { neck: .9, neckA: -.35, htilt: 0, rot: 0 };
    let bitten = false, sx = 0, sy = 0;
    if (t > DIP) {
      const k1 = ease(seg(t, DIP, CHOMP)), k2 = ease(seg(t, CHOMP + .05, UPS + .15));
      for (const f of ['neck', 'neckA', 'htilt', 'rot']) o[f] = lerp(lerp(o[f] ?? 0, DOWN[f], k1), UPP[f], k2);
      o.eyes = 'normal'; o.lid = .1; o.lookY = .6; o.lookX = .6; o.mouth = t > CHOMP ? 'bite' : 'open'; o.openK = .5;
      if (t > CHOMP) { bitten = true; o.lookY = -.4; o.lid = .3; o.mouth = 'bite'; }
      if (t > GRAB) { const tk = take(t, GRAB, .6); o.eyes = 'wide'; o.lid = 0; o.lookY = -1; o.sq = tk.sq; }
    }
    const downO = { ...o, ...DOWN }, groundStick = tortoiseMouth(TX, TY, TU, downO);
    // lift: from standing with the stick to hanging from it
    let tx = TX, ty = TY, lift = 0;
    if (t > LIFT) {
      lift = easeIn(seg(t, LIFT, B0 + .2));
      const hk = ease(seg(t, LIFT, LIFT + .35));
      o.rot = lerp(o.rot, -.5, hk); o.neckA = lerp(o.neckA, -.6, hk); o.neck = lerp(o.neck, 1, hk); o.dangle = hk; o.kick = t * 3; o.noShadow = hk > .3;
      o.eyes = 'wide'; o.lid = 0; o.lookY = .9; o.mouth = 'bite';
    }
    if (!bitten) stick(groundStick[0], groundStick[1] + 6, 0);
    if (bitten) {
      const m0 = tortoiseMouth(TX, TY, TU, o);
      if (lift > 0 || t > LIFT) {
        const hk = ease(seg(t, LIFT, LIFT + .35)), mPose = tortoiseMouth(0, 0, TU, o);
        sx = m0[0]; sy = m0[1] - lift * 700;
        tx = lerp(TX, sx - mPose[0], hk); ty = lerp(TY, sy - mPose[1], hk);
        if (hk < 1) { const mm = tortoiseMouth(tx, ty, TU, o); sx = mm[0]; sy = mm[1]; }
      } else { sx = m0[0]; sy = m0[1]; }
    }
    tortoise(tx, ty, TU, o);
    if (bitten) stick(sx, sy, 0);
    if (t > IDEA && t < PLAN0 + .2) { const h = tortoiseHead(TX, TY, TU, o); boilSeed('bulb'); emote('bulb', h[0] - 10, h[1] - 95, 40, pop(t, IDEA, 6) * (1 - seg(t, PLAN0, PLAN0 + .2)), t - IDEA); }

    // the swans: land, think, take off, swoop back for the stick's ends
    const swan = (who) => {
      const A = who === 'A', land = A ? LANDA : LANDB, gx = A ? 852 : 238, sy0 = hamsaStandY(GY, SU);
      const from = A ? [1180, 640] : [-150, 680], key = 'swan' + who;
      if (t < land - .6) return;
      const so = { boilKey: key, tuft: A ? 1 : 0, flip: A, eyes: 'normal', lookX: .3, seed: A ? 1 : 4 };
      let x = gx, y = sy0;
      if (t < land) {   // gliding in on an arc
        const k = seg(t, land - .6, land), p = arcPt(from, [gx, sy0], -120, easeOut(k));
        x = p[0]; y = p[1]; so.fly = 1 - seg(t, land - .15, land); so.flap = t * 3.2; so.rot = (A ? 1 : -1) * .12 * (1 - k);
      } else {
        so.wingsUp = 1 - seg(t, land + .25, land + .65);
        const sp = spring(t, land, 7, 22); so.sq = .18 * sp;
      }
      // acting
      if (t > LAKE0 - .1) { so.lookY = -.6; so.lookX = .2; }
      if (A && t > LAKE0 && t < LAKE1) { so.eyes = 'half'; so.htilt = -.15; }
      if (!A && t > LAKE0 + .3 && t < LAKE1) { so.htilt = NODB.reduce((s, b) => s + .3 * Math.exp(-(t - b) * 7) * (t > b ? Math.sin((t - b) * 14) : 0), 0); so.lookX = .9; so.lookY = -.6; }
      if (t > WING0) { so.lookX = 1; so.lookY = .4; so.eyes = 'half'; so.htilt = .12; }
      if (t > IDEA) { so.eyes = 'normal'; so.htilt = 0; so.lookY = 0; }
      if (t > PLAN0 + .5) { so.lookY = -.5; so.lookX = .4; }
      if (t > AGREE - .4 && t < AGREE + .2) { so.lookX = -1; so.lookY = 0; }   // they look at each other
      if (t > AGREE + .2 && t < ZIP0) { so.htilt = .25 * Math.max(0, Math.sin((t - AGREE - .2) * 12)) * Math.exp(-(t - AGREE - .2) * 3); so.eyes = 'normal'; }
      if (A && t > ZIP0 && t < ZIP1) { so.eyes = 'stern'; so.lookX = .6; so.lookY = .5; so.dx = -.6 * ease(seg(t, ZIP0, ZIP0 + .3)); so.htilt = .1; }
      if (!A && t > ZIP0) { so.lookX = .9; so.lookY = .5; }
      if (blinkAt(t, A ? [3.3, 6.0, 9.95] : [2.6, 5.4, 8.7])) so.eyes = 'closed';
      // take off (10.3+), up out of the band; swoop back down onto the ends of the stick
      const T0 = UPS - .1 + (A ? .1 : 0);
      if (t > T0) {
        const up = easeIn(seg(t, T0, SWOOP0 - .05));
        so.fly = clamp((t - T0) * 5); so.flap = t * 3.4 + (A ? .3 : 0); so.wingsUp = 0;
        if (t > T0 + .12) so.flip = false;   // turns in the air to face right
        x = lerp(gx, gx + (A ? -60 : 80), up); y = lerp(sy0, 330, up);
        if (t > SWOOP0) {
          const k = easeOut(seg(t, SWOOP0, GRAB)), end = A ? [sx + STICK / 2 - 8, sy] : [sx - STICK / 2 + 8, sy];
          const b = hamsaBeak(0, 0, SU, { ...so, flip: false });
          x = lerp(A ? 640 : 160, end[0] - b[0], k); y = lerp(380, end[1] - b[1], k);
          so.beak = t < GRAB ? .7 : 0; so.eyes = t > GRAB ? 'normal' : 'wide'; so.lookX = .8; so.lookY = .3; so.rot = -.1;
          if (t > LIFT) so.flap = t * 4.4 + (A ? .3 : 0);
        }
      }
      hamsa(x, y, SU, so);
    };
    swan('B'); swan('A');

    // bubbles (one at a time)
    const hA = [790, 1085], hT = tortoiseHead(TX, TY, TU, o);
    bubble(650, 965, 300, 210, hA, life(t, LAKE0, LAKE1), 'lake', DOODLE.lake);
    bubble(480, 970, 290, 205, [hT[0] - 30, hT[1] - 40], life(t, WING0, WING1), 'wings', DOODLE.wings);
    bubble(520, 965, 330, 220, [hT[0] - 20, hT[1] - 50], life(t, PLAN0, PLAN1), 'plan', DOODLE.stick);
    bubble(650, 970, 270, 205, [775, 1085], life(t, ZIP0, ZIP1), 'zip1', DOODLE.zip);

    camEnd();
    if (t > B0 - .3) whip((t - (B0 - .3)) / .3, 1);
    frame();
  }

  const whip = fableWhip;

  // ================= B · the sky over the town =================
  function actSky(t, lt, dur) {
    const sh = t > THUD && t < THUD + .35 ? shakeXY(t, 6 * (1 - (t - THUD) / .35)) : [0, 0];
    camBegin(540 + sh[0], 1020 + sh[1], 1.22);
    const drift = (t - B0) * 14, townIn = Math.max(0, t - (KIDS - 1.2));
    sky('air', t * 40);
    // the town slides in from the right, then drifts slowly (it is far below)
    const tdrift = drift - 700 * (1 - easeOut(seg(t, KIDS - 1.4, KIDS + .2)));
    const townDraw = () => { if (t > KIDS - 1.4) town(t, tdrift + 900); };
    const kx = -tdrift;
    // the fall: behind the wall
    const [fx0, fy0] = flyPos(t), U_T = 27, SU = 22;
    const stickY = fy0 - (t > DROP ? 40 * Math.sin(Math.min(1, (t - DROP) * 3) * Math.PI / 2) * Math.exp(-Math.max(0, t - DROP - .3) * 2) : 0);
    // the tortoise
    const o = { boilKey: 'tort', neck: 1, neckA: -.6, rot: -.5, dangle: 1, kick: t * .7, noShadow: true, eyes: 'happy', mouth: 'bite', lid: 0, lookX: .5, lookY: .6 };
    if (t > KIDS + .3) { o.eyes = 'normal'; o.lid = .3; o.lookY = .9; o.lookX = .4; }
    if (t > WHEEL0 + 1.1) { o.eyes = 'normal'; o.lid = .5; }
    if (t > FROWN) { o.eyes = 'angry'; o.lid = .5; o.lookY = 1; }
    if (t > LEGS0 + 1.0) { o.lid = .6; }
    if (t > PUFF) { const k = ease(seg(t, PUFF, PUFF + .6)); o.puff = k; o.tint = 'flush'; o.tintK = .7 * k; o.sq = -.04 * k; }
    if (t > WARN0 + .3) { o.puff = 1 - ease(seg(t, WARN0 + .9, WARN0 + 1.3)) * .6; o.eyes = 'normal'; o.lid = .2; o.lookX = .9; o.lookY = -.5; o.tintK = .5; }
    if (t > WARN1 - .2) { o.htilt = .08 * Math.sin((t - WARN1) * 30) * Math.exp(-(t - WARN1) * 4); }
    if (t > ROLL) { o.eyes = 'angry'; o.lid = .55; o.lookY = 1; o.lookX = .3; o.puff = .4 + .6 * ease(seg(t, ROLL, SNAP - .2)); o.tintK = .5 + .3 * seg(t, ROLL, SNAP); o.twitch = seg(t, ROLL + .4, SNAP) > 0 ? 1 : 0; }
    let tx, ty;
    if (t < DROP) {
      if (t > SNAP) { o.mouth = 'open'; o.openK = ease(seg(t, SNAP, DROP)); o.puff = 0; o.eyes = 'angry'; o.lid = .3; o.twitch = 0; }
      const m = tortoiseMouth(0, 0, U_T, o); tx = fx0 - m[0]; ty = stickY - m[1];
    } else {   // he falls, still mid-sentence
      const a = t - DROP, m = tortoiseMouth(0, 0, U_T, { ...o, rot: -.5 });
      o.mouth = 'open'; o.openK = 1; o.puff = 0; o.eyes = a < .25 ? 'angry' : 'wide'; o.lid = a < .25 ? .3 : 0; o.lookY = a < .25 ? 1 : -1; o.twitch = 0;
      o.rot = -.5 + a * 1.4; o.kick = t * 4;
      tx = fx0 - m[0] - a * 40 + (fx0 - flyPos(DROP)[0]) * -1; ty = fy0 - m[1] + 1500 * a * a;
      if (t > DROP + 1) tx = -9999;
    }
    // falling, he goes down far beyond the town: drawn behind its houses
    if (t > DROP + .08) { if (tx > -9000) tortoise(tx, ty, U_T, o); townDraw(); }
    else { townDraw(); tortoise(tx, ty, U_T, o); }
    // the swans: Vikata on the back end, Sankata (the crest) on the front
    for (const A of [false, true]) {
      const so = { boilKey: A ? 'swanA' : 'swanB', fly: 1, flap: t * 2.6 + (A ? .37 : 0), tuft: A ? 1 : 0, eyes: 'normal', lookX: .6, lookY: .2, rot: -.04, seed: A ? 1 : 4 };
      if (t > GO) so.flap = t * 2.6 + (A ? .37 : 0) + 1.2 * (t - GO) * (t - GO);
      if (t > KIDS + .6 && t < SNAP) { so.lookY = .7; so.lookX = .2; }
      if (A && t > WARN0 && t < WARN1) { so.eyes = 'stern'; so.lookX = -1; so.lookY = .6; so.htilt = .25 * ease(seg(t, WARN0, WARN0 + .3)); }
      if (t > DROP) { so.eyes = 'wide'; so.lookX = 0; so.lookY = 1; so.htilt = .35 * ease(seg(t, LOOKD - .4, LOOKD)); so.beak = 0; }
      if (t > THUD) { so.eyes = t < THUD + .45 ? 'closed' : 'half'; }
      if (A && t > LAST0 && t < LAST1) { so.eyes = 'stern'; so.lookX = -1; so.lookY = .5; }
      if (!A && t > LAST0 + .2 && t < LAST1) { so.htilt = .25 + .12 * Math.sin((t - LAST0) * 14); so.eyes = 'closed'; }
      if (t > GO) { so.htilt = 0; so.eyes = 'half'; so.lookX = 1; so.lookY = 0; }
      if (blinkAt(t, A ? [13.8, 19.4, 24.0] : [14.9, 20.2])) so.eyes = 'closed';
      const end = A ? [fx0 + STICK / 2 - 8, stickY] : [fx0 - STICK / 2 + 8, stickY];
      swanFly(end[0], end[1], SU, so);
    }
    stick(fx0, stickY, 0, 'stickB');
    // the dust over the wall, the town's near side, the kids
    if (t > THUD && t < THUD + 1.4) {
      const a = t - THUD; boilSeed('dust');
      for (let i = 0; i < 6; i++) paint(ellPts(470 + (i - 2.5) * 34 + a * (i - 2.5) * 40, 1290 - a * 110 - hash(i) * 30, 34 + a * 50, 22 + a * 26, 14, 3), { fill: '#B39264', fillOp: 230 * (1 - a / 1.4), bleed: .2, tex: .3, ink: null });
    }
    kid(t, 690 + kx * .0 - drift, 0);
    kid(t, 830 - drift, 1);
    wall(drift);

    // bubbles
    const kidHead = (x) => [x - 20, 1200];
    bubble(600, 1070, 280, 210, kidHead(690 - drift), life(t, WHEEL0, WHEEL1), 'wheel', DOODLE.wheel);
    bubble(620, 1070, 300, 220, kidHead(830 - drift), life(t, LEGS0, LEGS1), 'legs', DOODLE.wheelLegs);
    const hdA = hamsaHead(0, 0, SU, { fly: 1 }), beakA = hamsaBeak(0, 0, SU, { fly: 1 }), headAx = fx0 + STICK / 2 - 8 - beakA[0] + hdA[0], headAy = stickY - beakA[1] + hdA[1];
    bubble(740, 1040, 260, 205, [headAx, headAy + 24], life(t, WARN0, WARN1), 'zip2', DOODLE.zip);
    const bm = flyPos(SNAP);
    bubble(280, 960, 240, 190, [bm[0] - 60, bm[1] + 30], life(t, SNAP + .02, POPB, 9), 'burst', DOODLE.burst);
    bubble(750, 1040, 260, 205, [headAx, headAy + 24], life(t, LAST0, LAST1), 'zip3', DOODLE.zip);
    camEnd();
    if (t < B0 + .3) whip(.5 + (t - B0) / .6, 1);
    frame(seg(t, END - .35, END));
  }

  shots([[0, actPond], [B0, actSky]]);

})();
