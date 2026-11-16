// chhath_sets.js: the sets of the Chhath reel (ad 97), in the 3D style.
//   SET: a river ghat. The camera stands on the steps (+z) and looks across the water to the sun (-z). The sky and the
//        water are shaders that share one sky function (a gradient, the sun's disc and halo, streaks of cloud, stars), so
//        the water mirrors the sky it sits under; figures, lamps and sugarcane are mirrored by a planar reflection pass
//        (SET.refl(), before render3). Moods (dusk, night, predawn, dawn) are palettes that blend, and the sun's
//        elevation is a number, so one shot can run the sun down and up again.
//        In the water: the vratis (women in saris, waist-deep, a soop of fruit and thekua held out to the sun), the
//        hero in the middle. On the steps: rows of diyas, baskets, a kosi (sugarcane tied over lamps).
//   AANGAN: a mud courtyard for the two days at home: day 1's meal on a banana leaf (rice, chana dal, lauki), day 2's
//        clay stove at night with the pot of jaggery kheer, rotis, and a fire that can die down to embers.
// Units are metres, y up, the water at y = 0.
const C3 = (h) => new THREE.Color(h);
const SARIS = [['#E8A818', '#A81C1C'], ['#C4261C', '#E8B020'], ['#E8641C', '#7A1C5A'], ['#D43A6A', '#E8C040'], ['#2A8A5A', '#E8B020'], ['#EFCB38', '#1C7A4A'], ['#B8281C', '#EFCB38'], ['#E88A1C', '#A81C1C']];

// ---------- textures ----------
const weaveTex3 = (bump) => tex3('weave' + (bump ? 'B' : 'C'), 256, 256, (g, w, h) => {
  g.fillStyle = bump ? '#606060' : '#C9A25A'; g.fillRect(0, 0, w, h); const s = 16, r = lcg(31);
  for (let y = 0; y < h; y += s) for (let x = 0; x < w; x += s) {
    const over = ((x + y) / s) % 2 === 0, k = .85 + r() * .3;
    if (bump) { const gr = over ? g.createLinearGradient(x, 0, x + s, 0) : g.createLinearGradient(0, y, 0, y + s); gr.addColorStop(0, '#303030'); gr.addColorStop(.5, '#E0E0E0'); gr.addColorStop(1, '#303030'); g.fillStyle = gr; }
    else g.fillStyle = over ? `rgb(${210 * k | 0},${172 * k | 0},${98 * k | 0})` : `rgb(${182 * k | 0},${142 * k | 0},${74 * k | 0})`;
    g.fillRect(x + .5, y + .5, s - 1, s - 1);
  }
}, bump ? { data: true } : {});
const mottleTex3 = (key, col, a, b, n = 140, seed = 7) => tex3('mot' + key, 512, 512, (g, w, h) => {
  g.fillStyle = col; g.fillRect(0, 0, w, h); const r = lcg(seed);
  for (let i = 0; i < n; i++) { const x = r() * w, y = r() * h, rr = 14 + r() * 80, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, r() < .5 ? a : b); gr.addColorStop(1, 'rgba(0,0,0,0)');
    for (const [dx, dy] of [[0, 0], [w, 0], [-w, 0], [0, h], [0, -h]]) { g.save(); g.translate(dx, dy); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); g.restore(); } }
});
const speckTex3 = (key, n = 5000, seed = 3) => tex3('speck' + key, 256, 256, (g, w, h) => { g.fillStyle = '#808080'; g.fillRect(0, 0, w, h); const r = lcg(seed); for (let i = 0; i < n; i++) { g.fillStyle = r() < .5 ? `rgba(0,0,0,${.2 + r() * .5})` : `rgba(255,255,255,${.2 + r() * .5})`; g.beginPath(); g.ellipse(r() * w, r() * h, 1 + r() * 2.4, .8 + r() * 1.2, r() * 3, 0, 7); g.fill(); } }, { data: true });
// thekua: a pressed sweet with a leaf pattern
const thekuaTex3 = (bump) => tex3('thekua' + (bump ? 'B' : 'C'), 128, 128, (g, w, h) => {
  g.fillStyle = bump ? '#909090' : '#A8642C'; g.fillRect(0, 0, w, h);
  if (!bump) { const gr = g.createRadialGradient(64, 64, 10, 64, 64, 64); gr.addColorStop(0, 'rgba(214,150,80,.55)'); gr.addColorStop(1, 'rgba(90,44,14,.5)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
  g.strokeStyle = bump ? '#202020' : 'rgba(84,40,12,.75)'; g.lineWidth = 4; g.lineCap = 'round';
  g.beginPath(); g.moveTo(64, 18); g.lineTo(64, 110); g.stroke();
  for (let i = 0; i < 6; i++) { const y = 30 + i * 13; g.beginPath(); g.moveTo(64, y + 8); g.lineTo(34 + i * 2, y - 6); g.moveTo(64, y + 8); g.lineTo(94 - i * 2, y - 6); g.stroke(); }
}, bump ? { data: true } : {});
const leafTex3 = () => tex3('kelaLeaf', 512, 256, (g, w, h) => {
  g.fillStyle = '#3F7A2C'; g.fillRect(0, 0, w, h); const r = lcg(12);
  for (let i = 0; i < 150; i++) { const x = i / 150 * w + r() * 3; g.strokeStyle = r() < .5 ? 'rgba(24,60,18,.35)' : 'rgba(150,200,90,.22)'; g.lineWidth = 1 + r() * 1.6; g.beginPath(); g.moveTo(x, h / 2); g.lineTo(x + 26, 0); g.moveTo(x, h / 2); g.lineTo(x + 26, h); g.stroke(); }
  g.strokeStyle = '#A8C870'; g.lineWidth = 7; g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
});
const rotiTex3 = () => tex3('roti', 256, 256, (g, w, h) => {
  g.fillStyle = '#D9B47C'; g.fillRect(0, 0, w, h); const r = lcg(5);
  for (let i = 0; i < 46; i++) { const x = r() * w, y = r() * h, rr = 5 + r() * 16; const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, `rgba(96,52,20,${.35 + r() * .4})`); gr.addColorStop(1, 'rgba(96,52,20,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
});
const softTex3 = () => tex3('softPuff', 128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(.5, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
const puff3 = (parent, pos, size, col, a) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex3(), color: col, transparent: true, opacity: a, depthWrite: false, fog: false })); s.position.set(...pos); s.scale.setScalar(size); parent.add(s); return s; };

// ---------- props ----------
const MAT = {
  bamboo: () => MAT._b || (MAT._b = new THREE.MeshStandardMaterial({ map: weaveTex3().rep(5, 5), bumpMap: weaveTex3(true).rep(5, 5), bumpScale: 1.6, roughness: .8, side: THREE.DoubleSide, envMapIntensity: .4 })),
  clay: () => MAT._c || (MAT._c = new THREE.MeshStandardMaterial({ color: '#A85A30', roughness: .9, bumpMap: speckTex3('clay').rep(2, 2), bumpScale: .5, envMapIntensity: .3 })),
  brass: () => MAT._br || (MAT._br = new THREE.MeshStandardMaterial({ color: '#C89A44', metalness: .6, roughness: .48, envMapIntensity: .6 })),
  thekua: () => MAT._t || (MAT._t = new THREE.MeshStandardMaterial({ map: thekuaTex3(), bumpMap: thekuaTex3(true), bumpScale: 2.5, roughness: .85 })),
};
// a diya: a clay bowl, a flame (no light of its own unless o.light). Returns flame3's handle (+ .bowl)
const DIYA_GEO = lathe3([[0, 0], [.022, 0], [.04, .012], [.046, .024], [.04, .022], [.03, .012], [0, .01]], 20);
function diya3(parent, pos, k = 1, o = {}) {
  const bowl = mesh3(parent, DIYA_GEO, MAT.clay(), pos, { scale: k, cast: false });
  const f = flame3(parent, [pos[0], pos[1] + .02 * k, pos[2]], .55 * k * (o.fk ?? 1), { light: !!o.light, power: o.power ?? 1.2, range: o.range ?? 3, col: '#FFA040', seed: o.seed });
  f.bowl = bowl; return f;
}
// a soop: the bamboo winnowing tray (open front toward -z, the raised back toward +z), loaded with prasad
function soop3(parent, o = {}) {
  const G = new THREE.Group(); parent.add(G);
  const geo = new THREE.PlaneGeometry(1, 1, 24, 24), P = geo.attributes.position;
  for (let i = 0; i < P.count; i++) {
    const u = P.getX(i) * 2, v = P.getY(i) + .5;
    P.setXYZ(i, u * lerp(.2, .155, v), .075 * Math.pow(Math.abs(u), 5) * (.25 + .75 * v) + .085 * Math.pow(v, 7), lerp(-.17, .15, v));
  }
  geo.computeVertexNormals(); mesh3(G, geo, MAT.bamboo(), [0, 0, 0]);
  if (o.empty) return G;
  const R = lcg(o.seed ?? 4);
  // bananas: a hand of five
  const ban = new THREE.MeshStandardMaterial({ color: '#E6C236', roughness: .6 });
  for (let i = 0; i < 5; i++) { const a = (i - 2) * .2; tubeP3(G, [[.085, .03, .1], [.07 + a * .12, .06, .04], [.05 + a * .3, .055, -.04], [.035 + a * .42, .03, -.095]], [.017, .011], ban, { segs: 14, radial: 8 }); }
  mesh3(G, new THREE.SphereGeometry(.014, 8, 6), std3('#5A4A20', .8), [.085, .03, .105]);
  // a coconut with its tuft
  mesh3(G, new THREE.SphereGeometry(.055, 20, 14), new THREE.MeshStandardMaterial({ color: '#7A5634', roughness: .95, bumpMap: speckTex3('coco', 9000, 8).rep(2, 2), bumpScale: 1.5 }), [-.085, .056, .07], { scale: [1, 1.08, 1] });
  mesh3(G, new THREE.ConeGeometry(.02, .05, 8), std3('#C8B080', .95), [-.085, .13, .07]);
  // thekua, overlapping
  const tg = new THREE.CylinderGeometry(.034, .034, .011, 22);
  for (const [x, z, rx, ry] of [[-.02, -.07, .12, .3], [.035, -.09, .2, 1.2], [-.07, -.045, .3, 2.2], [.0, -.02, .5, .8], [-.045, -.1, .1, 3.3]]) mesh3(G, tg, MAT.thekua(), [x, .022 + rx * .03, z], { rot: [rx * .6, ry, rx * .3] });
  // an apple, an orange, a sweet lime
  mesh3(G, new THREE.SphereGeometry(.03, 16, 12), std3('#B8201C', .45), [.0, .04, .075], { scale: [1, .92, 1] });
  mesh3(G, new THREE.SphereGeometry(.029, 16, 12), new THREE.MeshStandardMaterial({ color: '#EE8420', roughness: .7, bumpMap: speckTex3('orange', 7000, 4).rep(2, 2), bumpScale: .5 }), [.095, .038, -.01]);
  mesh3(G, new THREE.SphereGeometry(.026, 16, 12), std3('#9AB83A', .6), [-.11, .036, -.005]);
  // a piece of sugarcane
  mesh3(G, new THREE.CylinderGeometry(.011, .011, .2, 10), std3('#7C8A3A', .6), [.02, .028, .125], { rot: [0, 0, Math.PI / 2 + .08] });
  // marigolds
  const mg = new THREE.IcosahedronGeometry(.016, 1);
  for (let i = 0; i < 7; i++) mesh3(G, mg, std3(i % 2 ? '#F0A010' : '#E8641C', .9), [(R() - .5) * .26, .02 + R() * .012, -.13 + R() * .06], { scale: [1, .7, 1], cast: false });
  // the lamp
  if (o.diya !== false) G.diya = diya3(G, [.045, .012, -.035], .8, { light: !!o.light, power: .12, range: .8, seed: o.seed });
  return G;
}
// a round basket (daura) heaped with fruit
function daura3(parent, pos, k = 1, seed = 2) {
  const G = new THREE.Group(); G.position.set(...pos); G.scale.setScalar(k); parent.add(G);
  mesh3(G, lathe3([[0, 0], [.13, 0], [.2, .09], [.22, .15], [.2, .15], [.12, .03], [0, .03]], 28), MAT.bamboo(), [0, 0, 0]);
  const R = lcg(seed), cols = ['#E6C236', '#B8201C', '#EE8420', '#9AB83A', '#7A5634', '#E6C236'];
  for (let i = 0; i < 11; i++) { const a = R() * TAU, r = R() * .12; mesh3(G, new THREE.SphereGeometry(.035 + R() * .018, 12, 10), std3(cols[i % cols.length], .65), [Math.cos(a) * r, .1 + R() * .07 * (1 - r / .13), Math.sin(a) * r]); }
  for (let i = 0; i < 4; i++) mesh3(G, new THREE.CylinderGeometry(.034, .034, .011, 18), MAT.thekua(), [(R() - .5) * .2, .17 + R() * .02, (R() - .5) * .2], { rot: [R() * .6, R() * 3, R() * .6] });
  return G;
}
// a sugarcane stalk with its leaves, standing at pos, leaning by rot
function cane3(parent, pos, h = 2.5, rot = [0, 0, 0], seed = 1) {
  const G = new THREE.Group(); G.position.set(...pos); G.rotation.set(...rot); parent.add(G);
  const R = lcg(seed), stem = std3('#8E9A3C', .55), node = std3('#5C5A24', .7), leaf = new THREE.MeshStandardMaterial({ color: '#5E8A30', roughness: .7, side: THREE.DoubleSide });
  mesh3(G, new THREE.CylinderGeometry(.016, .02, h, 8), stem, [0, h / 2, 0]);
  for (let y = .12; y < h; y += .15) mesh3(G, new THREE.CylinderGeometry(.021, .021, .012, 8), node, [0, y, 0], { cast: false });
  for (let i = 0; i < 7; i++) {
    const a = R() * TAU, l = .5 + R() * .35, up = .35 + R() * .3, y0 = h - .25 + R() * .25;
    const m = tubeP3(G, [[0, y0, 0], [Math.cos(a) * l * .3, y0 + up * .5, Math.sin(a) * l * .3], [Math.cos(a) * l * .7, y0 + up * .55, Math.sin(a) * l * .7], [Math.cos(a) * l, y0 + up * .15, Math.sin(a) * l]], [.022, .003], leaf, { segs: 14, radial: 5 });
    m.scale.y = 1; m.geometry.scale(1, 1, 1);
  }
  return G;
}

// ---------- a vrati: a woman in a sari, her pallu over her head, holding the soop out to the sun ----------
// Faces -z. Her origin is at the waist (the water line); the sari goes on down 1 m, so she can also stand on a step.
// .raise(k): 0 the soop held at the chest, 1 lifted to the brow.
function vrati3(parent, o = {}) {
  const G = new THREE.Group(); parent.add(G);
  const [sc, bc] = o.sari || SARIS[0], skinC = o.skin || '#9A6A48';
  const sari = new THREE.MeshStandardMaterial({ color: sc, roughness: .82, envMapIntensity: .35 }), border = new THREE.MeshStandardMaterial({ color: bc, roughness: .7, envMapIntensity: .4 }), skin = std3(skinC, .7, { envMapIntensity: .3 });
  mesh3(G, lathe3([[.001, -1], [.15, -1], [.175, -.6], [.168, -.2], [.152, 0]], 28), sari, [0, 0, 0], { scale: [1, 1, .78] });
  mesh3(G, lathe3(smooth3([[.152, 0], [.156, .1], [.144, .22], [.168, .34], [.172, .42], [.12, .47], [.052, .5], [.046, .56]], 4), 32), sari, [0, 0, 0], { scale: [1, 1, .64] });
  mesh3(G, new THREE.CylinderGeometry(.157, .157, .03, 28), border, [0, .02, 0], { scale: [1, 1, .66] });
  // head, face
  const HY = .655;
  mesh3(G, new THREE.SphereGeometry(1, 28, 20), skin, [0, HY, 0], { scale: [.082, .102, .092] });
  mesh3(G, new THREE.SphereGeometry(1, 12, 10), skin, [0, HY - .012, -.092], { scale: [.011, .028, .013], cast: false });
  const dark = std3('#2A1810', .7);
  for (const s of [-1, 1]) { const e = [], b = []; for (let i = 0; i <= 8; i++) { const q = i / 8 * 2 - 1, a = s * (.42 + q * .17); e.push([.084 * Math.sin(a), HY + .012 - .006 * (1 - q * q), -.094 * Math.cos(a)]); b.push([.086 * Math.sin(a), HY + .04 + .008 * (1 - q * q), -.095 * Math.cos(a)]); } tubeP3(G, e, .0035, dark, { segs: 12, radial: 5, cast: false }); tubeP3(G, b, [.0045, .003], dark, { segs: 12, radial: 5, cast: false }); }
  { const m = []; for (let i = 0; i <= 6; i++) { const q = i / 6 * 2 - 1; m.push([q * .022, HY - .056 - .004 * (1 - q * q), -.083 - .004 * (1 - q * q)]); } tubeP3(G, m, .0036, std3('#8A2C24', .6), { segs: 10, radial: 5, cast: false }); }
  // the long sindoor of Chhath: from the nose up to the parting
  tubeP3(G, [[0, HY + .0, -.1015], [0, HY + .035, -.096], [0, HY + .07, -.076], [0, HY + .094, -.04]], [.0052, .007], std3('#F0641C', .7, { emissive: '#F0641C', emissiveIntensity: .12 }), { segs: 14, radial: 6, cast: false });
  // the blouse and the neck
  mesh3(G, lathe3(smooth3([[.171, .33], [.178, .42], [.124, .472], [.054, .502]], 4), 32), border, [0, 0, 0], { scale: [1, 1, .65] });
  mesh3(G, new THREE.CylinderGeometry(.04, .046, .1, 14), skin, [0, .545, 0]);
  for (const s of [-1, 1]) mesh3(G, new THREE.SphereGeometry(.058, 16, 12), border, [s * .168, .435, 0]);
  // the pallu: over the head and down round the shoulders (open in front), its border along the edges
  const sariD = sari.clone(); sariD.side = THREE.DoubleSide;
  mesh3(G, new THREE.SphereGeometry(1, 28, 20), sari, [0, HY + .012, .022], { scale: [.098, .112, .1] });
  const VP = smooth3([[.07, HY + .09], [.098, HY + .0], [.09, .575], [.098, .525], [.2, .445], [.226, .37], [.222, .3]], 4), PH0 = -2.05, PHL = 4.1, VZ = .82;
  mesh3(G, new THREE.LatheGeometry(VP.map(([r, y]) => new THREE.Vector2(r, y)), 40, PH0, PHL), sariD, [0, 0, .012], { scale: [1, 1, VZ] });
  { const [r, y] = VP[VP.length - 1], p = []; for (let i = 0; i <= 30; i++) { const a = PH0 + PHL * i / 30; p.push([r * Math.sin(a), y + .012 * Math.sin(i * 1.1), .012 + r * Math.cos(a) * VZ]); } tubeP3(G, p, .012, border, { segs: 60, radial: 6 }); }
  for (const s of [-1, 1]) { const a = s > 0 ? PH0 + PHL : PH0, p = VP.filter((_, i) => i % 3 === 0 || i === VP.length - 1).map(([r, y]) => [r * Math.sin(a), y, .012 + r * Math.cos(a) * VZ]); tubeP3(G, p, .0095, border, { segs: 30, radial: 6, cast: false }); }
  // pleats down the back
  for (const x of [-.07, 0, .07]) tubeP3(G, [[x * .8, .24, .1], [x, .12, .102], [x * 1.05, .0, .1]], .006, border, { segs: 8, radial: 5, cast: false });
  // the arms and the soop, pivoting at the shoulders
  const A = new THREE.Group(); A.position.set(0, .435, 0); G.add(A);
  for (const s of [-1, 1]) {
    tubeP3(A, [[s * .185, 0, 0], [s * .205, -.085, -.15], [s * .175, -.04, -.3]], [.04, .028], skin, { segs: 16, radial: 10 });
    mesh3(A, new THREE.SphereGeometry(.03, 12, 10), skin, [s * .172, -.035, -.315], { scale: [.8, .7, 1.2] });
    for (let i = 0; i < 4; i++) mesh3(A, new THREE.TorusGeometry(.031, .005, 6, 16), i % 2 ? MAT.brass() : std3('#B01C1C', .5), [s * .182, -.05, -.265 + i * .012], { rot: [0, 0, 0], cast: false });
  }
  const soop = soop3(A, { seed: o.seed ?? 3, light: o.light, diya: o.diya }); soop.position.set(0, -.06, -.36); soop.rotation.x = -.1;
  G.raise = (k) => { A.rotation.x = lerp(-.05, .62, k); soop.rotation.x = lerp(-.1, -.58, k); };
  G.raise(0); G.soop = soop; G.arms = A;
  return G;
}

// ======================================================================================================
// the ghat
// ======================================================================================================
const SKY_GLSL = `
  uniform vec3 uZen, uMid, uHor, uSunCol, uSunDir, uDisc, uCloud; uniform float uSunR, uStars, uTime, uHaloK;
  float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
  float fbm(vec2 p) { float s = 0., a = .5; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + 17.; a *= .5; } return s; }
  vec3 skyCol(vec3 d, float disc) {
    float e = d.y;
    vec3 c = mix(uHor, uMid, smoothstep(0., .17, e)); c = mix(c, uZen, smoothstep(.1, .62, e));
    c = mix(c, uHor * .5, smoothstep(0., -.1, e));
    float m = max(dot(d, uSunDir), 0.);
    float azk = pow(max(dot(normalize(d.xz + 1e-5), normalize(uSunDir.xz)), 0.), 6.);
    c += uSunCol * exp(-abs(e - max(uSunDir.y, 0.) * .6) * 9.) * azk * .5 * uHaloK;
    c += uSunCol * (pow(m, 30.) * .28 + pow(m, 260.) * .3) * uHaloK;
    float az = atan(d.x, -d.z);
    float cl = smoothstep(.5, .8, fbm(vec2(az * 3.4 + uTime * .003, e * 30.))) * smoothstep(.02, .07, e) * (1. - smoothstep(.2, .44, e));
    vec3 cc = mix(uCloud, uSunCol * 1.3, clamp(pow(m, 5.) * uHaloK, 0., 1.));
    c = mix(c, cc, cl * .7);
    if (uStars > 0.) { vec2 g = vec2(az * 110., e * 150.); float hh = h21(floor(g)); c += vec3(.85, .92, 1.) * step(.985, hh) * smoothstep(.3, .05, length(fract(g) - .5)) * smoothstep(.06, .3, e) * uStars * (.55 + .45 * sin(uTime * 2.4 + hh * 60.)) * (1. - cl); }
    float ang = acos(clamp(dot(d, uSunDir), -1., 1.));
    float dk = (1. - smoothstep(uSunR * .94, uSunR, ang)) * disc;
    c = mix(c, uDisc * (1. - .38 * smoothstep(0., uSunR, ang)) + c * .3, dk * (1. - cl * .45));
    return c;
  }`;

const SET = (() => {
  const S = new THREE.Scene();
  S.fog = new THREE.Fog('#E8845A', 40, 300);
  // ---------- palettes ----------
  const PAL = {
    dusk: { zen: '#27306E', mid: '#C4603C', hor: '#F08030', sun: '#FF6A14', disc: [3.3, 1.0, .08], deep: '#1C1626', cloud: '#4A2A4E', hemiS: '#C8A4B0', hemiG: '#5A3A28', hemiK: .55, key: '#FF9A58', keyK: 2.8, fillK: .9, envK: .3, stars: 0, halo: .85, fog: '#D87A50', exp: .8 },
    night: { zen: '#04071A', mid: '#0A1030', hor: '#1C2046', sun: '#30408A', disc: [0, 0, 0], deep: '#03050C', cloud: '#080A1A', hemiS: '#3A4C88', hemiG: '#181420', hemiK: .3, key: '#6A84C8', keyK: .2, fillK: .12, envK: .06, stars: 1, halo: .25, fog: '#0E1228', exp: 1 },
    predawn: { zen: '#0B1840', mid: '#34468A', hor: '#8E7C9E', sun: '#C87A6A', disc: [0, 0, 0], deep: '#0A1022', cloud: '#1C2248', hemiS: '#6A80C0', hemiG: '#242438', hemiK: .5, key: '#8AA0E0', keyK: .35, fillK: .4, envK: .14, stars: .5, halo: .5, fog: '#56608C', exp: 1 },
    dawn: { zen: '#3F62A8', mid: '#D98A6C', hor: '#F2AC62', sun: '#FF9E38', disc: [2.7, 1.3, .28], deep: '#1A2638', cloud: '#B87A78', hemiS: '#D8D0E0', hemiG: '#6A5038', hemiK: .65, key: '#FFC888', keyK: 3.0, fillK: 1.0, envK: .36, stars: 0, halo: .8, fog: '#E0A070', exp: 1 },
  };
  PAL.day = { zen: '#2A62B8', mid: '#86B6E0', hor: '#D4E2EC', sun: '#FFF0D0', disc: [6, 5.4, 4.2], deep: '#17364A', cloud: '#F4F6FA', hemiS: '#D8E6F8', hemiG: '#6A5A48', hemiK: .9, key: '#FFF2DC', keyK: 3.2, fillK: .8, envK: .5, stars: 0, halo: .5, fog: '#C8D8E4', exp: 1 };
  const NUMK = ['hemiK', 'keyK', 'fillK', 'envK', 'stars', 'halo', 'exp'], COLK = ['zen', 'mid', 'hor', 'sun', 'deep', 'cloud', 'hemiS', 'hemiG', 'key', 'fog'];
  for (const p of Object.values(PAL)) for (const k of COLK) p[k] = C3(p[k]);
  const CUR = { disc: [0, 0, 0] }; for (const k of COLK) CUR[k] = new THREE.Color();
  function blend(a, b, k) {
    const A = PAL[a], B = PAL[b || a]; k = b ? clamp(k) : 0;
    for (const c of COLK) CUR[c].copy(A[c]).lerp(B[c], k);
    for (const n of NUMK) CUR[n] = lerp(A[n], B[n], k);
    CUR.disc = A.disc.map((v, i) => lerp(v, B.disc[i], k));
    return CUR;
  }

  // ---------- light ----------
  const hemi = new THREE.HemisphereLight('#C8A4B0', '#5A3A28', .5); S.add(hemi);
  const key = new THREE.DirectionalLight('#FF9A58', 2.6); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 90 }); key.shadow.bias = -.0006; key.shadow.normalBias = .02; key.shadow.radius = 5;
  S.add(key, key.target);
  const fill = new THREE.DirectionalLight('#E8C0B0', .8); fill.position.set(3, 5, 12); S.add(fill, fill.target); fill.target.position.set(0, .5, -2);

  // ---------- the sky and the water ----------
  const U = { uZen: { value: new THREE.Color() }, uMid: { value: new THREE.Color() }, uHor: { value: new THREE.Color() }, uSunCol: { value: new THREE.Color() }, uSunDir: { value: V3(0, .1, -1) }, uDisc: { value: V3() }, uCloud: { value: new THREE.Color() },
    uSunR: { value: .04 }, uStars: { value: 0 }, uTime: { value: 0 }, uHaloK: { value: 1 } };
  const dome = new THREE.Mesh(new THREE.SphereGeometry(480, 48, 32), new THREE.ShaderMaterial({ uniforms: U, side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 vD; void main() { vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
    fragmentShader: `${SKY_GLSL} varying vec3 vD; void main() { gl_FragColor = vec4(skyCol(normalize(vD), 1.), 1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }` }));
  dome.renderOrder = -1; dome.frustumCulled = false; S.add(dome);
  const RT = new THREE.WebGLRenderTarget(W / 2, H / 2, { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
  const UW = { ...U, tRefl: { value: RT.texture }, uRes: { value: new THREE.Vector2(W, H) }, uDeep: { value: new THREE.Color() }, uFog: { value: new THREE.Color() }, uCalm: { value: 1 }, uReflK: { value: 1 } };
  const water = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), new THREE.ShaderMaterial({ uniforms: UW,
    vertexShader: 'varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `${SKY_GLSL} varying vec3 vW; uniform sampler2D tRefl; uniform vec2 uRes; uniform vec3 uDeep, uFog; uniform float uCalm, uReflK;
      void main() {
        vec3 V = normalize(vW - cameraPosition); float d = length(vW - cameraPosition);
        vec2 p = vW.xz; float t = uTime;
        vec2 q1 = p * vec2(.9, 2.2) + vec2(t * .22, t * .35), q2 = p * vec2(2.7, 6.) + vec2(-t * .45, t * .6);
        float hx = fbm(q1 + vec2(.12, 0.)) - fbm(q1 - vec2(.12, 0.)) + .5 * (fbm(q2 + vec2(.12, 0.)) - fbm(q2 - vec2(.12, 0.)));
        float hz = fbm(q1 + vec2(0., .12)) - fbm(q1 - vec2(0., .12)) + .5 * (fbm(q2 + vec2(0., .12)) - fbm(q2 - vec2(0., .12)));
        float amp = uCalm * 1.5 / (1. + d * .01);
        vec3 n = normalize(vec3(hx * amp, 1., hz * amp));
        vec3 R = reflect(V, n); R.y = abs(R.y) + .002; R = normalize(R);
        vec3 sky = skyCol(R, 1.);
        float F = clamp(.03 + .97 * pow(1. - max(dot(-V, n), 0.), 4.), 0., 1.);
        vec2 suv = gl_FragCoord.xy / uRes;
        vec2 ruv = vec2(suv.x, 1. - suv.y) + vec2(hx, hz * 2.6) * .05 * uCalm / (1. + d * .04);
        vec4 ro = texture2D(tRefl, ruv);
        vec3 refl = sky * (1. - clamp(ro.a, 0., 1.) * uReflK) + ro.rgb * uReflK;
        vec3 col = mix(uDeep, refl, F * .88 + .12);
        col = mix(col, uFog, smoothstep(140., 440., d) * .8);
        gl_FragColor = vec4(col, 1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` }));
  water.rotation.x = -Math.PI / 2; water.position.set(0, 0, -300); S.add(water);
  // the far bank: a dark line of trees on the horizon
  const bankTex = tex3('chhathBank', 2048, 64, (g, w, h) => { g.clearRect(0, 0, w, h); const r = lcg(17); g.fillStyle = '#FFFFFF'; g.fillRect(0, 44, w, 20); for (let i = 0; i < 260; i++) { const x = r() * w, rr = 8 + r() * 22, y = 46 - r() * 6; for (const dx of [0, w, -w]) { g.beginPath(); g.ellipse(x + dx, y, rr, rr * (.5 + r() * .5), 0, 0, 7); g.fill(); } } });
  const bank = new THREE.Mesh(new THREE.PlaneGeometry(1400, 14), new THREE.MeshBasicMaterial({ map: bankTex.rep(3, 1), color: '#2A1C2A', transparent: true, alphaTest: .5, fog: false }));
  bank.position.set(0, 3.2, -430); S.add(bank);

  // ---------- the steps ----------
  const stoneM = stone3({ col: '#8E7C6C', rows: 2, cols: 10, seed: 4, rep: [8, 1], bumpK: 1.6, rough: .9 });
  const STEP_H = .17, STEP_D = .85, Z0 = .7, NSTEP = 9;
  for (let i = 0; i < NSTEP; i++) block3(S, 70, (i + 1) * STEP_H + 1.2, STEP_D + (i === NSTEP - 1 ? 30 : 0), stoneM, [0, -1.2, Z0 + i * STEP_D + (STEP_D + (i === NSTEP - 1 ? 30 : 0)) / 2]);
  const stepY = (i) => (i + 1) * STEP_H, stepZ = (i) => Z0 + i * STEP_D;

  // ---------- lamps ----------
  const LAMPS = [], rr = lcg(97);
  for (let i = 0; i < 6; i++) for (let x = -11; x <= 11; x += .55) {
    if (rr() < .34 + i * .08) continue;
    LAMPS.push(diya3(S, [x + (rr() - .5) * .25, stepY(i), stepZ(i) + .1 + rr() * .2], 1, { seed: LAMPS.length * 1.7 }));
  }
  // floating lamps
  const FLOAT = [];
  for (const [x, z] of [[-1.3, -.6], [1.5, -1.0], [.5, -.4], [-2.6, -1.6], [2.9, -2.4], [-.8, -4.2], [1.2, -5.5], [-3.6, -6.2], [3.8, -7.5], [.2, -9], [-2, -11.5], [4.6, -13], [-5.5, -15], [1.6, -18], [-1, -24], [6, -28]]) {
    const g = new THREE.Group(); g.position.set(x, 0, z); S.add(g);
    mesh3(g, new THREE.CylinderGeometry(.075, .05, .02, 12), std3('#4A6A2C', .8), [0, .008, 0], { cast: false });
    FLOAT.push({ g, d: diya3(g, [0, .016, 0], .9, { seed: x * 3 + z }), ph: x * 2.1 + z });
  }
  // warm light from the lamps on the steps (three pools, no shadows)
  const POOLS = [[-3.5, .9, 1.6], [3.5, .9, 1.6], [0, .7, .9]].map(p => { const l = new THREE.PointLight('#FF9A40', 0, 9, 1.4); l.position.set(...p); S.add(l); return l; });

  // ---------- the vratis ----------
  const HERO = vrati3(S, { sari: SARIS[0], seed: 3, light: true }); HERO.position.set(0, 0, -2.3);
  const CROWD = [], cr = lcg(53);
  const SPOTS = [[-1.9, -1.5, .12], [1.7, -1.9, -.1], [-3.4, -2.6, .16], [3.2, -1.3, -.14], [-5.0, -1.7, .2], [4.8, -2.7, -.2], [-6.8, -2.9, .24], [6.6, -1.8, -.24], [-8.6, -1.6, .3], [8.5, -2.9, -.3], [-10.6, -2.4, .34], [10.6, -1.5, -.34], [-2.6, -4.4, .1], [2.5, -4.9, -.1], [-12.8, -1.9, .4], [12.9, -2.6, -.4]];
  SPOTS.forEach(([x, z, yaw], i) => { const v = vrati3(S, { sari: SARIS[(i + 1) % SARIS.length], seed: 5 + i, skin: ['#9A6A48', '#8A5C3E', '#A87854'][i % 3] }); v.position.set(x, -.02 - cr() * .08, z); v.rotation.y = yaw; v.ph = cr() * 6; CROWD.push(v); });
  // ripples round each figure: soft bright rings on the water
  const ringTex = tex3('chhathRing', 128, 128, (g) => { g.clearRect(0, 0, 128, 128); for (const [r0, a] of [[30, .5], [46, .32], [60, .16]]) { g.strokeStyle = `rgba(255,255,255,${a})`; g.lineWidth = 3; g.beginPath(); g.arc(64, 64, r0, 0, 7); g.stroke(); } });
  const RINGS = [HERO, ...CROWD].map((v) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: ringTex, transparent: true, opacity: .35, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); m.rotation.x = -Math.PI / 2; m.position.set(v.position.x, .004, v.position.z); S.add(m); return m; });

  // ---------- on the steps: baskets, a kosi ----------
  const PROPS = new THREE.Group(); S.add(PROPS);
  daura3(PROPS, [-1.5, stepY(1), stepZ(1) + .45], 1, 2); daura3(PROPS, [2.2, stepY(2), stepZ(2) + .4], 1.1, 6); daura3(PROPS, [-4.2, stepY(0), stepZ(0) + .45], .95, 9); daura3(PROPS, [5.4, stepY(1), stepZ(1) + .4], 1, 11);
  { const sp = soop3(PROPS, { seed: 8, diya: false }); sp.position.set(.9, stepY(0) + .01, stepZ(0) + .42); sp.rotation.y = .5; }
  { const sp = soop3(PROPS, { seed: 12, diya: false }); sp.position.set(-2.9, stepY(2) + .01, stepZ(2) + .42); sp.rotation.y = -2.2; }
  const kosi = (x, z, y, seed) => { const g = new THREE.Group(); g.position.set(x, y, z); PROPS.add(g);
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + .3, r = .55; cane3(g, [Math.cos(a) * r, 0, Math.sin(a) * r], 2.5, [Math.sin(a) * -.21, 0, Math.cos(a) * .21], seed + i); }
    mesh3(g, new THREE.TorusGeometry(.07, .012, 6, 14), std3('#B01C1C', .7), [0, 2.28, 0], { rot: [Math.PI / 2, 0, 0] });
    mesh3(g, lathe3([[0, 0], [.09, 0], [.15, .08], [.14, .17], [.09, .2], [.1, .23], [0, .23]], 20), MAT.clay(), [0, 0, 0]);
    const ds = []; for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; ds.push(diya3(g, [Math.cos(a) * .3, 0, Math.sin(a) * .3], 1, { seed: seed + i })); } ds.push(diya3(g, [0, .23, 0], 1.1, { seed })); return ds; };
  const KOSI = [...kosi(-5.2, stepZ(3) + .45, stepY(3), 3), ...kosi(6.0, stepZ(4) + .45, stepY(4), 21)];
  // mist over the water before dawn
  const MIST = []; { const r = lcg(7); for (let i = 0; i < 16; i++) MIST.push(puff3(S, [(r() - .5) * 70, .8 + r() * 1.6, -8 - r() * 90], 16 + r() * 22, '#AEB8DC', 0)); }

  // ---------- the reflection pass ----------
  const rcam = new THREE.PerspectiveCamera(), clip = [new THREE.Plane(V3(0, 1, 0), -.01)], noRefl = [water, dome, bank, ...MIST, ...RINGS];
  function refl() {
    rcam.fov = CAM3.fov; rcam.aspect = CAM3.aspect; rcam.near = CAM3.near; rcam.far = CAM3.far; rcam.updateProjectionMatrix();
    const p = CAM3.position, f = V3(0, 0, -1).applyQuaternion(CAM3.quaternion);
    rcam.position.set(p.x, -p.y, p.z); rcam.up.set(0, 1, 0); rcam.lookAt(p.x + f.x, -p.y - f.y, p.z + f.z);
    const vis = noRefl.map(m => m.visible); noRefl.forEach(m => m.visible = false);
    const ca = GL3.getClearAlpha(), fogWas = S.fog; S.fog = null;
    GL3.clippingPlanes = clip; GL3.setRenderTarget(RT); GL3.setClearAlpha(0); GL3.clear(); GL3.render(S, rcam);
    GL3.clippingPlanes = []; GL3.setRenderTarget(null); GL3.setClearAlpha(ca); S.fog = fogWas;
    noRefl.forEach((m, i) => m.visible = vis[i]);
  }

  // ---------- one frame ----------
  // o: mood: [a, b, k] (palette names), sunEl (degrees above the horizon), sunAz (degrees right of -z), sunR (the
  //    disc's radius in degrees), raise (0..1, the crowd), hero (0..1, the hero's soop), lamps (0..1), mist (0..1),
  //    calm (the water's ripple, 1), fill, keyK, exposure, pools (lamp light on the steps), crowd (false hides them)
  function set(t, o = {}) {
    const [a, b, k] = o.mood || ['dusk'], P = blend(a, b, k);
    const el = (o.sunEl ?? 6) * Math.PI / 180, az = (o.sunAz ?? 0) * Math.PI / 180;
    const sd = V3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
    U.uSunDir.value.copy(sd); U.uSunR.value = (o.sunR ?? 2.3) * Math.PI / 180; U.uTime.value = t;
    U.uZen.value.copy(P.zen); U.uMid.value.copy(P.mid); U.uHor.value.copy(P.hor); U.uSunCol.value.copy(P.sun); U.uCloud.value.copy(P.cloud);
    U.uDisc.value.set(...P.disc); U.uStars.value = P.stars; U.uHaloK.value = P.halo * (o.halo ?? 1);
    UW.uDeep.value.copy(P.deep); UW.uFog.value.copy(P.hor).multiplyScalar(.8); UW.uCalm.value = o.calm ?? 1;
    S.fog.color.copy(P.fog);
    hemi.color.copy(P.hemiS); hemi.groundColor.copy(P.hemiG); hemi.intensity = P.hemiK * (o.hemi ?? 1);
    const up = Math.max(sd.y, .16), kd = V3(sd.x, up, sd.z).normalize();
    key.color.copy(P.key); key.intensity = P.keyK * (o.keyK ?? 1) * clamp((o.sunEl ?? 6) / 3 + .35);
    key.position.set(kd.x * 40, kd.y * 40, -2 + kd.z * 40); key.target.position.set(0, 0, -1);
    fill.intensity = P.fillK * (o.fill ?? 1); fill.color.copy(P.hemiS);
    env3(S, 'dawn', { k: P.envK * (o.envK ?? 1), bg: false, rot: 2.6 });
    bank.material.color.copy(P.deep).lerp(P.hor, .12);
    // the people
    const cr0 = o.raise ?? 0, show = o.crowd !== false;
    HERO.raise(o.hero ?? cr0); HERO.position.y = .004 * Math.sin(t * 1.1); HERO.visible = o.heroShow !== false;
    HERO.rotation.y = o.heroYaw ?? 0;
    CROWD.forEach((v, i) => { v.visible = show; v.raise(clamp(cr0 * 1.25 - .25 * hash(i + 3)) * (.85 + .15 * hash(i))); v.rotation.z = .006 * Math.sin(t * .9 + v.ph); });
    if (o.soops === false) for (const v of [HERO, ...CROWD]) { v.soop.visible = false; v.arms.rotation.x = -1.15; } else for (const v of [HERO, ...CROWD]) v.soop.visible = true;
    RINGS.forEach((m, i) => { m.visible = i ? show : HERO.visible; const s = 1.0 + .25 * ((t * .25 + i * .37) % 1); m.scale.setScalar(s); m.material.opacity = .22 * (1 - ((t * .25 + i * .37) % 1)) * (.4 + P.halo * .6); });
    // the lamps
    const lk = o.lamps ?? 1;
    LAMPS.forEach((l, i) => l.set(t, lk)); KOSI.forEach(l => l.set(t, lk));
    FLOAT.forEach(f => { f.g.position.y = .006 * Math.sin(t * 1.3 + f.ph); f.g.visible = (o.floats ?? 1) > 0; f.d.set(t, lk); });
    if (HERO.soop.diya) HERO.soop.diya.set(t, 1);
    CROWD.forEach(v => v.soop.diya && v.soop.diya.set(t, 1));
    POOLS.forEach((l, i) => l.intensity = (o.pools ?? 0) * (5 + .6 * Math.sin(t * 9 + i * 2)));
    MIST.forEach((m, i) => { m.material.opacity = (o.mist ?? 0) * (.1 + .05 * Math.sin(t * .3 + i)); m.material.color.copy(P.hor).lerp(C3('#C8D0F0'), .5); m.position.x += 0; });
    PROPS.visible = o.props !== false;
    return P.exp * (o.exposure ?? 1);
  }
  const sunAt = (el, az = 0, r = 400) => { const e = el * Math.PI / 180, a = az * Math.PI / 180; return [Math.sin(a) * Math.cos(e) * r, Math.sin(e) * r, -Math.cos(a) * Math.cos(e) * r]; };
  return { S, set, refl, HERO, CROWD, stepY, stepZ, sunAt, PAL };
})();

// ======================================================================================================
// the courtyard at home (days 1 and 2)
// ======================================================================================================
const AANGAN = (() => {
  const S = new THREE.Scene(); S.fog = new THREE.Fog('#2A2018', 6, 30);
  const hemi = new THREE.HemisphereLight('#FFE8C8', '#6A4A30', .8); S.add(hemi);
  const sun = new THREE.DirectionalLight('#FFE2B0', 3); sun.position.set(-2.2, 3.2, 1.6); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -1.6, right: 1.6, top: 1.6, bottom: -1.6, near: .5, far: 10 }); sun.shadow.bias = -.0004; sun.shadow.normalBias = .004; sun.shadow.radius = 5; S.add(sun, sun.target);
  const mud = new THREE.MeshStandardMaterial({ map: mottleTex3('mud', '#A07C56', 'rgba(70,46,26,.16)', 'rgba(232,204,160,.14)', 160, 3).rep(4, 4), bumpMap: speckTex3('mud', 9000, 6).rep(6, 6), bumpScale: .6, roughness: .96 });
  const floor = mesh3(S, new THREE.PlaneGeometry(30, 30), mud, [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // the back wall, with a band of rice-paste painting and a niche for a lamp
  const wallTex = tex3('chhathWall', 1024, 512, (g, w, h) => {
    g.fillStyle = '#B08A60'; g.fillRect(0, 0, w, h); const r = lcg(9);
    for (let i = 0; i < 80; i++) { const x = r() * w, y = r() * h, rr = 30 + r() * 90, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, r() < .5 ? 'rgba(80,52,30,.14)' : 'rgba(236,210,170,.12)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
    g.fillStyle = '#6E3A26'; g.fillRect(0, 330, w, 182);
    g.strokeStyle = 'rgba(250,244,230,.9)'; g.fillStyle = 'rgba(250,244,230,.9)'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(0, 300); g.lineTo(w, 300); g.moveTo(0, 322); g.lineTo(w, 322); g.stroke();
    for (let x = 16; x < w; x += 64) { g.beginPath(); g.moveTo(x, 292); g.lineTo(x + 32, 240); g.lineTo(x + 64, 292); g.stroke(); g.beginPath(); g.arc(x + 32, 222, 7, 0, 7); g.fill(); g.beginPath(); g.arc(x + 32, 274, 5, 0, 7); g.fill(); }
    // a sun in rice paste
    g.beginPath(); g.arc(512, 130, 46, 0, 7); g.stroke(); for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; g.beginPath(); g.moveTo(512 + Math.cos(a) * 58, 130 + Math.sin(a) * 58); g.lineTo(512 + Math.cos(a) * 82, 130 + Math.sin(a) * 82); g.stroke(); }
  });
  mesh3(S, new THREE.PlaneGeometry(9, 4.5), new THREE.MeshStandardMaterial({ map: wallTex, roughness: .95 }), [0, 2.25, -1.5], { cast: false });

  // ---------- day 1: one pure meal on a banana leaf ----------
  const D1 = new THREE.Group(); S.add(D1);
  mesh3(D1, new THREE.CircleGeometry(1, 48), new THREE.MeshStandardMaterial({ map: leafTex3(), roughness: .5, envMapIntensity: .5 }), [0, .004, 0], { rot: [-Math.PI / 2, 0, 0], scale: [.46, .27, 1], cast: false });
  const rice = mesh3(D1, new THREE.SphereGeometry(1, 40, 24), new THREE.MeshStandardMaterial({ color: '#F6F1E4', roughness: .85, bumpMap: speckTex3('rice', 14000, 2).rep(4, 4), bumpScale: 3 }), [-.07, .0, .05], { scale: [.12, .048, .095] });
  const katori = (x, z, col, r = .07) => { const g = new THREE.Group(); g.position.set(x, .004, z); D1.add(g);
    mesh3(g, lathe3([[0, 0], [r * .55, 0], [r * .9, r * .3], [r, r * .62], [r * .94, r * .62], [r * .82, r * .3], [0, r * .1]], 32), MAT.brass(), [0, 0, 0]);
    mesh3(g, new THREE.CircleGeometry(r * .9, 28), std3(col, .35), [0, r * .5, 0], { rot: [-Math.PI / 2, 0, 0], cast: false }); return g; };
  katori(.24, -.07, '#D8A428');
  // lauki: pale green pieces
  { const r = lcg(14), lm = std3('#C4D49A', .6), lm2 = std3('#9DB86E', .6); for (let i = 0; i < 26; i++) { const a = r() * TAU, d = r() * .075; mesh3(D1, new THREE.BoxGeometry(.03, .018, .026), i % 4 ? lm : lm2, [.2 + Math.cos(a) * d, .012 + (1 - d / .075) * .03 + r() * .006, .1 + Math.sin(a) * d * .8], { rot: [r(), r() * 3, r()] }); } }
  // a brass lota of water, a lamp
  mesh3(D1, lathe3(smooth3([[.001, 0], [.05, 0], [.075, .03], [.082, .075], [.07, .115], [.045, .135], [.043, .15], [.056, .165]], 4), 36), MAT.brass(), [-.3, 0, -.2]);
  const d1Lamp = diya3(D1, [.4, 0, .16], 1.1, { seed: 2 });

  // ---------- day 2: the clay stove, the pot of kheer, rotis ----------
  const D2 = new THREE.Group(); S.add(D2);
  const clayD = new THREE.MeshStandardMaterial({ color: '#8E5A38', roughness: .95, bumpMap: speckTex3('clay').rep(3, 3), bumpScale: .9 });
  const CH = new THREE.Group(); CH.position.set(-.12, 0, -.22); D2.add(CH);
  for (const s of [-1, 1]) mesh3(CH, new THREE.SphereGeometry(1, 20, 14), clayD, [s * .17, .07, 0], { scale: [.085, .2, .2] });
  mesh3(CH, new THREE.SphereGeometry(1, 20, 14), clayD, [0, .07, -.15], { scale: [.2, .2, .08] });
  mesh3(CH, new THREE.TorusGeometry(.15, .045, 10, 28), clayD, [0, .245, -.02], { rot: [Math.PI / 2, 0, 0], scale: [1, 1.1, .6] });
  // the handi and the kheer
  const pot = new THREE.Group(); pot.position.set(0, .26, -.02); CH.add(pot);
  mesh3(pot, lathe3(smooth3([[.001, 0], [.07, .004], [.15, .05], [.175, .12], [.15, .19], [.12, .215], [.128, .235], [.14, .24]], 4), 40), MAT.brass(), [0, 0, 0]);
  mesh3(pot, new THREE.CircleGeometry(.118, 32), std3('#E8D2A8', .5), [0, .213, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const STEAM = [0, 1, 2, 3].map(i => puff3(pot, [0, .3, 0], .2, '#F0E4D0', 0));
  // wood in the stove's mouth, the fire
  const wood = std3('#4A3020', .95);
  for (const [x, a] of [[-.05, .25], [.02, -.1], [.07, -.4]]) mesh3(CH, new THREE.CylinderGeometry(.018, .022, .5, 8), wood, [x, .035, .22], { rot: [Math.PI / 2 - .08, 0, a] });
  const FIRE = [[-.05, .02, .02, 1.5], [.03, .02, .04, 1.9], [0, .02, -.04, 1.3], [.07, .02, 0, 1.1]].map(([x, y, z, k], i) => flame3(CH, [x, y, z], k, { light: i === 1, power: 3, range: 5, col: '#FF8A30', shadow: i === 1, seed: i * 3.3 }));
  const ember = glow3(CH, [0, .04, .02], .5, '#FF4A14', .0);
  const EMB = []; { const r = lcg(41); for (let i = 0; i < 9; i++) EMB.push(mesh3(CH, new THREE.SphereGeometry(.012 + r() * .012, 8, 6), new THREE.MeshStandardMaterial({ color: '#2A0C04', emissive: '#FF5A18', emissiveIntensity: 2, roughness: 1 }), [(r() - .5) * .16, .012, (r() - .5) * .14 + .02], { cast: false })); }
  // rotis on a leaf, a bowl of kheer, a lamp
  mesh3(D2, new THREE.CircleGeometry(1, 40), new THREE.MeshStandardMaterial({ map: leafTex3(), roughness: .55 }), [.34, .004, .16], { rot: [-Math.PI / 2, 0, .5], scale: [.3, .2, 1], cast: false });
  for (let i = 0; i < 3; i++) mesh3(D2, new THREE.CylinderGeometry(.095, .095, .006, 28), new THREE.MeshStandardMaterial({ map: rotiTex3(), roughness: .9 }), [.3 + i * .012, .01 + i * .007, .14 - i * .008], { rot: [0, i * 1.3, 0] });
  { const g = new THREE.Group(); g.position.set(.5, .004, .24); D2.add(g); const r = .06;
    mesh3(g, lathe3([[0, 0], [r * .55, 0], [r * .9, r * .3], [r, r * .62], [r * .94, r * .62], [r * .82, r * .3], [0, r * .1]], 32), MAT.clay(), [0, 0, 0]);
    mesh3(g, new THREE.CircleGeometry(r * .9, 28), std3('#D9B98A', .45), [0, r * .5, 0], { rot: [-Math.PI / 2, 0, 0], cast: false }); }
  const d2Lamp = diya3(D2, [-.52, 0, .2], 1.1, { seed: 5, light: true, power: 1.5, range: 2.5 });
  const moon = new THREE.DirectionalLight('#6A84D0', .5); moon.position.set(2, 4, 2); S.add(moon);

  // set(t, { day: 1 | 2, fire: 0..1 })
  function set(t, o = {}) {
    const d2 = o.day === 2, f = o.fire ?? 1;
    D1.visible = !d2; D2.visible = d2;
    env3(S, 'dawn', { k: d2 ? .05 : .55, bg: false, rot: 1 });
    S.fog.color.set(d2 ? '#0A0A14' : '#C8A880');
    hemi.intensity = d2 ? .1 : .75; hemi.color.set(d2 ? '#40508A' : '#FFE8C8');
    sun.intensity = d2 ? 0 : 3.2; moon.intensity = d2 ? .45 : 0;
    d1Lamp.set(t, 1); d2Lamp.set(t, 1);
    FIRE.forEach((F, i) => F.set(t * 1.3, f * (i === 1 ? 1 : clamp(f * 1.4 - .3))));
    ember.material.opacity = d2 ? .25 + .5 * (1 - f) * (.8 + .2 * Math.sin(t * 3)) : 0;
    EMB.forEach((m, i) => m.material.emissiveIntensity = (1.2 + 1.6 * (.5 + .5 * Math.sin(t * 2.2 + i * 1.7))) * (.35 + .65 * f + .3 * (1 - f)));
    STEAM.forEach((s, i) => { const u = (t * .22 + i / 4) % 1; s.position.set(.03 * Math.sin(u * 5 + i), .26 + u * .5, .02 * Math.cos(u * 4 + i)); s.scale.setScalar(.14 + u * .3); s.material.opacity = d2 ? .16 * Math.sin(u * Math.PI) * (.3 + .7 * f) : 0; });
    return d2 ? 1.05 : 1;
  }
  return { S, set };
})();
