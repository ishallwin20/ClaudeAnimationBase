// shiva_cover.js: the Instagram cover for "Karpur Gauram" (cover.html = studio.html + this). One still: the painting
// without the verse, the title in the night sky above him, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/karpur_gauram_loop_out   (then rename t0_00.png to cover.png)
LINES.length = 0;
POST.push((c) => {
  text(c, 'कर्पूरगौरं', 540, 400, '108px "Tiro Devanagari Sanskrit"', '#FFE7A8', { glow: ['rgba(6,8,24,.95)', 26], maxW: 900 });
  text(c, 'OM NAMAH SHIVAYA', 540, 500, '600 30px Poppins', '#EEF2FF', { glow: ['rgba(6,8,24,.95)', 14], spacing: 10 });
});
