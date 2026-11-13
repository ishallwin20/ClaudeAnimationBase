// palm_hand.js: a right hand, palm up, built at load from a signed distance field (capsules, ellipsoids, a cupped
// rounded box, palm and finger creases pressed in) and meshed with block-sparse surface nets (1 mm cells), normals
// from the field's gradient, skin colours per vertex (palm lighter, creases darker). For "Your palm has FOUR holy
// places" (ad 92).
// Local frame (metres): the palm faces +y, the fingers point -z, the thumb is on +x, the wrist runs to +z.
//   HAND.build() → { group, mesh, surf(x, z) → { p, n } (the palm-side surface under a point), tips[4], web, sdf }
const HAND = (() => {
  const { sqrt, min, max, abs, exp, cos, sin } = Math;
  const cl = (x) => x < 0 ? 0 : x > 1 ? 1 : x;
  const sstep = (a, b, x) => { const k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k); };
  const smin = (a, b, k) => { const h = max(k - abs(a - b), 0) / k; return min(a, b) - h * h * k * .25; };
  const len3 = (x, y, z) => sqrt(x * x + y * y + z * z);
  // a segment a→b with a radius going r1→r2
  function cap(px, py, pz, a, b, r1, r2) {
    const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2], qx = px - a[0], qy = py - a[1], qz = pz - a[2];
    const h = cl((qx * bx + qy * by + qz * bz) / (bx * bx + by * by + bz * bz));
    return len3(qx - bx * h, qy - by * h, qz - bz * h) - (r1 + (r2 - r1) * h);
  }
  function ell(x, y, z, r) { const k0 = len3(x / r[0], y / r[1], z / r[2]), k1 = len3(x / (r[0] * r[0]), y / (r[1] * r[1]), z / (r[2] * r[2])); return k0 * (k0 - 1) / k1; }
  function rbox(px, py, pz, b, r) {
    const qx = abs(px) - b[0], qy = abs(py) - b[1], qz = abs(pz) - b[2];
    return len3(max(qx, 0), max(qy, 0), max(qz, 0)) + min(max(qx, max(qy, qz)), 0) - r;
  }
  // distance from (x, z) to a polyline in the xz plane
  function pl2(x, z, P) {
    let d = 1e9;
    for (let i = 0; i < P.length - 1; i++) {
      const [ax, az] = P[i], [bx, bz] = P[i + 1], ex = bx - ax, ez = bz - az, h = cl(((x - ax) * ex + (z - az) * ez) / (ex * ex + ez * ez));
      const dx = x - ax - ex * h, dz = z - az - ez * h; d = min(d, dx * dx + dz * dz);
    }
    return sqrt(d);
  }

  // ---- the skeleton ----
  // fingers: knuckle (x, z), splay (radians toward +x), phalanx lengths, base radius
  const FINGERS = [
    { x: .0265, z: -.040, a: .10, L: [.043, .026, .021], r: .0090 },   // index
    { x: .0080, z: -.043, a: .02, L: [.047, .029, .022], r: .0094 },   // middle
    { x: -.0105, z: -.041, a: -.07, L: [.044, .027, .022], r: .0089 }, // ring
    { x: -.0275, z: -.036, a: -.17, L: [.035, .021, .019], r: .0078 }, // little
  ];
  const FLEX = [.16, .30, .18];   // a relaxed, cupped hand: each joint bends toward the palm (+y)
  const fing = FINGERS.map((f) => {
    const d = [sin(f.a), 0, -cos(f.a)], J = [[f.x, .0048, f.z]], dirs = []; let th = 0;
    for (let i = 0; i < 3; i++) {
      th += FLEX[i];
      const dir = [d[0] * cos(th), sin(th), d[2] * cos(th)]; dirs.push(dir);
      const p = J[i]; J.push([p[0] + dir[0] * f.L[i], p[1] + dir[1] * f.L[i], p[2] + dir[2] * f.L[i]]);
    }
    const r = f.r, R = [[r, r * .93], [r * .91, r * .85], [r * .84, r * .80]];
    // palm-side "up" of each segment: perpendicular to its direction, in the plane of d and +y
    const ups = dirs.map((dir, i) => { const t = FLEX.slice(0, i + 1).reduce((s, v) => s + v, 0); return [-d[0] * sin(t), cos(t), -d[2] * sin(t)]; });
    // creases: where the finger meets the palm, and at the two finger joints
    const CR = [[J[0], dirs[0], ups[0], .019], [J[1], dirs[1], ups[1], 0], [J[2], dirs[2], ups[2], 0]].map(([p, dir, up, off]) => ({ c: [p[0] + dir[0] * off, p[1] + dir[1] * off, p[2] + dir[2] * off], dir, up, r }));
    const tip = J[3];
    return { ...f, J, R, dirs, ups, CR, tip };
  });
  const TH = { J: [[.024, -.003, .036], [.053, .003, .004], [.0705, .0105, -.019], [.0805, .0175, -.039]], R: [[.0150, .0128], [.0122, .0109], [.0107, .0093]] };
  // the palm lines (xz polylines on the palm side)
  const LINES = [
    { P: [[.041, -.021], [.030, -.011], [.022, .002], [.017, .018], [.015, .033], [.016, .046]], k: 1.15 },   // life line, round the thumb's mount
    { P: [[.041, -.022], [.024, -.017], [.006, -.011], [-.012, -.004], [-.026, .004]], k: 1.0 },              // head line
    { P: [[-.043, -.023], [-.028, -.029], [-.010, -.033], [.006, -.036], [.020, -.040]], k: 1.05 },           // heart line
    { P: [[-.002, .040], [-.004, .018], [-.004, .000]], k: .45 },                                              // a faint fate line
  ];
  const CUP = 3.0;   // the palm's hollow

  // groove depth at a point (0 = none), used both to press the creases in and to darken them
  function groove(x, y, z) {
    let g = 0;
    if (y > -.006 && x > -.052 && x < .05 && z > -.05 && z < .055) {
      const side = sstep(-.004, .006, y);
      if (side > 0) for (const L of LINES) { const d = pl2(x, z, L.P); if (d < .004) g = max(g, L.k * exp(-(d * d) / (.00095 * .00095)) * side); }
    }
    for (const f of fing) for (const C of f.CR) {
      const qx = x - C.c[0], qy = y - C.c[1], qz = z - C.c[2], s = qx * C.dir[0] + qy * C.dir[1] + qz * C.dir[2];
      if (abs(s) > .003) continue;
      const u = qx * C.up[0] + qy * C.up[1] + qz * C.up[2]; if (u < 0) continue;
      const rad = sqrt(max(0, qx * qx + qy * qy + qz * qz - s * s)); if (rad > C.r * 1.6) continue;
      g = max(g, .7 * exp(-(s * s) / (.0008 * .0008)) * sstep(.2, .8, u / C.r));
    }
    return g;
  }
  function body(x, y, z) {
    // the palm: a rounded box, cupped
    const yc = y - CUP * (x * x + .15 * z * z), xs = (x - .001) / (1 - .13 * cl((z + .01) / .055)) ;
    let d = rbox(xs, yc, z + .001, [.029, .0035, .041], .0115);
    // the thumb's mount and the little finger's (rotated ellipsoids)
    { const cx = x - .026, cy = y - .0035, cz = z - .021, c = cos(.45), s = sin(.45); d = smin(d, ell(cx * c - cz * s, cy, cx * s + cz * c, [.019, .0135, .029]), .012); }
    d = smin(d, ell(x + .027, y - .002, z - .014, [.0135, .0120, .032]), .010);
    // the pads under the fingers
    for (const f of fing) d = smin(d, ell(x - f.x, y - .0025, z - (f.z + .006), [.0105, .0090, .0105]), .008);
    // the wrist and forearm (flattened)
    { const sx = 1.36; d = smin(d, cap((x - .002) / sx, y, z, [0, -.0035, .046], [0, -.008, .34], .0212, .0262) * 1.08, .016); }
    d = max(d, z - .255);   // the forearm's cut end, closed
    // the thumb
    let t = 1e9; for (let i = 0; i < 3; i++) t = smin(t, cap(x, y, z, TH.J[i], TH.J[i + 1], TH.R[i][0], TH.R[i][1]), .003);
    d = smin(d, t, .011);
    // the web between the thumb and the first finger
    d = smin(d, cap(x, y, z, [.033, .0035, -.026], [.057, .0055, -.003], .0062, .0072), .012);
    // the fingers
    for (const f of fing) {
      let e = 1e9; for (let i = 0; i < 3; i++) e = smin(e, cap(x, y, z, f.J[i], f.J[i + 1], f.R[i][0], f.R[i][1]), .0025);
      d = smin(d, e, .0062);
    }
    return d;
  }
  const sdf = (x, y, z) => body(x, y, z) + .00085 * groove(x, y, z);

  // ---- block-sparse surface nets ----
  function mesh(o = {}) {
    const h = o.h ?? .001, X0 = -.052, Y0 = -.036, Z0 = -.134, X1 = .099, Y1 = .046, Z1 = .27;
    const nx = Math.ceil((X1 - X0) / h), ny = Math.ceil((Y1 - Y0) / h), nz = Math.ceil((Z1 - Z0) / h);
    const Nx = nx + 1, Ny = ny + 1, Nz = nz + 1, F = new Float32Array(Nx * Ny * Nz), B = 6, reach = B * h * .9 + .003;
    for (let bk = 0; bk < Nz; bk += B) for (let bj = 0; bj < Ny; bj += B) for (let bi = 0; bi < Nx; bi += B) {
      const ci = min(bi + B / 2, Nx - 1), cj = min(bj + B / 2, Ny - 1), ck = min(bk + B / 2, Nz - 1);
      const dc = sdf(X0 + ci * h, Y0 + cj * h, Z0 + ck * h);
      const ie = min(bi + B, Nx), je = min(bj + B, Ny), ke = min(bk + B, Nz);
      if (abs(dc) > reach) { const v = dc > 0 ? 1 : -1; for (let k = bk; k < ke; k++) for (let j = bj; j < je; j++) F.fill(v, bi + Nx * (j + Ny * k), ie + Nx * (j + Ny * k)); continue; }
      for (let k = bk; k < ke; k++) for (let j = bj; j < je; j++) for (let i = bi; i < ie; i++) F[i + Nx * (j + Ny * k)] = sdf(X0 + i * h, Y0 + j * h, Z0 + k * h);
    }
    // the edge ends must be inside or outside: keep the box's faces outside, so the forearm's cut end stays closed? no:
    // the forearm runs out of the box (z = Z1), left open; the camera never sees it.
    const VI = new Int32Array(nx * ny * nz).fill(-1), pos = [];
    const C = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
    const E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
    const v = new Float32Array(8);
    for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      let m = 0;
      for (let c = 0; c < 8; c++) { v[c] = F[(i + C[c][0]) + Nx * ((j + C[c][1]) + Ny * (k + C[c][2]))]; if (v[c] < 0) m |= 1 << c; }
      if (m === 0 || m === 255) continue;
      let sx = 0, sy = 0, sz = 0, n = 0;
      for (const [a, b] of E) {
        if ((v[a] < 0) === (v[b] < 0)) continue;
        const s = v[a] / (v[a] - v[b]);
        sx += C[a][0] + (C[b][0] - C[a][0]) * s; sy += C[a][1] + (C[b][1] - C[a][1]) * s; sz += C[a][2] + (C[b][2] - C[a][2]) * s; n++;
      }
      VI[i + nx * (j + ny * k)] = pos.length / 3;
      pos.push(X0 + (i + sx / n) * h, Y0 + (j + sy / n) * h, Z0 + (k + sz / n) * h);
    }
    const idx = [], cell = (i, j, k) => VI[i + nx * (j + ny * k)];
    const quad = (a, b, c, d, flip) => { if (a < 0 || b < 0 || c < 0 || d < 0) return; flip ? idx.push(a, c, b, a, d, c) : idx.push(a, b, c, a, c, d); };
    for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const f0 = F[i + Nx * (j + Ny * k)] < 0;
      if (j > 0 && k > 0 && (F[(i + 1) + Nx * (j + Ny * k)] < 0) !== f0) quad(cell(i, j - 1, k - 1), cell(i, j, k - 1), cell(i, j, k), cell(i, j - 1, k), f0);
      if (i > 0 && k > 0 && (F[i + Nx * ((j + 1) + Ny * k)] < 0) !== f0) quad(cell(i - 1, j, k - 1), cell(i - 1, j, k), cell(i, j, k), cell(i, j, k - 1), f0);
      if (i > 0 && j > 0 && (F[i + Nx * (j + Ny * (k + 1))] < 0) !== f0) quad(cell(i - 1, j - 1, k), cell(i, j - 1, k), cell(i, j, k), cell(i - 1, j, k), f0);
    }
    // normals from the field; colours from the region
    const nv = pos.length / 3, nor = new Float32Array(nv * 3), col = new Float32Array(nv * 3), e = .0004;
    const cPalm = new THREE.Color(o.palm || '#B07050'), cBack = new THREE.Color(o.back || '#74412A'), cTip = new THREE.Color(o.tip || '#B87060'), cCrease = new THREE.Color(o.crease || '#6A3A28'), tmp = new THREE.Color();
    for (let q = 0; q < nv; q++) {
      const x = pos[q * 3], y = pos[q * 3 + 1], z = pos[q * 3 + 2];
      let gx = sdf(x + e, y, z) - sdf(x - e, y, z), gy = sdf(x, y + e, z) - sdf(x, y - e, z), gz = sdf(x, y, z + e) - sdf(x, y, z - e);
      const L = sqrt(gx * gx + gy * gy + gz * gz) || 1; gx /= L; gy /= L; gz /= L;
      nor[q * 3] = gx; nor[q * 3 + 1] = gy; nor[q * 3 + 2] = gz;
      // palm side: the normal faces the palm's way (for the fingers, their own curled "up")
      let up = gy;
      for (const f of fing) for (let s = 0; s < 3; s++) { const a = f.J[s], b = f.J[s + 1]; if (cap(x, y, z, a, b, f.R[s][0] + .003, f.R[s][1] + .003) < 0) { const u = f.ups[s]; up = gx * u[0] + gy * u[1] + gz * u[2]; } }
      const pk = sstep(-.35, .45, up);
      tmp.copy(cBack).lerp(cPalm, pk);
      // fingertips and the pads flush pink
      let tk = 0; for (const f of fing) tk = max(tk, 1 - cl(len3(x - f.tip[0], y - f.tip[1], z - f.tip[2]) / .016));
      tk = max(tk, 1 - cl(len3(x - TH.J[3][0], y - TH.J[3][1], z - TH.J[3][2]) / .016));
      tmp.lerp(cTip, .55 * tk * pk);
      tmp.lerp(cCrease, .6 * cl(groove(x, y, z)));
      // a little mottling
      const mt = .035 * (Math.sin(x * 900 + z * 400) * Math.sin(z * 700 - y * 500));
      col[q * 3] = tmp.r * (1 + mt); col[q * 3 + 1] = tmp.g * (1 + mt); col[q * 3 + 2] = tmp.b * (1 + mt);
    }
    // make every triangle face the way the field says is out
    for (let t = 0; t < idx.length; t += 3) {
      const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3;
      const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2], wx = pos[c] - pos[a], wy = pos[c + 1] - pos[a + 1], wz = pos[c + 2] - pos[a + 2];
      const fx = uy * wz - uz * wy, fy = uz * wx - ux * wz, fz = ux * wy - uy * wx;
      if (fx * (nor[a] + nor[b] + nor[c]) + fy * (nor[a + 1] + nor[b + 1] + nor[c + 1]) + fz * (nor[a + 2] + nor[b + 2] + nor[c + 2]) < 0) { const s = idx[t + 1]; idx[t + 1] = idx[t + 2]; idx[t + 2] = s; }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setIndex(idx);
    return geo;
  }

  // the palm-side surface under (x, z): march down from above
  function surf(x, z, o = {}) {
    let y = o.from ?? .06;
    for (let i = 0; i < 200; i++) { const d = sdf(x, y, z); if (d < .00005) break; y -= max(d * .8, .00005); }
    const e = .0004, n = V3(sdf(x + e, y, z) - sdf(x - e, y, z), sdf(x, y + e, z) - sdf(x, y - e, z), sdf(x, y, z + e) - sdf(x, y, z - e)).normalize();
    return { p: V3(x, y, z), n };
  }
  // the palm-side surface near a point, marching along -dir from p + dir * reach (for a fingertip's pad)
  function surfAlong(p, dir, reach = .02) {
    const D = V3(...dir).normalize(); let q = V3(...p).addScaledVector(D, reach);
    for (let i = 0; i < 200; i++) { const d = sdf(q.x, q.y, q.z); if (d < .00005) break; q.addScaledVector(D, -max(d * .8, .00005)); }
    const e = .0004, n = V3(sdf(q.x + e, q.y, q.z) - sdf(q.x - e, q.y, q.z), sdf(q.x, q.y + e, q.z) - sdf(q.x, q.y - e, q.z), sdf(q.x, q.y, q.z + e) - sdf(q.x, q.y, q.z - e)).normalize();
    return { p: q, n };
  }

  function build(o = {}) {
    const t0 = performance.now(), geo = mesh(o);
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: o.rough ?? .58, metalness: 0, emissive: new THREE.Color('#3A1408'), emissiveIntensity: o.warm ?? .12 });
    const group = new THREE.Group(), m = new THREE.Mesh(geo, mat); m.castShadow = m.receiveShadow = true; group.add(m);
    console.log('[palm] hand', geo.attributes.position.count, 'verts', (performance.now() - t0).toFixed(0), 'ms');
    // the fingertips' pads (palm side of each distal phalanx, near its end)
    const tips = fing.map(f => { const j2 = f.J[2], j3 = f.J[3], c = [j2[0] + (j3[0] - j2[0]) * .7, j2[1] + (j3[1] - j2[1]) * .7, j2[2] + (j3[2] - j2[2]) * .7]; return surfAlong(c, f.ups[2]); });
    const ends = fing.map(f => { const d = f.dirs[2]; return V3(f.tip[0] + d[0] * f.R[2][1], f.tip[1] + d[1] * f.R[2][1], f.tip[2] + d[2] * f.R[2][1]); });
    return { group, mesh: m, mat, sdf, surf, surfAlong, tips, ends, fing, TH };
  }
  return { build, sdf, fing, TH };
})();
