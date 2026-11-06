// tara_cover.js: the cover (cover.html = studio.html + this after tara.js): the darshan, Tara and the child, with the
// title inside the 3:4 grid crop (y 240–1680). Render: node render.mjs --page=cover.html --stills=0 --out=out/cover
SHOTS.length = 0; POST.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  cam(c, 540, 1060, 1.12);
  bank(c, 101, { devi: { eyes: 'front', mouth: 'smile', baby: 'calm' } });
  [[300, 300, .55, 30], [380, 370, .4, 28]].forEach(([rx, ry, a, size], i) =>
    nameRing(c, TR_FACE[0], TR_FACE[1] + 120, rx, ry, -Math.PI * 1.1, Math.PI * .1, 'जय माँ तारा', { size, a, gap: 46, rot: i * .3, ph: 2, seed: i * 3, shimmer: .4, glow: 'rgba(255,220,160,.85)', col: '#FFF6E2' }));
} });
POST.push((c) => {
  glow(c, 540, 400, 560, '#000000', .6, 'source-over');
  const line = (y, parts, size) => {
    c.save(); c.font = `700 ${size}px Cinzel`; c.textBaseline = 'middle'; const tw = parts.reduce((s, [w]) => s + c.measureText(w).width, 0); let x = 540 - tw / 2;
    for (const [w, gold] of parts) { c.shadowColor = 'rgba(5,4,12,.95)'; c.shadowBlur = 26; c.fillStyle = gold ? '#F4C46A' : '#FFF3DC'; c.fillText(w, x, y); x += c.measureText(w).width; }
    c.restore();
  };
  line(330, [['Who saved ', 0], ['SHIVA', 1]], 80);
  line(430, [['from the ', 0], ['POISON', 1], ['?', 0]], 80);
  c.save(); c.translate(540, 1600); c.scale(1, .25); glow(c, 0, 0, 520, '#000000', .6, 'source-over'); c.restore();
  text(c, 'Maa Tara · as worshipped at Tarapith', 540, 1600, 'italic 44px Marcellus', '#F2E2C0', { glow: ['rgba(0,0,0,.9)', 16] });
});
