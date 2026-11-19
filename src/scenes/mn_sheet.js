// mn_sheet.js: the Miniature cast sheet (miniature.html on main): t 0..2 the terrace at dusk, 2..4 the cast in a row,
// 4..6 a face close-up.
MN.verse = [{ a: .3, b: 2, hi: 'सांवल रूप निहारौ आए, सांवरो नाही आयो', en: 'I came to gaze on his dark form… my Saanwara did not come.' },
  { a: 2.1, b: 4, hi: 'बिनत करूँ न, पाँव पडूँ न, | न भेजूं कोई तार', en: 'I do not plead, I do not fall at his feet, | I send no word.' }];
SHOTS.push({ a: 0, b: 2, draw(c, u, t) {
  mnSky(c, 'dusk', { hy: 1000 });
  mnCloudBand(c, 80, 300, 520, { seed: 2, col: '#E9C9B0' }); mnCloudBand(c, 520, 420, 420, { seed: 5, col: '#E3B9A8' });
  mnLightning(c, 720, 260, 860, 520, 4, .9);
  mnHill(c, [[-60, 1000], [160, 880], [420, 930], [700, 860], [1120, 940], [1120, 1300, 1], [-60, 1300, 1]], '#6E8C55', { rimN: 5 });
  for (let i = 0; i < 7; i++) mnTree(c, 80 + i * 150, 960 + (i % 2) * 30, 150 + (i % 3) * 30, ['dome', 'cypress', 'mango', 'blossom', 'dome', 'plantain', 'cypress'][i], { seed: i });
  mnWater(c, [[-60, 1200], [1120, 1180], [1120, 1900, 1], [-60, 1900, 1]], t, { flow: [18, 0] });
  mnLotus(c, 300, 1560, 1.4); mnLotus(c, 720, 1640, 1.2, '#F6E9E0');
  for (let i = 0; i < 5; i++) mnCrane(c, 300 + i * 60 + t * 40, 520 + Math.abs(i - 2) * 22, .9, t * 1.5 + i * .2);
  mnMira(c, 540, 1180, .9, { t, eyes: 1 });
  mnMoon(c, 880, 180, 34);
} });
SHOTS.push({ a: 2, b: 4, draw(c, u, t) {
  c.fillStyle = '#EFE4C8'; c.fillRect(0, 0, W, H);
  mnMira(c, 200, 620, .5, { t, pose: 'stand' });
  mnMira(c, 470, 620, .5, { t, pose: 'dance', ektara: false });
  mnMira(c, 760, 620, .5, { t, pose: 'parrot', ektara: false, after: (c, dy) => mnParrot(c, 140, -852 + dy, 1.4) });
  mnMira(c, 220, 1180, .5, { t, pose: 'sit', mouth: .6 });
  mnMan(c, 520, 1180, .5, { t });
  mnMan(c, 800, 1180, .5, { t, crown: 0, flute: 0, grin: 1 });
  mnMurti(c, 200, 1720, .9); mnPeacock(c, 520, 1640, 1); mnDiya(c, 760, 1700, 2, t); mnInstruments(c, 900, 1760, .8);
} });
SHOTS.push({ a: 4, b: 6, draw(c, u, t) {
  mnSky(c, 'night', { hy: 1900 });
  mnMira(c, 380, 1000 + 7600, 8.5, { t, eyes: u < 1 ? 1 : .0, close: true, arms: false });
} });
