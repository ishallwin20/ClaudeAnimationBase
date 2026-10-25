// kojagari_cover.js: the Instagram cover for ad 51 (cover.html = studio.html + this). One still: Maa Lakshmi in front of
// the full moon and its sixteen kalas, her palm raised, the owl at her side; the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/kojagari_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    kjSky(t, { rect: [-100, -100, 1180, 2100], avoid: [540, 820, 420] });
    kjMoon(540, 820, 300, t, { kalas: 16, flare: .25, key: 'cov' });
    rooftops(t, { shine: 1, py: 1700 });
    lakshmi(540, 1990, 38, { eyes: 'normal', mouth: 'smile', lookX: .1, hx: .1, handR: [4.9, -17.6], coins: 0, glowK: .9, boilKey: 'clk', seed: 6 });
    owl(865, 1690, 17, { eyes: 'wide', mouth: 'grin', hx: -.4, lookX: -.6, wingR: [5.6, -11], wingShapeR: 'open', boilKey: 'cowl', seed: 2 });
    camEnd();
    const L = (txt, y, size, col, o = {}) => letter(txt, 520, y, size, col, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 980, rot: -.025, ...o });
    L('TONIGHT AT MIDNIGHT', 330, 104, GOLDC);
    L('Maa Lakshmi asks ONE question', 440, 70, PAL.cream);
    L('को जागर्ति?', 1470, 80, PAL.cream, { font: '80px "Tiro Devanagari Sanskrit"' });
    L('WHO IS AWAKE?', 1590, 120, GOLDC, { rot: -.03 });
  }]]);
})();
