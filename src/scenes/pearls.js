// pearls.js: "Why did HANUMAN JI bite Maa Sita's PEARLS?" (ad 59, ~82 s, Bangers captions, cute SFX, no voiceover).
// Valmiki first (Yuddha Kanda, the coronation sarga): Sita takes off her pearl necklace, looks at the vanaras and at Ram
// again and again, Ram tells her to give it to the one she's pleased with, she gives it to Hanuman, who shines like a
// mountain with a white cloud. Then the legend every dadi knows: he bites the pearls one by one looking for Ram, a
// courtier mocks him, he opens his chest and Ram and Sita are in his heart; Ram hugs him. The famous picture today; the
// ask; the Books 1–3 card. STORYBOARD.md has the plan and the sources; sets and props are in pearls_props.js.
// All times are video time (t); tools/pearls_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/pearls_sfx.mjs)
  const SNIFF = 1.3, BITE0 = 2.2, PEER0 = 3.0, TOSS0 = 4.4, ZOOM = 5.9, B0 = 6.6;
  const OFF = 7.6, LK1 = 10.6, LK2 = 11.3, LK3 = 12.0, LK4 = 12.7, RAMSAY = 13.9, WALK = 16.6, PLACE = 18.4, SHINE = 19.8, C0 = 23.4;
  const EYE1 = 25.0, HUH = 25.9, D0 = 27.0;
  const SNAP = 27.4, BITE1 = 29.5, BITE2 = 30.7, BONK = 32.0, BITE3 = 33.0, FAST = 34.0, STAND = 35.7, MUMBLE = 38.6, GULP = 39.4;
  const NORAM = 41.6, TOSS = 43.1, MOCK = 44.7, HUSH = 47.7, E0 = 48.6;
  const GRIP = 49.5, OPEN = 50.3, PUSH = 51.7, WAVE = 54.1, F0 = 56.3;
  const TURBAN = 56.8, G0 = 59.7;
  const HUG = 61.5, HEAL = 62.1, GIVE = 63.6, PEEK = 64.7, H0 = 66.7;
  const PWINK = H0 + 5.6, I0 = 73.9, WINK = 76.1, CARD = 78.1;
  const CARDC = { cap: CARD + .1, covers: CARD + .3, price: CARD + 1.1, logo: CARD + 1.4, pill: CARD + 1.7, follow: CARD + 2.1 };
  // the bites in the court: the first three slow (peer in, toss), then fast
  const BITES = [BITE1, BITE2, BITE3, FAST, FAST + .35, FAST + .7, FAST + 1.05];

  const GOLDC = '#F5C542', PEARLC = '#FFFFFF';
  const camK = (t, keys) => { const c = kf(t, keys, ease); camBegin(c[0], c[1], c[2]); return c; };
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const talk = (t, a, b, rest = 'smile', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0) => t > t0 && t < t0 + .14 ? 'closed' : null;
  const PEACH = [TK.marigold, TK.petal], STONE = [PR.stoneDk, PR.stone], DUSK = [PR.duskDk, PR.dusk];
  const pop = (t, t0, k = 4) => backOut(clamp((t - t0) * k));

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['WHY DID HANUMAN JI', 470, -1, 5.2, 84], ["BITE MAA SITA'S PEARLS?", 585, -1, 5.2, 88, GOLDC],
    ['IT BEGINS IN', 470, 4.3, 2.2, 80], ["VALMIKI'S RAMAYANA.", 580, 4.45, 2.05, 92, GOLDC],
    ['AFTER RAM WAS CROWNED,', 470, B0 + .1, 3.6, 72], ['MAA SITA TOOK OFF', 565, B0 + .35, 3.35, 78, GOLDC], ['HER PEARL NECKLACE.', 660, B0 + .6, 3.1, 80, PEARLC],
    ['SHE LOOKED AT THE VANARAS…', 470, LK1 - .2, 3.3, 66], ['…THEN AT RAM. AGAIN AND AGAIN.', 565, LK2 - .2, 2.6, 60, GOLDC],
    ['"GIVE IT TO THE ONE', 470, RAMSAY - .1, 2.7, 80], ['WHO PLEASES YOU MOST."', 580, RAMSAY + .15, 2.45, 82, GOLDC],
    ['SHE GAVE IT', 470, WALK, 3.1, 86], ['TO HANUMAN.', 585, WALK + .25, 2.85, 110, GOLDC],
    ['HE SHONE LIKE A MOUNTAIN', 470, SHINE, 3.5, 72], ['WITH A WHITE CLOUD.', 570, SHINE + .25, 3.25, 82, PEARLC],
    ['NOW, THE LEGEND', 470, C0 + .1, 3.4, 86], ['EVERY DADI KNOWS:', 585, C0 + .35, 3.15, 96, GOLDC],
    ['HE BROKE THE STRING…', 500, D0 + .1, 2.3, 84],
    ['…AND BIT THE PEARLS.', 470, BITE1, 3.1, 80], ['ONE BY ONE!', 580, BITE1 + .5, 2.6, 110, GOLDC],
    ['"HANUMAN! THOSE PEARLS', 470, STAND - .2, 2.9, 74], ['ARE PRICELESS!"', 575, STAND + .05, 2.65, 100, GOLDC],
    ['"I\'M LOOKING FOR RAM', 470, MUMBLE - .1, 3.0, 80], ['INSIDE THEM."', 580, GULP, 2.2, 100, GOLDC],
    ['"NO RAM INSIDE?', 470, NORAM, 3.0, 84], ['THEN IT\'S JUST A STONE."', 575, NORAM + .4, 2.6, 80, GOLDC],
    ['"OH? THEN IS RAM', 470, MOCK, 3.0, 84], ['INSIDE YOU?"', 580, MOCK + .35, 2.65, 104, GOLDC],
    ['SO HE OPENED', 470, E0 + .1, 3.5, 86], ['HIS HEART…', 585, E0 + .4, 3.2, 104, GOLDC],
    ['…AND THERE THEY WERE.', 1460, PUSH + 1.0, 3.5, 86, GOLDC],
    ['THE COURTIER', 470, F0 + .1, 3.2, 86], ['HAD NO MORE QUESTIONS.', 580, F0 + .35, 2.95, 80, GOLDC],
    ['RAM CAME DOWN', 470, G0 + .1, 3.5, 86], ['AND HUGGED HIM TIGHT.', 580, G0 + .35, 3.25, 84, GOLDC],
    ["THAT'S WHY HANUMAN JI", 470, H0 + .1, 3.6, 72], ['IS SHOWN WITH RAM & SITA', 565, H0 + .35, 3.35, 70], ['IN HIS HEART.', 665, H0 + .6, 3.1, 100, GOLDC],
    ['NOTHING WAS PRECIOUS TO HIM', 470, H0 + 3.7, 3.4, 64], ['WITHOUT RAM IN IT.', 565, H0 + 3.95, 3.15, 84, GOLDC],
    ['WHO LIVES IN', 470, I0 + .1, 4.0, 86], ['YOUR HEART?', 585, I0 + .35, 3.75, 110, GOLDC], ['COMMENT THEIR NAME!', 700, I0 + .6, 3.5, 80],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // ---- Hanuman's look in this reel: no mala (the pearls take its place), the necklace when he wears it
  const NECK = (key, P = HN_NECK) => (u, sw) => necklaceOn(U(P, u), .3 * u, 15, key);
  const hn = (x, y, u, o) => hanuman(x, y, u, { mala: false, ...o });
  // a pearl held up to the eye (armR hook, hand space): the eye seen through it, magnified; heart: the eye a heart
  const eyePearl = (o = {}) => (u, sw) => {
    const r = .78 * u, y = -1.05 * u;
    boilSeed('eyepearl');
    pearl(0, y, r);
    if (o.eye !== false) {
      if (o.heart) paint(heartPts(o.lx || 0, y + .05 * u, .42 * u * (o.heartK ?? 1)), { wash: '#E2384E', ink: PR.ink, sw: sw * .4 });
      else {
        paint(ellPts((o.lx || 0) * u * .25, y + (o.ly || 0) * u * .2, .42 * u, (o.blink ? .06 : .48) * u, 12), { wash: '#2A160C', ink: null });
        if (!o.blink) paint(ellPts((o.lx || 0) * u * .25 - .14 * u, y - .16 * u, .14 * u, .14 * u, 8), { wash: '#FFFFFF', ink: null });
      }
      paint(ellPts(-.3 * r, y - .34 * r, .24 * r, .2 * r, 8, 0, -.4), { wash: '#FFFFFF', washOp: 200, ink: null });
    }
  };
  const heldPearl = (r = .42) => (u, sw) => { boilSeed('heldpearl'); pearl(0, -.6 * u, r * u); };
  const heldHalves = (spread = 0) => (u, sw) => { boilSeed('halves'); pearlHalf(-.25 * u - spread * u, -.6 * u, .42 * u, -1, -.3 - spread); pearlHalf(.25 * u + spread * u, -.6 * u, .42 * u, 1, .3 + spread); };
  // a pearl's flight on an arc, with two little bounces after it lands; returns [x, y] or null before it starts
  const flight = (t, t0, from, to, dur = .7, h = 260) => {
    if (t < t0) return null;
    const q = (t - t0) / dur;
    if (q < 1) return arcPt(from, to, h, q);
    const b = t - t0 - dur, hop = Math.abs(Math.sin(b * 9)) * 26 * Math.exp(-b * 5);
    return [to[0] + b * 30 * Math.exp(-b * 3), to[1] - hop];
  };

  // ================= A · the hook: a pearl at his eye; the sniff, the crunch, the peer, the toss =================
  function shotHook(t, lt, dur) {
    const zoom = easeIn(seg(t, ZOOM, B0)), X = 530, Y = 2470, u = 56;
    const o = { boilKey: 'hook', seed: 2, noShadow: true, hx: -.05 + .05 * Math.sin(t * .9), htilt: .04 * Math.sin(t * 1.1), dy: -.06 * Math.sin(t * 2.2), mouth: 'smile', eyes: 'normal' };
    // the right hand: eye → nose → mouth (crunch) → halves at the eye → toss → back down
    const EYE = [1.55, -19.7], NOSE = [1.1, -18.6], MOUTH = [.5, -17.6], DOWN = [3.9, -12.2], OVER = [5.6, -24.5];
    let hand = EYE, held = 'eye';
    if (t < SNIFF) hand = EYE;
    else if (t < BITE0) hand = kf(t, [[SNIFF, EYE], [SNIFF + .35, NOSE], [BITE0 - .3, NOSE], [BITE0 - .05, MOUTH]], ease);
    else if (t < PEER0) hand = kf(t, [[BITE0, MOUTH], [BITE0 + .5, MOUTH], [PEER0 - .1, EYE]], ease);
    else if (t < TOSS0 + .3) hand = kf(t, [[PEER0, EYE], [TOSS0 - .25, [2.0, -19.2]], [TOSS0, OVER], [TOSS0 + .3, OVER]], ease);
    else hand = kf(t, [[TOSS0 + .3, OVER], [TOSS0 + .8, DOWN]], ease);
    if (t >= SNIFF && t < BITE0 - .05) held = 'pearl';
    else if (t >= BITE0 - .05 && t < BITE0 + .55) held = null;
    else if (t >= BITE0 + .55 && t < TOSS0) held = 'halves';
    else if (t >= TOSS0) held = null;
    const peering = t < SNIFF || (t > PEER0 && t < TOSS0 - .3);
    const crunch = t > BITE0 - .05 && t < BITE0 + .7, chewK = crunch ? 1 - seg(t, BITE0 + .45, BITE0 + .7) : 0;
    o.handR = hand; o.bendR = 1.25;
    o.armR = held === 'eye' ? eyePearl({ blink: t > .8 && t < .95, lx: .1 * Math.sin(t * 2) }) : held === 'pearl' ? heldPearl() : held === 'halves' ? heldHalves(t > PEER0 ? .1 : 0) : undefined;
    if (peering && t > PEER0) o.armR = (u2, sw) => { heldHalves(.12)(u2, sw); boilSeed('peerglint'); paint(ellPts(0, -.6 * u2, .1 * u2, .1 * u2, 6), { wash: '#FFFFFF', ink: null }); };
    o.eyes = peering ? (t < SNIFF ? ['closed', 'wide'] : 'look') : crunch ? 'squeeze' : t > SNIFF && t < BITE0 ? 'look' : t > TOSS0 + .2 ? 'look' : 'normal';
    o.lookX = t > SNIFF && t < BITE0 ? .3 : t > PEER0 && t < TOSS0 ? .7 : t > TOSS0 + .2 ? -.8 : 0;
    o.lookY = t > SNIFF && t < BITE0 ? .6 : t > PEER0 && t < TOSS0 ? -.4 : t > TOSS0 + .2 ? .3 : 0;
    o.brow = t > PEER0 && t < TOSS0 + 1.4 ? .8 : 0;
    o.mouth = t > BITE0 - .3 && t < BITE0 - .05 ? 'O' : crunch ? 'flat' : t > PEER0 && t < TOSS0 ? 'O' : t > TOSS0 + .2 ? 'frown' : 'smile';
    o.hat = (u2, sw) => cheeks(u2, sw, chewK, o, (t - BITE0) * 3.5);
    o.htilt += t > SNIFF && t < BITE0 ? .05 * Math.sin(t * 30) * (1 - seg(t, BITE0 - .4, BITE0)) : 0;
    o.sq = crunch ? .04 * Math.sin((t - BITE0) * 22) * (1 - seg(t, BITE0, BITE0 + .5)) : 0;
    if (t > PEER0 + .1 && t < TOSS0 + .1) { o.emote = '?'; o.emoteK = pop(t, PEER0 + .1); o.emoteAge = t - PEER0; }
    // the necklace in his left hand, hanging in a loop
    o.handL = kf(t, [[0, [-3.7, -12.6]], [TOSS0 + .4, [-3.7, -12.6]], [TOSS0 + .9, [-2.6, -18.4]]], ease); o.bendL = 1;
    o.armL = (u2, sw) => necklaceOn([[0, -.2 * u2], [-.5 * u2, 1.6 * u2], [0, 2.6 * u2], [.5 * u2, 1.6 * u2], [0, -.2 * u2]], .3 * u2, 11, 'hookneck', false);
    if (t > TOSS0 + .9) o.lookX = -.6, o.lookY = .1, o.eyes = 'look', o.mouth = t > ZOOM - .5 ? 'smile' : 'frown';
    const c = [540, 1180 - 20 * Math.sin(t * .5), 1.0 + .012 * t];
    if (zoom > 0) { const p = naradaHand(X, Y, u, o, -1); c[0] = lerp(c[0], p[0], zoom); c[1] = lerp(c[1], p[1] + 2.6 * u, zoom); c[2] = lerp(c[2], 4.5, zoom); }
    camBegin(c[0], c[1], c[2]);
    peachGround(t);
    hn(X, Y, u, o);
    // the tossed halves fly off over his shoulder
    if (t > TOSS0) {
      const from = naradaLocal(X, Y, u, o, 5.6, -25.4);
      boilSeed('tossA');
      for (const s of [-1, 1]) { const p = flight(t, TOSS0, from, [from[0] + 300 + s * 70, from[1] + 1100], .9, 260 + s * 40); if (p) pearlHalf(p[0], p[1], 24, s, (t - TOSS0) * 8 * s); }
    }
    camEnd();
    caps(t);
    if (zoom > 0) { flushLetters(); boilSeed('pearlcover'); const r = 1600 * easeIn(seg(t, B0 - .35, B0)); if (r > 1) { paint(ellPts(540, 960, r, r, 30), { wash: PR.pearl, ink: null }); } }
  }

  // ================= the court cast (everyone but Hanuman) =================
  const RX = 540, RY = 1250, RU = 20;
  const HX = 380, HY = 1700, HU = 20;
  // phase: 'gift' | 'bite' | 'wow' | 'hug'
  function courtCast(t, phase, list) {
    // Ram on the throne (not in the hug, where he walks)
    if (phase !== 'hug') {
      const sayR = t > RAMSAY && t < RAMSAY + 2.0, teary = phase === 'wow';
      const ro = { boilKey: 'ramc', seed: 11, sit: 1, kodanda: false, hx: phase === 'gift' && t > RAMSAY - .3 && t < WALK ? .45 : -.25 + .1 * Math.sin(t * .7), lookX: phase === 'gift' && t > RAMSAY - .3 && t < WALK ? .8 : -.6, lookY: .4,
        eyes: teary ? 'teary' : blinkAt(t, 9.1) || blinkAt(t, 15.8) || blinkAt(t, 40.2) || (phase === 'bite' && t < STAND ? 'happy' : 'normal'),
        mouth: phase === 'gift' ? talk(t, RAMSAY, RAMSAY + 2.0) : phase === 'bite' ? 'smile' : 'wobble', bow: sayR ? .15 : 0,
        handL: [-3.9, -10.6], handR: sayR ? [5.0, -14.4] : [3.9, -10.6] };
      list.push([RY, () => ram(RX, RY, RU, ro)]);
    }
    // Lakshman
    const gasp = phase === 'bite' && t > BITE1 && t < STAND + .5, wow = phase === 'wow';
    list.push([1330, () => lakshman(250, 1330, 19, { boilKey: 'lks', seed: 9, hx: .45, lookX: .8, lookY: .3,
      eyes: wow ? 'wide' : gasp ? 'wide' : blinkAt(t, 12.4) || 'normal', mouth: wow ? 'O' : gasp ? 'O' : phase === 'bite' && t > MOCK ? 'frown' : 'smile',
      pray: wow ? ease(seg(t, TURBAN + .4, TURBAN + .9)) : 0, brow: gasp ? .9 : 0 })]);
    // Sita (in the gift she walks down to Hanuman; elsewhere she stands by the throne)
    let sx = 830, sy = 1330, su = 19, so = { pal: SITA_PAL, ...SITA_SKIN, boilKey: 'sitac', seed: 10, hx: -.4, lookX: -.9, lookY: .3, eyes: 'normal', mouth: 'smile', blush: .3 };
    if (phase === 'gift') {
      const w = ease(seg(t, WALK, WALK + 1.5)), walking = t > WALK && t < WALK + 1.5;
      sx = lerp(830, 560, w); sy = lerp(1330, 1680, w); su = lerp(19, 20, w);
      so.walk = walking ? (t - WALK) * 1.6 : null;
      // her looks: down-left to the vanaras (LK1, LK3), to Ram (LK2, LK4), then at Hanuman
      const look = t < LK1 - .1 ? 0 : t < LK2 - .1 ? 1 : t < LK3 - .1 ? 2 : t < LK4 - .1 ? 1 : t < RAMSAY + 1.6 ? 2 : 1;
      if (look === 1) { so.hx = -.55; so.lookX = -1; so.lookY = .6; }
      else if (look === 2) { so.hx = -.7; so.lookX = -1; so.lookY = -.3; }
      else { so.hx = -.1; so.lookX = -.2; so.lookY = .5; }
      if (t > RAMSAY + 1.6 && t < WALK + 1.4) { so.mouth = 'smile'; }
      so.eyes = blinkAt(t, 9.6) || blinkAt(t, 14.9) || 'normal';
      // the necklace: on her neck → lifted off over her head (OFF) → held before her → given (PLACE)
      const off = ease(seg(t, OFF - .2, OFF + .9)), lift = t > OFF - .2 && t < OFF + 1.2;
      if (t > OFF - .4 && t < PLACE + .2) {
        const hold = t > OFF + .9;
        const give = ease(seg(t, PLACE - .5, PLACE));
        if (lift) { so.handL = kf(t, [[OFF - .4, [-1.6, -16.6]], [OFF + .3, [-2.0, -23.6]], [OFF + 1.1, [-2.6, -13.6]]], ease); so.handR = kf(t, [[OFF - .4, [1.6, -16.6]], [OFF + .3, [2.0, -23.6]], [OFF + 1.1, [2.6, -13.6]]], ease); so.bendL = so.bendR = 1.2; }
        else if (hold) { so.handL = [lerp(-2.6, -4.8, give), lerp(-13.6, -14.2, give)]; so.handR = [lerp(2.6, -1.8, give), lerp(-13.6, -14.8, give)]; so.bendL = so.bendR = 1.1; so.lean = -1.4 * give; }
      }
      list.push([sy, () => {
        parvati(sx, sy, su, so);
        // the necklace
        if (t < OFF - .2) necklaceOn([[-1.75, -17.1], [-1.25, -15.6], [0, -15.0], [1.25, -15.6], [1.75, -17.1]].map(([a, b]) => sitaLocal(sx, sy, su, so, a, b)), .27 * su, 11, 'sitaneck');
        else if (t < PLACE + .05) {
          const hl = parvatiHand(sx, sy, su, so, -1), hr = parvatiHand(sx, sy, su, so, 1), mx = (hl[0] + hr[0]) / 2, sag = (lift ? 1.2 : 3.2) * su;
          necklaceOn([hl, [mx - (hr[0] - hl[0]) * .3, Math.max(hl[1], hr[1]) + sag * .8], [mx, Math.max(hl[1], hr[1]) + sag], [mx + (hr[0] - hl[0]) * .3, Math.max(hl[1], hr[1]) + sag * .8], hr], .27 * su, 13, 'sitaneck');
          if (t > OFF + .5 && t < OFF + 1.4) sparkleBurst(mx, Math.max(hl[1], hr[1]) + sag, 50, t - OFF - .5, 'offglint');
        }
      }]);
      return { sx, sy, su, so };
    }
    if (phase === 'wow') { so.eyes = 'teary'; so.handL = [-.9, -18.6]; so.handR = [.9, -18.6]; so.bendL = so.bendR = 1.3; so.mouth = 'smile'; }
    if (phase === 'bite') { so.eyes = blinkAt(t, 36.4) || (t > BITE1 && t < STAND ? 'happy' : 'normal'); so.mouth = 'smile'; }
    list.push([sy, () => parvati(sx, sy, su, so)]);
    return { sx, sy, su, so };
  }
  // the courtiers: the elder (who objects) front right, the younger behind him
  function courtiers(t, phase, list, over = {}) {
    const mock = phase === 'bite' && t > MOCK && t < HUSH + .6, snick = mock && t > MOCK + 1.2;
    const gasp = phase === 'bite' && t > BITE1 && t < STAND, angry = phase === 'bite' && t > STAND - .3 && t < MUMBLE + 1;
    const bonked = phase === 'bite' && t > BONK && t < BONK + 1.2;
    list.push([1380, () => narada(1055, 1380, 16, { pal: COURT2, col: COURT2.skin, dk: COURT2.skinDk, lt: COURT2.skinLt, veena: false, topknot: false, hat: turbanHat, boilKey: 'ct2', seed: 8,
      hx: -.6, lookX: -1, lookY: .3, eyes: phase === 'wow' ? 'wide' : snick ? 'happy' : gasp ? 'wide' : 'normal', mouth: phase === 'wow' ? 'O' : snick ? (Math.sin(t * 22) > 0 ? 'grin' : 'smile') : gasp ? 'O' : 'smile',
      handR: snick ? [.6, -18.0] : undefined, bendR: 1.2, dy: snick ? -.15 * Math.abs(Math.sin(t * 11)) : 0 })]);
    const turbanOff = phase === 'wow' && t > TURBAN, flushK = angry ? 1 : 0;
    const co = { pal: COURT1, col: COURT1.skin, dk: COURT1.skinDk, lt: COURT1.skinLt, beard: '#EDE6DC', veena: false, topknot: false, hat: turbanOff ? undefined : turbanHat, boilKey: 'ct1', seed: 7,
      hx: -.55, lookX: -1, lookY: .4, eyes: phase === 'wow' ? 'wide' : mock ? 'smug' : angry ? 'angry' : gasp || bonked ? 'wide' : blinkAt(t, 22.2) || 'normal',
      mouth: phase === 'wow' ? 'scream' : mock ? (t < MOCK + 1.6 ? talk(t, MOCK, MOCK + 1.6, 'smug') : 'smug') : angry ? talk(t, STAND - .1, STAND + 1.8, 'frown', 'open') : gasp || bonked ? 'O' : 'smile',
      tint: angry ? 'flush' : undefined, tintK: flushK, brow: mock ? .6 : angry ? -1 : 0, puff: mock ? .6 : 0, ...over };
    if (angry) { co.handR = [-1.0 + .5 * Math.sin(t * 14), -21.5]; co.bendR = 1.3; }   // a wagging finger
    if (mock) { co.handL = [1.6, -14.6]; co.handR = [-1.6, -14.2]; co.bendL = co.bendR = .5; }   // arms crossed
    if (bonked) { co.emote = 'stars'; co.emoteK = pop(t, BONK); co.emoteAge = t - BONK; }
    list.push([1500, () => {
      narada(985, 1500, 18, co);
      if (phase === 'wow' && t > TURBAN) {   // the turban pops off and tumbles to the floor
        const h = naradaTop(985, 1500, 18, { ...co, hat: turbanHat }), p = flight(t, TURBAN, [h[0], h[1] + 40], [880, 1640], .8, 300);
        if (p) turbanFly(p[0], p[1], 18, (t - TURBAN) * 7);
        if (t < TURBAN + .4) sparkleBurst(h[0], h[1] + 40, 40, t - TURBAN, 'turbpop');
      }
    }]);
    return co;
  }
  // the two vanara friends (sitting, behind-left of Hanuman); hope 0..1 leans them in toward Sita
  function vanaras(t, phase, list, hope = 0, mood = 'normal') {
    const V = [[VAN1, 150, 1630, 16, 21], [VAN2, 250, 1575, 15, 22]];
    V.forEach(([pal, x, y, u, seed], i) => {
      const o = { pal, crown: false, sit: 1, boilKey: 'van' + i, seed, hx: .4 + .2 * hope, lookX: .7, lookY: -.2, lean: 1.4 * hope, tailSway: t * 1.5 + i * 2,
        eyes: mood === 'heart' ? 'heart' : mood === 'cry' ? 'teary' : mood === 'wide' ? 'wide' : hope > .5 ? 'wide' : blinkAt(t, 9.3 + i * 2.1) || 'normal',
        mouth: mood === 'heart' ? 'grin' : mood === 'cry' ? 'wobble' : mood === 'wide' ? 'O' : hope > .5 ? 'grin' : 'smile', blush: hope * .6 };
      if (mood === 'heart') { o.emote = 'hearts'; o.emoteK = 1; o.emoteAge = t + i; }
      list.push([y, () => hn(x, y, u, o)]);
    });
  }
  const drawList = list => { list.sort((a, b) => a[0] - b[0]); for (const [, f] of list) f(); };

  // ================= B · Ram's court: the necklace; the looks; "give it to the one"; she gives it to Hanuman =================
  function shotGift(t, lt, dur) {
    const shine = ease(seg(t, SHINE, SHINE + 1.6));
    camK(t, [[B0, [560, 1090, 1.15]], [OFF - .3, [600, 1060, 1.2]], [OFF + 1.4, [700, 1010, 1.38]], [LK1 - .5, [700, 1010, 1.4]], [LK1, [520, 1150, 1.2]], [RAMSAY - .4, [520, 1150, 1.22]], [RAMSAY, [640, 1060, 1.38]], [WALK, [640, 1070, 1.38]], [WALK + 1.4, [470, 1320, 1.7]], [SHINE, [460, 1320, 1.72]], [SHINE + 1.8, [430, 1320, 1.75]], [C0, [430, 1320, 1.8]]]);
    court(t);
    throne(RX, RY, t);
    const list = [];
    courtCast(t, 'gift', list);
    courtiers(t, 'gift', list);
    // hope: the vanaras lean in each time she looks their way
    const hope = (t > LK1 && t < LK2 - .1) || (t > LK3 && t < LK4 - .1) ? ease(clamp((t - (t < LK2 ? LK1 : LK3)) * 5)) : 0;
    vanaras(t, 'gift', list, hope, t > SHINE + .3 ? 'heart' : 'normal');
    // Hanuman: sits; looks behind himself when she looks down ("me?"); stands with a hop as she comes; cupped hands;
    // takes the necklace and puts it on over his head; shines
    const stand = t > WALK + .9, hop = jump(t, WALK + .9, WALK + 1.35, 1.2);
    const behind = (t > LK1 + .15 && t < LK2) || (t > LK3 + .15 && t < LK4);
    const o = { boilKey: 'hgift', seed: 4, sit: stand ? 0 : 1, hx: behind ? -.9 : .35, lookX: behind ? -1 : .8, lookY: behind ? 0 : -.4, tail: 'curl',
      eyes: blinkAt(t, 9.0) || (behind ? 'look' : t > WALK + .2 && t < PLACE + .4 ? 'wide' : t > PLACE + .4 && t < SHINE ? 'happy' : 'normal'),
      mouth: behind ? 'O' : t > WALK + .2 && t < PLACE ? 'O' : t > PLACE ? 'grin' : 'smile', blush: t > PLACE ? .8 : 0,
      pray: !stand && !behind ? 1 : 0, dy: stand ? hop.dy : 0, sq: stand ? hop.sq : 0, htilt: behind ? .1 : 0 };
    if (stand) o.tail = 'droop';
    if (t > WALK + .2 && t < WALK + .9) { o.emote = '!'; o.emoteK = pop(t, WALK + .2); o.emoteAge = t - WALK; }
    if (behind) { o.emote = '?'; o.emoteK = pop(t, t < LK2 ? LK1 + .15 : LK3 + .15); o.emoteAge = t - LK1; }
    // the necklace on him: in his hands (PLACE), up over his head, down round his neck (PLACE + .9 → + 1.4)
    const clutch = ease(seg(t, PLACE + .5, PLACE + .8)), wearing = t > PLACE + 1.35;
    if (stand && t < PLACE + 1.35) {
      o.handL = [lerp(-.6, -.9, clutch), lerp(-13.8, -15.4, clutch)]; o.handR = [lerp(5.8, .9, clutch), lerp(-14.6, -15.4, clutch)]; o.bendL = 1; o.bendR = 1;
      if (clutch > .5) { o.eyes = 'closed'; o.mouth = 'grin'; o.htilt = -.1; o.emote = 'hearts'; o.emoteK = pop(t, PLACE + .7); o.emoteAge = t - PLACE; }
    }
    if (wearing) o.chest = NECK('hneck');
    if (t > SHINE + .2) { o.handL = [-1.6, -14.6]; o.bendL = .8; o.handR = [3.45, -10.8]; }   // a hand on the pearls, proud
    list.push([HY, () => {
      if (t > SHINE) { const hd = naradaHead(HX, HY, HU, o); glow(hd[0], hd[1] + 6 * HU, 300, '#FFF6E0', .9 * shine); }
      hn(HX, HY, HU, o);
      if (stand && t > PLACE - .05 && t < PLACE + 1.35) {   // the necklace in his cupped hands, then clutched to his chest
        const hl = naradaHand(HX, HY, HU, o, -1), hr = naradaHand(HX, HY, HU, o, 1), mx = (hl[0] + hr[0]) / 2, my = Math.max(hl[1], hr[1]);
        necklaceOn([hl, [mx - 14, my + 22 - 10 * clutch], [mx + 14, my + 26 - 10 * clutch], hr], .32 * HU, 12, 'hgiveneck');
      }
      if (t > PLACE + 1.2 && t < PLACE + 1.9) sparkleBurst(...naradaLocal(HX, HY, HU, o, 0, -15), 70, t - PLACE - 1.2, 'wearpoof', 10);
    }]);
    drawList(list);
    if (t > SHINE) {   // the white cloud drifting past his crown, and sparkles
        const top = naradaTop(HX, HY, HU, o), cx = top[0] - 120 + 160 * seg(t, SHINE, C0), cy = top[1] - 40;
        boilSeed('whitecloud');
        for (const [dx, dy, r] of [[-50, 10, 46], [0, -14, 58], [52, 8, 44], [10, 24, 50]]) paint(ellPts(cx + dx, cy + dy, r * shine, r * .72 * shine, 16), { wash: '#FFFFFF', ink: PR.ink, sw: .7 });
        paint(ellPts(cx, cy + 16, 100 * shine, 30 * shine, 16), { wash: '#FFFFFF', ink: null });
        for (let i = 0; i < 5; i++) { const a = t * 1.3 + i * 1.26, p = naradaLocal(HX, HY, HU, o, Math.cos(a) * 5, -15 + Math.sin(a) * 6); boilSeed('shinesp' + i); paint(starPts(p[0], p[1], 9 + 5 * Math.sin(t * 6 + i), .3, 4), { wash: '#FFFDF2', ink: null }); }
    }
    camEnd();
    if (lt < .5) { boilSeed('pearliris'); iris(540, 960, lerp(0, 1500, easeOut(lt / .5)), PR.pearl); }
    caps(t);
    wipeOut(lt, dur, PEACH);
  }

  // ================= C · the bridge: admiring the necklace; a pearl to his eye; "?" =================
  function shotBridge(t, lt, dur) {
    camBegin(540, 1180, 1.0 + .015 * lt);
    peachGround(t);
    const X = 540, Y = 2330, u = 50, rock = Math.sin(t * 3.2);
    const eye = ease(seg(t, EYE1 - .4, EYE1)), huh = t > HUH;
    const o = { boilKey: 'hbridge', seed: 5, noShadow: true, hx: .05 * rock, htilt: .07 * rock * (1 - eye), dy: -.08 * Math.abs(rock),
      eyes: eye > .5 ? ['closed', 'wide'] : blinkAt(t, 24.3) || 'happy', mouth: huh ? 'frown' : eye > .5 ? 'flat' : 'grin', blush: .5 * (1 - eye), brow: huh ? .9 : 0 };
    // both hands hold the strand out from his chest; then the right lifts one pearl to his eye
    o.handL = [-1.7, -15.4]; o.handR = [lerp(1.7, 1.55, eye), lerp(-15.4, -19.7, eye)]; o.bendL = .8; o.bendR = lerp(.8, 1.25, eye);
    if (eye > .5) o.armR = eyePearl({ lx: huh ? .3 * Math.sin(t * 7) : 0, blink: t > HUH + .5 && t < HUH + .62 });
    o.chest = (uu, sw) => {
      const hl = [o.handL[0] * uu, o.handL[1] * uu], hr = [o.handR[0] * uu, (o.handR[1] - (eye > .5 ? 1.05 : 0)) * uu];
      necklaceOn([[-2.15 * uu, -17 * uu], [hl[0] - .3 * uu, hl[1] + .4 * uu], [lerp(0, hr[0] * .6, eye), lerp(-14.6, -16.8, eye) * uu], [hr[0] + .2 * uu, hr[1] + .5 * uu], [2.15 * uu, -17 * uu]], .3 * uu, 15, 'bneck', false);
    };
    if (huh) { o.emote = '?'; o.emoteK = pop(t, HUH); o.emoteAge = t - HUH; }
    hn(X, Y, u, o);
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
  }

  // ================= D · the biting: snap; crunch crunch; the bonk; "priceless!"; "looking for Ram"; the mock =================
  // which camera: wide two-shot, Hanuman close, the courtier close
  const MED = [[390, 1460, 1.7], [385, 1455, 1.8]], WIDE = [[540, 1160, 1.2], [545, 1155, 1.23]], HCLOSE = [[420, 1445, 2.3], [425, 1440, 2.4]], CCLOSE = [[930, 1065, 2.3], [935, 1060, 2.4]];
  const BONKCAM = [[860, 1150, 1.75], [870, 1140, 1.85]];
  const CUTS = [[D0, MED], [BONK - .55, BONKCAM], [BITE3 - .35, MED], [STAND - .2, CCLOSE], [MUMBLE - .1, HCLOSE], [MOCK, CCLOSE], [HUSH, [[425, 1440, 2.4], [425, 1430, 2.75]]], [E0, null]];
  const camCut = t => { let i = 0; while (i < CUTS.length - 2 && t >= CUTS[i + 1][0]) i++; return [CUTS[i][1], CUTS[i][0], CUTS[i + 1][0]]; };
  // Hanuman's right hand through the bites (body u, before the sit drop) and what it holds
  const LAP = [1.8, -11.6], MOUTHS = [.55, -17.7], EYES = [1.55, -19.7], OVERS = [5.4, -23.6];
  function biteState(t) {
    let i = -1; for (let k = 0; k < BITES.length; k++) if (t > BITES[k] - .5) i = k;
    if (i < 0) return { hand: [3.4, -12.0], held: null, bites: 0 };
    const tb = BITES[i], slow = i < 3, next = BITES[i + 1] ?? tb + 3;
    const keys = slow
      ? [[tb - .5, LAP], [tb - .3, LAP], [tb - .05, MOUTHS], [tb + .3, MOUTHS], [tb + .5, EYES], [tb + .75, EYES], [tb + .88, OVERS], [Math.min(next - .5, tb + 1.1), LAP]]
      : [[tb - .3, LAP], [tb - .05, MOUTHS], [tb + .1, MOUTHS], [tb + .2, OVERS], [Math.min(next - .3, tb + .3), LAP]];
    const hand = kf(t, keys, ease);
    const held = t < tb - .05 ? 'pearl' : slow ? (t < tb + .3 ? null : t < tb + .88 ? 'halves' : null) : (t < tb + .1 ? null : t < tb + .2 ? 'halves' : null);
    return { hand, held, bites: i + (t > tb ? 1 : 0), i, tb, slow, peer: slow && t > tb + .5 && t < tb + .88, crunch: t > tb - .05 && t < tb + (slow ? .3 : .12) };
  }
  // where each bite's halves land: the first two behind him, the third on the courtier's turban, the rest a pile
  const tossT = k => BITES[k] + (k < 3 ? .88 : .2);
    function shotBite(t, lt, dur) {
    const [[A, B], c0, c1] = camCut(t), cq = seg(t, c0, c1);
    camBegin(lerp(A[0], B[0], ease(cq)), lerp(A[1], B[1], ease(cq)), lerp(A[2], B[2], ease(cq)));
    court(t);
    throne(RX, RY, t);
    const list = [];
    courtCast(t, 'bite', list);
    const co = courtiers(t, 'bite', list);
    vanaras(t, 'bite', list, 0, t > BITE1 && t < STAND ? 'wide' : 'normal');
    // the pile of halves behind him grows with each toss that has landed
    const landed = BITES.filter((_, k) => k !== 1 && t > tossT(k) + .7).length;
    list.push([1690, () => { if (landed > 0) pearlPile(250, 1690, landed * 2, 150, 'pile', 10); }]);
    // Hanuman
    const S = biteState(t), snapK = ease(seg(t, SNAP - .5, SNAP)), snapped = t > SNAP;
    const full = clamp(seg(t, FAST - .2, FAST + 1.6)) * (1 - ease(seg(t, GULP, GULP + .25)));
    const mumbling = t > MUMBLE && t < GULP, hush = t > HUSH;
    const o = { boilKey: 'hbite', seed: 6, sit: 1, hx: hush ? .6 : t > STAND - .2 && t < MOCK ? .55 : .3, lookX: hush || (t > STAND - .2 && t < MOCK + .1) ? 1 : .2, lookY: -.3, tail: hush ? 'droop' : 'curl',
      eyes: S.crunch ? 'squeeze' : S.peer ? 'look' : hush ? (t > HUSH + .45 ? 'closed' : 'normal') : t > STAND - .2 && t < MUMBLE ? 'wide' : blinkAt(t, 28.2) || blinkAt(t, 42.4) || 'normal',
      mouth: S.crunch ? 'flat' : mumbling ? (Math.sin(t * 24) > 0 ? 'flat' : 'cat') : t > GULP + .3 && t < NORAM - .1 ? talk(t, GULP + .3, NORAM - .2) : t > NORAM && t < NORAM + 2.7 ? talk(t, NORAM, NORAM + 2.5, 'smile') : hush ? 'flat' : t > STAND - .2 && t < MUMBLE ? 'O' : 'smile',
      brow: S.peer ? .9 : hush ? -.2 : 0 };
    o.hat = (uu, sw) => cheeks(uu, sw, Math.max(S.crunch && !snapped ? 0 : S.crunch ? .7 : 0, full), o, t * 3);
    if (t < SNAP + .1) { o.handL = [lerp(-1.7, -2.9, snapK), -15.2]; o.handR = [lerp(1.7, 2.9, snapK), -15.2]; o.bendL = o.bendR = .8; }
    else if (t > MUMBLE - .1 && t < HUSH) { o.handR = t > TOSS - .3 && t < TOSS + .4 ? kf(t, [[TOSS - .3, [3.6, -12]], [TOSS, OVERS], [TOSS + .4, [3.6, -12]]], ease) : [3.6, -12.0]; o.handL = [-3.6, -11.6]; }
    else { o.handR = S.hand; o.bendR = 1.2; o.handL = [-3.4, -11.6]; }
    if (hush) { o.handL = [-3.3, -11.4]; o.handR = [3.3, -11.4]; }
    o.armR = S.held === 'pearl' ? heldPearl() : S.held === 'halves' ? heldHalves(S.peer ? .1 : 0) : t > TOSS - .3 && t < TOSS ? heldHalves(0) : undefined;
    if (S.peer) { o.emote = '?'; o.emoteK = pop(t, S.tb + .5, 6); o.emoteAge = t - S.tb; }
    if (!snapped) o.chest = (uu, sw) => {   // the strand pulled taut, then SNAP
      const hl = [o.handL[0] * uu, o.handL[1] * uu], hr = [o.handR[0] * uu, o.handR[1] * uu];
      necklaceOn([[-2.15 * uu, -17 * uu], [hl[0], hl[1] + .3 * uu], [0, lerp(-14.4, -15.0, snapK) * uu], [hr[0], hr[1] + .3 * uu], [2.15 * uu, -17 * uu]], .3 * uu, 15, 'dneck', false);
    };
    list.push([HY, () => {
      hn(HX, HY, HU, o);
      // the lap of pearls: fly in from the snap, then one fewer per bite
      const lap = naradaLocal(HX, HY, HU, { sit: 0 }, 0, -2.4), n = 15 - S.bites;
      boilSeed('lap');
      for (let k = 0; k < 15; k++) {
        if (k < 15 - n) continue;
        const home = [lap[0] + (hash(k * 1.7) - .5) * 5.4 * HU, lap[1] + (hash(k * 3.3) - .5) * 1.0 * HU - 6];
        if (t < SNAP) continue;
        const ang = (k / 14 - .5) * 2.4, from = naradaLocal(HX, HY, HU, o, Math.sin(ang) * 2.2, -15 + Math.cos(ang) * 1.4);
        const p = flight(t, SNAP + hash(k) * .12, from, home, .45 + hash(k * 2) * .2, 90 + hash(k * 5) * 80);
        if (p) pearl(p[0], p[1], .3 * HU);
      }
      if (t > SNAP && t < SNAP + .5) sparkleBurst(...naradaLocal(HX, HY, HU, o, 0, -15), 50, t - SNAP, 'snap');
      // the tossed halves
      BITES.forEach((tb, k) => {
        const t0 = tossT(k); if (t < t0) return;
        const from = naradaLocal(HX, HY, HU, o, OVERS[0], OVERS[1] + .8);
        boilSeed('toss' + k);
        if (k === 1) {   // the bonk
          const h = naradaTop(985, 1500, 18, co), to = [h[0] + 10, h[1] + 30];
          if (t < BONK) { const p = arcPt(from, to, 320, seg(t, t0, BONK)); pearlHalf(p[0], p[1], 15, 1, t * 9); pearlHalf(p[0] - 20, p[1] + 8, 15, -1, t * 8); }
          else {
            const p = flight(t, BONK, to, [930, 1620], .6, 120); if (p) { pearlHalf(p[0], p[1], 15, 1, t * 5); pearlHalf(p[0] - 22, p[1] + 6, 15, -1, -t * 5); }
            if (t < BONK + .9) { boilSeed('bonkstars'); emote('stars', h[0], h[1] - 10, 34, pop(t, BONK, 6), t - BONK); sparkleBurst(to[0], to[1], 34, t - BONK, 'bonkhit', 6); }
          }
          return;
        }
        if (t > t0 + .7) return;   // landed: drawn in the pile
        const to = [200 + k * 25, 1690], p = arcPt(from, to, 220, seg(t, t0, t0 + .7));
        pearlHalf(p[0], p[1], 10, 1, t * 9); pearlHalf(p[0] - 14, p[1] + 6, 10, -1, -t * 8);
      });
      if (t > TOSS && t < TOSS + .8) { const from = naradaLocal(HX, HY, HU, o, OVERS[0], OVERS[1] + .8), p = arcPt(from, [180, 1700], 240, seg(t, TOSS, TOSS + .8)); boilSeed('toss last'); pearlHalf(p[0], p[1], 10, 1, t * 9); }
    }]);
    drawList(list);
    camEnd();
    caps(t);
  }

  // ================= E · the heart: he opens his chest; tiny Ram and Sita inside; they wave =================
  function shotHeart(t, lt, dur) {
    const X = 540, Y = 2080, u = 50;
    const k = backOut(clamp(seg(t, OPEN, OPEN + .7))) * (t > OPEN ? 1 : 0), push = ease(seg(t, PUSH, PUSH + 1.4)), out = ease(seg(t, F0 - .45, F0));
    const HC = [X, Y + HEART_C[1] * u];
    const z = lerp(1.0, 2.9, push) * (1 - .3 * out), cy = lerp(1180, HC[1] + 55, push);
    camBegin(lerp(540, HC[0], push), cy, z);
    court(t);
    boilSeed('heartveil'); paint(rectPts(-200, -300, W + 400, H + 600), { wash: '#FFE6CC', washOp: 150, ink: null });
    glow(HC[0], HC[1], 700, '#FFC870', .6 * clamp(k));
    const grip = ease(seg(t, GRIP - .3, GRIP + .3));
    const o = { boilKey: 'hheart', seed: 13, noShadow: true, hx: 0, lookX: 0, lookY: .1, eyes: t < OPEN + .5 ? (t > GRIP - .4 ? 'closed' : 'normal') : t > PUSH ? 'happy' : 'normal',
      mouth: t > OPEN + .5 ? 'smile' : 'flat', brow: 0, bow: .15 * grip * (1 - clamp(k)), htilt: t > PUSH ? .05 * Math.sin(t * 1.4) : 0 };
    const edge = HEART_R * (1 - (1 - .86 * clamp(k))) + .05;   // the doors' free edges
    if (t < GRIP - .3) { o.pray = 1; }
    else { o.handL = [lerp(-.6, -edge - .1, clamp(k)), -15.6]; o.handR = [lerp(.6, edge + .1, clamp(k)), -15.6]; o.bendL = o.bendR = 1.0; }
    o.chest = (uu, sw) => heartReveal(uu, sw, k, { t, key: 'eheart', wave: t > WAVE ? ease(seg(t, WAVE, WAVE + .3)) * (1 - ease(seg(t, WAVE + 1.8, WAVE + 2.1))) : 0 });
    hn(X, Y, u, o);
    if (t > OPEN && t < OPEN + .8) sparkleBurst(HC[0], HC[1], 160, t - OPEN, 'openburst', 12);
    if (t > OPEN + .6) { boilSeed('eheartsup'); for (let i = 0; i < 6; i++) { const a = frac(t * .35 + i / 6), x = HC[0] + Math.sin(i * 2.1 + t) * 160 + (i - 2.5) * 50, y = HC[1] - 60 - a * 420; paint(heartPts(x, y, 16 * (1 - a * .4)), { wash: i % 2 ? '#F26A8A' : '#FF9AB0', washOp: 230 * (1 - a), ink: null }); } }
    camEnd();
    caps(t);
  }

  // ================= F · the court, wide: jaws drop; the turban pops off; happy tears =================
  function shotWow(t, lt, dur) {
    camK(t, [[F0, [600, 1470, 1.14]], [G0, [580, 1470, 1.18]]]);
    court(t);
    throne(RX, RY, t);
    const list = [];
    courtCast(t, 'wow', list);
    courtiers(t, 'wow', list);
    vanaras(t, 'wow', list, 0, 'cry');
    list.push([1690, () => pearlPile(250, 1690, 14, 150, 'pile', 10)]);
    const o = { boilKey: 'hwow', seed: 14, hx: .1, lookX: .3, eyes: 'happy', mouth: 'smile', handL: [-2.3, -15.6], handR: [2.3, -15.6], bendL: 1, bendR: 1,
      chest: (uu, sw) => heartReveal(uu, sw, 1, { t, key: 'fheart' }) };
    list.push([HY, () => { const p = naradaLocal(HX, HY, HU, o, 0, -15); glow(p[0], p[1], 260, '#FFD27A', .8); hn(HX, HY, HU, o); }]);
    drawList(list);
    camEnd();
    caps(t);
  }

  // ================= G · Ram comes down; the hug; the heart heals; one last pearl; he sees Ram through it =================
  function shotHug(t, lt, dur) {
    camK(t, [[G0, [520, 1330, 1.45]], [HUG, [460, 1320, 1.65]], [GIVE, [450, 1320, 1.7]], [PEEK + .2, [410, 1300, 2.0]], [H0, [410, 1295, 2.05]]]);
    court(t);
    throne(RX, RY, t);
    const list = [];
    courtCast(t, 'hug', list);
    courtiers(t, 'hug', list, { hat: undefined, eyes: 'happy', mouth: 'smile', tint: undefined });
    vanaras(t, 'hug', list, 0, 'heart');
    list.push([1690, () => pearlPile(250, 1690, 14, 150, 'pile', 10)]);
    const walkK = ease(seg(t, G0, HUG - .15)), hug = t > HUG - .15 && t < GIVE - .4, heal = 1 - ease(seg(t, HEAL, HEAL + .8));
    const RXh = lerp(720, 512, walkK), RYh = 1712;
    const ro = { boilKey: 'rhug', seed: 15, walk: walkK > 0 && walkK < 1 ? (t - G0) * 1.6 : null, hx: -.45, lookX: -.9, lookY: .1, kodanda: false,
      eyes: hug ? 'closed' : 'teary', mouth: 'smile', htilt: hug ? -.16 : 0 };
    if (hug) { ro.handL = [-5.4, -15.2]; ro.bendL = -.6; ro.blush = .4; }   // side by side, heads together, his hand on Hanuman's heart
    if (t > GIVE - .5 && t < PEEK) { ro.handL = kf(t, [[GIVE - .5, [-3.9, -10.6]], [GIVE, [-5.8, -14.2]], [GIVE + .6, [-5.8, -14.2]], [GIVE + 1.0, [-3.9, -10.6]]], ease); ro.armL = t < GIVE + .1 ? heldPearl(.38) : undefined; ro.eyes = 'happy'; }
    if (t > PEEK) { ro.eyes = 'happy'; ro.mouth = 'grin'; }
    list.push([RYh + 1, () => ram(RXh, RYh, 20, ro)]);
    const ho = { boilKey: 'hhug', seed: 16, hx: .45, lookX: .9, lookY: -.1, eyes: hug ? 'closed' : 'happy', mouth: hug ? 'smile' : 'grin', htilt: hug ? .12 : 0, blush: .5,
      chest: (uu, sw) => heartReveal(uu, sw, heal, { t, key: 'gheart' }) };
    if (!hug && t < GIVE - .4) { ho.handL = [-2.3, -15.6]; ho.handR = [2.3, -15.6]; ho.bendL = ho.bendR = 1; ho.eyes = 'teary'; ho.mouth = 'wobble'; }
    if (hug) { ho.handR = [4.3, -13.6]; ho.bendR = .6; ho.htilt = .16; ho.hx = .5; }
    if (t > GIVE - .4 && t < PEEK - .3) { ho.handR = [5.6, -14.4]; ho.bendR = 1; ho.armR = t > GIVE + .1 ? heldPearl(.38) : undefined; ho.eyes = t > GIVE + .1 ? 'wide' : 'normal'; ho.mouth = t > GIVE + .1 ? 'O' : 'smile'; }
    if (t > PEEK - .3) {
      const up = ease(seg(t, PEEK - .3, PEEK + .1));
      ho.handR = [lerp(5.6, 1.55, up), lerp(-14.4, -19.7, up)]; ho.bendR = 1.25; ho.eyes = up > .5 ? ['closed', 'wide'] : 'wide'; ho.mouth = t > PEEK + .5 ? 'grin' : 'O';
      ho.armR = up > .5 ? eyePearl({ heart: t > PEEK + .35, heartK: backOut(clamp((t - PEEK - .35) * 4)) * (1 + .12 * pulse(t, 2)), lx: 0 }) : heldPearl(.38);
    }
    list.push([HY, () => {
      hn(HX, HY, HU, ho);
      if (t > HEAL && t < HEAL + 1.0) { const p = naradaLocal(HX, HY, HU, ho, 0, -15.4); glow(p[0], p[1], 180, '#FFE08A', 1 - seg(t, HEAL + .4, HEAL + 1.0)); sparkleBurst(p[0], p[1], 60, t - HEAL - .2, 'heal'); }
    }]);
    drawList(list);
    if (hug) { boilSeed('hughearts'); emote('hearts', (RXh + HX) / 2, HY - 31 * 20, 26, pop(t, HUG, 3), t - HUG); }
    if (t > PEEK + .4) { boilSeed('peekhearts'); emote('hearts', HX + 40, HY - 31 * 20, 22, pop(t, PEEK + .4, 3), t - PEEK); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, DUSK);
  }

  // ================= H · the famous picture at home; the wink =================
  function shotPicture(t, lt, dur) {
    camK(t, [[H0, [540, 1100, 1.0]], [I0, [540, 1080, 1.1]]]);
    mandirWall(t);
    const FX = 540, FY = 1085, FW = 600, FH = 780;
    frame(FX, FY, FW, FH, 'pic', () => {
      const X = FX, Y = FY + FH / 2 - 16, u = 23;
      const o = { boilKey: 'hpic', seed: 17, noShadow: true, eyes: t > PWINK && t < PWINK + .6 ? ['normal', 'closed'] : 'happy', mouth: t > PWINK && t < PWINK + .8 ? 'grin' : 'smile',
        handL: [-2.3, -15.6], handR: [2.3, -15.6], bendL: 1, bendR: 1, chest: (uu, sw) => heartReveal(uu, sw, 1, { t, key: 'picheart' }) };
      hn(X, Y, u, o);
      if (t > PWINK && t < PWINK + .7) { const e = naradaEye(X, Y, u, o, 1); emote('spark', e[0] + 30, e[1] - 16, 14, pop(t, PWINK), t - PWINK); }
    });
    garland([[FX - FW / 2 - 30, FY - FH / 2 - 20], [FX - 120, FY - FH / 2 + 60], [FX, FY - FH / 2 + 90], [FX + 120, FY - FH / 2 + 60], [FX + FW / 2 + 30, FY - FH / 2 - 20]], 15, 'picgarland');
    garland([[FX - FW / 2 - 30, FY - FH / 2 - 20], [FX - FW / 2 - 40, FY], [FX - FW / 2 - 20, FY + 160]], 13, 'picgarlandL');
    garland([[FX + FW / 2 + 30, FY - FH / 2 - 20], [FX + FW / 2 + 40, FY], [FX + FW / 2 + 20, FY + 160]], 13, 'picgarlandR');
    diya(220, 1500, 28, 1, 'p1'); diya(840, 1500, 28, 1, 'p2'); diya(380, 1504, 20, 1, 'p3');
    templeBell(940, 720, 48, Math.sin(t * 2.2) * .25, 'pbell');
    camEnd();
    caps(t);
    wipeIn(lt, DUSK);
    wipeOut(lt, dur, PEACH);
  }

  // ================= I · the ask: he pats his heart; it glows; the wink =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1180, 1.0 + .01 * lt);
    peachGround(t);
    const X = 520, Y = 2260, u = 44, pat = t > I0 + .6 && t < WINK - .3, pk = pat ? Math.abs(Math.sin((t - I0 - .6) * 7)) : 0;
    const o = { boilKey: 'hask', seed: 18, noShadow: true, hx: .1, eyes: t > WINK && t < WINK + .6 ? ['normal', 'closed'] : 'happy', mouth: 'grin', blush: .5,
      handL: [lerp(-1.2, -1.5, pk), lerp(-15.2, -14.4, pk)], bendL: .9, dy: -.08 * Math.sin(t * 2.4),
      handR: t > WINK - .3 ? kf(t, [[WINK - .3, [3.45, -10.8]], [WINK + .1, [5.4, -21.6]]], ease) : [3.45, -10.8], bendR: 1.2 };
    o.chest = (uu, sw) => {
      const g = .6 + .4 * Math.sin(t * 5);
      boilSeed('askheart');
      glow(-.2 * uu, -15 * uu, 4 * uu, '#FFB0C0', .7 * g);
      paint(heartPts(-.6 * uu, -15.6 * uu, 1.2 * uu * (1 + .08 * g)), { wash: '#F2506E', ink: NRD.ink, sw: sw * .6 });
      paint(ellPts(-1.0 * uu, -15.9 * uu, .25 * uu, .18 * uu, 8), { wash: '#FFFFFF', washOp: 200, ink: null });
    };
    if (t > WINK) { o.emote = 'spark'; o.emoteK = pop(t, WINK); o.emoteAge = t - WINK; }
    hn(X, Y, u, o);
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, PEACH);
  }

  // ================= J · the card =================
  function shotCard(t, lt) {
    pcCard(t, CARDC);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, PEACH); }
  }

  shots([[0, shotHook], [B0, shotGift], [C0, shotBridge], [D0, shotBite], [E0, shotHeart], [F0, shotWow], [G0, shotHug], [H0, shotPicture], [I0, shotAsk], [CARD, shotCard]]);
})();
