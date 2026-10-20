// markandeya_props.js: the sets, lights and props of the Markandeya reel (src/scenes/markandeya.js).
//   SKY.*            the skies: blood (Yama's red), night (the forest shrine), void (the lamps), ochre (the crowded
//                    Earth), dawn (grace)
//   FX.*             figure() lights: red (Yama's light on a face), lamp (oil lamps from below right), sil (a
//                    near-black silhouette with a hot edge), dawn (gold, from the right), white (the burst)
//   markBust(c, o)   the boy's bare shoulders and chest under markHead() (head units): the mala, the sacred thread, ash
//   lingaCrack(c, x, y, k, a, t)  cracks of light running up a linga drawn by linga(c, x, y, k)
//   duta(c, x, y, s, o)  a Yamaduta: arunasura() standing in near black, with red eyes (o.lean, o.a)
//   dealCardCine(c, u, t)  the 15K Family Deal card in the Cinematic style (Books 1–3, ₹500 → ₹350, till 25 Oct)
const SKY = {
  blood: (c) => sky(c, [[0, '#0A0206'], [700, '#24060A'], [1300, '#4A0C0E'], [1920, '#120306']]),
  night: (c) => sky(c, [[0, '#05070F'], [700, '#0E1428'], [1300, '#1E2440'], [1920, '#0A0C16']]),
  void: (c) => sky(c, [[0, '#06040A'], [900, '#120A12'], [1920, '#060406']]),
  ochre: (c) => sky(c, [[0, '#120E0C'], [700, '#3A2C1E'], [1150, '#7A5A36'], [1300, '#8E6A40']]),
  dawn: (c) => sky(c, [[0, '#1E1430'], [600, '#5A2E48'], [1100, '#C9663D'], [1450, '#FFCF86'], [1920, '#3A1A12']]),
};
const FX = {
  red: { tint: ['#3A0810', .16], edge: { col: '#FF9A6A', w: 3, a: .7 }, rim: { col: '#FFB08A', dx: 9, dy: -4, a: .9, blur: 1.5 } },
  lamp: { tint: ['#2A1206', .2], edge: { col: '#FFB070', w: 2.6, a: .7 }, rim: { col: '#FFD08A', dx: 7, dy: -3, a: .9, blur: 1 } },
  sil: (a = .9, col = '#FF9A6A') => ({ tint: ['#0E0608', a], edge: { col, w: 2.2, a: .8 }, rim: { col: '#FFC09A', dx: 3, dy: -3, a: .9 } }),
  dawn: { tint: ['#3A2010', .08], edge: { col: '#FFE2A8', w: 2.6, a: .8 }, rim: { col: '#FFF0C8', dx: 8, dy: -4, a: .9, blur: 1.5 } },
  white: { tint: ['#FFF4E0', .12], edge: { col: '#FFFFFF', w: 3, a: .9 }, rim: { col: '#FFFFFF', dx: 0, dy: -6, a: 1, blur: 2 } },
};

// the boy's shoulders and chest, in head units (draw after markHead so it covers the neck's foot)
function markBust(c, o = {}) {
  const P = { ...MARK_PAL, ...(o.pal || {}) }, br = Math.sin((o.t || 0) * 1.6) * 1.5;
  const B = `M -150 ${-700 + br} C -116 ${-720 + br} -64 -722 -27 -728 L 27 -728 C 64 -722 116 ${-720 + br} 150 ${-700 + br} C 178 -680 196 -620 198 -520 L -198 -520 C -196 -620 -178 -680 -150 ${-700 + br} Z`;
  fillPath(c, B, P.skin);
  inside(c, B, () => {
    fillPath(c, 'M -220 -720 L -120 -720 C -126 -660 -120 -600 -110 -520 L -220 -520 Z', rgba(P.skinSh, .85));
    fillPath(c, 'M -40 -728 C -20 -712 20 -712 40 -728 L 40 -716 C 20 -700 -20 -700 -40 -716 Z', rgba(P.skinDk, .5));
    for (const s of [-1, 1]) strokePath(c, `M ${s * 96} ${-640 + br} C ${s * 64} ${-620 + br} ${s * 30} ${-620 + br} ${s * 8} ${-632 + br}`, rgba(P.skinSh, .7), 3);
    strokePath(c, `M -120 ${-712 + br} C -60 -640 0 -580 60 -520`, rgba('#F2EADA', .9), 3.4);   // the sacred thread
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) strokePath(c, `M ${s * 150} ${-668 + i * 10} L ${s * 186} ${-664 + i * 10}`, rgba(P.ash, .85), 4);   // ash on the arms
  });
  for (let i = 0; i <= 16; i++) { const u = i / 16, x = lerp(-50, 50, u), y = -726 + br + Math.sin(u * Math.PI) * 74; ellipse(c, x, y, 6, 6, P.bead); }
}

// light running up a linga's shaft in jagged lines (the linga drawn by linga(c, x, y, k)); a 0..1
function lingaCrack(c, x, y, k, a, t) {
  if (a <= 0) return;
  const rnd = lcg(17), P = [];
  for (let i = 0; i < 4; i++) { let px = (i - 1.5) * 22 + (rnd() - .5) * 10, py = -86; const L = [[px, py]]; for (let j = 0; j < 8; j++) { px += (rnd() - .5) * 18; py -= 18 + rnd() * 10; px = clamp(px, -44, 44); L.push([px, py]); if (rnd() < .3) P.push([[px, py], [px + (rnd() - .5) * 30, py - 14 - rnd() * 10]]); } P.push(L); }
  c.save(); c.translate(x, y); c.scale(k, k);
  const n = Math.max(2, Math.round(9 * clamp(a * 1.3)));
  for (const [w, col, al] of [[7, '#FFB040', .45], [2.2, '#FFF2C0', 1]]) { c.strokeStyle = rgba(col, al * clamp(a * 2)); c.lineWidth = w; c.lineJoin = 'round'; c.lineCap = 'round'; for (const L of P) { c.beginPath(); L.slice(0, n).forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.stroke(); } }
  c.restore();
  glow(c, x, y - 180 * k, 300 * k * (.5 + a), '#FFC870', .7 * a);
}

// a Yamaduta, Death's messenger: the asura rig standing, in near black, eyes red
function duta(c, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  figure(c, (f) => { f.translate(x, y); f.rotate(o.lean || 0); f.scale(o.flip ? -s : s, s); arunasura(f, { t: o.t, pose: 'stand', arms: 'roar', expr: 'scream', crown: 'helm' }); }, { ...FX.sil(.93, '#FF6A4A'), alpha: a });
  c.save(); c.translate(x, y); c.rotate(o.lean || 0); c.scale(o.flip ? -s : s, s);
  for (const e of [-1, 1]) glow(c, e * 22, -912, 40, '#FF2A10', .9 * a);
  c.restore();
}

// ---------- the card: the 15K Family Deal (Books 1–3, ₹350, till 25 Oct midnight) ----------
function dealCardCine(c, u, t) {
  sky(c, [[0, '#04100E'], [900, '#0F2A27'], [1920, '#050E0C']]);
  glow(c, 470, 950, 760, '#2E5F5A', .55, 'screen');
  motes(c, { n: 60, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#F4C46A', a: .6, vx: 6, vy: -26, t });
  const X = 470, pk = d => u - d * .62, br = Math.sin(t * 1.3) * .008;
  picture(c, PICS.logo, X, 500, 120, 120, { pop: pk(.1), r: 60 });
  text(c, '15K FAMILY DEAL', X, 628, '700 64px Cinzel', '#F4C46A', { pop: pk(.25), glow: ['rgba(244,196,106,.55)', 26], spacing: 3, maxW: 860 });
  text(c, 'our thank-you to all of YOU', X, 698, '40px Marcellus', '#FBE0CF', { pop: pk(.4), maxW: 840 });
  [['book1', -1], ['book3', 1], ['book2', 0]].forEach(([b, i], j) => picture(c, PICS[b], X + i * 205, 905 + Math.abs(i) * 28, 250, 250, { rot: i * .1 + br, pop: pk(.55 + j * .12), r: 10, shadow: 26, glow: ['rgba(255,196,120,.28)', 40] }));
  text(c, 'Books 1–3 · Set of 3', X, 1112, '700 40px Poppins', '#FFFFFF', { pop: pk(1.0), maxW: 860 });
  text(c, '₹500', X - 120, 1190, '500 54px Poppins', '#9FB8B2', { pop: pk(1.1) });
  if (u > .87) { const k = easeOut(seg(u, .87, 1.05)); c.save(); c.strokeStyle = '#F15A24'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(X - 185, 1204); c.lineTo(lerp(X - 185, X - 55, k), lerp(1204, 1178, k)); c.stroke(); c.restore(); }
  text(c, '₹350', X + 95, 1186, `700 ${Math.round(86 * (1 + .04 * Math.max(0, Math.sin(t * 5))))}px Poppins`, '#F15A24', { pop: pk(1.6), glow: ['rgba(241,90,36,.5)', 24] });
  text(c, 'Extended till 25 Oct, midnight', X, 1266, '700 38px Poppins', '#FF9A6A', { pop: pk(1.85), maxW: 860 });
  const k = popK(pk(2.1)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (k > .01) { c.save(); c.translate(X, 1356); c.scale(k, k); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-270, -46, 540, 92, 46); c.fill(); c.restore(); }
  text(c, 'Comment FAMILY', X, 1359, '700 52px Poppins', '#FFFFFF', { pop: pk(2.1) });
  text(c, "we'll DM you the deal · or tap the link in bio", X, 1432, '500 30px Poppins', '#CFE3DF', { pop: pk(2.35), maxW: 880 });
  text(c, 'rishikatha.com · Follow @therishikatha', X, 1480, '500 30px Poppins', '#9FB8B2', { pop: pk(2.5), maxW: 880 });
}
