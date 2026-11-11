// hanu1_cover.js: the Instagram cover for ad 85 (cover.html = studio.html + this). One still: baby Hanuman in the
// middle, his three fathers round him (Shiva upper left in a soft light, Vayu upper right, Kesari beside him), on warm
// gold; the series template: the orange PART 1 pill over the title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/hanu1_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    warmBack(.4, 'cov', 540, 1200);
    glow(540, 1250, 520, '#FFE6A0', .35);
    // Shiva, upper left
    glow(215, 1010, 230, '#FFE9B0', .6);
    cloudPuff(215, 1150, 200, 'covsh', 245, '#FFFFFF', '#E2DCF2');
    shiva(215, 1135, 14.5, { boilKey: 'covshiva', seed: 20, eyes: 'happy', mouth: 'smile', ganga: 1, handR: [5.2, -11.5], bendR: 1.2, noShadow: true });
    // Vayu, upper right
    vayu(860, 1090, 18, { flip: true, pack: false, boilKey: 'covvayu', seed: 12, eyes: 'happy', mouth: 'grin', speed: 0, tail: 1.2, aL: 1.0, aR: 1.1 });
    // Kesari, right; Maa Anjana, left
    anjana(215, 1650, 15.5, { boilKey: 'covanj', seed: 10, eyes: 'happy', mouth: 'smile', hx: .6, lookX: .8, blush: .5, tailSway: 1, handL: [-1.1, -14.4], handR: [1.1, -14.4] });
    kesari(880, 1650, 15.5, { boilKey: 'covkes', seed: 11, flip: true, eyes: 'happy', mouth: 'grin', hx: .5, lookX: .8, tailSway: 2 });
    // the baby
    balHanuman(540, 1640, 46, { pose: 'sit', boilKey: 'covbaby', seed: 3, eyes: 'sparkle', mouth: 'grin', blush: .7, tailSway: 1.2, handL: [-3.5, -9.4], handR: [3.5, -9.8], handShapeL: 'open', handShapeR: 'open' });
    camEnd();
    hsCoverTitle(1, [['HANUMAN JI HAS', 470, 118, '#FFFFFF'], ['3 FATHERS', 630, 190, '#F5C542']]);
  }]]);
})();
