// kanha_puzzle.js: "How many KRISHNAS?" A find-them puzzle reel (trial, for followers): one painted picture that loops
// for 8 s. A picnic on the Yamuna sand bank (Bhagavata Purana 10.13): Kanha in the middle eating, his friends round
// him, the calves grazing. Only Kanha looks like Krishna; the clues say every boy and calf is (the reflections are blue
// Kanhas, feathers, a flute, a tilak), and Brahma peeks from a cloud, the one who "got this wrong". No reveal, no card.
// Storyboard: STORYBOARD.md. Props and set: kanha_puzzle_props.js. tools/kanha_puzzle_sfx.mjs uses the same constants.
(() => {
  const LOOP = 8;
  const GOLDC = '#F5C542';
  const GOPA_BASE = { feather: false, spear: false, shield: false, tilak: false };
  const GP = [
    { skin: '#C98A5A', skinDk: '#A86A3E', skinLt: '#E6AE82', teal: '#E07A2E', tealDk: '#B05A1E', tealLt: '#F2A86A', sash: '#5BAA4E', sashDk: '#3E7E3A' },
    { skin: '#DDA878', skinDk: '#BC8656', skinLt: '#F2C8A0', teal: '#5BAA4E', tealDk: '#3E7E3A', tealLt: '#8ACC7A', sash: '#D2452F', sashDk: '#9E2E22' },
    { skin: '#B97A4E', skinDk: '#965C36', skinLt: '#D99C70', teal: '#D2452F', tealDk: '#9E2E22', tealLt: '#EE7A62', sash: '#F2C230', sashDk: '#B88A1C' },
    { skin: '#E3B48A', skinDk: '#C29066', skinLt: '#F6D2AE', teal: '#8E5BB8', tealDk: '#6A3E8E', tealLt: '#B48AD8', sash: '#E07A2E', sashDk: '#B05A1E' },
    { skin: '#A86E46', skinDk: '#88522E', skinLt: '#C88E62', teal: '#F2E6D0', tealDk: '#D2C2A6', tealLt: '#FFF6E6', sash: '#2F9C94', sashDk: '#1E6F6C' },
    { skin: '#D49A6A', skinDk: '#B27A4C', skinLt: '#EEBC8E', teal: '#E35A7A', tealDk: '#B23E5A', tealLt: '#F28AA2', sash: '#5BAA4E', sashDk: '#3E7E3A' },
  ];
  // a gopa: Kartikeya's rig recoloured; his own skin always (feel() hands over Clawd's colours)
  const gopa = (x, y, u, i, o, key) => { const pal = GP[i % GP.length]; kartikeya(x, y, u, { ...GOPA_BASE, ...o, pal, col: pal.skin, dk: pal.skinDk, lt: pal.skinLt, boilKey: key }); };
  const face = (name, t, over = {}) => { const f = feel(name, t); return { ...f, emote: null, tint: null, dy: (f.dy || 0) * .4, sq: (f.sq || 0) * .4, ...over }; };

  // ---- the cast's places (screen px) and sizes
  const KX = 520, KY = 1196, KU = 13;            // Kanha
  const WL = KP_WL, CAM = [500, 1108, 1.25];
  // the reflections' colours: Bal Krishna's palette sunk toward the Yamuna
  const REFL_PAL = Object.fromEntries(Object.entries(BK).map(([k, v]) => [k, typeof v === 'string' && v[0] === '#' ? mixCol(v, KP.water, .42) : v]));

  function frame(t) {
    const lt = ((t % LOOP) + LOOP) % LOOP, ph = (p = LOOP) => TAU * lt / p;

    // a still camera, 1.25×: world (500, 1108) at the screen's centre, so the picnic fills the safe band (world x 70–930
    // is on screen; keep every clue left of world x 845, clear of the button column)
    camBegin(CAM[0], CAM[1], CAM[2]);
    // ---------------- sky, hills, Brahma peeking over his cloud on Govardhan, meadow
    kpSky(lt);
    kpHills(lt);
    kpMeadow(lt);
    const rise = .5 - .5 * Math.cos(ph());                       // he rises out of the cloud and sinks back once a loop
    brahma(770, 884 - rise * 24, 4.6, { boilKey: 'brahma', lotus: false, eyes: 'wide', mouth: 'O', lookX: -.4, lookY: .5, seed: 3 });
    cloudPuff(770, 884, .5, 'kp cloud brahma');

    // ---------------- the far herd on the meadow
    cow(620, 948, 6.6, { coat: 'gauri', graze: .55 + .45 * Math.sin(ph(4)), mouth: 'chew', seed: 1, boilKey: 'cowA' });
    cow(470, 918, 5.4, { coat: 'shyama', flip: true, graze: .5 + .5 * Math.sin(ph(8) + 2), seed: 2, boilKey: 'cowB' });
    const hop = frac(lt / 4) < .3 ? frac(lt / 4) / .3 : 0;
    cow(232, 958, 6.6, { calf: 1, coat: 'dhavala', hop, eyes: hop > 0 ? 'happy' : 'normal', seed: 3, boilKey: 'calfC' });
    kpKadamb(lt);

    // ---------------- the sand bank and its picnic
    kpBank(lt);
    cow(150, 1130, 8.6, { calf: 1, coat: 'kapila', patches: false, tilak: 1, lift: .2, lookX: .5, seed: 4, boilKey: 'calfTilak' });
    // back row of gopas
    gopa(338, 1078, 11.5, 0, face('happy', lt, { aL: -1.1, aR: -1.4, lookX: .6, seed: 11 }), 'g1');
    gopa(445, 1062, 11, 3, face('excited', lt, { aL: .2, aR: -1.3, lookX: .3, seed: 12 }), 'g2');
    gopa(592, 1064, 11, 1, face('happy', lt, { feather: true, featherWob: lt / 2, aL: -1.3, aR: -1.2, lookX: -.4, seed: 13 }), 'g3feather');
    cow(728, 990, 7, { coat: 'gauri', feather: 1, lookX: -.3, graze: .3 + .3 * Math.sin(ph(8) + 1), mouth: 'chew', seed: 5, boilKey: 'cowFeather' });
    gopa(700, 1080, 11.5, 4, face('playful', lt, { aL: .9, armL: fluteHook, aR: -1.3, lookX: -.6, topknot: false, seed: 14 }), 'g4flute');

    // Kanha, sitting in the middle, eating: a morsel to his mouth every 4 s
    const ec = lt % 4, up = ease(seg(ec, .2, .6)) * (1 - ease(seg(ec, 1.1, 1.5))), chew = ec > .55 && ec < 2.6;
    const hL = [lerp(-2.4, -.7, up), lerp(-5.6, -10.2, up)];
    const ko = { pose: 'sit', handL: hL, handShapeL: 'hold', handR: [2.6, -5.2], eyes: chew ? 'happy' : 'normal', mouth: chew ? 'chew' : 'smile', lookX: .3, lookY: .2, featherWob: lt / 2, seed: 1, boilKey: 'kanha' };
    leafPlate(KX - 6, KY + 10, 48, 'kanha plate');
    balKrishna(KX, KY, KU, ko);
    const hp = bkHand(KX, KY, KU, ko, -1);
    if (up < .85) riceBall(hp[0], hp[1] - KU * .2, KU * .45, 'kanha morsel');

    // the side gopas: one tosses a laddoo (every 4 s), one laughs over his plate
    const tc = lt % 4, toss = seg(tc, .3, 1.5), arm = tc < .3 ? lerp(-.2, .5, tc / .3) : tc < 1.5 ? lerp(.9, .3, toss) : lerp(.3, -.2, seg(tc, 1.5, 2.2));
    gopa(252, 1212, 13.5, 2, face(tc > .3 && tc < 1.5 ? 'excited' : 'happy', lt, { aL: -1.25, aR: arm, lookX: .4, lookY: tc > .3 && tc < 1.5 ? -.9 : 0, seed: 15 }), 'g5toss');
    const lh = kartiHand(252, 1212, 13.5, { aR: arm }, 1), lh2 = [lh[0], lh[1] - 13.5 * .5];
    const lp = tc > .3 && tc < 1.5 ? arcPt(lh2, lh2, 210, toss) : lh2;
    laddoo(lp[0], lp[1], 13, 'laddoo');
    leafPlate(812, 1238, 42, 'g6 plate');
    gopa(766, 1214, 13.5, 5, face('laugh', lt, { aL: -.6, aR: -1.0, lookX: -.5, seed: 16 }), 'g6laugh');

    // ---------------- the Yamuna, the reflections (blue Kanhas), the ripples
    kpWater(lt);
    const RP = { pal: REFL_PAL, noShadow: true, swMul: .7 };
    kpReflect(lt, 382, () => balKrishna(382, WL, 10, { ...RP, pose: 'stand', eyes: 'happy', mouth: 'smile', featherWob: lt / 2, seed: 7, boilKey: 'refl1' }), 'refl1');
    kpReflect(lt, 640, () => balKrishna(640, WL, 10, { ...RP, pose: 'stand', eyes: 'normal', mouth: 'grin', lookX: -.3, featherWob: lt / 2 + .3, seed: 8, boilKey: 'refl2' }), 'refl2');
    kpReflect(lt, 752, () => balKrishna(752, WL, 8, { ...RP, pose: 'sit', eyes: 'happy', mouth: 'giggle', featherWob: lt / 2 + .6, seed: 9, boilKey: 'refl3' }), 'refl3');
    kpRipples(lt);
    kpLotus(lt);
    // the boys and the calf at the water's edge (their real selves, on the sand)
    gopa(382, WL - 4, 11.5, 1, face('happy', lt, { aL: -1.3, aR: -1.0, lookY: .6, topknot: false, seed: 17 }), 'g7edge');
    gopa(640, WL - 4, 11.5, 0, face('playful', lt, { aL: -.9, aR: -1.3, lookY: .6, seed: 18 }), 'g8edge');
    cow(782, WL - 2, 8.2, { calf: 1, coat: 'gauri', flip: true, graze: .85 + .15 * Math.sin(ph(2)), mouth: 'tongue', seed: 6, boilKey: 'calfDrink' });

    camEnd();

    if (window.KP_COVER) return;   // the cover letters its own title (kanha_puzzle_cover.js)
    // ---------------- the question (up from frame 0, for the whole loop)
    caption('How many KRISHNAS?', 470, t + 1, { life: 99, size: 104, color: PAL.cream });
    caption('Even BRAHMA got this wrong', 572, t + 1, { life: 99, size: 60, color: GOLDC });
    caption('Follow if you found them ALL', 1462, t + 1, { life: 99, size: 56, color: PAL.cream });
  }

  window.KP_FRAME = frame;
  shots([[0, frame]]);
})();
