// shaligram_props.js: the objects of "This stone is 150 MILLION years old" (ad 61): the Shaligram (a polished black
// nodule with an ammonite's whorl in relief on its face, pyrite gold in the grooves), the stone split open on its
// polished median section (the chambers, the septa, honey calcite, the body chamber full of black matrix), the living
// ammonite (a ribbed, banded, nacreous shell coiled as a log spiral, its head and tentacles), the tulsi plant, the Sudarshan
// chakra in gold, and the light-beings of the Purana scenes. Sets are in shaligram_sets.js.

// ---------- noise (JS, for building meshes) ----------
const nH3 = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
function noise3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), fx = x - xi, fy = y - yi, fz = z - zi;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
  const L = (a, b, k) => a + (b - a) * k, c = (i, j, k) => nH3(xi + i, yi + j, zi + k);
  return L(L(L(c(0, 0, 0), c(1, 0, 0), u), L(c(0, 1, 0), c(1, 1, 0), u), v), L(L(c(0, 0, 1), c(1, 0, 1), u), L(c(0, 1, 1), c(1, 1, 1), u), v), w) * 2 - 1;
}
const fbm3 = (x, y, z, n = 4) => { let s = 0, a = .5, f = 1; for (let i = 0; i < n; i++) { s += a * noise3(x * f, y * f, z * f); f *= 2.1; a *= .5; } return s; };

// ---------- the ammonite's spiral (shared by the stone's relief, the cut face and the living shell) ----------
// r(φ) = a·e^(bφ): each whorl twice as wide as the one inside it (W = e^(2πb) = 2.1)
const SPIRAL = { b: Math.log(2.1) / TAU, turns: 4.2 };
// for a point at radius r, angle θ in the coiling plane (outer radius 1): s, the position across the whorls (an integer
// at each whorl's outer edge), and which whorl it is in
function whorlAt(r, th) {
  const { b, turns } = SPIRAL, ph = Math.log(Math.max(r, 1e-4)) / b;   // φ at which the spiral reaches r (outer edge at φ = 0 → r = 1)
  const s = (ph - th) / TAU;                                             // whorls counted outward from the outer edge
  return { s, f: s - Math.floor(s), k: Math.floor(s), inner: -s > turns };
}

// ---------- the stone ----------
// The nodule: an ellipsoid, lumpy at low frequency; on its face (+z) the ammonite's outside in relief: the whorls domed,
// the sutures between them grooved, ribs across the outer whorls, the umbilicus sunk at the centre.
const STONE = { sx: 1, sy: .8, sz: .64, face: .78 };
function stoneR(d, o = {}) {
  let r = 1 + .055 * fbm3(d.x * 1.3 + 3, d.y * 1.3, d.z * 1.3) + .012 * fbm3(d.x * 5, d.y * 5 + 7, d.z * 5);
  let metal = 0, relief = 0, sp = 2;
  const m = smooth01((d.z - .3) / .35);
  if (m > 0 && o.face !== false) {
    const px = d.x / (1 + d.z) / .62, py = d.y / (1 + d.z) / .62, rr = Math.hypot(px, py) / STONE.face, th = Math.atan2(py, px) + .6;
    if (m > .01) sp = rr;
    if (rr < 1.08) {
      const w = whorlAt(Math.min(rr, 1), th), edge = Math.min(w.f, 1 - w.f), outer = clamp(1 - (-w.s) / 3);
      const dome = Math.sqrt(Math.max(0, Math.sin(Math.PI * w.f))), groove = Math.exp(-Math.pow(edge / .07, 2));
      const ribs = Math.pow(Math.abs(Math.sin(th * 13 + w.k * 1.7)), 6) * outer * dome;
      const fade = 1 - smooth01((rr - .9) / .18);
      relief = (.016 * dome - .022 * groove + .006 * ribs) * fade - .04 * Math.exp(-Math.pow(rr / .12, 2));
      const patchy = smooth01((fbm3(d.x * 4 + 2, d.y * 4, d.z * 4) + .05) / .25);
      metal = clamp(groove * patchy * fade + .35 * smooth01((fbm3(d.x * 9, d.y * 9, d.z * 9) - .3) / .2) * dome * fade);
    }
  }
  return { r: r + relief * m, r0: r, metal: metal * m, sp };
}
function smooth01(x) { x = clamp(x); return x * x * (3 - 2 * x); }
// stoneGeo(o): the nodule's geometry; o.half: 'back' builds only z ≤ 0 (the half left when the front lifts off), whose
// cut face is a separate cap (cutFace3). Every vertex carries aMetal (pyrite).
function stoneGeo(o = {}) {
  const g = o.half ? new THREE.SphereGeometry(1, 320, 200, Math.PI, Math.PI) : new THREE.SphereGeometry(1, 384, 256);
  const g0 = g.clone(), p = g.attributes.position, p0 = g0.attributes.position, n = p.count, d = V3();
  const metal = new Float32Array(n), spA = new Float32Array(n), rel = new Float32Array(n);
  const sc = (v, r) => [v.x * r * STONE.sx, v.y * r * STONE.sy, (o.half ? Math.min(0, v.z) : v.z) * r * STONE.sz];
  for (let i = 0; i < n; i++) {
    d.set(p.getX(i), p.getY(i), p.getZ(i)).normalize();
    const s = stoneR(d, { face: !o.half });
    const a = sc(d, s.r), b = sc(d, s.r0); p.setXYZ(i, ...a); p0.setXYZ(i, ...b);
    metal[i] = s.metal; spA[i] = s.sp; rel[i] = Math.sign(s.r - s.r0) * Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  }
  g.computeVertexNormals(); g0.computeVertexNormals();
  g.setAttribute('aMetal', new THREE.BufferAttribute(metal, 1)); g.setAttribute('aSp', new THREE.BufferAttribute(spA, 1));
  g.setAttribute('aRel', new THREE.BufferAttribute(rel, 1)); g.setAttribute('aN0', g0.attributes.normal.clone());
  g0.dispose(); return g;
}
// pits and pores in the polish (a normal map from a canvas height field)
const pitNormal3 = () => tex3('pitN', 512, 512, (g, w, h) => {
  const hc = document.createElement('canvas'); hc.width = w; hc.height = h; const x = hc.getContext('2d'), r = lcg(17);
  x.fillStyle = '#808080'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 2600; i++) { const px = r() * w, py = r() * h, s = r() < .9 ? .6 + r() * 1.4 : 2 + r() * 3; x.fillStyle = `rgba(0,0,0,${.25 + r() * .5})`; x.beginPath(); x.arc(px, py, s, 0, TAU); x.fill(); }
  x.filter = 'blur(1px)'; x.drawImage(hc, 0, 0);
  const id = x.getImageData(0, 0, w, h).data, o = g.createImageData(w, h), H_ = (X, Y) => id[(((Y + h) % h) * w + ((X + w) % w)) * 4] / 255;
  for (let y = 0; y < h; y++) for (let X = 0; X < w; X++) {
    const dx = (H_(X + 1, y) - H_(X - 1, y)) * 2.2, dy = (H_(X, y + 1) - H_(X, y - 1)) * 2.2, l = Math.hypot(dx, dy, 1), k = (y * w + X) * 4;
    o.data[k] = (-dx / l * .5 + .5) * 255; o.data[k + 1] = (dy / l * .5 + .5) * 255; o.data[k + 2] = (1 / l * .5 + .5) * 255; o.data[k + 3] = 255;
  }
  g.putImageData(o, 0, 0);
}, { data: true });
// the stone's material: black polished chert, clear-coated; pyrite where aMetal says (gold, metallic)
function stoneMat3(o = {}) {
  const m = new THREE.MeshPhysicalMaterial({ color: o.col || '#121215', roughness: o.rough ?? .3, metalness: 0, clearcoat: o.clear ?? .85, clearcoatRoughness: .08,
    normalMap: pitNormal3().rep(3, 3), normalScale: new THREE.Vector2(.25, .25), sheen: 0 });
  // carve (0..1.1): the relief and its pyrite exist inside radius `carve` on the face (the creatures' teeth working
  // outward), a gold glow on the front; 2 = all carved
  const U = { gold: { value: new THREE.Color(o.gold || '#D9A441') }, goldK: { value: o.goldK ?? 1 }, carve: { value: 2 }, front: { value: 0 }, heat: { value: 0 } };
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = 'attribute float aMetal, aSp, aRel; attribute vec3 aN0; uniform float carve; varying float vMetal, vFront, vSp;\n' + sh.vertexShader
      .replace('#include <beginnormal_vertex>', 'float cv = clamp((carve - aSp) / .035, 0., 1.);\nvec3 objectNormal = normalize(mix(aN0, normal, cv));\n#ifdef USE_TANGENT\nvec3 objectTangent = vec3(tangent.xyz);\n#endif')
      .replace('#include <begin_vertex>', 'vec3 transformed = position - normalize(position) * aRel * (1. - cv);\nvMetal = aMetal * cv; vSp = aSp; vFront = exp(-pow((aSp - carve) / .014, 2.));');
    sh.fragmentShader = 'varying float vMetal, vFront, vSp; uniform vec3 gold; uniform float goldK, front, heat;\n' + sh.fragmentShader
      .replace('#include <color_fragment>', '#include <color_fragment>\nfloat gm = clamp(vMetal * goldK, 0., 1.); diffuseColor.rgb = mix(diffuseColor.rgb, gold, gm);')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = mix(metalnessFactor, 1., gm); roughnessFactor = mix(roughnessFactor, .26, gm);')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(1., .72, .3) * (vFront * front * 2.2 + heat * 5.);');
  };
  m.U = U;
  m.setGold = (k) => { U.goldK.value = k; };
  return m;
}

// ---------- the cut face: the ammonite's median section, polished ----------
// A 2048² painting: dark nodule matrix; the shell's spiral wall; the chambers, each closed by a septum curving back
// from the aperture, filled with honey calcite and crystals, some rimmed in pyrite; the body chamber (the last 0.6 of a
// whorl) full of black matrix; the protoconch at the centre. Its height field (septa and wall proud) becomes the bump map.
function cutPaint(g, S, bump) {
  const C = S / 2, R = S * .43, { b } = SPIRAL, rOf = ph => R * Math.exp(b * ph), rnd = lcg(61);
  const XY = (ph, k = 1) => { const r = rOf(ph) * k, a = ph - .6; return [C + r * Math.cos(a), C - r * Math.sin(a)]; };
  // matrix: dark grey-brown nodule rock, mottled and speckled
  g.fillStyle = bump ? '#404040' : '#2B2725'; g.fillRect(0, 0, S, S);
  if (!bump) {
    for (let i = 0; i < 90; i++) { const x = rnd() * S, y = rnd() * S, r = S * (.03 + rnd() * .1), gr = g.createRadialGradient(x, y, 0, x, y, r); const dk = rnd() < .55; gr.addColorStop(0, dk ? 'rgba(10,9,9,.35)' : 'rgba(80,72,66,.3)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    for (let i = 0; i < 14000; i++) { g.fillStyle = rnd() < .5 ? `rgba(110,100,92,${rnd() * .35})` : `rgba(0,0,0,${rnd() * .35})`; g.fillRect(rnd() * S, rnd() * S, 1 + rnd() * 2, 1 + rnd() * 2); }
  }
  const PH0 = -SPIRAL.turns * TAU, BODY = -.55 * TAU;
  const band = (pa, pb) => {
    g.beginPath(); const n = 60;
    for (let i = 0; i <= n; i++) { const ph = lerp(pa, pb, i / n), [x, y] = XY(ph); i ? g.lineTo(x, y) : g.moveTo(x, y); }
    for (let i = n; i >= 0; i--) { const ph = lerp(pa, pb, i / n), [x, y] = XY(ph - TAU); g.lineTo(x, y); }
    g.closePath();
  };
  // chambers: the innermost whorls grey calcite, then white sparry calcite, the outer ones honey and amber
  const sep = [];
  for (let ph = PH0 + TAU * .9; ph < BODY; ph += .34 + .1 * rnd()) sep.push(ph);
  for (let i = 0; i < sep.length - 1; i++) {
    const pa = sep[i], pb = sep[i + 1], depth = (pb - PH0) / (BODY - PH0);
    band(pa, pb);
    if (bump) { g.fillStyle = '#585858'; g.fill(); continue; }
    const [mx, my] = XY((pa + pb) / 2, .8), rr = rOf(pb) * .5, gr = g.createRadialGradient(mx, my, 0, mx, my, rr * 1.5);
    const kind = depth < .28 ? 0 : rnd() < .07 ? 1 : 2;
    if (kind === 0) { gr.addColorStop(0, '#8C8680'); gr.addColorStop(1, '#3E3A36'); }
    else if (kind === 1) { gr.addColorStop(0, '#EDE4D4'); gr.addColorStop(.6, '#B9AE9C'); gr.addColorStop(1, '#5E564C'); }
    else { const w = rnd(), hi = ['#D9A866', '#C98E52', '#E0B878', '#B9824C'][Math.floor(w * 4)]; gr.addColorStop(0, hi); gr.addColorStop(.6, '#8E5A30'); gr.addColorStop(1, '#3A2416'); }
    g.fillStyle = gr; g.fill();
    g.save(); band(pa, pb); g.clip();
    for (let k = 0; k < 12; k++) {   // crystals growing in from the walls
      const ph = lerp(pa, pb, rnd()), inner = rnd() < .5, [x, y] = XY(ph - (inner ? TAU : 0)), a = Math.atan2(y - C, x - C) + (inner ? 0 : Math.PI) + (rnd() - .5) * 1.1, l = rOf(pb) * (.05 + rnd() * .16);
      g.fillStyle = kind === 2 ? `rgba(255,226,170,${.12 + rnd() * .22})` : `rgba(255,255,255,${.1 + rnd() * .2})`;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a + .14) * l, y + Math.sin(a + .14) * l); g.lineTo(x + Math.cos(a) * l * 1.2, y + Math.sin(a) * l * 1.2); g.lineTo(x + Math.cos(a - .14) * l, y + Math.sin(a - .14) * l); g.fill();
    }
    g.restore();
  }
  // the body chamber: matrix, a little paler than the nodule round it
  band(BODY, 0); g.fillStyle = bump ? '#3E3E3E' : '#36302C'; g.fill();
  if (!bump) { g.save(); band(BODY, 0); g.clip(); for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(${rnd() < .5 ? '150,140,130' : '0,0,0'},${rnd() * .3})`; g.fillRect(rnd() * S, rnd() * S, 2, 2); } g.restore(); }
  // the septa: thin shell walls, each a slightly different bow, a few rimmed in pyrite
  for (const ph of sep) {
    const n = 16, k0 = rOf(ph - TAU) / rOf(ph), bw = .12 + .08 * rnd();
    g.beginPath();
    for (let i = 0; i <= n; i++) { const u = i / n, k = lerp(.995, k0 * 1.005, u), bow = bw * Math.sin(Math.PI * u), [x, y] = XY(ph - bow, k); i ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.lineCap = 'round';
    if (bump) { g.strokeStyle = '#B8B8B8'; g.lineWidth = S * .0032; g.stroke(); continue; }
    const py = rnd() < .22;
    if (py) { g.strokeStyle = 'rgba(214,164,64,.9)'; g.lineWidth = S * .005; g.stroke(); }
    g.strokeStyle = py ? '#F2D58E' : 'rgba(236,226,208,.85)'; g.lineWidth = S * .0018; g.stroke();
  }
  // the shell wall: the spiral itself, thin and pale, gold only in places
  for (let pass = 0; pass < (bump ? 1 : 2); pass++) {
    g.beginPath(); for (let i = 0; i <= 900; i++) { const ph = lerp(PH0, 0, i / 900), [x, y] = XY(ph); i ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.lineJoin = 'round';
    if (bump) { g.strokeStyle = '#D8D8D8'; g.lineWidth = S * .006; g.stroke(); }
    else if (pass === 0) { g.strokeStyle = 'rgba(150,110,60,.9)'; g.lineWidth = S * .008; g.stroke(); }
    else { g.strokeStyle = 'rgba(240,226,196,.9)'; g.lineWidth = S * .0026; g.stroke(); }
  }
  { const [x, y] = XY(PH0, 1); g.beginPath(); g.arc(x, y, S * .005, 0, TAU); g.fillStyle = bump ? '#C0C0C0' : '#E8D8B0'; g.fill(); }
  // the rind of the nodule at the edge of the cut
  if (!bump) { const gr = g.createRadialGradient(C, C, S * .42, C, C, S * .5); gr.addColorStop(0, 'rgba(60,56,52,0)'); gr.addColorStop(1, 'rgba(96,88,80,.7)'); g.fillStyle = gr; g.fillRect(0, 0, S, S); }
}
const cutTex3 = () => tex3('cut', 2048, 2048, (g, S) => cutPaint(g, S, false));
const cutBump3 = () => tex3('cutB', 1024, 1024, (g, S) => { g.filter = 'blur(2px)'; cutPaint(g, S, true); }, { data: true });
// cutFace3(parent): the polished face of the back half, at z = 0 facing +z: the outline of the nodule in that plane
function cutFace3(parent, mat) {
  const sh = new THREE.Shape(), n = 240, d = V3();
  for (let i = 0; i <= n; i++) { const a = i / n * TAU; d.set(Math.cos(a), Math.sin(a), 0); const r = stoneR(d, { face: false }).r; const x = d.x * r * STONE.sx, y = d.y * r * STONE.sy; i ? sh.lineTo(x, y) : sh.moveTo(x, y); }
  const geo = new THREE.ShapeGeometry(sh, 64), p = geo.attributes.position, uv = geo.attributes.uv;
  // the painting's spiral sits centred, its outer whorl a little inside the rim
  for (let i = 0; i < p.count; i++) uv.setXY(i, .5 + p.getX(i) / (STONE.sx * 2 * .93), .5 + p.getY(i) / (STONE.sx * 2 * .93));
  const m = mesh3(parent, geo, mat, [0, 0, .0005], { cast: false });
  return m;
}
const cutMat3 = () => new THREE.MeshPhysicalMaterial({ map: cutTex3(), bumpMap: cutBump3(), bumpScale: 1.5, roughness: .32, clearcoat: 1, clearcoatRoughness: .05, metalness: 0 });

// shaligram3(parent): the whole stone and its split. Returns { group, whole, back, front, set(t, o) }:
// o.split 0..1 (the front half lifts toward the camera and swings off to the right, the back half's polished face stays),
// o.gold (pyrite strength), o.glow (the spiral lit from within, gold, for the Purana beats: the chakra).
function shaligram3(parent) {
  const group = new THREE.Group(); parent.add(group);
  const mat = stoneMat3(), whole = mesh3(group, stoneGeo(), mat);
  const back = new THREE.Group(); group.add(back);
  mesh3(back, stoneGeo({ half: 1 }), stoneMat3()); const face = cutFace3(back, cutMat3());
  const front = new THREE.Group(); group.add(front);
  const fg = stoneGeo(); { const p = fg.attributes.position; for (let i = 0; i < p.count; i++) if (p.getZ(i) < 0) p.setZ(i, 0); fg.computeVertexNormals(); }
  const fm = mesh3(front, fg, mat);
  const set = (t, o = {}) => {
    const s = clamp(o.split ?? 0);
    whole.visible = s <= 0; back.visible = front.visible = s > 0;
    front.position.set(s * 2.6, s * .5, .2 + s * 1.6); front.rotation.set(0, s * 1.9, s * .3);
    mat.setGold(o.gold ?? 1); mat.U.carve.value = o.carve ?? 2; mat.U.front.value = o.front ?? 0; mat.U.heat.value = o.heat ?? 0;
  };
  set(0);
  return { group, whole, back, front, face, mat, set };
}

// ---------- the living ammonite ----------
// The shell: a tube coiled on the log spiral, its section an ellipse (narrower across), ribbed; cream with brown bands,
// nacre iridescent. The head at the aperture: a soft hood, an eye each side, ten tentacles. ammonite3(parent, o) →
// { group, set(t, o) }: o.swim (the jet pulse, tentacles trailing), o.k (size), o.bands (colour stripes).
function ammonite3(parent, o = {}) {
  const group = new THREE.Group(); parent.add(group);
  const { b, turns } = SPIRAL, R = 1, nU = 560, nV = 28, ph0 = -turns * TAU;
  const pos = [], col = [], idx = [], base = new THREE.Color(o.col || '#E8D9BC'), band = new THREE.Color(o.band || '#7A4A26');
  for (let i = 0; i <= nU; i++) {
    const ph = lerp(ph0, 0, i / nU), ro = R * Math.exp(b * ph), ri = R * Math.exp(b * (ph - TAU)), rc = (ro + ri) / 2, rt = (ro - ri) / 2;
    const rib = 1 + .035 * Math.pow(Math.abs(Math.sin(ph * 19)), 3) * clamp((ph - ph0) / 8), a = ph;
    const cx = rc * Math.cos(a), cy = rc * Math.sin(a);
    const stripe = smooth01((Math.sin(ph * 3.4 + Math.sin(ph * .9) * 1.5) - .2) / .5) * clamp((ph - ph0 - 3) / 4);
    for (let j = 0; j <= nV; j++) {
      const v = j / nV * TAU, er = rt * rib * (1 + .25 * Math.cos(v)) * .98;
      const rr = rc + Math.cos(v) * er, z = Math.sin(v) * er * .72;
      pos.push(rr * Math.cos(a), rr * Math.sin(a), z);
      const c = base.clone().lerp(band, stripe * .92 * (.5 + .5 * Math.cos(v))).multiplyScalar(.75 + .25 * clamp((ph - ph0) / 10));
      c.multiplyScalar(.85 + .15 * Math.cos(v)); col.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < nU; i++) for (let j = 0; j < nV; j++) { const a = i * (nV + 1) + j, b2 = a + nV + 1; idx.push(a, b2, a + 1, b2, b2 + 1, a + 1); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); geo.setIndex(idx); geo.computeVertexNormals();
  const shellMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .35, clearcoat: .6, clearcoatRoughness: .2, iridescence: .45, iridescenceIOR: 1.6, iridescenceThicknessRange: [200, 700], sheen: .2 });
  const shell = mesh3(group, geo, shellMat);
  // the head, out of the aperture: at φ = 0, the tube's centre (rc0, 0), facing along the spiral's tangent (+y)
  const rc0 = (R + R * Math.exp(-b * TAU)) / 2, rt0 = (R - R * Math.exp(-b * TAU)) / 2;
  // the aperture opens along +y at (rc0, 0): the head sits in it, the arms reach out forward (+y)
  const head = new THREE.Group(); head.position.set(rc0, 0, 0); group.add(head);
  const skin = new THREE.MeshPhysicalMaterial({ color: o.skin || '#9A5A44', roughness: .45, sheen: .7, sheenColor: new THREE.Color('#FFC8A8'), clearcoat: .4, clearcoatRoughness: .3 });
  const hood = mesh3(head, new THREE.SphereGeometry(rt0 * .9, 40, 30), skin, [0, rt0 * .05, 0], { scale: [.95, .7, .7] });
  const eyeM = new THREE.MeshPhysicalMaterial({ color: '#050506', roughness: .02, clearcoat: 1 });
  for (const s of [-1, 1]) mesh3(head, new THREE.SphereGeometry(rt0 * .13, 20, 14), eyeM, [-rt0 * .05, rt0 * .32, s * rt0 * .58]);
  const arms = [];
  for (let k = 0; k < 10; k++) {
    const a = k / 10 * TAU, cv = new THREE.CatmullRomCurve3([...Array(7)].map(() => V3()));
    const m = mesh3(head, new THREE.TubeGeometry(cv, 24, rt0 * .06, 8), skin);
    arms.push({ a, m, cv, len: rt0 * (1.3 + (k % 3) * .3) });
  }
  const set = (t, so = {}) => {
    const sw = so.swim ?? 1, pulse = Math.sin(t * 2.4 + (o.ph || 0));
    for (const A of arms) {
      const pts = [];
      for (let i = 0; i < 7; i++) {
        const u = i / 6, spread = rt0 * .38 * (1 + u * (.5 + .5 * pulse * sw)), wav = .3 * Math.sin(t * 3 + A.a * 2 - u * 4) * u;
        pts.push(V3(Math.cos(A.a) * spread * .7 + wav * rt0 * .5, rt0 * .5 + u * A.len * (.9 - .15 * pulse * sw), Math.sin(A.a) * spread * .7 + wav * rt0 * .4));
      }
      A.m.geometry.dispose(); A.cv.points = pts; A.m.geometry = new THREE.TubeGeometry(A.cv, 20, rt0 * .055, 6);
    }
    hood.scale.set(.95 + .04 * pulse * sw, .7, .7);
  };
  set(0);
  group.scale.setScalar(o.k ?? 1);
  return { group, shell, set };
}

// ---------- the tulsi plant ----------
// tulsi3(parent, o): a bush of opposite-leaved stems (green, the stems purple-brown), with purple flower spikes (manjari)
// at the tips. o.h (height, m), o.seed, o.krishna (the dark-leaved kind). .grow(k) 0..1 grows it from the ground.
const tulsiLeafGeo = (() => {
  const sh = new THREE.Shape(); const n = 40;
  for (let i = 0; i <= n; i++) { const u = i / n, x = .3 * Math.pow(Math.sin(Math.PI * Math.pow(u, .8)), 1.2) * (1 + .05 * Math.sin(u * 48)), y = u; i ? sh.lineTo(x, y) : sh.moveTo(x, y); }
  for (let i = n; i >= 0; i--) { const u = i / n, x = -.3 * Math.pow(Math.sin(Math.PI * Math.pow(u, .8)), 1.2) * (1 + .05 * Math.sin(u * 48)), y = u; sh.lineTo(x, y); }
  const g = new THREE.ShapeGeometry(sh, 4), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, -.25 * x * x * 4 * .3 + .08 * Math.sin(y * Math.PI)); }   // cupped along the midrib
  g.computeVertexNormals(); return g;
})();
function tulsi3(parent, o = {}) {
  const group = new THREE.Group(); parent.add(group);
  const rnd = lcg(o.seed ?? 5), H0 = o.h ?? .5;
  const leafM = new THREE.MeshPhysicalMaterial({ color: o.krishna ? '#3E4A2A' : '#4A8A30', roughness: .5, sheen: .5, sheenColor: new THREE.Color('#D0FFB0'), side: THREE.DoubleSide, clearcoat: .25, clearcoatRoughness: .4 });
  const leafM2 = leafM.clone(); leafM2.color.set(o.krishna ? '#52402E' : '#6AA83E');
  const stemM = new THREE.MeshStandardMaterial({ color: o.krishna ? '#4A2A3A' : '#5A6A30', roughness: .7 });
  const flowerM = new THREE.MeshStandardMaterial({ color: '#7A4A7E', roughness: .6 });
  const parts = [];
  const leaf = (p, out, sz, t0, young) => {
    const lf = new THREE.Mesh(tulsiLeafGeo, young ? leafM2 : leafM); lf.castShadow = lf.receiveShadow = true;
    lf.position.copy(p); lf.quaternion.setFromUnitVectors(V3(0, 1, 0), out); lf.rotateY((rnd() - .5) * .8);
    group.add(lf); parts.push({ m: lf, t0, kind: 'leaf', s: sz });
  };
  const branch = (from, dir, len, depth, t0) => {
    const end = from.clone().add(dir.clone().multiplyScalar(len)), mid = from.clone().lerp(end, .5).add(V3((rnd() - .5) * len * .2, 0, (rnd() - .5) * len * .2));
    const cv = new THREE.QuadraticBezierCurve3(from, mid, end), m = mesh3(group, new THREE.TubeGeometry(cv, 8, H0 * (.004 + .003 * depth), 6), stemM);
    parts.push({ m, t0, kind: 'stem' });
    const pairs = depth === 0 ? 4 : 3;
    for (let i = 1; i <= pairs; i++) {
      const u = i / (pairs + .5), p = cv.getPoint(u), rot = i * Math.PI / 2 + rnd() * .3;
      for (const s of [-1, 1]) leaf(p, V3(Math.cos(rot) * s, .35 + .3 * u, Math.sin(rot) * s).normalize(), H0 * (.1 + .04 * rnd()) * (1.15 - u * .35), t0 + u * .3, false);
    }
    if (depth === 0) {
      // the rosette at the tip, and the purple flower spike rising out of it
      for (let k = 0; k < 4; k++) { const q = k / 4 * TAU + rnd(); leaf(end, V3(Math.cos(q), .9, Math.sin(q)).normalize(), H0 * .06, t0 + .45, true); }
      if (rnd() < (o.flowers ?? .6)) { const sp = mesh3(group, new THREE.CylinderGeometry(H0 * .004, H0 * .01, H0 * .14, 6), flowerM, end.clone().add(dir.clone().multiplyScalar(H0 * .07)).toArray()); sp.quaternion.setFromUnitVectors(V3(0, 1, 0), dir); parts.push({ m: sp, t0: t0 + .55, kind: 'flower' }); }
    }
    if (depth > 0) for (let k = 0; k < 3; k++) { const d2 = dir.clone().add(V3((rnd() - .5) * 1.3, .25, (rnd() - .5) * 1.3)).normalize(); branch(cv.getPoint(.4 + k * .2), d2, len * (.5 + rnd() * .2), depth - 1, t0 + .2 + k * .08); }
  };
  for (let k = 0; k < (o.stems ?? 4); k++) branch(V3((rnd() - .5) * .03 * H0, 0, (rnd() - .5) * .03 * H0), V3((rnd() - .5) * .45, 1, (rnd() - .5) * .45).normalize(), H0 * (.55 + rnd() * .15), 2, k * .06);
  const grow = (k = 1) => {
    group.visible = k > .001;
    for (const P of parts) { const g = smooth01((k - P.t0) / .4); P.m.visible = g > .01; if (P.kind === 'leaf') P.m.scale.setScalar(P.s * g); else P.m.scale.setScalar(Math.max(.001, g)); }
  };
  grow(1);
  return { group, grow };
}
// a single tulsi leaf (falling onto the stone)
function tulsiLeaf3(parent, size = .12) {
  const m = new THREE.Mesh(tulsiLeafGeo, new THREE.MeshPhysicalMaterial({ color: '#5A9A38', roughness: .45, sheen: .6, sheenColor: new THREE.Color('#D8FFB8'), side: THREE.DoubleSide, clearcoat: .4, emissive: '#0E2208' }));
  m.scale.setScalar(size); m.castShadow = true; parent.add(m); return m;
}

// ---------- the Sudarshan chakra in gold (2D, drawn over the frame) ----------
// chakra2d(c, x, y, R, a, t): a ring of spokes and a flaming rim; a lights it.
function chakra2d(c, x, y, R, a, t) {
  if (a <= 0) return;
  c.save(); c.translate(x, y); c.rotate(t * .6); c.globalAlpha = a; c.globalCompositeOperation = 'lighter';
  c.shadowColor = 'rgba(255,170,50,.9)'; c.shadowBlur = R * .12; c.strokeStyle = '#FFD27A'; c.fillStyle = '#FFD27A';
  c.lineWidth = R * .05; c.beginPath(); c.arc(0, 0, R * .8, 0, TAU); c.stroke();
  c.lineWidth = R * .025; c.beginPath(); c.arc(0, 0, R * .62, 0, TAU); c.stroke(); c.beginPath(); c.arc(0, 0, R * .16, 0, TAU); c.stroke();
  for (let i = 0; i < 12; i++) { const q = i / 12 * TAU; c.beginPath(); c.moveTo(Math.cos(q) * R * .16, Math.sin(q) * R * .16); c.lineTo(Math.cos(q) * R * .62, Math.sin(q) * R * .62); c.stroke(); }
  for (let i = 0; i < 24; i++) { const q = i / 24 * TAU, f = 1 + .08 * Math.sin(t * 9 + i * 2); c.beginPath(); c.moveTo(Math.cos(q - .1) * R * .82, Math.sin(q - .1) * R * .82); c.quadraticCurveTo(Math.cos(q + .02) * R * 1.02 * f, Math.sin(q + .02) * R * 1.02 * f, Math.cos(q + .16) * R * .82, Math.sin(q + .16) * R * .82); c.fill(); }
  c.restore();
}

// ---------- the light-beings of the Purana beats ----------
// being3(parent, col, size): a soft orb of light (two additive sprites and a point light), .set(pos, k)
function being3(parent, col, size = .6) {
  const g = new THREE.Group(); parent.add(g);
  const core = glow3(g, [0, 0, 0], size * .5, '#FFFFFF', 1), halo = glow3(g, [0, 0, 0], size * 1.8, col, .6), wide = glow3(g, [0, 0, 0], size * 3.5, col, .16);
  const light = new THREE.PointLight(col, 0, size * 14, 1.6); g.add(light);
  g.set = (p, k = 1, t = 0) => {
    g.visible = k > .001; g.position.set(...p);
    const f = 1 + .06 * Math.sin(t * 5.3) + .04 * Math.sin(t * 8.1);
    core.material.opacity = k; halo.material.opacity = .6 * k; wide.material.opacity = .16 * k;
    core.scale.setScalar(size * .5 * f); halo.scale.setScalar(size * 1.8 * f); light.intensity = 6 * k * f;
  };
  return g;
}

// a soft dark band (under captions or a list)
function band(c, y0, y1, a = .5) {
  if (a <= 0) return; c.save(); const g = c.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, 'rgba(6,4,6,0)'); g.addColorStop(.25, `rgba(6,4,6,${a})`); g.addColorStop(.75, `rgba(6,4,6,${a})`); g.addColorStop(1, 'rgba(6,4,6,0)');
  c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); c.restore();
}
