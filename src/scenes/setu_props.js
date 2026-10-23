// setu_props.js: what "This bridge across the SEA was built in FIVE DAYS." adds to the Palk Strait set
// (cine3d_setu.js): the army's camp on the Dhanushkodi spit, the places' labels, the day counter, the dimension marks,
// and the 15K Family Deal card in Cinematic lettering (as ad 41).

// places (lon, lat)
const PLACES = {
  rameswaram: [79.31, 9.29], dhanushkodi: [79.40, 9.18], talaimannar: [79.75, 9.08], mannar: [79.90, 8.99],
};
// the army's camp: torches scattered over the end of the spit
function camp3(S3, n = 900) {
  const g = new THREE.BufferGeometry(), pos = [], r = lcg(44), A = S3.path(0);
  let k = 0; while (pos.length < n * 3 && k++ < n * 60) {
    const x = A.x - r() * 150, z = A.z + 12 - r() * 120, h = S3.h(x, z);
    if (h > .03) pos.push(x, h + .25 + r() * .2, z);
  }
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const m = new THREE.Points(g, new THREE.PointsMaterial({ map: glowTex3(), color: '#FFB060', size: 1.8, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  m.frustumCulled = false; S3.scene.add(m);
  m.set = (t, on) => { m.visible = on > .01; m.material.opacity = on * (.85 + .15 * Math.sin(t * 9)); };
  m.set(0, 0); return m;
}
// a dimension mark between two screen points: a line with end ticks and a label at its middle
function dimension(c, a, b, label, k, o = {}) {
  if (k <= 0) return; const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * 22, ny = dx / l * 22;
  const e = [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  c.save(); c.strokeStyle = o.col || '#FFE2A0'; c.lineWidth = 5; c.lineCap = 'round'; c.shadowColor = 'rgba(0,0,0,.7)'; c.shadowBlur = 10;
  c.beginPath(); c.moveTo(a[0] - nx, a[1] - ny); c.lineTo(a[0] + nx, a[1] + ny); c.moveTo(a[0], a[1]); c.lineTo(e[0], e[1]);
  if (k >= 1) { c.moveTo(b[0] - nx, b[1] - ny); c.lineTo(b[0] + nx, b[1] + ny); }
  c.stroke(); c.restore();
  if (k >= 1) text(c, label, (a[0] + b[0]) / 2 + (o.dx || 0), (a[1] + b[1]) / 2 + (o.dy || 0), o.font || '700 50px Cinzel', o.col || '#FFE2A0', { pop: o.pop ?? 1, glow: ['rgba(6,6,14,.95)', 20], spacing: 2 });
}
// the day counter: DAY n, the yojanas laid that day, and a bar filling to 100
function dayCounter(c, t, i, built, a = 1) {
  if (i < 0 || a <= 0) return;
  c.save(); c.globalAlpha = a;
  text(c, 'DAY ' + (i + 1), 540, 520, '700 120px Cinzel', '#F4C46A', { pop: t - TL.D[i] + .05, glow: ['rgba(244,170,60,.6)', 34], spacing: 6 });
  text(c, '+' + DAYS[i] + ' yojanas', 540, 612, '700 50px Cinzel', '#FFF3DC', { pop: t - TL.DN[i] + .05, glow: ['rgba(6,6,14,.9)', 18], spacing: 2 });
  const X0 = 190, X1 = 890, Y = 690, k = clamp(built / 100);
  c.fillStyle = 'rgba(6,8,20,.55)'; c.beginPath(); c.roundRect(X0 - 8, Y - 16, X1 - X0 + 16, 32, 16); c.fill();
  const g = c.createLinearGradient(X0, 0, X1, 0); g.addColorStop(0, '#F4C46A'); g.addColorStop(1, '#FFE9B8');
  c.fillStyle = g; c.shadowColor = 'rgba(244,196,106,.7)'; c.shadowBlur = 16; c.beginPath(); c.roundRect(X0, Y - 9, Math.max(18, (X1 - X0) * k), 18, 9); c.fill(); c.shadowBlur = 0;
  CUM.forEach(v => { const x = lerp(X0, X1, v / 100); c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(x - 1.5, Y - 14, 3, 28); });
  text(c, Math.round(built) + ' / 100', 540, 752, '700 40px Poppins', '#FFF3DC', { glow: ['rgba(6,6,14,.9)', 16] });
  c.restore();
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
