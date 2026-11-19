// mira_cover.js: the cover (cover.html): her face in profile at dusk, lashes lowered, the title on a cartouche above
// and the credit on the band below, all inside the 3:4 grid crop (y 240–1680).
SHOTS.length = 0; MN.verse = []; MN.band.show = false;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  mrSkyTerrace(c, 3, { night: .15 });
  c.save(); c.translate(0, 300); mrFarHills(c, 3, { night: .1 }); c.restore();
  mnMira(c, 640, 880 + 949.5 * 7, 7, { t: 3, flip: true, eyes: .55, look: -1, close: true, arms: false, tilt: -.03 });
} });
MN.after = (c) => {
  const box = (x0, y0, x1, y1) => { c.fillStyle = 'rgba(233,190,71,.97)'; c.fillRect(x0, y0, x1 - x0, y1 - y0); c.strokeStyle = '#141010'; c.lineWidth = 1.6; c.strokeRect(x0, y0, x1 - x0, y1 - y0); c.strokeStyle = MC.red; c.lineWidth = 3; c.strokeRect(x0 + 6, y0 + 6, x1 - x0 - 12, y1 - y0 - 12); };
  c.save(); c.textAlign = 'center'; c.textBaseline = 'middle';
  box(110, 290, 970, 520);
  c.font = `96px ${MN.devFont}`; c.fillStyle = '#5A1410'; c.fillText('सांवरो नाही आयो', 540, 387); c.fillStyle = '#8E1F18'; c.fillText('सांवरो नाही आयो', 540, 384);
  c.font = `italic 600 44px ${MN.enFont}`; c.fillStyle = '#18224A'; c.fillText('My Saanwara did not come', 540, 470);
  box(40, 1440, 1040, 1620);
  c.font = `600 44px ${MN.enFont}`; c.fillStyle = '#8E1F18'; c.fillText('Mira’s song', 540, 1500);
  c.font = `italic 600 38px ${MN.enFont}`; c.fillStyle = '#18224A'; c.fillText('a poem by Shivangi Singh', 540, 1562);
  c.restore();
};
