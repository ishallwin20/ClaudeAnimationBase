// cine3d.js: the 3D style's engine. three.js (src/vendor/three.min.js, a classic-script build that sets window.THREE)
// renders a lit 3D world; cine.js does everything else. A shot calls render3(c, scene, cam) to lay the 3D frame down,
// then draws on top with cine.js as usual: captions, POST, bloom, vignette, grain and rkCardCine stay cine.js's.
// Load after cine.js. A reel builds its scene graph once (at load), and every shot sets what moves (camera, lights,
// visibility, water, footprints) from t, so frames render in any order, like the other engines.
// See 3D_GUIDE.md.

// ---------- the renderer ----------
const GL3 = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
GL3.setPixelRatio(1); GL3.setSize(W, H, false);
GL3.shadowMap.enabled = true; GL3.shadowMap.type = THREE.PCFSoftShadowMap;
GL3.toneMapping = THREE.ACESFilmicToneMapping; GL3.outputColorSpace = THREE.SRGBColorSpace;
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const MAX_ANISO = GL3.capabilities.getMaxAnisotropy();
window.gpuInfo = () => { const gl = GL3.getContext(), e = gl.getExtension('WEBGL_debug_renderer_info'); return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); };

// render3(c, scene, cam, o): render the scene and lay it on the 2D canvas c (full frame, ignoring c's transform).
// o.exposure (tone-mapping exposure, 1), o.alpha; o.fx: the film look's post chain (src/cine3d_fx.js: depth of field,
// HDR bloom, light shafts, grade), else a direct render.
function render3(c, scene, cam, o = {}) {
  GL3.toneMappingExposure = o.exposure ?? 1;
  if (o.fx && typeof FX3 !== 'undefined') FX3.run(scene, cam, o.fx, o.exposure ?? 1);
  else { GL3.setRenderTarget(null); GL3.render(scene, cam); }
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = o.alpha ?? 1; c.drawImage(GL3.domElement, 0, 0, W, H); c.restore();
}

// ---------- the camera ----------
// cam3({ pos, at, fov, roll, up }): the one shared camera, placed for this frame. pos / at are [x, y, z] (metres; y up,
// north = -z, east = +x); key them with cine.js's kf(), which takes arrays. up: [x, y, z] for a camera looking straight
// down (default [0, 0, -1] when the view is near vertical, so north is up on screen). roll in radians.
const CAM3 = new THREE.PerspectiveCamera(40, W / H, .05, 600);
function cam3(o) {
  const [px, py, pz] = o.pos, [ax, ay, az] = o.at;
  CAM3.fov = o.fov ?? 40; CAM3.updateProjectionMatrix();
  CAM3.position.set(px, py, pz);
  const d = V3(ax - px, ay - py, az - pz).normalize();
  if (o.up) CAM3.up.set(...o.up); else if (Math.abs(d.y) > .97) CAM3.up.set(0, 0, -1); else CAM3.up.set(0, 1, 0);
  CAM3.lookAt(ax, ay, az);
  if (o.roll) CAM3.rotateZ(o.roll);
  return CAM3;
}
// where a world point lands on screen (px), for pinning 2D work (a caption arrow, a glow) to the 3D frame
function toScreen3(p) { const v = (p.isVector3 ? p.clone() : V3(...p)).project(CAM3); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H, v.z]; }

// ---------- meshes ----------
// mesh3(parent, geo, mat, pos, o): a mesh added to parent at pos; o.rot [x, y, z], o.scale, o.cast / o.receive
// (shadows, both true by default), o.name.
function mesh3(parent, geo, mat, pos = [0, 0, 0], o = {}) {
  const m = new THREE.Mesh(geo, mat); m.position.set(...pos);
  if (o.rot) m.rotation.set(...o.rot);
  if (o.scale != null) Array.isArray(o.scale) ? m.scale.set(...o.scale) : m.scale.setScalar(o.scale);
  m.castShadow = o.cast ?? true; m.receiveShadow = o.receive ?? true; if (o.name) m.name = o.name;
  parent.add(m); return m;
}
const box3 = (parent, w, h, d, mat, pos, o) => mesh3(parent, new THREE.BoxGeometry(w, h, d), mat, pos, o);
// a box sitting on y (its foot at pos[1])
const block3 = (parent, w, h, d, mat, [x, y, z], o) => mesh3(parent, new THREE.BoxGeometry(w, h, d), mat, [x, y + h / 2, z], o);
// lathe3(profile [[r, y], ...], segs): a turned shape (pots, lamps, the linga, the amalaka)
const lathe3 = (profile, segs = 48) => new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(Math.max(r, .0005), y)), segs);
// turn a curve of [r, y] points into a smooth one (Catmull-Rom from cine.js), n samples per span
const smooth3 = (P, n = 6) => through(P, n);

// ---------- textures ----------
// tex3(key, w, h, draw(g, w, h), o): a canvas texture, drawn once and cached. o.data: true for bump/roughness maps (no
// colour space). Every use gets a clone, so each mesh can set its own repeat: tex3(...).rep(rx, ry).
const TEX3 = new Map();
function tex3(key, w, h, draw, o = {}) {
  let t = TEX3.get(key);
  if (!t) {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h);
    t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = MAX_ANISO;
    t.colorSpace = o.data ? THREE.NoColorSpace : THREE.SRGBColorSpace; TEX3.set(key, t);
  }
  const c = t.clone(); c.needsUpdate = true; c.rep = (rx, ry = rx) => { c.repeat.set(rx, ry); return c; }; return c;
}
// Stone: granite speckle and mottling with mortar joints between courses of blocks (rows × cols a tile, staggered).
// Returns { map, bump } textures of the same layout. o: col, dark (the speckle), joint (the mortar), rows, cols, seed,
// speck (0..1), mottle (0..1).
function stoneTex(o = {}) {
  const key = 'stone' + JSON.stringify(o), S = 512, rows = o.rows ?? 4, cols = o.cols ?? 2, seed = o.seed ?? 1;
  const layout = (g, map) => {
    const rnd = lcg(seed), rh = S / rows;
    g.fillStyle = map ? (o.col || '#8A8178') : '#808080'; g.fillRect(0, 0, S, S);
    // blocks: each a slightly different tone (map) or height (bump)
    for (let r = 0; r < rows; r++) {
      const off = r % 2 ? S / cols / 2 : 0;
      for (let k = -1; k <= cols; k++) {
        const x = off + k * S / cols, v = (rnd() - .5);
        g.fillStyle = map ? rgba(v > 0 ? '#FFFFFF' : '#000000', Math.abs(v) * .16) : rgba(v > 0 ? '#FFFFFF' : '#000000', Math.abs(v) * .25);
        g.fillRect(x + 2, r * rh + 2, S / cols - 4, rh - 4);
      }
    }
    // mottling: big soft blots
    const rm = lcg(seed + 9);
    for (let i = 0; i < 70 * (o.mottle ?? 1); i++) {
      const x = rm() * S, y = rm() * S, rr = 20 + rm() * 70, gr = g.createRadialGradient(x, y, 0, x, y, rr), dk = rm() > .5;
      gr.addColorStop(0, rgba(dk ? '#000000' : '#FFFFFF', (map ? .07 : .05) * (o.mottle ?? 1))); gr.addColorStop(1, rgba(dk ? '#000000' : '#FFFFFF', 0));
      for (const [dx, dy] of [[0, 0], [S, 0], [-S, 0], [0, S], [0, -S]]) { g.save(); g.translate(dx, dy); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); g.restore(); }
    }
    // speckle
    const rs = lcg(seed + 3);
    for (let i = 0; i < 9000 * (o.speck ?? 1); i++) {
      const x = rs() * S, y = rs() * S, s = rs() < .9 ? 1 : 2, dk = rs() < .6;
      g.fillStyle = map ? (dk ? rgba(o.dark || '#2A2522', .35 + rs() * .4) : rgba('#F4EEE4', .18 + rs() * .25)) : (dk ? 'rgba(0,0,0,.35)' : 'rgba(255,255,255,.25)');
      g.fillRect(x, y, s, s);
    }
    // joints
    g.strokeStyle = map ? (o.joint || 'rgba(30,24,20,.75)') : '#202020'; g.lineWidth = map ? 3 : 5;
    for (let r = 0; r <= rows; r++) { g.beginPath(); g.moveTo(0, r * rh); g.lineTo(S, r * rh); g.stroke(); }
    for (let r = 0; r < rows; r++) { const off = r % 2 ? S / cols / 2 : 0; for (let k = 0; k <= cols; k++) { const x = (off + k * S / cols) % S; g.beginPath(); g.moveTo(x, r * rh); g.lineTo(x, (r + 1) * rh); g.stroke(); } }
    // chipped edges along the joints (bump only shows them)
    const rc = lcg(seed + 5);
    for (let i = 0; i < 160; i++) { g.fillStyle = map ? rgba('#000000', .12) : 'rgba(0,0,0,.4)'; const r = Math.floor(rc() * rows); g.beginPath(); g.arc(rc() * S, r * rh + (rc() < .5 ? 2 : rh - 2), 2 + rc() * 4, 0, TAU); g.fill(); }
  };
  return { map: tex3(key + 'm', S, S, g => layout(g, true)), bump: tex3(key + 'b', S, S, g => layout(g, false), { data: true }) };
}
// stone3(o): a stone material. o: the stoneTex options, rep [rx, ry] (tiles across the face), rough, bumpK, tint.
function stone3(o = {}) {
  const { rep, rough, bumpK, tint, ...tx } = o, t = stoneTex(tx), [rx, ry] = rep || [1, 1];
  return new THREE.MeshStandardMaterial({ map: t.map.rep(rx, ry), bumpMap: t.bump.rep(rx, ry), bumpScale: bumpK ?? 2.2, roughness: rough ?? .82, metalness: 0, color: tint || '#FFFFFF' });
}
// metal3(col, rough): brass, copper, bronze
const metal3 = (col = '#C08A3A', rough = .32) => new THREE.MeshStandardMaterial({ color: col, metalness: .9, roughness: rough });
// a soft round glow (sprites, halos)
const glowTex3 = () => tex3('glow', 128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.2, 'rgba(255,255,255,.55)'); gr.addColorStop(.5, 'rgba(255,255,255,.14)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
// glow3(parent, pos, size, col, a): an additive glowing sprite (a flame's halo, the sun, a sparkle). .material.opacity sets it.
function glow3(parent, pos, size, col, a = 1) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex3(), color: col, transparent: true, opacity: a, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  s.position.set(...pos); s.scale.setScalar(size); parent.add(s); return s;
}

// ---------- the sky ----------
// sky3(scene, stops, o): a sky dome; stops [[elevation -1..1 (0 = horizon), col], ...]. Returns the dome (toggle .visible
// to switch skies). o.r radius (300). Also sets scene.fog's colour to the horizon when o.fog = [near, far].
function sky3(scene, stops, o = {}) {
  const key = 'sky' + JSON.stringify(stops), t = tex3(key, 4, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 512);
    [...stops].sort((a, b) => b[0] - a[0]).forEach(([e, col]) => gr.addColorStop(clamp((1 - e) / 2), col));
    g.fillStyle = gr; g.fillRect(0, 0, 4, 512);
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(o.r ?? 300, 48, 32), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false, depthWrite: false }));
  dome.renderOrder = -1; scene.add(dome);
  // sphere v runs from the top (1) to the bottom (0); the texture's top is v = 1: elevation e sits at v = (e + 1) / 2
  if (o.fog) scene.fog = new THREE.Fog(stops.find(s => s[0] === 0)?.[1] || stops[0][1], o.fog[0], o.fog[1]);
  return dome;
}

// ---------- fire ----------
const flameTex3 = () => tex3('flame', 64, 128, (g) => {
  const shape = () => { g.beginPath(); g.moveTo(32, 4); g.bezierCurveTo(46, 40, 58, 78, 50, 100); g.bezierCurveTo(44, 118, 20, 118, 14, 100); g.bezierCurveTo(6, 78, 18, 40, 32, 4); };
  g.filter = 'blur(4px)'; let gr = g.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, 'rgba(255,120,30,0)'); gr.addColorStop(.35, 'rgba(255,150,40,.9)'); gr.addColorStop(1, 'rgba(255,220,140,1)'); g.fillStyle = gr; shape(); g.fill();
  g.filter = 'blur(3px)'; g.save(); g.translate(32, 120); g.scale(.55, .55); g.translate(-32, -120); gr = g.createLinearGradient(0, 30, 0, 128); gr.addColorStop(0, 'rgba(255,240,200,0)'); gr.addColorStop(.6, 'rgba(255,250,230,1)'); g.fillStyle = gr; shape(); g.fill(); g.restore();
});
// flame3(parent, pos, k): a flame (two camera-facing sprites: the flame, its halo) and its light. Returns { group,
// light, set(t, on) }; on 0..1 lights it (a growing flame). o: light (true), col, power (light intensity at on 1), range,
// shadow (false: a shadow-casting point light costs six renders), seed.
function flame3(parent, pos, k = 1, o = {}) {
  const g = new THREE.Group(); g.position.set(...pos); parent.add(g);
  const fl = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex3(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  fl.center.set(.5, .08); g.add(fl);
  const halo = glow3(g, [0, .03 * k, 0], .5 * k, o.col || '#FF9A3C', .5);
  let light = null;
  if (o.light !== false) {
    light = new THREE.PointLight(o.col || '#FF9A3C', 0, o.range ?? 7 * k, 1.6); light.position.set(0, .06 * k, 0);
    if (o.shadow) { light.castShadow = true; light.shadow.mapSize.set(512, 512); light.shadow.bias = -.004; light.shadow.radius = 4; }
    g.add(light);
  }
  const seed = o.seed ?? pos[0] * 3.1 + pos[2] * 7.7;
  const set = (t, on = 1) => {
    on = clamp(on); g.visible = on > .001;
    const f = 1 + .14 * vnoise(t * 7 + seed, 1) + .07 * Math.sin(t * 23 + seed * 5);
    fl.scale.set(.07 * k * (.6 + .4 * on), .16 * k * on * f, 1); fl.material.rotation = .05 * vnoise(t * 5 + seed, 2);
    halo.scale.setScalar(.55 * k * on * (.9 + .1 * f)); halo.material.opacity = .45 * on;
    if (light) light.intensity = (o.power ?? 4) * on * (.85 + .15 * f);
  };
  set(0, 1);
  return { group: g, light, set };
}

// ---------- water ----------
// streaks that scroll along a stream
const waterTex3 = () => tex3('water', 256, 64, (g) => {
  g.fillStyle = 'rgb(150,190,210)'; g.fillRect(0, 0, 256, 64);
  const r = lcg(41);
  for (let i = 0; i < 140; i++) { const y = r() * 64, x = r() * 256, l = 20 + r() * 90; g.strokeStyle = r() < .6 ? `rgba(255,255,255,${.25 + r() * .5})` : `rgba(40,80,110,${.2 + r() * .3})`; g.lineWidth = 1 + r() * 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y); g.stroke(); g.beginPath(); g.moveTo(x - 256, y); g.lineTo(x - 256 + l, y); g.stroke(); }
});
function waterMat3(o = {}) {
  return new THREE.MeshStandardMaterial({ map: waterTex3().rep(o.rep ?? 4, 1), color: o.col || '#BFE0F0', transparent: true, opacity: o.opacity ?? .85, roughness: .08, metalness: .1, emissive: o.glow || '#2A6A8A', emissiveIntensity: .6, depthWrite: false });
}
// stream3(parent, points [[x, y, z], ...], r, o): water running along a curve (a pour, a channel); .set(t, on) scrolls it
// at o.speed (texture repeats per second) and grows it along the curve with on 0..1 (the water arriving).
function stream3(parent, pts, r = .02, o = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => V3(...p))), n = o.segs ?? 64;
  const geo = new THREE.TubeGeometry(curve, n, r, 10, false), mat = waterMat3(o), m = mesh3(parent, geo, mat, [0, 0, 0], { cast: false, receive: false });
  m.set = (t, on = 1) => { m.visible = on > .001; mat.map.offset.x = -t * (o.speed ?? 2.5); geo.setDrawRange(0, Math.floor(clamp(on) * n) * 10 * 6); };
  m.curve = curve; return m;
}
// sheet3(parent, w, l, pos, o): a flat sheet of water flowing along its length (a channel's floor, a basin); o.rot.
function sheet3(parent, w, l, pos, o = {}) {
  const mat = waterMat3({ ...o, rep: l / .6 }), m = mesh3(parent, new THREE.PlaneGeometry(l, w), mat, pos, { rot: o.rot || [-Math.PI / 2, 0, 0], cast: false });
  m.set = (t, on = 1) => { m.visible = on > .001; mat.opacity = (o.opacity ?? .85) * clamp(on); mat.map.offset.x = -t * (o.speed ?? 1.5); };
  return m;
}

// ---------- footprints ----------
const yawOf = (dx, dz) => Math.atan2(-dx, -dz);
const footTex3 = () => tex3('foot', 128, 256, (g) => {
  g.fillStyle = '#FFFFFF'; g.shadowColor = '#FFFFFF'; g.shadowBlur = 10;
  g.beginPath(); g.ellipse(64, 110, 34, 62, .08, 0, TAU); g.fill();               // the ball and arch
  g.beginPath(); g.ellipse(60, 196, 26, 34, 0, 0, TAU); g.fill();                 // the heel
  [[44, 40, 13], [66, 34, 10], [83, 40, 8.5], [97, 50, 7.5], [107, 64, 6.5]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x - 6, y + 4, r, 0, TAU); g.fill(); });
});
// foot3(parent, x, z, yaw, side, o): one bare footprint flat on the ground at (x, z), toes along yaw (radians, 0 = toward
// -z, north, turning anticlockwise seen from above; yawOf(dx, dz) gives it for a heading), side -1 left / 1 right; o.size (.26 m long), o.col, o.y (ground height). .material.opacity fades it.
function foot3(parent, x, z, yaw, side, o = {}) {
  const sz = o.size ?? .26;
  const m = mesh3(parent, new THREE.PlaneGeometry(sz * .5, sz), new THREE.MeshBasicMaterial({ map: footTex3(), color: o.col || '#FFC860', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }),
    [x, (o.y ?? 0) + .012, z], { cast: false, receive: false });
  m.rotation.order = 'YXZ'; m.rotation.set(-Math.PI / 2, yaw, 0);
  if (side < 0) m.scale.x = -1;
  return m;
}

// ---------- the world: skies and the big lights ----------
// world3(): a scene with three skies, a hemisphere light (sky and ground fill) and a sun (a shadowed directional light
// over ±14 m), switched per shot with W.mood(name, o). Moods: dusk (lamp time: violet sky, a warm glow low in the
// west), day (blue sky, a hard sun; move it with W.sunAt([x, y, z])), night (near black, for interiors lit by lamps).
// o overrides a mood's numbers: { hemi: intensity, sun: intensity, exposure }. W.mood returns the exposure for render3.
const MOODS3 = {
  dusk: { sky: [[1, '#121833'], [.45, '#272A52'], [.18, '#6A4468'], [.06, '#C47A68'], [0, '#EFA477'], [-.05, '#4A3036'], [-1, '#181216']],
    hemi: ['#7480B8', '#4A3020', 1.0], sun: ['#FFB08A', 1.3, [-22, 5, -6]], fog: ['#7C5A70', 16, 70], exposure: 1.05 },
  day: { sky: [[1, '#2A66B8'], [.45, '#5596D6'], [.12, '#A6CDEA'], [0, '#DCEAF2'], [-1, '#8A9AA0']],
    hemi: ['#C4DAF0', '#8A7658', 1.1], sun: ['#FFF0D8', 3.4, [12, 18, 8]], fog: ['#CFE0EC', 30, 140], exposure: 1 },
  night: { sky: [[1, '#05060C'], [0, '#120E14'], [-1, '#050405']],
    hemi: ['#3A4060', '#1A120C', .25], sun: ['#8090C0', 0, [-10, 10, -5]], fog: ['#0A080C', 10, 50], exposure: 1.1 },
};
function world3() {
  const scene = new THREE.Scene(), skies = {};
  for (const k in MOODS3) skies[k] = sky3(scene, MOODS3[k].sky);
  const hemi = new THREE.HemisphereLight('#FFFFFF', '#000000', 1); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#FFFFFF', 1); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 80 }); sun.shadow.bias = -.0006; sun.shadow.normalBias = .02; sun.shadow.radius = 3;
  scene.add(sun, sun.target);
  scene.fog = new THREE.Fog('#000000', 10, 100);
  const sunAt = (p) => { const d = V3(...p).normalize().multiplyScalar(40); sun.position.copy(d); sun.target.position.set(0, 0, 0); };
  const mood = (name, o = {}) => {
    const M = MOODS3[name];
    for (const k in skies) skies[k].visible = k === name;
    hemi.color.set(M.hemi[0]); hemi.groundColor.set(M.hemi[1]); hemi.intensity = o.hemi ?? M.hemi[2];
    sun.color.set(M.sun[0]); sun.intensity = o.sun ?? M.sun[1]; sunAt(o.sunAt || M.sun[2]);
    scene.fog.color.set(M.fog[0]); scene.fog.near = M.fog[1]; scene.fog.far = M.fog[2];
    return o.exposure ?? M.exposure;
  };
  return { scene, skies, hemi, sun, sunAt, mood };
}
