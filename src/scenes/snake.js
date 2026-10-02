// "Why would a god wear a deadly snake around his neck?": a captioned explainer for Rishi Katha's Navadurga picture books.
// A cobra lunges at the camera (the hook), then Shiva calmly strokes it. Mooshak runs from it (we are wired to fear snakes),
// and the answer begins with poison: the churning of the ocean of milk, Vasuki as the rope, Halahala, Shiva drinks it and
// Parvati holds his throat (Neelkanth). Vasuki gets the place of honour where the poison stopped. A snake means fear, death
// and time; Shiva does not run from what we fear, he WEARS it. Parvati once feared her own power (Chandraghanta, Book 3).
// 48.8 s, 1080×1920 (a vertical reel). Storyboard: STORYBOARD.md. Sets and props: snake_props.js.
// Characters: src/shiva.js, src/parvati.js, src/bappa.js (Mooshak). Sound: tools/snake_sfx.mjs.
//
// Every pose is a pure function of film time (shivaO, parvatiO, mooshakO, vasukiO), so the shots only choose a framing, a
// camera, captions and their transitions. Frame 0 is a finished picture with its caption already up: no fade in.
(() => {
  // ---------------- the times (tools/snake_sfx.mjs copies them) ----------------
  const A2 = 1.78, B0 = 3.6, C0 = 9.2, D0 = 18.2, E0 = 26.2, F0 = 29.8, G0 = 37.4, H0 = 42.0, CARD0 = 43.3; // DUR 48.8
  // A hook
  const TONGUE = [.35, .95], FLARE = 1.15, STRIKE = 1.5, GULLET = 1.72, NECK_CAP = 1.95, HAND = [2.1, 2.45], MELT = 2.5;
  // B wired to fear
  const PULL = [3.6, 4.6], WIRED_CAP = 3.85, MOUSE_IN = [4.15, 4.8], VAS_PEEK = 4.85, SPOT = 4.95, TAKE = 5.15, FLEE = [5.55, 6.0];
  const SLEEP_CAP = 6.05, YAWN = 6.5, PUSH_B = [6.0, 8.2], POISON_CAP = 7.9, WHIP = [8.85, 9.2];
  // C the churning
  const CHURN_CAP = 9.45, ROPE_CAP = 11.75, PUSH_C = [11.8, 13.0], WINCE = 12.45, STILL = 14.1, ERUPT = 14.5, HALA_CAP = 14.75;
  const SKY_POISON = [14.5, 15.6], RUN = 16.9, RAN_CAP = 16.9, EXCEPT_CAP = 17.5, INTO_CLOUD = [17.8, 18.2];
  // D Neelkanth
  const CLEAR = [18.2, 18.6], HANDS_UP = [18.3, 18.7], POUR = [18.55, 19.75], DRANK_CAP = 18.6, SIP = [19.75, 20.1], GULP = 20.15;
  const PARVATI_IN = [20.3, 21.1], HELD_CAP = 20.65, TOUCH = 21.3, SINK = [21.5, 22.9], BLUE = [23.1, 23.7], SKY_CLEAR = [23.1, 24.3];
  const STAYED_CAP = 23.15, NEEL_CAP = 24.55, NEEL_SUB = 24.85;
  // E Vasuki's place
  const PUSH_E = [26.2, 29.8], VAS_UP = [26.3, 26.7], VAS_CAP = 26.35, HONOUR_CAP = 28.0, STROKE = [27.95, 28.4], NUZZLE = 28.45;
  // F the meaning
  const MEANS_CAP = 29.85, FEAR = 30.2, DEATH = 31.05, TIME = 31.9, THESIS1 = 33.3, THESIS2 = 33.95, PEEK = 35.3, COMMENT = 35.4, COMMENT_SUB = 35.8, WIPE_OUT = 37.1;
  // G Chandraghanta
  const P_AFRAID_CAP = 37.6, FLICKER = [37.6, 39.3], SHIVA_HAND = 39.4, P_TAUGHT_CAP = 39.45, CALM = 39.7, CHANDRA_CAP = 40.5, BELL = 40.6, FLASH_G = [41.85, 42.0];
  // H the rhyme
  const RISE = [42.0, 42.2], FEINT = [42.2, 42.45], BLEP = 42.5, WINK = 42.65, RING = [42.85, 43.3];
  const CARD = { book: 43.5, fan: 43.9, logo: 44.5, series: 44.85, sub: 45.25, pill: 45.65, follow: 46.25 };

  // ---------------- the stage ----------------
  const SH = { x: 430, y: 1450, u: 29 };        // Shiva on his tiger skin (wide, A2 and B)
  const MOU = { y: 1440, u: 22 };               // Mooshak's ground
  const GOLDC = '#F5C542', VENOM = '#F5CE4A';
  const bump = (t, t0, a = .1, b = .25) => seg(t, t0 - a, t0) * (1 - seg(t, t0, t0 + b));
  const mixP = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  // where Vasuki's head is on Shiva's body, in his own units (mirrors snakeHead() in shiva.js)
  const snakeHeadAt = o => { const up = clamp(o.snakeUp || 0), lk = o.snakeLook ?? -1, sway = Math.sin(T * 2.3) * .25 * up; return [lerp(-5.1, -5.4 + lk * .6 + sway, up), lerp(-10.3, -14.4, up)]; };

  // ---------------- Shiva ----------------
  function shivaO(t) {
    const o = { ...feel('serene', t), ...SHV_SKIN, ganga: .8, seed: 3, snakeEyes: 'closed', snakeLook: 0 };
    // A2: Vasuki is fully up and angry at us; Shiva strokes him and he melts
    if (t >= A2 && t < B0 + 3) {
      const melt = ease(seg(t, MELT, MELT + .55)), set = ease(seg(t, B0, B0 + .5));
      o.snakeUp = lerp(1, .3, melt); o.snakeEyes = t < MELT ? 'angry' : 'happy'; o.snakeLook = 0;
      o.snakeTongue = bump(t, 2.0, .06, .3) * .9 + bump(t, 2.3, .05, .25) * .7;
      if (t > MELT + .7) { o.snakeUp = lerp(.3, .12, set); o.snakeEyes = t > B0 + .2 ? 'closed' : 'happy'; }
      const up = ease(seg(t, HAND[0], HAND[0] + .2)) * (1 - ease(seg(t, B0 - .35, B0 + .15)));
      if (up > 0) {   // his left hand (screen left) rises under Vasuki's chin, then strokes while he melts
        const hd = snakeHeadAt(o), stroke = ease(seg(t, MELT, MELT + .3)) * Math.sin((t - MELT) * 9) * .35;
        o.handL = mixP([-5.6, -3.55], [hd[0] - .3 + stroke, hd[1] + 1.4], up); o.bendL = 1.2;
      }
      o.sq = (o.sq || 0) + .03 * spring(t, STRIKE + .3, 6, 22) * (t < HAND[0] ? 1 : 0);
    }
    // B: asleep, one eye on Mooshak, a yawn, and settled again
    if (t >= B0 + 1 && t < C0) {
      o.snakeLook = -1;
      const peek = ease(seg(t, VAS_PEEK, VAS_PEEK + .2)) * (1 - ease(seg(t, FLEE[1] + .2, FLEE[1] + .6)));
      o.snakeUp = lerp(.12, .38, peek); o.snakeEyes = peek > .5 ? 'open' : 'closed';
      if (peek > .5 && t > TAKE) o.snakeTongue = bump(t, TAKE + .1, .05, .3);
      const y = bump(t, YAWN, .35, .45);
      if (y > 0) { o.snakeTongue = y; o.snakeUp = Math.max(o.snakeUp, .12 + .12 * y); }
    }
    if (t >= D0) neelO(t, o);
    return o;
  }
  // D, E (Neelkanth, Vasuki's place), F (the meaning) and G (Chandraghanta): Shiva after the churning
  const THROAT_U = [0, -8.8];   // his throat, in his own units
  const CUPH = [[-1.3, -9.2], [1.3, -9.2]], SIPH = [[-.9, -10.6], [.9, -10.6]];
  function neelO(t, o) {
    const pk = t < SKY_CLEAR[0] ? 1 : 1 - ease(seg(t, SKY_CLEAR[0], SKY_CLEAR[1]));
    if (t < F0) {
      o.tint = SN.poisLt; o.tintK = .22 * pk; o.snakeLook = -1;
      o.snakeUp = .22; o.snakeEyes = 'open';
      const up = ease(seg(t, HANDS_UP[0], HANDS_UP[1])), sip = ease(seg(t, SIP[0], SIP[0] + .2)), down = ease(seg(t, SIP[1] + .35, SIP[1] + .85));
      if (t >= HANDS_UP[0] && down < 1) {
        const h = mixP(mixP([-5.6, -3.55], CUPH[0], up), SIPH[0], sip), h2 = mixP(mixP([5.6, -3.55], CUPH[1], up), SIPH[1], sip);
        o.handL = mixP(h, [-5.6, -3.55], down); o.handR = mixP(h2, [5.6, -3.55], down); o.bendL = o.bendR = 1.6 - .6 * sip;
      }
      if (t >= HANDS_UP[0]) { o.mouth = t < SIP[0] ? 'smile' : t < GULP ? 'O' : t < GULP + .4 ? 'flat' : 'smile'; }
      o.sq = (o.sq || 0) + .06 * spring(t, GULP, 7, 26) + .03 * spring(t, SIP[0], 8, 24);
      if (t >= GULP) { o.snakeUp = .22 + .3 * bump(t, GULP + .1, .1, .5); }
      if (t >= TOUCH) { o.snakeEyes = 'closed'; o.snakeUp = lerp(.3, .12, ease(seg(t, TOUCH, TOUCH + .6))); }
      if (t >= STAYED_CAP) o.snakeLook = -1;
      if (t >= E0) {   // Vasuki lifts his head, tired; Shiva strokes him; he nuzzles
        const up2 = ease(seg(t, VAS_UP[0], VAS_UP[0] + 1.0)), droop = .1 * ease(seg(t, VAS_UP[0] + 1.0, VAS_UP[0] + 1.7));
        o.snakeEyes = t >= NUZZLE ? 'happy' : 'closed'; o.snakeUp = lerp(.12, .58, up2) - droop - .04 * seg(t, NUZZLE, NUZZLE + .3); o.snakeTongue = bump(t, VAS_UP[1] + .2, .05, .25) * .6;
        const st = ease(seg(t, STROKE[0] - .25, STROKE[0])) * (1 - ease(seg(t, STROKE[1] + .35, STROKE[1] + .7)));
        if (st > 0) { const hd = snakeHeadAt(o), w = Math.sin((t - STROKE[0]) * 14) * .45 * seg(t, STROKE[0], STROKE[0] + .1) * (1 - seg(t, STROKE[1], STROKE[1] + .2)); o.handL = mixP([-5.6, -3.55], [hd[0] - .3 + w, hd[1] + 1.4 + w * .3], st); o.bendL = 1.2; }
      }
      return o;
    }
    if (t < G0) return meaningO(t, o);
    return dawnO(t, o);
  }
  function meaningO(t, o) {
    o.snakeLook = 0; o.snakeUp = .5; o.snakeEyes = 'happy';
    if (t >= FEAR && t < DEATH) { o.snakeUp = lerp(.5, 1, easeOut(seg(t, FEAR, FEAR + .15))); o.snakeEyes = 'angry'; o.snakeTongue = bump(t, FEAR + .2, .05, .4); o.sq = .04 * spring(t, FEAR, 8, 30); }
    if (t >= DEATH && t < TIME) { o.snakeUp = .85; o.snakeEyes = 'open'; o.snakeTongue = bump(t, DEATH + .2, .05, .4); o.sq = .04 * spring(t, DEATH, 8, 30); }
    if (t >= TIME && t < THESIS1) { o.snakeUp = .55; o.snakeEyes = 'closed'; o.sq = .04 * spring(t, TIME, 8, 30); }
    if (t >= THESIS1 && t < THESIS2) { o.snakeUp = lerp(.55, .95, ease(seg(t, THESIS1, THESIS1 + .2))); o.snakeEyes = 'angry'; o.snakeTongue = bump(t, THESIS1 + .35, .05, .3); }
    if (t >= THESIS2) { o.snakeUp = lerp(.95, .45, ease(seg(t, THESIS2, THESIS2 + .5))); o.snakeEyes = 'happy'; o.sq = (o.sq || 0) + .05 * spring(t, THESIS2, 6, 22); }
    if (t >= PEEK) {   // one eye opens on us, a brow goes up, a smirk; Vasuki peeks too
      const k = seg(t, PEEK, PEEK + .15);
      if (k > .5) { o.eyes = ['closed', 'normal']; o.lookX = -.15; o.lookY = .1; o.brow = .35; o.mouth = 'smirk'; o.snakeEyes = 'open'; o.snakeLook = .3; }
      o.sq = (o.sq || 0) + .04 * spring(t, PEEK + .08, 7, 24);
    }
    return o;
  }
  function dawnO(t, o) {
    o.snakeLook = 0; o.snakeUp = .3; o.snakeEyes = t >= SHIVA_HAND ? 'happy' : 'open';
    if (t >= SHIVA_HAND) {   // his right hand (screen right) rises toward her: abhaya, "do not fear"
      const k = ease(seg(t, SHIVA_HAND, SHIVA_HAND + .35)); o.handR = mixP([5.6, -3.55], [6.4, -12.6], k); o.bendR = 1.5;
      o.eyes = k > .5 ? 'normal' : 'closed'; o.lookX = .7; o.mouth = 'smile'; o.hx = .25 * k;
      o.sq = (o.sq || 0) + .03 * spring(t, SHIVA_HAND + .1, 6, 22);
    }
    return o;
  }

  // ---------------- Parvati ----------------
  const PVN = { u: 26, y: 1730, xIn: 1150, xAt: 690 };   // D: she walks in from the right to stand by him
  function parvatiO(t) {
    if (t >= G0) {   // G: the two-shot, she is afraid of her own power: wide eyes, worried brows, a wobbly mouth, hands clasped, a tremble
      const o = { ...PRV_SKIN, x: 790, y: 1560, u: 30, flip: true, hx: .3, seed: 2, boilKey: 'parvati', eyes: 'scared', mouth: 'wobble', lookX: -.4, lookY: .15, blush: 0, tint: '#F6E6D2', tintK: .2, worry: 1 };
      o.handL = [-.35, -14.1]; o.handR = [.35, -14.1]; o.bendL = o.bendR = 1.5; o.dx = .1 * Math.sin(t * 41) * (t < CALM ? 1 : 0); o.sq = .015 * Math.sin(t * 29) * (t < CALM ? 1 : 0);
      if (t >= SHIVA_HAND) { o.lookX = -.9; o.lookY = .1; o.mouth = 'o'; o.dx = 0; }
      if (t >= CALM) { const k = ease(seg(t, CALM, CALM + .4)); o.worry = 0; o.eyes = 'happy'; o.lookX = lerp(-.9, 0, k); o.mouth = 'smile'; o.blush = .45 * k; o.hx = .1; o.tint = null; o.handL = mixP([-.35, -14.1], [-1.6, -11.3], k); o.handR = mixP([.35, -14.1], [1.6, -11.3], k); o.sq = .03 * spring(t, CALM, 6, 22); }
      if (t >= BELL) { o.eyes = 'closed'; o.mouth = 'smile'; o.sq = .04 * spring(t, BELL, 6, 22); }
      return o;
    }
    if (t < PARVATI_IN[0] - .1 || t >= 26.8) return null;
    const k = ease(seg(t, PARVATI_IN[0], PARVATI_IN[1])), out = ease(seg(t, 25.4, 26.6));
    const o = { ...PRV_SKIN, x: lerp(PVN.xIn, PVN.xAt, k), y: PVN.y, u: PVN.u, flip: true, hx: .25, lookX: -.4, lookY: .15, eyes: 'scared', mouth: 'o', blush: 0, seed: 2, boilKey: 'parvati', bendL: 1, bendR: 1, worry: 1 };
    const moving = k > 0 && k < 1;
    o.walk = k * 3.2; o.dy = moving ? -Math.abs(Math.sin(k * 3.2 * Math.PI)) * .35 : 0; o.lean = 0;
    o.tint = '#F6E6D2'; o.tintK = .15;
    const touch = ease(seg(t, TOUCH - .35, TOUCH)) * (1 - ease(seg(t, 23.4, 24.1)));
    if (touch > 0) {   // her hand (screen left, toward him) lands on his throat
      const lean = 1.6 * touch; o.lean = lean;
      const tx = SHN.x + THROAT_U[0] * SHN.u + 6, ty = SHN.y + THROAT_U[1] * SHN.u;
      const hx = (o.x - tx) / o.u - lean * .6, hy = (ty - o.y) / o.u;
      o.handR = mixP([3.3, -11.2], [hx, hy], touch); o.bendR = 1.1;
    }
    if (t >= TOUCH + .5) {   // the throat holds: gentle relief
      o.worry = 0; o.eyes = 'happy'; o.mouth = 'smile'; o.lookX = -.2; o.blush = .3; o.tint = null; o.sq = .03 * spring(t, TOUCH + .5, 6, 22);
    }
    if (out > 0) {   // she steps back and drifts out to the right, still smiling
      o.x = lerp(PVN.xAt, 1180, out); o.flip = out < .02; o.walk = 3.2 + out * 3; o.dy = -Math.abs(Math.sin(out * 3 * Math.PI)) * .3; o.hx = 0; o.handR = undefined; o.lean = 0; o.eyes = 'happy';
    }
    return o;
  }
  // her brows, redrawn with the inner ends raised: worried, not stern (she only has her own arched brows)
  function prvBrows(o) {
    const u = o.u, fx = o.flip ? -1 : 1, sq = (o.sq || 0) + (o.take || 0), hx = clamp(o.hx || 0, -1, 1), lean = o.lean || 0, sw = clamp(u / 20, .4, 2);
    const skin = o.tint ? mixCol(PRV.skin, o.tint.startsWith('#') ? o.tint : '#F6E6D2', .55 * (o.tintK ?? 1)) : PRV.skin;
    push(); translate(o.x + (o.dx || 0) * u, o.y + (o.dy || 0) * u); scale(fx * (1 + sq * .6), 1 - sq);
    translate(0, -11.8 * u); rotate(lean * .035); translate(lean * .6 * u, 11.8 * u);
    translate(hx * .45 * u, 0); translate(0, -17.6 * u); scale(1.18); translate(0, 17.6 * u); translate(hx * .8 * u, 0);
    boilSeed('prvbrows');
    for (const sd of [-1, 1]) {
      paint(ellPts(sd * 1.15 * u, -20.85 * u, .78 * u, .4 * u, 12), { wash: skin, ink: null });
      inkLine([[sd * 1.8 * u, -20.5 * u], [sd * 1.2 * u, -20.95 * u], [sd * .55 * u, -21.3 * u]], sw * 1.1, PRV.hair, 'ink', .5);
    }
    pop();
  }

  // ---------------- Neelkanth and Vasuki's place (D, E) ----------------
  const SHN = { x: 440, y: 1700, u: 40 };
  const CAMN = [[D0, [440, 960, 1]], [E0, [440, 960, 1]], [F0, [440, 1025, 1.6]]];
  function snowD() {
    boilSeed('snowd');
    const top = []; for (let x = -200; x <= W + 300; x += 70) top.push([x, 1640 + 8 * Math.sin(x * .009) + 5 * Math.sin(x * .023)]);
    paint([...top, [W + 300, H + 400], [-200, H + 400]], { wash: TK.snow, ink: null });
    inkLine(top.filter(p => p[0] > -80 && p[0] < W + 100), 1.2, TK.rock, 'ink', .3);
  }
  // the glowing pool of poison held in his cupped palms; it drains as he drinks
  function pool(t, so) {
    const k = ease(seg(t, POUR[0] + .25, POUR[1] - .1)) * (1 - ease(seg(t, SIP[0] + .05, SIP[1] + .1)));
    if (k <= .02) return;
    const a = shivaHand(SHN.x, SHN.y, SHN.u, so, -1), b = shivaHand(SHN.x, SHN.y, SHN.u, so, 1), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - .55 * SHN.u, u = SHN.u;
    glow(mx, my, 140 * k, SN.poisG, .9 * k);
    boilSeed('pool');
    paint(ellPts(mx, my + .08 * u, 1.7 * u * k, .62 * u * k, 18), { wash: SN.pois, ink: SHV.ink, sw: .6 });
    paint(ellPts(mx, my - .02 * u, 1.45 * u * k, .45 * u * k, 18), { wash: SN.poisG, ink: null });
    paint(ellPts(mx - .3 * u * k, my - .1 * u, .6 * u * k, .16 * u * k, 10), { wash: SN.poisLt, washOp: 220, ink: null });
  }
  function shotNeel(t, lt) {
    const [cx, cy, z] = kf(t, CAMN, ease);
    const pk = t < SKY_CLEAR[0] ? 1 : 1 - ease(seg(t, SKY_CLEAR[0], SKY_CLEAR[1])), clr = ease(seg(t, SKY_CLEAR[0], SKY_CLEAR[1]));
    camBegin(cx, cy, z);
    tkSky({}); stars(1 - pk * .6, t); kailash({}); snowD();
    if (pk > 0) {   // the poison sky; as it clears the clouds thin, drift outward and up, and fade
      boilSeed('poisonsky'); paint(rectPts(-300, -300, W + 600, H + 700), { wash: '#2A2238', washOp: 240 * pk, ink: null }); paint(ellPts(560, 1850, 1000, 620, 24), { wash: '#33402E', washOp: 225 * pk, ink: null }); glow(440, 1450, 760, SN.poisG, .3 * pk);
      poisonCloud(40 - 160 * clr, 1500 - 520 * clr, 1150 * (1 - .25 * clr), t, 1, 'pcl', 1 - clr);
      poisonCloud(1040 + 160 * clr, 1500 - 520 * clr, 1100 * (1 - .25 * clr), t + 1, 1, 'pcr', 1 - clr);
      poisonCloud(560, 700 - 380 * clr, 900 * (1 - .3 * clr), t + 2, .7, 'pcm', (1 - clr) * (1 - clr));
    }
    const so = shivaO(t), pv = parvatiO(t), u = SHN.u, throat = [SHN.x + THROAT_U[0] * u, SHN.y + THROAT_U[1] * u];
    const pouring = t >= POUR[0] && t < POUR[1] + .3;
    if (pouring) {   // body, then the corkscrew in front of it, then his arms and cupped hands over it
      shiva(SHN.x, SHN.y, u, { ...so, boilKey: 'shiva', only: 'body' });
      const k = ease(seg(t, POUR[0], POUR[0] + .55)), wk = 1 - seg(t, POUR[1] - .2, POUR[1] + .3);
      poisonFunnel([1010, 520], [SHN.x + 30, SHN.y - 9.6 * u], 78 * wk, t, k);
      shiva(SHN.x, SHN.y, u, { ...so, boilKey: 'shiva', only: 'arms' });
    } else shiva(SHN.x, SHN.y, u, { ...so, boilKey: 'shiva' });
    pool(t, so);
    // GULP: the cheeks puff, then a bump runs down his throat
    if (t >= GULP - .32 && t < GULP + .5) {
      const m = shivaFace(SHN.x, SHN.y, u, so, 'mouth'), puff = ease(seg(t, GULP - .32, GULP - .05)) * (1 - ease(seg(t, GULP - .02, GULP + .1)));
      if (puff > .02) { boilSeed('cheeks'); for (const sd of [-1, 1]) { const cx_ = m[0] + sd * 2.65 * u, cy_ = m[1] - .5 * u; paint(ellPts(cx_, cy_, (.55 + .5 * puff) * u, (.6 + .35 * puff) * u, 14), { wash: SHV.skin, ink: null }); inkLine(ellPts(cx_, cy_, (.55 + .5 * puff) * u, (.6 + .35 * puff) * u, 14).filter(p => (p[0] - cx_) * sd > -4), 1.4, SHV.ink, 'ink', .5); } }
      const bk = seg(t, GULP, GULP + .4);
      if (bk > 0 && bk < 1) { boilSeed('bump'); const by = lerp(m[1] + .3 * u, throat[1], easeIn(bk) * .6 + bk * .4); glow(m[0], by, 60, SN.poisG, 1 - bk); paint(ellPts(m[0], by, .5 * u * (1 - .3 * bk), .42 * u, 12), { wash: SHV.skinLt, ink: SHV.ink, sw: .8 }); }
    }
    if (pv) { parvati(pv.x, pv.y, pv.u, pv); if (pv.worry) prvBrows(pv); }
    // SINK: a thin violet thread from his mouth that drops to his throat and stops there
    if (t >= SINK[0] && t < BLUE[1] + .6) {
      const m = shivaFace(SHN.x, SHN.y, u, so, 'mouth'), k = ease(seg(t, SINK[0], SINK[1])), fade = 1 - seg(t, BLUE[0], BLUE[0] + .5);
      if (fade > 0) { boilSeed('thread'); paint(ribbon([[m[0], m[1] + 6], [m[0] + 4, lerp(m[1], throat[1], k * .5)], [throat[0] + 2, lerp(m[1], throat[1], k)]], 9, 5), { wash: SN.pois, washOp: 255 * fade, ink: null }); paint(ellPts(throat[0] + 2, lerp(m[1], throat[1], k), 8 * fade, 8 * fade, 8), { wash: SN.poisG, ink: null }); }
    }
    // BLUE: Neelkanth. A deep-blue patch on the neck under the chin, with a glow that pulses slowly
    const bl = ease(seg(t, BLUE[0], BLUE[1])) * (1 - .15 * seg(t, 25, 27)), pu = 1 + .15 * Math.sin(t * 2.4);
    if (bl > 0) {
      boilSeed('neckpatch'); paint(ellPts(throat[0] + 2, throat[1] + 4, 58, 21, 18), { wash: '#2C3FA8', washOp: 215 * bl, ink: null });
      glow(throat[0], throat[1] + 4, 200 * bl * pu, SN.neel, 1); glow(throat[0], throat[1] + 4, 90 * bl * pu, SN.neelLt, .9);
    }
    // a heart from Vasuki's nuzzle
    if (t >= NUZZLE && t < NUZZLE + 1.2) { const hd = snakeHeadAt(so), k = seg(t, NUZZLE, NUZZLE + 1.2); boilSeed('heart'); paint(heartPts(SHN.x + hd[0] * u + 60 + 18 * Math.sin(k * 6), SHN.y + hd[1] * u - 90 - 200 * k, 40 + 20 * backOut(seg(k, 0, .3))), { wash: '#F2678A', washOp: 255 * (1 - seg(k, .6, 1)), ink: SHV.ink, sw: 1.2 }); }
    camEnd();
    snowfall(t, 10, .5 * (1 - pk));
    caption('Shiva drank it.', 520, t - DRANK_CAP, { life: 1.85, size: 100 });
    caption('Parvati held his throat,\nso it went no further.', 540, t - HELD_CAP, { life: 2.45, size: 62 });
    caption('It stayed there…', 520, t - STAYED_CAP, { life: 1.3, size: 80 });
    caption('NEELKANTH', 520, t - NEEL_CAP, { life: 1.6, size: 112, color: GOLDC });
    caption('the blue-throated one', 640, t - NEEL_SUB, { life: 1.3, size: 50 });
    caption('And Vasuki, worn out\nfrom the churning?', 530, t - VAS_CAP, { life: 1.6, size: 66 });
    caption('Shiva gave him the place of honour:\nright where the poison stopped.', 540, t - HONOUR_CAP, { life: 1.8, size: 54 });
    flushLetters();
    cloudWall(t, 1 - ease(seg(t, CLEAR[0], CLEAR[1])));
  }

  // ---------------- Mooshak ----------------
  function mooshakO(t) {
    if (t < MOUSE_IN[0] - .1 || t > FLEE[1] + .3) return null;
    const o = { y: MOU.y, u: MOU.u, eyes: 'normal', flip: true };
    const k = ease(seg(t, MOUSE_IN[0], MOUSE_IN[1]));
    o.x = lerp(-70, 150, k);
    if (t < MOUSE_IN[1]) { const hop = Math.abs(Math.sin(t * 22)); o.dy = -.55 * hop * (k < 1 ? 1 : 0); o.sq = .06 * hop; o.rot = .06 * Math.sin(t * 22); o.tail = t * 3; o.lookX = .5; }
    else o.tail = t * 1.5;
    if (t >= MOUSE_IN[1] && t < SPOT) { o.sq = .05 * spring(t, MOUSE_IN[1], 7, 24); o.lookX = .2; }
    if (t >= SPOT) { o.lookX = 1; o.lookY = -.8; o.eyes = 'wide'; }
    if (t >= TAKE) {   // the take: a big hop (about 2u up) with a stretch, a squash and a crouch on landing
      const k = seg(t, TAKE, TAKE + .32), land = t - (TAKE + .32);
      o.eyes = 'scared'; o.mouth = 'O';
      o.dy = -2.3 * 4 * k * (1 - k); o.sq = k < 1 ? -.3 * Math.sin(Math.min(1, k * 1.6) * Math.PI * .5) * (1 - k * .4) : .32 * Math.exp(-4 * land) * Math.cos(10 * land) + .1 * seg(t, TAKE + .32, FLEE[0]);
      o.lookX = 1; o.lookY = -.8;
    }
    if (t >= FLEE[0] - .15) {   // an anticipation lean back (away from the snake), then a smear off to the left
      const f = seg(t, FLEE[0], FLEE[1]), pre = seg(t, FLEE[0] - .15, FLEE[0]);
      o.flip = false; o.x = lerp(150, -150, easeIn(f)); o.dx = .35 * pre * (1 - f);
      o.dy = t < FLEE[0] ? o.dy : -.5 * Math.abs(Math.sin(t * 24)) * (f > 0 ? 1 : 0); o.sq = t < FLEE[0] ? .2 * pre : -.1 * (1 - f) + .05 * Math.sin(t * 24) * f; o.rot = .34 * pre * (1 - f) - .12 * f; o.tail = t * 4; o.mouth = 'O'; o.eyes = 'scared'; o.lookX = -1; o.lookY = 0;
    }
    return o;
  }

  // ---------------- the hook cobra (A1 and H) ----------------
  const HK = { x: 520, y: 982, s: 320 };       // the head's centre and unit: the hood is 640 wide, centred near (520, 1120)
  function hookO(t) {
    const o = { x: HK.x + 14 * Math.sin(t * 2.3), y: HK.y + 8 * Math.sin(t * 1.9 + 1), s: HK.s, hood: .1 + .06 * Math.sin(t * 3), eyes: 'open', tilt: .035 * Math.sin(t * 1.7 + 1), bsway: .1 * Math.sin(t * 1.3), look: 0, key: 'hook' };
    o.tongue = Math.max(bump(t, TONGUE[0], .05, .3), bump(t, TONGUE[1], .05, .3)) * .85;
    if (t >= FLARE) {   // anticipation: the hood flares, the head pulls back and squashes, the eyes go angry
      const k = ease(seg(t, FLARE, STRIKE));
      o.hood = lerp(o.hood, 1, k); o.y += 70 * k; o.s *= 1 - .08 * k; o.sq = .12 * k; o.tilt = -.05 * k; o.x += 6 * Math.sin(t * 60) * k;
      if (t > FLARE + .06) o.eyes = 'angry';
    }
    if (t >= STRIKE) {   // the strike: the head scales ~3× at the camera, mouth open with fangs
      const k = easeIn(seg(t, STRIKE, GULLET)), m = ease(seg(t, STRIKE, STRIKE + .12));
      o.s = lerp(HK.s * .92, HK.s * 3, k); o.x = lerp(o.x, 540, k); o.y = lerp(HK.y + 70, 1020, k); o.mouth = m; o.tongue = 0; o.sq = -.1 * k; o.tilt = 0; o.hood = 1; o.eyes = 'angry';
    }
    return o;
  }
  function hookH(t) {   // H: the same framing as A1, rhymed: rise, feint, blep, wink, ring
    const o = { x: HK.x + 14 * Math.sin(t * 2.3), y: HK.y + 8 * Math.sin(t * 1.9 + 1), s: HK.s * .94, hood: .35, eyes: 'angry', tilt: .035 * Math.sin(t * 1.7 + 1), bsway: .1 * Math.sin(t * 1.3), look: 0, key: 'hook', tongue: 0 };
    const rise = easeOut(seg(t, RISE[0], RISE[1] + .05));
    o.y += (1 - rise) * 800;
    o.sq = -.08 * (1 - rise) * (rise > 0 ? 1 : 0);
    if (t >= FEINT[0]) {   // lunge at the camera and stop short
      const f = ease(seg(t, FEINT[0], FEINT[0] + .14)), back = ease(seg(t, FEINT[0] + .17, FEINT[1] + .08));
      const k = f * (1 - back * .75);
      o.s = lerp(HK.s * .94, HK.s * 1.9, k); o.y = lerp(o.y, 1010, k * .8); o.x = lerp(o.x, 540, k); o.mouth = k > .15 ? ease(seg(k, .15, .55)) : 0; o.hood = lerp(.35, 1, k); o.sq = -.08 * k;
      if (t > FEINT[1] + .02) { o.mouth = 0; o.hood = lerp(1, .3, ease(seg(t, FEINT[1], BLEP))); }
    }
    if (t >= BLEP) { o.eyes = 'happy'; o.tongue = .55 * ease(seg(t, BLEP, BLEP + .08)) * (t < WINK ? 1 : (1 - ease(seg(t, WINK, WINK + .15)) * .3)); o.sq = .05 * spring(t, BLEP, 7, 26); o.tilt += .08; }
    if (t >= WINK) { o.eyes = 'wink'; o.sq = .05 * spring(t, WINK, 7, 26); o.tilt = .1; }
    return o;
  }
  function hookBg(t, hx, hy) {
    boilSeed('hookbg');
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: SN.hook, ink: null });
    glow(hx, hy + 120, 760, '#3A4590', .55 + .05 * Math.sin(t * 1.4));
  }
  function shotHook(t) {
    const isH = t >= H0, o = isH ? hookH(t) : hookO(t);
    const k = isH ? 0 : seg(t, STRIKE, GULLET), sh = shakeXY(t, 16 * k * k + (isH && t > FEINT[0] && t < FEINT[1] + .15 ? 6 : 0) + (!isH && t > FLARE ? 3 * seg(t, FLARE, STRIKE) : 0));
    const ring = isH ? seg(t, RING[0], RING[1]) : 0;
    camBegin(W / 2 + sh[0], H / 2 + sh[1], 1);
    hookBg(t, o.x, o.y);
    if (!isH && t > FLARE) glow(o.x, o.y + 120, 520 * seg(t, FLARE, STRIKE), SN.red, .35 * seg(t, FLARE, STRIKE));
    else glow(o.x, o.y + 80, 460, SHV.snakeLt, .07);
    if (ring > 0) {   // his body loops into the ring (the head swims to the ring's head) and the ring carries it all off-frame
      const rr = lerp(340, 1500, easeIn(ring)); ringIris(540, 1060, rr, t);
      if (ring < .42) { const k = ease(ring / .42), hp = ringHead(540, 1060, rr, t); vasukiCU(lerp(o.x, hp[0], k), lerp(o.y, hp[1], k), lerp(o.s, 24, k), { ...o, body: ring < .1 }); }
    } else vasukiCU(o.x, o.y, o.s, o);
    // the strike: speed lines, then the dark gullet swallowing the frame
    if (!isH && t >= STRIKE) {
      boilSeed('speed');
      for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + .2 * hash(i), r0 = 380 + 300 * hash(i * 3.1), r1 = r0 + 320 * k + 160; inkLine([[540 + Math.cos(a) * r0, 1000 + Math.sin(a) * r0 * 1.2], [540 + Math.cos(a) * r1, 1000 + Math.sin(a) * r1 * 1.2]], 2.4, TK.cream, 'ink', 0); }
      const g = easeIn(seg(t, GULLET - .12, GULLET + .02));
      if (g > 0) { boilSeed('gullet'); paint(ellPts(540, 1100, lerp(80, 1700, g), lerp(110, 2300, g), 30), { wash: SN.gullet, ink: null }); }
    }
    camEnd();
    // the hook caption is already up on frame 0 (age +1)
    if (!isH) {
      caption('WHY WOULD A GOD WEAR', 478, t + 1, { life: 2.5, size: 64 });
      caption('A DEADLY SNAKE?', 585, t + 1, { life: 2.5, size: 104, color: VENOM });
    }
    if (isH && t < H0 + .12) flash(1 - seg(t, H0, H0 + .12), '#FFFDF6');
  }

  // ---------------- the wide set (A2 and B) ----------------
  const CAMW = [[A2, [350, 1000, 2.0]], [PULL[0], [350, 1000, 2.0]], [PULL[1], [440, 1090, 1.3]], [PUSH_B[0], [440, 1090, 1.3]], [PUSH_B[1], [440, 1060, 1.45]], [WHIP[0], [440, 1055, 1.45]], [C0, [440, -420, 1.3]]];
  function stage(t, camera) {
    tkSky({}); stars(1, t); kailash({}); tkGround({});
  }
  function shotWide(t) {
    let [cx, cy, z] = kf(t, CAMW, (x) => t > WHIP[0] ? easeIn(x) : ease(x));
    camBegin(cx, cy, z * (1 + .004 * Math.sin(t * .3)));
    if (cy < 980) { boilSeed('highsky'); paint(rectPts(-200, -3200, W + 400, 3300), { wash: TK.night, ink: null }); stars(1, t, 22); }
    tkSky({}); stars(1, t); kailash({}); tkGround({});
    const sh = shivaO(t), mo = mooshakO(t);
    shiva(SH.x, SH.y, SH.u, { ...sh, boilKey: 'shiva' });
    if (mo) mooshak(mo.x, mo.y, mo.u, { ...mo, boilKey: 'mooshak' });
    // Mooshak's reaction: a big "!!", a sweat drop, and the dust he leaves
    if (mo) {
      const ek = seg(t, TAKE, TAKE + .25) * (1 - seg(t, FLEE[0] + .25, FLEE[0] + .45));
      if (ek > 0) { boilSeed('mouseemote'); emote('!!', mo.x + 50, mo.y - 210 + (mo.dy || 0) * mo.u, 30, ek, t - TAKE); }
      if (t > TAKE + .05 && t < FLEE[1]) { boilSeed('mousesweat'); sweatFly(mo.x + 34, mo.y - 170 + (mo.dy || 0) * mo.u, 22, t - TAKE - .05, -1); }
    }
    if (mo && t >= TAKE && t < TAKE + .5) {   // fur standing on end
      boilSeed('furup'); const hx = mo.x, hy = mo.y + (mo.dy || 0) * mo.u - 6.2 * mo.u, f = 1 - seg(t, TAKE + .25, TAKE + .5);
      for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .3, r0 = 2.0 * mo.u, r1 = r0 + 16 + 8 * hash(i); inkLine([[hx + Math.cos(a) * r0, hy + 8 + Math.sin(a) * r0], [hx + Math.cos(a) * r1 * f, hy + 8 + Math.sin(a) * r1 * f]], 2.2, SHV.ink, 'ink', 0); }
    }
    if (mo && t >= FLEE[0] && t < FLEE[1] + .05) {   // the smear: speed streaks trailing behind him
      boilSeed('smear'); const f = seg(t, FLEE[0], FLEE[1]);
      for (let i = 0; i < 4; i++) { const y = mo.y - 20 - i * 26 + (mo.dy || 0) * mo.u * .3; inkLine([[mo.x + 40, y], [mo.x + 40 + 90 * f + 40 * i, y + 2]], 2, TK.cream, 'ink', 0); }
    }
    dustPuff(160, MOU.y + 6, 50, t - FLEE[0]);
    camEnd();
    snowfall(t, 14, .8);
    // captions
    caption('…around his NECK?', 470, t - NECK_CAP, { life: 1.6, size: 92, color: TK.cream });
    caption("We're wired to fear snakes.", 520, t - WIRED_CAP, { life: 2.0, size: 66 });
    caption('Yet Shiva lets one sleep\non his throat.', 540, t - SLEEP_CAP, { life: 1.8, size: 66 });
    caption('The answer begins with…', 475, t - POISON_CAP, { life: 1.3, size: 62 });
    caption('POISON.', 580, t - POISON_CAP - .3, { life: 1.0, size: 122, color: SN.poisLt });
    flushLetters();
    if (t > WHIP[0]) whipStreaks(seg(t, WHIP[0], WHIP[1] - .1), t);
    if (t < A2 + .1) flash(1 - seg(t, A2, A2 + .1), '#FFFDF6');
  }


  // ---------------- the churning (C) ----------------
  const VIOLET = mixCol(SN.pois, SN.poisG, .3);
  // three devas and three asuras, 1.4× bigger, staggered a little in depth so each silhouette separates
  const DEVAS = [{ x: 350, y: 1382, off: 0 }, { x: 245, y: 1400, off: .09 }, { x: 140, y: 1380, off: .17 }];
  const ASURAS = [{ x: 730, y: 1384, off: .05 }, { x: 835, y: 1400, off: .14 }, { x: 940, y: 1380, off: .02 }], TS = 27;
  const MAN = { x: 540, y: 1300, h: 780 };
  // how hard each side pulls (0..1): they alternate on every beat from 9.4, each figure a little late so they don't twin;
  // stop dead at STILL, flinch when Halahala erupts
  function pullOf(t, side, off) {   // side 0 = devas (left), 1 = asuras (right)
    const run = ease(seg(t, C0, 9.55)) * (1 - ease(seg(t, STILL - .3, STILL - .05))) * (1 - seg(t, RUN - .3, RUN));
    const tt = t - off, p = .5 + .5 * Math.cos(Math.max(0, tt - 9.4) / BEAT * Math.PI), q = side ? 1 - p : p;
    let v = lerp(.2, .12 + .88 * Math.pow(q, 1.3), run);
    if (t >= ERUPT && t < RUN) v = 1.1 * Math.exp(-5 * (t - ERUPT)) + .35;
    if (t >= RUN) v = 0;
    return v;
  }
  const tugX = (list, i, dirOut, t) => { const k = clamp((t - RUN - list[i].off * .5) / (.55 + .05 * i)); return lerp(list[i].x, dirOut > 0 ? 1320 : -240, Math.pow(k, 1.5)); };
  function churnScene(t) {
    const pLm = (pullOf(t, 0, 0) + pullOf(t, 0, .09) + pullOf(t, 0, .17)) / 3, pRm = (pullOf(t, 1, .05) + pullOf(t, 1, .14) + pullOf(t, 1, .02)) / 3;
    const ph = -1.0 * (pLm - pRm) * (t < RUN ? 1 : 0), poison = ease(seg(t, SKY_POISON[0], SKY_POISON[1]));
    milkOcean(t, { poison });
    seaVortex(MAN.x, MAN.y + 4, t, ph);
    churnRope(ph, 'back', null);
    mandara(MAN.x, MAN.y, t, ph * 150, MAN.h);
    const headPos = [1042 + 14 * (pRm - pLm), 1214 + 4 * Math.sin(t * 5) * (pLm + pRm)];
    const drop = t >= RUN ? 60 * ease(seg(t, RUN, RUN + .45)) : 0;
    const L = DEVAS.map(d => { const hp = tuggerHand(d.x, d.y, TS, 'deva', pullOf(t, 0, d.off)); return [hp[0], hp[1] + drop]; });
    const R = ASURAS.map(d => { const hp = tuggerHand(d.x, d.y, TS, 'asura', pullOf(t, 1, d.off)); return [hp[0], hp[1] + drop]; });
    // ERUPT: Halahala boils up out of the water at the vortex, in front of Mandara's foot, rolling up and outward over the mountain
    const col = ease(seg(t, ERUPT, ERUPT + .6));
    if (t >= ERUPT) poisonCloud(MAN.x, 1390, 1150, t, col, 'hala', 1, 1.25);
    // the figures, back row first
    const all = [...DEVAS.map((d, i) => ({ d, i, kind: 'deva' })), ...ASURAS.map((d, i) => ({ d, i, kind: 'asura' }))].sort((a, b) => a.d.y - b.d.y);
    for (const { d, i, kind } of all) {
      const list = kind === 'deva' ? DEVAS : ASURAS, side = kind === 'deva' ? 0 : 1, x = tugX(list, i, side ? 1 : -1, t), runK = t >= RUN ? clamp((t - RUN) / .2) : 0, pull = pullOf(t, side, d.off);
      if (x < -140 || x > W + 140) continue;
      const f = Math.max(runK, t >= ERUPT && t < RUN ? .6 : 0);
      tugger(x, d.y, TS, t, kind, pull * (1 - runK), f, kind + i);
      if (t >= RUN) dustPuff(d.x + (side ? 20 : -20), d.y + 8, 40, t - RUN - d.off * .4);
    }
    // a splash at the heels of whichever side just pulled, on every beat
    if (t >= 9.4 && t < STILL) {
      const n = Math.floor((t - 9.4) / BEAT);
      for (const nn of [n - 1, n]) { if (nn < 0) continue; const side = nn % 2, list = side ? ASURAS : DEVAS;
        list.forEach((d, i) => splash(d.x + (side ? 38 : -38), d.y + 6, 34, t - (9.4 + nn * BEAT + d.off), side ? 1 : -1, nn * 3 + i)); }
    }
    churnRope(ph, 'front', { L, tip: [60, 1262 + drop], R: [...R, [headPos[0] - 12, headPos[1] + 70]] });
    // Vasuki's head at the end of the rope: straining, then squeezing his eyes shut
    const ek = t < RUN ? (t > WINCE - .1 && t < WINCE + .9 ? 'squeeze' : t >= ERUPT ? 'angry' : 'open') : 'squeeze';
    vasukiCU(headPos[0], headPos[1], 68, { body: false, eyes: ek, hood: .3 + .3 * (pLm + pRm) * (t < RUN ? 1 : 0), key: 'rope', tilt: .12 * (pRm - pLm), sweat: t > WINCE - .2 && t < WINCE + .8 ? seg(t, WINCE - .2, WINCE + .5) : 0 });
    if (t >= WINCE && t < WINCE + .8) sweatFly(headPos[0] + 34, headPos[1] - 44, 18, t - WINCE);
    // STILL: in the silence, one big bubble rises at Mandara's foot and an ripple ring spreads
    if (t >= STILL && t < ERUPT + .15) {
      const k = seg(t, STILL, ERUPT), bx = 640 + 5 * Math.sin(k * 10), by = lerp(1415, 1352, easeOut(k)), r = 19 + 8 * ease(k);
      boilSeed('ripple');
      for (let j = 0; j < 2; j++) { const rk = clamp(k * 1.4 - j * .3); if (rk > 0 && rk < 1) inkLine(ellPts(640, 1372, 20 + 110 * rk, (20 + 110 * rk) * .22, 18, 0).concat([[660 + 110 * rk, 1372]]), 1.6, mixCol(SN.milkDk, '#FFFFFF', .2), 'ink', .3); }
      boilSeed('bubble'); paint(ellPts(bx, by, r, r, 14), { wash: SN.foam, washOp: 215, ink: SHV.ink, sw: .9 }); paint(ellPts(bx - r * .35, by - r * .35, r * .28, r * .22, 8), { wash: '#FFFFFF', ink: null });
    }
    const gl = ease(seg(t, EXCEPT_CAP - .1, EXCEPT_CAP + .5));
    if (gl > 0) { glow(540, 330, 520 * gl, SN.neelLt, .9 * gl); glow(540, 330, 220 * gl, SN.neel, .9 * gl); }
    return poison;
  }
  const CAMC = [[C0, [560, 140, 1]], [C0 + .45, [560, 1070, .9]], [PUSH_C[0], [560, 1070, .9]], [PUSH_C[1], [880, 1210, 1.9]], [13.6, [880, 1210, 1.9]], [14.25, [560, 1070, .9]], [INTO_CLOUD[0], [560, 1070, .9]], [INTO_CLOUD[1], [540, 800, 2.4]]];
  function shotChurn(t, lt) {
    const [cx, cy, z] = kf(t, CAMC, t < C0 + .5 ? easeOut : ease);
    const sh = t >= ERUPT && t < ERUPT + .5 ? shakeXY(t, 14 * (1 - seg(t, ERUPT, ERUPT + .5))) : [0, 0];
    camBegin(cx + sh[0], cy + sh[1], z);
    churnScene(t);
    camEnd();
    if (t >= ERUPT && t < ERUPT + .1) flash(.3, '#C9DB8A');
    caption('Long ago, gods and demons\nchurned the ocean of milk…', 520, t - CHURN_CAP, { life: 2.2, size: 58 });
    caption('…using VASUKI, king of serpents,\nas the rope.', 520, t - ROPE_CAP, { life: 2.25, size: 58 });
    caption('Out rose', 470, t - HALA_CAP, { life: 2.1, size: 64 });
    caption('HALAHALA:', 560, t - HALA_CAP - .05, { life: 2.1, size: 100, color: '#B9D96A' });
    caption('poison that could end the world.', 660, t - HALA_CAP - .25, { life: 1.85, size: 56 });
    caption('Everyone ran.', 760, t - RAN_CAP, { life: .6, size: 100 });
    caption('Except one.', 540, t - EXCEPT_CAP, { life: .7, size: 96, color: SN.neelLt });
    flushLetters();
    if (t < C0 + .5) whipStreaks(1 - seg(t, C0, C0 + .45), t);
    cloudWall(t, ease(seg(t, INTO_CLOUD[0] - .05, INTO_CLOUD[1])));
  }


  // ---------------- the meaning (F) ----------------
  const CUF = { x: 540, y: 2040, u: 64 };      // the tight close-up: his face at (540, 1208), the bun top near 664, the lap cropped
  const decay = (t, t0, k = 9) => t < t0 ? 0 : Math.exp(-(t - t0) * k);
  function shotCU(t) {
    const fe = decay(t, FEAR, 9), fs = decay(t, FEAR, 28), de = decay(t, DEATH, 9), ds = decay(t, DEATH, 28), ti = decay(t, TIME, 9);
    const kick = fe + de + ti + .5 * decay(t, THESIS2, 12);
    const sh = shakeXY(t, 14 * kick), push = .03 * (t - F0) / (G0 - F0);
    const ringK = ease(seg(t, TIME, TIME + .55)), gold = t >= TIME ? Math.max(.25 * ringK, ease(seg(t, THESIS2, THESIS2 + .3)) * .7) : 0;
    camBegin(540 + sh[0], 1000 + sh[1], 1 + push + .045 * kick);
    cuBackdrop(t, .3 * fs, gold * .6, 540, 1208);
    const o = shivaO(t);
    if (fs > .02) glow(540, 1150, 760, SN.red, .5 * fs);
    if (t >= TIME) kaalRing(540, 1170, 405, t, ringK, ease(seg(t, THESIS2, THESIS2 + .3)) * .8 + .15 * ringK);
    if (t >= DEATH && t < TIME + .6) {   // DEATH: thin dark violet-green smoke curling up from behind him, and a quick green tint
      smokeTendrils(t, ease(seg(t, DEATH, DEATH + .9)) * (1 - ease(seg(t, TIME - .1, TIME + .5))));
      if (ds > .02) { boilSeed('deathtint'); paint(rectPts(-300, -300, W + 600, H + 900), { wash: SN.poisG, washOp: 80 * ds, ink: null }); }
    }
    shiva(CUF.x, CUF.y, CUF.u, { ...o, boilKey: 'shivacu', noShadow: true });
    const nb = 1 - ease(seg(t, F0, F0 + 1.6));   // Neelkanth's blue throat carries over the cut and fades
    if (nb > 0) { glow(CUF.x, CUF.y + THROAT_U[1] * CUF.u + 4, 220 * nb, SN.neel, nb); glow(CUF.x, CUF.y + THROAT_U[1] * CUF.u + 4, 100 * nb, SN.neelLt, .8 * nb); }
    camEnd();
    if (t >= FEAR && t < FEAR + .08) flash(.22, SN.red);
    caption('To us, a snake means…', 470, t - MEANS_CAP, { life: 3.3, size: 54 });
    caption('FEAR.', 575, t - FEAR, { life: .85, size: 120, color: '#FF6A55' });
    caption('DEATH.', 575, t - DEATH, { life: .85, size: 120, color: SN.poisLt });
    caption('TIME.', 575, t - TIME, { life: 1.35, size: 120, color: GOLDC });
    caption("Shiva doesn't run\nfrom what we fear.", 484, t - THESIS1, { life: 1.9, size: 52 });
    caption('He WEARS it.', 630, t - THESIS2, { life: 1.25, size: 110, color: GOLDC });
    caption('What fear would YOU\nlearn to wear?', 540, t - COMMENT, { life: 1.7, size: 78, color: GOLDC });
    caption('Tell us in the comments!', 650, t - COMMENT_SUB, { life: 1.3, size: 50 });
    flushLetters();
    if (t >= WIPE_OUT) brushWipe((t - WIPE_OUT) / .6, [GOLDC, TK.peach]);
  }

  // ---------------- Chandraghanta (G) ----------------
  const SHG = { x: 330, y: 1560, u: 30 }, PRG = { x: 790, y: 1560, u: 30 };
  // Parvati's aura: a pulsing gold glow round her and short radiating brush strokes (never over Shiva).
  // wild 1 = it flickers in radius and intensity (FLICKER), 0 = steady (CALM).
  function aura(x, y, t, k, wild) {
    if (k <= .02) return;
    const fl = 1 + wild * (.22 * Math.sin(t * 27) + .12 * Math.sin(t * 43 + 1)), gi = k * (.75 + wild * .25 * Math.sin(t * 21 + 2));
    glow(x, y, 520 * fl, '#FFC25A', gi); glow(x, y, 250 * fl, TK.goldLt, gi * .8);
    boilSeed('aura');
    const f = Math.floor(t * (wild > .5 ? 12 : 4));
    for (let i = 0; i < 18; i++) {
      const a = i / 18 * TAU + .1 * hash(i * 3.7); if (Math.cos(a) < -.5) continue;   // away from Shiva
      const e = (.85 + .3 * hash(i * 1.7 + f * (wild > .5 ? .7 : 0))) * (1 + wild * .25 * Math.sin(t * 25 + i)), r0 = 1, len = (36 + 48 * hash(i * 5.3 + f * .3 * wild)) * e;
      const bx = x + Math.cos(a) * 215 * r0, by = y + Math.sin(a) * 470 * r0, nx = Math.cos(a) * 1, ny = Math.sin(a) * .9;
      paint(ribbon([[bx, by], [bx + nx * len * .5, by + ny * len * .5 + 2 * Math.sin(t * 9 + i)], [bx + nx * len, by + ny * len]], 9, 2), { wash: '#F2A93B', washOp: 235 * k, ink: null });
      paint(ribbon([[bx, by], [bx + nx * len * .8, by + ny * len * .8]], 3.5, 1), { wash: TK.cream, washOp: 230 * k, ink: null });
    }
  }
  function shotDawn(t, lt) {
    camBegin(540, 960, 1 + .015 * lt);
    dawnSet(t);
    const wild = t < CALM ? 1 : 1 - ease(seg(t, CALM, CALM + .5));
    const so = shivaO(t), pv = parvatiO(t), hc = parvatiHeadAt(pv);
    aura(PRG.x, PRG.y - 12.5 * PRG.u, t, ease(seg(t, FLICKER[0] - .1, FLICKER[0] + .3)), wild);
    if (t >= BELL) {   // a steady gold halo behind her head
      const hk = ease(seg(t, BELL, BELL + .5)); glow(hc[0], hc[1] + 150, 330 * hk, '#FFC25A', .9 * hk); boilSeed('halo');
      push(); translate(hc[0], PRG.y - 20.1 * PRG.u); paint(ellPts(0, 0, 150 * hk, 150 * hk, 30), { wash: '#FFD66B', washOp: 150 * hk, ink: '#E0A030', sw: 1.2 }); pop();
    }
    shiva(SHG.x, SHG.y, SHG.u, { ...so, boilKey: 'shivag' });
    parvati(PRG.x, PRG.y, PRG.u, { ...pv, boilKey: 'parvatig' });
    if (pv.worry) prvBrows({ ...pv, x: PRG.x, y: PRG.y, u: PRG.u });
    // the crescent bell pops on above her mukut, swings and glows; a gold burst and three sound rings
    if (t >= BELL) { crescentBell(hc[0], hc[1] - 200, 70, seg(t, BELL, BELL + .3), t, .5 * spring(t, BELL, 4, 16)); soundRings(hc[0], hc[1] - 130, t - BELL); }
    camEnd();
    if (t >= BELL && t < BELL + .22) flash(.5 * (1 - seg(t, BELL, BELL + .22)), '#FFE9A0');
    caption('Parvati was once afraid\nof her OWN power.', 520, t - P_AFRAID_CAP, { life: 1.75, size: 62 });
    caption('Shiva taught her\nto wear it…', 520, t - P_TAUGHT_CAP, { life: 1.1, size: 62 });
    caption('…and she became\nCHANDRAGHANTA.', 520, t - CHANDRA_CAP, { life: 1.5, size: 70, color: GOLDC });
    flushLetters();
    if (lt < .3) brushWipe(.5 + lt / .6, [GOLDC, TK.peach]);
    if (t > FLASH_G[0]) flash(ease(seg(t, FLASH_G[0], FLASH_G[1])), '#FFFDF6');
  }
  // where her forehead is on screen (the bell hangs above her crown)
  function parvatiHeadAt(o) { const hx = clamp(o.hx || 0, -1, 1), fx = o.flip ? -1 : 1; return [PRG.x + fx * (hx * .45 + hx * .8) * PRG.u, PRG.y - 22.3 * PRG.u]; }

  // ---------------- the card ----------------
  function shotCard(t) {
    endCard(t, CARD, 'book3', ['book1', 'book2']);
    caption('Her story of courage\nis Book 3!', 512, t - (CARD.book - .05), { life: 1.0, size: 62, color: TK.rkOrange, stroke: TK.cream });
    const k = frac((t - CARD.follow) / 1.6);
    if (t > CARD.follow) { flushLetters(); boilSeed('sparkle'); paint(starPts(lerp(300, 720, k), lerp(1040, 660, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
  }

  shots([[0, shotHook], [A2, shotWide], [C0, shotChurn], [D0, shotNeel], [F0, shotCU], [G0, shotDawn], [H0, shotHook], [CARD0, shotCard]]);
})();
