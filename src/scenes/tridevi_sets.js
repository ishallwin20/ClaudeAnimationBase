// tridevi_sets.js: the 3D set of "Lakshmi was born as BRAHMA'S sister" (ad 91). One scene, built once at load:
//   STAGE  a round black-granite platform with gold inlay, floating in a dark cosmos (stars, faint nebulae).
//          Behind it, on a raised tier, the three mothers of the Pradhanika Rahasya: Mahalakshmi in bronze (centre),
//          Mahakali in black stone (her right, screen left), Mahasaraswati in white marble (screen right).
//          On the platform, three stations in a triangle, each a pair born of one mother: at the back Brahma (a lotus
//          with the Veda and a kamandalu) and Lakshmi; front left Shiva (a linga) and Saraswati; front right Vishnu (the
//          Sudarshan chakra) and Gauri. Gold threads join the pairs; on the cross the goddesses fly clockwise round the
//          circle to their husbands and red threads join the couples. Above the centre, the cosmic egg: made, broken
//          open, the world inside, a protecting shell. Lakshmi's coins. A palm-leaf manuscript at the front.
// Units are metres, y up; the stage faces +z (the camera stands at +z).

const STAGE = (() => {
  const S = new THREE.Scene();
  S.fog = new THREE.Fog('#07060C', 14, 60);
  // ---------- the cosmos ----------
  backdrop3(S, '#0A0816', '#120C22', '#05040A', 70);
  {
    const n = 2600, pos = new Float32Array(n * 3), col = new Float32Array(n * 3), r = lcg(91);
    for (let i = 0; i < n; i++) {
      const u = r() * 2 - 1, a = r() * TAU, s = Math.sqrt(1 - u * u), R = 55 + r() * 8;
      pos.set([R * s * Math.cos(a), R * u * .8 + 8, R * s * Math.sin(a)], i * 3);
      const w = r(), b = .35 + Math.pow(r(), 3) * 1.6; col.set(w < .2 ? [b, b * .85, b * .6] : w < .35 ? [b * .75, b * .85, b] : [b, b, b], i * 3);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    S.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 2.2, sizeAttenuation: false, vertexColors: true, fog: false, depthWrite: false })));
  }
  const neb = [[-22, 14, -45, 40, '#5A2A7A', .22], [18, 6, -48, 46, '#1E4A6A', .2], [0, 26, -50, 36, '#7A3A2A', .14], [-30, -4, -30, 30, '#2A2060', .18]].map(([x, y, z, s, c, a]) => glow3(S, [x, y, z], s, c, a));

  // ---------- light ----------
  const env = studioEnv3({ boxes: [[-6, 7, 6, 6, 4, 2.2], [7, 4, 3, 2, 6, 1.4], [0, 5, -8, 8, 2.4, .9], [0, 12, 0, 6, 6, 1.2]], room: '#0A080E', floor: .4 });
  S.environment = env; S.environmentIntensity = .55;
  const hemi = new THREE.HemisphereLight('#B8B0E0', '#1A1008', .35); S.add(hemi);
  const key = new THREE.DirectionalLight('#FFE6C4', 1.4); key.position.set(-5, 9, 7); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 30 }); key.shadow.bias = -.0005; key.shadow.normalBias = .02; key.shadow.radius = 4;
  S.add(key, key.target);
  const rim = new THREE.DirectionalLight('#9AB8FF', .8); rim.position.set(4, 5, -8); S.add(rim);
  const spot = (pos, at, col = '#FFE2B8') => { const L = new THREE.SpotLight(col, 0, 9, .42, .7, 1.2); L.position.set(...pos); L.target.position.set(...at); S.add(L, L.target); return L; };

  // ---------- materials ----------
  const granite = new THREE.MeshStandardMaterial({ color: '#16131A', roughness: .32, metalness: 0, envMapIntensity: .8,
    bumpMap: streak(), bumpScale: .4 });
  function streak() { return tex3('triGranite', 512, 512, (g, w, h) => { g.fillStyle = '#808080'; g.fillRect(0, 0, w, h); const r = lcg(3); for (let i = 0; i < 5000; i++) { const v = 90 + r() * 80 | 0; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2); } }, { data: true }).rep(6, 6); }
  const inlay = new THREE.MeshStandardMaterial({ color: '#D8A850', metalness: .55, roughness: .42, envMapIntensity: .6, emissive: '#3A2408', emissiveIntensity: .35 });
  const tier = new THREE.MeshStandardMaterial({ color: '#1E1A22', roughness: .5, envMapIntensity: .5 });
  const bronze = () => { const b = PMAT.brass.clone(), d = PMAT.brassD.clone(); return { skin: b, cloth: b, gold: d, lips: d, dark: PMAT.eye }; };
  const basalt = { skin: std3('#1E1C22', .4, { envMapIntensity: .7 }), cloth: std3('#24212A', .45, { envMapIntensity: .6 }), gold: new THREE.MeshStandardMaterial({ color: '#C8964A', metalness: .5, roughness: .45, envMapIntensity: .5 }), dark: std3('#0A0808', .5) };
  basalt.seat = basalt.cloth; basalt.lips = basalt.skin;
  const marble = { skin: std3('#EEE8DE', .34, { envMapIntensity: .6 }), cloth: std3('#E6DED2', .4, { envMapIntensity: .6 }), gold: new THREE.MeshStandardMaterial({ color: '#D2A458', metalness: .5, roughness: .45, envMapIntensity: .5 }), dark: std3('#2A2220', .5) };
  marble.seat = marble.cloth; marble.lips = marble.skin;

  // ---------- the platform ----------
  const PR = 3.1, PH = .22;
  mesh3(S, new THREE.CylinderGeometry(PR, PR + .08, PH, 96), granite, [0, -PH / 2, 0]);
  mesh3(S, new THREE.CylinderGeometry(PR + .1, PR + .3, .5, 96), tier, [0, -PH - .25, 0]);
  for (const [r, w] of [[PR - .12, .025], [PR - .26, .012], [1.95, .02], [.75, .016]]) mesh3(S, new THREE.TorusGeometry(r, w, 4, 160), inlay, [0, .001, 0], { rot: [-Math.PI / 2, 0, 0], scale: [1, 1, .15], cast: false });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, g = new THREE.Group(); g.rotation.y = a; S.add(g); mesh3(g, new THREE.BoxGeometry(.012, .004, PR - .26 - 1.95), inlay, [0, .002, -(1.95 + (PR - .26 - 1.95) / 2)], { cast: false }); }
  // the mothers' tier: a raised arc of stone behind, three pedestals
  const MP = { K: [-1.32, .5, -3.05], M: [0, .72, -3.35], S: [1.32, .5, -3.05] };
  {   // an annular sector behind the platform's centre, from r 2.55 to 4.3, raised .28
    const sh = new THREE.Shape(), a0 = -Math.PI / 2 - .9, a1 = -Math.PI / 2 + .9, r0 = 2.55, r1 = 4.3;
    sh.absarc(0, 0, r1, a0, a1, false); sh.lineTo(Math.cos(a1) * r0, Math.sin(a1) * r0); sh.absarc(0, 0, r0, a1, a0, true); sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, { depth: .5, bevelEnabled: true, bevelSize: .03, bevelThickness: .03, bevelSegments: 2, curveSegments: 64 });
    mesh3(S, g, tier, [0, .28, 0], { rot: [Math.PI / 2, 0, 0] });
  }
  for (const k in MP) { const [x, y, z] = MP[k]; mesh3(S, lathe3([[0, 0], [.62, 0], [.62, .06], [.54, .1], [.5, y - .12], [.58, y - .06], [.6, y], [0, y]], 48), granite, [x, 0, z]); mesh3(S, new THREE.TorusGeometry(.6, .012, 4, 64), inlay, [x, y - .002, z], { rot: [Math.PI / 2, 0, 0], cast: false }); }

  // ---------- the mothers ----------
  const MOM = {
    M: devi3(S, MP.M, 1.05, { kind: 'maha' }),
    K: devi3(S, MP.K, .9, { kind: 'kali', mats: basalt }),
    S: devi3(S, MP.S, .9, { kind: 'saraswati', mats: marble }),
  };
  for (const k in MOM) MOM[k].home = [...MP[k]];
  const momGlow = { M: glow3(S, [0, MP.M[1] + .5, MP.M[2] - .25], 2.4, '#FFC870', 0), K: glow3(S, [MP.K[0], MP.K[1] + .45, MP.K[2] - .25], 2, '#8A70FF', 0), S: glow3(S, [MP.S[0], MP.S[1] + .45, MP.S[2] - .25], 2, '#DDEBFF', 0) };
  const momSpot = { M: spot([0, 3.6, -1.2], [0, MP.M[1] + .4, MP.M[2]]), K: spot([-1.8, 3.4, -1.0], [MP.K[0], MP.K[1] + .4, MP.K[2]], '#D8D0FF'), S: spot([1.8, 3.4, -1.0], [MP.S[0], MP.S[1] + .4, MP.S[2]], '#FFF4E8') };

  // ---------- the stations ----------
  const R = 1.18, OFF = .34, STN = {};
  STN.M = [0, 0, -R]; STN.K = [-R * Math.sin(Math.PI / 3), 0, R * Math.cos(Math.PI / 3)]; STN.S = [R * Math.sin(Math.PI / 3), 0, R * Math.cos(Math.PI / 3)];
  const godAt = k => [STN[k][0] - OFF, 0, STN[k][2]], devAt = k => [STN[k][0] + OFF, 0, STN[k][2]];
  // a round stone seat under each figure
  for (const k in STN) for (const p of [godAt(k), devAt(k)]) { mesh3(S, lathe3([[0, 0], [.27, 0], [.27, .04], [.24, .06], [0, .06]], 40), tier, p); mesh3(S, new THREE.TorusGeometry(.255, .006, 4, 48), inlay, [p[0], .045, p[2]], { rot: [Math.PI / 2, 0, 0], cast: false }); }
  const SEAT = .06;

  // Brahma: a great lotus with the Veda (a palm-leaf book) and a kamandalu
  const lotusPink = std3('#E8A0B0', .55, { envMapIntensity: .5, emissive: '#3A1018', emissiveIntensity: .25, side: THREE.DoubleSide });
  const lotusDeep = std3('#D06A88', .55, { envMapIntensity: .5, side: THREE.DoubleSide });
  const goldM = new THREE.MeshStandardMaterial({ color: '#D2A04A', metalness: .55, roughness: .45, envMapIntensity: .55 });
  const leafM = std3('#D8B878', .7, { envMapIntensity: .4 }), woodM = std3('#5A3420', .6, { envMapIntensity: .4 });
  function brahma3(p) {
    const G = new THREE.Group(); G.position.set(p[0], SEAT, p[2]); S.add(G);
    mesh3(G, lathe3([[0, 0], [.16, 0], [.12, .06], [.06, .12], [.05, .2], [0, .2]], 32), goldM, [0, 0, 0]);   // the stem's foot
    const pet = new THREE.SphereGeometry(1, 16, 10); pet.scale(.34, 1, .14);
    for (const [n, tilt, rr, y, sz, m] of [[12, 1.05, .2, .2, .13, lotusDeep], [10, .7, .14, .22, .12, lotusPink], [8, .35, .07, .24, .1, lotusPink]])
      for (let i = 0; i < n; i++) { const g = new THREE.Group(); g.rotation.y = i / n * TAU + tilt; G.add(g); mesh3(g, pet, m, [0, y + sz * .6, rr], { rot: [tilt, 0, 0], scale: sz }); }
    mesh3(G, new THREE.CylinderGeometry(.08, .09, .05, 24), std3('#E8C050', .6), [0, .27, 0]);
    // the Veda on top: a palm-leaf book between wooden boards, tied
    const B = new THREE.Group(); B.position.set(0, .3, 0); B.rotation.y = .25; G.add(B);
    box3(B, .3, .016, .07, woodM, [0, .008, 0]); for (let i = 0; i < 6; i++) box3(B, .29, .006, .065, leafM, [0, .02 + i * .006, 0]); box3(B, .3, .016, .07, woodM, [0, .06, 0]);
    mesh3(B, new THREE.TorusGeometry(.04, .004, 6, 20), std3('#B02020', .6), [-.07, .035, 0], { rot: [0, Math.PI / 2, 0], scale: [1, .9, 1] });
    // the kamandalu beside
    mesh3(G, lathe3(smooth3([[0, 0], [.06, 0], [.085, .04], [.08, .08], [.045, .11], [.025, .14], [.03, .16], [0, .16]], 3), 24), goldM, [.17, .26, .06]);
    tubeP3(G, [[.23, .31, .06], [.27, .35, .06], [.29, .38, .06]], [.01, .006], goldM, { segs: 8 });
    return G;
  }
  // Shiva: a black linga on its pitha, three white lines of ash, a red dot
  const blackStone = std3('#1C1A20', .3, { envMapIntensity: .9 });
  function linga3(p) {
    const G = new THREE.Group(); G.position.set(p[0], SEAT, p[2]); S.add(G);
    mesh3(G, lathe3([[0, 0], [.2, 0], [.2, .04], [.15, .07], [.13, .14], [.22, .17], [.24, .21], [.22, .24], [0, .24]], 48), blackStone, [0, 0, 0]);
    const sp = new THREE.Group(); sp.position.set(0, .2, 0); sp.rotation.y = Math.PI / 2; G.add(sp);   // the spout to the north (here: screen left)
    mesh3(sp, new THREE.BoxGeometry(.2, .05, .12), blackStone, [0, 0, -.27]);
    mesh3(G, lathe3(smooth3([[.0, .24], [.1, .24], [.1, .42], [.085, .52], [.05, .57], [0, .585]], 4), 40), blackStone, [0, 0, 0]);
    const ash = std3('#E8E2D4', .8, { envMapIntensity: .3 });
    for (let i = 0; i < 3; i++) mesh3(G, new THREE.TorusGeometry(.1, .006, 4, 32, Math.PI * .8), ash, [0, .43 - i * .028, 0], { rot: [0, Math.PI * .1 - Math.PI / 2 + Math.PI, 0], scale: [1.01, 1, 1.01], cast: false });
    mesh3(G, new THREE.SphereGeometry(.012, 10, 8), std3('#C01818', .5), [0, .405, .098], { cast: false });
    return G;
  }
  // Vishnu: the Sudarshan chakra standing on a small lotus, turning; the conch beside
  function chakra3(p) {
    const G = new THREE.Group(); G.position.set(p[0], SEAT, p[2]); S.add(G);
    mesh3(G, lathe3([[0, 0], [.15, 0], [.12, .05], [.05, .1], [.04, .2], [0, .2]], 32), goldM, [0, 0, 0]);
    const W = new THREE.Group(); W.position.set(0, .44, 0); G.add(W);
    mesh3(W, new THREE.TorusGeometry(.2, .022, 10, 64), goldM, [0, 0, 0]);
    mesh3(W, new THREE.TorusGeometry(.13, .012, 8, 48), goldM, [0, 0, 0]);
    mesh3(W, new THREE.CylinderGeometry(.05, .05, .04, 24), goldM, [0, 0, 0], { rot: [Math.PI / 2, 0, 0] });
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; mesh3(W, new THREE.BoxGeometry(.012, .16, .014), goldM, [Math.sin(a) * .12, Math.cos(a) * .12, 0], { rot: [0, 0, -a] }); }
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; mesh3(W, new THREE.ConeGeometry(.022, .07, 6), goldM, [Math.sin(a) * .245, Math.cos(a) * .245, 0], { rot: [0, 0, -a + .3] }); }
    mesh3(G, new THREE.CylinderGeometry(.015, .02, .2, 10), goldM, [0, .2 + .1 - .05, 0]);
    // the conch
    const shell = std3('#F2ECE0', .45, { envMapIntensity: .5 });
    mesh3(G, lathe3(smooth3([[0, 0], [.035, .02], [.06, .07], [.055, .12], [.03, .17], [0, .2]], 3), 20), shell, [.2, .04, .08], { rot: [0, 0, Math.PI / 2 - .2] });
    return { G, W };
  }
  const GOD = { M: brahma3(godAt('M')), K: linga3(godAt('K')), S: chakra3(godAt('S')) };
  const godTop = { M: .45, K: .62, S: .7 };
  // the daughters
  const DM = { L: bronze(), SA: bronze(), G: bronze() };
  const DAU = { L: devi3(S, [0, SEAT, 0], .7, { kind: 'lakshmi', mats: DM.L }), SA: devi3(S, [0, SEAT, 0], .7, { kind: 'saraswati', mats: DM.SA }), G: devi3(S, [0, SEAT, 0], .7, { kind: 'gauri', mats: DM.G }) };
  const born = { L: 'M', SA: 'K', G: 'S' }, wed = { L: 'S', SA: 'M', G: 'K' };   // the station each is born at, and married at
  const DTOP = .76, ROW = { L: [-.6, .02, 1.3], SA: [0, .02, 1.05], G: [.6, .02, 1.3] };   // the three side by side at the front (the ask)
  const stSpot = { M: spot([0, 3.2, 1.2], [0, .3, STN.M[2]]), K: spot([-2.6, 3.2, 2.4], [STN.K[0], .3, STN.K[2]]), S: spot([2.6, 3.2, 2.4], [STN.S[0], .3, STN.S[2]]) };
  const dauGlow = {}; for (const k in DAU) dauGlow[k] = glow3(S, [0, 0, 0], 1.3, '#FFD890', 0);
  const godGlow = {}; for (const k in GOD) godGlow[k] = glow3(S, [godAt(k)[0], .35, godAt(k)[2]], 1.2, '#FFD890', 0);

  // ---------- threads: a glowing tube that grows along its points ----------
  function thread3(pts, r, col, k = 1.6) {
    const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    const curve = new THREE.CatmullRomCurve3(pts.map(p => V3(...p))), geo = new THREE.TubeGeometry(curve, 80, r, 8, false);
    const M = mesh3(S, geo, m, [0, 0, 0], { cast: false, receive: false }); M.renderOrder = 3;
    const nIdx = geo.index.count, head = glow3(S, [0, 0, 0], r * 26, col, 0);
    M.set = (g, a = 1) => {
      M.visible = g > .001 && a > .001; head.visible = M.visible && g < .999;
      if (!M.visible) { head.visible = false; return; }
      geo.setDrawRange(0, Math.max(6, Math.floor(nIdx * clamp(g) / 6) * 6)); m.opacity = a;
      const hp = curve.getPointAt(clamp(g)); head.position.copy(hp); head.material.opacity = a * .9;
    };
    M.curve = curve; M.set(0); return M;
  }
  const arcPts = (a, b, h, n = 6) => Array.from({ length: n + 1 }, (_, i) => { const u = i / n; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u) + Math.sin(u * Math.PI) * h, lerp(a[2], b[2], u)]; });
  // the mothers' births: a stream from each mother down to her pair's station
  const birth = {}; for (const k in STN) { const m = MP[k], s = STN[k]; birth[k] = thread3([[m[0], m[1] + .5, m[2]], [lerp(m[0], s[0], .4), m[1] + .9, lerp(m[2], s[2], .4)], [s[0], .9, s[2] - .1], [s[0], .25, s[2]]], .007, k === 'K' ? '#B8A8FF' : k === 'S' ? '#E8F2FF' : '#FFD080'); }
  // the sibling threads (gold) at each station, god to goddess
  const sib = {}; for (const k in STN) sib[k] = thread3(arcPts([godAt(k)[0], .38, godAt(k)[2] + .02], [devAt(k)[0], .45, devAt(k)[2] + .02], .22), .007, '#FFC860');
  // the couples' threads (red-gold), from each god to his wife's slot at his station
  const wedT = {}; for (const k in STN) wedT[k] = thread3(arcPts([godAt(k)[0], .38, godAt(k)[2] + .02], [devAt(k)[0], .45, devAt(k)[2] + .02], .26), .009, '#FF5A3A');

  // the goddess's place: born at one station, married at another; the flight is clockwise round the circle (seen from
  // above, north up), out a little and up over the emblems on the way
  const polar = (p) => [Math.atan2(p[2], p[0]), Math.hypot(p[0], p[2])];
  function dauPos(k, x) {
    const a = devAt(born[k]), b = devAt(wed[k]); if (x <= 0) return a; if (x >= 1) return b;
    let [a0, r0] = polar(a), [a1, r1] = polar(b); while (a1 < a0) a1 += TAU;
    const u = easeIO(x), ang = lerp(a0, a1, u), rr = lerp(r0, r1, u) + Math.sin(u * Math.PI) * .55;
    return [Math.cos(ang) * rr, SEAT + Math.sin(u * Math.PI) * .75, Math.sin(ang) * rr];
  }
  const mergeT = {}; for (const k in born) { const p = devAt(wed[k]), m = MP.M; mergeT[k] = thread3([[p[0], .75, p[2]], [p[0] * .8, 1.9, p[2] - .3], [m[0] + p[0] * .35, m[1] + 1.55, m[2] + .3], [m[0] + p[0] * .08, m[1] + 1.05, m[2] - .2]], .008, '#FFD890', 1.1); }
  const trail = {}; for (const k in DAU) trail[k] = thread3(Array.from({ length: 25 }, (_, i) => { const p = dauPos(k, i / 24); return [p[0], p[1] + .3, p[2]]; }), .01, '#FFD890');

  // ---------- the cosmic egg ----------
  const EGG = new THREE.Group(); EGG.position.set(0, 1.75, -.25); S.add(EGG);
  const eggTex = tex3('eggCrackle', 512, 512, (g, w, h) => { g.fillStyle = '#B8862E'; g.fillRect(0, 0, w, h); const r = lcg(12); for (let i = 0; i < 40; i++) { const x = r() * w, y = r() * h, rr = 30 + r() * 90, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, r() < .5 ? 'rgba(240,200,120,.25)' : 'rgba(80,48,12,.25)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); } for (let i = 0; i < 320; i++) { g.strokeStyle = `rgba(60,34,8,${.25 + r() * .35})`; g.lineWidth = .8 + r() * 1.5; let x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); for (let j = 0; j < 5; j++) { x += (r() - .5) * 40; y += (r() - .5) * 40; g.lineTo(x, y); } g.stroke(); } });
  const eggM = new THREE.MeshStandardMaterial({ map: eggTex, color: '#FFFFFF', metalness: .5, roughness: .42, envMapIntensity: .6, emissive: '#FFB040', emissiveIntensity: 0 });
  const eggR = .4, prof = (from, to) => Array.from({ length: 25 }, (_, i) => { const v = lerp(from, to, i / 24), y = Math.cos(v) * eggR * 1.3, r = Math.sin(v) * eggR * (1 - .12 * Math.cos(v)); return [r, y]; });
  // the halves split along a jagged seam: the top half's lower rim and the bottom half's upper rim share a zigzag
  const zig = (a) => .06 * Math.sin(a * 7) + .03 * Math.sin(a * 13 + 1);
  function half(top) {
    const g = new THREE.LatheGeometry((top ? prof(0, Math.PI / 2 + .05) : prof(Math.PI / 2 - .05, Math.PI)).map(([r, y]) => new THREE.Vector2(Math.max(r, .0005), y)), 64), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); if (Math.abs(y) < .07) { const a = Math.atan2(z, x); p.setY(i, zig(a)); } }
    g.computeVertexNormals(); return g;
  }
  const eggTop = mesh3(EGG, half(true), eggM, [0, 0, 0]), eggBot = mesh3(EGG, half(false), eggM, [0, 0, 0]);
  eggM.side = THREE.DoubleSide;
  const seamM = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FFE0A0').multiplyScalar(2), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const seam = mesh3(EGG, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 96 }, (_, i) => { const a = i / 96 * TAU; return V3(Math.cos(a) * eggR * 1.005, zig(a), Math.sin(a) * eggR * 1.005); }), true), 192, .008, 6, true), seamM, [0, 0, 0], { cast: false });
  const eggGlow = glow3(EGG, [0, 0, 0], 2.6, '#FFC060', 0), eggFlash = glow3(EGG, [0, 0, 0], 5, '#FFF0C8', 0);
  // the world inside: a small blue-green world with a thin atmosphere
  const worldTex = tex3('triWorld', 512, 256, (g, w, h) => {
    g.fillStyle = '#1C4A8A'; g.fillRect(0, 0, w, h); const r = lcg(5);
    for (let i = 0; i < 26; i++) { const x = r() * w, y = h * .15 + r() * h * .7, s = 18 + r() * 50; g.fillStyle = r() < .7 ? '#3E7A3A' : '#8A7A48'; g.beginPath(); for (let j = 0; j < 9; j++) { const a = j / 9 * TAU, rr = s * (.6 + r() * .6); g.lineTo(x + Math.cos(a) * rr * 1.4, y + Math.sin(a) * rr * .8); } g.fill(); }
    g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(0, 0, w, h * .07); g.fillRect(0, h * .93, w, h * .07);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,255,255,${.15 + r() * .25})`; g.beginPath(); g.ellipse(r() * w, r() * h, 20 + r() * 50, 3 + r() * 6, 0, 0, TAU); g.fill(); }
  });
  const WORLD = new THREE.Group(); EGG.add(WORLD);
  const worldM = new THREE.MeshStandardMaterial({ map: worldTex, roughness: .7, emissive: '#1A3A6A', emissiveIntensity: .35, envMapIntensity: .4 });
  const worldBall = mesh3(WORLD, new THREE.SphereGeometry(.24, 48, 32), worldM, [0, 0, 0], { cast: false });
  const atmo = glow3(WORLD, [0, 0, 0], 1.0, '#7AB8FF', .0);
  // the protecting shell: a gold fresnel sphere, and a ring turning round it
  const shellM = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { k: { value: 0 }, col: { value: new THREE.Color('#FFC860') } },
    vertexShader: 'varying vec3 vN, vV; void main() { vec4 p = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-p.xyz); gl_Position = projectionMatrix * p; }',
    fragmentShader: 'uniform float k; uniform vec3 col; varying vec3 vN, vV; void main() { float f = pow(1. - abs(dot(vN, vV)), 2.2); gl_FragColor = vec4(col * f * k * 1.4, 1.); }' });
  const shell = mesh3(WORLD, new THREE.SphereGeometry(.5, 48, 32), shellM, [0, 0, 0], { cast: false, receive: false });
  const ring = mesh3(WORLD, new THREE.TorusGeometry(.56, .008, 6, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color('#FFD890').multiplyScalar(1.6), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), [0, 0, 0], { cast: false });
  // the couples' streams up to the egg: Brahma and Saraswati (make), Shiva and Gauri (open), Vishnu and Lakshmi (protect)
  const EGGP = [0, 1.75, -.25];
  const eggStream = {}; for (const k in STN) { const s = STN[k]; eggStream[k] = thread3([[s[0], .7, s[2]], [s[0] * .75, 1.6, s[2] * .75 - .1], [s[0] * .3, 2.05, -.25 + s[2] * .3], EGGP], .014, k === 'M' ? '#FFE0A0' : k === 'K' ? '#FF8A50' : '#FFD060'); }

  // ---------- Lakshmi's coins ----------
  const coinM = new THREE.MeshStandardMaterial({ color: '#E0B050', metalness: .55, roughness: .4, envMapIntensity: .6 });
  const NC = 36, coinGeo = new THREE.CylinderGeometry(.03, .03, .006, 20), coins = [], cr = lcg(33);
  for (let i = 0; i < NC; i++) coins.push({ m: mesh3(S, coinGeo, coinM, [0, 0, 0], { cast: false }), t0: i * .09 + cr() * .05, vx: (cr() - .5) * .9, vz: .3 + cr() * .7, spin: (cr() - .5) * 18 });

  // ---------- the palm-leaf manuscript at the front, on a low stand ----------
  const BOOK = new THREE.Group(); BOOK.position.set(0, 0, 2.35); S.add(BOOK);
  mesh3(BOOK, lathe3([[0, 0], [.32, 0], [.3, .05], [.16, .08], [.14, .26], [.24, .3], [0, .3]], 40), woodM, [0, 0, 0]);
  const scriptTex = tex3('triScript', 1024, 256, (g, w, h) => {
    g.fillStyle = '#D8B878'; g.fillRect(0, 0, w, h); const r = lcg(8);
    for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(120,80,30,${.05 + r() * .08})`; g.fillRect(r() * w, r() * h, 6 + r() * 40, 1); }
    g.fillStyle = 'rgba(40,20,8,.85)';
    for (let row = 0; row < 5; row++) { const y = 40 + row * 44; g.fillRect(70, y - 14, w - 140, 2.5); let x = 72; while (x < w - 80) { const cw = 8 + r() * 14; if (r() < .85) { g.fillRect(x, y - 13, 2.5, 12 + r() * 10); g.fillRect(x, y - 2, cw * .7, 2.5); if (r() < .5) g.beginPath(), g.arc(x + cw * .4, y + 4, 4, 0, TAU), g.fill(); } x += cw + (r() < .15 ? 14 : 2); } }
    g.fillStyle = 'rgba(60,30,10,.5)'; for (const x of [w * .3, w * .7]) { g.beginPath(); g.arc(x, h / 2, 9, 0, TAU); g.fill(); }
  });
  const leafTop = new THREE.MeshStandardMaterial({ map: scriptTex, roughness: .75, envMapIntensity: .4 });
  const BK = new THREE.Group(); BK.position.set(0, .3, 0); BOOK.add(BK);
  for (let i = 0; i < 8; i++) box3(BK, .62, .005, .15, i === 7 ? [leafM, leafM, leafTop, leafM, leafM, leafM] : leafM, [0, .006 + i * .0055, 0]);
  box3(BK, .64, .014, .16, woodM, [0, .0, 0]);
  const cover = new THREE.Group(); cover.position.set(0, .05, -.08); BK.add(cover);   // the top board, hinged at the back, lifts open
  box3(cover, .64, .014, .16, woodM, [0, 0, .08]);
  const bookGlow = glow3(BOOK, [0, .4, 0], 1.6, '#FFD890', 0);

  // ---------- set: everything that moves, from one object ----------
  // o: moms {M,K,S} 0..1 (appear), split 0..1 (Kali and Saraswati slide out of Mahalakshmi to their pedestals),
  //    momLit {M,K,S}, gods {M,K,S} 0..1, daus {L,SA,G} 0..1, birth {M,K,S} 0..1, sib {M,K,S} [grow, alpha],
  //    cross {L,SA,G} 0..1, trail {L,SA,G} [grow, alpha], wed {M,K,S} [grow, alpha], lit {L,SA,G} 0..1 (dims a goddess),
  //    stLit {M,K,S}, egg { form, open, world, protect, streams {M,K,S} }, coins 0..1 (s since they began), book 0..1 open,
  //    red (Gauri's red light), merge {L,SA,G} [grow, alpha] (the daughters' light rising to Mahalakshmi), momGlow, dauGlow,
//    godGlow {k: 0..1} (extra halo), neb, key (light levels)
  const lastO = {};
  function set(t, o = {}) {
    const g = (v, k, d = 0) => (v && v[k] != null ? v[k] : d);
    // mothers
    for (const k in MOM) {
      const a = g(o.moms, k, 0), m = MOM[k]; m.root.visible = a > .001;
      const home = MP[k], from = k === 'M' ? home : [MP.M[0], MP.M[1], MP.M[2] + .05], u = k === 'M' ? 1 : easeIO(g(o.split, k, 1));
      m.root.position.set(lerp(from[0], home[0], u), lerp(from[1], home[1], u), lerp(from[2], home[2], u));
      m.root.scale.setScalar(Math.max(.001, easeOutBack(clamp(a))));
      momGlow[k].material.opacity = g(o.momGlow, k, 0); momSpot[k].intensity = 9 * g(o.momLit, k, a);
    }
    // gods and daughters
    for (const k in GOD) { const a = g(o.gods, k, 0), G = GOD[k].G || GOD[k]; G.visible = a > .001; G.scale.setScalar(Math.max(.001, easeOutBack(clamp(a)))); godGlow[k].material.opacity = .7 * bump01(clamp(a), 0, 1) + g(o.godGlow, k, 0); }
    GOD.S.W.rotation.z = -t * 1.2;
    for (const k in DAU) {
      const a = g(o.daus, k, 0), D = DAU[k]; D.root.visible = a > .001; D.root.scale.setScalar(Math.max(.001, easeOutBack(clamp(a))));
      let p = dauPos(k, g(o.cross, k, 0)); const rw = g(o.row, k, 0);
      if (rw > 0) { const q = ROW[k], u = easeIO(clamp(rw)); p = [lerp(p[0], q[0], u), lerp(p[1], q[1], u) + Math.sin(u * Math.PI) * .5, lerp(p[2], q[2], u)]; }
      D.root.position.set(...p); D.root.rotation.y = 0;
      const lit = g(o.lit, k, 1);
      dauGlow[k].position.set(p[0], p[1] + .4, p[2] - .05); dauGlow[k].material.opacity = .8 * bump01(clamp(a), 0, 1) + g(o.dauGlow, k, 0);
      setLit(k, lit);
    }
    for (const k in stSpot) stSpot[k].intensity = 10 * g(o.stLit, k, 1);
    // threads
    for (const k in birth) birth[k].set(g(o.birth, k, 0), 1 - seg(g(o.birth, k, 0), 1, 1.0001) * 0 - (g(o.birthOut, k, 0)));
    for (const k in sib) { const v = g(o.sib, k, [0, 0]); sib[k].set(v[0], v[1]); }
    for (const k in wedT) { const v = g(o.wed, k, [0, 0]); wedT[k].set(v[0], v[1]); }
    for (const k in trail) { const v = g(o.trail, k, [0, 0]); trail[k].set(v[0], v[1]); }
    for (const k in mergeT) { const v = g(o.merge, k, [0, 0]); mergeT[k].set(v[0], v[1]); }
    // egg
    const E = o.egg || {}, form = E.form ?? 0, open = E.open ?? 0, wk = E.world ?? 0, pk = E.protect ?? 0;
    EGG.visible = form > .001;
    const es = easeOutBack(clamp(form)) * (1 + .015 * Math.sin(t * 2.2));
    eggTop.scale.setScalar(Math.max(.001, es)); eggBot.scale.setScalar(Math.max(.001, es)); seam.scale.setScalar(Math.max(.001, es));
    const ou = easeOut(clamp(open));
    eggTop.position.set(0, ou * .55, -ou * .25); eggTop.rotation.set(-ou * 1.0, 0, ou * .3); eggBot.position.set(0, -ou * .35, ou * .05); eggBot.rotation.set(ou * .35, 0, -ou * .15);
    eggTop.visible = eggBot.visible = open < .98; eggM.opacity = 1 - seg(open, .6, .98); eggM.transparent = open > .6;
    eggM.emissiveIntensity = .08 * form + .5 * bump01(open, -.2, .5) + (E.charge ?? 0) * .3;
    seamM.opacity = clamp((E.charge ?? 0) * 1.4) * (1 - seg(open, .1, .4));
    eggGlow.material.opacity = .12 * form + .25 * (E.charge ?? 0); eggFlash.material.opacity = bump01(open, -.05, .6) * .9;
    WORLD.visible = wk > .001; WORLD.scale.setScalar(Math.max(.001, easeOutBack(clamp(wk)))); worldBall.rotation.y = t * .25; atmo.material.opacity = .45 * wk;
    shellM.uniforms.k.value = pk; ring.material.opacity = pk * .8; ring.rotation.set(1.2, t * .6, .3);
    for (const k in eggStream) eggStream[k].set(g(E.streams, k, 0), 1 - g(E.streamsOut, k, 0));
    // coins: from Lakshmi's hand wherever she is, falling and rolling away across the floor
    const ct = o.coins ?? -1, L = DAU.L, base = L.root.position, sc = L.root.scale.x;
    for (const c of coins) {
      const tt = ct - c.t0; c.m.visible = ct >= 0 && tt > 0;
      if (!c.m.visible) continue;
      const fall = Math.min(tt, .45), y0 = base.y + L.coinAt[1] * sc + .02;
      let x = base.x + L.coinAt[0] * sc + c.vx * .05 * fall, z = base.z + L.coinAt[2] * sc + .05 * fall, y = Math.max(.012, y0 - 4.9 * fall * fall);
      if (tt > .45) { const r = tt - .45; x += c.vx * r * .6 * Math.exp(-r * .4); z += c.vz * r * .6 * Math.exp(-r * .4); y = .012; }
      c.m.position.set(x, y, z); c.m.rotation.set(tt < .45 ? tt * c.spin : Math.PI / 2 * 0 + .0, tt * c.spin * .3, tt < .45 ? tt * 4 : 0);
    }
    // the book
    const bk = o.book ?? 0; BOOK.visible = !!o.bookOn; cover.rotation.x = -easeIO(clamp(bk)) * 2.2; bookGlow.material.opacity = .9 * clamp(bk);
    // Gauri's red light (dangerous), the merge
    redL.intensity = 3.2 * (o.red ?? 0); redL.position.set(DAU.G.root.position.x + .6, 1.4, DAU.G.root.position.z + .9); redL.target.position.copy(DAU.G.root.position);
    neb.forEach((n, i) => n.material.opacity = [.22, .2, .14, .18][i] * (o.neb ?? 1));
    key.intensity = 1.4 * (o.key ?? 1); hemi.intensity = .35 * (o.key ?? 1);
  }
  const redL = new THREE.SpotLight('#FF3020', 0, 6, .5, .6, 1.2); S.add(redL, redL.target);
  // dim a goddess: darken her own bronze
  const dauMats = {}; for (const k in DM) dauMats[k] = [DM[k].skin, DM[k].gold].map(m => ({ m, c: m.color.clone(), e: m.envMapIntensity }));
  function setLit(k, lit) { for (const x of dauMats[k]) { x.m.color.copy(x.c).multiplyScalar(lerp(.12, 1, lit)); x.m.envMapIntensity = x.e * lerp(.1, 1, lit); } }
  const easeOutBack = (x) => { if (x <= 0) return 0; if (x >= 1) return 1; const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const easeOut = (x) => 1 - Math.pow(1 - clamp(x), 3);
  set(0, {});
  return { S, set, born, wed, ROW, MP, STN, godAt, devAt, dauPos, MOM, DAU, GOD, godTop, DTOP, EGGP, BOOK, env, key };
})();
