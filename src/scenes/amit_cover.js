// amit_cover.js: the Instagram cover for "Amit roop pragate" (cover.html = studio.html + this). One still: the meadow
// outside Ayodhya with a form of Ram meeting every person, the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/amit_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542', { TL, square, SQ } = AMIT;
  shots([[0, () => {
    const t = TL.mile + 1.6;   // every form has come; hearts up
    camBegin(540, 1270, 1.02);
    square(t, { z: 1.02, cx: 540, cy: 1270, rams: true, royal: true, warm: .3, glows: 1, ramGlow: 1, ram: { eyes: 'happy', mouth: 'grin', handL: [-4.6, -18.5], handR: [4.6, -18.5] } });
    camEnd();
    // a dark soft band behind the title so it reads over the city
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 960, rot });
    L('HOW DID RAM MEET', 330, 92, PAL.cream);
    L('ALL OF AYODHYA', 450, 128, GOLDC, -.02);
    L('AT ONCE?', 565, 96, PAL.cream);
  }]]);
})();
