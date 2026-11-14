// fable.js: the Fable style (FABLE_GUIDE.md): wordless moral stories on the Painted engine. A black 9:16 frame with a
// two-line headline (one word yellow), the story in a band in the middle, told only by acting and thought bubbles that
// hold grey pencil doodles. Load after core.js, clawd.js (tintCols(), emote()), timeline.js (LOOPS) and bappa.js (U()).
// First reel: reel/tortoise-geese (Panchatantra: the tortoise and the swans). Model sheets: ?loop=fable, ?loop=fabledoodles.
//
// The frame
//   FABLE.band = [600, 1380]: the picture band's top and bottom in screen px (inside Instagram's safe band).
//   fableFrame(lines, fade): call LAST in every shot, after camEnd(): paints the black bars and queues the headline.
//     lines = two strings; wrap the one keyword in *stars* to make it yellow: ['This Is Why You Don\u2019t Need',
//     'To *Reply* To Everyone']. fade 0..1 darkens the band (the last 0.35 s). Needs '700 50px Poppins' in
//     PROJECT.fonts (studio.html already loads Poppins).
//   fableLife(t, a, b, k): a bubble's 0..1 pop for a bubble that is up from a to b (pops in at speed k, out fast).
//   fableWhip(k, dir): vertical speed lines across the band for a whip tilt; k 0..1 across the cut (peak at .5).
//   FABLE.pencil / pencilW / pencilCol: the doodles' brush ('HB', the grainy pencil, by default), its width and colour.
//     The HB grain breaks into dots under a 1.4× camera: 'pen' at pencilW .7 in a soft grey reads at phone size.
//
// The cast
// tortoise(x, y, u, o): a chibi tortoise in side view facing right. (x, y) is the ground under the middle of
//   his shell; about 9u from tail to snout, 5.4u to the top of the shell. Body-local u (y up negative): shell -4.4..4.4,
//   top -5.4, rim -1.3; neck base (3.4, -2.3); head about 1.3u wide.
//   pose:  dx, dy (u), sq, rot (radians, about (0, -3)), flip; neck 0..1 (retracted .. stretched out), neckA (radians
//          added to the neck's angle: - is up), htilt; legs: walk (phase), dangle 0..1 (the feet hang and splay),
//          kick (phase: a flail while dangling)
//   face:  eyes 'normal' | 'wide' | 'closed' | 'happy' | 'angry' | 'sad', lid 0..1 (heavy lids, the deadpan look),
//          lookX / lookY, mouth 'smile' | 'flat' | 'frown' | 'bite' | 'open' | 'grin', openK 0..1, puff 0..1
//          (cheeks blown out), tint + tintK (skin: 'flush' goes red), twitch 0..1 (the eye jumps)
//   tuck:  tuckLegs 0..1, tuckHead 0..1 (drawn into the shell: past halfway the head goes behind it), brows (white
//          elder brows: the old tortoise of reel/fable-phone)
//   extras: noShadow, boilKey, held(u, sw) (a hook in head space at the mouth), pal (overrides TT: shell / skin colours)
// tortoiseMouth(x, y, u, o) → the world point where he bites; tortoiseHead(…) → his eye. To hang him from a stick
//   by his mouth: o = { neck: 1, neckA: -.6, rot: -.5, dangle: 1 }, m = tortoiseMouth(0, 0, u, o), draw at stick - m.
//
// hamsa(x, y, u, o): a swan (hamsa) in side view facing right: white, an orange beak with a dark nail, big eyes.
//   (x, y) is the middle of the body; standing, the feet are 4.6u below it (hamsaStandY(groundY, u) gives y).
//   fly 0..1 (neck forward, legs tucked, wings out), flap (phase, 1 = one stroke), wingsUp 0..1 (folded wings lift
//   and flutter, for landing), down 0..1 (head lowered to the ground), htilt, beak 0..1 (open),
//   eyes 'normal' | 'wide' | 'closed' | 'half' | 'stern', lookX / lookY, tuft (a crest), walk, rot, flip, sq, boilKey
// hamsaBeak(x, y, u, o) → the beak tip; hamsaHead(…) → the head centre. To hold something in the beak, draw the swan
//   at target - hamsaBeak(0, 0, u, o).
// monkey(x, y, u, o): a chibi monkey in 3/4 view facing right, in a red hoodie (hoodie: false for a plain one; pal
//   recolours fur / furDk / furLt / hood / hoodDk). Body-local u (y up negative); (x, y) is the ground between the feet
//   (pose 'stand', hips at -3.75, head centre about (.9, -9.4), ~14u tall) or the seat (pose 'sit', hips at -1.05).
//   pose:  pose, dx, dy, sq, rot, flip, lean (radians: the spine tips forward), hunch 0..1 (shoulders and head forward,
//          the phone slump), hlean (the head forward), htilt; walk (phase, stand)
//   limbs: handN / handF, footN / footF = [x, y] targets in body u (2-bone IK, long monkey arms); elbowN / elbowF /
//          armPref and kneePref = the way the joint points ([x, y]). Sitting on a branch: footN [1.5, 2.3], footF
//          [.9, 2.4], kneePref [1, .2] (the legs hang). Tucked up: feet [1.4, -.2] / [1, -.15], hands [2.4, -2.6] / [2.1, -2.8].
//   tail:  a curl up behind (tailSway: phase); tailTo [x, y] + tailK 0..1: it reaches there on its own
//   face:  eyes 'normal' | 'wide' | 'closed' | 'happy' | 'squeeze' | 'sad' | 'tired' (bags) | 'sparkle', lid 0..1,
//          lookX / lookY, twitch, brows (-1 cross .. 1 raised), mouth 'smile' | 'grin' | 'laugh' | 'open' | 'o' | 'flat' |
//          'frown' | 'tight' | 'wobbly', openK, blush, tint + tintK; light: [colour, k] (the phone's blue on his face,
//          the sunset's orange: the face takes it fully, fur and hoodie half)
//   extras: held(u, sw) (body space, drawn under the near arm), head(u, sw) (head space), noShadow, boilKey, swMul
// mkRig(o) → { H, S, C, armN, armF, legN, legF }; monkeyHand(x, y, u, o, 'n' | 'f') and monkeyHead(…) → world points;
//   mkWorld(x, y, u, o, [lx, ly]) maps any body point. To hang him from a vine: o.handF overhead, draw at
//   vineEnd - monkeyHand(0, 0, u, o, 'f').
// fablePhone(x, y, s, o): a phone s px tall (flat: lying down, s long); rot, on (the screen lit), buzz 0..1 (it shakes,
//   with buzz marks), dot (a red notification dot), app(w, h) (a hook on the screen).
// Other characters: any Painted rig works (kartikeya() with pal is the village kids in the first reel).
//
// The bubbles
// bubble(x, y, w, h, tail, k, key, doodle): a thought bubble (pale grey, pencil outline) centred at (x, y), w × h,
//   with its point aimed at tail = [x, y]; k 0..1 pops it; doodle(s) draws inside in unit space (1 = s px, about
//   -1..1 across). Draw ONE bubble at a time.
// DOODLE.lake / wings / stick / zip / wheel / wheelLegs / burst (reel/tortoise-geese), likes / cat / show / swing / shell /
//   shellHeart (reel/fable-phone: drawn with dlB, a bolder line): the pencil doodles so far. Add new ones to DOODLE
//   with dl(s, points, w, colour, curv) (a pencil line; 2-point lines are drawn straight) and dlE(s, cx, cy, rx, ry, w)
//   (an ellipse or arc).
const TT_BASE = {
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
  const ext = clamp(o.neck ?? .3), L = lerp(lerp(1.1, 3.0, ext), -.3, clamp(o.tuckHead || 0)), a = lerp(-.2, -.5, ext) + (o.neckA || 0);
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
  const TT = o.pal ? { ...TT_BASE, ...o.pal } : TT_BASE;   // pal recolours him (Kurma in dashavatar.js)
  const id = o.boilKey ?? 't' + (++CLAWD_N), rs = p => boilSeed(`tortoise ${id} ${p}`);
  const sw = clamp(u / 20, .4, 2), INK = TT.ink, P = pts => U(pts, u), J = u * .03, sq = o.sq || 0;
  const { col: skin, dk: skinDk, lt: skinLt } = tintCols({ ...o, col: TT.skin, dk: TT.skinDk, lt: TT.skinLt });
  const n = ttNeck(o), dangle = clamp(o.dangle || 0), tkL = clamp(o.tuckLegs || 0), tkH = clamp(o.tuckHead || 0);
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
    if (tkL > 0) { if (tkL > .9) return; fx = lerp(fx, bx * .85, tkL); fy = lerp(fy, -1.75, tkL); }   // pulled in under the shell
    rs('leg' + bx + far);
    const c = far ? skinDk : skin;
    paint(ribbon(P([[bx, -1.9], [lerp(bx, fx, .5), lerp(-1.9, fy, .5) - .05], [fx, fy - .35]]), 1.05 * u, .95 * u), { wash: c, ink: INK, sw: sw * .7 });
    paint(ellPts(fx * u, (fy - .3) * u, .62 * u, .38 * u, 12, J), { wash: c, ink: INK, sw: sw * .6 });
    for (let i = -1; i <= 1; i++) inkLine(P([[fx + .25 + i * .22, fy - .5], [fx + .3 + i * .24, fy - .18]]), sw * .45, far ? TT.ink : skinDk, 'inkfine', 0);
  };
  // behind: far legs, tail, neck
  leg(-1.6, true, .5); leg(3.1, true, 0);
  if (tkL > .5) { leg(-2.6, false, 0); leg(2.3, false, .5); }
  if (tkL < .9) { rs('tail'); paint(P([[-4.1, -2.1], [lerp(-5.1, -4.3, tkL), lerp(-1.6, -1.9, tkL)], [-4.0, -1.45]]), { wash: skin, ink: INK, sw: sw * .7, curv: .3 }); }
  if (tkH > .55) headDraw();   // pulled in: behind the shell's front
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
  if (tkL <= .5) { leg(-2.6, false, 0); leg(2.3, false, .5); }
  if (tkH <= .55) headDraw();
  pop();

  // the head (o.tuckHead pulls it in: past halfway it's drawn behind the shell)
  function headDraw() {
  push(); translate(n.hx * u, n.hy * u); rotate(n.ha); scale(lerp(1, .7, tkH));
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
  if (o.brows) {   // an elder's white brows, bushy over the eye
    rs('brows'); const by = ey - er - .12 + (e === 'closed' || e === 'happy' ? .12 : 0);
    paint(P([[ex - .7, by + .18], [ex - .3, by - .12], [ex + .25, by - .2], [ex + .65, by - .02], [ex + .2, by + .08], [ex - .3, by + .14]]), { wash: '#F4F0E6', ink: INK, sw: sw * .5, curv: .5 });
    for (let i = 0; i < 3; i++) inkLine(P([[ex - .45 + i * .35, by - .02], [ex - .25 + i * .35, by - .14]]), sw * .35, '#B8B2A4', 'inkfine', 0);
  }
  pop();
  }
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

// ---------------- the monkey (kapi) ----------------
const MK = {
  fur: '#8A5A3C', furDk: '#673F27', furLt: '#A87452', face: '#F1CFA4', faceDk: '#D6A97C', faceLt: '#FBE4C6',
  hood: '#D2483C', hoodDk: '#9C3027', hoodLt: '#EC7A62', ink: '#3A2A22', eye: '#FBF6E8', pupil: '#2A1E18',
  mouth: '#6E2A26', tongue: '#E07A74', bag: '#9C7B8E', blush: '#E98A78',
};
// 2-bone IK in body u: shoulder/hip a, target b, bone lengths; the elbow/knee goes the way of pref ([x, y])
function mkIK(a, b, L1, L2, pref) {
  let dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1e-3;
  const reach = (L1 + L2) * .995;
  if (d > reach) { b = [a[0] + dx / d * reach, a[1] + dy / d * reach]; dx = b[0] - a[0]; dy = b[1] - a[1]; d = reach; }
  d = Math.max(d, .4);
  const g = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), base = Math.atan2(dy, dx);
  const e1 = [a[0] + Math.cos(base + g) * L1, a[1] + Math.sin(base + g) * L1], e2 = [a[0] + Math.cos(base - g) * L1, a[1] + Math.sin(base - g) * L1];
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], dot = e => (e[0] - m[0]) * pref[0] + (e[1] - m[1]) * pref[1];
  return [a, dot(e1) >= dot(e2) ? e1 : e2, b];
}
const rot2 = ([x, y], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
// the skeleton, in body u (y up negative), before flip/rot
function mkRig(o) {
  const sit = o.pose === 'sit', hunch = clamp(o.hunch || 0), lean = (o.lean || 0) + hunch * .45;
  let H = sit ? [0, -1.05] : [0, -3.75];
  if (!sit && o.walk != null) H = [H[0], H[1] - Math.abs(Math.sin(o.walk * TAU)) * .25];
  const sp = rot2([0, -3.3], lean), S = [H[0] + sp[0], H[1] + sp[1]];
  const hl = lean * 1.15 + hunch * .35 + (o.hlean || 0), hv = rot2([.25, -2.75], hl);
  const C = [S[0] + hv[0] + hunch * .5, S[1] + hv[1] + hunch * .55], hr = (o.htilt || 0) + lean * .35 + hunch * .35;
  const SN = [S[0] + .55, S[1] + .4], SF = [S[0] - .35, S[1] + .25];
  const handN = o.handN || [S[0] + .9, S[1] + 2.9], handF = o.handF || [S[0] - .15, S[1] + 2.9];
  const armPref = o.armPref || [-.4, 1];
  const armN = mkIK(SN, handN, 2.0, 1.85, o.elbowN || armPref), armF = mkIK(SF, handF, 2.0, 1.85, o.elbowF || armPref);   // long monkey arms
  const HN = [H[0] + .45, H[1] + .1], HF = [H[0] - .3, H[1]];
  let fN = o.footN, fF = o.footF;
  if (!fN || !fF) {
    if (sit) { fN = fN || [2.35, -.3]; fF = fF || [1.75, -.25]; }
    else {
      let a = [.55, -.32], b = [-.35, -.32];
      if (o.walk != null) { const w = o.walk * TAU; a = [.1 + Math.sin(w) * .9, -.32 - Math.max(0, Math.cos(w)) * .5]; b = [.1 - Math.sin(w) * .9, -.32 - Math.max(0, -Math.cos(w)) * .5]; }
      fN = fN || a; fF = fF || b;
    }
  }
  const legPref = o.kneePref || (sit ? [.35, -1] : [1, -.15]);
  const legN = mkIK(HN, fN, 2.0, 1.85, legPref), legF = mkIK(HF, fF, 2.0, 1.85, legPref);
  return { H, S, C, hr, armN, armF, legN, legF, lean };
}
function mkWorld(x, y, u, o, [lx, ly]) {
  const sq = o.sq || 0, r = o.rot || 0, px = lx * (1 + sq * .6), py = ly * (1 - sq);
  const [rx, ry] = rot2([px, py], r);
  return [x + ((o.dx || 0) + (o.flip ? -rx : rx)) * u, y + ((o.dy || 0) + ry) * u];
}
const monkeyHand = (x, y, u, o = {}, which = 'n') => mkWorld(x, y, u, o, mkRig(o)[which === 'n' ? 'armN' : 'armF'][2]);
const monkeyHead = (x, y, u, o = {}) => mkWorld(x, y, u, o, mkRig(o).C);
function monkeyTailPts(o, H) {   // the tail from the base of the spine: a curl up behind, or reaching for tailTo
  const b = [H[0] - .9, H[1] + .35], sway = .25 * Math.sin((o.tailSway ?? T * 1.3) * TAU);
  const curl = [b, [b[0] - 1.6, b[1] + .5], [b[0] - 3.0, b[1] - .3 + sway * .5], [b[0] - 3.5, b[1] - 1.9 + sway], [b[0] - 2.9, b[1] - 2.9 + sway], [b[0] - 2.2, b[1] - 2.5 + sway], [b[0] - 2.5, b[1] - 1.95 + sway]];
  const k = clamp(o.tailK || 0); if (!o.tailTo || k <= 0) return curl;
  const t = o.tailTo, m = [lerp(b[0], t[0], .5), Math.min(b[1], t[1]) - 2.2 - .3 * Math.sin(T * 9)];
  const reach = [b, [lerp(b[0], m[0], .5) - .6, b[1] + .2], m, [lerp(m[0], t[0], .6), lerp(m[1], t[1], .5) - .3], [t[0] - .25, t[1] - .5], [t[0], t[1]], [t[0] + .3, t[1] - .3]];
  return curl.map((p, i) => [lerp(p[0], reach[i][0], k), lerp(p[1], reach[i][1], k)]);
}
function monkey(x, y, u, o = {}) {
  const id = o.boilKey ?? 'm' + (++CLAWD_N), rs = p => boilSeed(`monkey ${id} ${p}`);
  const sw = clamp(u / 20, .4, 2) * (o.swMul || 1), INK = MK.ink, P = pts => U(pts, u), J = u * .03;
  // light: [colour, k] tints him with a light source (the phone's blue, the sunset's orange): the face takes it fully, the fur half
  const C0 = { ...MK, ...(o.pal || {}) }, lt = o.light, L = c => lt ? mixCol(c, lt[0], lt[1]) : c, Lh = c => lt ? mixCol(c, lt[0], lt[1] * .45) : c;
  const fur = tintCols({ ...o, col: Lh(C0.fur), dk: Lh(C0.furDk), lt: Lh(C0.furLt) }), face = L(C0.face), faceDk = L(C0.faceDk), faceLt = L(C0.faceLt);
  const hoodie = o.hoodie !== false, cloth = hoodie ? Lh(C0.hood) : fur.col, clothDk = hoodie ? Lh(C0.hoodDk) : fur.dk;
  const R = mkRig(o), { H, S, C } = R;
  if (!o.noShadow) { rs('shadow'); paint(ellPts(x + (o.dx || 0) * u + u * .5, y + u * .1, u * (o.pose === 'sit' ? 3.4 : 2.4), u * .45, 18), { fill: PAL.ink, fillOp: 60, bleed: .2, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + (o.dx || 0) * u, y + (o.dy || 0) * u);
  scale(o.flip ? -1 : 1, 1); rotate(o.rot || 0); scale(1 + (o.sq || 0) * .6, 1 - (o.sq || 0));

  const limb = (pts, w0, w1, col, key) => { rs(key); paint(ribbon(P(pts), w0 * u, w1 * u), { wash: col, ink: INK, sw: sw * .7 }); };
  const hand = (p, prev, key, far) => {
    rs(key); const a = Math.atan2(p[1] - prev[1], p[0] - prev[0]);
    push(); translate(p[0] * u, p[1] * u); rotate(a);
    paint(ellPts(.25 * u, 0, .5 * u, .42 * u, 14, J), { wash: far ? faceDk : face, ink: INK, sw: sw * .6 });
    paint(ellPts(.15 * u, -.38 * u, .2 * u, .14 * u, 8), { wash: far ? faceDk : face, ink: INK, sw: sw * .45 });   // thumb
    pop();
  };
  const foot = (p, prev, key, far) => {
    rs(key); const fwd = o.pose === 'sit' ? .25 : 0;
    paint(P([[p[0] - .35, p[1] - .2], [p[0] + .45, p[1] - .2 - fwd], [p[0] + 1.0, p[1] + .05 - fwd], [p[0] + .9, p[1] + .3], [p[0] - .3, p[1] + .3]]), { wash: far ? faceDk : face, ink: INK, sw: sw * .55, curv: .4 });
  };
  const leg = (lg, key, far) => { limb(lg, .95, .8, far ? fur.dk : fur.col, key); foot(lg[2], lg[1], key + 'f', far); };
  const arm = (ar, key, far) => {
    limb([ar[0], ar[1], ar[2]], .92, .78, far ? clothDk : cloth, key);
    if (hoodie) { const c = [lerp(ar[1][0], ar[2][0], .8), lerp(ar[1][1], ar[2][1], .8)]; inkLine(P([[c[0] - .3, c[1] - .2], [c[0] + .3, c[1] + .2]]), sw * .5, clothDk, 'inkfine', 0); }
    hand(ar[2], ar[1], key + 'h', far);
  };

  // the tail, then the far limbs
  rs('tail'); paint(ribbon(P(through(monkeyTailPts(o, H), 4)), .5 * u, .28 * u), { wash: fur.col, ink: INK, sw: sw * .65 });
  leg(R.legF, 'legF', true); arm(R.armF, 'armF', true);
  // the hood bunched behind the neck, the body
  if (hoodie) { rs('hood'); paint(ellPts((S[0] - .9) * u, (S[1] - .05) * u, 1.25 * u, .85 * u, 16, J, -.4 + R.lean), { wash: clothDk, ink: INK, sw: sw * .6 }); }
  rs('body');
  const mid = [lerp(H[0], S[0], .5) + .35, lerp(H[1], S[1], .5)];
  paint(ribbon(P([[H[0] - .1, H[1] + .45], mid, [S[0], S[1] - .1]]), 3.5 * u, 2.6 * u), { wash: cloth, ink: INK, sw: sw * .85 });
  if (hoodie) {
    const pk = [lerp(H[0], S[0], .3) + .8, lerp(H[1], S[1], .3)];
    inkLine(P([[pk[0] - .9, pk[1] - .45], [pk[0] + .6, pk[1] - .5], [pk[0] + .9, pk[1] + .35]]), sw * .55, clothDk, 'inkfine', .3);   // the pouch
    inkLine(P([[H[0] - 1.4, H[1] + .25], [H[0] + 1.7, H[1] + .3]]), sw * .6, clothDk, 'inkfine', .2);   // the hem band
    for (const dx of [.45, .85]) inkLine(P([[S[0] + dx, S[1] + .3], [S[0] + dx + .05, S[1] + 1.2]]), sw * .5, '#F4EDE2', 'inkfine', 0);   // drawstrings
  } else { rs('belly'); paint(ellPts((mid[0] + .55) * u, (mid[1] + .2) * u, 1.05 * u, 1.45 * u, 16, J, R.lean), { wash: faceLt, ink: null }); }
  leg(R.legN, 'legN', false);

  // the head
  push(); translate(C[0] * u, C[1] * u); rotate(R.hr);
  rs('ears');
  paint(ellPts(2.75 * u, -.25 * u, .6 * u, .7 * u, 12), { wash: fur.dk, ink: INK, sw: sw * .55 });   // far ear, peeking
  paint(ellPts(-2.85 * u, .1 * u, 1.05 * u, 1.1 * u, 16, J), { wash: fur.col, ink: INK, sw: sw * .7 });
  paint(ellPts(-3.05 * u, .12 * u, .6 * u, .68 * u, 12), { wash: faceDk, ink: null });
  rs('head');
  paint(ellPts(0, 0, 3.0 * u, 2.75 * u, 26, J), { wash: fur.col, ink: INK, sw });
  paint(P([[-1.8, -1.9], [-.6, -2.5], [.8, -2.45], [-.4, -2.1]]), { wash: fur.lt, washOp: 150, ink: null, curv: .5 });   // sheen
  rs('tuft');
  paint(P([[-1.2, -2.4], [-1.05, -3.1], [-.45, -3.55], [.4, -3.75], [1.25, -3.45], [.75, -3.25], [1.05, -2.95], [.4, -3.05], [.35, -2.5]]), { wash: fur.col, ink: INK, sw: sw * .6, curv: .45 });   // a swept quiff
  inkLine(P([[-.6, -2.9], [0, -3.35], [.7, -3.4]]), sw * .45, fur.dk, 'inkfine', .5);
  rs('mask');
  const tintFace = o.tint ? tintCols({ ...o, col: face, dk: faceDk, lt: faceLt }) : { col: face, dk: faceDk, lt: faceLt };
  paint(ellPts(-.05 * u, -.4 * u, 1.25 * u, 1.3 * u, 18), { wash: tintFace.col, ink: null });
  paint(ellPts(1.6 * u, -.42 * u, .95 * u, 1.15 * u, 16), { wash: tintFace.col, ink: null });
  paint(ellPts(1.05 * u, .95 * u, 1.6 * u, 1.1 * u, 20, J), { wash: tintFace.col, ink: INK, sw: sw * .6 });
  if (o.blush) { glow(.0 * u, .45 * u, u * .9, MK.blush, .3 * o.blush); paint(ellPts(-.1 * u, .55 * u, .45 * u, .2 * u, 10), { wash: MK.blush, washOp: 150 * o.blush, ink: null }); }
  // nose and mouth
  inkLine(P([[1.4, .45], [1.45, .5]]), sw * 1.1, INK, 'ink', 0); inkLine(P([[1.8, .42], [1.85, .47]]), sw * 1.1, INK, 'ink', 0);
  const m = o.mouth || 'smile', mx = 1.15, my = 1.35, ok = clamp(o.openK ?? 1);
  if (m === 'grin' || m === 'laugh' || m === 'open' || m === 'o') {
    const w = m === 'o' ? .32 : m === 'open' ? .55 : .85, h = (m === 'o' ? .32 : m === 'open' ? .6 : .55) * (.4 + .6 * ok);
    const pts = m === 'o' || m === 'open' ? ellPts(mx * u, (my + h * .3) * u, w * u, h * u, 14) : P([[mx - w, my - .1], [mx + w, my - .15], [mx + w * .6, my + h * .7], [mx, my + h], [mx - w * .6, my + h * .7]]);
    paint(pts, { wash: MK.mouth, ink: INK, sw: sw * .7, curv: m === 'grin' || m === 'laugh' ? .4 : 0 });
    if (m === 'grin' || m === 'laugh') paint(P([[mx - w * .8, my - .05], [mx + w * .8, my - .1], [mx + w * .7, my + .12], [mx - w * .7, my + .14]]), { wash: '#FFF8EE', ink: null });
    if (m === 'laugh') paint(ellPts(mx * u, (my + h * .7) * u, w * .45 * u, h * .3 * u, 12), { wash: MK.tongue, ink: null });
  } else {
    const ends = { smile: [[mx - .75, my - .1], [mx, my + .3], [mx + .75, my - .15]], flat: [[mx - .6, my + .1], [mx, my + .12], [mx + .6, my + .08]],
      frown: [[mx - .6, my + .3], [mx, my + .02], [mx + .6, my + .28]], tight: [[mx - .55, my + .2], [mx - .2, my + .08], [mx + .2, my + .1], [mx + .55, my + .22]],
      wobbly: [[mx - .6, my + .15], [mx - .3, my + .02], [mx, my + .16], [mx + .3, my + .02], [mx + .6, my + .15]] }[m] || [[mx - .6, my], [mx + .6, my]];
    inkLine(P(ends), sw * .95, INK, 'ink', m === 'wobbly' || m === 'tight' ? .3 : .5);
  }
  // the eyes: big and pale, with heavy lids (the deadpan look); far eye smaller
  rs('eyes');
  const e = o.eyes || 'normal';
  const eye = (ex, ey, er, far) => {
    if (e === 'closed' || e === 'happy') { inkLine(P(e === 'happy' ? [[ex - er * .75, ey + .12], [ex, ey - .28], [ex + er * .75, ey + .12]] : [[ex - er * .8, ey - .05], [ex, ey + .25], [ex + er * .8, ey - .05]]), sw * 1.0, INK, 'ink', .5); return; }
    if (e === 'squeeze') { const s = far ? -1 : 1; inkLine(P([[ex - s * er * .7, ey - er * .55], [ex + s * er * .45, ey], [ex - s * er * .7, ey + er * .55]]), sw * 1.0, INK, 'ink', .2); return; }
    const r = e === 'wide' ? er * 1.12 : er, tw = !far && o.twitch ? Math.sin(T * 70) * .05 * o.twitch : 0;
    paint(ellPts(ex * u, (ey + tw) * u, r * u, r * 1.12 * u, 18), { wash: L(MK.eye), ink: INK, sw: sw * .5 });
    const lx = clamp(o.lookX ?? .5, -1, 1), ly = clamp(o.lookY ?? 0, -1, 1), pr = (e === 'wide' ? .2 : .27) * er / .7;
    const px = ex + lx * r * .45, py = ey + tw + ly * r * .45;
    paint(ellPts(px * u, py * u, pr * u, pr * 1.1 * u, 12), { wash: MK.pupil, ink: null });
    paint(ellPts((px + pr * .35) * u, (py - pr * .4) * u, pr * .35 * u, pr * .35 * u, 8), { wash: '#FFFFFF', ink: null });
    if (e === 'sparkle') for (const [a, b, s] of [[-.3, -.3, .22], [.3, .25, .14]]) paint(starPts((ex + a * r) * u, (ey + b * r) * u, s * u), { wash: '#FFFFFF', ink: null });
    let lid = clamp(o.lid ?? .2); if (e === 'wide' || e === 'sparkle') lid = 0; if (e === 'sad') lid = Math.max(lid, .45); if (e === 'tired') lid = Math.max(lid, .55);
    if (lid > .02) {
      const tilt = (e === 'sad' ? -.35 : e === 'angry' ? .35 : 0) * (far ? -1 : 1) * -1, yy = ey + tw - r + lid * r * 2.1, cap = [];
      for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; cap.push([ex + Math.cos(a) * r * 1.06, Math.min(ey + tw + Math.sin(a) * r * 1.12, yy + Math.cos(a) * tilt * r)]); }
      paint(P(cap), { wash: tintFace.col, ink: null });
      inkLine(P([[ex - r, yy - tilt * r], [ex + r, yy + tilt * r]]), sw * .75, INK, 'ink', 0);
    }
    if (e === 'tired') { inkLine(P([[ex - r * .7, ey + r * 1.05], [ex, ey + r * 1.3], [ex + r * .7, ey + r * 1.05]]), sw * .8, L(MK.bag), 'inkfine', .5); inkLine(P([[ex - r * .5, ey + r * 1.35], [ex, ey + r * 1.5], [ex + r * .5, ey + r * 1.35]]), sw * .6, L(MK.bag), 'inkfine', .5); }
  };
  eye(1.62, -.45, .5, true); eye(-.05, -.4, .7, false);
  if (o.brows != null) {   // -1 cross .. +1 raised / worried
    const b = o.brows;
    inkLine(P([[-.5, -1.4 - b * .25], [.65, -1.5 - b * .05 + (b < 0 ? .25 : 0)]]), sw * 1.1, INK, 'ink', 0);
    inkLine(P([[1.25, -1.45 - b * .05 + (b < 0 ? .25 : 0)], [2.0, -1.35 - b * .25]]), sw * 1.0, INK, 'ink', 0);
  }
  if (o.head) o.head(u, sw);
  pop();
  if (o.held) o.held(u, sw);
  arm(R.armN, 'armN', false);
  pop();
}

// the phone: a little slab with a glowing screen, centred at (x, y), s px tall. buzz 0..1 shakes it and draws buzz
// marks; on 0..1 lights the screen (and its glow); flat: lying on its back seen edge-on from the side (s = its length)
function fablePhone(x, y, s, o = {}) {
  const bz = clamp(o.buzz || 0), sh = bz ? Math.sin(T * 95) * s * .04 * bz : 0, on = o.on ?? 1, key = o.key || 'phone';
  boilSeed(key);
  push(); translate(x + sh, y); rotate((o.rot || 0) + (bz ? Math.sin(T * 80) * .06 * bz : 0));
  if (o.flat) {
    paint(rrPts(-s / 2, -s * .1, s, s * .2, s * .08), { wash: '#2C2A34', ink: PAL.ink, sw: 1.1 });
    if (on > 0) { paint(rrPts(-s * .44, -s * .16, s * .88, s * .09, s * .04), { wash: mixCol('#2C2A34', '#BEE6FF', on), ink: PAL.ink, sw: .6 }); }
  } else {
    const w = s * .52;
    paint(rrPts(-w / 2, -s / 2, w, s, s * .1), { wash: '#2C2A34', ink: PAL.ink, sw: 1.1 });
    paint(rrPts(-w / 2 + s * .05, -s / 2 + s * .07, w - s * .1, s - s * .14, s * .05), { wash: mixCol('#3A3946', '#BEE6FF', on), ink: null });
    if (on > .3 && o.app) o.app(w - s * .1, s - s * .14);
    if (o.dot) paint(ellPts(w / 2 - s * .06, -s / 2 + s * .06, s * .07, s * .07, 10), { wash: '#E2476E', ink: PAL.ink, sw: .6 });
  }
  pop();
  if (bz > .05) for (const sgn of [-1, 1]) for (let i = 0; i < 2; i++) {   // buzz marks either side
    const r = s * (.45 + i * .18) * (o.flat ? 1.2 : 1);
    inkLine([[x + sgn * r, y - s * .18], [x + sgn * (r + s * .06), y - s * .06], [x + sgn * r, y + s * .06], [x + sgn * (r + s * .06), y + s * .18]], 1.4 * bz, PAL.ink, 'inkfine', 0);
  }
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
const dl = (s, P, w = 1.6, c = FABLE.pencilCol || GRAPH, curv = .4) => inkLine(P.map(([a, b]) => [a * s, b * s]), w * 1.5 * (FABLE.pencilW || 1), c, FABLE.pencil || 'HB', P.length < 3 ? 0 : curv);   // 2-point splines need curv 0
const dlE = (s, cx, cy, rx, ry, w = 1.6, n = 22, a0 = 0, a1 = TAU) => { const P = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); P.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } dl(s, P, w); };
const dlHeart = (s, cx, cy, r) => { const P = []; for (let i = 0; i <= 20; i++) { const a = i / 20 * TAU; P.push([cx + r * Math.pow(Math.sin(a), 3), cy - r * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 16]); } dl(s, P, 1.6, GRAPH, .3); };
// the bolder pencil of the Be-Like-A-Tortoise doodles (they read at phone size)
const dlB = (s, P, w = 1.6, c, curv) => dl(s, P, w * 1.2, c, curv), dlEB = (s, cx, cy, rx, ry, w = 1.6, n, a0, a1) => dlE(s, cx, cy, rx, ry, w * 1.2, n, a0, a1);
const dlHeartB = (s, cx, cy, r) => { const P = []; for (let i = 0; i <= 20; i++) { const a = i / 20 * TAU; P.push([cx + r * Math.pow(Math.sin(a), 3), cy - r * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 16]); } dl(s, P, 2.0, undefined, .3); };
const DOODLE = {
  // a phone with hearts floating up out of it (likes)
  likes(s) {
    dlB(s, [[-.26, -.55], [.26, -.55], [.26, .6], [-.26, .6], [-.26, -.55]], 1.8, GRAPH, 0); dlB(s, [[-.18, -.42], [.18, -.42], [.18, .45], [-.18, .45], [-.18, -.42]], 1.1, GRAPH, 0);
    dlHeartB(s, 0, .02, .15);
    for (let i = 0; i < 4; i++) { const ph = frac(T * .9 + i / 4), x = (i % 2 ? .55 : -.55) + Math.sin(ph * 6 + i) * .08; if (ph < .1) continue; dlHeartB(s, x, .4 - ph * 1.0, .1 + ph * .12); }
  },
  // a cat dancing on its hind legs, with music notes
  cat(s) {
    const w = Math.sin(T * 9), b = Math.abs(Math.sin(T * 9)) * .05;
    dlEB(s, 0, .2 - b, .22, .3, 1.8); dlEB(s, 0, -.25 - b, .2, .18, 1.8);
    dlB(s, [[-.17, -.35 - b], [-.15, -.52 - b], [-.04, -.42 - b]], 1.5, GRAPH, 0); dlB(s, [[.17, -.35 - b], [.15, -.52 - b], [.04, -.42 - b]], 1.5, GRAPH, 0);
    dlB(s, [[-.08, -.28 - b], [-.08, -.24 - b]], 3); dlB(s, [[.08, -.28 - b], [.08, -.24 - b]], 3); dlB(s, [[-.05, -.16 - b], [0, -.13 - b], [.05, -.16 - b]], 1.2);
    for (const sg of [-1, 1]) { dlB(s, [[sg * .2, -.24 - b], [sg * .38, -.27 - b]], 1); dlB(s, [[sg * .2, -.2 - b], [sg * .37, -.17 - b]], 1); }
    dlB(s, [[-.18, .05 - b], [-.38, -.15 + w * .12], [-.42, -.35 + w * .15]], 1.6); dlB(s, [[.18, .05 - b], [.38, -.15 - w * .12], [.42, -.35 - w * .15]], 1.6);
    dlB(s, [[-.1, .48 - b], [-.18 + w * .06, .62]], 1.6); dlB(s, [[.1, .48 - b], [.18 + w * .06, .62]], 1.6);
    dlB(s, [[.2, .35 - b], [.45, .3], [.5, .1 + w * .08], [.42, 0]], 1.5);
    for (const [x, y, ph] of [[-.65, -.3, 0], [.68, -.45, .5]]) { const yy = y - frac(T * .7 + ph) * .2; dlEB(s, x, yy, .06, .045, 1.6); dlB(s, [[x + .06, yy], [x + .06, yy - .22]], 1.4); dlB(s, [[x + .06, yy - .22], [x + .14, yy - .17]], 1.4); }
  },
  // a show-off: a monkey in sunglasses with a giant mango, sparkles all round
  show(s) {
    dlEB(s, -.3, -.05, .36, .33, 1.8); dlEB(s, -.68, -.08, .1, .12, 1.4); dlEB(s, .08, -.1, .08, .1, 1.2);
    dlEB(s, -.24, .08, .22, .14, 1.2);
    dlB(s, [[-.55, -.15], [-.35, -.16], [-.33, -.06], [-.5, -.05], [-.55, -.15]], 2.6, GRAPH, 0); dlB(s, [[-.24, -.16], [-.04, -.17], [-.06, -.07], [-.22, -.06], [-.24, -.16]], 2.6, GRAPH, 0);
    dlB(s, [[-.35, -.15], [-.24, -.16]], 1.6); dlB(s, [[-.32, .12], [-.2, .16], [-.1, .1]], 1.4);
    dlB(s, [[.25, .05], [.48, -.32], [.82, -.32], [.92, .02], [.75, .38], [.45, .4], [.25, .05]], 2.2, GRAPH, .5);
    dlB(s, [[.66, -.32], [.7, -.45]], 1.6); dlB(s, [[.7, -.45], [.88, -.52], [.78, -.4], [.7, -.45]], 1.3, GRAPH, .3);
    dlB(s, [[.12, .25], [.3, .2]], 1.6); dlB(s, [[.42, .05], [.55, -.08]], 1.1);
    const tw = 1 + .25 * Math.sin(T * 10);
    for (const [x, y, r] of [[-.75, -.5, .09], [.15, -.55, .11], [.98, -.6, .08], [1.0, .3, .07]]) { const q = r * tw; dlB(s, [[x - q, y], [x + q, y]], 1.4, GRAPH, 0); dlB(s, [[x, y - q], [x, y + q]], 1.4, GRAPH, 0); }
  },
  // come and play: two little monkeys swinging on a vine under a sun
  swing(s) {
    dlB(s, [[-.9, -.62], [-.3, -.5], [.3, -.52], [.9, -.62]], 2, GRAPH, .5);
    const sw = Math.sin(T * 4) * .25;
    for (const [x0, ph] of [[-.4, 0], [.3, 1]]) {
      const a = sw * (ph ? -1 : 1), hx = x0 + Math.sin(a) * .55, hy = -.52 + Math.cos(a) * .55;
      dlB(s, [[x0, -.52], [hx, hy - .1]], 1.3, GRAPH, 0);
      dlEB(s, hx, hy + .05, .12, .11, 1.6); dlEB(s, hx - .13, hy + .02, .045, .05, 1.1); dlEB(s, hx + .13, hy + .02, .045, .05, 1.1);
      dlB(s, [[hx - .04, hy + .06], [hx, hy + .09], [hx + .04, hy + .06]], 1.1);
      dlB(s, [[hx, hy + .16], [hx + .02, hy + .38]], 1.6); dlB(s, [[hx + .02, hy + .38], [hx - .08, hy + .5]], 1.3); dlB(s, [[hx + .02, hy + .38], [hx + .12, hy + .5]], 1.3);
      dlB(s, [[hx - .02, hy + .38], [hx - .2, hy + .42], [hx - .25, hy + .3], [hx - .18, hy + .26]], 1.1, GRAPH, .5);
      for (let i = 0; i < 2; i++) dlB(s, [[hx - .25 - i * .08, hy + .12 + i * .08], [hx - .4 - i * .08, hy + .18 + i * .08]], 1);
    }
    dlEB(s, .72, .35, .13, .13, 1.4); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; dlB(s, [[.72 + Math.cos(a) * .19, .35 + Math.sin(a) * .19], [.72 + Math.cos(a) * .27, .35 + Math.sin(a) * .27]], 1.1); }
  },
  // the tortoise tucked in her shell: the phone's buzzes bounce off it
  shell(s) {
    dlEB(s, .15, .3, .55, .45, 2, 20, Math.PI, TAU); dlB(s, [[-.42, .3], [.72, .3]], 1.8, GRAPH, 0);
    dlB(s, [[-.1, .3], [-.05, -.02], [.2, -.1], [.38, .05], [.4, .3]], 1.1, GRAPH, .2); dlB(s, [[-.05, -.02], [-.28, .05]], 1.1); dlB(s, [[.38, .05], [.6, .1]], 1.1);
    dlB(s, [[-.95, .0], [-.75, .0], [-.75, .38], [-.95, .38], [-.95, .0]], 1.6, GRAPH, 0);
    const ph = frac(T * 1.4);
    for (let i = 0; i < 2; i++) {   // zigzags out to the shell, bouncing back off it as small arcs
      const k = frac(ph + i * .5), x = lerp(-.65, -.38, k);
      dlB(s, [[x, .02], [x + .05, .1], [x, .18], [x + .05, .26]], 1.2, GRAPH, 0);
    }
    for (const r of [.68, .82]) dlEB(s, .15, .3, r, r * .85, 1, 14, Math.PI * 1.15, Math.PI * 1.85);
  },
  // the tucked-in tortoise with a heart over it
  shellHeart(s) {
    dlEB(s, 0, .38, .55, .45, 2, 20, Math.PI, TAU); dlB(s, [[-.57, .38], [.57, .38]], 1.8, GRAPH, 0);
    dlB(s, [[-.25, .38], [-.2, .06], [.05, -.02], [.23, .13], [.25, .38]], 1.1, GRAPH, .2); dlB(s, [[-.2, .06], [-.43, .13]], 1.1); dlB(s, [[.23, .13], [.45, .18]], 1.1);
    dlHeartB(s, 0, -.42, .17 * (1 + .1 * Math.sin(T * 6)));
  },
  // a far lake with a lotus, reeds and a sun
  lake(s) {
    dlEB(s, 0, .3, .85, .3, 1.8);
    for (const [x0, y0, l] of [[-.5, .25, .3], [.1, .42, .35], [.35, .2, .22]]) dlB(s, [[x0, y0], [x0 + l * .3, y0 - .04], [x0 + l * .6, y0], [x0 + l, y0 - .04]], 1.2);
    for (const a of [-.5, 0, .5]) dlB(s, [[.05, .1], [.05 + Math.sin(a) * .2, -.12 - Math.cos(a) * .05], [.05 + Math.sin(a) * .08, .08]], 1.6, GRAPH, .6);
    dlB(s, [[-.85, .2], [-.82, -.25]], 1.2); dlB(s, [[-.75, .25], [-.68, -.38]], 1.2); dlB(s, [[-.68, -.38], [-.66, -.46]], 3);
    dlEB(s, .62, -.45, .14, .14, 1.4);
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; dlB(s, [[.62 + Math.cos(a) * .2, -.45 + Math.sin(a) * .2], [.62 + Math.cos(a) * .28, -.45 + Math.sin(a) * .28]], 1.2); }
  },
  // the tortoise with tiny flapping wings, sweating: he can't fly
  wings(s) {
    dlEB(s, -.05, .25, .5, .38, 1.8, 18, Math.PI, TAU); dlB(s, [[-.55, .25], [.45, .25]], 1.6);
    dlEB(s, .62, .12, .14, .12, 1.6); dlB(s, [[-.35, .25], [-.38, .4]], 1.6); dlB(s, [[.25, .25], [.28, .4]], 1.6);
    const fl = Math.sin(T * 22) * .12;
    dlB(s, [[-.1, -.1], [-.45, -.55 - fl], [-.35, -.35], [-.5, -.32], [-.05, -.18]], 1.6, GRAPH, .2); dlB(s, [[.05, -.1], [.3, -.6 + fl], [.3, -.4], [.45, -.42], [.15, -.15]], 1.6, GRAPH, .2);
    dlB(s, [[-.55, -.35], [-.7, -.4]], 1.1); dlB(s, [[-.55, -.22], [-.72, -.22]], 1.1);
    dlB(s, [[.78, -.18], [.72, -.05], [.78, 0], [.84, -.05], [.78, -.18]], 1.2);
  },
  // two swans holding a stick, a tortoise biting the middle
  stick(s) {
    dlB(s, [[-.95, -.3], [.95, -.3]], 2, GRAPH, 0);
    for (const bx of [-.98, .62]) {   // two swans flying right, beaks on the stick's ends
      dlEB(s, bx, -.62, .2, .1, 1.4); dlB(s, [[bx + .18, -.6], [bx + .3, -.5], [bx + .34, -.36]], 1.4);
      dlB(s, [[bx + .34, -.36], [bx + .42, -.31]], 1.6); dlB(s, [[bx - .05, -.66], [bx - .2, -.92], [bx + .08, -.7]], 1.3, GRAPH, .2);
    }
    dlB(s, [[.06, -.3], [.08, -.08]], 1.6); dlEB(s, .07, -.32, .09, .07, 1.4);
    dlEB(s, -.05, .22, .36, .27, 1.8, 18, Math.PI, TAU); dlB(s, [[-.41, .22], [.31, .22]], 1.6);
    dlB(s, [[-.25, .22], [-.29, .36]], 1.4); dlB(s, [[.15, .22], [.19, .36]], 1.4);
  },
  // a face with its mouth zipped shut
  zip(s) {
    dlEB(s, 0, 0, .55, .55, 1.8);
    dlB(s, [[-.2, -.18], [-.2, -.1]], 3); dlB(s, [[.2, -.18], [.2, -.1]], 3);
    dlB(s, [[-.3, .2], [.3, .2]], 1.8, GRAPH, 0);
    for (let i = 0; i < 6; i++) { const x = -.25 + i * .1; dlB(s, [[x, .13], [x, .27]], 1.2, GRAPH, 0); }
    dlB(s, [[.3, .2], [.38, .28], [.36, .38]], 1.4);
  },
  // a cart wheel
  wheel(s) {
    dlEB(s, 0, 0, .55, .55, 2.2); dlEB(s, 0, 0, .46, .46, 1.2); dlEB(s, 0, 0, .1, .1, 1.8);
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + .2; dlB(s, [[Math.cos(a) * .1, Math.sin(a) * .1], [Math.cos(a) * .46, Math.sin(a) * .46]], 1.4, GRAPH, 0); }
  },
  // the cart wheel with a tortoise's head and legs, rolling and laughing
  wheelLegs(s) {
    const r = T * 3;
    dlEB(s, 0, 0, .5, .5, 2.2); dlEB(s, 0, 0, .09, .09, 1.6);
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + r; dlB(s, [[Math.cos(a) * .09, Math.sin(a) * .09], [Math.cos(a) * .42, Math.sin(a) * .42]], 1.3, GRAPH, 0); }
    dlEB(s, .66, -.12, .16, .14, 1.6); dlB(s, [[.66, -.17], [.68, -.15]], 3); dlB(s, [[.7, -.04], [.8, -.06]], 1.3);
    for (const [a, b] of [[-.5, .38], [.45, .4], [-.25, .5], [.2, .52]]) dlB(s, [[a, b - .06], [a + .03, b + .12]], 1.6);
    for (let i = 0; i < 3; i++) dlB(s, [[-.68 - i * .07, -.25 + i * .22], [-.86 - i * .07, -.25 + i * .22]], 1.1);
  },
  // an angry outburst: a jagged burst with a scribble and a bang
  burst(s) {
    const P = []; for (let i = 0; i <= 16; i++) { const a = i / 16 * TAU, r = i % 2 ? .32 : .58; P.push([Math.cos(a) * r, Math.sin(a) * r * .85]); }
    dlB(s, P, 2, GRAPH, 0);
    dlB(s, [[-.2, -.05], [-.05, -.18], [-.12, .02], [.08, -.12], [0, .08], [.18, -.05]], 1.4, GRAPH, 0);

  },
};

// ---------------- the frame ----------------
const FABLE = { band: [600, 1380], matte: '#0D0C0E', white: '#FFFFFF', yellow: '#FFE14D', font: '700 50px Poppins', size: 50, y0: 498, lh: 62 };
let _fableCtx = null;
const fableMeasure = s => { if (!_fableCtx) _fableCtx = document.createElement('canvas').getContext('2d'); _fableCtx.font = FABLE.font; return _fableCtx.measureText(s).width; };
function fableFrame(lines, fade = 0) {
  const [b0, b1] = FABLE.band;
  boilSeed('fable matte');
  if (fade > 0) paint(rectPts(-10, b0, W + 20, b1 - b0), { wash: FABLE.matte, washOp: 255 * clamp(fade), ink: null });
  paint(rectPts(-20, -20, W + 40, b0 + 20), { wash: FABLE.matte, ink: null });
  paint(rectPts(-20, b1, W + 40, H - b1 + 20), { wash: FABLE.matte, ink: null });
  lines.forEach((line, i) => {
    const segs = line.split('*').map((txt, k) => [txt, k % 2 ? FABLE.yellow : FABLE.white]).filter(([txt]) => txt);
    const tot = segs.reduce((s, [txt]) => s + fableMeasure(txt), 0); let x = W / 2 - tot / 2;
    for (const [txt, color] of segs) { letter(txt, x, FABLE.y0 + i * FABLE.lh, FABLE.size, color, { screen: true, font: FABLE.font, align: 'left', ink: false }); x += fableMeasure(txt); }
  });
}
const fableLife = (t, a, b, k = 5) => t < a || t > b ? 0 : Math.min(clamp((t - a) * k), clamp((b - t) * 7));
function fableWhip(k, dir = 1) {
  const a = Math.sin(clamp(k) * Math.PI), [b0, b1] = FABLE.band;
  if (a < .05) return;
  boilSeed('fable whip');
  for (let i = 0; i < 16; i++) {
    const x = 40 + hash(i * 3.3) * 1000, y = b0 + hash(i * 1.7) * (b1 - b0), l = 120 + 260 * hash(i * 5.1);
    inkLine([[x, y], [x, y + dir * l * a]], 3 * a, '#FFF6E6', 'inkfine', 0);
  }
}

// ---------------- model sheets ----------------
LOOPS.fable = t => {
  paint(rectPts(-20, -20, W + 40, H + 40), { wash: '#EFE3CC', ink: null });
  tortoise(300, 500, 34, { lid: .35 });
  tortoise(760, 500, 34, { neck: 1, eyes: 'wide', mouth: 'open' });
  tortoise(300, 900, 34, { neck: .7, eyes: 'angry', mouth: 'bite', puff: .8, tint: 'flush', tintK: .6 });
  { const o = { neck: 1, neckA: -.6, rot: -.5, dangle: 1, kick: t, eyes: 'happy', mouth: 'bite', noShadow: true }, m = tortoiseMouth(0, 0, 34, o);
    boilSeed('fable stick'); paint(ribbon([[560, 700], [760, 702], [960, 700]], 13, 10), { wash: '#9C7A4C', ink: PAL.ink, sw: 1.2 }); tortoise(760 - m[0], 700 - m[1], 34, o); }
  hamsa(300, hamsaStandY(1450, 30), 30, { tuft: 1, eyes: 'stern' });
  hamsa(760, hamsaStandY(1450, 30), 30, { down: 1, beak: .6 });
  hamsa(300, 1650, 30, { fly: 1, flap: t * 1.5, eyes: 'half' });
  hamsa(760, 1650, 30, { fly: 1, flap: t * 1.5 + .5, tuft: 1, flip: true });
};
LOOPS.fable.len = 2;
LOOPS.fabledoodles = t => {
  paint(rectPts(-20, -20, W + 40, H + 40), { wash: '#EFE3CC', ink: null });
  Object.keys(DOODLE).forEach((k, i) => {
    const x = 190 + (i % 3) * 350, y = 180 + Math.floor(i / 3) * 330;
    bubble(x, y, 320, 240, [x - 90, y + 170], 1, 'd' + i, DOODLE[k]);
  });
};
LOOPS.fabledoodles.len = 1;
LOOPS.fablemonkey = t => {
  paint(rectPts(-20, -20, W + 40, H + 40), { wash: '#EFE3CC', ink: null });
  const u = 26, ph = [4.1, -3.3];
  // sitting on a branch, legs hanging, hunched over the phone (the screen lights his face)
  boilSeed('branch'); paint(ribbon([[100, 428], [420, 424]], 22, 18), { wash: '#8A6A48', ink: PAL.ink, sw: 1 });
  monkey(260, 420, u, { pose: 'sit', hunch: .6, footN: [1.5, 2.3], footF: [.9, 2.4], kneePref: [1, .2], handN: ph, handF: [ph[0] - .3, ph[1] + .2], eyes: 'normal', lid: .45, lookX: .7, lookY: .8, mouth: 'flat', light: ['#7FB6FF', .22], noShadow: true,
    held: (u, sw) => fablePhone(ph[0] * u + 6, ph[1] * u - 10, u * 1.3, { rot: -.35, on: 1 }) });
  monkey(760, 420, u, { pose: 'sit', eyes: 'happy', mouth: 'laugh', handN: [3.2, -4.6], handF: [-1.4, -6.2], blush: 1 });
  monkey(260, 900, u, { pose: 'stand', eyes: 'wide', mouth: 'o', handN: [2.6, -10.6], brows: 1 });
  monkey(760, 900, u, { pose: 'stand', walk: t * 2, eyes: 'normal', mouth: 'smile', hoodie: false, pal: { fur: '#A06A44' } });
  // tucked up like a tortoise, his tail sneaking out for the phone
  monkey(260, 1380, u, { pose: 'sit', lean: .3, footN: [1.4, -.2], footF: [1.0, -.15], handN: [2.3, -2.6], handF: [2.0, -2.8], eyes: 'squeeze', mouth: 'tight', tailTo: [6, -.4], tailK: (Math.sin(t * Math.PI) + 1) / 2, sweatK: 1 });
  monkey(760, 1380, u, { pose: 'sit', eyes: 'tired', mouth: 'wobbly', lookY: .6, twitch: 1 });
  tortoise(260, 1800, 30, { tuckLegs: seg(t, 0, .6), tuckHead: seg(t, .6, 1.2), brows: 1, eyes: 'closed', mouth: 'smile' });
  tortoise(760, 1800, 30, { brows: 1, eyes: 'normal', lid: .5, mouth: 'smile' });
};
LOOPS.fablemonkey.len = 2;
