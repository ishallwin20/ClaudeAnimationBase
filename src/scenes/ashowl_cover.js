// ashowl_cover.js: the Instagram cover for ad 118 (cover.html = studio.html + this). One still: Ashwatthama awake under
// the banyan, the gem lit, the horned owl on the branch above him with burning eyes; the title and the comic's pill
// inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/ashowl_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(560, 1060, 1.3);
    aoSky('cov', 1120, -680, 130);
    aoBanyan('cov', t, {});
    aoGround('cov', t);
    boilSeed('covperch'); paint(ribbon(through([[690, 1060], [820, 1020], [990, 1000]]), 34, 14), { wash: AO.bark, fill: AO.barkDk, fillOp: 70, tex: .5, ink: AO.ink, sw: 1.3 });
    aoOwl(860, 1012, 14, { boilKey: 'covowl', seed: 90, eyeGlow: 1, puff: .3, hx: -.35 });
    const o = { boilKey: 'covash', seed: 71, sit: 1, mudra: 0, handL: [-4.5, -9.5], handR: [4.4, -9.6], bendL: .6, bendR: .6, eyes: 'angry', brow: -.9, mouth: 'frown', lookX: .7, lookY: -.6, hx: .2 };
    ashwatthama(520, AO_GY, 34, o);
    const [gx, gy] = ashGem(520, AO_GY, 34, o); glow(gx, gy, 150, '#5CC8E8', 80);
    camEnd();
    for (const [txt, y, size, col] of [['AN OWL GAVE HIM', 330, 100, '#FFFFFF'], ['THE DARKEST IDEA', 456, 124, '#F5C542'], ['IN THE MAHABHARATA', 572, 92, '#FFFFFF']])
      letter(txt, 540, y, size, col, { screen: true, stroke: AO.ink, sw: .22, ink: false, maxW: 980, rot: -.02 });
    boilSeed('covpill');
    paint(rrPts(540 - 300, 1560 - 44, 600, 88, 44), { wash: '#F15A24', ink: AO.ink, sw: 1.4 });
    letter('CHIRANJEEVI · THE COMIC', 540, 1563, 52, AO.cream, { screen: true, ink: false, rot: 0, maxW: 560 });
  }]]);
})();
