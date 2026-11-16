// hanu9_cover.js: the Instagram cover for ad 98 (cover.html = studio.html + this). One still: Arjuna's chariot in
// flames at dusk, the banner above the fire with Hanuman going from it in a puff of light. The series template: the
// orange PART 9 pill over the title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/hanu9_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    const x = 560, gy = 1730, s = 300;
    camBegin(540, 960, 1.0);
    h9Field(.4, 'cov', { mode: 'dusk', army: 0, hy: 1530, sx: 900, sy: 1350, tents: [[90, 70]] });
    paint(rectPts(-300, -600, W + 600, 3400), { wash: '#1A1020', washOp: 90, ink: null });
    h9Chariot(x, gy, s, .4, { key: 'covc', horses: false, badge: .35, cracks: 1, still: true });
    h7Flames(x, gy + 4, s * 1.8, s * 1.05, .4, 'covf0', 3); h7Flames(x + 30, gy + 4, s * 1.5, s * 1.3, 1.1, 'covf1', 4);
    const [px, py] = h9Perch(x, gy, s);
    glow(px, py - 110, 260, '#FFE9A8', .7);
    hanuman(px, py, s / 22, { boilKey: 'covh', seed: 60, gada: 0, sit: 1, noShadow: true, pray: 1, eyes: 'closed', mouth: 'smile', blush: .5 });
    sparkleBurst(px, py - 110, 300, .45, 'covsp', 12, ['#FFFFFF', '#F5C542']);
    camEnd();
    hsCoverTitle(9, [['THE MOMENT', 420, 90, '#FFFFFF'], ['HANUMAN LEFT,', 548, 150, '#F5C542'], ['ARJUNA\'S CHARIOT', 672, 96, '#FFFFFF'], ['TURNED TO ASH.', 780, 110, '#FFFFFF']]);
  }]]);
})();
