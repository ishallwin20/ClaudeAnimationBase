// gokarna_cover.js: the Instagram cover for ad 17 (cover.html = studio.html + this). Replaces the reel's shots with one
// still: the hook image (Ravana, desperate, hugging the Atmalinga; the cowherd boy in his fake moustache winking from
// the corner) and a big title kept inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/gokarna_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  const DESP_E = ['closed', 'squeeze', 'wide', 'angry', 'wide', 'side', 'squeeze', 'shifty', 'shut', 'wide'];
  const DESP_M = ['O', 'teeth', 'wobble', 'teeth', 'teeth', 'wobble', 'teeth', 'wobble', 'pout', 'O'];
  shots([[0, (t) => {
    camBegin(505, 1150, 1.16);
    hookBg(t);
    const heads = DESP_E.map((e, i) => i === 0 ? { eyes: 'closed', mouth: 'O', bubble: .9 } : { eyes: e, mouth: DESP_M[i], sweat: 1, tilt: (i % 2 ? .08 : -.08) });
    heads[4] = { eyes: 'wide', mouth: 'teeth', sweat: 1, lookX: 0, lookY: 0 };
    ravana(480, 1640, 23, { boilKey: 'cover', heads, knock: 1, step: .7, rot: .02, handL: [-2.0, -11.4], handR: [2.0, -11.4], held: (u) => atmalinga(0, -9.3 * u, 3.5 * u, { key: 'cvlinga' }), noShadow: true });
    camEnd();
    // the cowherd boy (screen space), bottom right with a wink
    balBappa(915, 1505, 15, { boilKey: 'cvbappa', stand: 1, eyes: ['normal', 'wink'], mouth: 'grin', hx: -.3, trunk: 'curl', armL: shepherdStick, noShadow: true });
    fakeStache(915 - .3 * 1.4 * 15, 1505 - 10.9 * 15, 1.6 * 15, 0, 'cvstache');
    letter('RAVANA NEEDED', 520, 330, 92, PAL.cream, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 900, rot: -.025 });
    letter('A TOILET.', 520, 470, 170, GOLDC, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 920, rot: -.025 });
    letter('…and Ganesha got a DENT', 500, 1612, 68, PAL.cream, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 900, rot: -.02 });
  }]]);
})();
