// pushpak_props.js: the things in "The whole Ramayan in one flight" (ad 64) that the map (cine3d_india.js) doesn't have:
// the Pushpak, the stops and the route, the flight, Bharata's sandals, the fire of his vow, the Panchami moon, rain, and
// the memory bubbles (moments of the Ramayan series, re-rendered by tools/pushpak_clips.mjs).
// Map units throughout (1 = 10 km, y up, north = -z); the Pushpak is drawn far bigger than life (a radius of 1 = 10 km)
// so it reads over a country.

// ---------- the stops (traditional identifications; Valmiki names the place, the sub is today's site) ----------
const STOPS = {
  lanka: { name: 'LANKA', sub: 'Sri Lanka', lon: 80.72, lat: 7.62 },
  setu: { name: 'NALA SETU', sub: 'Rameswaram', lon: 79.31, lat: 9.29 },
  kish: { name: 'KISHKINDHA', sub: 'Hampi, Karnataka', lon: 76.46, lat: 15.33 },
  rishya: { name: 'RISHYAMUKA', sub: '', lon: 76.43, lat: 15.37 },
  pampa: { name: 'PAMPA', sub: '', lon: 76.50, lat: 15.36 },
  jatayu: { name: 'JANASTHANA', sub: '', lon: 74.2, lat: 19.5 },
  panch: { name: 'PANCHAVATI', sub: 'Nashik, Maharashtra', lon: 73.79, lat: 20.01 },
  chitra: { name: 'CHITRAKOOT', sub: 'UP / MP', lon: 80.87, lat: 25.17 },
  atri: { name: 'ATRI', sub: '', lon: 80.75, lat: 25.02 },
  prayag: { name: 'PRAYAG', sub: 'Prayagraj, UP', lon: 81.88, lat: 25.43 },
  guha: { name: "GUHA'S TOWN", sub: 'Shringverpur', lon: 81.63, lat: 25.59 },
  ayodhya: { name: 'AYODHYA', sub: 'Uttar Pradesh', lon: 82.20, lat: 26.79 },
  nandi: { name: 'NANDIGRAM', sub: '', lon: 82.13, lat: 26.62 },
};
// the eight the ask counts, in the order of the flight
const COUNT = ['lanka', 'setu', 'kish', 'panch', 'chitra', 'prayag', 'guha', 'ayodhya'];

// ---------- the route: Lanka to Prayag, through the stops in the order Ram names them (Yuddha 123) ----------
const ROUTE_LL = [[80.9, 7.15], [80.72, 7.62], [80.35, 8.4], [79.85, 9.0], [79.52, 9.19], [79.31, 9.29], [79.15, 9.75], [78.6, 11.2],
  [77.4, 13.4], [76.62, 15.0], [76.46, 15.33], [76.1, 16.4], [75.0, 18.6], [74.2, 19.5], [73.79, 20.01], [74.6, 21.2],
  [76.6, 22.8], [78.8, 24.1], [80.3, 24.85], [80.87, 25.17], [81.4, 25.28], [81.88, 25.43]];
// a smooth curve through the waypoints in map xz, with its arc length
const ROUTE = (() => {
  const P = ROUTE_LL.map(([lo, la]) => MAP3.xz(lo, la)), pts = [];
  for (let i = 0; i < P.length - 1; i++) {
    const a = P[Math.max(0, i - 1)], b = P[i], c = P[i + 1], d = P[Math.min(P.length - 1, i + 2)];
    for (let k = 0; k < 24; k++) {
      const s = k / 24, s2 = s * s, s3 = s2 * s;
      pts.push([0, 1].map(j => .5 * (2 * b[j] + (-a[j] + c[j]) * s + (2 * a[j] - 5 * b[j] + 4 * c[j] - d[j]) * s2 + (-a[j] + 3 * b[j] - 3 * c[j] + d[j]) * s3)));
    }
  }
  pts.push(P[P.length - 1]);
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = L[L.length - 1];
  // at(s): [x, z] and the heading at arc fraction s
  const at = (s) => {
    const d = clamp(s) * tot; let i = 1; while (i < L.length - 1 && L[i] < d) i++;
    const k = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1), a = pts[i - 1], b = pts[i];
    return { x: lerp(a[0], b[0], k), z: lerp(a[1], b[1], k), dx: b[0] - a[0], dz: b[1] - a[1] };
  };
  // the arc fraction nearest a lon/lat
  const near = (lon, lat) => { const [x, z] = MAP3.xz(lon, lat); let bi = 0, bd = 1e9; pts.forEach((p, i) => { const dd = Math.hypot(p[0] - x, p[1] - z); if (dd < bd) { bd = dd; bi = i; } }); return L[bi] / tot; };
  return { pts, L, tot, at, near };
})();

// ---------- the Pushpak: a flying palace of gold ----------
// pushpak3(scene, env): a lotus-bottomed golden deck with a jewelled rim and a railing, an eight-pillared pavilion under a
// curved golden roof with an amalaka, a kalasha and a saffron flag, four corner chhatris, a glow beneath. Its radius is
// 1 (the deck is an oval, 1.25 × 1, long along its heading; the flag streams back along local +x). .pose(p [x, y, z], yaw, bank,
// t, scale), .set(t, { on, glow })
function pushpak3(scene, env) {
  const P = new THREE.Group(), G = new THREE.Group(); P.add(G); scene.add(P);
  const gold = new THREE.MeshStandardMaterial({ color: '#F4C76C', metalness: 1, roughness: .26, envMap: env, envMapIntensity: 1.35 });
  const gold2 = new THREE.MeshStandardMaterial({ color: '#D99A3A', metalness: 1, roughness: .38, envMap: env, envMapIntensity: 1.2 });
  const rose = new THREE.MeshStandardMaterial({ color: '#F0B48A', metalness: .85, roughness: .3, envMap: env, envMapIntensity: 1.25 });
  const red = new THREE.MeshStandardMaterial({ color: '#9A1F28', metalness: .1, roughness: .6, envMap: env, envMapIntensity: .6 });
  const white = new THREE.MeshStandardMaterial({ color: '#EAD6B4', metalness: .1, roughness: .55, envMap: env, envMapIntensity: .45 });
  const gem = (col) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 1.6, metalness: .2, roughness: .2 });
  const lathe = (pts, mat, y = 0, seg = 64) => mesh3(G, new THREE.LatheGeometry(pts.map(([r, h]) => new THREE.Vector2(r, h)), seg), mat, [0, y, 0], { cast: false, receive: false });
  // the hull: a lotus bowl under the deck, ending in a hanging kalasha
  lathe([[0, -1.05], [.07, -1.0], [.12, -.93], [.07, -.86], [.05, -.78], [.16, -.7], [.36, -.58], [.62, -.4], [.84, -.24], [.98, -.1], [1.05, -.03], [1.05, .02], [0, .02]], gold2);
  // lotus petals round the bowl, two rows
  for (const [n, r, y, tilt, sc, mat] of [[20, .93, -.2, .75, .3, rose], [20, .7, -.42, .95, .24, gold]]) for (let i = 0; i < n; i++) {
    const a = (i + (mat === gold ? .5 : 0)) / n * TAU, m = mesh3(G, new THREE.SphereGeometry(1, 16, 10), mat, [Math.cos(a) * r, y, Math.sin(a) * r], { cast: false, receive: false });
    m.scale.set(sc * .55, sc * .14, sc); m.rotation.set(0, -a + Math.PI / 2, 0); m.rotateX(tilt);
  }
  // the rim: a gold band set with gems, the red deck, a railing
  mesh3(G, new THREE.TorusGeometry(1.05, .045, 10, 96), gold, [0, .0, 0], { rot: [Math.PI / 2, 0, 0], cast: false, receive: false });
  for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; mesh3(G, new THREE.SphereGeometry(.035, 10, 8), gem(i % 2 ? '#FF3050' : '#30E890'), [Math.cos(a) * 1.08, -.01, Math.sin(a) * 1.08], { cast: false, receive: false }); }
  mesh3(G, new THREE.CylinderGeometry(1.0, 1.0, .03, 64), red, [0, .035, 0], { cast: false, receive: false });
  mesh3(G, new THREE.TorusGeometry(.97, .018, 8, 96), gold, [0, .2, 0], { rot: [Math.PI / 2, 0, 0], cast: false, receive: false });
  for (let i = 0; i < 32; i++) { const a = i / 32 * TAU; mesh3(G, new THREE.CylinderGeometry(.012, .012, .17, 6), gold, [Math.cos(a) * .97, .12, Math.sin(a) * .97], { cast: false, receive: false }); }
  // the pavilion: eight white-and-gold pillars, a curved golden roof, the amalaka, the kalasha, the flag
  for (let i = 0; i < 8; i++) {
    const a = (i + .5) / 8 * TAU, x = Math.cos(a) * .44, z = Math.sin(a) * .44;
    mesh3(G, new THREE.CylinderGeometry(.03, .035, .58, 10), white, [x, .33, z], { cast: false, receive: false });
    mesh3(G, new THREE.CylinderGeometry(.05, .05, .04, 10), gold, [x, .06, z], { cast: false, receive: false });
    mesh3(G, new THREE.CylinderGeometry(.05, .04, .05, 10), gold, [x, .61, z], { cast: false, receive: false });
  }
  mesh3(G, new THREE.CylinderGeometry(.58, .56, .05, 48), gold2, [0, .65, 0], { cast: false, receive: false });
  // the vimana: a stepped tower of three tiers, each ringed with little domes, crowned by a dome, the amalaka and the kalasha
  lathe([[.56, 0], [.56, .1], [.5, .12], [.5, .16], [.46, .18], [.46, .3], [.38, .32], [.38, .36], [.34, .38], [.34, .48], [.27, .5], [.27, .54], [.22, .56],
    [.24, .6], [.25, .66], [.22, .74], [.15, .8], [.06, .84], [0, .85]], gold, .67);
  for (const [n, r, y, sz] of [[10, .5, .77, .07], [8, .4, .97, .06], [6, .31, 1.17, .05]]) for (let i = 0; i < n; i++) {
    const a = (i + .5) / n * TAU;
    mesh3(G, new THREE.SphereGeometry(sz, 14, 8, 0, TAU, 0, Math.PI / 2), gold2, [Math.cos(a) * r, y, Math.sin(a) * r], { cast: false, receive: false });
    mesh3(G, new THREE.SphereGeometry(sz * .3, 8, 6), gem(i % 2 ? '#FF3050' : '#30E890'), [Math.cos(a) * (r + sz * .7), y - sz * .3, Math.sin(a) * (r + sz * .7)], { cast: false, receive: false });
  }
  lathe([[.1, 0], [.13, .03], [.135, .05], [.13, .07], [.1, .09], [0, .09]], gold2, 1.52, 32);
  lathe([[.04, 0], [.07, .03], [.08, .07], [.055, .11], [.025, .13], [.03, .15], [.015, .19], [0, .21]], gold, 1.6, 32);
  mesh3(G, new THREE.CylinderGeometry(.008, .008, .4, 6), gold, [0, 1.98, 0], { cast: false, receive: false });
  const flagGeo = new THREE.PlaneGeometry(.34, .16, 12, 2); flagGeo.translate(.17, 0, 0);
  const flag = mesh3(G, flagGeo, new THREE.MeshStandardMaterial({ color: '#FF8A1E', emissive: '#7A2A00', emissiveIntensity: .4, roughness: .7, side: THREE.DoubleSide }), [0, 2.1, 0], { cast: false, receive: false });
  const flag0 = flagGeo.attributes.position.array.slice();
  // four chhatris on the deck
  for (let i = 0; i < 4; i++) {
    const a = (i + .5) / 4 * TAU, x = Math.cos(a) * .8, z = Math.sin(a) * .8;
    for (const [dx, dz] of [[-.06, -.06], [.06, -.06], [-.06, .06], [.06, .06]]) mesh3(G, new THREE.CylinderGeometry(.01, .01, .24, 6), white, [x + dx, .17, z + dz], { cast: false, receive: false });
    mesh3(G, new THREE.SphereGeometry(.11, 20, 10, 0, TAU, 0, Math.PI / 2), gold, [x, .29, z], { cast: false, receive: false });
    mesh3(G, new THREE.SphereGeometry(.025, 10, 8), gold, [x, .41, z], { cast: false, receive: false });
  }
  // a warm glow beneath and a soft one round the roof
  const under = glow3(P, [0, -.7, 0], 4, '#FFC860', .5), halo = glow3(P, [0, .8, 0], 5, '#FFE2A0', .1);
  G.scale.set(1.25, 1, 1);
  P.pose = (p, yaw = 0, bank = 0, t = 0, sc = 1) => {
    P.position.set(p[0], p[1] + Math.sin(t * 1.7) * .04 * sc, p[2]); P.rotation.set(0, yaw, 0); P.rotateX(bank); P.rotateZ(Math.sin(t * 1.1) * .02); P.scale.setScalar(sc);
    // the flag ripples back from the pole
    const a = flagGeo.attributes.position.array;
    for (let i = 0; i < a.length; i += 3) { const x = flag0[i]; a[i + 2] = flag0[i + 2] + Math.sin(x * 22 - t * 9) * .03 * x / .34; }
    flagGeo.attributes.position.needsUpdate = true;
  };
  P.set = (t, o = {}) => { P.visible = o.on ?? true; under.material.opacity = .5 * (o.glow ?? 1) * (1 + .1 * Math.sin(t * 3)); halo.material.opacity = .1 * (o.glow ?? 1); };
  return P;
}

// ---------- the flight ----------
// where the Pushpak is at time t: an arc fraction along ROUTE, eased from stop to stop on the voice
const FLY = (() => {
  const k = (lon, lat) => ROUTE.near(lon, lat), S = STOPS;
  // [time, arc fraction]: it sets off from south of Lanka, crosses each stop as Ram names it, and lands at Prayag
  const keys = [[0, 0], [4.6, 0], [11, .012], [17.2, .028], [21.0, k(79.6, 9.17)], [24.1, k(79.2, 9.6)], [27.6, k(S.kish.lon, S.kish.lat) - .004],
    [32.2, k(S.kish.lon, S.kish.lat) + .002], [37.9, k(75.4, 18.1)], [40.6, k(S.panch.lon, S.panch.lat) - .002], [45.9, k(S.panch.lon, S.panch.lat) + .012],
    [53.3, k(S.chitra.lon, S.chitra.lat) - .012], [57.5, k(S.chitra.lon, S.chitra.lat) + .01], [60.2, .985], [64, .997], [68.8, 1]];
  const s = (t) => kf(t, keys, x => x);   // linear between keys (the shots ease their own cameras)
  return { keys, s };
})();
// the Pushpak's pose at time t on the I3 map: { p, yaw, dir }; alt = flying height above the sea (map units)
function flyPose(I3, t, alt = 5.5) {
  const s = FLY.s(t), a = ROUTE.at(s), b = ROUTE.at(Math.min(1, s + .004)), dx = b.x - a.x || a.dx, dz = b.z - a.z || a.dz;
  const g = I3.h(a.x, a.z), y = Math.max(alt, g + 3.2);
  return { p: [a.x, y, a.z], yaw: Math.atan2(dz, -dx), dir: [dx, dz].map(v => v / (Math.hypot(dx, dz) || 1)), s };
}

// ---------- Bharata's sandals: a pair of wooden padukas with gold toe-knobs, glowing ----------
function padukas3(parent, env) {
  const g = new THREE.Group(); parent.add(g);
  const wood = new THREE.MeshStandardMaterial({ color: '#5E3518', roughness: .45, metalness: .1, envMap: env, envMapIntensity: .9 });
  const gold = new THREE.MeshStandardMaterial({ color: '#F4C76C', metalness: 1, roughness: .25, envMap: env, envMapIntensity: 1.4 });
  const sole = new THREE.Shape(); sole.moveTo(0, -1); sole.bezierCurveTo(.42, -1, .46, -.4, .4, .1); sole.bezierCurveTo(.36, .6, .3, 1, 0, 1); sole.bezierCurveTo(-.3, 1, -.36, .6, -.4, .1); sole.bezierCurveTo(-.46, -.4, -.42, -1, 0, -1);
  const geo = new THREE.ExtrudeGeometry(sole, { depth: .12, bevelEnabled: true, bevelSize: .04, bevelThickness: .04, bevelSegments: 3, curveSegments: 24 });
  geo.rotateX(-Math.PI / 2);
  for (const side of [-1, 1]) {
    const s = new THREE.Group(); s.position.set(side * .55, 0, 0); s.rotation.y = side * -.08; g.add(s);
    mesh3(s, geo, wood, [0, 0, 0], { cast: false, receive: false });
    mesh3(s, new THREE.CylinderGeometry(.05, .07, .28, 12), gold, [0, .3, -.55], { cast: false, receive: false });
    mesh3(s, new THREE.SphereGeometry(.15, 16, 12), gold, [0, .5, -.55], { cast: false, receive: false });
    mesh3(s, new THREE.TorusGeometry(.42, .025, 8, 48, Math.PI), gold, [0, .02, 0], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false });
  }
  const halo = glow3(g, [0, .3, 0], 4.5, '#FFD27A', .5);
  g.set = (t, on) => { g.visible = on > .001; const k = easeOut(on); g.scale.setScalar(k * (g.userData.sc || 1)); halo.material.opacity = .5 * on * (1 + .15 * Math.sin(t * 4)); };
  g.set(0, 0); return g;
}

// ---------- the trail: sparkles left behind by the Pushpak ----------
function trail3(scene, n = 48) {
  const sp = []; for (let i = 0; i < n; i++) sp.push(glow3(scene, [0, 0, 0], 1, i % 3 ? '#FFD890' : '#FFFFFF', 0));
  return {
    set(I3, t, on = 1, sc = 1, alt = 5.5) {
      sp.forEach((s, i) => {
        const dt = (i + 1) * .045, q = flyPose(I3, t - dt, alt), r = hash(i * 3.7) - .5, r2 = hash(i * 5.1) - .5;
        s.position.set(q.p[0] + r * .5 * sc, q.p[1] - .35 * sc + r2 * .3 * sc, q.p[2] + r2 * .5 * sc);
        const a = on * (1 - i / n) * (.5 + .5 * Math.sin(t * 9 + i)); s.material.opacity = a * .8; s.scale.setScalar(sc * (.35 + .25 * hash(i)) * (1 - i / n * .5));
        s.visible = a > .01;
      });
    },
  };
}

// ---------- wisps: cloud sprites at the Pushpak's height, streaming past (speed) ----------
function wisps3(scene, n = 26) {
  const W3S = []; for (let i = 0; i < n; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex3(), transparent: true, depthWrite: false, opacity: 0, color: '#FFF4EA' }));
    scene.add(s); W3S.push(s);
  }
  return {
    // around point p, streaming against the heading dir at speed v (units a second)
    set(t, p, dir, on = 1, o = {}) {
      const span = o.span ?? 60, v = o.v ?? 14;
      W3S.forEach((s, i) => {
        const side = (hash(i * 1.3) - .5) * (o.wide ?? 30), up = (hash(i * 2.9) - .5) * (o.tall ?? 6), ph = frac(hash(i * 7.1) - t * v / span);
        const along = (ph - .35) * span;
        s.position.set(p[0] + dir[0] * along - dir[1] * side, p[1] + up + (o.dy ?? 0), p[2] + dir[1] * along + dir[0] * side);
        const w = (o.w ?? 10) * (.6 + hash(i * 4.3) * .8); s.scale.set(w, w * .42, 1);
        s.material.opacity = on * .55 * Math.sin(ph * Math.PI); s.visible = on > .01;
      });
    },
  };
}

// ---------- rain over Kishkindha: dark clouds and falling streaks (four months of rain) ----------
function rain2(c, t, k) {
  if (k <= .01) return;
  c.save(); c.globalAlpha = k * .35; c.fillStyle = '#1A2234'; c.fillRect(0, 0, W, H); c.restore();
  c.save(); c.strokeStyle = 'rgba(200,220,255,.5)'; c.lineWidth = 2; c.globalAlpha = k;
  for (let i = 0; i < 220; i++) {
    const x = frac(hash(i * 3.1) + t * .05) * (W + 300) - 150, y = frac(hash(i * 7.7) + t * (1.3 + hash(i) * .6)) * (H + 200) - 100, l = 30 + hash(i * 2.2) * 40;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x - l * .25, y + l); c.stroke();
  }
  c.restore();
}

// ---------- memory bubbles ----------
// the frames: out/pushpak/mem/<id>/f0001.jpg … (MEM_N from pushpak_mem.js), all loaded before the first frame
const MEMF = {};
for (const id in (typeof MEM_N !== 'undefined' ? MEM_N : {})) {
  MEMF[id] = [];
  for (let i = 1; i <= MEM_N[id]; i++) { const im = new Image(); im.src = `out/pushpak/mem/${id}/f${String(i).padStart(4, '0')}.jpg`; MEMF[id].push(im); PICS[`mem_${id}_${i}`] = im; }
}
const MEM_PART = { lanka: 12, setu: 11, mainaka: 9, vali: 8, sugriva: 8, jatayu: 7, khara: 5, taken: 7, ayodhya: 3 };
// memory(c, id, t, a, b, o): the clip `id` in a round golden frame from a to b (its frames play from a), popping in and
// out; o.x, o.y (centre), o.r (radius), o.from [x, y] (a trail of little bubbles from that point, e.g. the pin), o.tag
// (the label under it; default "PART N"), o.k (playback speed), o.skip (seconds into the clip to start)
function memory(c, id, t, a, b, o = {}) {
  if (t < a || t > b) return;
  const F = MEMF[id]; if (!F || !F.length) return;
  const x = o.x ?? 540, y = o.y ?? 760, r = o.r ?? 270, k = popK(t - a) * (1 - easeIn(seg(t, b - .25, b)));
  if (k <= .01) return;
  const fi = clamp(Math.floor(((t - a) * (o.k ?? 1) + (o.skip ?? 0)) * 24), 0, F.length - 1), img = F[fi];
  // the trail of little bubbles from the pin
  if (o.from) {
    const [fx, fy] = o.from; for (let i = 0; i < 3; i++) {
      const q = (i + 1) / 4, bx = lerp(fx, x, q), by = lerp(fy, y + r * .8, q), rr = lerp(10, 26, q) * k;
      c.save(); c.globalAlpha = k * .95; c.fillStyle = '#FFF3DC'; c.shadowColor = 'rgba(255,190,90,.8)'; c.shadowBlur = 18; c.beginPath(); c.arc(bx, by, rr, 0, TAU); c.fill(); c.restore();
    }
  }
  c.save(); c.translate(x, y); c.scale(k, k);
  // a warm halo, the picture in a circle, a gold ring
  c.save(); c.shadowColor = 'rgba(255,190,90,.85)'; c.shadowBlur = 60; c.fillStyle = '#FFE2A0'; c.beginPath(); c.arc(0, 0, r + 10, 0, TAU); c.fill(); c.restore();
  c.save(); c.beginPath(); c.arc(0, 0, r, 0, TAU); c.clip(); if (img && img.naturalWidth) c.drawImage(img, -r, -r, r * 2, r * 2);
  const v = c.createRadialGradient(0, 0, r * .6, 0, 0, r); v.addColorStop(0, 'rgba(255,220,160,0)'); v.addColorStop(1, 'rgba(255,200,120,.35)'); c.fillStyle = v; c.fillRect(-r, -r, r * 2, r * 2); c.restore();
  c.lineWidth = 10; c.strokeStyle = '#F4C46A'; c.beginPath(); c.arc(0, 0, r + 4, 0, TAU); c.stroke();
  c.lineWidth = 2.5; c.strokeStyle = '#FFF3DC'; c.beginPath(); c.arc(0, 0, r + 10, 0, TAU); c.stroke();
  // the tag: PART N
  const tag = o.tag ?? `PART ${MEM_PART[id]}`;
  if (tag) {
    c.font = '700 34px Cinzel'; c.letterSpacing = '3px'; const tw = c.measureText(tag).width + 50;
    c.fillStyle = '#7A1E22'; c.beginPath(); c.roundRect(-tw / 2, r - 22, tw, 52, 26); c.fill(); c.lineWidth = 3; c.strokeStyle = '#F4C46A'; c.stroke();
    c.fillStyle = '#FFE8B8'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(tag, 0, r + 5);
  }
  c.restore();
}

// ---------- 2D lettering on the map ----------
// a stop's label: the name in gold over a small line in white (today's place); o.dx/dy offset, o.big scale, o.alpha
function stopLabel(c, s, p, t, at, o = {}) {
  if (t < at) return; const [x, y, z] = toScreen3(p); if (z > 1) return;
  // kept inside the safe band (y 450–1180 above the captions, x 130–850)
  const big = o.big ?? 1, a = (o.alpha ?? 1), lx = clamp(x + (o.dx ?? 0), 150, 830), ly = clamp(y + (o.dy ?? -70 * big), 470, 1160);
  text(c, s.name, lx, ly, `700 ${Math.round(46 * big)}px Cinzel`, o.col || '#FFE2A0', { pop: t - at, alpha: a, glow: ['rgba(6,6,14,.95)', 20], spacing: 3 * big, maxW: 600 });
  if (s.sub && o.sub !== false) text(c, s.sub, lx, ly + 44 * big, `${Math.round(30 * big)}px Marcellus`, '#F4EEE4', { pop: t - at - .12, alpha: a, glow: ['rgba(6,6,14,.95)', 16], spacing: 1 });
}
// a chip: a time fact in a gold-edged pill (5 DAYS, 4 MONTHS OF RAIN, 10 YEARS)
function chip(c, txt, x, y, t, at, o = {}) {
  const k = popK(t - at) * (o.alpha ?? 1); if (k <= .01) return;
  c.save(); c.translate(x, y); c.scale(k, k); c.font = `700 ${o.size || 44}px Cinzel`; c.letterSpacing = '3px';
  const tw = c.measureText(txt).width + 60, h = (o.size || 44) * 1.5;
  c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.fillStyle = 'rgba(20,12,24,.82)'; c.beginPath(); c.roundRect(-tw / 2, -h / 2, tw, h, h / 2); c.fill(); c.shadowBlur = 0;
  c.lineWidth = 3; c.strokeStyle = '#F4C46A'; c.stroke();
  c.fillStyle = o.col || '#FFE2A0'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 0, 2); c.restore();
}
// the Panchami moon: a waxing crescent, five days old (lit on the right), low in the dusk sky
function moon2(c, x, y, r, a = 1) {
  if (a <= .01) return;
  c.save(); c.globalAlpha = a; glow(c, x, y, r * 4, '#FFF0D0', .35);
  const m = scratch('moon' + DEPTH, 256, 256); m.fillStyle = '#FFF6E0'; m.beginPath(); m.arc(128, 128, 100, 0, TAU); m.fill();
  m.globalCompositeOperation = 'destination-out'; m.beginPath(); m.arc(128 - 70, 128 - 6, 104, 0, TAU); m.fill();
  c.drawImage(m.canvas, x - r * 1.28, y - r * 1.28, r * 2.56, r * 2.56); c.restore();
}

// ---------- 2D helpers ----------
// a dark band behind the captions (the map is bright under them)
function band(c, y0, y1, a = .5) {
  if (a <= 0) return; c.save(); const g = c.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, 'rgba(6,4,6,0)'); g.addColorStop(.25, `rgba(6,4,6,${a})`); g.addColorStop(.75, `rgba(6,4,6,${a})`); g.addColorStop(1, 'rgba(6,4,6,0)');
  c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); c.restore();
}

// ---------- the card: the Parshurama series starts soon; our live wallpapers; follow ----------
const WALLS = ['hanuman', 'krishna', 'shiva'].map(k => { const im = new Image(); im.src = `assets/pushpak/wall_${k}.jpg`; PICS['wall_' + k] = im; return im; });
// a phone showing a wallpaper, centred on (x, y), w wide
function phone2(c, img, x, y, w, rot, pop) {
  const k = popK(pop); if (k <= .01) return; const h = w * 2.1, r = w * .16;
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(k, k);
  c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 30; c.shadowOffsetY = 12; c.fillStyle = '#0B0B10'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, r); c.fill(); c.shadowBlur = 0; c.shadowOffsetY = 0;
  c.save(); c.beginPath(); c.roundRect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16, r - 6); c.clip();
  if (img && img.naturalWidth) { const ih = (w - 16) * img.naturalHeight / img.naturalWidth; c.drawImage(img, -w / 2 + 8, -ih / 2, w - 16, ih); }
  c.restore();
  c.fillStyle = '#0B0B10'; c.beginPath(); c.roundRect(-w * .14, -h / 2 + 16, w * .28, 18, 9); c.fill();
  c.lineWidth = 2; c.strokeStyle = 'rgba(244,196,106,.7)'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, r); c.stroke();
  c.restore();
}
// Parashurama's axe (parashu): a long haft and a crescent blade, gold, centred on (x, y), s = its height
function parashu2(c, x, y, s, a = 1) {
  c.save(); c.translate(x, y); c.rotate(-.5); c.scale(s / 400, s / 400); c.globalAlpha = a;
  c.shadowColor = 'rgba(255,170,60,.9)'; c.shadowBlur = 40;
  c.fillStyle = '#8A5A2E'; c.beginPath(); c.roundRect(-9, -190, 18, 390, 9); c.fill();
  c.fillStyle = '#F4C46A'; c.beginPath(); c.moveTo(6, -170); c.bezierCurveTo(70, -200, 130, -170, 150, -110); c.bezierCurveTo(120, -120, 100, -100, 96, -70); c.bezierCurveTo(70, -90, 40, -95, 6, -80); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(-6, -165); c.bezierCurveTo(-40, -160, -55, -135, -50, -115); c.bezierCurveTo(-35, -122, -20, -122, -6, -110); c.closePath(); c.fill();
  c.fillStyle = '#FFE8B0'; c.fillRect(-11, -110, 22, 10); c.fillRect(-11, 150, 22, 10);
  c.restore();
}
function seriesCard(c, u, t) {
  sky(c, [[0, '#04100E'], [900, '#0F2A27'], [1920, '#050E0C']]);
  glow(c, 470, 820, 700, '#2E5F5A', .55, 'screen'); glow(c, 470, 640, 420, '#C8702E', .22, 'screen');
  motes(c, { n: 60, seed: 64, box: [-50, 300, W + 50, 1900], r: 3, col: '#F4C46A', a: .6, vx: 6, vy: -26, t });
  const X = 470, pk = d => u - d;
  picture(c, PICS.logo, X, 470, 110, 110, { pop: pk(.15), r: 55 });
  text(c, 'NEXT SERIES', X, 575, '700 34px Poppins', '#FF9A6A', { pop: pk(.3), spacing: 8 });
  text(c, 'PARSHURAMA', X, 652, '700 82px Cinzel', '#F4C46A', { pop: pk(.45), glow: ['rgba(244,196,106,.55)', 28], spacing: 3, maxW: 820 });
  text(c, 'starts soon', X, 728, 'italic 44px Marcellus', '#FBE0CF', { pop: pk(.65) });
  [-1, 0, 1].forEach((i, j) => phone2(c, WALLS[[0, 1, 2][j]], X + i * 205, 1010 + Math.abs(i) * 24, 180, i * .09 + Math.sin(t * 1.3 + j) * .01, pk(.9 + j * .12)));
  text(c, 'Our LIVE WALLPAPERS · link in bio', X, 1262, '500 36px Poppins', '#FFFFFF', { pop: pk(1.3), maxW: 840 });
  const k = popK(pk(1.6)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (k > .01) { c.save(); c.translate(X, 1372); c.scale(k, k); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-300, -46, 600, 92, 46); c.fill(); c.restore(); }
  text(c, 'Follow @therishikatha', X, 1375, '700 46px Poppins', '#FFFFFF', { pop: pk(1.6) });
  text(c, 'for more of the Ramayan & Puranas', X, 1458, '500 34px Poppins', '#CFE3DF', { pop: pk(1.85), maxW: 840 });
}
