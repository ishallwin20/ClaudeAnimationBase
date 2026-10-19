// rope.js: "His mom tried to TIE him up. The rope was ALWAYS two fingers short." Little Kanha, Part 2, a ~58.4 s
// captioned reel for followers (Bhagavata Purana 10.9–10.10). Yashoda churns curd; Kanha wants his milk; the milk boils
// over and she runs to it; Kanha, cross, smashes the curd pot with a stone; she finds him on an upturned mortar feeding
// butter to the monkeys; the stick, the chase, the tears and the smeared kajal; she throws the stick away and ties him
// to the mortar instead, but every rope is two fingers short, however many she joins; seeing her tired, he lets himself
// be tied (Damodar); he drags the mortar between the twin arjuna trees, they crash down, and two devas step out, freed
// from Narad Muni's curse. Storyboard: STORYBOARD.md. Props: rope_props.js (+ Part 1's kanha_props.js).
// All times are video time (t); tools/rope_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/rope_sfx.mjs)
  const B0 = 3.6, WALKIN = 3.8, GRABROD = 4.9, LIFT = 5.3, BOIL = 6.0, PUTDOWN = 6.9, RUNOFF = 7.2;
  const C0 = 8.4, STONE = 9.3, SMASH = 10.2, BUTTER = 11.0, SCURRY = 11.7;
  const D0 = 12.6, MAAIN = 12.7, SEE = 13.6, HIPS = 14.2, PAN = 15.3;
  const E0 = 18.6, SPOT = 19.2, JUMP = 19.5, CATCH = 23.4;
  const F0 = 24.6, THROW = 26.6;
  const G0 = 28.6, WRAP1 = 29.0, GAP1 = 30.0, ADD = 31.6, WRAP2 = 32.2, GAP2 = 33.0, MANY = 34.6, GOPIS = 35.0, TIRED = 37.6;
  const H0 = 40.6, CLOSE = 41.4, DAMODAR = 43.4;
  const I0 = 46.0, STUCK = 48.0, CRASH = 48.4, DEVAS = 49.0;
  const J0 = 51.4, WINK = 52.4;
  const CARD = 54.6, FOLLOW = 55.2, PILL = 55.7;

  const GOLDC = '#F5C542';
  const KU = 34, YU = 46, KY = 1700, YY = 1700;
  const Y = { pal: YSD_PAL, ...YSD_SKIN, crown: false, veil: 1 };
  const GOPI1 = { pal: { saree: '#2F9C94', sareeDk: '#1E6F6C', sareeLt: '#7FCDC3', blouse: '#F2C230', blouseDk: '#C89A1E', veil: '#E8697A', veilDk: '#B94566', bangle: '#F2C230', skin: '#D9A07A', skinDk: '#B87E58', skinLt: '#F0C29E' }, crown: false, veil: 1 };
  const GOPI2 = { pal: { saree: '#7A4EB8', sareeDk: '#56348A', sareeLt: '#A88AD8', blouse: '#E8862E', blouseDk: '#B85E18', veil: '#F2C230', veilDk: '#C89A1E', bangle: '#E8862E', skin: '#E8B48A', skinDk: '#C68A60', skinLt: '#FAD2AE' }, crown: false, veil: 1 };
  const DEVA = { pal: { skin: '#F6D2A0', skinDk: '#D8A870', skinLt: '#FFEACB', dhoti: '#D2452F', dhotiDk: '#9E2E22', dhotiLt: '#F07A5E', border: '#F2C230', shawl: '#F2C230', shawlDk: '#C89A1E', bead: '#F2C230' }, veena: false, topknot: false };

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['His mom tried to TIE him up.', 480, -1, B0 - .1 + 1, 58], ['The rope was ALWAYS', 568, -1, B0 - .1 + 1, 70], ['TWO FINGERS short!', 672, -1, B0 - .1 + 1, 100, GOLDC],
    ['Maa YASHODA was churning BUTTER.', 480, B0 + .1, BOIL - B0 - .15, 58], ['Kanha wanted his MILK!', 572, B0 + .45, BOIL - B0 - .5, 80, GOLDC],
    ['Then the milk on the stove', 480, BOIL, C0 - BOIL - .1, 64], ['BOILED OVER!', 585, BOIL + .35, C0 - BOIL - .45, 110, GOLDC],
    ['Left alone, Kanha got ANGRY…', 480, C0 + .1, D0 - C0 - .15, 62], ['…and SMASHED the curd pot!', 575, SMASH, D0 - SMASH - .1, 80, GOLDC],
    ['Maa came back.', 480, MAAIN, PAN - MAAIN - .1, 66], ['The pot? BROKEN!', 580, SEE, PAN - SEE - .1, 96, GOLDC],
    ['And Kanha? Feeding the butter', 480, PAN + .1, E0 - PAN - .15, 60], ['to the MONKEYS!', 580, PAN + .45, E0 - PAN - .5, 100, GOLDC],
    ['Maa picked up a STICK.', 480, E0 + .1, 21.6 - E0 - .15, 66], ['Kanha RAN!', 590, SPOT + .2, 21.6 - SPOT - .3, 120, GOLDC],
    ['Yogis can\'t catch him…', 480, 21.6, F0 - 21.6 - .1, 70], ['…but MAA did!', 588, 22.1, F0 - 22.1 - .1, 110, GOLDC],
    ['He cried and rubbed his eyes:', 480, F0 + .1, THROW - F0 - .15, 60], ['KAJAL everywhere!', 578, F0 + .5, THROW - F0 - .55, 92, GOLDC],
    ['Maa threw the stick away.', 480, THROW, G0 - THROW - .05, 64], ['She\'d TIE him up instead!', 575, THROW + .35, G0 - THROW - .4, 80, GOLDC],
    ['The rope?', 480, G0 + .1, ADD - G0 - .15, 70], ['TWO FINGERS short!', 590, GAP1, ADD - GAP1 - .1, 104, GOLDC],
    ['She tied on ANOTHER rope…', 480, ADD, MANY - ADD - .1, 64], ['STILL two fingers short!', 580, GAP2, MANY - GAP2 - .1, 88, GOLDC],
    ['EVERY rope in the house…', 480, MANY, TIRED - MANY - .1, 66], ['STILL TWO FINGERS!', 585, MANY + .9, TIRED - MANY - 1, 100, GOLDC],
    ['Maa was tired and sweating,', 480, TIRED, H0 - TIRED - .1, 62], ['flowers falling from her hair…', 572, TIRED + .4, H0 - TIRED - .5, 64, GOLDC],
    ['So Kanha LET her', 480, H0 + .1, DAMODAR - H0 - .15, 72], ['tie him up.', 585, H0 + .5, DAMODAR - H0 - .55, 104, GOLDC],
    ['That\'s why he\'s DAMODAR:', 480, DAMODAR, I0 - DAMODAR - .1, 70, GOLDC], ['the one with a ROPE round his belly!', 572, DAMODAR + .4, I0 - DAMODAR - .5, 58],
    ['He dragged the mortar', 480, I0 + .1, CRASH + .3 - I0 - .1, 66], ['between two TREES…', 575, I0 + .45, CRASH + .3 - I0 - .45, 84, GOLDC],
    ['…and out stepped two DEVAS,', 480, DEVAS - .2, J0 - DEVAS + .1, 62, GOLDC], ['freed from NARAD MUNI\'s curse!', 572, DEVAS + .2, J0 - DEVAS - .3, 64],
    ['Is anyone in YOUR family', 1250, J0 + .1, CARD - J0 - .35, 64], ['named DAMODAR?', 1350, J0 + .4, CARD - J0 - .65, 100, GOLDC], ['Comment below!', 1450, J0 + .7, CARD - J0 - .95, 60],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };
  const camK = (t, keys, sh = 0) => { const c = kf(t, keys); camBegin(c[0] + sh, c[1], c[2]); return c; };
  const talk = (t, a, b, f = 9) => t > a && t < b ? .55 + .45 * Math.abs(Math.sin((t - a) * f)) : 0;
  const strip = f => { delete f.dx; delete f.rot; delete f.aL; delete f.aR; return f; };
  // faces over time with the rig's own skin pinned (emotions() hands over Clawd's colours mid-change)
  const kface = (t, keys, take = .5) => strip(emotions(t, keys, { take }));
  const yface = (t, keys, take = .4) => ({ ...strip(emotions(t, keys, { take })), ...YSD_SKIN });
  const gopi = (x, y, u, G, o) => parvati(x, y, u, { ...G, ...o, col: G.pal.skin, dk: G.pal.skinDk, lt: G.pal.skinLt });
  const yHand = (x, y, u, o, s, key) => { const [hx, hy] = parvatiHand(x, y, u, o, s); boilSeed(key); paint(ellPts(hx, hy, .62 * u, .56 * u, 14, u * .03), { wash: YSD_PAL.skin, ink: '#4A2530', sw: clamp(u / 20, .4, 2) * .7 }); return [hx, hy]; };
  const butterBall = (x, y, r, key) => { boilSeed(key); paint(ellPts(x, y, r, r * .85, 12, r * .06), { wash: RS.butter, fill: RS.butterDk, fillOp: 60, tex: .5, ink: RS.ink, sw: .9 }); paint(ellPts(x - r * .3, y - r * .3, r * .3, r * .2, 8), { wash: '#FFFFFF', washOp: 170, ink: null }); };
  const stone = (x, y, r, key) => { boilSeed(key); paint(ellPts(x, y, r, r * .78, 10, r * .12), { wash: RS.stone, fill: RS.stoneDk, fillOp: 60, tex: .5, ink: RS.ink, sw: 1 }); };
  // the rope round his belly, in body space (a held() hook): gap in radians (0 = closed), knot, glow
  const belly = (gap, o = {}) => ({ gap, ...o });
  // Kanha, then (o.rope = { gap, knot, glow }) the rope round his belly, in world space over him
  const kanha = (x, y, u, o) => { const { rope, ...q } = o; balKrishna(x, y, u, q); if (rope) { const [bx, by] = bkBelly(x, y, u, q); beltRope(bx, by - .7 * u, 2.9 * u, .9 * u, rope.gap, { ...rope, key: 'belt' }); } };
  const speed = (x, y, dx, n, len, key, col = '#FFF5E2') => { boilSeed(key); for (let i = 0; i < n; i++) { const o = (hash(i * 3.7) - .5) * 2, l = len * (.5 + hash(i * 1.3) * .6), py = y + o * 700; inkLine([[x - dx * 30, py], [x - dx * (30 + l), py]], 2.2, col, 'inkfine', 0); } };
  const run = (t, f = 3.4) => ({ walk: t * f, dy: -Math.abs(Math.sin(t * f * Math.PI)) * .7 });

  // ================= A · the hook: the rope that won't meet =================
  function shotHook(t, lt) {
    camK(t, [[0, [430, 1250, 1.75]], [B0, [430, 1255, 1.8]]]);
    courtyardSet(t, { patch: false });
    const g = .8 + .05 * Math.sin(t * 6);
    kanha(430, KY, KU, { pose: 'stand', eyes: 'innocent', mouth: 'grin', blush: .7, hx: .1, htilt: .06 * Math.sin(t * 2), handL: [-3.9, -7.0], handR: [3.9, -7.0], handShapeL: 'open', handShapeR: 'open', boilKey: 'kanha', seed: 1, featherWob: t * .7,
      rope: belly(g), dy: -Math.abs(Math.sin(t * 2.4)) * .2 });
    const [bx, by] = bkBelly(430, KY, KU, { pose: 'stand' });
    glow(bx, by + .2 * KU, 80, RS.glow, .6 + .2 * Math.sin(t * 5));
    boilSeed('gapspark'); for (let k = 0; k < 3; k++) { const a = t * 3 + k * 2.1; paint(starPts(bx + Math.cos(a) * 44, by + .2 * KU + Math.sin(a) * 18, 10, .35, 4), { wash: '#FFF4C8', ink: null }); }
    camEnd();
    if (t > B0 - .3) { flushLetters(); brushWipe((t - (B0 - .3)) / .6, ['#F39A2E', KS.rkOrange]); }
    caps(t);
  }

  // ================= B · churning; the milk boils over =================
  const YXB = 760, POTX = 760, STOVEX = 1200;
  function shotChurn(t, lt) {
    camK(t, [[B0, [700, 1095, .85]], [BOIL - .1, [720, 1095, .85]], [BOIL + .4, [860, 1095, .85]], [C0, [880, 1095, .85]]]);
    courtyardSet(t, { patch: false });
    chulha(STOVEX, KY - 20, t, ease(seg(t, BOIL - .2, BOIL + .8)));
    const ch = Math.sin(t * 7);   // the churning stroke
    const lifted = t > LIFT && t < PUTDOWN, lk = ease(seg(t, LIFT, LIFT + .45)) * (1 - ease(seg(t, PUTDOWN, PUTDOWN + .3)));
    const runK = seg(t, RUNOFF, C0), yx = lerp(YXB, YXB + 900, easeIn(runK));
    const yf = yface(t, [
      [0, 'happy', { eyes: 'closed', mouth: 'smile' }],
      [GRABROD + .1, 'happy', { eyes: 'normal', mouth: 'smile' }],
      [LIFT, 'love', { eyes: 'closed', mouth: 'smile', emote: null, tint: null }],
      [BOIL + .2, 'surprised', { eyes: 'wide', mouth: 'O', emote: '!' }],
    ]);
    const yo = { ...yf, ...Y, ...YSD_SKIN, boilKey: 'ysd', seed: 2, hx: t > BOIL + .2 ? .6 : t > GRABROD ? -.5 : 0, lookX: t > BOIL + .2 ? .9 : t > GRABROD ? -.7 : 0, lookY: t > GRABROD && t < BOIL ? .6 : 0,
      walk: runK > 0 ? (t - RUNOFF) * 2.6 : undefined };
    if (!lifted && t < RUNOFF) { yo.handL = [-1.1 + ch * .5, -8.3]; yo.handR = [1.1 + ch * .5, -8.6]; yo.bendL = -.6; yo.bendR = -.6; }
    // Kanha toddles in, grabs the rod, goes up on her hip, comes down again
    const wk = seg(t, WALKIN, GRABROD - .1), kx0 = lerp(80, POTX - 190, easeOut(wk));
    const held = [YXB - 4.4 * YU, YY - 10.3 * YU];
    const kx = lerp(kx0, held[0], lk), ky = lerp(KY, held[1], lk) - Math.sin(lk * Math.PI) * 50;
    const kf_ = kface(t, [
      [0, 'happy', { eyes: 'normal', mouth: 'smile' }],
      [GRABROD, 'excited', { eyes: 'sparkle', mouth: 'grin', emote: null }],
      [LIFT, 'love', { eyes: 'closed', mouth: 'smile', emote: null }],
      [PUTDOWN, 'sad', { eyes: 'sad', mouth: 'pout', emote: null }],
    ]);
    const ko = { ...kf_, pose: lk > .5 ? 'sit' : 'stand', boilKey: 'kanha', seed: 1, noShadow: lk > .2, featherWob: t * .7, walk: wk > 0 && wk < 1 ? (t - WALKIN) * 3 : undefined, hx: t > PUTDOWN ? .5 : .3, lookX: t > PUTDOWN ? .8 : .4, dy: (kf_.dy || 0) * .3 };
    if (t > GRABROD && t < LIFT) { ko.handR = [3.6, -11.0]; ko.handL = [2.2, -12.4]; ko.handShapeR = 'fist'; ko.handShapeL = 'fist'; ko.dy = -Math.abs(Math.sin(t * 8)) * .4; }
    if (lifted) { ko.handL = [-2.0, -6.0]; ko.handR = [2.4, -8.8]; }
    if (lifted) {
      const kHL = [(kx - YXB) / YU, (ky - YY) / YU];
      yo.handL = [-4.9, -10.5]; yo.handR = [-2.6, -13.9]; yo.bendL = -1; yo.bendR = -1; yo.hx = t > BOIL + .2 ? .6 : -.3;
    }
    if (t < C0 - .1) churnPot(POTX, KY, t, { spin: t * 7 });
    parvati(yx, YY, YU, yo);
    if (t < C0 - .1) churnPot(POTX, KY, t, { spin: t * 7, front: true });
    kanha(kx, ky, KU * (lk > .5 ? .92 : 1), ko);
    if (lifted) { yHand(YXB, YY, YU, yo, -1, 'yh1'); yHand(YXB, YY, YU, yo, 1, 'yh2'); }
    camEnd();
    if (lt < .5) brushWipe(.5 + lt / 1.0, ['#F39A2E', KS.rkOrange]);
    caps(t);
  }

  // ================= C · alone and cross: the stone; the smash =================
  const KXC = 560;
  function shotSmash(t, lt) {
    const shake = t > SMASH && t < SMASH + .45 ? Math.sin((t - SMASH) * 60) * 10 * (1 - seg(t, SMASH, SMASH + .45)) : 0;
    camK(t, [[C0, [700, 1390, 1.42]], [SMASH - .1, [680, 1400, 1.45]], [SMASH + .2, [690, 1390, 1.4]], [D0, [640, 1380, 1.45]]], shake);
    courtyardSet(t, { patch: false });
    const broken = t > SMASH;
    churnPot(POTX, KY, t, { broken: broken ? 1 : 0, rod: !broken });
    if (broken) { boilSeed('rodfall'); push(); translate(POTX + 150, KY - 30); rotate(1.45); paint(rrPts(-11, -300, 22, 300, 8), { wash: RS.wood, ink: RS.ink, sw: 1 }); pop(); }
    const kf_ = kface(t, [
      [0, 'sad', { eyes: 'sad', mouth: 'pout', emote: null }],
      [C0 + .5, 'angry', { eyes: 'normal', brows: -1, mouth: 'pout', emote: 'anger' }],
      [SMASH, 'surprised', { eyes: 'wide', mouth: 'O', emote: '!', tint: null }],
      [BUTTER - .2, 'playful', { eyes: 'happy', mouth: 'giggle', emote: null, tint: null }],
    ], .6);
    const up = ease(seg(t, STONE, STONE + .35)), sm = ease(seg(t, SMASH - .25, SMASH));
    const go = seg(t, SCURRY, D0), kx = lerp(KXC, KXC - 700, easeIn(go));
    const ko = { ...kf_, pose: 'stand', boilKey: 'kanha', seed: 1, featherWob: t * .7, hx: t < SMASH ? .5 : -.2, lookX: t < SMASH ? .7 : -.2, dy: (kf_.dy || 0) * .3 + (t > STONE - .3 && t < STONE ? 1.4 : 0) * seg(t, STONE - .3, STONE - .1) * (1 - seg(t, STONE - .1, STONE + .1)),
      ...(go > 0 ? run(t - SCURRY) : {}), flip: go > 0 };
    if (t > STONE - .3 && t < SMASH + .05) {
      ko.handR = sm > 0 ? [lerp(2.8, 5.0, sm), lerp(-17.4, -9.4, sm)] : [lerp(2.4, 2.8, up), lerp(-3.6, -17.4, up)]; ko.handShapeR = 'hold'; ko.bendR = 1;
      ko.held = (u, sw) => { const h = ko.handR; stone(h[0] * u, (h[1] - .6) * u, .9 * u, 'stone'); };
    }
    if (t > BUTTER) { ko.handL = [-2.2, -10.0]; ko.handShapeL = 'hold'; ko.held = (u, sw) => butterBall(-2.2 * u, -10.6 * u, .9 * u, 'kbutter'); ko.handR = [2.0, -10.4]; }
    if (!ko.flip) delete ko.flip;
    kanha(kx, KY, KU, ko);
    if (t < STONE - .3) stone(KXC - 90, KY - 14, 30, 'stone');
    curdSplash(POTX, KY - 160, SMASH, t);
    camEnd();
    if (t > SMASH && t < SMASH + .12) flash(1 - (t - SMASH) / .12, '#FFFDF6');
    caps(t);
  }

  // ================= D · the broken pot; Kanha on the mortar, feeding the monkeys =================
  const MX = 140, MS = 1.2;
  function shotMonkeys(t, lt) {
    camK(t, [[D0, [820, 1095, .85]], [PAN, [800, 1095, .85]], [PAN + .7, [230, 1330, 1.22]], [E0, [220, 1330, 1.25]]]);
    courtyardSet(t, { patch: false });
    churnPot(POTX, KY, t, { broken: 1, rod: false });
    // the monkeys and Kanha on the upturned mortar, feeding them butter, looking round for Maa
    const bob = Math.sin(t * 5);
    balHanuman(MX - 210, KY, 22, { pose: 'sit', pal: MONKEY, eyes: 'happy', mouth: 'chew', hx: .5, lookX: .6, handR: [3.0, -9.6], bendR: 1, dy: -Math.abs(bob) * .2, boilKey: 'mk1', seed: 3, tail: 'curl', tailSway: t });
    balHanuman(MX + 220, KY, 20, { pose: 'sit', pal: MONKEY, eyes: Math.sin(t * 2) > 0 ? 'sparkle' : 'happy', mouth: Math.sin(t * 9) > 0 ? 'open' : 'chew', hx: -.5, lookX: -.7, handL: [-3.2, -10.6], bendL: 1, boilKey: 'mk2', seed: 4, tail: 'curl', tailSway: t + 1 });
    mortar(MX, KY, MS);
    const look = Math.sin(t * 2.6), feed = .5 + .5 * Math.sin(t * 4);
    kanha(MX, KY - 180 * MS, KU, { pose: 'sit', eyes: 'look', lookX: look > 0 ? .9 : -.9, hx: look * .5, mouth: 'smile', brows: .4, worry: .6, blush: .5, boilKey: 'kanha', seed: 1, featherWob: t * .7,
      handR: [lerp(3.0, 4.6, feed), lerp(-6.0, -8.4, feed)], handShapeR: 'hold', handL: [-3.4, -6.4], handShapeL: 'hold',
      held: (u, sw) => { butterBall(lerp(3.0, 4.6, feed) * u, (lerp(-6.0, -8.4, feed) + 3 - .6) * u, .75 * u, 'b1'); butterBall(-3.4 * u, (-6.4 + 3 - .6) * u, .75 * u, 'b2'); } });
    // Maa comes back, sees the pot: hands on her hips
    const inK = easeOut(seg(t, MAAIN, SEE)), yx = lerp(1450, 930, inK);
    const yf = yface(t, [[0, 'neutral', { eyes: 'normal', mouth: 'smile' }], [SEE, 'surprised', { eyes: 'wide', mouth: 'O', emote: '!' }], [HIPS, 'angry', { eyes: 'normal', mouth: 'frown', emote: 'anger' }]]);
    const yo = { ...yf, ...Y, ...YSD_SKIN, boilKey: 'ysd', seed: 2, walk: inK < 1 && t > MAAIN ? (t - MAAIN) * 2.2 : undefined, hx: t > PAN + .3 ? -.7 : -.4, lookX: t > PAN + .3 ? -.9 : -.6, lookY: t > SEE && t < PAN ? .6 : 0 };
    if (t > HIPS) { yo.handL = [-3.4, -12.0]; yo.handR = [3.4, -12.0]; yo.bendL = 1.2; yo.bendR = 1.2; }
    parvati(yx, YY, YU, yo);
    camEnd();
    if (lt < .4) brushWipe(.5 + lt / .8, ['#F39A2E', KS.rkOrange]);
    caps(t);
  }

  // ================= E · the stick; the chase =================
  function shotChase(t, lt) {
    const q = seg(t, JUMP, CATCH);
    const kx = t < JUMP ? MX : lerp(MX + 60, 1080, easeOut(q)), cx = lerp(300, 820, ease(seg(t, JUMP, CATCH)));
    camK(t, [[E0, [300, 1095, .85]], [JUMP, [320, 1095, .85]], [CATCH, [860, 1095, .85]], [F0, [900, 1095, .86]]]);
    courtyardSet(t, { patch: false });
    churnPot(POTX, KY, t, { broken: 1, rod: false });
    mortar(MX, KY, MS);
    // the monkeys scatter
    const sc = seg(t, JUMP, JUMP + 1.4);
    if (sc < 1) {
      balHanuman(MX - 210 - sc * 700, KY, 22, { pose: 'stand', pal: MONKEY, eyes: 'wide', mouth: 'O', walk: t * 4, flip: true, boilKey: 'mk1', seed: 3, tail: 'stream', dy: -Math.abs(Math.sin(t * 12)) * .6 });
      balHanuman(MX + 220 - sc * 900, KY, 20, { pose: 'stand', pal: MONKEY, eyes: 'wide', mouth: 'open', walk: t * 4 + .5, flip: true, boilKey: 'mk2', seed: 4, tail: 'stream', dy: -Math.abs(Math.sin(t * 12 + 1)) * .6 });
    }
    // Kanha: on the mortar, spots her, jumps down and runs right
    const kf_ = kface(t, [[0, 'neutral', { eyes: 'look', mouth: 'smile' }], [SPOT, 'scared', { eyes: 'scared', mouth: 'O', emote: '!' }], [JUMP + .3, 'scared', { eyes: 'scared', mouth: 'wobble', emote: 'sweat' }]], .8);
    const jy = t < JUMP ? 0 : Math.max(0, 1 - (t - JUMP) / .35);
    const ky = t < JUMP ? KY - 180 * MS : lerp(KY, KY - 180 * MS, jy) - Math.sin(clamp((t - JUMP) / .35) * Math.PI) * 80;
    const ko = { ...kf_, pose: t < JUMP ? 'sit' : 'stand', boilKey: 'kanha', seed: 1, featherWob: t * 1.4, hx: t < JUMP ? -.6 : -.7, lookX: -.9, ...(t > JUMP + .3 ? run(t - JUMP, 3.8) : {}), handL: t > JUMP ? [-3.8, -11.4] : [-3.4, -6.4], handR: t > JUMP ? [3.8, -11.6] : [3.0, -6.0], handShapeL: 'open', handShapeR: 'open' };
    if (t > JUMP + .3) ko.rot = .1;
    // Maa: in from the left with the stick, after him, her hair coming loose, flowers falling
    const yq = seg(t, E0, CATCH), yx = t < JUMP ? lerp(-450, -120, easeOut(seg(t, E0, JUMP))) : lerp(-120, 900, ease(seg(t, JUMP, CATCH)));
    const yf = yface(t, [[0, 'angry', { eyes: 'normal', mouth: 'frown', emote: null }], [JUMP, 'determined', { eyes: 'normal', mouth: 'open', emote: 'anger' }], [CATCH, 'surprised', { eyes: 'normal', mouth: 'smile', emote: null }]]);
    const yo = { ...yf, ...Y, ...YSD_SKIN, boilKey: 'ysd', seed: 2, walk: t < CATCH ? (t - E0) * 2.8 : undefined, hx: .6, lookX: .9, lean: t < CATCH ? 1 : 0, dy: t < CATCH ? -Math.abs(Math.sin((t - E0) * 2.8 * Math.PI)) * .6 : 0,
      handR: [3.4, -20.6 + Math.sin(t * 9) * .6], bendR: 1, armR: (u, sw) => stick(u, sw, .4 + Math.sin(t * 9) * .3) };
    if (t > CATCH - .1) { const [hx, hy] = bkHand(kx, KY, KU, { ...ko, pose: 'stand' }, -1); yo.handL = [(hx - yx) / YU, (hy - YY) / YU]; yo.bendL = -1; }
    parvati(yx, YY, YU, yo);
    flowerFall(yx, YY - 22 * YU, t, seg(t, JUMP, JUMP + 1), 'jasA');
    kanha(kx, ky, KU, ko);
    if (t > CATCH - .1) yHand(yx, YY, YU, yo, -1, 'ygrab');
    camEnd();
    if (t > JUMP + .3 && t < CATCH) speed(540, 960, 1, 9, 260, 'chase');
    caps(t);
  }

  // ================= F · caught: tears and kajal; the stick goes =================
  const KXF = 1000, YXF = 1400;
  function shotCry(t, lt) {
    camK(t, [[F0, [1180, 1100, .9]], [THROW, [1190, 1100, .92]], [G0, [1190, 1100, .93]]]);
    courtyardSet(t, { patch: false });
    const sob = Math.sin(t * 14), rub = Math.sin(t * 10) * .4;
    const yf = yface(t, [[0, 'angry', { eyes: 'normal', mouth: 'frown' }], [F0 + .8, 'sad', { eyes: 'normal', mouth: 'frown', emote: null, tint: null }], [THROW, 'love', { eyes: 'closed', mouth: 'smile', emote: null, tint: null }]]);
    const th = seg(t, THROW, THROW + .7);
    const yo = { ...yf, ...Y, ...YSD_SKIN, boilKey: 'ysd', seed: 2, hx: -.5, lookX: -.8, lookY: .6, handL: [-3.6, -13.4], bendL: -1 };
    if (t < THROW) { yo.handR = [4.0, -13.6]; yo.armR = (u, sw) => stick(u, sw, .9); }
    else { const k = ease(seg(t, THROW, THROW + .2)); yo.handR = [lerp(3.4, 5.6, k), lerp(-18.6, -22, k)]; if (t > THROW + .4) { yo.handR = [3.0, -12.6]; yo.armR = (u, sw) => ropePile(0, 0, 1, t); } }
    parvati(YXF, YY, YU, yo);
    if (th > 0 && th < 1) { boilSeed('flystick'); push(); translate(YXF + 300 * th + 160, YY - 22 * YU - Math.sin(th * Math.PI) * 300 + th * 400); rotate(th * 9); paint(rrPts(-8, -170, 16, 340, 6), { wash: RS.bark, ink: RS.ink, sw: 1 }); pop(); }
    flowerFall(YXF, YY - 22 * YU, t, .6, 'jasF');
    kanha(KXF, KY, KU, { pose: 'stand', eyes: 'cry', mouth: 'wail', mouthK: 1 + .2 * sob, boilKey: 'kanha', seed: 1, featherWob: t * .7, dy: -Math.abs(sob) * .2, sq: .03 * sob,
      handL: [-1.4 + rub, -12.2], handR: [1.4 - rub, -12.2], handShapeL: 'fist', handShapeR: 'fist', hat: kajalSmear(ease(seg(t, F0, F0 + 1.4))) });
    camEnd();
    caps(t);
  }

  // ================= G · the ropes: always two fingers short =================
  const KXG = 520, YXG = 720, PILEX = 1010, MXG = 260;
  function shotRopes(t, lt) {
    const z1 = ease(seg(t, GAP1, GAP1 + .3)) * (1 - ease(seg(t, ADD - .4, ADD))), z2 = ease(seg(t, GAP2, GAP2 + .3)) * (1 - ease(seg(t, MANY - .3, MANY))), z = Math.max(z1, z2);
    const base = kf(t, [[G0, [700, 1100, .88]], [TIRED, [700, 1100, .88]], [H0, [640, 1110, .92]]]);
    const [bx, by] = bkBelly(KXG, KY, KU, { pose: 'stand' });
    camBegin(lerp(base[0], bx + 20, z), lerp(base[1], by - 30, z), lerp(base[2], 1.7, z));
    courtyardSet(t, { patch: false });
    mortar(MXG, KY, 1.1);
    // the neighbours in the doorway, laughing behind their hands
    if (t > GOPIS) {
      const gk = easeOut(seg(t, GOPIS, GOPIS + .6)), lg = Math.sin(t * 16);
      gopi(1330 - (1 - gk) * 200, KY - 40, 36, GOPI2, { eyes: 'happy', mouth: 'grin', hx: -.5, lookX: -.8, handR: [-.6, -18.6], bendR: 1, dy: -Math.abs(lg) * .3, boilKey: 'g2', seed: 6 });
      gopi(1200 - (1 - gk) * 260, KY, 40, GOPI1, { eyes: 'happy', mouth: 'grin', hx: -.6, lookX: -.8, handL: [-.4, -18.4], bendL: 1, handR: [3.0, -12.2], dy: -Math.abs(Math.sin(t * 16 + 1)) * .3, boilKey: 'g1', seed: 5 });
    }
    // the rope pile grows as she joins on rope after rope
    const nPile = t < ADD ? 0 : t < MANY ? 1 : 1 + Math.floor(clamp((t - MANY) / 2.6) * 8);
    ropePile(PILEX, KY, nPile, t);
    // the gap: closing as she pulls, then stuck at two fingers
    const wrap = (a, b) => seg(t, a, b);
    let gap = .55, w = 1;
    if (t < GAP1) { w = wrap(WRAP1, GAP1); gap = lerp(TAU, .55, ease(w)); }
    else if (t > ADD && t < GAP2) { w = wrap(WRAP2, GAP2); gap = t < WRAP2 ? .55 : lerp(1.6, .55, ease(w)); }
    else if (t > MANY && t < TIRED) gap = .55 + .45 * Math.abs(Math.sin((t - MANY) * 4));
    const tug = t > MANY && t < TIRED ? Math.sin((t - MANY) * 8) : 0;
    const kf_ = kface(t, [[0, 'neutral', { eyes: 'innocent', mouth: 'smile' }], [GAP1 + .2, 'playful', { eyes: 'wink', mouth: 'giggle' }], [ADD, 'neutral', { eyes: 'innocent', mouth: 'smile' }], [GAP2 + .2, 'playful', { eyes: 'happy', mouth: 'giggle' }], [TIRED, 'sad', { eyes: 'sad', mouth: 'O', emote: null }]]);
    const ko = { ...kf_, pose: 'stand', boilKey: 'kanha', seed: 1, featherWob: t * .7, hx: .4, lookX: .7, lookY: t > TIRED ? -.3 : 0, blush: .5, handL: [-3.4, -9.0], handR: [3.4, -9.0], handShapeL: 'open', handShapeR: 'open', rope: w > .05 || t > GAP1 ? belly(gap) : undefined,
      hat: kajalSmear(1), dy: (kf_.dy || 0) * .3 };
    if (t < WRAP1 + .1) ko.rope = undefined;
    // Maa: wrapping, pulling; to the pile and back; frantic; tired
    const yf = yface(t, [
      [0, 'determined', { eyes: 'normal', mouth: 'flat' }],
      [GAP1, 'surprised', { eyes: 'wide', mouth: 'O', emote: '!?' }],
      [ADD, 'determined', { eyes: 'normal', mouth: 'flat', emote: null }],
      [GAP2, 'surprised', { eyes: 'wide', mouth: 'O', emote: '!' }],
      [MANY, 'angry', { eyes: 'normal', mouth: 'open', emote: 'sweat', tint: null }],
      [TIRED, 'sad', { eyes: 'closed', mouth: 'O', emote: 'sweat', tint: null }],
    ]);
    const toPile = t > ADD && t < WRAP2 ? Math.sin(seg(t, ADD, WRAP2) * Math.PI) : t > MANY && t < TIRED ? Math.abs(Math.sin((t - MANY) * 2.4)) * .8 : 0;
    const yx = lerp(YXG, PILEX - 120, toPile);
    const yo = { ...yf, ...Y, ...YSD_SKIN, boilKey: 'ysd', seed: 2, hx: toPile > .5 ? .5 : -.5, lookX: toPile > .5 ? .7 : -.8, lookY: .6, lean: toPile > .5 ? 0 : -1.4, walk: toPile > .05 && toPile < .95 ? t * 2.6 : undefined, sweat: t > MANY ? 1 : 0, sq: t > TIRED ? .04 + .02 * Math.sin(t * 3) : 0 };
    if (toPile < .5) {
      const [hl, hr] = [[bx - 2.4 * KU, by + .5 * KU], [bx + 2.4 * KU, by + .6 * KU]];
      const pull = t < TIRED ? (tug || Math.sin(t * 6) * (t < GAP1 || (t > WRAP2 && t < GAP2) ? 1 : .3)) : 0;
      yo.handL = [(hl[0] - pull * 12 - yx) / YU, (hl[1] - yo.lean * 0 - YY) / YU]; yo.handR = [(hr[0] + pull * 12 - yx) / YU, (hr[1] - YY) / YU]; yo.bendL = -1; yo.bendR = -1;
    }
    parvati(yx, YY, YU, yo);
    kanha(KXG, KY, KU, ko);
    if (toPile < .5) { yHand(yx, YY, YU, yo, -1, 'yr1'); yHand(yx, YY, YU, yo, 1, 'yr2'); }
    flowerFall(yx, YY - 22 * YU, t, seg(t, MANY, TIRED + .5), 'jasG');
    // the two fingers: a little pair of tick marks on the gap while the camera's in close
    if (z > .3) { boilSeed('twof'); const gy = by + .2 * KU; for (const s of [-1, 1]) paint(rrPts(bx + s * 12 - 6, gy - 34, 12, 30, 6), { wash: '#FFF4C8', washOp: 220 * z, ink: KS.ink, sw: .8 }); glow(bx, gy, 90, RS.glow, .5 * z); }
    camEnd();
    caps(t);
  }

  // ================= H · he lets her: the rope closes =================
  function shotTied(t, lt) {
    camK(t, [[H0, [620, 1115, .94]], [CLOSE + .3, [600, 1120, .96]], [DAMODAR, [580, 1250, 1.25]], [I0, [570, 1280, 1.32]]]);
    courtyardSet(t, { patch: false });
    mortar(MXG, KY, 1.1);
    const c = ease(seg(t, CLOSE, CLOSE + .5));
    const kf_ = kface(t, [[0, 'sad', { eyes: 'sad', mouth: 'O' }], [H0 + .6, 'love', { eyes: 'closed', mouth: 'smile', emote: null, tint: null }], [CLOSE + .6, 'happy', { eyes: 'happy', mouth: 'grin', emote: null }]]);
    const [bx, by] = bkBelly(KXG, KY, KU, { pose: 'stand' });
    // the rope from his belly to the mortar
    if (c > .9) { ropeLine([[bx - 2.4 * KU, by + .3 * KU], [MXG + 140, KY - 60], [MXG + 70, KY - 120]], 12, 'tether'); }
    const yf = yface(t, [[0, 'sad', { eyes: 'closed', mouth: 'O', emote: 'sweat' }], [CLOSE, 'surprised', { eyes: 'wide', mouth: 'O', emote: '!' }], [CLOSE + .9, 'love', { eyes: 'closed', mouth: 'smile', emote: 'hearts' }]]);
    const yo = { ...yf, ...Y, ...YSD_SKIN, boilKey: 'ysd', seed: 2, hx: -.5, lookX: -.8, lookY: .6, lean: -1.4 };
    const [hl, hr] = [[bx - 2.4 * KU, by + .5 * KU], [bx + 2.4 * KU, by + .6 * KU]];
    yo.handL = [(hl[0] - YXG) / YU, (hl[1] - YY) / YU]; yo.handR = [(hr[0] - YXG) / YU, (hr[1] - YY) / YU]; yo.bendL = -1; yo.bendR = -1;
    if (t > CLOSE + .9) { yo.handL = [-3.3, -11.2]; yo.handR = [3.3, -11.2]; yo.lean = -.4; }
    parvati(YXG, YY, YU, yo);
    kanha(KXG, KY, KU, { ...kf_, pose: 'stand', boilKey: 'kanha', seed: 1, featherWob: t * .7, hx: .4, lookX: .6, lookY: -.3, blush: .9, nod: t > H0 + .6 && t < CLOSE ? .4 : 0, handL: [-3.4, -9.0], handR: [3.4, -9.0], handShapeL: 'open', handShapeR: 'open',
      rope: belly(lerp(.55, 0, c), { knot: c > .9, glow: Math.sin(c * Math.PI) }), hat: kajalSmear(1) });
    if (t < CLOSE + .9) { yHand(YXG, YY, YU, yo, -1, 'yt1'); yHand(YXG, YY, YU, yo, 1, 'yt2'); }
    if (c > 0 && c < 1) mayaDust(t, bx - 200, by - 300, bx, by + 30, c, 'tmaya');
    camEnd();
    if (lt < .4) brushWipe(.5 + lt / .8, [KS.pink, '#F7C0D8']);
    caps(t);
  }

  // ================= I · the twin arjuna trees =================
  const T1 = 1330, T2 = 1560, TX = (T1 + T2) / 2;
  function shotTrees(t, lt) {
    const shake = t > CRASH && t < CRASH + .6 ? Math.sin((t - CRASH) * 55) * 14 * (1 - seg(t, CRASH, CRASH + .6)) : 0;
    camK(t, [[I0, [1180, 1220, .9]], [STUCK, [1330, 1220, .9]], [DEVAS, [1420, 1210, .88]], [J0, [1440, 1210, .88]]], shake);
    courtyardSet(t, { patch: false });
    const fall = easeIn(seg(t, CRASH, CRASH + .55));
    // the devas rise where the trees stood (behind the fallen trunks)
    const dv = ease(seg(t, DEVAS, DEVAS + .8));
    if (dv > 0) for (const [dx, s] of [[T1 - 160, -1], [T2 + 280, 1]]) {
      glow(dx, KY - 380, 300 * dv, '#FFE6A0', .7 * dv);
      narada(dx, KY - (1 - dv) * 120, 22, { ...DEVA, col: DEVA.pal.skin, dk: DEVA.pal.skinDk, lt: DEVA.pal.skinLt, pray: ease(seg(t, DEVAS + .8, DEVAS + 1.2)), bow: ease(seg(t, DEVAS + 1.2, DEVAS + 1.8)) * .6, eyes: 'happy', mouth: 'smile', hx: -s * .5, lookX: -s * .6,
        hat: (u, sw) => { boilSeed('dcrown' + s); paint(U([[-2.6, -22.4], [-2.4, -24.4], [-1.2, -23.6], [0, -25.4], [1.2, -23.6], [2.4, -24.4], [2.6, -22.4]], u), { wash: '#F2C230', ink: '#3A2430', sw: sw * .7 }); },
        tint: '#FFE6A0', tintK: .25 * (1 - dv) + .05, boilKey: 'deva' + s, seed: s + 3, noShadow: dv < .9 });
    }
    arjunaTree(T1, KY - 30, 1.5, -fall * 1.45, t, 'tree1');
    arjunaTree(T2, KY - 30, 1.45, fall * 1.4, t, 'tree2');
    // Kanha walks right, dragging the mortar on its side; it jams across the gap between the trunks
    const wk = seg(t, I0, STUCK), kx = lerp(760, TX + 200, easeOut(wk));
    const mx = Math.min(kx - 280, TX - 10), stuck = kx - 280 > TX - 10;
    mortar(mx, KY - 6, .9, { rot: -1.5, key: 'mortarI' });
    const [bx, by] = bkBelly(kx, KY, KU, { pose: 'stand' });
    ropeLine([[bx - 1.4 * KU, by + .4 * KU], [lerp(bx, mx + 60, .5), KY - 40], [mx + 60, KY - 70]], 12, 'tetherI');
    const kf_ = kface(t, [[0, 'happy', { eyes: 'happy', mouth: 'grin' }], [STUCK, 'determined', { eyes: 'normal', mouth: 'puff', emote: null }], [CRASH, 'surprised', { eyes: 'wide', mouth: 'O', emote: '!' }], [DEVAS + .4, 'happy', { eyes: 'sparkle', mouth: 'grin', emote: null }]]);
    const ko = { ...kf_, pose: 'stand', boilKey: 'kanha', seed: 1, featherWob: t * .7, rope: belly(0, { knot: true }), hat: kajalSmear(1), hx: t > CRASH ? -.6 : .4, lookX: t > CRASH ? -.8 : .5,
      ...(wk > 0 && wk < 1 ? { walk: (t - I0) * 2.4 } : {}), rot: t > STUCK && t < CRASH ? .18 : 0, dy: (kf_.dy || 0) * .3 };
    kanha(kx, KY, KU, ko);
    if (t > CRASH && t < CRASH + 1.4) { boilSeed('dust'); const a = t - CRASH; for (let i = 0; i < 12; i++) { const dx = (hash(i * 2.1) - .5) * 900, r = (40 + hash(i) * 50) * (1 + a); paint(ellPts(TX + dx * (.4 + a), KY - 30 - hash(i * 3) * 80 - a * 60, r, r * .6, 12), { wash: '#E8D6B8', washOp: 220 * (1 - a / 1.4), ink: null }); } }
    camEnd();
    if (t > CRASH && t < CRASH + .1) flash(1 - (t - CRASH) / .1, '#FFFDF6');
    if (lt < .5) brushWipe(.5 + lt / 1.0, [KS.pink, '#F7C0D8']);
    caps(t);
  }

  // ================= J · the ask: a wink =================
  function shotAsk(t, lt) {
    camK(t, [[J0, [TX + 200, 1270, 1.35]], [CARD, [TX + 200, 1250, 1.45]]]);
    courtyardSet(t, { patch: false });
    arjunaTree(T1, KY - 30, 1.5, -1.45, t, 'tree1');
    arjunaTree(T2, KY - 30, 1.45, 1.4, t, 'tree2');
    mortar(TX - 10, KY - 6, .9, { rot: -1.5, key: 'mortarI' });
    const kx = TX + 200, [bx, by] = bkBelly(kx, KY, KU, { pose: 'stand' });
    ropeLine([[bx - 1.4 * KU, by + .4 * KU], [lerp(bx, TX + 50, .5), KY - 40], [TX + 50, KY - 70]], 12, 'tetherI');
    kanha(kx, KY, KU, { pose: 'stand', eyes: t > WINK && t < WINK + 1.2 ? 'wink' : 'happy', mouth: 'giggle', blush: .8, hx: 0, lookX: 0, boilKey: 'kanha', seed: 1, featherWob: t * .7, rope: belly(0, { knot: true }), hat: kajalSmear(1),
      handL: [-2.4, -8.0], handR: [3.2 + Math.sin(t * 9) * .3, -13.4 + Math.sin(t * 9) * .6], handShapeR: 'open', dy: -Math.abs(Math.sin(t * 3)) * .3 });
    camEnd();
    if (t > CARD - .3) { flushLetters(); brushWipe((t - (CARD - .3)) / .6, ['#F39A2E', KS.rkOrange]); }
    caps(t);
  }

  // ================= K · the card =================
  function shotCard(t, lt) {
    followCard(t, { card: CARD, follow: FOLLOW, pill: PILL, next: ['Part 3:', 'Narad Muni visits 16,108 palaces'], baby: () => {
      const wave = Math.sin(t * 9) * .7;
      balKrishna(470, 1135, 19, { pose: 'sit', eyes: 'happy', mouth: 'grin', blush: .6, handR: [3.6 + wave * .3, -11.5 + wave], handShapeR: 'open', handL: [-2.2, -5.2], boilKey: 'cbaby', seed: 2, dy: -Math.abs(Math.sin(t * 4)) * .3, noShadow: true });
    } });
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, ['#F39A2E', KS.rkOrange]); }
  }

  shots([[0, shotHook], [B0, shotChurn], [C0, shotSmash], [D0, shotMonkeys], [E0, shotChase], [F0, shotCry], [G0, shotRopes], [H0, shotTied], [I0, shotTrees], [J0, shotAsk], [CARD, shotCard]]);
})();
