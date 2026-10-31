// sita_props.js: the sets and props of "Was RAM right to leave SITA?" (ad 67): the poets on the 3D map, the river at
// dusk and Lakshman's boat, Ayodhya at night and its whisperers, the palace window, Sita from behind (Sati's rig in
// Sita's colours), the throne the Earth sends up on the heads of nagas, falling petals, the Manas's page, the labels.

// ---------- the map: where each poet wrote, and the Ramayans of India ----------
const POET = {
  valmiki: { lon: 80.27, lat: 26.61, name: 'VALMIKI', sub: 'the first poet · by the Ganga' },
  kalidasa: { lon: 75.78, lat: 23.18, name: 'KALIDASA', sub: 'Ujjain · ~5th century' },
  bhava: { lon: 78.6, lat: 20.75, name: 'BHAVABHUTI', sub: 'Vidarbha · 8th century' },
  tulsi: { lon: 83.0, lat: 25.32, name: 'TULSIDAS', sub: 'Ayodhya & Kashi · 1574' },
};
const POET_ORDER = ['valmiki', 'kalidasa', 'bhava', 'tulsi'];
// the regional Ramayans for the ask: [lon, lat, title, language, label dx, dy]
const RAMAYANS = [
  [74.8, 34.0, 'RAMAVATAR CHARIT', 'Kashmiri', 0, -30],
  [82.2, 26.8, 'RAMCHARITMANAS', 'Awadhi', 30, -40],
  [72.6, 23.0, 'GIRIDHAR', 'Gujarati', -40, -30],
  [88.4, 23.2, 'KRITTIVASI', 'Bengali', 20, -30],
  [91.7, 26.15, 'SAPTAKANDA', 'Assamese', -10, -30],
  [75.38, 19.48, 'BHAVARTHA', 'Marathi', -30, -30],
  [85.8, 20.3, 'JAGAMOHAN', 'Odia', 30, -30],
  [79.8, 16.8, 'RANGANATHA', 'Telugu', 20, -30],
  [75.9, 14.6, 'TORAVE', 'Kannada', -40, -30],
  [79.2, 11.2, 'KAMBA RAMAYANAM', 'Tamil', 120, -10],
  [76.3, 10.0, 'ADHYATMA RAMAYANAM', 'Malayalam', -90, 30],
];

// a place's name on the map, kept inside the safe band (y 450–1180 above the captions, x 150–830)
function stopLabel(c, s, p, t, at, o = {}) {
  if (t < at) return; const [x, y, z] = toScreen3(p); if (z > 1) return;
  const big = o.big ?? 1, a = (o.alpha ?? 1), lx = clamp(x + (o.dx ?? 0), 150, 930), ly = clamp(y + (o.dy ?? -70 * big), 470, 1180);
  text(c, s.name, lx, ly, `700 ${Math.round(46 * big)}px Cinzel`, o.col || '#FFE2A0', { pop: t - at, alpha: a, glow: ['rgba(6,6,14,.95)', 20], spacing: 3 * big, maxW: 600 });
  if (s.sub && o.sub !== false) text(c, s.sub, lx, ly + 44 * big, `italic ${Math.round(30 * big)}px Marcellus`, '#F4EEE4', { pop: t - at - .12, alpha: a, glow: ['rgba(6,6,14,.95)', 16], spacing: 1 });
}
// a gold-edged pill (2,000 YEARS)
function chip(c, txt, x, y, t, at, o = {}) {
  const k = popK(t - at) * (o.alpha ?? 1); if (k <= .01) return;
  c.save(); c.translate(x, y); c.scale(k, k); c.font = `700 ${o.size || 44}px Cinzel`; c.letterSpacing = '3px';
  const tw = c.measureText(txt).width + 60, h = (o.size || 44) * 1.5;
  c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.fillStyle = 'rgba(20,12,24,.82)'; c.beginPath(); c.roundRect(-tw / 2, -h / 2, tw, h, h / 2); c.fill(); c.shadowBlur = 0;
  c.lineWidth = 3; c.strokeStyle = '#F4C46A'; c.stroke();
  c.fillStyle = o.col || '#FFE2A0'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 0, 2); c.restore();
}
// a dark band behind the captions
function band(c, y0, y1, a = .5) {
  if (a <= 0) return; c.save(); const g = c.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, 'rgba(6,4,6,0)'); g.addColorStop(.25, `rgba(6,4,6,${a})`); g.addColorStop(.75, `rgba(6,4,6,${a})`); g.addColorStop(1, 'rgba(6,4,6,0)');
  c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); c.restore();
}

// ---------- the river at dusk (Valmiki 7.46–47: she is left on the Ganga's far bank; Lakshman crosses back) ----------
// sky, a pale moon, the far bank and its trees, the water with the moon's track, mist; hy is the horizon.
function duskRiver(c, cam, t, o = {}) {
  const hy = o.hy ?? 1060;
  plane(c, cam, 0, (c) => {
    sky(c, [[0, '#070A1C'], [500, '#141A3A'], [900, '#3A3458'], [hy - 40, '#8A6070'], [hy + 10, '#B8806A']]);
    glow(c, 820, 380, 360, '#9FB0E0', .3); ellipse(c, 820, 380, 34, 34, '#EEF2FA');
    stars(c, 60, 4, t, .5);
  });
  plane(c, cam, .2, (c) => {
    ridge(c, hy - 10, 60, 7, '#2A2240', { freq: .006 });
    for (let i = 0; i < 18; i++) { const x = hash(i * 3.1) * 1300 - 100, h = 60 + hash(i * 5.7) * 90; ellipse(c, x, hy - 30 - h * .5, 30 + h * .3, h * .55, '#1C1630'); }
    fillPath(c, `M -200 ${hy - 6} L ${W + 200} ${hy - 6} L ${W + 200} ${hy + 6} L -200 ${hy + 6} Z`, '#14102A');
    haze(c, hy - 20, 120, '#C89088', .35);
  });
  plane(c, cam, .5, (c) => {
    river(c, hy, H - hy + 400, t, 820, '#141A34');
    glow(c, 820, hy + 120, 300, '#9FB0E0', .12);
    if (o.boat != null) boat(c, lerp(760, 900, o.boat), hy + 40 - o.boat * 10, lerp(.5, .32, o.boat), t);
  });
}
// a small boat going away: the boatman with his pole and Lakshman standing, in silhouette
function boat(c, x, y, k, t) {
  c.save(); c.translate(x, y + Math.sin(t * 1.6) * 2 * k); c.scale(k, k);
  const col = '#0A0816';
  fillPath(c, 'M -150 0 C -110 30 110 30 150 0 C 150 -8 140 -16 130 -12 L -130 -12 C -140 -16 -150 -8 -150 0 Z', col);
  // Lakshman: a standing figure with a crown, looking back
  fillPath(c, 'M -40 -12 L -36 -120 C -40 -150 -20 -165 0 -165 C 20 -165 40 -150 36 -120 L 40 -12 Z', col);
  ellipse(c, 0, -188, 20, 24, col); fillPath(c, 'M -15 -205 L -9 -246 L 0 -268 L 9 -246 L 15 -205 Z', col);
  // the boatman and his pole
  fillPath(c, 'M 80 -12 L 86 -100 C 84 -120 108 -126 112 -104 L 116 -12 Z', col); ellipse(c, 100, -122, 15, 18, col);
  strokePath(c, 'M 140 -170 L 70 60', col, 5);
  c.restore();
  strokePath(c, `M ${x - 160 * k} ${y + 6 * k} C ${x - 260 * k} ${y + 10 * k} ${x - 420 * k} ${y + 14 * k} ${x - 600 * k} ${y + 18 * k}`, rgba('#C8D6F5', .3), 2);
}

// ---------- Ayodhya at night: whispers in the lanes (Valmiki 7.42) ----------
// a palace on the right with a lit terrace (Ram on it, small), rooftops and shikharas with lit windows, the moon
function ayodhya(c, cam, t, o = {}) {
  plane(c, cam, 0, (c) => { sky(c, [[0, '#04060F'], [700, '#0E1430'], [1300, '#26244A'], [1900, '#1A1630']]); stars(c, 90, 9, t, .7); glow(c, 210, 330, 260, '#AFC0F0', .25); ellipse(c, 210, 330, 30, 30, '#EEF2FA'); });
  plane(c, cam, .25, (c) => {
    // far rooftops: a jagged line of houses, temple towers
    c.fillStyle = '#121232'; c.beginPath(); c.moveTo(-200, 1300);
    for (let x = -200; x <= W + 200; x += 60) { const h = 80 + hash(x * .07) * 120; c.lineTo(x, 1180 - h); c.lineTo(x + 60, 1180 - h); }
    c.lineTo(W + 200, 1300); c.closePath(); c.fill();
    for (const [x, h] of [[120, 300], [470, 360], [860, 280]]) fillPath(c, `M ${x - 50} 1180 L ${x - 40} ${1180 - h * .6} C ${x - 30} ${1180 - h * .9} ${x - 6} ${1180 - h} ${x} ${1180 - h - 30} C ${x + 6} ${1180 - h} ${x + 30} ${1180 - h * .9} ${x + 40} ${1180 - h * .6} L ${x + 50} 1180 Z`, '#121232');
    for (let i = 0; i < 40; i++) { const x = hash(i * 7.3) * W, y = 1060 + hash(i * 3.9) * 110; c.fillStyle = rgba('#FFB860', .55 + .3 * Math.sin(t * 2 + i)); c.fillRect(x, y, 8, 12); }
    haze(c, 1180, 160, '#3A3060', .5);
  });
  plane(c, cam, .55, (c) => {
    // the palace: a tall mass at right with a terrace and a chhatri
    fillPath(c, 'M 640 1400 L 640 900 L 700 900 L 700 860 L 1180 860 L 1180 1400 Z', '#0B0A1C');
    fillPath(c, 'M 700 860 L 1180 860 L 1180 846 L 700 846 Z', '#0B0A1C');
    for (let i = 0; i < 8; i++) fillPath(c, `M ${712 + i * 60} 846 L ${712 + i * 60} 820 L ${732 + i * 60} 820 L ${732 + i * 60} 846 Z`, '#0B0A1C');
    fillPath(c, 'M 960 846 L 960 760 C 960 700 1060 700 1060 760 L 1060 846 Z', '#0B0A1C'); fillPath(c, 'M 950 760 C 970 650 1050 650 1070 760 Z', '#0B0A1C');
    for (let i = 0; i < 6; i++) { glow(c, 690 + i * 80, 1010, 40, '#FFB050', .35); c.fillStyle = '#FFC070'; c.beginPath(); c.roundRect(680 + i * 80, 980, 22, 46, [11, 11, 0, 0]); c.fill(); }
    glow(c, 860, 840, 130, '#FFB060', .3);
    if (o.ram !== false) figure(c, (f) => { f.translate(860, 846); f.scale(.2, .2); ramSil(f, { t, col: '#08060E' }); }, { tint: ['#08060E', .95], rim: { col: '#FFC890', dx: 2, dy: -1, a: .8 } });
  });
  plane(c, cam, 1, (c) => {
    // the lane: walls left and right, lamps, the whisperers
    fillPath(c, 'M -200 1920 L -200 1100 L 190 1180 L 190 1920 Z', '#090814');
    fillPath(c, 'M 1280 1920 L 1280 1240 L 880 1280 L 880 1920 Z', '#090814');
    fillPath(c, `M -200 1560 L ${W + 200} 1560 L ${W + 200} 2200 L -200 2200 Z`, '#0A0812');
    for (const [x, y] of [[170, 1300], [900, 1340]]) { deepa(c, x, y, .7, t, 1, x); glow(c, x, y - 20, 220, '#FF9A40', .3); }
    const lean = o.lean || 0;
    const pair = (x, y, k, s) => {
      figure(c, (f) => { f.translate(x - 90 * k, y); f.scale(k, k); devotee(f, { t, pose: 'whisper', lean: .1 + lean * .15 }); }, { tint: ['#0A0812', .9], edge: { col: '#FFB070', w: 1.8, a: .7 }, rim: { col: '#FFD08A', dx: 3, dy: -2, a: .7 } });
      figure(c, (f) => { f.translate(x + 90 * k, y); f.scale(-k, k); devotee(f, { t: t + s, pose: 'pray', lean: .05 }); }, { tint: ['#0A0812', .9], edge: { col: '#FFB070', w: 1.8, a: .7 }, rim: { col: '#FFD08A', dx: -3, dy: -2, a: .7 } });
    };
    pair(330, 1600, .55, 1.3); pair(720, 1640, .62, 2.1);
    crowd(c, -60, 1140, 1940, 9, .9, t, o.murmur ?? .25, '#06050C', 4);
  });
}

// ---------- the palace window at night: a carved arch (jharokha) framing the moon ----------
function jharokha(c, x, y, w, h, col) {
  const p = `M ${x - w / 2} ${y} L ${x - w / 2} ${y - h * .62} C ${x - w / 2} ${y - h * .9} ${x - w * .2} ${y - h * .94} ${x} ${y - h} C ${x + w * .2} ${y - h * .94} ${x + w / 2} ${y - h * .9} ${x + w / 2} ${y - h * .62} L ${x + w / 2} ${y} Z`;
  c.save(); c.fillStyle = col; c.beginPath(); c.rect(-300, -300, W + 600, H + 600); c.fill(new Path2D(`M -300 -300 L ${W + 300} -300 L ${W + 300} ${H + 300} L -300 ${H + 300} Z ${p}`), 'evenodd'); c.restore();
  strokePath(c, p, rgba('#3A3458', .9), 10);
  return p;
}
// a single tear on a dark face, catching the moonlight: (x, y) its start, k 0..1 how far it has run
function tear(c, x, y, k, a = 1) {
  if (k <= 0 || a <= 0) return;
  const yy = y + easeIn(k) * 90;
  strokePath(c, `M ${x} ${y} L ${x - 3} ${yy}`, rgba('#CFE0FF', .35 * a), 3);
  glow(c, x - 3, yy, 26, '#DCE8FF', .7 * a); ellipse(c, x - 3, yy, 4, 6, rgba('#FFFFFF', a));
}

// ---------- Sita from behind: Sati's rig in Sita's colours (her tapas facing the sun, Raghuvamsha 14.66) ----------
function sitaBack(c, o = {}) {
  const keep = { ...SATI };
  Object.assign(SATI, { sari: '#E3A62A', sariSh: '#A8741A', border: '#B0202C', blouse: '#A61C28', skin: '#B47A56', skinSh: '#8C5A3E', hair: '#120C12', hairLt: '#2E2230' });
  sati(c, o); Object.assign(SATI, keep);
}

// ---------- the Earth opens (Valmiki 7.88.11–14): a throne rises on the heads of great nagas ----------
// x, y the ground line's centre; k scale; rise 0..1 how far it has come up (0: still under the ground); returns the seat's y
function nagaThrone(c, x, y, k, t, rise) {
  const up = easeOut(rise) * 420 * k, seat = y - up;
  c.save(); c.beginPath(); c.rect(-300, -300, W + 600, y + 300); c.clip();   // nothing below the ground line
  // five cobra hoods holding the seat up
  for (let i = 0; i < 5; i++) {
    // each naga rises in an S-curve and spreads its hood just under the seat, the seat resting on the hoods
    const hx = x + (i - 2) * 78 * k, hy = seat + 150 * k + Math.abs(i - 2) * 16 * k, sw = Math.sin(t * 2 + i) * 10 * k, d = (i - 2) * 12 * k;
    limb(c, [[hx + d * 2 + sw, y + 60 * k], [hx - 18 * k - sw, (y + hy) / 2 + 30 * k], [hx + 14 * k, (y + hy) / 2 - 30 * k], [hx, hy]], [24 * k, 22 * k, 20 * k, 18 * k], '#2C4A2E');
    limb(c, [[hx + d * 2 + sw + 6 * k, y + 60 * k], [hx - 12 * k - sw, (y + hy) / 2 + 30 * k], [hx + 18 * k, (y + hy) / 2 - 30 * k], [hx + 4 * k, hy]], [8 * k, 7 * k, 6 * k, 6 * k], '#C8B060');
    fillPath(c, `M ${hx - 46 * k} ${hy + 30 * k} C ${hx - 56 * k} ${hy - 20 * k} ${hx - 34 * k} ${hy - 86 * k} ${hx} ${hy - 92 * k} C ${hx + 34 * k} ${hy - 86 * k} ${hx + 56 * k} ${hy - 20 * k} ${hx + 46 * k} ${hy + 30 * k} C ${hx + 20 * k} ${hy + 14 * k} ${hx - 20 * k} ${hy + 14 * k} ${hx - 46 * k} ${hy + 30 * k} Z`, '#24402A');
    fillPath(c, `M ${hx - 30 * k} ${hy + 14 * k} C ${hx - 36 * k} ${hy - 20 * k} ${hx - 20 * k} ${hy - 66 * k} ${hx} ${hy - 70 * k} C ${hx + 20 * k} ${hy - 66 * k} ${hx + 36 * k} ${hy - 20 * k} ${hx + 30 * k} ${hy + 14 * k} Z`, '#C8A848');
    ellipse(c, hx - 11 * k, hy - 30 * k, 7 * k, 9 * k, '#24402A'); ellipse(c, hx + 11 * k, hy - 30 * k, 7 * k, 9 * k, '#24402A');
    ellipse(c, hx, hy + 22 * k, 14 * k, 12 * k, '#2C4A2E'); ellipse(c, hx - 6 * k, hy + 20 * k, 2.5 * k, 2.5 * k, '#FFD860'); ellipse(c, hx + 6 * k, hy + 20 * k, 2.5 * k, 2.5 * k, '#FFD860');
  }
  // the seat: a gold slab with a carved front and a lotus edge
  fillPath(c, `M ${x - 200 * k} ${seat} L ${x + 200 * k} ${seat} L ${x + 180 * k} ${seat + 50 * k} L ${x - 180 * k} ${seat + 50 * k} Z`, '#C8912E');
  fillPath(c, `M ${x - 200 * k} ${seat} L ${x + 200 * k} ${seat} L ${x + 200 * k} ${seat + 10 * k} L ${x - 200 * k} ${seat + 10 * k} Z`, '#F2C866');
  for (let i = 0; i < 9; i++) { const px = x + (i - 4) * 42 * k; ellipse(c, px, seat + 30 * k, 12 * k, 14 * k, '#E2AE45'); ellipse(c, px, seat + 30 * k, 5 * k, 6 * k, '#B0202C'); }
  c.restore();
  return seat;
}
// petals raining (the gods' flowers, 7.88.14): pink and gold flecks drifting down
function petals(c, t, a = 1, box = [-50, -100, W + 50, H]) {
  if (a <= 0) return; const [x0, y0, x1, y1] = box, w = x1 - x0, h = y1 - y0;
  for (let i = 0; i < 70; i++) {
    const sp = .6 + hash(i * 2.3) * .8, x = x0 + ((hash(i * 1.7) * w + Math.sin(t * .9 + i) * 40) % w + w) % w, y = y0 + ((hash(i * 4.1) * h + t * 140 * sp) % h + h) % h;
    const r = 6 + hash(i * 6.1) * 8, rot = t * (1 + hash(i)) + i;
    ellipse(c, x, y, r, r * .45, rgba(i % 3 ? '#F08AA0' : '#F6CE62', .85 * a), rot);
  }
}

// ---------- the Manas's page (Uttarkand 25): lamp-lit paper, lines of Awadhi, one in gold ----------
const MANAS = [
  'अहनिसि बिधिहि मनावत रहहीं। श्रीरघुबीर चरन रति चहहीं॥',
  'दुइ सुत सुंदर सीताँ जाए। लव कुस बेद पुरानन्ह गाए॥',
  'दोउ बिजई बिनई गुन मंदिर। हरि प्रतिबिंब मनहुँ अति सुंदर॥',
];
function manasPage(c, x, y, w, h, t, hl = 0) {   // the three consecutive lines, the middle one highlighted
  c.save(); c.translate(x, y); c.rotate(-.02);
  c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 40;
  const g = c.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, '#D9B57A'); g.addColorStop(.5, '#EED3A0'); g.addColorStop(1, '#C9A066');
  c.fillStyle = g; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 10); c.fill(); c.shadowBlur = 0;
  c.strokeStyle = '#9A2A1C'; c.lineWidth = 4; c.strokeRect(-w / 2 + 26, -h / 2 + 26, w - 52, h - 52); c.lineWidth = 1.5; c.strokeRect(-w / 2 + 36, -h / 2 + 36, w - 72, h - 72);
  text(c, '॥ श्री रामचरितमानस ॥', 0, -h / 2 + 90, '42px "Tiro Devanagari Sanskrit"', '#8A1E14', {});
  text(c, 'उत्तरकाण्ड', 0, -h / 2 + 145, '34px "Tiro Devanagari Sanskrit"', '#5A3418', {});
  MANAS.forEach((ln, i) => {
    const yy = -h / 2 + 260 + i * 110, on = i === 1 ? hl : 0;
    if (on > 0) { c.save(); c.globalAlpha = on; c.fillStyle = 'rgba(255,214,120,.55)'; c.beginPath(); c.roundRect(-w / 2 + 50, yy - 40, w - 100, 74, 12); c.fill(); c.restore(); }
    text(c, ln, 0, yy, '38px "Tiro Devanagari Sanskrit"', on > .5 ? '#7A1408' : '#3A2414', { maxW: w - 120 });
  });
  c.restore();
}
