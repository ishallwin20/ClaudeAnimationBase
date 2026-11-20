// tulsi_cover.js: the cover (cover.html = studio.html + this after tulsi.js): the bride tulsi in her mandap and her groom,
// the Shaligram, with the title inside the 3:4 grid crop (y 240–1680). Render: node render.mjs --page=cover.html --stills=0
SHOTS.length = 0; POST.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  cam(c, 540, 1180, 1.12);
  court(c, 2.3, { glow: true });
  glow(c, TV_STONE[0] + 6, TV_STONE[1] - 26, 170, '#FFD890', .4, 'lighter');
  for (let i = 0; i < 18; i++) twinkle(c, 300 + hash(i) * 480, 620 + hash(i + 3) * 900, 12 + hash(i + 1) * 10, .3 + .5 * hash(i + 7), '#FFF2C8');
  petals(c, 6, 0, 12, .8);
} });
POST.push((c) => {
  glow(c, 540, 420, 560, '#000000', .62, 'source-over');
  const line = (y, parts, size) => {
    c.save(); c.font = `700 ${size}px Cinzel`; c.textBaseline = 'middle'; const tw = parts.reduce((s, [w]) => s + c.measureText(w).width, 0); let x = 540 - tw / 2;
    for (const [w, gold] of parts) { c.shadowColor = 'rgba(5,4,12,.95)'; c.shadowBlur = 26; c.fillStyle = gold ? '#F4C46A' : '#FFF3DC'; c.fillText(w, x, y); x += c.measureText(w).width; }
    c.restore();
  };
  line(330, [['Why do we ', 0], ['MARRY', 1]], 76);
  line(440, [['TULSI', 1], [' to a ', 0], ['STONE', 1], ['?', 0]], 92);
  c.save(); c.translate(540, 1600); c.scale(1, .25); glow(c, 0, 0, 540, '#000000', .65, 'source-over'); c.restore();
  text(c, 'The story behind Tulsi Vivah', 540, 1600, 'italic 46px Marcellus', '#F2E2C0', { glow: ['rgba(0,0,0,.9)', 16] });
});
