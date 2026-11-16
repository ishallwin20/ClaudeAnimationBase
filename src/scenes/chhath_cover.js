// chhath_cover.js: the Instagram cover for the Chhath reel (cover.html = studio.html + this). One still: the vrati
// waist-deep, her soop raised to the setting sun; the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/chhath_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  ghat(c, 2.2, { mood: ['dusk'], sunEl: .9, sunR: 3.0, hero: 1, raise: 1, pools: .3 }, { pos: [.1, 1.15, 3.9], at: [0, .85, -2.4], fov: 28 }, lens(dist(HERO_P), 4));
  band(c, 250, 560, .35);
  text(c, 'CHHATH PUJA', 540, 350, '700 110px Cinzel', GOLD, { spacing: 5, glow: ['rgba(10,6,4,.95)', 30], maxW: 980 });
  text(c, 'explained in 4 days', 540, 462, 'italic 58px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 20] });
  band(c, 1400, 1700, .7);
  text(c, 'WHY THE', 540, 1490, '700 54px Cinzel', CREAM, { spacing: 4, glow: ['rgba(6,5,10,.95)', 20] });
  text(c, 'SETTING SUN?', 540, 1580, '700 84px Cinzel', GOLD, { spacing: 4, glow: ['rgba(6,5,10,.95)', 22], maxW: 980 });
} });
