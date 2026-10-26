// aarti_props.js: what "You've been doing AARTI wrong" (ad 54) builds in the 3D style: a lamp-lit stone sanctum, a black
// stone Vishnu murti in yellow silk (four arms: the chakra and the conch raised, the lower right hand in varada, the
// lower left on the hip; a tall gold kirita, silver eyes, a Vaishnava tilak, a marigold garland) on a granite pitha
// under a gold prabhavali, two standing lamps; the aarti lamp (a five-wick brass pancha-pradip with a handle, its light
// casting the murti's shadow), the gold trails it leaves (one ring a circle, each a little bigger and nearer so the count
// reads), the scribble of "round and round", and 2D counts pinned to the murti.
// Metres; y up; the murti faces east (+x), the devotee looks west. Seen by the devotee, screen right is -z.

const PED = .5;                                    // the pitha's top: the murti's soles
// where the lamp circles: centre height, radius (ry, rz for the whole body), the number of circles, the plane's x
const PARTS = {
  feet: { y: PED + .08, r: .2, n: 4 },
  navel: { y: PED + .99, r: .16, n: 2 },
  face: { y: PED + 1.53, r: .2, n: 3 },
  whole: { y: PED + .98, ry: 1.02, rz: .56, n: 7 },
};
const RX = .4, RSTEP = .03, RGROW = .05;        // the circles' plane (x), and how much nearer and bigger each next circle is

// ---------- materials ----------
const MAT = (() => {
  const std = (col, rough = .6, o = {}) => new THREE.MeshStandardMaterial({ color: col, roughness: rough, ...o });
  return {
    // the murti's body: dark panchaloha bronze, a little worn (lamp light picks out the forms)
    black: new THREE.MeshStandardMaterial({ color: '#6A4428', roughness: .36, metalness: .82, bumpMap: stoneTex({ seed: 11, rows: 1, cols: 1, mottle: .5 }).bump, bumpScale: .12 }),
    lid: new THREE.MeshStandardMaterial({ color: '#2A1A10', roughness: .5, metalness: .4 }),
    gold: metal3('#E0AE52', .26), goldD: metal3('#B8862E', .34), brass: metal3('#C9963E', .3),
    silk: std('#C08418', .5, { emissive: '#2A1604', emissiveIntensity: .15 }), silkR: std('#B0221E', .5),
    white: std('#EDE4D2', .6, { emissive: '#4A463E', emissiveIntensity: .2 }), pupil: std('#0A0808', .3),
    red: std('#C2141E', .45), ruby: std('#D01828', .2, { metalness: .3, emissive: '#400408', emissiveIntensity: .6 }),
    pearl: std('#F2ECE0', .3, { emissive: '#5A564E', emissiveIntensity: .2 }),
    mari: [std('#F29A18', .75), std('#E8641A', .75), std('#F6C228', .75)], rose: std('#B01830', .6), tulsi: std('#3E6A2A', .7),
  };
})();

// ---------- the sanctum ----------
function sanctum3(scene) {
  const G = new THREE.Group(); scene.add(G);
  const wall = stone3({ col: '#4A3F36', seed: 3, rep: [4, 2], mottle: 1.6, speck: .5 });
  const floor = stone3({ col: '#5A5048', rows: 2, cols: 2, seed: 4, rep: [6, 6], mottle: 1.2, bumpK: 2 });
  mesh3(G, new THREE.PlaneGeometry(8, 8), floor, [1.5, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  mesh3(G, new THREE.PlaneGeometry(4.2, 3.4), wall, [-.75, 1.7, 0], { rot: [0, Math.PI / 2, 0], cast: false });          // the back wall
  for (const s of [-1, 1]) mesh3(G, new THREE.PlaneGeometry(6, 3.4), wall, [2, 1.7, s * 1.75], { rot: [0, s > 0 ? Math.PI : 0, 0], cast: false });
  mesh3(G, new THREE.PlaneGeometry(6, 4.2), stone3({ col: '#2E2620', seed: 5, rep: [3, 2] }), [2, 3.4, 0], { rot: [Math.PI / 2, 0, 0], cast: false });
  // a recess in the back wall behind the murti, darker (oil-smoked)
  block3(G, .1, 2.7, 1.9, stone3({ col: '#2A221D', seed: 6, rep: [1, 2], mottle: 2 }), [-.7, .02, 0]);
  // pilasters either side of the recess
  for (const s of [-1, 1]) block3(G, .22, 3.2, .26, stone3({ col: '#5A4E44', seed: 7, rep: [.4, 3] }), [-.62, 0, s * 1.08]);

  // the pitha: a stepped granite base with a lotus course at the top
  const gr = stone3({ col: '#6A5E54', seed: 8, rep: [1.4, .4] }), grD = stone3({ col: '#3A322C', seed: 9, rep: [1, .3] });
  block3(G, .9, .14, 1.15, gr, [0, 0, 0]); block3(G, .8, .2, 1.02, grD, [0, .14, 0]); block3(G, .9, .1, 1.12, gr, [0, .34, 0]);
  const petal = new THREE.SphereGeometry(.05, 10, 6);
  for (let i = 0; i < 26; i++) { const z = lerp(-.52, .52, i / 25); mesh3(G, petal, grD, [.45, .4, z], { scale: [.3, .9, .5] }); }
  block3(G, .86, .06, 1.08, gr, [0, .44, 0]);
  // flowers at the feet: marigolds, roses, tulsi
  const rnd = lcg(9), fl = new THREE.IcosahedronGeometry(.026, 1), lf = new THREE.SphereGeometry(.022, 8, 5);
  for (let i = 0; i < 46; i++) {
    const z = (rnd() - .5) * .95, x = .12 + rnd() * .3; if (Math.abs(z) < .16 && x < .25) continue;
    const r = rnd(), m = r < .55 ? MAT.mari[i % 3] : r < .75 ? MAT.rose : MAT.tulsi;
    mesh3(G, m === MAT.tulsi ? lf : fl, m, [x, PED + .02, z], { scale: m === MAT.tulsi ? [1.4, .25, .7] : 1, rot: [0, rnd() * 3, 0] });
  }

  // the prabhavali: a gold arch over the murti, flames on its rim, on two posts
  const P = new THREE.Group(); P.position.set(-.42, PED, 0); G.add(P);
  const arc = new THREE.TorusGeometry(.62, .028, 8, 64, Math.PI);
  mesh3(P, arc, MAT.gold, [0, 1.42, 0], { rot: [0, Math.PI / 2, 0] });
  mesh3(P, new THREE.TorusGeometry(.7, .016, 6, 64, Math.PI), MAT.goldD, [0, 1.42, 0], { rot: [0, Math.PI / 2, 0] });
  for (const s of [-1, 1]) mesh3(P, new THREE.CylinderGeometry(.03, .035, 1.42, 12), MAT.gold, [0, .71, s * .66]);
  const tip = new THREE.ConeGeometry(.03, .1, 8);
  for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI, y = 1.42 + Math.sin(a) * .74, z = Math.cos(a) * .74; mesh3(P, tip, MAT.gold, [0, y, z], { rot: [-(a - Math.PI / 2), 0, 0] }); }
  mesh3(P, new THREE.SphereGeometry(.06, 16, 10), MAT.gold, [0, 2.2, 0]);   // the kirtimukha's place at the top, a gold boss

  // two standing lamps (kuthuvilakku) before the pitha
  const lampM = MAT.brass, lamps = [];
  for (const s of [-1, 1]) {
    mesh3(G, lathe3(smooth3([[0, 0], [.13, 0], [.13, .03], [.05, .07], [.025, .12], [.025, .82], [.05, .86], [.025, .89], [.1, .93], [.12, .97], [0, .96]], 3), 32), lampM, [.62, 0, s * .78]);
    lamps.push(flame3(G, [.62, 1.0, s * .78], .8, { power: .7, range: 3.2 }));
  }
  // hanging lamps further out, nearer the door
  for (const s of [-1, 1]) {
    mesh3(G, lathe3([[0, 0], [.07, 0], [.1, .03], [.1, .04], [0, .035]], 20), lampM, [1.5, 1.95, s * 1.35]);
    mesh3(G, new THREE.CylinderGeometry(.005, .005, 1.4, 5), metal3('#5A4A3A', .6), [1.5, 2.67, s * 1.35], { cast: false });
    lamps.push(flame3(G, [1.5, 2.0, s * 1.35], .8, { power: .6, range: 3 }));
  }
  return { group: G, lamps, set: (t, on = 1) => lamps.forEach(l => l.set(t, on)) };
}

// ---------- the murti ----------
// a tube along points (an arm, a necklace); r a number or [r0, r1]
function tube3(parent, pts, r, mat, o = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => V3(...p))), geo = new THREE.TubeGeometry(curve, o.segs ?? 24, Array.isArray(r) ? r[0] : r, o.radial ?? 10, false);
  if (Array.isArray(r)) {   // taper: scale each ring of vertices from r0 to r1 about the curve
    const pos = geo.attributes.position, n = (o.segs ?? 24) + 1, rad = (o.radial ?? 10) + 1;
    for (let i = 0; i < n; i++) { const c = curve.getPointAt(i / (n - 1)), k = lerp(1, r[1] / r[0], i / (n - 1)); for (let j = 0; j < rad; j++) { const v = i * rad + j; pos.setXYZ(v, c.x + (pos.getX(v) - c.x) * k, c.y + (pos.getY(v) - c.y) * k, c.z + (pos.getZ(v) - c.z) * k); } }
    geo.computeVertexNormals();
  }
  return mesh3(parent, geo, mat, [0, 0, 0], o);
}
// beads along a curve (a garland, a necklace of pearls)
function beads3(parent, pts, n, size, mats, o = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => V3(...p))), geo = new THREE.IcosahedronGeometry(size, 1);
  for (let i = 0; i < n; i++) { const p = curve.getPointAt(i / (n - 1)); mesh3(parent, geo, mats[i % mats.length], [p.x, p.y, p.z], { cast: o.cast ?? true }); }
}

function murti3(scene) {
  const M = new THREE.Group(); M.position.set(0, PED, 0); scene.add(M);
  const B = MAT.black, sc = (g, s) => { g.scale(...s); return g; };
  // feet, anklets
  for (const s of [-1, 1]) {
    mesh3(M, sc(new THREE.SphereGeometry(.1, 20, 12), [1, .32, .45]), B, [.06, .03, s * .085]);
    mesh3(M, new THREE.SphereGeometry(.045, 12, 8), B, [.0, .07, s * .085]);
    mesh3(M, new THREE.TorusGeometry(.05, .012, 8, 24), MAT.gold, [0, .1, s * .085], { rot: [Math.PI / 2, 0, 0] });
    // the shins up to the silk
    mesh3(M, new THREE.CylinderGeometry(.06, .044, .32, 16), B, [.0, .24, s * .085]);
  }
  // the pitambar: yellow silk from the waist to mid-calf, a red border, the pleats down the front in gold
  const dh = lathe3(smooth3([[.0, .3], [.2, .3], [.22, .34], [.215, .5], [.2, .68], [.175, .86], [.16, .93], [0, .93]], 4), 48);
  mesh3(M, dh, MAT.silk, [0, 0, 0], { scale: [.62, 1, 1] });
  mesh3(M, new THREE.TorusGeometry(.205, .014, 8, 48), MAT.silkR, [0, .32, 0], { rot: [Math.PI / 2, 0, 0], scale: [.62, 1, 1] });
  block3(M, .02, .6, .07, MAT.goldD, [.128, .32, 0]);
  // the torso, the waist band with its clasp
  const tor = lathe3(smooth3([[0, .9], [.15, .9], [.15, .98], [.165, 1.08], [.2, 1.2], [.205, 1.28], [.17, 1.33], [.07, 1.37], [0, 1.37]], 4), 48);
  mesh3(M, tor, B, [0, 0, 0], { scale: [.62, 1, 1] });
  mesh3(M, new THREE.TorusGeometry(.158, .016, 8, 48), MAT.gold, [0, .925, 0], { rot: [Math.PI / 2, 0, 0], scale: [.62, 1, 1] });
  mesh3(M, new THREE.SphereGeometry(.026, 12, 8), MAT.ruby, [.1, .925, 0]);
  mesh3(M, new THREE.TorusGeometry(.012, .004, 6, 16), MAT.gold, [.094, .99, 0], { rot: [0, Math.PI / 2, 0] });     // the navel, a gold ring
  // necklaces: a collar, a long chain with the kaustubha gem, pearls; the sacred thread across
  tube3(M, [[.02, 1.33, .1], [.075, 1.3, .05], [.085, 1.285, 0], [.075, 1.3, -.05], [.02, 1.33, -.1]], .014, MAT.gold, { segs: 20 });
  tube3(M, [[.03, 1.33, .13], [.11, 1.18, .08], [.13, 1.12, 0], [.11, 1.18, -.08], [.03, 1.33, -.13]], .009, MAT.gold, { segs: 24 });
  mesh3(M, new THREE.SphereGeometry(.03, 14, 10), MAT.ruby, [.135, 1.12, 0], { scale: [.6, 1, 1] });
  beads3(M, [[.03, 1.32, .15], [.12, 1.08, .09], [.135, 1.02, 0], [.12, 1.08, -.09], [.03, 1.32, -.15]], 30, .008, [MAT.pearl]);
  tube3(M, [[.02, 1.32, -.16], [.11, 1.16, -.06], [.122, 1.02, .06], [.1, .93, .13]], .005, MAT.white, { segs: 20, cast: false });
  // the garland: marigolds from the shoulders to below the knees
  beads3(M, [[.0, 1.3, .2], [.1, 1.05, .19], [.15, .7, .17], [.17, .44, .1], [.175, .4, 0], [.17, .44, -.1], [.15, .7, -.17], [.1, 1.05, -.19], [.0, 1.3, -.2]], 130, .016, [MAT.mari[0], MAT.mari[2], MAT.mari[1], MAT.mari[0], MAT.mari[2], MAT.rose]);
  // the arms: shoulder → elbow → hand. +z is his right.
  const arm = (pts, r0, r1) => { tube3(M, pts.slice(0, 2), [r0, (r0 + r1) / 2], B, { segs: 8 }); tube3(M, pts.slice(1), [(r0 + r1) / 2, r1], B, { segs: 10 }); };
  const UR = [[0, 1.27, .2], [-.02, 1.18, .32], [.02, 1.42, .36]], UL = UR.map(([x, y, z]) => [x, y, -z]);
  const LR = [[.0, 1.24, .19], [.04, 1.02, .26], [.16, .86, .25]], LL = [[.0, 1.24, -.19], [.02, 1.03, -.26], [.07, .95, -.18]];
  for (const P of [UR, UL, LR, LL]) arm(P, .048, .034);
  // armlets and bracelets
  const ring = (p, r, rot) => mesh3(M, new THREE.TorusGeometry(r, .01, 6, 20), MAT.gold, p, { rot });
  for (const s of [-1, 1]) { ring([-.01, 1.2, s * .28], .045, [0, 0, s * .4]); ring([.015, 1.38, s * .355], .036, [Math.PI / 2, 0, 0]); }
  ring([.13, .885, .255], .034, [0, 0, .9]); ring([.06, .965, -.2], .034, [0, 0, -.6]);
  // hands: the raised two hold the chakra (his right) and the conch (his left); the lower right in varada, open,
  // pointing down to his feet; the lower left resting on the hip
  const hand = (p, s = [1, 1, 1]) => mesh3(M, sc(new THREE.SphereGeometry(.04, 14, 10), s), B, p);
  hand([.02, 1.45, .36], [.7, 1.2, .9]); hand([.02, 1.45, -.36], [.7, 1.2, .9]);
  hand([.18, .83, .25], [1.1, 1.3, .6]); hand([.08, .93, -.17], [.9, .8, 1.1]);
  const chakra = new THREE.Group(); chakra.position.set(.03, 1.56, .37); M.add(chakra);
  mesh3(chakra, new THREE.TorusGeometry(.085, .012, 8, 40), MAT.gold, [0, 0, 0], { rot: [0, Math.PI / 2, 0] });
  mesh3(chakra, new THREE.CylinderGeometry(.022, .022, .016, 16), MAT.gold, [0, 0, 0], { rot: [0, 0, Math.PI / 2] });
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI; mesh3(chakra, new THREE.CylinderGeometry(.004, .004, .16, 5), MAT.gold, [0, 0, 0], { rot: [a, 0, 0], cast: false }); }
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; mesh3(chakra, new THREE.ConeGeometry(.012, .035, 6), MAT.gold, [0, Math.sin(a) * .105, Math.cos(a) * .105], { rot: [-(a - Math.PI / 2), 0, 0], cast: false }); }
  const conch = mesh3(M, lathe3(smooth3([[0, 0], [.02, .01], [.045, .05], [.05, .09], [.035, .13], [.012, .16], [0, .17]], 4), 24), MAT.pearl, [.03, 1.47, -.37], { rot: [.5, 0, .35] });
  mesh3(M, new THREE.TorusGeometry(.047, .007, 6, 20), MAT.gold, [.03, 1.53, -.38], { rot: [Math.PI / 2 + .5, .35, 0] });
  // neck, head, the face: silver eyes, a tilak, ears with gold kundalas
  mesh3(M, new THREE.CylinderGeometry(.055, .065, .1, 16), B, [0, 1.38, 0]);
  const head = new THREE.Group(); head.position.set(0, 1.51, 0); M.add(head);
  // an oval face: the skull, a longer jaw; a straight nose; half-closed eyes under arched brows; full closed lips (no paint)
  // one egg: a sphere stretched tall, tapering below the cheekbones to the chin, the face a little forward
  const hg = new THREE.SphereGeometry(.1, 40, 30), hp = hg.attributes.position;
  for (let i = 0; i < hp.count; i++) {
    let x = hp.getX(i), y = hp.getY(i) * 1.18, z = hp.getZ(i);
    const lo = clamp(-y / .118), k = 1 - .3 * lo * lo;
    x *= .95 * k; z *= .9 * k; if (x > 0) x *= 1 + .08 * (1 - Math.abs(z) / .09);
    hp.setXYZ(i, x, y, z);
  }
  hg.computeVertexNormals(); mesh3(head, hg, B, [0, -.005, 0]);
  const nose = mesh3(head, new THREE.CylinderGeometry(.003, .014, .062, 3), B, [.096, -.004, 0], { rot: [0, 0, -.12] });   // the nose, a ridge
  nose.rotation.order = 'ZYX'; nose.rotation.y = Math.PI;
  mesh3(head, sc(new THREE.SphereGeometry(.011, 10, 8), [1, .7, 1.5]), B, [.1, -.033, 0]);                                  // its tip
  mesh3(head, sc(new THREE.SphereGeometry(.016, 12, 8), [.45, .32, 1.25]), B, [.088, -.06, 0]);                              // the lips
  const eyes = [];
  for (const s of [-1, 1]) {
    // the eyelid: a long almond, swelling forward, with the dark line of the half-closed eye under it
    eyes.push(mesh3(head, sc(new THREE.SphereGeometry(.024, 20, 12), [.42, .42, 1.3]), B, [.078, .026, s * .04], { rot: [0, s * .3, s * -.14] }));
    mesh3(head, sc(new THREE.SphereGeometry(.024, 16, 8), [.2, .1, 1.15]), MAT.lid, [.086, .016, s * .041], { rot: [0, s * .3, s * -.14], cast: false });
    tube3(head, [[.078, .043, s * .012], [.088, .056, s * .04], [.08, .05, s * .068]], .0045, B, { segs: 8, radial: 6, cast: false });   // the brow
  }
  // the urdhva pundra: two white lines rising from the bridge of the nose, joined at the foot, a red line between
  for (const s of [-1, 1]) mesh3(head, new THREE.BoxGeometry(.005, .05, .005), MAT.white, [.094, .085, s * .011], { rot: [0, 0, -.3], cast: false });
  mesh3(head, new THREE.BoxGeometry(.005, .006, .027), MAT.white, [.097, .061, 0], { cast: false });
  mesh3(head, new THREE.BoxGeometry(.005, .045, .006), MAT.red, [.095, .088, 0], { rot: [0, 0, -.3], cast: false });
  for (const s of [-1, 1]) {
    mesh3(head, sc(new THREE.SphereGeometry(.025, 10, 8), [.6, 1.8, .5]), B, [-.005, -.01, s * .095]);                        // long ears
    mesh3(head, new THREE.TorusGeometry(.024, .007, 8, 20), MAT.gold, [.0, -.075, s * .105], { rot: [0, Math.PI / 2, 0] });
    mesh3(head, new THREE.SphereGeometry(.01, 10, 8), MAT.ruby, [.008, -.075, s * .107]);
  }
  // the kirita: a tall gold crown, banded, with rubies
  const kir = lathe3([[0, 0], [.108, 0], [.122, .025], [.108, .045], [.112, .085], [.1, .105], [.103, .145], [.088, .165], [.091, .205], [.075, .225], [.077, .265], [.06, .285], [.062, .32], [.044, .34], [.045, .375], [.028, .395], [.036, .42], [.02, .46], [.008, .5], [0, .52]], 64);
  mesh3(head, kir, MAT.gold, [0, .09, 0]);
  for (const [y, r] of [[.165, .09], [.285, .062]]) for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; mesh3(head, new THREE.SphereGeometry(.009, 8, 6), MAT.ruby, [Math.cos(a) * r, .09 + y + .015, Math.sin(a) * r]); }
  mesh3(head, new THREE.SphereGeometry(.018, 12, 8), MAT.ruby, [.112, .14, 0], { scale: [.6, 1, 1] });
  // the crown's front plate (a flat gold leaf standing over the brow)
  mesh3(head, sc(new THREE.SphereGeometry(.06, 16, 10), [.12, 1.1, 1]), MAT.gold, [.1, .145, 0]);
  // a fan of gold at the crown's front, behind the ears
  for (const s of [-1, 1]) mesh3(head, sc(new THREE.SphereGeometry(.055, 16, 10), [.15, 1.1, .8]), MAT.goldD, [-.035, .07, s * .1]);
  return { group: M, chakra, eyes, head };
}

// ---------- the aarti lamp ----------
// a five-wick pancha-pradip: a small brass dish on a stem, five cups on top (one in the middle, four round it), a long
// handle out toward the devotee. Its point light casts shadows (the murti's shadow swings on the wall as it circles).
function aartiLamp3(scene) {
  const G = new THREE.Group(); G.scale.setScalar(.8); scene.add(G);
  mesh3(G, lathe3(smooth3([[0, -.09], [.035, -.09], [.04, -.08], [.016, -.05], [.014, -.02], [.06, -.005], [.075, .005], [.07, .012], [0, .01]], 3), 32), MAT.brass, [0, 0, 0], { cast: false });
  tube3(G, [[.02, -.04, 0], [.14, -.1, 0], [.3, -.2, 0]], .009, MAT.brass, { segs: 10, cast: false });
  const cups = [[0, 0], [.04, 0], [-.04, 0], [0, .04], [0, -.04]], fl = [];
  const cup = lathe3([[0, 0], [.012, 0], [.018, .008], [.02, .016], [0, .014]], 16);
  cups.forEach(([x, z], i) => { mesh3(G, cup, MAT.brass, [x, .012, z], { cast: false }); fl.push(flame3(G, [x, .03, z], .85, { light: false, seed: i * 3.7 })); });
  const light = new THREE.PointLight('#FFA24A', 0, 5.5, 1.5); light.position.set(0, .08, 0);
  light.castShadow = true; light.shadow.mapSize.set(1024, 1024); light.shadow.bias = -.003; light.shadow.radius = 5; light.shadow.camera.near = .05;
  G.add(light);
  const halo = glow3(G, [0, .07, 0], .4, '#FFB050', .4);
  // place(p, t, o): the flames' centre at p; o.wicks how many are lit (0..5, in the order the cups are listed), o.on
  const place = (p, t, o = {}) => {
    G.position.set(...p); const n = o.wicks ?? 5, on = o.on ?? 1; G.visible = on > .001;
    fl.forEach((f, i) => f.set(t, clamp(n - i) * on));
    const k = Math.min(n, 5) / 5;
    light.intensity = (o.power ?? 5) * on * (.4 + .6 * k) * (.9 + .1 * vnoise(t * 8, 4));
    halo.material.opacity = .35 * on * (.3 + .7 * k); halo.scale.setScalar(.5 + .2 * k);
  };
  return { group: G, light, place };
}

// ---------- the trails ----------
// a point on circle k of a part at progress p (0..1, clockwise as the devotee sees it, from the bottom)
function circleAt(part, k, p) {
  const P = PARTS[part], ry = (P.ry ?? P.r) * (1 + k * RGROW), rz = (P.rz ?? P.r) * (1 + k * RGROW), th = -Math.PI / 2 - p * TAU;
  return [RX + k * RSTEP, P.y + Math.sin(th) * ry, -Math.cos(th) * rz];
}
// a glowing gold ribbon along points: a hot core and a soft wide halo, revealed along its length with .set(p, a)
function glowTube3(parent, pts, o = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => V3(...p)), !!o.closed), n = o.segs ?? 120;
  const mk = (r, col, a) => {
    const geo = new THREE.TubeGeometry(curve, n, r, 6, false);
    const m = mesh3(parent, geo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: a, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }), [0, 0, 0], { cast: false, receive: false });
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
  for (const id in PARTS) R[id] = Array.from({ length: PARTS[id].n }, (_, k) => glowTube3(parent, Array.from({ length: 73 }, (_, i) => circleAt(id, k, i / 72)), { segs: id === 'whole' ? 160 : 96, r: id === 'whole' ? .009 : .006 }));
  return R;
}
// "round and round": loops all over the murti, any height, any way
const SCRIB = { len: 9, pt: s => [RX + .05 + .04 * Math.sin(s * 3.1), PED + 1.1 + .55 * Math.sin(s * 1.27 + .4) + .18 * Math.sin(s * 4.6), .36 * Math.cos(s * 2.2) + .12 * Math.sin(s * 5.3 + 1)] };
const scribble3 = parent => glowTube3(parent, Array.from({ length: 361 }, (_, i) => SCRIB.pt(i / 360 * SCRIB.len * TAU / 2)), { segs: 600, r: .006, col: '#FF7A3A' });

// ---------- 2D on top ----------
// a count or a word pinned beside a world point: pops at `at`; o.dx, o.dy screen px offsets
function pinCount(c, txt, p, t, at, o = {}) {
  if (t < at) return;
  const [x, y, z] = toScreen3(p); if (z > 1) return;
  text(c, txt, x + (o.dx ?? 0), y + (o.dy ?? 0), `700 ${o.size || 84}px Cinzel`, o.col || '#FFE2A0', { pop: o.noPop ? null : t - at, alpha: o.alpha ?? 1, glow: ['rgba(10,6,4,.95)', 24], spacing: o.spacing || 0 });
}
// a small label (FEET, NAVEL, FACE) under a count
function pinLabel(c, txt, p, t, at, o = {}) {
  if (t < at) return;
  const [x, y, z] = toScreen3(p); if (z > 1) return;
  text(c, txt, x + (o.dx ?? 0), y + (o.dy ?? 0), `700 ${o.size || 34}px Cinzel`, o.col || '#F4C46A', { pop: t - at, alpha: o.alpha ?? 1, glow: ['rgba(10,6,4,.95)', 18], spacing: 3 });
}
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
