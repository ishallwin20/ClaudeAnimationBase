// along_cover.js: the Instagram cover for the Diwali aarti-along (cover.html = studio.html + this). One still: Maa
// Lakshmi inside every ring of the round lit at once, the lamp at her face; the title and the count inside the 3:4 grid
// crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/along_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  S.set(2); COINS.set(2.3, LOOP);
  LAMP.place(circleAt('face', 2, .3), 2, { power: 4.2 });
  for (const id of ORDER) RINGS[id].forEach(r => r.set(1, id === 'whole' ? .7 : .95));
  cam3({ pos: [6.3, 1.62, 0], at: [0, 1.6, 0], fov: 40 });
  render3(c, SC, CAM3, { exposure: 1.12, fx: lens(dist([0, 1.5, 0]), 4) });
  c.save(); const gr = c.createLinearGradient(0, 220, 0, 640); gr.addColorStop(0, 'rgba(6,4,6,.9)'); gr.addColorStop(.7, 'rgba(6,4,6,.6)'); gr.addColorStop(1, 'rgba(6,4,6,0)'); c.fillStyle = gr; c.fillRect(0, 0, W, 640); c.restore();
  text(c, 'DIWALI AARTI', 540, 340, '700 110px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 24], spacing: 4, maxW: 1000 });
  text(c, 'do it with this reel', 540, 440, 'italic 64px Marcellus', '#FFE2A0', { glow: ['rgba(5,4,12,.9)', 20], maxW: 960 });
  c.save(); const h = c.createLinearGradient(0, 1300, 0, H); h.addColorStop(0, 'rgba(6,4,6,0)'); h.addColorStop(.35, 'rgba(6,4,6,.86)'); h.addColorStop(1, 'rgba(6,4,6,.94)'); c.fillStyle = h; c.fillRect(0, 1300, W, H - 1300); c.restore();
  [['4', 'FEET'], ['2', 'NAVEL'], ['3', 'FACE'], ['7', 'BODY']].forEach(([n, l], i) => {
    const x = 540 + (i - 1.5) * 230;
    text(c, n, x, 1500, '700 150px Cinzel', '#FFD27A', { glow: ['rgba(240,180,80,.5)', 34] });
    text(c, l, x, 1610, '700 40px Cinzel', '#F4C46A', { glow: ['rgba(5,4,12,.9)', 20], spacing: 3 });
  });
} });
