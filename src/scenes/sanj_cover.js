// sanj_cover.js: the Instagram cover for "Why did Hanuman bring the WHOLE MOUNTAIN?" (cover.html = studio.html + this).
// One still: Hanuman flying with the herb peak held up overhead, the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/sanj_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    flySky(.6, 1, 'cv');
    const o = { boilKey: 'cvh', rot: 1.1, handL: [-7.4, -19.6], bendL: -.6, tail: 'droop', tailSway: 2, gada: 0, eyes: 'normal', mouth: 'grin' };
    const [hx, hy] = naradaHand(170, 1640, 30, o, -1);
    herbPeak(hx + 40, hy + 40, 580, 1, { key: 'cvpeak', root: 1, glow: 1 });
    hanuman(170, 1640, 30, o);
    camEnd();
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: SJ.ink, sw: .22, ink: false, maxW: 960, rot });
    L('WHY DID HANUMAN', 330, 96, SJ.cream);
    L('BRING THE WHOLE', 440, 96, SJ.cream);
    L('MOUNTAIN?', 580, 170, GOLDC, -.02);
    L('(he did it TWICE)', 690, 70, SJ.cream, -.03);
  }]]);
})();
