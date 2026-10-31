// parshu2_cover.js: the Instagram cover for ad 68 (cover.html = studio.html + this). One still: young Parshurama on the
// dusk plain, fists up, the swirl-eyed Danava heap behind him and the axe's dashed outline by his right hand; the series
// template from Part 1: the orange PART 2 pill over the gold title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/parshu2_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 1180, 1);
    dustPlain(.3, { groundY: 1500 });
    [[640, 1610, -1.35, 0], [810, 1600, 1.4, 1], [730, 1530, -1.5, 2], [750, 1450, 1.45, 3]].forEach(([x, y, r, v], i) =>
      danava(x, y, 13, { v, boilKey: 'covh' + i, seed: 60 + i, rot: r, eyes: 'swirl', mouth: 'wobble', noShadow: i > 1 }));
    boilSeed('covstars'); for (let i = 0; i < 4; i++) { const a = i * 1.6; paint(starPts(740 + Math.cos(a) * 100, 1290 + Math.sin(a) * 28, 16, .4, 5), { wash: '#FFE36A', ink: P2.ink, sw: .6 }); }
    const o = { flip: 1, beard: false, axe: false, quiver: false, boilKey: 'covr', seed: 7, handR: [3.3, -17.4], bendR: .95, handL: [-2.7, -16.6], bendL: .8,
      eyes: 'normal', brow: -.6, mouth: 'smile', wind: .6, aura: .5 };
    parshurama(400, 1690, 25, o);
    const [hx, hy] = naradaHand(400, 1690, 25, o, 1);
    axeOutline(hx - 120, hy + 100, 26, -.12, 1, '#FFE6B0', 'covghost');
    camEnd();
    // PART 2: the series badge
    boilSeed('covpill');
    paint(rrPts(540 - 170, 300 - 58, 340, 116, 58), { wash: '#F15A24', ink: PK.ink, sw: 1.6 });
    letter('PART 2', 540, 304, 92, '#FFF5E2', { screen: true, stroke: PK.ink, sw: .2, ink: false, rot: 0 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PK.ink, sw: .22, ink: false, maxW: 980, rot });
    L('PARSHURAMA', 470, 150, GOLDC);
    L('FOUGHT A DEMON ARMY', 600, 92, '#FFFFFF', -.02);
    L('WITH NO WEAPONS!', 710, 96, GOLDC);
  }]]);
})();
