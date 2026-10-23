// rp1_cover.js: the Instagram cover for Ramayan Part 1 (cover.html = studio.html + this). One still: Valmiki mid-curse,
// the verse in gold beside him, the series badge and the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/rp1_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1180, 1);
    warmBack(.5, 'cv', 540, 1150);
    glow(700, 1150, 520, '#FFD870', .55);
    boilSeed('cvrays');
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; inkLine([[700 + Math.cos(a) * 330, 1150 + Math.sin(a) * 330], [700 + Math.cos(a) * 430, 1150 + Math.sin(a) * 430]], 3, P1.gold, 'ink', 0); }
    valmiki(300, 2050, 34, { boilKey: 'cvv', eyes: 'angry', brow: -.9, mouth: 'open', handR: [8.2, -24.2], bendR: .3, tint: 'flush', tintK: .25, hx: .3, lookX: .8 });
    camEnd();
    rkVerse(['मा निषाद प्रतिष्ठां', 'त्वमगमः शाश्वतीः समाः ।', 'यत्क्रौञ्चमिथुनादेकम्', 'अवधीः काममोहितम् ॥'], 720, 1000, 54, 9, { stagger: 0, maxW: 440 });
    boilSeed('cvpill'); paint(rrPts(540 - 230, 300, 460, 92, 46), { wash: RMY.maroon, ink: null });
    letter('RAMAYAN · PART 1', 540, 347, 50, RMY.gold, { screen: true, font: '700 50px Poppins', ink: false, maxW: 420 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: RMY.ink, sw: .22, ink: false, maxW: 960, rot });
    L("THE WORLD'S", 480, 104, RMY.cream);
    L('FIRST POEM', 600, 150, RMY.gold, -.02);
    L('WAS A CURSE', 740, 120, RMY.cream, -.03);
  }]]);
})();
