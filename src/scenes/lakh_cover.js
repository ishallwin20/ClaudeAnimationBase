// lakh_cover.js: the Instagram cover for the 1 lakh reel (cover.html = studio.html + this). One still: the whole family
// grinning for the photo (Narad with his monkey face, the empty spot glowing), the title above, inside the 3:4 grid crop
// (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/lakh_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, () => {
    const t = LAKH_T.FLASH - .05;
    camBegin(540, 940, 1.0);
    studioSet(t);
    lakhFamily(t, { spot: 1, frozen: true });
    camEnd();
    boilSeed('covpill');
    paint(rrPts(540 - 230, 330 - 52, 460, 104, 52), { wash: '#F15A24', ink: LK.ink, sw: 1.6 });
    letter('THANK YOU!', 540, 334, 76, '#FFF5E2', { screen: true, stroke: LK.ink, sw: .2, ink: false, rot: 0 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: LK.ink, sw: .22, ink: false, maxW: 980, rot });
    L('1,00,000', 480, 170, GOLDC);
    L('FAMILY PHOTO', 615, 104, '#FFFFFF', -.02);
  }]]);
})();
