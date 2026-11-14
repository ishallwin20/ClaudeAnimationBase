// cine3d_fx.js: the 3D style's film look (load after cine3d.js; see 3D_GUIDE.md, "The film look").
//   Light: env3() lights a scene with a real HDRI (Poly Haven, CC0; packed by tools/hdri.mjs into src/data/hdri_*.js),
//   studioEnv3() with softboxes built in code (product shots: polished stone, brass, water). Metal and gloss need one
//   of these: with no environment there is nothing for them to reflect and they go dull.
//   Materials: pbr3() makes a scanned material (ambientCG, CC0; tools/pbr.mjs → src/data/pbr_*.js): colour, normal,
//   roughness, AO.
//   The lens: render3(c, scene, cam, { exposure, fx: { … } }) renders into an HDR buffer and runs a post chain: depth of
//   field (dof), HDR bloom (bloom), light shafts from a point (rays), chromatic fringe (ca), then tone mapping and a
//   colour grade (grade), before cine.js's own vignette, grain and captions. Without fx it is the old direct render.
//   In the world: shafts3() (sunbeams through water or a window), motes3() (dust or plankton that the lens blurs into
//   bokeh), caustics3() (light dancing on a sea floor), blob3() (a soft contact shadow under an object).

// ---------- the environment ----------
const PMREM3 = new THREE.PMREMGenerator(GL3), ENVS3 = new Map();
// an HDRI's light as a float equirect texture (decoded from the packed RGBE; rows flipped so the sky is up)
function hdriTex3(name) {
  const H3 = (window.HDRI3 || {})[name]; if (!H3) throw new Error('hdri ' + name + ': load src/data/hdri_' + name + '.js');
  const bin = atob(H3.light), z = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) z[i] = bin.charCodeAt(i);
  const e = pako.inflate(z), { w, h } = H3, f = new Float32Array(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const s = (y * w + x) * 4, d = ((h - 1 - y) * w + x) * 4, k = e[s + 3] ? Math.pow(2, e[s + 3] - 136) : 0;
    f[d] = e[s] * k; f[d + 1] = e[s + 1] * k; f[d + 2] = e[s + 2] * k; f[d + 3] = 1;
  }
  const t = new THREE.DataTexture(f, w, h, THREE.RGBAFormat, THREE.FloatType);
  t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.LinearSRGBColorSpace;
  t.magFilter = t.minFilter = THREE.LinearFilter; t.needsUpdate = true; return t;
}
// an image texture from a data URI, loaded before the first frame (cine.js waits for everything in PICS)
const IMGS3 = new Map();
function imgTex3(key, src, o = {}) {
  let img = IMGS3.get(key);
  if (!img) { img = new Image(); img.src = src; IMGS3.set(key, img); PICS['tex3_' + key] = img; }
  const t = new THREE.Texture(img); t.colorSpace = o.data ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = MAX_ANISO;
  if (img.complete && img.naturalWidth) t.needsUpdate = true; else img.addEventListener('load', () => { t.needsUpdate = true; });
  t.rep = (rx, ry = rx) => { t.repeat.set(rx, ry); return t; };
  return t;
}
// env3(scene, name, o): light the scene with an HDRI. o.k (intensity, 1), o.rot (turn the light round y, radians),
// o.bg: true also shows the sky behind (the packed tonemapped JPG if there is one, else the blurred light), o.bgK its
// brightness, o.blur (0..1, for the light as background). Call per shot: it only swaps textures.
function env3(scene, name, o = {}) {
  let E = ENVS3.get(name);
  if (!E) {
    const src = hdriTex3(name), H3 = HDRI3[name];
    E = { env: PMREM3.fromEquirectangular(src).texture, src, bg: H3.bg ? imgTex3('hdribg_' + name, H3.bg) : null };
    if (E.bg) { E.bg.mapping = THREE.EquirectangularReflectionMapping; E.bg.wrapT = THREE.ClampToEdgeWrapping; }
    ENVS3.set(name, E);
  }
  scene.environment = E.env; scene.environmentIntensity = o.k ?? 1; scene.environmentRotation.set(0, o.rot ?? 0, 0);
  if (o.bg) {
    scene.background = E.bg || E.src; scene.backgroundIntensity = o.bgK ?? 1; scene.backgroundBlurriness = E.bg ? 0 : (o.blur ?? 0);
    scene.backgroundRotation.set(0, o.rot ?? 0, 0);
  } else if (o.bg === false) scene.background = null;
  return E;
}
// studioEnv3(o): a photo studio built in code, for products: a dark room with softboxes (each [x, y, z, w, h, k], aimed
// at the centre), returned as an environment texture (scene.environment = studioEnv3()). o.boxes, o.room (its colour),
// o.floor (a warm bounce from below, 0..1).
function studioEnv3(o = {}) {
  const key = JSON.stringify(o); if (ENVS3.has(key)) return ENVS3.get(key);
  const S = new THREE.Scene();
  S.add(new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), new THREE.MeshBasicMaterial({ color: o.room || '#0C0B0E', side: THREE.BackSide })));
  const boxes = o.boxes || [[-6, 7, 5, 6, 4, 9], [7, 3, 2, 1.4, 8, 6], [0, 4, -8, 9, 2.4, 5], [0, 12, 0, 6, 6, 3]];
  for (const [x, y, z, w, h, k] of boxes) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * .97, k * .92), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); S.add(m);
  }
  if (o.floor) { const f = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshBasicMaterial({ color: new THREE.Color(o.floor * .5, o.floor * .32, o.floor * .18) })); f.rotation.x = -Math.PI / 2; f.position.y = -6; S.add(f); }
  const t = PMREM3.fromScene(S, .03).texture; ENVS3.set(key, t); return t;
}

// ---------- scanned materials ----------
// pbr3(name, o): a MeshStandardMaterial from src/data/pbr_<name>.js. o.rep [rx, ry] (tiles), o.tint, o.normalK (1),
// o.rough (a multiplier on the roughness map, 1), o.metal (0), o.ao (1), o.env (envMapIntensity, 1); any other three.js
// material fields pass through in o.mat.
function pbr3(name, o = {}) {
  const D = (window.PBR3DATA || {})[name]; if (!D) throw new Error('pbr ' + name + ': load src/data/pbr_' + name + '.js');
  const [rx, ry] = o.rep || [1, 1], T = (k, data) => D[k] ? imgTex3('pbr_' + name + '_' + k, D[k], { data }).rep(rx, ry) : null;
  const m = new THREE.MeshStandardMaterial({ map: T('map'), normalMap: T('normal', 1), roughnessMap: T('rough', 1), aoMap: T('ao', 1),
    roughness: o.rough ?? 1, metalness: o.metal ?? 0, color: o.tint || '#FFFFFF', aoMapIntensity: o.ao ?? 1, envMapIntensity: o.env ?? 1, ...(o.mat || {}) });
  m.normalScale.setScalar(o.normalK ?? 1);
  return m;
}

// ---------- the post chain ----------
const FX3 = (() => {
  const rt = (w, h, o = {}) => {
    const r = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, depthBuffer: !!o.depth, samples: o.samples || 0, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    if (o.depth) { r.depthTexture = new THREE.DepthTexture(w, h); r.depthTexture.type = THREE.FloatType; }
    return r;
  };
  const main = rt(W, H, { depth: true, samples: 4 }), dof = rt(W, H), half = rt(W / 2, H / 2), rays = rt(W / 2, H / 2);
  const mips = [...Array(6)].map((_, i) => rt(Math.max(2, W >> (i + 1)), Math.max(2, H >> (i + 1))));
  const ups = mips.map(m => rt(m.width, m.height));
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), quadScene = new THREE.Scene(), quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
  quad.frustumCulled = false; quadScene.add(quad);
  const VS = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }';
  const LIN = `uniform float near, far; float linZ(float d) { float z = d * 2. - 1.; return 2. * near * far / (far + near - z * (far - near)); }`;
  const mat = (fs, uniforms) => new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: fs, uniforms, depthTest: false, depthWrite: false, toneMapped: false });
  const pass = (m, target) => { quad.material = m; GL3.setRenderTarget(target); GL3.render(quadScene, quadCam); };

  // depth of field: a golden-angle gather of 72 taps; a sample counts if its own blur reaches the centre (a background
  // sample can't blur more than the centre does, so a sharp subject doesn't get a halo of background)
  const dofM = mat(`${LIN}
    uniform sampler2D tCol, tDep; uniform vec2 res; uniform float focus, aperture, maxC, nearK;
    varying vec2 vUv;
    float coc(float z) { float c = aperture * (1. - focus / z); c = c < 0. ? -c * nearK : c; return min(c, maxC); }
    float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(.06711056, .00583715)))); }
    void main() {
      float zc = linZ(texture2D(tDep, vUv).r), cc = coc(zc);
      vec3 acc = texture2D(tCol, vUv).rgb; if (!(dot(acc, vec3(1.)) < 6e4)) acc = vec3(0.); float ws = 1.;
      float rot = ign(gl_FragCoord.xy) * 6.2832;
      for (int i = 0; i < 72; i++) {
        float r = sqrt((float(i) + .5) / 72.) * maxC, a = float(i) * 2.39996 + rot;
        vec2 uv = vUv + vec2(cos(a), sin(a)) * r / res;
        float zs = linZ(texture2D(tDep, uv).r), cs = coc(zs);
        cs = zs > zc ? min(cs, cc) : cs;
        float w = clamp((cs - r + 1.) / 1.5, 0., 1.);
        vec3 s = texture2D(tCol, uv).rgb; if (!(dot(s, vec3(1.)) < 6e4)) s = vec3(0.);
        w *= 1. + .25 * min(dot(s, vec3(.3, .59, .11)), 6.);    // bright points bloom into bokeh discs
        acc += s * w; ws += w;
      }
      gl_FragColor = vec4(acc / ws, 1.);
    }`, { tCol: { value: null }, tDep: { value: null }, res: { value: new THREE.Vector2(W, H) }, focus: { value: 5 }, aperture: { value: 0 }, maxC: { value: 20 }, nearK: { value: 1 }, near: { value: .1 }, far: { value: 100 } });
  // bloom: a soft-knee threshold, then a 13-tap downsample chain and a tent upsample (the Call of Duty method)
  const preM = mat(`uniform sampler2D tSrc; uniform float thresh, knee; varying vec2 vUv;
    void main() { vec3 c = texture2D(tSrc, vUv).rgb; if (!(dot(c, vec3(1.)) < 6e4)) c = vec3(0.); c = min(c, vec3(256.)); float b = max(c.r, max(c.g, c.b)), s = clamp(b - thresh + knee, 0., 2. * knee); s = s * s / (4. * knee + 1e-4);
      gl_FragColor = vec4(c * max(s, b - thresh) / max(b, 1e-4), 1.); }`, { tSrc: { value: null }, thresh: { value: 1 }, knee: { value: .5 } });
  const downM = mat(`uniform sampler2D tSrc; uniform vec2 px; varying vec2 vUv;
    vec3 s(vec2 o) { return texture2D(tSrc, vUv + o * px).rgb; }
    void main() { vec3 c = s(vec2(0)) * .125 + (s(vec2(-1, -1)) + s(vec2(1, -1)) + s(vec2(-1, 1)) + s(vec2(1, 1))) * .125
      + (s(vec2(-2, 0)) + s(vec2(2, 0)) + s(vec2(0, -2)) + s(vec2(0, 2))) * .0625 + (s(vec2(-2, -2)) + s(vec2(2, -2)) + s(vec2(-2, 2)) + s(vec2(2, 2))) * .03125;
      gl_FragColor = vec4(c, 1.); }`, { tSrc: { value: null }, px: { value: new THREE.Vector2() } });
  const upM = mat(`uniform sampler2D tLow, tCur; uniform vec2 px; uniform float radius; varying vec2 vUv;
    vec3 s(vec2 o) { return texture2D(tLow, vUv + o * px * radius).rgb; }
    void main() { vec3 c = (s(vec2(-1, -1)) + s(vec2(1, -1)) + s(vec2(-1, 1)) + s(vec2(1, 1))) * .0625 + (s(vec2(-1, 0)) + s(vec2(1, 0)) + s(vec2(0, -1)) + s(vec2(0, 1))) * .125 + s(vec2(0)) * .25;
      gl_FragColor = vec4(c + texture2D(tCur, vUv).rgb, 1.); }`, { tLow: { value: null }, tCur: { value: null }, px: { value: new THREE.Vector2() }, radius: { value: 1 } });
  // light shafts: the bright, far parts of the frame smeared toward the light's point on screen (64 steps, decaying)
  const raysM = mat(`${LIN}
    uniform sampler2D tCol, tDep; uniform vec2 at; uniform float thresh, decay, len, minZ; varying vec2 vUv;
    void main() {
      vec2 d = (at - vUv) * len / 64.; vec2 uv = vUv; float w = 1.; vec3 acc = vec3(0);
      for (int i = 0; i < 64; i++) {
        vec3 c = texture2D(tCol, uv).rgb; float z = linZ(texture2D(tDep, uv).r);
        float b = max(dot(c, vec3(.3, .59, .11)) - thresh, 0.) * step(minZ, z);
        acc += c * b * w; w *= decay; uv += d;
      }
      gl_FragColor = vec4(acc / 64., 1.);
    }`, { tCol: { value: null }, tDep: { value: null }, at: { value: new THREE.Vector2(.5, .8) }, thresh: { value: .8 }, decay: { value: .97 }, len: { value: .9 }, minZ: { value: 0 }, near: { value: .1 }, far: { value: 100 } });
  // the final: the lens (chromatic fringe), bloom and shafts added, exposure, white balance, the tone curve (ACES or
  // Khronos neutral), then the grade in display space: contrast, saturation, lift / gamma / gain, a split tone
  const finM = mat(`
    uniform sampler2D tCol, tBloom, tRays; uniform float exposure, bloomK, raysK, ca, contrast, sat, toneN, splitK;
    uniform vec3 raysCol, wb, lift, gam, gain, shTint, hiTint; varying vec2 vUv;
    vec3 fxRRT(vec3 v) { vec3 a = v * (v + .0245786) - .000090537; vec3 b = v * (.983729 * v + .4329510) + .238081; return a / b; }
    vec3 fxAces(vec3 c) {
      const mat3 I = mat3(vec3(.59719, .07600, .02840), vec3(.35458, .90834, .13383), vec3(.04823, .01566, .83777));
      const mat3 O = mat3(vec3(1.60475, -.10208, -.00327), vec3(-.53108, 1.10813, -.07276), vec3(-.07367, -.00605, 1.07602));
      c = I * (c / .6); c = fxRRT(c); return clamp(O * c, 0., 1.); }
    vec3 fxNeutral(vec3 c) {
      float x = min(c.r, min(c.g, c.b)), off = x < .08 ? x - 6.25 * x * x : .04; c -= off;
      float peak = max(c.r, max(c.g, c.b)); if (peak < .76) return c;
      float d = .24, np = 1. - d * d / (peak + d - .76); c *= np / peak;
      float g = 1. - 1. / (.15 * (peak - np) + 1.); return mix(c, vec3(np), g); }
    vec3 fxSrgb(vec3 c) { c = clamp(c, 0., 1.); return mix(1.055 * pow(c, vec3(1. / 2.4)) - .055, c * 12.92, step(c, vec3(.0031308))); }
    void main() {
      vec2 o = (vUv - .5) * ca;
      vec3 c = vec3(texture2D(tCol, vUv + o).r, texture2D(tCol, vUv).g, texture2D(tCol, vUv - o).b);
      c += texture2D(tBloom, vUv).rgb * bloomK + texture2D(tRays, vUv).rgb * raysCol * raysK;
      c *= exposure * wb;
      c = toneN > .5 ? fxNeutral(c) : fxAces(c);
      c = fxSrgb(c);
      c = (c - .5) * contrast + .5;
      float l = dot(c, vec3(.2126, .7152, .0722));
      c = mix(vec3(l), c, sat);
      c += shTint * splitK * pow(1. - clamp(l, 0., 1.), 2.) + hiTint * splitK * pow(clamp(l, 0., 1.), 2.);
      c = pow(max(gain * (c + lift * (1. - c)), 0.), 1. / gam);
      gl_FragColor = vec4(c, 1.);
    }`, { tCol: { value: null }, tBloom: { value: null }, tRays: { value: null }, exposure: { value: 1 }, bloomK: { value: 0 }, raysK: { value: 0 }, raysCol: { value: new THREE.Color(1, 1, 1) },
    ca: { value: 0 }, contrast: { value: 1 }, sat: { value: 1 }, toneN: { value: 0 }, wb: { value: new THREE.Vector3(1, 1, 1) }, lift: { value: new THREE.Vector3() }, gam: { value: new THREE.Vector3(1, 1, 1) },
    gain: { value: new THREE.Vector3(1, 1, 1) }, shTint: { value: new THREE.Vector3() }, hiTint: { value: new THREE.Vector3() }, splitK: { value: 0 } });
  const black = rt(2, 2);
  GL3.setRenderTarget(black); GL3.setClearColor(0x000000, 1); GL3.clear(); GL3.setRenderTarget(null);
  const v3 = (a, d) => a == null ? d : Array.isArray(a) ? new THREE.Vector3(...a) : new THREE.Vector3(a, a, a);
  const tint = (col, k = 1) => { if (!col) return new THREE.Vector3(); const c = new THREE.Color(col); return new THREE.Vector3(c.r - .5, c.g - .5, c.b - .5).multiplyScalar(2 * k); };
  // white balance from a temperature shift (-1 cool … 1 warm) and a green-magenta tint
  const wbOf = (temp = 0, tn = 0) => new THREE.Vector3(1 + .18 * temp - .04 * tn, 1 + .06 * tn, 1 - .22 * temp - .04 * tn);

  function run(scene, cam, f, exposure) {
    const near = cam.near, far = cam.far;
    GL3.setRenderTarget(main); GL3.render(scene, cam);
    let col = main.texture;
    if (f.dof) {
      const D = f.dof;
      dofM.uniforms.tCol.value = main.texture; dofM.uniforms.tDep.value = main.depthTexture;
      dofM.uniforms.focus.value = D.focus ?? 5; dofM.uniforms.aperture.value = D.aperture ?? 8; dofM.uniforms.maxC.value = D.max ?? 22; dofM.uniforms.nearK.value = D.nearK ?? 1;
      dofM.uniforms.near.value = near; dofM.uniforms.far.value = far;
      pass(dofM, dof); col = dof.texture;
    }
    let bloomTex = black.texture;
    if (f.bloom) {
      const B = f.bloom;
      preM.uniforms.tSrc.value = col; preM.uniforms.thresh.value = B.thresh ?? 1; preM.uniforms.knee.value = B.knee ?? .6; pass(preM, mips[0]);
      for (let i = 1; i < mips.length; i++) { downM.uniforms.tSrc.value = mips[i - 1].texture; downM.uniforms.px.value.set(1 / mips[i - 1].width, 1 / mips[i - 1].height); pass(downM, mips[i]); }
      let low = mips[mips.length - 1].texture;
      for (let i = mips.length - 2; i >= 0; i--) {
        upM.uniforms.tLow.value = low; upM.uniforms.tCur.value = mips[i].texture; upM.uniforms.px.value.set(1 / mips[i + 1].width, 1 / mips[i + 1].height); upM.uniforms.radius.value = B.radius ?? 1;
        pass(upM, ups[i]); low = ups[i].texture;
      }
      bloomTex = low;
    }
    let raysTex = black.texture;
    if (f.rays) {
      const R = f.rays, at = R.screen || (() => { const v = (R.at.isVector3 ? R.at.clone() : V3(...R.at)).project(cam); return [(v.x + 1) / 2, (v.y + 1) / 2]; })();
      raysM.uniforms.tCol.value = col; raysM.uniforms.tDep.value = main.depthTexture; raysM.uniforms.at.value.set(at[0], at[1]);
      raysM.uniforms.thresh.value = R.thresh ?? .8; raysM.uniforms.decay.value = R.decay ?? .975; raysM.uniforms.len.value = R.len ?? .9; raysM.uniforms.minZ.value = R.minZ ?? 0;
      raysM.uniforms.near.value = near; raysM.uniforms.far.value = far;
      pass(raysM, rays); raysTex = rays.texture;
    }
    const G = f.grade || {}, U = finM.uniforms;
    U.tCol.value = col; U.tBloom.value = bloomTex; U.tRays.value = raysTex;
    U.exposure.value = exposure; U.bloomK.value = f.bloom ? (f.bloom.k ?? .25) : 0; U.raysK.value = f.rays ? (f.rays.k ?? 1) : 0; U.raysCol.value.set(f.rays?.col || '#FFFFFF');
    U.ca.value = f.ca ?? 0; U.toneN.value = f.tone === 'neutral' ? 1 : 0;
    U.contrast.value = G.contrast ?? 1; U.sat.value = G.sat ?? 1; U.wb.value = wbOf(G.temp, G.tint);
    U.lift.value = v3(G.lift, new THREE.Vector3()); U.gam.value = v3(G.gamma, new THREE.Vector3(1, 1, 1)); U.gain.value = v3(G.gain, new THREE.Vector3(1, 1, 1));
    U.shTint.value = tint(G.shadows); U.hiTint.value = tint(G.highlights); U.splitK.value = G.split ?? 0;
    pass(finM, null);
  }
  return { run, main };
})();

// ---------- in the world ----------
// shafts3(parent, o): sunbeams (through water, a window, a canopy): o.n beams hanging from y o.top, o.len long, spread
// over o.area [w, d] round o.at [x, z], each a soft open cone that sways; o.col, o.r [top, bottom] radius, o.seed.
// Returns the group; .set(t, k) sways them and sets their brightness.
function shafts3(parent, o = {}) {
  const g = new THREE.Group(); parent.add(g);
  const rnd = lcg(o.seed ?? 7), n = o.n ?? 10, [aw, ad] = o.area || [8, 8], [ax, az] = o.at || [0, 0], len = o.len ?? 10, top = o.top ?? 8;
  const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
    uniforms: { col: { value: new THREE.Color(o.col || '#BFE6FF') }, k: { value: 1 }, t: { value: 0 } },
    vertexShader: 'varying vec2 vUv; varying vec3 vN, vV; void main() { vUv = uv; vec4 p = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-p.xyz); gl_Position = projectionMatrix * p; }',
    fragmentShader: `uniform vec3 col; uniform float k, t; varying vec2 vUv; varying vec3 vN, vV;
      void main() { float edge = pow(abs(dot(vN, vV)), 2.5); float along = smoothstep(0., .25, vUv.y) * pow(vUv.y, .6);
        float flick = .75 + .25 * sin(vUv.x * 18. + t * 1.3) * sin(vUv.x * 7. - t * .7);
        gl_FragColor = vec4(col * edge * along * flick * k * .22, 1.); }` });
  const beams = [];
  for (let i = 0; i < n; i++) {
    const r0 = (o.r || [.25, .9])[0] * (.6 + rnd() * .8), r1 = (o.r || [.25, .9])[1] * (.6 + rnd() * .8);
    const b = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, len, 24, 1, true), m);
    b.geometry.translate(0, -len / 2, 0);
    const x = ax + (rnd() - .5) * aw, z = az + (rnd() - .5) * ad; b.position.set(x, top, z);
    b.userData = { x, z, ph: rnd() * TAU, tilt: (o.tilt ?? .12) * (.6 + rnd() * .8), dir: rnd() * TAU, k: .5 + rnd() * .7 };
    b.frustumCulled = false; g.add(b); beams.push(b);
  }
  g.set = (t, k = 1) => {
    g.visible = k > .001; m.uniforms.k.value = k; m.uniforms.t.value = t;
    for (const b of beams) { const u = b.userData, s = Math.sin(t * .35 + u.ph); b.rotation.set(u.tilt * Math.cos(u.dir) + .04 * s, 0, u.tilt * Math.sin(u.dir) + .04 * s); b.scale.set(1, 1, 1); b.material = m; }
  };
  return g;
}
// motes3(parent, o): floating specks (dust in a sunbeam, plankton in the sea) in the box o.box [x0, y0, z0, x1, y1, z1];
// o.n, o.size (world units), o.col, o.drift [x, y, z] metres a second (they wrap round the box), o.seed. They write depth,
// so the lens blurs the near and far ones into bokeh. .set(t, a).
function motes3(parent, o = {}) {
  const n = o.n ?? 400, [x0, y0, z0, x1, y1, z1] = o.box || [-5, 0, -5, 5, 5, 5], rnd = lcg(o.seed ?? 11);
  const base = new Float32Array(n * 3), pos = new Float32Array(n * 3), sz = new Float32Array(n);
  for (let i = 0; i < n; i++) { base[i * 3] = rnd(); base[i * 3 + 1] = rnd(); base[i * 3 + 2] = rnd(); sz[i] = .5 + rnd(); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('sz', new THREE.BufferAttribute(sz, 1));
  const m = new THREE.ShaderMaterial({ transparent: false, depthWrite: true, fog: false,
    uniforms: { col: { value: new THREE.Color(o.col || '#FFF2D8') }, a: { value: 1 }, size: { value: (o.size ?? .02) * H } },
    vertexShader: 'attribute float sz; uniform float size; void main() { vec4 p = modelViewMatrix * vec4(position, 1.); gl_PointSize = size * sz / -p.z * projectionMatrix[1][1]; gl_Position = projectionMatrix * p; }',
    fragmentShader: 'uniform vec3 col; uniform float a; void main() { vec2 d = gl_PointCoord - .5; if (dot(d, d) > .25) discard; gl_FragColor = vec4(col * a, 1.); }' });
  const pts = new THREE.Points(geo, m); pts.frustumCulled = false; parent.add(pts);
  const [dx, dy, dz] = o.drift || [.02, .03, 0];
  pts.set = (t, a = 1) => {
    pts.visible = a > .001; m.uniforms.a.value = a;
    const w = (v, lo, hi) => lo + (((v % 1) + 1) % 1) * (hi - lo);
    for (let i = 0; i < n; i++) {
      const s = Math.sin(t * .6 + i) * .004;
      pos[i * 3] = w(base[i * 3] + (dx * t) / (x1 - x0) + s, x0, x1); pos[i * 3 + 1] = w(base[i * 3 + 1] + (dy * t) / (y1 - y0), y0, y1); pos[i * 3 + 2] = w(base[i * 3 + 2] + (dz * t) / (z1 - z0) + s, z0, z1);
    }
    geo.attributes.position.needsUpdate = true;
  };
  pts.set(0, 1); return pts;
}
// caustics3(parent, w, d, pos, o): sunlight focused by waves, dancing on a sea floor: an additive sheet just above the
// ground (o.y lifts it), its pattern in world units (o.scale, metres a cell), o.col, o.k, o.speed. .set(t, k).
function caustics3(parent, w, d, pos, o = {}) {
  const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
    uniforms: { t: { value: 0 }, k: { value: 1 }, col: { value: new THREE.Color(o.col || '#BFF4FF') }, sc: { value: 1 / (o.scale ?? 1.2) } },
    vertexShader: 'varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform float t, k, sc; uniform vec3 col; varying vec3 vW;
      // the tileable water caustic (after Dave Hoskins / joltz0r): five warped iterations, sharpened
      float caus(vec2 uv, float tt) {
        vec2 p = mod(uv * 6.2832, 6.2832) - 250., i = p; float c = 1., inten = .005;
        for (int n = 0; n < 5; n++) { float q = tt * (1. - 3.5 / float(n + 1)); i = p + vec2(cos(q - i.x) + sin(q + i.y), sin(q - i.y) + cos(q + i.x));
          c += 1. / length(vec2(p.x / (sin(i.x + q) / inten), p.y / (cos(i.y + q) / inten))); }
        c /= 5.; c = 1.17 - pow(min(c, 4.), 1.4); return min(pow(abs(c), 8.), 4.); }
      void main() { vec2 p = vW.xz * sc;
        float c = caus(p * .5, t * .5); c = max(c - .08, 0.) * 1.6;
        float fade = exp(-length(vW - cameraPosition) * .07);
        gl_FragColor = vec4(col * c * k * fade, 1.); }` });
  const sh = mesh3(parent, new THREE.PlaneGeometry(w, d), m, [pos[0], pos[1] + (o.y ?? .02), pos[2]], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false });
  sh.set = (t, k = 1) => { sh.visible = k > .001; m.uniforms.t.value = t * (o.speed ?? 1); m.uniforms.k.value = k; };
  return sh;
}
// blob3(parent, pos, r, a): a soft contact shadow on the ground under an object (a dark radial gradient, multiplied)
const blobTex3 = () => tex3('blob', 128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(.45, 'rgba(0,0,0,.6)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
function blob3(parent, pos, r = .5, a = .6) {
  const m = mesh3(parent, new THREE.PlaneGeometry(r * 2, r * 2), new THREE.MeshBasicMaterial({ map: blobTex3(), transparent: true, opacity: a, depthWrite: false, color: '#000000', blending: THREE.NormalBlending }),
    [pos[0], pos[1] + .003, pos[2]], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false });
  m.material.map.colorSpace = THREE.NoColorSpace; return m;
}
