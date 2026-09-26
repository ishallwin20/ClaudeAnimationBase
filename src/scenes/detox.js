// "Bappa's Post-Visarjan Detox": the festival is over and the modaks have caught up. The heavenly scale shows only a
// flashing modak; Bappa ties on a sweatband and can't budge the divine dumbbell; Shiva floats past, still meditating,
// and taps it with his Trishul; Bappa lifts it with his pinky, flexes for the mirror and eats the laddoo hidden in
// his crown... and the scale beeps again. 31.5 s, 1080×1920 (a vertical reel). The last frame loops into the first.
// Storyboard: STORYBOARD.md. Set and props: detox_props.js. Sound: tools/detox_sfx.mjs.
//
// Every character's pose is a pure function of film time (bappaO, shivaO, mooshakO, dumbbellAt), and stage(t) draws
// the whole world from them, so the two shots only choose a camera and their transitions.
(() => {
  const G = GYM, BU = G.bU, DS = G.dbS, HALF = 349 * G.dbS;
  // times (film seconds); the SFX cue list (tools/detox_sfx.mjs) uses the same numbers
  const BEEPS = [.15, .75, 1.35, 1.95, 2.55, 3.15, 3.75, 4.35, 4.95, 5.55], SEE_A = 2.4, INHALE = [4.0, 4.8], PEEK_B = 5.1,
    GASP = 5.7, BEEP_X = [5.8, 5.95, 6.1], SAD = 6.25, DET_B = 6.9, HOP_OFF = [7.05, 7.45], CUT = 7.4,
    KNOT = 8.4, GLINT = 8.75, PULL_C = [9.2, 10.0], WHISTLE = 9.6, GULP = 9.95, NOD = 10.3, STEP = [10.5, 10.9],
    GRIP = [10.9, 11.2], TUG = [11.4, 12.0, 12.6], SLIP = 13.2, LAND = 13.55, MOO_RUN = [14.0, 14.6],
    SH_IN = [16.2, 17.4], PEEK = 17.5, SMIRK = 18.0, TAP = 18.4, MOO_GASP = 18.8, SHH = [19.3, 20.1], S_WINK = 19.75, SH_OUT = [20.1, 21.1],
    WAKE = [21.0, 21.6], GRIP2 = 21.7, HEAVE = 22.1, TOP = 22.45, CATCH = 23.2, PROUD = 23.6, TO_MIR = [24.1, 24.6], FLEX = 24.7,
    R_WINK = 25.25, DTAKE = 25.45, TOSS = 25.9, LOOK_L = 26.35, LOOK_R = 26.75, LID = [27.2, 27.45], GRAB = 27.8, SHUT = 27.95,
    CHOMP = 28.3, GULP2 = 28.7, BEEP_END = 29.25, SLIDE = 29.55, STING = 29.75, INNOCENT = 30.1, PUSH = [30.5, 31.1], IRIS = [31.0, 31.45], END = 31.5;
  const LIE_X = G.dbX - 120, MIR_X = G.mrX - 420, MOO = [610, G.FY + 90], MOO_FAN = [650, G.FY + 90], MU = 15;
  // Shiva's float path: the Trishul's butt reaches the bar at TAP
  // the last beeps keep the opening's beat, so the loop doesn't stutter (the next one lands on BEEPS[0])
  const END_BEEPS = [0, .6, 1.2, 1.8].map(k => BEEP_END + k);
  const IRIS_H = 820;   // the modak window's height on the first and last frames
  const OPEN_Z = 2.4, OPEN_CY = G.dY - 190 / OPEN_Z;   // the first and last frames: the dial, big, low in the frame under the hook
  const SH_U = 15, SH_Y = 1120, SH_HOVER = G.dbX - 87, TRI = 420;

  // emotions() cross-fades body colours from feel(), which default to Clawd's clay: give every key the character's own
  const skinKeys = (keys, c) => keys.map(([k, n, o]) => [k, n, { ...c, ...(o || {}) }]);
  const emo = c => (t, keys, o) => emotions(t, skinKeys(keys, c), o);
  const bEmo = emo({ col: BAP.skin, dk: BAP.skinDk, lt: BAP.skinLt }), sEmo = emo(SHV_SKIN);
  const bump = (t, t0, a = .12, b = .25) => seg(t, t0 - a, t0) * (1 - seg(t, t0, t0 + b));   // 0 → 1 → 0 around t0
  const decay = (t, evs, k = 8) => evs.reduce((m, e) => t >= e ? Math.max(m, Math.exp(-(t - e) * k)) : m, 0);
  const onScale = t => t < HOP_OFF[0] + .05;

  // ---------------- the world's colour: the strain warms it, Shiva cools it, the pride gilds it ----------------
  const skyS = t => ({
    red: .7 * ease(seg(t, TUG[0] - .3, TUG[2] + .3)) * (1 - ease(seg(t, LAND, LAND + 1.2))),
    blue: .8 * ease(seg(t, SH_IN[0], SH_IN[0] + 1.2)) * (1 - ease(seg(t, SH_OUT[0], SH_OUT[1] + .4))),
    gold: .85 * ease(seg(t, TOP, CATCH + .4)) * (1 - ease(seg(t, BEEP_END, BEEP_END + .5))),
  });

  // ---------------- the scale's display ----------------
  function displayS(t) {
    const shake = .015 * Math.sin(t * 43) + .01 * Math.sin(t * 71);   // jammed past the top, trembling
    if (t < HOP_OFF[0] + .1) {
      const gasp = t > GASP ? backOut(seg(t, GASP, GASP + .2)) : 0;
      // the suck-in eases it back a hair (still in the red); the gasp spins it a full turn round the dial
      const needle = 1.05 + shake - .07 * ease(seg(t, INHALE[0], INHALE[1])) * (1 - seg(t, GASP, GASP + .1)) + 1.5 * easeOut(seg(t, GASP, GASP + .45));
      return { needle, flash: Math.max(decay(t, BEEPS, 7), decay(t, BEEP_X, 9), t > BEEP_X[2] ? .35 + .35 * Math.sin(t * 22) : 0), alarm: .45 + .55 * gasp, big: 1.12 + .3 * gasp, press: pressAt(t) };
    }
    if (t < BEEP_END) {
      const k = seg(t, HOP_OFF[0] + .1, HOP_OFF[0] + .4);   // he hops off: it drops back to empty with a wobble
      return { idle: true, needle: 1.05 * (1 - easeIn(k)) - .06 * spring(t, HOP_OFF[0] + .4, 5, 26), flash: 0, alarm: 0, big: 1, press: pressAt(t) };
    }
    // the last beep: nobody's even on it, and it jumps back to the top
    const pop = backOut(seg(t, BEEP_END, BEEP_END + .2));
    return { needle: 1.05 * backOut(seg(t, BEEP_END, BEEP_END + .3)) + shake, flash: decay(t, END_BEEPS, 7), alarm: .45 + .55 * pop, big: 1.12 + .3 * pop, press: 0 };
  }
  function pressAt(t) {
    if (t < HOP_OFF[0] + .05) return .55 + .15 * seg(t, INHALE[0], INHALE[1]) * -1 + .5 * Math.abs(spring(t, GASP, 5, 20)) + .2 * seg(t, GASP, GASP + .1);
    return .7 * Math.max(0, spring(t, HOP_OFF[0] + .1, 4, 14));
  }

  // ---------------- the dumbbell ----------------
  const LIFT_ROT = -Math.PI / 2 + .22;   // standing on end on his pinky, leaning away from his head
  function dumbbellAt(t) {
    const light = ease(seg(t, TAP, TAP + .4));
    if (t < HEAVE) {
      const shake = TUG.reduce((m, e) => Math.max(m, bump(t, e, .1, .3)), 0);
      const bob = light * (6 + 5 * Math.sin((t - TAP) * 2.6));
      return { x: G.dbX + 2.5 * shake * Math.sin(t * 90), y: G.dbY - bob, rot: .004 * shake * Math.sin(t * 70), light, strain: shake };
    }
    const tip = pinkyTip(Math.max(t, CATCH));
    const hold = { x: tip[0] + HALF * Math.cos(LIFT_ROT), y: tip[1] + HALF * Math.sin(LIFT_ROT) };
    if (t < TOP) { const k = easeOut(seg(t, HEAVE, TOP)); return { x: G.dbX + 20 * k, y: lerp(G.dbY, 600, k), rot: -.25 * k, light, speed: 1 - seg(t, HEAVE + .15, TOP + .2) }; }
    if (t < CATCH) {   // drifting down like a feather, turning up onto its end
      const k = seg(t, TOP, CATCH), e = ease(k);
      return { x: lerp(G.dbX + 20, hold.x, e) + 40 * Math.sin(k * Math.PI * 2) * (1 - k), y: lerp(600, hold.y, e), rot: lerp(-.25, LIFT_ROT, ease(seg(k, .1, .9))) + .12 * Math.sin(k * 9) * (1 - k), light };
    }
    const tipNow = pinkyTip(Math.min(t, TOSS));
    const sway = .06 * Math.sin((t - CATCH) * 2.2) + .12 * spring(t, CATCH, 4, 12), bob = 6 * Math.sin((t - CATCH) * 3.1);
    const at = { x: tipNow[0] + HALF * Math.cos(LIFT_ROT + sway), y: tipNow[1] + HALF * Math.sin(LIFT_ROT + sway) - bob, rot: LIFT_ROT + sway, light };
    if (t < TOSS) return at;
    const k = seg(t, TOSS, TOSS + 1.6), e = easeIn(k);   // flicked away: it floats up and off like a balloon
    return { x: at.x + 380 * e + 30 * Math.sin(k * 6), y: at.y - 1100 * e - 60 * easeOut(k), rot: at.rot + .9 * e, light };
  }
  function pinkyTip(t) { const o = bappaO(t); return bappaHand(o.x, o.y, BU, o, 1, 1.95); }

  // ---------------- Bappa ----------------
  // the arm angle that puts his fist on the bar (a bisection on bappaHand's height)
  function reachBar(o, s, barY) {
    let lo = -1.57, hi = .6;
    for (let i = 0; i < 18; i++) { const m = (lo + hi) / 2, h = bappaHand(o.x, o.y, BU, { ...o, [s < 0 ? 'aL' : 'aR']: m }, s); if (h[1] > barY) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  // trunk poses (in bappa()'s coordinates) for the crown lid, the laddoo grab and the chomp
  const LIDT = [[0, -11.2], [.8, -10.1], [2.2, -10.1], [3.5, -11.2], [4.1, -12.9], [3.8, -14.5], [3.2, -15.3]];
  const FLICK = [[0, -11.2], [.9, -10.2], [2.4, -10.4], [3.7, -11.8], [4.3, -13.8], [4.1, -16], [3.4, -17.2]];
  const GRABT = [[0, -11.2], [1, -10.3], [2.6, -10.6], [3.4, -12.4], [3.1, -14.6], [2, -16], [.9, -16.4]];
  const EAT = [[0, -11.2], [.15, -10.2], [-.1, -9.3], [-.55, -8.75], [-1.15, -8.85], [-1.35, -9.5]];
  function trunkKeys(t, keys) {
    let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
    const [t0, a] = keys[i], nx = keys[i + 1];
    if (!nx) return { trunk: a };
    const k = ease(seg(t, nx[0] - (nx[2] ?? .25), nx[0]));
    return k <= 0 ? { trunk: a } : { trunk: a, trunk2: nx[1], trunkK: k };
  }

  function bappaO(t) {
    const keys = [[0, 'nervous', { lookX: .7, lookY: -.8, hx: .25, emote: 'sweat' }], [SEE_A, 'surprised', { lookX: .7, lookY: -.9, hx: .25, emote: '!?' }], [3.0, 'nervous', { lookX: .6, lookY: -.7, hx: .25, emote: 'sweat' }],
      [INHALE[0], 'determined', { eyes: 'squeeze', mouth: 'pout', tint: 'flush', tintK: .7, emote: null }], [PEEK_B, 'nervous', { eyes: ['squeeze', 'look'], mouth: 'pout', lookX: .8, lookY: -.9, tint: 'flush', emote: null }],
      [GASP, 'surprised', { mouth: 'O', lookX: .7, lookY: -.8, emote: '!!' }], [SAD, 'sad', {}], [DET_B, 'determined', { lookX: .8 }],
      [CUT + .15, 'determined', { emote: null }], [GULP, 'nervous', { lookY: .7, emote: 'sweat' }], [NOD, 'determined', { lookY: .4 }],
      [TUG[0] - .15, 'angry', { eyes: 'squeeze', mouth: 'teeth', emote: null }], [SLIP + .03, 'surprised', { emote: '!' }], [LAND, 'dizzy', { eyes: 'swirl', mouth: 'wobble', emote: 'stars' }],
      [WAKE[0] + .15, 'determined', { emote: null }], [HEAVE - .12, 'angry', { eyes: 'squeeze', mouth: 'teeth', emote: null }], [HEAVE + .05, 'surprised', { lookY: -1, emote: '!?' }],
      [CATCH - .1, 'surprised', { lookY: -1, lookX: .5, emote: null }], [PROUD, 'proud', { lookY: -.8, lookX: .5 }], [FLEX, 'proud', { eyes: 'happy', mouth: 'grin', lookX: 1, hx: .55 }],
      [DTAKE, 'confused', { lookX: 1, hx: .6, emote: '?' }], [TOSS + .15, 'happy', { lookY: -.8, lookX: .6 }],
      [LOOK_L - .1, 'mischief', { lookX: -1, hx: -.5 }], [LOOK_R, 'mischief', { lookX: 1, hx: .5 }], [LID[0] - .05, 'excited', { lookY: -1, lookX: .3, emote: '!' }],
      [CHOMP, 'happy', { eyes: 'happy', mouth: 'cat', blush: .8, emote: 'hearts' }], [BEEP_END, 'surprised', { eyes: 'wide', mouth: 'pout', emote: null, blush: .3 }],
      [SLIDE, 'nervous', { eyes: 'look', lookX: -1, mouth: 'pout', emote: 'sweat' }], [INNOCENT, 'shy', { eyes: 'happy', mouth: 'smile', blush: .9, emote: null }]];
    const o = { ...bEmo(t, keys, { take: .8 }) };
    o.rot = 0; o.dx = 0; o.aL = -.75 + .05 * Math.sin(t * 2); o.aR = -.75 + .05 * Math.sin(t * 2 + 1.3);
    let x = G.dbX, y = G.FY;

    // ---- A / B: on the scale
    if (t < CUT) {
      x = G.scX; y = G.plY + 12 * pressAt(t);
      const inh = ease(seg(t, INHALE[0], INHALE[1])), gasp = t > GASP ? 1 : 0;
      o.belly = t < GASP ? lerp(1, .72, inh) : lerp(.72, 1.14, backOut(seg(t, GASP, GASP + .2))) + .1 * spring(t, GASP + .2, 5, 22);
      if (t > INHALE[0] && t < GASP) { o.sq = (o.sq || 0) - .06 * inh; o.dy = (o.dy || 0) - .35 * inh; o.aL = o.aR = -1.2; o.dx = .03 * Math.sin(t * 60) * seg(t, 4.9, 5.1); o.ear = -.2 * inh; }
      if (t > SAD && t < DET_B) { o.ear = -.3; o.trunk = 'down'; o.aL = o.aR = -1.25; }
      if (t > DET_B) { o.aL = o.aR = -.2 + .1 * gasp; o.ear = .3; }
      if (t > HOP_OFF[0]) {   // hop off to the right, toward the dumbbell
        const k = seg(t, HOP_OFF[0] + .05, HOP_OFF[1]), p = arcPt([G.scX, G.plY], [G.bandX, G.FY], 150, k);
        x = p[0]; y = p[1]; o.sq = t < HOP_OFF[0] + .05 ? .15 : -.12 * Math.sin(k * Math.PI); o.aL = o.aR = .6; o.noShadow = true;
      }
    }
    // ---- C: the sweatband (tails in his fists until the knot), the gulp, the nod
    if (t >= CUT && t < GRIP[0]) {
      x = G.bandX;
      if (t > STEP[0]) { const k = seg(t, STEP[0], STEP[1]), p = arcPt([G.bandX, G.FY], [G.dbX, G.FY], 110, ease(k)); x = p[0]; y = p[1]; o.sq = -.1 * Math.sin(k * Math.PI) + (t > STEP[1] - .05 ? .1 * Math.exp(-(t - STEP[1]) * 10) : 0); o.aL = o.aR = .5; o.lookX = 1; }
      if (t < KNOT) { const tw = .08 * Math.sin(t * 26) * seg(t, 7.6, 8.3); o.aL = 1.42 + tw; o.aR = 1.42 - tw; o.dy = (o.dy || 0) - .15 * Math.abs(Math.sin(t * 13)) * seg(t, 7.6, 8.3); }
      else { const k = backOut(seg(t, KNOT, KNOT + .18)); o.aL = o.aR = lerp(1.42, -.35, k); o.ear = .6 * Math.exp(-(t - KNOT) * 4); }
      if (t > GULP && t < GULP + .3) o.dy = (o.dy || 0) + .25 * bump(t, GULP + .12, .1, .15);
      if (t > NOD) o.dy = (o.dy || 0) + .35 * bump(t, NOD + .15, .12, .2);
    }
    // ---- D: grip, three tugs, the slip
    if (t >= GRIP[0] && t < SLIP) {
      const squat = ease(seg(t, GRIP[0], GRIP[1])), tug = TUG.reduce((m, e) => Math.max(m, bump(t, e, .12, .38)), 0);
      o.sq = .1 * squat - .2 * tug; o.dy = .1 * squat - .15 * tug; o.rot = -.03 * tug;
      o.ear = .3 + .9 * tug; o.trunk = tug > .3 ? 'up' : 'curl'; o.tintK = .5 + .5 * seg(t, TUG[0], TUG[2]);
      o.x = x; o.y = y;
      o.aL = reachBar(o, -1, G.dbY); o.aR = reachBar(o, 1, G.dbY); o.grip = true;
    }
    if (t >= SLIP && t < WAKE[0]) {   // hands slip: he flies back and lands flat on his back
      const k = seg(t, SLIP, LAND), e = easeOut(k);
      x = lerp(G.dbX, LIE_X, e); y = G.FY - 3.3 * BU * easeIn(k) - 60 * Math.sin(k * Math.PI);
      o.rot = lerp(0, -1.5, easeIn(k)) + (t > LAND ? .07 * spring(t, LAND, 5, 18) : 0);
      o.aL = o.aR = lerp(1.2, .4, seg(t, LAND, LAND + .3)); o.noShadow = true; o.ear = .4;
      if (t > LAND) { o.dy = -.3 * Math.abs(spring(t, LAND, 5, 16)); o.belly = 1.08 + .03 * Math.sin(t * 3); o.trunk = 'down'; o.sq = 0; }
    }
    // ---- F: up again, the heave, the pinky, the mirror
    if (t >= WAKE[0] && t < TOSS + 2) {
      const k = seg(t, WAKE[0], WAKE[1]);
      if (t < WAKE[1]) { const p = arcPt([LIE_X, G.FY - 3.3 * BU], [G.dbX, G.FY], 140, easeOut(k)); x = p[0]; y = p[1]; o.rot = lerp(-1.5, 0, backOut(k)); o.aL = o.aR = .8; o.noShadow = k < .9; }
      else if (t < HEAVE) {
        const sq = ease(seg(t, GRIP2, HEAVE - .05));
        o.sq = .12 * sq; o.dy = .1 * sq; o.x = x; o.y = y; o.aL = reachBar(o, -1, G.dbY); o.aR = reachBar(o, 1, G.dbY); o.grip = true; o.ear = .4 * sq;
      } else {
        // the heave overshoots into nothing: he tumbles back, then finds the dumbbell above and raises a pinky
        const tb = seg(t, HEAVE, HEAVE + .45);
        o.sq = -.2 * Math.exp(-(t - HEAVE) * 6); o.rot = -.28 * Math.sin(Math.PI * tb) * (1 - tb * .3); o.dy = -.8 * Math.sin(Math.PI * tb);
        o.aL = lerp(1.3, -.5, ease(seg(t, HEAVE + .3, 22.8))); o.aR = lerp(1.3, 1.1, ease(seg(t, HEAVE + .3, 22.7)));
        o.pinkyR = ease(seg(t, 22.6, 22.9)); o.ear = .5 * (1 - tb);
        if (t > CATCH) { o.sq = (o.sq || 0) + .08 * spring(t, CATCH, 6, 20); o.aR = 1.1 - .06 * spring(t, CATCH, 5, 16); }
        if (t > PROUD) { o.sq = (o.sq || 0) - .03; o.aL = lerp(-.5, -.95, ease(seg(t, PROUD, PROUD + .3))); }
        if (t > TO_MIR[0]) {   // hop right to the mirror, holding it up
          const kk = seg(t, TO_MIR[0], TO_MIR[1]);
          x = lerp(G.dbX, MIR_X, ease(kk)); o.dy = (o.dy || 0) - 1.4 * Math.sin(Math.PI * kk); o.sq = (o.sq || 0) - .05 * Math.sin(Math.PI * kk);
          if (kk >= 1) o.sq = (o.sq || 0) + .1 * spring(t, TO_MIR[1], 6, 18);
        }
        if (t > FLEX - .15) { const f = backOut(seg(t, FLEX - .15, FLEX + .1)) * (1 - ease(seg(t, TOSS, TOSS + .3))); o.flexL = f; o.aL = lerp(o.aL, .12, f); o.sq = (o.sq || 0) - .04 * f; }
        if (t > TOSS) { const f = seg(t, TOSS - .05, TOSS + .15); o.aR = lerp(1.1, 1.3, bump(t, TOSS, .08, .2)) - .5 * ease(seg(t, TOSS + .3, TOSS + .7)); o.pinkyR = 1 - ease(seg(t, TOSS + .3, TOSS + .6)); o.aL = lerp(o.aL, -.75, ease(seg(t, TOSS + .1, TOSS + .5))); }
      }
    }
    if (t >= TO_MIR[1]) x = MIR_X;
    // ---- G: the crown stash, the chomp, the freeze
    if (t >= TOSS + .6) {
      o.aL = -.8 + .04 * Math.sin(t * 2); o.aR = -.8 + .04 * Math.sin(t * 2 + 1);
      Object.assign(o, trunkKeys(t, [[0, TRUNKS.curl], [LID[0] - .05, LIDT, .35], [LID[0] + .12, FLICK, .12], [GRAB - .05, GRABT, .3], [SHUT + .05, GRABT, .1], [CHOMP - .02, EAT, .3], [CHOMP + .5, TRUNKS.curl, .35]]));
      o.crownOpen = t < SHUT ? backOut(seg(t, LID[0] + .05, LID[1])) : 1 - easeIn(seg(t, SHUT, SHUT + .1));
      if (t > SHUT + .1) o.crownTilt = .12 * spring(t, SHUT + .1, 6, 26);
      if (t > CHOMP && t < BEEP_END) { const ch = Math.abs(Math.sin((t - CHOMP) * 11)); o.sq = (o.sq || 0) + .03 * ch; o.mouth = ch > .5 ? 'cat' : 'o'; }
      if (t > BEEP_END) { o.sq = .05 * Math.exp(-(t - BEEP_END) * 8); o.dy = 0; o.rot = 0; o.aL = o.aR = -.9; o.belly = 1.1; }
      if (t > INNOCENT + .2) { const ch = Math.abs(Math.sin((t - INNOCENT) * 7)); o.sq = .02 * ch; o.htilt = .08 * ease(seg(t, INNOCENT, INNOCENT + .4)); }
      o.belly = t > GULP2 ? (o.belly ?? 1) + .05 * backOut(seg(t, GULP2, GULP2 + .2)) : o.belly;
    }

    // ---- the head hook: the sweatband from the tie on, and the laddoo stashed under the crown
    const band = t >= CUT - .02, stash = t > LOOK_L && t < GRAB;
    if (band || stash) {
      const heldHands = t < KNOT ? [-1, 1].map(s => { const h = bappaHand(0, 0, 1, { ...o, dx: 0, dy: 0, sq: 0, rot: 0, flip: false }, s); return [h[0] - clamp(o.hx || 0, -1, 1) * .5, h[1]]; }) : null;
      o.head = (u, sw) => {
        if (stash) laddoo(0, -15.95 * u, 1.25 * u, { key: 'stash' });
        if (band) sweatband(u, sw, 1, heldHands ? { held: heldHands } : { fly: t - KNOT });
      };
    }
    o.x = x; o.y = y;
    return o;
  }

  // ---------------- Mooshak, the coach ----------------
  function mooshakO(t) {
    const o = { eyes: 'normal', mouth: 'smile', lookX: -.5, aL: -.7, aR: -.7, seed: 3, flip: true };
    let [x, y] = MOO, cap = 'head', blow = 0;
    if (t < PULL_C[0]) return null;
    if (t > WHISTLE - .15 && t < WHISTLE + .5) { blow = bump(t, WHISTLE, .15, .45); o.eyes = 'closed'; o.mouth = null; o.aR = .3; }
    if (t > GRIP[0] && t < SLIP) {   // cheering on the beat, a toot on every tug
      const b = pulse(t, 5); o.aL = .9 + .5 * b; o.aR = -.2; o.dy = -.8 * b; o.eyes = 'happy'; o.mouth = 'open'; o.lookX = -1;
      blow = TUG.reduce((m, e) => Math.max(m, bump(t, e, .05, .3)), 0); if (blow > .2) { o.mouth = null; o.eyes = 'closed'; }
    }
    if (t >= SLIP && t < MOO_RUN[0]) { o.eyes = 'wide'; o.mouth = 'O'; o.emote = '!!'; o.emoteK = seg(t, SLIP + .05, SLIP + .2); o.emoteAge = t - SLIP; o.dy = -1.6 * Math.sin(Math.PI * seg(t, SLIP, SLIP + .4)); o.aL = o.aR = 1.2; o.lookX = 1; o.flip = false; x = lerp(MOO[0], MOO_FAN[0], ease(seg(t, SLIP, SLIP + .4))); cap = t < SLIP + .5 ? 'pop' : 'head'; }
    if (t >= MOO_RUN[0] && t < MOO_RUN[1]) { const k = ease(seg(t, MOO_RUN[0], MOO_RUN[1])); x = MOO_FAN[0]; o.dy = -.5 * Math.abs(Math.sin(k * Math.PI * 2)); o.eyes = 'sad'; o.mouth = 'wobble'; o.flip = false; o.lookX = 1; }
    if (t >= MOO_RUN[1]) { [x, y] = MOO_FAN; }
    if (t >= MOO_RUN[1] && t < WAKE[0]) {   // fanning Bappa's face with his cap
      o.eyes = 'sad'; o.mouth = 'wobble'; o.lookX = 1; o.lookY = -.3; o.flip = false;
      o.aR = .9 + .5 * Math.sin((t - MOO_RUN[1]) * 14); cap = 'fan';
      if (t > MOO_GASP) { o.eyes = 'wide'; o.mouth = 'O'; o.lookX = 1; o.lookY = -.7; o.emote = '!!'; o.emoteK = seg(t, MOO_GASP, MOO_GASP + .2); o.emoteAge = t - MOO_GASP; o.aR = o.aL = 1.1; cap = 'floor'; o.dy = -.5 * bump(t, MOO_GASP + .1, .1, .3); }
      if (t > SH_OUT[1]) { o.eyes = 'normal'; o.emote = null; }
    }
    if (t >= WAKE[0]) {
      o.flip = false; cap = 'floor'; o.lookX = .5; o.lookY = -.6; o.eyes = 'wide'; o.mouth = 'O';
      if (t > HEAVE) { o.lookY = -1; o.aL = o.aR = 1.2; }
      if (t > CATCH + .2) { o.eyes = 'shine'; o.mouth = 'open'; o.emote = 'stars'; o.emoteK = seg(t, CATCH + .2, CATCH + .4); o.emoteAge = t; }
    }
    o.x = x; o.y = y; o.cap = cap; o.blow = blow;
    return o;
  }
  // where a point on Mooshak (body-local u) is in the world
  const mooAt = (o, u, lx, ly) => [o.x + (o.dx || 0) * u + (o.flip ? -1 : 1) * lx * u, o.y + (o.dy || 0) * u + ly * u];
  function drawMooshak(t, o) {
    const u = MU;
    mooshak(o.x, o.y, u, { ...o, boilKey: 'moo' });
    const fx = o.flip ? -1 : 1;
    // the whistle: on its cord on his chest, or at his mouth when he blows
    const wm = o.blow > .05 ? mooAt(o, u, .2, -3.35) : mooAt(o, u, .15, -2.2);
    inkLine([mooAt(o, u, -.9, -3.1), mooAt(o, u, 0, -2.3), wm], .8, DX.cord, 'inkfine', .5);
    whistle(wm[0], wm[1], u * .55, { flip: o.flip, rot: o.blow > .05 ? -.15 * fx : .5 * fx, key: 'moo' });
    if (o.blow > .05) whistleMarks(wm[0] + fx * u * 1.4, wm[1], u * 1.2, o.blow < 1 ? .15 : .2, 'w' + Math.floor(t * 4));
    if (o.cap === 'head') { const h = mooAt(o, u, 0, -5.75); coachCap(h[0], h[1], u * .95, { flip: o.flip, rot: .05 * fx, key: 'moo' }); }
    if (o.cap === 'pop') { const h = mooAt(o, u, 0, -5.75), k = seg(t, SLIP, SLIP + .5); coachCap(h[0], h[1] - 90 * Math.sin(Math.PI * k), u * .95, { flip: o.flip, rot: 2 * k * fx, key: 'moo' }); }
    if (o.cap === 'fan') {
      const a = o.aR, hx = 1.5 + Math.cos(a) * 1.4, hy = -2.7 - Math.sin(a) * 1.4, h = mooAt(o, u, hx, hy);
      coachCap(h[0], h[1] - u * .6, u * .95, { flip: o.flip, rot: -(a - .9) * 1.2 * fx - .5 * fx, key: 'moo' });
    }
    if (o.cap === 'floor') coachCap(MOO_FAN[0] + 40, MOO_FAN[1] + 2, u * .95, { rot: .15, key: 'moo' });
  }

  // ---------------- Shiva, floating past ----------------
  function shivaO(t) {
    if (t < SH_IN[0] - .05 || t > SH_OUT[1] + .1) return null;
    const keys = [[0, 'serene'], [PEEK, 'serene', { eyes: ['closed', 'normal'], lookX: -.6, lookY: .8, mouth: 'smile' }], [SMIRK, 'serene', { eyes: ['closed', 'normal'], lookX: .5, lookY: .9, mouth: 'smirk' }],
      [SHH[0], 'happy', { eyes: 'normal', mouth: 'o', lookX: 0, lookY: 0 }], [S_WINK, 'happy', { eyes: ['closed', 'normal'], mouth: 'smirk', lookX: 0, lookY: 0 }], [SH_OUT[0], 'serene']];
    const o = { ...sEmo(t, keys, { take: .5 }) };
    const x = t < SH_IN[1] ? lerp(-280, SH_HOVER, easeOut(seg(t, SH_IN[0], SH_IN[1]))) : t < SH_OUT[0] ? SH_HOVER + 6 * Math.sin((t - SH_IN[1]) * 1.3) : lerp(SH_HOVER + 6 * Math.sin((SH_OUT[0] - SH_IN[1]) * 1.3), 1560, easeIn(seg(t, SH_OUT[0], SH_OUT[1])));
    o.x = x; o.y = SH_Y; o.dy = -.35 * Math.sin(t * 2.1) - .6 * seg(t, SH_OUT[0], SH_OUT[1]); o.float = 0;
    o.rot = .04 * Math.sin(t * 1.6) - .06 * (1 - seg(t, SH_IN[0], SH_IN[1])) + .05 * seg(t, SH_OUT[0], SH_OUT[1]);
    // the right hand holds the Trishul upright; it dips so the butt taps the bar, and comes back up
    const rest = [5.8, -5.5], up = [5.8, -6.3], tapY = (G.dbY - 12 - TRI / 2 - SH_Y) / SH_U - o.dy;
    o.handR = kf(t, [[SMIRK + .1, rest], [TAP - .18, up], [TAP, [5.8, tapY]], [TAP + .12, [5.8, tapY]], [TAP + .5, rest]], ease); o.bendR = 1.1; o.mudra = false;
    o.armR = (u, sw) => trishul(0, TRI / 2, TRI, { key: 'sh' });
    // "shh": the left hand comes up to his lips, one finger up
    if (t > SHH[0] - .3 && t < SH_OUT[0] + .3) {
      const k = ease(seg(t, SHH[0] - .3, SHH[0])) * (1 - ease(seg(t, SH_OUT[0] - .05, SH_OUT[0] + .3)));
      o.handL = [lerp(-5.6, -.35, k), lerp(-3.55, -9.35, k)]; o.bendL = 1.6; o.mudra = false;
      if (k > .6) o.armL = (u, sw) => paint(ribbon([[.05 * u, -.3 * u], [0, -1.3 * u], [.03 * u, -2.05 * u]], .5 * u, .4 * u), { wash: SHV.skin, ink: SHV.ink, sw: sw * .7 });
      o.snakeEyes = 'open'; o.snakeUp = .35 * k; o.snakeLook = .3;
    }
    return o;
  }

  // ---------------- the stage ----------------
  function stage(t) {
    const S = skyS(t), b = bappaO(t), m = mooshakO(t), sh = shivaO(t), db = dumbbellAt(t);
    gym(S);
    // the mirror, with his reflection inside once he's in front of it
    mirror(G.mrX, G.mrY, t > TO_MIR[0] + .15 ? () => {
      const r = { ...b, boilKey: 'refl', noShadow: true, flip: true, hx: b.hx, emote: null };
      if (t > R_WINK && t < R_WINK + .55) { r.eyes = ['wink', 'happy']; r.mouth = 'grin'; }
      if (t > DTAKE) { r.eyes = 'happy'; r.mouth = 'grin'; r.lookX = b.lookX; }
      const ru = 15.5, rx = G.mrX + 30, ry = G.mrY - 62;
      bappa(rx, ry, ru, r);
      const rd = dumbbellAt(t);
      if (t < TOSS + .5) { const tip = bappaHand(rx, ry, ru, r, 1, 1.95), rr = Math.PI - rd.rot, rs = DS * ru / BU; dumbbell(tip[0] + 349 * rs * Math.cos(rr), tip[1] + 349 * rs * Math.sin(rr), { s: rs, rot: rr, light: rd.light, key: 'refl' }); }
    } : null);
    weighScale(G.scX, G.scY, displayS(t));
    const dbShadow = () => { boilSeed('db shadow'); const h = clamp((G.dbY - db.y) / 500); if (t < TOSS + .8) paint(ellPts(db.x, G.FY + 4, 330 * DS * (1 - .5 * h), 26 * (1 - .5 * h), 20), { fill: PAL.ink, fillOp: 80 * (1 - .7 * h), bleed: .25, tex: .3, ink: null }); };
    const drawDB = () => dumbbell(db.x, db.y, { s: DS, rot: db.rot, light: db.light, key: 'db' });
    const lying = t > SLIP + .15 && t < WAKE[0] + .3;
    dbShadow();
    if (lying) drawDB();
    if (lying) { boilSeed('lie shadow'); paint(ellPts(LIE_X - 9.5 * BU, G.FY + 6, 11 * BU, 1.1 * BU, 20), { fill: PAL.ink, fillOp: 70, bleed: .25, tex: .3, ink: null }); }
    if (sh && sh.x < G.dbX) shiva(sh.x, sh.y, SH_U, { ...sh, boilKey: 'shiva' });
    bappa(b.x, b.y, BU, { ...b, boilKey: 'bappa', emote: lying ? null : b.emote });
    if (lying && b.emote) { const hd = bappaWorld(b.x, b.y, BU, b, 0, -12); emote(b.emote, hd[0], hd[1] - 5.5 * BU, BU * 1.1, b.emoteK ?? 1, b.emoteAge ?? t); }
    if (!lying) drawDB();
    if (b.grip) for (const s of [-1, 1]) { boilSeed('fist' + s); const h = bappaHand(b.x, b.y, BU, b, s); paint(ellPts(h[0], G.dbY + 2, .8 * BU, .72 * BU, 14, 1), { wash: tintCols({ ...b, col: b.col || BAP.skin, dk: b.dk, lt: b.lt }).col, ink: PAL.ink, sw: 1.1 }); }
    // the pinky, over the end of the bar it balances
    if (t > CATCH - .05 && t < TOSS + .15) {
      boilSeed('pinky');
      const P3 = [.75, 1.4, 2.05].map(e => bappaHand(b.x, b.y, BU, b, 1, e));
      paint(ribbon(P3, .44 * BU, .34 * BU), { wash: tintCols({ ...b, col: b.col || BAP.skin, dk: b.dk, lt: b.lt }).col, ink: PAL.ink, sw: 1 });
      sparkle(P3[2][0] + 18, P3[2][1] - 6, 30, t - CATCH, 'catch');
    }
    if (sh && sh.x >= G.dbX) shiva(sh.x, sh.y, SH_U, { ...sh, boilKey: 'shiva' });
    if (m) drawMooshak(t, m);
    // the laddoo in his trunk, from the grab to the chomp
    if (t > GRAB && t < GULP2) {
      const tip = bappaTrunkTip(b.x, b.y, BU, b);
      laddoo(tip[0], tip[1] + .3 * BU, 1.25 * BU, { key: 'held', bite: t > CHOMP ? 1 : 0, bg: DX.skyLow[3] });
    }
    // ---- effect marks
    for (const e of [...BEEPS, ...BEEP_X, ...END_BEEPS]) beepMarks(G.dX, G.dY, G.dR, t - e, 'b' + e);
    if (t < CUT) { for (const e of [SEE_A]) sweatDrops(b.x + 4 * BU, b.y - 16 * BU, BU, t - e - .1, 'see'); }
    for (const e of TUG) sweatDrops(b.x + 3.5 * BU, b.y - 15 * BU, BU, t - e, 'tug' + e);
    for (const e of TUG) sweatDrops(b.x - 3.5 * BU, b.y - 15 * BU, BU, t - e - .05, 'tugL' + e, -1);
    if (db.strain) strainMarks(db.x, db.y, 330 * DS, 120 * DS, t, db.strain, 'db');
    const crownTop = bappaWorld(b.x, b.y, BU, b, 0, -19.4);
    sparkle(crownTop[0] + 20, crownTop[1] + 10, 46, t - GLINT, 'glint');
    goldRing(G.dbX, G.dbY - 12, 130, t - TAP, 'tap');
    for (let i = 0; i < 4; i++) sparkle(G.dbX + [-165, 165, -65, 100][i], G.dbY - [70, 50, 115, 100][i], 26, t - TAP - .08 * i, 'tap' + i);
    if (db.speed) speedLines(db.x, db.y + 90, 260, db.speed, 'rocket');
    if (t > FLEX - .1) { const h = bappaHand(b.x, b.y, BU, b, -1); sparkle(h[0] - 30, h[1] + 40, 44, t - FLEX, 'flex'); sparkle(h[0] + 10, h[1] + 70, 26, t - FLEX - .12, 'flex2'); }
    if (t > LID[1] - .05) { const top = bappaWorld(b.x, b.y, BU, b, 0, -16.8); sparkle(top[0] + 40, top[1] - 10, 40, t - LID[1], 'reveal'); if (t < GRAB) glow(top[0], top[1] + 20, 90, '#FFD27A', .5 * seg(t, LID[0], LID[1])); }
    if (t > CHOMP) { const mo = bappaWorld(b.x, b.y, BU, b, -1.35, -9); crumbs(mo[0], mo[1], BU, t - CHOMP, 'c1'); crumbs(mo[0], mo[1], BU, t - GULP2, 'c2'); }
    return { b, db };
  }

  // ======================= A–B · 0–7.4 · the weigh-in, the suck-in, the hop off =======================
  function weighIn(t, lt) {
    const sh = shakeXY(t, 12 * bump(t, GASP + .05, .02, .3));
    const cx = kf(t, [[0, G.dX], [.9, G.dX], [2.3, 360], [INHALE[0], 355], [INHALE[1], 350], [GASP, 350], [DET_B, 355], [HOP_OFF[0], 370], [CUT, 510]]);
    const cy = kf(t, [[0, OPEN_CY], [.9, OPEN_CY], [2.3, 1047], [INHALE[0], 1055], [INHALE[1], 1095], [GASP, 1095], [DET_B, 1085], [CUT, 1120]]);
    const z = kf(t, [[0, OPEN_Z], [.9, OPEN_Z], [2.3, 1.45], [INHALE[0], 1.5], [INHALE[1], 1.8], [GASP, 1.8], [GASP + .3, 1.6], [DET_B, 1.6], [CUT, 1.5]]);
    camBegin(cx + sh[0], cy + sh[1], z);
    stage(t);
    const ds = toScreen(G.dX, G.dY);
    camEnd();
    // the loop point: the film opens (and ends) on the flashing modak, seen through a modak-shaped window
    if (lt < .6) modakIris(ds[0], ds[1] + 40, lerp(IRIS_H, 5200, easeIn(seg(lt, .05, .6))));
    caption('When the festival ends\nand the modaks catch up', 540, lt + .2, { life: 3.9, size: 70 });
    flushLetters();
    whipSmear(easeIn(seg(t, CUT - .22, CUT)), 1);
  }

  // ======================= C–G · 7.4–31.5 · the gym =======================
  function workout(t, lt) {
    const imp = 10 * bump(t, KNOT, .02, .2) + 8 * bump(t, LAND, .02, .25) + 6 * bump(t, HEAVE, .02, .2) + 5 * bump(t, TAP, .02, .15) + 5 * bump(t, BEEP_END, .02, .15);
    const sh = shakeXY(t, imp);
    const shF = [G.dbX - 87, SH_Y - 13 * SH_U];   // Shiva's face while he hovers
    const cx = kf(t, [[CUT, G.bandX + 10], [PULL_C[0], G.bandX + 10], [PULL_C[1], 930], [NOD, 930], [STEP[1], G.dbX], [SLIP, G.dbX], [LAND + .3, 925], [SH_IN[0], 925], [SH_IN[1], 950], [SHH[0] - .3, 965], [SHH[0], shF[0]], [SH_OUT[0], shF[0]], [SH_OUT[0] + .45, 990], [WAKE[1], G.dbX], [HEAVE, G.dbX], [TOP, G.dbX + 10], [CATCH, G.dbX + 20], [TO_MIR[0], G.dbX + 30], [TO_MIR[1] + .1, MIR_X + 225], [TOSS, MIR_X + 235], [TOSS + .9, MIR_X + 20], [BEEP_END, MIR_X + 15], [PUSH[0], MIR_X - 10], [PUSH[1], G.dX]]);
    const cy = kf(t, [[CUT, 1125], [PULL_C[0], 1135], [PULL_C[1], 1180], [NOD, 1180], [STEP[1], 1190], [SLIP, 1190], [LAND + .3, 1110], [SH_IN[0], 1110], [SHH[0] - .3, 1110], [SHH[0], shF[1] + 40], [SH_OUT[0], shF[1] + 40], [SH_OUT[0] + .45, 1110], [WAKE[1], 1180], [HEAVE, 1180], [TOP, 980], [CATCH, 1030], [TO_MIR[0], 1040], [TO_MIR[1] + .1, 1100], [TOSS, 1100], [TOSS + .9, 1090], [BEEP_END, 1085], [PUSH[0], 1080], [PUSH[1], OPEN_CY]]);
    const z = kf(t, [[CUT, 3.3], [PULL_C[0], 3.1], [PULL_C[1], 1.05], [NOD, 1.07], [STEP[1], 1.45], [SLIP, 1.48], [LAND + .3, 1.28], [SH_IN[0], 1.28], [SH_IN[1], 1.3], [SHH[0] - .3, 1.32], [SHH[0], 2.6], [SH_OUT[0], 2.7], [SH_OUT[0] + .45, 1.3], [WAKE[1], 1.45], [HEAVE, 1.45], [TOP, 1.1], [CATCH, 1.2], [TO_MIR[0], 1.2], [TO_MIR[1] + .1, 1.3], [TOSS, 1.32], [TOSS + .9, 2.0], [BEEP_END, 2.08], [PUSH[0], 2.1], [PUSH[1], OPEN_Z]], ease);
    const pan = seg(t, PUSH[0], PUSH[1]);
    camBegin(cx + sh[0], cy + sh[1], z + .006 * Math.sin(t * .7));
    stage(t);
    const ds = toScreen(G.dX, G.dY);
    camEnd();
    whipSmear(1 - easeOut(seg(t, CUT, CUT + .22)), 1);
    // the beep comes from off screen left: its red light spills in
    if (t > BEEP_END && t < PUSH[0] + .2) { const f = displayS(t).flash; if (f > .05) glow(-40, 820, 520, '#FF6A5A', .6 * f); }
    if (t > PUSH[0]) whipSmear(.8 * Math.sin(Math.PI * clamp((pan - .15) / .6)), -1);
    caption('Day 1 of detox.\nAlso the last.', 530, t - STING, { life: IRIS[0] + .1 - STING, size: 76 });
    flushLetters();
    if (t > IRIS[0]) modakIris(ds[0], ds[1] + 40, lerp(5200, IRIS_H, easeOut(seg(t, IRIS[0], IRIS[1]))));
  }

  shots([[0, weighIn], [CUT, workout]]);
})();
