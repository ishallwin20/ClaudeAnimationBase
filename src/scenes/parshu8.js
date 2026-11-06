// parshu8.js: "PARSHURAMA'S 3 STUDENTS" (ad 80, Parshurama series Part 8, the finale, ~97 s, Bangers captions, SFX,
// no voice). One version each, Ganguli's Mahabharata: BHISHMA refuses his guru's order over Amba (Udyoga 180-181),
// they fight at Kurukshetra "three and twenty days" (185), the Praswapa sleep weapon (186), Narada: "he is thy
// preceptor" (188), the Pitris make Rama put his weapons aside, Bhishma worships him, "There is no Kshatriya equal to
// thee on the earth" (188). DRONA at Mahendra: "my body alone and my weapons left… which wouldst thou have" / "all thy
// weapons" (Adi 131). KARNA: "I am a Brahmana of Bhrigu's race" (Shanti 2); the guru asleep on his lap, the worm
// Alarka in his thigh, he doesn't move; "no Brahmana could endure such agony"; "Karna the son of Radha"; the curse
// (falsehood; the Brahma weapon fails against an equal); "on earth no Kshatriya will be thy equal" (Shanti 3). Then
// the three commanders of one army, fallen at Kurukshetra; Parshurama still lives on Mahendra (Bhagavata 9.16.26); his
// next student, Kalki (Kalki Purana, labelled).
// A fast cold open, then Part 6–7's pace. STORYBOARD.md has the plan and the sources; sets and props are in
// parshu8_props.js (and parshu1–7_props.js). All times are video time (t); tools/parshu8_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/parshu8_sfx.mjs)
  const B0 = 3.8, C0 = 6.2, D0 = 8.6;
  const F0 = 11.0, FREV = 15.8, G0 = 19.4, H0 = 25.0, NARADA = 26.8, J0 = 30.0, KNEEL = 31.6;
  const L0 = 35.6, M0 = 40.2, MREV = 43.8, GIFT = 44.4;
  const O0 = 46.6, P0 = 51.6, BITE = 53.4, R0 = 57.2, RREV = 60.8, S0 = 63.8, DRAIN = 66.6, T0 = 69.2;
  const U0 = 73.6, W0 = 79.2, X0 = 83.8, Y0 = 88.2, CARD = 92.8;
  const CARDC = { cap: CARD + .1, covers: CARD + .3, line: CARD + 1.0, logo: CARD + 1.3, pill: CARD + 1.6, bio: CARD + 1.9, follow: CARD + 2.2 };
  // the duel: the day count runs 1 → 23 over this stretch; its intercut (sub-shot starts, faster and faster)
  const DAY0 = G0 + .7, DAY1 = H0 - .5;
  const DUEL = [[G0, 'wide'], [G0 + 1.3, 'rama'], [G0 + 2.2, 'bhishma'], [G0 + 3.0, 'clash'], [G0 + 3.6, 'rama'], [G0 + 4.1, 'bhishma'], [G0 + 4.5, 'clash'], [G0 + 4.85, 'rama'], [G0 + 5.2, 'bhishma']];
  // Kurukshetra: each lamp lights, then goes out
  const LAMP_ON = [U0 + .5, U0 + 1.0, U0 + 1.5], LAMP_OUT = [U0 + 3.0, U0 + 3.55, U0 + 4.1];

  const GOLDC = '#F5C542', REDC = '#FF6A4A', CREAMC = '#FFF5E2';
  const talk = (t, a, b, rest = 'flat', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const shake = (t, t0, d, a) => (t > t0 && t < t0 + d) ? shakeXY(t, a * (1 - (t - t0) / d)) : [0, 0];
  const cutFlash = (lt, col = '#FFFFFF', d = .12, a = .6) => { if (lt < d) flash(a * (1 - lt / d), col); };
  const BURST = [P4.burstA, P4.burstB];
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['PARSHURAMA', 470, -1, B0 + .9, 132, GOLDC], ['HAD 3 FAMOUS STUDENTS.', 600, -1, B0 + .9, 82],
    ['BHISHMA', 470, B0 + .1, C0 - B0 - .2, 150, GOLDC], ['FOUGHT HIM.', 615, B0 + .35, C0 - B0 - .45, 104],
    ['DRONA', 470, C0 + .1, D0 - C0 - .2, 150, GOLDC], ['GOT EVERYTHING.', 615, C0 + .35, D0 - C0 - .45, 100],
    ['KARNA', 470, D0 + .1, F0 - D0 - .5, 150, GOLDC], ['LIED TO HIM.', 615, D0 + .35, F0 - D0 - .75, 104, REDC],
    ['STUDENT 1: BHISHMA.', 470, F0 + .5, FREV - F0 - .7, 84, GOLDC], ['HIS GURU ORDERED HIM', 570, F0 + .9, FREV - F0 - 1.1, 70], ['TO TAKE BACK PRINCESS AMBA.', 660, F0 + 1.3, FREV - F0 - 1.5, 62, GOLDC],
    ['"I CANNOT.', 480, FREV + .2, G0 - FREV - .4, 124, REDC], ['NOT EVEN FOR MY GURU."', 615, FREV + .6, G0 - FREV - .8, 80],
    ['SO GURU AND STUDENT FOUGHT', 470, G0 + .3, H0 - G0 - .5, 66], ['AT KURUKSHETRA', 570, G0 + .7, H0 - G0 - .9, 92, GOLDC], ['FOR 23 DAYS.', 690, G0 + 1.4, H0 - G0 - 1.6, 92],
    ['BHISHMA RAISED A WEAPON OF SLEEP.', 470, H0 + .3, J0 - H0 - .5, 54], ['NARADA STOPPED HIM:', 565, NARADA, J0 - NARADA - .2, 76, GOLDC], ['"HE IS YOUR GURU!"', 665, NARADA + .5, J0 - NARADA - .7, 88],
    ['PARSHURAMA LAID DOWN HIS BOW:', 470, J0 + .3, L0 - J0 - .5, 58], ['"NO WARRIOR ON EARTH', 570, KNEEL + .2, L0 - KNEEL - .4, 82, GOLDC], ['IS YOUR EQUAL."', 675, KNEEL + .6, L0 - KNEEL - .8, 96, GOLDC],
    ['STUDENT 2: DRONA.', 470, L0 + .4, M0 - L0 - .6, 84, GOLDC], ['BY THEN, PARSHURAMA HAD GIVEN', 570, L0 + .8, M0 - L0 - 1.0, 58], ['EVERYTHING AWAY.', 660, L0 + 1.2, M0 - L0 - 1.4, 84],
    ['"ONLY MY BODY AND MY WEAPONS', 470, M0 + .3, MREV - M0 - .4, 56, GOLDC], ['ARE LEFT. CHOOSE."', 565, M0 + .7, MREV - M0 - .8, 76, GOLDC], ['"ALL YOUR WEAPONS."', 480, MREV + .2, O0 - MREV - .4, 96],
    ['STUDENT 3: KARNA.', 470, O0 + .4, P0 - O0 - .6, 84, GOLDC], ['"I AM A BRAHMIN," HE LIED,', 570, O0 + .8, P0 - O0 - 1.0, 66, REDC], ['AND LEARNED THE BRAHMASTRA.', 665, O0 + 1.4, P0 - O0 - 1.6, 60, GOLDC],
    ['HIS GURU SLEPT ON HIS LAP.', 470, P0 + .4, R0 - P0 - .6, 66], ['AN INSECT BORED INTO HIS THIGH.', 565, BITE - .2, R0 - BITE, 58], ['KARNA DIDN\'T MOVE.', 670, BITE + 1.0, R0 - BITE - 1.2, 88, GOLDC],
    ['"NO BRAHMIN COULD BEAR THIS PAIN.', 470, R0 + .4, RREV - R0 - .5, 54, GOLDC], ['WHO ARE YOU?"', 570, R0 + 1.0, RREV - R0 - 1.1, 100, REDC],
    ['"KARNA,', 480, RREV + .2, S0 - RREV - .4, 140, GOLDC], ['SON OF RADHA."', 625, RREV + .6, S0 - RREV - .8, 88],
    ['"YOU LEARNED IT WITH A LIE.', 470, S0 + .3, T0 - S0 - .5, 64, REDC], ['WHEN YOU FACE YOUR EQUAL,', 570, S0 + .9, T0 - S0 - 1.1, 66], ['YOU WILL FORGET IT."', 670, S0 + 1.5, T0 - S0 - 1.7, 84, REDC],
    ['"GO. BUT NO WARRIOR ON EARTH', 470, T0 + .3, U0 - T0 - .5, 62, GOLDC], ['WILL BE YOUR EQUAL."', 570, T0 + .7, U0 - T0 - .9, 84, GOLDC],
    ['AT KURUKSHETRA, ALL THREE', 470, U0 + .3, W0 - U0 - .5, 66], ['LED THE SAME ARMY, ONE BY ONE.', 565, U0 + .8, W0 - U0 - 1.0, 58, GOLDC], ['ALL THREE FELL THERE.', 665, LAMP_OUT[0] - .2, W0 - LAMP_OUT[0], 84, REDC],
    ['BUT PARSHURAMA NEVER DIED.', 470, W0 + .4, X0 - W0 - .6, 68, GOLDC], ['HE STILL LIVES ON MAHENDRA MOUNTAIN.', 565, W0 + .9, X0 - W0 - 1.1, 50], ['(BHAGAVATA PURANA 9.16)', 645, W0 + 1.4, X0 - W0 - 1.6, 36, CREAMC],
    ['HIS NEXT STUDENT', 470, X0 + .4, Y0 - X0 - .6, 96], ['ISN\'T BORN YET.', 590, X0 + 1.0, Y0 - X0 - 1.2, 108, GOLDC], ['(KALKI PURANA)', 690, X0 + 1.5, Y0 - X0 - 1.7, 36, CREAMC],
    ['WHO WAS HIS GREATEST STUDENT?', 470, Y0 + .3, CARD - Y0 - .3, 58, GOLDC], ['BHISHMA, DRONA OR KARNA?', 565, Y0 + .7, CARD - Y0 - .7, 68], ['COMMENT!', 670, Y0 + 1.2, CARD - Y0 - 1.2, 96, GOLDC],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // Parshurama: bearded since the 21 wars (Part 5), his right hand (the axe) on screen left (flip: 1)
  const RAMA = { flip: 1, beard: PSR.hair, beardLen: .5, quiver: false, boilKey: 'rama', seed: 7 };
  const rama = (x, y, u, o = {}) => parshurama(x, y, u, { ...RAMA, ...o });
  // aiming: flip true looses to screen right, unflipped to screen left (as parshu6's aimPose)
  const aim = (draw, g = 0, o = {}) => ({ handL: [-7.6, -18], bendL: .3, handR: [lerp(-2.6, -.4, draw), lerp(-14.4, -18.6, draw)], bendR: .9, armL: plainBow(draw, true, g), ...o });
  const bowRest = { handL: [-4.6, -10.6], bendL: .7, armL: plainBow(0, false) };
  const parashuAt = (x, y, s, a, key, g = 0) => { boilSeed(key); push(); translate(x, y); rotate(a); parashu(s, 1, { glow: g }); pop(); };
  const bowAt = (x, y, s, a, key) => { boilSeed(key); push(); translate(x, y); rotate(a); plainBow(0, false)(s, 1); pop(); };
  // a plain sky / void: three soft bands
  const voidBg = (hi, mid, lo, cy = 1300, key = 'vbg') => { boilSeed(key); paint(rectPts(-300, -300, W + 600, 2700), { wash: hi, ink: null }); paint(ellPts(540, cy, 1200, 900, 30), { wash: mid, washOp: 220, ink: null }); paint(ellPts(540, cy + 120, 760, 480, 30), { wash: lo, washOp: 200, ink: null }); };
  const KTOP = { topknot: true }, KCROWN = { crown: 'small' };
  const tagBig = (txt, x, y, k, size = 64) => { if (k > 0) letter(txt, x, y, size, GOLDC, { stroke: P8.ink, sw: .22, ink: false, rot: 0, pop: Math.max(.01, k * 2) }); };
  const VIOLET = ['#120E2A', '#2E1E5A', '#5A3E8E'], DUSK = ['#2A1630', '#7A2E3E', '#E8784A'];

  // ================= A · the hook: Parshurama on the sunburst =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1300 - lt * 8, 1.04 + .015 * lt);
    sunburst(t, 540, 1350);
    rama(540, 2080, 30, { axe: 'shoulder', axeGlow: .3, eyes: blinkAt(t, 2.6) ? 'closed' : 'normal', brow: -.3, mouth: 'flat', wind: .4, aura: .3 });
    camEnd();
    caps(t);
    if (lt > dur - .1) flash(.7, '#FFFFFF');
  }

  // ================= B · Bhishma, bow drawn =================
  function shotBhishmaHook(t, lt, dur) {
    camBegin(540, 1300 - lt * 10, 1.05 + .02 * lt);
    bloodGround(t, 540, 1150);
    bhishma(560, 2150, 30, { ...aim(.3 + .7 * ease(seg(t, B0, B0 + .8))), eyes: 'angry', brow: -1, mouth: 'frown', lookX: -.6 });
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .14, .8);
  }

  // ================= C · Drona: the astras come to his open hands =================
  function shotDronaHook(t, lt, dur) {
    camBegin(540, 1300, 1.04 + .02 * lt);
    goldVoid(t, 540, 1350);
    drona(540, 2150, 30, { handL: [-3.2, -12.6], handR: [3.2, -12.6], bendL: .5, bendR: .5, eyes: 'wide', lookY: -.3, mouth: 'O' });
    celestialWeapons(540, 1180, 24, t, { k: ease(seg(t, C0, C0 + .8)), key: 'chw' });
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .14, .8);
  }

  // ================= D · Karna: night, the kundalas glow, a tear =================
  function shotKarnaHook(t, lt, dur) {
    camBegin(540, 1300, 1.05 + .02 * lt);
    voidBg(...VIOLET, 1350, 'dbg');
    const ko = { ...KCROWN, eyes: 'teary', lookY: .6, mouth: 'frown', hx: -.1 };
    karna(540, 2150, 30, ko);
    karnaEars(540, 2150, 30, ko, .8 + .2 * Math.sin(t * 5));
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .14, .7);
    if (lt > dur - .4) { flushLetters(); iris(540, 1100, lerp(1700, 0, easeIn((lt - dur + .4) / .4)), '#0A0408'); }
  }

  // ================= F · the order: "take back princess Amba" / "I cannot. Not even for my guru." =================
  function shotOrder(t, lt, dur) {
    if (t < FREV) {
      const pt = ease(seg(t, F0 + 1.4, F0 + 2.0));
      camBegin(540, 1500, 1.2 + .01 * lt);
      dustPlain(t);
      amba(250, 1790, 14, { eyes: 'teary', lookX: .6, mouth: 'frown', hx: .2 });
      rama(470, 1790, 15.5, { axe: 'hold', eyes: 'angry', brow: -.6, mouth: talk(t, F0 + 1.4, FREV - .4, 'frown', 'open'), lookX: 1, hx: .3, handL: [lerp(-3.45, -8.6, pt), lerp(-10.8, -17.4, pt)], bendL: .3 });
      bhishma(820, 1790, 15.5, { eyes: 'look', lookX: -1, mouth: 'flat', hx: -.3, ...bowRest });
      camEnd();
      caps(t);
      if (lt < .45) { flushLetters(); iris(540, 1100, lerp(0, 1700, easeOut(lt / .45)), '#0A0408'); }
      return;
    }
    const l = t - FREV, no = Math.sin(l * 9) * .4 * Math.exp(-l * .7);
    camBegin(540, 1480, 1.2 + .02 * l);
    dustPlain(t);
    bhishma(540, 2180, 32, { handR: [1.2, -15.0], bendR: 1, hx: no, eyes: l > 1.6 ? 'closed' : 'normal', brow: .2, mouth: talk(t, FREV + .2, FREV + 1.6, 'flat', 'open') });
    camEnd();
    caps(t);
    cutFlash(l, '#FFFFFF', .1, .5);
  }

  // ================= G · 23 days: the intercut duel, the day count =================
  function shotDuel(t, lt, dur) {
    let si = 0; for (let i = 0; i < DUEL.length; i++) if (t >= DUEL[i][0]) si = i;
    const [s0, kind] = DUEL[si], sl = t - s0;
    const day = 1 + Math.floor(22 * clamp((t - DAY0) / (DAY1 - DAY0))), night = t > DAY0 && day % 2 === 0;
    const loose = frac(sl * 1.4), draw = loose < .7 ? ease(loose / .7) : 0;
    if (kind === 'wide') {
      camBegin(540, 1380, 1.0 + .02 * sl);
      dustPlain(t);
      rama(170, 1700, 11, { axe: false, flip: true, ...aim(draw), eyes: 'angry', mouth: 'frown', wind: .5 });
      royalChariot(900, 1700, 280, t, { key: 'gch', flip: true, riders: ([sx, sy]) => bhishma(sx, sy, 11.4, { ...aim(draw), eyes: 'angry', mouth: 'frown', lookX: -.6 }) });
      arrowVolley(270, 1480, 640, 1400, 4, frac(sl * .9), 'gv1', 2, 120);
      arrowVolley(700, 1420, 330, 1480, 4, frac(sl * .9 + .4), 'gv2', 2, 120);
    } else if (kind === 'rama') {
      camBegin(480, 1500, 1.2);
      dustPlain(t);
      rama(400, 2150, 28, { axe: false, flip: true, ...aim(draw), eyes: 'angry', brow: -1, mouth: 'frown', wind: .7, aura: .4 });
      if (loose > .7) arrowVolley(700, 1520, 1500, 1460, 3, (loose - .7) / .3, 'gr' + si, 2, 160);
    } else if (kind === 'bhishma') {
      camBegin(600, 1250, 1.15);
      dustPlain(t);
      royalChariot(700, 1800, 420, t, { key: 'gch2', flip: true, riders: ([sx, sy]) => bhishma(sx, sy, 17, { ...aim(draw), eyes: 'angry', brow: -1, mouth: 'frown', lookX: -.7 }) });
      if (loose > .7) arrowVolley(380, 1300, -400, 1380, 3, (loose - .7) / .3, 'gb' + si, 2, 160);
    } else {   // the clash: two volleys meet mid-air and burst
      camBegin(540, 1200, 1.0);
      dustPlain(t);
      const p = sl / .6;
      arrowVolley(-200, 1150, 540, 1100, 6, p, 'gc1' + si, 1, 300);
      arrowVolley(1280, 1050, 540, 1100, 6, p, 'gc2' + si, 1, 300);
      if (p > .75) shockRing(540, 1100, 60 + 300 * (p - .75), 1 - (p - .75) * 2, 'gcr' + si, '#FFF2C0', .6);
    }
    camEnd();
    if (night) { flushLetters(); boilSeed('gnight'); paint(rectPts(-60, -60, W + 120, H + 120), { wash: P8.night, washOp: 170, ink: null }); }
    if (t > DAY0) bigCount(day, 540, 1390, day > 20 ? 230 : 190, (t - (DAY0 + (day - 1) * (DAY1 - DAY0) / 22)));
    caps(t);
    if (sl < .08) flash(.35 * (1 - sl / .08), '#FFFFFF');
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [P2.plainMid, P2.plainLo]); }
  }

  // ================= H · night: the sleep weapon; Narada stops it =================
  function shotSleep(t, lt, dur) {
    if (t < NARADA) {
      const draw = ease(seg(t, H0 + .2, H0 + 1.2)), g = ease(seg(t, H0 + .6, NARADA - .2));
      camBegin(560, 1480, 1.2 + .03 * lt);
      nightField(t, 1, 'hnf');
      glow(400, 1500, 500 * g, P8.violet, .35 * g);
      bhishma(600, 2160, 30, { ...aim(draw, g), eyes: 'angry', brow: -1, mouth: 'frown', lookX: -.8, tint: P8.violet, tintK: .12 * g });
      camEnd();
      caps(t);
      cutFlash(lt, '#FFFFFF', .14, .6);
      return;
    }
    const l = t - NARADA, drop = easeOut(seg(t, NARADA, NARADA + .7)), lower = ease(seg(t, NARADA + 1.2, NARADA + 2.2));
    camBegin(540, 1480, 1.18);
    nightField(t, 1, 'hnf2');
    const g = 1 - lower;
    glow(560, 1500, 400 * g, P8.violet, .3 * g);
    bhishma(820, 1790, 15.5, { ...aim(1 - lower, g), eyes: lower > .3 ? 'wide' : 'angry', brow: lower > .3 ? .6 : -1, mouth: lower > .3 ? 'O' : 'frown', lookX: -1, lookY: -.3 });
    const ny = lerp(1100, 1700, drop) + Math.sin(t * 2) * 8;
    glow(420, ny - 220, 260, '#FFF2C8', .5 * drop);
    narada(420, ny, 14, { cloud: 1, handR: [8.2, -18.2], bendR: .3, eyes: 'wide', brow: .6, mouth: talk(t, NARADA + .5, J0 - .3, 'O', 'open'), lookX: 1, hx: .3, boilKey: 'nar8', seed: 19 });
    if (l < .8) sparkleBurst(420, 1500, 220, l / .8, 'hsp', 10, ['#FFFFFF', '#FFE6A0']);
    camEnd();
    caps(t);
    if (l < .14) flash(.8 * (1 - l / .14), '#FFF6E0');
  }

  // ================= J · dawn: the ancestors; he lays down his bow; Bhishma kneels; "No warrior on earth…" =================
  function shotEqual(t, lt, dur) {
    if (t < KNEEL) {
      const op = ease(seg(t, J0, J0 + .7)), down = ease(seg(t, J0 + .5, KNEEL - .1));
      camBegin(540, 1480, 1.2);
      dustPlain(t);
      ancestor(1, 250, 1640 - (1 - op) * 40, 11, { eyes: 'closed', mouth: 'smile', glowA: op, ghostK: .55 });
      ancestor(2, 830, 1640 - (1 - op) * 40, 11, { eyes: 'normal', mouth: 'flat', lookX: -.8, glowA: op, ghostK: .55 });
      rama(540, 1790, 16, { axe: false, handL: [lerp(-4.6, -3.2, down), lerp(-10.6, -6.4, down)], bendL: .6, armL: plainBow(0, false), eyes: down > .6 ? 'closed' : 'angry', brow: down > .5 ? .4 : -.8, mouth: down > .6 ? 'flat' : 'frown', lookX: .2 });
      camEnd();
      grade('dawn');
      caps(t);
      wipeIn(lt, [P2.plainMid, '#F2A07A']);
      return;
    }
    const l = t - KNEEL, hand = ease(seg(t, KNEEL + .3, KNEEL + 1.1));
    camBegin(560, 1480, 1.3 + .01 * l);
    dustPlain(t);
    glow(540, 1350, 600, '#FFE6A0', .3);
    const BX = 450, BY = 1820, BU = 17, bo = { sit: 1, pray: 1, bow: .25, eyes: 'closed', mouth: 'smile', hx: .2 };
    const [hx, hy] = naradaHead(BX, BY, BU, { crown: 'small', ...bo });
    bhishma(BX, BY, BU, bo);
    for (const [dx, dy, a] of [[-60, -40, -.5], [70, 20, -.2], [-90, 70, -.8]]) { boilSeed('jar' + dx); arrow(BX + dx, BY - 9 * BU + dy, a + Math.PI, 70, 'jar' + dx); }   // arrows still in his armour
    const RX = 640, RY = 1820, RU = 18, target = [(RX - hx) / RU - .2, (hy - 3.6 * BU - RY) / RU];
    rama(RX, RY, RU, { axe: false, eyes: hand > .9 ? 'happy' : 'look', lookX: -1, lookY: .4, mouth: talk(t, KNEEL + .2, L0 - .5, 'smile', 'open'), hx: -.3, lean: -1 * hand, handR: [lerp(3.45, target[0], hand), lerp(-10.8, target[1], hand)], bendR: .6 });
    bowAt(980, 1830, 15, 1.4, 'jbow');
    if (hand > .9) glow(hx, hy - 30, 220, '#FFE6A0', .5);
    camEnd();
    grade('dawn', .5);
    caps(t);
    cutFlash(l, '#FFFFFF', .1, .4);
  }

  // ================= L · Mahendra: he has given everything away; Drona arrives =================
  function shotDronaArrive(t, lt, dur) {
    const walk = ease(seg(t, L0 + .2, L0 + 2.6)), bowK = Math.sin(Math.PI * seg(t, L0 + 2.8, L0 + 4.0));
    camBegin(540, 1360, 1.15 + .01 * lt);
    mahendraSet(t, { sky: SKY_NOON });
    rama(330, 1590, 14, { sit: 1, axe: false, mudra: 1, eyes: walk > .8 ? 'look' : 'closed', lookX: 1, mouth: 'smile' });
    parashuAt(120, 1585, 12, 1.5, 'laxe');
    bowAt(520, 1590, 11, 1.62, 'lbow');
    drona(lerp(1000, 760, walk), 1590, 14, { walk: walk < 1 ? t * 3 : undefined, bow: .45 * bowK, pray: bowK > .2 ? 1 : 0, eyes: bowK > .3 ? 'closed' : 'look', lookX: -1, mouth: 'smile' });
    camEnd();
    caps(t);
    wipeIn(lt, [P2.snow, '#8FBCE6']);
  }

  // ================= M · "Only my body and my weapons are left. Choose." / "All your weapons." =================
  function shotChoose(t, lt, dur) {
    if (t < MREV) {
      camBegin(540, 1360, 1.1 + .02 * lt);
      mahendraSet(t, { sky: SKY_NOON, rockY: 1700 });
      rama(540, 2160, 30, { axe: false, handL: [-1.2, -15.0], bendL: 1, handR: [lerp(3.45, 7.6, ease(seg(t, M0 + 1.8, M0 + 2.3))), -12.4], bendR: .4, eyes: 'normal', mouth: talk(t, M0 + .3, MREV - .4, 'smile', 'open'), lookX: .2 });
      camEnd();
      caps(t);
      cutFlash(lt, '#FFFFFF', .1, .4);
      return;
    }
    const l = t - MREV, got = clamp((t - GIFT) / 1.6);
    camBegin(540, 1360, 1.1 + .02 * l);
    mahendraSet(t, { sky: SKY_NOON, rockY: 1700 });
    if (got > 0) glow(540, 1760, 300 + 300 * got, '#FFE6A0', .5 * got);
    drona(540, 2160, 30, { handL: [-3.2, -12.6], handR: [3.2, -12.6], bendL: .5, bendR: .5, eyes: got > .3 ? 'wide' : 'determined', mouth: got > .3 ? 'O' : talk(t, MREV + .2, GIFT, 'flat', 'open'), lookX: -.2 });
    astraIn(-150, 1150, 540, 1760, got, 5, 'main');
    camEnd();
    caps(t);
    cutFlash(l, '#FFFFFF', .1, .5);
  }

  // ================= O · Karna: "I am a brahmin." He learns the Brahmastra =================
  function shotKarnaArrive(t, lt, dur) {
    const walk = ease(seg(t, O0, O0 + 1.8)), bowK = ease(seg(t, O0 + 1.9, O0 + 2.4)), give = clamp((t - (O0 + 2.8)) / .9);
    camBegin(540, 1360, 1.15 + .01 * lt);
    mahendraSet(t, { sky: SKY_GOLD });
    rama(330, 1590, 14, { sit: 1, axe: false, eyes: 'look', lookX: 1, mouth: 'smile', handL: give > 0 ? [-7.4, -12.4] : undefined, bendL: .4 });
    const KX = lerp(1000, 720, walk), ko = { ...KTOP, walk: walk < 1 ? t * 3 : undefined, sit: bowK > .5 ? 1 : 0, pray: bowK, bow: .3 * bowK, eyes: bowK > .5 ? 'closed' : 'look', lookX: -1, mouth: talk(t, O0 + .9, O0 + 1.9, 'smile', 'open') };
    karna(KX, 1590, 14, ko);
    karnaEars(KX, 1590, 14, ko, .7);
    if (give > 0 && give < 1) { const [sx, sy] = [440, 1400], [ex, ey] = [KX - 10, 1460]; const x = lerp(sx, ex, ease(give)), y = lerp(sy, ey, ease(give)) - Math.sin(Math.PI * give) * 120; glow(x, y, 120, '#FFE6A0', .7); glow(x, y, 40, '#FFFFFF', .9); }
    if (give >= 1) { glow(KX, 1450, 140 + 10 * Math.sin(t * 6), '#FFE6A0', .55); sparkleBurst(KX, 1450, 120, frac(t - O0), 'osp', 6); }
    camEnd();
    caps(t);
    wipeIn(lt, ['#F2B27A', '#FFE2A8']);
  }

  // ================= P · his guru asleep on his lap; the insect; Karna doesn't move =================
  function shotLap(t, lt, dur) {
    if (t < BITE) {
      camBegin(560, 1440, 1.4 + .02 * lt);
      mahendraSet(t, { sky: SKY_GOLD, tree: [200, 1600, 900] });
      const KX = 520, KY = 1590, KU = 15;
      karna(KX, KY, KU, { ...KTOP, sit: 1, handL: [-2.4, -9.6], bendL: .6, eyes: 'look', lookX: .7, lookY: .6, mouth: 'smile', hx: .3 });
      rama(925, 1556, 13, { axe: false, rot: -Math.PI / 2, eyes: 'closed', mouth: 'flat', noShadow: true, hx: 0, handL: [-2.4, -12], handR: [2.4, -12] });
      const k = ease(seg(t, P0 + .3, BITE - .1)), [bx, by] = [lerp(960, 610, k), lerp(1650, 1600, k) + Math.sin(k * 20) * 4];
      alarka(bx, by, 88, { flip: true, walk: t * 3, key: 'pbug' });
      camEnd();
      caps(t);
      wipeIn(lt, ['#C9785A', '#F2B27A']);
      return;
    }
    const l = t - BITE, bit = l > .2, hold = l > 1.2;
    const sh = shake(t, BITE + .2, .3, 6);
    camBegin(540 + sh[0], 1400 + sh[1], 1.25 + .03 * l);
    voidBg('#3A2030', '#8A4A3A', '#E8A060', 1500, 'pbg');
    karna(540, 2200, 32, { ...KTOP, eyes: bit ? 'squeeze' : 'look', lookY: .7, mouth: bit && !hold ? 'teeth' : 'frown', sweat: bit, sq: bit && !hold ? .03 * Math.sin(t * 30) : 0, handL: [-2.6, -9.2], bendL: .6, handR: [2.6, -9.2], bendR: .6 });
    karnaEars(540, 2200, 32, KTOP, .5);
    if (hold) { const d = frac((t - BITE - 1.2) / 1.4); boilSeed('pdrop'); paint(ellPts(700, 1780 + d * 260, 10, 14, 10), { wash: P8.blood, washOp: 255 * (1 - d), ink: null }); }
    camEnd();
    caps(t);
    cutFlash(l, '#FFFFFF', .1, .5);
    if (bit && l < .32) flash(.4 * (1 - (l - .2) / .12), '#FF3A2A');
  }

  // ================= R · "No brahmin could bear this pain. Who are you?" / "Karna, son of Radha." =================
  function shotWho(t, lt, dur) {
    if (t < RREV) {
      const up = ease(seg(t, R0, R0 + .6)), blaze = ease(seg(t, R0 + 1.0, R0 + 1.6));
      camBegin(540, 1420, 1.2 + .02 * lt);
      voidBg('#3A2030', '#8A4A3A', '#E8A060', 1500, 'rbg');
      const ro = { axe: false, eyes: blaze > .2 ? 'angry' : 'wide', brow: blaze > .2 ? -1 : .8, mouth: talk(t, R0 + .4, RREV - .4, blaze > .2 ? 'frown' : 'O', 'open'), lookX: .8, hx: .3, handL: [-4.6, -14.2], bendL: .8, aura: .5 * blaze, dy: (1 - up) * 3 };
      rama(480, 2180, 30, ro);
      const [hx, hy] = naradaHead(480, 2180, 30, { ...RAMA, ...ro });
      eyeBlaze(hx, hy, 30 * 1.16, blaze * .7, P3.red, 'rblz');
      const [px, py] = naradaHand(480, 2180, 30, { ...RAMA, ...ro }, -1);
      boilSeed('rblood'); paint(ellPts(px, py - 6, 26, 14, 10), { wash: P8.blood, washOp: 220, ink: null });
      camEnd();
      caps(t);
      cutFlash(lt, '#FFFFFF', .12, .5);
      return;
    }
    const l = t - RREV;
    camBegin(540, 1400, 1.2 + .02 * l);
    voidBg(...VIOLET, 1400, 'rbg2');
    const ko = { ...KTOP, pray: 1, bow: .15, eyes: l > .9 ? 'teary' : 'closed', mouth: talk(t, RREV + .2, RREV + 1.6, 'frown', 'open'), lookY: .5 };
    karna(540, 2180, 32, ko);
    karnaEars(540, 2180, 32, ko, .8);
    camEnd();
    caps(t);
    cutFlash(l, '#FFFFFF', .1, .5);
  }

  // ================= S · the curse; his light drains away =================
  function shotCurse(t, lt, dur) {
    if (t < DRAIN) {
      const sh = shake(t, S0 + .6, .5, 10);
      camBegin(540 + sh[0], 1520 + sh[1], 1.15 + .03 * lt);
      voidBg(...DUSK, 1450, 'sbg');
      const ro = { axe: 'hold', axeGlow: .5, eyes: 'angry', brow: -1, mouth: talk(t, S0 + .3, DRAIN - .3, 'frown', 'open'), lookX: .3, handL: [-7.8, -18.4], bendL: .3, aura: .8, wind: .6 };
      const [hx, hy] = naradaHead(540, 2240, 32, { ...RAMA, ...ro });
      curseWave(hx, hy + 60, (t - S0 - .6) / 1.6, 'scw');
      rama(540, 2240, 32, ro);
      eyeBlaze(hx, hy, 32 * 1.16, .8, P3.red, 'sblz');
      camEnd();
      caps(t);
      cutFlash(lt, '#FFFFFF', .14, .7);
      return;
    }
    const l = t - DRAIN, k = 1 - ease(clamp(l / 1.8));
    camBegin(540, 1400, 1.2 + .02 * l);
    voidBg(...VIOLET, 1400, 'sbg2');
    glow(540, 1780, 260 * k + 40, '#FFE6A0', .6 * k);
    karna(540, 2180, 32, { ...KTOP, handL: [-3.2, -12.6], handR: [3.2, -12.6], bendL: .5, bendR: .5, eyes: k < .5 ? 'teary' : 'wide', lookY: .7, mouth: 'frown' });
    for (let i = 0; i < 8; i++) { const q = frac(l * .6 + i / 8), a = hash(i * 3.3) * TAU; if (q < .9) { boilSeed('sdr' + i); paint(starPts(540 + Math.cos(a) * 80 + (hash(i) - .5) * 300 * q, 1760 - q * 700, 16 * (1 - q), .35, 4), { wash: '#FFE6A0', washOp: 255 * k, ink: null }); } }
    camEnd();
    caps(t);
    cutFlash(l, '#FFFFFF', .1, .4);
  }

  // ================= T · "Go. But no warrior on earth will be your equal." =================
  function shotGo(t, lt, dur) {
    const walk = seg(t, T0 + 1.0, U0);
    camBegin(540, 1300, 1.0 + .01 * lt);
    mahendraSet(t, { sky: SKY_GOLD, sun: [760, 1150] });
    rama(320, 1590, 13, { axe: 'hold', eyes: 'look', lookX: .8, mouth: talk(t, T0 + .3, T0 + 2.6, 'frown', 'open'), hx: .3, brow: .3 });
    karna(lerp(640, 1000, walk), 1590, 12, { ...KTOP, walk: walk > 0 ? t * 2.4 : undefined, eyes: 'teary', lookY: .6, mouth: 'frown', hx: .4 });
    camEnd();
    grade('sunset', .7);
    caps(t);
    wipeIn(lt, DUSK.slice(1));
  }

  // ================= U · Kurukshetra: all three led the same army; all three fell there =================
  const SIL = '#1C0E16';
  function shotFall(t, lt, dur) {
    camBegin(540, 1380, 1.12 + .015 * lt);
    voidBg(...DUSK, 1500, 'ubg');
    glow(540, 1380, 520, '#FF7A3A', .55); boilSeed('usun'); paint(ellPts(540, 1390, 170, 170, 30), { wash: '#FFB070', washOp: 230, ink: null });
    boilSeed('uground'); paint([[-300, 1600], [300, 1585], [800, 1605], [1380, 1590], [1380, 2600], [-300, 2600]], { wash: '#2A1418', ink: null, curv: .5 });
    const X = [230, 540, 850], Y = 1640, Uu = 12.5;
    const who = [
      (x, y, o) => bhishma(x, y, Uu, { ...o, armL: plainBow(0, false), handL: [-4.6, -10.6], bendL: .7, pal: silPal({ ...RAM, ...BHISHMA_PAL }, SIL), beard: SIL }),
      (x, y, o) => drona(x, y, Uu, { ...o, pal: silPal({ ...NRD, ...VALMIKI_PAL, ...DRONA_PAL }, SIL), beard: SIL }),
      (x, y, o) => karna(x, y, Uu, { ...o, ...KCROWN, kavacha: false, pal: silPal({ ...RAM, ...KARNA_PAL }, SIL) }),
    ];
    const NAMES = ['BHISHMA', 'DRONA', 'KARNA'];
    X.forEach((x, i) => {
      const on = ease(seg(t, LAMP_ON[i], LAMP_ON[i] + .4)), sink = easeIn(seg(t, LAMP_OUT[i] + .2, LAMP_OUT[i] + 1.4));
      if (on <= 0) return;
      glow(x, Y - 160, 260, '#FFB050', .35 * on * (1 - sink));
      who[i](x, Y, { tint: SIL, tintK: .8, noShadow: true, eyes: sink > 0 ? 'closed' : 'normal', mouth: 'flat', rot: sink * 1.45 * (i === 1 ? -1 : 1), dy: -sink * 1.2 });   // he falls
      if (sink < .5) tagBig(NAMES[i], x, 1205, on * (1 - sink * 2));
    });
    lampRow(X, Y + 50, 20, t, LAMP_ON, LAMP_OUT, 'ulamp');
    camEnd();
    caps(t);
    wipeIn(lt, [P5.lakeRedDk, '#7A2A3A']);
  }

  // ================= W · Mahendra at dawn: he still lives =================
  function shotAlive(t, lt, dur) {
    camBegin(540, 1360 - lt * 6, 1.18 - .01 * lt);
    mahendraSet(t, { sky: SKY_DAWN, sun: [540, 1260 - lt * 14] });
    glow(540, 1450, 380, '#FFE6A0', .3);
    rama(540, 1590, 16, { sit: 1, mudra: 1, axe: false, eyes: 'closed', mouth: 'smile', wind: .2 });
    parashuAt(800, 1586, 12, 1.5, 'waxe');
    bowAt(270, 1592, 11, 1.62, 'wbow');
    camEnd();
    caps(t);
    if (lt < .4) { flushLetters(); iris(540, 1300, lerp(0, 1700, easeOut(lt / .4)), '#0A0408'); }
  }

  // ================= X · sunrise: a rider on a white horse crosses the far ridge; he opens his eyes and smiles =================
  function shotNext(t, lt, dur) {
    camBegin(540, 1300, 1.0);
    mahendraSet(t, { sky: SKY_DAWN, sun: [540, 1190] });
    {   // the vision: a rider on a white horse gallops across the sky over the peaks
      const k = seg(t, X0 + .3, Y0 + .2), hx = lerp(-200, 1250, k), hy = 1275 + Math.sin(k * TAU * 2) * 10, hu = 10;
      for (let i = 1; i < 6; i++) glow(hx - i * 70, hy - 70, 120 - i * 14, '#FFF6E0', .22);
      glow(hx, hy - 90, 260, '#FFF6E0', .5);
      kalkiHorse(hx, hy, hu, { gallop: frac(t * 1.6), boilKey: 'xh', noShadow: true });
      kalki(hx, hy - 9 * hu + 12.2 * hu * 12 / 18, hu * 12 / 18, { boilKey: 'xk', noShadow: true });
      kalkiHorse(hx, hy, hu, { gallop: frac(t * 1.6), boilKey: 'xh', noShadow: true });
    }
    const open = t > X0 + 2.2;
    rama(540, 1590, 16, { sit: 1, mudra: 1, axe: false, eyes: open ? 'look' : 'closed', lookX: open ? .6 : 0, lookY: -.4, mouth: 'smile', hx: open ? .2 : 0 });
    parashuAt(800, 1586, 12, 1.5, 'xaxe');
    bowAt(270, 1592, 11, 1.62, 'xbow');
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .1, .4);
  }

  // ================= Y · the ask: the three students =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 960, 1.0);
    sunburst(t, 540, 1350);
    const pop3 = i => backOut(clamp((t - Y0 - .2 - i * .25) * 3));
    const ko = { ...KCROWN, eyes: 'normal', mouth: 'smile' };
    [[190, 0], [540, 1], [890, 2]].forEach(([x, i]) => {
      const k = pop3(i); if (k <= 0) return;
      const y = 1830 + (1 - k) * 300;
      if (i === 0) bhishma(x, y, 21, { ...bowRest, eyes: blinkAt(t, 90.4) ? 'closed' : 'normal', mouth: 'smile', lookX: .4 });
      if (i === 1) drona(x, y, 21, { eyes: blinkAt(t, 91.1) ? 'closed' : 'normal', mouth: 'smile' });
      if (i === 2) { karna(x, y, 21, { ...ko, lookX: -.4 }); karnaEars(x, y, 21, { ...ko, lookX: -.4 }, .7); }
      tagBig(['BHISHMA', 'DRONA', 'KARNA'][i], x, 1050, k, 58);
    });
    camEnd();
    caps(t);
    wipeIn(lt, BURST);
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, BURST); }
  }

  function shotCard(t, lt) {
    navCard(t, CARDC);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, BURST); }
  }

  shots([[0, shotHook], [B0, shotBhishmaHook], [C0, shotDronaHook], [D0, shotKarnaHook], [F0, shotOrder], [G0, shotDuel],
    [H0, shotSleep], [J0, shotEqual], [L0, shotDronaArrive], [M0, shotChoose], [O0, shotKarnaArrive], [P0, shotLap],
    [R0, shotWho], [S0, shotCurse], [T0, shotGo], [U0, shotFall], [W0, shotAlive], [X0, shotNext], [Y0, shotAsk], [CARD, shotCard]]);
})();
