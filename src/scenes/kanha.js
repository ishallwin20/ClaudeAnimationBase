// kanha.js: "Every mom says OPEN YOUR MOUTH. Only ONE saw the UNIVERSE." Little Kanha, Part 1, a ~57.6 s captioned
// reel for followers (Bhagavata Purana 10.8.32–45). Baby Krishna eats mud; Balarama and the boys tell Maa; Yashoda
// grabs his hand; "They're all lying! Look in my mouth!"; she sees the universe, Gokul, and herself; she bows to the
// Lord in her baby; he makes her forget, and she's just his Maa again. The ending rhymes frame 0: he looks at us, a wink.
// Storyboard: STORYBOARD.md. Props: kanha_props.js. All times are video time (t); tools/kanha_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/kanha_sfx.mjs)
  const EAT = .5, CAUGHT = 2.7, B0 = 3.6, LICK = 4.4, GIGGLE = 5.4;
  const C0 = 6.4, PEEK = 6.8, RUN = 7.6, TELL = 8.9;
  const D0 = 11.2, STORM = 11.3, GRAB = 12.5, WAG = 13.6;
  const E0 = 16.2, SHAKE = 16.4, POINT = 19.2;
  const F0 = 22.6, HANDIN = 22.8, OPEN = 23.8, GLOWIN = 24.4, DIVE = 24.7;
  const G0 = 25.6, PLANETS = 26.0, EARTH = 29.0, GOKUL = 32.2, SELF = 35.0;
  const H0 = 38.0, DREAM = 38.1, BOW = 40.8;
  const I0 = 43.6, CLOSE = 43.8, MAYA = 44.2, FORGET = 45.4, SCOOP = 46.4, HUG = 47.3;
  const J0 = 50.2, WINK = 51.0, WIPE = 53.5;
  const CARD = 53.8, FOLLOW = 54.4, PILL = 54.9;

  const GOLDC = '#F5C542';
  // ---- the cast's colours and sizes (world px)
  const KU = 34, YU = 46;                               // Kanha, Yashoda
  const KX = 420, KY = 1700, YX0 = 1580, YX = 700, YY = 1700;
  const Y = { pal: YSD_PAL, ...YSD_SKIN, crown: false, veil: 1 };
  const BAL = { pal: { skin: '#F7E3CF', skinDk: '#DDBFA2', skinLt: '#FFF4E8', teal: '#2E4F9C', tealDk: '#1E356E', tealLt: '#6E8ED0', sash: '#F2C230', sashDk: '#B88A1C' }, feather: false, spear: false, shield: false };
  const GOPA1 = { pal: { skin: '#C98A5A', skinDk: '#A86A3E', skinLt: '#E6AE82', teal: '#E07A2E', tealDk: '#B05A1E', tealLt: '#F2A86A', sash: '#5BAA4E', sashDk: '#3E7E3A' }, feather: false, spear: false, shield: false, tilak: false };
  const GOPA2 = { pal: { skin: '#DDA878', skinDk: '#BC8656', skinLt: '#F2C8A0', teal: '#5BAA4E', tealDk: '#3E7E3A', tealLt: '#8ACC7A', sash: '#D2452F', sashDk: '#9E2E22' }, feather: false, spear: false, shield: false, topknot: false, tilak: false };

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['Every mom says "OPEN your MOUTH!"', 480, -1, B0 - .1 + 1, 56], ['Only ONE mom saw', 565, -1, B0 - .1 + 1, 66], ['the UNIVERSE inside.', 668, -1, B0 - .1 + 1, 100, GOLDC],
    ['Baby KRISHNA', 500, B0, C0 - B0 - .1, 120, GOLDC], ['was eating MUD.', 622, B0 + .35, C0 - B0 - .45, 74],
    ['His big brother BALARAMA', 480, C0 + .15, TELL - C0 - .25, 62], ['ran to tell Maa:', 565, C0 + .5, TELL - C0 - .6, 62], ['"Maa! Kanha ate MUD!"', 530, TELL, D0 - TELL - .05, 84, GOLDC],
    ['Maa YASHODA grabbed his hand.', 490, D0 + .1, WAG - D0 - .15, 60], ['"Did you eat MUD?!"', 530, WAG, E0 - WAG - .05, 96, GOLDC],
    ['"No Maa! I didn\'t!', 480, E0 + .15, POINT - E0 - .25, 70], ['They\'re all LYING!"', 578, E0 + .5, POINT - E0 - .6, 86, GOLDC],
    ['"Don\'t believe me?', 480, POINT, F0 - POINT - .1, 70], ['LOOK in my mouth!"', 582, POINT + .4, F0 - POINT - .5, 90, GOLDC],
    ['So Maa said:', 480, F0 + .1, DIVE + .6 - F0 - .1, 64], ['"OPEN!"', 595, F0 + .5, DIVE + .6 - F0 - .5, 136, GOLDC],
    ['The SUN. The MOON.', 480, PLANETS, EARTH - PLANETS - .1, 76], ['Stars and PLANETS!', 578, PLANETS + .6, EARTH - PLANETS - .7, 80, GOLDC],
    ['OCEANS. MOUNTAINS.', 480, EARTH + .1, GOKUL - EARTH - .2, 76], ['The whole EARTH.', 578, EARTH + .5, GOKUL - EARTH - .6, 88, GOLDC],
    ['…and in it, GOKUL.', 520, GOKUL + .1, SELF - GOKUL - .2, 90, GOLDC],
    ['…and HERSELF,', 480, SELF + .1, H0 - SELF - .15, 96, GOLDC], ['looking in!', 592, SELF + .45, H0 - SELF - .5, 80],
    ['"Is this a DREAM?"', 500, DREAM, BOW - DREAM - .1, 96, GOLDC],
    ['She bowed to the LORD', 480, BOW, I0 - BOW - .1, 70], ['inside her own baby.', 578, BOW + .4, I0 - BOW - .5, 80, GOLDC],
    ['Then Krishna made her', 480, CLOSE, SCOOP + .2 - CLOSE, 66], ['FORGET it all…', 578, CLOSE + .4, SCOOP - .2 - CLOSE, 96, GOLDC],
    ['…so she could just be', 480, SCOOP + .3, J0 - SCOOP - .4, 66], ['his MAA again.', 588, SCOOP + .7, J0 - SCOOP - .8, 108, GOLDC],
    ['What did YOUR mom', 1250, J0 + .1, CARD - J0 - .35, 66], ['catch YOU eating?', 1345, J0 + .4, CARD - J0 - .65, 90, GOLDC], ['Comment it!', 1440, J0 + .7, CARD - J0 - .95, 62],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };
  const camK = (t, keys, sh = [0, 0]) => { const c = kf(t, keys); camBegin(c[0] + sh[0], c[1] + sh[1], c[2]); return c; };
  const speed = (x, y, dx, dy, n, len, key, col = '#FFF5E2') => {
    boilSeed(key); const d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
    for (let i = 0; i < n; i++) { const o = (hash(i * 3.7) - .5) * 2, l = len * (.5 + hash(i * 1.3) * .6), px = x - uy * o * 260, py = y + ux * o * 260; inkLine([[px - ux * 30, py - uy * 30], [px - ux * (30 + l), py - uy * (30 + l)]], 2.2, col, 'inkfine', 0); }
  };
  const talk = (t, a, b, f = 9) => t > a && t < b ? .55 + .45 * Math.abs(Math.sin((t - a) * f)) : 0;   // mouthK while speaking
  // a mud ball (in a hand, or anywhere)
  const mudBall = (x, y, r, key) => { boilSeed(key); paint(ellPts(x, y, r, r * .9, 12, r * .08), { wash: KS.mud, fill: KS.mudDk, fillOp: 80, tex: .6, ink: KS.ink, sw: .9 }); paint(ellPts(x - r * .3, y - r * .3, r * .3, r * .2, 8), { wash: KS.mudLt, washOp: 200, ink: null }); };
  // Yashoda's hand on top of whatever was drawn after her
  const yHand = (x, y, u, o, s, key) => { const [hx, hy] = parvatiHand(x, y, u, o, s); boilSeed(key); paint(ellPts(hx, hy, .62 * u, .56 * u, 14, u * .03), { wash: YSD_PAL.skin, ink: '#4A2530', sw: clamp(u / 20, .4, 2) * .7 }); return [hx, hy]; };
  // a boy of Gokul (Kartikeya's rig recoloured): running right, then pointing back
  // their own skin always (emotions() hands over Clawd's colours mid-change); the mood's tint still applies on top
  const boy = (x, y, u, base, o, key) => kartikeya(x, y, u, { ...base, ...o, col: base.pal.skin, dk: base.pal.skinDk, lt: base.pal.skinLt, boilKey: key });

  // ================= A + B · the mud, the name =================
  function shotMud(t, lt) {
    const c = camK(t, [[0, [430, 1370, 1.75]], [B0, [430, 1375, 1.8]], [C0 - .45, [440, 1380, 1.85]], [C0 - .1, [600, 1340, 1.5]]]);
    courtyardSet(t);
    const face = emotions(t, [
      [0, 'happy', { eyes: 'happy', mouth: 'smile', emote: null }],
      [EAT + .3, 'happy', { eyes: 'happy', mouth: 'chew', emote: null }],
      [CAUGHT, 'surprised', { eyes: 'wide', mouth: 'puff', emote: '!' }],
      [B0 + .1, 'shy', { eyes: 'normal', mouth: 'grin', emote: null, tint: null }],
      [LICK, 'playful', { eyes: ['happy', 'normal'], mouth: 'tongue', emote: null, tint: null }],
      [GIGGLE, 'laugh', { eyes: 'happy', mouth: 'giggle', emote: null, tint: null }],
    ], { take: .5 });
    const toMouth = ease(seg(t, EAT, EAT + .28)), back = ease(seg(t, EAT + .35, EAT + .7));
    let hL = [lerp(-2.6, -.7, toMouth), lerp(-5.6, -10.1, toMouth)];
    if (back > 0) hL = [lerp(-.7, -2.3, back), lerp(-10.1, -6.2, back)];
    if (t > LICK - .2 && t < GIGGLE - .1) { const k = ease(seg(t, LICK - .2, LICK + .1)) * (1 - ease(seg(t, GIGGLE - .4, GIGGLE - .1))); hL = [lerp(-2.3, -.5, k), lerp(-6.2, -10.0, k)]; }
    if (t > GIGGLE - .1) { const k = ease(seg(t, GIGGLE - .1, GIGGLE + .15)); hL = [lerp(-2.3, -.6, k), lerp(-6.2, -10.3, k)]; }
    const puff = t > EAT + .25 && t < B0 + .25 ? .55 + .15 * Math.sin(t * 14) * (t < CAUGHT ? 1 : 0) : 0;
    const o = { ...face, pose: 'sit', mud: 1, puff, boilKey: 'kanha', seed: 1, dy: (face.dy || 0) * .3, sq: (face.sq || 0) * .5 + (t > CAUGHT ? spring(t, CAUGHT, 8, 26) * .08 : 0),
      handL: hL, handShapeL: t > LICK - .2 && t < GIGGLE - .1 ? 'point' : t < EAT + .3 ? 'hold' : 'fist', handAL: t < EAT + .3 ? undefined : undefined,
      handR: [2.6, -5.0], handShapeR: 'open', lookX: 0, lookY: t < CAUGHT ? .2 : 0, blush: t > B0 ? .8 : .45, featherWob: t * .7 };
    delete o.aL; delete o.aR; delete o.dx; delete o.rot;
    if (t > CAUGHT && t < CAUGHT + .6) o.hx = Math.sin((t - CAUGHT) * 30) * .06;
    if (t < EAT + .26) o.held = (uu) => mudBall((hL[0] + .5) * uu, (hL[1] + 3.0 - 1.1) * uu, uu * .75, 'mudball');
    balKrishna(KX, KY, KU, o);
    camEnd();
    if (t > C0 - .25) speed(540, 960, 1, 0, 9, 380, 'whipA');
    caps(t);
  }

  // ================= C + D · the snitch; Maa storms over and grabs his hand =================
  function shotTell(t, lt) {
    const c = camK(t, [[C0, [1020, 1280, 1.0]], [C0 + .3, [1120, 1260, .95]], [TELL, [1160, 1250, .93]], [D0 + .1, [1150, 1250, .93]], [GRAB - .1, [600, 1290, 1.08]], [E0, [580, 1300, 1.12]]]);
    courtyardSet(t);
    // Yashoda: comes out of the doorway as they run up; storms left to him; grabs his hand; wags a finger
    const out = ease(seg(t, RUN + .1, RUN + .7)), go = seg(t, STORM, GRAB - .1);
    const yx = t < STORM ? YX0 - out * 40 : lerp(YX0 - 40, YX, ease(go));
    const yFace = emotions(t, [
      [0, 'neutral', { eyes: 'normal', mouth: 'smile' }],
      [TELL + .4, 'surprised', { eyes: 'wide', mouth: 'O' }],
      [STORM, 'angry', { eyes: 'normal', mouth: 'frown', emote: null }],
      [WAG, 'angry', { eyes: 'normal', mouth: 'open', emote: 'anger' }],
    ], { take: .4 });
    // Kanha: sitting (offscreen left, then in the frame as the camera swings back); he stands as she pulls
    const up = ease(seg(t, GRAB, GRAB + .35));
    const kFace = emotions(t, [[0, 'happy', { eyes: 'happy', mouth: 'chew' }], [STORM + .4, 'scared', { eyes: 'scared', mouth: 'O' }], [GRAB + .3, 'scared', { eyes: 'scared', mouth: 'wobble', emote: 'sweat' }]], { take: .5 });
    const ko = { ...kFace, pose: t < GRAB + .18 ? 'sit' : 'stand', mud: 1, boilKey: 'kanha', seed: 1, worry: t > GRAB ? 1 : 0, lookX: t > GRAB ? Math.sin(t * 3.3) > 0 ? .9 : -.6 : 0, lookY: t > GRAB ? -.5 : 0,
      dy: -up * .3 + (t > GRAB + .18 ? -(1 - up) * 2 : 0), handR: t > GRAB - .05 ? [3.0, -12.2 + 3 * (t < GRAB + .18 ? 1 : 0)] : [2.6, -5.0], handShapeR: t > GRAB - .05 ? 'fist' : 'open', handL: [-1.6, -7.6 + (t < GRAB + .18 ? 3 : 0)], handShapeL: 'fist', bendL: -1, featherWob: t * .7 };
    delete ko.aL; delete ko.aR; delete ko.dx; delete ko.rot;
    // the boys: playing by the wall, see him, gasp, run right to Maa, point back left at him
    const run = seg(t, RUN, TELL - .2), bx = k => lerp(0, 330, easeOut(k));
    const bFace = (sd) => emotions(t + sd, [[0, 'happy', { eyes: 'normal', mouth: 'smile' }], [PEEK, 'surprised', { eyes: 'wide', mouth: 'O', emote: '!' }], [RUN, 'excited', { eyes: 'wide', mouth: 'open', emote: null }]], { take: .5 });
    const pointing = t > TELL - .2, walking = t > RUN && t < TELL - .1;
    const bb = (x, u, base, sd, key) => {
      const f = bFace(sd); const o = { ...f, walk: walking ? (t - RUN) * 3.2 + sd : undefined, dy: walking ? -Math.abs(Math.sin((t - RUN) * 3.2 * Math.PI)) * .5 : (f.dy || 0) * .4, hx: pointing ? -.8 : t > PEEK ? -.6 : .2, lookX: pointing || t > PEEK ? -.9 : .3 };
      if (pointing) o.aL = .05 + Math.sin(t * 9 + sd) * .06; else if (walking) { o.aL = -.6 + Math.sin((t - RUN) * 10) * .4; o.aR = -.6 - Math.sin((t - RUN) * 10) * .4; }
      if (key === 'bal' && t > TELL && t < D0) o.mouth = Math.sin(t * 18) > 0 ? 'open' : 'O';
      if (t > STORM) { o.aL = -1.3; o.mouth = 'smirk'; o.eyes = 'normal'; o.emote = null; }
      boy(x + bx(run), 1560, u, base, o, key);
    };
    bb(620, 33, GOPA2, .5, 'gopa2');
    bb(730, 35, GOPA1, .25, 'gopa1');
    // Yashoda, then Kanha in front of her, then her hand over his
    const yo = { ...yFace, ...Y, boilKey: 'ysd', seed: 2, walk: t > STORM && t < GRAB - .1 ? (t - STORM) * 2.2 : undefined, hx: t > STORM ? -.5 : t > TELL ? -.6 : 0, lookX: t > STORM ? -.8 : t > TELL ? -.8 : 0, lookY: t > STORM ? .6 : 0 };
    delete yo.dx; delete yo.rot;
    if (t > GRAB - .1) {   // her left hand (screen left) holds his raised wrist; her right (screen right) wags a finger
      const [hx, hy] = bkHand(KX, KY, KU, ko, 1);
      yo.handL = [(hx - yx) / YU, (hy - YY) / YU]; yo.bendL = -1;
      const wk = ease(seg(t, WAG - .3, WAG));
      yo.handR = [lerp(3.2, 2.6, wk), lerp(-11.4, -19.6, wk)];
      if (wk > .5) yo.armR = (u, sw) => wagFinger(u, sw, Math.sin((t - WAG) * 14) * .35, YSD_PAL.skin);
    } else if (t > TELL + .4) yo.handR = [3.0, -12.2];   // a hand on her hip
    parvati(yx, YY, YU, yo);
    bb(860, 40, BAL, 0, 'bal');
    balKrishna(KX, KY, KU, ko);
    if (t > GRAB - .1) yHand(yx, YY, YU, yo, -1, 'ygrip');
    camEnd();
    if (lt < .3) speed(540, 960, 1, 0, 9, 380 * (1 - lt / .3), 'whipC');
    if (t > E0 - .3) { flushLetters(); }
    caps(t);
  }

  // ================= E · "who, ME?" =================
  function shotDeny(t, lt) {
    camK(t, [[E0, [520, 1250, 1.45]], [POINT, [480, 1270, 1.6]], [F0, [450, 1280, 1.7]]]);
    courtyardSet(t, { patch: true });
    // Maa beside him (her skirt and arm at the right of the frame), still holding his hand
    const yo = { ...feel('suspicious', t, { seed: 2 }), ...Y, eyes: 'normal', mouth: 'flat', boilKey: 'ysd', seed: 2, hx: -.5, lookX: -.8, lookY: .6 };
    delete yo.dx; delete yo.rot; delete yo.aL; delete yo.aR;
    const kFace = emotions(t, [
      [E0, 'neutral', { eyes: 'innocent', mouth: 'open' }],
      [POINT - .1, 'proud', { eyes: 'innocent', mouth: 'smile' }],
    ], { take: .5 });
    const shk = t < SHAKE + 1.3 && t > SHAKE ? Math.sin((t - SHAKE) * 16) * .14 * (1 - seg(t, SHAKE + .9, SHAKE + 1.3)) : 0;
    const pt = ease(seg(t, POINT - .15, POINT + .2));
    const ko = { ...kFace, pose: 'stand', mud: 1, boilKey: 'kanha', seed: 1, shake: shk, mouthK: talk(t, E0 + .1, POINT - .3) || .6, mouth: t > E0 + .1 && t < POINT - .3 ? 'open' : kFace.mouth,
      handR: [3.0, -12.2], handShapeR: 'fist', blush: .7, htilt: t > POINT ? -.08 : .05,
      handL: [lerp(-.7, -1.2, pt), lerp(-7.3, -10.6, pt)], handShapeL: pt > .5 ? 'point' : 'open', handAL: pt > .5 ? -.3 : undefined, featherWob: t * .7 };
    if (t > POINT + .3 && t < POINT + 1.5) ko.mouth = 'open', ko.mouthK = talk(t, POINT + .3, POINT + 1.5);
    delete ko.aL; delete ko.aR; delete ko.dx; delete ko.rot;
    const [hx, hy] = bkHand(KX, KY, KU, ko, 1);
    yo.handL = [(hx - YX) / YU, (hy - YY) / YU]; yo.bendL = -1; yo.handR = [3.0, -12.2];
    parvati(YX, YY, YU, yo);
    balKrishna(KX, KY, KU, ko);
    yHand(YX, YY, YU, yo, -1, 'ygrip');
    camEnd();
    caps(t);
  }

  // ================= F · Maa's POV: OPEN; the dive into his mouth =================
  function shotOpen(t, lt) {
    const ko0 = { pose: 'stand', boilKey: 'kanha' };
    const hin = ease(seg(t, HANDIN, HANDIN + .55));
    const kFace = emotions(t, [[F0, 'neutral', { eyes: 'innocent', mouth: 'smile' }], [OPEN - .15, 'happy', { eyes: 'closed', mouth: 'aam' }]], { take: .4 });
    const mk = t < OPEN ? 0 : backOut(seg(t, OPEN, OPEN + .4)) * 1.35;
    const ko = { ...kFace, ...ko0, mud: 1, nod: -.25 * hin, htilt: .04 * hin, mouthK: mk, cosmos: ease(seg(t, GLOWIN, GLOWIN + .6)), handR: [2.9, -6.0], handL: [-2.9, -6.0], handShapeL: 'open', handShapeR: 'open', seed: 1, featherWob: t * .7 };
    if (t < OPEN - .15) ko.mouth = 'smile';
    delete ko.aL; delete ko.aR; delete ko.dx; delete ko.rot;
    const dive = easeIn(seg(t, DIVE, G0 - .05));
    ko.dy = (ko.dy || 0) * (1 - seg(t, DIVE - .3, DIVE)); ko.sq = (ko.sq || 0) * (1 - seg(t, DIVE - .3, DIVE));
    const [mx, my] = bkMouth(KX, KY, KU, ko);
    const z = lerp(2.3, 16, dive * dive), cx = lerp(KX + 10, mx, Math.min(1, dive * 1.4)), cy = lerp(1300, my + KU * .55, Math.min(1, dive * 1.4));
    camBegin(cx, cy, z);
    courtyardSet(t);
    balKrishna(KX, KY, KU, ko);
    // her hand comes in from the top right and lifts his chin with two fingers
    if (hin > 0) {
      const [hx, hy] = bkWorld(KX, KY, KU, ko, 1.9, -12.2 - .25 * hin + 4.3);
      const ex = hx + lerp(420, 150, hin), ey = hy - lerp(-80, 180, hin), sx = hx + 520, sy = hy - 600;
      boilSeed('yarm');
      paint(ribbon([[sx, sy], [ex, ey], [hx + 26, hy - 6]], 60, 42), { wash: YSD_PAL.skin, fill: YSD_PAL.skinDk, fillOp: 40, tex: .5, ink: '#4A2530', sw: 1.2 });
      for (const k of [.7, .76, .82]) { const bx = lerp(ex, hx, k - .55), by = lerp(ey, hy, k - .55); inkLine([[bx - 20, by - 26], [bx + 20, by + 26]], 7, k === .76 ? KS.gold : YSD_PAL.bangle, 'ink', 0); }
      paint(ellPts(hx + 10, hy, 40, 34, 14), { wash: YSD_PAL.skin, ink: '#4A2530', sw: 1.1 });
      for (const k of [0, 1]) paint(ribbon([[hx - 4, hy + 8 + k * 18], [hx - 46, hy - 4 + k * 20]], 15, 12), { wash: YSD_PAL.skin, ink: '#4A2530', sw: .9 });
    }
    camEnd();
    // the dive's last moments: the night of his mouth takes the whole frame
    if (t > G0 - .3) flash(seg(t, G0 - .3, G0), KS.space);
    caps(t);
  }

  // ================= G · the universe =================
  function shotCosmos(t, lt) {
    const k = seg(t, G0, G0 + .8);
    // 1 · the heavens (G0..EARTH+1): stars, a galaxy, the sun, the moon, planets; everything drifts out from the centre
    if (t < GOKUL) {
      const grow = 1 + .05 * (t - G0);
      cosmosSet(t, { k, drift: (t - G0) * 90 });
      push(); translate(540, 960); scale(grow); translate(-540, -960);
      galaxy(560, 820, 230, t * .35);
      const pop = (a, d = .5) => backOut(seg(t, a, a + d));
      const lift = t > EARTH ? easeIn(seg(t, EARTH, EARTH + 1.6)) * 900 : 0;   // the heavens slide up as the earth rises
      push(); translate(0, -lift);
      if (t > PLANETS) { const s = pop(PLANETS); sunDisc(230, 1170, 95 * s, { key: 'gsun' }); }
      if (t > PLANETS + .5) { const s = pop(PLANETS + .5); push(); translate(850, 1260); scale(s); moonDisc(0, 0, 62); pop(); }
      if (t > PLANETS + 1.0) { const s = pop(PLANETS + 1.0); planet(300, 560, 34 * s, { col: '#D8553A', dk: '#A83A26', key: 'mars' }); planet(830, 560, 54 * s, { col: '#E8A46A', dk: '#B8743A', bands: true, key: 'jup' }); }
      if (t > PLANETS + 1.4) { const s = pop(PLANETS + 1.4); planet(690, 1520, 42 * s, { col: '#E8C88A', dk: '#C0A060', ring: true, key: 'sat' }); planet(170, 1560, 26 * s, { col: '#7EC8E8', dk: '#4E98B8', key: 'nep' }); }
      pop();
      pop();
      // 2 · the earth rises and we fall toward it
      if (t > EARTH) {
        const r = easeOut(seg(t, EARTH, EARTH + 1.4)), fall = easeIn(seg(t, EARTH + 1.6, GOKUL));
        const R = lerp(360, 2400, fall), ey = lerp(2350, 1060, r) + fall * 500;
        earthGlobe(540, ey, R, { spin: t * .25 });
      }
      if (t > GOKUL - .35) flash(seg(t, GOKUL - .35, GOKUL) * .9, '#FFF4DE');
    } else if (t < SELF) {
      // 3 · Gokul by the Yamuna, pushing in on their hut
      const p = easeIn(seg(t, GOKUL, SELF));
      camBegin(lerp(560, 560, p), lerp(1350, 1210, p), lerp(.62, 2.6, p * p));
      gokulSet(t);
      camEnd();
      if (lt < 1.2 + (GOKUL - G0)) flash((1 - seg(t, GOKUL, GOKUL + .4)) * .9, '#FFF4DE');
      if (t > SELF - .3) flash(seg(t, SELF - .3, SELF) * .9, '#FFF4DE');
    } else {
      // 4 · their own courtyard, tiny, inside the stars: Maa bent over little Kanha's open mouth; push in on her face
      const p = ease(seg(t, SELF + .3, H0));
      const [fx, fy] = [548, 730];
      camBegin(lerp(560, fx, p), lerp(1330, fy, p), lerp(.6, 3.2, p * p));
      courtyardSet(t, { tint: KS.nebV, tintK: .18 });
      const ko = { pose: 'stand', eyes: 'closed', mouth: 'aam', mouthK: 1.3, cosmos: 1, nod: -.3, htilt: .06, mud: 1, handR: [2.9, -6.0], handL: [-2.9, -6.0], boilKey: 'kanha', seed: 1 };
      const yo = { ...Y, eyes: 'wide', mouth: 'O', eyeStars: 1, lean: -1.6, htilt: -.22, hx: -.7, lookX: -.9, lookY: .9, boilKey: 'ysd', seed: 2 };
      const [hx, hy] = bkWorld(KX, KY, KU, ko, 1.6, -12.2 - .3 + 3.4 * 1.1);
      yo.handL = [(hx - 640) / YU, (hy - YY) / YU]; yo.bendL = -1; yo.handR = [3.0, -12.2];
      parvati(640, YY, YU, yo);
      balKrishna(KX, KY, KU, ko);
      yHand(640, YY, YU, yo, -1, 'ychin');
      camEnd();
      flash((1 - seg(t, SELF, SELF + .4)) * .9, '#FFF4DE');
      // the stars round the edge: we're still inside his mouth
      boilSeed('selfring');
      iris(540, 960, 980 - 120 * Math.sin(t * 1.3) * .2, KS.space2);
      for (let i = 0; i < 26; i++) { const a = i / 26 * TAU + t * .1, r = 1010 + hash(i * 2.2) * 120; paint(starPts(540 + Math.cos(a) * r * .62, 960 + Math.sin(a) * r, 9 + hash(i) * 8, .32, 4), { wash: KS.star, ink: null }); }
    }
    caps(t);
  }

  // ================= H · Yashoda's face: awe, then she bows =================
  function shotAwe(t, lt) {
    cosmosSet(t, { k: .75, drift: t * 40 });
    const tr = Math.sin(t * 41) * .025 * (1 - seg(t, BOW, BOW + .6));
    const bw = ease(seg(t, BOW, BOW + .6));
    const face = emotions(t, [[H0, 'surprised', { eyes: 'wide', mouth: 'O' }], [BOW + .2, 'love', { eyes: 'closed', mouth: 'smile' }]], { take: .3 });
    const yo = { ...face, ...Y, eyeStars: 1 - seg(t, BOW + .1, BOW + .4) * 0, boilKey: 'ysdc', seed: 2, dx: tr, pray: bw, htilt: bw * .08, lookX: 0, lookY: .15 };
    delete yo.rot; delete yo.aL; delete yo.aR; yo.dx = tr;
    const s = lerp(1.06, 1.0, ease(seg(t, H0, H0 + 1.2)));
    push(); translate(540, 960); scale(s); translate(-540, -960);
    parvati(540, 2640 + bw * 40, 82, yo);
    pop();
    boilSeed('awelight');
    glow(560, 1020, 520, '#8A6AE8', .42 + .1 * Math.sin(t * 3));
    glow(540, 1200, 300, '#FFD98A', .25);
    if (lt < .35) flash((1 - lt / .35) * .9, '#FFF4DE');
    if (t > I0 - .5) { flushLetters(); brushWipe((t - (I0 - .5)) / 1.0, [KS.pink, '#F7C0D8']); }
    caps(t);
  }

  // ================= I + J · she forgets; the hug; the wink =================
  function shotHug(t, lt) {
    const c = camK(t, [[I0, [580, 1250, .95]], [SCOOP, [600, 1220, .95]], [HUG + .3, [560, 1060, 1.15]], [J0, [560, 1010, 1.25]], [WIPE, [540, 970, 1.5]]]);
    courtyardSet(t, { dusk: .7 });
    const sc = ease(seg(t, SCOOP, HUG));
    const yFace = emotions(t, [
      [0, 'surprised', { eyes: 'wide', mouth: 'O' }],
      [FORGET, 'neutral', { eyes: 'closed', mouth: 'flat' }],
      [FORGET + .35, 'happy', { eyes: 'normal', mouth: 'smile' }],
      [HUG, 'love', { eyes: 'closed', mouth: 'smile', emote: 'hearts' }],
    ], { take: .3 });
    const yo = { ...yFace, ...Y, eyeStars: 1 - seg(t, FORGET, FORGET + .3), boilKey: 'ysd', seed: 2, hx: lerp(-.5, -.3, sc), lookX: -.7 * (1 - sc), lookY: .6 * (1 - sc), htilt: -.14 * sc, lean: lerp(-1.2, -.4, sc) * (t > SCOOP ? 1 : 0) };
    delete yo.dx; delete yo.rot; delete yo.aL; delete yo.aR;
    const kFace = emotions(t, [
      [0, 'happy', { eyes: 'closed', mouth: 'aam' }],
      [CLOSE, 'laugh', { eyes: 'happy', mouth: 'giggle' }],
      [HUG, 'love', { eyes: 'closed', mouth: 'smile' }],
      [WINK, 'playful', { eyes: 'wink', mouth: 'giggle' }],
    ], { take: .5 });
    // Kanha: standing by her, then lifted onto her hip (sitting in her arms), cheek to cheek
    const held = [YX - 4.4 * YU, YY - 10.3 * YU];
    const kx = lerp(KX, held[0], sc), ky = lerp(KY, held[1], sc) - Math.sin(sc * Math.PI) * 60;
    const ko = { ...kFace, pose: sc > .5 ? 'sit' : 'stand', mud: 1 - seg(t, HUG, HUG + .01) * 0, boilKey: 'kanha', seed: 1, mouthK: t < CLOSE ? 1.3 : 1, cosmos: t < CLOSE ? 1 : 0, noShadow: sc > .2, blush: .8,
      hx: t > WINK - .2 ? .2 : .55 * sc, lookX: t > WINK - .2 ? 0 : .7 * sc, htilt: t > WINK - .2 ? -.06 : .12 * sc, featherWob: t * .7,
      handL: t > CLOSE && t < MAYA + .6 ? [-.7, -10.2] : sc > .5 ? [-2.0, -6.0] : [-2.8, -6.0], handShapeL: t > CLOSE && t < MAYA + .6 ? 'fist' : 'open',
      handR: sc > .5 ? [2.4, -8.8] : [2.8, -6.0], handShapeR: 'open' };
    if (t > CLOSE - .1 && t < CLOSE + .05) ko.mouth = 'O';
    if (t > WINK - .2) ko.hx = .25;
    delete ko.aL; delete ko.aR; delete ko.dx; delete ko.rot;
    // her hands: reaching for him, then holding him under his bottom and round his back
    if (t > SCOOP - .3) {
      const r0 = ease(seg(t, SCOOP - .3, SCOOP + .1));
      const kHL = [(kx - YX) / YU, (ky - YY) / YU];
      yo.handL = [lerp(-3.3, kHL[0] - .4, r0 * (1 - sc)) * (1 - sc) + -4.9 * sc, lerp(-11.2, kHL[1] - 2, r0 * (1 - sc)) * (1 - sc) + -10.5 * sc];
      yo.handR = [lerp(3.3, kHL[0] + 1.6, r0 * (1 - sc)) * (1 - sc) + -2.6 * sc, lerp(-11.2, kHL[1] - 4, r0 * (1 - sc)) * (1 - sc) + -13.9 * sc];
      yo.bendL = -1; yo.bendR = -1;
    }
    parvati(YX, YY, YU, yo);
    balKrishna(kx, ky, KU * lerp(1, .92, sc), ko);
    if (t > SCOOP - .3) { yHand(YX, YY, YU, yo, -1, 'yhold1'); yHand(YX, YY, YU, yo, 1, 'yhold2'); }
    camEnd();
    // her maya of a mother's love drifts from him over her
    const [ax, ay] = toScreen(KX, KY - 12 * KU, { cx: c[0], cy: c[1], zoom: c[2], rot: 0 }), [bx, by] = toScreen(YX, YY - 20 * YU, { cx: c[0], cy: c[1], zoom: c[2], rot: 0 });
    mayaDust(t, ax, ay, bx, by, seg(t, MAYA, FORGET + .4), 'maya');
    if (lt < .5) { brushWipe(.5 + lt / 1.0, [KS.pink, '#F7C0D8']); }
    if (t > WIPE) { flushLetters(); brushWipe((t - WIPE) / .6, ['#F39A2E', KS.rkOrange]); }
    caps(t);
  }

  // ================= K · the card =================
  function shotCard(t, lt) {
    followCard(t, { card: CARD, follow: FOLLOW, pill: PILL, next: ['Part 2:', 'the rope that was ALWAYS too short'], baby: () => {
      const wave = Math.sin(t * 9) * .7;
      balKrishna(470, 1135, 19, { pose: 'sit', eyes: 'happy', mouth: 'grin', blush: .6, handR: [3.6 + wave * .3, -11.5 + wave], handShapeR: 'open', handL: [-2.2, -5.2], boilKey: 'cbaby', seed: 2, dy: -Math.abs(Math.sin(t * 4)) * .3, noShadow: true });
    } });
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, ['#F39A2E', KS.rkOrange]); }
  }

  shots([[0, shotMud], [C0, shotTell], [E0, shotDeny], [F0, shotOpen], [G0, shotCosmos], [H0, shotAwe], [I0, shotHug], [CARD, shotCard]]);
})();
