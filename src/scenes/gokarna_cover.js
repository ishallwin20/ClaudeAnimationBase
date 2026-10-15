// gokarna_cover.js: the Instagram cover for ad 18 (cover.html = studio.html + this). Replaces the reel's shots with one
// still: the hook image (Ravana hugging the Atmalinga, ten heads staring up as Vishnu's chakra slides over the sun; the
// brahmin boy in his fake moustache winking from the corner) and a big title kept inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/gokarna_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  const EYES = ['closed', 'wide', 'wide', 'wide', 'wide', 'side', 'wide', 'shifty', 'wide', 'wide'];
  const MOUTH = ['O', 'O', 'wobble', 'flat', 'O', 'flat', 'O', 'wobble', 'O', 'wobble'];
  shots([[0, (t) => {
    camBegin(505, 1150, 1.16);
    hookBg(t);
    sunChakra(755, 995, 70, 1.3, { cover: .42, finger: true });
    const heads = EYES.map((e, i) => i === 0 ? { eyes: 'closed', mouth: 'O', bubble: .9 } : { eyes: e, mouth: MOUTH[i], sweat: 1, lookX: .8, lookY: -1, tilt: (i % 2 ? .06 : -.06) });
    ravana(480, 1640, 23, { boilKey: 'cover', heads, step: .3, rot: .015, handL: [-2.0, -11.4], handR: [2.0, -11.4], held: (u) => atmalinga(0, -9.3 * u, 3.5 * u, { key: 'cvlinga' }), noShadow: true });
    camEnd();
    // the brahmin boy (screen space), bottom right with a wink
    balBappa(915, 1505, 15, { boilKey: 'cvbappa', stand: 1, eyes: ['normal', 'wink'], mouth: 'grin', hx: -.3, trunk: 'curl', armL: shepherdStick, held: sacredThread, noShadow: true });
    kamandalu(915 - 3.7 * 15, 1505 - 5.4 * 15, 2.1 * 15, 1.3, 1);
    fakeStache(915 - .3 * 1.4 * 15, 1505 - 10.9 * 15, 1.6 * 15, 0, 'cvstache');
    letter('VISHNU FAKED', 520, 330, 96, PAL.cream, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 900, rot: -.025 });
    letter('A SUNSET.', 520, 470, 170, GOLDC, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 920, rot: -.025 });
    letter('…and Ganesha got a DENT', 500, 1612, 68, PAL.cream, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 900, rot: -.02 });
  }]]);
})();
