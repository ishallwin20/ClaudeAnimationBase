// along_props.js: what the Diwali aarti-along (ad 73) builds in the 3D style: ad 54's lamp-lit stone sanctum dressed for
// Diwali (clay diyas, marigold torans, a gold prabhavali), a bronze Maa Lakshmi murti in a red silk saree standing on a
// pink lotus (four arms: the raised two hold lotuses, the lower right pours gold coins, the lower left holds a kalash
// of coins; a gold kirita, jhumkas, a nath, a marigold garland), the aarti lamp (ad 54's five-wick pancha-pradip), the
// gold rings it leaves (one a circle), and the 2D pieces: the count by the lamp and the 4 · 2 · 3 · 7 tracker.
// Metres; y up; the murti faces east (+x), the devotee looks west. Seen by the devotee, screen right is -z.

const PED = .5, LOTUS_H = .1, SOLE = PED + LOTUS_H;     // the pitha's top, the lotus on it, her soles
// where the lamp circles: centre height, radius (ry, rz for the whole body), the number of circles, where a circle starts
// (p0: 0 at the bottom, .5 at the top: the whole body starts from the face, where the lamp already is)
const PARTS = {
  feet: { y: SOLE + .06, r: .17, n: 4 },
  navel: { y: SOLE + 1.0, r: .14, n: 2 },
  face: { y: SOLE + 1.53, r: .16, n: 3 },
  whole: { y: SOLE + .97, ry: 1.05, rz: .56, n: 7, p0: .5, grow: .02 },
};
const RX = .58, RSTEP = .025, RGROW = .04;        // the circles' plane (x), and how much nearer and bigger each next circle is

// ---------- materials ----------
const MAT = (() => {
  const std = (col, rough = .6, o = {}) => new THREE.MeshStandardMaterial({ color: col, roughness: rough, ...o });
  const met = (col, rough, env = .55) => new THREE.MeshStandardMaterial({ color: col, metalness: .78, roughness: rough, envMapIntensity: env });
  return {
    // the murti: panchaloha bronze, matte with wear (lamp light models the forms; not shiny: owner, 30 Oct)
    bronze: new THREE.MeshStandardMaterial({ color: '#8A5A32', roughness: .44, metalness: .6, envMapIntensity: .5, bumpMap: stoneTex({ seed: 11, rows: 1, cols: 1, mottle: .5 }).bump, bumpScale: .1 }),
    bronzeD: new THREE.MeshStandardMaterial({ color: '#4A2E1A', roughness: .5, metalness: .5, envMapIntensity: .4 }),
    lid: std('#24160C', .5, { metalness: .3 }),
    gold: met('#E0B058', .3), goldD: met('#B8862E', .38), brass: met('#C9963E', .34, .45),
    silk: std('#A8121C', .52, { emissive: '#2A0204', emissiveIntensity: .2 }), silkD: std('#6E0A12', .6),
    silk2: std('#A8121C', .52, { emissive: '#2A0204', emissiveIntensity: .2, side: THREE.DoubleSide }),
    blouse: std('#C88A26', .48, { metalness: .25, emissive: '#2A1604', emissiveIntensity: .15 }),
    white: std('#EDE4D2', .6, { emissive: '#4A463E', emissiveIntensity: .2 }),
    red: std('#C2141E', .45), ruby: std('#D01828', .2, { metalness: .3, emissive: '#400408', emissiveIntensity: .6 }),
    emerald: std('#128A48', .22, { metalness: .3, emissive: '#022A12', emissiveIntensity: .5 }),
    pearl: std('#F2ECE0', .3, { emissive: '#5A564E', emissiveIntensity: .2 }),
    mari: [std('#F29A18', .75), std('#E8641A', .75), std('#F6C228', .75)], rose: std('#B01830', .6), leaf: std('#3E6A2A', .7),
    petal: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .62, side: THREE.DoubleSide }),
    clay: std('#8A4A26', .85), clayD: std('#5A2C16', .9),
  };
})();

// ---------- shapes ----------
// a tube along points (an arm, a necklace); r a number or [r0, r1] (a taper)
function tube3(parent, pts, r, mat, o = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => V3(...p))), segs = o.segs ?? 24, radial = o.radial ?? 10;
  const geo = new THREE.TubeGeometry(curve, segs, Array.isArray(r) ? r[0] : r, radial, false);
  if (Array.isArray(r)) {
    const pos = geo.attributes.position;
    for (let i = 0; i <= segs; i++) { const c = curve.getPointAt(i / segs), k = lerp(1, r[1] / r[0], i / segs); for (let j = 0; j <= radial; j++) { const v = i * (radial + 1) + j; pos.setXYZ(v, c.x + (pos.getX(v) - c.x) * k, c.y + (pos.getY(v) - c.y) * k, c.z + (pos.getZ(v) - c.z) * k); } }
    geo.computeVertexNormals();
  }
  return mesh3(parent, geo, mat, [0, 0, 0], o);
}
// beads along a curve (a garland, pearls)
function beads3(parent, pts, n, size, mats, o = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => V3(...p))), geo = new THREE.IcosahedronGeometry(size, 1);
  for (let i = 0; i < n; i++) { const p = curve.getPointAt(i / (n - 1)); mesh3(parent, geo, mats[i % mats.length], [p.x, p.y, p.z], { cast: o.cast ?? true }); }
}
// a cloth band along points [[x, y, z, nx, ny, nz], ...] (n: which way the cloth faces), w wide; o.edge: a material for
// the two borders (thin tubes along both edges). Returns the band's mesh.
function ribbon3(parent, pts, w, mat, o = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => V3(p[0], p[1], p[2]))), ncurve = new THREE.CatmullRomCurve3(pts.map(p => V3(p[3], p[4], p[5]).normalize()));
  const n = o.segs ?? 40, pos = [], idx = [], E = [[], []];
  for (let i = 0; i <= n; i++) {
    const u = i / n, c = curve.getPointAt(u), tg = curve.getTangentAt(u), nm = ncurve.getPointAt(u).normalize();
    const side = V3().crossVectors(tg, nm).normalize(), ww = w * (o.taper ? lerp(1, o.taper, u) : 1) / 2;
    const off = nm.clone().multiplyScalar(o.lift ?? .004);
    for (const s of [-1, 1]) { const p = c.clone().add(off).addScaledVector(side, s * ww); pos.push(p.x, p.y, p.z); E[s > 0 ? 1 : 0].push([p.x, p.y, p.z]); }
  }
  for (let i = 0; i < n; i++) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  const m = mesh3(parent, g, mat, [0, 0, 0], { cast: true });
  if (o.edge) for (const e of E) tube3(parent, e.filter((_, i) => i % 4 === 0 || i === e.length - 1), o.edgeR ?? .006, o.edge, { segs: n, radial: 6, cast: false });
  return m;
}
// a lotus petal L long, Wd wide, growing up +y and leaning out toward +z (o.base, o.bend), cupped (o.cup), pink from the
// base (o.c0) to the tip (o.c1), edges toward o.c2: vertex colours (ad 66's petal3)
function petal3(L, Wd, o = {}) {
  const nu = o.nu || 14, nv = o.nv || 6, shape = o.shape || (u => Math.pow(Math.sin(Math.PI * Math.pow(u, .55)), .9));
  const c0 = new THREE.Color(o.c0 || '#FFFFFF'), c1 = new THREE.Color(o.c1 || o.c0 || '#FFFFFF'), c2 = o.c2 ? new THREE.Color(o.c2) : null;
  const pos = [], col = [], idx = [], mid = [];
  let my = 0, mz = 0;
  for (let i = 0; i <= nu; i++) {
    const u = i / nu, th = (o.base || 0) + (o.bend || 0) * Math.pow(u, o.bendP || 1.4);
    if (i) { my += Math.cos(th) * L / nu; mz += Math.sin(th) * L / nu; }
    mid.push([my, mz, th]);
  }
  for (let i = 0; i <= nu; i++) {
    const u = i / nu, [y, z, th] = mid[i], w = Wd * shape(u) / 2;
    for (let j = 0; j <= nv; j++) {
      const v = j / nv * 2 - 1, x = v * w, cup = (o.cup || 0) * w * v * v;
      pos.push(x, y + Math.sin(th) * cup, z - Math.cos(th) * cup);
      const cc = c0.clone().lerp(c1, Math.pow(u, o.cP || 1)); if (c2) cc.lerp(c2, Math.pow(Math.abs(v), 3) * .6);
      col.push(cc.r, cc.g, cc.b);
    }
  }
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * (nv + 1) + j, b = a + nv + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx); g.computeVertexNormals(); return g;
}
// a lotus: rings of petals [[count, length, width, lean at the base, bend], ...] round a gold seed pod; s scales it
function lotus3(parent, pos, s = 1, o = {}) {
  const G = new THREE.Group(); G.position.set(...pos); G.scale.setScalar(s); if (o.rot) G.rotation.set(...o.rot); parent.add(G);
  const rings = o.rings || [[8, 1, .42, 1.15, .35], [8, .95, .4, .7, .3], [6, .8, .38, .3, .2]];
  rings.forEach(([n, L, Wd, base, bend], r) => {
    const geo = petal3(L, Wd, { base, bend, cup: .5, c0: o.c0 || '#F6D0DC', c1: o.c1 || '#E25A8A', c2: o.c2 || '#C83A6E', cP: .8 });
    for (let i = 0; i < n; i++) { const a = (i + r * .5) / n * TAU; const P = new THREE.Group(); P.rotation.y = a; G.add(P); mesh3(P, geo, MAT.petal, [0, 0, .05], { cast: o.cast ?? true }); }
  });
  mesh3(G, new THREE.CylinderGeometry(.18, .14, .14, 20), MAT.gold, [0, .1, 0], { cast: false });
  return G;
}

// ---------- the sanctum, dressed for Diwali ----------
function sanctum3() {
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#050406');
  scene.fog = new THREE.Fog('#07060A', 8, 16);
  scene.environment = studioEnv3({ room: '#0A0806', boxes: [[6, 5, 2, 6, 4, 2.2], [5, 3, -5, 2, 6, 1.4], [0, 9, 0, 5, 5, .8], [-6, 2, 5, 4, 3, .6]], floor: .3 }); scene.environmentIntensity = .5;
  const hemi = new THREE.HemisphereLight('#7A6C5E', '#20160E', .3); scene.add(hemi);
  // the key: a warm spot from above the door (the devotee's side); a cool rim from behind; a low warm bounce
  const key = new THREE.SpotLight('#FFD8B0', 26, 12, .32, .8, 1.4); key.position.set(4.2, 3.4, 1.4); key.target.position.set(0, 1.35, 0); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.0004; key.shadow.radius = 4; scene.add(key, key.target);
  const rim = new THREE.SpotLight('#C8D4FF', 8, 8, .5, .9, 1.6); rim.position.set(-1.2, 3, -1.6); rim.target.position.set(0, 1.4, 0); scene.add(rim, rim.target);
  const bounce = new THREE.PointLight('#FF9A50', 1.4, 3, 1.6); bounce.position.set(1.1, .6, 0); scene.add(bounce);
  // a soft warm light on her face and crown
  const face = new THREE.SpotLight('#FFE0B8', 7, 7, .1, .9, 1.2); face.position.set(4.5, 2.9, .6); face.target.position.set(0, SOLE + 1.6, 0); scene.add(face, face.target);
  const G = new THREE.Group(); scene.add(G);
  const wall = stone3({ col: '#4A3F36', seed: 3, rep: [4, 2], mottle: 1.6, speck: .5 });
  const floor = stone3({ col: '#5A5048', rows: 2, cols: 2, seed: 4, rep: [6, 6], mottle: 1.2, bumpK: 2 });
  mesh3(G, new THREE.PlaneGeometry(12, 8), floor, [3, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  mesh3(G, new THREE.PlaneGeometry(4.2, 3.6), wall, [-.75, 1.8, 0], { rot: [0, Math.PI / 2, 0], cast: false });          // the back wall
  for (const s of [-1, 1]) mesh3(G, new THREE.PlaneGeometry(6, 3.6), wall, [2, 1.8, s * 1.75], { rot: [0, s > 0 ? Math.PI : 0, 0], cast: false });
  mesh3(G, new THREE.PlaneGeometry(6, 4.2), stone3({ col: '#2E2620', seed: 5, rep: [3, 2] }), [2, 3.6, 0], { rot: [Math.PI / 2, 0, 0], cast: false });
  // a recess in the back wall behind her, darker (oil-smoked), pilasters either side
  block3(G, .1, 3.0, 2.0, stone3({ col: '#2A221D', seed: 6, rep: [1, 2], mottle: 2 }), [-.7, .02, 0]);
  for (const s of [-1, 1]) block3(G, .22, 3.4, .26, stone3({ col: '#5A4E44', seed: 7, rep: [.4, 3] }), [-.62, 0, s * 1.12]);

  // the pitha: a stepped granite base with a lotus course
  const gr = stone3({ col: '#6A5E54', seed: 8, rep: [1.4, .4] }), grD = stone3({ col: '#3A322C', seed: 9, rep: [1, .3] });
  block3(G, .9, .14, 1.2, gr, [0, 0, 0]); block3(G, .8, .2, 1.06, grD, [0, .14, 0]); block3(G, .9, .1, 1.16, gr, [0, .34, 0]);
  const bead = new THREE.SphereGeometry(.05, 10, 6);
  for (let i = 0; i < 26; i++) mesh3(G, bead, grD, [.45, .4, lerp(-.54, .54, i / 25)], { scale: [.3, .9, .5] });
  block3(G, .86, .06, 1.12, gr, [0, .44, 0]);
  // the pink lotus she stands on
  lotus3(G, [0, PED, 0], .3, { rings: [[12, .95, .36, 1.35, .25], [10, .8, .34, 1.0, .25], [8, .6, .32, .6, .2]] });
  mesh3(G, new THREE.CylinderGeometry(.19, .2, .06, 32), MAT.goldD, [0, PED + LOTUS_H - .03, 0]);
  // flowers on the pitha: marigolds, roses, leaves; and the heap of coins where her coins land
  const rnd = lcg(9), fl = new THREE.IcosahedronGeometry(.024, 1), lf = new THREE.SphereGeometry(.02, 8, 5);
  for (let i = 0; i < 40; i++) {
    const z = (rnd() - .5) * 1.0, x = .3 + rnd() * .13; if (z > .1 && z < .4) continue;
    const r = rnd(), m = r < .55 ? MAT.mari[i % 3] : r < .75 ? MAT.rose : MAT.leaf;
    mesh3(G, m === MAT.leaf ? lf : fl, m, [x, PED + .02, z], { scale: m === MAT.leaf ? [1.4, .25, .7] : 1, rot: [0, rnd() * 3, 0] });
  }
  const coin = new THREE.CylinderGeometry(.018, .018, .004, 18);
  for (let i = 0; i < 70; i++) { const a = rnd() * TAU, rr = Math.sqrt(rnd()) * .11, h = .05 * (1 - rr / .11); mesh3(G, coin, MAT.gold, [.3 + Math.cos(a) * rr * .7, PED + .004 + h * rnd(), .25 + Math.sin(a) * rr], { rot: [rnd() - .5, rnd() * 3, rnd() - .5], cast: false }); }

  // the prabhavali: a gold arch behind her, flames on its rim, on two posts
  const P = new THREE.Group(); P.position.set(-.4, SOLE, 0); G.add(P);
  mesh3(P, new THREE.TorusGeometry(.6, .026, 8, 64, Math.PI), MAT.gold, [0, 1.42, 0], { rot: [0, Math.PI / 2, 0] });
  mesh3(P, new THREE.TorusGeometry(.68, .015, 6, 64, Math.PI), MAT.goldD, [0, 1.42, 0], { rot: [0, Math.PI / 2, 0] });
  for (const s of [-1, 1]) mesh3(P, new THREE.CylinderGeometry(.028, .034, 1.42, 12), MAT.gold, [0, .71, s * .64]);
  const tip = new THREE.ConeGeometry(.028, .1, 8);
  for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI, y = 1.42 + Math.sin(a) * .73, z = Math.cos(a) * .73; mesh3(P, tip, MAT.gold, [0, y, z], { rot: [-(a - Math.PI / 2), 0, 0] }); }
  mesh3(P, new THREE.SphereGeometry(.055, 16, 10), MAT.gold, [0, 2.17, 0]);

  // lamps: two standing brass lamps either side, hanging lamps nearer the door, clay diyas in a row along the floor
  const lamps = [];
  for (const s of [-1, 1]) {
    mesh3(G, lathe3(smooth3([[0, 0], [.13, 0], [.13, .03], [.05, .07], [.025, .12], [.025, .82], [.05, .86], [.025, .89], [.1, .93], [.12, .97], [0, .96]], 3), 32), MAT.brass, [.55, 0, s * .88]);
    lamps.push(flame3(G, [.55, 1.0, s * .88], .8, { power: 1.4, range: 3.2 }));
  }
  for (const s of [-1, 1]) {
    mesh3(G, lathe3([[0, 0], [.07, 0], [.1, .03], [.1, .04], [0, .035]], 20), MAT.brass, [1.6, 2.1, s * 1.35]);
    mesh3(G, new THREE.CylinderGeometry(.005, .005, 1.5, 5), metal3('#5A4A3A', .6), [1.6, 2.85, s * 1.35], { cast: false });
    lamps.push(flame3(G, [1.6, 2.15, s * 1.35], .8, { power: .8, range: 3 }));
  }
  const diya = lathe3(smooth3([[0, 0], [.03, 0], [.05, .015], [.06, .035], [.055, .04], [.035, .025], [0, .022]], 3), 20);
  for (let i = 0; i < 9; i++) {
    const z = lerp(-1.05, 1.05, i / 8), x = .72 + .05 * Math.cos(i * 1.7);
    mesh3(G, diya, i % 2 ? MAT.clay : MAT.clayD, [x, 0, z], { scale: [1, 1, 1.25], cast: false });
    lamps.push(flame3(G, [x + .02, .035, z], .55, { light: i === 2 || i === 6, power: .7, range: 1.6, seed: i * 2.3 }));
  }
  // diyas on the pitha's front corners
  for (const s of [-1, 1]) { mesh3(G, diya, MAT.clay, [.38, PED, s * .5], { cast: false }); lamps.push(flame3(G, [.4, PED + .035, s * .5], .5, { light: false, seed: s * 4.1 })); }
  // marigold torans: swags across the recess and from the hanging lamps, a mango-leaf fringe
  const swag = (z0, z1, y, sag, x, n) => { const pts = []; for (let i = 0; i <= 8; i++) { const k = i / 8; pts.push([x, y - sag * Math.sin(Math.PI * k), lerp(z0, z1, k)]); } beads3(G, pts, n, .024, [MAT.mari[0], MAT.mari[2], MAT.mari[1], MAT.mari[0], MAT.rose], { cast: false }); };
  swag(-1.0, 0, 3.0, .22, -.5, 34); swag(0, 1.0, 3.0, .22, -.5, 34);
  swag(-1.6, 1.6, 3.35, .25, 1.2, 70);
  for (let i = 0; i < 9; i++) { const z = lerp(-1.4, 1.4, i / 8); mesh3(G, new THREE.SphereGeometry(.05, 8, 6), MAT.leaf, [1.2, 3.35 - .25 * Math.sin(Math.PI * i / 8) - .07, z], { scale: [.25, 1.6, .7], cast: false }); }

  // set(t, o): lamps (0..1); key / rim (multipliers)
  const set = (t, o = {}) => {
    lamps.forEach(l => l.set(t, o.lamps ?? 1));
    key.intensity = 26 * (o.key ?? 1); rim.intensity = 8 * (o.rim ?? 1); hemi.intensity = .3 * (o.hemi ?? 1);
    bounce.intensity = 1.4 * (o.key ?? 1); face.intensity = 7 * (o.face ?? 1); scene.environmentIntensity = .5 * (o.env ?? 1);
  };
  return { scene, G, lamps, key, rim, set };
}

// ---------- Maa Lakshmi ----------
// a bronze murti in a red silk saree on the lotus: her right is +z (screen left)
function lakshmi3(scene) {
  const M = new THREE.Group(); M.position.set(0, SOLE, 0); scene.add(M);
  const B = MAT.bronze, sc = (g, s) => { g.scale(...s); return g; };
  // feet and anklets under the hem
  for (const s of [-1, 1]) {
    mesh3(M, sc(new THREE.SphereGeometry(.075, 20, 12), [1, .34, .5]), B, [.07, .022, s * .065]);
    mesh3(M, new THREE.SphereGeometry(.034, 12, 8), B, [.0, .055, s * .065]);
    mesh3(M, new THREE.TorusGeometry(.038, .009, 8, 24), MAT.gold, [.005, .075, s * .065], { rot: [Math.PI / 2, 0, 0] });
  }
  // the saree: a skirt from the waist to the ankles, the hem in a broad gold border, the pleats down the front
  mesh3(M, lathe3(smooth3([[0, .085], [.172, .085], [.184, .1], [.178, .18], [.17, .36], [.178, .56], [.19, .7], [.182, .8], [.158, .9], [.138, .97], [0, .97]], 4), 48), MAT.silk, [0, 0, 0], { scale: [.66, 1, 1] });
  for (const [y, r, w] of [[.098, .186, .014], [.135, .181, .007], [.95, .142, .008]]) mesh3(M, new THREE.TorusGeometry(r, w, 8, 48), MAT.gold, [0, y, 0], { rot: [Math.PI / 2, 0, 0], scale: [.66, 1, 1] });
  for (let i = 0; i < 6; i++) {
    const z = lerp(-.055, .075, i / 5), x = .118 + .006 * Math.sin(i * 1.3);
    block3(M, .02, .8, .026, i % 2 ? MAT.silk : MAT.silkD, [x, .1, z], { rot: [0, .25, 0] });
    block3(M, .022, .05, .028, MAT.gold, [x + .002, .1, z], { rot: [0, .25, 0] });
  }
  // the torso: the waist bare between the saree and the blouse, the navel; a gold blouse; a gold belt with a ruby
  mesh3(M, lathe3(smooth3([[0, .94], [.135, .94], [.128, 1.0], [.132, 1.06], [.148, 1.13], [.16, 1.2], [.168, 1.27], [.155, 1.32], [.09, 1.365], [0, 1.37]], 4), 48), B, [0, 0, 0], { scale: [.6, 1, 1] });
  mesh3(M, lathe3(smooth3([[.153, 1.11], [.165, 1.18], [.173, 1.27], [.162, 1.31], [.12, 1.33]], 3), 48), MAT.blouse, [0, 0, 0], { scale: [.62, 1, 1] });
  for (const s of [-1, 1]) mesh3(M, sc(new THREE.SphereGeometry(.052, 18, 12), [.95, .85, 1]), MAT.blouse, [.072, 1.19, s * .052]);
  mesh3(M, new THREE.TorusGeometry(.012, .0035, 6, 16), MAT.gold, [.078, 1.015, 0], { rot: [0, Math.PI / 2, 0] });
  mesh3(M, new THREE.TorusGeometry(.142, .013, 8, 48), MAT.gold, [0, .955, 0], { rot: [Math.PI / 2, 0, 0], scale: [.64, 1, 1] });
  mesh3(M, new THREE.SphereGeometry(.022, 12, 8), MAT.ruby, [.093, .955, 0], { scale: [.6, 1, 1] });
  // the pallu: from her right hip across the chest and over the left shoulder, down her back, gold-bordered
  ribbon3(M, [[.1, .9, .135, .6, 0, .8], [.11, 1.02, .085, 1, 0, .4], [.128, 1.12, .03, 1, 0, .1], [.142, 1.21, -.035, 1, .1, -.1], [.1, 1.3, -.1, .7, .5, -.4], [.0, 1.345, -.15, 0, 1, -.3], [-.09, 1.3, -.165, -.7, .4, -.5], [-.13, 1.1, -.16, -1, 0, -.3], [-.14, .88, -.16, -1, 0, -.2]], .11, MAT.silk2, { edge: MAT.gold, edgeR: .005, lift: .008 });
  // necklaces: a gold collar, a long haar with an emerald, pearls
  tube3(M, [[.02, 1.355, .085], [.068, 1.33, .045], [.078, 1.315, 0], [.068, 1.33, -.045], [.02, 1.355, -.085]], .011, MAT.gold, { segs: 20 });
  tube3(M, [[.03, 1.35, .11], [.115, 1.24, .07], [.15, 1.08, 0], [.115, 1.24, -.07], [.03, 1.35, -.11]], .007, MAT.gold, { segs: 24 });
  mesh3(M, sc(new THREE.SphereGeometry(.024, 14, 10), [.6, 1.2, 1]), MAT.emerald, [.155, 1.075, 0]);
  beads3(M, [[.03, 1.345, .125], [.11, 1.27, .095], [.135, 1.2, 0], [.11, 1.27, -.095], [.03, 1.345, -.125]], 26, .007, [MAT.pearl]);
  // the garland: marigolds from the shoulders to below the knees, a rose between
  beads3(M, [[.0, 1.33, .17], [.11, 1.08, .17], [.155, .72, .15], [.165, .48, .08], [.17, .44, 0], [.165, .48, -.08], [.155, .72, -.15], [.11, 1.08, -.17], [.0, 1.33, -.17]], 120, .015, [MAT.mari[0], MAT.mari[2], MAT.mari[1], MAT.mari[0], MAT.mari[2], MAT.rose]);
  // the arms: shoulder → elbow → hand
  const arm = (pts, r0, r1) => { tube3(M, pts.slice(0, 2), [r0, (r0 + r1) / 2], B, { segs: 8 }); tube3(M, pts.slice(1), [(r0 + r1) / 2, r1], B, { segs: 10 }); };
  const UR = [[0, 1.29, .155], [-.03, 1.2, .27], [.0, 1.4, .315]], UL = UR.map(([x, y, z]) => [x, y, -z]);
  const LR = [[.0, 1.27, .15], [.03, 1.07, .21], [.15, .93, .215]], LL = [[.0, 1.27, -.15], [.03, 1.07, -.21], [.13, .96, -.2]];
  for (const Pp of [UR, UL, LR, LL]) arm(Pp, .036, .026);
  // short blouse sleeves over the upper arms, a gold edge
  for (const Pp of [UR, UL, LR, LL]) { const e = Pp[0].map((v, i) => lerp(v, Pp[1][i], .4)); tube3(M, [Pp[0], e], .043, MAT.blouse, { segs: 4 }); mesh3(M, new THREE.TorusGeometry(.042, .006, 6, 18), MAT.gold, e, { rot: [Math.atan2(Pp[1][2] - Pp[0][2], Pp[1][1] - Pp[0][1]) + Math.PI / 2, 0, 0] }); }
  const ring = (p, r, rot, m = MAT.gold, w = .008) => mesh3(M, new THREE.TorusGeometry(r, w, 6, 20), m, p, { rot });
  for (const s of [-1, 1]) { ring([-.012, 1.2, s * .25], .036, [0, 0, s * .4]); ring([.0, 1.36, s * .31], .028, [Math.PI / 2, 0, 0]); ring([.0, 1.345, s * .312], .028, [Math.PI / 2, 0, 0], MAT.ruby, .006); }
  for (let i = 0; i < 3; i++) { ring([.12 + i * .008, .945 - i * .005, .214], .027, [0, 0, .9], i === 1 ? MAT.ruby : MAT.gold, .006); ring([.1 + i * .008, .975 - i * .004, -.2], .027, [0, 0, -.8], i === 1 ? MAT.emerald : MAT.gold, .006); }
  // hands: the raised two hold lotuses; the lower right open, palm out and down (coins pour from it); the lower left
  // holds a kalash of coins at her hip
  const hand = (p, s) => mesh3(M, sc(new THREE.SphereGeometry(.032, 14, 10), s), B, p);
  hand([.005, 1.42, .315], [.7, 1.2, .9]); hand([.005, 1.42, -.315], [.7, 1.2, .9]);
  hand([.168, .9, .215], [.7, 1.35, 1]); hand([.14, .935, -.195], [.9, .8, 1.1]);
  for (const s of [-1, 1]) {
    tube3(M, [[.01, 1.38, s * .318], [.015, 1.46, s * .322], [.02, 1.52, s * .33]], .005, MAT.leaf, { segs: 6, radial: 5, cast: false });
    lotus3(M, [.02, 1.53, s * .33], .1, { rot: [0, 0, -.25] });
  }
  const kal = new THREE.Group(); kal.position.set(.17, .87, -.19); M.add(kal);
  mesh3(kal, lathe3(smooth3([[0, 0], [.03, 0], [.05, .02], [.058, .05], [.05, .08], [.03, .095], [.028, .105], [.038, .115], [0, .112]], 3), 32), MAT.gold, [0, 0, 0]);
  const coinG = new THREE.CylinderGeometry(.013, .013, .003, 14);
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; mesh3(kal, coinG, MAT.gold, [Math.cos(a) * .02, .118 + .008 * (i % 3), Math.sin(a) * .02], { rot: [.5 * Math.sin(i), a, .4], cast: false }); }
  // neck and head: an oval face, half-closed eyes, a red bindi, a maang tikka, a nath, jhumkas, a kirita
  mesh3(M, new THREE.CylinderGeometry(.045, .055, .1, 16), B, [0, 1.395, 0]);
  const head = new THREE.Group(); head.position.set(0, 1.525, 0); M.add(head);
  const hg = new THREE.SphereGeometry(.09, 40, 30), hp = hg.attributes.position;
  for (let i = 0; i < hp.count; i++) {
    let x = hp.getX(i), y = hp.getY(i) * 1.18, z = hp.getZ(i);
    const lo = clamp(-y / .106), k = 1 - .3 * lo * lo;
    x *= .95 * k; z *= .9 * k; if (x > 0) x *= 1 + .08 * (1 - Math.abs(z) / .08);
    hp.setXYZ(i, x, y, z);
  }
  hg.computeVertexNormals(); mesh3(head, hg, B, [0, -.005, 0]);
  // the hair: swept back under the crown, a bun at the nape
  mesh3(head, sc(new THREE.SphereGeometry(.094, 24, 16), [.92, 1.02, 1.0]), MAT.bronzeD, [-.018, .02, 0]);
  mesh3(head, new THREE.SphereGeometry(.05, 16, 12), MAT.bronzeD, [-.1, -.05, 0]);
  const nose = mesh3(head, new THREE.CylinderGeometry(.0025, .011, .05, 3), B, [.086, -.006, 0], { rot: [0, 0, -.12] });
  nose.rotation.order = 'ZYX'; nose.rotation.y = Math.PI;
  mesh3(head, sc(new THREE.SphereGeometry(.009, 10, 8), [1, .7, 1.5]), B, [.089, -.031, 0]);
  mesh3(head, sc(new THREE.SphereGeometry(.014, 12, 8), [.45, .32, 1.25]), B, [.079, -.054, 0]);
  for (const s of [-1, 1]) {
    mesh3(head, sc(new THREE.SphereGeometry(.021, 20, 12), [.42, .42, 1.3]), B, [.07, .022, s * .036], { rot: [0, s * .3, s * -.14] });
    mesh3(head, sc(new THREE.SphereGeometry(.021, 16, 8), [.2, .1, 1.15]), MAT.lid, [.077, .013, s * .037], { rot: [0, s * .3, s * -.14], cast: false });
    tube3(head, [[.07, .038, s * .011], [.079, .049, s * .036], [.072, .044, s * .06]], .0035, B, { segs: 8, radial: 6, cast: false });
  }
  mesh3(head, new THREE.SphereGeometry(.0065, 10, 8), MAT.red, [.087, .04, 0], { cast: false });                                    // the bindi
  tube3(head, [[.07, .085, 0], [.088, .07, 0]], .002, MAT.gold, { segs: 4, radial: 5, cast: false });                              // the maang tikka
  mesh3(head, sc(new THREE.SphereGeometry(.009, 10, 8), [.5, 1.1, 1]), MAT.gold, [.09, .066, 0], { cast: false });
  mesh3(head, new THREE.SphereGeometry(.004, 8, 6), MAT.ruby, [.094, .066, 0], { cast: false });
  mesh3(head, new THREE.TorusGeometry(.011, .0018, 6, 18), MAT.gold, [.086, -.04, -.014], { rot: [0, Math.PI / 2 - .3, 0], cast: false });   // the nath
  for (const s of [-1, 1]) {
    mesh3(head, sc(new THREE.SphereGeometry(.021, 10, 8), [.6, 1.6, .5]), B, [-.005, -.012, s * .086]);
    mesh3(head, new THREE.SphereGeometry(.008, 10, 8), MAT.ruby, [.002, -.04, s * .094]);
    mesh3(head, new THREE.ConeGeometry(.018, .028, 16, 1, true), MAT.gold, [.002, -.062, s * .095], { cast: false });   // jhumka bells
    beads3(head, [[.002, -.076, s * .08], [.002, -.08, s * .095], [.002, -.076, s * .11]], 5, .0035, [MAT.pearl], { cast: false });
  }
  // the kirita: a gold crown in tiers, rubies, a front plate, flares at the sides
  const kir = lathe3([[0, 0], [.098, 0], [.11, .022], [.098, .04], [.102, .075], [.09, .095], [.093, .13], [.078, .15], [.08, .185], [.062, .205], [.064, .24], [.044, .26], [.038, .3], [.02, .335], [.008, .36], [0, .37]], 64);
  mesh3(head, kir, MAT.gold, [0, .075, 0]);
  for (const [y, r] of [[.15, .082], [.25, .06]]) for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; mesh3(head, new THREE.SphereGeometry(.008, 8, 6), i % 2 ? MAT.emerald : MAT.ruby, [Math.cos(a) * r, .075 + y, Math.sin(a) * r]); }
  mesh3(head, sc(new THREE.SphereGeometry(.055, 16, 10), [.12, 1.1, 1]), MAT.gold, [.09, .125, 0]);
  mesh3(head, new THREE.SphereGeometry(.016, 12, 8), MAT.ruby, [.098, .125, 0], { scale: [.6, 1, 1] });
  for (const s of [-1, 1]) mesh3(head, sc(new THREE.SphereGeometry(.05, 16, 10), [.15, 1.1, .8]), MAT.goldD, [-.03, .06, s * .09]);
  // her right palm (world), where the coins leave
  const PALM = [.185, SOLE + .87, .22];
  return { group: M, head, PALM };
}

// ---------- her coins: a stream from the palm onto the heap, periodic in `per` seconds ----------
// n coins in flight, each one dropping every per/k s; with per = the loop's length the stream loops seamlessly
function coins3(scene, from, to, o = {}) {
  const G = new THREE.Group(); scene.add(G);
  const n = o.n ?? 8, fall = o.fall ?? .8, geo = new THREE.CylinderGeometry(.024, .024, .005, 20), rnd = lcg(31);
  const C = Array.from({ length: n }, () => ({ m: mesh3(G, geo, MAT.gold, [0, 0, 0], { cast: false }), dx: (rnd() - .5) * .06, dz: (rnd() - .5) * .07, sp: 6 + rnd() * 8, ax: rnd() * 3 }));
  const glint = C.map(c => glow3(c.m, [0, 0, 0], .09, '#FFD27A', .6));
  // set(t, per): each coin's phase (t / per × cycles + i / n), rate about o.rate coins a second
  const set = (t, per) => {
    const cycles = Math.max(1, Math.round((o.rate ?? 6) * per / n));
    C.forEach((c, i) => {
      const ph = ((t / per * cycles + i / n) % 1 + 1) % 1, life = ph * per / cycles;
      const k = clamp(life / fall); c.m.visible = k < 1;
      const y = lerp(from[1], to[1], k * k), x = lerp(from[0], to[0] + c.dx, k), z = lerp(from[2], to[2] + c.dz, k);
      c.m.position.set(x + .02 * Math.sin(k * 3), y, z); c.m.rotation.set(c.ax + life * c.sp, life * c.sp * .7, .4);
      glint[i].material.opacity = .6 * (.4 + .6 * Math.abs(Math.sin(life * c.sp * 1.3)));
    });
  };
  return { group: G, set };
}

// ---------- the aarti lamp (ad 54's) ----------
// a five-wick pancha-pradip: a brass dish on a stem, five cups, a handle toward the devotee. Its light casts shadows.
function aartiLamp3(scene) {
  const G = new THREE.Group(); G.scale.setScalar(1.15); scene.add(G);
  mesh3(G, lathe3(smooth3([[0, -.09], [.035, -.09], [.04, -.08], [.016, -.05], [.014, -.02], [.06, -.005], [.075, .005], [.07, .012], [0, .01]], 3), 32), MAT.brass, [0, 0, 0], { cast: false });
  tube3(G, [[.02, -.04, 0], [.14, -.1, 0], [.3, -.2, 0]], .009, MAT.brass, { segs: 10, cast: false });
  const cups = [[0, 0], [.04, 0], [-.04, 0], [0, .04], [0, -.04]], fl = [];
  const cup = lathe3([[0, 0], [.012, 0], [.018, .008], [.02, .016], [0, .014]], 16);
  cups.forEach(([x, z], i) => { mesh3(G, cup, MAT.brass, [x, .012, z], { cast: false }); fl.push(flame3(G, [x, .03, z], .85, { light: false, seed: i * 3.7 })); });
  const light = new THREE.PointLight('#FFA24A', 0, 5.5, 1.5); light.position.set(0, .08, 0);
  light.castShadow = true; light.shadow.mapSize.set(1024, 1024); light.shadow.bias = -.003; light.shadow.radius = 5; light.shadow.camera.near = .05;
  G.add(light);
  const halo = glow3(G, [0, .07, 0], .45, '#FFB050', .4);
  const place = (p, t, o = {}) => {
    G.position.set(...p); const on = o.on ?? 1; G.visible = on > .001;
    fl.forEach(f => f.set(t, on));
    light.intensity = (o.power ?? 4) * on * (.9 + .1 * vnoise(t * 8, 4));
    halo.material.opacity = .5 * on; halo.scale.setScalar(.8);
  };
  return { group: G, light, place };
}

// ---------- the rings ----------
// a point on circle k of a part at progress p (0..1, clockwise as the devotee sees it, from the part's start)
function circleAt(part, k, p) {
  const P = PARTS[part], g = P.grow ?? RGROW, ry = (P.ry ?? P.r) * (1 + k * g), rz = (P.rz ?? P.r) * (1 + k * g), th = -Math.PI / 2 - (p + (P.p0 || 0)) * TAU;
  return [RX + k * RSTEP, P.y + Math.sin(th) * ry, -Math.cos(th) * rz];
}
// a glowing gold ribbon along points, a hot core and a soft halo, revealed along its length with .set(p, a)
function glowTube3(parent, pts, o = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => V3(...p))), n = o.segs ?? 120;
  const mk = (r, col, a) => {
    const m = mesh3(parent, new THREE.TubeGeometry(curve, n, r, 6, false), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: a, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }), [0, 0, 0], { cast: false, receive: false });
    m.a0 = a; return m;
  };
  const core = mk(o.r ?? .007, o.core || '#FFC872', .85), halo = mk((o.r ?? .007) * 3, o.col || '#FF8A20', .16);
  const set = (p, a = 1) => {
    p = clamp(p); const vis = p > .002 && a > .002;
    for (const m of [core, halo]) { m.visible = vis; m.material.opacity = m.a0 * a; m.geometry.setDrawRange(0, Math.ceil(p * n) * 6 * 6); }
  };
  set(0); return { set, curve };
}
function rings3(parent) {
  const R = {};
  for (const id in PARTS) R[id] = Array.from({ length: PARTS[id].n }, (_, k) => glowTube3(parent, Array.from({ length: 73 }, (_, i) => circleAt(id, k, i / 72)), { segs: id === 'whole' ? 160 : 96, r: id === 'whole' ? .008 : .0055 }));
  return R;
}

// ---------- 2D ----------
// a dark band behind 2D lettering (y0..y1, fading at both ends)
function band(c, y0, y1, a = .6) {
  c.save(); const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(6,5,10,0)'); g.addColorStop(.25, `rgba(6,5,10,${a})`); g.addColorStop(.75, `rgba(6,5,10,${a})`); g.addColorStop(1, 'rgba(6,5,10,0)');
  c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); c.restore();
}
// the tracker: FEET 4 · NAVEL 2 · FACE 3 · BODY 7 as a column of chips at x from y0 down; cur the part being circled
// (index), done how many of its circles have begun (a dot each), o.pulse a beat on each new circle
const CHIPS = [['FEET', 4], ['NAVEL', 2], ['FACE', 3], ['BODY', 7]];
function tracker(c, x, y0, cur, done, o = {}) {
  const w = 132, h = 118, gap = 16, a = o.alpha ?? 1;
  CHIPS.forEach(([lab, n], i) => {
    const on = i === cur, past = cur >= 0 && i < cur, y = y0 + i * (h + gap), k = on ? 1.08 + .07 * (o.pulse ?? 0) : 1, ga = a * (on ? 1 : past ? .5 : .72);
    c.save(); c.globalAlpha *= ga; c.translate(x, y); c.scale(k, k);
    c.fillStyle = on ? 'rgba(46,24,6,.9)' : 'rgba(14,10,8,.74)'; c.strokeStyle = on ? '#FFD27A' : 'rgba(244,196,106,.45)'; c.lineWidth = on ? 4 : 2;
    c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 20); c.fill(); c.stroke();
    if (on) { c.shadowColor = 'rgba(255,190,90,.75)'; c.shadowBlur = 28; c.stroke(); c.shadowBlur = 0; }
    c.restore();
    const kk = on ? k : 1;
    text(c, lab, x, y - 36 * kk, '700 22px Cinzel', on ? '#FFE2A0' : '#CDB89A', { alpha: ga, spacing: 2 });
    text(c, String(n), x, y + 2 * kk, `700 ${on ? 50 : 44}px Cinzel`, on ? '#FFF3DC' : '#E8D2A8', { alpha: ga });
    // the dots: one per circle, lit as they begin (two rows for the body's seven)
    const rows = n > 4 ? [4, n - 4] : [n];
    rows.forEach((m, r) => {
      const dg = 22, dx0 = x - (m - 1) * dg / 2, dy = y + (rows.length > 1 ? 32 + r * 18 : 38) * kk;
      for (let j = 0; j < m; j++) {
        const idx = (r ? 4 : 0) + j, lit = past || (on && idx < done);
        c.save(); c.globalAlpha *= ga; c.fillStyle = lit ? '#FFD27A' : 'rgba(255,226,160,.22)';
        if (lit && on) { c.shadowColor = '#FFB050'; c.shadowBlur = 10; }
        c.beginPath(); c.arc(dx0 + j * dg, dy, 6.5, 0, TAU); c.fill(); c.restore();
      }
    });
  });
}
