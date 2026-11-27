// jtrail_props.js: the 12 JYOTIRLINGAS trailer (ad 119). From ad 43 (jyoti_props.js): the twelve and the claimants, their
// labels, the void with the endless pillar of fire. Then the trailer's own 2D: redaction tags, gold name plates, the title, the card.

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

// Baijnath (Himachal), the third claimant for Vaidyanath
ALT.baijnath = { name: 'BAIJNATH', lon: 76.648, lat: 32.052 };

// ---------- 2D ----------
// a mono tag in a black box with a coloured bar (the series' labels); typed in
function jTag(c, t, t0, t1, txt, x, y, o = {}) {
  if (t < t0 || t > t1) return;
  const vis = Math.min(seg(t, t0, t0 + .12), 1 - seg(t, t1 - .2, t1)), n = Math.ceil(txt.length * clamp((t - t0) / Math.max(.2, txt.length * .025)));
  const fs = o.size ?? 32;
  c.save(); c.globalAlpha = vis; c.font = `700 ${fs}px "Space Mono"`; c.letterSpacing = (fs * .08) + 'px'; c.textBaseline = 'middle';
  const w = c.measureText(txt).width, pad = fs * .55, bw = w + pad * 2 + 8, bh = fs * 1.75, x0 = o.align === 'center' ? x - bw / 2 : o.align === 'right' ? x - bw : x;
  c.fillStyle = 'rgba(8,8,10,.84)'; c.fillRect(x0, y - bh / 2, bw, bh);
  c.fillStyle = o.col || '#E8B030'; c.fillRect(x0, y - bh / 2, 6, bh);
  c.fillStyle = '#F4F0E8'; c.fillText(txt.slice(0, n), x0 + pad + 8, y + 1);
  c.restore();
}
// a redacted record: the year in white, the name a black bar stamped over it; a red bar at the left
function redact(c, t, t0, t1, year, what, y, o = {}) {
  if (t < t0 || t > t1) return;
  const vis = Math.min(seg(t, t0, t0 + .1), 1 - seg(t, t1 - .25, t1)), k = popK(t - t0), bar = easeOut(seg(t, t0 + .18, t0 + .38));
  const x0 = 120, w = 840, h = 112;
  c.save(); c.globalAlpha = vis; c.translate(540, y); c.scale(k, k); c.translate(-540, -y);
  c.fillStyle = 'rgba(10,8,8,.82)'; c.fillRect(x0, y - h / 2, w, h); c.fillStyle = '#C8281E'; c.fillRect(x0, y - h / 2, 8, h);
  c.textBaseline = 'middle'; c.font = '700 54px "Space Mono"'; c.fillStyle = '#F4F0E8'; c.fillText(year, x0 + 34, y - 8);
  c.font = '700 22px "Space Mono"'; c.letterSpacing = '3px'; c.fillStyle = 'rgba(244,240,232,.7)'; c.fillText(what, x0 + 36, y + 34);
  // the bar where a name would be
  const bx = x0 + 250, bw = (w - 290) * bar;
  c.fillStyle = '#000'; c.fillRect(bx, y - 38, bw, 60);
  c.globalAlpha = vis * .25; c.fillStyle = '#FFF'; for (let i = 0; i < 6; i++) c.fillRect(bx + 10 + i * 90 * bar, y - 30 + (i % 2) * 30, 30 * bar, 3);
  c.restore();
  if (t - t0 > .38 && t - t0 < .7) flash(c, .12 * (1 - seg(t, t0 + .38, t0 + .7)), '#FF3020');
}
// a rebuilder's name in gold on a dark band, a sweep of light across it, the temple and the year under it
function goldName(c, t, t0, t1, name, sub, y = 760, o = {}) {
  if (t < t0 || t > t1) return;
  const vis = Math.min(seg(t, t0, t0 + .12), 1 - seg(t, t1 - .15, t1)), k = .94 + .06 * easeOut(seg(t, t0, t0 + .5)), fs = o.size ?? 86;
  c.save(); c.globalAlpha = vis;
  const g = c.createLinearGradient(0, y - 120, 0, y + 120); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.5, 'rgba(10,6,2,.62)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g; c.fillRect(0, y - 130, W, 260);
  c.translate(540, y); c.scale(k, k);
  c.font = `900 ${fs}px Cinzel`; c.letterSpacing = '4px'; c.textAlign = 'center'; c.textBaseline = 'middle';
  let tw = c.measureText(name).width; const sc = Math.min(1, 940 / tw); c.save(); c.scale(sc, sc);
  const gr = c.createLinearGradient(0, -fs / 2, 0, fs / 2); gr.addColorStop(0, '#FFF1C8'); gr.addColorStop(.45, '#F2C25A'); gr.addColorStop(1, '#B07A26');
  c.shadowColor = 'rgba(255,180,70,.55)'; c.shadowBlur = 30; c.fillStyle = gr; c.fillText(name, 0, 0); c.shadowBlur = 0;
  // the sweep
  const sx = lerp(-tw * .7, tw * .7, seg(t, t0 + .1, t0 + .8));
  c.globalCompositeOperation = 'source-atop'; const sg = c.createLinearGradient(sx - 90, 0, sx + 90, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,255,255,.85)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = sg; c.fillText(name, 0, 0); c.restore();
  c.font = '600 34px Oswald'; c.letterSpacing = '6px'; c.fillStyle = '#FBE8C8'; c.globalAlpha = vis * clamp((t - t0 - .15) * 4); c.fillText(sub, 0, fs * .82);
  c.restore();
}
// the series title
function jTitle(c, t, t0, y = 700, o = {}) {
  if (t < t0) return; const k = seg(t, t0, t0 + .6), fs = 124;
  c.save(); c.globalAlpha = clamp(k * 1.5) * (o.alpha ?? 1); c.translate(540, y); const s = 1.12 - .12 * easeOut(k); c.scale(s, s);
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = `700 ${fs * 1.3}px "Cinzel Decorative"`; const gr = c.createLinearGradient(0, -fs, 0, fs); gr.addColorStop(0, '#FFF3D0'); gr.addColorStop(.5, '#F4C058'); gr.addColorStop(1, '#A8701E');
  c.shadowColor = 'rgba(255,170,60,.7)'; c.shadowBlur = 50; c.fillStyle = gr; c.fillText('12', 0, -fs * .62);
  c.font = `900 ${fs * .62}px Cinzel`; c.letterSpacing = '10px'; c.shadowBlur = 30; c.fillText('JYOTIRLINGAS', 0, fs * .42);
  c.shadowBlur = 0; c.strokeStyle = 'rgba(244,192,88,.8)'; c.lineWidth = 2; const lw = 360 * easeOut(seg(t, t0 + .3, t0 + 1));
  c.beginPath(); c.moveTo(-lw, fs * .9); c.lineTo(lw, fs * .9); c.stroke();
  c.font = 'italic 34px Marcellus'; c.letterSpacing = '2px'; c.fillStyle = '#FBE8C8'; c.globalAlpha *= clamp((t - t0 - .5) * 3);
  c.fillText(o.tag || 'Broken. Rebuilt. Still standing.', 0, fs * 1.25);
  c.restore();
}
// a red sticker (TONIGHT)
function sticker(c, t, t0, txt, x, y, o = {}) {
  if (t < t0) return; const k = popK(t - t0), fs = o.size ?? 70;
  c.save(); c.translate(x, y); c.rotate(o.rot ?? -.05); c.scale(k, k); c.globalAlpha = clamp(k);
  c.font = `400 ${fs}px Anton`; c.letterSpacing = '3px'; c.textAlign = 'center'; c.textBaseline = 'middle';
  const w = c.measureText(txt).width + fs * .8, h = fs * 1.4;
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 18; c.fillStyle = o.col || '#C8281E'; c.fillRect(-w / 2, -h / 2, w, h);
  c.shadowBlur = 0; c.strokeStyle = 'rgba(255,230,200,.85)'; c.lineWidth = 3; c.strokeRect(-w / 2 + 7, -h / 2 + 7, w - 14, h - 14);
  c.fillStyle = '#FFF4E4'; c.fillText(txt, 0, 4); c.restore();
}
// the follow card: the series title, the rule, Episode 1 tonight, follow
function trailerCard(c, u, t) {
  sky(c, [[0, '#07090C'], [960, '#1A1208'], [1920, '#050608']]);
  glow(c, 540, 820, 820, '#7A4A12', .55, 'screen'); glow(c, 540, 820, 380, '#F4B048', .18, 'screen');
  motes(c, { n: 70, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#F4C46A', a: .6, vx: 6, vy: -26, t });
  const pk = d => u - d;
  picture(c, PICS.logo, 540, 470, 112, 112, { pop: pk(.05), r: 56 });
  jTitle(c, t, t - u + .1, 720);
  text(c, "We won't name the destroyers.", 540, 1010, '600 44px Oswald', '#E8E0D4', { pop: pk(.7), spacing: 1 });
  text(c, 'We name the ones who REBUILT.', 540, 1068, '600 44px Oswald', '#F4C058', { pop: pk(1), spacing: 1 });
  text(c, 'EPISODE 1 · SOMNATH · TONIGHT', 540, 1176, '700 40px "Space Mono"', '#FFFFFF', { pop: pk(1.4), spacing: 3, maxW: 900 });
  const k = popK(pk(1.9)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (k > .01) { c.save(); c.translate(540, 1300); c.scale(k, k); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-330, -50, 660, 100, 50); c.fill(); c.restore(); }
  text(c, 'Follow @therishikatha', 540, 1303, '700 48px Poppins', '#FFFFFF', { pop: pk(1.9) });
  text(c, "so you don't miss one", 540, 1385, '500 32px Poppins', '#E8D8C0', { pop: pk(2.3) });
}
