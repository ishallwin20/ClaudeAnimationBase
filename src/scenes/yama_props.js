// yama_props.js: what "Diwali is FIVE days. The god of DEATH gets THREE." (ad 58) builds in the 3D style. One world:
// a village lane at night (lime-washed houses with geru dados, wooden doors, torans, flat roofs with parapets), the
// hero house on its west side with a clay diya on its step, the spout turned south; the bank behind the east row, a
// stone ghat down to a wide river, a small house on the bank (the sister's), the far bank and a hill (Govardhan, for day
// four); the lamps of the new-moon night on every roof, niche, step and on the water; and, far off, the room inside the
// sister's house (a thali on a low stool, morning light through a window). Yama rides through it as a 2D figure painted
// into a texture each frame (cine_yama.js) on a plane in the world, so the fog and the diya's light reach him.
// Metres; y up; north = -z, east = +x.

// ---------- moods (added before world3() builds the skies) ----------
Object.assign(MOODS3, {
  lane: { sky: [[1, '#02040C'], [.3, '#060A1C'], [.06, '#101830'], [0, '#1A2036'], [-1, '#05060A']],
    hemi: ['#4A5A90', '#140E0A', .38], sun: ['#7080B0', .15, [-6, 10, 9]], fog: ['#1E2840', 5, 34], exposure: 1.15 },
  dawn: { sky: [[1, '#18265A'], [.4, '#3E5090'], [.14, '#9A82A2'], [.04, '#E6A88E'], [0, '#F6C49A'], [-1, '#3A4658']],
    hemi: ['#8C9CD0', '#3A3430', .85], sun: ['#FFB890', 1.1, [30, 4, 8]], fog: ['#B4A0AC', 18, 160], exposure: 1.05 },
  diwali: { sky: [[1, '#02030A'], [.3, '#060818'], [.06, '#1C1430'], [0, '#3A2232'], [-1, '#050405']],
    hemi: ['#3A3A6A', '#2A1408', .28], sun: ['#806090', 0, [-6, 10, 9]], fog: ['#1A1020', 30, 220], exposure: 1.1 },
  gold: { sky: [[1, '#2A4A8A'], [.4, '#6A86B8'], [.12, '#EAB48A'], [.02, '#FFD49A'], [0, '#FFE2B4'], [-1, '#5A5048']],
    hemi: ['#B0C0E0', '#6A5040', .85], sun: ['#FFC890', 2.6, [40, 5, 8]], fog: ['#E6C6A6', 30, 260], exposure: 1.0 },
  room: { sky: [[1, '#000000'], [-1, '#000000']], hemi: ['#FFE0C0', '#3A2418', .22], sun: ['#FFD8A8', 0, [8, 6, 3]], fog: ['#000000', 40, 90], exposure: 1.05 },
});

// ---------- textures ----------
// lime plaster: a warm wash, hand-trowelled, stained low down by rain splash and smoke near the top
function plasterTex(col, seed = 1) {
  return tex3('plaster' + col + seed, 512, 512, (g, w, h) => {
    g.fillStyle = col; g.fillRect(0, 0, w, h);
    const r = lcg(seed);
    for (let i = 0; i < 90; i++) { const x = r() * w, y = r() * h, rr = 30 + r() * 90, gr = g.createRadialGradient(x, y, 0, x, y, rr), dk = r() < .55;
      gr.addColorStop(0, dk ? 'rgba(60,40,20,.08)' : 'rgba(255,250,240,.10)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      for (const [dx, dy] of [[0, 0], [w, 0], [-w, 0], [0, h], [0, -h]]) { g.save(); g.translate(dx, dy); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); g.restore(); } }
    // trowel arcs
    g.lineWidth = 2;
    for (let i = 0; i < 160; i++) { const x = r() * w, y = r() * h, rr = 14 + r() * 30, a = r() * TAU; g.strokeStyle = r() < .5 ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)'; g.beginPath(); g.arc(x, y, rr, a, a + 1.2); g.stroke(); }
    // fine grit
    for (let i = 0; i < 7000; i++) { g.fillStyle = r() < .6 ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.08)'; g.fillRect(r() * w, r() * h, 1, 1); }
    // hairline cracks
    g.strokeStyle = 'rgba(40,28,18,.25)'; g.lineWidth = 1;
    for (let i = 0; i < 6; i++) { let x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 8; k++) { x += (r() - .5) * 26; y += 6 + r() * 14; g.lineTo(x, y); } g.stroke(); }
  });
}
const earthTex = () => tex3('earth', 512, 512, (g, w, h) => {
  g.fillStyle = '#6E5A44'; g.fillRect(0, 0, w, h);
  const r = lcg(7);
  for (let i = 0; i < 140; i++) { const x = r() * w, y = r() * h, rr = 20 + r() * 80, gr = g.createRadialGradient(x, y, 0, x, y, rr), dk = r() < .5;
    gr.addColorStop(0, dk ? 'rgba(40,28,18,.16)' : 'rgba(160,136,104,.14)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    for (const [dx, dy] of [[0, 0], [w, 0], [-w, 0], [0, h], [0, -h]]) { g.save(); g.translate(dx, dy); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); g.restore(); } }
  for (let i = 0; i < 16000; i++) { const v = r(); g.fillStyle = v < .5 ? `rgba(30,20,12,${.2 + r() * .3})` : `rgba(190,170,140,${.1 + r() * .2})`; g.fillRect(r() * w, r() * h, r() < .9 ? 1 : 2, r() < .9 ? 1 : 2); }
  // pebbles
  for (let i = 0; i < 120; i++) { const x = r() * w, y = r() * h, rr = 1.5 + r() * 3; g.fillStyle = `rgba(${120 + r() * 60 | 0},${105 + r() * 50 | 0},${85 + r() * 40 | 0},.8)`; g.beginPath(); g.ellipse(x, y, rr, rr * .7, r() * 3, 0, TAU); g.fill(); }
});
const woodTex = () => tex3('wood', 256, 512, (g, w, h) => {
  g.fillStyle = '#5A3A22'; g.fillRect(0, 0, w, h);
  const r = lcg(3);
  for (let i = 0; i < 70; i++) { const x = r() * w; g.strokeStyle = r() < .5 ? 'rgba(30,18,10,.35)' : 'rgba(140,96,60,.25)'; g.lineWidth = 1 + r() * 3; g.beginPath(); g.moveTo(x, 0); for (let y = 0; y <= h; y += 32) g.lineTo(x + Math.sin(y * .02 + i) * 4, y); g.stroke(); }
  // planks
  g.strokeStyle = 'rgba(15,8,4,.7)'; g.lineWidth = 3; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(k * w / 4, 0); g.lineTo(k * w / 4, h); g.stroke(); }
});
// the ripple normal map (as the Palk Strait's)
const rippleTex = () => tex3('ripple', 512, 512, (g, w, h) => {
  const id = g.createImageData(w, h), d = id.data, WV = [[3, 1, .8, 0], [1, 4, .6, 1.3], [5, -2, .4, 2.1], [-2, 6, .35, .7], [7, 3, .2, 4.2], [-6, 5, .18, 3.3]];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let sx = 0, sy = 0; for (const [a, b, am, ph] of WV) { const k = (a * x + b * y) / w * TAU + ph, cc = Math.cos(k) * am; sx += cc * a; sy += cc * b; }
    const i = (y * w + x) * 4; d[i] = 128 + sx * 6; d[i + 1] = 128 + sy * 6; d[i + 2] = 255; d[i + 3] = 255;
  }
  g.putImageData(id, 0, 0);
}, { data: true });

// a wide soft blot (mist)
const glowTexSoft = () => tex3('glowsoft', 128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(.5, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });

// ---------- materials ----------
const YM = (() => {
  const std = (col, rough = .8, o = {}) => new THREE.MeshStandardMaterial({ color: col, roughness: rough, ...o });
  return {
    std,
    earth: new THREE.MeshStandardMaterial({ map: earthTex().rep(26, 26), roughness: .95 }),
    wood: new THREE.MeshStandardMaterial({ map: woodTex().rep(1, 1), roughness: .7 }),
    woodD: std('#3A2414', .7), dark: std('#0A0706', 1), clay: std('#A2502C', .75), clayD: std('#6A3018', .8), oil: std('#C8901E', .2, { metalness: .2 }),
    brass: metal3('#C9963E', .3), copper: metal3('#B8643A', .3), iron: metal3('#3A3A3E', .5),
    leaf: std('#3E6A22', .7, { side: THREE.DoubleSide }), mari: [std('#F29A18', .75), std('#E8641A', .75), std('#F6C228', .75)],
    stone: stone3({ col: '#8A7E70', rows: 1, cols: 2, seed: 21, rep: [4, 1], mottle: 1.2 }), stoneD: stone3({ col: '#5E554C', rows: 1, cols: 3, seed: 22, rep: [6, 1] }),
    grass: std('#3E4A2A', .95), hill: std('#4A5232', .95), far: std('#2E3628', .95), white: std('#F2EDE2', .7), red: std('#B02018', .7),
  };
})();
const plaster = (col, seed, rep) => new THREE.MeshStandardMaterial({ map: plasterTex(col, seed).rep(...rep), roughness: .92 });

// ---------- the clay diya ----------
// a hand-pressed terracotta lamp: a shallow bowl pinched into a spout, oil, a cotton wick lying in the spout, the
// flame at its tip. The spout points along yaw (0 = +z, south). Returns { group, flame, tip() }.
function diya3(parent, pos, o = {}) {
  const G = new THREE.Group(); G.position.set(...pos); G.rotation.y = o.yaw ?? 0; G.scale.setScalar(o.k ?? 1); parent.add(G);
  const bowl = lathe3(smooth3([[0, 0], [.03, 0], [.045, .008], [.056, .022], [.06, .032], [.054, .034], [.046, .024], [.03, .018], [0, .016]], 4), 36);
  mesh3(G, bowl, YM.clay, [0, 0, 0], { scale: [1, 1, 1.0] });
  // the spout: a pinched lip
  const sp = new THREE.CylinderGeometry(.012, .022, .05, 12, 1, true, 0, Math.PI); sp.rotateX(Math.PI / 2); sp.rotateZ(Math.PI);
  mesh3(G, sp, YM.clay, [0, .028, .066], { rot: [-.2, 0, 0] });
  mesh3(G, new THREE.CircleGeometry(.046, 24), YM.oil, [0, .022, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // the wick
  mesh3(G, new THREE.CylinderGeometry(.003, .004, .07, 6), YM.white, [0, .03, .055], { rot: [Math.PI / 2 - .35, 0, 0], cast: false });
  const tipL = [0, .044, .088];
  const flame = o.flame === false ? null : flame3(G, tipL, o.fk ?? .45, { power: o.power ?? .5, range: o.range ?? 7, shadow: !!o.shadow, col: '#FF9A3C' });
  return { group: G, flame, tip: () => G.localToWorld(V3(...tipL)).toArray() };
}

// ---------- a house ----------
// built in local space with its front at x = 0 facing +x, the body behind it (to -x); o: at [x, z] the front's middle,
// face 1 (front to the east) or -1 (to the west), w (along the lane), d, h, col (plaster), base (the dado), door (true),
// open (0..1 the door ajar), windows, seed. Returns its lamp seats (world points): roof (the parapet), niche, step.
function house3(parent, o = {}) {
  const G = new THREE.Group(), w = o.w ?? 5, d = o.d ?? 5, h = o.h ?? 3.2, face = o.face ?? 1, seed = o.seed ?? 1;
  G.position.set(o.at[0], 0, o.at[1]); G.rotation.y = face > 0 ? 0 : Math.PI; parent.add(G);
  const pl = plaster(o.col || '#E8DFCC', seed, [w / 2.5, h / 2.5]), base = YM.std(o.base || '#9A3A22', .9);
  const P = .32;                                                  // the plinth's height (the otla in front)
  // the body; with a door, its front wall is built round a real opening (so a camera can stand in the doorway)
  const T = .35, dW = o.dw ?? 1.05, dH = o.dh ?? 2.0;
  if (o.door === false) block3(G, d, h, w, pl, [-d / 2, 0, 0]);
  else {
    block3(G, d - T, h, w, pl, [-(d + T) / 2, 0, 0]);
    const sw = (w - dW) / 2;
    for (const sd of [-1, 1]) block3(G, T, h, sw, pl, [-T / 2, 0, sd * (dW / 2 + sw / 2)]);
    block3(G, T, h - P - dH, dW, pl, [-T / 2, P + dH, 0]); block3(G, T, P, dW, pl, [-T / 2, 0, 0]);
    // the floor inside the doorway
    block3(G, T, .01, dW, YM.std('#6A4A3A', .9), [-T / 2, P - .01, 0], { cast: false });
  }
  // the dado band (geru), a hair proud of the wall
  const dwB = o.door === false ? 0 : (o.dw ?? 1.05) + .3, segW = (w - dwB) / 2;
  if (dwB) for (const sd of [-1, 1]) block3(G, .02, .6, segW, base, [.01, P, sd * (dwB / 2 + segW / 2)], { cast: false });
  else block3(G, .02, .6, w + .002, base, [.01, P, 0], { cast: false });
  // the otla: a raised platform along the front, plastered, its edge in geru
  block3(G, .9, P, w, YM.std(o.otla || '#B8A890', .95), [.45, 0, 0]);
  block3(G, .02, P, w, base, [.9, 0, 0], { cast: false });
  // the roof: a slab and a parapet with a coping
  block3(G, d + .12, .14, w + .12, pl, [-d / 2 + .02, h, 0]);
  block3(G, .18, .42, w + .12, pl, [-.01, h + .14, 0]);
  block3(G, .26, .05, w + .2, YM.std(o.coping || '#C9BBA2', .9), [-.01, h + .56, 0]);
  const lamps = { roof: [], niche: [], step: [], door: null }, hinges = [];
  const W = (p) => G.localToWorld(V3(...p)).toArray();
  G.updateMatrixWorld(true);
  for (let z = -w / 2 + .3; z <= w / 2 - .29; z += .5) lamps.roof.push(W([0, h + .61, z]));
  // the door: a deep opening (dark), a heavy frame, two leaves (one ajar), studs, a toran over it
  if (o.door !== false) {
    const dw = o.dw ?? 1.05, dh = o.dh ?? 2.0, y0 = P;
    const fr = YM.wood;
    block3(G, .14, dh + .16, .14, fr, [.02, y0, -dw / 2 - .07]); block3(G, .14, dh + .16, .14, fr, [.02, y0, dw / 2 + .07]);
    block3(G, .16, .16, dw + .42, fr, [.03, y0 + dh, 0]);
    block3(G, .1, .1, dw + .3, YM.woodD, [.03, y0 - .02, 0]);   // the threshold beam
    const open = o.open ?? 0;
    for (const s of [-1, 1]) {
      const hinge = new THREE.Group(); hinge.position.set(-.3, y0, s * dw / 2); G.add(hinge); hinges.push([hinge, s]);
      hinge.rotation.y = s * open * 1.35;
      mesh3(hinge, new THREE.BoxGeometry(.06, dh, dw / 2), YM.wood, [0, dh / 2, -s * dw / 4]);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) mesh3(hinge, new THREE.SphereGeometry(.018, 8, 6), YM.brass, [.035, .35 + i * .45, -s * (dw / 4 + (j - .5) * .22)], { cast: false });
    }
    // the toran: mango leaves and marigolds swagged across the lintel
    const n = 13;
    for (let i = 0; i < n; i++) {
      const k = i / (n - 1), z = lerp(-dw / 2 - .1, dw / 2 + .1, k), y = y0 + dh + .02 - Math.sin(k * Math.PI) * .07;
      mesh3(G, new THREE.SphereGeometry(.035, 8, 6), YM.mari[i % 3], [.12, y, z], { cast: false });
      if (i % 2) mesh3(G, new THREE.PlaneGeometry(.06, .2), YM.leaf, [.13, y - .12, z], { rot: [0, Math.PI / 2, (i % 4 - 1.5) * .1], cast: false });
    }
    lamps.door = W([.6, P, 0]);
    // two niches beside the door, for lamps
    for (const s of [-1, 1]) { const z = s * (dw / 2 + .55); block3(G, .12, .3, .24, YM.dark, [-.05, P + 1.0, z], { cast: false }); lamps.niche.push(W([.0, P + 1.02, z])); }
  }
  // windows: a dark opening with a wooden frame and bars
  for (const z of (o.windows || [])) {
    block3(G, .2, .7, .7, YM.dark, [-.09, P + 1.0, z], { cast: false });
    block3(G, .08, .82, .08, YM.woodD, [.02, P + .94, z - .39]); block3(G, .08, .82, .08, YM.woodD, [.02, P + .94, z + .39]);
    block3(G, .08, .08, .86, YM.woodD, [.02, P + .94, z]); block3(G, .08, .08, .86, YM.woodD, [.02, P + 1.7, z]);
    for (let k = -2; k <= 2; k++) block3(G, .03, .7, .03, YM.iron, [.0, P + 1.0, z + k * .13], { cast: false });
  }
  for (let z = -w / 2 + .4; z <= w / 2 - .39; z += .7) lamps.step.push(W([.82, P, z]));
  return { group: G, lamps, front: o.at, face, setOpen: (k) => hinges.forEach(([hg, s]) => hg.rotation.y = s * k * 1.35) };
}

// ---------- the village, the bank, the river ----------
const HERO = { x: -2.2, z: 0 };                 // the hero house's front (it faces east, across the lane)
const DIYA_AT = [HERO.x + .62, .32, .0];       // the diya on the otla, before the door
const RIVER_X = 25.4, WATER_Y = -1.5;          // the water's edge and level
const SIS = { x: 20, z: -29.5 };               // the sister's house on the bank: its front (south face) door at x 20
const ROOM_AT = [0, 0, 400];                     // the room inside it, built far away

function village3(scene) {
  const G = new THREE.Group(); scene.add(G);
  // the ground: the lane and the bank, packed earth; grass beyond the east row's backs
  mesh3(G, new THREE.PlaneGeometry(120, 160), YM.earth, [-20, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const bank = mesh3(G, new THREE.PlaneGeometry(RIVER_X - 11, 160), new THREE.MeshStandardMaterial({ map: earthTex().rep(12, 60), color: '#9AA080', roughness: .95 }), [(11 + RIVER_X) / 2 - 2.2, .005, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // houses: the west row (fronts at x -2.2 facing east), the east row (fronts at x 6 facing west)
  const cols = ['#E8DFCC', '#DCE4E8', '#E8D0B0', '#EAD8D2', '#D8D8C4', '#E6DCC0'], bases = ['#9A3A22', '#8A3020', '#5A6A8A', '#9A3A22', '#7A4A2A'];
  const H = [], r = lcg(58);
  const row = (x, face, z0, z1, skip) => { let z = z0; let i = 0; while (z < z1) { const w = 4 + r() * 2.4; const zc = z + w / 2; if (!skip || !skip(zc, w)) H.push(house3(G, { at: [x, zc], face, w: w - .25, d: 4.6 + r() * 1.5, h: 2.8 + r() * 1.2, col: cols[(i + (face > 0 ? 0 : 3)) % cols.length], base: bases[i % bases.length], seed: 10 + i * 3 + (face > 0 ? 0 : 50), windows: w > 5 ? [-(w - .25) / 2 + .8] : [], open: 0 })); z += w; i++; } };
  const hero = house3(G, { at: [HERO.x, HERO.z], face: 1, w: 5.2, d: 5.6, h: 3.3, col: '#ECE2CC', base: '#9A3A22', seed: 3, windows: [-1.8, 1.8], open: .18 });
  row(HERO.x, 1, -46, -2.65); row(HERO.x, 1, 2.65, 46);
  row(6, -1, -46, 46);
  // a warm glow inside the hero's door (the house's lamp, seen through the gap)
  const inner = new THREE.PointLight('#FFA050', 0, 4, 1.6); inner.position.set(HERO.x - 1.2, 1.4, .1); G.add(inner);
  // the ghat: stone steps from the bank down to the water, between z -21 and -5
  for (let i = 0; i < 8; i++) block3(G, .42, .2, 16, i % 2 ? YM.stone : YM.stoneD, [RIVER_X - 3.2 + i * .4 + .21, -(i + 1) * .2, -13]);
  block3(G, 3.4, 1.4, 16.6, YM.stoneD, [RIVER_X - 1.6, -3.0, -13]);    // under the steps
  // the bank's edge elsewhere: an earth slope down to the water
  for (const [z0, z1] of [[-80, -21.3], [-4.7, 80]]) { const g = new THREE.Group(); g.position.set(RIVER_X - 1.4, WATER_Y / 2, (z0 + z1) / 2); g.rotation.z = -Math.atan2(-WATER_Y, 4.2); G.add(g); mesh3(g, new THREE.PlaneGeometry(4.6, z1 - z0), YM.earth, [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false }); }
  // a small shrine at the ghat's top (a niche on a plinth), and two stone posts
  block3(G, .8, .5, .8, YM.stone, [RIVER_X - 4, 0, -20.4]); block3(G, .6, .9, .6, plaster('#E8DCC4', 9, [1, 1]), [RIVER_X - 4, .5, -20.4]);
  mesh3(G, new THREE.ConeGeometry(.42, .7, 4), plaster('#E8DCC4', 9, [1, 1]), [RIVER_X - 4, 1.75, -20.4], { rot: [0, Math.PI / 4, 0] });
  // the sister's house on the bank, its door to the south
  const sis = house3(G, { at: [SIS.x, SIS.z], face: 1, w: 4.6, d: 4.2, h: 3.0, col: '#E6D6BC', base: '#8A3020', seed: 77, windows: [], open: .5 });
  sis.group.rotation.y = -Math.PI / 2;   // front to the south (+z)
  sis.group.updateMatrixWorld(true);
  const sisInner = new THREE.PointLight('#FFA858', 0, 5, 1.6); sisInner.position.set(SIS.x, 1.3, SIS.z - 1.2); G.add(sisInner);
  // trees: a big pipal by the ghat, neem along the bank
  const trunkM = YM.std('#3A2C22', .9), crownM = YM.std('#2E4A22', .9), crownL = YM.std('#3E5A2A', .9);
  const tree = (x, z, s, seedT) => {
    const T = new THREE.Group(); T.position.set(x, 0, z); G.add(T);
    mesh3(T, new THREE.CylinderGeometry(.18 * s, .3 * s, 3.2 * s, 10), trunkM, [0, 1.6 * s, 0]);
    const rt = lcg(seedT);
    for (let i = 0; i < 9; i++) mesh3(T, new THREE.IcosahedronGeometry((1.1 + rt() * .8) * s, 1), i % 2 ? crownM : crownL, [(rt() - .5) * 2.6 * s, (3.4 + rt() * 1.6) * s, (rt() - .5) * 2.6 * s], { scale: [1, .75, 1] });
    return T;
  };
  tree(RIVER_X - 7.5, -44, 1.25, 4); tree(RIVER_X - 7, 6, 1, 5); tree(RIVER_X - 6, 18, .9, 6); tree(RIVER_X - 7.5, -40, 1.1, 7);
  // the river: a wide sheet of water mirroring the sky (an env map per mood), ripples scrolling
  const ripple = rippleTex().rep(40, 40);
  const water = mesh3(G, new THREE.PlaneGeometry(400, 600), new THREE.MeshStandardMaterial({ color: '#8A9AAA', roughness: .06, metalness: .92, normalMap: ripple, normalScale: new THREE.Vector2(.35, .35) }), [RIVER_X + 198, WATER_Y, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // the far bank, low, with a line of trees, and the hill
  block3(G, 200, 1.6, 600, YM.far, [RIVER_X + 230, WATER_Y - .2, 0]);
  const rf = lcg(91);
  for (let i = 0; i < 160; i++) mesh3(G, new THREE.IcosahedronGeometry(1.6 + rf() * 1.8, 1), YM.far, [RIVER_X + 134 + rf() * 16, WATER_Y + 1.6 + rf() * 1.6, -260 + i * 3.4 + rf() * 2], { scale: [1, .9 + rf() * .5, 1], cast: false });
  const hillGeo = new THREE.SphereGeometry(1, 64, 32, 0, TAU, 0, Math.PI / 2), hp = hillGeo.attributes.position;
  for (let i = 0; i < hp.count; i++) { const x = hp.getX(i), y = hp.getY(i), z = hp.getZ(i), n = 1 + .08 * Math.sin(x * 9 + z * 5) + .05 * Math.sin(x * 21 - z * 13) + .04 * Math.cos(z * 17 + x * 3); hp.setXYZ(i, x * n, y * n * (1 + .15 * Math.sin(z * 4)), z * n); }
  hillGeo.computeVertexNormals();
  const HILL = [RIVER_X + 190, WATER_Y, -115];
  const hill = mesh3(G, hillGeo, YM.hill, HILL, { scale: [55, 24, 36], cast: false });
  // the sun (a disc and its glow), placed per mood
  const sun = glow3(scene, [400, 10, -40], 90, '#FFD49A', 1); sun.material.fog = false; const sunCore = glow3(scene, [400, 10, -40], 22, '#FFF4E0', 1);
  // the stars, for the night skies (two sizes)
  const stars = [];
  for (const [n, sz, a, sd] of [[1600, 1.6, .75, 5], [140, 3.2, .95, 6]]) {
    const rs = lcg(sd), pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const th = rs() * TAU, el = Math.asin(.05 + .95 * rs()), R = 260; pos[i * 3] = Math.cos(el) * Math.cos(th) * R; pos[i * 3 + 1] = Math.sin(el) * R; pos[i * 3 + 2] = Math.cos(el) * Math.sin(th) * R; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const p = new THREE.Points(g, new THREE.PointsMaterial({ color: '#E8ECFF', size: sz, sizeAttenuation: false, transparent: true, opacity: a, fog: false, depthWrite: false }));
    p.frustumCulled = false; scene.add(p); stars.push(p);
  }
  // mist down the lane: big soft cold sprites that catch no light, so a dark figure reads against them
  const mist = [], rm = lcg(12);
  for (let i = 0; i < 16; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexSoft(), color: '#7A8AB4', transparent: true, opacity: 0, depthWrite: false, fog: false })); s.position.set(1.6 + (rm() - .5) * 3, 1.2 + rm() * 1.4, -34 + i * 4.6 + rm() * 2); s.scale.set(9 + rm() * 5, 4 + rm() * 2, 1); scene.add(s); mist.push(s); }
  return { group: G, hero, houses: H, sis, inner, sisInner, water, ripple, hill, HILL, stars, mist,
    setSun(p, a = 1, size = 90) { sun.visible = sunCore.visible = a > .01; if (!sun.visible) return; sun.position.set(...p); sunCore.position.set(...p); sun.material.opacity = a; sunCore.material.opacity = a; sun.scale.setScalar(size); sunCore.scale.setScalar(size * .22); },
    setMist(a) { mist.forEach((s, i) => { s.visible = a > .01; s.material.opacity = a * (.1 + .05 * Math.sin(i * 2.1)); }); },
    setStars(a) { stars.forEach((s, i) => { s.visible = a > .01; s.material.opacity = a * (i ? .95 : .75); }); } };
}

// ---------- the lamps of the new-moon night ----------
// every roof's parapet, the niches and otlas, the lane's edges, the ghat's steps, floating diyas on the river, a ring
// round the hill (day four). Flames are glow points (cores and halos), clay diyas instanced near enough to read, and a
// few real lights for the walls. set(t, on, o): on 0..1 (they come on in a wave from the hero's door), o.hill 0..1.
function lamps3(scene, V) {
  const pts = [], near = [];
  const all = [V.hero, ...V.houses, V.sis];
  for (const h of all) {
    for (const p of h.lamps.roof) pts.push([...p, 1]);
    for (const p of h.lamps.niche) pts.push([...p, 1]);
    for (const p of h.lamps.step) pts.push([...p, 1]);
  }
  // the ghat's steps: a diya every .6 m on each step
  for (let i = 0; i < 8; i += 2) for (let z = -20.6; z <= -5.4; z += .6) pts.push([RIVER_X - 3.2 + i * .4 + .25, -(i + 1) * .2, z, 1]);
  const nLand = pts.length;
  // floating on the river: drifting off the ghat
  const rf = lcg(33), floatN = 70, float = [];
  for (let i = 0; i < floatN; i++) float.push([RIVER_X + 1 + rf() * 18, -24 + rf() * 22, rf() * TAU]);
  const nFloat = floatN;
  // the hill's ring (day four)
  const hillPts = [];
  for (let i = 0; i < 90; i++) { const a = i / 90 * TAU, rr = 1.06; hillPts.push([V.HILL[0] + Math.cos(a) * 55 * rr, V.HILL[1] + 3.2, V.HILL[2] + Math.sin(a) * 36 * rr]); }
  for (let i = 0; i < 40; i++) { const a = (i / 40) * TAU, rr = .62; hillPts.push([V.HILL[0] + Math.cos(a) * 55 * rr * 1.08, V.HILL[1] + 24 * Math.sqrt(1 - rr * rr) * 1.12 + 2, V.HILL[2] + Math.sin(a) * 36 * rr * 1.08]); }
  const N = nLand + nFloat * 2 + hillPts.length;
  const mk = (size, col) => {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3)); g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    const p = new THREE.Points(g, new THREE.PointsMaterial({ map: glowTex3(), size, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: true }));
    p.frustumCulled = false; scene.add(p); return p;
  };
  const core = mk(.16, '#FFE0A0'), halo = mk(1.0, '#FF9A3C'), far = mk(7, '#FF9A3C');   // far: the hill's lamps, seen from far
  // instanced clay diyas under the land lamps
  const inst = new THREE.InstancedMesh(lathe3([[0, 0], [.04, 0], [.055, .02], [.06, .032], [.05, .03], [0, .02]], 12), YM.clay, nLand + nFloat);
  inst.castShadow = false; inst.receiveShadow = true; scene.add(inst);
  const M4 = new THREE.Matrix4();
  pts.forEach((p, i) => { M4.makeTranslation(p[0], p[1], p[2]); inst.setMatrixAt(i, M4); });
  // real lights: the hero's house, its neighbours, the ghat
  const LP = [[HERO.x + .8, .8, 0], [HERO.x + .3, 3.9, -1.5], [HERO.x + .3, 3.9, 1.5], [RIVER_X - 1.6, -.4, -16], [RIVER_X - 1.6, -.4, -9]];
  for (const z of [-26, -17, -8, 8, 17, 26]) LP.push([HERO.x + .9, .9, z]);
  for (const z of [-22, -12, -3, 6, 15, 24]) LP.push([6 - .9, .9, z]);
  const lights = LP.map(p => { const l = new THREE.PointLight('#FF9A44', 0, 7, 1.6); l.position.set(...p); scene.add(l); return l; });
  const wave = (p) => Math.hypot(p[0] - DIYA_AT[0], p[2] - DIYA_AT[2]);
  const set = (t, on = 1, o = {}) => {
    const vis = on > .001 || (o.hill ?? 0) > .001;
    core.visible = halo.visible = vis; far.visible = (o.hill ?? 0) > .001; inst.visible = on > .001;
    const cp = core.geometry.attributes.position, cc = core.geometry.attributes.color, hpA = halo.geometry.attributes.position, hc = halo.geometry.attributes.color, fp = far.geometry.attributes.position, fc = far.geometry.attributes.color;
    let k = 0;
    const put = (x, y, z, a, flick, isFar) => {
      cp.setXYZ(k, x, y, z); hpA.setXYZ(k, x, y + .02, z); fp.setXYZ(k, x, y, z);
      const f = a * (.85 + .15 * flick);
      cc.setXYZ(k, isFar ? 0 : f, isFar ? 0 : f * .86, isFar ? 0 : f * .6); hc.setXYZ(k, isFar ? 0 : f * .9, isFar ? 0 : f * .5, isFar ? 0 : f * .18);
      fc.setXYZ(k, isFar ? f : 0, isFar ? f * .55 : 0, isFar ? f * .2 : 0); k++;
    };
    const R = o.radius ?? 1e9;   // the wave: lamps within R of the hero's door are lit
    for (let i = 0; i < nLand; i++) { const p = pts[i], a = on * clamp((R - wave(p)) / 3); put(p[0], p[1] + .07, p[2], a, Math.sin(t * 13 + i * 1.7) * .5 + vnoise(t * 6 + i, 3) * .5); if (a > .01) { M4.makeTranslation(p[0], p[1], p[2]); inst.setMatrixAt(i, M4); } else { M4.makeScale(0, 0, 0); inst.setMatrixAt(i, M4); } }
    for (let i = 0; i < nFloat; i++) {
      const [x0, z0, ph] = float[i], dx = (t * .12 + ph) % 1 * 6, x = x0 + dx, z = z0 + Math.sin(t * .3 + ph) * .4, y = WATER_Y + .02 + .01 * Math.sin(t * 2 + ph);
      const a = on * clamp((R - 18) / 3);
      put(x, y + .07, z, a, Math.sin(t * 11 + i) * .5 + .5);
      put(x, y - .22, z, a * .35, Math.sin(t * 11 + i) * .5 + .5);   // its reflection
      M4.makeTranslation(x, y, z); inst.setMatrixAt(nLand + i, a > .01 ? M4 : M4.makeScale(0, 0, 0));
    }
    for (const p of hillPts) put(p[0], p[1], p[2], (o.hill ?? 0), Math.sin(t * 9 + p[0]) * .5 + .5, true);
    cp.needsUpdate = cc.needsUpdate = hpA.needsUpdate = hc.needsUpdate = fp.needsUpdate = fc.needsUpdate = true; inst.instanceMatrix.needsUpdate = true;
    lights.forEach((l, i) => { l.intensity = 2.2 * on * clamp((R - wave(LP[i])) / 3) * (.9 + .1 * Math.sin(t * 12 + i)); });
  };
  set(0, 0);
  return { set, core, halo, inst, lights };
}

// ---------- the room inside the sister's house (day five) ----------
// built far off (ROOM_AT): a lime-washed room with a geru dado and a red-oxide floor, a window to the east with the
// morning coming in, a low wooden stool (chowki) with a brass thali on it (rice, dal, sabzi, kheer, puris, two laddoos,
// a little diya), a low seat (pata) before it, a rangoli on the floor, a brass lamp on a stand. Returns { set(t, o) }.
function room3(scene) {
  const G = new THREE.Group(); G.position.set(...ROOM_AT); scene.add(G);
  const wall = plaster('#EADFCB', 41, [2, 1.2]), base = YM.std('#9A3A22', .9);
  mesh3(G, new THREE.PlaneGeometry(7, 7), YM.std('#6A3A2A', .45, { metalness: .02 }), [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  mesh3(G, new THREE.PlaneGeometry(7, 3.2), wall, [0, 1.6, -2.2], { cast: false });                     // the back wall (north)
  mesh3(G, new THREE.PlaneGeometry(4.4, 3.2), wall, [-2.4, 1.6, 0], { rot: [0, Math.PI / 2, 0], cast: false });   // west
  // the east wall with a window opening (four pieces round it)
  const E = (w, h, y, z) => mesh3(G, new THREE.PlaneGeometry(w, h), wall, [2.4, y, z], { rot: [0, -Math.PI / 2, 0], cast: false });
  E(4.4, .9, .45, 0); E(4.4, 1.0, 2.7, 0); E(1.6, 1.3, 1.55, -1.4); E(1.6, 1.3, 1.55, 1.4);
  // the window's frame and bars; the light comes through it
  const wf = YM.wood;
  block3(G, .14, .1, 1.3, wf, [2.4, .9, 0]); block3(G, .14, .1, 1.3, wf, [2.4, 2.2, 0]);
  for (const s of [-1, 1]) block3(G, .14, 1.4, .1, wf, [2.4, .9, s * .6]);
  for (let k = -2; k <= 2; k++) block3(G, .04, 1.3, .03, YM.iron, [2.4, .9, k * .2], { cast: false });
  mesh3(G, new THREE.PlaneGeometry(7, 4.4), plaster('#3A2E26', 42, [2, 2]), [0, 3.2, 0], { rot: [Math.PI / 2, 0, 0], cast: false });   // the ceiling
  // dado bands
  mesh3(G, new THREE.PlaneGeometry(7, .5), base, [0, .25, -2.19], { cast: false });
  mesh3(G, new THREE.PlaneGeometry(4.4, .5), base, [-2.39, .25, 0], { rot: [0, Math.PI / 2, 0], cast: false });
  // a niche in the back wall with a brass lamp
  block3(G, .5, .6, .12, YM.std('#2A1E16', .9), [-1.2, 1.2, -2.16], { cast: false });
  // the chowki: a low stool, the thali on it
  const C = new THREE.Group(); C.position.set(.2, 0, -.6); G.add(C);
  block3(C, .7, .06, .7, YM.wood, [0, .28, 0]);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) mesh3(C, lathe3([[.035, 0], [.045, .06], [.03, .14], [.045, .22], [.035, .28]], 12), YM.woodD, [sx * .29, 0, sz * .29]);
  const TY = .34;
  mesh3(C, lathe3([[0, 0], [.2, 0], [.24, .01], [.255, .03], [.245, .032], [.23, .014], [0, .01]], 48), YM.brass, [0, TY, 0]);
  const katori = (x, z, col) => { mesh3(C, lathe3([[0, 0], [.03, 0], [.05, .03], [.052, .045], [.048, .046], [0, .01]], 24), YM.brass, [x, TY + .012, z]); mesh3(C, new THREE.CircleGeometry(.047, 20), YM.std(col, .5), [x, TY + .052, z], { rot: [-Math.PI / 2, 0, 0], cast: false }); };
  katori(-.12, -.1, '#E0A21E'); katori(.0, -.15, '#5A7A2A'); katori(.12, -.1, '#F4ECD6');
  mesh3(C, new THREE.SphereGeometry(.08, 20, 10, 0, TAU, 0, Math.PI / 2), YM.std('#F6F2E8', .8), [.04, TY + .012, .07], { scale: [1, .7, 1] });   // rice
  for (let i = 0; i < 3; i++) mesh3(C, new THREE.CylinderGeometry(.06, .06, .012, 20), YM.std('#D8A050', .6), [-.13, TY + .02 + i * .012, .08 + i * .01], { rot: [.1, 0, .05 * i] });  // puris
  for (const [x, z] of [[.15, .1], [.16, .02]]) mesh3(C, new THREE.SphereGeometry(.025, 14, 10), YM.std('#F0A020', .7), [x, TY + .04, z]);   // laddoos
  const thaliDiya = diya3(C, [-.04, TY + .012, .17], { k: .55, yaw: 0, power: .35, range: 3.5 });
  // the pata: a low seat before the chowki
  block3(G, .9, .07, .5, YM.wood, [.2, .06, .35]);
  for (const sx of [-1, 1]) block3(G, .06, .06, .44, YM.woodD, [.2 + sx * .38, 0, .35]);
  // a rangoli on the floor before the seat: rings of petals
  for (let ring = 0; ring < 3; ring++) for (let i = 0; i < 18 + ring * 6; i++) { const a = i / (18 + ring * 6) * TAU, rr = .14 + ring * .1; mesh3(G, new THREE.CircleGeometry(.025, 10), ring % 2 ? YM.mari[1] : YM.mari[2], [.2 + Math.cos(a) * rr, .004 + ring * .001, 1.0 + Math.sin(a) * rr * .8], { rot: [-Math.PI / 2, 0, 0], cast: false }); }
  mesh3(G, new THREE.CircleGeometry(.07, 16), YM.red, [.2, .006, 1.0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // the brass standing lamp by the west wall
  mesh3(G, lathe3(smooth3([[0, 0], [.12, 0], [.12, .03], [.04, .07], [.022, .12], [.022, .9], [.05, .94], [.11, .98], [0, .97]], 3), 24), YM.brass, [-.2, 0, 1.45]);
  const standFlame = flame3(G, [-.2, 1.0, 1.45], .8, { power: 1.1, range: 6, shadow: true });
  // the morning sun through the window: a light shaft and motes
  const shaft = null && mesh3(G, new THREE.CylinderGeometry(.6, 1.0, 4.2, 4, 1, true), new THREE.MeshBasicMaterial({ color: '#FFD8A0', transparent: true, opacity: .07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }), [.9, 1.0, .1], { rot: [0, Math.PI / 4, Math.PI / 2 - .55], cast: false, receive: false });
  return { group: G, thaliDiya, standFlame, shaft, thaliAt: () => C.localToWorld(V3(0, TY, 0)).toArray(), at: (p) => [ROOM_AT[0] + p[0], ROOM_AT[1] + p[1], ROOM_AT[2] + p[2]] };
}

// ---------- Yama in the world ----------
// a 2D figure (cine_yama.js) painted each frame into a canvas texture on an upright plane, lit by the scene's lights
// (MeshStandardMaterial) and fogged; o.sil (a silhouette colour) or the full colour figure. place(p, o): p the feet in
// world [x, y, z], o.h (the plane's height in m), o.yaw (the plane's facing), o.flip, o.draw(c) (the rig, in units with
// the feet at (0, 0) and ~1100 tall), o.a (opacity). eyes(): the eye points in world space, for 2D glows on top.
function yamaBoard3(scene, o = {}) {
  const S = 1024, cv = document.createElement('canvas'); cv.width = cv.height = S;
  const g = cv.getContext('2d'), tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = MAX_ANISO;
  const mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: .02, roughness: 1, side: THREE.DoubleSide, depthWrite: true });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat); m.castShadow = false; m.receiveShadow = false; scene.add(m);
  const U = o.units ?? 1250;     // canvas units across the plane (the rig's ~1100 tall, with room)
  let eyePts = [];
  const place = (p, q = {}) => {
    m.visible = (q.a ?? 1) > .01; if (!m.visible) return;
    const hgt = q.h ?? 3;
    m.scale.set(hgt, hgt, 1); m.position.set(p[0], p[1] + hgt / 2 - (q.sink ?? .04) * hgt, p[2]); m.rotation.set(0, q.yaw ?? 0, 0);
    mat.opacity = q.a ?? 1; mat.color.set(q.tint || '#FFFFFF'); mat.emissive.set(q.emissive || '#000000'); mat.emissiveIntensity = 1;
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, S, S);
    const k = S / U; g.translate(S / 2, S * (1 - (q.sink ?? .04))); g.scale(k * (q.flip ? -1 : 1), k);
    eyePts = [];
    q.draw(g, (ex, ey) => eyePts.push([ex * (q.flip ? -1 : 1), ey]));
    tex.needsUpdate = true;
    m.updateMatrixWorld(true);
  };
  // rig units → world: the plane's local x runs across (-.5..5), y up
  const world = ([ux, uy]) => { const s = 1 / U, lx = ux * s, ly = -uy * s - .5 + (o.sinkL ?? .04); return m.localToWorld(V3(lx, ly + 0, 0)).toArray(); };
  return { mesh: m, place, eyes: () => eyePts.map(world), canvas: cv };
}

// ---------- 2D helpers (as ad 54's) ----------
// a dark band behind 2D lettering (y0..y1, fading at both ends)
function band(c, y0, y1, a = .6) {
  c.save(); const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(6,5,10,0)'); g.addColorStop(.25, `rgba(6,5,10,${a})`); g.addColorStop(.75, `rgba(6,5,10,${a})`); g.addColorStop(1, 'rgba(6,5,10,0)');
  c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); c.restore();
}
// the series tag pill
function tag(c, txt, y, t, o = {}) {
  const k = popK(o.pop ?? (t + 1)), w = o.w || 520;
  c.save(); c.globalAlpha *= o.alpha ?? 1; c.translate(540, y); c.scale(k, k); c.fillStyle = 'rgba(20,12,8,.72)'; c.strokeStyle = 'rgba(244,196,106,.85)'; c.lineWidth = 3;
  c.beginPath(); c.roundRect(-w / 2, -38, w, 76, 38); c.fill(); c.stroke(); c.restore();
  text(c, txt, 540, y + 2, '700 36px Cinzel', '#F4C46A', { spacing: 2, alpha: o.alpha ?? 1 });
}
