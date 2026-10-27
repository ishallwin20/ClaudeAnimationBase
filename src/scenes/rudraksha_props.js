// rudraksha_props.js: what "Count the lines on your RUDRAKSHA" (ad 56) builds in the 3D style.
//   The bead: a procedural rudraksha seed (bead3): knobbly tubercles (Worley cells on the sphere), N grooves (mukhi)
//   running pole to pole with raised lips, the bored hole at each pole, coloured per vertex (polished tips, dark
//   crevices); its lines can light up in gold one by one (the count). Made for any N from 1 to 14; the hero bead swaps
//   its N in place, small beads (the list, the mala, the heap) are low-res copies.
//   The studio (studio3): the bead floating over crimson velvet, a warm key, a cool rim, bokeh lamps far off; or the
//   night canopy behind the blue fruit (fruit3: two halves of a structural-blue drupe that open on the bead).
//   The forest (forest3): a moonlit Himalayan clearing, ridges, stars; the tear (a falling drop of light), its ring on
//   the ground, and rudraksha trees that grow (tree3: a straight trunk with tiered whorls, lanceolate leaves with a few
//   old ones turned red, blue fruit hanging under them, as Elaeocarpus ganitrus grows).
//   Emblems (emblem3): gold line halos behind the bead, one per god, with N dots round the ring; numerals (numRing3);
//   the mala of 108 (mala3) and a brass plate heaped with five-line beads (heap3).
// Metres; y up. The bead's radius is 1 (a 2 cm bead at 1:100, so the studio is a macro set).

// ---------- noise ----------
const NZ = (() => {
  const P = new Uint8Array(512); { const r = lcg(77), p = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) P[i] = p[i & 255]; }
  const fd = t => t * t * (3 - 2 * t), hv = (x, y, z) => P[P[P[x & 255] + (y & 255)] + (z & 255)] / 255;
  function vn(x, y, z) {
    const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z), u = fd(x - X), v = fd(y - Y), w = fd(z - Z);
    const a = lerp(lerp(hv(X, Y, Z), hv(X + 1, Y, Z), u), lerp(hv(X, Y + 1, Z), hv(X + 1, Y + 1, Z), u), v);
    const b = lerp(lerp(hv(X, Y, Z + 1), hv(X + 1, Y, Z + 1), u), lerp(hv(X, Y + 1, Z + 1), hv(X + 1, Y + 1, Z + 1), u), v);
    return lerp(a, b, w);
  }
  const fbm = (x, y, z, o = 4) => { let s = 0, a = .5, f = 1, n = 0; for (let i = 0; i < o; i++) { s += a * vn(x * f + i * 17.3, y * f, z * f); n += a; a *= .5; f *= 2.03; } return s / n; };
  return { vn, fbm };
})();

// ---------- the bead ----------
const BEAD = (() => {
  const SP = .092;                                   // the tubercles' spacing on the unit sphere
  // Worley feature points: a jittered Fibonacci sphere, hashed into a grid
  const PTS = [], GRID = new Map(), CELL = .1, key = (x, y, z) => ((x + 12) * 32 + (y + 12)) * 32 + (z + 12);
  { const n = Math.round(4 * Math.PI / (SP * SP)), r = lcg(5), ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - 2 * (i + .5) / n, s = Math.sqrt(1 - y * y), a = i * ga;
      let p = [s * Math.cos(a) + (r() - .5) * SP * .7, y + (r() - .5) * SP * .7, s * Math.sin(a) + (r() - .5) * SP * .7];
      const l = Math.hypot(...p); p = p.map(v => v / l); p.h = .55 + .45 * r(); PTS.push(p);
      const k = key(Math.floor(p[0] / CELL), Math.floor(p[1] / CELL), Math.floor(p[2] / CELL));
      if (!GRID.has(k)) GRID.set(k, []); GRID.get(k).push(p);
    } }
  function worley(x, y, z) {
    let f1 = 9, f2 = 9, h = 1; const cx = Math.floor(x / CELL), cy = Math.floor(y / CELL), cz = Math.floor(z / CELL);
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) {
      const L = GRID.get(key(cx + i, cy + j, cz + k)); if (!L) continue;
      for (const p of L) { const d = Math.hypot(p[0] - x, p[1] - y, p[2] - z); if (d < f1) { f2 = f1; f1 = d; h = p.h; } else if (d < f2) f2 = d; }
    }
    return [f1, Math.min(f2, f1 + SP), h];
  }
  // the grooves of an N-line bead: a base angle each (seeded, a little uneven), wobbling as they run pole to pole
  const grooveAngles = N => { const r = lcg(100 + N); return [...Array(N)].map((_, i) => (i + .5) / N * TAU + (N > 1 ? (r() - .5) * TAU / N * .22 : 0)); };
  const wob = (th, i, N) => .07 * Math.sin(2.1 * th + i * 1.9 + N) * Math.sin(th);
  const OBL = .93;                                   // the bead is a little flattened along its bore
  // the surface at unit direction d: { r, tub, gm, hole }
  function surf(x, y, z, N, ang, W) {
    const th = Math.acos(clamp(y, -1, 1)), ph = Math.atan2(z, x), s = Math.sin(th);
    let gm = 0, lip = 0;
    for (let i = 0; i < N; i++) {
      let d = ph - ang[i] - wob(th, i, N); d -= TAU * Math.round(d / TAU);
      const dist = Math.abs(d) * Math.max(s, .04), g = Math.exp(-(dist / W) * (dist / W));
      if (g > gm) gm = g;
      const l = Math.exp(-Math.pow((dist - 2.1 * W) / (1.1 * W), 2)); if (l > lip) lip = l;
    }
    // irregular, rounded tubercles: Worley cells on a warped sphere, domed, with crevices between them
    let wx = x + .05 * (NZ.fbm(x * 6, y * 6, z * 6, 2) - .5), wy = y + .05 * (NZ.fbm(x * 6 + 7, y * 6, z * 6, 2) - .5), wz = z + .05 * (NZ.fbm(x * 6, y * 6 + 5, z * 6, 2) - .5);
    const wl = Math.hypot(wx, wy, wz); wx /= wl; wy /= wl; wz /= wl;
    const [f1, f2, hc] = worley(wx, wy, wz);
    const dome = clamp(1 - Math.pow(f1 / (.85 * SP), 2)), wall = clamp((f2 - f1) / (.5 * SP));
    const rn = 1 - Math.abs(2 * NZ.fbm(x * 16, y * 16, z * 16, 3) - 1);       // ridged noise: wrinkles over the knobs
    const tub = clamp(hc * (.55 * Math.pow(dome, .8) + .25 * wall) + .3 * rn - .1);
    const tp = Math.min(th, Math.PI - th), hole = Math.exp(-Math.pow(tp / .075, 2)), collar = Math.exp(-Math.pow((tp - .17) / .05, 2));
    const r = 1 + .035 * (NZ.fbm(x * 1.6 + 3, y * 1.6, z * 1.6, 3) - .5) + .055 * tub * (1 - gm) * (1 - hole) - .13 * gm + .025 * lip * (1 - gm) - .3 * hole + .02 * collar * (1 - hole);
    return { r, tub, gm: Math.max(gm, hole * .6), hole };
  }
  const C = (h) => new THREE.Color(h);
  const COL = { a: C('#2E1E16'), b: C('#553424'), tip: C('#8A664C'), crev: C('#140B07'), groove: C('#120A06'), hole: C('#080402') };
  const cache = new Map();
  // data(N, res): positions, normals, colours for a SphereGeometry(1, sw, sh), and the N lines' curves
  function data(N, res = 'hi') {
    const k = N + res; if (cache.has(k)) return cache.get(k);
    const [sw, sh, W] = res === 'hi' ? [560, 360, .045] : [200, 128, .06];
    const g = new THREE.SphereGeometry(1, sw, sh), P = g.attributes.position, n = P.count, ang = grooveAngles(N);
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), tmp = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const x = P.getX(i), y = P.getY(i), z = P.getZ(i), S = surf(x, y, z, N, ang, W);
      pos[i * 3] = x * S.r; pos[i * 3 + 1] = y * S.r * OBL; pos[i * 3 + 2] = z * S.r;
      const v = NZ.fbm(x * 3 + 9, y * 3, z * 3, 3);
      tmp.copy(COL.a).lerp(COL.b, clamp(v * 1.4 - .2));
      tmp.lerp(COL.tip, clamp(Math.pow(S.tub, 3) * .9 * (1 - S.gm)));
      tmp.lerp(COL.crev, clamp(Math.pow(1 - S.tub, 2) * .75 * (1 - S.gm)));
      tmp.lerp(COL.groove, clamp(S.gm * .85)); tmp.lerp(COL.hole, S.hole);
      col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.computeVertexNormals();
    // the seam: average the normals of the duplicated first and last column
    const nor = g.attributes.normal.array;
    for (let iy = 0; iy <= sh; iy++) { const a = iy * (sw + 1), b = a + sw; for (let j = 0; j < 3; j++) { const m = (nor[a * 3 + j] + nor[b * 3 + j]) / 2; nor[a * 3 + j] = nor[b * 3 + j] = m; } }
    // the lines: along the bottom of each groove, pole to pole, just proud of the surface
    const lines = ang.map((a0, i) => {
      const pts = [];
      for (let s = 0; s <= 64; s++) {
        const th = lerp(.2, Math.PI - .2, s / 64), ph = a0 + wob(th, i, N), x = Math.sin(th) * Math.cos(ph), y = Math.cos(th), z = Math.sin(th) * Math.sin(ph);
        const r = surf(x, y, z, N, ang, W).r + .012; pts.push(V3(x * r, y * r * OBL, z * r));
      }
      return new THREE.CatmullRomCurve3(pts);
    });
    const D = { pos, nor: new Float32Array(nor), col, lines, sw, sh };
    g.dispose(); cache.set(k, D); return D;
  }
  // a fine pitting for the bump map
  const pit = () => tex3('beadpit', 512, 256, (g2, w, h) => {
    g2.fillStyle = '#808080'; g2.fillRect(0, 0, w, h); const r = lcg(8);
    for (let i = 0; i < 6000; i++) { g2.fillStyle = r() < .5 ? 'rgba(0,0,0,.35)' : 'rgba(255,255,255,.25)'; g2.beginPath(); g2.arc(r() * w, r() * h, .6 + r() * 1.6, 0, TAU); g2.fill(); }
  }, { data: true });
  const MAT = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .5, metalness: 0, clearcoat: .25, clearcoatRoughness: .45, sheen: .2, sheenColor: '#C89070', sheenRoughness: .6, bumpMap: pit().rep(3, 2), bumpScale: .3 });
  const LINE_MAT = () => new THREE.MeshBasicMaterial({ color: '#FFD27A', transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  return { data, MAT, LINE_MAT, grooveAngles };
})();

// bead3(parent, o): a bead you can re-count. o.res 'hi' | 'lo', o.N (start). Returns { group (place it), spin (turn it:
// y is the bore), setN(N), lines(f(i) → 0..1 drawn, alpha, col), N }.
function bead3(parent, o = {}) {
  const res = o.res || 'hi', group = new THREE.Group(), spin = new THREE.Group(); parent.add(group); group.add(spin);
  const D0 = BEAD.data(o.N ?? 5, res), geo = new THREE.SphereGeometry(1, D0.sw, D0.sh);
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(D0.pos), 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(D0.nor), 3));
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(D0.col), 3));
  const mesh = mesh3(spin, geo, BEAD.MAT, [0, 0, 0]);
  const tubes = new Map(), lineMat = BEAD.LINE_MAT(), tips = [];
  const B = { group, spin, mesh, N: o.N ?? 5, D: D0 };
  B.setN = (N) => {
    if (N === B.N) return; const D = BEAD.data(N, res);
    geo.attributes.position.array.set(D.pos); geo.attributes.normal.array.set(D.nor); geo.attributes.color.array.set(D.col);
    geo.attributes.position.needsUpdate = geo.attributes.normal.needsUpdate = geo.attributes.color.needsUpdate = true;
    geo.computeBoundingSphere(); B.N = N; B.D = D;
  };
  const tubesOf = (N) => {
    if (!tubes.has(N)) {
      const G = new THREE.Group(); spin.add(G);
      const L = BEAD.data(N, res).lines.map(cv => { const m = mesh3(G, new THREE.TubeGeometry(cv, 96, res === 'hi' ? .014 : .03, 6, false), lineMat, [0, 0, 0], { cast: false, receive: false }); m.cv = cv; return m; });
      tubes.set(N, { G, L });
    }
    return tubes.get(N);
  };
  // the travelling sparks at the lines' heads
  for (let i = 0; i < 14; i++) tips.push(glow3(spin, [0, 0, 0], .32, '#FFD890', 0));
  B.lines = (f, a = 1, col) => {
    for (const [, T] of tubes) T.G.visible = false;
    tips.forEach(s => s.visible = false);
    if (!f || a <= 0) return;
    const T = tubesOf(B.N); T.G.visible = true; lineMat.opacity = a; if (col) lineMat.color.set(col);
    T.L.forEach((m, i) => {
      const k = clamp(typeof f === 'function' ? f(i) : f); m.visible = k > .001;
      m.geometry.setDrawRange(0, Math.floor(k * 96) * 6 * 6);
      if (k > .02 && k < .995 && tips[i]) { tips[i].visible = true; tips[i].position.copy(m.cv.getPoint(k)); tips[i].material.opacity = a; }
    });
  };
  B.tip = (i) => { const T = tubesOf(B.N); return T.L[i] ? T.L[i].cv : null; };
  B.lines(0);
  return B;
}

// ---------- the studio (velvet, or the night canopy for the fruit) ----------
function studio3() {
  const W = world3(), S = W.scene;
  const velvet = tex3('velvet', 512, 512, (g, w, h) => {
    g.fillStyle = '#4A0E16'; g.fillRect(0, 0, w, h); const r = lcg(31);
    for (let i = 0; i < 40; i++) { const x = r() * w, y = r() * h, rr = 60 + r() * 160, gr = g.createRadialGradient(x, y, 0, x, y, rr), dk = r() < .5; gr.addColorStop(0, dk ? 'rgba(20,0,4,.35)' : 'rgba(160,40,50,.22)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
    for (let i = 0; i < 20000; i++) { g.fillStyle = r() < .5 ? 'rgba(0,0,0,.18)' : 'rgba(255,140,150,.07)'; g.fillRect(r() * w, r() * h, 1, 1); }
  });
  const cloth = mesh3(S, new THREE.PlaneGeometry(60, 60, 1, 1), new THREE.MeshPhysicalMaterial({ map: velvet.rep(4, 4), roughness: .95, sheen: .8, sheenColor: '#B83A4C', sheenRoughness: .5, color: '#C8B0B0' }), [0, -1.35, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  cloth.material.depthWrite = false;   // so the halo behind the bead, which dips below the cloth, isn't cut by it
  // bokeh: lamps far off round the set
  const bokeh = new THREE.Group(); S.add(bokeh); const rb = lcg(12);
  for (let i = 0; i < 26; i++) { const a = rb() * TAU, r = 16 + rb() * 10; glow3(bokeh, [Math.cos(a) * r, -1 + rb() * 5, Math.sin(a) * r], 1.4 + rb() * 2.6, rb() < .75 ? '#FFB050' : '#FFDDA0', .25 + rb() * .35); }
  // the canopy behind the fruit: blue-green dark, cool bokeh (moonlight through leaves)
  const canopy = new THREE.Group(); S.add(canopy); const rc = lcg(19);
  for (let i = 0; i < 40; i++) { const a = rc() * TAU, r = 14 + rc() * 12; glow3(canopy, [Math.cos(a) * r, -4 + rc() * 12, Math.sin(a) * r], 1 + rc() * 3, rc() < .6 ? '#9CC0FF' : '#DCE8FF', .12 + rc() * .3); }
  const rim = new THREE.DirectionalLight('#86A8FF', 2.2); rim.position.set(-5, 3, -6); S.add(rim);
  const warm = new THREE.PointLight('#FF9A44', 0, 14, 1.6); warm.position.set(3, 1, 3); S.add(warm);
  // the key: a soft spot, so the velvet falls off into the dark round the pool of light
  const spot = new THREE.SpotLight('#FFE0B8', 0, 0, .42, .85, 2); spot.castShadow = true; spot.shadow.mapSize.set(2048, 2048); spot.shadow.bias = -.0004; spot.shadow.radius = 5; S.add(spot, spot.target);
  // look: 'velvet' | 'canopy' | 'fire' | 'gold'; key: [x, y, z] of the key light
  const look = (name, o = {}) => {
    const ex = W.mood('night', { hemi: o.hemi ?? .35, sun: o.sun ?? .5, sunAt: o.key || [4, 7, 5], exposure: o.exposure ?? 1.05 });
    const kp = V3(...(o.key || [4, 7, 5])).normalize().multiplyScalar(14); spot.position.copy(kp); spot.target.position.set(...(o.keyAt || [0, -.5, 0])); spot.intensity = o.spot ?? 420; spot.angle = o.cone ?? .42;
    spot.color.set(name === 'canopy' ? '#D8E6FF' : '#FFE0B8');
    S.fog.near = 18; S.fog.far = 60; S.fog.color.set(name === 'canopy' ? '#06100E' : '#0A0608');
    W.sun.color.set(name === 'canopy' ? '#CFE0FF' : '#FFE0B8');
    cloth.visible = name !== 'canopy' && !o.noCloth; bokeh.visible = name !== 'canopy'; canopy.visible = name === 'canopy';
    rim.intensity = o.rim ?? (name === 'canopy' ? 2.6 : 2.2); rim.color.set(name === 'fire' ? '#FF7A30' : '#86A8FF');
    warm.intensity = o.warm ?? (name === 'fire' ? 30 : 6); warm.color.set(name === 'fire' ? '#FF6A20' : '#FF9A44');
    return ex;
  };
  return { W, S, cloth, bokeh, canopy, rim, warm, spot, look };
}

// ---------- the blue fruit ----------
// fruit3(parent): a drupe 1.25× the bead, structural blue, on a stalk, opening in two halves. set(open 0..1, a)
function fruit3(parent) {
  const G = new THREE.Group(); parent.add(G);
  const skin = tex3('fruitskin', 256, 256, (g, w, h) => { g.fillStyle = '#808080'; g.fillRect(0, 0, w, h); const r = lcg(2); for (let i = 0; i < 3000; i++) { g.fillStyle = r() < .5 ? 'rgba(0,0,0,.25)' : 'rgba(255,255,255,.2)'; g.beginPath(); g.arc(r() * w, r() * h, .5 + r() * 2, 0, TAU); g.fill(); } }, { data: true });
  const blue = new THREE.MeshPhysicalMaterial({ color: '#2048C0', roughness: .42, clearcoat: .35, clearcoatRoughness: .35, iridescence: 1, iridescenceIOR: 1.5, iridescenceThicknessRange: [280, 560], sheen: .8, sheenColor: '#8CB8FF', bumpMap: skin.rep(4, 2), bumpScale: .4 });
  const flesh = new THREE.MeshStandardMaterial({ color: '#C8D29A', roughness: .7, side: THREE.BackSide, transparent: true });
  const R = 1.24, halves = [];
  for (const s of [0, 1]) {
    const H = new THREE.Group(); G.add(H);
    const geo = new THREE.SphereGeometry(R, 96, 64, s * Math.PI, Math.PI); geo.scale(1, .97, 1);
    mesh3(H, geo, blue, [0, 0, 0]); mesh3(H, geo, flesh, [0, 0, 0], { scale: .995 });
    halves.push(H);
  }
  const stalkM = new THREE.MeshStandardMaterial({ color: '#4E5A28', roughness: .7 });
  const stalk = mesh3(G, new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(0, R * .95, 0), V3(.05, R + .5, 0), V3(.25, R + 1.4, .05), V3(.7, R + 2.6, .1)]), 24, .07, 8), stalkM, [0, 0, 0]);
  const set = (open = 0, a = 1) => {
    // the halves split along the bore's plane and fall away to either side, fading
    halves.forEach((H, i) => { const s = i ? -1 : 1, k = easeIO(open); H.position.set(0, -k * 1.3, s * k * 2.3); H.rotation.set(s * k * 1.0, 0, 0); });
    blue.opacity = flesh.opacity = a * (1 - seg(open, .55, 1)); blue.transparent = flesh.transparent = blue.opacity < .999;
    G.visible = a > .001 && open < 1; stalk.visible = open < .05;
  };
  set(0);
  return { group: G, set, blue };
}

// ---------- emblems: a gold halo behind the bead, one per god ----------
const GOLD = '#F7CF7A';
function emblemTex(key, N) {
  return tex3('emb' + key + N, 1024, 1024, (g) => {
    const cx = 512, cy = 512, stroke = (w, f) => { for (const [lw, a, b] of [[w * 2.6, .25, 30], [w, 1, 10]]) { g.save(); g.lineWidth = lw; g.globalAlpha = a; g.shadowColor = '#FFB040'; g.shadowBlur = b; g.strokeStyle = GOLD; g.fillStyle = GOLD; g.lineCap = g.lineJoin = 'round'; f(); g.restore(); } };
    // the halo: two rings with fine ticks, and N dots (or suns, lamps, flames) round it
    stroke(5, () => { g.beginPath(); g.arc(cx, cy, 352, 0, TAU); g.stroke(); });
    stroke(2.5, () => { g.beginPath(); g.arc(cx, cy, 378, 0, TAU); g.stroke(); for (let i = 0; i < 72; i++) { const a = i / 72 * TAU; g.beginPath(); g.moveTo(cx + Math.cos(a) * 384, cy + Math.sin(a) * 384); g.lineTo(cx + Math.cos(a) * (i % 6 ? 394 : 404), cy + Math.sin(a) * (i % 6 ? 394 : 404)); g.stroke(); } });
    const top = -Math.PI / 2;
    for (let i = 0; i < N; i++) {
      const a = top + (i + .5) / N * TAU, x = cx + Math.cos(a) * 365, y = cy + Math.sin(a) * 365;
      if (key === 'suns') stroke(3, () => { g.beginPath(); g.arc(x, y, 13, 0, TAU); g.fill(); for (let r = 0; r < 8; r++) { const b = r / 8 * TAU; g.beginPath(); g.moveTo(x + Math.cos(b) * 19, y + Math.sin(b) * 19); g.lineTo(x + Math.cos(b) * 27, y + Math.sin(b) * 27); g.stroke(); } });
      else if (key === 'kalagni' || key === 'durga') stroke(3, () => { g.save(); g.translate(x, y); g.rotate(a + Math.PI / 2); g.beginPath(); g.moveTo(0, -24); g.bezierCurveTo(12, -8, 12, 8, 0, 14); g.bezierCurveTo(-12, 8, -12, -8, 0, -24); g.fill(); g.restore(); });
      else stroke(3, () => { g.beginPath(); g.arc(x, y, 11, 0, TAU); g.fill(); });
    }
    // the god's sign, at the top of the halo
    const sx = cx, sy = 118;
    g.save(); g.translate(sx, sy);
    const S = {
      shiva: () => stroke(7, () => {   // the tripundra with the third eye
        for (const y of [-24, 0, 24]) { g.beginPath(); g.moveTo(-120, y); g.lineTo(120, y); g.stroke(); }
        g.beginPath(); g.ellipse(0, 0, 17, 40, 0, 0, TAU); g.stroke(); g.beginPath(); g.arc(0, 0, 9, 0, TAU); g.fill();
      }),
      brahma: () => stroke(6, () => {  // a lotus
        for (let i = -3; i <= 3; i++) { g.save(); g.translate(0, 50); g.rotate(i * .32); g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(30, -40, 22, -86, 0, -104 + Math.abs(i) * 10); g.bezierCurveTo(-22, -86, -30, -40, 0, 0); g.stroke(); g.restore(); }
        g.beginPath(); g.moveTo(-90, 56); g.quadraticCurveTo(0, 74, 90, 56); g.stroke();
      }),
      kartikeya: () => stroke(7, () => { // the vel
        g.beginPath(); g.moveTo(0, -92); g.bezierCurveTo(46, -50, 40, 4, 0, 26); g.bezierCurveTo(-40, 4, -46, -50, 0, -92); g.stroke();
        g.beginPath(); g.moveTo(0, -60); g.lineTo(0, 6); g.stroke(); g.beginPath(); g.moveTo(-26, 36); g.lineTo(26, 36); g.stroke(); g.beginPath(); g.moveTo(0, 26); g.lineTo(0, 96); g.stroke();
      }),
      durga: () => stroke(7, () => {   // the trishul
        g.beginPath(); g.moveTo(0, -96); g.lineTo(0, 96); g.stroke();
        g.beginPath(); g.moveTo(-62, -70); g.bezierCurveTo(-64, -10, -30, 10, 0, 12); g.bezierCurveTo(30, 10, 64, -10, 62, -70); g.stroke();
        for (const x of [-62, 0, 62]) { g.beginPath(); g.moveTo(x - 10, x ? -56 : -82); g.lineTo(x, x ? -80 : -106); g.lineTo(x + 10, x ? -56 : -82); g.stroke(); }
      }),
      vishnu: () => stroke(6, () => {  // the chakra
        g.beginPath(); g.arc(0, 0, 64, 0, TAU); g.stroke(); g.beginPath(); g.arc(0, 0, 16, 0, TAU); g.stroke();
        for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; g.beginPath(); g.moveTo(Math.cos(a) * 16, Math.sin(a) * 16); g.lineTo(Math.cos(a) * 64, Math.sin(a) * 64); g.stroke(); g.beginPath(); g.moveTo(Math.cos(a - .12) * 64, Math.sin(a - .12) * 64); g.lineTo(Math.cos(a) * 92, Math.sin(a) * 92); g.lineTo(Math.cos(a + .12) * 64, Math.sin(a + .12) * 64); g.stroke(); }
      }),
      suns: () => stroke(6, () => {    // the sun
        g.beginPath(); g.arc(0, 0, 44, 0, TAU); g.stroke(); g.beginPath(); g.arc(0, 0, 26, 0, TAU); g.fill();
        for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; g.beginPath(); g.moveTo(Math.cos(a) * 58, Math.sin(a) * 58); g.lineTo(Math.cos(a) * (i % 2 ? 84 : 100), Math.sin(a) * (i % 2 ? 84 : 100)); g.stroke(); }
      }),
      param: () => stroke(7, () => {   // the crescent over the damaru
        g.beginPath(); g.arc(0, -40, 50, Math.PI * .1, Math.PI * .9); g.stroke(); g.beginPath(); g.arc(0, -58, 42, Math.PI * .15, Math.PI * .85); g.stroke();
        g.beginPath(); g.moveTo(-40, 14); g.lineTo(40, 14); g.lineTo(-40, 92); g.lineTo(40, 92); g.closePath(); g.stroke();
      }),
      kalagni: () => stroke(7, () => { // the fire of time
        for (const [x, s] of [[-58, .7], [58, .7], [0, 1]]) { g.save(); g.translate(x, 40); g.scale(s, s); g.beginPath(); g.moveTo(0, -150); g.bezierCurveTo(60, -80, 70, -10, 0, 40); g.bezierCurveTo(-70, -10, -60, -80, 0, -150); g.stroke(); g.beginPath(); g.moveTo(0, -60); g.bezierCurveTo(26, -30, 26, 0, 0, 22); g.bezierCurveTo(-26, 0, -26, -30, 0, -60); g.fill(); g.restore(); }
      }),
    };
    (S[key] || (() => {}))(); g.restore();
  });
}
// emblem3(parent): one plane, re-textured per god; set(key, N, a, camPos, at, back, size, spin)
function emblem3(parent) {
  const mat = new THREE.MeshBasicMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, opacity: 0 });
  const m = mesh3(parent, new THREE.PlaneGeometry(1, 1), mat, [0, 0, 0], { cast: false, receive: false }); m.renderOrder = 2; m.visible = false;
  let cur = '';
  m.place = (key, N, a, cam, at = [0, 0, 0], back = 1.6, size = 4.4, roll = 0) => {
    m.visible = a > .001; if (!m.visible) return;
    if (cur !== key + N) { mat.map = emblemTex(key, N); mat.needsUpdate = true; cur = key + N; }
    mat.opacity = a;
    const d = V3(at[0] - cam[0], at[1] - cam[1], at[2] - cam[2]).normalize();
    m.position.set(at[0] + d.x * back, at[1] + d.y * back, at[2] + d.z * back);
    m.lookAt(cam[0], cam[1], cam[2]); m.rotateZ(roll); m.scale.setScalar(size);
  };
  return m;
}

// ---------- the numerals 1–14, a ring round the bead ----------
function numRing3(parent) {
  const G = new THREE.Group(); parent.add(G);
  const S = [...Array(14)].map((_, i) => {
    const t = tex3('num' + (i + 1), 256, 256, (g) => { g.font = '700 150px Cinzel'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = '#FFB040'; g.shadowBlur = 24; g.fillStyle = GOLD; g.fillText(String(i + 1), 128, 136); g.shadowBlur = 0; g.fillStyle = '#FFF3DC'; g.fillText(String(i + 1), 128, 136); });
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending })); G.add(s); return s;
  });
  // set(t, f(i) → 0..1 visibility, r, tilt)
  G.set = (t, f, r = 2.5, tilt = .35) => {
    G.visible = !!f;
    S.forEach((s, i) => { const a = i / 14 * TAU + t * .25, k = f ? clamp(f(i)) : 0; s.position.set(Math.cos(a) * r, Math.sin(a) * r * Math.sin(tilt) * .9 + .1, Math.sin(a) * r * Math.cos(tilt)); s.material.opacity = k; s.scale.setScalar(.5 * (.6 + .4 * easeOut(k))); });
  };
  G.set(0, null); return G;
}

// ---------- the mala of 108 ----------
function mala3(parent) {
  const G = new THREE.Group(); parent.add(G);
  const geo = new THREE.SphereGeometry(1, 150, 96), D = BEAD.data(5, 'lo');
  geo.setAttribute('position', new THREE.BufferAttribute(D.pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(D.nor, 3)); geo.setAttribute('color', new THREE.BufferAttribute(D.col, 3));
  const n = 108, im = new THREE.InstancedMesh(geo, BEAD.MAT, n + 1); im.castShadow = im.receiveShadow = true; G.add(im);
  // the loop: a rounded teardrop on the cloth, the meru at its point (towards the camera's top)
  const loop = u => { const a = u * TAU, r = 7.4 * (1 - .18 * Math.cos(a)); return [Math.sin(a) * r * .82, 0, -Math.cos(a) * r + 1.4]; };
  const sz = .2, glows = [...Array(n)].map(() => glow3(G, [0, 0, 0], .9, '#FFC860', 0));
  const thread = mesh3(G, new THREE.TubeGeometry(new THREE.CatmullRomCurve3([...Array(97)].map((_, i) => V3(...loop(i / 96)).setY(sz * .93)), true), 300, .025, 6, true), new THREE.MeshStandardMaterial({ color: '#B0201C', roughness: .6 }), [0, 0, 0]);
  // the tassel at the meru
  const tas = new THREE.Group(); G.add(tas); const tm = new THREE.MeshStandardMaterial({ color: '#C4241E', roughness: .8 }), rt = lcg(4);
  for (let i = 0; i < 30; i++) mesh3(tas, new THREE.CylinderGeometry(.016, .01, 1.5, 4), tm, [(rt() - .5) * .3, 0, -.95 - rt() * .2], { rot: [Math.PI / 2 + (rt() - .5) * .2, 0, (rt() - .5) * .4] });
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), Q2 = new THREE.Quaternion(), E = new THREE.Euler(), P = V3(), Sv = V3(), YAX = V3(0, 1, 0), QZ = new THREE.Quaternion().setFromAxisAngle(V3(0, 0, 1), Math.PI / 2);
  // set(step: beads advanced (fractional), pulse: glow per bead index → 0..1)
  G.set = (step, pulse) => {
    for (let i = 0; i < n; i++) {
      const u = ((i + step) % n + n) % n / (n + 3) + 1.5 / (n + 3), p = loop(u), q = loop(u + .001), d = [q[0] - p[0], q[2] - p[2]];
      // bore (y) along the thread: twist about the bore, lay it along x, then turn it to the thread's heading
      Q.setFromAxisAngle(YAX, Math.atan2(-d[1], d[0])).multiply(QZ).multiply(Q2.setFromAxisAngle(YAX, i * 1.3));
      P.set(p[0], sz * .93, p[2]); Sv.setScalar(sz); M.compose(P, Q, Sv); im.setMatrixAt(i, M);
      const k = pulse ? clamp(pulse(i)) : 0; glows[i].position.set(p[0], sz * 1.6, p[2]); glows[i].material.opacity = .9 * k; glows[i].visible = k > .01;
    }
    // the meru: a bigger bead at the gap, the tassel beyond it
    const p = loop(0); P.set(p[0], sz * 1.25, p[2] - .1); Q.setFromEuler(E.set(Math.PI / 2, 0, 0)); Sv.setScalar(sz * 1.3); M.compose(P, Q, Sv); im.setMatrixAt(n, M);
    tas.position.set(p[0], sz * .5, p[2] - .1);
    im.instanceMatrix.needsUpdate = true;
  };
  G.set(0); G.loop = loop; return G;
}

// ---------- a brass plate heaped with five-line beads ----------
function heap3(parent) {
  const G = new THREE.Group(); parent.add(G);
  mesh3(G, lathe3([[0, 0], [5.6, 0], [6.6, .5], [7.2, 1.0], [7.25, 1.1], [7.0, 1.05], [6.4, .58], [5.6, .14], [0, .14]], 96), metal3('#C99A48', .28), [0, -1.35, 0]);
  const geo = new THREE.SphereGeometry(1, 150, 96), D = BEAD.data(5, 'lo');
  geo.setAttribute('position', new THREE.BufferAttribute(D.pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(D.nor, 3)); geo.setAttribute('color', new THREE.BufferAttribute(D.col, 3));
  const r = lcg(3), list = [], sz = .46;
  // a mound: rings of beads, fewer as it rises
  for (let layer = 0; layer < 6; layer++) {
    const R = 5.3 - layer * .95;
    for (let ring = R; ring > .1; ring -= sz * 1.9) { const n = Math.max(1, Math.floor(TAU * ring / (sz * 2.05))); for (let i = 0; i < n; i++) { const a = i / n * TAU + layer + ring; list.push([Math.cos(a) * ring + (r() - .5) * .2, -1.2 + sz + layer * sz * 1.55, Math.sin(a) * ring + (r() - .5) * .2]); } }
  }
  const im = new THREE.InstancedMesh(geo, BEAD.MAT, list.length); im.castShadow = im.receiveShadow = true; G.add(im);
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler();
  list.forEach((p, i) => { Q.setFromEuler(E.set(r() * TAU, r() * TAU, r() * TAU)); M.compose(V3(...p), Q, V3(sz, sz, sz)); im.setMatrixAt(i, M); });
  G.top = [0, -1.2 + sz + 5 * sz * 1.55, 0];
  return G;
}

// ---------- the forest at night ----------
const TREE_MAT = (() => {
  const bark = tex3('bark', 128, 512, (g, w, h) => {
    g.fillStyle = '#4A3F36'; g.fillRect(0, 0, w, h); const r = lcg(6);
    for (let i = 0; i < 260; i++) { g.strokeStyle = r() < .5 ? 'rgba(20,14,10,.5)' : 'rgba(150,140,125,.25)'; g.lineWidth = 1 + r() * 3; const x = r() * w; g.beginPath(); g.moveTo(x, r() * h); g.lineTo(x + (r() - .5) * 6, r() * h); g.stroke(); }
  });
  const leaf = tex3('leaf', 64, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h); const sh = new Path2D('M 32 252 C 52 200 60 120 32 4 C 4 120 12 200 32 252 Z');
    const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#9CB86A'); gr.addColorStop(.5, '#DDEAB8'); gr.addColorStop(1, '#8AAA5C'); g.fillStyle = gr; g.fill(sh);
    g.strokeStyle = 'rgba(255,255,230,.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(32, 250); g.lineTo(32, 10); g.stroke();
    g.strokeStyle = 'rgba(60,80,30,.35)'; g.lineWidth = 1; for (let y = 40; y < 230; y += 18) { g.beginPath(); g.moveTo(32, y); g.lineTo(14, y - 14); g.moveTo(32, y); g.lineTo(50, y - 14); g.stroke(); }
  });
  return {
    bark: new THREE.MeshStandardMaterial({ map: bark.rep(1, 2), color: '#B0A090', roughness: .9 }),
    leaf: new THREE.MeshStandardMaterial({ map: leaf, alphaTest: .5, side: THREE.DoubleSide, roughness: .7, color: '#FFFFFF' }),
    fruit: new THREE.MeshPhysicalMaterial({ color: '#2450D8', roughness: .3, clearcoat: .8, iridescence: .8, iridescenceIOR: 1.45, emissive: '#0A1A60', emissiveIntensity: .35 }),
  };
})();
const LEAF_GEO = (() => { const g = new THREE.PlaneGeometry(.15, .52, 1, 3); g.translate(0, .26, 0); const p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, -Math.pow(p.getY(i) / .52, 2) * .08); g.computeVertexNormals(); return g; })();
const FRUIT_GEO = new THREE.SphereGeometry(.05, 14, 10);

// tree3(parent, o): a rudraksha tree. o: seed, H (height, m), at [x, z], tiers, sub (sub-branches per branch).
// set(g 0..1): the growth (trunk, then the tiers bottom to top, the leaves, then the fruit).
function tree3(parent, o = {}) {
  const r = lcg(o.seed ?? 1), G = new THREE.Group(), H = o.H ?? 7.5, tiers = o.tiers ?? 8, nodes = [], anchors = [];
  G.position.set(o.at?.[0] ?? 0, 0, o.at?.[1] ?? 0); G.rotation.y = r() * TAU; parent.add(G);
  const cyl = (L, r0, r1) => { const g = new THREE.CylinderGeometry(r1, r0, L, 8, 1); g.translate(0, L / 2, 0); return g; };
  const trunk = mesh3(G, cyl(H, .22, .05), TREE_MAT.bark, [0, 0, 0]); nodes.push({ m: trunk, birth: 0, dur: .45 });
  for (let j = 0; j < tiers; j++) {
    const f = j / (tiers - 1), h = H * (.3 + .66 * f), nb = 3 + (r() < .4 ? 1 : 0), L = lerp(3.0, 1.0, f) * (.85 + .3 * r()) * H / 7.5;
    for (let b = 0; b < nb; b++) {
      const bg = new THREE.Group(); bg.position.set(0, h, 0); bg.rotation.order = 'YZX'; bg.rotation.set(0, j * 1.1 + b * TAU / nb + r() * .5, -lerp(1.3, .8, f)); G.add(bg);
      const birth = .45 * (h / H), m = mesh3(bg, cyl(L, .06 * H / 7.5, .015), TREE_MAT.bark, [0, 0, 0]); nodes.push({ m, g: bg, birth, dur: .22 });
      const subs = o.sub ?? 3;
      for (let s = 0; s < subs; s++) {
        const fs = .4 + .5 * s / Math.max(1, subs - 1), sg = new THREE.Group(); sg.position.set(0, L * fs, 0); sg.rotation.order = 'YZX'; sg.rotation.set(0, (s % 2 ? 1 : -1) * (1 + r() * .6), .5 + r() * .3); bg.add(sg);
        const Ls = L * .38, sm = mesh3(sg, cyl(Ls, .022, .008), TREE_MAT.bark, [0, 0, 0]); nodes.push({ m: sm, g: sg, birth: birth + .22 * fs, dur: .12 });
        const an = new THREE.Object3D(); an.position.set(0, Ls, 0); sg.add(an); anchors.push({ o: an, birth: birth + .22 * fs + .12 });
      }
      const an = new THREE.Object3D(); an.position.set(0, L, 0); bg.add(an); anchors.push({ o: an, birth: birth + .22 });
    }
  }
  // grow it all, then hang the leaves and fruit off the anchors (in the tree's own space)
  nodes.forEach(nd => nd.m.scale.set(1, 1, 1)); G.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(G.matrixWorld).invert(), leaves = [], fruits = [], M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler();
  for (const a of anchors) {
    const base = new THREE.Matrix4().multiplyMatrices(inv, a.o.matrixWorld), p = V3().setFromMatrixPosition(base), nl = 9 + Math.floor(r() * 5);
    for (let i = 0; i < nl; i++) {
      Q.setFromEuler(E.set((r() - .5) * .5 + .3, i / nl * TAU + r() * .4, 1.1 + r() * .5, 'YXZ'));
      const Ml = new THREE.Matrix4().compose(V3(0, 0, 0), Q, V3(1, 1, 1));
      const W = new THREE.Matrix4().makeTranslation(p.x, p.y, p.z).multiply(Ml);
      leaves.push({ M: W, birth: a.birth + .02 + r() * .08, red: r() < .07 });
    }
    if (r() < .75) { const nf = 3 + Math.floor(r() * 5); for (let i = 0; i < nf; i++) fruits.push({ p: V3(p.x + (r() - .5) * .35, p.y - .12 - r() * .3, p.z + (r() - .5) * .35), birth: .78 + r() * .14 }); }
  }
  const LI = new THREE.InstancedMesh(LEAF_GEO, TREE_MAT.leaf, leaves.length); LI.castShadow = true; LI.receiveShadow = true; G.add(LI);
  const green = [new THREE.Color('#3E6A2E'), new THREE.Color('#4E7A34'), new THREE.Color('#355A28')], red = new THREE.Color('#C04428');
  leaves.forEach((l, i) => LI.setColorAt(i, l.red ? red : green[i % 3]));
  const FI = new THREE.InstancedMesh(FRUIT_GEO, TREE_MAT.fruit, fruits.length); FI.castShadow = true; G.add(FI);
  const S1 = new THREE.Matrix4();
  const set = (g) => {
    G.visible = g > .001;
    for (const nd of nodes) { const k = clamp((g - nd.birth) / nd.dur); nd.m.visible = k > .001; nd.m.scale.set(Math.max(.05, Math.sqrt(k)), Math.max(k, .001), Math.max(.05, Math.sqrt(k))); if (nd.g) nd.g.visible = k > .001; }
    leaves.forEach((l, i) => { const k = easeOut(clamp((g - l.birth) / .1)); S1.makeScale(k + .001, k + .001, k + .001); M.multiplyMatrices(l.M, S1); LI.setMatrixAt(i, M); });
    fruits.forEach((f, i) => { const k = easeOut(clamp((g - f.birth) / .08)); M.compose(f.p, Q.identity(), V3(k + .001, k + .001, k + .001)); FI.setMatrixAt(i, M); });
    LI.instanceMatrix.needsUpdate = FI.instanceMatrix.needsUpdate = true;
  };
  set(1);
  return { group: G, set, H, fruits };
}

function forest3() {
  const W = world3(), S = W.scene;
  // stars
  const stars = tex3('stars', 2048, 1024, (g, w, h) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, w, h); const r = lcg(23);
    for (let i = 0; i < 2600; i++) { const y = Math.pow(r(), 1.6) * h * .55, b = r(); g.fillStyle = `rgba(${200 + r() * 55},${210 + r() * 45},255,${.25 + b * .75})`; g.beginPath(); g.arc(r() * w, y, b < .97 ? .7 + b * .8 : 2.2, 0, TAU); g.fill(); }
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(280, 48, 24), new THREE.MeshBasicMaterial({ map: stars, side: THREE.BackSide, fog: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); sky.renderOrder = -.5; S.add(sky);
  const nightSky = sky3(S, [[1, '#04060E'], [.45, '#0A1430'], [.15, '#18284C'], [0, '#26375C'], [-1, '#0A0C12']]); nightSky.visible = false;
  const moon = new THREE.Group(); moon.position.set(-70, 95, -170); S.add(moon);
  glow3(moon, [0, 0, 0], 70, '#9FB8FF', .5); glow3(moon, [0, 0, 0], 18, '#E8F0FF', .9); glow3(moon, [0, 0, 0], 7, '#FFFFFF', 1);
  // ridges: layered silhouettes, the far ones snow-lit
  const ridge = (key, col, snow, seed, amp) => tex3('ridge' + key, 2048, 512, (g, w, h) => {
    const r = lcg(seed); let y = h * .55; const pts = [];
    for (let x = 0; x <= w; x += 8) { y += (r() - .5) * 26 * amp; y = clamp(y, h * .12, h * .8); pts.push([x, y + Math.sin(x * .006 + seed) * 60 * amp]); }
    g.beginPath(); g.moveTo(0, h); pts.forEach(([x, yy]) => g.lineTo(x, yy)); g.lineTo(w, h); g.closePath();
    const top = Math.min(...pts.map(q => q[1])), gr = g.createLinearGradient(0, top, 0, h); gr.addColorStop(0, snow || col); gr.addColorStop(.35, col); gr.addColorStop(1, col); g.fillStyle = gr; g.fill();
  });
  for (const [k, z, col, snow, sd, amp, hgt, y0] of [['a', -230, '#283452', '#7A8CB8', 3, 1.6, 120, -10], ['b', -150, '#1A2236', null, 7, 1, 60, -6], ['c', -90, '#111827', null, 11, .8, 34, -4]]) {
    mesh3(S, new THREE.PlaneGeometry(700, hgt), new THREE.MeshBasicMaterial({ map: ridge(k, col, snow, sd, amp), transparent: true, fog: false, depthWrite: false }), [0, y0 + hgt / 2, z], { cast: false, receive: false }).renderOrder = -.4;
  }
  // the ground: moss and earth
  const earth = tex3('earth', 512, 512, (g, w, h) => {
    g.fillStyle = '#2E3420'; g.fillRect(0, 0, w, h); const r = lcg(14);
    for (let i = 0; i < 80; i++) { const x = r() * w, y = r() * h, rr = 30 + r() * 90, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, r() < .5 ? 'rgba(70,58,40,.5)' : 'rgba(40,60,30,.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
    for (let i = 0; i < 9000; i++) { g.fillStyle = r() < .5 ? 'rgba(0,0,0,.3)' : 'rgba(150,170,110,.12)'; g.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2); }
  });
  mesh3(S, new THREE.CircleGeometry(160, 64), new THREE.MeshStandardMaterial({ map: earth.rep(40, 40), roughness: .95 }), [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // grass tufts round the clearing
  { const blade = new THREE.ConeGeometry(.016, .32, 3); blade.translate(0, .16, 0); const n = 6000, im = new THREE.InstancedMesh(blade, new THREE.MeshStandardMaterial({ color: '#6A8A44', roughness: .8 }), n), r = lcg(9), M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler();
    for (let i = 0; i < n; i++) { let a = r() * TAU, d = 1.2 + Math.pow(r(), .7) * 26; if (Math.sin(a) > .2 && d < 20 && r() < .9) d = 20 + r() * 8;   // keep the camera's side of the clearing open
      Q.setFromEuler(E.set((r() - .5) * .6, r() * TAU, (r() - .5) * .6)); const s = .6 + r() * 1.1; M.compose(V3(Math.cos(a) * d, 0, Math.sin(a) * d), Q, V3(s, s, s)); im.setMatrixAt(i, M); }
    im.receiveShadow = true; S.add(im); }
  // trees: the first where the tear falls, the rest round it
  const hero = tree3(S, { seed: 3, H: 7.5, at: [0, 0] });
  const others = [[7, -6, 11, 8.4], [-8, -9, 21, 9], [-5, 5, 31, 6.6], [10, 4, 41, 7.2], [-14, -2, 51, 8.6], [3, -15, 61, 9.4], [16, -12, 71, 8], [-11, -18, 81, 9.2]]
    .map(([x, z, sd, H], i) => ({ T: tree3(S, { seed: sd, H, at: [x, z], tiers: 6, sub: 2 }), at: [x, z], i }));
  // the tear: a drop of light, its trail and the ring where it lands
  const tear = new THREE.Group(); S.add(tear);
  const drop = mesh3(tear, new THREE.SphereGeometry(.07, 24, 16), new THREE.MeshBasicMaterial({ color: '#E8F4FF', fog: false }), [0, 0, 0], { cast: false }); drop.scale.set(1, 1.5, 1);
  const dg = glow3(tear, [0, 0, 0], 1.4, '#9CC8FF', .9), dg2 = glow3(tear, [0, .4, 0], .9, '#BFDFFF', .4);
  const ringMat = new THREE.MeshBasicMaterial({ color: '#B8DCFF', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, side: THREE.DoubleSide });
  const ring = mesh3(S, new THREE.RingGeometry(.9, 1, 96), ringMat, [0, .03, 0], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false });
  const spot = glow3(S, [0, .2, 0], 4, '#9CC8FF', 0);
  const tearLight = new THREE.PointLight('#A8D0FF', 0, 14, 1.5); S.add(tearLight);
  const setTear = (pos, a = 1) => { tear.visible = a > .01 && !!pos; if (pos) { tear.position.set(...pos); tearLight.position.set(pos[0], pos[1] + .3, pos[2]); } dg.material.opacity = .9 * a; dg2.material.opacity = .4 * a; tearLight.intensity = 12 * a; };
  const setRing = (k, a) => { ring.visible = a > .01; ring.scale.setScalar(.2 + k * 9); ringMat.opacity = a; spot.material.opacity = a * .8; spot.scale.setScalar(3 + 6 * k); };
  // little lights of the other tears, falling far off
  const far = others.map(o => glow3(S, [o.at[0], 6, o.at[1]], 1.2, '#A8D0FF', 0));
  const mood = (o = {}) => {
    const ex = W.mood('night', { hemi: o.hemi ?? 1.1, sun: o.moon ?? 2.6, sunAt: [-8, 10, 12], exposure: o.exposure ?? 1.25 });
    W.skies.night.visible = false; nightSky.visible = true;
    W.sun.color.set('#A8BCFF'); W.hemi.color.set('#5A6A9A'); W.hemi.groundColor.set('#1A1A12');
    S.fog.color.set('#141C30'); S.fog.near = 14; S.fog.far = 110;
    return ex;
  };
  return { W, S, hero, others, setTear, setRing, far, mood };
}

// a soft dark band (under captions or a list)
function band(c, y0, y1, a = .5) {
  if (a <= 0) return; c.save(); const g = c.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, 'rgba(6,4,6,0)'); g.addColorStop(.25, `rgba(6,4,6,${a})`); g.addColorStop(.75, `rgba(6,4,6,${a})`); g.addColorStop(1, 'rgba(6,4,6,0)');
  c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); c.restore();
}
