// diwali.js: "Maa Lakshmi's OWL just went ON STRIKE.", the Diwali Vahana Union (Part 2 of ad 10): the owl's dharna
// for a Diwali bonus, the five-day duty roster, the goddess of wealth walks in; the card sells Books 1–3 as a Diwali gift.
// Storyboard: STORYBOARD.md. Set and props: diwali_props.js. All times are video time (t); the SFX
// (tools/diwali_sfx.mjs) uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/diwali_sfx.mjs)
  const YELL = 1.0, PULL = 2.3, CHANT = 2.95, LATE = 3.7, GLANCE = 4.05, B0 = 5.0;
  const ROSTER_T = 5.0, BUF0 = 7.55, STAMP1 = 7.95, BHAI = 10.1, STAMP5 = 10.5, WAIT = 12.4,
    GAR0 = 14.5, STAMP2 = 14.9, ZERO = 17.5, MSK0 = 19.6, STAMP3 = 20.0, SAFAI = 22.1, BROOM = 22.7, HIT = 22.95,
    OWL0 = 24.6, STAMPO = 25.0, DARK = 25.3, LAMPS = 27.6, DAZZLE = 28.1, SPIN = 28.7, OTHER = 30.1, ULLU = 32.2,
    DAY4 = 34.2, COWIN = 35.5, COWS = 36.2, COWSTAMP = 36.4, NOBODY = 38.1, WORSHIP = 39.0, JEALOUS = 39.4, COWOUT = 40.3;
  const ENTER = 41.0, NOTICE = 41.5, HIDE = 41.8, BONUSQ = 43.3, COINS = 45.6, GIFTS = [46.0, 46.4, 46.8, 47.3], SHADES = 47.3,
    FLIP = 48.3, FLIPS = [48.5, 48.75, 48.95], STRIKE = 49.1, BOARD = 51.1, ASK = 51.6, WIPE = 54.8;
  const CARD = 55.1, CARD_CAP = 55.2, COVERS = 55.4, PRICE = 56.2, LOGO = 56.5, PILL = 56.8, FOLLOW = 57.2;

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

  // ---- the cast, in world space (the wide shot is camera (540, 1075) at zoom 1.12)
  const OX = 540, OY = 1470, OU = 30;           // the owl, centre front
  const BX = 205, BY = 1350, BU = 21;           // Yama's buffalo, back left, facing right
  const GX = 905, GY = 975, GS = 26;            // Garuda, perched on a bamboo rod off the right pole, facing left
  const PERCH = 1060;
  const MX = 870, MY = 1585, MU = 17;           // Mooshak, front right (swept to MX2 at HIT)
  const MX2 = 735, MY2 = 1615;
  const CX0 = 1400, CX = 1010, CY = 1660, CU = 17;  // the cow, strolling in at the front right
  const LKX = 232, LKY = 1690, LKU = 20;        // Maa Lakshmi walks in along the front from the left

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ["Maa Lakshmi's OWL", 520, -1, PULL + .1 + 1, 96, GOLDC], ['just went ON STRIKE.', 628, -1, PULL + .1 + 1, 72],
    ['Diwali: 5 days.', 600, ROSTER_T + .15, BUF0 - ROSTER_T - .2, 70], ['And EVERY god needs a RIDE.', 695, ROSTER_T + .55, BUF0 - ROSTER_T - .6, 58, GOLDC],
    ['Day 1, Dhanteras:', 600, BUF0 + .05, BHAI - BUF0 - .1, 62], ['a lamp for MY boss, YAMA.', 695, BUF0 + .25, BHAI - BUF0 - .3, 60, GOLDC],
    ['Day 5, Bhai Dooj:', 600, BHAI + .05, WAIT - BHAI - .1, 62], ['he eats at his SISTER\'s.', 695, BHAI + .25, WAIT - BHAI - .3, 60, GOLDC],
    ['I wait OUTSIDE.', 640, WAIT, GAR0 - WAIT - .05, 84, GOLDC],
    ['Day 2: Krishna and Satyabhama', 600, GAR0 + .1, ZERO - GAR0 - .15, 54], ['flew on ME to fight NARAKASURA.', 695, GAR0 + .35, ZERO - GAR0 - .4, 54, GOLDC],
    ['My bonus?', 600, ZERO, MSK0 - ZERO - .05, 70], ['ZERO.', 705, ZERO + .55, MSK0 - ZERO - .6, 120, GOLDC],
    ['Day 3: Ganesha rides ME', 600, MSK0 + .1, SAFAI - MSK0 - .15, 58], ['to the Lakshmi–Ganesh puja!', 695, MSK0 + .3, SAFAI - MSK0 - .35, 56, GOLDC],
    ['But FIRST…', 600, SAFAI, OWL0 - SAFAI - .05, 70], ['DIWALI SAFAI.', 705, SAFAI + .4, OWL0 - SAFAI - .45, 96, GOLDC],
    ['Day 3: I bring Maa LAKSHMI', 600, OWL0 + .1, LAMPS - OWL0 - .15, 60], ['on the DARKEST night: AMAVASYA.', 695, OWL0 + .4, LAMPS - OWL0 - .45, 56, GOLDC],
    ['And you light', 600, LAMPS, OTHER - LAMPS - .05, 64], ['a MILLION lamps.', 705, LAMPS + .3, OTHER - LAMPS - .35, 90, GOLDC],
    ['Then for 364 days,', 600, OTHER, ULLU - OTHER - .05, 64], ['you call each other…', 695, OTHER + .3, ULLU - OTHER - .35, 64],
    ['"ULLU."', 650, ULLU, DAY4 - ULLU - .05, 170, GOLDC],
    ['And Day 4, Govardhan Puja?', 640, DAY4 + .05, COWS - DAY4 - .1, 62],
    ['The COWS.', 640, COWS, NOBODY - COWS - .05, 110, GOLDC],
    ['They carry NOBODY…', 600, NOBODY, ENTER - NOBODY - .05, 66], ['…and get WORSHIPPED.', 700, WORSHIP, ENTER - WORSHIP - .05, 70, GOLDC],
    ['…then MAA LAKSHMI walked in.', 640, ENTER + .15, BONUSQ - ENTER - .2, 62, GOLDC],
    ['Someone asked for', 600, BONUSQ, COINS - BONUSQ - .05, 64], ['a DIWALI BONUS?', 705, BONUSQ + .3, COINS - BONUSQ - .35, 90, GOLDC],
    ['The goddess of WEALTH', 600, COINS, FLIP - COINS - .1, 66, GOLDC], ['pays ON TIME.', 705, COINS + .4, FLIP - COINS - .5, 84],
    ['Strike OFF.', 600, STRIKE, BOARD - STRIKE - .05, 70], ['DIWALI ON!', 705, STRIKE + .15, BOARD - STRIKE - .2, 110, GOLDC],
    ['Is your name LAKSHMI, SHREE,', 1330, ASK, WIPE - ASK + .1, 54, GOLDC], ['KAMALA or PADMA? Comment it!', 1420, ASK + .15, WIPE - ASK - .05, 50],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };
  // a shout out of the megaphone / the crowd: red letters with a cream edge, screen space
  function shout(txt, x, y, size, age, life = 1.2, rot = -.08, col = '#C8323A') {
    if (age < 0 || age > life) return;
    letter(txt, x, y, size, col, { screen: true, pop: age * 5, rot: rot + Math.sin(age * 22) * .03 * (1 - age / life), alpha: 1 - seg(age, life - .2, life), stroke: DW.cream, sw: .2, ink: false, maxW: 860 });
  }

  // ---- the camera: [t, [cx, cy, zoom]]
  const WIDE = [540, 1075, 1.12], HOOK = [540, 1150, 2.5];
  const BUFC = [270, 1190, 1.85], GARC = [810, 1010, 1.75], MSKC = [820, 1470, 2.2], OWLC = [540, 1185, 1.65], ULLUC = [540, 1150, 2.1], LKC = [500, 1190, 1.22], COWC = [700, 1360, 1.35];
  const CAMK = [
    [0, HOOK], [PULL, HOOK], [CHANT, WIDE],
    [BUF0, WIDE], [BUF0 + .35, BUFC],
    [GAR0, BUFC], [GAR0 + .35, GARC],
    [MSK0, GARC], [MSK0 + .35, MSKC],
    [OWL0, MSKC], [OWL0 + .4, OWLC],
    [ULLU, OWLC], [ULLU + .5, ULLUC],
    [DAY4, ULLUC], [DAY4 + .45, WIDE],
    [COWIN - .2, WIDE], [COWIN + .4, COWC], [ENTER - .2, COWC], [ENTER + .4, WIDE], [ENTER + 1.2, LKC], [FLIP, LKC], [FLIP + .5, WIDE],
  ];

  // ================= the owl =================
  const MS = 44;
  // the megaphone's pose at t: [mouthpiece x, y (world), angle, mirror, held]
  function megaPose(t, oo) {
    const b = owlBeak(OX, OY, OU, oo), atBeak = [b[0] - 16, b[1] - 2, Math.PI + .28, true];
    const ground = [OX - 175, OY - 30, Math.PI - .05, true], behind = [OX - 10, OY - 250, Math.PI - .3, true];
    const mix = (a, c, k, h = 60) => { const p = arcPt([a[0], a[1]], [c[0], c[1]], h, k); return [p[0], p[1], lerp(a[2], c[2], k), true]; };
    if (t < B0 + .1) return [...atBeak, true];
    if (t < B0 + .55) return [...mix(atBeak, ground, ease(seg(t, B0 + .1, B0 + .55))), true];
    if (t < HIDE) return [...ground, false];
    if (t < HIDE + .4) return [...mix(ground, behind, ease(seg(t, HIDE, HIDE + .4)), 30), false];
    if (t < FLIP + .05) return [...behind, false];
    if (t < FLIPS[0]) return [...mix(behind, atBeak, easeOut(seg(t, FLIP + .05, FLIPS[0])), 80), true];
    return [...atBeak, true];
  }
  const megaPt = (mp, lx, ly) => { const [x, y, a, mir] = mp, c = Math.cos(a), s = Math.sin(a), yy = mir ? -ly : ly; return [x + lx * c - yy * s, y + lx * s + yy * c]; };
  const toOwl = (w, oo) => { const sq = (oo.sq || 0) + (oo.take || 0); return [(w[0] - OX - (oo.dx || 0) * OU) / (1 + sq * .6) / OU, (w[1] - OY - (oo.dy || 0) * OU) / (1 - sq) / OU]; };
  // his placard: [board x, y, rot, flip, held, behind]
  function owlPlacard(t) {
    const home = [718, 1238], up = [705, 1150];
    if (t < HIDE) {
      const pump = inW(t, CHANT - .1, GLANCE + .3) ? Math.abs(Math.sin((t - CHANT) * 6)) : 0;
      return [home[0], home[1] - pump * 46, .04 + .03 * Math.sin(t * 2), 0, inW(t, CHANT - .3, GLANCE + .5), false];
    }
    if (t < FLIP) { const k = ease(seg(t, HIDE, HIDE + .3)); return [lerp(home[0], 610, k), lerp(home[1], 1120, k), lerp(.04, -.4, k), 0, k < .5, k > .5]; }
    const k = easeOut(seg(t, FLIP, FLIP + .3)), pump = t > FLIPS[0] + .3 ? Math.abs(Math.sin((t - FLIPS[0]) * 5.2)) : 0;
    return [lerp(610, up[0], k), lerp(1120, up[1], k) - pump * 40, lerp(-.4, .06, k), seg(t, FLIPS[0] - .05, FLIPS[0] + .3), true, k < .5];
  }
  function owlOpts(t) {
    const f = acts(t, [
      [-9, { eyes: 'angry', mouth: 'flat' }],
      [YELL, { eyes: 'angry', mouth: 'talk' }], [2.45, { eyes: 'angry', mouth: 'flat' }],
      [CHANT, { eyes: 'angry', mouth: 'talk' }], [GLANCE, { eyes: 'side', mouth: 'flat', lookX: -1, lookY: .3 }],
      [B0 + .5, { eyes: 'normal', mouth: 'smile', lookY: -1 }],
      [BUF0, { eyes: 'normal', mouth: 'flat', lookX: -1 }], [WAIT + .3, { eyes: 'sad', mouth: 'frown', lookX: -1 }],
      [GAR0, { eyes: 'normal', mouth: 'flat', lookX: 1, lookY: -.6 }], [ZERO + .5, { eyes: 'wide', mouth: 'O', lookX: 1, lookY: -.6 }],
      [MSK0, { eyes: 'normal', mouth: 'smile', lookX: .9, lookY: .7 }], [HIT, { eyes: 'wide', mouth: 'O', lookX: .6, lookY: .8 }],
      [OWL0, { eyes: 'angry', mouth: 'talk' }], [DARK, { eyes: 'happy', mouth: 'talk' }], [LAMPS - .3, { eyes: 'happy', mouth: 'smile' }],
      [LAMPS, { eyes: 'tired', mouth: 'talk' }], [DAZZLE, { eyes: 'dazzle', mouth: 'wobble' }],
      [SPIN, { eyes: 'wide', mouth: 'O' }], [SPIN + .7, { eyes: 'swirl', mouth: 'wobble' }],
      [OTHER, { eyes: 'tired', mouth: 'talk' }], [ULLU - .2, { eyes: 'tired', mouth: 'flat' }], [ULLU + .9, { eyes: 'closed', mouth: 'flat' }], [ULLU + 1.15, { eyes: 'tired', mouth: 'flat' }],
      [DAY4, { eyes: 'normal', mouth: 'flat', lookY: -1, lookX: -.3 }], [COWIN + .2, { eyes: 'side', mouth: 'flat', lookX: 1 }],
      [WORSHIP + .1, { eyes: 'wide', mouth: 'O', lookX: 1 }], [JEALOUS + .5, { eyes: 'angry', mouth: 'frown', lookX: .8, emote: 'anger' }],
      [ENTER + .3, { eyes: 'wide', mouth: 'O', lookX: -1 }],
      [HIDE, { eyes: 'side', mouth: 'smile', lookX: -1, lookY: -.4, blush: .6 }],
      [BONUSQ + .4, { eyes: 'wide', mouth: 'grin', lookX: -.8 }],
      [COINS, { eyes: 'happy', mouth: 'grin' }], [GIFTS[3] - .4, { eyes: 'wide', mouth: 'O', lookX: -.5, lookY: -1 }],
      [SHADES, { eyes: 'normal', mouth: 'smile' }], [SHADES + .5, { eyes: 'happy', mouth: 'grin', blush: .3 }],
      [FLIPS[0], { eyes: 'happy', mouth: 'talk' }], [FLIPS[0] + 1.4, { eyes: 'happy', mouth: 'grin' }],
    ]);
    const o = { ...f, boilKey: 'owl', seed: 1, hat: owlBand({ wind: inW(t, YELL, 2.45) ? .4 : 0 }) };
    if (o.mouth === 'talk') o.mouthK = inW(t, YELL, 2.45) || inW(t, FLIPS[0], FLIPS[0] + 1.4) ? .9 + .4 * Math.abs(Math.sin(t * 9)) : talkK(t);
    if (o.emote) { o.emoteK = seg(t, JEALOUS + .5, JEALOUS + .8); o.emoteAge = t - JEALOUS; }
    o.puff = t < YELL ? lerp(.2, 1, ease(seg(t, 0, YELL))) : t < 2.45 ? .8 : inW(t, OWL0, LAMPS) ? .6 : inW(t, SHADES + .5, 60) ? .45 : .12 + .08 * Math.sin(t * 2.4);
    const tk = take(t, NOTICE, 1.1), td = take(t, DAZZLE, .9), ty = take(t, YELL, .4), tw = take(t, WORSHIP + .1, .6);
    o.sq = tk.sq + td.sq + ty.sq + tw.sq; o.dy = tk.dy + td.dy + ty.dy + tw.dy;
    if (t > FLIPS[0]) o.dy += -Math.abs(Math.sin((t - FLIPS[0]) * 5.2)) * .5;   // bouncing, cheering
    if (inW(t, BONUSQ + .4, COINS)) o.nod = .3 * Math.abs(Math.sin((t - BONUSQ) * 9));   // eager nods
    else o.nod = o.mouth === 'talk' ? .1 * Math.sin(t * 6) : 0;
    // the head: all the way round at SPIN, then a dizzy wobble; deadpan tilt on ULLU
    o.hturn = ease(seg(t, SPIN, SPIN + .7)); o.spin = inW(t, SPIN, SPIN + .7) ? Math.sin(seg(t, SPIN, SPIN + .7) * Math.PI) : 0;
    o.htilt = inW(t, SPIN + .7, OTHER) ? .14 * Math.sin((t - SPIN) * 7) * (1 - seg(t, SPIN + 1.2, OTHER)) : inW(t, ULLU, DAY4) ? -.06 : inW(t, BONUSQ, COINS) ? .1 : 0;
    if (inW(t, GLANCE, B0)) o.hx = -.5 * ease(seg(t, GLANCE, GLANCE + .2));
    o.shades = ease(seg(t, SHADES, SHADES + .45));
    // ---- wings
    const mp = megaPose(t, o), pl = owlPlacard(t);
    if (mp[4]) { o.wingL = toOwl(megaPt(mp, MS * .99, MS * .72), o); o.wingShapeL = 'hold'; }
    else if (inW(t, B0 + .55, B0 + .8)) { o.wingL = L2(toOwl(megaPt(megaPose(B0 + .55, o), MS * .99, MS * .72), o), [-3.05, -2.0], ease(seg(t, B0 + .55, B0 + .8))); o.wingShapeL = 'hold'; }
    else if (inW(t, HIDE - .2, HIDE + .6)) {   // shove the megaphone behind him
      const k1 = ease(seg(t, HIDE - .2, HIDE)), k2 = ease(seg(t, HIDE + .4, HIDE + .6));
      o.wingL = L2(L2([-3.05, -2.0], toOwl(megaPt(megaPose(Math.max(t, HIDE), o), MS * 1.4, -MS * .2), o), k1), [-3.05, -2.0], k2); o.wingShapeL = 'hold';
    }
    if (pl[4]) { o.wingR = toOwl([pl[0] - 4, pl[1] + 95], o); o.wingShapeR = 'hold'; }
    // the dazzle: both wings up over his eyes
    if (inW(t, DAZZLE - .05, SPIN + .05)) {
      const k = easeOut(seg(t, DAZZLE - .05, DAZZLE + .15)) * (1 - ease(seg(t, SPIN - .1, SPIN + .05)));
      o.wingL = L2(o.wingL || [-3.05, -2.0], [-1.7, -10.9], k); o.wingShapeL = 'open';
      o.wingR = L2(o.wingR || [3.05, -2.0], [1.7, -10.9], k); o.wingShapeR = 'open';
    }
    if (inW(t, OWL0 + .3, LAMPS - .2) && !pl[4]) {   // "I bring Maa LAKSHMI": a grand wing
      const k = easeOut(seg(t, OWL0 + .3, OWL0 + .6)) * (1 - ease(seg(t, LAMPS - .5, LAMPS - .2)));
      o.wingR = L2([3.05, -2.0], [5.0, -9.6 + .3 * Math.sin(t * 5)], k); o.wingShapeR = 'open';
    }
    if (inW(t, BONUSQ + .4, COINS + .4)) {   // both wings up, eager
      const k = easeOut(seg(t, BONUSQ + .4, BONUSQ + .7)) * (1 - ease(seg(t, COINS + .1, COINS + .4)));
      if (!o.wingR || !pl[4]) { o.wingR = L2([3.05, -2.0], [4.6, -8.4 + .4 * Math.sin(t * 9)], k); o.wingShapeR = 'open'; }
      o.wingL = L2([-3.05, -2.0], [-4.6, -8.4 + .4 * Math.sin(t * 9 + 1)], k); o.wingShapeL = 'open';
    }
    if (inW(t, SHADES + .45, SHADES + 1.1)) {   // pushes the shades up his beak with one feather: cool
      const k = easeOut(seg(t, SHADES + .45, SHADES + .65)) * (1 - ease(seg(t, SHADES + .85, SHADES + 1.1)));
      o.wingR = L2([3.05, -2.0], [1.4, -10.0], k); o.wingShapeR = 'point';
    }
    o.held = mp[4] ? (u, sw) => {
      const sq = (o.sq || 0) + (o.take || 0), X0 = OX + (o.dx || 0) * OU, Y0 = OY + (o.dy || 0) * OU;
      push(); scale(1 / (1 + sq * .6), 1 / (1 - sq)); translate(-X0, -Y0);
      megaphone(mp[0], mp[1], mp[2], MS, { mirror: true, yell: inW(t, YELL, 2.45) || inW(t, CHANT, CHANT + .9) || inW(t, FLIPS[0], FLIPS[0] + 1.4) ? 1 : 0, key: 'm' });
      pop();
    } : null;
    o._mp = mp; o._pl = pl;
    return o;
  }

  // ================= Yama's buffalo =================
  function bufOpts(t) {
    const o = { boilKey: 'buf', seed: 2, eyes: 'calm', mouth: 'flat', tail: Math.sin(t * 1.4) * .5, pal: { bf: '#4E4A5E', bfDk: '#363244', bfLt: '#6E6A84', bfMuzzle: '#5E5668' } };
    const talking = inW(t, LATE, LATE + .9) || inW(t, BUF0 + .1, BHAI - .2) || inW(t, BHAI + .1, WAIT - .2) || inW(t, WAIT + .05, WAIT + 1.0);
    if (talking && Math.sin(t * (t < B0 ? 7 : 11)) > 0) o.mouth = 'open';
    if (inW(t, CHANT, LATE)) o.mouth = 'flat';
    if (inW(t, GLANCE, GLANCE + .9)) o.eyes = 'wide';
    if (inW(t, WAIT + 1.0, WAIT + 1.35) || inW(t, ULLU + .4, ULLU + .6)) o.eyes = 'closed';   // the slow blink
    o.snort = inW(t, WAIT + 1.3, WAIT + 2.2) ? seg(t, WAIT + 1.3, WAIT + 2.2) : 0;
    if (inW(t, WORSHIP + .1, ENTER) || inW(t, NOTICE, HIDE + .5) || inW(t, GIFTS[1] - .1, GIFTS[1] + .9)) o.eyes = 'wide';
    if (inW(t, JEALOUS + .4, ENTER)) o.emote = 'anger', o.emoteK = seg(t, JEALOUS + .4, JEALOUS + .7), o.emoteAge = t - JEALOUS;
    if (t > GIFTS[1] + .9) o.eyes = 'closed', o.mouth = t > FLIPS[1] ? 'open' : 'flat';   // happy, eyes shut
    const tk = take(t, NOTICE + .05, .8); o.sq = tk.sq * .6; o.dy = tk.dy * .5;
    if (inW(t, BONUSQ + .4, COINS)) o.dy = (o.dy || 0) - .25 * Math.abs(Math.sin((t - BONUSQ) * 8 + 1));
    if (t > FLIPS[1]) o.dy = (o.dy || 0) - .3 * Math.abs(Math.sin((t - FLIPS[1]) * 5.2 + 1));
    return o;
  }
  // ================= Garuda =================
  function garOpts(t) {
    const o = { flip: true, pal: GARUDA_PAL, ring: false, hat: garudaCrown, brow: true, boilKey: 'gar', eyes: 'normal', look: 0, flap: -.15 + .08 * Math.sin(t * 2.2) };
    const talking = inW(t, CHANT, LATE) || inW(t, GAR0 + .1, ZERO - .2) || inW(t, ZERO + .05, ZERO + .9);
    if (talking) o.squawk = .15 + .55 * Math.abs(Math.sin(t * 12));
    if (inW(t, GAR0 + .3, ZERO)) o.flap = .5 + .35 * Math.sin((t - GAR0) * 7);   // proud, wings out
    if (inW(t, ZERO + .55, MSK0 + .4)) { o.eyes = 'closed'; o.rot = -.22 * ease(seg(t, ZERO + .55, ZERO + .8)); }   // beak up, offended
    if (inW(t, GLANCE, GLANCE + .8)) o.look = 1;
    if (inW(t, WORSHIP + .1, ENTER)) { o.eyes = 'wide'; o.squawk = .7; }
    if (inW(t, NOTICE, HIDE + .6)) { o.eyes = 'wide'; o.flap = -.6; }
    if (inW(t, GIFTS[2] - .55, GIFTS[2] + .05)) { o.eyes = 'closed'; o.rot = -.2; }   // looking away, too proud for a bonus…
    if (inW(t, GIFTS[2] - .05, GIFTS[2] + .1)) o.squawk = .8;                         // …SNAP
    if (inW(t, GIFTS[2] + .1, GIFTS[2] + 1.2)) { o.eyes = 'wide'; o.rot = .05; }
    if (inW(t, BONUSQ + .4, GIFTS[2] - .55)) o.flap = .3 * Math.sin((t - BONUSQ) * 9);
    if (t > FLIPS[2]) { o.flap = .7 * Math.sin((t - FLIPS[2]) * 10); o.squawk = .3 + .4 * Math.abs(Math.sin(t * 7)); }
    return o;
  }
  // ================= Mooshak =================
  // where he is: [x, y, rot, flat, airborne]
  function mskPos(t) {
    if (t < HIT) return [MX, MY, 0, 0, false];
    if (t < HIT + .6) { const k = seg(t, HIT, HIT + .6), p = arcPt([MX, MY], [MX2, MY2], 140, k); return [p[0], p[1], -k * TAU * 1.25, 1, true]; }
    return [MX2, MY2, 0, clamp(1 - seg(t, HIT + .9, HIT + 1.2)), false];
  }
  function mskOpts(t) {
    const o = { boilKey: 'msk', eyes: 'angry', mouth: 'open', aL: -.7, aR: 1.0, flip: false };
    const talking = inW(t, CHANT, LATE) || inW(t, MSK0 + .1, SAFAI + .5);
    o.mouth = talking ? (Math.sin(t * 14) > 0 ? 'open' : 'smile') : 'flat';
    if (inW(t, GLANCE, B0)) o.eyes = 'normal';
    if (t > B0) o.eyes = 'normal', o.mouth = talking ? o.mouth : 'smile';
    if (inW(t, MSK0, SAFAI)) o.eyes = 'happy';
    if (inW(t, SAFAI, HIT)) { o.eyes = 'wide'; o.emote = 'sweat'; o.emoteK = seg(t, SAFAI + .4, SAFAI + .6); }
    if (inW(t, HIT, HIT + .6)) { o.eyes = 'x'; o.mouth = 'O'; }
    if (inW(t, HIT + .6, HIT + 1.5)) { o.eyes = 'swirl'; o.mouth = 'wobble'; }
    if (inW(t, HIT + 1.5, OWL0 + 1)) { o.eyes = 'angry'; o.cross = 1; o.emote = 'anger'; o.emoteK = seg(t, HIT + 1.5, HIT + 1.7); o.emoteAge = t; }
    if (inW(t, COWIN + .2, ENTER)) { o.eyes = 'angry'; o.mouth = 'frown'; }
    if (inW(t, NOTICE, HIDE + .8)) { o.eyes = 'wide'; o.mouth = 'O'; }
    if (inW(t, HIDE + .8, BONUSQ + .4)) { o.eyes = 'happy'; o.mouth = 'smile'; }
    if (inW(t, BONUSQ + .4, GIFTS[0] - .4)) { o.eyes = 'shine'; o.mouth = 'open'; o.dy = -.8 * Math.abs(Math.sin((t - BONUSQ) * 8)); }
    if (inW(t, GIFTS[0] - .4, 60)) { o.eyes = 'heart'; o.mouth = 'grin'; o.aL = 1.2; o.aR = 1.2; }
    if (t > FLIPS[2]) { o.eyes = 'happy'; o.dy = -1.2 * Math.abs(Math.sin((t - FLIPS[2]) * 6)); }
    const tk = take(t, NOTICE + .1, .9); o.sq = (o.sq || 0) + tk.sq; o.dy = (o.dy || 0) + tk.dy;
    if (inW(t, SAFAI + .5, HIT)) o.dx = .15 * Math.sin(t * 60);   // trembling
    return o;
  }
  // his placard's paw end (the pole's foot) in world space, for a pose
  function mskPaw(x, y, u, o) {
    const a = o.aR ?? -.7, lx = (1.5 + Math.cos(a) * 1.4) * u, ly = (-2.7 - Math.sin(a) * 1.4) * u, r = o.rot || 0;
    return [x + lx * Math.cos(r) - ly * Math.sin(r), y + (o.dy || 0) * u + lx * Math.sin(r) + ly * Math.cos(r)];
  }
  // ================= the cow =================
  function cowPos(t) {
    if (t < COWIN || t > COWOUT + 1.0) return null;
    if (t < COWS + .3) { const k = ease(seg(t, COWIN, COWS + .3)); return { x: lerp(CX0, CX, k), walk: lerp(CX0, CX, k) / (6 * CU), flip: true }; }
    if (t < COWOUT) return { x: CX, flip: true };
    const k = easeIn(seg(t, COWOUT, COWOUT + 1.0)); return { x: lerp(CX, CX0 + 60, k), walk: lerp(CX, CX0, k) / (6 * CU), flip: false };
  }
  // ================= Lakshmi =================
  function lkPos(t) {
    if (t < ENTER) return null;
    const k = ease(seg(t, ENTER, ENTER + 1.8)), x = lerp(-230, LKX, k);
    return { x, walk: k < 1 ? x / (5 * LKU) : null };
  }
  // the gifts' flights: from her palm to each of them, landing at GIFTS[i]
  const giftFrom = t => lakshmiPalm(LKX, LKY, LKU, { handR: lkHand(t) });
  function lkHand(t) {
    if (inW(t, COINS - .2, GIFTS[3] + .4)) { const k = easeOut(seg(t, COINS - .2, COINS + .1)) * (1 - ease(seg(t, GIFTS[3] + .1, GIFTS[3] + .4))); return L2([3.5, -12.6], [4.6, -16.6], k); }
    return [3.5, -12.6];
  }

  // ================= the main shot =================
  function shotMain(t) {
    const cam = kf(t, CAMK);
    let [sx, sy] = [0, 0];
    if (inW(t, YELL, YELL + .5)) [sx, sy] = shakeXY(t, 9 * (1 - seg(t, YELL, YELL + .5)));
    if (inW(t, DAZZLE, DAZZLE + .5)) [sx, sy] = shakeXY(t, 10 * (1 - seg(t, DAZZLE, DAZZLE + .5)));
    if (inW(t, HIT, HIT + .3)) [sx, sy] = shakeXY(t, 6 * (1 - seg(t, HIT, HIT + .3)));
    if (inW(t, FLIPS[0], FLIPS[0] + .4)) [sx, sy] = shakeXY(t, 6 * (1 - seg(t, FLIPS[0], FLIPS[0] + .4)));
    camBegin(cam[0] + sx, cam[1] + sy, cam[2]);
    const clip = t > ROSTER_T + .2 ? [380, 600] : null, boardUp = t > BOARD + .15, oo = owlOpts(t), bo = bufOpts(t), go = garOpts(t), mo = mskOpts(t), cp = cowPos(t), lp = lkPos(t);
    const lamps = t < LAMPS ? 0 : 1, flare = inW(t, DAZZLE - .1, SPIN + 1.2) ? easeOut(seg(t, DAZZLE - .1, DAZZLE + .1)) * (1 - ease(seg(t, SPIN + .3, SPIN + 1.2))) : 0;
    const dim = inW(t, DARK, DAZZLE) ? ease(seg(t, DARK, DARK + .5)) * (1 - seg(t, DAZZLE - .15, DAZZLE)) : 0;
    const fest = t > FLIP ? ease(seg(t, FLIP, FLIP + .8)) : 0;
    diwaliSet(t, { lamps, flare: Math.max(flare, fest * .25), dim, banner: t < ROSTER_T + .3, bulbs: 1 - dim, warm: lp ? .55 * seg(t, ENTER, ENTER + 1) : 0 });
    if (dim > 0) { boilSeed('dim'); paint(rectPts(-400, -400, W + 800, H + 900), { wash: '#170C2C', washOp: 140 * dim, ink: null }); }   // the darkest night: the set falls away, the cast stays lit
    // the lamp lit for Yama on Dhanteras, in front of his buffalo
    if (t > STAMP1 - .1) { diya(395, 1392, 19, clamp((t - STAMP1 + .1) * 5), 'yama'); sparkleBurst(410, 1360, 50, t - STAMP1, 'yamaspark'); }

    // ---- Garuda on his perch, RISK PAY! hung at his chest
    boilSeed('perch');
    paint(rectPts(760, PERCH - 9, 320, 18), { wash: DW.pole, ink: DW.ink, sw: 1.6 });
    inkLine([[1054, PERCH + 9], [1000, PERCH + 70]], 4, DW.poleDk, 'ink', 0);
    const gHang = [GX - 2.2 * GS, GY + .8 * GS], gBoard = [GX - 2.3 * GS, GY + 3.0 * GS + 4];
    const gHide = ease(seg(t, HIDE, HIDE + .3)) * (1 - easeOut(seg(t, FLIPS[2] - .3, FLIPS[2])));
    kamaParrot(GX, GY, GS, go);
    placard(gBoard[0], gBoard[1], 150 * (1 - gHide * .7), 78, { txt: 'RISK PAY!', back: 'SHUBH DIWALI', hang: gHang, key: 'g', size: 34, clip, rot: .05 * Math.sin(t * 2) + (go.rot || 0) * .5 - gHide * .8, flip: seg(t, FLIPS[2], FLIPS[2] + .3), noText: gHide > .3 || boardUp });

    // ---- the buffalo, OVERTIME! hung at his neck
    const nk = buffaloNeck(BX, BY, BU, bo), bHide = ease(seg(t, HIDE, HIDE + .3)) * (1 - easeOut(seg(t, FLIPS[1] - .3, FLIPS[1])));
    yamaBuffalo(BX, BY, BU, bo);
    const hp = buffaloHorn(BX, BY, BU, bo), hd = buffaloHead(BX, BY, BU, bo);
    sideBand(lerp(hd[0], hp[0], .55), lerp(hd[1], hp[1], .55) + 6, BU * 1.1, -.35, -1, 'b');
    placard(nk[0] + 22, nk[1] + 118, 170 * (1 - bHide * .7), 84, { txt: 'OVERTIME!', back: 'SHUBH DIWALI', hang: [nk[0] + 16, nk[1] + 30], key: 'b', size: 36, clip, rot: .05 * Math.sin(t * 1.7) - bHide * 1.0, flip: seg(t, FLIPS[1], FLIPS[1] + .3), noText: bHide > .3 || boardUp || t > ENTER + .5 });
    if (t > GIFTS[1]) garlandAt([[nk[0] - 30, nk[1] - 24], [nk[0] - 10, nk[1] + 40], [nk[0] + 40, nk[1] + 62], [nk[0] + 86, nk[1] + 24], [nk[0] + 80, nk[1] - 30]], 'bufg', 12);

    // ---- the owl: his placard, the megaphone on the ground or behind him, then the owl
    const pl = oo._pl;
    const plDraw = () => placard(pl[0], pl[1], 196, 108, { txt: 'BONUS DO!', back: 'SHUBH DIWALI', pole: 230, key: 'o', size: 46, clip, rot: pl[2], flip: pl[3], noText: pl[5] || boardUp });
    plDraw();
    if (!oo._mp[4]) megaphone(oo._mp[0], oo._mp[1], oo._mp[2], MS, { mirror: true, key: 'g' });
    owl(OX, OY, OU, oo);

    // ---- Mooshak, his NO JHADU! on a little pole; the broom that sweeps him off
    const [mx, my, mr, mfl, air] = mskPos(t);
    const mOpts = { ...mo, rot: mr, flat: mfl };
    const mHide = ease(seg(t, HIDE, HIDE + .3)) * (1 - easeOut(seg(t, FLIPS[2] - .3, FLIPS[2])));
    const paw = mskPaw(mx, my, MU, mOpts);
    const mPl = { txt: 'NO JHADU!', back: 'SHUBH DIWALI', pole: 70, key: 'msk', size: 26, clip, rot: mr + .08 * Math.sin(t * 3), flip: seg(t, FLIPS[2] + .1, FLIPS[2] + .4), noText: mHide > .3 || air || boardUp };
    const plOn = t < GIFTS[0] - .4 || t > FLIP;
    if (plOn && mHide > .5) placard(paw[0] - 40, paw[1] - 70, 120, 62, { ...mPl, pole: 0, rot: -.5 });
    mooshak(mx, my, MU, mOpts);
    if (plOn && mHide <= .5) placard(paw[0], paw[1] - 70 - 31, 124, 62, mPl);
    if (inW(t, BROOM, BROOM + .9)) {
      const k = seg(t, BROOM, BROOM + .9), sw = k < .28 ? easeIn(k / .28) : k < .45 ? 1 : 1 - ease((k - .45) / .55);
      const x = lerp(1250, 800, sw), y = lerp(1560, 1600, sw);
      broom(x, y, -.55 + .2 * (1 - sw), 24, 'j', k < .28 ? .8 : -.6);
      dustPuff(MX, MY - 20, 110, t - HIT, 'hit');
    }
    // the laddoo: from her palm to his arms
    if (t > GIFTS[0] - .45) {
      const k = seg(t, GIFTS[0] - .45, GIFTS[0]), from = giftFrom(GIFTS[0] - .45), to = [MX2, MY2 - 7.6 * MU];
      const p = k < 1 ? arcPt(from, to, 160, ease(k)) : [to[0], to[1] + (mo.dy || 0) * MU];
      laddoo(p[0], p[1], 34, 'm');
      sparkleBurst(to[0], to[1], 60, t - GIFTS[0], 'ladspark');
    }

    // ---- the cow strolls in at the back right, garlanded, petals falling on her
    if (cp) {
      const cOpts = { pal: COW_PAL, ...COW_COL, flip: cp.flip, walk: cp.walk, eyes: inW(t, NOBODY, COWOUT) ? 'happy' : 'normal', nod: cp.walk == null ? .08 * Math.sin(t * 4) : 0, boilKey: 'cow', seed: 5 };
      if (inW(t, WORSHIP - .3, COWOUT)) glow(CX, CY - 7 * CU, 260, '#FFD27A', .45 * seg(t, WORSHIP - .3, WORSHIP + .2));
      nandi(cp.x, CY, CU, cOpts);
    }

    // ---- Maa Lakshmi
    if (lp) {
      const coins = inW(t, COINS - .1, GIFTS[3] + .5) ? 1 : .35;
      lakshmi(lp.x, LKY, LKU, { walk: lp.walk, eyes: inW(t, BONUSQ - .2, BONUSQ + .5) ? 'happy' : 'normal', mouth: inW(t, BONUSQ, BONUSQ + 1.2) ? (Math.sin(t * 12) > 0 ? 'smile' : 'o') : 'smile',
        hx: lp.walk != null ? .3 : .45, lookX: .6, htilt: inW(t, BONUSQ, COINS) ? .1 : 0, handR: lkHand(t), coins, coinsTo: LKY - 4, boilKey: 'lk', seed: 6, glowK: .7 });
    }
    // the garland, the coin and the shades in flight
    const fly = (i, h, draw) => { const t0 = GIFTS[i] - .45; if (!inW(t, t0, GIFTS[i])) return; const k = ease(seg(t, t0, GIFTS[i])), p = arcPt(giftFrom(t0), draw.to, h, k); draw.f(p, k); };
    fly(1, 140, { to: [nk[0] + 30, nk[1] + 10], f: (p, k) => garlandAt([[p[0] - 50, p[1]], [p[0], p[1] + 40], [p[0] + 50, p[1]]], 'gfly', 11) });
    const gBeak = [GX - 5.2 * GS, GY - 2.0 * GS];
    fly(2, 220, { to: gBeak, f: (p, k) => lakshmiCoin(p[0], p[1], 20, k * 14, 'gcoin') });
    if (inW(t, GIFTS[2], GIFTS[2] + 1.2)) { lakshmiCoin(gBeak[0] - 6, gBeak[1] + 10, 18, .3, 'gcoin'); sparkleBurst(gBeak[0], gBeak[1], 46, t - GIFTS[2], 'gspark'); }
    const oTop = owlHead(OX, OY, OU, oo);
    fly(3, 200, { to: [oTop[0], oTop[1] - 110], f: (p, k) => flyingShades(p[0], p[1], 64, k * 9) });
    if (inW(t, GIFTS[3], SHADES + .1)) flyingShades(oTop[0], oTop[1] - 110 + 30 * seg(t, GIFTS[3], SHADES + .1), 64, 0);
    sparkleBurst(oTop[0], oTop[1] - 40, 80, t - (SHADES + .3), 'shspark');
    // the rocket at the dazzle, and the celebration's rockets
    rocket(820, 1250, t - (DAZZLE - .45), { h: 520, key: 'dz' });
    rocket(170, 1100, t - (FLIPS[0] + .1), { h: 480, key: 'f1', c: ['#FFE27A', '#FF8A5A', '#FFFFFF'] });
    rocket(900, 1050, t - (FLIPS[0] + .55), { h: 420, key: 'f2', c: ['#8AF0D0', '#FF7AA8', '#FFE27A'] });
    rocket(520, 1000, t - (STRIKE + .7), { h: 380, key: 'f3' });
    const cs = cp ? toScreen(CX, CY - 15 * CU) : null;
    camEnd();

    // ---- screen space: shouts, coins, petals, the roster, captions
    shout('HAMARI MAANG…', 450, 780, 82, t - YELL, 2.45 - YELL);
    shout('…DIWALI BONUS!!', 500, 800, 96, t - CHANT, LATE - CHANT + .1, -.06);
    shout('…bonuuus.', 330, 1150, 54, t - LATE, GLANCE + .7 - LATE, .05, '#6A5A7A');
    shout('SHUBH DIWALI!', 470, 760, 100, t - FLIPS[0], STRIKE - FLIPS[0] + .05, -.06);
    if (cs && inW(t, COWS + .2, COWOUT + .4)) petalRain(t, COWS + .2, { n: 14, x0: cs[0] - 160, x1: cs[0] + 160, y0: cs[1] - 300, y1: cs[1] + 260, key: 'cow' });
    lakshmiCoinRain(t, COINS + .1, { n: 26, key: 'bonus', x0: 40, x1: 1040 });
    petalRain(t, FLIPS[0] + .1, { n: 30 });
    if (t > BOARD) veil(DW.sky, .55 * seg(t, BOARD, BOARD + .5));
    const fills = [[STAMP1], [STAMP2], [STAMP3, STAMPO], [COWSTAMP], [STAMP5]];
    rosterStrip({ t, fills: fills.map(fs => fs.map(f => t >= f ? f : null)), drop: seg(t, ROSTER_T, ROSTER_T + .4), board: ease(seg(t, BOARD, BOARD + .7)),
      pulse4: inW(t, DAY4 + .2, COWSTAMP) ? .5 + .5 * Math.sin((t - DAY4) * 9) : 0 });
    caps(t);
    if (t > WIPE) { flushLetters(); brushWipe((t - WIPE) / .6, [TK.marigold, TK.peach]); }
  }
  // a pair of gold sunglasses in flight, centred at (x, y), s = their width
  function flyingShades(x, y, s, rot) {
    boilSeed('fshades');
    push(); translate(x, y); rotate(rot * .2 + Math.sin(rot) * .2);
    for (const k of [-1, 1]) paint([[k * s * .06, -s * .2], [k * s * .48, -s * .22], [k * s * .46, s * .05], [k * s * .34, s * .2], [k * s * .14, s * .19], [k * s * .07, s * .05]], { wash: OWL.lens, ink: OWL.shades, sw: 3, curv: .4 });
    inkLine([[-s * .07, -s * .14], [0, -s * .18], [s * .07, -s * .14]], 3, OWL.shades, 'ink', .5);
    pop();
    glow(x, y, s, '#FFE08A', .5);
  }

  // ================= the card =================
  function shotCard(t, lt) {
    diwaliCard(t, { cap: CARD_CAP, covers: COVERS, price: PRICE, logo: LOGO, pill: PILL, follow: FOLLOW });
    const k = frac((t - FOLLOW) / 1.6);
    if (t > FOLLOW) { flushLetters(); boilSeed('sparkle'); paint(starPts(lerp(240, 700, k), lerp(1000, 760, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [TK.marigold, TK.peach]); }
  }

  shots([[0, shotMain], [CARD, shotCard]]);
})();
