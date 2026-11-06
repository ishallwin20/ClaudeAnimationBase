// orn_sets.js: the sets of "Why does SHIVA wear such SCARY ornaments?" (ad 78), in the 3D film look, all matte (owner,
// 30 Oct: nothing shiny). Metres; y up; the camera mostly looks toward -z.
//   studio3()     a dark jewel studio: a black stone floor, a pool of warm light, a cool rim, bokeh lamps far off. Every
//                 ornament is built into it and shown one at a time (or laid out together for the reveal and the ask):
//     cobra3      a spectacled cobra coiled on the stone, its neck reared and hood spread (pose rebuilt each frame:
//                 rise, hood, sway; the tongue flicks)
//     tusk3       a boar's curved tusk (Varaha's), ivory, triangular in section, darker at the root
//     skulls3     a garland of carved bone skulls on a braided cord: lying in a ring, or hanging as worn
//     hide3       an elephant's grey hide, cracked and wrinkled, falling and draping over a boulder; trishul3 beside it
//     jata3       Shiva's matted locks wound up into a high knot, a crescent at its side; ganga3: the torrent from the
//                 sky, the streams that wind round the locks, the one gentle stream that runs out
//     mala3       the rudraksha mala (ad 56's procedural bead), a falling tear of light
//     malas3      the devotees' three: a crystal mala, a karungali (ebony) mala, a red thread
//   ocean3()      the ocean of milk at a stormy dusk, Mount Mandara and Vasuki (after ad 71), the halahal spreading over
//                 the milk as a violet-black stain and rising as smoke

// ---------- noise (JS, for building meshes) ----------
const nH3 = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
function noise3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), fx = x - xi, fy = y - yi, fz = z - zi;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
  const L = (a, b, k) => a + (b - a) * k, c = (i, j, k) => nH3(xi + i, yi + j, zi + k);
  return L(L(L(c(0, 0, 0), c(1, 0, 0), u), L(c(0, 1, 0), c(1, 1, 0), u), v), L(L(c(0, 0, 1), c(1, 0, 1), u), L(c(0, 1, 1), c(1, 1, 1), u), v), w) * 2 - 1;
}
const fbm3 = (x, y, z, n = 4) => { let s = 0, a = .5, f = 1; for (let i = 0; i < n; i++) { s += a * noise3(x * f, y * f, z * f); f *= 2.1; a *= .5; } return s; };
const smooth01 = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const bump01 = (x, a, b) => { const m = (a + b) / 2, h = (b - a) / 2; return Math.max(0, 1 - Math.pow((x - m) / h, 2)); };
const std3 = (col, rough = .6, o = {}) => new THREE.MeshStandardMaterial({ color: col, roughness: rough, ...o });

// a tube along points (a lock, a prong, a cord); r a number or [r0, r1] (tapering)
function tubeP3(parent, pts, r, mat, o = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => V3(...p))), geo = new THREE.TubeGeometry(curve, o.segs ?? 24, Array.isArray(r) ? r[0] : r, o.radial ?? 10, false);
  if (Array.isArray(r)) {
    const pos = geo.attributes.position, n = (o.segs ?? 24) + 1, rad = (o.radial ?? 10) + 1;
    for (let i = 0; i < n; i++) { const c = curve.getPointAt(i / (n - 1)), k = lerp(1, r[1] / r[0], i / (n - 1)); for (let j = 0; j < rad; j++) { const v = i * rad + j; pos.setXYZ(v, c.x + (pos.getX(v) - c.x) * k, c.y + (pos.getY(v) - c.y) * k, c.z + (pos.getZ(v) - c.z) * k); } }
    geo.computeVertexNormals();
  }
  return mesh3(parent, geo, mat, [0, 0, 0], o);
}
// a gradient backdrop: a sphere round everything
function backdrop3(scene, top, mid, bot, r = 60) {
  const t = tex3('bd' + top + mid + bot, 4, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, top); gr.addColorStop(.55, mid); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, 4, 256); });
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false, depthWrite: false }));
  m.renderOrder = -2; scene.add(m); return m;
}
// a fine grey texture for bump maps: lines along u (hair, grain), or speckle
const streakTex3 = (key, n = 900, o = {}) => tex3(key, 512, 512, (g, w, h) => {
  g.fillStyle = '#808080'; g.fillRect(0, 0, w, h); const r = lcg(o.seed ?? 5);
  for (let i = 0; i < n; i++) {
    const y = r() * h, x = r() * w, l = (o.len ?? 120) * (.4 + r()), a = .1 + r() * .35;
    g.strokeStyle = r() < .5 ? `rgba(0,0,0,${a})` : `rgba(255,255,255,${a * .8})`; g.lineWidth = .6 + r() * (o.wd ?? 2);
    g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + l * .3, y + (r() - .5) * (o.wave ?? 6), x + l * .6, y + (r() - .5) * (o.wave ?? 6), x + l, y + (r() - .5) * (o.wave ?? 6)); g.stroke();
    g.beginPath(); g.moveTo(x - w, y); g.lineTo(x - w + l, y); g.stroke();
  }
}, { data: true });

// a tube whose cross-section is rebuilt each frame: N rings of M points along a centre line, an ellipse per ring in the
// frame (side, up) given by frame(i). Returns { mesh, geo, update(centres, frames, rw(i), rh(i), extra(i, j, p)) }.
function liveTube3(parent, N, M, mat) {
  const geo = new THREE.BufferGeometry(), pos = new Float32Array(N * (M + 1) * 3), uv = new Float32Array(N * (M + 1) * 2), idx = [];
  for (let i = 0; i < N; i++) for (let j = 0; j <= M; j++) { uv[(i * (M + 1) + j) * 2] = i / (N - 1); uv[(i * (M + 1) + j) * 2 + 1] = j / M; }
  for (let i = 0; i < N - 1; i++) for (let j = 0; j < M; j++) { const a = i * (M + 1) + j, b = a + M + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.setIndex(idx);
  const col = new Float32Array(N * (M + 1) * 3); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mesh = mesh3(parent, geo, mat, [0, 0, 0]); mesh.frustumCulled = false;
  return { mesh, geo, pos, col, N, M };
}

// ======================================================================================================
// the studio
// ======================================================================================================
function studio3() {
  const S = new THREE.Scene();
  const bdWarm = backdrop3(S, '#030203', '#0A0607', '#140A08'), bdNight = backdrop3(S, '#02040C', '#071026', '#0E1C36', 59), bdEmber = backdrop3(S, '#050202', '#120504', '#2A0C06', 58);
  S.environment = studioEnv3({ floor: .4, room: '#0A090C', boxes: [[-6, 6, 5, 6, 4, 5], [7, 3, 1, 1.2, 8, 3.5], [0, 4, -8, 9, 2.4, 4], [0, 12, 0, 6, 6, 2]] }); S.environmentIntensity = .55;
  S.fog = new THREE.Fog('#060405', 7, 22);
  // the floor: black stone, finely speckled, a soft mottle
  const floorTex = tex3('ornFloor', 1024, 1024, (g, w, h) => {
    g.fillStyle = '#2A2724'; g.fillRect(0, 0, w, h); const r = lcg(78);
    for (let i = 0; i < 60; i++) { const x = r() * w, y = r() * h, rr = 60 + r() * 220, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, r() < .5 ? 'rgba(10,8,8,.35)' : 'rgba(70,64,58,.22)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
    for (let i = 0; i < 40000; i++) { g.fillStyle = r() < .6 ? 'rgba(0,0,0,.25)' : 'rgba(170,160,150,.12)'; g.fillRect(r() * w, r() * h, 1 + r() * 1.5, 1 + r() * 1.5); }
  });
  const floorBump = tex3('ornFloorB', 512, 512, (g, w, h) => { g.fillStyle = '#808080'; g.fillRect(0, 0, w, h); const r = lcg(9); for (let i = 0; i < 9000; i++) { g.fillStyle = r() < .5 ? 'rgba(0,0,0,.3)' : 'rgba(255,255,255,.25)'; g.beginPath(); g.arc(r() * w, r() * h, .5 + r() * 1.8, 0, TAU); g.fill(); } }, { data: true });
  const floorM = new THREE.MeshStandardMaterial({ map: floorTex.rep(5, 5), bumpMap: floorBump.rep(10, 10), bumpScale: .6, roughness: .72, color: '#9A938C', envMapIntensity: .5 });
  const floor = mesh3(S, new THREE.PlaneGeometry(60, 60), floorM, [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // bokeh lamps far off round the set
  const bokeh = new THREE.Group(); S.add(bokeh); const rb = lcg(12);
  for (let i = 0; i < 28; i++) { const a = rb() * TAU, d = 9 + rb() * 6; glow3(bokeh, [Math.cos(a) * d, .3 + rb() * 3.2, Math.sin(a) * d - 3], .6 + rb() * 1.2, rb() < .75 ? '#FFB050' : '#FFDDA0', .2 + rb() * .3); }
  // lights: the key (a soft spot, so the floor falls off into the dark), a rim, a fill
  const key = new THREE.SpotLight('#FFE2BC', 0, 0, .5, .8, 2); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.0003; key.shadow.normalBias = .01; key.shadow.radius = 4; S.add(key, key.target);
  const rim = new THREE.DirectionalLight('#86A8FF', 1.6); rim.position.set(-3, 3, -5); S.add(rim);
  const warm = new THREE.PointLight('#FF9A44', 0, 6, 1.6); warm.position.set(1.2, .6, 1.2); S.add(warm);
  const hemi = new THREE.HemisphereLight('#3A3440', '#100C0A', .25); S.add(hemi);
  const motes = motes3(S, { n: 140, box: [-3, 0, -5, 3, 3, 1.5], size: .0016, col: '#FFDDA8', drift: [.02, .03, 0] });

  // look(name, o): 'warm' (the default), 'night' (Ganga: blue), 'ember' (the hide and the trishul), 'gold' (rudraksha).
  // o.key [x, y, z] the key light's position, o.keyAt where it points, o.cone, o.spot (intensity), o.rim, o.warm
  const look = (name, o = {}) => {
    bdWarm.visible = name === 'warm' || name === 'gold'; bdNight.visible = name === 'night'; bdEmber.visible = name === 'ember';
    const kp = o.key || [2.2, 4.2, 3]; key.position.set(...kp); key.target.position.set(...(o.keyAt || [0, .2, 0])); key.angle = o.cone ?? .5; key.intensity = o.spot ?? 120;
    key.color.set(name === 'night' ? '#CFE0FF' : name === 'ember' ? '#FFD0A8' : '#FFE2BC');
    rim.intensity = o.rim ?? (name === 'night' ? 2.4 : 1.6); rim.color.set(name === 'ember' ? '#FF7A30' : '#86A8FF');
    warm.intensity = o.warm ?? (name === 'ember' ? 8 : name === 'gold' ? 4 : 1.5); warm.color.set(name === 'ember' ? '#FF6A20' : '#FF9A44');
    S.fog.color.set(name === 'night' ? '#050A16' : name === 'ember' ? '#0C0503' : '#060405'); S.fog.near = o.fogNear ?? 7; S.fog.far = o.fogFar ?? 22;
    bokeh.visible = o.bokeh ?? (name !== 'night'); floor.visible = o.floor ?? true;
    hemi.intensity = o.hemi ?? .25;
  };
  return { S, floor, floorM, bokeh, key, rim, warm, hemi, motes, look };
}

// ======================================================================================================
// the cobra
// ======================================================================================================
// scales: a grey pattern (multiplied by the vertex colours) and its bump
const cobraScaleTex3 = (bump) => tex3('cobraSc' + (bump ? 'B' : 'C'), 256, 256, (g, w, h) => {
  g.fillStyle = bump ? '#3A3A3A' : '#B4B4B4'; g.fillRect(0, 0, w, h);
  const s = 32;
  for (let row = -1; row < h / (s * .5) + 1; row++) for (let col = -1; col < w / s + 1; col++) {
    const x = col * s + (row % 2 ? s / 2 : 0), y = row * s * .5, gr = g.createRadialGradient(x, y - s * .15, 1, x, y, s * .62);
    if (bump) { gr.addColorStop(0, '#F4F4F4'); gr.addColorStop(.75, '#A0A0A0'); gr.addColorStop(1, '#202020'); }
    else { gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(.75, '#EAEAEA'); gr.addColorStop(1, '#B0B0B0'); }
    g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, s * .52, s * .48, 0, 0, Math.PI); g.fill();
  }
}, bump ? { data: true } : {});

// cobra3(parent): .set(t, { rise 0..1, hood 0..1, sway 0..1, tongue (flicks a second), look [x, y] }) rebuilds the pose.
// About 2.9 m long, coiled within ~.75 m; reared, the head is ~.55 m up. The group's origin is the coil's centre.
function cobra3(parent) {
  const G = new THREE.Group(); parent.add(G);
  const N = 320, M = 30;
  const mat = new THREE.MeshPhysicalMaterial({ vertexColors: true, map: cobraScaleTex3(false).rep(140, 8), bumpMap: cobraScaleTex3(true).rep(140, 8), bumpScale: .1, roughness: .42, clearcoat: .2, clearcoatRoughness: .35, sheen: .35, sheenColor: '#9A8A68', side: THREE.DoubleSide, envMapIntensity: .8 });
  const T = liveTube3(G, N, M, mat);
  const DORS = new THREE.Color('#15120E'), DORS2 = new THREE.Color('#3A3022'), BELLY = new THREE.Color('#CBB88C'), BAND = new THREE.Color('#1A130E'), HOODF = new THREE.Color('#DCCBA2');
  // the head: an ellipsoid tapering to the snout (local +z forward, +y up), brow ridges, eyes, the tongue
  const head = new THREE.Group(); G.add(head);
  { const g = new THREE.SphereGeometry(1, 48, 32), p = g.attributes.position, c = new Float32Array(p.count * 3), cc = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const f = clamp((z + 1) / 2), taper = 1 - .38 * Math.pow(f, 1.8);
      const top = y > 0;
      x *= .029 * taper; y *= (top ? .017 : .012) * taper; z *= .052;
      y += top ? .004 * Math.sin(Math.PI * f) : 0;                    // a domed crown
      p.setXYZ(i, x, y, z);
      cc.copy(DORS).lerp(DORS2, clamp(.25 + .6 * fbm3(x * 80, y * 80, z * 80, 2))).lerp(BELLY, smooth01(-y / .008 + .1) * .8);
      c[i * 3] = cc.r; c[i * 3 + 1] = cc.g; c[i * 3 + 2] = cc.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(c, 3)); g.computeVertexNormals();
    mesh3(head, g, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .38, clearcoat: .25, clearcoatRoughness: .3, sheen: .3, sheenColor: '#9A8A68', envMapIntensity: .8 }), [0, 0, 0]);
    const eyeM = new THREE.MeshPhysicalMaterial({ color: '#0A0705', roughness: .1, clearcoat: 1, clearcoatRoughness: .03, envMapIntensity: 1.5 });
    for (const s of [-1, 1]) mesh3(head, new THREE.SphereGeometry(.0048, 16, 12), eyeM, [s * .0232, .005, .02]);
  }
  const tongueM = std3('#2A0A0C', .5, { emissive: '#3A0608', emissiveIntensity: .3 });
  const tongue = new THREE.Group(); head.add(tongue); tongue.position.set(0, -.004, .05);
  tubeP3(tongue, [[0, 0, 0], [0, -.001, .02], [0, -.002, .034]], [.0018, .0014], tongueM, { segs: 8, radial: 6 });
  for (const s of [-1, 1]) tubeP3(tongue, [[0, -.002, .032], [s * .004, -.003, .042], [s * .007, -.002, .05]], [.0013, .0004], tongueM, { segs: 8, radial: 5 });

  const P = [...Array(N)].map(() => V3()), Tn = [...Array(N)].map(() => V3()), up = V3(0, 1, 0), back = V3(0, 0, -1), cc = new THREE.Color();
  // the hood's half-width factor at a distance dh (m) below the head: opens below the head, widest ~13 cm down, closes by 21 cm
  const hoodShape = dh => { const x = (dh - .035) / .19; return x <= 0 || x >= 1 ? 0 : Math.pow(Math.sin(Math.PI * Math.pow(x, .7)), .75); };
  const set = (t, o = {}) => {
    const rise = o.rise ?? 1, hood = o.hood ?? 1, sway = (o.sway ?? 1) * rise;
    // the centre line: a coil on the floor (the tail outside, turning in), then the neck rising toward the camera (+z)
    const ctrl = [], COIL = 1.6;
    for (let i = 0; i <= 56; i++) {
      const k = i / 56, a = -COIL * TAU + k * COIL * TAU, r = lerp(.37, .12, Math.pow(k, .85));
      ctrl.push(V3(r * Math.cos(a), .026 + .006 * Math.sin(k * 9), r * Math.sin(a)));
    }
    const H = lerp(.06, .54, rise), sx = .035 * Math.sin(t * 1.1) * sway, sz = .02 * Math.sin(t * .8 + 1) * sway;
    ctrl.push(V3(.115, .03, .07), V3(.09, lerp(.04, .12, rise), lerp(.16, .14, rise)), V3(.05 + sx * .3, lerp(.05, .3, rise), lerp(.24, .15, rise) + sz * .3), V3(.015 + sx * .8, lerp(.055, .45, rise), lerp(.3, .12, rise) + sz * .8), V3(sx, H, lerp(.34, .1, rise) + sz));
    const curve = new THREE.CatmullRomCurve3(ctrl, false, 'centripetal'), L = curve.getLength();
    const pts = curve.getSpacedPoints(N - 1);
    for (let i = 0; i < N; i++) P[i].copy(pts[i]);
    for (let i = 0; i < N; i++) Tn[i].subVectors(P[Math.min(N - 1, i + 1)], P[Math.max(0, i - 1)]).normalize();
    const pos = T.pos, col = T.col, side = V3(), dors = V3(), R = V3(), q = V3();
    for (let i = 0; i < N; i++) {
      const s = i / (N - 1), dh = (1 - s) * L, v = Math.abs(Tn[i].y);
      R.copy(up).lerp(back, smooth01((v - .3) / .5)).normalize();          // dorsal reference: up on the floor, back when reared
      side.crossVectors(Tn[i], R).normalize(); dors.crossVectors(side, Tn[i]).normalize();
      let rw = .0035 + .027 * Math.pow(smooth01(s / .5), .8) * (dh < .08 ? lerp(.72, 1, dh / .08) : 1), rh = rw * .88;
      const hk = hood * rise * hoodShape(dh);
      rw *= 1 + 3.1 * hk; rh *= 1 - .6 * hk;
      for (let j = 0; j <= M; j++) {
        const th = j / M * TAU, cs = Math.cos(th), sn = Math.sin(th);
        q.copy(P[i]).addScaledVector(side, rw * cs).addScaledVector(dors, rh * sn);
        q.addScaledVector(dors, -rw * .2 * hk * cs * cs);                    // the hood cups forward at its edges
        if (s < .8) q.y = Math.max(q.y, .001);
        const k = (i * (M + 1) + j) * 3; pos[k] = q.x; pos[k + 1] = q.y; pos[k + 2] = q.z;
        // colour: a dark back with olive-brown mottling, a cream belly; dark bands across the throat under the hood
        const belly = smooth01((-sn - .1) / .5);
        cc.copy(DORS).lerp(DORS2, clamp(.4 + .9 * noise3(dh * 30, j * .35, 1))).lerp(BELLY, belly);
        if (belly > .05) { const band = Math.max(bump01(dh, .22, .26), bump01(dh, .285, .305)); cc.lerp(BAND, band * belly * .9); cc.lerp(HOODF, hk * belly * .4); const pl = (dh / .011) % 1; cc.multiplyScalar(1 - .22 * belly * smooth01((pl - .82) / .18)); }
        col[k] = cc.r; col[k + 1] = cc.g; col[k + 2] = cc.b;
      }
    }
    T.geo.attributes.position.needsUpdate = true; T.geo.attributes.color.needsUpdate = true; T.geo.computeVertexNormals(); T.geo.computeBoundingSphere();
    // the head: at the end, facing forward (+z) and a touch down, swaying
    const end = P[N - 1], dir = Tn[N - 1].clone(), look = o.look || [0, 0];
    const hf = V3(look[0] * .3 + sx * 1.5, -.12 + look[1] * .3, 1).normalize();
    const f = dir.clone().lerp(hf, smooth01(rise * 1.4)).normalize();
    head.position.copy(end).addScaledVector(f, .03).addScaledVector(up, -.004);
    const m = new THREE.Matrix4(), xa = V3().crossVectors(up, f).normalize(), ya = V3().crossVectors(f, xa).normalize();
    m.makeBasis(xa, ya, f); head.quaternion.setFromRotationMatrix(m);
    const tw = o.tongue ?? 1, ph = (t * .9 * tw) % 1, out = tw > 0 && ph < .3 ? Math.sin(ph / .3 * Math.PI) : 0;
    tongue.visible = out > .05; tongue.scale.set(1, 1, Math.max(.01, out)); tongue.rotation.x = .25 * Math.sin(t * 40) * out;
  };
  set(0, {});
  G.set = set; G.head = head;
  return G;
}
// ======================================================================================================
// the boar's tusk
// ======================================================================================================
// tusk3(parent): a curved tusk ~.42 long along an arc in its local x-y plane (root at the origin, curving up and over);
// triangular in section, root brown, ivory along, a worn tip
function tusk3(parent) {
  const G = new THREE.Group(); parent.add(G); const I = new THREE.Group(); G.add(I);
  const N = 120, M = 36, T = liveTube3(I, N, M, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .38, clearcoat: .25, clearcoatRoughness: .5, sheen: .3, sheenColor: '#FFF2D8', bumpMap: streakTex3('tuskStreak', 700, { len: 200, wave: 3, wd: 1.4 }).rep(1, 2), bumpScale: .35, envMapIntensity: .6 }));
  const pos = T.pos, col = T.col, ROOT = new THREE.Color('#7A5A3A'), IV = new THREE.Color('#D2C3A2'), IV2 = new THREE.Color('#E6DAC0'), TIP = new THREE.Color('#D9C9A6'), cc = new THREE.Color();
  const R = .22, A0 = -.35, A1 = 2.4, cen = V3();                                  // the arc's radius and its angles (radians)
  for (let i = 0; i < N; i++) {
    const s = i / (N - 1), a = lerp(A0, A1, s), c = V3(R * Math.cos(a) - R * Math.cos(A0), R * Math.sin(a) - R * Math.sin(A0), .03 * s * s);
    const tg = V3(-Math.sin(a), Math.cos(a), .06 * s).normalize(), nrm = V3(Math.cos(a), Math.sin(a), 0), bin = V3().crossVectors(tg, nrm).normalize();
    const r = .036 * Math.pow(1 - s, .85) + .0015; cen.addScaledVector(c, 1 / N);
    for (let j = 0; j <= M; j++) {
      const th = j / M * TAU, tri = 1 + .13 * Math.cos(3 * th + .5), rr = r * tri;
      const p = c.clone().addScaledVector(nrm, rr * Math.cos(th)).addScaledVector(bin, rr * Math.sin(th) * .9);
      const k = (i * (M + 1) + j) * 3; pos[k] = p.x; pos[k + 1] = p.y; pos[k + 2] = p.z;
      cc.copy(ROOT).lerp(IV, smooth01(s / .3)).lerp(IV2, .4 * Math.max(0, Math.cos(th - 2.4))).lerp(TIP, smooth01((s - .85) / .15));
      cc.multiplyScalar(.92 + .1 * noise3(s * 30, j * .2, 3)); col[k] = cc.r; col[k + 1] = cc.g; col[k + 2] = cc.b;
    }
  }
  T.geo.computeVertexNormals(); T.geo.computeBoundingSphere();
  // the root's cap
  mesh3(I, new THREE.CircleGeometry(.036, 24), std3('#5A3E28', .8), [0, 0, 0], { rot: [Math.PI / 2 - .35, 0, 0] });
  I.position.copy(cen).negate();   // the group's origin is the tusk's middle
  return G;
}

// ======================================================================================================
// the skull garland
// ======================================================================================================
// one skull, unit size (about 2 wide, face along +z, the crown up), coloured per vertex (bone, the sockets dark)
const SKULL_GEO = (() => {
  const g = new THREE.SphereGeometry(1, 72, 54), p = g.attributes.position, c = new Float32Array(p.count * 3), cc = new THREE.Color();
  const BONE = new THREE.Color('#CDBA92'), BONE2 = new THREE.Color('#8C7450'), DK = new THREE.Color('#1C140C');
  const sock = [V3(-.36, .02, .93).normalize(), V3(.36, .02, .93).normalize()], nose = V3(0, -.3, .95).normalize(), d = V3();
  for (let i = 0; i < p.count; i++) {
    d.set(p.getX(i), p.getY(i), p.getZ(i));
    let x = d.x * .8, y = d.y * .92, z = d.z * (d.z < 0 ? 1.12 : 1), dark = 0;
    // the face narrows below the eyes into the jaw; the cheekbones stand out
    const low = smooth01((-d.y - .15) / .7) * smooth01(d.z * 2 + .3);
    x *= 1 - .36 * low; y -= .18 * low; z += .05 * low;
    x += Math.sign(d.x) * .06 * bump01(Math.abs(d.x), .45, .85) * bump01(d.y, -.45, .05) * smooth01(d.z * 2);
    // the sockets and the nose: pressed in, dark
    let push = 0;
    for (const s of sock) { const k = d.distanceTo(s); if (k < .3) { const w = 1 - Math.pow(k / .3, 2); push = Math.max(push, .34 * w); dark = Math.max(dark, smooth01(w * 1.6)); } }
    { const dx = (d.x) / .13, dy = (d.y + .3) / .17; if (d.z > 0 && dx * dx + dy * dy < 1) { const w = 1 - (dx * dx + dy * dy); push = Math.max(push, .2 * w); dark = Math.max(dark, smooth01(w * 2)); } }
    // the teeth: a row of upper teeth, the gaps dark
    let teeth = 0; if (d.z > .55 && d.y < -.5 && d.y > -.75 && Math.abs(d.x) < .38) teeth = bump01(d.y, -.75, -.5);
    const gap = teeth * smooth01((Math.abs(Math.sin(d.x * 26)) - .82) * 8);
    const k2 = 1 - push * (z > 0 ? 1 : 0);
    p.setXYZ(i, x * k2, y * k2, z * k2 - (teeth ? .02 * gap : 0));
    cc.copy(BONE).lerp(BONE2, clamp(.45 + .9 * fbm3(d.x * 3, d.y * 3, d.z * 3, 3))).lerp(DK, Math.max(dark * .95, gap * .9));
    cc.lerp(BONE2, .3 * smooth01(-d.y) + .35 * smooth01(push * 6)); c[i * 3] = cc.r; c[i * 3 + 1] = cc.g; c[i * 3 + 2] = cc.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(c, 3)); g.computeVertexNormals(); return g;
})();
// skulls3(parent, n): a garland of n skulls on a braided red-black cord. .pose('ring' | 'hang', t): lying in a ring on
// the floor (r ~.5), or hanging in a U as if worn (in the x-y plane, faces toward +z). Skull size ~.07 across.
function skulls3(parent, n = 22) {
  const G = new THREE.Group(); parent.add(G);
  const im = new THREE.InstancedMesh(SKULL_GEO, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .62, bumpMap: streakTex3('boneB', 1600, { len: 30, wave: 10, wd: 1.2, seed: 3 }), bumpScale: .4, envMapIntensity: .5 }), n);
  im.castShadow = im.receiveShadow = true; G.add(im);
  const cordM = std3('#5A1410', .7, { bumpMap: streakTex3('cordB', 500, { len: 40, wave: 20, wd: 3, seed: 8 }).rep(20, 1), bumpScale: .8 });
  let cord = null; const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), Sv = V3(), m3 = new THREE.Matrix4();
  const pathOf = (pose, t) => pose === 'ring'
    ? (u => V3(.52 * Math.cos(u * TAU) * 1.05, .035, .52 * Math.sin(u * TAU)))
    : (u => { const a = lerp(-1.4, 1.4, u), sw = .02 * Math.sin(t * .9); return V3(.2 * Math.sin(a) + sw * Math.cos(a), -.5 * Math.cos(a), .04 * Math.cos(a)); });
  G.pose = (pose, t = 0) => {
    const f = pathOf(pose, t), sz = pose === 'ring' ? .036 : .03;
    for (let i = 0; i < n; i++) {
      const u = pose === 'ring' ? i / n : (i + .5) / n, p = f(u), q = f(u + .001).sub(p).normalize();
      let zf, yf;
      if (pose === 'ring') { zf = V3(p.x, 0, p.z).normalize(); zf.y = 1.1; zf.normalize(); yf = q.clone().cross(zf).normalize().negate(); }
      else { zf = V3(0, .15, 1).normalize(); yf = V3().crossVectors(zf, q).normalize(); if (yf.y < 0) yf.negate(); }
      const xf = V3().crossVectors(yf, zf).normalize(); yf.crossVectors(zf, xf);
      m3.makeBasis(xf, yf, zf); Q.setFromRotationMatrix(m3);
      const tilt = new THREE.Quaternion().setFromAxisAngle(zf, (nH3(i, 1, 2) - .5) * .25); Q.premultiply(tilt);
      M4.compose(pose === 'ring' ? p.clone().setY(sz * .95) : p.clone().addScaledVector(zf, sz * .55), Q, Sv.setScalar(sz * (.92 + .16 * nH3(i, 3, 1)))); im.setMatrixAt(i, M4);
    }
    im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere();
    if (cord) { cord.geometry.dispose(); G.remove(cord); }
    const pts = [...Array(pose === 'ring' ? 97 : 65)].map((_, i) => { const u = pose === 'ring' ? i / 96 : lerp(-.04, 1.04, i / 64); const p = f(u); return pose === 'ring' ? p.setY(.034) : p; });
    cord = mesh3(G, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, pose === 'ring'), 260, .006, 8, pose === 'ring'), cordM, [0, 0, 0]);
  };
  G.pose('ring');
  return G;
}

// ======================================================================================================
// the elephant's hide, the boulder, the trishul
// ======================================================================================================
const hideTex3 = (bump) => tex3('hide' + (bump ? 'B' : 'C'), 1024, 1024, (g, w, h) => {
  g.fillStyle = bump ? '#909090' : '#6E6862'; g.fillRect(0, 0, w, h); const r = lcg(31);
  if (!bump) for (let i = 0; i < 80; i++) { const x = r() * w, y = r() * h, rr = 40 + r() * 200, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, r() < .5 ? 'rgba(40,36,34,.3)' : 'rgba(140,130,122,.22)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
  // the crack network: wandering lines in two directions, finer ones between
  for (let pass = 0; pass < 3; pass++) {
    const n = [110, 260, 700][pass], lw = [3.2, 1.8, .9][pass], a = bump ? [.85, .6, .45][pass] : [.6, .4, .25][pass];
    for (let i = 0; i < n; i++) {
      let x = r() * w, y = r() * h, ang = (r() < .5 ? 0 : Math.PI / 2) + (r() - .5) * .9; const L = [180, 90, 40][pass] * (.5 + r());
      g.strokeStyle = bump ? `rgba(0,0,0,${a})` : `rgba(28,24,22,${a})`; g.lineWidth = lw; g.beginPath(); g.moveTo(x, y);
      for (let s = 0; s < L; s += 6) { ang += (r() - .5) * .5; x += Math.cos(ang) * 6; y += Math.sin(ang) * 6; g.lineTo(x, y); }
      g.stroke();
    }
  }
  if (bump) for (let i = 0; i < 20000; i++) { g.fillStyle = r() < .5 ? 'rgba(0,0,0,.15)' : 'rgba(255,255,255,.12)'; g.fillRect(r() * w, r() * h, 2, 2); }
}, bump ? { data: true } : {});
// the hide's outline (alpha), seen from above: an elephant's skin spread flat, the head at the top (-z) with its two
// great ears and the trunk running on past them, four leg flaps, the tail; ragged at the edges
const hideAlpha3 = () => tex3('hideA2', 1024, 1024, (g, w, h) => {
  g.fillStyle = '#000'; g.fillRect(0, 0, w, h); g.fillStyle = '#FFF';
  const blob = (pts) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x * w, y * h) : g.moveTo(x * w, y * h)); g.closePath(); g.fill(); };
  const r = lcg(6), ell = (cx, cy, rx, ry, n = 80, j = .012) => blob([...Array(n)].map((_, i) => { const a = i / n * TAU, k = 1 + (r() - .5) * j * 4 + .015 * Math.sin(a * 13); return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]; }));
  ell(.5, .6, .26, .27);                                   // the body
  ell(.5, .3, .12, .1);                                    // the head
  for (const s of [-1, 1]) {
    ell(.5 + s * .2, .28, .14, .16, 90, .02);              // the ears
    blob([[.5 + s * .16, .5], [.5 + s * .4, .4], [.5 + s * .44, .47], [.5 + s * .25, .62]]);   // fore legs
    blob([[.5 + s * .18, .72], [.5 + s * .42, .8], [.5 + s * .39, .87], [.5 + s * .16, .84]]); // hind legs
  }
  // the trunk: tapering up from the head, curling at its tip
  for (let i = 0; i < 40; i++) { const u = i / 40, x = .5 + .03 * Math.sin(u * 5), y = .26 - u * .21, rr = lerp(.05, .018, u); g.beginPath(); g.arc(x * w, y * h, rr * w, 0, TAU); g.fill(); }
  blob([[.49, .86], [.51, .86], [.505, .97], [.495, .97]]);   // the tail
}, { data: true });
// hide3(parent): the skin, spread on the floor (about 1.6 wide, 2 long, the head toward -z). .set(k 0..1, t): it falls
// from above, rippling, and settles flat in soft wrinkles; hidden at k 0
function hide3(parent) {
  const G = new THREE.Group(); parent.add(G);
  const W_ = 1.6, D_ = 2.0, geo = new THREE.PlaneGeometry(W_, D_, 120, 150); geo.rotateX(-Math.PI / 2);
  const P = geo.attributes.position, base = Float32Array.from(P.array);
  const mat = new THREE.MeshStandardMaterial({ map: hideTex3(false).rep(1.4, 1.75), bumpMap: hideTex3(true).rep(1.4, 1.75), bumpScale: 3, alphaMap: hideAlpha3(), alphaTest: .5, roughness: .93, side: THREE.DoubleSide, color: '#A6A39E', envMapIntensity: .35 });
  const hide = mesh3(G, geo, mat, [0, 0, 0]);
  const restY = (x, z) => .006 + .022 * Math.max(0, fbm3(x * 2.2, 0, z * 2.2, 3)) + .012 * Math.max(0, Math.sin(x * 9 + 2 * Math.sin(z * 4)));
  G.set = (k, t) => {
    for (let i = 0; i < P.count; i++) {
      const x = base[i * 3], z = base[i * 3 + 2], r = Math.hypot(x, z), kk = smooth01((k - r * .2) / .65);
      const wave = .12 * Math.sin(t * 6 + x * 3 + z * 2) * (1 - kk), y = lerp(.9 + wave + .2 * Math.sin(x * 2.5 + t * 2) * (1 - kk), restY(x, z), easeIn(kk));
      P.setXYZ(i, x * lerp(.86, 1, kk), y, z * lerp(.9, 1, kk));
    }
    P.needsUpdate = true; geo.computeVertexNormals(); geo.computeBoundingSphere();
    hide.visible = k > 0;
  };
  G.set(1, 0); G.hide = hide;
  return G;
}
// trishul3(parent): Shiva's trident, ~1.8 tall, its foot at the origin; .heat(k) makes the prongs glow (its fire)
function trishul3(parent) {
  const G = new THREE.Group(); parent.add(G);
  const iron = new THREE.MeshStandardMaterial({ color: '#4C4A48', metalness: .55, roughness: .42, envMapIntensity: .6, emissive: '#FF5A10', emissiveIntensity: 0 });
  const wood = std3('#4A2C18', .7);
  mesh3(G, new THREE.CylinderGeometry(.014, .016, 1.42, 16), wood, [0, .71, 0]);
  mesh3(G, lathe3([[0, 0], [.03, 0], [.03, .03], [.022, .05], [.03, .07], [.026, .09], [0, .09]], 24), iron, [0, 1.38, 0]);
  // the prongs: the centre a leaf-shaped blade, the sides curving out and up
  const blade = (h, w) => { const s = new THREE.Shape(); s.moveTo(0, 0); s.bezierCurveTo(w, h * .25, w * .7, h * .7, 0, h); s.bezierCurveTo(-w * .7, h * .7, -w, h * .25, 0, 0); return new THREE.ExtrudeGeometry(s, { depth: .01, bevelEnabled: true, bevelThickness: .006, bevelSize: .006, bevelSegments: 2, curveSegments: 16 }); };
  const top = 1.47;
  mesh3(G, blade(.34, .05), iron, [0, top, -.008]);
  for (const s of [-1, 1]) {
    tubeP3(G, [[0, top + .02, 0], [s * .12, top + .02, 0], [s * .17, top + .1, 0], [s * .16, top + .2, 0]], [.014, .009], iron, { segs: 24 });
    mesh3(G, blade(.13, .03), iron, [s * .158, top + .19, -.008], { rot: [0, 0, -s * .12] });
  }
  tubeP3(G, [[-.12, top + .02, 0], [.12, top + .02, 0]], .015, iron, { segs: 8 });
  // a small damaru tied below the prongs, a red cloth
  const dam = new THREE.Group(); G.add(dam); dam.position.set(.05, 1.3, .02); dam.rotation.z = .5;
  mesh3(dam, lathe3([[.0, -.06], [.045, -.06], [.012, 0], [.045, .06], [0, .06]], 24), std3('#8A5A30', .6), [0, 0, 0]);
  tubeP3(G, [[0, 1.33, .016], [.04, 1.31, .03], [.06, 1.22, .03], [.05, 1.12, .02]], [.012, .006], std3('#A01A16', .7), { segs: 16 });
  G.heat = (k) => { iron.emissiveIntensity = 1.6 * k; };
  return G;
}

// ======================================================================================================
// the jata and Ganga
// ======================================================================================================
// jata3(parent): matted locks wound up a cone into a high knot (~.9 tall, ~.9 across at the base), a few locks hanging
// down outside; a crescent at its side
function jata3(parent) {
  const G = new THREE.Group(); parent.add(G);
  const hairC = tex3('hairC', 512, 512, (g, w, h) => {
    g.fillStyle = '#3A2A1E'; g.fillRect(0, 0, w, h); const r = lcg(22);
    for (let i = 0; i < 1600; i++) { const y = r() * h, x = r() * w, l = 80 + r() * 260, c = r(); g.strokeStyle = c < .4 ? `rgba(20,12,8,${.3 + r() * .4})` : c < .8 ? `rgba(110,80,52,${.2 + r() * .35})` : `rgba(170,130,90,${.15 + r() * .25})`; g.lineWidth = .8 + r() * 2.4; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + l * .3, y + (r() - .5) * 5, x + l * .6, y + (r() - .5) * 5, x + l, y + (r() - .5) * 5); g.stroke(); g.beginPath(); g.moveTo(x - w, y); g.lineTo(x - w + l, y); g.stroke(); }
  });
  const hairM = new THREE.MeshStandardMaterial({ map: hairC.rep(5, 1), color: '#FFFFFF', roughness: .66, bumpMap: streakTex3('hairB', 1400, { len: 260, wave: 4, wd: 1.6, seed: 21 }).rep(5, 1), bumpScale: 2, envMapIntensity: .5 });
  const hairM2 = hairM.clone(); hairM2.color.set('#B8A898');
  const locks = 22, r = lcg(5);
  for (let l = 0; l < locks; l++) {
    const ph = l / locks * TAU + (r() - .5) * .3, pts = [], turns = 1.35 + r() * .5, j0 = r() * 10, rr = .032 + r() * .022;
    for (let i = 0; i <= 44; i++) {
      const k = i / 44, a = ph + k * turns * TAU, y = lerp(.02, .84 + r() * .02, Math.pow(k, .9)), R = lerp(.42, .07, Math.pow(k, .8)) * (1 + .09 * Math.sin(k * 11 + j0)) + .015 * Math.sin(k * 23 + l);
      pts.push([Math.cos(a) * R, y + .015 * Math.sin(k * 17 + j0), Math.sin(a) * R]);
    }
    tubeP3(G, pts, [rr, rr * .45], l % 2 ? hairM : hairM2, { segs: 220, radial: 12 });
  }
  // the knot's top: a lock wound in a flat coil
  { const pts = []; for (let i = 0; i <= 30; i++) { const k = i / 30, a = k * 2.2 * TAU; pts.push([Math.cos(a) * .1 * (1 - k * .6), .86 + .06 * k, Math.sin(a) * .1 * (1 - k * .6)]); } tubeP3(G, pts, [.05, .03], hairM, { segs: 120 }); }
  // locks falling from the knot's foot down past it
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * TAU + .3, x0 = Math.cos(a) * .42, z0 = Math.sin(a) * .42;
    tubeP3(G, [[x0 * .9, .14, z0 * .9], [x0 * 1.15, .02, z0 * 1.15], [x0 * 1.3 + (r() - .5) * .1, -.3, z0 * 1.3], [x0 * 1.38, -.7 - r() * .2, z0 * 1.38]], [.045, .018], hairM2, { segs: 60, radial: 10 });
  }
  // a band of rudraksha at the knot's foot
  const beadM = std3('#5E2F1B', .55);
  for (let i = 0; i < 40; i++) { const a = i / 40 * TAU; mesh3(G, new THREE.SphereGeometry(.022, 10, 8), beadM, [Math.cos(a) * .45, .1, Math.sin(a) * .45]); }
  // the crescent: an extruded crescent shape, softly lit from inside
  const cs = new THREE.Shape(); cs.absarc(0, 0, .13, -1.2, 1.9, false); cs.absarc(.045, .035, .11, 1.75, -1.05, true);
  const moon = mesh3(G, new THREE.ExtrudeGeometry(cs, { depth: .02, bevelEnabled: true, bevelThickness: .01, bevelSize: .008, bevelSegments: 3, curveSegments: 32 }), std3('#F4EEDA', .4, { emissive: '#CFDDF8', emissiveIntensity: .55 }), [.32, .58, .2], { rot: [0, .7, -.4] });
  G.moon = moon;
  return G;
}
// ganga3(parent, jataTop): the torrent from the sky onto the knot, three streams winding down round the locks, the one
// stream running out at the front; spray. .set(t, { fall 0..1 (the torrent's front), hit (spray), wind 0..1, out 0..1, a })
function ganga3(parent) {
  const G = new THREE.Group(); parent.add(G);
  const fallM = new THREE.MeshStandardMaterial({ map: waterTex3().rep(3, 1), color: '#DDF0FF', transparent: true, opacity: .9, roughness: .1, emissive: '#5A9AC8', emissiveIntensity: .9, depthWrite: false });
  const fallPts = [[0, 9, -.2], [0, 6, -.12], [0, 3, -.05], [0, 1.5, 0], [0, .95, 0]];
  const fall = mesh3(G, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(fallPts.map(p => V3(...p))), 80, .07, 20, false), fallM, [0, 0, 0], { cast: false, receive: false });
  const sheathM = new THREE.MeshBasicMaterial({ map: waterTex3().rep(2, 1), color: '#9FD0FF', transparent: true, opacity: .22, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  const sheath = mesh3(fall, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(fallPts.map(p => V3(...p))), 80, .15, 20, false), sheathM, [0, 0, 0], { cast: false, receive: false });
  const fallGlow = [...Array(10)].map((_, i) => glow3(G, [0, 1 + i * .8, 0], 1.0, '#BFE6FF', .0));
  // the winding streams: helices down the knot
  const winds = [0, 1, 2, 3, 4, 5, 6].map(k => {
    const pts = [], ph = k / 7 * TAU + k * .7, dr = .02 * (k % 3), turns = 1.9 + .25 * (k % 2);
    for (let i = 0; i <= 70; i++) { const u = i / 70, a = ph + u * turns * TAU, y = lerp(.9, .1, u), R = lerp(.1, .47, Math.pow(u, .85)) + .045 + dr + .01 * Math.sin(u * 30 + k); pts.push([Math.cos(a) * R, y, Math.sin(a) * R]); }
    return stream3(G, pts, .006 + .003 * (k % 3), { col: '#E4F4FF', glow: '#7AC0F0', speed: 2.4 + .3 * k, segs: 200, opacity: .62 });
  });
  const out = stream3(G, [[.05, .14, .48], [.08, .1, .62], [.1, -.15, .72], [.11, -.6, .76], [.11, -1.4, .78]], .022, { col: '#E0F2FF', glow: '#4A8AB8', speed: 2.6, segs: 80, opacity: .85 });
  const spray = [...Array(40)].map(() => glow3(G, [0, 0, 0], .1, '#E4F4FF', 0)), sr = lcg(3), sd = spray.map(() => [sr() * TAU, .5 + sr(), sr()]);
  const mist = glow3(G, [0, 1.0, 0], 2.4, '#A8D4FF', 0);
  G.set = (t, o = {}) => {
    const a = o.a ?? 1, f = clamp(o.fall ?? 0);
    fall.visible = f > .001 && a > 0; fallM.map.offset.x = -t * 3.4; fallM.opacity = .9 * a; sheathM.map.offset.x = -t * 2.6; sheath.geometry.setDrawRange(0, Math.floor(f * 80) * 20 * 6);
    // the front comes down from the sky: draw the tube from its top as far as the front
    fall.geometry.setDrawRange(0, Math.floor(f * 80) * 20 * 6);
    const lift = o.lift ?? 0;   // the torrent's tail leaving upward (Shiva holds her: the fall stops)
    fall.position.y = lift * 8;
    fallGlow.forEach((g, i) => { const y = 9 - i * .9; g.position.set(0, y + lift * 8, 0); g.material.opacity = .22 * a * (y > 9 - f * 8.1 ? 1 : 0); });
    winds.forEach((w, i) => w.set(t + i * .3, clamp((o.wind ?? 0) * 1.3 - i * .06)));
    out.set(t, o.out ?? 0);
    const hit = o.hit ?? 0;
    spray.forEach((s, i) => { const [ang, sp, ph] = sd[i], k = ((t * 1.6 * sp + ph) % 1); s.position.set(Math.cos(ang) * k * .9, .95 + k * .5 * sp - k * k * 1.1, Math.sin(ang) * k * .9); s.material.opacity = hit * (1 - k) * .55; s.scale.setScalar(.06 + .12 * k); });
    mist.material.opacity = .35 * hit;
  };
  G.set(0, {});
  return G;
}

// ======================================================================================================
// the rudraksha mala (ad 56's bead, low-res copies on a red thread)
// ======================================================================================================
const NZ = (() => {
  const P = new Uint8Array(512); { const r = lcg(77), p = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) P[i] = p[i & 255]; }
  const fd = t => t * t * (3 - 2 * t), hv = (x, y, z) => P[P[P[x & 255] + (y & 255)] + (z & 255)] / 255;
  function vn(x, y, z) {
    const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z), u = fd(x - X), v = fd(y - Y), w = fd(z - Z);
    const a = lerp(lerp(hv(X, Y, Z), hv(X + 1, Y, Z), u), lerp(hv(X, Y + 1, Z), hv(X + 1, Y + 1, Z), u), v);
    const b = lerp(lerp(hv(X, Y, Z + 1), hv(X + 1, Y, Z + 1), u), lerp(hv(X, Y + 1, Z + 1), hv(X + 1, Y + 1, Z + 1), u), v);
    return lerp(a, b, w);
  }
  const fbm = (x, y, z, o = 4) => { let s = 0, a = .5, f = 1, n = 0; for (let i = 0; i < o; i++) { s += a * vn(x * f + i * 17.3, y * f, z * f); n += a; a *= .5; f *= 2.03; } return s / n; };
  return { vn, fbm };
})();
// the bead's surface: tubercles (Worley cells), N grooves pole to pole, the bore (from ad 56, the low-res path only)
const BEAD = (() => {
  const SP = .092, PTS = [], GRID = new Map(), CELL = .1, key = (x, y, z) => ((x + 12) * 32 + (y + 12)) * 32 + (z + 12);
  { const n = Math.round(4 * Math.PI / (SP * SP)), r = lcg(5), ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - 2 * (i + .5) / n, s = Math.sqrt(1 - y * y), a = i * ga;
      let p = [s * Math.cos(a) + (r() - .5) * SP * .7, y + (r() - .5) * SP * .7, s * Math.sin(a) + (r() - .5) * SP * .7];
      const l = Math.hypot(...p); p = p.map(v => v / l); p.h = .55 + .45 * r(); PTS.push(p);
      const k = key(Math.floor(p[0] / CELL), Math.floor(p[1] / CELL), Math.floor(p[2] / CELL));
      if (!GRID.has(k)) GRID.set(k, []); GRID.get(k).push(p);
    } }
  function worley(x, y, z) {
    let f1 = 9, f2 = 9, h = 1; const cx = Math.floor(x / CELL), cy = Math.floor(y / CELL), cz = Math.floor(z / CELL);
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) {
      const L = GRID.get(key(cx + i, cy + j, cz + k)); if (!L) continue;
      for (const p of L) { const d = Math.hypot(p[0] - x, p[1] - y, p[2] - z); if (d < f1) { f2 = f1; f1 = d; h = p.h; } else if (d < f2) f2 = d; }
    }
    return [f1, Math.min(f2, f1 + SP), h];
  }
  const grooveAngles = N => { const r = lcg(100 + N); return [...Array(N)].map((_, i) => (i + .5) / N * TAU + (N > 1 ? (r() - .5) * TAU / N * .22 : 0)); };
  const wob = (th, i, N) => .07 * Math.sin(2.1 * th + i * 1.9 + N) * Math.sin(th);
  const OBL = .93;
  function surf(x, y, z, N, ang, W) {
    const th = Math.acos(clamp(y, -1, 1)), ph = Math.atan2(z, x), s = Math.sin(th);
    let gm = 0, lip = 0;
    for (let i = 0; i < N; i++) {
      let d = ph - ang[i] - wob(th, i, N); d -= TAU * Math.round(d / TAU);
      const dist = Math.abs(d) * Math.max(s, .04), g = Math.exp(-(dist / W) * (dist / W)); if (g > gm) gm = g;
      const l = Math.exp(-Math.pow((dist - 2.1 * W) / (1.1 * W), 2)); if (l > lip) lip = l;
    }
    let wx = x + .05 * (NZ.fbm(x * 6, y * 6, z * 6, 2) - .5), wy = y + .05 * (NZ.fbm(x * 6 + 7, y * 6, z * 6, 2) - .5), wz = z + .05 * (NZ.fbm(x * 6, y * 6 + 5, z * 6, 2) - .5);
    const wl = Math.hypot(wx, wy, wz); wx /= wl; wy /= wl; wz /= wl;
    const [f1, f2, hc] = worley(wx, wy, wz), dome = clamp(1 - Math.pow(f1 / (.85 * SP), 2)), wall = clamp((f2 - f1) / (.5 * SP));
    const rn = 1 - Math.abs(2 * NZ.fbm(x * 16, y * 16, z * 16, 3) - 1), tub = clamp(hc * (.55 * Math.pow(dome, .8) + .25 * wall) + .3 * rn - .1);
    const tp = Math.min(th, Math.PI - th), hole = Math.exp(-Math.pow(tp / .075, 2)), collar = Math.exp(-Math.pow((tp - .17) / .05, 2));
    const r = 1 + .035 * (NZ.fbm(x * 1.6 + 3, y * 1.6, z * 1.6, 3) - .5) + .055 * tub * (1 - gm) * (1 - hole) - .13 * gm + .025 * lip * (1 - gm) - .3 * hole + .02 * collar * (1 - hole);
    return { r, tub, gm: Math.max(gm, hole * .6), hole };
  }
  const C = h => new THREE.Color(h), COL = { a: C('#2E1E16'), b: C('#553424'), tip: C('#8A664C'), crev: C('#140B07'), groove: C('#120A06'), hole: C('#080402') };
  let D5 = null;
  function data5() {
    if (D5) return D5;
    const [sw, sh, W] = [150, 96, .06], N = 5;
    const g = new THREE.SphereGeometry(1, sw, sh), P = g.attributes.position, n = P.count, ang = grooveAngles(N);
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), tmp = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const x = P.getX(i), y = P.getY(i), z = P.getZ(i), S = surf(x, y, z, N, ang, W);
      pos[i * 3] = x * S.r; pos[i * 3 + 1] = y * S.r * OBL; pos[i * 3 + 2] = z * S.r;
      const v = NZ.fbm(x * 3 + 9, y * 3, z * 3, 3);
      tmp.copy(COL.a).lerp(COL.b, clamp(v * 1.4 - .2)); tmp.lerp(COL.tip, clamp(Math.pow(S.tub, 3) * .9 * (1 - S.gm))); tmp.lerp(COL.crev, clamp(Math.pow(1 - S.tub, 2) * .75 * (1 - S.gm)));
      tmp.lerp(COL.groove, clamp(S.gm * .85)); tmp.lerp(COL.hole, S.hole);
      col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.computeVertexNormals(); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    D5 = g; return g;
  }
  const MAT = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .55, metalness: 0, clearcoat: .15, clearcoatRoughness: .5, sheen: .2, sheenColor: '#C89070', sheenRoughness: .6, envMapIntensity: .6 });
  return { geo: data5, MAT };
})();
// mala3(parent, o): beads on a red thread round a loop. o.n (108), o.r (loop radius), o.sz (bead radius), o.geo / o.mat
// (another bead), o.thread (colour). .set(step, pulse(i) → 0..1 glow). Laid on the floor (y up).
function mala3(parent, o = {}) {
  const G = new THREE.Group(); parent.add(G);
  const n = o.n ?? 108, sz = o.sz ?? .02, R = o.r ?? .74;
  const im = new THREE.InstancedMesh(o.geo || BEAD.geo(), o.mat || BEAD.MAT, n + 1); im.castShadow = im.receiveShadow = true; G.add(im);
  const loop = u => { const a = u * TAU, r = R * (1 - .18 * Math.cos(a)); return [Math.sin(a) * r * .82, 0, -Math.cos(a) * r + R * .19]; };
  const glows = [...Array(n)].map(() => glow3(G, [0, 0, 0], sz * 4.5, '#FFC860', 0));
  if (o.thread !== false) mesh3(G, new THREE.TubeGeometry(new THREE.CatmullRomCurve3([...Array(97)].map((_, i) => V3(...loop(i / 96)).setY(sz * .93)), true), 300, sz * .12, 6, true), std3(o.thread || '#B0201C', .6), [0, 0, 0]);
  const tas = new THREE.Group(); G.add(tas); const tm = std3(o.thread || '#C4241E', .8), rt = lcg(4);
  for (let i = 0; i < 24; i++) mesh3(tas, new THREE.CylinderGeometry(sz * .08, sz * .05, sz * 7, 4), tm, [(rt() - .5) * sz * 1.5, 0, -sz * 4.7 - rt() * sz], { rot: [Math.PI / 2 + (rt() - .5) * .2, 0, (rt() - .5) * .4] });
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), Q2 = new THREE.Quaternion(), E = new THREE.Euler(), P = V3(), Sv = V3(), YAX = V3(0, 1, 0), QZ = new THREE.Quaternion().setFromAxisAngle(V3(0, 0, 1), Math.PI / 2);
  G.set = (step = 0, pulse) => {
    for (let i = 0; i < n; i++) {
      const u = ((i + step) % n + n) % n / (n + 3) + 1.5 / (n + 3), p = loop(u), q = loop(u + .001), d = [q[0] - p[0], q[2] - p[2]];
      Q.setFromAxisAngle(YAX, Math.atan2(-d[1], d[0])).multiply(QZ).multiply(Q2.setFromAxisAngle(YAX, i * 1.3));
      P.set(p[0], sz * .93, p[2]); Sv.setScalar(sz); M.compose(P, Q, Sv); im.setMatrixAt(i, M);
      const k = pulse ? clamp(pulse(i)) : 0; glows[i].position.set(p[0], sz * 1.6, p[2]); glows[i].material.opacity = .9 * k; glows[i].visible = k > .01;
    }
    const p = loop(0); P.set(p[0], sz * 1.25, p[2] - sz * .5); Q.setFromEuler(E.set(Math.PI / 2, 0, 0)); Sv.setScalar(sz * 1.3); M.compose(P, Q, Sv); im.setMatrixAt(n, M);
    tas.position.set(p[0], sz * .5, p[2] - sz * .5);
    im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere();
  };
  G.set(0); G.loop = loop; G.sz = sz;
  return G;
}
// the devotees' three: a crystal mala, a karungali (ebony) mala, a red thread with knots
function malas3(parent) {
  const G = new THREE.Group(); parent.add(G);
  const crystalM = new THREE.MeshPhysicalMaterial({ color: '#E8F2FF', roughness: .04, metalness: 0, transparent: true, opacity: .28, clearcoat: 1, clearcoatRoughness: .02, specularIntensity: 1, envMapIntensity: 2.2, emissive: '#2A3440', emissiveIntensity: .2 });
  const ebonyM = new THREE.MeshPhysicalMaterial({ color: '#1A120C', roughness: .4, clearcoat: .3, clearcoatRoughness: .4, bumpMap: streakTex3('grainB', 500, { len: 300, wave: 8, wd: 2, seed: 13 }), bumpScale: .5, envMapIntensity: .6 });
  const sph = new THREE.SphereGeometry(1, 40, 28);
  const crystal = mala3(G, { n: 54, r: .16, sz: .0085, geo: sph, mat: crystalM, thread: '#E8E0D0' });
  const ebony = mala3(G, { n: 54, r: .16, sz: .0085, geo: sph, mat: ebonyM, thread: '#202020' });
  // the red thread: a loose cord with three knots
  const thread = new THREE.Group(); G.add(thread);
  { const pts = []; for (let i = 0; i <= 80; i++) { const u = i / 80, a = u * TAU * 1.05; pts.push([Math.cos(a) * .15 + .012 * Math.sin(u * 23), .004 + .002 * Math.sin(u * 40), Math.sin(a) * .1]); }
    tubeP3(thread, pts, .0035, std3('#C21A18', .75), { segs: 240, radial: 8 });
    for (const u of [.2, .5, .8]) { const a = u * TAU * 1.05; mesh3(thread, new THREE.SphereGeometry(.008, 12, 10), std3('#B01614', .8), [Math.cos(a) * .15, .006, Math.sin(a) * .1]); } }
  crystal.set(0); ebony.set(0);
  return { G, crystal, ebony, thread };
}

// ======================================================================================================
// the ocean of milk, the halahal (after ad 71's ocean3)
// ======================================================================================================
const milkNormal3 = () => tex3('milkN', 512, 512, (g, w, h) => {
  const o = g.createImageData(w, h), W2 = [[2, 1, 1], [-1, 3, .8], [4, -2, .5], [1, 6, .35], [-5, -3, .3], [7, 2, .2]];
  const H_ = (x, y) => W2.reduce((s, [a, b, k], i) => s + k * Math.sin((a * x + b * y) / w * TAU + i * 1.7), 0);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = (H_(x + 1, y) - H_(x - 1, y)) * 5, dy = (H_(x, y + 1) - H_(x, y - 1)) * 5, l = Math.hypot(dx, dy, 1), k = (y * w + x) * 4;
    o.data[k] = (-dx / l * .5 + .5) * 255; o.data[k + 1] = (dy / l * .5 + .5) * 255; o.data[k + 2] = (1 / l * .5 + .5) * 255; o.data[k + 3] = 255;
  }
  g.putImageData(o, 0, 0);
}, { data: true });
const scaleTex3 = (bump) => tex3('scale' + (bump ? 'B' : 'C'), 256, 256, (g, w, h) => {
  g.fillStyle = bump ? '#404040' : '#1E3A3A'; g.fillRect(0, 0, w, h);
  const s = 32;
  for (let row = -1; row < h / (s * .5) + 1; row++) for (let col = -1; col < w / s + 1; col++) {
    const x = col * s + (row % 2 ? s / 2 : 0), y = row * s * .5, gr = g.createRadialGradient(x, y - s * .2, 1, x, y, s * .62);
    if (bump) { gr.addColorStop(0, '#F0F0F0'); gr.addColorStop(.8, '#909090'); gr.addColorStop(1, '#202020'); }
    else { gr.addColorStop(0, '#5E8A72'); gr.addColorStop(.7, '#2C5248'); gr.addColorStop(1, '#0E1E1E'); }
    g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, s * .55, s * .5, 0, 0, Math.PI); g.fill();
  }
}, bump ? { data: true } : {});
// the poison's stain on the milk: a ragged dark disc, edges glowing faintly violet-green
const stainTex3 = () => tex3('stain', 1024, 1024, (g, w, h) => {
  g.clearRect(0, 0, w, h); const r = lcg(66), cx = w / 2, cy = h / 2;
  for (let i = 0; i < 90; i++) {
    const a = r() * TAU, d = Math.pow(r(), .5) * w * .3, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d, rr = 60 + r() * 180;
    const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(18,8,26,.95)'); gr.addColorStop(.6, 'rgba(30,10,40,.7)'); gr.addColorStop(1, 'rgba(40,14,60,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }
  // tendrils reaching out
  g.lineCap = 'round';
  for (let i = 0; i < 70; i++) { let a = r() * TAU, d = w * .2, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d; g.strokeStyle = `rgba(24,8,34,${.4 + r() * .4})`; g.lineWidth = 8 + r() * 20; g.beginPath(); g.moveTo(x, y); for (let s = 0; s < 14; s++) { a += (r() - .5) * .6; x += Math.cos(a) * 16; y += Math.sin(a) * 16; g.lineTo(x, y); g.lineWidth *= .9; } g.stroke(); }
});
const smokeTex3 = () => tex3('smoke', 256, 256, (g, w, h) => {
  const r = lcg(14); g.clearRect(0, 0, w, h);
  for (let i = 0; i < 26; i++) { const x = w / 2 + (r() - .5) * w * .4, y = h / 2 + (r() - .5) * h * .4, rr = 40 + r() * 70, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
});
const MH = 70, MR = 19;
const mR = (y) => { const k = clamp((y + 6) / (MH + 6)); return MR * Math.pow(1 - k, .62) * (1 + .1 * Math.exp(-((y + 6) / 6))) + 1.2; };
function ocean3() {
  const S = new THREE.Scene();
  // a storm at dusk: bruised violet overhead, a sick green-gold low band
  const sky = sky3(S, [[1, '#0C0C1E'], [.5, '#1E1A36'], [.2, '#3E2E4E'], [.06, '#6A5A5A'], [0, '#8A7A5A'], [-.2, '#5A4A3A'], [-1, '#2A2420']], { r: 1800 });
  S.fog = new THREE.Fog('#4A3E48', 160, 1300);
  env3(S, 'dawn', { k: .35, rot: 1.2 });
  const sun = new THREE.DirectionalLight('#E8C8A8', 1.6); sun.position.set(-160, 60, -260); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -70, right: 70, top: 90, bottom: -20, near: 10, far: 700 }); sun.shadow.bias = -.0006; sun.shadow.normalBias = .3; S.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight('#7A6A98', '#D8C8B8', .55); S.add(hemi);
  const front = new THREE.DirectionalLight('#C8B8D8', .6); front.position.set(200, 60, 160); S.add(front);
  const n1 = milkNormal3().rep(60, 60), n2 = milkNormal3().rep(140, 110);
  const milkM = new THREE.MeshPhysicalMaterial({ color: '#E8E0D4', roughness: .34, normalMap: n1, normalScale: new THREE.Vector2(.45, .45), clearcoat: .4, clearcoatRoughness: .2, clearcoatNormalMap: n2, envMapIntensity: .6 });
  mesh3(S, new THREE.PlaneGeometry(4000, 4000), milkM, [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: true });
  // the stain: grows out from the mountain's foot
  const stainM = new THREE.MeshStandardMaterial({ map: stainTex3(), transparent: true, depthWrite: false, roughness: .3, color: '#8A70A0', emissive: '#2A0A44', emissiveIntensity: .5 });
  const stain = mesh3(S, new THREE.PlaneGeometry(1, 1), stainM, [0, .3, 0], { rot: [-Math.PI / 2, 0, 0], cast: false }); stain.renderOrder = 2;
  const rimTex = tex3('stainRim', 512, 512, (g, w, h) => { const r = lcg(5); g.clearRect(0, 0, w, h); for (let i = 0; i < 260; i++) { const a = r() * TAU, d = w * (.42 + (r() - .5) * .07), x = w / 2 + Math.cos(a) * d, y = h / 2 + Math.sin(a) * d, rr = 8 + r() * 26, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(190,110,255,.55)'); gr.addColorStop(1, 'rgba(120,40,200,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); } });
  const rimM = new THREE.MeshBasicMaterial({ map: rimTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, opacity: 0 });
  const rim = mesh3(S, new THREE.PlaneGeometry(1, 1), rimM, [0, .4, 0], { rot: [-Math.PI / 2, 0, 0], cast: false }); rim.renderOrder = 3;
  // Mount Mandara
  const M = new THREE.Group(); S.add(M);
  {
    const g = new THREE.CylinderGeometry(1, 1, 1, 160, 120, true), p = g.attributes.position, col = new Float32Array(p.count * 3);
    const rock = new THREE.Color('#5A504C'), rock2 = new THREE.Color('#34302E'), green = new THREE.Color('#34502C'), green2 = new THREE.Color('#203A1C'), c = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const ux = p.getX(i), uz = p.getZ(i), y = (p.getY(i) + .5) * (MH + 6) - 6, a = Math.atan2(uz, ux);
      const ridge = 1 - Math.abs(noise3(Math.cos(a) * 3, y * .05, Math.sin(a) * 3)), n = fbm3(Math.cos(a) * 2.2, y * .06, Math.sin(a) * 2.2, 5);
      const gully = 1 - Math.abs(noise3(Math.cos(a) * 7, y * .025, Math.sin(a) * 7)), lobe = noise3(Math.cos(a) * 1.3 + 4, y * .03, Math.sin(a) * 1.3);
      const R = mR(y) * (1 + .26 * n + .16 * ridge * ridge + .1 * gully * gully + .32 * lobe);
      p.setXYZ(i, Math.cos(a) * R, y, Math.sin(a) * R);
      const gk = smooth01((32 - y) / 14) * smooth01((n + .1) * 3), dk = clamp(.5 + n * 1.5);
      c.copy(rock).lerp(rock2, dk).lerp(green, gk * .9).lerp(green2, gk * dk * .6); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals();
    const nm = (window.PBR3DATA || {}).cliff ? imgTex3('pbr_cliff_normal', PBR3DATA.cliff.normal, { data: true }).rep(10, 8) : null;
    mesh3(M, g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .92, normalMap: nm, normalScale: new THREE.Vector2(1.4, 1.4) }), [0, 0, 0]);
    const tg = new THREE.ConeGeometry(.9, 3.2, 6); tg.translate(0, 1.4, 0);
    const trees = new THREE.InstancedMesh(tg, std3('#2A4224', .9), 900), mt = new THREE.Matrix4(), q = new THREE.Quaternion(), r = lcg(17);
    let n = 0;
    for (let i = 0; i < 4000 && n < 900; i++) {
      const y = 1 + r() * 30, a = r() * TAU, f = fbm3(Math.cos(a) * 2.2, y * .06, Math.sin(a) * 2.2, 5);
      if (f < -.05 || r() > smooth01((34 - y) / 12) + .1) continue;
      const R = mR(y) * (1 + .26 * f) + .2, s = .7 + r() * .9;
      mt.compose(V3(Math.cos(a) * R, y - .5, Math.sin(a) * R), q.setFromEuler(new THREE.Euler((r() - .5) * .2, r() * TAU, (r() - .5) * .2)), V3(s, s * (.8 + r() * .5), s));
      trees.setMatrixAt(n++, mt);
    }
    trees.count = n; trees.castShadow = true; M.add(trees);
    const crag = std3('#4A423E', .95, { normalMap: nm });
    [[0, MH - 4, 0, 3.2, 12], [2.6, MH - 9, 1.5, 2.4, 9], [-2.4, MH - 11, -1.2, 2.2, 8]].forEach(([x, y, z, r, h]) => mesh3(M, new THREE.ConeGeometry(r, h, 7, 3), crag, [x, y + h / 2 - 2, z], { rot: [.08 * x, 0, -.06 * z] }));
  }
  // Vasuki round the mountain, off to both horizons
  const vasM = new THREE.MeshStandardMaterial({ map: scaleTex3(false), bumpMap: scaleTex3(true), bumpScale: 1.4, roughness: .5, envMapIntensity: .5 });
  const vPts = [[-900, 16, 60], [-300, 14, 28], [-70, 11, 14]], T0 = 2.9, T1 = 2.5 * TAU + T0;
  for (let i = 0; i <= 60; i++) { const k = i / 60, a = lerp(T0, T1, k), y = lerp(10, 30, k), R = mR(y) * 1.06 + 1.9; vPts.push([Math.cos(a) * R, y, Math.sin(a) * R]); }
  vPts.push([60, 31, -8], [300, 29, -40], [900, 27, -80]);
  const vCurve = new THREE.CatmullRomCurve3(vPts.map(p => V3(...p)), false, 'centripetal'), vLen = vCurve.getLength();
  vasM.map.repeat.set(vLen / 9, 1); vasM.bumpMap.repeat.set(vLen / 9, 1);
  mesh3(S, new THREE.TubeGeometry(vCurve, 900, 2.1, 20, false), vasM, [0, 0, 0]);
  // the smoke: dark puffs rising from the stain and spreading (normal blending, so they darken the sky)
  const smokeM = new THREE.SpriteMaterial({ map: smokeTex3(), color: '#241030', transparent: true, depthWrite: false, opacity: 0 });
  const puffs = [...Array(140)].map(() => { const s = new THREE.Sprite(smokeM.clone()); S.add(s); return s; }), pr = lcg(23), pd = puffs.map(() => [pr() * TAU, pr(), pr(), .6 + pr() * .8]);
  const glowP = [...Array(12)].map(() => glow3(S, [0, 0, 0], 40, '#7A3AA8', 0)); glowP.forEach(g => g.material.fog = false);
  // set(t, o): o.spread 0..1 (the stain's reach and the smoke's height), o.churn, o.dark (the light falling as the poison rises)
  const set = (t, o = {}) => {
    const sp = o.churn ?? 1, ang = .55 * Math.sin(t * .9 * sp) + t * .05 * sp; M.rotation.y = ang;
    const pull = Math.sin(t * .9 * sp) * 2.4 + t * .4; vasM.map.offset.x = pull / 9; vasM.bumpMap.offset.x = pull / 9;
    n1.offset.set(t * .004, t * .008); n2.offset.set(-t * .006, t * .01);
    const k = clamp(o.spread ?? 0), dk = clamp(o.dark ?? k);
    stain.visible = k > .001; stain.scale.setScalar(80 + 1400 * Math.pow(k, 1.2)); sky.material.color.setScalar(1 - .55 * dk); stain.rotation.z = t * .02;
    stainM.opacity = clamp(k * 3); stainM.emissiveIntensity = .5 + .3 * Math.sin(t * 3);
    milkM.color.set('#E8E0D4').lerp(new THREE.Color('#9A8EA0'), dk * .35);
    sun.intensity = 1.6 * (1 - .4 * dk); hemi.intensity = .55 * (1 - .3 * dk); front.intensity = .6 * (1 - .3 * dk); rim.visible = k > .001; rim.scale.setScalar(stain.scale.x * .62); rimM.opacity = clamp(k * 3) * (.55 + .2 * Math.sin(t * 2.3)); rimM.map.rotation = t * .03;
    puffs.forEach((p, i) => {
      const [a, d, ph, s] = pd[i], age = ((t * .12 * s + ph) % 1), reach = 20 + 260 * k * d;
      const x = Math.cos(a + age * .4) * (mR(0) + reach * (.3 + age)), z = Math.sin(a + age * .4) * (mR(0) + reach * (.3 + age)), y = 5 + age * (40 + 160 * k) * s;
      p.position.set(x, y, z); p.scale.setScalar((30 + 110 * age) * s * (.5 + k)); p.material.opacity = Math.min(1, k * 1.6) * .8 * Math.sin(age * Math.PI); p.material.rotation = ph * 6 + t * .1 * (i % 2 ? 1 : -1); p.visible = k > .01;
    });
    glowP.forEach((g, i) => { const a = i / 12 * TAU + t * .05, d = 30 + 200 * k * ((i * .37) % 1); g.position.set(Math.cos(a) * d, 3, Math.sin(a) * d); g.material.opacity = .25 * k * (.6 + .4 * Math.sin(t * 2 + i)); g.scale.setScalar(30 + 60 * k); });
  };
  return { S, M, sky, stain, set };
}
