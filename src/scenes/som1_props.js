// som1_props.js: ad 120's own pieces (12 JYOTIRLINGAS Episode 1, Somnath I).
//   phaseMoonTex3(): the moon as a canvas texture redrawn per phase (.phase(f, side, sick)): f the lit fraction (0 new .. 1
//     full), side +1 lit on the right (waxing), sick 0..1 (the curse: grey, blotched, dim).
//   story3(): the shore at Prabhasa long before any temple: moonlit sand, the sea, the sky with its stars, the moon,
//     Daksha's 27 daughters as the 27 nakshatras along the moon's path (Rohini among them), the Moon god Chandra as a pale
//     seated figure before an earthen linga (Kotirudra 14.36–37), rings of his chant, Shiva's pillar of light.
//   AHW: Ahilyabai Holkar's works for the map (her Wikipedia article's lists of charities); princelyDots(): ~560 points
//     inside India for Patel's princely states.

function phaseMoonTex3() {
  const S = 512, cv = document.createElement('canvas'); cv.width = cv.height = S; const g = cv.getContext('2d');
  // the full moon's face, drawn once: maria (dark seas), craters, a soft limb
  const face = document.createElement('canvas'); face.width = face.height = S; const f = face.getContext('2d');
  const R = S * .44, C = S / 2;
  { const gr = f.createRadialGradient(C - 40, C - 40, 20, C, C, R); gr.addColorStop(0, '#FFFDF2'); gr.addColorStop(.7, '#ECE6D4'); gr.addColorStop(1, '#BDB6A2');
    f.fillStyle = gr; f.beginPath(); f.arc(C, C, R, 0, TAU); f.fill();
    f.save(); f.clip(); const r = lcg(8); f.filter = 'blur(10px)';
    for (const [x, y, rr] of [[-.25, -.2, .3], [.15, -.3, .22], [.25, .05, .26], [-.1, .2, .2], [-.35, .15, .14], [.05, .35, .12]]) { f.fillStyle = 'rgba(120,118,112,.38)'; f.beginPath(); f.arc(C + x * R, C + y * R, rr * R, 0, TAU); f.fill(); }
    f.filter = 'blur(1px)'; for (let i = 0; i < 70; i++) { const a = r() * TAU, d = Math.sqrt(r()) * R * .95, cr = 2 + r() * 12; f.strokeStyle = `rgba(90,86,80,${.15 + r() * .2})`; f.lineWidth = 1.5; f.beginPath(); f.arc(C + Math.cos(a) * d, C + Math.sin(a) * d, cr, 0, TAU); f.stroke(); }
    f.restore(); }
  const mask = document.createElement('canvas'); mask.width = mask.height = S; const m = mask.getContext('2d');
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  let last = '';
  tex.phase = (fr, side = 1, sick = 0) => {
    const key = fr.toFixed(3) + side + sick.toFixed(2); if (key === last) return tex; last = key;
    g.clearRect(0, 0, S, S);
    // earthshine on the dark part
    g.globalAlpha = .1 + .05 * (1 - fr); g.drawImage(face, 0, 0); g.globalAlpha = 1;
    // the lit part's mask: a half disc on the lit side, with the terminator's ellipse added (gibbous) or cut out (crescent)
    m.clearRect(0, 0, S, S); m.globalCompositeOperation = 'source-over'; m.fillStyle = '#fff';
    m.beginPath(); m.arc(C, C, R + 1, -Math.PI / 2, Math.PI / 2, side < 0); m.closePath(); m.fill();
    const rx = Math.abs(1 - 2 * fr) * (R + 1);
    m.globalCompositeOperation = fr >= .5 ? 'source-over' : 'destination-out';
    m.beginPath(); m.ellipse(C, C, Math.max(.01, rx), R + 1, 0, 0, TAU); m.fill();
    m.globalCompositeOperation = 'source-in'; m.drawImage(face, 0, 0);
    if (sick > 0) { m.globalCompositeOperation = 'source-atop'; m.fillStyle = `rgba(110,90,96,${.55 * sick})`; m.fillRect(0, 0, S, S); }
    g.drawImage(mask, 0, 0);
    tex.needsUpdate = true; return tex;
  };
  tex.phase(1); return tex;
}
// a moon in a scene: the sprite and its halo; .set(on, f, side, sick, size)
function phaseMoon3(parent, tex, pos, size = 90) {
  const G = new THREE.Group(); G.position.set(...pos); parent.add(G);
  const halo = glow3(G, [0, 0, 0], size * 5, '#9FB4E8', .5), halo2 = glow3(G, [0, 0, 0], size * 2, '#E8EEFF', .4);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, fog: false, depthWrite: false })); sp.scale.setScalar(size); G.add(sp);
  G.set = (on, f = 1, side = 1, sick = 0, sz = size) => {
    G.visible = on > .01; tex.phase(f, side, sick); sp.material.opacity = on; sp.scale.setScalar(sz);
    const lit = Math.pow(f, .7) * (1 - .7 * sick);
    halo.material.opacity = .5 * on * lit; halo.scale.setScalar(sz * (2.5 + 2.5 * lit)); halo2.material.opacity = .4 * on * lit; halo2.scale.setScalar(sz * 2);
    halo.material.color.set(sick > .3 ? '#B08A90' : '#9FB4E8');
  };
  return G;
}

// ---------- the shore at Prabhasa, long ago ----------
function story3(seaNrm) {
  const scene = new THREE.Scene();
  const sky = sky3(scene, [[1, '#02040C'], [.5, '#06102A'], [.12, '#0E2244'], [0, '#1E3A5E'], [-.2, '#0A1428'], [-1, '#02040A']], { r: 5000 });
  scene.fog = new THREE.FogExp2('#14284A', .0016);
  const hemi = new THREE.HemisphereLight('#7A90C8', '#3A3020', .5); scene.add(hemi);
  const moonL = new THREE.DirectionalLight('#C8D4FF', 1.4); moonL.castShadow = true; moonL.shadow.mapSize.set(2048, 2048);
  Object.assign(moonL.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 2000 }); moonL.shadow.bias = -.0004; scene.add(moonL, moonL.target);
  // the stars: a dome of points, and the 27 nakshatras along the moon's path
  const sg = new THREE.BufferGeometry(), sp = [], rs = lcg(77);
  for (let i = 0; i < 4000; i++) { const a = rs() * TAU, el = Math.asin(.04 + rs() * .96), Rr = 3000; sp.push(Math.cos(a) * Math.cos(el) * Rr, Math.sin(el) * Rr, Math.sin(a) * Math.cos(el) * Rr); }
  sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: '#FFFFFF', size: 2.2, sizeAttenuation: false, transparent: true, opacity: .85, fog: false, depthWrite: false }));
  const sky2 = new THREE.Group(); sky2.add(stars); scene.add(sky2);
  // the moon's path: an arc rising across the southern sky (narrow enough for a portrait frame); the moon at its middle,
  // Rohini the star beside it (on screen only: the order of the other 26 isn't drawn)
  const pathAt = (k) => { const az = lerp(-.3, .3, k), el = lerp(.14, .7, k) + .05 * Math.sin(k * Math.PI), Rr = 1400; return [-Math.sin(az) * Math.cos(el) * Rr, Math.sin(el) * Rr, Math.cos(az) * Math.cos(el) * Rr]; };
  const MPOS = pathAt(.5), ROH = 13;
  const naks = []; for (let i = 0; i < 27; i++) { const k = i < 13 ? i / 12.4 * .45 : .55 + (i - 13) / 13 * .45, p = pathAt(k); const s = glow3(sky2, p, 60, '#DCE6FF', 0), core = glow3(sky2, p, 16, '#FFFFFF', 0); naks.push({ s, core, p }); }
  naks[ROH].s.material.color.set('#FFB27A');
  const moonTex = phaseMoonTex3(), moon = phaseMoon3(sky2, moonTex, MPOS, 150);
  // the sand and the sea
  const sand = mesh3(scene, new THREE.PlaneGeometry(4000, 2000), new THREE.MeshStandardMaterial({ color: '#7E7058', roughness: .95 }), [0, 0, -990], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const shore = mesh3(scene, new THREE.PlaneGeometry(4000, 12), new THREE.MeshStandardMaterial({ color: '#5C5446', roughness: .4, metalness: .1 }), [0, -.05, 14], { rot: [-Math.PI / 2 + .03, 0, 0], cast: false });
  const sea = mesh3(scene, new THREE.PlaneGeometry(40000, 40000), new THREE.MeshStandardMaterial({ color: '#0E2234', roughness: .1, metalness: .2, normalMap: seaNrm, normalScale: new THREE.Vector2(.35, .35) }), [0, -.2, 20000 + 18], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false });
  // the moon's path of light on the water
  const glint = mesh3(scene, new THREE.PlaneGeometry(60, 1400), new THREE.MeshBasicMaterial({ map: tex3('glint', 64, 512, (g, w, h) => { const r = lcg(4); g.fillStyle = '#000'; g.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { const y = r() * h, x = w / 2 + (r() - .5) * w * (.2 + .8 * y / h); g.fillStyle = `rgba(220,230,255,${.2 + r() * .6})`; g.fillRect(x, y, 2 + r() * 6, 1 + r() * 1.5); } }), color: '#C8D8FF', transparent: true, opacity: .7, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }), [0, -.15, 718], { rot: [-Math.PI / 2, 0, Math.PI], cast: false, receive: false });
  // Chandra: a pale seated figure facing the linga (screen right is -x from the north shore); the earthen linga
  const chTex = tex3('chandra_sit2', 512, 512, (g) => {
    g.fillStyle = '#fff'; g.strokeStyle = '#fff'; g.lineCap = g.lineJoin = 'round';
    g.beginPath(); g.arc(256, 128, 30, 0, TAU); g.fill();                                   // head
    g.beginPath(); g.arc(230, 116, 15, 0, TAU); g.fill();                                   // the knot of hair
    g.lineWidth = 8; g.beginPath(); g.arc(258, 104, 30, Math.PI * 1.12, Math.PI * 1.88); g.stroke();   // the crescent on his head
    g.fillRect(246, 152, 22, 20);                                                           // neck
    g.beginPath(); g.moveTo(214, 176); g.quadraticCurveTo(256, 160, 300, 176);               // shoulders
    g.bezierCurveTo(306, 230, 300, 290, 292, 330); g.lineTo(222, 330); g.bezierCurveTo(212, 290, 206, 230, 214, 176); g.fill();
    g.lineWidth = 22; g.beginPath(); g.moveTo(292, 186); g.lineTo(318, 262); g.lineTo(312, 214); g.stroke();   // the near arm, hands joined
    g.beginPath(); g.moveTo(222, 190); g.lineTo(252, 266); g.lineTo(306, 222); g.stroke();                  // the far arm
    g.beginPath(); g.ellipse(312, 206, 9, 26, -.2, 0, TAU); g.fill();                                       // the joined palms
    g.beginPath(); g.ellipse(256, 352, 116, 34, 0, 0, TAU); g.fill();                                       // the crossed legs
    g.beginPath(); g.ellipse(160, 360, 26, 22, 0, 0, TAU); g.ellipse(352, 360, 26, 22, 0, 0, TAU); g.fill();   // knees
  });
  const CH = [0, 0, 6];
  const chandra = new THREE.Sprite(new THREE.SpriteMaterial({ map: chTex, color: '#B8C8F0', transparent: true, fog: false, depthWrite: false })); chandra.center.set(.5, .27); chandra.scale.set(2.6, 2.6, 1); chandra.position.set(...CH); scene.add(chandra);
  const chGlow = glow3(scene, [CH[0], 1, CH[2]], 6, '#B8C8FF', .5);
  const clay = new THREE.MeshStandardMaterial({ color: '#9A7656', roughness: .85 });
  const LP = [CH[0] - 1.9, 0, CH[2] + .2], linga = new THREE.Group(); linga.position.set(...LP); scene.add(linga);
  mesh3(linga, lathe3([[0, 0], [.55, 0], [.6, .12], [.5, .22], [.42, .24], [0, .24]]), clay, [0, 0, 0]);
  mesh3(linga, lathe3([[0, .22], [.24, .22], [.24, .58], [.2, .7], [.1, .76], [0, .78]]), clay, [0, 0, 0]);
  mesh3(linga, new THREE.BoxGeometry(.4, .07, .16), clay, [.62, .17, 0]);
  const lamp = glow3(linga, [.7, .35, -.5], 1.4, '#FFB050', .8), lampL = new THREE.PointLight('#FFB060', 8, 9, 1.5); lampL.position.set(LP[0] + .7, .6, LP[2] - .6); scene.add(lampL);
  // the chant: rings of pale light spreading over the sand
  const ringM = () => new THREE.MeshBasicMaterial({ color: '#B8CCFF', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
  const rings = [0, 1, 2].map(() => mesh3(scene, new THREE.RingGeometry(.96, 1, 96), ringM(), [CH[0], .03, CH[2]], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false }));
  const pil = pillar3(scene, [LP[0], .4, LP[2]], { h: 1600, r: .9, col: '#FFE2A0' });
  const pilGlow = glow3(scene, [LP[0], 1, LP[2]], 30, '#FFD890', 0);
  return {
    scene, sky2, naks, moon, moonTex, MPOS, ROH, LP, CH, pil,
    // o: t, naks (0..1 how many lit), roh (0..1 Rohini's brightness), dim (the other 26 dimmed), red (the curse's flare),
    //    moon [on, f, side, sick, size], chant (0..1), wheel (radians the sky has turned), pillar (0..1), lamp, chandra
    set(o) {
      const t = o.t || 0; seaNrm.offset.set(t * .004, t * .003);
      sky2.rotation.set(0, 0, 0); sky2.rotateOnWorldAxis(V3(0, .35, -.94).normalize(), o.wheel || 0);
      naks.forEach((n, i) => {
        const on = clamp((o.naks ?? 0) * 27 - i), tw = .85 + .15 * Math.sin(t * 3 + i * 1.7), isR = i === ROH;
        let a = on * tw * (isR ? 1 + (o.roh || 0) * .8 : 1 - (o.dim || 0) * .75);
        n.s.material.opacity = a * .9; n.core.material.opacity = a; n.s.scale.setScalar(isR ? 60 + 50 * (o.roh || 0) : 60 + 40 * (o.red || 0));
        n.s.material.color.set(isR ? '#FFB27A' : (o.red || 0) > .05 ? '#FF6A4A' : '#DCE6FF');
      });
      const mo = o.moon || [1, 1, 1, 0]; moon.set(mo[0], mo[1], mo[2], mo[3] || 0, mo[4] || 150);
      moonL.intensity = .25 + 1.3 * Math.pow(mo[1], .8) * mo[0] * (1 - .6 * (mo[3] || 0)) + (o.pillar || 0) * 1.5;
      moonL.color.set((o.pillar || 0) > .1 ? '#FFE2B0' : '#C8D4FF');
      const mw = V3(...MPOS).applyQuaternion(sky2.quaternion); moonL.position.set(mw.x * .02, Math.max(8, mw.y * .02), mw.z * .02); moonL.target.position.set(...CH);
      glint.material.opacity = .65 * Math.pow(mo[1], .8) * mo[0] * (1 - .5 * (mo[3] || 0));
      hemi.intensity = .55 + .25 * mo[1] + (o.pillar || 0) * .5;
      chandra.visible = (o.chandra ?? 1) > .01; chandra.material.opacity = o.chandra ?? 1; chGlow.material.opacity = .5 * (o.chandra ?? 1) * (.7 + .3 * Math.sin(t * 2));
      rings.forEach((r, i) => { const ph = ((t * .45 + i / 3) % 1), k = (o.chant || 0); r.scale.setScalar(1 + ph * 16); r.material.opacity = k * .5 * (1 - ph) * (ph > .02 ? 1 : 0); });
      pil.set(t, o.pillar || 0); pilGlow.material.opacity = (o.pillar || 0) * .8; pilGlow.scale.setScalar(20 + 20 * (o.pillar || 0));
      lamp.material.opacity = (o.lamp ?? 1) * (.7 + .3 * Math.sin(t * 11) * Math.sin(t * 7)); lampL.intensity = 8 * (o.lamp ?? 1) * (.85 + .15 * Math.sin(t * 9));
    },
  };
}

// ---------- Ahilyabai Holkar's works, for the map (Wikipedia, "Ahilyabai Holkar": the charities connected with the
// Jyotirlingas, the Sapta Puri and Char Dham, the image captions) ----------
const AHW = [
  ['BADRINATH', 79.493, 30.744, 'dharmashalas'], ['HARIDWAR', 78.164, 29.946, 'a ghat'], ['AYODHYA', 82.199, 26.799, 'temples'],
  ['MATHURA', 77.673, 27.492, 'temple, ghats'], ['KASHI', 83.011, 25.311, 'Vishwanath, ghats'], ['GAYA', 84.995, 24.796, 'Vishnupad, 1787'],
  ['PURI', 85.831, 19.813, 'temple, alms-house'], ['UJJAIN', 75.768, 23.183, 'temples, food'], ['MAHESHWAR', 75.588, 22.176, 'her seat'],
  ['OMKARESHWAR', 76.151, 22.245, ''], ['DWARKA', 68.967, 22.240, 'alms-house'], ['SOMNATH', 70.401, 20.888, 'a new temple'],
  ['TRIMBAKESHWAR', 73.531, 19.932, 'a ghat bridge'], ['BHIMASHANKAR', 73.536, 19.072, 'alms-house'], ['GRISHNESHWAR', 75.170, 20.025, ''],
  ['PARLI', 76.523, 18.849, 'rebuilt, 1784'], ['SRISAILAM', 78.868, 16.074, 'a temple'], ['GOKARNA', 74.318, 14.548, 'alms-house'],
  ['RAMESWARAM', 79.317, 9.288, 'alms-house, wells'],
].map(([name, lon, lat, what]) => ({ name, lon, lat, what }));

// ~560 points inside India's mainland (for the princely states Patel joined: positions are only a pattern, not the states)
function princelyDots(n = 560) {
  const ring = GEO.india.reduce((a, b) => (b.length > a.length ? b : a));
  const inside = (x, y) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, yi] = ring[i], [xj, yj] = ring[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const r = lcg(1947), out = [];
  while (out.length < n) { const lon = 68 + r() * 29, lat = 8 + r() * 29; if (inside(lon, lat)) out.push({ lon, lat, d: r() }); }
  return out;
}
