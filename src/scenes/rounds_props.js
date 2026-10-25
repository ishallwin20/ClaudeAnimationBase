// rounds_props.js: what "How many times should you walk around EACH god?" (ad 50, Pradakshina Part 2) builds on the
// shrine set (cine3d_temple.js): a courtyard of five shrines (Shiva's in the middle with its somasutra, four smaller
// ones at the corners for Devi, Ganesha, Vishnu and Surya), gold footprint rings round each (one ring a round, each a
// step further out so the count can be read), Shiva's way from Part 1 (to the channel and back), each god's emblem in
// lines of light over their shikhara with the count beside it, map pins, the card.

// ---------- the five shrines ----------
// the corners, clockwise from the north-east (the order the reel visits them); n: the rounds (Hari Bhakti Vilasa 8.394,
// from the Narasimha Purana: one for Chandi, seven for the Sun, three for Vinayaka, four for Keshava, half for Shiva)
const GODS = [
  { id: 'devi', name: 'DEVI', n: 1, at: [7.5, -9.5], col: '#FF7A5A' },
  { id: 'ganesha', name: 'GANESHA', n: 3, at: [7.5, 9.5], col: '#FFB050' },
  { id: 'vishnu', name: 'VISHNU', n: 4, at: [-7.5, 9.5], col: '#8EB8FF' },
  { id: 'surya', name: 'SURYA', n: 7, at: [-7.5, -9.5], col: '#FFD860' },
];
const SK = .72, RGAP = .4;                      // the corner shrines' scale; the gap between one round's ring and the next
const TOPY = { centre: 11.2, corner: 7.7 };     // where the emblems float

// the courtyard: paving, a low prakara wall with a gate on the east and lamps along its top, trees beyond
function court5(scene) {
  const G = new THREE.Group(); scene.add(G);
  const gran = (rx, ry, seed, x = {}) => stone3({ col: '#8E8376', seed, rep: [rx, ry], ...x });
  mesh3(G, new THREE.PlaneGeometry(90, 90), stone3({ col: '#7A7068', rows: 2, cols: 2, seed: 21, rep: [56, 56], speck: .7, mottle: 1.4, bumpK: 3 }), [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const X = 14.5, Z = 17, pw = gran(10, 1, 23);
  for (const s of [-1, 1]) {
    block3(G, 2 * X + .5, 1.1, .5, pw, [0, 0, s * Z]);
    block3(G, .5, 1.1, 2 * Z + .5, pw, [-X, 0, 0]);
    block3(G, .5, 1.1, Z - 1.6, pw, [X, 0, s * (Z + 1.6) / 2]);
    block3(G, 2 * X + .8, .12, .8, gran(14, .2, 24), [0, 1.1, s * Z]);
    block3(G, .8, .12, 2 * Z + .8, gran(14, .2, 24), [-X, 1.1, 0]);
    block3(G, .8, .12, Z - 1.6, gran(6, .2, 24), [X, 1.1, s * (Z + 1.6) / 2]);
    block3(G, .7, 2.6, .7, gran(1, 2, 25), [X, 0, s * 1.8]);
  }
  const lamps = [], dish = lathe3([[0, 0], [.05, 0], [.07, .02], [.1, .035], [.1, .045], [.08, .04], [0, .035]], 24), lampM = metal3('#C9963E', .3);
  const lamp = (x, z, light) => { mesh3(G, dish, lampM, [x, 1.22, z]); lamps.push(flame3(G, [x, 1.26, z], 1, { light, power: 3.2, range: 7 })); };
  for (let i = -12; i <= 12; i += 3) { lamp(i, Z, i === 0); lamp(i, -Z, i === 0); }
  for (let i = -15; i <= 15; i += 3) { lamp(-X, i, i === 0); if (Math.abs(i) >= 3) lamp(X, i, false); }
  const leafM = new THREE.MeshStandardMaterial({ color: '#2A3A26', roughness: .9, flatShading: true }), barkM = new THREE.MeshStandardMaterial({ color: '#2A211C', roughness: 1 });
  const rnd = lcg(50);
  for (let i = 0; i < 20; i++) {
    const a = i / 20 * TAU + rnd() * .2, d = 24 + rnd() * 9, x = Math.cos(a) * d * .85, z = Math.sin(a) * d, h = 3 + rnd() * 3;
    mesh3(G, new THREE.CylinderGeometry(.18, .3, h, 8), barkM, [x, h / 2, z]);
    for (let j = 0; j < 4; j++) mesh3(G, new THREE.IcosahedronGeometry(1.4 + rnd() * 1.2, 1), leafM, [x + (rnd() - .5) * 2, h + rnd() * 1.6, z + (rnd() - .5) * 2]);
  }
  return { set: (t, on = 1) => lamps.forEach(l => l.set(t, on)) };
}

// ---------- footprint rings ----------
// ring3(parent, cx, cz, k, off, o): footprints once round the path of a shrine at (cx, cz) scaled k, off metres out
// from it, clockwise from the east door, left and right in turn; about one step every .5 m
function ring3(parent, cx, cz, k, off, o = {}) {
  const len = PATH3.len * k + TAU * off, n = Math.round(len / (o.step || .5)), feet = [];
  for (let i = 0; i < n; i++) {
    const s = i / n, p = path3(s), hx = p.dx, hz = p.dz, out = [p.dz, -p.dx], side = i % 2 ? 1 : -1, rx = -hz, rz = hx;
    const x = cx + p.x * k + out[0] * off + rx * side * .12, z = cz + p.z * k + out[1] * off + rz * side * .12;
    feet.push(foot3(parent, x, z, yawOf(hx, hz), side, { col: o.col || '#FFC860', size: o.size || .42 }));
  }
  return feet;
}
// trail3(parent, s0, s1, n, o): n footprints along the middle shrine's path from s0 to s1 (s1 < s0 walks it
// anticlockwise), o.off metres out (as in Part 1, ad 31)
function trail3(parent, s0, s1, n, o = {}) {
  const feet = [];
  for (let i = 0; i < n; i++) {
    const s = lerp(s0, s1, i / (n - 1)), p = path3(s), dir = Math.sign(s1 - s0), hx = p.dx * dir, hz = p.dz * dir;
    const out = [p.dz, -p.dx], side = i % 2 ? 1 : -1, rx = -hz, rz = hx;
    const x = p.x + out[0] * (o.off || 0) + rx * side * .11, z = p.z + out[1] * (o.off || 0) + rz * side * .11;
    feet.push(foot3(parent, x, z, yawOf(hx, hz), side, { col: o.col, size: o.size || .42 }));
  }
  return feet;
}
// trailShow(feet, t, tA, tB, o): the footprints land one by one from tA to tB; o.a brightness; o.hold seconds each
// stays fully lit before dimming to o.rest
function trailShow(feet, t, tA, tB, o = {}) {
  const n = feet.length;
  feet.forEach((f, i) => {
    const ti = tA + (tB - tA) * i / Math.max(1, n - 1), on = seg(t, ti, ti + .12);
    const fade = o.hold != null ? lerp(1, o.rest ?? .35, seg(t, ti + o.hold, ti + o.hold + .6)) : 1;
    f.material.opacity = (o.a ?? 1) * on * fade; f.visible = on > 0;
  });
}
const trailSet = (feet, a) => feet.forEach(f => { f.visible = a > .001; f.material.opacity = a; });
// rings in turn: the k-th of rings lands over [t0 + k·d, t0 + (k + 1)·d]; returns how many are complete at t
function ringsShow(rings, t, t0, d, o = {}) {
  rings.forEach((r, k) => trailShow(r, t, t0 + k * d, t0 + (k + 1) * d - .08, o));
  return clamp(Math.floor((t - t0 + .04) / d), 0, rings.length);
}

// a glowing bar across the middle shrine's path, either side of the channel: "stop here"
function stopLine3(parent, x) {
  const mk = (w, col, y) => mesh3(parent, new THREE.PlaneGeometry(w, 1.6), new THREE.MeshBasicMaterial({ map: glowTex3(), color: col, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }),
    [x, y, -SHR.pathA], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false });
  const halo = mk(.9, '#FF5A2A', .02), core = mk(.25, '#FFD0A0', .025);
  // one material face for both: setting .material.opacity lights the halo and its hot core together
  return { material: { set opacity(a) { halo.material.opacity = a; core.material.opacity = a; halo.visible = core.visible = a > .001; }, get opacity() { return halo.material.opacity; } } };
}

// ---------- the emblems, in lines of light ----------
// stroke a path twice, a coloured glow and a white-hot core, like ganeshaLine
function lightPath(c, d, x, y, k, col, a = 1, w = 9) {
  c.save(); c.translate(x, y); c.scale(k, k); c.globalAlpha *= a; c.lineCap = 'round'; c.lineJoin = 'round';
  const p = new Path2D(d);
  c.strokeStyle = col; c.lineWidth = w / k * Math.min(1, k * 3); c.shadowColor = col; c.shadowBlur = 30; c.stroke(p);
  c.globalCompositeOperation = 'lighter'; c.shadowBlur = 0; c.strokeStyle = rgba('#FFF4D8', .9); c.lineWidth = w / k * Math.min(1, k * 3) * .35; c.stroke(p);
  c.restore();
}
// the trishul's head for the Devi (about 1000 units tall), the linga on its pitha for Shiva (about 900 wide)
const TRISHUL_D = 'M 0 480 L 0 -380 M 0 -500 C 40 -420 40 -320 0 -250 C -40 -320 -40 -420 0 -500 M -260 -460 C -300 -300 -220 -170 -60 -150 L 60 -150 C 220 -170 300 -300 260 -460 M -90 -90 L 90 -90 M -70 -40 L 70 -40';
const LINGA_D = 'M -170 300 L -150 230 L 150 230 L 170 300 M -260 230 C -270 180 -220 150 -150 150 L 300 150 C 360 152 380 175 420 190 L 440 205 C 430 222 400 225 330 215 L 150 230 M -110 150 L -110 -170 C -110 -290 110 -290 110 -170 L 110 150 M -90 -150 L 90 -150 M -92 -115 L 92 -115 M -92 -80 L 92 -80';
// emblem(c, id, x, y, s, t, a): the god's emblem at screen (x, y), s pixels a metre (it is about 1.8 m tall)
function emblem(c, id, x, y, s, t, a = 1) {
  if (a <= .01) return;
  const g = GODS.find(q => q.id === id), col = g ? g.col : '#FFE0A0', k = s * 1.8 / 1000;
  glow(c, x, y, s * 2.4, col, .35 * a);
  c.save(); c.globalAlpha *= a;
  if (id === 'devi') lightPath(c, TRISHUL_D, x, y, k, col, 1, 10);
  else if (id === 'ganesha') ganeshaLine(c, x, y + s * .05, k * .95, 1, { col });
  else if (id === 'vishnu') chakra(c, x, y, s * .55, t * 1.6, 1, t);
  else if (id === 'surya') { c.globalAlpha *= .9; sunDisc(c, x, y, s * .42, t, { rays: .7 }); }
  else if (id === 'shiva') { lightPath(c, LINGA_D, x, y + s * .1, k * 1.05, '#BFD8FF', 1, 10); ellipse(c, x, y - s * .25, s * .06, s * .06, '#FF5040'); }
  c.restore();
}
// a shrine's emblem point and its pixels a metre on the current camera
function emblemAt(id) {
  const g = GODS.find(q => q.id === id), p = g ? [g.at[0], TOPY.corner, g.at[1]] : [0, TOPY.centre, 0];
  const [x, y, z] = toScreen3(p), r = new THREE.Vector3().setFromMatrixColumn(CAM3.matrixWorld, 0), [x1, y1] = toScreen3([p[0] + r.x, p[1] + r.y, p[2] + r.z]);
  return { x, y, z, s: Math.hypot(x1 - x, y1 - y) };   // pixels a metre across the screen (also right for a camera looking straight down)
}
// every emblem over the courtyard (o.a: alpha for each id, a number or a function of the id)
function emblems(c, t, o = {}) {
  for (const id of ['shiva', 'devi', 'ganesha', 'vishnu', 'surya']) {
    const a = typeof o.a === 'function' ? o.a(id) : o.a ?? 1, e = emblemAt(id);
    if (e.z < 1) emblem(c, id, e.x, e.y, Math.min(e.s, o.max || 200), t, a);
  }
}
// the count beside an emblem: pops at `at`, o.size, o.dx (in emblem metres)
function count(c, txt, id, t, at, o = {}) {
  if (t < at) return;
  const e = emblemAt(id); if (e.z > 1) return;
  const x = e.x + e.s * (o.dx ?? 1.9), y = e.y + (o.dy ?? 0) * e.s, size = o.size || Math.max(56, Math.min(200, e.s * 1.5));
  text(c, txt, x, y, `700 ${size}px Cinzel`, o.col || '#FFE2A0', { pop: t - at, alpha: o.alpha ?? 1, glow: ['rgba(10,6,4,.95)', 22] });
}
// a word or number pinned to a ground point
function pin(c, txt, p, t, at, o = {}) {
  const [x, y, z] = toScreen3(p); if (z > 1 || t < at) return;
  text(c, txt, x, y, `700 ${o.size || 64}px Cinzel`, o.col || '#F4C46A', { pop: t - at, alpha: o.alpha ?? 1, glow: ['rgba(10,6,4,.95)', 20], spacing: 2 });
}

// ---------- the walker (Part 1's POV on the middle shrine's path) ----------
function pov(s, o = {}) {
  const p = path3(s), dir = o.dir ?? 1, hx = p.dx * dir, hz = p.dz * dir, rx = -hz, rz = hx, tn = o.turn ?? 0;
  const lx = hx * Math.cos(tn) + rx * Math.sin(tn), lz = hz * Math.cos(tn) + rz * Math.sin(tn);
  const steps = s * PATH3.len / .66, y = 1.6 + .03 * (o.bob ?? 1) * Math.abs(Math.sin(steps * Math.PI)) - .015;
  return cam3({ pos: [p.x, y, p.z], at: o.at || [p.x + lx * 4, y - Math.tan(o.pitch ?? .08) * 4, p.z + lz * 4], fov: o.fov ?? 66 });
}

// a dark band behind 2D lettering over a bright frame (y0..y1, fading at both ends)
function band(c, y0, y1, a = .6) {
  c.save(); const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(6,5,10,0)'); g.addColorStop(.25, `rgba(6,5,10,${a})`); g.addColorStop(.75, `rgba(6,5,10,${a})`); g.addColorStop(1, 'rgba(6,5,10,0)');
  c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); c.restore();
}
