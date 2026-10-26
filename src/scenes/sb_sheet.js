// sb_sheet.js: the Storybook style's reference sheet (storybook.html). One panel a second, each a finished frame:
//   0 Mooshak with a modak   1 the owl   2 the donkey   3 Bal Bappa   4 Maa Lakshmi   5 Maa Kalaratri
//   6 faces (eyes, blinks, mouths)   7 lettering and backgrounds   8 the end card
// Rebuild the docs image after changing a character:
//   node render.mjs --page=storybook.html --sheet=0.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5,8.9 --cols=5 --w=300 --out=docs/sb_cast.jpg
const sbPanel = (i, bg, label, draw) => SHOTS.push({ a: i, b: i + 1, draw(c, u, t) { sbBg(c, bg, { speck: [30, 'rgba(0,0,0,.08)'], seed: i + 1 }); draw(c, u, t); sbSay(c, label, 540, 1640, 84, { col: SB.white, seed: 40 + i }); } });
sbPanel(0, '#F2A93B', 'Mooshak', (c, u, t) => { sbGround(c, 280, 820, 1480, '#D98C27'); sbMouse(c, 560, 1470, .95, { t: t * 2, hold: 'modak' }); });
sbPanel(1, '#9DB8E3', 'the owl', (c, u, t) => { sbCloud(c, 160, 500, 360); sbOwl(c, 540, 1440, 1, { t: t * 2, coin: true }); });
sbPanel(2, '#B9A6D8', 'the donkey', (c, u, t) => { sbGround(c, 220, 900, 1460, '#9A87BC'); sbDonkey(c, 560, 1450, 1, { t: t * 2 }); });
sbPanel(3, '#7CC4B4', 'Bal Bappa', (c, u, t) => { sbGround(c, 300, 780, 1460, '#5FA898'); sbBappa(c, 540, 1450, 1.05, { t: t * 2 }); });
sbPanel(4, '#F7C9B6', 'Maa Lakshmi', (c, u, t) => { sbDevi(c, 540, 1470, 1.05, { t: t * 2 }); });
sbPanel(5, '#F0A35E', 'Maa Kalaratri', (c, u, t) => { sbDevi(c, 540, 1470, 1.05, { t: t * 2, kind: 'kalaratri' }); });
sbPanel(6, '#F36F5E', 'faces', (c, u, t) => {
  [['open', {}], ['look', { look: [1, 0] }], ['blink', { blink: 1 }], ['happy', { happy: true }], ['white', { white: true }]].forEach(([n, o], i) => { sbEye(c, 160 + i * 190, 600, 30, o); text(c, n, 160 + i * 190, 690, '500 30px Poppins', '#fff'); });
  ['smile', 'grin', 'o', 'flat'].forEach((m, i) => { sbMouth(c, 200 + i * 225, 900, 110, m); text(c, m, 200 + i * 225, 1010, '500 30px Poppins', '#fff'); });
  sbCheek(c, 300, 1250, 80); sbModak(c, 560, 1330, 1.1); sbCoin(c, 800, 1250, 1.6);
});
sbPanel(7, '#5B8FD8', 'lettering', (c, u, t) => { sbSwoosh(c, [[-60, 1500], [400, 1250], [1140, 820]], 300, '#FFFFFF', .5); sbCloud(c, 900, 520, 360); sbSay(c, 'What do you | call a *mouse* | that can fly?', 540, 900, 130, { hi: '#FFE066', seed: 3, age: u * 1.5 }); });
SHOTS.push({ a: 8, b: 10, draw(c, u, t) { sbCard(c, u, t, { title: 'Read their *stories*', price: 'Books 1–3 · set of 3 for ₹500' }); } });
