// rudra_tandav_cover.js: the Instagram cover for "Rudra Tandav" (rudra_cover.html = rudra.html + this). One still: his
// rage under the twin bolts, the third eye burning (render at 9.65 s), a bigger title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=rudra_cover.html --stills=9.65 --out=out/rudra_tandav_out   (then rename the PNG to cover.png)
POST.length = 0;
POST.push((c) => {
  c.save(); const g = c.createLinearGradient(0, 230, 0, 640); g.addColorStop(0, 'rgba(6,2,10,0)'); g.addColorStop(.45, 'rgba(6,2,10,.5)'); g.addColorStop(1, 'rgba(6,2,10,0)'); c.fillStyle = g; c.fillRect(0, 230, W, 410); c.restore();
  text(c, 'HAR HAR MAHADEV', 540, 330, '600 36px Poppins', '#FFE2C2', { glow: ['rgba(40,0,0,.95)', 16], spacing: 12 });
  text(c, 'रुद्र ताण्डव', 540, 430, '120px "Tiro Devanagari Sanskrit"', '#FFA84A', { glow: ['rgba(60,0,0,.95)', 30], maxW: 940 });
});
