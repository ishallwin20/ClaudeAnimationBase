// phone.js: "This Is Why The Gita Says / Be Like A Tortoise" (Fable style, FABLE_GUIDE.md; an original modern fable on
// Bhagavad Gita 2.58: as a tortoise draws in its limbs, the wise draw their senses in from what pulls at them).
// A teenage monkey in a red hoodie scrolls on a branch all afternoon; his friends call him to play and he waves them off;
// a buzz knocks the phone out of his hands onto an old tortoise, who answers every buzz by calmly drawing in her legs,
// then her head. He tries it, fails comically (his own tail sneaks off for the phone), and finally shuts the phone in a
// tree hollow under a leaf, looks up, and finds a sunset and his friends. One continuous set, a moving camera.
// Beats: src/scenes/phone_tl.js (TL). The cast, the bubbles and the frame: src/fable.js. STORYBOARD.md has the plan.
(() => {
  const HEADLINE = ['This Is Why The Gita Says', 'Be Like A *Tortoise*'];
  FABLE.pencil = 'pen'; FABLE.pencilW = .62; FABLE.pencilCol = '#4E4842';   // clean lines: the HB grain turns to dots at this zoom
  const life = fableLife, popIn = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const blinkAt = (t, ts, d = .12) => ts.some(b => t > b && t < b + d);
  const GY = 1300, BRANCH = 972, TRUNK = 250, HOLLOW = [292, 1238];
  const TX = 735, TU = 24, MU = 20;          // the tortoise (faces left, at her rock), the unit sizes
  const MX0 = 440;                           // the monkey's seat on the branch

  // ---- the light: afternoon to sunset, over the whole reel (he scrolls the day away)
  const dusk = t => .3 * ease(seg(t, 7, 22)) + .7 * ease(seg(t, TL.REVEAL - .9, TL.REVEAL + 1.0));   // late afternoon, then the sky blooms as he looks up
  const sunPos = t => [905, lerp(560, 1090, dusk(t))];
  function set(t) {
    const k = dusk(t);
    boilSeed('sky');
    paint(rectPts(-300, 300, W + 600, 1300), { wash: mixCol('#E9DABE', '#EC8F5E', k), ink: null });
    paint(rectPts(-300, 900, W + 600, 300), { fill: mixCol('#F4EAD6', '#F9C77E', k), fillOp: 200, bleed: .3, tex: .2, border: .3, ink: null });
    for (let i = 0; i < 5; i++) {   // long soft clouds
      const x = ((hash(i * 7.3) * 1500 - t * (4 + i)) % 1500 + 1500) % 1500 - 250, y = 650 + hash(i * 3.1) * 330;
      boilSeed('cloud' + i);
      paint(ellPts(x, y, 130 + 80 * hash(i * 1.7), 18 + 10 * hash(i * 2.9), 18, 3), { fill: mixCol('#F7EFE0', '#F6B98A', k), fillOp: 170, bleed: .2, tex: .3, border: .3, ink: null });
    }
    // the sun, sinking behind the far hills
    const [sx, sy] = sunPos(t), sr = lerp(48, 78, k);
    boilSeed('sun'); paint(ellPts(sx, sy, sr, sr, 30), { wash: mixCol('#FFF4CF', '#FF9A4C', k), ink: null });
    if (k > .3) glow(sx, sy, sr * 3.2, '#FFB060', .55 * k);
    boilSeed('hills');
    paint([[-300, 1130], [80, 1080], [330, 1110], [600, 1060], [860, 1100], [1100, 1070], [1400, 1110], [1400, 1200], [-300, 1200]], { wash: mixCol('#D6C29E', '#B36A5E', k), ink: null, curv: .5 });
    paint([[-300, 1160], [200, 1130], [520, 1150], [800, 1125], [1400, 1150], [1400, 1220], [-300, 1220]], { wash: mixCol('#CDB48A', '#9C5A50', k), ink: null, curv: .5 });
    boilSeed('ground'); paint(rectPts(-300, 1175, W + 600, 600), { wash: mixCol('#CBA872', '#A8724E', k), ink: null });
    paint(rectPts(-300, GY - 8, W + 600, 30), { fill: mixCol('#B9955F', '#946044', k), fillOp: 120, bleed: .15, tex: .4, ink: null });
    boilSeed('grass');
    for (let i = 0; i < 22; i++) { const x = -100 + i * 60 + hash(i) * 30, y = GY + 10 + hash(i * 3) * 120; inkLine([[x, y], [x + 4, y - 14 - hash(i * 5) * 10]], 1.4, mixCol('#8E8A4E', '#6E5A38', k), 'inkfine', 0); }
  }
  // the tree: trunk on the left, a branch out to the right, a canopy above (drawn before the cast)
  function tree(t, leafK) {
    const k = dusk(t), bark = mixCol('#7C5A3C', '#5A3A2E', k), barkDk = mixCol('#5E412A', '#43291F', k), leaf = mixCol('#8DA05A', '#6D6E3E', k), leafDk = mixCol('#6E8446', '#545632', k);
    boilSeed('trunk');
    paint([[TRUNK - 70, GY + 10], [TRUNK - 50, 1150], [TRUNK - 55, 900], [TRUNK - 45, 500], [TRUNK + 45, 500], [TRUNK + 50, 900], [TRUNK + 60, 1150], [TRUNK + 85, GY + 10]], { wash: bark, ink: PAL.ink, sw: 1.2, curv: .3 });
    for (let i = 0; i < 6; i++) inkLine([[TRUNK - 25 + i * 9, 1240 - i * 90], [TRUNK - 20 + i * 9, 1170 - i * 90]], 1, barkDk, 'inkfine', .3);
    boilSeed('branch');
    paint(ribbon([[TRUNK + 20, BRANCH + 14], [450, BRANCH + 8], [640, BRANCH + 2], [780, BRANCH - 12]], 34, 14), { wash: bark, ink: PAL.ink, sw: 1.1 });
    inkLine([[700, BRANCH - 4], [740, BRANCH - 40], [770, BRANCH - 48]], 3, bark, 'ink', .4);
    boilSeed('hollow'); paint(ellPts(HOLLOW[0], HOLLOW[1], 26, 36, 18), { wash: '#2E2028', ink: PAL.ink, sw: 1 });
    boilSeed('canopy');
    for (let i = 0; i < 9; i++) {
      const x = 20 + i * 95 + hash(i * 2.2) * 30, y = 610 + hash(i * 4.4) * 120 + (i > 5 ? (i - 5) * 25 : 0), r = 110 + hash(i) * 40;
      if (x > 900) continue;
      paint(ellPts(x, y, r, r * .62, 18, 6), { wash: i % 2 ? leaf : leafDk, ink: null });
    }
    for (let i = 0; i < 10; i++) { const x = 60 + i * 80, y = 720 + hash(i * 9) * 70; inkLine([[x, y], [x + 18, y + 10], [x + 36, y + 4]], 1.2, leafDk, 'inkfine', .5); }
  }
  // the leaf she lays over the hollow (after he stuffs the phone in); it twitches when the phone buzzes inside
  function hollowLeaf(t) {
    if (t < TL.LEAF) return;
    const k = popIn(t, TL.LEAF, 6), bz = t > TL.LEAFBUZZ && t < TL.LEAFBUZZ + .5 ? Math.sin(t * 90) * 3 : 0;
    boilSeed('hleaf'); push(); translate(HOLLOW[0] + bz, HOLLOW[1]); rotate(-.25); scale(k);
    paint([[-6, -52], [26, -30], [34, 6], [16, 44], [-4, 52], [-24, 30], [-30, -4], [-22, -36]], { wash: '#7E9A4A', ink: PAL.ink, sw: 1, curv: .5 });
    inkLine([[-2, -48], [2, 0], [-2, 48]], 1, '#5C7434', 'inkfine', .4);
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) inkLine([[1, -20 + i * 20], [s * 18, -30 + i * 20]], .8, '#5C7434', 'inkfine', 0);
    pop();
  }

  // ---- the phone: where it is and what it's doing
  // held (local u in his hands) until the fumble; then it falls onto her shell, bounces to the ground, buzz-walks to her
  const HOLD = [4.3, -1.7];
  function phoneLocal(t) {   // in the monkey's hands on the branch
    let p = HOLD.slice(), r = -.35;
    if (t > TL.JOLT - .05) {
      const a = t - TL.JOLT;
      p = kf(t, [[TL.JOLT, HOLD], [TL.JOLT + .14, [4.5, -6.6]], [TL.JOLT + .3, [3.6, -4.5]], [TL.JOLT + .42, [5.2, -6.0]], [TL.FUMBLE1, [5.6, -3.4]]], easeOut);
      r = -.35 + a * 9;
    }
    return { p, r };
  }
  const MSIT = { pose: 'sit', footN: [1.5, 2.3], footF: [.9, 2.4], kneePref: [1, .2], noShadow: true };
  const shellTop = [TX, GY - 5.3 * TU], PH_GROUND = [565, GY - 6], PH_WALKED = [598, GY - 6];
  function phoneWorld(t, mo) {
    if (t < TL.FUMBLE1) { const { p, r } = phoneLocal(t); const w = mkWorld(MX0, BRANCH + 3, MU, mo, p); return { x: w[0], y: w[1], r, held: true }; }
    const p0w = phoneWorld(TL.FUMBLE1 - 1e-3, mo);
    if (t < TL.BONK) { const k = seg(t, TL.FUMBLE1, TL.BONK), a = k * k; return { x: lerp(p0w.x, shellTop[0] - 10, k), y: lerp(p0w.y, shellTop[1] - 8, a), r: p0w.r + k * 7 }; }
    if (t < TL.LAND_PH) { const k = seg(t, TL.BONK, TL.LAND_PH), q = arcPt([shellTop[0] - 10, shellTop[1] - 8], PH_GROUND, 70, k); return { x: q[0], y: q[1], r: 1.2 + k * 4.2 }; }
    if (t < TL.WALK0) return { x: PH_GROUND[0], y: PH_GROUND[1], flat: true };
    if (t < TL.GRAB) { const k = seg(t, TL.WALK0, TL.WALK1); return { x: lerp(PH_GROUND[0], PH_WALKED[0], k) + (t < TL.WALK1 ? Math.sin(t * 70) * 2 : 0), y: PH_WALKED[1], flat: true }; }
    return null;   // in his hand (drawn by the monkey)
  }
  const buzzAt = (t, ts, d = .35) => ts.reduce((s, b) => Math.max(s, t > b && t < b + d ? 1 - (t - b) / d * .4 : 0), 0);
  const ALL_BUZZ = [...TL.BUZZ_A, TL.JOLT, TL.BUZZ_LEGS, TL.BUZZ_HEAD, TL.BUZZ_C1, ...TL.BUZZ_C2];
  function phoneBuzz(t) { return Math.max(buzzAt(t, ALL_BUZZ), t > TL.WALK0 && t < TL.WALK1 ? 1 : 0, t > TL.TEMPT0 && t < TL.TEMPT1 ? .6 * (Math.sin(t * 5) > .3 ? 1 : 0) : 0, t > TL.GRAB && t < TL.STUFF ? .8 : 0); }
  function drawPhoneWorld(t, mo) {
    const ph = phoneWorld(t, mo); if (!ph || ph.held) return;
    if (t > TL.STUFF) return;
    fablePhone(ph.x, ph.y, ph.flat ? 66 : 50, { flat: ph.flat, rot: ph.r || 0, buzz: phoneBuzz(t), on: 1, dot: true });
  }

  // ---- the old tortoise (faces left, toward him): meditating, tucking in at each buzz
  function tortoiseO(t) {
    const o = { boilKey: 'granny', flip: true, brows: 1, eyes: 'closed', mouth: 'smile', lid: .5, lookX: .6, lookY: .2, neck: .35, neckA: .15 };
    // in and out of the shell: keys of [time, legs, head]
    const tuck = [[0, 0, 0], [TL.BUZZ_LEGS, 0, 0], [TL.BUZZ_LEGS + .25, 1, 0], [TL.BUZZ_HEAD, 1, 0], [TL.BUZZ_HEAD + .22, 1, 1], [TL.POPOUT, 1, 1], [TL.POPOUT + .18, 1, 0], [TL.POPOUT + .32, 0, 0],
      [TL.BUZZ_C1, 0, 0], [TL.BUZZ_C1 + .3, 1, 1], [TL.REMIND1, 1, 1], [TL.REMIND1 + .25, 0, 0], [TL.TUCKEND, 0, 0], [TL.TUCKEND + .3, 0, 1]];
    const tk = kf(t, tuck.map(([a, b, c]) => [a, [b, c]]), ease); o.tuckLegs = tk[0]; o.tuckHead = tk[1];
    if (t > TL.BONK) { const s = spring(t, TL.BONK, 8, 30); o.sq = .12 * s; }
    if (t > TL.ONE_EYE && t < TL.BUZZ_HEAD) { o.eyes = 'normal'; o.lid = .62; o.lookX = .8; o.lookY = .5; o.mouth = 'flat'; }
    if (t > TL.POPOUT && t < TL.SIT + .2) { o.eyes = 'normal'; o.lid = .45; o.lookX = .9; o.lookY = -.3; o.mouth = 'smile'; o.neck = .5; o.neckA = -.05; }
    if (t > TL.SHELL0 + .3 && t < TL.SHELL1) o.htilt = .08 * Math.sin((t - TL.SHELL0) * 3);
    if (t > TL.REMIND1 && t < TL.REVEAL) { o.eyes = 'normal'; o.lid = .4; o.lookX = .9; o.lookY = -.2; o.mouth = 'smile'; o.neck = .45; }
    if (t > TL.STUFF && t < TL.REVEAL) { o.lookX = .4; o.lookY = .1; }
    if (t > TL.REVEAL) { o.eyes = 'normal'; o.lid = .35; o.lookX = -.9; o.lookY = -.4; o.mouth = 'smile'; o.neck = .5; o.neckA = -.1; }
    if (t > TL.SWING1 - .3) { o.lookX = -.6; o.lookY = -.7; }
    if (t > TL.HEART0 + .2) { o.eyes = 'happy'; }
    if (blinkAt(t, [15.7, 24.9, 28.4, 30.2])) o.eyes = 'closed';
    return o;
  }

  // ---- the monkey
  function monkeyNow(t) {
    // returns { x, y, o } in world, for each stretch of the story
    const o = { boilKey: 'kapi', eyes: 'normal', lid: .4, lookX: .7, lookY: .8, mouth: 'flat' };
    let x = MX0, y = BRANCH + 3;
    if (t < TL.JUMP0) {
      Object.assign(o, MSIT, { hunch: .7, htilt: .3 });
      o.light = ['#A9CFF6', .22];
      const { p } = phoneLocal(t); o.handN = p.slice(); o.handF = [p[0] - .3, p[1] + .2];
      // the thumb flicks while he scrolls
      if (t < TL.JOLT) { const f = Math.max(0, Math.sin(t * 7.5)) ** 6; o.handN = [p[0] + .1, p[1] - .25 * f]; }
      const kick = Math.sin(t * 9);
      if (t > TL.GRIN && t < TL.SHOW0) { o.eyes = 'happy'; o.mouth = 'grin'; o.footN = [1.5 + .4 * kick, 2.2 - .3 * Math.max(0, kick)]; }
      if (t > TL.LAUGH && t < TL.CAT1 + .1) { o.eyes = 'squeeze'; o.mouth = 'laugh'; o.dy = -.15 * Math.abs(Math.sin(t * 16)); o.handF = [1.6, -2.4 - .6 * Math.abs(Math.sin(t * 8))]; }
      if (t > TL.SULK) { const k = ease(seg(t, TL.SULK, TL.SULK + .6)); o.eyes = 'sad'; o.lid = .5; o.mouth = k > .5 ? 'wobbly' : 'flat'; o.hunch = .75 + .15 * k; o.footN = [1.5, 2.3]; }
      if (t > TL.PLAY0 && t < TL.SHRUG) { o.eyes = 'normal'; o.lid = .5; o.mouth = 'flat'; }
      if (t > TL.NOTNOW && t < TL.SHRUG) { const k = ease(seg(t, TL.NOTNOW, TL.NOTNOW + .2)) * (1 - ease(seg(t, TL.SHRUG - .25, TL.SHRUG))); o.handF = [lerp(o.handF[0], 2.6, k), lerp(o.handF[1], -7.2, k)]; o.elbowF = [-1, .3]; }
      if (t > TL.TIRED) { const k = ease(seg(t, TL.TIRED, TL.TIRED + .5)); o.eyes = 'tired'; o.lid = .6; o.mouth = 'flat'; o.hunch = .85 + .15 * k; }
      for (const b of TL.BUZZ_A) if (t > b) { const s = Math.exp(-(t - b) * 9); o.hlean = (o.hlean || 0) + .12 * s; o.eyes = t < b + .25 ? 'wide' : o.eyes; }
      if (t > TL.JOLT) {   // the phone jumps out of his hands: he juggles it, and loses it
        const { p } = phoneLocal(t); o.handN = [p[0] - .2, p[1] + .3]; o.handF = [p[0] - .7, p[1] + .5]; o.eyes = 'wide'; o.lid = 0; o.mouth = 'o'; o.hunch = .4; o.light = null; o.lookY = -.2;
        if (t > TL.FUMBLE1) { const k = seg(t, TL.FUMBLE1, TL.FUMBLE1 + .3); o.handN = [lerp(o.handN[0], 5.5, k), lerp(o.handN[1], -1.5, k)]; o.lookY = 1; o.lookX = .8; o.mouth = 'open'; }
      }
      if (blinkAt(t, [.6, 3.0, 6.8, 8.95, 10.7])) o.eyes = 'closed';
      o.lookY = o.lookY ?? .8;
    } else if (t < TL.SIT) {
      // jumps down, reaches for the phone, freezes at her trick, scratches his head
      const land = [470, GY], k = seg(t, TL.JUMP0, TL.JUMP1);
      Object.assign(o, { pose: 'stand', noShadow: t < TL.JUMP1 - .1, eyes: 'wide', lid: 0, mouth: 'o', lookX: .8, lookY: .6 });
      if (t < TL.JUMP1) { const q = arcPt([MX0, BRANCH + 3 - 2.6 * MU], land, 90, easeOut(k)); x = q[0]; y = q[1]; o.handN = [1.6, -10.5]; o.handF = [-1.4, -10.2]; o.footN = [.9, -.8]; o.footF = [-.6, -.6]; }
      else {
        x = land[0]; y = land[1]; const j = jump(t, TL.JUMP1 - 1, TL.JUMP1, 0); o.sq = j.sq;
        const reach = ease(seg(t, TL.JUMP1 + .1, TL.JUMP1 + .4)) * (1 - ease(seg(t, TL.BUZZ_HEAD, TL.BUZZ_HEAD + .3)));
        o.lean = .55 * reach; o.handN = [lerp(1.3, 4.2, reach), lerp(-4.6, -5.0, reach)];
        if (t > TL.BUZZ_HEAD) { o.eyes = 'normal'; o.lid = .1; o.mouth = 'flat'; o.lookX = .9; o.lookY = .3; }
        if (t > TL.HUH) o.brows = .6;
        if (t > TL.WALK0) { o.lookX = .5 + .5 * Math.sin((t - TL.WALK0) * 6); o.lookY = .7; }
        if (t > TL.WALK0 + .3 && t < TL.POPOUT) { const s = Math.sin(t * 22); o.handF = [1.4 + .2 * s, -11.4]; o.elbowF = [-1, -.2]; }   // scratching his head
        if (t > TL.POPOUT) { o.eyes = 'wide'; o.lookX = .8; o.lookY = .1; o.brows = .8; o.mouth = 'o'; }
        if (t > TL.SHELL0 + .2) { o.eyes = 'normal'; o.lid = .15; o.lookY = -.6; o.lookX = .6; o.mouth = 'flat'; o.brows = .3; }
        if (t > TL.SHELL1 - .4) { o.brows = .9; o.mouth = 'o'; }
        if (t > TL.NOD) { o.htilt = .2 * Math.max(0, Math.sin((t - TL.NOD) * 14)); o.mouth = 'smile'; o.eyes = 'normal'; o.lookY = .2; }
        if (blinkAt(t, [14.1, 16.3])) o.eyes = 'closed';
      }
    } else if (t < TL.STAND) {
      // sits and tucks up like her; fails; tries again
      x = 470; y = GY;
      Object.assign(o, { pose: 'sit', lookX: .6, lookY: .4, eyes: 'normal', lid: .2, mouth: 'smile' });
      const tk = ease(seg(t, TL.TUCK, TL.TUCK + .45));
      const ball = { footN: [1.4, -.2], footF: [1.0, -.15], handN: [2.4, -2.6], handF: [2.1, -2.8] };
      o.footN = [lerp(2.35, ball.footN[0], tk), lerp(-.3, ball.footN[1], tk)]; o.footF = [lerp(1.75, ball.footF[0], tk), lerp(-.25, ball.footF[1], tk)];
      o.handN = [lerp(2.0, ball.handN[0], tk), lerp(-2.2, ball.handN[1], tk)]; o.handF = [lerp(1.0, ball.handF[0], tk), lerp(-2.4, ball.handF[1], tk)];
      o.lean = .3 * tk; o.hlean = .25 * tk;
      if (t < TL.TUCK + .1) o.sq = .15 * spring(t, TL.SIT, 9, 26);
      if (t > TL.TUCK + .2) { o.eyes = 'squeeze'; o.mouth = 'tight'; }
      if (t > TL.PROUD && t < TL.BUZZ_C1) { o.eyes = 'happy'; o.mouth = 'smile'; }
      if (t > TL.BUZZ_C1 && t < TL.SLAP + .3) {   // one eye pops, the hand shoots out for the phone; the other hand slaps it back
        const out = ease(seg(t, TL.SNAP, TL.SNAP + .14)) * (1 - ease(seg(t, TL.SLAP, TL.SLAP + .15)));
        o.eyes = 'wide'; o.lid = 0; o.lookX = 1; o.lookY = .6; o.mouth = 'o'; o.hlean = .1;
        o.handN = [lerp(ball.handN[0], 5.4, out), lerp(ball.handN[1], -1.6, out)]; o.lean = .3 + .3 * out;
        if (t > TL.SLAP - .1) { o.handF = [lerp(3.8, ball.handF[0], seg(t, TL.SLAP + .05, TL.SLAP + .3)), -2.0]; o.eyes = 'squeeze'; o.mouth = 'tight'; }
      }
      if (t > TL.SLAP + .3) { o.eyes = 'squeeze'; o.mouth = 'tight'; }
      if (t > TL.TAIL0 && t < TL.YANK + .4) {   // his tail sneaks off for the phone on its own
        const ph = PH_WALKED, k = ease(seg(t, TL.TAIL0, TL.TAIL1)) * (1 - ease(seg(t, TL.YANK, TL.YANK + .25)));
        o.tailTo = [(ph[0] - x) / MU, -.2]; o.tailK = k; o.tailSway = 0;
        if (t > TL.CAUGHT) { o.eyes = 'wide'; o.lid = 0; o.lookX = -1; o.lookY = .6; o.mouth = 'o'; o.htilt = -.15; }
        if (t > TL.YANK) { o.handF = [-1.6, -1.4]; o.eyes = 'normal'; o.lookX = -.8; o.mouth = 'grin'; o.brows = .5; }
      }
      if (t > TL.TEMPT0 && t < TL.TEMPT1) { o.eyes = 'squeeze'; o.mouth = 'tight'; o.twitch = 1; o.brows = 1; o.dx = .06 * Math.sin(t * 40); }
      if (t > TL.TEMPT0 + .5 && t < TL.TEMPT1) { o.eyes = 'normal'; o.lid = .3; o.lookX = 1; o.lookY = .5; o.handN = [lerp(2.4, 3.4, .5 + .5 * Math.sin(t * 4)), -2.4]; }
      if (t > TL.REMIND0) { o.eyes = 'normal'; o.lid = .25; o.lookX = 1; o.lookY = -.1; o.mouth = 'flat'; o.brows = 0; o.twitch = 0; o.hlean = .05; }
      if (t > TL.REMIND0 + .7) { o.mouth = 'smile'; o.lid = .35; }
      if (t > TL.BREATHE) { const a = seg(t, TL.BREATHE, TL.BREATHE + .3), b = seg(t, TL.BREATHE + .3, TL.STAND); o.sq = -.07 * Math.sin(a * Math.PI / 2) * (1 - b); o.eyes = 'closed'; o.mouth = b > 0 ? 'smile' : 'tight'; }
      if (blinkAt(t, [18.0, 23.6])) o.eyes = 'closed';
    } else if (t < TL.REVEAL) {
      // stands, holds the phone out at arm's length, walks it to the hollow, stuffs it in, dusts his hands
      Object.assign(o, { pose: 'stand', eyes: 'normal', lid: .2, mouth: 'tight', lookX: .8, lookY: .5, brows: -.4 });
      o.sq = .12 * spring(t, TL.STAND, 9, 26); y = GY;
      x = lerp(470, 515, ease(seg(t, TL.STAND + .05, TL.GRAB - .05)));
      if (t < TL.GRAB) o.walk = (x - 470) / (3 * MU);
      if (t > TL.GRAB - .15 && t < TL.LIFT + .1) { const k = ease(seg(t, TL.GRAB - .15, TL.GRAB)) * (1 - ease(seg(t, TL.LIFT - .05, TL.LIFT + .1))); o.lean = .95 * k; o.handN = [lerp(1.0, (PH_WALKED[0] - x) / MU, k), lerp(-4.6, -.6, k)]; o.lookY = 1; }
      const holding = t > TL.GRAB;
      if (t > TL.LIFT) {   // phone held out and away, face turned from it
        o.handN = [3.6, -8.6]; o.lookX = -1; o.lookY = .2; o.eyes = 'squeeze'; o.mouth = 'tight'; o.htilt = -.15;
        if (t > TL.TURN) { o.flip = true; x = lerp(515, 360, ease(seg(t, TL.WALKH0, TL.WALKH1))); o.walk = (515 - x) / (3 * MU); }
        if (t > TL.STUFF - .1) { const k = ease(seg(t, TL.STUFF - .1, TL.STUFF + .1)); o.handN = [lerp(3.6, (x - HOLLOW[0]) / MU, k), lerp(-8.6, (HOLLOW[1] - GY) / MU, k)]; o.lean = .35 * k; o.eyes = 'normal'; o.lookX = .8; o.lookY = .6; o.htilt = 0; }
        if (t > TL.LEAF - .05) { o.handF = [(x - HOLLOW[0]) / MU + .3, (HOLLOW[1] - GY) / MU - .2]; o.handN = [2.0, -4.5]; o.lean = .3; o.mouth = 'smile'; o.brows = 0; }
        if (t > TL.DUST) { const c = Math.abs(Math.sin((t - TL.DUST) * 22)); o.handN = [1.8, -5.0 + c * .3]; o.handF = [1.6, -5.0 - c * .3]; o.lean = 0; o.eyes = 'happy'; o.mouth = 'smile'; }
        if (t > TL.DUST + .35) { o.handN = [1.2, -4.4]; o.handF = [-.6, -4.4]; o.eyes = 'normal'; o.lookX = .8; o.lookY = 0; }
      }
      if (holding && t < TL.STUFF) o.held = (u, sw) => { const h = mkRig(o).armN[2]; fablePhone(h[0] * u, h[1] * u - u * .6, u * 2.4, { rot: .2, buzz: phoneBuzz(t), on: 1, dot: true }); };
    } else {
      // the sunset; then he leaps for the vine and swings away with his friends
      Object.assign(o, { pose: 'stand', eyes: 'sparkle', mouth: 'o', lookX: .7, lookY: -.8, light: ['#FF9A50', .3 * dusk(t)], htilt: -.15 });
      x = lerp(360, 415, ease(seg(t, TL.REVEAL, TL.REVEAL + .5))); y = GY;
      if (t < TL.REVEAL + .5) o.walk = (x - 360) / (3 * MU);
      o.sq = .04 * Math.sin((t - TL.REVEAL) * 2);
      if (t > TL.FRIENDS2) { o.mouth = 'grin'; o.eyes = 'happy'; o.lookX = .9; o.lookY = -.5; }
      if (t > TL.VINE) { o.eyes = 'wide'; o.mouth = 'grin'; o.handF = [.4, -12.8]; o.elbowF = [-1, 0]; o.lookY = -1; }
      if (t > TL.LEAP - .12) { const j = jump(t, TL.LEAP, TL.CATCH, 2.5); o.sq = j.sq; o.dy = j.dy; }
      if (t > TL.CATCH) return { vine: true, o };
    }
    return { x, y, o };
  }

  // the free vine he catches, and the pendulum that carries him off
  const PIV = [700, 360];
  let CATCHPT = null;   // his raised hand at the catch (world), set on first use
  const catchPt = () => CATCHPT || (CATCHPT = (() => { const m = monkeyNow(TL.CATCH - 1e-3); return monkeyHand(m.x, m.y, MU, m.o, 'f'); })());
  const VL = () => Math.hypot(catchPt()[0] - PIV[0], catchPt()[1] - PIV[1]), A0 = () => Math.atan2(catchPt()[0] - PIV[0], catchPt()[1] - PIV[1]);
  const vineAng = t => t < TL.CATCH ? lerp(.9, A0(), easeOut(seg(t, TL.VINE, TL.CATCH))) : lerp(A0(), 1.35, ease(seg(t, TL.CATCH, TL.SWING1)));
  const vineEnd = t => { const a = vineAng(t); return [PIV[0] + Math.sin(a) * VL(), PIV[1] + Math.cos(a) * VL()]; };
  function vine(p0, p1, key) { boilSeed(key); inkLine([p0, [lerp(p0[0], p1[0], .5) + 10, lerp(p0[1], p1[1], .5)], p1], 4.5, '#5F7838', 'ink', .4); }
  // a monkey hanging by his near hand from (hx, hy), swinging at angle a
  function hangFrom(hx, hy, u, o, a) {
    o = { pose: 'stand', handF: [-.2, -12.6], handN: [3.0, -5.4], footN: [.6, .4], footF: [-.5, .6], kneePref: [1, .3], noShadow: true, rot: -a * .9, ...o };
    const h = monkeyHand(0, 0, u, o, 'f'); monkey(hx - h[0], hy - h[1], u, o);
  }

  // ---- the friends: two monkeys who swing in to call him, and swing across the sunset
  const FA = { fur: '#A87148', furDk: '#80522F', furLt: '#C48E62' }, FB = { fur: '#76533C', furDk: '#563828', furLt: '#946A4E', hood: '#4E9A6A', hoodDk: '#357052', hoodLt: '#7CC394' };
  function friends(t) {
    const go = (who, t0, from, to, piv, extra) => {
      // swing in from off-screen along a vine pinned above, settle, then swing off
      const inK = easeOut(seg(t, t0, t0 + .65)), outK = easeIn(seg(t, TL.FRIENDS_GO + who * .1, TL.FRIENDS_GO + .7 + who * .1));
      const a = lerp(from, to, inK) + (inK >= 1 ? .05 * Math.sin((t - t0) * 2.5 + who) : 0) + outK * 1.3 + spring(t, t0 + .65, 4, 6) * .12;
      const L = 560, end = [piv[0] + Math.sin(a) * L, piv[1] + Math.cos(a) * L];
      vine(piv, end, 'fvine' + who);
      hangFrom(end[0], end[1], MU * .95, { boilKey: 'friend' + who, pal: who ? FB : FA, hoodie: !!who, eyes: 'happy', mouth: 'grin', lookX: -.8, lookY: .3, flip: true, ...extra(a) }, -a);
    };
    if (t > TL.FRIENDS && t < TL.FRIENDS_GO + 1.2) {
      const fx = (a) => {
        const o = {};
        if (t > TL.PLAY0 && t < TL.SHRUG) { o.handN = [3.9, -8.4 + .7 * Math.sin(t * 12)]; o.elbowN = [0, 1]; o.eyes = 'normal'; o.lid = .1; o.mouth = 'smile'; }   // waving him over
        if (t > TL.NOTNOW + .3 && t < TL.FRIENDS_GO) { o.eyes = 'normal'; o.lid = .45; o.mouth = 'flat'; o.lookX = .6; o.lookY = 0; }
        if (t > TL.SHRUG && t < TL.FRIENDS_GO) { o.handN = [3.0, -8.6]; o.brows = .8; }
        return o;
      };
      go(0, TL.FRIENDS, 1.1, .14, [630, 300], fx);
      go(1, TL.FRIENDS + .2, 1.1, .02, [805, 330], a => ({ ...fx(a), lookX: -.6 }));
    }
  }
  function friendsSunset(t) {
    if (t < TL.FRIENDS2 || t > TL.FRIENDS2 + 2.1) return;
    for (const who of [0, 1]) {
      const k = seg(t, TL.FRIENDS2 + who * .45, TL.FRIENDS2 + 1.5 + who * .45), piv = [700 + who * 170, 300], a = lerp(-.42, 1.15, ease(k)), L = 640;
      const end = [piv[0] + Math.sin(a) * L, piv[1] + Math.cos(a) * L];
      vine(piv, end, 'svine' + who);
      hangFrom(end[0], end[1], MU, { boilKey: 'sfriend' + who, pal: who ? FB : FA, hoodie: !!who, eyes: 'happy', mouth: 'laugh', light: ['#FF9A50', .3], handN: who ? [3.6, -8.0 + .6 * Math.sin(t * 14)] : [3.0, -5.4], footN: [1.6, -.4], footF: [-.4, .9] }, a);
    }
  }

  // ---- the camera: on the branch, follow the fall, two-shot on the ground, in on him, then out for the sunset
  function cam(t) {
    return kf(t, [[0, [520, 905, 1.45]], [TL.JOLT, [525, 905, 1.52]], [TL.FUMBLE1, [525, 920, 1.5]], [TL.LAND_PH + .2, [540, 1100, 1.2]], [TL.SIT, [545, 1105, 1.24]],
      [TL.TUCK + .4, [540, 1135, 1.38]], [TL.STAND, [545, 1135, 1.42]], [TL.WALKH0, [520, 1125, 1.36]], [TL.WALKH1, [440, 1120, 1.36]], [TL.REVEAL, [440, 1115, 1.38]],
      [TL.REVEAL + 1.3, [540, 1000, 1.0]], [TL.SWING1, [540, 1000, 1.0]], [TL.HEART0 + .4, [610, 1060, 1.14]], [TL.FADE1, [620, 1065, 1.17]]], ease);
  }

  // ---- the verse tail: the band goes dark, the verse and the follow line
  function verseCard(t) {
    if (t < TL.VERSE) return;
    const a = (t0) => clamp((t - t0) * 3), font = (w, px, f) => `${w} ${px}px ${f}`;
    const line = (txt, y, px, color, t0, f = 'Poppins', w = 500) => { const k = a(t0); if (k > 0) letter(txt, W / 2, y, px, color, { screen: true, font: font(w, px, f), alpha: k, ink: false }); };
    line('यदा संहरते चायं कूर्मोऽङ्गानीव सर्वशः ।', 760, 44, '#F4EBDA', TL.VERSE, '"Tiro Devanagari Sanskrit"', 400);
    line('इन्द्रियाणीन्द्रियार्थेभ्यस्तस्य प्रज्ञा प्रतिष्ठिता ॥', 826, 44, '#F4EBDA', TL.VERSE + .15, '"Tiro Devanagari Sanskrit"', 400);
    line('“As a tortoise draws in its limbs,', 946, 36, '#FFFFFF', TL.VERSE + .5);
    line('one who draws the senses in', 996, 36, '#FFFFFF', TL.VERSE + .65);
    line('from what pulls at them', 1046, 36, '#FFFFFF', TL.VERSE + .8);
    line('stands firm in wisdom.”', 1096, 36, '#FFFFFF', TL.VERSE + .95);
    line('Bhagavad Gita 2.58', 1176, 36, FABLE.yellow, TL.CITE, 'Poppins', 700);
    line('Follow @therishikatha for more stories', 1300, 32, '#BDB6AA', TL.FOLLOW);
  }

  function story(t) {
    if (t > TL.FADE1 + .05) { boilSeed('black'); paint(rectPts(-20, -20, W + 40, H + 40), { wash: FABLE.matte, ink: null }); fableFrame(HEADLINE); verseCard(t); return; }
    const c = cam(t);
    camBegin(c[0], c[1], c[2]);
    set(t); tree(t);
    const M = monkeyNow(t), mo = M.o;
    // the tortoise on her rock
    const to = tortoiseO(t);
    tortoise(TX, GY, TU, to);
    // the phone (on the ground / falling), behind the monkey when he stands near it
    if (t < TL.REVEAL) drawPhoneWorld(t, mo);
    hollowLeaf(t);
    // the friends behind him on the branch; the sunset friends in front of the sun
    friends(t); friendsSunset(t);
    // the free vine and the monkey
    if (t > TL.VINE) {
      const e = vineEnd(t); vine(PIV, e, 'freevine');
      if (M.vine) { const a = vineAng(t); hangFrom(e[0], e[1], MU, { ...mo, boilKey: 'kapi', eyes: 'happy', mouth: 'laugh', footN: [1.4, -.6], footF: [-.2, .6], handN: [3.2, -5.6], handF: undefined, elbowF: undefined, dy: 0, sq: 0 }, a); }
    }
    if (!M.vine) {
      monkey(M.x, M.y, MU, mo);
      if (t < TL.JOLT && mo.handN) { const w = mkWorld(M.x, M.y, MU, mo, phoneLocal(t).p); glow(w[0] - 4, w[1] - 14, 60, '#8CC8FF', .3); }
    }
    // the phone in his hands on the branch is drawn over him (in front of his face)
    if (t < TL.JUMP0) { const ph = phoneWorld(t, mo); fablePhone(ph.x, ph.y, ph.held ? 46 : 50, { rot: ph.r, buzz: phoneBuzz(t), on: 1, dot: t > TL.BUZZ_A[0] }); }
    // emotes
    const head = M.vine ? null : monkeyHead(M.x, M.y, MU, mo);
    if (head) {
      if (t > TL.HUH && t < TL.WALK0 + .4) emote('?', head[0] + 40, head[1] - 80, 18, popIn(t, TL.HUH, 6) * (1 - seg(t, TL.WALK0 + .2, TL.WALK0 + .4)), t - TL.HUH);
      if (t > TL.SHELL1 - .4 && t < TL.NOD + .3) emote('!', head[0] + 40, head[1] - 85, 18, popIn(t, TL.SHELL1 - .4, 6) * (1 - seg(t, TL.NOD + .1, TL.NOD + .3)), t - TL.SHELL1);
      if (t > TL.TEMPT0 && t < TL.TEMPT1) emote('sweat', head[0] - 55, head[1] - 40, 16, popIn(t, TL.TEMPT0, 5), t - TL.TEMPT0);
      if (t > TL.REVEAL + .6 && t < TL.FRIENDS2) emote('spark', head[0] + 50, head[1] - 70, 16, popIn(t, TL.REVEAL + .6, 5), t);
    }
    // the bubbles (one at a time)
    const hb = head || [0, 0], tt = tortoiseHead(TX, GY, TU, to);
    bubble(705, 765, 250, 170, [hb[0] + 30, hb[1] - 50], life(t, TL.LIKES0, TL.LIKES1), 'likes', DOODLE.likes);
    bubble(705, 765, 250, 170, [hb[0] + 30, hb[1] - 50], life(t, TL.CAT0, TL.CAT1), 'cat', DOODLE.cat);
    bubble(705, 765, 260, 175, [hb[0] + 30, hb[1] - 50], life(t, TL.SHOW0, TL.SHOW1), 'show', DOODLE.show);
    bubble(590, 755, 240, 165, [720, 830], life(t, TL.PLAY0, TL.PLAY1), 'swing', DOODLE.swing);
    bubble(705, 995, 290, 190, [tt[0] + 10, tt[1] - 30], life(t, TL.SHELL0, TL.SHELL1), 'shell1', s => DOODLE.shell(s * 1.2));
    bubble(655, 975, 260, 170, [hb[0] + 30, hb[1] - 55], life(t, TL.TEMPT0, TL.TEMPT1), 'tempt', DOODLE.likes);
    bubble(655, 975, 260, 170, [hb[0] + 30, hb[1] - 55], life(t, TL.REMIND0, TL.REMIND1), 'remind', s => DOODLE.shell(s * 1.2));
    bubble(735, 1010, 270, 185, [tt[0] - 5, tt[1] - 30], life(t, TL.HEART0, TL.HEART1), 'heart', s => DOODLE.shellHeart(s * 1.25));
    camEnd();
    if (t > TL.FUMBLE1 && t < TL.LAND_PH) fableWhip(seg(t, TL.FUMBLE1, TL.LAND_PH), 1);
    fableFrame(window.PHONE_COVER ? [] : HEADLINE, seg(t, TL.FADE0, TL.FADE1));
    verseCard(t);
  }
  window.PHONE_STORY = story;   // the cover (src/scenes/phone_cover.js) draws a frame of the story

  shots([[0, story]]);
})();
