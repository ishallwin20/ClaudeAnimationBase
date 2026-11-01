// tortoise_cast.js: the cast of the wordless moral-story format test (Panchatantra, the tortoise and the swans).
// Load after core.js, bappa.js (U()) and clawd.js (tintCols(), emote()).
//
// tortoise(x, y, u, o): Kambugriva, a chibi tortoise in side view facing right. (x, y) is the ground under the middle of
//   his shell; about 9u from tail to snout, 5.4u to the top of the shell. Body-local u (y up negative): shell -4.4..4.4,
//   top -5.4, rim -1.3; neck base (3.4, -2.3); head about 1.3u wide.
//   pose:  dx, dy (u), sq, rot (radians, about (0, -3)), flip; neck 0..1 (retracted .. stretched out), neckA (radians
//          added to the neck's angle: - is up), htilt; legs: walk (phase), dangle 0..1 (the feet hang and splay),
//          kick (phase: a flail while dangling)
//   face:  eyes 'normal' | 'wide' | 'closed' | 'happy' | 'angry' | 'sad', lid 0..1 (heavy lids, the deadpan look),
//          lookX / lookY, mouth 'smile' | 'flat' | 'frown' | 'bite' | 'open' | 'grin', openK 0..1, puff 0..1
//          (cheeks blown out), tint + tintK (skin: 'flush' goes red), twitch 0..1 (the eye jumps)
//   extras: noShadow, boilKey, held(u, sw) (a hook in head space at the mouth: the stick)
// tortoiseMouth(x, y, u, o) → the world point where he bites; tortoiseHead(…) → his eye.
//
// hamsa(x, y, u, o): a swan (hamsa) in side view facing right: white, an orange beak with a dark nail, big eyes.
//   (x, y) is the middle of the body; standing, the feet are 4.6u below it (hamsaStandY(groundY, u) gives y).
//   fly 0..1 (neck forward, legs tucked, wings out), flap (phase, 1 = one stroke), wingsUp 0..1 (folded wings lift
//   and flutter, for landing), neck 'up' | 'down' (head lowered to the ground) via down 0..1, htilt, beak 0..1 (open),
//   eyes 'normal' | 'wide' | 'closed' | 'half' | 'stern', lookX / lookY, tuft (a crest), walk, rot, flip, sq, boilKey
// hamsaBeak(x, y, u, o) → the beak tip; hamsaHead(…) → the head centre.
//
// bubble(x, y, w, h, tail, k, key, doodle): a thought bubble (pale grey, pencil outline) centred at (x, y), w × h,
//   with its point aimed at tail = [x, y]; k 0..1 pops it; doodle(s) draws inside in unit space (1 = s px).
// DOODLE.lake / wings / stick / zip / wheel / wheelLegs / burst: the pencil doodles.
const TT = {
  shell: '#8A9150', shellDk: '#5D6634', shellLt: '#ADB46E', rim: '#C9B36A', rimDk: '#9E8A47',
  skin: '#A9B57E', skinDk: '#7D8A57', skinLt: '#C9D3A0', ink: '#3E3A2C', eye: '#FBF6E8', pupil: '#2A241C',
  mouth: '#5B2A26', blush: '#E07A64',
};
const HMS = {
  white: '#F7F2E8', shade: '#DDD5C5', far: '#C8C0B0', ink: '#4A4038', beak: '#EE8F2A', beakDk: '#BF6716',
  nail: '#4A3A30', feet: '#E9852C', eye: '#FFFDF6', pupil: '#2A1E18', tuft: '#CFC6B4',
};

// ---------------- the tortoise ----------------
function ttNeck(o) {
  const ext = clamp(o.neck ?? .3), L = lerp(1.1, 3.0, ext), a = lerp(-.2, -.5, ext) + (o.neckA || 0);
  return { bx: 3.3, by: -2.4, hx: 3.3 + Math.cos(a) * L, hy: -2.4 + Math.sin(a) * L, a, ha: (o.htilt || 0) + a * .45 };
}
function ttLocal(o, lx, ly) {   // body-local u → after rot (about (0, -3)), still in u
  const r = o.rot || 0, px = lx, py = ly + 3;
  return [px * Math.cos(r) - py * Math.sin(r), -3 + px * Math.sin(r) + py * Math.cos(r)];
}
function ttWorld(x, y, u, o, lx, ly) {
  const [bx, by] = ttLocal(o, lx, ly), sq = o.sq || 0;
  return [x + ((o.dx || 0) + (o.flip ? -1 : 1) * bx * (1 + sq * .6)) * u, y + ((o.dy || 0) + by * (1 - sq)) * u];
}
function ttHeadPt(o, px, py) { const n = ttNeck(o), c = Math.cos(n.ha), s = Math.sin(n.ha); return [n.hx + px * c - py * s, n.hy + px * s + py * c]; }
const tortoiseMouth = (x, y, u, o = {}) => ttWorld(x, y, u, o, ...ttHeadPt(o, 1.2, .28));
const tortoiseHead = (x, y, u, o = {}) => ttWorld(x, y, u, o, ...ttHeadPt(o, .2, -.35));

function tortoise(x, y, u, o = {}) {
  const id = o.boilKey ?? 't' + (++CLAWD_N), rs = p => boilSeed(`tortoise ${id} ${p}`);
  const sw = clamp(u / 20, .4, 2), INK = TT.ink, P = pts => U(pts, u), J = u * .03, sq = o.sq || 0;
  const { col: skin, dk: skinDk, lt: skinLt } = tintCols({ ...o, col: TT.skin, dk: TT.skinDk, lt: TT.skinLt });
  const n = ttNeck(o), dangle = clamp(o.dangle || 0);
  if (!o.noShadow) { rs('shadow'); paint(ellPts(x + (o.dx || 0) * u, y + u * .1, u * 4.8, u * .7, 20), { fill: PAL.ink, fillOp: 70, bleed: .2, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + (o.dx || 0) * u, y + (o.dy || 0) * u);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  translate(0, -3 * u); rotate(o.rot || 0); translate(0, 3 * u);

  const leg = (bx, far, ph) => {
    let fx = bx + (bx > 0 ? .35 : -.35), fy = 0;
    if (o.walk != null) { const a = (o.walk + ph) * TAU; fx += Math.sin(a) * .5; fy = -Math.max(0, Math.cos(a)) * .45; }
    if (dangle > 0) {
      const k = o.kick != null ? Math.sin((o.kick + ph) * TAU) : 0;
      fx = lerp(fx, bx + (bx > 0 ? .9 : -.9) + k * .35, dangle); fy = lerp(fy, .5 + Math.abs(k) * .2, dangle);
    }
    rs('leg' + bx + far);
    const c = far ? skinDk : skin;
    paint(ribbon(P([[bx, -1.9], [lerp(bx, fx, .5), lerp(-1.9, fy, .5) - .05], [fx, fy - .35]]), 1.05 * u, .95 * u), { wash: c, ink: INK, sw: sw * .7 });
    paint(ellPts(fx * u, (fy - .3) * u, .62 * u, .38 * u, 12, J), { wash: c, ink: INK, sw: sw * .6 });
    for (let i = -1; i <= 1; i++) inkLine(P([[fx + .25 + i * .22, fy - .5], [fx + .3 + i * .24, fy - .18]]), sw * .45, far ? TT.ink : skinDk, 'inkfine', 0);
  };
  // behind: far legs, tail, neck
  leg(-1.6, true, .5); leg(3.1, true, 0);
  rs('tail'); paint(P([[-4.1, -2.1], [-5.1, -1.6], [-4.0, -1.45]]), { wash: skin, ink: INK, sw: sw * .7, curv: .3 });
  rs('neck');
  paint(ribbon(P([[n.bx - .6, n.by + .2], [lerp(n.bx, n.hx, .5), lerp(n.by, n.hy, .5) - .1], [n.hx - .2, n.hy + .1]]), 1.45 * u, 1.05 * u), { wash: skin, ink: INK, sw: sw * .7 });
  for (let i = 1; i <= 3; i++) { const k = i / 4.4, px = lerp(n.bx, n.hx, k), py = lerp(n.by, n.hy, k); inkLine(P([[px - .1, py + .25], [px + .12, py + .5]]), sw * .4, skinDk, 'inkfine', 0); }

  // the shell
  rs('shell');
  const dome = P([[4.4, -1.8], [4.0, -3.4], [2.8, -4.8], [.9, -5.4], [-1.1, -5.4], [-3.0, -4.7], [-4.1, -3.3], [-4.5, -1.85], [-3.4, -1.5], [0, -1.35], [3.4, -1.5]]);
  paint(dome, { wash: TT.shellDk, ink: null, curv: .5 });
  const SC = [[-1.85, -4.35, 1.0, .72], [0, -4.6, 1.0, .72], [1.85, -4.35, 1.0, .72], [-3.0, -2.75, .8, .78], [-1.05, -2.95, .95, .82], [1.05, -2.95, .95, .82], [3.0, -2.75, .8, .78]];
  SC.forEach(([cx, cy, rx, ry], i) => paint(ellPts(cx * u, cy * u, rx * u, ry * u, 6, J * .6, i * .4), { wash: i < 3 ? TT.shellLt : TT.shell, fill: TT.shellDk, fillOp: 40, tex: .6, ink: null, curv: .25 }));
  paint(P([[-2.6, -4.85], [-1.0, -5.25], [.6, -5.2], [-.6, -4.95], [-2.0, -4.55]]), { wash: '#C7CD8C', washOp: 150, ink: null, curv: .5 });   // sheen
  const rim = P([[-4.55, -2.15], [-2, -1.9], [0, -1.85], [2, -1.9], [4.45, -2.15], [4.25, -1.4], [2, -1.15], [0, -1.08], [-2, -1.15], [-4.25, -1.4]]);
  paint(rim, { wash: TT.rim, ink: INK, sw: sw * .6, curv: .4 });
  for (let i = -3; i <= 3; i++) inkLine(P([[i * 1.2 + .1, -1.92], [i * 1.2, -1.12]]), sw * .45, TT.rimDk, 'inkfine', 0);
  paint(dome, { ink: INK, sw, curv: .5 });

  // near legs
  leg(-2.6, false, 0); leg(2.3, false, .5);

  // the head
  push(); translate(n.hx * u, n.hy * u); rotate(n.ha);
  rs('head');
  const puff = clamp(o.puff || 0), hp = P([[-1.1, .3], [-1.0, -.55], [-.3, -1.0], [.6, -.95], [1.25, -.45], [1.45, .1], [1.3, .55], [.6, .85 + puff * .25], [-.4, .8 + puff * .2]]);
  paint(hp, { wash: skin, ink: INK, sw, curv: .55 });
  paint(P([[-.6, .55], [.4, .75 + puff * .2], [1.1, .5], [.5, .45]]), { wash: skinLt, washOp: 170, ink: null, curv: .5 });
  if (puff > 0) { paint(ellPts(.45 * u, .45 * u, (.45 + puff * .25) * u, (.32 + puff * .2) * u, 14), { wash: skin, ink: INK, sw: sw * .6 }); glow(.45 * u, .45 * u, u * .6, TT.blush, .25 * puff); paint(ellPts(.45 * u, .5 * u, .3 * u, .14 * u, 10), { wash: TT.blush, washOp: 140 * puff, ink: null }); }
  inkLine(P([[1.12, -.25], [1.2, -.2]]), sw * .9, INK, 'ink', 0);   // nostril
  // the mouth
  const m = o.mouth || 'smile', ok = clamp(o.openK ?? 1);
  if (m === 'open') {
    const d = .25 + .75 * ok;
    paint(P([[1.42, .12], [.4, .3], [.5, .3 + d * .6], [1.0, .25 + d * .9], [1.3, .3 + d * .5]]), { wash: TT.mouth, ink: INK, sw: sw * .8, curv: .4 });
  } else if (m === 'bite') {
    inkLine(P([[1.42, .2], [.95, .3], [.5, .27]]), sw * .9, INK, 'ink', .4);
    inkLine(P([[.5, .1], [.38, .3], [.5, .48]]), sw * .6, INK, 'inkfine', .5);   // the clench at the corner
  } else {
    const end = m === 'smile' ? [.35, .05] : m === 'grin' ? [.25, -.05] : m === 'frown' ? [.4, .55] : [.4, .32];
    inkLine(P([[1.42, .22], [.9, .32 + (m === 'frown' ? .08 : 0)], end]), sw * .9, INK, 'ink', .5);
    if (m === 'grin') inkLine(P([[1.25, .3], [.85, .45], [.4, .2]]), sw * .6, INK, 'inkfine', .5);
  }
  if (o.held) o.held(u, sw);
  // the eye: big, pale, a little proud of the head
  rs('eye');
  const e = o.eyes || 'normal', ex = .15, ey = -.6 + (o.twitch ? Math.sin(T * 60) * .04 * o.twitch : 0), er = e === 'wide' ? .62 : .52;
  if (e === 'closed' || e === 'happy') {
    paint(ellPts(ex * u, ey * u, er * u, er * u, 18), { wash: skin, ink: INK, sw: sw * .7 });
    inkLine(P(e === 'happy' ? [[ex - .38, ey + .1], [ex, ey - .22], [ex + .38, ey + .1]] : [[ex - .4, ey], [ex, ey + .18], [ex + .4, ey]]), sw * .9, INK, 'ink', .5);
  } else {
    paint(ellPts(ex * u, ey * u, er * u, er * u, 20), { wash: TT.eye, ink: INK, sw: sw * .8 });
    const lx = clamp(o.lookX ?? .3, -1, 1), ly = clamp(o.lookY ?? 0, -1, 1), pr = e === 'wide' ? .14 : .19;
    paint(ellPts((ex + lx * er * .5) * u, (ey + ly * er * .5) * u, pr * u, pr * u, 12), { wash: TT.pupil, ink: null });
    let lid = clamp(o.lid ?? .35); if (e === 'wide') lid = 0; if (e === 'angry') lid = Math.max(lid, .45); if (e === 'sad') lid = Math.max(lid, .5);
    if (lid > .02) {   // a skin cap over the top of the eye; angry slants it down to the front, sad to the back
      const tilt = e === 'angry' ? .32 : e === 'sad' ? -.3 : 0, yy = ey - er + lid * er * 2;
      const cap = []; for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; cap.push([ex + Math.cos(a) * er * 1.06, Math.min(ey + Math.sin(a) * er * 1.06, yy + Math.cos(a) * tilt * er)]); }
      paint(P(cap), { wash: skin, ink: null });
      inkLine(P([[ex - er, yy - tilt * er], [ex + er, yy + tilt * er]]), sw * .9, INK, 'ink', 0);
    }
  }
  pop();
  pop();
}

// ---------------- the swan (hamsa) ----------------
const hamsaStandY = (gy, u) => gy - 4.6 * u;
function hmNeck(o) {
  const f = clamp(o.fly || 0), d = clamp(o.down || 0);
  const UP = [[2.0, -.7], [2.95, -2.1], [2.35, -3.6], [2.95, -4.9]], FL = [[2.3, -.5], [3.4, -.7], [4.3, -.9], [5.0, -1.05]], DN = [[2.2, -.5], [3.4, -.3], [4.2, .8], [4.6, 2.4]];
  const pts = UP.map((p, i) => [lerp(lerp(p[0], FL[i][0], f), DN[i][0], d), lerp(lerp(p[1], FL[i][1], f), DN[i][1], d)]);
  const last = pts[3], prev = pts[2], ha = (o.htilt || 0) + d * .9 + f * .05;
  return { pts, hx: last[0] + .25, hy: last[1] - .3 + d * .2, ha };
}
function hmLocal(o, lx, ly) { const r = o.rot || 0; return [lx * Math.cos(r) - ly * Math.sin(r), lx * Math.sin(r) + ly * Math.cos(r)]; }
function hmWorld(x, y, u, o, lx, ly) {
  const [bx, by] = hmLocal(o, lx, ly), sq = o.sq || 0;
  return [x + ((o.dx || 0) + (o.flip ? -1 : 1) * bx * (1 + sq * .6)) * u, y + ((o.dy || 0) + by * (1 - sq)) * u];
}
function hmHeadPt(o, px, py) { const n = hmNeck(o), c = Math.cos(n.ha), s = Math.sin(n.ha); return [n.hx + px * c - py * s, n.hy + px * s + py * c]; }
const hamsaBeak = (x, y, u, o = {}) => hmWorld(x, y, u, o, ...hmHeadPt(o, 1.85, .2));
const hamsaHead = (x, y, u, o = {}) => hmWorld(x, y, u, o, ...hmHeadPt(o, 0, 0));

function hamsa(x, y, u, o = {}) {
  const id = o.boilKey ?? 'h' + (++CLAWD_N), rs = p => boilSeed(`hamsa ${id} ${p}`);
  const sw = clamp(u / 20, .4, 2), INK = HMS.ink, P = pts => U(pts, u), J = u * .03, sq = o.sq || 0;
  const f = clamp(o.fly || 0), wu = clamp(o.wingsUp || 0), n = hmNeck(o);
  const fl = o.flap ?? T * 3;
  if (!o.noShadow && f < .5) { rs('shadow'); paint(ellPts(x + (o.dx || 0) * u, y + 4.7 * u, u * 3.2, u * .5, 18), { fill: PAL.ink, fillOp: 60, bleed: .2, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + (o.dx || 0) * u, y + (o.dy || 0) * u);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  rotate(o.rot || 0);

  // a side-view wing: drawn pointing up from the shoulder, its length scaled by c (−1 points it down), swept back
  const wing = (c, far) => {
    const cc = Math.sign(c || 1) * Math.max(.16, Math.abs(c));
    push(); translate((far ? .2 : .6) * u, -.9 * u); scale(far ? .9 : 1, cc);
    const Wg = [[1.0, .2], [1.0, -1.4], [.7, -3.0], [.1, -4.6], [-.7, -5.8], [-1.3, -5.7], [-1.2, -5.0], [-1.75, -4.9], [-1.55, -4.2], [-2.0, -4.0], [-1.7, -3.3], [-2.0, -3.0], [-1.6, -2.3], [-1.7, -1.6], [-1.2, -.6], [-1.1, .3]];
    paint(P(Wg), { wash: far ? HMS.far : HMS.white, ink: INK, sw: sw * .75 / Math.max(.5, Math.abs(cc)) * .9, curv: .35 });
    if (!far) for (const k of [.45, .7]) inkLine(P([[lerp(1, .1, k), lerp(0, -4.6, k)], [lerp(-1.1, -1.9, k), lerp(0, -4, k)]]), sw * .45, HMS.shade, 'inkfine', .3);
    pop();
  };
  const legs = () => {
    rs('legs');
    if (f > .5) { paint(P([[-2.6, 1.0], [-3.6, 1.3], [-3.4, .9]]), { wash: HMS.feet, ink: INK, sw: sw * .5 }); return; }
    for (const [lx, ph, far] of [[-.6, .5, 1], [.3, 0, 0]]) {
      let fx = lx, fy = 4.6;
      if (o.walk != null) { const a = (o.walk + ph) * TAU; fx += Math.sin(a) * .6; fy -= Math.max(0, Math.cos(a)) * .4; }
      inkLine(P([[lx, 1.3], [lerp(lx, fx, .5) + .15, 3.0], [fx, fy - .1]]), sw * 2.2, far ? HMS.beakDk : HMS.feet, 'ink', .3);
      paint(P([[fx - .25, fy - .15], [fx + 1.0, fy - .05], [fx + .85, fy + .12], [fx - .3, fy + .1]]), { wash: far ? HMS.beakDk : HMS.feet, ink: INK, sw: sw * .5 });
    }
  };
  const fc = Math.cos(fl * TAU);
  legs();
  if (f > 0) wing(fc * f + (1 - f) * .2, true);
  else if (wu > 0) wing(lerp(.3, .9 + .1 * Math.sin(T * 40), wu), true);

  // the neck, then the body over its root
  rs('neck');
  paint(ribbon(P(through(n.pts, 4)), 1.05 * u, .72 * u), { wash: HMS.white, ink: INK, sw: sw * .8 });
  rs('body');
  const body = P([[2.9, -.5], [2.6, .65], [1.6, 1.45], [0, 1.7], [-1.8, 1.4], [-3.0, .6], [-3.7, -.35], [-4.4, -1.35], [-3.3, -1.05], [-1.6, -1.25], [.4, -1.3], [2.0, -1.15]]);
  paint(body, { wash: HMS.white, ink: null, curv: .5 });
  paint(P([[-2.8, .7], [-1.6, 1.3], [0, 1.5], [1.6, 1.25], [.4, .95], [-1.4, .85]]), { wash: HMS.shade, washOp: 200, ink: null, curv: .5 });
  paint(body, { ink: INK, sw, curv: .5 });
  if (f < .5 && wu < .05) {   // the folded wing
    rs('fold');
    paint(P([[1.7, -.85], [.2, -1.0], [-1.8, -.95], [-3.5, -.55], [-2.7, .35], [-.9, .75], [.9, .45]]), { wash: HMS.white, fill: HMS.shade, fillOp: 60, tex: .4, ink: INK, sw: sw * .7, curv: .45 });
    for (const k of [.3, .55, .8]) inkLine(P([[lerp(.8, -3.0, k), lerp(.4, -.4, k)], [lerp(.4, -3.3, k), lerp(-.5, -.75, k)]]), sw * .45, HMS.shade, 'inkfine', .3);
  }
  if (f > 0) wing(Math.cos((fl - .06) * TAU) * f + (1 - f) * .2, false);
  else if (wu > 0) wing(lerp(.3, 1 + .12 * Math.sin(T * 40 + 1), wu), false);

  // the head
  push(); translate(n.hx * u, n.hy * u); rotate(n.ha);
  rs('head');
  if (o.tuft) paint(P([[-.5, -.7], [-1.1, -1.5], [-.7, -1.45], [-.9, -1.9], [-.2, -1.0]]), { wash: HMS.tuft, ink: INK, sw: sw * .5, curv: .3 });
  paint(ellPts(0, 0, .95 * u, .85 * u, 18, J), { wash: HMS.white, ink: INK, sw: sw * .9 });
  const bk = clamp(o.beak || 0);
  push(); translate(.75 * u, .05 * u); rotate(bk * .35);   // lower mandible
  paint(P([[-.1, .05], [1.1, .15], [.15, .45]]), { wash: HMS.beakDk, ink: INK, sw: sw * .6, curv: .3 }); pop();
  push(); translate(.75 * u, .05 * u); rotate(-bk * .25);   // upper mandible + the nail
  paint(P([[-.15, -.38], [.5, -.3], [1.15, .02], [1.1, .16], [-.1, .1]]), { wash: HMS.beak, ink: INK, sw: sw * .7, curv: .35 });
  paint(P([[.85, -.05], [1.15, .02], [1.1, .16], [.85, .12]]), { wash: HMS.nail, ink: null });
  pop();
  rs('eye');
  const e = o.eyes || 'normal', ex = .12, ey = -.22, er = e === 'wide' ? .42 : .34;
  if (e === 'closed') inkLine(P([[ex - .3, ey], [ex, ey + .14], [ex + .3, ey]]), sw * .9, INK, 'ink', .5);
  else {
    paint(ellPts(ex * u, ey * u, er * u, er * u, 16), { wash: HMS.eye, ink: INK, sw: sw * .7 });
    const lx = clamp(o.lookX ?? .4, -1, 1), ly = clamp(o.lookY ?? 0, -1, 1), pr = e === 'wide' ? .1 : .14;
    paint(ellPts((ex + lx * er * .5) * u, (ey + ly * er * .5) * u, pr * u, pr * u, 10), { wash: HMS.pupil, ink: null });
    const lid = e === 'half' ? .5 : e === 'stern' ? .45 : 0;
    if (lid) {
      const tilt = e === 'stern' ? .35 : 0, yy = ey - er + lid * er * 2, cap = [];
      for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI; cap.push([ex + Math.cos(a) * er * 1.08, Math.min(ey + Math.sin(a) * er * 1.08, yy + Math.cos(a) * tilt * er)]); }
      paint(P(cap), { wash: HMS.white, ink: null });
      inkLine(P([[ex - er, yy - tilt * er], [ex + er, yy + tilt * er]]), sw * .8, INK, 'ink', 0);
    }
  }
  pop();
  pop();
}

// ---------------- thought bubbles and pencil doodles ----------------
const GRAPH = '#47423C', BUBC = '#ECE9E3';
function bubble(x, y, w, h, tail, k, key, doodle) {
  if (k <= .01) return;
  boilSeed('bubble ' + key);
  const s = backOut(k), rx = w / 2 * s, ry = h / 2 * s, ta = Math.atan2((tail[1] - y) / ry, (tail[0] - x) / rx);
  const tip = [lerp(x, tail[0], s), lerp(y, tail[1], s)], pts = [];
  for (let i = 0; i < 36; i++) {
    const a = ta + .22 + i / 36 * (TAU - .44);
    pts.push([x + Math.cos(a) * rx * (1 + .03 * Math.sin(a * 5 + 1)), y + Math.sin(a) * ry * (1 + .03 * Math.sin(a * 5 + 1))]);
  }
  pts.push(tip);
  paint(pts, { wash: BUBC, ink: null, curv: .2 });
  inkLine([...pts.slice(0, 36)], 1.4, '#8C8780', 'HB', .4);
  inkLine([pts[35], tip, pts[0]], 1.4, '#8C8780', 'HB', 0);
  if (doodle && s > .3) { push(); translate(x, y); doodle(Math.min(rx, ry * 1.3) * .85); pop(); }
}
const dl = (s, P, w = 1.6, c = GRAPH, curv = .4) => inkLine(P.map(([a, b]) => [a * s, b * s]), w * 1.5, c, 'HB', P.length < 3 ? 0 : curv);   // 2-point splines need curv 0
const dlE = (s, cx, cy, rx, ry, w = 1.6, n = 22, a0 = 0, a1 = TAU) => { const P = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); P.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } dl(s, P, w); };
const DOODLE = {
  // a far lake with a lotus, reeds and a sun
  lake(s) {
    dlE(s, 0, .3, .85, .3, 1.8);
    for (const [x0, y0, l] of [[-.5, .25, .3], [.1, .42, .35], [.35, .2, .22]]) dl(s, [[x0, y0], [x0 + l * .3, y0 - .04], [x0 + l * .6, y0], [x0 + l, y0 - .04]], 1.2);
    for (const a of [-.5, 0, .5]) dl(s, [[.05, .1], [.05 + Math.sin(a) * .2, -.12 - Math.cos(a) * .05], [.05 + Math.sin(a) * .08, .08]], 1.6, GRAPH, .6);
    dl(s, [[-.85, .2], [-.82, -.25]], 1.2); dl(s, [[-.75, .25], [-.68, -.38]], 1.2); dl(s, [[-.68, -.38], [-.66, -.46]], 3);
    dlE(s, .62, -.45, .14, .14, 1.4);
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; dl(s, [[.62 + Math.cos(a) * .2, -.45 + Math.sin(a) * .2], [.62 + Math.cos(a) * .28, -.45 + Math.sin(a) * .28]], 1.2); }
  },
  // the tortoise with tiny flapping wings, sweating: he can't fly
  wings(s) {
    dlE(s, -.05, .25, .5, .38, 1.8, 18, Math.PI, TAU); dl(s, [[-.55, .25], [.45, .25]], 1.6);
    dlE(s, .62, .12, .14, .12, 1.6); dl(s, [[-.35, .25], [-.38, .4]], 1.6); dl(s, [[.25, .25], [.28, .4]], 1.6);
    const fl = Math.sin(T * 22) * .12;
    dl(s, [[-.1, -.1], [-.45, -.55 - fl], [-.35, -.35], [-.5, -.32], [-.05, -.18]], 1.6, GRAPH, .2); dl(s, [[.05, -.1], [.3, -.6 + fl], [.3, -.4], [.45, -.42], [.15, -.15]], 1.6, GRAPH, .2);
    dl(s, [[-.55, -.35], [-.7, -.4]], 1.1); dl(s, [[-.55, -.22], [-.72, -.22]], 1.1);
    dl(s, [[.78, -.18], [.72, -.05], [.78, 0], [.84, -.05], [.78, -.18]], 1.2);
  },
  // two swans holding a stick, a tortoise biting the middle
  stick(s) {
    dl(s, [[-.95, -.3], [.95, -.3]], 2, GRAPH, 0);
    for (const bx of [-.98, .62]) {   // two swans flying right, beaks on the stick's ends
      dlE(s, bx, -.62, .2, .1, 1.4); dl(s, [[bx + .18, -.6], [bx + .3, -.5], [bx + .34, -.36]], 1.4);
      dl(s, [[bx + .34, -.36], [bx + .42, -.31]], 1.6); dl(s, [[bx - .05, -.66], [bx - .2, -.92], [bx + .08, -.7]], 1.3, GRAPH, .2);
    }
    dl(s, [[.06, -.3], [.08, -.08]], 1.6); dlE(s, .07, -.32, .09, .07, 1.4);
    dlE(s, -.05, .22, .36, .27, 1.8, 18, Math.PI, TAU); dl(s, [[-.41, .22], [.31, .22]], 1.6);
    dl(s, [[-.25, .22], [-.29, .36]], 1.4); dl(s, [[.15, .22], [.19, .36]], 1.4);
  },
  // a face with its mouth zipped shut
  zip(s) {
    dlE(s, 0, 0, .55, .55, 1.8);
    dl(s, [[-.2, -.18], [-.2, -.1]], 3); dl(s, [[.2, -.18], [.2, -.1]], 3);
    dl(s, [[-.3, .2], [.3, .2]], 1.8, GRAPH, 0);
    for (let i = 0; i < 6; i++) { const x = -.25 + i * .1; dl(s, [[x, .13], [x, .27]], 1.2, GRAPH, 0); }
    dl(s, [[.3, .2], [.38, .28], [.36, .38]], 1.4);
  },
  // a cart wheel
  wheel(s) {
    dlE(s, 0, 0, .55, .55, 2.2); dlE(s, 0, 0, .46, .46, 1.2); dlE(s, 0, 0, .1, .1, 1.8);
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + .2; dl(s, [[Math.cos(a) * .1, Math.sin(a) * .1], [Math.cos(a) * .46, Math.sin(a) * .46]], 1.4, GRAPH, 0); }
  },
  // the cart wheel with a tortoise's head and legs, rolling and laughing
  wheelLegs(s) {
    const r = T * 3;
    dlE(s, 0, 0, .5, .5, 2.2); dlE(s, 0, 0, .09, .09, 1.6);
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + r; dl(s, [[Math.cos(a) * .09, Math.sin(a) * .09], [Math.cos(a) * .42, Math.sin(a) * .42]], 1.3, GRAPH, 0); }
    dlE(s, .66, -.12, .16, .14, 1.6); dl(s, [[.66, -.17], [.68, -.15]], 3); dl(s, [[.7, -.04], [.8, -.06]], 1.3);
    for (const [a, b] of [[-.5, .38], [.45, .4], [-.25, .5], [.2, .52]]) dl(s, [[a, b - .06], [a + .03, b + .12]], 1.6);
    for (let i = 0; i < 3; i++) dl(s, [[-.68 - i * .07, -.25 + i * .22], [-.86 - i * .07, -.25 + i * .22]], 1.1);
  },
  // an angry outburst: a jagged burst with a scribble and a bang
  burst(s) {
    const P = []; for (let i = 0; i <= 16; i++) { const a = i / 16 * TAU, r = i % 2 ? .32 : .58; P.push([Math.cos(a) * r, Math.sin(a) * r * .85]); }
    dl(s, P, 2, GRAPH, 0);
    dl(s, [[-.2, -.05], [-.05, -.18], [-.12, .02], [.08, -.12], [0, .08], [.18, -.05]], 1.4, GRAPH, 0);

  },
};
