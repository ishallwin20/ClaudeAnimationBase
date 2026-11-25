// onemoon_aru.js: Arunachala for "One moon" (ad 114), copied from ad 110's deepam_sets.js (SET renamed ARU, its pillar3 arPillar3 so cine3d_india.js keeps its own).
//   Arunachala from real ground (src/data/aruna_dem.js: SRTM heights round the hill at ~13 m; arunafar_dem.js: the
//   plain for ~45 km around at ~175 m), coloured and lit by one terrain shader that can also glow from inside (molten
//   cracks, uCrack; the whole hill red-hot, uHeat) and rise out of the plain (uRise), for the pillar cooling into the
//   hill. A sky dome shader (dusk / blue hour / night / dawn / the cosmic void, blended), the full moon and Krittika (the
//   Pleiades). Tiruvannamalai at night: the Arunachaleswarar temple (outer, middle and inner walls, eleven gopurams with
//   tier lights, the vimana, the flagstaff), the town's lights, the girivalam road round the hill packed with lamps,
//   villages across the plain. On the summit: the copper cauldron and the Maha Deepam (flame sprites, a light that
//   reaches the rocks, smoke, sparks, a beacon seen from 35 km). The legend: the pillar of fire with no top or bottom,
//   Brahma's gold light and Vishnu's blue one, the boar going down through the rock, the swan going up through clouds.
// Units are metres; y up (the plain at ~0, the summit ~604); north = -z, east = +x; the origin is the summit.
const AR = { lon: 79.05746, lat: 12.24126, base: 190 };
AR.kx = 111320 * Math.cos(AR.lat * Math.PI / 180); AR.kz = 110600;
AR.xz = (lon, lat) => [(lon - AR.lon) * AR.kx, -(lat - AR.lat) * AR.kz];
const DN = dem3('aruna'), DF = dem3('arunafar');
const nearIn = (lon, lat) => lon > DN.lon0 + .002 && lon < DN.lon1 - .002 && lat > DN.lat0 + .002 && lat < DN.lat1 - .002;
// fine relief on top of the 13 m grid: rocks and gullies on the hill, almost nothing on the plain
const detail3 = (x, z, y) => { const k = clamp((y - 25) / 120); return (kFbm(x / 38, z / 38, 4) - .5) * (1.2 + 9 * k) + (kFbm(x / 9 + 40, z / 9, 3) - .5) * 2.4 * k; };
// the summit is levelled a little round the cauldron
const TOP_Y = DN.at(AR.lon, AR.lat) - AR.base + 1;
const shape3 = (x, z, e) => { const y = e + detail3(x, z, e), r = Math.hypot(x, z); return r > 40 ? y : lerp(TOP_Y, y, ease(clamp((r - 12) / 28))); };
function arH(x, z) {
  const lon = AR.lon + x / AR.kx, lat = AR.lat - z / AR.kz;
  const e = (nearIn(lon, lat) ? DN.at(lon, lat) : DF.at(lon, lat)) - AR.base;
  return shape3(x, z, e);
}
const SUMMIT = V3(0, arH(0, 0), 0);
const TEMPLE = (() => { const [x, z] = AR.xz(79.0677, 12.2319); return V3(x, arH(x, z), z); })();
// the hill's middle (for orbits): a little south-east of the summit
const HILLC = V3(150, 0, 250);

// ---------- the terrain ----------
const AR_GLSL = `
uniform float uHeat, uCrack, uRise, uTime, uWet;
varying vec3 vW; varying vec3 vWN; varying float vHill; varying float vRock;
float ah(vec3 p){ p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float an(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(mix(ah(i), ah(i + vec3(1,0,0)), f.x), mix(ah(i + vec3(0,1,0)), ah(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(ah(i + vec3(0,0,1)), ah(i + vec3(1,0,1)), f.x), mix(ah(i + vec3(0,1,1)), ah(i + vec3(1,1,1)), f.x), f.y), f.z) * 2. - 1.; }
float af(vec3 p){ float s = 0., a = .5; for (int i = 0; i < 5; i++) { s += a * an(p); p = p * 2.07 + 13.1; a *= .5; } return s; }
float ar(vec3 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++) { s += a * (1. - abs(an(p))); p = p * 2.13 + 7.7; a *= .5; } return s; }
`;
function arTerrainMat3() {
  const m = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: .95, metalness: 0 });
  const U = { uHeat: { value: 0 }, uCrack: { value: 0 }, uRise: { value: 1 }, uTime: { value: 0 }, uWet: { value: 0 } };
  m.userData.U = U;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uRise; varying vec3 vW; varying vec3 vWN; varying float vHill; varying float vRock;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        float near0 = 1. - smoothstep(3200., 5200., length(transformed.xz - vec2(150., 250.)));
        vRock = smoothstep(30., 110., transformed.y - (near0 < .5 ? 80. : 0.));
        vHill = smoothstep(30., 110., transformed.y) * near0;
        float yf = min(transformed.y, 30.) - 4.;
        transformed.y = mix(transformed.y, mix(yf, transformed.y, uRise), near0);`)
      .replace('#include <project_vertex>', '#include <project_vertex>\nvW = (modelMatrix * vec4(transformed, 1.)).xyz; vWN = normalize(mat3(modelMatrix) * objectNormal);');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + AR_GLSL)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      vec3 heatCol = vec3(0.);
      {
        vec3 P = vW; vec3 wn = normalize(vWN); float up = wn.y, hill = vHill, rockK = vRock;
        float n1 = af(P * .0025), n2 = af(P * .012 + 7.), n3 = af(P * .06 + 3.), n4 = af(P * .3 + 11.);
        // the plain: paddy and fields in patches, villages' groves darker, red-brown earth
        vec2 cell = floor(P.xz / vec2(90., 70.) + vec2(n1 * 3.));
        float fld = ah(vec3(cell, 3.));
        vec3 plain = mix(vec3(.16, .2, .09), vec3(.24, .25, .11), fld);
        plain = mix(plain, vec3(.30, .2, .13), smoothstep(.55, .9, ah(vec3(cell, 9.))) * .7);
        plain = mix(plain, vec3(.08, .12, .06), smoothstep(.2, .6, n2) * .55);
        plain *= .85 + .3 * n4;
        // the hill: dark granite and boulders, scrub and grass in the gullies, bare rock on the steep faces and the top
        float steep = 1. - smoothstep(.55, .85, up + n3 * .15);
        vec3 rock = mix(vec3(.17, .14, .12), vec3(.36, .30, .25), clamp(.5 + n3 * .9 + n4 * .4, 0., 1.));
        rock = mix(rock, vec3(.42, .27, .19), smoothstep(.1, .5, n2) * .4);
        vec3 scrub = mix(vec3(.12, .15, .07), vec3(.22, .22, .11), clamp(.5 + n3, 0., 1.));
        float veg = (1. - steep) * smoothstep(-.3, .3, n2 + .25) * (1. - smoothstep(420., 590., P.y + n1 * 80.));
        vec3 hc = mix(rock, scrub, clamp(veg, 0., 1.) * .8);
        float boulder = smoothstep(.62, .8, ar(P * .05 + 5.)) * rockK;
        hc = mix(hc, vec3(.4, .35, .3), boulder * .5);
        diffuseColor.rgb = mix(plain, hc, rockK);
        roughnessFactor = mix(.95, .8, boulder);
        // inner fire: cracks of molten light, and the whole hill red-hot (the pillar cooling into it)
        float cr = ar(P * .011 + vec3(0., uTime * .02, 0.)), cr2 = ar(P * .045 + 19.);
        float crack = smoothstep(.885, .975, cr) * .9 + smoothstep(.91, .985, cr2) * .5;
        float pulse = .8 + .2 * sin(uTime * 3. + n1 * 20.);
        vec3 fire = vec3(1., .32, .05);
        heatCol = fire * uCrack * (crack * 11. * pulse + .015 + .05 * smoothstep(.7, .9, cr)) * hill;
        diffuseColor.rgb *= 1. - .5 * uCrack * hill;
        float hot = uHeat * hill;
        heatCol += mix(vec3(.7, .09, .015), vec3(1.2, .5, .1), crack) * hot * (.35 + 3. * crack) * pulse;
        diffuseColor.rgb *= 1. - .65 * hot;
        vec3 wb = normalize(wn - (.25 * rockK + .05) * vec3(n4 * .5, 0., an(P * .3 + 4.) * .5));
        normal = normalize((viewMatrix * vec4(wb, 0.)).xyz);
      }`)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += heatCol;');
  };
  return m;
}
// a terrain mesh from a DEM: every `step`th sample; y from the DEM (+ the fine relief); o.drop(x, z) lowers it
function demGeo3(D, step, o = {}) {
  const w = Math.floor((D.w - 1) / step) + 1, h = Math.floor((D.h - 1) / step) + 1, pos = new Float32Array(w * h * 3);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const lon = D.lon0 + (i * step + .5) * D.res, lat = D.lat1 - (j * step + .5) * D.res, [x, z] = AR.xz(lon, lat);
    const e = D.e[Math.min(D.h - 1, j * step) * D.w + Math.min(D.w - 1, i * step)] - AR.base;
    const k = (j * w + i) * 3; pos[k] = x; pos[k + 1] = shape3(x, z, e) - (o.drop ? o.drop(x, z, lon, lat) : 0); pos[k + 2] = z;
  }
  const idx = new Uint32Array((w - 1) * (h - 1) * 6); let n = 0;
  for (let j = 0; j < h - 1; j++) for (let i = 0; i < w - 1; i++) { const a = j * w + i, b = a + 1, c = a + w, d = c + 1; idx[n++] = a; idx[n++] = c; idx[n++] = b; idx[n++] = b; idx[n++] = c; idx[n++] = d; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.computeVertexNormals(); return g;
}

// ---------- the sky ----------
const SKY_PAL = {
  // zenith, mid, horizon, the sun's glow, stars, nebula
  dusk:  { zen: '#0E1A44', mid: '#2C3A78', hor: '#E8946A', glow: '#FF9A50', stars: .15, neb: 0 },
  blue:  { zen: '#060B26', mid: '#16245A', hor: '#5A4E86', glow: '#D86A48', stars: .55, neb: 0 },
  night: { zen: '#02040E', mid: '#081030', hor: '#1C2448', glow: '#000000', stars: 1, neb: 0 },
  dawn:  { zen: '#1A1E4A', mid: '#7A4A6A', hor: '#FF8A50', glow: '#FFB070', stars: .05, neb: 0 },
  void:  { zen: '#020106', mid: '#05030C', hor: '#0A0610', glow: '#000000', stars: 1, neb: 1 },
};
const SKY_VS = 'varying vec3 vD; void main() { vD = position; gl_Position = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.); gl_Position.z = gl_Position.w * .99999; }';
const SKY_FS = AR_GLSL.replace('uniform float uHeat, uCrack, uRise, uTime, uWet;\nvarying vec3 vW; varying vec3 vWN; varying float vHill;', '') + `
uniform vec3 uZen, uMid, uHor, uGlow, uSun, uNebA, uNebB; uniform float uStars, uNeb, uGlowK, uTw, uBright;
varying vec3 vD;
void main() {
  vec3 d = normalize(vD); float h = d.y;
  vec3 c = mix(uHor, uMid, smoothstep(0., .22, h)); c = mix(c, uZen, smoothstep(.18, .9, h));
  if (h < 0.) c = uHor;
  float s = max(dot(d, normalize(uSun)), 0.);
  c += uGlow * uGlowK * (pow(s, 6.) * .9 + pow(s, 40.) * .8) * (1. - smoothstep(-.05, .45, h)) ;
  // stars: cells on the sphere, a few lit, twinkling
  vec3 q = d * 420.; vec3 ci = floor(q); float r = ah(ci);
  float st = 0.;
  if (r > .985) { vec3 f = fract(q) - .5 - (vec3(ah(ci + 1.), ah(ci + 2.), ah(ci + 3.)) - .5) * .6; float b = (r - .985) / .015; st = b * b * smoothstep(.16, 0., length(f)) * (.7 + .3 * sin(uTw * (3. + r * 9.) + r * 80.)); }
  vec3 q2 = d * 900.; vec3 c2 = floor(q2); float r2 = ah(c2 + 7.);
  if (r2 > .993) { vec3 f = fract(q2) - .5; st += .35 * smoothstep(.2, 0., length(f)); }
  c += vec3(.95, .95, 1.) * st * uStars * smoothstep(-.02, .12, h + uNeb);
  // the void's nebula and a faint band of stars
  if (uNeb > 0.) {
    float n = af(d * 2.2 + 3.), n2 = af(d * 5. + 11.);
    float band = exp(-pow(dot(d, normalize(vec3(.3, .2, 1.))) * 3., 2.));
    c += (uNebA * smoothstep(-.1, .6, n) + uNebB * smoothstep(.1, .7, n2) * .7) * uNeb * (.35 + band);
    c += vec3(.8, .8, 1.) * uNeb * band * .04 * (.5 + n2);
  }
  gl_FragColor = vec4(c * uBright, 1.);
}`;
function sky3d(scene) {
  const U = { uZen: { value: new THREE.Color() }, uMid: { value: new THREE.Color() }, uHor: { value: new THREE.Color() }, uGlow: { value: new THREE.Color() },
    uSun: { value: V3(-1, .02, .2) }, uStars: { value: 0 }, uNeb: { value: 0 }, uGlowK: { value: 1 }, uTw: { value: 0 }, uBright: { value: 1 },
    uNebA: { value: new THREE.Color('#3A1450') }, uNebB: { value: new THREE.Color('#0E2E5A') } };
  const m = new THREE.ShaderMaterial({ vertexShader: SKY_VS, fragmentShader: SKY_FS, uniforms: U, side: THREE.BackSide, depthWrite: false, fog: false });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1000, 64, 32), m); dome.renderOrder = -2; dome.frustumCulled = false; scene.add(dome);
  // the dome is at infinity: its vertex shader drops the camera's position
  const C = (h) => new THREE.Color(h);
  // set(a, b, k, o): blend palette a → b by k
  dome.set = (a, b = a, k = 0, o = {}) => {
    const A = SKY_PAL[a], B = SKY_PAL[b];
    U.uZen.value.copy(C(A.zen)).lerp(C(B.zen), k); U.uMid.value.copy(C(A.mid)).lerp(C(B.mid), k); U.uHor.value.copy(C(A.hor)).lerp(C(B.hor), k);
    U.uGlow.value.copy(C(A.glow)).lerp(C(B.glow), k); U.uStars.value = lerp(A.stars, B.stars, k) * (o.stars ?? 1); U.uNeb.value = lerp(A.neb, B.neb, k);
    U.uGlowK.value = o.glow ?? 1; U.uBright.value = o.bright ?? 1; if (o.sun) U.uSun.value.set(...o.sun); U.uTw.value = o.t ?? 0;
    return U.uHor.value;
  };
  return dome;
}
// the full moon: a sprite with its seas, far out on a direction; Krittika (the Pleiades) beside it
const moonFullTex3 = () => tex3('moonFull', 256, 256, (g) => {
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, 'rgba(255,244,220,.5)'); gr.addColorStop(.42, 'rgba(255,240,210,.12)'); gr.addColorStop(1, 'rgba(255,240,210,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  g.fillStyle = '#FFF6E4'; g.beginPath(); g.arc(128, 128, 44, 0, TAU); g.fill();
  g.save(); g.beginPath(); g.arc(128, 128, 44, 0, TAU); g.clip(); g.filter = 'blur(3px)';
  for (const [x, y, r, a] of [[112, 108, 16, .22], [140, 112, 12, .2], [130, 132, 14, .18], [104, 136, 9, .16], [150, 140, 8, .14], [120, 150, 7, .12]]) { g.fillStyle = `rgba(120,118,130,${a})`; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
  g.restore();
});
function moon3d(scene) {
  const G = new THREE.Group(); scene.add(G);
  const mo = new THREE.Sprite(new THREE.SpriteMaterial({ map: moonFullTex3(), transparent: true, depthWrite: false, fog: false })); G.add(mo);
  // the Pleiades: six bright and a faint seventh, in their little dipper
  const P = [[0, 0, 1], [.9, .25, .8], [1.5, -.35, .9], [.55, -.7, .75], [1.9, .45, .6], [2.4, -.1, .55], [1.2, .9, .4]];
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(P.flatMap(() => [0, 0, 0]), 3));
  const pl = P.map(([x, y, b]) => { const s = glow3(G, [0, 0, 0], 1, '#CFE0FF', b); s.material.depthTest = true; s.userData = { x, y, b }; return s; });
  // place(az (radians from north, clockwise), alt (radians), o): put both on the sky as seen from the camera
  G.place = (cam, az, alt, o = {}) => {
    const R = 9000, d = V3(Math.sin(az) * Math.cos(alt), Math.sin(alt), -Math.cos(az) * Math.cos(alt));
    G.position.copy(cam.position);
    mo.position.copy(d).multiplyScalar(R); mo.scale.setScalar(R * (o.size ?? .05)); mo.material.opacity = o.moon ?? 1; mo.visible = (o.moon ?? 1) > .01;
    // the cluster: a few degrees up-left of the moon
    const right = V3().crossVectors(d, V3(0, 1, 0)).normalize(), upv = V3().crossVectors(right, d).normalize();
    const c0 = d.clone().multiplyScalar(R).addScaledVector(right, -R * .085).addScaledVector(upv, R * .055), sp = R * (o.spread ?? .012);
    pl.forEach(s => { const u = s.userData; s.position.copy(c0).addScaledVector(right, u.x * sp).addScaledVector(upv, u.y * sp); s.scale.setScalar(R * .006 * (o.starK ?? 1) * (.7 + .5 * u.b)); s.material.opacity = (o.stars ?? 1) * u.b; s.visible = (o.stars ?? 1) > .01; });
    G.visible = true; return { moon: mo.position.clone().add(G.position), krittika: c0.clone().add(G.position) };
  };
  G.visible = false; return G;
}

// ---------- lights on the ground (town, girivalam, villages) ----------
const PTS_VS = `attribute float aSize; attribute vec3 aCol; attribute float aPh; uniform float uScale, uTime, uK, uMin; varying vec3 vC; varying float vA; varying float vK;
void main() { vK = uK; vec4 mv = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mv;
  float px = min(aSize * uScale / -mv.z, 26.); vA = clamp(px / uMin, 0., 1.); gl_PointSize = max(px, uMin);
  float tw = .75 + .25 * sin(uTime * (2. + fract(aPh * 7.) * 5.) + aPh * 30.);
  vC = aCol * mix(1., tw, step(.5, fract(aPh * 3.1))); }`;
const PTS_FS = `varying vec3 vC; varying float vA; varying float vK; void main() { vec2 p = gl_PointCoord - .5; float r = length(p); float a = smoothstep(.5, 0., r); a = a * a; gl_FragColor = vec4(vC * a * (.4 + .6 * vA) * vK, 1.); }`;
function lights3(scene, pts, o = {}) {
  const n = pts.length, P = new Float32Array(n * 3), S = new Float32Array(n), C = new Float32Array(n * 3), Ph = new Float32Array(n);
  pts.forEach((p, i) => { P[i * 3] = p[0]; P[i * 3 + 1] = p[1]; P[i * 3 + 2] = p[2]; S[i] = p[3]; const c = new THREE.Color(p[4]); C[i * 3] = c.r * (p[5] ?? 1); C[i * 3 + 1] = c.g * (p[5] ?? 1); C[i * 3 + 2] = c.b * (p[5] ?? 1); Ph[i] = (i * .61803) % 1; });
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('aSize', new THREE.BufferAttribute(S, 1)); g.setAttribute('aCol', new THREE.BufferAttribute(C, 3)); g.setAttribute('aPh', new THREE.BufferAttribute(Ph, 1));
  const U = { uScale: { value: H / 2 / Math.tan(20 * Math.PI / 180) }, uTime: { value: 0 }, uK: { value: 1 }, uMin: { value: o.min ?? 1.6 } };
  const m = new THREE.ShaderMaterial({ vertexShader: PTS_VS, fragmentShader: PTS_FS, uniforms: U, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const pts3 = new THREE.Points(g, m); pts3.frustumCulled = false; scene.add(pts3);
  pts3.set = (t, k = 1) => { pts3.visible = k > .001; U.uTime.value = t; U.uK.value = k; U.uScale.value = H / 2 / Math.tan(CAM3.fov / 2 * Math.PI / 180); m.uniforms.uMin.value = (o.min ?? 1.6); };
  pts3.U = U; return pts3;
}
const LAMP = ['#FFB45A', '#FFA040', '#FFC478', '#FF9A3A'], STREET = ['#FFB060', '#FFC890', '#F4E8D0', '#FFD8A0'], FEST = ['#FF5A5A', '#5AC8FF', '#7AFF8A', '#FFE05A', '#FF7AE0'];
// the girivalam road: a loop round the hill where the ground first drops below ~22 m going out from the middle
function giriPath3() {
  const P = [];
  for (let i = 0; i < 360; i++) {
    const a = i / 360 * TAU; let r = 600;
    while (r < 4200 && arH(HILLC.x + Math.cos(a) * r, HILLC.z + Math.sin(a) * r) > 22) r += 20;
    P.push([Math.cos(a), Math.sin(a), r + 160]);
  }
  // smooth the radii
  const R = P.map((p, i) => { let s = 0; for (let k = -12; k <= 12; k++) s += P[(i + k + 360) % 360][2]; return s / 25; });
  return P.map((p, i) => { const x = HILLC.x + p[0] * R[i], z = HILLC.z + p[1] * R[i]; return [x, arH(x, z), z]; });
}

// ---------- the temple ----------
const plasterTex3 = (bump) => tex3('plaster' + (bump ? 'B' : 'C'), 256, 256, (g, w, h) => {
  g.fillStyle = bump ? '#808080' : '#D8CCB4'; g.fillRect(0, 0, w, h); const r = lcg(bump ? 4 : 8);
  for (let i = 0; i < 2600; i++) { g.fillStyle = bump ? (r() < .5 ? 'rgba(0,0,0,.25)' : 'rgba(255,255,255,.25)') : (r() < .5 ? `rgba(120,100,80,${r() * .2})` : `rgba(255,250,240,${r() * .2})`); g.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 3); }
  // bands of figures and niches: little vertical bays
  for (let x = 0; x < w; x += 16) { g.fillStyle = bump ? 'rgba(0,0,0,.45)' : 'rgba(70,55,40,.35)'; g.fillRect(x + 3, 60, 10, 120); g.fillStyle = bump ? 'rgba(255,255,255,.4)' : 'rgba(255,245,230,.25)'; g.fillRect(x + 5, 70, 6, 50); }
  g.fillStyle = bump ? 'rgba(255,255,255,.5)' : 'rgba(255,248,236,.3)'; g.fillRect(0, 196, w, 14); g.fillStyle = bump ? 'rgba(0,0,0,.5)' : 'rgba(60,45,30,.4)'; g.fillRect(0, 210, w, 8);
}, bump ? { data: true } : {});
function gopuram3(parent, o) {
  // o: w (along the wall), d (through the gate), h (total), tiers, pos [x, z], rot (y), base (height of the stone base)
  const G = new THREE.Group(); G.position.set(o.pos[0], o.y ?? 0, o.pos[1]); G.rotation.y = o.rot || 0; parent.add(G);
  const stone = new THREE.MeshStandardMaterial({ color: '#B8A890', roughness: .9, map: plasterTex3().rep(2, 1), bumpMap: plasterTex3(true).rep(2, 1), bumpScale: 2 });
  const plaster = new THREE.MeshStandardMaterial({ color: '#E8DCC6', roughness: .85, map: plasterTex3().rep(3, 1), bumpMap: plasterTex3(true).rep(3, 1), bumpScale: 3 });
  const dark = new THREE.MeshStandardMaterial({ color: '#100C0A', roughness: 1 });
  const hb = o.base ?? o.h * .2, w = o.w, d = o.d;
  // the stone base in two storeys, with the gateway through it
  block3(G, w, hb * .5, d, stone, [0, 0, 0]); block3(G, w * .97, hb * .5, d * .97, stone, [0, hb * .5, 0]);
  block3(G, w * 1.03, hb * .05, d * 1.03, stone, [0, hb * .5 - hb * .025, 0]);
  for (const s of [-1, 1]) block3(G, w * .2, hb * .8, .6, dark, [0, 0, s * d / 2], { cast: false });
  // the tiers
  const n = o.tiers, top = o.h * .86, th = (top - hb) / n, edges = [];
  for (let i = 0; i < n; i++) {
    const k = i / n, k1 = (i + 1) / n, tw = w * lerp(.94, .44, k), td = d * lerp(.9, .5, k), y = hb + i * th;
    const tr = mesh3(G, new THREE.BoxGeometry(1, 1, 1), plaster, [0, y + th * .45, 0], { scale: [tw, th * .9, td] });
    tr.geometry.translate(0, 0, 0);
    block3(G, tw * 1.05 + .6, th * .12, td * 1.05 + .6, plaster, [0, y + th * .88, 0]);      // the cornice
    // little pavilions along the front and back edges
    const np = Math.max(3, Math.round(tw / 3.2));
    for (const s of [-1, 1]) for (let p = 0; p < np; p++) {
      const x = (p / (np - 1) - .5) * tw * .92; block3(G, tw / np * .55, th * .45, .9, plaster, [x, y + th * .9, s * (td / 2 + .2)]);
    }
    edges.push({ y: y + th, w: tw * 1.05 + .6, d: td * 1.05 + .6 });
  }
  // the shala roof: a barrel vault along the width, with its gable ends, and the kalashas on the ridge
  const rw = w * lerp(.94, .44, 1) * .95, rd = d * .5 * .5, ry = top;
  const vault = mesh3(G, new THREE.CylinderGeometry(rd, rd, rw, 24, 1, false, 0, Math.PI), plaster, [0, ry, 0], { rot: [0, 0, Math.PI / 2] });
  vault.rotation.set(0, 0, Math.PI / 2); vault.rotateY(-Math.PI / 2);
  for (const s of [-1, 1]) mesh3(G, new THREE.CircleGeometry(rd * 1.25, 24, 0, Math.PI), plaster, [s * rw / 2, ry, 0], { rot: [0, s * Math.PI / 2, 0] });
  const gold = new THREE.MeshStandardMaterial({ color: '#B88A3A', metalness: .5, roughness: .5, emissive: '#3A2208', emissiveIntensity: .6 });
  const kal = lathe3([[0, 0], [.5, .1], [.8, .7], [.5, 1.3], [.25, 1.6], [.35, 1.9], [.08, 2.6], [0, 2.8]], 16), nk = o.kalashas || 11;
  for (let i = 0; i < nk; i++) mesh3(G, kal, gold, [(i / (nk - 1) - .5) * rw * .92, ry + rd * .95, 0], { scale: o.h / 60 });
  G.top = ry + rd; G.edges = edges; G.mats = { plaster, stone };
  // festival lights along every tier's front and back edges (world points)
  G.lightPts = [];
  G.updateMatrixWorld(true);
  for (const e of edges) for (const s of [-1, 1]) for (let x = -e.w / 2; x <= e.w / 2; x += 1.1) G.lightPts.push(G.localToWorld(V3(x, e.y + .1, s * e.d / 2)));
  for (let x = -rw / 2; x <= rw / 2; x += .9) G.lightPts.push(G.localToWorld(V3(x, ry + rd, 0)));
  return G;
}
function temple3(scene) {
  const T = new THREE.Group(); T.position.copy(TEMPLE); scene.add(T);
  const wallM = new THREE.MeshStandardMaterial({ color: '#A8987E', roughness: .95, map: plasterTex3().rep(20, 1), bumpMap: plasterTex3(true).rep(20, 1), bumpScale: 1 });
  const floorM = new THREE.MeshStandardMaterial({ color: '#6E6254', roughness: 1 });
  mesh3(T, new THREE.PlaneGeometry(300, 260), floorM, [0, .3, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const walls = (W2, D2, h, th = 2.5) => {
    block3(T, W2, h, th, wallM, [0, 0, -D2 / 2]); block3(T, W2, h, th, wallM, [0, 0, D2 / 2]);
    block3(T, th, h, D2, wallM, [-W2 / 2, 0, 0]); block3(T, th, h, D2, wallM, [W2 / 2, 0, 0]);
  };
  walls(240, 210, 9); walls(150, 130, 7); walls(78, 66, 6);
  const gops = [
    gopuram3(T, { w: 34, d: 24, h: 66, tiers: 11, pos: [120, 0], rot: Math.PI / 2, kalashas: 13 }),   // the Rajagopuram, east
    gopuram3(T, { w: 27, d: 20, h: 47, tiers: 9, pos: [0, 105], rot: 0 }),                             // south
    gopuram3(T, { w: 26, d: 19, h: 44, tiers: 9, pos: [-120, 0], rot: Math.PI / 2 }),                  // west
    gopuram3(T, { w: 28, d: 20, h: 52, tiers: 9, pos: [0, -105], rot: 0 }),                            // north
    gopuram3(T, { w: 24, d: 17, h: 40, tiers: 7, pos: [75, 0], rot: Math.PI / 2 }),                    // the middle east gate
    gopuram3(T, { w: 16, d: 12, h: 24, tiers: 5, pos: [0, 65], rot: 0 }),
    gopuram3(T, { w: 16, d: 12, h: 24, tiers: 5, pos: [0, -65], rot: 0 }),
    gopuram3(T, { w: 15, d: 11, h: 22, tiers: 5, pos: [-75, 0], rot: Math.PI / 2 }),
    gopuram3(T, { w: 14, d: 10, h: 20, tiers: 5, pos: [39, 0], rot: Math.PI / 2 }),                    // the inner east gate
  ];
  // the sanctum's vimana and its mandapas, the flagstaff before it
  const vim = gopuram3(T, { w: 12, d: 12, h: 21, tiers: 4, pos: [-15, 0], rot: Math.PI / 2, kalashas: 1 });
  for (const [x, z, w2, d2] of [[10, 0, 20, 18], [-15, 24, 26, 12], [50, 40, 40, 24], [-45, -35, 30, 26], [55, -50, 30, 20]]) block3(T, w2, 5, d2, wallM, [x, 0, z]);
  const gold = new THREE.MeshStandardMaterial({ color: '#B88A3A', metalness: .5, roughness: .5, emissive: '#2A1806', emissiveIntensity: .5 });
  mesh3(T, new THREE.CylinderGeometry(.35, .5, 18, 12), gold, [28, 9, 0]);
  // floodlights on the big gopurams
  const flood = [];
  for (const [g, k] of [[gops[0], 1], [gops[1], .7], [gops[2], .6], [gops[3], .7], [gops[4], .6]]) {
    const L = new THREE.SpotLight('#FFC890', 0, 260, .5, .6, 1.2), wp = g.localToWorld(V3(0, 0, 0)), out = g.localToWorld(V3(0, 0, 40)).sub(wp);
    L.position.copy(wp).add(out).setY(TEMPLE.y + 4); L.target.position.copy(wp).setY(TEMPLE.y + g.top * .55); L.userData.k = k; scene.add(L, L.target); flood.push(L);
  }
  // the lamp the temple raises at 6 PM (by the flagstaff)
  const lampAt = V3(TEMPLE.x + 28, TEMPLE.y + 4, TEMPLE.z + 4);
  const lamp = glow3(scene, lampAt.toArray(), 14, '#FFB050', 0), lampL = new THREE.PointLight('#FFA040', 0, 160, 1.6); lampL.position.copy(lampAt); scene.add(lampL);
  const pts = []; gops.concat([vim]).forEach(g => g.lightPts.forEach(p => pts.push([p.x, p.y, p.z, 1.1, LAMP[(pts.length * 7) % 4], 1.6])));
  const glights = lights3(scene, pts, { min: 1.3 });
  T.set = (t, o = {}) => {
    flood.forEach(L => L.intensity = (o.flood ?? 1) * 260 * L.userData.k);
    glights.set(t, o.lights ?? 1);
    const lk = o.lamp ?? 0; lamp.material.opacity = lk; lamp.scale.setScalar(14 + 10 * lk + 2 * Math.sin(t * 9)); lampL.intensity = lk * 4e4;
  };
  T.gops = gops; T.lampAt = lampAt; T.raja = gops[0];
  return T;
}

// ---------- the Maha Deepam ----------
const fireTex3 = (n) => tex3('dfire' + n, 128, 256, (g, w, h) => {
  const r = lcg(31 + n * 7);
  const tongue = (x, top, wd, bend) => { g.beginPath(); g.moveTo(x - wd, h - 4); g.bezierCurveTo(x - wd * 1.15, h * .55, x + bend - wd * .3, top + 50, x + bend, top); g.bezierCurveTo(x + bend + wd * .3, top + 60, x + wd * 1.1, h * .6, x + wd, h - 4); g.closePath(); };
  g.filter = 'blur(6px)';
  for (let i = 0; i < 5; i++) {
    const x = 64 + (r() - .5) * 50, top = 6 + r() * 100 + (i ? 20 : 0), wd = 14 + r() * 20, bend = (r() - .5) * 36;
    const gr = g.createLinearGradient(0, top, 0, h); gr.addColorStop(0, 'rgba(255,90,20,0)'); gr.addColorStop(.25, 'rgba(255,120,30,.7)'); gr.addColorStop(.65, 'rgba(255,180,80,.95)'); gr.addColorStop(1, 'rgba(255,230,170,1)');
    g.fillStyle = gr; tongue(x, top, wd, bend); g.fill();
  }
  g.filter = 'blur(7px)'; const gc = g.createLinearGradient(0, h * .5, 0, h); gc.addColorStop(0, 'rgba(255,245,220,0)'); gc.addColorStop(1, 'rgba(255,252,240,1)');
  g.fillStyle = gc; tongue(64, h * .5, 28, 0); g.fill();
});
const smokeTex3 = () => tex3('dsmoke', 128, 128, (g) => { const r = lcg(3); g.filter = 'blur(8px)'; for (let i = 0; i < 18; i++) { const x = 30 + r() * 68, y = 30 + r() * 68, rr = 14 + r() * 22, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(255,255,255,.4)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, 2 * rr, 2 * rr); } });
function deepam3(scene) {
  const G = new THREE.Group(); scene.add(G);
  const base = SUMMIT.clone(); G.position.copy(base);
  const copper = new THREE.MeshStandardMaterial({ color: '#8A4A28', metalness: .5, roughness: .5, envMapIntensity: .5, emissive: '#5A2210', emissiveIntensity: .5 });
  const sooty = new THREE.MeshStandardMaterial({ color: '#2A1A12', metalness: .2, roughness: .85 });
  // the cauldron: ~3 m tall, ~1.6 m across, on a ring of stones
  mesh3(G, lathe3([[0, 0], [.75, 0], [.85, .2], [.8, 2.2], [.92, 2.5], [.95, 2.9], [.85, 2.9], [.7, 2.6], [0, 2.6]], 40), copper, [0, .4, 0]);
  mesh3(G, new THREE.CylinderGeometry(.84, .84, .1, 32), sooty, [0, 3.2, 0]);
  const rr = lcg(5), rockM = new THREE.MeshStandardMaterial({ color: '#3A322C', roughness: 1, flatShading: false });
  for (let i = 0; i < 50; i++) { const a = rr() * TAU, r = 1.4 + Math.pow(rr(), .8) * 13; mesh3(G, new THREE.IcosahedronGeometry(.25 + rr() * .6, 1), rockM, [Math.cos(a) * r, arH(Math.cos(a) * r, Math.sin(a) * r) - TOP_Y + .45 - .25 * rr(), Math.sin(a) * r], { rot: [rr() * 3, rr() * 3, rr() * 3], scale: [1, .6 + rr() * .4, 1] }); }
  // the fire: layers of flame sprites over the rim
  const top = V3(0, 3.2, 0), F = [];
  for (let i = 0; i < 7; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: fireTex3(i % 4), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); s.center.set(.5, .05); s.position.copy(top); s.userData.ph = i * 1.7; G.add(s); F.push(s); }
  const halo = glow3(G, [0, 6, 0], 30, '#FF8A30', .6), halo2 = glow3(G, [0, 6, 0], 140, '#FF6A20', .25);
  const beacon = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex3(), color: '#FFB060', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, fog: false, sizeAttenuation: false }));
  beacon.position.set(0, 6, 0); beacon.renderOrder = 5; G.add(beacon);
  const light = new THREE.PointLight('#FF8A3A', 0, 240, 1.5); light.position.set(0, 9, 0); light.castShadow = true; light.shadow.mapSize.set(1024, 1024); light.shadow.bias = -.002; light.shadow.camera.near = 1; light.shadow.camera.far = 900; G.add(light);
  // smoke drifting west on the wind, sparks rising
  const SM = []; for (let i = 0; i < 16; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex3(), color: '#3A3030', transparent: true, depthWrite: false })); s.userData.ph = i / 16; G.add(s); SM.push(s); }
  const sparkPts = []; const rs = lcg(17); for (let i = 0; i < 260; i++) sparkPts.push([rs(), rs(), rs()]);
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(260 * 3), 3));
  const sparks = new THREE.Points(sg, new THREE.PointsMaterial({ color: '#FFB050', size: 3, sizeAttenuation: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); sparks.frustumCulled = false; G.add(sparks);
  G.set = (t, on = 1, o = {}) => {
    on = clamp(on); G.visible = on > .001;
    const k = on * (1 + (o.flare ?? 0) * .8), fk = o.size ?? 1;
    F.forEach((s, i) => { const ph = s.userData.ph, f = 1 + .18 * vnoise(t * 5 + ph, 3) + .08 * Math.sin(t * 17 + ph * 4);
      s.scale.set((3.2 + .9 * Math.sin(ph)) * k * fk, (8 + 3 * vnoise(t * 3 + ph, 1)) * k * f * fk, 1); s.material.rotation = .1 * vnoise(t * 4 + ph, 2) + (i - 3) * .04; s.material.opacity = o.flameA ?? .85; });
    halo.scale.setScalar(30 * k * fk * (.95 + .05 * Math.sin(t * 13))); halo.material.opacity = .55 * on * (o.halo ?? 1);
    halo2.scale.setScalar(110 * k * fk); halo2.material.opacity = .16 * on * (o.haze ?? 1);
    beacon.scale.setScalar((o.beacon ?? .022) * on * (.95 + .05 * Math.sin(t * 11))); beacon.material.opacity = (o.beaconA ?? .9) * on;
    light.intensity = (o.power ?? 1.4e4) * on * (.88 + .12 * vnoise(t * 8, 5));
    SM.forEach((s, i) => { const a = ((s.userData.ph + t * .08) % 1); s.position.set(-a * 60 + 4 * Math.sin(i), 12 + a * 70, -a * 14); s.scale.setScalar(8 + a * 40); s.material.opacity = .4 * on * Math.sin(a * Math.PI) * (o.smoke ?? 1); s.material.rotation = i + t * .1; });
    const P = sg.attributes.position;
    sparkPts.forEach(([a, b, c], i) => { const u = (a + t * (.25 + .3 * b)) % 1; P.setXYZ(i, (b - .5) * 6 - u * 18 * c, 4 + u * 50, (c - .5) * 6 - u * 4); });
    P.needsUpdate = true; sparks.material.opacity = on * .9; sparks.visible = on > .3;
  };
  G.top = base.clone().add(V3(0, 6, 0));
  return G;
}

// ---------- the pillar of fire ----------
const PIL_FS = AR_GLSL.replace('uniform float uHeat, uCrack, uRise, uTime, uWet;\nvarying vec3 vW; varying vec3 vWN; varying float vHill;', '') + `
uniform float uT, uK, uWhite, uCore; varying vec3 vP; varying vec3 vN; varying vec3 vV;
void main() {
  float a = atan(vP.z, vP.x), y = vP.y;
  vec3 q = vec3(cos(a) * 3., y * .004 - uT * 1.4, sin(a) * 3.);
  float n = af(q + vec3(0., 0., uT * .2)), n2 = af(q * 2.3 + 5. - vec3(0., uT * 1.2, 0.));
  float fl = clamp(.55 + n * .9 + n2 * .5, 0., 1.);
  float rim = 1. - abs(dot(normalize(vN), normalize(vV)));
  vec3 c = mix(vec3(1., .22, .03), vec3(1., .62, .18), fl);
  c = mix(c, vec3(1., .95, .8), smoothstep(.7, 1., fl) * uCore);
  c = mix(c, vec3(1.), uWhite);
  float al = (.35 + .65 * fl) * (1. - rim * .6);
  gl_FragColor = vec4(c * uK * al * (1.6 + 2.5 * uWhite), 1.);
}`;
const PIL_VS = 'varying vec3 vP; varying vec3 vN; varying vec3 vV; void main() { vP = position; vN = normalMatrix * normal; vec4 mv = modelViewMatrix * vec4(position, 1.); vV = -mv.xyz; gl_Position = projectionMatrix * mv; }';
const GLOWP_FS = 'uniform vec3 uC; uniform float uK; varying vec3 vP; varying vec3 vN; varying vec3 vV; void main() { float f = abs(dot(normalize(vN), normalize(vV))); gl_FragColor = vec4(uC * uK * pow(f, 2.5), 1.); }';
function arPillar3(scene) {
  const G = new THREE.Group(); scene.add(G);
  const U = { uT: { value: 0 }, uK: { value: 1 }, uWhite: { value: 0 }, uCore: { value: 1 } };
  const mk = (r, fs, u) => mesh3(G, new THREE.CylinderGeometry(r, r, 200000, 64, 1, true), new THREE.ShaderMaterial({ vertexShader: PIL_VS, fragmentShader: fs, uniforms: u, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: true }), [0, 0, 0], { cast: false, receive: false });
  const core = mk(1, PIL_FS, U);
  const GU = { uC: { value: new THREE.Color('#FF6A1A') }, uK: { value: .5 } };
  const glow = mk(1, GLOWP_FS, GU);
  [core, glow].forEach(m => m.frustumCulled = false);
  const lights = [0, 1, 2].map(() => { const L = new THREE.PointLight('#FF8A3A', 0, 6000, 1.2); G.add(L); return L; });
  // embers: a column of sparks round it, scrolling up
  const n = 1800, rs = lcg(23), E = []; for (let i = 0; i < n; i++) E.push([rs() * TAU, 1.05 + rs() * .9, rs(), rs()]);
  const eg = new THREE.BufferGeometry(); eg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
  const emb = new THREE.Points(eg, new THREE.PointsMaterial({ color: '#FFA040', size: 3.5, sizeAttenuation: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); emb.frustumCulled = false; G.add(emb);
  // set(t, o): o.r (radius, m), o.k (brightness), o.white, o.cy (the camera's height, to place the lights and embers), o.yTop/yBot (clip)
  G.set = (t, o = {}) => {
    const r = o.r ?? 320, k = o.k ?? 1; G.visible = k > .001 && r > .1;
    G.position.set(o.x ?? 0, 0, o.z ?? 0);
    core.scale.set(r, 1, r); glow.scale.set(r * 2.2, 1, r * 2.2);
    core.position.y = glow.position.y = o.y ?? 0;
    U.uT.value = t; U.uK.value = k; U.uWhite.value = o.white ?? 0; GU.uK.value = .55 * k * (1 + 2 * (o.white ?? 0));
    const cy = o.cy ?? 0; lights.forEach((L, i) => { L.position.set(0, cy + (i - 1) * 1500, 0); L.intensity = k * (o.light ?? 3e7); });
    const P = eg.attributes.position, span = 4000;
    E.forEach(([a, rr, h, s], i) => { const y = cy - span / 2 + (((h + t * (.04 + .06 * s)) % 1)) * span; P.setXYZ(i, Math.cos(a + t * .1) * r * rr, y, Math.sin(a + t * .1) * r * rr); });
    P.needsUpdate = true; emb.material.opacity = Math.min(1, k) * (o.embers ?? 1);
  };
  return G;
}
// the two lights in the void: Brahma's gold, Vishnu's blue
function rival3(scene, col, col2) {
  const G = new THREE.Group(); scene.add(G);
  const core = glow3(G, [0, 0, 0], 120, '#FFFFFF', 1), a = glow3(G, [0, 0, 0], 420, col, .9), b = glow3(G, [0, 0, 0], 1400, col2, .45);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(160, 3, 8, 96), new THREE.MeshBasicMaterial({ color: col, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); G.add(ring);
  const L = new THREE.PointLight(col, 0, 8000, 1.2); G.add(L);
  G.set = (t, k = 1, o = {}) => { G.visible = k > .001; const p = 1 + .08 * Math.sin(t * 3 + (o.ph || 0)) + (o.surge ?? 0) * .4;
    core.scale.setScalar(140 * p * k); a.scale.setScalar(480 * p * k); b.scale.setScalar(1600 * p * k); a.material.opacity = .9 * k; b.material.opacity = .4 * k; core.material.opacity = k;
    ring.rotation.set(t * .5 + (o.ph || 0), t * .3, 0); ring.scale.setScalar(p * k); ring.material.opacity = .5 * k; L.intensity = 2e7 * k; };
  return G;
}
// the boar and the swan: glowing silhouettes on sprites (drawn in 2D once)
const boarTex3 = () => tex3('boar', 512, 320, (g, w, h) => {
  const body = () => {
    g.beginPath(); g.moveTo(60, 160);
    g.bezierCurveTo(70, 80, 170, 40, 270, 46); g.bezierCurveTo(340, 48, 380, 70, 405, 100);       // the high, humped back
    g.bezierCurveTo(430, 118, 462, 140, 494, 168); g.lineTo(496, 196); g.bezierCurveTo(470, 206, 445, 204, 425, 198); // the long snout
    g.bezierCurveTo(415, 214, 398, 222, 385, 222);
    g.lineTo(388, 280); g.lineTo(356, 280); g.lineTo(350, 228);                                     // front leg, stout
    g.bezierCurveTo(330, 232, 318, 232, 305, 230); g.lineTo(306, 284); g.lineTo(276, 284); g.lineTo(270, 228);
    g.bezierCurveTo(220, 228, 180, 226, 150, 220);
    g.lineTo(150, 278); g.lineTo(120, 278); g.lineTo(112, 214);                                     // hind legs
    g.bezierCurveTo(100, 212, 92, 208, 84, 204); g.lineTo(88, 272); g.lineTo(58, 272); g.lineTo(52, 196);
    g.bezierCurveTo(40, 180, 42, 168, 60, 160); g.closePath();
  };
  g.shadowColor = '#5AB8FF'; g.shadowBlur = 34; g.fillStyle = '#1A3A8A'; body(); g.fill();
  g.shadowBlur = 0; const gr = g.createLinearGradient(0, 40, 0, 280); gr.addColorStop(0, '#6A9AF0'); gr.addColorStop(1, '#0E1E5A'); g.fillStyle = gr; body(); g.fill();
  g.strokeStyle = '#CFEAFF'; g.lineWidth = 5; body(); g.stroke();
  // a big curved tusk, the eye, the ear, a bristled mane
  g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(462, 196); g.quadraticCurveTo(492, 160, 474, 128); g.quadraticCurveTo(470, 166, 446, 192); g.fill();
  g.beginPath(); g.arc(418, 128, 6, 0, TAU); g.fill();
  g.fillStyle = '#9ACFFF'; g.beginPath(); g.moveTo(376, 84); g.lineTo(392, 52); g.lineTo(398, 96); g.fill();
  g.strokeStyle = '#BFE4FF'; g.lineWidth = 4; for (let i = 0; i < 16; i++) { const x = 130 + i * 16; g.beginPath(); g.moveTo(x, 52 + Math.abs(i - 7) * 1.6); g.lineTo(x + 8, 30 + (i % 2) * 7); g.stroke(); }
});
const swanTex3 = () => tex3('swan', 512, 512, (g, w, h) => {
  const shape = () => {
    g.beginPath();
    // the body, side-on, flying up-right; neck forward and up; both wings raised
    g.moveTo(120, 380); g.bezierCurveTo(160, 330, 240, 300, 300, 290); g.bezierCurveTo(330, 250, 350, 190, 370, 140);
    g.bezierCurveTo(378, 115, 400, 104, 420, 112); g.lineTo(452, 118); g.lineTo(424, 126); g.bezierCurveTo(400, 140, 392, 190, 370, 250);
    g.bezierCurveTo(360, 300, 320, 360, 250, 390); g.bezierCurveTo(200, 410, 150, 410, 120, 380); g.closePath();
    g.moveTo(250, 300); g.bezierCurveTo(200, 220, 120, 120, 40, 60); g.bezierCurveTo(110, 90, 160, 110, 200, 130); g.bezierCurveTo(150, 90, 120, 50, 100, 20);
    g.bezierCurveTo(190, 70, 260, 160, 300, 290); g.closePath();
    g.moveTo(270, 300); g.bezierCurveTo(260, 200, 250, 110, 270, 30); g.bezierCurveTo(290, 100, 310, 150, 320, 200); g.bezierCurveTo(320, 140, 330, 90, 350, 60); g.bezierCurveTo(345, 150, 330, 240, 300, 300); g.closePath();
  };
  g.shadowColor = '#FFE6A0'; g.shadowBlur = 34; g.fillStyle = '#FFF6DE'; shape(); g.fill('nonzero');
  g.shadowBlur = 0; const gr = g.createLinearGradient(0, 0, 0, 420); gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(1, '#F2D69A'); g.fillStyle = gr; shape(); g.fill('nonzero');
  g.fillStyle = '#E88A2A'; g.beginPath(); g.moveTo(420, 112); g.lineTo(456, 118); g.lineTo(424, 126); g.closePath(); g.fill();
  g.fillStyle = '#2A1A10'; g.beginPath(); g.arc(404, 118, 4, 0, TAU); g.fill();
});
function beast3(scene, tex, w, h, col) {
  const G = new THREE.Group(); scene.add(G);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, fog: false })); s.scale.set(w, h, 1); G.add(s);
  const g1 = glow3(G, [0, 0, 0], w * 2.5, col, .5);
  const L = new THREE.PointLight(col, 0, w * 30, 1.4); G.add(L);
  G.set = (pos, k = 1, o = {}) => { G.visible = k > .001; G.position.set(...pos); s.material.opacity = k; s.material.rotation = o.rot ?? 0; g1.material.opacity = .45 * k; L.intensity = k * (o.light ?? 3e5); s.scale.set(w * (o.flip ? -1 : 1), h, 1); };
  return G;
}

// ---------- the whole world ----------
const ARU = (() => {
  const S = new THREE.Scene();
  S.fog = new THREE.FogExp2('#3A3050', 1 / 30000);
  const sky = sky3d(S), moon = moon3d(S);
  const hemi = new THREE.HemisphereLight('#FFFFFF', '#000000', 1); S.add(hemi);
  const sun = new THREE.DirectionalLight('#FFFFFF', 1); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -3000, right: 3000, top: 3000, bottom: -3000, near: 100, far: 20000 }); sun.shadow.bias = -.0005; sun.shadow.normalBias = 2;
  S.add(sun, sun.target); sun.target.position.copy(HILLC);
  // the ground
  const mat = arTerrainMat3();
  const near = mesh3(S, demGeo3(DN, 1), mat, [0, 0, 0]);
  const lonPad = .004, latPad = .004;
  const far = mesh3(S, demGeo3(DF, 1, { drop: (x, z, lon, lat) => {
    const i = Math.min(lon - DN.lon0, DN.lon1 - lon, lat - DN.lat0, DN.lat1 - lat); return i > 0 ? 25 * clamp(i / lonPad) : 0; } }), mat, [0, 0, 0], { cast: false });
  // the town, the girivalam road and its crowd, the villages
  // beyond the plain's data: one flat ground to the horizon, under the fog
  const plane = mesh3(S, new THREE.PlaneGeometry(400000, 400000), mat, [0, -70, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const T3 = temple3(S), FIRE = deepam3(S), PIL = arPillar3(S);
  const BRAHMA = rival3(S, '#FFC860', '#FF9A30'), VISHNU = rival3(S, '#5AA8FF', '#2A5AE0');
  const BOAR = beast3(S, boarTex3(), 520, 325, '#5AA8FF'), SWAN = beast3(S, swanTex3(), 500, 500, '#FFE6A0');
  const R = lcg(110), town = [], crowd = [], vill = [];
  const onGround = (x, z, lift = 2) => [x, arH(x, z) + lift, z];
  // the town: streets on a grid turned to the temple, densest round it; no lights on the hill
  for (let i = 0; i < 260; i++) {
    const horiz = R() < .5, off = (R() - .5) * 5200, len = 300 + R() * 1800, c0 = (R() - .5) * 4000;
    const ox = TEMPLE.x + 900, oz = TEMPLE.z + 300;
    for (let s = 0; s < len; s += 18 + R() * 14) {
      const x = ox + (horiz ? c0 + s - len / 2 : off), z = oz + (horiz ? off : c0 + s - len / 2);
      const d = Math.hypot(x - TEMPLE.x - 700, z - TEMPLE.z - 200); if (d > 3600 * (.7 + .3 * R())) continue;
      const h = arH(x, z); if (h > 26) continue;
      town.push([x, h + 6, z, 6, STREET[(R() * 4) | 0], 1.2]);
      if (R() < .5) town.push([x + (R() - .5) * 30, h + 3 + R() * 10, z + (R() - .5) * 30, 3.5, R() < .15 ? FEST[(R() * 5) | 0] : LAMP[(R() * 4) | 0], 1]);
    }
  }
  for (let i = 0; i < 9000; i++) { const a = R() * TAU, r = Math.pow(R(), .7) * 3200, x = TEMPLE.x + 700 + Math.cos(a) * r, z = TEMPLE.z + 200 + Math.sin(a) * r * .9, h = arH(x, z); if (h > 24) continue; town.push([x, h + 2 + R() * 12, z, 3 + R() * 2, R() < .2 ? '#F4ECE0' : LAMP[(R() * 4) | 0], .8]); }
  // the girivalam: the road's lights and the crowd's lamps, thickest near the temple
  const GP = giriPath3();
  for (let i = 0; i < GP.length; i++) {
    const a = GP[i], b = GP[(i + 1) % GP.length], seg2 = Math.hypot(b[0] - a[0], b[2] - a[2]), nx = -(b[2] - a[2]) / seg2, nz = (b[0] - a[0]) / seg2;
    for (let s = 0; s < seg2; s += 2.2) {
      const k = s / seg2, x = lerp(a[0], b[0], k), z = lerp(a[2], b[2], k);
      if (R() < .5) town.push([x + nx * 9, arH(x + nx * 9, z + nz * 9) + 7, z + nz * 9, 5, STREET[(R() * 4) | 0], 1]);
      for (let c = 0; c < 4; c++) { const w2 = (R() - .5) * 22, cx = x + nx * w2, cz = z + nz * w2; crowd.push([cx, arH(cx, cz) + 1.2, cz, 1.6, R() < .25 ? '#E8F0FF' : LAMP[(R() * 4) | 0], 1.3]); }
    }
  }
  // the crowd packed round the temple and its streets
  for (let i = 0; i < 12000; i++) { const a = R() * TAU, r = 125 + Math.pow(R(), 1.6) * 900, x = TEMPLE.x + Math.cos(a) * r * 1.1, z = TEMPLE.z + Math.sin(a) * r, h = arH(x, z); if (h > 30 || Math.hypot(x - TEMPLE.x - 440, z - TEMPLE.z - 265) < 70) continue; crowd.push([x, h + 1.2, z, 1.5, R() < .3 ? '#E8F0FF' : LAMP[(R() * 4) | 0], 1.2]); }
  // villages across the plain, and a few towns
  for (let v = 0; v < 520; v++) {
    const a = R() * TAU, r = 5000 + Math.pow(R(), .8) * 42000, cx = Math.cos(a) * r, cz = Math.sin(a) * r, n = 10 + (R() < .08 ? 260 : 50) * R(), sz = 120 + n * 3;
    for (let i = 0; i < n; i++) { const x = cx + (R() - .5) * sz, z = cz + (R() - .5) * sz; vill.push([x, arH(x, z) + 4, z, 8, R() < .3 ? '#F4ECE0' : STREET[(R() * 4) | 0], 1]); }
  }
  const LT = lights3(S, town, { min: 1.4 }), LC = lights3(S, crowd, { min: 1.1 }), LV = lights3(S, vill, { min: 1.2 });
  // the 35 km ring (laid on the ground, drawn on)
  const ringPts = []; for (let i = 0; i <= 720; i++) { const a = i / 720 * TAU; ringPts.push(V3(Math.cos(a) * 35000, 0, Math.sin(a) * 35000)); }
  ringPts.forEach(p => p.y = arH(p.x, p.z) + 30);
  const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
  const ring = new THREE.Line(ringGeo, new THREE.LineBasicMaterial({ color: '#FFC860', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); ring.frustumCulled = false; S.add(ring);
  // under the ground, for the boar: rocks drifting round the pillar
  const rockG = new THREE.Group(); S.add(rockG);
  const rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: '#5A4A40', roughness: 1 }), 2200);
  { const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), rr = lcg(9);
    for (let i = 0; i < 2200; i++) { const a = rr() * TAU, r = 500 + rr() * 2600, s = 8 + rr() * 60; q.setFromEuler(new THREE.Euler(rr() * 3, rr() * 3, rr() * 3)); m4.compose(V3(Math.cos(a) * r, -rr() * 40000, Math.sin(a) * r), q, V3(s, s * (.5 + rr()), s)); rocks.setMatrixAt(i, m4); } }
  rockG.add(rocks);
  // above, for the swan: clouds round the pillar
  const cloudG = new THREE.Group(); S.add(cloudG);
  { const rr = lcg(19); for (let i = 0; i < 160; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex3(), color: '#B8A0B0', transparent: true, opacity: .5, depthWrite: false })); const a = rr() * TAU, r = 600 + rr() * 3000; s.position.set(Math.cos(a) * r, 3000 + rr() * 40000, Math.sin(a) * r); s.scale.setScalar(900 + rr() * 1800); cloudG.add(s); } }

  const C = (h) => new THREE.Color(h);
  // set(t, o): everything that changes, from one object of knobs
  //   sky: [a, b, k] palette blend; sunAt [x, y, z] (direction); sun/hemi intensities and colours; fog density
  //   ground: on (visible), heat, crack, rise; town/crowd/vill (0..1); temple {..}; fire (0..1) + fireO {..};
  //   pillar {..} | null; brahma/vishnu (0..1); boar/swan [pos, k, o]; rocks/clouds visible; ring (0..1 drawn on)
  const set = (t, o = {}) => {
    const [sa, sb, sk] = o.sky || ['blue', 'blue', 0];
    const hor = sky.set(sa, sb, sk, { sun: o.sunAt, stars: o.stars, glow: o.skyGlow, bright: o.skyBright, t });
    const sd = V3(...(o.sunAt || [.5, .55, -.3])).normalize();
    sun.position.copy(HILLC).addScaledVector(sd, 12000); sun.intensity = o.sun ?? .35; sun.color.set(o.sunCol || '#7E90D0'); sun.castShadow = (o.sun ?? 0) > .2;
    hemi.color.set(o.hemiSky || '#6A78B8'); hemi.groundColor.set(o.hemiGround || '#2A2018'); hemi.intensity = o.hemi ?? .5;
    S.fog.color.copy(o.fogCol ? C(o.fogCol) : hor); S.fog.density = o.fog ?? 1 / 30000;
    const gOn = o.ground !== false; near.visible = far.visible = plane.visible = gOn;
    const U = mat.userData.U; U.uHeat.value = o.heat ?? 0; U.uCrack.value = o.crack ?? 0; U.uRise.value = o.rise ?? 1; U.uTime.value = t;
    LT.set(t, gOn ? (o.town ?? 1) : 0); LC.set(t, gOn ? (o.crowd ?? 1) : 0); LV.set(t, gOn ? (o.vill ?? 1) : 0);
    T3.visible = gOn && o.temple !== false; T3.set(t, o.templeO || {});
    FIRE.set(t, gOn ? (o.fire ?? 1) : 0, o.fireO || {});
    if (o.pillar) PIL.set(t, o.pillar); else PIL.visible = false;
    BRAHMA.set(t, o.brahma ?? 0, o.brahmaO || {}); VISHNU.set(t, o.vishnu ?? 0, { ph: 2, ...(o.vishnuO || {}) });
    if (o.brahma) BRAHMA.position.set(...(o.brahmaAt || [-1400, 0, 0])); if (o.vishnu) VISHNU.position.set(...(o.vishnuAt || [1400, 0, 0]));
    if (o.boar) BOAR.set(...o.boar); else BOAR.visible = false;
    if (o.swan) SWAN.set(...o.swan); else SWAN.visible = false;
    rockG.visible = !!o.rocks; cloudG.visible = !!o.clouds;
    ring.visible = (o.ring ?? 0) > .001; ringGeo.setDrawRange(0, Math.floor(clamp(o.ring ?? 0) * 721)); ring.material.opacity = o.ringA ?? 1;
    if (o.moon) moon.place(CAM3, ...o.moon); else moon.visible = false;
    return o.exposure ?? 1;
  };
  return { S, set, sky, moon, T3, FIRE, PIL, BRAHMA, VISHNU, BOAR, SWAN, near, far, mat, GP, sun };
})();
