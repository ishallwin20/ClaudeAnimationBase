// kanha_puzzle_cover.js: the Instagram cover for "How many KRISHNAS?" (cover.html = studio.html + this). The puzzle
// picture itself, the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/kanha_puzzle_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    window.KP_COVER = true;
    KP_FRAME(.4);
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 520, y, size, col, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 960, rot });
    L('HOW MANY', 330, 110, PAL.cream);
    L('KRISHNAS?', 470, 170, GOLDC);
    L('EVEN BRAHMA', 1480, 92, PAL.cream, -.02);
    L('GOT THIS WRONG', 1600, 104, GOLDC, -.02);
  }]]);
})();
