// sun.js: "Baby HANUMAN once tried to EAT the SUN", a ~58.4 s captioned reel for followers. Hungry baby Hanuman takes
// the rising sun for a ripe mango, flies up, and Surya doesn't burn him; he swallows it (Hanuman Chalisa: "leelyo tahi
// madhur phal janu"). It's an eclipse day: Rahu comes for the sun and the baby goes for him too; then for Indra's white
// elephant. Indra's vajra hits his jaw, Papa Vayu stops all the air, Brahma revives him, every god gives a boon, and
// Indra names him HANUMAN (hanu = jaw). The ending rhymes the opening: the clearing, a real mango, the sun winks.
// Storyboard: STORYBOARD.md. Props: sun_props.js. All times are video time (t); tools/sun_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/sun_sfx.mjs)
  const GRUMBLE = 1.6, B0 = 3.0, LOOK = 3.3, RISE = 4.0, SEE = 5.2, MANGO = 5.8, DROOL = 6.8, HOP = 7.5;
  const WIGGLE = 8.0, LEAP = 8.9, C0 = 9.0, D0 = 12.0;
  const NOTICE = 12.3, SOFT = 13.3, AAM = 14.9, GULP = 15.5, CHALISA = 17.7;
  const RAHU = 22.1, SPOT = 23.2, LUNGE = 24.5, FLEE = 24.9, G0 = 26.4;
  const INDRA = 26.5, FRUIT = 28.6, JUMP = 29.4, WIND = 29.9, THROW = 30.5, HIT = 30.8, H0 = 31.0;
  const LAND = 32.4, I0 = 35.0, VAYU = 35.1, ANGRY = 36.5, STOP = 37.7, J0 = 40.4;
  const BRAHMA = 40.5, TOUCH = 41.3, WAKE = 41.8, PHEW = 42.3, BOONS = 42.9, GARLAND = 44.3, K0 = 46.0;
  const HANU = 46.1, NAME = 48.4, L0 = 50.4;
  const BASKET = 50.6, GRAB = 51.3, WINK = 52.2, CHOMP = 52.8, ASK = 50.6, WIPE = 54.1;
  const CARD = 54.4, FOLLOW = 55.0, PILL = 55.5;

  const GOLDC = '#F5C542';
  const inW = (t, a, b) => t >= a && t < b;

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['Baby HANUMAN once tried', 500, -1, B0 - .1 + 1, 64], ['to EAT the SUN.', 615, -1, B0 - .1 + 1, 104, GOLDC],
    ['Maa had gone to pick fruit.', 500, B0, SEE - B0 - .1, 58], ['He woke up HUNGRY.', 590, B0 + .4, SEE - B0 - .5, 80, GOLDC],
    ['Then he saw a big, ripe…', 500, SEE, WIGGLE + .1 - SEE, 64], ['MANGO.', 625, MANGO, WIGGLE + .1 - MANGO, 150, GOLDC],
    ['Son of VAYU, the wind god…', 500, WIGGLE + .2, 10.1 - WIGGLE - .2, 60], ['…so up he FLEW!', 600, 10.1, D0 - 10.1 - .1, 96, GOLDC],
    ["Surya Dev didn't burn him.", 480, NOTICE, AAM - .2 - NOTICE, 66], ['A baby? So sweet!', 590, SOFT + .3, AAM - .2 - SOFT - .3, 66, GOLDC],
    ['He SWALLOWED it!', 560, GULP + .05, CHALISA - GULP - .15, 104, GOLDC],
    ['Even the Hanuman Chalisa says:', 470, CHALISA, RAHU - CHALISA - .15, 56], ['"Leelyo tahi', 565, CHALISA + .45, RAHU - CHALISA - .6, 84, GOLDC], ['MADHUR PHAL janu"', 665, CHALISA + .6, RAHU - CHALISA - .75, 84, GOLDC],
    ['(he swallowed it, thinking:', 1380, CHALISA + 1.0, RAHU - CHALISA - 1.15, 50], ["it's a sweet fruit!)", 1450, CHALISA + 1.1, RAHU - CHALISA - 1.25, 50],
    ['It was an ECLIPSE day.', 480, RAHU, LUNGE - .1 - RAHU, 62], ['RAHU came to eat the sun…', 575, RAHU + .5, LUNGE - .6 - RAHU, 62, GOLDC],
    ['…and Baby went for HIM too!', 540, LUNGE - .1, G0 - LUNGE - .05, 64, GOLDC],
    ['Then came INDRA,', 480, INDRA, FRUIT - INDRA - .1, 70], ['on his white elephant.', 575, INDRA + .4, FRUIT - INDRA - .5, 62, GOLDC],
    ['…an even BIGGER fruit!', 540, FRUIT, H0 - FRUIT - .05, 78, GOLDC],
    ['Indra threw his VAJRA…', 500, H0 + .1, 33.0 - H0 - .1, 72], ['…right on his JAW.', 540, 33.1, I0 - 33.1 - .1, 88, GOLDC],
    ['Papa VAYU got SO angry…', 500, VAYU, STOP - VAYU - .1, 70], ['he STOPPED all the air!', 520, STOP, J0 - STOP - .1, 80, GOLDC],
    ['BRAHMA woke him up,', 480, BRAHMA, BOONS - BRAHMA - .1, 70], ['and every god gave him a BOON.', 520, BOONS, K0 - BOONS - .1, 58, GOLDC],
    ['Indra said: "My vajra hit', 480, HANU, NAME - HANU - .1, 60], ['his HANU (jaw)…"', 570, HANU + .4, NAME - HANU - .5, 72, GOLDC],
    ['So his name is:', 480, NAME, L0 - NAME - .05, 66], ['HANUMAN.', 610, NAME + .35, L0 - NAME - .4, 150, GOLDC],
    ['Did you know this story?', 465, ASK, WIPE - ASK + .1, 64], ['Comment', 550, ASK + .45, WIPE - ASK - .35, 60], ['JAI BAJRANGBALI', 635, ASK + .55, WIPE - ASK - .45, 92, GOLDC],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };
  const camK = (t, keys, sh = [0, 0]) => { const c = kf(t, keys); camBegin(c[0] + sh[0], c[1] + sh[1], c[2]); return c; };
  // a smear of speed lines behind something moving (screen or world space)
  const speed = (x, y, dx, dy, n, len, key, col = '#FFFFFF') => {
    boilSeed(key); const d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
    for (let i = 0; i < n; i++) { const o = (hash(i * 3.7) - .5) * 2, l = len * (.5 + hash(i * 1.3) * .6), px = x - uy * o * 70, py = y + ux * o * 70; inkLine([[px - ux * 30, py - uy * 30], [px - ux * (30 + l), py - uy * (30 + l)]], 1.4, col, 'inkfine', 0); }
  };
  const starBurst = (x, y, r, k, key) => {
    if (k <= 0 || k >= 1) return; boilSeed(key);
    glow(x, y, r * 2.2 * (1 - k * .5), '#FFF2B0', 1 - k);
    paint(starPts(x, y, r * (.6 + k * .8), .42, 8, k), { wash: '#FFF6C8', washOp: 255 * (1 - k), ink: SK.ink, sw: 1 });
  };
  const dust = (x, y, age, key) => {
    if (age < 0 || age > .8) return; boilSeed(key); const k = age / .8;
    for (let i = 0; i < 6; i++) { const a = Math.PI + i / 5 * Math.PI, r = 40 + k * 140; paint(ellPts(x + Math.cos(a) * r * 1.4, y + Math.sin(a) * r * .35, 30 * (1 - k * .5), 22 * (1 - k * .5), 12), { wash: SK.rockLt, washOp: 220 * (1 - k), ink: null }); }
  };

  // ================= A+B · the clearing: hungry, the sun rises, a MANGO, the pounce =================
  function shotClearing(t, lt) {
    const sunY = kf(t, [[RISE, 1380], [SEE, 1020], [WIGGLE, 980]]), mg = ease(seg(t, MANGO, MANGO + .6));
    const push2 = ease(seg(t, WIGGLE - .3, LEAP));
    camK(t, [[0, [540, 960, 1.0]], [SEE, [560, 960, 1.03]], [WIGGLE - .3, [560, 980, 1.05]], [LEAP, [520, 1060, 1.12]]]);
    clearingSet(t, { sky: ease(seg(t, RISE, SEE + 1)) * .35, plate: true, shift: 200, sun: () => {
      if (t > RISE - .1) surya(800, sunY, 120, { key: 'csun', eyes: t < SEE + .3 ? 'closed' : 'happy', mouth: 'smile', mango: mg, glowK: .9 * seg(t, RISE, RISE + .8), blush: 1 });
    } });
    // the baby
    const X = 430, Y = 1530, u = 52;
    const hop = jump(t, HOP, HOP + .32, .9), standing = t >= HOP + .16;
    const face = emotions(t, [
      [0, 'neutral', { eyes: 'normal', mouth: 'smile', emote: null }],
      [GRUMBLE + .05, 'surprised', { eyes: 'wide', mouth: 'O', emote: null }],
      [GRUMBLE + .7, 'sad', { eyes: 'sad', mouth: 'pout', emote: null, lookY: .6, tint: null, gloom: 0 }],
      [SEE, 'starstruck', { eyes: 'sparkle', mouth: 'O', emote: null, tint: null }],
      [MANGO + .2, 'love', { eyes: 'sparkle', mouth: 'cat', emote: 'hearts', tint: null }],
      [WIGGLE - .2, 'determined', { eyes: 'sparkle', mouth: 'cat', emote: null, tint: null }],
    ], { take: .6 });
    // where he looks: front, the plate (left), the other way, front; then up at the sun
    const look = kf(t, [[LOOK - .1, 0], [LOOK + .15, 1], [LOOK + .6, 1], [LOOK + .8, -.9], [LOOK + 1.2, -.9], [LOOK + 1.4, 0], [SEE - .05, 0], [SEE + .15, .8]]);
    const lookY = t > SEE ? -.85 : inW(t, LOOK, LOOK + .7) ? .8 : face.lookY || 0;
    const belly = spring(t, GRUMBLE, 7, 30) * .8 + spring(t, GRUMBLE + .45, 7, 30) * .5;
    let o = { ...face, pose: standing ? 'stand' : 'sit', hx: look * .7, lookX: look, lookY, belly: Math.abs(belly), boilKey: 'baby', seed: 1, tail: 'curl',
      dy: (face.dy || 0) * .35 + hop.dy, sq: (face.sq || 0) * .5 + hop.sq + belly * .05, blush: t > SEE ? .5 : face.blush };
    delete o.aL; delete o.aR; delete o.rot; delete o.dx;
    if (t < GRUMBLE) o = { ...o, handL: [-2.6, -4.6], handR: [2.6, -4.6], handShapeL: 'open', handShapeR: 'open' };
    else if (t < SEE) o = { ...o, handL: [-1.4, -5.0], handR: [1.5, -5.4], handShapeL: 'open', handShapeR: 'open' };      // patting the tummy
    else if (!standing) o = { ...o, handL: [-1.5, -8.1], handR: [1.5, -8.2], handShapeL: 'fist', handShapeR: 'fist', bendL: -1, bendR: -1 };   // fists under the chin
    if (t > SEE && t < WIGGLE) o.nod = -.1;
    if (t > DROOL) o.drool = ease(seg(t, DROOL, DROOL + .6));
    if (t > HOP && t < WIGGLE) o = { ...o, handL: [-2.8, -5.5], handR: [2.8, -5.5], handShapeL: 'open', handShapeR: 'open', drool: 0 };
    if (t >= WIGGLE) {   // the pounce: low, the bottom wiggles, claws out
      const w = Math.sin((t - WIGGLE) * 26) * seg(t, WIGGLE, WIGGLE + .2) * (1 - seg(t, LEAP - .15, LEAP));
      const cr = ease(seg(t, WIGGLE, WIGGLE + .25));
      o = { ...o, wiggle: w, nod: .7 * cr, sq: .14 * cr, handL: [-1.9, -3.6], handR: [1.9, -3.6], handShapeL: 'claw', handShapeR: 'claw', tailSway: t * 3, drool: 0, hx: .5, lookX: .9, lookY: -.9 };
      if (t > LEAP - .08) { const k = seg(t, LEAP - .08, C0); o.sq = lerp(.14, -.35, k); o.dy = -k * 6; o.handL = [-1.4, -14]; o.handR = [2.2, -14]; o.handShapeL = 'open'; o.handShapeR = 'open'; o.mouth = 'open'; }
    }
    balHanuman(X, Y, u, o);
    // the tummy grumble: little painted rumble marks by his belly
    for (const g of [GRUMBLE, GRUMBLE + .45]) {
      const a = t - g; if (a < 0 || a > .5) continue;
      boilSeed('rumble' + g); const [bx, by] = bhBelly(X, Y, u, o), k = a / .5;
      for (const s of [-1, 1]) for (let i = 0; i < 3; i++) inkLine([[bx + s * (130 + k * 40), by - 30 + i * 30], [bx + s * (165 + k * 50), by - 38 + i * 30], [bx + s * (200 + k * 50), by - 26 + i * 30]], 1.8 * (1 - k), SK.ink, 'inkfine', .5);
    }
    camEnd();
    caps(t);
  }

  // ================= C · up through the sky =================
  function shotFly(t, lt, dur) {
    skySet(t, { climb: ease(seg(t, C0, D0)) });
    // clouds stream down past him (parallax: near ones fast)
    for (let i = 0; i < 7; i++) {
      const near = i % 3 === 0, sp = near ? 1500 : 650, y = frac(hash(i * 2.1) + (t - C0) * sp / 2200) * 2400 - 300;
      cloud(80 + hash(i * 4.7) * 920, y, near ? 150 : 80, { key: 'fc' + i, ink: !near ? false : undefined, col: near ? SK.cloud : '#F4F8FC' });
    }
    // two birds startled as he zooms past
    const bk = seg(t, 10.0, 10.4);
    bird(760 + bk * 160, 1180 - (t - C0) * 140 + bk * 60, 34, { key: 'b1', eye: bk > 0 ? 'wide' : null, flap: t * (3 + bk * 6) });
    bird(860 + bk * 120, 1260 - (t - C0) * 140 + bk * 90, 26, { key: 'b2', eye: bk > 0 ? 'wide' : null, flap: t * (3.4 + bk * 6) + .3 });
    if (bk > 0 && t < 11.2) emote('!', 860, 1080 - (t - C0) * 140, 30, seg(t, 10.0, 10.2), t - 10);
    const k = easeOut(seg(t, C0, 11.0)), x = lerp(330, 520, k) + Math.sin(t * 3) * 14, y = lerp(1750, 1080, k) + Math.sin(t * 2.4) * 18 - seg(t, 11.5, D0) * 1300;
    speed(x, y, .45, -1, 6, 260, 'fsp');
    const face = emotions(t, [[C0, 'excited', { eyes: 'sparkle', mouth: 'open', mouthK: .7, emote: null }], [10.6, 'happy', { eyes: 'happy', mouth: 'grin', emote: null }]], { take: .4 });
    balHanuman(x, y, 36, { ...face, aL: undefined, aR: undefined, dy: 0, sq: -.04, pose: 'fly', rot: .4 + Math.sin(t * 2.2) * .05, tail: 'stream', tailSway: t * 2.4, kick: t * 2.6,
      handL: [-1.0, -13.2], handR: [2.6, -12.6], handShapeL: 'open', handShapeR: 'open', boilKey: 'baby', seed: 1 });
    caps(t);
  }

  // ================= D + E + F · the sun, the gulp, the Chalisa, Rahu =================
  function shotSun(t, lt) {
    const gulp = seg(t, GULP - .38, GULP), night = t >= GULP;
    // the sky: gold around the sun, then (gulp) night
    if (!night) {
      gradBands(['#FFC56A', '#FFD98A', '#FFE9B8'], -80, H + 80, 'sunsky');
      for (let i = 0; i < 5; i++) cloud(100 + hash(i * 3.1) * 900, 1500 + hash(i * 5.3) * 380, 110, { key: 'sc' + i, col: '#FFF1D6', dk: '#F6C98A', ink: false });
    } else nightSet(t);
    // camera: wide on the sun and the baby; after the gulp, onto the baby; for Rahu, a wider two-shot
    const c = camK(t, [[D0, [540, 960, 1]], [AAM - .3, [500, 1000, 1.05]], [GULP, [420, 1120, 1.12]], [GULP + .7, [440, 1050, 1.32]], [RAHU - .3, [440, 1050, 1.32]], [RAHU + .6, [600, 900, 1.0]], [LUNGE, [640, 900, 1.0]], [G0, [700, 940, .98]]]);
    // the baby's place: in from the lower left, hovering, then (night) floating at centre
    const bx = kf(t, [[D0, 60], [13.0, 190], [AAM, 230], [GULP + .6, 420], [RAHU, 430], [LUNGE, 430], [FLEE, 640], [G0, 600]], easeOut);
    const by = kf(t, [[D0, 1850], [13.0, 1500], [AAM, 1420], [GULP + .6, 1180], [RAHU, 1180], [LUNGE, 1170], [FLEE, 1080], [G0, 1120]], easeOut) + Math.sin(t * 2.2) * 14;
    const u = 34;
    // the Sun
    const mouthW = bhMouth(bx, by, u, { pose: 'fly', rot: .25 });
    if (!night) {
      const sx = lerp(720, mouthW[0], easeIn(gulp)), sy = lerp(930, mouthW[1], easeIn(gulp)), R = lerp(260, 18, easeIn(gulp));
      const sface = t < NOTICE ? { eyes: 'closed', mouth: 'smile' } : t < SOFT ? { eyes: 'wide', mouth: 'O', lookX: -1, lookY: .6 } : t < AAM ? { eyes: 'happy', mouth: 'grin' } : { eyes: 'wide', mouth: 'gasp', sweat: 1, lookX: -1, lookY: .6 };
      surya(sx, sy, R, { key: 'bigsun', ...sface, soft: ease(seg(t, SOFT, SOFT + .5)), squash: gulp > 0 ? [1 - gulp * .3, 1 + gulp * .5] : [1 + spring(t, NOTICE, 6, 16) * .06, 1 - spring(t, NOTICE, 6, 16) * .06], glowK: .9 });
      if (t > NOTICE && t < SOFT) emote('!?', 900, 720, 42, seg(t, NOTICE, NOTICE + .2), t - NOTICE);
      if (t > SOFT + .1 && t < AAM) emote('heart', 900, 730, 34, seg(t, SOFT + .1, SOFT + .3), t - SOFT);
      if (gulp > 0) speed(sx, sy, mouthW[0] - sx, mouthW[1] - sy, 8, 300 * gulp, 'gsp', '#FFF2B8');
    }
    // the baby
    const keys = [
      [D0, 'excited', { eyes: 'sparkle', mouth: 'open', mouthK: .6, emote: null }],
      [SOFT + .25, 'happy', { eyes: 'happy', mouth: 'grin', emote: null }],
      [AAM - .45, 'starstruck', { eyes: 'sparkle', mouth: 'aam', emote: null, tint: null }],
      [GULP, 'happy', { eyes: 'happy', mouth: 'puff', emote: null, blush: .6 }],
      [RAHU + 1.25, 'surprised', { eyes: 'wide', mouth: 'puff', emote: null }],
      [SPOT + .35, 'love', { eyes: 'sparkle', mouth: 'puff', emote: null, tint: null }],
      [FLEE + .45, 'sad', { eyes: 'normal', mouth: 'puff', emote: null, tint: null, gloom: 0 }],
    ];
    const face = emotions(t, keys, { take: .5 });
    const mk = t < AAM - .45 ? .6 : clamp(seg(t, AAM - .45, AAM) * 1.4, 0, 1.4);
    const puffK = night ? 1 : 0, glowC = night ? (.85 + .15 * Math.sin(t * 6)) : 0;
    const lungeK = seg(t, LUNGE - .15, LUNGE + .3) * (1 - seg(t, FLEE + .3, FLEE + .9));
    let o = { ...face, pose: 'fly', boilKey: 'baby', seed: 1, tail: 'stream', tailSway: t * 1.4, kick: t * (night ? .8 : 2.2), mouthK: face.mouth === 'aam' ? mk : face.mouthK,
      puff: puffK, cheekGlow: glowC, rot: night ? .1 + Math.sin(t * 1.3) * .06 + lungeK * .5 : .45, dy: 0, sq: (face.sq || 0) * .5,
      handL: [-1.2, -12.8], handR: [2.4, -12.4], handShapeL: 'open', handShapeR: 'open' };
    delete o.aL; delete o.aR; delete o.dx;
    if (night) o = { ...o, handL: [-3.3, -11.2], handR: [3.3, -11.0], handShapeL: 'open', handShapeR: 'open', tail: 'curl', lookX: 0 };        // hands on his glowing cheeks
    if (t > RAHU + 1.2) o.lookX = 1;
    if (lungeK > 0) o = { ...o, handL: [-.6, -12.8], handR: [3.6, -11.5], handShapeL: 'claw', handShapeR: 'claw', tail: 'stream' };
    if (t > FLEE + .5) { o.handL = [-2.2, -6.0]; o.handR = [2.2, -6.0]; o.handShapeL = 'fist'; o.handShapeR = 'fist'; o.lookX = .4; o.lookY = .8; o.tail = 'droop'; }
    if (t > G0 - .45) { o.lookX = .8; o.lookY = .9; }
    balHanuman(bx, by, u, o);
    // the Chalisa beat: tiny happy notes over him as he munches
    if (inW(t, CHALISA, RAHU)) { const a = t - CHALISA; emote('music', bx + 150, by - 420, 30, seg(a, 0, .3), a); }
    // Rahu: in from the right, licking his lips; finds no sun; sees the cheeks; flees
    if (t > RAHU - .2) {
      const rx = kf(t, [[RAHU - .2, 1350], [RAHU + .8, 830], [FLEE, 860], [FLEE + .7, 1700]], (k) => t > FLEE ? easeIn(k) : easeOut(k)), ry = 1000 + Math.sin(t * 2.6) * 20 - (t > FLEE ? (t - FLEE) * 300 : 0);
      const rf = t < RAHU + .8 ? { eyes: 'hungry', mouth: 'lick', lookX: -.3 } : t < SPOT ? { eyes: 'hungry', mouth: 'lick', lookX: Math.sin((t - RAHU) * 9) } : t < FLEE ? { eyes: 'wide', mouth: 'O', lookX: -1 } : { eyes: 'scared', mouth: 'wail', tears: 1, lookX: -1 };
      rahu(rx + (t > FLEE ? 0 : spring(t, SPOT, 6, 20) * 20), ry, 44, { ...rf, rot: t > FLEE ? .15 : 0, key: 'rahu' });
      if (t > SPOT && t < FLEE) emote('!?', rx + 120, ry - 230, 36, seg(t, SPOT, SPOT + .2), t - SPOT);
      if (t > FLEE) speed(rx, ry, 1, -.3, 7, 340, 'rsp');
    }
    // the jamun in the baby's eyes
    if (inW(t, SPOT + .35, LUNGE + .2)) {
      const [hx, hy] = bhHead(bx, by, u, o);
      thought(hx + 40, hy - 300, 95, seg(t, SPOT + .35, SPOT + .75) * (1 - seg(t, LUNGE, LUNGE + .2)), hx + 40, hy - 150, (cx, cy, r) => jamun(cx, cy + 6, r * .55), 'thj');
    }
    if (t > GULP && t < GULP + .18) { camEnd(); flash(1 - seg(t, GULP, GULP + .18), '#FFF4C8'); caps(t); return; }
    camEnd();
    if (t > G0 - .3) { flushLetters(); brushWipe((t - (G0 - .3)) / .6, [SK.nightTop, SK.storm]); }
    caps(t);
  }
  // a whip pan: the frame smears vertically (dir -1 up, 1 down) for .22 s across a seam
  function whip(t, t0, dir) {
    const k = seg(t, t0, t0 + .44), a = Math.sin(k * Math.PI);
    if (a <= .02) return;
    boilSeed('whip' + Math.floor(t0 * 10));
    for (let i = 0; i < 26; i++) { const x = hash(i * 2.9) * W, len = 300 + hash(i) * 600; inkLine([[x, hash(i * 5.1) * H], [x, hash(i * 5.1) * H + dir * len * a]], 2 + hash(i * 3) * 4, i % 2 ? '#FFFFFF' : SK.ink, 'dry', 0); }
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#2E3566', washOp: 200 * a, ink: null });
  }

  // ================= G · Indra on Airavata, the bigger fruit, the VAJRA =================
  function shotIndra(t, lt) {
    const day = seg(t, HIT, HIT + .2);
    gradBands([mixCol(SK.storm, SK.skyTop, day), mixCol(SK.stormLt, SK.sky, day), mixCol(SK.nightLow, SK.skyLow, day)], -80, H + 80, 'isky');
    // lightning flickers behind the storm clouds
    const fl = Math.max(0, Math.sin(t * 7.3) * Math.sin(t * 2.9)) > .7 ? 1 : 0;
    if (fl && day < .5) { boilSeed('bolt' + Math.floor(t * 4)); const bx0 = 200 + hash(Math.floor(t * 4)) * 700; inkLine([[bx0, 300], [bx0 + 40, 420], [bx0 - 20, 520], [bx0 + 30, 650]], 5, SK.bolt, 'ink', 0); glow(bx0, 480, 260, '#FFF0A0', .6); }
    for (let i = 0; i < 4; i++) cloud(150 + i * 280, 760 + (i % 2) * 120 + Math.sin(t * .6 + i) * 10, 130, { key: 'stc' + i, col: mixCol(SK.stormCl, SK.cloud, day), dk: mixCol(SK.stormClDk, SK.cloudDk, day), ink: false });
    const sh = t > HIT ? shakeXY(t, 18 * (1 - seg(t, HIT, HIT + .3))) : [0, 0];
    camK(t, [[G0, [540, 1060, 1.08]], [JUMP, [560, 1080, 1.1]], [HIT, [540, 1080, 1.14]]], sh);
    // Indra rises on his cloud from below
    const ay = kf(t, [[G0, 2300], [INDRA + 1.0, 1560]], easeOut) + Math.sin(t * 1.8) * 10, ax = 770, au = 33;
    cloud(ax, ay + 30, 220, { key: 'icl', col: mixCol(SK.stormCl, SK.cloud, day), dk: mixCol(SK.stormClDk, SK.cloudDk, day) });
    const panic = seg(t, JUMP + .1, JUMP + .3);
    const wind = seg(t, WIND, WIND + .4), thr = seg(t, THROW - .1, THROW + .08);
    const handR = t < WIND ? [2.6, -6.8] : t < THROW - .1 ? [lerp(2.6, 1.6, ease(wind)), lerp(-6.8, -9.2, ease(wind))] : [lerp(1.6, 3.4, thr), lerp(-9.2, -3.6, thr)];
    const io = { eyes: t < FRUIT ? 'normal' : t < JUMP ? 'wide' : 'angry', mouth: t < FRUIT ? 'smile' : t < WIND ? 'O' : 'shout', lookX: -1, handR, vajra: t < THROW ? 1 : 0, vajraA: t < WIND ? -.3 : lerp(-.9, 1.2, thr), handL: [-2.0, -1.0] };
    const ao = { trunk: panic > .5 ? 'up' : 'down', earOut: panic, eyes: panic > .3 ? 'wide' : 'normal', lookX: -1, sweat: panic > .5 ? 1 : 0, indra: io, boilKey: 'airav', sq: spring(t, JUMP + .1, 6, 18) * .05 };
    airavata(ax, ay, au, ao);
    // the baby: sees it, a thought bubble, hearts; then the leap at it
    const jk = seg(t, JUMP, HIT), p0 = [230, 1230], p1 = [360, 1150];
    let [bx, by] = jk > 0 ? arcPt(p0, p1, 120, easeOut(jk)) : [lerp(140, 250, easeOut(seg(t, G0, INDRA + .8))), lerp(1100, 1230, easeOut(seg(t, G0, INDRA + .8)))];
    by += Math.sin(t * 2.4) * 12;
    const hit = t >= HIT, fall = seg(t, HIT, H0);
    if (hit) { bx = p1[0] - fall * 120; by = p1[1] - fall * 140; }
    const face = emotions(t, [
      [G0, 'surprised', { eyes: 'wide', mouth: 'puff', emote: null }],
      [27.6, 'love', { eyes: 'heart', mouth: 'puff', emote: 'hearts', tint: null }],
      [JUMP, 'excited', { eyes: 'sparkle', mouth: 'puff', emote: null }],
      [HIT, 'ko', { eyes: 'swirl', mouth: 'O', emote: null, tint: null }],
    ], { take: .5 });
    const u = 30;
    const o = { ...face, pose: 'fly', boilKey: 'baby', seed: 1, puff: hit ? 0 : 1, cheekGlow: hit ? 0 : .85 + .15 * Math.sin(t * 6), dy: 0, sq: (face.sq || 0) * .5,
      rot: hit ? .4 - fall * 2.5 : .55 + jk * .2, tail: 'stream', tailSway: t * 1.6, kick: t * 1.6, lookX: 1, lookY: .3, htilt: hit ? -.4 * (1 - fall * .5) : 0,
      handL: jk > 0 ? [-.4, -13] : [-2.0, -6.5], handR: jk > 0 ? [3.6, -12] : [2.0, -6.5], handShapeL: jk > 0 ? 'claw' : 'open', handShapeR: jk > 0 ? 'claw' : 'open' };
    delete o.aL; delete o.aR; delete o.dx;
    balHanuman(bx, by, u, o);
    if (inW(t, 27.9, JUMP + .1)) {
      const [hx, hy] = bhHead(bx, by, u, o);
      thought(hx + 70, hy - 290, 130, seg(t, 27.9, 28.3) * (1 - seg(t, JUMP - .1, JUMP + .1)), hx + 40, hy - 140, (cx, cy, r) => ghostFruit(cx, cy + 14, r * .62), 'thg');
    }
    // the vajra flies from Indra's hand to the baby's chin, spinning
    const seat = airavataSeat(ax, ay, au, ao), hand = indraHand(seat[0], seat[1], au * .95, io, 1), chin = bhMouth(bx, by, u, o);
    if (inW(t, THROW, HIT + .05)) {
      const k = seg(t, THROW, HIT), [vx, vy] = arcPt(hand, [chin[0] + 20, chin[1] + 30], 60, k);
      boilSeed('vjf'); speed(vx, vy, chin[0] - hand[0], chin[1] - hand[1], 5, 160, 'vsp', '#FFF0A0');
      glow(vx, vy, 120, '#FFF0A0', .8);
      push(); translate(vx, vy); rotate(k * 9); indraVajra(au * .9, 1.1); pop();
    }
    if (hit) {
      starBurst(chin[0] + 20, chin[1] + 20, 120, seg(t, HIT, HIT + .35), 'hb');
      // the sun pops out of his mouth and flies home
      const sk = seg(t, HIT, H0 + .05);
      surya(lerp(chin[0], 900, easeOut(sk)), lerp(chin[1], 300, easeOut(sk)), lerp(20, 150, easeOut(sk)), { key: 'popsun', eyes: 'wide', mouth: 'O', glowK: .9 });
    }
    camEnd();
    if (t > HIT && t < HIT + .12) flash(1 - seg(t, HIT, HIT + .12), '#FFFDF0');
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [SK.nightTop, SK.storm]); }
    caps(t);
  }

  // ================= H · the fall, the mountain, the JAW =================
  function shotFall(t, lt) {
    const landed = t >= LAND, faint = seg(t, 34.0, 34.5);
    const sh = landed ? shakeXY(t, 14 * (1 - seg(t, LAND, LAND + .35))) : [0, 0];
    camK(t, [[H0, [540, 960, 1]], [LAND, [540, 990, 1]], [33.0, [540, 1000, 1.05]], [33.8, [540, 1060, 1.7]], [I0, [540, 1070, 1.78]]], sh);
    peakSet(t, { day: 1, cave: true });
    surya(820, 420, 70, { key: 'hsun', eyes: landed ? 'wide' : 'closed', mouth: landed ? 'O' : 'smile', sweat: landed ? 1 : 0, glowK: .7 });
    const X = 540, Y = 1300, u = 34;
    if (!landed) {
      const k = seg(t, H0, LAND), y = lerp(250, Y - 5.6 * u, easeIn(k));
      speed(X, y, 0, 1, 6, 280, 'fallsp');
      balHanuman(X + Math.sin(k * 9) * 40, y, u, { pose: 'fly', rot: k * TAU * 2.2, eyes: 'swirl', mouth: 'O', tail: 'stream', tailSway: t * 3, kick: t * 3, jaw: 0, handL: [-3.2, -12], handR: [3.2, -12], handShapeL: 'open', handShapeR: 'open', boilKey: 'baby' });
    } else {
      const jw = ease(seg(t, LAND + .1, LAND + .5)) * (1 + spring(t, LAND + .45, 7, 22) * .4);
      const o = { pose: 'sit', eyes: faint > .5 ? 'closed' : 'swirl', mouth: faint > .5 ? 'flat' : 'wobble', jaw: jw, plaster: t > LAND + .5, tail: 'droop', tailSway: 0, emote: faint > .5 ? null : 'stars', emoteK: seg(t, LAND + .1, LAND + .3), emoteAge: t - LAND,
        sq: spring(t, LAND, 8, 26) * .25 + faint * .06, nod: faint * .5, handL: [-2.8 - faint * .4, -4.0 + faint * .8], handR: [2.8 + faint * .4, -4.0 + faint * .8], handShapeL: 'open', handShapeR: 'open', boilKey: 'baby', htilt: Math.sin(t * 3) * .06 * (1 - faint) - faint * .3 };
      balHanuman(X, Y, u, o);
      dust(X, Y + 10, t - LAND, 'ldust');
      if (t > LAND + .3) { const [jx, jy] = bhJaw(X, Y, u, o); emote('spark', jx + 70, jy - 20, 16, seg(t, LAND + .4, LAND + .6) * (1 - faint), t - LAND); }
    }
    camEnd();
    if (t > I0 - .2) { const k = seg(t, I0 - .2, I0); boilSeed('gust'); for (let i = 0; i < 14; i++) { const y = 200 + hash(i * 3) * 1500; inkLine([[-100 + k * 1300, y], [-100 + k * 1300 - 500, y + 30]], 3, '#FFFFFF', 'dry', .2); } }
    caps(t);
  }

  // ================= I · Vayu: worried, furious, into the cave; the air STOPS =================
  function shotVayu(t, lt) {
    camK(t, [[I0, [560, 1060, 1]], [ANGRY, [520, 1080, 1.08]], [36.9, [560, 1100, 1.0]]]);
    peakSet(t, { day: 1 - seg(t, ANGRY, STOP) * .5, cave: true });
    surya(820, 420, 70, { key: 'hsun', eyes: t < ANGRY ? 'wide' : 'wide', mouth: 'O', sweat: 1, glowK: .7 * (1 - seg(t, ANGRY, STOP) * .5) });
    const X = 540, Y = 1300, u = 34;
    // Vayu swoops in from the top left, scoops him up, then (angry) carries him into the cave
    const inK = easeOut(seg(t, VAYU, VAYU + .65)), cave = easeIn(seg(t, 36.9, 37.55));
    const vx = lerp(-250, 430, inK) + lerp(0, 450, cave), vy = lerp(300, 1180, inK) + lerp(0, 480, cave), vs = lerp(1, .35, cave);
    const vface = emotions(t, [[VAYU, 'surprised', { eyes: 'wide', mouth: 'O', emote: null }], [VAYU + .8, 'sad', { eyes: 'teary', mouth: 'wobble', emote: null, tint: null }], [ANGRY, 'furious', { emote: 'steam' }]], { take: .6 });
    const held = t > VAYU + .6;
    if (!held) balHanuman(X, Y, u, { pose: 'sit', eyes: 'closed', mouth: 'flat', jaw: 1, plaster: true, tail: 'droop', tailSway: 0, nod: .5, htilt: -.3, sq: .06, handL: [-3.2, -3.2], handR: [3.2, -3.2], boilKey: 'baby' });
    if (cave < 1) {
      vayu(vx, vy, 44 * vs, { ...vface, pack: false, speed: inK < 1 ? .8 : cave > 0 ? .9 : 0, aL: held ? -.05 : -.35, aR: held ? .05 : -.25, boilKey: 'vayu', glowK: .3 });
      if (held) {   // the baby held against his chest, limp, head resting
        const bx = vx + 40 * vs, by = vy + 30 * vs;
        balHanuman(bx, by, u * .78 * vs, { pose: 'sit', eyes: 'closed', mouth: 'flat', jaw: 1, plaster: true, tail: 'droop', tailSway: 0, nod: .5, htilt: -.35, handL: [-2.9, -3.4], handR: [2.9, -3.4], noShadow: true, boilKey: 'baby' });
      }
    }
    if (t > 37.2) { boilSeed('cavedark'); paint([[770, 1740], [780, 1610], [825, 1525], [885, 1500], [945, 1535], [975, 1625], [980, 1740]], { wash: SK.cave, washOp: 255 * seg(t, 37.2, 37.6), ink: SK.ink, sw: 1.3, curv: .5 }); }
    camEnd();
    caps(t);
  }
  function shotFrozen(t, lt) {
    // no air: a still grey sky; everyone holds their breath and turns blue; a leaf hangs in mid-air
    const b = ease(seg(t, STOP + .3, J0 - .3));
    gradBands(['#9AA4B6', '#B8C0CC', '#D4D8DE'], -80, H + 80, 'fsky');
    camK(t, [[STOP, [540, 1000, 1.08]], [J0, [540, 1000, 1.0]]]);
    surya(790, 800, 150, { key: 'fsun', eyes: 'puff', mouth: 'puff', sweat: 1, glowK: .4 * (1 - b * .6), rot: 0 });
    cloud(430, 1640, 340, { key: 'fcl', col: '#E8ECF2', dk: '#B8C0CC' });
    airavata(400, 1620, 33, { trunk: 'limp', eyes: 'wide', puff: 1, tint: '#6A8AD8', tintK: .2 + b * .6, ear: 0, earOut: 0, sweat: 1, boilKey: 'fair',
      indra: { eyes: 'wide', mouth: 'puff', puff: 1, tint: '#6A8AD8', tintK: .2 + b * .6, vajra: 0, handL: [-1.6, -4.0], handR: [1.6, -4.0], sweat: 1 } });
    rahu(840, 1330, 36, { eyes: 'wide', mouth: 'O', puff: 1, tint: '#6A8AD8', key: 'frahu' });
    // a leaf, stuck in mid-air; a bird flapping without moving
    boilSeed('fleaf');
    push(); translate(240, 820); rotate(.5); paint([[0, 0], [30, -22], [70, -24], [96, -8], [70, 8], [30, 8]], { wash: SK.leaf, ink: SK.ink, sw: 1, curv: .5 }); pop();
    bird(860, 900, 30, { key: 'fbird', eye: 'wide', flap: t * 6 });
    if (t > STOP + .5) emote('sweat', 660, 900, 30, 1, t - STOP);
    camEnd();
    caps(t);
  }

  // ================= J · Brahma, the boons =================
  function shotBrahma(t, lt) {
    // the cave, lit gold by Brahma: a round opening of warm light inside dark rock
    const g = ease(seg(t, BRAHMA, BRAHMA + .5));
    gradBands([mixCol('#2A2438', '#7A4A50', g), mixCol('#3A3050', '#B07A5A', g), mixCol('#2A2438', '#8A5A50', g)], -80, H + 80, 'bcave');
    camK(t, [[J0, [540, 1060, 1]], [BOONS, [540, 1080, 1.04]], [GARLAND, [540, 1090, 1.1]], [K0, [540, 1090, 1.12]]]);
    if (g > 0) glow(760, 860, 700, '#FFD98A', .7 * g);
    boilSeed('bwalls');
    irisShape(ellPts(540, 1120, 640, 980, 40), mixCol('#1E1828', '#3A2A30', g));
    inkLine(ellPts(540, 1120, 640, 980, 40).concat([ellPts(540, 1120, 640, 980, 40)[0]]), 2.4, mixCol('#3A3050', '#6A4A40', g), 'dry', .4);
    for (const [x0, y0, l] of [[330, 190, 70], [430, 160, 50], [640, 160, 60], [760, 200, 46]]) paint([[x0 - 22, y0], [x0 + 22, y0], [x0, y0 + l]], { wash: '#2A2232', ink: null });
    const wind = t > PHEW;
    if (wind) { boilSeed('bwind'); for (let i = 0; i < 8; i++) { const y = 800 + hash(i * 3) * 900, x = frac(hash(i) + t * .9) * 1500 - 200; inkLine([[x, y], [x + 160, y - 20], [x + 260, y + 10]], 2, '#FFF4DC', 'inkfine', .6); } }
    // Brahma on his lotus, up right
    if (t > BRAHMA) { const pk = backOut(seg(t, BRAHMA, BRAHMA + .4)); push(); translate(760, 1160); scale(pk); translate(-760, -1160); brahma(760, 1160, 1.3, { glow: g, eyes: t > TOUCH - .3 ? 'open' : 'closed', bless: ease(seg(t, TOUCH - .4, TOUCH)) * (1 - seg(t, BOONS, BOONS + .4)), lookX: -1 }); pop(); }
    // Vayu holds him (sulking) on the left, then lets him float onto a little cloud
    const vf = emotions(t, [[J0, 'angry', { eyes: 'angry', mouth: 'frown', emote: null, tint: null }], [BRAHMA + .4, 'sad', { eyes: 'teary', mouth: 'wobble', emote: null, tint: null }], [WAKE + .3, 'happy', { emote: 'hearts' }]], { take: .5 });
    const VX = 290, VY = 1330;
    vayu(VX, VY, 44, { ...vf, pack: false, aL: -.05, aR: .05, boilKey: 'vayu', tail: t * .6 });
    const free = ease(seg(t, BOONS - .55, BOONS - .05));
    const bx = lerp(VX + 40, 560, free), by = lerp(VY + 30, 1520, free) - Math.sin(free * Math.PI) * 120, u = lerp(34 * .78, 40, free);
    if (free > 0) cloud(560, 1550, 170 * free, { key: 'bcl' });
    const awake = t >= WAKE;
    const face = !awake ? { eyes: 'closed', mouth: 'flat' } : emotions(t, [[WAKE, 'neutral', { eyes: 'closed', mouth: 'yawn', mouthK: 1, emote: null }], [WAKE + .45, 'surprised', { eyes: 'wide', mouth: 'O', emote: null }], [PHEW, 'happy', { eyes: 'happy', mouth: 'grin', emote: null }], [44.9, 'proud', { eyes: 'happy', mouth: 'grin', emote: 'spark', tint: null }]], { take: .5 });
    const glowB = [BOONS, BOONS + .4, BOONS + .8, BOONS + 1.2].reduce((s2, e) => s2 + Math.max(0, 1 - Math.abs(t - e - .25) * 4), 0);
    const flex = t > 44.9;
    const o = { ...face, pose: 'sit', jaw: 1, plaster: t < TOUCH, boilKey: 'baby', seed: 1, tail: awake ? 'curl' : 'droop', noShadow: true, dy: free > .99 ? (face.dy || 0) * .3 : 0, sq: (face.sq || 0) * .4,
      nod: awake ? 0 : .5, htilt: awake ? 0 : -.35,
      garland: ease(seg(t, GARLAND + .25, GARLAND + .55)), glowK: Math.min(1, glowB) * .9 + (t > BOONS ? .25 : 0),
      handL: flex ? [-2.4, -10.6] : awake ? [-2.6, -4.4] : [-2.9, -3.4], handR: flex ? [4.0, -9.4] : awake ? [2.6, -4.4] : [2.9, -3.4], handShapeL: flex ? 'fist' : 'open', handShapeR: flex ? 'fist' : 'open', blush: awake ? .5 : 0 };
    delete o.aL; delete o.aR; delete o.dx; delete o.rot;
    balHanuman(bx, by, u, o);
    if (inW(t, TOUCH, TOUCH + .5)) { const [jx, jy] = bhJaw(bx, by, u, o); emote('spark', jx + 30, jy - 10, 22, seg(t, TOUCH, TOUCH + .15) * (1 - seg(t, TOUCH + .35, TOUCH + .5)), t - TOUCH); }
    // Brahma's touch: a spark from his blessing hand to the baby
    if (inW(t, TOUCH - .3, TOUCH + .05)) { const k = seg(t, TOUCH - .3, TOUCH), [px, py] = arcPt([760 + 86, 1160 - 230], bhHead(bx, by, u, o), 80, k); glow(px, py, 70, '#FFF0B0', 1); paint(starPts(px, py, 22, .4, 4, t * 6), { wash: '#FFF6C8', ink: null }); }
    // the boons: four sparks from four sides (Surya's light, Varuna, Yama, Kubera)
    const from = [[760, 820], [540, 420], [60, 1000], [1020, 1250]], cols = ['#FFE08A', '#FFC24A', '#8AD0F0', '#D8B0F0'];
    from.forEach((f, i) => {
      const t0 = BOONS + i * .4, k = seg(t, t0, t0 + .3); if (k <= 0 || k >= 1) return;
      const [px, py] = arcPt(f, bhBelly(bx, by, u, o), 60, easeIn(k));
      boilSeed('boon' + i); glow(px, py, 80, cols[i], 1); paint(starPts(px, py, 26, .4, 4, t * 5 + i), { wash: '#FFF8DE', ink: null });
    });
    // Indra's garland drops from above onto his neck
    if (inW(t, GARLAND - .3, GARLAND + .3)) {
      const k = easeIn(seg(t, GARLAND - .3, GARLAND + .25)), [hx, hy] = bhHead(bx, by, u, o);
      boilSeed('gfall');
      for (let i = 0; i < 9; i++) { const a = Math.PI * (1 - i / 8), gx = hx + Math.cos(a) * 90, gy = lerp(hy - 600, hy + 150, k) + Math.sin(a) * 80; paint(starPts(gx, gy, 20, .5, 5, i), { wash: '#F6B23A', ink: SK.ink, sw: .6 }); }
    }
    camEnd();
    if (t < J0 + .3) flash(1 - seg(t, J0, J0 + .3), '#FFF3D0');
    caps(t);
  }

  // ================= K · the name =================
  function shotName(t, lt) {
    gradBands(['#F7C27A', '#FFE0A8', '#FFF0D2'], -80, H + 80, 'nsky');
    for (let i = 0; i < 4; i++) cloud(120 + i * 300, 1500 + (i % 2) * 120, 140, { key: 'ncl' + i, col: '#FFF8EA', dk: '#F6D7A8', ink: false });
    const push2 = ease(seg(t, NAME, NAME + .8));
    camK(t, [[K0, [560, 1100, 1]], [NAME, [540, 1100, 1.02]], [NAME + .8, [470, 1150, 1.22]], [L0, [470, 1150, 1.25]]]);
    // Indra (sorry, then proud of the name) on the right
    cloud(760, 1560, 170, { key: 'icl2', col: '#FFF8EA', dk: '#F6D7A8' });
    const point = seg(t, HANU + .3, HANU + .6) * (1 - seg(t, NAME + .2, NAME + .5));
    indra(760, 1490, 50, { eyes: t < NAME ? 'sad' : 'happy', mouth: t < NAME ? 'sheepish' : 'smile', bow: t < NAME ? .25 : 0, lookX: -1, vajra: 0,
      handR: [1.8, -4.4], handL: point > 0 ? [lerp(-1.6, -3.6, point), lerp(-.4, -4.4, point)] : [-1.6, -.4], sweat: t < NAME ? 1 : 0, boilKey: 'indraK' });
    // the baby on his cloud, the garland on; he pats his jaw, then beams
    cloud(430, 1520, 190, { key: 'bcl2' });
    const face = emotions(t, [[K0, 'neutral', { eyes: 'normal', mouth: 'O', emote: null, lookX: .8 }], [HANU + .6, 'surprised', { eyes: 'wide', mouth: 'O', emote: null, lookX: .6 }], [NAME + .35, 'proud', { eyes: 'happy', mouth: 'grin', emote: 'spark', tint: null }]], { take: .6 });
    const pat = t > HANU + .6 ? 1 : 0;
    const o = { ...face, pose: 'sit', jaw: 1, garland: 1, boilKey: 'baby', seed: 1, tail: 'curl', dy: (face.dy || 0) * .3, sq: (face.sq || 0) * .4, blush: .5,
      handR: pat ? [3.4, -10.2 + Math.sin(t * 10) * .25 * (t < NAME ? 1 : 0)] : [2.6, -4.4], handShapeR: pat ? 'open' : 'open', handL: t > NAME + .35 ? [-3.2, -9.6] : [-2.6, -4.4], handShapeL: t > NAME + .35 ? 'fist' : 'open' };
    delete o.aL; delete o.aR; delete o.dx; delete o.rot;
    balHanuman(430, 1480, 38, o);
    if (t > NAME + .35) { const k = seg(t, NAME + .35, NAME + .8); boilSeed('nsparks'); const [hx, hy] = bhHead(430, 1480, 38, o); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + t, r = 250 + k * 40; paint(starPts(hx + Math.cos(a) * r, hy + Math.sin(a) * r * .8, 16 * k, .4, 4), { wash: '#FFF2B8', ink: null }); } }
    camEnd();
    if (t > L0 - .25) { flushLetters(); brushWipe((t - (L0 - .25)) / .5, ['#F39A2E', '#FFC24A']); }
    caps(t);
  }

  // ================= L · the clearing again: a real mango, the sun winks =================
  function shotMango(t, lt) {
    camK(t, [[L0, [540, 980, 1.02]], [CHOMP, [520, 1000, 1.1]], [WIPE, [520, 1000, 1.12]]]);
    clearingSet(t, { sky: 1, shift: 200, sun: () => surya(800, 960, 115, { key: 'msun', eyes: inW(t, WINK, WINK + .45) ? 'wink' : t > GRAB + .3 ? 'open' : 'happy', mouth: t > WINK ? 'grin' : 'smile', lookX: -.6, lookY: .5, glowK: .9 }) });
    const X = 470, Y = 1560, u = 48;
    // Maa's basket slides in from the left
    const bk = easeOut(seg(t, BASKET, BASKET + .4)), bxp = lerp(-250, 170, bk);
    basket(bxp, 1680, 120, 4, 'mbask');
    const face = emotions(t, [[L0, 'surprised', { eyes: 'wide', mouth: 'O', emote: null, lookX: -1, lookY: .5 }], [GRAB, 'love', { eyes: 'sparkle', mouth: 'cat', emote: null, tint: null, lookX: .6, lookY: -.6 }], [CHOMP, 'happy', { eyes: 'happy', mouth: 'chew', emote: 'hearts', tint: null }]], { take: .5 });
    // grab one (right hand), hold it up beside the sun to compare, then CHOMP
    const lift = ease(seg(t, GRAB, GRAB + .35)), up = ease(seg(t, GRAB + .35, GRAB + .75)) * (1 - ease(seg(t, CHOMP - .35, CHOMP - .05)));
    const toMouth = ease(seg(t, CHOMP - .35, CHOMP - .05));
    let hR = t < GRAB - .2 ? [2.6, -4.4] : [lerp(-3.8, 2.8, lift) + up * 1.2, lerp(-2.6, -8.0, lift) - up * 5.0];
    if (toMouth > 0) hR = [lerp(hR[0], 1.9, toMouth), lerp(hR[1], -10.0, toMouth)];
    const hL = t > CHOMP - .2 ? [-1.2, -9.4] : [-1.6, -5.2];
    const o = { ...face, pose: 'sit', jaw: .7, garland: 1, boilKey: 'baby', seed: 1, tail: 'curl', dy: (face.dy || 0) * .3, sq: (face.sq || 0) * .4 + (t > CHOMP ? spring(t, CHOMP, 7, 24) * .06 : 0), blush: .5,
      handL: hL, handR: hR, handShapeL: 'open', handShapeR: t > GRAB ? 'hold' : 'open', handAR: t > GRAB ? -Math.PI / 2 : undefined, puff: t > CHOMP ? .35 + .1 * Math.sin(t * 14) : 0 };
    delete o.aL; delete o.aR; delete o.dx; delete o.rot;
    if (t > GRAB - .2) o.held = (uu) => mango((hR[0] + .2) * uu, (hR[1] - 1.1) * uu, uu * 1.05, { key: 'hmango', bite: t > CHOMP, rot: .15 });
    balHanuman(X, Y, u, o);
    camEnd();
    if (t > WIPE) { flushLetters(); brushWipe((t - WIPE) / .6, ['#F39A2E', SK.rkOrange]); }
    caps(t);
  }

  // ================= the card =================
  function shotCard(t, lt) {
    followCard(t, { card: CARD, follow: FOLLOW, pill: PILL, baby: () => {
      const wave = Math.sin(t * 9) * .7;
      balHanuman(470, 1235, 25, { pose: 'sit', eyes: 'happy', mouth: 'grin', jaw: .5, garland: 1, blush: .5, handR: [3.6 + wave * .3, -11.5 + wave], handShapeR: 'open', handL: [-1.6, -7.2], handShapeL: 'hold',
        held: (uu) => mango(-1.6 * uu, -8.2 * uu, uu * 1.3, { key: 'cmango', bite: true, rot: -.2 }), boilKey: 'cbaby', seed: 2, dy: -Math.abs(Math.sin(t * 4)) * .3 });
    } });
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, ['#F39A2E', SK.rkOrange]); }
  }

  shots([[0, shotClearing], [C0, shotFly], [D0, shotSun], [G0, shotIndra], [H0, shotFall], [I0, shotVayu], [STOP, shotFrozen], [J0, shotBrahma], [K0, shotName], [L0, shotMango], [CARD, shotCard]]);
})();
