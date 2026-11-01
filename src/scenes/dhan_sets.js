// dhan_sets.js: the sets of "DHANTERAS was never about GOLD" (ad 71), in the 3D film look (cine3d_fx.js), all matte
// (owner, 30 Oct: nothing shiny; gold at metalness ≤ .6, roughness ≥ .45).
//   studio3()     a gold coin on maroon puja cloth in a dark studio: it spins on its edge, wobbles and falls flat;
//                 a heap of coins behind; the amrit kalash beside it for the ask (GOLD or HEALTH?)
//   ocean3()      the ocean of milk at a violet dawn (metres): Mount Mandara turning in it, Vasuki wound round it, his
//                 body running off to both horizons; the foam's swirl; the treasures rising as lights; Lakshmi's lotus;
//                 Dhanvantari rising out of the milk with the jug of amrit
//   door3()       a village doorway at dusk: lime-washed wall, a wooden frame, the lamp-lit room inside, a stone step,
//                 a rangoli, the clay lamp for Yama outside; a gold coin on the step; a row of lamps for next
// The kalash (kalash3) and Dhanvantari (dhanv3) are shared: the jug of amrit is the same object in every set.

// ---------- noise (JS, for building meshes) ----------
const nH3 = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
function noise3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), fx = x - xi, fy = y - yi, fz = z - zi;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
  const L = (a, b, k) => a + (b - a) * k, c = (i, j, k) => nH3(xi + i, yi + j, zi + k);
  return L(L(L(c(0, 0, 0), c(1, 0, 0), u), L(c(0, 1, 0), c(1, 1, 0), u), v), L(L(c(0, 0, 1), c(1, 0, 1), u), L(c(0, 1, 1), c(1, 1, 1), u), v), w) * 2 - 1;
}
const fbm3 = (x, y, z, n = 4) => { let s = 0, a = .5, f = 1; for (let i = 0; i < n; i++) { s += a * noise3(x * f, y * f, z * f); f *= 2.1; a *= .5; } return s; };
const smooth01 = x => { x = clamp(x); return x * x * (3 - 2 * x); };

// ---------- materials ----------
const DM = (() => {
  const std = (col, rough = .6, o = {}) => new THREE.MeshStandardMaterial({ color: col, roughness: rough, ...o });
  return {
    std,
    gold: new THREE.MeshStandardMaterial({ color: '#E2B04E', metalness: .6, roughness: .45, envMapIntensity: .6 }),
    goldD: new THREE.MeshStandardMaterial({ color: '#B8862E', metalness: .55, roughness: .5, envMapIntensity: .55 }),
    brass: new THREE.MeshStandardMaterial({ color: '#B98A3E', metalness: .5, roughness: .48, envMapIntensity: .55 }),
    // Dhanvantari's body: dark bronze (the Bhagavata's śyāma, dark), worn, matte
    bronze: new THREE.MeshStandardMaterial({ color: '#5A3C26', metalness: .55, roughness: .45, envMapIntensity: .6 }),
    lid: std('#24170E', .5, { metalness: .3 }),
    silk: std('#D0961E', .5, { emissive: '#2A1604', emissiveIntensity: .15 }), silkR: std('#B0221E', .5),
    white: std('#EDE4D2', .6, { emissive: '#4A463E', emissiveIntensity: .2 }), red: std('#C2141E', .45),
    pearl: std('#F2ECE0', .32, { emissive: '#5A564E', emissiveIntensity: .2 }),
    ruby: std('#C81828', .3, { metalness: .2, emissive: '#400408', emissiveIntensity: .5 }),
    mari: [std('#F29A18', .75), std('#E8641A', .75), std('#F6C228', .75)], rose: std('#B01830', .6),
    leaf: std('#3E6A2A', .7), clay: std('#9A4E2C', .88), clayD: std('#6E3420', .9),
    // the amrit: a warm gold light, the only emissive thing besides flames
    amrit: new THREE.MeshStandardMaterial({ color: '#FFC860', emissive: '#FFB040', emissiveIntensity: 1.4, roughness: .3 }),
  };
})();

// ---------- helpers ----------
// a tube along points (an arm, a necklace); r a number or [r0, r1] (tapering)
function tubeP3(parent, pts, r, mat, o = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => V3(...p))), geo = new THREE.TubeGeometry(curve, o.segs ?? 24, Array.isArray(r) ? r[0] : r, o.radial ?? 10, false);
  if (Array.isArray(r)) {
    const pos = geo.attributes.position, n = (o.segs ?? 24) + 1, rad = (o.radial ?? 10) + 1;
    for (let i = 0; i < n; i++) { const c = curve.getPointAt(i / (n - 1)), k = lerp(1, r[1] / r[0], i / (n - 1)); for (let j = 0; j < rad; j++) { const v = i * rad + j; pos.setXYZ(v, c.x + (pos.getX(v) - c.x) * k, c.y + (pos.getY(v) - c.y) * k, c.z + (pos.getZ(v) - c.z) * k); } }
    geo.computeVertexNormals();
  }
  return mesh3(parent, geo, mat, [0, 0, 0], o);
}
function beads3(parent, pts, n, size, mats, o = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => V3(...p))), geo = new THREE.IcosahedronGeometry(size, 1);
  for (let i = 0; i < n; i++) { const p = curve.getPointAt(i / (n - 1)); mesh3(parent, geo, mats[i % mats.length], [p.x, p.y, p.z], { cast: o.cast ?? true }); }
}
// a gradient backdrop: a sphere round everything
function backdrop3(scene, top, mid, bot, r = 60) {
  const t = tex3('bd' + top + mid + bot, 4, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, top); gr.addColorStop(.55, mid); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, 4, 256); });
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false }));
  scene.add(m); return m;
}
// a cloth: a plane with soft folds, calm within o.calm of the centre
function cloth3(parent, w, d, mat, pos, o = {}) {
  const g = new THREE.PlaneGeometry(w, d, 160, 160), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), calm = o.calm ? smooth01((Math.hypot(x, y) - o.calm) / 3) : 1; p.setZ(i, (o.fold ?? .12) * calm * (fbm3(x * .35, y * .35, 2) + .4 * Math.sin(x * .7 + y * .2))); }
  g.computeVertexNormals();
  return mesh3(parent, g, mat, pos, { rot: [-Math.PI / 2, 0, o.yaw ?? 0] });
}

// ---------- the gold coin ----------
// its face: a beaded rim, a ring, a lotus of eight petals round a dot (colour + bump from one drawing)
const coinFaceTex3 = (bump) => tex3('coin' + (bump ? 'B' : 'C'), 512, 512, (g, w, h) => {
  const cx = w / 2, cy = h / 2, R = w / 2;
  g.fillStyle = bump ? '#606060' : '#E2B04E'; g.fillRect(0, 0, w, h);
  const hi = bump ? '#F0F0F0' : '#F2CB70', lo = bump ? '#202020' : '#9C7224';
  g.strokeStyle = hi; g.lineWidth = 16; g.beginPath(); g.arc(cx, cy, R * .93, 0, TAU); g.stroke();
  for (let i = 0; i < 48; i++) { const a = i / 48 * TAU; g.fillStyle = hi; g.beginPath(); g.arc(cx + Math.cos(a) * R * .83, cy + Math.sin(a) * R * .83, 7, 0, TAU); g.fill(); }
  g.strokeStyle = lo; g.lineWidth = 5; g.beginPath(); g.arc(cx, cy, R * .76, 0, TAU); g.stroke();
  g.save(); g.translate(cx, cy);
  for (let i = 0; i < 8; i++) {
    g.save(); g.rotate(i / 8 * TAU);
    g.fillStyle = hi; g.beginPath(); g.moveTo(0, -R * .12); g.bezierCurveTo(R * .2, -R * .25, R * .14, -R * .55, 0, -R * .64); g.bezierCurveTo(-R * .14, -R * .55, -R * .2, -R * .25, 0, -R * .12); g.fill();
    g.strokeStyle = lo; g.lineWidth = 4; g.stroke();
    g.beginPath(); g.moveTo(0, -R * .18); g.lineTo(0, -R * .55); g.stroke();
    g.restore();
  }
  g.fillStyle = hi; g.beginPath(); g.arc(0, 0, R * .12, 0, TAU); g.fill(); g.strokeStyle = lo; g.lineWidth = 5; g.stroke();
  g.restore();
}, bump ? { data: true } : {});
// coin3(parent, r): a coin of radius r, its faces along local z; returns { group (spin about y), tilt (about x), mesh }
function coin3(parent, r = .5, o = {}) {
  const th = r * .13, group = new THREE.Group(); parent.add(group);
  const tilt = new THREE.Group(); group.add(tilt); tilt.rotation.order = 'XYZ';
  const face = new THREE.MeshStandardMaterial({ color: '#FFFFFF', map: coinFaceTex3(false), bumpMap: coinFaceTex3(true), bumpScale: 2.2, metalness: .6, roughness: .45, envMapIntensity: .6 });
  const geo = new THREE.CylinderGeometry(r, r, th, 96, 1);
  const edge = new THREE.MeshStandardMaterial({ color: '#D8A445', metalness: .6, roughness: .5, envMapIntensity: .6, bumpMap: tex3('reed', 512, 8, (g, w, h) => { for (let x = 0; x < w; x += 4) { g.fillStyle = x % 8 ? '#FFFFFF' : '#000000'; g.fillRect(x, 0, 4, h); } }, { data: true }).rep(6, 1), bumpScale: 1 });
  const m = mesh3(tilt, geo, [edge, face, face], [0, 0, 0], { rot: [Math.PI / 2, 0, 0] });
  if (o.cast === false) m.castShadow = false;
  return { group, tilt, mesh: m, r, th };
}
// standing on its edge at (x, z), spun by phi, tipped back by theta (0 on edge, π/2 flat)
function coinPose(C, x, z, phi, theta, y0 = 0) {
  C.group.position.set(x, y0 + C.r * Math.cos(theta) + C.th / 2 * Math.sin(theta), z);
  C.group.rotation.set(0, phi, 0); C.tilt.rotation.set(-theta, 0, 0);
}

// ---------- the kalash with the amrit ----------
// a brass jug (the Bhagavata's kalaśa), its mouth brimming with glowing amrit; the group's origin at its foot; ~.5 tall
function kalash3(parent, o = {}) {
  const K = new THREE.Group(); parent.add(K);
  const prof = [[0, 0], [.1, 0], [.12, .015], [.1, .035], [.14, .07], [.2, .14], [.225, .22], [.215, .3], [.18, .36], [.12, .4], [.095, .43], [.1, .46], [.135, .49], [.145, .505], [.13, .51], [.09, .48], [0, .47]];
  mesh3(K, lathe3(smooth3(prof, 3), 64), new THREE.MeshStandardMaterial({ color: '#C08C3C', metalness: .55, roughness: .46, envMapIntensity: .6, side: THREE.DoubleSide }), [0, 0, 0]);
  // incised bands
  for (const y of [.14, .3]) mesh3(K, new THREE.TorusGeometry(lerp(.2, .215, (y - .14) / .16), .006, 6, 64), DM.goldD, [0, y, 0], { rot: [Math.PI / 2, 0, 0], cast: false });
  // the amrit: a domed, glowing surface brimming at the mouth
  const am = mesh3(K, new THREE.SphereGeometry(.105, 32, 12, 0, TAU, 0, Math.PI / 2), DM.amrit, [0, .478, 0], { scale: [1, .32, 1], cast: false });
  const light = new THREE.PointLight('#FFC060', o.power ?? 2, o.range ?? 3, 1.6); light.position.set(0, .6, 0); K.add(light);
  const halo = glow3(K, [0, .56, 0], o.halo ?? .9, '#FFC870', .55);
  K.set = (t, on = 1) => {
    am.material.emissiveIntensity = 1.4 * on * (1 + .08 * Math.sin(t * 5.3) + .05 * Math.sin(t * 13));
    light.intensity = (o.power ?? 2) * on * (1 + .1 * Math.sin(t * 4.1)); halo.material.opacity = .55 * on;
  };
  K.amrit = am; K.light = light; K.halo = halo;
  return K;
}

// ================= the studio: the coin =================
function studio3() {
  const S = new THREE.Scene();
  backdrop3(S, '#040305', '#0C0709', '#1A0B0A');
  S.environment = studioEnv3({ floor: .5, boxes: [[-6, 6, 5, 6, 4, 6], [7, 3, 1, 1.2, 8, 5], [0, 4, -8, 9, 2.4, 8], [0, 12, 0, 6, 6, 2]] }); S.environmentIntensity = .7;
  const clothM = pbr3('redwool', { rep: [6, 6], tint: '#8A1E18', normalK: .7 });
  cloth3(S, 40, 40, clothM, [0, -.02, 0], { fold: .18, calm: 2.2 });
  S.fog = new THREE.Fog('#070405', 9, 22);
  const key = new THREE.DirectionalLight('#FFEBD0', 2.6); key.position.set(-3, 5, 5); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: .5, far: 20 }); key.shadow.radius = 6; key.shadow.bias = -.0004; key.shadow.normalBias = .02; S.add(key, key.target);
  const rim = new THREE.SpotLight('#FFB868', 50, 16, .5, .7, 1.4); rim.position.set(3.5, 2.6, -4.5); S.add(rim, rim.target);
  const fill = new THREE.PointLight('#FFC890', 2, 10, 1.5); fill.position.set(2, .8, 3); S.add(fill);
  const motes = motes3(S, { n: 90, box: [-4, 0, -7, 4, 3.5, .8], size: .0022, col: '#FFDDA8', drift: [.02, .04, 0] });
  // the hero coin, and the heap behind it: coins stacked and scattered
  const coin = coin3(S, .5);
  const heap = new THREE.Group(); S.add(heap); const r = lcg(71);
  for (let i = 0; i < 46; i++) {
    const a = r() * TAU, d = Math.pow(r(), .6) * 1.1, C = coin3(heap, .5, { cast: i < 20 });
    const stack = d < .5 ? Math.floor(r() * 3) : 0;
    coinPose(C, Math.cos(a) * d, Math.sin(a) * d, r() * TAU, Math.PI / 2 - r() * .25, stack * .066 + (d < .7 ? r() * .05 : 0));
  }
  heap.position.set(-.6, 0, -2.4);
  // the kalash, for the ask (beside the coin, at the same size as a big coin)
  const K = kalash3(S, { power: 1.6, range: 3, halo: .8 }); K.scale.setScalar(2.1); K.visible = false;
  const set = (t) => { motes.set(t, .6); };
  return { S, coin, heap, K, key, rim, fill, set };
}

// ================= the ocean of milk =================
// the milk: an opaque cream surface with slow swells (normal maps scrolled), and the foam's swirl round the mountain
const milkNormal3 = () => tex3('milkN', 512, 512, (g, w, h) => {
  const o = g.createImageData(w, h), W2 = [[2, 1, 1], [-1, 3, .8], [4, -2, .5], [1, 6, .35], [-5, -3, .3], [7, 2, .2]];
  const H_ = (x, y) => W2.reduce((s, [a, b, k], i) => s + k * Math.sin((a * x + b * y) / w * TAU + i * 1.7), 0);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = (H_(x + 1, y) - H_(x - 1, y)) * 5, dy = (H_(x, y + 1) - H_(x, y - 1)) * 5, l = Math.hypot(dx, dy, 1), k = (y * w + x) * 4;
    o.data[k] = (-dx / l * .5 + .5) * 255; o.data[k + 1] = (dy / l * .5 + .5) * 255; o.data[k + 2] = (1 / l * .5 + .5) * 255; o.data[k + 3] = 255;
  }
  g.putImageData(o, 0, 0);
}, { data: true });
// the swirl: curved streaks spiralling in (alpha), drawn in polar space so the ring's u runs round it
const swirlTex3 = () => tex3('swirl', 1024, 256, (g, w, h) => {
  g.clearRect(0, 0, w, h); const r = lcg(9);
  for (let i = 0; i < 420; i++) {
    const x = r() * w, y = r() * h, len = 60 + r() * 260, lean = 30 + r() * 70, a = .08 + r() * .3, wd = 1 + r() * 5;
    g.strokeStyle = r() < .5 ? `rgba(255,252,244,${a})` : `rgba(150,130,110,${a * .5})`; g.lineWidth = wd; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + len * .5, y + lean * .3, x + len, y + lean); g.stroke();
    if (x + len > w) { g.beginPath(); g.moveTo(x - w, y); g.quadraticCurveTo(x - w + len * .5, y + lean * .3, x - w + len, y + lean); g.stroke(); }
  }
});
const scaleTex3 = (bump) => tex3('scale' + (bump ? 'B' : 'C'), 256, 256, (g, w, h) => {
  g.fillStyle = bump ? '#404040' : '#1E3A3A'; g.fillRect(0, 0, w, h);
  const s = 32;
  for (let row = -1; row < h / (s * .5) + 1; row++) for (let col = -1; col < w / s + 1; col++) {
    const x = col * s + (row % 2 ? s / 2 : 0), y = row * s * .5;
    const gr = g.createRadialGradient(x, y - s * .2, 1, x, y, s * .62);
    if (bump) { gr.addColorStop(0, '#F0F0F0'); gr.addColorStop(.8, '#909090'); gr.addColorStop(1, '#202020'); }
    else { gr.addColorStop(0, '#5E8A72'); gr.addColorStop(.7, '#2C5248'); gr.addColorStop(1, '#0E1E1E'); }
    g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, s * .55, s * .5, 0, 0, Math.PI); g.fill();
  }
  if (!bump) { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(210,190,120,.0)'); gr.addColorStop(.85, 'rgba(210,190,120,.0)'); gr.addColorStop(.95, 'rgba(210,190,120,.35)'); gr.addColorStop(1, 'rgba(210,190,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
}, bump ? { data: true } : {});

// the mountain's radius at height y (its base at y -6, its top at 74)
const MH = 70, MR = 19;
const mR = (y) => { const k = clamp((y + 6) / (MH + 6)); return MR * Math.pow(1 - k, .62) * (1 + .1 * Math.exp(-((y + 6) / 6))) + 1.2; };

function ocean3() {
  const S = new THREE.Scene();
  // the sky: deep violet overhead, rose, a gold horizon; the sun just rising behind the mountain
  const sky = sky3(S, [[1, '#1A1C46'], [.5, '#3E3468'], [.22, '#8A5A7E'], [.08, '#E2967A'], [0, '#FFD29A'], [-.2, '#FFE2B8'], [-1, '#FFE2B8']], { r: 1800 });
  S.fog = new THREE.Fog('#F6D2AA', 180, 1500);
  env3(S, 'dawn', { k: .6, rot: 1.2 });
  const sun = new THREE.DirectionalLight('#FFD6A0', 2.4); sun.position.set(-160, 70, -260); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -70, right: 70, top: 90, bottom: -20, near: 10, far: 700 }); sun.shadow.bias = -.0006; sun.shadow.normalBias = .3; S.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight('#B8A8D8', '#FFE8D0', .7); S.add(hemi);
  const front = new THREE.DirectionalLight('#FFC8A8', .9); front.position.set(200, 60, 160); S.add(front);
  const sunGlow = glow3(S, [-420, 40, -820], 520, '#FFD8A0', .8);
  sunGlow.material.fog = false;

  // the milk
  const n1 = milkNormal3().rep(60, 60), n2 = milkNormal3().rep(140, 110);
  const milkM = new THREE.MeshPhysicalMaterial({ color: '#F4EDE0', roughness: .34, metalness: 0, normalMap: n1, normalScale: new THREE.Vector2(.45, .45), clearcoat: .45, clearcoatRoughness: .2, clearcoatNormalMap: n2, sheen: .4, sheenColor: new THREE.Color('#FFF4E0'), envMapIntensity: .7 });
  const milk = mesh3(S, new THREE.PlaneGeometry(4000, 4000), milkM, [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: true });
  // the swirl round the mountain, turning with it
  const sw = swirlTex3(); sw.wrapS = THREE.RepeatWrapping; sw.repeat.set(3, 1);
  const swirlM = new THREE.MeshStandardMaterial({ map: sw, transparent: true, roughness: .5, depthWrite: false, color: '#FFFFFF' });
  const ring = new THREE.RingGeometry(MR * .8, 120, 160, 8);
  { const p = ring.attributes.position, uv = ring.attributes.uv; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), rr = Math.hypot(x, y); uv.setXY(i, (Math.atan2(y, x) / TAU + .5), clamp((rr - MR * .8) / (120 - MR * .8))); } }
  const swirl = mesh3(S, ring, swirlM, [0, .15, 0], { rot: [-Math.PI / 2, 0, 0], cast: false }); swirl.renderOrder = 1;
  // a fading alpha toward the outer edge
  swirlM.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n diffuseColor.a *= smoothstep(1.0, .35, vMapUv.y) * smoothstep(0.0, .05, vMapUv.y);'); };
  // foam churned up against the mountain's foot: a ring of soft white lumps
  const foamM = DM.std('#FFF8EC', .6), foam = new THREE.Group(); S.add(foam);
  { const r = lcg(3); for (let i = 0; i < 70; i++) { const a = r() * TAU, d = mR(0) + .5 + r() * 4, s = .8 + r() * 2.2; mesh3(foam, new THREE.SphereGeometry(s, 12, 8), foamM, [Math.cos(a) * d, -s * .45, Math.sin(a) * d], { scale: [1.6, .6, 1.2], rot: [0, a, 0], cast: false }); } }

  // Mount Mandara: a tall rocky peak, ridged, its lower slopes forested
  const M = new THREE.Group(); S.add(M);
  {
    const g = new THREE.CylinderGeometry(1, 1, 1, 160, 120, true), p = g.attributes.position, col = new Float32Array(p.count * 3);
    const rock = new THREE.Color('#6A5E58'), rock2 = new THREE.Color('#3E3634'), green = new THREE.Color('#3A5A30'), green2 = new THREE.Color('#24401E'), c = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const ux = p.getX(i), uz = p.getZ(i), y = (p.getY(i) + .5) * (MH + 6) - 6, a = Math.atan2(uz, ux);
      const ridge = 1 - Math.abs(noise3(Math.cos(a) * 3, y * .05, Math.sin(a) * 3)), n = fbm3(Math.cos(a) * 2.2, y * .06, Math.sin(a) * 2.2, 5);
      const gully = 1 - Math.abs(noise3(Math.cos(a) * 7, y * .025, Math.sin(a) * 7));
      const lobe = noise3(Math.cos(a) * 1.3 + 4, y * .03, Math.sin(a) * 1.3);
      const R = mR(y) * (1 + .26 * n + .16 * ridge * ridge + .1 * gully * gully + .32 * lobe);
      p.setXYZ(i, Math.cos(a) * R, y, Math.sin(a) * R);
      const gk = smooth01((32 - y) / 14) * smooth01((n + .1) * 3), dk = clamp(.5 + n * 1.5);
      c.copy(rock).lerp(rock2, dk).lerp(green, gk * .9).lerp(green2, gk * dk * .6); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals();
    const nm = (window.PBR3DATA || {}).cliff ? imgTex3('pbr_cliff_normal', PBR3DATA.cliff.normal, { data: true }).rep(10, 8) : null;
    mesh3(M, g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .92, normalMap: nm, normalScale: new THREE.Vector2(1.4, 1.4) }), [0, 0, 0]);
    // a forest on the lower slopes: dark cones, instanced
    const tg = new THREE.ConeGeometry(.9, 3.2, 6); tg.translate(0, 1.4, 0);
    const trees = new THREE.InstancedMesh(tg, new THREE.MeshStandardMaterial({ color: '#2E4A26', roughness: .9 }), 900), mt = new THREE.Matrix4(), q = new THREE.Quaternion(), r = lcg(17);
    let n = 0;
    for (let i = 0; i < 4000 && n < 900; i++) {
      const y = 1 + r() * 30, a = r() * TAU, f = fbm3(Math.cos(a) * 2.2, y * .06, Math.sin(a) * 2.2, 5);
      if (f < -.05 || r() > smooth01((34 - y) / 12) + .1) continue;
      const R = mR(y) * (1 + .26 * f) + .2, s = .7 + r() * .9;
      mt.compose(V3(Math.cos(a) * R, y - .5, Math.sin(a) * R), q.setFromEuler(new THREE.Euler((r() - .5) * .2, r() * TAU, (r() - .5) * .2)), V3(s, s * (.8 + r() * .5), s));
      trees.setMatrixAt(n++, mt);
    }
    trees.count = n; trees.castShadow = true; M.add(trees);
    // a rounded summit
    const crag = new THREE.MeshStandardMaterial({ color: '#5A504A', roughness: .95, normalMap: nm });
    [[0, MH - 4, 0, 3.2, 12], [2.6, MH - 9, 1.5, 2.4, 9], [-2.4, MH - 11, -1.2, 2.2, 8]].forEach(([x, y, z, r, h]) => mesh3(M, new THREE.ConeGeometry(r, h, 7, 3), crag, [x, y + h / 2 - 2, z], { rot: [.08 * x, 0, -.06 * z] }));
  }

  // Vasuki: wound round the mountain two and a half times, his body running off to both horizons (the gods hold one
  // end far away, the asuras the other); the scales scroll as he is pulled to and fro
  const vasM = new THREE.MeshStandardMaterial({ map: scaleTex3(false), bumpMap: scaleTex3(true), bumpScale: 1.4, roughness: .5, metalness: .05, envMapIntensity: .5 });
  const vPts = [[-900, 16, 60], [-300, 14, 28], [-70, 11, 14]];
  const T0 = 2.9, T1 = 2.5 * TAU + T0;
  for (let i = 0; i <= 60; i++) { const k = i / 60, a = lerp(T0, T1, k), y = lerp(10, 30, k), R = mR(y) * 1.06 + 1.9; vPts.push([Math.cos(a) * R, y, Math.sin(a) * R]); }
  vPts.push([60, 31, -8], [300, 29, -40], [900, 27, -80]);
  const vCurve = new THREE.CatmullRomCurve3(vPts.map(p => V3(...p)), false, 'centripetal');
  const vLen = vCurve.getLength();
  vasM.map.repeat.set(vLen / 9, 1); vasM.bumpMap.repeat.set(vLen / 9, 1);
  const vas = mesh3(S, new THREE.TubeGeometry(vCurve, 900, 2.1, 20, false), vasM, [0, 0, 0]);

  // the treasures: lights rising out of the foam (the wish-cow, the elephant, the jewel), each a glow and a spark
  const treasures = [['#FFF6E8', [26, 0, 22]], ['#F4F0FF', [-30, 0, 20]], ['#FF6A8A', [8, 0, 34]]].map(([col, p]) => {
    const g = new THREE.Group(); g.position.set(...p); S.add(g);
    const halo = glow3(g, [0, 0, 0], 26, col, .9), core = glow3(g, [0, 0, 0], 7, '#FFFFFF', 1);
    halo.material.fog = core.material.fog = false;
    return { g, halo, core, base: p };
  });

  // Lakshmi's lotus: three rings of pink petals round a gold seed pod, rising and opening on the milk
  const lotus = new THREE.Group(); S.add(lotus);
  const pm = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .62, side: THREE.DoubleSide, emissive: '#3A0A18', emissiveIntensity: .25 });
  const petals = [];
  [[10, 7, 3.2, .5, .9], [9, 6, 2.6, .3, .7], [7, 4.6, 2, .12, .45]].forEach(([n, L, Wd, base, bend], ring) => {
    for (let i = 0; i < n; i++) {
      const pv = new THREE.Group(); pv.rotation.y = i / n * TAU + ring * .3; lotus.add(pv);
      const geo = petal3(L, Wd, { base, bend, cup: .5, c0: '#FFF0F2', c1: '#F06A96', c2: '#E04880', cP: 1.4 });
      const m = mesh3(pv, geo, pm, [0, 0, 0]); petals.push({ pv, m, base, bend, ring });
    }
  });
  mesh3(lotus, lathe3([[0, 0], [1.4, 0], [1.6, .6], [1.5, 1.1], [0, 1.2]], 40), DM.std('#E8C04A', .6, { emissive: '#5A3A08', emissiveIntensity: .4 }), [0, .3, 0]);
  const lotusHalo = glow3(lotus, [0, 8, 0], 40, '#FFC8D8', .0); lotusHalo.material.fog = false;
  // leaves around it
  const leafM = DM.std('#3C6A34', .7, { side: THREE.DoubleSide });
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + .4; mesh3(lotus, new THREE.CircleGeometry(4.2, 40, .3, TAU - .6), leafM, [Math.cos(a) * 9, .05, Math.sin(a) * 9], { rot: [-Math.PI / 2, 0, a], cast: false }); }
  lotus.position.set(-46, 0, 62);
  lotus.open = (k) => petals.forEach(({ pv, m, base, bend, ring }) => { m.rotation.x = lerp(-.05, base + bend * .55, k) - base; m.rotation.x *= 1; pv.scale.setScalar(lerp(.55, 1, k)); });

  // Dhanvantari, rising out of the milk with the jug of amrit
  const D = dhanv3(S); D.group.scale.setScalar(9); D.group.position.set(34, 0, -6); D.group.rotation.y = -.25;
  const ripples = [0, 1, 2].map(i => { const m = mesh3(S, new THREE.RingGeometry(.96, 1, 96), new THREE.MeshBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0, depthWrite: false }), [34, .25, -6], { rot: [-Math.PI / 2, 0, 0], cast: false }); return m; });

  const set = (t, o = {}) => {
    // the churn: Mandara turns to and fro; the swirl turns with it; Vasuki's scales slide as he is pulled
    const sp = o.churn ?? 1, ang = (o.angle ?? 0) + .55 * Math.sin(t * .9 * sp) + t * .05 * sp;
    M.rotation.y = ang; swirl.rotation.z = -ang * 1.3 - t * .02; foam.rotation.y = ang * .9;
    const pull = Math.sin(t * .9 * sp) * 2.4 + t * .4;
    vasM.map.offset.x = pull / 9; vasM.bumpMap.offset.x = pull / 9;
    n1.offset.set(t * .004, t * .008); n2.offset.set(-t * .006, t * .01);
    sunGlow.material.opacity = o.sunGlow ?? .8;
    treasures.forEach(T => { T.g.visible = false; });
    lotus.visible = false; D.group.visible = false; vas.visible = true;
    lotus.position.set(-46, 0, 62); D.group.position.set(34, D.group.position.y, -6); D.group.rotation.y = -.25; ripples.forEach(r => { r.material.opacity = 0; });
    sun.intensity = 2.4 * (o.sun ?? 1); hemi.intensity = .7 * (o.hemi ?? 1); front.intensity = .9 * (o.front ?? 1);
  };
  // a treasure i rising from t0 (it climbs, then drifts up and away)
  const rise = (i, t, t0) => {
    const T = treasures[i], k = t - t0; if (k < 0) return;
    T.g.visible = true; const y = 2 + 36 * easeOut(k / 2.2) + 4 * k;
    T.g.position.set(T.base[0], y, T.base[2]);
    const a = clamp(k * 3) * (1 - seg(k, 4, 5)); T.halo.material.opacity = .85 * a; T.core.material.opacity = a * (1 + .2 * Math.sin(t * 9 + i));
  };
  // Dhanvantari's rise: k 0..1 (under the milk → standing, the milk at his shins)
  const dRise = (t, k) => {
    D.group.visible = true; D.group.position.y = lerp(-D.H * 9 - 1, -.42 * 9, easeOut(k));
    D.set(t);
    ripples.forEach((r, i) => { const a = ((t * .45 + i / 3) % 1); r.position.x = D.group.position.x; r.position.z = D.group.position.z; r.scale.setScalar(6 + a * 40); r.material.opacity = (1 - a) * .35 * clamp(k * 3); });
  };
  return { S, M, milk, swirl, vas, sun, hemi, sunGlow, treasures, lotus, lotusHalo, D, set, rise, dRise };
}

// ---------- Dhanvantari: a bronze murti, after the Bhagavata (8.8.32–33): dark-bodied, young, garlanded, ornamented,
// in yellow silk, pearl earrings, carrying the jug of amrit. Four arms: the chakra and the conch raised (Vishnu's, as
// his images show him), the lower right holding a sprig of healing herbs, the lower left the jug at his side.
// Units: about 1.65 tall to the crown's tip, standing at the group's origin, facing +x.
function dhanv3(scene) {
  const M = new THREE.Group(); scene.add(M);
  const B = DM.bronze, sc = (g, s) => { g.scale(...s); return g; };
  for (const s of [-1, 1]) {
    mesh3(M, sc(new THREE.SphereGeometry(.1, 20, 12), [1, .32, .45]), B, [.06, .03, s * .085]);
    mesh3(M, new THREE.SphereGeometry(.045, 12, 8), B, [.0, .07, s * .085]);
    mesh3(M, new THREE.TorusGeometry(.05, .012, 8, 24), DM.gold, [0, .1, s * .085], { rot: [Math.PI / 2, 0, 0] });
    mesh3(M, new THREE.CylinderGeometry(.06, .044, .32, 16), B, [.0, .24, s * .085]);
  }
  const dh = lathe3(smooth3([[.0, .3], [.2, .3], [.22, .34], [.215, .5], [.2, .68], [.175, .86], [.16, .93], [0, .93]], 4), 48);
  mesh3(M, dh, DM.silk, [0, 0, 0], { scale: [.62, 1, 1] });
  mesh3(M, new THREE.TorusGeometry(.205, .014, 8, 48), DM.silkR, [0, .32, 0], { rot: [Math.PI / 2, 0, 0], scale: [.62, 1, 1] });
  block3(M, .02, .6, .07, DM.goldD, [.128, .32, 0]);
  const tor = lathe3(smooth3([[0, .9], [.15, .9], [.15, .98], [.165, 1.08], [.2, 1.2], [.205, 1.28], [.17, 1.33], [.07, 1.37], [0, 1.37]], 4), 48);
  mesh3(M, tor, B, [0, 0, 0], { scale: [.62, 1, 1] });
  mesh3(M, new THREE.TorusGeometry(.158, .016, 8, 48), DM.gold, [0, .925, 0], { rot: [Math.PI / 2, 0, 0], scale: [.62, 1, 1] });
  mesh3(M, new THREE.SphereGeometry(.026, 12, 8), DM.ruby, [.1, .925, 0]);
  tubeP3(M, [[.02, 1.33, .1], [.075, 1.3, .05], [.085, 1.285, 0], [.075, 1.3, -.05], [.02, 1.33, -.1]], .014, DM.gold, { segs: 20 });
  tubeP3(M, [[.03, 1.33, .13], [.11, 1.18, .08], [.13, 1.12, 0], [.11, 1.18, -.08], [.03, 1.33, -.13]], .009, DM.gold, { segs: 24 });
  beads3(M, [[.03, 1.32, .15], [.12, 1.08, .09], [.135, 1.02, 0], [.12, 1.08, -.09], [.03, 1.32, -.15]], 30, .008, [DM.pearl]);
  // the sacred thread over the left shoulder (his left is -z) to the right hip
  tubeP3(M, [[.02, 1.32, -.16], [.11, 1.16, -.06], [.122, 1.02, .06], [.1, .93, .13]], .005, DM.white, { segs: 20, cast: false });
  // the garland: flowers from the shoulders to below the knees
  beads3(M, [[.0, 1.3, .2], [.1, 1.05, .19], [.15, .7, .17], [.17, .44, .1], [.175, .4, 0], [.17, .44, -.1], [.15, .7, -.17], [.1, 1.05, -.19], [.0, 1.3, -.2]], 130, .016, [DM.mari[0], DM.mari[2], DM.mari[1], DM.mari[0], DM.mari[2], DM.rose]);
  // the arms (+z is his right)
  const arm = (pts, r0, r1) => { tubeP3(M, pts.slice(0, 2), [r0, (r0 + r1) / 2], B, { segs: 8 }); tubeP3(M, pts.slice(1), [(r0 + r1) / 2, r1], B, { segs: 10 }); };
  const UR = [[0, 1.27, .2], [-.02, 1.18, .32], [.02, 1.42, .36]], UL = UR.map(([x, y, z]) => [x, y, -z]);
  const LR = [[.0, 1.24, .19], [.06, 1.02, .25], [.2, 1.0, .2]], LL = [[.0, 1.24, -.19], [.04, 1.02, -.27], [.14, .9, -.27]];
  for (const P of [UR, UL, LR, LL]) arm(P, .048, .034);
  const ring = (p, r, rot) => mesh3(M, new THREE.TorusGeometry(r, .01, 6, 20), DM.gold, p, { rot });
  for (const s of [-1, 1]) { ring([-.01, 1.2, s * .28], .045, [0, 0, s * .4]); ring([.015, 1.38, s * .355], .036, [Math.PI / 2, 0, 0]); }
  ring([.17, 1.0, .21], .034, [0, 0, 1.3]); ring([.12, .91, -.27], .034, [0, 0, .9]);
  const hand = (p, s = [1, 1, 1]) => mesh3(M, sc(new THREE.SphereGeometry(.04, 14, 10), s), B, p);
  hand([.02, 1.45, .36], [.7, 1.2, .9]); hand([.02, 1.45, -.36], [.7, 1.2, .9]);
  hand([.23, 1.0, .19], [1.1, .9, .9]); hand([.17, .88, -.27], [1, 1.1, .9]);
  // the chakra (upper right) and the conch (upper left)
  const chakra = new THREE.Group(); chakra.position.set(.03, 1.56, .37); M.add(chakra);
  mesh3(chakra, new THREE.TorusGeometry(.085, .012, 8, 40), DM.gold, [0, 0, 0], { rot: [0, Math.PI / 2, 0] });
  mesh3(chakra, new THREE.CylinderGeometry(.022, .022, .016, 16), DM.gold, [0, 0, 0], { rot: [0, 0, Math.PI / 2] });
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI; mesh3(chakra, new THREE.CylinderGeometry(.004, .004, .16, 5), DM.gold, [0, 0, 0], { rot: [a, 0, 0], cast: false }); }
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; mesh3(chakra, new THREE.ConeGeometry(.012, .035, 6), DM.gold, [0, Math.sin(a) * .105, Math.cos(a) * .105], { rot: [-(a - Math.PI / 2), 0, 0], cast: false }); }
  mesh3(M, lathe3(smooth3([[0, 0], [.02, .01], [.045, .05], [.05, .09], [.035, .13], [.012, .16], [0, .17]], 4), 24), DM.pearl, [.03, 1.47, -.37], { rot: [.5, 0, .35] });
  mesh3(M, new THREE.TorusGeometry(.047, .007, 6, 20), DM.gold, [.03, 1.53, -.38], { rot: [Math.PI / 2 + .5, .35, 0] });
  // the herbs (lower right): a sprig of leaves
  const herb = new THREE.Group(); herb.position.set(.25, 1.02, .19); M.add(herb);
  tubeP3(herb, [[0, -.03, 0], [.01, .06, .0], [.0, .16, -.01]], .004, DM.leaf, { segs: 8, radial: 5 });
  for (let i = 0; i < 7; i++) { const y = .03 + i * .02, s = i % 2 ? 1 : -1; mesh3(herb, sc(new THREE.SphereGeometry(.022, 10, 6), [.25, 1, .5]), DM.leaf, [.0, y + .01, s * .016], { rot: [s * .8, 0, 0], cast: false }); }
  // the jug of amrit (lower left), at his side
  const K = kalash3(M, { power: 1, range: 1.2, halo: .45 }); K.scale.setScalar(.42); K.position.set(.2, .82, -.27);
  // neck, head, face (as ad 54's murti: an oval face, a ridge nose, half-closed eyes, no painted lips)
  mesh3(M, new THREE.CylinderGeometry(.055, .065, .1, 16), B, [0, 1.38, 0]);
  const head = new THREE.Group(); head.position.set(0, 1.51, 0); M.add(head);
  const hg = new THREE.SphereGeometry(.1, 40, 30), hp = hg.attributes.position;
  for (let i = 0; i < hp.count; i++) {
    let x = hp.getX(i), y = hp.getY(i) * 1.18, z = hp.getZ(i);
    const lo = clamp(-y / .118), k = 1 - .3 * lo * lo;
    x *= .95 * k; z *= .9 * k; if (x > 0) x *= 1 + .08 * (1 - Math.abs(z) / .09);
    hp.setXYZ(i, x, y, z);
  }
  hg.computeVertexNormals(); mesh3(head, hg, B, [0, -.005, 0]);
  const nose = mesh3(head, new THREE.CylinderGeometry(.003, .014, .062, 3), B, [.096, -.004, 0], { rot: [0, 0, -.12] });
  nose.rotation.order = 'ZYX'; nose.rotation.y = Math.PI;
  mesh3(head, sc(new THREE.SphereGeometry(.011, 10, 8), [1, .7, 1.5]), B, [.1, -.033, 0]);
  mesh3(head, sc(new THREE.SphereGeometry(.016, 12, 8), [.45, .32, 1.25]), B, [.088, -.06, 0]);
  for (const s of [-1, 1]) {
    mesh3(head, sc(new THREE.SphereGeometry(.024, 20, 12), [.42, .42, 1.3]), B, [.078, .026, s * .04], { rot: [0, s * .3, s * -.14] });
    mesh3(head, sc(new THREE.SphereGeometry(.024, 16, 8), [.2, .1, 1.15]), DM.lid, [.086, .016, s * .041], { rot: [0, s * .3, s * -.14], cast: false });
    tubeP3(head, [[.078, .043, s * .012], [.088, .056, s * .04], [.08, .05, s * .068]], .0045, B, { segs: 8, radial: 6, cast: false });
  }
  for (const s of [-1, 1]) mesh3(head, new THREE.BoxGeometry(.005, .05, .005), DM.white, [.094, .085, s * .011], { rot: [0, 0, -.3], cast: false });
  mesh3(head, new THREE.BoxGeometry(.005, .006, .027), DM.white, [.097, .061, 0], { cast: false });
  mesh3(head, new THREE.BoxGeometry(.005, .045, .006), DM.red, [.095, .088, 0], { rot: [0, 0, -.3], cast: false });
  // long ears with pearl earrings (8.8.33: "polished pearl earrings")
  for (const s of [-1, 1]) {
    mesh3(head, sc(new THREE.SphereGeometry(.025, 10, 8), [.6, 1.8, .5]), B, [-.005, -.01, s * .095]);
    mesh3(head, new THREE.SphereGeometry(.016, 12, 10), DM.pearl, [.004, -.08, s * .104]);
    mesh3(head, new THREE.TorusGeometry(.012, .004, 6, 14), DM.gold, [.004, -.062, s * .104], { rot: [0, Math.PI / 2, 0] });
  }
  const kir = lathe3([[0, 0], [.108, 0], [.122, .025], [.108, .045], [.112, .085], [.1, .105], [.103, .145], [.088, .165], [.091, .205], [.075, .225], [.077, .265], [.06, .285], [.062, .32], [.044, .34], [.045, .375], [.028, .395], [.036, .42], [.02, .46], [.008, .5], [0, .52]], 64);
  mesh3(head, kir, DM.gold, [0, .09, 0]);
  for (const [y, r] of [[.165, .09], [.285, .062]]) for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; mesh3(head, new THREE.SphereGeometry(.009, 8, 6), DM.ruby, [Math.cos(a) * r, .09 + y + .015, Math.sin(a) * r]); }
  mesh3(head, sc(new THREE.SphereGeometry(.06, 16, 10), [.12, 1.1, 1]), DM.gold, [.1, .145, 0]);
  for (const s of [-1, 1]) mesh3(head, sc(new THREE.SphereGeometry(.055, 16, 10), [.15, 1.1, .8]), DM.goldD, [-.035, .07, s * .1]);
  // a halo of light behind him
  const aura = glow3(M, [-.15, 1.2, 0], 2.6, '#FFD8A0', .5); aura.material.fog = false;
  const set = (t, on = 1) => { K.set(t, on); aura.material.opacity = .45 * on; };
  return { group: M, K, head, chakra, aura, set, H: 1.65 };
}

// ================= the doorway at dusk =================
const plasterTex3 = () => tex3('plaster', 512, 512, (g, w, h) => {
  g.fillStyle = '#E6DCCB'; g.fillRect(0, 0, w, h); const r = lcg(12);
  for (let i = 0; i < 90; i++) { const x = r() * w, y = r() * h, rr = 20 + r() * 80, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, rgba(r() > .5 ? '#B8A68A' : '#F2E6D2', .1)); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  for (let i = 0; i < 6000; i++) { g.fillStyle = rgba(r() < .5 ? '#9A8A75' : '#FFFFFF', .06 + r() * .08); g.fillRect(r() * w, r() * h, 1, 1); }
  // a band of ochre along the foot
  const gr = g.createLinearGradient(0, h * .86, 0, h); gr.addColorStop(0, 'rgba(150,80,40,0)'); gr.addColorStop(.2, 'rgba(150,80,40,.55)'); gr.addColorStop(1, 'rgba(120,60,30,.7)'); g.fillStyle = gr; g.fillRect(0, h * .86, w, h * .14);
});
const rangoliTex3 = () => tex3('rangoli', 1024, 1024, (g, w, h) => {
  g.clearRect(0, 0, w, h); g.translate(w / 2, h / 2);
  const dots = (r, n, s, col) => { g.fillStyle = col; for (let i = 0; i < n; i++) { const a = i / n * TAU; g.beginPath(); g.arc(Math.cos(a) * r, Math.sin(a) * r, s, 0, TAU); g.fill(); } };
  g.lineWidth = 14; g.strokeStyle = 'rgba(250,246,236,.95)'; g.beginPath(); g.arc(0, 0, 470, 0, TAU); g.stroke();
  for (let i = 0; i < 12; i++) { g.save(); g.rotate(i / 12 * TAU); g.fillStyle = i % 2 ? '#D8202A' : '#F2A81E'; g.beginPath(); g.moveTo(0, -150); g.bezierCurveTo(90, -220, 70, -380, 0, -440); g.bezierCurveTo(-70, -380, -90, -220, 0, -150); g.fill(); g.strokeStyle = 'rgba(250,246,236,.95)'; g.lineWidth = 8; g.stroke(); g.restore(); }
  g.fillStyle = '#2A7A3A'; g.beginPath(); g.arc(0, 0, 150, 0, TAU); g.fill(); g.strokeStyle = 'rgba(250,246,236,.95)'; g.lineWidth = 10; g.stroke();
  for (let i = 0; i < 8; i++) { g.save(); g.rotate(i / 8 * TAU); g.fillStyle = '#F2D21E'; g.beginPath(); g.ellipse(0, -80, 26, 58, 0, 0, TAU); g.fill(); g.restore(); }
  g.fillStyle = '#D8202A'; g.beginPath(); g.arc(0, 0, 34, 0, TAU); g.fill();
  dots(505, 72, 9, 'rgba(250,246,236,.95)');
});
// a clay diya: a shallow terracotta bowl pinched to a spout (+x), oil, a wick and its flame
function diya3(parent, pos, o = {}) {
  const G = new THREE.Group(); G.position.set(...pos); G.rotation.y = o.yaw ?? 0; parent.add(G);
  const g = lathe3([[0, 0], [.03, 0], [.045, .006], [.06, .02], [.066, .032], [.06, .034], [.05, .022], [0, .018]], 32), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), a = Math.atan2(z, x), sp = Math.pow(Math.max(0, Math.cos(a)), 8); p.setX(i, x * (1 + .55 * sp)); p.setZ(i, z * (1 - .2 * sp)); }
  g.computeVertexNormals(); mesh3(G, g, DM.clay, [0, 0, 0]);
  mesh3(G, new THREE.CircleGeometry(.05, 24), DM.std('#5A3A10', .2, { metalness: .1 }), [0, .024, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  mesh3(G, new THREE.CylinderGeometry(.004, .004, .03, 6), DM.std('#F4E8D0', .9), [.07, .03, 0], { rot: [0, 0, -.8], cast: false });
  const f = flame3(G, [.078, .045, 0], o.k ?? .9, { power: o.power ?? 1.6, range: o.range ?? 4, shadow: o.shadow ?? false, light: o.light ?? true });
  G.set = (t, on = 1) => f.set(t, on); G.flame = f;
  return G;
}
function door3() {
  const S = new THREE.Scene();
  // the sky: blue hour, a last orange band low (seen over the roof in the wide shots)
  sky3(S, [[1, '#0E1A3C'], [.4, '#1E3466'], [.12, '#4A5A8A'], [.03, '#C07A5A'], [0, '#E89A60'], [-1, '#2A2018']], { r: 400 });
  env3(S, 'dawn', { k: .3, rot: 2.5 });
  const hemi = new THREE.HemisphereLight('#8AA4E8', '#4A3A2E', 1.3); S.add(hemi);
  const moon = new THREE.DirectionalLight('#9AB4F0', .7); moon.position.set(3, 7, 8); moon.castShadow = true; moon.shadow.mapSize.set(1024, 1024);
  Object.assign(moon.shadow.camera, { left: -4, right: 4, top: 4, bottom: -2, near: 1, far: 30 }); S.add(moon, moon.target);
  // the ground: packed earth; the house's front wall (the door in it) along z = 0, the room behind (-z)
  const gnd = pbr3('sand', { rep: [22, 22], tint: '#7A6450', normalK: .6 });
  mesh3(S, new THREE.PlaneGeometry(40, 40), gnd, [0, 0, 6], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const wallM = new THREE.MeshStandardMaterial({ map: plasterTex3().rep(1.5, 1), roughness: .95, color: '#FFF6EA' });
  const DW = 1.1, DH = 2.05, WT = .34;
  // the walls end inside the jambs (their end faces on the jambs' inner faces z-fought, flickering white)
  block3(S, 4, 3.2, WT, wallM, [-(DW / 2 + .1 + 2), 0, 0]); block3(S, 4, 3.2, WT, wallM, [DW / 2 + .1 + 2, 0, 0]);
  block3(S, DW, 3.2 - DH - .2, WT, wallM, [0, DH + .2, 0]);
  // the roof's edge: a dark wooden eave with clay tiles
  block3(S, 9, .12, 1.1, pbr3('darkwood', { rep: [6, 1], tint: '#6A4A34' }), [0, 3.2, .3]);
  block3(S, 9, .1, 1.2, DM.std('#7A3A22', .85), [0, 3.32, .3]);
  // the door frame: dark wood, brass studs on the lintel, a toran of mango leaves; the wooden threshold (dehri)
  const wood = pbr3('darkwood', { rep: [1, 3], tint: '#9A6A48' });
  block3(S, .16, DH + .2, WT + .06, wood, [-DW / 2 - .08, 0, 0]); block3(S, .16, DH + .2, WT + .06, wood, [DW / 2 + .08, 0, 0]);
  block3(S, DW + .48, .22, WT + .1, wood, [0, DH, 0]);
  block3(S, DW, .09, WT + .04, wood, [0, 0, 0]);
  for (let i = 0; i < 9; i++) mesh3(S, new THREE.SphereGeometry(.03, 10, 8), DM.brass, [-DW / 2 + .05 + i * (DW - .1) / 8, DH + .11, (WT + .1) / 2 + .01]);
  const mango = DM.std('#3E6A2A', .7);
  for (let i = 0; i < 13; i++) { const x = -DW / 2 - .1 + i * (DW + .2) / 12; mesh3(S, new THREE.SphereGeometry(.07, 10, 6), mango, [x, DH - .07 - .03 * Math.sin(i / 12 * Math.PI), WT / 2 + .07], { scale: [.32, 1.1, .1] }); }
  for (let i = 0; i < 6; i++) mesh3(S, new THREE.SphereGeometry(.025, 10, 8), DM.mari[i % 3], [-DW / 2 + .05 + i * (DW - .1) / 5, DH - .02, WT / 2 + .1]);
  // the two door leaves, hinged at the jambs, open inward: panelled wood with brass bosses
  const leafW = DW / 2 - .01;
  for (const s of [-1, 1]) {
    const hinge = new THREE.Group(); hinge.position.set(s * DW / 2, 0, -WT / 2); hinge.rotation.y = -s * 1.2; S.add(hinge);
    block3(hinge, leafW, DH - .02, .05, wood, [-s * leafW / 2, .01, -.025]);
    for (const y of [.25, 1.0]) block3(hinge, leafW - .14, .6, .02, pbr3('darkwood', { rep: [1, 1], tint: '#6A4630' }), [-s * leafW / 2, y, .005]);
    for (const y of [.3, .65, 1.05, 1.4, 1.75]) mesh3(hinge, new THREE.SphereGeometry(.018, 8, 6), DM.brass, [-s * (leafW - .06), y, .01]);
  }
  // the room inside: warm lamplight on the back wall, a floor; its light spills out over the threshold and the step
  block3(S, 4, 3, .2, DM.std('#C89A68', .95), [0, 0, -3.2]);
  block3(S, .2, 3, 3.2, DM.std('#B88A5A', .95), [-1.6, 0, -1.6]); block3(S, .2, 3, 3.2, DM.std('#B88A5A', .95), [1.6, 0, -1.6]);
  mesh3(S, new THREE.PlaneGeometry(3.2, 3.2), DM.std('#5A3E28', .9), [0, .01, -1.6], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const inside = new THREE.PointLight('#FFB060', 6, 5, 1.4); inside.position.set(.3, 1.5, -2.2); S.add(inside);
  const spill = new THREE.SpotLight('#FFB868', 26, 9, .42, .6, 1.3); spill.position.set(0, 1.9, -2.6); spill.target.position.set(0, 0, 2.2); spill.castShadow = true;
  spill.shadow.mapSize.set(1024, 1024); spill.shadow.bias = -.0005; S.add(spill, spill.target);
  const insideGlow = glow3(S, [0, 1.1, -2.9], 2.2, '#FFB868', .4);
  // the step: a low stone slab before the door
  const stone = stone3({ col: '#8A8076', rows: 1, cols: 3, seed: 5, rep: [1, 1], rough: .9 });
  block3(S, 1.7, .14, .46, stone, [0, 0, WT / 2 + .23]);
  // the rangoli on the ground before the step
  const rg = mesh3(S, new THREE.PlaneGeometry(1.3, 1.3), new THREE.MeshStandardMaterial({ map: rangoliTex3(), transparent: true, roughness: .95, depthWrite: false }), [0, .005, 1.45], { rot: [-Math.PI / 2, 0, 0], cast: false });
  rg.renderOrder = 1;
  // the lamp for Yama: on the ground outside the door, beside the step, its spout turned out toward the lane
  const YP = [.62, 0, .78];
  const yama = diya3(S, YP, { yaw: -Math.PI / 2, power: .6, range: 3, shadow: true, k: .9 });
  // a gold coin lying on the step, catching the lamp
  const CP = [.32, .14, .42];
  const coin = coin3(S, .028); coinPose(coin, CP[0], CP[2], .6, Math.PI / 2, CP[1]);
  // next: a row of lamps along the step, lit one by one
  const row = []; for (let i = 0; i < 7; i++) row.push(diya3(S, [-.72 + i * .24, .14, .52], { yaw: -Math.PI / 2, power: .45, range: 2, light: i % 2 === 0, k: .85 }));
  const set = (t, o = {}) => {
    yama.set(t, o.yama ?? 1); row.forEach((d, i) => { const on = o.row ? clamp((o.row - i * .3) * 3) : 0; d.visible = on > 0; d.set(t, on); });
    const fl = 1 + .05 * Math.sin(t * 7) + .03 * Math.sin(t * 17);
    inside.intensity = 6 * (o.inside ?? 1) * fl; spill.intensity = 26 * (o.inside ?? 1) * fl; insideGlow.material.opacity = .4 * (o.inside ?? 1);
    hemi.intensity = 1.3 * (o.hemi ?? 1); moon.intensity = .9 * (o.hemi ?? 1);
    coin.group.visible = o.coin ?? true;
  };
  return { S, yama, coin, row, set, DW, DH, YP, CP };
}
