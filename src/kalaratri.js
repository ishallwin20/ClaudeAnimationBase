// kalaratri.js: Maa Kalaratri, the seventh Navadurga, "the Fierce Dark Knight" of the Book 7 cover, with the scriptures'
// features on top: skin as dark as the night (dark: 1; at 0 she is golden Durga, for the transformation), wild open hair,
// a third eye, flames from her nostrils and a necklace of lightning. From the cover: a red saree with a wide white border,
// a dark blouse, a tall gold mukut with a red tilak, a pale moon-disc halo, a garland of (cute, rounded) skulls, and
// FOUR ARMS: the raised back pair holds a spear (screen-left) and a curved khadga (screen-right), the front pair a lotus
// (screen-left) and a trishul (screen-right). Standing, or sitting side-saddle (sit: 1) on her donkey (donkey.js).
// Built on Shailputri / Chandraghanta (same chibi proportions, arm solver, head scale; shailputriWorld() for points).
// Load after bappa.js (U()), clawd.js, shiva.js, shailputri.js (SHL, trishul(), lotus(), shailputriWorld()) and
// chandraghanta.js; feel() / emotions() drive her.
// (x, y) is the ground point under her, or with sit: 1 the point she sits on (pass donkeySeat(...)). u is the size unit
// (about 27u tall standing to the top of the mukut, 16u from the seat; the back arms reach about ±6.5u).
//
// Body-local coordinates in u (y up is negative; standing): hem -1.2..0 · waist -11.8 · shoulders (±2.6, -16.2) · head
// centre (0, -19.8) · eyes (±1.1, -19.7) · third eye (0, -21.05) · nose (0, -18.9) · lightning necklace (0, -15.9) ·
// skull mala down to (0, -10.8) · mukut -22.3..-27.4 (the head is scaled 1.18× about the neck at (0, -17.6))
//
// Options (all optional):
//   pose:   sit, walk (phase), swing (-1..1, feet when sitting), dx, dy (in u), sq, rot, flip, hx (-1..1 head turn), htilt,
//           lean (u), hair (-1..1: + streams the hair and pallu to screen-left)
//   night:  dark 0..1 (golden Durga → night-indigo skin with a cool rim light), wild 0..1 (neat → wild, flying hair),
//           eye3 0..1 (the third eye opens, ember-lit), fire 0..1 + fireAge (a snort of fire: both nostrils jet down and forward toward fireDir ±1, default the head's
//           turn, and fireballs roll off the ends), bolt 0..1 (lightning
//           crackles round the necklace; boltSoft 0..1 calms it to a warm night-light glow), skulls 0..1 (the mala beads
//           in from the middle), aura 0..1 (cool light behind her; auraCol to change it)
//   arms:   arms 0..1 (default 1: the raised back pair swings out from behind her shoulders), handL / handR = [x, y] in u
//           (the front pair), bendL / bendR, armL(u, sw) / armR(u, sw) (hooks at the hands), backL / backR = [x, y] to
//           move a back hand
//   props:  lotus (default true, front left), trishul (default true, front right) + trishulA, spear / khadga (default
//           true, back hands) + spearA / khadgaA
//   face:   eyes, mouth, lookX / lookY, squint, blush, seed, tint + tintK, brows (-1 angry .. +1 raised), browL / browR.
//           Her own eyes: 'normal' / 'look' / 'wide' / 'angry' / 'determined' / 'closed' / 'happy' / 'wink'; every other
//           kind is Clawd's. Mouths: smile (default), flat, teeth, roar (open, a fierce shout), O; others are Clawd's.
//   extras: emote + emoteK + emoteAge, boilKey, noShadow, swMul, noHalo
// Helpers: kalaratriHand(x, y, u, o, s), kalaratriBackHand(x, y, u, o, s), kalaratriHead / kalaratriEye3 / kalaratriNose /
// kalaratriNeck / kalaratriMala(x, y, u, o) → world [x, y]; kalaKhadga(u, sw, a) and kalaSpear(u, sw, a) draw the
// weapons on their own; skullBead(x, y, r, sw) draws one skull.
const KAL = {
  gold: '#F3C08A', goldDk: '#D69A62', goldLt: '#FFE2BC',   // Durga's golden skin
  night: '#3D4282', nightDk: '#2A2D5E', nightLt: '#6C76C4', rim: '#A9BCFF',
  saree: '#D8322A', sareeDk: '#A41E24', sareeLt: '#EE5A48', border: '#F6EEE2', borderDk: '#D8CBB8',
  blouse: '#2E2440', blouseDk: '#1E1830', silver: '#D3DAE6', silverDk: '#9AA6BC',
  skull: '#EFE5CF', skullDk: '#C8B896', socket: '#3A2A36',
  bolt: '#FFFBEA', boltGlow: '#9CC8FF', boltWarm: '#FFD27A', fire: '#FF7A2E', fireLt: '#FFD45E', ember: '#FF5A2A',
  halo: '#F5ECD6', haloRing: '#E8C46A', tilak: '#D2283A', lip: '#B8324A',
};

// Her own fierce, still mood: determined eyes, a flat mouth, slow deep breathing (no bounce).
EMO.fierce = { eyes: 'determined', mouth: 'flat', take: .5, body: t => { const br = Math.sin(t * TAU * .3); return { sq: .015 * br, dy: -.08 * br }; } };

// ---- her weapons, each held at (0, 0) by its grip, pointing up (rotate by a)
function kalaKhadga(u, sw, a = 0, INK = SHL.ink) {   // a big curved crescent blade, as on the cover
  push(); rotate(a);
  paint(ribbon(U([[0, 1.4], [0, -.5]], u), .46 * u, .4 * u), { wash: KAL.blouse, ink: INK, sw: sw * .5 });
  for (const k of [.25, .75]) inkLine(U([[-.24, k], [.24, k - .1]], u), sw * .6, SHL.gold, 'inkfine', 0);
  paint(ellPts(0, 1.55 * u, .3 * u, .3 * u, 8), { wash: SHL.gold, ink: INK, sw: sw * .4 });
  paint(U([[-.75, -.45], [.75, -.45], [.6, -.8], [-.6, -.8]], u), { wash: SHL.gold, ink: INK, sw: sw * .5, curv: .3 });
  const blade = U([[-.35, -.75], [-.95, -2.4], [-.95, -4.3], [-.3, -5.9], [1, -7], [2.5, -7.2], [3.2, -6.9], [1.9, -6.5], [.9, -5.6], [.35, -4.2], [.3, -2.4], [.38, -.75]], u);
  paint(blade, { wash: '#E6ECF4', fill: SHL.steelDk, fillOp: 45, tex: .4, ink: INK, sw: sw * .7, curv: .4 });
  inkLine(U([[-.62, -1.4], [-.65, -3.9], [-.05, -5.6], [1, -6.6], [2.3, -6.95]], u), sw * .5, '#FFFFFF', 'inkfine', .5);
  pop();
}
function kalaSpear(u, sw, a = 0, INK = SHL.ink) {   // a long gold spear with a leaf blade and a red tassel
  push(); rotate(a);
  paint(ribbon(U([[0, 6], [0, -7.6]], u), .3 * u, .26 * u), { wash: SHL.gold, fill: SHL.goldDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .55 });
  paint(U([[0, -7.4], [.62, -8.4], [.42, -9.6], [0, -10.9], [-.42, -9.6], [-.62, -8.4]], u), { wash: SHL.gold, fill: SHL.goldDk, fillOp: 60, tex: .4, ink: INK, sw: sw * .65, curv: .35 });
  inkLine(U([[0, -7.7], [0, -10.3]], u), sw * .5, SHL.goldDk, 'inkfine', 0);
  paint(ellPts(0, -7.4 * u, .45 * u, .25 * u, 10), { wash: SHL.goldDk, ink: INK, sw: sw * .4 });
  const sway = Math.sin(T * 2.3) * .12;
  paint(U([[-.2, -7.2], [.2, -7.2], [.45 + sway, -5.9], [-.4 + sway, -5.9]], u), { wash: KAL.saree, ink: INK, sw: sw * .4, curv: .3 });
  pop();
}
// One skull bead, centred at (x, y), r ≈ its half-width: rounded and friendly, two sockets and a nose notch, no teeth.
function skullBead(x, y, r, sw, INK = SHL.ink) {
  paint(ellPts(x, y + r * .45, r * .62, r * .38, 10), { wash: KAL.skullDk, ink: INK, sw: sw * .3 });   // the jaw
  paint(ellPts(x, y - r * .1, r, r * .9, 14), { wash: KAL.skull, ink: INK, sw: sw * .35 });
  for (const s of [-1, 1]) paint(ellPts(x + s * r * .38, y + r * .02, r * .26, r * .3, 8), { wash: KAL.socket, ink: null });
  paint([[x, y + r * .3], [x + r * .12, y + r * .48], [x - r * .12, y + r * .48]], { wash: KAL.socket, ink: null });
  paint(ellPts(x - r * .35, y - r * .5, r * .22, r * .14, 6, 0, -.4), { wash: '#FFFFFF', washOp: 150, ink: null });
}

const KAL_HEAD_Y = y => -17.6 + (y + 17.6) * 1.18;   // a point on the (scaled) head → body-local y
function kalaratriFrontArm(o, s) {
  const sh = [s * 2.6, -16.2];
  const ha = (s < 0 ? o.handL : o.handR) || (s < 0 ? [-4.2, -13.1] : [4.3, -13.5]);
  const dx = ha[0] - sh[0], dy = ha[1] - sh[1], d = Math.hypot(dx, dy) || 1;
  let nx = -dy / d, ny = dx / d; if (nx * s < 0) { nx = -nx; ny = -ny; }
  const b = (s < 0 ? o.bendL : o.bendR) ?? 1.1;
  return [sh, [(sh[0] + ha[0]) / 2 + nx * b, (sh[1] + ha[1]) / 2 + ny * b], ha];
}
function kalaratriBackArm(o, s) {
  const e = backOut(clamp(o.arms ?? 1)), sh = [s * 2.2, -16], tuck = [s * 2.4, -14.6];
  const tgt = (s < 0 ? o.backL : o.backR) || [s * 6.1, -20 + Math.sin(T * 1.5 + s) * .12];
  const ha = [lerp(tuck[0], tgt[0], e), lerp(tuck[1], tgt[1], e)];
  const ddx = ha[0] - sh[0], ddy = ha[1] - sh[1], d = Math.hypot(ddx, ddy) || 1;
  let nx = -ddy / d, ny = ddx / d; if (nx * s < 0) { nx = -nx; ny = -ny; }   // the elbow bends out
  return [sh, [(sh[0] + ha[0]) / 2 + nx * 1.2 * e, (sh[1] + ha[1]) / 2 + ny * 1.2 * e], ha];
}
function kalaratriHand(x, y, u, o, s) { const [, , h] = kalaratriFrontArm(o, s); return shailputriWorld(x, y, u, o, h[0], h[1]); }
function kalaratriBackHand(x, y, u, o, s) { const [, , h] = kalaratriBackArm(o, s); return shailputriWorld(x, y, u, o, h[0], h[1]); }
const kalaHX = o => clamp(o.hx || 0, -1, 1);
function kalaratriHead(x, y, u, o = {}) { return shailputriWorld(x, y, u, o, kalaHX(o) * .45, -20.2); }
function kalaratriEye3(x, y, u, o = {}) { return shailputriWorld(x, y, u, o, kalaHX(o) * (.45 + .8 * 1.18), KAL_HEAD_Y(-21.05)); }
function kalaratriNose(x, y, u, o = {}) { return shailputriWorld(x, y, u, o, kalaHX(o) * (.45 + .8 * 1.18), KAL_HEAD_Y(-18.85)); }
function kalaratriNeck(x, y, u, o = {}) { return shailputriWorld(x, y, u, o, 0, -16); }
function kalaratriMala(x, y, u, o = {}) { return shailputriWorld(x, y, u, o, 0, -11.4); }

function kalaratri(x, y, u, o = {}) {
  const id = o.boilKey ?? 'k' + (++CLAWD_N), rs = p => boilSeed(`kalaratri ${id} ${p}`);
  const dark = clamp(o.dark ?? 1), wild = clamp(o.wild ?? 1), eye3 = clamp(o.eye3 ?? 1), fire = clamp(o.fire || 0);
  const bolt = clamp(o.bolt ?? 1), soft = clamp(o.boltSoft || 0), skulls = clamp(o.skulls ?? 1), au = clamp(o.aura || 0);
  const base = { col: mixCol(KAL.gold, KAL.night, dark), dk: mixCol(KAL.goldDk, KAL.nightDk, dark), lt: mixCol(KAL.goldLt, KAL.nightLt, dark) };
  const { col, dk, lt } = tintCols({ ...o, col: o.col || base.col, dk: o.dk || base.dk, lt: o.lt || base.lt });
  const sit = !!o.sit, wo = { ...o, dx: 0, dy: 0 };
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .04;
  const P = pts => U(pts, u), INK = SHL.ink, wk = o.walk, hx = kalaHX(o), lean = o.lean || 0;
  const hs = wk == null ? 0 : Math.sin(wk * TAU) * .35, hw = o.hair || 0, sway = Math.sin(T * 1.6) * .22 + hs * .5 - hw * 1.7;
  const hairC = SHL.hair, browC = mixCol(SHL.hair, '#151020', dark), lipC = mixCol(SHL.lip, KAL.lip, dark);
  const rimC = mixCol(INK, KAL.rim, dark * .85);

  // ---- light first: the aura, the bolt's glow round her neck, and the pale moon-disc halo behind her head
  const [hx0, hy0] = kalaratriHead(x, y + dy, u, wo);
  rs('aura');
  if (au > .01) {
    const [bx, by] = shailputriWorld(x, y + dy, u, wo, 0, -16), c = o.auraCol || '#6E86FF';
    glow(bx, by, u * (12 + 14 * au), c, au * .7);
    glow(hx0, hy0, u * (7 + 6 * au), mixCol(c, '#FFFFFF', .5), au * .6);
  }
  if (!o.noHalo) {
    rs('halo');
    const R = u * 5.4, cy = hy0 - u * 1.2;
    glow(hx0, cy, R * 1.5, '#FFF2D0', .35 + .25 * dark);
    paint(ellPts(hx0, cy, R, R, 34, J * .5), { wash: KAL.halo, ink: null });
    paint(ellPts(hx0, cy, R * .82, R * .82, 30), { fill: '#FFFFFF', fillOp: 70, bleed: .3, tex: .2, ink: null });
    const e = ellPts(hx0, cy, R, R, 40, J * .5); inkLine([...e, e[0], e[1]], sw * 1.6, KAL.haloRing, 'ink', .5);
  }

  if (!o.noShadow && !sit) { rs('shadow'); paint(ellPts(x, y + u * .1, u * 5.2 * (1 - Math.min(.5, Math.abs(o.dy || 0) * .05)), u * .95, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  if (sit) translate(0, SHL_SEAT * u);
  const headScale = () => { translate(0, -17.6 * u); scale(1.18); translate(0, 17.6 * u); };
  const upper = f => { push(); translate(0, -11.8 * u); rotate(lean * .035); translate(lean * .6 * u, 11.8 * u); f(); pop(); };
  const band = (a, b, k, c, w, half = .44) => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = -(b[1] - a[1]) / d * half, ny = (b[0] - a[0]) / d * half, bx = lerp(a[0], b[0], k), by = lerp(a[1], b[1], k); inkLine(P([[bx - nx, by - ny], [bx + nx, by + ny]]), sw * w, c, 'ink', 0); };

  upper(() => {
    // ---- behind: the hair. Neat, it falls behind her shoulders; wild, it is twice as big and flies in locks.
    rs('backhair');
    const h = sway, fl = (hw + wild * .6) * Math.sin(T * 9) * .25, W1 = 1 + wild * .55;
    const mass = [[-3.2, -23.4], [-4, -21], [-4.35, -18.4], [-4.8 + h * .5, -16], [-4.4 + h, -14.1], [-3.5 + h * 1.4 + fl, -12.3], [-2.2 + h * 1.2, -13.1], [-.8 + h, -12.6],
      [.8 + h, -13.1], [2.2 + h * 1.2, -12.5], [3.5 + h * 1.2 + fl, -12.9], [4.3 + h * .8, -14.2], [4.7 + h * .4, -16], [4.35, -18.4], [4, -21], [3.2, -23.4], [0, -24.2]];
    paint(P(mass.map(([a, b]) => [a * W1, b - wild * (b > -16 ? (b + 16) * .25 : 0)])), { wash: hairC, ink: INK, sw: sw * .8, curv: .5 });
    if (wild > .02) {   // the wild locks: tapered ribbons whipping out round her head and shoulders
      const L = [[-1, -22.8, -3, 1], [-1, -20.5, -3.1, .2], [-1, -17.5, -2.6, -1.2], [-1, -14.5, -1.9, -2.6], [1, -22.6, 3, .9], [1, -20, 3.1, .1], [1, -17.2, 2.6, -1.4], [1, -14.3, 1.8, -2.7]];
      L.forEach(([s, ly, ex, ey], k) => {
        const w = Math.sin(T * 2.6 + k * 1.7) * .5 * wild, x0 = s * 3.3, e = wild;
        const pts = [[x0, ly], [x0 + ex * .45 * e + w * .3, ly - ey * .4 * e - .3], [x0 + ex * e + w + h * .5, ly - ey * e + w * .4]];
        paint(ribbon(P(pts), .95 * u, .08 * u), { wash: hairC, ink: INK, sw: sw * .6 });
      });
    }
    for (const [a, b] of [[-3.6, 1], [3.5, -1], [-2.6, 1]])
      inkLine(P([[a * W1, -17.6], [(a - .35 * b + h * .4) * W1, -16], [(a + .1 * b + h * .8) * W1, -14.6], [(a - .2 * b + h * 1.1) * W1, -13.4]]), sw * .5, SHL.hairLt, 'inkfine', .5);
    push(); translate(hx * .4 * u, 0); headScale();
    paint(ellPts(0, -20.1 * u, 3.25 * u * (1 + wild * .12), 3.1 * u * (1 + wild * .08), 26, J * (1 + wild * 2)), { wash: hairC, ink: INK, sw: sw * .8 });
    pop();

    // ---- the raised back arms: the spear (screen-left), the curved khadga (screen-right)
    const arms = clamp(o.arms ?? 1), bcol = mixCol(col, dk, .3);
    if (arms > .02) for (const s of [-1, 1]) {
      rs('back' + s);
      const [sh, el, ha] = kalaratriBackArm(o, s);
      paint(ribbon(P([sh, el, ha]), .98 * u, .7 * u), { wash: bcol, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .7 });
      band(sh, el, .6, KAL.silver, 1.6, .5);
      for (const k of [.62, .74, .86]) band(el, ha, k, SHL.gold, 1, .4);
      push(); translate(ha[0] * u, ha[1] * u);
      const ps = clamp(arms * 1.5);
      push(); scale(ps);
      if (s < 0 && o.spear !== false) kalaSpear(u * .85, sw / Math.max(ps, .3), (o.spearA ?? -.08));
      if (s > 0 && o.khadga !== false) kalaKhadga(u * .95, sw / Math.max(ps, .3), (o.khadgaA ?? .12));
      pop();
      paint(ellPts(0, 0, .56 * u, .5 * u, 12, J), { wash: bcol, ink: INK, sw: sw * .6 });
      pop();
    }

    // ---- the pallu falling behind her right shoulder (screen-left): red, with its white border
    rs('pallback');
    const ph = sway * .8;
    paint(ribbon(P([[-2.6, -16.4], [-3.6 + ph * .3, -14.2], [-4.1 + ph * .7, -11.6], [-4.4 + ph * 1.2, -9]]), 2 * u, 2.1 * u), { wash: KAL.saree, fill: KAL.sareeDk, fillOp: 80, tex: .5, ink: INK, sw: sw * .75 });
    inkLine(P([[-3.45, -16], [-4.55 + ph * .3, -13.8], [-5.05 + ph * .7, -11.4], [-5.35 + ph * 1.2, -9.1]]), sw * 2.4, KAL.border, 'ink', .5);
  });

  if (!sit) {
    // ---- standing: feet under the hem, the skirt with its wide white border
    rs('feet');
    for (const s of [-1, 1]) {
      const l = wk == null ? 0 : Math.max(0, Math.sin((wk + (s < 0 ? 0 : .5)) * TAU)) * .5;
      paint(ellPts((s * 1.1 + (wk == null ? 0 : s * l * .3)) * u, (-.25 - l) * u, .95 * u, .45 * u, 14, J), { wash: col, ink: INK, sw: sw * .7 });
      inkLine(P([[s * 1.1 - .6, -.45 - l], [s * 1.1 + .6, -.45 - l]]), sw * .9, SHL.gold, 'ink', 0);
    }
    rs('skirt');
    const skirt = P([[-2.2, -11.9], [2.2, -11.9], [2.9, -8.5], [3.7, -4.6], [4.3 + hs * .4, -1.5], [4.6 + hs, -.5], [2.6 + hs * .5, -.35], [0, -.3], [-2.6 + hs * .5, -.35], [-4.6 + hs, -.5], [-4.3 + hs * .4, -1.5], [-3.7, -4.6], [-2.9, -8.5]]);
    paint(skirt, { wash: KAL.saree, fill: KAL.sareeDk, fillOp: 80, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .3 });
    paint(ribbon(P([[-4.45 + hs, -1.25], [-2.2 + hs * .5, -1.05], [0, -1], [2.2 + hs * .5, -1.05], [4.45 + hs, -1.25]]), 1.3 * u, 1.3 * u), { wash: KAL.border, ink: null });
    inkLine(P([[-4.2 + hs, -1.95], [0, -1.7], [4.2 + hs, -1.95]]), sw * .9, SHL.gold, 'ink', .4);
    for (const k of [-.5, .1, .6]) inkLine(P([[k * .6, -10.5], [k * 1.2 + hs * .3, -5.5], [k * 1.8 + hs * .5, -2.2]]), sw * .5, KAL.sareeDk, 'inkfine', .5);
  } else {
    // ---- sitting side-saddle: both feet toward us under the hem, the drape over her lap
    rs('feet');
    const swg = (o.swing || 0) * .35;
    for (const [fx, fy, k] of [[-.95, -3.85, 1], [1.05, -3.75, -1]]) {
      paint(ellPts((fx + swg * k) * u, fy * u, .9 * u, .5 * u, 14, J), { wash: col, ink: INK, sw: sw * .7 });
      inkLine(P([[fx + swg * k - .55, fy - .3], [fx + swg * k + .55, fy - .3]]), sw * .9, SHL.gold, 'ink', 0);
    }
    rs('skirt');
    const drape = P([[-2.3, -11.9], [2.3, -11.9], [3.3, -10.7], [3.5, -9.2], [3.25, -7], [2.95, -5.1], [2.3, -4.3], [0, -4.15], [-2.3, -4.3], [-2.95, -5.1], [-3.25, -7], [-3.5, -9.2], [-3.3, -10.7]]);
    paint(drape, { wash: KAL.saree, fill: KAL.sareeDk, fillOp: 80, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .35 });
    paint(ribbon(P([[-2.85, -5.15], [-1.4, -4.85], [0, -4.78], [1.4, -4.85], [2.85, -5.15]]), 1.05 * u, 1.05 * u), { wash: KAL.border, ink: null });
    inkLine(P([[-2.9, -5.7], [0, -5.35], [2.9, -5.7]]), sw * .8, SHL.gold, 'ink', .4);
    inkLine(P([[-3, -9.5], [-1, -9.05], [1, -9.05], [3, -9.5]]), sw * .55, KAL.sareeDk, 'inkfine', .5);
    for (const k of [-.55, .1, .65]) inkLine(P([[k * 1.6, -8.6], [k * 2, -6]]), sw * .5, KAL.sareeDk, 'inkfine', .5);
  }

  upper(() => {
    // ---- torso: midriff, the dark blouse, the pallu across the chest
    rs('torso');
    paint(P([[-2.3, -16.6], [2.3, -16.6], [2.4, -14], [2.1, -11.6], [-2.1, -11.6], [-2.4, -14]]), { wash: col, ink: INK, sw: sw * .8, curv: .3 });
    paint(P([[-2.6, -16.8], [2.6, -16.8], [2.55, -14.6], [1.9, -13.7], [-1.9, -13.7], [-2.55, -14.6]]), { wash: KAL.blouse, ink: INK, sw: sw * .8, curv: .3 });
    rs('pallu');
    paint(ribbon(P([[2.3, -11.2], [1.4, -12.8], [-.2, -14.6], [-1.8, -16.3], [-2.7, -16.9]]), 2.3 * u, 1.7 * u), { wash: KAL.saree, fill: KAL.sareeDk, fillOp: 70, tex: .5, ink: INK, sw: sw * .8 });
    inkLine(P([[3.05, -11.75], [2.15, -13.35], [.55, -15.25], [-.95, -16.85], [-1.75, -17.4]]), sw * 2.6, KAL.border, 'ink', .5);
    inkLine(P([[1.6, -11.2], [.7, -12.6], [-.85, -14.4], [-2.25, -16.1]]), sw * .6, KAL.sareeDk, 'inkfine', .5);
    rs('neck');
    paint(P([[-.75, -17.9], [.75, -17.9], [.8, -16.7], [-.8, -16.7]]), { wash: col, ink: INK, sw: sw * .6 });

    // ---- the skull mala: it beads in from the middle outward
    if (skulls > .01) {
      rs('skulls');
      const m = Math.sin(T * 1.4) * .1, path = through(P([[-1.75, -16.9], [-2.25, -15], [-2.05, -13], [-1.2 + m * .3, -11.4], [0 + m, -10.95], [1.2 + m * .5, -11.4], [2.05, -13], [2.25, -15], [1.75, -16.9]]));
      const n = 15, step = (path.length - 1) / (n - 1);
      inkLine(path, sw * .5, KAL.skullDk, 'inkfine', .5);   // the cord
      const order = [...Array(n).keys()].sort((a, b) => Math.abs(b - (n - 1) / 2) - Math.abs(a - (n - 1) / 2));
      for (const i of order) {   // the outer ones first, so the middle skulls sit on top
        const k = clamp((skulls - Math.abs(i - (n - 1) / 2) / ((n - 1) / 2) * .7) / .3);
        if (k < .02) continue;
        const [bx, by] = path[Math.round(i * step)];
        skullBead(bx, by, .44 * u * backOut(k), sw);
      }
    }

    // ---- the necklace of lightning: a thin gold chain, and the bolt crackling along it (or, softened, a warm glow)
    rs('necklace');
    const NK = P([[-1.55, -17], [-1.2, -16.35], [-.65, -16], [0, -15.85], [.65, -16], [1.2, -16.35], [1.55, -17]]);
    inkLine(NK, sw * .9, SHL.gold, 'ink', .6);
    if (soft > .01) {
      for (const [gx, gy] of [NK[1], NK[3], NK[5]]) glow(gx, gy, u * (1.4 + 1.2 * soft), KAL.boltWarm, soft * .55);
      paint(ellPts(0, -15.85 * u, .3 * u, .3 * u, 10), { wash: mixCol(KAL.bolt, KAL.boltWarm, .4), ink: INK, sw: sw * .4 });
    }
    const bk = bolt * (1 - soft);
    if (bk > .01) {
      rs('bolt');
      const zig = (pts, amp) => { const out = []; for (let i = 0; i < pts.length - 1; i++) { const [ax, ay] = pts[i], [bx, by] = pts[i + 1]; for (let j = 0; j < 3; j++) { const t0 = j / 3; out.push([lerp(ax, bx, t0) + (random() - .5) * amp, lerp(ay, by, t0) + (random() - .5) * amp]); } } out.push(pts[pts.length - 1]); return out; };
      const Z = zig(NK, .55 * u);
      for (const [gx, gy] of [NK[0], NK[3], NK[6]]) glow(gx, gy, u * (.9 + 1.1 * bk), KAL.boltGlow, .6 * bk);
      inkLine(Z, sw * (1.8 + 1.6 * bk), '#7FB2FF', 'ink', 0);
      inkLine(Z, sw * (.9 + .5 * bk), KAL.bolt, 'ink', 0);
      const nb = Math.round(2 + 4 * bk);   // sparks fork off the chain, outward
      for (let b = 0; b < nb; b++) {
        const i0 = 1 + Math.floor(random() * 5), p = NK[i0], side = i0 < 3 ? -1 : i0 > 3 ? 1 : (random() < .5 ? -1 : 1);
        const a = Math.PI / 2 - side * (.5 + random() * 1.1), len = (.9 + random() * 1.5) * u * bk;
        const fork = [[p[0], p[1]], [p[0] + Math.cos(a) * len * .35 + (random() - .5) * .4 * u, p[1] + Math.sin(a) * len * .35], [p[0] + Math.cos(a) * len * .7 + (random() - .5) * .4 * u, p[1] + Math.sin(a) * len * .7], [p[0] + Math.cos(a) * len, p[1] + Math.sin(a) * len]];
        inkLine(fork, sw * 1.4, '#7FB2FF', 'inkfine', 0);
        inkLine(fork, sw * .6, KAL.bolt, 'inkfine', 0);
      }
    }

    // ---- head
    push(); translate(hx * .45 * u, 0); headScale();
    if (o.htilt) { translate(0, -17.5 * u); rotate(o.htilt); translate(0, 17.5 * u); }
    rs('head');
    const head = ellPts(0, -19.8 * u, 2.8 * u, 2.75 * u, 30, J);
    paint(head, { wash: col, ink: null });
    paint(ellPts((-1 + hx) * u, -20.8 * u, 1.5 * u, .8 * u, 14, J * 2, -.2), { fill: lt, fillOp: 110, bleed: .2, tex: .85, border: .8, ink: null });
    paint(ellPts(0, -17.7 * u, 2 * u, .7 * u, 14, J), { fill: dk, fillOp: 60, bleed: .1, tex: .6, border: .5, ink: null });
    paint(head, { ink: INK, sw });
    if (dark > .05) { const r = []; for (let i = 0; i <= 10; i++) { const a = lerp(-1.25, 1.05, i / 10); r.push([Math.cos(a) * 2.62 * u, -19.8 * u + Math.sin(a) * 2.58 * u]); } inkLine(r, sw * 1.3, rimC, 'inkfine', .5); }
    rs('jhumka');
    for (const s of [-1, 1]) {
      push(); translate(s * 2.75 * u, -19 * u); rotate(Math.sin(T * 2.4 + s) * .12);
      inkLine([[0, 0], [0, .5 * u]], sw * .5, SHL.goldDk, 'inkfine', 0);
      paint(U([[-.5, 1.3], [0, .45], [.5, 1.3]], u), { wash: SHL.gold, fill: SHL.goldDk, fillOp: 50, ink: INK, sw: sw * .45, curv: .5 });
      pop();
    }
    rs('hairfront');   // a centre parting; wild, two loose locks fall over her temples
    paint(P([[-2.85, -18.6], [-3.15, -20.4], [-2.9, -21.6], [-2.2, -22.35], [-.6, -22.75], [0, -22.3], [.6, -22.75], [2.2, -22.35], [2.9, -21.6], [3.15, -20.4], [2.85, -18.6], [2.4, -20.4], [1.4, -21.5], [.15, -21.6], [0, -21.9], [-.15, -21.6], [-1.4, -21.5], [-2.4, -20.4]]),
      { wash: hairC, ink: INK, sw: sw * .85, curv: .4 });
    if (wild > .05) for (const s of [-1, 1]) paint(ribbon(P([[s * 2.3, -21.7], [s * (2.9 + .3 * wild), -20 + Math.sin(T * 3 + s) * .2 * wild], [s * (3.2 + .6 * wild), -18 + .3 * wild]]), .55 * u, .06 * u), { wash: hairC, ink: INK, sw: sw * .5 });
    inkLine(P([[-2.3, -21.5], [-1.3, -22.25], [-.3, -22.4]]), sw * .45, SHL.hairLt, 'inkfine', .5);
    rs('mukut');   // tall and pointed, as on the cover, with a red gem
    paint(P([[-2.15, -22.3], [2.15, -22.3], [2.05, -23.9], [1.55, -23.55], [1.4, -25.1], [.8, -24.75], [.55, -26.2], [0, -27.4], [-.55, -26.2], [-.8, -24.75], [-1.4, -25.1], [-1.55, -23.55], [-2.05, -23.9]]),
      { wash: SHL.gold, fill: SHL.goldDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .6, curv: .12 });
    inkLine(P([[-2.05, -23.3], [2.05, -23.3]]), sw * .9, SHL.goldDk, 'inkfine', 0);
    inkLine(P([[-1.4, -24.6], [1.4, -24.6]]), sw * .7, SHL.goldDk, 'inkfine', 0);
    paint(ellPts(0, -23.85 * u, .34 * u, .42 * u, 8), { wash: '#C8324A', ink: INK, sw: sw * .35 });
    for (const s of [-1, 1]) { paint(ellPts(s * 1.15 * u, -24 * u, .16 * u, .18 * u, 6), { wash: '#C8324A', ink: null }); paint(ellPts(s * .5 * u, -26.1 * u, .1 * u, .1 * u, 6), { wash: SHL.goldLt, ink: null }); }

    push(); translate(hx * .8 * u, 0);
    // ---- the third eye (a red tilak when it is shut)
    rs('eye3');
    const e3x = 0, e3y = -21.05 * u;
    if (eye3 > .02) {
      glow(e3x, e3y, u * (.6 + 1.6 * eye3), KAL.ember, eye3 * .8);
      const rx = .26 * u * (.25 + .75 * eye3), ry = .5 * u;
      paint(ellPts(e3x, e3y, rx, ry, 14), { wash: '#FFF4E6', ink: INK, sw: sw * .55 });
      paint(ellPts(e3x, e3y, rx * .62, rx * .9, 10), { wash: KAL.ember, ink: null });
      paint(ellPts(e3x, e3y, rx * .25, rx * .45, 6), { wash: '#2A1418', ink: null });
      paint(ellPts(e3x - rx * .25, e3y - rx * .4, rx * .18, rx * .2, 6), { wash: '#FFFFFF', ink: null });
    } else {
      inkLine([[e3x, e3y - .42 * u], [e3x, e3y + .4 * u]], sw * 1.6, KAL.tilak, 'ink', 0);
    }
    if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 1.75 * u, -18.7 * u, .65 * u, .35 * u, 14), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
    rs('eyes');
    const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['normal', 'closed'] : [o.eyes || 'normal', o.eyes || 'normal'];
    const own = k => ['normal', 'look', 'wide', 'closed', 'happy', 'angry', 'determined'].includes(k);
    if (kinds.every(own)) {
      const lx = (o.lookX || 0) * u * .2, ly = (o.lookY || 0) * u * .15;
      const blink = ((T * .9 + (o.seed || 0) * 1.7 + 2.9) % 3.6) < .12;
      [-1, 1].forEach((s, i) => {
        const k0 = (o.squint || 0) > .5 ? 'closed' : kinds[i], k = k0 === 'angry' || k0 === 'determined' ? 'normal' : k0;
        const b = clamp((s < 0 ? o.browL : o.browR) ?? o.brows ?? (k0 === 'angry' ? -1 : k0 === 'determined' ? -.55 : 0), -1, 1);
        const ex = s * 1.1 * u, ey = -19.7 * u, wide = k === 'wide', closed = k === 'closed' || k === 'happy' || blink;
        const up = Math.max(0, b) * .45, bi = -20.6 - .38 * b - up * .4, bo = -20.65 + (b < 0 ? .3 * b : -.25 * b) - up, bm = (bi + bo) / 2 - .12 - up * .9;
        inkLine(P([[s * .5, bi], [s * 1.1, bm], [s * 1.75, bo]]), sw * (b < 0 ? .7 + .65 * -b : .7), browC, b < 0 ? 'ink' : 'inkfine', .5);
        if (closed) {
          const c = k === 'happy' ? -.25 : .2;
          inkLine([[ex - .55 * u, ey], [ex, ey + c * u], [ex + .55 * u, ey]], sw * 1.1, INK, 'ink', .5);
          inkLine([[ex + s * .5 * u, ey], [ex + s * .75 * u, ey - .15 * u]], sw * .6, INK, 'inkfine', 0);
          return;
        }
        const rx = (wide ? .62 : .56) * u, ry = (wide ? .58 : .42) * u + Math.max(0, b) * .08 * u, kA = clamp(-b);
        // an angry / determined lid slants down toward the nose: the eye is clipped under it, nothing painted over it
        const x0 = ex - s * rx * 1.4, y0 = ey - ry * (1 - 1.15 * kA), x1 = ex + s * rx * 1.4, y1 = ey - ry * (1 - .1 * kA);
        const lid = px => kA > .05 ? lerp(y0, y1, (px - x0) / (x1 - x0)) : -1e9, clip = pts => pts.map(([a, c]) => [a, Math.max(c, lid(a))]);
        paint(clip(ellPts(ex, ey, rx, ry, 16)), { wash: SHL.white, ink: null });
        paint(clip(ellPts(ex + lx, ey + ly, .3 * u, .36 * u, 12)), { wash: SHL.eye, ink: null });
        if (ey + ly - .12 * u > lid(ex + lx - .1 * u) + .05 * u) paint(ellPts(ex + lx - .1 * u, ey + ly - .12 * u, .1 * u, .11 * u, 8), { wash: SHL.white, ink: null });
        if (kA > .05) {
          inkLine([[x0, y0 + ry * .05], [ex, (y0 + y1) / 2], [x1, y1]], sw * 1.6, INK, 'ink', .5);
          inkLine([[ex - rx * .9, ey + ry * .55], [ex, ey + ry * .95], [ex + rx * .9, ey + ry * .55]], sw * .5, INK, 'inkfine', .5);
          return;
        }
        inkLine([[ex - rx * 1.05, ey + ry * .1], [ex - rx * .3, ey - ry * 1.05], [ex + rx * .5, ey - ry * 1], [ex + rx * 1.15, ey - ry * .3], [ex + s * rx * 1.45, ey - ry * .85]].map(([a, bb]) => [s < 0 ? 2 * ex - a : a, bb]), sw * 1.35, INK, 'ink', .5);
      });
    } else { push(); translate(0, -19.7 * u); scale(.44); translate(0, 6 * u); eyes(u, o, sw / .44 * .85, [-1, 1], 0); pop(); }
    rs('nose');
    inkLine(P([[.02, -19.2], [-.08, -18.85], [.12, -18.75]]), sw * .5, mixCol(SHL.skinDk, KAL.rim, dark * .5), 'inkfine', .5);
    rs('mouth');
    const mo = o.mouth || 'smile';
    if (mo === 'smile') {
      paint(P([[-.5, -18.3], [0, -18.05], [.5, -18.3], [0, -18.18]]), { wash: lipC, ink: null, curv: .5 });
      inkLine(P([[-.55, -18.32], [0, -18.02], [.55, -18.32]]), sw * .6, INK, 'inkfine', .6);
    } else if (mo === 'flat') {
      paint(P([[-.45, -18.2], [0, -18.27], [.45, -18.2], [0, -18.05]]), { wash: lipC, ink: null, curv: .5 });
      inkLine(P([[-.5, -18.17], [0, -18.14], [.5, -18.17]]), sw * .7, INK, 'inkfine', .3);
    } else if (mo === 'teeth' || mo === 'roar') {
      const open = mo === 'roar' ? .55 : 0;
      paint(P([[-.72, -18.05], [-.55, -18.5], [0, -18.62], [.55, -18.5], [.72, -18.05], [.4, -17.75 + open * .1], [0, -17.6 + open], [-.4, -17.75 + open * .1]]), { wash: open ? '#5A1E2A' : SHL.white, ink: INK, sw: sw * .7, curv: .3 });
      if (open) { paint(P([[-.6, -18.45], [0, -18.58], [.6, -18.45], [.45, -18.25], [-.45, -18.25]]), { wash: SHL.white, ink: null, curv: .3 }); paint(ellPts(0, (-17.35 + open * .2) * u * 1, .38 * u, .18 * u, 10), { wash: '#D86A78', ink: null }); }
      else for (const tx of [-.3, 0, .3]) inkLine(P([[tx, -18.55], [tx, -18.03]]), sw * .35, SHL.skinDk, 'inkfine', 0);
    } else { push(); translate(0, -18.3 * u); scale(.36); translate(0, 4.3 * u); mouth(u, mo, sw / .36 * .8); pop(); }
    pop();
    pop();

    // ---- the breath of fire: two small flames curl out of her nostrils and up
    if (fire > .02) {
      rs('fire');
      const age = o.fireAge ?? T, nx0 = (hx * .45 + hx * .8 * 1.18) * u, ny0 = KAL_HEAD_Y(-18.85) * u;
      // Both nostrils blast the SAME way (fireDir, default the way her head turns), down and forward like a bull's snort:
      // a symmetric pair from the nose reads as a moustache in a front view.
      const dir = o.fireDir ?? (hx < 0 ? -1 : 1);
      for (let n = 0; n < 2; n++) {
        const a = .42 + n * .3 + Math.sin(age * 13 + n) * .04, cx = Math.cos(a) * dir, cy = Math.sin(a), wv = Math.sin(age * 17 + n * 2) * .15;
        const o0 = [nx0 + dir * (n ? .18 : -.08) * u, ny0 + .12 * u], at = d => [o0[0] + cx * d * u - cy * wv * d * .1 * u * dir, o0[1] + cy * d * u + cx * wv * d * .1 * u * dir];
        const jet = [at(0), at(1.4), at(2.9), at(4.2)];
        glow(jet[2][0], jet[2][1], u * 2.2 * fire, KAL.fire, .5 * fire);
        paint(ribbon(jet, .06 * u, (1 - n * .25) * 1.05 * u * fire), { wash: KAL.fire, ink: null });
        paint(ribbon(jet.slice(0, 3), .03 * u, .45 * u * fire), { wash: KAL.fireLt, ink: null });
        for (let q = 0; q < 3; q++) {   // fireballs roll off the end of each jet, grow, rise and fade to smoke
          const k = frac(age / .8 + q / 3 + n * .17), r = u * fire * (.45 + .6 * Math.min(1, k * 2)) * (1 - Math.max(0, k - .7) / .3 * .8);
          if (r < u * .05) continue;
          const [ex0, ey0] = at(4.2 + 2.2 * easeOut(k)), px = ex0, py = ey0 - 2.2 * k * k * u;
          glow(px, py, r * 2.2, KAL.fire, .5 * fire * (1 - k));
          const fl = Math.sin(age * 20 + q * 2 + n) * .25;
          paint([[px - r, py + r * .2], [px - r * .55, py - r * .7], [px + fl * r, py - r * (1.7 + .3 * fl)], [px + r * .55, py - r * .7], [px + r, py + r * .2], [px, py + r * .85]],
            { wash: k < .7 ? KAL.fire : mixCol(KAL.fire, '#6A5A70', (k - .7) / .3), ink: null, curv: .5 });
          if (k < .6) paint(ellPts(px, py + r * .15, r * .45, r * .55, 8), { wash: KAL.fireLt, ink: null });
        }
      }
    }

    // ---- the front arms, last: the lotus (screen-left) and the trishul (screen-right)
    for (const s of [-1, 1]) {
      rs('arm' + s);
      const [sh, el, ha] = kalaratriFrontArm(o, s), hook = s < 0 ? o.armL : o.armR;
      paint(ribbon(P([sh, el, ha]), 1.05 * u, .75 * u), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .8 });
      if (dark > .05) inkLine(P([[sh[0] + s * .45, sh[1] + .2], [el[0] + s * .38, el[1]], [ha[0] + s * .3, ha[1] + .1]]), sw * .9, rimC, 'inkfine', .5);
      band(sh, el, .62, KAL.silver, 1.7);
      for (const k of [.58, .7, .82]) band(el, ha, k, SHL.gold, 1.05);
      push(); translate(ha[0] * u, ha[1] * u);
      rs('prop' + s);
      if (s < 0 && o.lotus !== false) lotus(u, sw, o.lotusOpen ?? 1);
      if (s > 0 && o.trishul !== false) trishul(u, sw, o.trishulA || 0);
      rs('hand' + s);
      paint(ellPts(0, 0, .6 * u, .55 * u, 14, J), { wash: col, ink: INK, sw: sw * .7 });
      if (hook) hook(u, sw);
      pop();
    }
  });
  pop();

  if (o.emote) {
    rs('emote');
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1, b0 = sit ? SHL_SEAT : 0;
    emote(o.emote, top ? x : x + dir * 5 * u, y + dy + ((top ? -31 : -24) + b0) * u * (1 - sq), u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheets: studio.html?loop=kalaratri (the looks and the transformation) and ?loop=kalaride (on her donkey, and a
// close-up), or node render.mjs --loop=kalaratri --sheet=0.5 --cols=1 --w=720
(() => {
  LOOPS.kalaratri = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#1B1D3A', ink: null });
    const CW = 540, CH = 640, cell = i => [(i % 2) * CW, Math.floor(i / 2) * CH];
    paint(rectPts(0, 0, CW, CH), { wash: '#7A2A2E', ink: null });
    const poses = [
      ['serene', { dark: 0, wild: 0, eye3: 0, bolt: 0, skulls: 0, arms: 0, aura: .5, auraCol: '#FFB850' }],
      ['fierce', { dark: .5, wild: .5, eye3: .3, bolt: .5, skulls: .5, arms: .5 }],
      ['fierce', { fire: 1, aura: .6 }],
      ['gentle', { boltSoft: 1, lookX: .5 }],
      ['fierce', { mouth: 'roar', eyes: 'angry', fire: .7, hair: .6 }],
      ['gentle', { eyes: 'happy', boltSoft: .6, mouth: 'smile', arms: .6 }],
    ];
    poses.forEach(([name, over], i) => {
      const [cx, cy] = cell(i);
      kalaratri(cx + CW / 2, cy + CH - 40, 18, { ...feel(name, t + i * .3, { seed: i }), ...over });
    });
  };
  LOOPS.kalaratri.len = 4;
  LOOPS.kalaride = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#1B1D3A', ink: null });
    const d = { walk: t * 1.2, eyes: 'happy', grin: .6 }, s = donkeySeat(500, 820, 34, d);
    donkey(500, 820, 34, d);
    kalaratri(s[0], s[1], 24, { ...feel('fierce', t), sit: 1, lookX: .4 });
    kalaratri(540, 2380, 66, { ...feel('fierce', t), fire: 1, fireAge: t, hx: .45, lookX: .5, noShadow: true });
  };
  LOOPS.kalaride.len = 4;
})();
