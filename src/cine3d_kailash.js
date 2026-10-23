// cine3d_kailash.js: Mount Kailash and its plateau for the 3D style (load after cine3d.js). A procedural massif: the
// summit's ice dome, the four steep faces (north, south, east, west) banded with snow-filled ledges, the long cleft down
// the south face, the ridges round it; the kora valley that circles it (Darchen in the south, the Lha Chu valley west,
// Dirapuk under the north face, the Dolma La pass in the north-east, the Zhong Chu valley east); Lake Manasarovar and
// Rakshastal to the south, Gurla Mandhata's snow dome beyond them; far ranges all round. Rock, snow and tundra are
// coloured per pixel in the terrain's shader from height, slope and noise, so the snow ledges stay crisp at any distance.
// Units: 1 = 100 m; y up (0 = Darchen, ~4,575 m), north = -z, east = +x; the summit over (0, 0), ~21 up (~6,640 m).
//
//   const K3 = kailash3();             K3.scene, K3.h(x, z) (the ground's height), K3.kora(s) (the path, s 0..1 from
//   Darchen clockwise: .25 west, .5 north (Dirapuk), .62 the Dolma La, .75 east), K3.mood(name, o) → exposure
//   (morning, day, golden, alpen, blue, map), K3.set(t, o) (clouds, the summit's plume, the stars, the moon),
//   K3.ribbon(s0, s1, o) (a glowing line along the kora, .set(on)), K3.river(points, o) (a glowing river, .set(t, on)),
//   K3.flags(s, o) (strings of prayer flags across the path at s).
const KAI = { H: 21, top: 17.2, snow: 9, lake: -.15, far: 4200 };

// ---------- the ground ----------
// a 2D value noise and fbm (JS, to build the mesh and place things on it)
const kHash = (x, z) => { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); };
function kNoise(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z), fx = x - xi, fz = z - zi, u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  return lerp(lerp(kHash(xi, zi), kHash(xi + 1, zi), u), lerp(kHash(xi, zi + 1), kHash(xi + 1, zi + 1), u), v) * 2 - 1;
}
const kFbm = (x, z, n = 5) => { let s = 0, a = .5, f = 1; for (let i = 0; i < n; i++) { s += a * kNoise(x * f, z * f); f *= 2.03; a *= .5; } return s; };
// ridged fbm, 0..1 (sharp crests)
const kRidge = (x, z, n = 5) => { let s = 0, a = .5, f = 1, w = 1; for (let i = 0; i < n; i++) { let r = 1 - Math.abs(kNoise(x * f + 17, z * f - 9)); r *= r * w; w = clamp(r * 1.6); s += a * r; f *= 2.1; a *= .5; } return s; };
const smin = (a, b, k) => { const h = clamp(.5 + .5 * (b - a) / k); return lerp(b, a, h) - k * h * (1 - h); };
const smax = (a, b, k) => -smin(-a, -b, k);

// The kora: a loop round the peak, its distance from the summit (r) and its height (y) by bearing. Bearings th are
// atan2(z, x): 0 east, π/2 south, π west, -π/2 north. Walked clockwise seen from above: south → west → north → east.
const KORA = [   // [th, r, y]
  [Math.PI / 2, 44, 0],           // Darchen, south
  [Math.PI * .75, 36, .9],        // into the Lha Chu valley, south-west
  [Math.PI, 30, 1.8],             // west
  [-Math.PI * .7, 25, 2.8],       // north-west
  [-Math.PI / 2, 21, 3.2],        // Dirapuk, under the north face
  [-Math.PI * .32, 25, 7.5],      // climbing
  [-Math.PI / 4, 28, 10.6],       // the Dolma La (~5,630 m)
  [-Math.PI * .1, 30, 5.2],       // down to the Zhong Chu
  [0, 32, 3],                     // east
  [Math.PI / 4, 38, 1.4],         // south-east
];
// r and y of the kora at bearing th (a smooth periodic interpolation through KORA)
function koraAt(th) {
  const P = KORA.map(([a, r, y]) => [((a % TAU) + TAU) % TAU, r, y]).sort((p, q) => p[0] - q[0]), n = P.length;
  const t = ((th % TAU) + TAU) % TAU;
  let i = 0; while (i < n && P[i][0] <= t) i++;
  const p1 = P[(i - 1 + n) % n], p2 = P[i % n], p0 = P[(i - 2 + n) % n], p3 = P[(i + 1) % n];
  let a1 = p1[0], a2 = p2[0]; if (a2 <= a1) a2 += TAU; let tt = t; if (tt < a1) tt += TAU;
  const k = (tt - a1) / (a2 - a1), cr = (a, b, c, d) => .5 * (2 * b + (-a + c) * k + (2 * a - 5 * b + 4 * c - d) * k * k + (-a + 3 * b - 3 * c + d) * k * k * k);
  return { r: cr(p0[1], p1[1], p2[1], p3[1]), y: Math.max(0, cr(p0[2], p1[2], p2[2], p3[2])) };
}

// the peak alone (also used for the comparison stage): s scales its height
function kailashPeak(x, z, s = 1) {
  const p = 3.6, ax = Math.abs(x) / 1.1, az = Math.abs(z), d = Math.pow(Math.pow(ax, p) + Math.pow(az, p), 1 / p), th = Math.atan2(z, x);
  const dome = KAI.H - .15 * d * d, cliff = KAI.top + .6 - (d - 4.6) * 2.15, foot = 8.2 * Math.exp(-Math.max(0, d - 6.2) / 8) + .5 * Math.max(0, 6.2 - d);
  let h = smin(dome, smax(cliff, foot, 1.5), 1.2);
  const face = seg(h, 6, 8) * (1 - seg(h, 17, 18.5));
  // buttresses and flutes running down the faces
  h += 1.8 * (kRidge(th * 4.5 + 3.1, d * .05, 2) - .4) * face * seg(d, 3.2, 5);
  h += .6 * kFbm(th * 12, d * .2, 3) * face;
  // ledges: the faces step down in uneven tiers (snow lies on them)
  const tier = 1.15, f = h / tier + .45 * kFbm(x * .3, z * .3, 3);
  const stepped = tier * (Math.floor(f) + Math.pow(clamp((f - Math.floor(f)) / .7), 1.5));
  h = lerp(h, stepped, .38 * face);
  // the cleft down the middle of the south face, fainter gullies on the others
  const fall = seg(d, 2.4, 4.4) * (1 - seg(d, 10, 16));
  h -= 3.4 * Math.exp(-Math.pow(x / 1.2, 2)) * fall * seg(z, 1, 3);
  h -= 1.0 * Math.exp(-Math.pow((x - 2.6) / .6, 2)) * fall * seg(z, 1, 3) + 1.0 * Math.exp(-Math.pow((x + 2.8) / .6, 2)) * fall * seg(z, 1, 3);
  h -= 1.4 * Math.exp(-Math.pow(z / 1.1, 2)) * fall * seg(-x, 1, 3);
  h += .5 * kFbm(x * .7 + 3, z * .7, 4) * seg(d, 3, 6);
  return h * s;
}

// the whole ground
function kailashH(x, z) {
  const r = Math.hypot(x, z), th = Math.atan2(z, x), K = koraAt(th);
  const peak = kailashPeak(x, z);
  // spurs: four ridges leaving the massif on the diagonals (the two in front frame the south face)
  const rr = kRidge(x * .09 + 5, z * .09, 4);
  const spur = (11 - .25 * r) * Math.pow(Math.max(0, Math.cos(2 * (th - Math.PI / 4))), 6) * seg(r, 5, 9) * (1 - seg(r, K.r - 8, K.r - 3));
  // the hills: a ring of peaks between the massif and the kora, foothills beyond, the far ranges
  const south = Math.max(0, Math.sin(th));                 // 1 due south (the open side, toward the lakes)
  const rg = kRidge(x * .04, z * .04, 6), rg2 = kRidge(x * .012 + 40, z * .012, 6);
  const inner = (13 - 8 * Math.pow(south, 3)) * seg(r, 9, 15) * (1 - seg(r, K.r - 8, K.r - 3));
  const outer = (13 - 11 * Math.pow(south, 1.5)) * seg(r, K.r + 4, K.r + 16) * (1 - .5 * seg(r, 90, 140));
  const far = 22 * seg(r, 140, 300);
  let h = (inner + outer) * rg + far * rg2 + Math.max(0, spur) * (.55 + .45 * rr) + .6 * kFbm(x * .08, z * .08, 4) + .9 * kRidge(x * .2, z * .2, 3) + .35 * kRidge(x * .7 + 3, z * .7, 3) + 1.5 * seg(r, 60, 200) * kFbm(x * .02, z * .02, 3);
  // Gurla Mandhata, a broad snow dome south of the lakes
  const gx = x - 15, gz = z - 215; h += 26 * Math.exp(-(gx * gx + gz * gz) / (2 * 24 * 24)) * (1 + .2 * kRidge(x * .08, z * .08, 4));
  // the kora's valley floor, rising to the Dolma La
  const dv = r - K.r, w = 4.5 + 3 * south;
  h = lerp(h, K.y + .015 * dv * dv + .25 * kFbm(x * .3, z * .3, 3), Math.exp(-dv * dv / (w * w)));
  h = smax(peak, h, 2.2);
  // the lakes
  // the lakes: their beds dip well under the water at once (no thin film to flicker); everywhere else the ground stays
  // clear of the water's level
  let wet = 0;
  for (const L of KAI_LAKES) { const q = Math.hypot((x - L.x) / L.rx, (z - L.z) / L.rz) + .1 * kFbm(x * .05 + L.x, z * .05), k = 1 - seg(q, .92, 1.08); wet = Math.max(wet, k); h = lerp(h, Math.min(h, KAI.lake - .6 - 1.5 * clamp(1 - q)), k); }
  return wet > 0 ? h : Math.max(h, KAI.lake + .35);
}
const KAI_LAKES = [{ name: 'Manasarovar', x: 32, z: 122, rx: 34, rz: 30 }, { name: 'Rakshastal', x: -40, z: 118, rx: 22, rz: 32 }];

// the mesh: a polar grid, fine near the summit (0.12 apart to r 50), then widening out to the horizon
function kailashGeo() {
  const NA = 720, R = [];
  for (let r = 0; r <= 60; r += .12) R.push(r);
  for (let r = 60 * 1.015; r < 1400; r *= 1.015) R.push(r);
  const NR = R.length, pos = new Float32Array((1 + (NR - 1) * NA) * 3);
  pos.set([0, kailashH(0, 0), 0], 0);
  let k = 3;
  for (let i = 1; i < NR; i++) for (let j = 0; j < NA; j++) {
    const a = j / NA * TAU, x = Math.cos(a) * R[i], z = Math.sin(a) * R[i];
    pos[k++] = x; pos[k++] = kailashH(x, z); pos[k++] = z;
  }
  const idx = [], at = (i, j) => 1 + (i - 1) * NA + (j % NA);
  for (let j = 0; j < NA; j++) idx.push(0, at(1, j + 1), at(1, j));
  for (let i = 1; i < NR - 1; i++) for (let j = 0; j < NA; j++) { const a = at(i, j), b = at(i, j + 1), c = at(i + 1, j), d = at(i + 1, j + 1); idx.push(a, b, c, b, d, c); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(new THREE.BufferAttribute(new Uint32Array(idx), 1));
  g.computeVertexNormals(); return g;
}

// ---------- the terrain's shader ----------
// rock, snow and tundra by height, slope and noise, per pixel; a noise bump on top. o: snow (the snowline), cap (the
// ice dome's foot), band (ledge snow's spacing), bump.
const KAI_GLSL = `
uniform float uSnow, uCap, uBand, uBump, uScale;
varying vec3 vW; varying vec3 vWN;
float kh(vec3 p){ p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float kn(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(mix(kh(i), kh(i + vec3(1,0,0)), f.x), mix(kh(i + vec3(0,1,0)), kh(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(kh(i + vec3(0,0,1)), kh(i + vec3(1,0,1)), f.x), mix(kh(i + vec3(0,1,1)), kh(i + vec3(1,1,1)), f.x), f.y), f.z) * 2. - 1.; }
float kf(vec3 p){ float s = 0., a = .5; for (int i = 0; i < 5; i++) { s += a * kn(p); p = p * 2.07 + 13.1; a *= .5; } return s; }
`;
function terrainMat3(o = {}) {
  const m = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: .92, metalness: 0 });
  const U = { uSnow: { value: o.snow ?? KAI.snow }, uCap: { value: o.cap ?? KAI.top - 1.2 }, uBand: { value: o.band ?? 1.25 }, uBump: { value: o.bump ?? 1.3 }, uScale: { value: o.scale ?? 1 } };
  m.userData.U = U;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vW; varying vec3 vWN;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvW = (modelMatrix * vec4(transformed, 1.)).xyz; vWN = normalize(mat3(modelMatrix) * objectNormal);');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + KAI_GLSL)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      {
        vec3 P = vW / uScale; vec3 wn = normalize(vWN);
        float n1 = kf(P * .35), n2 = kf(P * 2.3 + 7.), n3 = kf(P * 9. + 3.);
        float y = P.y, up = wn.y;
        // the bump: fine noise, stronger on rock
        float e = .05; vec3 Q = P * 2.3 + 7.;
        vec3 gr = vec3(kf(Q + vec3(e,0,0)) - n2, kf(Q + vec3(0,e,0)) - n2, kf(Q + vec3(0,0,e)) - n2) / e;
        vec3 Q3 = P * 9. + 3.; vec3 gr3 = vec3(kf(Q3 + vec3(e,0,0)) - n3, kf(Q3 + vec3(0,e,0)) - n3, kf(Q3 + vec3(0,0,e)) - n3) / e;
        // snow: on gentle slopes above the snowline, all over the ice dome, on the ledges of the faces
        float flt = smoothstep(.5, .78, up + n2 * .18);
        float snow = flt * smoothstep(uSnow - 1.5, uSnow + 1.5, y + n1 * 3.);
        float cap = smoothstep(uCap - .6, uCap + .6, y + n2 * 1.2 + n3 * .6) * smoothstep(.05, .3, up);
        float drip = smoothstep(uCap - 4., uCap, y) * smoothstep(.2, .7, kf(vec3(atan(P.z, P.x) * 14., y * .08, 0.)) + n3 * .3) * .9;
        float ledge = smoothstep(.56, .74, up + n3 * .14) * smoothstep(uSnow - 2., uSnow + 1., y);
        float stripe = smoothstep(.72 + .2 * n2, .95, sin(y * 6.2832 / uBand + n1 * 3.5 + n2 * 1.5)) * smoothstep(uSnow - 1., uSnow + 2., y) * (1. - smoothstep(.75, .95, up)) * .8;
        snow = clamp(max(max(snow, max(cap, drip)), max(ledge, stripe)), 0., 1.);
        snow = smoothstep(.3, .7, snow + n3 * .15);
        // rock: dark brown-grey in layers; tundra: ochre and olive, gravel paler
        float layer = .5 + .5 * sin(y * 4.3 + n1 * 6. + n2 * 2.);
        vec3 rock = mix(vec3(.10, .085, .08), vec3(.27, .23, .20), clamp(layer * .55 + n2 * .5 + n3 * .35 + .2, 0., 1.));
        rock = mix(rock, vec3(.36, .22, .16), smoothstep(.2, .6, n1) * .35);
        vec3 tun = mix(vec3(.31, .24, .17), vec3(.25, .23, .15), smoothstep(-.2, .4, n1));
        tun = mix(tun, vec3(.44, .38, .30), smoothstep(.1, .6, n3) * .4);
        tun = mix(tun, vec3(.5, .33, .24), smoothstep(.25, .7, n2) * .3);
        float steep = 1. - smoothstep(.62, .82, up + n2 * .1);
        vec3 ground = mix(tun, rock, max(steep, smoothstep(7., 11., y) * .6));
        vec3 sn = mix(vec3(.84, .87, .93), vec3(.97, .98, 1.), smoothstep(-.3, .5, n2));
        diffuseColor.rgb = mix(ground, sn, snow);
        roughnessFactor = mix(.95, .6, snow);
        vec3 wb = normalize(wn - uBump * ((1. - snow * .7) * .06 * (gr - dot(gr, wn) * wn) + (1. - snow) * .03 * (gr3 - dot(gr3, wn) * wn)));
        normal = normalize((viewMatrix * vec4(wb, 0.)).xyz);
      }`);
  };
  return m;
}

// ---------- the sky, sun, moon, stars, clouds ----------
const KAI_MOODS = {
  morning: { sky: [[1, '#0A2A70'], [.5, '#1E58B0'], [.15, '#4E8CD0'], [0, '#A8C8E6'], [-1, '#6A7480']], sun: ['#FFE6C8', 3.4, [.75, .42, .55]], hemi: ['#9AB8E8', '#6A5A40', .8], fog: ['#9EC0E2', 200, 2200], exposure: 1 },
  day: { sky: [[1, '#0F3780'], [.5, '#2A62B4'], [.12, '#86B2DE'], [0, '#D2E2EE'], [-1, '#6A7480']], sun: ['#FFF4E4', 3.4, [.25, .9, .7]], hemi: ['#A8C4EA', '#7A6648', 1], fog: ['#C4D6E8', 140, 1600], exposure: 1 },
  golden: { sky: [[1, '#1C3474'], [.45, '#3E5A9A'], [.15, '#C89A86'], [0, '#F4C08A'], [-1, '#5A4A44']], sun: ['#FFB878', 3.3, [-.85, .2, .48]], hemi: ['#8C9AC8', '#5A4434', .7], fog: ['#D8B8A0', 120, 1400], exposure: 1.02 },
  alpen: { sky: [[1, '#141C46'], [.45, '#33336A'], [.16, '#8A5A82'], [.04, '#E08A78'], [0, '#F6B088'], [-1, '#2A2230']], sun: ['#FF8A62', 3.6, [-.95, .055, .3]], hemi: ['#6A6CA8', '#3A2A30', .5], fog: ['#7C6A8A', 100, 1200], exposure: 1.08 },
  blue: { sky: [[1, '#03061A'], [.4, '#0A1440'], [.08, '#24356E'], [0, '#3A4A80'], [-1, '#0A0C18']], sun: ['#A8BCFF', 1.8, [.4, .45, -.8]], hemi: ['#4A5CA0', '#14121C', .6], fog: ['#1C2650', 80, 1000], exposure: 1.15 },
  map: { sky: [[1, '#2A62B4'], [0, '#C4D6E8'], [-1, '#6A7480']], sun: ['#FFF0DC', 3.6, [-.6, .5, -.35]], hemi: ['#A4BCE0', '#6A5638', .75], fog: ['#C4D6E8', 600, 3000], exposure: 1 },
};
const cloudTex3 = () => tex3('kcloud', 256, 128, (g) => {
  const r = lcg(77); g.filter = 'blur(7px)';
  for (let i = 0; i < 26; i++) { const x = 40 + r() * 176, y = 70 - Math.sin((x - 40) / 176 * Math.PI) * 22 + r() * 18, rr = 14 + r() * 26, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
});
const plumeTex3 = () => tex3('kplume', 256, 64, (g) => {
  g.filter = 'blur(6px)'; const r = lcg(5);
  for (let i = 0; i < 60; i++) { const x = r() * 220 + 10, k = x / 230, y = 32 + (r() - .5) * 26 * k, rr = 6 + 14 * k, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, `rgba(255,255,255,${.5 * (1 - k * .7)})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, 2 * rr, 2 * rr); }
});
const moonTex3 = () => tex3('kmoon', 128, 128, (g) => {
  g.fillStyle = '#FFF6DE'; g.shadowColor = '#FFF0C8'; g.shadowBlur = 14;
  g.beginPath(); g.arc(64, 64, 34, 0, TAU); g.fill(); g.globalCompositeOperation = 'destination-out'; g.shadowBlur = 4; g.beginPath(); g.arc(80, 54, 31, 0, TAU); g.fill();
});

function kailash3(o = {}) {
  const scene = new THREE.Scene(), skies = {};
  for (const k in KAI_MOODS) skies[k] = sky3(scene, KAI_MOODS[k].sky, { r: 3000 });
  const hemi = new THREE.HemisphereLight('#FFFFFF', '#000000', 1); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#FFFFFF', 1); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.bias = -.0004; sun.shadow.normalBias = .08; sun.shadow.radius = 2;
  scene.add(sun, sun.target);
  scene.fog = new THREE.Fog('#000000', 100, 1000);
  const mat = terrainMat3(), ground = mesh3(scene, kailashGeo(), mat);
  // the lakes: one water plane, a turquoise that deepens
  const envRT = new THREE.PMREMGenerator(GL3);
  const water = new THREE.MeshStandardMaterial({ color: '#1E5E86', roughness: .12, metalness: .35 });
  // one water surface per lake, a little wider than its shore (the shore's ground rises above it)
  const lake = new THREE.Group(); scene.add(lake);
  for (const L of KAI_LAKES) mesh3(lake, new THREE.CircleGeometry(1, 96), water, [L.x, KAI.lake, L.z], { rot: [-Math.PI / 2, 0, 0], scale: [L.rx * 1.25, L.rz * 1.25, 1], cast: false });
  const envs = {};
  // sun disc, moon, stars
  const sunDisc = glow3(scene, [0, 0, 0], 120, '#FFF2D8', 1), sunHalo = glow3(scene, [0, 0, 0], 600, '#FFC080', .5);
  const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: moonTex3(), transparent: true, depthWrite: false, fog: false })); moon.scale.setScalar(70); scene.add(moon);
  const sg = new THREE.BufferGeometry(), sp = [], rs = lcg(9);
  for (let i = 0; i < 1600; i++) { const a = rs() * TAU, e = Math.asin(.05 + rs() * .95), R = 2800; sp.push(Math.cos(a) * Math.cos(e) * R, Math.sin(e) * R, Math.sin(a) * Math.cos(e) * R); }
  sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: '#FFFFFF', size: 2.2, sizeAttenuation: false, transparent: true, opacity: .9, fog: false, depthWrite: false })); scene.add(stars);
  // clouds: drifting sprites at and below the summit; the plume streaming off the summit
  const clouds = [], rc = lcg(31);
  for (let i = 0; i < 26; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex3(), transparent: true, depthWrite: false, opacity: .8 }));
    const a = rc() * TAU, r = 40 + rc() * 260; s.userData = { x: Math.cos(a) * r, z: Math.sin(a) * r, y: 22 + rc() * 22, w: 40 + rc() * 70, v: .4 + rc() * .8 };
    s.scale.set(s.userData.w, s.userData.w * .45, 1); scene.add(s); clouds.push(s);
  }
  const plume = new THREE.Sprite(new THREE.SpriteMaterial({ map: plumeTex3(), transparent: true, depthWrite: false, opacity: .6 }));
  plume.center.set(0, .5); plume.position.set(.5, KAI.H - .2, 0); plume.scale.set(22, 5, 1); scene.add(plume);

  let M = KAI_MOODS.day;
  const sunDir = V3();
  const mood = (name, mo = {}) => {
    M = KAI_MOODS[name];
    for (const k in skies) skies[k].visible = k === name;
    hemi.color.set(M.hemi[0]); hemi.groundColor.set(M.hemi[1]); hemi.intensity = mo.hemi ?? M.hemi[2];
    sun.color.set(mo.sunCol || M.sun[0]); sun.intensity = mo.sun ?? M.sun[1];
    sunDir.set(...(mo.sunAt || M.sun[2])).normalize();
    const ext = mo.shadow ?? 60, c = mo.at || [0, 8, 0];
    sun.target.position.set(...c); sun.position.set(c[0] + sunDir.x * 400, c[1] + sunDir.y * 400, c[2] + sunDir.z * 400);
    Object.assign(sun.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 50, far: 900 }); sun.shadow.camera.updateProjectionMatrix();
    scene.fog.color.set(M.fog[0]); scene.fog.near = mo.fogNear ?? M.fog[1]; scene.fog.far = mo.fogFar ?? M.fog[2];
    const night = name === 'blue';
    sunDisc.visible = sunHalo.visible = !night && mo.disc !== false;
    sunDisc.position.copy(sunDir).multiplyScalar(2700); sunHalo.position.copy(sunDisc.position);
    sunDisc.material.color.set(M.sun[0]); sunHalo.material.color.set(name === 'alpen' || name === 'golden' ? '#FF9A60' : '#FFE0B0');
    stars.visible = night || mo.stars > 0; stars.material.opacity = mo.stars ?? .9;
    moon.visible = !!mo.moon || night; moon.position.set(...(mo.moon || [380, 900, -2400]));
    if (!envs[name]) { const tmp = new THREE.Scene(); tmp.add(sky3(tmp, M.sky, { r: 100 })); envs[name] = envRT.fromScene(tmp, 0, .1, 300).texture; }
    water.envMap = envs[name]; water.envMapIntensity = 1;
    return mo.exposure ?? M.exposure;
  };
  // set(t, o): o.clouds (0..1 opacity), o.plume (0..1), o.wind (cloud drift speed)
  const set = (t, so = {}) => {
    const cl = so.clouds ?? .8, tint = so.cloudCol || (M === KAI_MOODS.alpen ? '#F2B6A8' : M === KAI_MOODS.golden ? '#FFE0C0' : M === KAI_MOODS.blue ? '#4A5888' : '#FFFFFF');
    clouds.forEach((s, i) => { const d = s.userData; s.visible = cl > .01; s.material.opacity = cl * .75; s.material.color.set(tint); s.position.set(d.x + t * d.v * (so.wind ?? 1.5), d.y, d.z); });
    const pl = so.plume ?? .7; plume.visible = pl > .01; plume.material.opacity = pl * (.5 + .15 * Math.sin(t * 1.3)); plume.material.color.set(tint);
    plume.scale.set(20 + 3 * Math.sin(t * .7), 4.5 + .8 * Math.sin(t * 1.1), 1); plume.material.rotation = -.06 + .03 * Math.sin(t * .5);
  };
  set(0);

  // the kora as a curve: s 0 at Darchen, clockwise seen from above (bearing decreasing from π/2 through π... i.e. south → west → north → east)
  const KP = [];
  for (let i = 0; i <= 720; i++) { const th = Math.PI / 2 + i / 720 * TAU, K = koraAt(th), x = Math.cos(th) * K.r, z = Math.sin(th) * K.r; KP.push([x, kailashH(x, z), z]); }
  const KL = [0]; for (let i = 1; i < KP.length; i++) KL.push(KL[i - 1] + Math.hypot(KP[i][0] - KP[i - 1][0], KP[i][1] - KP[i - 1][1], KP[i][2] - KP[i - 1][2]));
  const kora = (s) => {
    const len = KL[KL.length - 1], d = ((s % 1) + 1) % 1 * len; let i = 1; while (i < KL.length - 1 && KL[i] < d) i++;
    const k = (d - KL[i - 1]) / (KL[i] - KL[i - 1] || 1), a = KP[i - 1], b = KP[i], hd = Math.hypot(b[0] - a[0], b[2] - a[2]) || 1;
    return { x: lerp(a[0], b[0], k), y: lerp(a[1], b[1], k), z: lerp(a[2], b[2], k), dx: (b[0] - a[0]) / hd, dz: (b[2] - a[2]) / hd };
  };
  kora.len = KL[KL.length - 1];
  // ribbon(s0, s1, o): a glowing band along the kora (o.w wide, o.col, o.lift above the ground); .set(on 0..1, a)
  const ribbon = (s0, s1, ro = {}) => {
    const n = Math.max(8, Math.round(Math.abs(s1 - s0) * 600)), w = ro.w ?? .9, P = [], N = [];
    for (let i = 0; i <= n; i++) { const q = kora(lerp(s0, s1, i / n)); P.push(q); }
    const pos = [], uv = [];
    P.forEach((q, i) => { const nx = -q.dz, nz = q.dx; for (const sd of [-1, 1]) { const x = q.x + nx * w / 2 * sd, z = q.z + nz * w / 2 * sd; pos.push(x, kailashH(x, z) + (ro.lift ?? .25), z); uv.push(i / n, sd > 0 ? 1 : 0); } });
    const idx = []; for (let i = 0; i < n; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
    const tx = tex3('kribbon', 4, 64, (gc) => { const gr = gc.createLinearGradient(0, 0, 0, 64); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); gc.fillStyle = gr; gc.fillRect(0, 0, 4, 64); });
    const m = mesh3(scene, g, new THREE.MeshBasicMaterial({ map: tx, color: ro.col || '#FFC860', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, side: THREE.DoubleSide }), [0, 0, 0], { cast: false, receive: false });
    m.set = (on = 1, a = 1) => { m.visible = on > .001 && a > .001; g.setDrawRange(0, Math.floor(clamp(on) * n) * 6); m.material.opacity = a; };
    m.set(0); return m;
  };
  // river(points [[x, z], ...], o): a glowing river laid on the ground; .set(t, on)
  const river = (pts, ro = {}) => {
    const P = through(pts.map(([x, z]) => [x, z]), 10).map(([x, z]) => V3(x, Math.max(kailashH(x, z), KAI.lake) + (ro.lift ?? .6), z));
    const curve = new THREE.CatmullRomCurve3(P), n = P.length * 2, geo = new THREE.TubeGeometry(curve, n, ro.r ?? 1.2, 6, false);
    const tx = waterTex3().rep(P.length / 6, 1);
    const m = mesh3(scene, geo, new THREE.MeshBasicMaterial({ map: tx, color: ro.col || '#5EC8FF', transparent: true, opacity: .95, depthWrite: false, fog: false }), [0, 0, 0], { cast: false, receive: false });
    const halo = mesh3(scene, new THREE.TubeGeometry(curve, n, (ro.r ?? 1.2) * 2.6, 6, false), new THREE.MeshBasicMaterial({ color: ro.glow || '#2A9AF0', transparent: true, opacity: .3, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }), [0, 0, 0], { cast: false, receive: false });
    // laid over the ground (it is a map mark): never cut by the ground's bumps
    for (const x of [halo, m]) { x.material.depthTest = false; x.renderOrder = 2; } m.renderOrder = 3;
    m.set = (t, on = 1) => { m.visible = halo.visible = on > .001; tx.offset.x = -t * (ro.speed ?? 1.2); geo.setDrawRange(0, Math.floor(clamp(on) * n) * 6 * 6); halo.geometry.setDrawRange(0, Math.floor(clamp(on) * n) * 6 * 6); };
    m.curve = curve; m.set(0, 0); return m;
  };
  // flags(s, o): prayer flags strung across the kora at s, between poles either side; .set(t)
  const flags = (s, fo = {}) => {
    const q = kora(s), G = new THREE.Group(); scene.add(G);
    const cols = ['#2F6FD0', '#F4F2EA', '#D8302A', '#2E9A4A', '#F2C21A'], strings = [];
    const nx = -q.dz, nz = q.dx, w = fo.w ?? 1.6, h = fo.h ?? .5, sz = fo.size ?? .07;
    for (let k = 0; k < (fo.n ?? 5); k++) {
      const off = (k - 2) * .18, ang = (k - 2) * .5;
      const a = V3(q.x + nx * w + q.dx * off, 0, q.z + nz * w + q.dz * off), b = V3(q.x - nx * w - q.dx * off * .5, 0, q.z - nz * w - q.dz * off * .5);
      a.y = kailashH(a.x, a.z) + h * (1 + .3 * Math.sin(ang)); b.y = kailashH(b.x, b.z) + h * .3;
      const N = Math.round(a.distanceTo(b) / (sz * 1.5)), F = [];
      for (let i = 1; i < N; i++) {
        const k2 = i / N, p = a.clone().lerp(b, k2); p.y -= Math.sin(k2 * Math.PI) * .12;
        const f = mesh3(G, new THREE.PlaneGeometry(sz, sz * 1.1), new THREE.MeshStandardMaterial({ color: cols[i % 5], side: THREE.DoubleSide, roughness: .9 }), [p.x, p.y - sz * .55, p.z], { cast: false });
        f.lookAt(p.x + nx, p.y - sz * .55, p.z + nz); f.userData.ph = i * .7 + k; F.push(f);
      }
      strings.push(F);
    }
    G.set = (t) => strings.forEach(F => F.forEach(f => { f.rotation.y += 0; f.rotation.x = .35 * Math.sin(t * 6 + f.userData.ph); }));
    return G;
  };
  return { scene, ground, mat, lake, sun, hemi, mood, set, kora, ribbon, river, flags, h: kailashH, clouds, plume, moon, stars, sunDisc };
}
