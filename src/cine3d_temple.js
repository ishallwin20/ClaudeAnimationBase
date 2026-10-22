// cine3d_temple.js: a small stone Shiva shrine for the 3D style (load after cine3d.js). A granite garbhagriha on a
// moulded plinth with a curved Nagara shikhara (amalaka and a brass kalasha on top), its door to the east with steps
// and a bell; inside, a black linga on its pitha under a dripping copper pot (dhara patra), between two standing
// lamps. The pitha's spout and the outer pranala point north: the abhisheka water runs out through the north wall
// (the somasutra) and along a channel cut across the pradakshina path to the courtyard wall. A paved courtyard, a low
// prakara wall with lamps along its top, trees beyond. Metres; y up, north = -z, east = +x; the shrine centred on 0.
//
//   const T3 = shrine3(scene);   T3.F (the sanctum floor's height), T3.path(s) (the pradakshina path), T3.lamps,
//   T3.inner (the two sanctum lamps), T3.bell, T3.pour / T3.basin / T3.lip / T3.drop (the water inside), T3.spout /
//   T3.channel (the water outside), T3.linga (the linga's group), T3.steps (the east steps' top, [x, y, z])
//   T3.set(t, o): flicker every lamp and run the water; o.lamps (0..1, or a function of the lamp's index → 0..1), o.water
//   (0..1: the water running), o.bell (swing angle, radians).
const SHR = { F: .7, half: 2.0, top: 3.4, wall: .45, pathA: 3.9, pathR: 1.3, prakara: 7.5 };

// The pradakshina path: a rounded square round the shrine, a = 3.9 m out, starting at the middle of the east side
// and running clockwise seen from above (east → south → west → north). path3(s) for s in 0..1 (it wraps) gives
// { x, z, dx, dz } (the heading); s .25 is south, .5 west, .75 north (the channel), 1 east again.
const PATH3 = (() => {
  const a = SHR.pathA, r = SHR.pathR, b = a - r, P = [];
  const line = (x0, z0, x1, z1) => { for (let i = 0; i < 40; i++) P.push([lerp(x0, x1, i / 40), lerp(z0, z1, i / 40)]); };
  const arc = (cx, cz, th0) => { for (let i = 0; i < 30; i++) { const th = th0 + Math.PI / 2 * i / 30; P.push([cx + r * Math.cos(th), cz + r * Math.sin(th)]); } };
  line(a, 0, a, b); arc(b, b, 0); line(b, a, -b, a); arc(-b, b, Math.PI / 2); line(-a, b, -a, -b); arc(-b, -b, Math.PI); line(-b, -a, b, -a); arc(b, -b, 1.5 * Math.PI); line(a, -b, a, 0);
  P.push([a, 0]);
  const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  return { P, L, len: L[L.length - 1] };
})();
function path3(s) {
  const { P, L, len } = PATH3, d = ((s % 1) + 1) % 1 * len;
  let i = 1; while (i < L.length - 1 && L[i] < d) i++;
  const k = (d - L[i - 1]) / (L[i] - L[i - 1] || 1), [x0, z0] = P[i - 1], [x1, z1] = P[i], h = Math.hypot(x1 - x0, z1 - z0) || 1;
  return { x: lerp(x0, x1, k), z: lerp(z0, z1, k), dx: (x1 - x0) / h, dz: (z1 - z0) / h };
}

function shrine3(scene, o = {}) {
  const G = new THREE.Group(); scene.add(G);
  const F = SHR.F, A = SHR.half, TOP = SHR.top, WT = SHR.wall, col = o.col || '#8E8376';
  const gran = (rx, ry, seed = 1, x = {}) => stone3({ col, seed, rep: [rx, ry], ...x });
  const dark = gran(1, 1, 7, { col: '#3A332E', speck: .6 });
  const black = new THREE.MeshStandardMaterial({ color: '#1A1819', roughness: .22, metalness: .05, bumpMap: stoneTex({ seed: 11, rows: 1, cols: 1, mottle: .4 }).bump, bumpScale: .4 });

  // ---- the courtyard and the prakara wall ----
  const pav = stone3({ col: '#7A7068', rows: 2, cols: 2, seed: 21, rep: [26, 26], speck: .7, mottle: 1.4, bumpK: 3 });
  mesh3(G, new THREE.PlaneGeometry(42, 42), pav, [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const P = SHR.prakara, pw = gran(10, 1, 23);
  for (const s of [-1, 1]) {
    block3(G, 2 * P + .5, 1.1, .5, pw, [0, 0, s * P]);                                    // north and south
    block3(G, .5, 1.1, 2 * P + .5, pw, [-P, 0, 0]);                                     // west
    block3(G, .5, 1.1, P - 1.4, pw, [P, 0, s * (P + 1.4) / 2]);                         // east, either side of the gate
  }
  for (const s of [-1, 1]) { block3(G, 2 * P + .8, .12, .8, gran(12, .2, 24), [0, 1.1, s * P]); block3(G, .8, .12, 2 * P + .8, gran(12, .2, 24), [-P, 1.1, 0]); block3(G, .8, .12, P - 1.4, gran(5, .2, 24), [P, 1.1, s * (P + 1.4) / 2]); }
  for (const s of [-1, 1]) block3(G, .7, 2.6, .7, gran(1, 2, 25), [P, 0, s * 1.6]);    // the gate posts

  // ---- the plinth (adhishthana): three courses, the middle one recessed ----
  block3(G, 4.9, .22, 4.9, gran(4, .3, 2), [0, 0, 0]);
  block3(G, 4.62, .26, 4.62, gran(4, .3, 3, { col: '#857A6E' }), [0, .22, 0]);
  block3(G, 4.86, .22, 4.86, gran(4, .3, 4), [0, .48, 0]);

  // ---- the walls, the door to the east ----
  const wallM = gran(3.3, 2.3, 5), wh = TOP - F;
  block3(G, 2 * A, wh, WT, wallM, [0, F, -A + WT / 2]);
  block3(G, 2 * A, wh, WT, wallM, [0, F, A - WT / 2]);
  block3(G, WT, wh, 2 * A - 2 * WT, wallM, [-A + WT / 2, F, 0]);
  const dw = 1.1, dh = 2.1, jw = (2 * A - 2 * WT - dw) / 2;
  for (const s of [-1, 1]) block3(G, WT, wh, jw, gran(1, 2.3, 6), [A - WT / 2, F, s * (dw / 2 + jw / 2)]);
  block3(G, WT, wh - dh, dw, gran(1, .5, 6), [A - WT / 2, F + dh, 0]);
  // the door frame: jambs and a lintel standing proud, a threshold
  const trim = gran(.3, 2, 8, { col: '#9A8E80' });
  for (const s of [-1, 1]) block3(G, .16, dh + .2, .18, trim, [A + .06, F, s * (dw / 2 + .09)]);
  block3(G, .18, .22, dw + .56, trim, [A + .07, F + dh, 0]);
  block3(G, .5, .06, dw + .2, trim, [A - .1, F, 0]);
  // corner pilasters, and a niche (devakoshtha) with its frame on the north, south and west faces
  for (const [x, z] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) block3(G, .42, wh, .42, gran(.4, 2.3, 9), [x * (A - .17), F, z * (A - .17)]);
  const niche = (nx, nz) => {
    const rot = Math.atan2(nx, nz), g = new THREE.Group(); g.position.set(nx * A, F, nz * A); g.rotation.y = rot; G.add(g);
    for (const s of [-1, 1]) block3(g, .2, 1.9, .14, trim, [s * .55, .2, .07]);
    block3(g, 1.36, .2, .2, trim, [0, 2.1, .08]); block3(g, 1.0, .14, .16, trim, [0, 2.3, .06]);
    block3(g, .9, 1.9, .04, dark, [0, .2, .02]);
    block3(g, 1.3, .2, .2, trim, [0, 0, .08]);
  };
  niche(0, 1); niche(-1, 0);
  // the north face's niche sits higher, clear of the pranala
  { const g = new THREE.Group(); g.position.set(0, F, -A); g.rotation.y = Math.PI; G.add(g);
    for (const s of [-1, 1]) block3(g, .2, 1.6, .14, trim, [s * .55, .5, .07]); block3(g, 1.36, .2, .2, trim, [0, 2.1, .08]); block3(g, .9, 1.6, .04, dark, [0, .5, .02]); }
  // the cornice (kapota), with a lip
  block3(G, 4.4, .2, 4.4, gran(4, .3, 10), [0, TOP, 0]);
  block3(G, 4.7, .1, 4.7, gran(4, .2, 10), [0, TOP + .2, 0]);

  // ---- the shikhara: fourteen courses curving in toward the top (the Nagara line), a central projection (ratha) on each face ----
  const tiers = 14, th = .32, y0 = TOP + .3, hw = k => .7 + 1.3 * Math.pow(Math.cos(k * Math.PI / 2), .6);
  for (let i = 0; i < tiers; i++) {
    const k = i / tiers, w = 2 * hw(k), y = y0 + i * th, m = gran(w / 1.2, .35, 30 + i);
    block3(G, w, th - .07, w, m, [0, y, 0]);
    block3(G, w - .12, .07, w - .12, dark, [0, y + th - .07, 0]);
    for (const [nx, nz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const pw = w * .4, d = .14;
      block3(G, nx ? d : pw, th - .07, nx ? pw : d, m, [nx * (w / 2 + d / 2), y, nz * (w / 2 + d / 2)]);
    }
  }
  const yt = y0 + tiers * th;
  mesh3(G, new THREE.CylinderGeometry(.5, .6, .22, 24), gran(2, .2, 40), [0, yt + .11, 0]);   // the neck (griva)
  // the amalaka: a ribbed stone disc
  const am = lathe3(smooth3([[.0, 0], [.5, 0], [.82, .1], [.92, .24], [.82, .38], [.5, .46], [0, .46]], 4), 96), pos = am.attributes.position;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i), r = Math.hypot(x, z), a = Math.atan2(z, x), k = 1 - .07 * Math.pow(Math.abs(Math.cos(a * 16)), 6) * clamp(r / .6); pos.setX(i, x * k); pos.setZ(i, z * k); }
  am.computeVertexNormals();
  mesh3(G, am, gran(3, .5, 41), [0, yt + .2, 0]);
  const gold = metal3('#D8A548', .28);
  mesh3(G, lathe3(smooth3([[0, 0], [.32, 0], [.36, .06], [.18, .14], [.28, .3], [.24, .44], [.08, .52], [.12, .6], [.03, .74], [0, .8]], 4), 48), gold, [0, yt + .66, 0]);   // the kalasha

  // ---- the steps, the bell ----
  block3(G, .38, .47, 1.5, gran(1, .3, 12), [A + .45 + .19, 0, 0]);
  block3(G, .38, .235, 1.5, gran(1, .2, 12), [A + .45 + .57, 0, 0]);
  const bell = new THREE.Group(); bell.position.set(A + .25, F + dh + .08, -.3); G.add(bell);
  mesh3(bell, new THREE.CylinderGeometry(.008, .008, .32, 6), metal3('#5A4A3A', .6), [0, -.16, 0]);
  mesh3(bell, lathe3(smooth3([[0, .26], [.05, .26], [.07, .22], [.08, .12], [.12, .03], [.13, 0], [.11, 0], [.07, .1], [.0, .14]], 4), 32), metal3('#C9963E', .25), [0, -.58, 0]);
  mesh3(bell, new THREE.SphereGeometry(.025, 12, 8), metal3('#8A6A3A', .4), [0, -.56, 0]);

  // ---- the sanctum: the pitha and linga, the pot, two standing lamps ----
  const L = new THREE.Group(); L.position.set(0, F, 0); G.add(L);
  mesh3(L, lathe3(smooth3([[0, 0], [.52, 0], [.52, .07], [.44, .1], [.42, .2], [.58, .26], [.6, .34], [.56, .37], [.3, .35], [0, .35]], 3), 64), black, [0, 0, 0]);
  // the spout to the north, with its groove
  block3(L, .26, .08, .62, black, [0, .27, -.78]);
  mesh3(L, new THREE.CylinderGeometry(.13, .13, .08, 24, 1, false, Math.PI / 2, Math.PI), black, [0, .31, -1.09]);
  block3(L, .1, .012, .8, new THREE.MeshStandardMaterial({ color: '#0C0B0C', roughness: .5 }), [0, .35, -.72], { cast: false });
  const linga = new THREE.Group(); L.add(linga);
  const lp = [[.24, 0]]; for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI / 2; lp.push([.24 * Math.cos(a), .44 + .3 * Math.sin(a)]); }
  mesh3(linga, lathe3([[0, 0], ...lp, [0, .74]], 64), black, [0, .34, 0]);
  // the tripundra: three lines of ash across the front (east), a red dot
  const ash = new THREE.MeshStandardMaterial({ color: '#E8E0D0', roughness: .9 });
  for (let i = 0; i < 3; i++) mesh3(linga, new THREE.TorusGeometry(.242, .007, 6, 24, 1.5), ash, [0, .34 + .42 + i * .055, 0], { rot: [Math.PI / 2, 0, -.75], cast: false });
  mesh3(linga, new THREE.SphereGeometry(.022, 12, 8), new THREE.MeshStandardMaterial({ color: '#C21E28', roughness: .5 }), [.236, .34 + .5, 0], { cast: false });
  // a marigold garland round its foot, three bilva leaves on top
  const mari = [new THREE.MeshStandardMaterial({ color: '#F09A1E', roughness: .8 }), new THREE.MeshStandardMaterial({ color: '#E2601A', roughness: .8 })];
  for (let i = 0; i < 30; i++) { const a = i / 30 * TAU; mesh3(linga, new THREE.IcosahedronGeometry(.028, 1), mari[i % 2], [Math.cos(a) * .262, .37, Math.sin(a) * .262]); }
  const leaf = new THREE.MeshStandardMaterial({ color: '#3E7A2C', roughness: .6, side: THREE.DoubleSide });
  for (let i = 0; i < 3; i++) { const a = i / 3 * TAU + .4; mesh3(linga, new THREE.SphereGeometry(.07, 12, 6), leaf, [Math.cos(a) * .06, .34 + .74, Math.sin(a) * .06], { scale: [1, .12, .5], rot: [0, -a, .25] }); }
  // the copper pot that drips on it, hung from the ceiling by three chains
  const cu = metal3('#B4683A', .3), potY = 1.62;
  mesh3(L, lathe3(smooth3([[0, 0], [.05, 0], [.15, .05], [.2, .15], [.18, .25], [.1, .31], [.09, .34], [.13, .37], [0, .37]], 4), 48), cu, [0, potY, 0]);
  for (let i = 0; i < 3; i++) { const a = i / 3 * TAU, x = Math.cos(a) * .12, z = Math.sin(a) * .12, len = TOP - F - potY - .36; mesh3(L, new THREE.CylinderGeometry(.006, .006, len, 5), metal3('#6A5040', .5), [x, potY + .36 + len / 2, z], { cast: false }); }
  // two standing lamps (kuthuvilakku) either side, toward the door
  const lampM = metal3('#C9963E', .3), inner = [];
  for (const s of [-1, 1]) {
    const x = .75, z = s * .95;
    mesh3(L, lathe3(smooth3([[0, 0], [.16, 0], [.16, .03], [.06, .07], [.03, .12], [.03, .72], [.06, .76], [.03, .79], [.12, .83], [.14, .87], [0, .86]], 3), 32), lampM, [x, 0, z]);
    inner.push(flame3(L, [x, .9, z], .9, { power: 2.2, range: 4.5, shadow: s > 0 }));
  }
  // the water: the drip from the pot, the film in the pitha, the run along the spout, the drop to the floor and the drain
  const pour = stream3(L, [[0, potY, 0], [0, potY - .3, 0], [0, 1.09, 0]], .009, { speed: 6 });
  const basin = mesh3(L, new THREE.RingGeometry(.25, .5, 48), waterMat3({ rep: 3, opacity: .5 }), [0, .355, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  basin.set = (t, on = 1) => { basin.visible = on > .001; basin.material.opacity = .45 * on; basin.material.map.offset.x = t * .3; };
  const lip = sheet3(L, .08, .78, [0, .358, -.72], { rot: [-Math.PI / 2, 0, Math.PI / 2], speed: 1.6 });
  const drop = stream3(L, [[0, .35, -1.15], [0, .3, -1.22], [0, .12, -1.27], [0, .015, -1.3], [0, .015, -1.55]], .016, { speed: 3, opacity: .7 });
  block3(L, .22, .015, .14, new THREE.MeshStandardMaterial({ color: '#050505', roughness: 1 }), [0, 0, -1.48], { cast: false });

  // ---- outside, on the north: the pranala and the channel across the path ----
  const pr = gran(1, .3, 13, { col: '#8A7F72' });
  block3(G, .32, .12, 1.0, pr, [0, .52, -2.9]);
  for (const s of [-1, 1]) block3(G, .06, .07, 1.0, pr, [s * .13, .64, -2.9]);
  block3(G, .38, .2, .16, pr, [0, .46, -3.42]);                       // the carved tip
  block3(G, .5, .4, .4, pr, [0, 0, -2.6]);                             // a bracket under it
  const spout = stream3(G, [[0, .62, -3.38], [0, .6, -3.5], [0, .4, -3.62], [0, .12, -3.7], [0, .05, -3.75]], .035, { speed: 3.2 });
  const chL = P - 3.5;
  for (const s of [-1, 1]) block3(G, .1, .1, chL, gran(chL, .2, 14), [s * .3, 0, -3.5 - chL / 2]);
  mesh3(G, new THREE.PlaneGeometry(.5, chL), new THREE.MeshStandardMaterial({ color: '#2A2420', roughness: .9 }), [0, .006, -3.5 - chL / 2], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const channel = sheet3(G, .48, chL, [0, .035, -3.5 - chL / 2], { rot: [-Math.PI / 2, 0, Math.PI / 2], speed: 1.4, opacity: .8 });

  // ---- lamps: on the plinth's corners, along the prakara's top ----
  const lamps = [], dish = lathe3([[0, 0], [.05, 0], [.07, .02], [.1, .035], [.1, .045], [.08, .04], [0, .035]], 24);
  const lamp = (x, y, z, light) => { mesh3(G, dish, lampM, [x, y, z]); lamps.push(flame3(G, [x, y + .04, z], 1, { light, power: 3.2, range: 6 })); };
  for (const [x, z] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) lamp(x * 2.3, F, z * 2.3, true);
  const top = 1.22;
  for (let i = -6; i <= 6; i += 2) { lamp(i, top, P, i % 4 === 0); lamp(i, top, -P, i % 4 === 0); lamp(-P, top, i, i === 0); if (Math.abs(i) >= 2) lamp(P, top, i, false); }

  // ---- trees beyond the wall ----
  const leafM = new THREE.MeshStandardMaterial({ color: '#2A3A26', roughness: .9, flatShading: true }), barkM = new THREE.MeshStandardMaterial({ color: '#2A211C', roughness: 1 });
  const rnd = lcg(77);
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * TAU + rnd() * .3, d = 17 + rnd() * 8, x = Math.cos(a) * d, z = Math.sin(a) * d, h = 3 + rnd() * 3;
    mesh3(G, new THREE.CylinderGeometry(.18, .3, h, 8), barkM, [x, h / 2, z]);
    for (let j = 0; j < 4; j++) mesh3(G, new THREE.IcosahedronGeometry(1.4 + rnd() * 1.2, 1), leafM, [x + (rnd() - .5) * 2, h + rnd() * 1.6, z + (rnd() - .5) * 2]);
  }

  const set = (t, so = {}) => {
    lamps.forEach((l, i) => l.set(t, typeof so.lamps === 'function' ? so.lamps(i) : so.lamps ?? 1));
    inner.forEach((l, i) => l.set(t, typeof so.inner === 'function' ? so.inner(i) : so.inner ?? 1));
    const w = so.water ?? 1;
    pour.set(t, clamp(w * 4)); basin.set(t, clamp(w * 3 - .3)); lip.set(t, clamp(w * 3 - 1)); drop.set(t, clamp(w * 3 - 1.4)); spout.set(t, clamp(w * 3 - 1.8)); channel.set(t, clamp(w * 3 - 2));
    bell.rotation.x = so.bell || 0;
  };
  return { group: G, F, path: path3, lamps, inner, bell, pour, basin, lip, drop, spout, channel, linga: L, steps: [A + .45, F, 0], set };
}
