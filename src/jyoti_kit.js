// jyoti_kit.js: the 12 JYOTIRLINGAS series kit (JYOTIRLINGA_SERIES.md), shared by every episode; load after cine.js,
// cine3d.js and cine3d_india.js. From the trailer (ad 119): the twelve and the claimants (JL, ALT), site labels, the
// mono tags (jTag), the redacted records (redact), the rebuilders' gold names (goldName), the series title (jTitle), a
// sticker. From Episode 1 (ad 120): the corner tag (cornerTag), the rebuilders' gold silhouettes (silAhilya, silPatel)
// and their portrait (portrait), a typed letter (letterCard), the series' follow card with the products (seriesCard).

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

// ---------- Episode 1 additions ----------
// the corner tag: a small label at the top of the safe band naming the source of what's on screen
// (SHIVA PURANA · KOTIRUDRA 14 in gold for the story, HISTORY in teal, LOCAL BELIEF in red)
const JCOL = { gold: '#E8B030', teal: '#3FA79A', red: '#C8281E' };
function cornerTag(c, t, t0, t1, txt, col = JCOL.gold) { jTag(c, t, t0, t1, txt, 80, 470, { col, size: 26 }); }

// a gold fill for a silhouette path: a vertical gradient, a soft glow round it, a bright rim on the lit side
function goldFill(c, path, x0, y0, h, o = {}) {
  c.save();
  const g = c.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, '#FFF0C0'); g.addColorStop(.35, '#F2C25A'); g.addColorStop(1, '#8A5A18');
  c.shadowColor = o.glow || 'rgba(255,176,60,.65)'; c.shadowBlur = o.blur ?? 60; c.fillStyle = g; c.fill(path);
  c.shadowBlur = 0; c.globalCompositeOperation = 'source-atop';
  c.restore();
  c.save(); c.clip(path);   // a sweep of light across it
  if (o.sweep != null) { const sx = lerp(x0 - 300, x0 + 300, o.sweep), sg = c.createLinearGradient(sx - 120, 0, sx + 120, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,250,230,.55)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = sg; c.fillRect(x0 - 600, y0, 1200, h); }
  c.restore();
}
// Ahilyabai Holkar standing, facing right: the sari's pallu over her head, a small linga on her open right palm (as
// she is painted and sculpted). Drawn about (0, 0) at its feet, 1000 px tall at s = 1.
function silAhilya(c, x, y, s = 1, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s); c.translate(0, -1000);
  const p = new Path2D();
  // head under the pallu, the face in profile
  p.moveTo(52, 78); p.bezierCurveTo(30, 20, -50, 10, -78, 70); p.bezierCurveTo(-110, 130, -120, 200, -140, 250);   // the pallu's back fall
  p.bezierCurveTo(-160, 420, -150, 600, -178, 990); p.lineTo(150, 990);                                                 // the sari's back to the hem
  p.bezierCurveTo(120, 760, 90, 560, 86, 420);                                                                        // the sari's front, flaring
  p.bezierCurveTo(84, 340, 112, 270, 90, 210);                                                                        // the chest
  p.bezierCurveTo(74, 190, 58, 176, 54, 160);                                                                        // the neck
  p.lineTo(64, 150); p.quadraticCurveTo(72, 140, 66, 132); p.quadraticCurveTo(74, 124, 70, 116);                       // chin, lips
  p.lineTo(90, 100); p.lineTo(72, 92); p.closePath();                                                                // nose, brow
  // the right arm: down from the shoulder to the elbow, the forearm forward, the palm up
  const a = new Path2D(); a.moveTo(30, 230); a.bezierCurveTo(70, 300, 80, 380, 96, 440); a.bezierCurveTo(140, 440, 200, 420, 236, 410);
  a.lineTo(250, 396); a.lineTo(256, 412); a.bezierCurveTo(220, 440, 150, 478, 92, 486); a.bezierCurveTo(60, 470, 40, 400, 4, 300); a.closePath();
  goldFill(c, p, 0, 0, 1000, o); goldFill(c, a, 0, 0, 1000, { ...o, blur: 0 });
  // the linga on her palm: the pitha (a spouted base) and the dome, glowing
  c.save(); c.shadowColor = 'rgba(255,240,200,.9)'; c.shadowBlur = 40; c.fillStyle = '#FFF6DC';
  c.beginPath(); c.ellipse(232, 392, 34, 9, 0, 0, TAU); c.fill(); c.fillRect(204, 378, 56, 14);
  c.beginPath(); c.moveTo(258, 382); c.lineTo(282, 386); c.lineTo(258, 392); c.fill();
  c.beginPath(); c.moveTo(214, 380); c.lineTo(214, 352); c.quadraticCurveTo(232, 326, 250, 352); c.lineTo(250, 380); c.fill(); c.restore();
  // a fold line or two in the sari (darker gold)
  c.strokeStyle = 'rgba(90,50,10,.35)'; c.lineWidth = 4; c.beginPath(); c.moveTo(-120, 300); c.bezierCurveTo(-60, 520, 40, 640, 120, 900); c.stroke();
  c.beginPath(); c.moveTo(-40, 600); c.bezierCurveTo(0, 760, 20, 860, 30, 985); c.stroke();
  c.restore();
}
// Sardar Patel, a bust facing right: the bald crown, the profile, the shawl over his left shoulder. (0, 0) is the bust's
// bottom centre; 900 px tall at s = 1.
function silPatel(c, x, y, s = 1, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s); c.translate(0, -900);
  const p = new Path2D();
  p.moveTo(-70, 330); p.bezierCurveTo(-130, 250, -110, 50, 0, 30);           // the back of the head, the bald crown
  p.bezierCurveTo(70, 24, 104, 70, 106, 130);                                // the dome to the forehead
  p.lineTo(112, 150); p.lineTo(136, 198); p.lineTo(114, 212);                // the brow, the nose
  p.quadraticCurveTo(122, 228, 112, 238); p.quadraticCurveTo(118, 250, 110, 258);   // the lips
  p.quadraticCurveTo(116, 286, 96, 298); p.quadraticCurveTo(76, 312, 62, 318);      // the chin, the jaw
  p.lineTo(66, 372);                                                        // the throat
  p.bezierCurveTo(150, 390, 260, 420, 300, 500); p.lineTo(320, 900);         // the front shoulder, the chest
  p.lineTo(-330, 900); p.lineTo(-300, 520); p.bezierCurveTo(-260, 420, -160, 390, -70, 370); p.closePath();
  goldFill(c, p, 0, 0, 900, o);
  // the ear, and the shawl's folds across the chest
  c.strokeStyle = 'rgba(90,50,10,.4)'; c.lineWidth = 6; c.beginPath(); c.ellipse(-8, 200, 16, 34, .1, 0, TAU); c.stroke();
  c.lineWidth = 7; c.beginPath(); c.moveTo(250, 440); c.bezierCurveTo(120, 600, -60, 760, -200, 900); c.stroke();
  c.lineWidth = 5; c.beginPath(); c.moveTo(300, 560); c.bezierCurveTo(200, 680, 80, 800, 0, 900); c.stroke();
  c.beginPath(); c.moveTo(-260, 480); c.bezierCurveTo(-220, 600, -230, 760, -250, 900); c.stroke();
  c.restore();
}
// a rebuilder's portrait: a dark warm ground, a halo, gold dust, the silhouette (sil(c, x, y, s, o)) pushing in slowly;
// the name plate and its lines come from the shot (goldName, jTag)
function portrait(c, t, t0, sil, o = {}) {
  const u = t - t0;
  sky(c, [[0, '#050403'], [900, o.mid || '#1C1006'], [1920, '#040302']]);
  glow(c, o.hx ?? 470, o.hy ?? 860, 760, '#8A5212', .5, 'screen'); glow(c, o.hx ?? 470, o.hy ?? 860, 300, '#F4B048', .16, 'screen');
  // rays behind the figure
  c.save(); c.globalCompositeOperation = 'screen'; c.translate(o.hx ?? 470, o.hy ?? 860); c.rotate(u * .03);
  for (let i = 0; i < 18; i++) { c.rotate(TAU / 18); const g = c.createLinearGradient(0, 0, 0, -900); g.addColorStop(0, 'rgba(255,190,90,.10)'); g.addColorStop(1, 'rgba(255,190,90,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(-14, 0); c.lineTo(-60, -900); c.lineTo(60, -900); c.lineTo(14, 0); c.fill(); }
  c.restore();
  motes(c, { n: 60, seed: o.seed ?? 5, box: [-50, 300, W + 50, 1700], r: 3, col: '#F4C46A', a: .55, vx: 5, vy: -22, t });
  const k = easeOut(clamp(u / .7)), s = (o.s ?? 1) * (1.02 + .04 * u / 6);
  c.save(); c.globalAlpha = k; sil(c, o.x ?? 470, (o.y ?? 1420) + (1 - k) * 40, s, { sweep: clamp((u - .2) / 1.4) }); c.restore();
}
// a typed letter on paper, sliding up: date, to/from, the quoted line (its words appear as typed)
function letterCard(c, t, t0, t1, L, o = {}) {
  if (t < t0 || t > t1) return;
  const vis = Math.min(seg(t, t0, t0 + .3), 1 - seg(t, t1 - .3, t1)), y = (o.y ?? 860) + (1 - easeOut(seg(t, t0, t0 + .5))) * 120;
  c.save(); c.globalAlpha = vis; c.translate(540, y); c.rotate(o.rot ?? -.025);
  const w = 820, h = 560;
  c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 40; c.shadowOffsetY = 16; c.fillStyle = '#EFE6D2'; c.fillRect(-w / 2, -h / 2, w, h); c.shadowBlur = 0; c.shadowOffsetY = 0;
  const g = c.createRadialGradient(0, 0, 100, 0, 0, 600); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(120,90,40,.28)'); c.fillStyle = g; c.fillRect(-w / 2, -h / 2, w, h);
  c.fillStyle = '#2A2218'; c.textBaseline = 'top'; c.font = '700 26px "Space Mono"'; c.letterSpacing = '2px';
  c.fillText(L.date, -w / 2 + 50, -h / 2 + 46); c.font = '400 24px "Space Mono"'; c.fillStyle = '#4A3E2C';
  L.head.forEach((s, i) => c.fillText(s, -w / 2 + 50, -h / 2 + 96 + i * 34));
  c.strokeStyle = 'rgba(60,40,20,.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(-w / 2 + 50, -h / 2 + 100 + L.head.length * 34); c.lineTo(w / 2 - 50, -h / 2 + 100 + L.head.length * 34); c.stroke();
  const all = L.body.join('\n'), n = Math.floor(all.length * clamp((t - t0 - .5) / (L.typeDur ?? 1.6)));
  let left = n; c.font = 'italic 36px Marcellus'; c.fillStyle = '#1E1810'; c.letterSpacing = '0px';
  L.body.forEach((s, i) => { if (left <= 0) return; c.fillText(s.slice(0, left), -w / 2 + 50, -h / 2 + 140 + L.head.length * 34 + i * 50); left -= s.length + 1; });
  c.font = '400 20px "Space Mono"'; c.fillStyle = 'rgba(60,46,30,.75)'; c.fillText(L.src, -w / 2 + 50, h / 2 - 50);
  c.restore();
}
// the series' follow card: the logo, "12 JYOTIRLINGAS", "Episode N next", follow; the Navadurga picture books and the
// CHIRANJEEVI comics (covers, no price), "link in bio or DM us" (owner, 27 Nov 2026)
function seriesCard(c, u, t, o = {}) {
  sky(c, [[0, '#07090C'], [960, '#1A1208'], [1920, '#050608']]);
  glow(c, 540, 700, 760, '#7A4A12', .5, 'screen'); glow(c, 540, 700, 340, '#F4B048', .16, 'screen');
  motes(c, { n: 60, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#F4C46A', a: .55, vx: 6, vy: -26, t });
  const pk = d => u - d;
  picture(c, PICS.logo, 540, 430, 96, 96, { pop: pk(.05), r: 48 });
  c.save(); c.translate(540, 600); c.scale(.72, .72); c.translate(-540, -600); jTitle(c, t, t - u + .1, 600); c.restore();
  text(c, o.next || 'EPISODE 2 NEXT', 540, 790, '700 40px "Space Mono"', '#FFFFFF', { pop: pk(.6), spacing: 3, maxW: 900 });
  const k = popK(pk(.9)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (k > .01) { c.save(); c.translate(540, 890); c.scale(k, k); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-330, -48, 660, 96, 48); c.fill(); c.restore(); }
  text(c, 'Follow @therishikatha', 540, 893, '700 46px Poppins', '#FFFFFF', { pop: pk(.9) });
  // the products: the Navadurga set fanned on the left, the CHIRANJEEVI comic on the right
  const books = ['book1', 'book2', 'book3', 'book4', 'book5'];
  books.forEach((b, i) => { const d = i - 2; picture(c, PICS[b], 300 + d * 52, 1150 + Math.abs(d) * 10, 190, 250, { pop: pk(1.3 + i * .06), r: 6, shadow: 18, rot: d * .09 }); });
  picture(c, PICS.ashCover, 790, 1135, 230, 288, { pop: pk(1.6), r: 8, shadow: 24, rot: .03 + Math.sin(t * 1.1) * .006 });
  text(c, 'NAVADURGA', 300, 1330, '700 30px Cinzel', '#F4C058', { pop: pk(1.8), spacing: 3 });
  text(c, 'picture books', 300, 1370, 'italic 28px Marcellus', '#E8D8C0', { pop: pk(1.9) });
  text(c, 'CHIRANJEEVI', 790, 1330, '700 30px Cinzel', '#F4C058', { pop: pk(1.9), spacing: 3 });
  text(c, 'comics', 790, 1370, 'italic 28px Marcellus', '#E8D8C0', { pop: pk(2) });
  text(c, 'Check the link in bio, or DM us', 540, 1460, '500 36px Poppins', '#FFFFFF', { pop: pk(2.3) });
}
