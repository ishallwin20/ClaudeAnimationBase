// hanu1.js: "HANUMAN JI has THREE fathers" (ad 85, Hanuman series Part 1, ~89 s, Bangers captions, retro SFX, no voice).
// Valmiki, Kishkindha 66.8–20 (Jambavan to Hanuman): the apsara Punjikasthala, by a curse born a vanari, Anjana,
// Kesari's wife; on a mountain top in the rains the Wind god holds her unseen; "who would break my vow?"; "fear not,
// I do you no harm: you will bear a son, strong and wise, my equal in leaping"; she is glad; the birth in a cave.
// Shiva Purana, Shatarudra Samhita 20.3–7: Shiva's own energy, sent for Rama's work, carried on a leaf by the seven
// sages and poured through Anjani's ear; Shiva is born as Hanuman. Hanuman Chalisa 2 and 6: Shankar suvan, Kesari
// nandan, Pavan sut. STORYBOARD.md has the plan and the sources; sets are in hanu1_props.js; the series kit is
// src/hanuman_series.js. All times are video time (t); tools/hanu1_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/hanu1_sfx.mjs)
  const Q = [1.6, 2.0, 2.4], SHRUG = 3.2, B0 = 4.4;
  const C0 = 9.0, CURSE = 9.5, FALL0 = 10.6, LAND0 = 11.6, APPEAR = 11.9, TAILQ = 12.7, D0 = 14.2;
  const KARR = 15.7, FLOWER = 16.0, HEART = 16.8, ST1 = 18.4, E0 = 20.4;
  const PEEK = 22.0, E2 = 24.6, SWIRL = 24.8, SNAPT = 25.8, E3 = 29.0, VPOP = 29.2, CALM = 31.4, WISP = 33.6, WISPIN = 34.8, ST2 = 37.2, F0 = 39.2;
  const F2 = 43.4, OPEN = 43.9, ORB = 44.6, ORBOFF = 46.6, F3 = 48.0, TRIP = 50.4, F4 = 53.2, POUR = 54.5, LIT = 55.5, ST3 = 57.4, G0 = 59.6;
  const BORN = 60.9, YAWN = 61.6, EYES = 62.7, H0 = 64.6, LOOKS = [65.2, 66.0, 66.8], ALL = 68.3, CH0 = 71.3, NAMES = [72.4, 73.6, 74.8], I0 = 77.3, J0 = 81.8;
  const CARD = 85.4;
  const CARDC = hsCardTimes(CARD);

  const GOLDC = '#F5C542', CREAM = '#FFF5E2';
  const pop = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const talk = (t, a, b, rest = 'smile', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const GOLD = [GOLDC, '#F39A2E'], ROSE = ['#F7B7C9', '#FFE9C2'], LEAFW = [P1.leaf, P1.leafDk], NIGHT = ['#3A4A8E', '#1A2050'], SLATE = ['#A9B6CE', '#5E6A8E'], PEACH = [HSK.marigold, HSK.petal];
  const shake = (t, t0, d, a) => (t > t0 && t < t0 + d) ? shakeXY(t, a * (1 - (t - t0) / d)) : [0, 0];

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['HANUMAN JI HAS', 480, -1, 5.25, 92], ['THREE FATHERS', 610, -1, 5.25, 128, GOLDC],
    ['HIS MOTHER WAS AN APSARA', 470, B0 + .1, 4.3, 70], ['NAMED PUNJIKASTHALA.', 575, B0 + .35, 4.05, 84, GOLDC],
    ['A CURSE SENT HER TO EARTH', 470, C0 + .15, 4.8, 68], ['AS A VANARI: ANJANA.', 575, C0 + .4, 4.55, 88, GOLDC],
    ['SHE MARRIED KESARI,', 470, D0 + .1, 3.9, 84], ['A VANARA KING.', 580, D0 + .35, 3.65, 96, GOLDC],
    ['FATHER NO. 1', 470, ST1, 1.9, 84], ['KESARI', 600, ST1 + .15, 1.75, 150, GOLDC],
    ['ONE DAY, ON A MOUNTAIN TOP,', 470, E0 + .1, 3.9, 66], ['THE WIND GOD SAW HER.', 570, E0 + .35, 3.65, 82, GOLDC],
    ['SHE FELT THE WIND HOLD HER.', 470, E2 + .1, 4.1, 66], ['"WHO DARES? I AM MARRIED!"', 570, SNAPT, 3.0, 72, GOLDC],
    ['"DO NOT FEAR," SAID VAYU.', 470, E3 + .2, 3.8, 70], ['"I WILL NOT HARM YOU."', 570, E3 + .5, 3.5, 80, GOLDC],
    ['"YOU WILL HAVE A SON', 470, WISP - .5, 3.9, 80], ['WHO LEAPS LIKE THE WIND!"', 575, WISP - .25, 3.65, 76, GOLDC],
    ['FATHER NO. 2', 470, ST2, 1.9, 84], ['VAYU DEV', 600, ST2 + .15, 1.75, 150, GOLDC],
    ['BUT THE SHIVA PURANA', 470, F0 + .1, 4.0, 82, GOLDC], ['TELLS ONE MORE SECRET…', 575, F0 + .35, 3.75, 78],
    ['LORD SHIVA SENT HIS OWN ENERGY', 470, F2 + .1, 4.3, 62], ['TO HELP SHRI RAM.', 570, F2 + .35, 4.05, 92, GOLDC],
    ['SEVEN SAGES CARRIED IT', 470, F3 + .1, 4.9, 78, GOLDC], ['ON A LEAF…', 580, F3 + .35, 4.65, 96],
    ['…AND POURED IT', 470, F4 + .1, 4.0, 88], ["INTO ANJANA'S EAR.", 580, F4 + .35, 3.75, 90, GOLDC],
    ['FATHER NO. 3', 470, ST3, 2.1, 84], ['LORD SHIVA', 600, ST3 + .15, 1.95, 140, GOLDC],
    ['AND IN A CAVE,', 470, G0 + .1, 4.6, 88], ['HANUMAN WAS BORN.', 585, BORN, 3.6, 96, GOLDC],
    ['SO WHICH FATHER', 470, H0 + .1, 3.5, 88], ['IS THE REAL ONE?', 585, H0 + .35, 3.25, 96, GOLDC],
    ['ALL THREE.', 540, ALL, 2.9, 170, GOLDC],
    ['YOU SING IT IN THE CHALISA:', 460, CH0 + .1, 5.8, 62],
    ['SHANKAR SUVAN', 552, NAMES[0], 77.2 - NAMES[0], 92, GOLDC], ['KESARI NANDAN', 656, NAMES[1], 77.2 - NAMES[1], 92, GOLDC], ['PAVAN SUT', 760, NAMES[2], 77.2 - NAMES[2], 92, GOLDC],
    ['WHICH NAME DOES', 470, I0 + .1, 4.3, 86], ['YOUR FAMILY USE?', 580, I0 + .35, 4.05, 96, GOLDC], ['COMMENT IT!', 695, I0 + .9, 3.5, 80],
    ['NEXT: THE DAY HE GOT', 470, J0 + .1, 3.4, 78], ['8 SUPERPOWERS!', 590, J0 + .35, 3.15, 118, GOLDC],
  ];
  // the series marks (the part pill and the source line beside it) are up for the opening only and fade out before the
  // heaven shot ends (owner, 11 Nov: not through the whole reel); the captions name the Shiva Purana and the Chalisa
  const MARKS = C0 - .2, SRC = [['VALMIKI RAMAYAN · SHIVA PURANA', B0 + .3, MARKS]];
  const caps = t => {
    for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color });
    if (t < MARKS) { hsPill(1, 1 - seg(t, MARKS - .3, MARKS)); for (const [txt, a, b] of SRC) hsSource(txt, t - a, b - a); }
  };
  // a stamp's thump: a little zoom kick at t0
  const kick = (t, t0) => t > t0 ? .05 * Math.exp(-(t - t0) * 6) * Math.cos((t - t0) * 20) : 0;
  const hearts = (x, y, t, t0, key, n = 3) => { if (t < t0) return; boilSeed(key); for (let i = 0; i < n; i++) { const a = t - t0 - i * .22; if (a < 0 || a > 1.6) continue; const px = x + (i - 1) * 46 + Math.sin(a * 5 + i) * 14, py = y - a * 150, s = 22 * backOut(clamp(a * 4)) * (1 - clamp((a - 1.1) / .5)); paint(heartPts(px, py, s), { wash: '#F2557A', ink: HSK.ink, sw: .8 }); } };
  const glowBehind = (x, y, r, k, col = '#FFE08A') => { if (k > 0) { glow(x, y, r, col, .7 * k); glow(x, y, r * 1.8, col, .3 * k); } };

  // ================= A · the hook: the baby and three question marks =================
  const hookBaby = (t, ask) => {
    const X = 540, Y = 1560, u = 50;
    const o = { pose: 'sit', boilKey: 'baby', seed: 3, eyes: 'normal', mouth: 'cat', tailSway: t * 1.4, lookY: -.1 };
    return [X, Y, u, o];
  };
  function shotHook(t, lt, dur) {
    camBegin(540, 1010 - lt * 5, 1.0 + .012 * lt);
    warmBack(t, 'wbA', 540, 1150);
    const [X, Y, u, o] = hookBaby(t);
    const QP = [[235, 900], [650, 790], [850, 930]];
    const nq = Q.filter(q => t > q).length;
    if (blinkAt(t, .9)) o.eyes = 'closed';
    if (nq > 0 && t < SHRUG) { const p = QP[nq - 1]; o.lookX = clamp((p[0] - X) / 260, -1, 1); o.lookY = -.8; o.eyes = 'wide'; o.mouth = 'O'; o.hx = o.lookX * .5; const tk = take(t, Q[nq - 1], .35); o.sq = tk.sq; o.dy = tk.dy; }
    if (t >= SHRUG) {
      const g = t - SHRUG;
      o.eyes = blinkAt(t, 3.9) ? 'closed' : 'happy'; o.mouth = 'grin'; o.blush = clamp(g * 3) * .7; o.htilt = .12 * ease(clamp(g * 4));
      o.handL = [-3.6, -6.2 - .5 * ease(clamp(g * 5))]; o.handR = [3.6, -6.2 - .5 * ease(clamp(g * 5))]; o.handShapeL = o.handShapeR = 'open'; o.bendL = o.bendR = 1;
      o.dy = -.14 * Math.abs(Math.sin(g * 8)) * Math.exp(-g * .9);
    }
    balHanuman(X, Y, u, o);
    Q.forEach((q, i) => { if (t > q) { boilSeed('q' + i); emote('?', QP[i][0], QP[i][1] + 8 * Math.sin(t * 3 + i), 46, pop(t, q, 6), t - q); } });
    camEnd();
    caps(t);
    wipeOut(lt, dur, ROSE);
  }

  // ================= B · heaven: the apsara Punjikasthala =================
  const apsDance = (t, o = {}) => {
    const b = t * 3.2, s = Math.sin(b);
    return { boilKey: 'aps', seed: 5, eyes: blinkAt(t, 6.6) ? 'closed' : 'happy', mouth: 'smile', lean: 1.1 * s, htilt: .1 * s, walk: t * 2.2, dy: -.25 * Math.abs(Math.cos(b)),
      handL: [-4.6 - .6 * s, -22.5 + 3.2 * s], bendL: .7, handR: [4.6 - .6 * s, -22.5 - 3.2 * s], bendR: .7, blush: .4, ...o };
  };
  function shotHeaven(t, lt, dur) {
    camBegin(540, 1180 - lt * 6, 1.0 + .015 * lt);
    heaven(t, 0);
    const X = 540, Y = 1690, u = 26;
    cloudPuff(X, Y + 30, 250, 'apscloud', 255, '#FFFFFF', '#F2CFC8');
    apsara(X, Y, u, apsDance(t));
    for (let i = 0; i < 3; i++) { const a = frac((t - B0) * .5 + i / 3); sparkleBurst(X + [-300, 290, -60][i], 1120 + [120, 60, -260][i], 60, a * .8, 'hvsp' + i, 6, ['#FFFFFF', '#FFE69A']); }
    camEnd();
    caps(t);
    wipeIn(lt, ROSE);
  }

  // ================= C · the curse; the fall; she lands a vanari =================
  function shotCurse(t, lt, dur) {
    const dark = ease(seg(t, CURSE, CURSE + .5)), sh = shake(t, CURSE, .5, 14);
    camBegin(540 + sh[0], 1150 + sh[1], 1.06 + .03 * lt);
    heaven(t, dark);
    const X = 540, Y = 1690, u = 26;
    cloudPuff(X, Y + 30, 250, 'apscloud', 255, mixCol('#FFFFFF', '#9A86B0', dark * .6), '#C8B0C8');
    let o = apsDance(t);
    if (t > CURSE) { const tk = take(t, CURSE, .7); o = { boilKey: 'aps', seed: 5, eyes: 'wide', mouth: 'O', sq: tk.sq, dy: tk.dy, handL: [-3.4, -19], handR: [3.4, -19], bendL: .8, bendR: .8, dx: .12 * Math.sin(t * 50) }; }
    curseMark(X, Y - 13 * u, 9 * u, t, clamp((t - CURSE) * 3));
    apsara(X, Y, u, o);
    if (t > CURSE) { boilSeed('cemote'); emote('!', X + 5.5 * u, Y - 23 * u, 40, pop(t, CURSE + .1, 6), t - CURSE); }
    // the cloud gives way under her: she drops out of frame
    camEnd();
    if (t > CURSE && t < CURSE + .25) flash((1 - (t - CURSE) / .25) * .7, '#E2C8FF');
    caps(t);
  }
  function shotFall(t, lt, dur) {
    const k = lt / dur;
    camBegin(540, 960, 1.0);
    fallSky(t, k);
    const y = lerp(900, 1650, easeIn(k) * .6 + k * .4), x = 540 + 90 * Math.sin(lt * 5);
    boilSeed('fallstreak');
    for (let i = 0; i < 7; i++) { const sx = x + (hash(i * 3.3) - .5) * 240; inkLine([[sx, y - 380], [sx, y - 380 - 160 - 200 * hash(i)]], 2.4, '#FFFFFF', 'inkfine', 0); }
    curseMark(x, y - 190, 150, t, .8, 'fallmark');
    apsara(x, y, 15, { boilKey: 'aps', seed: 5, eyes: 'squeeze', mouth: 'O', rot: .5 * Math.sin(lt * 9), handL: [-4.4, -24], handR: [4.4, -24.5], bendL: .5, bendR: .5, noShadow: true });
    camEnd();
    caps(t);
  }
  function shotLand(t, lt, dur) {
    const sh = shake(t, LAND0, .4, 16);
    camBegin(540 + sh[0], 1230 + sh[1], 1.05 + .02 * lt);
    forestHill(t);
    const X = 540, Y = 1790, u = 25;
    if (t > APPEAR) {
      const k = pop(t, APPEAR, 3.2), q = t > TAILQ && t < TAILQ + 1.0;
      const o = { boilKey: 'anj', seed: 10, eyes: 'wide', mouth: 'O', tailSway: t * 3, sq: .25 * (1 - k) };
      if (blinkAt(t, 12.3) || blinkAt(t, 12.5)) o.eyes = 'closed';
      if (q) { o.hx = .9; o.lookX = 1; o.lookY = .2; o.eyes = 'wide'; o.mouth = 'O'; o.handR = [3.2, -17.4]; o.bendR = .8; }
      if (t > TAILQ + 1.0) { o.eyes = 'happy'; o.mouth = 'smile'; o.blush = .5; o.htilt = .08; o.handL = [-3.8, -13.5]; o.handR = [3.8, -13.5]; o.bendL = o.bendR = 1; o.dy = -.15 * Math.abs(Math.sin((t - TAILQ - 1) * 7)) * Math.exp(-(t - TAILQ - 1) * 1.5); }
      anjana(X, Y - (1 - k) * 60, u * (.7 + .3 * k), o);
      if (q) { boilSeed('tailq'); emote('?', X + 7.2 * u, Y - 20 * u, 40, pop(t, TAILQ, 6), t - TAILQ); }
    }
    poof(X, Y - 9 * u, 300, (t - LAND0) / .75, 'landpoof', ['#E8D0FF', '#FFF2C8']);
    if (t > LAND0 && t < LAND0 + .8) sparkleBurst(X, Y - 9 * u, 200, t - LAND0, 'landburst', 10, ['#FFFFFF', '#D9B0FF']);
    camEnd();
    if (lt < .12) flash(1 - lt / .12, '#FFFFFF');
    caps(t);
    wipeOut(lt, dur, LEAFW);
  }

  // ================= D · she marries Kesari; FATHER NO. 1 =================
  function shotKesari(t, lt, dur) {
    const st = ease(seg(t, ST1 - .25, ST1 + .1));
    camBegin(lerp(540, 690, st), lerp(1230, 1180, st), lerp(1.02, 1.32, st) + kick(t, ST1 + .05));
    forestHill(t, 'fh', .25);
    const Y = 1790, AX = 320, KX0 = 760;
    const wk = ease(seg(t, D0 + .1, KARR)), kx = lerp(1260, KX0, wk);
    const ao = { boilKey: 'anj', seed: 10, eyes: 'normal', mouth: 'smile', hx: .7, lookX: .9, tailSway: t * 1.8 };
    if (t > FLOWER + .3) { ao.eyes = 'happy'; ao.blush = .8 * clamp((t - FLOWER - .3) * 3); ao.htilt = -.1; ao.handR = [2.2, -15.6]; ao.bendR = .9; }
    if (t > ST1) { ao.eyes = 'happy'; ao.mouth = 'grin'; ao.handL = [-1.2, -15.4]; ao.handR = [1.2, -15.4]; }
    anjana(AX, Y, 24, ao);
    const offer = ease(seg(t, FLOWER - .3, FLOWER + .15)) * (1 - ease(seg(t, HEART + .6, HEART + 1.1)));
    const ko = { boilKey: 'kes', seed: 11, flip: true, walk: wk > 0 && wk < 1 ? (t - D0) * 1.9 : null, eyes: t > FLOWER ? 'happy' : 'normal', mouth: 'smile', hx: .5, lookX: .8, tailSway: t * 1.5,
      handR: [lerp(3.4, 6.6, offer), lerp(-9, -16.5, offer)], bendR: .5, blush: t > HEART ? .6 : 0 };
    if (t > ST1 - .1) { const g = t - ST1; Object.assign(ko, { puff: clamp(g * 5 + .5), eyes: 'happy', mouth: 'grin', hx: 0, lookX: 0, handL: [-4.6, -11.5], handR: [4.6, -11.5], bendL: -1, bendR: -1, dy: -.3 * Math.abs(Math.sin(g * 9)) * Math.exp(-g * 2.2) }); }
    if (t > ST1) sparkleBurst(690, 1180, 330, (t - ST1) * .8, 'st1burst', 12, ['#FFFFFF', GOLDC]);
    kesari(kx, Y, 24, ko);
    if (t > FLOWER - .3 && t < ST1 - .1) { const h = naradaHand(kx, Y, 24, ko, 1); flowerProp(h[0], h[1] - 20, 22, 'kflower', t * .3); }
    hearts((AX + KX0) / 2, 1180, t, HEART, 'khearts');
    camEnd();
    caps(t);
    wipeIn(lt, LEAFW); wipeOut(lt, dur, SLATE);
  }

  // ================= E1 · the mountain top in the rains: the Wind god sees her =================
  function shotHilltop(t, lt, dur) {
    camBegin(540, 1230 - lt * 5, 1.0 + .012 * lt);
    hilltop(t);
    // Vayu peeks out from behind a cloud, upper right
    const pk = backOut(seg(t, PEEK, PEEK + .45));
    if (pk > 0) {
      const tk = take(t, PEEK + .5, .5);
      vayu(830, 1330 - pk * 130, 19, { flip: true, pack: false, boilKey: 'vayu', seed: 12, eyes: t > PEEK + .5 ? 'wide' : 'normal', mouth: t > PEEK + .5 ? 'O' : 'smile', blush: t > PEEK + .5 ? .7 : 0, lookX: 1, lookY: .7, speed: 0, tail: t * 1.3, sq: tk.sq, aL: -.9, aR: -.9 });
      if (t > PEEK + .5) { boilSeed('vemote'); emote('!', 690, 1070, 36, pop(t, PEEK + .5, 6), t - PEEK - .5); }
    }
    cloudPuff(860, 1360, 230, 'peekcloud', 255, H1.rainCloudLt, H1.rainCloud);
    // Anjana, in human form, silk and garlands, walks along the top
    const wk = seg(t, E0, E2), ax = lerp(120, 520, ease(wk));
    anjana(ax, 1716, 22, { boilKey: 'anj', seed: 10, tail: false, eyes: blinkAt(t, 21.4) ? 'closed' : 'happy', mouth: 'smile', walk: (t - E0) * 2.1, hx: .4, lookX: .4, handR: [3.4, -14 + .6 * Math.sin(t * 4.2)], bendR: .7,
      armR: (u, sw) => flowerProp(0, -.9 * u, .9 * u, 'anjflower', 0, '#FFFFFF', '#F2D0D8') });
    camEnd();
    caps(t);
    wipeIn(lt, SLATE);
  }
  // ================= E2 · the wind holds her; "who dares?" =================
  function shotWind(t, lt, dur) {
    const sn = t > SNAPT;
    camBegin(540, 1240, 1.22 + .02 * lt + kick(t, SNAPT));
    hilltop(t);
    const X = 540, Y = 1716, u = 24;
    const sk = clamp((t - SWIRL) * 2.5) * (1 - ease(seg(t, E3 - .6, E3)));
    swirl(X, Y - 2 * u, 7.5 * u, 19 * u, t, sk * .55, 'swback', 3);
    const o = { boilKey: 'anj', seed: 10, tail: false, eyes: 'wide', mouth: 'O', dx: .1 * Math.sin(t * 9) * sk };
    if (t < SWIRL + .25) { o.eyes = 'happy'; o.mouth = 'smile'; }
    if (!sn && t > SWIRL + .25) { o.handL = [-2.2, -16]; o.handR = [2.2, -16]; o.bendL = o.bendR = 1; o.hx = .6 * Math.sin((t - SWIRL) * 5); o.lookX = o.hx; }
    if (sn) {
      const tk = take(t, SNAPT, .6), look = t > SNAPT + 1.3 ? -1 : 1;
      Object.assign(o, { eyes: 'angry', mouth: talk(t, SNAPT, SNAPT + 2.4, 'frown', 'open'), hx: .7 * look, lookX: look, sq: tk.sq, dy: tk.dy, handR: [4.8, -19.5 + .4 * Math.sin(t * 22)], bendR: .6, handL: [-2.6, -12.2], bendL: 1,
        emote: 'anger', emoteK: pop(t, SNAPT + .1), emoteAge: t - SNAPT });
    }
    anjana(X, Y, u, o);
    swirl(X, Y - 2 * u, 7.5 * u, 19 * u, t + .6, sk, 'swfront', 3);
    camEnd();
    caps(t);
  }
  // ================= E3 · Vayu appears: "do not fear"; the promise; FATHER NO. 2 =================
  function shotVayu(t, lt, dur) {
    const st = ease(seg(t, ST2 - .25, ST2 + .1));
    camBegin(lerp(540, 730, st), lerp(1230, 1080, st), lerp(1.0, 1.4, st) + kick(t, ST2 + .05));
    hilltop(t);
    const AX = 300, AY = 1716, au = 23, VX = 770, VY = 1210, vu = 25;
    const glad = clamp((t - WISPIN) * 2.5);
    const ao = { boilKey: 'anj', seed: 10, tail: false, hx: .7, lookX: .9, lookY: -.5, eyes: t < CALM ? 'angry' : 'normal', mouth: t < CALM ? 'frown' : 'flat', handL: [-2.6, -12.2], bendL: 1, handR: [2.6, -12.2], bendR: 1 };
    if (t > WISP) { ao.eyes = 'wide'; ao.mouth = 'O'; ao.handL = ao.handR = undefined; }
    if (glad > 0) { ao.eyes = 'happy'; ao.mouth = 'smile'; ao.blush = .8 * glad; ao.handL = [-1.1, -14.2]; ao.handR = [1.1, -14.2]; ao.htilt = .08; ao.dy = -.2 * Math.abs(Math.sin((t - WISPIN) * 7)) * Math.exp(-(t - WISPIN) * 1.6); }
    glowBehind(AX, AY - 13 * au, 12 * au, glad * (.7 + .3 * Math.sin(t * 4)), '#BFE4FF');
    anjana(AX, AY, au, ao);
    if (t > ST2) sparkleBurst(VX, VY - 5 * vu, 330, (t - ST2) * .8, 'st2burst', 12, ['#FFFFFF', '#9ED4FF']);
    // Vayu, out of the swirl
    const vk = pop(t, VPOP, 3);
    if (t > VPOP) {
      const say1 = t > E3 + .3 && t < E3 + 3.2, say2 = t > WISP - .5 && t < WISP + 1.2, g2 = t - ST2;
      const vo = { flip: true, pack: false, boilKey: 'vayu', seed: 12, eyes: 'normal', mouth: say1 || say2 ? talk(t, 0, 99, 'smile', 'open') : 'smile', lookX: 1, lookY: .5, speed: 0, tail: t * 1.3,
        dy: -.25 * Math.sin(t * 1.8), aL: say1 ? .2 + .25 * Math.sin(t * 6) : -.6, aR: say1 ? .2 - .25 * Math.sin(t * 6) : -.6, glowK: .5 };
      if (t > WISP - .2 && t < WISPIN) { vo.eyes = 'closed'; vo.aR = 1.2; }
      if (t > WISPIN) { vo.eyes = 'happy'; vo.mouth = 'grin'; }
      if (g2 > -.1) Object.assign(vo, { eyes: 'happy', mouth: 'grin', lookX: 0, lookY: 0, aL: 1.1, aR: 1.1 + .3 * Math.sin(t * 14), blush: .5, dy: -.5 * Math.abs(Math.sin(g2 * 9)) * Math.exp(-g2 * 2) });
      vayu(VX, VY, vu * (.4 + .6 * vk), vo);
    }
    poof(VX, VY - 4 * vu, 300, (t - VPOP) / .7, 'vpoof', ['#FFFFFF', '#CFE4F6']);
    if (t < VPOP + .5) swirl(VX, VY + 3 * vu, 6 * vu, 12 * vu, t, 1 - clamp((t - VPOP) * 2), 'vswirl', 3);
    // the son he promises: a wisp of wind from his brow to her
    if (t > WISP && t < WISPIN + .8) {
      const from = [VX - 1 * vu, VY - 9 * vu], to = [AX, AY - 12 * au], k = clamp((t - WISP) / (WISPIN - WISP));
      if (k < 1) { const p = arcPt(from, to, 260, ease(k)); orb(p[0], p[1] + 14 * Math.sin(t * 9), 26, '#9ED4FF', t, 'wisp');
        boilSeed('wisptrail'); for (let i = 1; i < 6; i++) { const q = arcPt(from, to, 260, ease(clamp(k - i * .035))); paint(ellPts(q[0], q[1], 9 - i, 9 - i, 8), { wash: '#DFF2FF', washOp: 220 - i * 34, ink: null }); } }
      else sparkleBurst(to[0], to[1], 190, t - WISPIN, 'wispburst', 12, ['#FFFFFF', '#9ED4FF']);
    }
    camEnd();
    caps(t);
    wipeOut(lt, dur, NIGHT);
  }

  // ================= F1–F2 · Kailash: the Shiva Purana; Shiva sends his own energy =================
  const SX = 540, SY = 1690, SU = 30;
  function shotShiva(t, lt, dur) {
    camBegin(540, 1200 - lt * 3, 1.0 + .012 * lt);
    kailashNight(t);
    const open = t > OPEN, orbK = clamp((t - ORB) / .7), off = ease(seg(t, ORBOFF, F3 - .1));
    const o = { boilKey: 'shiva', seed: 20, eyes: open ? (t > ORB ? 'happy' : 'normal') : 'closed', mouth: open ? 'smile' : null, ganga: 1, moonWob: .05 * Math.sin(t * 1.4), snakeEyes: open ? 'open' : 'closed', snakeUp: open ? .5 : 0 };
    if (t > ORB - .3) { const k = ease(seg(t, ORB - .3, ORB + .3)); o.handL = [lerp(-5.6, -2.2, k), lerp(-3.6, -7.4, k)]; o.handR = [lerp(5.6, 2.2, k), lerp(-3.6, -7.4, k)]; o.mudra = false; o.lookY = -.6 * off; }
    glowBehind(SX, SY - 11 * SU, 13 * SU, clamp((t - OPEN) * 1.5) * .6, '#FFE9B0');
    shiva(SX, SY, SU, o);
    if (orbK > 0) {
      const p0 = [SX, SY - 8.6 * SU], p = [lerp(p0[0], 1250, off * off), p0[1] - 60 * ease(orbK) - 900 * off];
      orb(p[0], p[1] + 10 * Math.sin(t * 5), 44 * backOut(orbK), '#FFD86A', t, 'shivaorb');
      if (t < ORB + .8) sparkleBurst(p0[0], p0[1], 240, t - ORB, 'orbburst', 12, ['#FFFFFF', '#FFD86A']);
    }
    camEnd();
    caps(t);
    wipeIn(lt, NIGHT);
    wipeOut(lt, dur, ['#F2A07A', '#7A6AAE']);
  }

  // ================= F3 · seven sages carry it on a leaf =================
  function shotSages(t, lt, dur) {
    const drift = lerp(-40, 40, lt / dur);
    camBegin(540, 1400, 1.2 + .01 * lt);
    ridge(t, (t - F3) * 260);
    const Y = 1700, u = 10.5, hands = [];
    const trip = i => i === 3 && t > TRIP && t < TRIP + .9 ? Math.sin(clamp((t - TRIP) / .9) * Math.PI) : 0;
    for (let i = 0; i < 7; i++) {
      const x = 156 + i * 128 + drift, tr = trip(i), gasp = t > TRIP + .1 && t < TRIP + 1.3;
      const o = { boilKey: 'sage' + i, seed: 30 + i, walk: (t - F3) * 2.4 + i * .9, flip: false, hx: .5, eyes: tr > 0 ? 'squeeze' : gasp ? 'wide' : i % 3 === 1 ? 'closed' : 'normal', mouth: tr > 0 || gasp ? 'O' : 'smile', lookY: gasp ? -.8 : -.3,
        handL: [-2.4, -25.2 + tr * 4], handR: [2.4, -25.4 + tr * 4], bendL: .5, bendR: .5, dy: .08 * Math.sin((t - F3) * 9.6 + i * 1.8) + tr * 1.6, rot: tr * .22, sweat: gasp && i !== 3 };
      rishi(x, Y, u, i % 3, o);
      const hl = naradaHand(x, Y, u, o, -1), hr = naradaHand(x, Y, u, o, 1);
      hands.push([(hl[0] + hr[0]) / 2, Math.min(hl[1], hr[1]) - 8]);
    }
    // the leaf lies along their hands; the orb rides its middle (and hops when one of them trips)
    boilSeed('sageleaf');
    const top = hands.map(([x, y]) => [x, y - 14]), bot = hands.map(([x, y]) => [x, y + 12]).reverse();
    paint([[hands[0][0] - 70, hands[0][1]], ...top, [hands[6][0] + 80, hands[6][1] - 4], ...bot], { wash: H1.leaf, fill: H1.leafDk, fillOp: 50, tex: .5, ink: H1.ink, sw: 1.1, curv: .35 });
    inkLine([[hands[0][0] - 60, hands[0][1]], ...hands, [hands[6][0] + 70, hands[6][1] - 4]], 1.6, H1.leafLt, 'inkfine', .4);
    const hop = t > TRIP + .15 && t < TRIP + 1.05 ? Math.sin((t - TRIP - .15) / .9 * Math.PI) * 190 : 0;
    const ox = hands[3][0] + 10 * Math.sin(t * 3), oy = hands[3][1] - 46 - hop - 6 * Math.abs(Math.sin(t * 4.8));
    orb(ox, oy, 46, '#FFD86A', t, 'leaforb', true);
    if (t > TRIP + 1.05) sparkleBurst(ox, oy + 20, 120, t - TRIP - 1.05, 'orbland', 8, ['#FFFFFF', '#FFD86A']);
    if (t > TRIP && t < TRIP + 1.2) { boilSeed('tripemote'); emote('!!', hands[3][0] + 80, hands[3][1] - 250, 40, pop(t, TRIP + .1, 6), t - TRIP); }
    camEnd();
    caps(t);
    wipeIn(lt, ['#F2A07A', '#7A6AAE']);
    wipeOut(lt, dur, LEAFW);
  }

  // ================= F4 · they pour it into Anjana's ear =================
  function shotEar(t, lt, dur) {
    camBegin(560, 1240, 1.22 + .02 * lt);
    forestHill(t, 'fh', .15);
    const AX = 430, Y = 1790, au = 24, RX = 810, ru = 22;
    const lit = clamp((t - LIT) * 2.5), tilt = ease(seg(t, POUR - .5, POUR));
    const ao = { boilKey: 'anj', seed: 10, pray: 1, eyes: 'closed', mouth: 'smile', tailSway: t * 1.2 };
    if (t > POUR + .3 && t < LIT + .5) { ao.eyes = ['closed', 'wide']; ao.mouth = 'O'; ao.htilt = .12; ao.dx = .06 * Math.sin(t * 40); }   // it tickles
    if (t > LIT + .5) { const g = t - LIT - .5; ao.eyes = 'happy'; ao.mouth = 'grin'; ao.blush = .8; ao.dy = -.2 * Math.abs(Math.sin(g * 7)) * Math.exp(-g * 1.5); }
    glowBehind(AX, Y - 13 * au, 12 * au, lit * (.75 + .25 * Math.sin(t * 4)), '#FFD86A');
    anjana(AX, Y, au, ao);
    const ear = [AX + 3.4 * au, Y - 19 * au];
    const ro = { boilKey: 'sage0', seed: 30, flip: true, hx: .5, eyes: t > LIT ? 'happy' : 'normal', mouth: t > LIT ? 'grin' : 'flat', lookX: 1, lookY: -.4, handR: [5.0, -24.5 - 2.4 * tilt], bendR: .5, handL: [3.6, -17.5], bendL: .6 };
    rishi(RX, Y, ru, 0, ro);
    for (let i = 1; i < 3; i++) rishi(RX + 40 + i * 110, Y + 18 * i, ru * .96, i, { boilKey: 'sage' + i, seed: 30 + i, flip: true, hx: .5, eyes: t > LIT ? 'happy' : 'wide', mouth: t > LIT ? 'grin' : 'O', lookX: 1, pray: 1 });
    const hr = naradaHand(RX, Y, ru, ro, 1);
    const at = bigLeaf(hr[0] + 30, hr[1], ear[0] + 26, ear[1] - 8 + 30 * (1 - tilt), 14, 'pourleaf', 50);
    // the light: rests in the leaf, then trickles down it into her ear
    const pk = ease(seg(t, POUR, LIT));
    if (pk < 1) { const p = at(lerp(.22, .98, pk)); orb(p[0], p[1] - 22 * (1 - pk * .5), 34 * (1 - pk * .5), '#FFD86A', t, 'pourorb', true); }
    if (pk > 0 && pk < 1) { boilSeed('pourdrops'); for (let i = 0; i < 4; i++) { const q = at(clamp(lerp(.22, .98, pk) + .06 + i * .05, 0, 1)); paint(ellPts(q[0], q[1] - 8, 6, 6, 8), { wash: '#FFF2B0', ink: null }); } }
    if (t > LIT) sparkleBurst(ear[0] - 40, ear[1], 200, t - LIT, 'earburst', 12, ['#FFFFFF', '#FFD86A']);
    camEnd();
    caps(t);
    wipeIn(lt, LEAFW);
  }
  // ================= FATHER NO. 3 =================
  function shotShivaStamp(t, lt, dur) {
    const g = t - ST3;
    camBegin(540, 1110, 1.25 + .02 * lt + kick(t, ST3 + .05));
    kailashNight(t);
    glowBehind(SX, SY - 11 * SU, 13 * SU, .6, '#FFE9B0');
    sparkleBurst(SX, SY - 12 * SU, 380, g * .8, 'st3burst', 12, ['#FFFFFF', '#FFD86A']);
    shiva(SX, SY, SU, { boilKey: 'shiva', seed: 20, eyes: 'happy', mouth: 'smile', ganga: 1.3, snakeEyes: 'happy', snakeUp: .6, handR: [5.2, -11.5], bendR: 1.2, mudra: true, dy: -.25 * Math.abs(Math.sin(g * 9)) * Math.exp(-g * 2.2), blush: .4 });
    camEnd();
    if (lt < .1) flash(1 - lt / .1, '#FFF2C8');
    caps(t);
    wipeOut(lt, dur, NIGHT);
  }

  // ================= G · the cave: Hanuman is born =================
  function shotBirth(t, lt, dur) {
    const born = t > BORN, sh = shake(t, BORN, .4, 10);
    const push_ = ease(seg(t, BORN + .2, BORN + 1.4));
    camBegin(540 + sh[0], lerp(1230, 1330, push_) + sh[1], lerp(1.0, 1.3, push_) + .01 * lt);
    const gk = born ? 1 : clamp((t - G0) / (BORN - G0)) ** 2 * (.7 + .3 * Math.sin(t * 10));
    caveSet(t, gk);
    if (born) {
      const k = pop(t, BORN, 3), X = 540, Y = 1720, u = 36 * (.3 + .7 * k);
      const o = { pose: 'sit', boilKey: 'baby', seed: 3, eyes: 'closed', mouth: 'smile', tailSway: t * 1.4, glowK: .22 };
      if (t > YAWN && t < EYES) { o.mouth = 'yawn'; o.eyes = 'squeeze'; o.handR = [2.4, -9.8]; o.handShapeR = 'fist'; o.htilt = .1; }
      if (t > EYES) { const tk = take(t, EYES, .4); o.eyes = blinkAt(t, EYES + .9) ? 'closed' : t < EYES + .7 ? 'wide' : 'sparkle'; o.mouth = t < EYES + .7 ? 'O' : 'grin'; o.sq = tk.sq; o.dy = tk.dy; o.blush = .6;
        if (t > EYES + .7) { o.handL = [-3.6, -8.6]; o.handR = [3.6, -8.6]; o.handShapeL = o.handShapeR = 'open'; } }
      balHanuman(X, Y, u, o);
      sparkleBurst(X, Y - 6 * 36, 420, (t - BORN) * .7, 'bornburst', 14, ['#FFFFFF', '#FFD86A']);
      if (t > EYES + .7) hearts(X, Y - 15 * 36, t, EYES + .8, 'bornhearts');
    }
    camEnd();
    if (born && t < BORN + .2) flash((1 - (t - BORN) / .2) * .9, '#FFF6D0');
    caps(t);
    wipeIn(lt, NIGHT);
    wipeOut(lt, dur, GOLD);
  }

  // ================= H · which father is the real one? ALL THREE; the Chalisa =================
  function shotFamily(t, lt, dur) {
    const all = t > ALL, g = t - ALL;
    camBegin(540, 1290, .94 + .008 * lt + kick(t, ALL));
    forestHill(t, 'fh', .2);
    const nl = LOOKS.filter(q => t > q).length, nm = NAMES.filter(q => t > q).length;
    const lit = i => t > CH0 && nm - 1 === i ? clamp((t - NAMES[i]) * 4) : 0;         // 0 Shiva, 1 Kesari, 2 Vayu
    const hopN = i => t > NAMES[i] ? -.5 * Math.abs(Math.sin((t - NAMES[i]) * 9)) * Math.exp(-(t - NAMES[i]) * 2.4) : 0;
    const joy = all ? -.3 * Math.abs(Math.sin(g * 8)) * Math.exp(-g * 1.4) : 0;
    // Shiva, up on the left in a soft light
    const SHX = 165, SHY = 1330, shu = 14.5;
    glowBehind(SHX, SHY - 10 * shu, 13 * shu, .45 + .5 * lit(0), '#FFE9B0');
    cloudPuff(SHX, SHY + 14, 210, 'shcloud', 240, '#FFFFFF', '#E2DCF2');
    shiva(SHX, SHY, shu, { boilKey: 'shiva', seed: 20, eyes: all ? 'happy' : 'normal', mouth: 'smile', ganga: 1, lookX: .7, lookY: .6, handR: [5.2, -11.5], bendR: 1.2, noShadow: true, dy: joy + hopN(0) });
    // Vayu, up on the right
    const VX = 885, VY = 1240, vu = 17;
    glowBehind(VX, VY - 5 * vu, 11 * vu, lit(2), '#BFE4FF');
    vayu(VX, VY, vu, { flip: true, pack: false, boilKey: 'vayu', seed: 12, eyes: all ? 'happy' : 'normal', mouth: all ? 'grin' : 'smile', lookX: .8, lookY: .7, speed: 0, tail: t * 1.3, dy: -.25 * Math.sin(t * 1.8) + joy + hopN(2), aL: all ? 1.0 : -.6, aR: all ? 1.0 + .3 * Math.sin(t * 12) : -.6 });
    // Maa Anjana and Kesari
    const Y = 1800;
    anjana(300, Y, 18, { boilKey: 'anj', seed: 10, eyes: 'happy', mouth: 'smile', hx: .6, lookX: .8, lookY: .5, blush: .5, tailSway: t * 1.6, handL: [-1.1, -14.4], handR: [1.1, -14.4], dy: joy * .6 });
    glowBehind(830, Y - 14 * 18, 11 * 18, lit(1), '#FFD86A');
    kesari(830, Y, 18, { boilKey: 'kes', seed: 11, flip: true, eyes: all ? 'happy' : 'normal', mouth: all ? 'grin' : 'smile', hx: .5, lookX: .8, lookY: .5, tailSway: t * 1.5, puff: lit(1) * .8, dy: joy + hopN(1),
      handL: all ? [-4.4, -22 + .5 * Math.sin(t * 10)] : undefined, bendL: .6 });
    // the baby in the middle, looking from one to the next
    const BX = 545, BY = 1830, bu = 30;
    const o = { pose: 'sit', boilKey: 'baby', seed: 3, eyes: 'normal', mouth: 'cat', tailSway: t * 1.6 };
    const AT = [[1, -.2], [.9, -.8], [-.9, -.8]];   // Kesari, Vayu, Shiva
    if (!all && nl > 0) { const a = AT[nl - 1]; o.lookX = a[0]; o.lookY = a[1]; o.hx = a[0] * .7; o.eyes = 'wide'; o.mouth = 'O'; }
    if (!all && t > LOOKS[2] + .6) { o.hx = 0; o.lookX = 0; o.lookY = 0; o.htilt = .14; o.eyes = 'normal'; o.mouth = 'pout'; o.emote = '?'; o.emoteK = pop(t, LOOKS[2] + .6, 6); o.emoteAge = t - LOOKS[2] - .6; }
    if (all) { o.eyes = t > CH0 && nm > 0 && t < NAMES[nm - 1] + .9 ? 'sparkle' : 'happy'; o.mouth = 'grin'; o.blush = .7; o.handL = [-3.4, -9.6 + .4 * Math.sin(t * 9)]; o.handR = [3.4, -9.6 - .4 * Math.sin(t * 9)]; o.handShapeL = o.handShapeR = 'open'; o.dy = joy * 1.3;
      if (t > CH0 && nm > 0) { const a = [[-.9, -.8], [1, -.2], [.9, -.8]][nm - 1], back = t > NAMES[nm - 1] + .9; if (!back) { o.lookX = a[0]; o.lookY = a[1]; o.hx = a[0] * .6; } } }
    balHanuman(BX, BY, bu, o);
    if (all) { hearts(BX, BY - 15 * bu, t, ALL + .2, 'allhearts', 3); sparkleBurst(540, 1300, 520, g * .7, 'allburst', 16, ['#FFFFFF', GOLDC]); }
    camEnd();
    caps(t);
    wipeIn(lt, GOLD);
    wipeOut(lt, dur, PEACH);
  }

  // ================= I · the ask =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1010, 1.0 + .01 * lt);
    warmBack(t, 'wbA', 540, 1150);
    const [X, Y, u, o] = hookBaby(t);
    const g = t - I0;
    o.eyes = blinkAt(t, 79.4) ? 'closed' : g > 1.2 ? 'happy' : 'normal'; o.mouth = g > 1.2 ? 'grin' : 'smile'; o.blush = .6; o.htilt = .1 * Math.sin(g * 1.6);
    o.handL = [-3.6, -6.4]; o.handR = [3.6, -6.4 + .5 * Math.sin(g * 6)]; o.handShapeL = o.handShapeR = 'open'; o.bendL = o.bendR = 1;
    o.dy = -.1 * Math.abs(Math.sin(g * 5));
    balHanuman(X, Y, u, o);
    [[250, 950], [540, 800], [830, 950]].forEach((p, i) => { const a = g - .9 - i * .25; if (a > 0) { boilSeed('askh' + i); paint(heartPts(p[0], p[1] + 10 * Math.sin(t * 3 + i), 30 * backOut(clamp(a * 4))), { wash: ['#FFD86A', '#F2557A', '#9ED4FF'][i], ink: HSK.ink, sw: 1 }); } });
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
  }
  // ================= J · next: the 8 superpowers =================
  function shotNext(t, lt, dur) {
    camBegin(540, 1010, 1.0 + .012 * lt);
    warmBack(t, 'wbJ', 540, 1150);
    const X = 540, Y = 1560, u = 44, g = t - J0;
    const COLS = ['#FFD24A', '#7EC8F2', '#F2645A', '#FFFFFF', '#B48AF2', '#8EE28A', '#FF9A4A', '#F28AC8'];
    const o = { pose: 'stand', boilKey: 'baby', seed: 3, eyes: g > .9 ? 'sparkle' : 'wide', mouth: g > .9 ? 'grin' : 'O', glowK: clamp(g * .5), lookY: -.5, tailSway: t * 1.8,
      handL: [-3.6, -10.6], handR: [3.6, -10.6], handShapeL: 'fist', handShapeR: 'fist', bendL: -1, bendR: -1, dy: -.2 * Math.abs(Math.sin(g * 6)) };
    const c = bhBelly(X, Y, u, o);
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + g * 1.5; if (Math.sin(a) < 0) orb(c[0] + Math.cos(a) * 370 * pop(t, J0 + i * .06, 3), c[1] - 120 + Math.sin(a) * 100, 58, COLS[i], t, 'nb' + i, true); }
    balHanuman(X, Y, u, o);
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + g * 1.5; if (Math.sin(a) >= 0) orb(c[0] + Math.cos(a) * 370 * pop(t, J0 + i * .06, 3), c[1] - 120 + Math.sin(a) * 100, 58, COLS[i], t, 'nb' + i, true); }
    camEnd();
    caps(t);
  }
  function shotCard(t, lt, dur) { hsCard(t, CARDC); }

  shots([[0, shotHook], [B0, shotHeaven], [C0, shotCurse], [FALL0, shotFall], [LAND0, shotLand], [D0, shotKesari], [E0, shotHilltop], [E2, shotWind], [E3, shotVayu],
    [F0, shotShiva], [F3, shotSages], [F4, shotEar], [ST3, shotShivaStamp], [G0, shotBirth], [H0, shotFamily], [I0, shotAsk], [J0, shotNext], [CARD, shotCard]]);
})();
