// "The Third Eye Alarm Clock": at dawn on Kailash, Bal Bappa and Kartikeya try to wake a meditating Shiva, the third
// try nearly opens the third eye, and Parvati Maa wakes him with a cup of chai. 30 s, 1080×1920 (a vertical reel).
// Storyboard: STORYBOARD.md. Set and props: third_eye_props.js. Sound: tools/third_eye_sfx.mjs.
//
// Every character's pose is a pure function of film time (shivaO, kartiO, bappaO, parvatiO), and stage(t) draws the
// whole world from them, so the three shots only choose a camera and their transitions.
(() => {
  const ST = STAGE;
  // times (film seconds); the SFX cue list uses the same numbers
  const HOP_K = [4.25, 4.75], CL1 = [5.25, 5.55, 5.85], SNAKE = 6.6, HOP_G = [8.1, 8.6], GRAB = [8.85, 9.3], RATTLE = [9.6, 11.2],
    PLOP = 12.45, UP_G = 13.3, CL3 = [13.65, 13.8, 13.95, 14.1, 14.25], SCARE = 14.45, CALM = 16.0, WALK = [17.4, 18.35],
    WINK = 18.45, OFFER = [18.9, 19.6], SNIFF = [19.95, 20.3, 20.65], POP = 21.6, TAKE = [22.3, 22.55], SIP = 22.9,
    SEE = 24.4, GIVE = 24.9, WIDE = 25.2, SCOOP = [25.7, 26.15], MAA_SIP = 27.7, END = 32.5;

  // emotions() cross-fades body colours from feel(), which default to Clawd's clay: give every key the character's own
  const skinKeys = (keys, c) => keys.map(([k, n, o]) => [k, n, { ...c, ...(o || {}) }]);
  const emo = c => (t, keys, o) => emotions(t, skinKeys(keys, c), o);
  const sEmo = emo(SHV_SKIN), kEmo = emo(KAR_SKIN), gEmo = emo({ col: BAL.skin, dk: BAL.skinDk, lt: BAL.skinLt }), pEmo = emo(PRV_SKIN);

  const skyS = t => ({ sun: ease(seg(t, POP + .05, POP + .9)), red: ease(seg(t, SCARE, SCARE + .45)) * (1 - ease(seg(t, CALM, CALM + .7))) });
  const scareK = t => seg(t, SCARE, SCARE + .3) * (1 - seg(t, CALM, CALM + .6));
  const bump = (t, t0, a = .12, b = .25) => seg(t, t0 - a, t0) * (1 - seg(t, t0, t0 + b));   // 0 → 1 → 0 around t0
  const nearest = (t, evs) => evs.reduce((m, e) => Math.min(m, Math.abs(t - e)), 9);
  const toLocal = (wx, wy, x, y, u, o = {}) => [(wx - x) / u - (o.lean || 0) * .5, (wy - y) / u + (o.float || 0)];

  // ---------------- Shiva ----------------
  function shivaO(t) {
    const keys = [[0, 'serene'], [POP, 'surprised', { brow: .3, emote: '!!' }], [SIP - .15, 'serene', { mouth: 'o' }], [SIP + .45, 'bliss'],
      [SEE, 'happy', { eyes: 'normal', mouth: 'smile', lookX: -.8, lookY: .5 }], [WIDE, 'excited', { eyes: 'normal', mouth: 'open' }], [SCOOP[1], 'love'], [MAA_SIP + .1, 'happy', { eyes: 'closed', mouth: 'grin' }]];
    const o = { ...sEmo(t, keys, { take: .8 }) };
    // the scare: the third eye trembles and leaks red; his face doesn't move
    const sk = scareK(t);
    o.thirdGlow = t < POP ? Math.max(sk * (.75 + .25 * Math.sin(t * 31)), .35 * bump(t, 3.8, .3, .35)) : 0;
    o.thirdShake = .07 * sk;
    if (sk > 0 && t < POP) o.mouth = 'flat';
    // sniffing: the nose flares on each sniff, he leans and floats after the cup
    if (t > SNIFF[0] - .15 && t < POP) {
      o.sniff = SNIFF.reduce((m, e) => Math.max(m, bump(t, e, .08, .2)), 0);
      o.mouth = 'o'; o.hx = .35 * ease(seg(t, 20.4, 21.3));
    }
    o.lean = t < POP + .6 ? 1.1 * ease(seg(t, 20.9, 21.5)) * (1 - ease(seg(t, POP + .1, POP + .6))) : 0;
    o.float = t < POP + .7 ? .7 * ease(seg(t, 21.0, 21.5)) * (1 - easeOut(seg(t, POP + .2, POP + .7))) : 0;
    // POP: the third eye snaps open and stays open
    o.third = t < POP ? 0 : backOut(seg(t, POP, POP + .16));
    o.ganga = t < POP ? 1 : 1 + 1.4 * Math.exp(-(t - POP) * 2.2);
    o.moonWob = .35 * Math.sin(t * TAU * 3.3) * seg(t, RATTLE[0], RATTLE[0] + .3) * (1 - seg(t, RATTLE[1], RATTLE[1] + .7)) + .5 * spring(t, POP, 4, 16) + .25 * spring(t, SCARE, 3, 20);
    // Vasuki: wakes at the clang, glares, hisses, sleeps; peeks during the rattle; bolts up at the POP; joins the hug
    let up = 0, eyes = 'closed', tongue = 0, look = -1;
    if (t > SNAKE && t < 8.1) { up = ease(seg(t, SNAKE, SNAKE + .3)) * (1 - ease(seg(t, 7.45, 8.0))); eyes = t < 6.85 ? 'open' : t < 7.7 ? 'angry' : 'closed'; tongue = t > 6.9 && t < 7.35 ? .5 + .5 * Math.sin(t * 40) : 0; }
    if (t > 10.2 && t < 10.9) eyes = 'open';
    if (t > SCARE && t < CALM + .5) { eyes = 'open'; up = -.2 * sk; }
    if (t > POP) { up = t < SEE ? backOut(seg(t, POP, POP + .25)) : lerp(1, .55, ease(seg(t, SEE, SEE + .5))); eyes = t < SIP + .6 ? 'open' : 'happy'; look = t < SEE ? .2 : -.2; }
    Object.assign(o, { snakeUp: up, snakeEyes: eyes, snakeTongue: tongue, snakeLook: look });
    // hands: chin mudra until the cup; take it, sip, hand it back, arms wide, the hug
    const cupW = parvatiCupWorld(t);
    if (t > TAKE[0] && t < GIVE + .35) {
      const at = toLocal(cupW[0], cupW[1] + 12, ST.shX, ST.shY, ST.shU, o), mouthP = [1.1, -10.1];
      const hold = [2.6, -8.4], kk = ease(seg(t, TAKE[0], TAKE[1])), kg = ease(seg(t, SEE, GIVE));
      o.handR = t < TAKE[1] ? [lerp(5.6, at[0], kk), lerp(-3.55, at[1], kk)]
        : t < SEE ? kf(t, [[TAKE[1], at], [SIP, mouthP], [SIP + .9, [1.35, -10.2]], [SEE - .3, hold]], ease)
        : t < GIVE ? [lerp(hold[0], at[0], kg), lerp(hold[1], at[1], kg)] : at;
      o.bendR = 1.6; o.mudra = false;
    }
    if (t > GIVE + .35) {
      const wide = ease(seg(t, WIDE, WIDE + .35)), hug = ease(seg(t, SCOOP[0], SCOOP[1]));
      const cw = parvatiCupWorld(GIVE + .35), a0 = toLocal(cw[0], cw[1] + 12, ST.shX, ST.shY, ST.shU, o);
      const L0 = t < WIDE ? kf(t, [[GIVE + .35, a0], [WIDE, [5.6, -3.55]]], ease) : [5.6, -3.55];
      const sqz = t > SCOOP[1] ? .25 * Math.sin((t - SCOOP[1]) * TAU * 1.1) * Math.exp(-(t - SCOOP[1]) * .6) : 0;
      o.handL = [lerp(lerp(-5.6, -8.6, wide), -1.4 + sqz, hug), lerp(lerp(-3.55, -11, wide), -5.6, hug)];
      o.handR = [lerp(lerp(L0[0], 8.6, wide), 1.6 - sqz, hug), lerp(lerp(L0[1], -11, wide), -5.9, hug)];
      o.bendL = o.bendR = lerp(lerp(1.2, .6, wide), 3.1, hug); o.mudra = false;
      if (t > SCOOP[1]) o.sq = (o.sq || 0) + .03 * Math.max(0, Math.sin((t - SCOOP[1]) * TAU * 1.1));
    }
    if (t > TAKE[1] && t < GIVE) o.armR = (u, sw) => { kulhad(0, -.35 * 1.25 * u, 1.25 * u, 'cup'); };
    return o;
  }

  // ---------------- Parvati ----------------
  function parvatiO(t) {
    const keys = [[0, 'happy', { eyes: 'normal', mouth: 'smile' }], [WINK, 'playful', { eyes: 'wink', mouth: 'smile', hx: -.6, lookX: -1 }],
      [OFFER[0], 'happy', { eyes: 'normal', mouth: 'smile', lookX: -1, hx: -.4 }], [POP + .1, 'smug', { eyes: 'closed', mouth: 'smile' }],
      [MAA_SIP, 'relieved', { eyes: 'closed', mouth: 'smile', blush: .6, emote: null }], [MAA_SIP + .9, 'smug', { eyes: 'wink', mouth: 'smile', hx: .3 }]];
    const o = { ...pEmo(t, keys, { take: .5 }) };
    o.aL = o.aR = undefined;
    const wk = seg(t, WALK[0], WALK[1]);
    o.dx = 0; o.walk = t > WALK[0] && t < WALK[1] ? (t - WALK[0]) * 1.9 : undefined;
    if (o.walk != null) o.dy = (o.dy || 0) - .25 * Math.abs(Math.sin(o.walk * Math.PI));
    o.x = lerp(1260, ST.pX, ease(wk) * .85 + wk * .15);
    // offer the cup; tease it back a touch as he leans in; let go into his hand; smug hands; take it back; sip it herself
    o.lean = -1.2 * ease(seg(t, OFFER[0], OFFER[1])) * (1 - ease(seg(t, TAKE[1], TAKE[1] + .5)));
    const carry = [-3.9, -13.4], offer = [-7.9, -15.2], tease = [-6.6, -14.7];
    let hl = t < OFFER[0] ? carry : t < 20.9 ? kf(t, [[OFFER[0], carry], [OFFER[1], offer]], ease) : kf(t, [[20.9, offer], [21.5, tease]], ease);
    if (t > TAKE[1]) hl = kf(t, [[TAKE[1], tease], [TAKE[1] + .5, [-2.4, -13.2]]], ease);   // arms fold
    if (t > GIVE - .5) hl = kf(t, [[GIVE - .5, [-2.4, -13.2]], [GIVE, [-5.6, -14.2]], [GIVE + .5, [-3.9, -13.4]], [MAA_SIP, [-3.9, -13.4]], [MAA_SIP + .45, [-.9, -18.1]], [MAA_SIP + 1.3, [-1, -18.2]], [MAA_SIP + 1.8, [-3.6, -14.4]]], ease);
    o.handL = hl; o.bendL = t < OFFER[0] ? 1.3 : .8;
    o.handR = t > TAKE[1] && t < GIVE - .4 ? [-.4, -12.9] : [3.3, -11.2];
    if (t > TAKE[1] && t < GIVE - .4) o.bendR = 1.4;
    const holding = t < TAKE[1] || t > GIVE;
    if (holding) o.armL = (u, sw) => { kulhad(0, -.35 * 1.7 * u, 1.7 * u, 'cup', { level: t > MAA_SIP + .6 ? .6 : 1 }); };
    return o;
  }
  // the cup's centre in world space while Parvati holds it
  function parvatiCupWorld(t) {
    const o = parvatiO_noCup(t), [hx, hy] = parvatiHand(o.x, ST.pY, ST.pU, o, -1);
    return [hx, hy - .35 * 1.7 * ST.pU];
  }
  function parvatiO_noCup(t) { const o = parvatiO(t); o.armL = null; return o; }

  // ---------------- Kartikeya ----------------
  function kartiO(t) {
    const keys = [[0, 'excited', { lookX: .6, lookY: -.3, emote: null }], [4.2, 'determined', { lookX: .6 }], [5.95, 'hopeful', { lookX: 1 }], [SNAKE + .15, 'scared', { lookX: 1 }],
      [7.4, 'shy', { lookX: .6 }], [8.25, 'neutral', { lookX: 1 }], [RATTLE[0], 'nervous', { eyes: 'squeeze', mouth: 'wobble', emote: 'sweat' }],
      [RATTLE[1], 'hopeful', { lookX: 1 }], [PLOP - .1, 'laugh'], [13.0, 'determined', { lookX: 1 }], [SCARE + .05, 'scared', { lookX: 1 }], [CALM + .5, 'relieved'],
      [17.1, 'neutral', { lookX: 1, hx: .4 }], [WINK + .15, 'confused', { lookX: 1 }], [19.6, 'thinking', { lookX: 1, lookY: -.3 }], [POP + .05, 'surprised', { lookX: 1 }],
      [23.0, 'starstruck'], [SEE + .1, 'hopeful', { lookX: 1, lookY: -.6 }], [SCOOP[0] + .2, 'love'], [27.2, 'laugh']];
    const o = { ...kEmo(t, keys, { take: .8 }) };
    let x = ST.kX, y = ST.kY, dy = o.dy || 0, hidden = false;
    // hiding behind the boulder: the spear tip first, then his face; then a hop out over it
    if (t < HOP_K[0]) {
      x = 190; y = ST.bY - 6;
      o.sq = kf(t, [[0, .62], [2.5, .62], [2.8, -.04], [3.0, .02]], easeOut);   // crouched behind it, then up to peek
      hidden = true;
      o.aL = -1.3; o.aR = kf(t, [[0, -1.3], [1.85, -1.3], [2.15, 1.35]], easeOut);   // the spear tip pokes up first
      o.spearA = .1;
    } else if (t < HOP_K[1]) {
      const k = seg(t, HOP_K[0], HOP_K[1]), p = arcPt([190, ST.bY - 6], [ST.kX + 45, ST.kY], 200, k);
      x = p[0]; y = p[1]; dy = 0; hidden = k < .4; o.sq = -.12 * Math.sin(k * Math.PI);
      o.aL = .8; o.aR = 1;
    } else {
      x = t < 7.45 ? ST.kX + 45 : lerp(ST.kX + 45, ST.kX, ease(seg(t, 7.45, 8.05)));
      if (t > 7.45 && t < 8.05) o.walk = (t - 7.45) * 3;
      const land = jump(t, HOP_K[0], HOP_K[1], 0); o.sq = (o.sq || 0) + land.sq;
    }
    // clang pose: shield high on the left, spear high on the right; each hit swings the blade over onto the shield
    const clangs = t < 9 ? CL1 : CL3;
    const inClang = (t > 4.85 && t < 6.2) || (t > 13.45 && t < SCARE + .1);
    if (inClang) {
      const nh = nearest(t, clangs), before = clangs.find(c => c >= t - .02);
      o.aL = 1.1; o.aR = 1.2;
      // between hits the spear lifts back upright; each hit snaps it over (fast in, slow out)
      const hitK = clangs.reduce((m, c) => Math.max(m, t < c ? ease(seg(t, c - .1, c)) : 1 - ease(seg(t, c + .03, c + .22))), 0);
      o.spearA = lerp(-.15, -1.52, hitK);
      if (t < clangs[0]) { const w = ease(seg(t, 4.85, clangs[0] - .12)); o.aR = lerp(-1.3, 1.45, w); o.aL = lerp(-1.3, 1.1, w); o.spearA = lerp(0, .25, w); }
      if (t > clangs[clangs.length - 1] + .22 && t < 9) { const d = ease(seg(t, clangs[clangs.length - 1] + .22, 6.2)); o.aR = lerp(1.2, -1.3, d); o.aL = lerp(1.1, -1.3, d); o.spearA = 0; }
      o.sq = (o.sq || 0) + .06 * clangs.reduce((m, c) => Math.max(m, bump(t, c, .03, .12)), 0);
    } else if (t > HOP_K[1]) { o.aL = -1.3; o.aR = -1.3; o.spearA = .05; }
    if (t > RATTLE[0] && t < RATTLE[1] + .1) o.cover = 1;
    // the scare: frozen mid-clang, then he runs to his brother and they cling
    if (t > SCARE && t < SCARE + .9) { o.aL = 1.1; o.aR = 1.2; o.spearA = -1.52; o.dx = .08 * Math.sin(t * 70); }
    const cling = t > 15.25 && t < 17.0;
    if (t > 15.25 && t < SCOOP[0]) x = lerp(ST.kX, ST.kX + 62, ease(seg(t, 15.25, 15.55)) * (1 - ease(seg(t, 16.9, 17.3))));
    if (cling) { o.aL = .25; o.aR = .5; o.spearA = .3; o.dx = .05 * Math.sin(t * 60); o.hx = .3; }
    // POP, then the scoop into Shiva's lap (standing on his right thigh)
    if (t > SCOOP[0]) {
      const k = seg(t, SCOOP[0], SCOOP[1]), p = arcPt([ST.kX, ST.kY], [ST.shX + 85, 1318], 140, easeOut(k));
      x = p[0]; y = p[1]; dy = 0; o.walk = undefined;
      o.aL = t < SCOOP[1] ? .9 : .15; o.aR = t < SCOOP[1] ? .9 : .2; o.spearA = .35; o.shield = false;
      o.hx = -.35; o.htilt = -.12 * ease(seg(t, SCOOP[1] - .05, SCOOP[1] + .2)); o.cheek = true;
      o.sq = (o.sq || 0) + (t > SCOOP[1] ? .08 * Math.exp(-(t - SCOOP[1]) * 5) : -.1 * Math.sin(k * Math.PI));
    }
    o.x = x; o.y = y; o.dy = dy; o.hidden = hidden; o.u = lerp(ST.kU, 15.5, ease(seg(t, SCOOP[0], SCOOP[1])));
    return o;
  }

  // ---------------- Bal Bappa ----------------
  // the damaru in his hand: held upright, shaking while he rattles
  function bappaO(t) {
    const keys = [[0, 'excited', { lookX: .6, lookY: -.3, emote: null }], [4.3, 'neutral', { lookX: 1 }], [SNAKE + .2, 'nervous', { lookX: 1 }], [7.95, 'mischief', { lookX: 1 }],
      [HOP_G[1], 'determined', { lookX: .5, lookY: -1 }], [GRAB[1], 'proud'], [RATTLE[0], 'happy', { mouth: 'laugh' }], [RATTLE[1], 'hopeful', { lookX: 1 }],
      [11.85, 'dizzy'], [13.0, 'determined', { lookX: -1 }], [SCARE + .05, 'scared', { lookX: 1 }], [CALM + .5, 'relieved'],
      [17.1, 'neutral', { lookX: 1, hx: .4 }], [WINK + .15, 'confused', { lookX: 1 }], [19.6, 'thinking', { lookX: 1, lookY: -.3 }], [POP + .05, 'surprised', { lookX: 1 }],
      [23.0, 'starstruck'], [SEE + .1, 'hopeful', { lookX: 1, lookY: -.6 }], [SCOOP[0] + .2, 'love'], [27.2, 'happy']];
    const o = { ...gEmo(t, keys, { take: .8 }), stand: 1, trunk: 'rest' };
    let x = ST.gX, y = ST.gY, dy = o.dy || 0, hidden = false, dam = null;   // dam = { rot, shake } when he holds the damaru
    if (t < HOP_G[0]) {   // peeking over the boulder
      x = 85; y = ST.bY - 8; hidden = true;
      o.sq = kf(t, [[0, .62], [2.2, .62], [2.5, .02]], easeOut) + .03 * Math.sin(t * 5);
      o.aL = -1; o.aR = -1;
      if (t > 7.8) o.sq += .15 * ease(seg(t, 7.8, HOP_G[0]));   // gathers himself
    } else if (t < HOP_G[1]) {
      const k = seg(t, HOP_G[0], HOP_G[1]), p = arcPt([85, ST.bY - 8], [ST.gX, ST.gY], 230, k);
      x = p[0]; y = p[1]; dy = 0; hidden = k < .35; o.sq = -.12 * Math.sin(k * Math.PI); o.aL = 1; o.aR = 1.2; o.walk = k * 2;
    } else {
      const land = jump(t, HOP_G[0], HOP_G[1], 0); o.sq = (o.sq || 0) + land.sq;
      // the hop up to the damaru on the trishul
      const j = jump(t, GRAB[0], GRAB[1] + .05, 7); dy += j.dy; o.sq = (o.sq || 0) + j.sq;
      if (t > HOP_G[1] && t < RATTLE[0]) { o.aR = t < GRAB[0] + .3 ? lerp(.3, 1.35, ease(seg(t, HOP_G[1], GRAB[0]))) : lerp(1.35, .5, ease(seg(t, GRAB[0] + .3, RATTLE[0]))); o.aL = .3; o.trunk = 'up'; o.trunk2 = 'rest'; o.trunkK = seg(t, GRAB[1], RATTLE[0]); }
      if (t > GRAB[0] + .22) dam = { rot: -.3 * spring(t, GRAB[0] + .22, 5, 14), shake: 0 };
    }
    if (t > RATTLE[0] && t < RATTLE[1]) {   // the rattle dance: two shakes a beat, bouncing, ears flapping, trunk swinging
      const b = bpOf(t) * 2, s1 = Math.sin(b * Math.PI);
      o.aR = 1.1 + .45 * s1; o.aL = .9 - .3 * s1; o.dy = -.9 * Math.abs(Math.sin(b * Math.PI / 2)); dy = o.dy; o.ear = .5 + .5 * Math.sin(b * Math.PI);
      o.trunk = 'up'; o.trunk2 = 'curl'; o.trunkK = .5 + .5 * Math.sin(b * Math.PI / 2); o.rot = .06 * Math.sin(bpOf(t) * Math.PI);
      dam = { rot: .5 * s1, shake: 1 };
    }
    if (t > RATTLE[1] && t < PLOP) { o.aR = lerp(1.1, .35, ease(seg(t, RATTLE[1], RATTLE[1] + .4))); o.aL = -1; dam = { rot: .15 * Math.sin(t * 3), shake: 0 }; }
    if (t > 11.85 && t < 13.1) { o.rot = (o.rot || 0) + .12 * Math.sin((t - 11.85) * 7) * (1 - seg(t, PLOP, PLOP + .1)); }
    // plop: sits down hard, damaru in the lap; then hops back up
    if (t > PLOP && t < UP_G) { o.stand = 0; o.sq = (o.sq || 0) + .28 * Math.exp(-(t - PLOP) * 7) * Math.cos((t - PLOP) * 22); o.aR = .3; o.aL = -1; dam = { rot: .9, shake: 0 }; }
    if (t > UP_G - .12 && t < UP_G + .4) { const j = jump(t, UP_G, UP_G + .3, 1.2); dy += j.dy; o.sq = (o.sq || 0) + j.sq; }
    if (t > UP_G && t < SCOOP[0]) {   // all-out: rattle + trumpet, then frozen, then clinging to his brother
      o.aR = .5; o.aL = -1; dam = { rot: .2, shake: 0 };
      if (t > CL3[0] - .1 && t < SCARE) { const b = t * 7; o.aR = 1.2 + .4 * Math.sin(b * TAU); dam = { rot: .5 * Math.sin(b * TAU), shake: 1 }; o.trunk = 'up'; o.ear = .9; o.eyes = 'squeeze'; o.mouth = null; }
      if (t > SCARE && t < SCARE + .9) { o.aR = 1.3; o.trunk = 'up'; o.ear = .9; dam = { rot: .5, shake: 0 }; o.dx = .08 * Math.sin(t * 70); }
      if (t > 15.25 && t < 17.0) { x = lerp(ST.gX, ST.gX - 55, ease(seg(t, 15.25, 15.55))); o.aL = .3; o.aR = .3; o.hx = -.3; o.dx = .05 * Math.sin(t * 60 + 1); o.trunk = 'down'; }
      if (t > 17.0) x = lerp(ST.gX - 55, ST.gX, ease(seg(t, 17.0, 17.4)));
    }
    if (t > 15.25) dam = { rot: .9, shake: 0, dropped: true };   // he lets it fall to cling to his brother; it stays in the snow
    // the scoop: into Shiva's lap on his left thigh, sitting
    if (t > SCOOP[0]) {
      const k = seg(t, SCOOP[0], SCOOP[1]), p = arcPt([ST.gX, ST.gY], [ST.shX - 72, 1330], 150, easeOut(k));
      x = p[0]; y = p[1]; dy = 0; o.stand = k < .8 ? 1 : 0; o.aL = .7; o.aR = .7; o.hx = .35; o.walk = undefined;
      o.sq = (o.sq || 0) + (t > SCOOP[1] ? .1 * Math.exp(-(t - SCOOP[1]) * 5) : -.1 * Math.sin(k * Math.PI));
      o.htilt = .12 * ease(seg(t, SCOOP[1] - .05, SCOOP[1] + .2)); o.trunk = 'up';
      if (t > SCOOP[1]) { o.aL = .25; o.aR = .25; }
    }
    if (dam && !dam.dropped) o.armR = (u, sw) => damaru(0, -.2 * u, 5 * u, { rot: dam.rot, shake: dam.shake, key: 'g' });
    o.x = x; o.y = y; o.dy = dy; o.hidden = hidden; o.dam = dam; o.u = lerp(ST.gU, 16, ease(seg(t, SCOOP[0], SCOOP[1])));
    return o;
  }

  // ---------------- the stage ----------------
  function stage(t) {
    const S = skyS(t);
    sky(S); sunrise(S, S.sun); peaks(S); ledge(S);
    trishul(ST.trX, ST.trY, 760, S);
    const g = bappaO(t), k = kartiO(t), sh = shivaO(t), p = parvatiO(t);
    // the damaru, hanging on the trishul until he grabs it; lying in the snow after he drops it
    if (t < GRAB[0] + .22) damaru(ST.trX + 6, ST.trY - 330 + 4 * Math.sin(t * 2), 100, { rot: .08 * Math.sin(t * 1.7), key: 'hang' });
    if (t > 15.25) {   // the damaru falls out of his hand, bounces once and lies in the snow
      const g0 = bappaO(15.24), h0 = balHand(g0.x, g0.y + g0.dy * g0.u, g0.u, { ...g0, dy: 0 }, 1), f = seg(t, 15.25, 15.6);
      const p = arcPt([h0[0], h0[1] - .2 * g0.u], [ST.gX + 110, ST.gY + 8], 40, easeIn(f)), b = 18 * Math.abs(spring(t, 15.6, 7, 14));
      damaru(p[0], p[1] - b, lerp(5 * g0.u, 90, f), { rot: lerp(.2, 1.35, f), key: 'drop' });
    }
    const onLap = t > SCOOP[0] + .15;
    shiva(ST.shX, ST.shY, ST.shU, { ...sh, only: onLap ? 'body' : undefined, boilKey: 'shiva' });
    if (onLap) {
      balBappa(g.x, g.y, g.u, { ...g, boilKey: 'bappa', noShadow: true });
      kartikeya(k.x, k.y, k.u, { ...k, boilKey: 'karti', noShadow: true });
      shiva(ST.shX, ST.shY, ST.shU, { ...sh, only: 'arms', boilKey: 'shiva' });
    }
    // the boys: whoever is still hiding goes behind the boulder
    const drawG = () => balBappa(g.x, g.y, g.u, { ...g, boilKey: 'bappa', noShadow: g.hidden });
    const drawK = () => kartikeya(k.x, k.y, k.u, { ...k, boilKey: 'karti', noShadow: k.hidden });
    if (!onLap) { if (g.hidden && t > 2.1) drawG(); if (k.hidden && t > 1.8) drawK(); }   // crouched out of sight until they peek
    boulder(ST.bX, ST.bY, ST.bS, S);
    if (t > SCOOP[0]) {   // Kartikeya lets go of his shield as he's scooped up: it drops and rolls to a stop
      const k0 = kartiO(SCOOP[0] - .001), h0 = kartiHand(k0.x, k0.y, ST.kU, k0, -1), f = seg(t, SCOOP[0], SCOOP[0] + .45);
      const p = arcPt(h0, [ST.kX - 20, ST.kY - 14], 60, easeIn(f));
      push(); translate(p[0], p[1]); rotate(f * 2.4 + .3 * spring(t, SCOOP[0] + .45, 5, 12)); scale(1, lerp(1, .45, f)); kartiShield(ST.kU, clamp(ST.kU / 20, .4, 2)); pop();
    }
    if (!onLap) { if (!k.hidden) drawK(); if (!g.hidden) drawG(); }
    if (p.x < W + 300) parvati(p.x, ST.pY, ST.pU, { ...p, boilKey: 'parvati' });
    // steam from the cup: plain while she carries it, curling to his nose when she offers it, plain again after
    const cup = t > TAKE[1] && t < GIVE ? shivaHand(ST.shX, ST.shY, ST.shU, sh, 1) : parvatiCupWorld(t);
    const cupTop = t > TAKE[1] && t < GIVE ? [cup[0], cup[1] - .35 * 1.25 * ST.shU - .5 * 1.25 * ST.shU] : [cup[0], cup[1] - .5 * 1.7 * ST.pU];
    if (t > WALK[0] - .2) {
      const nose = shivaFace(ST.shX, ST.shY, ST.shU, sh, 'nose'), curl = t > OFFER[1] - .1 && t < POP + .1;
      steam(cupTop[0], cupTop[1], 40, t, curl ? { to: nose, k: seg(t, OFFER[1] - .1, 20.5), key: 'cup' } : { key: 'cup', alpha: t > POP && t < MAA_SIP ? .6 : 1 });
    }
    // effect marks
    const kSpear = kartiSpearTip(k.x, k.y, k.u, k);
    for (const c of [...CL1, ...CL3]) clangRing(kSpear[0], kSpear[1], 70, t - c, 'c' + c);
    if (g.dam && g.dam.shake) { const [hx, hy] = balHand(g.x, g.y + g.dy * g.u, g.u, { ...g, dy: 0 }, 1); rattleMarks(hx, hy - 30, 60, t, 1, 'g'); }
    if (t > CL3[0] - .1 && t < SCARE) rattleMarks(g.x + 5.6 * g.u, g.y - 13 * g.u, 50, t * 1.3, 1, 'trumpet');
    const third = shivaFace(ST.shX, ST.shY, ST.shU, sh, 'third');
    popBurst(third[0], third[1], 60, t - POP, 'pop');
    if (t > SIP + .5 && t < SEE) for (let i = 0; i < 3; i++) heartPuff(cupTop[0] + (i - 1) * 22, cupTop[1] - 20, 16, t - (SIP + .6 + i * .35), 'sip' + i);
    if (t > SCOOP[1]) for (let i = 0; i < 5; i++) heartPuff(ST.shX + (i - 2) * 70, 1080 - 40 * (i % 2), 26, ((t - SCOOP[1] - i * .3) % 1.8 + 1.8) % 1.8, 'hug' + i);
    return { sh, g, k, p, third };
  }

  // ======================= A · 0–4.2 · Kailash at dawn; the peek; push to the third eye =======================
  function opening(t, lt) {
    const push_ = ease(seg(t, 3.1, 4.15)), third = shivaFace(ST.shX, ST.shY, ST.shU, shivaO(t), 'third');
    camBegin(lerp(475, third[0], push_), lerp(1180, third[1] + 30, push_), lerp(1.17 + .015 * lt, 2.7, easeIn(push_) * .6 + push_ * .4));
    const r = stage(t);
    const ts = toScreen(...r.third);
    camEnd();
    caption('Waking up the Destroyer\nof the Universe is a\nrisky morning routine.', 250, lt - .45, { life: 3.1, size: 70 });
    flushLetters();
    if (lt < .85) eyeIris(ts[0], ts[1], 3800, easeIn(seg(lt, .05, .85)));
    whipSmear(easeIn(seg(t, 4.0, 4.2)), -1);
  }

  // ======================= B · 4.2–21.6 · three tries, the scare, Parvati and the chai =======================
  function tries(t, lt) {
    const sh = shakeXY(t, 10 * CL1.concat(CL3).reduce((m, c) => Math.max(m, bump(t, c, .02, .15)), 0) + 7 * scareK(t) + 5 * bump(t, PLOP, .02, .2));
    const cx = kf(t, [[4.2, 400], [8.2, 410], [9.0, 440], [12.2, 440], [13.0, 425], [SCARE - .05, 425], [SCARE + .5, 470], [CALM + .1, 480], [CALM + .8, 470], [17.2, 470], [18.4, 680], [19.8, 680], [21.3, 715]]);
    const cy = kf(t, [[4.2, 1250], [SCARE - .05, 1250], [SCARE + .5, 1210], [CALM + .1, 1210], [CALM + .8, 1250], [17.2, 1250], [18.4, 1210], [19.8, 1210], [21.3, 1080]]);
    const z = kf(t, [[4.2, 1.22], [SCARE - .05, 1.22], [SCARE + .5, 1.36], [CALM + .1, 1.38], [CALM + .8, 1.25], [17.2, 1.25], [18.4, 1.12], [19.8, 1.12], [21.3, 1.62]]);
    camBegin(cx + sh[0], cy + sh[1], z + .01 * Math.sin(t * .7));
    stage(t);
    camEnd();
    whipSmear(1 - easeOut(seg(t, 4.2, 4.42)), -1);
    // POP: a white-gold flash on the cut
    if (t > POP - .06) flash(seg(t, POP - .06, POP), '#FFF3D6');
  }

  // ======================= C · 21.6–30 · POP, the sip, the hug, the sting =======================
  function finale(t, lt) {
    const sh = shakeXY(t, 14 * (1 - seg(t, POP, POP + .35)));
    const cx = kf(t, [[POP, 670], [SEE, 680], [SEE + 1, 668], [28.2, 668], [29.4, 475], [END - .7, 490]]);
    const cy = kf(t, [[POP, 985], [SEE, 975], [SEE + 1, 1140], [28.2, 1140], [29.4, 1180], [END - .7, 1165]]);
    const z = kf(t, [[POP, 1.95], [SEE, 2.08], [SEE + 1, 1.68], [28.2, 1.74], [29.4, 1.17], [END - .7, 1.25]]);   // the last wide holds on the sting, drifting in
    camBegin(cx + sh[0], cy + sh[1], z);
    const r = stage(t);
    const ts = toScreen(...r.third);
    camEnd();
    flash(1 - seg(t, POP, POP + .25), '#FFF3D6');
    caption('Maa always knows\nthe cheat code.', 260, t - 28.25, { life: END - .65 - 28.25, size: 76 });
    flushLetters();
    if (t > END - .7) eyeIris(ts[0], ts[1], 3800, 1 - easeIn(seg(t, END - .7, END - .05)));
  }

  shots([[0, opening], [4.2, tries], [POP, finale]]);
})();
