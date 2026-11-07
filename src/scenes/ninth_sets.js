// ninth_sets.js: the set of "The 9th avatar" (ad 81): a dark stone hall with a round pool in the middle and ten stone
// seats in a ring round it, one per avatar, each with a bronze emblem, a numbered plaque, a diya and a downlight; the
// three candidates for the last two seats (Krishna's flute and feather, Balaram's plough, the seated Buddha); the swan
// of the Mahabharata's list; an outer ring of 22 seats (the Bhagavata's list); streams of light running out of the pool
// and lamps to the horizon (the avatars are countless). 1 unit = 1 m; the pool at the origin; seats 8 and 9 to the north.

const EK = 1.45;   // every emblem's scale
const HALL = (() => {
  const S = new THREE.Scene();
  S.fog = new THREE.Fog('#07060A', 9, 34);
  backdrop3(S, '#050408', '#0B080C', '#050405', 200);
  const hemi = new THREE.HemisphereLight('#6A5A78', '#1A120C', .22); S.add(hemi);
  // the bronze, the stone (matte: owner, 30 Oct)
  const BR = new THREE.MeshStandardMaterial({ color: '#B98443', metalness: .6, roughness: .44, envMapIntensity: .6 });
  const BRD = new THREE.MeshStandardMaterial({ color: '#6E4A26', metalness: .55, roughness: .5, envMapIntensity: .5 });
  const IVORY = std3('#EDE2C8', .45, { envMapIntensity: .5 });
  const MARBLE = std3('#F2EEE6', .38, { envMapIntensity: .6 });
  const SEAT = stone3({ col: '#4A433E', dark: '#1A1614', rows: 1, cols: 1, speck: .8, mottle: .7, seed: 3, rep: [1, 1], rough: .7, bumpK: 1.2 });
  const FLOOR = stone3({ col: '#2E2926', dark: '#100D0C', joint: 'rgba(8,6,5,.9)', rows: 2, cols: 2, speck: .7, mottle: .8, seed: 8, rep: [22, 22], rough: .34, bumpK: .5 });
  FLOOR.envMapIntensity = .7;

  // ---------- small builders ----------
  const G = (parent) => { const g = new THREE.Group(); (parent || S).add(g); return g; };
  const ell = (p, sx, sy, sz, mat, pos, rot) => mesh3(p, new THREE.SphereGeometry(1, 32, 20), mat, pos, { scale: [sx, sy, sz], rot });
  const cyl = (p, r0, r1, h, mat, pos, rot, segs = 24) => mesh3(p, new THREE.CylinderGeometry(r0, r1, h, segs), mat, pos, { rot });
  // an extruded flat shape from points [[x, y], ...] (in the xy plane, centred on z)
  const ext = (p, pts, depth, mat, pos, rot, bevel = .006) => {
    const sh = new THREE.Shape(); pts.forEach(([x, y], i) => i ? sh.lineTo(x, y) : sh.moveTo(x, y)); sh.closePath();
    const geo = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 12 });
    geo.translate(0, 0, -depth / 2); return mesh3(p, geo, mat, pos, { rot });
  };
  // a smooth closed outline through points (for blades, fins)
  const outline = (P, n = 8) => through(P.concat([P[0]]), n);
  // the round bronze foot every emblem stands on
  const foot = (g) => mesh3(g, lathe3([[0, 0], [.17, 0], [.18, .015], [.165, .03], [.12, .045], [.11, .055], [0, .055]], 48), BRD, [0, 0, 0]);

  // ---------- the emblems (each about .5–.6 m tall, standing at y 0, its face toward +z) ----------
  const E = {};
  // 1 MATSYA: a leaping fish on a rod
  E.matsya = (() => { const g = G(); foot(g); cyl(g, .012, .012, .2, BRD, [0, .15, 0]);
    const f = G(g); f.position.set(0, .33, 0); f.rotation.z = .45;
    mesh3(f, lathe3([[0, -.2], [.035, -.17], [.07, -.1], [.085, -.02], [.075, .06], [.05, .13], [.02, .175], [0, .19]], 32), BR, [0, 0, 0], { rot: [0, 0, -Math.PI / 2], scale: [1, 1, .62] });
    ext(f, outline([[-.17, 0], [-.3, .11], [-.27, 0], [-.3, -.11]], 4), .012, BR, [0, 0, 0]);
    ext(f, outline([[-.06, .07], [.0, .13], [.07, .07]], 4), .01, BR, [0, 0, 0]);
    ext(f, outline([[-.02, -.06], [.02, -.1], [.05, -.055]], 4), .01, BR, [0, 0, 0]);
    [-1, 1].forEach(s => ell(f, .012, .012, .008, BRD, [.13, .02, s * .045]));
    return g; })();
  // 2 KURMA: a tortoise, its shell domed and plated
  const shellBump = tex3('kurmaShell', 256, 256, (g, w, h) => { g.fillStyle = '#909090'; g.fillRect(0, 0, w, h); g.strokeStyle = '#303030'; g.lineWidth = 6;
    const r = 34; for (let row = -1; row < 6; row++) for (let col = -1; col < 6; col++) { const x = col * r * 1.5, y = row * r * 1.732 + (col % 2 ? r * .866 : 0); g.beginPath(); for (let k = 0; k <= 6; k++) { const a = k * Math.PI / 3; g.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)); } g.stroke(); } }, { data: true });
  const SHELL = BR.clone(); SHELL.bumpMap = shellBump.rep(2, 1); SHELL.bumpScale = 3;
  E.kurma = (() => { const g = G(); foot(g);
    mesh3(g, new THREE.SphereGeometry(1, 40, 20, 0, TAU, 0, Math.PI / 2), SHELL, [0, .1, 0], { scale: [.2, .15, .14] });
    ell(g, .2, .025, .14, BRD, [0, .1, 0]);
    ell(g, .055, .045, .045, BR, [.25, .14, 0]); cyl(g, .03, .035, .08, BR, [.2, .12, 0], [0, 0, 1.2]);
    [[.13, .09], [.13, -.09], [-.12, .09], [-.12, -.09]].forEach(([x, z]) => ell(g, .06, .02, .035, BR, [x, .08, z], [0, Math.sign(z) * .5, 0]));
    ell(g, .04, .015, .015, BR, [-.21, .09, 0]);
    return g; })();
  // 3 VARAHA: the earth held up on a tusk
  const earthTex = tex3('varahaEarth', 512, 256, (g, w, h) => { g.fillStyle = '#2C5A6E'; g.fillRect(0, 0, w, h); const r = lcg(12);
    for (let i = 0; i < 26; i++) { const x = r() * w, y = 40 + r() * (h - 80), s = 14 + r() * 40; g.fillStyle = r() < .6 ? '#5E7A44' : '#8A7A50'; g.beginPath(); for (let k = 0; k < 14; k++) { const a = k / 14 * TAU, rr = s * (.6 + .5 * r()); g.lineTo(x + Math.cos(a) * rr * 1.4, y + Math.sin(a) * rr); } g.fill(); }
    g.fillStyle = 'rgba(230,240,240,.7)'; g.fillRect(0, 0, w, 14); g.fillRect(0, h - 14, w, 14); });
  E.varaha = (() => { const g = G(); foot(g);
    tubeP3(g, [[-.02, .05, 0], [.05, .2, 0], [.04, .33, 0], [-.03, .41, 0]], [.04, .01], IVORY, { segs: 32 });
    mesh3(g, new THREE.SphereGeometry(.12, 40, 24), std3('#FFFFFF', .55, { map: earthTex, envMapIntensity: .4 }), [-.03, .52, 0]);
    return g; })();
  // 4 NARASIMHA: the pillar split open, light inside
  E.narasimha = (() => { const g = G(); foot(g);
    [-1, 1].forEach(s => { const half = mesh3(g, new THREE.CylinderGeometry(.085, .095, .46, 18, 1, false, s > 0 ? 0 : Math.PI, Math.PI), BR, [s * .03, .29, 0], { rot: [0, 0, -s * .09] });
      ext(g, [[-.11, 0], [.11, 0], [.11, .025], [-.11, .025]], .02, BRD, [s * .015, .51, 0], [0, 0, -s * .09], .004); half.userData.s = s; });
    const core = mesh3(g, new THREE.BoxGeometry(.03, .4, .12), new THREE.MeshBasicMaterial({ color: '#FFB050' }), [0, .3, 0], { cast: false });
    const gl = glow3(g, [0, .3, .05], .7, '#FF9A3C', .55);
    g.userData.glow = (k) => { core.material.color.setScalar(1).multiply(new THREE.Color('#FFB050')).multiplyScalar(k); gl.material.opacity = .55 * k; };
    return g; })();
  // 5 VAMANA: the parasol and the water pot
  E.vamana = (() => { const g = G(); foot(g);
    cyl(g, .01, .01, .5, BRD, [-.03, .3, 0]);
    mesh3(g, new THREE.SphereGeometry(.2, 40, 12, 0, TAU, 0, 1.0), BR, [-.03, .4, 0], { scale: [1, .55, 1] });
    mesh3(g, new THREE.TorusGeometry(.168, .008, 8, 48), BRD, [-.03, .5, 0], { rot: [Math.PI / 2, 0, 0] });
    mesh3(g, lathe3([[0, 0], [.04, 0], [.07, .04], [.072, .08], [.05, .11], [.02, .13], [.022, .16], [0, .16]], 32), BR, [.11, .055, .04]);
    tubeP3(g, [[.17, .13, .04], [.2, .16, .04], [.22, .17, .04]], [.01, .005], BR, { segs: 8 });
    return g; })();
  // 6 PARASHURAMA: the axe
  E.parashu = (() => { const g = G(); foot(g);
    cyl(g, .016, .018, .56, std3('#5A3A22', .7), [0, .33, 0]);
    ext(g, outline([[.0, .06], [.12, .1], [.2, .13], [.17, 0], [.2, -.13], [.12, -.1], [.0, -.06]], 6), .02, BR, [.01, .5, 0]);
    cyl(g, .024, .024, .05, BRD, [0, .5, 0]); mesh3(g, new THREE.SphereGeometry(.022, 16, 12), BRD, [0, .61, 0]);
    return g; })();
  // 7 RAMA: the bow and an arrow
  E.rama = (() => { const g = G(); foot(g);
    const mid = [-.13, .34, 0];
    tubeP3(g, [mid, [-.11, .48, 0], [-.04, .6, 0], [.0, .64, 0], [.02, .66, 0]], [.018, .007], BR, { segs: 24 });
    tubeP3(g, [mid, [-.11, .2, 0], [-.04, .08, 0], [.0, .05, 0], [.02, .04, 0]], [.018, .007], BR, { segs: 24 });
    cyl(g, .003, .003, .6, IVORY, [.015, .35, 0], [0, 0, .01], 6);
    cyl(g, .006, .006, .42, std3('#5A3A22', .7), [.07, .34, .02], [0, 0, Math.PI / 2], 8);
    mesh3(g, new THREE.ConeGeometry(.018, .06, 12), BR, [-.17, .34, .02], { rot: [0, 0, Math.PI / 2] });
    [-1, 1].forEach(s => ext(g, [[.0, 0], [.07, 0], [.09, s * .03], [.02, s * .03]], .004, IVORY, [.2, .34, .02], undefined, .002));
    return g; })();
  // KRISHNA: the flute and a peacock feather
  const featherTex = tex3('peacock', 128, 512, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    // barbs: fine green-gold strokes off the quill
    for (let y = 60; y < h - 20; y += 3) { const half = 52 * Math.sin(Math.PI * Math.min(1, (y - 40) / (h - 60))) + 8; g.strokeStyle = `rgba(${90 + (y % 7) * 6},${150 + (y % 5) * 8},${70},.55)`; g.lineWidth = 1.4;
      g.beginPath(); g.moveTo(64, y); g.quadraticCurveTo(64 - half * .6, y - 6, 64 - half, y - 16); g.moveTo(64, y); g.quadraticCurveTo(64 + half * .6, y - 6, 64 + half, y - 16); g.stroke(); }
    // the eye
    const ey = 120; [[48, 36, '#2E8A4A'], [40, 30, '#C8A030'], [32, 25, '#3A2A10'], [26, 20, '#1A7A8A'], [17, 14, '#0E3A7A'], [9, 8, '#06103A']].forEach(([rx, ry, col]) => { g.fillStyle = col; g.beginPath(); g.ellipse(64, ey, rx * .9, ry * 1.25, 0, 0, TAU); g.fill(); });
    g.strokeStyle = '#D8C88A'; g.lineWidth = 3; g.beginPath(); g.moveTo(64, 150); g.lineTo(64, h); g.stroke();
  });
  E.krishna = (() => { const g = G(); foot(g);
    const fl = G(g); fl.position.set(0, .32, .02); fl.rotation.z = -1.05;
    cyl(fl, .016, .016, .6, std3('#C9A25A', .45, { metalness: .3, envMapIntensity: .5 }), [0, 0, 0]);
    [-.27, -.2, .2, .27].forEach(y => mesh3(fl, new THREE.TorusGeometry(.017, .004, 8, 24), BRD, [0, y, 0], { rot: [Math.PI / 2, 0, 0] }));
    for (let k = 0; k < 6; k++) cyl(fl, .005, .005, .004, std3('#1A120A', .9), [0, -.12 + k * .05, .015], [Math.PI / 2, 0, 0], 10);
    const fe = mesh3(g, new THREE.PlaneGeometry(.17, .62, 1, 8), new THREE.MeshStandardMaterial({ map: featherTex, transparent: true, alphaTest: .25, side: THREE.DoubleSide, roughness: .5, metalness: .1, emissive: '#1A3A2A', emissiveIntensity: .25, envMapIntensity: .5 }), [-.03, .36, -.03], { rot: [0, 0, .32], cast: true, receive: false });
    { const p = fe.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, -.06 * Math.pow((p.getY(i) + .31) / .62, 2)); fe.geometry.computeVertexNormals(); }
    cyl(g, .012, .012, .14, BRD, [0, .11, 0]);
    return g; })();
  // BALARAM: his plough (hala) in side view, the classic Indian "hal": the iron share biting the ground, the long beam
  // running forward low to the yoke peg, the handle angled back with its grip; his club (musala) standing behind it
  const WOOD = std3('#7A4E2C', .6, { envMapIntensity: .3 });
  E.balaram = (() => { const g = G(); foot(g);
    // the club: a long pestle-club, bronze-capped and banded, leaning back behind the plough
    const m = G(g); m.position.set(-.02, .05, -.08); m.rotation.z = .32;
    cyl(m, .026, .03, .5, WOOD, [0, .27, 0]);
    mesh3(m, lathe3([[0, 0], [.036, 0], [.042, .03], [.042, .1], [.036, .13], [0, .14]], 24), BR, [0, .5, 0]);
    mesh3(m, lathe3([[0, 0], [.034, 0], [.036, .05], [0, .06]], 24), BR, [0, .02, 0]);
    [.16, .3, .44].forEach(y => mesh3(m, new THREE.TorusGeometry(.03, .007, 8, 24), BR, [0, y, 0], { rot: [Math.PI / 2, 0, 0] }));
    // the plough, in front
    const p = G(g); p.position.set(.07, .055, .05); p.scale.set(-.8, .8, .8);   // mirrored: the beam points away from its neighbour
    ext(p, outline([[-.1, .0], [.12, .0], [.24, .015], [.13, .055], [-.1, .06]], 5), .07, BR, [0, 0, 0]);                 // the sole and its iron share, pointing forward
    tubeP3(p, [[-.07, .05, 0], [-.14, .14, 0], [-.22, .25, 0], [-.27, .31, 0]], [.022, .017], WOOD, { segs: 20 });        // the handle, angled back
    cyl(p, .014, .014, .14, BRD, [-.275, .315, 0], [Math.PI / 2, 0, 0], 10);                                                 // its grip
    cyl(p, .02, .02, .14, WOOD, [-.02, .1, 0], [0, 0, .25], 12);                                                             // the upright joining sole and beam
    tubeP3(p, [[-.05, .16, 0], [.12, .175, 0], [.3, .2, 0], [.44, .23, 0]], [.021, .016], WOOD, { segs: 24 });            // the beam, long and low
    mesh3(p, new THREE.BoxGeometry(.035, .035, .22), BRD, [.45, .235, 0]);                                                  // the yoke peg
    [[-.13, .13], [.08, .17], [.3, .2]].forEach(([x, y]) => mesh3(p, new THREE.TorusGeometry(.024, .006, 8, 20), BR, [x, y, 0], { rot: [Math.PI / 2, 0, 0] }));
    return g; })();
  // BUDDHA: seated in meditation, hands in his lap
  const curls = tex3('curls', 256, 256, (g, w, h) => { g.fillStyle = '#707070'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 12) for (let x = (y / 12) % 2 ? 6 : 0; x < w; x += 12) { const gr = g.createRadialGradient(x, y, 0, x, y, 6); gr.addColorStop(0, '#E0E0E0'); gr.addColorStop(1, '#404040'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, 6, 0, TAU); g.fill(); } }, { data: true });
  E.buddha = (() => { const g = G(); foot(g);
    const b = G(g); b.position.set(0, .05, 0); b.scale.setScalar(1.12);
    mesh3(b, lathe3([[0, 0], [.16, 0], [.165, .02], [.15, .035], [0, .035]], 48), BRD, [0, 0, 0]);                       // the cushion
    for (let k = 0; k < 14; k++) { const a = k / 14 * TAU; ell(b, .035, .02, .05, BR, [Math.sin(a) * .15, .02, Math.cos(a) * .15], [0, a, .3]); }   // petals
    ell(b, .16, .055, .1, BR, [0, .085, .01]);                                                                              // the crossed legs
    [-1, 1].forEach(s => ell(b, .045, .03, .04, BR, [s * .08, .1, .085]));                                                  // the soles, up
    mesh3(b, lathe3([[0, 0], [.085, 0], [.092, .05], [.085, .1], [.095, .15], [.08, .175], [.04, .19], [0, .19]], 40), BR, [0, .11, 0], { scale: [1, 1, .7] });   // the body
    cyl(b, .028, .03, .04, BR, [0, .31, 0]);                                                                                // the neck
    const headM = BR.clone(); headM.bumpMap = curls.rep(4, 3); headM.bumpScale = 1.5;
    ell(b, .052, .062, .056, BR, [0, .37, .004]);                                                                           // the face
    mesh3(b, new THREE.SphereGeometry(.055, 32, 16, 0, TAU, 0, 1.5), headM, [0, .38, -.004], { scale: [1, 1.02, 1] });        // the curls
    mesh3(b, new THREE.SphereGeometry(.026, 20, 12), headM, [0, .435, -.004]);                                               // the ushnisha
    [-1, 1].forEach(s => ell(b, .01, .036, .016, BR, [s * .053, .35, -.005]));                                               // the long ears
    [-1, 1].forEach(s => { ell(b, .018, .003, .006, BRD, [s * .02, .374, .052], [0, 0, s * .1]); });                         // eyes closed
    [-1, 1].forEach(s => tubeP3(b, [[s * .08, .28, 0], [s * .1, .21, .02], [s * .09, .15, .06], [s * .03, .135, .085]], .024, BR, { segs: 16 }));   // the arms
    ell(b, .065, .018, .04, BR, [0, .135, .08]);                                                                            // the hands in the lap
    mesh3(b, new THREE.TorusGeometry(.12, .006, 8, 64), BRD, [0, .37, -.06]);                                               // the halo
    return g; })();
  // 10 KALKI: the sword, point up
  E.kalki = (() => { const g = G(); foot(g);
    mesh3(g, new THREE.SphereGeometry(.024, 16, 12), BRD, [0, .075, 0]);
    cyl(g, .016, .016, .09, std3('#3A2414', .7), [0, .13, 0]);
    mesh3(g, new THREE.BoxGeometry(.16, .022, .04), BR, [0, .185, 0]);
    ext(g, outline([[-.022, .19], [.022, .19], [.03, .45], [.05, .58], [0, .66], [-.03, .56], [-.028, .45]], 6), .012, std3('#C8C2B4', .3, { metalness: .7, envMapIntensity: .6 }), [0, 0, 0], undefined, .004);
    return g; })();
  // the HAMSA: a swan (white marble) for the Mahabharata's list
  E.hamsa = (() => { const g = G(); g.scale.setScalar(1.5);
    ell(g, .2, .085, .1, MARBLE, [0, .06, 0]);
    ext(g, outline([[-.16, .05], [-.27, .14], [-.2, .06]], 4), .03, MARBLE, [0, 0, 0]);
    [-1, 1].forEach(s => ell(g, .15, .05, .03, MARBLE, [-.03, .11, s * .075], [s * .2, 0, .25]));
    tubeP3(g, [[.13, .08, 0], [.19, .2, 0], [.15, .32, 0], [.19, .4, 0]], [.035, .02], MARBLE, { segs: 24 });
    ell(g, .042, .032, .028, MARBLE, [.21, .41, 0]);
    mesh3(g, new THREE.ConeGeometry(.014, .06, 12), std3('#D89A3A', .5), [.27, .4, 0], { rot: [0, 0, -Math.PI / 2 - .2] });
    [-1, 1].forEach(s => ell(g, .006, .006, .004, std3('#101010', .4), [.225, .42, s * .024]));
    return g; })();

  // ---------- the hall: floor, pool, pillars ----------
  mesh3(S, new THREE.CircleGeometry(160, 96), FLOOR, [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const POOL_R = 1.15;
  mesh3(S, lathe3([[POOL_R, 0], [POOL_R + .3, 0], [POOL_R + .3, .16], [POOL_R + .22, .22], [POOL_R + .05, .22], [POOL_R, .17], [POOL_R, .05], [0, .05]], 72), SEAT, [0, 0, 0]);
  const WATER = new THREE.MeshStandardMaterial({ color: '#06121A', roughness: .05, metalness: .3, envMapIntensity: 1.1 });
  const water = mesh3(S, new THREE.CircleGeometry(POOL_R, 72), WATER, [0, .13, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const poolGlow = mesh3(S, new THREE.CircleGeometry(POOL_R, 72), new THREE.MeshBasicMaterial({ map: glowTex3(), color: '#FFC870', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), [0, .135, 0], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false });
  const PIL = stone3({ col: '#3E3834', dark: '#141110', rows: 6, cols: 1, seed: 5, rep: [2, 3], rough: .8 });
  for (let k = 0; k < 18; k++) { const a = (k + .5) / 18 * TAU, r = 8.4; const p = G(); p.position.set(r * Math.sin(a), 0, -r * Math.cos(a));
    cyl(p, .36, .4, 6.4, PIL, [0, 3.2, 0]); block3(p, 1, .4, 1, PIL, [0, 0, 0]); block3(p, 1, .3, 1, PIL, [0, 6.2, 0]); }

  // ---------- the ten seats ----------
  const R = 3.0, TOP = 1.07;
  const ang = (i) => (90 + 36 * (i - 1)) * Math.PI / 180;            // seat i (1..10): 8 at -18°, 9 at +18° (north)
  const seatPos = (i, y = 0, r = R) => [r * Math.sin(ang(i)), y, -r * Math.cos(ang(i))];
  const NUMTEX = [];   // built on the first frame (fonts)
  const seats = [];
  for (let i = 1; i <= 10; i++) {
    const g = G(); g.position.set(...seatPos(i)); g.rotation.y = -ang(i);    // its front (+z) faces the pool
    block3(g, .9, .16, .9, SEAT, [0, 0, 0]); block3(g, .66, .76, .66, SEAT, [0, .16, 0]); block3(g, .8, .07, .8, SEAT, [0, .92, 0]); block3(g, .72, .08, .72, SEAT, [0, .99, 0]);
    const plaque = mesh3(g, new THREE.PlaneGeometry(.42, .42), new THREE.MeshStandardMaterial({ transparent: true, color: '#E8B860', emissive: '#FFB040', emissiveIntensity: 0, roughness: .5, metalness: .5, depthWrite: false }), [0, .55, .335], { cast: false, receive: false });
    plaque.visible = false;
    const lampY = 0, lamp = G(g); lamp.position.set(0, .16, .52);
    mesh3(lamp, lathe3([[0, 0], [.05, 0], [.07, .02], [.075, .035], [0, .025]], 24), std3('#8A4A26', .8), [0, 0, 0]);
    const fl = flame3(lamp, [.0, .035, .0], 1, { power: 1.4, range: 3 });
    const spot = new THREE.SpotLight('#FFE2B8', 0, 5.2, .27, .7, 1.6);
    const sp = seatPos(i, 0, R * .5); spot.position.set(sp[0], 4.6, sp[2]); spot.target.position.set(...seatPos(i, TOP + .3)); S.add(spot, spot.target);
    if (i === 8 || i === 9) { spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -.0008; spot.shadow.radius = 4; }
    seats.push({ i, g, plaque, fl, spot });
  }
  const seatEmblem = { 1: E.matsya, 2: E.kurma, 3: E.varaha, 4: E.narasimha, 5: E.vamana, 6: E.parashu, 7: E.rama, 10: E.kalki };
  const NAMES = { 1: 'MATSYA', 2: 'KURMA', 3: 'VARAHA', 4: 'NARASIMHA', 5: 'VAMANA', 6: 'PARASHURAM', 7: 'RAM', 10: 'KALKI' };

  // ---------- the outer ring of 22 (the Bhagavata's list) ----------
  const R22 = 4.9, TOP22 = 2.1, ang22 = (k) => (-(k - 20) * 360 / 22) * -Math.PI / 180;   // 20 due north, numbers running clockwise
  const pos22 = (k, y = 0) => [R22 * Math.sin(ang22(k)), y, -R22 * Math.cos(ang22(k))];
  const outerL = [19, 20, 21].map(k => { const L = new THREE.PointLight('#FFD9A8', 0, 4.5, 1.6); const p = pos22(k, 0), r = 1 - 1.6 / R22; L.position.set(p[0] * r, 3.6, p[2] * r); S.add(L); return L; });
  const outer = [];
  for (let k = 1; k <= 22; k++) {
    const g = G(); g.position.set(...pos22(k)); g.rotation.y = -ang22(k);
    block3(g, .66, .14, .66, SEAT, [0, 0, 0]); block3(g, .48, TOP22 - .22, .48, SEAT, [0, .14, 0]); block3(g, .6, .08, .6, SEAT, [0, TOP22 - .08, 0]);
    const orb = glow3(g, [0, TOP22 + .3, 0], .6, '#FFD48A', 0), core = glow3(g, [0, TOP22 + .3, 0], .18, '#FFF4DC', 0);
    outer.push({ k, g, orb, core });
  }

  // ---------- light falling from the flute to all ten (Jaydev: Krishna takes every form) ----------
  const beamM = new THREE.MeshBasicMaterial({ color: '#FFD890', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  const SKY = [0, 4.1, 0];
  const beams = seats.map(s => { const to = V3(...seatPos(s.i, TOP + .35)), from = V3(...SKY), len = from.distanceTo(to);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(.012, .05, len, 8, 1, true), beamM); m.position.copy(from).add(to).multiplyScalar(.5);
    m.quaternion.setFromUnitVectors(V3(0, 1, 0), from.clone().sub(to).normalize()); m.userData = { len }; S.add(m); return m; });
  const skyGlow = glow3(S, SKY, 1.3, '#FFD890', 0), skyCore = glow3(S, SKY, .35, '#FFFFFF', 0);

  // ---------- countless: streams of light out of the pool, lamps to the horizon ----------
  const streams = [];
  for (let k = 0; k < 20; k++) { const a = (k + .5) / 20 * TAU, rr = lcg(30 + k), pts = [];
    for (let s = 0; s <= 24; s++) { const d = POOL_R * .6 + s * s * .26, w = .5 * Math.sin(s * .7 + k) * Math.min(1, s / 6); pts.push([d * Math.sin(a) + w * Math.cos(a), s ? .03 : .14, -d * Math.cos(a) + w * Math.sin(a)]); }
    const st = stream3(S, pts, .07, { col: '#FFE2A0', glow: '#E0901C', opacity: .9, speed: 1.6, segs: 160, rep: 30 }); st.material.fog = false; streams.push(st); }
  const NL = 7000, lampPos = new Float32Array(NL * 3), lampR = [];
  { const r = lcg(77); const pts = []; for (let n = 0; n < NL; n++) { const d = 10 + Math.pow(r(), 1.6) * 150, a = r() * TAU; pts.push([d * Math.sin(a), .05, -d * Math.cos(a), d]); }
    pts.sort((p, q) => p[3] - q[3]); pts.forEach((p, n) => { lampPos.set(p.slice(0, 3), n * 3); lampR.push(p[3]); }); }
  const lampGeo = new THREE.BufferGeometry(); lampGeo.setAttribute('position', new THREE.BufferAttribute(lampPos, 3));
  const lamps = new THREE.Points(lampGeo, new THREE.PointsMaterial({ map: glowTex3(), color: '#FFC870', size: .9, sizeAttenuation: true, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  lamps.frustumCulled = false; S.add(lamps);

  // ---------- fight sparks ----------
  const sparks = [...Array(36)].map((_, n) => { const r = lcg(400 + n); const s = glow3(S, [0, 0, 0], .08, n % 3 ? '#FFD070' : '#FF7A3A', 0); s.userData = { v: [(r() - .5) * 3, r() * 2.2 + .3, (r() - .5) * 3], d: .25 + r() * .5 }; return s; });

  // ---------- per frame ----------
  const cand = { krishna: E.krishna, balaram: E.balaram, buddha: E.buddha };
  // set(t, o): o.lit[i] (0..1 per seat 1..10), o.num (plaques on), o.outer (0..1 the ring of 22 rising), o.outerLit,
  // o.beams (0..1), o.sky, o.streams (0..1), o.lamps (0..1), o.pool (glow), o.swan ([x, y, z] or null), o.sparks ([x, y, z, t0])
  function set(t, o = {}) {
    if (!NUMTEX.length && document.fonts) for (let i = 1; i <= 10; i++) NUMTEX[i] = tex3('seatnum' + i, 256, 256, (g, w, h) => {
      g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(255,220,150,.9)'; g.lineWidth = 5; g.beginPath(); g.arc(128, 128, 112, 0, TAU); g.stroke(); g.lineWidth = 2; g.beginPath(); g.arc(128, 128, 98, 0, TAU); g.stroke();
      g.fillStyle = '#FFFFFF'; g.font = '700 132px Cinzel'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(i), 128, 138); });
    seats.forEach(s => {
      const k = o.lit?.[s.i] ?? 1;
      s.spot.intensity = 30 * k; s.fl.set(t, k > .02 ? .35 + .65 * k : 0);
      if (NUMTEX[s.i] && !s.plaque.material.map) { s.plaque.material.map = NUMTEX[s.i]; s.plaque.material.emissiveMap = NUMTEX[s.i]; s.plaque.material.needsUpdate = true; }
      s.plaque.visible = (o.num ?? 1) > 0; s.plaque.material.emissiveIntensity = (.25 + 1.6 * k) * (o.num ?? 1); s.plaque.material.opacity = o.num ?? 1;
    });
    // the eight fixed emblems sit on their seats
    for (const i in seatEmblem) { const e = seatEmblem[i], k = o.lit?.[i] ?? 1, rise = o.rise?.[i] ?? 1; e.visible = rise > .01; e.position.set(...seatPos(+i, TOP + .02 - .5 * (1 - easeOut(rise)))); e.rotation.y = -ang(+i) + .25 * Math.sin(t * .4 + +i); e.scale.setScalar(EK * (.25 + .75 * easeOut(rise))); }
    E.narasimha.userData.glow(o.lit?.[4] ?? 1);
    const u = o.outer ?? 0;
    outer.forEach(q => { const r = clamp(u * 1.6 - (q.k - 1) / 22 * .6); q.g.visible = u > .001; q.g.position.y = -(TOP22 + .3) * (1 - easeOut(r)); const L = (o.outerLit ?? 0) * clamp(r * 1.4 - .3); q.orb.material.opacity = .7 * L * (.9 + .1 * Math.sin(t * 5 + q.k)); q.core.material.opacity = .9 * L; });
    outerL.forEach(L => L.intensity = 9 * (o.outerLit ?? 0));
    const bk = o.beams ?? 0; beamM.opacity = .5 * bk; beams.forEach((m, n) => { m.visible = bk > .001; });
    skyGlow.material.opacity = .45 * (o.sky ?? 0); skyCore.material.opacity = .6 * (o.sky ?? 0);
    const sk = o.streams ?? 0; streams.forEach((st, n) => st.set(t, clamp(sk * 1.3 - (n % 4) * .08)));
    const lk = o.lamps ?? 0; lamps.visible = lk > .001; lampGeo.setDrawRange(0, Math.floor(NL * lk));
    poolGlow.material.opacity = o.pool ?? 0;
    E.hamsa.visible = !!o.swan; if (o.swan) { E.hamsa.position.set(...o.swan); E.hamsa.rotation.y = o.swanYaw ?? .3; }
    const sp = o.sparks; sparks.forEach(s => { if (!sp || t < sp[3]) { s.material.opacity = 0; return; } const d = t - sp[3], [vx, vy, vz] = s.userData.v, k = clamp(1 - d / s.userData.d);
      s.position.set(sp[0] + vx * d, sp[1] + vy * d - 4 * d * d, sp[2] + vz * d); s.material.opacity = k; s.scale.setScalar(.09 * (1 + d)); });
  }
  return { S, E, cand, seats, seatPos, ang, R, TOP, POOL_R, pos22, TOP22, outer, NAMES, SKY, set, hemi, water, beams };
})();
