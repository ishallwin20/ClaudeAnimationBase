// nidhi_props.js: the sets of the Nidhivan reel (3D style, src/cine3d_glb.js for the models in assets/glb).
// Units metres, y up; the grove runs to -z from its gate at z 0 (the street is +z).
//   GROVE  the grove: paired, twisted tulsi trees (dry_tree.glb's gnarled trunks, grown leaves in code), dusty floor
//          strewn with leaves, a paved path with a low railing, the boundary wall and its iron gate with an Aligarh lock
//   ROOM   the Rang Mahal: a small painted chamber, the carved bed made for the night, the offerings on a chowki
//   HOUSE  a neighbour's wall across the lane, its window bricked up
//   BANK   the Yamuna's sand bank under the moon (the Raas ring of Radha-Krishna, radha_krishna_01.glb)
const RAD = Math.PI / 180;
const rnd3 = (s) => lcg(s);

// ---------- materials ----------
// grime: a mottled noise for tarnish (o: 1 = colour multiply, else roughness)
function grimeTex(col) {
  return tex3('grime' + (col || 0), 256, 256, (g, w, h) => {
    const r = rnd3(13); g.fillStyle = col ? '#E8E0D0' : '#B0B0B0'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) { const x = r() * w, y = r() * h, s = 2 + r() * 22, v = r(); g.fillStyle = col ? `rgba(${40 + v * 40},${30 + v * 30},${20},${.05 + r() * .12})` : `rgba(${v > .5 ? 255 : 40},${v > .5 ? 255 : 40},${v > .5 ? 255 : 40},${.05 + r() * .1})`; g.beginPath(); g.arc(x, y, s, 0, TAU); g.fill(); }
  }, { data: !col });
}
const MAT = {
  floor: pbr3('leafground', { rep: [14, 14], tint: '#C8B49A', normalK: 1.2 }),
  dirt: pbr3('dirt', { rep: [10, 10], tint: '#C9B091' }),
  pave: pbr3('paving', { rep: [1.2, 14], tint: '#D8C2A6', normalK: 1.1 }),
  plaster: pbr3('plaster', { rep: [3, 1.2], tint: '#B8A088' }),
  wallBrick: pbr3('brick', { rep: [8, 1.6], tint: '#A87868', normalK: 1.3 }),
  plasterPink: pbr3('plaster', { rep: [2, 1.4], tint: '#E8B9A8' }),
  brick: pbr3('brick', { rep: [2, 2], tint: '#C89078' }),
  rust: pbr3('rust', { rep: [1, 6], tint: '#5A4A40', rough: 1, metal: .3 }),
  wood: pbr3('carvedwood', { rep: [1, 1], tint: '#B07A4A' }),
  dark: pbr3('darkwood', { rep: [1, 1], tint: '#8A5A38' }),
  marble: pbr3('marble', { rep: [4, 4], tint: '#F2EBE0' }),
  silk: pbr3('silk', { rep: [3, 3], tint: '#B8243A', normalK: .6, rough: .7 }),
  silkGold: pbr3('silk', { rep: [3, 3], tint: '#D8A040', normalK: .6, rough: .6 }),
  brass: new THREE.MeshStandardMaterial({ color: '#B8893A', metalness: .6, roughness: .45, envMapIntensity: .6, roughnessMap: grimeTex(), map: grimeTex(1) }),
  brassOld: new THREE.MeshStandardMaterial({ color: '#9A7840', metalness: .6, roughness: .6, envMapIntensity: .7, roughnessMap: grimeTex(), map: grimeTex(1), bumpMap: grimeTex(), bumpScale: .4 }),
  silver: new THREE.MeshStandardMaterial({ color: '#C8C4BA', metalness: .6, roughness: .4, envMapIntensity: .6 }),
  iron: new THREE.MeshStandardMaterial({ color: '#2A2624', metalness: .5, roughness: .7 }),
};

// ---------- the trees ----------
// dry_tree.glb holds three gnarled trees side by side (trunk + a twig-card mesh each). Each is baked into a template
// (its foot at 0, h metres tall), and leaves are grown on it: small oval tulsi leaves in clusters on instanced cards,
// placed along the twigs and the upper limbs.
const leafTex = tex3('tulsiLeaf', 256, 256, (g, w, h) => {
  const r = rnd3(5); g.clearRect(0, 0, w, h);
  for (let i = 0; i < 9; i++) {
    const x = 40 + r() * 176, y = 40 + r() * 176, a = r() * TAU, L = 34 + r() * 26, W = L * .55;
    g.save(); g.translate(x, y); g.rotate(a);
    const gr = g.createLinearGradient(-W, 0, W, 0); const k = .75 + r() * .5;
    gr.addColorStop(0, `rgb(${46 * k | 0},${74 * k | 0},${34 * k | 0})`); gr.addColorStop(.5, `rgb(${78 * k | 0},${112 * k | 0},${52 * k | 0})`); gr.addColorStop(1, `rgb(${40 * k | 0},${66 * k | 0},${30 * k | 0})`);
    g.fillStyle = gr; g.beginPath(); g.moveTo(0, -L);
    for (let s = 0; s <= 1; s += .1) g.lineTo(W * Math.sin(s * Math.PI) * (1 + .06 * Math.sin(s * 40)), -L + 2 * L * s);
    for (let s = 1; s >= 0; s -= .1) g.lineTo(-W * Math.sin(s * Math.PI) * (1 + .06 * Math.sin(s * 40)), -L + 2 * L * s);
    g.fill(); g.strokeStyle = 'rgba(150,170,110,.5)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, -L * .9); g.lineTo(0, L); g.stroke();
    g.restore();
  }
});
const leafMat = new THREE.MeshStandardMaterial({ map: leafTex, alphaTest: .45, side: THREE.DoubleSide, roughness: .8, metalness: 0, color: '#C8D0B8' });
const TREES = { tpl: [] };
const treeGLB = glb3('assets/glb/dry_tree.glb', { scale: 1, onload: (g) => {
  const meshes = []; g.gltf.scene.updateMatrixWorld(true);
  g.gltf.scene.traverse(n => { if (n.isMesh) meshes.push(n); });
  const bake = (m) => { const geo = m.geometry.clone(); geo.applyMatrix4(m.matrixWorld); return geo; };
  for (let i = 1; i <= 3; i++) {
    const trunk = meshes.find(m => new RegExp('tree' + i + '_').test(m.name)) || meshes.filter(m => /tree/.test(m.name))[i - 1];
    const twig = meshes.find(m => new RegExp(i === 1 ? '^branches_branches' : '^branches_' + i + '_').test(m.name)) || meshes.filter(m => /branches/.test(m.name))[i - 1];
    if (!trunk) continue;
    const tg = bake(trunk), wg = twig ? bake(twig) : null;
    tg.computeBoundingBox(); const b = tg.boundingBox, foot = [(b.min.x + b.max.x) / 2, b.min.y, (b.min.z + b.max.z) / 2];
    // the root flare's centre: the mean of the lowest vertices
    const k = 1 / (b.max.y - b.min.y);
    for (const geo of [tg, wg]) if (geo) { geo.translate(-foot[0], -foot[1], -foot[2]); geo.scale(k, k, k); geo.computeBoundingSphere(); }
    TREES.tpl.push({ trunk: tg, twig: wg, tmat: trunk.material, wmat: twig && twig.material });
  }
} });

// tree3(parent, i, pos, o): one tree from template i, o.h metres tall, o.yaw, o.lean [x, z] radians, o.leaves (count),
// o.squash (y scale against x/z, <1 = stockier). Returns a group (filled once the model has loaded).
function tree3(parent, i, pos, o = {}) {
  const g = new THREE.Group(); g.position.set(...pos); g.rotation.set(o.lean?.[0] || 0, o.yaw || 0, o.lean?.[1] || 0); parent.add(g);
  treeGLB.ready.then(() => {
    const T = TREES.tpl[i % TREES.tpl.length], h = o.h ?? 3.2, sq = o.squash ?? 1, w = h / sq;
    const tm = new THREE.Mesh(T.trunk, T.tmat); tm.scale.set(w * .9, h, w * .9); tm.castShadow = tm.receiveShadow = true; g.add(tm);
    if (T.twig && o.twigs !== false) { const wm = new THREE.Mesh(T.twig, T.wmat); wm.scale.copy(tm.scale); wm.castShadow = true; g.add(wm); }
    // leaves on the twigs (and the trunk's upper third)
    const n = o.leaves ?? 2600, r = rnd3((o.seed ?? 1) * 97 + i), src = [];
    if (T.twig) { const p = T.twig.attributes.position; for (let j = 0; j < p.count; j += 3) src.push([p.getX(j), p.getY(j), p.getZ(j)]); }
    const pt = T.trunk.attributes.position; for (let j = 0; j < pt.count; j += 11) if (pt.getY(j) > .72) src.push([pt.getX(j), pt.getY(j), pt.getZ(j)]);
    if (!src.length) return;
    const im = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), leafMat, n), M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), S = V3(), P = V3();
    for (let j = 0; j < n; j++) {
      const s = src[(r() * src.length) | 0], sz = (o.leaf ?? .2) * (.6 + r() * .7);
      P.set(s[0] * tm.scale.x + (r() - .5) * .25, s[1] * h + (r() - .5) * .2 - r() * .12 * (o.droop ?? 1), s[2] * tm.scale.z + (r() - .5) * .25);
      E.set(r() * TAU, r() * TAU, r() * TAU); Q.setFromEuler(E); S.setScalar(sz); M.compose(P, Q, S); im.setMatrixAt(j, M);
      const c = .7 + r() * .45; im.setColorAt(j, new THREE.Color(c, c * (.95 + r() * .1), c * .85));
    }
    im.castShadow = true; im.receiveShadow = true; g.add(im); g.leaves = im;
  });
  return g;
}
// a pair: two trees whose trunks lean into each other (Nidhivan's trees grow in pairs, intertwined)
function pair3(parent, pos, o = {}) {
  const yaw = o.yaw ?? 0, d = o.gap ?? .55, lean = o.lean ?? 9 * RAD, s = o.seed ?? 1, r = rnd3(s * 31);
  const dx = Math.cos(yaw) * d / 2, dz = -Math.sin(yaw) * d / 2, h = o.h ?? 3.2;
  const a = tree3(parent, s % 3, [pos[0] - dx, pos[1], pos[2] - dz], { ...o, h: h * (.92 + r() * .16), yaw: yaw + r() * 6, lean: [0, -lean], seed: s });
  const b = tree3(parent, (s + 1) % 3, [pos[0] + dx, pos[1], pos[2] + dz], { ...o, h: h * (.85 + r() * .16), yaw: yaw + 3 + r() * 6, lean: [0, lean], seed: s + 50 });
  return [a, b];
}

// ---------- the grove ----------
// GROVE.scene; .set(mood, t): 'dusk' (amber sunset through the trees), 'night' (moonlight), 'dawn'
function grove3() {
  const S = new THREE.Scene(), g = new THREE.Group(); S.add(g);
  // the floor: dusty earth with leaves, a little uneven
  const fl = mesh3(g, new THREE.PlaneGeometry(90, 90, 160, 160), MAT.floor, [0, 0, -20], { rot: [-Math.PI / 2, 0, 0], cast: false });
  { const p = fl.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, .06 * Math.sin(x * .9) * Math.cos(y * .7) + .03 * Math.sin(x * 2.3 + y * 1.7)); } fl.geometry.computeVertexNormals(); }
  // the path: paved, 1.6 m wide, from the gate to the Rang Mahal (z -34), a low iron railing on both sides
  const path = mesh3(g, new THREE.BoxGeometry(1.6, .08, 34), MAT.pave, [0, .04, -17], { cast: false });
  for (const sx of [-1, 1]) {
    for (let z = -1; z > -33; z -= 2) { box3(g, .04, .62, .04, MAT.iron, [sx * 1.0, .31, z]); }
    for (const y of [.3, .6]) mesh3(g, new THREE.CylinderGeometry(.015, .015, 32, 6), MAT.iron, [sx * 1.0, y, -17], { rot: [Math.PI / 2, 0, 0] });
  }
  // the trees: pairs on both sides of the path, thick near it, then more behind into the dark
  const r = rnd3(4), trees = [];
  for (let i = 0; i < 46; i++) {
    const side = i % 2 ? 1 : -1, row = Math.floor(i / 2), z = -1.5 - row * 1.5 - r() * .8, x = side * (2.7 + r() * 1.3 + (i > 28 ? 2.5 : 0));
    trees.push(...pair3(g, [x, 0, z], { seed: i + 1, yaw: r() * TAU, h: 2.8 + r() * 1.1, gap: .45 + r() * .3, squash: .85 }));
  }
  for (let i = 0; i < 40; i++) { const side = r() < .5 ? -1 : 1; trees.push(...pair3(g, [side * (5.5 + r() * 9), 0, -2 - r() * 36], { seed: 100 + i, yaw: r() * TAU, h: 2.6 + r() * 1.4, leaves: 1800, squash: .85 })); }
  // the wall at z 0 with the gate (2.4 m wide, 3 m tall) in the middle, plastered, old
  const wall = new THREE.Group(); g.add(wall);
  for (const sx of [-1, 1]) block3(wall, 30, 3, .45, MAT.wallBrick, [sx * 16.4, 0, .2]);
  for (const sx of [-1, 1]) { block3(wall, .8, 3.8, .8, MAT.plaster, [sx * 1.6, 0, .2]); block3(wall, 1, .18, 1, MAT.plaster, [sx * 1.6, 3.8, .2]); }
  block3(wall, 4, .5, .6, MAT.plaster, [0, 3.3, .2]);
  // the iron gate: two leaves of bars with an arched top, a lock on a chain where they meet
  const gate = new THREE.Group(); gate.position.set(0, 0, .2); g.add(gate);
  for (const sx of [-1, 1]) {
    const leaf = new THREE.Group(); leaf.position.set(sx * 1.2, 0, 0); gate.add(leaf);
    for (let j = 0; j < 7; j++) { const x = -sx * (.08 + j * .17), top = 2.55 + .35 * Math.sin((1 - (j + .5) / 7.4) * Math.PI / 2 * (sx < 0 ? 1 : 1)); mesh3(leaf, new THREE.CylinderGeometry(.018, .018, top, 8), MAT.rust, [x, top / 2 + .05, 0]); mesh3(leaf, new THREE.ConeGeometry(.035, .12, 8), MAT.rust, [x, top + .1, 0]); }
    for (const y of [.25, 1.25, 2.3]) box3(leaf, 1.18, .06, .03, MAT.rust, [-sx * .59, y, 0]);
  }
  const lock = lock3(gate, [0, 1.22, .07]);
  // the Rang Mahal at the end of the path: a small domed shrine-room on a plinth, its arched door to the path
  const rm = new THREE.Group(); rm.position.set(0, 0, -38); g.add(rm);
  block3(rm, 5.4, .6, 5.4, MAT.plaster, [0, 0, 0]);
  for (const sx of [-1, 1]) block3(rm, 1.7, 3.2, 4.4, MAT.plasterPink, [sx * 1.35, .6, 0]);
  block3(rm, 1, 1.1, 4.4, MAT.plasterPink, [0, 2.7, 0]); block3(rm, 1, 3.2, .3, MAT.plasterPink, [0, .6, -2.05]);
  mesh3(rm, new THREE.CylinderGeometry(.5, .5, .3, 32, 1, false, 0, Math.PI), MAT.plasterPink, [0, 2.7, 2.06], { rot: [Math.PI / 2, 0, Math.PI / 2] });
  block3(rm, 4.8, .25, 4.8, MAT.plaster, [0, 3.8, 0]);
  mesh3(rm, new THREE.SphereGeometry(1.6, 40, 20, 0, TAU, 0, Math.PI / 2), MAT.plasterPink, [0, 4.05, 0]);
  mesh3(rm, lathe3(smooth3([[0, 0], [.2, 0], [.26, .12], [.12, .28], [.16, .4], [.05, .55], [0, .62]]), 24), MAT.brass, [0, 5.62, 0]);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) mesh3(rm, new THREE.SphereGeometry(.35, 20, 12, 0, TAU, 0, Math.PI / 2), MAT.plasterPink, [sx * 2.1, 4.05, sz * 2.1]);
  const rmDoor = mesh3(rm, new THREE.PlaneGeometry(.98, 2.1), new THREE.MeshBasicMaterial({ color: '#000000' }), [0, .62 + 1.05, 2.21], { cast: false });
  const rmGlow = glow3(rm, [0, 1.2, 2.4], 2.4, '#FFB060', 0);
  // the far wall and more trees behind the shrine, so no horizon shows down the path
  block3(g, 40, 3.4, .45, MAT.wallBrick, [0, 0, -46]);
  for (let i = 0; i < 16; i++) { const rr = rnd3(500 + i); pair3(g, [(rr() - .5) * 22, 0, -41 - rr() * 4], { seed: 500 + i, yaw: rr() * TAU, h: 3.4 + rr() * 1.2, leaves: 1800, squash: .85 }); }
  S.fog = new THREE.FogExp2('#0A1020', .045);
  // the moon: a disc and its halo in the sky; the light
  const moon = new THREE.Group(); S.add(moon);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(1, 48), new THREE.MeshBasicMaterial({ map: moonTex(), color: '#FFF6E8', fog: false, transparent: true }));
  moon.add(disc); const mh = glow3(moon, [0, 0, -.1], 9, '#9DB4FF', .35);
  const sun = new THREE.DirectionalLight('#FFF', 2); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 120 }); sun.shadow.bias = -.0004; sun.shadow.normalBias = .03; sun.shadow.radius = 3;
  S.add(sun, sun.target); sun.target.position.set(0, 0, -14);
  const hemi = new THREE.HemisphereLight('#8090C0', '#302820', .3); S.add(hemi);
  const fill = new THREE.PointLight('#FFB070', 0, 6, 1.6); S.add(fill);
  const G = { scene: S, g, trees, lock, gate, sun, hemi, moon, path, fill, rmGlow };
  // set(mood, o): light the grove for a mood. o.moonAt [az deg, el deg] where the moon / sun stands (az from -z, clockwise)
  G.set = (mood, o = {}) => {
    const az = (o.az ?? 200) * RAD, el = (o.el ?? 32) * RAD, dir = V3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
    sun.position.copy(sun.target.position).addScaledVector(dir, 60);
    moon.position.copy(dir).multiplyScalar(300); moon.lookAt(0, 0, 0); moon.scale.setScalar(o.moonSize ?? 7);
    if (mood === 'night') {
      env3(S, 'night2', { k: o.env ?? 3, bg: true, bgK: o.bgK ?? .5, rot: o.rot ?? 0 });
      sun.color.set('#B4C6F4'); sun.intensity = o.sun ?? 2.4; hemi.color.set('#7088D0'); hemi.groundColor.set('#2A2420'); hemi.intensity = o.hemi ?? 1.1;
      S.fog.color.set('#1E2C50'); S.fog.density = o.fog ?? .035; moon.visible = o.moon !== false; G.rmGlow.material.opacity = 0;
    } else if (mood === 'dusk') {
      env3(S, 'fire', { k: o.env ?? .8, bg: true, bgK: o.bgK ?? 1, rot: o.rot ?? 0 });
      sun.color.set('#FFB070'); sun.intensity = o.sun ?? 3; hemi.color.set('#C08A78'); hemi.groundColor.set('#3A2418'); hemi.intensity = o.hemi ?? .4;
      S.fog.color.set('#6A4A50'); S.fog.density = o.fog ?? .03; moon.visible = false; G.rmGlow.material.opacity = 0;
    } else if (mood === 'dawn') {
      env3(S, 'dawn', { k: o.env ?? .9, bg: true, bgK: o.bgK ?? .9, rot: o.rot ?? 0 });
      sun.color.set('#FFD8A8'); sun.intensity = o.sun ?? 2.6; hemi.color.set('#A8B8D8'); hemi.groundColor.set('#4A3A2A'); hemi.intensity = o.hemi ?? .5;
      S.fog.color.set('#B8A898'); S.fog.density = o.fog ?? .025; moon.visible = false; G.rmGlow.material.opacity = 0;
    }
  };
  return G;
}
function moonTex() {
  return tex3('moonDisc', 512, 512, (g, w, h) => {
    const r = rnd3(9), gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gr.addColorStop(0, '#FFFDF6'); gr.addColorStop(.85, '#F4EEE0'); gr.addColorStop(.97, '#E8E0D0'); gr.addColorStop(1, 'rgba(232,224,208,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(w / 2, h / 2, w / 2, 0, TAU); g.fill();
    g.globalCompositeOperation = 'source-atop';
    for (let i = 0; i < 26; i++) { const x = w * (.2 + r() * .6), y = h * (.2 + r() * .6), s = 14 + r() * 70; g.fillStyle = `rgba(150,150,160,${.08 + r() * .12})`; g.beginPath(); g.ellipse(x, y, s, s * (.7 + r() * .3), r() * 3, 0, TAU); g.fill(); }
  });
}

// ---------- the lock ----------
// lock3(parent, pos): an old Aligarh brass padlock (a raised face plate, a keyhole, a heavy steel shackle) hanging on a
// chain looped round the gate's two meeting bars. .set(open 0..1) lifts the shackle out of the body.
function lock3(parent, pos) {
  const g = new THREE.Group(); g.position.set(...pos); parent.add(g);
  const steel = new THREE.MeshStandardMaterial({ color: '#6E6A66', metalness: .7, roughness: .42, envMapIntensity: .8 });
  const body = new THREE.Group(); body.position.y = -.075; g.add(body);
  mesh3(body, new THREE.RoundedBoxGeometry(.12, .1, .042, 5, .014), MAT.brassOld, [0, 0, 0]);
  mesh3(body, new THREE.RoundedBoxGeometry(.088, .07, .008, 3, .004), MAT.brass, [0, -.004, .022]);
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) mesh3(body, new THREE.SphereGeometry(.0045, 10, 8), MAT.brass, [sx * .036, -.004 + sy * .027, .027]);
  const keyM = new THREE.MeshBasicMaterial({ color: '#070504' });
  mesh3(body, new THREE.CircleGeometry(.0065, 20), keyM, [0, .0, .0265], { cast: false });
  mesh3(body, new THREE.PlaneGeometry(.0045, .016), keyM, [0, -.01, .0265], { cast: false });
  const sh = new THREE.Group(); g.add(sh);
  mesh3(sh, new THREE.TorusGeometry(.036, .0085, 14, 40, Math.PI), steel, [0, .0, 0]);
  for (const sx of [-1, 1]) mesh3(sh, new THREE.CylinderGeometry(.0085, .0085, .045, 14), steel, [sx * .036, -.022, 0]);
  // the chain: oval links along a loop round both bars, each turned to the loop, every other one a quarter turn
  const chain = new THREE.Group(); g.add(chain); const LG = new THREE.TorusGeometry(.016, .0042, 8, 24);
  const loop = (a) => V3(Math.sin(a) * .135, .045 + .02 * Math.cos(a) + .012 * Math.sin(2 * a), Math.cos(a) * .03 - .012);
  const N = 30, X = V3(1, 0, 0);
  for (let i = 0; i < N; i++) {
    const a = i / N * TAU, p = loop(a), tn = loop(a + .01).sub(loop(a - .01)).normalize();
    const m = mesh3(chain, LG, steel, p.toArray(), { scale: [1.35, .8, 1] });
    m.quaternion.setFromUnitVectors(X, tn); if (i % 2) m.rotateX(Math.PI / 2);
  }
  g.set = (open = 0) => { sh.position.y = .03 * open; };
  return g;
}

// ---------- Radha-Krishna (radha_krishna_01.glb: one textured model, ~2 M triangles) ----------
// rk3(parent, pos, o): the model o.h metres tall (1.75), turned o.yaw; matte (the file has no roughness map).
const RKMAT = (m) => { const x = m.material; x.metalness = 0; x.roughness = .62; x.envMapIntensity = .8; };
let RK_SRC = null;
const rkGLB = glb3('assets/glb/radha_krishna_01.glb', { height: 1.75, mat: RKMAT, onload: (g) => { RK_SRC = g; } });
function rk3(parent, pos, o = {}) {
  const g = new THREE.Group(); g.position.set(...pos); g.rotation.y = o.yaw || 0; parent.add(g);
  rkGLB.ready.then(() => { const c = RK_SRC.inner.clone(true); c.scale.multiplyScalar((o.h ?? 1.75) / 1.75); c.traverse(n => { if (n.isMesh) { n.castShadow = o.cast ?? true; n.receiveShadow = true; } }); g.add(c); });
  return g;
}

// ---------- the bank: the Yamuna under the full moon, the Raas circle ----------
function bank3() {
  const S = new THREE.Scene(), g = new THREE.Group(); S.add(g);
  const sand = mesh3(g, new THREE.CircleGeometry(60, 96), pbr3('sand', { rep: [24, 24], tint: '#D8C8B0' }), [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // the river: a dark mirror to the north, the moon's road on it
  const water = mesh3(g, new THREE.PlaneGeometry(400, 200), new THREE.MeshStandardMaterial({ color: '#0A1424', metalness: .9, roughness: .12, envMapIntensity: 1 }), [0, -.05, -120], { rot: [-Math.PI / 2, 0, 0], cast: false });
  { const p = sand.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), d = Math.hypot(x, y); p.setZ(i, .04 * Math.sin(x * 1.3) * Math.cos(y * 1.1) - (y > 14 ? (y - 14) * .08 : 0)); } sand.geometry.computeVertexNormals(); }
  // the ring: n pairs on a circle of radius R (a Krishna beside every gopi), each turned to dance along it
  const ring = new THREE.Group(); g.add(ring); const N = 12, R = 3.8, pairs = [];
  for (let i = 0; i < N; i++) { const a = i / N * TAU, p = new THREE.Group(); p.position.set(Math.cos(a) * R, 0, Math.sin(a) * R); p.rotation.y = -a + Math.PI; ring.add(p); p.add(rk3(p, [0, 0, 0], { yaw: 0 })); pairs.push(p); }
  const flashes = pairs.map(p => glow3(p, [0, 1, 0], 3.2, '#FFD890', 0));
  // the light at the centre, and petals on the sand
  const core = new THREE.PointLight('#FFC070', 6, 14, 1.4); core.position.set(0, 1.4, 0); g.add(core);
  const glow = glow3(g, [0, 1.2, 0], 5, '#FFB060', .35);
  const petals = new THREE.InstancedMesh(new THREE.CircleGeometry(.025, 6), new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: .8, side: THREE.DoubleSide }), 900);
  { const r = rnd3(21), M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler();
    for (let i = 0; i < 900; i++) { const a = r() * TAU, d = Math.sqrt(r()) * 7; E.set(-Math.PI / 2 + (r() - .5) * .5, 0, r() * TAU); Q.setFromEuler(E); M.compose(V3(Math.cos(a) * d, .02, Math.sin(a) * d), Q, V3(1, .7 + r() * .6, 1)); petals.setMatrixAt(i, M); petals.setColorAt(i, new THREE.Color(r() < .6 ? '#F08A1C' : r() < .5 ? '#C81E3A' : '#F4D060')); } }
  petals.receiveShadow = true; g.add(petals);
  // far trees: tulsi pairs along the bank
  const r = rnd3(8); for (let i = 0; i < 44; i++) { const a = -Math.PI / 2 + .7 + r() * (TAU - 1.4), d = 13 + r() * 16; pair3(g, [Math.cos(a) * d, 0, Math.sin(a) * d], { seed: 300 + i, yaw: r() * TAU, h: 3 + r() * 1.5, leaves: 1600 }); }
  const motes = motes3(g, { n: 500, box: [-9, .2, -9, 9, 4, 9], size: .006, col: '#FFD890', drift: [.05, .12, .05] });
  const moon = new THREE.Group(); S.add(moon);
  moon.add(new THREE.Mesh(new THREE.CircleGeometry(1, 48), new THREE.MeshBasicMaterial({ map: moonTex(), color: '#FFF6E8', fog: false, transparent: true }))); glow3(moon, [0, 0, -.1], 10, '#9DB4FF', .3);
  const key = new THREE.DirectionalLight('#B4C6F4', 2.2); key.castShadow = true; key.shadow.mapSize.set(4096, 4096);
  Object.assign(key.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 120 }); key.shadow.bias = -.0003; key.shadow.normalBias = .02; S.add(key, key.target);
  const hemi = new THREE.HemisphereLight('#7088D0', '#2A2420', .8); S.add(hemi);
  S.fog = new THREE.FogExp2('#18264A', .02);
  const B = { scene: S, ring, pairs, core, glow, moon, key, motes, hemi };
  // set(t, o): o.spin (ring turns, rad/s), o.az/o.el of the moon, o.core (the centre light 0..1), o.env, o.n (pairs shown)
  B.set = (t, o = {}) => {
    env3(S, 'night2', { k: o.env ?? 2.4, bg: true, bgK: o.bgK ?? 1.1, rot: o.rot ?? 0 });
    const az = (o.az ?? 0) * RAD, el = (o.el ?? 24) * RAD, dir = V3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
    key.position.copy(dir).multiplyScalar(40); key.intensity = o.key ?? 2.2; moon.position.copy(dir).multiplyScalar(300); moon.lookAt(0, 0, 0); moon.scale.setScalar(o.moonSize ?? 8);
    ring.rotation.y = -(o.spin ?? .25) * t;
    const nn = o.n ?? N; flashes.forEach((f, i) => { const k = nn - i; f.material.opacity = k > 0 && k < 1 ? Math.sin(k * Math.PI) * .9 : 0; });
    pairs.forEach((p, i) => { p.visible = i < nn; p.position.y = .03 * Math.max(0, Math.sin(t * 5 + i * 1.7)); p.children[0].rotation.y = .35 * Math.sin(t * 1.3 + i * .9); });
    core.intensity = 6 * (o.core ?? 1); glow.material.opacity = .35 * (o.core ?? 1); motes.set(t, 1);
  };
  return B;
}

// ---------- the Rang Mahal ----------
// A painted chamber, 4 × 4 m, its door to +z. The bed (carved legs, a red silk sheet over the mattress, gold bolsters,
// petals) against the back wall; a chowki to its right with the night's offerings. .set(o): o.morning (the bed slept
// in, the lota tipped and empty, the paan eaten), o.lamp (the diya, 0..1), o.door (0 shut .. 1 open).
function room3() {
  const S = new THREE.Scene(), g = new THREE.Group(); S.add(g);
  const W = 4, D = 4, Hh = 3.4;
  mesh3(g, new THREE.PlaneGeometry(W, D), MAT.marble, [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const frieze = tex3('rmFrieze', 1024, 256, (c, w, h) => {
    c.fillStyle = '#E9B8A4'; c.fillRect(0, 0, w, h); const r = rnd3(3);
    c.fillStyle = '#7A1E2A'; c.fillRect(0, 40, w, 14); c.fillRect(0, h - 54, w, 14);
    for (let x = 0; x < w; x += 128) { c.save(); c.translate(x + 64, h / 2); c.fillStyle = '#2E6A4A';
      for (let k = 0; k < 8; k++) { c.rotate(TAU / 8); c.beginPath(); c.ellipse(0, -30, 10, 26, 0, 0, TAU); c.fill(); }
      c.fillStyle = '#E0A030'; c.beginPath(); c.arc(0, 0, 14, 0, TAU); c.fill(); c.fillStyle = '#B0302E'; c.beginPath(); c.arc(0, 0, 7, 0, TAU); c.fill(); c.restore(); }
  });
  const wallM = MAT.plasterPink, fr = new THREE.MeshStandardMaterial({ map: frieze, roughness: .9 }); frieze.repeat.set(2, 1);
  block3(g, W, Hh, .2, wallM, [0, 0, -D / 2 - .1]);                       // back
  for (const sx of [-1, 1]) block3(g, .2, Hh, D, wallM, [sx * (W / 2 + .1), 0, 0]);
  for (const sx of [-1, 1]) block3(g, 1.3, Hh, .2, wallM, [sx * 1.35, 0, D / 2 + .1]);   // front, a 1.4 m door between
  block3(g, 1.4, 1.0, .2, wallM, [0, 2.4, D / 2 + .1]);
  mesh3(g, new THREE.PlaneGeometry(W, .5), fr, [0, 2.75, -D / 2 + .005], { cast: false });
  for (const sx of [-1, 1]) mesh3(g, new THREE.PlaneGeometry(D, .5), fr, [sx * (W / 2 - .005), 2.75, 0], { rot: [0, -sx * Math.PI / 2, 0], cast: false });
  box3(g, W + .4, .2, D + .4, wallM, [0, Hh + .1, 0]);
  // the door leaves (hinged at the jambs)
  const doors = [-1, 1].map(sx => { const p = new THREE.Group(); p.position.set(sx * .7, 0, D / 2 + .02); g.add(p); block3(p, .7, 2.4, .06, MAT.wood, [-sx * .35, 0, 0]); for (const y of [.5, 1.2, 1.9]) box3(p, .5, .04, .02, MAT.brassOld, [-sx * .35, y, .04]); return p; });
  // the bed
  const bed = new THREE.Group(); bed.position.set(-.35, 0, -.95); g.add(bed);
  const BW = 1.5, BL = 1.95, BH = .55;
  const leg = lathe3(smooth3([[.0, 0], [.05, 0], [.06, .05], [.04, .12], [.065, .2], [.045, .3], [.055, .38], [.04, .45], [.0, .46]]), 24);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) mesh3(bed, leg, MAT.dark, [sx * (BW / 2 - .06), 0, sz * (BL / 2 - .06)]);
  box3(bed, BW, .1, BL, MAT.dark, [0, .43, 0]);
  block3(bed, BW + .1, .9, .08, MAT.dark, [0, .45, -BL / 2 - .02]);   // the headboard
  for (const sx of [-1, 1]) mesh3(bed, new THREE.SphereGeometry(.06, 16, 12), MAT.brass, [sx * (BW / 2), 1.38, -BL / 2]);
  mesh3(bed, new THREE.RoundedBoxGeometry(BW - .08, .12, BL - .08, 3, .05), new THREE.MeshStandardMaterial({ color: '#F4ECDC', roughness: .9 }), [0, .52, 0]);
  // the sheet: a draped cloth, flat on top, hanging in folds over the sides; morning adds creases and a body's hollow
  const sheetGeo = new THREE.PlaneGeometry(BW + .5, BL + .3, 120, 150); sheetGeo.rotateX(-Math.PI / 2); const sheetBase = sheetGeo.attributes.position.array.slice();
  const sheet = mesh3(bed, sheetGeo, MAT.silk, [0, 0, .1]);
  const drape = (morning) => {
    const p = sheetGeo.attributes.position, b = sheetBase, top = .66, hx = (BW - .06) / 2, hz = (BL - .06) / 2;
    for (let i = 0; i < p.count; i++) {
      const x = b[i * 3], z = b[i * 3 + 2], ox = Math.max(0, Math.abs(x) - hx), oz = Math.max(0, Math.abs(z + .1) - hz), o = Math.hypot(ox, oz);
      let y = top + .008 * Math.sin(x * 9) * Math.sin(z * 7), nx = x, nz = z;
      if (o > 0) { y = top - o * 1.05; nx = Math.sign(x) * Math.min(Math.abs(x), hx + .03 + o * .05); nz = z + .0 * oz; y += .02 * Math.sin((z + x) * 24); }
      if (morning) { const n = Math.sin(x * 13 + z * 5) * Math.cos(z * 11 - x * 3) + .6 * Math.sin(x * 29 + z * 17);
        y += o > 0 ? 0 : .02 * n; const hol = Math.exp(-((x + .25) ** 2 / .06 + (z - .15) ** 2 / .5)) + Math.exp(-((x - .3) ** 2 / .06 + (z - .1) ** 2 / .5)); y -= o > 0 ? 0 : .035 * hol; }
      p.setXYZ(i, nx, y, nz);
    }
    p.needsUpdate = true; sheetGeo.computeVertexNormals();
  };
  // bolsters and a pillow
  const bol = [-1, 1].map(sx => mesh3(bed, new THREE.CapsuleGeometry(.11, .45, 8, 20), MAT.silkGold, [sx * .38, .78, -BL / 2 + .25], { rot: [0, 0, Math.PI / 2] }));
  const pillow = mesh3(bed, new THREE.RoundedBoxGeometry(.6, .12, .38, 4, .06), MAT.silkGold, [0, .76, -BL / 2 + .55]);
  // petals on the sheet
  const PET = new THREE.InstancedMesh(new THREE.CircleGeometry(.016, 14), new THREE.MeshStandardMaterial({ roughness: .7, side: THREE.DoubleSide }), 260); bed.add(PET);
  const petals = (morning) => { const r = rnd3(morning ? 77 : 7), M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler();
    for (let i = 0; i < 260; i++) { let x, z; if (!morning) { const a = r() * TAU, d = .25 + r() * .35; x = Math.cos(a) * d * .9; z = .25 + Math.sin(a) * d * 1.2; } else { x = (r() - .5) * 1.5; z = (r() - .5) * 1.8; }
      const y = Math.abs(x) < .72 && Math.abs(z) < .95 ? .675 : .02; E.set(-Math.PI / 2 + (r() - .5) * .6, 0, r() * TAU); Q.setFromEuler(E); M.compose(V3(x, y, z), Q, V3(1, .7 + r() * .6, 1)); PET.setMatrixAt(i, M); PET.setColorAt(i, new THREE.Color(r() < .55 ? '#8E0E22' : r() < .6 ? '#D8701A' : '#E8D8C4').multiplyScalar(.85 + r() * .3)); }
    PET.instanceMatrix.needsUpdate = true; PET.instanceColor.needsUpdate = true; };
  // the chowki and the offerings
  const ch = new THREE.Group(); ch.position.set(1.15, 0, -1.15); g.add(ch);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) block3(ch, .05, .3, .05, MAT.dark, [sx * .3, 0, sz * .22]);
  block3(ch, .7, .05, .52, MAT.dark, [0, .3, 0]);
  const T0 = .35;
  const lota = new THREE.Group(); lota.position.set(-.2, T0, -.12); ch.add(lota);
  mesh3(lota, lathe3(smooth3([[0, 0], [.05, 0], [.075, .04], [.085, .09], [.07, .14], [.04, .17], [.038, .19], [.055, .21], [.0, .21]]), 48), MAT.brass, [0, 0, 0]);
  const waterTop = mesh3(lota, new THREE.CircleGeometry(.04, 24), new THREE.MeshStandardMaterial({ color: '#203040', metalness: .6, roughness: .05 }), [0, .2, 0], { rot: [-Math.PI / 2, 0, 0] });
  const box = new THREE.Group(); box.position.set(.12, T0, -.1); ch.add(box);    // the silver paan box with three biras
  const silverD = new THREE.MeshStandardMaterial({ color: '#8C8880', metalness: .65, roughness: .38, envMapIntensity: .7, roughnessMap: grimeTex(), map: grimeTex(1) });
  mesh3(box, new THREE.CylinderGeometry(.1, .095, .05, 40), silverD, [0, .025, 0]);
  mesh3(box, new THREE.TorusGeometry(.098, .006, 8, 48), silverD, [0, .05, 0], { rot: [Math.PI / 2, 0, 0] });
  { const hl = new THREE.Shape(); hl.moveTo(0, -.06); hl.bezierCurveTo(.07, -.03, .07, .05, 0, .06); hl.bezierCurveTo(-.07, .05, -.07, -.03, 0, -.06);
    const lf = mesh3(box, new THREE.ShapeGeometry(hl, 16), null, [0, .051, 0], { rot: [-Math.PI / 2, 0, .4], cast: false }); lf.userData.leaf = true; box.userData.leafMesh = lf; }
  const paanTex = tex3('paanLeaf', 256, 256, (c, w, h) => { c.fillStyle = '#3F6E22'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(170,200,110,.55)'; c.lineWidth = 3;
    for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(w / 2, h); c.quadraticCurveTo(w / 2 + (i - 3) * 30, h / 2, w / 2 + (i - 3) * 50, 0); c.stroke(); } });
  const biraG = new THREE.SphereGeometry(.02, 24, 16); biraG.scale(1.5, .55, .8);
  { const p = biraG.attributes.position; for (let i = 0; i < p.count; i++) { const k = clamp((p.getX(i) / .03 + 1) / 2), f = 1 - .78 * k * k; p.setY(i, p.getY(i) * f); p.setZ(i, p.getZ(i) * f + .004 * Math.sin(p.getX(i) * 300) * (p.getY(i) > 0 ? 1 : 0)); } biraG.computeVertexNormals(); }
  const leafM = new THREE.MeshStandardMaterial({ map: paanTex, roughness: .35, color: '#9ACB78' });
  const clove = new THREE.MeshStandardMaterial({ color: '#3A2214', roughness: .8 });
  box.userData.leafMesh.material = new THREE.MeshStandardMaterial({ map: paanTex, roughness: .4, color: '#B8D890', side: THREE.DoubleSide });
  const biras = [0, 1, 2].map(i => { const b = new THREE.Group(); b.position.set(-.035 + i * .035, .062, (i - 1) * .025); b.rotation.y = .5 + i * .5; box.add(b);
    mesh3(b, biraG, leafM, [0, 0, 0]); mesh3(b, new THREE.CylinderGeometry(.0012, .0012, .016, 6), clove, [-.004, .008, 0]); mesh3(b, new THREE.SphereGeometry(.0026, 8, 6), clove, [-.004, .016, 0]); return b; });
  const plate = new THREE.Group(); plate.position.set(.05, T0, .14); ch.add(plate);    // laddoos on a plate
  mesh3(plate, new THREE.CylinderGeometry(.13, .11, .015, 40), MAT.brass, [0, .008, 0]);
  const boondi = tex3('boondi', 256, 256, (c, w, h) => { const r = rnd3(31); c.fillStyle = '#C87818'; c.fillRect(0, 0, w, h); for (let i = 0; i < 1400; i++) { const x = r() * w, y = r() * h, s = 3 + r() * 5, gr = c.createRadialGradient(x - s * .3, y - s * .3, 0, x, y, s); gr.addColorStop(0, '#FFD070'); gr.addColorStop(.6, '#E8981C'); gr.addColorStop(1, 'rgba(150,70,10,.9)'); c.fillStyle = gr; c.beginPath(); c.arc(x, y, s, 0, TAU); c.fill(); } });
  const lad = new THREE.MeshStandardMaterial({ map: boondi, bumpMap: boondi, bumpScale: 4, roughness: .6 });
  const ladoos = [[0, 0], [.055, .02], [-.05, .03], [.01, .06], [.02, -.055], [-.04, -.04]].map(([x, z]) => mesh3(plate, new THREE.SphereGeometry(.032, 20, 16), lad, [x, .045, z]));
  const datun = new THREE.Group(); datun.position.set(-.26, T0, .14); ch.add(datun);
  const bark = tex3('neemBark', 64, 256, (c, w, h) => { const r = rnd3(41); c.fillStyle = '#6A5A3A'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) { c.fillStyle = r() < .5 ? `rgba(40,34,20,${.3 + r() * .4})` : `rgba(140,128,90,${.2 + r() * .3})`; c.fillRect(r() * w, r() * h, 1 + r() * 3, 4 + r() * 18); }
    for (let i = 0; i < 6; i++) { c.fillStyle = 'rgba(30,26,16,.7)'; c.fillRect(0, r() * h, w, 2); } c.fillStyle = '#E8DCC0'; c.fillRect(0, 0, w, 10); });
  const twig = new THREE.MeshStandardMaterial({ map: bark, bumpMap: bark, bumpScale: 2, roughness: .9 });
  const sticks = [0, 1, 2].map(i => mesh3(datun, new THREE.CylinderGeometry(.0045, .005, .16, 10), twig, [i * .014, .006, 0], { rot: [Math.PI / 2, 0, .1 * i - .1] }));
  const bang = new THREE.Group(); bang.position.set(.26, T0, .12); ch.add(bang);
  const glass = [new THREE.MeshPhysicalMaterial({ color: '#C0102A', roughness: .15, metalness: .1, clearcoat: 1 }), new THREE.MeshPhysicalMaterial({ color: '#1A7A3A', roughness: .15, metalness: .1, clearcoat: 1 })];
  for (let i = 0; i < 6; i++) mesh3(bang, new THREE.TorusGeometry(.04, .004, 8, 40), glass[i % 2], [0, .005 + i * .007, 0], { rot: [Math.PI / 2, 0, 0] });
  const sind = new THREE.Group(); sind.position.set(.25, T0, -.04); ch.add(sind);
  mesh3(sind, new THREE.CylinderGeometry(.03, .03, .025, 24), MAT.silver, [0, .012, 0]);
  mesh3(sind, new THREE.CylinderGeometry(.026, .026, .004, 24), new THREE.MeshStandardMaterial({ color: '#D8141E', roughness: .9 }), [0, .026, 0]);
  // a small diya among the offerings (it lights them)
  mesh3(ch, lathe3(smooth3([[0, 0], [.03, 0], [.05, .015], [.055, .03], [.0, .015]]), 24), new THREE.MeshStandardMaterial({ color: '#9A4A28', roughness: .9 }), [-.06, T0, -.2]);
  const diya2 = flame3(ch, [-.06, T0 + .028, -.2], .7, { light: false });
  const lamp2 = new THREE.PointLight('#FFB060', 1.4, 2.2, 2); lamp2.position.set(-.06, T0 + .1, -.2); ch.add(lamp2);
  // the diya in a niche by the bed, and the room's warm light
  const diya = flame3(g, [-1.5, .9, -1.6], 1.4, { power: 1.2, range: 7 });
  mesh3(g, lathe3(smooth3([[0, 0], [.04, 0], [.07, .02], [.08, .04], [.0, .02]]), 24), new THREE.MeshStandardMaterial({ color: '#9A4A28', roughness: .9 }), [-1.5, .86, -1.6]);
  block3(g, .4, .05, .25, wallM, [-1.5, .82, -1.85]);
  const lamp = new THREE.PointLight('#FFB060', 3, 8, 1.5); lamp.position.set(-1.4, 1.2, -1.2); lamp.castShadow = true; lamp.shadow.mapSize.set(2048, 2048); lamp.shadow.bias = -.002; g.add(lamp);
  const out = new THREE.DirectionalLight('#9AB0E8', 0); out.position.set(0, 3, 12); out.target.position.set(0, 0, -1); out.castShadow = true; S.add(out, out.target);
  const hemi = new THREE.HemisphereLight('#E0B090', '#402018', .25); S.add(hemi);
  const fill = new THREE.PointLight('#FFB872', 0, 2.5, 2); S.add(fill);
  S.background = new THREE.Color('#05060A');
  const RM = { scene: S, fill, bed, ch, lota, biras, ladoos, sticks, doors, diya, diya2, lamp, lamp2, out, hemi, sheet, pillow };
  let last = null;
  RM.set = (t, o = {}) => {
    const m = !!o.morning; if (m !== last) { drape(m); petals(m); last = m; }
    lota.rotation.set(0, 0, 0); lota.position.set(-.2, T0, -.12); waterTop.visible = !m;
    biras[2].visible = !m; biras[1].scale.set(m ? .45 : 1, 1, 1); ladoos[3].visible = ladoos[4].visible = !m;
    sticks[1].position.set(m ? .1 : .02, .01, m ? .06 : 0); sticks[1].rotation.set(Math.PI / 2, 0, m ? .7 : .08);
    pillow.scale.set(1, m ? .7 : 1, 1); pillow.rotation.y = m ? .12 : 0;
    const L = o.lamp ?? 1; diya.set(t, L); diya.visible = L > .01; diya2.set(t, L); diya2.visible = L > .01; lamp2.intensity = 1.4 * L * (1 + .08 * Math.sin(t * 11 + 1)); lamp.intensity = 3 * L * (1 + .06 * Math.sin(t * 13) + .04 * Math.sin(t * 29));
    doors[0].rotation.y = -(o.door ?? 0) * 1.6; doors[1].rotation.y = (o.door ?? 0) * 1.6;
    out.intensity = o.out ?? 0; out.color.set(o.outCol || '#FFD8A8'); hemi.intensity = o.hemi ?? .25;
    S.environment = null; if (o.env) env3(S, o.env, { k: o.envK ?? .3 });
  };
  return RM;
}

// ---------- a neighbour's wall across the lane: an old window bricked up ----------
function house3() {
  const S = new THREE.Scene(), g = new THREE.Group(); S.add(g);
  block3(g, 8, 6, .4, MAT.plaster, [0, 0, 0]);
  const hole = new THREE.Group(); hole.position.set(0, 2.2, .21); g.add(hole);
  mesh3(hole, new THREE.PlaneGeometry(1.1, 1.4), pbr3('brick', { rep: [1.2, 1.6], tint: '#B87A60', normalK: 1.6 }), [0, 0, .002], { cast: false });
  for (const [w, h, x, y] of [[1.3, .1, 0, .75], [1.3, .12, 0, -.76], [.1, 1.6, -.6, 0], [.1, 1.6, .6, 0]]) box3(hole, w, h, .12, MAT.dark, [x, y, .04]);
  mesh3(g, new THREE.PlaneGeometry(40, 20), MAT.dirt, [0, 0, 6], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const key = new THREE.DirectionalLight('#B4C6F4', 2); key.position.set(-6, 9, 10); key.castShadow = true; S.add(key);
  const hemi = new THREE.HemisphereLight('#7088D0', '#2A2420', .6); S.add(hemi);
  S.fog = new THREE.FogExp2('#18264A', .02);
  const HS = { scene: S, key, hemi };
  HS.set = (o = {}) => { env3(S, 'night2', { k: o.env ?? 2, bg: true, bgK: 1 }); };
  return HS;
}

// ---------- the twisted tree (magical_pink_tree.glb: an S-curved trunk; its blossom cards get tulsi leaves) ----------
let TW_SRC = null;
const twGLB = glb3('assets/glb/magical_pink_tree.glb', { height: 1, mat: (m) => {
  if (/sprite/i.test(m.material.name)) { const a = m.material; m.material = new THREE.MeshStandardMaterial({ map: a.map, alphaMap: null, alphaTest: .5, side: THREE.DoubleSide, roughness: .8, color: '#5E8A44' }); m.material.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n  { float l = dot(diffuseColor.rgb, vec3(.3,.59,.11)); diffuseColor.rgb = mix(vec3(.11,.2,.07), vec3(.36,.5,.2), l) * 1.4; }'); }; }
  else { m.material.metalness = 0; m.material.roughness = .9; m.material.color = new THREE.Color('#8A7A6A'); }
}, onload: (g) => { TW_SRC = g; } });
function twist3(parent, pos, o = {}) {
  const g = new THREE.Group(); g.position.set(...pos); g.rotation.set(o.lean?.[0] || 0, o.yaw || 0, o.lean?.[1] || 0); parent.add(g);
  twGLB.ready.then(() => { const c = TW_SRC.inner.clone(true); c.scale.multiplyScalar(o.h ?? 3.4); c.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } }); g.add(c); });
  return g;
}

// ---------- one pair of trees, close: a small clearing of the grove at night ----------
function pairStage3() {
  const S = new THREE.Scene(), g = new THREE.Group(); S.add(g);
  const fl = mesh3(g, new THREE.PlaneGeometry(40, 40, 60, 60), pbr3('leafground', { rep: [10, 10], tint: '#6A5C4C', normalK: 1.2 }), [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const hero = [twist3(g, [-.45, 0, 0], { h: 3.6, yaw: .3, lean: [0, -.1] }), twist3(g, [.45, 0, .1], { h: 3.3, yaw: 2.6, lean: [0, .12] })];
  const r = rnd3(12); for (let i = 0; i < 18; i++) { const a = r() * TAU, d = 4.5 + r() * 9; pair3(g, [Math.cos(a) * d, 0, Math.sin(a) * d], { seed: 200 + i, yaw: r() * TAU, h: 2.6 + r() * 1.2, leaves: 1800, squash: .85 }); }
  const key = new THREE.DirectionalLight('#B4C6F4', 1.1); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 80 }); key.shadow.bias = -.0004; key.shadow.normalBias = .03; S.add(key);
  const rim = new THREE.DirectionalLight('#8FA8FF', 1.6); S.add(rim);
  const hemi = new THREE.HemisphereLight('#7088D0', '#2A2420', .45); S.add(hemi);
  const front = new THREE.DirectionalLight('#7A90D0', .7); front.position.set(2, 3, 12); S.add(front);
  S.fog = new THREE.FogExp2('#1E2C50', .06);
  const moon = new THREE.Group(); S.add(moon);
  moon.add(new THREE.Mesh(new THREE.CircleGeometry(1, 48), new THREE.MeshBasicMaterial({ map: moonTex(), color: '#FFF6E8', fog: false, transparent: true }))); glow3(moon, [0, 0, -.1], 9, '#9DB4FF', .35);
  const P = { scene: S, hero, key, rim, moon };
  P.set = (o = {}) => { env3(S, 'night2', { k: 3, bg: true, bgK: .5, rot: o.rot ?? 0 });
    const az = (o.az ?? 0) * RAD, el = (o.el ?? 14) * RAD, dir = V3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
    key.position.copy(dir).multiplyScalar(30); rim.position.copy(dir).multiplyScalar(30); moon.position.copy(dir).multiplyScalar(250); moon.lookAt(0, 0, 0); moon.scale.setScalar(o.moonSize ?? 7); };
  return P;
}
