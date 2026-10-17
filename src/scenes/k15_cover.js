// k15_cover.js: the Instagram cover for the 15K reel (cover.html = studio.html + this). Replaces the reel's shots with one
// still: the whole cast around the cake (the 15K topper up), happy, and a big title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/k15_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542', { TX, TY, TW, CX } = HALL;
  shots([[0, (t) => {
    camBegin(480, 1330, 1.2);
    hallSet(t);
    lantern(HALL.LAMP[0] + 220, 700, 70, t, { on: 1 });
    const DO = { boilKey: 'cdurga', eyes: 'happy', mouth: 'grin' };
    durga(165, 1560, 9.5, DO);
    ravana(TX + 40, 1540, 13, { boilKey: 'cravana', handL: [-6.5, -23], handR: [6.5, -23], heads: Array.from({ length: 10 }, (_, i) => i === 0 ? { eyes: 'closed', mouth: 'O', bubble: .8 } : i === 6 ? { eyes: 'wide', sparkle: 1, mouth: 'open', mouthK: 1, goldTooth: true } : { eyes: 'happy', mouth: 'grin' }), between: () => {
      table(TX, TY + 170, TW, { key: 'ctable' });
      cake(CX - 70, TY + 162, .8, t, { key: 'ccake', candleGlow: .6 });
    } });
    kali(790, 1560, 10, { boilKey: 'ckali', eyes: 'heart', tongueWag: .5 });
    balHanuman(700, TY + 162, 8, { boilKey: 'chanu', pose: 'sit', eyes: 'sparkle', mouth: 'grin', lookX: -.6, lookY: -.4 });
    lion(250, 1730, 11, { boilKey: 'csher', hat: lionBand(), eyes: 'happy', mouth: 'grin', pawR: [2.6, -15], pawShapeR: 'pad' });
    balBappa(520, 1760, 11, { boilKey: 'cbappa', stand: 1, eyes: 'happy', mouth: 'smile', trunk: 'up', aL: .9, aR: .9, blush: .5 });
    shiva(840, 1790, 7.5, { boilKey: 'cshiva', ...feel('serene', 0), eyes: 'happy', mouth: 'smile' });
    nandi(20, 1730, 10, { boilKey: 'cnandi', eyes: 'happy' });
    camEnd();
    letter('WE HIT', 520, 330, 84, PAL.cream, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 900, rot: -.025 });
    letter('15,000!', 520, 490, 210, GOLDC, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 940, rot: -.025 });
    letter('So the cast threw a PARTY…', 520, 640, 60, PAL.cream, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 900, rot: -.02 });
    letter('…and a GIFT for YOU', 520, 1610, 70, GOLDC, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 900, rot: -.02 });
  }]]);
})();
