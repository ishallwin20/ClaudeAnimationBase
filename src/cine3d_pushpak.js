// cine3d_pushpak.js: Ravana's Pushpaka vimana, built from Valmiki's verses, for the 3D style (load after cine3d.js and
// cine3d_fx.js). First used by the PUSHPAK series (PUSHPAK_SERIES.md; Part 1 = ad/111-books123-pushpak).
//
// What the verses give, and where it is here (Valmiki Ramayana, Gita Press numbering):
//   gold pillars, arches of cat's-eye, nets of pearls, trees with every wished-for fruit (7.15.39) → the tiers' pillars,
//     the arches between them (a cat's-eye on each keystone), pearl festoons in every bay, four wish-trees on the deck
//   steps of gems and gold, platforms of molten gold (7.15.40) → the front stairs (gold treads, sapphire risers)
//   windows of gold and crystal (5.9.16) → the jali walls, lit from within
//   floors of coral, gems and pearls (5.9.17) → the deck's mosaic
//   birds of cat's-eye, silver and coral, serpents of jewels, horses (5.7.12–13) → gem birds on the parapets, two
//     jewelled nagas round the hull meeting at the prow, a frieze of horses round the deck
//   elephants in a lotus pool worshipping four-armed Lakshmi with a lotus (5.7.14) → the shrine in the front bay
//   many peaks like a mountain (5.8.5), rows of upper rooms (5.9.19) → four tiers, each crowned by little pavilions
//   swan images (6.122.26), white flags, nets of tiny bells (6.121.28) → four hamsas at the deck's corners, white
//     flags round the rim and on the summit, bells under every cornice
//   "pushpa": the flower → the hull is a lotus, hanging a kalasha
// No size is given anywhere (PUSHPAK_SERIES.md): it is modelled ~56 m across and ~46 m tall so people read against it.
//
// pushpak3(parent, o) → group P (front = +z, up = +y, the deck top at y 0). o.env: an envMap (else scene.environment).
// P.set(t, o): o.build { hull, deck, horses, serpents, tower, pillars, arches, pearls, walls, stairs, lakshmi, birds,
//   swans, bells, flags, trees, top } 0..1 each (default 1): each part rises into place and fades in; o.glow (0..1, the
//   lotus's light below), o.wind (0..1, bells and flags), o.lit (0..1, the windows and lamps).
// P.at[name]: world-space anchors (local, before P's transform): lakshmi, stairs, swan, bird, bell, horse, serpent, top,
//   tree, pearl, arch, pillar, flag (aim the camera at them with P.localToWorld(P.at.x.clone())).

const PK_COL = { gold: '#E3B356', gold2: '#B9853A', goldD: '#8A5C24', ivory: '#EFE4CC', coral: '#E0705A', catseye: '#B5B84A',
  sapphire: '#2E50A8', emerald: '#1E8A5C', pearl: '#F4EFE6', silver: '#CDD2DA', white: '#F7F3EA', lotus: '#F2A6A8', leaf: '#3E6E2E' };

// a lotus petal: a cupped, pointed blade of length l, width w (along +y from its base, cupping toward +z)
function petalGeo3(w, l, cup = .35, bend = .25) {
  const g = new THREE.PlaneGeometry(1, 1, 8, 14), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const u = p.getX(i), v = p.getY(i) + .5;                       // u -0.5..0.5 across, v 0..1 along
    const wid = Math.pow(Math.sin(Math.PI * Math.min(1, v * .92 + .06)), .75) * (1 - .25 * v) * w;
    const x = u * wid, y = v * l;
    const z = -cup * w * (1 - Math.pow(2 * u, 2)) * Math.sin(Math.PI * v * .9) * .5 + bend * l * v * v;
    p.setXYZ(i, x, y, z);
  }
  g.computeVertexNormals(); return g;
}

// ---------- canvas textures (relief height maps and colour maps) ----------
// the horse frieze: galloping horses in a beaded border (a height map: white is high)
const pkHorseTex = () => tex3('pk_horses', 2048, 160, (g, w, h) => {
  g.fillStyle = '#5a5a5a'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#bdbdbd'; g.fillRect(0, 0, w, 14); g.fillRect(0, h - 14, w, 14);
  for (let x = 6; x < w; x += 16) { g.beginPath(); g.arc(x, 7, 5, 0, TAU); g.arc(x, h - 7, 5, 0, TAU); g.fillStyle = '#ffffff'; g.fill(); }
  const horse = (cx, cy, s, ph) => {
    g.save(); g.translate(cx, cy); g.scale(s, s);
    g.fillStyle = '#f2f2f2'; g.strokeStyle = '#f2f2f2'; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.ellipse(0, 0, 34, 15, -.05, 0, TAU); g.fill();                         // body
    g.beginPath(); g.moveTo(22, -8); g.quadraticCurveTo(34, -30, 44, -40); g.lineTo(52, -34); g.quadraticCurveTo(40, -18, 34, 2); g.fill();   // neck
    g.beginPath(); g.ellipse(52, -36, 13, 6.5, .55, 0, TAU); g.fill();                     // head
    g.beginPath(); g.moveTo(45, -45); g.lineTo(43, -54); g.lineTo(49, -46); g.fill();      // ear
    g.lineWidth = 7;                                                                          // legs at a gallop
    const leg = (x, y, a1, a2) => { const k1 = [x + Math.sin(a1) * 14, y + Math.cos(a1) * 14], k2 = [k1[0] + Math.sin(a2) * 14, k1[1] + Math.cos(a2) * 14]; g.beginPath(); g.moveTo(x, y); g.lineTo(...k1); g.lineTo(...k2); g.stroke(); };
    leg(24, 8, .9 + .2 * ph, -.3); leg(18, 8, .5 - .2 * ph, .2); leg(-24, 8, -.7 - .2 * ph, .4); leg(-30, 6, -1.1 + .2 * ph, .1);
    g.lineWidth = 6; g.beginPath(); g.moveTo(-32, -6); g.quadraticCurveTo(-52, -4, -58, 14); g.stroke();       // tail
    g.lineWidth = 5; g.beginPath(); g.moveTo(26, -14); g.quadraticCurveTo(36, -34, 46, -44); g.stroke();      // mane
    g.restore();
  };
  g.filter = 'blur(1.5px)';
  for (let i = 0; i < 12; i++) horse(85 + i * 170, 92, 1.18, i % 2);
  g.filter = 'none';
}, { data: true });

// the jali wall: a gold lattice over lit crystal (colour) and its emissive light
const pkJaliTex = (emit) => tex3(emit ? 'pk_jali_e' : 'pk_jali', 256, 256, (g, w, h) => {
  g.fillStyle = emit ? '#000' : PK_COL.ivory; g.fillRect(0, 0, w, h);
  // a window: an ogee-arched opening with a lattice of quatrefoils
  g.save(); g.beginPath(); g.moveTo(58, 236); g.lineTo(58, 96); g.quadraticCurveTo(58, 40, 128, 18); g.quadraticCurveTo(198, 40, 198, 96); g.lineTo(198, 236); g.closePath();
  g.fillStyle = emit ? '#FFB860' : '#F6D9A0'; g.fill(); g.clip();
  g.strokeStyle = emit ? '#000' : PK_COL.gold2; g.lineWidth = 6;
  for (let y = 10; y < 256; y += 28) for (let x = 58; x < 200; x += 28) { g.beginPath(); g.arc(x + (y / 28 % 2) * 14, y, 12, 0, TAU); g.stroke(); }
  g.restore();
  if (!emit) { g.strokeStyle = PK_COL.gold; g.lineWidth = 8; g.beginPath(); g.moveTo(58, 236); g.lineTo(58, 96); g.quadraticCurveTo(58, 40, 128, 18); g.quadraticCurveTo(198, 40, 198, 96); g.lineTo(198, 236); g.stroke(); }
});

// the deck's mosaic: coral, lapis, gold and pearl in rings of lotus petals
const pkFloorTex = () => tex3('pk_floor', 1024, 1024, (g, w, h) => {
  const cx = w / 2, cy = h / 2;
  g.fillStyle = '#B8584A'; g.fillRect(0, 0, w, h);
  const rings = [[500, '#C9694F'], [440, '#2F4E92'], [400, '#D9A85A'], [330, '#B8584A'], [270, '#EDE3D0'], [200, '#2F4E92'], [150, '#D9A85A']];
  for (const [r, col] of rings) { g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fillStyle = col; g.fill(); }
  const petals = (r0, r1, n, col, off = 0) => { for (let i = 0; i < n; i++) { const a = (i + off) / n * TAU, da = TAU / n * .45; g.beginPath(); g.moveTo(cx + Math.cos(a - da) * r0, cy + Math.sin(a - da) * r0); g.quadraticCurveTo(cx + Math.cos(a) * (r1 * 1.08), cy + Math.sin(a) * (r1 * 1.08), cx + Math.cos(a + da) * r0, cy + Math.sin(a + da) * r0); g.fillStyle = col; g.fill(); } };
  petals(400, 500, 48, '#E08A6A'); petals(330, 400, 32, '#F2E6CC', .5); petals(200, 270, 24, '#D9A85A'); petals(150, 200, 16, '#E08A6A', .5);
  // tesserae: a fine grid of light lines
  g.globalAlpha = .12; g.strokeStyle = '#fff'; g.lineWidth = 1; for (let x = 0; x < w; x += 8) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); g.beginPath(); g.moveTo(0, x); g.lineTo(w, x); g.stroke(); }
  g.globalAlpha = 1;
});

// the serpents' scales: jewels in rows (emerald, sapphire, gold, coral), scrolling along the body
const pkScaleTex = () => tex3('pk_scales', 256, 64, (g, w, h) => {
  g.fillStyle = '#B8893A'; g.fillRect(0, 0, w, h);
  for (let r = 0; r < 4; r++) for (let i = 0; i < 16; i++) {
    const x = i * 16 + (r % 2) * 8, y = r * 16 + 8, gem = (i * 7 + r * 3) % 11 === 0;
    g.beginPath(); g.ellipse(x, y, 7.2, 7, 0, 0, TAU); g.fillStyle = gem ? ['#2E50A8', '#C9604A', '#D9C24E'][(i + r) % 3] : ((i + r) % 2 ? '#155E40' : '#1B7048'); g.fill();
    g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.ellipse(x - 2, y - 2.5, 2.5, 1.8, 0, 0, TAU); g.fill();
  }
});

// Lakshmi in relief: seated on a lotus, four arms (two lotuses held up, abhaya, coins falling from varada), crown and
// halo; a height map (white high) and the same drawing as the colour (gold, with the lotuses tinted)
function pkLakshmiDraw(g, w, h, colour) {
  const s = w / 512;
  g.save(); g.scale(s, s);
  const HI = colour ? '#E9B95A' : '#ffffff', MID = colour ? '#C99640' : '#b0b0b0', BG = colour ? '#7A4E20' : '#303030', LOT = colour ? '#F0A0A4' : '#e8e8e8';
  g.fillStyle = BG; g.fillRect(0, 0, 512, 640);
  // the arched frame and halo
  g.lineWidth = 18; g.strokeStyle = MID; g.beginPath(); g.moveTo(40, 640); g.lineTo(40, 200); g.quadraticCurveTo(40, 30, 256, 22); g.quadraticCurveTo(472, 30, 472, 200); g.lineTo(472, 640); g.stroke();
  g.fillStyle = colour ? '#A8742E' : '#707070'; g.beginPath(); g.arc(256, 168, 112, 0, TAU); g.fill();
  for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; g.beginPath(); g.moveTo(256 + Math.cos(a - .08) * 108, 168 + Math.sin(a - .08) * 108); g.lineTo(256 + Math.cos(a) * 132, 168 + Math.sin(a) * 132); g.lineTo(256 + Math.cos(a + .08) * 108, 168 + Math.sin(a + .08) * 108); g.fillStyle = MID; g.fill(); }
  // the lotus seat
  const pet = (x, y, rx, ry, a, col) => { g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(rx, -ry * .5, 0, -ry); g.quadraticCurveTo(-rx, -ry * .5, 0, 0); g.fillStyle = col; g.fill(); g.restore(); };
  for (let i = -4; i <= 4; i++) pet(256 + i * 34, 600, 22, 70, i * .2, LOT);
  for (let i = -3; i <= 3; i++) pet(256 + i * 36, 590, 20, 56, i * .16, colour ? '#F6C2C2' : '#f6f6f6');
  // body: crossed legs, torso, head, crown
  g.fillStyle = HI;
  g.beginPath(); g.ellipse(256, 520, 120, 42, 0, 0, TAU); g.fill();                                                    // legs
  g.beginPath(); g.moveTo(200, 500); g.quadraticCurveTo(190, 380, 214, 300); g.lineTo(298, 300); g.quadraticCurveTo(322, 380, 312, 500); g.closePath(); g.fill();   // torso
  g.beginPath(); g.ellipse(256, 300, 58, 26, 0, 0, TAU); g.fill();                                                    // shoulders
  g.beginPath(); g.ellipse(256, 226, 38, 46, 0, 0, TAU); g.fill();                                                    // head
  g.beginPath(); g.moveTo(222, 196); g.lineTo(230, 140); g.lineTo(256, 112); g.lineTo(282, 140); g.lineTo(290, 196); g.closePath(); g.fill();   // crown
  g.fillStyle = MID; g.beginPath(); g.ellipse(256, 262, 22, 8, 0, 0, TAU); g.fill();                                  // necklace
  g.beginPath(); g.moveTo(222, 330); g.quadraticCurveTo(256, 400, 290, 330); g.lineWidth = 8; g.strokeStyle = MID; g.stroke();
  // four arms
  g.strokeStyle = HI; g.lineCap = 'round'; g.lineWidth = 24;
  const arm = (pts) => { g.beginPath(); g.moveTo(...pts[0]); for (let i = 1; i < pts.length; i++) g.lineTo(...pts[i]); g.stroke(); };
  arm([[212, 310], [150, 300], [120, 220]]); arm([[300, 310], [362, 300], [392, 220]]);      // upper arms raised
  arm([[208, 330], [176, 410], [196, 456]]); arm([[304, 330], [346, 400], [348, 440]]);      // lower arms
  // the lotuses held up
  for (const x of [120, 392]) { g.lineWidth = 6; g.strokeStyle = MID; g.beginPath(); g.moveTo(x, 230); g.lineTo(x, 150); g.stroke(); for (let i = -2; i <= 2; i++) pet(x + i * 9, 154, 13, 46, i * .35, LOT); }
  // abhaya (right lower hand, palm out) and coins from the left
  g.fillStyle = HI; g.beginPath(); g.ellipse(352, 430, 18, 24, 0, 0, TAU); g.fill();
  g.beginPath(); g.ellipse(196, 462, 20, 16, 0, 0, TAU); g.fill();
  g.fillStyle = colour ? '#F6D27A' : '#ffffff'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(190 + (i % 2) * 14 - 6, 492 + i * 16, 7, 0, TAU); g.fill(); }
  g.restore();
}
const pkLakshmiTex = (colour) => tex3(colour ? 'pk_lak_c' : 'pk_lak_h', 512, 640, (g, w, h) => { if (!colour) g.filter = 'blur(3px)'; pkLakshmiDraw(g, w, h, colour); }, { data: !colour });

// ---------- the model ----------
function pushpak3(parent, o = {}) {
  const P = new THREE.Group(); parent.add(P);
  const env = o.env;
  const std = (col, rough, metal = 0, e = .55, x = {}) => new THREE.MeshStandardMaterial({ color: col, roughness: rough, metalness: metal, envMapIntensity: e, ...(env ? { envMap: env } : {}), ...x });
  // the palette (matte: owner's "not too shiny" note on ad 64)
  const M = {
    gold: std(PK_COL.gold, .42, .6), gold2: std(PK_COL.gold2, .5, .55), goldD: std(PK_COL.goldD, .6, .5),
    ivory: std(PK_COL.ivory, .75, 0, .35), white: std(PK_COL.white, .8, 0, .3, { side: THREE.DoubleSide }), flagW: std('#FBF4E4', .9, 0, .25, { side: THREE.DoubleSide }),
    coral: std(PK_COL.coral, .45, 0, .5), catseye: std(PK_COL.catseye, .18, .1, .9, { emissive: '#3A3A08', emissiveIntensity: .25 }),
    sapphire: std(PK_COL.sapphire, .2, .1, .9), emerald: std(PK_COL.emerald, .2, .1, .9), pearl: std(PK_COL.pearl, .32, 0, .7),
    silver: std(PK_COL.silver, .35, .7, .6), lotus: std(PK_COL.lotus, .6, 0, .3, { side: THREE.DoubleSide }), lotus2: std('#F7C6BE', .6, 0, .3, { side: THREE.DoubleSide }),
    leaf: std(PK_COL.leaf, .8, 0, .25, { side: THREE.DoubleSide }), water: std('#3E6A78', .08, .2, 1.1),
    jali: new THREE.MeshStandardMaterial({ map: pkJaliTex(0), emissiveMap: pkJaliTex(1), emissive: '#FFC070', emissiveIntensity: 0, roughness: .7, envMapIntensity: .35, ...(env ? { envMap: env } : {}) }),
  };
  // parts: each its own group (and its own material clones), so P.set can raise and fade them in one by one
  const PARTS = {}, mats = {};
  const part = (name) => { if (!PARTS[name]) { const g = new THREE.Group(); g.name = name; P.add(g); PARTS[name] = g; mats[name] = new Map(); } return PARTS[name]; };
  const m_ = (name, base) => { part(name); const mm = mats[name]; if (!mm.has(base)) { const c = base.clone(); mm.set(base, c); } return mm.get(base); };
  const add = (name, geo, mat, pos, opt = {}) => mesh3(part(name), geo, m_(name, mat), pos, { cast: opt.cast ?? true, receive: true, rot: opt.rot, scale: opt.scale });
  // instanced meshes: collect matrices per (part, geo, mat), build at the end
  const INST = [];
  const inst = (name, geo, mat) => { const r = { name, geo, mat, list: [] }; INST.push(r); return r; };
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), S = V3(1, 1, 1);
  const put = (r, pos, rot = [0, 0, 0], sc = 1) => { E.set(...rot); Q.setFromEuler(E); Array.isArray(sc) ? S.set(...sc) : S.setScalar(sc); r.list.push(new THREE.Matrix4().compose(V3(...pos), Q.clone(), S.clone())); };
  const sqFrustum = (wTop, wBot, h) => { const g = new THREE.CylinderGeometry(wTop / Math.SQRT2, wBot / Math.SQRT2, h, 4, 1); g.rotateY(Math.PI / 4); return g; };
  P.at = {};

  // ================= the hull: a lotus hanging a kalasha =================
  const R = 28;   // the deck's radius
  add('hull', lathe3([[R - .5, -2.6], [R - 2, -4], [R - 6, -6.5], [R - 12, -9.5], [R - 18, -12.5], [6, -15], [3.2, -16.2], [2.2, -17]].reverse(), 64), M.gold2, [0, 0, 0]);
  // petals: three rows, pink outside, gold within
  // [count, base radius, base y, width, length, tilt out from vertical, material, offset]
  const petRows = [[26, R - 9, -10.8, 7.2, 10.5, 1.02, M.lotus, 0], [26, R - 12, -12.4, 6.4, 9, .82, M.lotus2, .5], [16, 7, -15.5, 4.4, 5.5, 2.5, M.gold, 0]];
  for (const [n, r, y, w, l, tilt, mat, off] of petRows) {
    const geo = petalGeo3(w, l, .55, -.12);
    for (let i = 0; i < n; i++) { const a = (i + off) / n * TAU; const m = add('hull', geo, mat, [Math.sin(a) * r, y, Math.cos(a) * r], { cast: false }); m.rotation.order = 'YXZ'; m.rotation.set(tilt, a, 0); }
  }
  // the kalasha pendant
  add('hull', lathe3([[2.2, -17], [2.8, -18], [3.2, -19.6], [2.6, -21], [1.2, -21.8], [1.6, -22.6], [.9, -23.6], [.3, -24.6], [0, -25]].reverse(), 32), M.gold, [0, 0, 0]);
  // the glow under the lotus
  P.under = glow3(P, [0, -14, 0], 70, '#FFC870', .0);

  // ================= the deck: mosaic floor, horse frieze, gem band, railing =================
  add('deck', new THREE.CylinderGeometry(R, R, .8, 96), new THREE.MeshStandardMaterial({ map: pkFloorTex(), roughness: .55, envMapIntensity: .4, ...(env ? { envMap: env } : {}) }), [0, -.4, 0]);
  add('deck', new THREE.TorusGeometry(R, .35, 10, 128), M.gold, [0, -.1, 0], { rot: [Math.PI / 2, 0, 0] });
  add('deck', new THREE.TorusGeometry(R - .1, .3, 10, 128), M.gold, [0, -2.65, 0], { rot: [Math.PI / 2, 0, 0] });
  // the frieze: horses in relief, round the deck's edge
  const hz = pkHorseTex(); hz.repeat.set(5, 1);
  add('horses', new THREE.CylinderGeometry(R - .05, R - .05, 2.1, 160, 1, true), new THREE.MeshStandardMaterial({ color: PK_COL.gold, metalness: .55, roughness: .45, bumpMap: hz, bumpScale: 4, envMapIntensity: .55, ...(env ? { envMap: env } : {}) }), [0, -1.5, 0]);
  P.at.horse = V3(0, -1.5, R);
  // the gem band under the rim: cat's-eye, coral, sapphire, emerald
  const gems = ['catseye', 'coral', 'sapphire', 'emerald'].map(k => inst('deck', new THREE.SphereGeometry(.26, 12, 8), M[k]));
  for (let i = 0; i < 160; i++) { const a = i / 160 * TAU; put(gems[i % 4], [Math.sin(a) * (R + .3), -.35, Math.cos(a) * (R + .3)]); }
  // the railing: gold balusters and a rail, open at the front for the stairs
  const bal = inst('deck', lathe3([[.12, 0], [.16, .1], [.09, .3], [.14, .6], [.08, .9], [.12, 1.05], [.0, 1.1]], 10), M.gold);
  for (let i = 0; i < 180; i++) { const a = i / 180 * TAU; if (Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) < .17) continue; put(bal, [Math.sin(a) * (R - .6), 0, Math.cos(a) * (R - .6)]); }
  const railGeo = new THREE.TorusGeometry(R - .6, .09, 6, 180, TAU - .34); railGeo.rotateX(Math.PI / 2); railGeo.rotateY(-Math.PI / 2 + .17);
  add('deck', railGeo, M.gold, [0, 1.12, 0]);

  // ================= the serpents: two jewelled nagas round the hull, hoods at the prow =================
  const scales = pkScaleTex(); scales.repeat.set(60, 2);
  const serpMat = new THREE.MeshStandardMaterial({ map: scales, roughness: .3, metalness: .3, envMapIntensity: .8, ...(env ? { envMap: env } : {}) });
  P.scales = [];
  for (const side of [1, -1]) {
    const pts = [];
    for (let i = 0; i <= 120; i++) { const s = i / 120, a = Math.PI + side * (Math.PI - .2) * s; const r = R - .3 + .25 * Math.sin(s * 30) + 1.2 * Math.pow(s, 8); pts.push(V3(Math.sin(a) * r, -3.5 + .45 * Math.sin(s * 22 + (side > 0 ? 0 : 1.3)) + 3.2 * Math.pow(s, 6), Math.cos(a) * r)); }
    const curve = new THREE.CatmullRomCurve3(pts), tube = new THREE.TubeGeometry(curve, 300, .6, 10);
    // taper the tail: scale the radius by the curve parameter
    const tp = tube.attributes.position, nrm = new THREE.Vector3();
    for (let i = 0; i < tp.count; i++) { const ring = Math.floor(i / 11), s = ring / 300, c = curve.getPointAt(Math.min(1, s)); nrm.set(tp.getX(i) - c.x, tp.getY(i) - c.y, tp.getZ(i) - c.z); const k = .25 + .75 * Math.min(1, s * 4); tp.setXYZ(i, c.x + nrm.x * k, c.y + nrm.y * k, c.z + nrm.z * k); }
    tube.computeVertexNormals();
    const sm = serpMat.clone(); sm.map = scales.clone(); sm.map.needsUpdate = true; sm.map.repeat.set(60, 2); P.scales.push(sm.map);
    mesh3(part('serpents'), tube, sm, [0, 0, 0], { cast: false });
    // the hood and head at the prow, rearing up and out
    const end = pts.at(-1), hx = end.x, hy = end.y + .2, hz2 = end.z + .5;
    add('serpents', new THREE.CylinderGeometry(.42, .6, 2.6, 12), sm, [hx, hy + .9, hz2 - .2], { rot: [-.15, 0, 0] });
    { const hg = new THREE.PlaneGeometry(1, 1, 12, 14), hp = hg.attributes.position;
      for (let i = 0; i < hp.count; i++) { const u = hp.getX(i), v = hp.getY(i) + .5; const wid = (.35 + 1.25 * Math.sin(Math.PI * Math.min(1, v * .85 + .1))) * (v > .8 ? 1 - (v - .8) * 2.2 : 1); hp.setXYZ(i, u * wid * 2.4, v * 3.4, -.55 * (1 - Math.pow(2 * u, 2)) * Math.sin(Math.PI * v)); }
      hg.computeVertexNormals();
      const hood = new THREE.Group(); part('serpents').add(hood); hood.position.set(hx, hy + 1.2, hz2 - .3); hood.rotation.set(-.12, side * .22, 0);
      mesh3(hood, hg, m_('serpents', std(PK_COL.emerald, .3, .2, .8, { side: THREE.DoubleSide })), [0, 0, 0]);
      const inner = hg.clone(); inner.scale(.62, .78, .62); mesh3(hood, inner, m_('serpents', M.gold), [0, .25, .12]);
      for (let k = 0; k < 5; k++) mesh3(hood, new THREE.SphereGeometry(.13, 8, 6), m_('serpents', [M.coral, M.sapphire, M.catseye][k % 3]), [(k - 2) * .38, 1.9 + .25 * Math.cos((k - 2) * .7), .25]);
      const head = new THREE.SphereGeometry(.42, 18, 12); head.scale(1, .7, 1.6);
      mesh3(hood, head, m_('serpents', M.sapphire), [0, 3.05, .55]);
      for (const ex of [-.2, .2]) mesh3(hood, new THREE.SphereGeometry(.08, 8, 6), m_('serpents', M.coral), [ex, 3.22, .95]);
      mesh3(hood, new THREE.ConeGeometry(.16, .45, 8), m_('serpents', M.gold), [0, 3.45, .35]); }
    P.at.serpent = V3(hx, hy + 3, hz2);
  }

  // ================= the tower: a plinth and four pillared tiers, each crowned by pavilions =================
  const PL = 30, PLH = 3.2;   // the plinth: 30 m square, 3.2 m high
  add('tower', sqFrustum(PL, PL + 1.2, .8), M.goldD, [0, .4, -1]);
  add('tower', sqFrustum(PL - .8, PL - .8, 1.4), M.ivory, [0, 1.5, -1]);
  add('tower', sqFrustum(PL + .6, PL - .6, 1), M.gold, [0, 2.7, -1]);
  const TIERS = [{ w: 26, h: 9.5 }, { w: 20, h: 7.5 }, { w: 15, h: 6.5 }, { w: 10.5, h: 5.5 }];
  const pillarGeo = new THREE.CylinderGeometry(.34, .38, 1, 8), capGeo = lathe3([[.38, 0], [.62, .12], [.7, .3], [.5, .42], [.62, .55], [0, .55]], 12), baseGeo = new THREE.BoxGeometry(.95, .5, .95);
  const pearlGeo = new THREE.SphereGeometry(.085, 8, 6), bellGeo = (() => { const b = lathe3([[0, 0], [.1, .02], [.16, -.1], [.2, -.32], [.27, -.44], [0, -.44]].reverse(), 12), ch = new THREE.CylinderGeometry(.025, .025, 1, 4); ch.translate(0, .5, 0); const merge = THREE.mergeGeometries; return merge ? merge([b.toNonIndexed(), ch.toNonIndexed()]) : b; })(), clapGeo = new THREE.SphereGeometry(.07, 6, 5);
  const I = { pillar: inst('pillars', pillarGeo, M.gold), cap: inst('pillars', capGeo, M.gold), base: inst('pillars', baseGeo, M.gold2),
    pearl: inst('pearls', pearlGeo, M.pearl), keygem: inst('arches', new THREE.SphereGeometry(.32, 12, 8), M.catseye),
    bell: inst('bells', bellGeo, M.gold), bellIn: [] };
  P.bells = [];   // [{ m (local matrix pos), phase }]
  let y = PLH, zc = -1;
  const archGeoCache = new Map();
  const archGeo = (span) => { const k = span.toFixed(2); if (!archGeoCache.has(k)) { const g = new THREE.TorusGeometry(span / 2, .16, 8, 24, Math.PI); archGeoCache.set(k, g); } return archGeoCache.get(k); };
  TIERS.forEach((T, ti) => {
    const hw = T.w / 2, inset = .7, ph = T.h - 1.6;     // pillar height (the rest is the architrave and cornice)
    // the floor slab and the inner jali wall (lit from within)
    add('tower', sqFrustum(T.w + .6, T.w + .6, .5), M.gold2, [0, y + .25, zc]);
    const wallW = T.w - (ti === 0 ? 8 : 4), jt = M.jali.clone(); jt.map = pkJaliTex(0); jt.map.repeat.set(Math.round(wallW / 2.6), 1); jt.emissiveMap = pkJaliTex(1); jt.emissiveMap.repeat.copy(jt.map.repeat);
    const wall = mesh3(part('walls'), new THREE.BoxGeometry(wallW, ph, wallW), jt, [0, y + .5 + ph / 2, zc]); (P.jali = P.jali || []).push(jt);
    // pillars round the edge: n bays a side; the front middle bay of the ground tier left wide for the shrine
    const n = Math.max(3, Math.round(T.w / 3.3)), step = (T.w - 2 * inset) / n;
    const sides = [[0, 1], [1, 0], [0, -1], [-1, 0]];   // front (+z), right, back, left
    sides.forEach(([sx, sz], si) => {
      for (let i = 0; i <= n; i++) {
        const u = -hw + inset + i * step;
        const px = sz !== 0 ? u : sx * (hw - inset), pz = sz !== 0 ? sz * (hw - inset) : -u;
        const front = si === 0 && ti === 0 && Math.abs(u) < step * .6 && n % 2 === 0;
        if (!front) {
          put(I.base, [px, y + .75, pz + zc]); put(I.pillar, [px, y + .5 + ph / 2, pz + zc], [0, 0, 0], [1, ph, 1]); put(I.cap, [px, y + .5 + ph - .55, pz + zc]);
        }
        if (i < n) {
          // the arch over the bay, a cat's-eye on its keystone; pearls festooned beneath; a bell at its crown
          const u2 = u + step / 2, ax = sz !== 0 ? u2 : sx * (hw - inset), az = sz !== 0 ? sz * (hw - inset) : -u2, rotY = sz !== 0 ? 0 : Math.PI / 2;
          const span = step - .8, top = y + .5 + ph - .5;
          const wide = si === 0 && ti === 0 && n % 2 === 0 && (i === n / 2 - 1 || i === n / 2);
          if (wide) { if (i === n / 2 - 1) { const sp2 = step * 2 - .8; add('arches', archGeo(sp2), M.gold, [0, top - sp2 / 2 - .05, az + zc], { rot: [0, rotY, 0], scale: [1, Math.min(1, (ph - 1) / (sp2 / 2)), 1] }); put(I.keygem, [0, top - .05 + (Math.min(1, (ph - 1) / (sp2 / 2)) - 1) * 0, az + zc + .3 * sz]); } continue; }
          add('arches', archGeo(span), M.gold, [ax, top - span / 2 - .05, az + zc], { rot: [0, rotY, 0] });
          put(I.keygem, [ax + .3 * sx, top - .05, az + zc + .3 * sz]);
          // festoon: a catenary of pearls and three drops
          for (let k = 0; k <= 22; k++) { const s = k / 22 - .5, dip = 1.1 * (1 - 4 * s * s); const q = s * span; put(I.pearl, [ax + (sz !== 0 ? q : 0) + sx * .1, top - span / 2 - .3 - dip * .7, az + (sz !== 0 ? 0 : -q) + zc + sz * .1]); }
          for (const d of [-.3, 0, .3]) for (let k = 0; k < 7 + (d === 0 ? 4 : 0); k++) put(I.pearl, [ax + (sz !== 0 ? d * span : 0) + sx * .1, top - span / 2 - .45 - 1.1 * (1 - 4 * d * d) * .7 - k * .19, az + (sz !== 0 ? 0 : -d * span) + zc + sz * .1]);
          P.bells.push({ p: V3(ax + sx * .4, top - .95, az + zc + sz * .4), ph: (si * 7 + i * 3 + ti * 11) * .7 });
        }
      }
    });
    // the architrave and the curved cornice (kapota), with bells at its corners
    const archY = y + .5 + ph;
    add('tower', sqFrustum(T.w - .6, T.w - .6, .7), M.gold2, [0, archY + .35, zc]);
    add('tower', sqFrustum(T.w + 1.6, T.w - .2, .9), M.gold, [0, archY + 1.15, zc]);
    for (const [cx, cz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) P.bells.push({ p: V3(cx * (hw + .6), archY - .25, cz * (hw + .6) + zc), ph: cx * 2 + cz + ti });
    // the parapet: corner kutas (domed), barrel-roofed shalas between, gem birds perched in the gaps
    const py = archY + 1.6, hw2 = hw - .4;
    const kuta = (x, z, s) => { add('tower', new THREE.BoxGeometry(1.6 * s, 1.2 * s, 1.6 * s), M.gold2, [x, py + .6 * s, z]); add('tower', new THREE.SphereGeometry(1 * s, 16, 10, 0, TAU, 0, Math.PI / 2), M.gold, [x, py + 1.2 * s, z], { scale: [1, 1.15, 1] }); add('tower', lathe3([[.22, 0], [.3, .15], [.18, .35], [.08, .6], [0, .7]].map(([r, h]) => [r * s, h * s]), 12), M.gold, [x, py + 2.3 * s, z]); };
    const shala = (x, z, len, along) => { const g = new THREE.CylinderGeometry(.8, .8, len, 16, 1, false, 0, Math.PI); g.rotateZ(Math.PI / 2); if (!along) g.rotateY(Math.PI / 2); add('tower', new THREE.BoxGeometry(along ? len : 1.4, .9, along ? 1.4 : len), M.gold2, [x, py + .45, z]); add('tower', g, M.gold, [x, py + .9, z], { rot: [0, 0, 0] }); };
    const ks = ti === 0 ? 1.25 : ti === 1 ? 1.05 : .9;
    for (const [cx, cz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) kuta(cx * hw2, cz * hw2 + zc, ks);
    const ns = ti < 2 ? 2 : 1;
    for (const [sx, sz] of sides) for (let j = 0; j < ns; j++) {
      const u = ns === 1 ? 0 : (j - .5) * hw2 * .9, x = sz !== 0 ? u : sx * hw2, z = sz !== 0 ? sz * hw2 : u;
      shala(x, z + zc, ti < 2 ? 3.4 : 2.6, sz !== 0);
      // birds in the gaps either side of the shala
      for (const d of [-1, 1]) { const bu = u + d * (ti < 2 ? 2.6 : 2.1), bx = sz !== 0 ? bu : sx * (hw2 + .1), bz = sz !== 0 ? sz * (hw2 + .1) : bu; (P.birdSpots = P.birdSpots || []).push([bx, py + .05, bz + zc, Math.atan2(sx, sz) + d * .4]); }
    }
    y = archY + 1.6;
  });
  // the summit: an octagonal neck and dome (the shikhara), the kalasha, the great white flag
  add('top', new THREE.CylinderGeometry(4.4, 4.6, 2.6, 8), M.gold2, [0, y + 1.3, zc]);
  add('top', lathe3([[5.6, 0], [5.9, .6], [5.6, 2.2], [4.6, 3.8], [3, 4.9], [1.2, 5.4], [0, 5.5]], 8), M.gold, [0, y + 2.6, zc]);
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + Math.PI / 8; add('top', new THREE.SphereGeometry(.5, 12, 8), M.catseye, [Math.sin(a) * 5.4, y + 3.4, Math.cos(a) * 5.4 + zc]); }
  add('top', lathe3([[.9, 0], [1.3, .35], [1.5, 1.1], [1.1, 1.8], [.5, 2.1], [.7, 2.4], [.35, 3.2], [.1, 3.9], [0, 4.1]], 20), M.gold, [0, y + 8, zc]);
  P.at.top = V3(0, y + 10, zc);
  const flags = [];
  const flag = (x, yy, z, h, w, fh) => {
    add('flags', new THREE.CylinderGeometry(.07, .09, h, 6), M.gold, [x, yy + h / 2, z]);
    const g = new THREE.PlaneGeometry(w, fh, 16, 4); g.translate(w / 2, 0, 0);
    { const a = g.attributes.position; for (let i = 0; i < a.count; i++) { const x = a.getX(i) / w; a.setY(i, a.getY(i) * (1 - .78 * x) + fh * .1 * x); } }
    const m = add('flags', g, M.flagW, [x, yy + h - fh / 2 - .1, z], { cast: false });
    flags.push({ m, g, base: g.attributes.position.array.slice(), w });
  };
  flag(0, y + 11.8, zc, 6, 5.2, 2.6);
  P.at.flag = V3(0, y + 15, zc);
  const TOP_Y = y + 18;
  for (let i = 0; i < 12; i++) { const a = (i + .5) / 12 * TAU; flag(Math.sin(a) * (R - .9), 0, Math.cos(a) * (R - .9), 7.5, 2.8, 1.5); }

  // ================= the front stairs: gold treads, sapphire risers, up the plinth =================
  const SW = 7, steps = 10, z0 = (PL / 2 - 1) + 4.6;
  for (let i = 0; i < steps; i++) {
    const zz = z0 - i * .46, yy = i * PLH / steps;
    add('stairs', new THREE.BoxGeometry(SW, PLH / steps, .5), i % 2 ? M.sapphire : M.emerald, [0, yy + PLH / steps / 2, zz]);
    add('stairs', new THREE.BoxGeometry(SW + .1, .07, .56), M.gold, [0, yy + PLH / steps, zz - .02]);
  }
  for (const sx of [-1, 1]) { add('stairs', new THREE.BoxGeometry(.7, PLH + .6, z0 - (PL / 2 - 1) + .6), M.gold2, [sx * (SW / 2 + .35), (PLH + .6) / 2, (z0 + PL / 2 - 1) / 2 - .2]); add('stairs', new THREE.SphereGeometry(.45, 12, 8), M.catseye, [sx * (SW / 2 + .35), PLH + 1.05, z0 + .1]); }
  P.at.stairs = V3(0, 1.4, z0 - 2);

  // ================= the shrine: four-armed Lakshmi in relief, elephants in a lotus pool =================
  const T0 = TIERS[0], wallFront = (T0.w - 8) / 2 + zc;
  const lakMat = new THREE.MeshStandardMaterial({ map: pkLakshmiTex(1), bumpMap: pkLakshmiTex(0), bumpScale: 6, roughness: .45, metalness: .45, envMapIntensity: .55, ...(env ? { envMap: env } : {}) });
  add('lakshmi', new THREE.PlaneGeometry(3.6, 4.5), lakMat, [0, PLH + .5 + 2.6, wallFront + .22], { cast: false });
  add('lakshmi', new THREE.BoxGeometry(4.3, 5.3, .3), M.gold2, [0, PLH + .5 + 2.6, wallFront - .05]);
  P.at.lakshmi = V3(0, PLH + 3.1, wallFront);
  // the pool: a sunken gold-rimmed basin with water, pads and lotuses
  const poolZ = wallFront + 2.5;
  add('lakshmi', new THREE.BoxGeometry(6.4, .35, 3.6), M.gold, [0, PLH + .5 + .18, poolZ]);
  add('lakshmi', new THREE.BoxGeometry(5.8, .1, 3.0), M.water, [0, PLH + .5 + .33, poolZ]);
  const padGeo = new THREE.CircleGeometry(.36, 16, .3, TAU - .3); padGeo.rotateX(-Math.PI / 2);
  for (let i = 0; i < 14; i++) { const x = -2.4 + (i * 1.9) % 4.8, z = poolZ - 1.1 + ((i * 1.3) % 2.2); add('lakshmi', padGeo, M.leaf, [x, PLH + .5 + .4, z], { rot: [0, i * 1.7, 0], cast: false }); }
  const lotusFlower = (part_, x, yy, z, s, mat = M.lotus) => { const pg = petalGeo3(.42 * s, .7 * s, .6, -.1); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; add(part_, pg, i % 2 ? mat : M.lotus2, [x, yy, z], { rot: [-.5 - (i % 2) * .4, a, 0], cast: false }); } add(part_, new THREE.SphereGeometry(.12 * s, 8, 6), M.gold, [x, yy + .1 * s, z]); };
  for (const [x, z] of [[-1.6, -.6], [1.2, .7], [.2, -.2], [2.2, -.5], [-.9, .9]]) lotusFlower('lakshmi', x, PLH + .5 + .4, poolZ + z, 1);
  // the elephants: standing in the pool's corners, facing Lakshmi, trunks raised with a lotus each
  const eleMat = M.silver;
  const elephant = (side) => {
    const G = new THREE.Group(); part('lakshmi').add(G);
    const mm = m_('lakshmi', eleMat), cap = m_('lakshmi', M.coral), gd = m_('lakshmi', M.gold);
    const m = (geo, mat, pos, sc, rot) => mesh3(G, geo, mat, pos, { scale: sc, rot });
    const sph = new THREE.SphereGeometry(1, 20, 14);
    m(sph, mm, [0, 1.45, 0], [.82, .72, 1.12]);                               // body
    m(sph, mm, [0, 1.75, -.95], [.55, .55, .5]);                              // head
    for (const ex of [-1, 1]) m(sph, mm, [ex * .5, 1.75, -.78], [.08, .45, .38], [0, ex * .5, 0]);   // ears
    for (const [lx, lz] of [[-.36, .6], [.36, .6], [-.36, -.55], [.36, -.55]]) m(new THREE.CylinderGeometry(.27, .3, 1.15, 12), mm, [lx, .58, lz]);
    m(sph, cap, [0, 1.85, .05], [.72, .12, .7]);                               // caparison
    m(new THREE.BoxGeometry(1.2, .7, .9), cap, [0, 1.65, .05], [1, 1, 1]);
    const tr = new THREE.CatmullRomCurve3([V3(0, 1.55, -1.35), V3(0, 1.2, -1.6), V3(0, 1.5, -1.95), V3(0, 2.3, -2.0), V3(0, 2.9, -1.75)]);
    { const tg = new THREE.TubeGeometry(tr, 30, .2, 10); const tp = tg.attributes.position; for (let i = 0; i < tp.count; i++) { const ring = Math.floor(i / 11) / 30, c = tr.getPointAt(Math.min(1, ring)), k = 1 - .55 * ring; tp.setXYZ(i, c.x + (tp.getX(i) - c.x) * k, c.y + (tp.getY(i) - c.y) * k, c.z + (tp.getZ(i) - c.z) * k); } tg.computeVertexNormals(); m(tg, mm, [0, 0, 0]); }
    for (const ex of [-1, 1]) m(new THREE.ConeGeometry(.06, .5, 6), m_('lakshmi', M.pearl), [ex * .25, 1.45, -1.3], [1, 1, 1], [-1.9, 0, 0]);   // tusks
    m(new THREE.SphereGeometry(.12, 8, 6), gd, [0, 2.05, -1.25]);
    G.lotusAt = [0, 3.05, -1.7];
    return G;
  };
  for (const side of [-1, 1]) {
    const G = elephant(side); G.position.set(side * 2.2, PLH + .5 + .3, poolZ + .2); G.rotation.y = Math.PI + side * .9; G.scale.setScalar(.95);
    const la = G.lotusAt; const wp = V3(...la).applyEuler(G.rotation).multiplyScalar(.95).add(G.position);
    lotusFlower('lakshmi', wp.x, wp.y, wp.z, .9);
  }

  // ================= the swans: four hamsas at the deck's diagonals, facing out =================
  const swan = (a) => {
    const G = new THREE.Group(); part('swans').add(G);
    const mm = m_('swans', M.white), gd = m_('swans', M.gold), cr = m_('swans', M.coral);
    const sph = new THREE.SphereGeometry(1, 22, 16);
    mesh3(G, sph, mm, [0, 1.7, 0], { scale: [1.15, 1, 2] });                                     // body
    const neck = new THREE.CatmullRomCurve3([V3(0, 2.2, 1.4), V3(0, 3.6, 2.1), V3(0, 4.9, 1.6), V3(0, 5.6, 1.9)]);
    mesh3(G, new THREE.TubeGeometry(neck, 24, .32, 10), mm, [0, 0, 0]);
    mesh3(G, sph, mm, [0, 5.75, 2.05], { scale: [.42, .4, .58] });                               // head
    mesh3(G, new THREE.ConeGeometry(.18, .8, 10), cr, [0, 5.6, 2.75], { rot: [Math.PI / 2 + .25, 0, 0] });   // beak
    mesh3(G, new THREE.TorusGeometry(.4, .07, 6, 20), gd, [0, 5.9, 1.9], { rot: [Math.PI / 2, 0, 0] });      // a crown band
    for (const s of [-1, 1]) {                                                                   // wings, half raised, gold-tipped
      const w = new THREE.Group(); G.add(w); w.position.set(s * .9, 2.2, .2); w.rotation.set(0, 0, s * -.5);
      for (let k = 0; k < 6; k++) mesh3(w, petalGeo3(.9, 3.4 - k * .35, .2, .15), k > 3 ? gd : mm, [s * k * .22, 0, -k * .45], { rot: [-1.9 + k * .08, s * .2, s * (1.2 + k * .06)] });
    }
    for (let k = 0; k < 5; k++) mesh3(G, petalGeo3(.7, 1.8, .2, .3), k % 2 ? gd : mm, [(k - 2) * .25, 1.9, -1.8], { rot: [-2.2, (k - 2) * .25, 0] });   // tail
    mesh3(G, lathe3([[1.6, 0], [1.7, .25], [1.3, .5], [1.4, .7], [0, .72]], 24), gd, [0, 0, 0]);   // a lotus plinth
    const r = R - 3.2; G.position.set(Math.sin(a) * r, 0, Math.cos(a) * r); G.rotation.y = a; G.scale.setScalar(1.05);
    return G;
  };
  for (let i = 0; i < 4; i++) swan((i + .5) / 4 * TAU);
  P.at.swan = V3(Math.sin(TAU / 8) * (R - 3.2), 4, Math.cos(TAU / 8) * (R - 3.2));

  // ================= the wish-trees: four, between the swans, fruit of gems =================
  const fruitCols = ['coral', 'catseye', 'sapphire', 'emerald', 'pearl'];
  const fruit = fruitCols.map(k => inst('trees', new THREE.SphereGeometry(.24, 12, 8), M[k]));
  const leafI = ['#4F7F38', '#3E6A2C', '#6A9A44'].map(col => inst('trees', new THREE.IcosahedronGeometry(1, 1), std(col, .85, 0, .3, { flatShading: true })));
  for (let i = 0; i < 4; i++) {
    const a = i / 4 * TAU + (i === 0 ? .55 : 0), r = R - 7.5, x = Math.sin(a) * r, z = Math.cos(a) * r;
    add('trees', lathe3([[1.5, 0], [1.6, .9], [1.2, 1], [0, 1]], 20), M.gold2, [x, 0, z]);
    const tr = new THREE.CatmullRomCurve3([V3(x, .9, z), V3(x + .3, 2.6, z - .2), V3(x - .2, 4.2, z + .1)]);
    add('trees', new THREE.TubeGeometry(tr, 10, .28, 8), M.goldD, [0, 0, 0]);
    for (let k = 0; k < 34; k++) { const aa = k * 2.39996, el = Math.asin(-.2 + 1.1 * ((k * .618) % 1)), rr = 1.9 * Math.cos(el); put(leafI[k % 3], [x + Math.cos(aa) * rr, 4.9 + Math.sin(el) * 1.5, z + Math.sin(aa) * rr], [k, k * 2, 0], .6 + ((k * .37) % 1) * .35); }
    for (let k = 0; k < 22; k++) { const aa = k * 2.39 + .5, el = -.1 + (k % 5) * .2; put(fruit[k % 5], [x + Math.cos(aa) * 2.35 * Math.cos(el), 4.9 + Math.sin(el) * 1.7, z + Math.sin(aa) * 2.35 * Math.cos(el)]); }
    if (!P.at.tree) P.at.tree = V3(x, 4.6, z);
  }
  // the trees on the front pair would hide the stairs: they stand at the diagonals' sides (a = .55 for the first)

  // ================= the gem birds on the parapets =================
  const birdGeo = (() => {      // a small perched bird: body, head, tail, folded wings, merged
    const parts = [];
    const b = new THREE.SphereGeometry(.22, 14, 10); b.scale(.9, 1, 1.7); b.rotateX(-.75); b.translate(0, .42, 0); parts.push(b);
    const nk = new THREE.SphereGeometry(.13, 10, 8); nk.scale(1, 1.4, 1); nk.translate(0, .7, .16); parts.push(nk);
    const h = new THREE.SphereGeometry(.13, 12, 8); h.translate(0, .86, .2); parts.push(h);
    const bk = new THREE.ConeGeometry(.05, .2, 6); bk.rotateX(Math.PI / 2 + .5); bk.translate(0, .82, .36); parts.push(bk);
    const cr = new THREE.ConeGeometry(.04, .2, 4); cr.rotateX(-.4); cr.translate(0, 1.02, .16); parts.push(cr);
    const tl = new THREE.ConeGeometry(.1, 1.1, 4); tl.scale(1.6, 1, .35); tl.rotateX(-Math.PI / 2 + .75); tl.translate(0, .02, -.5); parts.push(tl);
    for (const s of [-1, 1]) { const wg = new THREE.SphereGeometry(.18, 10, 6); wg.scale(.25, .8, 1.6); wg.rotateX(-.75); wg.translate(s * .17, .45, -.05); parts.push(wg); }
    const lg = new THREE.CylinderGeometry(.025, .025, .22, 4); lg.translate(0, .1, .05); parts.push(lg);
    const merge = THREE.mergeGeometries || (THREE.BufferGeometryUtils && THREE.BufferGeometryUtils.mergeGeometries); return merge ? merge(parts.map(g => g.toNonIndexed())) : b;
  })();
  const birdM = ['silver', 'coral', 'catseye'].map(k => inst('birds', birdGeo, M[k]));
  (P.birdSpots || []).forEach(([x, yy, z, yaw], i) => put(birdM[i % 3], [x, yy, z], [0, yaw, 0], 1.25));
  if (P.birdSpots && P.birdSpots.length) P.at.bird = V3(...P.birdSpots[0].slice(0, 3));

  // ================= build the instanced meshes =================
  for (const r of INST) {
    if (!r.list.length) continue;
    const im = new THREE.InstancedMesh(r.geo, m_(r.name, r.mat), r.list.length);
    r.list.forEach((m, i) => im.setMatrixAt(i, m)); im.castShadow = true; im.receiveShadow = true; part(r.name).add(im); r.mesh = im;
  }
  // the bells: their own instanced mesh, swung each frame
  const bellIM = new THREE.InstancedMesh(bellGeo, m_('bells', M.gold), P.bells.length); bellIM.castShadow = true; part('bells').add(bellIM);
  P.at.bell = P.bells.length ? P.bells[0].p.clone() : V3();
  P.at.pearl = V3(-3.3, PLH + 5, (TIERS[0].w / 2 - .7) + zc);
  P.at.arch = V3(-3.3, PLH + 8.5, (TIERS[0].w / 2 - .7) + zc);
  P.at.pillar = V3(-6.5, PLH + 4, (TIERS[0].w / 2 - .7) + zc);
  P.dims = { R, top: TOP_Y, bottom: -25, plinth: PLH };

  // ================= P.set: build-in, bells, flags, scales, light =================
  const ORDER = ['hull', 'deck', 'horses', 'serpents', 'tower', 'walls', 'pillars', 'arches', 'pearls', 'stairs', 'lakshmi', 'birds', 'swans', 'bells', 'flags', 'trees', 'top'];
  const rise = { hull: -6, deck: 3, horses: 3, serpents: -3, tower: 6, walls: 4, pillars: 5, arches: 4, pearls: 3, stairs: 2, lakshmi: 3, birds: 4, swans: 4, bells: 3, flags: 4, trees: 3, top: 8 };
  const qb = new THREE.Quaternion(), eb = new THREE.Euler(), sb = V3(1, 1, 1), pb = V3();
  P.set = (t, so = {}) => {
    const B = so.build || {};
    for (const k of ORDER) {
      const g = PARTS[k]; if (!g) continue;
      const v = clamp(B[k] ?? 1), e = 1 - Math.pow(1 - v, 3);
      g.visible = v > .001; g.position.y = (1 - e) * rise[k];
      for (const m of mats[k].values()) { const tr = v < .999; if (m.transparent !== tr) { m.transparent = tr; m.needsUpdate = true; } m.opacity = clamp(v * 1.4); m.depthWrite = v > .6; }
      if (k === 'serpents') g.children.forEach(m => { if (m.material && m.material.transparent !== undefined && P.scales.includes(m.material.map)) { m.material.transparent = v < .999; m.material.opacity = clamp(v * 1.4); } });
      if (k === 'walls') g.children.forEach(m => { m.material.transparent = v < .999; m.material.opacity = clamp(v * 1.4); });
    }
    // bells swing in the wind
    const wind = so.wind ?? .6;
    P.bells.forEach((b, i) => { const a = wind * (.18 * Math.sin(t * 2.3 + b.ph) + .06 * Math.sin(t * 5.1 + b.ph * 2)); eb.set(a, 0, a * .6); qb.setFromEuler(eb); pb.copy(b.p); M4.compose(pb, qb, sb); bellIM.setMatrixAt(i, M4); });
    bellIM.instanceMatrix.needsUpdate = true;
    // flags ripple
    for (const f of flags) { const a = f.g.attributes.position.array; for (let i = 0; i < a.length; i += 3) { const x = f.base[i]; a[i + 2] = f.base[i + 2] + Math.sin(x * 2.2 - t * 6 * (.5 + wind)) * .18 * (x / f.w) * (.3 + wind); a[i + 1] = f.base[i + 1] - .12 * (x / f.w) * (1 - wind); } f.g.attributes.position.needsUpdate = true; }
    // the serpents' jewels glide along their bodies
    P.scales.forEach((tx, i) => { tx.offset.x = (i ? 1 : -1) * t * .02; });
    // the windows' light, the lotus's glow
    const lit = so.lit ?? .35; (P.jali || []).forEach(m => m.emissiveIntensity = lit * 1.2);
    P.under.material.opacity = (so.glow ?? .25) * .5;
  };
  P.set(0);
  return P;
}

// ---------- the world round it: an ocean at golden hour, clouds, a far coast ----------
// pkWorld3(): { scene, sun, hemi, sea, clouds, set(t, o) }. Lit by the 'evening' HDRI (src/data/hdri_evening.js) with
// a warm low sun; the sea reflects the sky. o: { sunK, exposure, seaY, clouds (0..1), fog }
function pkWorld3() {
  const scene = new THREE.Scene();
  const E = env3(scene, 'evening', { bg: true, k: .9, rot: 0 });
  const hemi = new THREE.HemisphereLight('#B8C8E8', '#5A4636', .35); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#FFC890', 3.2); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 260 }); sun.shadow.bias = -.0004; sun.shadow.normalBias = .05; sun.shadow.radius = 2;
  scene.add(sun, sun.target);
  scene.fog = new THREE.FogExp2('#C9A890', .00011);
  // the sea: a huge plane with moving normals, reflecting the sky
  const nrm = tex3('pk_seanrm', 512, 512, (g, w, h) => {
    const img = g.createImageData(w, h), d = img.data;
    const f = (x, y) => Math.sin(x * .07 + Math.sin(y * .05) * 2) + Math.sin(y * .11 + x * .03) * .7 + Math.sin((x + y) * .19) * .35 + Math.sin((x * .9 - y) * .31) * .2;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const dx = f(x + 1, y) - f(x - 1, y), dy = f(x, y + 1) - f(x, y - 1), i = (y * w + x) * 4; d[i] = 128 + dx * 40; d[i + 1] = 128 + dy * 40; d[i + 2] = 255; d[i + 3] = 255; }
    g.putImageData(img, 0, 0);
  }, { data: true });
  nrm.repeat.set(900, 900);
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(60000, 60000), new THREE.MeshStandardMaterial({ color: '#21414E', roughness: .14, metalness: .1, normalMap: nrm, normalScale: new THREE.Vector2(.22, .22), envMapIntensity: 1 }));
  sea.rotation.x = -Math.PI / 2; sea.receiveShadow = false; scene.add(sea);
  // clouds: soft billboards (a few big banks and drifting wisps)
  const cloudTex = tex3('pk_cloud', 256, 256, (g, w, h) => {
    let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 46; i++) { const x = 40 + rnd() * 176, y = 90 + rnd() * 90 - (Math.abs(x - 128) / 128) * 30, r = 20 + rnd() * 46; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
  });
  const clouds = new THREE.Group(); scene.add(clouds);
  let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 70; i++) {
    const m = new THREE.SpriteMaterial({ map: cloudTex, color: '#FFE6CC', transparent: true, opacity: .8, depthWrite: false, fog: true });
    const sp = new THREE.Sprite(m); const a = rnd() * TAU, r = 260 + rnd() * 2600;
    sp.position.set(Math.cos(a) * r, 40 + rnd() * 220, Math.sin(a) * r); const k = 180 + rnd() * 420; sp.scale.set(k, k * .45, 1); sp.userData = { o: .55 + rnd() * .4, d: rnd() };
    clouds.add(sp);
  }
  // the sun's direction matches the HDRI's sun (found once from its brightest texel; else a low west-north-west)
  const SUN0 = V3(.7685, .1619, .619).normalize(), sunDir = SUN0.clone();
  const set = (t, o = {}) => {
    env3(scene, 'evening', { bg: true, k: o.envK ?? .9, rot: o.rot ?? 0, bgK: o.bgK ?? 1 });
    sun.intensity = o.sunK ?? 3.2; sun.color.set(o.sunCol ?? '#FFC890');
    sunDir.copy(SUN0).applyAxisAngle(V3(0, 1, 0), o.rot ?? 0);
    const c = o.center || [0, 0, 0];
    sun.position.set(c[0] + sunDir.x * 150, c[1] + sunDir.y * 150 + 20, c[2] + sunDir.z * 150); sun.target.position.set(...c);
    hemi.intensity = o.hemi ?? .35;
    sea.position.y = o.seaY ?? -420; sea.visible = o.sea ?? true;
    nrm.offset.set(t * .004, t * .0025);
    scene.fog.density = o.fog ?? .00011;
    clouds.visible = (o.clouds ?? 1) > 0;
    clouds.children.forEach((sp) => { sp.material.opacity = sp.userData.o * (o.clouds ?? 1); sp.position.x += 0; });
    clouds.position.set(o.cloudX ?? 0, o.cloudY ?? 0, o.cloudZ ?? 0);
    return o.exposure ?? 1;
  };
  return { scene, sun, hemi, sea, clouds, sunDir, set };
}

// ---------- Ravana's palace: "half a yojana wide, a yojana long" (Sundara 5.9.2), the Pushpak in its middle (5.8.1) ----------
// pkPalace3(scene, o) → group. o.yojana: metres a yojana is drawn at (12000; the reel never states it in km). The compound
// runs along z (long) and x (half as wide), centred on the origin: a gold-topped wall, a grid of streets, thousands of
// mansions with gold roofs and domes, gardens and tanks, a great court in the middle (400 m) for the Pushpak, the tallest
// halls round it. A ground of fields and a far shore. .corners (the wall's four corners at y 0, for the 2D outline),
// .court (the court's centre).
function pkPalace3(scene, o = {}) {
  const G = new THREE.Group(); scene.add(G);
  const Y = o.yojana ?? 12000, LX = Y / 2, LZ = Y, COURT = 200;
  let sd = 3; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  // the ground: fields round the compound, the compound's paving and gardens (a canvas texture over the wall's area)
  const fields = tex3('pk_fields', 512, 512, (g, w, h) => { g.fillStyle = '#5E7A3A'; g.fillRect(0, 0, w, h); for (let i = 0; i < 260; i++) { g.fillStyle = ['#6C8A44', '#7A8A4A', '#4E6A30', '#8A8A52', '#5A7438'][i % 5]; g.fillRect(rnd() * w, rnd() * h, 20 + rnd() * 60, 14 + rnd() * 50); } });
  fields.repeat.set(90, 90);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(60000, 96), new THREE.MeshStandardMaterial({ map: fields, roughness: .95 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -1; ground.receiveShadow = true; G.add(ground);
  const pave = tex3('pk_pave', 1024, 2048, (g, w, h) => {
    g.fillStyle = '#9C8668'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { g.fillStyle = rnd() < .75 ? '#56743A' : '#3E6E7A'; const x = rnd() * w, y = rnd() * h; g.beginPath(); g.ellipse(x, y, 10 + rnd() * 30, 10 + rnd() * 30, 0, 0, TAU); g.fill(); }
    g.strokeStyle = '#E2D2B0'; g.lineWidth = 3; for (let x = 0; x < w; x += w / 20) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += h / 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  });
  const yard = new THREE.Mesh(new THREE.PlaneGeometry(LX, LZ), new THREE.MeshStandardMaterial({ map: pave, roughness: .9 }));
  yard.rotation.x = -Math.PI / 2; yard.position.y = -.4; yard.receiveShadow = true; G.add(yard);
  // the wall: gold-coped, with towers every 600 m
  const wallM = new THREE.MeshStandardMaterial({ color: '#D8C49A', roughness: .85 }), capM = new THREE.MeshStandardMaterial({ color: '#D9A84E', roughness: .5, metalness: .5 });
  for (const [x, z, w, d] of [[0, -LZ / 2, LX, 14], [0, LZ / 2, LX, 14], [-LX / 2, 0, 14, LZ], [LX / 2, 0, 14, LZ]]) { block3(G, w, 34, d, wallM, [x, 0, z]); block3(G, w + 4, 3, d + 4, capM, [x, 34, z]); }
  // mansions: instanced bodies (tinted per instance) and gold roofs (pyramids and domes)
  const body = new THREE.BoxGeometry(1, 1, 1); body.translate(0, .5, 0);
  const pyr = new THREE.ConeGeometry(.75, 1, 4); pyr.rotateY(Math.PI / 4); pyr.translate(0, .5, 0);
  const dome = new THREE.SphereGeometry(.5, 12, 8, 0, TAU, 0, Math.PI / 2);
  const L = { body: [], pyr: [], dome: [] };
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion();
  const house = (x, z, w, d, h) => {
    L.body.push([x, 0, z, w, h, d]);
    if (rnd() < .55) L.pyr.push([x, h, z, w * .95, Math.min(w, d) * (.5 + rnd() * .5), d * .95]); else L.dome.push([x, h, z, Math.min(w, d) * .8, Math.min(w, d) * .7, Math.min(w, d) * .8]);
    if (h > 40 && rnd() < .6) { const h2 = h * (.3 + rnd() * .3), w2 = w * .55; L.body.push([x, h, z, w2, h2, w2]); L.dome.push([x, h + h2, z, w2 * .9, w2 * .8, w2 * .9]); }
  };
  const CELL = 70;
  for (let x = -LX / 2 + 60; x < LX / 2 - 60; x += CELL) for (let z = -LZ / 2 + 60; z < LZ / 2 - 60; z += CELL) {
    if (Math.abs(x) < COURT + 30 && Math.abs(z) < COURT + 30) continue;          // the great court
    if (((x + LX) / CELL | 0) % 6 === 0 || ((z + LZ) / CELL | 0) % 6 === 0) continue;   // the avenues
    if (rnd() < .12) continue;                                                   // gardens
    const near = Math.max(0, 1 - Math.hypot(x, z * .6) / 2400);                 // taller toward the middle
    const w = 40 + rnd() * 26, d = 40 + rnd() * 26, h = 22 + rnd() * 40 + near * (60 + rnd() * 110);
    house(x + (rnd() - .5) * 14, z + (rnd() - .5) * 14, w, d, h);
  }
  // the halls round the court: tall, close, gold
  for (let i = 0; i < 28; i++) { const a = i / 28 * TAU, r = COURT + 70 + (i % 2) * 50; house(Math.cos(a) * r, Math.sin(a) * r, 60, 60, 110 + (i % 3) * 40); }
  for (let i = 0; i < 40; i++) { const a = rnd() * TAU, r = 700 + rnd() * 1600; house(Math.cos(a) * r * .5, Math.sin(a) * r, 70, 70, 160 + rnd() * 120); }
  const tints = ['#F2E8D2', '#E8D6B0', '#FFF6E6', '#D9C29A', '#EED9B6', '#F0C9A0'];
  const build = (geo, list, mat, tint) => {
    const im = new THREE.InstancedMesh(geo, mat, list.length); const col = new THREE.Color();
    list.forEach(([x, y, z, sx, sy, sz], i) => { M4.compose(V3(x, y, z), Q, V3(sx, sy, sz)); im.setMatrixAt(i, M4); if (tint) im.setColorAt(i, col.set(tints[i % tints.length])); });
    im.castShadow = true; im.receiveShadow = true; G.add(im); return im;
  };
  build(body, L.body, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .85 }), true);
  build(pyr, L.pyr, new THREE.MeshStandardMaterial({ color: '#D9A84E', roughness: .5, metalness: .45 }));
  build(dome, L.dome, new THREE.MeshStandardMaterial({ color: '#E3B356', roughness: .45, metalness: .5 }));
  // the court: polished stone
  const court = new THREE.Mesh(new THREE.PlaneGeometry(COURT * 2, COURT * 2), new THREE.MeshStandardMaterial({ map: pkFloorTex(), color: '#B8A890', roughness: .6 }));
  court.rotation.x = -Math.PI / 2; court.position.y = -.2; court.receiveShadow = true; G.add(court);
  G.corners = [[-LX / 2, 0, -LZ / 2], [LX / 2, 0, -LZ / 2], [LX / 2, 0, LZ / 2], [-LX / 2, 0, LZ / 2]].map(p => V3(...p));
  G.court = V3(0, 0, 0); G.size = [LX, LZ];
  return G;
}

// ---------- the army: monkeys, bears and rakshasas who climb aboard (Yuddha 6.122.24–27) ----------
// pkCrowd3(parent, n) → { set(t, f(i) → { pos [x, y, z], yaw, sit 0..1, a 0..1 } ) }: instanced figures (a body, a head,
// a tail for the monkeys), drawn ~1.4–1.9 m tall; kind = i % 5 (0–2 monkeys, 3 bears, 4 rakshasas).
function pkCrowd3(parent, n = 900) {
  const merge = THREE.mergeGeometries;
  const fig = (tail, k) => {
    const b = new THREE.CapsuleGeometry(.26 * k, .5 * k, 4, 8); b.translate(0, .55 * k, 0);
    const h = new THREE.SphereGeometry(.2 * k, 10, 8); h.translate(0, 1.1 * k, .02);
    const parts = [b.toNonIndexed(), h.toNonIndexed()];
    if (tail) { const t = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(0, .45, -.2), V3(0, .3, -.55), V3(0, .7, -.8), V3(0, 1.0, -.7)]), 10, .05, 5); parts.push(t.toNonIndexed()); }
    return merge(parts);
  };
  const kinds = [[fig(true, 1.1), '#8A5A32'], [fig(false, 1.35), '#2A2420'], [fig(false, 1.35), '#5A2A2A']];
  const groups = kinds.map(([g, col]) => { const im = new THREE.InstancedMesh(g, new THREE.MeshStandardMaterial({ color: col, roughness: .9 }), n); im.castShadow = true; im.count = 0; parent.add(im); return im; });
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), S = V3();
  return {
    groups,
    set(t, f) {
      const cnt = [0, 0, 0];
      for (let i = 0; i < n; i++) {
        const s = f(i); if (!s || s.a <= 0) continue;
        const k = i % 5 < 3 ? 0 : i % 5 === 3 ? 1 : 2, im = groups[k];
        E.set(0, s.yaw || 0, 0); Q.setFromEuler(E); const sc = (s.scale ?? 1) * Math.min(1, s.a * 1.5); S.set(sc, sc * (1 - .35 * (s.sit || 0)), sc);
        M4.compose(V3(...s.pos), Q, S); im.setMatrixAt(cnt[k]++, M4);
      }
      groups.forEach((im, k) => { im.count = cnt[k]; im.instanceMatrix.needsUpdate = true; });
    },
  };
}
