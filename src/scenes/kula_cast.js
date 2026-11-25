// kula_cast.js: the 2D silhouette cast of ad 115 (Parvatha Raja Kulam), drawn over the 3D frames and lit with cine.js's
// figure(c, draw, LIGHTS.*) (tint, edge, rim): the fishermen who carry and light the Maha Deepam, and the people of the
// Tiruvilaiyadal Puranam's net-casting episode (Parvati as the fishermen's chief's daughter, the chief, the young
// fisherman, the shark), a boat, a cast net, huts and palms on the shore.
// Units: centimetres. A figure's feet are at (0, 0), up is -y, it faces +x (flip with c.scale(-1, 1)). A man is ~170 tall.
// place2(p): where a world point lands, and how many px a metre is there (to scale a figure by distance).
function place2(p) { const v = p.isVector3 ? p : V3(...p), [x, y, z] = toScreen3(v), d = CAM3.position.distanceTo(v); return [x, y, (H / 2) / Math.tan(CAM3.fov * Math.PI / 360) / d, z]; }
const dir2 = (a) => [Math.sin(a), Math.cos(a)];   // a 0 = straight down, PI/2 = forward (+x), PI = up
// two-bone IK: from s, reach toward t with lengths l1, l2; bend = +1 bends the joint backward/down
function ik2(s, t, l1, l2, bend = 1) {
  let dx = t[0] - s[0], dy = t[1] - s[1], d = Math.hypot(dx, dy); const dd = clamp(d, 1, l1 + l2 - .01);
  const a = Math.atan2(dy, dx), c1 = clamp((l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd), -1, 1), b = a + bend * Math.acos(c1);
  const j = [s[0] + Math.cos(b) * l1, s[1] + Math.sin(b) * l1], e = [s[0] + Math.cos(a) * dd, s[1] + Math.sin(a) * dd];
  return [j, e];
}
const rot2 = (p, o, a) => { const c = Math.cos(a), s = Math.sin(a), x = p[0] - o[0], y = p[1] - o[1]; return [o[0] + x * c - y * s, o[1] + x * s + y * c]; };
const seg2 = (c, a, b, w) => { c.lineWidth = w; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); };
const poly2 = (c, P) => { c.beginPath(); c.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) c.lineTo(P[i][0], P[i][1]); c.closePath(); c.fill(); };

// ---------- a man: bare chest, a veshti to the knee, a cloth round the head ----------
// o: pose 'stand' | 'walk' | 'carry' (a pole on the shoulder, hand on it) | 'torch' | 'vow' (arm up) | 'cast' (k: 0 wind-up
//    → 1 thrown) | 'pull' (hauling, leaning back) | 'pour' (a tin tipped forward) | 'pray' (palms joined) | 'fold' (arms
//    crossed); ph (the walk's phase), climb (0..1, knees lifted more), lean (radians forward), col, cloth (head cloth,
//    default true), turban (bigger, for the chief), staff (the chief's), beard, h (scale), out (gets hand/torch points)
function man2(c, o = {}) {
  const col = o.col || '#0C0A10', pose = o.pose || 'stand', ph = o.ph ?? 0, t = o.t ?? 0;
  c.save(); c.fillStyle = col; c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round';
  if (o.h) c.scale(o.h, o.h);
  const lean = o.lean ?? (pose === 'carry' ? .14 : pose === 'pull' ? -.28 : pose === 'cast' ? lerp(-.15, .25, o.k ?? 0) : 0);
  const walk = pose === 'walk' || pose === 'carry' || o.walk;
  const H = [0, -90], up = (p) => rot2(p, H, lean);
  // legs
  const legs = [0, 1].map(i => {
    const p = ph + i * Math.PI;
    let a = walk ? .36 * Math.sin(p) : (i ? .07 : -.06), b = walk ? .12 + (.45 + .5 * (o.climb ?? 0)) * Math.max(0, Math.cos(p)) : 0;
    if (pose === 'pull') { a = i ? .45 : .1; b = i ? .15 : .35; }
    if (pose === 'cast') { a = i ? -.3 : .35; b = .1; }
    const k = [H[0] + Math.sin(a) * 45, H[1] + Math.cos(a) * 45], f = [k[0] + Math.sin(a - b) * 46, k[1] + Math.cos(a - b) * 46];
    return { k, f, back: i };
  });
  const drawLeg = (L, sh) => { c.strokeStyle = sh; seg2(c, H, L.k, 16); seg2(c, L.k, L.f, 11); seg2(c, [L.f[0] - 3, L.f[1] - 2], [L.f[0] + 14, L.f[1]], 7); };
  drawLeg(legs[1], col); drawLeg(legs[0], col);
  // the veshti: from the waist to the knees, flaring a little
  const kx = legs.map(L => L.k[0]), ky = Math.max(...legs.map(L => L.k[1]));
  poly2(c, [up([-15, -104]), up([15, -104]), [Math.max(...kx) + 9, ky + 4], [Math.min(...kx) - 9, ky + 6]]);
  // the torso
  poly2(c, [up([-13, -96]), up([13, -96]), up([17, -122]), up([15, -140]), up([7, -149]), up([-5, -149]), up([-13, -141]), up([-15, -118])]);
  // the head
  const nk = up([3, -150]), hd = up([5, -162]);
  seg2(c, up([1, -142]), nk, 11);
  ellipse(c, hd[0], hd[1], 11.5, 13, col); poly2(c, [up([14, -165]), up([19, -159]), up([14, -156])]);
  if (o.beard) poly2(c, [up([6, -156]), up([16, -154]), up([10, -140]), up([0, -146])]);
  if (o.cloth !== false) {
    const r = o.turban ? 15 : 13; ellipse(c, hd[0] - 1, hd[1] - 5, r, o.turban ? 10 : 7, col, lean);
    if (!o.turban) { const kn = up([-10, -163]); ellipse(c, kn[0], kn[1], 6, 5, col); }
    else ellipse(c, hd[0] - 2, hd[1] - 12, 11, 8, col);
  }
  // arms: the shoulder, and where each hand goes
  const S = up([4, -140]), S2 = up([-2, -139]);
  let hands;
  switch (pose) {
    case 'walk': hands = [0, 1].map(i => { const a = .4 * Math.sin(ph + (1 - i) * Math.PI); const e = [S[0] + Math.sin(a) * 30, S[1] + Math.cos(a) * 30]; return [e, [e[0] + Math.sin(a + .35) * 28, e[1] + Math.cos(a + .35) * 28]]; }); break;
    case 'carry': { const T = up([18, -158]); hands = [ik2(S, T, 30, 28, 1), ik2(S2, up([-24, -112 + 5 * Math.sin(ph)]), 30, 28, -1)]; break; }
    case 'torch': { const T = up([24, -205]); hands = [ik2(S, T, 30, 28, -1), ik2(S2, up([-4, -94]), 30, 28, 1)]; break; }
    case 'vow': { const T = up([16, -222]); hands = [ik2(S, T, 30, 28, -1), ik2(S2, up([10, -96]), 30, 28, 1)]; break; }
    case 'cast': { const k = o.k ?? 0, T = k < .5 ? up([lerp(-10, -38, k * 2), lerp(-120, -150, k * 2)]) : up([lerp(-38, 44, (k - .5) * 2), lerp(-150, -176, (k - .5) * 2)]); hands = [ik2(S, T, 30, 28, k < .5 ? 1 : -1), ik2(S2, [T[0] - 6, T[1] + 8], 30, 28, k < .5 ? 1 : -1)]; break; }
    case 'pull': { const T = up([40, -112]); hands = [ik2(S, T, 30, 28, 1), ik2(S2, [T[0] - 10, T[1] + 4], 30, 28, 1)]; break; }
    case 'pour': { const T = up([34, -150]); hands = [ik2(S, T, 30, 28, 1), ik2(S2, [T[0] - 8, T[1] + 22], 30, 28, 1)]; break; }
    case 'pray': { const T = up([16, -128]); hands = [ik2(S, T, 30, 28, 1), ik2(S2, [T[0] - 2, T[1] + 2], 30, 28, 1)]; break; }
    case 'fold': { hands = [ik2(S, up([-6, -122]), 30, 28, 1), ik2(S2, up([12, -124]), 30, 28, 1)]; break; }
    default: hands = [ik2(S, up([6, -86]), 30, 28, -1), ik2(S2, up([-4, -86]), 30, 28, 1)];
  }
  const arm = (sh, [j, e]) => { seg2(c, sh, j, 10); seg2(c, j, e, 8); ellipse(c, e[0], e[1], 5.5, 5.5, col); };
  arm(S2, hands[1]); arm(S, hands[0]);
  if (o.staff) { c.lineWidth = 4.5; const e = hands[1][1]; c.beginPath(); c.moveTo(e[0] - 6, e[1] - 40); c.lineTo(e[0] + 8, 0); c.stroke(); }
  if (pose === 'torch') { const e = hands[0][1], tip = [e[0] + 8, e[1] - 36]; c.lineWidth = 5; seg2(c, [e[0] - 3, e[1] + 14], tip, 5); ellipse(c, tip[0], tip[1] - 3, 6, 9, col); if (o.out) o.out.torch = c.getTransform().transformPoint(new DOMPoint(tip[0], tip[1] - 8)); }
  if (pose === 'pour') { const e = hands[0][1]; c.save(); c.translate(e[0] + 6, e[1] + 6); c.rotate(.9); c.fillRect(-14, -22, 28, 40); c.restore(); if (o.out) o.out.spout = c.getTransform().transformPoint(new DOMPoint(e[0] + 30, e[1] + 2)); }
  if (o.out) o.out.hand = c.getTransform().transformPoint(new DOMPoint(hands[0][1][0], hands[0][1][1]));
  c.restore();
}

// ---------- a girl in a sari: the fishermen's chief's daughter ----------
// o: pose 'stand' | 'look' (a hand shading her eyes, out to sea) | 'pray'; wind (0..1: the pallu and the skirt blow back);
//    t, col, h. Height ~158.
function girl2(c, o = {}) {
  const col = o.col || '#0C0A10', t = o.t ?? 0, w = o.wind ?? .6, g = w * (1 + .3 * Math.sin(t * 2.1) + .15 * Math.sin(t * 4.7));
  c.save(); c.fillStyle = col; c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round';
  if (o.h) c.scale(o.h, o.h);
  // the pleated skirt to the ground, blowing back a little
  c.beginPath(); c.moveTo(-12, -100); c.lineTo(13, -100); c.quadraticCurveTo(18, -50, 22, 0); c.lineTo(-20 - 10 * g, 0); c.quadraticCurveTo(-18 - 4 * g, -50, -12, -100); c.fill();
  ellipse(c, 6, 0, 8, 3, col);   // a foot
  // the waist and the blouse
  poly2(c, [[-11, -100], [11, -100], [13, -118], [12, -134], [5, -140], [-6, -140], [-12, -132], [-12, -114]]);
  // the head, the long braid down her back with a string of jasmine
  seg2(c, [0, -136], [1, -144], 9);
  ellipse(c, 3, -153, 10, 11.5, col); poly2(c, [[11, -156], [15, -151], [11, -149]]);
  ellipse(c, -5, -156, 6, 7, col);
  c.lineWidth = 5; c.beginPath(); c.moveTo(-6, -152); c.bezierCurveTo(-14 - 3 * g, -130, -12 - 6 * g, -110, -10 - 10 * g, -92); c.stroke();
  // the pallu over the shoulder, a broad end flying back from the shoulder blade
  { const f1 = 4 * Math.sin(t * 2.6), f2 = 6 * Math.sin(t * 2.1 + 1);
    c.beginPath(); c.moveTo(10, -134); c.lineTo(-10, -100); c.lineTo(-14, -112);
    c.quadraticCurveTo(-24 - 8 * g, -108 + f1, -30 - 14 * g, -100 + f2); c.lineTo(-36 - 16 * g, -118 + f2);
    c.quadraticCurveTo(-26 - 10 * g, -132 + f1, -8, -140); c.closePath(); c.fill(); }
  // arms
  const S = [4, -132];
  let hs;
  if (o.pose === 'look') hs = [ik2(S, [14, -158], 24, 22, -1), ik2([-2, -132], [4, -98], 24, 22, 1)];
  else if (o.pose === 'pray') hs = [ik2(S, [14, -122], 24, 22, 1), ik2([-2, -132], [13, -121], 24, 22, 1)];
  else hs = [ik2(S, [8, -90], 24, 22, -1), ik2([-2, -132], [-4, -90], 24, 22, 1)];
  for (const [j, e] of [hs[1], hs[0]]) { seg2(c, [4, -132], j, 7.5); seg2(c, j, e, 6); ellipse(c, e[0], e[1], 4, 4, col); }
  c.restore();
}

// ---------- the shark ----------
// side view, nose to +x, ~600 long. o: bend (-1..1, the body arching), jaw (0..1), tail (the beat, radians), col.
function shark2(c, o = {}) {
  const col = o.col || '#0A0C14', b = o.bend ?? 0, tl = o.tail ?? 0;
  c.save(); c.fillStyle = col;
  const Y = (x) => b * 60 * Math.pow(x / 300, 2) * -1;   // the arch: the ends drop
  c.beginPath();
  c.moveTo(300, Y(300));
  c.bezierCurveTo(260, -60 + Y(260), 120, -80 + Y(120), 0, -70);                      // the back
  c.bezierCurveTo(-120, -60 + Y(-120), -220, -30 + Y(-220), -260, -10 + Y(-260));
  // the tail: the upper lobe long, the lower short, beating
  c.save(); c.restore();
  const tx = -260, ty = -10 + Y(-260), a = tl;
  const p = (dx, dy) => { const [x, y] = rot2([tx + dx, ty + dy], [tx, ty], a); return [x, y]; };
  let q = p(-120, -110); c.quadraticCurveTo(...p(-60, -40), ...q); q = p(-70, -6); c.quadraticCurveTo(...p(-90, -50), ...q);
  q = p(-90, 60); c.lineTo(...q); q = p(-10, 10); c.quadraticCurveTo(...p(-40, 20), ...q);
  c.bezierCurveTo(-200, 30 + Y(-200), -100, 50 + Y(-100), 0, 48);                       // the belly
  c.bezierCurveTo(120, 50 + Y(120), 240, 30 + Y(240), 300, Y(300) + 4);
  c.fill();
  // the dorsal fin, the pectoral fin, the jaw open
  c.beginPath(); c.moveTo(60, -74 + Y(60)); c.quadraticCurveTo(20, -150, -30, -170); c.quadraticCurveTo(-10, -110, -50, -70 + Y(-50)); c.fill();
  c.beginPath(); c.moveTo(110, 40 + Y(110)); c.quadraticCurveTo(60, 110, -10, 140); c.quadraticCurveTo(40, 70, 40, 44 + Y(40)); c.fill();
  c.beginPath(); c.moveTo(-160, 30 + Y(-160)); c.lineTo(-190, 64); c.lineTo(-200, 24 + Y(-200)); c.fill();
  if (o.jaw) { c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.moveTo(302, Y(300) + 2); c.lineTo(200, 18 + Y(200) - 10 * o.jaw); c.lineTo(300, Y(300) + 34 * o.jaw); c.fill(); c.globalCompositeOperation = 'source-over'; }
  c.restore();
}

// ---------- a boat: a wooden vallam, the ends turned up ----------
function boat2(c, o = {}) {
  const col = o.col || '#0A0A12', L = o.L ?? 520;
  c.save(); c.fillStyle = col; c.strokeStyle = col;
  c.beginPath(); c.moveTo(-L / 2 - 20, -54); c.quadraticCurveTo(-L / 2, -10, -L / 2 + 60, 0); c.lineTo(L / 2 - 60, 0); c.quadraticCurveTo(L / 2, -10, L / 2 + 24, -60);
  c.lineTo(L / 2 + 10, -58); c.quadraticCurveTo(L / 2 - 30, -26, L / 2 - 80, -24); c.lineTo(-L / 2 + 80, -24); c.quadraticCurveTo(-L / 2 + 30, -26, -L / 2 - 8, -52); c.closePath(); c.fill();
  if (o.oar) { c.lineWidth = 5; c.beginPath(); c.moveTo(-L / 2 + 70, -30); c.lineTo(-L / 2 - 30, 60); c.stroke(); }
  c.restore();
}

// ---------- a cast net in flight ----------
// from the hand (hx, hy, screen px) out to a ring centred at (cx, cy) of radius r (px) seen flattened (sq); k 0..1 opens
// it; weights glint on the rim; col the moonlit thread. Screen space (not a figure).
function net2(c, hx, hy, cx, cy, r, sq, k, col = '220,232,255', a = 1) {
  if (k <= 0 || a <= 0) return; c.save(); c.lineCap = 'round';
  const n = 28, rr = r * (.25 + .75 * k), rim = [];
  for (let i = 0; i <= n; i++) { const u = i / n * TAU; rim.push([cx + Math.cos(u) * rr, cy + Math.sin(u) * rr * sq]); }
  c.strokeStyle = `rgba(${col},${.5 * a})`; c.lineWidth = 1.6;
  for (let i = 0; i < n; i += 1) { c.beginPath(); c.moveTo(hx, hy); c.quadraticCurveTo(lerp(hx, rim[i][0], .5), lerp(hy, rim[i][1], .5) - 20 * k, rim[i][0], rim[i][1]); c.stroke(); }
  for (let j = 1; j <= 5; j++) { const f = j / 5; c.beginPath(); for (let i = 0; i <= n; i++) { const x = lerp(hx, rim[i][0], f), y = lerp(hy, rim[i][1], f) - 20 * k * Math.sin(f * Math.PI) * .5; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }
  c.strokeStyle = `rgba(${col},${.9 * a})`; c.lineWidth = 3; c.beginPath(); rim.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
  for (let i = 0; i < n; i += 2) glow(c, rim[i][0], rim[i][1], 7, `rgba(${col},1)`, .8 * a);
  c.restore();
}

// ---------- the shore: a coconut palm, a thatched hut ----------
function palm2(c, x, y, h, lean, t, col = '#06060C') {
  c.save(); c.translate(x, y); c.strokeStyle = col; c.fillStyle = col; c.lineCap = 'round';
  const top = [Math.sin(lean) * h, -Math.cos(lean) * h];
  c.lineWidth = h * .035; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(top[0] * .2, top[1] * .6, top[0], top[1]); c.stroke();
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * TAU + .3 * Math.sin(t * .8 + i), L = h * (.32 + .06 * Math.sin(i * 3)), ex = top[0] + Math.cos(a) * L, ey = top[1] + Math.sin(a) * L * .55 + L * .35;
    c.lineWidth = h * .012; c.beginPath(); c.moveTo(top[0], top[1]); c.quadraticCurveTo(top[0] + Math.cos(a) * L * .5, top[1] - L * .15, ex, ey); c.stroke();
    for (let j = 1; j < 9; j++) { const f = j / 9, px = lerp(top[0], ex, f) + Math.cos(a) * 0, py = lerp(top[1] - L * .15 * Math.sin(f * Math.PI), ey, f); c.lineWidth = h * .006; c.beginPath(); c.moveTo(px, py); c.lineTo(px + Math.cos(a + 1.2) * L * .14, py + L * .12); c.moveTo(px, py); c.lineTo(px + Math.cos(a - 1.2) * L * .14, py + L * .12); c.stroke(); }
  }
  c.restore();
}
function hut2(c, x, y, w, col = '#06060C') {
  c.save(); c.translate(x, y); c.fillStyle = col;
  c.fillRect(-w * .42, -w * .38, w * .84, w * .38);
  c.beginPath(); c.moveTo(-w * .6, -w * .32); c.quadraticCurveTo(0, -w * .95, w * .6, -w * .32); c.lineTo(w * .5, -w * .3); c.quadraticCurveTo(0, -w * .7, -w * .5, -w * .3); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(-w * .6, -w * .32); c.lineTo(0, -w * .82); c.lineTo(w * .6, -w * .32); c.fill();
  c.restore();
}
