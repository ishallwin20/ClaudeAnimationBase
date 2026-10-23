// rp3_cover.js: the Instagram cover for Ramayan Part 3 (cover.html = studio.html + this). The young prince drawing his
// bow in the rain at the Sarayu; the series badge and the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/rp3_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1180, 1);
    rainNight(.5, 'cv');
    glow(540, 1250, 520, '#C8323A', .3);
    youngKing(600, 2050, 34, { boilKey: 'cvy', eyes: 'closed', brow: -.6, mouth: 'flat', hx: -.3, handL: [-8.4, -18.4], bendL: .3, handR: [-.6, -18.6], bendR: .9,
      armL: (u, sw) => { push(); scale(1.7); inkLine(U([[.6, -4.5], [3.2, 0], [.6, 4.5]], u / 1.7), sw * .45, '#F0E2C0', 'inkfine', 0); paint(ribbon(U([[.6, -4.6], [-.55, -2.8], [-.95, -.6], [-.95, .6], [-.55, 2.8], [.6, 4.6]], u / 1.7), .22 * u / 1.7, .22 * u / 1.7), { wash: '#7A4A22', ink: NRD.ink, sw: sw * .5 }); pop(); } });
    camEnd();
    rain(.5, 'cvr');
    boilSeed('cvpill'); paint(rrPts(540 - 230, 300, 460, 92, 46), { wash: RMY.maroon, ink: null });
    letter('RAMAYAN · PART 3', 540, 347, 50, RMY.gold, { screen: true, font: '700 50px Poppins', ink: false, maxW: 420 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: RMY.ink, sw: .22, ink: false, maxW: 960, rot });
    L('ONE ARROW', 490, 120, RMY.cream);
    L('KILLED A KING', 630, 140, RMY.gold, -.02);
    L('YEARS LATER', 770, 96, RMY.cream, -.03);
  }]]);
})();
