// sindoor_cover.js: the Instagram cover for ad 29 (cover.html = studio.html + this). One still: orange Hanuman grinning
// close on the teal ground, waving; the title inside
// the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/sindoor_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    tealGround(.5);
    const o = { boilKey: 'chan', seed: 2, sindoor: 1, noShadow: true, eyes: 'happy', mouth: 'grin', hx: -.1, htilt: .05, handR: [5.8, -21.5], bendR: 1.2 };
    hanuman(510, 2280, 52, o);
    camEnd();
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 960, rot });
    L('WHY IS', 340, 104, PAL.cream);
    L('HANUMAN JI', 470, 150, GOLDC);
    L('COVERED IN SINDOOR?', 610, 96, '#FF8A4A', -.02);
  }]]);
})();
