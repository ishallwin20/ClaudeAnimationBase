// kula_cover.js: the Instagram cover for ad 115 (cover.html = studio.html + this). One still: the fishermen round the
// saffron kopparai at dusk, torches up, the plain below; the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/kula_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  const pos = orbit(206, 0, 7.4, 1.0), at = off(SUA, [0, 1.2, 0]);
  aruna(c, 28, pos, at, 46, DUSK, { fire: .5, fireO: potO({ rocks: false, potYaw: -2.0, tins: 1, size: .3, halo: .12, haze: .05 }) }, lens(dist(at), 1.4, { max: 6 }));
  lighters(c, 28);
  band(c, 250, 640, .55);
  text(c, '3,500 KG OF GHEE', 540, 360, '700 84px Cinzel', GOLD, { spacing: 4, glow: ['rgba(255,140,50,.5)', 28], maxW: 1000 });
  text(c, '1.5 KM OF CLOTH', 540, 470, '700 84px Cinzel', CREAM, { spacing: 4, glow: ['rgba(6,5,10,.95)', 24], maxW: 1000 });
  text(c, 'Arunachala · the Maha Deepam', 540, 565, 'italic 42px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 16] });
  band(c, 1230, 1680, .62);
  text(c, 'WHO LIGHTS', 540, 1340, '700 104px Cinzel', CREAM, { spacing: 6, glow: ['rgba(6,5,10,.95)', 24], maxW: 1000 });
  text(c, 'THIS FIRE?', 540, 1480, '700 140px Cinzel', GOLD, { spacing: 8, glow: ['rgba(255,140,50,.55)', 36], maxW: 1000 });
  text(c, 'the fishermen of Parvatha Raja Kulam', 540, 1600, 'italic 40px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 16] });
} });
