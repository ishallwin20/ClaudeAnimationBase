// hanu5_cover.js: the Instagram cover for ad 93 (cover.html = studio.html + this). One still in the Ashoka grove:
// Hanuman points at his back, grinning ("climb on!"); Sita, behind the rise, holds up her hand: no. The series
// template: the orange PART 5 pill over the title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/hanu5_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(560, 1360, 1.35);
    h5Grove(.4, 'cov', 930, 900);
    parvati(770, 2030, 28, { boilKey: 'covs', crown: false, pal: SITA_PAL, ...SITA_SKIN, noShadow: true, eyes: 'normal', mouth: 'smile', lookX: -.8, hx: -.3, handL: [-4.4, -19.6], bendL: -.6 });
    h5Rise('covrise');
    hanuman(350, 1752, 16, { boilKey: 'covh', seed: 60, crown: false, gada: 0, lean: .5, bow: .1, hx: .45, lookX: .9, eyes: 'happy', mouth: 'grin', blush: .5,
      handR: [5.6, -17.2], bendR: -1, handL: [-1.6, -14.8], bendL: 1 });
    camEnd();
    hsCoverTitle(5, [['HANUMAN OFFERED TO', 450, 92, '#FFFFFF'], ['CARRY SITA HOME.', 556, 92, '#FFFFFF'], ['SHE SAID NO.', 690, 140, '#F5C542']]);
  }]]);
})();
