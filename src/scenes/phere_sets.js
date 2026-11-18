// phere_sets.js: the set of "Saat phere were never seven rounds" (ad 102): a wedding mandap at night. A cream stone
// vedi with the havan (cine3d_havan.js) in the middle, four pillars wound with marigolds under a red canopy with
// marigold strings, fairy lights all round (bokeh), a night sky with the pole star to the north. On it: the stone the
// bride treads on (north of the fire, Paraskara 1.7.1), the puffed rice (laja) falling, the couple's footprints
// (hers in red alta, his in turmeric) going round the fire and then the seven steps north, rings of gold light.
// Units: metres, y up, north = -z, east = +x. The fire is at the origin.
//   SET.set(t, o) shows a frame's state (each shot passes all of it) and returns the exposure. o:
//     fire (1), flare (0..1), seven (0..1 the hook's seven rings; sevenKeep: how many stay lit, 0..7 fractional),
//     rounds: [s1, s2, s3] (0..1 each round walked; prints fade to `trail` once the next round starts), ringK (1),
//     stone: 0..1 (the bride's print on the stone), laja: [age, mode] (the puffed rice falling: mode 'hands' (a column
//     falling out of frame) or 'fire' (into the fire)), steps: 0..7 (fractional: the step being taken), stepGlow
//     [7] (each step's disc), seventh (0..1 the last step blazing), polar (0..1 the pole star), exposure
//   SET.ROUND(k, s) a point on round k at s; SET.STEP(i) the middle of step i (0..6); SET.STONE the stone's top.
const SET = (() => {
  const S = new THREE.Scene();
  const GOLD3 = '#FFC860';

  // ---------- light ----------
  env3(S, 'lamplit', { k: .35 });
  const hemi = new THREE.HemisphereLight('#4A4A78', '#3A2418', .55); S.add(hemi);
  const moon = new THREE.DirectionalLight('#8A9AD8', .35); moon.position.set(-6, 9, -4); S.add(moon, moon.target);
  const warm = new THREE.PointLight('#FFB070', 6, 12, 1.4); warm.position.set(0, 2.45, 0); S.add(warm);   // the canopy's lamps
  S.fog = new THREE.Fog('#0C0812', 9, 34);
  sky3(S, [[1, '#04050C'], [.4, '#0A0C1C'], [.1, '#18142A'], [0, '#24182A'], [-.05, '#0C0810'], [-1, '#040306']], { r: 300 });

  // the stars, and the pole star low in the north (India: ~25° up)
  {
    const N = 900, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), r = lcg(102);
    for (let i = 0; i < N; i++) {
      const az = r() * TAU, el = Math.asin(.06 + r() * .94), R = 280;
      pos[i * 3] = Math.cos(el) * Math.sin(az) * R; pos[i * 3 + 1] = Math.sin(el) * R; pos[i * 3 + 2] = -Math.cos(el) * Math.cos(az) * R;
      const b = .25 + Math.pow(r(), 3) * .9; col[i * 3] = b; col[i * 3 + 1] = b * (.92 + r() * .08); col[i * 3 + 2] = b * (.95 + r() * .1);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 2.2, sizeAttenuation: false, vertexColors: true, transparent: true, depthWrite: false, fog: false }));
    pts.renderOrder = -1; S.add(pts);
  }
  const POLE = [0, Math.sin(.44) * 260, -Math.cos(.44) * 260];
  const pole = glow3(S, POLE, 9, '#DDE6FF', .7), poleCore = glow3(S, POLE, 3, '#FFFFFF', 1);

  // ---------- the vedi (a raised stone floor) and the ground ----------
  const VX = 2.7, VZ0 = -5.3, VZ1 = 2.7;
  block3(S, 2 * VX, .2, VZ1 - VZ0, stone3({ col: '#BCAA8E', dark: '#4A3E30', joint: 'rgba(110,84,58,.55)', rows: 2, cols: 2, speck: .35, mottle: .9, rep: [2 * VX / 1.2, (VZ1 - VZ0) / 1.2], rough: .5, bumpK: .8 }), [0, -.2, (VZ0 + VZ1) / 2]);
  mesh3(S, new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: '#1A1410', roughness: 1 }), [0, -.2, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // a red-and-gold border round the vedi's top
  const borderM = new THREE.MeshStandardMaterial({ color: '#9A1A22', roughness: .7 }), borderG = new THREE.MeshStandardMaterial({ color: '#D8A23A', roughness: .35, metalness: .6 });
  for (const [w, d, x, z] of [[2 * VX, .12, 0, VZ0 + .06], [2 * VX, .12, 0, VZ1 - .06], [.12, VZ1 - VZ0, -VX + .06, (VZ0 + VZ1) / 2], [.12, VZ1 - VZ0, VX - .06, (VZ0 + VZ1) / 2]]) {
    block3(S, w, .004, d, borderM, [x, 0, z], { cast: false }); block3(S, w === .12 ? .025 : w, .005, w === .12 ? d : .025, borderG, [x + (w === .12 ? .07 * Math.sign(-x) : 0), 0, z + (w === .12 ? 0 : .07 * Math.sign(-z))], { cast: false });
  }

  // ---------- the havan in the middle (no tarpan or dakshina plates: this is a wedding) ----------
  const HV = havan3(S, { at: [0, 0, 0] });
  const near = (a, b) => Math.hypot(a[0] - b[0], a[2] - b[2]) < .01;
  HV.group.children.forEach(ch => { if (ch.isGroup && (near(ch.position.toArray(), HV.tarpanAt) || near(ch.position.toArray(), HV.dakshinaAt))) ch.visible = false; });

  // ---------- the mandap: four pillars wound with marigolds, a red canopy, marigold strings ----------
  const PX = 2.25, PH = 2.75;
  const pillarM = new THREE.MeshStandardMaterial({ color: '#B8842E', metalness: .55, roughness: .38 });
  const MARI = ['#F28A12', '#F6B21A', '#E8601A', '#FFD040'];
  const mariGeo = new THREE.IcosahedronGeometry(.034, 1), mariMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: .75, emissive: '#3A1800', emissiveIntensity: .25 });
  const mari = [];   // [x, y, z, colour index, scale]
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const x = sx * PX, z = sz * PX;
    mesh3(S, new THREE.CylinderGeometry(.065, .08, PH, 20), pillarM, [x, PH / 2, z]);
    mesh3(S, lathe3([[0, 0], [.16, 0], [.16, .06], [.1, .1], [.08, .14], [0, .14]], 24), pillarM, [x, 0, z]);
    mesh3(S, lathe3([[0, 0], [.08, 0], [.11, .04], [.16, .1], [.16, .14], [0, .14]], 24), pillarM, [x, PH - .14, z]);
    // two strands spiralling up
    for (let s = 0; s < 2; s++) for (let i = 0; i < 70; i++) { const k = i / 70, a = k * TAU * 6 + s * Math.PI, y = .2 + k * (PH - .4); mari.push([x + Math.cos(a) * .1, y, z + Math.sin(a) * .1, s ? 1 : 0, 1]); }
    // banana stems tied to the pillars' inner side
    const bx = x - sx * .14, bz = z - sz * .14;
    mesh3(S, new THREE.CylinderGeometry(.07, .09, 1.7, 14), new THREE.MeshStandardMaterial({ color: '#7EA04A', roughness: .6 }), [bx, .85, bz]);
    const leafM = new THREE.MeshStandardMaterial({ color: '#3E7A2A', roughness: .55, side: THREE.DoubleSide });
    for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + .4, lf = new THREE.Group(); lf.position.set(bx, 1.65, bz); lf.rotation.set(0, a, 0); S.add(lf); mesh3(lf, new THREE.SphereGeometry(.4, 14, 6), leafM, [.38, .12, 0], { scale: [1, .03, .2], rot: [0, 0, .55] }); }
  }
  // the canopy: red cloth with a gold border, sagging a little
  const canG = new THREE.PlaneGeometry(2 * PX + .5, 2 * PX + .5, 24, 24), cp = canG.attributes.position;
  for (let i = 0; i < cp.count; i++) { const x = cp.getX(i), y = cp.getY(i), k = (1 - (x / (PX + .25)) ** 2) * (1 - (y / (PX + .25)) ** 2); cp.setZ(i, -.22 * k); }
  canG.computeVertexNormals();
  const canTex = tex3('canopy', 512, 512, (g, w) => {
    g.fillStyle = '#8A0E1C'; g.fillRect(0, 0, w, w);
    g.strokeStyle = '#E2AA3A'; g.lineWidth = 18; g.strokeRect(14, 14, w - 28, w - 28); g.lineWidth = 5; g.strokeRect(44, 44, w - 88, w - 88);
    g.fillStyle = 'rgba(226,170,58,.55)'; for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) { g.beginPath(); g.arc(70 + i * 46.5, 70 + j * 46.5, 5, 0, TAU); g.fill(); }
    g.strokeStyle = 'rgba(226,170,58,.8)'; g.lineWidth = 4; g.beginPath(); g.arc(w / 2, w / 2, 110, 0, TAU); g.stroke(); g.beginPath(); g.arc(w / 2, w / 2, 70, 0, TAU); g.stroke();
  });
  const CAN = new THREE.Group(); S.add(CAN);   // hidden for the shots from above (the camera "lifts the roof")
  mesh3(CAN, canG, new THREE.MeshStandardMaterial({ map: canTex, roughness: .8, side: THREE.DoubleSide }), [0, PH + .02, 0], { rot: [Math.PI / 2, 0, 0], cast: false });
  const mariCan = [];
  // marigold strings hanging from the canopy's edges, and garlands swagging between the pillars
  const rs = lcg(7);
  for (let e = 0; e < 4; e++) for (let i = 0; i <= 26; i++) {
    const k = i / 26 * 2 - 1, x = e < 2 ? k * PX : (e === 2 ? -1 : 1) * PX, z = e < 2 ? (e === 0 ? -1 : 1) * PX : k * PX, n = 6 + Math.round(rs() * 4);
    for (let j = 0; j < n; j++) mariCan.push([x, PH - .02 - j * .065, z, (i + j) % 2 ? 0 : 1, .9]);
  }
  for (let e = 0; e < 4; e++) for (let i = 0; i <= 60; i++) {
    const k = i / 60, a = [[-PX, -PX], [PX, -PX], [PX, PX], [-PX, PX]][e], b = [[PX, -PX], [PX, PX], [-PX, PX], [-PX, -PX]][e];
    mariCan.push([lerp(a[0], b[0], k), PH - .1 - .55 * Math.sin(k * Math.PI), lerp(a[1], b[1], k), i % 3 === 0 ? 2 : 0, 1.15]);
  }
  for (const [list, parent] of [[mari, S], [mariCan, CAN]]) {
    const im = new THREE.InstancedMesh(mariGeo, mariMat, list.length), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), c = new THREE.Color();
    list.forEach(([x, y, z, ci, s], i) => { m4.compose(V3(x, y, z), q, V3(s, s * .85, s)); im.setMatrixAt(i, m4); im.setColorAt(i, c.set(MARI[ci])); });
    im.castShadow = true; parent.add(im);
  }

  // ---------- fairy lights all round (far: they turn to bokeh) ----------
  const FAIRY = [], rf = lcg(31);
  for (let s = 0; s < 22; s++) {
    const a = s / 22 * TAU, R = 9 + rf() * 4, y0 = 2.6 + rf() * 2.2, x0 = Math.sin(a) * R, z0 = -Math.cos(a) * R, a2 = a + TAU / 22, x1 = Math.sin(a2) * R, z1 = -Math.cos(a2) * R;
    for (let i = 0; i <= 12; i++) { const k = i / 12; const f = glow3(S, [lerp(x0, x1, k), y0 - .9 * Math.sin(k * Math.PI), lerp(z0, z1, k)], .22, rf() < .7 ? '#FFD49A' : '#FFB070', .9); f.ph = rf() * TAU; FAIRY.push(f); }
  }
  // and a curtain of them hanging on the canopy's edge
  for (let i = 0; i < 90; i++) { const e = i % 4, k = rf() * 2 - 1, x = e < 2 ? k * PX : (e === 2 ? -1 : 1) * (PX + .05), z = e < 2 ? (e === 0 ? -1 : 1) * (PX + .05) : k * PX; const f = glow3(CAN, [x, PH - .1 - rf() * .7, z], .06, '#FFE2B0', .9); f.ph = rf() * TAU; FAIRY.push(f); }

  // ---------- the stone, north of the fire (Paraskara 1.7.1) ----------
  const STONE_AT = [.2, 0, -1.08];
  const stoneG = new THREE.RoundedBoxGeometry(.42, .075, .3, 3, .02);
  mesh3(S, stoneG, stone3({ col: '#6E6862', dark: '#2A2624', rows: 1, cols: 1, speck: 1.2, mottle: 1.2, rough: .8 }), [STONE_AT[0], .0375, STONE_AT[2]], { rot: [0, .12, 0] });
  const STONE = [STONE_AT[0], .076, STONE_AT[2]];

  // ---------- footprints: hers red (alta), his turmeric ----------
  const soleTex = () => tex3('sole', 128, 256, (g) => {
    g.fillStyle = '#FFFFFF'; g.filter = 'blur(2px)';
    g.beginPath(); g.ellipse(64, 112, 33, 60, .08, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(60, 196, 26, 34, 0, 0, TAU); g.fill();
    g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.ellipse(84, 140, 12, 40, .1, 0, TAU); g.fill(); g.globalCompositeOperation = 'source-over';   // the arch
    [[44, 40, 13], [66, 34, 10], [83, 40, 8.5], [97, 50, 7.5], [107, 64, 6.5]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x - 6, y + 4, r, 0, TAU); g.fill(); });
  });
  const HER = '#C0142C', HIS = '#E8A21A';
  function print3(x, y, z, yaw, side, col, size) {
    const m = mesh3(S, new THREE.PlaneGeometry(size * .5, size), new THREE.MeshStandardMaterial({ map: soleTex(), color: col, transparent: true, opacity: 0, roughness: .6, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }), [x, y + .004, z], { cast: false, receive: true });
    m.rotation.order = 'YXZ'; m.rotation.set(-Math.PI / 2, yaw, 0); if (side < 0) m.scale.x = -1; m.visible = false;
    const gl = foot3(S, x, z, yaw, side, { size: size * 1.15, col: GOLD3, y }); gl.visible = false;
    return { m, gl };
  }
  const setPrint = (p, a, flash) => { p.m.visible = a > .001; p.m.material.opacity = .92 * a; p.gl.visible = flash > .001; p.gl.material.opacity = .9 * flash; };

  // the rounds: three circles round the fire, clockwise (the fire on their right), a little farther out each time
  const RR = [1.55, 1.75, 1.95], STRIDE = .34;
  // s 0 = due north (by the stone), going east, south, west
  const ROUND = (k, s) => { const a = s * TAU, R = RR[k]; return [R * Math.sin(a), 0, -R * Math.cos(a)]; };
  const ROUNDS = RR.map((R, k) => {
    const n = Math.round(R * TAU / STRIDE), P = [];
    for (let i = 0; i < n; i++) {
      const s = (i + .5) / n, a = s * TAU, hx = Math.cos(a), hz = Math.sin(a), yaw = yawOf(hx, hz), side = i % 2 ? 1 : -1;
      // her on the inside (the fire's side = their right), him outside; feet alternate ±.06 off each one's line
      const at = (off) => [(R + off) * Math.sin(a), -(R + off) * Math.cos(a)];
      const [bx, bz] = at(-.17 + side * .055), [gx, gz] = at(.17 + side * .06);
      P.push({ s, her: print3(bx, 0, bz, yaw, side, HER, .22), his: print3(gx, 0, gz, yaw, side, HIS, .26) });
    }
    // the ring of light: a thin gold tube round the circle, drawn as far as the walk has gone
    const curve = new THREE.CatmullRomCurve3(Array.from({ length: 97 }, (_, i) => { const a = i / 96 * TAU; return V3(R * Math.sin(a), .012, -R * Math.cos(a)); }));
    const segs = 192, geo = new THREE.TubeGeometry(curve, segs, .032, 6, false);
    const mat = new THREE.MeshBasicMaterial({ color: '#FFB43C', toneMapped: false, transparent: true, opacity: .9, depthWrite: false, fog: false });
    const ring = mesh3(S, geo, mat, [0, 0, 0], { cast: false, receive: false });
    const head = glow3(S, [0, .05, 0], .5, '#FFE2A0', 0);
    return { P, ring, geo, mat, segs, head, n };
  });
  // the hook's seven rings (what everyone expects): seven thin circles round the fire
  const SEVEN = Array.from({ length: 7 }, (_, i) => {
    const R = 1.45 + i * .085, curve = new THREE.CatmullRomCurve3(Array.from({ length: 97 }, (_, j) => { const a = j / 96 * TAU; return V3(R * Math.sin(a), .014, -R * Math.cos(a)); }), true);
    const mat = new THREE.MeshBasicMaterial({ color: '#FFB43C', toneMapped: false, transparent: true, opacity: 0, depthWrite: false, fog: false });
    return mesh3(S, new THREE.TubeGeometry(curve, 192, .03, 6, true), mat, [0, 0, 0], { cast: false, receive: false });
  });

  // the seven steps: north from the rounds, the couple side by side (her on his right, east), a gold disc under each
  const Z0 = -2.25, SZ = .4;
  const STEP = (i) => [0, 0, Z0 - i * SZ];
  const discTex = () => tex3('disc', 128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,.75)'); gr.addColorStop(.5, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
  const STEPS = Array.from({ length: 7 }, (_, i) => {
    const z = Z0 - i * SZ, yaw = 0;
    const her = [print3(.12, 0, z, yaw, -1, HER, .22), print3(.25, 0, z - .03, yaw, 1, HER, .22)];
    const his = [print3(-.27, 0, z - .03, yaw, -1, HIS, .26), print3(-.12, 0, z, yaw, 1, HIS, .26)];
    const disc = mesh3(S, new THREE.PlaneGeometry(.7, .55), new THREE.MeshBasicMaterial({ map: discTex(), color: GOLD3, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }), [0, .008, z], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false });
    const glow = glow3(S, [0, .1, z], 1, '#FFD890', 0);
    return { her, his, disc, glow, z };
  });
  // the bride's print on the stone
  const stonePrint = print3(STONE[0] + .02, STONE[1], STONE[2] + .02, .12, 1, HER, .22);
  const dust = Array.from({ length: 14 }, (_, i) => glow3(S, [0, 0, 0], .08, '#E8D8C0', 0));

  // ---------- the puffed rice (laja) ----------
  const LN = 520, lajaGeo = new THREE.SphereGeometry(.009, 6, 4), lajaMat = new THREE.MeshStandardMaterial({ color: '#F4EAD2', roughness: .85, emissive: '#3A2A10', emissiveIntensity: .25 });
  const laja = new THREE.InstancedMesh(lajaGeo, lajaMat, LN); laja.castShadow = false; laja.frustumCulled = false; S.add(laja);
  const LJ = Array.from({ length: LN }, (_, i) => ({ ph: hash(i + 300), dx: (hash(i + 301) - .5), dz: (hash(i + 302) - .5), r: hash(i + 303), s: .7 + hash(i + 304) * .7, rot: hash(i + 305) * TAU }));
  const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), e4 = new THREE.Euler();
  function setLaja(t, o) {
    laja.visible = !!o; if (!o) return;
    const { from, to, on = 1, w = .06, spread = .1, per = .9 } = o;
    LJ.forEach((p, i) => {
      const k = frac(t / per + p.ph), y = lerp(from[1], to[1], k * k), wk = w + spread * k;   // falling, the column widening
      const vis = on > p.r ? 1 : 0;
      e4.set(p.rot + t * 3, p.rot * 2, 0); q4.setFromEuler(e4);
      const s = vis * p.s;
      m4.compose(V3(lerp(from[0], to[0], k) + p.dx * wk, y, lerp(from[2], to[2], k) + p.dz * wk), q4, V3(s * 1.3, s, s)); laja.setMatrixAt(i, m4);
    });
    laja.instanceMatrix.needsUpdate = true;
  }
  // the basket (a soop) of puffed rice by the fire, west
  const SOOP_AT = [-.95, 0, -.05];
  {
    const soopTex = tex3('soop', 256, 256, (g, w) => { g.fillStyle = '#C89A58'; g.fillRect(0, 0, w, w); g.strokeStyle = 'rgba(90,60,24,.6)'; g.lineWidth = 2; for (let i = 0; i < w; i += 7) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, w); g.stroke(); } for (let j = 0; j < w; j += 22) { g.strokeStyle = 'rgba(120,80,30,.4)'; g.beginPath(); g.moveTo(0, j); g.lineTo(w, j); g.stroke(); } });
    const sg = new THREE.Group(); sg.position.set(...SOOP_AT); sg.rotation.y = .3; S.add(sg);
    const sh = new THREE.Shape(); sh.moveTo(-.2, -.18); sh.lineTo(.2, -.18); sh.quadraticCurveTo(.26, .06, .17, .2); sh.lineTo(-.17, .2); sh.quadraticCurveTo(-.26, .06, -.2, -.18);
    mesh3(sg, new THREE.ExtrudeGeometry(sh, { depth: .012, bevelEnabled: false }), new THREE.MeshStandardMaterial({ map: soopTex, roughness: .9, color: '#E0B070' }), [0, .015, 0], { rot: [-Math.PI / 2, 0, 0] });
    const heapM = new THREE.MeshStandardMaterial({ color: '#F2E6CC', roughness: .9, bumpMap: stoneTex({ seed: 50, rows: 1, cols: 1, speck: 2.5 }).bump.rep(6, 6), bumpScale: 5 });
    mesh3(sg, new THREE.SphereGeometry(.15, 20, 10, 0, TAU, 0, Math.PI / 2), heapM, [0, .028, .02], { scale: [1, .35, .8] });
  }

  // ---------- one frame ----------
  function set(t, o = {}) {
    HV.set(t, { fire: o.fire ?? 1, flare: o.flare ?? 0, gold: o.gold ?? 0, lamps: 1, smoke: .25, ember: 1 });
    CAN.visible = o.canopy ?? (CAM3.position.y < 2.45);   // the camera above the canopy lifts the roof
    FAIRY.forEach(f => f.material.opacity = .65 + .3 * Math.sin(t * 1.3 + f.ph));
    warm.intensity = 5 + .6 * Math.sin(t * 2.1);
    // the hook's seven rings: k = how many stay lit (the rest fade from the outside in)
    const sv = o.seven ?? 0, keep = o.sevenKeep ?? 7;
    SEVEN.forEach((m, i) => { const a = sv * clamp(keep - i); m.visible = a > .005; m.material.opacity = .85 * a * (.85 + .15 * Math.sin(t * 3 + i)); });
    // the rounds
    const rounds = o.rounds || [0, 0, 0], trail = o.trail ?? .28, rk = o.ringK ?? 1;
    ROUNDS.forEach((R, k) => {
      const s = clamp(rounds[k]), later = k < 2 ? clamp(rounds[k + 1] * 4) : 0, fadeOld = lerp(1, trail, later) * (o.printK ?? 1);
      R.P.forEach((p) => {
        const born = s >= p.s, age = (s - p.s) * R.n * .34 / 1.1;   // ~seconds since the print landed (a round ≈ 6 s)
        const a = born ? fadeOld : 0, fl = born ? Math.exp(-Math.max(0, (s - p.s)) * 30) : 0;
        setPrint(p.her, a, fl * (o.flashK ?? 1)); setPrint(p.his, a, fl * (o.flashK ?? 1));
      });
      R.ring.visible = s > .002 && rk > .01; R.geo.setDrawRange(0, Math.floor(s * R.segs) * 6 * 6); R.mat.opacity = .9 * rk * (s >= 1 ? 1 : .8);
      const hp = ROUND(k, s); R.head.position.set(hp[0], .06, hp[2]); R.head.material.opacity = s > 0 && s < 1 ? .9 : 0;
    });
    // the stone
    const st = o.stone ?? 0;
    setPrint(stonePrint, st > 0 ? 1 : 0, st > 0 ? Math.exp(-st * 4) : 0);
    dust.forEach((d, i) => { const a = i / dust.length * TAU, r = .1 + st * .5; d.position.set(STONE[0] + Math.cos(a) * r, STONE[1] + .02 + st * .05, STONE[2] + Math.sin(a) * r * .8); d.material.opacity = st > 0 ? .5 * Math.exp(-st * 3) * clamp(st * 10) : 0; d.scale.setScalar(.06 + st * .12); });
    // the steps
    const sp = o.steps ?? 0, sg = o.stepGlow || [], sev = o.seventh ?? 0;
    STEPS.forEach((st, i) => {
      const k = clamp(sp - i), land = sp > i ? Math.exp(-(sp - i) * 3) : 0, g = sg[i] ?? (sp > i ? .55 : 0);
      st.her.forEach(p => setPrint(p, k > 0 ? 1 : 0, land)); st.his.forEach(p => setPrint(p, k > 0 ? 1 : 0, land));
      const big = i === 6 ? sev : 0;
      st.disc.visible = g + big > .005; st.disc.material.opacity = Math.min(1, .3 * g + .25 * land + .45 * big); st.disc.scale.setScalar(1 + .2 * land + .2 * big);
      st.glow.material.opacity = .15 * land + .3 * big; st.glow.scale.setScalar(.6 + .5 * big);
    });
    // the falling rice
    setLaja(t, o.laja);
    // the pole star
    const pk = o.polar ?? .4;
    pole.material.opacity = .5 * pk * (.9 + .1 * Math.sin(t * 2)); pole.scale.setScalar(9 + 14 * pk); poleCore.material.opacity = .6 + .4 * pk;
    return o.exposure ?? .88;
  }
  set(0, {});
  return { S, HV, CAN, set, ROUND, STEP, STONE, RR, SOOP_AT, POLE, HER, HIS };
})();
