// ayy2_cover.js: the Instagram cover for ad 103 (cover.html = studio.html + this). One still: little Manikanta riding
// the tiger (Indra, with his little crown) and a tiger cub, in the warm light of the hook. The series template: the orange
// PART 2 pill over the title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/ayy2_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 960, 1.0);
    warmBack(.4, 'cov', 540, 1300);
    glow(560, 1350, 500, '#FFE9A8', .6);
    const u = 30, to = { kind: 'tiger', boilKey: 'covt', stride: 0, eyes: 'happy', mouth: 'smile', hx: .5 };
    lionRun(580, 1660, u, { ...to, rider: () => { const [sx, sy] = lionRunSeat(580, 1660, u, to);
      ayyappa(sx - 16, sy + u * 1.6, u * .66, { boilKey: 'cova', seed: 7, pose: 'sit', noShadow: true, eyes: 'happy', mouth: 'grin', blush: .6, bellSwing: .25 }); } });
    const [hx, hy] = lionRunHead(580, 1660, u, to); a2Crown(hx - 12, hy - u * 3.4, u * 3.2, 'covc', -.15);
    lion(210, 1690, 9, { kind: 'tiger', boilKey: 'covb', eyes: 'happy', mouth: 'grin', blush: .6 });
    { const [cx, cy] = lionHead(210, 1690, 9, {}); a2Crown(cx, cy - 44, 56, 'covb2'); }
    for (const [x, y, r] of [[330, 1040, 22], [800, 1020, 20], [740, 960, 14]]) { boilSeed('ch' + x); paint(heartPts(x, y, r), { wash: '#F2557A', ink: '#2B2233', sw: .9 }); }
    camEnd();
    hsCoverTitle(2, [['HE WENT FOR', 440, 92, '#FFFFFF'], ['TIGER\'S MILK.', 548, 108, '#FFFFFF'], ['HE CAME BACK', 668, 92, '#FFFFFF'], ['RIDING ONE.', 800, 150, '#F5C542']]);
  }]]);
})();
