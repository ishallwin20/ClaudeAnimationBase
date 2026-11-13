// palm_base.js: shared 3D helpers for "Your palm has FOUR holy places" (ad 92), from ads 87/91: JS noise for building meshes, a tapering
// tube along points, a gradient backdrop, a scale texture (unused here).
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
