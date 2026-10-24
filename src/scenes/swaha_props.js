// swaha_props.js: what "Every time you say SWAHA, you're calling a GODDESS." adds to the havan set (cine3d_havan.js):
// the offerings' envelope (the ladle tips, the ghee runs, the fire flares), the night's stars, Devanagari lettering in
// fire, Svaha as a vision in the flames (the Devi's head from cine_devi.js, lit by the fire and faded into it), and the
// 15K Family Deal card in Cinematic lettering (as ads 41–43).

// an offering landing at t0: { ladle (tip 0..1), pour (0..1), flare (0..1) }; fail: the fire doesn't take it
function offering(t, t0, o = {}) {
  const lead = o.lead ?? .55, tip = seg(t, t0 - lead, t0 - .2) * (1 - seg(t, t0 + .45, t0 + .75));
  const pour = seg(t, t0 - .25, t0 - .05) * (1 - seg(t, t0 + .35, t0 + .55));
  const fl = t < t0 ? 0 : seg(t, t0, t0 + .1) * Math.exp(-(t - t0) * (o.fail ? 6 : 1.9));
  return { tip: easeOut(tip), pour, flare: o.fail ? 0 : fl, puff: o.fail ? fl : 0 };
}
// text anchored at its left edge (cine.js text() centres it)
function textA(c, s, x, y, font, col, age, glw) { c.save(); c.font = font; const w = c.measureText(s).width; c.restore(); text(c, s, x + w / 2, y, font, col, { pop: age, glow: glw }); }
// all the offerings of a shot: the strongest of each
function offerings(t, times, o = {}) {
  const r = { tip: 0, pour: 0, flare: 0, puff: 0 };
  times.forEach(t0 => { const k = offering(t, t0, o); for (const key in r) r[key] = Math.max(r[key], k[key]); });
  return r;
}

// the night's stars, on a dome inside the sky
function stars3(scene, n = 1400) {
  const g = new THREE.BufferGeometry(), p = [], r = lcg(91);
  for (let i = 0; i < n; i++) { const a = r() * TAU, el = Math.asin(.15 + r() * .85), R = 250; p.push(Math.cos(a) * Math.cos(el) * R, Math.sin(el) * R, Math.sin(a) * Math.cos(el) * R); }
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  const m = new THREE.Points(g, new THREE.PointsMaterial({ color: '#FFF4E0', size: 2.2, sizeAttenuation: false, transparent: true, opacity: .85, fog: false, depthWrite: false }));
  scene.add(m); return m;
}

// Devanagari lettering that burns in: a warm glow behind it, popping at `at`
function deva(c, txt, x, y, t, at, o = {}) {
  if (t < at) return; const k = clamp((t - at) / .5) * (o.alpha ?? 1), size = o.size || 110;
  glow(c, x, y, size * 2.6, '#FF8A30', .3 * k);
  text(c, txt, x, y, `${size}px "Tiro Devanagari Sanskrit"`, o.col || '#FFE2A0', { pop: (t - at) * .8 + .1, alpha: k, glow: ['rgba(255,150,40,.9)', size * .4] });
  if (o.sub) text(c, o.sub, x, y + size * .78, `italic ${Math.round(size * .36)}px Marcellus`, '#FFF3DC', { pop: t - at - .15, alpha: k * .9, glow: ['rgba(6,4,10,.9)', 14] });
}

// Svaha in the fire: the Devi's head, lit gold by the flames, rising out of them and fading into them below the chin.
// x, y: where her chin sits on screen; k: scale (her face is ~90 units wide); a: 0..1 how far she has appeared.
const SVAHA_PAL = { skin: '#C8743A', skinSh: '#8A4420', skinDk: '#5A2410', hair: '#2A0A04', hairLt: '#7A2A08' };
function svahaVision(c, x, y, k, t, a = 1, o = {}) {
  if (a <= .002) return;
  const d = DEPTH++, l = scratch('sv' + d), rise = (1 - easeOut(a)) * 220 * k / 4;
  figure(l, (f) => { f.translate(x, y + rise); f.scale(k, k); f.translate(0, 750); deviHead(f, { t, eyes: o.eyes ?? .9, light: 1, wind: .2, pal: SVAHA_PAL }); },
    { tint: ['#FF7A1A', .22], edge: { col: '#FFE2A0', w: 3, a: .9 }, rim: { col: '#FFF0C8', dx: 0, dy: -8, a: .95, blur: 2 } });
  l.save(); l.setTransform(1, 0, 0, 1, 0, 0); l.globalCompositeOperation = 'destination-in';
  const g = l.createLinearGradient(0, y + rise - 60 * k, 0, y + rise + 40 * k); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); l.fillStyle = g; l.fillRect(0, 0, W, H);
  // flicker: the bottom edge licked away by the flames
  l.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 9; i++) { const fx = x + (i - 4) * 34 * k, fh = (60 + 40 * vnoise(t * 3 + i, 5)) * k; const gr = l.createLinearGradient(0, y + rise + 30 * k - fh, 0, y + rise + 30 * k); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.8)'); l.fillStyle = gr; l.beginPath(); l.ellipse(fx, y + rise + 30 * k, 18 * k, fh, 0, 0, TAU); l.fill(); }
  l.restore();
  glow(c, x, y + rise - 90 * k, 300 * k, '#FF9A40', .3 * a);
  blit(c, l.canvas, a * .75, 'screen'); blit(c, l.canvas, a * .45, 'source-over');
  DEPTH--;
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
