// "What happens if Shiva opens his third eye?": a captioned explainer for Rishi Katha's Navadurga picture books.
// The gods need Shiva out of his meditation; Kamadeva makes a false spring bloom on Kailash and shoots a flower arrow.
// The third eye opens (his two eyes never do), and fire burns Kama and his illusion to ash. Not anger: it sees what is
// real and burns what isn't. Kama lives on in every heart; Parvati chooses tapasya and becomes Maa Brahmacharini (Book 2).
// About 47 s, 1080×1920 (a vertical reel). Storyboard: STORYBOARD.md. Sets and props: third_eye_kama_props.js.
// Characters: src/shiva.js, src/kamadeva.js (and his parrot), src/parvati.js. Sound: tools/third_eye_kama_sfx.mjs.
//
// Every pose is a pure function of film time (shivaO, kamaO, parvatiO, parrotO), so the shots only choose a framing, a
// camera, captions and their transitions. Frame 0 is a finished picture with its caption already up: no fade in.
(() => {
  // ---------------- the times (tools/third_eye_kama_sfx.mjs copies them) ----------------
  const B0 = 3.4, CU = 15.9, E0 = 17.3, H0 = 40.1, CARD0 = 41.6;
  const FLARE = 1.5, VAS = 1.7, CRACK = 2.6, RED_FULL = 3.25, FOUND = 2.85;
  const GODS = 4.7, SWOOP = [6.6, 7.7], KAMA_CAP = 6.9, HOP = [7.75, 8.15];
  const WINK = 8.95, SNAP = 9.5, SPRING = [9.55, 11.0], SPRING_CAP = 9.8, AIM = [11.7, 12.3], DRAW = [12.4, 13.6], ARROW_CAP = 12.2, SNAKE_EYE = 12.8, RELEASE = 13.9;
  const HIT = 14.45, HUH = 15.0, PUSH = [15.45, 15.9], OPEN = 16.6, FIRE = 17.05;
  const ASH = 17.85, FLEE = [17.5, 18.5], SWEEP0 = 17.6, ASH_CAP = 19.2;
  const F0 = 21.2, NEVER = 21.6, CLOSE3 = [23.4, 24.1], ANGER = 24.1, ILLUSION = 26.1, REAL = 29.3, GLINT = 29.8, PEEK = 31.7, PEEK_CAP = 31.9;
  const G0 = 34.4, HEART = [34.7, 36.0], BURST = 36.0, TAPAS = 37.4, GOLD_FLASH = [39.75, 40.1];
  const GOLD = 40.75, ALMOND = [41.0, 41.6];
  const CARD = { book: 41.8, fan: 42.2, logo: 42.85, series: 43.2, sub: 43.6, pill: 44.0, follow: 44.6 };

  // ---------------- the stage ----------------
  const SH = { x: 430, y: 1450, u: 29 };       // Shiva on his tiger skin (wide)
  const PV = { x: 140, y: 1440, u: 19 };       // Parvati, to his right (screen left), facing him
  const KM = { x: 862, y: 1462, u: 22 };       // Kamadeva, facing left, at Shiva
  const PR = { x: 985, y: 1375, s: 30 };       // where the parrot lands with him
  const PERCH = { x: 992, y: 1012, s: 11 };    // and where it waits, small, up on the far ridge
  const CUF = { x: 540, y: 1936, u: 62 };      // the close-up: his face at (540, 1130)
  const GOLDC = '#F5C542';
  const bump = (t, t0, a = .1, b = .25) => seg(t, t0 - a, t0) * (1 - seg(t, t0, t0 + b));
  const mixP = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

  // ---------------- Shiva ----------------
  function shivaO(t) {
    const o = { ...feel('serene', t), ...SHV_SKIN, ganga: .8, seed: 3, thirdGlow: .12, snakeEyes: 'closed' };
    if (t < B0) {   // the hook: the ember stirs, Vasuki wakes, the eye starts to crack
      const f = ease(seg(t, FLARE, CRACK));
      o.thirdGlow = .55 + .1 * Math.sin(t * 4) + .45 * f; o.thirdShake = .05 * f; o.third = .14 * ease(seg(t, CRACK, CRACK + .35));
      o.snakeUp = .55 * backOut(seg(t, VAS, VAS + .35)); o.snakeEyes = t > VAS ? 'open' : 'closed'; o.snakeLook = .2;
      o.brow = -.15 * f;
      return o;
    }
    if (t >= H0) {   // the blessing: both eyes open on us, a smile, the third eye opens gold
      Object.assign(o, { eyes: 'normal', mouth: 'smile', lookX: 0, lookY: .1, snakeUp: .45, snakeEyes: 'happy', snakeLook: .3, thirdCol: GOLDC });
      if (t < H0 + .35) { o.eyes = 'closed'; }
      o.third = backOut(seg(t, GOLD, GOLD + .25)); o.thirdGlow = .3 + .7 * ease(seg(t, GOLD - .2, GOLD + .3));
      o.sq = (o.sq || 0) + .03 * spring(t, H0 + .35, 6, 18);
      return o;
    }
    // Vasuki: asleep, then one eye on Kama when he aims, angry after the hit, calm again by the twist
    if (t > SNAKE_EYE && t < F0 + 1.5) {
      o.snakeEyes = t > HIT ? 'angry' : 'open'; o.snakeLook = 1;
      o.snakeUp = t > HIT ? .7 : .35 * ease(seg(t, SNAKE_EYE, SNAKE_EYE + .3));
      if (t > HIT) o.snakeTongue = bump(t, HIT + .4, .1, .3) + bump(t, E0 + .5, .1, .3);
    }
    if (t > PEEK - .2 && t < G0 + .5) { o.snakeUp = .4; o.snakeEyes = 'open'; o.snakeLook = .1; }
    o.sq = (o.sq || 0) + .045 * spring(t, HIT, 7, 30);
    if (t > HIT + .3 && t < E0) {   // the strike: the ember stirs; in the close-up it trembles and the eye OPENS
      const g = ease(seg(t, HUH, CU)), c = ease(seg(t, CU, OPEN));
      o.thirdGlow = .12 + .4 * g + .5 * c; o.thirdShake = .07 * c * (1 - seg(t, OPEN, OPEN + .2));
      o.third = backOut(seg(t, OPEN, OPEN + .12));
      if (t > OPEN) o.thirdGlow = 1;
      o.brow = -.12 * c;
    } else if (t >= E0 && t < CLOSE3[1]) {   // open through the fire and the first caption, then it closes, slowly
      o.third = 1 - ease(seg(t, CLOSE3[0], CLOSE3[1])); o.thirdGlow = lerp(1, .35, seg(t, E0, F0)) * (1 - seg(t, CLOSE3[0], CLOSE3[1]) * .8);
    }
    if (t >= PEEK && t < G0) {   // the peek: one eye opens on us, a brow goes up
      const k = seg(t, PEEK, PEEK + .15);
      if (k > .5) { o.eyes = ['closed', 'normal']; o.lookX = -.15; o.lookY = .1; o.brow = .35; o.mouth = 'smirk'; }
      o.sq = (o.sq || 0) + .04 * spring(t, PEEK + .08, 7, 24);
    }
    return o;
  }

  // ---------------- Kamadeva and his parrot ----------------
  const kEmo = t => emotions(t, [[0, 'cool', { scarf: 1 }], [WINK, 'mischief', { eyes: 'wink', mouth: 'smirk' }], [SNAP + .45, 'smug', { eyes: 'normal', mouth: null, lookX: .3 }],
    [AIM[0], 'determined', { eyes: 'normal', mouth: null, lookX: 1 }], [RELEASE + .1, 'hopeful', { eyes: 'normal', mouth: 'smile', lookX: 1 }],
    [HUH, 'confused', { eyes: 'normal', mouth: 'flat', lookX: 1, emote: '?' }], [E0, 'surprised', { eyes: 'wide', mouth: 'O', lookX: 1 }]], { take: .6 });
  function parrotO(t) {
    if (t < SWOOP[0] || t > FLEE[1]) return null;
    if (t < SWOOP[1]) {   // the swoop in, carrying him
      const k = seg(t, SWOOP[0], SWOOP[1]), p = arcPt([1330, 380], [PR.x, PR.y], -170, easeOut(k));
      return { x: p[0], y: p[1], s: PR.s, flip: true, fly: k < .9, flap: Math.sin(t * 24) * (1 - .6 * k), rot: -.22 * (1 - k), rider: true };
    }
    if (t < HOP[1]) return { x: PR.x, y: PR.y, s: PR.s, flip: true, flap: .5 * spring(t, SWOOP[1], 6, 20), rider: true, eyes: 'normal' };
    if (t < HOP[1] + .8) {   // up to its perch on the ridge
      const k = seg(t, HOP[1], HOP[1] + .8), p = arcPt([PR.x, PR.y], [PERCH.x, PERCH.y], 140, ease(k));
      return { x: p[0], y: p[1], s: lerp(PR.s, PERCH.s, ease(k)), flip: k > .6, fly: k < .95, flap: Math.sin(t * 26) * (1 - k * .8), rot: -.25 * Math.sin(k * Math.PI) };
    }
    const o = { x: PERCH.x, y: PERCH.y, s: PERCH.s, flip: true, eyes: 'normal', look: -.5, tail: .2 * Math.sin(t * 1.3) };
    if (t > SPRING[0] && t < E0) { o.squawk = bump(t, SPRING[0] + .3, .08, .2); o.flap = .4 * bump(t, SPRING[0] + .3, .1, .3); }
    if (t > E0) {   // it squawks and flees
      o.eyes = 'wide'; o.squawk = 1;
      const k = seg(t, FLEE[0], FLEE[1]);
      if (k > 0) { const p = arcPt([PERCH.x, PERCH.y], [1250, 380], 120, easeIn(k)); Object.assign(o, { x: p[0], y: p[1], s: PERCH.s * (1 + k), fly: true, flap: Math.sin(t * 34), flip: false, rot: -.4 }); }
    }
    return o;
  }
  function kamaO(t) {
    if (t < SWOOP[0] || t >= ASH) return null;
    const face = kEmo(t), o = { ...face, ...KMD_SKIN, flip: true, u: KM.u, seed: 4, rot: (face.rot || 0) * .5 };
    if (t < HOP[0]) {   // riding
      const pt = parrotO(t), seat = parrotSeat(pt.x, pt.y, pt.s, pt);
      return { ...o, x: seat[0], y: seat[1], sit: 1, scarf: 1.2, rot: pt.rot || 0, dy: 0 };
    }
    if (t < HOP[1]) {   // hops down
      const pt = parrotO(t), seat = parrotSeat(pt.x, pt.y, pt.s, pt), k = seg(t, HOP[0], HOP[1]);
      const p = arcPt([seat[0], seat[1] + KAMA_SEAT * KM.u], [KM.x, KM.y], 120, ease(k));
      return { ...o, x: p[0], y: p[1], dy: 0, sq: -.12 * Math.sin(k * Math.PI), scarf: 1 };
    }
    o.x = KM.x; o.y = KM.y; o.dy = (o.dy || 0) * .6;
    o.sq = (o.sq || 0) + jump(t, HOP[0], HOP[1], 0).sq;
    // the snap: his free hand (screen right) flicks up by his head
    const sn = ease(seg(t, SNAP - .25, SNAP - .05)) * (1 - ease(seg(t, SNAP + .35, SNAP + .65)));
    if (sn > 0) { o.handL = mixP([-3.5, -5.9], [-3.9, -11.6], sn); o.bendL = 1.1; }
    // the bow: up, a long draw, the release
    o.aim = ease(seg(t, AIM[0], AIM[1])) * (1 - ease(seg(t, HIT + .3, HIT + .8)));
    o.draw = t < RELEASE ? .95 * ease(seg(t, DRAW[0], DRAW[1])) : 0;
    o.arrow = t < RELEASE; if (t >= RELEASE) o.twang = t - RELEASE;
    o.hx = t > AIM[0] && t < HIT + .3 ? .45 : t > HIT + .3 && t < E0 ? .55 : 0;
    if (t > RELEASE && t < E0) o.dx = .25 * ease(seg(t, RELEASE, RELEASE + .3)) - .1 * spring(t, RELEASE, 8, 30);
    if (t >= E0) { o.burn = ease(seg(t, E0 + .3, ASH - .1)); o.aim = 0; o.hx = 0; }
    return o;
  }
  // the flower arrow in flight: from the string to his chest
  const ARROW0 = (() => { let c; return () => c || (c = kamaArrowTip(KM.x, KM.y, KM.u, { flip: true, aim: 1, draw: .95 })); })();
  const CHEST = [SH.x + 6, SH.y - 7.4 * SH.u];
  function arrowAt(t) {
    if (t < RELEASE || t > HIT) return;
    const k = seg(t, RELEASE, HIT), p = arcPt(ARROW0(), CHEST, 70, k), q = arcPt(ARROW0(), CHEST, 70, Math.min(1, k + .02)), a = Math.atan2(q[1] - p[1], q[0] - p[0]);
    boilSeed('flyingarrow');
    glow(p[0], p[1], 70, '#FFB0C4', .7);
    push(); translate(p[0], p[1]); rotate(a); scale(1.35); translate(-6.9 * KM.u, 0); kamaFlowerArrow(KM.u, 1, c => c); pop();
    if (k < .9) for (let i = 1; i < 4; i++) { const r = arcPt(ARROW0(), CHEST, 70, Math.max(0, k - i * .06)); inkLine([[r[0], r[1]], [r[0] + 28, r[1] - 4]], 1, TK.cream, 'inkfine', 0); }
  }

  // ---------------- Parvati ----------------
  const PLATE_IN = [[-1.1, -13.3], [1.1, -13.3]];
  function parvatiO(t) {
    const o = { ...PRV_SKIN, x: PV.x, y: PV.y, u: PV.u, hx: .5, lookX: .9, lookY: .1, eyes: 'normal', mouth: 'smile', blush: .35, seed: 2, handL: PLATE_IN[0], handR: PLATE_IN[1], bendL: .5, bendR: .5 };
    const offer = ease(seg(t, GODS + .3, GODS + .8)) * (1 - ease(seg(t, GODS + 1.8, GODS + 2.3)));
    o.lean = .7 * offer; o.handL = mixP(o.handL, [-.6, -14.6], offer); o.handR = mixP(o.handR, [1.6, -14.6], offer);
    const look = ease(seg(t, SPRING[0] + .2, SPRING[0] + .5)) * (1 - ease(seg(t, SPRING[1] - .1, SPRING[1] + .3)));
    if (look > .5) { o.eyes = 'happy'; o.hx = .1; o.lookY = -.4; }
    o.hx = lerp(o.hx, .1, look);
    if (t > HIT && t < E0) { o.eyes = 'wide'; o.mouth = 'o'; o.blush = 0; o.handR = mixP(o.handR, [.5, -18], ease(seg(t, HIT + .1, HIT + .4))); o.bendR = 1.2; }
    if (t >= E0) {   // the fire: she drops the plate, hands to her cheeks; then quiet
      const k = ease(seg(t, E0 + .05, E0 + .25));
      o.eyes = t < F0 + 1 ? 'wide' : 'normal'; o.mouth = t < F0 + 1 ? 'O' : 'flat'; o.blush = 0; o.hx = .6;
      o.handL = mixP(PLATE_IN[0], [-1.5, -18.2], k); o.handR = mixP(PLATE_IN[1], [1.5, -18.2], k); o.bendL = o.bendR = 1.1;
      o.sq = .1 * spring(t, E0 + .05, 6, 22);
      const dn = ease(seg(t, F0 + .5, F0 + 1.3));
      o.handL = mixP(o.handL, [-1.3, -11.4], dn); o.handR = mixP(o.handR, [1.3, -11.4], dn);
    }
    if (t > TAPAS - .3) {   // tapasya: hands joined, eyes closed, still
      const k = ease(seg(t, TAPAS - .3, TAPAS + .4));
      o.handL = mixP(o.handL, [-.28, -15.1], k); o.handR = mixP(o.handR, [.28, -15.1], k); o.bendL = o.bendR = .9;
      if (k > .5) { o.eyes = 'closed'; o.mouth = 'smile'; o.hx = 0; o.lookX = 0; }
    }
    return o;
  }
  // the thali: in her hands, then dropped when the fire comes (flowers spill on the snow)
  function plateAt(t, o) {
    if (t < E0 + .05) {
      const a = parvatiHand(o.x, o.y, o.u, o, -1), b = parvatiHand(o.x, o.y, o.u, o, 1);
      if (t > HIT && t < E0) return flowerPlate(a[0] + 22, a[1] - 6, 30, .1);
      return flowerPlate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 6, 30, 0);
    }
    const k = seg(t, E0 + .05, E0 + .45), p = arcPt([PV.x + 6, PV.y - 13 * PV.u], [PV.x + 70, PV.y + 30], -30, easeIn(k));
    if (k >= 1) {
      boilSeed('spilled');
      for (let i = 0; i < 6; i++) paint(starPts(PV.x + 30 + i * 22 + 10 * hash(i), PV.y + 40 + 14 * hash(i * 3), 9, .55, 5, i), { wash: [TK.marigold, TK.petal, TK.white][i % 3], ink: TK.ink, sw: .5, curv: .5 });
    }
    flowerPlate(p[0], p[1], 30, lerp(0, .5, k), k);
  }

  // ---------------- spring ----------------
  const FL = []; for (let i = 0; i < 46; i++) {
    const x = 20 + hash(i * 2.31) * 1040, y = GROUND + 18 + hash(i * 4.7) * 330, d = Math.hypot(x - KM.x, (y - KM.y) * 2);
    FL.push({ x, y, s: 30 + 22 * hash(i * 1.1) + (y - GROUND) * .07, kind: i % 4, bloom: SPRING[0] + d / 900, burn: E0 + .3 + d / 1100, i });
  }
  const springK = t => ease(seg(t, SPRING[0], SPRING[1])) * (1 - ease(seg(t, SWEEP0, SWEEP0 + 1.3)));
  const fireK = t => t < HIT ? 0 : t < E0 ? .25 * ease(seg(t, HUH, CU)) : 1 - ease(seg(t, 18.3, 20.2));
  function flowers(t, front) {
    if (t < SPRING[0] || t > E0 + 1.8) return;
    for (const f of FL) if ((f.y >= KM.y) === front) springFlower(f.x, f.y, f.s, seg(t, f.bloom, f.bloom + .35), f.kind, f.i, seg(t, f.burn, f.burn + .3));
  }

  // ---------------- the wide stage ----------------
  function stage(t) {
    const S = { spring: springK(t), fire: fireK(t) };
    tkSky(S);
    stars((1 - S.spring) * (1 - S.fire * .7), t);
    kailash(S);
    tkGround(S);
    if (t > E0 && t < F0) glow(KM.x, KM.y - 120, 600 * (1 - seg(t, 18.4, 20.5)), TK.fire, .5);
    flowers(t, false);
    const sh = shivaO(t), pv = parvatiO(t), km = kamaO(t), pt = parrotO(t);
    if (t > HIT - .05 && t < HIT + .9) glow(CHEST[0], CHEST[1], 260 * (1 - seg(t, HIT, HIT + .9)), '#FFB0C4', .9);
    shiva(SH.x, SH.y, SH.u, { ...sh, boilKey: 'shiva' });
    if (t > TAPAS - .2) glow(PV.x, PV.y - 13 * PV.u, 320 * ease(seg(t, TAPAS - .2, TAPAS + .8)) * (1 + .05 * Math.sin(t * 3)), TK.goldLt, .55);
    parvati(PV.x, PV.y, PV.u, { ...pv, boilKey: 'parvati' });
    plateAt(t, pv);
    if (pt) kamaParrot(pt.x, pt.y, pt.s, { ...pt, only: pt.rider ? 'body' : undefined, boilKey: 'parrot' });
    if (km) kamadeva(km.x, km.y, km.u, { ...km, boilKey: 'kama' });
    if (pt && pt.rider) kamaParrot(pt.x, pt.y, pt.s, { ...pt, only: 'wing', boilKey: 'parrotw' });
    flowers(t, true);
    // the spring's life: bees and a spark at the snap
    if (S.spring > .3) for (let i = 0; i < 3; i++) bee(250 + 520 * frac(hash(i * 3) + t * .07 * (i % 2 ? -1 : 1)), 1290 + 70 * Math.sin(t * 2.2 + i * 2) + i * 60, 26, t, i);
    if (t > SNAP - .05 && t < SNAP + .3) { const hp = kamaHand(KM.x, KM.y, KM.u, kamaO(SNAP), -1); sparkStar(hp[0], hp[1] - 10, 46 * Math.sin(seg(t, SNAP - .05, SNAP + .3) * Math.PI), 'snap'); }
    arrowAt(t);
    petalPuff(CHEST[0], CHEST[1], 230, t - HIT);
    // the fire: the beam from the third eye, Kama ablaze, the wave racing out over the spring, then ash
    if (t >= E0 && t < 18.4) {
      const eye = shivaFace(SH.x, SH.y, SH.u, sh, 'third');
      fireBeam(eye, [KM.x - 10, KM.y - 9 * KM.u], 64 * (1 - ease(seg(t, 17.95, 18.4))) * (.9 + .1 * Math.sin(t * 40)), t);
    }
    if (t > E0 - .01 && t < 19.4) flames(KM.x, KM.y + 6, 360, t, ease(seg(t, E0 + .08, E0 + .5)) * (1 - ease(seg(t, ASH + .25, ASH + 1.1))), 'kamafire');
    if (t > E0 + .3) fireWall(KM.x, (t - E0 - .3) * 1100, t, 1 - seg(t, 18.4, 18.95));
    if (t >= ASH) {
      const hk = t > HEART[0] - .3 && t < BURST + .3 ? ease(seg(t, HEART[0] - .3, HEART[0])) * (1 - seg(t, BURST, BURST + .3)) : 0;
      ashPile(KM.x, KM.y, 92, seg(t, ASH, ASH + .35), t, hk);
      smoke(KM.x + 6, KM.y - 50, 90, t, seg(t, ASH, ASH + .3) * (1 - .7 * seg(t, 20.2, 21.5)));
      emberSparks(KM.x, KM.y - 20, 90, t, 1 - seg(t, 19, 20.5));
    }
    // feathers from the fleeing parrot
    if (t > FLEE[0] && t < 20.5) for (let i = 0; i < 3; i++) {
      const k = seg(t, FLEE[0] + i * .12, 20 + i * .2), x0 = PERCH.x - 40 + i * 30, y0 = PERCH.y;
      feather(x0 - 140 * k + 40 * Math.sin(t * 3 + i), y0 + k * (GROUND + 60 - y0 + i * 20), 50, Math.sin(t * 4 + i) * .7, i);
    }
    // the heart that rises out of the ash and breaks into many, toward us
    if (t > HEART[0] && t < BURST + .9) {
      const k = seg(t, HEART[0], HEART[1]), p = arcPt([KM.x, KM.y - 60], [600, 820], 60, ease(k)), r = lerp(14, 70, ease(k)) * (1 + .08 * pulse(t, 5));
      if (t < BURST) { glow(p[0], p[1], r * 3, '#FF9AB8', .8); boilSeed('bigheart'); paint(heartPts(p[0], p[1], r), { wash: '#F2678A', ink: TK.ink, sw: 1.2 }); }
      else for (let i = 0; i < 9; i++) {
        const q = seg(t, BURST, BURST + .9), a = i / 9 * TAU + .3, d = easeOut(q) * (380 + 120 * hash(i)), hp = [600 + Math.cos(a) * d, 820 + Math.sin(a) * d * .8], hr = lerp(26, 70, q) * (1 - q * q);
        boilSeed('smallheart' + i); paint(heartPts(hp[0], hp[1], hr), { wash: ['#F2678A', '#F4A6B8', '#E2476E'][i % 3], ink: TK.ink, sw: 1 });
      }
    }
    return { S, sh };
  }

  // ---------------- the shots ----------------
  // the wide camera: B → G, one move after another (cuts to the close-up and back are separate shots)
  const CAMK = [
    [B0, [450, 1160, 1.2]], [B0 + 1.3, [540, 980, 1]], [WINK - .2, [540, 980, 1]], [WINK + .1, [760, 1230, 1.3]], [SNAP + .25, [760, 1230, 1.3]], [SPRING[0] + .5, [540, 980, 1]],
    [AIM[0] - .1, [540, 980, 1]], [AIM[1], [610, 1130, 1.08]], [PUSH[0], [600, 1130, 1.08]], [PUSH[1], [SH.x, 1040, 1.6]],
    [E0, [600, 1020, 1.04]], [19.6, [545, 985, 1]],
    [F0, [545, 985, 1]], [F0 + .9, [430, 1050, 1.3]], [ILLUSION, [430, 1050, 1.3]], [ILLUSION + 1, [545, 990, 1]], [REAL, [545, 990, 1]], [REAL + .7, [430, 1045, 1.34]],
    [G0, [430, 1045, 1.34]], [G0 + .7, [545, 990, 1]], [TAPAS - .3, [545, 990, 1]], [TAPAS + .5, [200, 1150, 1.55]],
  ];
  function shotWide(t) {
    const [cx, cy, z] = kf(t, CAMK);
    const sh = t > E0 && t < E0 + .5 ? shakeXY(t, 16 * (1 - seg(t, E0, E0 + .5))) : [0, 0], dr = 6 * Math.sin(t * .45);
    camBegin(cx + sh[0] + dr, cy + sh[1], z * (1 + .004 * Math.sin(t * .3)));
    const { S } = stage(t);
    if (t > GLINT - .2 && t < GLINT + .6) { const e = shivaFace(SH.x, SH.y, SH.u, shivaO(t), 'third'), k = Math.sin(seg(t, GLINT - .2, GLINT + .6) * Math.PI); sparkStar(e[0] + 4, e[1], 30 * k, 'glint'); }
    camEnd();
    petalDrift(t, S.spring);
    snowfall(t, 16, (1 - S.spring) * (t > E0 && t < 20 ? seg(t, 19.4, 20.4) : 1));
    // captions (each one is a no-op outside its life)
    caption('One god found out\nthe hard way.', 560, t - FOUND, { life: 1.65, size: 74 });
    caption('The gods needed Shiva to wake up…\nand marry Parvati.', 560, t - GODS, { life: 1.95, size: 58 });
    caption('So they sent Kamadeva,', 520, t - KAMA_CAP, { life: 1.9, size: 66 });
    caption('the god of love.', 610, t - KAMA_CAP - .25, { life: 1.65, size: 76, color: TK.petal });
    caption('He made spring bloom\non frozen Kailash.', 560, t - SPRING_CAP, { life: 1.8, size: 68 });
    caption("…and shot a flower arrow\nat Shiva's heart.", 560, t - ARROW_CAP, { life: 2.1, size: 64 });
    caption('Kamadeva…', 520, t - ASH_CAP, { life: 1.8, size: 70 });
    caption('burned to ash.', 610, t - ASH_CAP - .3, { life: 1.5, size: 84, color: TK.fireLt });
    caption('But look closer:', 500, t - NEVER, { life: 2.3, size: 62 });
    caption('his eyes never opened.', 590, t - NEVER - .35, { life: 1.95, size: 72, color: TK.goldLt });
    caption('This was NOT anger.', 560, t - ANGER, { life: 1.85, size: 84 });
    caption("Kama's spring was an illusion:\ndesire that pulls you away\nfrom what's real.", 580, t - ILLUSION, { life: 3.05, size: 58 });
    caption('The third eye sees what is REAL…', 520, t - REAL, { life: 2.3, size: 58 });
    caption("…and burns what isn't.", 610, t - REAL - .55, { life: 1.75, size: 74, color: TK.fireLt });
    caption('What would YOUR\nthird eye burn?', 545, t - PEEK_CAP, { life: 2.5, size: 80, color: TK.goldLt });
    caption('Tell us in the comments!', 680, t - PEEK_CAP - .5, { life: 2.0, size: 50 });
    caption('Shiva let Kama live on,\nwithout a body,\nin every heart.', 560, t - (HEART[0] + .1), { life: 2.55, size: 60 });
    caption('And Parvati? She chose tapasya…', 520, t - (TAPAS + .15), { life: 2.25, size: 56 });
    caption('and became Maa Brahmacharini.', 610, t - (TAPAS + .6), { life: 1.8, size: 64, color: TK.goldLt });
    flushLetters();
    // seams: the eye-iris opens from the red (A → B); a white-hot flash in from the close-up (→ E); gold out (→ H)
    if (t < B0 + .75) eyeIris(540, 1040, lerp(10, 5200, easeIn(seg(t, B0, B0 + .75))), TK.red);
    if (t >= E0 && t < E0 + .22) flash(.6 * (1 - seg(t, E0, E0 + .22)), TK.core);
    if (t > GOLD_FLASH[0]) flash(ease(seg(t, GOLD_FLASH[0], GOLD_FLASH[1])), '#FFF3D6');
  }

  // the close-up: A (the hook), the strike (CU → E), H (the blessing)
  function shotCU(t) {
    const strike = t >= CU && t < E0, bless = t >= H0;
    const red = t < B0 ? .25 * Math.sin(t * 2) ** 2 + .75 * ease(seg(t, FLARE, CRACK)) : strike ? ease(seg(t, CU, OPEN)) : 0;
    const gold = bless ? ease(seg(t, GOLD - .2, GOLD + .4)) : 0;
    const sh = strike && t > OPEN ? shakeXY(t, 18 * (1 - seg(t, OPEN, E0) * .5)) : t < B0 && t > FLARE ? shakeXY(t, 5 * seg(t, FLARE, CRACK)) : [0, 0];
    const push = t < B0 ? .03 * t : strike ? .05 * seg(t, CU, E0) : .02 * (t - H0);
    camBegin(540 + sh[0], 1060 + sh[1], 1 + push);
    cuBackdrop(t, red, gold, 540, 1130);
    const o = shivaO(t);
    shiva(CUF.x, CUF.y, CUF.u, { ...o, boilKey: 'shivacu', noShadow: true });
    const eye = shivaFace(CUF.x, CUF.y, CUF.u, o, 'third');
    if (strike && t > FIRE) fireBeam(eye, [W + 300, 1240 + 60 * seg(t, FIRE, E0)], 170 * ease(seg(t, FIRE, FIRE + .12)), t);
    camEnd();
    if (!bless) snowfall(t, 10, (1 - red) * .6);
    // the hook is already up on frame 0
    if (t < B0) {
      caption('WHAT HAPPENS IF SHIVA', 478, t + 1, { life: 3.75, size: 66 });
      caption('OPENS HIS THIRD EYE?', 580, t + 1, { life: 3.75, size: 96, color: TK.fireLt });
      caption('One god found out\nthe hard way.', 560, t - FOUND, { life: 1.65, size: 74 });
    }
    if (bless) caption('Want to see what\nthe third eye sees?', 540, t - (H0 + .15), { life: 1.45, size: 74, color: TK.goldLt });
    // the open flash in the strike, the crack of light at the end of the hook, the gold eye's light out of H
    if (strike) flash(.55 * (1 - seg(t, OPEN, OPEN + .14)) * (t > OPEN ? 1 : 0), '#FFE2C8');
    const E = toScreen(...eye, { cx: 540, cy: 1060, zoom: 1 + push, rot: 0 });
    if (t < B0 && t > CRACK + .1) { const h = lerp(40, 5400, easeIn(seg(t, CRACK + .1, RED_FULL))); glow(E[0], E[1], Math.min(h * .5, 900), TK.fire, .9); eyeFill(E[0], E[1], h, TK.red); }
    flushLetters();
    if (bless && t > ALMOND[0]) { const h = lerp(40, 5400, easeIn(seg(t, ALMOND[0], ALMOND[1]))); glow(E[0], E[1], Math.min(h * .6, 1000), TK.goldLt, .9); eyeFill(E[0], E[1], h, TK.peach); }
    if (bless && t < H0 + .3) flash(1 - seg(t, H0, H0 + .3), '#FFF3D6');
  }

  // the card
  function shotCard(t) {
    endCard(t, CARD, 'book2', ['book1', 'book3']);
    caption("Parvati's tapasya is Book 2!", 512, t - (CARD.book - .05), { life: 1.0, size: 62, color: TK.rkOrange, stroke: TK.cream });
    const k = frac((t - CARD.follow) / 1.6);
    if (t > CARD.follow) { flushLetters(); boilSeed('sparkle'); paint(starPts(lerp(300, 720, k), lerp(1040, 660, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
    if (t < CARD0 + .2) { flushLetters(); flash(1 - seg(t, CARD0, CARD0 + .2), TK.peach); }
  }

  shots([[0, shotCU], [B0, shotWide], [CU, shotCU], [E0, shotWide], [H0, shotCU], [CARD0, shotCard]]);
})();
