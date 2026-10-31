// sitap_cover.js: the Instagram cover for the Painted cut of "Was RAM right to leave SITA?" (sitap_cover.html =
// sitap.html + this). One still: Ram and Sita on the Ganga's bank at dusk, turned from each other, the empty
// bank between them; the question and "4 POETS · 2,000 YEARS" inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=sitap_cover.html --stills=0 --out=out/check/sitap_cover   (then copy t0_00.png to cover.png)
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1250, 1);
    duskBank(.5, 'cv', { boat: .5 });
    ram(290, 1720, 24, { boilKey: 'cvram', kodanda: true, eyes: 'closed', mouth: 'frown', hx: -.5, lookX: -1, brow: .9, bow: .2, handR: [1.2, -15.6], bendR: .7 });
    const so = { boilKey: 'cvsita', eyes: 'look', mouth: 'frown', hx: -.4, lookX: -1, lean: -.3 };
    sita(800, 1720, 24, so);
    tears(...sitaEye(800, 1720, 24, so, -1), .4, 'cvtear', 1);
    camEnd();
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: SP.ink, sw: .22, ink: false, maxW: 960, rot });
    L('WAS', 330, 84, SP.cream);
    L('RAM RIGHT', 450, 150, SP.gold, -.02);
    L('TO LEAVE', 570, 84, SP.cream);
    L('SITA?', 700, 160, SP.gold, -.03);
    boilSeed('cvpill'); paint(rrPts(540 - 330, 1520, 660, 92, 46), { wash: SP.rkOrange, ink: SP.ink, sw: 1 });
    letter('4 POETS · 2,000 YEARS', 540, 1567, 50, SP.cream, { screen: true, font: '700 50px Poppins', ink: false, maxW: 620 });
    letter('Valmiki · Kalidasa · Bhavabhuti · Tulsidas', 540, 1640, 36, SP.cream, { screen: true, font: '700 34px Poppins', stroke: SP.ink, sw: .3, ink: false, maxW: 900 });
  }]]);
})();
