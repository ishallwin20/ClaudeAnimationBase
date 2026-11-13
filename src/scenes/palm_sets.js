// palm_sets.js: the set of "Your palm has FOUR holy places" (ad 92): a river at dawn seen from the ghat, facing east
// (the sun ahead, low, its path glittering on the water, a few floating lamps), and your own right hand held out over
// it, palm up (palm_hand.js), with the water in its hollow, a copper lota pouring, the streams off the fingertips and
// off the web of the thumb, the falling drops, the sesame of a tarpan, and the four tirthas marked in light.
// SET.set(t, o) poses and shows everything for a frame (each shot passes its whole state); SET.W(p) is a hand-local
// point in the world, for pinning 2D labels.
const SET = (() => {
  const S = new THREE.Scene();
  const H = HAND.build();
  const HG = new THREE.Group(); HG.add(H.group); S.add(HG);
  const { surf } = H;

  // ---------- light ----------
  const hemi = new THREE.HemisphereLight('#A8B8E0', '#5A3A28', .45); S.add(hemi);
  const key = new THREE.DirectionalLight('#FFE2C4', 2.2); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -.18, right: .18, top: .18, bottom: -.18, near: .05, far: 3 }); key.shadow.bias = -.0002; key.shadow.normalBias = .0015; key.shadow.radius = 4;
  S.add(key, key.target);
  const rim = new THREE.DirectionalLight('#FFB070', 2.4); rim.position.set(-.2, .35, -2); S.add(rim, rim.target);
  const keyAt = (p) => { key.position.set(...p); key.target.position.set(0, 0, 0); };
  keyAt([.5, 1.2, .9]);

  // ---------- the river at dawn ----------
  S.fog = new THREE.Fog('#C99A86', 30, 260);
  const sky = sky3(S, [[1, '#1C2A52'], [.45, '#3E4A7A'], [.2, '#9A7088'], [.08, '#E8946A'], [.02, '#FFB872'], [0, '#FFD9A0'], [-.02, '#8A5A50'], [-1, '#2A2228']], { r: 420 });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshStandardMaterial({ color: '#6A5A68', roughness: .32, metalness: .25, envMapIntensity: .8 }));
  water.rotation.x = -Math.PI / 2; water.position.y = -1.35; water.receiveShadow = false; S.add(water);
  // the far bank: a low dark strip on the horizon
  const bank = new THREE.Mesh(new THREE.BoxGeometry(900, 1.6, 6), new THREE.MeshStandardMaterial({ color: '#4A3A3C', roughness: 1 })); bank.position.set(0, -1.0, -210); S.add(bank);
  // the sun, low ahead (east = -z), and its glitter path on the water
  const sunG = glow3(S, [-6, 9, -230], 70, '#FFD6A0', .9), sunCore = glow3(S, [-6, 9, -229], 16, '#FFF4DC', 1);
  const GL = [], rr = lcg(92);
  for (let i = 0; i < 150; i++) {
    const z = -2.5 - Math.pow(rr(), 1.6) * 180, x = -6 * (-z / 230) + (rr() - .5) * (1.2 + -z * .055);
    const s = glow3(S, [x, -1.33, z], .05 + -z * .006, rr() < .5 ? '#FFE3B0' : '#FFC88A', .8); s.ph = rr() * 6.28; s.f = 1.5 + rr() * 3; s.a0 = .5 + rr() * .5; GL.push(s);
  }
  // glints on the water right below the hand (seen behind it in the top views, as soft twinkles)
  for (let i = 0; i < 70; i++) {
    const x = (rr() - .5) * 2.4, z = -1.8 + rr() * 2.6;
    const s = glow3(S, [x, -1.33, z], .025 + rr() * .035, rr() < .5 ? '#FFE3B0' : '#FFD2A0', .6); s.ph = rr() * 6.28; s.f = 1.2 + rr() * 2.5; s.a0 = .35 + rr() * .4; GL.push(s);
  }
  // floating lamps (a few near, a few far): little leaf boats with a flame
  const LAMPS = [], leafMat = new THREE.MeshStandardMaterial({ color: '#3E5A2A', roughness: .8 });
  for (const [x, z] of [[-.32, -.75], [.36, -.2], [-.05, .35], [-.9, -3.2], [.7, -4.6], [-.2, -6.5], [1.4, -8.5], [-1.8, -10], [.3, -13], [2.6, -16], [-3, -19]]) {
    const g = new THREE.Group(); g.position.set(x, -1.33, z); S.add(g);
    if (z < -2) { const leaf = new THREE.Mesh(new THREE.SphereGeometry(.07, 12, 6), leafMat); leaf.scale.set(1.3, .25, 1); g.add(leaf); }   // near ones: just the flame (they blur into bokeh)
    const f = glow3(g, [0, .05, 0], .22, '#FFB050', .95), f2 = glow3(g, [0, .04, 0], .06, '#FFF0C0', 1); LAMPS.push({ g, f, f2, ph: x * 3.1 + z });
  }

  // ---------- the red thread (kalava) on the wrist ----------
  const KAL = [];
  for (const [dz, col, r, ph] of [[-.0027, '#A81C16', .00095, 0], [-.0009, '#C02818', .00095, 1.3], [.0009, '#D89A22', .0009, 2.1], [.0027, '#A81C16', .00095, .6]]) {
    const z0 = .071 + dz, pts = [];
    for (let i = 0; i <= 96; i++) { const a = i / 96 * Math.PI * 2, w = 1 + .012 * Math.sin(a * 9 + ph); pts.push(V3(.002 + Math.cos(a) * .0287 * w, -.0039 + Math.sin(a) * .0213 * w, z0 + .0008 * Math.sin(a * 2 + ph))); }
    const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 160, r, 8, true), new THREE.MeshStandardMaterial({ color: col, roughness: .85 }));
    m.castShadow = m.receiveShadow = true; H.group.add(m); KAL.push(m);
  }

  // ---------- the water in the palm ----------
  const waterM = new THREE.MeshPhysicalMaterial({ color: '#FFFFFF', roughness: 0, metalness: 0, transmission: 1, thickness: .0015, ior: 1.33, attenuationColor: new THREE.Color('#B8E0EE'), attenuationDistance: .03, envMapIntensity: 3.2, specularIntensity: 1, specularColor: new THREE.Color('#FFFFFF') });
  const poolC = surf(.004, -.004).p;
  const pool = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20), waterM); pool.position.copy(poolC); pool.renderOrder = 2; H.group.add(pool);
  const setPool = (k, o = {}) => { pool.visible = k > .01; const s = Math.max(.01, k); pool.scale.set(.031 * Math.sqrt(s), .0042 * s + .0005, .04 * Math.sqrt(s)); pool.position.set(poolC.x + (o.dx || 0), poolC.y - .0012 + .0012 * s, poolC.z + (o.dz || 0)); };

  // ---------- the copper lota, pouring ----------
  const copper = new THREE.MeshStandardMaterial({ color: '#C4703F', metalness: .85, roughness: .32, envMapIntensity: 1.3 });
  const lotaP = [[0, 0], [.032, 0], [.046, .014], [.052, .04], [.048, .066], [.032, .083], [.025, .092], [.026, .1], [.034, .108], [.035, .113], [.03, .114], [.022, .104], [0, .104]];
  const lota = new THREE.Group(), lotaM = new THREE.Mesh(lathe3(lotaP, 48), copper); lota.add(lotaM); S.add(lota);
  lota.position.set(-.135, .125, -.015); lota.rotation.set(0, 0, -2.0);   // to the left of the hand, tipped toward the palm
  lota.updateMatrixWorld();
  // the lowest point of its rim, in the world
  let lip = null; for (let i = 0; i < 64; i++) { const a = i / 64 * Math.PI * 2, p = lota.localToWorld(V3(Math.cos(a) * .035, .113, Math.sin(a) * .035)); if (!lip || p.y < lip.y) lip = p; }
  const pourEnd = poolC.clone().add(V3(0, .004, 0));
  const pour = stream3(S, [[lip.x, lip.y, lip.z], [lip.x + .014, lip.y - .006, lip.z], [lerp(lip.x, pourEnd.x, .62), lerp(lip.y, pourEnd.y, .45), lerp(lip.z, pourEnd.z, .6)], [pourEnd.x - .003, pourEnd.y + .008, pourEnd.z], [pourEnd.x, pourEnd.y, pourEnd.z]], .0026, { col: '#D8EEF6', opacity: .8, glow: '#4A7A90', speed: 6, rep: 2, segs: 40 });

  // ---------- falling water, in the hand's frame, for a given pose of the hand ----------
  // gravity in the hand's local frame when the hand group is turned by euler e
  const gLocal = (e) => V3(0, -1, 0).applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(...e, 'YXZ')).invert());
  function fall3(from, along, e, len = .35, r = .0011) {
    const g = gLocal(e), A = V3(...along).normalize(), p0 = from.clone(), pts = [p0];
    for (let i = 1; i <= 8; i++) { const s = i / 8, d = len * s * s; pts.push(p0.clone().addScaledVector(A, .004 * Math.min(1, s * 4)).addScaledVector(g, d + .002 * s)); }
    const m = stream3(H.group, pts.map(p => [p.x, p.y, p.z]), r, { col: '#D8EEF6', opacity: .75, glow: '#4A7A90', speed: 7, rep: 3, segs: 40 });
    m.renderOrder = 3; return m;
  }
  const DEVA_E = [-.62, 0, 0];     // fingertips down
  const PITRI_E = [-.08, 0, -.75]; // the thumb side down
  const tipFalls = H.fing.map((f, i) => fall3(H.ends[i].clone().addScaledVector(V3(...f.ups[2]), .003), f.dirs[2], DEVA_E, .4, i === 3 ? .0009 : .0011));
  const webP = surf(.047, -.011).p, webFall = fall3(webP.clone().add(V3(.004, -.001, 0)), [1, -.2, -.3], PITRI_E, .4, .0016);
  // drops: little spheres that fall along a stream's line and start again
  const dropMat = new THREE.MeshStandardMaterial({ color: '#E0F2FA', roughness: .02, metalness: .1, transparent: true, opacity: .8, envMapIntensity: 2.5 });
  const mkDrops = (stream, n, r) => Array.from({ length: n }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 8), dropMat); m.scale.y = 1.5; H.group.add(m); return { m, ph: i / n, stream }; });
  const DROPS = [...tipFalls.flatMap((s, i) => mkDrops(s, 3, .0016)), ...mkDrops(webFall, 4, .002)];
  // black sesame (tarpan) riding the web stream
  const tilMat = new THREE.MeshStandardMaterial({ color: '#1A1412', roughness: .5 });
  const TIL = Array.from({ length: 16 }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.0011, 8, 6), tilMat); m.scale.set(1, .5, 1.6); H.group.add(m); return { m, ph: (i * .618) % 1, j: [(i * 37 % 7 - 3) * .0006, (i * 13 % 5 - 2) * .0005] }; });
  const tilRest = [];

  // ---------- the four tirthas, marked in light ----------
  const ringTex = tex3('tirthaRing', 128, 128, (g) => { g.clearRect(0, 0, 128, 128); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(.35, 'rgba(255,255,255,.45)'); gr.addColorStop(.62, 'rgba(255,255,255,.12)'); gr.addColorStop(.78, 'rgba(255,255,255,.9)'); gr.addColorStop(.86, 'rgba(255,255,255,.15)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
  function marker(sp, size) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: ringTex, color: '#FFC860', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true, polygonOffset: true, polygonOffsetFactor: -4 }));
    m.position.copy(sp.p).addScaledVector(sp.n, .0012); m.lookAt(sp.p.clone().addScaledVector(sp.n, 1)); m.renderOrder = 4; H.group.add(m);
    const halo = glow3(H.group, sp.p.clone().addScaledVector(sp.n, .004).toArray(), size * 2.2, '#FFB848', .4);
    return { m, halo, p: sp.p.clone().addScaledVector(sp.n, .002), n: sp.n };
  }
  const MK = {
    deva: H.tips.map(sp => marker(sp, .013)),
    praja: [marker(surf(-.025, -.027), .02)],
    brahma: [marker(surf(.027, .025), .024)],
    pitri: [marker(surf(.043, -.012), .02)],
  };
  // the anchor of each tirtha's label (hand-local)
  const ANCH = { deva: H.tips[1].p.clone().lerp(H.tips[2].p, .5), praja: MK.praja[0].p, brahma: MK.brahma[0].p, pitri: MK.pitri[0].p };
  const COLS = { gold: new THREE.Color('#FFC860'), cold: new THREE.Color('#BFD8FF'), red: new THREE.Color('#FF5A48'), green: new THREE.Color('#9CF07A') };

  // ---------- moods ----------
  function mood(k, cold = 0, o = {}) {
    env3(S, 'dawn', { k: lerp(.55, .3, cold) * (o.envK ?? 1), bg: false, rot: 2.6 });
    sky.material.color.setScalar(lerp(1, .45, cold) * (o.bgK ?? 1)).lerp(new THREE.Color('#7088C0'), .35 * cold);
    hemi.intensity = lerp(.45, .3, cold); hemi.color.set(cold > .5 ? '#7C90C8' : '#A8B8E0');
    key.intensity = lerp(2.2, 1.2, cold) * (o.key ?? 1); key.color.set('#FFE2C4').lerp(new THREE.Color('#B8C8F0'), cold);
    rim.intensity = lerp(2.4, .6, cold) * (o.rim ?? 1);
    sunG.material.opacity = lerp(.9, .25, cold); sunCore.material.opacity = lerp(1, .3, cold);
    S.fog.color.set('#C99A86').lerp(new THREE.Color('#40506A'), cold);
    water.material.color.set('#6A5A68').lerp(new THREE.Color('#2A3446'), cold);
    return lerp(1.0, .95, cold) * (o.exposure ?? 1);
  }

  // ---------- one frame ----------
  // o: hand: { pos, rot (euler YXZ), }, pool (0..1), pour (0..1: the lota in and its stream), devaFlow, pitriFlow (0..1),
  //    til (sesame), mk: { deva, praja, brahma, pitri } each 0..1 or [k, colour name], cold (0..1)
  function set(t, o = {}) {
    const hp = o.hand || {};
    HG.position.set(...(hp.pos || [0, 0, 0])); HG.rotation.set(...(hp.rot || [0, 0, 0]), 'YXZ'); HG.updateMatrixWorld(true);
    setPool(o.pool ?? 0, o.poolO);
    lota.visible = (o.pour ?? 0) > .01;
    if (lota.visible) { const k = easeIO(clamp(o.pour)); lota.position.set(-.135 - .07 * (1 - k), .125 + .04 * (1 - k), -.015); lota.rotation.z = lerp(-1.0, -2.0, k); lota.updateMatrixWorld(); }
    pour.set(t, (o.pourFlow ?? 0));
    const df = o.devaFlow ?? 0, pf = o.pitriFlow ?? 0;
    tipFalls.forEach((s, i) => s.set(t + i * .13, df));
    webFall.set(t, pf);
    for (const d of DROPS) {
      const on = d.stream === webFall ? pf : df; d.m.visible = on > .6;
      if (!d.m.visible) continue;
      const u = ((t * 1.3 + d.ph) % 1), p = d.stream.curve.getPointAt(Math.min(.999, .15 + .85 * u)); d.m.position.copy(p);
    }
    for (const s of TIL) { s.m.visible = (o.til ?? 0) > .01 && pf > .5; if (!s.m.visible) continue; const u = ((t * .9 + s.ph) % 1), p = webFall.curve.getPointAt(Math.min(.999, .05 + .95 * u)); s.m.position.set(p.x + s.j[0], p.y, p.z + s.j[1]); s.m.rotation.set(u * 9, u * 7, 0); }
    tilRest.forEach((m, i) => { m.visible = (o.til ?? 0) > .01 && (o.pool ?? 0) > .2 && i < 14 * (o.til ?? 0) * (1 - .8 * pf); });
    // markers
    const mk = o.mk || {};
    for (const name in MK) {
      const v = mk[name] ?? 0, k = Array.isArray(v) ? v[0] : v, col = COLS[Array.isArray(v) ? v[1] : 'gold'];
      MK[name].forEach((M, i) => {
        const pulse = 1 + .08 * Math.sin(t * 5 + i);
        M.m.visible = M.halo.visible = k > .01;
        M.m.material.color.copy(col).multiplyScalar(k); M.m.scale.setScalar(pulse * (.6 + .4 * Math.min(1, k)));
        M.halo.material.color.copy(col); M.halo.material.opacity = .45 * Math.min(1, k);
      });
    }
    // the river
    for (const s of GL) s.material.opacity = s.a0 * (.35 + .65 * Math.pow(.5 + .5 * Math.sin(t * s.f + s.ph), 3)) * (1 - .7 * (o.cold ?? 0));
    for (const L of LAMPS) { const f = 1 + .12 * Math.sin(t * 11 + L.ph) + .08 * Math.sin(t * 17 + L.ph * 2); L.f.scale.setScalar(.22 * f); L.g.position.y = -1.33 + .006 * Math.sin(t * 1.3 + L.ph); L.f.material.opacity = .95 * (1 - .6 * (o.cold ?? 0)); }
    return mood(t, o.cold ?? 0, o.moodO || {});
  }
  const W = (p) => HG.localToWorld((p.isVector3 ? p : V3(...p)).clone());
  const handW = (p) => H.group.localToWorld((p.isVector3 ? p : V3(...p)).clone());
  return { S, H, HG, set, W: handW, MK, ANCH, DEVA_E, PITRI_E, poolC, lip };
})();
