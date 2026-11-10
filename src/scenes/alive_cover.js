// alive_cover.js: the Instagram cover for "Is HANUMAN alive?" (cover.html = studio.html + this).
// One still: Hanuman grown huge against the moon, the mountain of herbs on his palm; the title inside the 3:4 grid
// crop (y 240–1680).   node render.mjs --page=cover.html --stills=0 --out=out/alive_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c) {
  const t = TL.RIP + 5.2;
  himalaya(c, t, { hide: 0, giant: 1, eyes: 1, anger: 1, grip: 1, cam: { pos: [0, 11, 97], at: [-2.5, 19.5, 0], fov: 40 } });
  c.save(); const h = c.createLinearGradient(0, 1150, 0, 1750); h.addColorStop(0, 'rgba(4,6,18,0)'); h.addColorStop(.45, 'rgba(4,6,18,.82)'); h.addColorStop(1, 'rgba(4,6,18,.95)'); c.fillStyle = h; c.fillRect(0, 1150, W, H - 1150); c.restore();
  text(c, '“IS', 540, 1330, '700 84px Cinzel', '#FFF3DC', { glow: ['rgba(4,6,18,.9)', 24], spacing: 4 });
  text(c, 'HANUMAN', 540, 1450, '700 150px Cinzel', '#F4C46A', { glow: ['rgba(244,170,60,.6)', 34], spacing: 6 });
  text(c, 'ALIVE?”', 540, 1578, '700 96px Cinzel', '#FFF3DC', { glow: ['rgba(4,6,18,.9)', 24], spacing: 6 });
} });
