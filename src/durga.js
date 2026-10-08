// durga.js: Maa Durga, Mahishasura Mardini: a deep red saree with a broad gold border, a green blouse with gold trim,
// golden skin, long black hair that flies in a fight, a tall fan-shaped gold mukut, a third eye, a ring of fire behind
// her head (the prabhavali), gold jewellery, a red-and-gold pallu across the chest.
// TEN ARMS, each holding a god's gift (Devi Mahatmya, ch. 2): the front pair holds Shiva's TRISHUL (screen-left, her
// right hand) and gives abhaya (screen-right); four back pairs fan out behind her shoulders:
//   screen-left:  Vishnu's chakra · Kala's khadga · Indra's vajra · Yama's gada
//   screen-right: Varuna's shankh · Vayu's bow · Vayu's arrow · the ocean's lotus
// Standing, or sitting side-saddle (sit: 1) on Sher running (lionRun() in lion.js: pass lionRunSeat(...)).
// Built on Chandraghanta / Shailputri (same chibi proportions, arm solver, head scale; shailputriWorld() for points).
// Load after shailputri.js (SHL, SHL_SEAT, trishul(), lotus(), shailputriWorld()) and chandraghanta.js (gada(), khadga(),
// dhanush(), baan(), cghPalm()); feel() / emotions() drive her (EMO.fierce is in kalaratri.js).
// (x, y) is the ground point under her, or with sit: 1 the point she sits on. u is the size unit (about 29u tall
// standing to the top of the mukut, 18u from the seat; the arm fan spans about ±9u).
//
// Body-local coordinates in u (y up is negative; standing): hem -1.2..0 · waist -11.8 · shoulders (±2.6, -16.2) · head
// centre (0, -19.8) · eyes (±1.1, -19.7) · third eye (0, -21.05) · mukut -22.3..-28.2 (the head is then scaled 1.18×
// about the neck at (0, -17.6), so on screen the third eye sits at -21.7 and the mukut tops out near -30.2)
//
// Options (all optional):
//   pose:   sit, swing (-1..1, feet when sitting), walk (phase), dx, dy (in u), sq, rot, flip, hx (-1..1 head turn),
//           htilt, lean (u), hair (-1..1: + streams the hair and pallu to screen-left), wild 0..1 (the hair flies loose)
//   arms:   arms 0..1 (default 1): the four back pairs fan out, one pair after another, each on an overshoot.
//           backAt(k, s) → [x, y] in u (or null) moves back hand k (0 = top pair .. 3) on side s (-1 screen-left);
//           backOpen 0..1, or (k, s) → 0..1, swaps that hand's weapon for an open palm.
//           handL / handR = [x, y] in u (the front pair), bendL / bendR, armL(u, sw) / armR(u, sw) (hooks at the hands)
//   gifts:  gifts: a number 0..1 for all, or { trishul, chakra, shankh, khadga, dhanush, vajra, baan, gada, lotus } (each
//           0..1, missing = 1), or a function name → 0..1. A gift at 0 leaves an open, waiting palm; it pops in on an
//           overshoot. trishulA (radians, the front trishul's tilt), chakraSpin (radians), abhaya (default true)
//   glow:   aura 0..1 (warm light behind her, drawn first), eye3 0..1 (the third eye opens and glows), fire 0..1 (the
//           prabhavali's flames grow; default .5)
//   face:   eyes, mouth, lookX / lookY, squint, blush, seed, tint + tintK, brows (-1 angry .. +1 raised), browL / browR.
//           Her own eyes: 'normal' / 'look' / 'wide' / 'angry' / 'determined' / 'closed' / 'happy' / 'wink'; every other
//           kind is Clawd's. Mouths: smile (default), flat, teeth, roar (a battle cry), grin; others are Clawd's.
//   extras: emote + emoteK + emoteAge, boilKey, noShadow, swMul, noHalo
// Helpers: durgaHand(x, y, u, o, s), durgaBackHand(x, y, u, o, k, s), durgaHead / durgaEye3 / durgaTrishulTip(x, y, u, o)
//          → world [x, y]; chakra(u, sw, spin), shankh(u, sw, a), vajra(u, sw, a) draw the new gifts on their own.
const DRG = {
  skin: '#F4BF8A', skinDk: '#D69A62', skinLt: '#FFE2BC', ink: '#4A2026',
  saree: '#C8202E', sareeDk: '#93141F', sareeLt: '#E8584E', blouse: '#2E7D5B', blouseDk: '#1F5A40',
  gold: '#EDB43C', goldDk: '#B67D1C', goldLt: '#FFE39A', hair: '#241A22', hairLt: '#4A3A46', fire: '#F47A24', fireLt: '#FFC24A',
  shankh: '#FBF1E0', shankhDk: '#E2CBAE', shankhPk: '#F0A9A0', eye3: '#E8423A',
};
const DRG_SKIN = { col: DRG.skin, dk: DRG.skinDk, lt: DRG.skinLt };

// ---- the new gifts, each held at (0, 0) by its grip, pointing up (rotate by a)
// Vishnu's Sudarshan chakra, spinning on a raised fingertip: a toothed gold disc with a hub
function chakra(u, sw, spin = 0, INK = DRG.ink) {
  push(); translate(0, -1.9 * u); rotate(spin);
  const R = 1.55, P = [];
  for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, r = i % 2 ? R : R * .82; P.push([Math.cos(a) * r * u, Math.sin(a) * r * u]); }
  paint(P, { wash: DRG.gold, fill: DRG.goldDk, fillOp: 60, tex: .4, ink: INK, sw: sw * .6 });
  paint(ellPts(0, 0, 1.0 * u, 1.0 * u, 18), { wash: DRG.goldLt, ink: INK, sw: sw * .45 });
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; inkLine([[Math.cos(a) * .35 * u, Math.sin(a) * .35 * u], [Math.cos(a) * .95 * u, Math.sin(a) * .95 * u]], sw * .5, DRG.goldDk, 'inkfine', 0); }
  paint(ellPts(0, 0, .35 * u, .35 * u, 10), { wash: '#C8324A', ink: INK, sw: sw * .4 });
  pop();
  inkLine(U([[0, .2], [0, -.35]], u), sw * 1.4, DRG.skin, 'ink', 0);   // the raised fingertip it spins on
}
// Varuna's shankh (conch), held by its body, the spout up
function shankh(u, sw, a = 0, INK = DRG.ink) {
  push(); rotate(a);
  paint(U([[-.2, 1.1], [-.95, .6], [-1.15, -.4], [-.85, -1.5], [-.3, -2.5], [.1, -3.1], [.35, -2.6], [.75, -1.6], [1.15, -.6], [1.05, .45], [.55, 1.05]], u), { wash: DRG.shankh, fill: DRG.shankhDk, fillOp: 60, tex: .4, ink: INK, sw: sw * .6, curv: .5 });
  paint(U([[.15, .9], [.85, .3], [.95, -.6], [.55, -1.3], [.25, -.4], [-.05, .4]], u), { wash: DRG.shankhPk, ink: null, curv: .5 });
  for (const k of [-.9, -.2, .5]) inkLine(U([[-.85, k], [.2, k - .35], [.9, k - .1]], u), sw * .45, DRG.shankhDk, 'inkfine', .5);
  paint(ellPts(.08 * u, 1.15 * u, .35 * u, .22 * u, 8), { wash: DRG.gold, ink: INK, sw: sw * .4 });
  pop();
}
// Indra's vajra (the thunderbolt): a gold grip with three curved prongs at each end
function vajra(u, sw, a = 0, INK = DRG.ink) {
  push(); rotate(a);
  paint(ribbon(U([[0, .9], [0, -.9]], u), .5 * u, .5 * u), { wash: DRG.goldDk, ink: INK, sw: sw * .5 });
  for (const e of [-1, 1]) {
    paint(ellPts(0, e * 1.15 * u, .55 * u, .32 * u, 10), { wash: DRG.gold, ink: INK, sw: sw * .45 });
    for (const s of [-1, 0, 1]) paint(ribbon(U([[s * .3, e * 1.3], [s * .95, e * 2.1], [s * .7, e * 2.9], [s * .15, e * 3.3]], u), .32 * u, .08 * u), { wash: DRG.gold, fill: DRG.goldDk, fillOp: 50, ink: INK, sw: sw * .45 });
  }
  pop();
}

const DRG_BACK = [   // the back pairs: hand targets for the screen-left side (mirror x for the right), and the gifts
  { at: [-6.3, -22.4], b: 1.3, L: ['chakra', (u, sw, o) => chakra(u * .85, sw, o.chakraSpin ?? T * 9)], R: ['shankh', (u, sw) => shankh(u * .8, sw, .25)] },
  { at: [-7.7, -18.3], b: 1.2, L: ['khadga', (u, sw) => khadga(u * .82, sw, -.35)], R: ['dhanush', (u, sw) => dhanush(u * .8, sw, .2)] },
  { at: [-7.9, -14.1], b: 1.1, L: ['vajra', (u, sw) => vajra(u * .75, sw, -.5)], R: ['baan', (u, sw) => baan(u * .82, sw, .55)] },
  { at: [-6.9, -10.2], b: 1.1, L: ['gada', (u, sw) => gada(u * .78, sw, .1)], R: ['lotus', (u, sw) => lotus(u * .85, sw, 1)] },
];
function durgaGift(o, name) {
  const g = o.gifts;
  if (g == null) return 1;
  if (typeof g === 'number') return clamp(g);
  if (typeof g === 'function') return clamp(g(name));
  return clamp(g[name] ?? 1);
}
// a back hand's shoulder, elbow and hand (u) and its fan progress
function durgaBack(o, k, s) {
  const arms = clamp(o.arms ?? 1), pk = clamp((arms - k * .18) / .46), e = backOut(pk), A = DRG_BACK[k];
  const sh = [s * 2.2, -16], tuck = [s * 2.4, -14.6];
  const ov = o.backAt && o.backAt(k, s);
  const tx = ov ? ov[0] : s < 0 ? A.at[0] : -A.at[0], ty = ov ? ov[1] : A.at[1] + Math.sin(T * 1.7 + k * 1.3 + s) * .12;
  const ha = [lerp(tuck[0], tx, e), lerp(tuck[1], ty, e)];
  const ddx = ha[0] - sh[0], ddy = ha[1] - sh[1], d = Math.hypot(ddx, ddy) || 1;
  let nx = -ddy / d, ny = ddx / d; if (ny > 0) { nx = -nx; ny = -ny; }   // the elbow bends up and out
  return { sh, el: [(sh[0] + ha[0]) / 2 + nx * A.b * e, (sh[1] + ha[1]) / 2 + ny * A.b * e], ha, pk };
}
function durgaArm(o, s) {
  const sh = [s * 2.6, -16.2];
  const ha = (s < 0 ? o.handL : o.handR) || (s < 0 ? [-4.4, -13.6] : [4.2, -18.2]);
  const dx = ha[0] - sh[0], dy = ha[1] - sh[1], d = Math.hypot(dx, dy) || 1;
  let nx = -dy / d, ny = dx / d; if (nx * s < 0) { nx = -nx; ny = -ny; }
  const b = (s < 0 ? o.bendL : o.bendR) ?? (s < 0 ? 1 : 1.3);
  return [sh, [(sh[0] + ha[0]) / 2 + nx * b, (sh[1] + ha[1]) / 2 + ny * b], ha];
}
const DRG_HEAD_Y = y => -17.6 + (y + 17.6) * 1.18;   // a drawn head y → body y, through the head scale
function durgaHand(x, y, u, o, s) { const [, , h] = durgaArm(o, s); return shailputriWorld(x, y, u, o, h[0], h[1]); }
function durgaBackHand(x, y, u, o, k, s) { const { ha } = durgaBack(o, k, s); return shailputriWorld(x, y, u, o, ha[0], ha[1]); }
function durgaHead(x, y, u, o = {}) { return shailputriWorld(x, y, u, o, clamp(o.hx || 0, -1, 1) * .45, -20.2); }
function durgaEye3(x, y, u, o = {}) { const hx = clamp(o.hx || 0, -1, 1); return shailputriWorld(x, y, u, o, hx * .45 + hx * .8 * 1.18, DRG_HEAD_Y(-21.05)); }
function durgaTrishulTip(x, y, u, o = {}) {
  const [, , h] = durgaArm(o, -1), a = o.trishulA ?? -.1, fx = o.flip ? -1 : 1;
  return shailputriWorld(x, y, u, o, h[0] + Math.sin(a) * 10.5 * fx * fx, h[1] - Math.cos(a) * 10.5);
}

function durga(x, y, u, o = {}) {
  const id = o.boilKey ?? 'd' + (++CLAWD_N), rs = p => boilSeed(`durga ${id} ${p}`);
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .04;
  const { col, dk, lt } = tintCols({ ...o, col: o.col || DRG.skin, dk: o.dk || DRG.skinDk, lt: o.lt || DRG.skinLt });
  const P = pts => U(pts, u), INK = DRG.ink, wk = o.walk, hx = clamp(o.hx || 0, -1, 1), lean = o.lean || 0, sit = !!o.sit;
  const hs = wk == null ? 0 : Math.sin(wk * TAU) * .35, hw = o.hair || 0, wild = clamp(o.wild || 0);
  const sway = Math.sin(T * 1.6) * .22 + hs * .5 - hw * 1.7;
  const wo = { ...o, dx: 0, dy: 0 };

  // ---- the aura first, then the prabhavali (a ring of fire) behind the head
  const au = clamp(o.aura || 0), [hx0, hy0] = durgaHead(x, y + dy, u, wo);
  rs('aura');
  if (au > .01) {
    const [bx, by] = shailputriWorld(x, y + dy, u, wo, 0, -15);
    glow(bx, by, u * (14 + 18 * au), '#FF8A3A', au * .8);
    glow(bx, by, u * (8 + 10 * au), '#FFC766', au);
    glow(hx0, hy0 - u, u * (6 + 5 * au), '#FFF0B8', au * .9);
  }
  if (!o.noHalo) {
    rs('halo');
    const R = u * 5.9, cy = hy0 - u * 1.6, fk = clamp(o.fire ?? .5);
    paint(ellPts(hx0, cy, R, R, 32), { fill: '#FFD27A', fillOp: 70 + 60 * au, bleed: .3, tex: .3, ink: null });
    for (let i = 0; i < 18; i++) {   // flame tongues round the rim, licking outward
      const a = i / 18 * TAU + Math.sin(T * 3 + i) * .04, fl = (1.1 + .5 * hash(i) + .35 * Math.sin(T * 9 + i * 2.3)) * (.6 + fk * .8);
      const r0 = R - u * .2, tip = R + u * fl, w = u * .5;
      const c = Math.cos(a), s = Math.sin(a), px = -s, py = c, cx = hx0 + c * r0, cyy = cy + s * r0;
      paint([[cx + px * w, cyy + py * w], [hx0 + c * (r0 + (tip - r0) * .55) + px * w * .55, cy + s * (r0 + (tip - r0) * .55) + py * w * .55], [hx0 + c * tip, cy + s * tip], [hx0 + c * (r0 + (tip - r0) * .55) - px * w * .55, cy + s * (r0 + (tip - r0) * .55) - py * w * .55], [cx - px * w, cyy - py * w]],
        { wash: i % 2 ? DRG.fire : DRG.fireLt, ink: null, curv: .5 });
    }
    const e = ellPts(hx0, cy, R, R, 36, J); inkLine([...e, e[0], e[1]], sw * 2.6, '#E9A93A', 'ink', .5);
    const e2 = ellPts(hx0, cy, R - u * .5, R - u * .5, 36, J); inkLine([...e2, e2[0], e2[1]], sw * 1.2, '#FFE39A', 'ink', .5);
  }

  if (!o.noShadow && !sit) { rs('shadow'); paint(ellPts(x, y + u * .1, u * 5.4 * (1 - Math.min(.5, Math.abs(o.dy || 0) * .05)), u * 1, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  if (sit) translate(0, SHL_SEAT * u);
  const headScale = () => { translate(0, -17.6 * u); scale(1.18); translate(0, 17.6 * u); };
  const upper = f => { push(); translate(0, -11.8 * u); rotate(lean * .035); translate(lean * .6 * u, 11.8 * u); f(); pop(); };

  upper(() => {
    // ---- behind: the long open hair (wild: it flies out in locks)
    rs('backhair');
    const h = sway, fl = hw * Math.sin(T * 9) * .25, wl = wild * 1.6;
    const mass = [[-3.3, -23.4], [-4.2 - wl * .3, -21], [-4.6 - wl * .6, -18.4], [-5.1 + h * .5 - wl, -16], [-4.8 + h - wl * .9, -13.6], [-3.8 + h * 1.4 + fl - wl * .6, -11.4], [-2.4 + h * 1.2, -12.4], [-.8 + h, -11.8],
      [.8 + h, -12.4], [2.4 + h * 1.2, -11.8], [3.8 + h * 1.2 + fl + wl * .6, -12.2], [4.7 + h * .8 + wl * .9, -13.8], [5.0 + h * .4 + wl, -16], [4.6 + wl * .6, -18.4], [4.2 + wl * .3, -21], [3.3, -23.4], [0, -24.3]];
    paint(P(mass), { wash: DRG.hair, ink: INK, sw: sw * .8, curv: .5 });
    if (wild > .05) for (const [s, yy, k] of [[-1, -17, 0], [-1, -14, 1], [1, -16.5, 2], [1, -13.2, 3]]) {   // loose locks
      const w = Math.sin(T * 7 + k * 1.9) * .5 * wild, bx = s * (4.6 + wl * .8);
      paint(ribbon(P([[bx - s * .6, yy], [bx + s * 1.1 * wild + h * .5, yy + .4 + w], [bx + s * 2.2 * wild + h, yy + 1.4 + w * 1.5]]), .9 * u, .1 * u), { wash: DRG.hair, ink: INK, sw: sw * .6 });
    }
    for (const [a, b] of [[-3.7, 1], [3.6, -1], [-2.7, 1]])
      inkLine(P([[a, -17.6], [a - .35 * b + h * .4, -16], [a + .1 * b + h * .8, -14.6], [a - .2 * b + h * 1.1, -13.2]]), sw * .5, DRG.hairLt, 'inkfine', .5);
    push(); translate(hx * .4 * u, 0); headScale();
    paint(ellPts(0, -20.1 * u, 3.3 * u, 3.15 * u, 26, J), { wash: DRG.hair, ink: INK, sw: sw * .8 });
    pop();

    // ---- the back arms: four pairs fanned out from behind the shoulders, the lowest pair first in the draw order
    const bcol = mixCol(col, dk, .25);
    for (let k = DRG_BACK.length - 1; k >= 0; k--) {
      for (const s of [-1, 1]) {
        const { sh, el, ha, pk } = durgaBack(o, k, s);
        if (pk < .02) continue;
        rs(`back${k}${s}`);
        const [gName, gDraw] = s < 0 ? DRG_BACK[k].L : DRG_BACK[k].R, gk = durgaGift(o, gName);
        const bo = clamp(typeof o.backOpen === 'function' ? o.backOpen(k, s) : o.backOpen || 0), open = Math.max(bo, 1 - clamp(gk * 3));
        paint(ribbon(P([sh, el, ha]), .95 * u, .68 * u), { wash: bcol, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .7 });
        const dd = Math.hypot(ha[0] - el[0], ha[1] - el[1]) || 1, bnx = -(ha[1] - el[1]) / dd * .38, bny = (ha[0] - el[0]) / dd * .38;
        for (const kk of [.6, .72, .84]) { const bx = lerp(el[0], ha[0], kk), by = lerp(el[1], ha[1], kk); inkLine(P([[bx - bnx, by - bny], [bx + bnx, by + bny]]), sw * 1, DRG.gold, 'ink', 0); }
        push(); translate(ha[0] * u, ha[1] * u);
        const ps = clamp(pk * 1.6) * (1 - bo) * backOut(gk);
        if (ps > .02) { scale(ps); gDraw(u, sw / Math.max(ps, .3), o); scale(1 / ps); }
        if (open > .02 && ps < .5) cghPalm(u, sw, Math.atan2(ha[1] - el[1], ha[0] - el[0]), s, bcol, dk, INK, open);
        else paint(ellPts(0, 0, .55 * u, .5 * u, 12, J), { wash: bcol, ink: INK, sw: sw * .6 });
        pop();
      }
    }

    // ---- the pallu falling behind her right shoulder (screen-left)
    rs('pallback');
    const ph = sway * .8;
    paint(ribbon(P([[-2.6, -16.4], [-3.6 + ph * .3, -14.2], [-4.1 + ph * .7, -11.6], [-4.4 + ph * 1.2, -9]]), 2 * u, 2.1 * u), { wash: DRG.saree, fill: DRG.sareeDk, fillOp: 80, tex: .5, ink: INK, sw: sw * .75 });
    inkLine(P([[-3.4, -16], [-4.5 + ph * .3, -13.8], [-5 + ph * .7, -11.4], [-5.3 + ph * 1.2, -9.1]]), sw * 2, DRG.gold, 'ink', .5);
  });

  if (!sit) {
    // ---- standing: feet under the hem, the skirt with its broad gold border
    rs('feet');
    for (const s of [-1, 1]) {
      const l = wk == null ? 0 : Math.max(0, Math.sin((wk + (s < 0 ? 0 : .5)) * TAU)) * .5;
      paint(ellPts((s * 1.1 + (wk == null ? 0 : s * l * .3)) * u, (-.25 - l) * u, .95 * u, .45 * u, 14, J), { wash: col, ink: INK, sw: sw * .7 });
      paint(ellPts((s * 1.1 + (wk == null ? 0 : s * l * .3)) * u, (-.05 - l) * u, .8 * u, .14 * u, 10), { wash: '#D2283A', ink: null });   // alta
      inkLine(P([[s * 1.1 - .6, -.45 - l], [s * 1.1 + .6, -.45 - l]]), sw * .9, DRG.gold, 'ink', 0);
    }
    rs('skirt');
    const skirt = P([[-2.2, -11.9], [2.2, -11.9], [2.9, -8.5], [3.7, -4.6], [4.3 + hs * .4, -1.5], [4.6 + hs, -.5], [2.6 + hs * .5, -.35], [0, -.3], [-2.6 + hs * .5, -.35], [-4.6 + hs, -.5], [-4.3 + hs * .4, -1.5], [-3.7, -4.6], [-2.9, -8.5]]);
    paint(skirt, { wash: DRG.saree, fill: DRG.sareeDk, fillOp: 80, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .3 });
    paint(ribbon(P([[-4.5 + hs, -1.25], [-2.2 + hs * .5, -1.1], [0, -1.05], [2.2 + hs * .5, -1.1], [4.5 + hs, -1.25]]), 1.25 * u, 1.25 * u), { wash: DRG.gold, fill: DRG.goldDk, fillOp: 50, tex: .5, ink: null });
    for (let k = 0; k < 7; k++) { const bx = lerp(-3.9, 4.1, (k + .5) / 7) + hs * .55; paint(ellPts(bx * u, -1.15 * u, .2 * u, .2 * u, 6), { wash: DRG.sareeDk, ink: null }); }
    for (const k of [-.5, .1, .6]) inkLine(P([[k * .6, -10.5], [k * 1.2 + hs * .3, -5.5], [k * 1.8 + hs * .5, -2]]), sw * .5, DRG.sareeDk, 'inkfine', .5);
    for (let k = 0; k < 8; k++) { const bx = lerp(-3, 3.2, hash(k + 3)) + hs * .4, by = lerp(-9.5, -3.2, hash(k + 11)); paint(ellPts(bx * u * (1 - (-by - 2) * .03), by * u, .2 * u, .2 * u, 6), { wash: DRG.gold, ink: null }); }
  } else {
    // ---- sitting side-saddle: both feet toward us under the hem, the drape over her lap and down her mount's flank
    rs('feet');
    const swg = (o.swing || 0) * .35;
    for (const [fx, fy, k] of [[-.95, -3.85, 1], [1.05, -3.75, -1]]) {
      paint(ellPts((fx + swg * k) * u, fy * u, .9 * u, .5 * u, 14, J), { wash: col, ink: INK, sw: sw * .7 });
      inkLine(P([[fx + swg * k - .55, fy - .3], [fx + swg * k + .55, fy - .3]]), sw * .9, DRG.gold, 'ink', 0);
    }
    rs('skirt');
    const drape = P([[-2.3, -11.9], [2.3, -11.9], [3.3, -10.7], [3.5, -9.2], [3.25, -7], [2.95, -5.1], [2.3, -4.3], [0, -4.15], [-2.3, -4.3], [-2.95, -5.1], [-3.25, -7], [-3.5, -9.2], [-3.3, -10.7]]);
    paint(drape, { wash: DRG.saree, fill: DRG.sareeDk, fillOp: 80, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .35 });
    paint(ribbon(P([[-2.9, -5.15], [-1.4, -4.85], [0, -4.78], [1.4, -4.85], [2.9, -5.15]]), 1.0 * u, 1.0 * u), { wash: DRG.gold, fill: DRG.goldDk, fillOp: 50, tex: .5, ink: null });
    inkLine(P([[-3, -9.5], [-1, -9.05], [1, -9.05], [3, -9.5]]), sw * .55, DRG.sareeDk, 'inkfine', .5);
    for (const k of [-.55, .1, .65]) inkLine(P([[k * 1.6, -8.6], [k * 2, -5.6]]), sw * .5, DRG.sareeDk, 'inkfine', .5);
    for (let k = 0; k < 4; k++) paint(ellPts(lerp(-2.1, 2.1, k / 3) * u, -6.6 * u, .2 * u, .2 * u, 8), { wash: DRG.gold, ink: null });
  }

  upper(() => {
    // ---- torso: midriff, blouse, the pallu across the chest, necklace, a gold kamarbandh
    rs('torso');
    paint(P([[-2.3, -16.6], [2.3, -16.6], [2.4, -14], [2.1, -11.6], [-2.1, -11.6], [-2.4, -14]]), { wash: col, ink: INK, sw: sw * .8, curv: .3 });
    paint(P([[-2.6, -16.8], [2.6, -16.8], [2.55, -14.6], [1.9, -13.7], [-1.9, -13.7], [-2.55, -14.6]]), { wash: DRG.blouse, fill: DRG.blouseDk, fillOp: 70, tex: .6, ink: INK, sw: sw * .8, curv: .3 });
    inkLine(P([[-2.5, -14.5], [-1.9, -13.8], [1.9, -13.8], [2.5, -14.5]]), sw * 1.1, DRG.gold, 'ink', .4);
    inkLine(P([[-2.15, -12.05], [0, -11.8], [2.15, -12.05]]), sw * 2, DRG.gold, 'ink', .4);
    rs('pallu');
    paint(ribbon(P([[2.3, -11.2], [1.4, -12.8], [-.2, -14.6], [-1.8, -16.3], [-2.7, -16.9]]), 2.3 * u, 1.7 * u), { wash: DRG.saree, fill: DRG.sareeDk, fillOp: 70, tex: .5, ink: INK, sw: sw * .8 });
    inkLine(P([[3, -11.7], [2.1, -13.3], [.5, -15.2], [-1, -16.8], [-1.8, -17.4]]), sw * 2.2, DRG.gold, 'ink', .5);
    for (const [bx, by] of [[1.4, -12.5], [0, -14.1], [-1.4, -15.7]]) paint(ellPts(bx * u, by * u, .2 * u, .2 * u, 8), { wash: DRG.gold, ink: null });
    rs('neck');
    paint(P([[-.75, -17.9], [.75, -17.9], [.8, -16.7], [-.8, -16.7]]), { wash: col, ink: INK, sw: sw * .6 });
    inkLine(P([[-1.6, -17], [-.75, -16], [0, -15.7], [.75, -16], [1.6, -17]]), sw * 2.2, DRG.gold, 'ink', .6);
    inkLine(P([[-1.9, -16.9], [-1, -15.2], [0, -14.8], [1, -15.2], [1.9, -16.9]]), sw * 1.2, DRG.gold, 'ink', .6);
    paint(P([[0, -15.85], [.42, -15.4], [0, -14.8], [-.42, -15.4]]), { wash: '#C8324A', ink: INK, sw: sw * .4 });

    // ---- head
    push(); translate(hx * .45 * u, 0); headScale();
    if (o.htilt) { translate(0, -17.5 * u); rotate(o.htilt); translate(0, 17.5 * u); }
    rs('head');
    const head = ellPts(0, -19.8 * u, 2.8 * u, 2.75 * u, 30, J);
    paint(head, { wash: col, ink: null });
    paint(ellPts((-1 + hx) * u, -20.8 * u, 1.5 * u, .8 * u, 14, J * 2, -.2), { fill: lt, fillOp: 120, bleed: .2, tex: .85, border: .8, ink: null });
    paint(ellPts(0, -17.7 * u, 2 * u, .7 * u, 14, J), { fill: dk, fillOp: 60, bleed: .1, tex: .6, border: .5, ink: null });
    paint(head, { ink: INK, sw });
    rs('jhumka');
    for (const s of [-1, 1]) {
      push(); translate(s * 2.75 * u, -19 * u); rotate(Math.sin(T * 2.4 + s) * .12 + hw * .3);
      inkLine([[0, 0], [0, .5 * u]], sw * .5, DRG.goldDk, 'inkfine', 0);
      paint(U([[-.55, 1.4], [0, .45], [.55, 1.4]], u), { wash: DRG.gold, fill: DRG.goldDk, fillOp: 50, ink: INK, sw: sw * .45, curv: .5 });
      for (const k of [-.35, 0, .35]) paint(ellPts(k * u, 1.55 * u, .11 * u, .11 * u, 6), { wash: DRG.goldLt, ink: null });
      pop();
    }
    rs('hairfront');
    paint(P([[-2.85, -18.6], [-3.15, -20.4], [-2.9, -21.6], [-2.2, -22.35], [-.6, -22.75], [0, -22.3], [.6, -22.75], [2.2, -22.35], [2.9, -21.6], [3.15, -20.4], [2.85, -18.6], [2.4, -20.4], [1.4, -21.5], [.15, -21.6], [0, -21.9], [-.15, -21.6], [-1.4, -21.5], [-2.4, -20.4]]),
      { wash: DRG.hair, ink: INK, sw: sw * .85, curv: .4 });
    inkLine(P([[-2.3, -21.5], [-1.3, -22.25], [-.3, -22.4]]), sw * .45, DRG.hairLt, 'inkfine', .5);
    rs('mukut');   // tall and fan-shaped, three peaks, a red gem
    paint(P([[-2.3, -22.3], [2.3, -22.3], [2.5, -24.2], [2.9, -25.6], [2.1, -25.2], [1.7, -26.7], [1.0, -26.1], [.55, -27.6], [0, -28.4], [-.55, -27.6], [-1.0, -26.1], [-1.7, -26.7], [-2.1, -25.2], [-2.9, -25.6], [-2.5, -24.2]]),
      { wash: DRG.gold, fill: DRG.goldDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .6, curv: .12 });
    inkLine(P([[-2.35, -23.1], [2.35, -23.1]]), sw * 1.1, DRG.goldDk, 'inkfine', 0);
    inkLine(P([[-2.2, -24.6], [-1.1, -25.1], [0, -25.25], [1.1, -25.1], [2.2, -24.6]]), sw * .7, DRG.goldDk, 'inkfine', .5);
    paint(ellPts(0, -24.3 * u, .42 * u, .5 * u, 10), { wash: '#C8324A', ink: INK, sw: sw * .4 });
    paint(ellPts(-.12 * u, -24.45 * u, .12 * u, .14 * u, 6), { wash: '#F08A9A', ink: null });
    for (const s of [-1, 1]) { paint(ellPts(s * 1.45 * u, -24.1 * u, .22 * u, .24 * u, 6), { wash: '#3E9E5A', ink: null }); paint(ellPts(s * .75 * u, -26.3 * u, .13 * u, .13 * u, 6), { wash: DRG.goldLt, ink: null }); }
    for (let k = -4; k <= 4; k++) paint(ellPts(k * .5 * u, -22.65 * u, .13 * u, .13 * u, 6), { wash: DRG.goldLt, ink: null });   // pearls

    push(); translate(hx * .8 * u, 0);
    rs('eye3');   // the third eye: a vertical almond, opening with eye3, glowing
    const e3 = clamp(o.eye3 || 0);
    if (e3 > .02) {
      glow(0, -21.05 * u, u * (.8 + 1.6 * e3), '#FF6A3A', e3 * .9);
      paint(ellPts(0, -21.05 * u, .24 * u * (.4 + .6 * e3), .5 * u, 12), { wash: SHL.white, ink: INK, sw: sw * .5 });
      paint(ellPts(0, -21.05 * u, .13 * u * e3, .2 * u * e3, 8), { wash: DRG.eye3, ink: null });
    } else {
      inkLine(P([[0, -21.5], [0, -20.6]]), sw * .9, DRG.eye3, 'ink', 0);
      paint(ellPts(0, -20.45 * u, .16 * u, .16 * u, 6), { wash: '#D2283A', ink: null });
    }
    if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 1.75 * u, -18.7 * u, .65 * u, .35 * u, 14), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
    rs('eyes');
    const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['normal', 'closed'] : [o.eyes || 'normal', o.eyes || 'normal'];
    const own = k => ['normal', 'look', 'wide', 'closed', 'happy', 'angry', 'determined'].includes(k);
    if (kinds.every(own)) {
      const lx = (o.lookX || 0) * u * .2, ly = (o.lookY || 0) * u * .15;
      const blink = ((T * .9 + (o.seed || 0) * 1.7 + 1.3) % 3.6) < .12;
      [-1, 1].forEach((s, i) => {
        const k0 = (o.squint || 0) > .5 ? 'closed' : kinds[i], k = k0 === 'angry' || k0 === 'determined' ? 'normal' : k0;
        const b = clamp((s < 0 ? o.browL : o.browR) ?? o.brows ?? (k0 === 'angry' ? -1 : k0 === 'determined' ? -.55 : 0), -1, 1);
        const ex = s * 1.1 * u, ey = -19.7 * u, wide = k === 'wide', closed = k === 'closed' || k === 'happy' || (blink && !wide);
        const up = Math.max(0, b) * .45, bi = -20.6 - .38 * b - up * .4, bo = -20.65 + (b < 0 ? .3 * b : -.25 * b) - up, bm = (bi + bo) / 2 - .12 - up * .9;
        inkLine(P([[s * .5, bi], [s * 1.1, bm], [s * 1.75, bo]]), sw * (b < 0 ? .6 + .65 * -b : .6), DRG.hair, b < 0 ? 'ink' : 'inkfine', .5);
        if (closed) {
          const c = k === 'happy' ? -.25 : .2;
          inkLine([[ex - .55 * u, ey], [ex, ey + c * u], [ex + .55 * u, ey]], sw * 1.1, INK, 'ink', .5);
          inkLine([[ex + s * .5 * u, ey], [ex + s * .75 * u, ey - .15 * u]], sw * .6, INK, 'inkfine', 0);
          return;
        }
        const rx = (wide ? .62 : .55) * u, ry = (wide ? .58 : .4) * u + Math.max(0, b) * .08 * u;
        paint(ellPts(ex, ey, rx, ry, 16), { wash: SHL.white, ink: null });
        paint(ellPts(ex + lx, ey + ly, .3 * u, .36 * u, 12), { wash: SHL.eye, ink: null });
        paint(ellPts(ex + lx - .1 * u, ey + ly - .12 * u, .1 * u, .11 * u, 8), { wash: SHL.white, ink: null });
        const kA = clamp(-b);
        if (kA > .05) {
          const A = [ex - s * rx * 1.4, ey - ry * 1.6], Bp = [ex - s * rx * 1.4, ey - ry * (1 - 1.15 * kA)], C = [ex + s * rx * 1.4, ey - ry * (1 - .1 * kA)], D = [ex + s * rx * 1.4, ey - ry * 1.6];
          paint([A, Bp, C, D], { wash: col, ink: null });
          inkLine([[Bp[0], Bp[1] + ry * .05], [ex, (Bp[1] + C[1]) / 2], [C[0], C[1]]], sw * 1.6, INK, 'ink', .5);
          inkLine([[ex + s * rx * 1.1, ey - ry * .1], [ex + s * rx * 1.55, ey - ry * .55]], sw * .9, INK, 'ink', 0);   // kajal flick
          return;
        }
        inkLine([[ex - rx * 1.05, ey + ry * .1], [ex - rx * .3, ey - ry * 1.05], [ex + rx * .5, ey - ry * 1], [ex + rx * 1.15, ey - ry * .3], [ex + s * rx * 1.55, ey - ry * .9]].map(([a, bb]) => [s < 0 ? 2 * ex - a : a, bb]), sw * 1.45, INK, 'ink', .5);
      });
    } else { push(); translate(0, -19.7 * u); scale(.44); translate(0, 6 * u); eyes(u, o, sw / .44 * .85, [-1, 1], 0); pop(); }
    rs('nose');
    inkLine(P([[.02, -19.2], [-.08, -18.85], [.12, -18.75]]), sw * .5, DRG.skinDk, 'inkfine', .5);
    inkLine(ellPts(.3 * u, -18.7 * u, .22 * u, .22 * u, 10).concat([[.52 * u, -18.7 * u]]), sw * .45, DRG.gold, 'inkfine', .5);   // nath
    rs('mouth');
    const mo = o.mouth || 'smile', lip = '#C8404E';
    if (mo === 'smile') {
      paint(P([[-.5, -18.3], [0, -18.05], [.5, -18.3], [0, -18.18]]), { wash: lip, ink: null, curv: .5 });
      inkLine(P([[-.55, -18.32], [0, -18.02], [.55, -18.32]]), sw * .6, INK, 'inkfine', .6);
    } else if (mo === 'flat') {
      paint(P([[-.45, -18.2], [0, -18.27], [.45, -18.2], [0, -18.05]]), { wash: lip, ink: null, curv: .5 });
      inkLine(P([[-.5, -18.17], [0, -18.14], [.5, -18.17]]), sw * .7, INK, 'inkfine', .3);
    } else if (mo === 'grin') {
      paint(P([[-.75, -18.4], [0, -18.5], [.75, -18.4], [.45, -17.95], [0, -17.82], [-.45, -17.95]]), { wash: '#5A1E2A', ink: INK, sw: sw * .7, curv: .4 });
      paint(P([[-.62, -18.38], [0, -18.46], [.62, -18.38], [.5, -18.2], [-.5, -18.2]]), { wash: SHL.white, ink: null, curv: .3 });
    } else if (mo === 'teeth' || mo === 'roar') {
      const open = mo === 'roar' ? .6 : 0;
      paint(P([[-.72, -18.05], [-.55, -18.5], [0, -18.62], [.55, -18.5], [.72, -18.05], [.4, -17.75 + open * .1], [0, -17.6 + open], [-.4, -17.75 + open * .1]]), { wash: open ? '#5A1E2A' : SHL.white, ink: INK, sw: sw * .7, curv: .3 });
      if (open) { paint(P([[-.6, -18.45], [0, -18.58], [.6, -18.45], [.45, -18.25], [-.45, -18.25]]), { wash: SHL.white, ink: null, curv: .3 }); paint(ellPts(0, (-17.35 + open * .2) * u, .38 * u, .18 * u, 10), { wash: '#D86A78', ink: null }); }
      else for (const tx of [-.3, 0, .3]) inkLine(P([[tx, -18.55], [tx, -18.03]]), sw * .35, DRG.skinDk, 'inkfine', 0);
    } else { push(); translate(0, -18.3 * u); scale(.36); translate(0, 4.3 * u); mouth(u, mo, sw / .36 * .8); pop(); }
    pop();
    pop();

    // ---- the front arms, last: Shiva's trishul (screen-left) and abhaya, the raised open palm (screen-right)
    for (const s of [-1, 1]) {
      rs('arm' + s);
      const [sh, el, ha] = durgaArm(o, s), hook = s < 0 ? o.armL : o.armR;
      if (s < 0) { const tk = durgaGift(o, 'trishul'); if (tk > .02) { push(); translate(ha[0] * u, ha[1] * u); scale(backOut(tk)); trishul(u, sw / Math.max(backOut(tk), .3), o.trishulA ?? -.1, INK); pop(); } }
      paint(ribbon(P([sh, el, ha]), 1.05 * u, .75 * u), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .8 });
      const band = (a, b, k, c, w) => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = -(b[1] - a[1]) / d * .44, ny = (b[0] - a[0]) / d * .44, bx = lerp(a[0], b[0], k), by = lerp(a[1], b[1], k); inkLine(P([[bx - nx, by - ny], [bx + nx, by + ny]]), sw * w, c, 'ink', 0); };
      band(sh, el, .65, DRG.gold, 1.5);
      for (const k of [.55, .66, .77, .88]) band(el, ha, k, k === .66 ? '#C8202E' : DRG.gold, 1.05);
      push(); translate(ha[0] * u, ha[1] * u);
      rs('hand' + s);
      if (s > 0 && o.abhaya !== false) {
        paint(U([[-.55, .55], [-.62, -.35], [-.5, -1.35], [-.28, -1.45], [-.2, -.75], [-.12, -1.6], [.1, -1.62], [.15, -.8], [.25, -1.5], [.45, -1.45], [.47, -.7], [.62, -1.1], [.82, -1], [.62, .1], [.45, .6]], u), { wash: col, ink: INK, sw: sw * .6, curv: .25 });
        paint(ellPts(0, -.1 * u, .18 * u, .18 * u, 8), { wash: '#D2283A', ink: null });
      } else paint(ellPts(0, 0, .6 * u, .55 * u, 14, J), { wash: col, ink: INK, sw: sw * .7 });
      if (hook) hook(u, sw);
      pop();
    }
  });
  pop();

  if (o.emote) {
    rs('emote');
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1, b0 = sit ? SHL_SEAT : 0;
    emote(o.emote, top ? x : x + dir * 5 * u, y + dy + (top ? -32 + b0 : -23 + b0) * u * (1 - sq), u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=durga, or node render.mjs --loop=durga --sheet=0.5,2.5 --cols=2 --w=540
(() => {
  LOOPS.durga = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#E9DCC8', ink: null });
    const CW = 540, CH = 640, cell = i => [(i % 2) * CW, Math.floor(i / 2) * CH];
    const bg = (i, c) => { const [cx, cy] = cell(i); paint(rectPts(cx, cy, CW, CH), { wash: c, ink: null }); };
    bg(1, '#5A2A3A'); bg(4, '#3A2A4A');
    const g = clamp((t % 4) / 3), names = ['trishul', 'chakra', 'shankh', 'khadga', 'dhanush', 'vajra', 'baan', 'gada', 'lotus'];
    const poses = [
      ['gentle', 16, { aura: .3 }],
      ['fierce', 16, { eyes: 'angry', mouth: 'roar', eye3: 1, wild: 1, hair: .6, aura: .8, fire: 1 }],
      ['gentle', 16, { gifts: n => clamp(g * 9 - names.indexOf(n)), arms: clamp(g * 3) }],
      ['determined', 16, { handL: [-6.2, -19.5], trishulA: -.9, lean: -1, browL: .2, hair: -.4 }],
      ['fierce', 15, { sit: 1, eyes: 'determined', hair: .8, wild: .6, aura: .6 }],
      ['gentle', 44, { hx: .1, eye3: .7, mouth: 'grin', eyes: 'happy' }],
    ];
    poses.forEach(([name, u, over], i) => {
      const [cx, cy] = cell(i), gx = cx + CW / 2, gy = i === 5 ? 2600 : i === 4 ? cy + CH - 220 : cy + CH - 40;
      durga(gx, gy, u, { ...feel(name, t + i * .3, { seed: i }), ...DRG_SKIN, noShadow: i >= 4, ...over });
    });
  };
  LOOPS.durga.len = 4;
})();
