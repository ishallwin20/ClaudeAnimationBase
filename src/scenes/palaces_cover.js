// palaces_cover.js: the Instagram cover for Little Kanha Part 3 (cover.html = studio.html + this). One still: a wall of
// palace windows with a Krishna in each, Narad Muni's shocked face poking in at the bottom left; the title inside the
// 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/palaces_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  const MINI = [
    { flute: 'play', eyes: 'closed', mouth: 'flat' }, { eyes: 'happy', mouth: 'grin', handR: [4.4, -19.4] }, { pray: 1, eyes: 'closed', mouth: 'smile' },
    { eyes: 'normal', mouth: 'smile', flute: 'hand' }, { eyes: ['normal', 'closed'], mouth: 'grin' }, { eyes: 'happy', mouth: 'smile', handL: [-4.4, -19.4] },
    { eyes: 'closed', mouth: 'O' }, { flute: 'play', eyes: 'happy', mouth: 'flat' }, { eyes: 'normal', mouth: 'grin', hx: .4, lookX: .6 },
  ];
  const WALLS = ['#B04E8E', '#2E6AA8', '#8A4E2E', '#5E3E9E', '#3E8A6A', '#2E4FA0'];
  shots([[0, (t) => {
    windowWall(1, { cols: 3, rows: 3, x0: 60, y0: 560, w: 960, h: 840, wall: PS.gold, k: 1, inside: i => WALLS[i % 6],
      cell: (i, cx, by, s) => krishna(cx, by + 6, 7.6 * s, { ...MINI[i], boilKey: 'cmini' + i, seed: i, noShadow: true }) });
    narada(150, 2050, 40, { eyes: 'wide', mouth: 'scream', hx: .7, lookX: .9, lean: 2, htilt: .14, emote: '!?', emoteK: 1, emoteAge: 1, noShadow: true, handR: [2.4, -24.2], bendR: 1.4, sweat: 1, boilKey: 'cn', seed: 1 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 960, rot });
    L('KRISHNA HAD', 320, 92, PAL.cream);
    L('16,108 QUEENS', 440, 128, GOLDC);
    L('HE WAS IN', 1480, 92, PAL.cream, -.02);
    L('EVERY PALACE', 1610, 140, GOLDC, -.02);
    boilSeed('cpart');
    paint(rrPts(800, 1360, 200, 70, 35), { wash: PS.rkOrange, ink: null });
    letter('PART 3', 900, 1397, 46, PS.cream, { screen: true, ink: false });
  }]]);
})();
