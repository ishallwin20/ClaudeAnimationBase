// kai_props.js: what "No human has EVER climbed this mountain." adds to the Kailash set (cine3d_kailash.js): the
// height stage (Everest beside Kailash, a queue of climbers' headlamps up Everest), the four rivers, the kora's gold
// line and its walker, the ad 31 shrine with its footprints (the pradakshina callback), labels pinned to the 3D frame,
// and the 15K Family Deal card in Cinematic lettering.

// ---------- the height stage: Everest and Kailash side by side ----------
// 1 unit = 1/3 km above sea level: Everest's summit at 8.849 km → 26.5, Kailash's at 6.638 km → 19.9.
const STG = { k: 3, ex: -10, kx: 10, eH: 8.849 * 3, kH: 6.638 * 3 };
// Everest: a three-sided pyramid with sharp ridges
function everestH(x, z) {
  const N = [[0, -1], [.87, .5], [-.87, .5]].map(([a, b]) => { const r = .3; return [a * Math.cos(r) - b * Math.sin(r), a * Math.sin(r) + b * Math.cos(r)]; });
  const d = Math.max(...N.map(([a, b]) => x * a + z * b)), th = Math.atan2(z, x);
  let h = STG.eH - 1.25 * d - .02 * d * d;
  h += 1.1 * (kRidge(th * 5 + 1, d * .06, 3) - .45) * seg(h, 4, 10) + .5 * kFbm(x * .4, z * .4, 4);
  return h;
}
function stageH(x, z) {
  const k = kailashPeak(x - STG.kx, z, STG.kH / KAI.H), e = everestH(x - STG.ex, z);
  return Math.max(.3 * kFbm(x * .1, z * .1, 3), e, k);
}
function stage3() {
  const scene = new THREE.Scene();
  sky3(scene, [[1, '#04060E'], [.4, '#0A1430'], [.08, '#1C2C58'], [0, '#2E3E6E'], [-1, '#05060A']], { r: 2000 });
  const hemi = new THREE.HemisphereLight('#6A80C0', '#1A1418', .5); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#FFE2C0', 3.0); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  sun.position.set(-160, 120, 220); sun.target.position.set(0, 8, 0); Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 50, far: 700 });
  sun.shadow.bias = -.0004; sun.shadow.normalBias = .06; scene.add(sun, sun.target);
  const rim = new THREE.DirectionalLight('#7AA0FF', 1.2); rim.position.set(120, 40, -200); scene.add(rim);
  scene.fog = new THREE.Fog('#101A38', 120, 600);
  const geo = new THREE.PlaneGeometry(140, 80, 560, 320); geo.rotateX(-Math.PI / 2);
  const P = geo.attributes.position; for (let i = 0; i < P.count; i++) P.setY(i, stageH(P.getX(i), P.getZ(i)));
  geo.computeVertexNormals();
  const mat = terrainMat3({ snow: 13, cap: 17.6, band: 1.15 }); mesh3(scene, geo, mat);
  mesh3(scene, new THREE.PlaneGeometry(3000, 3000), mat, [0, -.05, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // the climbers: headlamps queued up Everest's south-east ridge (the busiest route), creeping upward
  const ridge = [.87 * Math.cos(.3) - .5 * Math.sin(.3), .87 * Math.sin(.3) + .5 * Math.cos(.3)], N = 160;
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
  const lamps = new THREE.Points(pg, new THREE.PointsMaterial({ map: glowTex3(), color: '#FFE6A0', size: .55, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  scene.add(lamps);
  const setLamps = (t, on) => {
    lamps.visible = on > .01; lamps.material.opacity = on;
    for (let i = 0; i < N; i++) {
      const k = ((i / N + t * .012) % 1), dd = lerp(19, .6, Math.pow(k, .8)), x = STG.ex + ridge[0] * dd + .25 * Math.sin(i * 7.1), z = ridge[1] * dd + .25 * Math.cos(i * 3.3);
      pg.attributes.position.setXYZ(i, x, stageH(x, z) + .25, z);
    }
    pg.attributes.position.needsUpdate = true;
  };
  return { scene, setLamps, top: { e: [STG.ex, STG.eH, 0], k: [STG.kx, STG.kH, 0] } };
}

// ---------- labels on the 3D frame ----------
// pin(c, txt, p, t, at, o): text pinned to a world point: pops at `at`; o.size, o.col, o.alpha, o.font, o.dy (px)
function pin(c, txt, p, t, at, o = {}) {
  const [x, y, z] = toScreen3(p); if (z > 1 || t < at) return;
  text(c, txt, x + (o.dx || 0), y + (o.dy || 0), o.font || `700 ${o.size || 48}px Cinzel`, o.col || '#F4C46A', { pop: t - at, alpha: o.alpha ?? 1, glow: ['rgba(6,6,14,.9)', 18], spacing: o.spacing ?? 2, maxW: o.maxW });
}
// a dashed line between two screen points
function dash(c, a, b, col, k = 1, w = 4) {
  if (k <= 0) return; c.save(); c.strokeStyle = col; c.lineWidth = w; c.setLineDash([16, 12]); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 8;
  c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(lerp(a[0], b[0], k), lerp(a[1], b[1], k)); c.stroke(); c.restore();
}

// ---------- the four rivers (x, z on the Kailash set; Tibet's four 'mouths': lion north, elephant west, peacock south, horse east) ----------
const RIVERS = [
  { name: 'INDUS', pts: [[14, -46], [8, -80], [-20, -130], [-60, -190], [-120, -260]], label: [-12, 0, -92], at: 'INDUS' },
  { name: 'SUTLEJ', pts: [[-60, 112], [-90, 104], [-140, 86], [-200, 74], [-280, 62]], label: [-62, 0, 86], at: 'SUTLEJ' },
  { name: 'BRAHMAPUTRA', pts: [[64, 150], [100, 160], [150, 150], [210, 130], [300, 136]], label: [58, 0, 178], at: 'BRAHMA' },
  { name: 'KARNALI', pts: [[-8, 152], [-18, 190], [-12, 240], [6, 300], [20, 380]], label: [-34, 0, 200], at: 'KARNALI' },
];

// ---------- the 15K Family Deal card (as ad 31) ----------
function dealCardCine(c, u, t) {
  sky(c, [[0, '#04100E'], [900, '#0F2A27'], [1920, '#050E0C']]);
  glow(c, 470, 950, 760, '#2E5F5A', .55, 'screen');
  motes(c, { n: 60, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#F4C46A', a: .6, vx: 6, vy: -26, t });
  const X = 470, pk = d => u - d, br = Math.sin(t * 1.3) * .008;
  picture(c, PICS.logo, X, 500, 120, 120, { pop: pk(.05), r: 60 });
  text(c, '15K FAMILY DEAL', X, 618, '700 66px Cinzel', '#F4C46A', { pop: pk(.1), glow: ['rgba(244,196,106,.55)', 26], spacing: 3, maxW: 860 });
  text(c, 'our thank-you to all of YOU', X, 688, '42px Marcellus', '#FBE0CF', { pop: pk(.25), maxW: 840 });
  [['book1', -1], ['book3', 1], ['book2', 0]].forEach(([b, i], j) => picture(c, PICS[b], X + i * 205, 905 + Math.abs(i) * 28, 250, 250, { rot: i * .1 + br, pop: pk(.4 + j * .12), r: 10, shadow: 26, glow: ['rgba(255,196,120,.28)', 40] }));
  text(c, 'Books 1–3 · Set of 3', X, 1112, '700 40px Poppins', '#FFFFFF', { pop: pk(1.2), maxW: 880 });
  text(c, '₹500', X - 120, 1186, '500 56px Poppins', '#9FB8B3', { pop: pk(1.2) });
  const ks = easeOut(seg(u, 1.7, 1.95));
  if (ks > 0) { c.save(); c.strokeStyle = '#F15A24'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(X - 185, 1196); c.lineTo(lerp(X - 185, X - 55, ks), lerp(1196, 1172, ks)); c.stroke(); c.restore(); }
  text(c, '₹350', X + 95, 1182, `700 ${88 * (1 + .04 * Math.max(0, Math.sin(t * 5)))}px Poppins`, '#F15A24', { pop: pk(1.7), glow: ['rgba(241,90,36,.45)', 24] });
  text(c, 'Only till 25 Oct, midnight', X, 1262, '700 40px Poppins', '#FF9A6A', { pop: pk(2.2), maxW: 860 });
  const k = popK(pk(2.7)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (k > .01) { c.save(); c.translate(X, 1350); c.scale(k, k); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-270, -48, 540, 96, 48); c.fill(); c.restore(); }
  text(c, 'Comment FAMILY', X, 1353, '700 52px Poppins', '#FFFFFF', { pop: pk(2.7) });
  text(c, "we'll DM you the deal · or tap the link in bio", X, 1428, '500 31px Poppins', '#CFE3DF', { pop: pk(3.2), maxW: 860 });
  text(c, 'Follow @therishikatha', X, 1478, '700 31px Poppins', '#F4C46A', { pop: pk(3.7), maxW: 860 });
}

// ---------- the ad 31 shrine, for the pradakshina callback ----------
// trail3 / trailShow: gold footprints along the shrine's pradakshina path (as in ad 31)
function trail3(parent, s0, s1, n, o = {}) {
  const feet = [];
  for (let i = 0; i < n; i++) {
    const s = lerp(s0, s1, i / (n - 1)), p = path3(s), dir = Math.sign(s1 - s0), hx = p.dx * dir, hz = p.dz * dir;
    const side = i % 2 ? 1 : -1, rx = -hz, rz = hx;
    feet.push(foot3(parent, p.x + rx * side * .11, p.z + rz * side * .11, yawOf(hx, hz), side, { col: o.col, size: o.size }));
  }
  return feet;
}
function trailShow(feet, t, tA, tB, o = {}) {
  const n = feet.length;
  feet.forEach((f, i) => { const ti = tA + (tB - tA) * i / Math.max(1, n - 1), on = seg(t, ti, ti + .12); f.material.opacity = (o.a ?? 1) * on; f.visible = on > 0; });
}

// ---------- prayer flags: strings fanning down from the top of a pole to the ground (the Dolma La) ----------
// flagFan(scene, top [x, y, z], ends [[x, y, z], ...], size): .set(t) flutters them
function flagFan(scene, top, ends, size = .04) {
  const G = new THREE.Group(); scene.add(G);
  const cols = ['#2F6FD0', '#F4F2EA', '#D8302A', '#2E9A4A', '#F2C21A'], F = [];
  mesh3(G, new THREE.CylinderGeometry(.006, .009, top[1] - ends[0][1] + .1, 6), new THREE.MeshStandardMaterial({ color: '#5A4632', roughness: .9 }), [top[0], (top[1] + ends[0][1]) / 2, top[2]]);
  ends.forEach((e, k) => {
    const a = V3(...top), b = V3(...e), N = Math.round(a.distanceTo(b) / (size * 1.25));
    for (let i = 1; i < N; i++) {
      const q = i / N, p = a.clone().lerp(b, q); p.y -= Math.sin(q * Math.PI) * a.distanceTo(b) * .08;
      const f = mesh3(G, new THREE.PlaneGeometry(size, size * 1.15), new THREE.MeshStandardMaterial({ color: cols[(i + k) % 5], side: THREE.DoubleSide, roughness: .9 }), [p.x, p.y - size * .6, p.z], { cast: false });
      f.rotation.y = Math.atan2(b.x - a.x, b.z - a.z) + Math.PI / 2; f.userData.ph = i * .8 + k * 2; F.push(f);
    }
  });
  G.set = (t) => F.forEach(f => { f.rotation.x = .45 * Math.sin(t * 7 + f.userData.ph) + .2; });
  return G;
}
