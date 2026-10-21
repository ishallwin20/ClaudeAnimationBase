// shani_forms_props.js: the props of the Shani forms reel (src/scenes/shani_forms.js).
//   FORMS            the eight paintings by @gaurav_boii (PICS.sh_*, from tools/cutout.mjs): each one's title, where its
//                    face is (0..1 of the picture, the camera's focus) and its light
//   fitBox(img, mw, mh)                     the picture's size fitted into mw × mh
//   painting(c, img, x, y, w, h, o)         a painting centred on (x, y): o.z (zoom about o.f, the focus [0..1, 0..1]),
//                                           o.glow (its light behind), o.sheen (0..1, a gold sheen sweeping across),
//                                           o.dark (0..1, sunk into near black, the halo still burning), o.alpha
//   blurBack(c, img, o)                     the painting cover-filled, blurred and darkened, behind everything (o.a, o.drift)
//   dealCardCine(c, u, t)                   the 15K Family Deal card (Books 1–3, ₹500 → ₹350, till 25 Oct), as on ad 25
const FORMS = {
  danda:   { pic: 'sh_danda',   title: 'DANDADHIKARI SHANI', f: [.51, .25], col: '#E0A040' },
  nyaya:   { pic: 'sh_nyaya',   title: 'NYAYADHISH SHANI',   f: [.53, .20], col: '#F07A3A' },
  chhaya:  { pic: 'sh_chhaya',  title: 'CHHAYA SHANI',       f: [.52, .32], col: '#8C7CE0' },
  tapasvi: { pic: 'sh_tapasvi', title: 'TAPASVI SHANI',      f: [.51, .20], col: '#F2D08A' },
  bal:     { pic: 'sh_bal',     title: 'BAL SHANI',          f: [.49, .20], col: '#6FC8D0' },
  yoddha:  { pic: 'sh_yoddha',  title: 'YODDHA SHANI',       f: [.42, .22], col: '#FF9040' },
  saumya:  { pic: 'sh_saumya',  title: 'SAUMYA SHANI',       f: [.51, .30], col: '#F4B0C0' },
  raj:     { pic: 'sh_raj',     title: 'RAJ SHANI',          f: [.47, .26], col: '#FFD060' },
};
function fitBox(img, mw, mh) { const r = img.naturalWidth / img.naturalHeight; return mw / mh > r ? [mh * r, mh] : [mw, mw / r]; }
function painting(c, img, x, y, w, h, o = {}) {
  const z = o.z ?? 1, [fx, fy] = o.f || [.5, .5], px = (fx - .5) * w, py = (fy - .5) * h;
  c.save(); c.globalAlpha *= o.alpha ?? 1;
  c.translate(x + px, y + py); c.scale(z, z); c.translate(-px, -py);
  if (o.glow) glow(c, 0, 0, Math.max(w, h) * .95, o.glow, .38, 'screen');
  c.save(); c.shadowColor = 'rgba(0,0,0,.75)'; c.shadowBlur = 60; c.shadowOffsetY = 18; c.fillStyle = '#000'; c.fillRect(-w / 2, -h / 2, w, h); c.restore();
  c.drawImage(img, -w / 2, -h / 2, w, h);
  c.save(); c.beginPath(); c.rect(-w / 2, -h / 2, w, h); c.clip();
  if (o.dark > 0) { c.fillStyle = rgba('#05040A', .88 * o.dark); c.fillRect(-w / 2, -h / 2, w, h); }
  if (o.sheen > 0 && o.sheen < 1) {
    const sx = lerp(-w * 1.1, w * 1.1, o.sheen), g = c.createLinearGradient(sx - 160, -h / 2, sx + 160, h / 2);
    g.addColorStop(0, 'rgba(255,220,150,0)'); g.addColorStop(.5, 'rgba(255,226,170,.28)'); g.addColorStop(1, 'rgba(255,220,150,0)');
    c.globalCompositeOperation = 'screen'; c.fillStyle = g; c.fillRect(-w / 2, -h / 2, w, h);
  }
  c.restore();
  c.strokeStyle = rgba('#F4C46A', .55 * (1 - (o.dark || 0) * .7)); c.lineWidth = 3; c.strokeRect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12);
  c.restore();
}
function blurBack(c, img, o = {}) {
  const r = img.naturalWidth / img.naturalHeight, h = H * 1.15, w = Math.max(W * 1.15, h * r), dr = o.drift || 0;
  soft(c, 10, (s) => s.drawImage(img, (W - w) / 2 + dr * 40, (H - h) / 2 - dr * 30, w, h), { blur: 6, alpha: o.a ?? .5 });
}
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
