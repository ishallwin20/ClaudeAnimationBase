// cine3d_india.js: India as a lit 3D relief map for the 3D style (load after cine3d.js, cine3d_kailash.js (its clouds), src/vendor/pako_inflate.min.js
// and the data files src/data/india_dem.js + india_geo.js). The ground is real: heights and the sea floor from open
// terrain tiles (tools/terrain.mjs), India's outline as the Survey of India draws it (Natural Earth's India view,
// tools/geo.mjs). The relief is exaggerated (o.vex) so the Himalaya, the Ghats and the Deccan read from the sky; the land
// is tinted like a satellite picture (green plains, the Thar and the west's tan deserts, the brown Tibetan plateau,
// snow on the high peaks), the sea by its depth (turquoise shelves, the deep navy ocean).
// Units: 1 = 10 km; y up; north = -z, east = +x; the map is centred on 80° E, 22° N (MAP3.xz(lon, lat) → [x, z]).
//
//   const I3 = india3();           I3.scene, I3.h(x, z) (the ground's height), I3.at(lon, lat) → [x, y, z] on the
//   ground, I3.mood(name, o) → exposure (space, day, golden, dusk, night; o.focus 0..1 dims the land
//   outside India, o.edge fades the map's far edges, o.sunAt, o.at + o.shadow the shadowed area), I3.border (India's outline, a line3: .set(on,
//   w, a)), I3.set(t, o) (clouds).
//   Also shared: dem3(name) (a decoded height grid: .at(lon, lat) in metres), line3(parent, pts, o) (a line of
//   constant width over the ground, drawn on with .set(on, w, a)), pillar3(parent, pos, o) (a beam of light standing on
//   the ground, .set(t, on)), pin3(c, txt, p, t, at, o) (2D lettering pinned to a world point).

// ---------- height grids ----------
// dem3(name): decode DEM_DATA[name] (a PNG written by tools/terrain.mjs) once: { w, h, lon0, lat0, lon1, lat1, res, e
// (Float32Array of metres, row 0 the north edge), at(lon, lat) (bilinear) }
function dem3(name) {
  const D = DEM_DATA[name]; if (D.e) return D;
  const bin = atob(D.png.slice(D.png.indexOf(',') + 1)), u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  const u32 = p => (u8[p] << 24 | u8[p + 1] << 16 | u8[p + 2] << 8 | u8[p + 3]) >>> 0, parts = [];
  let p = 8, w = 0, h = 0;
  while (p < u8.length) {
    const len = u32(p), type = String.fromCharCode(u8[p + 4], u8[p + 5], u8[p + 6], u8[p + 7]);
    if (type === 'IHDR') { w = u32(p + 8); h = u32(p + 12); } else if (type === 'IDAT') parts.push(u8.subarray(p + 8, p + 8 + len)); else if (type === 'IEND') break;
    p += 12 + len;
  }
  const all = new Uint8Array(parts.reduce((s, a) => s + a.length, 0)); let o = 0; for (const a of parts) { all.set(a, o); o += a.length; }
  const raw = pako.inflate(all), bpp = 3, st = w * bpp, px = new Uint8Array(st * h);
  // undo the PNG row filters (none, sub, up, average, paeth)
  for (let r = 0; r < h; r++) {
    const f = raw[r * (st + 1)], src = r * (st + 1) + 1, dst = r * st;
    for (let i = 0; i < st; i++) {
      const x = raw[src + i], a = i >= bpp ? px[dst + i - bpp] : 0, b = r ? px[dst - st + i] : 0, c = r && i >= bpp ? px[dst - st + i - bpp] : 0;
      let v = x;
      if (f === 1) v = x + a; else if (f === 2) v = x + b; else if (f === 3) v = x + ((a + b) >> 1);
      else if (f === 4) { const q = a + b - c, pa = Math.abs(q - a), pb = Math.abs(q - b), pc = Math.abs(q - c); v = x + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); }
      px[dst + i] = v & 255;
    }
  }
  const e = new Float32Array(w * h); for (let i = 0; i < w * h; i++) e[i] = (px[i * 3] * 256 + px[i * 3 + 1]) / 2 - 12000;
  const res = (D.lon1 - D.lon0) / w;
  const g = (i, j) => e[clamp(j, 0, h - 1) * w + clamp(i, 0, w - 1)];
  Object.assign(D, { e, res, w, h, at(lon, lat) {
    const x = (lon - D.lon0) / res - .5, y = (D.lat1 - lat) / res - .5, i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
    return lerp(lerp(g(i, j), g(i + 1, j), fx), lerp(g(i, j + 1), g(i + 1, j + 1), fx), fy);
  } });
  return D;
}

// ---------- the projection ----------
// lon/lat ↔ map units (an equirectangular map at 22° N, as Indian school atlases look)
const MAP3 = { lon: 80, lat: 22, k: 111.32 / 10, cos: Math.cos(22 * Math.PI / 180) };
MAP3.xz = (lon, lat) => [(lon - MAP3.lon) * MAP3.cos * MAP3.k, -(lat - MAP3.lat) * MAP3.k];
MAP3.ll = (x, z) => [x / (MAP3.cos * MAP3.k) + MAP3.lon, -z / MAP3.k + MAP3.lat];

// ---------- lines and beams ----------
// line3(parent, pts [[x, y, z], ...], o): a band of constant width (world units, set per frame) laid over the ground,
// drawn over everything (a map mark). o: col, closed, add (additive glow), core (0..1, a bright core line), order.
// .set(on 0..1 (how much of it is drawn, from its start), w, a)
function line3(parent, pts, o = {}) {
  const n = pts.length, L = [0];
  for (let i = 1; i < n; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][2] - pts[i - 1][2]));
  const tot = L[n - 1] || 1, pos = [], nrm = [], sd = [], uu = [], idx = [];
  for (let i = 0; i < n; i++) {
    const p = pts[i], a = pts[i - 1] || (o.closed ? pts[n - 2] : p), b = pts[i + 1] || (o.closed ? pts[1] : p);
    const dx = b[0] - a[0], dz = b[2] - a[2], l = Math.hypot(dx, dz) || 1;
    for (const s of [-1, 1]) { pos.push(p[0], p[1], p[2]); nrm.push(-dz / l, dx / l); sd.push(s); uu.push(L[i] / tot); }
    if (i < n - 1) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('aN', new THREE.Float32BufferAttribute(nrm, 2));
  g.setAttribute('aS', new THREE.Float32BufferAttribute(sd, 1)); g.setAttribute('aU', new THREE.Float32BufferAttribute(uu, 1)); g.setIndex(idx);
  const U = { uW: { value: 1 }, uCol: { value: new THREE.Color(o.col || '#FFC860') }, uA: { value: 1 }, uOn: { value: 1 }, uCore: { value: o.core ?? .5 } };
  const mat = new THREE.ShaderMaterial({ uniforms: U, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide,
    blending: o.add ? THREE.AdditiveBlending : THREE.NormalBlending,
    vertexShader: `attribute vec2 aN; attribute float aS; attribute float aU; uniform float uW; varying float vS; varying float vU;
      void main() { vS = aS; vU = aU; vec3 p = position + vec3(aN.x, 0., aN.y) * aS * uW * .5; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }`,
    fragmentShader: `uniform vec3 uCol; uniform float uA; uniform float uOn; uniform float uCore; varying float vS; varying float vU;
      void main() { if (vU > uOn) discard; float k = 1. - abs(vS); float a = smoothstep(0., .45, k); vec3 c = mix(uCol, vec3(1.), uCore * smoothstep(.55, 1., k));
        gl_FragColor = vec4(c, uA * a); }` });
  const m = mesh3(parent, g, mat, [0, 0, 0], { cast: false, receive: false }); m.renderOrder = o.order ?? 5; m.frustumCulled = false;
  m.set = (on = 1, w = 1, a = 1) => { m.visible = on > .001 && a > .001; U.uOn.value = on >= 1 ? 2 : on; U.uW.value = w; U.uA.value = a; };
  m.len = tot; m.set(0); return m;
}
// pillar3(parent, [x, y, z], o): a beam of light standing on the ground with a glow at its foot. o: h (height), r, col.
// .set(t, on): on 0..1 grows it up from the ground; it shimmers with t.
const beamTex3 = () => tex3('beam', 64, 256, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.6, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,1)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 256);
  const gx = g.createLinearGradient(0, 0, 64, 0); gx.addColorStop(0, 'rgba(0,0,0,1)'); gx.addColorStop(.5, 'rgba(0,0,0,0)'); gx.addColorStop(1, 'rgba(0,0,0,1)');
  g.globalCompositeOperation = 'destination-out'; g.fillStyle = gx; g.fillRect(0, 0, 64, 256);
});
function pillar3(parent, p, o = {}) {
  const G = new THREE.Group(); G.position.set(...p); parent.add(G);
  const h = o.h ?? 30, r = o.r ?? 1, col = o.col || '#FFD27A';
  const mat = new THREE.MeshBasicMaterial({ map: beamTex3(), color: col, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, side: THREE.DoubleSide });
  const beam = mesh3(G, new THREE.CylinderGeometry(r, r * 1.6, 1, 24, 1, true), mat, [0, .5, 0], { cast: false, receive: false });
  const core = mesh3(G, new THREE.CylinderGeometry(r * .25, r * .4, 1, 12, 1, true), mat.clone(), [0, .5, 0], { cast: false, receive: false });
  const foot = glow3(G, [0, r * .3, 0], r * 9, col, 1), spark = glow3(G, [0, r * .3, 0], r * 3, '#FFFFFF', 1);
  G.set = (t, on = 1) => {
    on = clamp(on); G.visible = on > .001; const k = easeOut(on), f = 1 + .06 * Math.sin(t * 5 + p[0]);
    beam.scale.set(f, h * k, f); beam.position.y = h * k / 2; core.scale.set(1, h * k, 1); core.position.y = h * k / 2;
    beam.material.opacity = .55 * on; core.material.opacity = .9 * on; foot.material.opacity = .9 * on * f; spark.material.opacity = on;
    foot.scale.setScalar(r * 9 * (.6 + .4 * k) * f);
  };
  G.set(0, 0); return G;
}
// pin3(c, txt, p, t, at, o): lettering pinned to a world point, popping at `at`. o: size, col, font, dx, dy, alpha,
// spacing, maxW, glow.
function pin3(c, txt, p, t, at, o = {}) {
  const [x, y, z] = toScreen3(p); if (z > 1 || t < at) return [x, y];
  text(c, txt, x + (o.dx || 0), y + (o.dy || 0), o.font || `700 ${o.size || 48}px Cinzel`, o.col || '#F4C46A', { pop: t - at, alpha: o.alpha ?? 1, glow: o.glow || ['rgba(6,6,14,.9)', 18], spacing: o.spacing ?? 2, maxW: o.maxW });
  return [x, y];
}

// ---------- the terrain's look ----------
// colour by elevation (attribute aE, metres; the sea floor below 0), slope, region (deserts), noise
const IND_GLSL = `
uniform float uMapK, uMapCos, uMapLon, uMapLat, uSea, uFocus, uEdge; uniform sampler2D uMask; uniform vec4 uMaskBox;
varying float vE; varying vec3 vW; varying vec3 vWN;
float ih(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float in2(vec2 x){ vec2 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(ih(i), ih(i + vec2(1, 0)), f.x), mix(ih(i + vec2(0, 1)), ih(i + vec2(1, 1)), f.x), f.y) * 2. - 1.; }
float if2(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 5; i++) { s += a * in2(p); p = p * 2.07 + 13.1; a *= .5; } return s; }
float blob(vec2 ll, vec2 c, vec2 r){ vec2 d = (ll - c) / r; return exp(-dot(d, d)); }
`;
function indiaMat3(o = {}) {
  const m = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: .95, metalness: 0 });
  const U = { uMapK: { value: MAP3.k * (o.scale ?? 1) }, uMapCos: { value: MAP3.cos }, uMapLon: { value: o.lon ?? MAP3.lon }, uMapLat: { value: o.lat ?? MAP3.lat }, uSea: { value: o.sea ?? 1 },
    uFocus: { value: 0 }, uEdge: { value: 0 }, uMask: { value: indiaMask3() }, uMaskBox: { value: new THREE.Vector4(...IND_MASK_BOX) } };
  m.userData.U = U;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aE; varying float vE; varying vec3 vW; varying vec3 vWN;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvE = aE; vW = (modelMatrix * vec4(transformed, 1.)).xyz; vWN = normalize(mat3(modelMatrix) * objectNormal);');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + IND_GLSL)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      {
        vec2 ll = vec2(vW.x / (uMapCos * uMapK) + uMapLon, -vW.z / uMapK + uMapLat);
        float n1 = if2(ll * 3.), n2 = if2(ll * 14. + 5.), n3 = if2(ll * 60. + 2.);
        float e = vE, up = normalize(vWN).y;
        // the sea, by depth
        float d = max(0., -e);
        vec3 sea = mix(vec3(.30, .78, .80), vec3(.10, .52, .70), smoothstep(5., 60., d));
        sea = mix(sea, vec3(.05, .27, .52), smoothstep(60., 600., d));
        sea = mix(sea, vec3(.03, .13, .32), smoothstep(800., 4000., d));
        sea = mix(sea, sea * 1.1 + .02, n2 * .2 * (1. - smoothstep(20., 200., d)));
        // the land: plains green, the west and north-west dry, the plateau ochre, the Tibetan plateau brown, snow high
        float dry = max(max(blob(ll, vec2(71.5, 27.), vec2(3.6, 2.8)), blob(ll, vec2(64.5, 28.5), vec2(5., 4.))), max(blob(ll, vec2(66., 34.), vec2(6., 3.5)), blob(ll, vec2(69., 24.), vec2(2.5, 1.5)) * .8));
        dry = max(dry, smoothstep(30.5, 34., ll.y) * smoothstep(77., 74., ll.x) * .6);
        dry = max(dry, blob(ll, vec2(77., 16.5), vec2(3.5, 3.)) * .45 + blob(ll, vec2(75.5, 21.), vec2(4., 3.)) * .3);
        dry = clamp(dry + n1 * .25, 0., 1.);
        vec3 green = mix(vec3(.22, .36, .14), vec3(.33, .43, .19), smoothstep(-.3, .4, n1));
        green = mix(green, vec3(.15, .30, .12), blob(ll, vec2(76., 11.), vec2(1.5, 4.)) + blob(ll, vec2(93., 25.), vec2(4., 3.)) + blob(ll, vec2(81., 7.5), vec2(1., 1.)));
        vec3 tan = mix(vec3(.66, .55, .38), vec3(.76, .64, .44), smoothstep(-.3, .5, n2));
        vec3 ochre = mix(vec3(.47, .40, .24), vec3(.40, .38, .21), smoothstep(-.2, .4, n2));
        vec3 land = mix(green, ochre, smoothstep(250., 900., e) * .7);
        land = mix(land, tan, dry);
        vec3 rock = mix(vec3(.36, .29, .22), vec3(.46, .39, .31), smoothstep(-.3, .4, n2 + n3 * .3));
        vec3 plateau = mix(vec3(.52, .43, .32), vec3(.45, .40, .33), smoothstep(-.2, .5, n1));
        land = mix(land, rock, smoothstep(1500., 3200., e) * (1. - smoothstep(3800., 4600., e) * .5));
        land = mix(land, plateau, smoothstep(3800., 4500., e) * smoothstep(.75, .9, up));
        float snow = max(smoothstep(4900., 5600., e + n2 * 500. + n3 * 200.) * smoothstep(.45, .7, up + n3 * .1), smoothstep(5600., 6200., e + n3 * 300.));
        land = mix(land, vec3(.93, .95, .98), snow);
        land *= .92 + .16 * n3;
        float isLand = smoothstep(-1., 1.5, e);
        // India in focus: the land outside India dimmed and greyed (uFocus); the grid's far edges fade out (uEdge)
        vec2 mq = (ll - uMaskBox.xy) / (uMaskBox.zw - uMaskBox.xy);
        float inIndia = texture2D(uMask, vec2(mq.x, mq.y)).r;
        land = mix(land, mix(land, vec3(dot(land, vec3(.3, .5, .2))), .6) * .45, uFocus * (1. - inIndia));
        vec3 col = mix(sea * uSea, land, isLand);
        float r = length((ll - vec2(80., 21.)) * vec2(.8, 1.));
        col *= 1. - uEdge * smoothstep(13., 19., r);
        diffuseColor.rgb = col;
        roughnessFactor = mix(.32, .96, isLand);
        metalnessFactor = 0.;
      }`);
  };
  return m;
}

// India's mask (1 inside its outline), drawn from GEO.india on a canvas over IND_MASK_BOX [lon0, lat0, lon1, lat1]
const IND_MASK_BOX = [60, 0, 100, 40];
const indiaMask3 = () => tex3('indmask', 2048, 2048, (g, w, h) => {
  const [a, b, c, d] = IND_MASK_BOX, X = lon => (lon - a) / (c - a) * w, Y = lat => (d - lat) / (d - b) * h;   // row 0 = the north edge (a canvas texture is flipped: v = 1)
  g.fillStyle = '#000'; g.fillRect(0, 0, w, h); g.fillStyle = '#FFF'; g.filter = 'blur(1.5px)';
  for (const R of GEO.india) { g.beginPath(); R.forEach(([lon, lat], i) => i ? g.lineTo(X(lon), Y(lat)) : g.moveTo(X(lon), Y(lat))); g.closePath(); g.fill(); }
}, { data: true });

// ---------- India ----------
const IND_MOODS = {
  space: { sky: [[1, '#000003'], [.2, '#010208'], [0, '#040A1C'], [-1, '#000003']], sun: ['#FFF4E6', 3.4, [-.5, .65, .45]], hemi: ['#9AB8E8', '#2A2018', .55], fog: ['#3A64A0', 1400, 9000], exposure: 1 },
  day: { sky: [[1, '#0F3780'], [.5, '#2A62B4'], [.12, '#86B2DE'], [0, '#D2E2EE'], [-1, '#6A7480']], sun: ['#FFF4E4', 3.3, [-.4, .8, .45]], hemi: ['#A8C4EA', '#7A6648', .9], fog: ['#B8CCE0', 900, 6000], exposure: 1 },
  golden: { sky: [[1, '#1C3474'], [.45, '#3E5A9A'], [.15, '#C89A86'], [0, '#F4C08A'], [-1, '#5A4A44']], sun: ['#FFC090', 3.2, [-.85, .3, .4]], hemi: ['#8C9AC8', '#5A4434', .65], fog: ['#D8B8A0', 700, 5000], exposure: 1.02 },
  dusk: { sky: [[1, '#121833'], [.45, '#272A52'], [.18, '#6A4468'], [.06, '#C47A68'], [0, '#EFA477'], [-1, '#181216']], sun: ['#FF9A72', 2.6, [-.9, .16, .3]], hemi: ['#6A6CA8', '#3A2A30', .55], fog: ['#7C5A70', 600, 4500], exposure: 1.06 },
  night: { sky: [[1, '#020410'], [.3, '#060B24'], [0, '#14204A'], [-1, '#020308']], sun: ['#9AB0FF', 1.1, [.3, .6, -.6]], hemi: ['#3A4C90', '#0A0A14', .45], fog: ['#0E1838', 600, 5000], exposure: 1.15 },
};
// india3(o): the map. o.vex (height exaggeration, 11), o.step (grid step, 1 = every DEM cell), o.bbox [lon0, lat0,
// lon1, lat1] (the part of the grid built)
function india3(o = {}) {
  const D = dem3('india'), vex = o.vex ?? 11, step = o.step ?? 1, [b0, b1, b2, b3] = o.bbox || [62, 3, 99, 38];
  const scene = new THREE.Scene(), skies = {};
  for (const k in IND_MOODS) skies[k] = sky3(scene, IND_MOODS[k].sky, { r: 9000 });
  const hemi = new THREE.HemisphereLight('#FFFFFF', '#000000', 1); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#FFFFFF', 1); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.bias = -.0005; sun.shadow.normalBias = .4; scene.add(sun, sun.target);
  scene.fog = new THREE.Fog('#000000', 1000, 9000);
  // the ground's height in map units at a grid cell's elevation (the sea's surface flat at 0)
  const hy = e => e > 0 ? .02 + e / 10000 * vex : 0;
  const h = (x, z) => { const [lon, lat] = MAP3.ll(x, z); return hy(D.at(lon, lat)); };
  // the mesh: the DEM's cells inside the bbox
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
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('aE', new THREE.BufferAttribute(ae, 1)); geo.setIndex(new THREE.BufferAttribute(idx, 1));
  geo.computeVertexNormals();
  const mat = indiaMat3(), ground = mesh3(scene, geo, mat);
  // the sea beyond the grid
  const far = mesh3(scene, new THREE.PlaneGeometry(40000, 40000), new THREE.MeshStandardMaterial({ color: '#306599', roughness: .32 }), [0, -.6, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // stars (space, night)
  const sg = new THREE.BufferGeometry(), sp = [], rs = lcg(23);
  for (let i = 0; i < 2400; i++) { const a = rs() * TAU, el = Math.asin(rs() * 2 - 1), R = 8500; sp.push(Math.cos(a) * Math.cos(el) * R, Math.sin(el) * R, Math.sin(a) * Math.cos(el) * R); }
  sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: '#FFFFFF', size: 2, sizeAttenuation: false, transparent: true, opacity: .9, fog: false, depthWrite: false })); scene.add(stars);
  // clouds: soft sprites drifting over the land
  const clouds = [], rc = lcg(5);
  for (let i = 0; i < 70; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex3(), transparent: true, depthWrite: false, opacity: .6 }));
    const lon = 64 + rc() * 34, lat = 2 + rc() * 34, [x, z] = MAP3.xz(lon, lat);
    s.userData = { x, z, y: 18 + rc() * 14, w: 30 + rc() * 70, v: .5 + rc() };
    s.scale.set(s.userData.w, s.userData.w * .45, 1); scene.add(s); clouds.push(s);
  }
  // India's outline
  const at = (lon, lat, lift = 0) => { const [x, z] = MAP3.xz(lon, lat); return [x, hy(D.at(lon, lat)) + lift, z]; };
  const ring = (R) => line3(scene, R.map(([lon, lat]) => at(lon, lat, .3)), { col: '#FFD27A', closed: true, add: true, core: .7 });
  const border = ring(GEO.india.reduce((a, b) => (b.length > a.length ? b : a)));   // the mainland
  const lanka = ring(GEO.lanka[0]); lanka.material.uniforms.uCol.value.set('#BFE6FF');
  const mood = (name, mo = {}) => {
    const M = IND_MOODS[name];
    for (const k in skies) skies[k].visible = k === name;
    hemi.color.set(M.hemi[0]); hemi.groundColor.set(M.hemi[1]); hemi.intensity = mo.hemi ?? M.hemi[2];
    sun.color.set(M.sun[0]); sun.intensity = mo.sun ?? M.sun[1];
    const d = V3(...(mo.sunAt || M.sun[2])).normalize(), c = mo.at || [0, 0, 0], ext = mo.shadow ?? 300;
    sun.target.position.set(...c); sun.position.set(c[0] + d.x * 1500, c[1] + d.y * 1500, c[2] + d.z * 1500);
    Object.assign(sun.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 100, far: 3500 }); sun.shadow.camera.updateProjectionMatrix();
    scene.fog.color.set(M.fog[0]); scene.fog.near = mo.fogNear ?? M.fog[1]; scene.fog.far = mo.fogFar ?? M.fog[2];
    far.visible = name !== 'space';
    stars.visible = name === 'space' || name === 'night'; stars.material.opacity = mo.stars ?? .9;
    mat.userData.U.uFocus.value = mo.focus ?? 0; mat.userData.U.uEdge.value = mo.edge ?? (name === 'space' ? 1 : 0);
    return mo.exposure ?? M.exposure;
  };
  const set = (t, so = {}) => {
    const cl = so.clouds ?? 0;
    clouds.forEach(s => { const d = s.userData; s.visible = cl > .01; s.material.opacity = cl * .6; s.position.set(d.x + t * d.v * (so.wind ?? 1), d.y, d.z); });
  };
  set(0);
  return { scene, ground, mat, sun, hemi, mood, set, border, lanka, at, h, hy, D, stars, far };
}
