// "The Cosmic Wi-Fi Battle": on Kailash, Kartikeya's VR game and Bal Bappa's 4K modak tutorial buffer at the same
// moment, the brothers fight over the router's antennas, and the Wi-Fi dies: Shiva has unplugged it, and Vasuki
// slurps the cord up like a noodle. 28 s, 1080×1920 (a vertical reel).
// Storyboard: STORYBOARD.md. Set and props: wifi_props.js. Sound: tools/wifi_sfx.mjs.
//
// Every pose is a pure function of film time (kartiO, bappaO, shivaO, routerAt, cordPts), and stage(t) draws the whole
// world from them, so the shots only choose a camera, captions and their transitions.
(() => {
  const ST = STAGE;
  // times (film seconds); the SFX cue list uses the same numbers
  const FRZ_K = 4.6, TAP_K = [4.95, 5.2], FRZ_G = 5.35, TAP_G = [5.7, 5.95], VR_UP = 6.05, TURN = 6.2, GLARE = [6.45, 7.05],
    EYES_R = 7.15, CROUCH = 7.55, HOP = [7.75, 8.3], GRAB = 8.35, KP = [9.0, 9.5, 10.0], GP = [10.5, 11.0, 11.5], ALL = 12.0,
    DARK = 14.2, LOOKD = 15.0, JIG = 15.3, ACC = 15.9, FOL = 16.55, WHIP = [17.2, 17.6], LOWER = [19.9, 20.35],
    SLURP = [20.4, 21.35], DRAG = 20.55, THUD = 21.35, GULP = 21.5, JAW = 21.95, PEEK = 22.95, SNAP = 23.55, STING = 25.0,
    BPEEK = 25.3, SLIDE = 25.75, SHUT = 26.15, CRT = [27.25, 27.95], END = 28;

  // emotions() cross-fades body colours from feel(), which default to Clawd's clay: give every key the character's own
  const skinKeys = (keys, c) => keys.map(([k, n, o]) => [k, n, { ...c, ...(o || {}) }]);
  const emo = c => (t, keys, o) => emotions(t, skinKeys(keys, c), o);
  const sEmo = emo(SHV_SKIN), kEmo = emo(KAR_SKIN), gEmo = emo({ col: BAL.skin, dk: BAL.skinDk, lt: BAL.skinLt });
  const bump = (t, t0, a = .1, b = .25) => seg(t, t0 - a, t0) * (1 - seg(t, t0, t0 + b));   // 0 → 1 → 0 around t0
  const bumps = (t, evs, a, b) => evs.reduce((m, e) => Math.max(m, bump(t, e, a, b)), 0);
  const allK = t => t < DARK ? ease(seg(t, ALL, ALL + .5)) : 1;   // how all-out the tug is

  // ---------------- the tug: which way the router is going ----------------
  // L: -1 toward Kartikeya … +1 toward Bappa. Three yanks each on the beat (each holds), then all-out: back and forth,
  // faster and faster. Frozen at the blackout.
  function tugL(t) {
    t = Math.min(t, DARK);
    if (t < ALL) return kf(t, [[GRAB, 0], [8.95, 0], [9.07, -.45], [9.45, -.45], [9.57, -.8], [9.95, -.8], [10.07, -1.1], [10.45, -1.1],
      [10.57, -.55], [10.95, -.55], [11.07, .15], [11.45, .15], [11.57, .8], [12, .8]], backOut);
    const a = t - ALL;
    return .8 * (1 - ease(seg(t, ALL, ALL + .4))) + (.35 + .2 * seg(t, ALL, DARK)) * Math.sin(TAU * (1.8 * a + .3 * a * a)) * ease(seg(t, ALL, ALL + .3));
  }
  // the router: sits on its stool, lurches with the tug, and is dragged along the floor to Shiva by the cord
  function routerAt(t) {
    const x0 = ST.rX + 42 * tugL(t);
    if (t < DRAG) return { x: x0, y: ST.rY, drag: 0 };
    const k = seg(t, DRAG, THUD), kk = k * k, x = lerp(x0, 1380, kk);
    const y = lerp(ST.rY, 1488, easeIn(seg(k, 0, .12)));   // it drops off the stool straight away
    return { x, y: y - 6 * Math.abs(spring(t, THUD, 7, 22)), drag: t < THUD ? k : 0 };
  }
  const bothWon = t => ({ k: t > 9.05 && t < 10.5 || (t > ALL && t < DARK && tugL(t) < -.1), g: t > 11.05 && t < ALL || (t > ALL && t < DARK && tugL(t) > .1) });

  // ---------------- Kartikeya ----------------
  function kartiO(t) {
    const keys = [[0, 'excited', { mouth: 'grin' }], [FRZ_K + .05, 'confused', { mouth: 'o' }], [VR_UP + .12, 'suspicious', { lookX: 1 }],
      [GLARE[0], 'angry', { lookX: 1, emote: null }], [EYES_R, 'determined', { lookX: .7, lookY: .6 }], [9.1, 'smug', { lookX: 1, emote: null }],
      [10.6, 'surprised', { lookX: 1 }], [11.15, 'angry', { lookX: 1, emote: null }], [ALL, 'determined', { eyes: 'squeeze', mouth: 'teeth', emote: 'steam' }],
      [DARK + .02, 'surprised', { eyes: 'blank', mouth: 'o', emote: null }], [LOOKD, 'confused', { lookX: .7, lookY: 1, emote: null }],
      [ACC, 'angry', { lookX: 1, emote: 'anger' }], [FOL, 'neutral', { lookX: 1, lookY: -.7, mouth: 'o' }],
      [DRAG - .1, 'scared', { emote: null }], [THUD + .05, 'dizzy'], [JAW, 'surprised', { eyes: 'wide', mouth: 'O', lookX: 1, lookY: -1, emote: '!!' }],
      [SNAP, 'nervous', { eyes: 'closed', mouth: 'flat', emote: 'sweat' }]];
    const o = { ...kEmo(t, keys, { take: .8 }) };
    let x = ST.kX, y = ST.kY, dy = o.dy || 0;
    const r = routerAt(t), aK = allK(t);
    o.vrUp = ease(seg(t, VR_UP, VR_UP + .22)); o.vrLit = t < FRZ_K ? 1 : t < VR_UP ? .5 : 0; o.vrFrozen = t > FRZ_K && t < VR_UP;
    if (t < FRZ_K + .15) {   // A: gaming, the vel is his controller, swung on the beat
      const tt = Math.min(t, FRZ_K + .15 * seg(t, FRZ_K, FRZ_K + .15)), b = bpOf(tt);
      o.aR = .55 + .35 * Math.sin(b * Math.PI); o.spearA = -.35 + .7 * Math.sin(b * Math.PI + .6); o.aL = .25 + .15 * Math.sin(b * Math.PI * .5);
      o.aim = Math.sin(b * Math.PI + .6);
    } else if (t < HOP[0]) {   // B: frozen, bonks the headset with his shield hand, pushes it up, glares
      o.aR = .55 + .35 * Math.sin(bpOf(FRZ_K) * Math.PI); o.spearA = -.35 + .7 * Math.sin(bpOf(FRZ_K) * Math.PI + .6);
      o.aL = lerp(.25, -1.3, ease(seg(t, FRZ_K + .1, FRZ_K + .3)));
      for (const b of TAP_K) o.aL = lerp(o.aL, 1.45, bump(t, b, .1, .12));
      o.aL = lerp(o.aL, 1.5, bump(t, VR_UP + .1, .12, .25));
      if (t > VR_UP + .3) { o.aR = lerp(o.aR, -.2, ease(seg(t, VR_UP + .3, VR_UP + .6))); o.spearA = lerp(o.spearA, 0, ease(seg(t, VR_UP + .3, VR_UP + .6))); }
      o.hx = .45 * ease(seg(t, TURN, TURN + .5));
      o.sq = (o.sq || 0) + .06 * bumps(t, TAP_K, .05, .15) + .2 * ease(seg(t, CROUCH, HOP[0]));   // bonk; the crouch
    }
    if (t > HOP[0]) {   // the hop to the router, then the tug
      const tx = r.x - 280 - 30 * aK + 65 * ease(seg(t, DRAG, THUD + .1));
      if (t < HOP[1]) {
        const k = seg(t, HOP[0], HOP[1]), p = arcPt([ST.kX, ST.kY], [ST.rX - 280, ST.kY], 120, k);
        x = p[0]; y = p[1]; dy = 0; o.sq = -.14 * Math.sin(k * Math.PI); o.aR = lerp(-.2, .05, k); o.spearA = lerp(0, 1.3, ease(k)); o.aL = .8; o.hx = .3;
      } else {
        x = tx; o.hx = .25;
        const land = jump(t, HOP[0], HOP[1], 0); o.sq = (o.sq || 0) + land.sq;
        // pulling: lean back, arm forward, vel tipped over to hook the antenna; the shield arm flails
        const myYank = bumps(t, KP, .05, .3), dragged = bumps(t, GP, .03, .35), td = Math.min(t, DARK);
        const relax = t > DARK ? ease(seg(t, DARK + .5, DARK + .9)) : 0, jig = bump(t, JIG, .06, .2);
        o.rot = -(.18 + .13 * myYank - .09 * dragged + .14 * aK * (.7 + .3 * Math.sin(td * 17))) * (1 - .5 * relax) - .1 * jig;
        o.aR = .05; o.spearA = 1.3 + .12 * aK; o.aL = .75 + .45 * Math.sin(td * 9) * (1 - relax);
        o.sq = (o.sq || 0) + .07 * myYank - .04 * dragged;
        if (t > ALL && t < DARK) o.walk = t * 5;
        if (t > DARK && t < DARK + .5) o.aL = .75 + .45 * Math.sin(DARK * 9);   // frozen in the dark
        o.tint = 'flush'; o.tintK = .7 * aK * (t < DARK + .6 ? 1 : 1 - seg(t, DARK + .6, DARK + 1));
        if (t > r.drag * 0 + DRAG && t < THUD) {   // dragged: leaning way back, heels skidding
          o.rot = -.32 + .03 * Math.sin(t * 40); o.aL = 1.3 + .2 * Math.sin(t * 30);
        }
        if (t > THUD) { o.rot = lerp(-.32, -.05, ease(seg(t, THUD, THUD + .3))); o.sq = (o.sq || 0) + .12 * spring(t, THUD, 6, 20); o.aL = lerp(1.3, -.4, ease(seg(t, THUD, THUD + .4))); }
        if (t > JAW - .1) { o.rot = 0; o.aL = lerp(-.4, .3, ease(seg(t, JAW, JAW + .2))); }
        if (t > SNAP) {   // lets go and stands stiff, eyes shut: meditating, honest
          const k = ease(seg(t, SNAP, SNAP + .15));
          o.aR = lerp(.05, -1.3, k); o.spearA = lerp(1.3, 0, k); o.aL = lerp(.3, -1.3, k); o.hx = 0; o.rot = 0;
          o.sq = (o.sq || 0) - .08 * bump(t, SNAP + .08, .08, .2);
        }
      }
    }
    o.x = x; o.y = y; o.dy = dy; o.u = ST.kU;
    o.head = (u, sw) => vrHeadset(u, sw, { up: o.vrUp, lit: o.vrLit, frozen: o.vrFrozen });
    return o;
  }
  const holding = t => t > GRAB - .05 && t < SNAP;

  // ---------------- Bal Bappa ----------------
  // He faces left (flip) the whole film; his keys are written in screen terms and mirrored at the end.
  function bappaO(t) {
    const keys = [[0, 'happy', { lookX: .2, lookY: -1, mouth: 'grin' }], [2.75, 'love', { lookY: -1 }], [FRZ_G + .05, 'confused', { lookY: -1, lookX: .1, mouth: 'o' }],
      [TURN + .05, 'suspicious', { lookX: -1 }], [GLARE[0], 'angry', { lookX: -1, emote: null }], [EYES_R, 'determined', { lookX: -.7, lookY: .6 }],
      [9.1, 'nervous', { lookX: -1, emote: 'sweat' }], [10.6, 'determined', { lookX: -1, emote: null }], [11.15, 'smug', { lookX: -1 }],
      [ALL, 'determined', { eyes: 'squeeze', mouth: 'teeth', emote: 'steam' }], [DARK + .02, 'surprised', { eyes: 'blank', mouth: 'o', emote: null }],
      [LOOKD, 'confused', { lookX: -.7, lookY: 1, emote: null }], [ACC, 'angry', { lookX: -1, emote: 'anger' }], [FOL, 'neutral', { lookX: 1, lookY: -.7, mouth: 'o' }],
      [DRAG - .1, 'scared', { emote: null }], [THUD + .05, 'dizzy'], [JAW, 'surprised', { mouth: 'O', lookX: 1, lookY: -1, emote: '!!' }],
      [SNAP, 'nervous', { eyes: 'closed', mouth: 'flat', emote: 'sweat' }], [BPEEK, 'mischief', { eyes: ['closed', 'wide'], lookX: -1, lookY: .7, mouth: 'smirk', emote: null }],
      [SHUT, 'nervous', { eyes: 'closed', mouth: 'wobble', emote: 'sweat' }]];
    const o = { ...gEmo(t, keys, { take: .8 }), flip: true, trunk: 'rest', stand: 0 };
    let x = ST.gX, y = ST.gY, dy = o.dy || 0, snack = null;   // snack = the modak in his hand: { bite }
    const r = routerAt(t), aK = allK(t);
    if (t < HOP[0]) {
      // A: eating along with the tutorial, a modak to the mouth every two beats; B: stops halfway, jabs his trunk at the TV
      const tt = Math.min(t, FRZ_G), b = bpOf(tt) / 2, ph = frac(b);
      o.aR = .35 + .75 * Math.sin(ph * Math.PI) ** 2; o.aL = 0;
      snack = { bite: t < FRZ_G ? clamp((ph - .45) * 3) * .6 : .3 };
      if (t > FRZ_G) {
        o.trunk = 'rest'; o.trunk2 = 'up'; o.trunkK = ease(seg(t, TAP_G[0] - .25, TAP_G[0])) * (1 - ease(seg(t, TURN - .1, TURN + .2)));
        o.trunkTap = bumps(t, TAP_G, .08, .12);
      }
      o.hx = -.45 * ease(seg(t, TURN, TURN + .5));
      o.sq = (o.sq || 0) + .2 * ease(seg(t, CROUCH, HOP[0]));
    }
    if (t > HOP[0]) {
      o.stand = 1;
      const tx = r.x + 195 + 30 * aK;
      if (t < HOP[1]) {
        const k = seg(t, HOP[0], HOP[1]), p = arcPt([ST.gX, ST.gY], [ST.rX + 195, ST.gY], 140, k);
        x = p[0]; y = p[1]; dy = 0; o.sq = -.14 * Math.sin(k * Math.PI); o.aL = 1; o.aR = 1.1; o.trunk = 'rest'; o.trunk2 = 'hold'; o.trunkK = ease(k);
        snack = k < .3 ? { bite: .3, fly: k } : null;
      } else {
        x = tx; o.trunk = 'hold'; o.hx = -.3;
        const land = jump(t, HOP[0], HOP[1], 0); o.sq = (o.sq || 0) + land.sq;
        const myYank = bumps(t, GP, .05, .3), dragged = bumps(t, KP, .03, .35), td = Math.min(t, DARK);
        const relax = t > DARK ? ease(seg(t, DARK + .5, DARK + .9)) : 0, jig = bump(t, JIG + .12, .06, .2);
        o.rot = (.16 + .13 * myYank - .09 * dragged + .14 * aK * (.7 + .3 * Math.sin(td * 15 + 1))) * (1 - .5 * relax) + .08 * jig;
        o.aL = .45 + .1 * Math.sin(td * 7); o.aR = .6 + .15 * Math.sin(td * 7 + 1); o.ear = .3 * myYank + .5 * aK * (1 - relax);
        o.sq = (o.sq || 0) + .07 * myYank - .04 * dragged;
        if (t > ALL && t < DARK) o.walk = t * 5 + .3;
        o.tint = 'flush'; o.tintK = .7 * aK * (t < DARK + .6 ? 1 : 1 - seg(t, DARK + .6, DARK + 1));
        if (t > ACC && t < FOL + .2) { o.aR = lerp(o.aR, .05, ease(seg(t, ACC, ACC + .15))); o.aL = -1; }   // jabs a finger at his brother
        if (t > DRAG && t < THUD) { o.rot = .3 + .03 * Math.sin(t * 38); o.aL = 1.2; o.aR = 1.3; o.ear = .9; }
        if (t > THUD) { o.rot = lerp(.3, .04, ease(seg(t, THUD, THUD + .3))); o.sq = (o.sq || 0) + .14 * spring(t, THUD, 6, 18); o.aL = .3; o.aR = .3; o.ear = .3 * (1 - seg(t, THUD, THUD + .5)); }
        if (t > JAW - .1) { o.rot = 0; o.ear = .8 * bump(t, JAW + .1, .1, .6); }
        if (t > SNAP) {   // lets go, plops down cross-legged, hands on his knees, eyes shut
          const j = jump(t, SNAP, SNAP + .22, .8);
          o.stand = t < SNAP + .16 ? 1 : 0; dy += j.dy; o.sq = (o.sq || 0) + j.sq; o.trunk = 'rest'; o.aL = 0; o.aR = 0; o.hx = 0; o.rot = 0;
        }
      }
    }
    if (snack) o.armR = (u, sw) => { if (snack.fly == null) modak(0, .45 * u, 1.3 * u, snack.bite); };
    // screen-space keys → his mirrored drawing
    o.lookX = -(o.lookX || 0); o.hx = -(o.hx || 0);
    o.x = x; o.y = y; o.dy = dy; o.u = ST.gU; o.snack = snack;
    return o;
  }

  // ---------------- Shiva ----------------
  function shivaO(t) {
    const keys = [[0, 'serene'], [PEEK, 'serene', { eyes: ['normal', 'closed'], lookX: -1, lookY: .7, mouth: 'flat', brow: -.1 }],
      [SNAP + .5, 'serene', { mouth: 'smile' }], [SLIDE, 'serene', { eyes: ['normal', 'closed'], lookX: -1, lookY: .55, mouth: 'flat' }],
      [SHUT + .45, 'serene', { mouth: 'smile' }]];
    const o = { ...sEmo(t, keys, { take: .25 }) };
    // the plug hangs from his left hand (screen left), pinched in the mudra, from the blackout on; then he feeds it to Vasuki
    const hold = [-7.1, -5.6], feed = [-6.4, -9.6], rest = [-5.6, -3.55];
    if (t > DARK - .3 && t < SLURP[0] + .6) {
      o.handL = t < LOWER[0] ? hold : t < SLURP[0] ? kf(t, [[LOWER[0], hold], [LOWER[1], feed]], ease) : kf(t, [[SLURP[0], feed], [SLURP[0] + .6, rest]], ease);
      o.bendL = 1.3; o.mudra = false;
    }
    // Vasuki: asleep; wakes for the plug, takes it, slurps, gulps, licks his lips
    let up = 0, eyes = 'closed', tongue = 0;
    if (t > LOWER[0] - .1) {
      eyes = 'open'; up = .35 * ease(seg(t, LOWER[0], LOWER[1]));
      tongue = t > LOWER[0] + .1 && t < LOWER[1] - .05 ? .5 + .5 * Math.sin(t * 40) : 0;
      if (t > SLURP[0]) { up = .35 + .12 * Math.sin((t - SLURP[0]) * TAU * 5) * (1 - seg(t, SLURP[1] - .1, SLURP[1])); eyes = 'happy'; }
      if (t > GULP) { up = .35 + .2 * bump(t, GULP + .1, .1, .3); eyes = t < GULP + .5 ? 'open' : 'happy'; }
      if (t > GULP + .55 && t < GULP + .95) tongue = .6 + .4 * Math.sin(t * 30);
      if (t > JAW + .3) up = lerp(.35, 0, ease(seg(t, JAW + .3, JAW + 1))), eyes = t < JAW + 1 ? 'happy' : 'closed';
    }
    Object.assign(o, { snakeUp: up, snakeEyes: eyes, snakeTongue: tongue, snakeLook: -1 });
    return o;
  }

  // ---------------- the cord ----------------
  // router → up the wall behind it → clipped along the wall → the socket (before the blackout) / his hand / Vasuki
  function cordPts(t, sh) {
    const r = routerAt(t), port = routerPort(r.x, r.y, ST.rS);
    let end, via = [[1400, 1110]];
    if (t < DARK) { end = [ST.sockX, ST.sockY - 50]; via = [[1400, 1100]]; }
    else if (t < LOWER[1]) { const h = shivaHand(ST.shX, ST.shY, ST.shU, sh, -1); end = [h[0], h[1] + 8]; via = [[1400, 1140], [lerp(1400, h[0], .6), h[1] + 60]]; }
    else end = vasukiMouth(ST.shX, ST.shY, ST.shU, sh);
    const run = [port, [port[0] + 30, port[1] + 10], [612, 1250], [612, ST.runY], ...ST.clips.slice(1).map(x => [x, ST.runY]), ...via, end];
    if (t < SLURP[0]) return { pts: run, clips: ST.clips.map(x => [x, ST.runY]), end };
    // slurping: the clips pop off right to left, and the cord goes from slack to a taut line from the router to his mouth
    const pop = i => SLURP[0] + (3 - i) * .06, clips = ST.clips.map((x, i) => [x, ST.runY, i]).filter(c => t < pop(c[2]));
    const w = ease(seg(t, SLURP[0], SLURP[0] + .3)), sag = 90 * (1 - ease(seg(t, SLURP[0] + .2, DRAG + .25))) + 8;
    const N = 24, A = resample(run, N), B = [];
    for (let i = 0; i < N; i++) { const k = i / (N - 1); B.push([lerp(port[0], end[0], k), lerp(port[1], end[1], k) + sag * Math.sin(k * Math.PI)]); }
    return { pts: A.map((p, i) => [lerp(p[0], B[i][0], w), lerp(p[1], B[i][1], w)]), clips, end };
  }

  // ---------------- the stage ----------------
  function stage(t, o = {}) {
    const dark = t > DARK ? 1 : 0, r = routerAt(t), won = bothWon(t);
    const k = kartiO(t), g = bappaO(t), sh = shivaO(t);
    room(t, { dark });
    // the rivalry, in light: teal on his side, saffron on Bappa's
    if (!dark) { glow(260, 1250, 620, WB.tealGlow, t < FRZ_K ? .35 : .18); glow(830, 1250, 620, WB.saffGlow, t < FRZ_G ? .35 : .18); }
    stool(ST.rX, ST.rY, 150);
    // screens: the hologram and the TV freeze at their own moments; in the tug the winner's comes back for a beat
    const holoFrozen = t < FRZ_K ? 0 : t > GRAB && won.k ? 0 : 1, tvFrozen = t < FRZ_G ? 0 : t > GRAB && won.g ? 0 : 1;
    const holoOn = dark ? 0 : t < VR_UP + .15 ? 1 : t > GRAB ? (won.k ? 1 : .8) : 1;
    tv(ST.tvX, ST.tvY, ST.tvW, ST.tvH, t, { frozen: tvFrozen, gameT: tvFrozen ? Math.min(t, FRZ_G) : t, off: dark });
    // the hologram is projected from his visor; once he pushes it up it projects from his forehead, still spinning
    const visor = bodyWorld(k.x, k.y, k.u, k, (k.hx || 0) * 1.4, lerp(-12.2, -14.7, k.vrUp));
    if (holoOn > 0) { holoBeam(visor, ST.holoX, ST.holoY, ST.holoW, ST.holoH, holoOn * (1 - .4 * holoFrozen)); hologram(ST.holoX, ST.holoY, ST.holoW, ST.holoH, t, { on: holoOn, frozen: holoFrozen, gameT: holoFrozen ? Math.min(t, FRZ_K) : t, aim: k.aim ?? 0 }); }
    // the cord, behind everyone until it's being slurped
    const C = cordPts(t, sh);
    const plugged = t < DARK;
    if (t < LOWER[1]) cord(C.pts, { clips: C.clips });
    if (plugged) plug(ST.sockX, ST.sockY - 52, 50, 0);
    // the router and its fan
    const heat = t < DARK ? ease(seg(t, ALL + .3, DARK)) : 0, L = tugL(t);
    const tipL = holding(t) && t > GRAB ? kartiHook(k.x, k.y, k.u, k) : null, tipR = holding(t) && t > GRAB ? balTrunkTip(g.x, g.y, g.u, g) : null;
    const boing = t > SNAP ? spring(t, SNAP, 4, 22) : t > GRAB ? 0 : 0;
    router(r.x, r.y, ST.rS, { power: dark ? 0 : 1, heat, tipL, tipR, shake: t > ALL && t < DARK ? 3 * heat : 0, boingL: boing, boingR: -boing * .8 });
    if (!dark) {
      const bars = t < 4.5 ? 3 - .15 * (1 - pulse(t, 3)) : t < GRAB ? 1 + .3 * Math.sign(Math.sin(t * 23)) : t < ALL ? 2.2 + .6 * pulse(t, 4) : 3;
      const col = mixCol(mixCol(WB.goldLt, WB.tealLt, clamp(-L * 1.2)), WB.saffLt, clamp(L * 1.2));
      wifiArcs(r.x, r.y - .62 * ST.rS, ST.rS * (t > GRAB - .3 ? .8 : 1), { bars, lean: t > GRAB ? .6 * L : 0, spin: t > ALL ? (t - ALL) * (3 + (t - ALL) * 2) : 0, col: mixCol(col, WB.hot, heat), glowCol: heat > .5 ? WB.hot : WB.gold });
      if (heat > .02) glow(r.x, r.y - 60, 300 + 300 * heat, WB.hot, .6 * heat);
      // packets to the screens, while they're streaming
      const led = [r.x, r.y - .62 * ST.rS];
      dataFlow(led, [ST.holoX + 60, ST.holoY + ST.holoH / 2], t, WB.tealLt, t < FRZ_K ? 1 : won.k && t > GRAB ? .8 : 0, 'k');
      dataFlow(led, [ST.tvX - 40, ST.tvY + ST.tvH / 2 + 10], t + .37, WB.saffLt, t < FRZ_G ? 1 : won.g && t > GRAB ? .8 : 0, 'g');
    }
    modakPlate(ST.plateX, ST.plateY, 64, 5);
    // Shiva, only when the camera can see him
    if (o.shiva) {
      if (t > LOWER[1]) {   // slurping: the cord runs over his lap into Vasuki's mouth
        shiva(ST.shX, ST.shY, ST.shU, { ...sh, boilKey: 'shiva' });
        cord(C.pts, { clips: C.clips });
        if (t > GULP && t < GULP + .5) gulpLump(t, sh);
      } else {
        shiva(ST.shX, ST.shY, ST.shU, { ...sh, boilKey: 'shiva' });
        if (!plugged) { const h = shivaHand(ST.shX, ST.shY, ST.shU, sh, -1); plug(h[0], h[1] + 12, 58, .15 * Math.sin(t * 2.2) + .2 * spring(t, LOWER[0], 3, 12)); }
      }
    }
    // the kids
    kartikeya(k.x, k.y, k.u, { ...k, boilKey: 'karti' });
    balBappa(g.x, g.y, g.u, { ...g, boilKey: 'bappa' });
    if (t > HOP[0] - .05 && t < HOP[1] && g.snack && g.snack.fly != null) {   // his half-eaten modak goes flying back onto the plate
      const f = seg(t, HOP[0], HOP[0] + .3), h0 = [ST.gX - 90, ST.gY - 150], p = arcPt(h0, [ST.plateX + 10, ST.plateY - 30], 90, f);
      boilSeed('flying modak'); modak(p[0], p[1], 27, .3);
    }
    // marks
    if (t > GLARE[0] && t < GLARE[1]) glareBolt(faceOf(k, 'k'), faceOf(g, 'g'), ease(seg(t, GLARE[0], GLARE[0] + .15)) * (1 - seg(t, GLARE[1] - .1, GLARE[1])), 'a');
    if (t > ACC + .05 && t < ACC + .5) glareBolt(faceOf(k, 'k'), faceOf(g, 'g'), ease(seg(t, ACC + .05, ACC + .15)) * (1 - seg(t, ACC + .4, ACC + .5)), 'b');
    if (heat > .3 && t < DARK) sparks(r.x, r.y - 60, 110, heat, 'r');
    if (t > DRAG && t < THUD + .1) {
      speedLines(k.x - 60, k.y - 150, 240, 260, 1 - seg(t, THUD, THUD + .1), 'k');
      for (let i = 0; i < 4; i++) { dust(k.x - 20, k.y + 5, 26, ((t - DRAG - i * .15) % .6 + .6) % .6, 'k' + i); dust(g.x + 30, g.y + 5, 26, ((t - DRAG - i * .15 - .07) % .6 + .6) % .6, 'g' + i); }
    }
    return { k, g, sh, r };
  }
  // a point between a kid's eyes, in world space
  function faceOf(o, who) {
    if (who === 'k') return bodyWorld(o.x, o.y, o.u, o, (o.hx || 0) * 1.4, -12.2);
    return bodyWorld(o.x, o.y, o.u, o, (o.hx || 0) * 1.4, -9.2 - 2.6);
  }
  // the gulp: a lump sliding down Vasuki's neck into his coil
  function gulpLump(t, sh) {
    const k = ease(seg(t, GULP, GULP + .45)), m = vasukiMouth(ST.shX, ST.shY, ST.shU, sh);
    const L = [[m[0], m[1] + 10], [ST.shX - 4.4 * ST.shU, ST.shY - 10.2 * ST.shU], [ST.shX - 3.4 * ST.shU, ST.shY - 8.8 * ST.shU], [ST.shX - 1.5 * ST.shU, ST.shY - 8.1 * ST.shU]];
    const p = resample(L, 20)[Math.min(19, Math.floor(k * 19))];
    boilSeed('lump');
    paint(ellPts(p[0], p[1], 20, 17, 12), { wash: SHV.snake, fill: SHV.snakeDk, fillOp: 60, ink: SHV.ink, sw: .8 });
  }

  // ---------------- text overlays ----------------
  // A label pinned under a world point (a screen, a character): the reel caption's look, smaller, in that brother's
  // colour, kept inside Instagram's safe zone. Call it while the shot's camera is active.
  function tag(txt, wx, wy, age, o = {}) {
    const life = o.life ?? 1.4; if (age < 0 || age > life) return;
    const [sx, sy] = toScreen(wx, wy), mw = o.maxW ?? 480;
    caption(txt, sy, age, { life, size: o.size ?? 46, color: o.color, maxW: mw, x: clamp(sx, 40 + mw / 2, SAFE.right - mw / 2), rot: o.rot ?? -.02 });
  }
  // every overlay after the hook, by film time: what each brother is doing, the buffer, the tug, the blackout, the
  // reveal, the button. The sting is drawn by the last shot.
  function overlays(t, s) {
    const K = WB.tealLt, G = WB.saffLt, underHolo = ST.holoY + ST.holoH / 2 + 62, underTv = ST.tvY + ST.tvH / 2 + 62;
    tag('Kartikeya:\nVR boss fight', ST.holoX, underHolo + 30, t - 1.0, { life: 1.45, color: K, size: 58, maxW: 520 });
    tag('Ganesha: 4K YouTube tutorial\n“How to make 10,000 modaks”', ST.tvX - 60, underTv + 40, t - 2.45, { life: 1.65, color: G, maxW: 780, size: 54 });
    tag('buffering…', ST.holoX, underHolo, t - (FRZ_K + .1), { life: GLARE[0] - FRZ_K - .2, color: K, size: 54, maxW: 340 });
    tag('buffering…', ST.tvX, underTv, t - (FRZ_G + .1), { life: GLARE[0] - FRZ_G - .2, color: G, size: 54, maxW: 340 });
    caption('“Who\'s hogging the Wi-Fi?!”', 520, t - GLARE[0], { life: EYES_R + .35 - GLARE[0], size: 64 });
    caption('Tug-of-Wi-Fi.', 520, t - (GRAB + .02), { life: .95, size: 84 });
    tag('back online!', ST.holoX, underHolo, t - 9.3, { life: 1.1, color: K, size: 56, maxW: 380 });
    tag('back online!', ST.tvX, underTv, t - 11.1, { life: .85, color: G, size: 56, maxW: 380 });
    caption('No signal.', 520, t - (DARK + .25), { life: 1.45, size: 88 });
    caption('Dad unplugged it.\nHe just wanted to meditate.', 480, t - 18.7, { life: 1.65, size: 62 });
    if (s.sh && t > SLURP[0] && t < GULP + .8) {
      const m = vasukiMouth(ST.shX, ST.shY, ST.shU, s.sh), [mx, my] = toScreen(m[0], m[1]);
      sfx('SLURRRP!', clamp(mx - 150, 170, SAFE.right - 190), clamp(my - 170, SAFE.top + 60, SAFE.bottom - 60), 76, '#C3E6CA', t - (SLURP[0] + .05), { screen: true, life: .9, stroke: WB.ink, sw: .2, ink: false });
      sfx('gulp.', clamp(mx - 110, 120, SAFE.right - 100), clamp(my - 60, SAFE.top + 60, SAFE.bottom - 60), 70, '#C3E6CA', t - GULP, { screen: true, life: .75, stroke: WB.ink, sw: .2, ink: false });
    }
    caption('Suddenly… very spiritual.', 520, t - (SNAP + .1), { life: STING - SNAP - .2, size: 66 });
  }

  // ======================= A · 0–4.4 · the setup: both brothers streaming =======================
  function setup(t, lt) {
    const cx = kf(t, [[0, 520], [.8, 520], [1.5, 410], [2.2, 405], [2.9, 685], [3.6, 690], [4.4, 545]]);
    const cy = kf(t, [[0, 1300], [.8, 1280], [1.5, 985], [2.2, 980], [2.9, 985], [3.6, 980], [4.4, 965]]);
    const z = kf(t, [[0, 1.55], [.8, 1.5], [1.5, 1.34], [2.2, 1.36], [2.9, 1.34], [3.6, 1.36], [4.4, 1.22]]);
    camBegin(cx, cy, z);
    const s = stage(t);
    const led = toScreen(...routerLED(s.r.x, s.r.y, ST.rS));
    overlays(t, s);
    camEnd();
    caption('Sibling rivalry is universal…\nespecially over the Wi-Fi.', 520, lt - .3, { life: 3.6, size: 62 });
    flushLetters();
    if (lt < .95) {   // the LED's dot grows into a Wi-Fi fan; then its tip drops away below the frame, so the fan sweeps over everything
      const k = seg(lt, .05, .95), drop = 4200 * easeIn(seg(k, .45, 1));
      fanIris(led[0], led[1] + drop, lerp(0, 760, easeIn(k)) + drop, lerp(.6, .8, k));
    }
  }

  // ======================= B · 4.4–8.0 · the buffer, the glare, the launch =======================
  function buffer(t, lt) {
    const cx = kf(t, [[4.4, 545], [FRZ_K, 500], [5.2, 500], [FRZ_G + .1, 585], [6.0, 585], [TURN + .3, 545], [EYES_R, 545], [7.7, 540]]);
    const cy = kf(t, [[4.4, 965], [FRZ_K, 960], [6.0, 960], [TURN + .3, 1090], [EYES_R, 1140], [7.7, 1160]]);
    const z = kf(t, [[4.4, 1.22], [FRZ_K, 1.26], [6.0, 1.26], [TURN + .3, 1.36], [EYES_R, 1.4], [7.7, 1.42]]);
    camBegin(cx, cy, z + .005 * Math.sin(t * 2));
    const s = stage(t);
    overlays(t, s);
    camEnd();
  }

  // ======================= C · 8.0–14.2 · the tug-of-war =======================
  function tug(t, lt) {
    const r = routerAt(t), aK = allK(t);
    const sh = shakeXY(t, 6 * bumps(t, [...KP, ...GP], .02, .15) + 9 * aK * ease(seg(t, ALL, DARK)));
    const cx = lerp(ST.rX, r.x, .5) + 5 - 40 * aK, cy = lerp(1060, 1230, aK), z = lerp(1.35, 1.5, ease(seg(t, ALL, DARK)));
    camBegin(cx + sh[0], cy + sh[1], z);
    const s = stage(t);
    overlays(t, s);
    camEnd();
  }

  // ======================= D · 14.2–17.6 · blackout; eyes follow the cord; whip pan =======================
  function blackout(t, lt) {
    const cx = kf(t, [[DARK, 540], [FOL, 540], [WHIP[0], 780], [WHIP[1], 1320]], (x) => x < .5 ? ease(x) : easeIn(x));
    const cy = kf(t, [[DARK, 1290], [LOOKD, 1280], [FOL, 1260], [WHIP[0], 1130], [WHIP[1], 1120]]);
    const z = kf(t, [[DARK, 1.5], [LOOKD, 1.42], [WHIP[0], 1.3]]);
    camBegin(cx, cy, z);
    const s = stage(t, { shiva: t > WHIP[0] });
    overlays(t, s);
    camEnd();
    whipSmear(easeIn(seg(t, WHIP[0] + .15, WHIP[1])), 1, ['#20234F', '#2E3168', '#43365E']);
  }

  // ======================= E · 17.6–22.6 · the socket, Shiva, the slurp, the drag =======================
  function reveal(t, lt) {
    const sh = shakeXY(t, 14 * bump(t, THUD, .02, .3));
    const cx = kf(t, [[WHIP[1], 1380], [18.3, 1440], [19.0, 1680], [LOWER[0], 1665], [DRAG, 1650], [21.0, 1480], [THUD + .2, 1480], [22.6, 1485]]);
    const cy = kf(t, [[WHIP[1], 1130], [18.3, 1150], [19.0, 1200], [LOWER[0], 1215], [DRAG, 1180], [21.0, 1260], [THUD + .2, 1275], [22.6, 1275]]);
    const z = kf(t, [[WHIP[1], 1.35], [18.3, 1.38], [19.0, 1.5], [LOWER[0], 1.62], [DRAG, 1.45], [21.0, 1.08], [THUD + .2, 1.2], [22.6, 1.24]]);
    camBegin(cx + sh[0], cy + sh[1], z);
    const s = stage(t, { shiva: true });
    overlays(t, s);
    camEnd();
    whipSmear(1 - easeOut(seg(t, WHIP[1], WHIP[1] + .25)), 1, ['#20234F', '#2E3168', '#43365E']);
  }

  // ======================= F · 22.6–28 · one eye opens; the kids "meditate"; the sting =======================
  function button(t, lt) {
    const cx = kf(t, [[22.6, 1485], [PEEK - .1, 1740], [23.3, 1745], [23.5, 1400], [24.2, 1400], [25.0, 1490], [BPEEK - .2, 1495], [BPEEK + .3, 1560], [SHUT + .5, 1560], [27.2, 1495]]);
    const cy = kf(t, [[22.6, 1275], [PEEK - .1, 1140], [23.3, 1140], [23.5, 1270], [24.2, 1270], [25.0, 1185], [BPEEK - .2, 1185], [BPEEK + .3, 1215], [SHUT + .5, 1215], [27.2, 1185]]);
    const z = kf(t, [[22.6, 1.24], [PEEK - .1, 1.75], [23.3, 1.78], [23.5, 1.4], [24.2, 1.4], [25.0, 1.16], [BPEEK - .2, 1.18], [BPEEK + .3, 1.42], [SHUT + .5, 1.44], [27.2, 1.2]]);
    camBegin(cx, cy, z);
    const s = stage(t, { shiva: true });
    const led = toScreen(...routerLED(s.r.x, s.r.y, ST.rS));
    overlays(t, s);
    camEnd();
    caption('Mahadev: the original\nparental control.', 520, t - STING, { life: CRT[0] + .05 - STING, size: 74 });
    flushLetters();
    crtOff(seg(t, CRT[0], CRT[1]), led[0], led[1]);
    if (t > CRT[1]) paint(rectPts(-60, -60, W + 120, H + 120), { wash: WB.ink, ink: null });
  }

  shots([[0, setup], [4.4, buffer], [8.0, tug], [DARK, blackout], [WHIP[1], reveal], [22.6, button]]);
  window.WIFI = { kartiO, bappaO, shivaO, routerAt, tugL };   // for render.mjs --crop-at expressions
})();
