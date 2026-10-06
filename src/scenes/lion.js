// lion.js: "Aarav had ONE job: ROAR.", a 55.9 s captioned reel and ad for Book 3 (Maa Chandraghanta), the first book
// doorway episode. Storyboard: STORYBOARD.md. Sets and props: lion_props.js. All times are video time (t); the SFX
// (tools/lion_sfx.mjs) uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/lion_sfx.mjs)
  const MEW_A = 1.15, PETAL_A = 1.3, GIGGLE_A = 1.75, DROOP = 2.3, TOMORROW = 2.6, IRIS_A = 3.9, B0 = 4.4;
  const SIGH = 4.8, PETAL_B = 5.2, TING_B = 5.9, FLY = 6.6, CATCH = 7.3, OPEN = 8.5, BEAM = 8.8, C0 = 9.4;
  const TOPPLE = 9.9, RISE1 = 10.6, FAN = 10.8, NAME = 11.0, MANE_UP = 13.2, BROW = 13.5, MEW_C = 15.0, D0 = 15.6;
  const NOISE = 15.7, RING = 16.2, TURN = 17.6, INHALE1 = 18.8, MEW_D = 19.4, PALM = 19.6, COACH = [20.4, 21.3, 22.2],
    INHALE2 = 23.8, ROAR_D = 24.4, WONDER = 25.0, LESSON = 25.6, TIE = 28.8, BELL_TIE = 29.6, EXIT = 30.4, SHUT = 30.9, E0 = 31.0;
  const CUE = 31.7, INHALE3 = 33.6, MEW_E = 34.2, GIGGLE_E = 34.5, DROOP_E = 35.0, BELL_E = 35.6, TING_E = 36.0, WINGS = 36.4,
    ECHO = 36.6, BACK = 37.6, INHALE4 = 37.8, ROAR_E = 38.5, HUSH = 40.0, CHEER = 40.4, CLAP10 = 42.4, F0 = 44.5;
  const STORY = 45.0, GLINT = 45.8, COMMENT = 47.4, IRIS = 50.2, CARD = 50.7, CARD_CAP = 50.9, COVER3 = 51.1, ROW13 = 51.8,
    PRICE = 52.2, LOGO = 52.7, PILL = 53.0, FOLLOW = 53.5;

  const GOLDC = '#F5C542', REDC = '#FF8A70';
  const bump = (t, t0, a = .1, b = .25) => seg(t, t0 - a, t0) * (1 - seg(t, t0, t0 + b));
  const L2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  const clean = e => { delete e.col; delete e.dk; delete e.lt; delete e.tint; delete e.aL; delete e.aR; return e; };
  const cEmo = (t, keys, o) => clean(emotions(t, keys, o));   // Chandraghanta keeps her own colours
  const ringOf = (t, t0, f = 24, d = 2.6) => t > t0 ? Math.sin((t - t0) * f) * Math.exp(-(t - t0) * d) : 0;
  const cgW = (x, y, u, p) => [x + p[0] * u, y + p[1] * u];       // Chandraghanta body u → world (ignores lean)
  const cgL = (x, y, u, w) => [(w[0] - x) / u, (w[1] - y) / u];   // world → her body u

  // ---- every caption in the film, in one list: [text, y, t0, life, size, colour]
  const CAPS = [
    ['Aarav had ONE job in the play:', 470, -1, 2.5 + 1, 62], ['ROAR.', 590, -1, 2.5 + 1, 150, GOLDC], ['…mew.', 735, MEW_A + .05, 2.5 - MEW_A - .05, 92, REDC],
    ['The play was TOMORROW.', 470, TOMORROW, 4.3 - TOMORROW, 64],
    ['That night, a book on his shelf…', 470, TING_B, 7.9 - TING_B, 54], ['…went TING.', 560, TING_B + .3, 7.9 - TING_B - .3, 84, GOLDC],
    ['Out stepped', 470, NAME, 13.4 - NAME, 58], ['MAA CHANDRAGHANTA', 565, NAME + .15, 13.4 - NAME - .15, 96, GOLDC],
    ['So YOU are playing', 470, BROW, D0 - BROW, 62], ['MY LION?', 575, BROW + .2, D0 - BROW - .2, 120, GOLDC],
    ["Fear can't stand", 470, NOISE, TURN - NOISE - .05, 64], ['NOISE.', 575, NOISE + .3, TURN - NOISE - .35, 120, GOLDC],
    ['Your turn.', 470, TURN, MEW_D - TURN - .05, 84],
    ['…mew.', 470, MEW_D + .05, COACH[0] - MEW_D - .1, 92, REDC],
    ['Chin UP.', 470, COACH[0], 23.7 - COACH[0], 64], ['Chest OUT.', 555, COACH[1], 23.7 - COACH[1], 64], ['Roar from your BELLY.', 640, COACH[2], 23.7 - COACH[2], 64, GOLDC],
    ["You don't roar because you're brave.", 470, LESSON, TIE - LESSON - .05, 50], ['You ROAR…', 565, LESSON + .5, TIE - LESSON - .55, 96, GOLDC], ["…and THEN you're brave.", 665, LESSON + 1.1, TIE - LESSON - 1.15, 70, GOLDC],
    ['For when you forget.', 470, TIE, 30.8 - TIE, 64],
    ['Next day. His cue:', 470, CUE, INHALE3 - CUE, 60], ['ROAR.', 580, CUE + .2, INHALE3 - CUE - .2, 140, GOLDC],
    ['…mew.', 470, MEW_E + .05, BELL_E - MEW_E - .1, 92, REDC],
    ['You ROAR…', 470, ECHO, BACK + .2 - ECHO, 110, GOLDC],
    ['The LOUDEST roar', 470, CHEER, CLAP10 - CHEER - .1, 74, GOLDC], ['in school history.', 565, CHEER + .2, CLAP10 - CHEER - .3, 62],
    ['…and ONE fan clapping', 470, CLAP10 + .05, F0 - .1 - CLAP10 - .05, 62], ['with TEN hands.', 565, CLAP10 + .25, F0 - .1 - CLAP10 - .25, 96, GOLDC],
    ['Every child has a ROAR inside.', 470, STORY, COMMENT - STORY - .1, 60], ['Some just need the right STORY.', 560, STORY + .4, COMMENT - STORY - .5, 64, GOLDC],
    ['What was YOUR role', 470, COMMENT, IRIS + .4 - COMMENT, 62], ['in the school play?', 555, COMMENT + .15, IRIS + .25 - COMMENT, 62],
    ['Tree? King? Lion?', 660, COMMENT + .35, IRIS + .05 - COMMENT, 88, GOLDC], ['Tell us below!', 760, COMMENT + .55, IRIS - .15 - COMMENT, 52],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // ---- Aarav in costume: the tail and mane behind him, the ears on his head. c.mane / c.tail: options, or null
  function kid(x, y, u, o, c = {}) {
    let tip = null;
    const head = aaravHead(x, y, u, o);
    if (c.tail) { const up = o.pose === 'sit' || o.pose === 'sleep' ? 5.8 : 0, an = aaravWorld(x, y, u, o, 1.95, -6.7 + up); tip = tail(an[0], an[1], u, { dir: 1, key: 'tail' + (c.key || ''), ...c.tail }); }
    if (c.mane) mane(head[0], head[1], u, { key: 'mane' + (c.key || ''), ...c.mane });
    aarav(x, y, u, { ...o, hat: c.mane ? maneEars(c.mane) : o.hat });
    return { head, tip };
  }
  // the demon kid's palette
  const DEMON = { tee: '#7A4AA8', teeDk: '#5A3080', cuff: '#2E2436', shorts: '#3A3A3A', shortsDk: '#262626', skin: '#B97A55', skinDk: '#94593A', skinLt: '#D69B72' };

  // =============== A · the rehearsal ===============
  function shotA(t) {
    const X = 540, Y = 1720, u = 40;
    camBegin(540, 990, 1.35 + .02 * t);
    stageSet(t, { spot: [X, Y - 20, 330], floorY: 1700 });
    const inh = t < MEW_A ? lerp(.35, 1, easeOut(seg(t, 0, MEW_A - .1))) : lerp(1, .1, easeOut(seg(t, MEW_A, MEW_A + .3)));
    const droop = ease(seg(t, DROOP, DROOP + .5)), gig = t > GIGGLE_A && t < DROOP + .2, tk = take(t, MEW_A, .5);
    const claw = [-4.4, -14.0 - inh * 1.4];
    const o = {
      inhale: inh, sq: tk.sq, dy: tk.dy, boilKey: 'ka',
      eyes: t < MEW_A - .3 ? 'normal' : t < MEW_A ? 'squeeze' : t < DROOP ? 'wide' : 'sad',
      brows: t < MEW_A ? -.6 : t < DROOP ? .9 : 0, worry: droop, mouth: t < MEW_A ? 'puff' : t < DROOP ? 'mew' : 'frown',
      blush: .9 * seg(t, GIGGLE_A, GIGGLE_A + .3), lookX: gig ? (Math.sin((t - GIGGLE_A) * 10) > 0 ? .9 : -.9) : .55 * ease(seg(t, 3.1, 3.4)), lookY: droop * .7 + .3 * ease(seg(t, 3.1, 3.4)), nod: droop * .5 + .25 * ease(seg(t, 3.1, 3.5)),
      emote: t > GIGGLE_A ? 'sweat' : null, emoteK: seg(t, GIGGLE_A, GIGGLE_A + .25), emoteAge: t - GIGGLE_A,
      handL: L2(claw, [-3.2, -7.4], droop), handR: L2([-claw[0], claw[1]], [3.2, -7.4], droop),
      handShapeL: droop > .5 ? 'open' : 'claw', handShapeR: droop > .5 ? 'open' : 'claw',
    };
    const k = kid(X, Y, u, o, { mane: { puff: inh * .7, droop, lost: t > PETAL_A ? [2] : [] }, tail: {} });
    if (t > PETAL_A) { const a = 2 / 16 * TAU - Math.PI / 2; fallingPetal(k.head[0] + Math.cos(a) * 4.6 * u, k.head[1] + Math.sin(a) * 4.6 * u, Y - 10, u, t - PETAL_A, 1.3, 2); }
    const fs = toScreen(k.head[0], k.head[1]);
    camEnd();
    caps(t);
    if (t > IRIS_A) { flushLetters(); boilSeed('irisA'); iris(fs[0], fs[1], lerp(1400, 0, easeIn(seg(t, IRIS_A, B0))), '#100A16'); }
  }

  // =============== B, C, D · the bedroom ===============
  const KX = 690, KY = 1300, KU = 36;          // Aarav on the bed (B, C)
  const SX = 700, SY = 1700, SU = 34;          // Aarav standing (D)
  const CX = 320, CY = 1700, CU = 34;          // Chandraghanta (C, D)
  const LAMP = [290, 1060], BOOKBED = [905, 1235], MANEBED = [500, 1238];
  const SHELF = [300, 700];

  function roomCam(t) {
    // B: on Aarav; a push into the cover; the tilt up the beam; C: the room; D: the two-shot
    const c = kf(t, [[B0, [600, 1070, 1.4]], [TING_B, [585, 1040, 1.38]], [CATCH - .1, [640, 1080, 1.4]], [CATCH + .3, [690, 1130, 1.6]], [OPEN, [690, 1140, 1.62]], [BEAM + .2, [690, 1050, 1.3]],
      [10.4, [540, 1080, .95]], [D0, [545, 1080, .95]], [D0 + .001, [520, 1080, 1.0]], [E0, [530, 1075, 1.02]]], ease);
    return c;
  }

  function shotRoom(t) {
    const inD = t >= D0;
    let [cx, cy, z] = roomCam(t);
    // the whip pan from C to D (cut at D0 under the streaks)
    const wk = bump(t, D0, .15, .15);
    if (t < D0) cx += 600 * easeIn(seg(t, D0 - .15, D0)); else cx -= 600 * (1 - easeOut(seg(t, D0, D0 + .15)));
    const shk = Math.max(bump(t, RING + .05, .05, .9), bump(t, ROAR_D + .05, .05, .8)) * 16;
    const [sx, sy] = shk > .1 ? shakeXY(t, shk) : [0, 0];
    camBegin(cx + sx, cy + sy, z);

    const gold = t < BEAM ? 0 : t < D0 ? ease(seg(t, BEAM, BEAM + .4)) * (1 - .5 * seg(t, 11.5, 13)) : .35 + .3 * bump(t, ROAR_D, .1, .8);
    const winOpen = inD ? ease(seg(t, ROAR_D + .05, ROAR_D + .25)) : 0;
    const lampSway = inD ? spring(t, RING, 3, 9) * .5 + spring(t, ROAR_D, 3, 9) * .7 : 0;
    roomSet(t, { warm: .25, gold, window: [790, 560, 240, 330], lampX: LAMP[0], lampY: LAMP[1], lampSway, windowOpen: winOpen });

    // the shelf: Book 3 glows, slides out and flies (B)
    const bookGone = t > FLY + .15;
    const hero = shelf(SHELF[0], SHELF[1], { glow: t > TING_B ? .6 + .4 * bump(t, TING_B + .05, .05, .6) : 0, slide: seg(t, FLY, FLY + .15), gone: bookGone });

    // the bed
    bed({ x: 730, y: 1300, w: 640, warm: gold });

    // ---- where the book is
    let bookAt = null, bookOpen = 0, bookGlow = 0;   // world centre of the painted book when it's not in his hands
    if (t >= FLY + .15 && t < CATCH) {
      const k = ease(seg(t, FLY + .15, CATCH)), p = arcPt([hero[0], hero[1]], [KX, KY - 4.8 * KU - 20], 260, k);
      bookAt = p;
    }
    if (t >= TOPPLE) {   // knocked out of his hands: it lands open on the bed, still glowing
      const k = easeOut(seg(t, TOPPLE, TOPPLE + .4));
      bookAt = arcPt([KX, KY - 30], BOOKBED, 200, k); bookOpen = 1; bookGlow = .8;
      if (inD) bookGlow = .5 + .4 * bump(t, EXIT + .35, .3, .3);
      if (t > SHUT - .15) bookOpen = 1 - ease(seg(t, SHUT - .15, SHUT - .02));
    }

    // ---- the mane: in his lap (B), dropped on the bed, then into her hand (C), then onto his head (D)
    // ---- Aarav
    let K = null, kidO = null;
    if (!inD) {
      // B and C: sitting on the bed
      const back = t < TOPPLE ? 0 : backOut(seg(t, TOPPLE, TOPPLE + .25)) * (1 - ease(seg(t, RISE1 + .1, RISE1 + .5)));
      const sigh = bump(t, SIGH + .25, .3, .5);
      const holdMane = t < FLY + .2, holdBook = t >= CATCH && t < TOPPLE;
      const lap = [[-2.6, -6.9], [2.6, -6.9]];
      let hands = lap, shape = 'hold';
      if (!holdMane && t < CATCH) { const k = ease(seg(t, FLY + .2, CATCH - .1)); hands = [L2(lap[0], [-3.4, -11.6], k), L2(lap[1], [3.4, -11.6], k)]; shape = 'open'; }
      if (holdBook) {
        const k = ease(seg(t, OPEN, OPEN + .3));   // lowered into his lap
        hands = [L2([-3.45, -10.6], [-3.2, -7.0], k), L2([3.45, -10.6], [3.2, -7.0], k)];
        if (t > BEAM) { const kk = easeOut(seg(t, BEAM, BEAM + .2)); hands = [L2(hands[0], [-4.3, -13.6], kk), L2(hands[1], [4.3, -13.6], kk)]; shape = 'open'; }
      }
      if (t >= TOPPLE) { hands = [[-3.6, -13.6], [3.6, -13.6]]; shape = 'open'; if (t > RISE1 + .3) { const k = ease(seg(t, RISE1 + .3, RISE1 + .8)); hands = [L2(hands[0], [-2.5, -6.7], k), L2(hands[1], [2.5, -6.7], k)]; } }
      if (t > BROW + .2) { const k = ease(seg(t, BROW + .2, BROW + .6)); hands = [L2(hands[0], [-1.2, -7.4], k), L2(hands[1], [1.2, -7.4], k)]; shape = 'fist'; }
      const nodC = t > MEW_C && t < MEW_C + .5 ? Math.sin((t - MEW_C) * 26) * .45 * (1 - seg(t, MEW_C, MEW_C + .5)) : 0;
      const mood = emotions(t, [[B0, 'sad'], [TING_B + .05, 'surprised', { lookX: -1, lookY: -.6 }], [TING_B + .6, 'hopeful', { lookX: -1, lookY: -.4 }],
        [CATCH, 'surprised'], [CATCH + .45, 'neutral', { lookY: .7 }], [OPEN - .2, 'hopeful'], [BEAM, 'scared'], [TOPPLE + .05, 'surprised'],
        [RISE1 + .4, 'starstruck', { lookX: -.8 }], [BROW, 'shy', { lookX: -.7, lookY: .2 }]], { take: .6 });
      const hx = t > TING_B + .2 && t < CATCH ? -.45 * ease(seg(t, TING_B + .2, TING_B + .5)) : t > RISE1 + .4 && t < D0 ? -.35 : 0;
      kidO = {
        ...mood, pose: 'sit', back, kick: t < BEAM ? Math.sin(t * 2.2) * .25 : t > RISE1 + .5 ? Math.sin(t * 6) * .3 : 0, hx,
        inhale: sigh * .6, nod: (t < TING_B ? .5 * seg(t, SIGH + .4, SIGH + .9) : 0) + nodC,
        mouth: t > MEW_C && t < MEW_C + .35 ? 'mew' : t >= BEAM && t < TOPPLE ? 'O' : mood.mouth,
        handL: hands[0], handR: hands[1], handShapeL: shape, handShapeR: shape, boilKey: 'kb',
        handAL: holdBook && t < BEAM ? 0 : undefined, handAR: holdBook && t < BEAM ? Math.PI : undefined,
        held: (u, sw) => {
          if (holdMane) mane(0, -1.4 * u, u * .62, { flat: .7, droop: .25, lost: t > PETAL_B ? [5] : [], key: 'lapmane' });
          if (holdBook) {
            const k = ease(seg(t, OPEN, OPEN + .3)), cyb = lerp(-4.8, -1.3, k);
            bookShut(0, cyb * u, 6.8 * u, 6.8 * u, { open: seg(t, OPEN + .05, BEAM - .05), glow: t > BEAM ? 1 : .2 * k, key: 'heldbook' });
          }
        },
      };
      K = kid(KX, KY, KU, kidO, { key: 'b' });
      // the cover faces us while he holds it up
      if (holdBook && t < OPEN + .2) {
        const k = ease(seg(t, OPEN, OPEN + .3)), cw = aaravWorld(KX, KY, KU, kidO, 0, lerp(-4.8, -1.3, k)), s = toScreen(cw[0], cw[1]);
        const sz = 5.8 * KU * CAM.zoom;
        picture(PICS.book3, s[0], s[1], sz, sz * (1 - 1.2 * seg(t, OPEN, OPEN + .2)), { r: 6, alpha: 1 - seg(t, OPEN + .05, OPEN + .2), pop: (t - CATCH) * 6 });
      }
      if (t > PETAL_B && t < PETAL_B + 1.6) { const lw = aaravWorld(KX, KY, KU, kidO, 2.4, -1.6); fallingPetal(lw[0], lw[1], 1560, KU * .62, t - PETAL_B, 1.2, 5, 'petalB'); }
    }

    // the mane after he drops it (B → C), and in her hand (C → D)
    let maneAt = null, maneS = KU * .62, maneHeld = false;
    if (t >= FLY + .2 && t < MANE_UP) { const k = easeIn(seg(t, FLY + .2, FLY + .45)); maneAt = arcPt([KX, KY - 1.4 * KU], MANEBED, 60, k); }

    // ---- Chandraghanta (C, D)
    let cg = null, cgU = CU, cgX = CX, cgY = CY;
    if (t >= C0 + .2) {
      const g = backOut(seg(t, C0 + .25, RISE1));
      cgU = lerp(3, CU, clamp(g, 0, 1.2));
      // exit: she shrinks and streaks into the book (D)
      if (t > EXIT) { const k = easeIn(seg(t, EXIT, SHUT - .15)); const p = arcPt([CX, CY], [BOOKBED[0], BOOKBED[1] + 20], 260, k); cgX = p[0]; cgY = p[1]; cgU = lerp(CU, 1.5, k); }
      const mood = cEmo(t, [[0, 'serene', { eyes: 'closed' }], [RISE1, 'gentle'], [BROW, 'gentle', { browL: 1, lookX: .8, hx: .25 }], [D0, 'gentle', { lookX: .7 }],
        [RING - .3, 'determined', { lookX: .5 }], [TURN, 'gentle', { lookX: .8, hx: .2 }], [PALM, 'gentle', { eyes: 'closed' }], [COACH[0] - .05, 'determined', { lookX: .9, hx: .25 }],
        [ROAR_D + .2, 'delight'], [LESSON, 'gentle', { lookX: .9, hx: .3 }], [TIE, 'delight'], [EXIT - .3, 'gentle', { eyes: 'wink' }]], { take: .25 });
      const arms = t < FAN ? 0 : t > EXIT ? 1 - seg(t, EXIT, EXIT + .2) : seg(t, FAN, FAN + .9);
      // her front hands: the bell (handL) rings at RING and ROAR_D; the abhaya hand facepalms and taps his nose
      let handL, handR, lean = 0;
      const bellUp = Math.max(bump(t, RING + .4, .4, .9), bump(t, ROAR_D + .25, .3, .6));
      if (bellUp > 0) handL = L2([-4.5, -14.4], [-5.2, -21.5], bellUp);
      const palm = bump(t, PALM + .35, .3, .45);
      if (palm > 0) handR = L2([4.2, -18.2], [1.0, -20.3], palm);
      const tap = t > LESSON + .7 && t < TIE ? ease(seg(t, LESSON + .7, LESSON + 1.0)) * (1 - ease(seg(t, LESSON + 1.6, LESSON + 1.9))) : 0;
      if (tap > 0) { const nose = cgL(CX, CY, CU, aaravWorld(SX, SY, SU, { pose: 'stand' }, 0, -15.0)); handR = L2([4.2, -18.2], [nose[0] - 1.4 - .3 * bump(t, LESSON + 1.25, .1, .15), nose[1]], tap); lean = 1.6 * tap; }
      const ring = ringOf(t, RING) + ringOf(t, ROAR_D) * .8;
      // the back hands: one holds the mane (C → D), three coach him (D)
      const hold = [-7.2, -20.6];
      const backAt = (k, s) => {
        if (k === 1 && s < 0 && t > MANE_UP && t < TURN + .45) return hold;
        if (s < 0) return null;
        if (!inD) return null;
        const head = [SX, SY - 16 * SU];
        if (k === 2 && t > COACH[0] - .2 && t < 23.6) {   // under his chin, then lift
          const chin = cgL(CX, CY, CU, [head[0] - .4 * SU, head[1] + 3.1 * SU]);
          const fan = [7.9, -14.1], k2 = ease(seg(t, COACH[0] - .2, COACH[0])) * (1 - ease(seg(t, 23.3, 23.6)));
          return L2(fan, [chin[0], chin[1] - .7 * ease(seg(t, COACH[0] + .15, COACH[0] + .45))], k2);
        }
        if (k === 1 && t > COACH[1] - .2 && t < 23.6) {   // a push on his near shoulder
          const sh = cgL(CX, CY, CU, [SX - 2.4 * SU, SY - 11.9 * SU]);
          const fan = [7.7, -18.3], k1 = ease(seg(t, COACH[1] - .2, COACH[1])) * (1 - ease(seg(t, 23.3, 23.6)));
          return L2(fan, [sh[0] + .3 * bump(t, COACH[1] + .1, .08, .2), sh[1]], k1);
        }
        if (k === 3 && t > COACH[2] - .2 && t < 23.6) {   // two taps on his belly
          const bel = cgL(CX, CY, CU, [SX - 1.0 * SU, SY - 8.8 * SU]);
          const fan = [6.9, -10.2], k3 = ease(seg(t, COACH[2] - .2, COACH[2])) * (1 - ease(seg(t, 23.3, 23.6)));
          return L2(fan, [bel[0] - .5 * (bump(t, COACH[2] + .1, .06, .12) + bump(t, COACH[2] + .35, .06, .12)), bel[1]], k3);
        }
        return null;
      };
      const backOpen = (k, s) => (s < 0 && k === 1 && t > MANE_UP && t < TURN + .6) || (s > 0 && inD && (k === 1 || k === 2 || k === 3) && t > COACH[0] - .5 && t < 23.9) ? 1 : 0;
      cg = { ...mood, arms, aura: lerp(.9, .35, seg(t, 11, 13)) + .4 * bump(t, RING, .1, .8), moonGlow: .4 + .6 * Math.max(bump(t, NAME, .1, 1.5), bump(t, RING, .1, .8)),
        handL, handR, lean, ring, backAt, backOpen, noShadow: cgU < 20, boilKey: 'cg' };
      if (t > SHUT - .15) cg = null;
      if (cg) {
        if (t < RISE1 + .4) { glow(cgX, cgY - 14 * cgU, 30 * cgU, '#FFD87A', .8 * (1 - seg(t, RISE1, RISE1 + .4))); }
        if (inD && !(t >= TURN + .4)) {}   // (nothing: the mane is drawn below with her hand)
      }
    }

    // ---- D: Aarav standing, in front of her (she is drawn after him: her coaching hands come over him)
    if (inD) {
      const maneOn = t >= TURN + .4;
      const inh1 = t > INHALE1 && t < MEW_D ? ease(seg(t, INHALE1, MEW_D - .05)) * .9 : t >= MEW_D && t < MEW_D + .3 ? .9 * (1 - easeOut(seg(t, MEW_D, MEW_D + .25))) : 0;
      const chest = t > COACH[1] && t < INHALE2 ? .5 * ease(seg(t, COACH[1] + .1, COACH[1] + .35)) : 0;
      const inh2 = t > INHALE2 && t < ROAR_D + .7 ? ease(seg(t, INHALE2, ROAR_D - .05)) * (1 - .4 * seg(t, ROAR_D + .2, ROAR_D + .7)) : 0;
      const inh = Math.max(inh1, chest, inh2);
      const roaring = t >= ROAR_D && t < WONDER;
      const covering = bump(t, RING + .35, .2, .8);
      const claws = (t > INHALE1 && t < MEW_D + .2) || (t > INHALE2 && t < WONDER);
      let hL = [-3.2, -7.4], hR = [3.2, -7.4], shp = 'open';
      if (covering > 0) { hL = L2(hL, [-3.6, -16.2], covering); hR = L2(hR, [3.6, -16.2], covering); }
      if (claws) { const up = roaring ? [4.6, -15.4] : [4.3, -15.0 - inh * 1.2]; hL = [-up[0], up[1]]; hR = up; shp = 'claw'; }
      if (t >= WONDER && t < LESSON + .2) { const k = ease(seg(t, WONDER, WONDER + .25)); hL = L2([-4.6, -15.4], [-1.9, -9.8], k); hR = L2([4.6, -15.4], [1.9, -9.8], k); }
      if (t >= LESSON + .2) { const k = ease(seg(t, LESSON + .2, LESSON + .6)); hL = L2([-1.9, -9.8], [-1.3, -8.2], k); hR = L2([1.9, -9.8], [1.3, -8.2], k); shp = 'fist'; }
      const mood = emotions(t, [[D0, 'shy', { lookX: -.7 }], [RING + .02, 'scared', { lookX: -.6 }], [RING + 1.1, 'surprised', { lookX: -.6 }], [TURN + .1, 'hopeful', { lookY: -.8, lookX: -.3 }],
        [TURN + .6, 'determined'], [MEW_D, 'surprised'], [PALM + .1, 'shy', { lookX: -.6 }], [COACH[0], 'determined', { lookX: -.4 }], [INHALE2, 'determined'],
        [WONDER, 'surprised', { lookY: .8 }], [WONDER + .45, 'happy', { lookY: .6 }], [LESSON, 'hopeful', { lookX: -.8 }], [LESSON + 1.05, 'laugh'], [LESSON + 1.8, 'happy', { lookX: -.6 }],
        [TIE + .2, 'surprised', { lookX: .8, lookY: .5 }], [BELL_TIE + .1, 'excited'], [EXIT, 'starstruck', { lookX: .9 }]], { take: .6 });
      const o = {
        ...mood, inhale: inh, boilKey: 'kd', handL: hL, handR: hR, handShapeL: shp, handShapeR: shp,
        eyes: roaring ? 'squeeze' : t > INHALE2 + .45 && t < ROAR_D ? 'squeeze' : covering > .3 ? 'squeeze' : t >= MEW_D && t < PALM + .3 ? 'wide' : mood.eyes,
        mouth: roaring ? 'roar' : t >= MEW_D && t < MEW_D + .5 ? 'mew' : (t > INHALE1 && t < MEW_D) || (t > INHALE2 && t < ROAR_D) ? 'puff' : mood.mouth,
        mouthK: 1.0, brows: claws ? -.6 : mood.brows, blush: t > PALM && t < COACH[0] + .3 ? 1 : mood.blush,
        nod: t > COACH[0] + .2 && t < INHALE2 ? -.55 * ease(seg(t, COACH[0] + .2, COACH[0] + .5)) : 0,
        lookY: t > COACH[0] + .2 && t < INHALE2 ? -.4 : mood.lookY, emote: t > EXIT ? null : mood.emote,
      };
      const maneO = maneOn ? { puff: roaring ? 1.3 * (1 - .5 * seg(t, ROAR_D + .3, WONDER)) : inh * .6, droop: t > MEW_D && t < COACH[0] ? .35 : 0 } : null;
      const tailBell = t > BELL_TIE ? 1 : 0;
      K = kid(SX, SY, SU, o, { mane: maneO, tail: { bell: tailBell, bellGlow: .6 * bump(t, BELL_TIE + .1, .1, .8), wiggle: spring(t, BELL_TIE, 4, 16) * .3 }, key: 'd' });
      kidO = o;
      if (roaring) {
        const m = aaravMouth(SX, SY, SU, o);
        shockRings(m[0], m[1], t - ROAR_D, { r: 220, from: 1.1, n: 3, w: 6, key: 'roarD', col: LN.goldLt });
      }
    }

    // ---- Chandraghanta, with what she holds
    if (cg) {
      chandraghanta(cgX, cgY, cgU, cg);
      if (t < FAN + .5) petalSwirl(cgX, cgY - 13 * cgU, 9 * cgU, t, 1 - seg(t, FAN, FAN + .5), 'cgswirl');
      if (t > RING && t < RING + 1.2) { const b = chandraghantaHand(cgX, cgY, cgU, cg, -1); shockRings(b[0], b[1] - 2 * cgU, t - RING, { r: 160, n: 4, life: 1.1, key: 'ringRing' }); }
      if (t > EXIT) petalSwirl(cgX, cgY - 10 * cgU, 3 * CU, t, 1 - seg(t, SHUT - .3, SHUT), 'exitswirl', 10);
    }
    // the mane in her back hand (C → D) and its flight onto his head
    if (t >= MANE_UP && t < TURN + .4 && cg) {
      const hand = cgW(cgX, cgY, cgU, [-7.2, -20.6]), held = [hand[0] - 10, hand[1] - 70];
      if (t < MANE_UP + .4) { const k = ease(seg(t, MANE_UP, MANE_UP + .4)); maneAt = arcPt(MANEBED, held, 260, k); }
      else maneAt = held;
      if (inD && t > TURN) { const k = ease(seg(t, TURN, TURN + .4)); maneAt = arcPt(held, [SX, SY - 16 * SU], 240, k); maneS = lerp(KU * .62, SU, k); }
      maneHeld = true;
    }
    if (maneAt && !(inD && t >= TURN + .4)) mane(maneAt[0], maneAt[1], maneS, { flat: maneHeld ? .15 : .65, droop: .2, lost: [2, 5], key: 'loosemane' });

    // the book on the bed / in flight (drawn over her when she streaks into it)
    if (bookAt) bookShut(bookAt[0], bookAt[1], 6.8 * KU * (t < CATCH ? .55 : .62), 6.8 * KU * .62, { open: bookOpen, glow: bookGlow, rot: t < CATCH ? Math.sin(t * 9) * .3 : 0, key: 'flybook' });
    if (t >= FLY + .15 && t < CATCH) sparkleBurst(bookAt[0], bookAt[1], 60, frac((t - FLY) * 3) * .8, 'flysp', 6);

    // the beam: up out of the book in his lap (B), then pouring down to the rug, where she forms (C)
    if (t >= BEAM && t < RISE1 + .5) {
      const src = t < TOPPLE ? aaravWorld(KX, KY, KU, kidO || {}, 0, -1.3) : bookAt || BOOKBED;
      const pts = [src, [src[0] - 40, src[1] - 520], [520, 520], [380, 900], [CX + 10, CY - 120]];
      const C = through(pts), head = clamp(seg(t, BEAM + .15, BEAM + .75)), n = Math.max(2, Math.round(C.length * head));
      const up = t < BEAM + .15 ? [[src[0], src[1]], [src[0], src[1] - 600 * easeOut(seg(t, BEAM, BEAM + .15))]] : C.slice(0, n);
      beam(up.length > 1 ? up : [src, [src[0], src[1] - 10]], 110, 1 - seg(t, RISE1, RISE1 + .5));
      if (t > BEAM) glow(src[0], src[1], 260, '#FFE6A0', .7 * (1 - seg(t, RISE1, RISE1 + .5)));
    }
    if (t > C0 + .2 && t < C0 + .9) vanishPuff(CX, CY - 200, 220, t - (C0 + .25), 'cgpuff');

    // the tiny bell flies from her ghanta to his tail (D)
    if (t > TIE && t < BELL_TIE && cg && K && K.tip) {
      const b = chandraghantaHand(cgX, cgY, cgU, cg, -1), k = ease(seg(t, TIE + .2, BELL_TIE));
      const p = arcPt([b[0], b[1] - 2 * CU], [K.tip[0], K.tip[1] + .6 * SU], 380, k);
      tinyBell(p[0], p[1], SU * 1.5 * backOut(seg(t, TIE, TIE + .25)) * lerp(1, .6, seg(t, BELL_TIE - .2, BELL_TIE)), { glow: 1, swing: Math.sin(t * 12) * .4, key: 'flybell' });
      sparkleBurst(p[0], p[1], 70, frac((t - TIE) * 2.5) * .8, 'bellsp', 7);
    }
    if (inD && K && K.tip) sparkleBurst(K.tip[0], K.tip[1] + 20, 70, t - BELL_TIE, 'tiesp', 8);
    if (t > SHUT - .2) vanishPuff(BOOKBED[0], BOOKBED[1] - 20, 110, t - (SHUT - .15), 'shutpuff');

    // her face, for the whip; Aarav's, for the iris in
    const lampS = toScreen(LAMP[0], LAMP[1] + 20);
    const roarS = K && inD ? toScreen(...aaravHead(SX, SY, SU, kidO)) : null;
    camEnd();
    whipH(wk, -1, t);
    veil('#FFB060', .05 + .08 * gold);
    // the training roar, painted
    if (t > ROAR_D && t < WONDER + .3 && roarS) sfx('ROAR!', roarS[0] - 60, roarS[1] - 330, 110, GOLDC, t - ROAR_D, { life: .9, font: '700 110px Poppins', stroke: PAL.ink, sw: .2 });
    caps(t);
    // the iris opens out of the lamp's light (B); the book's covers close over the camera (D → E)
    if (t < B0 + .5) { flushLetters(); boilSeed('irisB'); iris(lampS[0], lampS[1], lerp(0, 1400, easeIn(seg(t, B0, B0 + .5))), '#100A16'); }
    if (t > SHUT - .1) {
      flushLetters();
      const k = easeIn(seg(t, SHUT - .1, E0));
      for (const s of [-1, 1]) {
        boilSeed('cover' + s);
        const x0 = s < 0 ? -40 : W + 40, x1 = s < 0 ? lerp(-40, W / 2 + 6, k) : lerp(W + 40, W / 2 - 6, k);
        paint(rectPts(Math.min(x0, x1), -40, Math.abs(x1 - x0), H + 80), { wash: LN.book, fill: LN.bookDk, fillOp: 70, tex: .5, ink: LN.ink, sw: 2 });
      }
    }
  }

  // =============== E · the play ===============
  const EX = 600, EY = 1560, EU = 38;      // Aarav on stage
  const DX = 250, DU = 32;                 // the demon kid
  const WX = -470, WCX = -330;             // her in the wings: peeking (WINGS), stepped out (CLAP10)
  function stageCam(t, tip) {
    const keys = [[E0, [530, 985, 1.1]], [INHALE3, [565, 965, 1.18]], [BELL_E, [580, 960, 1.2]], [BELL_E + .35, [tip[0], tip[1], 2.6]], [WINGS - .05, [tip[0], tip[1], 2.65]],
      [WINGS + .2, [-280, 1000, 1.08]], [BACK, [-270, 1000, 1.1]], [BACK + .25, [600, 945, 1.3]], [ROAR_E - .05, [600, 935, 1.45]], [ROAR_E + .7, [540, 1000, 1.02]],
      [CLAP10 - .1, [540, 1000, 1.04]], [CLAP10 + .15, [-250, 1000, 1.1]], [F0, [-250, 990, 1.13]]];
    return kf(t, keys, ease);
  }
  function shotE(t) {
    // Aarav's pose first: the camera follows his tail
    const inh3 = t > INHALE3 && t < MEW_E + .3 ? (t < MEW_E ? ease(seg(t, INHALE3, MEW_E - .05)) : 1 - easeOut(seg(t, MEW_E, MEW_E + .25))) * .9 : 0;
    const inh4 = t > INHALE4 && t < HUSH ? ease(seg(t, INHALE4, ROAR_E - .05)) * (1 - .3 * seg(t, ROAR_E + .4, HUSH)) : 0;
    const inh = Math.max(inh3, inh4), roaring = t >= ROAR_E && t < HUSH - .2;
    const droop = t > DROOP_E && t < INHALE4 ? ease(seg(t, DROOP_E, DROOP_E + .4)) * (1 - ease(seg(t, BACK + .1, INHALE4 + .2))) : 0;
    const cheer = t > CHEER, hop = cheer ? jump(t, CHEER + .1, CHEER + .55, 2.5) : { dy: 0, sq: 0 }, hop2 = cheer ? jump(t, CHEER + .7, CHEER + 1.15, 2) : { dy: 0, sq: 0 };
    let hL = [-3.0, -7.6], hR = [3.0, -7.6], shp = 'open';
    if (t > DROOP_E && t < BELL_E) { const k = ease(seg(t, DROOP_E, DROOP_E + .3)); hL = L2(hL, [-1.2, -8.0], k); hR = L2(hR, [1.2, -8.0], k); shp = 'fist'; }
    if (t >= BELL_E && t < INHALE4) { const k = ease(seg(t, BELL_E, BELL_E + .3)); hR = L2([1.2, -8.0], [5.2, -7.6 + .6 * bump(t, TING_E, .1, .15)], k); hL = [-3.0, -7.6]; shp = 'point'; }
    if (t >= INHALE4 && t < HUSH) { const up = roaring ? [4.8, -14.6] : [4.3, -14.6 - inh * 1.2]; hL = [-up[0], up[1]]; hR = up; shp = 'claw'; }
    if (cheer) { const w = Math.sin(t * 10) * .6; hL = [-4.4, -17.2 + w]; hR = [4.4, -17.2 - w]; shp = 'open'; }
    const mood = emotions(t, [[E0, 'nervous'], [CUE + .2, 'nervous', { lookX: .2 }], [INHALE3, 'determined'], [MEW_E, 'surprised'], [GIGGLE_E, 'shy', { lookX: -.8 }],
      [DROOP_E, 'sad'], [BELL_E + .05, 'thinking', { lookX: .8, lookY: .8 }], [TING_E + .1, 'hopeful', { lookX: -.9, lookY: -.1 }], [BACK + .1, 'determined', { lookX: -.6 }],
      [INHALE4 + .2, 'determined'], [HUSH, 'surprised'], [CHEER, 'excited']], { take: .6 });
    const ko = {
      ...mood, inhale: inh, tremble: droop * .8, worry: droop, boilKey: 'ke', handL: hL, handR: hR, handShapeL: shp, handShapeR: shp === 'point' ? 'point' : shp,
      dy: (mood.dy || 0) + hop.dy + hop2.dy, sq: (mood.sq || 0) + hop.sq + hop2.sq,
      eyes: roaring || (t > ROAR_E - .15 && t < ROAR_E) ? 'squeeze' : t >= MEW_E && t < GIGGLE_E ? 'wide' : t >= HUSH && t < CHEER ? 'wide' : mood.eyes,
      mouth: roaring ? 'roar' : t >= MEW_E && t < MEW_E + .5 ? 'mew' : (t > INHALE3 && t < MEW_E) || (t > INHALE4 + .2 && t < ROAR_E) ? 'puff' : t >= HUSH && t < CHEER ? 'O' : cheer ? 'grin' : mood.mouth,
      mouthK: 1.3, brows: t > INHALE4 && t < HUSH ? -.7 : mood.brows, blush: t > GIGGLE_E && t < BELL_E ? 1 : cheer ? .6 : mood.blush,
      lookX: t > GIGGLE_E && t < DROOP_E ? (Math.sin((t - GIGGLE_E) * 9) > 0 ? .9 : -.9) : mood.lookX,
    };
    const tipGuess = aaravWorld(EX, EY, EU, ko, 1.95 + 3.9, -6.7 - .4 + .9);
    let [cx, cy, z] = stageCam(t, tipGuess);
    const shk = bump(t, ROAR_E + .05, .05, 1.2) * 22;
    const [sx, sy] = shk > .1 ? shakeXY(t, shk) : [0, 0];
    camBegin(cx + sx, cy + sy, z);

    const warm = 1;
    stageSet(t, { spot: [EX, EY - 10, 300], spotA: 1 + .5 * bump(t, ROAR_E, .05, .6), floorY: EY, warm });
    // the wing curtain (stage left) and her, behind it
    const peek = t > WINGS - .1 && t < BACK + .4, clap = t > CLAP10 - .15 && t < F0;
    if (peek || clap) {
      const at = peek ? WX : WCX, u = EU;
      const rise = peek ? ease(seg(t, WINGS + .1, WINGS + .5)) : 0, gone = clap && t > 43.9;
      const mood = cEmo(t, peek ? [[0, 'gentle', { lookX: .9 }], [WINGS + .3, 'determined', { lookX: .9 }]] : [[0, 'delight'], [43.3, 'gentle', { eyes: 'wink' }]], { take: .2 });
      const cl = k => Math.max(0, Math.sin(t * 15 + k * 1.7));   // each pair claps on its own beat
      const backAt = (k, s) => {
        if (peek) { const fan = [s * [6.3, 7.7, 7.9, 6.9][k], [-22.4, -18.3, -14.1, -10.2][k]]; return L2(fan, [s * (2.8 + k * 1.1), -25.6 + k * 1.3], rise); }
        // ten hands clapping: on each side the top two meet, and the lower two meet
        const pair = k < 2 ? 0 : 1, mid = pair ? -12.2 : -20.4, c = cl(pair * 2 + (s > 0 ? 1 : 0));
        const yy = lerp(mid + (k % 2 ? 1 : -1) * 2.0, mid + (k % 2 ? .45 : -.45), c);
        return [s * (pair ? 7.4 : 7.0), yy];
      };
      const fc = cl(5);
      const o = { ...mood, arms: 1, aura: .6, moonGlow: peek ? .5 + .5 * bump(t, WINGS, .05, .8) : .5, lean: peek ? 1.2 : 0, backAt, backOpen: 1, boilKey: 'cgw',
        mouth: peek && t > WINGS + .3 ? 'open' : undefined, ring: peek ? ringOf(t, WINGS) : 0,
        handL: clap ? [-lerp(2.6, .7, fc), -14.6] : peek ? [-5.2, -21.5] : undefined, handR: clap ? [lerp(2.6, .7, fc), -14.6] : undefined,
        bell: !clap, abhaya: !clap };
      if (!gone) chandraghanta(at, EY, u, o);
      if (clap && t > 43.85) { vanishPuff(at, EY - 14 * u, 260, t - 43.9, 'cgvanish'); sparkleBurst(at, EY - 14 * u, 200, t - 43.9, 'cgsp', 12); }
      if (clap && t > 43.9) for (let i = 0; i < 9; i++) { const a = t - 43.9, x = at + (hash(i) - .5) * 300 + Math.sin(a * 3 + i) * 30, y = EY - 14 * u - a * (500 + 300 * hash(i * 3)); sparkStar(x, y, 12 + 8 * hash(i * 5), 'rise' + i); }
      if (peek && t > WINGS && t < WINGS + 1) { const b = chandraghantaHand(at, EY, u, o, -1); sparkleBurst(b[0], b[1] - 2 * u, 90, t - WINGS, 'wingsp', 8); }
      boilSeed('wing');
      curtainPanel(-1100, at - 120 + (peek ? 0 : -260), -500, EY + 30, 'wingcurtain', { sway: .4 });
    }

    // the lion of the roar, behind him
    const sp = roaring ? 1 - seg(t, HUSH - .6, HUSH - .2) : 0, hd = aaravHead(EX, EY, EU, ko);
    if (sp > 0) lionSpirit(hd[0], hd[1] - 6.2 * EU, EU * 1.6, easeOut(seg(t, ROAR_E, ROAR_E + .2)) * sp, .6 + .4 * Math.sin(t * 20) ** 2, 'spirit');

    // the demon kid: smirks, points his sword, laughs; the roar pops his horns off and sits him down
    const sit = ease(seg(t, ROAR_E + .2, ROAR_E + .45));
    const dm = emotions(t, [[E0, 'smug'], [GIGGLE_E, 'laugh'], [DROOP_E + .3, 'smug'], [ROAR_E + .15, 'dizzy']], { take: .5 });
    const dsw = t > GIGGLE_E && t < ROAR_E ? 1 : 0;
    const dO = { ...dm, pal: DEMON, hair: 'neat', star: false, boilKey: 'demon', eyes: t > ROAR_E + .15 ? 'swirl' : dm.eyes,
      mouth: t > GIGGLE_E && t < DROOP_E + .3 ? 'laugh' : t > ROAR_E + .15 ? 'wobble' : 'smirk',
      dy: (dm.dy || 0) + sit * 2.6, sq: (dm.sq || 0) + sit * .28, rot: sit * -.12,
      handR: dsw ? [5.6, -11.6] : [4.4, -10.6], handShapeR: 'fist', handL: [-2.8, -8.2], handShapeL: 'fist', bendL: 1,
      hat: hornsHat({ pop: seg(t, ROAR_E + .2, ROAR_E + .9) }),
      held: (u, sw) => { const [, , h] = aaravArm(dO, 1); push(); translate(h[0] * u, h[1] * u); cardSword(u, sw, dsw ? -.1 + .1 * Math.sin(t * 12) : -1.2); pop(); } };
    aarav(DX, EY, DU, dO);
    if (t > ROAR_E + .2 && t < ROAR_E + 1.2) {   // the horns, flying off
      const k = seg(t, ROAR_E + .2, ROAR_E + 1.2), dh = aaravHead(DX, EY, DU, dO);
      push(); translate(dh[0] - 220 * k, dh[1] - 380 * Math.sin(k * Math.PI) + 300 * k * k); rotate(k * 9);
      for (const s of [-1, 1]) paint(U([[s * .8, 0], [s * 2.1, -.9], [s * 3.2, -2.8], [s * 2.7, -.2], [s * 1.4, .8]], DU), { wash: LN.horn, ink: LN.ink, sw: 1.2, curv: .5 });
      pop();
    }

    // Aarav
    const maneO = { puff: roaring ? 1.35 : inh * .7, droop: droop * .75 };
    const K = kid(EX, EY, EU, ko, { mane: maneO, tail: { bell: 1, bellGlow: .7 * bump(t, TING_E + .05, .1, .9) + .3 * seg(t, BELL_E, BELL_E + .3) * (1 - seg(t, WINGS, WINGS + .5)), wiggle: spring(t, TING_E, 4, 18) * .5 }, key: 'e' });
    if (t > BELL_E + .2 && t < WINGS) sparkStar(K.tip[0] + 8, K.tip[1] + 30, 14 + 10 * bump(t, TING_E + .05, .1, .4), 'tipglint');
    if (roaring) { const m = aaravMouth(EX, EY, EU, ko); shockRings(m[0], m[1], t - ROAR_E, { r: 260, from: 1.1, n: 3, life: 1.1, key: 'roarE', w: 6 }); }

    // the front curtains part (the match from the book's covers)
    if (t < CUE) frontCurtains(seg(t, E0, E0 + .6), { cx: 520, w: 640 });
    // the audience and Mum
    const blow = t > ROAR_E ? ease(seg(t, ROAR_E, ROAR_E + .15)) * (1 - ease(seg(t, CHEER - .2, CHEER + .2))) : 0;
    audience(t, { y: 1790, x0: -1000, x1: 1400, giggle: t > GIGGLE_E && t < DROOP_E + .3 ? 1 : 0, blow, cheer: cheer ? ease(seg(t, CHEER, CHEER + .3)) : 0, phones: true, skip: i => i === 10 || i === 11 });
    mum(880, 1850, { wobble: blow, wipe: t > CHEER + .3 ? ease(seg(t, CHEER + .3, CHEER + .6)) * (1 - ease(seg(t, CLAP10 - .5, CLAP10 - .2))) : 0 });

    const roarS = toScreen(hd[0], hd[1]);
    camEnd();
    whipH(Math.max(bump(t, WINGS + .08, .12, .14), bump(t, BACK + .1, .1, .15), bump(t, CLAP10, .1, .15)), t > BACK && t < CLAP10 - .3 ? 1 : -1, t);
    flash(.55 * bump(t, ROAR_E + .02, .02, .25), '#FFF3D0');
    if (t > ROAR_E && t < HUSH) sfx('ROAAAR!', 470, 1330, 150, GOLDC, t - ROAR_E, { life: HUSH - ROAR_E, font: '700 150px Poppins', stroke: PAL.ink, sw: .2, screen: true });
    caps(t);
    if (t < E0 + .25) { flushLetters(); for (const s of [-1, 1]) { boilSeed('coverE' + s); const k = easeOut(seg(t, E0, E0 + .25)), x1 = s < 0 ? lerp(W / 2 + 6, -40, k) : lerp(W / 2 - 6, W + 40, k), x0 = s < 0 ? -40 : W + 40; if (Math.abs(x1 - x0) > 4) paint(rectPts(Math.min(x0, x1), -40, Math.abs(x1 - x0), H + 80), { wash: LN.book, ink: LN.ink, sw: 2 }); } }
  }

  // =============== F · bedtime ===============
  function shotF(t) {
    const tilt = ease(seg(t, F0 + .2, F0 + 1.2));
    const WIN = [700, 380, 300, 380];
    camBegin(lerp(850, 540, tilt), lerp(560, 1180, tilt), lerp(1.7, 1.04, tilt) + .006 * (t - F0));
    roomSet(t, { warm: 1, gold: .15, window: WIN, lampX: 1010, lampY: 1090, stars: 1 - seg(t, F0 + .4, F0 + 1.4) });
    // the sparkles from E, still rising, become the window's stars
    if (t < F0 + .6) for (let i = 0; i < 9; i++) { const a = t - F0, k = ease(clamp(a / .6)); sparkStar(lerp(WIN[0] + 60 + hash(i) * 200, WIN[0] + 20 + hash(i * 3.1) * (WIN[2] - 40), k), lerp(WIN[1] + WIN[3] + 120, WIN[1] + 20 + hash(i * 1.3) * WIN[3] * .6, k), 14 * (1 - k * .5), 'fstar' + i); }
    bed({ x: 540, y: 1560, w: 960, warm: 1 });
    boilSeed('fpillow'); paint(ellPts(560, 1120, 250, 115, 26), { wash: LN.pillow, ink: LN.ink, sw: 1.3 });
    // the mane and tail hang on the bedpost; the tiny bell glints
    mane(118, 980, 26, { droop: .5, lost: [2, 5], key: 'postmane' });
    tail(118, 1080, 26, { dir: -1, bell: 1, bellGlow: .4 * bump(t, GLINT + .3, .1, .6), key: 'posttail' });
    const o = { pose: 'sleep', eyes: 'closed', mouth: 'smile', htilt: -.28 + .02 * Math.sin(t * 1.2), blush: .5, inhale: .15 + .15 * Math.sin(t * 1.6), boilKey: 'kf',
      handL: [-2.6, -9.8], handR: [2.6, -9.6], handShapeL: 'hold', handShapeR: 'hold', handAL: 0, handAR: Math.PI,
      emote: 'zzz', emoteK: seg(t, F0 + 1, F0 + 1.4), emoteAge: t - F0,
      held: (u, sw) => bookShut(0, -4.4 * u, 5.4 * u, 5.4 * u, { glow: .25 + .5 * bump(t, GLINT + .2, .2, .8), key: 'hugbook' }) };
    aarav(540, 1500, 38, o);
    boilSeed('fblanket');
    paint([[30, 1400], [300, 1380], [540, 1400], [800, 1378], [1050, 1400], [1060, 1580], [20, 1580]], { wash: LN.blanket, fill: LN.blanketDk, fillOp: 60, tex: .5, ink: LN.ink, sw: 1.4, curv: .4 });
    for (let i = 0; i < 5; i++) paint(starPts(140 + i * 200, 1470 + 20 * Math.sin(i), 18, .45, 5), { wash: LN.blanketLt, ink: null });
    const bw = aaravWorld(540, 1500, 38, o, 0, -4.4), bs = toScreen(bw[0], bw[1]), z = CAM.zoom;
    camEnd();
    veil('#FFB060', .06);
    picture(PICS.book3, bs[0], bs[1], 4.6 * 38 * z, 4.6 * 38 * z, { r: 5, rot: .02 });
    if (t > GLINT) { flushLetters(); sparkStar(bs[0] + 70 * z, bs[1] - 70 * z, 22 * bump(t, GLINT + .2, .2, .5), 'glint'); }
    caps(t);
    if (t > IRIS) {   // a moon-bell iris closes on the book
      flushLetters(); const k = ease(seg(t, IRIS, CARD)), r = lerp(1300, 0, k) + 2; boilSeed('fIris');
      iris(bs[0], bs[1], r, TK.peach);
      if (r > 20) { const e = ellPts(bs[0], bs[1], r, r, 40); inkLine([...e, e[0], e[1]], 10, TK.gold, 'ink', .5); }
    }
  }

  // =============== the card ===============
  function shotCard(t) {
    lionCard(t, { cover: COVER3, row: ROW13, price: PRICE, logo: LOGO, pill: PILL, follow: FOLLOW });
    const age = t - CARD_CAP;
    if (age >= 0) letter('Stories that make kids BRAVE', 490, 662, 52, TK.teal, { screen: true, font: '52px Marcellus', ink: false, pop: age * 5, maxW: 900 });
    const k = frac((t - FOLLOW) / 1.6);
    if (t > FOLLOW) { flushLetters(); boilSeed('sparkle'); paint(starPts(lerp(300, 680, k), lerp(1060, 720, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
  }

  shots([[0, shotA], [B0, shotRoom], [E0, shotE], [F0, shotF], [CARD, shotCard]].map(([s0, fn]) => [s0, t => fn(t)]));
})();
