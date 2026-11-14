// hanu6_cover.js: the Instagram cover for ad 94 (cover.html = studio.html + this). One still on the dusk field: Ravana
// straining over Lakshman, every head squeezing and sweating, Lakshman calm. The series template: the orange PART 6
// pill over the title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/hanu6_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1410, 1.62);
    h5Field(.4, 'cov');
    const heads = {}; for (let i = 0; i < 10; i++) heads[i] = { eyes: 'squeeze', mouth: 'teeth', sweat: 1, puff: .7, tint: '#9A3A8A', tintK: .3, brows: -1, hat: i === 0 ? 'cap' : i === 4 ? 'mukut' : 'crown', tilt: .06 * Math.sin(i * 1.7) };
    ravana(560, 1700, 14, { boilKey: 'covr', sq: .1, shake: .3, heads, handL: [-4.8, -1.8], handR: [4.8, -1.8],
      between: () => vanLakshman(560 + 14 * 11.5, 1730, 11.5, { boilKey: 'covl', rot: -Math.PI / 2, kodanda: false, eyes: 'closed', mouth: 'smile', noShadow: true }) });
    camEnd();
    hsCoverTitle(6, [['RAVANA COULD LIFT', 440, 96, '#FFFFFF'], ['MOUNTAINS.', 548, 104, '#FFFFFF'], ['HE COULDN\'T LIFT', 668, 84, '#FFFFFF'], ['LAKSHMAN.', 790, 150, '#F5C542']]);
  }]]);
})();
