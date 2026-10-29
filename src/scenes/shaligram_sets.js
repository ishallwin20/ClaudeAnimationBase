// shaligram_sets.js: the sets of "This stone is 150 MILLION years old" (ad 61), all in the film look (cine3d_fx.js).
//   studio3()   the stone on maroon puja cloth in a dark studio: gold (the Purana's light) or cold (science's)
//   altar3()    a home mandir at lamp time: dark wood, a brass plate, the Shaligram, tulsi leaves, a diya, a lota pouring
//   stage3()    the Purana's stage: a dark void over wet black slate; a tulsi sprig in its light, Vishnu's light that
//               falls and hardens into the stone, a river of light pouring from where Tulsi stood, the tulsi bush
//   sea3()      the Tethys sea 150 million years ago: sand, crinoids, sponges, ammonites, sunbeams, caustics, plankton;
//               and above it, for the over-under shot, a Jurassic shore at sunset with a sauropod
//   strata3()   the geology block: India's plate driving into Asia's, the sea-floor layers (fossils in them) folding up
//               into peaks, the sea draining off, snow
//   valley3()   the Kali Gandaki (1 unit = 10 m): a deep gorge, a braided gravel riverbed, snow peaks, dawn or day
// Units are the stone's (the stone is 2 wide, ~6 cm) in studio3 and altar3, metres elsewhere unless noted.

// a gradient backdrop: a sphere round everything, top colour to bottom colour
function backdrop3(scene, top, mid, bot, r = 60) {
  const t = tex3('bd' + top + mid + bot, 4, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, top); gr.addColorStop(.55, mid); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, 4, 256); });
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false, depthWrite: true }));
  scene.add(m); return m;
}
// a cloth: a plane with soft folds
function cloth3(parent, w, d, mat, pos, o = {}) {
  const g = new THREE.PlaneGeometry(w, d, 160, 160), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), calm = o.calm ? smooth01((Math.hypot(x, y) - o.calm) / 3) : 1; p.setZ(i, (o.fold ?? .12) * calm * (fbm3(x * .35, y * .35, 2) + .4 * Math.sin(x * .7 + y * .2))); }
  g.computeVertexNormals();
  return mesh3(parent, g, mat, pos, { rot: [-Math.PI / 2, 0, o.yaw ?? 0] });
}

// ================= the studio =================
function studio3() {
  const S = new THREE.Scene();
  const bd = backdrop3(S, '#050407', '#0E0A0C', '#1A0E0C');
  const ENV = { gold: studioEnv3({ floor: .5, boxes: [[-6, 6, 5, 6, 4, 6], [7, 3, 1, 1.2, 8, 5], [0, 4, -8, 9, 2.4, 8], [0, 12, 0, 6, 6, 2]] }),
    cold: studioEnv3({ room: '#06080C', boxes: [[-5, 6, 6, 5, 5, 5], [6, 2, 3, 1, 7, 6], [0, 5, -8, 10, 2, 7]] }) };
  const clothM = pbr3('redwool', { rep: [5, 5], tint: '#7A1E1A', normalK: .7 });
  const cl = cloth3(S, 40, 40, clothM, [0, -.8, 0], { fold: .2, calm: 1.6 });
  S.fog = new THREE.Fog('#070405', 13, 26);
  const shadow = blob3(S, [0, -.8, .05], 1.6, .85); shadow.scale.set(1, .65, 1);
  const SG = shaligram3(S); SG.group.position.set(0, 0, 0);
  const key = new THREE.DirectionalLight('#FFF0DC', 2.4); key.position.set(-3, 6, 5); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: .5, far: 20 }); key.shadow.radius = 7; key.shadow.bias = -.0004; key.shadow.normalBias = .02; S.add(key, key.target);
  const rim = new THREE.SpotLight('#FFB868', 60, 20, .5, .7, 1.4); rim.position.set(3.5, 3, -5); S.add(rim, rim.target);
  const fill = new THREE.PointLight('#FFC890', 3, 12, 1.5); fill.position.set(2, 1, 4); S.add(fill);
  const motes = motes3(S, { n: 120, box: [-6, -.8, -8, 6, 5, 4], size: .006, col: '#FFDDA8', drift: [.03, .05, 0] });
  // the look: gold (warm key, gold rim) or cold (science: blue-white key, steel rim); k 0..1 blends them
  const look = (k = 0, t = 0) => {
    S.environment = k < .5 ? ENV.gold : ENV.cold; S.environmentIntensity = lerp(.9, .8, k);
    key.color.set('#FFF0DC').lerp(new THREE.Color('#DCEBFF'), k); key.intensity = lerp(2.4, 2.8, k);
    rim.color.set('#FFB868').lerp(new THREE.Color('#9CC8FF'), k); rim.intensity = lerp(60, 70, k);
    fill.color.set('#FFC890').lerp(new THREE.Color('#A8C4E8'), k); fill.intensity = lerp(3, 2, k);
    clothM.color.set('#7A1E1A').lerp(new THREE.Color('#2A2C34'), k);
    motes.set(t, .6);
  };
  return { S, SG, key, rim, fill, cloth: cl, motes, look, shadow };
}

// ================= the altar =================
// a brass plate, a diya, a lota and marigolds, in stone units (the stone 2 wide); the plate at the origin
function altar3() {
  const S = new THREE.Scene();
  env3(S, 'lamplit', { k: .7 });
  backdrop3(S, '#0A0605', '#120A07', '#1A0F0A');
  const wood = pbr3('darkwood', { rep: [3, 2], tint: '#8A6A54' });
  block3(S, 40, 1.2, 22, wood, [0, -2.2, -2]);
  // the back wall, far, with a row of lamps the lens blurs into bokeh
  box3(S, 80, 30, .5, pbr3('darkwood', { rep: [6, 3], tint: '#4A3428' }), [0, 10, -26], { cast: false });
  const far = [...Array(9)].map((_, i) => flame3(S, [-14 + i * 3.5, -.2 + (i % 2) * .4, -16 - (i % 3) * 2], 9, { light: false, seed: i * 2.1 }));
  const brass = new THREE.MeshPhysicalMaterial({ color: '#7A5A28', metalness: 1, roughness: .45, clearcoat: .15, side: THREE.DoubleSide, envMapIntensity: .32 });
  const plate = mesh3(S, lathe3([[0, -.96], [2.9, -.96], [3.3, -.82], [3.45, -.7], [3.5, -.64]], 128), brass, [0, 0, 0]);
  const SG = shaligram3(S); SG.group.position.set(0, -.42, 0);
  // water on the plate (an abhishek), and the drops
  const pool = mesh3(S, new THREE.CircleGeometry(2.85, 96), new THREE.MeshPhysicalMaterial({ color: '#C8B088', transparent: true, opacity: 0, roughness: .02, metalness: 0, transmission: 0, clearcoat: 1 }), [0, -.97, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // the lota, pouring from up and to the right
  const lota = new THREE.Group(); S.add(lota);
  mesh3(lota, lathe3(smooth3([[0, 0], [.9, .05], [1.35, .6], [1.4, 1.1], [1.1, 1.6], [.6, 1.85], [.62, 2.1], [.8, 2.25], [.82, 2.3]]), 96), new THREE.MeshPhysicalMaterial({ color: '#C9773E', metalness: 1, roughness: .25 }), [0, 0, 0]);
  const pour = stream3(S, [[2.8, 3.2, .4], [2.1, 2.6, .3], [1.0, 1.6, .2], [.2, .7, .15]], .07, { speed: 3.2, col: '#E8F4FF', glow: '#3A5A70', opacity: .8 });
  // the diya, front left
  const diyaM = new THREE.MeshStandardMaterial({ color: '#8A4A2A', roughness: .8 });
  mesh3(S, lathe3([[0, -1], [.9, -1], [1.2, -.7], [1.25, -.5], [1.1, -.48]], 64), diyaM, [-4.6, -.95, 2.2], { scale: [1, 1, 1.2] });
  const flame = flame3(S, [-4.6, -.45, 2.6], 9, { power: 14, range: 26, col: '#FFA040' });
  // rose petals scattered on the wood round the plate
  { const r = lcg(19), pg = new THREE.SphereGeometry(1, 16, 8, 0, TAU, 0, .7); pg.scale(1, .25, .8);
    const pm = [new THREE.MeshPhysicalMaterial({ color: '#B0122A', roughness: .45, sheen: .8, sheenColor: new THREE.Color('#FF8090'), side: THREE.DoubleSide }), new THREE.MeshPhysicalMaterial({ color: '#D8304A', roughness: .45, sheen: .8, sheenColor: new THREE.Color('#FFA0B0'), side: THREE.DoubleSide })];
    for (let i = 0; i < 26; i++) { const a = r() * TAU, rr = 4 + r() * 3.5; if (Math.sin(a) > .55) continue; mesh3(S, pg, pm[i % 2], [Math.cos(a) * rr, -.98, Math.sin(a) * rr * .8 - .4], { scale: .35 + r() * .25, rot: [(r() - .5) * .4, r() * 6, (r() - .5) * .4] }); } }
  // tulsi leaves: three resting on the stone, one falling (for "never without tulsi")
  const leaves = [0, 1, 2].map(() => tulsiLeaf3(S, .8));
  const fall = tulsiLeaf3(S, .85);
  const set = (t, o = {}) => {
    far.forEach((f, i) => f.set(t, 1));
    flame.set(t, 1);
    const lo = o.lota ?? 0; lota.visible = lo > 0; lota.position.set(lerp(6, 3.4, lo), lerp(6, 3.6, lo), .5); lota.rotation.set(0, 0, lerp(.2, 1.7, lo));
    pour.set(t, o.pour ?? 0); pool.material.opacity = .45 * clamp(o.wet ?? 0);
    leaves.forEach((l, i) => { l.visible = (o.leaves ?? 0) > i; const a = i * 2.1 + .4, x = Math.cos(a) * .3, z = Math.sin(a) * .25 + .1; l.position.set(x, onStone(SG, x, z) + .02, z); l.rotation.order = 'YXZ'; l.rotation.set(-Math.PI / 2 + .15, a, 0); });
    const f = o.fall ?? -1; fall.visible = f >= 0;
    if (f >= 0) { const k = easeOut(clamp(f)); fall.position.set(lerp(1.2, .1, k) + .3 * Math.sin(f * 7) * (1 - k), lerp(5, onStone(SG, .1, .25) + .04, k), lerp(.8, .25, k)); fall.rotation.order = 'YXZ'; fall.rotation.set(-Math.PI / 2 + .15 + (1 - k) * Math.sin(f * 9) * .7, 1.2 + (1 - k) * 2, (1 - k) * Math.cos(f * 6) * .5); }
  };
  set(0);
  return { S, SG, set, plate, flame };
}

// marigold3(parent, pos, r, seed): a marigold head: a ball ruffled into many petal folds, deep orange inside, gold tips
function marigold3(parent, pos, r = .5, seed = 0) {
  const g = new THREE.IcosahedronGeometry(1, 7), p = g.attributes.position, col = [], d = V3(), c0 = new THREE.Color('#C8500A'), c1 = new THREE.Color('#FFB020');
  for (let i = 0; i < p.count; i++) {
    d.set(p.getX(i), p.getY(i), p.getZ(i)).normalize();
    const ruf = Math.abs(Math.sin(d.x * 23 + seed) * Math.sin(d.y * 21 + seed * 2) * Math.sin(d.z * 25)), n = .5 + .5 * noise3(d.x * 6 + seed, d.y * 6, d.z * 6);
    const k = .88 + .1 * Math.pow(ruf, .6) + .05 * n; p.setXYZ(i, d.x * k, d.y * k * .72, d.z * k);
    const cc = c0.clone().lerp(c1, clamp(Math.pow(ruf, .7) * .8 + .2 * n)); col.push(cc.r, cc.g, cc.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
  return mesh3(parent, g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .75 }), pos, { scale: r });
}

// the height of the stone's top surface over (x, z) in its parent's space (a ray cast down onto the whole stone)
const RAY3 = new THREE.Raycaster(), ONSTONE = new Map();
function onStone(SG, x, z) {
  const r = SG.group.rotation, p = SG.group.position, key = [x, z, r.x, r.y, r.z, p.x, p.y, p.z].map(v => v.toFixed(3)).join();
  if (ONSTONE.has(key)) return ONSTONE.get(key);
  SG.group.updateMatrixWorld(true);
  RAY3.set(V3(x, 20, z).applyMatrix4(SG.group.parent.matrixWorld), V3(0, -1, 0));
  const hit = RAY3.intersectObject(SG.whole, false)[0];
  const y = hit ? SG.group.parent.worldToLocal(hit.point.clone()).y : 0; ONSTONE.set(key, y); return y;
}

// ---------- shared: water, mountains ----------
// a rippled water normal map (sines in several directions), scrolled per frame
const waterNormal3 = () => tex3('wN', 512, 512, (g, w, h) => {
  const o = g.createImageData(w, h), W2 = [[3, 1, .9], [-2, 4, .7], [5, -3, .5], [1, 7, .35], [-6, -2, .3]];
  const H_ = (x, y) => W2.reduce((s, [a, b, k], i) => s + k * Math.sin((a * x + b * y) / w * TAU + i * 1.7), 0);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = (H_(x + 1, y) - H_(x - 1, y)) * 6, dy = (H_(x, y + 1) - H_(x, y - 1)) * 6, l = Math.hypot(dx, dy, 1), k = (y * w + x) * 4;
    o.data[k] = (-dx / l * .5 + .5) * 255; o.data[k + 1] = (dy / l * .5 + .5) * 255; o.data[k + 2] = (1 / l * .5 + .5) * 255; o.data[k + 3] = 255;
  }
  g.putImageData(o, 0, 0);
}, { data: true });
function waterSurf3(o = {}) {
  const n1 = waterNormal3().rep(o.rep ?? 20, o.rep ?? 20), n2 = waterNormal3().rep((o.rep ?? 20) * 1.7, (o.rep ?? 20) * 1.3);
  const m = new THREE.MeshPhysicalMaterial({ color: o.col || '#2A4A50', roughness: o.rough ?? .06, metalness: 0, normalMap: n1, clearcoat: 1, clearcoatRoughness: .05, clearcoatNormalMap: n2, normalScale: new THREE.Vector2(.35, .35), transparent: true, opacity: o.opacity ?? .92, emissive: o.glow || '#000000' });
  m.flow = (t, sp = 1) => { n1.offset.set(t * .02 * sp, t * .05 * sp); n2.offset.set(-t * .015 * sp, t * .07 * sp); };
  return m;
}
// a ridged noise 0..1 (sharp crests), 2D
const ridge2 = (x, z, n = 6) => { let s = 0, a = .5, f = 1, w = 1; for (let i = 0; i < n; i++) { let r = 1 - Math.abs(noise3(x * f + 17, 0.5, z * f - 9)); r *= r * w; w = clamp(r * 1.7); s += a * r; f *= 2.05; a *= .5; } return s; };
// mountains3(parent, o): a far range of snow peaks: a heightfield over [x0, x1] × [z0, z1] (metres), peaks to o.h,
// rock and snow coloured per vertex (snow above o.snow and on gentle slopes), o.seed
function mountains3(parent, o = {}) {
  const [x0, x1, z0, z1] = o.box || [-1500, 1500, -2600, -500], nx = o.nx ?? 360, nz = o.nz ?? 140, H0 = o.h ?? 700, sc = o.scale ?? 1 / 700, sd = o.seed ?? 3;
  const g = new THREE.PlaneGeometry(x1 - x0, z1 - z0, nx, nz); g.rotateX(-Math.PI / 2); g.translate((x0 + x1) / 2, 0, (z0 + z1) / 2);
  const p = g.attributes.position, col = new Float32Array(p.count * 3);
  const hAt = (x, z) => { const near = smooth01((z1 - z) / ((z1 - z0) * .35)); return H0 * (.25 + .9 * ridge2(x * sc + sd, z * sc)) * near * (o.shape ? o.shape(x, z) : 1) + (o.base ?? 0); };
  for (let i = 0; i < p.count; i++) p.setY(i, hAt(p.getX(i), p.getZ(i)));
  g.computeVertexNormals();
  const nrm = g.attributes.normal, rock = new THREE.Color(o.rock || '#5E564E'), rock2 = new THREE.Color('#3A3430'), snow = new THREE.Color('#F4F6FA'), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i), slope = nrm.getY(i), nn = noise3(p.getX(i) * .02, 1, p.getZ(i) * .02);
    const sn = smooth01((y - (o.snow ?? H0 * .55) + nn * 60) / 80) * smooth01((slope - .45) / .25);
    c.copy(rock).lerp(rock2, clamp(.5 + nn)).lerp(snow, sn); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const nm = (window.PBR3DATA || {}).mountain ? imgTex3('pbr_mountain_normal', PBR3DATA.mountain.normal, { data: true }).rep(nx / 6, nz / 6) : null;
  const m = mesh3(parent, g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .9, normalMap: nm, normalScale: new THREE.Vector2(1.2, 1.2) }), [0, 0, 0], { cast: false });
  m.hAt = hAt; return m;
}


// ================= the Purana's stage (stone units) =================
// ribbon3(parent, pts, w, mat): a flat strip along a curve on the floor (uv: u along, v across)
function ribbon3(parent, pts, w, mat, n = 200) {
  const cv = new THREE.CatmullRomCurve3(pts.map(p => V3(...p))), pos = [], uv = [], idx = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, p = cv.getPoint(u), tg = cv.getTangent(u), side = V3(-tg.z, 0, tg.x).normalize(), ww = w * (.7 + .3 * Math.sin(u * 9) * Math.sin(u * 3.7));
    for (const s of [-1, 1]) { pos.push(p.x + side.x * ww * s / 2, p.y, p.z + side.z * ww * s / 2); uv.push(u, (s + 1) / 2); }
    if (i < n) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  const m = mesh3(parent, g, mat, [0, 0, 0], { cast: false, receive: false }); m.curve = cv; return m;
}
function stage3() {
  const S = new THREE.Scene();
  backdrop3(S, '#020205', '#05060A', '#0A0A10');
  S.environment = studioEnv3({ room: '#030306', boxes: [[0, 10, -6, 12, 3, 1.2], [-8, 4, 4, 2, 6, .8]] }); S.environmentIntensity = .6;
  S.fog = new THREE.Fog('#020205', 18, 46);
  const slate = new THREE.MeshPhysicalMaterial({ color: '#0B0B10', roughness: .22, metalness: 0, clearcoat: 1, clearcoatRoughness: .12,
    normalMap: imgTex3('pbr_cliff_normal', PBR3DATA.cliff.normal, { data: true }).rep(10, 10), normalScale: new THREE.Vector2(.07, .07) });
  const floor = mesh3(S, new THREE.PlaneGeometry(120, 120), slate, [0, -.86, 0], { rot: [-Math.PI / 2, 0, 0] });
  // Tulsi: a sprig in a pool of soft light (left), later the bush grows there
  const sprig = tulsi3(S, { h: 2.1, stems: 1, seed: 12, flowers: 1 }); sprig.group.position.set(-1.5, -.86, -.6);
  const bush = tulsi3(S, { h: 3.4, stems: 6, seed: 9, flowers: .7 }); bush.group.position.set(-1.9, -.86, -1.5);
  const tulsiL = new THREE.SpotLight('#D8FFE8', 0, 30, .42, .8, 1.2); tulsiL.position.set(-2.5, 9, 3); tulsiL.target.position.set(-1.6, -.5, -.8); tulsiL.castShadow = true; tulsiL.shadow.mapSize.set(1024, 1024); S.add(tulsiL, tulsiL.target);
  const TULSI = being3(S, '#B8FFD8', .45);
  // the dew drop (her tear) on a leaf, then falling
  const drop = mesh3(S, new THREE.SphereGeometry(.09, 24, 16), new THREE.MeshPhysicalMaterial({ color: '#FFFFFF', roughness: 0, transmission: 1, thickness: .2, ior: 1.33 }), [0, 0, 0], { scale: [1, 1.2, 1] });
  // Vishnu's light (right), and the stone it becomes
  const VISH = being3(S, '#FFD27A', .42);
  const vishL = new THREE.SpotLight('#FFE0A8', 0, 30, .36, .8, 1.2); vishL.position.set(3, 10, 4); vishL.target.position.set(.9, -.5, .4); vishL.castShadow = true; vishL.shadow.mapSize.set(1024, 1024); S.add(vishL, vishL.target);
  const SG = shaligram3(S); SG.group.position.set(.9, -.08, .5); SG.group.rotation.set(-.5, -.35, 0);
  // the river of light: from where Tulsi stood, curving round behind the stone and away
  const riverM = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide,
    uniforms: { t: { value: 0 }, k: { value: 0 }, front: { value: 0 }, col: { value: new THREE.Color('#8FFFE8') } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
    fragmentShader: `uniform float t, k, front; uniform vec3 col; varying vec2 vUv;
      void main() { float edge = smoothstep(0., .3, vUv.y) * smoothstep(1., .7, vUv.y), core = smoothstep(.25, .5, vUv.y) * smoothstep(.75, .5, vUv.y);
        float on = smoothstep(front, front - .03, vUv.x);
        float fl = .55 + .45 * sin(vUv.x * 220. - t * 7. + sin(vUv.y * 11. + vUv.x * 40.) * 2.2) * sin(vUv.x * 90. - t * 3.3 + vUv.y * 5.);
        gl_FragColor = vec4(col * (edge * fl * .8 + core * .6) * on * k, 1.); }` });
  const river = ribbon3(S, [[-1.4, -.8, -.4], [-.6, -.8, -2.4], [1.4, -.8, -2.6], [3, -.8, -1.4], [5, -.8, -2.6], [7, -.8, -7], [10, -.8, -16]], 1.6, riverM);
  const riverL = [0, .25, .5, .75].map(u => { const l = new THREE.PointLight('#8FFFE8', 0, 9, 1.6); l.position.copy(river.curve.getPoint(u)).add(V3(0, .4, 0)); S.add(l); return l; });
  const motes = motes3(S, { n: 220, box: [-8, -.8, -8, 8, 5, 4], size: .006, col: '#FFE8C8', drift: [.02, .04, 0] });
  const set = (t, o = {}) => {
    sprig.grow(o.sprig ?? 0); bush.grow(o.bush ?? 0);
    tulsiL.intensity = 160 * (o.tulsiL ?? 0); vishL.intensity = 160 * (o.vishL ?? 0);
    TULSI.set(o.tulsiAt || [-1.45, .95, -.7], o.tulsi ?? 0, t); VISH.set(o.vishAt || [1.0, 1.4, .5], o.vish ?? 0, t);
    drop.visible = !!o.drop; if (o.drop) drop.position.set(...o.drop);
    riverM.uniforms.t.value = t; riverM.uniforms.k.value = o.river ?? 0; riverM.uniforms.front.value = o.front ?? 0;
    riverL.forEach((l, i) => l.intensity = 14 * (o.river ?? 0) * clamp(((o.front ?? 0) - i * .25) * 6));
    motes.set(t, .5);
  };
  set(0);
  return { S, SG, sprig, bush, set, river };
}

// ================= the Tethys sea, 150 million years ago (metres) =================
// crinoid3(parent, pos, h, seed): a sea lily: a jointed stalk swaying, a cup, ten feathery arms opening up
function crinoid3(parent, pos, h = 1.4, seed = 0) {
  const g = new THREE.Group(); g.position.set(...pos); parent.add(g);
  const m = new THREE.MeshPhysicalMaterial({ color: seed % 2 ? '#C89A7A' : '#B07A8E', roughness: .6, sheen: .5, sheenColor: new THREE.Color('#FFD0C0') });
  const r = lcg(seed + 5), bend = (r() - .5) * .5, cv = new THREE.QuadraticBezierCurve3(V3(0, 0, 0), V3(bend * h, h * .5, 0), V3(bend * h * .6, h, (r() - .5) * .2));
  mesh3(g, new THREE.TubeGeometry(cv, 24, .018 * h, 8), m);
  const top = new THREE.Group(); top.position.copy(cv.getPoint(1)); g.add(top);
  mesh3(top, new THREE.SphereGeometry(.05 * h, 16, 12), m, [0, 0, 0], { scale: [1, .8, 1] });
  for (let k = 0; k < 10; k++) {
    const a = k / 10 * TAU, arm = new THREE.CatmullRomCurve3([V3(0, 0, 0), V3(Math.cos(a) * .12 * h, .18 * h, Math.sin(a) * .12 * h), V3(Math.cos(a) * .2 * h, .3 * h, Math.sin(a) * .2 * h), V3(Math.cos(a) * .3 * h, .32 * h, Math.sin(a) * .3 * h)]);
    mesh3(top, new THREE.TubeGeometry(arm, 16, .012 * h, 6), m);
    for (let j = 1; j < 9; j++) { const p = arm.getPoint(j / 9); for (const s of [-1, 1]) mesh3(top, new THREE.CylinderGeometry(.002 * h, .004 * h, .07 * h, 4), m, [p.x + Math.cos(a + s * 1.4) * .03 * h, p.y + .02 * h, p.z + Math.sin(a + s * 1.4) * .03 * h], { rot: [Math.sin(a + s) * .9, 0, Math.cos(a + s) * .9], cast: false }); }
  }
  g.sway = (t) => { g.rotation.z = .06 * Math.sin(t * .7 + seed); g.rotation.x = .05 * Math.sin(t * .5 + seed * 2); top.rotation.y = t * .05; };
  return g;
}
function sea3() {
  const S = new THREE.Scene(); S.background = new THREE.Color('#03283C'); S.fog = new THREE.FogExp2('#0B4C66', .07);
  backdrop3(S, '#3A9CC0', '#0B4C66', '#0B4C66', 200).material.fog = false;
  S.environment = studioEnv3({ room: '#06405A', boxes: [[0, 14, 0, 20, 20, 3], [6, 4, 6, 6, 3, .6]] }); S.environmentIntensity = .7;
  const floor = new THREE.PlaneGeometry(80, 80, 200, 200); floor.rotateX(-Math.PI / 2);
  { const p = floor.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, .35 * Math.sin(x * .35 + z * .1) * Math.cos(z * .28) + .25 * fbm3(x * .15, 0, z * .15) + .06 * Math.sin(x * 3 + z * 1.2)); } floor.computeVertexNormals(); }
  mesh3(S, floor, pbr3('sand', { rep: [22, 22], tint: '#D8E4DA', normalK: 1.2 }), [0, 0, -14]);
  const rocks = []; { const r = lcg(71); for (let i = 0; i < 22; i++) rocks.push(mesh3(S, new THREE.DodecahedronGeometry(1, 2), pbr3('pebbles', { tint: '#7A9890', rep: [2, 2] }), [(r() - .5) * 26, .1, -2 - r() * 26], { scale: [.3 + r() * .9, .2 + r() * .5, .3 + r() * .8] })); }
  const lilies = []; { const r = lcg(13); for (let i = 0; i < 26; i++) lilies.push(crinoid3(S, [(r() - .5) * 18, 0, -3 - r() * 20], 1 + r() * 1.3, i)); }
  // sponges: barrels and vases
  { const r = lcg(29), sm = new THREE.MeshStandardMaterial({ color: '#D8A060', roughness: .9, bumpMap: pitNormal3(), bumpScale: 3 });
    for (let i = 0; i < 16; i++) { const h = .3 + r() * .7; mesh3(S, new THREE.CylinderGeometry(.15 + r() * .15, .1, h, 20, 1, true), sm, [(r() - .5) * 20, h / 2, -4 - r() * 18]); } }
  const sun = new THREE.DirectionalLight('#CFF6FF', 2.6); sun.position.set(3, 20, 4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 60 }); S.add(sun, sun.target, new THREE.HemisphereLight('#5FC0E0', '#0A2A30', .9));
  const CAU = caustics3(S, 50, 50, [0, .3, -12], { y: .2, scale: 1.1, k: 1.3, col: '#CFFAFF' });
  const SH = shafts3(S, { n: 16, top: 16, len: 20, area: [16, 16], at: [0, -10], col: '#BFF2FF', r: [.3, 1.2] });
  const MO = motes3(S, { n: 1400, box: [-6, 0, -16, 6, 12, 4], size: .006, col: '#D8FAFF', drift: [.04, .06, -.02] });
  // the surface seen from below: a bright sheet, brightest straight up (Snell's window), rippled by moving bands
  const surfM = new THREE.ShaderMaterial({ side: THREE.DoubleSide, fog: false, depthWrite: true,
    uniforms: { t: { value: 0 } },
    vertexShader: 'varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform float t; varying vec3 vW;
      void main() { vec3 d = normalize(vW - cameraPosition); float up = clamp(d.y, 0., 1.);
        float rip = .5 + .5 * sin(vW.x * 1.3 + t * 1.1 + sin(vW.z * .9 + t) * 1.6) * sin(vW.z * 1.1 - t * .8 + sin(vW.x * .7) * 1.4);
        vec3 deep = vec3(.03, .22, .32), sky = vec3(.75, .95, 1.05);
        vec3 c = mix(deep, sky, pow(up, 3.) * (.75 + .5 * rip)) + vec3(.9, 1., 1.) * pow(up, 18.) * 1.5;
        gl_FragColor = vec4(c, 1.); }` });
  surfM.flow = (t) => { surfM.uniforms.t.value = t; };
  const surf = mesh3(S, new THREE.PlaneGeometry(300, 300), surfM, [0, 12, -20], { rot: [Math.PI / 2, 0, 0], cast: false, receive: false });
  // the ammonites: a hero and a school
  const AMS = [];
  const am = (o) => { const A = ammonite3(S, o); AMS.push({ A, ...o }); return A; };
  am({ k: .22, ph: 0, path: (t) => [lerp(-2.2, 2.4, t / 7), 2.1 + .12 * Math.sin(t * 2.4), -1.2], yaw: 0 });
  { const r = lcg(91); for (let i = 0; i < 9; i++) { const y = 1.5 + r() * 5, z = -5 - r() * 10, x0 = (r() - .5) * 12, sp = .25 + r() * .3, ph = r() * 6, k = .1 + r() * .14;
    am({ k, ph, col: r() < .5 ? '#D8C4A0' : '#E8DCC8', band: r() < .5 ? '#6A3A20' : '#4A2A18', path: (t) => [x0 + sp * t, y + .1 * Math.sin(t * 2.4 + ph), z], yaw: 0 }); } }
  const set = (t, o = {}) => {
    CAU.set(t, 1); SH.set(t, o.shafts ?? 1); MO.set(t, .9); surfM.flow(t);
    lilies.forEach(l => l.sway(t));
    AMS.forEach((a, i) => {
      const p = a.path(t); a.A.group.position.set(...p);
      // swims backward (shell first, arms trailing): the aperture (+y in its frame) points back, so turn it so +y faces -x
      a.A.group.rotation.set(0, 0, Math.PI / 2 + .1 * Math.sin(t * 2.4 + a.ph)); a.A.group.rotation.y = a.yaw;
      a.A.set(t + a.ph, { swim: 1 });
    });
    const st = o.stone ?? 0, hero = AMS[0].A;   // the hero turning to stone: its colours drain to black, its arms shrink
    hero.shell.material.color.setScalar(1 - .96 * st); hero.shell.material.sheen = .2 * (1 - st); hero.shell.material.iridescence = .45 * (1 - st); hero.shell.material.clearcoat = .6 + .4 * st; hero.shell.material.roughness = .35 - .15 * st;
    hero.group.children.forEach(ch => { if (ch !== hero.shell) ch.scale.setScalar(1 - st); });
  };
  set(0);
  return { S, set, AMS, surf };
}
// the Jurassic shore above the water, at sunset: the sea surface, a coast of conifers and two sauropods
function shore3() {
  const S = new THREE.Scene();
  env3(S, 'dawn', { k: .8, bg: true, bgK: 1.1, rot: 3.6 });
  S.fog = new THREE.Fog('#E8B890', 200, 1600);
  const seaM = waterSurf3({ rep: 60, col: '#1A4A5A', rough: .04, opacity: 1 });
  mesh3(S, new THREE.PlaneGeometry(4000, 4000), seaM, [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const land = new THREE.PlaneGeometry(1400, 500, 200, 60); land.rotateX(-Math.PI / 2);
  { const p = land.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, Math.max(-2, 6 + 28 * smooth01((-z + 60) / 260) + 14 * fbm3(x * .01, 0, z * .01))); } land.computeVertexNormals(); }
  const dark = new THREE.MeshStandardMaterial({ color: '#2A2620', roughness: 1 });
  mesh3(S, land, dark, [0, 0, -520]);
  const sil = new THREE.MeshStandardMaterial({ color: '#1A1612', roughness: 1 });
  { const r = lcg(5); for (let i = 0; i < 160; i++) { const h = 10 + r() * 24, x = (r() - .5) * 1200, z = -300 - r() * 260; mesh3(S, new THREE.ConeGeometry(h * .18, h, 7), sil, [x, h / 2 + 4 + 10 * smooth01((-z - 280) / 200), z]); } }
  // a sauropod: body, a long rising neck, a small head, a long tail, four pillar legs
  const sauro = (x, z, s, yaw) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); g.rotation.y = yaw; S.add(g);
    mesh3(g, new THREE.SphereGeometry(1, 24, 16), sil, [0, 3.6, 0], { scale: [3.4, 1.7, 1.5] });
    const neck = new THREE.CatmullRomCurve3([V3(2.6, 4.2, 0), V3(4.6, 6.4, 0), V3(5.6, 9.2, 0), V3(6.2, 11.2, 0)]); mesh3(g, new THREE.TubeGeometry(neck, 20, .55, 10), sil);
    mesh3(g, new THREE.SphereGeometry(.6, 12, 10), sil, [6.6, 11.4, 0], { scale: [1.5, .8, .8] });
    const tail = new THREE.CatmullRomCurve3([V3(-2.6, 3.8, 0), V3(-5.5, 3.2, 0), V3(-8.5, 2.0, 0), V3(-11, 1.4, .8)]); mesh3(g, new THREE.TubeGeometry(tail, 20, .45, 10), sil);
    for (const [lx, lz] of [[1.8, .8], [1.8, -.8], [-1.8, .8], [-1.8, -.8]]) mesh3(g, new THREE.CylinderGeometry(.45, .5, 3.4, 10), sil, [lx, 1.7, lz]);
    return g;
  };
  sauro(-14, -150, 3.2, .35); sauro(34, -175, 2.5, -.2); sauro(70, -200, 2.0, .1);
  const sun = new THREE.DirectionalLight('#FFC890', 2); sun.position.set(-200, 60, -400); S.add(sun, sun.target);
  return { S, set: (t) => { seaM.flow(t, 2); } };
}

// ================= the geology block: India drives into Asia, the sea floor folds up into the Himalayas =================
// A slab 24 wide (x), 8 deep (z), its front face (z = +4) showing the layers. k 0..1: the crash. Between the two plates
// the Tethys's sea-floor layers (ammonites in the dark Spiti shale band, gold) are squeezed, folded and lifted into a
// range; the sea above drains; snow settles on the peaks.
function strata3() {
  const S = new THREE.Scene();
  backdrop3(S, '#0A0C12', '#141820', '#1A1C22');
  S.environment = studioEnv3({ floor: .3 }); S.environmentIntensity = .7;
  const key = new THREE.DirectionalLight('#FFF2E0', 2.2); key.position.set(-6, 14, 10); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 }); key.shadow.bias = -.0005; S.add(key, key.target);
  const NX = 260, NY = 48, NZ = 40, X0 = -10, X1 = 10, Y0 = -5, YT = 0, Z0 = -3.5, Z1 = 3.5;
  const LAYERS = [['#3A3430', -5], ['#5A4A3E', -3.9], ['#7A6A58', -3.1], ['#4A4A46', -2.4], ['#8C7A62', -1.75], ['#262422', -1.15], ['#A08A6C', -.55], ['#6A6A60', 0]];
  const colAt = (x, y0) => {
    const plate = x < -3.6 ? 'asia' : x > 3.6 ? 'india' : 'sea';
    if (plate === 'asia') return new THREE.Color(y0 > -1.5 ? '#5E6A58' : '#4A5246');
    if (plate === 'india') return new THREE.Color(y0 > -1.5 ? '#9A6A44' : '#7A4E34');
    for (const [c, top] of LAYERS) if (y0 <= top + 1e-6) return new THREE.Color(c);
    return new THREE.Color('#6A6A60');
  };
  // where a point of the undeformed slab goes at crash k
  const def = (x, y0, z, k) => {
    const comp = smooth01(k / .55), lift = smooth01((k - .3) / .7);
    const xs = x < -3.6 ? x : x < 3.6 ? -3.6 + (x + 3.6) * (1 - .55 * comp) : x - 7.2 * .55 * comp;
    const m = Math.exp(-Math.pow((xs + .4) / 2.2, 2)), depth = (y0 - Y0) / (YT - Y0);
    const y = y0 + comp * .9 * Math.sin(x * 2.6 + y0 * .9) * m * depth + lift * 6.2 * m * (.3 + .7 * depth);
    return [xs, y, z];
  };
  const topH = (x, z, k) => { const [xs, y] = def(x, 0, z, k), m = Math.exp(-Math.pow((xs + .4) / 2.2, 2)), lift = smooth01((k - .3) / .7); return y + lift * m * (2.2 * ridge2(xs * .5 + 3, z * .5) - .7); };
  // the front face: an NX × NY grid in (x, y0)
  const fg = new THREE.PlaneGeometry(1, 1, NX, NY), fc = new Float32Array((NX + 1) * (NY + 1) * 3), fbase = [];
  { const p = fg.attributes.position; for (let i = 0; i < p.count; i++) { const u = p.getX(i) + .5, v = p.getY(i) + .5, x = lerp(X0, X1, u), y0 = lerp(Y0, YT, v); fbase.push([x, y0]); const c = colAt(x, y0); c.multiplyScalar(.9 + .2 * noise3(x * 3, y0 * 9, 0)); fc.set([c.r, c.g, c.b], i * 3); } }
  fg.setAttribute('color', new THREE.BufferAttribute(fc, 3));
  const front = mesh3(S, fg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .85, bumpMap: pitNormal3(), bumpScale: .6 }), [0, 0, 0], { cast: false });
  // the top: an NX × NZ grid in (x, z)
  const tg = new THREE.PlaneGeometry(1, 1, NX, NZ); const tbase = [];
  { const p = tg.attributes.position; for (let i = 0; i < p.count; i++) tbase.push([lerp(X0, X1, p.getX(i) + .5), lerp(Z1, Z0, p.getY(i) + .5)]); }
  const tcol = new Float32Array(tbase.length * 3); tg.setAttribute('color', new THREE.BufferAttribute(tcol, 3));
  const top = mesh3(S, tg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .9 }), [0, 0, 0]);
  // the ends and the back (dark), the sea, the fossils, the labels' anchor points
  const sea = mesh3(S, new THREE.BoxGeometry(7.2, 1, 7), new THREE.MeshPhysicalMaterial({ color: '#2A7AA0', transparent: true, opacity: .55, roughness: .05, clearcoat: 1, emissive: '#0A3048', depthWrite: false }), [0, 0, 0], { cast: false, receive: false });
  const fossils = []; { const r = lcg(8); for (let i = 0; i < 12; i++) fossils.push({ x: -3.1 + r() * 6.2, y0: -1.1 + r() * .45, s: glow3(S, [0, 0, 0], .5, '#FFC860', .9) }); }
  let lastK = -1;
  const set = (t, k = 0, o = {}) => {
    if (Math.abs(k - lastK) > 1e-4) {
      lastK = k;
      const p = fg.attributes.position;
      for (let i = 0; i < p.count; i++) { const [x, y0] = fbase[i], d = def(x, y0, Z1, k), yt = topH(x, Z1, k); p.setXYZ(i, d[0], y0 > -.05 ? yt : Math.min(d[1], yt), Z1); }
      p.needsUpdate = true; fg.computeVertexNormals();
      const q = tg.attributes.position, c = new THREE.Color();
      for (let i = 0; i < q.count; i++) {
        const [x, z] = tbase[i], d = def(x, 0, z, k), y = topH(x, z, k); q.setXYZ(i, d[0], y, z);
        const base = colAt(x, 0), snow = smooth01((y - 4.6 - noise3(x * 2, 0, z * 2) * .6) / .8) * smooth01((o.snow ?? k) * 2 - 1);
        c.copy(base).multiplyScalar(.85 + .25 * noise3(x * 2, 1, z * 2)).lerp(new THREE.Color('#F4F6FA'), snow); tcol.set([c.r, c.g, c.b], i * 3);
      }
      q.needsUpdate = true; tg.attributes.color.needsUpdate = true; tg.computeVertexNormals();
    }
    const sk = 1 - smooth01(k * 1.6); sea.visible = sk > .01; sea.scale.set(1 - .5 * k, Math.max(.01, 1.2 * sk), 1); sea.position.set(-.5 * k, .6 * sk, 0); sea.material.opacity = .55 * sk;
    fossils.forEach(f => { const d = def(f.x, f.y0, Z1 + .02, k); f.s.position.set(d[0], d[1], Z1 + .05); f.s.material.opacity = (o.fossils ?? 1) * (.7 + .3 * Math.sin(t * 4 + f.x * 3)); f.s.scale.setScalar(.45); });
  };
  set(0, 0);
  return { S, set, def, topH };
}

// ================= the Gandaki's riverbed (metres) =================
// The spot (0, 0, 0) on the Kali Gandaki's bed: grey gravel, smooth river pebbles, a film of moving water, the stone
// among them; far snow peaks beyond (blurred by the lens). Moods day and golden.
function riverbed3() {
  const S = new THREE.Scene();
  const MT = mountains3(S, { box: [-3000, 3000, -6500, -1200], h: 1900, snow: 1100, seed: 7, nx: 300, nz: 120 });
  mesh3(S, new THREE.PlaneGeometry(9000, 9000), new THREE.MeshStandardMaterial({ color: '#7E7A74', roughness: 1 }), [0, -.02, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const sun = new THREE.DirectionalLight('#FFF0DC', 3); sun.position.set(2, 3, 1.5); S.add(sun, sun.target);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: .1, far: 20 }); sun.shadow.bias = -.0003; sun.shadow.normalBias = .01;
  S.fog = new THREE.Fog('#C8D8EA', 1500, 9000);
  const film = waterSurf3({ rep: 2, col: '#4A6A78', rough: .01, opacity: .22 });
  const mood = (name, t) => {
    if (name === 'golden') { env3(S, 'dawn', { k: .8, bg: true, bgK: 1.05, rot: 2.2 }); sun.color.set('#FFB070'); sun.intensity = 4.2; sun.position.set(-3, .9, 1.2); S.fog.color.set('#E8B890'); }
    else { env3(S, 'day', { k: 1, bg: true, bgK: 1, rot: .6 }); sun.color.set('#FFF2E0'); sun.intensity = 3.2; sun.position.set(2, 3, 1.5); S.fog.color.set('#C8D8EA'); }
    film.flow(t, 2);
  };
  mood('golden', 0); mood('day', 0);   // load both skies before the first frame
  mesh3(S, new THREE.CircleGeometry(30, 64), pbr3('pebbles', { tint: '#B8B2AA', rep: [26, 26], normalK: 1.3 }), [0, .02, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const peb = new THREE.Group(); S.add(peb);
  const pm = [0, 1, 2, 3].map(i => new THREE.MeshPhysicalMaterial({ color: ['#8E8A84', '#6E6A66', '#A8A098', '#5A5856'][i], roughness: .55, clearcoat: .3, clearcoatRoughness: .3, normalMap: pitNormal3().rep(2, 2), normalScale: new THREE.Vector2(.4, .4) }));
  { const r = lcg(77); for (let i = 0; i < 160; i++) { const a = r() * TAU, rr = .12 + Math.pow(r(), .7) * 2.2, s = .012 + r() * .03; mesh3(peb, new THREE.SphereGeometry(1, 20, 14), pm[i % 4], [Math.cos(a) * rr, .02 + s * .25, Math.sin(a) * rr], { scale: [s * (1.2 + r() * .6), s * .5, s * (1 + r() * .4)], rot: [0, r() * 6, 0] }); } }
  const SG = shaligram3(S); SG.group.scale.setScalar(.03); SG.group.position.set(0, .035, 0); SG.group.rotation.set(-1.2, .5, 0);
  mesh3(S, new THREE.PlaneGeometry(8, 1.6), film, [0, .03, -.7], { rot: [-Math.PI / 2, 0, .15], cast: false, receive: false });
  const leaf = tulsiLeaf3(S, .028);
  return { S, mood, SG, peb, leaf };
}
// the Himalaya on the map: the Kali Gandaki traced from Mustang to the Ganga at Patna (lon, lat)
const GANDAKI_LL = [[83.95, 29.18], [83.86, 29.0], [83.78, 28.84], [83.72, 28.78], [83.65, 28.7], [83.6, 28.62], [83.65, 28.49], [83.57, 28.35], [83.7, 28.22],
  [83.55, 28.05], [83.43, 27.95], [83.65, 27.9], [83.95, 27.85], [84.2, 27.78], [84.43, 27.73], [84.3, 27.6], [84.1, 27.43], [84.09, 27.1], [84.25, 26.8], [84.4, 26.47], [84.8, 26.15], [85.17, 25.87], [85.19, 25.69]];

// ================= the Himalaya at dawn (metres): ranges in layers of haze, alpenglow on the snow =================
function himalaya3() {
  const S = new THREE.Scene();
  env3(S, 'dawn', { k: .7, bg: true, bgK: 1.1, rot: 3.3 });
  const near = mountains3(S, { box: [-12000, 12000, -13000, -5000], h: 2600, snow: 1900, seed: 11, nx: 520, nz: 180, scale: 1 / 2200, base: -400 });
  const mid = mountains3(S, { box: [-20000, 20000, -24000, -12000], h: 5600, snow: 3000, seed: 3, nx: 520, nz: 150, scale: 1 / 3400 });
  const far = mountains3(S, { box: [-32000, 32000, -40000, -22000], h: 8400, snow: 4000, seed: 21, nx: 520, nz: 130, scale: 1 / 4800 });
  const sun = new THREE.DirectionalLight('#FFA878', 3.6); sun.position.set(-8, 1.6, 3); S.add(sun, sun.target);
  S.add(new THREE.HemisphereLight('#B8A8D8', '#3A2A2A', .5));
  S.fog = new THREE.Fog('#E0A898', 6000, 52000);
  return { S };
}
