// panch.js: "HANUMAN JI has 5 FACES. Only ONE is a monkey." (ad 55, Panchmukhi Hanuman): the Ahiravana legend. Ravana's
// brother, the sorcerer-king of Patala, steals the sleeping Ram and Lakshman; Hanuman dives after them, gets past his
// own son Makardhwaja (half vanara, half fish), finds Ahiravana's life in five lamps in five directions, and grows four
// more faces to blow them all out at once. Then what each face blesses, and the ask. Storyboard: STORYBOARD.md. Sets
// and props: panch_props.js; the faces, Makardhwaja and Ahiravana: src/panchmukhi.js. All times are video time (t);
// the SFX (tools/panch_sfx.mjs) uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/panch_sfx.mjs)
  const POPOFF = 3.5, WIPE1 = 5.6;
  const RISE = 6.2, LAUGH = 7.4, MAGIC = 9.0, BUBBLE = 9.4, FLOAT = 10.1, SINK = 12.1, CLOSE = 13.5, WIPE2 = 14.7;
  const WALKIN = 14.9, PEEK = 15.9, TAKE = 16.4, LOOKH = 17.5, CROUCH = 18.3, LEAP = 18.6, FALL = 18.9, LANDG = 21.0;
  const GUARD = 21.3, SON = 24.0, HTAKE = 24.6, SWEAT = 26.5, FIGHT = 29.6, TIED = 30.5, WIPE3 = 32.4;
  const SECRET = 32.6, ONCE = 36.0, PEEKH = 39.0, STEP = 41.5, GLOW = 41.6, P_N = 42.4, P_G = 43.3, P_V = 44.2, P_H = 45.1,
    PANCH = 46.1, REACT = 47.4, INHALE = 48.6, HUSH = 49.5, BLOW = 49.9, OUT = 50.3, KO = 50.6, POOF = 51.6, ALL = 51.2,
    SAVED = 53.4, WIPE5 = 57.0, BLESS = 57.2, ASK = 61.4, WIPE6 = 64.6;
  const CARD = 64.9, CARD_CAP = 65.0, COVERS = 65.2, PRICE = 66.0, LOGO = 66.3, PILL = 66.6, FOLLOW = 67.0;

  const GOLDC = '#F5C542';
  const inW = (t, a, b) => t >= a && t < b;
  // a face timeline: the latest key wins, with a quick squint across every change so nothing snaps
  function acts(t, keys) {
    let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
    let sq = 0; for (const [k] of keys) sq = Math.max(sq, 1 - Math.abs(t - k) / .07);
    return { ...keys[i][1], squint: Math.max(keys[i][1].squint || 0, sq * .9) };
  }
  const camAt = (t, K) => {
    let i = 0; while (i + 1 < K.length && t >= K[i + 1][0]) i++;
    if (i + 1 >= K.length) return K[i][1];
    const [t0, a] = K[i], [t1, b] = K[i + 1], k = ease(seg(t, t0, t1));
    return a.map((v, j) => lerp(v, b[j], k));
  };
  const FACES = ['narasimha', 'garuda', 'varaha', 'hayagriva'];

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['HANUMAN JI HAS', 480, -1, POPOFF + 1 - .1, 78], ['5 FACES.', 600, -1, POPOFF + 1 - .1, 132, GOLDC], ['Only ONE is a monkey.', 718, -1, POPOFF + 1 - .1, 64],
    ['It all began with', 520, POPOFF, WIPE1 - .3 - POPOFF, 70], ['a KIDNAPPING.', 630, POPOFF + .15, WIPE1 - .45 - POPOFF, 108, GOLDC],
    ['During the LANKA war,', 470, 5.8, 3.1, 62], ["RAVANA's brother AHIRAVANA,", 560, 5.95, 2.95, 62, GOLDC], ['king of PATALA, came up.', 650, 6.1, 2.8, 62],
    ['With his MAGIC, he stole', 470, MAGIC, SINK - MAGIC - .05, 62], ['RAM and LAKSHMAN', 570, MAGIC + .15, SINK - MAGIC - .2, 84, GOLDC], ['while they SLEPT.', 670, MAGIC + .3, SINK - MAGIC - .35, 62],
    ['Down to PATALA,', 500, SINK + .05, WIPE2 - .35 - SINK, 74, GOLDC], ['to SACRIFICE them!', 600, SINK + .2, WIPE2 - .5 - SINK, 74],
    ['At dawn, HANUMAN found', 480, WALKIN + .2, LOOKH - WALKIN - .2, 64], ['the hut EMPTY!', 590, WALKIN + .35, LOOKH - WALKIN - .35, 100, GOLDC],
    ['He dove after them,', 520, FALL + .1, LANDG - FALL - .1, 64], ['down to PATALA!', 620, FALL + .25, LANDG - FALL - .25, 92, GOLDC],
    ['At the gate stood a guard:', 470, GUARD, SON - GUARD - .05, 62], ['HALF VANARA, HALF FISH!', 575, GUARD + .3, SON - GUARD - .35, 80, GOLDC],
    ['A drop of his sweat fell in the sea,', 1330, SWEAT + .1, FIGHT - SWEAT - .15, 52], ['and a FISH swallowed it!', 1420, SWEAT + .3, FIGHT - SWEAT - .35, 72, GOLDC],
    ['Hanuman tied him up…', 480, TIED + .1, WIPE3 - .35 - TIED - .1, 70], ['and went in.', 585, TIED + .5, WIPE3 - .35 - TIED - .5, 70],
    ["AHIRAVANA's LIFE was hidden", 470, SECRET, ONCE - SECRET - .05, 62], ['in FIVE LAMPS,', 570, SECRET + .2, ONCE - SECRET - .25, 86, GOLDC], ['in FIVE DIRECTIONS.', 670, SECRET + .4, ONCE - SECRET - .45, 70],
    ['Blow out all FIVE at ONCE…', 480, ONCE, PEEKH - ONCE - .05, 64], ['or he could NEVER die.', 585, ONCE + .3, PEEKH - ONCE - .35, 76, GOLDC],
    ['ONE mouth.', 1300, PEEKH + .1, STEP - PEEKH - .15, 92], ['FIVE lamps.', 1410, PEEKH + .6, STEP - PEEKH - .65, 104, GOLDC],
    ['PANCHMUKHI', 470, PANCH, REACT - PANCH, 120, GOLDC], ['HANUMAN!', 590, PANCH + .15, REACT - PANCH - .15, 120, GOLDC],
    ['ALL FIVE.', 500, ALL, SAVED - ALL - .05, 112, GOLDC], ['In ONE breath.', 615, ALL + .35, SAVED - ALL - .4, 80],
    ['RAM & LAKSHMAN were SAVED,', 1230, SAVED + .2, WIPE5 - .35 - SAVED - .2, 62, GOLDC], ['and MAKARDHWAJA became', 1320, SAVED + .4, WIPE5 - .35 - SAVED - .4, 60], ['KING of PATALA.', 1410, SAVED + .6, WIPE5 - .35 - SAVED - .6, 72, GOLDC],
    ['Each FACE gives', 480, BLESS, ASK - BLESS - .05, 70], ['a BLESSING:', 580, BLESS + .15, ASK - BLESS - .2, 84, GOLDC],
    ['Which FACE do YOU', 480, ASK, WIPE6 - ASK, 74], ['need TODAY?', 580, ASK + .15, WIPE6 - ASK - .15, 92, GOLDC], ['Comment it!', 675, ASK + .35, WIPE6 - ASK - .35, 62],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };
  // a shout (speech, a label) in screen space: pops, wobbles, fades at the end of its life
  function shout(txt, x, y, size, age, life, o = {}) {
    if (age < 0 || age > life) return;
    letter(txt, x, y, size, o.col || GOLDC, { screen: true, pop: age * 5, rot: (o.rot ?? -.04) + Math.sin(age * 18) * .025 * clamp(1 - age), alpha: 1 - seg(age, life - .2, life), stroke: PC.ink, sw: .22, ink: false, maxW: o.maxW ?? 900 });
  }

  // ================= 1: the hook =================
  const BX = 540, BY = 1958, BU = 38;                 // the bust on the halo (hook, slate, ask)
  function bustFaces(t, o = {}) {
    const F = {};
    FACES.forEach((k, i) => {
      const blinkAt = (t * .7 + i * .37) % 2.6 < .1;
      F[k] = { mouth: 'smile', eyes: blinkAt ? 'closed' : 'normal', seed: i * 2.3, lookY: k === 'hayagriva' ? -.5 : 0, blush: .35, ...(o[k] || {}) };
    });
    return F;
  }
  function shotHook(t, lt) {
    camBegin(540, 960, 1 + .012 * t);
    halo(t, { cx: 540, cy: 1150 });
    const F = bustFaces(t);
    FACES.forEach((k, i) => { const t0 = POPOFF + i * .25; if (t > t0) F[k].grow = 1 - seg(t, t0, t0 + .25); });
    const f = acts(t, [[-9, { eyes: 'normal', mouth: 'smile' }], [POPOFF + 1.2, { eyes: ['normal', 'closed'], mouth: 'grin' }], [POPOFF + 1.6, { eyes: 'happy', mouth: 'grin' }]]);
    const o = { ...f, blush: .35, faces: F, gada: 1, htilt: Math.sin(t * 1.6) * .03, boilKey: 'bust', seed: 1 };
    o.dy = -spring(t, POPOFF + 1.2, 7, .4) * .3;
    panchmukhi(BX, BY, BU, o);
    FACES.forEach((k, i) => { const t0 = POPOFF + i * .25 + .2; if (t > t0 && t < t0 + .8) { const p = toScreen(...pmFaceAt(BX, BY, BU, { ...o, faces: { [k]: { grow: 1 } } }, k)); camEnd(); sparkleBurst(p[0], p[1], 60, t - t0, 'pop' + k); camBegin(540, 960, 1 + .012 * t); } });
    camEnd();
    shout('From the Ahiravana legend', 540, 1455, 40, t + 1, WIPE1 - .3 + 1, { col: PC.cream, rot: -.02 });
    caps(t);
    if (t > WIPE1 - .3) { flushLetters(); brushWipe((t - (WIPE1 - .3)) / .6, ['#1C2450', '#33427E']); }
  }

  // ================= 2: the camp at night =================
  const HUTX = 300, HUTY = 1430, HUTS = 200;          // the hut
  const AX = 770, AY = 1470, AU = 19;                 // Ahiravana on his portal
  const RLU = 8.2, RX = 255, LX = 350, RLY = 1425;    // Ram and Lakshman asleep inside
  const CAM2 = [[WIPE1, [540, 1180, 1.3]], [WIPE2, [550, 1200, 1.38]]];
  function sleepers(x, y, u, t, key, o = {}) {   // Ram and Lakshman sitting asleep, leaning on each other
    const zz = (o.zzz ?? 1) > 0;
    ram(x - 48 * u / RLU, y, u, { sit: 1, eyes: 'closed', mouth: 'smile', htilt: .22 + Math.sin(t * 1.4) * .04, kodanda: false, emote: zz ? 'zzz' : undefined, emoteK: 1, emoteAge: t, boilKey: key + 'r', seed: 4, ...(o.ram || {}) });
    lakshman(x + 48 * u / RLU, y, u, { sit: 1, eyes: 'closed', mouth: 'smile', htilt: -.2 + Math.sin(t * 1.4 + 1) * .04, kodanda: false, boilKey: key + 'l', seed: 5, ...(o.lak || {}) });
  }
  function bubblePos(t) {   // where the sleepers' bubble is, and its scale
    const k = ease(seg(t, FLOAT, FLOAT + 1.4)), p = arcPt([HUTX, HUTY - 80], [AX - 210, AY - 330], 140, k), bob = Math.sin(t * 3) * 10 * k;
    const s = 1 - easeIn(seg(t, SINK, SINK + 1.2)), down = easeIn(seg(t, SINK, SINK + 1.2));
    return [lerp(p[0], AX, down), lerp(p[1] + bob, AY, down), s];
  }
  function ahira(t, x, y, u, o = {}) {   // Ahiravana's state in the camp
    const f = acts(t, [
      [-9, { eyes: 'angry', mouth: 'grin', lookX: -.6 }], [LAUGH, { eyes: 'happy', mouth: 'laugh' }],
      [MAGIC - .2, { eyes: 'angry', mouth: 'smirk', lookX: -1 }], [FLOAT + .5, { eyes: 'happy', mouth: 'laugh', lookX: -.5 }],
      [SINK, { eyes: 'angry', mouth: 'grin', lookX: 0 }],
    ]);
    const cast = inW(t, MAGIC - .2, FLOAT + 1.4) ? ease(seg(t, MAGIC - .2, MAGIC + .1)) : 0;
    return { kind: 'ahiravana', ...f, handR: cast ? [lerp(4.2, -6.5, cast), lerp(-9.5, -15.5, cast)] : undefined, sword: false, fistR: !cast,
      shake: inW(t, LAUGH, LAUGH + 1.2) ? .5 : 0, boilKey: 'ahira', seed: 3, ...o };
  }
  function shotCamp(t, lt) {
    const [cx, cy, z] = camAt(t, CAM2);
    camBegin(cx, cy, z);
    camp(t, { gy: 1380 });
    const sleeping = t < BUBBLE + .15;
    hut(HUTX, HUTY, HUTS, t, { inside: () => { if (sleeping) sleepers(HUTX, RLY, RLU, t, 'in'); } });
    // the portal: opens before he rises, closes after the sink
    const pk = t < CLOSE ? ease(seg(t, RISE - .3, RISE + .1)) : (t < CLOSE + .4 ? 1 - ease(seg(t, CLOSE, CLOSE + .4)) : -1);
    portal(AX, AY, 170, pk, t);
    // Ahiravana pops up out of the ground, then sinks back
    if (t > RISE) {
      const up = backOut(seg(t, RISE, RISE + .6)), dn = easeIn(seg(t, SINK + .2, SINK + 1.3)), k = up * (1 - dn);
      if (k > .01) {
        push(); translate(AX, AY); scale(1, k); translate(-AX, -AY);
        asura(AX, AY, AU, ahira(t, AX, AY, AU, { noShadow: true }));
        pop();
        if (cast(t)) magicDust(t);
      }
      sparkleBurst(AX, AY - 200, 90, t - RISE, 'rise', 10, [PC.vioLt, '#FFE39A']);
    }
    // the sleepers' bubble
    if (!sleeping) {
      const [bx, by, s] = bubblePos(t);
      if (s > .02) {
        push(); translate(bx, by); scale(s); translate(-bx, -by);
        const g = backOut(seg(t, BUBBLE, BUBBLE + .4));
        sleepers(bx, by + 95, RLU, t, 'bub');
        push(); translate(bx, by); scale(g); translate(-bx, -by); bubble(bx, by, 150, t); pop();
        pop();
      }
    }
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, ['#1C2450', '#33427E']); }
    if (t > WIPE2 - .3) { flushLetters(); brushWipe((t - (WIPE2 - .3)) / .6, [PC.dawnSky, PC.dawnLt]); }
  }
  const cast = t => inW(t, MAGIC, BUBBLE + .5);
  function magicDust(t) {   // violet sparkles from his hand to the hut
    boilSeed('magic dust');
    const from = mahishHand(AX, AY, AU, ahira(t, AX, AY, AU), 1), to = [HUTX + 20, HUTY - 90];
    for (let i = 0; i < 12; i++) {
      const q = frac((t - MAGIC) * 1.6 + i / 12), p = arcPt(from, to, 120, q);
      paint(starPts(p[0] + Math.sin(i * 3 + t * 8) * 10, p[1], 10 + 6 * hash(i), .35, 4), { wash: i % 2 ? PC.vioLt : '#FFE39A', ink: null });
    }
    glow(from[0], from[1], 70, PC.vioGlow, .6);
  }

  // ================= 3: dawn, the empty hut =================
  const HX0 = 1180, HX1 = 560, HY3 = 1470, HU3 = 19;
  const CAM3 = [[WIPE2, [600, 1180, 1.3]], [PEEK, [470, 1200, 1.42]], [LOOKH, [470, 1200, 1.42]], [CROUCH, [640, 1220, 1.32]]];
  function hn3(t) {   // Hanuman: walks in, peeks, the take, looks at the hole, leaps
    const wk = seg(t, WALKIN, PEEK), x = lerp(HX0, HX1, ease(wk));
    const f = acts(t, [
      [-9, { eyes: 'normal', mouth: 'smile', lookX: -.5 }], [PEEK, { eyes: 'look', mouth: 'smile', lookX: -1 }],
      [TAKE, { eyes: 'wide', mouth: 'scream', lookX: -1, brow: 1 }], [LOOKH + .2, { eyes: 'look', mouth: 'flat', lookX: 1, lookY: .6 }],
      [LOOKH + .8, { eyes: 'angry', mouth: 'flat', lookX: 1, lookY: .5, brow: -1 }],
    ]);
    const tk = take(t, TAKE, 1.1), crouch = ease(seg(t, CROUCH, LEAP)) * (1 - seg(t, LEAP, LEAP + .08));
    const o = { ...f, gada: 1, walk: wk > 0 && wk < 1 ? t * 1.6 : undefined, hx: t < LOOKH ? -.6 : .6, lean: t > PEEK && t < TAKE ? -.6 : 0,
      emote: inW(t, TAKE, LOOKH) ? '!!' : undefined, emoteK: 1, emoteAge: t - TAKE, sq: tk.sq + crouch * .18, dy: tk.dy, boilKey: 'hn3', seed: 1 };
    let X = x, Y = HY3;
    if (t > LEAP) { const k = easeIn(seg(t, LEAP, FALL)), p = arcPt([HX1, HY3], [AX, AY - 40], 260, k); X = p[0]; Y = p[1]; o.rot = k * 2.4; o.sq = -.12; o.noShadow = true; }
    return [X, Y, o];
  }
  function shotDawn(t, lt) {
    const [cx, cy, z] = camAt(t, CAM3);
    camBegin(cx, cy, z);
    camp(t, { gy: 1380, dawn: 1 });
    hut(HUTX, HUTY, HUTS, t, { dawn: 1 });
    portal(AX, AY, 170, -1, t);
    const [x, y, o] = hn3(t);
    hanuman(x, y, HU3, o);
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [PC.dawnSky, PC.dawnLt]); }
  }

  // ================= 4–5: down through the earth, the gate =================
  const GX = 340, GYF = 1500, GHU = 19;               // Hanuman at the gate
  const MX = 770, MU = 21;                          // Makardhwaja
  const CAM5 = [[FALL, [540, -2300, 1.0]], [LANDG - .1, [540, 1060, 1.0]], [GUARD + .2, [540, 1060, 1.0]], [GUARD + .6, [740, 1270, 1.6]],
    [HTAKE - .25, [740, 1270, 1.6]], [HTAKE - .1, [360, 1160, 1.45]], [SWEAT, [360, 1160, 1.45]], [SWEAT + .5, [540, 1080, 1.0]],
    [TIED - .1, [540, 1080, 1.0]], [TIED + .3, [580, 1250, 1.35]]];
  function hn5(t) {
    if (t < LANDG) {   // falling head first, flipping upright just before he lands
      const [cx, cy] = camAt(t, CAM5), flip = easeOut(seg(t, LANDG - .45, LANDG - .1));
      return [GX + 60 * (1 - flip), lerp(cy - 150, GYF, flip), { eyes: 'angry', mouth: 'flat', brow: -1, gada: 1, rot: Math.PI * (1 - flip) + (1 - flip) * Math.sin(t * 7) * .1, noShadow: flip < 1, sq: flip < 1 ? -.15 : 0, boilKey: 'hn5', seed: 1 }];
    }
    const f = acts(t, [
      [-9, { eyes: 'angry', mouth: 'flat', brow: -1, lookX: 1 }], [GUARD + .4, { eyes: 'look', mouth: 'flat', lookX: 1 }],
      [HTAKE, { eyes: 'wide', mouth: 'scream', lookX: 1, brow: 1 }], [HTAKE + .9, { eyes: 'wide', mouth: 'O', lookX: .4, lookY: -.6, brow: 1 }],
      [SWEAT + .2, { eyes: 'closed', mouth: 'smile' }], [SWEAT + 1.6, { eyes: 'look', mouth: 'O', lookX: .5, lookY: -.8 }],
      [TIED, { eyes: 'happy', mouth: 'smile' }],
    ]);
    const land = spring(t, LANDG, 9, .5), tk = take(t, HTAKE, 1.2), walk = seg(t, TIED + 1.2, WIPE3);
    const pat = inW(t, TIED + .3, TIED + 1.2), patY = pat ? Math.abs(Math.sin((t - TIED) * 12)) * .5 : 0;
    const o = { ...f, gada: t < TIED ? 1 : 1, hx: t < SWEAT ? .5 : (t < TIED ? .2 : .4), sq: land * .25 + tk.sq, dy: tk.dy,
      emote: inW(t, HTAKE, SWEAT) ? '!?' : undefined, emoteK: 1, emoteAge: t - HTAKE, boilKey: 'hn5', seed: 1 };
    if (pat) { o.handL = [5.2, -16.4 + patY]; o.bendL = -.6; }
    if (walk > 0) o.walk = t * 1.6;
    return [lerp(GX, 600, ease(walk)), GYF, o];
  }
  function mk5(t) {
    const f = acts(t, [
      [-9, { eyes: 'angry', mouth: 'flat', lookX: -1 }], [GUARD + .4, { eyes: 'angry', mouth: 'grin', lookX: -.3 }],
      [SON, { eyes: 'happy', mouth: 'open', mouthK: .9 }], [SON + 1.2, { eyes: 'normal', mouth: 'grin', lookX: -1 }],
      [TIED, { eyes: 'sad', mouth: 'pout', lookX: -.6 }], [TIED + .5, { eyes: 'closed', mouth: 'pout', blush: .7 }],
    ]);
    const proud = inW(t, SON, SON + 1.6) ? ease(seg(t, SON, SON + .2)) : 0;
    const o = { ...f, spear: t < FIGHT ? 1 : 0, handR: [3.3, -7.4], handShapeR: 'fist', handL: proud ? [-1.6, -6.4] : [-2.6, -4.6], handShapeL: proud ? 'fist' : 'open',
      tailSway: t * (t > GUARD && t < SON ? 2.6 : 1.2), wiggle: inW(t, GUARD + .3, SON) ? Math.sin(t * 9) * .6 : 0, boilKey: 'mk5', seed: 2 };
    o.dy = -proud * .4 - (inW(t, GUARD + .3, SON) ? Math.abs(Math.sin(t * 9)) * .25 : 0);
    if (t > TIED) { o.rope = 1; o.spear = 0; o.handR = [2.4, -4.6]; o.handShapeR = 'open'; o.dy = 0; o.wiggle = 0; }
    return o;
  }
  function shotGate(t, lt) {
    const [cx, cy, z] = camAt(t, CAM5);
    camBegin(cx, cy, z);
    gate(t, { gy: GYF });
    strata(-2900, -120, t);
    const fighting = inW(t, FIGHT, TIED);
    if (!fighting) {
      makardhwaja(MX, GYF, MU, mk5(t));
      const [x, y, o] = hn5(t);
      hanuman(x, y, GHU, o);
      if (t > LANDG && t < LANDG + .6) { boilSeed('land dust'); for (let i = 0; i < 6; i++) { const a = (t - LANDG) / .6, s = i < 3 ? -1 : 1; paint(ellPts(GX + s * (60 + a * 160) + (i % 3) * 30 * s, GYF - 20 - a * 40, 40 * (1 - a) + 10, 26 * (1 - a) + 6, 10), { fill: PC.dust, fillOp: 200 * (1 - a), bleed: .2, tex: .3, ink: null }); } }
    } else fightCloud(560, GYF - 220, 210, t);
    // the thought cloud over Hanuman's head
    if (inW(t, SWEAT, FIGHT)) thought(560, 840, 720, 520, (t - SWEAT) / (FIGHT - SWEAT - .3), t);
    camEnd();
    shout('"I am the SON', 560, 760, 84, t - SON, HTAKE + .9 - SON, { col: PC.cream });
    shout('of HANUMAN!"', 560, 870, 96, t - SON - .15, HTAKE + .9 - SON - .15);
    caps(t);
    if (t > WIPE3 - .3) { flushLetters(); brushWipe((t - (WIPE3 - .3)) / .6, [PC.vioDk, PC.vio]); }
  }

  // ================= 6–9: the hall of the five lamps =================
  const HGY = 1560;
  const DAISY = 1000, RX6 = 478, LX6 = 602, RU6 = 8.4;          // Ram and Lakshman tied on the raised altar
  const AHX = 820, AHU = 23;                                     // Ahiravana
  const PX = 540, PY = 1840, PU = 26;                            // Panchmukhi, front and centre
  // the five lamps: [x, y, s, kind, the face that blows it]
  const LAMPS = [
    [110, 1260, 30, 'niche', 'narasimha'], [210, 820, 26, 'ledge', 'garuda'], [970, 1260, 30, 'niche', 'varaha'],
    [860, 680, 28, 'hang', 'hayagriva'], [250, 1790, 40, 'stand', 'hanuman'],
  ];
  const LAMP_ORDER = [4, 0, 1, 2, 3];   // the order they flare in the reveal: east, south, west, north, sky
  function lampsAt(t) {
    const out = t > OUT ? t - OUT : null;
    LAMPS.forEach(([x, y, s, kind], i) => {
      const j = LAMP_ORDER.indexOf(i), fl = 1 + .5 * Math.max(0, 1 - Math.abs(t - (SECRET + .6 + j * .45)) / .2);
      const lit = t < OUT ? fl : (t > SAVED ? 0 : 0);
      if (kind === 'ledge') { boilSeed('ledge'); paint(rectPts(x - 70, y + 2, 140, 22), { wash: PC.pillarLt, ink: PC.ink, sw: 1.2 }); }
      lamp(x, y, s, lit, t, 'L' + i, { niche: kind === 'niche', hang: kind === 'hang', chain: 500, out });
      if (inW(t, SECRET + .5 + j * .45, SECRET + 1.3 + j * .45)) sparkleBurst(x, y - s * 2.6, 50, t - (SECRET + .5 + j * .45), 'lampflare' + i);
    });
  }
  function tiedPair(t, o = {}) {   // Ram and Lakshman sitting tied on the altar
    boilSeed('dais');
    paint(rectPts(RX6 - 140, DAISY, 400, 70), { wash: PC.pillar, fill: PC.pillarDk, fillOp: 70, tex: .5, ink: PC.ink, sw: 1.6 });
    for (let i = 0; i < 4; i++) paint(rectPts(RX6 - 140 - i * 40, DAISY + 70 + i * 40, 400 + i * 80, 40), { wash: i % 2 ? PC.pillarDk : PC.pillar, ink: PC.ink, sw: 1.2 });
    const worry = acts(t, [[-9, { eyes: 'wide', mouth: 'O', lookX: .8, brow: 1 }], [ONCE, { eyes: 'look', mouth: 'flat', lookX: .9 }], [OUT + .8, { eyes: 'wide', mouth: 'O', lookY: .5 }], ...(o.keys || [])]);
    ram(RX6, DAISY, RU6, { sit: 1, ...worry, kodanda: false, sweat: .6, boilKey: 'r6', seed: 4 });
    ropes(RX6, DAISY, RU6, 'r');
    lakshman(LX6, DAISY, RU6, { sit: 1, ...worry, lookX: -.4, kodanda: false, boilKey: 'l6', seed: 5 });
    ropes(LX6, DAISY, RU6, 'l');
  }
  function ahira6(t, o = {}) {
    const f = acts(t, [
      [-9, { eyes: 'angry', mouth: 'grin', lookX: -.6 }], [ONCE, { eyes: 'happy', mouth: 'laugh' }], [PEEKH, { eyes: 'angry', mouth: 'smirk', lookX: -1 }],
      [REACT + .15, { eyes: 'wide', mouth: 'O', mouthK: 1, brows: 1 }], [KO, { eyes: 'swirl', mouth: 'wobble' }],
    ]);
    return { kind: 'ahiravana', ...f, sword: true, swordA: inW(t, ONCE, PEEKH) ? -.4 + Math.sin(t * 6) * .08 : 0, shield: false,
      shake: inW(t, ONCE, ONCE + 2.4) ? .5 : 0, boilKey: 'ah6', seed: 3, ...o };
  }
  // Panchmukhi in the hall: the faces pop, all inhale, blow
  function pmState(t) {
    const F = {};
    const P = { narasimha: P_N, garuda: P_G, varaha: P_V, hayagriva: P_H };
    FACES.forEach((k, i) => {
      const g = clamp(seg(t, P[k], P[k] + .35)), back = t > SAVED ? 1 - seg(t, SAVED + .1 + i * .12, SAVED + .35 + i * .12) : 1;
      const pop = t - P[k];
      F[k] = { grow: g * back, seed: i * 2.1, lookY: k === 'hayagriva' ? -.6 : 0,
        mouth: pop < .5 ? 'roar' : 'grin', eyes: pop < .5 ? 'angry' : 'normal', brow: -.6 };
      if (t > PANCH) Object.assign(F[k], { eyes: 'normal', mouth: 'grin', brow: -.4 });
      if (t > INHALE) Object.assign(F[k], { eyes: 'squeeze', mouth: 'smile', puff: ease(seg(t, INHALE, HUSH)) * (1 - seg(t, BLOW, BLOW + .2)) });
      if (t > BLOW) Object.assign(F[k], { eyes: 'squeeze', mouth: 'O', puff: 1 - seg(t, BLOW + .5, BLOW + .9) });
      if (t > BLOW + .9) Object.assign(F[k], { eyes: 'happy', mouth: 'grin', puff: 0 });
    });
    const f = acts(t, [
      [-9, { eyes: 'closed', mouth: 'smile' }], [PANCH, { eyes: 'angry', mouth: 'grin', brow: -.6 }],
      [INHALE, { eyes: 'closed', mouth: 'smile' }], [BLOW, { eyes: 'closed', mouth: 'O' }], [BLOW + .9, { eyes: 'happy', mouth: 'grin' }],
    ]);
    const glowK = .25 + .5 * seg(t, GLOW, GLOW + .7);
    const sw = 1 + (t > INHALE && t < BLOW ? .04 * ease(seg(t, INHALE, HUSH)) : 0);
    return { ...f, faces: F, gada: 1, sq: -(sw - 1) * 3, dy: -.15 * Math.sin(t * 2.2), blush: .3, boilKey: 'pm6', seed: 1, glowK };
  }
  const CAM6 = [[WIPE3, [540, 1060, 1.0]], [ONCE - .3, [540, 1060, 1.0]], [ONCE + .3, [760, 1250, 1.35]]];
  const CAM7 = [[STEP, [540, 1250, 1.1]], [P_N - .1, [540, 1210, 1.3]], [PANCH, [540, 1200, 1.36]], [REACT, [540, 1195, 1.4]]];
  function shotHallWide(t, lt) {   // 32.4–39.0: the secret of the lamps
    const [cx, cy, z] = camAt(t, CAM6);
    camBegin(cx, cy, z);
    hall(t, { gy: HGY });
    lampsAt(t);
    tiedPair(t);
    asura(AHX, HGY + 30, AHU, ahira6(t));
    camEnd();
    // the numbers 1–5 as each lamp flares
    LAMP_ORDER.forEach((i, j) => {
      const [x, y, s] = LAMPS[i], t0 = SECRET + .6 + j * .45;
      if (t > t0 && t < ONCE) { camBegin(cx, cy, z); const p = toScreen(x, y - s * 4.2); camEnd(); shout(String(j + 1), p[0], p[1], 64, t - t0, ONCE - t0); }
    });
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [PC.vioDk, PC.vio]); }
  }
  function shotPeek(t, lt) {   // 39.0–41.5: Hanuman behind the pillar, one mouth, five lamps
    camBegin(210, 1130, 1.9);
    hall(t, { gy: HGY, pillars: [1020] });
    lampsAt(t);
    const dart = [[0, [-1, 0]], [.35, [1, 0]], [.7, [-1, -1]], [1.05, [1, -1]], [1.4, [0, .8]]];
    let lk = dart[0][1]; for (const [k, v] of dart) if (t - PEEKH > k) lk = v;
    const f = acts(t, [[-9, { eyes: 'look', mouth: 'flat' }], [PEEKH + 1.6, { eyes: 'wide', mouth: 'O', brow: 1 }]]);
    hanuman(60, HGY + 10, 24, { ...f, lookX: lk[0], lookY: lk[1], sweat: seg(t, PEEKH + .8, PEEKH + 1.4), hx: .6, rot: .2 + Math.sin(t * 2) * .01, gada: 0, emote: t > PEEKH + 1.6 ? 'sweat' : undefined, emoteK: 1, emoteAge: t - PEEKH - 1.6, boilKey: 'hnpeek', seed: 1 });
    // the pillar he hides behind, in front of him
    boilSeed('peek pillar');
    paint(rectPts(-240, 180, 330, HGY - 180), { wash: PC.pillar, fill: PC.pillarDk, fillOp: 70, tex: .5, ink: PC.ink, sw: 1.4 });
    paint(rectPts(-260, 160, 370, 50), { wash: PC.pillarLt, ink: PC.ink, sw: 1.2 });
    paint(rectPts(-260, HGY - 60, 370, 60), { wash: PC.pillarLt, ink: PC.ink, sw: 1.2 });
    for (let k = 0; k < 4; k++) inkLine([[-200 + k * 80, 230], [-200 + k * 80, HGY - 70]], 1, PC.pillarDk, 'inkfine', 0);
    camEnd();
    caps(t);
  }
  function shotTransform(t, lt) {   // 41.5–47.4: the four faces pop out
    const [cx, cy, z] = camAt(t, CAM7);
    camBegin(cx, cy, z);
    hall(t, { gy: HGY });
    lampsAt(t);
    tiedPair(t, { keys: [[P_N + .1, { eyes: 'wide', mouth: 'grin', lookX: 0, lookY: .6, brow: 1 }]] });
    camEnd();
    veil('#140C24', .45 * seg(t, STEP, GLOW + .5));
    camBegin(cx, cy, z);
    const step = ease(seg(t, STEP - .3, STEP + .3));
    const o = pmState(t);
    o.dy = (o.dy || 0) + (1 - step) * 2;
    panchmukhi(PX, PY, PU, o);
    // pops: a burst at each face as it arrives, its name beside it (they stay up)
    const P = { narasimha: P_N, garuda: P_G, varaha: P_V, hayagriva: P_H };
    const LBL = { narasimha: [-1, 150, 'NARASIMHA'], garuda: [-1, -130, 'GARUDA'], varaha: [1, 150, 'VARAHA'], hayagriva: [1, -130, 'HAYAGRIVA'] };
    for (const k of FACES) {
      const fp = toScreen(...pmFaceAt(PX, PY, PU, o, k));
      if (inW(t, P[k], P[k] + .8)) { camEnd(); sparkleBurst(fp[0], fp[1], 90, t - P[k], 'tp' + k, 10); camBegin(cx, cy, z); }
      if (t > P[k] + .1 && t < REACT) {
        const [sd, dy, name] = LBL[k];
        camEnd(); shout(name, clamp(fp[0] + sd * 40, 210, 800), fp[1] + dy, 64, t - P[k] - .1, REACT - P[k] - .1); camBegin(cx, cy, z);
      }
    }
    camEnd();
    caps(t);
  }
  function shotReact(t, lt) {   // 47.4–48.6: Ahiravana's jaw drops, the sword clatters
    camBegin(AHX - 40, HGY - 330, 2.1);
    hall(t, { gy: HGY });
    const drop = seg(t, REACT + .45, REACT + .75);
    const o = ahira6(t, { sword: drop < .05, shake: .3 });
    asura(AHX, HGY + 30, AHU, o);
    if (drop > 0) {   // the sword falls
      const hx = mahishHand(AHX, HGY + 30, AHU, o, 1);
      boilSeed('dropped sword'); push(); translate(hx[0] + drop * 30, lerp(hx[1], HGY + 10, easeIn(drop))); rotate(.4 + drop * 1.6);
      khadga(AHU * 1.0, clamp(AHU / 20, .4, 2), 0, PC.ink); pop();
    }
    camEnd();
    caps(t);
  }
  const CAM8 = [[INHALE, [540, 1180, .98]], [OUT, [540, 1180, .98]], [OUT + .2, [540, 1180, 1.0]]];
  function shotBlow(t, lt) {   // 48.6–50.6: one breath, five puffs, darkness
    const [cx, cy, z] = camAt(t, CAM8);
    const sh = t > BLOW && t < BLOW + .5 ? shakeXY(t, 10 * (1 - seg(t, BLOW, BLOW + .5))) : [0, 0];
    camBegin(cx + sh[0], cy + sh[1], z);
    hall(t, { gy: HGY });
    lampsAt(t);
    tiedPair(t);
    const o = pmState(t);
    panchmukhi(PX, PY, PU, o);
    // the five puffs
    if (t > BLOW) {
      LAMPS.forEach(([x, y, s, kind, face], i) => {
        const m = pmFaceAt(PX, PY, PU, o, face, 1), tip = kind === 'hang' ? [x, y - s * 1.2] : [x, y - (kind === 'stand' ? s * 2.4 : s * 2.2)];
        pmWind(m[0], m[1], tip[0], tip[1], (t - BLOW) / .4, face === 'hanuman' ? 120 : 100, 'w' + i);
      });
    }
    camEnd();
    const dark = seg(t, OUT, OUT + .15);
    veil('#0E0818', .78 * dark);
    if (dark > 0) {   // only his glow stays
      camBegin(cx, cy, z);
      const hp = naradaHead(PX, PY, PU, o);
      glow(hp[0], hp[1], 420, '#FFD36A', .35 * dark);
      camEnd();
    }
    caps(t);
  }
  function shotKO(t, lt) {   // 50.6–53.4: Ahiravana in the dark: swirl eyes, topples, poof; then back to the glowing Hanuman
    if (t < POOF + .5) {
      camBegin(AHX - 40, HGY - 330, 1.8);
      hall(t, { gy: HGY });
      const fall = easeIn(seg(t, KO + .4, POOF));
      if (t < POOF + .1) asura(AHX, HGY + 30, AHU, ahira6(t, { sword: false, rot: -fall * 1.3, dx: -fall * 2, emote: 'stars', emoteK: 1, emoteAge: t - KO, noShadow: fall > .3 }));
      if (t > POOF) {
        boilSeed('poof');
        const a = seg(t, POOF, POOF + .5);
        for (let i = 0; i < 8; i++) { const an = i / 8 * TAU; paint(ellPts(AHX - 200 + Math.cos(an) * a * 160, HGY - 150 + Math.sin(an) * a * 110, 90 * (1 - a * .5), 70 * (1 - a * .5), 12), { fill: PC.vioLt, fillOp: 230 * (1 - a), bleed: .2, tex: .3, ink: null }); }
        sparkleBurst(AHX - 200, HGY - 150, 140, t - POOF, 'poofsp', 10, [PC.vioLt, '#FFE39A']);
      }
      camEnd();
      veil('#0E0818', .62);
    } else {
      camBegin(540, 1180, 1.0);
      hall(t, { gy: HGY });
      lampsAt(t);
      tiedPair(t);
      const o = pmState(t);
      panchmukhi(PX, PY, PU, o);
      camEnd();
      veil('#0E0818', .7);
      camBegin(540, 1180, 1.0);
      const hp = naradaHead(PX, PY, PU, o);
      glow(hp[0], hp[1], 460, '#FFD36A', .4 + .1 * Math.sin(t * 4));
      camEnd();
    }
    caps(t);
  }
  function shotSaved(t, lt) {   // 53.4–57.0: light back; up the shaft with Ram and Lakshman on his shoulders
    const lift = ease(seg(t, SAVED + 1.0, WIPE5 - .2));
    camBegin(540, 1060 - lift * 300, 1.0);
    hall(t, { gy: HGY });
    lampsAt(t);
    boilSeed('shaft'); glow(540, 200, 700, '#FFE7A8', .45 * seg(t, SAVED, SAVED + .8));
    // Makardhwaja, king of Patala, waving from the floor
    const wv = Math.sin(t * 9);
    makardhwaja(850, HGY + 40, 18, { crown: 1, eyes: 'happy', mouth: 'grin', handR: [3.6 + wv * .4, -10.6], handShapeR: 'open', tailSway: t * 2, blush: .5, boilKey: 'mk9', seed: 2 });
    // Hanuman (the faces pop back first) with Ram and Lakshman on his shoulders
    const o = pmState(t);
    const HU9 = 22, hx = 480, hy = HGY + 30 - lift * 1500;
    o.handL = [-3.6, -18.4]; o.handR = [3.6, -18.4]; o.gada = 0; o.glowK = .3;
    Object.assign(o, acts(t, [[-9, { eyes: 'happy', mouth: 'grin' }]]));
    const shL = naradaLocal(hx, hy, HU9, o, -3.4, -16.4), shR = naradaLocal(hx, hy, HU9, o, 3.4, -16.4);
    const pal = { sit: 1, eyes: 'happy', mouth: 'grin', kodanda: false, pray: 1, seed: 4, blush: .4 };
    const show = seg(t, SAVED + .5, SAVED + .9);   // they hop up once the faces have gone back
    if (show > 0) {
      ram(shL[0] - 75, shL[1] + 6 + (1 - backOut(show)) * 60, 9.5, { ...pal, boilKey: 'r9' });
      lakshman(shR[0] + 75, shR[1] + 6 + (1 - backOut(show)) * 60, 9.5, { ...pal, seed: 5, boilKey: 'l9' });
    } else tiedPair(t);
    panchmukhi(hx, hy, HU9, o);
    if (t > SAVED + .9) { boilSeed('lift dust'); for (let i = 0; i < 3; i++) { const a = frac(t * 2 + i / 3); paint(ellPts(hx + (i - 1) * 40, hy + a * 120, 26 * (1 - a) + 8, 18 * (1 - a) + 6, 10), { fill: '#FFF3D6', fillOp: 200 * (1 - a), bleed: .2, tex: .2, ink: null }); } }
    camEnd();
    caps(t);
    if (t > WIPE5 - .3) { flushLetters(); brushWipe((t - (WIPE5 - .3)) / .6, [PC.saffronDk, PC.saffron]); }
  }
  function shotHall(t, lt, dur) {
    if (t < PEEKH) return shotHallWide(t, t - WIPE3);
    if (t < STEP) return shotPeek(t, t - PEEKH);
    if (t < REACT) return shotTransform(t, t - STEP);
    if (t < INHALE) return shotReact(t, t - REACT);
    if (t < KO) return shotBlow(t, t - INHALE);
    if (t < SAVED) return shotKO(t, t - KO);
    return shotSaved(t, t - SAVED);
  }

  // ================= 10–11: the blessing slate and the ask =================
  const GIFTS = [['hanuman', 'VICTORY', 0, 300], ['narasimha', 'FEARLESSNESS', -10, 150], ['garuda', 'PROTECTION', -20, -150], ['varaha', 'PROSPERITY', -40, 150], ['hayagriva', 'KNOWLEDGE', 10, -150]];
  function shotBless(t, lt) {
    camBegin(540, 960, 1);
    halo(t, { cx: 540, cy: 1150 });
    const F = bustFaces(t);
    const look = t > ASK ? 1 : 0;
    FACES.forEach((k, i) => {
      if (look) { F[k].lookX = 0; F[k].lookY = .3; }
      const wk = ASK + .9 + i * .35; if (inW(t, wk, wk + .3)) F[k].eyes = 'happy';
      const gi = GIFTS.findIndex(g => g[0] === k), t0 = BLESS + .7 + gi * .35;
      if (inW(t, t0, t0 + .6)) F[k].mouth = 'grin';
    });
    const f = acts(t, [[-9, { eyes: 'normal', mouth: 'smile' }], [ASK + .3, { eyes: 'normal', mouth: 'grin' }], [ASK + 2.4, { eyes: ['normal', 'closed'], mouth: 'grin' }], [ASK + 2.8, { eyes: 'normal', mouth: 'grin' }]]);
    const o = { ...f, blush: .35, faces: F, gada: 1, htilt: Math.sin(t * 1.6) * .03, boilKey: 'bust', seed: 1 };
    panchmukhi(BX, BY, BU, o);
    const at = GIFTS.map(([k]) => toScreen(...pmFaceAt(BX, BY, BU, o, k)));
    camEnd();
    GIFTS.forEach(([k, word, dx, dy], i) => {
      const t0 = BLESS + .7 + i * .35, p = at[i];
      shout(word, clamp(p[0] + dx, 200, 820), p[1] + dy, word.length > 10 ? 46 : 54, t - t0, WIPE6 - .3 - t0, { rot: -.03 });
      if (inW(t, t0, t0 + .8)) sparkleBurst(p[0], p[1], 70, t - t0, 'gift' + i);
    });
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [PC.saffronDk, PC.saffron]); }
    if (t > WIPE6 - .3) { flushLetters(); brushWipe((t - (WIPE6 - .3)) / .6, [TK.marigold, TK.peach]); }
  }

  // ================= 12: the card =================
  function shotCard(t, lt) {
    pcCard(t, { cap: CARD_CAP, covers: COVERS, price: PRICE, logo: LOGO, pill: PILL, follow: FOLLOW });
    const k = frac((t - FOLLOW) / 1.6);
    if (t > FOLLOW) { flushLetters(); boilSeed('sparkle'); paint(starPts(lerp(240, 700, k), lerp(1000, 760, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [TK.marigold, TK.peach]); }
  }

  shots([[0, shotHook], [WIPE1, shotCamp], [WIPE2, shotDawn], [FALL, shotGate], [WIPE3, shotHall], [WIPE5, shotBless], [CARD, shotCard]]);
})();
