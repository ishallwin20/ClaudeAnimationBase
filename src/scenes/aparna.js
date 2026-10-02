// "Bappa can't wait 3 seconds for a modak. His mother waited 3,000 years.": a captioned explainer for Rishi Katha's Navadurga
// picture books (Book 2): why Parvati is called Aparna, and how her tapasya made her Maa Brahmacharini.
// 53.6 s, 1080×1920 (a vertical reel). Storyboard: STORYBOARD.md. Sets and props: aparna_props.js.
// Characters: src/bappa.js, src/parvati.js, src/brahmacharini.js, src/shiva.js. Sound: tools/aparna_sfx.mjs (same times).
//
// Every pose is a pure function of film time, so the shots only choose a framing, a camera, captions and their transitions.
// Frame 0 is a finished picture with its caption already up: no fade in. The last frame is the whole card: no fade out.
(() => {
  // ---------------- the times (tools/aparna_sfx.mjs copies them) ----------------
  // A hook (Bappa)
  const A0 = 0, CHOMP1 = .30, CHOMP2 = .70, CHOMP3 = 1.10, GULP = 1.38, HOOK2 = 1.60, TAKE = 1.72, A_OUT = 3.55, B0 = 4.0;
  // B princess and yogi
  const B_CAP1 = 4.15, P_STOP = 5.2, GARLAND = 5.4, WAVE0 = 5.85, WAVE1 = 6.45, FLAKE = 6.55, B_CAP2 = 6.35, P_SAD = 7.1,
    P_DET = 8.0, B_CAP3 = 8.1, TAPASYA = 8.35, WIPE1 = 9.2, C0 = 9.6;
  // C the change
  const C_CAP1 = 9.85, CROWN = 10.0, EARRINGS = 10.5, BANGLES = 11.0, SWIRL0 = 11.5, SWIRL_FULL = 11.9, REVEAL = 12.0,
    C_CAP2 = 12.25, PULLBACK = 13.85, D0 = 14.2;
  // D1 the seasons (each phase: card, then the food vanishes one item at a time on beats)
  const SUMMER = 14.2, YR1 = 14.4, FRUIT_GONE = [16.0, 16.45, 16.9, 17.3],
    RAINS = 17.5, YR2 = 17.6, GREENS_GONE = [19.3, 19.75, 20.2],
    WINTER = 20.5, YR3 = 20.6, BILVA_GONE = [22.6, 23.1],          // three leaves → one left
    D2 = 23.8;                                                       // Bappa insert
  const BAPPA_HUG = 24.05, BAPPA_CAP = 24.1, D3 = 25.2;
  // D3 night
  const NIGHT_CAP1 = 25.4, LEAF_LIFT = 26.2, AURA_BLOOM = 26.6, NIGHT_CAP2 = 27.2, NIGHT_CAP3 = 27.6, LEAF_CAM = 29.0, E0 = 29.4;
  // E the name
  const NAME_CAP1 = 29.6, GUESS = 30.1, APARNA = 31.5, APARNA_SUB = 31.8, F0 = 33.6;
  // F the test
  const STRANGER_IN = 33.65, F_CAP1 = 33.75, STRANGER_STOP = 34.9, P_EYES = 35.0, MOCK = 35.3, TAIL0 = 36.2, TAIL1 = 37.3,
    MOON_GLINT = 36.8, ANGRY = 37.9, TURN_AWAY = 38.6, POOF = 39.4, SHIVA_REVEAL = 39.8, SHIVA_CAP = 39.85,
    P_TURN_BACK = 40.0, P_DELIGHT = 40.7, YOURS = 41.3, PETALS = 41.3, G0 = 43.6;
  // G Bappa rhyme
  const G_CAP1 = 43.9, OFFER = 44.0, MOM_IN = 44.3, TAKE_MODAK = 44.9, BREAK = 45.3, HALF_BACK = 45.6, SHARE_CHOMP = 46.0,
    QUESTION = 45.9, QUESTION_SUB = 46.3, HEART_IRIS = 47.4, CARD = 47.8;
  // Card
  const CARD_CAP = 48.0, COVER = 48.1, FAN = 48.5, LOGO = 49.1, SERIES = 49.4, PRICE = 49.8, PILL = 50.2, FOLLOW = 50.8, END = 53.6;

  // ---------------- the stage ----------------
  const GOLDC = '#F5C542', LEAFC = '#B9C46A';
  const BP = { x: 540, y: 1640, u: 44 };               // Bappa's framing: the hook (A), the insert (D2) and the rhyme (G) share it
  const SHB = { x: 720, y: 1358, u: 26 };              // Shiva on his rock (B)
  const PB = { y: 1450, u: 30 };                       // Parvati's ground (B)
  const bump = (t, t0, a = .1, b = .25) => seg(t, t0 - a, t0) * (1 - seg(t, t0, t0 + b));
  const skinKeys = (keys, c) => keys.map(([k, n, o]) => [k, n, { ...c, ...(o || {}) }]);
  const BSKIN = { col: BAP.skin, dk: BAP.skinDk, lt: BAP.skinLt };
  const bEmo = (t, keys, o) => emotions(t, skinKeys(keys, BSKIN), o);
  const pEmo = (t, keys, o) => emotions(t, skinKeys(keys, PRV_SKIN), o);
  const sEmo = (t, keys, o) => emotions(t, skinKeys(keys, SHV_SKIN), o);
  const rEmo = (t, keys, o) => emotions(t, skinKeys(keys, SHL_SKIN), o);
  const caps = (t, list) => { for (const [txt, y, t0, life, size, color] of list) caption(txt, y, t - t0, { life, size, color }); };

  // ---------------- A: the hook ----------------
  const EAT = [[0, -11.2], [.15, -10.2], [-.1, -9.3], [-.55, -8.75], [-1.15, -8.85], [-1.35, -9.5]];   // the trunk curled to the mouth
  const CHOMPS = [CHOMP1, CHOMP2, CHOMP3];
  const modakSize = t => kf(t, [[0, 100], [CHOMP1 - .02, 100], [CHOMP1 + .12, 65], [CHOMP2 - .02, 65], [CHOMP2 + .12, 30], [CHOMP3 - .02, 30], [CHOMP3 + .12, 0]]);
  const cheekPuff = t => kf(t, [[0, 0], [CHOMP1, 0], [CHOMP1 + .1, .45], [CHOMP2, .45], [CHOMP2 + .1, .7], [CHOMP3, .7], [CHOMP3 + .1, .95], [GULP - .06, .95], [GULP + .04, .5], [GULP + .2, .95], [3.6, .95]]);
  const chompK = t => CHOMPS.reduce((s, c) => s + Math.sin(clamp((t - c) / .22) * Math.PI), 0);
  // Bappa's cheeks, a hook in head space: two round puffs at the corners of his mouth
  const cheeks = p => (u, sw) => {
    if (p < .03) return;
    for (const s of [-1, 1]) {
      const r = (.55 + 1.05 * p) * u, cx = s * 2.95 * u, cy = -9.7 * u, arc = [];
      paint(ellPts(cx, cy, r, r * .9, 18), { wash: BAP.skin, ink: null });
      for (let i = 0; i <= 10; i++) { const a = (s > 0 ? -1.3 : Math.PI - 1.3) + (i / 10) * 2.6 * (s > 0 ? 1 : 1); arc.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * .9]); }
      inkLine(arc, sw, PAL.ink, 'ink', .5);
      paint(ellPts(cx + s * r * .1, cy + r * .1, r * .55, r * .35, 12), { fill: PAL.rose, fillOp: 120 * p, bleed: .2, tex: .4, ink: null });
    }
  };
  // the modak in his trunk: base position, size (the bigger, richer apModak) for time t
  const MK = 1.45;
  const modakA = (t, o) => { const sz = modakSize(t) * MK, tip = bappaTrunkTip(BP.x, BP.y, BP.u, o); return { s: sz, x: tip[0] - 4, y: tip[1] + .72 * sz, rot: -.3 }; };
  // the arm angle that puts a hand nearest a world target (his arms are angle-driven)
  const armFor = (o, s, tx, ty, flex) => {
    let best = 0, bd = 1e9; const k = s < 0 ? 'aL' : 'aR', f = s < 0 ? 'flexL' : 'flexR';
    for (let a = -1.9; a <= 1.6; a += .05) { const h = bappaHand(BP.x, BP.y, BP.u, { ...o, dx: 0, dy: 0, sq: 0, take: 0, [k]: a, [f]: flex }, s); const d = Math.hypot(h[0] - tx, h[1] - ty); if (d < bd) { bd = d; best = a; } }
    return best;
  };
  function bappaA(t) {
    const keys = [[0, 'happy', { eyes: 'happy', mouth: 'grin', emote: null }], [TAKE, 'surprised', { eyes: 'wide', mouth: 'o', emote: null }]];
    const o = bEmo(t, keys, { take: .9 });
    o.emote = null;
    const pre = t < TAKE;
    o.trunk = EAT; o.trunk2 = TRUNKS.curl; o.trunkK = ease(seg(t, 1.2, 1.5));
    o.hx = t < TAKE ? -.12 * Math.sin(t * 9) : 0;
    if (pre) {
      // greedy: one hand up steadying the modak, the other rubbing his belly
      const grip = 1 - ease(seg(t, CHOMP3 + .1, CHOMP3 + .4));
      o.flexL = .7; o.flexR = .5;
      const gx = BP.x - 2.0 * BP.u, gy = BP.y - 8.3 * BP.u, rub = Math.sin(t * 11) * .25 * BP.u;
      o.aL = lerp(-.45, armFor(o, -1, gx, gy, .7), grip);
      o.aR = armFor(o, 1, BP.x + 1.9 * BP.u + rub, BP.y - 5.4 * BP.u + Math.cos(t * 11) * .2 * BP.u, .5);
      o.dy = (o.dy || 0) * .4;
      o.squint = Math.max(o.squint || 0, bump(t, GULP, .06, .22));
    } else {   // frozen mid-chew, hands up, eyes wide
      o.aL = 1.0 + .05 * Math.sin(T * 20); o.aR = .95 + .05 * Math.sin(T * 17); o.dy = -.15 + .05 * Math.sin(t * 2);
      o.sq = (o.sq || 0) * .9;
    }
    o.sq = (o.sq || 0) + .09 * chompK(t) + .07 * bump(t, GULP, .05, .2);
    o.ear = .3 * chompK(t) + (t >= TAKE ? .5 * ease(seg(t, TAKE, TAKE + .15)) : 0);
    o.mouth = t < TAKE ? 'grin' : t < 2.9 ? 'o' : 'O';
    o.lookX = t < TAKE ? 0 : kf(t, [[TAKE, -.9], [2.5, -.9], [3.2, 0]]); o.lookY = t < TAKE ? .2 : kf(t, [[TAKE, -.3], [2.5, -.3], [3.2, 0]]);
    // the emotes: a big !! at the take, a sweat drop at the end
    if (t >= TAKE && t < 2.6) { o.emote = '!!'; o.emoteK = seg(t, TAKE, TAKE + .2) * (1 - seg(t, 2.3, 2.6)); o.emoteAge = t - TAKE; }
    else if (t >= 2.9) { o.emote = 'sweat'; o.emoteK = seg(t, 2.95, 3.2); o.emoteAge = t - 2.95; }
    o.head = cheeks(cheekPuff(t));
    o.blush = t < TAKE ? .5 : .15;
    return o;
  }
  function crumbs(t, t0, x0, y0, n, key) {
    const a = t - t0; if (a < 0 || a > .7) return;
    boilSeed(key);
    for (let i = 0; i < n; i++) {
      const vx = (hash(i * 3.1 + t0) - .5) * 520, vy = -(160 + 340 * hash(i * 5.7 + t0)), r = 4 + 5 * hash(i * 1.9);
      paint(ellPts(x0 + vx * a, y0 + vy * a + 1300 * a * a * .5, r, r * .8, 8, 0), { wash: '#F5DDB0', washOp: 255 * (1 - seg(a, .45, .7)), ink: AP.dryDk, sw: .5 });
    }
  }
  // the hook's ground: plain warm peach with a lighter spot behind Bappa (the same in A, D2 and G)
  function bappaGround(t, key = 'bg') {
    boilSeed(key);
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: AP.peach, ink: null });
    paint(ellPts(540, 1130, 560, 640, 30), { fill: AP.peachLt, fillOp: 200, bleed: .3, tex: .3, border: .2, ink: null });
    paint(ellPts(540, 1700, 700, 150, 24), { fill: AP.peachDk, fillOp: 90, bleed: .3, tex: .3, border: .2, ink: null });
  }
  // the thought cloud that swells from just above his head and fills the frame (the way into B): clear by 3.6, whole frame by 4.0
  function thoughtCloud(t) {
    if (t < 3.2) return;
    const born = easeOut(seg(t, 3.3, 3.6)), grow = easeIn(seg(t, 3.6, B0 - .02)), cx = 640, cy = 790;
    boilSeed('bubbles');
    for (const [bx, by, r, d] of [[560, 930, 20, 0], [590, 880, 30, .08], [620, 828, 44, .16]]) {
      const k = easeOut(seg(t, 3.2 + d, 3.4 + d)) * (1 - seg(grow, .1, .35));
      if (k > .02) paint(ellPts(bx, by, r * k, r * k, 14), { wash: '#FFFFFF', ink: PAL.ink, sw: 2.4 });
    }
    if (born > .02) {
      const m = 1 + 14 * grow, rx = 290 * born * m, ry = 195 * born * m;
      if (rx < 700) {
        boilSeed('cloud');
        paint(cloudPts(cx, cy, rx, ry), { wash: AP.snowSky, fill: AP.snowSkyLt, fillOp: 120, bleed: .1, tex: .3, ink: PAL.ink, sw: 3.4, curv: .1 });
        paint(ellPts(cx - rx * .25, cy - ry * .25, rx * .45, ry * .35, 18), { wash: AP.snowSkyLt, washOp: 200, ink: null });
      } else solidShape(cloudPts(cx, cy, rx, ry), AP.snowSky, rx < 1200 ? PAL.ink : null, 3.4);   // too big for the brush: a flat fill
    }
    veil(AP.snowSky, seg(t, B0 - .14, B0 - .02));   // the last of the swell: the whole frame, one colour
  }
  function shotA(t) {
    bappaGround(t);
    const o = bappaA(t);
    bappa(BP.x, BP.y, BP.u, { ...o, boilKey: 'bap' });
    // the modak, in his trunk at his mouth, big and in front of it, with his hand steadying it
    if (t < CHOMP3 + .15) {
      const m = modakA(t, o);
      if (m.s > 1) {
        push(); translate(m.x, m.y); rotate(m.rot + .08 * Math.sin(t * 20) * chompK(t)); boilSeed('amodak'); apModak(0, 0, m.s); pop();
        if (t < CHOMP3 + .1) { const h = bappaHand(BP.x, BP.y, BP.u, o, -1); boilSeed('afist'); paint(ellPts(h[0] + 4, h[1] - 6, .85 * BP.u, .8 * BP.u, 12), { wash: BAP.skin, ink: PAL.ink, sw: 1.5 }); }
      }
    }
    const mx = BP.x - 1.35 * BP.u, my = BP.y - 8.9 * BP.u;
    for (let i = 0; i < 3; i++) crumbs(t, CHOMPS[i], mx, my, 7, 'crumb' + i);
    if (t >= 1.8 && t < 2.4) { const a = t - 1.8; boilSeed('lipcrumb'); paint(ellPts(mx - 20 + 10 * a, my + 20 + 360 * a * a, 7, 6, 8), { wash: '#F5DDB0', washOp: 255 * (1 - seg(a, .45, .6)), ink: AP.dryDk, sw: .5 }); }
    thoughtCloud(t);
    // the hook caption is already up on frame 0 (age + 1)
    caption("Bappa can't wait", 470, t + 1, { life: HOOK2 + 1, size: 62 });
    caption('3 SECONDS', 585, t + 1, { life: HOOK2 + 1, size: 118, color: GOLDC });
    caption('for a modak…', 690, t + 1, { life: HOOK2 + 1, size: 60 });
    caps(t, [['His mother lived on', 470, HOOK2, 3.9 - HOOK2, 60], ['DRY LEAVES', 585, HOOK2, 3.9 - HOOK2, 118, LEAFC], ['for 3,000 YEARS.', 695, HOOK2, 3.9 - HOOK2, 76]]);
  }

  // ---------------- B: the princess and the yogi ----------------
  function parvatiB(t) {
    const keys = [[0, 'hopeful', {}], [GARLAND, 'happy', { eyes: 'happy', mouth: 'smile' }], [WAVE1, 'confused', { emote: null }], [P_SAD, 'sad', { emote: null }], [P_DET, 'determined', { emote: null }]];
    const o = pEmo(t, keys, { take: .6 });
    o.emote = null;
    const w = stroll(t, 4.2, P_STOP, -170, 330, PB.u);
    o.x = w.x; if (t < P_STOP + .15) { o.walk = w.walk; }
    o.dy = (o.dy || 0) * .6 + (t < P_STOP ? w.dy : 0);
    o.hx = lerp(.2, .75, ease(seg(t, 4.4, 5.3)));
    // the arms: the garland held at her chest, out to him, one hand waves, then it all droops, then a fist
    const wv = Math.sin((t - WAVE0) * TAU * 2.6) * (seg(t, WAVE0, WAVE0 + .12)) * (1 - seg(t, WAVE1 - .15, WAVE1));
    o.handL = kf(t, [[4.0, [-2.4, -12.4]], [P_STOP, [-2.4, -12.4]], [GARLAND + .25, [3.8, -13.6]], [P_SAD - .2, [3.8, -13.2]], [P_SAD + .5, [-2.2, -9.2]], [P_DET - .3, [-2.2, -9.2]], [P_DET + .3, [-3.6, -10.4]]]);
    const hr = kf(t, [[4.0, [2.4, -12.4]], [P_STOP, [2.4, -12.4]], [GARLAND + .25, [7.6, -13.8]], [WAVE0 - .1, [7.6, -13.8]], [WAVE0 + .15, [10.3, -14.6]], [WAVE1, [10.3, -14.6]], [WAVE1 + .6, [3.4, -12.6]], [P_SAD + .5, [3.3, -9.6]], [P_DET - .3, [3.3, -9.6]], [P_DET + .25, [1.6, -14.8]]]);
    o.handR = [hr[0] + 1.1 * wv, hr[1] + .35 * Math.abs(wv)];
    o.bendL = 1; o.bendR = t > P_DET ? 1.5 : 1;
    // she leans toward him for the wave, so her hand passes in front of his face
    o.lean = (1.6 * ease(seg(t, GARLAND, GARLAND + .3)) + 2.4 * ease(seg(t, WAVE0 - .15, WAVE0 + .1)) * (1 - ease(seg(t, WAVE1, WAVE1 + .35)))) * (1 - ease(seg(t, P_SAD - .1, P_SAD + .4)));
    if (t >= P_DET - .05) { o.armR = (u, sw) => { paint(ellPts(0, -.05 * u, .74 * u, .66 * u, 12), { wash: PRV.skin, ink: PRV.ink, sw: sw * .8 }); for (const k of [-.3, 0, .3]) inkLine([[k * u, -.25 * u], [k * u, .1 * u]], sw * .5, PRV.ink, 'inkfine', 0); }; }
    o.htilt = t >= P_DET ? -.1 * ease(seg(t, P_DET, P_DET + .3)) : 0;
    return o;
  }
  function shotB(t, lt) {
    snowPeaks(t);
    seatRock(SHB.x, SHB.y - 6, 400, 100, 'brock');
    shiva(SHB.x, SHB.y, SHB.u, { ...feel('serene', t, SHV_SKIN), ganga: .8, seed: 2, boilKey: 'shiva' });
    // one snowflake lands on his nose, and he doesn't flinch
    const nose = [SHB.x + 2, SHB.y - 11.5 * SHB.u];
    if (t > FLAKE - .5 && t < FLAKE + 1.2) {
      const k = seg(t, FLAKE - .5, FLAKE), m = 1 - seg(t, FLAKE + .5, FLAKE + 1.2);
      const fx = lerp(nose[0] + 70, nose[0], easeOut(k)) + 14 * Math.sin(k * 9) * (1 - k), fy = lerp(nose[1] - 360, nose[1] - 4, k * k * .6 + k * .4);
      boilSeed('flake'); paint(starPts(fx, fy, 11 * m + 1, .4, 6, t * 3), { wash: '#FFFFFF', ink: AP.snowLine, sw: .7 });
    }
    const po = parvatiB(t), pe = { ...po }; delete pe.x;
    parvati(po.x, PB.y, PB.u, { ...pe, boilKey: 'parvati' });
    // the marigold garland
    {
      const aL = parvatiHand(po.x, PB.y, PB.u, pe, -1), aR = parvatiHand(po.x, PB.y, PB.u, pe, 1);
      const rel = ease(seg(t, WAVE0, WAVE0 + .25)), dr = ease(seg(t, P_SAD, P_SAD + .5));
      const free = [aL[0] + 26, aL[1] + lerp(115, 200, dr)];
      garland(aL, [lerp(aR[0], free[0], rel), lerp(aR[1], free[1], rel)], lerp(lerp(70, 150, ease(seg(t, P_STOP, GARLAND + .3))), lerp(30, 14, dr), rel), 'garl', 13);
    }
    if (t > WAVE0 && t < WAVE1 + .3) {   // "hello?" little air lines by her hand
      const hd = parvatiHand(po.x, PB.y, PB.u, pe, 1), k = 1 - seg(t, WAVE1 - .1, WAVE1 + .3); boilSeed('waveair');
      for (const s of [-1, 1]) inkLine([[hd[0] + s * 52, hd[1] - 30 + 40 * k * 0], [hd[0] + s * 70, hd[1] - 6], [hd[0] + s * 52, hd[1] + 24]], 2, AP.snowLine, 'inkfine', .5);
    }
    if (t >= WAVE1 && t < WAVE1 + .9) { boilSeed('qm'); emote('?', po.x + 150, PB.y - 25 * PB.u, 28, seg(t, WAVE1, WAVE1 + .25) * (1 - seg(t, WAVE1 + .6, WAVE1 + .9)), t - WAVE1); }
    if (t >= P_DET && t < P_DET + .5) sparkStar(po.x + 3.4 * PB.u, PB.y - 15.5 * PB.u, 26 * Math.sin(seg(t, P_DET, P_DET + .5) * Math.PI), 'detspark', TK.goldLt);
    // captions
    caps(t, [['Princess Parvati wanted', 470, B_CAP1, 2.0, 60], ['to marry SHIVA.', 570, B_CAP1, 2.0, 96, GOLDC],
      ["But the great yogi wouldn't\neven open his eyes.", 520, B_CAP2, 1.65, 62],
      ['So she chose HIS path:', 470, B_CAP3, 9.5 - B_CAP3, 60], ['TAPASYA', 590, TAPASYA, 9.5 - TAPASYA, 120, GOLDC]]);
    flushLetters();
    veil(AP.snowSky, 1 - seg(lt, 0, .3));   // out of the thought cloud: the whole frame fades in together
    if (t > WIPE1) brushWipe((t - WIPE1) / .8, [AP.saffron, AP.gold]);
  }

  // ---------------- C: the change ----------------
  const BR = { x: 690, y: 1400, u: 27 };                 // she, in the clearing (C and D)
  const PL = { x: 290, y: 1300, w: 590 };                // the leaf plate
  const LG = { x: 130, y: 1150, s: 150 };                // the lingam
  const camC = t => { const k = ease(seg(t, PULLBACK, D0)); return [lerp(BR.x, 540, k), lerp(960, 960, k), lerp(1.5 + .04 * seg(t, C0, PULLBACK), 1, k)]; };   // pushed in on her chest and head, then the pull-back to the D framing
  const scr2world = (sx, sy, [cx, cy, z]) => [cx + (sx - 540) / z, cy + (sy - 960) / z];
  const feet = (p0, p1, h, k) => arcPt(p0, p1, h, k);
  function parvatiC(t) {
    const o = pEmo(t, [[C0, 'serene', {}]], { take: .3 });
    o.emote = null; o.hx = 0;
    o.handL = [-4.5, -11]; o.handR = [4.5, -11]; o.bendL = 1.1; o.bendR = 1.1;
    return o;
  }
  // the saffron cloth that spirals round her, covers her, and unwinds up and off
  function clothSwirl(t, x, y, u) {
    const H1 = 26 * u;
    const vh = t < REVEAL ? lerp(0, 1.2, ease(seg(t, SWIRL0, SWIRL_FULL))) : lerp(1.2, 2.7, easeIn(seg(t, REVEAL, REVEAL + .42)));
    const vt = t < REVEAL ? 0 : lerp(0, 2.75, easeIn(seg(t, REVEAL, REVEAL + .5)));   // the tail follows the head up and off
    if (vh <= .02 || vt >= vh) return;
    const ph = t * 3;
    // a few saffron brush strokes across her, under the ribbons (no box: every edge is a brush edge)
    for (let i = 0; i < 7; i++) {
      const v = (i + .5) / 7 * Math.min(vh, 1.05); if (v < vt + .02 || v > vh) continue;
      const yy = y - v * H1, tilt = (hash(i * 3.3) - .5) * 1.2 * u, dir = i % 2 ? 1 : -1;
      boilSeed('stroke' + i);
      paint(ribbon([[x - dir * 5.6 * u, yy + tilt], [x, yy - tilt * .3 + .3 * u], [x + dir * 5.6 * u, yy - tilt]], .4 * u, 2.4 * u), { wash: i % 2 ? AP.saffron : '#F0A050', fill: AP.saffronDk, fillOp: 80, bleed: .1, tex: .6, ink: null });
    }
    // the cloth itself: three wide ribbons winding five turns, overlapping, so she is covered by cloth alone
    let tipPt = null;
    for (const [j, off, col] of [[0, 0, AP.saffron], [1, 2.1, '#F0A050'], [2, 4.2, AP.saffron]]) {
      const pts = [];
      for (let v = vt; v <= vh + 1e-6; v += .03) pts.push([x + u * 3.4 * (1 + Math.max(0, v - 1.1) * 1.3) * Math.sin(ph + off + v * TAU * 5), y - v * H1]);
      if (pts.length < 3) continue;
      boilSeed('cloth' + j);
      paint(ribbon(pts, 5.2 * u, 5.2 * u), { wash: col, fill: AP.saffronDk, fillOp: 100, bleed: .08, tex: .6, ink: AP.saffronDk, sw: 1.4 });
      inkLine(pts.map(p => [p[0], p[1] - u * .9]), 2, '#F7B070', 'ink', .5);
      if (j === 0) tipPt = pts[pts.length - 1];
    }
    if (tipPt && t < REVEAL) sparkStar(tipPt[0], tipPt[1], 22, 'swirlspark');
  }
  function shotC(t, lt) {
    const cam = camC(t), S = seasonAt('summer');
    camBegin(cam[0], cam[1], cam[2]);
    clearing(t, S);
    lingam(LG.x, LG.y, LG.s, 0, 'lingam', t);
    if (t >= PULLBACK) {   // the plate and its rock first appear as the camera pulls back
      const pk = backOut(seg(t, PULLBACK, PULLBACK + .45));
      push(); translate(PL.x, PL.y + 60); scale(Math.max(.01, pk)); translate(-PL.x, -PL.y - 60);
      plateScene(t);
      pop();
    }
    if (t < REVEAL) {
      const po = parvatiC(t), hide = { mukut: t >= CROWN, jhumka: t >= EARRINGS, nath: t >= EARRINGS + .04, bangles: t >= BANGLES };
      parvatiStripped(BR.x, BR.y, BR.u, { ...po, boilKey: 'prv' }, hide);
      jewelFlights(t, po, cam);
    }
    if (t >= REVEAL) {
      const ro = brahmaC(t);
      brahmacharini(BR.x, BR.y, BR.u, { ...ro, boilKey: 'brh' });
      if (t < REVEAL + .45) { const hp = brahmachariniHead(BR.x, BR.y, BR.u, ro); sparkleBurst(hp[0], hp[1] + 30, 150, t - REVEAL - .08, 'revspark', 12); sparkleBurst(BR.x - 120, BR.y - 330, 90, t - REVEAL - .02, 'revspark2', 6); sparkleBurst(BR.x + 130, BR.y - 260, 90, t - REVEAL - .12, 'revspark3', 6); }
    }
    clothSwirl(t, BR.x, BR.y, BR.u);
    camEnd();
    clearingFx(t, S);
    caps(t, [['She gave up her crown,\nher silks, her palace…', 520, C_CAP1, 1.95, 62], ['…for a saffron robe, a rudraksha\nmala and a water pot.', 520, C_CAP2, 1.75, 58]]);
    flushLetters();
    if (lt < .4) brushWipe(.5 + lt / .8, [AP.saffron, AP.gold]);
  }
  function brahmaC(t) {
    const o = rEmo(t, [[REVEAL, 'serene', {}]], { take: .3 });
    o.emote = null; o.hx = 0;
    o.handL = [-4.3, -12.6]; o.handR = [4.4, -12.6];
    const k = ease(seg(t, 13.5, 14.15));
    o.pray = k; o.oneFoot = k;
    o.aura = .25 * ease(seg(t, 12.15, 13.4));
    return o;
  }
  // the jewels leave on arcs: mukut, jhumkas, nath, bangles
  function jewelFlights(t, po, cam) {
    const u = BR.u, hp = (lx, ly) => parvatiHeadPt(BR.x, BR.y, u, po, lx, ly), out = (sx, sy) => scr2world(sx, sy, cam);
    // mukut: a little dip, then up and away
    if (t >= CROWN && t < CROWN + .95) {
      const a = t - CROWN, p0 = hp(0, -22.5), k = seg(a, .14, .9), dip = Math.sin(seg(a, 0, .14) * Math.PI) * 6;
      const q = feet([p0[0], p0[1] + dip], out(-260, 40), 380, easeIn(k) * .9 + k * .1);
      mukutAt(q[0], q[1], u, -4 * k, 'mukutfly');
      if (a < .5) sparkleBurst(p0[0], p0[1] - 20, 110, a - .02, 'crownspark', 9);
    }
    // jhumkas and the nath
    for (const [i, s] of [[0, -1], [1, 1]]) {
      const a = t - EARRINGS - i * .07; if (a < 0 || a > .95) continue;
      const p0 = hp(s * 2.75, -19), k = seg(a, .1, .85);
      const q = feet(p0, out(s < 0 ? -260 : 1340, 520 + 200 * i), 220 + 80 * i, easeIn(k) * .85 + k * .15);
      jhumkaAt(q[0], q[1], u, s * 5 * k, 'jhumkafly' + i);
    }
    { const a = t - EARRINGS - .12; if (a >= 0 && a < .9) { const p0 = hp(.3, -18.7), k = seg(a, .08, .8), q = feet(p0, out(160, 1990), -160, easeIn(k)); nathAt(q[0], q[1], u, 7 * k, 'nathfly'); } }
    // bangles slide down the forearms, over the hands and fall
    if (t >= BANGLES) for (const s of [-1, 1]) {
      const [, el, ha] = parvatiArm(po, s);
      for (let i = 0; i < 3; i++) {
        const a = t - BANGLES - i * .06 - (s > 0 ? .04 : 0), k0 = [.66, .74, .82][i];
        if (a < 0 || a > 1.1) continue;
        const slide = ease(seg(a, 0, .38)), kk = lerp(k0, 1.02, slide);
        let bx = BR.x + lerp(el[0], ha[0], kk) * u, by = BR.y + lerp(el[1], ha[1], kk) * u;
        const ang = Math.atan2(ha[1] - el[1], ha[0] - el[0]) + Math.PI / 2;
        if (a > .38) { const g = a - .38; bx += s * 70 * g; by += 80 * g + 1500 * g * g * .5; }
        bangleAt(bx, by, u, ang + (a > .38 ? s * (a - .38) * 6 : 0), i === 1 ? PRV.gold : PRV.bangle, 'bangle' + s + i);
      }
    }
  }

  // ---------------- D1: four thousand years in one clearing ----------------
  const FRUIT = [{ k: 'mango', dx: -195, dy: -10, s: 160, r: -.2 }, { k: 'banana', dx: -65, dy: 22, s: 175, r: .08 }, { k: 'pomegranate', dx: 65, dy: -12, s: 155, r: 0 }, { k: 'marigold', dx: 195, dy: 14, s: 155, r: 0 }];
  const GREENS = [{ k: 'green0', dx: -150, dy: -4, s: 215, r: -.25 }, { k: 'green1', dx: 5, dy: 18, s: 215, r: .2 }, { k: 'green2', dx: 155, dy: -6, s: 215, r: -.1 }];
  const BILVAS = [{ dx: -165, dy: 4, s: 205, r: -.5 }, { dx: 0, dy: 14, s: 205, r: .15 }, { dx: 160, dy: -2, s: 205, r: .55 }];
  const GREENS_IN = [17.6, 17.72, 17.84], BILVA_IN = [20.7, 20.82, 20.94];
  // the plate and what is on it at time t (fruit, greens or bilva), with the puffs where things have just vanished
  function plateScene(t, endAt = 1e9) {
    seatRock(PL.x, PL.y + 15, 650, 150, 'prock', 0, 100);
    leafPlate(PL.x, PL.y, PL.w, 'plate');
    const puffs = [], draw = (kind, it, i, sc, dx = 0, dy = 0) => {
      if (sc <= .01) return;
      push(); translate(PL.x + it.dx + dx, PL.y + it.dy + dy); scale(sc);
      if (kind === 'bilva') bilvaLeaf(0, 0, it.s * .7, it.r, { dry: 1, key: 'bil' + i }); else foodItem(kind, 0, 0, it.s, 'it' + i, it.r);
      pop();
    };
    FRUIT.forEach((it, i) => { const g = FRUIT_GONE[i]; if (t < g + .22) draw(it.k, it, i, 1 - easeIn(seg(t, g, g + .2)), 0, -22 * easeOut(seg(t, g, g + .2))); puffs.push([it, g]); });
    GREENS.forEach((it, i) => {
      const a = GREENS_IN[i], g = GREENS_GONE[i]; if (t < a) return; const k = seg(t, a, a + .28);
      if (t < g + .22) draw(it.k, it, 10 + i, 1 - easeIn(seg(t, g, g + .2)), 0, -(1 - easeOut(k)) * 330 - 22 * easeOut(seg(t, g, g + .2)));
      puffs.push([it, g]);
    });
    BILVAS.forEach((it, i) => {
      const a = BILVA_IN[i], g = i < 2 ? BILVA_GONE[i] : 1e9; if (t < a || t >= endAt) return; const k = seg(t, a, a + .6);
      if (t < g + .22) draw('bilva', it, 20 + i, 1 - easeIn(seg(t, g, g + .2)), 36 * Math.sin(k * Math.PI * 3) * (1 - k), -(1 - easeIn(k * .5 + .5 * k)) * 380 - 22 * easeOut(seg(t, g, g + .2)));
      if (i < 2) puffs.push([it, g]);
    });
    puffs.forEach(([it, g], i) => vanishPuff(PL.x + it.dx, PL.y + it.dy - 8, 150, t - g, 'pf' + i));
  }
  function seasonD(t) {
    if (t < RAINS - .15) return seasonAt('summer');
    if (t < RAINS + .15) return seasonAt('summer', 'rains', seg(t, RAINS - .15, RAINS + .15));
    if (t < WINTER - .05) return seasonAt('rains');
    if (t < WINTER + .25) return seasonAt('rains', 'winter', seg(t, WINTER - .05, WINTER + .25));
    return seasonAt('winter');
  }
  const auraD = t => kf(t, [[D0, .25], [RAINS - .1, .25], [RAINS + .25, .45], [WINTER - .05, .45], [WINTER + .3, .65], [30, .65]]);
  function treePose(t, aura) {
    const o = rEmo(t, [[0, 'serene', {}]], { take: .3 });
    o.emote = null; o.hx = 0; o.pray = 1; o.oneFoot = 1; o.aura = aura;
    return o;
  }
  const rollNum = (t, t0, dur, v) => { const k = easeOut(seg(t, t0, t0 + dur)); let n = Math.floor(v * k); if (k < 1) n = Math.max(0, n + Math.floor((hash(Math.floor(t * 24) * 3.7) - .5) * v * .05 * (1 - k))); return n.toLocaleString('en-US'); };
  function shotD1(t, lt) {
    const S = seasonD(t), sp = ease(seg(t, 23.6, D2)), pan = 900 * easeIn(sp);
    camBegin(540 + pan + 5 * Math.sin(t * .6), 960, 1);
    clearing(t, S);
    lingam(LG.x, LG.y, LG.s, S.snow * seg(t, WINTER + .5, WINTER + 2.5), 'lingam', t);
    plateScene(t);
    const o = treePose(t, auraD(t));
    brahmacharini(BR.x, BR.y, BR.u, { ...o, boilKey: 'brh' });
    snowCaps(BR.x, BR.y, BR.u, S.snow * seg(t, WINTER + .6, WINTER + 3));
    camEnd();
    clearingFx(t, S);
    caption(rollNum(t, YR1, .7, 1000) + ' YEARS', 530, t - YR1, { life: 17.4 - YR1, size: 130, color: GOLDC });
    caption('only fruits and flowers', 650, t - YR1, { life: 17.4 - YR1, size: 56 });
    caption(rollNum(t, YR2, .5, 100) + ' YEARS', 530, t - YR2, { life: 20.3 - YR2, size: 130, color: GOLDC });
    caption('only leafy greens', 650, t - YR2, { life: 20.3 - YR2, size: 56 });
    caption(rollNum(t, YR3, .8, 3000) + ' YEARS', 530, t - YR3, { life: 23.6 - YR3, size: 130, color: GOLDC });
    caption('only dry, fallen BILVA leaves', 650, t - YR3, { life: 23.6 - YR3, size: 56 });
    flushLetters();
    if (sp > 0) whipH(sp, 1, t);
  }

  // ---------------- D2: Bappa, insert ----------------
  // a gold thali piled with modaks, held at his belly
  function thali(x, y, w, key = 'thali') {
    boilSeed(key + 'sh'); paint(ellPts(x + 6, y + w * .1, w * .52, w * .17, 20), { fill: PAL.ink, fillOp: 70, bleed: .25, tex: .3, border: .1, ink: null });
    boilSeed(key + 'p');
    paint(ellPts(x, y, w * .52, w * .17, 26, 1), { wash: TK.gold, fill: TK.goldDk, fillOp: 90, tex: .5, ink: PAL.ink, sw: 1.4 });
    paint(ellPts(x, y - 3, w * .42, w * .12, 22, 1), { wash: TK.goldLt, fill: TK.gold, fillOp: 70, tex: .4, ink: TK.goldDk, sw: .8 });
    const s = w * .15, pile = [[-1.3, 0, 0], [-.45, .08, 0], [.45, .08, 0], [1.3, 0, 0], [-.9, -.9, 1], [0, -.95, 1], [.9, -.9, 1], [-.45, -1.75, 2], [.45, -1.75, 2], [0, -2.55, 3]];
    pile.forEach(([a, b], i) => { boilSeed(key + 'm' + i); modak(x + a * s * 1.1, y + (b * s * .85) - 2, s, 0); });
  }
  function bappaD2(t) {
    const hug = ease(seg(t, BAPPA_HUG - .04, BAPPA_HUG + .16));
    const o = bEmo(t, [[D2, 'hopeful', { eyes: 'shine', mouth: 'cat' }], [BAPPA_HUG, 'scared', { eyes: 'scared', mouth: 'wobble' }]], { take: .8 });
    o.emote = null; o.trunk = 'curl';
    o.aL = lerp(-.8, -1.6, hug); o.aR = lerp(-.8, -1.6, hug); o.flexL = .1 * hug; o.flexR = .1 * hug;
    const sh = t >= BAPPA_HUG ? Math.sin(T * 54) * .08 : 0; o.dx = (o.dx || 0) + sh; o.dy = (o.dy || 0) * .3;
    o.belly = 1;
    if (t >= BAPPA_HUG + .1) { const k = t - BAPPA_HUG - .1; o.emote = 'sweat'; o.emoteK = seg(k, 0, .22) * (1 - seg(k, .75, .95)) + seg(k, 1.0, 1.2) * (1 - seg(k, 1.5, 1.7)); o.emoteAge = k; }
    return o;
  }
  function shotD2(t, lt) {
    const slide = 760 * (1 - easeOut(seg(t, D2, D2 + .25))) + 820 * easeIn(seg(t, 24.9, D3));
    camBegin(540 - slide, 960, 1);
    boilSeed('d2bg');
    paint(rectPts(-1400, -100, W + 2800, H + 200), { wash: AP.peach, ink: null });
    paint(ellPts(540, 1130, 560, 640, 30), { fill: AP.peachLt, fillOp: 200, bleed: .3, tex: .3, border: .2, ink: null });
    paint(ellPts(540, 1700, 700, 150, 24), { fill: AP.peachDk, fillOp: 90, bleed: .3, tex: .3, border: .2, ink: null });
    const o = bappaD2(t);
    bappa(BP.x, BP.y, BP.u, { ...o, boilKey: 'bap' });
    const hug = ease(seg(t, BAPPA_HUG - .04, BAPPA_HUG + .16)), tx = BP.x + (o.dx || 0) * BP.u;
    thali(tx, BP.y - lerp(4.4, 4.9, hug) * BP.u, 6.7 * BP.u, 'bthali');
    // his hands grip the rim
    boilSeed('bhands');
    for (const s of [-1, 1]) paint(ellPts(tx + s * 3.15 * BP.u, BP.y - 4.45 * BP.u, .8 * BP.u, .72 * BP.u, 12), { wash: BAP.skin, ink: PAL.ink, sw: 1.4 });
    camEnd();
    caption('3,000 YEARS?!', 560, t - BAPPA_CAP, { life: 1.0, size: 110, color: GOLDC });
    flushLetters();
    if (lt < .3) whipH(1 - seg(lt, 0, .3), 1, t); if (t > 24.9) whipH(seg(t, 24.9, 25.1), -1, t);
  }

  // ---------------- D3: night, not even a leaf ----------------
  const LEAF_PATH = [[LEAF_LIFT, [PL.x + BILVAS[2].dx, PL.y + BILVAS[2].dy]], [26.7, [425, 1150]], [27.3, [575, 990]], [27.9, [660, 850]], [28.5, [580, 730]], [LEAF_CAM, [540, 660]], [E0, [540, 960]]];
  const leafPos = t => kf(t, LEAF_PATH);
  const LEAF_S = BILVAS[2].s * .7;   // the plate's bilva leaf, the same one that flies
  const leafSize = t => t < LEAF_CAM ? LEAF_S : lerp(LEAF_S, 3400, easeIn(seg(t, LEAF_CAM, E0)));
  const leafRot = t => (t < LEAF_CAM ? lerp(.55, 5.2, seg(t, LEAF_LIFT, LEAF_CAM)) : 5.2 + .9 * (t - LEAF_CAM)) + .35 * Math.sin(3.2 * t) * (t < E0 ? 1 : lerp(1, .4, seg(t, E0, E0 + 1)));
  // draw the bilva so that its middle leaflet's centre (k = 1) or its junction (k = 0) is at p
  const flyLeaf = (p, s, rot, k, key) => bilvaLeaf(p[0] - Math.sin(rot) * .5 * s * k, p[1] + Math.cos(rot) * .5 * s * k, s, rot, { dry: 1, key });
  function shotD3(t, lt) {
    const bloom = ease(seg(t, AURA_BLOOM, AURA_BLOOM + .9)), S = seasonAt('night');   // the sky stays deep indigo; the bloom is light, not a sky colour
    const sl = 800 * (1 - easeOut(seg(t, D3, D3 + .3)));
    camBegin(540 + sl, 960, 1 + .012 * lt / 4);
    clearing(t, S);
    lingam(LG.x, LG.y, LG.s, 0, 'lingam', t);
    // the plate: one dry bilva leaf, until the breeze lifts it
    seatRock(PL.x, PL.y + 15, 650, 150, 'prock', 0, 100);
    leafPlate(PL.x, PL.y, PL.w, 'plate');
    const bl = BILVAS[2];
    if (t < LEAF_LIFT) bilvaLeaf(PL.x + bl.dx, PL.y + bl.dy, bl.s * .7, bl.r, { dry: 1, key: 'bil22' });
    // the aura bloom: layered additive glows round her, big and warm, under her
    if (bloom > .01) {
      const gx = BR.x, gy = BR.y - 14 * BR.u;
      glow(gx, gy, 1250, '#FF9A4A', .4 * bloom); glow(gx, gy, 850, '#FFB454', .65 * bloom); glow(gx, gy, 520, '#FFD27A', .85 * bloom); glow(gx, gy - 6 * BR.u, 300, '#FFF0B8', .95 * bloom);
    }
    const o = treePose(t, lerp(.65, 1, bloom));
    brahmacharini(BR.x, BR.y, BR.u, { ...o, boilKey: 'brh' });
    if (t >= LEAF_LIFT && t < E0) {
      const p = leafPos(t), a = seg(t, LEAF_LIFT, LEAF_CAM);
      glow(p[0], p[1], 150 + 100 * a, '#FFE39A', .35 * (1 - seg(t, LEAF_CAM, E0)));
      flyLeaf(p, leafSize(t), leafRot(t), easeIn(seg(t, LEAF_CAM, E0)), 'flyleaf');
    }
    camEnd();
    caps(t, [['Then she gave up\neven THOSE.', 520, NIGHT_CAP1, 1.7, 62], ['No food. No water.', 470, NIGHT_CAP2, 29.2 - NIGHT_CAP2, 60], ['Only “Om Namah Shivaya.”', 575, NIGHT_CAP3, 29.2 - NIGHT_CAP3, 64, GOLDC]]);
    flushLetters();
    if (lt < .3) whipH(1 - seg(lt, 0, .3), -1, t);
  }

  // ---------------- E: the name ----------------
  const BE = { x: 540, y: 2414, u: 70 };
  const eLeaf = {   // the leaf shrinks fast and drifts across the lower frame (screen y >= 1350), well clear of her face
    pos: t => kf(t, [[E0, [540, 960]], [29.6, [620, 1480]], [29.9, [760, 1560]], [30.8, [900, 1520]], [31.6, [1010, 1470]], [31.95, [1330, 1440]]]),
    size: t => kf(t, [[E0, 3400], [29.6, 620], [29.9, 330], [31.5, 300], [31.95, 280]], ease),
  };
  function title(txt, x, y, size, color, age, o = {}) {
    const life = o.life ?? 2; if (age < 0 || age > life) return;
    letter(txt, x, y, size, color, { screen: true, font: o.font, pop: age * 5, rot: o.rot ?? 0, alpha: 1 - seg(age, life - .18, life), stroke: o.stroke || PAL.ink, sw: o.sw ?? .2, ink: false, maxW: o.maxW ?? 800 });
  }
  function shotE(t, lt) {
    const S = { ...seasonAt('dawn'), sunX: 800, sunY: 800 };
    clearing(t, S);
    const o = rEmo(t, [[E0, 'serene', {}]], { take: .3 }); o.emote = null; o.hx = 0; o.aura = 1; o.mala = false; o.pot = false; o.handL = [-.4, -14.6]; o.handR = [.4, -14.6]; o.bendL = o.bendR = .7; o.pray = 0;   // palms joined at her chest
    o.mouth = 'smile';
    brahmacharini(BE.x, BE.y, BE.u, { ...o, boilKey: 'brh' });
    const lp = eLeaf.pos(t), ls = eLeaf.size(t);
    if (t < 32.1) flyLeaf([lp[0], lp[1] + (t > 30.4 ? 28 * Math.sin(t * 1.3) : 0)], ls, leafRot(t), 1, 'flyleaf');
    caps(t, [['The gods gave her a new name.', 500, NAME_CAP1, 31.35 - NAME_CAP1, 58]]);
    caption('Can you guess it?', 640, t - GUESS, { life: 31.35 - GUESS, size: 84, color: GOLDC });
    title('APARNA', 540, 560, 150, GOLDC, t - APARNA, { life: 33.4 - APARNA, font: '150px Marcellus', sw: .13 });
    caption('“she who gave up even a leaf”', 730, t - APARNA_SUB, { life: 33.4 - APARNA_SUB, size: 52, maxW: 860 });
    if (t >= APARNA && t < APARNA + .9) { sparkleBurst(540, 560, 230, t - APARNA, 'nameburst', 12); sparkleBurst(300, 590, 110, t - APARNA - .05, 'nameburst2', 7); sparkleBurst(790, 540, 110, t - APARNA - .1, 'nameburst3', 7); }
    flushLetters();
    if (t > 33.2) brushWipe((t - 33.2) / .8, ['#8E7DB0', '#F0C987']);
  }

  // ---------------- F: the test ----------------
  const BF = { x: 320, y: 1450, u: 30 };                // Brahmacharini at dusk
  const SF = { y: 1450, u: 30, x: 700 };                // the stranger (same height), and where he stops (inside Instagram's button column)
  const SHF = { x: 700, y: 1418, u: 28 };               // Shiva on his rock, where the stranger stood
  const seasonF = t => seasonAt('dusk', 'rose', ease(seg(t, P_DELIGHT, P_DELIGHT + .9)));
  function strangerF(t) {
    const w = stroll(t, STRANGER_IN, STRANGER_STOP, 1340, SF.x, SF.u), o = { x: w.x };
    o.walk = t < STRANGER_STOP + .12 ? w.walk : null; o.plant = ease(seg(t, STRANGER_STOP - .1, STRANGER_STOP + .1));
    const talk = t >= MOCK && t < MOCK + 2.45, laugh = seg(t, 36.1, 36.3) * (1 - seg(t, 37.3, 37.5));
    o.dy = t < STRANGER_STOP ? w.dy : 0;
    o.eyes = 'narrow'; o.mouth = talk ? (Math.floor(t * 5.5) % 2 ? 'grin' : 'smirk') : 'grin'; o.brow = .6; o.lookX = -.9;
    o.gest = talk ? ease(seg(t, MOCK, MOCK + .3)) * (1 - ease(seg(t, MOCK + 2.2, MOCK + 2.45))) : 0;
    if (laugh > .05) { o.eyes = 'squeeze'; o.mouth = 'laugh'; }
    o.laugh = laugh;
    o.thumb = ease(seg(t, 35.85, 36.0)) * (1 - ease(seg(t, 36.55, 36.8)));
    o.tail = seg(t, TAIL0, TAIL0 + .3) * (1 - seg(t, TAIL1 - .35, TAIL1));
    o.glint = seg(t, MOON_GLINT, MOON_GLINT + .1) * (1 - seg(t, MOON_GLINT + .4, MOON_GLINT + .55));
    if (t >= ANGRY - .1) { o.eyes = 'wide'; o.mouth = 'o'; o.brow = -.3; o.laugh = 0; o.thumb = 0; }
    return o;
  }
  function brahmaF(t) {
    const keys = [[F0, 'serene', {}], [P_EYES, 'gentle', { eyes: 'normal', mouth: 'smile' }], [ANGRY, 'angry', { eyes: 'angry', mouth: 'teeth', brows: -1 }], [TURN_AWAY + .3, 'angry', { eyes: 'angry', mouth: 'flat', brows: -.6, emote: null }],
      [P_TURN_BACK, 'surprised', { eyes: 'wide', mouth: 'O' }], [P_DELIGHT, 'delight', { emote: null }]];
    const o = rEmo(t, keys, { take: .8 });
    if (t < ANGRY || t >= P_TURN_BACK) o.emote = (t >= YOURS ? 'hearts' : (t >= P_TURN_BACK && t < P_DELIGHT ? '!' : null));
    if (t >= YOURS) { o.emoteK = seg(t, YOURS, YOURS + .3); o.emoteAge = t - YOURS; }
    o.hx = .6; o.mala = true; o.pot = true;
    o.x = BF.x; o.flip = false;
    // a small polite bow when she opens her eyes
    const bow = bump(t, P_EYES + .2, .15, .35); o.htilt = .16 * bow; o.dy = (o.dy || 0) + .35 * bow;
    // ANGRY: a raised palm (the pot rides up with it)
    const up = ease(seg(t, ANGRY, ANGRY + .18)) * (1 - ease(seg(t, TURN_AWAY, TURN_AWAY + .2)));
    o.handR = [lerp(4.3, 5.6, up), lerp(-13.5, -19.6, up)]; o.handL = [-4.2, -13.5];
    o.bendR = 1; o.malaSwing = .3 * Math.sin(t * 3);
    if (t >= TURN_AWAY) {   // she turns on a beat, away from him, and takes two steps left
      const k = ease(seg(t, TURN_AWAY + .12, TURN_AWAY + .85));
      o.flip = t < P_TURN_BACK; o.x = lerp(BF.x, 200, k); o.walk = k > 0 && k < 1 ? k * 2 : undefined;
      o.sq = (o.sq || 0) + .1 * bump(t, TURN_AWAY + .05, .05, .15);
      o.hx = o.flip ? -.4 : .8;
    }
    if (t >= P_TURN_BACK) { o.sq = (o.sq || 0) + .08 * bump(t, P_TURN_BACK + .08, .05, .15); }
    // palms joined above her head at the end
    const pr = ease(seg(t, 41.9, 42.5)); o.pray = pr;
    o.aura = lerp(.5, 1, ease(seg(t, P_DELIGHT, YOURS + 1)));
    return o;
  }
  function heartRise(x, y, t0, t, key = 'heartr') {
    for (let i = 0; i < 6; i++) {
      const a = t - t0 - i * .22; if (a < 0 || a > 1.5) continue;
      boilSeed(key + i);
      const hx = x + 60 * Math.sin(a * 2.3 + i * 1.7) + (i % 2 ? 50 : -50), hy = y - 60 - a * 190, r = (18 + 10 * hash(i * 3.1)) * Math.min(1, a * 5), k = 1 - seg(a, 1.0, 1.5);
      paint(heartPts(hx, hy, r), { wash: i % 2 ? '#F2708C' : '#FF9AAE', washOp: 235 * k, ink: '#B84560', sw: .9 });
    }
  }
  function shotF(t, lt) {
    const S = { ...seasonF(t) }; S.petals = ease(seg(t, PETALS, PETALS + .6));
    clearing(t, S);
    const bo = brahmaF(t), bx = bo.x; delete bo.x;
    const gone = t >= POOF + .16;
    // Shiva's rock and Shiva: they are under the smoke when it clears
    const sk = backOut(seg(t, SHIVA_REVEAL - .1, SHIVA_REVEAL + .3));
    if (sk > .03) {
      const k = sk, cx = SHF.x, cy = SHF.y;
      push(); translate(cx, cy); scale(k); translate(-cx, -cy);
      seatRock(SHF.x, SHF.y - 10, 420, 100, 'frock');
      const sh = sEmo(t, [[SHIVA_REVEAL, 'gentle', { eyes: 'normal', mouth: 'smile' }]], { take: .4 }); sh.emote = null;
      const bl = ease(seg(t, YOURS - .1, YOURS + .3));
      shiva(SHF.x, SHF.y, SHF.u, { ...sh, ganga: 1.2, seed: 4, snakeUp: 1, snakeEyes: 'open', snakeLook: -.6, hx: -.45, handL: [lerp(-5.6, -7.0, bl), lerp(-3.55, -12.4, bl)], bendL: 1.4 * bl + 1 * (1 - bl), thirdGlow: 0, boilKey: 'shiva' });
      glow(SHF.x - 2.1 * SHF.u, SHF.y - 18.4 * SHF.u, 150, '#FFF0C0', .9);
      pop();
    }
    brahmacharini(bx, BF.y, BF.u, { ...bo, boilKey: 'brh' });
    if (t >= YOURS && t < YOURS + 2) heartRise(bx, BF.y - 25 * BF.u, YOURS, t);
    // the stranger, until the poof
    if (!gone) {
      const so = strangerF(t), sx = so.x; delete so.x;
      stranger(sx, SF.y, SF.u, { ...so, boilKey: 'str' });
    }
    if (t >= POOF) { ashPoof(SF.x - 20, SF.y - 12 * SF.u, 440, (t - POOF) / .95, 'ashA'); ashPoof(SF.x + 20, SF.y - 21 * SF.u, 300, (t - POOF - .03) / .95, 'ashB'); ashPoof(SF.x + 30, SF.y - 3 * SF.u, 300, (t - POOF - .02) / .95, 'ashC'); shawlFly(SF.x, SF.y, SF.u, t - POOF - .08); }
    clearingFx(t, S);
    caps(t, [['Then a stranger came…', 470, F_CAP1, 1.3, 66], ['“Why waste your life on SHIVA?\nHe lives in graveyards,\nwears snakes and ash!”', 545, MOCK, 2.45, 54],
      ['“Not one more word\nagainst him!”', 520, ANGRY, 1.45, 72, '#FF8A70'], ['It was SHIVA!', 540, SHIVA_CAP, 41.2 - SHIVA_CAP, 112, GOLDC], ['He was testing her.', 665, 40.15, 41.2 - 40.15, 56],
      ['“From today, I am yours,\nwon by your tapasya.”', 520, YOURS, 2.15, 66]]);
    flushLetters();
    if (lt < .45) brushWipe(.5 + lt / .9, ['#8E7DB0', '#F0C987']);
    if (t > 43.2) brushWipe((t - 43.2) / .8, [TK.petalDk, TK.goldLt]);
  }

  // ---------------- G: the rhyme ----------------
  const REACH = [[0, -11.2], [-.6, -10.6], [-1.8, -10.0], [-3.2, -9.8], [-4.5, -9.8], [-5.6, -10.0]];   // the trunk reaching out to screen-left
  const modakHalf = (x, y, sz, side) => { boilSeed('mh' + side); apModak(x, y, sz, side); };   // half a modak (side -1 the left half, 1 the right): (x, y) is the middle of its base
  const MOMP = { x: 36, y: BP.y, u: 34 };                 // Parvati as Mom, partly in frame from the left edge
  function momO(t) {
    const keys = [[G0, 'happy', { eyes: 'normal', mouth: 'smile' }], [MOM_IN + .5, 'happy', { eyes: 'teary', mouth: 'smile', blush: .6 }], [SHARE_CHOMP - .1, 'love', { eyes: 'happy', mouth: 'smile', emote: null }]];
    const o = pEmo(t, keys, { take: .6 }); o.emote = t >= SHARE_CHOMP + .1 ? 'hearts' : null; if (o.emote) { o.emoteK = seg(t, SHARE_CHOMP + .1, SHARE_CHOMP + .35); o.emoteAge = t - SHARE_CHOMP - .1; }
    const inK = ease(seg(t, MOM_IN, MOM_IN + .4));
    o.x = lerp(-230, MOMP.x, inK); o.hx = .7; o.lean = 3.2 * inK; o.walk = t < MOM_IN + .4 ? (t - MOM_IN) * 1.8 : undefined;
    const rest = [3.4, -10.2], reach = [6.2, -10.6], chest = [1.8, -13.4], mouthP = [1.0, -17.6];
    const take = ease(seg(t, TAKE_MODAK - .25, TAKE_MODAK)), back = ease(seg(t, TAKE_MODAK + .1, TAKE_MODAK + .35));
    const grab = ease(seg(t, BREAK - .3, BREAK - .08)), pull = ease(seg(t, BREAK, BREAK + .22)), pulledR = [3.9, -13.2], pulledL = [-2.1, -13.0];
    let hr = mixPt(rest, reach, ease(seg(t, MOM_IN + .2, MOM_IN + .45))); hr = mixPt(hr, chest, back); hr = mixPt(hr, pulledR, pull);
    let hl = mixPt([-3.4, -10.4], [.3, -13.4], grab); hl = mixPt(hl, pulledL, pull);
    if (t >= HALF_BACK) { hr = mixPt(pulledR, [6.3, -10.8], ease(seg(t, HALF_BACK - .05, HALF_BACK + .25))); }
    if (t >= HALF_BACK + .45) { hr = mixPt([6.3, -10.8], chest, ease(seg(t, HALF_BACK + .45, HALF_BACK + .7))); }
    if (t >= SHARE_CHOMP - .1) { hl = mixPt(pulledL, mouthP, ease(seg(t, SHARE_CHOMP - .1, SHARE_CHOMP + .15))); }
    o.handR = hr; o.handL = hl; o.bendL = 1; o.bendR = 1;
    return o;
  }
  const mixPt = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  function bappaG(t) {
    const keys = [[G0, 'sad', { eyes: 'teary', mouth: 'smile', tint: null, tintK: 0, gloom: 0, emote: null }], [TAKE_MODAK + .1, 'happy', { eyes: 'happy', mouth: 'smile' }], [SHARE_CHOMP - .08, 'love', { eyes: 'happy', mouth: 'grin', emote: null }]];
    const o = bEmo(t, keys, { take: .7 }); o.emote = null;
    const ofr = ease(seg(t, OFFER, MOM_IN));
    o.aL = lerp(-1.5, -.42, ofr); o.flexL = lerp(.1, .5, ofr); o.aR = -.7 + .08 * Math.sin(t * 3);
    o.hx = -.25 * ofr; o.dy = (o.dy || 0) * .4; o.blush = .5;
    // the trunk: curled; reaches out for his half; curls it back to his mouth
    const k1 = ease(seg(t, HALF_BACK - .1, HALF_BACK + .25)), k2 = ease(seg(t, HALF_BACK + .4, HALF_BACK + .7));
    o.trunk = k1 > 0 ? resample(TRUNKS.curl, 9).map((p, i) => mixPt(p, resample(REACH, 9)[i], k1)) : 'curl';
    if (k2 > 0) { o.trunk2 = EAT; o.trunkK = k2; }
    if (t >= SHARE_CHOMP + .1) { o.emote = 'hearts'; o.emoteK = seg(t, SHARE_CHOMP + .1, SHARE_CHOMP + .4); o.emoteAge = t - SHARE_CHOMP - .1; }
    o.sq = (o.sq || 0) + .08 * bump(t, SHARE_CHOMP + .2, .02, .15) + .08 * bump(t, SHARE_CHOMP + .5, .02, .15);
    return o;
  }
  function shotG(t, lt) {
    bappaGround(t, 'gbg');
    const o = bappaG(t), mo = momO(t), mx = mo.x; delete mo.x;
    const hand = bappaHand(BP.x, BP.y, BP.u, o, -1);
    // Mom first (behind), Bappa and his leaf in front
    parvati(mx, MOMP.y, MOMP.u, { ...mo, boilKey: 'mom' });
    bappa(BP.x, BP.y, BP.u, { ...o, boilKey: 'bap' });
    const rot = -.55, leafJ = [hand[0] - 8, hand[1] + 10], ls = 200;
    bilvaLeaf(leafJ[0], leafJ[1], ls, rot, { dry: .3, key: 'gleaf' });
    // the modak: on the leaf, to her hand, torn in two (the halves pull clearly apart), her half to her mouth, his half into his hand and then his trunk
    const hR = parvatiHand(mx, MOMP.y, MOMP.u, mo, 1), hL = parvatiHand(mx, MOMP.y, MOMP.u, mo, -1);
    const ms = 95, onLeaf = [leafJ[0] - 30, leafJ[1] - 26];
    const mb = (h, dx = 6) => [h[0] + dx, h[1] + 40];   // a modak's base, held in a hand
    if (t < TAKE_MODAK) { boilSeed('gmodak'); apModak(onLeaf[0], onLeaf[1], ms); }
    else if (t < BREAK) {
      const k = ease(seg(t, TAKE_MODAK, TAKE_MODAK + .3)), p = arcPt(onLeaf, mb(hR), 60, k); boilSeed('gmodak'); apModak(p[0], p[1], ms);
      if (t > BREAK - .22) {   // a hairline crack opens down the middle before it tears
        const w = seg(t, BREAK - .22, BREAK); boilSeed('crack'); inkLine([[p[0], p[1] - 1.4 * ms * w], [p[0] + 6, p[1] - 1.0 * ms * w], [p[0] - 5, p[1] - .6 * ms * w], [p[0] + 4, p[1] - .2 * ms * w]], 2, PAL.ink, 'ink', 0);
      }
    }
    else {
      // her half (left) goes to her mouth; his half (right) goes into his hand, then his trunk
      let pl = [hL[0] + 22, hL[1] + 40], pr = [hR[0] - 22, hR[1] + 40];
      if (t >= HALF_BACK + .3) { const tip = bappaTrunkTip(BP.x, BP.y, BP.u, o); pr = [tip[0] + 2, tip[1] + .8 * (t < SHARE_CHOMP ? ms : Math.max(0, kf(t, [[SHARE_CHOMP, ms], [SHARE_CHOMP + .12, ms * .55], [SHARE_CHOMP + .3, ms * .55], [SHARE_CHOMP + .42, ms * .2], [SHARE_CHOMP + .7, ms * .2]])))]; }
      else if (t >= HALF_BACK) { const k = ease(seg(t, HALF_BACK + .1, HALF_BACK + .3)); pr = arcPt(pr, mb(hand, 14), 30, k); }
      const sL = t < SHARE_CHOMP ? ms : kf(t, [[SHARE_CHOMP, ms], [SHARE_CHOMP + .12, ms * .55], [SHARE_CHOMP + .4, ms * .55], [SHARE_CHOMP + .52, ms * .25], [SHARE_CHOMP + .8, ms * .25], [SHARE_CHOMP + .92, 0]]);
      const sR = t < SHARE_CHOMP ? ms : kf(t, [[SHARE_CHOMP, ms], [SHARE_CHOMP + .12, ms * .55], [SHARE_CHOMP + .3, ms * .55], [SHARE_CHOMP + .42, ms * .2], [SHARE_CHOMP + .7, ms * .2], [SHARE_CHOMP + .82, 0]]);
      if (sL > 1) modakHalf(pl[0], pl[1], sL, -1);
      if (sR > 1) modakHalf(pr[0], pr[1], sR, 1);
      if (t >= BREAK && t < BREAK + .7) { crumbs(t, BREAK, (hL[0] + hR[0]) / 2, hL[1] + 20, 16, 'bcrumb'); sparkleBurst((hL[0] + hR[0]) / 2, hL[1] - 10, 130, t - BREAK - .02, 'bbreak', 8); }
      for (const [i, c] of [SHARE_CHOMP + .12, SHARE_CHOMP + .42].entries()) { crumbs(t, c, BP.x - 1.35 * BP.u, BP.y - 8.9 * BP.u, 5, 'gcr' + i); crumbs(t, c + .02, hL[0] + 20, hL[1] - 30, 5, 'gcm' + i); }
    }
    caps(t, [['Bappa: “Maa, this one\nis for you.”', 520, G_CAP1, 1.85, 60], ['What could YOU give up\nfor one day?', 520, QUESTION, 47.6 - QUESTION, 78, GOLDC], ['Tell us in the comments!', 700, QUESTION_SUB, 47.6 - QUESTION_SUB, 50]]);
    flushLetters();
    if (lt < .4) brushWipe(.5 + lt / .8, [TK.petalDk, TK.goldLt]);
    if (t >= HEART_IRIS) {   // a peach heart opens from Bappa's heart: it IS the card's ground
      const k = easeIn(seg(t, HEART_IRIS, CARD)), r = lerp(18, 2400, k);
      boilSeed('heartiris');
      paint(heartPts(BP.x, BP.y - 7.6 * BP.u + r * .1, r), { wash: TK.peach, ink: r < 500 ? PAL.ink : null, sw: 2, curv: .3 });
    }
  }

  // ---------------- the card ----------------
  const CARDC = { book: COVER, fan: FAN, logo: LOGO, series: SERIES, sub: PRICE, pill: PILL, follow: FOLLOW };
  function shotCard(t) {
    endCard(t, CARDC, 'book2', ['book1', 'book3']);
    const age = t - CARD_CAP, life = LOGO - CARD_CAP - .05;
    if (age >= 0 && age < life) {
      const a = 1 - seg(age, life - .2, life);
      letter('Navratri Day 2: Maa Brahmacharini', 540, 462, 54, TK.teal, { screen: true, font: '54px Marcellus', ink: false, pop: age * 5, alpha: a, maxW: 880 });
      letter('Her story of never giving up is Book 2!', 540, 548, 38, TK.rkOrange, { screen: true, font: '500 38px Poppins', ink: false, pop: Math.max(0, age - .1) * 5, alpha: a, maxW: 880 });
    }
    const k = frac((t - FOLLOW) / 1.6);
    if (t > FOLLOW) { flushLetters(); boilSeed('sparkle'); paint(starPts(lerp(300, 720, k), lerp(1040, 660, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
  }

  shots([[0, shotA], [B0, shotB], [C0, shotC], [D0, shotD1], [D2, shotD2], [D3, shotD3], [E0, shotE], [F0, shotF], [G0, shotG], [CARD, shotCard]]);
})();
