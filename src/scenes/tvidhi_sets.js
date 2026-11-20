// tvidhi_sets.js: the 3D set of "Tulsi Vivah, step by step" (ad 105), built once at load.
//   COURT  a home courtyard at godhuli (dusk): flagstones, a lime-washed house wall with a carved door (a marigold toran,
//          the room warm inside), a tiled eave, the dusk sky above. In the middle the tulsi chaura (a lime-and-geru
//          vrindavan with corner finials and a lamp niche) and the tulsi growing in it: the bride, dressed in a red
//          chunari with a gold border, bangles, a bead necklace, a kumkum bindi on her chaura, a sindoor mark. Four sugarcane
//          stalks over her, tied at the top, their leaves spreading (the mandap), marigold strings between them. To her
//          right the groom: the Shaligram on a brass singhasan on a stool, his yellow dhoti, a sandal tilak; a lota pours
//          his bath. To the front left a little red chowki with a brass Ganesha and a kalash. On the floor before her the
//          puja thali (kumkum, haldi, sandal, akshat, flowers, a bowl of tulsi leaves picked the day before, incense, a
//          diya), diyas round a rangoli, the bhog on a banana leaf (sugarcane, amla, ber, sweet potato, kheer, laddoos).
//          The wedding: the kanyadaan lota pouring, the gathbandhan thread from groom to bride, rice and kumkum showering,
//          the Shaligram carried round her on a brass plate (the pheras, a trail of light), the camphor aarti.
// Metres; y up; north is -z: the camera at +z faces north, as the one who performs the puja sits (Drik: facing north).

const CHR = { w: .5, h: .72, top: .78 };            // the chaura: width, body height, the soil's height
const GRM = [.47, 0, .12];                           // the groom's stool (x, z); the stone sits at GROOM_Y
const GROOM_Y = .62;
const GNS = [-1.0, 0, .62];                          // Ganesha's chowki

// marigold3 and cloth3 (from ad 61's sets)
function marigold3(parent, pos, r = .5, seed = 0) {
  const g = new THREE.IcosahedronGeometry(1, 4), p = g.attributes.position, col = [], d = V3(), c0 = new THREE.Color('#C8500A'), c1 = new THREE.Color('#FFB020');
  for (let i = 0; i < p.count; i++) {
    d.set(p.getX(i), p.getY(i), p.getZ(i)).normalize();
    const ruf = Math.abs(Math.sin(d.x * 23 + seed) * Math.sin(d.y * 21 + seed * 2) * Math.sin(d.z * 25)), n = .5 + .5 * noise3(d.x * 6 + seed, d.y * 6, d.z * 6);
    const k = .88 + .1 * Math.pow(ruf, .6) + .05 * n; p.setXYZ(i, d.x * k, d.y * k * .72, d.z * k);
    const cc = c0.clone().lerp(c1, clamp(Math.pow(ruf, .7) * .8 + .2 * n)); col.push(cc.r, cc.g, cc.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
  return mesh3(parent, g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .75 }), pos, { scale: r });
}
// a string of marigolds along points (an instanced string: heads alternating orange and gold, a rose now and then)
function mariString3(parent, pts, n, r = .022, seed = 1) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => V3(...p))), G = new THREE.Group(); parent.add(G);
  const geo = (() => { const m = marigold3(G, [0, 0, 0], 1, seed); G.remove(m); return m.geometry; })();
  const mats = [new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .75 }), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .75, color: '#FFE070' })];
  for (let i = 0; i < n; i++) { const p = curve.getPointAt(i / (n - 1)); const m = mesh3(G, geo, mats[i % 2], [p.x, p.y, p.z], { scale: r * (.9 + .2 * hash(i + seed)), cast: false }); m.rotation.set(hash(i) * 3, hash(i + 3) * 3, 0); }
  return G;
}

// the chaura's faces: lime white, a geru border, a painted lotus and leaves; the front with the lamp niche's arch
const chauraTex3 = (front) => tex3('chaura' + (front ? 'F' : 'S'), 512, 512, (g, w, h) => {
  g.fillStyle = '#F2E8D6'; g.fillRect(0, 0, w, h);
  const r = lcg(front ? 3 : 4); for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${r() < .5 ? '120,100,80' : '255,255,250'},${.03 + r() * .05})`; g.fillRect(r() * w, r() * h, 3, 3); }
  g.fillStyle = '#A8402A'; g.fillRect(0, 0, w, 34); g.fillRect(0, h - 40, w, 40); g.fillRect(0, 0, 26, h); g.fillRect(w - 26, 0, 26, h);
  g.fillStyle = '#E8B040'; for (let x = 40; x < w - 30; x += 28) { g.beginPath(); g.arc(x, 17, 5, 0, TAU); g.fill(); g.beginPath(); g.arc(x, h - 20, 5, 0, TAU); g.fill(); }
  if (front) {
    // the niche's arch, its dark hollow
    g.fillStyle = '#A8402A'; g.beginPath(); g.moveTo(170, 400); g.lineTo(170, 250); g.quadraticCurveTo(256, 120, 342, 250); g.lineTo(342, 400); g.closePath(); g.fill();
    g.fillStyle = '#2A140C'; g.beginPath(); g.moveTo(186, 400); g.lineTo(186, 256); g.quadraticCurveTo(256, 146, 326, 256); g.lineTo(326, 400); g.closePath(); g.fill();
    const gr = g.createRadialGradient(256, 360, 4, 256, 330, 120); gr.addColorStop(0, 'rgba(255,170,70,.55)'); gr.addColorStop(1, 'rgba(255,170,70,0)'); g.fillStyle = gr; g.fillRect(186, 150, 140, 250);
    // leaves either side
    g.fillStyle = '#2E7A3A'; for (const s of [-1, 1]) for (let k = 0; k < 4; k++) { g.save(); g.translate(256 + s * 150, 150 + k * 60); g.rotate(s * (.6 + k * .1)); g.beginPath(); g.ellipse(0, 0, 30, 12, 0, 0, TAU); g.fill(); g.restore(); }
  } else {
    // a lotus
    g.fillStyle = '#C8304A'; for (let k = -3; k <= 3; k++) { g.save(); g.translate(256, 330); g.rotate(k * .32); g.beginPath(); g.ellipse(0, -60, 22, 70, 0, 0, TAU); g.fill(); g.restore(); }
    g.fillStyle = '#E8B040'; g.beginPath(); g.ellipse(256, 340, 80, 20, 0, 0, TAU); g.fill();
    g.fillStyle = '#2E7A3A'; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(256 + s * 120, 380, 60, 18, s * .3, 0, TAU); g.fill(); }
  }
});
// the chunari: red with a gold zari border and gold buti
const chunariTex3 = () => tex3('chunari', 512, 512, (g, w, h) => {
  g.fillStyle = '#C0101E'; g.fillRect(0, 0, w, h);
  const r = lcg(9); for (let i = 0; i < 5000; i++) { g.fillStyle = `rgba(${r() < .5 ? '80,0,10' : '255,90,80'},${.05 + r() * .06})`; g.fillRect(r() * w, r() * h, 2, 2); }
  g.fillStyle = '#F2C04A'; for (let x = 16; x < w; x += 36) for (let y = 16; y < h - 80; y += 36) { g.beginPath(); g.arc(x + (y / 36 % 2) * 18, y, 3.4, 0, TAU); g.fill(); }
  g.fillStyle = '#E8B040'; g.fillRect(0, h - 70, w, 58); g.fillStyle = '#B07A20'; for (let x = 0; x < w; x += 16) { g.beginPath(); g.moveTo(x, h - 70); g.lineTo(x + 8, h - 56); g.lineTo(x + 16, h - 70); g.fill(); }
  g.fillStyle = '#F8D870'; for (let x = 8; x < w; x += 24) { g.beginPath(); g.arc(x, h - 34, 6, 0, TAU); g.fill(); }
  g.fillStyle = '#C0101E'; g.fillRect(0, h - 12, w, 12);
});
// the yellow dhoti: turmeric silk with a red border
const dhotiTex3 = () => tex3('dhoti', 256, 256, (g, w, h) => {
  g.fillStyle = '#FFC21A'; g.fillRect(0, 0, w, h); g.fillStyle = '#C0201E'; g.fillRect(0, h - 60, w, 34); g.fillStyle = '#E8C060'; g.fillRect(0, h - 18, w, 8);
  const r = lcg(12); for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(${r() < .5 ? '140,80,0' : '255,240,160'},${.06 + r() * .06})`; g.fillRect(r() * w, r() * h, 2, 2); }
});
// a banana leaf
const bananaTex3 = () => tex3('banana', 256, 1024, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#2E6A1E'); gr.addColorStop(.5, '#4E9A2E'); gr.addColorStop(1, '#2E6A1E'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(200,230,140,.35)'; g.lineWidth = 2; for (let y = 0; y < h; y += 9) { g.beginPath(); g.moveTo(w / 2, y); g.lineTo(0, y + 30); g.moveTo(w / 2, y); g.lineTo(w, y + 30); g.stroke(); }
  g.fillStyle = '#B8D88A'; g.fillRect(w / 2 - 5, 0, 10, h);
});

// a sugarcane stalk from a (ground) to b (top): jointed, purple-green, a crown of long leaves arching out at the top
function cane3(parent, a, b, seed = 1) {
  const G = new THREE.Group(); parent.add(G);
  const A = V3(...a), B = V3(...b), mid = A.clone().lerp(B, .55).add(V3((hash(seed) - .5) * .05, 0, (hash(seed + 2) - .5) * .05));
  const curve = new THREE.QuadraticBezierCurve3(A, mid, B);
  const caneT = tex3('caneT', 64, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#3A1E2E'); gr.addColorStop(.45, '#7A4A5A'); gr.addColorStop(.6, '#8A6A4A'); gr.addColorStop(1, '#3A1E2E'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 96) { g.fillStyle = 'rgba(40,16,20,.9)'; g.fillRect(0, y, w, 6); g.fillStyle = 'rgba(236,226,180,.95)'; g.fillRect(0, y + 6, w, 10); g.fillStyle = 'rgba(210,200,160,.35)'; g.fillRect(0, y + 16, w, 18); }
    g.strokeStyle = 'rgba(255,240,220,.08)'; for (let x = 4; x < w; x += 6) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  });
  const len = curve.getLength(), mat = new THREE.MeshStandardMaterial({ map: caneT.rep(1, len / .9), roughness: .4, color: '#FFFFFF' });
  mesh3(G, new THREE.TubeGeometry(curve, 32, .021, 14, false), mat);
  // the leaves: long blades out of the top third, arching over and down
  const leafM = new THREE.MeshStandardMaterial({ color: '#5E8A30', roughness: .55, side: THREE.DoubleSide }), leafM2 = leafM.clone(); leafM2.color.set('#7AA040');
  const r = lcg(seed * 7 + 3);
  for (let i = 0; i < 14; i++) {
    const u = .62 + i / 14 * .38, p = curve.getPointAt(u), ang = Math.atan2(a[2], a[0]) + (r() - .5) * 2.4, out = V3(Math.cos(ang), 0, Math.sin(ang)), L = .45 + r() * .4;
    const pts = []; for (let k = 0; k <= 8; k++) { const s = k / 8; pts.push(p.clone().add(out.clone().multiplyScalar(L * s)).add(V3(0, L * (.55 * s - .9 * s * s) + .08 * s, 0))); }
    const cv = new THREE.CatmullRomCurve3(pts), n = 16, pos = [], idx = [];
    for (let k = 0; k <= n; k++) { const s = k / n, c = cv.getPointAt(s), w = .026 * Math.sin(Math.PI * Math.min(1, s * 1.1 + .05)), side = V3(-out.z, 0, out.x).multiplyScalar(w);
      pos.push(c.x - side.x, c.y - .004 * Math.sin(s * 9), c.z - side.z, c.x + side.x, c.y + .004 * Math.sin(s * 9), c.z + side.z); if (k < n) idx.push(k * 2, k * 2 + 1, k * 2 + 2, k * 2 + 1, k * 2 + 3, k * 2 + 2); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
    mesh3(G, geo, i % 2 ? leafM : leafM2);
  }
  return { group: G, curve };
}

const COURT = (() => {
  const S = new THREE.Scene(); S.fog = new THREE.Fog('#3A2A40', 14, 40);
  const hemi = new THREE.HemisphereLight('#9AA0D8', '#6A4A30', .6); S.add(hemi);
  // the low sun from the west (screen left), long warm light; a fill from the front
  const sun = new THREE.DirectionalLight('#FFA45A', 2.6); sun.position.set(-7, 2.6, 3.5); sun.target.position.set(0, .7, 0); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 30 }); sun.shadow.bias = -.0004; sun.shadow.normalBias = .02; sun.shadow.radius = 3; S.add(sun, sun.target);
  const fill = new THREE.DirectionalLight('#FFC898', .5); fill.position.set(2, 1.6, 6); fill.target.position.set(0, .8, 0); S.add(fill, fill.target);
  const skyT = tex3('duskSky', 4, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256);
    [[0, '#12143A'], [.22, '#26286A'], [.36, '#5A4A92'], [.44, '#B8708E'], [.48, '#F09A7A'], [.5, '#FFC680'], [.55, '#B07A62'], [1, '#2A2024']].forEach(([k, col]) => gr.addColorStop(k, col)); g.fillStyle = gr; g.fillRect(0, 0, 4, 256); });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(45, 32, 24), new THREE.MeshBasicMaterial({ map: skyT, side: THREE.BackSide, fog: false, depthWrite: false })); sky.renderOrder = -2; S.add(sky);
  // the Dwadashi moon, nearly full, up in the dusk sky; a few first stars
  const moonT = tex3('moon12', 256, 256, (g, w, h) => { g.clearRect(0, 0, w, h); g.save(); g.beginPath(); g.arc(128, 128, 120, 0, TAU); g.clip();
    g.fillStyle = '#FFF4DC'; g.fillRect(0, 0, w, h); const r = lcg(2); for (let i = 0; i < 14; i++) { g.fillStyle = `rgba(170,160,150,${.15 + r() * .2})`; g.beginPath(); g.arc(40 + r() * 180, 40 + r() * 180, 8 + r() * 26, 0, TAU); g.fill(); }
    g.fillStyle = 'rgba(30,30,70,.85)'; g.beginPath(); g.ellipse(-14, 128, 52, 126, 0, 0, TAU); g.fill(); g.restore(); });
  const moon = mesh3(S, new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: moonT, transparent: true, fog: false, depthWrite: false }), [3.4, 8.4, -16], { cast: false, scale: 1.1 });
  moon.lookAt(0, 1, 3); moon.renderOrder = -1;
  const moonGlow = glow3(S, [3.4, 8.4, -16.1], 4.2, '#C8C8FF', .25); moonGlow.material.fog = false;
  const stars = []; { const r = lcg(8); for (let i = 0; i < 60; i++) { const a = (r() - .5) * 1.6, e = .32 + r() * .6, d = 40; const st = glow3(S, [Math.sin(a) * d * Math.cos(e), Math.sin(e) * d, -Math.cos(a) * d * Math.cos(e)], .25 + r() * .25, '#FFFFFF', 0); st.material.fog = false; stars.push([st, r()]); } }
  // the ground: flagstones, a little warm
  mesh3(S, new THREE.PlaneGeometry(26, 26), stone3({ col: '#A08C78', rows: 4, cols: 4, seed: 41, rep: [12, 12], mottle: 1.1 }), [0, 0, 4], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // ---- the house behind: a wall, a door at the left with a toran, the eave, a lit window at the right ----
  const WZ = -2.3, WW = 10, WH = 2.35, dw = 1.1, dh = 1.95, DX = -1.75;
  const wallM = plaster3('#E8C08A', [2.6, 1]);
  const segs = [[-WW / 2, DX - dw / 2 - .2], [DX + dw / 2 + .2, WW / 2]];
  for (const [x0, x1] of segs) block3(S, x1 - x0, WH, .3, wallM, [(x0 + x1) / 2, 0, WZ - .15]);
  block3(S, dw + .4, WH - dh - .3, .3, wallM, [DX, dh + .3, WZ - .15]);
  for (const [x0, x1] of segs) { block3(S, x1 - x0, .5, .02, plaster3('#9A3A22', [1, .2]), [(x0 + x1) / 2, 0, WZ + .01]); block3(S, x1 - x0, .04, .025, plaster3('#F4ECDC', [1, .1]), [(x0 + x1) / 2, .5, WZ + .01]); }
  const D = door3(S, { x: DX, z: WZ + .02, w: dw, h: dh });
  const roomM = plaster3('#B88A62', [1, 1]);
  block3(S, 2.4, 2.6, .2, roomM, [DX, 0, WZ - 2.4]); block3(S, .2, 2.6, 2.4, roomM, [DX - 1.1, 0, WZ - 1.3]); block3(S, .2, 2.6, 2.4, roomM, [DX + 1.1, 0, WZ - 1.3]);
  const inner = new THREE.PointLight('#FFB060', 0, 6, 1.4); inner.position.set(DX, 1.5, WZ - 1.4); S.add(inner);
  const TORD = toran3(S, { kind: 'marigold', w: 1.4, y: dh + .28, z: WZ + .24, x: DX, sag: .03 });
  const TORM = toran3(S, { kind: 'mango', w: 1.4, y: dh + .36, z: WZ + .26, x: DX, sag: .03, seed: 5 });
  // the window at the right: a warm square behind wooden bars
  const winM = block3(S, 1.0, .9, .05, std3('#FFB868', .9, { emissive: '#FF9A40', emissiveIntensity: .0 }), [1.9, .95, WZ + .005]).material;
  for (let i = 0; i < 6; i++) block3(S, .04, .9, .06, pbr3('darkwood', { rep: [.2, 1], tint: '#7A4A2A' }), [1.45 + i * .18, .95, WZ + .03]);
  block3(S, 1.2, .08, .12, pbr3('darkwood', { rep: [1, .2], tint: '#7A4A2A' }), [1.9, 1.85, WZ + .05]); block3(S, 1.2, .06, .14, pbr3('darkwood', { rep: [1, .2], tint: '#7A4A2A' }), [1.9, .9, WZ + .06]);
  // the eave and its tiles
  block3(S, WW, .12, .8, pbr3('darkwood', { rep: [4, .5], tint: '#6A4026', rough: .9 }), [0, WH - .1, WZ + .3]);
  mesh3(S, new THREE.BoxGeometry(WW + .4, .07, 1.2), std3('#8A3A22', .85, { bumpMap: stoneTex({ rows: 12, cols: 24, seed: 2 }).bump.rep(2, 1), bumpScale: 3 }), [0, WH + .14, WZ + .4], { rot: [.32, 0, 0] });
  // a neem behind the roof, dark against the sky: clumps of leaves on a trunk

  // ---- the rangoli round the chaura ----
  const RG = mesh3(S, new THREE.PlaneGeometry(1.9, 1.9), new THREE.MeshStandardMaterial({ map: rangoli2Tex3(), transparent: true, roughness: .95, depthWrite: false }), [0, .004, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });

  // ---- the tulsi chaura ----
  const CHG = new THREE.Group(); S.add(CHG);
  const lime = std3('#F0E6D4', .9), geru = std3('#A8402A', .85);
  const sideM = new THREE.MeshStandardMaterial({ map: chauraTex3(false), roughness: .9 }), frontM = new THREE.MeshStandardMaterial({ map: chauraTex3(true), roughness: .9 });
  block3(CHG, CHR.w + .16, .1, CHR.w + .16, lime, [0, 0, 0]);                      // the plinth
  block3(CHG, CHR.w + .12, .03, CHR.w + .12, geru, [0, .1, 0]);
  const body = new THREE.Mesh(new THREE.BoxGeometry(CHR.w, CHR.h - .13, CHR.w), [sideM, sideM, lime, lime, frontM, sideM]); body.position.set(0, .13 + (CHR.h - .13) / 2, 0); body.castShadow = body.receiveShadow = true; CHG.add(body);
  block3(CHG, CHR.w + .08, .04, CHR.w + .08, geru, [0, CHR.h, 0]);                // the cornice
  block3(CHG, CHR.w + .04, .03, CHR.w + .04, lime, [0, CHR.h + .04, 0]);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {                             // the corner finials
    const x = sx * (CHR.w / 2 - .01), z = sz * (CHR.w / 2 - .01);
    mesh3(CHG, lathe3(smooth3([[0, 0], [.04, 0], [.045, .02], [.03, .05], [.035, .07], [.02, .1], [.006, .13], [0, .14]], 3), 20), lime, [x, CHR.h + .07, z]);
    mesh3(CHG, new THREE.SphereGeometry(.012, 10, 8), geru, [x, CHR.h + .2, z]);
  }
  // the soil in the basin
  mesh3(CHG, new THREE.BoxGeometry(CHR.w - .06, .02, CHR.w - .06), std3('#4A3020', 1), [0, CHR.top - .01, 0], { cast: false });
  // the niche's lamp (just before the painted hollow), the bindi, the sindoor mark
  const nicheLamp = diya3(CHG, [0, .17, CHR.w / 2 + .03], { k: .5, light: true, power: .7, range: 1.6 });
  const bindi = mesh3(CHG, new THREE.CircleGeometry(.022, 24), std3('#D0101C', .4, { emissive: '#600008', emissiveIntensity: .6 }), [0, CHR.h - .1, CHR.w / 2 + .002], { cast: false });
  const haldi = mesh3(CHG, new THREE.CircleGeometry(.034, 24), std3('#F0B020', .5), [0, CHR.h - .1, CHR.w / 2 + .001], { cast: false });

  // ---- the bride: the tulsi ----
  const TULG = new THREE.Group(); TULG.position.set(0, CHR.top, 0); S.add(TULG);
  const TULS = [[.66, 9, 17, 0, 0, 0], [.56, 8, 23, .05, -.04, 1.3], [.5, 8, 31, -.05, .03, 2.6], [.44, 7, 41, .02, .06, 4.1], [.34, 6, 53, .07, .05, .7], [.3, 6, 61, -.07, -.05, 3.3], [.26, 6, 67, 0, .08, 5.2]].map(([h, st, sd, x, z, ry]) => { const b = tulsi3(TULG, { h, stems: st, seed: sd, flowers: .8 }); b.group.position.set(x, 0, z); b.group.rotation.y = ry; return b; });
  const TUL = { group: TULG, grow: (k) => TULS.forEach(b => b.grow(k)) };
  const bb = new THREE.Box3().setFromObject(TULG), tulTop = bb.max.y, tulR = Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z) / 2;
  // her chunari: a veil over the crown of the bush, open at the front, the hem falling behind and to the sides
  const CHU = new THREE.Group(); CHU.position.set(0, tulTop - .1, -.03); S.add(CHU);
  const chuG = new THREE.SphereGeometry(1, 64, 32, Math.PI * .72, Math.PI * 1.56, 0, Math.PI * .62), cp = chuG.attributes.position;
  for (let i = 0; i < cp.count; i++) { const x = cp.getX(i), y = cp.getY(i), z = cp.getZ(i), th = Math.acos(clamp(y, -1, 1)), f = th / (Math.PI * .62);
    const fold = 1 + .07 * Math.sin(Math.atan2(z, x) * 14) * f * f + .03 * noise3(x * 4, y * 4, z * 4);
    cp.setXYZ(i, x * fold, y * (1 - f * f * .35) - f * f * .25, z * fold); }
  chuG.computeVertexNormals();
  const chuM = new THREE.MeshStandardMaterial({ map: chunariTex3(), roughness: .6, side: THREE.DoubleSide, transparent: true });
  const chunari = mesh3(CHU, chuG, chuM, [0, 0, 0], { scale: [tulR * .7, .2, tulR * .7] });
  // the sindoor in her parting: a red line at the front of the veil's crown
  const sindoor = mesh3(CHU, new THREE.SphereGeometry(.024, 14, 10), std3('#E0181C', .5, { emissive: '#7A0008', emissiveIntensity: .9 }), [0, .2, .05], { scale: [1, .5, 1.4], cast: false });
  // bangles on a front branch, a bead necklace across the bush
  const BANG = new THREE.Group(); BANG.position.set(.11, CHR.top + .3, .2); BANG.rotation.set(.5, .3, .9); S.add(BANG);
  ['#C0101E', '#1E8A3A', '#E8B040', '#C0101E', '#E8B040'].forEach((col, i) => mesh3(BANG, new THREE.TorusGeometry(.034, .0045, 8, 32), std3(col, .3, { metalness: col === '#E8B040' ? .6 : .1 }), [0, i * .009, 0], { rot: [Math.PI / 2, 0, 0], cast: false }));
  const NECK = new THREE.Group(); S.add(NECK);
  beads3(NECK, [[-.2, CHR.top + .42, .1], [-.08, CHR.top + .27, .24], [.06, CHR.top + .25, .25], [.2, CHR.top + .4, .12]], 40, .008, [PMAT.zari, PMAT.eye, PMAT.zari, PMAT.ruby]);
  mesh3(NECK, new THREE.CylinderGeometry(.018, .018, .006, 20), PMAT.zari, [-.01, CHR.top + .245, .255], { rot: [Math.PI / 2 - .2, 0, 0] });

  // ---- the mandap: four sugarcane stalks tied over her, marigold strings between them ----
  const MS = .6, apex = [0, 1.78, 0];
  const CANES = [[-1, 1], [1, 1], [1, -1], [-1, -1]].map(([sx, sz], i) => cane3(S, [sx * MS, 0, sz * MS], [sx * .05, apex[1], sz * .05], i + 2));
  const tie = new THREE.Group(); S.add(tie); for (let i = 0; i < 3; i++) mesh3(tie, new THREE.TorusGeometry(.07 - i * .004, .008, 8, 24), std3(i === 1 ? '#F2C21E' : '#C21E28', .7), [0, apex[1] - .1 - i * .02, 0], { rot: [Math.PI / 2, 0, 0], cast: false });
  const caneAt = (i, y) => { const c = CANES[i].curve; let lo = 0, hi = 1; for (let k = 0; k < 18; k++) { const m = (lo + hi) / 2; c.getPointAt(m).y < y ? lo = m : hi = m; } return c.getPointAt(lo).toArray(); };
  const MSTR = new THREE.Group(); S.add(MSTR);
  for (let i = 0; i < 4; i++) { const a = caneAt(i, 1.42), b = caneAt((i + 1) % 4, 1.42), m = [(a[0] + b[0]) / 2, 1.42 - .16, (a[2] + b[2]) / 2];
    mariString3(MSTR, [a, [lerp(a[0], m[0], .5), 1.42 - .11, lerp(a[2], m[2], .5)], m, [lerp(b[0], m[0], .5), 1.42 - .11, lerp(b[2], m[2], .5)], b], 26, .021, i + 1); }
  // hanging strands at the front corners
  for (const i of [0, 1]) { const a = caneAt(i, 1.42); mariString3(MSTR, [a, [a[0], a[1] - .25, a[2] + .01], [a[0], a[1] - .5, a[2] + .02]], 14, .02, i + 7); }

  // ---- the groom: the Shaligram on a brass singhasan on a stool ----
  const wood = pbr3('darkwood', { rep: [1, .5], tint: '#9A6440', rough: .7 });
  const GR = new THREE.Group(); GR.position.set(GRM[0], 0, GRM[2]); S.add(GR);
  block3(GR, .3, .03, .3, wood, [0, .44, 0]); for (const sx of [-1, 1]) for (const sz of [-1, 1]) block3(GR, .03, .44, .03, wood, [sx * .12, 0, sz * .12]);
  mesh3(GR, new THREE.PlaneGeometry(.34, .34), new THREE.MeshStandardMaterial({ map: dhotiTex3(), roughness: .7, side: THREE.DoubleSide }), [0, .472, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const brass = new THREE.MeshStandardMaterial({ color: '#C89A48', metalness: .6, roughness: .45, envMapIntensity: .6 });
  const SING = mesh3(GR, lathe3(smooth3([[0, 0], [.075, 0], [.08, .012], [.06, .024], [.04, .05], [.045, .08], [.075, .1], [.085, .112], [.078, .12], [0, .116]], 3), 40), brass, [0, .473, 0]);
  // the stone on its plate (a group so the pheras can carry it)
  const STG = new THREE.Group(); STG.position.set(0, GROOM_Y - .025, 0); GR.add(STG);
  const plateP = mesh3(STG, lathe3([[0, 0], [.075, 0], [.088, .01], [.092, .016], [.086, .015], [0, .007]], 40), brass, [0, -.012, 0]);
  const SG = shaligram3(STG); SG.group.scale.setScalar(.055); SG.group.position.set(0, .04, 0); SG.group.rotation.set(-.12, .15, 0);
  // his dhoti: a yellow cloth wrapped round the lower half of the stone, knotted at the front
  const dhotiG = new THREE.Group(); STG.add(dhotiG);
  const dhoti = mesh3(dhotiG, new THREE.CylinderGeometry(.056, .07, .03, 40, 1, true), new THREE.MeshStandardMaterial({ map: dhotiTex3(), roughness: .6, side: THREE.DoubleSide }), [0, .014, 0], { scale: [1, 1, .72] });
  mesh3(dhotiG, new THREE.ConeGeometry(.012, .035, 10), std3('#F0B418', .6), [0, -.004, .044], { rot: [.4, 0, 0] });
  // his tilak: an urdhva pundra in sandal, a red line inside
  const tilakG = new THREE.Group(); tilakG.position.set(0, .06, .036); tilakG.rotation.x = -.25; STG.add(tilakG);
  for (const s of [-1, 1]) mesh3(tilakG, new THREE.PlaneGeometry(.003, .017), std3('#F2E2B0', .6, { emissive: '#4A3A1A', emissiveIntensity: .3 }), [s * .004, 0, 0], { cast: false });
  mesh3(tilakG, new THREE.PlaneGeometry(.0018, .013), std3('#D0101C', .5, { emissive: '#500006', emissiveIntensity: .5 }), [0, -.001, .0005], { cast: false });
  // his mala: a tiny garland of tulsi beads
  const groomMala = new THREE.Group(); STG.add(groomMala);
  beads3(groomMala, [[-.055, .03, -.01], [-.04, .012, .035], [0, .004, .045], [.04, .012, .035], [.055, .03, -.01]], 20, .005, [PMAT.leaf, PMAT.mari[0]]);
  // his bath: a copper lota pouring, from up and to the right
  const lota = new THREE.Group(); S.add(lota);
  const cu = new THREE.MeshStandardMaterial({ color: '#C47848', metalness: .6, roughness: .4, envMapIntensity: .6 });
  mesh3(lota, lathe3(smooth3([[0, 0], [.05, 0], [.08, .04], [.085, .08], [.06, .12], [.04, .14], [.05, .16], [0, .155]], 3), 32), cu, [0, -.08, 0]);
  const bathPour = stream3(S, [[GRM[0] + .14, GROOM_Y + .22, GRM[2] + .03], [GRM[0] + .08, GROOM_Y + .17, GRM[2] + .03], [GRM[0] + .03, GROOM_Y + .1, GRM[2] + .03], [GRM[0] + .01, GROOM_Y + .04, GRM[2] + .03]], .005, { speed: 3, segs: 30 });
  const DROPS = []; for (let i = 0; i < 26; i++) DROPS.push(mesh3(S, new THREE.SphereGeometry(.003, 6, 4), new THREE.MeshStandardMaterial({ color: '#CFEFFF', roughness: .05, emissive: '#5A8AAA', emissiveIntensity: .7, transparent: true }), [0, 0, 0], { cast: false }));

  // ---- Ganesha and the kalash on a little chowki, front left ----
  const GNG = new THREE.Group(); GNG.position.set(GNS[0], 0, GNS[2]); S.add(GNG);
  block3(GNG, .5, .03, .34, wood, [0, .2, 0]); for (const sx of [-1, 1]) for (const sz of [-1, 1]) block3(GNG, .03, .2, .03, wood, [sx * .22, 0, sz * .14]);
  mesh3(GNG, new THREE.PlaneGeometry(.54, .38), new THREE.MeshStandardMaterial({ color: '#B8141E', roughness: .85, side: THREE.DoubleSide }), [0, .232, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const GAN = ganesha3(GNG, [-.08, .233, -.02], .17);
  const KAL = kalash3(GNG, [.15, .233, 0], .42);
  const ganLamp = diya3(GNG, [-.08, .233, .12], { k: .4, light: true, power: .5, range: 1.4 });

  // ---- the puja thali on the floor before her ----
  const TX = .02, TZ = .78, TH = new THREE.Group(); TH.position.set(TX, 0, TZ); S.add(TH);
  mesh3(TH, lathe3([[0, 0], [.15, 0], [.18, .015], [.19, .025], [.18, .022], [0, .01]], 48), brass, [0, 0, 0]);
  const katori = (x, z, col, heap) => { mesh3(TH, lathe3(smooth3([[0, 0], [.018, 0], [.032, .02], [.034, .03], [.03, .03], [0, .012]], 3), 24), brass, [x, .012, z]);
    const m = mesh3(TH, heap ? new THREE.SphereGeometry(.028, 16, 8, 0, TAU, 0, Math.PI / 2) : new THREE.CircleGeometry(.029, 20), std3(col, .9), [x, .036, z], { rot: heap ? [0, 0, 0] : [-Math.PI / 2, 0, 0], scale: heap ? [1, .4, 1] : 1, cast: false }); return m; };
  const KK = { kumkum: katori(-.1, -.05, '#C8141C'), haldi: katori(-.035, -.09, '#E8B020'), sandal: katori(.035, -.09, '#E8D2A0'), akshat: katori(.1, -.05, '#F4EEDC', true) };
  // a bowl of tulsi leaves (picked the day before)
  mesh3(TH, lathe3(smooth3([[0, 0], [.022, 0], [.04, .022], [.042, .03], [.036, .028], [0, .014]], 3), 24), brass, [-.09, .012, .06]);
  const leafBowl = []; for (let i = 0; i < 9; i++) { const l = tulsiLeaf3(TH, .028); const a = i / 9 * TAU; l.position.set(-.09 + Math.cos(a) * .014, .04 + (i % 3) * .003, .06 + Math.sin(a) * .014); l.rotation.set(-1.2 + hash(i) * .5, a, 0); leafBowl.push(l); }
  // flowers
  const flG = new THREE.IcosahedronGeometry(.02, 1);
  for (let i = 0; i < 8; i++) { const a = -.6 + i / 8 * 1.6; mesh3(TH, flG, i % 3 === 2 ? PMAT.rose : PMAT.mari[i % 2], [Math.cos(a) * .14, .03, .02 + Math.sin(a) * .05], { scale: [1, .7, 1], cast: false }); }
  const thaliDiya = diya3(TH, [.08, .012, .07], { light: false });
  mesh3(TH, new THREE.CylinderGeometry(.01, .014, .02, 10), brass, [.0, .012, .09]);
  const sticks = [.1, -.06].map(r => mesh3(TH, new THREE.CylinderGeometry(.0018, .0018, .22, 5), std3('#3A2418', .9), [Math.sin(r) * .11, .13, .09], { rot: [0, 0, -r], cast: false }));
  const tips = [.1, -.06].map(r => [TX + Math.sin(r) * .22, .24, TZ + .09]);
  const embers = tips.map(p => glow3(S, p, .03, '#FF5A20', 0));
  const SMK = []; for (let i = 0; i < 22; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex3(), color: '#C8C0B8', transparent: true, depthWrite: false, opacity: 0 })); S.add(s); SMK.push(s); }

  // ---- the diyas round the rangoli, and on the chaura's plinth corners ----
  const DY = []; for (let i = 0; i < 10; i++) { const a = Math.PI * (.08 + .84 * i / 9); DY.push([Math.cos(a) * 1.0, Math.sin(a) * .95 + .02]); }
  const diyas = DY.map(([x, z], i) => diya3(S, [x, 0, z], { light: i === 2 || i === 7, power: 1.2, range: 3 }));
  const plDiyas = [[-1, 1], [1, 1]].map(([sx, sz]) => diya3(S, [sx * (CHR.w / 2 + .03), .1, sz * (CHR.w / 2 + .03)], { k: .45, light: false }));

  // ---- the bhog on a banana leaf, front right ----
  const BHG = new THREE.Group(); BHG.position.set(.5, 0, 1.25); BHG.rotation.y = -.25; S.add(BHG);
  const bl = mesh3(BHG, new THREE.PlaneGeometry(.3, .62, 4, 12), new THREE.MeshStandardMaterial({ map: bananaTex3(), roughness: .4, side: THREE.DoubleSide }), [0, .006, 0], { rot: [-Math.PI / 2, 0, Math.PI / 2], cast: false });
  { const p = bl.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, .01 * Math.abs(p.getX(i)) * 6); bl.geometry.computeVertexNormals(); }
  const BH = { cane: new THREE.Group(), amla: new THREE.Group(), ber: new THREE.Group(), potato: new THREE.Group(), kheer: new THREE.Group() };
  for (const k in BH) BHG.add(BH[k]);
  const caneP = tex3('caneP', 64, 64, (g, w, h) => { g.fillStyle = '#6A3A4A'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(230,220,170,.8)'; g.fillRect(0, 28, w, 4); });
  for (let i = 0; i < 4; i++) mesh3(BH.cane, new THREE.CylinderGeometry(.014, .014, .12, 12), new THREE.MeshStandardMaterial({ map: caneP, roughness: .5 }), [-.2 + i * .03, .016, -.03 + (i % 2) * .02], { rot: [0, .2 * i, Math.PI / 2] });
  for (let i = 0; i < 5; i++) mesh3(BH.amla, new THREE.SphereGeometry(.018, 16, 12), std3('#A8C050', .35), [-.06 + (i % 3) * .03, .02 + (i > 2 ? .02 : 0), .07 + (i % 2) * .025]);
  for (let i = 0; i < 7; i++) mesh3(BH.ber, new THREE.SphereGeometry(.011, 12, 10), std3(i % 2 ? '#C8601E' : '#D8A030', .35), [.04 + (i % 3) * .022, .013, -.08 + Math.floor(i / 3) * .022]);
  for (let i = 0; i < 2; i++) mesh3(BH.potato, new THREE.SphereGeometry(.025, 16, 12), std3('#8A3A3A', .8), [.12, .022, .05 + i * .05], { scale: [1.9, .8, 1], rot: [0, .4 * i, 0] });
  mesh3(BH.kheer, lathe3(smooth3([[0, 0], [.03, 0], [.05, .03], [.052, .04], [.046, .038], [0, .02]], 3), 28), brass, [.16, .006, -.08]);
  mesh3(BH.kheer, new THREE.CircleGeometry(.045, 24), std3('#D8C8A4', .8), [.16, .04, -.08], { rot: [-Math.PI / 2, 0, 0], cast: false });

  // ---- the wedding: the kanyadaan lota, the gathbandhan thread, the shower, the pheras' trail, the aarti ----
  const kLota = new THREE.Group(); S.add(kLota);
  mesh3(kLota, lathe3(smooth3([[0, 0], [.05, 0], [.08, .04], [.085, .08], [.06, .12], [.04, .14], [.05, .16], [0, .155]], 3), 32), cu, [0, -.08, 0]);
  const kPour = stream3(S, [[.15, .99, .4], [.12, .93, .4], [.1, .86, .41], [.09, .79, .41]], .006, { speed: 3, segs: 30 });
  // the thread: from the stone's neck round to the tulsi's trunk, red and yellow twisted
  const thrPts = [[GRM[0] - .03, GROOM_Y + .02, GRM[2] + .04], [.33, CHR.top + .02, .2], [.18, CHR.top + .03, .22], [.05, CHR.top + .05, .08], [0, CHR.top + .06, 0]];
  const thrCurve = new THREE.CatmullRomCurve3(thrPts.map(p => V3(...p)));
  const THR = [['#C21E28', 0], ['#F2C21E', Math.PI]].map(([col, ph]) => {
    const pts = []; for (let i = 0; i <= 80; i++) { const u = i / 80, p = thrCurve.getPointAt(u); pts.push(p.add(V3(Math.cos(u * 60 + ph) * .002, Math.sin(u * 60 + ph) * .002, 0))); }
    const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, .0022, 6, false); return { m: mesh3(S, geo, std3(col, .6, { emissive: col, emissiveIntensity: .15 }), [0, 0, 0], { cast: false }), n: 160 };
  });
  // the shower: rice and kumkum falling over the couple
  const SHW = []; { const r = lcg(31), riceG = new THREE.SphereGeometry(.0035, 6, 4), kumG = new THREE.IcosahedronGeometry(.004, 0);
    for (let i = 0; i < 220; i++) { const red = i % 3 === 0, m = mesh3(S, red ? kumG : riceG, red ? std3('#D0141C', .6, { emissive: '#500006', emissiveIntensity: .5 }) : std3('#F6F0E2', .7), [0, 0, 0], { cast: false, scale: red ? 1 : [1, 1, 2.2] });
      SHW.push({ m, x: (r() - .5) * 1.0, z: -.2 + r() * .6, t0: r() * 1.1, v: .9 + r() * .5, sp: r() * 6, land: r() < .5 ? CHR.top + .02 : .01 }); } }
  // the pheras: a ring of light where the plate passed
  const PTR = []; for (let i = 0; i < 90; i++) PTR.push(glow3(S, [0, 0, 0], .1, '#FFC060', 0));
  // the aarti lamp (camphor: a tall white-gold flame) and its trail
  const AL = new THREE.Group(); S.add(AL);
  mesh3(AL, lathe3(smooth3([[0, -.09], [.035, -.09], [.04, -.08], [.016, -.05], [.014, -.02], [.06, -.005], [.075, .005], [.07, .012], [0, .01]], 3), 32), brass, [0, 0, 0], { cast: false, scale: .8 });
  const alF = flame3(AL, [0, .012, 0], 1.0, { light: false, col: '#FFE0A0', seed: 3.3 });
  const alLight = new THREE.PointLight('#FFC070', 0, 3, 1.5); alLight.position.set(0, .1, 0); AL.add(alLight);
  const ATR = []; for (let i = 0; i < 50; i++) ATR.push(glow3(S, [0, 0, 0], .05, '#FFD080', 0));
  // sindoor dust
  const SND = []; for (let i = 0; i < 40; i++) SND.push(mesh3(S, new THREE.IcosahedronGeometry(.003, 0), std3('#E01418', .5, { emissive: '#7A0008', emissiveIntensity: .8 }), [0, 0, 0], { cast: false }));
  const halo = glow3(S, [0, 0, 0], .8, '#FFD27A', 0), glint = glow3(S, [0, 0, 0], .4, '#FFF0C0', 0);
  const motes = motes3(S, { n: 160, box: [-2, .1, -1.6, 2, 2.6, .6], size: .005, col: '#FFE2B0', drift: [.015, .02, 0] });

  // ---- set(t, o) ----
  // o.light (dusk 0 golden .. 1 blue hour), o.clean (0 dusty .. 1), o.rangoli (0..1 drawn outward), o.cane (0..1 the four
  // stalks rise, one after another), o.strings, o.toran, o.chunari, o.bangles, o.neck, o.bindi, o.sindoor (0..1 the mark),
  // o.sindoorDust (age), o.groom (0..1 the stone sits), o.dhoti, o.tilak, o.gmala, o.bath (0..1 the lota pours),
  // o.ganesha (lamp), o.kalash, o.thali, o.incense, o.akshat, o.leaves, o.diyas (0..1 or [k]), o.niche, o.door (0..1 open),
  // o.kanya (0..1 pouring), o.thread (0..1 grown), o.shower (age), o.phera (rounds done, 0..7; null = the stone home),
  // o.aarti { p, on, trail }, o.bhog { cane, amla, ber, potato, kheer }, o.halo [x,y,z,k,size], o.glint, o.motes
  const set = (t, o = {}) => {
    const L = clamp(o.light ?? .3);
    sun.intensity = lerp(2.8, .25, L); sun.color.set('#FFA45A').lerp(new THREE.Color('#FF7A4A'), L); sun.position.set(-7, lerp(2.6, 1.2, L), 3.5);
    hemi.intensity = lerp(.55, .45, L); hemi.color.set('#B0A8D8').lerp(new THREE.Color('#5A62A8'), L);
    fill.intensity = lerp(.45, .65, L); fill.color.set('#FFC898').lerp(new THREE.Color('#FFB070'), L);
    S.fog.color.set('#5A3A48').lerp(new THREE.Color('#1E1A34'), L);
    sky.material.color.set('#FFFFFF').lerp(new THREE.Color('#8A86B8'), L); moonGlow.material.opacity = .15 + .2 * L; stars.forEach(([st, r]) => st.material.opacity = clamp((L - .4 - r * .4) * 3) * (.6 + .4 * Math.sin(t * 2 + r * 20)));
    inner.intensity = 2.4 * clamp(o.door ?? .4) * (.6 + .4 * L); D.open(o.door ?? .4); winM.emissiveIntensity = .4 + 1.0 * L;
    TORD.set(t, { wind: .3, on: o.toran ?? 1 }); TORM.set(t, { wind: .3, on: 1 });
    const rg = o.rangoli ?? 1; RG.visible = rg > .01; RG.scale.setScalar(Math.max(.01, easeOut(rg))); RG.material.opacity = clamp(rg * 2);
    // the mandap
    const ck = o.cane ?? 1; CANES.forEach((C, i) => { const k = clamp(ck * 4 - i); C.group.visible = k > .01 && !(o.hideFront && i < 2); C.group.scale.set(1, Math.max(.01, easeOut(k)), 1); });
    tie.visible = ck > .99; MSTR.visible = (o.strings ?? 1) > .01; MSTR.scale.setScalar(lerp(.96, 1, o.strings ?? 1));
    // the bride's things
    const cu2 = o.chunari ?? 1; chunari.visible = cu2 > .01; chuM.opacity = clamp(cu2 * 1.5); CHU.position.y = tulTop - .1 + (1 - easeOut(cu2)) * .3;
    BANG.visible = (o.bangles ?? 1) > .01; BANG.scale.setScalar(easeOut(clamp(o.bangles ?? 1)) || .001);
    NECK.visible = (o.neck ?? 1) > .01;
    bindi.visible = (o.bindi ?? 1) > .01; bindi.scale.setScalar(Math.max(.01, easeOut(clamp(o.bindi ?? 1)))); haldi.visible = bindi.visible;
    const sd = o.sindoor ?? 1; sindoor.visible = sd > .01; sindoor.scale.set(Math.max(.01, sd), .5 * Math.max(.01, sd), 1.4 * Math.max(.01, sd));
    const sdA = o.sindoorDust; SND.forEach((p, i) => { const a = sdA == null ? -1 : sdA - hash(i) * .3; p.visible = a > 0 && a < .7; if (!p.visible) return; p.position.set((hash(i + 3) - .5) * .05, tulTop + .25 - a * a * .5, -.0 + .05 + (hash(i + 5) - .5) * .04); });
    // the groom
    const gk = o.groom ?? 1; SING.visible = gk > .01;
    const ph = o.phera;
    if (ph == null) { STG.position.set(0, GROOM_Y - .025 + (1 - easeOut(gk)) * .25, 0); STG.rotation.y = 0; }
    STG.visible = gk > .01;
    dhotiG.visible = (o.dhoti ?? 1) > .01; dhotiG.scale.setScalar(lerp(1.3, 1, easeOut(clamp(o.dhoti ?? 1))));
    tilakG.visible = (o.tilak ?? 1) > .01; groomMala.visible = (o.gmala ?? 1) > .01;
    const bt = o.bath ?? 0; lota.visible = bt > .01; lota.position.set(GRM[0] + .2, GROOM_Y + .3, GRM[2] + .03); lota.rotation.set(0, 0, lerp(0, 1.2, clamp(bt * 3)));
    bathPour.set(t, clamp(bt * 2 - .3));
    DROPS.forEach((s, i) => { const a = ((t * 1.7 + hash(i) * 3) % 1); s.visible = bt > .4; if (!s.visible) return; const ang = hash(i + 7) * TAU, r = .02 + a * .06;
      s.position.set(GRM[0] + Math.cos(ang) * r, GROOM_Y + .01 + a * .05 - a * a * .12, GRM[2] + .03 + Math.sin(ang) * r); s.material.opacity = 1 - a; });
    // Ganesha, the kalash
    GAN.k({ dress: 1, mala: o.gmalaG ?? 1, tilak: 1 }); ganLamp.set(t, o.ganesha ?? 1); KAL.visible = (o.kalash ?? 1) > .01;
    // the thali
    TH.visible = (o.thali ?? 1) > .01; thaliDiya.set(t, o.thali ?? 1);
    leafBowl.forEach(l => l.visible = (o.leaves ?? 1) > .01);
    const inc = o.incense ?? 1; embers.forEach(e => e.material.opacity = .8 * inc * (.8 + .2 * Math.sin(t * 9)));
    SMK.forEach((s, i) => { const tp = tips[i % 2], per = 3.4, a = ((t / per + i / SMK.length) % 1), h = a * .9;
      s.position.set(tp[0] + Math.sin(t * .7 + i) * .03 * h * 3 + h * .1, tp[1] + h, tp[2] + Math.cos(t * .5 + i * 2) * .02 * h * 3);
      s.scale.setScalar(.04 + h * .25); s.material.opacity = inc * .2 * Math.sin(a * Math.PI) * (1 - a * .4); s.material.rotation = i + t * .2; });
    // lamps
    const dk = o.diyas ?? 1; diyas.forEach((d, i) => d.set(t, Array.isArray(dk) ? dk[i] : dk)); plDiyas.forEach(d => d.set(t, Array.isArray(dk) ? dk[0] : dk));
    nicheLamp.set(t, o.niche ?? 1);
    // the bhog
    const bh = o.bhog || {}; for (const k in BH) { const v = clamp(bh[k] ?? (o.bhog ? 0 : 1)); BH[k].visible = v > .01; BH[k].position.y = (1 - easeOut(v)) * .12; }
    BHG.visible = o.bhog !== false;
    // the kanyadaan
    const ky = o.kanya ?? 0; kLota.visible = ky > .01; kLota.position.set(.24, 1.04, .4); kLota.rotation.set(0, 0, lerp(0, 1.25, clamp(ky * 3))); kPour.set(t, clamp(ky * 2 - .35));
    // the thread
    const th = clamp(o.thread ?? 1); THR.forEach(T => { T.m.visible = th > .01; T.m.geometry.setDrawRange(0, Math.floor(th * T.n) * 6 * 6); });
    // the shower
    const sa = o.shower; SHW.forEach(P => { const a = sa == null ? -1 : sa - P.t0; P.m.visible = a > 0 && sa < 5; if (!P.m.visible) return;
      const y = Math.max(P.land, 2.0 - a * P.v - a * a * .6), still = y <= P.land; P.m.position.set(P.x + (still ? 0 : Math.sin(a * 4 + P.sp) * .02), y, P.z); P.m.rotation.set(a * 5 + P.sp, a * 3, 0); });
    // the pheras: the stone on its plate goes round the chaura (sunwise: east, south, west, north), and leaves a trail
    if (ph != null) {
      const ang = (q) => Math.PI * .2 + q * TAU, R = .5, pos = (q) => [Math.cos(ang(q)) * R, .78 + .03 * Math.sin(q * TAU * 2), Math.sin(ang(q)) * R];
      const p = pos(ph); STG.position.set(p[0] - GRM[0], p[1], p[2] - GRM[2]); STG.rotation.y = -ang(ph);
      PTR.forEach((g, i) => { const q = ph - i * .012; g.visible = q > 0 && ph < 7.2; if (!g.visible) return; const pp = pos(q); g.position.set(pp[0], pp[1] - .02, pp[2]); g.material.opacity = .7 * (1 - i / PTR.length); g.scale.setScalar(.1 * (1 - i / PTR.length * .5)); });
    } else PTR.forEach(g => g.visible = false);
    // the aarti
    const ar = o.aarti; AL.visible = !!ar && ar.on > .01;
    if (ar) { AL.position.set(...ar.p); alF.set(t, ar.on); alLight.intensity = 2.6 * ar.on * (.9 + .1 * vnoise(t * 8, 4));
      ATR.forEach((g, i) => { const p = ar.trail && ar.trail[i]; g.visible = !!p; if (p) { g.position.set(...p); g.material.opacity = ar.on * .45 * (1 - i / ATR.length); g.scale.setScalar(.05 * (1 - i / ATR.length * .5)); } }); }
    else { alLight.intensity = 0; ATR.forEach(g => g.visible = false); }
    const ha = o.halo; halo.visible = !!ha; if (ha) { halo.position.set(ha[0], ha[1], ha[2]); halo.material.opacity = ha[3]; halo.scale.setScalar(ha[4] ?? .8); }
    const gl = o.glint; glint.visible = !!gl; if (gl) { glint.position.set(gl[0], gl[1], gl[2]); glint.material.opacity = gl[3]; glint.scale.setScalar(gl[4] ?? .4); }
    motes.set(t, o.motes ?? .8);
  };
  return { S, set, TUL, tulTop, CHG, SG, STG, GAN, GNG, KAL, TH, KK, BHG, CANES, apex, thali: [TX, 0, TZ], groom: [GRM[0], GROOM_Y, GRM[2]], gan: [GNS[0] - .08, .233, GNS[2] - .02], thrCurve };
})();
