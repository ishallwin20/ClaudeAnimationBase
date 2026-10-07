// union.js: "Maa Durga's LION just went ON STRIKE.", a 51 s captioned reel for Navratri: the vahana union's dharna, the
// nine-night duty roster, Brahmacharini walks in; the card sells Books 1–3 as Nights 1–3. Storyboard: STORYBOARD.md.
// Set and props: union_props.js. All times are video time (t); the SFX (tools/union_sfx.mjs) uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/union_sfx.mjs)
  const YELL = 1.0, PULL = 2.3, CHANT = 2.95, LATE = 3.75, GLANCE = 3.95, B0 = 5.2;
  const ROSTER_T = 5.2, LION0 = 7.9, BEANS = [8.5, 8.85, 9.2, 9.55], NAMES = 10.3, TIG0 = 12.3, STAMP3 = 12.7, ARMS = 14.4,
    NAN0 = 16.6, STAMP18 = [17.0, 17.35], SHIVA = 18.6, DNK0 = 20.8, STAMP7 = 21.2, WHY = 22.8, TWITCH = 23.4,
    N2 = 25.2, WALKS = 27.1, FEET = 27.5, GASP = 27.6;
  const ENTER = 29.3, NOTICE = 29.8, HIDE = 30.1, EAT = 30.4, VIRTUE = 31.8, TAGS = [32.4, 32.9, 33.4, 33.9], LIFT = 35.6,
    WALK = 37.4, EXIT = 38.2, FLIP = 39.8, FLIPS = [40.0, 40.25, 40.45], STRIKE = 40.9, BOARD = 42.9, ASK = 43.5, WIPE = 46.5;
  const CARD = 46.8, CARD_CAP = 46.9, COVERS = 47.1, PRICE = 47.9, LOGO = 48.2, PILL = 48.5, FOLLOW = 48.9;

  const GOLDC = '#F5C542';
  const inW = (t, a, b) => t >= a && t < b;
  const talkK = (t, sp = 13, ph = 0) => .35 + .75 * Math.abs(Math.sin(t * sp + ph));
  // a face timeline: the latest key wins, with a quick squint across every change so nothing snaps
  function acts(t, keys) {
    let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
    let sq = 0; for (const [k] of keys) sq = Math.max(sq, 1 - Math.abs(t - k) / .07);
    return { ...keys[i][1], squint: Math.max(keys[i][1].squint || 0, sq * .9) };
  }
  const L2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

  // ---- the cast, in world space (the wide shot is camera (540, 1010) at zoom 1)
  const LX = 540, LY = 1450, LU = 27;          // Sher, centre front
  const TX = 815, TY = 1335, TU = 21;          // the tigress, behind him on the right
  const NX = 205, NY = 1335, NU = 17.5;        // Nandi, kneeling, behind on the left, facing right
  const DX = 860, DY = 1515, DU = 16;          // the donkey, front right, facing left
  const BY = 1610, BU = 24;                    // Brahmacharini walks along the front

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ["Maa Durga's LION", 520, -1, PULL + .1 + 1, 96, GOLDC], ['just went ON STRIKE.', 628, -1, PULL + .1 + 1, 70],
    ['Navratri: 9 nights, 9 forms of Maa.', 600, ROSTER_T + .15, LION0 - ROSTER_T - .2, 52], ['And SOMEONE has to carry her.', 695, ROSTER_T + .55, LION0 - ROSTER_T - .6, 58, GOLDC],
    ['I carry Maa on', 600, LION0 + .1, NAMES - LION0 - .15, 58], ['FOUR nights!', 695, LION0 + .2, NAMES - LION0 - .25, 100, GOLDC],
    ['Kushmanda · Skandamata', 600, NAMES, TIG0 - NAMES - .05, 52, GOLDC], ['Katyayani · Siddhidatri', 695, NAMES + .1, TIG0 - NAMES - .15, 52, GOLDC],
    ['Night 3? ME.', 600, TIG0 + .1, ARMS - TIG0 - .15, 70], ['(for Chandraghanta)', 695, TIG0 + .25, ARMS - TIG0 - .3, 50, GOLDC],
    ['She has TEN arms.', 600, ARMS, NAN0 - ARMS - .05, 66, GOLDC], ['Know how HEAVY that is?', 695, ARMS + .4, NAN0 - ARMS - .45, 56],
    ['Nights 1 AND 8.', 600, NAN0 + .1, SHIVA - NAN0 - .15, 68], ['Shailputri · Mahagauri', 695, NAN0 + .3, SHIVA - NAN0 - .35, 52, GOLDC],
    ['And the REST of the year?', 600, SHIVA, DNK0 - SHIVA - .05, 58], ['SHIVA.', 695, SHIVA + .5, DNK0 - SHIVA - .55, 112, GOLDC],
    ['Night 7. Kalaratri.', 600, DNK0 + .1, WHY - DNK0 - .15, 64], ['ME!', 695, STAMP7, WHY - STAMP7 - .05, 100, GOLDC],
    ['And EVERY year someone asks…', 600, WHY, N2 - WHY - .05, 52], ['"WHY a DONKEY?!"', 695, WHY + .5, N2 - WHY - .55, 82, GOLDC],
    ['And Night 2?', 600, N2 + .1, WALKS - N2 - .15, 88],
    ['Brahmacharini WALKS.', 600, WALKS, ENTER - WALKS - .05, 66], ['BAREFOOT.', 695, FEET, ENTER - FEET - .05, 100, GOLDC],
    ['…and then SHE walked in.', 600, ENTER + .2, VIRTUE - ENTER - .3, 62],
    ['Maa chose each of you', 600, VIRTUE, LIFT - VIRTUE - .05, 56], ['for a VIRTUE.', 695, VIRTUE + .2, LIFT - VIRTUE - .25, 74, GOLDC],
    ['Need a lift, Maa?', 600, LIFT, WALK - LIFT - .05, 70],
    ['Some journeys', 600, WALK, FLIP + .2 - WALK, 62], ['you WALK yourself.', 695, WALK + .25, FLIP - WALK, 80, GOLDC],
    ['Strike OFF.', 600, STRIKE, BOARD - STRIKE - .05, 70], ['NAVRATRI ON!', 700, STRIKE + .15, BOARD - STRIKE - .2, 104, GOLDC],
    ['Tag the LION of your house', 1335, ASK, WIPE - ASK + .1, 60, GOLDC], ['(the one who does ALL the work)', 1428, ASK + .15, WIPE - ASK - .05, 44],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };
  // a shout out of the megaphone / the crowd: red letters with a cream edge, screen space
  function shout(txt, x, y, size, age, life = 1.2, rot = -.08) {
    if (age < 0 || age > life) return;
    letter(txt, x, y, size, '#C8323A', { screen: true, pop: age * 5, rot: rot + Math.sin(age * 22) * .03 * (1 - age / life), alpha: 1 - seg(age, life - .2, life), stroke: UN.cream, sw: .2, ink: false, maxW: 860 });
  }

  // ---- the camera: [t, [cx, cy, zoom]]
  const WIDE = [540, 1075, 1.12];
  const CAMK = [
    [0, [540, 1044, 2.6]], [PULL, [540, 1044, 2.6]], [CHANT, WIDE],
    [LION0, WIDE], [LION0 + .35, [560, 1100, 1.5]],
    [TIG0, [560, 1100, 1.5]], [TIG0 + .35, [790, 1025, 1.55]],
    [NAN0, [790, 1025, 1.55]], [NAN0 + .35, [320, 1110, 1.75]],
    [DNK0, [320, 1110, 1.75]], [DNK0 + .35, [770, 1260, 1.85]],
    [N2, [770, 1260, 1.85]], [N2 + .45, WIDE],
    [LIFT - .2, WIDE], [LIFT + .25, [400, 1180, 1.3]],
    [EXIT, [400, 1180, 1.3]], [FLIP, WIDE],
  ];

  // ---- the megaphone's pose at t: [mouthpiece x, y (world), angle, mirror, inFront]
  const MS = 40;
  function megaPose(t, lo) {
    const m = lionMouth(LX, LY, LU, lo), atMouth = [m[0] - 6, m[1] + 6, Math.PI + .2, true];
    const ground = [LX - 150, LY - 34, Math.PI - .05, true], behind = [LX - 10, LY - 200, Math.PI - .3, true];
    const mix = (a, b, k, h = 60) => { const p = arcPt([a[0], a[1]], [b[0], b[1]], h, k); return [p[0], p[1], lerp(a[2], b[2], k), true]; };
    if (t < B0 + .1) return [...atMouth, true];
    if (t < B0 + .55) return [...mix(atMouth, ground, ease(seg(t, B0 + .1, B0 + .55))), true];
    if (t < HIDE) return [...ground, false];
    if (t < HIDE + .4) return [...mix(ground, behind, ease(seg(t, HIDE, HIDE + .4)), 30), false];
    if (t < FLIP + .05) return [...behind, false];
    if (t < FLIPS[0]) return [...mix(behind, atMouth, easeOut(seg(t, FLIP + .05, FLIPS[0])), 80), true];
    return [...atMouth, true];
  }
  // a world point → the lion's body u (through his dx / dy / sq)
  const toLion = (w, lo) => { const sq = (lo.sq || 0) + (lo.take || 0); return [(w[0] - LX - (lo.dx || 0) * LU) / (1 + sq * .6) / LU, (w[1] - LY - (lo.dy || 0) * LU) / (1 - sq) / LU]; };
  const megaPt = (mp, lx, ly) => { const [x, y, a, mir] = mp, c = Math.cos(a), s = Math.sin(a), yy = mir ? -ly : ly; return [x + lx * c - yy * s, y + lx * s + yy * c]; };

  // ================= Sher =================
  function lionOpts(t) {
    const f = acts(t, [
      [-9, { eyes: 'angry', mouth: 'flat' }],
      [YELL, { eyes: 'angry', mouth: 'talk', mane: .6 }], [2.45, { eyes: 'angry', mouth: 'flat' }],
      [CHANT, { eyes: 'angry', mouth: 'talk' }], [GLANCE, { eyes: 'side', mouth: 'flat', lookX: 1, lookY: .5 }],
      [B0 + .5, { eyes: 'normal', mouth: 'smile', lookY: -1 }],
      [LION0, { eyes: 'angry', mouth: 'talk' }], [NAMES, { eyes: 'tired', mouth: 'frown', emote: 'anger' }],
      [TIG0, { eyes: 'normal', mouth: 'flat', lookX: 1 }], [ARMS + .5, { eyes: 'sad', mouth: 'frown', lookX: 1, worry: .7 }],
      [NAN0, { eyes: 'normal', mouth: 'flat', lookX: -1 }], [SHIVA + .55, { eyes: 'side', mouth: 'wobble', lookX: -1 }],
      [DNK0, { eyes: 'normal', mouth: 'smile', lookX: 1, lookY: .5 }], [TWITCH, { eyes: 'wide', mouth: 'O', lookX: 1, lookY: .5 }],
      [N2, { eyes: 'normal', mouth: 'flat', lookY: -1 }], [WALKS, { eyes: 'normal', mouth: 'talk' }], [GASP, { eyes: 'wide', mouth: 'O' }],
      [ENTER + .4, { eyes: 'wide', mouth: 'O', lookX: -1 }],
      [HIDE, { eyes: 'side', mouth: 'O', lookX: 1, lookY: -.6, blush: .3 }],
      [VIRTUE, { eyes: 'normal', mouth: 'smile', lookX: -1 }], [TAGS[0], { eyes: 'happy', mouth: 'grin' }],
      [TAGS[0] + 1.4, { eyes: 'normal', mouth: 'smile', lookX: -1 }],
      [LIFT, { eyes: 'normal', mouth: 'talk', lookX: -1, blush: .7, brows: .6 }],
      [WALK, { eyes: 'wide', mouth: 'O', lookX: -1, worry: .5 }], [WALK + 1.1, { eyes: 'happy', mouth: 'smile', blush: .4 }],
      [FLIP, { eyes: 'normal', mouth: 'smile', lookX: -.7, lookY: .5 }],
      [FLIPS[0], { eyes: 'happy', mouth: 'talk' }], [FLIPS[0] + 1.6, { eyes: 'happy', mouth: 'grin' }],
    ]);
    const o = { ...f, boilKey: 'sher', seed: 1, hat: lionBand({ wind: inW(t, YELL, 2.4) ? .4 : 0 }) };
    // talking: the yell is bigger
    if (o.mouth === 'talk') o.mouthK = inW(t, YELL, 2.45) || inW(t, FLIPS[0], FLIPS[0] + 1.6) ? .9 + .4 * Math.abs(Math.sin(t * 9)) : talkK(t);
    // the breath: a wind-up into the yell, a proud puff at COURAGE, a small idle breath otherwise
    o.inhale = t < YELL ? lerp(.35, 1, ease(seg(t, 0, YELL))) : t < 2.45 ? .7 : .12 + .08 * Math.sin(t * 2.4);
    o.inhale = Math.max(o.inhale, inW(t, TAGS[0], TAGS[0] + 1.6) ? .9 * seg(t, TAGS[0], TAGS[0] + .25) * (1 - seg(t, TAGS[0] + 1.3, TAGS[0] + 1.6)) : 0);
    o.wind = inW(t, YELL, 2.45) ? .25 * Math.sin(t * 30) : 0;
    const tk = take(t, NOTICE, 1.1), tg = take(t, GASP, .7), ty = take(t, YELL, .4);
    o.sq = tk.sq + tg.sq + ty.sq; o.dy = tk.dy + tg.dy + ty.dy;
    if (t > FLIPS[0]) o.dy += -Math.abs(Math.sin((t - FLIPS[0]) * 5.2)) * .5;   // bouncing, cheering
    if (inW(t, NAMES, TIG0)) o.emoteK = seg(t, NAMES + .05, NAMES + .3), o.emoteAge = t - NAMES;
    // a nod while he talks
    o.nod = (o.mouth === 'talk' ? .12 * Math.sin(t * 6) : 0) + (inW(t, HIDE, VIRTUE) ? -.2 : 0);
    o.hx = inW(t, HIDE + .1, VIRTUE) ? .5 * ease(seg(t, HIDE + .1, HIDE + .3)) : 0;
    // paws
    const mp = megaPose(t, o);
    if (mp[4]) { const g = megaPt(mp, MS * .99, MS * .72); o.pawL = toLion(g, o); o.pawShapeL = 'hold'; }
    else if (inW(t, B0 + .55, B0 + .8)) { o.pawL = L2(toLion(megaPt(megaPose(B0 + .55, o), MS * .99, MS * .72), o), [-1.05, -.55], ease(seg(t, B0 + .55, B0 + .8))); o.pawShapeL = 'hold'; }
    else if (inW(t, 8.15, 12.2)) {   // counting four nights on the toe beans
      const up = easeOut(seg(t, 8.15, 8.45)) * (1 - ease(seg(t, 11.85, 12.2)));
      o.pawL = L2([-1.05, -.55], [-4.5, -12.2 + .15 * Math.sin(t * 5)], up); o.pawShapeL = 'pad';
      o.beans = BEANS.reduce((n, b) => n + clamp((t - b) * 8), 0);
    } else if (inW(t, HIDE - .2, HIDE + .6)) {   // shove the megaphone behind him
      const g0 = megaPt(megaPose(HIDE, o), MS * 1.4, -MS * .2), k1 = ease(seg(t, HIDE - .2, HIDE)), k2 = ease(seg(t, HIDE + .4, HIDE + .6));
      const g = t < HIDE ? toLion(g0, o) : toLion(megaPt(mp, MS * 1.4, -MS * .2), o);
      o.pawL = L2(L2([-1.05, -.55], g, k1), [-1.05, -.55], k2); o.pawShapeL = 'hold';
    } else if (inW(t, FLIP - .2, FLIP + .05)) { o.pawL = L2([-1.05, -.55], [-2.2, -6.5], ease(seg(t, FLIP - .2, FLIP + .05))); o.pawShapeL = 'hold'; }
    if (inW(t, B0 + .6, LION0)) {   // the other paw points up at the roster
      const k = easeOut(seg(t, B0 + .6, B0 + .9)) * (1 - ease(seg(t, LION0 - .3, LION0)));
      o.pawR = L2([1.05, -.55], [3.6, -13.8], k); o.pawShapeR = 'pad';
    } else if (inW(t, LIFT, WALK + .4)) {   // "need a lift?": thumbing at his back, sheepish
      const k = easeOut(seg(t, LIFT, LIFT + .3)) * (1 - ease(seg(t, WALK + .1, WALK + .4)));
      o.pawR = L2([1.05, -.55], [3.9, -11.0 + .3 * Math.sin(t * 7)], k); o.pawShapeR = 'pad'; o.pawAR = lerp(-1.4, .4, k);
    } else if (t > FLIPS[0] + .1) {  // a fist pump
      const k = easeOut(seg(t, FLIPS[0] + .1, FLIPS[0] + .35));
      o.pawR = L2([1.05, -.55], [3.8, -14.2 + 1.2 * Math.abs(Math.sin((t - FLIPS[0]) * 5.2))], k); o.pawShapeR = 'hold';
    }
    o.held = mp[4] ? (u, sw) => {
      const sq = (o.sq || 0), X0 = LX + (o.dx || 0) * LU, Y0 = LY + (o.dy || 0) * LU;
      push(); scale(1 / (1 + sq * .6), 1 / (1 - sq)); translate(-X0, -Y0);
      megaphone(mp[0], mp[1], mp[2], MS, { mirror: true, yell: inW(t, YELL, 2.45) || inW(t, CHANT, CHANT + .9) || inW(t, FLIPS[0], FLIPS[0] + 1.5) ? 1 : 0, key: 'm' });
      pop();
    } : null;
    o._mp = mp;
    return o;
  }

  // ================= the tigress =================
  function tigerOpts(t) {
    const f = acts(t, [
      [-9, { eyes: 'tired', mouth: 'flat' }], [CHANT, { eyes: 'angry', mouth: 'talk' }], [GLANCE, { eyes: 'side', mouth: 'flat', lookX: .4, lookY: .8 }],
      [B0 + .5, { eyes: 'tired', mouth: 'flat', lookY: -1 }], [LION0, { eyes: 'tired', mouth: 'flat', lookX: -1 }],
      [TIG0, { eyes: 'tired', mouth: 'talk' }], [STAMP3 + .4, { eyes: 'normal', mouth: 'smirk' }],
      [ARMS, { eyes: 'tired', mouth: 'talk' }], [ARMS + 1.6, { eyes: 'tired', mouth: 'frown' }],
      [NAN0, { eyes: 'tired', mouth: 'flat', lookX: -1 }], [DNK0, { eyes: 'normal', mouth: 'flat', lookX: -.5, lookY: .9 }],
      [N2, { eyes: 'normal', mouth: 'flat', lookY: -1, lookX: -.6 }], [GASP, { eyes: 'wide', mouth: 'O' }],
      [ENTER + .4, { eyes: 'wide', mouth: 'O', lookX: -1 }], [HIDE + .2, { eyes: 'side', mouth: 'smile', lookX: -1 }],
      [VIRTUE, { eyes: 'normal', mouth: 'smile', lookX: -1 }], [TAGS[1], { eyes: 'happy', mouth: 'grin' }], [TAGS[1] + 1.4, { eyes: 'normal', mouth: 'smile', lookX: -1 }],
      [WALK + 1.1, { eyes: 'happy', mouth: 'smile' }], [FLIPS[1], { eyes: 'happy', mouth: 'talk' }], [FLIPS[1] + 1.4, { eyes: 'happy', mouth: 'grin' }],
    ]);
    const o = { kind: 'tiger', ...f, boilKey: 'tiger', seed: 3, hat: lionBand({}) };
    if (o.mouth === 'talk') o.mouthK = talkK(t, 12, 1);
    o.slump = inW(t, ARMS + .2, NAN0 + .6) ? ease(seg(t, ARMS + .2, ARMS + .6)) * .9 * (1 - ease(seg(t, NAN0, NAN0 + .6))) : .15;
    o.inhale = inW(t, TAGS[1], TAGS[1] + 1.6) ? .9 * seg(t, TAGS[1], TAGS[1] + .25) * (1 - seg(t, TAGS[1] + 1.3, TAGS[1] + 1.6)) : 0;
    const tk = take(t, NOTICE + .05, .9), tg = take(t, GASP + .05, .6); o.sq = tk.sq + tg.sq; o.dy = tk.dy + tg.dy;
    if (t > FLIPS[1]) o.dy += -Math.abs(Math.sin((t - FLIPS[1]) * 5.2 + 1)) * .45;
    o.nod = o.mouth === 'talk' ? .1 * Math.sin(t * 6.5) : 0;
    // the placard pole in her right paw: down at the side, pumped up in the chant, hidden behind her, up again to flip
    const up = inW(t, CHANT - .1, GLANCE + .3) ? Math.abs(Math.sin((t - CHANT) * 6)) : 0;
    const hide = ease(seg(t, HIDE, HIDE + .3)) * (1 - easeOut(seg(t, FLIPS[1] - .3, FLIPS[1])));
    o.pawR = [2.6 + up * .2 + hide * .6, -8.4 - up * 2.2 + hide * 6.2 - (t > FLIPS[1] ? 2.6 * Math.abs(Math.sin((t - FLIPS[1]) * 5.2 + 1)) * seg(t, FLIPS[1], FLIPS[1] + .3) : 0)];
    o.pawShapeR = 'hold';
    if (inW(t, TIG0 + .1, STAMP3 + 1.0)) { const k = easeOut(seg(t, TIG0 + .1, TIG0 + .35)) * (1 - ease(seg(t, STAMP3 + .7, STAMP3 + 1.0))); o.pawL = L2([-1.05, -.55], [-.2, -7.4], k); o.pawShapeL = 'pad'; }
    else if (inW(t, ARMS + .3, NAN0 + .3)) { const k = easeOut(seg(t, ARMS + .3, ARMS + .6)) * (1 - ease(seg(t, NAN0, NAN0 + .3))); o.pawL = L2([-1.05, -.55], [-3.6, -5.6 + .35 * Math.sin(t * 9)], k); o.pawShapeL = 'pad'; }
    o._hide = hide;
    return o;
  }

  // ================= Nandi =================
  function nandiOpts(t) {
    const o = { kneel: 1, eyes: 'normal', boilKey: 'nandi', seed: 2, tail: Math.sin(t * 1.4) * .5 };
    o.nod = inW(t, CHANT, GLANCE) ? .22 * Math.abs(Math.sin((t - CHANT) * 7)) : 0;
    if (inW(t, NAN0 + .1, SHIVA + .5) || inW(t, SHIVA, SHIVA + .5)) o.nod += .09 * Math.sin(t * 7);
    o.lookX = inW(t, GLANCE, B0 + .5) ? 1 : inW(t, LION0, NAN0) ? 1 : inW(t, DNK0, N2) ? 1 : 0;
    o.lookY = inW(t, B0 + .5, LION0) || inW(t, N2, ENTER) || inW(t, HIDE + .2, VIRTUE) ? -1 : 0;
    if (inW(t, SHIVA + .55, SHIVA + 1.25)) o.eyes = 'closed';   // the long-suffering blink
    o.snort = inW(t, SHIVA + 1.1, SHIVA + 2.1) ? seg(t, SHIVA + 1.1, SHIVA + 2.1) : 0;
    if (inW(t, GASP, GASP + 1.2) || inW(t, NOTICE, HIDE + .2)) o.eyes = 'wide';
    if (inW(t, TAGS[2], TAGS[2] + 1.5)) { o.eyes = 'happy'; o.nod = -.28 * seg(t, TAGS[2], TAGS[2] + .25) * (1 - seg(t, TAGS[2] + 1.2, TAGS[2] + 1.5)); }
    if (t > WALK + 1.1) o.eyes = 'happy';
    if (t > FLIPS[2]) o.nod = -.15 * Math.abs(Math.sin((t - FLIPS[2]) * 5.2 + 2));
    return o;
  }
  // ================= the donkey =================
  function donkeyOpts(t) {
    const o = { flip: true, eyes: 'normal', boilKey: 'donkey', seed: 4, lookX: .3 };
    if (inW(t, LATE, LATE + .55)) o.bray = .45 * Math.abs(Math.sin((t - LATE) * 9));
    if (inW(t, GLANCE + .1, B0 + .8)) { o.ears = -1 * ease(seg(t, GLANCE + .1, GLANCE + .4)); o.eyes = 'wide'; }
    if (inW(t, DNK0 + .1, WHY + 2.2)) o.grin = .35 * Math.abs(Math.sin(t * 11));
    if (inW(t, STAMP7, WHY)) { o.eyes = 'happy'; o.nod = -.18; }
    if (inW(t, TWITCH, N2 + .4)) { o.eyes = 'angry'; o.ears = 1; o.dx = Math.sin(t * 70) * .08 * (1 - seg(t, TWITCH + 1.2, N2)); o.earL = .6 + .4 * Math.sin(t * 40); }
    if (inW(t, N2, ENTER)) o.lookY = -1;
    if (inW(t, GASP, GASP + 1.2) || inW(t, NOTICE, EAT)) o.eyes = 'wide';
    if (inW(t, EAT, EAT + 1.0)) { o.grin = .5 * Math.abs(Math.sin((t - EAT) * 14)); o.eyes = 'normal'; o.lookX = 1; }
    if (inW(t, EAT + .95, EAT + 1.3)) o.nod = .25 * Math.sin(seg(t, EAT + .95, EAT + 1.3) * Math.PI);   // gulp
    if (inW(t, TAGS[3], TAGS[3] + 1.5)) { o.eyes = 'happy'; o.nod = -.25 * seg(t, TAGS[3], TAGS[3] + .25) * (1 - seg(t, TAGS[3] + 1.2, TAGS[3] + 1.5)); }
    if (t > WALK + 1.1) o.eyes = 'happy';
    if (t > FLIPS[2] + .15) { o.bray = Math.max(0, Math.sin((t - FLIPS[2] - .15) * 4)) * (t < FLIPS[2] + 1.0 ? 1 : .3); o.eyes = 'closed'; }
    const tk = take(t, NOTICE + .1, .8); o.dy = (o.dy || 0) + tk.dy * .6;
    return o;
  }
  // ================= Brahmacharini =================
  function brcPos(t) {
    if (t < ENTER) return null;
    if (t < ENTER + 1.7) { const k = ease(seg(t, ENTER, ENTER + 1.7)); return { x: lerp(-190, 165, k), walk: lerp(-190, 165, k) / (5 * BU) }; }
    if (t < EXIT) return { x: 165 };
    const k = easeIn(seg(t, EXIT, EXIT + 1.9)) * .4 + seg(t, EXIT, EXIT + 1.9) * .6, x = lerp(165, 1300, k);
    return x > 1250 ? null : { x, walk: x / (5 * BU) };
  }

  // ================= the main shot =================
  function shotMain(t) {
    const cam = kf(t, CAMK);
    let [sx, sy] = [0, 0];
    if (inW(t, YELL, YELL + .5)) [sx, sy] = shakeXY(t, 9 * (1 - seg(t, YELL, YELL + .5)));
    if (inW(t, FLIPS[0], FLIPS[0] + .4)) [sx, sy] = shakeXY(t, 6 * (1 - seg(t, FLIPS[0], FLIPS[0] + .4)));
    camBegin(cam[0] + sx, cam[1] + sy, cam[2]);
    const lo = lionOpts(t), to = tigerOpts(t), no = nandiOpts(t), dn = donkeyOpts(t), bp = brcPos(t);
    unionSet(t, { banner: t < ROSTER_T + .3, warm: bp ? .6 * seg(t, ENTER, ENTER + 1) * (1 - seg(t, EXIT + .6, EXIT + 1.6)) : 0 });

    // ---- Nandi, his NO RIDES board hung from his neck (swung behind him while she's there)
    const nHide = ease(seg(t, HIDE, HIDE + .3)) * (1 - easeOut(seg(t, FLIPS[2] - .3, FLIPS[2])));
    const nHang = nandiWorld(NX, NY, NU, no, 6.0, -8.2), nBoard = nandiWorld(NX, NY, NU, no, 4.6, -3.6);
    const nPl = { txt: 'NO RIDES', back: 'JAI MATA DI', w: 150, h: 84, hang: nHang, key: 'n', size: 30, flip: seg(t, FLIPS[2], FLIPS[2] + .3), rot: .05 * Math.sin(t * 2) };
    if (nHide > .5) placard(nBoard[0], nBoard[1] - 30, 150, 84, { ...nPl, noText: true, rot: -.4 });
    nandi(NX, NY, NU, no);
    sideBand(...nandiWorld(NX, NY, NU, no, 7.2, -11.2, true), NU, -1.15 + (no.nod || 0), -1, 'n');
    if (nHide <= .5) placard(nBoard[0], nBoard[1], 150 * (1 - nHide * .6), 84, { ...nPl, rot: nPl.rot - nHide * 1.2 });

    // ---- the tigress and her placard (behind her)
    const tp = lionPaw(TX, TY, TU, to, 1), tPole = 200;
    placard(tp[0] + 4, tp[1] - tPole, 180, 104, { txt: 'BACK PAIN!', back: 'JAI MATA DI', pole: tPole + 30, key: 't', size: 34, rot: .06 + .04 * Math.sin(t * 2.2), flip: seg(t, FLIPS[1] + .05, FLIPS[1] + .35), noText: to._hide > .3 });
    lion(TX, TY, TU, to);

    // ---- the megaphone on the ground / behind him, then Sher
    if (!lo._mp[4]) megaphone(lo._mp[0], lo._mp[1], lo._mp[2], MS, { mirror: true, key: 'g' });
    lion(LX, LY, LU, lo);

    // ---- the donkey, RESPECT in his teeth (eaten at EAT)
    donkey(DX, DY, DU, dn);
    sideBand(...donkeyWorld(DX, DY, DU, dn, 5.2, -11.6, true), DU, .9 - (dn.nod || 0), 1, 'd');
    const eat = ease(seg(t, EAT, EAT + .9));
    if (eat < 1) {
      const m = donkeyMuzzle(DX, DY, DU, dn), k = 1 - eat;
      placard(m[0] + 4, m[1] + 64 * k + 6, 132 * k, 68 * k, { txt: 'RESPECT', hang: [m[0], m[1] + 4], key: 'd', size: 28 * k, rot: -.06 + .05 * Math.sin(t * 3) + (inW(t, TWITCH, N2) ? .12 * Math.sin(t * 60) : 0), noText: eat > .4 });
    }

    // ---- Brahmacharini, walking along the front
    if (bp) {
      const shake = inW(t, WALK + .1, WALK + .8) ? .35 * Math.sin((t - WALK) * 16) * (1 - seg(t, WALK + .5, WALK + .8)) : 0;
      brahmacharini(bp.x, BY, BU, { walk: bp.walk, aura: .45, eyes: inW(t, WALK + .3, WALK + .9) ? 'happy' : 'normal', mouth: inW(t, VIRTUE, VIRTUE + 1.2) ? (Math.sin(t * 12) > 0 ? 'smile' : 'o') : 'smile',
        hx: bp.walk != null ? (t > EXIT ? .4 : -.2) : inW(t, VIRTUE, LIFT) ? .45 : inW(t, LIFT, EXIT) ? .35 + shake : 0, lookX: inW(t, VIRTUE, EXIT) ? .7 : 0,
        malaSwing: Math.sin(t * 3), boilKey: 'brc', seed: 5 });
    }

    // ---- the virtue tags
    const tagAt = [[LX, 955, 'COURAGE', 250], [TX - 20, 925, 'POWER', 190], [NX + 150, 1075, 'PATIENCE', 230], [DX - 70, 1240, 'HUMILITY', 230]];
    tagAt.forEach(([x, y, txt, w], i) => { if (inW(t, TAGS[i], LIFT - .1)) virtueTag(x, y, txt, t - TAGS[i], { w }); });
    for (const [i, x, y] of [[0, LX, 955], [1, TX - 20, 925], [2, NX + 150, 1075], [3, DX - 70, 1240]]) sparkleBurst(x, y, 90, t - TAGS[i], 'tagb' + i);
    camEnd();

    // ---- screen-space: shouts, petals, the roster, captions
    shout('HAMARI MAANGEIN…', 450, 765, 80, t - YELL, 2.45 - YELL);
    shout('…POORI KARO!!', 520, 790, 100, t - CHANT, LATE - CHANT, -.06);
    shout('…karo.', 640, 1170, 52, t - LATE, GLANCE + .7 - LATE, .05);
    shout('JAI MATA DI!', 470, 700, 104, t - FLIPS[0], STRIKE - FLIPS[0] + .05);
    petalRain(t, FLIPS[0] + .1, { n: 30 });
    if (t > BOARD) veil(UN.night, .5 * seg(t, BOARD, BOARD + .5));
    const fills = [STAMP18[0], FEET, STAMP3, BEANS[0], BEANS[1], BEANS[2], STAMP7, STAMP18[1], BEANS[3]];
    rosterStrip({ t, fills: fills.map(f => t >= f ? f : null), drop: seg(t, ROSTER_T, ROSTER_T + .4), board: ease(seg(t, BOARD, BOARD + .7)),
      pulse2: inW(t, N2 + .2, FEET) ? .5 + .5 * Math.sin((t - N2) * 9) : 0 });
    caps(t);
    if (t > WIPE) { flushLetters(); brushWipe((t - WIPE) / .6, [TK.marigold, TK.peach]); }
  }

  // ================= the card =================
  function shotCard(t, lt) {
    unionCard(t, { cap: CARD_CAP, covers: COVERS, price: PRICE, logo: LOGO, pill: PILL, follow: FOLLOW });
    const k = frac((t - FOLLOW) / 1.6);
    if (t > FOLLOW) { flushLetters(); boilSeed('sparkle'); paint(starPts(lerp(240, 700, k), lerp(1000, 760, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [TK.marigold, TK.peach]); }
  }

  shots([[0, shotMain], [CARD, shotCard]]);
})();
