// parshu7.js: "PARSHURAMA broke GANESHA'S TUSK" (ad 76, Parshurama series Part 7, 88 s, Bangers captions, SFX, no voice).
// One version, the Brahmanda Purana, Upodghata-pada 41–43 (Tagare): after slaying the kings he sets out for Kailasa to
// see Shiva and Uma (41.15-17); Kartikeya and Vinayaka sit at the palace door and he bows to them (41.31-33); Vinayaka:
// "wait, Mahadeva sleeps with Uma; I'll ask first" (41.34-37); "I'll go in, bow and come back: they are the parents of
// the worlds" (41.37-50); he tries to go in, Vinayaka restrains him, a tug of war, Skanda pushes them apart, he raises
// his axe (41.51-53); Ganesha lifts him and carries him through the seven upper worlds, Vaikuntha, Goloka, the seven
// netherworlds, hurls him into the waters, and puts him back where he stood (41.54-55); shaken, he hurls the axe
// (42.1-2); Ganesha knows it for his father's gift and, so that it does not go in vain, takes it on his left tusk
// (42.3); the tusk falls, the earth shakes, the devas cry out (42.4-6); Parvati, angry, to Shiva: "your disciple cut
// your son's tusk with his axe" (42.7-13); Shiva says nothing and calls Krishna in his mind, who comes with Radha
// (42.17-23); "today he has been made Ekadanta" (42.39); Radha heals his cheek with a touch; Parvati is appeased and
// blesses Rama (42.52-56).
// A fast cold open, then Part 6's pace. STORYBOARD.md has the plan and the sources; sets and props are in
// parshu7_props.js (and parshu1–6_props.js). All times are video time (t); tools/parshu7_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/parshu7_sfx.mjs)
  const B0 = 3.8, C0 = 7.4;
  const D0 = 10.2, E0 = 15.0, F0 = 19.6, REV = 22.4;
  const G0 = 24.6, SPLIT = 26.8, H0 = 29.2, LIFT = 31.4;
  const I0 = 34.0, DOWN = 36.4, SPLASH = 38.3, BACK = 39.8;
  const J0 = 40.6, WIND = 43.6, THROW = 44.5;
  const K0 = 45.2, KNOW = 46.8, L0 = 50.2, HIT = 54.2;
  const M0 = 55.0, LAND = 56.1, N0 = 59.6, O0 = 64.6, ARRIVE = 66.4;
  const Q0 = 69.2, NAME = 70.6, R0 = 74.2, BLESS = 75.4, S0 = 79.2, CARD = 84.2;
  const CARDC = { cap: CARD + .1, covers: CARD + .3, line: CARD + 1.0, logo: CARD + 1.3, pill: CARD + 1.6, bio: CARD + 1.9, follow: CARD + 2.2 };

  const GOLDC = '#F5C542', REDC = '#FF6A4A', BLUEC = '#9FDCFF';
  const talk = (t, a, b, rest = 'flat', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const shake = (t, t0, d, a) => (t > t0 && t < t0 + d) ? shakeXY(t, a * (1 - (t - t0) / d)) : [0, 0];
  const cutFlash = (lt, col = '#FFFFFF', d = .12, a = .6) => { if (lt < d) flash(a * (1 - lt / d), col); };
  const BURST = [P4.burstA, P4.burstB], SNOWW = [P2.snowDk, P2.kMid], GOLDW = [P7.goldDk, P7.gold];
  const GOLDB = ['#5A3A1A', '#C8862E', '#FFD27A'];

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['PARSHURAMA', 470, -1, B0 + .9, 132, GOLDC], ['BROKE GANESHA\'S TUSK.', 600, -1, B0 + .9, 88],
    ['WITH THE AXE', 470, B0 + .1, C0 - B0 - .2, 96], ['SHIVA GAVE HIM.', 585, B0 + .4, C0 - B0 - .5, 104, GOLDC],
    ['AND GANESHA', 470, C0 + .2, D0 - C0 - .4, 100], ['LET IT STRIKE.', 590, C0 + .5, D0 - C0 - .7, 112, GOLDC],
    ['AFTER HIS WARS,', 470, D0 + .4, 4.2, 80], ['PARSHURAMA CLIMBED KAILASH', 570, D0 + .8, 3.8, 66, GOLDC], ['TO SEE HIS GURU, SHIVA.', 665, D0 + 1.3, 3.3, 72],
    ['GANESHA STOPPED HIM:', 470, E0 + .6, F0 - E0 - .8, 80], ['"WAIT! MY PARENTS ARE RESTING."', 570, E0 + 1.0, F0 - E0 - 1.2, 60, GOLDC],
    ['"I\'LL JUST BOW TO THEM', 470, F0 + .3, G0 - F0 - .5, 78, GOLDC], ['AND COME RIGHT BACK."', 570, F0 + .7, G0 - F0 - .9, 78, GOLDC], ['"NO."', 700, REV + .2, G0 - REV - .4, 150, REDC],
    ['HE PUSHED IN.', 470, G0 + .3, H0 - G0 - .5, 84], ['GANESHA PUSHED BACK.', 570, G0 + .8, H0 - G0 - 1.0, 80, GOLDC], ['KARTIKEYA PULLED THEM APART.', 670, SPLIT, H0 - SPLIT - .2, 62],
    ['PARSHURAMA RAISED HIS AXE.', 470, H0 + .4, I0 - H0 - .6, 66], ['GANESHA PICKED HIM UP.', 570, LIFT, I0 - LIFT - .2, 76, GOLDC],
    ['AND CARRIED HIM THROUGH', 470, I0 + .2, J0 - I0 - .4, 72], ['EVERY WORLD, UP AND DOWN,', 570, I0 + .6, J0 - I0 - .8, 72, GOLDC], ['THEN DROPPED HIM IN THE WATERS.', 670, SPLASH - .2, J0 - SPLASH, 58],
    ['BACK WHERE HE STOOD, SOAKED AND DIZZY,', 470, J0 + .3, K0 - J0 - .5, 50], ['PARSHURAMA THREW HIS AXE.', 560, WIND - .4, K0 - WIND + .2, 70, REDC],
    ['GANESHA KNEW THAT AXE.', 470, K0 + .3, L0 - K0 - .5, 80], ['HIS FATHER, SHIVA, HAD GIVEN IT.', 570, KNOW + .4, L0 - KNOW - .6, 62, GOLDC],
    ['HE WOULDN\'T LET HIS FATHER\'S GIFT', 470, L0 + .3, HIT - L0 - .5, 60], ['GO IN VAIN.', 565, L0 + .8, HIT - L0 - 1.0, 84, GOLDC], ['SO HE TOOK IT ON HIS TUSK.', 665, L0 + 1.9, HIT - L0 - 2.1, 68],
    ['THE TUSK FELL.', 470, LAND + .1, N0 - LAND - .3, 96], ['THE EARTH SHOOK.', 585, LAND + .6, N0 - LAND - .8, 96, GOLDC],
    ['"YOUR OWN DISCIPLE', 470, N0 + .3, O0 - N0 - .5, 84, GOLDC], ['BROKE OUR SON\'S TUSK', 570, N0 + .6, O0 - N0 - .8, 84, GOLDC], ['WITH THE AXE YOU GAVE HIM!"', 670, N0 + 1.1, O0 - N0 - 1.3, 66, REDC],
    ['SHIVA SAID NOTHING.', 470, O0 + .3, Q0 - O0 - .5, 84], ['HE CALLED KRISHNA.', 575, ARRIVE - .2, Q0 - ARRIVE, 92, BLUEC],
    ['"TODAY YOUR SON BECAME', 470, Q0 + .3, R0 - Q0 - .5, 74], ['EKADANTA,', 590, NAME, R0 - NAME - .2, 140, GOLDC], ['THE ONE-TUSKED."', 715, NAME + .5, R0 - NAME - .7, 72],
    ['PARVATI FORGAVE PARSHURAMA', 470, BLESS + .2, S0 - BLESS - .4, 66], ['AND BLESSED HIM.', 570, BLESS + .6, S0 - BLESS - .8, 88, GOLDC],
    ['EKADANTA IS ONE OF HIS NAMES.', 470, S0 + .3, CARD - S0 - .3, 62, GOLDC], ['HOW MANY OTHERS', 565, S0 + .6, CARD - S0 - .6, 88], ['DO YOU KNOW? COMMENT!', 670, S0 + 1.1, CARD - S0 - 1.1, 70, GOLDC],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // Parshurama: bearded since the 21 wars (Part 5), his right hand (the axe) on screen left (flip: 1)
  const RAMA = { flip: 1, beard: PSR.hair, beardLen: .5, quiver: false, boilKey: 'rama', seed: 7 };
  const rama = (x, y, u, o = {}) => parshurama(x, y, u, { ...RAMA, ...o });
  const waistOff = (u, o) => naradaLocal(0, 0, u, { ...RAMA, ...o }, 0, -12.6);
  // Ganesha: Bal Bappa standing, big tusks; his left tusk (screen right) breaks at HIT
  const GAN = { stand: 1, tusks: 1.7, boilKey: 'gan', seed: 4 };
  const gan = (x, y, u, o = {}) => balBappa(x, y, u, { ...GAN, ...o });
  const tuskHook = s => (u, sw) => balTusk(u * s, sw);
  const kar = (x, y, u, o = {}) => kartikeya(x, y, u, { boilKey: 'kar', seed: 9, ...o });
  const prv = (x, y, u, o = {}) => parvati(x, y, u, { boilKey: 'prv', seed: 11, ...o });
  const krs = (x, y, u, o = {}) => krishna(x, y, u, { boilKey: 'krs', seed: 13, flute: 'hand', ...o });
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  // the light of the axe on a face: warm from screen right
  const doorCam = (lt, sh = [0, 0], cx = 540) => camBegin(cx + sh[0], 1510 + sh[1] - lt * 3, 1.4 + .008 * lt);
  const axeLight = (x, y, r, k) => { glow(x, y, r, '#FFE6A0', .5 * k); glow(x, y, r * .5, '#FFFFFF', .35 * k); };

  // ================= A · the hook: Ganesha with his broken tusk =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1300 - lt * 8, 1.04 + .015 * lt);
    sunburst(t, 540, 1350);
    const look = lt < 1.7;
    gan(540, 2000, 44, { broken: 1, trunk: 'down', trunkSway: Math.sin(t * 2) * .2, aR: .45, armR: tuskHook(2.4), eyes: blinkAt(t, 2.4) ? 'closed' : 'normal', lookX: look ? .9 : 0, lookY: look ? .5 : 0, hx: look ? .25 : 0, mouth: 'smile', ear: .1 + .1 * Math.sin(t * 3) });
    camEnd();
    caps(t);
    if (lt > dur - .1) flash(.7, '#FFFFFF');
  }

  // ================= B · Parshurama, the axe raised, glowing =================
  function shotAxe(t, lt, dur) {
    camBegin(540, 1280 - lt * 10, 1.06 + .02 * lt);
    bloodGround(t, 540, 1150);
    rama(540, 2100, 30, { axe: 'raise', axeGlow: .8 + .2 * Math.sin(t * 5), eyes: blinkAt(t, 6.1) ? 'closed' : 'angry', brow: -1, mouth: 'frown', wind: .6, aura: .75, puff: .3 });
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .14, .8);
  }

  // ================= C · Ganesha in the axe's light: he closes his eyes and lets it come =================
  function shotLetIt(t, lt, dur) {
    const k = ease(seg(t, C0, D0 - .2)), calm = t > C0 + 1.1;
    camBegin(540, 1500, 1.25 + .06 * lt);
    goldVoid(t, 700, 1400);
    axeLight(1200, 1450, 500 + 500 * k, .4 + .6 * k);
    gan(540, 2120, 44, { trunk: 'down', eyes: calm ? 'closed' : 'normal', lookX: .8, hx: calm ? .3 : .1, mouth: calm ? 'smile' : 'flat', ear: .1 });
    camEnd();
    caps(t);
    if (lt > dur - .4) { flushLetters(); iris(700, 1100, lerp(1700, 0, easeIn((lt - dur + .4) / .4)), '#0A0408'); }
  }

  // ================= D · Kailash: he climbs to Shiva's palace =================
  function shotClimb(t, lt, dur) {
    const tilt = ease(seg(t, D0 + 1.8, E0 - .3));
    camBegin(540, lerp(1400, 1020, tilt), 1.2);
    kailashClimb(t);
    const x = lerp(880, 380, lt / dur);
    rama(x, 1760, 13, { flip: 0, axe: 'shoulder', walk: t * 3.2, eyes: 'look', lookX: -.6, lookY: -.6, mouth: 'smile', hx: -.3 });
    camEnd();
    caps(t);
    if (lt < .45) { flushLetters(); iris(540, 1100, lerp(0, 1700, easeOut(lt / .45)), '#0A0408'); }
  }

  // ================= E · the door: Kartikeya and Ganesha; "Wait! My parents are resting." =================
  function shotDoor(t, lt, dur) {
    doorCam(lt);
    palaceDoor(t, { key: 'pde' });
    const arrive = ease(seg(t, E0, E0 + 1.0)), bowK = Math.sin(Math.PI * seg(t, E0 + 1.0, E0 + 1.8)), step = ease(seg(t, E0 + 1.9, E0 + 2.5));
    const hop = ease(seg(t, E0 + 2.0, E0 + 2.6)), hopY = Math.sin(Math.PI * seg(t, E0 + 2.0, E0 + 2.6)) * 1.6;
    kar(250, 1790, 14, { eyes: 'look', lookX: .8, mouth: 'smile', spearA: .05 });
    rama(lerp(1020, 790, arrive) - step * 60, 1790, 15, { axe: 'shoulder', walk: arrive < 1 ? t * 3.2 : undefined, bow: .45 * bowK, eyes: bowK > .3 ? 'closed' : 'look', lookX: -1, mouth: 'smile', hx: -.3 });
    gan(lerp(390, 550, hop), 1790, 14, { dy: -hopY, eyes: hop > .5 ? 'normal' : 'look', lookX: .9, hx: hop > .5 ? .4 : .2, aR: hop > .5 ? .5 : undefined, mouth: talk(t, E0 + 2.7, F0 - .3, 'flat', 'open'), trunk: 'curl' });
    camEnd();
    caps(t);
    wipeIn(lt, SNOWW);
  }

  // ================= F · "I'll just bow to them and come right back." / "No." =================
  function shotNo(t, lt, dur) {
    if (t < REV) {
      camBegin(560, 1320, 1.1 + .03 * lt);
      palaceDoor(t, { key: 'pdf' });
      rama(600, 2200, 30, { axe: 'shoulder', handL: [-1.4, -15.2], bendL: .9, eyes: 'normal', brow: .3, mouth: talk(t, F0 + .3, REV - .4, 'smile', 'open'), lookX: -.8, hx: -.2 });
      camEnd();
      caps(t);
      cutFlash(lt, '#FFFFFF', .1, .4);
      return;
    }
    const l = t - REV, no = Math.sin(l * 13) * .5 * Math.exp(-l * .9);
    camBegin(540, 1480, 1.25 + .02 * l);
    palaceDoor(t, { key: 'pdf2' });
    gan(540, 2200, 40, { cross: 1, hx: no, eyes: 'determined', mouth: l > .2 && l < .6 ? 'o' : 'pout', trunk: 'curl', ear: .3 * Math.abs(no) });
    camEnd();
    caps(t);
    cutFlash(l, '#FFFFFF', .1, .5);
  }

  // ================= G · the tug: he pushes in, Ganesha pushes back; Kartikeya splits them =================
  function shotTug(t, lt, dur) {
    const sh = shake(t, SPLIT + .2, .3, 6);
    doorCam(lt, sh);
    palaceDoor(t, { key: 'pdg' });
    const push = t < SPLIT ? Math.sin((t - G0) * 6) * 22 * ease(seg(t, G0, G0 + .5)) : 0;
    const apart = easeOut(seg(t, SPLIT + .15, SPLIT + .7)), kj = seg(t, SPLIT - .4, SPLIT + .1);
    const rx = 700 + push + apart * 90, gx = 480 + push - apart * 150;
    rama(rx, 1790, 15, { axe: 'shoulder', lean: -1.2 + apart, handL: [-4.8, -15.2], bendL: .4, eyes: 'angry', brow: -.8, mouth: 'frown', lookX: -1, hx: -.3, sweat: true });
    gan(gx, 1790, 14, { aR: 0, trunk: 'hold', eyes: 'squeeze', mouth: 'teeth', sq: .04 * Math.sin(t * 12), ear: .5 });
    for (let i = 0; i < 2; i++) snowPuff(lerp(gx, rx, .5) + (i ? 60 : -60), 1800, 60, frac((t - G0) * 1.6 + i * .5), 'gpf' + i);
    // Kartikeya jumps in from the left and shoves them apart, arms out
    if (kj > 0) {
      const [kx, ky] = arcPt([230, 1790], [lerp(gx, rx, .5), 1790], 160, ease(kj));
      kar(kx, ky, 14, { aL: t > SPLIT ? 0 : .6, aR: t > SPLIT ? 0 : .6, spear: false, shield: false, eyes: t > SPLIT ? 'angry' : 'wide', mouth: 'open', sq: t > SPLIT && t < SPLIT + .2 ? .12 : 0 });
    } else kar(230, 1790, 14, { eyes: 'wide', lookX: 1, mouth: 'O', spearA: .1 });
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .1, .4);
  }

  // ================= H · he raises his axe; Ganesha's trunk whips round him and lifts him =================
  function shotLift(t, lt, dur) {
    const sh = shake(t, LIFT + .3, .25, 7);
    doorCam(lt, sh);
    palaceDoor(t, { key: 'pdh' });
    kar(230, 1790, 13, { eyes: 'wide', lookX: 1, lookY: -.5, mouth: 'O', spearA: .1 });
    const raise = ease(seg(t, H0 + .2, H0 + .7)), reach = ease(seg(t, LIFT, LIFT + .3)), up = backOut(seg(t, LIFT + .45, LIFT + 1.2));
    const GX = 400, GY = 1790, GU = 14, RU = 15;
    const ro = { axe: raise > .5 ? 'raise' : 'shoulder', axeGlow: .3 + .5 * raise, aura: .7 * raise, eyes: up > .1 ? 'wide' : 'angry', brow: up > .1 ? .8 : -1, mouth: up > .1 ? 'O' : 'frown', lookX: -1, wind: .4,
      walk: up > .1 ? t * 7 : undefined, rot: up > .1 ? -.18 * Math.sin(t * 5) : 0, handL: up > .1 ? [-5.6, -21] : undefined, bendL: .6 };
    const [wx0, wy0] = waistOff(RU, ro);
    const rest = [720, 1790], [hx, hy] = [lerp(720, 600, up), lerp(1790 + wy0, 1440, up)];   // his waist
    const rx = up > 0 ? hx - wx0 : rest[0], ry = up > 0 ? hy - wy0 : rest[1];
    const [cwx, cwy] = up > 0 ? [hx, hy] : [rest[0] + wx0, rest[1] + wy0];
    const tip = [lerp(GX + 40, cwx, reach), lerp(GY - 250, cwy, reach)];
    const go = { eyes: reach > 0 ? 'happy' : 'normal', lookX: .8, mouth: reach > 0 ? 'smile' : 'flat', ear: .2 };
    if (reach > 0) go.trunk = trunkTo(GX, GY, GU, tip[0], tip[1], 2 + up * 2);
    else go.trunk = 'curl';
    gan(GX, GY, GU, go);
    rama(rx, ry, RU, { ...ro, noShadow: up > .1 });
    if (reach > .95) trunkWrap(cwx, cwy, 3.6 * RU, 'hwrap');
    if (up > .1) snowPuff(rest[0], 1800, 70, (t - LIFT - .5) * 1.2, 'hpf');
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, SNOWW); }
    if (lt > dur - .2) { speedLines((lt - dur + .2) / .2, 1, 'hspd'); flash((lt - dur + .2) / .2 * .5, '#FFFFFF'); }
  }

  // ================= I · through every world, up and down; dropped in the waters; fished out =================
  const PLATES = [[I0, 'heaven'], [I0 + 1.0, 'vaikuntha'], [I0 + 1.7, 'goloka'], [DOWN, 'patala'], [DOWN + 1.2, 'sea']];
  function shotWorlds(t, lt, dur) {
    let pi = 0; for (let i = 0; i < PLATES.length; i++) if (t >= PLATES[i][0]) pi = i;
    const [p0, kind] = PLATES[pi], pl = t - p0, upPhase = t < DOWN;
    const sea = kind === 'sea', dropped = t > SPLASH, back = t > BACK;
    camBegin(540, 960, 1.0);
    const WL = 1620, scroll = sea ? (t < SPLASH ? lerp(1000, WL - 1100, easeOut(seg(t, p0, SPLASH))) : WL - 1100) : (upPhase ? pl * 700 : -pl * 700);
    worldPlate(kind, t, scroll, 'wp');
    // Ganesha flies with Parshurama dangling from his trunk; at the splash he lets go and hovers, giggling
    const GU = 21, bob = Math.sin(t * 7) * 18;
    const gx = 520 + Math.sin(t * 2.3) * 40, gy = sea ? 1090 + bob : 1180 + bob;
    const RU = 13, swing = Math.sin(t * 5) * .25;
    const ro = { axe: false, eyes: dropped ? 'squeeze' : 'wide', brow: .9, mouth: dropped ? 'teeth' : 'O', walk: t * 9, handL: [-5.6, -21], handR: [5.4, -20], bendL: .6, bendR: .6, rot: swing, wind: .8, windDir: upPhase ? 1 : -1, noShadow: true };
    const [wx0, wy0] = waistOff(RU, ro);
    const HD = 250;
    let hang = [gx + 40, gy + HD];
    if (sea && dropped && !back) hang = [580, WL + 40 + Math.sin(t * 4) * 10];   // in the water: bobbing at the surface, spitting
    else if (back) hang = [lerp(580, gx + 40, ease(seg(t, BACK, BACK + .5))), lerp(WL + 40, gy + HD, ease(seg(t, BACK, BACK + .5)))];
    else if (sea && t > SPLASH - .35) hang = [gx + 40, lerp(gy + HD, WL + 60, easeIn(seg(t, SPLASH - .35, SPLASH)))];
    const holding = !(sea && dropped && !back) && !(sea && t > SPLASH - .35 && !dropped);
    const go = { eyes: dropped && !back ? 'laugh' : 'happy', mouth: dropped && !back ? 'laugh' : 'smile', ear: .5 + .5 * Math.sin(t * 16), noShadow: true };
    go.trunk = holding ? trunkTo(gx, gy, GU, hang[0], hang[1], 1.4) : 'up';
    if (!sea || !dropped || back) speedLines(.8, upPhase ? 1 : -1, 'ispd', upPhase ? '#FFFFFF' : '#C8A8FF');
    gan(gx, gy, GU, go);
    rama(hang[0] - wx0, hang[1] - wy0, RU, { ...ro, rot: holding ? swing : 0 });
    if (holding) trunkWrap(hang[0], hang[1], 3.6 * RU, 'iwrap');
    if (sea && dropped && !back) {   // the near water laps over him
      boilSeed('iwater');
      paint(rectPts(-300, WL + 20 + Math.sin(t * 4) * 10, W + 600, 1200), { wash: P7.sea, washOp: 235, fill: P7.seaHi, fillOp: 60, tex: .4, ink: null });
      inkLine(Array.from({ length: 12 }, (_, j) => [-100 + j * 110, WL + 20 + Math.sin(t * 4 + j * .9) * 12]), 2.4, P7.foam, 'ink', .6);
      if (t > SPLASH + .6) { const k = frac((t - SPLASH - .6) * 1.3); paint(ellPts(560, WL - 150 - 140 * Math.sin(k * Math.PI), 12, 16, 8), { wash: P7.foam, ink: null }); }   // he spits
    }
    splash(580, WL + 10, 340, (t - SPLASH) / 1.1, 'ispl');
    if (back && t < BACK + .3) splash(580, WL + 10, 220, (t - BACK) / .8, 'ispl2');
    camEnd();
    caps(t);
    for (const [p] of PLATES) if (t > p && t < p + .1 && p > I0) flash(.5 * (1 - (t - p) / .1), '#FFFFFF');
    if (t > SPLASH && t < SPLASH + .12) flash(.6, P7.foam);
    if (lt > dur - .25) { speedLines(1, 1, 'iout'); flash((lt - dur + .25) / .25 * .8, '#FFFFFF'); }
  }

  // ================= J · back where he stood, soaked and dizzy; he throws the axe =================
  function shotThrow(t, lt, dur) {
    const red = ease(seg(t, J0 + 1.6, WIND));
    doorCam(lt);
    palaceDoor(t, { key: 'pdj', red });
    kar(230, 1790, 13, { eyes: 'wide', lookX: 1, mouth: 'O', spearA: .1 });
    gan(380, 1790, 14, { cross: 1, eyes: lt < 2.4 ? 'closed' : 'normal', lookX: .7, mouth: 'smile', trunk: 'curl' });
    const dizzy = 1 - ease(seg(t, J0 + 1.3, J0 + 1.9)), shk = t > J0 + 1.2 && t < J0 + 1.9 ? Math.sin(t * 30) * .6 : 0;
    const wind = ease(seg(t, WIND - .5, WIND)), thrown = t > THROW;
    const ro = { axe: thrown ? false : (wind > 0 ? 'raise' : 'shoulder'), axeA: -.6 * wind, axeGlow: .3 + .6 * red, aura: .8 * red, wind: 0, hx: dizzy > .3 ? Math.sin(t * 4) * .4 : shk,
      eyes: dizzy > .3 ? 'swirl' : 'angry', brow: dizzy > .3 ? 0 : -1, mouth: dizzy > .3 ? 'wobble' : (thrown ? 'open' : 'frown'), lookX: -1, lean: -1.2 * wind + (thrown ? -1.6 : 0),
      handR: thrown ? [-4.4, -14] : undefined, bendR: .9 };
    rama(760, 1790, 15, ro);
    if (dizzy > 0) {   // stars round his head, drips off him
      const [hx, hy] = naradaHead(760, 1790, 15, { ...RAMA, ...ro });
      boilSeed('jstars'); for (let i = 0; i < 3; i++) { const a = t * 3 + i * TAU / 3; paint(starPts(hx + Math.cos(a) * 85, hy - 80 + Math.sin(a) * 18, 22, .4, 5), { wash: '#FFE69A', washOp: 255 * dizzy, ink: P7.ink, sw: .5 }); }
    }
    drips(760, 1450, 140, 1800, t, 'jdrip', 8);
    if (thrown) {   // the axe leaves his hand and spins at Ganesha
      const k = (t - THROW) / (K0 - THROW), [ax, ay] = [lerp(700, 470, k), lerp(1440, 1520, k)];
      glow(ax, ay, 160, '#FFE6A0', .6);
      boilSeed('jaxe'); push(); translate(ax, ay); rotate(-t * 14); parashu(15, 1.2, { glow: 1 }); pop();
    }
    camEnd();
    caps(t);
    if (lt < .25) flash(.8 * (1 - lt / .25), '#FFFFFF');
  }

  // ================= K · slow motion: the axe turns in the air; Ganesha knows it =================
  function shotKnow(t, lt, dur) {
    if (t < K0 + 1.5) {
      const k = lt / 1.5;
      camBegin(540, 1200, 1.0 + .05 * k);
      goldVoid(t, 540, 1150);
      for (let i = 0; i < 5; i++) glow(lerp(860, 360, k) + i * 90, 1250 - i * 6, 130 - i * 15, '#FFE6A0', .25);   // its trail
      boilSeed('kaxe'); push(); translate(lerp(800, 300, k), 1300); rotate(-1.2 - k * 1.4); parashu(52, 2.4, { glow: 1 }); pop();
      camEnd();
      caps(t);
      cutFlash(lt, '#FFFFFF', .14, .7);
      return;
    }
    const l = t - K0 - 1.5, know = t > KNOW, mem = ease(seg(t, KNOW + .4, KNOW + 1.0));
    camBegin(540, 1300, 1.0 + .01 * l);
    goldVoid(t, 900, 1500);
    axeLight(1150, 1650, 520, .7 + .2 * Math.sin(t * 6));
    gan(340, 2160, 34, { trunk: 'down', eyes: know ? 'wide' : 'normal', lookX: .9, hx: .2, mouth: know ? 'o' : 'flat', ear: know ? .6 * ease(seg(t, KNOW, KNOW + .3)) : .1 });
    // the memory: Shiva giving young Rama the axe (Part 2)
    if (mem > 0) {
      const BX = 620, BY = 1220;
      thoughtBubble(BX, BY, 700, 430, mem, 430, 1480, 'kmem');
      if (mem > .7) {
        const a = (mem - .7) / .3;
        glow(BX, BY, 220, '#FFE6A0', .5 * a);
        shiva(BX - 150, BY + 170, 10, { boilKey: 'kshiva', seed: 3, eyes: 'normal', lookX: 1, mouth: 'smile', ganga: 1, handR: [8.6, -9.4], bendR: .6, noShadow: true });
        rama(BX + 150, BY + 175, 9.4, { beard: false, sit: 1, pray: 1, bow: .2, axe: false, eyes: 'closed', mouth: 'smile', boilKey: 'kyoung', noShadow: true });
        boilSeed('kmaxe'); push(); translate(BX + 10, BY + 80); rotate(.3); parashu(8, .8, { glow: 1 }); pop();
      }
    }
    camEnd();
    caps(t);
    cutFlash(l, '#FFFFFF', .1, .4);
  }

  // ================= L · the choice: eyes closed, he turns his left tusk to it; the CLANG =================
  function shotChoice(t, lt, dur) {
    const turn = ease(seg(t, L0 + 1.4, L0 + 2.4)), near = ease(seg(t, L0 + 2.6, HIT)), sh = shake(t, HIT, .5, 16);
    camBegin(480 + sh[0], 1500 + sh[1], 1.55 + .03 * lt);
    goldVoid(t, 900, 1500);
    axeLight(1000 - near * 200, 1600, 400 + near * 300, .6 + .4 * near);
    const hit = t > HIT;
    gan(480, 2070, 40, { trunk: 'down', broken: hit, eyes: hit ? 'squeeze' : 'closed', hx: .35 * turn, mouth: hit ? 'teeth' : 'smile', ear: hit ? .9 : .1, sq: hit ? .06 * Math.exp(-(t - HIT) * 6) : 0 });
    if (near > 0 && !hit) { boilSeed('laxe'); push(); translate(lerp(1100, 640, near), 1600); rotate(-t * 4); parashu(22, 1.4, { glow: 1 }); pop(); }
    if (hit) { sparkleBurst(560, 1700, 200, (t - HIT) / .8, 'lsp', 12, ['#FFFFFF', '#FFE6A0']); shockRing(560, 1700, 80 + 300 * (t - HIT), 1 - (t - HIT) / .8, 'lring', '#FFFFFF', .6); }
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .1, .4);
    if (t > HIT && t < HIT + .16) flash(1, '#FFFFFF');
  }

  // ================= M · the tusk falls; the earth shakes; the devas cry out =================
  function shotFall(t, lt, dur) {
    const sh = shake(t, LAND, .9, 22), land = t > LAND;
    doorCam(lt, sh);
    palaceDoor(t, { key: 'pdm', red: .4 * (1 - ease(seg(t, LAND, N0))) });
    // the devas, high up on their clouds, gasp
    const dv = ease(seg(t, LAND + .3, LAND + 1.1));
    if (dv > 0) for (let i = 0; i < 2; i++) {
      const x = 250 + i * 580, y = 1470 - dv * 30 + Math.sin(t * 2 + i) * 6;
      glow(x, y - 100, 180, '#FFF2C8', .5 * dv);
      deva(x, y, 6.6, { boilKey: 'mdv' + i, seed: i, eyes: 'wide', mouth: 'O', handL: [-1.2, -18.4], handR: [1.2, -18.4], bendL: .5, bendR: .5, noShadow: true, tint: '#FFFFFF', tintK: .2 * (1 - dv) });
      cloudPuff(x, y + 14, 150, 'mcl' + i, 255 * dv);
    }
    kar(230, 1790, 13, { eyes: 'wide', lookX: 1, mouth: 'O', spear: false, shield: true, cover: land ? .8 : 0 });
    gan(400, 1790, 14, { broken: 1, trunk: 'down', eyes: land ? 'normal' : 'squeeze', lookX: .4, lookY: .6, mouth: 'flat', ear: .2 });
    rama(780, 1790, 15, { axe: false, handL: [-1.2, -18.2], handR: [1.2, -18.2], bendL: .6, bendR: .6, eyes: 'wide', brow: 1, mouth: 'O', lookX: -1, lookY: .5, sweat: true });
    // the tusk spins up off his face and falls; the axe lies in the snow beside it
    const k = seg(t, M0, LAND), [tx, ty] = arcPt([440, 1530], [560, 1785], 260, k);
    tuskAt(tx, ty, 80, land ? 1.4 : -t * 9, 'mtusk');
    boilSeed('maxe'); push(); translate(640, 1790); rotate(1.45); parashu(13, 1, { glow: .3 * (1 - k) }); pop();
    if (land) { snowPuff(560, 1790, 110, (t - LAND) / 1.0, 'mpf'); for (let i = 0; i < 2; i++) snowPuff(560 + (i ? 150 : -150), 1800, 60, (t - LAND - .05) / .8, 'mpf' + i); }
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .2, .9);
  }

  // ================= N · Parvati: "Your own disciple broke our son's tusk with the axe you gave him!" =================
  function shotParvati(t, lt, dur) {
    const op = ease(seg(t, N0, N0 + .8)), out = ease(seg(t, N0 + .2, N0 + 1.0)), sh = shake(t, N0 + 1.1, .3, 6);
    doorCam(lt, sh);
    palaceDoor(t, { key: 'pdn', open: op });
    shiva(590, 1650, 9, { boilKey: 'nshiva', seed: 3, eyes: 'normal', lookX: -.6, lookY: .3, mouth: 'flat', ganga: 1, noShadow: true });
    gan(235, 1790, 13, { broken: 1, trunk: 'down', eyes: 'look', lookX: .6, lookY: -.4, mouth: 'flat', ear: .1 });
    rama(840, 1790, 15, { axe: false, pray: 1, bow: .35, eyes: 'closed', brow: .8, mouth: 'frown', hx: -.2 });
    prv(lerp(560, 430, out), 1790, 17, { eyes: 'angry', mouth: talk(t, N0 + .4, O0 - .4, 'frown', 'open'), lookX: .7, hx: .3, handR: out > .5 ? [8.6, -17.6] : undefined, bendR: .4, tint: '#FF6A4A', tintK: .12, emote: lt > 1 ? 'anger' : undefined, emoteK: 1 });
    camEnd();
    caps(t);
    wipeIn(lt, [P3.blood, '#C8452E']);
  }

  // ================= O · Shiva says nothing; he calls Krishna; Krishna and Radha arrive =================
  function shotKrishna(t, lt, dur) {
    if (t < ARRIVE - .2) {
      camBegin(540, 1500, 1.15 + .02 * lt);
      palaceDoor(t, { key: 'pdo', open: 1 });
      glow(540, 1350, 500, '#BFE6FF', .3 + .2 * Math.sin(t * 3));
      shiva(540, 2000, 24, { boilKey: 'oshiva', seed: 3, eyes: 'closed', mouth: 'smile', ganga: 1 });
      camEnd();
      caps(t);
      cutFlash(lt, '#FFFFFF', .1, .4);
      return;
    }
    const l = t - ARRIVE, k = ease(seg(t, ARRIVE, ARRIVE + .6));
    doorCam(lt);
    palaceDoor(t, { key: 'pdo2', open: 1 });
    glow(620, 1350, 600, '#BFE6FF', .5 * k); glow(620, 1350, 300, '#FFE6A0', .4 * k);
    prv(270, 1790, 17, { eyes: 'wide', lookX: 1, mouth: 'O', hx: .3, tint: '#FF6A4A', tintK: .08 });
    const fade = { tint: '#FFFFFF', tintK: .6 * (1 - k) };
    krs(560, 1790 - (1 - k) * 60, 15.5, { eyes: blinkAt(t, 68) ? 'closed' : 'normal', mouth: 'smile', lookX: -.6, hx: -.2, ...fade });
    radha7(800, 1790 - (1 - k) * 60, 15, { eyes: 'normal', mouth: 'smile', lookX: -.8, hx: -.3, ...fade });
    if (l < 1) sparkleBurst(680, 1500, 320, l, 'osp', 14, ['#FFFFFF', '#BFE6FF']);
    camEnd();
    caps(t);
    if (l < .15) flash(.9 * (1 - l / .15), '#EAF6FF');
  }

  // ================= Q · "Today your son became EKADANTA, the one-tusked." =================
  function shotName(t, lt, dur) {
    const hand = ease(seg(t, Q0 + .3, Q0 + 1.0)), nm = t > NAME;
    doorCam(lt);
    palaceDoor(t, { key: 'pdq', open: 1 });
    const GX = 450, GY = 1810, GU = 15, KX = 680, KU = 17;
    if (nm) glow(GX, 1500, 360 + 40 * Math.sin(t * 4), '#FFE6A0', .45);
    gan(GX, GY, GU, { broken: 1, trunk: 'curl', eyes: nm ? 'happy' : 'look', lookX: .7, lookY: -.6, mouth: nm ? 'smile' : 'flat', ear: nm ? .4 : .1, blush: nm ? .6 : 0 });
    // Krishna's near hand (screen left) comes to rest on the turban
    const target = [(GX - KX) / KU + .6, (GY - 17.6 * GU - GY) / KU];
    krs(KX, GY, KU, { eyes: 'happy', mouth: talk(t, Q0 + .3, R0 - .6, 'smile', 'open'), lookX: -.7, hx: -.3, lean: -1.2 * hand, handL: [lerp(-3.45, target[0], hand), lerp(-10.8, target[1], hand)], bendL: .6, flute: 'hand' });
    if (nm && t < NAME + .9) sparkleBurst(GX, GY - 13 * GU, 260, (t - NAME) / .9, 'qsp', 12);
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .1, .4);
  }

  // ================= R · Radha heals his cheek; Parvati forgives and blesses Parshurama =================
  function shotForgive(t, lt, dur) {
    if (t < BLESS) {
      const tch = ease(seg(t, R0 + .1, R0 + .6));
      camBegin(540, 1360, 1.35);
      palaceDoor(t, { key: 'pdr', open: 1 });
      gan(450, 1810, 15, { broken: 1, trunk: 'curl', eyes: tch > .8 ? 'happy' : 'normal', lookX: .8, lookY: -.5, mouth: 'smile', blush: .8 * tch, ear: .3 });
      radha7(640, 1810, 15, { eyes: 'happy', mouth: 'smile', lookX: -1, hx: -.3, lean: -1.4 * tch, handL: [lerp(-3.3, -7.4, tch), lerp(-11.2, -13.4, tch)], bendL: .6 });
      if (tch > .8) sparkleBurst(500, 1610, 160, (t - R0 - .6) / .8, 'rsp', 9);
      camEnd();
      caps(t);
      wipeIn(lt, GOLDW);
      return;
    }
    const l = t - BLESS, hand = ease(seg(t, BLESS + .4, BLESS + 1.2));
    doorCam(l);
    palaceDoor(t, { key: 'pdr2', open: 1 });
    glow(540, 1350, 600, '#FFE6A0', .3);
    const RX = 500, RY = 1800, RU = 16, ro = { axe: false, sit: 1, pray: 1, bow: .3, eyes: hand > .9 ? 'closed' : 'look', lookX: 1, lookY: -.5, mouth: 'smile', hx: .2 };
    const [hx, hy] = naradaHead(RX, RY, RU, { ...RAMA, ...ro });
    const PX = 700, PU = 17, target = [(hx - PX) / PU + .3, (hy - 3.3 * RU - 1800) / PU];
    gan(270, 1800, 13, { broken: 1, eyes: 'happy', mouth: 'smile', aL: .9, aR: .9, ear: .4, trunk: 'up' });
    rama(RX, RY, RU, ro);
    prv(PX, 1800, PU, { eyes: 'happy', mouth: 'smile', lookX: -1, hx: -.3, lean: -1.4 * hand, handL: [lerp(-3.3, target[0], hand), lerp(-11.2, target[1], hand)], bendL: .8 });
    if (hand > .9) glow(hx, hy - 30, 220, '#FFE6A0', .5);
    camEnd();
    caps(t);
    cutFlash(l, '#FFFFFF', .1, .4);
  }

  // ================= S · the ask: Ganesha with his tusk, as in frame 0 =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1300 - lt * 6, 1.04 + .012 * lt);
    sunburst(t, 540, 1350);
    gan(540, 2000, 44, { broken: 1, trunk: 'curl', trunkSway: Math.sin(t * 3) * .5, aR: .45, armR: tuskHook(2.4), eyes: blinkAt(t, 81.6) ? 'closed' : 'happy', mouth: 'smile', ear: .2 + .2 * Math.sin(t * 4), blush: .4 });
    camEnd();
    caps(t);
    wipeIn(lt, BURST);
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, BURST); }
  }

  function shotCard(t, lt) {
    navCard(t, CARDC);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, BURST); }
  }

  shots([[0, shotHook], [B0, shotAxe], [C0, shotLetIt], [D0, shotClimb], [E0, shotDoor], [F0, shotNo], [G0, shotTug],
    [H0, shotLift], [I0, shotWorlds], [J0, shotThrow], [K0, shotKnow], [L0, shotChoice], [M0, shotFall],
    [N0, shotParvati], [O0, shotKrishna], [Q0, shotName], [R0, shotForgive], [S0, shotAsk], [CARD, shotCard]]);
})();
