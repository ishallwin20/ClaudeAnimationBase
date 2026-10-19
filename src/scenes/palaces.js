// palaces.js: "Krishna had 16,108 queens. Narad Muni went to CHECK." Little Kanha, Part 3, a ~57.6 s captioned reel
// for followers (Bhagavata Purana 10.69, with 10.59 and 10.61.2). Narad wonders how one Krishna lives in 16,000+ homes
// and flies to Dwarka; in palace #1 Rukmini fans Krishna, who leaps up and washes Narad's feet; in palace #2 Krishna,
// at dice, asks "When did you arrive?"; palace after palace, the same Krishna doing something else; Narad laughs at
// the Yogamaya; every queen believed he never left HER palace. Narad walks off singing, and winks back at us.
// Storyboard: STORYBOARD.md. Props: palaces_props.js. All times are video time (t); tools/palaces_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/palaces_sfx.mjs)
  const B0 = 3.8, SCRATCH = 4.4, DIVE = 6.8;
  const C0 = 7.4, ENTER = 7.6, JUMP = 9.8, LAND = 10.3, POUR = 10.6, HEAD = 12.4;
  const D0 = 14.6, ROLL = 15.0, LOOK = 16.6, TAKE = 17.4, BACK = 18.9;
  const E0 = 21.0, EK = 2.03;   // the six doorways, EK apart
  const F0 = 33.2, G0 = 36.4, TEACH = 39.7, H0 = 43.0, I0 = 48.6, WINK = 52.4;
  const CARD = 54.0, FOLLOW = 54.6, PILL = 55.1;

  const GOLDC = '#F5C542';
  const NU = 24;                                           // Krishna and Narad (same rig, same size)
  const RUK = { pal: { saree: '#C8324A', sareeDk: '#962338', sareeLt: '#E8697A', blouse: '#E8A82E', blouseDk: '#B8801E', bangle: '#F2C230' } };
  const Q2 = { pal: { saree: '#2F9C94', sareeDk: '#1E6F6C', sareeLt: '#7FCDC3', blouse: '#D9467C', blouseDk: '#A82E5C', bangle: '#D9467C', skin: '#E8B48A', skinDk: '#C68A60', skinLt: '#FAD2AE' } };
  const Q3 = { pal: { saree: '#7A4EB8', sareeDk: '#56348A', sareeLt: '#A88AD8', blouse: '#F2C230', blouseDk: '#C89A1E', bangle: '#F2C230', skin: '#D9A07A', skinDk: '#B87E58', skinLt: '#F0C29E' } };
  const Q4 = { pal: { saree: '#F39A2E', sareeDk: '#C8701E', sareeLt: '#FFC27A', blouse: '#2E8C5A', blouseDk: '#1E6A40', bangle: '#2E8C5A', skin: '#F2C8A0', skinDk: '#D6A07A', skinLt: '#FFE2C6' } };
  const UDD = { pal: { skin: '#EDC09A', skinDk: '#CC9A70', skinLt: '#FFDDBE', dhoti: '#F4F0E4', dhotiDk: '#D6CDB8', dhotiLt: '#FFFFFF', border: '#2F9C94', shawl: '#F2C230', shawlDk: '#C89A1E', bead: '#EDB43C' }, veena: false };
  const KID = [
    { pal: { skin: '#5C8FD8', skinDk: '#3E6CB8', skinLt: '#8EB6EE', teal: '#F2C230', tealDk: '#C89A1E', tealLt: '#FFE38A', sash: '#D2452F', sashDk: '#9E2E22' } },
    { pal: { skin: '#E8B48A', skinDk: '#C68A60', skinLt: '#FAD2AE', teal: '#D9467C', tealDk: '#A82E5C', tealLt: '#F07AA8', sash: '#2F9C94', sashDk: '#1E6F6C' } },
  ].map(k => ({ ...k, crown: 1, feather: false, spear: false, shield: false }));
  const SAGE = { pal: NRD_SAGE, beard: '#EDE6DC', veena: false };

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['Krishna had 16,108 QUEENS,', 480, -1, B0 - .1 + 1, 64], ['a palace for EACH.', 568, -1, B0 - .1 + 1, 64], ['Narad Muni went to CHECK!', 668, -1, B0 - .1 + 1, 86, GOLDC],
    ['"ONE Krishna,', 480, B0 + .1, C0 - B0 - .2, 70], ['in 16,108 homes? HOW?!"', 580, B0 + .45, C0 - B0 - .55, 80, GOLDC],
    ['Palace #1: Queen RUKMINI', 480, C0 + .15, JUMP - C0 - .25, 66, GOLDC], ['was fanning him.', 570, C0 + .5, JUMP - C0 - .6, 66],
    ['Krishna JUMPED up and', 480, JUMP, HEAD - JUMP - .1, 66], ['WASHED Narad\'s feet…', 572, JUMP + .35, HEAD - JUMP - .45, 80, GOLDC],
    ['…then put that water', 480, HEAD, D0 - HEAD - .1, 66], ['on his OWN head!', 575, HEAD + .35, D0 - HEAD - .45, 86, GOLDC],
    ['Palace #2: playing DICE.', 500, D0 + .15, LOOK - D0 - .2, 76, GOLDC],
    ['"Narad-ji! When did', 480, LOOK, BACK - LOOK - .1, 72], ['you ARRIVE?"', 580, LOOK + .3, BACK - LOOK - .4, 100, GOLDC],
    ['He had JUST left him', 480, BACK, E0 - BACK - .1, 70], ['next door!', 578, BACK + .3, E0 - BACK - .4, 96, GOLDC],
    ['#3: playing with his KIDS', 500, E0, EK - .08, 74, GOLDC],
    ['#4: getting ready for his BATH', 500, E0 + EK, EK - .08, 66, GOLDC],
    ['#5: offering to the SACRED FIRE', 500, E0 + 2 * EK, EK - .08, 64, GOLDC],
    ['#6: SWORD practice!', 500, E0 + 3 * EK, EK - .08, 84, GOLDC],
    ['#7: giving COWS to brahmins', 500, E0 + 4 * EK, EK - .08, 68, GOLDC],
    ['#8: deep in MEDITATION', 500, E0 + 5 * EK, F0 - E0 - 5 * EK - .08, 76, GOLDC],
    ['EVERY palace…', 480, F0 + .1, G0 - F0 - .15, 80], ['the SAME Krishna!', 585, F0 + .45, G0 - F0 - .5, 96, GOLDC],
    ['Narad LAUGHED:', 480, G0 + .1, TEACH - G0 - .2, 66], ['"I see it now: your YOGAMAYA!"', 575, G0 + .45, TEACH - G0 - .55, 72, GOLDC],
    ['"Don\'t be confused, my child.', 480, TEACH, H0 - TEACH - .1, 64], ['I live like this to TEACH the world."', 572, TEACH + .4, H0 - TEACH - .5, 60, GOLDC],
    ['And EVERY queen believed', 470, H0 + .1, I0 - H0 - .15, 64], ['he had NEVER left', 560, H0 + .4, I0 - H0 - .45, 76, GOLDC], ['HER palace.', 655, H0 + .7, I0 - H0 - .75, 84, GOLDC],
    ['If YOU could be in', 1250, I0 + .2, CARD - I0 - .45, 66], ['TWO places at once,', 1345, I0 + .5, CARD - I0 - .75, 90, GOLDC], ['where would you GO? Comment!', 1440, I0 + .8, CARD - I0 - 1.05, 56],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };
  const camK = (t, keys) => { const c = kf(t, keys); camBegin(c[0], c[1], c[2]); return c; };
  const talk = (t, a, b, f = 9) => t > a && t < b ? .55 + .45 * Math.abs(Math.sin((t - a) * f)) : 0;
  const talkM = (t, a, b) => t > a && t < b ? (Math.sin((t - a) * 17) > -.2 ? 'open' : 'smile') : null;
  // a face over time (emotions()), with the rig's own skin pinned (emotions() hands over Clawd's colours mid-change)
  const face = (t, keys, skin, o = { take: .4 }) => { const f = emotions(t, keys, o); delete f.dx; delete f.rot; delete f.aL; delete f.aR; return { ...f, col: skin.col, dk: skin.dk, lt: skin.lt }; };
  const nar = (x, y, u, o) => narada(x, y, u, { ...o, col: NRD.skin, dk: NRD.skinDk, lt: NRD.skinLt });
  const queen = (x, y, u, Q, o) => parvati(x, y, u, { ...o, pal: Q.pal, col: Q.pal.skin || PRV.skin, dk: Q.pal.skinDk || PRV.skinDk, lt: Q.pal.skinLt || PRV.skinLt });
  const kid = (x, y, u, K, o) => kartikeya(x, y, u, { ...K, ...o, col: K.pal.skin, dk: K.pal.skinDk, lt: K.pal.skinLt });
  // a world point → a rig's hand target (body u), for narada()-rig characters at (x, y, u); sit adds the 8.6u drop
  const hand = (x, y, u, px, py, sit) => [(px - x) / u, (py - y) / u - (sit ? NRD_SIT : 0)];
  const speed = (x, y, dx, n, len, key, col = '#FFF5E2') => {
    boilSeed(key);
    for (let i = 0; i < n; i++) { const o = (hash(i * 3.7) - .5) * 2, l = len * (.5 + hash(i * 1.3) * .6), py = y + o * 700; inkLine([[x - dx * 30, py], [x - dx * (30 + l), py]], 2.2, col, 'inkfine', 0); }
  };

  // ================= A + B · Narad over Dwarka =================
  const NX = 560, NY = 820;
  function shotSky(t, lt) {
    const c = camK(t, [[0, [560, 250, 1.6]], [B0 - .2, [560, 255, 1.62]], [B0 + .6, [560, 780, 1.0]], [DIVE - .1, [560, 790, 1.0]], [C0, [560, 1100, 1.2]]]);
    dwarkaSet(t, { pan: -t * 6 });
    const f = face(t, [
      [0, 'smug', { eyes: 'smug', mouth: 'flat', brow: 1, emote: null }],
      [1.6, 'thinking', { eyes: 'smug', mouth: 'flat', brow: 1, emote: '?' }],
      [SCRATCH, 'confused', { eyes: ['look', 'wide'], mouth: 'O', emote: '?' }],
      [DIVE - .2, 'excited', { eyes: 'wide', mouth: 'grin', emote: null }],
    ], NRD_SKIN);
    const scr = t > SCRATCH - .2 && t < DIVE - .2 ? ease(seg(t, SCRATCH - .2, SCRATCH + .1)) : 0, sw = Math.sin(t * 16) * .3;
    const dive = easeIn(seg(t, DIVE, C0));
    const o = { ...f, cloud: 1, boilKey: 'nar', seed: 1, hx: t < B0 ? .2 : 0, lookX: t < B0 ? .5 : f.lookX || 0, lookY: t > SCRATCH ? -.6 : 0, htilt: t < B0 ? -.08 : .06 * Math.sin(t * 2),
      dy: (f.dy || 0) * .4 + Math.sin(t * 2.2) * .25 + dive * 22, sq: (f.sq || 0) * .4,
      handR: scr > 0 ? [lerp(3.45, 2.2, scr) + sw * scr * .3, lerp(-10.8, -24.6, scr)] : t < B0 ? [.9, -18.2] : undefined, bendR: scr > 0 ? 1.4 : t < B0 ? 1.8 : undefined };
    o.dy += ease(seg(t, B0, B0 + .7)) * 15;   // he sinks toward the city as the camera pulls out
    if (t < B0) o.emoteK = seg(t, 1.6, 1.9);
    nar(NX, NY, NU, o);
    camEnd();
    if (t > DIVE) speed(540, 960, -1, 9, 300 * dive, 'diveA');
    if (t > C0 - .3) { flushLetters(); brushWipe((t - (C0 - .3)) / .6, [PS.sapphire, PS.sapphireLt]); }
    caps(t);
  }

  // ================= C · Palace #1: Rukmini's fan; he washes Narad's feet =================
  const KX1 = 650, SEAT1 = 1340, KXF = 470, NX1 = 255;
  function shotRukmini(t, lt) {
    const c = camK(t, [[C0, [560, 1150, .95]], [JUMP - .1, [560, 1150, .97]], [LAND, [400, 1240, 1.12]], [HEAD - .2, [420, 1230, 1.14]], [HEAD + .4, [450, 1180, 1.22]], [D0, [460, 1170, 1.25]]]);
    palaceRoom(t, { wall: PS.sapphire });
    gaddi(KX1, SEAT1, 360);
    // Rukmini, behind the couch, fanning him with the chamara
    const hop = seg(t, JUMP, LAND), fanA = t < JUMP ? Math.sin(t * 5) * .45 - .5 : -.3;
    const rf = face(t, [[0, 'neutral', { eyes: 'normal', mouth: 'smile' }], [JUMP + .1, 'surprised', { eyes: 'wide', mouth: 'O', emote: null }], [LAND + .5, 'happy', { eyes: 'happy', mouth: 'smile' }]], { col: PRV.skin, dk: PRV.skinDk, lt: PRV.skinLt });
    queen(870, FLOOR, 25, RUK, { ...rf, boilKey: 'ruk', seed: 3, hx: -.4, lookX: -.7, lookY: t < JUMP ? .4 : 0, handR: [3.4, -22.4 + Math.sin(t * 5) * .3], bendR: .9,
      armR: (u, sw) => chamara(u, sw, fanA * .5 - .85), handL: [-2.6, -12.4] });
    // Narad walks in from the left
    const walkK = seg(t, ENTER, ENTER + 1.1), nx = lerp(-160, NX1, easeOut(walkK));
    const nf = face(t, [
      [0, 'neutral', { eyes: 'normal', mouth: 'smile' }],
      [JUMP + .1, 'surprised', { eyes: 'wide', mouth: 'O' }],
      [POUR + .2, 'shy', { eyes: 'wide', mouth: 'sheepish', emote: 'sweat', blush: 1 }],
      [HEAD + .1, 'love', { eyes: 'heart', mouth: 'grin', emote: 'hearts', blush: 1 }],
    ], NRD_SKIN);
    nar(nx, FLOOR, NU, { ...nf, boilKey: 'nar', seed: 1, walk: walkK > 0 && walkK < 1 ? (t - ENTER) * 1.8 : undefined, hx: .4, lookX: t > POUR ? .5 : .6, lookY: t > LAND ? .7 : 0, dy: (nf.dy || 0) * .3, sq: (nf.sq || 0) * .4,
      handR: t > POUR + .2 && t < HEAD ? [2.4, -15.5] : undefined, emoteK: 1 });
    // Krishna: sitting on the couch; hops down to sit at Narad's feet; pours from the kalash; touches the water to his head
    const hk = ease(hop), kx = lerp(KX1, KXF, hk), ky = lerp(SEAT1, FLOOR, hk) - Math.sin(hop * Math.PI) * 120;
    const kf_ = face(t, [
      [0, 'happy', { eyes: 'closed', mouth: 'smile' }],
      [ENTER + .9, 'surprised', { eyes: 'wide', mouth: 'grin', emote: '!' }],
      [LAND, 'happy', { eyes: 'happy', mouth: 'smile', emote: null }],
      [HEAD, 'love', { eyes: 'closed', mouth: 'smile', emote: null }],
    ], { col: KRS.skin, dk: KRS.skinDk, lt: KRS.skinLt });
    const pourK = seg(t, POUR, POUR + .4) * (1 - seg(t, HEAD - .6, HEAD - .3));
    const head = ease(seg(t, HEAD, HEAD + .45));
    const ko = { ...kf_, sit: 1, boilKey: 'kr', seed: 2, hx: t > ENTER + .9 ? -.5 : 0, lookX: t > ENTER + .9 ? -.8 : 0, lookY: t > LAND && t < HEAD ? .6 : 0, dy: (kf_.dy || 0) * .3, sq: (kf_.sq || 0) * .4 + (t > LAND ? spring(t, LAND, 8, 24) * .08 : 0) };
    if (t > LAND - .1) {
      const feet = hand(kx, ky, NU, NX1 + 110, FLOOR - 120, 1);
      ko.handL = head > 0 ? [lerp(feet[0] + .4, -3.9, head), lerp(feet[1] - 2.6, -26.6, head)] : [feet[0] + .4, feet[1] - 2.6];
      ko.handR = head > 0 ? [lerp(-1.6, 2.6, head), lerp(feet[1] + .4, -9.6, head)] : [-1.6, feet[1] + .4];
      ko.bendL = head > .5 ? -1.4 : -.6; ko.bendR = -.4; ko.lean = -1.6 * (1 - head);
      ko.armL = (u, sw) => { if (head < .5) kalash(0, u * 1.5, u * 1.5, -1.1 * pourK - .2, 'kal'); };
    } else { ko.handL = [-4.6, -9.8]; ko.handR = [4.6, -9.8]; }
    krishna(kx, ky, NU, ko);
    if (pourK > 0 && head < .5) { const [hx, hy] = naradaHand(kx, ky, NU, ko, -1); waterPour(hx - NU * 3.0, hy - NU * 1.2, NX1 + 30, FLOOR - 25, pourK, t, 'pour1'); }
    if (head > .5) { boilSeed('hdrops'); const [hx, hy] = naradaHand(kx, ky, NU, ko, -1); for (let k = 0; k < 5; k++) { const q = frac(t * 1.6 + k * .2); paint(ellPts(hx + 20 + k * 14, hy + 10 + q * 90, 5, 7, 8), { wash: PS.water, ink: PS.ink, sw: .4 }); } }
    camEnd();
    if (lt < .5) brushWipe(.5 + lt / 1.0, [PS.sapphire, PS.sapphireLt]);
    if (t > D0 - .3) { flushLetters(); brushWipe((t - (D0 - .3)) / .6, ['#2E7A5A', '#5EAA86']); }
    caps(t);
  }

  // ================= D · Palace #2: dice; "When did you arrive?" =================
  function shotDice(t, lt) {
    const shake = t > TAKE && t < TAKE + .5 ? Math.sin((t - TAKE) * 50) * 6 * (1 - seg(t, TAKE, TAKE + .5)) : 0;
    const c = camK(t, [[D0, [620, 1230, 1.08]], [LOOK - .1, [600, 1240, 1.1]], [LOOK + .3, [520, 1220, 1.16]], [TAKE, [440, 1200, 1.2]], [E0, [420, 1190, 1.24]]]);
    if (shake) { camEnd(); camBegin(c[0] + shake, c[1], c[2]); }
    palaceRoom(t, { wall: '#2E7A5A' });
    const UX = 380, KX = 640, QX = 890, TX = 640;
    // Uddhava and the queen kneel behind the table; Krishna sits between them
    const uf = face(t, [[0, 'neutral', { eyes: 'normal', mouth: 'smile' }], [LOOK, 'happy', { eyes: 'happy', mouth: 'smile' }]], { col: UDD.pal.skin, dk: UDD.pal.skinDk, lt: UDD.pal.skinLt });
    narada(UX, FLOOR, NU, { ...uf, ...UDD, topknot: true, sit: 1, boilKey: 'udd', seed: 4, hx: .4, lookX: t < LOOK ? .6 : -.6, lookY: t < LOOK ? .6 : 0, handR: [3.6, -10.6], handL: [-3.8, -10.2] });
    const qf = face(t, [[0, 'happy', { eyes: 'normal', mouth: 'smile' }], [ROLL + .5, 'excited', { eyes: 'happy', mouth: 'grin', emote: null }], [LOOK, 'happy', { eyes: 'normal', mouth: 'smile' }]], { col: Q2.pal.skin, dk: Q2.pal.skinDk, lt: Q2.pal.skinLt });
    queen(QX, FLOOR, 25, Q2, { ...qf, noShadow: true, dy: 9 + (qf.dy || 0) * .2, boilKey: 'q2', seed: 5, hx: -.4, lookX: t < LOOK ? -.6 : -.8, lookY: t < LOOK ? .6 : 0, handL: [-3.2, -12.2], handR: [2.4, -12.6] });
    const thr = seg(t, ROLL - .3, ROLL), wave = t > LOOK ? ease(seg(t, LOOK, LOOK + .3)) : 0;
    const kf_ = face(t, [
      [0, 'happy', { eyes: 'normal', mouth: 'smile' }],
      [ROLL + .5, 'excited', { eyes: 'wide', mouth: 'grin', emote: null }],
      [LOOK, 'happy', { eyes: 'happy', mouth: 'grin', emote: null }],
      [LOOK + .6, 'happy', { eyes: 'normal', mouth: 'smile', emote: null }],
    ], { col: KRS.skin, dk: KRS.skinDk, lt: KRS.skinLt });
    const km = talkM(t, LOOK + .1, LOOK + 1.6);
    krishna(KX, FLOOR, NU, { ...kf_, sit: 1, boilKey: 'kr', seed: 2, mouth: km || kf_.mouth, hx: t > LOOK - .1 ? -.6 : .1, lookX: t > LOOK - .1 ? -.9 : 0, lookY: t > LOOK - .1 ? -.2 : .6, dy: (kf_.dy || 0) * .3,
      handR: wave > 0 ? [lerp(3.4, 4.6, wave), lerp(-10.4, -19.6, wave) + Math.sin(t * 10) * .4 * wave] : [lerp(3.4, 2.2, thr), lerp(-10.4, -12.8, thr * (1 - thr) * 4)], handL: [-3.6, -10.6], bendR: wave > 0 ? 1.2 : .6 });
    floorPatch(760, 1160);
    diceTable(TX, 1430, 820, t, { roll: t > ROLL ? t - ROLL : null });
    // Narad tiptoes in at the left, foreground; the double take; points back next door
    const inK = easeOut(seg(t, D0 + .2, D0 + 1.4));
    const nf = face(t, [
      [0, 'neutral', { eyes: 'look', mouth: 'smile', emote: null }],
      [LOOK + .2, 'surprised', { eyes: 'wide', mouth: 'O', emote: '!' }],
      [TAKE, 'scared', { eyes: 'wide', mouth: 'scream', emote: '!?' }],
      [BACK, 'confused', { eyes: ['look', 'wide'], mouth: 'open', emote: 'sweat' }],
    ], NRD_SKIN, { take: .9 });
    const back = ease(seg(t, BACK, BACK + .3));
    nar(lerp(-180, 120, inK), FLOOR + 40, 27, { ...nf, boilKey: 'nar', seed: 1, walk: inK < 1 && t > D0 + .2 ? (t - D0) * 1.6 : undefined, dy: (nf.dy || 0) * .3 - (t > TAKE && t < TAKE + .4 ? Math.sin(seg(t, TAKE, TAKE + .4) * Math.PI) * 1.2 : 0), sq: (nf.sq || 0) * .4,
      hx: t < BACK ? .6 - (t > TAKE && t < TAKE + .5 ? Math.sin((t - TAKE) * 30) * .7 : 0) : -.5 + .9 * (1 - back), lookX: t < BACK ? .8 : -.9, lookY: 0, tiptoe: 1,
      handR: t > TAKE && back < .5 ? [2.6, -19.8] : undefined, bendR: 1.2, handL: back > 0 ? [lerp(-2.35, -6.6, back), lerp(-13.2, -18.6, back)] : undefined, bendL: -.6 });
    camEnd();
    if (lt < .5) brushWipe(.5 + lt / 1.0, ['#2E7A5A', '#5EAA86']);
    if (t > E0 - .3) { flushLetters(); brushWipe((t - (E0 - .3)) / .6, ['#B04E8E', '#E07AB8']); }
    caps(t);
  }

  // ================= E · six doorways =================
  const WALLS = ['#B04E8E', '#2E6AA8', '#8A4E2E', '#5E3E9E', '#3E8A6A', '#2E4FA0'];
  const NFACE = [
    { eyes: 'wide', mouth: 'O', emote: '!' },
    { eyes: 'wide', mouth: 'open', emote: 'sweat', sweat: 1 },
    { eyes: ['look', 'wide'], mouth: 'scream', emote: '!?' },
    { eyes: 'swirl', mouth: 'wobble', emote: 'sweat', sweat: 1 },
    { eyes: 'x', mouth: 'open', emote: '!!' },
    { eyes: 'swirl', mouth: 'scream', emote: 'swirl', sweat: 1 },
  ];
  function shotDoors(t, lt) {
    const i = clamp(Math.floor((t - E0) / EK), 0, 5), q = t - E0 - i * EK;
    const c = camK(q, [[0, [560, 1150, .98]], [EK, [560, 1130, 1.04]]]);
    palaceRoom(t, { wall: WALLS[i], window: i !== 2 });
    const K = { boilKey: 'kr', seed: 2, col: KRS.skin, dk: KRS.skinDk, lt: KRS.skinLt };
    if (i === 0) {   // #3 his small children
      const b = Math.sin(t * 9);
      kid(440, FLOOR, 17, KID[0], { eyes: 'happy', mouth: 'laugh', aL: 1.2 + b * .2, aR: 1.2 - b * .2, dy: -Math.abs(b) * .8, hx: .4, boilKey: 'kid0', seed: 1 });
      const kx = 650; const h0 = hand(kx, FLOOR, NU, 450, FLOOR - 17 * 14.2, 1), h1 = hand(kx, FLOOR, NU, 850, FLOOR - 16 * 14.0, 1);
      krishna(kx, FLOOR, NU, { ...K, sit: 1, eyes: 'happy', mouth: 'grin', hx: Math.sin(t * 3) * .3, handL: [h0[0] + Math.sin(t * 8) * .3, h0[1]], handR: [h1[0], h1[1] + Math.sin(t * 7) * .3], bendL: .9, bendR: .9 });
      kid(860, FLOOR, 16, KID[1], { eyes: 'happy', mouth: 'grin', girl: 1, crown: 0, aL: .9, aR: -.2, hx: -.4, lookX: -.6, blush: .8, boilKey: 'kid1', seed: 2, kick: .5 + .5 * Math.sin(t * 6) });
    } else if (i === 1) {   // #4 getting ready for his bath: a lota of water over his shoulder
      const tip = ease(seg(q, .5, .9));
      const ko = { ...K, eyes: tip > .3 ? 'squeeze' : 'happy', mouth: tip > .3 ? 'grin' : 'smile', hx: .3, handR: [4.6, -25.4], bendR: 1.0, handL: [-3.4, -12.4],
        armR: (u, sw) => lota(u, sw, -1.9 * tip - .1) };
      krishna(640, FLOOR, NU, ko);
      if (tip > .2) { const [hx, hy] = naradaHand(640, FLOOR, NU, ko, 1); waterPour(hx - 50, hy - 30, 640 + 20, FLOOR - 24.5 * NU, tip, t, 'bath'); for (let k = 0; k < 7; k++) { boilSeed('drip' + k); const y = FLOOR - 400 + frac(t * 1.4 + k * .3) * 380; paint(ellPts(560 + hash(k) * 170, y, 6, 9, 8), { wash: PS.water, ink: PS.ink, sw: .4 }); } }
      if (q > 1) { boilSeed('bubble'); for (let k = 0; k < 5; k++) paint(ellPts(500 + k * 60, FLOOR - 900 - frac(t * .8 + k * .2) * 200, 14, 14, 10), { ink: '#FFFFFF', sw: 1.2 }); }
    } else if (i === 2) {   // #5 the sacred fire
      havanKund(430, FLOOR - 10, 90, t);
      const off = Math.sin(t * 4) * .5;
      krishna(720, FLOOR, NU, { ...K, sit: 1, eyes: 'closed', mouth: Math.sin(t * 12) > 0 ? 'O' : 'smile', hx: -.3, handL: [-6.4 + off, -13.6], bendL: -.5, handR: [3.6, -10.6],
        armL: (u, sw) => { push(); rotate(-.5); paint(ribbon(U([[0, 0], [-4.4, -.5]], u), .2 * u, .14 * u), { wash: PS.gold, ink: PS.ink, sw: sw * .4 }); paint(ellPts(-4.7 * u, -.55 * u, .55 * u, .32 * u, 10), { wash: PS.gold, ink: PS.ink, sw: sw * .4 }); pop(); }, tint: '#FFB43A', tintK: .12 });
    } else if (i === 3) {   // #6 sword and shield practice
      const sw_ = Math.sin(q * 6), a = -.6 + sw_ * 1.0;
      krishna(640, FLOOR, NU, { ...K, eyes: 'normal', brow: -.4, mouth: 'grin', hx: .3, lookX: .5, lean: sw_ * .6, walk: q * .7,
        handR: [3.6 + Math.cos(a + 1.2) * 2.6, -19.5 - Math.sin(a + 1.2) * 3.4], bendR: 1.2, armR: (u, sw) => khadga(u, sw, a + .9, KRS.ink),
        handL: [-4.6, -15.2], bendL: -1.2, armL: (u, sw) => roundShield(u, sw) });
      boilSeed('swoosh'); inkLine(through([[860, 920], [930, 1040], [900, 1180]].map(([x, y]) => [x + sw_ * 30, y])), 3, '#FFFFFF', 'inkfine', .6);
    } else if (i === 4) {   // #7 cows for the brahmins
      const kx = 450; const nod = Math.sin(t * 3) * .1, rope = [4.4, -11.6];
      narada(990, FLOOR, 21, { ...SAGE, col: NRD_SAGE.skin, dk: NRD_SAGE.skinDk, lt: NRD_SAGE.skinLt, pray: 1, eyes: 'happy', mouth: 'smile', hx: -.4, bow: .4 + Math.sin(t * 3) * .2, boilKey: 'sage', seed: 6 });
      nandi(700, FLOOR, 20, { nod, eyes: 'happy', ear: Math.sin(t * 4) * .2, boilKey: 'cow' });
      const [mx, my] = nandiWorld(700, FLOOR, 20, { nod }, 7.0, -8.2, true);
      krishna(kx, FLOOR, NU, { ...K, eyes: 'happy', mouth: 'grin', hx: .5, lookX: .7, handR: rope, bendR: .4, handL: [-3.4, -12.6] });
      const [hx, hy] = naradaHand(kx, FLOOR, NU, { handR: rope }, 1); boilSeed('rope'); inkLine(through([[hx, hy], [lerp(hx, mx, .5), Math.max(hy, my) + 60], [mx - 10, my + 40]]), 2.6, '#8A6A3A', 'ink', .5);
    } else {   // #8 meditation
      glow(640, FLOOR - 300, 360, '#FFE6A0', .55 + .1 * Math.sin(t * 2));
      krishna(640, FLOOR, NU, { ...K, sit: 1, eyes: 'closed', mouth: 'smile', mudra: 1, float: 0, tint: '#FFE6A0', tintK: .1, dy: -.4 - Math.sin(t * 2) * .2 });
      boilSeed('petals'); for (let k = 0; k < 8; k++) { const y = 500 + frac(t * .2 + hash(k)) * 900, x = 300 + hash(k * 3) * 700 + Math.sin(t + k) * 30; paint(heartPts(x, y, 9), { wash: k % 2 ? PS.pink : PS.saffron, washOp: 200, ink: null }); }
    }
    // Narad's head pokes in at the left edge, more frazzled every time
    const pk = backOut(clamp(q / .3)), nf = NFACE[i];
    nar(-40 + pk * 90, FLOOR + 420, 36, { ...nf, boilKey: 'nar', seed: 1, hx: .7, lookX: .9, lean: 2, htilt: .12 + i * .02, veena: true, emoteK: clamp((q - .2) / .3), emoteAge: q, noShadow: true,
      handR: i >= 3 ? [2.4, -24.2] : [2.6, -19.6], bendR: 1.4, dy: i === 5 ? Math.sin(t * 9) * .3 : 0, rot: i === 3 || i === 5 ? Math.sin(t * 6) * .03 : 0 });
    camEnd();
    if (q < .25) speed(540, 960, 1, 9, 400 * (1 - q / .25), 'whip' + i);
    if (lt < .5 && i === 0) brushWipe(.5 + lt / 1.0, ['#B04E8E', '#E07AB8']);
    if (t > F0 - .3) { flushLetters(); brushWipe((t - (F0 - .3)) / .6, [PS.gold, PS.goldLt]); }
    caps(t);
  }

  // ================= F · a wall of windows: every palace, the same Krishna =================
  const MINI = [
    { flute: 'play', eyes: 'closed', mouth: 'flat' }, { eyes: 'happy', mouth: 'grin', handR: [4.4, -19.4] }, { pray: 1, eyes: 'closed', mouth: 'smile' },
    { eyes: 'normal', mouth: 'smile', flute: 'hand' }, { eyes: ['normal', 'closed'], mouth: 'grin' }, { eyes: 'happy', mouth: 'smile', handL: [-4.4, -19.4] },
    { eyes: 'closed', mouth: 'O' }, { flute: 'play', eyes: 'happy', mouth: 'flat' }, { eyes: 'normal', mouth: 'grin', hx: .4, lookX: .6 },
    { eyes: 'happy', mouth: 'grin', handR: [4.2, -20], handL: [-4.2, -20] }, { pray: 1, eyes: 'happy', mouth: 'smile' }, { eyes: 'normal', mouth: 'smile', hx: -.4, lookX: -.6 },
  ];
  function shotWall(t, lt) {
    const z = kf(t, [[F0, [1.9]], [F0 + 1.6, [1]], [G0, [.97]]])[0];
    push(); translate(540, 960); scale(z); translate(-540, -960 - (z - 1) * 60);
    windowWall(t, { cols: 3, rows: 3, x0: 60, y0: 700, w: 960, h: 700, wall: PS.gold, k: 1, inside: i => WALLS[i % 6],
      cell: (i, cx, by, s) => krishna(cx, by + 6, 6.6 * s, { ...MINI[i], boilKey: 'mini' + i, seed: i, noShadow: true, dy: -Math.abs(Math.sin(t * 5 + i)) * .4 }) });
    pop();
    // the counter: palace numbers racing up to 16,108
    const k = clamp((t - F0 - .3) / 2.4), n = Math.round(9 + (16108 - 9) * Math.pow(k, 3));
    if (t > F0 + .3) letter('#' + n.toLocaleString('en-IN'), 470, 1470, 96 + 14 * Math.sin(seg(t, F0 + 2.7, F0 + 2.9) * Math.PI), k >= 1 ? GOLDC : PAL.cream, { screen: true, ink: false, stroke: PAL.ink, sw: .22, pop: (t - F0 - .3) * 5, rot: -.03 });
    if (lt < .5) brushWipe(.5 + lt / 1.0, [PS.gold, PS.goldLt]);
    if (t > G0 - .3) { flushLetters(); brushWipe((t - (G0 - .3)) / .6, [PS.sapphire, PS.sapphireLt]); }
    caps(t);
  }

  // ================= G · Narad laughs; "I live like this to teach the world" =================
  function shotLaugh(t, lt) {
    const c = camK(t, [[G0, [560, 1180, 1.02]], [TEACH - .2, [520, 1180, 1.05]], [TEACH + .4, [600, 1170, 1.12]], [H0, [620, 1160, 1.16]]]);
    palaceRoom(t, { wall: PS.sapphire });
    const nf = face(t, [
      [0, 'laugh', { eyes: 'squeeze', mouth: 'laugh', emote: null }],
      [TEACH, 'love', { eyes: 'closed', mouth: 'smile', emote: null, blush: .6, tint: null }],
    ], NRD_SKIN);
    const pr = ease(seg(t, TEACH + .3, TEACH + .8));
    nar(330, FLOOR, NU, { ...nf, boilKey: 'nar', seed: 1, hx: .4, lookX: .7, dy: (nf.dy || 0) * .6, sq: (nf.sq || 0) * .6, htilt: t < TEACH ? -.15 + Math.sin(t * 20) * .04 : .05, bow: pr * .6,
      handR: t < TEACH ? [1.6, -12.4] : undefined, pray: pr, mouth: t < TEACH ? (Math.sin(t * 22) > 0 ? 'scream' : 'grin') : nf.mouth });
    const kf_ = face(t, [[0, 'happy', { eyes: 'happy', mouth: 'smile' }], [TEACH, 'happy', { eyes: 'normal', mouth: 'smile' }]], { col: KRS.skin, dk: KRS.skinDk, lt: KRS.skinLt });
    const bl = ease(seg(t, TEACH, TEACH + .4));
    krishna(760, FLOOR, NU, { ...kf_, boilKey: 'kr', seed: 2, hx: -.4, lookX: -.7, mouth: talkM(t, TEACH + .1, TEACH + 2.6) || kf_.mouth, flute: 'hand', handR: [3.45, -10.8],
      handL: bl > 0 ? [lerp(-3.45, -4.4, bl), lerp(-10.8, -17.6, bl)] : undefined, bendL: -1, dy: (kf_.dy || 0) * .3, glowK: .3 });
    if (t > TEACH) { const [hx, hy] = naradaHand(760, FLOOR, NU, { handL: [-4.4, -17.6] }, -1); glow(hx, hy, 140 * bl, '#FFE6A0', .5); }
    camEnd();
    if (lt < .5) brushWipe(.5 + lt / 1.0, [PS.sapphire, PS.sapphireLt]);
    if (t > H0 - .3) { flushLetters(); brushWipe((t - (H0 - .3)) / .6, [PS.gold, PS.goldLt]); }
    caps(t);
  }

  // ================= H · four windows, four queens, each with her Krishna =================
  const QS = [RUK, Q2, Q3, Q4];
  function shotQueens(t, lt) {
    windowWall(t, { cols: 2, rows: 2, x0: 70, y0: 760, w: 940, h: 760, wall: PS.gold, k: 1, inside: i => [PS.sapphire, '#2E7A5A', '#B04E8E', '#5E3E9E'][i],
      cell: (i, cx, by, s) => {
        const u = 9.2 * s, b = Math.sin(t * 3 + i * 1.3);
        queen(cx + 50 * s, by, u * 1.0, QS[i], { eyes: i % 2 ? 'closed' : 'normal', mouth: 'smile', blush: .9, hx: -.5, lookX: -.7, htilt: -.12, boilKey: 'qq' + i, seed: i, noShadow: true, emote: 'hearts', emoteK: clamp((t - H0 - .3 - i * .2) * 3), handL: [-2.2, -15.4] });
        krishna(cx - 55 * s, by, u, { eyes: i % 2 ? 'happy' : 'normal', mouth: 'smile', hx: .5, lookX: .7, htilt: .08 + b * .03, boilKey: 'qk' + i, seed: i + 3, noShadow: true, handR: [3.6, -15.6], flute: i === 3 ? 'hand' : undefined });
      } });
    if (lt < .5) brushWipe(.5 + lt / 1.0, [PS.gold, PS.goldLt]);
    if (t > I0 - .3) { flushLetters(); brushWipe((t - (I0 - .3)) / .6, ['#F6B67A', '#E8887A']); }
    caps(t);
  }

  // ================= I · Narad walks off over Dwarka at evening, singing; a wink =================
  function shotWalk(t, lt) {
    const c = camK(t, [[I0, [560, 820, .9]], [CARD, [600, 800, .95]]]);
    dwarkaSet(t, { dusk: 1, pan: -(t - I0) * 20 });
    const wk = t < WINK - .2, look = ease(seg(t, WINK - .2, WINK + .2));
    const x = lerp(380, 700, ease(seg(t, I0, WINK - .2)));
    nar(x, 980 + Math.sin(t * 2) * 8, 21, { boilKey: 'nar', seed: 1, cloud: 1, strum: wk ? 1 : .3, eyes: t > WINK ? 'wink' : 'happy', mouth: t > WINK ? 'smug' : Math.sin(t * 6) > 0 ? 'open' : 'smile',
      emote: 'music', emoteK: wk ? 1 : 1 - look, emoteAge: t, hx: lerp(.5, -.1, look), lookX: lerp(.6, 0, look), htilt: Math.sin(t * 3) * .05 });
    camEnd();
    if (lt < .5) brushWipe(.5 + lt / 1.0, ['#F6B67A', '#E8887A']);
    if (t > CARD - .3) { flushLetters(); brushWipe((t - (CARD - .3)) / .6, [PS.saffron, PS.rkOrange]); }
    caps(t);
  }

  // ================= J · the card =================
  function shotCard(t, lt) {
    followCard(t, { card: CARD, follow: FOLLOW, pill: PILL, next: ['Part 4:', 'Brahma HID all his friends'], baby: () => {
      const wave = Math.sin(t * 9) * .7;
      balKrishna(470, 1135, 19, { pose: 'sit', eyes: 'happy', mouth: 'grin', blush: .6, handR: [3.6 + wave * .3, -11.5 + wave], handShapeR: 'open', handL: [-2.2, -5.2], boilKey: 'cbaby', seed: 2, dy: -Math.abs(Math.sin(t * 4)) * .3, noShadow: true });
    } });
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [PS.saffron, PS.rkOrange]); }
  }

  shots([[0, shotSky], [C0, shotRukmini], [D0, shotDice], [E0, shotDoors], [F0, shotWall], [G0, shotLaugh], [H0, shotQueens], [I0, shotWalk], [CARD, shotCard]]);
})();
