// navadurga.js: "Who is protecting you? Maa." The nine forms of Maa Durga, one painting each (Cinematic style, 21 s).
// The owner's paintings (PICS.nd1 … nd9, src/scenes/navadurga_images.js) shot like film: a slow push toward each face,
// gold dust, a light sweep, gold flash cuts on a 90 BPM grid (1.333 s = two beats) for the music the owner adds in Edits.
// Hook meme → nine forms with their names → a 3×3 mosaic, "Jai Maa Durga" → a soft follow card.

LOOK.bloom = .12; LOOK.vignette = .5; LOOK.grain = .06;

const BEAT = 60 / 90;
const TL = { hook: 0, forms: 3 * BEAT, step: 2 * BEAT, mosaic: 3 * BEAT + 18 * BEAT, card: 17.6, end: 21 };   // forms 2.0, mosaic 14.0

// the nine forms: name, the face in the painting (px in the 1080×1928 painting) the camera pushes toward
const FORMS = [
  ['Shailputri', 735, 760], ['Brahmacharini', 754, 890], ['Chandraghanta', 552, 775],
  ['Kushmanda', 512, 500], ['Skandamata', 544, 715], ['Katyayani', 484, 670],
  ['Kalaratri', 528, 515], ['Mahagauri', 540, 495], ['Siddhidatri', 512, 810],
];

// a painting filling the frame (cover-fit; the paintings are 1080×1928, so it trims 4 px top and bottom)
function paint(c, img) {
  if (!img || !img.naturalWidth) return;
  const k = Math.max(W / img.naturalWidth, H / img.naturalHeight), w = img.naturalWidth * k, h = img.naturalHeight * k;
  c.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
}
// a soft diagonal band of light crossing the frame as p goes 0 → 1
function sweep(c, p, a = .16) {
  if (p <= 0 || p >= 1) return;
  const x = lerp(-500, W + 500, p);
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'screen'; c.translate(x, H / 2); c.rotate(.42);
  const g = c.createLinearGradient(-260, 0, 260, 0);
  g.addColorStop(0, 'rgba(255,226,170,0)'); g.addColorStop(.5, `rgba(255,232,190,${a})`); g.addColorStop(1, 'rgba(255,226,170,0)');
  c.fillStyle = g; c.fillRect(-260, -H * 1.5, 520, H * 3); c.restore();
}
// a dark soft pad behind lettering, so gold reads over a bright painting
function pad(c, x, y, rx, ry, a = .6) {
  c.save(); c.translate(x, y); c.scale(rx / ry, 1);
  const g = c.createRadialGradient(0, 0, 0, 0, 0, ry);
  g.addColorStop(0, `rgba(10,5,4,${a})`); g.addColorStop(.55, `rgba(10,5,4,${a * .7})`); g.addColorStop(1, 'rgba(10,5,4,0)');
  c.fillStyle = g; c.fillRect(-ry, -ry, ry * 2, ry * 2); c.restore();
}
// one painting shot: push in (or ease out) toward the face, dust drifting up, the light sweep
function formShot(c, u, t, i, dur, o = {}) {
  const [, fx, fy] = FORMS[i], p = clamp(u / dur), inward = o.inward ?? i % 2 === 0;
  const cam = { z: inward ? lerp(1.03, 1.1, easeIO(p)) : lerp(1.1, 1.04, easeIO(p)), fx, fy: fy - 4 };
  plane(c, cam, 1, (c) => paint(c, PICS['nd' + (i + 1)]));
  sweep(c, seg(u, .1, dur + .4), .14);
  plane(c, cam, 1.2, (c) => motes(c, { n: 34, seed: 7 + i * 13, box: [-60, 200, W + 60, 1900], r: 3.2, col: '#FFD58A', a: .55, vx: 8, vy: -40, t }));
}

// ---------- hook: all nine flick by (2/9 s each, hard cuts) under the meme, one push across the whole hook ----------
const FLICK = TL.forms / 9;
FORMS.forEach((_, i) => SHOTS.push({ a: i * FLICK, b: (i + 1) * FLICK + .01, draw(c, u, t) { formShot(c, t, t, i, TL.forms, { inward: true }); pad(c, 520, 1235, 600, 240, .78); } }));
say(-.35, TL.forms - .02, 'Them: | "Who is protecting you?" | Me: "*Maa.*" 🔱', { y: 1235, size: 50, at: [-1, -1, -1, -1, -1, .85, .97, 1.09] });

// ---------- the nine forms ----------
FORMS.forEach(([name], i) => {
  const a = TL.forms + i * TL.step;
  SHOTS.push({ a, b: a + TL.step + .02, draw(c, u, t) {
    formShot(c, u, t, i, TL.step);
    pad(c, 470, 1375, 600, 210, .82);
    text(c, `DAY ${i + 1}`, 470, 1318, '40px Marcellus', '#FBE0CF', { pop: u - .02, spacing: 10, glow: ['rgba(0,0,0,.9)', 12] });
    text(c, `MAA ${name.toUpperCase()}`, 470, 1400, '700 78px Cinzel', '#FFE3A3', { pop: u - .08, spacing: 3, maxW: 820, glow: ['rgba(20,8,0,.95)', 20] });
    text(c, `MAA ${name.toUpperCase()}`, 470, 1400, '700 78px Cinzel', '#F4C46A', { pop: u - .08, spacing: 3, maxW: 820, glow: ['rgba(244,196,106,.45)', 22], alpha: .55 });
  } });
});

// ---------- the mosaic: all nine, "Jai Maa Durga" ----------
SHOTS.push({ a: TL.mosaic, b: TL.card + .6, draw(c, u, t) {
  sky(c, [[0, '#120806'], [1920, '#2A120A']]);
  const cam = { z: lerp(1, 1.06, easeIO(u / 4)), fx: 540, fy: 960 };
  plane(c, cam, 1, (c) => {
    for (let j = 0; j < 9; j++) picture(c, PICS['nd' + (j + 1)], 180 + (j % 3) * 360, 320 + Math.floor(j / 3) * 640, 360, 642, { pop: u + .12 - j * .08 });
    c.globalAlpha = seg(u, 1, 1.3); c.strokeStyle = '#E9B85C'; c.lineWidth = 6; c.beginPath();
    for (const x of [360, 720]) { c.moveTo(x, 0); c.lineTo(x, H); }
    for (const y of [640, 1280]) { c.moveTo(0, y); c.lineTo(W, y); }
    c.stroke(); c.globalAlpha = 1;
  });
  c.fillStyle = `rgba(12,6,4,${.42 * seg(u, 1.0, 1.6)})`; c.fillRect(0, 0, W, H);
  pad(c, 520, 960, 640, 260, .75 * seg(u, 1.0, 1.6));
  glow(c, 520, 960, 520, '#F4A640', .22 * seg(u, 1.2, 2));
  plane(c, cam, 1.2, (c) => motes(c, { n: 60, seed: 41, box: [-60, 0, W + 60, 1920], r: 3.5, col: '#FFD58A', a: .6, vx: 6, vy: -50, t }));
} });
say(TL.mosaic + 1.05, TL.card + .35, '*Jai* *Maa* *Durga* 🔱', { y: 960, size: 92, at: [TL.mosaic + 1.15, TL.mosaic + 1.4, TL.mosaic + 1.65, TL.mosaic + 1.9] });

// ---------- the soft follow card ----------
function followCard(c, u, t) {
  sky(c, [[0, '#04100E'], [900, '#0F2A27'], [1920, '#050E0C']]);
  glow(c, 470, 900, 760, '#2E5F5A', .55, 'screen');
  motes(c, { n: 60, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#F4C46A', a: .6, vx: 6, vy: -26, t });
  const X = 470, pk = d => u - d;
  picture(c, PICS.logo, X, 600, 170, 170, { pop: pk(.15), r: 85, glow: ['rgba(244,196,106,.35)', 40] });
  text(c, 'NINE FORMS.', X, 790, '700 76px Cinzel', '#F4C46A', { pop: pk(.35), spacing: 4, glow: ['rgba(244,196,106,.55)', 26], maxW: 840 });
  text(c, 'NINE STORIES.', X, 880, '700 76px Cinzel', '#F4C46A', { pop: pk(.5), spacing: 4, glow: ['rgba(244,196,106,.55)', 26], maxW: 840 });
  text(c, 'Their stories, in the Rishi Katha books', X, 975, '42px Marcellus', '#FBE0CF', { pop: pk(.7), maxW: 820 });
  for (let j = 0; j < 9; j++) {
    const x = X + (j - 4) * 92, y = 1135 + Math.abs(j - 4) * 8;
    picture(c, PICS['nd' + (j + 1)], x, y, 84, 150, { pop: pk(.85 + j * .05), r: 8, shadow: 14, rot: (j - 4) * .035 });
  }
  const k = popK(pk(1.4)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (k > .01) { c.save(); c.translate(X, 1330); c.scale(k, k); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-330, -46, 660, 92, 46); c.fill(); c.restore(); }
  text(c, 'Follow @therishikatha', X, 1333, '700 48px Poppins', '#FFFFFF', { pop: pk(1.4), maxW: 600 });
  text(c, 'rishikatha.com', X, 1430, '500 36px Poppins', '#CFE3DF', { pop: pk(1.7) });
}
SHOTS.push({ a: TL.card, b: TL.end + 1, xf: .5, draw: followCard });

// gold flash on every beat cut (not the hook flicks, not frame 0)
const CUTS = [...FORMS.map((_, i) => TL.forms + i * TL.step), TL.mosaic];
POST.push((c, t) => { for (const tc of CUTS) if (t >= tc && t < tc + .35) flash(c, .5 * Math.exp(-(t - tc) / .07), '#FFD9A0'); });
