// shiva_tandav_cover.js: the Instagram cover for "Shiv Tandav" (cover.html = studio.html + this). One still: his
// Nataraja with the trishul in light (render at 15.5 s), a bigger title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=15.5 --out=out/shiv_tandav_out   (then rename the PNG to cover.png)
POST.length = 0;
POST.push((c) => {
  c.save(); const g = c.createLinearGradient(0, 230, 0, 640); g.addColorStop(0, 'rgba(14,30,80,0)'); g.addColorStop(.45, 'rgba(14,30,80,.38)'); g.addColorStop(1, 'rgba(14,30,80,0)'); c.fillStyle = g; c.fillRect(0, 230, W, 410); c.restore();
  text(c, 'HAR HAR MAHADEV', 540, 330, '600 36px Poppins', '#FFF6DA', { glow: ['rgba(10,25,70,.9)', 16], spacing: 12 });
  text(c, 'शिव ताण्डव', 540, 430, '120px "Tiro Devanagari Sanskrit"', '#FFE08A', { glow: ['rgba(10,25,70,.95)', 30], maxW: 940 });
});
