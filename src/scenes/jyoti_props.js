// jyoti_props.js: what "Shiva appeared as LIGHT in 12 places in India." adds to the India map (cine3d_india.js): the
// twelve Jyotirlingas and the contested sites, their pillars of light and labels; the void where Brahma and Vishnu
// searched the endless pillar of fire; and the 15K Family Deal card in Cinematic lettering (as ads 41–42).

// the twelve, in the Shiva Purana's order (Kotirudra Samhita 1): name, state, lon, lat, label side (dx, dy in px)
const JL = [
  ['SOMNATH', 'Gujarat', 70.401, 20.888, 1, 1], ['MALLIKARJUNA', 'Andhra Pradesh', 78.868, 16.074, 1, 0],
  ['MAHAKAL', 'Ujjain, MP', 75.768, 23.183, 1, -1], ['OMKARESHWAR', 'Madhya Pradesh', 76.151, 22.245, 1, 0],
  ['KEDARNATH', 'Uttarakhand', 79.067, 30.735, 1, -1], ['BHIMASHANKAR', 'Maharashtra', 73.536, 19.072, 1, 1],
  ['KASHI VISHWANATH', 'Varanasi, UP', 83.011, 25.311, 1, 0], ['TRIMBAKESHWAR', 'Nashik, Maharashtra', 73.531, 19.932, 1, -1],
  ['VAIDYANATH', 'Deoghar, Jharkhand', 86.700, 24.492, 1, 0], ['NAGESHWAR', 'Dwarka, Gujarat', 69.087, 22.336, 1, -1],
  ['RAMESWARAM', 'Tamil Nadu', 79.317, 9.288, 1, 0], ['GRISHNESHWAR', 'Maharashtra', 75.170, 20.025, 1, 1],
].map(([name, state, lon, lat, sx, sy]) => ({ name, state, lon, lat, sx, sy }));
// the other claimants (Wikipedia, "Jyotirlinga": disputed locations)
const ALT = { parli: { name: 'PARLI', lon: 76.523, lat: 18.849 }, aundha: { name: 'AUNDHA', lon: 77.042, lat: 19.537 }, jageshwar: { name: 'JAGESHWAR', lon: 79.854, lat: 29.637 } };

// a label beside a site: the name, the state under it; a thin leader to the pillar's foot
function siteLabel(c, s, p, t, at, o = {}) {
  if (t < at) return; const [x, y, z] = toScreen3(p); if (z > 1) return;
  const big = o.big ?? 1, dx = s.sx * (o.dx ?? 34), dy = s.sy * (o.dy ?? 26), al = o.align || (s.sx < 0 ? 'right' : 'left');
  const k = popK(t - at), a = (o.alpha ?? 1);
  c.save(); c.globalAlpha = a * clamp(k);
  c.strokeStyle = 'rgba(255,226,160,.7)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x + dx * .8, y + dy * .8 - 6); c.stroke(); c.restore();
  textA(c, s.name, x + dx, y + dy - 8, `700 ${Math.round(30 * big)}px Cinzel`, o.col || '#FFE2A0', al, t - at, a);
  if (o.state !== false) textA(c, s.state, x + dx, y + dy + 22 * big, `italic ${Math.round(24 * big)}px Marcellus`, '#E8ECFF', al, t - at - .1, a * .9);
}
// text anchored left or right of x (cine.js text() centres it)
function textA(c, s, x, y, font, col, align, age, a = 1) {
  c.save(); c.font = font; const w = c.measureText(s).width; c.restore();
  const cx = align === 'right' ? x - w / 2 : align === 'left' ? x + w / 2 : x;
  text(c, s, cx, y, font, col, { pop: age, alpha: a, glow: ['rgba(6,6,14,.95)', 16], spacing: 1 });
}

// ---------- the void: Brahma and Vishnu, the pillar of fire with no end ----------
const fireTex3 = () => tex3('firecol', 128, 512, (g, w, h) => {
  g.fillStyle = '#000'; g.fillRect(0, 0, w, h); const r = lcg(12); g.globalCompositeOperation = 'lighter'; g.filter = 'blur(3px)';
  for (let i = 0; i < 260; i++) {
    const x = r() * w, y = r() * h, l = 40 + r() * 160, wd = 3 + r() * 10, hot = r();
    const gr = g.createLinearGradient(0, y, 0, y + l); const col = hot > .6 ? '255,236,180' : hot > .3 ? '255,170,60' : '255,110,30';
    gr.addColorStop(0, `rgba(${col},0)`); gr.addColorStop(.5, `rgba(${col},.55)`); gr.addColorStop(1, `rgba(${col},0)`);
    for (const dy of [0, -h, h]) { g.fillStyle = gr; g.save(); g.translate(0, dy); g.beginPath(); g.ellipse(x, y + l / 2, wd, l / 2, 0, 0, TAU); g.fill(); g.restore(); }
  }
});
function void3() {
  const scene = new THREE.Scene();
  sky3(scene, [[1, '#040210'], [.3, '#0A0624'], [0, '#160A30'], [-.3, '#0A0624'], [-1, '#040210']], { r: 4000 });
  scene.fog = new THREE.Fog('#100828', 400, 2600);
  const sg = new THREE.BufferGeometry(), sp = [], rs = lcg(31);
  for (let i = 0; i < 3000; i++) { const a = rs() * TAU, el = Math.asin(rs() * 2 - 1), R = 600 + rs() * 2800; sp.push(Math.cos(a) * Math.cos(el) * R, Math.sin(el) * R, Math.sin(a) * Math.cos(el) * R); }
  sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: '#FFFFFF', size: 2, sizeAttenuation: false, transparent: true, opacity: .8, fog: false, depthWrite: false })));
  // cosmic dust: big soft glows
  const rd = lcg(4); for (let i = 0; i < 40; i++) { const a = rd() * TAU, R = 500 + rd() * 1500; glow3(scene, [Math.cos(a) * R, (rd() - .5) * 2400, Math.sin(a) * R], 500 + rd() * 900, ['#3A1E7A', '#1E3A7A', '#6A1E5A'][i % 3], .25); }
  // the pillar: two fire columns (outer, inner), a white core, its glow
  const H = 8000, P = new THREE.Group(); scene.add(P);
  const mk = (r, col, op, rep) => { const tx = fireTex3().rep(1, rep); const m = mesh3(P, new THREE.CylinderGeometry(r, r, H, 48, 1, true), new THREE.MeshBasicMaterial({ map: tx, color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, side: THREE.DoubleSide }), [0, 0, 0], { cast: false, receive: false }); m.tx = tx; return m; };
  const outer = mk(6, '#FF8A30', .9, 60), inner = mk(3.6, '#FFD080', .9, 90), core = mesh3(P, new THREE.CylinderGeometry(1.3, 1.3, H, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#FFF4DC', transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }), [0, 0, 0], { cast: false, receive: false });
  const halo = []; for (let i = -8; i <= 8; i++) halo.push(glow3(P, [0, i * 60, 0], 60, '#FF9A40', .3));
  // Brahma (gold) and Vishnu (blue): glowing orbs with a soft trail
  const orb = (col) => { const g = new THREE.Group(); scene.add(g); glow3(g, [0, 0, 0], 34, col, 1); glow3(g, [0, 0, 0], 11, '#FFFFFF', 1); const tr = []; for (let i = 1; i <= 10; i++) tr.push(glow3(g, [0, 0, 0], 18 - i, col, .5 - i * .045)); g.tr = tr; return g; };
  const brahma = orb('#FFC860'), vishnu = orb('#6AA8FF');
  return {
    scene, brahma, vishnu,
    // pillar(t, on): it grows out from the middle; its fire runs up
    pillar(t, on) { P.visible = on > .001; const k = easeOut(clamp(on)); P.scale.set(.2 + .8 * k, Math.max(.0001, k), .2 + .8 * k); outer.tx.offset.y = -t * .5; inner.tx.offset.y = -t * .8; core.material.opacity = .9 * k; },
    // put an orb at p, its trail behind it along the direction it came from (v)
    at(o, p, v = [0, 0, 0]) { o.position.set(...p); o.tr.forEach((s, i) => s.position.set(-v[0] * i * .9, -v[1] * i * .9, -v[2] * i * .9)); },
  };
}

// ---------- the 15K Family Deal card (as ad 31) ----------
function dealCardCine(c, u, t) {
  sky(c, [[0, '#04100E'], [900, '#0F2A27'], [1920, '#050E0C']]);
  glow(c, 470, 950, 760, '#2E5F5A', .55, 'screen');
  motes(c, { n: 60, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#F4C46A', a: .6, vx: 6, vy: -26, t });
  const X = 470, pk = d => u - d, br = Math.sin(t * 1.3) * .008;
  picture(c, PICS.logo, X, 500, 120, 120, { pop: pk(.05), r: 60 });
  text(c, '15K FAMILY DEAL', X, 618, '700 66px Cinzel', '#F4C46A', { pop: pk(.1), glow: ['rgba(244,196,106,.55)', 26], spacing: 3, maxW: 860 });
  text(c, 'our thank-you to all of YOU', X, 688, '42px Marcellus', '#FBE0CF', { pop: pk(.25), maxW: 840 });
  [['book1', -1], ['book3', 1], ['book2', 0]].forEach(([b, i], j) => picture(c, PICS[b], X + i * 205, 905 + Math.abs(i) * 28, 250, 250, { rot: i * .1 + br, pop: pk(.4 + j * .12), r: 10, shadow: 26, glow: ['rgba(255,196,120,.28)', 40] }));
  text(c, 'Books 1–3 · Set of 3', X, 1112, '700 40px Poppins', '#FFFFFF', { pop: pk(1.2), maxW: 880 });
  text(c, '₹500', X - 120, 1186, '500 56px Poppins', '#9FB8B3', { pop: pk(1.2) });
  const ks = easeOut(seg(u, 1.7, 1.95));
  if (ks > 0) { c.save(); c.strokeStyle = '#F15A24'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(X - 185, 1196); c.lineTo(lerp(X - 185, X - 55, ks), lerp(1196, 1172, ks)); c.stroke(); c.restore(); }
  text(c, '₹350', X + 95, 1182, `700 ${88 * (1 + .04 * Math.max(0, Math.sin(t * 5)))}px Poppins`, '#F15A24', { pop: pk(1.7), glow: ['rgba(241,90,36,.45)', 24] });
  text(c, 'Only till 25 Oct, midnight', X, 1262, '700 40px Poppins', '#FF9A6A', { pop: pk(2.2), maxW: 860 });
  const k = popK(pk(2.7)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (k > .01) { c.save(); c.translate(X, 1350); c.scale(k, k); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-270, -48, 540, 96, 48); c.fill(); c.restore(); }
  text(c, 'Comment FAMILY', X, 1353, '700 52px Poppins', '#FFFFFF', { pop: pk(2.7) });
  text(c, "we'll DM you the deal · or tap the link in bio", X, 1428, '500 31px Poppins', '#CFE3DF', { pop: pk(3.2), maxW: 860 });
  text(c, 'Follow @therishikatha', X, 1478, '700 31px Poppins', '#F4C46A', { pop: pk(3.7), maxW: 860 });
}
