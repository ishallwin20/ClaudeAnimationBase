// shani2.js: "Shani Dev's MOTHER was a SHADOW." (Shani series Part 2, ad 23, ~93 s, captions in Bangers, SFX, no
// voiceover). The Markandeya Purana's telling (chs. 77, 103; Vishnu Purana 3.2): Sanjna can't bear Surya's blaze, makes
// Chhaya from her own shadow to take her place and never tell, and leaves; the shadow bears Surya three children, one of
// them Shani; she loves her own more, Yama raises his foot at her, she curses it; Surya sees the truth, has his blaze
// trimmed and goes to bring Sanjna home. Shanaishchara, the slow walker; Sade Sati; the Navagraha Stotra's "born of
// Chhaya and the Sun". STORYBOARD.md has the plan and the sources; the sets, palettes and props are in shani2_props.js.
// All times are video time (t); tools/shani2_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/shani2_sfx.mjs)
  const EYES = 1.4, BABYEYES = 2.3, B0 = 3.6, SHH = 5.2, C0 = 7.0;
  const CLOSE = 8.8, D0 = 10.8;
  const PEEL = 12.4, SHH2 = 16.2, NOD = 16.8, LEAVE = 18.0, E0 = 20.8;
  const KID1 = 22.4, KID2 = 22.9, KID3 = 23.4, SHANI_HI = 24.7, F0 = 28.2;
  const PAT = 30.0, SHRUG = 32.4, FUME = 33.6, G0 = 35.6;
  const FOOT = 37.2, TURN = 37.8, CURSE = 39.2, HOP = 39.6, H0 = 42.6;
  const MED = 45.2, SEE = 46.2, CONFESS = 47.8, I0 = 50.0;
  const SPIN = 50.8, DONE = 53.6, FLY = 54.8, J0 = 56.6, K0 = 60.2;
  const TILT = 66.8, SIGNS = 70.1, L0 = 73.2;
  const GLANCE = 75.4, SMILE = 76.2, PRAY = 78.6, M0 = 81.6, CARD = 85.6;
  const CAP_T = CARD + .1, COVERS = CARD + .4, PRICE = CARD + 1.2, STRIKE = CARD + 1.7, DEAD = CARD + 2.2, PILL = CARD + 2.7, SUB = CARD + 3.2, FOLLOW = CARD + 3.7;
  const CARDC = { cap: CAP_T, covers: COVERS, price: PRICE, strike: STRIKE, dead: DEAD, pill: PILL, sub: SUB, follow: FOLLOW, logo: CAP_T - .1 };

  const GOLDC = '#F5C542';
  // emotions() for the cast: drops the body colours it cross-fades (they're Clawd's) and adds the current key's name
  const act = (t, keys, o) => { const k = emotions(t, keys, o); let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++; delete k.col; delete k.dk; delete k.lt; delete k.tint; delete k.tintK; k.name = keys[i][1]; return k; };
  const fl = (name, t, o) => { const k = feel(name, t, o); delete k.col; delete k.dk; delete k.lt; delete k.tint; delete k.tintK; return k; };
  const camK = (t, keys, sh = [0, 0]) => { const c = kf(t, keys, ease); camBegin(c[0] + sh[0], c[1] + sh[1], c[2]); return c; };
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const GOLD = [SP2.wallDk, SP2.wall], DUSK = [SP2.duskDk, SP2.dusk], SUN = [SP2.hallDk, SP2.hall], FORGE = [SP2.forgeDk, SP2.forgeGlow], NIGHT = [SP2.nightDk, SP2.nightLt], PEACH = [TK.marigold, TK.petal];

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ["SHANI DEV'S MOTHER", 470, -1, B0 + 1 - .1, 84], ['WAS A SHADOW.', 595, -1, B0 + 1 - .1, 132, GOLDC],
    ['NOT A METAPHOR:', 470, B0 + .1, C0 - B0 - .2, 80], ["IT'S IN THE MARKANDEYA PURANA.", 575, B0 + .4, C0 - B0 - .5, 58, GOLDC],
    ["SURYA'S WIFE, SANJNA,", 470, C0 + .1, D0 - C0 - .2, 76], ["COULDN'T BEAR HIS BLAZE.", 575, C0 + .4, D0 - C0 - .5, 72, GOLDC],
    ['SO SHE MADE A WOMAN', 460, D0 + .1, 3.5, 72], ['FROM HER OWN SHADOW.', 560, D0 + .4, 3.2, 82, GOLDC],
    ['"TAKE MY PLACE', 460, D0 + 3.7, 3.4, 80], ['AND NEVER TELL HIM."', 565, D0 + 4.0, 3.1, 80, GOLDC],
    ['AND SHE LEFT.', 500, LEAVE, E0 - LEAVE - .1, 104],
    ['SURYA NEVER NOTICED.', 450, E0 + .1, 3.7, 70], ['THE SHADOW BORE HIM', 545, E0 + .5, 3.3, 66], ['THREE CHILDREN.', 645, E0 + .9, 2.9, 88, GOLDC],
    ['ONE OF THEM', 470, SHANI_HI, F0 - SHANI_HI - .1, 80], ['WAS SHANI DEV.', 590, SHANI_HI + .4, F0 - SHANI_HI - .5, 120, GOLDC],
    ['BUT SHE LOVED HER OWN', 460, F0 + .1, 3.9, 72], ['CHILDREN MORE.', 565, F0 + .5, 3.5, 100, GOLDC],
    ['MANU PUT UP WITH IT.', 460, SHRUG - .1, G0 - SHRUG, 74], ['YAMA DID NOT.', 570, FUME - .4, G0 - FUME + .3, 104, GOLDC],
    ['YAMA RAISED HIS FOOT', 460, G0 + .1, 3.3, 76], ['AT HER.', 570, FOOT, G0 + 3.4 - FOOT, 110, GOLDC],
    ['SHE CURSED IT', 460, CURSE - .1, H0 - CURSE, 84], ['TO FALL OFF!', 575, CURSE + .3, H0 - CURSE - .4, 120, GOLDC],
    ['A MOTHER CURSING HER OWN SON?', 460, H0 + .1, 3.4, 58], ['SURYA SAW THE TRUTH.', 560, SEE - .9, 1.0 + .9 - .1, 82, GOLDC],
    ['AFRAID OF HIS CURSE,', 460, SEE, I0 - SEE - .1, 74], ['THE SHADOW CONFESSED.', 560, CONFESS - .3, I0 - CONFESS + .2, 80, GOLDC],
    ['SURYA HAD HIS BLAZE', 460, I0 + .1, 3.4, 78], ['TRIMMED DOWN...', 570, I0 + .5, 3.0, 100, GOLDC],
    ['...AND WENT TO BRING', 460, DONE, J0 - DONE - .1, 76], ['SANJNA HOME.', 570, DONE + .4, J0 - DONE - .5, 110, GOLDC],
    ["AND THE SHADOW'S SON?", 500, J0 + .1, K0 - J0 - .2, 92, GOLDC],
    ['HE BECAME A GRAHA:', 460, K0 + .1, 3.2, 80], ['SHANAISHCHARA.', 575, K0 + .5, 2.8, 112, GOLDC],
    ['IT MEANS "THE ONE', 460, K0 + 3.4, 3.2, 80], ['WHO MOVES SLOWLY."', 565, K0 + 3.7, 2.9, 88, GOLDC],
    ['SATURN IS THE SLOWEST:', 460, TILT + .1, 3.1, 72], ['30 YEARS AROUND THE SUN.', 560, TILT + .5, 2.7, 72, GOLDC],
    ["THAT'S WHY SADE SATI", 460, SIGNS, L0 - SIGNS - .1, 76], ['LASTS 7.5 YEARS.', 570, SIGNS + .4, L0 - SIGNS - .5, 100, GOLDC],
    ['THE NAVAGRAHA STOTRA', 460, L0 + .1, 3.2, 74], ['STILL SAYS IT:', 560, L0 + .4, 2.9, 84],
    ['"CHHAYA-MARTANDA-SAMBHUTAM"', 450, L0 + 3.4, M0 - L0 - 3.5, 60, GOLDC], ['BORN OF THE SHADOW', 545, L0 + 3.8, M0 - L0 - 3.9, 76], ['AND THE SUN.', 645, L0 + 4.2, M0 - L0 - 4.3, 96, GOLDC],
    ['HIS SISTERS ARE RIVERS:', 450, M0 + .1, CARD - M0 - .2, 70], ['THE TAPTI AND THE YAMUNA.', 545, M0 + .4, CARD - M0 - .5, 66, GOLDC], ['LIVE BY ONE? COMMENT YOUR CITY!', 645, M0 + .8, CARD - M0 - .9, 56],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // ================= A + B · the hook: a mother's shadow on a sunlit wall; her eyes open; "shh" =================
  function shotWall(t, lt, dur) {
    camBegin(545, 1150 - 25 * ease(seg(t, B0, C0)), 1.0 + .01 * t - .04 * ease(seg(t, B0, C0)));
    goldWall(t, 0);
    const open = t > EYES && !(t > EYES + 1.15 && t < EYES + 1.3), sh = ease(seg(t, SHH - .35, SHH));
    const o = { boilKey: 'hook', bundle: 1, babyEyes: ease(seg(t, BABYEYES, BABYEYES + .3)), eyes: open ? 'normal' : 'closed', lookX: t > SHH - .6 ? .15 : 0,
      dy: -.06 * Math.sin(t * 1.6), htilt: -.05 + .03 * Math.sin(t * .9) };
    if (sh > 0) { o.handL = [lerp(-.4, -.55, sh), lerp(-13.2, -18.6, sh)]; o.bendL = lerp(1.4, .5, sh); }
    shadowWoman(560, 1690, 33, o);
    if (t > EYES - .05 && t < EYES + .6) sparkleBurst(560, 1690 - 20.1 * 33, 60, t - EYES, 'eyespark', 6, ['#FFFFFF', SP2.shadowEye]);
    camEnd();
    caps(t);
    wipeOut(lt, dur, SUN);
  }

  // ================= C · Surya's blaze; Sanjna can't bear it =================
  function shotBlaze(t, lt, dur) {
    camBegin(545, 1170, 1.02 + .008 * lt);
    palace(t);
    const blaze = .85 + .15 * Math.sin(t * 5) + .35 * ease(seg(t, CLOSE - .3, CLOSE)) * (1 - seg(t, CLOSE + .8, CLOSE + 1.6));
    surya(300, 1480, 23, { ...fl('happy', t), boilKey: 'suryaC', eyes: 'happy', mouth: 'grin', haloGlow: blaze, hx: .3, seed: 1 });
    // heat shimmer from him towards her
    boilSeed('heat');
    for (let i = 0; i < 4; i++) { const k = frac(t * .6 + i * .25), x = lerp(450, 690, k); inkLine([[x, 1000 + i * 70], [x + 16, 1030 + i * 70], [x, 1060 + i * 70]], 4 * (1 - k), '#FFD27A', 'ink', .6); }
    const cl = t > CLOSE, sm = act(t, [[0, 'nervous'], [CLOSE, 'scared']], { take: .5 });
    const so = { ...sm, rot: 0, boilKey: 'sanjnaC', pal: SANJNA, flip: true, eyes: cl ? 'squeeze' : ['squeeze', 'normal'], mouth: cl ? 'wobble' : 'flat',
      hx: cl ? -.6 * ease(seg(t, CLOSE, CLOSE + .3)) : .2, handR: [lerp(1.6, 2.4, ease(seg(t, CLOSE, CLOSE + .3))), -20.6], bendR: .7, emote: 'sweat', emoteK: clamp((t - C0 - .4) * 3), emoteAge: t,
      dx: cl ? .25 * ease(seg(t, CLOSE, CLOSE + .3)) : 0 };
    parvati(790, 1480, 23, so);
    camEnd();
    caps(t);
    wipeIn(lt, SUN);
    wipeOut(lt, dur, DUSK);
  }

  // ================= D · she makes a woman from her own shadow; "never tell him"; she leaves =================
  const SX = 680, SGY = 1560, SU = 23, CX = 330;
  function shotPeel(t, lt, dur) {
    camBegin(545, 1180, 1.02);
    chamber(t, 960);
    // the shadow: on the wall behind, then it peels off and steps down; a violet puff and it's Chhaya, in colour
    const peel = seg(t, PEEL, PEEL + 1.1), born = t > PEEL + 1.1;
    const gesture = ease(seg(t, PEEL - .7, PEEL - .3)) * (1 - ease(seg(t, PEEL + 1.4, PEEL + 1.8)));
    const sm = act(t, [[0, 'thinking'], [PEEL - .7, 'determined'], [PEEL + 1.2, 'surprised'], [PEEL + 2, 'neutral'], [SHH2 - .3, 'determined'], [LEAVE + .8, 'sad']], { take: .5 });
    if (!born) {
      const sx = lerp(CX - 10, CX, ease(peel)), su = lerp(26, SU, ease(peel));
      shadowWoman(sx, SGY - 6 * (1 - ease(peel)), su, { boilKey: 'wallshadow', sq: .08 * Math.sin(peel * Math.PI * 3) * (peel > 0 ? 1 : 0), rot: -.05 * (1 - ease(peel)) + .06 * Math.sin(peel * Math.PI) });
    }
    vanishPuff(CX, SGY - 13 * SU, 230, t - PEEL - 1.1, 'peelpuff', ['#D9C4FF', '#9A8AC4']);
    if (born) {
      const cm = act(t, [[0, 'surprised'], [PEEL + 1.8, 'neutral'], [NOD, 'happy'], [LEAVE + .6, 'sad']], { take: .6 });
      const shh = ease(seg(t, NOD - .3, NOD)) * (1 - ease(seg(t, LEAVE + .4, LEAVE + .8)));
      const co = { ...cm, rot: 0, boilKey: 'chhayaD', pal: CHHAYA, hx: t < LEAVE + .6 ? .5 : .5 * (1 - ease(seg(t, LEAVE + .6, LEAVE + 1))) + .4 * ease(seg(t, LEAVE + .6, LEAVE + 1)),
        lookX: t < LEAVE + .6 ? 1 : 1, eyes: cm.name === 'happy' ? 'closed' : 'normal', mouth: cm.name === 'sad' ? 'flat' : cm.name === 'surprised' ? 'O' : 'smile',
        dy: (cm.dy || 0) - .25 * Math.max(0, Math.sin((t - NOD) * 10)) * (t > NOD && t < NOD + .7 ? 1 : 0) };
      if (shh > 0) { co.handR = [lerp(3.3, .55, shh), lerp(-11.2, -18.6, shh)]; co.bendR = lerp(1, .5, shh); }
      parvati(CX, SGY, SU, co);
    }
    // Sanjna: looks at her shadow, conjures it off the wall, "shh", and walks out right, looking back once
    const walkK = seg(t, LEAVE, LEAVE + 1.9), sx = lerp(SX, 1300, easeIn(walkK)), back = ease(seg(t, LEAVE + .6, LEAVE + .9)) * (1 - ease(seg(t, LEAVE + 1.2, LEAVE + 1.5)));
    const shh2 = ease(seg(t, SHH2 - .3, SHH2)) * (1 - ease(seg(t, LEAVE - .2, LEAVE + .1)));
    const so = { ...sm, rot: 0, boilKey: 'sanjnaD', pal: SANJNA, hx: walkK > 0 ? .5 - 1.1 * back : -.55, lookX: walkK > 0 ? (back > .5 ? -1 : .6) : -1,
      eyes: sm.name === 'sad' || sm.name === 'determined' ? 'normal' : sm.eyes, mouth: sm.name === 'sad' ? 'flat' : sm.name === 'surprised' ? 'O' : 'smile', walk: walkK > 0 && walkK < 1 ? (t - LEAVE) * 1.4 : undefined };
    if (gesture > 0) { so.handL = [lerp(-3.3, -7.6, gesture), lerp(-11.2, -16, gesture)]; so.bendL = .3; }
    if (shh2 > 0) { so.handL = [lerp(-3.3, -.55, shh2), lerp(-11.2, -18.6, shh2)]; so.bendL = lerp(1, .5, shh2); }
    if (walkK < 1) parvati(sx, SGY, SU, so);
    if (gesture > .3 && t < PEEL + 1.1) {   // magic from her fingertips to the shadow
      const h = parvatiHand(sx, SGY, SU, so, -1);
      boilSeed('conjure');
      for (let i = 0; i < 6; i++) { const k = frac(t * 1.5 + i / 6), q = [lerp(h[0], CX + 40, k), lerp(h[1], SGY - 14 * SU, k) - Math.sin(k * Math.PI) * 60]; paint(starPts(q[0], q[1], 12 * (1 - k * .5), .35, 4), { wash: '#D9C4FF', ink: null }); }
    }
    camEnd();
    caps(t);
    wipeIn(lt, DUSK);
    wipeOut(lt, dur, SUN);
  }

  // ================= E · Surya never noticed; three children; one was Shani =================
  const KX = [320, 540, 760], KGY = 1610, KU = 12.5;
  function shotKids(t, lt, dur) {
    const push = ease(seg(t, SHANI_HI, SHANI_HI + .9));
    camBegin(lerp(545, 540, push), lerp(1180, 1500, push), lerp(1.02, 2.5, push));
    palace(t);
    surya(300, 1480, 21, { ...fl('love', t), boilKey: 'suryaE', eyes: 'happy', mouth: 'grin', hx: .5, haloGlow: .6, emote: 'hearts', emoteK: clamp((t - E0 - .5) * 3), emoteAge: t, seed: 2 });
    const cm = act(t, [[0, 'shy'], [KID1, 'love']], { take: .4 });
    parvati(780, 1480, 21, { ...cm, rot: 0, boilKey: 'chhayaE', pal: CHHAYA, flip: true, hx: .25, lookX: t < KID1 ? -1 : 0, lookY: t < KID1 ? 0 : .6, eyes: t < KID1 ? 'normal' : 'closed', mouth: 'smile' });
    // the children pop up in front: Savarni, Shani (middle), Tapati
    [['savarni', KID1], ['shani', KID2], ['tapati', KID3]].forEach(([n, t0], i) => {
      if (t < t0) return;
      const up = backOut(clamp((t - t0) / .4)), x = KX[i];
      vanishPuff(x, KGY - 8 * KU, 120, t - t0, 'kpuff' + i, i === 1 ? ['#C9C0E8', '#9DB8FF'] : ['#FFF3D6', '#FFE08A']);
      let o = { ...fl(i === 1 ? 'shy' : 'happy', t, { seed: i + 3 }), boilKey: 'kid' + n, sq: (1 - up) * .3, dy: (1 - up) * 3 };
      if (i === 1) {   // Shani: eyes down, then shyly up at us, a little wave, eyes down again
        const look = ease(seg(t, SHANI_HI + 1, SHANI_HI + 1.4)) * (1 - ease(seg(t, SHANI_HI + 2.6, SHANI_HI + 3)));
        o = { ...o, eyes: 'normal', lookY: lerp(.9, -.3, look), lookX: 0, blush: .3 + .4 * look, mouth: look > .5 ? 'smile' : 'flat', aR: -1.3 + 1.9 * look * (.8 + .2 * Math.sin(t * 12)), emote: undefined };
      }
      kid(n, x, KGY, KU, o);
    });
    camEnd();
    caps(t);
    wipeIn(lt, SUN);
    if (lt > dur - .25) whipH(seg(lt, dur - .25, dur), 1, t, [TK.cream, SP2.hall]);
  }

  // ================= F · lunch: she loves her own more; Manu shrugs; Yama fumes =================
  const OWN = [['savarni', 120], ['shani', 260], ['tapati', 400]], HERS = [['manu', 660], ['yama', 810], ['yami', 960]], FGY = 1590, FU = 11.5;
  const TOSS = [PAT - 1.2, PAT - .2, PAT + .8, PAT + 1.8, SHRUG - .4];
  function shotLunch(t, lt, dur) {
    camBegin(545, 1330, 1.2 + .006 * lt);
    courtyard(t);
    // Chhaya stands behind her three with a plate of laddoos, tossing them onto their plates
    const toss = TOSS.reduce((a, t0) => a + Math.max(0, Math.sin(clamp((t - t0 + .25) / .5) * Math.PI)), 0);
    const cm = act(t, [[0, 'love'], [PAT + 2.4, 'happy']], { take: .3 });
    const co = { ...cm, rot: 0, boilKey: 'chhayaF', pal: CHHAYA, hx: -.3, lookX: -1, lookY: .7, eyes: 'normal', mouth: 'smile',
      handL: [-4.6, -13.4], bendL: 1.2, handR: [lerp(3.3, 5.6, toss), lerp(-11.2, -15.5, toss)], bendR: .6 };
    parvati(250, 1450, 19, co);
    const tray = parvatiHand(250, 1450, 19, co, -1);
    boilSeed('tray');
    paint(ellPts(tray[0], tray[1] - 6, 70, 18, 16), { wash: TK.gold, ink: SP2.ink, sw: .8 });
    for (let i = 0; i < 4; i++) laddoo(tray[0] - 36 + i * 24, tray[1] - 20 - (i % 2) * 14, 13);
    // her three: plates piling up with laddoos, munching
    const landed = j => TOSS.filter((t0, i) => i % 3 === j && t > t0 + .5).length;
    OWN.forEach(([n, x], j) => {
      leafPlate(x, FGY + 25, .8, 2 + landed(j), 'plate' + n);
      const chew = t > TOSS[j] + .5 ? Math.abs(Math.sin(t * 9 + j)) : 0;
      kid(n, x, FGY, FU, { ...fl('happy', t, { seed: j }), boilKey: 'fk' + n, mouth: chew > .5 ? 'O' : 'smile', eyes: 'happy', aL: -.4 + .3 * chew, aR: .2 + .4 * chew, noShadow: true });
    });
    // flying laddoos, from the tray to a plate
    TOSS.forEach((t0, i) => {
      const k = (t - t0) / .5;
      if (k < 0 || k > 1) return;
      const to = OWN[i % 3][1], p = arcPt(tray, [to, FGY + 5], 140, k);
      laddoo(p[0], p[1], 13);
    });
    // Sanjna's three: empty plates; Manu shrugs, Yama fumes, Yami sulks
    HERS.forEach(([n, x], j) => {
      leafPlate(x, FGY + 25, .8, 0, 'plate' + n);
      let o = { boilKey: 'fk' + n, noShadow: true, eyes: 'normal', lookX: -1, lookY: .3 };
      if (n === 'manu') o = { ...o, ...act(t, [[0, 'bored'], [SHRUG, 'neutral']], { take: .4 }), lookX: t > SHRUG ? 0 : -1, aL: t > SHRUG ? lerp(-1.3, .5, ease(seg(t, SHRUG, SHRUG + .3))) : -1.3, aR: t > SHRUG ? lerp(-1.3, .5, ease(seg(t, SHRUG, SHRUG + .3))) : -1.3, mouth: t > SHRUG ? 'flat' : 'pout', dy: -.5 * Math.max(0, Math.sin(clamp((t - SHRUG) / .5) * Math.PI)) };
      if (n === 'yama') { const m = act(t, [[0, 'sad'], [FUME - 1, 'angry'], [FUME, 'furious']], { take: .5 }); o = { ...o, ...m, rot: 0, eyes: m.name === 'sad' ? 'normal' : 'angry', mouth: m.name === 'sad' ? 'frown' : 'teeth', cross: t > FUME - 1 ? 1 : 0 }; delete o.col; }
      if (n === 'yami') o = { ...o, ...fl('sad', t), mouth: 'pout' };
      delete o.col; delete o.dk; delete o.lt;
      kid(n, x, FGY, FU, o);
    });
    if (t > FUME) emote('steam', 810, FGY - 18 * FU, 22, clamp((t - FUME) * 4), t);
    camEnd();
    caps(t);
  }

  // where Yama's raised foot is (kick 0..1 swings his screen-right leg up and out; flip mirrors it)
  function kickFoot(x, y, u, kick, flip) {
    const a = -kick * 1.95, L = 2.4 * (1 + .45 * kick), rx = .1 * Math.cos(a) - L * Math.sin(a), ry = .1 * Math.sin(a) + L * Math.cos(a), fx = flip ? -1 : 1;
    return [x + fx * (1.3 + rx) * u, y + (-2.9 + ry) * u];
  }

  // ================= G · Yama raises his foot; she curses it =================
  function shotFoot(t, lt, dur) {
    const hit = t > CURSE && t < CURSE + .5;
    camK(t, [[G0, [575, 1175, 1.26]], [FOOT, [590, 1185, 1.3]], [CURSE, [580, 1190, 1.32]], [H0, [575, 1190, 1.35]]], shakeXY(t, hit ? 9 : 0));
    courtyard(t);
    // Chhaya: busy with her own (looking left), whirls round at the foot, furious, points the curse at it
    const turn = ease(seg(t, TURN, TURN + .25)), pk = ease(seg(t, CURSE - .25, CURSE)) * (1 - ease(seg(t, CURSE + 1.6, CURSE + 2)));
    const cm = act(t, [[0, 'love'], [TURN, 'surprised'], [TURN + .6, 'angry'], [CURSE - .2, 'furious'], [CURSE + 1.8, 'angry']], { take: .6 });
    const co = { ...cm, rot: 0, boilKey: 'chhayaG', pal: CHHAYA, hx: lerp(-.6, .6, turn), lookX: lerp(-1, 1, turn), lookY: t < TURN ? .5 : .4,
      eyes: ['angry', 'furious'].includes(cm.name) ? 'normal' : cm.eyes, mouth: cm.name === 'furious' ? 'open' : cm.name === 'angry' ? 'frown' : cm.name === 'surprised' ? 'O' : 'smile' };
    if (t < TURN) { co.handL = [-4.6, -13.4]; co.bendL = 1.2; }
    if (pk > 0) { co.handR = [lerp(3.3, 7.8, pk), lerp(-11.2, -10.5, pk)]; co.bendR = .2; }
    parvati(360, 1560, 24, co);
    // Yama stomps in from the right, raises his foot at her (held, wobbling); the bolt; he hops, clutching it
    const x = lerp(1180, 770, ease(seg(t, G0 + .1, FOOT - .2))), walking = t < FOOT - .2;
    const kick = t < CURSE ? ease(seg(t, FOOT, FOOT + .3)) * (1 + .06 * Math.sin(t * 9)) : t < HOP ? 1 : .55 + .1 * Math.sin(t * 13);
    const hop = t > HOP ? Math.abs(Math.sin((t - HOP) * 7)) : 0;
    const ym = act(t, [[0, 'angry'], [FOOT, 'furious'], [CURSE - .35, 'scared'], [CURSE + .1, 'cry']], { take: .6 });
    const yo = { ...ym, rot: t > HOP ? .08 * Math.sin((t - HOP) * 7) : -.12 * kick, boilKey: 'yamaG', flip: true, kick, walk: walking ? (t - G0) * 2.2 : undefined, dy: (ym.dy || 0) - 1.4 * hop,
      eyes: ym.name === 'furious' || ym.name === 'angry' ? 'angry' : ym.eyes, mouth: ym.name === 'furious' ? 'teeth' : ym.mouth, aL: t > HOP ? .3 : -.6, aR: t > HOP ? -.2 : .4 };
    delete yo.col; delete yo.dk; delete yo.lt;
    kid('yama', x, 1600, 19, yo);
    const foot = kickFoot(x, 1600 + yo.dy * 19, 19, kick, true);
    if (t > CURSE - .05) {
      bolt(parvatiHand(360, 1560, 24, co, 1), foot, (t - CURSE) / 1.0, SP2.curse, 'cursefoot');
      if (t > CURSE + .3) glow(foot[0], foot[1], 70 + 10 * Math.sin(t * 12), SP2.curseRed, .55);
    }
    camEnd();
    caps(t);
    if (lt < .25) whipH(1 - lt / .25, 1, t, [TK.cream, SP2.hall]);
    wipeOut(lt, dur, SUN);
  }

  // ================= H · a mother cursing her son? Surya sees the truth; she confesses =================
  function shotTruth(t, lt, dur) {
    const flare = t > SEE && t < SEE + .4;
    camK(t, [[H0, [545, 1180, 1.02]], [SEE, [560, 1170, 1.06]], [I0, [575, 1170, 1.1]]], shakeXY(t, flare ? 7 : 0));
    palace(t);
    const med = ease(seg(t, MED, MED + .3)) * (1 - ease(seg(t, SEE, SEE + .15))), see = ease(seg(t, SEE, SEE + .2));
    const sm = act(t, [[0, 'sad'], [MED, 'serene'], [SEE, 'surprised'], [SEE + .5, 'determined']], { take: .5 });
    const so = { ...sm, rot: 0, boilKey: 'suryaH', hx: lerp(-.4, .5, see), lookX: lerp(-1, 1, see), lookY: t < MED ? .8 : 0, pray: med,
      eyes: t < MED ? 'normal' : t < SEE ? 'closed' : 'wide', brow: t > SEE + .4 ? -.8 : 0, mouth: t < MED ? 'flat' : t < SEE ? 'smile' : 'O',
      haloGlow: t < MED ? .5 : t < SEE ? .15 : .5 + 1 * (1 - seg(t, SEE + .2, SEE + 1.2)), halo: t > MED && t < SEE ? .85 : 1 };
    surya(330, 1480, 23, so);
    flash(.5 * (1 - seg(t, SEE, SEE + .35)) * (t > SEE ? 1 : 0), '#FFF2C0');
    // Yama hops in, still clutching his foot, and sobs at his father's side
    const yx = lerp(-120, 110, ease(seg(t, H0, H0 + 1.4))), hop = Math.abs(Math.sin((t - H0) * 7)) * (t < H0 + 1.6 ? 1 : .3);
    kid('yama', yx, 1610, 12, { ...fl('cry', t), boilKey: 'yamaH', kick: .55, dy: -1.2 * hop, eyes: 'cry', mouth: 'wail', aL: .3, aR: -.2 });
    // Chhaya: trembling, finger on her lips (the secret); the finger drops; she bows her head
    const cm = act(t, [[0, 'nervous'], [SEE + .2, 'scared'], [CONFESS, 'sad']], { take: .5 });
    const shh = (1 - ease(seg(t, CONFESS, CONFESS + .3)));
    const trem = t > SEE + .2 && t < CONFESS + .2 ? .1 * Math.sin(t * 45) : 0;
    const co = { ...cm, rot: 0, boilKey: 'chhayaH', pal: CHHAYA, flip: true, hx: t > CONFESS ? .1 : .3, htilt: t > CONFESS ? .12 * ease(seg(t, CONFESS, CONFESS + .4)) : 0, dx: trem,
      eyes: t > CONFESS ? 'closed' : cm.name === 'scared' ? 'wide' : 'normal', lookX: -1, mouth: t > CONFESS ? 'frown' : 'flat', emote: t > SEE + .2 && t < CONFESS ? 'sweat' : undefined, emoteK: 1, emoteAge: t,
      handR: [lerp(.55, 3.3, 1 - shh), lerp(-18.6, -11.2, 1 - shh)], bendR: lerp(.5, 1, 1 - shh) };
    parvati(800, 1480, 23, co);
    camEnd();
    caps(t);
    wipeIn(lt, SUN);
    wipeOut(lt, dur, FORGE);
  }

  // ================= I · Vishvakarma trims his blaze on a lathe; he leaves for Sanjna =================
  function shotLathe(t, lt, dur) {
    camBegin(530, 1250, 1.22 + .01 * lt);
    forge(t);
    const spinning = t > SPIN && t < DONE, sp = (t - SPIN) * 3, LY = 1560 - 140 * .8, HP = [440 + 5.8 * 17, LY - 21.2 * 17];   // HP: where the file meets his rays
    lathe(440, 1560, .8, spinning ? sp * .8 : 0);
    const trim = ease(seg(t, SPIN + .3, DONE - .2)), gone = t > FLY;
    const sm = act(t, [[0, 'nervous'], [SPIN + .2, 'dizzy'], [DONE + .3, 'happy']], { take: .5 });
    const so = { ...sm, rot: spinning ? .05 * Math.sin(t * 20) : 0, boilKey: 'suryaI', flip: spinning ? (Math.floor(sp * 4) % 2 === 1) : false, halo: lerp(1, .6, trim), haloGlow: lerp(.9, .35, trim), rays: 16,
      eyes: sm.name === 'dizzy' ? 'swirl' : sm.name === 'happy' ? 'happy' : 'normal', mouth: sm.name === 'dizzy' ? 'wobble' : 'smile' };
    if (!gone) surya(440, LY, 17, so);
    if (spinning) { boilSeed('spinlines'); for (let i = 0; i < 4; i++) { const yy = 1100 + i * 90; inkLine([[300, yy], [250 - 30 * i, yy + 20]], 5, TK.cream, 'ink', .4); inkLine([[580, yy + 30], [630 + 30 * i, yy + 10]], 5, TK.cream, 'ink', .4); } }
    // Vishvakarma, the old craftsman, holds his file to the rays; sparks (one a tiny chakra, one a tiny trishul)
    const vo = { boilKey: 'vishva', pal: NRD_SAGE, beard: '#EDE6DC', veena: false, flip: true, hx: .3, lookX: 1, eyes: t > DONE ? 'happy' : 'normal', mouth: t > DONE ? 'smile' : 'flat', brow: -.3,
      handR: spinning ? [(680 - HP[0]) / 20 + .25 * Math.sin(t * 30), (HP[1] - 1560) / 20 + 1.6] : [3.4, -11], bendR: .5,
      armR: (u, sw) => { paint(rrPts(-.3 * u, -4.2 * u, .6 * u, 3.6 * u, .2 * u), { wash: SP2.iron, ink: SP2.ink, sw: sw * .6 }); paint(rrPts(-.4 * u, -.6 * u, .8 * u, 1.8 * u, .3 * u), { wash: SP2.wood, ink: SP2.ink, sw: sw * .6 }); } };
    if (t > FLY + 1) { vo.handR = [3.2, -24]; vo.mouth = 'grin'; }
    narada(680, 1560, 20, vo);
    if (spinning) {
      const p = HP;
      boilSeed('sparks');
      glow(p[0], p[1], 120, '#FFD27A', .5);
      for (let i = 0; i < 14; i++) {
        const k = frac(t * 1.6 + hash(i)), a = -1.2 + hash(i * 3) * 1.6, d = 40 + 380 * k;
        const q = [p[0] + Math.cos(a) * d, p[1] + Math.sin(a) * d + 260 * k * k];
        paint(starPts(q[0], q[1], 10 * (1 - k), .35, 4), { wash: i % 2 ? '#FFE08A' : '#FFF4DC', ink: null });
      }
      const ck = seg(t, SPIN + .8, SPIN + 2.2), tk = seg(t, SPIN + 1.6, SPIN + 3);
      if (ck > 0 && ck < 1) kidChakra(p[0] + 60 + 340 * ck, p[1] - 120 * Math.sin(ck * Math.PI) + 200 * ck, 16, t * 12);
      if (tk > 0 && tk < 1) kidTrishul(p[0] + 40 + 300 * tk, p[1] - 160 * Math.sin(tk * Math.PI) + 260 * tk, 1, t * 6);
    }
    // he leaves: a gold puff, and a comet streaking up and away north (up-right)
    vanishPuff(440, LY - 14 * 17, 200, t - FLY, 'flypuff');
    if (gone) {
      const k = easeIn(clamp((t - FLY) / .8)), q = [lerp(440, 1300, k), lerp(1150, 200, k)];
      boilSeed('comet');
      glow(q[0], q[1], 160, '#FFD27A', .8);
      paint(ribbon([[q[0] - 260, q[1] + 290], [q[0] - 120, q[1] + 130], q], 4, 60), { wash: '#FFE9A8', washOp: 220, ink: null });
      paint(ellPts(q[0], q[1], 40, 40, 14), { wash: '#FFF4DC', ink: null });
    }
    camEnd();
    caps(t);
    wipeIn(lt, FORGE);
  }

  // ================= J · the doorway: the shadow and her son watch him go =================
  function shotDoor(t, lt, dur) {
    camBegin(420, 1330, 1.3);
    doorway(t);
    // the gold streak crossing the sky, away from them
    const k = seg(t, J0 + .2, J0 + 1.8);
    if (k > 0 && k < 1) {
      const q = [lerp(560, 1250, k), lerp(1150, 650, k)];
      boilSeed('streak');
      glow(q[0], q[1], 120, '#FFD27A', .7);
      paint(ribbon([[q[0] - 300, q[1] + 220], [q[0] - 140, q[1] + 100], q], 3, 40), { wash: '#FFE9A8', washOp: 200, ink: null });
    }
    const look = ease(seg(t, J0 + 2, J0 + 2.4));
    const cm = act(t, [[0, 'neutral'], [J0 + 1.8, 'sad']], { take: .3 });
    parvati(220, 1600, 22, { ...cm, rot: 0, boilKey: 'chhayaJ', pal: CHHAYA, hx: lerp(.6, .2, look), lookX: lerp(1, .6, look), lookY: lerp(-.6, .8, look), eyes: 'normal', mouth: look > .5 ? 'smile' : 'flat', handR: [3.2, -10.6], bendR: 1.2 });
    // little Shani holds the edge of her saree; he steps out at the end (the cut on action)
    const step = ease(seg(t, K0 - .5, K0));
    kid('shani', 360 + 60 * step, 1620, 12.5, { ...fl('neutral', t), boilKey: 'shaniJ', eyes: 'normal', lookX: lerp(1, -1, look), lookY: lerp(-.8, -1, look), aL: step > .3 ? -1.2 : .7, mouth: 'flat', walk: step > 0 && step < 1 ? (t - K0 + .5) * 2 : undefined });
    camEnd();
    caps(t);
  }

  // ================= K · the slow walker across the night sky; Saturn's orbit; Sade Sati =================
  function shotSky(t, lt, dur) {
    const up = ease(seg(t, TILT, TILT + 1.2));
    camBegin(545, lerp(1180, -760, up), 1.02);
    starSky(t);
    saturn(860, lerp(1120, 860, ease(seg(t, K0, K0 + 3))), 95);
    // Shani walks slowly to the right, his crow on his shoulder
    const x = lerp(140, 620, clamp((t - K0) / 7)), so = { boilKey: 'shaniK', walk: (t - K0) * .7, limp: 1, down: .6, mouth: 'flat', seed: 3 };
    if (up < 1) {
      shani(x, 1560, 19, so);
      const sh = shaniLocal(x, 1560, 19, so, 2.9, -17.2);
      shaniCrow(sh[0], sh[1] - 26, 10, { look: 1 });
    }
    // the orbit: Saturn creeping round the Sun; 12 signs; three slices light up as it crosses them (Sade Sati)
    if (up > 0) {
      const a0 = Math.PI / 2, w = TAU / 12;
      const sat = t < SIGNS ? lerp(a0 - 4.5 * w, a0 - 1.5 * w, seg(t, TILT, SIGNS)) : lerp(a0 - 1.5 * w, a0 + 1.5 * w, seg(t, SIGNS, L0 - .2));
      const lit = [0, 1, 2].map(j => clamp((sat - (a0 + (j - 1.5) * w)) / (w * .25)));
      orbit(540, -660, 300, t, { signs: seg(t, SIGNS - .5, SIGNS + .1), sat, lit: t > SIGNS ? lit : null, moon: seg(t, SIGNS, SIGNS + .4), a0 });
    }
    camEnd();
    caps(t);
    wipeOut(lt, dur, GOLD);
  }

  // ================= L · the gold wall again (the rhyme): his shadow is his mother's =================
  function shotRhyme(t, lt, dur) {
    camBegin(545, 1200, 1.03 + .008 * lt);
    goldWall(t, 1);
    const SXl = 380, SYl = 1590, SUl = 23;
    const gl = ease(seg(t, GLANCE, GLANCE + .4)) * (1 - ease(seg(t, PRAY - .3, PRAY + .1)));
    const blink = t > SMILE + .8 && t < SMILE + .95;
    // her shadow on the wall: her hand on his shoulder
    const shoulder = [SXl + 3 * SUl, SYl - 16.3 * SUl], WX = 690, WY = 1610, WU = 26;
    shadowWoman(WX, WY, WU, { boilKey: 'mshadow', eyes: blink ? 'closed' : 'normal', lookX: -.6, lookY: .5, hx: -.3, htilt: -.08,
      handL: [(shoulder[0] - WX) / WU, (shoulder[1] - WY) / WU + .3], bendL: .6 });
    const so = { boilKey: 'shaniL', down: 1 - gl, lookX: gl, hx: .45 * gl, mouth: t > SMILE ? 'smile' : 'flat', lid: t > SMILE ? .25 : 0, seed: 6,
      pray: ease(seg(t, PRAY, PRAY + .4)), eyes: t > PRAY + .3 ? 'closed' : 'normal', bow: .3 * ease(seg(t, PRAY + .2, PRAY + .7)) };
    shani(SXl, SYl, SUl, so);
    camEnd();
    caps(t);
    wipeIn(lt, GOLD);
    wipeOut(lt, dur, PEACH);
  }

  // ================= M · the ask: his sisters are rivers =================
  function shotRivers(t, lt, dur) {
    camBegin(540, 1330, 1.3);
    rivers(t);
    const w = Math.sin(t * 7);
    kid('tapati', 330, 1450, 11, { ...fl('happy', t, { seed: 1 }), boilKey: 'tapM', aR: 1.1 + .35 * w, aL: -1.2 });
    kid('yami', 760, 1450, 11, { ...fl('happy', t + .4, { seed: 2 }), boilKey: 'yamiM', aL: 1.1 - .35 * w, aR: -1.2 });
    const sh = ease(seg(t, M0 + 1, M0 + 1.5));
    kid('shani', 545, 1560, 13, { ...fl('shy', t), boilKey: 'shaniM', eyes: 'normal', lookX: Math.sin(t * 1.2), lookY: .2, blush: .5, mouth: 'smile', aR: -1.3 + 1.6 * sh * (.85 + .15 * Math.sin(t * 10)) });
    shaniCrow(650, 1560, 8, { flap: .3 * Math.max(0, Math.sin(t * 5)), caw: Math.sin(t * 3) > .9 ? 1 : 0, look: -1, flip: true });
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, [TK.marigold, TK.rkOrange]);
  }

  // ================= N · the card =================
  function shotCard(t, lt) {
    shani2Card(t, CARDC);
    flushLetters();
    shani2Strike(t, CARDC);
    if (lt < .3) brushWipe(.5 + lt / .6, [TK.marigold, TK.rkOrange]);
  }

  shots([[0, shotWall], [C0, shotBlaze], [D0, shotPeel], [E0, shotKids], [F0, shotLunch], [G0, shotFoot], [H0, shotTruth], [I0, shotLathe], [J0, shotDoor], [K0, shotSky], [L0, shotRhyme], [M0, shotRivers], [CARD, shotCard]]);
})();
