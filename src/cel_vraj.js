// cel_vraj.js: the Vraja cast in the Cel style (CEL_GUIDE.md), for the "Kanha vs Radha" skits (RADHA_KANHA_SERIES.md):
// chibi Kanha and Radha (about 560 px to the top of the head at s = 1, the head half of that), a little monkey, a clay
// pot of butter, and the cute effects (hearts, sparkles, a sweat drop, ink marks). Load after cel.js.
//
//   celKeys(t, keys, o)          the pose at t from [[time, pose], ...]. Each pose lists only what changes; the rest carries
//                                over from the key before. A move takes tr s (o.tr, or the pose's own tr) and lands at its
//                                time with an overshoot, held on threes like celDance. Returns the pose plus .land (s since
//                                it landed), .lag (a drawing late: hair, plait), .td (the held time), .slot
//   celKanha(c, x, y, s, P, o)   chibi Kanha, feet at (x, y): blue, curly alakas, a topknot with pearls and a peacock
//                                feather, the white Vaishnava tilak, a vaijayanti mala, a yellow pitambar with a red
//                                border, a gold kardhani, his flute tucked in it. o.pal, o.seed. Returns screen anchors
//                                { head, mouth, top, handL, handR, cheekL, cheekR }
//   celRadha(c, x, y, s, P, o)   chibi Radha: long hair with a plait and a red tassel, a centre parting with a maang tikka,
//                                mogra and a rose in her hair, jhumkas, a tiny nose ring, a yellow choli, a pink lehenga
//                                with a gold border, a mint odhni across her, red and gold bangles, payal. Same anchors.
//   celMonkey(c, x, y, s, P, o)  a little monkey (about 330 px tall), feet at (x, y): P like a kid's (eyes, mouth, look,
//                                hL / hR, handL / handR, lean, hop) plus pot (true: hugging a pot of butter) and tail
//   celMatki(c, x, y, s, o)      a clay pot, its base at (x, y): o.empty (no butter), o.tilt
//   celHeart(c, x, y, r, o)      a pink heart (o.rot, o.a); celSparkle(c, x, y, r, o) a four-point twinkle;
//   celSweat(c, x, y, k)         a sweat drop; celMark(c, x, y, k, '!' | '?' | '!?')
//   celPuff(c, x, y, r, a)       a little cloud of dust (a hop landing)
//
// A kid's pose (px at s = 1; x to screen right, y down; "L" is screen left, the kid's right):
//   hip [x, y]      the pelvis from the ground point between the feet (standing: [0, -112]); hop (px: the whole kid
//                   rises, feet too); lean (radians, + to screen right); head (the head's tilt on top); squash
//   hL, hR [x, y]   the hands, in the upper body's frame (origin the pelvis; shoulders at [±64, -134]); eL, eR: which
//                   way each elbow bends; fL, fR the feet ([±44, 0] standing); kL, kR the knees
//   handL, handR    'open' | 'fist' | 'point' (the forearm's direction) | 'butter' (a blob of butter on the palm)
//   eyes            'open' | 'happy' (^ ^) | 'closed' (smug ‿ ‿) | 'squeeze' (> <) | 'wide' (shock) | 'sparkle' |
//                   'puppy' (huge, glossy, "who, ME?"); or [screen left, screen right]
//   look [x, y]     -1..1, where the eyes look; lid 0..1 the upper lids down (deadpan); brow (-1..1 lower / raise);
//   tilt            -1 cross .. 1 worried (the brows' inner ends); browR: a different raise for the screen-right brow
//   mouth           'smile' | 'cat' (:3) | 'grin' | 'open' | 'o' | 'flat' | 'pout' | 'smug' | 'wobble' | 'frown' | 'wail'
//   talk            1: the mouth flaps (a new shape every two drawings) over the pose's mouth
//   blush           0..1 extra; sweat 0..1 (a drop by the temple); butter 0..1 (Kanha: butter smeared on his face)

// ---------- acting ----------
function celKeys(t, keys, o = {}) {
  const tr0 = o.tr ?? .22, td = celHold(t, o.fps);
  if (!keys._full) { let acc = {}; keys._full = keys.map(([kt, p]) => [kt, acc = { ...acc, ...p }]); }
  const F = keys._full; let k = 0;
  for (let i = 0; i < F.length; i++) if (td >= F[i][0] - (F[i][1].tr ?? tr0)) k = i;
  const [tk, B] = F[k], A = F[Math.max(0, k - 1)][1], tr = B.tr ?? tr0;
  const P = k === 0 ? celMix(B, B, 1) : celMix(A, B, backOut(seg(td, tk - tr, tk + .04), B.over ?? 1.4));
  P.lag = k === 0 ? P : celMix(A, B, backOut(seg(td, tk - tr + .1, tk + .14), 2));
  return Object.assign(P, { land: k === 0 ? 9 : td - tk, prev: A, next: B, slot: k, td });
}

// ---------- palettes ----------
const CEL_KANHA = {
  skin: '#5B8FE0', sh: '#3F6DC4', lt: '#92BCF8', hair: '#1C1A30', hairLt: '#4A4A80', iris: '#15163A', iris2: '#3A6ED0',
  pit: '#F7C744', pitSh: '#DA9A22', pitLt: '#FFE48E', border: '#E04A36', gold: '#F2B52E', pearl: '#FFF8EC',
  feather: '#3FA45E', featherLt: '#8FD07A', fEye1: '#EDBB3A', fEye2: '#1FA39A', fEye3: '#22407E', tilak: '#FFF8EA', red: '#E2452B',
  flute: '#C98E4A', fluteSh: '#91592A', blush: '#F68BC0', mouth: '#6A1E3A', tongue: '#F27C90', butter: '#FFEFAE', butterSh: '#EBC860',
  mala: ['#FFF6E8', '#E2452B', '#F2B52E', '#F68BC0'],
};
const CEL_RADHA = {
  skin: '#F9CFA8', sh: '#EDA982', lt: '#FFE9D4', hair: '#21182A', hairLt: '#55406A', iris: '#24141E', iris2: '#9A5236',
  lehenga: '#F0507E', lehSh: '#C2335F', lehLt: '#FF8CAC', choli: '#F7C23E', choliSh: '#DC9A22', choliLt: '#FFE38E',
  odhni: '#5CCAB6', odhniSh: '#2E9A8C', odhniLt: '#A4EADA', gold: '#F2B52E', red: '#E2343E', blush: '#FF8AA6',
  mouth: '#7A1E36', tongue: '#F27C90', flower: '#FFFDF4', rose: '#F2578A', roseSh: '#C23466', leaf: '#4FA25A', pearl: '#FFF8EC',
  butter: '#FFEFAE', butterSh: '#EBC860',
};

// ---------- the face (shared) ----------
// in head coordinates (the face's centre at 0, 0; about ±172 wide, -166 .. +148 tall)
const CEL_FACE = { ex: 66, ey: 18, my: 92, bx: 112, by: 72, k: 1 };
function celEye(c, ex, ey, kind, P, C, sd, k = 1, lashes = false) {
  const look = P.look || [0, 0], lid = clamp(P.lid || 0);
  if (kind === 'happy') { celLine(c, [[ex - 26 * k, ey + 8 * k], [ex, ey - 16 * k], [ex + 26 * k, ey + 8 * k]], 7.5 * k, { taper: .35 }); return; }
  if (kind === 'closed') {
    celLine(c, [[ex - 27 * k, ey - 2 * k], [ex, ey + 12 * k], [ex + 27 * k, ey - 2 * k]], 7 * k, { taper: .35 });
    if (lashes) celLine(c, [[ex + sd * 25 * k, ey], [ex + sd * 38 * k, ey - 8 * k]], 4 * k);
    return;
  }
  if (kind === 'squeeze') { celLine(c, [[ex + sd * 22 * k, ey - 18 * k], [ex - sd * 20 * k, ey], [ex + sd * 22 * k, ey + 18 * k]], 7.5 * k, { taper: .3 }); return; }
  const ox = look[0] * 7 * k, oy = look[1] * 6 * k;
  if (kind === 'wide') {
    celOval(c, ex, ey, 30 * k, 38 * k, '#FFFFFF', { w: 4.5 * k });
    ellipse(c, ex + ox * 1.6, ey + oy * 1.6, 9 * k, 12 * k, C.iris); ellipse(c, ex + ox * 1.6 - 3 * k, ey + oy * 1.6 - 4 * k, 3 * k, 3.5 * k, '#FFFFFF');
    return;
  }
  const pk = kind === 'puppy' ? 1.18 : 1, rx = 29 * k * pk, ry = 39 * k * pk, cx = ex + ox, cy = ey + oy;
  const ly = cy - ry + lid * 1.9 * ry * .55;
  let pts = celEll(cx, cy, rx, ry, 0, 36);
  if (lid > .02) pts = pts.map(([x, y]) => [x, Math.max(y, ly + (x - cx) * sd * (P.lidTilt || 0))]);
  celShape(c, pts, C.iris, { dense: true, w: 4.5 * k, boil: .5, over: (q) => {
    let g = q.createLinearGradient(0, cy - ry, 0, cy + ry); g.addColorStop(0, rgba(C.iris, 0)); g.addColorStop(.55, rgba(C.iris2, .15)); g.addColorStop(1, rgba(C.iris2, .95));
    q.fillStyle = g; q.fillRect(cx - rx - 4, cy - ry - 4, rx * 2 + 8, ry * 2 + 8);
    const hy = Math.max(cy - ry * .42, ly + 12 * k);
    if (kind === 'sparkle') {
      q.fillStyle = '#FFFFFF'; q.beginPath(); const sx = cx - 7 * k, sy = hy + 2 * k, r = 15 * k;
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU - Math.PI / 2, rr = i % 2 ? r * .32 : r; q.lineTo(sx + Math.cos(a) * rr, sy + Math.sin(a) * rr); }
      q.fill(); ellipse(q, cx + 11 * k, cy + 15 * k, 5 * k, 5 * k, '#FFFFFF'); ellipse(q, cx - 12 * k, cy + 18 * k, 3 * k, 3 * k, '#FFFFFF');
    } else {
      ellipse(q, cx - 8 * k, hy, 10.5 * k * pk, 12.5 * k * pk, '#FFFFFF', -.3);
      ellipse(q, cx + 10 * k, cy + 15 * k, 5 * k * pk, 5 * k * pk, '#FFFFFF');
      if (kind === 'puppy') {
        ellipse(q, cx + 9 * k, hy - 6 * k, 5 * k, 6 * k, '#FFFFFF'); ellipse(q, cx - 13 * k, cy + 12 * k, 3.5 * k, 3.5 * k, '#FFFFFF');
        q.globalAlpha = .5; ellipse(q, cx, cy + ry * .78, rx * .8, ry * .2, '#BFE4FF'); q.globalAlpha = 1;
      }
    }
  } });
  // the lash line (kajal): a thick top edge, or the lid's straight edge
  if (lid > .02) celLine(c, [[cx - rx - 5 * k, ly - (rx + 5 * k) * sd * (P.lidTilt || 0) + 1], [cx + rx + 5 * k, ly + (rx + 5 * k) * sd * (P.lidTilt || 0) + 1]], 7.5 * k, { taper: .2 });
  else { const arc = []; for (let i = 0; i <= 8; i++) { const a = Math.PI * (1.12 + .76 * i / 8); arc.push([cx + Math.cos(a) * (rx + 1), cy + Math.sin(a) * (ry + 1)]); } celLine(c, arc, 7.5 * k, { taper: .25 }); }
  if (lashes) { const a = sd > 0 ? -.5 : Math.PI + .5, bx = cx + Math.cos(a) * rx, by = (lid > .02 ? ly : cy + Math.sin(a) * ry); celLine(c, [[bx, by], [bx + sd * 13 * k, by - 9 * k]], 4.5 * k); celLine(c, [[bx - sd * 4 * k, by - 4 * k], [bx + sd * 6 * k, by - 16 * k]], 4 * k); }
}
function celMouth(c, m, C, y = 92, k = 1) {
  const M = (P) => P.map(([a, b]) => [a * k, y + (b - 92) * k]), tongue = (q, ty, rx) => { q.fillStyle = C.tongue; q.beginPath(); q.ellipse(0, y + (ty - 92) * k, rx * k, 9 * k, 0, 0, TAU); q.fill(); };
  if (m === 'smile') celLine(c, M([[-20, 88], [0, 99], [20, 88]]), 5.5 * k);
  else if (m === 'cat') { celLine(c, M([[-24, 88], [-12, 99], [0, 90]]), 5 * k, { taper: .4 }); celLine(c, M([[0, 90], [12, 99], [24, 88]]), 5 * k, { taper: .4 }); }
  else if (m === 'grin') celShape(c, M([[-30, 84], [30, 84], [22, 104], [0, 114], [-22, 104]]), C.mouth, { n: 3, w: 4.5 * k, over: q => tongue(q, 112, 15) });
  else if (m === 'open') celOval(c, 0, y + 4 * k, 15 * k, 17 * k, C.mouth, { w: 4.5 * k, over: q => tongue(q, 106, 11) });
  else if (m === 'o') celOval(c, 0, y + 4 * k, 9 * k, 11 * k, C.mouth, { w: 4 * k });
  else if (m === 'flat') celLine(c, M([[-16, 94], [0, 95], [16, 94]]), 5 * k);
  else if (m === 'pout') { celLine(c, M([[-15, 100], [0, 91], [15, 100]]), 5 * k); }
  else if (m === 'smug') celLine(c, M([[-18, 95], [4, 98], [24, 85]]), 5.5 * k);
  else if (m === 'wobble') celLine(c, M([[-26, 96], [-13, 89], [0, 96], [13, 89], [26, 96]]), 4.5 * k, { taper: .3 });
  else if (m === 'frown') celLine(c, M([[-20, 100], [0, 90], [20, 100]]), 5.5 * k);
  else if (m === 'wail') celShape(c, M([[-34, 82], [34, 82], [28, 120], [0, 128], [-28, 120]]), C.mouth, { n: 3, w: 4.5 * k, over: q => tongue(q, 122, 18) });
}
function celFace(c, P, C, o = {}) {
  const F = { ...CEL_FACE, ...(o.face || {}) }, k = F.k, ev = Array.isArray(P.eyes) ? P.eyes : [P.eyes || 'open', P.eyes || 'open'];
  // the blush first (under the eyes' lower edge)
  const bk = clamp((P.blush || 0)), ba = .5 + .4 * bk;
  for (const sd of [-1, 1]) {
    c.save(); c.globalAlpha = ba; ellipse(c, sd * F.bx * k, F.by * k + F.ey * 0, (30 + 10 * bk) * k, (14 + 5 * bk) * k, C.blush); c.restore();
    for (let i = 0; i < 3; i++) celLine(c, [[sd * F.bx * k + (-14 + i * 12) * k, (F.by + 9) * k], [sd * F.bx * k + (-7 + i * 12) * k, (F.by - 7) * k]], 2.8 * k, { boil: .4, col: rgba(CEL.ink, .55) });
  }
  [-1, 1].forEach((sd, i) => celEye(c, sd * F.ex * k, F.ey * k, ev[i], P, C, sd, k, o.lashes));
  // brows
  for (const sd of [-1, 1]) {
    const raise = (sd > 0 && P.browR != null ? P.browR : P.brow || 0), tl = P.tilt || 0, by = (F.ey - 60 - raise * 14) * k, bx = sd * F.ex * k;
    celLine(c, [[bx - sd * 18 * k, by - tl * 9 * k], [bx + sd * 18 * k, by + tl * 9 * k]], 5.5 * k, { taper: .5 });
  }
  celLine(c, [[-3 * k, (F.my - 36) * k], [4 * k, (F.my - 32) * k]], 3.5 * k);   // the nose
  let m = P.mouth || 'smile';
  if ((P.talk || 0) > .5) { const r = hash(Math.floor(CEL.d / 2) * 1.71 + (o.seed || 0)); m = r < .42 ? 'open' : r < .68 ? 'o' : m === 'open' ? 'smile' : m; }
  celMouth(c, m, C, F.my * k, k);
}
// a sweat drop, a heart, a sparkle, an ink mark: the little things that make it cute
function celSweat(c, x, y, k = 1) {
  if (k <= .02) return;
  c.save(); c.translate(x, y); c.scale(k, k);
  celShape(c, [[0, -34], [14, -6], [16, 10], [0, 22], [-16, 10], [-14, -6]], '#A6DCFF', { n: 5, w: 4, boil: .4, over: q => ellipse(q, -6, 4, 4, 7, '#FFFFFF', -.3) });
  c.restore();
}
function celHeart(c, x, y, r, o = {}) {
  if (r <= 1 || (o.a ?? 1) <= .02) return;
  c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.globalAlpha *= (o.a ?? 1);
  const P = []; for (let i = 0; i < 28; i++) { const t = i / 28 * TAU; P.push([16 * Math.pow(Math.sin(t), 3) * r / 16, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * r / 16]); }
  celShape(c, P, o.col || '#FF6F9E', { dense: true, w: Math.max(2.5, r * .1), boil: .4, shade: [o.sh || '#E84A82', r * .12, r * .16], over: q => ellipse(q, -r * .42, -r * .3, r * .2, r * .13, 'rgba(255,255,255,.9)', -.6) });
  c.restore();
}
function celSparkle(c, x, y, r, o = {}) {
  if (r <= 1 || (o.a ?? 1) <= .02) return;
  c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.globalAlpha *= (o.a ?? 1);
  const P = []; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU - Math.PI / 2, rr = i % 2 ? r * .26 : r; P.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
  celShape(c, P, o.col || '#FFD95A', { dense: true, w: Math.max(2, r * .09), boil: .3, over: q => ellipse(q, 0, 0, r * .18, r * .18, '#FFFFFF') });
  c.restore();
}
function celMark(c, x, y, k = 1, kind = '!') {
  if (k <= .02) return;
  c.save(); c.translate(x, y); c.scale(k, k);
  const bang = dx => { celShape(c, [[dx - 10, -60], [dx + 10, -60], [dx + 5, -10], [dx - 5, -10]], CEL.ink, { n: 2, w: 3 }); celOval(c, dx, 10, 8, 8, CEL.ink, { w: 3 }); };
  if (kind === '!') bang(0);
  else if (kind === '?') { celLine(c, [[-18, -40], [-10, -58], [10, -60], [20, -44], [8, -26], [0, -14], [0, -4]], 11, { taper: .1 }); celOval(c, 0, 14, 8, 8, CEL.ink, { w: 3 }); }
  else { celLine(c, [[-36, -40], [-28, -58], [-8, -60], [2, -44], [-10, -26], [-18, -14], [-18, -4]], 10, { taper: .1 }); celOval(c, -18, 14, 7, 7, CEL.ink, { w: 3 }); bang(18); }
  c.restore();
}
function celPuff(c, x, y, r, a = 1) {
  if (a <= .02) return;
  c.save(); c.globalAlpha *= a;
  for (const [dx, dy, k] of [[-1, 0, .7], [-.45, -.35, .9], [.15, -.45, 1], [.7, -.2, .8], [1.05, .05, .6]]) celOval(c, x + dx * r, y + dy * r * .6, r * .42 * k, r * .34 * k, '#FFFFFF', { w: 3, boil: .4 });
  c.restore();
}

// ---------- a clay pot of butter ----------
function celMatki(c, x, y, s = 1, o = {}) {
  c.save(); c.translate(x, y); c.rotate(o.tilt || 0); c.scale(s, s);
  celShape(c, [[-56, -8], [-70, -50], [-60, -92], [-34, -112], [34, -112], [60, -92], [70, -50], [56, -8], [0, 2]], '#CC6B3A', { shade: ['#9C4A26', 10, 8], lt: ['#EC9564', 5, 5] });
  celLine(c, [[-66, -62], [-33, -54], [0, -51], [33, -54], [66, -62]], 9, { under: '#F4E6CC', taper: 0 });
  for (let i = 0; i < 6; i++) { const u = -50 + i * 20; celLine(c, [[u, -44], [u + 10, -34], [u + 20, -44]], 3, { col: '#F4E6CC', boil: .4 }); }
  celOval(c, 0, -114, 40, 12, '#B85A30', { w: 4.5 });
  if (!o.empty) celShape(c, [[-38, -114], [-32, -136], [-12, -154], [12, -150], [32, -134], [40, -114], [0, -106]], '#FFF5D2', { n: 4, w: 4.5, shade: ['#F2DA8C', 6, 6], over: q => ellipse(q, -12, -136, 9, 6, '#FFFFFF', -.4) });
  else ellipse(c, 0, -114, 30, 7, '#5A2A16');
  c.restore();
}

// a blob of butter (on a palm, on a face): r its size
function celButter(c, x, y, r, C, seed = 0) {
  const P = []; for (let i = 0; i < 7; i++) { const a = i / 7 * TAU, rr = r * (.86 + .2 * hash(i + seed * 13)); P.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * .8]); }
  celShape(c, P, C.butter, { n: 6, w: 3.2, boil: .5, shade: [C.butterSh, r * .2, r * .2], over: q => ellipse(q, x - r * .3, y - r * .25, r * .26, r * .17, '#FFFFFF', -.4) });
}

// ---------- the kids ----------
function celKanha(c, x, y, s, P, o = {}) { return celKid(c, x, y, s, P, o, 'kanha'); }
function celRadha(c, x, y, s, P, o = {}) { return celKid(c, x, y, s, P, o, 'radha'); }
function celKid(c, x, y, s, P, o, who) {
  const R = who === 'radha', C = { ...(R ? CEL_RADHA : CEL_KANHA), ...(o.pal || {}) }, A = {}, td = P.td ?? o.t ?? 0;
  const sh = col => [col, 7, 9], lt = col => [col, 4, 5], skin = { shade: sh(C.sh), lt: lt(C.lt) };
  celBegin(td); CEL.n = o.seed ?? (R ? 500 : 0);
  c.save(); c.translate(x, y); c.scale(s, s);
  const land = P.land ?? 9, hit = land >= 0 ? Math.exp(-land * 10) : 0, br = Math.sin(td * TAU / 2.6 + (R ? 1.3 : 0)), hop = P.hop || 0;
  const hip = [P.hip[0], P.hip[1] + hit * 9 + br * 1.8 - hop], lean = P.lean || 0, cs = Math.cos(lean), sn = Math.sin(lean);
  const Wp = ([px, py]) => [hip[0] + px * cs - py * sn, hip[1] + px * sn + py * cs];
  const sq = clamp((P.squash || 0) + hit * .35 + br * .015, -1, 1), sx = 1 + sq * .07, sy = 1 - sq * .08;
  const NECK = [0, -150], HC = [0, -138], lag = P.lag || P;
  const at = (px, py) => { const p = c.getTransform().transformPoint(new DOMPoint(px, py)); return [p.x, p.y]; };
  const sheen = (x0, y0, rx, ry) => q => { const g = q.createRadialGradient(x0, y0, 0, x0, y0, rx); g.addColorStop(0, rgba(C.hairLt, .85)); g.addColorStop(1, rgba(C.hairLt, 0)); q.save(); q.translate(x0, y0); q.scale(1, ry / rx); q.translate(-x0, -y0); q.fillStyle = g; q.fillRect(x0 - rx, y0 - rx, rx * 2, rx * 2); q.restore(); };

  // the hair behind, a drawing late
  c.save(); c.translate(hip[0], hip[1]); c.rotate(lag.lean || 0); c.translate(...NECK); c.rotate((lag.head || 0) * .85); c.scale(sx, sy); c.translate(...HC);
  if (R) {
    celShape(c, [[-150, -150], [0, -198], [150, -150], [196, -30], [188, 90], [150, 170], [100, 214], [0, 200], [-100, 214], [-150, 170], [-188, 90], [-196, -30]], C.hair, { over: sheen(-70, -120, 150, 90) });
    // the plait behind her left shoulder (screen right), swinging, a red tassel at its end
    const sw = Math.sin(td * 2.3) * 9 - (lag.lean || 0) * 90 - (lag.head || 0) * 60;
    const pl = [[128, 100], [168, 180], [164 + sw * .6, 250], [154 + sw, 304]];
    celShape(c, celTube(pl, [66, 58, 50, 40]), C.hair, { dense: true, lt: [C.hairLt, -4, 6] });
    const Q = through(pl, 6);
    for (let i = 3; i < Q.length - 2; i += 3) { const d = v2.norm(v2.sub(Q[i + 1], Q[i - 1])), q = v2.perp(d), w = 26 - i * .6; celLine(c, [v2.add(Q[i], v2.mul(q, w)), v2.add(Q[i], v2.mul(d, 9)), v2.add(Q[i], v2.mul(q, -w))], 3.2, { col: rgba(C.hairLt, .9), boil: .4 }); }
    const e = Q[Q.length - 1];
    celOval(c, e[0], e[1] + 8, 14, 12, C.gold, { w: 3.5 });
    celShape(c, [[e[0] - 12, e[1] + 14], [e[0] + 12, e[1] + 14], [e[0] + 18 + sw * .3, e[1] + 66], [e[0] + sw * .3, e[1] + 74], [e[0] - 16 + sw * .3, e[1] + 64]], C.red, { n: 3, w: 4, shade: ['#B0222C', 5, 4] });
  } else {
    const pts = []; for (let i = 0; i < 70; i++) { const a = i / 70 * TAU, kk = 1 + .07 * Math.abs(Math.sin(a * 7)); pts.push([Math.cos(a) * 190 * kk, 4 + Math.sin(a) * (Math.sin(a) > 0 ? 150 : 186) * kk]); }
    celShape(c, pts, C.hair, { dense: true, over: sheen(-70, -110, 160, 100) });
  }
  c.restore();

  // the legs and feet (Radha's only peep out under her lehenga)
  const legs = [-1, 1].map(sd => {
    const f0 = (sd < 0 ? P.fL : P.fR) || [sd * 44, 0], f = [f0[0], f0[1] - hop], hj = Wp([sd * 30, -6]);
    const [knee, ank] = celIK(hj, [f[0], f[1] - 16], 56, 56, (sd < 0 ? P.kL : P.kR) || [sd, -.3]);
    return { sd, hj, knee, ank, f };
  });
  const foot = L => { const d = v2.norm(v2.sub(L.ank, L.knee)); celOval(c, L.ank[0] + L.sd * 8 + d[0] * 9, L.ank[1] + d[1] * 9 + 3, 34, 17, C.skin, { ...skin, rot: Math.atan2(d[1], d[0]) - Math.PI / 2 }); };
  for (const L of legs) {
    if (R) { celShape(c, celTube([v2.lerp(L.knee, L.ank, .3), L.ank], [42, 40]), C.skin, { dense: true, ...skin }); foot(L); celBand(c, L.knee, L.ank, .86, 44, 9, C.gold); }
    else { celShape(c, celTube([L.hj, L.knee, L.ank], [64, 54, 46]), C.skin, { dense: true, ...skin }); foot(L); celBand(c, L.knee, L.ank, .84, 50, 10, C.gold); }
  }
  A.feet = legs.map(L => at(...L.f));

  if (!R) {
    // the pitambar: waist to above the knees, following the legs, a red border at the hem, the front pleats
    const hem = L => { const tp = v2.lerp(L.hj, L.knee, .78), d = v2.norm(v2.sub(L.knee, L.hj)); let q = v2.perp(d); if (q[0] * L.sd < 0) q = v2.mul(q, -1); return [v2.add(tp, v2.mul(q, 40)), v2.add(tp, v2.mul(q, -30))]; };
    const [oL, iL] = hem(legs[0]), [oR, iR] = hem(legs[1]), cr = Wp([0, 16]);
    const edge = q => { q.strokeStyle = C.border; q.lineWidth = 20; q.lineJoin = 'round'; q.beginPath(); [oL, iL, cr, iR, oR].forEach((p, i) => i ? q.lineTo(...p) : q.moveTo(...p)); q.stroke(); };
    celShape(c, [Wp([-70, -44]), Wp([-82, 0]), oL, iL, cr, iR, oR, Wp([82, 0]), Wp([70, -44])], C.pit, { n: 4, shade: sh(C.pitSh), lt: lt(C.pitLt), over: edge });
    celLine(c, [Wp([-52, -24]), v2.lerp(Wp([-52, -24]), oL, .6)], 3.2);
    celShape(c, [Wp([-28, -40]), Wp([28, -40]), Wp([32, 38]), Wp([0, 52]), Wp([-32, 38])], C.pit, { n: 4, shade: sh(C.pitSh), lt: lt(C.pitLt), over: q => { q.strokeStyle = C.border; q.lineWidth = 16; q.beginPath(); q.moveTo(...Wp([-34, 34])); q.lineTo(...Wp([0, 50])); q.lineTo(...Wp([34, 34])); q.stroke(); } });
    celLine(c, [Wp([-6, -26]), Wp([-10, 40])], 3);
  }

  // the upper body
  c.save(); c.translate(hip[0], hip[1]); c.rotate(lean);
  if (R) {
    celShape(c, [[-54, -26], [-60, -84], [-60, -128], [-38, -150], [0, -154], [38, -150], [60, -128], [60, -84], [54, -26], [0, -18]], C.choli, { shade: sh(C.choliSh), lt: lt(C.choliLt) });
    celLine(c, [[-56, -36], [0, -28], [56, -36]], 12, { under: C.gold, taper: 0 });
  } else {
    celShape(c, [[-64, -24], [-74, -80], [-68, -128], [-42, -150], [0, -156], [42, -150], [68, -128], [74, -80], [64, -24], [0, -12]], C.skin, skin);
    celLine(c, [[-5, -62], [0, -56], [5, -62]], 3);   // the tummy button
  }
  c.restore();

  if (R) {
    // the lehenga: a bell from the waist to the ankles, its hem swinging, a gold border and gold dots
    const fx0 = Math.min(legs[0].f[0], legs[1].f[0]), fx1 = Math.max(legs[0].f[0], legs[1].f[0]), hy = -12 - hop;
    const sw = Math.sin(td * 2.6) * 4 - (lag.lean || 0) * 70, hl = fx0 - 76 + sw, hr = fx1 + 76 + sw;
    const H = []; for (let i = 0; i <= 8; i++) H.push([lerp(hl, hr, i / 8), hy + (i % 2 ? 7 : -3) + Math.sin(i / 8 * Math.PI) * 6]);
    const border = q => {
      q.strokeStyle = C.gold; q.lineWidth = 34; q.lineJoin = 'round'; q.beginPath(); H.forEach((p, i) => i ? q.lineTo(...p) : q.moveTo(...p)); q.stroke();
      q.strokeStyle = C.red; q.lineWidth = 5; q.beginPath(); H.forEach((p, i) => i ? q.lineTo(p[0], p[1] - 19) : q.moveTo(p[0], p[1] - 19)); q.stroke();
      for (let i = 0; i < 9; i++) { const u = (i + .5) / 9, yy = lerp(-40, hy - 30, (i % 3) / 3 + .2); ellipse(q, lerp(lerp(Wp([-50, 0])[0], hl, .7), lerp(Wp([50, 0])[0], hr, .7), u), yy, 5, 5, C.gold); }
    };
    celShape(c, [Wp([-58, -40]), Wp([-66, -8]), [hl + 6, hy - 14], ...H, [hr - 6, hy - 14], Wp([66, -8]), Wp([58, -40])], C.lehenga, { n: 3, shade: sh(C.lehSh), lt: lt(C.lehLt), over: border });
    for (const k of [-.5, 0, .5]) celLine(c, [Wp([k * 60, -30]), [lerp(hl, hr, .5 + k * .62), hy - 26]], 3, { col: rgba(CEL.ink, .7) });
    celLine(c, [Wp([-60, -40]), Wp([0, -34]), Wp([60, -40])], 16, { under: C.red, taper: 0 });
  } else {
    // the kardhani with little bells, and the flute tucked in at the waist
    c.save(); c.translate(hip[0], hip[1]); c.rotate(lean);
    celLine(c, [[-72, -40], [0, -30], [72, -40]], 15, { under: C.gold, taper: 0 });
    for (let i = 0; i < 5; i++) { const u = -52 + i * 26; celOval(c, u, -24 + Math.abs(u) * -.1, 6.5, 7, C.gold, { w: 2.4, boil: .3 }); }
    celShape(c, celTube([[-94, -78], [40, -24]], [17, 17]), C.flute, { dense: true, w: 4, shade: [C.fluteSh, 0, 5] });
    for (const u of [.42, .54, .66, .78]) { const p = v2.lerp([-94, -78], [40, -24], u); ellipse(c, p[0], p[1] - 2, 3, 3, '#3A2414'); }
    celBand(c, [-94, -78], [40, -24], .12, 22, 6, C.red); celBand(c, [-94, -78], [40, -24], .9, 22, 6, C.red);
    c.restore();
  }

  c.save(); c.translate(hip[0], hip[1]); c.rotate(lean);
  if (R) {
    // the odhni across her, from her left shoulder to her right hip, its end falling
    const sw = Math.sin(td * 2.1 + 1) * 7 - (lag.lean || 0) * 80;
    const od = [[56, -148], [14, -104], [-42, -58], [-74, -20], [-92 + sw * .5, 30], [-98 + sw, 72]];
    celShape(c, celTube(od, [34, 36, 38, 40, 42, 40]), C.odhni, { dense: true, shade: sh(C.odhniSh), lt: lt(C.odhniLt) });
    const Q = through(od, 4); for (let i = 1; i < Q.length - 1; i += 2) ellipse(c, Q[i][0], Q[i][1], 3.6, 3.6, C.gold);
  } else {
    // the vaijayanti mala
    for (let i = 0; i <= 12; i++) { const a = Math.PI * i / 12; celOval(c, -50 * Math.cos(a), -150 + 96 * Math.sin(a), 9.5, 9.5, C.mala[i % 4], { w: 2.4, boil: .3 }); }
  }

  // the head
  c.save(); c.translate(...NECK); c.rotate(P.head || 0); c.scale(sx, sy); c.translate(...HC);
  if (!R) for (const sd of [-1, 1]) { celOval(c, sd * 166, 26, 24, 32, C.skin, skin); celLine(c, [[sd * 170, 12], [sd * 162, 28], [sd * 170, 42]], 3); }
  celShape(c, [[-150, -128], [-80, -160], [0, -166], [80, -160], [150, -128], [172, -30], [168, 50], [142, 112], [72, 142], [0, 148], [-72, 142], [-142, 112], [-168, 50], [-172, -30]], C.skin, {
    shade: [C.sh, 10, 12], lt: [C.lt, 6, 6],
    over: q => { const g = q.createRadialGradient(-30, 30, 0, -30, 30, 200); g.addColorStop(0, 'rgba(255,255,255,.22)'); g.addColorStop(1, 'rgba(255,255,255,0)'); q.fillStyle = g; q.fillRect(-200, -200, 400, 400); },
  });
  A.head = at(0, 0); A.mouth = at(0, 92); A.cheekL = at(-112, 72); A.cheekR = at(112, 72);
  if (R) {
    // the hair: a centre parting, two soft sides over her ears; the maang tikka, flowers, jhumkas
    for (const sd of [-1, 1]) {
      celShape(c, [[sd * 4, -178], [sd * 80, -180], [sd * 150, -142], [sd * 186, -60], [sd * 188, 30], [sd * 176, 96], [sd * 152, 70], [sd * 148, 0], [sd * 132, -70], [sd * 92, -116], [sd * 38, -134], [sd * 4, -140]], C.hair, { over: sheen(sd * 90, -150, 70, 26) });
      celLine(c, [[sd * 156, 96], [sd * 156, 114]], 3, { boil: .3 });
      celShape(c, [[sd * 156 - 13, 114], [sd * 156 + 13, 114], [sd * 156 + 20, 140], [sd * 156 - 20, 140]], C.gold, { n: 2, w: 3.5, boil: .4 });
      for (let i = 0; i < 3; i++) ellipse(c, sd * 156 - 12 + i * 12, 146, 3.4, 3.4, C.gold);
    }
    celLine(c, [[0, -186], [0, -142]], 6, { col: C.sh, taper: .2, boil: .4 });
    celLine(c, [[0, -184], [0, -120]], 3, { col: '#B88A1C', taper: 0, boil: .3 });
    celShape(c, [[0, -122], [12, -108], [0, -92], [-12, -108]], C.gold, { n: 3, w: 3.5, boil: .3, over: q => ellipse(q, 0, -107, 4.5, 5, C.red) });
    celOval(c, 0, -82, 4.5, 5, C.pearl, { w: 2.2, boil: .2 });
    for (const [fx, fy, r] of [[-128, -150, 14], [-152, -126, 13], [-110, -172, 12]]) {
      for (let i = 0; i < 5; i++) { const a = i / 5 * TAU - Math.PI / 2; celOval(c, fx + Math.cos(a) * r * .55, fy + Math.sin(a) * r * .55, r * .5, r * .5, C.flower, { w: 2.2, boil: .25 }); }
      ellipse(c, fx, fy, r * .26, r * .26, C.gold);
    }
    celOval(c, -168, -96, 21, 19, C.rose, { w: 3, shade: [C.roseSh, 4, 5], over: q => { q.strokeStyle = C.roseSh; q.lineWidth = 3; q.beginPath(); q.arc(-168, -96, 9, 0, 5); q.stroke(); } });
    celShape(c, [[-150, -84], [-128, -72], [-146, -66]], C.leaf, { n: 2, w: 2.5, boil: .3 });
    ellipse(c, 0, -60, 6, 7, C.red);   // the bindi
  } else {
    // the curls over his forehead, parted in the middle for the tilak; locks by his cheeks
    celShape(c, [[-182, 10], [-180, -72], [-142, -150], [-72, -188], [0, -194], [72, -188], [142, -150], [180, -72], [182, 10], [162, -6], [152, -58], [122, -72], [104, -112], [62, -104], [38, -142], [0, -150], [-38, -142], [-62, -104], [-104, -112], [-122, -72], [-152, -58], [-162, -6]], C.hair, { over: sheen(-80, -160, 90, 34) });
    for (const [cx, cy] of [[-120, -132], [-60, -160], [70, -158], [128, -126]]) celLine(c, [[cx - 14, cy + 6], [cx - 6, cy - 8], [cx + 8, cy - 6], [cx + 6, cy + 6]], 3, { col: rgba(C.hairLt, .9), boil: .4 });
    for (const sd of [-1, 1]) celShape(c, celTube([[sd * 166, -6], [sd * 192, 46], [sd * 182, 96], [sd * 160, 108]], [40, 34, 24, 12]), C.hair, { dense: true, lt: [C.hairLt, -3, 4] });
    for (const sd of [-1, 1]) { celOval(c, sd * 174, 64, 14, 14, C.gold, { w: 3, boil: .3, over: q => ellipse(q, sd * 174, 64, 5, 5, C.red) }); }
    // the tilak: a white U and the red line in it
    celLine(c, [[-15, -122], [-12, -78], [0, -62], [12, -78], [15, -122]], 11, { under: C.tilak, taper: .25, boil: .4 });
    celLine(c, [[0, -114], [0, -82]], 5, { col: C.red, taper: .3, boil: .3 });
    // the feather (behind the bun), then the topknot with its pearls
    const fw = Math.sin(td * 2) * .05 + (lag.head || 0) * .4 - (P.head || 0) * .3 + (lag.lean || 0) * .5 - lean * .4;
    c.save(); c.translate(26, -214); c.rotate(.38 + fw);
    celShape(c, [[0, 6], [-20, -60], [-30, -130], [-16, -196], [0, -214], [16, -196], [30, -130], [20, -60]], C.feather, { w: 4, shade: ['#2A7444', 6, 4], over: q => {
      q.strokeStyle = rgba(C.featherLt, .9); q.lineWidth = 2.5; for (let i = 0; i < 9; i++) { const yy = -30 - i * 18; q.beginPath(); q.moveTo(0, yy); q.lineTo(-22, yy - 14); q.moveTo(0, yy); q.lineTo(22, yy - 14); q.stroke(); }
      ellipse(q, 0, -158, 22, 28, C.fEye1); ellipse(q, 0, -156, 15, 20, C.fEye2); ellipse(q, 0, -152, 8, 11, C.fEye3);
    } });
    celLine(c, [[0, 4], [0, -150]], 3, { col: '#1E5A34', taper: .3, boil: .4 });
    c.restore();
    celOval(c, 0, -200, 64, 46, C.hair, { over: sheen(-20, -220, 50, 24) });
    for (let i = 0; i < 9; i++) { const u = -56 + i * 14; celOval(c, u, -172 - Math.sqrt(Math.max(0, 1 - (u / 64) ** 2)) * 6, 7.5, 7.5, C.pearl, { w: 2.2, boil: .25 }); }
  }
  A.top = at(0, R ? -200 : -250);
  celFace(c, P, C, { lashes: R, seed: R ? 7 : 0 });
  if (!R && (P.butter || 0) > .02) {
    const b = clamp(P.butter);
    celButter(c, -110, 52, 24 * b, C, 1); celButter(c, 40, 110, 21 * b, C, 2); celButter(c, 6, 54, 12 * b, C, 3); celButter(c, 104, 116, 15 * b, C, 4); celButter(c, -40, 134, 12 * b, C, 5); celButter(c, 120, -60, 16 * b, C, 6);
  }
  if ((P.sweat || 0) > .02) celSweat(c, -160, -60, clamp(P.sweat) * 1.4);
  c.restore();   // head

  // the arms, last (they reach across the face)
  for (const sd of [-1, 1]) {
    const S = [sd * 64, -134], T = (sd < 0 ? P.hL : P.hR) || [sd * 86, -36], [el, wr] = celIK(S, T, 50, 48, (sd < 0 ? P.eL : P.eR) || [sd, .5]);
    celShape(c, celTube([S, el, wr], [44, 38, 34]), C.skin, { dense: true, ...skin });
    if (R) { celBand(c, el, wr, .62, 36, 8, C.red); celBand(c, el, wr, .76, 36, 8, C.gold); } else celBand(c, el, wr, .74, 38, 10, C.gold);
    const d = v2.norm(v2.sub(wr, el)), q = v2.perp(d), hc = v2.add(wr, v2.mul(d, 14)), rot = Math.atan2(d[1], d[0]), kind = (sd < 0 ? P.handL : P.handR) || 'open';
    if (kind === 'point') {
      celShape(c, celTube([hc, v2.add(hc, v2.mul(d, 40))], [16, 13]), C.skin, { dense: true, w: 4 });
      celOval(c, hc[0], hc[1], 21, 19, C.skin, { ...skin, rot });
    } else if (kind === 'fist') celOval(c, hc[0], hc[1], 21, 19, C.skin, { ...skin, rot });
    else {
      const th = v2.add(v2.add(wr, v2.mul(d, 8)), v2.mul(q, 18 * (d[1] * sd > 0 ? -1 : 1) * sd));
      celOval(c, th[0], th[1], 11, 8, C.skin, { rot: rot - .6, w: 4 });
      celOval(c, hc[0] + d[0] * 4, hc[1] + d[1] * 4, 24, 18, C.skin, { ...skin, rot });
      if (kind === 'butter') celButter(c, hc[0] + d[0] * 6, hc[1] + d[1] * 6 - 18, 20, C, 9);
    }
    A[sd < 0 ? 'handL' : 'handR'] = at(...hc);
  }
  c.restore();   // upper body
  c.restore();
  return A;
}

// ---------- a little monkey ----------
const CEL_MONKEY = { fur: '#9A6438', furSh: '#734626', furLt: '#C08A58', face: '#F4CDA4', faceSh: '#E0A880', ear: '#F2A6A0', iris: '#1E1410', iris2: '#6A4024', blush: '#F68A9A', mouth: '#5A1E26', tongue: '#F27C90' };
function celMonkey(c, x, y, s, P, o = {}) {
  const C = { ...CEL_MONKEY, ...(o.pal || {}) }, td = P.td ?? o.t ?? 0, A = {};
  const fur = { shade: [C.furSh, 6, 8], lt: [C.furLt, 4, 4] };
  celBegin(td); CEL.n = o.seed ?? 900;
  const land = P.land ?? 9, hit = land >= 0 ? Math.exp(-land * 10) : 0, hop = P.hop || 0;
  c.save(); c.translate(x, y - hop); c.scale(s, s);
  c.save(); c.translate(0, -40); c.rotate(P.lean || 0); c.scale(1 + hit * .06, 1 - hit * .08); c.translate(0, 40 + hit * 6);
  const at = (px, py) => { const p = c.getTransform().transformPoint(new DOMPoint(px, py)); return [p.x, p.y]; };
  // the tail, curling up behind
  const ts = Math.sin(td * 2.4) * 12;
  celShape(c, celTube([[30, -46], [96, -60], [124 + ts * .3, -120], [104 + ts, -168], [76 + ts, -160], [80 + ts * .8, -136]], [26, 22, 20, 18, 14, 10]), C.fur, { dense: true, ...fur });
  // feet and legs
  for (const sd of [-1, 1]) { celShape(c, celTube([[sd * 26, -60], [sd * 32, -14]], [40, 34]), C.fur, { dense: true, ...fur }); celOval(c, sd * 38, -4, 28, 14, C.face, { w: 4, shade: [C.faceSh, 4, 4] }); }
  celShape(c, [[-50, -24], [-58, -90], [-40, -140], [0, -150], [40, -140], [58, -90], [50, -24], [0, -14]], C.fur, fur);
  celOval(c, 0, -76, 32, 42, C.face, { w: 4, shade: [C.faceSh, 4, 6] });
  // the head
  c.save(); c.translate(0, -150); c.rotate(P.head || 0); c.translate(0, -88);
  for (const sd of [-1, 1]) { celOval(c, sd * 104, -6, 34, 32, C.fur, fur); ellipse(c, sd * 104, -4, 19, 18, C.ear); }
  celShape(c, celEll(0, 0, 104, 96), C.fur, { dense: true, ...fur });
  celShape(c, [[-6, -98], [-22, -126], [0, -112], [14, -132], [16, -104]], C.fur, { n: 2, w: 4, boil: .5 });
  celShape(c, [[-84, -14], [-74, -58], [-38, -64], [0, -44], [38, -64], [74, -58], [84, -14], [74, 42], [0, 82], [-74, 42]], C.face, { shade: [C.faceSh, 5, 7] });
  celFace(c, P, C, { face: { ex: 38, ey: -10, my: 54, bx: 62, by: 30, k: .62 }, seed: 11 });
  for (const sd of [-1, 1]) ellipse(c, sd * 7, 26, 3.5, 4.5, CEL.ink);
  A.head = at(0, 0); A.top = at(0, -110);
  c.restore();
  if (P.pot) celMatki(c, 0, -26, .78, { empty: P.potEmpty });
  // arms
  for (const sd of [-1, 1]) {
    const S = [sd * 46, -124], T = (sd < 0 ? P.hL : P.hR) || (P.pot ? [sd * 46, -96] : [sd * 64, -44]), [el, wr] = celIK(S, T, 40, 40, (sd < 0 ? P.eL : P.eR) || [sd, .5]);
    celShape(c, celTube([S, el, wr], [30, 26, 24]), C.fur, { dense: true, ...fur });
    const d = v2.norm(v2.sub(wr, el)), hc = v2.add(wr, v2.mul(d, 10)), kind = (sd < 0 ? P.handL : P.handR) || 'open';
    if (kind === 'point') celShape(c, celTube([hc, v2.add(hc, v2.mul(d, 30))], [12, 10]), C.face, { dense: true, w: 3.5 });
    celOval(c, hc[0], hc[1], 16, 14, C.face, { w: 4, rot: Math.atan2(d[1], d[0]) });
    A[sd < 0 ? 'handL' : 'handR'] = at(...hc);
  }
  c.restore(); c.restore();
  return A;
}
