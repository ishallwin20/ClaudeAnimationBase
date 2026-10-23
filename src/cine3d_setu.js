// cine3d_setu.js: the Palk Strait and Adam's Bridge (Ram Setu) for the 3D style (load after cine3d_india.js and
// src/data/palk_dem.js). Real ground: Rameswaram (Pamban) island and the Dhanushkodi spit, Mannar island and Sri Lanka's
// coast, from open terrain tiles (tools/terrain.mjs), the sea floor's depth from the India grid; the chain of shoals
// between Dhanushkodi and Talaimannar (too shallow for the tiles) laid in as sandbanks a metre or two under the water
// with a few dry cays. Clear shallow water over it (its ripples, glints and sky reflection), waves that rise from
// impacts, the sun's day, the moon and a Milky Way night. And the bridge of the Ramayana: a causeway of rock and trees
// that grows from Dhanushkodi to Mannar, rocks and trees flying in and splashing at its end, the army's torches
// crossing, fire arrows, and the Ocean god's light rising from the sea.
// Units: 1 = 100 m; y up (0 = the sea's surface); north = -z, east = +x; centred on 79.57° E, 9.13° N.
//
//   const S3 = setu3();      S3.scene, S3.ll(lon, lat) → [x, z], S3.h(x, z), S3.path(s) (the bridge's line, s 0 at
//   Dhanushkodi, 1 at Mannar: { x, z, dx, dz }), S3.mood(name, o) → exposure (dawn, day, golden, dusk, night; o.sunAt
//   [x, y, z], o.moon [x, y, z], o.milky 0..1), S3.set(t, o) (o.waves 0..1, o.impacts [[x, z, t0, amp], ...], o.swell, o.ripple (the ripples'
//   strength, .3), o.clear (1: the shallows clear turquoise; 0: an even sea)),
//   S3.bridge.set(on) (built from s 0 to on), S3.fly.set(t, front, on) (rocks and trees flying in at the front),
//   S3.army.set(t, front, on) (torches on the bridge up to front), S3.arrows.set(t, shots [[t0, from, to], ...]),
//   S3.god.set(t, on) (the Ocean god's light), S3.shoal (the shoals' gold line, a line3), S3.fire (a flame on the shore).
const SETU = { lon: 79.57, lat: 9.13, k: 1113.2, cos: Math.cos(9.13 * Math.PI / 180), vexLand: 2.2, vexSea: 5, slab: .32 };
SETU.xz = (lon, lat) => [(lon - SETU.lon) * SETU.cos * SETU.k, -(lat - SETU.lat) * SETU.k];
SETU.ll = (x, z) => [x / (SETU.cos * SETU.k) + SETU.lon, -z / SETU.k + SETU.lat];
// the shoals' line (Dhanushkodi's tip → the cays → Talaimannar), lon/lat
SETU.line = [[79.4415, 9.1615], [79.50, 9.142], [79.56, 9.118], [79.615, 9.088], [79.648, 9.078], [79.70, 9.094]];

const SETU_MOODS = {
  dawn: { sky: [[1, '#1A2A5E'], [.4, '#4A5E96'], [.12, '#D89A88'], [0, '#FFC79A'], [-1, '#3A4A5A']], sun: ['#FFC8A0', 2.6, [.9, .12, .3]], hemi: ['#9AAAD8', '#5A5048', .7], fog: ['#E8B8A0', 300, 2600], exposure: 1.05 },
  day: { sky: [[1, '#0F3780'], [.5, '#2A62B4'], [.12, '#86B2DE'], [0, '#D2E2EE'], [-1, '#6A7480']], sun: ['#FFF4E4', 3.4, [.3, .85, .45]], hemi: ['#A8C4EA', '#7A6648', 1], fog: ['#C4D6E8', 400, 3200], exposure: 1 },
  golden: { sky: [[1, '#1C3474'], [.45, '#3E5A9A'], [.15, '#C89A86'], [0, '#F4C08A'], [-1, '#5A4A44']], sun: ['#FFB878', 3.2, [-.85, .2, .45]], hemi: ['#8C9AC8', '#5A4434', .7], fog: ['#D8B8A0', 300, 2600], exposure: 1.02 },
  dusk: { sky: [[1, '#121833'], [.45, '#272A52'], [.18, '#6A4468'], [.06, '#C47A68'], [0, '#EFA477'], [-1, '#181216']], sun: ['#FF9A72', 2.4, [-.95, .07, .3]], hemi: ['#6A6CA8', '#3A2A30', .55], fog: ['#7C5A70', 250, 2200], exposure: 1.08 },
  night: { sky: [[1, '#01030C'], [.35, '#040A22'], [.06, '#0E1A40'], [0, '#1A2852'], [-1, '#02040A']], sun: ['#9AB0FF', .9, [.4, .5, -.7]], hemi: ['#3A4C90', '#0A0A14', .5], fog: ['#0C1636', 300, 3000], exposure: 1.2 },
};
// the Milky Way: a band of stars and glow across an equirectangular sky
const milkyTex3 = () => tex3('milky', 2048, 1024, (g, w, h) => {
  g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
  const r = lcg(17), band = x => h * (.42 + .22 * Math.sin(x / w * TAU + .6));   // the band's centre line (a tilted great circle)
  g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 900; i++) { const x = r() * w, y = band(x) + (r() + r() + r() - 1.5) * 70, rr = 20 + r() * 60, gr = g.createRadialGradient(x, y, 0, x, y, rr), warm = r() < .4;
    gr.addColorStop(0, warm ? 'rgba(255,214,170,.07)' : 'rgba(170,190,255,.07)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  // dark dust lanes
  g.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 260; i++) { const x = r() * w, y = band(x) + (r() - .5) * 26, rr = 10 + r() * 26, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(0,0,0,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 26000; i++) { const x = r() * w, near = r() < .65, y = near ? band(x) + (r() + r() + r() + r() - 2) * 60 : r() * h, b = r(); g.fillStyle = `rgba(255,${235 + b * 20 | 0},${220 + b * 35 | 0},${.25 + b * .6})`; g.fillRect(x, y, b > .97 ? 2 : 1, b > .97 ? 2 : 1); }
});
const rippleTex3 = () => tex3('ripple', 512, 512, (g, w, h) => {
  // a tiling normal map of small waves: sum of sines → slopes → RGB
  const id = g.createImageData(w, h), d = id.data, W = [[3, 1, .8, 0], [1, 4, .6, 1.3], [5, -2, .4, 2.1], [-2, 6, .35, .7], [7, 3, .2, 4.2], [-6, 5, .18, 3.3]];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let sx = 0, sy = 0; for (const [a, b, am, ph] of W) { const k = (a * x + b * y) / w * TAU + ph, c = Math.cos(k) * am; sx += c * a; sy += c * b; }
    const i = (y * w + x) * 4; d[i] = 128 + sx * 6; d[i + 1] = 128 + sy * 6; d[i + 2] = 255; d[i + 3] = 255;
  }
  g.putImageData(id, 0, 0);
}, { data: true });
const splashTex3 = () => tex3('splash', 128, 128, (g) => {
  const r = lcg(3); g.filter = 'blur(2px)';
  for (let i = 0; i < 90; i++) { const a = -Math.PI / 2 + (r() - .5) * 2.2, d = r() * 52, x = 64 + Math.cos(a) * d * .8, y = 110 + Math.sin(a) * d * 1.6, rr = 3 + r() * 9; g.fillStyle = `rgba(255,255,255,${.25 + r() * .5})`; g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill(); }
});

// the ground's colour: sand, scrub and palms on land; under the water the sand fades to sea-grass teal with depth
function setuMat3() {
  const m = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: .95, metalness: 0 });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aE; varying float vE; varying vec3 vW;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvE = aE; vW = (modelMatrix * vec4(transformed, 1.)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vE; varying vec3 vW;\n' + IND_GLSL.replace(/uniform[^\n]*\n/, '').replace(/varying[^\n]*\n/, ''))
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      {
        vec2 p = vW.xz; float n1 = if2(p * .02), n2 = if2(p * .12 + 3.), n3 = if2(p * .7 + 9.);
        float e = vE;
        vec3 sand = mix(vec3(.86, .80, .66), vec3(.95, .91, .80), smoothstep(-.3, .5, n2));
        vec3 wet = mix(sand, vec3(.72, .78, .70), .5);
        vec3 grass = mix(vec3(.30, .44, .38), vec3(.18, .34, .32), smoothstep(-.2, .4, n1));
        vec3 bed = mix(sand, wet, smoothstep(-.2, -1.5, e));
        bed = mix(bed, grass, smoothstep(-2.5, -7., e + n1 * 3.) * .8);
        bed = mix(bed, vec3(.10, .26, .30), smoothstep(-12., -40., e));
        vec3 scrub = mix(vec3(.42, .46, .26), vec3(.24, .34, .16), smoothstep(-.2, .5, n2 + n3 * .3));
        vec3 land = mix(sand, scrub, smoothstep(1.5, 4., e + n2 * 2.5) * .85);
        // under the water the light is absorbed: red first, then everything, with depth
        float dp = max(0., -e);
        bed *= mix(vec3(.62, .86, .88), vec3(.30, .55, .62), smoothstep(1., 10., dp)) * (1. - .55 * smoothstep(2., 30., dp));
        float isLand = smoothstep(-.1, .4, e);
        diffuseColor.rgb = mix(bed, land, isLand) * (.93 + .14 * n3);
      }`);
  };
  return m;
}

function setu3(o = {}) {
  const P = dem3('palk'), I = dem3('india'), scene = new THREE.Scene(), skies = {};
  for (const k in SETU_MOODS) skies[k] = sky3(scene, SETU_MOODS[k].sky, { r: 5000 });
  const milky = new THREE.Mesh(new THREE.SphereGeometry(4800, 64, 32), new THREE.MeshBasicMaterial({ map: milkyTex3(), side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  milky.rotation.set(.35, 1.2, .2); milky.renderOrder = -1; scene.add(milky);
  const hemi = new THREE.HemisphereLight('#FFFFFF', '#000000', 1); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#FFFFFF', 1); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.bias = -.0004; sun.shadow.normalBias = .05; scene.add(sun, sun.target);
  scene.fog = new THREE.Fog('#000000', 300, 3000);

  // ---- the shoals' line and its distance field
  const L = SETU.line.map(([lon, lat]) => SETU.xz(lon, lat)), LC = through(L, 24);
  const LS = [0]; for (let i = 1; i < LC.length; i++) LS.push(LS[i - 1] + Math.hypot(LC[i][0] - LC[i - 1][0], LC[i][1] - LC[i - 1][1]));
  const LEN = LS[LS.length - 1];
  const path = (s) => {
    const d = clamp(s) * LEN; let i = 1; while (i < LC.length - 1 && LS[i] < d) i++;
    const k = (d - LS[i - 1]) / (LS[i] - LS[i - 1] || 1), a = LC[i - 1], b = LC[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return { x: lerp(a[0], b[0], k), z: lerp(a[1], b[1], k), dx: (b[0] - a[0]) / l, dz: (b[1] - a[1]) / l };
  };
  path.len = LEN;
  // nearest point on the line: [distance, s, side]
  const near = (x, z) => {
    let best = 1e9, bs = 0, side = 1;
    for (let i = 1; i < LC.length; i++) {
      const [ax, az] = LC[i - 1], [bx, bz] = LC[i], vx = bx - ax, vz = bz - az, l2 = vx * vx + vz * vz, k = clamp(((x - ax) * vx + (z - az) * vz) / l2), px = ax + vx * k, pz = az + vz * k, d = Math.hypot(x - px, z - pz);
      if (d < best) { best = d; bs = (LS[i - 1] + k * Math.sqrt(l2)) / LEN; side = Math.sign(vx * (z - az) - vz * (x - ax)) || 1; }
    }
    return [best, bs, side];
  };
  // ---- elevation in metres at (x, z): the land from the Palk grid, the sea floor from the India grid, the shoals
  const elev = (x, z) => {
    const [lon, lat] = SETU.ll(x, z), inP = lon > P.lon0 && lon < P.lon1 && lat > P.lat0 && lat < P.lat1;
    const pe = inP ? P.at(lon, lat) : 0, ie = Math.min(-1.5, I.at(lon, lat));
    if (pe > .4) return pe;
    let e = ie;
    // the shoals: a ridge 1–2 m under the water along the line, sandbars branching off it, a few dry cays
    const [d, s] = near(x, z), w = 9 + 5 * kFbm(s * 9, 1, 3), ridge = Math.exp(-Math.pow(d / w, 2)) * seg(s, -.02, .02) * (1 - seg(s, .98, 1.02));
    const bars = Math.exp(-Math.pow(d / (w * 2.4), 2)) * .5 * (.5 + .5 * kRidge(x * .02, z * .02, 3));
    const top = -1.6 + 1.3 * kFbm(s * 14 + 3, d * .05, 3) + 2.2 * Math.pow(Math.max(0, kNoise(s * 20, 7)), 3);
    e = lerp(e, Math.max(e, top), clamp(ridge + bars * (1 - ridge)));
    // the land's own edge (the Palk grid's sea is 0, its coast a ramp up from it): a beach shelving into the water
    if (pe > 0) e = Math.max(e, lerp(-1.2, .3, pe / .4));
    return e;
  };
  const hy = e => e > 0 ? e / 100 * SETU.vexLand + .02 : e / 100 * SETU.vexSea;
  const h = (x, z) => hy(elev(x, z));
  // ---- the ground mesh: 1 unit cells over the strait, coarser beyond
  const X0 = -1300, X1 = 1300, Z0 = -900, Z1 = 900, nx = o.res ?? 1500, nz = Math.round(nx * (Z1 - Z0) / (X1 - X0));
  const pos = new Float32Array(nx * nz * 3), ae = new Float32Array(nx * nz);
  for (let b = 0; b < nz; b++) for (let a = 0; a < nx; a++) {
    // denser near the line (the grid's columns and rows bunch toward the centre)
    const u = a / (nx - 1) * 2 - 1, v = b / (nz - 1) * 2 - 1, x = X1 * Math.sign(u) * Math.pow(Math.abs(u), 1.6), z = Z1 * Math.sign(v) * Math.pow(Math.abs(v), 1.6) + 10;
    const e = elev(x, z), k = b * nx + a; pos[k * 3] = x; pos[k * 3 + 1] = hy(e); pos[k * 3 + 2] = z; ae[k] = e;
  }
  const idx = new Uint32Array((nx - 1) * (nz - 1) * 6); let q = 0;
  for (let b = 0; b < nz - 1; b++) for (let a = 0; a < nx - 1; a++) { const k = b * nx + a; idx[q++] = k; idx[q++] = k + nx; idx[q++] = k + 1; idx[q++] = k + 1; idx[q++] = k + nx; idx[q++] = k + nx + 1; }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('aE', new THREE.BufferAttribute(ae, 1)); geo.setIndex(new THREE.BufferAttribute(idx, 1)); geo.computeVertexNormals();
  const ground = mesh3(scene, geo, setuMat3());
  mesh3(scene, new THREE.PlaneGeometry(20000, 20000), new THREE.MeshStandardMaterial({ color: '#1E4A50', roughness: 1 }), [0, -4, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });

  // ---- the water: a clear sheet over the ground; ripples, sky reflection, and waves from impacts
  const envRT = new THREE.PMREMGenerator(GL3), envs = {};
  // the water's depth (m, 0..64 in a byte) over the sea sheet, for its colour and clarity
  const DW = 1536, DH = 1152, dd = new Uint8Array(DW * DH);
  for (let r = 0; r < DH; r++) for (let i = 0; i < DW; i++) { const x = -2000 + (i + .5) * 4000 / DW, z = -1500 + (r + .5) * 3000 / DH; dd[r * DW + i] = clamp(-elev(x, z) / 64) * 255; }
  const depthTex = new THREE.DataTexture(dd, DW, DH, THREE.RedFormat, THREE.UnsignedByteType); depthTex.magFilter = depthTex.minFilter = THREE.LinearFilter; depthTex.needsUpdate = true;
  const WU = { uT: { value: 0 }, uWave: { value: 0 }, uSwell: { value: .02 }, uImp: { value: [0, 1, 2, 3, 4, 5].map(() => new THREE.Vector4(0, 0, -99, 0)) }, uDepth: { value: depthTex }, uClear: { value: 1 } };
  const water = new THREE.MeshStandardMaterial({ color: '#2A8FA6', transparent: true, opacity: .62, roughness: .06, metalness: .05, normalMap: rippleTex3().rep(60, 60), normalScale: new THREE.Vector2(.3, .3), depthWrite: false });
  water.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, WU);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uT, uWave, uSwell; uniform vec4 uImp[6]; varying vec3 vWW; varying float vCrest;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        { vec3 w = (modelMatrix * vec4(transformed, 1.)).xyz; float y = uSwell * (sin(w.x * .09 + uT * 1.3) + .6 * sin(w.z * .13 - uT * 1.1));
          float cr = 0.;
          for (int i = 0; i < 6; i++) { vec4 m = uImp[i]; float a = uT - m.z; if (a > 0. && m.w > 0.) { float r = distance(w.xz, m.xy), fr = a * 26.;
            // a train of crests travelling out from the impact, tallest at its front, dying with time and distance
            float env = exp(-pow((r - fr + 25.) / 45., 2.)) * smoothstep(fr + 8., fr - 8., r), A = m.w * exp(-a * .3) * 60. / (60. + r);
            float wv = pow(.5 + .5 * cos((r - fr) * .16), 3.);
            float hump = exp(-pow(r / 16., 2.)) * m.w * 1.6 * exp(-a * 2.2) * smoothstep(0., .2, a);
            y += (A * env * wv + hump) * uWave; cr += (env * wv * smoothstep(.55, .9, wv) * A / max(m.w, .01) + hump / max(m.w, .01) * .5) * uWave; } }
          transformed.y += y; vCrest = cr; }`)
      .replace('#include <project_vertex>', '#include <project_vertex>\nvWW = (modelMatrix * vec4(transformed, 1.)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uWave, uClear; uniform sampler2D uDepth; varying vec3 vWW; varying float vCrest;')
      .replace('#include <color_fragment>', `#include <color_fragment>
        { float dm = texture2D(uDepth, (vWW.xz + vec2(2000., 1500.)) / vec2(4000., 3000.)).r * 64.;
          dm = mix(dm, 40., smoothstep(1700., 1990., abs(vWW.x)) + smoothstep(1250., 1490., abs(vWW.z)));
          vec3 c = mix(vec3(.45, .90, .86), vec3(.08, .62, .72), smoothstep(1., 8., dm));
          c = mix(c, vec3(.04, .30, .52), smoothstep(8., 30., dm));
          diffuseColor.rgb = c; diffuseColor.a = mix(mix(.4, .78, smoothstep(.5, 6., dm)), .95, smoothstep(6., 30., dm)) * uClear + (1. - uClear) * .9; }`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        if (uWave > .001) { vec3 fn = normalize(cross(dFdx(vWW), dFdy(vWW))); if (fn.y < 0.) fn = -fn; normal = normalize(mix(normal, (viewMatrix * vec4(fn, 0.)).xyz, .8)); }`)
      .replace('#include <opaque_fragment>', `diffuseColor.a = mix(diffuseColor.a, 1., smoothstep(.1, .5, vCrest)); outgoingLight = mix(outgoingLight, vec3(.92, .96, 1.), smoothstep(.25, .8, vCrest) * .8);
        #include <opaque_fragment>`);
  };
  const sea = mesh3(scene, new THREE.PlaneGeometry(4000, 3000, 640, 480), water, [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  sea.renderOrder = 1;
  const outer = mesh3(scene, new THREE.PlaneGeometry(20000, 20000), new THREE.MeshStandardMaterial({ color: '#0A4C80', roughness: .08, metalness: .05, normalMap: rippleTex3().rep(400, 400), normalScale: new THREE.Vector2(.3, .3) }), [0, -.01, 0], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false });
  outer.renderOrder = 0;
  { const hole = new THREE.Shape(); hole.moveTo(-10000, -10000); hole.lineTo(10000, -10000); hole.lineTo(10000, 10000); hole.lineTo(-10000, 10000);
    const p = new THREE.Path(); p.moveTo(-1995, -1495); p.lineTo(-1995, 1495); p.lineTo(1995, 1495); p.lineTo(1995, -1495); hole.holes.push(p); outer.geometry = new THREE.ShapeGeometry(hole); }

  // ---- the shoals' gold line (a map mark)
  const shoal = line3(scene, LC.map(([x, z]) => [x, .5, z]), { col: '#FFD27A', add: true, core: .7 });

  // ---- the bridge: a causeway (a slab with sloping sides) heaped with rocks and trees, grown along the line
  const BW = LEN / 10 * (o.width ?? 1), NS = 400, bpos = [], buv = [], bidx = [];
  for (let i = 0; i <= NS; i++) {
    const p = path(i / NS), nx2 = -p.dz, nz2 = p.dx, half = BW / 2, top = SETU.slab;
    // ends tapered into the land
    const sec = [[-half - 6, -1.2], [-half, top], [half, top], [half + 6, -1.2]];
    sec.forEach(([w, y], j) => { bpos.push(p.x + nx2 * w, y, p.z + nz2 * w); buv.push(i / NS * LEN / 8, j / 3 * 4); });
    if (i < NS) for (let j = 0; j < 3; j++) { const a = i * 4 + j, b = a + 4; bidx.push(a, b, a + 1, a + 1, b, b + 1); }
  }
  const bgeo = new THREE.BufferGeometry(); bgeo.setAttribute('position', new THREE.Float32BufferAttribute(bpos, 3)); bgeo.setAttribute('uv', new THREE.Float32BufferAttribute(buv, 2)); bgeo.setIndex(bidx); bgeo.computeVertexNormals();
  const slab = mesh3(scene, bgeo, stone3({ col: '#8E8270', rows: 10, cols: 7, seed: 4, speck: .6, mottle: 1.4, bumpK: 3, rough: .95 }));
  const rockGeo = (() => { const g = new THREE.IcosahedronGeometry(1, 1), p = g.attributes.position, r = lcg(8); for (let i = 0; i < p.count; i++) { const k = .75 + r() * .5; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * .7, p.getZ(i) * k); } g.computeVertexNormals(); return g; })();
  const inst = (geo, mat, n, place) => {
    const m = new THREE.InstancedMesh(geo, mat, n), ss = [], d = new THREE.Object3D(), r = lcg(n);
    const rows = []; for (let i = 0; i < n; i++) rows.push(place(r, i)); rows.sort((a, b) => a.s - b.s);
    rows.forEach((w, i) => { d.position.set(...w.p); d.rotation.set(...w.rot); d.scale.set(...w.sc); d.updateMatrix(); m.setMatrixAt(i, d.matrix); if (w.col) m.setColorAt(i, new THREE.Color(w.col)); ss.push(w.s); });
    m.castShadow = m.receiveShadow = true; scene.add(m); m.ss = ss; m.frustumCulled = false; return m;
  };
  const onBridge = (r, s, spread = 1) => { const p = path(s), w = (r() - .5) * BW * spread; return [p.x - p.dz * w, p.z + p.dx * w]; };
  const rockCols = ['#7E7466', '#958A78', '#6A6258', '#A49884', '#857A6A'];
  const rocks = inst(rockGeo, new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: .9, flatShading: true }), 9000, (r) => { const s = r(), [x, z] = onBridge(r, s, 1.08), k = .35 + Math.pow(r(), 2) * 1.3; return { s, p: [x, SETU.slab + k * .25, z], rot: [r() * 3, r() * 6, r() * 3], sc: [k, k, k], col: rockCols[Math.floor(r() * 5)] }; });
  const logs = inst(new THREE.CylinderGeometry(.09, .12, 2.6, 6), new THREE.MeshStandardMaterial({ color: '#6A4A30', roughness: .9 }), 2600, (r) => { const s = r(), [x, z] = onBridge(r, s, .95); return { s, p: [x, SETU.slab + .25, z], rot: [Math.PI / 2, r() * 6, 0], sc: [1, .6 + r() * .8, 1] }; });
  const crowns = inst(new THREE.IcosahedronGeometry(.7, 0), new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: .9, flatShading: true }), 1100, (r) => { const s = r(), [x, z] = onBridge(r, s, .9), k = .6 + r() * .9; return { s, p: [x, SETU.slab + .45, z], rot: [r(), r() * 6, r()], sc: [k * 1.2, k * .6, k], col: ['#3E6A2A', '#4E7A30', '#2E5A28', '#5A7A34'][Math.floor(r() * 4)] }; });
  const bridge = {
    set(on) {
      on = clamp(on); slab.visible = on > .001; bgeo.setDrawRange(0, Math.floor(on * NS) * 18);
      for (const m of [rocks, logs, crowns]) { let n = 0; while (n < m.ss.length && m.ss[n] <= on) n++; m.count = n; m.visible = n > 0; }
    }, width: BW, slab, rocks,
  };
  bridge.set(0);

  // ---- rocks and trees flying in at the front, and their splashes
  const FLY = 26, flyR = [], flyT = [], spl = [], rf = lcg(91);
  const rockM = new THREE.MeshStandardMaterial({ color: '#8A7E6C', roughness: .9, flatShading: true });
  for (let i = 0; i < FLY; i++) {
    const tree = i % 3 === 2, g = new THREE.Group(); scene.add(g);
    if (tree) { mesh3(g, new THREE.CylinderGeometry(.08, .12, 2.4, 6), new THREE.MeshStandardMaterial({ color: '#6A4A30', roughness: .9 })); mesh3(g, new THREE.IcosahedronGeometry(.9, 0), new THREE.MeshStandardMaterial({ color: '#3E6A2A', roughness: .9, flatShading: true }), [0, 1.3, 0], { scale: [1, .7, 1] }); }
    else mesh3(g, rockGeo, rockM, [0, 0, 0], { scale: .5 + rf() * .9 });
    g.userData = { ph: rf(), per: 1.6 + rf() * 1.2, lat: (rf() - .5) * .9, back: .015 + rf() * .03, fwd: rf() * .012, hgt: 6 + rf() * 9, spin: [rf() * 4, rf() * 4, rf() * 4] };
    flyR.push(g);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: splashTex3(), transparent: true, depthWrite: false, opacity: 0 })); sp.center.set(.5, .1); scene.add(sp); spl.push(sp);
  }
  const fly = {
    set(t, front, on = 1) {
      flyR.forEach((g, i) => {
        const u = g.userData, k = ((t / u.per + u.ph) % 1), vis = on > .01; g.visible = vis && k < .7; spl[i].visible = vis && k >= .55;
        const a = path(Math.max(0, front - u.back)), b = path(Math.min(1, front + u.fwd)), la = u.lat * BW, f = clamp(k / .7);
        const x0 = a.x - a.dz * la * .6, z0 = a.z + a.dx * la * .6, x1 = b.x - b.dz * la, z1 = b.z + b.dx * la;
        g.position.set(lerp(x0, x1, f), SETU.slab + 4 * u.hgt * f * (1 - f) + lerp(.5, -.4, f), lerp(z0, z1, f));
        g.rotation.set(u.spin[0] * f * 3, u.spin[1] * f * 3, u.spin[2] * f * 3);
        const sk = clamp((k - .55) / .45), s = spl[i]; s.position.set(x1, 0, z1); s.scale.set(4 + 6 * sk, (3 + 8 * Math.sin(sk * Math.PI)) * (1 - sk * .3), 1); s.material.opacity = .9 * Math.sin(sk * Math.PI) * on;
      });
    },
  };
  fly.set(0, 0, 0);

  // ---- the army's torches on the bridge
  const NA = 2600, ag = new THREE.BufferGeometry(), apos = new Float32Array(NA * 3), ar = lcg(12), aseed = [];
  for (let i = 0; i < NA; i++) aseed.push([ar(), (ar() - .5) * .85, ar()]);
  ag.setAttribute('position', new THREE.BufferAttribute(apos, 3));
  const armyPts = new THREE.Points(ag, new THREE.PointsMaterial({ map: glowTex3(), color: '#FFB860', size: 1.6, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); armyPts.frustumCulled = false; scene.add(armyPts);
  const army = {
    set(t, front, on = 1, o2 = {}) {
      armyPts.visible = on > .01; armyPts.material.opacity = on; armyPts.material.size = o2.size ?? 1.6;
      const tail = o2.tail ?? 0;
      aseed.forEach(([a, l, ph], i) => { const s = lerp(tail, front, ((a + t * (o2.speed ?? .004)) % 1)), p = path(s), w = l * BW, fl = .08 * Math.sin(t * 9 + ph * 40);
        apos[i * 3] = p.x - p.dz * w; apos[i * 3 + 1] = SETU.slab + .9 + fl; apos[i * 3 + 2] = p.z + p.dx * w; });
      ag.attributes.position.needsUpdate = true;
    },
  };
  army.set(0, 0, 0);

  // ---- fire arrows: a bright head and a trail, flying from `from` to `to` ([x, y, z]) over .9 s from t0
  const arrows = [0, 1, 2, 3, 4].map(() => {
    const g = new THREE.Group(); scene.add(g);
    const head = glow3(g, [0, 0, 0], 6, '#FFD080', 1), core = glow3(g, [0, 0, 0], 2, '#FFFFFF', 1);
    const trail = mesh3(g, new THREE.CylinderGeometry(.05, .22, 1, 8, 1, true), new THREE.MeshBasicMaterial({ color: '#FF9A40', transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }), [0, 0, 0], { cast: false, receive: false });
    return { g, head, core, trail };
  });
  const flash = glow3(scene, [0, 0, 0], 60, '#FFB060', 0);
  const arrowsAPI = {
    set(t, shots = []) {
      arrows.forEach(a => a.g.visible = false); flash.visible = false;
      shots.forEach(([t0, from, to], i) => {
        const a = arrows[i]; if (!a) return; const k = (t - t0) / .9;
        if (k > 0 && k < 1) {
          const p = V3(...from).lerp(V3(...to), k); p.y += Math.sin(k * Math.PI) * 6; a.g.visible = true; a.g.position.copy(p);
          const back = V3(...from).lerp(V3(...to), Math.max(0, k - .12)); back.y += Math.sin(Math.max(0, k - .12) * Math.PI) * 6;
          const d = p.clone().sub(back), l = d.length(); a.trail.scale.set(1, l, 1); a.trail.position.copy(d.clone().multiplyScalar(-.5));
          a.trail.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize());
        }
        const f = t - t0 - .9; if (f > 0 && f < 1.2) { flash.visible = true; flash.position.set(to[0], 2, to[2]); flash.material.opacity = Math.exp(-f * 3); flash.scale.setScalar(40 + f * 80); }
      });
    },
  };

  // ---- the Ocean god's light: an emerald-and-gold beam rising out of the sea, rings spreading on the water
  const godAt = path(.5);
  const god = pillar3(scene, [godAt.x + 60, 0, godAt.z - 140], { h: 260, r: 7, col: '#8FF0C8' });
  const godSun = glow3(scene, [godAt.x + 60, 30, godAt.z - 140], 160, '#FFD890', 0);
  const rings = [0, 1, 2].map(() => { const m = mesh3(scene, new THREE.RingGeometry(.92, 1, 96), new THREE.MeshBasicMaterial({ color: '#BFFFE8', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), [godAt.x + 60, .2, godAt.z - 140], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false }); return m; });
  god.at = [godAt.x + 60, 0, godAt.z - 140];
  const godAPI = {
    at: god.at,
    set(t, on) {
      god.set(t, on); godSun.visible = on > .01; godSun.material.opacity = .8 * on; godSun.position.y = 10 + 40 * easeOut(on);
      rings.forEach((m, i) => { const k = ((t * .35 + i / 3) % 1); m.visible = on > .01; m.scale.setScalar(20 + k * 160); m.material.opacity = on * (1 - k) * .6; });
    },
  };
  godAPI.set(0, 0);
  // a fire on Rameswaram's shore (Ram's camp)
  const campP = SETU.xz(79.425, 9.172), fire = flame3(scene, [campP[0], h(campP[0], campP[1]) + .05, campP[1]], 6, { power: 30, range: 40 });
  fire.set(0, 0);
  // the moon
  const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: moonTex3(), transparent: true, depthWrite: false, fog: false })); moon.scale.setScalar(150); scene.add(moon);
  const sunDisc = glow3(scene, [0, 0, 0], 220, '#FFF2D8', 1), sunHalo = glow3(scene, [0, 0, 0], 900, '#FFC080', .45);

  let curWave = 0;
  const mood = (name, mo = {}) => {
    const M = SETU_MOODS[name];
    for (const k in skies) skies[k].visible = k === name;
    hemi.color.set(M.hemi[0]); hemi.groundColor.set(M.hemi[1]); hemi.intensity = mo.hemi ?? M.hemi[2];
    sun.color.set(mo.sunCol || M.sun[0]); sun.intensity = mo.sun ?? M.sun[1];
    const d = V3(...(mo.sunAt || M.sun[2])).normalize(), c = mo.at || [0, 0, 0], ext = mo.shadow ?? 120;
    sun.target.position.set(...c); sun.position.set(c[0] + d.x * 600, c[1] + d.y * 600, c[2] + d.z * 600);
    Object.assign(sun.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 50, far: 1400 }); sun.shadow.camera.updateProjectionMatrix();
    scene.fog.color.set(mo.fogCol || M.fog[0]); scene.fog.near = mo.fogNear ?? M.fog[1]; scene.fog.far = mo.fogFar ?? M.fog[2];
    const night = name === 'night';
    sunDisc.visible = sunHalo.visible = !night && d.y > -.05 && mo.disc !== false; sunDisc.position.copy(d).multiplyScalar(4500); sunHalo.position.copy(sunDisc.position);
    sunDisc.material.color.set(M.sun[0]); sunHalo.material.color.set(name === 'day' ? '#FFE0B0' : '#FF9A60');
    milky.visible = night && (mo.milky ?? 1) > 0; milky.material.opacity = mo.milky ?? 1;
    moon.visible = !!mo.moon; if (mo.moon) moon.position.set(...mo.moon);
    if (!envs[name]) { const tmp = new THREE.Scene(); tmp.add(sky3(tmp, M.sky, { r: 100 })); envs[name] = envRT.fromScene(tmp, 0, .1, 300).texture; }
    water.envMap = outer.material.envMap = envs[name]; water.envMapIntensity = outer.material.envMapIntensity = mo.reflect ?? (night ? .6 : .55);
    return mo.exposure ?? M.exposure;
  };
  // set(t, o): the water (o.waves 0..1, o.impacts [[x, z, t0, amp], ...], o.swell), the ripples' drift
  const set = (t, so = {}) => {
    WU.uT.value = t; WU.uWave.value = so.waves ?? 0; WU.uClear.value = so.clear ?? 1; water.normalScale.setScalar(so.ripple ?? .3); WU.uSwell.value = so.swell ?? .02; curWave = so.waves ?? 0;
    const imp = so.impacts || []; WU.uImp.value.forEach((v, i) => imp[i] ? v.set(...imp[i]) : v.set(0, 0, -99, 0));
    water.normalMap.offset.set(t * .004, t * .003); outer.material.normalMap && outer.material.normalMap.offset.set(t * .004, t * .003);
  };
  set(0);
  return { scene, ground, sea, water, sun, hemi, mood, set, ll: SETU.xz, h, elev, path, near, bridge, fly, army, arrows: arrowsAPI, god: godAPI, fire, shoal, moon, milky, len: LEN, BW };
}
