// alive_sets.js: the 3D world of "Is HANUMAN alive?" (ad 84): the Himalaya at night, as Valmiki places it (Yuddha 74):
// the mountain of herbs standing between Kailasa and the golden Rishabha, blazing with herbs. Built once at load:
//   const HM = himalaya3();   HM.scene, HM.h(x, z), HM.peak (the herb mountain's top, a group that tears loose: move and
//   turn it), HM.mood(o) → exposure, HM.set(t, o): herbs (0..1 lit), hide (0..1, the herbs going dark from the top
//   down), clouds, tear (seconds since the peak tore loose: rocks and dust fall from it), fire (the glowing wound).
// Units: 1 ≈ 100 m; y up; the camera looks north (-z) from the south. Needs cine3d.js, cine3d_kailash.js (its noise and
// terrain shader).
const AL = { cut: 6.6, R: 11.5, H: 15.5 };
const alCut = (x, z) => AL.cut + .9 * (kFbm(x * .28 + 4, z * .28 - 2) - .5);
function alRaw(x, z) {
  const r = Math.hypot(x, z);
  let h = 1.0 + 2.4 * kFbm(x * .045 + 3, z * .045 - 7) + 2.2 * kRidge(x * .03 + 1, z * .03) * seg(r, 16, 60);
  h += seg(r, 80, 420) * (5 + 30 * kRidge(x * .006 + 5, z * .006 + 2));
  const pk = (cx, cz, Hh, R, sharp, sd) => {
    const dx = x - cx, dz = z - cz; if (Math.hypot(dx, dz) > R * 1.9) return 0;
    const wx = dx + 2.6 * (kFbm(x * .11 + sd, z * .11) - .5) * 2, wz = dz + 2.6 * (kFbm(x * .11 - 7, z * .11 + sd) - .5) * 2;
    const ang = Math.atan2(wz, wx), sp = .5 + .5 * Math.cos(ang * 5 + sd + 2.5 * kFbm(x * .06 + sd, z * .06));
    const d = Math.hypot(wx, wz) / (R * (.7 + .42 * sp)), n = kRidge(x * .1 + sd, z * .1 - sd, 5), b = Math.pow(clamp(1 - d / 1.5), sharp);
    return Hh * b * (.66 + .62 * n * (1 - b * .45));
  };
  h += pk(0, 0, AL.H, 13, 2.1, 0);            // the mountain of herbs
  h += pk(-19, -52, 30, 21, 1.5, 9);          // Kailasa
  h += pk(21, -58, 27, 17, 2.3, 21);          // Rishabha
  h += pk(-44, -20, 13, 16, 2, 5) + pk(46, -12, 12, 15, 2.2, 13) + pk(-30, 34, 8, 14, 2, 31) + pk(34, 40, 7, 13, 2, 37);
  return h;
}
const alIn = (x, z) => Math.hypot(x, z) < AL.R;
// the ground with the peak gone: a raw, shallow bowl where it stood
function alBase(x, z) { const h = alRaw(x, z); if (!alIn(x, z)) return h; const c = alCut(x, z); return h > c ? c - .12 - .5 * clamp((h - c) / 3) : h; }

function polarGeo(R, NA, fy, keep) {
  const NR = R.length, pos = new Float32Array((1 + (NR - 1) * NA) * 3);
  pos.set([0, fy(0, 0), 0], 0); let k = 3;
  for (let i = 1; i < NR; i++) for (let j = 0; j < NA; j++) { const a = j / NA * TAU, x = Math.cos(a) * R[i], z = Math.sin(a) * R[i]; pos[k++] = x; pos[k++] = fy(x, z); pos[k++] = z; }
  const idx = [], at = (i, j) => 1 + (i - 1) * NA + (j % NA), ok = (...v) => !keep || v.some(q => keep(pos[q * 3], pos[q * 3 + 2]));
  for (let j = 0; j < NA; j++) if (ok(0, at(1, j))) idx.push(0, at(1, j + 1), at(1, j));
  for (let i = 1; i < NR - 1; i++) for (let j = 0; j < NA; j++) { const a = at(i, j), b = at(i, j + 1), c = at(i + 1, j), d = at(i + 1, j + 1); if (ok(a, b, c, d)) idx.push(a, b, c, b, d, c); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(new THREE.BufferAttribute(new Uint32Array(idx), 1));
  g.computeVertexNormals(); return g;
}
const moonTexA = () => tex3('almoon', 512, 512, (g) => {
  const gr = g.createRadialGradient(236, 226, 20, 256, 256, 250); gr.addColorStop(0, '#FFFDF2'); gr.addColorStop(.7, '#F4EAD0'); gr.addColorStop(1, '#D8C8A8');
  g.fillStyle = gr; g.beginPath(); g.arc(256, 256, 248, 0, TAU); g.fill();
  g.save(); g.beginPath(); g.arc(256, 256, 248, 0, TAU); g.clip(); g.filter = 'blur(14px)'; const r = lcg(17);
  for (const [x, y, rr, a] of [[190, 170, 70, .16], [300, 150, 50, .12], [330, 250, 80, .14], [210, 300, 60, .1], [150, 240, 40, .1], [280, 350, 50, .09]]) { g.fillStyle = `rgba(120,110,120,${a})`; g.beginPath(); g.ellipse(x, y, rr, rr * (.7 + r() * .4), r() * 3, 0, TAU); g.fill(); }
  g.restore();
});
const CLOUD_FS = `
uniform float t, k, sc, seedv; uniform vec3 lit, shade, fogc; varying vec3 vW;
float h2(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
float n2(vec2 x){ vec2 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f); return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y); }
float fb(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 6; i++) { s += a * n2(p); p = p * 2.03 + 11.7; a *= .5; } return s; }
void main() {
  vec2 p = vW.xz * sc + seedv + vec2(t * .012, t * .004);
  float d = fb(p + .35 * vec2(fb(p * 1.7 + 3.), fb(p * 1.7 - 5.)));
  float a = smoothstep(.42, .72, d) * k;
  float d2 = fb(p + vec2(.06, -.05));
  vec3 col = mix(shade, lit, clamp((d - d2) * 9. + .45 + (d - .55) * 1.2, 0., 1.));
  float dist = length(vW - cameraPosition);
  col = mix(col, fogc, smoothstep(120., 900., dist));
  a *= 1. - smoothstep(700., 1300., length(vW.xz));
  a *= smoothstep(2., 14., dist);
  gl_FragColor = vec4(col, a);
}`;
function himalaya3() {
  const scene = new THREE.Scene();
  const dome = sky3(scene, [[1, '#02040E'], [.5, '#060C26'], [.16, '#14245A'], [.03, '#2C4484'], [0, '#3A5290'], [-1, '#070A18']], { r: 3000 });
  const hemi = new THREE.HemisphereLight('#5468B0', '#0A0A14', .5); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#B8CCFF', 2); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.bias = -.0004; sun.shadow.normalBias = .08; sun.shadow.radius = 3;
  Object.assign(sun.shadow.camera, { left: -70, right: 70, top: 70, bottom: -70, near: 50, far: 900 }); sun.shadow.camera.updateProjectionMatrix();
  scene.add(sun, sun.target);
  scene.fog = new THREE.Fog('#16265A', 60, 900);
  // the ground
  const R = []; for (let r = 0; r <= 46; r += .16) R.push(r); for (let r = 46 * 1.02; r < 1500; r *= 1.02) R.push(r);
  const mat = terrainMat3({ snow: 10.5, cap: 40, band: 1.5 });
  const ground = mesh3(scene, polarGeo(R, 600, alBase), mat);
  // the peak: its top (the mountain's own surface above the cut) and its torn underside, in a group at the cut's height
  const peak = new THREE.Group(); peak.position.set(0, AL.cut, 0); scene.add(peak);
  const RP = []; for (let r = 0; r <= AL.R; r += .1) RP.push(r);
  const topY = (x, z) => Math.max(alRaw(x, z), alCut(x, z)) - AL.cut, above = (x, z) => alRaw(x, z) > alCut(x, z) + .03;
  const top = mesh3(peak, polarGeo(RP, 360, topY, above), mat);
  const underY = (x, z) => { const d = Math.max(0, alRaw(x, z) - alCut(x, z)); return alCut(x, z) - AL.cut - Math.min(5.5, d * .62 * (.6 + .9 * kFbm(x * .5, z * .5))) - .9 * kRidge(x * .4, z * .4, 3) * clamp(d); };
  const ug = polarGeo(RP, 240, underY, above); { const ix = ug.index.array; for (let i = 0; i < ix.length; i += 3) { const s = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = s; } ug.computeVertexNormals(); }
  const umat = terrainMat3({ snow: 99, cap: 99, bump: 2.2 }); umat.color.set('#B89878');
  const under = mesh3(peak, ug, umat);
  // the herbs: thousands of little lights on the peak
  const hp = [], hs = [], hr = [], rr = lcg(41); let n = 0;
  while (n < 3400) {
    const a = rr() * TAU, r = Math.sqrt(rr()) * AL.R * .92, x = Math.cos(a) * r, z = Math.sin(a) * r, h = alRaw(x, z);
    if (h < alCut(x, z) + .25) continue;
    hp.push(x, h - AL.cut + .06, z); hs.push(.5 + rr() * rr() * 2.2); hr.push(rr(), (h - AL.cut) / (AL.H - AL.cut) + (rr() - .5) * .25, rr()); n++;
  }
  const hg = new THREE.BufferGeometry(); hg.setAttribute('position', new THREE.Float32BufferAttribute(hp, 3)); hg.setAttribute('sz', new THREE.Float32BufferAttribute(hs, 1)); hg.setAttribute('rnd', new THREE.Float32BufferAttribute(hr, 3));
  const hm = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { t: { value: 0 }, k: { value: 1 }, hide: { value: 0 }, size: { value: .28 * H } },
    vertexShader: `attribute float sz; attribute vec3 rnd; uniform float size, t, hide, k; varying float vA; varying vec3 vC;
      void main() { vec4 p = modelViewMatrix * vec4(position, 1.); float tw = .55 + .45 * sin(t * (1.5 + rnd.x * 3.) + rnd.z * 40.);
        float on = smoothstep(hide * 1.5 - .25, hide * 1.5 - .15, 1. - rnd.y); if (hide <= 0.) on = 1.;
        vA = k * on * tw; vC = mix(vec3(1., .78, .32), mix(vec3(.55, 1., .6), vec3(.8, .95, 1.), step(.75, rnd.x)), step(.45, rnd.x));
        gl_PointSize = size * sz * (.6 + .4 * tw) / -p.z * projectionMatrix[1][1]; gl_Position = projectionMatrix * p; }`,
    fragmentShader: `varying float vA; varying vec3 vC; void main() { vec2 d = gl_PointCoord - .5; float r = length(d) * 2.; float a = exp(-r * r * 5.) + .35 * exp(-r * r * 60.); gl_FragColor = vec4(vC * a * vA * 1.25, 1.); }` });
  const herbs = new THREE.Points(hg, hm); herbs.frustumCulled = false; peak.add(herbs);
  const hl1 = new THREE.PointLight('#FFD890', 0, 60, 1.2), hl2 = new THREE.PointLight('#9CFFB0', 0, 46, 1.3);
  hl1.position.set(0, 12, 9); hl2.position.set(-6, 5, 10); peak.add(hl1, hl2);
  const halo = glow3(peak, [0, 5, 0], 46, '#FFD27A', 0);
  // the wound: fire-gold light in the gap as it tears
  const fire = new THREE.PointLight('#FFB050', 0, 50, 1.4); fire.position.set(0, AL.cut + .5, 6); scene.add(fire);
  const fglow = glow3(scene, [0, AL.cut + .3, 0], 34, '#FFA040', 0);
  // rocks and dust falling from the torn peak
  const NRK = 260, rk = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: '#3A322E', roughness: 1, flatShading: true }), NRK), rkd = [], r2 = lcg(77);
  rk.castShadow = false; rk.frustumCulled = false; scene.add(rk);
  for (let i = 0; i < NRK; i++) { const a = r2() * TAU, r = (.3 + .7 * Math.sqrt(r2())) * 9; rkd.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, s: .07 + r2() * r2() * .5, t0: r2() * 3.2, vx: Math.cos(a) * (.5 + r2() * 2), vz: Math.sin(a) * (.5 + r2() * 2), sp: r2() * 6, ax: r2() * 3 }); }
  const dust = [], r3 = lcg(5);
  for (let i = 0; i < 22; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex3(), transparent: true, depthWrite: false, opacity: 0, color: '#9A8C80' })); const a = i / 22 * TAU + r3(); s.userData = { a, r: 6 + r3() * 5, w: 9 + r3() * 9, d: r3() * 1.2 }; scene.add(s); dust.push(s); }
  // the moon and the stars
  const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: moonTexA(), transparent: true, depthWrite: false, fog: false })); scene.add(moon);
  const mhalo = glow3(scene, [0, 0, 0], 100, '#8FA8FF', .5);
  const sg = new THREE.BufferGeometry(), sp = [], ss = [], rs = lcg(9);
  for (let i = 0; i < 2600; i++) { const a = rs() * TAU, e = Math.asin(.02 + rs() * .98), Rr = 2800; sp.push(Math.cos(a) * Math.cos(e) * Rr, Math.sin(e) * Rr, Math.sin(a) * Math.cos(e) * Rr); ss.push(.6 + rs() * rs() * 2.6); }
  sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); sg.setAttribute('sz', new THREE.Float32BufferAttribute(ss, 1));
  const sm = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { a: { value: 1 }, t: { value: 0 } },
    vertexShader: 'attribute float sz; uniform float t; varying float vA; void main() { vA = .6 + .4 * sin(t * 2. + position.x); gl_PointSize = sz * 2.2; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
    fragmentShader: 'uniform float a; varying float vA; void main() { vec2 d = gl_PointCoord - .5; float r = length(d) * 2.; gl_FragColor = vec4(vec3(.85, .9, 1.) * exp(-r * r * 4.) * a * vA, 1.); }' });
  const stars = new THREE.Points(sg, sm); stars.frustumCulled = false; stars.renderOrder = -.5; scene.add(stars);
  // the sea of cloud in the valleys
  const cl = [];
  [[2.7, .021, 0, 1], [3.5, .027, 40, .85], [4.4, .034, 90, .7], [5.6, .043, 150, .5]].forEach(([y, sc, sd, k], i) => {
    const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide,
      uniforms: { t: { value: 0 }, k: { value: k }, sc: { value: sc }, seedv: { value: sd }, lit: { value: new THREE.Color('#A8BCF0') }, shade: { value: new THREE.Color('#16224E') }, fogc: { value: new THREE.Color('#2A3E80') } },
      vertexShader: 'varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }', fragmentShader: CLOUD_FS });
    const p = mesh3(scene, new THREE.PlaneGeometry(3000, 3000), m, [0, y, 0], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false }); p.renderOrder = 10 + i; p.userData.k = k; cl.push(p);
  });
  const mood = (o = {}) => {
    const md = V3(...(o.moon || [.02, .3, -1])).normalize();
    moon.position.copy(md).multiplyScalar(2600); moon.scale.setScalar(o.moonSize ?? 540); mhalo.position.copy(moon.position); mhalo.scale.setScalar((o.moonSize ?? 540) * 3.4); mhalo.material.opacity = o.moonHalo ?? .5;
    moon.material.color.set(o.moonCol || '#FFFFFF'); moon.visible = mhalo.visible = o.moonOn !== false;
    const c = o.at || [0, 6, 0]; sun.target.position.set(...c); sun.position.set(c[0] + md.x * 400, c[1] + md.y * 400 + 60, c[2] + md.z * 400);
    sun.intensity = o.sun ?? 2.2; sun.color.set(o.sunCol || '#B8CCFF'); hemi.intensity = o.hemi ?? .55; hemi.color.set(o.hemiCol || '#5468B0');
    scene.fog.color.set(o.fog || '#16265A'); scene.fog.near = o.fogNear ?? 60; scene.fog.far = o.fogFar ?? 900;
    sm.uniforms.a.value = o.stars ?? 1;
    cl.forEach(p => { p.material.uniforms.lit.value.set(o.cloudLit || '#A8BCF0'); p.material.uniforms.shade.value.set(o.cloudShade || '#16224E'); p.material.uniforms.fogc.value.set(o.cloudFog || '#2A3E80'); });
    return o.exposure ?? 1.1;
  };
  const M4 = new THREE.Matrix4(), Q4 = new THREE.Quaternion(), E4 = new THREE.Euler(), S4 = V3(), P4 = V3();
  const set = (t, o = {}) => {
    const hk = o.herbs ?? 1, hide = o.hide ?? 0, lit = hk * (1 - clamp(hide * 1.15));
    hm.uniforms.t.value = t; hm.uniforms.k.value = hk; hm.uniforms.hide.value = hide; herbs.visible = hk > .001;
    hl1.intensity = 20 * lit * (o.herbLight ?? 1) * (.94 + .06 * Math.sin(t * 5)); hl2.intensity = 12 * lit * (o.herbLight ?? 1); halo.material.opacity = .16 * lit * (o.halo ?? 1);
    sm.uniforms.t.value = t;
    cl.forEach(p => { p.material.uniforms.t.value = t * (o.wind ?? 1); p.material.uniforms.k.value = p.userData.k * (o.clouds ?? 1); p.visible = (o.clouds ?? 1) > .01; });
    const f = o.fire ?? 0; fire.intensity = 260 * f * (.85 + .15 * Math.sin(t * 31)); fglow.material.opacity = .55 * f; fglow.scale.setScalar(30 + 8 * Math.sin(t * 17));
    const te = o.tear ?? -1;
    rkd.forEach((d, i) => {
      const u = te - d.t0;
      if (te < 0 || u < 0 || u > 5) { S4.setScalar(0); P4.set(0, -50, 0); }
      else { const y0 = peak.position.y - 1.2 - (u < .01 ? 0 : 0), y = AL.cut + (o.tearY0 ?? 0) + Math.max(0, (d.t0 / 3.2) * (o.tearRise ?? 8)) - 4.9 * .55 * u * u; P4.set(d.x + d.vx * u, y, d.z + d.vz * u); S4.setScalar(d.s * (y < alBase(P4.x, P4.z) - .5 ? 0 : 1)); E4.set(u * d.sp + d.ax, u * d.sp * .7, d.ax); Q4.setFromEuler(E4); }
      M4.compose(P4, Q4, S4); rk.setMatrixAt(i, M4);
    });
    rk.instanceMatrix.needsUpdate = true; rk.visible = te >= 0;
    dust.forEach(s => { const d = s.userData, u = te - d.d; const on = te >= 0 && u > 0; s.visible = on; if (!on) return; const g = 1 + u * .55; s.position.set(Math.cos(d.a) * d.r * g, AL.cut - .5 + u * .5, Math.sin(d.a) * d.r * g); s.scale.set(d.w * g, d.w * .5 * g, 1); s.material.opacity = (o.dust ?? .5) * clamp(u * 2) * clamp(1 - u / 7); });
  };
  return { scene, ground, peak, top, under, herbs, moon, sun, hemi, mood, set, h: alBase, hRaw: alRaw, clouds: cl };
}

// board3(parent, w, h, px): a camera-facing picture plane painted each frame from a 2D canvas (a 2D figure standing in
// the 3D world, fogged with it). .paint(draw(g, cw, ch)), .place(pos, cam) (turns to face the camera round y).
function board3(parent, w, h, cw = 1024, ch = 1536, o = {}) {
  const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const g = cv.getContext('2d');
  const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = MAX_ANISO;
  const m = mesh3(parent, new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tx, transparent: true, depthWrite: false, fog: o.fog ?? true, toneMapped: o.tone ?? false, side: THREE.DoubleSide }), [0, 0, 0], { cast: false, receive: false });
  m.renderOrder = o.order ?? 5; m.cv = cv;
  m.paint = (draw) => { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cw, ch); draw(g, cw, ch); tx.needsUpdate = true; };
  m.place = (pos, yaw = 0) => { m.position.set(...pos); m.rotation.set(0, yaw, 0); };
  return m;
}
