// hanuman_loop_cover.js: the Instagram cover for "Ram hi paar lagavenge" (cover.html = studio.html + this). One still:
// the painting with the rings and light, no lyric line, the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/hanuman_ram_loop_out   (then rename t0_00.png to cover.png)
LYRICS.length = 0;
POST.push((c) => {
  c.save(); const g = c.createLinearGradient(0, 220, 0, 620); g.addColorStop(0, 'rgba(14,24,8,.75)'); g.addColorStop(.6, 'rgba(14,24,8,.4)'); g.addColorStop(1, 'rgba(14,24,8,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 640); c.restore();
  text(c, 'राम ही पार लगावेंगे', 540, 380, '84px "Tiro Devanagari Sanskrit"', '#FFE7A8', { glow: ['rgba(60,30,6,.9)', 26], maxW: 940 });
  text(c, 'JAI SHRI RAM', 540, 480, '600 34px Poppins', '#FFF6DA', { glow: ['rgba(30,20,6,.9)', 14], spacing: 10 });
});
