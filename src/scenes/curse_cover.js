// curse_cover.js: the Instagram cover for ad 60 (cover.html = studio.html + this). One still: baby Hanuman in the ashram
// with a sheepish grin and the broken yagna ladle, two sooty rishis behind him forcing a smile; the title inside the 3:4
// grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/curse_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 1180, 1.12);
    ashram(.5);
    rishi(250, 1640, 19, 1, { sit: 1, boilKey: 'cr1', seed: 1, eyes: ['happy', 'wide'], mouth: 'grin', sweat: true, hat: sootHat(.75), mudra: 1 });
    rishi(830, 1640, 19, 0, { sit: 1, boilKey: 'cr0', seed: 2, eyes: 'happy', mouth: 'grin', sweat: true, hat: sootHat(.75), mudra: 1 });
    const X = 540, Y = 1720, u = 46;
    ladleHead(215, 1740, 300, -.08, 'covhead');
    const o = { pose: 'sit', boilKey: 'covbaby', seed: 3, eyes: 'happy', mouth: 'grin', blush: .85, htilt: -.12, glowK: .3,
      handR: [3.0, -6.4], handShapeR: 'hold', handL: [-1.0, -3.3], handShapeL: 'fist', tailSway: .7 };
    balHanuman(X, Y, u, o);
    const h = bhHand(X, Y, u, o, 1);
    ladleBroken(h[0] - 20, h[1] + 30, 300, -1.2, 'covhandle');
    camEnd();
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 980, rot });
    L('WHY DID HANUMAN', 330, 104, PAL.cream);
    L('FORGET', 470, 170, GOLDC);
    L('HIS POWERS?', 610, 110, '#FFFFFF', -.02);
  }]]);
})();
