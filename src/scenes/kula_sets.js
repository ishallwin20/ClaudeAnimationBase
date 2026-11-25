// onemoon_sets.js: the sets of "One moon" (ad 114), in the 3D style. (Arunachala is onemoon_aru.js, ad 110's world.)
//   RV: a river at night under the full moon. The sky and the water are shaders sharing one sky function (from ad 97's
//       ghat: gradient, the moon's disc with its seas and halo, cloud streaks, stars), so the water mirrors the sky it
//       sits under; everything else (flames, lanterns, ghats) is mirrored by a planar reflection pass (RV.refl(),
//       before render3). Three dressings, one at a time (o.place):
//         thai:  Loy Krathong: krathongs (a banana-trunk float, folded leaf petals, marigolds, a candle, incense)
//                drifting, Yi Peng sky lanterns rising, a prang on the far bank lit gold;
//         kashi: Dev Deepawali: the ghats of Kashi, steps lined with lamps, palaces and shikharas above, boats;
//         boita: Boita Bandana before dawn: little bark boats with paper sails, each with its lamp.
//   MP: the Bay of Bengal as a relief map (src/data/bay_dem.js; 1 unit = 10 km; MAP3 from cine3d_india.js), from Kashi
//       to Bali: beams at the festival sites, lamps scattered over the land, sea routes and arcs (line3), sailing
//       boats along the routes, the moon.
// Units: metres in RV (y up, the water at y = 0, the camera looks to -z), map units in MP.
const C3 = (h) => new THREE.Color(h);
const SKY_GLSL = `
  uniform vec3 uZen, uMid, uHor, uSunCol, uSunDir, uDisc, uCloud; uniform float uSunR, uStars, uTime, uHaloK;
  float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
  float fbm(vec2 p) { float s = 0., a = .5; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + 17.; a *= .5; } return s; }
  vec3 skyCol(vec3 d, float disc) {
    float e = d.y;
    vec3 c = mix(uHor, uMid, smoothstep(0., .17, e)); c = mix(c, uZen, smoothstep(.1, .62, e));
    c = mix(c, uHor * .5, smoothstep(0., -.1, e));
    float m = max(dot(d, uSunDir), 0.);
    float azk = pow(max(dot(normalize(d.xz + 1e-5), normalize(uSunDir.xz)), 0.), 6.);
    c += uSunCol * exp(-abs(e - max(uSunDir.y, 0.) * .6) * 9.) * azk * .35 * uHaloK;
    c += uSunCol * (pow(m, 40.) * .35 + pow(m, 400.) * .5) * uHaloK;
    float az = atan(d.x, -d.z);
    float cl = smoothstep(.52, .82, fbm(vec2(az * 3.4 + uTime * .004, e * 30.))) * smoothstep(.02, .07, e) * (1. - smoothstep(.2, .44, e));
    vec3 cc = mix(uCloud, uSunCol * 1.2, clamp(pow(m, 6.) * uHaloK, 0., 1.));
    c = mix(c, cc, cl * .6);
    if (uStars > 0.) { vec2 g = vec2(az * 110., e * 150.); float hh = h21(floor(g)); c += vec3(.85, .92, 1.) * step(.984, hh) * smoothstep(.3, .05, length(fract(g) - .5)) * smoothstep(.05, .3, e) * uStars * (.55 + .45 * sin(uTime * 2.4 + hh * 60.)) * (1. - cl); }
    float ang = acos(clamp(dot(d, uSunDir), -1., 1.));
    float dk = (1. - smoothstep(uSunR * .93, uSunR, ang)) * disc;
    vec3 rt = normalize(cross(uSunDir, vec3(0., 1., 0.))), upv = cross(rt, uSunDir);
    vec2 q = vec2(dot(d, rt), dot(d, upv)) / uSunR;
    float maria = smoothstep(.42, .68, fbm(q * 1.7 + 3.1)) * .3 + smoothstep(.5, .8, fbm(q * 4.3 + 9.)) * .12;
    vec3 face = uDisc * (1. - maria) * (1. - .22 * smoothstep(.4, 1., length(q)));
    c = mix(c, face + c * .2, dk * (1. - cl * .5));
    return c;
  }`;

// ---------- small builders ----------
const softTex3 = () => tex3('softPuff', 128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(.5, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
const puff3 = (parent, pos, size, col, a) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex3(), color: col, transparent: true, opacity: a, depthWrite: false, fog: false })); s.position.set(...pos); s.scale.setScalar(size); parent.add(s); return s; };
const std3m = (col, rough = .8, o = {}) => new THREE.MeshStandardMaterial({ color: col, roughness: rough, metalness: 0, envMapIntensity: .3, ...o });
const KR = {
  trunk: std3m('#E4DCC0', .85), leaf: std3m('#2F6A2A', .6, { side: THREE.DoubleSide }), leaf2: std3m('#4E8A34', .6, { side: THREE.DoubleSide }),
  mari: [std3m('#F09010', .9), std3m('#F2B818', .9), std3m('#E8641C', .9)], white: std3m('#F6F0E4', .5), stick: std3m('#5A2A18', .8), wood: std3m('#3A2618', .85), bark: std3m('#B8925A', .9, { side: THREE.DoubleSide }),
};
// a leaf petal: a pointed, folded blade (a bent quad strip), its tip at +y
const PETAL_GEO = (() => {
  const g = new THREE.BufferGeometry(), P = [], I = [], n = 6;
  for (let i = 0; i <= n; i++) { const v = i / n, w = .03 * Math.sin(Math.PI * Math.min(1, v * 1.15)) * (1 - v * .4) + .002, y = v * .1, fold = .012 * (1 - v); P.push(-w, y, fold, 0, y, -.004, w, y, fold); }
  for (let i = 0; i < n; i++) { const a = i * 3; I.push(a, a + 3, a + 1, a + 1, a + 3, a + 4, a + 1, a + 4, a + 2, a + 2, a + 4, a + 5); }
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I); g.computeVertexNormals(); return g;
})();
// a krathong: a float of banana trunk, a ring of folded banana-leaf petals in two tiers, marigolds, a candle and three
// incense sticks. .flame (flame3), .ph (a phase for its bob).
function krathong3(parent, seed = 1, o = {}) {
  const G = new THREE.Group(); parent.add(G); const R = lcg(seed);
  mesh3(G, new THREE.CylinderGeometry(.15, .14, .07, 26), KR.trunk, [0, .02, 0], { cast: false });
  for (const [n, r, y, tilt, sc, m] of [[14, .15, .045, .62, 1.25, KR.leaf], [11, .105, .07, .38, 1.05, KR.leaf2], [8, .06, .09, .2, .8, KR.leaf]]) {
    for (let i = 0; i < n; i++) { const a = i / n * TAU + R() * .1 + y * 40; const p = mesh3(G, PETAL_GEO, m, [Math.sin(a) * r, y, Math.cos(a) * r], { cast: false }); p.rotation.set(0, a, 0); p.rotateX(tilt); p.scale.setScalar(sc); }
  }
  const mg = new THREE.IcosahedronGeometry(.024, 1);
  for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + R(), r = .045 + R() * .03; mesh3(G, mg, KR.mari[(i + seed) % 3], [Math.sin(a) * r, .115 + R() * .02, Math.cos(a) * r], { scale: [1, .75, 1], cast: false }); }
  mesh3(G, new THREE.CylinderGeometry(.011, .012, .09, 10), KR.white, [0, .16, 0], { cast: false });
  for (let i = 0; i < 3; i++) { const a = i / 3 * TAU + .5; const s = mesh3(G, new THREE.CylinderGeometry(.0025, .0025, .19, 5), KR.stick, [Math.sin(a) * .022, .19, Math.cos(a) * .022], { cast: false }); s.rotation.set(Math.cos(a) * .18, 0, -Math.sin(a) * .18); glow3(G, [Math.sin(a) * .04, .282, Math.cos(a) * .04], .03, '#FF5A2A', .9); }
  G.flame = flame3(G, [0, .215, 0], .42 * (o.fk ?? 1), { light: !!o.light, power: o.power ?? .9, range: o.range ?? 4, col: '#FFA040', seed });
  G.ph = R() * 6; return G;
}
// a little boat of banana bark with a paper sail and a lamp (Boita Bandana)
const SAIL_COLS = ['#F4EEDC', '#E8B020', '#D8341C', '#F4EEDC', '#E8641C'];
function boita3(parent, seed = 1, o = {}) {
  const G = new THREE.Group(); parent.add(G); const R = lcg(seed);
  mesh3(G, new THREE.SphereGeometry(1, 18, 8, 0, TAU, Math.PI / 2, Math.PI / 2), KR.bark, [0, .035, 0], { scale: [.24, .06, .085], cast: false });
  mesh3(G, new THREE.CylinderGeometry(1, 1, .004, 18), KR.bark, [0, .036, 0], { scale: [.235, 1, .08], cast: false });
  mesh3(G, new THREE.CylinderGeometry(.0035, .0035, .3, 5), KR.stick, [.03, .18, 0], { cast: false });
  const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(0, .24); sh.quadraticCurveTo(.09, .14, .15, .02); sh.lineTo(0, 0);
  const sail = mesh3(G, new THREE.ShapeGeometry(sh, 8), std3m(SAIL_COLS[seed % SAIL_COLS.length], .7, { side: THREE.DoubleSide }), [.034, .06, 0], { cast: false }); sail.rotation.y = -.25 + R() * .5;
  const fl = mesh3(G, new THREE.PlaneGeometry(.04, .022), std3m('#D8341C', .7, { side: THREE.DoubleSide }), [.05, .33, 0], { cast: false });
  for (let i = 0; i < 4; i++) mesh3(G, new THREE.IcosahedronGeometry(.016, 1), KR.mari[i % 3], [-.08 + i * .03, .05, (R() - .5) * .05], { scale: [1, .7, 1], cast: false });
  mesh3(G, lathe3([[0, 0], [.022, 0], [.04, .012], [.046, .024], [.04, .022], [.03, .012], [0, .01]], 16), std3m('#A85A30', .9), [-.13, .04, 0], { cast: false });
  G.flame = flame3(G, [-.13, .062, 0], .7, { light: !!o.light, power: .9, range: 3, col: '#FFA040', seed }); glow3(G, [-.13, .09, 0], .35, '#FF9A40', .45);
  G.ph = R() * 6; return G;
}
// a wooden river boat (Kashi), a dark hull with a lamp at the bow
function boat3(parent, pos, yaw, seed = 1) {
  const G = new THREE.Group(); G.position.set(...pos); G.rotation.y = yaw; parent.add(G);
  mesh3(G, new THREE.SphereGeometry(1, 24, 10, 0, TAU, Math.PI / 2, Math.PI / 2), KR.wood, [0, .3, 0], { scale: [4.6, .75, 1.15], cast: false });
  mesh3(G, new THREE.BoxGeometry(8.4, .08, 1.9), std3m('#4A3020', .8), [0, .3, 0], { cast: false });
  for (const x of [-2, 0, 2]) mesh3(G, new THREE.BoxGeometry(.18, .35, 2), std3m('#3A2414', .8), [x, .5, 0], { cast: false });
  G.lamp = flame3(G, [4.0, .55, 0], .9, { light: false, col: '#FFA040', seed });
  return G;
}

// ======================================================================================================
// RV: the river
// ======================================================================================================
const RV = (() => {
  const S = new THREE.Scene();
  S.fog = new THREE.Fog('#121A3A', 80, 900);
  const PAL = {
    // moonlit Thailand: deep blue-violet, a pale moon
    thai: { zen: '#030820', mid: '#0C1844', hor: '#2E2C5E', sun: '#8EA4E0', disc: [1.7, 1.66, 1.5], deep: '#030712', cloud: '#141C40', hemiS: '#5A6CA8', hemiG: '#1A1620', hemiK: .5, key: '#9AB0E8', keyK: .55, fillK: .2, stars: .8, halo: .7, fog: '#141C40', exp: 1.15 },
    // Kashi: the horizon warmed by the ghats' lamps
    kashi: { zen: '#050820', mid: '#1A1A44', hor: '#5A3448', sun: '#B0A4D0', disc: [1.7, 1.62, 1.45], deep: '#06060E', cloud: '#2A1E3A', hemiS: '#6A5C98', hemiG: '#2A1A14', hemiK: .4, key: '#9AA8E0', keyK: .35, fillK: .15, stars: .5, halo: .6, fog: '#2A1C30', exp: 1.15 },
    // before dawn (Boita Bandana): blue going lilac, a low moon still up
    predawn: { zen: '#0E1C48', mid: '#3A4C8E', hor: '#A88AA0', sun: '#C8B0C8', disc: [1.4, 1.36, 1.28], deep: '#0A1226', cloud: '#2A3060', hemiS: '#8A9CD8', hemiG: '#3A3448', hemiK: 1.1, key: '#A8B8F0', keyK: .5, fillK: .9, stars: .3, halo: .5, fog: '#5A6494', exp: 1.05 },
  };
  const NUMK = ['hemiK', 'keyK', 'fillK', 'stars', 'halo', 'exp'], COLK = ['zen', 'mid', 'hor', 'sun', 'deep', 'cloud', 'hemiS', 'hemiG', 'key', 'fog'];
  for (const p of Object.values(PAL)) for (const k of COLK) p[k] = C3(p[k]);
  const CUR = { disc: [0, 0, 0] }; for (const k of COLK) CUR[k] = new THREE.Color();
  const blend = (a, b, k) => { const A = PAL[a], B = PAL[b || a]; k = b ? clamp(k) : 0; for (const c of COLK) CUR[c].copy(A[c]).lerp(B[c], k); for (const n of NUMK) CUR[n] = lerp(A[n], B[n], k); CUR.disc = A.disc.map((v, i) => lerp(v, B.disc[i], k)); return CUR; };

  // ---------- light ----------
  const hemi = new THREE.HemisphereLight('#5A6CA8', '#1A1620', .5); S.add(hemi);
  const key = new THREE.DirectionalLight('#9AB0E8', .5); S.add(key, key.target);
  const fill = new THREE.DirectionalLight('#FFB070', .2); fill.position.set(0, 4, 20); S.add(fill, fill.target); fill.target.position.set(0, 0, -10);

  // ---------- the sky and the water ----------
  const U = { uZen: { value: new THREE.Color() }, uMid: { value: new THREE.Color() }, uHor: { value: new THREE.Color() }, uSunCol: { value: new THREE.Color() }, uSunDir: { value: V3(0, .2, -1).normalize() }, uDisc: { value: V3() }, uCloud: { value: new THREE.Color() },
    uSunR: { value: .03 }, uStars: { value: 0 }, uTime: { value: 0 }, uHaloK: { value: 1 } };
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), new THREE.ShaderMaterial({ uniforms: U, side: THREE.BackSide, depthWrite: false, depthTest: false, fog: false,
    vertexShader: 'varying vec3 vD; void main() { vD = position; gl_Position = projectionMatrix * vec4(mat3(viewMatrix) * position * 1000., 1.); gl_Position.z = gl_Position.w * .99999; }',
    fragmentShader: `${SKY_GLSL} varying vec3 vD; void main() { gl_FragColor = vec4(skyCol(normalize(vD), 1.), 1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }` }));
  dome.renderOrder = -10; dome.frustumCulled = false; S.add(dome);
  const RT = new THREE.WebGLRenderTarget(W / 2, H / 2, { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
  const UW = { ...U, tRefl: { value: RT.texture }, uRes: { value: new THREE.Vector2(W, H) }, uDeep: { value: new THREE.Color() }, uFog: { value: new THREE.Color() }, uCalm: { value: 1 }, uReflK: { value: .85 }, uFogD: { value: V3(160, 900, .85) } };
  const water = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.ShaderMaterial({ uniforms: UW,
    vertexShader: 'varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `${SKY_GLSL} varying vec3 vW; uniform sampler2D tRefl; uniform vec2 uRes; uniform vec3 uDeep, uFog, uFogD; uniform float uCalm, uReflK;
      void main() {
        vec3 V = normalize(vW - cameraPosition); float d = length(vW - cameraPosition);
        vec2 p = vW.xz; float t = uTime;
        vec2 q1 = p * vec2(.9, 2.2) + vec2(t * .22, t * .35), q2 = p * vec2(2.7, 6.) + vec2(-t * .45, t * .6);
        float hx = fbm(q1 + vec2(.12, 0.)) - fbm(q1 - vec2(.12, 0.)) + .5 * (fbm(q2 + vec2(.12, 0.)) - fbm(q2 - vec2(.12, 0.)));
        float hz = fbm(q1 + vec2(0., .12)) - fbm(q1 - vec2(0., .12)) + .5 * (fbm(q2 + vec2(0., .12)) - fbm(q2 - vec2(0., .12)));
        float amp = uCalm * 1.2 / (1. + d * .012);
        vec3 n = normalize(vec3(hx * amp, 1., hz * amp));
        vec3 R = reflect(V, n); R.y = abs(R.y) + .002; R = normalize(R);
        vec3 sky = skyCol(R, 1.);
        float F = clamp(.03 + .97 * pow(1. - max(dot(-V, n), 0.), 4.), 0., 1.);
        vec2 suv = gl_FragCoord.xy / uRes;
        vec2 ruv = vec2(suv.x, 1. - suv.y) + vec2(hx * .6, hz * 5.) * .05 * uCalm / (1. + d * .0015);
        vec4 ro = texture2D(tRefl, ruv);
        vec3 refl = sky * (1. - clamp(ro.a, 0., 1.) * uReflK) + ro.rgb * uReflK;
        vec3 col = mix(uDeep, refl, F * .9 + .1);
        col = mix(col, uFog, smoothstep(uFogD.x, uFogD.y, d) * uFogD.z);
        gl_FragColor = vec4(col, 1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` }));
  water.rotation.x = -Math.PI / 2; water.position.set(0, 0, -1000); S.add(water);
  // a far bank: a dark tree line on the horizon (its own texture per place)
  const bankTex = tex3('omBank', 2048, 64, (g, w, h) => { g.clearRect(0, 0, w, h); const r = lcg(17); g.fillStyle = '#FFFFFF'; g.fillRect(0, 44, w, 20); for (let i = 0; i < 260; i++) { const x = r() * w, rr = 8 + r() * 22, y = 46 - r() * 6; for (const dx of [0, w, -w]) { g.beginPath(); g.ellipse(x + dx, y, rr, rr * (.5 + r() * .5), 0, 0, 7); g.fill(); } } });
  const bank = new THREE.Mesh(new THREE.PlaneGeometry(3000, 24), new THREE.MeshBasicMaterial({ map: bankTex.rep(4, 1), color: '#0C0C1C', transparent: true, alphaTest: .5, fog: false }));
  bank.position.set(0, 6, -700); S.add(bank);

  // ================= thai: Loy Krathong + Yi Peng =================
  const THAI = new THREE.Group(); S.add(THAI);
  const HERO = krathong3(THAI, 3, { light: true, fk: 1.1, power: 1.4, range: 5 }); HERO.position.set(0, 0, -2.2);
  const KRS = [], rk = lcg(41);
  for (let i = 0; i < 90; i++) {
    const z = -1 - Math.pow(rk(), 1.4) * 160, x = (rk() - .5) * (8 + -z * 1.1);
    if (Math.hypot(x, z + 2.2) < .9) continue;
    const k = krathong3(THAI, 10 + i, { fk: 1 + -z * .006 }); k.position.set(x, 0, z); k.rotation.y = rk() * 6; k.scale.setScalar(1 + -z * .004); k.x0 = x; k.z0 = z; k.v = .05 + rk() * .08; KRS.push(k);
  }
  // the krathongs' glow far off (too far to model): points on the water
  const farK = [], rf = lcg(8);
  for (let i = 0; i < 1600; i++) { const z = -150 - Math.pow(rf(), .8) * 520, x = (rf() - .5) * (60 + -z * 1.4); farK.push([x, .25, z, .5, LAMP[(rf() * 4) | 0], 1.4]); }
  const FARK = lights3(THAI, farK, { min: 1.3 });
  // pools of warm light on the water round the near krathongs
  const KLIGHT = [[-2.4, -6], [2.6, -9], [-.8, -16]].map(([x, z]) => { const l = new THREE.PointLight('#FF9A40', 0, 7, 1.6); l.position.set(x, .6, z); THAI.add(l); return l; });
  // Yi Peng: sky lanterns. Bodies: an instanced paper cylinder lit from inside; glow: points.
  const lanTex = tex3('omLantern', 64, 128, (g, w, h) => { const gr = g.createLinearGradient(0, h, 0, 0); gr.addColorStop(0, '#FFF2C0'); gr.addColorStop(.35, '#FFC060'); gr.addColorStop(1, '#C8642A'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(120,50,10,.25)'; for (let x = 0; x < w; x += 16) g.fillRect(x, 0, 2, h); });
  const NL = 420, LAN = new THREE.InstancedMesh(new THREE.CylinderGeometry(.42, .34, .95, 10, 1, true), new THREE.MeshBasicMaterial({ map: lanTex, color: '#FFFFFF', side: THREE.DoubleSide, fog: false, transparent: true }), NL);
  LAN.frustumCulled = false; THAI.add(LAN);
  const lanD = [], rl = lcg(77);
  for (let i = 0; i < NL; i++) { const near = i < 90; lanD.push({ x: (rl() - .5) * (near ? 90 : 900), z: near ? -22 - rl() * 100 : -120 - rl() * 650, y0: near ? 1.5 + Math.pow(rl(), 1.5) * 22 : 8 + rl() * 170, top: 400, v: near ? .35 + rl() * .5 : .8 + rl() * 1.2, ph: rl() * 6, s: .9 + rl() * .4 }); }
  const lanGlowPts = lanD.map(d => [d.x, d.y0, d.z, 2.0 * d.s, rl() < .5 ? '#FFB050' : '#FFC878', 1.6]);
  const LANG = lights3(THAI, lanGlowPts, { min: 1.6 });
  const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), s4 = V3(), p4 = V3();
  const placeLanterns = (t, rise, k) => {
    const P = LANG.geometry.attributes.position;
    lanD.forEach((d, i) => {
      const y = d.y0 + Math.min(d.top, rise * d.v * t), sw = Math.sin(t * .6 + d.ph) * .8;
      p4.set(d.x + sw + t * .25, y, d.z); q4.setFromEuler(new THREE.Euler(Math.sin(t + d.ph) * .06, 0, Math.cos(t * .8 + d.ph) * .06)); s4.setScalar(d.s * k > 0 ? d.s : 0);
      m4.compose(p4, q4, s4); LAN.setMatrixAt(i, m4); P.setXYZ(i, p4.x, p4.y - .1, p4.z);
    });
    LAN.instanceMatrix.needsUpdate = true; P.needsUpdate = true;
  };
  // the far bank: a prang (a Khmer-style temple tower), smaller prangs round it, lit gold, and the bank's lights
  const PRANG = new THREE.Group(); THAI.add(PRANG); PRANG.position.set(-80, 0, -520);
  const tierTex = (bump) => tex3('omTier' + (bump ? 'B' : 'C'), 256, 512, (g, w, h) => {
    g.fillStyle = bump ? '#808080' : '#D8C8A8'; g.fillRect(0, 0, w, h); const r = lcg(bump ? 4 : 5);
    for (let y = 0; y < h; y += 16) { g.fillStyle = bump ? '#303030' : 'rgba(90,70,50,.55)'; g.fillRect(0, y, w, 3); }
    for (let y = 6; y < h; y += 32) for (let x = 4; x < w; x += 22) { g.fillStyle = bump ? '#E0E0E0' : ['rgba(200,90,60,.5)', 'rgba(60,120,140,.45)', 'rgba(230,200,120,.6)', 'rgba(255,255,255,.4)'][(r() * 4) | 0]; g.beginPath(); g.ellipse(x + 8, y + 4, 6, 4, 0, 0, 7); g.fill(); }
  }, bump ? { data: true } : {});
  const prangMat = new THREE.MeshStandardMaterial({ color: '#E8D8B8', map: tierTex().rep(6, 1), bumpMap: tierTex(true).rep(6, 1), bumpScale: 2, roughness: .85, emissive: '#7A4A20', emissiveIntensity: .12 });
  const prang = (h, r) => {
    const P = [[0, 0], [r * 1.25, 0], [r * 1.25, h * .1], [r * 1.1, h * .12], [r, h * .2], [r * .8, h * .24], [r * .72, h * .3]];
    const n = 9; for (let i = 0; i <= n; i++) { const v = i / n, y = h * (.35 + .55 * v), rr = r * (.62 - .5 * Math.pow(v, 1.1)); P.push([rr, y - h * .025], [rr * 1.12, y]); }
    P.push([r * .06, h * .93], [r * .04, h], [0, h * 1.02]); return lathe3(P, 8);
  };
  mesh3(PRANG, prang(80, 22), prangMat, [0, 0, 0], { cast: false });
  for (const [x, z, s] of [[-55, 10, .5], [55, 10, .5], [-30, -25, .42], [30, -25, .42]]) mesh3(PRANG, prang(80 * s, 22 * s), prangMat, [x, 0, z], { cast: false });
  mesh3(PRANG, new THREE.BoxGeometry(150, 6, 60), prangMat, [0, 3, 0], { cast: false });
  glow3(PRANG, [0, 20, 30], 140, '#FFB060', .12); const PSPOT = [];
  // floodlights at the foot: warm, strong low down, falling off up the tower
  for (const [x, z] of [[-30, 45], [30, 45], [0, 55], [-60, 20], [60, 20]]) { const l = new THREE.SpotLight('#FFB060', 9000, 160, .55, .6, 1.6); l.position.set(x, 2, z); l.target.position.set(x * .3, 40, 0); PRANG.add(l, l.target); PSPOT.push(l); }
  const bankL = [], rb = lcg(5); for (let i = 0; i < 900; i++) { const x = (rb() - .5) * 1800; bankL.push([x, 2 + rb() * 8, -560 - rb() * 60, 1.4, rb() < .2 ? '#F4ECE0' : STREET[(rb() * 4) | 0], 1]); }
  const BANKL = lights3(THAI, bankL, { min: 1.2 });

  // ================= kashi: Dev Deepawali =================
  const KASHI = new THREE.Group(); S.add(KASHI);
  const GZ = -46, NS = 26, SH = .42, SD = 1.15;   // the steps start at z = GZ and climb away from the camera
  const ghatM = stone3({ col: '#B89068', rows: 2, cols: 14, seed: 6, rep: [60, 1], bumpK: 1.2, rough: .9 });
  for (let i = 0; i < NS; i++) block3(KASHI, 520, (i + 1) * SH + 2, SD + (i === NS - 1 ? 60 : 0), ghatM, [0, -2, GZ - i * SD - (SD + (i === NS - 1 ? 60 : 0)) / 2], { cast: false });
  const stepY = (i) => (i + 1) * SH, stepZ = (i) => GZ - i * SD;
  const TOPY = stepY(NS - 1), TOPZ = stepZ(NS - 1) - 2;
  // the palaces along the top: blocks of ochre, pink and cream with lit windows, chhatris, shikharas
  const winTex = tex3('omWin', 128, 256, (g, w, h) => { g.fillStyle = '#000'; g.fillRect(0, 0, w, h); const r = lcg(3); for (let y = 40; y < h - 20; y += 70) for (let x = 14; x < w - 14; x += 38) { if (r() < .55) continue; g.fillStyle = `rgba(255,${160 + r() * 50 | 0},${70 + r() * 40 | 0},${.35 + r() * .45})`; g.beginPath(); g.moveTo(x, y + 26); g.lineTo(x, y + 8); g.arc(x + 6, y + 8, 6, Math.PI, 0); g.lineTo(x + 12, y + 26); g.fill(); } });
  const PAL_COLS = ['#B88A62', '#C8A07A', '#A8766A', '#CDB08A', '#A87450', '#BC9282'];
  const rpk = lcg(29), LAMPK = [];
  for (let x = -260; x < 260;) {
    const w = 12 + rpk() * 20, h = 7 + rpk() * 13, d = 16, col = PAL_COLS[(rpk() * PAL_COLS.length) | 0];
    const m = new THREE.MeshStandardMaterial({ color: col, roughness: .9, emissive: '#FFFFFF', emissiveMap: winTex.rep(w / 9, h / 12), emissiveIntensity: .35 });
    const bz = TOPZ - d / 2 - rpk() * 6;
    block3(KASHI, w - 1, h, d, m, [x + w / 2, TOPY, bz], { cast: false });
    block3(KASHI, w - .2, .6, d + .8, m, [x + w / 2, TOPY + h, bz], { cast: false });
    for (let y = TOPY + 3.5; y < TOPY + h - 1; y += 4) block3(KASHI, w - .6, .25, d + .5, m, [x + w / 2, y, bz], { cast: false });
    if (rpk() < .5) { const w2 = w * (.4 + rpk() * .3); block3(KASHI, w2, 3 + rpk() * 4, d * .6, m, [x + w / 2 + (rpk() - .5) * (w - w2), TOPY + h + .6, bz - d * .15], { cast: false }); }
    // jharokhas: little balconies with domed tops on the front
    for (let jx = x + 3; jx < x + w - 3; jx += 6 + rpk() * 4) if (rpk() < .5) { const jy = TOPY + 3 + rpk() * (h - 6); block3(KASHI, 1.8, 1.6, .9, m, [jx, jy, bz + d / 2 + .3], { cast: false }); mesh3(KASHI, new THREE.SphereGeometry(.9, 10, 6, 0, TAU, 0, Math.PI / 2), m, [jx, jy + 1.6, bz + d / 2 + .3], { cast: false }); }
    // a parapet of lamps
    if (rpk() < .7) for (let k = 0; k < w; k += .6) LAMPK.push([x + k, TOPY + h + .1, TOPZ - 1 - rpk() * .4, .22, LAMP[(rpk() * 4) | 0], 1.2]);
    // a chhatri on the corner
    if (rpk() < .45) { const cx = x + 2, cz = TOPZ - 2, cy = TOPY + h; for (const [dx, dz] of [[-1.3, -1.3], [1.3, -1.3], [-1.3, 1.3], [1.3, 1.3]]) mesh3(KASHI, new THREE.CylinderGeometry(.12, .12, 2.4, 6), m, [cx + dx, cy + 1.2, cz + dz], { cast: false }); mesh3(KASHI, new THREE.SphereGeometry(1.9, 14, 8, 0, TAU, 0, Math.PI / 2), m, [cx, cy + 2.4, cz], { cast: false }); }
    // a shikhara behind
    if (rpk() < .55) { const sh = lathe3([[3.6, 0], [3.4, 3], [2.8, 7], [1.8, 10.5], [.8, 12.5], [.9, 13], [.2, 13.6], [.12, 15], [0, 15.2]], 12); mesh3(KASHI, sh, m, [x + w / 2, TOPY + h, TOPZ - d - 4], { cast: false }); LAMPK.push([x + w / 2, TOPY + h + 15.4, TOPZ - d - 4, .5, '#FFD080', 1.6]); }
    x += w;
  }
  // the lamps on the steps: rows along each step's edge, some gaps, denser low down
  const rd = lcg(97);
  for (let i = 0; i < NS; i++) {
    if (i % 3 === 2 && rd() < .5) continue;
    for (let x = -255; x <= 255; x += .42 + rd() * .08) { if (rd() < .1 + i * .01) continue; LAMPK.push([x, stepY(i) + .06, stepZ(i) - .12 - rd() * .1, .16, LAMP[(rd() * 4) | 0], 1.25]); }
  }
  const LK = lights3(KASHI, LAMPK, { min: 1.15 });
  // warm light from the lamps over the stone (no shadows)
  const KPOOL = []; for (let x = -150; x <= 150; x += 50) { const l = new THREE.PointLight('#FF9A48', 0, 45, 1.3); l.position.set(x, 5, GZ - 6); KASHI.add(l); KPOOL.push(l); }
  for (let x = -175; x <= 175; x += 35) { const l = new THREE.PointLight('#FFAA60', 0, 40, 1.2); l.position.set(x, TOPY + 1.5, TOPZ + 6); KASHI.add(l); KPOOL.push(l); }
  const KBOATS = [[-14, -16, .3], [10, -22, -.2], [-30, -30, .1], [28, -12, -.4], [3, -36, .05], [-48, -20, .2]].map(([x, z, y], i) => boat3(KASHI, [x, 0, z], y, i + 1));
  // floating diyas on the river
  const KF = []; { const r = lcg(13); for (let i = 0; i < 40; i++) { const g = new THREE.Group(); g.position.set((r() - .5) * 40, 0, -4 - r() * 40); KASHI.add(g); mesh3(g, new THREE.CylinderGeometry(.08, .055, .02, 12), std3m('#4A6A2C', .8), [0, .01, 0], { cast: false }); KF.push({ g, f: flame3(g, [0, .03, 0], .45, { seed: i * 1.7 }), ph: r() * 6 }); } }

  // ================= boita: Boita Bandana before dawn =================
  const BOITA = new THREE.Group(); S.add(BOITA);
  const BTS = [], rbt = lcg(61);
  const BHERO = boita3(BOITA, 2, { light: true }); BHERO.position.set(.2, 0, -1.8); BHERO.rotation.y = .5; BTS.push(BHERO); BHERO.x0 = .2; BHERO.z0 = -1.8; BHERO.v = 0;
  for (let i = 0; i < 40; i++) { const z = -1.5 - Math.pow(rbt(), 1.3) * 60, x = (rbt() - .5) * (5 + -z * 1.1); if (Math.hypot(x - .2, z + 1.8) < .7) continue; const b = boita3(BOITA, 3 + i); b.position.set(x, 0, z); b.rotation.y = rbt() * 6; b.scale.setScalar(1 + -z * .01); b.x0 = x; b.z0 = z; b.v = .04 + rbt() * .06; BTS.push(b); }
  const MIST = []; { const r = lcg(7); for (let i = 0; i < 14; i++) MIST.push(puff3(BOITA, [(r() - .5) * 120, 1 + r() * 2, -15 - r() * 120], 20 + r() * 26, '#AEB8DC', .14)); }
  const bfar = [], rbf = lcg(31); for (let i = 0; i < 500; i++) { const z = -60 - rbf() * 400, x = (rbf() - .5) * (40 + -z); bfar.push([x, .2, z, .4, LAMP[(rbf() * 4) | 0], 1.3]); }
  const BFAR = lights3(BOITA, bfar, { min: 1.2 });

  // ---------- the reflection pass ----------
  const rcam = new THREE.PerspectiveCamera(), clip = [new THREE.Plane(V3(0, 1, 0), -.005)], noRefl = [water, dome, bank, ...MIST];
  function refl() {
    rcam.fov = CAM3.fov; rcam.aspect = CAM3.aspect; rcam.near = CAM3.near; rcam.far = CAM3.far; rcam.updateProjectionMatrix();
    const p = CAM3.position, f = V3(0, 0, -1).applyQuaternion(CAM3.quaternion), up = V3(0, 1, 0).applyQuaternion(CAM3.quaternion);
    rcam.position.set(p.x, -p.y, p.z); rcam.up.set(up.x, -up.y, up.z); rcam.lookAt(p.x + f.x, -p.y - f.y, p.z + f.z);
    const vis = noRefl.map(m => m.visible); noRefl.forEach(m => m.visible = false);
    const ca = GL3.getClearAlpha(), fogWas = S.fog; S.fog = null;
    GL3.clippingPlanes = clip; GL3.setRenderTarget(RT); GL3.setClearAlpha(0); GL3.clear(); GL3.render(S, rcam);
    GL3.clippingPlanes = []; GL3.setRenderTarget(null); GL3.setClearAlpha(ca); S.fog = fogWas;
    noRefl.forEach((m, i) => m.visible = vis[i]);
  }

  // ---------- one frame ----------
  // o: place ('thai' | 'kashi' | 'boita'), mood [a, b, k], moonAz / moonEl (degrees; az from -z toward +x), moonR (the
  //    disc's radius, degrees), lanterns (0..1), rise (how far the lanterns have climbed: 1 = live), kr (0..1, the
  //    krathong flames), lamps (0..1, Kashi), calm, exposure
  function set(t, o = {}) {
    const place = o.place || 'thai';
    const [a, b, k] = o.mood || [place === 'boita' ? 'predawn' : place], P = blend(a, b, k);
    const el = (o.moonEl ?? 14) * Math.PI / 180, az = (o.moonAz ?? 0) * Math.PI / 180;
    const md = V3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
    U.uZen.value.copy(P.zen); U.uMid.value.copy(P.mid); U.uHor.value.copy(P.hor); U.uSunCol.value.copy(P.sun); U.uCloud.value.copy(P.cloud);
    U.uSunDir.value.copy(md); U.uDisc.value.set(...P.disc); U.uSunR.value = (o.moonR ?? 1.7) * Math.PI / 180; U.uStars.value = P.stars; U.uTime.value = t; U.uHaloK.value = P.halo;
    UW.uDeep.value.copy(P.deep); UW.uFog.value.copy(P.fog); UW.uCalm.value = o.calm ?? 1;
    S.fog.color.copy(P.fog); S.fog.near = o.fogNear ?? 120; S.fog.far = o.fogFar ?? 1100;
    hemi.color.copy(P.hemiS); hemi.groundColor.copy(P.hemiG); hemi.intensity = P.hemiK * (o.hemi ?? 1);
    key.color.copy(P.key); key.intensity = P.keyK; key.position.copy(md).multiplyScalar(100); key.target.position.set(0, 0, 0);
    fill.intensity = P.fillK;
    THAI.visible = place === 'thai'; KASHI.visible = place === 'kashi'; BOITA.visible = place === 'boita';
    bank.visible = place !== 'kashi'; bank.material.color.set(place === 'boita' ? '#1C1E36' : '#0A0A18');
    if (place === 'thai') {
      const kr = o.kr ?? 1;
      HERO.position.y = .006 * Math.sin(t * 1.3); HERO.rotation.set(.02 * Math.sin(t * 1.1), .1 * t * .2 + (o.heroYaw ?? 0), .02 * Math.cos(t * .9)); HERO.flame.set(t, kr);
      if (o.heroAt) HERO.position.set(o.heroAt[0], HERO.position.y, o.heroAt[2]); else HERO.position.set(0, HERO.position.y, -2.2);
      KRS.forEach((g) => { g.position.set(g.x0 + t * g.v, .006 * Math.sin(t * 1.2 + g.ph), g.z0); g.rotation.x = .02 * Math.sin(t + g.ph); g.flame.set(t, kr); });
      KLIGHT.forEach((l, i) => l.intensity = 1.2 * kr * (.85 + .15 * Math.sin(t * 7 + i)));
      FARK.set(t, kr); BANKL.set(t, 1);
      const lk = o.lanterns ?? 1; LAN.visible = lk > .01; LANG.set(t, lk); LAN.material.opacity = lk; placeLanterns(t, o.rise ?? 1, lk);
      PRANG.visible = o.prang !== false; PSPOT.forEach(l => l.intensity = 9000 * (o.prangK ?? 1));
    } else if (place === 'kashi') {
      const lm = o.lamps ?? 1; LK.set(t, lm); KPOOL.forEach((l, i) => l.intensity = 95 * lm * (.9 + .1 * Math.sin(t * 5 + i)));
      KBOATS.forEach((b, i) => { b.position.y = .03 * Math.sin(t * 1.1 + i); b.rotation.z = .015 * Math.sin(t * .9 + i * 2); b.lamp.set(t, lm); });
      KF.forEach((d) => { d.g.position.x += 0; d.g.position.y = .004 * Math.sin(t * 1.5 + d.ph); d.f.set(t, lm); });
    } else {
      BTS.forEach((g) => { g.position.set(g.x0 + t * g.v, .006 * Math.sin(t * 1.2 + g.ph), g.z0 - t * g.v * .2); g.rotation.z = .03 * Math.sin(t * 1.4 + g.ph); g.flame.set(t, o.kr ?? 1); });
      BFAR.set(t, .8); MIST.forEach((m, i) => m.material.opacity = (o.mist ?? .5) * .3 * (.7 + .3 * Math.sin(t * .3 + i)));
    }
    return (o.exposure ?? 1) * P.exp;
  }
  return { S, set, refl, HERO, KRS, PRANG, BHERO, LAN, lanD, TOPY, GZ, KASHI, THAI, BOITA, md: () => U.uSunDir.value.clone() };
})();

// ======================================================================================================
// MP: the Bay of Bengal, from Kashi to Bali
// ======================================================================================================
const SITE = {
  kashi: [83.0104, 25.3176], aruna: [79.0575, 12.2413], bangkok: [100.4925, 13.7437], chiangmai: [98.9853, 18.7883], sukhothai: [99.7034, 17.0186],
  ayutthaya: [100.5683, 14.3532], ayodhya: [82.1998, 26.7922], kanchi: [79.7036, 12.8342], angkor: [103.867, 13.4125], cuttack: [85.883, 20.4625],
  bali: [115.19, -8.41], java: [110.42, -7.0], sumatra: [104.75, -2.98],
};
const MP = (() => {
  const D = dem3('bay'), vex = 11, step = 2, [b0, b1, b2, b3] = [58.5, -10.5, 123.5, 39.5];
  const scene = new THREE.Scene(), skies = {};
  for (const k of ['space', 'night', 'dusk']) skies[k] = sky3(scene, IND_MOODS[k].sky, { r: 9000 });
  const hemi = new THREE.HemisphereLight('#FFFFFF', '#000000', 1); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#FFFFFF', 1); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -.0005; sun.shadow.normalBias = .4; scene.add(sun, sun.target);
  scene.fog = new THREE.Fog('#000000', 1000, 9000);
  const hy = e => e > 0 ? .02 + e / 10000 * vex : 0;
  const h = (x, z) => { const [lon, lat] = MAP3.ll(x, z); return hy(D.at(lon, lat)); };
  const i0 = Math.round((b0 - D.lon0) / D.res), i1 = Math.round((b2 - D.lon0) / D.res), j0 = Math.round((D.lat1 - b3) / D.res), j1 = Math.round((D.lat1 - b1) / D.res);
  const nx = Math.floor((i1 - i0) / step) + 1, nz = Math.floor((j1 - j0) / step) + 1;
  const pos = new Float32Array(nx * nz * 3), ae = new Float32Array(nx * nz);
  for (let b = 0; b < nz; b++) for (let a = 0; a < nx; a++) {
    const i = i0 + a * step, j = j0 + b * step, lon = D.lon0 + (i + .5) * D.res, lat = D.lat1 - (j + .5) * D.res, e = D.e[j * D.w + i], [x, z] = MAP3.xz(lon, lat), k = b * nx + a;
    pos[k * 3] = x; pos[k * 3 + 1] = hy(e); pos[k * 3 + 2] = z; ae[k] = e;
  }
  const idx = new Uint32Array((nx - 1) * (nz - 1) * 6); let q = 0;
  for (let b = 0; b < nz - 1; b++) for (let a = 0; a < nx - 1; a++) { const k = b * nx + a; idx[q++] = k; idx[q++] = k + nx; idx[q++] = k + 1; idx[q++] = k + 1; idx[q++] = k + nx; idx[q++] = k + nx + 1; }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('aE', new THREE.BufferAttribute(ae, 1)); geo.setIndex(new THREE.BufferAttribute(idx, 1)); geo.computeVertexNormals();
  const mat = indiaMat3({ sea: .72 }); mesh3(scene, geo, mat);
  { const ob = mat.onBeforeCompile; mat.onBeforeCompile = (sh) => { ob(sh); sh.fragmentShader = sh.fragmentShader.replace('#include <fog_fragment>', `#include <fog_fragment>
    { vec2 l2 = vec2(vW.x / (uMapCos * uMapK) + uMapLon, -vW.z / uMapK + uMapLat);
      float ek = max(max(smoothstep(31., 38.5, l2.y), smoothstep(-4., -10., l2.y)), max(smoothstep(67., 60., l2.x), smoothstep(115., 122.5, l2.x)));
      gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, ek); }`); }; }
  const far = mesh3(scene, new THREE.PlaneGeometry(40000, 40000), new THREE.MeshBasicMaterial({ color: '#14204A' }), [0, -.6, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const sg = new THREE.BufferGeometry(), sp = [], rs = lcg(23);
  for (let i = 0; i < 2600; i++) { const a = rs() * TAU, el = Math.asin(rs() * 2 - 1), R = 8500; sp.push(Math.cos(a) * Math.cos(el) * R, Math.sin(el) * R, Math.sin(a) * Math.cos(el) * R); }
  sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: '#FFFFFF', size: 2, sizeAttenuation: false, transparent: true, opacity: .9, fog: false, depthWrite: false })); scene.add(stars);
  const at = (lon, lat, lift = 0) => { const [x, z] = MAP3.xz(lon, lat); return [x, hy(D.at(lon, lat)) + lift, z]; };
  const atS = (k, lift = 0) => at(...SITE[k], lift);
  // outlines: India and Thailand
  const ring = (R, col) => { const l = line3(scene, R.map(([lon, lat]) => at(lon, lat, .3)), { col, closed: true, add: true, core: .7 }); return l; };
  const INDIA = ring(GEO.india.reduce((a, b) => (b.length > a.length ? b : a)), '#FFD27A'), THAI = ring(GEO.thai[0], '#FFD27A');
  // lamps over the land: thick round the festival sites, a scatter elsewhere (only on land)
  const pts = [], rl = lcg(114);
  const land = (lon, lat) => D.at(lon, lat) > 2;
  const cluster = (k, n, r) => { const [lo, la] = SITE[k]; for (let i = 0; i < n; i++) { const a = rl() * TAU, d = Math.pow(rl(), 1.5) * r, lon = lo + Math.cos(a) * d, lat = la + Math.sin(a) * d * .9; if (!land(lon, lat)) continue; const p = at(lon, lat, .15); pts.push([p[0], p[1], p[2], .8 + rl() * .8, LAMP[(rl() * 4) | 0], 1.6]); } };
  cluster('kashi', 900, 1.2); cluster('aruna', 700, 1); cluster('bangkok', 900, 1.1); cluster('chiangmai', 500, .8); cluster('sukhothai', 300, .7); cluster('cuttack', 500, .9); cluster('ayutthaya', 300, .5);
  for (let i = 0; i < 9000; i++) { const lon = 72 + rl() * 48, lat = -9 + rl() * 39; if (!land(lon, lat) || D.at(lon, lat) > 2500) continue; const p = at(lon, lat, .15); pts.push([p[0], p[1], p[2], .5 + rl() * .5, LAMP[(rl() * 4) | 0], 1.1]); }
  const LAMPS = lights3(scene, pts, { min: 1.1 });
  // beams at the sites
  const BEAM = {}; for (const [k, col] of [['kashi', '#FFD27A'], ['aruna', '#FF9A40'], ['bangkok', '#FFD27A'], ['chiangmai', '#FFE2A0'], ['cuttack', '#FFC870']]) BEAM[k] = pillar3(scene, atS(k), { h: 60, r: 1.4, col });
  // lines: a curve through lon/lat points over the sea (flat), or a lifted arc between two sites
  const curve = (LL, lift = .4, n = 12) => { const P = through(LL.map(([a, b]) => [a, b]), n); return P.map(([lon, lat]) => at(lon, lat, lift)); };
  const arc = (a, b, hk = .18, n = 80) => { const A = at(...a, .3), B = at(...b, .3), L = Math.hypot(B[0] - A[0], B[2] - A[2]), P = []; for (let i = 0; i <= n; i++) { const u = i / n; P.push([lerp(A[0], B[0], u), lerp(A[1], B[1], u) + Math.sin(Math.PI * u) * L * hk, lerp(A[2], B[2], u)]); } return P; };
  const ROUTE = {
    java: curve([[86.8, 20.0], [88.5, 16.5], [91.5, 12], [95.5, 7.8], [98.2, 5.4], [100.6, 3.0], [103.4, 1.25], [105.6, -2.2], [107.6, -5.2], [110.4, -6.55], [113.2, -6.85], [115.0, -8.0]]),
    sumatra: curve([[104.2, -.8], [104.9, -2.2]]),
    ka: arc(SITE.kanchi, SITE.angkor, .14), ka2: arc(SITE.angkor, SITE.sukhothai, .22),
    far: arc(SITE.kashi, SITE.bangkok, .16), ayo: arc(SITE.ayodhya, SITE.ayutthaya, .16),
  };
  const LINES = {};
  for (const k in ROUTE) LINES[k] = line3(scene, ROUTE[k], { col: k === 'java' || k === 'sumatra' ? '#9AD8FF' : '#FFD27A', add: true, core: .6 });
  // boats along the sea route: sail icons (sprites), spaced, sailing
  const sailTex = tex3('omSail', 64, 64, (g) => { g.clearRect(0, 0, 64, 64); g.fillStyle = '#FFF4DC'; g.beginPath(); g.moveTo(30, 6); g.quadraticCurveTo(52, 30, 50, 46); g.lineTo(30, 46); g.closePath(); g.fill(); g.fillStyle = '#F4C46A'; g.beginPath(); g.moveTo(28, 12); g.quadraticCurveTo(14, 32, 12, 46); g.lineTo(28, 46); g.closePath(); g.fill(); g.fillStyle = '#8A5A2A'; g.beginPath(); g.moveTo(6, 48); g.lineTo(58, 48); g.lineTo(50, 58); g.lineTo(14, 58); g.closePath(); g.fill(); });
  const BOATS = []; for (let i = 0; i < 9; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: sailTex, transparent: true, depthTest: false, depthWrite: false, fog: false })); s.renderOrder = 8; scene.add(s); BOATS.push(s); }
  const along = (P, u) => { const n = P.length - 1, f = clamp(u) * n, i = Math.min(n - 1, Math.floor(f)), k = f - i; return [lerp(P[i][0], P[i + 1][0], k), lerp(P[i][1], P[i + 1][1], k), lerp(P[i][2], P[i + 1][2], k)]; };
  // the moon
  const moonS = new THREE.Sprite(new THREE.SpriteMaterial({ map: moonFullTex3(), transparent: true, depthWrite: false, fog: false })); scene.add(moonS);
  const mood = (name, mo = {}) => {
    const M = IND_MOODS[name];
    for (const k in skies) skies[k].visible = k === name;
    hemi.color.set(mo.hemiCol || M.hemi[0]); hemi.groundColor.set(M.hemi[1]); hemi.intensity = mo.hemi ?? M.hemi[2];
    sun.color.set(mo.sunCol || M.sun[0]); sun.intensity = mo.sun ?? M.sun[1];
    const d = V3(...(mo.sunAt || M.sun[2])).normalize(), c = mo.at || [150, 0, 100], ext = mo.shadow ?? 420;
    sun.target.position.set(...c); sun.position.set(c[0] + d.x * 1500, c[1] + d.y * 1500, c[2] + d.z * 1500);
    Object.assign(sun.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 100, far: 3500 }); sun.shadow.camera.updateProjectionMatrix();
    scene.fog.color.set(mo.fogCol || M.fog[0]); far.material.color.copy(scene.fog.color); scene.fog.near = mo.fogNear ?? M.fog[1]; scene.fog.far = mo.fogFar ?? M.fog[2];
    stars.visible = name !== 'dusk'; stars.material.opacity = mo.stars ?? .9;
    mat.userData.U.uFocus.value = mo.focus ?? 0; mat.userData.U.uEdge.value = 0;
    return mo.exposure ?? M.exposure;
  };
  // set(t, o): lamps (0..1), beams { kashi: on, ... }, lines { java: [on, w, a], ... }, boats (0..1 along the route,
  //   the fleet's progress; null hides), boatK (their size, px-ish), moon [dir [x, y, z], size] | null, outline (0..1)
  const set = (t, o = {}) => {
    LAMPS.set(t, o.lamps ?? 1);
    for (const k in BEAM) BEAM[k].set(t, o.beams?.[k] ?? 0);
    for (const k in LINES) { const v = o.lines?.[k]; if (v) LINES[k].set(...v); else LINES[k].set(0); }
    const ol = o.outline ?? 0, w = o.lineW ?? 1; INDIA.set(ol > 0 ? 1 : 0, w, ol * .7); THAI.set(ol > 0 ? 1 : 0, w, (o.thaiOutline ?? ol) * .9);
    BOATS.forEach((s, i) => {
      if (o.boats == null) { s.visible = false; return; }
      const u = o.boats - i * .07; s.visible = u > 0 && u < 1; if (!s.visible) return;
      const p = along(i % 3 === 2 ? ROUTE.java : ROUTE.java, u); s.position.set(p[0], p[1] + .6, p[2]);
      const dd = CAM3.position.distanceTo(s.position); s.scale.setScalar(dd * (o.boatK ?? .03)); s.material.opacity = Math.min(1, u * 8, (1 - u) * 8);
    });
    if (o.moon) { const [d, sz] = o.moon, v = V3(...d).normalize(); moonS.visible = true; moonS.position.copy(CAM3.position).addScaledVector(v, 8000); moonS.scale.setScalar(8000 * sz); } else moonS.visible = false;
  };
  return { scene, mood, set, at, atS, h, hy, LINES, ROUTE, BEAM, LAMPS, along, sun, hemi };
})();
