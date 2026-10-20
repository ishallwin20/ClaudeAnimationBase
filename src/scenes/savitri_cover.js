// savitri_cover.js: the Instagram cover for ad 24 (cover.html = studio.html + this). One still: Yama close on his red
// ground, sweating, eyes sliding to Savitri, who smiles beside him, hands joined; the title inside the 3:4 grid crop
// (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/savitri_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    redGround(.5, 640, 1080, 1);
    yama(660, 2140, 44, { boilKey: 'cyama', seed: 4, gada: false, eyes: 'wide', lookX: -.9, lookY: .2, hx: -.25, mouth: 'sheepish', brow: .8, sweat: 1, handL: [-4.2, -17.4], bendL: -1.2, noShadow: true });
    parvati(255, 1960, 31, { boilKey: 'csav', seed: 3, pal: SAV, ...SAV_SKIN, crown: false, eyes: ['normal', 'wink'], mouth: 'smirk', hx: .4, lookX: .7, pray: 1, noShadow: true });
    camEnd();
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 960, rot });
    L('SHE OUTSMARTED', 330, 104, PAL.cream);
    L('YAMRAJ', 470, 190, GOLDC);
    L('with ONE wish.', 625, 92, PAL.cream, -.02);
  }]]);
})();
