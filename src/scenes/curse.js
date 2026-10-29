// curse.js: "Baby HANUMAN was SO naughty, the rishis CURSED him!" (ad 60, ~70 s, Bangers captions, cute SFX, no voice).
// Valmiki, Uttara Kanda 36: after the gods' boons the baby wrecks the rishis' ashrams (bark cloth torn, yagna ladles and
// pots broken); they forgive him (Brahma's boon); his parents and Vayu say no; the rishis of Bhrigu's and Angiras's lines
// curse him, "not too angrily", to forget his strength for a long time; he turns gentle. Kishkindha 65–67: at the ocean
// no one can leap to Lanka, Hanuman sits silent, Jambavan reminds him who he is, he grows and roars and leaps.
// STORYBOARD.md has the plan and the sources; sets and props are in curse_props.js. All times are video time (t);
// tools/curse_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/curse_sfx.mjs)
  const BLINK = .8, SIDE = 1.5, SNAP = 2.1, GRIN = 2.5, B0 = 3.6;
  const SPARK = 3.8, FLEX = 5.6, ROCK = 6.2, BONK = 7.0, GIGGLE = 7.4, C0 = 8.2;
  const BARK0 = 10.6, SWING = 11.0, YAG0 = 14.2, GRAB = 14.9, DRUM = 15.4, CRACK = 16.4, WHOOMPH = 16.9, FORG0 = 18.4, D0 = 22.6;
  const NO1 = 22.9, NO2 = 23.5, NO3 = 24.1, ANGEL0 = 25.9, NOD = 26.0, ZIP = 26.9, CRASH = 27.5, PALM0 = 27.7, E0 = 28.4;
  const OPEN = 28.6, RED = 29.2, CALM = 30.5, CURSE = 32.5, SPRINKLE = 33.0, DRAIN = 33.6, LIFT = 35.7, PLOP = 36.7, F0 = 37.4;
  const OFFER = 39.6, PAT = 40.3, YEARS = 41.0, LAPSE0 = 41.7, G0 = 43.4;
  const PUSHG = 46.9, H0 = 49.6, JSIT = 51.4, REFL = 52.6, WIDE = 54.2, I0 = 55.6;
  const THUMP = 55.7, STAND = 56.4, GROW = 56.8, ROAR = 58.2, TURN = 59.4, WINK = 59.8, CROUCH = 60.2, LEAP = 60.6, FLY0 = 60.85, J0 = 62.4;
  const CARD = 66.2;
  const CARDC = { cap: CARD + .1, covers: CARD + .3, price: CARD + 1.1, logo: CARD + 1.4, pill: CARD + 1.7, follow: CARD + 2.1 };
  // the bark strips tear as he passes them on the line (k along the line, and when)
  const STRIPK = [.15, .32, .5, .68, .85];
  const lineK = t => lerp(.04, .96, seg(t, SWING, 13.3));
  const RIPS = STRIPK.map(k => SWING + (k - .04) / .92 * 2.3);
  const BEATS = [0, 1, 2, 3].map(i => DRUM + i * .3);
  const TWITCH = [19.5, 20.5, 21.5];

  const GOLDC = '#F5C542', CREAM = '#FFF5E2';
  const pop = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const camK = (t, keys, sh = [0, 0]) => { const c = kf(t, keys, ease); camBegin(c[0] + sh[0], c[1] + sh[1], c[2]); return c; };
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const talk = (t, a, b, rest = 'smile', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const GOLD = [GOLDC, '#F39A2E'], LEAFW = [P1.leaf, P1.leafDk], PEACH = [TK.marigold, TK.petal];
  const shake = (t, t0, d, a) => (t > t0 && t < t0 + d) ? shakeXY(t, a * (1 - (t - t0) / d)) : [0, 0];

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['BABY HANUMAN WAS SO NAUGHTY,', 470, -1, 4.5, 70], ['THE RISHIS CURSED HIM!', 580, -1, 4.5, 96, GOLDC],
    ['REMEMBER? EVERY GOD', 470, 3.7, 2.3, 80], ['GAVE HIM A BOON.', 580, 3.85, 2.15, 92, GOLDC],
    ['NOTHING COULD HURT HIM!', 520, 6.1, 2.0, 86, GOLDC],
    ['SO OFF HE WENT', 470, 8.3, 2.2, 84], ["TO THE RISHIS' ASHRAM…", 580, 8.45, 2.05, 84, GOLDC],
    ['HE TORE THEIR', 470, 10.7, 3.4, 90], ['BARK CLOTHES…', 585, 10.9, 3.2, 104, GOLDC],
    ['…BROKE THEIR', 470, 14.3, 4.0, 90], ['YAGNA LADLES & POTS…', 585, 14.5, 3.8, 90, GOLDC],
    ["BRAHMA'S BOON PROTECTED HIM,", 470, 18.6, 3.9, 64], ['SO THE RISHIS FORGAVE HIM.', 560, 18.8, 3.7, 70], ['AGAIN. AND AGAIN.', 1450, 19.4, 3.1, 96, GOLDC],
    ['MAA ANJANA, PAPA KESARI,', 470, 22.7, 3.25, 76], ['EVEN VAYU DEV SAID: NO!', 575, 23.95, 2.0, 84, GOLDC],
    ['HE DID NOT LISTEN.', 520, 26.05, 2.3, 100, GOLDC],
    ['THEN THE RISHIS GOT ANGRY…', 470, 28.5, 3.9, 72], ['…BUT ONLY A LITTLE.', 580, 30.5, 1.9, 92, GOLDC],
    ['"YOU WILL FORGET YOUR STRENGTH', 470, CURSE, 3.4, 62], ['FOR A LONG, LONG TIME."', 570, CURSE + .25, 3.15, 82, GOLDC],
    ['AND THE NAUGHTIEST BABY', 470, F0 + .1, 3.4, 74], ['BECAME THE GENTLEST.', 580, F0 + .35, 3.15, 88, GOLDC],
    ['YEARS PASSED…', 900, YEARS + .1, 2.2, 116, CREAM],
    ['NOBODY COULD LEAP THE OCEAN', 470, G0 + .1, 3.3, 66], ['TO FIND MAA SITA.', 570, G0 + .35, 3.05, 86, GOLDC],
    ['HANUMAN SAT QUIET.', 470, PUSHG, 2.6, 84], ['HE HAD FORGOTTEN.', 580, PUSHG + .4, 2.2, 92, GOLDC],
    ['THEN OLD JAMBAVAN SAID:', 470, H0 + .1, 2.9, 76], ['"REMEMBER WHO YOU ARE!"', 580, H0 + .6, 2.4, 80, GOLDC],
    ['"YOU ONCE LEAPT', 470, REFL + .1, 2.8, 90], ['FOR THE SUN!"', 585, REFL + .3, 2.6, 110, GOLDC],
    ['AND HE REMEMBERED.', 1440, GROW + .2, 2.3, 110, GOLDC],
    ['JAI BAJRANGBALI!', 520, LEAP - .1, 1.9, 104, GOLDC],
    ["WHAT'S THE NAUGHTIEST THING", 470, J0 + .1, 3.6, 66], ['YOU DID AS A KID?', 570, J0 + .35, 3.35, 86, GOLDC], ['COMMENT BELOW!', 680, J0 + .7, 3.0, 76],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // ---- small helpers
  // a leafy branch from (x0, y0) to (x1, y1), with leaf clusters along it
  const branch = (x0, y0, x1, y1, key, w = 34) => {
    boilSeed(key);
    paint(ribbon([[x0, y0], [lerp(x0, x1, .5), lerp(y0, y1, .5) - 14], [x1, y1]], w, w * .45), { wash: P1.bark, fill: P1.barkDk, fillOp: 50, tex: .5, ink: P1.ink, sw: 1.1 });
    for (let i = 0; i < 6; i++) {
      const k = .1 + i * .17, x = lerp(x0, x1, k) + (hash(i * 3.1) - .5) * 40, y = lerp(y0, y1, k) - 30 - hash(i * 2.2) * 50;
      paint(ellPts(x, y, 70 + 30 * hash(i), 44 + 20 * hash(i * 4), 14, 3), { wash: i % 2 ? P1.leaf : P1.leafDk, ink: i % 3 ? null : P1.ink, sw: .7 });
    }
  };
  // baby Hanuman hanging upside down by his tail from a branch or line at (bx, by), swinging by swing radians
  const hangBaby = (bx, by, u, swing, o = {}, key = 'hang') => {
    push(); translate(bx, by); rotate(swing);
    const F = 2.2 * u;
    boilSeed(key + 'tail');
    paint(ribbon([[.2 * u, F + 3.2 * u], [1.6 * u, F + 2.2 * u], [1.4 * u, F + .4 * u], [.7 * u, .9 * u], [-.5 * u, .45 * u], [-.6 * u, -.3 * u], [.1 * u, -.65 * u], [.65 * u, -.3 * u]], .55 * u, .4 * u),
      { wash: BH.fur, fill: BH.furDk, fillOp: 45, tex: .5, ink: P1.ink, sw: clamp(u / 20, .4, 2) * .8 });
    balHanuman(0, F, u, { tail: false, noShadow: true, ...o, rot: Math.PI });
    pop();
  };
  const hangHead = (bx, by, u, swing) => { const F = 2.2 * u, d = F + 12.2 * u; return [bx - Math.sin(swing) * d, by + Math.cos(swing) * d]; };
  // gold sparks lifting off (the strength leaving him), from (x, y) over a body w wide, h tall
  const drainSparks = (x, y, w, h, t, t0, t1, key) => {
    if (t < t0 || t > t1 + 1) return;
    boilSeed(key);
    for (let i = 0; i < 18; i++) {
      const s0 = t0 + (t1 - t0) * i / 18, a = t - s0; if (a < 0 || a > 1) continue;
      const px = x + (hash(i * 3.7) - .5) * w + Math.sin(a * 6 + i) * 14, py = y - hash(i * 1.9) * h - a * 320;
      glow(px, py, 30, '#FFD060', .6 * (1 - a));
      paint(starPts(px, py, 9 * (1 - a * .6), .35, 4), { wash: GOLDC, washOp: 255 * (1 - a), ink: null });
    }
  };
  // speed lines (world)
  const speed = (x, y, dx, dy, n, len, key, col = '#FFFFFF', spread = 70) => {
    boilSeed(key); const d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
    for (let i = 0; i < n; i++) { const o = (hash(i * 3.7) - .5) * 2, l = len * (.5 + hash(i * 1.3) * .6), px = x - uy * o * spread, py = y + ux * o * spread; inkLine([[px - ux * 30, py - uy * 30], [px - ux * (30 + l), py - uy * (30 + l)]], 2, col, 'inkfine', 0); }
  };
  const halo = (x, y, r, k, key = 'halo') => {
    if (k <= 0) return; boilSeed(key);
    glow(x, y, r * 2, '#FFE08A', .5 * k);
    const P = ellPts(x, y, r * k, r * .3 * k, 24);
    inkLine([...P, P[0]], 7, GOLDC, 'ink', .5);
  };

  // ================= A · the hook: the innocent face, the broken ladle =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1250 - lt * 6, 1.1 + .03 * lt);
    ashram(t);
    const X = 540, Y = 1590, u = 48;
    const LA = -Math.PI + 1.05, LX = X - 95, LY = Y - 60, LEN = 300;
    if (t < SNAP) ladle(LX, LY, LEN, LA, 'hl');
    else {
      const a = t - SNAP;
      ladleBroken(LX, LY, LEN, LA + .12 * Math.sin(a * 30) * Math.exp(-a * 7), 'hlb');
      const bp = [LX + Math.cos(LA) * LEN * .55, LY + Math.sin(LA) * LEN * .55], land = [215, Y + 30];
      const k = clamp(a / .55), p = k < 1 ? arcPt(bp, land, 170, k) : [land[0], land[1] - 18 * Math.abs(Math.sin(Math.min(a - .55, .5) * 12)) * Math.exp(-(a - .55) * 6)];
      ladleHead(p[0], p[1], LEN, lerp(LA, -TAU - .08, easeOut(k)), 'hlh');
    }
    const o = { pose: 'sit', boilKey: 'baby', seed: 3, eyes: 'normal', mouth: 'cat', tailSway: t * 1.4, lookY: .1 };
    if (blinkAt(t, BLINK)) o.eyes = 'closed';
    if (t > SIDE && t < SNAP) { o.lookX = -.95; o.mouth = 'flat'; o.hx = -.12; }
    if (t >= SNAP && t < GRIN) { const tk = take(t, SNAP, .7); o.eyes = 'wide'; o.mouth = 'O'; o.sq = tk.sq; o.dy = tk.dy; o.lookX = -.7; }
    if (t >= GRIN) {
      const g = t - GRIN;
      o.eyes = blinkAt(t, 3.25) ? 'closed' : 'happy'; o.mouth = 'grin'; o.blush = clamp(g * 3) * .85; o.htilt = -.13 * ease(clamp(g * 4));
      o.handL = [-1.0, -3.3]; o.handR = [1.0, -3.3]; o.handShapeL = o.handShapeR = 'fist'; o.dy = -.12 * Math.abs(Math.sin(g * 8)) * Math.exp(-g * .8);
    }
    balHanuman(X, Y, u, o);
    if (t >= SNAP && t < GRIN + .3) { const h = bhHead(X, Y, u, o); boilSeed('hookemote'); emote('!', h[0] - 4.3 * u, h[1] - 2.6 * u, 34, pop(t, SNAP, 6), t - SNAP); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, GOLD);
  }

  // ================= B · the boons; nothing can hurt him (the boulder) =================
  function shotBoons(t, lt, dur) {
    const up = easeIn(seg(t, C0 - .3, C0));
    camBegin(540, 1180 - up * 1100, 1.0, 0);
    const sh = shake(t, BONK, .45, 16);
    camEnd(); camBegin(540 + sh[0], 1180 + sh[1] - up * 1100, 1.0 + .02 * lt);
    ashram(t);
    const X0 = 400, Y = 1660, u = 40;
    const COLS = ['#FFD24A', '#7EC8F2', '#F2645A', '#FFFFFF', '#B48AF2'];
    const FROM = [[-120, 520], [1200, 480], [140, 260], [980, 240], [560, 120]];
    const lunge = kf(t, [[BONK - .4, 0], [BONK - .18, -.9], [BONK, 3.0], [BONK + .2, 1.5], [BONK + .55, 0]], ease);
    const o = { pose: 'stand', boilKey: 'baby', seed: 3, dx: lunge, eyes: 'wide', mouth: 'O', tailSway: t * 1.6 };
    let arrived = 0, cur = null;
    for (let i = 0; i < 5; i++) { const t0 = SPARK + i * .32; if (t > t0 + .5) arrived++; else if (t > t0 && !cur) cur = i; }
    o.glowK = arrived / 5;
    if (cur != null) { const fx = FROM[cur][0]; o.lookX = clamp((fx - X0) / 500, -1, 1); o.lookY = -.6; }
    if (t > FLEX) { o.eyes = 'happy'; o.mouth = 'grin'; o.handL = [-4.0, -10.6]; o.handR = [4.0, -10.6]; o.handShapeL = o.handShapeR = 'fist'; o.bendL = o.bendR = -1; o.dy = -.15 * pulse(t, 2); }
    if (t > ROCK) { o.eyes = 'normal'; o.lookX = .9; o.lookY = 0; o.mouth = 'grin'; o.handL = o.handR = undefined; o.bendL = o.bendR = undefined; }
    if (t > BONK - .4 && t < BONK + .3) { o.eyes = 'squeeze'; o.mouth = 'puff'; o.sq = t < BONK ? .12 : -.08; }
    if (t > BONK + .3) { o.eyes = 'happy'; o.mouth = 'grin'; o.lookX = 0; }
    if (t > GIGGLE) { o.dy = -.25 * Math.abs(Math.sin((t - GIGGLE) * 9)); o.handL = [-3.6, -4.6]; o.handR = [3.6, -4.6]; o.bendL = o.bendR = 1; o.blush = .5; }
    // the boulder rolls in from the right, then splits on the headbutt
    if (t > ROCK) {
      const k = backOut(seg(t, ROCK, ROCK + .5));
      boulder(lerp(1450, 850, k), Y + 8, 560, clamp((t - BONK) / .7), 'boulder');
    }
    balHanuman(X0, Y, u, o);
    const belly = bhBelly(X0, Y, u, o);
    for (let i = 0; i < 5; i++) {
      const t0 = SPARK + i * .32, a = t - t0;
      if (a > 0 && a < .5) { const p = arcPt(FROM[i], belly, -160, easeIn(a / .5)); boonLight(p[0], p[1], 22, COLS[i], t, 'boon' + i); }
      if (a >= .5) sparkleBurst(belly[0], belly[1], 70, a - .5, 'boonburst' + i, 8, [COLS[i], '#FFFFFF']);
    }
    if (t > FLEX && t < ROCK) { const h = bhHead(X0, Y, u, o); boilSeed('flexemote'); emote('spark', h[0] + 4.2 * u, h[1] - 2.2 * u, 30, pop(t, FLEX), t - FLEX); }
    if (t > BONK && t < BONK + .7) { const h = bhHead(X0, Y, u, o); sparkleBurst(h[0] + 3.4 * u, h[1], 90, t - BONK, 'bonkburst', 10, ['#FFFFFF', '#FFE69A']); }
    if (up > 0) speed(540, 1000 - up * 1100, 0, -1, 14, 500, 'whipB', '#FFFFFF', 500);
    camEnd();
    caps(t);
  }

  // ================= C0 · the crane down from the canopy to the ashram =================
  const ashramCast = (t, o = {}) => {
    rishi(210, 1640, 15, 1, { sit: 1, eyes: 'closed', mouth: 'smile', boilKey: 'r1', seed: 1, ...(o.r1 || {}) });
    rishi(870, 1640, 15, 2, { sit: 1, eyes: 'closed', mouth: 'smile', boilKey: 'r2', seed: 2, ...(o.r2 || {}) });
    rishi(560, 1590, 15, 0, { sit: 1, eyes: 'closed', mouth: talk(t, 0, 99, 'smile', 'O'), boilKey: 'r0', seed: 0, ...(o.r0 || {}) });
    yagnaKund(560, 1700, 200, t, 0, 'kund0');
  };
  function shotCrane(t, lt, dur) {
    const k = ease(seg(t, C0, C0 + 2.1));
    camBegin(lerp(330, 540, k), lerp(430, 1250, k), lerp(1.75, 1.0, k));
    ashram(t);
    ashramCast(t);
    boilSeed('crane trunk');
    paint(ribbon([[-60, 1700], [-30, 1000], [-50, 160]], 70, 60), { wash: P1.bark, fill: P1.barkDk, fillOp: 50, tex: .5, ink: P1.ink, sw: 1.1 });
    branch(-50, 230, 640, 190, 'crane branch');
    const sw = .22 * Math.sin(t * 2.6);
    hangBaby(330, 210, 24, sw, { eyes: blinkAt(t, 9.4) ? 'closed' : 'happy', mouth: 'grin', lookY: -.8, boilKey: 'baby', seed: 3, handR: [3.4, -10 + Math.sin(t * 8) * .8], handShapeR: 'open' }, 'hangC');
    camEnd();
    caps(t);
    if (lt < .25) speed(540, 960, 0, -1, 14, 500 * (1 - lt / .25), 'whipC', '#FFFFFF', 500);
    wipeOut(lt, dur, LEAFW);
  }

  // ================= C1 · the bark cloth on the line =================
  function shotBark(t, lt, dur) {
    camBegin(540 + 16 * Math.sin(lt * .5), 1260, 1.05);
    ashram(t);
    // the rishi pops out of his hut at the end, holding a torn strip
    if (t > 12.6) {
      const k = backOut(seg(t, 12.6, 13.0)), tk = take(t, 12.7, .8);
      rishi(lerp(-150, 190, k), 1560, 15, 2, { eyes: 'wide', mouth: 'scream', boilKey: 'rpop', seed: 4, sq: tk.sq, dy: tk.dy, handR: [5.2, -19], bendR: .4, lookX: .8,
        armR: (u, sw) => barkStrip(0, -.2 * u, 2.6 * u, 5 * u, .2 + .1 * Math.sin(t * 9), 1, 'held strip'), emote: '!!', emoteK: pop(t, 12.9), emoteAge: t - 12.9 });
    }
    const LY = 990, k = lineK(t), gx = lerp(120, 960, k), gy = LY + Math.sin(k * Math.PI) * 50 + 46;
    const strips = STRIPK.map((sk, i) => [sk, t > RIPS[i] ? 1 : 0, clamp((t - RIPS[i] - .05) / .8)]);
    dryingLine(120, 960, LY, 50, strips, 'line', t > SWING - .4 ? [k, gx, gy] : null);
    const swing = .32 * Math.sin((t - SWING) * 7) * (t > SWING ? 1 : 0);
    const hk = t < SWING ? ease(seg(t, BARK0, SWING)) : 1;   // he drops in from above onto the line
    hangBaby(gx, gy - (1 - hk) * 600, 26, swing, { eyes: 'happy', mouth: t > RIPS[0] ? 'grin' : 'cat', lookY: -.3, boilKey: 'baby', seed: 3, handL: [-3.6, -11.5 + Math.sin(t * 9)], handShapeL: 'open' }, 'hangL');
    // a tear: a puff of bark dust at each rip
    RIPS.forEach((r, i) => { if (t > r && t < r + .5) { const p = [lerp(120, 960, STRIPK[i]), LY + Math.sin(STRIPK[i] * Math.PI) * 50 + 60]; poof(p[0], p[1], 50, (t - r) / .5, 'rip' + i, [CP.barkLt, CP.bark]); } });
    camEnd();
    caps(t);
    wipeIn(lt, LEAFW);
  }

  // ================= C2 · the yagna: drums on the pots, the whoomph =================
  function shotYagna(t, lt, dur) {
    const nb = BEATS.filter(b => t > b).length, punch = t < CRACK + .4 ? nb * .06 : .24;
    const sh = shake(t, WHOOMPH, .5, 14);
    camBegin(500 + sh[0], 1400 + sh[1], 1.2 + punch + .01 * lt);
    ashram(t);
    const RX = 690, RY = 1610, ru = 20;
    const soot = clamp((t - WHOOMPH - .25) / .3);
    const ro = { sit: 1, boilKey: 'rY', seed: 5, eyes: 'closed', mouth: t < WHOOMPH ? talk(t, 0, 99, 'smile', 'O') : 'O', hat: sootHat(soot) };
    if (t > WHOOMPH + .45) { ro.eyes = blinkAt(t, 17.75) || blinkAt(t, 18.05) ? 'closed' : 'wide'; ro.mouth = 'O'; ro.sweat = true; }
    rishi(RX, RY, ru, 0, ro);
    const flare = t > WHOOMPH ? Math.exp(-(t - WHOOMPH) * 2.5) : 0;
    yagnaKund(RX, 1720, 280, t, flare, 'kundY');
    // the ladles: on the ground until he grabs them
    const X = 300, Y = 1745, u = 30;
    const walkK = ease(seg(t, YAG0, GRAB - .25)), bx = lerp(-120, X, walkK);
    const o = { pose: 'stand', boilKey: 'baby', seed: 3, eyes: 'happy', mouth: 'cat', lookX: .4, glowK: .25, walk: walkK > 0 && walkK < 1 ? (t - YAG0) * 2.2 : null, tailSway: t * 2 };
    let LA = null;
    if (t < GRAB) { ladle(372, 1752, 150, -.08, 'lg1'); ladle(392, 1772, 140, .06, 'lg2'); o.lookX = .8; o.lookY = .5; o.mouth = 'grin'; }
    else {
      const db = BEATS.map(b => t - b), cur = db.filter(d => d > 0).length - 1;
      const hit = s => { const i = BEATS.findIndex((b, j) => j % 2 === (s < 0 ? 0 : 1) && t > b - .12 && t < b + .14); return i >= 0; };
      const handFor = s => t < DRUM - .3 ? [s * 2.8, -7.5] : t > CRACK + .1 ? [s * 3.4, -11.2] : hit(s) ? [s * 2.5, -5.6] : [s * 3.1, -10.4];
      o.handL = handFor(-1); o.handR = handFor(1); o.handShapeL = o.handShapeR = 'fist';
      o.eyes = 'happy'; o.mouth = t > DRUM ? 'grin' : 'cat'; o.dy = -.12 * pulse(t, 2);
      if (t > CRACK) { o.eyes = 'wide'; o.mouth = 'O'; o.lookX = .8; o.dy = 0; const tk = take(t, CRACK, .6); o.sq = tk.sq; }
      if (t > WHOOMPH + .3) { o.eyes = 'happy'; o.mouth = 'grin'; o.blush = .6; o.lookX = .3; }
      LA = s => { const h = s < 0 ? o.handL : o.handR, down = h[1] > -7; return down ? (s > 0 ? 1.25 : Math.PI - 1.25) : (s > 0 ? -.7 : Math.PI + .7); };
    }
    balHanuman(bx, Y, u, o);
    if (LA) for (const s of [-1, 1]) { const h = bhHand(bx, Y, u, o, s); ladle(h[0], h[1], 120, LA(s), 'lh' + s, 1.2); }
    // the pots in front of him: they squash on each beat, crack, then split
    const crack = clamp(BEATS.filter(b => t > b).length / 4), split = clamp((t - CRACK) / .3);
    [[X - 90, 0], [X + 90, 1]].forEach(([px, j]) => {
      const sq = BEATS.reduce((m, b, i) => i % 2 === j && t > b && t < b + .25 ? Math.max(m, 1 - (t - b) / .25) : m, 0);
      clayPot(px, 1800, 120, crack * (j ? 1 : .8), split, 'pot' + j, sq);
    });
    if (t > CRACK) { boilSeed('ghee'); const k = clamp((t - CRACK) / .45); paint(ribbon([[X + 100, 1792], [lerp(X + 100, RX - 120, k), 1796], [lerp(X + 100, RX - 110, k), 1790]], 22, 12), { wash: CP.ghee, ink: CP.ink, sw: .6 }); }
    // the whoomph: smoke billows up into his face, then out to fill the screen (the cut)
    if (t > WHOOMPH) {
      const a = t - WHOOMPH;
      glow(RX, 1560, 380 * Math.exp(-a * 2), '#FFC060', .9 * Math.exp(-a * 3));
      smokePuff(RX, 1440 - a * 60, 170 + a * 120, clamp(a / 1.2), 'whoomph', [0, -.4]);
    }
    camEnd();
    if (t > 17.9) {   // the smoke fills the frame
      const k = ease(seg(t, 17.9, 18.4));
      boilSeed('smokefill');
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, r = 900 * (1 - k) + 60; paint(ellPts(540 + Math.cos(a) * r, 960 + Math.sin(a) * r * 1.3, 380 * k + 40, 340 * k + 40, 16), { wash: i % 2 ? CP.smoke : CP.smokeLt, washOp: 255 * k, ink: null }); }
      if (k > .9) paint(rectPts(-40, -40, W + 80, H + 80), { wash: CP.smoke, washOp: 255 * (k - .9) * 10, ink: null });
    }
    caps(t);
  }

  // ================= C3 · the rishis forgive him (again and again) =================
  function shotForgive(t, lt, dur) {
    camBegin(540, 1340, 1.0 + .015 * lt);
    ashram(t);
    const RS = [[230, 1, 'rf1'], [540, 0, 'rf0'], [850, 2, 'rf2']], RY = 1790, ru = 22;
    RS.forEach(([x, k, key], i) => {
      const tw = TWITCH[i === 0 ? 0 : i === 2 ? 1 : 2], twitching = t > tw && t < tw + .35;
      rishi(x, RY, ru, k, { sit: 1, boilKey: key, seed: 6 + i, eyes: twitching ? ['happy', 'wide'] : 'happy', mouth: 'grin', sweat: true, hat: sootHat(.75),
        dx: twitching ? .12 * Math.sin(t * 60) : 0, htilt: twitching ? .05 : 0, mudra: 1, dy: i === 1 ? .06 * Math.abs(Math.sin(t * 5)) : 0 });
      barkStrip(x + 2.4 * ru, RY - 4.2 * ru, 34, 70, .5, 1, key + 'rag');   // a rag of bark cloth on each lap
    });
    // the baby sits on the middle rishi's head, his tail round the topknot, drumming on it with his palms
    const top = naradaTop(540, RY, ru, { sit: 1 });
    const drum = Math.sin(t * 14);
    balHanuman(top[0], top[1] + 14, 21, { pose: 'sit', eyes: 'happy', mouth: 'grin', boilKey: 'baby', seed: 3, glowK: .25, blush: .4, tailSway: t * 2,
      handL: [-2.6, -4.6 + (drum > 0 ? .8 : 0)], handR: [2.6, -4.6 + (drum < 0 ? .8 : 0)], handShapeL: 'open', handShapeR: 'open', dy: -.12 * Math.abs(drum), noShadow: true });
    camEnd();
    if (lt < .6) {   // the smoke clears
      const k = 1 - ease(lt / .6);
      boilSeed('smokeclear');
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, r = 900 * (1 - k) + 60; paint(ellPts(540 + Math.cos(a) * r, 960 + Math.sin(a) * r * 1.3, 380 * k + 40, 340 * k + 40, 16), { wash: i % 2 ? CP.smoke : CP.smokeLt, washOp: 255 * k, ink: null }); }
    }
    caps(t);
  }

  // ================= D · his parents say NO; the angel; the crash; the facepalm =================
  function parentsSky(t, key = 'psky') {
    boilSeed(key);
    paint(rectPts(-600, -600, W + 1200, 2000), { wash: P1.skyHi, ink: null });
    paint(ellPts(540, 1500, 1200, 500, 26), { fill: P1.skyLo, fillOp: 230, bleed: .3, tex: .4, ink: null });
    for (let i = 0; i < 3; i++) cloudPuff(100 + i * 420 + 20 * Math.sin(t * .3 + i), 760 + 120 * hash(i * 3.3), 90, key + 'c' + i, 220);
    boilSeed(key + 'hills');
    paint([[-400, 1820], [0, 1700], [380, 1740], [760, 1680], [1200, 1740], [1500, 1760], [1500, 2400], [-400, 2400]], { wash: P1.hill, fill: P1.hillDk, fillOp: 40, tex: .4, ink: null, curv: .6 });
    paint(rectPts(-400, 1790, W + 800, 700), { wash: P1.grass, fill: P1.grassDk, fillOp: 40, tex: .5, ink: null });
    inkLine([[-200, 1795], [400, 1785], [1300, 1800]], .8, P1.ink, 'ink', .5);
  }
  const wag = (t, t0) => t > t0 ? Math.sin((t - t0) * 20) : 0;
  function parentsCast(t, palm) {
    const ao = { boilKey: 'anj', seed: 10, eyes: palm ? 'closed' : 'normal', mouth: palm ? 'flat' : t > NO1 ? 'flat' : 'smile', htilt: palm ? .1 : 0 };
    const tkA = take(t, NO1, .5);
    if (palm) { ao.handR = [1.0, -21.4]; ao.bendR = .9; }
    else if (t > NO1 - .2) { ao.handR = [3.6 + .55 * wag(t, NO1), -21.8]; ao.bendR = .6; ao.sq = tkA.sq; ao.dy = tkA.dy; ao.emote = 'anger'; ao.emoteK = pop(t, NO1); ao.emoteAge = t - NO1; }
    anjana(330, 1800, 25, ao);
    const ko = { boilKey: 'kes', seed: 11, eyes: palm ? 'closed' : t > NO2 ? 'angry' : 'normal', mouth: palm ? 'frown' : t > NO2 ? 'frown' : 'smile', sweat: palm };
    const tkK = take(t, NO2, .5);
    if (palm) { ko.handR = [1.2, -21.6]; ko.bendR = 1; }
    else if (t > NO2 - .2) { ko.handR = [4.4 + .55 * wag(t, NO2), -20.6]; ko.bendR = .6; ko.sq = tkK.sq; ko.dy = tkK.dy; ko.emote = 'anger'; ko.emoteK = pop(t, NO2); ko.emoteAge = t - NO2; }
    kesari(750, 1800, 21, ko);
    const vo = { boilKey: 'vayu', seed: 12, pack: false, eyes: palm ? 'closed' : t > NO3 ? 'angry' : 'normal', mouth: palm ? 'frown' : t > NO3 ? 'frown' : 'smile', speed: 0, tail: t * 1.3,
      dy: -.2 * Math.sin(t * 1.8), aL: -.6 };
    const tkV = take(t, NO3, .5);
    if (palm) { vo.aR = 1.75; vo.blush = 0; }
    else if (t > NO3 - .2) { vo.aR = 1.05 + .3 * wag(t, NO3); vo.sq = tkV.sq; vo.emote = 'anger'; vo.emoteK = pop(t, NO3); vo.emoteAge = t - NO3; }
    vayu(570, 1100, 27, { ...vo, flip: true });
  }
  function shotParents(t, lt, dur) {
    camBegin(540, 1150 - lt * 4, 1.0 + .012 * lt);
    parentsSky(t);
    parentsCast(t, false);
    camEnd();
    caps(t);
  }
  function shotAngel(t, lt, dur) {
    const sh = shake(t, CRASH, .4, 18);
    camBegin(540 + sh[0], 1230 + sh[1], 1.08);
    parentsSky(t);
    const X = 540, Y = 1760, u = 40;
    const gone = t > ZIP;
    const o = { pose: 'stand', boilKey: 'baby', seed: 3, eyes: t < NOD + .1 ? 'closed' : 'happy', mouth: 'smile', handL: [-.45, -6.9], handR: [.45, -6.9], handShapeL: 'open', handShapeR: 'open',
      nod: .55 * (Math.max(0, Math.sin(clamp((t - NOD - .1) / .35) * Math.PI)) + Math.max(0, Math.sin(clamp((t - NOD - .5) / .35) * Math.PI))), blush: .5, tailSway: t };
    if (t > ZIP - .18) { o.sq = .22; o.eyes = 'happy'; o.mouth = 'grin'; o.dy = .2; o.lookX = 1; }
    const h = bhHead(X, Y, u, o), hy = h[1] - 5.2 * u;
    if (!gone) {
      balHanuman(X, Y, u, o);
      boilSeed('angel sparkles');
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + t, r = 6.5 * u; paint(starPts(h[0] + Math.cos(a) * r, h[1] + Math.sin(a) * r * .8, 12 * (.6 + .4 * Math.sin(t * 5 + i)), .35, 4), { wash: '#FFF2B0', ink: null }); }
      halo(h[0], hy, 1.9 * u, pop(t, NOD + .1, 4), 'halo');
    } else {
      poof(X, Y - 7 * u, 160, (t - ZIP) / .6, 'zip');
      if (t < ZIP + .3) speed(X + 300, Y - 7 * u, 1, 0, 12, 700, 'zipspeed', '#FFFFFF', 300);
      const fall = easeIn(seg(t, ZIP + .25, ZIP + .55)), bounce = t > ZIP + .55 ? -26 * Math.abs(Math.sin((t - ZIP - .55) * 10)) * Math.exp(-(t - ZIP - .55) * 5) : 0;
      halo(h[0], lerp(hy, Y - 6, fall) + bounce, 1.9 * u, 1, 'halo');
    }
    if (t > CRASH) {   // a crash off to the right: a pot shard and a puff fly back in
      const a = t - CRASH;
      poof(1060, 1500, 200, a / .5, 'crash', ['#E8D6CC', '#C8B8B0']);
      const p = arcPt([1150, 1400], [800, 1790], 300, clamp(a / .55));
      boilSeed('shard'); push(); translate(p[0], p[1]); rotate(a * 12); paint([[-40, 0], [10, -38], [42, -6], [18, 28]], { wash: CP.clay, fill: CP.clayDk, fillOp: 50, tex: .4, ink: CP.ink, sw: 1 }); pop();
    }
    camEnd();
    caps(t);
  }
  function shotPalm(t, lt, dur) {
    camBegin(540, 1150, 1.0);
    parentsSky(t);
    parentsCast(t, true);
    camEnd();
    caps(t);
  }

  // ================= E1 · the rishis get angry (only a little) =================
  function shotAngry(t, lt, dur) {
    camBegin(545, 1380, 1.35 + .03 * lt);
    ashram(t);
    const A = [400, 1730], B = [690, 1730], u = 25;
    const opened = t > OPEN, tkO = take(t, OPEN, .5);
    const ao = { sit: 1, boilKey: 'ra', seed: 20, eyes: opened ? 'normal' : 'closed', mouth: 'flat', lookX: .7, sq: tkO.sq, dy: tkO.dy, mudra: 1 };
    const red = clamp((t - RED) / .5) * (1 - .7 * ease(seg(t, CALM + .2, CALM + .9)));
    const bo = { sit: 1, boilKey: 'rb', seed: 21, eyes: opened ? 'normal' : 'closed', mouth: 'flat', lookX: .7, sq: tkO.sq, dy: tkO.dy, mudra: 1, tint: '#E2503A', tintK: red };
    if (t > RED) { bo.eyes = 'angry'; bo.mouth = 'frown'; bo.dx = .1 * Math.sin(t * 50) * (t < CALM + .4 ? 1 : 0); bo.emote = 'steam'; bo.emoteK = (t < CALM + .4 ? 1 : .45) * pop(t, RED); bo.emoteAge = t - RED; }
    if (t > CALM) {   // the white-bearded one pats his arm: he cools to a little pout
      const pat = Math.sin((t - CALM) * 10) * .3;
      ao.handR = [7.6, -16.3 + pat]; ao.bendR = -.4; ao.eyes = 'happy'; ao.mouth = 'smile'; ao.lookX = .9; ao.mudra = 0;
      if (t > CALM + .5) { bo.eyes = 'normal'; bo.brow = -.7; bo.mouth = 'pout'; bo.lookX = -.4; }
    }
    rishi(B[0], B[1], u, 1, bo);
    rishi(A[0], A[1], u, 0, ao);
    camEnd();
    caps(t);
  }

  // ================= E2 · the curse: the water, the strength drains, the pebble, the plop =================
  function shotCurse(t, lt, dur) {
    camK(t, [[CURSE, [540, 1270, 1.0]], [35.35, [560, 1300, 1.05]], [35.65, [770, 1460, 1.5]], [F0, [770, 1470, 1.58]]]);
    ashram(t);
    boilSeed('curse light'); paint(rectPts(-600, -600, W + 1200, 3000), { fill: '#4A4A7A', fillOp: 45, bleed: .05, tex: .2, ink: null });
    // the rishis: one flicks water from his kamandalu, the other raises his hand
    const tilt = t > SPRINKLE - .2 ? .95 * ease(seg(t, SPRINKLE - .2, SPRINKLE)) * (1 - ease(seg(t, SPRINKLE + .7, SPRINKLE + 1.1))) : 0;
    const r0 = { sit: 1, boilKey: 'rc0', seed: 22, eyes: 'normal', mouth: talk(t, CURSE, CURSE + 1.3, 'flat', 'open'), lookX: .9, handR: [4.6, -16.5 - 2 * tilt], bendR: .5, armR: (u, sw) => kamandalu(u, sw, 1, tilt) };
    rishi(230, 1670, 21, 0, r0);
    rishi(480, 1670, 21, 1, { sit: 1, boilKey: 'rc1', seed: 23, eyes: 'normal', brow: -.5, mouth: talk(t, CURSE + .2, CURSE + 1.6, 'flat', 'open'), lookX: .9, handR: t > CURSE ? [4.2, -21.6] : undefined, bendR: .4 });
    // the baby
    const X = 830, Y = 1700, u = 34;
    const drain = 1 - ease(seg(t, DRAIN, DRAIN + 1.6));
    const o = { pose: 'stand', boilKey: 'baby', seed: 3, eyes: 'normal', mouth: 'grin', lookX: -.8, glowK: .9 * drain, tail: t > 34.5 ? 'droop' : 'curl', tailSway: t };
    if (t > SPRINKLE + .3) { o.eyes = 'wide'; o.mouth = 'O'; const tk = take(t, SPRINKLE + .35, .5); o.sq = tk.sq; o.dy = tk.dy; }
    if (t > 34.4) { o.eyes = 'sad'; o.mouth = 'frown'; o.lookX = 0; o.lookY = .3; }
    if (t > LIFT - .3 && t < PLOP) {
      const strain = seg(t, LIFT, LIFT + .3);
      o.handL = [-2.0, -2.0]; o.handR = [-.4, -1.8]; o.bendL = o.bendR = 1; o.dy = .5 * strain; o.sq = .1 * strain; o.dx = .15 * Math.sin(t * 45) * strain;
      o.eyes = 'squeeze'; o.mouth = 'puff'; o.lookX = -.4; o.lookY = .6;
    }
    let pose = o;
    if (t > PLOP) {
      const tk = take(t, PLOP, .9);
      pose = { pose: 'sit', boilKey: 'baby', seed: 3, eyes: blinkAt(t, 37.0) || blinkAt(t, 37.25) ? 'closed' : 'normal', mouth: t > 37.0 ? 'pout' : 'O', lookY: .2, tail: 'droop', tailSway: 0, sq: tk.sq, dy: tk.dy,
        emote: 'sweat', emoteK: pop(t, PLOP + .2), emoteAge: t - PLOP };
    }
    pebble(X - 70, Y + 14, 46, 'pebble');
    balHanuman(X, Y, u, pose);
    // the water flicked from the spout: drops arc onto him
    if (t > SPRINKLE && t < SPRINKLE + 1.2) {
      const sp = naradaHand(230, 1670, 21, r0, 1), from = [sp[0] + 40, sp[1] + 20], to = bhHead(X, Y, u, o);
      for (let i = 0; i < 7; i++) {
        const a = (t - SPRINKLE - i * .07) / .5; if (a < 0 || a > 1.3) continue;
        if (a <= 1) { const p = arcPt(from, [to[0] + (i - 3) * 22, to[1] - 40 + (i % 2) * 30], 220 + i * 12, a); waterDrop(p[0], p[1], 11, 'drop' + i); }
        else sparkleBurst(to[0] + (i - 3) * 22, to[1] - 40, 40, (a - 1) * 2, 'dropburst' + i, 6, ['#E2F6FF', '#8FD2F0']);
      }
    }
    drainSparks(X, Y - 4 * u, 5 * u, 10 * u, t, DRAIN, DRAIN + 1.6, 'drain');
    camEnd();
    caps(t);
    if (t > F0 - .4) { const k = ease(seg(t, F0 - .4, F0)); const h = toScreenHead(X, Y, u); iris(h[0], h[1], lerp(1500, 0, k), CP.ink); }
  }
  // the baby's head in screen space for the iris (camera of the curse shot at its end)
  const toScreenHead = (X, Y, u) => { const c = kf(F0 - .01, [[CURSE, [540, 1270, 1.0]], [35.35, [560, 1300, 1.05]], [35.65, [770, 1460, 1.5]], [F0, [770, 1470, 1.58]]], ease); const hx = X, hy = Y - 9.2 * u; return [540 + (hx - c[0]) * c[2], 960 + (hy - c[1]) * c[2]]; };

  // ================= F · gentle: the kamandalu, the flower, the pat; the tilt up into the years =================
  function shotGentle(t, lt, dur) {
    const tilt = easeIn(seg(t, YEARS, LAPSE0));
    camBegin(560, 1330 - tilt * 2000, 1.18);
    ashram(t);
    glow(560, 1250, 900, '#FFC870', .35);
    const RX = 720, RY = 1650, ru = 21;
    const ro = { sit: 1, boilKey: 'rg', seed: 24, eyes: t < 39.1 ? 'closed' : 'happy', mouth: 'smile', lookX: -.7, mudra: 1 };
    const X1 = 560, Y = 1730, u = 30;
    const wk = ease(seg(t, F0, 39.3)), bx = lerp(150, X1, wk);
    if (t > PAT - .25) { const p = Math.sin((t - PAT) * 9) * .35; ro.handL = [-6.6, -23.6 + p]; ro.bendL = -.6; ro.mudra = 0; }
    rishi(RX, RY, ru, 0, ro);
    const o = { pose: 'stand', boilKey: 'baby', seed: 3, eyes: 'look', mouth: 'cat', lookX: .2, lookY: .7, walk: wk > 0 && wk < 1 ? (t - F0) * 1.2 : null, tailSway: t * .8,
      handL: [-1.25, -6.6], handR: [1.25, -6.6], handShapeL: 'hold', handShapeR: 'hold' };
    const offer = ease(seg(t, OFFER - .3, OFFER + .2));
    o.handL = [lerp(-1.25, .2, offer), lerp(-6.6, -8.8, offer)]; o.handR = [lerp(1.25, 2.4, offer), lerp(-6.6, -9.0, offer)];
    if (t > OFFER - .3) { o.eyes = 'normal'; o.lookX = .8; o.lookY = -.4; o.mouth = 'smile'; }
    if (t > PAT) { o.eyes = 'happy'; o.mouth = 'grin'; o.blush = .8; o.emote = 'hearts'; o.emoteK = pop(t, PAT + .15); o.emoteAge = t - PAT; o.dy = -.08 * Math.abs(Math.sin((t - PAT) * 6)); }
    balHanuman(bx, Y, u, o);
    const hL = bhHand(bx, Y, u, o, -1), hR = bhHand(bx, Y, u, o, 1), mx = (hL[0] + hR[0]) / 2, my = (hL[1] + hR[1]) / 2;
    kamandaluAt(mx, my - 18, 26, 'gkmd', .05 * Math.sin(t * 3));
    flowerProp(mx - 4, my - 42, 16, 'gflower', t * .2);
    camEnd();
    caps(t);
    if (lt < .4) { const h = [540 + (bx - 560) * 1.18, 960 + (Y - 9 * u - 1330) * 1.18]; iris(h[0], h[1], lerp(0, 1500, easeIn(lt / .4)), CP.ink); }
  }
  function shotYears(t, lt, dur) {
    const down = easeIn(seg(t, G0 - .5, G0));
    camBegin(540, 960 + down * 1500 - (1 - ease(clamp(lt / .4))) * 300, 1.0);
    skyLapse(t, .25 + (t - LAPSE0) * 2.15);
    camEnd();
    caps(t);
  }

  // ================= G · the shore: nobody can leap; Hanuman sits apart =================
  const HX = 800, HY = 1430, HU = 19;
  const vanaras = t => {
    boilSeed('spit'); paint(ellPts(170, 1610, 330, 70, 20), { wash: CP.sand, fill: CP.sandDk, fillOp: 40, tex: .4, ink: CP.ink, sw: 1 });
    const PALS = [VAN1, KES_PAL, VAN2];
    PALS.forEach((pal, i) => hanuman(70 + i * 105, 1600, 7.5, { crown: false, gada: 0, pal, boilKey: 'van' + i, seed: 30 + i, hx: .5 * Math.sin(t * 3.4 + i * 1.3), eyes: 'normal', mouth: 'frown', tail: 'droop', handL: [-3.8, -12 + i], handR: [3.8, -12.5] }));
  };
  const jamb = (t, o = {}) => jambavan(o.x ?? 620, HY, 17, { flip: true, boilKey: 'jamb', seed: 40, ...o });
  function shotShore(t, lt, dur) {
    camK(t, [[G0, [540, -500, 1.0]], [G0 + .9, [540, 1100, 1.0]], [PUSHG, [560, 1120, 1.0]], [H0, [700, 1250, 1.3]]]);
    shore(t, { hy: 1150, dusk: .2 + .08 * lt / dur, lankaX: 300 });
    vanaras(t);
    shoreRock(t, 760, HY, 700);
    hanuman(HX, HY, HU, { sit: 1, gada: 0, boilKey: 'hn', seed: 41, hx: -.4, lookX: -.6, lookY: .4, bow: .35, eyes: blinkAt(t, 47.6) ? 'closed' : 'normal', mouth: 'flat', tail: 'droop', mudra: 1 });
    camEnd();
    caps(t);
  }

  // ================= H · Jambavan reminds him; the reflection; his eyes =================
  function shotJambavan(t, lt, dur) {
    camBegin(700, 1250, 1.3 + .02 * lt);
    shore(t, { hy: 1150, dusk: .28, lankaX: 300 });
    shoreRock(t, 760, HY, 700);
    const wk = ease(seg(t, H0, JSIT - .2)), sat = t > JSIT;
    const jo = { x: lerp(380, 625, wk), walk: !sat && wk < 1 ? (t - H0) * 1.6 : null, hx: -.5, lookX: -.8, eyes: 'normal', mouth: talk(t, 51.7, 52.6, 'smile', 'open') };
    if (sat) { const tk = take(t, JSIT, .5); Object.assign(jo, { sit: 1, sq: tk.sq, dy: tk.dy, staff: 1, staffLen: 3.2, handL: [-7.2, -17.0 + .25 * Math.sin((t - JSIT) * 6)], bendL: .6, eyes: 'happy' }); }
    const turned = t > 50.7;
    hanuman(HX, HY, HU, { sit: 1, gada: 0, boilKey: 'hn', seed: 41, hx: turned ? -.7 : -.4, lookX: turned ? -1 : -.6, lookY: turned ? -.2 : .4, bow: turned ? .1 : .35, eyes: 'normal', mouth: 'flat', tail: 'droop', mudra: 1 });
    jamb(t, jo);
    camEnd();
    caps(t);
  }
  function shotReflection(t, lt, dur) {
    camBegin(540, 960, 1.0 + .05 * lt);
    boilSeed('pool');
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#1E3A66', ink: null });
    paint(ellPts(540, 1080, 620, 760, 30), { fill: '#3E6EA8', fillOp: 230, bleed: .3, tex: .4, border: .2, ink: null });
    glow(540, 1080, 700, '#8FB8F0', .3);
    sunDisc(700, 900, 120, 'reflsun', true);
    balHanuman(400, 1220, 24, { pose: 'fly', rot: .55, eyes: 'sparkle', mouth: 'aam', tail: 'stream', tailSway: t * 2.4, kick: t * 2.6, handL: [-2, -9.5], handR: [2.6, -10], handShapeL: 'open', handShapeR: 'open', boilKey: 'refl baby', seed: 3, noShadow: true });
    // ripples over the picture
    boilSeed('ripples');
    for (let i = 0; i < 4; i++) { const r = 80 + frac(lt * .55 + i / 4) * 700, a = 1 - frac(lt * .55 + i / 4); const P = ellPts(540, 1100, r, r * .55, 36); inkLine([...P, P[0]], 3 * a, '#CFE8FF', 'inkfine', .5); }
    for (let i = 0; i < 14; i++) { const y = 600 + i * 70, x = 200 + hash(i * 3.1) * 680 + Math.sin(t * 2 + i) * 30; inkLine([[x, y], [x + 60 + 40 * hash(i), y + 2]], 2, '#E2F2FF', 'inkfine', .3); }
    camEnd();
    caps(t);
  }
  function shotEyes(t, lt, dur) {
    const o = { sit: 1, gada: 0, boilKey: 'hn', seed: 41, hx: -.25, lookX: -.2, lookY: -.1, bow: 0, eyes: 'wide', brow: 1, mouth: 'O', tail: 'droop', mudra: 1 };
    const h = naradaHead(HX, HY, HU, o);
    camBegin(h[0] - 10, h[1] - 70, 2.4 + .25 * lt);
    shore(t, { hy: 1150, dusk: .3, lankaX: 300 });
    shoreRock(t, 760, HY, 700);
    hanuman(HX, HY, HU, o);
    const g = ease(seg(t, WIDE + .3, I0));
    for (const s of [-1, 1]) { const e = naradaEye(HX, HY, HU, o, s); glow(e[0], e[1], 40 + 40 * g, '#FFD060', .9 * g); boilSeed('eyestar' + s); paint(starPts(e[0] - 3, e[1] - 5, 6 * g, .35, 4, t), { wash: '#FFFFFF', ink: null }); }
    camEnd();
    caps(t);
  }

  // ================= I · he remembers: the heartbeat, he stands, he GROWS, the roar, the grin, the leap =================
  function shotStand(t, lt, dur) {
    camBegin(720, 1265, 1.35);
    shore(t, { hy: 1150, dusk: .3, lankaX: 300 });
    shoreRock(t, 760, HY, 700);
    jamb(t, { x: 625, sit: 1, staff: 1, staffLen: 3.2, eyes: 'wide', mouth: 'O', hx: -.6, lookX: -.9, lookY: -.8 });
    const up = t > STAND, tk = take(t, STAND, .6);
    const beat = Math.max(pulse(t - THUMP + 100, 1) * (t > THUMP && t < THUMP + .35 ? 1 : 0), t > THUMP + .4 && t < THUMP + .75 ? Math.exp(-(t - THUMP - .4) * 8) : 0);
    const o = { gada: 0, boilKey: 'hn', seed: 41, eyes: 'wide', mouth: up ? 'smile' : 'O', brow: 1, tail: up ? 'curl' : 'droop', hx: -.1, lookX: 0, lookY: -.3, sq: tk.sq, dy: tk.dy };
    if (!up) Object.assign(o, { sit: 1, mudra: 1, sq: -.05 * beat });
    const c = naradaLocal(HX, HY, HU, o, 0, -14.8);
    glow(c[0], c[1], 220 + 200 * beat + (up ? 200 : 0), '#FFD060', .5 + .4 * beat);
    hanuman(HX, HY, HU, o);
    camEnd();
    caps(t);
    if (beat > .05) flash(.25 * beat, '#FFE6A0');
  }
  function shotGrow(t, lt, dur) {
    const u = kf(t, [[GROW, 19], [GROW + .9, 64], [GROW + 1.15, 60]], ease);
    const sh = shake(t, ROAR, .7, 22), launch = easeIn(seg(t, LEAP, FLY0));
    const c = camK(t, [[GROW, [720, 1200, 1.2]], [GROW + .9, [700, 600, .62]], [ROAR, [700, 560, .62]], [TURN - .1, [700, 520, .64]], [TURN + .3, [760, 230, .95]], [CROUCH, [760, 250, .95]], [LEAP, [760, 220, .9]]], sh);
    shore(t, { hy: 1150, dusk: .3, lankaX: 300 });
    shoreRock(t, 760, HY, 700);
    jamb(t, { x: 625, sit: 1, staff: 1, staffLen: 3.2, eyes: 'happy', mouth: 'grin', hx: -.6, lookX: -.9, lookY: -1 });
    const roaring = t > ROAR - .15 && t < ROAR + .9, turned = t > TURN;
    const crouch = t > CROUCH && t < LEAP ? ease(seg(t, CROUCH, LEAP)) : 0;
    const o = { gada: 0, boilKey: 'hn', seed: 41, eyes: 'normal', brow: .6, mouth: 'smile', tail: 'curl', lookY: -.2, sq: .14 * crouch - .25 * launch, dy: .6 * crouch - 60 * launch };
    if (roaring) { o.eyes = 'angry'; o.mouth = 'scream'; o.brow = -1; o.lookY = 0; }
    if (turned) {
      o.eyes = t > WINK && t < WINK + .4 ? ['normal', 'closed'] : 'happy'; o.mouth = 'grin'; o.lookY = .35; o.lookX = .1; o.brow = .3; o.blush = .35;
      if (t > WINK) { o.emote = 'spark'; o.emoteK = pop(t, WINK); o.emoteAge = t - WINK; }
    }
    if (crouch > 0 || launch > 0) { o.handL = [-3.4, -26]; o.handR = [3.4, -26]; o.bendL = o.bendR = .5; }
    const chest = naradaLocal(HX, HY, u, o, 0, -14.8);
    glow(chest[0], chest[1], 30 * u, '#FFD060', .45);
    hanuman(HX, HY, u, o);
    // clouds at his waist as he rises past them
    if (u > 30) for (let i = 0; i < 3; i++) cloudPuff(560 + i * 260, 980 + 40 * Math.sin(i * 2), 120, 'growc' + i, 230 * clamp((u - 30) / 20));
    if (roaring) {
      const m = naradaMouth(HX, HY, u, o), a = (t - ROAR) / .9;
      if (a > 0) { shockRing(m[0], m[1], 120 + a * 1700, 1 - a, 'roar1', '#FFF2C0', .8); shockRing(m[0], m[1], 60 + a * 1100, (1 - a) * .7, 'roar2', '#FFFFFF', .8); }
    }
    if (launch > 0) speed(HX, HY - 30 * u - 60 * u * launch, 0, -1, 16, 900, 'launch', '#FFF2C0', 600);
    camEnd();
    caps(t);
    if (t > ROAR && t < ROAR + .3) flash(.35 * (1 - (t - ROAR) / .3), '#FFF2C0');
    if (t > LEAP && t < LEAP + .2) flash(.3, '#FFFFFF');
  }
  function shotFly(t, lt, dur) {
    camBegin(540, 1010 - lt * 20, 1.12 - .08 * ease(lt / dur));
    shore(t, { hy: 1150, dusk: .32, lankaX: 300 });
    shoreRock(t, 900, 1500, 500);
    const k = easeOut(seg(t, FLY0, J0 - .2));
    const p = arcPt([900, 1300], [330, 1040], 520, k);
    boilSeed('trail');
    const TR = []; for (let i = 0; i <= 12; i++) { const q = Math.max(0, k - .35 + i / 12 * .35); TR.push(arcPt([900, 1300], [330, 1040], 520, q)); }
    paint(ribbon(TR, 2, 26), { wash: GOLDC, washOp: 170, ink: null });
    for (let i = 0; i < 5; i++) glow(TR[i * 3][0], TR[i * 3][1], 60, '#FFD060', .35);
    glow(p[0], p[1], 120, '#FFD060', .7);
    hanuman(p[0], p[1] + 120, 9, { gada: 0, boilKey: 'hnfly', seed: 42, rot: -1.15, eyes: 'happy', mouth: 'grin', handL: [-1.6, -26], handR: [1.6, -26.5], bendL: .3, bendR: .3, tail: 'curl', noShadow: true });
    camEnd();
    caps(t);
    wipeOut(lt, dur, GOLD);
  }

  // ================= J · the ask: back in the ashram, the sheepish baby with the broken ladle =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1250, 1.1 + .015 * lt);
    ashram(t);
    const X = 540, Y = 1590, u = 48;
    ladleHead(215, 1620, 300, -.08, 'askhead');
    const o = { pose: 'sit', boilKey: 'baby', seed: 3, eyes: blinkAt(t, 63.6) || blinkAt(t, 65.2) ? 'closed' : 'happy', mouth: 'grin', blush: .85, htilt: -.13 + .05 * Math.sin(t * 2),
      handR: [3.0, -6.4], handShapeR: 'hold', handL: [-1.0, -3.3], handShapeL: 'fist', tailSway: t * 1.4, dy: -.08 * Math.abs(Math.sin(t * 5)) };
    balHanuman(X, Y, u, o);
    const h = bhHand(X, Y, u, o, 1);
    ladleBroken(h[0] - 20, h[1] + 30, 300, -1.2, 'askhandle');
    camEnd();
    caps(t);
    wipeIn(lt, GOLD);
    wipeOut(lt, dur, PEACH);
  }

  function shotCard(t, lt) {
    pcCard(t, CARDC);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, PEACH); }
  }

  shots([[0, shotHook], [B0, shotBoons], [C0, shotCrane], [BARK0, shotBark], [YAG0, shotYagna], [FORG0, shotForgive],
    [D0, shotParents], [ANGEL0, shotAngel], [PALM0, shotPalm], [E0, shotAngry], [CURSE, shotCurse], [F0, shotGentle], [LAPSE0, shotYears],
    [G0, shotShore], [H0, shotJambavan], [REFL, shotReflection], [WIDE, shotEyes], [I0, shotStand], [GROW, shotGrow], [FLY0, shotFly],
    [J0, shotAsk], [CARD, shotCard]]);
})();
