// diwali_cover.js: the Instagram cover for ad 26 (cover.html = studio.html + this). One still: the owl close, in his
// union headband, yelling into the megaphone, BONUS DO! beside him; the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/diwali_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542', OX = 540, OY = 1470, OU = 30, MS = 44;
  shots([[0, (t) => {
    camBegin(555, 1160, 2.45);
    diwaliSet(t, { banner: false });
    placard(735, 1262, 196, 108, { txt: 'BONUS DO!', pole: 230, key: 'o', size: 46, rot: .06 });
    const o = { eyes: 'angry', mouth: 'talk', mouthK: 1.15, puff: .8, boilKey: 'cowl', seed: 2, hat: owlBand({ wind: .3 }) };
    const b = owlBeak(OX, OY, OU, o), mp = [b[0] - 16, b[1] - 2, Math.PI + .28], c = Math.cos(mp[2]), s = Math.sin(mp[2]);
    const grip = [mp[0] + MS * .99 * c + MS * .72 * s, mp[1] + MS * .99 * s - MS * .72 * c];
    o.wingL = [(grip[0] - OX) / OU, (grip[1] - OY) / OU]; o.wingShapeL = 'hold';
    o.wingR = [4.4, -11.8]; o.wingShapeR = 'open';
    o.held = () => { push(); translate(-OX, -OY); megaphone(mp[0], mp[1], mp[2], MS, { mirror: true, yell: 1, key: 'cm' }); pop(); };
    owl(OX, OY, OU, o);
    camEnd();
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 980, rot });
    L("MAA LAKSHMI'S OWL", 340, 116, GOLDC);
    L('WENT ON STRIKE', 470, 104, PAL.cream);
    L('for a DIWALI BONUS', 1590, 92, PAL.cream, -.02);
  }]]);
})();
