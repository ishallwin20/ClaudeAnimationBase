// toran_sets.js: the 3D sets of "Why mango leaves over the door?" (ad 82). Three scenes, built once at load:
//   HOME   a house front: a lime-washed wall, a carved teak door (its two leaves swing open), a stone step with a kalash
//          and diyas, a rangoli, and three torans for the door: mango leaves, marigold strands, a beaded bandhanwar;
//          gold footprints walking in. Morning sun or night lamps.
//   SANCHI the north gateway of the Great Stupa in sandstone (two pillars, elephant capitals, three architraves with
//          scrolled ends, the dharmachakra on top), the stupa and its railing behind.
//   CITY   a street of houses toward a palace gate: every gate gets a mango toran, a cloth swag, two water pots and lamps
//          (Bhagavata 4.9.55); festive arches with pennants across the road (1.11.13); the sea beyond.
// Units are metres, y up; every set faces +z (the camera stands at +z).

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
const HOME = (() => {
  const S = new THREE.Scene(); S.fog = new THREE.Fog('#000000', 30, 90);
  const hemi = new THREE.HemisphereLight('#CFE0F4', '#8A6A48', .9); S.add(hemi);
  const sun = new THREE.DirectionalLight('#FFE6C4', 3); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 60 }); sun.shadow.bias = -.0004; sun.shadow.normalBias = .015; sun.shadow.radius = 2.5;
  S.add(sun, sun.target); sun.target.position.set(0, 1.5, 0);
  const bg = backdrop3(S, '#8FB4D8', '#CFE0EC', '#A89070', 50);
  // ground: old flagstones; the wall with a door opening; a roof eave above
  mesh3(S, new THREE.PlaneGeometry(30, 30), stone3({ col: '#9A8A76', rows: 3, cols: 3, seed: 21, rep: [10, 10], mottle: 1.2 }), [0, 0, 10], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const wallM = plaster3('#E6B474', [2.4, 1.6]), dw = 1.3, dh = 2.35, WW = 9, WH = 5.2, T = .35;
  block3(S, (WW - dw) / 2, WH, T, wallM, [-(dw / 2 + (WW - dw) / 4), 0, -T / 2]);
  block3(S, (WW - dw) / 2, WH, T, wallM, [(dw / 2 + (WW - dw) / 4), 0, -T / 2]);
  block3(S, dw, WH - dh, T, wallM, [0, dh, -T / 2]);
  // a red-ochre dado band at the foot of the wall and a white border (geru and lime)
  for (const sd of [-1, 1]) { const x0 = dw / 2 + .22, w = WW / 2 - x0;   // left and right of the door frame, never across the doorway
    block3(S, w, .55, .02, plaster3('#9A3A22', [1, .2]), [sd * (x0 + w / 2), 0, .01]);
    block3(S, w, .05, .025, plaster3('#F4ECDC', [1, .1]), [sd * (x0 + w / 2), .55, .01]); }
  const borderTex = tex3('wallBorder', 1024, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(160,50,30,.9)'; g.fillRect(0, 34, w, 60);
    g.fillStyle = 'rgba(250,244,230,.95)';
    for (let i = 0; i < 16; i++) { const x = i * 64 + 32; for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; g.beginPath(); g.ellipse(x + Math.cos(a) * 12, 64 + Math.sin(a) * 12, 9, 4, a, 0, TAU); g.fill(); } g.beginPath(); g.arc(x, 64, 4, 0, TAU); g.fill(); }
    for (let x = 4; x < w; x += 16) { g.beginPath(); g.arc(x, 24, 3.5, 0, TAU); g.fill(); g.beginPath(); g.arc(x, 104, 3.5, 0, TAU); g.fill(); }
  });
  mesh3(S, new THREE.PlaneGeometry(WW, .5), new THREE.MeshStandardMaterial({ map: borderTex.rep(WW / 2.2, 1), transparent: true, roughness: .9 }), [0, 3.35, .006], { cast: false });
  // the eave: a tiled overhang
  const eaveM = pbr3('darkwood', { rep: [4, .5], tint: '#6A4026', rough: .9 });
  block3(S, WW, .14, .9, eaveM, [0, 3.9, .3]);
  const tiles = mesh3(S, new THREE.BoxGeometry(WW + .4, .08, 1.3), std3('#8A3A22', .85, { bumpMap: stoneTex({ rows: 12, cols: 24, seed: 2 }).bump.rep(2, 1), bumpScale: 3 }), [0, 4.15, .45], { rot: [.3, 0, 0] });
  // the door
  const D = door3(S, { w: dw, h: dh, z: 0 });
  // the room inside, lit warm (seen when the door opens)
  const roomM = plaster3('#B88A62', [1, 1]);
  block3(S, 4, 3, .2, roomM, [0, 0, -3.6]); block3(S, .2, 3, 3.4, roomM, [-1.6, 0, -2]); block3(S, .2, 3, 3.4, roomM, [1.6, 0, -2]);
  mesh3(S, new THREE.PlaneGeometry(3.4, 3.6), std3('#6A4A30', .9), [0, .002, -1.9], { rot: [-Math.PI / 2, 0, 0] });
  const inner = new THREE.PointLight('#FFB060', 0, 9, 1.4); inner.position.set(0, 1.7, -2.4); S.add(inner);
  const innerGlow = glow3(S, [0, 1.3, -3.2], 3.2, '#FFB060', 0);
  const innerLamps = [-1, 0, 1].map(i => diya3(S, [i * .5, .9, -3.45], { k: .7 }));
  block3(S, 1.6, .9, .2, pbr3('darkwood', { rep: [1, 1], tint: '#7A4A2A' }), [0, 0, -3.4]);
  // the step in front, the kalash and a tulsi pot on it, diyas along its edge, a rangoli on the ground
  const stepM = stone3({ col: '#8E8478', rows: 1, cols: 3, seed: 8, rep: [3, 1] });
  block3(S, 3.6, .16, .7, stepM, [0, 0, .5]);
  const K = kalash3(S, [-1.3, .16, .42], 1.0);
  const tul = new THREE.Group(); tul.position.set(1.35, .16, .42); S.add(tul);
  mesh3(tul, lathe3(smooth3([[0, 0], [.14, 0], [.17, .1], [.2, .34], [.22, .36], [0, .36]], 3), 32), std3('#B0582E', .85), [0, 0, 0]);
  const tR = lcg(77), tM = std3('#2E6A26', .6);
  for (let i = 0; i < 60; i++) { const a = tR() * TAU, r = tR() * .14, h = .4 + tR() * .38; mesh3(tul, new THREE.SphereGeometry(.03 + tR() * .02, 8, 6), tM, [Math.cos(a) * r, h, Math.sin(a) * r], { scale: [1, .6, 1] }); }
  const diyas = [-1.0, -.62, -.24, .24, .62, 1.0].map((x, i) => diya3(S, [x, .16, .78], { light: i === 1 || i === 4, power: 3.2, range: 5 }));
  const fill = new THREE.DirectionalLight('#FFD0A0', 0); fill.position.set(1.5, .6, 6); fill.target.position.set(0, 1.8, 0); S.add(fill, fill.target);
  mesh3(S, new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshStandardMaterial({ map: rangoli2Tex3(), transparent: true, roughness: .95, depthWrite: false }), [0, .006, 1.75], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // the three torans (one shows at a time)
  const TOR = { mango: toran3(S, { kind: 'mango', w: 1.62, y: dh + .32, z: .22, sag: .035 }), marigold: toran3(S, { kind: 'marigold', w: 1.62, y: dh + .32, z: .22, sag: .03 }), beads: toran3(S, { kind: 'beads', w: 1.62, y: dh + .42, z: .22, sag: 0 }) };
  // Lakshmi's footprints walking in from the camera through the rangoli to the threshold
  const feet = []; for (let i = 0; i < 8; i++) { const z = 2.75 - i * .3, side = i % 2 ? 1 : -1, y = z < .85 && z > .15 ? .165 : 0;
    const f = foot3(S, side * .1, z, 0, side, { size: .27, col: '#FFC24A', y: y + (z < 2.5 && z > 1 ? .01 : 0) });
    f.material.blending = THREE.NormalBlending; f.renderOrder = 6; f.halo = glow3(S, [side * .1, y + .03, z], .32, '#FFB040', 0); f.halo.renderOrder = 7; feet.push(f); }
  const night = new THREE.HemisphereLight('#3A4870', '#20140C', 0); S.add(night);
  // set(t, o): o.mood 'day' | 'night'; o.toran 'mango' | 'marigold' | 'beads' | null (+ o.on), o.wind, o.open (door 0..1),
  // o.diyas (0..1, or [k per diya]), o.feet (0..8 footprints shown), o.inner (room light 0..1)
  const set = (t, o = {}) => {
    const n = o.mood === 'night', du = o.mood === 'dusk';
    hemi.intensity = n || du ? .05 : .75; night.intensity = n ? .9 : du ? 1.3 : 0; night.color.set(du ? '#7080B8' : '#4A5888');
    sun.intensity = n ? 0 : du ? .5 : (o.sun ?? 3.4); sun.color.set(du ? '#FF9A60' : '#FFD9A6');
    sun.position.set(...(du ? [-6, 2.5, 5] : o.sunAt || [-4.5, 6.5, 6]));
    fill.intensity = n ? .7 : du ? .6 : 0;
    bg.visible = !n && !du; S.background = n ? new THREE.Color('#06060C') : du ? new THREE.Color('#1A1830') : null;
    for (const k in TOR) TOR[k].set(t, { wind: o.wind ?? .6, on: k === (o.toran === undefined ? 'mango' : o.toran) ? (o.on ?? 1) : 0 });
    D.open(o.open ?? 0);
    const dk = o.diyas ?? (n ? 1 : 0); diyas.forEach((d, i) => d.set(t, Array.isArray(dk) ? dk[i] : dk));
    const ik = o.inner ?? 0; inner.intensity = 3.2 * ik; innerGlow.material.opacity = .25 * ik; innerLamps.forEach(l => l.set(t, ik));
    const fk = o.feet ?? 0; feet.forEach((f, i) => { f.material.opacity = clamp(fk - i) * (.95 + .05 * Math.sin(t * 6 + i)); f.halo.material.opacity = clamp(fk - i) * (.35 + .5 * Math.exp(-(fk - i) * 2)); f.scale.setScalar(1 + .25 * Math.exp(-(fk - i) * 4) * (fk > i ? 1 : 0)); });
  };
  return { S, set, TOR, D, K, diyas, feet, dw, dh, sun, toranY: dh + .32 };
})();

// ======================================================================================================
// SANCHI: the north gateway (about 8.5 m tall) and the stupa behind
function elephant3(parent, pos, yaw, m) {
  const g = new THREE.Group(); g.position.set(...pos); g.rotation.y = yaw; parent.add(g);
  mesh3(g, new THREE.SphereGeometry(.2, 16, 12), m, [0, .2, 0], { scale: [1, .95, 1.35] });
  mesh3(g, new THREE.SphereGeometry(.14, 14, 10), m, [0, .3, .26]);
  for (const s of [-1, 1]) mesh3(g, new THREE.SphereGeometry(.09, 10, 8), m, [s * .13, .32, .22], { scale: [.4, 1, 1] });
  tubeP3(g, [[0, .26, .36], [0, .12, .42], [0, .0, .4]], [.05, .025], m, { segs: 10, radial: 8 });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) mesh3(g, new THREE.CylinderGeometry(.06, .06, .14, 10), m, [sx * .1, .05, sz * .14]);
  return g;
}
const SANCHI = (() => {
  const S = new THREE.Scene(); S.fog = new THREE.Fog('#E8C9A0', 30, 110);
  const hemi = new THREE.HemisphereLight('#BCD4F0', '#9A7450', 1.0); S.add(hemi);
  const sun = new THREE.DirectionalLight('#FFD9A8', 3.6); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 90 }); sun.shadow.bias = -.0005; sun.shadow.normalBias = .02; sun.shadow.radius = 2;
  S.add(sun, sun.target); sun.position.set(14, 16, 18); sun.target.position.set(0, 3, -4);
  sky3(S, [[1, '#3E78C0'], [.45, '#6EA2D8'], [.12, '#B8D2E6'], [0, '#F0DCC0'], [-1, '#B89A78']]);
  mesh3(S, new THREE.PlaneGeometry(200, 200), pbr3('sand', { rep: [40, 40], tint: '#D8B890' }), [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const st = sandstone3({ rows: 3, rep: [1, 2] }), stB = sandstone3({ rows: 1, cols: 2, seed: 14 }), fz = friezeMat3();
  const G = new THREE.Group(); S.add(G);
  // the pillars on their bases, the capitals with four elephants each
  for (const s of [-1, 1]) {
    const x = s * 1.55;
    block3(G, .8, .3, .8, stB, [x, 0, 0]);
    block3(G, .56, 4.1, .56, st, [x, .3, 0]);
    block3(G, .7, .1, .7, stB, [x, 4.4, 0]);
    block3(G, .66, .7, .66, stB, [x, 4.5, 0]);
    for (let k = 0; k < 4; k++) elephant3(G, [x + Math.sin(k * Math.PI / 2) * .32, 4.5, Math.cos(k * Math.PI / 2) * .32], k * Math.PI / 2, stB);
    // the dies between the architraves
    for (const y of [5.62, 6.62]) block3(G, .56, .5, .5, stB, [x, y, 0]);
    // a triratna on top of each pillar
    const tr = new THREE.Group(); tr.position.set(x, 7.8, 0); G.add(tr);
    mesh3(tr, new THREE.TorusGeometry(.26, .07, 10, 24, Math.PI), stB, [0, .3, 0], { rot: [0, 0, Math.PI] });
    block3(tr, .16, .55, .14, stB, [0, 0, 0]); mesh3(tr, new THREE.SphereGeometry(.12, 12, 10), stB, [0, .1, 0]);
  }
  // three architraves, gently arched, with scrolled ends and a carved frieze on their faces
  const beam = (y, len, h) => {
    const b = new THREE.Group(); b.position.set(0, y, 0); G.add(b);
    const geo = new THREE.BoxGeometry(len, h, .48, 24, 1, 1), p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i); p.setY(i, p.getY(i) + .12 * (1 - Math.pow(x / (len / 2), 2))); }
    geo.computeVertexNormals();
    mesh3(b, geo, fz, [0, h / 2, 0]);
    for (const s of [-1, 1]) {
      const sc = new THREE.Group(); sc.position.set(s * len / 2, h / 2, 0); b.add(sc);
      mesh3(sc, new THREE.TorusGeometry(h * .42, h * .2, 10, 24, Math.PI * 1.6), stB, [0, 0, 0], { rot: [0, s < 0 ? Math.PI : 0, -.6] });
      mesh3(sc, new THREE.CylinderGeometry(h * .28, h * .28, .5, 16), stB, [0, 0, 0], { rot: [Math.PI / 2, 0, 0] });
    }
    return b;
  };
  beam(5.12, 5.4, .5); beam(6.12, 5.6, .5); beam(7.12, 5.8, .5);
  // short balusters between the beams in the middle span
  for (const y of [5.75, 6.75]) for (let i = -3; i <= 3; i++) block3(G, .12, .38, .3, stB, [i * .34, y - .1, 0]);
  // the wheel of dharma at the top centre, and yakshi brackets under the lowest beam
  const wh = new THREE.Group(); wh.position.set(0, 8.35, 0); G.add(wh);
  mesh3(wh, new THREE.TorusGeometry(.5, .08, 10, 40), stB, [0, 0, 0]);
  for (let i = 0; i < 16; i++) mesh3(wh, new THREE.BoxGeometry(.04, .5, .06), stB, [0, 0, 0], { rot: [0, 0, i / 16 * Math.PI] });
  mesh3(wh, new THREE.CylinderGeometry(.12, .12, .14, 16), stB, [0, 0, 0], { rot: [Math.PI / 2, 0, 0] });
  block3(G, .5, .6, .3, stB, [0, 7.6, 0]);
  for (const s of [-1, 1]) { const y = new THREE.Group(); y.position.set(s * 1.95, 4.5, .2); y.rotation.z = s * .5; G.add(y);
    mesh3(y, new THREE.CylinderGeometry(.09, .12, .9, 10), stB, [0, -.3, 0]); mesh3(y, new THREE.SphereGeometry(.12, 12, 10), stB, [0, .2, 0]); }
  // the stupa: drum, dome, harmika, chhatra; the railing round it
  const SZ = -30, dome = sandstone3({ rows: 14, cols: 10, seed: 15, rep: [3, 1] });
  mesh3(S, new THREE.CylinderGeometry(11, 11.4, 1.6, 64), dome, [0, .8, SZ]);
  mesh3(S, new THREE.SphereGeometry(10.4, 64, 32, 0, TAU, 0, Math.PI / 2), dome, [0, 1.6, SZ], { scale: [1, .78, 1] });
  block3(S, 1.6, .9, 1.6, stB, [0, 1.6 + 8.1, SZ]);
  for (let i = 0; i < 3; i++) mesh3(S, new THREE.CylinderGeometry(.9 - i * .22, .9 - i * .22, .08, 24), stB, [0, 10.9 + i * .45, SZ]);
  mesh3(S, new THREE.CylinderGeometry(.08, .08, 1.5, 8), stB, [0, 11.2, SZ]);
  const rail = new THREE.InstancedMesh(new THREE.BoxGeometry(.28, 2.4, .28), stB, 120), dm = new THREE.Object3D();
  for (let i = 0; i < 120; i++) { const a = i / 120 * TAU; dm.position.set(Math.sin(a) * 14.5, 1.2, SZ + Math.cos(a) * 14.5); dm.rotation.y = a; dm.updateMatrix(); rail.setMatrixAt(i, dm.matrix); }
  rail.castShadow = rail.receiveShadow = true; S.add(rail);
  for (const y of [.7, 1.3, 1.9]) mesh3(S, new THREE.TorusGeometry(14.5, .1, 6, 160), stB, [0, y, SZ], { rot: [Math.PI / 2, 0, 0] });
  // trees far off
  const tR = lcg(5), tm = std3('#4A6A34', .9);
  for (let i = 0; i < 40; i++) { const a = -1.2 + tR() * 2.4, r = 34 + tR() * 30; mesh3(S, new THREE.SphereGeometry(2 + tR() * 2, 10, 8), tm, [Math.sin(a) * r * 1.4, 1.5 + tR(), -Math.cos(a) * r], { scale: [1, .8, 1] }); }
  return { S, G, sun, hemi };
})();

// ======================================================================================================
// CITY: a street of houses running north (-z) to a palace gate; the sea beyond
const CITY = (() => {
  const S = new THREE.Scene(); S.fog = new THREE.Fog('#C8A890', 25, 95);
  const hemi = new THREE.HemisphereLight('#B8CCE8', '#7A5A40', 1); S.add(hemi);
  const sun = new THREE.DirectionalLight('#FFE0B8', 3); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 120 }); sun.shadow.bias = -.0006; sun.shadow.normalBias = .03; sun.shadow.radius = 2;
  S.add(sun, sun.target); sun.target.position.set(0, 0, -16);
  const skies = { dusk: sky3(S, MOODS3.dusk.sky), day: sky3(S, MOODS3.day.sky), blue: sky3(S, [[1, '#0A1430'], [.4, '#1A2A50'], [.1, '#3A4A70'], [0, '#5A6080'], [-1, '#141420']]) };
  mesh3(S, new THREE.PlaneGeometry(14, 120), stone3({ col: '#9A8C7C', rows: 4, cols: 3, seed: 33, rep: [4, 34], mottle: 1.3 }), [0, 0, -30], { rot: [-Math.PI / 2, 0, 0], cast: false });
  mesh3(S, new THREE.PlaneGeometry(300, 300), pbr3('sand', { rep: [60, 60], tint: '#B8A080' }), [0, -.02, -30], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // the sea at the far end (Dwarka)
  const sea = mesh3(S, new THREE.PlaneGeometry(600, 300), new THREE.MeshStandardMaterial({ color: '#2A6A8A', roughness: .15, metalness: .3, map: waterTex3().rep(60, 30) }), [0, .05, -230], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false });
  const cols = ['#EDE2CE', '#E2C08A', '#E8C4B4', '#D8D4C4', '#E6B88A', '#F0E6D4'];
  const HOUSE_L = 5.2, N = 8, XS = 3.6, houses = [], gates = [];
  const woodD = pbr3('darkwood', { rep: [1, 2], tint: '#C89A6A', rough: .9 }), woodH = pbr3('darkwood', { rep: [.5, 1], tint: '#7A4A30', rough: .8 });
  const pot = new THREE.MeshStandardMaterial({ color: '#C8803E', metalness: .75, roughness: .28 });
  const swagM = ['#C8202E', '#F2A81E', '#1F7A3A', '#E8306A'].map(c => std3(c, .85, { side: THREE.DoubleSide }));
  for (const side of [-1, 1]) for (let i = 0; i < N; i++) {
    const z = 2 - i * HOUSE_L - HOUSE_L / 2, h = 6 + ((i * 7 + (side > 0 ? 3 : 0)) % 4) * .6, col = cols[(i * 2 + (side > 0 ? 1 : 0)) % cols.length];
    const H = new THREE.Group(); H.position.set(side * (XS + 3), 0, z); S.add(H);
    const wm = plaster3(col, [2, 1.4]);
    block3(H, 6, h, HOUSE_L - .06, wm, [0, 0, 0]);
    block3(H, 6.2, .25, HOUSE_L + .1, plaster3('#F4ECDC', [3, .2]), [0, h, 0]);                              // the parapet coping
    for (let k = -1; k <= 1; k++) block3(H, .3, .6, .3, wm, [-side * 2.9, h + .25, k * 1.8]);               // parapet posts
    block3(H, .12, .5, HOUSE_L - .2, plaster3('#9A3A22', [2, .2]), [-side * 3.02, 0, 0]);                  // the geru dado
    // windows upstairs
    for (const dz of [-1.4, 1.4]) { block3(H, .1, 1.0, .7, woodH, [-side * 3.03, 3.6, dz]); block3(H, .14, .1, .9, wm, [-side * 3.05, 4.6, dz]); }
    // the gate: a frame, a dark double door
    const gate = new THREE.Group(); gate.position.set(side * XS, 0, z); gate.rotation.y = -side * Math.PI / 2; S.add(gate);
    block3(gate, 1.5, 2.5, .1, woodD, [0, 0, -.02]);
    for (const s of [-1, 1]) block3(gate, .18, 2.6, .22, woodH, [s * .84, 0, 0]);
    block3(gate, 2.0, .26, .24, woodH, [0, 2.6, 0]);
    block3(gate, .02, 2.3, .11, woodH, [0, .1, .01]);
    // the decorations: a mango toran, a cloth swag, two pots with lamps (shown with on())
    const tor = toran3(gate, { kind: 'mango', w: 1.95, y: 3.0, z: .18, sag: .05, n: 30, len: .34, seed: i * 2 + side, cast: false });
    const swagPts = []; for (let k = 0; k <= 12; k++) { const x = -1.0 + 2.0 * k / 12; swagPts.push([x, 2.86 - .3 * Math.sin(Math.PI * k / 12), .2]); }
    const swag = tubeP3(gate, swagPts, .045, swagM[(i + (side > 0 ? 2 : 0)) % 4], { segs: 24, radial: 8, cast: false });
    // a string of pearls under the swag
    const pearls = new THREE.Group(); gate.add(pearls); const pm = std3('#F4F0E8', .2, { metalness: .1 });
    for (let k = 0; k <= 30; k++) { const x = -.95 + 1.9 * k / 30; mesh3(pearls, new THREE.SphereGeometry(.018, 8, 6), pm, [x, 2.78 - .38 * Math.sin(Math.PI * k / 30), .22], { cast: false }); }
    const pots = [], lamps = [];
    for (const s of [-1, 1]) {
      const P = new THREE.Group(); P.position.set(s * 1.25, 0, .35); gate.add(P);
      mesh3(P, lathe3(smooth3([[0, 0], [.13, 0], [.24, .14], [.26, .3], [.2, .44], [.12, .5], [.11, .54], [.15, .57], [0, .57]], 4), 32), pot, [0, 0, 0]);
      for (let k = 0; k < 5; k++) { const a = k / 5 * TAU, lf = new THREE.Group(); lf.position.set(Math.cos(a) * .09, .57, Math.sin(a) * .09); lf.rotation.y = -a + Math.PI / 2; P.add(lf); const m = mesh3(lf, LEAF3.geo, LEAF3.mats[k % 2], [0, 0, 0], { cast: false }); m.rotation.x = -2.25; }
      mesh3(P, new THREE.CylinderGeometry(.13, .13, .02, 20), std3('#C8B07A', .6), [0, .58, 0]);
      pots.push(P);
      lamps.push(diya3(P, [0, .6, 0], { k: .7, light: s > 0 && i % 2 === 0, power: 3, range: 6 }));
    }
    gates.push({ side, i, z, tor, swag, pearls, pots, lamps, gate });
    houses.push(H);
  }
  // festive arches across the road (Dwarka): two posts, a beam, mango leaves and pennants
  const arches = [];
  for (let i = 0; i < 4; i++) {
    const z = -2 - i * 9, A = new THREE.Group(); A.position.set(0, 0, z); S.add(A);
    for (const s of [-1, 1]) { block3(A, .26, 6.2, .26, woodH, [s * 3.1, 0, 0]); mesh3(A, new THREE.SphereGeometry(.2, 12, 10), pot, [s * 3.1, 6.45, 0]); }
    const ap = []; for (let k = 0; k <= 16; k++) { const x = -3.1 + 6.2 * k / 16; ap.push([x, 5.6 + .7 * Math.sin(Math.PI * k / 16), 0]); }
    tubeP3(A, ap, .1, swagM[i % 4], { segs: 32, radial: 8 });
    const tor = toran3(A, { kind: 'mango', w: 5.4, y: 5.55, z: .12, sag: .25, n: 70, len: .26, seed: 50 + i, cast: false });
    const flags = []; const fm = ['#C8202E', '#F2A81E', '#1F7A3A', '#F4F0E8', '#E8306A'].map(c => std3(c, .85, { side: THREE.DoubleSide }));
    for (let k = 0; k < 14; k++) { const x = -2.9 + 5.8 * (k + .5) / 14, y = 6.15 + .55 * Math.sin(Math.PI * (k + .5) / 14), f = new THREE.Group(); f.position.set(x, y, 0); A.add(f);
      const tri = new THREE.Shape([new THREE.Vector2(-.15, 0), new THREE.Vector2(.15, 0), new THREE.Vector2(0, -.42)]); mesh3(f, new THREE.ShapeGeometry(tri), fm[k % 5], [0, 0, 0], { cast: false }); flags.push(f); }
    const fp = []; for (let k = 0; k <= 16; k++) { const x = -3.1 + 6.2 * k / 16; fp.push([x, 6.15 + .55 * Math.sin(Math.PI * k / 16) + .01, 0]); }
    tubeP3(A, fp, .01, std3('#E8D8B0', .7), { segs: 32, radial: 5, cast: false });
    arches.push({ A, tor, flags });
  }
  // the palace gate at the end of the street
  const PG = new THREE.Group(); PG.position.set(0, 0, -44); S.add(PG);
  const pgM = plaster3('#E8D8BC', [3, 2]);
  for (const s of [-1, 1]) { block3(PG, 3.2, 9, 3, pgM, [s * 3.4, 0, 0]); block3(PG, 2.6, 2.6, 2.6, pgM, [s * 3.4, 9, 0]); mesh3(PG, new THREE.SphereGeometry(1.3, 20, 12, 0, TAU, 0, Math.PI / 2), pgM, [s * 3.4, 11.6, 0]); }
  block3(PG, 3.6, 3, 3, pgM, [0, 6, 0]);
  block3(PG, 3.6, 6, .2, woodD, [0, 0, .2]);
  block3(PG, 10.2, .3, 3.2, plaster3('#F4ECDC', [3, .2]), [0, 9, 0]);
  const pgTor = toran3(PG, { kind: 'mango', w: 3.4, y: 6.0, z: 1.6, sag: .1, n: 60, len: .3, seed: 90, cast: false });
  const pgLamps = [-1, 1].map(s => diya3(PG, [s * 1.6, 0, 1.9], { k: 1.6, light: true, power: 6, range: 9 }));
  // set(t, o): o.mood 'dusk' | 'day' | 'blue'; o.deco(gate) → { tor, swag, pots, lamps } each 0..1; o.arches 0..1; o.wind
  const set = (t, o = {}) => {
    const m = o.mood || 'dusk';
    for (const k in skies) skies[k].visible = k === m;
    if (m === 'day') { hemi.color.set('#C4DAF0'); hemi.groundColor.set('#8A7658'); hemi.intensity = 1.1; sun.color.set('#FFF0D8'); sun.intensity = 3.2; sun.position.set(18, 26, 6); S.fog.color.set('#CFE0EC'); S.fog.near = 40; S.fog.far = 160; }
    else if (m === 'blue') { hemi.color.set('#6A7CB0'); hemi.groundColor.set('#2A2430'); hemi.intensity = 1.4; sun.color.set('#9AB0E0'); sun.intensity = .9; sun.position.set(14, 30, -20); S.fog.color.set('#3A4060'); S.fog.near = 15; S.fog.far = 70; }
    else { hemi.color.set('#8A90C0'); hemi.groundColor.set('#5A4030'); hemi.intensity = 1.15; sun.color.set('#FFA070'); sun.intensity = 1.2; sun.position.set(-30, 7, -10); S.fog.color.set('#6A4A60'); S.fog.near = 20; S.fog.far = 85; }
    sea.material.map.offset.set(t * .01, t * .004);
    for (const g of gates) {
      const d = o.deco ? o.deco(g) : { tor: 0, swag: 0, pots: 0, lamps: 0 };
      g.tor.set(t, { wind: o.wind ?? .5, on: d.tor }); g.swag.visible = d.swag > .5; g.pearls.visible = d.swag > .5;
      g.pots.forEach(p => { const k = easeOut(clamp(d.pots)); p.visible = k > .01; p.scale.setScalar(Math.max(.01, k)); });
      g.lamps.forEach(l => l.set(t, d.lamps));
    }
    const pd = o.palace ?? 0; pgTor.set(t, { wind: .4, on: pd }); pgLamps.forEach(l => l.set(t, o.palaceLamps ?? pd));
    const ak = o.arches ?? 0;
    arches.forEach((a, i) => { const k = clamp(ak * 1.5 - i * .15); a.A.visible = k > .01; a.A.scale.set(1, easeOut(k), 1); a.tor.set(t, { wind: .7, on: k });
      a.flags.forEach((f, j) => { f.rotation.x = .35 * Math.sin(t * 3.1 + j * .9 + i) + .2; f.rotation.y = .2 * Math.sin(t * 2.3 + j); }); });
  };
  return { S, set, gates, arches, PG, XS, HOUSE_L, sun };
})();
