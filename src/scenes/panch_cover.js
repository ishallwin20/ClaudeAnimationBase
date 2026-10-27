// panch_cover.js: the Instagram cover for ad 55 (cover.html = studio.html + this). One still: Panchmukhi Hanuman on the
// saffron halo, all five faces grinning; the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/panch_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    halo(t, { cx: 540, cy: 1080, spin: 0 });
    const F = {};
    for (const k of ['narasimha', 'garuda', 'varaha', 'hayagriva']) F[k] = { mouth: 'grin', eyes: 'normal', blush: .4, lookY: k === 'hayagriva' ? -.4 : 0 };
    panchmukhi(540, 1900, 37, { eyes: ['normal', 'closed'], mouth: 'grin', blush: .4, faces: F, gada: 1, boilKey: 'cov', seed: 1 });
    camEnd();
    const L = (txt, y, size, col, o = {}) => letter(txt, 520, y, size, col, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 980, rot: -.025, ...o });
    L('HANUMAN JI HAS', 330, 92, PAL.cream);
    L('5 FACES', 460, 170, GOLDC, { rot: -.03 });
    L('Only ONE is a monkey', 580, 66, PAL.cream);
    L('WHY?', 1560, 130, GOLDC, { rot: -.04 });
  }]]);
})();
