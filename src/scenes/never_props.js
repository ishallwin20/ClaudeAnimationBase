// never_props.js: what "NEVER offer THIS flower to SHIVA" (ad 66) builds on the shrine set (cine3d_temple.js): the three
// flowers in 3D (the ketaki, a screw pine's long cream spathes round its pollen spikes; the champa, a star of narrow
// saffron petals; a tulsi sprig, pairs of leaves crossing up a purple stem to its flower spike), a dark studio to show
// them in, the void where Brahma and Vishnu searched the pillar of fire (ad 43's), ad 50's courtyard (Shiva in the
// middle; Devi, Ganesha, Vishnu, Surya at the corners) with each god's emblem in light, the ✗ and ✓ marks, source
// tags, the screenshot board. Everything matte (owner, 30 Oct: nothing shiny): no metal on the flowers, no fx bloom.

// ---------- the flowers ----------
// petal3(L, Wd, o): a petal, bract or leaf L long and Wd wide at its widest, growing up +y from its base and bending
// out toward +z (o.base: the lean at the base, o.bend: extra lean by the tip, radians), cupped (o.cup: the edges lift
// toward -z, the inside), o.shape(u) its width along it (0..1), coloured from o.c0 (base) to o.c1 (tip) and o.c2
// (the edge) as vertex colours.
function petal3(L, Wd, o = {}) {
  const nu = o.nu || 18, nv = o.nv || 8, shape = o.shape || (u => Math.pow(Math.sin(Math.PI * Math.pow(u, .55)), .9));
  const c0 = new THREE.Color(o.c0 || '#FFFFFF'), c1 = new THREE.Color(o.c1 || o.c0 || '#FFFFFF'), c2 = o.c2 ? new THREE.Color(o.c2) : null;
  const pos = [], col = [], idx = [];
  let my = 0, mz = 0; const mid = [];
  for (let i = 0; i <= nu; i++) {
    const u = i / nu, th = (o.base || 0) + (o.bend || 0) * Math.pow(u, o.bendP || 1.4);
    if (i) { my += Math.cos(th) * L / nu; mz += Math.sin(th) * L / nu; }
    mid.push([my, mz, th]);
  }
  for (let i = 0; i <= nu; i++) {
    const u = i / nu, [y, z, th] = mid[i], w = Wd * shape(u) / 2;
    for (let j = 0; j <= nv; j++) {
      const v = j / nv * 2 - 1, x = v * w, cup = (o.cup || 0) * w * v * v + (o.ridge || 0) * w * (1 - Math.abs(v));
      const wav = o.wave ? o.wave * w * Math.sin(u * 9 + v * 2) * Math.abs(v) : 0;
      pos.push(x, y + Math.sin(th) * (cup + wav), z - Math.cos(th) * (cup + wav));
      const cc = c0.clone().lerp(c1, Math.pow(u, o.cP || 1)); if (c2) cc.lerp(c2, Math.pow(Math.abs(v), 3) * .6);
      col.push(cc.r, cc.g, cc.b);
    }
  }
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * (nv + 1) + j, b = a + nv + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx); g.computeVertexNormals(); return g;
}
const petalMat3 = (o = {}) => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: o.rough ?? .78, metalness: 0, side: THREE.DoubleSide, emissive: o.em || '#000000', emissiveIntensity: o.emK ?? 0 });
// a bumpy pollen spike (the ketaki's flowers, the tulsi's manjari): a turned shape with a dotted bump
const pollenTex3 = () => tex3('pollen', 256, 256, (g, w, h) => {
  g.fillStyle = '#808080'; g.fillRect(0, 0, w, h); const r = lcg(7);
  for (let i = 0; i < 900; i++) { const x = r() * w, y = r() * h, rr = 2 + r() * 4, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
}, { data: true });
// a stem along points [[x, y, z], ...], r thick
const stem3 = (parent, pts, r, mat) => mesh3(parent, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => V3(...p))), 24, r, 8, false), mat);

// ketaki3(parent): the ketaki (Pandanus, the screw pine's flower), about .42 m tall, standing on its stalk at the
// group's origin: a dozen long, boat-shaped cream spathes in a loose spiral, the outer ones leaning out and curling,
// round three pale-gold pollen spikes. o.k a scale.
function ketaki3(parent, o = {}) {
  const G = new THREE.Group(); parent.add(G); if (o.k) G.scale.setScalar(o.k);
  const mat = petalMat3({ rough: .82, em: '#2A2414', emK: o.em ?? .15 }), r = lcg(o.seed || 66);
  stem3(G, [[0, -.07, 0], [.004, -.03, .003], [0, .02, 0]], .011, new THREE.MeshStandardMaterial({ color: '#9A9A6A', roughness: .85 }));
  const N = 9;
  for (let i = 0; i < N; i++) {
    const k = i / (N - 1), outer = 1 - k, L = .3 + .1 * outer + r() * .04, Wd = .07 + .03 * outer;
    const geo = petal3(L, Wd, { base: .1 + .35 * outer, bend: .5 + 1.1 * outer, bendP: 2.2, cup: .9, ridge: .05, wave: .04, c0: '#CFCB9C', c1: '#FBF4DE', c2: '#EFE4BE', cP: .45,
      shape: u => Math.pow(Math.sin(Math.PI * Math.min(1, Math.pow(u, .5))), .55) * (1 - .35 * u * u) });
    const p = new THREE.Group(); p.rotation.y = i * 2.4 + r() * .4; p.position.y = .01 + .03 * k; G.add(p);
    mesh3(p, geo, mat, [0, 0, .008 + .012 * outer], { cast: o.cast ?? false });
  }
  // the flowers: long pale-gold pollen spikes (catkins), drooping out of the spathes
  const sp = new THREE.MeshStandardMaterial({ color: '#EAD69A', roughness: .95, bumpMap: pollenTex3().rep(1, 4), bumpScale: 4, emissive: '#3A2C08', emissiveIntensity: o.em ?? .15 });
  const prof = smooth3([[0, 0], [.013, .012], [.017, .08], [.016, .18], [.012, .25], [0, .275]], 4);
  [[0, 0, -.05, 0], [.02, .008, -.35, .5], [-.018, -.014, .3, -.4], [.006, -.02, .15, 2.2]].forEach(([x, z, lean, ry], j) => {
    const q = new THREE.Group(); q.position.set(x, .03, z); q.rotation.set(lean, ry, lean * .5); G.add(q);
    mesh3(q, lathe3(prof, 16), sp, [0, 0, 0], { scale: 1 - j * .1, cast: false });
  });
  return G;
}
// champa3(parent): the champa (Magnolia champaca), about .09 m across: two whorls of narrow saffron-gold petals, a
// green-gold cone in the middle. o.k a scale.
function champa3(parent, o = {}) {
  const G = new THREE.Group(); parent.add(G); if (o.k) G.scale.setScalar(o.k);
  const mat = petalMat3({ rough: .75, em: '#3A1800', emK: o.em ?? .15 }), r = lcg(o.seed || 12);
  for (let w = 0; w < 2; w++) {
    const n = w ? 6 : 8;
    for (let i = 0; i < n; i++) {
      const geo = petal3(.055 - w * .008 + r() * .006, .011 + w * .002, { base: w ? .55 : .95, bend: w ? .5 : .8, cup: .5, c0: '#D86A0A', c1: '#FFC23A', c2: '#F29A1A', cP: .7,
        shape: u => Math.pow(Math.sin(Math.PI * Math.pow(u, .6)), .8) });
      const p = new THREE.Group(); p.rotation.y = i / n * TAU + w * .3 + r() * .15; G.add(p); mesh3(p, geo, mat, [0, w * .004, .003], { cast: false });
    }
  }
  mesh3(G, lathe3(smooth3([[0, 0], [.007, .002], [.006, .016], [.003, .026], [0, .03]], 4), 14), new THREE.MeshStandardMaterial({ color: '#9AA040', roughness: .85 }), [0, 0, 0], { cast: false });
  mesh3(G, lathe3([[0, -.02], [.01, -.012], [.007, 0]], 12), new THREE.MeshStandardMaterial({ color: '#6A7A3A', roughness: .9 }), [0, 0, 0], { cast: false });
  return G;
}
// tulsi3(parent): a tulsi sprig, about .22 m: a purple-brown stem, four pairs of oval leaves crossing each other up it
// (each pair turned 90° from the last, smaller toward the top), the purple flower spike (manjari) on top. o.k a scale.
function tulsi3(parent, o = {}) {
  const G = new THREE.Group(); parent.add(G); if (o.k) G.scale.setScalar(o.k);
  const stemM = new THREE.MeshStandardMaterial({ color: '#5A3A44', roughness: .85 }), r = lcg(o.seed || 9);
  stem3(G, [[0, 0, 0], [.004, .06, .002], [-.002, .13, 0], [0, .2, .003]], .0045, stemM);
  const leafM = petalMat3({ rough: .7, em: '#081404', emK: o.em ?? .12 });
  for (let i = 0; i < 4; i++) {
    const y = .025 + i * .042, s = 1 - i * .16;
    for (const side of [0, 1]) {
      const geo = petal3(.078 * s, .05 * s, { base: 1.05, bend: .35, cup: .35, ridge: .06, c0: '#2E4E22', c1: '#4E7A32', c2: '#3A3A2A', cP: .8,
        shape: u => Math.pow(Math.sin(Math.PI * Math.pow(u, .75)), .9) });
      const p = new THREE.Group(); p.position.y = y; p.rotation.y = i * Math.PI / 2 + side * Math.PI + (r() - .5) * .2; G.add(p);
      mesh3(p, geo, leafM, [0, 0, .003], { cast: false });
    }
  }
  const sp = new THREE.MeshStandardMaterial({ color: '#7A4A7A', roughness: .9, bumpMap: pollenTex3().rep(1, 2), bumpScale: 2 });
  for (let i = 0; i < 6; i++) mesh3(G, new THREE.TorusGeometry(.007 - i * .0006, .0035, 6, 12), sp, [0, .18 + i * .011, 0], { rot: [Math.PI / 2, 0, 0], cast: false });
  mesh3(G, new THREE.SphereGeometry(.004, 8, 6), sp, [0, .248, 0], { cast: false });
  return G;
}

// ---------- the studio: one flower on black, a warm key, a cool rim ----------
// studio3() → { scene, put(id), key, rim }: the flowers stand at the origin (only the one put() shows), lit softly
function studio3() {
  const scene = new THREE.Scene();
  sky3(scene, [[1, '#08060A'], [.2, '#120C10'], [0, '#1C1214'], [-.4, '#0C0809'], [-1, '#050405']], { r: 40 });
  const hemi = new THREE.HemisphereLight('#6A5A70', '#1A1008', .55); scene.add(hemi);
  const key = new THREE.DirectionalLight('#FFEBD2', 2.0); key.position.set(-.6, .9, 1); scene.add(key);
  const rim = new THREE.DirectionalLight('#8AA8FF', 1.4); rim.position.set(.8, .5, -1); scene.add(rim);
  const fill = new THREE.PointLight('#FFB070', .6, 3, 1.5); fill.position.set(.3, .1, .6); scene.add(fill);
  const F = { ketaki: ketaki3(scene), champa: champa3(scene, { k: 2.6 }), tulsi: tulsi3(scene, { k: 1.7 }) };
  return { scene, F, key, rim, hemi, put(show) { for (const k in F) F[k].visible = show.includes(k); } };
}

// ---------- the void: Brahma and Vishnu, the pillar of fire with no end (ad 43's) ----------
const fireTex3 = () => tex3('firecol', 128, 512, (g, w, h) => {
  g.fillStyle = '#000'; g.fillRect(0, 0, w, h); const r = lcg(12); g.globalCompositeOperation = 'lighter'; g.filter = 'blur(3px)';
  for (let i = 0; i < 260; i++) {
    const x = r() * w, y = r() * h, l = 40 + r() * 160, wd = 3 + r() * 10, hot = r();
    const gr = g.createLinearGradient(0, y, 0, y + l); const col = hot > .6 ? '255,236,180' : hot > .3 ? '255,170,60' : '255,110,30';
    gr.addColorStop(0, `rgba(${col},0)`); gr.addColorStop(.5, `rgba(${col},.55)`); gr.addColorStop(1, `rgba(${col},0)`);
    for (const dy of [0, -h, h]) { g.fillStyle = gr; g.save(); g.translate(0, dy); g.beginPath(); g.ellipse(x, y + l / 2, wd, l / 2, 0, 0, TAU); g.fill(); g.restore(); }
  }
});
function void3() {
  const scene = new THREE.Scene();
  sky3(scene, [[1, '#040210'], [.3, '#0A0624'], [0, '#160A30'], [-.3, '#0A0624'], [-1, '#040210']], { r: 4000 });
  scene.fog = new THREE.Fog('#100828', 400, 2600);
  const sg = new THREE.BufferGeometry(), sp = [], rs = lcg(31);
  for (let i = 0; i < 3000; i++) { const a = rs() * TAU, el = Math.asin(rs() * 2 - 1), R = 600 + rs() * 2800; sp.push(Math.cos(a) * Math.cos(el) * R, Math.sin(el) * R, Math.sin(a) * Math.cos(el) * R); }
  sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: '#FFFFFF', size: 2, sizeAttenuation: false, transparent: true, opacity: .8, fog: false, depthWrite: false })));
  const rd = lcg(4); for (let i = 0; i < 40; i++) { const a = rd() * TAU, R = 500 + rd() * 1500; glow3(scene, [Math.cos(a) * R, (rd() - .5) * 2400, Math.sin(a) * R], 500 + rd() * 900, ['#3A1E7A', '#1E3A7A', '#6A1E5A'][i % 3], .25); }
  // the pillar: two fire columns (outer, inner), a white core, its glow
  const H = 8000, P = new THREE.Group(); scene.add(P);
  const mk = (r, col, op, rep) => { const tx = fireTex3().rep(1, rep); const m = mesh3(P, new THREE.CylinderGeometry(r, r, H, 48, 1, true), new THREE.MeshBasicMaterial({ map: tx, color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, side: THREE.DoubleSide }), [0, 0, 0], { cast: false, receive: false }); m.tx = tx; return m; };
  const outer = mk(6, '#FF8A30', .9, 60), inner = mk(3.6, '#FFD080', .9, 90), core = mesh3(P, new THREE.CylinderGeometry(1.3, 1.3, H, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#FFF4DC', transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }), [0, 0, 0], { cast: false, receive: false });
  for (let i = -8; i <= 8; i++) glow3(P, [0, i * 60, 0], 60, '#FF9A40', .3);
  // Brahma (gold) and Vishnu (blue): glowing orbs with a soft trail
  const orb = (col) => { const g = new THREE.Group(); scene.add(g); glow3(g, [0, 0, 0], 34, col, 1); glow3(g, [0, 0, 0], 11, '#FFFFFF', 1); const tr = []; for (let i = 1; i <= 10; i++) tr.push(glow3(g, [0, 0, 0], 18 - i, col, .5 - i * .045)); g.tr = tr; return g; };
  const brahma = orb('#FFC860'), vishnu = orb('#6AA8FF');
  // the ketaki falling beside the pillar, lit by its fire (a warm point light rides with it, on the pillar's side)
  const hemi = new THREE.HemisphereLight('#5A4A8A', '#201030', .5); scene.add(hemi);
  const fl = new THREE.Group(); scene.add(fl); const ket = ketaki3(fl, { k: 42, em: .25 });
  const fire = new THREE.PointLight('#FFB070', 1500, 160, 1.6); scene.add(fire);
  return {
    scene, brahma, vishnu, flower: fl, fire,
    // pillar(t, on): it grows out from the middle; its fire runs up
    pillar(t, on) { P.visible = on > .001; const k = easeOut(clamp(on)); P.scale.set(.2 + .8 * k, Math.max(.0001, k), .2 + .8 * k); outer.tx.offset.y = -t * .5; inner.tx.offset.y = -t * .8; core.material.opacity = .9 * k; },
    // put an orb at p, its trail behind it along the direction it came from (v)
    at(o, p, v = [0, 0, 0]) { o.position.set(...p); o.tr.forEach((s, i) => s.position.set(-v[0] * i * .9, -v[1] * i * .9, -v[2] * i * .9)); },
    // the flower at p, tumbling slowly (spin: radians), shown or not; the fire light beside it
    flowerAt(p, spin = 0, on = true, lp = [-14, 10, 30]) { fl.visible = on; fl.position.set(...p); fl.rotation.set(.5 + .3 * Math.sin(spin * .7), spin, .35 * Math.sin(spin)); fire.position.set(p[0] + lp[0], p[1] + lp[1], p[2] + lp[2]); fire.intensity = on ? 1500 : 0; },
  };
}

// ---------- the courtyard of Part 2 (ad 50): five shrines ----------
// the corners, clockwise from the north-east; col: their emblem's light
const GODS = [
  { id: 'devi', name: 'DEVI', at: [7.5, -9.5], col: '#FF7A5A' },
  { id: 'ganesha', name: 'GANESHA', at: [7.5, 9.5], col: '#FFB050' },
  { id: 'vishnu', name: 'VISHNU', at: [-7.5, 9.5], col: '#8EB8FF' },
  { id: 'surya', name: 'SURYA', at: [-7.5, -9.5], col: '#FFD860' },
];
const SK = .72;                                 // the corner shrines' scale
const TOPY = { centre: 11.2, corner: 7.7 };     // where the emblems float

// paving, a low prakara wall with a gate on the east and lamps along its top, trees beyond
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
  const lamps = [], dish = lathe3([[0, 0], [.05, 0], [.07, .02], [.1, .035], [.1, .045], [.08, .04], [0, .035]], 24), lampM = new THREE.MeshStandardMaterial({ color: '#9A7434', roughness: .6, metalness: .35 });
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

// ---------- the emblems, in lines of light ----------
// stroke a path twice, a coloured glow and a white-hot core, like ganeshaLine
function lightPath(c, d, x, y, k, col, a = 1, w = 9) {
  c.save(); c.translate(x, y); c.scale(k, k); c.globalAlpha *= a; c.lineCap = 'round'; c.lineJoin = 'round';
  const p = new Path2D(d);
  c.strokeStyle = col; c.lineWidth = w / k * Math.min(1, k * 3); c.shadowColor = col; c.shadowBlur = 30; c.stroke(p);
  c.globalCompositeOperation = 'lighter'; c.shadowBlur = 0; c.strokeStyle = rgba('#FFF4D8', .9); c.lineWidth = w / k * Math.min(1, k * 3) * .35; c.stroke(p);
  c.restore();
}
const TRISHUL_D = 'M 0 480 L 0 -380 M 0 -500 C 40 -420 40 -320 0 -250 C -40 -320 -40 -420 0 -500 M -260 -460 C -300 -300 -220 -170 -60 -150 L 60 -150 C 220 -170 300 -300 260 -460 M -90 -90 L 90 -90 M -70 -40 L 70 -40';
const LINGA_D = 'M -170 300 L -150 230 L 150 230 L 170 300 M -260 230 C -270 180 -220 150 -150 150 L 300 150 C 360 152 380 175 420 190 L 440 205 C 430 222 400 225 330 215 L 150 230 M -110 150 L -110 -170 C -110 -290 110 -290 110 -170 L 110 150 M -90 -150 L 90 -150 M -92 -115 L 92 -115 M -92 -80 L 92 -80';
// emblem(c, id, x, y, s, t, a): the god's emblem at screen (x, y), s pixels a metre (it is about 1.8 m tall)
function emblem(c, id, x, y, s, t, a = 1) {
  if (a <= .01) return;
  const g = GODS.find(q => q.id === id), col = g ? g.col : '#BFD8FF', k = s * 1.8 / 1000;
  glow(c, x, y, s * 2.4, col, .3 * a);
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
  return { x, y, z, s: Math.hypot(x1 - x, y1 - y) };
}

// ---------- marks, tags, labels ----------
// a red ✗ (refused) or a gold ✓ (offered) at (x, y), s px across, stamped in at `at` (a punch of scale)
function mark(c, ok, x, y, s, t, at, o = {}) {
  if (t < at) return;
  const age = t - at, k = age < .12 ? lerp(1.8, 1, easeOut(age / .12)) : 1, a = (o.alpha ?? 1) * clamp(age / .06);
  const col = ok ? '#FFD45A' : '#FF3A2E';
  c.save(); c.translate(x, y); c.scale(k, k); c.globalAlpha *= a; c.lineCap = 'round'; c.lineJoin = 'round';
  const p = new Path2D(ok ? `M ${-s * .4} ${0} L ${-s * .1} ${s * .3} L ${s * .45} ${-s * .35}` : `M ${-s * .38} ${-s * .38} L ${s * .38} ${s * .38} M ${s * .38} ${-s * .38} L ${-s * .38} ${s * .38}`);
  if (o.ring !== false) { c.fillStyle = 'rgba(14,8,8,.6)'; c.beginPath(); c.arc(0, 0, s * .62, 0, TAU); c.fill(); c.strokeStyle = col; c.lineWidth = s * .06; c.stroke(); }
  c.strokeStyle = 'rgba(10,4,4,.85)'; c.lineWidth = s * .2; c.stroke(p);
  c.strokeStyle = col; c.lineWidth = s * .13; c.shadowColor = col; c.shadowBlur = s * .25; c.stroke(p);
  c.restore();
}
// a source tag: a dark pill with a gold edge, small capitals
function tag(c, txt, x, y, t, at, o = {}) {
  if (t < at) return;
  const k = popK(t - at), a = o.alpha ?? 1, col = o.col || '#F4C46A', f = `700 ${o.size || 30}px Cinzel`;
  c.save(); c.font = f; c.letterSpacing = '2px'; const w = c.measureText(txt).width + 50, h = (o.size || 30) * 1.7;
  c.translate(x, y); c.scale(k, k); c.globalAlpha *= a;
  c.fillStyle = 'rgba(16,10,8,.82)'; c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, h / 2); c.fill(); c.stroke();
  c.restore();
  text(c, txt, x, y + 2, f, col, { alpha: a * Math.min(1, k), spacing: 2, maxW: 900 });
}
// a word on a 3D point (a flower's name, Brahma, Vishnu)
function pinW(c, txt, p, t, at, o = {}) {
  const [x, y, z] = toScreen3(p); if (z > 1 || t < at) return;
  text(c, txt, x + (o.dx || 0), y + (o.dy || 0), o.font || `700 ${o.size || 46}px Cinzel`, o.col || '#FFE2A0', { pop: t - at, alpha: o.alpha ?? 1, glow: ['rgba(6,6,14,.95)', 18], spacing: o.spacing ?? 3 });
}
// a quote or verse on a dark band: lines [[txt, font, col], ...] from y, dy apart
function verse(c, lines, y, t, at, o = {}) {
  const a = seg(t, at, at + .4) * (o.alpha ?? 1); if (a <= 0) return;
  band(c, y - 80, y + lines.length * (o.dy || 62) + 30, .78 * a);
  lines.forEach(([s, f, col], i) => text(c, s, 540, y + i * (o.dy || 62), f, col, { alpha: a, maxW: 900, glow: ['rgba(6,5,10,.9)', 14] }));
}
// a dark band behind 2D lettering over a bright frame (y0..y1, fading at both ends)
function band(c, y0, y1, a = .6) {
  c.save(); const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(6,5,10,0)'); g.addColorStop(.25, `rgba(6,5,10,${a})`); g.addColorStop(.75, `rgba(6,5,10,${a})`); g.addColorStop(1, 'rgba(6,5,10,0)');
  c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); c.restore();
}
// the series tag at the top of the safe band
function seriesTag(c, txt, t, at, o = {}) {
  const k = popK(t - at), w = o.w || 500;
  c.save(); c.translate(540, o.y || 470); c.scale(k, k); c.fillStyle = 'rgba(20,12,8,.72)'; c.strokeStyle = 'rgba(244,196,106,.85)'; c.lineWidth = 3;
  c.beginPath(); c.roundRect(-w / 2, -38, w, 76, 38); c.fill(); c.stroke(); c.restore();
  text(c, txt, 540, (o.y || 470) + 2, '700 36px Cinzel', '#F4C46A', { spacing: 2, alpha: Math.min(1, k) });
}

// ---------- the flowers as small pictures (the board) ----------
// icon(c, id, x, y, s): the ketaki (cream spathes fanning from a stalk), the champa (a saffron star), a tulsi sprig
function icon(c, id, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s / 100, s / 100); c.lineJoin = 'round';
  const leaf = (len, wd, ang, fill, edge) => { c.save(); c.rotate(ang); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(wd, -len * .3, wd * .6, -len * .8, 0, -len); c.bezierCurveTo(-wd * .6, -len * .8, -wd, -len * .3, 0, 0); c.fillStyle = fill; c.fill(); c.strokeStyle = edge; c.lineWidth = 3; c.stroke(); c.restore(); };
  if (id === 'ketaki') {
    c.strokeStyle = '#8A8A55'; c.lineWidth = 6; c.beginPath(); c.moveTo(0, 48); c.lineTo(0, 30); c.stroke();
    [-.75, .75, -.5, .5, -.25, .25, 0].forEach((a, i) => leaf(78 - Math.abs(a) * 20, 16, a, i % 2 ? '#F2E8C6' : '#E6D9A8', '#9A8A5A'));
    for (const dx of [-6, 6]) { c.fillStyle = '#E2C36A'; c.beginPath(); c.ellipse(dx, -12, 6, 22, 0, 0, TAU); c.fill(); }
    c.translate(0, 30);
  } else if (id === 'champa') {
    for (let i = 0; i < 12; i++) leaf(i % 2 ? 40 : 48, 10, i / 12 * TAU, i % 2 ? '#FFB52A' : '#F29218', '#A85A08');
    c.fillStyle = '#A8A040'; c.beginPath(); c.arc(0, 0, 8, 0, TAU); c.fill();
  } else {
    c.strokeStyle = '#5A3A44'; c.lineWidth = 5; c.beginPath(); c.moveTo(0, 50); c.lineTo(0, -40); c.stroke();
    [[34, 26], [12, 22], [-10, 17]].forEach(([y, l]) => { c.save(); c.translate(0, y); leaf(l * 1.3, 15, -1.15, '#4E7A32', '#2A4A1E'); leaf(l * 1.3, 15, 1.15, '#3E6A2A', '#2A4A1E'); c.restore(); });
    for (let i = 0; i < 5; i++) { c.fillStyle = '#8A5A8A'; c.beginPath(); c.ellipse(0, -30 - i * 7, 7 - i * .8, 3.5, 0, 0, TAU); c.fill(); }
  }
  c.restore();
}

// ---------- the screenshot board ----------
// three flowers across, three gods down: ✗ refused, ✓ offered, a dash where the texts we used say nothing
const BOARD = [
  ['SHIVA', '#BFD8FF', [0, 0, 1]],
  ['GANESHA', '#FFB050', [null, null, 0]],
  ['VISHNU', '#8EB8FF', [1, 1, 1]],
];
function board(c, t, t0, o = {}) {
  const a = seg(t, t0, t0 + .35) * (o.alpha ?? 1); if (a <= 0) return;
  const x0 = 60, x1 = 940, y0 = o.y0 ?? 520, cols = [500, 650, 800], rh = 170;
  c.save(); c.globalAlpha *= a; c.fillStyle = 'rgba(12,8,10,.86)'; c.strokeStyle = 'rgba(244,196,106,.8)'; c.lineWidth = 3;
  c.beginPath(); c.roundRect(x0, y0 - 90, x1 - x0, 300 + rh * 3 + 70, 34); c.fill(); c.restore();
  c.save(); c.globalAlpha *= a; c.strokeStyle = 'rgba(244,196,106,.8)'; c.lineWidth = 3; c.beginPath(); c.roundRect(x0, y0 - 90, x1 - x0, 300 + rh * 3 + 70, 34); c.stroke(); c.restore();
  text(c, 'FLOWERS FOR THE GODS', (x0 + x1) / 2, y0 - 38, '700 38px Cinzel', '#F4C46A', { alpha: a, spacing: 2 });
  ['ketaki', 'champa', 'tulsi'].forEach((id, j) => {
    const aj = a * seg(t, t0 + .1 + j * .08, t0 + .35 + j * .08);
    c.save(); c.globalAlpha *= aj; icon(c, id, cols[j], y0 + 90, 92); c.restore();
    text(c, id.toUpperCase(), cols[j], y0 + 175, '700 26px Cinzel', '#FFF3DC', { alpha: aj, spacing: 1 });
  });
  BOARD.forEach(([name, col, row], i) => {
    const y = y0 + 300 + i * rh, ai = a * seg(t, t0 + .3 + i * .15, t0 + .6 + i * .15);
    c.save(); c.globalAlpha *= ai; c.strokeStyle = 'rgba(244,196,106,.25)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0 + 30, y - rh / 2); c.lineTo(x1 - 30, y - rh / 2); c.stroke(); c.restore();
    c.save(); c.font = '700 46px Cinzel'; c.letterSpacing = '1px'; const nw = c.measureText(name).width; c.restore();
    text(c, name, x0 + 50 + nw / 2, y, '700 46px Cinzel', col, { alpha: ai, spacing: 1 });
    row.forEach((v, j) => v == null ? text(c, '–', cols[j], y, '700 50px Cinzel', '#8A8078', { alpha: ai }) : mark(c, !!v, cols[j], y, 92, t, t0 + .45 + i * .15 + j * .06, { alpha: ai }));
  });
  text(c, 'Shiva Purana · Brahma Vaivarta · Narasimha Purana', (x0 + x1) / 2, y0 + 300 + rh * 3 - 52, '28px Marcellus', '#CFC2B0', { alpha: a, maxW: 820 });
}
