// sanjeevani_cover.js: the Instagram cover for "Laye sajeevan" (cover.html = studio.html + this). One still: the
// painting without the Chalisa line, the title over the clouds inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/sanjeevani_loop_out   (then rename t0_00.png to cover.png)
LINES.length = 0;
POST.push((c) => {
  c.save(); c.globalAlpha = .55; c.translate(540, 1480); c.scale(1, .3); glow(c, 0, 0, 520, '#1A0F2E', 1, 'source-over'); c.restore();
  text(c, 'संकटमोचन', 540, 1462, '96px "Tiro Devanagari Sanskrit"', '#FFE7A8', { glow: ['rgba(40,16,40,.9)', 26], maxW: 900 });
  text(c, 'JAI SHRI HANUMAN', 540, 1560, '600 30px Poppins', '#FFF6DA', { glow: ['rgba(30,14,40,.9)', 14], spacing: 10 });
});
