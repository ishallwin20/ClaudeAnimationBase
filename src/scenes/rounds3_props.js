// rounds3_props.js: what "How many times should you walk around HANUMAN?" (ad 65, Pradakshina Part 3) builds on the
// shrine set (cine3d_temple.js): Part 2's courtyard (court5, the middle Shiva shrine) with four new corners: Krishna's
// and Murugan's shrines, a Navagraha platform (the nine grahas on their pedestals, each in their colour of cloth) and
// Hanuman's shrine with a saffron flag; gold footprint rings round each (one ring a round, each a step further out),
// each god's emblem in lines of light (flute and peacock feather, vel, the nine grahas, gada), the counts, the
// source tags (PURANA, VERSE, CUSTOM), the screenshot board.

// ---------- the four corners ----------
// clockwise from the north-east, the order the reel visits them; n: the rounds, gap: one ring to the next (m), top:
// where the emblem floats (m); tag: where the number comes from (the twist)
const GODS = [
  { id: 'krishna', name: 'KRISHNA', n: 4, at: [7.5, -9.5], col: '#8EC8FF', gap: .4, top: 7.7, tag: 'PURANA' },
  { id: 'murugan', name: 'MURUGAN', n: 6, at: [7.5, 9.5], col: '#FFC84A', gap: .4, top: 7.7, tag: 'VERSE' },
  { id: 'nava', name: 'NAVAGRAHA', n: 9, at: [-7.5, 9.5], col: '#E8DCFF', gap: .34, top: 3.4, tag: 'CUSTOM' },
  { id: 'hanuman', name: 'HANUMAN', n: 11, at: [-7.5, -9.5], col: '#FF7A3A', gap: .3, top: 7.7, tag: 'CUSTOM', count: '3 / 11' },
];
const SK = .72;                                 // the corner shrines' scale
const TOPY = { centre: 11.2 };
const TAGC = { PURANA: '#FFD878', VERSE: '#CFC2B0', CUSTOM: '#FF9A6A' };

// the courtyard of Part 2: paving, a low prakara wall with a gate on the east and lamps along its top, trees beyond
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

// ---------- the Navagraha platform ----------
// a raised square plinth with steps on the east, nine pedestals in a 3 × 3, a small dark stone graha on each, dressed
// in their colour of cloth, Surya in the middle and the others round him (the Agamic layout: Shukra east, Chandra
// south-east, Mangala south, Rahu south-west, Shani west, Ketu north-west, Guru north, Budha north-east), a lamp at each
// corner. In shrine metres (place it in a group scaled like a corner shrine); matte: stone, cloth, unpolished brass.
const GRAHAS = [   // [name, x, z (east +x, north -z), cloth, emblem dot colour]
  ['surya', 0, 0, '#B8231C', '#FF6A3A'], ['shukra', 1, 0, '#E8E2D4', '#FFFFFF'], ['chandra', 1, 1, '#DCD8CC', '#E8F0FF'],
  ['mangala', 0, 1, '#9E1E1A', '#FF3A2A'], ['rahu', -1, 1, '#3A3A52', '#9A8AB8'], ['shani', -1, 0, '#1E2238', '#6A7CFF'],
  ['ketu', -1, -1, '#6A5A48', '#C8A070'], ['guru', 0, -1, '#D8A428', '#FFD840'], ['budha', 1, -1, '#3E7A3A', '#5AD06A'],
];
function navagraha3(parent) {
  const G = new THREE.Group(); parent.add(G);
  const gran = (rx, ry, seed, x = {}) => stone3({ col: '#8E8376', seed, rep: [rx, ry], ...x });
  block3(G, 5.0, .3, 5.0, gran(4, .3, 61), [0, 0, 0]);
  block3(G, 4.7, .3, 4.7, gran(4, .3, 62, { col: '#857A6E' }), [0, .3, 0]);
  block3(G, 4.9, .14, 4.9, gran(4, .2, 63), [0, .6, 0]);
  block3(G, .4, .5, 1.4, gran(1, .3, 64), [2.7, 0, 0]); block3(G, .4, .25, 1.4, gran(1, .2, 64), [3.1, 0, 0]);
  const ped = gran(.6, .4, 65, { col: '#6E655C' }), black = new THREE.MeshStandardMaterial({ color: '#1E1C1C', roughness: .6, metalness: 0 });
  const brass = new THREE.MeshStandardMaterial({ color: '#9A7434', roughness: .6, metalness: .35 });
  const body = lathe3(smooth3([[0, 0], [.17, 0], [.16, .1], [.12, .3], [.14, .52], [.09, .62], [.06, .66], [.08, .72], [.075, .8], [.04, .86], [0, .87]], 4), 20);
  const skirt = new THREE.CylinderGeometry(.13, .22, .34, 18, 1, true), shawl = new THREE.CylinderGeometry(.1, .15, .14, 18, 1, true);
  const crown = lathe3([[0, 0], [.07, 0], [.06, .06], [.03, .12], [0, .14]], 16);
  for (const [name, gx, gz, cloth] of GRAHAS) {
    const x = gx * 1.35, z = gz * 1.35, y = .74, k = name === 'surya' ? 1.15 : 1;
    block3(G, .66, .32, .66, ped, [x, y, z]); block3(G, .74, .06, .74, ped, [x, y + .32, z]);
    const g = new THREE.Group(); g.position.set(x, y + .38, z); g.scale.setScalar(k * 1.25); G.add(g);
    mesh3(g, body, black);
    const cm = new THREE.MeshStandardMaterial({ color: cloth, roughness: .92, side: THREE.DoubleSide });
    mesh3(g, skirt, cm, [0, .19, 0]); mesh3(g, shawl, cm, [0, .5, 0]);
    mesh3(g, crown, brass, [0, .86, 0]);
  }
  const lamps = [], dish = lathe3([[0, 0], [.05, 0], [.07, .02], [.1, .035], [.1, .045], [.08, .04], [0, .035]], 24);
  for (const [x, z] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { mesh3(G, dish, brass, [x * 2.2, .74, z * 2.2]); lamps.push(flame3(G, [x * 2.2, .78, z * 2.2], 1.2, { light: x > 0 && z > 0, power: 2.4, range: 6 })); }
  return { set: (t, o = {}) => lamps.forEach(l => l.set(t, o.lamps ?? 1)) };
}

// a saffron flag on a pole over Hanuman's kalasha (shrine metres), waving
function flag3(parent) {
  const pole = mesh3(parent, new THREE.CylinderGeometry(.03, .03, 1.9, 8), new THREE.MeshStandardMaterial({ color: '#5A4430', roughness: .8 }), [0, 10.4, 0]);
  const geo = new THREE.PlaneGeometry(1.1, .62, 12, 4), base = geo.attributes.position.array.slice();
  const m = mesh3(parent, geo, new THREE.MeshStandardMaterial({ color: '#E8701E', emissive: '#3A1400', emissiveIntensity: .3, roughness: .85, side: THREE.DoubleSide }), [.56, 11.05, 0], { cast: false });
  return { pole, set(t) {
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = base[i * 3] + .55, y = base[i * 3 + 1]; p.setY(i, y * (1 - x * .45)); p.setZ(i, Math.sin(x * 5 - t * 6) * .09 * x); }
    p.needsUpdate = true; geo.computeVertexNormals(); m.rotation.y = .5 + .15 * Math.sin(t * .7);
  } };
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
// trailShow(feet, t, tA, tB, o): the footprints land one by one from tA to tB; o.a brightness
function trailShow(feet, t, tA, tB, o = {}) {
  const n = feet.length;
  feet.forEach((f, i) => {
    const ti = tA + (tB - tA) * i / Math.max(1, n - 1), on = seg(t, ti, ti + .12);
    f.material.opacity = (o.a ?? 1) * on; f.visible = on > 0;
  });
}
const trailSet = (feet, a) => feet.forEach(f => { f.visible = a > .001; f.material.opacity = a; });
// rings in turn: the k-th of rings lands over [t0 + k·d, t0 + (k + 1)·d]
function ringsShow(rings, t, t0, d, o = {}) { rings.forEach((r, k) => trailShow(r, t, t0 + k * d, t0 + (k + 1) * d - .08, o)); }

// ---------- the emblems, in lines of light ----------
// stroke a path twice, a coloured glow and a white-hot core, like ganeshaLine
function lightPath(c, d, x, y, k, col, a = 1, w = 9) {
  c.save(); c.translate(x, y); c.scale(k, k); c.globalAlpha *= a; c.lineCap = 'round'; c.lineJoin = 'round';
  const p = new Path2D(d);
  c.strokeStyle = col; c.lineWidth = w / k * Math.min(1, k * 3); c.shadowColor = col; c.shadowBlur = 30; c.stroke(p);
  c.globalCompositeOperation = 'lighter'; c.shadowBlur = 0; c.strokeStyle = rgba('#FFF4D8', .9); c.lineWidth = w / k * Math.min(1, k * 3) * .35; c.stroke(p);
  c.restore();
}
// about 1000 units tall: Hanuman's gada (a fluted round head on a long haft), Murugan's vel (a leaf-shaped head), the
// flute and the peacock feather for Krishna, the linga on its pitha for Shiva (about 900 wide)
const GADA_D = 'M 0 520 L 0 -125 M -45 520 L 45 520 M -38 400 L 38 400 M -38 360 L 38 360 M -62 -125 L 62 -125 M -175 -300 a 175 175 0 1 0 350 0 a 175 175 0 1 0 -350 0 M 0 -475 C -120 -420 -120 -180 0 -125 M 0 -475 C 120 -420 120 -180 0 -125 M 0 -475 L 0 -125 M -175 -300 C -100 -268 100 -268 175 -300 M -34 -468 L 0 -610 L 34 -468';
const VEL_D = 'M 0 500 L 0 -110 M 0 -520 C 120 -420 130 -230 0 -110 C -130 -230 -120 -420 0 -520 M 0 -450 L 0 -170 M -80 -90 L 80 -90 M -60 -50 L 60 -50 M -50 470 L 50 470';
const FLUTE_D = (() => { let d = 'M -440 260 L 440 -20'; for (let i = 0; i < 6; i++) { const u = .52 + i * .07, x = -440 + 880 * u, y = 260 - 280 * u; d += ` M ${x - 9} ${y} a 9 9 0 1 0 18 0 a 9 9 0 1 0 -18 0`; } return d; })();
const FEATHER_D = 'M 60 150 C 40 -60 10 -260 -20 -470 M -20 -470 C -170 -390 -190 -190 -10 -60 M -20 -470 C 140 -400 170 -200 40 -60';
const EYE_D = 'M -18 -330 m -64 0 a 64 86 0 1 0 128 0 a 64 86 0 1 0 -128 0 M -18 -322 m -30 0 a 30 42 0 1 0 60 0 a 30 42 0 1 0 -60 0';
const LINGA_D = 'M -170 300 L -150 230 L 150 230 L 170 300 M -260 230 C -270 180 -220 150 -150 150 L 300 150 C 360 152 380 175 420 190 L 440 205 C 430 222 400 225 330 215 L 150 230 M -110 150 L -110 -170 C -110 -290 110 -290 110 -170 L 110 150 M -90 -150 L 90 -150 M -92 -115 L 92 -115 M -92 -80 L 92 -80';
// emblem(c, id, x, y, s, t, a): the god's emblem at screen (x, y), s pixels a metre (it is about 1.8 m tall)
function emblem(c, id, x, y, s, t, a = 1) {
  if (a <= .01) return;
  const g = GODS.find(q => q.id === id), col = g ? g.col : '#BFD8FF', k = s * 1.8 / 1000;
  glow(c, x, y, s * 2.4, col, .3 * a);
  c.save(); c.globalAlpha *= a;
  if (id === 'hanuman') { c.translate(x, y); c.rotate(-.32); lightPath(c, GADA_D, 0, 0, k, col, 1, 10); }
  else if (id === 'murugan') lightPath(c, VEL_D, x, y, k, col, 1, 10);
  else if (id === 'krishna') { lightPath(c, FEATHER_D, x, y, k, '#4FD8C0', 1, 8); lightPath(c, EYE_D, x, y, k, '#5A8CFF', 1, 7); lightPath(c, FLUTE_D, x, y + s * .1, k, '#FFD27A', 1, 10); }
  else if (id === 'nava') {   // the nine grahas: Surya in the middle, the eight round him, turning slowly
    sunDisc(c, x, y, s * .2, t, { rays: .5 });
    GRAHAS.slice(1).forEach(([, , , , dot], i) => {
      const an = i / 8 * TAU + t * .35, px = x + Math.cos(an) * s * .62, py = y + Math.sin(an) * s * .62;
      glow(c, px, py, s * .2, dot, .55); ellipse(c, px, py, s * .065, s * .065, dot);
    });
    c.strokeStyle = rgba('#E8DCFF', .35); c.lineWidth = Math.max(1.5, s * .02); c.beginPath(); c.arc(x, y, s * .62, 0, TAU); c.stroke();
  }
  else if (id === 'shiva') { lightPath(c, LINGA_D, x, y + s * .1, k * 1.05, '#BFD8FF', 1, 10); ellipse(c, x, y - s * .25, s * .06, s * .06, '#FF5040'); }
  c.restore();
}
// a shrine's emblem point and its pixels a metre on the current camera
function emblemAt(id) {
  const g = GODS.find(q => q.id === id), p = g ? [g.at[0], g.top, g.at[1]] : [0, TOPY.centre, 0];
  const [x, y, z] = toScreen3(p), r = new THREE.Vector3().setFromMatrixColumn(CAM3.matrixWorld, 0), [x1, y1] = toScreen3([p[0] + r.x, p[1] + r.y, p[2] + r.z]);
  return { x, y, z, s: Math.hypot(x1 - x, y1 - y) };
}
// every emblem over the courtyard (o.a: alpha, a number or a function of the id); Shiva's in the middle stays faint
function emblems(c, t, o = {}) {
  for (const id of ['shiva', 'krishna', 'murugan', 'nava', 'hanuman']) {
    const a = (typeof o.a === 'function' ? o.a(id) : o.a ?? 1) * (id === 'shiva' ? o.shiva ?? .45 : 1), e = emblemAt(id);
    if (e.z < 1) emblem(c, id, e.x, e.y, Math.min(e.s, o.max || 200), t, a);
  }
}
// the count beside an emblem: pops at `at`, o.size, o.dx / o.dy (in emblem metres)
function count(c, txt, id, t, at, o = {}) {
  if (t < at) return;
  const e = emblemAt(id); if (e.z > 1) return;
  const x = e.x + e.s * (o.dx ?? 1.9), y = e.y + (o.dy ?? 0) * e.s, size = o.size || Math.max(56, Math.min(200, e.s * 1.5));
  text(c, txt, x, y, `700 ${size}px Cinzel`, o.col || '#FFE2A0', { pop: t - at, alpha: o.alpha ?? 1, glow: ['rgba(10,6,4,.95)', 22] });
}
// a source tag (a small pill) under a count: PURANA gold, VERSE grey, CUSTOM coral
function tag(c, txt, x, y, t, at, o = {}) {
  if (t < at) return;
  const k = popK(t - at), a = o.alpha ?? 1, col = TAGC[txt] || '#FFE2A0', f = `700 ${o.size || 30}px Cinzel`;
  c.save(); c.font = f; const w = c.measureText(txt).width + 44, h = (o.size || 30) * 1.6;
  c.translate(x, y); c.scale(k, k); c.globalAlpha *= a;
  c.fillStyle = 'rgba(16,10,8,.8)'; c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, h / 2); c.fill(); c.stroke();
  c.restore();
  text(c, txt, x, y + 2, f, col, { alpha: a * Math.min(1, k), spacing: 2 });
}
// a god's tag under their count, on the current camera
function tagAt(c, id, t, at, o = {}) { const g = GODS.find(q => q.id === id), e = emblemAt(id); if (e.z > 1) return; tag(c, g.tag, e.x + e.s * (o.dx ?? 1.9), e.y + e.s * (o.dy ?? .8), t, at, o); }

// a dark band behind 2D lettering over a bright frame (y0..y1, fading at both ends)
function band(c, y0, y1, a = .6) {
  c.save(); const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(6,5,10,0)'); g.addColorStop(.25, `rgba(6,5,10,${a})`); g.addColorStop(.75, `rgba(6,5,10,${a})`); g.addColorStop(1, 'rgba(6,5,10,0)');
  c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); c.restore();
}

// the screenshot board: the four gods, their rounds and where each number comes from, one row each
function board(c, t, t0, o = {}) {
  const a = seg(t, t0, t0 + .35) * (o.alpha ?? 1); if (a <= 0) return;
  const x0 = 70, x1 = 930, y0 = o.y0 ?? 560, rh = 148;
  c.save(); c.globalAlpha *= a; c.fillStyle = 'rgba(12,8,10,.82)'; c.strokeStyle = 'rgba(244,196,106,.8)'; c.lineWidth = 3;
  c.beginPath(); c.roundRect(x0, y0 - 100, x1 - x0, 110 + rh * 4 + 30, 34); c.fill(); c.stroke(); c.restore();
  text(c, 'PRADAKSHINA · PART 3', (x0 + x1) / 2, y0 - 45, '700 34px Cinzel', '#F4C46A', { alpha: a, spacing: 2 });
  GODS.forEach((g, i) => {
    const y = y0 + 70 + i * rh, ai = a * seg(t, t0 + .15 + i * .12, t0 + .45 + i * .12);
    c.save(); c.globalAlpha *= ai; emblem(c, g.id, x0 + 85, y, 52, t, 1); c.restore();
    c.save(); c.font = '700 44px Cinzel'; c.letterSpacing = '1px'; const nw = c.measureText(g.name).width; c.restore();
    text(c, g.name, x0 + 160 + nw / 2, y, '700 44px Cinzel', '#FFF3DC', { alpha: ai, spacing: 1 });
    text(c, g.count || String(g.n), 655, y, '700 62px Cinzel', '#FFE2A0', { alpha: ai, glow: ['rgba(10,6,4,.9)', 16] });
    tag(c, g.tag, 815, y, t, t0 + .3 + i * .12, { size: 24, alpha: ai });
  });
}
