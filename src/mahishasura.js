// mahishasura.js: Mahishasura, the buffalo demon Maa Durga defeats (Devi Mahatmya, ch. 2–3), as a chibi villain kids can
// laugh at: olive-green skin (as on Bengal's Durga Puja idols), great curved buffalo horns, a spiky black mane of hair,
// yellow eyes, a huge curling moustache, two little tusks, a GOLD NOSE RING (his sign in every form), a red sash, gold
// armlets and belt, an indigo dhoti with a gold border, a khadga and a round shield (dhal).
// His other form is mahishBuffalo(): a huge slate-grey buffalo in side view with sweeping horns, red eyes and the same
// gold nose ring, that runs, charges head-down, snorts and tumbles.
// Load after bappa.js (U()), clawd.js (eyes() / mouth() / emote() / tintCols()) and chandraghanta.js (khadga()).
//
// mahishasura(x, y, u, o): front view; (x, y) is the ground under him; u is the size unit (about 24u to the horn tips,
// 13u across the horns).
// Body-local coordinates in u (y up is negative): feet 0 · dhoti -9.2..-3.6 · belt -9.3 · chest -15.4..-9.3 · shoulders
// (±3.3, -14.4) · head centre (0, -18.6) · eyes (±1.15, -19.0) · nose ring (0, -17.45) · mouth (0, -16.55) · horn tips
// (±5.5, -23.4), as drawn: the head is scaled 1.15× about the neck (0, -15.6) (MHS_HY() converts)
// Options (all optional):
//   pose:   dx, dy (u), sq, rot, flip, lean (u), hx (-1..1 head turn), htilt, nod (u), walk (phase), upper (true: draw
//           only from the belt up, for emerging out of the buffalo), shake (0..1: trembling)
//   arms:   handL / handR = [x, y] in u (2-bone arms), bendL / bendR, sword (default true, in handR) + swordA, shield
//           (default true, on handL), fistL / fistR (default true), armL(u, sw) / armR(u, sw) (hooks at the hands)
//   face:   eyes ('normal' | 'angry' | 'wide' | 'happy' (laughing shut) | 'closed' | 'scared' | 'swirl' (dizzy)),
//           mouth ('smirk' | 'laugh' | 'roar' | 'frown' | 'O' | 'grin' | 'flat' | 'wobble') + mouthK, lookX / lookY,
//           brows (-1 angry .. +1 raised), sweat 0..1, blush, seed; other kinds are Clawd's
//   extras: emote + emoteK + emoteAge, boilKey, noShadow, swMul, pal
// Helpers: mahishHand(x, y, u, o, s), mahishHead(x, y, u, o), mahishMouth(x, y, u, o), mahishChest(x, y, u, o) → world
//          [x, y]; dhal(u, sw) draws the shield.
//
// mahishBuffalo(x, y, u, o): side view facing screen-right (flip: true faces left); (x, y) is the ground under his
// middle; u is the size unit (about 17u nose to rump, 12u to the top of the horns).
// Body-local coordinates in u: hips (-3.9, -5.4) · shoulders (2.6, -5.8) · hump (1.6, -10.2) · head centre (6.4, -6.6) ·
// eye (6.6, -7.5) · nose ring (8.9, -4.7) · horn tips (1.6, -11.6) · neck (where the asura emerges) (4.6, -8.6); the head
// and horns are drawn 1.3× about the neck (4.4, -7.6)
// Options: run (phase), stride 0..1, charge 0..1 (head down, horns forward, legs braced), rear 0..1 (front up),
//          eyes ('angry' | 'wide' | 'swirl' | 'closed'), mouth ('flat' | 'open' | 'roar'), snort 0..1 (two steam puffs
//          out of the nostrils), tail (-1..1), dx, dy, sq, rot, flip, emote, boilKey, noShadow, swMul, pal
// Helpers: buffaloHead / buffaloNeck / buffaloHorn / buffaloNose(x, y, u, o) → world [x, y].
const MHS = {
  skin: '#7FA05A', skinDk: '#5A7A3E', skinLt: '#A6C47E', ink: '#2E2A26',
  hair: '#262230', hairLt: '#4A4458', horn: '#EFE3C6', hornDk: '#A8957A', eye: '#FFD84A', pupil: '#2A1A1E', white: '#FFF8EC',
  sash: '#C8323A', sashDk: '#8E1E28', dhoti: '#4A3E8A', dhotiDk: '#332A66', gold: '#EDB43C', goldDk: '#B67D1C', goldLt: '#FFE39A',
  mouth: '#5A1E2A', tongue: '#E07A72', tusk: '#FBF3E2', steel: '#C9D3DF', steelDk: '#8E9BB0', wood: '#7A4A2A',
  // the buffalo
  bf: '#4E4A5C', bfDk: '#363244', bfLt: '#6E6A82', bfMuzzle: '#5E5468', bfEye: '#FF5A3A', hoof: '#2A2630', steam: '#F4F0EA',
};

// the round shield, held at its centre
function dhal(u, sw, INK = MHS.ink) {
  paint(ellPts(0, 0, 2.2 * u, 2.2 * u, 26), { wash: MHS.wood, fill: '#5A3420', fillOp: 70, tex: .5, ink: INK, sw: sw * .8 });
  const r = ellPts(0, 0, 1.85 * u, 1.85 * u, 26); inkLine([...r, r[0], r[1]], sw * 1.4, MHS.gold, 'ink', .5);
  for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + .4; paint(ellPts(Math.cos(a) * 1.05 * u, Math.sin(a) * 1.05 * u, .32 * u, .32 * u, 10), { wash: MHS.gold, ink: INK, sw: sw * .4 }); }
  paint(ellPts(0, 0, .55 * u, .55 * u, 14), { wash: MHS.gold, fill: MHS.goldDk, fillOp: 50, ink: INK, sw: sw * .5 });
}

function mahishArm(o, s) {
  const sh = [s * 3.3 + (o.lean || 0) * .3, -14.4], L1 = 3.0, L2 = 3.0;
  let h = (s < 0 ? o.handL : o.handR) || [s * 4.9, -10.2];
  let dx = h[0] - sh[0], dy = h[1] - sh[1], d = Math.hypot(dx, dy) || 1e-3;
  const reach = L1 + L2 - .05;
  if (d > reach) { h = [sh[0] + dx / d * reach, sh[1] + dy / d * reach]; dx = h[0] - sh[0]; dy = h[1] - sh[1]; d = reach; }
  d = Math.max(d, .8);
  const a = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), base = Math.atan2(dy, dx);
  const e1 = [sh[0] + Math.cos(base + a) * L1, sh[1] + Math.sin(base + a) * L1], e2 = [sh[0] + Math.cos(base - a) * L1, sh[1] + Math.sin(base - a) * L1];
  const out = (e1[0] - e2[0]) * s > 0 ? e1 : e2, inn = out === e1 ? e2 : e1;
  return [sh, ((s < 0 ? o.bendL : o.bendR) ?? 1) < 0 ? inn : out, h];
}
function mahishWorld(x, y, u, o, px, py) {
  const sq = o.sq || 0, fx = o.flip ? -1 : 1, r = o.rot || 0, lx = fx * px * u * (1 + sq * .6), ly = py * u * (1 - sq);
  return [x + (o.dx || 0) * u + lx * Math.cos(r) - ly * Math.sin(r), y + (o.dy || 0) * u + lx * Math.sin(r) + ly * Math.cos(r)];
}
function mahishHand(x, y, u, o, s) { const [, , h] = mahishArm(o, s); return mahishWorld(x, y, u, o, h[0], h[1]); }
const MHS_HS = 1.15, MHS_NECK = -15.6, MHS_HY = y => MHS_NECK + (y - MHS_NECK) * MHS_HS;   // the head is drawn 1.15× about the neck
function mahishHead(x, y, u, o = {}) { return mahishWorld(x, y, u, o, (o.lean || 0) * .5 + clamp(o.hx || 0, -1, 1) * .4, MHS_HY(-18.6) + (o.nod || 0)); }
function mahishMouth(x, y, u, o = {}) { return mahishWorld(x, y, u, o, (o.lean || 0) * .5 + clamp(o.hx || 0, -1, 1) * .9, MHS_HY(-16.55) + (o.nod || 0)); }
function mahishChest(x, y, u, o = {}) { return mahishWorld(x, y, u, o, (o.lean || 0) * .3, -12.5); }

function mahishasura(x, y, u, o = {}) {
  const id = o.boilKey ?? 'm' + (++CLAWD_N), rs = p => boilSeed(`mahish ${id} ${p}`);
  const C = { ...MHS, ...(o.pal || {}) }, INK = C.ink;
  const sk = (o.shake || 0) * Math.sin(T * 60) * .12;
  const sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .04;
  const { col, dk, lt } = tintCols({ tint: o.tint, tintK: o.tintK, col: C.skin, dk: C.skinDk, lt: C.skinLt });
  const P = pts => U(pts, u), lean = o.lean || 0, hx = clamp(o.hx || 0, -1, 1), wk = o.walk;
  const L = (px, py) => [px + lean * clamp((-py - 8) / 8) * .5, py];   // the upper body leans
  const LP = pts => U(pts.map(([a, b]) => L(a, b)), u);

  if (!o.noShadow && !o.upper) { rs('shadow'); paint(ellPts(x + (o.dx || 0) * u, y + u * .1, u * 5.2, u * .95, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + (o.dx || 0) * u + sk * u, y + (o.dy || 0) * u);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);

  // ---- the shield arm's shield sits behind the body when the arm is down; the sword arm's blade behind the fist
  if (!o.upper) {
    // ---- legs and feet, the dhoti
    rs('legs');
    for (const s of [-1, 1]) {
      const l = wk == null ? 0 : Math.max(0, Math.sin((wk + (s < 0 ? 0 : .5)) * TAU)) * .7;
      paint(P([[s * .6, -4.2], [s * 2.6, -4.2], [s * 2.5 + s * l * .2, -1.0 - l], [s * .9, -1.0 - l]]), { wash: col, fill: dk, fillOp: 40, tex: .4, ink: INK, sw: sw * .8, curv: .3 });
      paint(ellPts((s * 1.9) * u, (-.5 - l) * u, 1.35 * u, .6 * u, 14, J), { wash: col, ink: INK, sw: sw * .8 });
      for (const k of [.9, 1.5, 2.1]) inkLine(P([[s * k, -.15 - l], [s * k, -.4 - l]]), sw * .45, dk, 'inkfine', 0);
      inkLine(P([[s * .9, -1.5 - l], [s * 2.5, -1.5 - l]]), sw * 1.3, C.gold, 'ink', 0);   // anklet
    }
    rs('dhoti');
    paint(P([[-3.6, -9.3], [3.6, -9.3], [4.3, -7.2], [3.9, -4.6], [2.8, -3.6], [1.2, -4.4], [0, -5.4], [-1.2, -4.4], [-2.8, -3.6], [-3.9, -4.6], [-4.3, -7.2]]), { wash: C.dhoti, fill: C.dhotiDk, fillOp: 70, tex: .6, ink: INK, sw: sw * .9, curv: .3 });
    inkLine(P([[-3.9, -4.5], [-2.8, -3.75], [-1.3, -4.5], [0, -5.5], [1.3, -4.5], [2.8, -3.75], [3.9, -4.5]]), sw * 1.8, C.gold, 'ink', .4);
    for (const k of [-2.2, -.6, 1, 2.4]) inkLine(P([[k * .9, -8.8], [k * 1.05, -5.8]]), sw * .5, C.dhotiDk, 'inkfine', .5);
  }

  // ---- the torso: a barrel chest and belly, the red sash across it, the gold belt
  rs('torso');
  paint(LP([[-3.0, -15.6], [3.0, -15.6], [3.9, -14.2], [4.2, -11.8], [3.8, -9.6], [2.4, -8.8], [-2.4, -8.8], [-3.8, -9.6], [-4.2, -11.8], [-3.9, -14.2]]), { wash: col, fill: dk, fillOp: 40, bleed: .06, tex: .5, border: .4, ink: INK, sw: sw * .9, curv: .4 });
  paint(LP([[-2.6, -12.2], [0, -11.6], [2.6, -12.2], [2.2, -9.4], [0, -9.0], [-2.2, -9.4]]), { wash: lt, ink: null, curv: .5 });   // the belly
  inkLine(LP([[-2.2, -13.3], [-1.1, -12.8], [0, -13.1]]), sw * .6, dk, 'inkfine', .5); inkLine(LP([[0, -13.1], [1.1, -12.8], [2.2, -13.3]]), sw * .6, dk, 'inkfine', .5);   // the pecs
  paint(ellPts(...L(0, -10.3).map(v => v * u), .18 * u, .2 * u, 8), { wash: dk, ink: null });   // navel
  paint(ribbon(LP([[-3.2, -15.2], [-1.0, -13.0], [1.4, -10.9], [3.4, -9.6]]), 1.1 * u, 1.1 * u), { wash: C.sash, fill: C.sashDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
  paint(ribbon(LP([[-3.8, -9.6], [0, -9.25], [3.8, -9.6]]), 1.0 * u, 1.0 * u), { wash: C.gold, fill: C.goldDk, fillOp: 50, tex: .5, ink: INK, sw: sw * .7 });
  paint(ellPts(...L(0, -9.4).map(v => v * u), .62 * u, .55 * u, 12), { wash: C.goldLt, ink: INK, sw: sw * .5 });

  // ---- the head: horns, hair, ears, face
  const hox = lean * .5 + hx * .4, hoy = o.nod || 0;
  push(); translate(hox * u, hoy * u); translate(0, MHS_NECK * u); scale(MHS_HS); translate(0, -MHS_NECK * u);
  if (o.htilt) { translate(0, -16 * u); rotate(o.htilt); translate(0, 16 * u); }
  rs('horns');
  for (const s of [-1, 1]) {
    const hp = [[s * 2.3, -20.0], [s * 4.0, -20.6], [s * 5.4, -21.2], [s * 6.0, -22.4], [s * 5.5, -23.6]];
    paint(U(ribbon(hp, 1.35, .12), u), { wash: C.horn, fill: C.hornDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .8, curv: .5 });
    for (const k of [.3, .5]) { const i = Math.floor(k * 4), f = k * 4 - i; inkLine(U([[lerp(hp[i][0], hp[i + 1][0], f) - s * .05, lerp(hp[i][1], hp[i + 1][1], f) - .45], [lerp(hp[i][0], hp[i + 1][0], f) + s * .1, lerp(hp[i][1], hp[i + 1][1], f) + .4]], u), sw * .55, C.hornDk, 'inkfine', 0); }
  }
  rs('hairback');
  { const P2 = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI, r = i % 2 ? 3.9 : 3.2; P2.push([Math.cos(a) * r * 1.05 * u, (-19.0 + Math.sin(a) * r * .95) * u]); } P2.push([3.0 * u, -17.2 * u], [-3.0 * u, -17.2 * u]); paint(P2, { wash: C.hair, ink: INK, sw: sw * .8, curv: .25 }); }
  rs('ears');
  for (const s of [-1, 1]) paint(U([[s * 2.6, -19.4], [s * 4.0, -19.9], [s * 3.4, -18.3], [s * 2.7, -17.9]], u), { wash: col, ink: INK, sw: sw * .7, curv: .3 });
  rs('head');
  const head = ellPts(0, -18.4 * u, 3.0 * u, 2.85 * u, 30, J);
  paint(head, { wash: col, ink: null });
  paint(ellPts(-1.0 * u, -19.6 * u, 1.5 * u, .8 * u, 14, J * 2, -.2), { fill: lt, fillOp: 110, bleed: .2, tex: .8, border: .8, ink: null });
  paint(head, { ink: INK, sw });
  rs('fringe');
  paint(U([[-2.9, -19.3], [-2.6, -20.6], [-1.9, -20.2], [-1.4, -21.3], [-.6, -20.5], [0, -21.6], [.6, -20.5], [1.4, -21.3], [1.9, -20.2], [2.6, -20.6], [2.9, -19.3], [2.0, -20.0], [0, -20.3], [-2.0, -20.0]], u), { wash: C.hair, ink: INK, sw: sw * .7, curv: .15 });

  push(); translate(hx * .5 * u, 0);
  rs('brows');
  const ek = Array.isArray(o.eyes) ? o.eyes[0] : o.eyes || 'normal';
  const b = clamp(o.brows ?? (ek === 'angry' ? -1 : ek === 'scared' ? .8 : 0), -1, 1);
  for (const s of [-1, 1]) paint(U(ribbon([[s * .35, -19.75 + b * -.35 - Math.max(0, b) * .3], [s * 1.2, -20.05 - Math.max(0, b) * .5], [s * 2.1, -19.95 + b * .25 - Math.max(0, b) * .35]], .55, .3), u), { wash: C.hair, ink: null });
  rs('eyes');
  const own = ['normal', 'angry', 'wide', 'happy', 'closed', 'scared', 'swirl'];
  if (own.includes(ek)) {
    const blink = ((T * .85 + (o.seed || 0) * 1.7 + .3) % 3.7) < .11;
    for (const s of [-1, 1]) {
      const ex = s * 1.15, ey = -19.0;
      if (ek === 'happy') { inkLine(U([[ex - .55, ey + .2], [ex, ey - .35], [ex + .55, ey + .2]], u), sw * 1.3, INK, 'ink', .6); continue; }
      if (ek === 'closed' || (blink && ek !== 'wide' && ek !== 'scared' && ek !== 'swirl')) { inkLine(U([[ex - .55, ey], [ex, ey + .28], [ex + .55, ey]], u), sw * 1.2, INK, 'ink', .6); continue; }
      const wide = ek === 'wide' || ek === 'scared', rx = wide ? .7 : .6, ry = wide ? .75 : .55;
      paint(U(ellPts(ex, ey, rx, ry, 16), u), { wash: C.eye, ink: INK, sw: sw * .6 });
      if (ek === 'swirl') { const sp = []; for (let i = 0; i < 18; i++) { const a = i * .7 + T * 8 * s, r = .05 + i * .028; sp.push([(ex + Math.cos(a) * r) * u, (ey + Math.sin(a) * r) * u]); } inkLine(sp, sw * .7, INK, 'inkfine', .5); continue; }
      const pr = ek === 'scared' ? .14 : .22, lx = (o.lookX || 0) * .22, ly = (o.lookY || 0) * .18;
      paint(ellPts((ex + lx) * u, (ey + ly) * u, pr * u, (pr + .12) * u, 10), { wash: C.pupil, ink: null });
      if (ek === 'angry') { paint(U([[ex - rx - .1, ey - ry - .2], [ex + rx + .1, ey - ry - .2], [ex + rx + .1, ey - .15 - s * .3 * rx], [ex - rx - .1, ey - .15 + s * .3 * rx]], u), { wash: col, ink: null }); inkLine(U([[ex - rx - .1, ey - .15 + s * .3 * rx], [ex + rx + .1, ey - .15 - s * .3 * rx]], u), sw * 1.2, INK, 'ink', 0); }
    }
  } else { push(); translate(0, -18.8 * u); scale(.5); translate(0, 6 * u); eyes(u, o, sw / .5 * .85, [-1, 1], 0); pop(); }
  if (o.sweat) { rs('sweat'); const k = clamp(o.sweat); paint(U([[2.6, -20.4 + k * .6], [2.85, -19.8 + k * .6], [2.6, -19.5 + k * .6], [2.35, -19.8 + k * .6]], u), { wash: '#BFE0F4', ink: INK, sw: sw * .4, curv: .5 }); }
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 2.0 * u, -17.6 * u, .7 * u, .36 * u, 12), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });

  // ---- the nose (broad, with the gold ring), the moustache, the mouth and tusks
  rs('mouth');
  const m = o.mouth || 'smirk', mk = clamp(o.mouthK ?? 1, 0, 1.4), my = -16.4;
  if (m === 'laugh' || m === 'roar' || m === 'O') {
    const w = m === 'O' ? .5 : .95 + .3 * mk, d = m === 'O' ? .75 : .6 + .9 * mk;
    paint(U([[-w, my - .2], [w, my - .2], [w * .8, my - .2 + d * .7], [0, my - .2 + d], [-w * .8, my - .2 + d * .7]], u), { wash: C.mouth, ink: INK, sw: sw * .8, curv: .45 });
    if (m !== 'O') paint(U([[-w * .5, my - .2 + d * .72], [w * .5, my - .2 + d * .72], [0, my - .2 + d * .95]], u), { wash: C.tongue, ink: null, curv: .5 });
  } else if (m === 'grin') {
    paint(U([[-1.2, my - .2], [1.2, my - .2], [.8, my + .45], [-.8, my + .45]], u), { wash: C.tusk, ink: INK, sw: sw * .7, curv: .35 });
    for (const k of [-.6, 0, .6]) inkLine(U([[k, my - .15], [k, my + .4]], u), sw * .45, C.hornDk, 'inkfine', 0);
  } else if (m === 'frown') inkLine(U([[-.9, my + .3], [0, my - .1], [.9, my + .3]], u), sw * .9, INK, 'ink', .5);
  else if (m === 'flat') inkLine(U([[-.8, my + .05], [.8, my + .05]], u), sw * .9, INK, 'ink', 0);
  else if (m === 'wobble') inkLine(U([[-.85, my + .1], [-.42, my - .08], [0, my + .1], [.42, my - .08], [.85, my + .1]], u), sw * .85, INK, 'ink', .5);
  else if (m === 'smirk') inkLine(U([[-.9, my + .05], [.2, my + .15], [1.0, my - .35]], u), sw * .9, INK, 'ink', .6);
  else { push(); translate(0, my * u); scale(.45); translate(0, 4.3 * u); mouth(u, m, sw / .45 * .8); pop(); }
  for (const s of [-1, 1]) {   // the tusks, up from the lower lip
    const tb = m === 'laugh' || m === 'roar' ? my - .2 + (.6 + .9 * mk) * .75 : my + .25;
    paint(U([[s * .62, tb], [s * .98, tb], [s * .85, tb - .75]], u), { wash: C.tusk, ink: INK, sw: sw * .45 });
  }
  rs('moustache');
  const mw = m === 'laugh' || m === 'roar' ? .25 : 0;
  for (const s of [-1, 1]) {
    paint(U(ribbon([[s * .15, -17.25 - mw], [s * 1.1, -17.0 - mw], [s * 2.1, -17.05 - mw], [s * 2.85, -17.5 - mw], [s * 3.05, -18.15 - mw], [s * 2.6, -18.45 - mw]], .95, .14), u), { wash: C.hair, ink: INK, sw: sw * .55, curv: .5 });
    inkLine(U([[s * .6, -17.15 - mw], [s * 1.6, -17.0 - mw], [s * 2.4, -17.2 - mw]], u), sw * .5, C.hairLt, 'inkfine', .5);
  }
  rs('nose');
  paint(U([[-.75, -17.9], [-.5, -18.4], [.5, -18.4], [.75, -17.9], [.45, -17.45], [-.45, -17.45]], u), { wash: dk, ink: INK, sw: sw * .6, curv: .45 });
  for (const s of [-1, 1]) paint(ellPts(s * .32 * u, -17.75 * u, .14 * u, .1 * u, 6), { wash: INK, ink: null });
  const ring = ellPts(0, -17.2 * u, .48 * u, .42 * u, 16); inkLine([...ring, ring[0], ring[1]], sw * 1.6, C.gold, 'ink', .5);
  pop();
  pop();   // head

  // ---- arms: shoulder pads (gold armlets), fists, the sword and the shield
  for (const s of [-1, 1]) {
    rs('arm' + s);
    const [sh0, el, ha] = mahishArm(o, s), sh = sh0, hook = s < 0 ? o.armL : o.armR;
    if (s > 0 && o.sword !== false) { push(); translate(ha[0] * u, ha[1] * u); khadga(u * .95, sw, o.swordA ?? .35, INK); pop(); }
    paint(U(ribbon([sh, el, ha], 1.9, 1.5), u), { wash: col, fill: dk, fillOp: 40, tex: .4, ink: INK, sw: sw * .85, curv: .35 });
    const dd = Math.hypot(el[0] - sh[0], el[1] - sh[1]) || 1, nx = -(el[1] - sh[1]) / dd * .95, ny = (el[0] - sh[0]) / dd * .95, bx = lerp(sh[0], el[0], .5), by = lerp(sh[1], el[1], .5);
    inkLine(U([[bx - nx, by - ny], [bx + nx, by + ny]], u), sw * 2.2, C.gold, 'ink', 0);
    const de = Math.hypot(ha[0] - el[0], ha[1] - el[1]) || 1, wx = lerp(el[0], ha[0], .78), wy = lerp(el[1], ha[1], .78), nx2 = -(ha[1] - el[1]) / de * .8, ny2 = (ha[0] - el[0]) / de * .8;
    inkLine(U([[wx - nx2, wy - ny2], [wx + nx2, wy + ny2]], u), sw * 1.8, C.gold, 'ink', 0);
    push(); translate(ha[0] * u, ha[1] * u);
    paint(ellPts(0, 0, .95 * u, .85 * u, 14, J), { wash: col, ink: INK, sw: sw * .8 });
    if ((s < 0 ? o.fistL : o.fistR) !== false) for (const k of [-.35, .05, .45]) inkLine(U([[k, -.55], [k + .05, -.2]], u), sw * .5, dk, 'inkfine', 0);
    if (s < 0 && o.shield !== false) { translate(-.6 * u, .2 * u); dhal(u * .95, sw, INK); }
    if (hook) hook(u, sw);
    pop();
  }
  pop();

  if (o.emote) {
    rs('emote');
    const [ex, ey] = mahishWorld(x, y, u, o, (o.flip ? -1 : 1) * 5.5, -22);
    emote(o.emote, ex, ey, u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// ======================================================================================================================
// the buffalo form
function buffaloPose(o) {
  const ph = o.run == null ? 0 : o.run * TAU, st = o.run == null ? 0 : (o.stride ?? 1), ch = clamp(o.charge || 0), rr = clamp(o.rear || 0);
  return { ph, st, ch, rr, pitch: Math.sin(ph) * .05 * st - ch * .06 + rr * .45, bob: -Math.abs(Math.sin(ph)) * .45 * st + ch * .3 };
}
function buffaloLocal(o, px, py) {
  const { pitch, bob } = buffaloPose(o), cx = -3.9, cy = -1, a = -pitch, dx = px - cx, dy = py - cy;   // pitches about the hind feet (rears)
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a) + bob];
}
function buffaloWorld(x, y, u, o, px, py) { return lionRunWorld(x, y, u, o, px, py); }
function buffaloHeadLocal(o, px, py) {   // head points: lowered by charge about the neck, then the body pose
  const ch = clamp(buffaloPose(o).ch), a = ch * .5, nx = 4.4, ny = -7.6, dx = (px - nx) * 1.3, dy = (py - ny) * 1.3;   // drawn 1.3× about the neck
  return buffaloLocal(o, nx + dx * Math.cos(a) - dy * Math.sin(a), ny + dx * Math.sin(a) + dy * Math.cos(a) + ch * .8);
}
function buffaloHead(x, y, u, o = {}) { return buffaloWorld(x, y, u, o, ...buffaloHeadLocal(o, 6.4, -6.6)); }
function buffaloNose(x, y, u, o = {}) { return buffaloWorld(x, y, u, o, ...buffaloHeadLocal(o, 8.9, -4.7)); }
function buffaloHorn(x, y, u, o = {}) { return buffaloWorld(x, y, u, o, ...buffaloHeadLocal(o, 1.6, -11.6)); }
function buffaloNeck(x, y, u, o = {}) { return buffaloWorld(x, y, u, o, ...buffaloLocal(o, 4.6, -8.6)); }
function buffaloLeg(o, i) {   // 0 near hind, 1 far hind, 2 near fore, 3 far fore → [root, joint, foot]
  const { ph, st, ch, rr } = buffaloPose(o), hind = i < 2, far = i % 2 === 1;
  const root0 = hind ? [far ? -3.3 : -3.9, -5.4] : [far ? 3.2 : 2.6, -5.8], root = buffaloLocal(o, ...root0);
  const L1 = 2.5, L2 = 2.7, th = ph + [0, .12, .5, .62][i] * TAU;
  let fx = root0[0], fy = -.05;
  if (o.run != null) { fx += Math.cos(th) * 2.0 * st; fy = -Math.max(0, Math.sin(th)) * 1.7 * st - .05; }
  if (ch) fx += (hind ? -1.2 : 1.4) * ch;   // braced
  let foot;
  if (!hind && rr > .02) { const [lx, ly] = buffaloLocal(o, root0[0] + 2.2, root0[1] + 3.2 + Math.sin(T * 14 + i) * .4); foot = [lerp(fx, lx, rr), lerp(fy, ly, rr)]; }
  else foot = [buffaloLocal(o, fx, fy)[0], hind || o.run != null ? Math.min(fy, buffaloLocal(o, fx, fy)[1]) : fy];
  let dx = foot[0] - root[0], dy = foot[1] - root[1], d = Math.hypot(dx, dy) || 1e-3;
  if (d > L1 + L2 - .05) { const r = L1 + L2 - .05; foot = [root[0] + dx / d * r, root[1] + dy / d * r]; dx = foot[0] - root[0]; dy = foot[1] - root[1]; d = r; }
  d = Math.max(d, .8);
  const a = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), base = Math.atan2(dy, dx);
  const j1 = [root[0] + Math.cos(base + a) * L1, root[1] + Math.sin(base + a) * L1], j2 = [root[0] + Math.cos(base - a) * L1, root[1] + Math.sin(base - a) * L1];
  return [root, hind ? (j1[0] < j2[0] ? j1 : j2) : (j1[0] > j2[0] ? j2 : j1), foot];
}

function mahishBuffalo(x, y, u, o = {}) {
  const id = o.boilKey ?? 'mb' + (++CLAWD_N), rs = p => boilSeed(`buffalo ${id} ${p}`);
  const C = { ...MHS, ...(o.pal || {}) }, INK = C.ink;
  const sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .035;
  const col = C.bf, dk = C.bfDk, lt = C.bfLt;
  const L = (px, py) => buffaloLocal(o, px, py), LP = pts => U(pts.map(([a, b]) => L(a, b)), u);
  const HL = (px, py) => buffaloHeadLocal(o, px, py), HP = pts => U(pts.map(([a, b]) => HL(a, b)), u);

  if (!o.noShadow) { rs('shadow'); paint(ellPts(x + (o.dx || 0) * u, y + u * .15, u * 7.8, u * 1.05, 22), { fill: PAL.ink, fillOp: 90, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + (o.dx || 0) * u, y + (o.dy || 0) * u);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);

  const leg = (i, c) => {
    const [r, j, f] = buffaloLeg(o, i);
    paint(U(ribbon([r, j, f], i < 2 ? 2.4 : 2.1, 1.25), u), { wash: c, fill: dk, fillOp: 40, tex: .4, ink: INK, sw: sw * .8, curv: .3 });
    paint(U([[f[0] - .75, f[1] - .3], [f[0] + .75, f[1] - .3], [f[0] + .85, f[1] + .1], [f[0] - .85, f[1] + .1]], u), { wash: C.hoof, ink: INK, sw: sw * .6 });
    inkLine(U([[f[0] + .05, f[1] - .3], [f[0] + .05, f[1] + .1]], u), sw * .5, dk, 'inkfine', 0);
  };
  rs('far'); leg(1, mixCol(col, dk, .6)); leg(3, mixCol(col, dk, .6));
  rs('tail');
  const tw = o.tail ?? Math.sin(T * 2.6 + (o.seed || 0)) * .5;
  const tp = [L(-6.0, -8.2), L(-6.9, -7.2 + tw * .2), L(-7.2 + tw * .4, -5.4), L(-7.0 + tw * .8, -3.9)];
  paint(U(ribbon(tp, .5, .25), u), { wash: col, ink: INK, sw: sw * .7, curv: .5 });
  paint(ellPts(tp[3][0] * u, (tp[3][1] + .3) * u, .45 * u, .7 * u, 10, J), { wash: C.hair, ink: INK, sw: sw * .55 });
  rs('body');
  paint(LP([[-6.4, -7.0], [-5.6, -9.0], [-3.4, -9.6], [-.5, -9.6], [1.6, -10.4], [3.6, -10.0], [5.0, -8.6], [5.2, -6.2], [4.2, -3.9], [1.8, -3.3], [-2.0, -3.4], [-5.0, -3.9], [-6.4, -5.2]]),
    { wash: col, fill: dk, fillOp: 50, bleed: .06, tex: .6, border: .4, ink: INK, sw: sw * .95, curv: .45 });
  paint(LP([[-4.6, -8.6], [-.5, -9.0], [1.6, -9.8], [3.4, -9.5], [1.0, -8.6], [-2.6, -8.2]]), { wash: lt, ink: null, curv: .5 });   // the light along his back
  for (const [a, b2] of [[-3.0, -7.0], [-1.0, -6.6], [1.2, -7.2]]) inkLine(LP([[a, b2], [a + .4, b2 + 1.6]]), sw * .5, dk, 'inkfine', .5);   // ribs
  paint(ellPts(...L(-4.2, -6.3).map(v => v * u), 2.2 * u, 2.3 * u, 18), { wash: col, fill: dk, fillOp: 30, tex: .4, ink: INK, sw: sw * .7 });   // the haunch
  rs('near'); leg(0, col); leg(2, col);

  // ---- the head: low and broad, the great swept horns, the red eyes, the gold nose ring
  rs('horns');
  const horn = (far) => {
    const hp = (far ? [[6.5, -8.6], [6.5, -10.0], [6.0, -11.1], [5.1, -11.7], [4.5, -12.5]] : [[5.9, -8.5], [4.8, -9.9], [3.4, -10.7], [2.2, -10.8], [1.6, -11.6]]).map(([a, b2]) => HL(a, b2));
    paint(U(ribbon(hp, far ? 1.05 : 1.3, .1), u), { wash: far ? mixCol(C.horn, C.hornDk, .5) : C.horn, fill: C.hornDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .8, curv: .5 });
    if (!far) for (const k of [1, 2]) { const p = hp[k]; inkLine(U([[p[0] - .3, p[1] - .5], [p[0] + .4, p[1] + .4]], u), sw * .5, C.hornDk, 'inkfine', 0); }
  };
  horn(true);
  rs('head');
  paint(HP([[4.4, -8.9], [6.0, -9.1], [7.4, -8.3], [8.6, -6.6], [9.5, -5.2], [9.4, -4.0], [8.2, -3.6], [6.8, -4.3], [5.4, -4.6], [4.2, -5.8]]), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .9, curv: .45 });
  paint(HP([[7.9, -5.6], [9.3, -5.4], [9.5, -4.2], [8.4, -3.7], [7.6, -4.3]]), { wash: C.bfMuzzle, ink: INK, sw: sw * .6, curv: .5 });
  paint(HP([[3.8, -8.4], [3.0, -9.0], [3.6, -7.6]]), { wash: col, ink: INK, sw: sw * .6, curv: .3 });   // the ear
  rs('eye');
  const ek = o.eyes || 'angry', ep = HL(6.6, -7.5);
  if (ek === 'closed') inkLine(U([[ep[0] - .45, ep[1]], [ep[0], ep[1] + .25], [ep[0] + .45, ep[1]]], u), sw * 1.1, INK, 'ink', .5);
  else {
    if (ek !== 'swirl') glow(ep[0] * u, ep[1] * u, u * 1.4, C.bfEye, .7);
    paint(ellPts(ep[0] * u, ep[1] * u, (ek === 'wide' ? .62 : .5) * u, (ek === 'wide' ? .62 : .42) * u, 12), { wash: ek === 'swirl' ? C.white : C.bfEye, ink: INK, sw: sw * .5 });
    if (ek === 'swirl') { const sp = []; for (let i = 0; i < 16; i++) { const a = i * .75 + T * 9, r = .04 + i * .028; sp.push([(ep[0] + Math.cos(a) * r) * u, (ep[1] + Math.sin(a) * r) * u]); } inkLine(sp, sw * .6, INK, 'inkfine', .5); }
    else paint(ellPts((ep[0] + .12) * u, ep[1] * u, .16 * u, .22 * u, 8), { wash: '#FFE08A', ink: null });
    if (ek === 'angry') inkLine(U([[ep[0] - .7, ep[1] - .75], [ep[0] + .6, ep[1] - .3]], u), sw * 1.6, INK, 'ink', 0);
  }
  rs('mouth');
  const mo = o.mouth || 'flat';
  if (mo === 'open' || mo === 'roar') { paint(HP([[7.9, -3.95], [9.2, -3.9], [8.8, mo === 'roar' ? -2.7 : -3.3], [8.0, mo === 'roar' ? -2.9 : -3.4]]), { wash: C.mouth, ink: INK, sw: sw * .6, curv: .45 }); }
  else inkLine(HP([[8.0, -3.95], [8.9, -3.85]]), sw * .7, INK, 'ink', 0);
  const nr = HL(8.95, -4.55), nring = ellPts(nr[0] * u, nr[1] * u, .45 * u, .4 * u, 14); inkLine([...nring, nring[0], nring[1]], sw * 1.5, C.gold, 'ink', .5);
  paint(ellPts(...HL(9.05, -5.0).map(v => v * u), .16 * u, .11 * u, 6), { wash: INK, ink: null });
  rs('hornnear'); horn(false);
  rs('hair');   // a black forelock between the horns
  paint(HP([[5.0, -9.0], [5.6, -9.9], [6.1, -9.1], [6.6, -9.7], [6.9, -8.6], [6.0, -8.3]]), { wash: C.hair, ink: INK, sw: sw * .5, curv: .2 });
  if (o.snort) {
    rs('snort');
    const k = clamp(o.snort), [sx, sy] = HL(9.6, -4.9);
    for (const j of [0, 1]) { const kk = clamp(k * 1.3 - j * .3); if (kk <= 0 || kk >= 1) continue; const r = (.4 + kk * 1.4) * u; paint(ellPts((sx + kk * 2.6) * u, (sy + kk * .9 + j * .5) * u, r, r * .7, 12), { wash: C.steam, washOp: 230 * (1 - kk), ink: INK, sw: sw * .4 * (1 - kk) }); }
  }
  pop();

  if (o.emote) { rs('emote'); const [ex, ey] = buffaloWorld(x, y, u, o, ...HL(7, -12.5)); emote(o.emote, ex, ey, u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T); }
  rs('after');
}

// Model sheet: studio.html?loop=mahishasura, or node render.mjs --loop=mahishasura --sheet=0.5,2.5 --cols=2 --w=540
(() => {
  LOOPS.mahishasura = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#E4DCCF', ink: null });
    const u = 17, c = t % 4;
    mahishasura(270, 620, u, { eyes: 'happy', mouth: 'laugh', mouthK: .6 + .4 * Math.abs(Math.sin(t * 9)), handR: [5.6, -16.8], handL: [-4.2, -11.4], boilKey: 'a1' });
    mahishasura(810, 620, u, { eyes: 'angry', mouth: 'roar', handR: [6.0, -19.5], swordA: -.3, lean: .6, boilKey: 'a2' });
    mahishasura(270, 1130, u, { eyes: c < 2 ? 'scared' : 'swirl', mouth: c < 2 ? 'wobble' : 'O', sweat: frac(t), shake: c < 2 ? 1 : 0, sword: false, shield: false, handL: [-5.2, -17], handR: [5.2, -17], boilKey: 'a3', hx: -.3 });
    mahishasura(810, 1130, u, { eyes: 'normal', mouth: 'smirk', brows: .6, upper: true, boilKey: 'a4', hx: .4, lookX: .6 });
    mahishBuffalo(330, 1560, u * .95, { run: t * 1.5, eyes: 'angry', mouth: 'flat', snort: frac(t * .7), boilKey: 'b1' });
    mahishBuffalo(780, 1560, u * .95, { charge: 1, eyes: 'angry', mouth: 'roar', flip: true, boilKey: 'b2' });
    mahishBuffalo(330, 1890, u * .8, { rear: .5 + .5 * Math.sin(t * 2), eyes: 'wide', mouth: 'open', boilKey: 'b3' });
    mahishBuffalo(780, 1890, u * .8, { eyes: 'swirl', mouth: 'open', boilKey: 'b4', rot: .2 });
  };
  LOOPS.mahishasura.len = 4;
})();
