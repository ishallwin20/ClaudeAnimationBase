// narad_cover.js: the Instagram cover for ad 22 (cover.html = studio.html + this). One still: monkey-faced Narada,
// smug, preening, the title inside the 3:4 grid crop (y 240–1680).   node render.mjs --page=cover.html --stills=0 --out=out/narad_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    roseSet(.5);
    const o = { boilKey: 'cnar', monkey: 1, eyes: 'smug', mouth: 'grin', puff: .6, htilt: -.07, hx: .12, seed: 1, handR: [4.3, -25.2], bendR: 2.2 };
    narada(560, 2010, 46, o);
    const m = naradaMouth(560, 2010, 46, o);
    sparkleBurst(m[0] + 30, m[1] - 10, 70, .25, 'cting', 6, ['#FFFFFF', '#FFF2B0']);
    camEnd();
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 520, y, size, col, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 940, rot });
    L('NARAD MUNI ASKED VISHNU', 330, 80, PAL.cream);
    L('FOR HIS FACE...', 445, 120, GOLDC);
    L('HE GOT', 1470, 100, PAL.cream, -.02);
    L("A MONKEY'S!", 1600, 160, GOLDC, -.02);
  }]]);
})();
