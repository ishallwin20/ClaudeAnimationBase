// hanu7_cover.js: the Instagram cover for ad 95 (cover.html = studio.html + this). One still over Ayodhya at night:
// Hanuman in flight with the herb mountain, the tipless arrow rising at him, Bharat below with his bow. The series
// template: the orange PART 7 pill over the title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/hanu7_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1180, 1.0);
    h7Avadh(.4, 'cov', 1570, 900, 1000);
    const x = 650, y = 1480, u = 11.5;
    const ho = { boilKey: 'covh', seed: 60, crown: false, gada: 0, rot: .35, eyes: 'wide', mouth: 'O', handL: [-2.4, -26.6], handR: [2.4, -26.6], bendL: -1, bendR: -1, tail: 'droop', noShadow: true };
    const [px, py] = naradaHand(x, y, u, ho, -1), [qx, qy] = naradaHand(x, y, u, ho, 1);
    push(); translate((px + qx) / 2, (py + qy) / 2 - u * .4); rotate(.21); herbPeak(0, 0, u * 15, .4, { root: 1, key: 'covpk', herbs: 10 }); pop();
    hanuman(x, y, u, ho);
    h7Blunt(520, 1330, -.55, 200, 'covar');
    bharat(190, 1660, 11.5, { boilKey: 'covb', seed: 31, flip: true, rot: -.2, hx: -.3, lookX: -1, lookY: -.4, eyes: 'determined', mouth: 'flat', handL: [-7.6, -18], bendL: .3, handR: [-2.2, -15], bendR: .9, armL: h7Bow(.15, false) });
    emote('!', x + 215, y - 27 * u, 28, 1, .5);
    camEnd();
    hsCoverTitle(7, [['BHARAT SHOT', 440, 120, '#FFFFFF'], ['HANUMAN', 590, 190, '#F5C542'], ['OUT OF THE SKY.', 740, 112, '#FFFFFF']]);
  }]]);
})();
