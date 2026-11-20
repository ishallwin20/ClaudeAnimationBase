// tvidhi_parts.js: pieces from ad 82/83 (puja_sets.js without its HOME set): mango leaves, lime plaster, a rangoli,
// toran3 (mango, marigold, beads), diya3, kalash3, door3.

// ======================================================================================================
// textures
const leafTex3 = () => tex3('mangoLeaf', 128, 512, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#1E4A18'); gr.addColorStop(.5, '#2F6A22'); gr.addColorStop(1, '#1E4A18');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  const r = lcg(7); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${r() < .5 ? '10,30,8' : '120,170,70'},${.05 + r() * .06})`; g.fillRect(r() * w, r() * h, 2, 2); }
  g.strokeStyle = 'rgba(170,200,110,.5)'; g.lineWidth = 3; g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke();   // the midrib
  g.strokeStyle = 'rgba(150,190,100,.35)'; g.lineWidth = 1.6;
  for (let y = 18; y < h - 10; y += 22) for (const s of [-1, 1]) { g.beginPath(); g.moveTo(w / 2, y); g.quadraticCurveTo(w / 2 + s * w * .25, y + 14, w / 2 + s * w * .48, y + 34); g.stroke(); }
});
// lime plaster: warm wash with stains and trowel marks
const plasterTex3 = (col, bump) => tex3('plaster' + col + (bump ? 'b' : ''), 512, 512, (g, w, h) => {
  g.fillStyle = bump ? '#808080' : col; g.fillRect(0, 0, w, h);
  const r = lcg(bump ? 3 : 5);
  for (let i = 0; i < 220; i++) { const x = r() * w, y = r() * h, rr = 15 + r() * 70, gr = g.createRadialGradient(x, y, 0, x, y, rr), dk = r() < .55;
    gr.addColorStop(0, bump ? (dk ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.12)') : (dk ? 'rgba(90,50,20,.07)' : 'rgba(255,250,235,.09)')); gr.addColorStop(1, 'rgba(0,0,0,0)');
    for (const [dx, dy] of [[0, 0], [w, 0], [-w, 0], [0, h], [0, -h]]) { g.save(); g.translate(dx, dy); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); g.restore(); } }
  for (let i = 0; i < 6000; i++) { g.fillStyle = bump ? `rgba(${r() < .5 ? 0 : 255},${r() < .5 ? 0 : 255},${r() < .5 ? 0 : 255},.08)` : `rgba(${r() < .5 ? '60,40,20' : '255,250,240'},${.04 + r() * .05})`; g.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2); }
}, bump ? { data: true } : {});
const plaster3 = (col, rep = [3, 3]) => new THREE.MeshStandardMaterial({ map: plasterTex3(col).rep(...rep), bumpMap: plasterTex3(col, 1).rep(...rep), bumpScale: 1.4, roughness: .92 });
// sandstone with a carved frieze (bump) along a beam: stupas, trees, figures in panels
const friezeTex3 = (bump) => tex3('frieze' + (bump ? 'b' : ''), 1024, 128, (g, w, h) => {
  g.fillStyle = bump ? '#606060' : '#C79A6C'; g.fillRect(0, 0, w, h);
  const hi = bump ? '#D8D8D8' : 'rgba(255,230,190,.35)', lo = bump ? '#303030' : 'rgba(90,50,25,.35)';
  g.fillStyle = lo; g.fillRect(0, 10, w, 6); g.fillRect(0, h - 16, w, 6);
  for (let i = 0; i < 8; i++) { const x = i * 128 + 64;
    g.fillStyle = hi;
    if (i % 3 === 0) { g.beginPath(); g.arc(x, 92, 34, Math.PI, 0); g.fill(); g.fillRect(x - 6, 40, 12, 20); g.fillRect(x - 40, 92, 80, 12); }      // a stupa
    else if (i % 3 === 1) { g.fillRect(x - 5, 60, 10, 46); g.beginPath(); g.arc(x, 48, 28, 0, TAU); g.fill(); }                                     // a tree
    else { for (const dx of [-26, 0, 26]) { g.beginPath(); g.arc(x + dx, 46, 9, 0, TAU); g.fill(); g.fillRect(x + dx - 9, 56, 18, 48); } }            // figures
    g.fillStyle = lo; g.fillRect(i * 128, 16, 5, h - 32);
  }
}, bump ? { data: true } : {});
const sandstone3 = (o = {}) => stone3({ col: '#C49A6C', dark: '#6A4428', joint: 'rgba(80,50,30,.4)', rows: o.rows ?? 2, cols: o.cols ?? 1, seed: o.seed ?? 12, speck: .7, mottle: 1.4, rep: o.rep || [1, 1], bumpK: 2.4, rough: .9 });
const friezeMat3 = () => new THREE.MeshStandardMaterial({ map: friezeTex3().rep(3, 1), bumpMap: friezeTex3(1).rep(3, 1), bumpScale: 4, roughness: .9 });
// mirror-work and embroidery for the bandhanwar
const clothTex3 = (kind) => tex3('bandh' + kind, 512, 128, (g, w, h) => {
  g.fillStyle = kind === 'flap' ? '#1F7A3A' : '#C21E2E'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#F2B81E'; g.fillRect(0, 0, w, 10); g.fillRect(0, h - 10, w, 10);
  for (let i = 0; i < 8; i++) { const x = i * 64 + 32, y = h / 2;
    g.fillStyle = '#F2B81E'; g.beginPath(); for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; g.lineTo(x + Math.cos(a) * 24, y + Math.sin(a) * 24); } g.fill();
    g.fillStyle = '#E6EEF2'; g.beginPath(); g.arc(x, y, 13, 0, TAU); g.fill(); g.fillStyle = 'rgba(120,150,170,.6)'; g.beginPath(); g.arc(x + 3, y + 3, 7, 0, TAU); g.fill();
    g.fillStyle = kind === 'flap' ? '#F04A8A' : '#1F7A3A'; for (const dx of [-32, 32]) { g.beginPath(); g.arc(x + dx, y, 6, 0, TAU); g.fill(); } }
});
// a rangoli of petals and dots (turmeric, kumkum, white, green) with a lotus in the middle
const rangoli2Tex3 = () => tex3('rangoli2', 1024, 1024, (g, w) => {
  g.clearRect(0, 0, w, w); const c = w / 2;
  const ring = (r, n, col, rr, sh = 'petal') => { for (let i = 0; i < n; i++) { const a = i / n * TAU; g.save(); g.translate(c + Math.cos(a) * r, c + Math.sin(a) * r); g.rotate(a); g.fillStyle = col;
    if (sh === 'petal') { g.beginPath(); g.ellipse(0, 0, rr, rr * .45, 0, 0, TAU); g.fill(); } else { g.beginPath(); g.arc(0, 0, rr, 0, TAU); g.fill(); } g.restore(); } };
  g.fillStyle = 'rgba(250,246,236,.95)'; g.beginPath(); g.arc(c, c, 470, 0, TAU); g.fill();
  g.fillStyle = '#C8202E'; g.beginPath(); g.arc(c, c, 452, 0, TAU); g.fill();
  ring(420, 24, '#F2A81E', 42); ring(420, 48, '#FBF6EA', 6, 'dot');
  g.fillStyle = '#1F7A3A'; g.beginPath(); g.arc(c, c, 360, 0, TAU); g.fill();
  ring(320, 16, '#FBF6EA', 52); ring(250, 12, '#F05A28', 60);
  g.fillStyle = '#F2C21E'; g.beginPath(); g.arc(c, c, 180, 0, TAU); g.fill();
  ring(120, 8, '#E8306A', 70); g.fillStyle = '#FBF6EA'; g.beginPath(); g.arc(c, c, 46, 0, TAU); g.fill();
  ring(470, 60, '#FBF6EA', 7, 'dot');
});

// ======================================================================================================
// pieces
// one mango leaf: a lanceolate blade (length L, width Wd) hanging down from its stem at the origin, folded along the
// midrib and curling out at the tip
function leafGeo3(L = .2, Wd = .055) {
  const geo = new THREE.PlaneGeometry(1, 1, 4, 12), p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const u = p.getX(i) + .5, s = .5 - p.getY(i);             // u across 0..1, s along 0 (stem) .. 1 (tip)
    const half = Wd / 2 * Math.pow(Math.sin(Math.PI * Math.min(1, s * 1.02 + .02)), .75) * (s < .08 ? s / .08 * .6 + .4 : 1), x = (u - .5) * 2 * half;
    p.setXYZ(i, x, -s * L, -Math.abs(x) * .45 + .05 * L * s * s);
  }
  geo.computeVertexNormals(); return geo;
}
const LEAF3 = { geo: leafGeo3(.2, .06), mats: ['#FFFFFF', '#CFE6B0', '#9FC48A'].map(col => new THREE.MeshStandardMaterial({ map: leafTex3(), color: col, roughness: .42, side: THREE.DoubleSide, envMapIntensity: .8 })) };
// the cord's sag
const sagY = (x, hw, y0, sag) => y0 - sag * (1 - Math.pow(x / hw, 2));

// toran3(parent, o): a toran across a door. o.kind 'mango' | 'marigold' | 'beads'; o.w its width, o.y the cord's height
// at its ends, o.z, o.sag, o.n (leaves), o.len (leaf length). Returns { group, set(t, o) }: o.wind (0..1 sway),
// o.on (0..1: the leaves drop into place, left to right with o.on as a wave), o.scaleIn.
function toran3(parent, o = {}) {
  const G = new THREE.Group(); G.position.set(o.x ?? 0, 0, o.z ?? 0); parent.add(G);
  const kind = o.kind || 'mango', hw = (o.w ?? 1.5) / 2, y0 = o.y ?? 2.45, sag = o.sag ?? .03, R = lcg(o.seed ?? 3), items = [];
  // the cord
  const cordPts = []; for (let i = 0; i <= 16; i++) { const x = -hw + 2 * hw * i / 16; cordPts.push([x, sagY(x, hw, y0, sag), .0]); }
  if (kind !== 'beads') tubeP3(G, cordPts, .006, std3(kind === 'mango' ? '#B8862E' : '#E8D8B0', .7), { segs: 32, radial: 6 });
  if (kind === 'mango') {
    const n = o.n ?? Math.round(2 * hw / .034), L = o.len ?? .22;
    for (let i = 0; i < n; i++) {
      const x = -hw + .02 + (2 * hw - .04) * (i + .5) / n, piv = new THREE.Group(); piv.position.set(x, sagY(x, hw, y0, sag) + .008, .004 * (i % 2)); G.add(piv);
      const lf = mesh3(piv, LEAF3.geo, LEAF3.mats[Math.floor(R() * 3)], [0, 0, 0], { scale: (L / .2) * (.9 + R() * .2), cast: o.cast ?? true });
      lf.rotation.set((R() - .3) * .25, (R() - .5) * .9, (R() - .5) * .18);
      // the folded stem over the cord
      mesh3(piv, new THREE.BoxGeometry(.006, .03, .004), std3('#5A7A2A', .6), [0, .006, -.006], { cast: false });
      items.push({ piv, ph: R() * TAU, k: .8 + R() * .4, x });
    }
    // a marigold at each end where the cord is tied
    for (const s of [-1, 1]) mesh3(G, new THREE.IcosahedronGeometry(.032, 2), std3('#F28A0C', .75, { bumpMap: stoneTex({ seed: 30, rows: 1, cols: 1, speck: 2 }).bump.rep(2, 2), bumpScale: 5 }), [s * hw, y0, .01]);
  } else if (kind === 'marigold') {
    const n = o.n ?? 15, cols = ['#F28A0C', '#F7B21A', '#E8640A'];
    const fm = cols.map(col => std3(col, .8, { bumpMap: stoneTex({ seed: 31, rows: 1, cols: 1, speck: 2.5 }).bump.rep(3, 3), bumpScale: 6 })), fgeo = new THREE.IcosahedronGeometry(.03, 2);
    for (let i = 0; i < n; i++) {
      const x = -hw + 2 * hw * (i + .5) / n, piv = new THREE.Group(); piv.position.set(x, sagY(x, hw, y0, sag), 0); G.add(piv);
      const m = Math.round(4 + 4 * Math.pow(Math.sin(Math.PI * (i + .5) / n), 1.5) + (i % 2 ? 0 : 1));   // longer strands in the middle (a swag)
      for (let j = 0; j < m; j++) mesh3(piv, fgeo, fm[(i + j) % 3], [0, -.035 - j * .052, 0], { scale: [1, .8, 1] });
      mesh3(piv, LEAF3.geo, LEAF3.mats[0], [0, -.035 - m * .052, 0], { scale: .45 });   // a little leaf at the end
      items.push({ piv, ph: R() * TAU, k: .6 + R() * .3, x });
    }
    const along = new THREE.IcosahedronGeometry(.036, 2);
    for (let i = 0; i <= 2 * n; i++) { const x = -hw + 2 * hw * i / (2 * n); mesh3(G, along, fm[i % 3], [x, sagY(x, hw, y0, sag) + .01, .01], { scale: [1, .85, 1] }); }
  } else {
    // the bandhanwar: an embroidered band with mirrors, triangular flaps under it, a bead tassel at each tip
    const band = mesh3(G, new THREE.BoxGeometry(2 * hw, .13, .01), new THREE.MeshStandardMaterial({ map: clothTex3('band').rep(2 * hw / .7, 1), roughness: .8, metalness: .05 }), [0, y0 - .06, 0]);
    const n = o.n ?? 9, fw = 2 * hw / n, tri = new THREE.Shape([new THREE.Vector2(-fw / 2, 0), new THREE.Vector2(fw / 2, 0), new THREE.Vector2(0, -fw * 1.15)]);
    const flapGeo = new THREE.ShapeGeometry(tri); { const uv = flapGeo.attributes.uv, p = flapGeo.attributes.position; for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) / fw + .5) * .25, 1 + p.getY(i) / (fw * 1.15)); }
    const flapM = new THREE.MeshStandardMaterial({ map: clothTex3('flap'), roughness: .8, side: THREE.DoubleSide });
    const beadM = ['#F2B81E', '#E8306A', '#1F9AD8', '#FFFFFF', '#2FA84A'].map(col => std3(col, .25, { metalness: .2 })), bgeo = new THREE.SphereGeometry(.011, 10, 8);
    for (let i = 0; i < n; i++) {
      const x = -hw + fw * (i + .5), piv = new THREE.Group(); piv.position.set(x, y0 - .125, .002); G.add(piv);
      mesh3(piv, flapGeo, flapM, [0, 0, 0]);
      const edge = new THREE.Mesh(new THREE.EdgesGeometry(flapGeo), new THREE.LineBasicMaterial({ color: '#F2B81E' })); piv.add(edge);
      for (let j = 0; j < 7; j++) mesh3(piv, bgeo, beadM[(i + j) % 5], [0, -fw * 1.15 - .012 - j * .022, 0], { cast: false });
      mesh3(piv, new THREE.ConeGeometry(.018, .05, 10), beadM[0], [0, -fw * 1.15 - .19, 0], { rot: [Math.PI, 0, 0] });
      items.push({ piv, ph: R() * TAU, k: .35 + R() * .2, x });
    }
  }
  const set = (t, s = {}) => {
    const wind = s.wind ?? .5, on = s.on ?? 1; G.visible = on > .001;
    for (const it of items) {
      const gust = .6 + .4 * Math.sin(t * .9 + it.x * 1.3);
      const a = wind * it.k * gust * (.09 * Math.sin(t * 2.3 + it.ph) + .04 * Math.sin(t * 5.1 + it.ph * 2));
      // dropping into place: each item swings down from up in front, in a wave across the door
      const k = clamp(on * 1.6 - (it.x / hw + 1) / 2 * .6), drop = easeOut(k);
      it.piv.rotation.set(a - (1 - drop) * 2.4, 0, .3 * a);
      it.piv.scale.setScalar(Math.max(.001, Math.min(1, k * 3)));
    }
  };
  set(0, {});
  return { group: G, set, items };
}

// a clay diya with its flame (o.light: a point light)
function diya3(parent, pos, o = {}) {
  const g = new THREE.Group(); g.position.set(...pos); parent.add(g);
  mesh3(g, lathe3(smooth3([[0, 0], [.03, 0], [.05, .012], [.06, .028], [.055, .03], [.04, .018], [0, .014]], 3), 28), std3('#9A4A22', .85), [0, 0, 0]);
  mesh3(g, new THREE.CircleGeometry(.042, 20), std3('#E0B040', .2, { emissive: '#5A3A08', emissiveIntensity: .4 }), [0, .022, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const f = flame3(g, [.03, .03, 0], o.k ?? .55, { light: o.light ?? false, power: o.power ?? 1.2, range: o.range ?? 4, seed: pos[0] * 9 });
  return { group: g, set: (t, on) => { f.set(t, on); if (f.light) f.light.intensity = (o.power ?? 1.2) * clamp(on) * (.96 + .04 * Math.sin(t * 2.1 + pos[0] * 5)); }, flame: f };
}
// a copper kalash with five mango leaves and a coconut
function kalash3(parent, pos, s = 1) {
  const K = new THREE.Group(); K.position.set(...pos); K.scale.setScalar(s); parent.add(K);
  const cu = new THREE.MeshStandardMaterial({ color: '#C47848', metalness: .7, roughness: .3 });
  mesh3(K, lathe3(smooth3([[0, 0], [.1, 0], [.17, .08], [.19, .2], [.15, .3], [.08, .35], [.075, .38], [.11, .41], [0, .41]], 4), 48), cu, [0, 0, 0]);
  for (let i = 0; i < 3; i++) mesh3(K, new THREE.TorusGeometry(.185 - i * .006, .006, 6, 40), std3(i === 1 ? '#F2C21E' : '#C21E28', .8), [0, .17 + i * .02, 0], { rot: [Math.PI / 2, 0, 0], cast: false });
  // the swastika-free kalash: a kumkum band and dots
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; mesh3(K, new THREE.SphereGeometry(.012, 8, 6), std3('#C21E28', .7), [Math.cos(a) * .188, .25, Math.sin(a) * .188], { cast: false }); }
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + .3, lf = new THREE.Group(); lf.position.set(Math.cos(a) * .07, .41, Math.sin(a) * .07); lf.rotation.set(0, -a + Math.PI / 2, 0); K.add(lf);
    const m = mesh3(lf, LEAF3.geo, LEAF3.mats[i % 2], [0, 0, 0], { scale: 1.1 }); m.rotation.set(-2.25, 0, 0); }
  mesh3(K, new THREE.SphereGeometry(.1, 20, 14), new THREE.MeshStandardMaterial({ color: '#6A4426', roughness: 1, bumpMap: stoneTex({ seed: 4, rows: 8, cols: 1, speck: 1.5 }).bump, bumpScale: 3 }), [0, .5, 0], { scale: [1, 1.2, 1] });
  mesh3(K, new THREE.TorusGeometry(.085, .01, 6, 30), std3('#D2262E', .8), [0, .46, 0], { rot: [Math.PI / 2, 0, 0] });
  mesh3(K, new THREE.ConeGeometry(.03, .08, 8), std3('#8A6A3A', 1), [0, .64, 0]);
  return K;
}
// a carved double door in its frame (teak), its leaves hinged at the outer edges: open(k) 0..1
function door3(parent, o = {}) {
  const G = new THREE.Group(); G.position.set(o.x ?? 0, 0, o.z ?? 0); parent.add(G);
  const dw = o.w ?? 1.3, dh = o.h ?? 2.35, wood = o.wood || pbr3('darkwood', { rep: [1, 2], tint: '#B07A50', rough: .9 }), woodH = o.woodH || pbr3('darkwood', { rep: [.5, 1], tint: '#8A5A38', rough: .8 });
  const brass = new THREE.MeshStandardMaterial({ color: '#C9963E', metalness: .85, roughness: .32 });
  // the frame: jambs and a lintel standing proud, a moulded band, a rosette at the centre of the lintel
  for (const s of [-1, 1]) {
    block3(G, .2, dh + .02, .3, wood, [s * (dw / 2 + .1), 0, .02]);
    block3(G, .06, dh - .1, .06, woodH, [s * (dw / 2 + .1) + s * -.05, .05, .19]);
  }
  block3(G, dw + .7, .3, .32, wood, [0, dh, .02]);
  block3(G, dw + .82, .06, .38, woodH, [0, dh + .3, .02]);
  // the threshold
  block3(G, dw + .4, .1, .34, woodH, [0, 0, .02]);
  // the two leaves, hinged at x = ±dw/2
  const leaves = [];
  for (const s of [-1, 1]) {
    const hinge = new THREE.Group(); hinge.position.set(s * dw / 2, .1, -.04); G.add(hinge);
    const lw = dw / 2 - .01, L = new THREE.Group(); L.position.set(-s * lw / 2, 0, 0); hinge.add(L);
    block3(L, lw, dh - .1, .07, wood, [0, 0, 0]);
    for (let r = 0; r < 3; r++) { const ph = (dh - .5) / 3; block3(L, lw - .14, ph - .1, .03, woodH, [0, .2 + r * ph + .05, .04]); }
    for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) mesh3(L, new THREE.SphereGeometry(.016, 10, 8), brass, [(c - .5) * (lw - .12), .2 + r * (dh - .5) / 3, .06]);
    mesh3(L, new THREE.TorusGeometry(.04, .007, 8, 24), brass, [s * (lw / 2 - .07), 1.05, .07]);
    leaves.push({ hinge, s });
  }
  const open = (k) => leaves.forEach(({ hinge, s }) => { hinge.rotation.y = s * -1.35 * easeIO(k); });
  return { group: G, open, dw, dh };
}

// ======================================================================================================
// HOME
