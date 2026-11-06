// lokas_sets.js: the sets of "7 worlds below your feet" (ad 79), in the 3D film look, matte (owner, 30 Oct).
//   column3()  the earth as a slice of a column floating in the dark: grass, trees and a small temple on top; under it
//              the seven worlds (Bhagavata 5.24) as caverns stacked down the column, a quarter cut away (a cake with a
//              slice taken out) so the camera can look and fly into each. Each cavern has its own light and its own set:
//     atal     a violet crystal and 96 glyphs of light in three rings (Bala's 96 kinds of magic), mirage pavilions
//     vital    a black Shiva linga beside a river of molten gold (Hatakeshvara), lamps
//     sutal    King Bali's palace, its door lit; Vishnu as a figure of blue light at the door, a gold mace in his hand
//     talatal  Maya's three floating cities: towers rise (the architect), burn (Tripurari), and calm again
//     mahatal  many-hooded serpents (naga3); Garuda's shadow sweeps over and they flinch
//     rasatal  pits in the floor with red eyes and spear tips, a dark fortress; Indra's flash and they duck
//     patal    Vasuki and the Nagas, a jewel on every hood, palaces; the jewels light the dark
//   shesha3()  Ananta Shesha in the cosmic dark: a coiled body and a canopy of hoods (rows of them, more lost in the haze),
//              the universe as a golden egg on one hood (the column, seen from far, inside it)
// Units: metres-ish (the column is 20 wide); y up; the cut faces the camera (+z).

const MERGE3 = (THREE.BufferGeometryUtils || THREE).mergeGeometries;
const LK = { R: 10, RI: 9.2, CH: 4.6, SL: 2.4, TOP: 4, CUT0: Math.PI / 4, CUTL: Math.PI * 1.5 };
LK.ceil = i => -LK.TOP - i * (LK.CH + LK.SL);
LK.floor = i => LK.ceil(i) - LK.CH;
LK.mid = i => LK.ceil(i) - LK.CH / 2;
LK.BOT = LK.floor(6) - LK.SL;
const WORLDS = [
  { key: 'atal', name: 'ATAL', dev: 'अतल', col: '#A47CFF', lo: '#21123F', wall: '#6A5A8A', floor: '#5E5276', fill: '#FFB0F0' },
  { key: 'vital', name: 'VITAL', dev: 'वितल', col: '#FFB040', lo: '#2E1A06', wall: '#7A6448', floor: '#6E5E48', fill: '#FFD9A0' },
  { key: 'sutal', name: 'SUTAL', dev: 'सुतल', col: '#7DB2FF', lo: '#0C1A3C', wall: '#68748E', floor: '#9AA0B0', fill: '#FFE6BC' },
  { key: 'talatal', name: 'TALATAL', dev: 'तलातल', col: '#FF7A34', lo: '#341006', wall: '#7A5442', floor: '#6E5040', fill: '#FFC890' },
  { key: 'mahatal', name: 'MAHATAL', dev: 'महातल', col: '#4ED69A', lo: '#06281A', wall: '#4E6A5C', floor: '#4E6658', fill: '#C8FFE0' },
  { key: 'rasatal', name: 'RASATAL', dev: 'रसातल', col: '#FF3A30', lo: '#300406', wall: '#5E4040', floor: '#4E3836', fill: '#FF9070' },
  { key: 'patal', name: 'PATAL', dev: 'पाताल', col: '#40E0D0', lo: '#042A30', wall: '#4A6E72', floor: '#3E6468', fill: '#FFE0A0' },
];
// a point in a cavern by polar position: angle th (0 = toward the camera, PI = the back), radius r, height above its floor
const polar = (i, th, r, h = 0) => [r * Math.sin(th), LK.floor(i) + h, r * Math.cos(th)];

// ---------- materials ----------
const strataTex3 = () => tex3('strata', 512, 1024, (g, w, h) => {
  const r = lcg(79), cols = ['#5A4636', '#6E5640', '#4A3A2E', '#7A6448', '#56463A', '#3E3229', '#665040'];
  let y = 0; while (y < h) { const bh = 14 + r() * 60; g.fillStyle = cols[Math.floor(r() * cols.length)]; g.fillRect(0, y, w, bh + 1); y += bh; }
  for (let i = 0; i < 160; i++) { const yy = r() * h; g.strokeStyle = `rgba(${r() < .5 ? '20,14,10' : '150,130,110'},${.12 + r() * .2})`; g.lineWidth = 1 + r() * 3; g.beginPath(); g.moveTo(0, yy); for (let x = 0; x <= w; x += 32) g.lineTo(x, yy + Math.sin(x * .02 + i) * 4 + (r() - .5) * 3); g.stroke(); }
  for (let i = 0; i < 9000; i++) { g.fillStyle = r() < .6 ? 'rgba(0,0,0,.25)' : 'rgba(220,200,170,.12)'; g.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2); }
});
const grassTex3 = () => tex3('grass', 512, 512, (g, w, h) => {
  g.fillStyle = '#3E6A2C'; g.fillRect(0, 0, w, h); const r = lcg(5);
  for (let i = 0; i < 90; i++) { const x = r() * w, y = r() * h, rr = 30 + r() * 90, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, r() < .5 ? 'rgba(90,130,50,.35)' : 'rgba(30,60,24,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
  for (let i = 0; i < 20000; i++) { g.fillStyle = r() < .5 ? 'rgba(20,40,14,.3)' : 'rgba(140,180,80,.18)'; g.fillRect(r() * w, r() * h, 1, 2 + r() * 2); }
});
const rockM3 = (tint, rep) => { const m = pbr3('cliff', { rep, tint, normalK: 1.2, env: .3 }); return m; };
// the cut faces: the strata picture over the cliff's relief
const cutM3 = (rep) => { const m = pbr3('cliff', { rep, tint: '#FFFFFF', normalK: 1.1, env: .25 }); m.map = strataTex3().rep(rep[0] * .35, rep[1] * .35); m.map.colorSpace = THREE.SRGBColorSpace; return m; };

// a vertical cut face from the axis (or radius r0) out to r1, at angle th, from y0 to y1
function cutFace3(parent, th, r0, r1, y0, y1, mat) {
  const g = new THREE.PlaneGeometry(r1 - r0, y1 - y0), m = mesh3(parent, g, mat, [((r0 + r1) / 2) * Math.sin(th), (y0 + y1) / 2, ((r0 + r1) / 2) * Math.cos(th)], { rot: [0, th - Math.PI / 2, 0] });
  m.material.side = THREE.DoubleSide; return m;
}
// a sector of a cylinder (walls, slabs); o.cap: false for open walls; o.inside: seen from inside (BackSide); o.rough:
// displace the wall radially (rock), o.segs
function sector3(parent, r, h, y, mats, o = {}) {
  const g = new THREE.CylinderGeometry(r, r, h, o.segs ?? 120, o.hs ?? 1, o.cap === false, LK.CUT0, LK.CUTL);
  if (o.rough) {
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), yy = p.getY(i), z = p.getZ(i), rr = Math.hypot(x, z); if (rr < r * .98) continue;
      const a = Math.atan2(x, z), edge = Math.min(Math.abs(a - LK.CUT0 + (a < 0 ? TAU : 0)), Math.abs(LK.CUT0 + LK.CUTL - (a < 0 ? a + TAU : a)));
      const k = smooth01(edge / .12), d = o.rough * (fbm3(a * 6, yy * .7 + y, o.seed ?? 1, 4) + .35) * k, f = (rr + (o.inside ? d : -d)) / rr;
      p.setXYZ(i, x * f, yy, z * f);
    }
    g.computeVertexNormals();
  }
  const m = mesh3(parent, g, mats, [0, y, 0]);
  if (o.inside) (Array.isArray(mats) ? mats : [mats]).forEach(mm => mm.side = THREE.BackSide);
  return m;
}

// ---------- buildings (Maya's cities) ----------
// palace3(parent, o): a row of palaces along an arc at the back of a cavern. o: i (the cavern), th0..th1 (arc), r, seed,
// stone, trim, win (window glow), tall (height scale). Merged into a few meshes.
function palace3(parent, o) {
  const rnd = lcg(o.seed ?? 3), body = [], trim = [], win = [], fy = LK.floor(o.i), n = o.n ?? 9;
  const add = (arr, geo, x, y, z, ry, sx = 1, sy = 1, sz = 1) => { const m = new THREE.Matrix4().compose(V3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)), V3(sx, sy, sz)); const g = geo.clone(); g.applyMatrix4(m); arr.push(g); };
  const BOX = new THREE.BoxGeometry(1, 1, 1), DOME = new THREE.SphereGeometry(.5, 20, 10, 0, TAU, 0, Math.PI / 2), SPIRE = new THREE.ConeGeometry(.5, 1, 12), CYL = new THREE.CylinderGeometry(.5, .5, 1, 12);
  for (let k = 0; k < n; k++) {
    const th = lerp(o.th0 ?? Math.PI - 1.1, o.th1 ?? Math.PI + 1.1, (k + .5) / n) + (rnd() - .5) * .05, r = (o.r ?? 7.6) + (rnd() - .5) * .6;
    const x = r * Math.sin(th), z = r * Math.cos(th), ry = th, tall = (o.tall ?? 1) * (k % 2 ? .75 : 1) * (.8 + rnd() * .5);
    const w = .9 + rnd() * .6, h = (1.1 + rnd() * .9) * tall, d = .8 + rnd() * .4;
    add(body, BOX, x, fy + h / 2, z, ry, w, h, d);
    add(trim, BOX, x, fy + h + .05, z, ry, w + .12, .1, d + .12);
    add(trim, BOX, x, fy + .08, z, ry, w + .2, .16, d + .2);
    // a tower on top: a drum and a dome, or a spire
    const th2 = .35 + rnd() * .5;
    add(body, CYL, x, fy + h + .1 + th2 / 2, z, ry, w * .55, th2, w * .55);
    if (rnd() < .6) add(trim, DOME, x, fy + h + .1 + th2, z, ry, w * .62, w * .7, w * .62); else add(trim, SPIRE, x, fy + h + .1 + th2 + .45, z, ry, w * .5, .9, w * .5);
    // windows: small glowing panes on the face toward the axis
    const cols = Math.max(1, Math.round(w / .32)), rows = Math.max(1, Math.round(h / .45));
    for (let a = 0; a < rows; a++) for (let b = 0; b < cols; b++) {
      if (rnd() < .25) continue;
      const lx = (b - (cols - 1) / 2) * w / cols, ly = fy + .35 + a * (h - .4) / rows, inward = -d / 2 - .01;
      add(win, BOX, x + Math.cos(ry) * lx + Math.sin(ry) * inward, ly, z - Math.sin(ry) * lx + Math.cos(ry) * inward, ry, .12, .2, .02);
    }
  }
  const G = new THREE.Group(); parent.add(G);
  mesh3(G, MERGE3(body), o.stone || std3('#8A7E70', .8));
  mesh3(G, MERGE3(trim), o.trimM || std3(o.trim || '#B89A60', .55, { metalness: .3 }));
  const winM = new THREE.MeshBasicMaterial({ color: o.win || '#FFC070', fog: false });
  G.win = mesh3(G, MERGE3(win), winM, [0, 0, 0], { cast: false, receive: false }); G.winM = winM;
  return G;
}

// ---------- a serpent with many hoods ----------
// naga3(parent, o): a coiled body on the ground, a trunk rising from it, and a fan of hoods at its top (the way temple
// images show Shesha and the Naga kings: the hoods close together, overlapping, each with its head on top).
//   o.rings [[n, R (the fan's radius), size (hood width), arc (radians), back (z), tilt], ...] rows of hoods, front first
//   o.body, o.face (hood front), o.mark (spectacle mark), o.coil [r, turns, thick], o.stack, o.trunk (height), o.jewel
// .set(t, { sway, flinch 0..1, jewel 0..1 }). Origin at the coil's centre; the hoods face +z.
const HOOD_GEO = (() => {
  // a flat shield with a rounded bevel: narrow at the throat, widest just above the middle, rounding over to the head
  const sh = new THREE.Shape();
  sh.moveTo(0, -.6); sh.bezierCurveTo(.1, -.6, .12, -.42, .3, -.22); sh.bezierCurveTo(.48, -.02, .54, .14, .5, .28);
  sh.bezierCurveTo(.44, .46, .26, .56, .16, .58); sh.bezierCurveTo(.08, .6, -.08, .6, -.16, .58);
  sh.bezierCurveTo(-.26, .56, -.44, .46, -.5, .28); sh.bezierCurveTo(-.54, .14, -.48, -.02, -.3, -.22); sh.bezierCurveTo(-.12, -.42, -.1, -.6, 0, -.6);
  const g = new THREE.ExtrudeGeometry(sh, { depth: .04, bevelEnabled: true, bevelThickness: .035, bevelSize: .035, bevelSegments: 4, curveSegments: 28 });
  g.translate(0, 0, -.02);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, p.getZ(i) + .14 * x * x); uv.setXY(i, x + .5, (y + .6) / 1.2); }
  g.computeVertexNormals(); return g;
})()
const HEAD_GEO = (() => {
  const g = new THREE.SphereGeometry(1, 28, 20), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { let x = p.getX(i), y = p.getY(i), z = p.getZ(i); const f = clamp((z + 1) / 2), tp = 1 - .38 * Math.pow(f, 1.6); p.setXYZ(i, x * .15 * tp, y * (y > 0 ? .085 : .06) * tp + (y > 0 ? .01 * Math.sin(Math.PI * f) : 0), z * .24); }
  g.computeVertexNormals(); return g;
})();
const hoodFaceTex3 = (face, mark) => tex3('hoodF' + face + mark, 256, 256, (g, w, h) => {
  g.fillStyle = face; g.fillRect(0, 0, w, h);
  // the scutes across, a darker rim, the spectacle mark on the upper half
  for (let y = 0; y < h; y += 12) { g.fillStyle = 'rgba(0,0,0,.1)'; g.fillRect(0, y, w, 2); }
  const gr = g.createRadialGradient(w / 2, h * .55, w * .2, w / 2, h * .55, w * .62); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, rgba(mark, .75)); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  const bl = g.createLinearGradient(w * .3, 0, w * .7, 0); bl.addColorStop(0, 'rgba(255,255,255,0)'); bl.addColorStop(.5, 'rgba(255,250,230,.22)'); bl.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = bl; g.fillRect(0, 0, w, h);
  g.strokeStyle = rgba(mark, .9); g.lineWidth = 6; g.beginPath(); g.ellipse(w / 2, h * .5, w * .47, h * .47, 0, 0, TAU); g.stroke();
});
function naga3(parent, o = {}) {
  const G = new THREE.Group(); parent.add(G);
  const scM = new THREE.MeshStandardMaterial({ color: o.body || '#2E3A2A', map: cobraScaleTex3(false).rep(40, 4), bumpMap: cobraScaleTex3(true).rep(40, 4), bumpScale: .6, roughness: .55, envMapIntensity: .4 });
  const faceM = new THREE.MeshStandardMaterial({ color: '#FFFFFF', map: hoodFaceTex3(o.face || '#D8C89A', o.mark || '#2A2018'), roughness: .6 });
  const backM = new THREE.MeshStandardMaterial({ color: o.body || '#2E3A2A', map: cobraScaleTex3(false).rep(6, 6), bumpMap: cobraScaleTex3(true).rep(6, 6), bumpScale: .6, roughness: .55 });
  const headM = new THREE.MeshStandardMaterial({ color: o.head || o.body || '#2E3A2A', map: cobraScaleTex3(false).rep(4, 2), roughness: .45, envMapIntensity: .5 });
  const eyeM = new THREE.MeshStandardMaterial({ color: o.eye || '#E8B030', emissive: o.eye || '#E8B030', emissiveIntensity: .25, roughness: .2 }), pupM = std3('#050302', .2);
  const [cr, turns, thick] = o.coil || [1, 2.2, .22], trunkH = o.trunk ?? 1.4;
  // the coil: a spiral, outside in (rising if o.stack), then up into the trunk
  const cpts = []; for (let i = 0; i <= 70; i++) { const k = i / 70, a = k * turns * TAU, r = lerp(cr, cr * .32, k); cpts.push([r * Math.cos(a), thick * (1 + 2.7 * k * (o.stack ?? 0)), r * Math.sin(a)]); }
  const c1 = cpts[cpts.length - 1];
  cpts.push([c1[0] * .5, c1[1] + trunkH * .3, c1[2] * .5], [0, trunkH * .7, 0], [0, trunkH, -thick * .2]);
  tubeP3(G, cpts, [thick * .4, thick * 1.05], scM, { segs: 300, radial: 18 });
  const heads = [], jewels = [], col = o.jewel || '#FF4060';
  const top = V3(0, trunkH, 0);
  for (const [n, R, size, arc, back = 0, tilt = .75] of o.rings || [[1, .6, .6, 0]]) {
    for (let k = 0; k < n; k++) {
      const a = n === 1 ? 0 : lerp(-arc / 2, arc / 2, k / (n - 1));
      const c = V3(R * Math.sin(a), R * Math.cos(a) * .92, back);
      const N = new THREE.Group(); N.position.copy(top); G.add(N);
      // the neck: from the trunk's top to the hood's throat
      const base = c.clone().add(V3(Math.sin(a * tilt) * size * .5, -Math.cos(a * tilt) * size * .5, 0));
      tubeP3(N, [[0, 0, 0], [base.x * .5, base.y * .55, base.z * .5 + size * .15], [base.x, base.y, base.z + size * .05]], [Math.min(thick * .7, size * .2), size * .2], scM, { segs: 16, radial: 12 });
      const H = new THREE.Group(); H.position.copy(c); H.rotation.set(-.12, 0, -a * tilt); N.add(H);
      mesh3(H, HOOD_GEO, [faceM, backM], [0, 0, 0], { scale: size });
      // the head on top of the hood, looking forward and a touch down; the eyes
      const hd = new THREE.Group(); hd.position.set(0, size * .58, size * .06); hd.rotation.x = .3; H.add(hd);
      mesh3(hd, HEAD_GEO, headM, [0, 0, size * .08], { scale: size * 1.6 });
      for (const s of [-1, 1]) { mesh3(hd, new THREE.SphereGeometry(size * .042, 12, 8), eyeM, [s * size * .165, size * .06, size * .16]); mesh3(hd, new THREE.SphereGeometry(size * .022, 8, 6), pupM, [s * size * .195, size * .065, size * .17]); }
      const j = glow3(H, [0, size * .3, size * .06], size * .55, col, 1), jc = glow3(H, [0, size * .3, size * .07], size * .14, '#FFFFFF', 1);
      N.userData = { a, ph: k * 1.7 + n };
      heads.push(N); jewels.push(j, jc);
    }
  }
  G.heads = heads; G.jewels = jewels;
  G.set = (t, s = {}) => {
    const sw = s.sway ?? 1, fl = s.flinch ?? 0, jw = s.jewel ?? 1;
    heads.forEach(N => { const u = N.userData; N.rotation.set(.04 * Math.sin(t * .9 + u.ph) * sw - .45 * fl, .05 * Math.sin(t * .7 + u.ph * 1.3) * sw, .03 * Math.sin(t * .8 + u.ph) * sw); N.scale.setScalar(1 - .1 * fl); });
    jewels.forEach((j, i) => { j.material.opacity = jw * (i % 2 ? 1 : .75 + .25 * Math.sin(t * 2 + i)); });
  };
  G.set(0);
  return G;
}

// ======================================================================================================
// the column: the earth and the seven worlds
// ======================================================================================================
function column3() {
  const S = new THREE.Scene();
  // the dark round it: deep indigo, stars, a faint glow far below (where Shesha is)
  backdrop3(S, '#04050E', '#090C22', '#03040A', 400);
  { const n = 2400, pos = new Float32Array(n * 3), r = lcg(17); for (let i = 0; i < n; i++) { const u = r() * 2 - 1, a = r() * TAU, s = Math.sqrt(1 - u * u); pos.set([350 * s * Math.cos(a), 350 * u, 350 * s * Math.sin(a)], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    S.add(new THREE.Points(g, new THREE.PointsMaterial({ color: '#C8D4FF', size: 1.6, sizeAttenuation: false, fog: false, transparent: true, opacity: .8 }))); }
  const deepGlow = glow3(S, [0, -150, -60], 130, '#5A7ACC', .25);
  glow3(S, [0, -28, -70], 150, '#2A3E80', .35); glow3(S, [0, 8, -50], 70, '#C08850', .18);
  S.fog = new THREE.Fog('#05060E', 120, 420);
  const R = LK.R, RI = LK.RI;
  const cutWall = cutM3([R / 4, 2]), cutSlab = cutM3([R / 4, 1]);
  const extM = rockM3('#8A7A6A', [14, 3]);
  // the earth's crust: the grass on top, the strata down the cut
  const grassM = new THREE.MeshStandardMaterial({ map: grassTex3().rep(6, 6), roughness: .9, color: '#C8D8B8' });
  const ceilM = rockM3('#5A5048', [6, 6]);
  sector3(S, R, LK.TOP, -LK.TOP / 2, [extM, grassM, ceilM]);
  for (const th of [LK.CUT0, LK.CUT0 + LK.CUTL]) cutFace3(S, th, 0, R, -LK.TOP, 0, cutSlab);
  // on top: trees, a small temple, a river
  const top = new THREE.Group(); S.add(top);
  { const r = lcg(31), trunk = std3('#4A3424', .9), leaf = [std3('#2E5A26', .85), std3('#3A6A2A', .85), std3('#264A22', .85)];
    for (let i = 0; i < 46; i++) { const a = LK.CUT0 + .1 + r() * (LK.CUTL - .2), rr = 2.2 + r() * 7.2, x = rr * Math.sin(a), z = rr * Math.cos(a), h = .7 + r() * .9;
      if (Math.hypot(x, z + 4) < 2.2) continue;
      mesh3(top, new THREE.CylinderGeometry(.05, .08, h * .5, 6), trunk, [x, h * .25, z]);
      mesh3(top, new THREE.SphereGeometry(h * .38, 10, 8), leaf[i % 3], [x, h * .62, z], { scale: [1, 1.1, 1] }); }
    // the temple: a plinth, a sanctum, a curved shikhara and a flag
    const st = std3('#D8C8A8', .8);
    block3(top, 1.6, .25, 1.6, st, [0, 0, -4]); block3(top, 1, .8, 1, st, [0, .25, -4]);
    mesh3(top, lathe3([[.55, 0], [.52, .3], [.44, .7], [.32, 1.05], [.16, 1.3], [.0, 1.38]]), st, [0, 1.05, -4]);
    mesh3(top, new THREE.SphereGeometry(.12, 12, 8), std3('#C89A40', .5, { metalness: .4 }), [0, 2.45, -4]);
    const flag = mesh3(top, new THREE.PlaneGeometry(.35, .2), new THREE.MeshStandardMaterial({ color: '#E8701A', side: THREE.DoubleSide }), [.2, 2.75, -4]);
    mesh3(top, new THREE.CylinderGeometry(.012, .012, .5, 5), std3('#6A5040', .8), [0, 2.65, -4]);
    top.flag = flag;
    // a river across the top, in from the far edge and out toward the cut
    const rp = []; for (let i = 0; i <= 24; i++) { const k = i / 24, a = lerp(Math.PI + .9, LK.CUT0 + LK.CUTL - .05, k); rp.push([lerp(9.6, 5, Math.sin(k * Math.PI)) * Math.sin(a), .03, lerp(9.6, 5, Math.sin(k * Math.PI)) * Math.cos(a)]); }
    stream3(top, rp, .22, { col: '#9CC8E8', glow: '#1E4A6A', speed: 1.2 }).scale.set(1, .15, 1);
  }
  const worlds = [];
  for (let i = 0; i < 7; i++) {
    const w = WORLDS[i], c = LK.ceil(i), f = LK.floor(i), G = new THREE.Group(); S.add(G);
    // the cavern: the outer skin, the rough inner wall, the cut's rim; the slab under it (its floor, the next ceiling)
    sector3(G, R, LK.CH, (c + f) / 2, extM, { cap: false });
    const wallM = rockM3(w.wall, [16, 1.6]);
    sector3(G, RI, LK.CH, (c + f) / 2, wallM, { cap: false, inside: true, rough: .7, seed: i + 1, hs: 10 });
    for (const th of [LK.CUT0, LK.CUT0 + LK.CUTL]) cutFace3(G, th, RI - 1, R, f, c, cutWall);
    const floorM = stone3({ col: w.floor, rows: 6, cols: 3, seed: i + 4, rep: [7, 7], bumpK: 1.6, mottle: 1.2 }); floorM.color.set('#FFFFFF');
    sector3(G, R, LK.SL, f - LK.SL / 2, [extM, floorM, ceilM]);
    for (const th of [LK.CUT0, LK.CUT0 + LK.CUTL]) cutFace3(G, th, 0, R, f - LK.SL, f, cutSlab);
    // the light: a key in the world's colour, a warm fill near the opening, a glow low at the back
    const key = new THREE.PointLight(w.col, 0, 15, 1.2); key.position.set(0, c - .6, -3.5); G.add(key);
    const fill = new THREE.PointLight(w.fill, 0, 12, 1.4); fill.position.set(2.5, f + 1.2, 2.5); G.add(fill);
    const haze = glow3(G, [0, f + 1.6, -6.5], 9, w.col, .22);
    const motes = motes3(G, { n: 160, box: [-7, f + .2, -8, 7, c - .2, 4], size: .0045, col: w.col, drift: [.03, .06, 0], seed: 40 + i });
    worlds.push({ ...w, i, G, key, fill, haze, motes, floorM, wallM, c, f });
  }
  // the rock under the last world: a jagged root hanging into the dark
  { const g = new THREE.ConeGeometry(R, 12, 120, 12, true, LK.CUT0, LK.CUTL), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), rr = Math.hypot(x, z); if (rr < .01) continue; const a = Math.atan2(x, z), k = (y + 6) / 12, d = 1 + .35 * fbm3(a * 4, y * .5, 3, 4) * (1 - k * .7); p.setXYZ(i, x * d, y, z * d); }
    g.computeVertexNormals(); g.rotateX(Math.PI); mesh3(S, g, extM, [0, LK.BOT - 6, 0]);
    for (const th of [LK.CUT0, LK.CUT0 + LK.CUTL]) { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(R, 0); sh.lineTo(0, -12); sh.closePath(); const m = mesh3(S, new THREE.ShapeGeometry(sh), cutSlab, [0, LK.BOT, 0], { rot: [0, th - Math.PI / 2, 0] }); m.material.side = THREE.DoubleSide; m.geometry.attributes.uv.array.forEach((v, k, arr) => arr[k] = v / 4); }
  }
  // the outside light: a cool moon key from front-left (shadows: so the caverns stay dark inside), a warm rim behind
  const sun = new THREE.DirectionalLight('#B8C8FF', 0); sun.position.set(-40, 30, 60); sun.target.position.set(0, -26, 0);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 1, far: 220 }); sun.shadow.bias = -.0006; sun.shadow.normalBias = .04;
  S.add(sun, sun.target);
  const rim = new THREE.DirectionalLight('#FFB880', 0); rim.position.set(30, 20, -50); S.add(rim);
  const hemi = new THREE.HemisphereLight('#4A5A8A', '#140E0A', 0); S.add(hemi);
  S.environment = studioEnv3({ room: '#08080C', boxes: [[-6, 6, 5, 6, 4, 2], [0, 12, 0, 6, 6, 1.5]] }); S.environmentIntensity = .25;

  // ---------------- the worlds' sets ----------------
  const W = worlds;
  // 1 · ATAL: the crystal, 96 glyphs, mirages
  { const w = W[0], f = w.f, G = w.G;
    const glyphTex = k => tex3('glyph' + k, 128, 128, (g) => {
      g.strokeStyle = '#FFFFFF'; g.lineWidth = 6; g.lineCap = 'round'; g.shadowColor = '#FFFFFF'; g.shadowBlur = 8; g.translate(64, 64); const r = lcg(k * 7 + 1);
      g.beginPath(); g.arc(0, 0, 44, 0, TAU); g.stroke();
      const n = 3 + (k % 4); g.beginPath(); for (let i = 0; i <= n; i++) { const a = i / n * TAU * (k % 2 ? 2 : 1) - Math.PI / 2; g[i ? 'lineTo' : 'moveTo'](Math.cos(a) * 34, Math.sin(a) * 34); } g.stroke();
      if (k % 3 === 0) { g.beginPath(); g.arc(0, 0, 12, 0, TAU); g.stroke(); } else { g.beginPath(); g.moveTo(-14, 0); g.lineTo(14, 0); g.moveTo(0, -14); g.lineTo(0, 14); g.stroke(); }
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + r(); g.beginPath(); g.arc(Math.cos(a) * 52, Math.sin(a) * 52, 3, 0, TAU); g.fill(); }
    });
    const ringsG = new THREE.Group(); ringsG.position.set(0, f, -4.8); G.add(ringsG);
    const glyphs = [];
    for (let k = 0; k < 96; k++) {
      const ring = Math.floor(k / 32), j = k % 32, sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glyphTex(k % 8), color: ['#D8B8FF', '#FFB8F0', '#B8D0FF'][ring], transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, opacity: 0 }));
      sp.userData = { ring, j }; ringsG.add(sp); glyphs.push(sp);
    }
    const crystalM = new THREE.MeshStandardMaterial({ color: '#C8A8FF', emissive: '#7A40FF', emissiveIntensity: 1.1, roughness: .25, transparent: true, opacity: .9, flatShading: true });
    const crystal = mesh3(G, new THREE.OctahedronGeometry(.55, 0), crystalM, [0, f + 2.2, -4.8], { scale: [1, 1.6, 1] });
    const cGlow = glow3(G, [0, f + 2.2, -4.8], 3.2, '#B080FF', .6);
    mesh3(G, lathe3([[0, 0], [.9, 0], [.9, .2], [.7, .25], [.6, .5], [.75, .55], [.0, .55]]), std3('#3A3048', .7), [0, f, -4.8]);
    // mirages: glassy pavilions that come and go
    const mirM = new THREE.MeshBasicMaterial({ color: '#B890FF', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    const mirages = [[-4.2, -3.2, .3], [4.3, -2.8, -.3], [-2.4, -6.2, .2], [2.6, -6.4, -.2]].map(([x, z, ry], k) => {
      const M = new THREE.Group(); M.position.set(x, f, z); M.rotation.y = ry; G.add(M);
      for (const [px, pz] of [[-.5, -.5], [.5, -.5], [-.5, .5], [.5, .5]]) mesh3(M, new THREE.CylinderGeometry(.06, .06, 1.4, 8), mirM, [px, .7, pz]);
      mesh3(M, new THREE.BoxGeometry(1.3, .12, 1.3), mirM, [0, 1.46, 0]); mesh3(M, new THREE.SphereGeometry(.55, 16, 8, 0, TAU, 0, Math.PI / 2), mirM, [0, 1.5, 0]);
      M.userData.ph = k * 1.9; return M;
    });
    palace3(G, { i: 0, seed: 11, stone: std3('#6A5A80', .8), trim: '#B8A0E0', win: '#E0B0FF', n: 10 });
    w.set = (t, o = {}) => {
      const n = o.glyphs ?? 96, spin = t * .25;
      glyphs.forEach((sp, k) => { const { ring, j } = sp.userData, r = [1.2, 1.7, 2.2][ring], a = j / 32 * TAU + spin * (ring % 2 ? -1 : 1) * (1 - ring * .2), y = [1.2, 2.2, 3.2][ring] + .08 * Math.sin(t * 1.5 + j);
        sp.position.set(Math.cos(a) * r, y, Math.sin(a) * r); const on = clamp(n - k); sp.material.opacity = on * (.75 + .25 * Math.sin(t * 3 + k)); sp.scale.setScalar(.34 * (on > 0 ? lerp(1.6, 1, clamp((n - k) / 3)) : 0)); });
      crystal.rotation.y = t * .6; crystal.position.y = f + 2.2 + .08 * Math.sin(t * 1.2);
      const burst = o.burst ?? 0; cGlow.material.opacity = .5 + .5 * burst; cGlow.scale.setScalar(3.2 * (1 + 1.2 * burst)); crystalM.emissiveIntensity = 1.1 + 2 * burst;
      mirages.forEach((M, k) => { const v = (o.mirage ?? 0) * (.5 + .5 * Math.sin(t * 1.3 + M.userData.ph)); M.visible = v > .02; M.children.forEach(c => c.material.opacity = .3 * v); M.position.y = f + .05 * Math.sin(t + k); });
      mirM.opacity = .3 * (o.mirage ?? 0);
    };
  }
  // 2 · VITAL: the linga by the river of gold
  { const w = W[1], f = w.f, G = w.G;
    const granite = new THREE.MeshStandardMaterial({ color: '#1C1A1A', roughness: .42, envMapIntensity: .6 });
    const L = new THREE.Group(); L.position.set(-.4, f, -4.8); G.add(L);
    mesh3(L, lathe3([[0, 0], [1.05, 0], [1.05, .14], [.9, .2], [.78, .34], [.85, .42], [.95, .5], [.95, .62], [0, .62]], 64), granite);
    mesh3(L, new THREE.BoxGeometry(.9, .14, .34), granite, [.95, .52, 0]);
    mesh3(L, lathe3([[0, .6], [.42, .6], [.42, 1.3], [.38, 1.55], [.28, 1.72], [.14, 1.8], [0, 1.82]], 48), granite);
    // tripundra: three ash lines and a red dot
    const ash = std3('#E8E2D6', .9);
    for (let k = 0; k < 3; k++) mesh3(L, new THREE.TorusGeometry(.425, .018, 6, 40, 1.4), ash, [0, 1.28 + k * .07, 0], { rot: [Math.PI / 2, 0, Math.PI / 2 - .7 + 0] }).rotation.set(Math.PI / 2, 0, .85);
    mesh3(L, new THREE.SphereGeometry(.035, 10, 8), std3('#B01818', .6), [0, 1.42, .42]);
    // the river of molten gold: a ribbon winding from the back wall round the linga's front and out to the side
    const rpts = [[-7.4, -6.4], [-5.6, -5.2], [-3.4, -3.0], [-1.0, -2.6], [1.4, -3.0], [3.0, -4.4], [4.8, -5.0], [6.8, -4.0], [8.4, -3.2]].map(([x, z]) => V3(x, f + .05, z));
    const curve = new THREE.CatmullRomCurve3(rpts), N = 160, wid = 1.25, pos = [], uv = [], idx = [];
    for (let i = 0; i <= N; i++) { const k = i / N, p = curve.getPointAt(k), tg = curve.getTangentAt(k), nx = -tg.z, nz = tg.x, ww = wid * (.85 + .15 * Math.sin(k * 11)); for (const s of [-1, 1]) { pos.push(p.x + nx * ww / 2 * s, p.y, p.z + nz * ww / 2 * s); uv.push(k * 14, (s + 1) / 2); } if (i < N) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
    const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); rg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); rg.setIndex(idx); rg.computeVertexNormals();
    const goldTex = tex3('goldflow', 512, 128, (g, ww, hh) => { const gr = g.createLinearGradient(0, 0, 0, hh); gr.addColorStop(0, '#7A3A08'); gr.addColorStop(.25, '#E89A20'); gr.addColorStop(.5, '#FFE08A'); gr.addColorStop(.75, '#E89A20'); gr.addColorStop(1, '#7A3A08'); g.fillStyle = gr; g.fillRect(0, 0, ww, hh); const r = lcg(3); for (let i = 0; i < 260; i++) { const y = 10 + r() * (hh - 20), x = r() * ww, l = 20 + r() * 120; g.strokeStyle = r() < .6 ? `rgba(255,250,210,${.2 + r() * .5})` : `rgba(140,60,0,${.2 + r() * .3})`; g.lineWidth = 1 + r() * 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y + (r() - .5) * 4); g.stroke(); g.beginPath(); g.moveTo(x - ww, y); g.lineTo(x - ww + l, y); g.stroke(); } });
    const riverM = new THREE.MeshStandardMaterial({ map: goldTex, emissive: '#FFFFFF', emissiveMap: goldTex, emissiveIntensity: .9, roughness: .35, metalness: .2, color: '#FFFFFF' });
    const river = mesh3(G, rg, riverM, [0, 0, 0], { cast: false });
    // its banks: a dark lip of rock each side
    const bank = std3('#2A2018', .9);
    for (const s of [-1, 1]) { const bp = []; for (let i = 0; i <= 40; i++) { const k = i / 40, p = curve.getPointAt(k), tg = curve.getTangentAt(k); bp.push([p.x - tg.z * (wid * .55) * s, f + .04, p.z + tg.x * (wid * .55) * s]); } tubeP3(G, bp, .12, bank, { segs: 120, radial: 8 }).scale.y = .7; }
    const rl = [0, .33, .66, 1].map(k => { const p = curve.getPointAt(k * .9 + .05), l = new THREE.PointLight('#FFB040', 0, 6, 1.6); l.position.set(p.x, f + .5, p.z); G.add(l); return l; });
    const sparks = [...Array(40)].map((_, k) => glow3(G, [0, 0, 0], .12, '#FFE7A0', 0));
    const lamps = [[-2.0, -4.0], [1.3, -4.0], [-2.0, -6.0], [1.4, -6.1]].map(([x, z], k) => flame3(G, [x, f + .32, z], 2.4, { power: 3, range: 5, seed: k * 3 }));
    for (const [x, z] of [[-2.0, -4.0], [1.3, -4.0], [-2.0, -6.0], [1.4, -6.1]]) mesh3(G, lathe3([[0, 0], [.12, 0], [.06, .18], [.05, .26], [.14, .3], [.0, .3]]), std3('#8A5A2A', .6, { metalness: .3 }), [x, f, z]);
    palace3(G, { i: 1, seed: 23, stone: std3('#6A5640', .8), trim: '#E0B060', win: '#FFC060', n: 8, th0: Math.PI - 1.25, th1: Math.PI + .6 });
    w.set = (t, o = {}) => {
      goldTex.offset.x = -t * .35; riverM.emissiveIntensity = .7 + .5 * (o.gold ?? 0);
      rl.forEach((l, k) => l.intensity = (o.on ?? 1) * (9 + 4 * (o.gold ?? 0)) * (.9 + .1 * Math.sin(t * 3 + k)));
      sparks.forEach((s, k) => { const ph = (t * .3 + k / 40) % 1, p = curve.getPointAt((k * .618) % 1); s.position.set(p.x + Math.sin(k * 5) * .4, f + .1 + ph * 1.6, p.z + Math.cos(k * 3) * .4); s.material.opacity = (o.on ?? 1) * .8 * Math.sin(ph * Math.PI); });
      lamps.forEach(l => l.set(t, o.on ?? 1));
    };
  }
  // 3 · SUTAL: Bali's palace, Vishnu at the door
  { const w = W[2], f = w.f, G = w.G;
    const marble = stone3({ col: '#D8D4CC', rows: 8, cols: 4, seed: 6, rep: [3, 2], bumpK: .8, mottle: .6 }), gold = std3('#C8963C', .5, { metalness: .5, envMapIntensity: .5 });
    const P = new THREE.Group(); P.position.set(0, f, -6.6); P.scale.setScalar(.85); G.add(P);
    // the facade: two wings, a lintel over a tall doorway, steps, pillars, domes
    block3(P, 2.4, 3.2, 1.4, marble, [-2.1, 0, 0]); block3(P, 2.4, 3.2, 1.4, marble, [2.1, 0, 0]); block3(P, 1.8, .8, 1.4, marble, [0, 2.4, 0]);
    block3(P, 7, .2, 1.8, gold, [0, 3.2, 0]);
    for (let k = 0; k < 4; k++) block3(P, 7 - k * .4, .12, .5, marble, [0, k * .12, 1.0 + .5 * (3 - k) * .4]);
    for (const x of [-3.1, -1.1, 1.1, 3.1]) { mesh3(P, new THREE.CylinderGeometry(.13, .15, 3, 14), marble, [x, 1.5, .78]); mesh3(P, new THREE.BoxGeometry(.4, .14, .4), gold, [x, 3.02, .78]); }
    for (const [x, s] of [[-2.1, .9], [0, 1.3], [2.1, .9]]) { mesh3(P, new THREE.CylinderGeometry(.6 * s, .65 * s, .3, 20), marble, [x, 3.45, 0]); mesh3(P, new THREE.SphereGeometry(.62 * s, 24, 12, 0, TAU, 0, Math.PI / 2), gold, [x, 3.6, 0]); mesh3(P, new THREE.ConeGeometry(.08 * s, .5 * s, 8), gold, [x, 3.6 + .62 * s + .2, 0]); }
    // the doorway's light and the door leaves, open
    const doorM = new THREE.MeshBasicMaterial({ color: '#FFD08A', fog: false }); mesh3(P, new THREE.PlaneGeometry(1.8, 2.4), doorM, [0, 1.2, -.3], { cast: false });
    for (const s of [-1, 1]) mesh3(P, new THREE.BoxGeometry(.85, 2.35, .06), gold, [s * 1.0, 1.18, .4], { rot: [0, s * 1.1, 0] });
    const doorGlow = glow3(P, [0, 1.2, .2], 4, '#FFC070', .5);
    const doorLight = new THREE.PointLight('#FFC880', 0, 9, 1.4); doorLight.position.set(0, 1.4, .1); P.add(doorLight);
    // heaps of treasure by the steps
    { const r = lcg(8), coinM = std3('#D8A440', .45, { metalness: .55 }), gemCols = ['#E02040', '#20A060', '#3060E0'];
      for (const [cx, cz] of [[-3.0, 1.9], [3.1, 1.8]]) for (let k = 0; k < 60; k++) { const a = r() * TAU, rr = Math.pow(r(), .6) * .7, h = (.7 - rr) * .55; mesh3(P, new THREE.CylinderGeometry(.07, .07, .02, 10), coinM, [cx + Math.cos(a) * rr, h * r() + .02, cz + Math.sin(a) * rr], { rot: [r() * 1.5, r() * 3, r()] }); if (k % 9 === 0) mesh3(P, new THREE.OctahedronGeometry(.06), std3(gemCols[k % 3], .3, { emissive: gemCols[k % 3], emissiveIntensity: .3 }), [cx + Math.cos(a) * rr * .8, h + .05, cz + Math.sin(a) * rr * .8]); } }
    // Vishnu: a tall figure of blue light at the right of the door: a robe, shoulders, a head, a kirita, a halo; the mace
    const V = new THREE.Group(); V.position.set(0, f, -5.3); G.add(V);
    const vBody = new THREE.MeshStandardMaterial({ color: '#122258', emissive: '#16308A', emissiveIntensity: .12, roughness: .6 });
    const fres = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { col: { value: new THREE.Color('#FFD8A0') }, k: { value: 1 } },
      vertexShader: 'varying vec3 vN, vV; void main() { vec4 p = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-p.xyz); gl_Position = projectionMatrix * p; }',
      fragmentShader: 'uniform vec3 col; uniform float k; varying vec3 vN, vV; void main() { float f = pow(1. - abs(dot(vN, vV)), 3.); gl_FragColor = vec4(col * f * k * 2.2, 1.); }' });
    const robe = lathe3([[0, 0], [.5, 0], [.46, .5], [.36, 1.2], [.3, 1.55], [.34, 1.75], [.42, 2.0], [.4, 2.18], [.2, 2.3], [.12, 2.36], [0, 2.36]], 48);
    mesh3(V, robe, vBody, [0, 0, 0], { scale: [1, 1, .62] }); mesh3(V, robe, fres, [0, 0, 0], { scale: [1.04, 1.01, .66] });
    mesh3(V, new THREE.SphereGeometry(.2, 24, 18), vBody, [0, 2.52, 0], { scale: [1, 1.15, 1] }); mesh3(V, new THREE.SphereGeometry(.21, 24, 18), fres, [0, 2.52, 0], { scale: [1, 1.15, 1] });
    mesh3(V, lathe3([[.17, 0], [.18, .08], [.15, .1], [.15, .3], [.12, .34], [.12, .5], [.06, .6], [0, .66]], 24), gold, [0, 2.64, 0]);
    const halo = mesh3(V, new THREE.TorusGeometry(.42, .025, 8, 48), std3('#E8B860', .4, { emissive: '#FFB040', emissiveIntensity: .8 }), [0, 2.62, -.25]);
    for (const s of [-1, 1]) mesh3(V, new THREE.CylinderGeometry(.05, .045, .45, 12), gold, [s * .3, 1.95, 0], { rot: [0, 0, 0] });   // armlets read as the shoulders' line
    // the right arm, down and out to hold the mace upright
    tubeP3(V, [[.36, 2.08, 0], [.52, 1.7, .1], [.56, 1.35, .22]], [.08, .065], vBody, { segs: 12, radial: 10 });
    tubeP3(V, [[-.36, 2.08, 0], [-.46, 1.7, .05], [-.4, 1.35, .2]], [.08, .065], vBody, { segs: 12, radial: 10 });
    // the upper arms, raised: the chakra in the right hand, the conch in the left
    for (const s of [-1, 1]) { tubeP3(V, [[s * .34, 2.1, -.04], [s * .62, 2.3, 0], [s * .7, 2.66, .06]], [.07, .055], vBody, { segs: 12, radial: 10 }); mesh3(V, new THREE.SphereGeometry(.065, 12, 10), vBody, [s * .7, 2.7, .07]); }
    for (const [x, y] of [[.56, 1.33], [-.4, 1.33]]) mesh3(V, new THREE.SphereGeometry(.07, 12, 10), vBody, [x, y, .22]);
    const chakra = new THREE.Group(); chakra.position.set(.72, 2.92, .1); V.add(chakra);
    const chM = std3('#F0C060', .35, { metalness: .4, emissive: '#FFB040', emissiveIntensity: 1.2 });
    mesh3(chakra, new THREE.TorusGeometry(.2, .025, 8, 40), chM); mesh3(chakra, new THREE.TorusGeometry(.07, .02, 8, 24), chM);
    for (let k = 0; k < 12; k++) mesh3(chakra, new THREE.BoxGeometry(.012, .13, .012), chM, [Math.cos(k / 12 * TAU) * .135, Math.sin(k / 12 * TAU) * .135, 0], { rot: [0, 0, k / 12 * TAU - Math.PI / 2] });
    for (let k = 0; k < 16; k++) mesh3(chakra, new THREE.ConeGeometry(.025, .07, 4), chM, [Math.cos(k / 16 * TAU) * .25, Math.sin(k / 16 * TAU) * .25, 0], { rot: [0, 0, k / 16 * TAU - Math.PI / 2] });
    glow3(chakra, [0, 0, .02], 1.1, '#FFC060', .55);
    const conch = mesh3(V, lathe3([[0, 0], [.06, .02], [.09, .08], [.085, .16], [.06, .22], [.03, .28], [0, .3]], 24), std3('#F4EEE4', .45, { emissive: '#FFFFFF', emissiveIntensity: .25 }), [-.72, 2.78, .1], { rot: [0, 0, .5] });
    const mace = new THREE.Group(); mace.position.set(.58, 0, .26); V.add(mace);
    mesh3(mace, new THREE.CylinderGeometry(.035, .04, 2.1, 10), gold, [0, 1.05, 0]);
    mesh3(mace, lathe3([[0, 0], [.1, .02], [.22, .12], [.26, .26], [.22, .4], [.1, .5], [0, .52]], 32), gold, [0, 1.95, 0]);
    for (let k = 0; k < 8; k++) mesh3(mace, new THREE.BoxGeometry(.03, .26, .06), gold, [Math.cos(k / 8 * TAU) * .25, 2.21, Math.sin(k / 8 * TAU) * .25], { rot: [0, -k / 8 * TAU, 0] });
    mesh3(mace, new THREE.ConeGeometry(.05, .18, 10), gold, [0, 2.55, 0]);
    const vGlow = glow3(V, [0, 1.8, -.5], 7, '#FFC880', .35), vLight = new THREE.PointLight('#7AA8FF', 0, 8, 1.4); vLight.position.set(0, 1.8, 1.4); V.add(vLight);
    palace3(G, { i: 2, seed: 37, stone: std3('#B8B4AE', .75), trim: '#D8B060', win: '#FFE0A0', n: 6, th0: Math.PI - 1.4, th1: Math.PI - .55, tall: .8 });
    palace3(G, { i: 2, seed: 38, stone: std3('#B8B4AE', .75), trim: '#D8B060', win: '#FFE0A0', n: 6, th0: Math.PI + .55, th1: Math.PI + 1.4, tall: .8 });
    w.set = (t, o = {}) => {
      const v = o.vishnu ?? 1; V.visible = v > .01; vBody.emissiveIntensity = .4 + .5 * v; fres.uniforms.k.value = v; vGlow.material.opacity = .4 * v; vLight.intensity = 3 * v;
      V.position.y = f; halo.rotation.z = t * .2; chakra.rotation.z = -t * 2.2; doorLight.intensity = 10 * (o.door ?? 1); doorGlow.material.opacity = .5 * (o.door ?? 1); doorGlow.scale.setScalar(4 * (o.door ?? 1));
    };
  }
  // 4 · TALATAL: Maya's three floating cities
  { const w = W[3], f = w.f, G = w.G;
    const cityM = std3('#8A7464', .7), trimM = std3('#D0A050', .5, { metalness: .3 }), rockU = std3('#4E3A30', .9);
    const cities = [[-1.3, 1.35, -3.4, .85, 1], [1.25, 2.15, -4.9, .95, 2], [-.4, 3.0, -6.6, .8, 3]].map(([x, y, z, s, seed]) => {
      const C = new THREE.Group(); C.position.set(x, f + y, z); G.add(C); const r = lcg(seed * 13);
      mesh3(C, new THREE.CylinderGeometry(s, s * 1.02, .22, 32), cityM);
      const ug = new THREE.ConeGeometry(s, s * 1.3, 24, 4), up = ug.attributes.position; for (let i = 0; i < up.count; i++) { const k = 1 + .25 * fbm3(up.getX(i) * 2, up.getY(i) * 2, seed, 3); up.setXYZ(i, up.getX(i) * k, up.getY(i), up.getZ(i) * k); } ug.computeVertexNormals(); ug.rotateX(Math.PI);
      mesh3(C, ug, rockU, [0, -.11 - s * .65, 0]);
      mesh3(C, new THREE.TorusGeometry(s, .04, 6, 48), trimM, [0, .11, 0], { rot: [Math.PI / 2, 0, 0] });
      const towers = new THREE.Group(); towers.position.y = .11; C.add(towers);
      for (let k = 0; k < 7; k++) { const a = k / 7 * TAU + r(), rr = k === 0 ? 0 : s * (.35 + r() * .4), h = (k === 0 ? 1.1 : .4 + r() * .5) * s, ww = (k === 0 ? .32 : .16 + r() * .1) * s;
        const T = new THREE.Group(); T.position.set(Math.cos(a) * rr, 0, Math.sin(a) * rr); towers.add(T);
        mesh3(T, new THREE.BoxGeometry(ww, h, ww), cityM, [0, h / 2, 0]); mesh3(T, new THREE.ConeGeometry(ww * .75, ww * 1.6, 8), trimM, [0, h + ww * .8, 0]);
        for (let q = 0; q < 3; q++) mesh3(T, new THREE.BoxGeometry(ww * .3, ww * .4, .01), new THREE.MeshBasicMaterial({ color: '#FFC070' }), [0, h * (.3 + q * .22), ww / 2 + .006], { cast: false }); }
      const fire = [...Array(9)].map((_, k) => { const a = k / 9 * TAU, rr = s * (.2 + .6 * ((k * .37) % 1)); return flame3(C, [Math.cos(a) * rr, .12, Math.sin(a) * rr], 6 * s, { light: k === 0, power: 40, range: 9, seed: seed * 10 + k }); });
      const light = new THREE.PointLight('#FFB070', 0, 6, 1.5); light.position.set(0, -.5, 0); C.add(light);
      C.userData = { y: f + y, seed, towers, fire, light, s }; return C;
    });
    const embers = motes3(G, { n: 260, box: [-6, f + .2, -8, 6, w.c - .2, 0], size: .006, col: '#FF8A3A', drift: [.05, .5, 0], seed: 77 });
    const arrow = glow3(G, [0, 0, 0], 1.2, '#FFD0A0', 0), trail = [...Array(14)].map(() => glow3(G, [0, 0, 0], .7, '#FF9040', 0));
    const blessing = glow3(G, [0, w.c - .4, -4.4], 10, '#9CC8FF', 0);
    palace3(G, { i: 3, seed: 51, stone: std3('#6E5848', .8), trim: '#D09040', win: '#FFB060', n: 9, tall: .9 });
    w.set = (t, o = {}) => {
      const build = o.build ?? 1, burn = o.burn ?? 0, calm = o.calm ?? 0, sh = o.shot ?? 0;
      cities.forEach((C, k) => { const u = C.userData; C.position.y = u.y + .12 * Math.sin(t * .8 + k * 2) - calm * .2; C.rotation.y = t * .08 * (k % 2 ? -1 : 1);
        u.towers.children.forEach((T, q) => { T.scale.y = Math.max(.001, easeOut(clamp(build * 1.6 - q * .09))); });
        u.fire.forEach((fl, q) => fl.set(t, burn * clamp(burn * 3 - q * .1)));
        u.light.intensity = 8 * calm + 2; });
      embers.set(t, .2 + .8 * burn);
      // the arrow of fire, in from the top left to the middle city
      const ka = clamp(sh); arrow.material.opacity = ka > 0 && ka < 1 ? 1 : 0; const A = V3(-6, w.c - .3, 1), B = cities[1].position.clone();
      arrow.position.copy(A.clone().lerp(B, easeIn(ka)));
      trail.forEach((g, q) => { const kk = clamp(easeIn(ka) - q * .025); g.position.copy(A.clone().lerp(B, kk)); g.material.opacity = ka > 0 && ka < 1 ? .5 * (1 - q / 14) : 0; });
      blessing.material.opacity = .45 * calm;
    };
  }
  // 5 · MAHATAL: serpents with many hoods
  { const w = W[4], f = w.f, G = w.G;
    const nagas = [
      naga3(G, { rings: [[5, 1.0, .8, 2.0]], coil: [1.3, 2.4, .26], trunk: 1.5, body: '#26402E', face: '#5E8A5A', mark: '#16261A', jewel: '#40FF90', eye: '#E8C040' }),
      naga3(G, { rings: [[3, .62, .56, 1.4]], coil: [.95, 2.2, .2], trunk: 1.1, body: '#2E3A26', face: '#6A845A', mark: '#1E2414', jewel: '#80FFC0', eye: '#E8C040' }),
      naga3(G, { rings: [[3, .62, .56, 1.4]], coil: [.95, 2.2, .2], trunk: 1.1, body: '#22382E', face: '#5A8670', mark: '#14261A', jewel: '#60FFB0', eye: '#E8C040' }),
    ];
    nagas[0].position.set(0, f, -3.9); nagas[1].position.set(-1.7, f, -6.2); nagas[1].rotation.y = .3; nagas[2].position.set(1.7, f, -6.4); nagas[2].rotation.y = -.3;
    // Garuda's shadow: a great bird's shape passing over the floor, and a gold light sweeping across
    const birdTex = tex3('bird', 512, 256, (g, ww, hh) => { g.fillStyle = 'rgba(0,0,0,0)'; g.fillRect(0, 0, ww, hh); g.fillStyle = 'rgba(0,0,0,1)'; g.filter = 'blur(6px)'; g.beginPath(); g.moveTo(256, 60); g.bezierCurveTo(200, 80, 120, 70, 10, 30); g.bezierCurveTo(80, 120, 170, 140, 230, 150); g.lineTo(240, 230); g.lineTo(256, 210); g.lineTo(272, 230); g.lineTo(282, 150); g.bezierCurveTo(342, 140, 432, 120, 502, 30); g.bezierCurveTo(392, 70, 312, 80, 256, 60); g.fill(); g.beginPath(); g.arc(256, 55, 18, 0, TAU); g.fill(); });
    const bird = mesh3(G, new THREE.PlaneGeometry(9, 4.5), new THREE.MeshBasicMaterial({ map: birdTex, transparent: true, opacity: 0, depthWrite: false, color: '#000000' }), [0, f + .03, 0], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false });
    const gLight = new THREE.PointLight('#FFD080', 0, 14, 1.2); G.add(gLight);
    palace3(G, { i: 4, seed: 61, stone: std3('#4E6658', .8), trim: '#9AD0A0', win: '#B0FFD0', n: 9, tall: .85 });
    w.set = (t, o = {}) => {
      const ga = o.garuda ?? -1, fl = clamp(1 - Math.abs(ga - .45) * 2.2) * (ga >= 0 ? 1 : 0);
      nagas.forEach((n, k) => n.set(t + k * 1.3, { sway: 1, flinch: Math.max(fl, (o.flinch ?? 0)) }));
      bird.material.opacity = ga >= 0 && ga <= 1 ? .55 * Math.sin(Math.PI * ga) : 0; bird.position.set(lerp(-11, 11, ga), f + .03, lerp(-6, -1, ga)); bird.rotation.z = -.4;
      gLight.position.set(lerp(-9, 9, ga), w.c - .4, lerp(-5, 0, ga)); gLight.intensity = ga >= 0 && ga <= 1 ? 40 * Math.sin(Math.PI * ga) : 0;
    };
  }
  // 6 · RASATAL: pits with eyes, a dark fortress
  { const w = W[5], f = w.f, G = w.G;
    const pitM = new THREE.MeshBasicMaterial({ color: '#040202' }), rimM = rockM3('#4A3634', [1, 1]), ironM = std3('#2A2426', .6, { metalness: .4 }), spearM = std3('#8A8080', .4, { metalness: .6 });
    const pits = [[-3.4, -2.4], [-1.2, -3.6], [1.4, -2.6], [3.6, -3.8], [-4.6, -5.0], [-.2, -5.8], [2.6, -6.0], [5.2, -2.0], [-5.6, -2.0]].map(([x, z], k) => {
      const P = new THREE.Group(); P.position.set(x, f, z); G.add(P);
      mesh3(P, new THREE.CircleGeometry(.62, 24), pitM, [0, .02, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
      mesh3(P, new THREE.TorusGeometry(.66, .14, 8, 24), rimM, [0, .02, 0], { rot: [Math.PI / 2, 0, 0] });
      const eyes = new THREE.Group(); P.add(eyes);
      for (const s of [-1, 1]) { glow3(eyes, [s * .12, 0, 0], .32, '#FF2010', 1); glow3(eyes, [s * .12, 0, 0], .08, '#FFD0A0', 1); }
      const spears = new THREE.Group(); P.add(spears);
      if (k % 2 === 0) for (let q = 0; q < 2; q++) { const S2 = new THREE.Group(); S2.position.set((q - .5) * .5, 0, -.15); S2.rotation.z = (q - .5) * .3; spears.add(S2); mesh3(S2, new THREE.CylinderGeometry(.02, .02, 1.3, 6), ironM, [0, .65, 0]); mesh3(S2, new THREE.ConeGeometry(.05, .22, 6), spearM, [0, 1.4, 0]); }
      P.userData = { eyes, spears, ph: k * 1.37 }; return P;
    });
    // the fortress (Hiranyapura): dark walls, crenellations, red slit windows
    const F = new THREE.Group(); G.add(F);
    for (let k = 0; k < 11; k++) { const th = Math.PI - 1.3 + k * .26, r = 7.6, x = r * Math.sin(th), z = r * Math.cos(th), h = k % 3 === 1 ? 3.3 : 2.4;
      const T = new THREE.Group(); T.position.set(x, f, z); T.rotation.y = th; F.add(T);
      mesh3(T, new THREE.BoxGeometry(1.5, h, 1), ironM, [0, h / 2, 0]);
      for (let q = 0; q < 4; q++) mesh3(T, new THREE.BoxGeometry(.25, .25, 1), ironM, [-.56 + q * .375, h + .12, 0]);
      for (let q = 0; q < 2; q++) mesh3(T, new THREE.BoxGeometry(.07, .4, .02), new THREE.MeshBasicMaterial({ color: '#FF2A10' }), [(q - .5) * .6, h * .62, -.51], { cast: false }); }
    const flash = new THREE.PointLight('#D8E8FF', 0, 30, .8); flash.position.set(0, w.c - .5, -2); G.add(flash);
    const flashG = glow3(G, [0, w.c - .3, -3], 14, '#DCEBFF', 0);
    w.set = (t, o = {}) => {
      const duck = o.duck ?? 0;
      pits.forEach(P => { const u = P.userData, peek = clamp(1 - duck * 1.5 + .2 * Math.sin(t * .7 + u.ph)); u.eyes.position.y = lerp(-.4, .28, peek); u.eyes.visible = peek > .05; const blink = Math.sin(t * 1.1 + u.ph * 3) > .96 ? .1 : 1; u.eyes.scale.set(1, blink, 1); u.spears.position.y = lerp(-1.6, 0, clamp(1 - duck * 1.2)); });
      flash.intensity = 120 * (o.flash ?? 0); flashG.material.opacity = .8 * (o.flash ?? 0);
    };
  }
  // 7 · PATAL: Vasuki and the Nagas, a jewel on every hood
  { const w = W[6], f = w.f, G = w.G;
    const vas = naga3(G, { rings: [[7, 1.35, .92, 2.4]], coil: [1.9, 2.6, .36], trunk: 1.6, body: '#1E3A3E', face: '#4E8A86', mark: '#0E2426', jewel: '#FF3050', eye: '#F0C040' });
    vas.position.set(0, f, -5.2);
    const small = [[-1.9, -3.4, .4, 3, '#40A0FF'], [1.9, -3.6, -.4, 3, '#FFC030'], [-1.5, -2.7, .3, 1, '#30FF90'], [1.6, -2.9, -.3, 1, '#C060FF'], [-2.7, -7.0, .3, 5, '#FF8030'], [2.7, -7.2, -.3, 5, '#40E0FF']].map(([x, z, ry, n, jc], k) => {
      const N = naga3(G, { rings: [[n, n > 1 ? .55 : .45, .5, n > 3 ? 2.0 : 1.3]], coil: [.75, 2, .16], trunk: .85, body: ['#1E3436', '#24323A', '#1A3030'][k % 3], face: '#5A8A84', mark: '#0E2426', jewel: jc, eye: '#F0C040' });
      N.position.set(x, f, z); N.rotation.y = ry; return N; });
    // the jewels' light: one point light per colour, low; and hundreds of jewel sparks round the hall
    const jl = [['#FF3050', 0, -4.4], ['#40A0FF', -4, -2.6], ['#FFC030', 4, -2.6]].map(([c2, x, z]) => { const l = new THREE.PointLight(c2, 0, 9, 1.4); l.position.set(x, f + 2.2, z); G.add(l); return l; });
    const sparks = [...Array(140)].map((_, k) => { const r = lcg(k * 3 + 1), th = Math.PI + (r() - .5) * 3.2, rr = 3 + r() * 5.6, cols = ['#FF3050', '#40A0FF', '#FFC030', '#30FF90', '#C060FF', '#40E0FF'];
      return glow3(G, [rr * Math.sin(th), f + .3 + r() * 3.6, rr * Math.cos(th)], .1 + r() * .18, cols[k % 6], 0); });
    palace3(G, { i: 6, seed: 71, stone: std3('#3E5A5E', .8), trim: '#E0C070', win: '#80FFF0', n: 11, tall: 1.05 });
    w.set = (t, o = {}) => {
      const jw = o.jewels ?? 1;
      vas.set(t, { sway: .8, jewel: jw }); small.forEach((n, k) => n.set(t + k, { sway: 1, jewel: clamp(jw * 1.4 - k * .08) }));
      jl.forEach(l => l.intensity = 22 * jw);
      sparks.forEach((s, k) => { s.material.opacity = clamp(jw * 1.6 - (k / 140) * .6) * (.5 + .5 * Math.sin(t * 2 + k)); });
    };
  }

  // light(t, o): the outside light (ext 0..1) and each cavern's own light (inside [k0..k6], or a number for all)
  const light = (o = {}) => {
    const ext = o.ext ?? 1; sun.intensity = 2.2 * ext; rim.intensity = 1.2 * ext; hemi.intensity = .35 * ext;
    W.forEach((w, i) => { const k = Array.isArray(o.inside) ? o.inside[i] : (o.inside ?? 1), tint = o.tint ? new THREE.Color(w.col).lerp(new THREE.Color(o.tint[0]), o.tint[1]) : null;
      w.key.intensity = 70 * k; w.fill.intensity = 12 * k; w.haze.material.opacity = .22 * k; w.key.color.set(tint || w.col); w.haze.material.color.set(tint || w.col); w.motes.visible = k > .05; });
  };
  // set every world to its resting state at t (each shot then changes what it needs)
  const rest = (t) => { W[0].set(t, { glyphs: 96, mirage: .5 }); W[1].set(t, {}); W[2].set(t, {}); W[3].set(t, { calm: 1 }); W[4].set(t, {}); W[5].set(t, {}); W[6].set(t, {}); W.forEach(w => w.motes.set(t, 1)); top.flag.rotation.y = .2 * Math.sin(t * 3); };
  return { S, W, top, sun, rim, hemi, light, rest, deepGlow };
}

// ======================================================================================================
// Ananta Shesha and the universe on one hood
// ======================================================================================================
function shesha3() {
  const S = new THREE.Scene();
  backdrop3(S, '#03040C', '#08102A', '#0A1838', 900);
  { const n = 3000, pos = new Float32Array(n * 3), r = lcg(23); for (let i = 0; i < n; i++) { const u = r() * 2 - 1, a = r() * TAU, s = Math.sqrt(1 - u * u); pos.set([800 * s * Math.cos(a), 800 * u, 800 * s * Math.sin(a)], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); S.add(new THREE.Points(g, new THREE.PointsMaterial({ color: '#D0DCFF', size: 1.6, sizeAttenuation: false, fog: false, transparent: true, opacity: .7 }))); }
  S.fog = new THREE.Fog('#0A1430', 60, 260);
  // the cosmic waters under him
  const sea = mesh3(S, new THREE.CircleGeometry(600, 64), new THREE.MeshStandardMaterial({ color: '#0C1A3A', roughness: .25, metalness: .1, envMapIntensity: .6 }), [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  S.environment = studioEnv3({ room: '#0A1028', boxes: [[-6, 8, 6, 8, 4, 1.4], [6, 6, -6, 6, 4, .8], [0, 14, 0, 8, 6, 1]] }); S.environmentIntensity = .5;
  // Shesha: pearl-white, a coil of three turns stacked, a trunk, and the canopy: five rows of hoods
  const rings = [[7, 9.5, 6.4, 2.1, 0], [9, 14, 5.8, 2.4, -3.5], [11, 18.5, 5.2, 2.6, -7], [15, 22.5, 4.6, 2.8, -10.5]];
  const SH = naga3(S, { rings, coil: [22, 3.2, 3.4], stack: .5, trunk: 16, body: '#D8D4CC', face: '#E8DEC6', mark: '#A8863C', head: '#E4E0D8', jewel: '#FFC860', eye: '#C83020' });
  // the universe: a golden egg resting on the front row's middle hood; inside it, the column (a picture rendered live)
  const mid = SH.heads[3], hood = mid.children[1];
  const EGG = new THREE.Group(); S.add(EGG);
  const eggR = 1.1;
  const shell = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { col: { value: new THREE.Color('#FFC860') }, k: { value: 1 } },
    vertexShader: 'varying vec3 vN, vV; void main() { vec4 p = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-p.xyz); gl_Position = projectionMatrix * p; }',
    fragmentShader: 'uniform vec3 col; uniform float k; varying vec3 vN, vV; void main() { float f = pow(1. - abs(dot(vN, vV)), 1.8); gl_FragColor = vec4(col * (f * 1.6 + .08) * k, 1.); }' });
  mesh3(EGG, new THREE.SphereGeometry(eggR, 48, 32), shell, [0, 0, 0], { scale: [1, 1.25, 1], cast: false, receive: false });
  const inner = mesh3(EGG, new THREE.SphereGeometry(eggR * .97, 48, 32), new THREE.MeshBasicMaterial({ color: '#05060E', fog: false, side: THREE.BackSide }), [0, 0, 0], { scale: [1, 1.25, 1], cast: false, receive: false });
  const RT = new THREE.WebGLRenderTarget(512, 640, { samples: 4, type: THREE.HalfFloatType });
  const pic = mesh3(EGG, new THREE.PlaneGeometry(eggR * 1.3, eggR * 1.62), new THREE.MeshBasicMaterial({ map: RT.texture, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, color: '#C8C8C8' }), [0, 0, 0], { cast: false, receive: false });
  const eggGlow = glow3(EGG, [0, 0, 0], eggR * 4, '#FFD080', .5), eggCore = glow3(EGG, [0, 0, 0], eggR * 1.6, '#FFF0C0', .3);
  const key = new THREE.DirectionalLight('#C8D8FF', 1.6); key.position.set(-30, 50, 60); S.add(key);
  const warm = new THREE.PointLight('#FFC870', 0, 60, 1.2); S.add(warm);
  const hemi = new THREE.HemisphereLight('#5A6A9A', '#0A1020', .5); S.add(hemi);
  const motes = motes3(S, { n: 400, box: [-40, 0, -40, 40, 50, 30], size: .003, col: '#BFD4FF', drift: [.1, .2, 0], seed: 9 });
  // place(t): sway the hoods, then sit the egg on the middle hood (world position of its crown)
  const crown = V3();
  const place = (t, o = {}) => {
    SH.set(t, { sway: .35, jewel: o.jewel ?? 1 });
    S.updateMatrixWorld(true);
    hood.localToWorld(crown.set(0, 6.4 * .8, 6.4 * .2));
    EGG.position.copy(crown).add(V3(0, eggR * 1.7, 1.2));
    warm.position.copy(EGG.position).add(V3(0, 0, 4)); warm.intensity = 60 * (o.egg ?? 1);
    EGG.scale.setScalar(o.eggScale ?? 1); shell.uniforms.k.value = o.egg ?? 1; eggGlow.material.opacity = .32 * (o.egg ?? 1); eggCore.material.opacity = .12 * (o.egg ?? 1);
    motes.set(t, .8);
  };
  // paint the column into the egg's picture with a camera of its own
  const paint = (colScene, camPic) => { const prev = GL3.getRenderTarget(); GL3.setRenderTarget(RT); GL3.setClearColor('#000000', 1); GL3.clear(); GL3.render(colScene, camPic); GL3.setRenderTarget(prev); pic.lookAt(CAM3.position); };
  return { S, SH, EGG, place, paint, pic, crown: () => EGG.position.clone() };
}
