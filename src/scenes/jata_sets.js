// jata_sets.js: the 3D set of "Why do some sadhus keep JATA and some SHAVE?" (ad 87). One scene, built once at load:
//   GHAT   a two-tier stone platform round an old banyan on a river bank at dawn. On the lower tier sits the jata sadhu
//          (matted locks wound into a knot, a beard, ash, a rudraksha mala; a trishul and a dhuni beside him); on the
//          upper tier the shaven sannyasi (an ochre robe, a bamboo danda, a kamandalu). Both are matte figurines built
//          from primitives, eyes closed. Their hair is animated: sadhu3().hair(k) grows or shaves it.
//          Also: a bow leaning on the trunk, a cut branch dripping banyan latex into a leaf cup (Ayodhya Kanda 52), a
//          wooden comb on the stone.
// Units are metres, y up; the set faces +z (the camera stands at +z); the river is behind (-z).

// a fine grey texture for bump maps: lines along u (hair, grain, weave)
const streakTex3 = (key, n = 900, o = {}) => tex3(key, 512, 512, (g, w, h) => {
  g.fillStyle = '#808080'; g.fillRect(0, 0, w, h); const r = lcg(o.seed ?? 5);
  for (let i = 0; i < n; i++) {
    const y = r() * h, x = r() * w, l = (o.len ?? 120) * (.4 + r()), a = .1 + r() * .35;
    g.strokeStyle = r() < .5 ? `rgba(0,0,0,${a})` : `rgba(255,255,255,${a * .8})`; g.lineWidth = .6 + r() * (o.wd ?? 2);
    g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + l * .3, y + (r() - .5) * (o.wave ?? 6), x + l * .6, y + (r() - .5) * (o.wave ?? 6), x + l, y + (r() - .5) * (o.wave ?? 6)); g.stroke();
    g.beginPath(); g.moveTo(x - w, y); g.lineTo(x - w + l, y); g.stroke();
  }
}, { data: true });
const hairTex3 = () => tex3('jataHair', 512, 512, (g, w, h) => {
  g.fillStyle = '#33241A'; g.fillRect(0, 0, w, h); const r = lcg(22);
  for (let i = 0; i < 1600; i++) { const y = r() * h, x = r() * w, l = 80 + r() * 260, c = r(); g.strokeStyle = c < .45 ? `rgba(16,10,6,${.3 + r() * .4})` : c < .85 ? `rgba(104,74,48,${.2 + r() * .35})` : `rgba(160,120,84,${.15 + r() * .25})`; g.lineWidth = .8 + r() * 2.4; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + l * .3, y + (r() - .5) * 5, x + l * .6, y + (r() - .5) * 5, x + l, y + (r() - .5) * 5); g.stroke(); g.beginPath(); g.moveTo(x - w, y); g.lineTo(x - w + l, y); g.stroke(); }
});
// skin: a soft mottle (ash smears when ash > 0)
const skinTex3 = (key, col, ash) => tex3('skin' + key, 512, 512, (g, w, h) => {
  g.fillStyle = col; g.fillRect(0, 0, w, h); const r = lcg(41);
  for (let i = 0; i < 90; i++) { const x = r() * w, y = r() * h, rr = 30 + r() * 110, gr = g.createRadialGradient(x, y, 0, x, y, rr), dk = r() < .5;
    gr.addColorStop(0, ash ? (dk ? 'rgba(60,44,34,.07)' : 'rgba(226,220,210,.13)') : (dk ? 'rgba(70,36,18,.08)' : 'rgba(255,214,170,.07)')); gr.addColorStop(1, 'rgba(0,0,0,0)');
    for (const [dx, dy] of [[0, 0], [w, 0], [-w, 0], [0, h], [0, -h]]) { g.save(); g.translate(dx, dy); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); g.restore(); } }
});

// ======================================================================================================
// the sadhu
// ======================================================================================================
// sadhu3(parent, { kind: 'jata' | 'mundi' }): a seated figure (padmasana, hands on the knees, eyes closed), ~.92 m to the
// crown, its origin on the seat, facing +z. Returns the group with .hair(k) (0 shaven .. 1 full: the jata sadhu's locks,
// knot and beard grow; the sannyasi's short hair), .shikha(k) (the sannyasi's tuft), .head (the head's group), .HY.
function sadhu3(parent, o = {}) {
  const G = new THREE.Group(); parent.add(G);
  const jata = o.kind === 'jata', R = lcg(jata ? 7 : 19);
  const skinCol = jata ? '#94765E' : '#A87048';
  const skin = new THREE.MeshStandardMaterial({ map: skinTex3(jata ? 'J' : 'M', skinCol, jata).rep(2, 2), roughness: .78, envMapIntensity: .5 });
  const skinF = std3(jata ? '#927660' : '#A46C46', .78, { envMapIntensity: .5 });
  const cloth = new THREE.MeshStandardMaterial({ color: jata ? '#A8441A' : '#D8782A', roughness: .9, bumpMap: streakTex3('weave', 1400, { len: 60, wave: 14, wd: 1.2, seed: 9 }).rep(6, 6), bumpScale: 1.2, envMapIntensity: .4 });
  const dark = std3('#2A1A12', .7), HY = .79, rx = .094, ry = .118, rz = .104;
  const onHead = (a, yy, off = 0) => { const k = Math.sqrt(Math.max(0, 1 - yy * yy)); return [(rx + off) * k * Math.sin(a), HY + (ry + off) * yy, (rz + off) * k * Math.cos(a)]; };
  // the lap under cloth: the thighs out to the knees, the shins folded back across, a fall of cloth in front
  const lapCloth = () => {
    mesh3(G, new THREE.SphereGeometry(1, 36, 22), cloth, [0, .09, .16], { scale: [.3, .115, .3] });
    for (const s of [-1, 1]) {
      tubeP3(G, [[s * .08, .1, .0], [s * .25, .105, .13], [s * .37, .09, .27]], [.105, .085], cloth, { segs: 24, radial: 16 });
      tubeP3(G, [[s * .37, .085, .27], [s * .22, .085, .4], [-s * .02, .1, .44]], [.085, .06], cloth, { segs: 24, radial: 16 });
      mesh3(G, new THREE.SphereGeometry(.088, 20, 14), cloth, [s * .375, .088, .275]);
    }
  };
  // ---- the body
  const torso = mesh3(G, lathe3(smooth3([[.001, .05], [.17, .05], [.19, .13], [.172, .26], [.186, .4], [.214, .5], [.2, .565], [.105, .605], [.058, .63], [.054, .7]], 4), 40), skin, [0, 0, 0], { scale: [1, 1, .68] });
  for (const s of [-1, 1]) {
    mesh3(G, new THREE.SphereGeometry(.064, 24, 16), skin, [s * .2, .54, 0]);
    tubeP3(G, [[s * .225, .54, 0], [s * .3, .35, .05], [s * .325, .21, .2], [s * .31, .175, .31]], [.049, .034], skin, { segs: 30, radial: 14 });
    mesh3(G, new THREE.SphereGeometry(1, 20, 14), skin, [s * .31, .17, .345], { scale: [.044, .024, .058] });
  }
  if (jata) {
    lapCloth();
    // a rudraksha mala on the chest, a second, shorter one at the neck
    const bead = std3('#5A2C18', .6), bg = new THREE.SphereGeometry(.0125, 10, 8);
    for (let i = 0; i < 46; i++) { const a = i / 46 * TAU; mesh3(G, bg, bead, [.125 * Math.sin(a), .615 - .2 * (1 + Math.cos(a)) / 2, -.01 + .135 * Math.cos(a) + .012 * Math.cos(a) * Math.cos(a)], { cast: false }); }
    for (let i = 0; i < 30; i++) { const a = i / 30 * TAU; mesh3(G, bg, bead, [.075 * Math.sin(a), .64 - .05 * (1 + Math.cos(a)) / 2, .072 * Math.cos(a)], { cast: false, scale: .85 }); }
  } else {
    // the robe: the lap, the knees under it, a wrap to the chest, a fold over the left shoulder
    lapCloth();
    mesh3(G, lathe3(smooth3([[.001, .04], [.2, .04], [.218, .13], [.2, .26], [.212, .4], [.228, .46], [.215, .49], [.19, .495]], 4), 40), cloth, [0, 0, 0], { scale: [1, 1, .7] });
    tubeP3(G, [[-.2, .32, .1], [-.08, .43, .15], [.09, .54, .12], [.2, .61, .0], [.14, .56, -.12], [-.04, .44, -.16], [-.2, .32, -.1]], [.046, .046], cloth, { segs: 40, radial: 14 });
    mesh3(G, new THREE.SphereGeometry(.082, 24, 16), cloth, [.205, .55, 0]);
  }
  // ---- the head
  const head = new THREE.Group(); G.add(head);
  mesh3(head, new THREE.SphereGeometry(1, 48, 36), skinF, [0, HY, 0], { scale: [rx, ry, rz] });
  mesh3(head, new THREE.SphereGeometry(1, 24, 16), skinF, [0, HY - .07, .022], { scale: [.07, .06, .075] });        // the jaw
  for (const s of [-1, 1]) {
    mesh3(head, new THREE.SphereGeometry(1, 16, 12), skinF, [s * (rx + .002), HY - .012, -.004], { scale: [.016, .04, .026] });   // ears, long lobes
    const eye = [], brow = [];
    for (let i = 0; i <= 10; i++) { const q = i / 10 * 2 - 1; eye.push(onHead(s * (.4 + q * .15), .03 - .035 * (1 - q * q), .001)); brow.push(onHead(s * (.4 + q * .2), .19 + .035 * (1 - q * q) - .012 * q, .002)); }
    tubeP3(head, eye, .0042, dark, { segs: 20, radial: 6, cast: false });
    tubeP3(head, brow, [.0062, .004], dark, { segs: 20, radial: 6, cast: false });
  }
  mesh3(head, new THREE.SphereGeometry(1, 16, 12), skinF, [0, HY - .008, rz + .001], { scale: [.0125, .034, .014], cast: false });   // the nose
  mesh3(head, new THREE.SphereGeometry(1, 16, 12), skinF, [0, HY - .034, rz + .006], { scale: [.0165, .0115, .0135], cast: false });
  { const m = []; for (let i = 0; i <= 8; i++) { const q = i / 8 * 2 - 1; m.push([q * .028, HY - .074 - .006 * (1 - q * q), .094 + .003 * (1 - q * q)]); } tubeP3(head, m, .0036, std3('#6E3A28', .7), { segs: 14, radial: 6, cast: false }); }
  // the tripundra: three lines of ash across the forehead
  const ashM = std3('#E8E2D6', .9);
  for (let l = 0; l < 3; l++) { const p = []; for (let i = 0; i <= 12; i++) p.push(onHead((i / 12 * 2 - 1) * .62, .4 + l * .11, .0012)); tubeP3(head, p, .0045, ashM, { segs: 24, radial: 6, cast: false }); }
  mesh3(head, new THREE.SphereGeometry(.0085, 12, 8), std3('#B02A1A', .7), onHead(0, .29, .002), { cast: false });   // a dot of kumkum
  // ---- the hair
  const hairM = new THREE.MeshStandardMaterial({ map: hairTex3().rep(4, 1), roughness: .78, bumpMap: streakTex3('hairB', 1400, { len: 260, wave: 4, wd: 1.6, seed: 21 }).rep(4, 1), bumpScale: 2, envMapIntensity: .4, color: jata ? '#FFFFFF' : '#6A6460' });
  const hairM2 = hairM.clone(); hairM2.color.set('#C8B49C');
  const cap = mesh3(head, new THREE.SphereGeometry(1, 40, 28), hairM, [0, HY + .016, -.024], { scale: [rx * 1.07, ry * 1.05, rz * 1.1] });
  const locks = [];
  const lock = (pts, r, mat, segs = 60, radial = 9, par = head, g = [0, .7]) => { const m = tubeP3(par, pts, r, mat, { segs, radial }); m.userData = { segs, radial, g }; locks.push(m); return m; };
  let shikha = null;
  if (jata) {
    // the knot: locks wound up a cone on the crown, a flat coil on top
    for (let l = 0; l < 10; l++) {
      const ph = l / 10 * TAU + (R() - .5) * .3, pts = [], turns = 1.2 + R() * .4, j0 = R() * 10, rr = .017 + R() * .008;
      for (let i = 0; i <= 30; i++) { const k = i / 30, a = ph + k * turns * TAU, rad = lerp(.088, .034, Math.pow(k, .8)) * (1 + .08 * Math.sin(k * 11 + j0)); pts.push([Math.cos(a) * rad, HY + .085 + .18 * Math.pow(k, .9), -.02 + Math.sin(a) * rad]); }
      lock(pts, [rr, rr * .55], l % 2 ? hairM : hairM2, 90, 9, head, [.45, .92]);
    }
    { const pts = []; for (let i = 0; i <= 20; i++) { const k = i / 20, a = k * 2 * TAU; pts.push([Math.cos(a) * .04 * (1 - k * .6), HY + .262 + .024 * k, -.02 + Math.sin(a) * .04 * (1 - k * .6)]); } lock(pts, [.02, .012], hairM, 60, 9, head, [.85, 1]); }
    // locks over the shoulders and down the back
    for (let l = 0; l < 15; l++) {
      const th = lerp(.95, TAU - .95, l / 14) + (R() - .5) * .12, sx = Math.sin(th), cz = Math.cos(th), j = (R() - .5) * .05, len = R();
      lock([[sx * .085, HY + .05, cz * .09 - .024], [sx * .125, HY - .06, cz * .12 - .03], [sx * .2, .6, cz * .15 - .035], [sx * .255, .47, cz * .2 - .03 + j], [sx * .262 + j, .33 - len * .08, cz * .215 - .02], [sx * .25 + j * 1.5, .14 + len * .12, cz * .22 - .02 - j]], [.02 + R() * .006, .009], l % 2 ? hairM2 : hairM, 70, 9, G);
    }
    // the beard and the moustache
    for (let l = 0; l < 34; l++) {
      const row = l % 2, a = lerp(-1.05, 1.05, (l >> 1) / 16) + (R() - .5) * .08, c = 1 - Math.abs(a) / 1.05, s0 = onHead(a, -.42 - .3 * c - row * .08, -.006), dz = row ? .012 : 0;
      lock([s0, [Math.sin(a) * .08, HY - .125 - .03 * c, .028 + .072 * Math.cos(a) + dz], [Math.sin(a) * .062 + (R() - .5) * .014, HY - .2 - .08 * c - R() * .03, .07 + .06 * Math.cos(a) + dz], [Math.sin(a) * .04 + (R() - .5) * .02, HY - .25 - .13 * c - R() * .04, .1 + .05 * Math.cos(a) + dz]], [.014, .004], (l + row) % 3 ? hairM : hairM2, 30, 8, head, [.1, .8]);
    }
    for (const s of [-1, 1]) lock([[s * .004, HY - .052, rz + .004], [s * .03, HY - .06, rz - .006], [s * .058, HY - .085, rz - .028]], [.011, .004], hairM, 20, 8);
  } else {
    shikha = tubeP3(head, [[0, HY + .1, -.062], [0, HY + .12, -.1], [0, HY + .07, -.135], [.004, HY + .0, -.138], [.0, HY - .045, -.128]], [.017, .007], hairM, { segs: 30, radial: 9 });
  }
  let hk = -1;
  G.hair = (k) => {
    k = clamp(k); if (k === hk) return; hk = k;
    const s = lerp(.93, 1, k); cap.scale.set(rx * 1.07 * s, ry * 1.05 * s, rz * 1.1 * s); cap.visible = k > .02;
    for (const m of locks) { const { segs, radial, g } = m.userData, kk = seg(k, g[0], g[1]); m.visible = kk > .02; m.geometry.setDrawRange(0, Math.max(1, Math.round(kk * segs)) * radial * 6); }
  };
  G.shikha = (k) => { if (shikha) { shikha.visible = k > .02; shikha.scale.setScalar(Math.max(.01, k)); shikha.position.set(0, (HY + .08) * (1 - k), -.08 * (1 - k)); } };
  G.hair(1); G.shikha(0); G.head = head; G.HY = HY;
  return G;
}

// ======================================================================================================
// props
// ======================================================================================================
// a trishul planted in the ground (1.75 m), dark iron, a red cloth tied under the prongs
function trishul3(parent, pos) {
  const G = new THREE.Group(); G.position.set(...pos); parent.add(G); const iron = std3('#3A3632', .6, { metalness: .4, envMapIntensity: .4 });
  mesh3(G, new THREE.CylinderGeometry(.013, .015, 1.45, 12), iron, [0, .725, 0]);
  tubeP3(G, [[0, 1.42, 0], [0, 1.62, 0], [0, 1.8, 0]], [.014, .003], iron, { segs: 12, radial: 8 });
  for (const s of [-1, 1]) tubeP3(G, [[0, 1.44, 0], [s * .085, 1.47, 0], [s * .105, 1.58, 0], [s * .08, 1.72, 0]], [.012, .003], iron, { segs: 20, radial: 8 });
  mesh3(G, new THREE.SphereGeometry(.03, 12, 10), std3('#A82A1A', .9), [0, 1.4, 0], { scale: [1, .7, 1] });
  tubeP3(G, [[0, 1.4, 0], [.03, 1.33, .02], [.05, 1.2, .03]], [.016, .006], std3('#A82A1A', .9), { segs: 10, radial: 6 });
  return G;
}
// a dhuni: a ring of stones, ash, charred logs, a small fire
function dhuni3(parent, pos) {
  const G = new THREE.Group(); G.position.set(...pos); parent.add(G); const r = lcg(4), st = std3('#4A443E', .95), ash = std3('#6E6860', 1);
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; mesh3(G, new THREE.IcosahedronGeometry(.042 + r() * .014, 1), st, [Math.cos(a) * .19, .022, Math.sin(a) * .19], { scale: [1, .7, 1], rot: [r(), r() * 3, r()] }); }
  mesh3(G, new THREE.CylinderGeometry(.17, .19, .03, 24), ash, [0, .015, 0]);
  for (let i = 0; i < 3; i++) mesh3(G, new THREE.CylinderGeometry(.022, .026, .3, 8), std3('#1E1612', .9), [0, .06, 0], { rot: [Math.PI / 2 - .25, i * 2.1, 0] });
  const fl = flame3(G, [0, .07, 0], 1.1, { light: true, power: .7, range: 3 });
  G.set = (t, on) => fl.set(t, on);
  return G;
}
// a kamandalu: a dark water pot with a spout and a hoop handle
function kamandalu3(parent, pos, k = 1) {
  const G = new THREE.Group(); G.position.set(...pos); G.scale.setScalar(k); parent.add(G); const m = std3('#4A3020', .55, { envMapIntensity: .5 });
  mesh3(G, lathe3(smooth3([[.001, 0], [.06, 0], [.1, .05], [.105, .11], [.07, .17], [.04, .19], [.045, .21], [.001, .21]], 4), 32), m, [0, 0, 0]);
  tubeP3(G, [[.09, .1, 0], [.15, .13, 0], [.18, .19, 0]], [.014, .008], m, { segs: 10, radial: 8 });
  mesh3(G, new THREE.TorusGeometry(.075, .007, 8, 28, Math.PI), m, [0, .2, 0], { rot: [0, Math.PI / 2, 0] });
  return G;
}
// the danda: a bamboo staff with its nodes, a strip of ochre cloth tied near the top
function danda3(parent, pos, o = {}) {
  const G = new THREE.Group(); G.position.set(...pos); if (o.rot) G.rotation.set(...o.rot); parent.add(G); const b = std3('#C8A860', .6), L = o.len ?? 1.45;
  mesh3(G, new THREE.CylinderGeometry(.013, .016, L, 12), b, [0, L / 2, 0]);
  for (let i = 1; i < 7; i++) mesh3(G, new THREE.TorusGeometry(.0155, .004, 6, 16), std3('#9A7A3A', .7), [0, i * L / 7, 0], { rot: [Math.PI / 2, 0, 0], cast: false });
  const cl = std3('#D8782A', .9); mesh3(G, new THREE.CylinderGeometry(.024, .024, .1, 12), cl, [0, L - .16, 0]);
  tubeP3(G, [[0, L - .2, .02], [.02, L - .3, .035], [.01, L - .42, .03]], [.02, .008], cl, { segs: 10, radial: 6 });
  return G;
}
// a wooden comb lying flat (its teeth toward +z)
function comb3(parent, pos, o = {}) {
  const G = new THREE.Group(); G.position.set(...pos); if (o.rot) G.rotation.set(...o.rot); parent.add(G); const w = std3('#A8743C', .55, { bumpMap: streakTex3('combGrain', 500, { len: 300, wave: 3, wd: 1, seed: 4 }).rep(1, 1), bumpScale: .6 });
  mesh3(G, new THREE.BoxGeometry(.2, .012, .035), w, [0, .006, -.03]);
  for (let i = 0; i < 22; i++) mesh3(G, new THREE.BoxGeometry(.0048, .009, .062), w, [-.094 + i * .00895, .006, .018]);
  G.scale.setScalar(o.k ?? 1);
  return G;
}

// ======================================================================================================
// the ghat
// ======================================================================================================
const GHAT = (() => {
  const S = new THREE.Scene(); S.fog = new THREE.Fog('#E8B890', 14, 120);
  const hemi = new THREE.HemisphereLight('#CFE0F4', '#8A6A48', .7); S.add(hemi);
  const sun = new THREE.DirectionalLight('#FFDDB0', 3); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 7, bottom: -4, near: 1, far: 60 }); sun.shadow.bias = -.0004; sun.shadow.normalBias = .012; sun.shadow.radius = 3;
  S.add(sun, sun.target); sun.target.position.set(0, 1, -1);
  const rim = new THREE.DirectionalLight('#FFB070', 0); rim.position.set(-2, 3, -8); S.add(rim, rim.target); rim.target.position.set(0, 1, 0);
  const bgDawn = backdrop3(S, '#3E6EB0', '#E8A870', '#B08A64', 60), bgDusk = backdrop3(S, '#2A2A52', '#F28A4A', '#7A3A2A', 59), bgForest = backdrop3(S, '#A8C8B8', '#E8E4C0', '#A8B890', 58);
  const sunDisc = glow3(S, [6, 5.5, -52], 16, '#FFB060', 0), sunCore = glow3(S, [6, 5.5, -52], 5, '#FFE2B0', 0);
  // the ground, the two tiers of the platform, the bank's edge, the river, the far bank
  mesh3(S, new THREE.PlaneGeometry(40, 16), stone3({ col: '#8E7C66', rows: 2, cols: 2, seed: 21, rep: [7, 3], mottle: 1.4 }), [0, 0, 3.6], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const slabM = stone3({ col: '#9A866C', dark: '#4A3A2A', rows: 1, cols: 2, seed: 8, rep: [2, 1], mottle: 1.4 }), slabT = stone3({ col: '#94806A', dark: '#4A3A2A', rows: 1, cols: 2, seed: 5, rep: [2.5, 1], mottle: 1.5 });
  const L1 = .32, L2 = .86;
  block3(S, 6.4, L1, 4.6, slabT, [0, 0, -2.1]); block3(S, 6.5, .06, 4.7, slabM, [0, L1 - .06, -2.1]);
  block3(S, 6.0, L2 - L1, 3.6, slabT, [0, L1, -2.75]); block3(S, 6.1, .06, 3.7, slabM, [0, L2 - .06, -2.75]);
  block3(S, 40, .5, .5, slabM, [0, -.3, -4.6]);
  const waterM = new THREE.MeshStandardMaterial({ color: '#7896A8', roughness: .16, metalness: 0, envMapIntensity: 1.3, bumpMap: streakTex3('ripple', 900, { len: 90, wave: 3, wd: 1.2, seed: 13 }).rep(30, 60), bumpScale: .5 });
  const water = mesh3(S, new THREE.PlaneGeometry(160, 60), waterM, [0, -.55, -34], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const hillM = std3('#5A6E84', 1), hr = lcg(3);
  for (let i = 0; i < 16; i++) mesh3(S, new THREE.SphereGeometry(1, 20, 12), hillM, [-48 + i * 6.5 + hr() * 3, -.6, -54 - hr() * 3], { scale: [6 + hr() * 5, 2.5 + hr() * 5, 3], cast: false, receive: false });
  for (const [x, k] of [[3, 1], [7.5, .7], [-9, .85], [14, .6]]) mesh3(S, lathe3(smooth3([[.001, 6.2], [.25, 5.9], [.5, 5.2], [1.0, 3.4], [1.35, 1.2], [1.5, 0]], 4), 20), hillM, [x, -.6, -50], { scale: k, cast: false, receive: false });
  // ---- the banyan: a trunk of twisted stems, boughs, aerial roots, a canopy
  const TX = -2.5, TZ = -3.4, tree = new THREE.Group(); tree.position.set(TX, L2, TZ); S.add(tree);
  const bark = new THREE.MeshStandardMaterial({ color: '#6E543E', roughness: .95, bumpMap: streakTex3('bark', 1600, { len: 200, wave: 10, wd: 3, seed: 2 }).rep(1, 6), bumpScale: 6 }), bark2 = bark.clone(); bark2.color.set('#5C4634');
  mesh3(tree, new THREE.CylinderGeometry(.42, .6, 4.2, 20), bark2, [0, 2.1, 0]);
  const tr = lcg(11);
  for (let i = 0; i < 11; i++) { const a = i / 11 * TAU + tr() * .3, tw = (tr() - .5) * 1.6, pts = []; for (let k = 0; k <= 8; k++) { const u = k / 8, aa = a + tw * u, rad = lerp(.72, .42, Math.pow(u, .6)) + .05 * Math.sin(u * 7 + i); pts.push([Math.cos(aa) * rad, u * 4.3 - .05, Math.sin(aa) * rad]); } tubeP3(tree, pts, [.2 + tr() * .08, .13], i % 2 ? bark : bark2, { segs: 40, radial: 10 }); }
  const boughs = [[1, .25, 4.6], [.3, 1, 4.2], [-1, .2, 3.6], [.7, -.7, 3.4], [-.5, .9, 3.8], [1, .7, 5.2], [-.6, -.8, 3.2]], roots = [];
  for (const [dx, dz, len] of boughs) { const n = Math.hypot(dx, dz), ux = dx / n, uz = dz / n;
    tubeP3(tree, [[ux * .3, 2.9, uz * .3], [ux * len * .35, 3.5, uz * len * .35], [ux * len * .7, 3.75, uz * len * .7], [ux * len, 3.6, uz * len]], [.2, .07], bark, { segs: 30, radial: 10 });
    for (let k = 0; k < 5; k++) { const u = .3 + tr() * .65, x = ux * len * u + (tr() - .5) * .3, z = uz * len * u + (tr() - .5) * .3, drop = 1.0 + tr() * 2.2, sw = (tr() - .5) * .12;
      if (TX + x > -1.4 && TZ + z > -3.0) continue;
      roots.push(tubeP3(tree, [[x, 3.6, z], [x + sw, 3.6 - drop * .5, z + sw], [x + sw * 1.4, 3.6 - drop, z - sw]], [.022, .008], bark2, { segs: 16, radial: 6 })); } }
  const leafM = ['#3E6A2C', '#4E7A30', '#2E5A28', '#5E8A3A'].map(col => std3(col, .85, { bumpMap: stoneTex({ seed: 30, rows: 1, cols: 1, speck: 2.5 }).bump.rep(4, 4), bumpScale: 8 })), lg = new THREE.IcosahedronGeometry(1, 2);
  for (let i = 0; i < 150; i++) { const a = tr() * TAU, d = Math.sqrt(tr()) * 5.6, s = .55 + tr() * .75; mesh3(tree, lg, leafM[i % 4], [Math.cos(a) * d, 4.2 + tr() * 1.7 - d * .06, Math.sin(a) * d], { scale: [s * 1.25, s * .62, s * 1.25], rot: [tr(), tr() * 3, tr()], receive: false, cast: false }); }
  // ---- the two sadhus on their mats
  const matM = std3('#8A6A3A', .95, { bumpMap: streakTex3('kusha', 1800, { len: 80, wave: 3, wd: 1.4, seed: 6 }).rep(3, 3), bumpScale: 3 });
  const JP = [-.3, L1, -.48], MP = [.42, L2, -1.5];
  mesh3(S, new THREE.BoxGeometry(.98, .018, .86), matM, [JP[0], L1 + .009, JP[2] + .14]);
  mesh3(S, new THREE.BoxGeometry(.98, .018, .86), std3('#7A4A2A', .95, { bumpMap: matM.bumpMap, bumpScale: 3 }), [MP[0], L2 + .009, MP[2] + .14]);
  const J = sadhu3(S, { kind: 'jata' }); J.position.set(JP[0], L1 + .018, JP[2]); J.rotation.y = .16;
  const M = sadhu3(S, { kind: 'mundi' }); M.position.set(MP[0], L2 + .018, MP[2]); M.rotation.y = -.14;
  const danda = danda3(S, [MP[0] + .44, L2, MP[2] + .2], { rot: [-.06, 0, .1] });
  const kam = kamandalu3(S, [MP[0] - .58, L2, MP[2] + .3]);
  const tri = trishul3(S, [JP[0] - .62, L1, JP[2] - .12]); tri.rotation.z = .04;
  const dhuni = dhuni3(S, [JP[0] + .9, L1, JP[2] + .0]);
  const kamJ = kamandalu3(S, [JP[0] - .55, L1, JP[2] + .42], .85);
  // ---- Ram's banyan milk: a bow against the trunk, a cut branch dripping latex into a leaf cup
  const ram = new THREE.Group(); S.add(ram);
  const BX = TX + .3, BZ = TZ + .4, SL = .75;
  const bow = new THREE.Group(); bow.position.set(TX + 1.12, L2, TZ + .62); bow.rotation.set(-.08, .5, .17); ram.add(bow);
  { const p = []; for (let i = 0; i <= 20; i++) { const u = i / 20 * 2 - 1; p.push([.16 * (1 - u * u) + .04 * Math.pow(Math.abs(u), 6), .86 + u * .85, 0]); } tubeP3(bow, p, [.017, .017], pbr3('darkwood', { rep: [.3, 3], tint: '#B07A44', rough: .55 }), { segs: 50, radial: 10 });
    mesh3(bow, new THREE.CylinderGeometry(.0022, .0022, 1.7, 5), std3('#E8DCC0', .6), [.04, .86, 0], { cast: false });
    mesh3(bow, new THREE.CylinderGeometry(.024, .024, .16, 12), std3('#8A2A1A', .8), [.16, .86, 0]); for (const u of [-1, 1]) mesh3(bow, new THREE.CylinderGeometry(.02, .02, .05, 10), metal3('#B08A3A', .6), [.04 + .0, .86 + u * .83, 0]); }
  const stub = new THREE.Group(); stub.position.set(BX, L2 + .95, BZ); stub.rotation.order = 'YXZ'; stub.rotation.set(.95, .5, 0); ram.add(stub);
  mesh3(stub, new THREE.CylinderGeometry(.045, .07, SL, 14), bark, [0, SL / 2, 0]);
  mesh3(stub, new THREE.CylinderGeometry(.044, .044, .012, 14), std3('#E8DCC0', .5), [0, SL + .003, 0]);
  const tipP = [BX + SL * Math.sin(.95) * Math.sin(.5), L2 + .95 + SL * Math.cos(.95), BZ + SL * Math.sin(.95) * Math.cos(.5)];
  const milkM = std3('#FBF8EE', .3, { emissive: '#FFFFFF', emissiveIntensity: .12 });
  const cupY = L2 + .2, cup = new THREE.Group(); cup.position.set(tipP[0], cupY, tipP[2]); ram.add(cup);
  const cupStone = mesh3(ram, new THREE.IcosahedronGeometry(.14, 2), std3('#5E564E', .95), [tipP[0], L2 + .07, tipP[2]], { scale: [1.3, .95, 1.2] });
  mesh3(cup, lathe3(smooth3([[.001, .0], [.06, .004], [.11, .04], [.13, .085]], 4), 28), new THREE.MeshStandardMaterial({ color: '#4E7A30', roughness: .6, side: THREE.DoubleSide }), [0, 0, 0]);
  const pool = mesh3(cup, new THREE.CylinderGeometry(.1, .08, .01, 24), milkM, [0, .03, 0], { cast: false });
  const drops = [0, 1, 2].map(() => mesh3(ram, new THREE.SphereGeometry(.009, 12, 10), milkM, [0, 0, 0], { cast: false, scale: [1, 1.6, 1] }));
  const bead = mesh3(ram, new THREE.SphereGeometry(.014, 12, 10), milkM, [tipP[0], tipP[1] - .012, tipP[2] + .01], { cast: false });
  // ---- the comb on the edge of the lower tier
  const CP = [.44, L1 + .002, .07], comb = comb3(S, CP, { rot: [0, -.35, 0], k: 1.25 });
  const motes = motes3(S, { n: 220, box: [-4, .3, -5, 4, 4, 2], size: .0018, col: '#FFE8C0', drift: [.03, .02, .01] });
  const shafts = shafts3(S, { n: 9, area: [5, 4], at: [-.2, -1.6], len: 6, top: 5.2, seed: 5 });

  // set(t, o): o.mood 'dawn' | 'forest' | 'dusk'; o.hairJ, o.hairM (0..1), o.shikha (0..1), o.fire (the dhuni, 0..1),
  // o.tri (trishul shown), o.ram (the bow and the latex shown), o.milk (0..1 the latex running), o.comb (0..1)
  const set = (t, o = {}) => {
    const mood = o.mood || 'dawn', du = mood === 'dusk', fo = mood === 'forest';
    bgDawn.visible = mood === 'dawn'; bgDusk.visible = du; bgForest.visible = fo;
    S.fog.color.set(du ? '#E8824A' : fo ? '#D8DCB8' : '#E8B890'); S.fog.near = fo ? 9 : 14; S.fog.far = fo ? 70 : 120;
    hemi.intensity = du ? .22 : fo ? .8 : .75; hemi.color.set(du ? '#5A5A90' : fo ? '#D8F0D0' : '#CFE0F4'); hemi.groundColor.set(fo ? '#6A7A48' : '#8A6A48');
    sun.intensity = du ? .0 : fo ? 2.6 : (o.sun ?? 3.2); sun.color.set(fo ? '#FFF0C8' : '#FFD9AC'); sun.position.set(...(o.sunAt || (fo ? [3.5, 8, 4.5] : [5.5, 5, 6])));
    rim.intensity = du ? 2.2 : 0;
    sunDisc.material.opacity = du ? .8 : fo ? 0 : .5; sunCore.material.opacity = du ? 1 : fo ? 0 : .55;
    waterM.color.set(du ? '#C8744A' : '#7896A8'); waterM.bumpMap.offset.y = t * .012;
    J.hair(o.hairJ ?? 1); M.hair(o.hairM ?? 0); M.shikha(o.shikha ?? 0);
    J.head.rotation.x = .015 * Math.sin(t * .7); M.head.rotation.x = .012 * Math.sin(t * .6 + 1);
    J.scale.y = 1 + .006 * Math.sin(t * 1.3); M.scale.y = 1 + .006 * Math.sin(t * 1.2 + 2);
    dhuni.set(t, o.fire ?? .0); dhuni.visible = (o.dhuni ?? 1) > 0; tri.visible = (o.tri ?? 1) > 0;
    roots.forEach((r, i) => { r.rotation.z = .012 * Math.sin(t * .8 + i); });
    ram.visible = !!o.ram;
    if (o.ram) {
      const k = clamp(o.milk ?? 0); bead.visible = k > .01; bead.scale.setScalar(.4 + .6 * clamp(k * 6));
      pool.visible = k > .12; pool.scale.set(clamp(k * 1.2, .2, 1), 1, clamp(k * 1.2, .2, 1));
      drops.forEach((d, i) => { const ph = (t * 1.5 + i / 3) % 1; d.visible = k > .06; d.position.set(tipP[0], lerp(tipP[1] - .03, cupY + .04, ph * ph), tipP[2] + .01); });
    }
    comb.visible = (o.comb ?? 0) > .01; comb.scale.setScalar(1.25 * (o.comb ?? 0));
    shafts.visible = fo; if (shafts.set) shafts.set(t);
    if (motes.set) motes.set(t);
  };
  return { S, set, J, M, JP, MP, L1, L2, TX, TZ, CP, tipP, cupY, BX, BZ, sun };
})();
