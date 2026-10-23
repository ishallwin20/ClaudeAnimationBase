// rp8_cover.js: the Instagram cover for Ramayan Part 8 (cover.html = studio.html + this). Ram behind the big tree, bow
// drawn, a "?" by the trunk; the series badge and the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/rp8_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1250, 1);
    kishkindha(.5, 'cv');
    ram(300, 1900, 30, { boilKey: 'cvr', flip: true, eyes: 'angry', brow: -.6, mouth: 'flat', kodanda: false, hx: -.5, lookX: -1, handL: [-7.6, -18], bendL: .3, handR: [-.4, -18.6], bendR: .9, armL: heldBow(1) });
    tree(740, 1920, 1150, 'cvt', 0); boilSeed('cvtrunk'); paint(ribbon([[740, 1920], [744, 1345], [740, 1000]], 230, 160), { wash: P1.bark, fill: P1.barkDk, fillOp: 50, tex: .5, ink: P8.ink, sw: 1 });
    emote('?', 900, 1150, 110, 1, .5);
    camEnd();
    boilSeed('cvpill'); paint(rrPts(540 - 230, 300, 460, 92, 46), { wash: RMY.maroon, ink: null });
    letter('RAMAYAN · PART 8', 540, 347, 50, RMY.gold, { screen: true, font: '700 50px Poppins', ink: false, maxW: 420 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: RMY.ink, sw: .22, ink: false, maxW: 960, rot });
    L('THE ARROW FROM', 490, 100, RMY.cream);
    L('BEHIND A TREE', 610, 120, RMY.gold, -.02);
    L('WAS IT FAIR?', 740, 100, RMY.cream, -.03);
  }]]);
})();
