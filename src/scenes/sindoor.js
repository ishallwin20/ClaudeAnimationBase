// sindoor.js: "Why is HANUMAN JI covered in SINDOOR?" (ad 29, ~72 s, captions in Bangers, SFX, no voiceover). The
// popular legend, told as one: Hanuman sees Maa Sita put sindoor in her hair for Shri Ram's long life, covers himself in
// it head to tail, walks into Ram's court like that; the court laughs, Ram asks, Hanuman explains, Ram weeps, hugs him
// and blesses whoever offers him sindoor. The chola today (sindoor in chameli oil, Tuesdays and Saturdays); the ask; the
// 15K Family Deal card. STORYBOARD.md has the plan and the sources; sets, palettes and props are in sindoor_props.js.
// All times are video time (t); tools/sindoor_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/sindoor_sfx.mjs)
  const PAT = 1.7, SNIFF = 4.9, SNEEZE = 5.6, C0 = 6.4;
  const DAB1 = 8.4, PEEK = 7.6, DAB2 = 10.6, STEP = 12.1, TURN = 15.2, E0 = 18.6;
  const PINCH = 19.0, IDEA = 21.4, F0 = 24.4;
  const POUR1 = 25.3, POUR2 = 26.7, SPIN = 27.8, EMERGE = 28.9, LOOK = 29.6, DIP = 30.4, G0 = 31.6;
  const STARE = 34.0, LAUGH = 35.0, ASKR = 37.7, BOWH = 40.4, QUIET = 43.6, RAMK = 45.0, I0 = 46.4;
  const HUG = 47.6, PART = 49.3, BLESS = 49.6, J0 = 53.4;
  const DAB3 = 55.0, WINK = 59.4, K0 = 60.6, KWINK = 63.2, CARD = 64.6;
  const CAP_T = CARD + .1, COVERS = CARD + .4, PRICE = CARD + 1.2, STRIKE = CARD + 1.7, DEAD = CARD + 2.2, PILL = CARD + 2.7, SUB = CARD + 3.2, FOLLOW = CARD + 3.7;
  const CARDC = { cap: CAP_T, covers: COVERS, price: PRICE, strike: STRIKE, dead: DEAD, pill: PILL, sub: SUB, follow: FOLLOW, logo: CAP_T - .1 };

  const GOLDC = '#F5C542', SINC = '#FF8A4A';
  const camK = (t, keys, sh = [0, 0]) => { const c = kf(t, keys, ease); camBegin(c[0] + sh[0], c[1] + sh[1], c[2]); return c; };
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const talk = (t, a, b, rest = 'smile', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0) => t > t0 && t < t0 + .5 ? 'closed' : null;
  const SIN = [SD.sinDk, SD.sin], LILAC = [SD.lilacDk, SD.lilac], STONE = [SD.stoneDk, SD.stone], DUSK = [SD.duskDk, SD.dusk], PEACH = [TK.marigold, TK.petal];

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['WHY IS HANUMAN JI', 470, -1, 4.3, 84], ['COVERED IN SINDOOR?', 590, -1, 4.3, 98, GOLDC],
    ["THERE'S A LEGEND", 470, 3.4, 2.9, 84], ['EVERY DADI KNOWS:', 585, 3.7, 2.6, 92, GOLDC],
    ['ONE MORNING IN AYODHYA,', 470, C0 + .1, 2.9, 70], ['HANUMAN SAW MAA SITA', 570, C0 + .4, 2.6, 76, GOLDC],
    ['PUTTING SINDOOR', 470, 9.5, 2.5, 84], ['IN HER HAIR.', 580, 9.8, 2.2, 96, SINC],
    ['"MAA, WHY THE SINDOOR?"', 500, STEP + .1, 2.9, 78],
    ['"IT\'S FOR SHRI RAM\'S', 470, TURN + .1, 3.2, 78], ['LONG LIFE."', 585, TURN + .4, 2.9, 110, GOLDC],
    ['"A PINCH GIVES HIM', 470, E0 + .1, 2.6, 80], ['A LONG LIFE...?"', 580, E0 + .4, 2.3, 92, GOLDC],
    ['"THEN WHAT WOULD', 470, IDEA + .1, 2.8, 84], ['ALL OF ME DO?!"', 585, IDEA + .4, 2.5, 110, GOLDC],
    ['SO HE COVERED HIMSELF', 470, F0 + .1, 4.2, 74], ['IN SINDOOR, HEAD TO TOE...', 570, F0 + .4, 3.9, 70, SINC],
    ['...TO TAIL.', 520, LOOK, G0 - LOOK - .1, 130, GOLDC],
    ['THEN HE WALKED INTO', 470, G0 + .1, 3.1, 78], ["RAM'S COURT LIKE THAT.", 570, G0 + .4, 2.8, 80, GOLDC],
    ['THE WHOLE COURT', 470, LAUGH, 2.6, 84], ['LAUGHED.', 585, LAUGH + .2, 2.4, 120, GOLDC],
    ['"HANUMAN,', 470, ASKR, 2.6, 84], ['WHAT IS ALL THIS?"', 580, ASKR + .2, 2.4, 92, GOLDC],
    ['"A PINCH GIVES YOU', 470, BOWH + .1, 2.9, 80], ['A LONG LIFE..."', 580, BOWH + .4, 2.6, 92, GOLDC],
    ['"...SO I WANT YOU', 470, QUIET - .1, 2.9, 80], ['TO LIVE FOREVER!"', 580, QUIET + .2, 2.6, 100, GOLDC],
    ["RAM'S EYES", 470, I0 + .1, 2.7, 84], ['FILLED WITH TEARS.', 580, I0 + .3, 2.5, 92, GOLDC],
    ['"WHOEVER OFFERS YOU SINDOOR', 470, PART + .1, 3.9, 62], ['WILL HAVE MY BLESSING."', 570, PART + .4, 3.6, 80, GOLDC],
    ['TO THIS DAY, DEVOTEES OFFER', 470, J0 + .1, 3.4, 60], ['SINDOOR IN CHAMELI OIL:', 565, J0 + .4, 3.1, 76, SINC],
    ['THE CHOLA.', 470, 57.0, 3.5, 104, GOLDC], ['ON TUESDAYS AND SATURDAYS.', 585, 57.3, 3.2, 66],
    ['TUESDAY OR SATURDAY:', 470, K0 + .1, 3.8, 76, GOLDC], ['WHEN DO YOU VISIT', 568, K0 + .4, 3.5, 76], ['HANUMAN JI? COMMENT!', 666, K0 + .7, 3.2, 80, GOLDC],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // ================= A · the hook: orange Hanuman; the pat; the sneeze =================
  function shotHook(t, lt, dur) {
    const sn = seg(t, SNIFF, SNEEZE), burst = t > SNEEZE ? easeOut(seg(t, SNEEZE, SNEEZE + .25)) : 0;
    camBegin(540, 1180 - 20 * Math.sin(t * .5), 1.0 + .012 * t + .05 * burst);
    tealGround(t);
    const X = 500, Y = 2020, u = 40;
    const pat = t > PAT - .3 && t < PAT + .7, patK = Math.sin(clamp(seg(t, PAT - .3, PAT + .7)) * Math.PI);
    const o = {
      boilKey: 'hook', seed: 2, sindoor: 1, noShadow: true, eyes: blinkAt(t, 2.9) || (t > SNIFF ? (burst > 0 ? 'wide' : 'closed') : 'happy'),
      mouth: t > SNIFF ? (burst > 0 ? 'open' : 'O') : 'grin', hx: -.1 + .06 * Math.sin(t * .9), htilt: .04 * Math.sin(t * 1.1) - .14 * ease(sn) + .2 * burst,
      dy: -.08 * Math.sin(t * 2.2), bow: -.4 * ease(sn) + .8 * burst, sq: -.04 * ease(sn) + .06 * burst,
    };
    if (pat) { o.handL = [lerp(-3.45, -2.2, patK), lerp(-10.8, -16.6, patK)]; o.bendL = 1.2; }
    hanuman(X, Y, u, o);
    if (t > PAT) powder(...naradaLocal(X, Y, u, o, -2.6, -17.2), 70, t - PAT, 'patpuff', 1.2, 8);
    const nose = naradaMouth(X, Y, u, o);
    if (t > SNEEZE) powder(nose[0], nose[1] - 30, 260, t - SNEEZE, 'sneeze', 1.2, 14);
    camEnd();
    caps(t);
    if (t > SNEEZE) { flushLetters(); powderCover(easeIn(seg(t, SNEEZE + .1, C0)), 'cover'); }
  }

  // ================= B · Sita's chamber: the sindoor; Hanuman peeks, asks; "for Shri Ram's long life" =================
  function shotChamber(t, lt, dur) {
    camK(t, [[C0, [560, 1090, 1.06]], [STEP - .2, [570, 1090, 1.08]], [STEP + 1.2, [600, 1100, 1.0]], [E0, [610, 1100, 1.02]]]);
    chamber(t);
    mirror(170, 1560, t);
    // Sita: dips her finger in the box, touches the parting, smooths her hair; turns to Hanuman at TURN
    const REST = [3.3, -11.2], BOX = [-1.9, -13.9], PARTN = [-.15, -22.9];
    const dab = (t0, hold) => [[t0 - 1.1, REST], [t0 - .65, BOX], [t0 - .4, BOX], [t0, PARTN], [t0 + hold, PARTN], [t0 + hold + .5, REST]];
    let hR = REST;
    if (t < DAB1 + 1.6) hR = kf(t, dab(DAB1, .8), ease);
    else if (t > DAB2 - 1.2 && t < DAB2 + 1.2) hR = kf(t, [[DAB2 - 1.1, REST], [DAB2 - .3, [.9, -22.6]], [DAB2 + .35, [-1.2, -22.3]], [DAB2 + 1.1, REST]], ease);
    const red = (t > DAB1 - .45 && t < DAB1 + .1);
    const turn = ease(seg(t, TURN - .3, TURN + .3)), seen = t > STEP + .6;
    const so = {
      pal: SITA_PAL, ...SITA_SKIN, boilKey: 'sita', seed: 3, hx: lerp(-.55, .5, turn), lookX: lerp(-1, .9, turn), lookY: lerp(-.2, 0, turn),
      eyes: blinkAt(t, 13.3) || (t > DAB1 - .05 && t < DAB1 + .5 ? 'closed' : 'normal'), mouth: talk(t, TURN + .1, TURN + 2.2), blush: .25,
      handR: hR, bendR: 1.3, handL: [-2.2, -13.9], bendL: .6, dy: -.04 * Math.sin(t * 1.4),
      armL: (u, sw) => sindoorBox(u, sw), armR: (u, sw) => { if (red) paint(ellPts(0, -.4 * u, .26 * u, .26 * u, 8), { wash: SD.sin, ink: null }); },
    };
    parvati(470, 1560, 26, so);
    if (t > DAB1 && t < DAB1 + .9) { const p = parvatiHand(470, 1560, 26, so, 1); glow(p[0], p[1], 50, '#FF9050', 120 * (1 - seg(t, DAB1, DAB1 + .9))); }
    // Hanuman: peeks round the doorway, then steps in, hands joined
    const step = ease(seg(t, STEP, STEP + 1.1)), hx0 = lerp(905, 770, step);
    const peek = ease(seg(t, PEEK - .3, PEEK + .3));
    const ho = {
      boilKey: 'hch', seed: 4, walk: t > STEP && t < STEP + 1.1 ? (t - STEP) * 1.6 : null, lean: lerp(-2.4 * peek, 0, step), htilt: -.16 * peek * (1 - step),
      hx: -.55, lookX: -1, eyes: blinkAt(t, 16.6) || (t > PEEK && t < STEP ? 'wide' : 'normal'), brow: t > PEEK && t < STEP ? .8 : .2,
      mouth: talk(t, STEP + .2, STEP + 2.6, t > TURN ? 'smile' : 'O'), pray: ease(seg(t, STEP + .7, STEP + 1.1)),
      emote: t > PEEK + .2 && t < STEP + .4 ? '?' : undefined, emoteK: backOut(clamp((t - PEEK - .2) * 4)), emoteAge: t - PEEK,
    };
    if (t > PEEK - .6) {
      hanuman(hx0, 1560, 22, ho);
      if (step < .6) chamberJamb();
    }
    camEnd();
    if (lt < .7) powderCover(1 - easeOut(lt / .7), 'cover');
    caps(t);
    wipeOut(lt, dur, LILAC);
  }

  // ================= C · Hanuman thinks: the pinch; the idea =================
  function shotThink(t, lt, dur) {
    const whip = t > F0 - .25 ? easeIn(seg(t, F0 - .25, F0)) * 700 : 0;
    camBegin(540 + whip, 1150, 1.0 + .015 * lt);
    peachGround(t);
    const idea = t > IDEA, wk = ease(seg(t, IDEA, IDEA + .3)), off = ease(seg(t, IDEA + 1.4, IDEA + 1.8));
    const o = {
      boilKey: 'hth', seed: 5, noShadow: true, hx: lerp(.1, .45, off), lookX: lerp(.75, 1, off), lookY: lerp(-.35, 0, off), htilt: .06 * Math.sin(t * 1.2),
      eyes: blinkAt(t, 20.4) || (idea ? 'wide' : (t > PINCH + .4 ? 'smug' : 'look')), brow: idea ? 1 : -.3, mouth: idea ? (t > IDEA + 1.4 ? 'grin' : 'O') : 'flat',
      handR: kf(t, [[E0, [3.45, -10.8]], [PINCH, [2.9, -20.6]], [IDEA + 1.4, [2.9, -20.6]], [IDEA + 1.8, [5.6, -18]]], ease), bendR: 1.1,
      armR: (u, sw) => { paint(ellPts(0, -.55 * u, .3 * u, .3 * u, 10), { wash: SD.sin, ink: SD.ink, sw: sw * .3 }); },
      emote: idea ? 'bulb' : undefined, emoteK: backOut(clamp((t - IDEA) * 4)), emoteAge: t - IDEA, sq: -.05 * wk * (1 - seg(t, IDEA + .3, IDEA + .6)),
    };
    hanuman(540, 1950, 40, o);
    const tip = naradaHand(540, 1950, 40, o, 1);
    glow(tip[0], tip[1] - 22, 60, '#FF9050', 90 + 40 * Math.sin(t * 5));
    camEnd();
    caps(t);
  }

  // ================= D · the storeroom: two pots over his head; the spin; the tail =================
  function shotPour(t, lt, dur) {
    const whip = t < F0 + .25 ? (1 - easeOut(seg(t, F0, F0 + .25))) * -700 : 0;
    const sh = t > POUR1 && t < POUR1 + .3 || (t > POUR2 && t < POUR2 + .3) ? shakeXY(t, 8) : [0, 0];
    camBegin(540 + whip + sh[0], 1290 + sh[1], 1.28 + .01 * lt);
    storeroom(t);
    const X = 540, Y = 1600, u = 22;
    const k = clamp(.55 * ease(seg(t, POUR1, POUR1 + .7)) + .45 * ease(seg(t, POUR2, POUR2 + .7)));
    floorDust(k);
    const kt = ease(seg(t, DIP + .15, DIP + .55));
    // the pots: #1 from the left, #2 from the right, #3 small, for the tail
    const OVER = [X, Y - 33 * u];
    const potAt = (t0, from, side) => {   // lift (t0-.7..t0-.2), tip (t0..t0+.6), toss (t0+.7..t0+1.2)
      if (t < t0 - .7) return { p: from, tip: 0, heap: 1 };
      if (t < t0 - .2) { const q = ease(seg(t, t0 - .7, t0 - .2)); return { p: arcPt(from, OVER, 120, q), tip: 0, heap: 1 }; }
      if (t < t0 + .7) { const q = ease(seg(t, t0 - .05, t0 + .35)); return { p: OVER, tip: side * lerp(0, 2.6, q), heap: 1 - q }; }
      const q = easeIn(seg(t, t0 + .7, t0 + 1.2)); return { p: arcPt(OVER, [from[0] + side * -500, from[1] - 200], 200, q), tip: side * (2.6 + q * 3), heap: 0, gone: q >= 1 };
    };
    const P1 = potAt(POUR1, [170, 1600], 1), P2 = potAt(POUR2, [910, 1600], -1);
    const holding = (t > POUR1 - .45 && t < POUR1 + .7) || (t > POUR2 - .45 && t < POUR2 + .7);
    matka(780, 1610, 48, t > DIP && t < DIP + .6 ? .1 * Math.sin(t * 30) : 0, 1, 'pot3');
    if (!holding) { if (t < POUR1 + .7) matka(...P1.p, 70, P1.tip, P1.heap, 'pot1'); if (t < POUR2 + .7 && !P2.gone) matka(...P2.p, 70, P2.tip, P2.heap, 'pot2'); }
    if (t > POUR1 + .7 && !P1.gone) matka(...P1.p, 70, P1.tip, 0, 'pot1');
    if (t > POUR2 + .7 && !P2.gone) matka(...P2.p, 70, P2.tip, 0, 'pot2');
    // Hanuman
    const spin = t > SPIN && t < EMERGE, sp = spin ? Math.floor((t - SPIN) * 10) : 0;
    const em = backOut(clamp((t - EMERGE) * 3)), look = ease(seg(t, LOOK - .2, LOOK + .2)) * (1 - ease(seg(t, DIP + .7, DIP + 1.0)));
    const dipping = t > DIP - .25 && t < DIP + .75;
    const o = {
      boilKey: 'hpour', seed: 6, sindoor: k, sindoorTail: kt,
      eyes: holding ? (t > POUR1 + .05 && t < POUR1 + .6 || t > POUR2 + .05 && t < POUR2 + .6 ? 'closed' : 'happy') : (t > LOOK - .2 && t < DIP + .7 ? 'wide' : 'happy'),
      mouth: holding ? 'grin' : (t > LOOK && t < DIP + .2 ? 'O' : 'grin'), hx: spin ? (sp % 2 ? .9 : -.9) : lerp(0, .9, look), lookX: lerp(0, 1, look), lookY: .5 * look,
      flip: spin && sp % 2 === 1, sq: spin ? -.06 : -.08 * em * (1 - seg(t, EMERGE + .3, EMERGE + .6)),
      tail: dipping ? 'droop' : 'curl', dy: spin ? -.4 * Math.abs(Math.sin((t - SPIN) * 9)) : 0,
    };
    if (holding) { o.handL = [-3.1, -30.2]; o.handR = [3.1, -30.2]; o.bendL = o.bendR = 1.4; }
    else if (t > EMERGE && t < LOOK - .2) { o.handL = [-6, -19]; o.handR = [6, -19]; }
    hanuman(X, Y, u, o);
    if (holding) {   // the pot in his hands, over his head
      const P = t < POUR1 + .8 ? P1 : P2;
      matka(P.p[0], P.p[1] + 70 * .9, 70, P.tip, P.heap, t < POUR1 + .8 ? 'pot1' : 'pot2');
    }
    for (const [t0, key] of [[POUR1, 'pour1'], [POUR2, 'pour2']]) {
      if (t > t0 && t < t0 + .6) {   // the falling stream
        boilSeed(key + 's');
        const q = seg(t, t0, t0 + .6);
        paint(ribbon([[X, Y - 33 * u], [X + 10 * Math.sin(t * 20), Y - 25 * u], [X, Y - 24 * u]], 46 * (1 - q * .5), 70), { wash: SD.sin, washOp: 200, ink: null });
      }
      powder(X, Y - 22 * u, 230, t - t0, key, 1.5, 12);
    }
    if (t > SPIN - .2) powder(X, Y - 12 * u, 300, t - SPIN + .2, 'spin', 1.5, 14);
    if (t > DIP) powder(800, 1540, 90, t - DIP, 'dip', 1.0, 8);
    if (t > DIP + .6 && t < DIP + 1.3) { const tp = hanumanTail(X, Y, u, o); glow(tp[0], tp[1], 70, '#FFD06A', 140 * (1 - seg(t, DIP + .6, DIP + 1.3))); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, SIN);
  }

  // ================= E · Ram's court: the walk in; the laugh; the question; the answer; Ram's tears =================
  const RX = 540, RY = 1250, RU = 20;
  function courtCast(t, phase) {
    const laugh = phase === 'court' && t > LAUGH && t < QUIET, l2 = laugh ? Math.abs(Math.sin((t - LAUGH) * 11)) : 0, tail = 1 - seg(t, ASKR, ASKR + 1.2);
    const stare = phase === 'court' && t > STARE && t < LAUGH;
    const quiet = phase === 'court' ? t > QUIET : true;
    // courtiers (behind, at the sides)
    narada(70, 1440, 17, { pal: COURT1, col: COURT1.skin, dk: COURT1.skinDk, lt: COURT1.skinLt, beard: '#EDE6DC', veena: false, topknot: false, hat: turbanHat, boilKey: 'ct1', seed: 7,
      hx: .5, lookX: .8, eyes: stare ? 'wide' : laugh ? 'happy' : 'normal', mouth: laugh ? (l2 * tail > .3 ? 'open' : 'grin') : quiet ? 'O' : 'smile', dy: -.3 * l2 * tail, handL: laugh ? [-.8, -11.8] : undefined });
    narada(1015, 1440, 17, { pal: COURT2, col: COURT2.skin, dk: COURT2.skinDk, lt: COURT2.skinLt, veena: false, topknot: false, hat: turbanHat, boilKey: 'ct2', seed: 8,
      hx: -.6, lookX: -1, eyes: stare ? 'wide' : laugh ? 'happy' : 'normal', mouth: laugh ? (l2 * tail > .5 ? 'open' : 'grin') : quiet ? 'O' : 'smile', dy: -.25 * Math.abs(Math.sin((t - LAUGH) * 9 + 1)) * (laugh ? tail : 0), handR: laugh ? [-.4, -18.4] : undefined });
    // Lakshman, laughing hardest
    const lk = laugh ? Math.abs(Math.sin((t - LAUGH) * 12 + .5)) : 0;
    lakshman(255, 1330, 19, { boilKey: 'lks', seed: 9, hx: .45, lookX: .8, eyes: phase === 'hug' ? 'happy' : stare ? 'wide' : laugh ? 'happy' : 'normal',
      mouth: phase === 'hug' ? 'smile' : laugh ? (lk * tail > .3 ? 'open' : 'grin') : quiet ? 'O' : 'smile', dy: -.35 * lk * tail, sq: .03 * lk * tail, lean: laugh ? 1.2 * tail : 0,
      handL: laugh && tail > .3 ? [-.9, -11.6] : undefined, handR: laugh && tail > .3 ? [.9, -11.4] : undefined });
    // Sita, beside the throne: hides a smile
    const hide = laugh && t < ASKR + .4;
    parvati(830, 1330, 19, { pal: SITA_PAL, ...SITA_SKIN, boilKey: 'sitac', seed: 10, hx: phase === 'hug' ? -.5 : -.4, lookX: -.9, lookY: .3,
      eyes: stare ? 'wide' : hide ? 'happy' : 'normal', mouth: 'smile', handR: hide ? [.6, -18.4] : undefined, bendR: 1.3, blush: .3 });
  }
  function shotCourt(t, lt, dur) {
    const cam = camK(t, [[G0, [540, 1330, 1.18]], [BOWH - .3, [520, 1330, 1.2]], [BOWH + .7, [400, 1330, 1.5]], [RAMK - .2, [400, 1340, 1.55]], [RAMK + .7, [540, 1080, 1.85]], [I0, [540, 1070, 1.9]]]);
    court(t);
    throne(RX, RY, t);
    courtCast(t, 'court');
    // Ram on the throne
    const ask = t > ASKR - .2 && t < BOWH, tear = t > RAMK + .3;
    ram(RX, RY, RU, { boilKey: 'ramc', seed: 11, sit: 1, hx: -.25 + .1 * Math.sin(t * .7), lookX: -.6, lookY: .4,
      eyes: tear ? 'teary' : t > STARE && t < ASKR + 1 ? 'wide' : blinkAt(t, 33.0) || 'normal', brow: t > STARE && t < ASKR + 1.5 ? .9 : 0,
      mouth: tear ? 'wobble' : talk(t, ASKR, ASKR + 2.0, t > STARE && t < LAUGH + .4 ? 'O' : 'smile'), bow: ask ? .4 * ease(seg(t, ASKR - .2, ASKR + .3)) : 0,
      handL: [-3.9, -10.6], handR: ask ? [5.0, -15.4] : [3.9, -10.6] });
    // footprints, then Hanuman walking in from the left
    const wk = seg(t, G0, G0 + 2.2), hx = lerp(-180, 380, easeOut(wk)), walking = t < G0 + 2.2;
    boilSeed('prints');
    for (let i = 0; i < 10; i++) { const px = -110 + i * 60; if (px < hx - 50) footprint(px, 1730 + (i % 2 ? 12 : -8), 32, i % 2 ? 1 : -1); }
    const bowk = ease(seg(t, BOWH - .3, BOWH + .3));
    hanuman(hx, 1720, 22, { boilKey: 'hct', seed: 12, sindoor: 1, walk: walking ? (t - G0) * 1.7 : null, hx: lerp(.5, .35, bowk), lookX: .8, lookY: -.4,
      eyes: blinkAt(t, 36.4) || (t > LAUGH && t < ASKR ? 'happy' : 'normal'), mouth: talk(t, BOWH + .1, I0 - .2, t > LAUGH && t < ASKR ? 'grin' : 'smile', 'open'),
      pray: bowk, bow: .3 * bowk, brow: t > QUIET ? .5 : 0, dy: walking ? -.25 * Math.abs(Math.sin((t - G0) * 5.3)) : 0 });
    camEnd();
    caps(t);
  }

  // ================= F · the hug; the smudge; the blessing =================
  function shotHug(t, lt, dur) {
    camK(t, [[I0, [520, 1330, 1.3]], [HUG, [540, 1300, 1.4]], [BLESS + .5, [540, 1290, 1.36]], [J0, [540, 1285, 1.38]]]);
    court(t);
    throne(RX, RY, t);
    courtCast(t, 'hug');
    const walkK = ease(seg(t, I0, HUG - .15)), hug = t > HUG - .15 && t < PART, part = ease(seg(t, PART, PART + .4));
    const RXh = lerp(280, 445, walkK) - 14 * part, HX = 650, HY = 1760;
    // Hanuman, bowing; then held
    hanuman(HX, HY, 21, { boilKey: 'hhug', seed: 13, sindoor: 1, hx: -.4, lookX: -.9, lookY: -.2, pray: hug ? 0 : 1, bow: hug ? 0 : .35 + .1 * (1 - part),
      eyes: hug || t > BLESS ? 'closed' : 'normal', mouth: hug ? 'smile' : t > BLESS ? 'grin' : 'smile', htilt: hug ? -.12 : 0,
      handL: hug ? [-6.6, -15.6] : undefined, bendL: 1 });
    const ro = { boilKey: 'rhug', seed: 14, walk: walkK > 0 && walkK < 1 ? (t - I0) * 1.6 : null, hx: .45, lookX: .9, lookY: .2,
      eyes: hug ? 'closed' : 'teary', mouth: hug ? 'smile' : t > BLESS ? 'smile' : 'wobble', htilt: hug ? .12 : 0, kodanda: true };
    if (hug) { ro.handR = [6.8, -15.4]; ro.handL = [-1.2, -13.4]; ro.bendR = 1.3; }
    else if (t > PART) { ro.handR = t > BLESS ? kf(t, [[BLESS, [6.6, -16.4]], [BLESS + .5, [5.4, -24.2]]], ease) : [6.6, -16.4]; }
    ram(RXh, HY, 21, ro);
    if (t > PART - .1) {   // the smudge of sindoor on Ram's cheek
      boilSeed('smudge');
      const [hx, hy] = naradaHead(RXh, HY, 21, ro), a = clamp((t - PART + .1) * 4);
      paint(ellPts(hx + 2.2 * 21, hy + 1.3 * 21, 16 * a, 9 * a, 10, 1, -.4), { wash: SD.sin, washOp: 230, ink: null });
      paint(ellPts(hx + 2.8 * 21, hy + 1.8 * 21, 8 * a, 6 * a, 8, 1, -.4), { wash: SD.sin, washOp: 200, ink: null });
    }
    if (t > BLESS + .3) { const p = naradaHand(RXh, HY, 21, ro, 1); glow(p[0], p[1] - 20, 70, '#FFE08A', 80 * seg(t, BLESS + .3, BLESS + .8)); }
    if (hug) { boilSeed('hughearts'); emote('hearts', (RXh + HX) / 2, HY - 30 * 21, 24, backOut(clamp((t - HUG) * 3)), t - HUG); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, DUSK);
  }

  // ================= G · the mandir today: the chola; the wink =================
  function shotMandir(t, lt, dur) {
    camK(t, [[J0, [540, 1180, 1.28]], [WINK - .6, [540, 1150, 1.42]], [K0, [540, 1145, 1.46]]]);
    mandir(t);
    const X = 540, Y = 1478, u = 23;
    const mo = { boilKey: 'murti', seed: 15, sindoor: 1, gada: 1, noShadow: true, tailSway: 0, eyes: t > WINK && t < WINK + .6 ? ['normal', 'closed'] : 'normal',
      mouth: t > WINK && t < WINK + .9 ? 'grin' : 'smile', lookX: t > WINK - .3 && t < WINK + .9 ? .8 : 0, lookY: t > WINK - .3 && t < WINK + .9 ? .4 : 0 };
    hanuman(X, Y, u, mo);
    garland([[-3.0, -16.4], [-2.4, -13.6], [-1.2, -11.6], [0, -11.0], [1.2, -11.6], [2.4, -13.6], [3.0, -16.4]].map(([a, b]) => naradaLocal(X, Y, u, mo, a, b)), 11, 'mgarland');
    // the oil's sheen on the fresh chola
    const sheen = seg(t, DAB3 + .3, DAB3 + 2.6);
    if (sheen > 0) { boilSeed('sheen'); for (const [a, b] of [[-1.3, -4.8], [1.3, -3.6], [-1.1, -2.0]]) { const p = naradaLocal(X, Y, u, mo, a, b); paint(ellPts(p[0] - 8, p[1], 4 * sheen, 14 * sheen, 8), { wash: '#FFE8C8', washOp: 200, ink: null }); } }
    mandirLedge(t);
    diya(250, 1478, 22, t, 'd1'); diya(380, 1488, 18, t, 'd2'); diya(690, 1488, 18, t, 'd3');
    katori(860, 1478, 44);
    templeBell(150, 760, 46, Math.sin(t * 2.2) * .25, 'b1'); templeBell(930, 760, 46, Math.sin(t * 2.2 + 1.5) * .25 + (t > J0 + .3 && t < J0 + 1.5 ? .4 * Math.sin((t - J0) * 18) * (1 - seg(t, J0 + .3, J0 + 1.5)) : 0), 'b2');
    // the devotee's hand: dips in the katori, smears the chola on the murti's leg
    if (t > DAB3 - 1.4 && t < DAB3 + 3.2) {
      const LEG = naradaLocal(X, Y, u, mo, 1.3, -3.6), KAT = [860, 1440], OFF = [1060, 1900];
      const tgt = kf(t, [[DAB3 - 1.4, OFF], [DAB3 - .7, KAT], [DAB3 - .4, KAT], [DAB3, LEG], [DAB3 + 2.4, [LEG[0], LEG[1] + 10]], [DAB3 + 3.2, OFF]], ease);
      const rub = t > DAB3 && t < DAB3 + 2.4 ? 26 * Math.sin((t - DAB3) * 9) : 0, hp = [tgt[0], tgt[1] + rub];
      boilSeed('dhand');
      paint(ribbon([[1180, 2000], [lerp(1180, hp[0], .55) + 30, lerp(2000, hp[1], .55) + 30], hp], 110, 80), { wash: '#E0A678', fill: '#BE8052', fillOp: 40, tex: .4, ink: SD.ink, sw: 1.2 });
      inkLine([[lerp(1180, hp[0], .7) + 20, lerp(2000, hp[1], .7) + 20], [lerp(1180, hp[0], .7) + 50, lerp(2000, hp[1], .7) - 20]], 5, '#D8283A', 'ink', 0);   // a red thread at the wrist
      paint(ellPts(hp[0], hp[1], 34, 28, 12), { wash: '#E0A678', ink: SD.ink, sw: 1 });
      if (t > DAB3 - .5) paint(ellPts(hp[0] - 18, hp[1] - 10, 15, 11, 8), { wash: SD.sin, ink: null });
    }
    if (t > WINK && t < WINK + .7) { const e = naradaEye(X, Y, u, mo, 1); emote('spark', e[0] + 40, e[1] - 20, 18, backOut(clamp((t - WINK) * 4)), t - WINK); }
    camEnd();
    caps(t);
    wipeIn(lt, DUSK);
    wipeOut(lt, dur, PEACH);
  }

  // ================= H · the ask =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1180, 1.0 + .01 * lt);
    peachGround(t);
    const wave = t < KWINK - .3, w = Math.sin((t - K0) * 7);
    hanuman(500, 1960, 30, { boilKey: 'hask', seed: 16, sindoor: 1, noShadow: true, hx: .1, eyes: t > KWINK && t < KWINK + .6 ? ['normal', 'closed'] : 'happy', mouth: 'grin',
      handR: wave ? [5.6 + .8 * w, -22.4] : [3.45, -10.8], bendR: 1.2, pray: t > KWINK + .7 ? ease(seg(t, KWINK + .7, KWINK + 1.0)) : 0, dy: -.1 * Math.sin(t * 2.4) });
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, PEACH);
  }

  // ================= I · the card =================
  function shotCard(t, lt) {
    dealCard(t, CARDC);
    dealStrike(t, CARDC);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, PEACH); }
  }

  function shotChamberIn(t, lt, dur) { shotChamber(t, lt, dur); }
  function shotThinkIn(t, lt, dur) { shotThink(t, lt, dur); wipeIn(lt, LILAC); }
  function shotCourtIn(t, lt, dur) { shotCourt(t, lt, dur); wipeIn(lt, SIN); }

  shots([[0, shotHook], [C0, shotChamberIn], [E0, shotThinkIn], [F0, shotPour], [G0, shotCourtIn], [I0, shotHug], [J0, shotMandir], [K0, shotAsk], [CARD, shotCard]]);
})();
