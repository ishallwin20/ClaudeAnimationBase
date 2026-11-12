// hanu3.js: "HANUMAN met RAM in DISGUISE" (ad 88, Hanuman series Part 3, 89 s, Bangers captions, retro SFX, no
// voice). Valmiki Ramayana, Kishkindha Kanda 2–4 (verse numbers as at valmikiramayan.net): on Rishyamuka, Sugriva sees
// two strangers with bows and is sure Vali sent them (2.1–6, 2.20–21); the vanaras leap from peak to peak (2.9);
// Hanuman: "Vali is not here" (2.14–16); Sugriva: "go in a common man's form and find out who they are" (2.24–27);
// Hanuman puts off his monkey form for a mendicant's (3.2), bows and speaks (3.3–5): kings or gods? arms like
// elephants' trunks, eyes like lotus petals (3.5–14); "I keep talking, why don't you answer?" (3.19); then he tells
// them himself: I am Hanuman, a vanara, Sugriva's minister; he wants your friendship; I came in a monk's form
// (3.21–23). Ram to Lakshman: no one who has not learnt the Rig, Yajur and Sama Vedas speaks like this (3.28); so much
// said, not one word wrong (3.29); even an enemy with his sword raised would be won over (3.33). He takes his own
// form again, puts both on his back and goes to Sugriva (4.34), glad (4.35). Ram's losses: 4.9–14.
// STORYBOARD.md has the plan and the sources; sets are in hanu3_props.js; the series kit is src/hanuman_series.js.
// All times are video time (t); tools/hanu3_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/hanu3_sfx.mjs)
  const PEEK = .9, POOF1 = 1.5, POOF2 = 2.7, SHH = 3.3;
  const B0 = 4.6, SEE = 6.2, DUCK = 7.2, C0 = 9.0, CATCH = 11.6, D0 = 13.4, E0 = 17.6, SPIN = 18.3, POOF = 19.0, CHECK = 20.2, PHEW = 21.1;
  const F0 = 22.2, BOWS = 23.9, G1 = 26.4, G2 = 30.6, G3 = 34.8, WHY = 36.0, H1 = 39.8, H2 = 44.2;
  const I1 = 48.2, I2 = 53.0, I3 = 57.4, J0 = 62.2, WORDS = 64.6;
  const K0 = 67.2, KPOOF = 67.8, LIFT = 69.2, LEAP = 71.2, L0 = 72.4, ASK0 = 77.4, NEXT0 = 81.8, CARD = 85.2;
  const CARDC = hsCardTimes(CARD);

  const GOLDC = '#F5C542';
  const popk = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const talk = (t, a, b, rest = 'smile', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const kick = (t, t0) => t > t0 ? .05 * Math.exp(-(t - t0) * 6) * Math.cos((t - t0) * 20) : 0;
  const hop = (g, a = .3, f = 8, d = 1.6) => g > 0 ? -a * Math.abs(Math.sin(g * f)) * Math.exp(-g * d) : 0;
  const hearts = (x, y, t, t0, key, n = 3) => { if (t < t0) return; boilSeed(key); for (let i = 0; i < n; i++) { const a = t - t0 - i * .22; if (a < 0 || a > 1.6) continue; const px = x + (i - 1) * 46 + Math.sin(a * 5 + i) * 14, py = y - a * 150, s = 22 * backOut(clamp(a * 4)) * (1 - clamp((a - 1.1) / .5)); paint(heartPts(px, py, s), { wash: '#F2557A', ink: HSK.ink, sw: .8 }); } };
  const ROCKW = [H3.rockLt, H3.rock], LAKEW = [H3.lake, H3.grass], GOLDW = [GOLDC, '#F39A2E'], DUSKW = [H3.duskHi, H3.duskLo], PEACH = [HSK.marigold, HSK.petal], NIGHTW = [H3.night, H3.nightLo];

  // ---- the cast's fixed options
  const HN = { boilKey: 'hanu', seed: 60, crown: false, gada: 0 };
  const MK = { boilKey: 'monk', seed: 61, brow: .3 };
  const RM = { boilKey: 'ram', seed: 62 }, LK = { boilKey: 'lak', seed: 63 }, SG = { boilKey: 'sug', seed: 64 };
  const GY = 1790, PY = 1840;   // the ledge's ground, the lake bank's ground

  // ---- every caption: [text, y, t0, life, size, colour]
  const two = (a, b, t0, life, sa = 72, sb = 76, gold = 1) => [[a, 470, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 470 + (sa + sb) * .68, t0 + .35, life - .35, sb, gold === 1 ? GOLDC : undefined]];
  const CAPS = [
    ['HANUMAN MET RAM', 480, -1, B0 + .85, 96], ['IN DISGUISE', 616, -1, B0 + .85, 136, GOLDC],
    ...two('SUGRIVA, A MONKEY KING, WAS HIDING', 'FROM HIS BROTHER, VALI.', B0, 4.25, 58, 80),
    ...two('ONE DAY HE SAW TWO STRANGERS WITH BOWS.', '"VALI HAS SENT THEM!"', C0, 4.25, 54, 92),
    ...two('"HANUMAN, GO AS A COMMON MAN.', 'FIND OUT WHO THEY ARE!"', D0, 4.05, 64, 78),
    ...two('SO HANUMAN HID HIS MONKEY FORM', 'AND BECAME A WANDERING MONK.', E0, 4.45, 62, 70),
    ...two('HE BOWED TO THE TWO BROTHERS', 'AND BEGAN TO SPEAK…', F0, 4.05, 66, 84),
    ...two('"YOU LOOK LIKE KINGS… OR GODS!', 'WHO ARE YOU?"', G1, 4.05, 64, 104),
    ...two('"ARMS LIKE ELEPHANT TRUNKS!', 'EYES LIKE LOTUS PETALS!"', G2, 4.05, 68, 74),
    ...two('"I KEEP ON TALKING…', 'WHY DON\'T YOU SAY SOMETHING?"', WHY - .1, H1 - WHY - .05, 74, 62),
    ...two('"I AM HANUMAN, A VANARA.', 'THIS MONK IS ONLY A DISGUISE."', H1, 4.25, 72, 62, 0),
    ...two('"MY KING, SUGRIVA,', 'WANTS TO BE YOUR FRIEND."', H2, 3.85, 74, 74),
    ['RAM TURNED TO LAKSHMAN:', 462, I1 + .1, 4.55, 60], ['"ONLY ONE WHO KNOWS ALL THREE VEDAS', 556, I1 + .5, 4.15, 56, GOLDC], ['CAN SPEAK LIKE THIS."', 648, I1 + .7, 3.95, 76, GOLDC],
    ...two('"HE SAID SO MUCH…', 'AND NOT ONE WORD WAS WRONG."', I2, 4.25, 78, 66),
    ...two('"EVEN AN ENEMY WITH A RAISED SWORD', 'WOULD MELT, HEARING HIM."', I3, 4.65, 56, 76),
    ['THE FIRST THING RAM PRAISED', 462, J0 + .1, 4.75, 70], ['WAS NOT HIS STRENGTH.', 560, J0 + .5, 4.35, 78], ['IT WAS HIS WORDS.', 676, WORDS, J0 + 4.85 - WORDS, 112, GOLDC],
    ...two('THEN HE BECAME HIMSELF AGAIN', 'AND PUT BOTH BROTHERS ON HIS BACK!', K0, 5.05, 68, 60),
    ...two('RAM HAD LOST HIS KINGDOM AND HIS SITA.', 'THAT DAY, HE FOUND HANUMAN.', L0, 4.85, 54, 78),
    ['IF YOU LOVE HANUMAN JI,', 470, ASK0 + .1, 4.2, 76], ['COMMENT', 572, ASK0 + .4, 3.9, 70], ['JAI SHRI RAM!', 690, ASK0 + .6, 3.7, 132, GOLDC],
    ['NEXT: THE NIGHT HANUMAN', 470, NEXT0 + .1, 3.2, 70], ['ALMOST GAVE UP', 590, NEXT0 + .35, 2.95, 116, GOLDC],
  ];
  // the series marks: the part pill and the source line show in the opening only, then fade out (owner, 11 Nov)
  const MARKS = C0 - .2;
  const caps = t => {
    for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color });
    if (t < MARKS) { hsPill(3, 1 - seg(t, MARKS - .3, MARKS)); hsSource('VALMIKI RAMAYAN · KISHKINDHA KANDA', t - B0 - .3, MARKS - B0 - .3); }
  };

  // ================= A · the hook: a little monk… who is Hanuman =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1010 - lt * 5, 1.0 + .012 * lt);
    warmBack(t, 'wbA', 540, 1150);
    const X = 540, Y = 1640, u = 30;
    if (t >= POOF1 && t < POOF2) {   // it's me!
      const g = t - POOF1, tk = take(t, POOF1 + .05, .6);
      hanuman(X, Y, u, { ...HN, eyes: 'happy', mouth: 'grin', blush: .6, handR: [4.8, -19.6 + .5 * Math.sin(g * 14)], bendR: .6, sq: tk.sq, dy: tk.dy + hop(g, .3, 8, 1.6), tailSway: t * 2.4 });
      sparkleBurst(X, Y - 430, 380, g * .8, 'hkburst', 12, ['#FFFFFF', GOLDC]);
    } else {
      const g = t - POOF2, o = { ...MK, pray: 1, eyes: 'closed', mouth: 'smile', dy: -.12 * Math.sin(t * 2) };
      if (t > PEEK && t < POOF1) Object.assign(o, { eyes: ['closed', 'look'], lookX: Math.sin((t - PEEK) * 9), mouth: 'smug' });   // one eye opens
      if (g >= 0) { const tk = take(t, POOF2 + .05, .5); Object.assign(o, { pray: 0, eyes: 'wide', mouth: 'sheepish', sq: tk.sq, dy: tk.dy, sweat: g < .6 }); }
      if (t >= SHH) Object.assign(o, { eyes: blinkAt(t, 4.2) ? 'closed' : ['closed', 'normal'], mouth: 'smile', handR: [1.0, -18.6], bendR: 1, sweat: false, htilt: .06 * Math.sin((t - SHH) * 3), blush: .6 });
      bhikshu(X, Y, u, o);
    }
    poof(X, Y - 420, 400, (t - POOF1) / .5, 'pfA1'); poof(X, Y - 420, 400, (t - POOF2) / .5, 'pfA2');
    camEnd();
    caps(t);
    wipeOut(lt, dur, ROCKW);
  }

  // ================= B · Rishyamuka: Sugriva hides behind a rock; he sees two strangers =================
  const strangers = (t, k) => {   // far below, by the lake: two tiny archers walking
    const x = lerp(90, 330, k);
    vanLakshman(x - 44, 1474, 4.6, { ...LK, boilKey: 'tinyl', walk: t * 1.5, noShadow: true });
    vanRam(x, 1478, 5, { ...RM, boilKey: 'tinyr', walk: t * 1.5 + .3, noShadow: true });
  };
  const HILLCAM = [540, 1400];
  function shotHide(t, lt, dur) {
    const saw = t >= SEE, duck = ease(seg(t, DUCK, DUCK + .25)) * (1 - ease(seg(t, B0 + 3.6, B0 + 3.9)));
    camBegin(HILLCAM[0], HILLCAM[1] - lt * 4, 1.0 + .01 * lt + kick(t, SEE));
    h3Hill(t);
    strangers(t, seg(t, B0, C0 + 4));
    // Hanuman, quite calm, sitting with his eyes shut
    hanuman(930, GY - 6, 19, { ...HN, sit: 1, eyes: saw && t > SEE + .5 ? ['closed', 'look'] : 'closed', lookX: -1, mouth: 'smile', tailSway: t * 1.2 });
    // Sugriva behind his rock
    const tk = take(t, SEE, .7), tr = saw ? .09 * Math.sin(t * 46) : 0;
    const so = { ...SG, noShadow: true, dy: 7 + .3 * Math.sin(t * 3) + duck * 2.2 + tk.dy, dx: tr, sq: tk.sq + duck * .3, handL: [-3.2, -12.6], handR: [3.2, -12.6], tail: false,
      eyes: saw ? 'scared' : 'look', lookX: -1, lookY: .5, mouth: saw ? 'scream' : 'flat', hx: saw ? -.3 : -.5 * Math.sin((t - B0) * 2.2), sweat: saw };
    if (saw && t < DUCK) { so.emote = '!'; so.emoteK = popk(t, SEE + .05, 6); so.emoteAge = t - SEE; }
    if (t > B0 + 3.9) Object.assign(so, { eyes: 'teary', mouth: 'wobble' });
    sugriva(640, GY, 22, so);
    h3Rock(640, GY + 210, 420, 'rkB');
    if (duck > .6) { boilSeed('duckq'); emote('sweat', 760, 1560, 30, popk(t, DUCK + .2, 6), t - DUCK); }
    camEnd();
    caps(t);
    wipeIn(lt, ROCKW);
  }

  // ================= C · "Vali has sent them!": he leaps from rock to rock; Hanuman steadies him =================
  const HOPS = [[640, GY + 154], [340, 1850], [800, GY], [470, 1810], [740, GY]], HOPD = .52;
  function shotPanic(t, lt, dur) {
    const caught = t >= CATCH, g = t - CATCH;
    camBegin(HILLCAM[0], HILLCAM[1] - 18, 1.045 + kick(t, CATCH));
    h3Hill(t);
    strangers(t, seg(t, B0, C0 + 4));
    // Hanuman on his feet, watching him go
    const h = (t - C0) / HOPD, i = Math.min(Math.floor(h), HOPS.length - 2), f = clamp(h - i);
    let sx = lerp(HOPS[i][0], HOPS[i + 1][0], f), sy = lerp(HOPS[i][1], HOPS[i + 1][1], f) - 210 * Math.sin(f * Math.PI);
    if (caught) { sx = 740; sy = GY; }
    const ho = { ...HN, eyes: caught ? 'happy' : 'look', lookX: clamp((sx - 930) / 300, -1, 1), lookY: caught ? 0 : -.3, hx: caught ? -.5 : clamp((sx - 930) / 500, -1, 1) * .6, mouth: caught ? talk(t, CATCH + .3, C0 + 4.2) : 'flat',
      tailSway: t * 1.4, handL: caught ? [-5.6, -15.4] : undefined, bendL: -.4 };
    if (!caught && t > C0 + .9) { ho.emote = 'sweat'; ho.emoteK = popk(t, C0 + .9, 5); ho.emoteAge = t - C0 - .9; }
    hanuman(930, GY, 21, ho);
    // Sugriva
    const so = { ...SG, eyes: 'scared', mouth: 'scream', sweat: true, handL: [-4.4, -20.6], handR: [4.4, -20.6], tailSway: t * 9, rot: caught ? 0 : .12 * Math.sin(t * 12), noShadow: !caught };
    if (caught) { const tk = take(t, CATCH + .05, .5); Object.assign(so, { eyes: g > .9 ? 'teary' : 'scared', mouth: 'wobble', dx: .07 * Math.sin(t * 44) * Math.exp(-g * .5), sq: tk.sq, hx: g > .6 ? .5 : 0, lookX: g > .6 ? 1 : 0, handL: [-6.2, -14.6], handR: [2.2, -14], bendR: 1, tailSway: t * 3 }); }
    sugriva(sx, sy, 22, so);
    h3Rock(640, GY + 210, 420, 'rkB');
    for (let k = 1; k <= i + (caught ? 1 : 0) && k < HOPS.length; k++) poof(HOPS[k][0], HOPS[k][1] - 10, 130, (t - C0 - k * HOPD) / .45, 'hopdust' + k, ['#FFFFFF', H3.rockLt]);
    if (!caught) { boilSeed('panicbang'); emote('!!', sx + 190, sy - 470, 36, 1, t - C0); }
    camEnd();
    caps(t);
  }

  // ================= D · "go as a common man: find out who they are" (2.24–27) =================
  function shotOrder(t, lt, dur) {
    const g = t - D0, yes = g > 2.9;
    camBegin(600, 1380, 1.14 + .012 * lt);
    h3Hill(t);
    h3Rock(250, GY + 60, 280, 'rkB');
    sugriva(400, GY, 24, { ...SG, eyes: g > .4 && g < 2.8 ? 'wide' : 'look', lookX: 1, hx: .5, mouth: talk(t, D0 + .3, D0 + 2.9, 'wobble', 'open'), sweat: true, handL: [-6.4, -14.2 + .4 * Math.sin(t * 7)], handR: [4.6, -16.4 + .5 * Math.sin(t * 9)], bendR: .7, dx: .04 * Math.sin(t * 40), tailSway: t * 3 });
    const tk = take(t, D0 + 2.9, .4);
    hanuman(820, GY, 24, { ...HN, eyes: yes ? 'happy' : blinkAt(t, D0 + 1.5) ? 'closed' : 'normal', lookX: -1, hx: -.45, mouth: yes ? 'grin' : 'smile', bow: yes ? .22 * Math.sin(clamp((g - 2.9) / .7) * Math.PI) : 0, sq: tk.sq, tailSway: t * 1.6,
      handR: yes ? [.8, -14.4] : undefined, bendR: 1, emote: yes ? 'spark' : null, emoteK: popk(t, D0 + 2.95, 6), emoteAge: g - 2.9 });
    // what Sugriva asks for: an ordinary man
    const bk = popk(t, D0 + .7, 5) * (1 - seg(t, D0 + 3.3, D0 + 3.6));
    h3Bubble(610, 1250, 100, 118, 480, 1340, bk, 'bbD');
    if (bk > .9) { narada(610, 1340, 6.2, { boilKey: 'common', seed: 9, veena: false, topknot: false, shawl: false, mala: false, tilak: false, noShadow: true, eyes: 'normal', mouth: 'smile', pal: { dhoti: '#F4EEE0', dhotiDk: '#CFC6B2', dhotiLt: '#FFFFFF', border: '#B8A88A' } }); boilSeed('commonq'); emote('?', 676, 1172, 20, popk(t, D0 + 1.3, 6), g); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, GOLDW);
  }

  // ================= E · he puts off his monkey form and becomes a monk (3.2) =================
  function shotChange(t, lt, dur) {
    const X = 560, u = 26, g = t - POOF, done = t >= POOF;
    camBegin(560, 1420 - lt * 4, 1.16 + .01 * lt + kick(t, POOF));
    h3Hill(t);
    if (!done) {
      const sp = clamp((t - SPIN) / (POOF - SPIN));
      hanuman(X, GY, u, { ...HN, eyes: t < SPIN ? 'look' : 'squeeze', lookX: .4, lookY: -.8, mouth: t < SPIN ? 'smug' : 'flat', handR: t < SPIN ? [1.4, -17.6] : [3.2, -14], bendR: 1, handL: t < SPIN ? undefined : [-3.2, -14], sq: .16 * sp, dx: sp * .12 * Math.sin(t * 60),
        tailSway: t * (2 + sp * 14), emote: t < SPIN ? 'bulb' : null, emoteK: popk(t, E0 + .25, 6), emoteAge: t - E0 - .25 });
      if (sp > 0) { glow(X, GY - 380, 300 + 260 * sp, '#FFE9A0', .7 * sp); for (let i = 0; i < 6; i++) { const a = t * 9 + i * TAU / 6; paint(starPts(X + Math.cos(a) * 250, GY - 380 + Math.sin(a) * 330, 16 * sp, .3, 4, a), { wash: '#FFFFFF', ink: null }); } }
    } else {
      const tk = take(t, POOF + .05, .7), chk = t >= CHECK && t < PHEW, ok = t >= PHEW;
      const o = { ...MK, sq: tk.sq, dy: tk.dy, eyes: 'wide', mouth: 'O', lookY: .9, handL: [-3.4, -13.2], handR: [3.4, -13.2 + .3 * Math.sin(t * 12)], bendL: 1, bendR: 1 };
      if (chk) Object.assign(o, { hx: .9, lookX: 1, lookY: .8, lean: 1.2, handR: [4.8, -9.4 + .5 * Math.sin(t * 16)], bendR: -.6, handL: undefined, mouth: 'flat', eyes: 'look', emote: '?', emoteK: popk(t, CHECK + .1, 6), emoteAge: t - CHECK });
      if (ok) Object.assign(o, { eyes: 'happy', mouth: 'grin', lookY: 0, handL: [-3.6, -19.2], handR: [3.6, -19.2], bendL: -1, bendR: -1, dy: hop(t - PHEW, .35, 8, 1.4), blush: .7 });
      bhikshu(X, GY, u, o);
      if (ok) sparkleBurst(X, GY - 400, 320, (t - PHEW) * .8, 'phew', 10, ['#FFFFFF', GOLDC]);
    }
    poof(X, GY - 380, 430, g / .55, 'pfE');
    camEnd();
    if (done && g < .14) flash((1 - g / .14) * .8, '#FFF6D8');
    caps(t);
    wipeIn(lt, GOLDW);
    wipeOut(lt, dur, LAKEW);
  }

  // ================= the lake bank: the brothers on the left, the monk on the right =================
  const RX = 360, LX = 190, MX = 800, RU = 22, LU = 20, MU = 22;
  const bro = (t, ro = {}, lo = {}) => {
    vanLakshman(LX, PY - 10, LU, { ...LK, lookX: .8, hx: .25, mouth: 'flat', brow: -.4, eyes: blinkAt(t, 28.3) || blinkAt(t, 37.4) ? 'closed' : 'normal', ...lo });
    vanRam(RX, PY, RU, { ...RM, lookX: .8, hx: .3, mouth: 'smile', eyes: blinkAt(t, 27.2) || blinkAt(t, 32.9) || blinkAt(t, 41) ? 'closed' : 'normal', ...ro });
  };
  const monk = (t, o = {}) => bhikshu(MX, PY, MU, { ...MK, lookX: -.8, hx: -.3, ...o });

  // ================= F · he bows to the two brothers (3.3–5) =================
  function shotBow(t, lt, dur) {
    camBegin(560, 1440, 1.05 + .008 * lt);
    h3Pampa(t);
    const inK = easeOut(seg(t, F0, BOWS - .2)), there = t >= BOWS - .2, bw = ease(seg(t, BOWS, BOWS + .5));
    bro(t, { eyes: there ? 'normal' : 'look', mouth: 'flat' }, { eyes: 'look', brow: -.8, handR: there ? [3.9, -13.4] : undefined, bendR: 1 });
    bhikshu(lerp(1230, MX, inK), PY, MU, { ...MK, lookX: -.8, hx: -.3, walk: there ? undefined : t * 1.7, pray: bw, bow: .42 * bw, eyes: bw > .5 ? 'closed' : 'happy', mouth: 'smile', dy: there ? 0 : -.15 * Math.abs(Math.sin(t * 10.6)) });
    if (bw > .9) sparkleBurst(MX - 60, PY - 500, 160, (t - BOWS - .5) * .9, 'bowsp', 6, ['#FFFFFF', GOLDC]);
    camEnd();
    caps(t);
    wipeIn(lt, LAKEW);
  }

  // ================= G1 · "you look like kings… or gods! who are you?" (3.5–6, 3.11–13) =================
  function shotKings(t, lt, dur) {
    const g = t - G1, gods = g > 1.9;
    camBegin(560, 1440, 1.09 + .006 * lt);
    h3Pampa(t);
    const rt = naradaTop(RX, PY, RU, { hx: .3 }), ltp = naradaTop(LX, PY - 10, LU, { hx: .25 });
    if (g > .4) { glow(RX, PY - 330, 330, '#FFE9A0', .45 * clamp((g - .4) * 3)); glow(LX, PY - 320, 280, '#FFE9A0', .35 * clamp((g - .7) * 3)); }
    bro(t, {}, { lookX: g > 2.6 ? -.2 : .8 });
    // what he sees in them: crowns… no, halos
    h3Crown(rt[0], rt[1] - 4, 96, popk(t, G1 + .5, 6) * (gods ? 0 : 1), 'crR'); h3Crown(ltp[0], ltp[1] - 4, 84, popk(t, G1 + .8, 6) * (gods ? 0 : 1), 'crL');
    h3Halo(rt[0], rt[1] + 14, 150, gods ? popk(t, G1 + 1.9, 6) : 0, 'haR'); h3Halo(ltp[0], ltp[1] + 14, 130, gods ? popk(t, G1 + 2.1, 6) : 0, 'haL');
    const ask = g > 2.9;
    monk(t, { eyes: ask ? 'wide' : 'shine', mouth: talk(t, G1 + .2, G1 + 3.8, 'smile', 'open'), handL: [-5.2, -17.2 + .5 * Math.sin(t * 8)], bendL: -.5, handR: ask ? [4.4, -18.4] : [3.6, -14.6 + .4 * Math.sin(t * 6)], bendR: ask ? -.8 : 1, htilt: ask ? .1 : 0,
      emote: ask ? '?' : null, emoteK: popk(t, G1 + 2.95, 6), emoteAge: g - 2.9, dy: hop(g - .2, .2, 9, 2) });
    camEnd();
    caps(t);
  }

  // ================= G2 · "arms like elephants' trunks! eyes like lotus petals!" (3.10, 3.12) =================
  function shotArms(t, lt, dur) {
    const g = t - G2;
    camBegin(540, 1440, 1.11 + .006 * lt);
    h3Pampa(t);
    const shy = g > 1.3;
    bro(t, { blush: .45 * clamp(g - 1), mouth: g > 2.4 ? 'sheepish' : 'smile', eyes: g > 2.4 ? 'look' : 'normal', lookX: g > 2.4 ? -.6 : .8 },
      { handR: shy ? [5.0, -18.2] : undefined, bendR: -1, lookX: shy ? .9 : .8, lookY: shy ? -.4 : 0, eyes: shy ? 'wide' : 'normal', mouth: shy ? 'smile' : 'flat', brow: shy ? .5 : -.4, blush: shy ? .8 : 0, hx: shy ? .45 : .25 });
    monk(t, { eyes: 'heart', mouth: talk(t, G2 + .2, G2 + 3.6, 'grin', 'open'), handL: [-1.6, -16.6], handR: [1.6, -16.6], bendL: 1, bendR: 1, blush: .7, htilt: .08 * Math.sin(g * 5), dy: hop(g - .1, .2, 9, 2) + hop(g - 2.0, .2, 9, 2) });
    // the two comparisons, as he says them
    const e = popk(t, G2 + .5, 5), l = popk(t, G2 + 2.0, 5);
    h3Bubble(585, 1330, 112, 104, 710, 1290, e * (1 - seg(t, G2 + 1.9, G2 + 2.1)), 'bbE'); if (e > .9 && g < 2.0) h3Eleph(581, 1324, 72, 'elE');
    h3Bubble(585, 1330, 112, 104, 710, 1290, l, 'bbL'); if (l > .9) h3Lotus(585, 1366, 66, 'loL', clamp((g - 2.1) * 2));
    hearts(MX + 60, PY - 600, t, G2 + 2.4, 'mkhearts');
    camEnd();
    caps(t);
  }

  // ================= G3 · silence… "I keep on talking: why don't you say something?" (3.19) =================
  function shotWhy(t, lt, dur) {
    const q = t < WHY, g = t - WHY;
    camBegin(540, 1440, 1.04 + .004 * lt);
    h3Pampa(t);
    bro(t, { mouth: 'flat', emote: q ? 'dots' : null, emoteK: popk(t, G3 + .3, 6), emoteAge: t - G3 - .3, lookX: q ? .8 : g > 2 ? -.7 : .8 }, { mouth: 'flat', lookX: g > 2 ? .2 : .8 });
    const o = q ? { eyes: blinkAt(t, G3 + .6) ? 'closed' : 'normal', mouth: 'sheepish', sweat: t > G3 + .5, lookX: -.8 + .8 * Math.max(0, Math.sin((t - G3) * 5)) }
      : { eyes: g < 2.4 ? 'sad' : 'teary', mouth: talk(t, WHY + .1, WHY + 3.2, 'pout', 'open'), handL: [-5.6, -13.2 + .5 * Math.sin(t * 7)], handR: [5.6, -13.2 - .5 * Math.sin(t * 7)], bendL: -.3, bendR: -.3, htilt: .1, sweat: true, dy: hop(g, .25, 9, 2) };
    monk(t, o);
    if (q) h3Leaf(lerp(1150, 420, seg(t, G3, WHY + .4)), 1320 + 60 * Math.sin(t * 3), 22, t * 3, 'leafG');   // only a leaf goes by
    camEnd();
    caps(t);
  }

  // ================= H1 · "I am Hanuman, a vanara. This monk is only a disguise." (3.21–23) =================
  function shotTell(t, lt, dur) {
    const g = t - H1;
    camBegin(590, 1410, 1.1 + .006 * lt + kick(t, H1 + .6));
    h3Pampa(t);
    const sur = g > .7;
    bro(t, { eyes: sur ? 'wide' : 'normal', mouth: sur && g < 2 ? 'O' : 'smile' }, { eyes: sur ? 'wide' : 'normal', mouth: sur ? 'O' : 'flat', brow: sur ? 1 : -.4, emote: sur ? '!' : null, emoteK: popk(t, H1 + .75, 6), emoteAge: g - .7 });
    monk(t, { eyes: g < 2.2 ? 'closed' : 'happy', mouth: talk(t, H1 + .2, H1 + 3.6, 'sheepish', 'open'), handR: [2.6, -23.4 + .3 * Math.sin(t * 10)], bendR: -1, handL: [-1.4, -14.6], bendL: 1, blush: .8, htilt: -.08, sweat: g < 2.2 });
    // who he really is
    const bk = popk(t, H1 + .6, 5);
    h3Bubble(585, 1320, 118, 132, 710, 1300, bk, 'bbH');
    if (bk > .9) hanuman(580, 1420, 6.8, { ...HN, boilKey: 'minih', noShadow: true, eyes: 'happy', mouth: 'grin', handR: [4.8, -19.6 + .5 * Math.sin(t * 12)], bendR: .6, tailSway: t * 2.4 });
    camEnd();
    caps(t);
  }
  // ================= H2 · "my king, Sugriva, wants to be your friend" (3.21–22) =================
  function shotFriend(t, lt, dur) {
    const g = t - H2;
    camBegin(590, 1410, 1.1 + .006 * lt);
    h3Pampa(t);
    bro(t, { eyes: g > 1.6 ? 'happy' : 'normal', mouth: g > 1.6 ? 'grin' : 'smile', lookX: g > 2.6 ? -.7 : .8, hx: g > 2.6 ? -.2 : .3 }, { eyes: 'normal', mouth: g > 2 ? 'smile' : 'flat', brow: 0, lookX: g > 2.8 ? 0 : .8 });
    monk(t, { eyes: 'happy', mouth: talk(t, H2 + .2, H2 + 3.2, 'smile', 'open'), pray: 1, bow: .12 + .08 * Math.sin(g * 3), blush: .5 });
    const bk = popk(t, H2 + .05, 6);
    h3Bubble(585, 1320, 118, 132, 710, 1300, bk, 'bbH');
    if (bk > .9) { sugriva(578, 1420, 6.6, { ...SG, boilKey: 'minis', noShadow: true, eyes: 'happy', mouth: 'smile', pray: 1, tailSway: t * 2 }); boilSeed('friendheart'); const s = 30 * popk(t, H2 + .8, 6) * (1 + .1 * Math.sin(t * 8)); if (s > 0) paint(heartPts(650, 1230, s), { wash: '#F2557A', ink: HSK.ink, sw: .8 }); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, GOLDW);
  }

  // ================= I1 · Ram to Lakshman: "only one who knows all three Vedas can speak like this" (3.28) =================
  function shotVedas(t, lt, dur) {
    const g = t - I1, k = ease(seg(t, I1, I1 + .8));
    camBegin(lerp(470, 410, k), lerp(1420, 1390, k), lerp(1.1, 1.2, k) + .006 * lt);
    h3Pampa(t);
    bro(t, { hx: -.45, lookX: -.8, eyes: blinkAt(t, I1 + 2.2) ? 'closed' : 'happy', mouth: talk(t, I1 + .5, I1 + 4.2, 'smile', 'open'), handR: [5.6, -15.2 + .3 * Math.sin(t * 5)], bendR: -.4 },
      { hx: .4, lookX: g > 1.4 && g < 3.2 ? .9 : .5, lookY: g > 1.4 && g < 3.2 ? -.7 : -.2, eyes: 'wide', mouth: g > 1.6 ? 'O' : 'flat', brow: .6 });
    monk(t, { eyes: 'wide', mouth: 'flat', lookX: -1, hx: -.4, handL: [-1.4, -14.6], handR: [1.4, -14.6], bendL: 1, bendR: 1 });
    // Rig, Yajur, Sama: one, two, three
    for (let i = 0; i < 3; i++) { const t0 = I1 + 1.5 + i * .45, a = popk(t, t0, 5); if (a <= 0) continue; const x = 600 + 6 * Math.sin(t * 2 + i), y = 1400 - i * 62 + 60 * hop(t - t0, .5, 9, 2); push(); translate(x, y); scale(a); h3Veda(0, 0, 130, 'veda' + i); pop(); }
    camEnd();
    caps(t);
    wipeIn(lt, GOLDW);
  }
  // ================= I2 · "he said so much… and not one word was wrong" (3.29) =================
  function shotWord(t, lt, dur) {
    const g = t - I2, k = ease(seg(t, I2, I2 + 1.2));
    camBegin(lerp(700, 760, k), lerp(1400, 1350, k), lerp(1.25, 1.42, k) + .006 * lt);
    h3Pampa(t);
    bro(t, { hx: -.45, lookX: -.8, eyes: 'happy', mouth: talk(t, I2 + .2, I2 + 3.8, 'smile', 'open') }, {});
    const bl = clamp(g / 2.2);
    monk(t, { eyes: g < 1 ? 'wide' : 'shine', mouth: g < 1 ? 'O' : 'wobble', blush: .3 + .7 * bl, lookX: -1, hx: -.2, handL: [-2.2, -18.2 - .3 * bl], handR: [2.2, -18.2 - .3 * bl], bendL: 1, bendR: 1, htilt: .06 * Math.sin(g * 6) * bl, dy: -.1 * Math.abs(Math.sin(g * 6)) * bl });
    notes(MX - 190, PY - 420, t, 'wordnotes', GOLDC, 3);
    if (g > 2.2) hearts(MX + 40, PY - 560, t, I2 + 2.2, 'wordhearts');
    camEnd();
    caps(t);
  }
  // ================= I3 · "even an enemy with a raised sword would melt, hearing him" (3.33) =================
  function shotMelt(t, lt, dur) {
    const g = t - I3;
    camBegin(550, 1430, 1.06 + .006 * lt);
    h3Pampa(t);
    bro(t, { hx: g > 3 ? .3 : -.3, lookX: g > 3 ? .8 : -.8, eyes: 'happy', mouth: talk(t, I3 + .2, I3 + 3.6, 'smile', 'open'), handR: [5.4, -15.4], bendR: -.4 }, { eyes: 'happy', mouth: 'grin', brow: .4, lookX: .9, hx: .4, blush: .3 });
    // he can't take it: hides his face
    monk(t, { eyes: 'squeeze', mouth: 'wobble', blush: 1, handL: [-.9, -20.6], handR: [.9, -20.6], bendL: 1, bendR: 1, htilt: .12 * Math.sin(g * 9), dx: .08 * Math.sin(g * 9), dy: -.12 * Math.abs(Math.sin(g * 9)), emote: 'steam', emoteK: popk(t, I3 + .4, 5), emoteAge: g - .4, lookX: 0, hx: 0 });
    // Ram's picture: the raised sword goes soft
    const bk = popk(t, I3 + .6, 5), dr = ease(seg(t, I3 + 1.6, I3 + 2.5));
    h3Bubble(585, 1320, 112, 126, 450, 1300, bk, 'bbS');
    if (bk > .9) { h3Sword(575, 1410, 140, dr, 'swS'); boilSeed('swheart'); const s = 26 * popk(t, I3 + 2.5, 6); if (s > 0) paint(heartPts(640, 1240, s), { wash: '#F2557A', ink: HSK.ink, sw: .8 }); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, PEACH);
  }

  // ================= J · the twist: not his strength; his words =================
  function shotTwist(t, lt, dur) {
    const g = t - J0, w = t >= WORDS;
    camBegin(540, 1010 - lt * 4, 1.0 + .012 * lt + kick(t, WORDS));
    warmBack(t, 'wbA', 540, 1150);
    // strength: a little Hanuman flexing, set aside
    const bk = popk(t, J0 + .6, 5), dim = ease(seg(t, J0 + 1.5, J0 + 2.2));
    h3Bubble(215, 1010, 160, 175, 400, 1200, bk * (1 - .25 * dim), 'bbJ');
    if (bk > .9) {
      hanuman(210, 1150, 9, { ...HN, boilKey: 'minij', gada: 1, noShadow: true, eyes: 'determined', mouth: 'grin', handL: [-4.4, -18.6], bendL: -1, tailSway: t * 2 });
      boilSeed('jdim'); paint(ellPts(215, 1010, 160 * (1 - .25 * dim), 175 * (1 - .25 * dim), 30), { wash: '#F2C48E', washOp: 190 * dim, ink: null });
    }
    const X = 600, Y = 1640, u = 30;
    bhikshu(X, Y, u, { ...MK, eyes: w ? 'happy' : 'look', lookX: -1, lookY: -.5, mouth: w ? talk(t, WORDS, WORDS + 2, 'grin', 'open') : 'smile', blush: w ? .8 : .4, pray: w ? 0 : 0, handL: w ? [-4.6, -18.6] : undefined, handR: w ? [4.6, -18.6] : undefined, bendL: -1, bendR: -1, dy: hop(t - WORDS, .4, 8, 1.2), htilt: w ? .06 * Math.sin(g * 5) : 0 });
    if (w) { const m = naradaMouth(X, Y, u, {}); sparkleBurst(m[0], m[1] - 40, 420, (t - WORDS) * .7, 'wordsburst', 14, ['#FFFFFF', GOLDC]); notes(m[0] + 120, m[1] - 20, t, 'jn1', GOLDC, 3); notes(m[0] - 260, m[1] - 60, t + .4, 'jn2', '#FFFFFF', 3); }
    camEnd();
    if (w && t < WORDS + .12) flash((1 - (t - WORDS) / .12) * .7, '#FFF2C8');
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, LAKEW);
  }

  // ================= K · himself again; both brothers on his back (4.34) =================
  // Hanuman with the brothers up on his shoulders, about his ground point (x, y)
  const SHX = 6.6, SHY = 15.9, SHB = .6;   // where they sit (in Hanuman's u) and their size
  const carry = (x, y, u, t, ho = {}, ro = {}, lo = {}) => {
    const sy = y - SHY * u + (ho.dy || 0) * u, bu = u * SHB;
    hanuman(x, y, u, { ...HN, handL: [-6.0, -15.0], handR: [6.0, -15.0], bendL: -1, bendR: -1, eyes: 'happy', mouth: 'grin', ...ho });
    vanLakshman(x + SHX * u, sy, bu, { ...LK, sit: 1, noShadow: true, eyes: 'happy', mouth: 'grin', ...lo });
    vanRam(x - SHX * u, sy, bu, { ...RM, sit: 1, noShadow: true, eyes: 'happy', mouth: 'smile', ...ro });
  };
  function shotCarry(t, lt, dur) {
    const him = t >= KPOOF, g = t - KPOOF, up = t >= LIFT, go = easeIn(seg(t, LEAP, LEAP + .9));
    camBegin(540, 1400 - 60 * ease(seg(t, LIFT, LEAP)), 1.02 + kick(t, KPOOF) + kick(t, LIFT + .45));
    h3Pampa(t);
    const hx = lerp(MX, 560, ease(seg(t, KPOOF + .5, LIFT - .1))), hu = lerp(MU, 25, him ? popk(t, KPOOF, 3) : 0);
    if (!up) {
      const sur = him && g < 1.2;
      bro(t, { eyes: sur ? 'wide' : 'happy', mouth: sur ? 'O' : 'grin', hx: .3 }, { eyes: sur ? 'wide' : 'happy', mouth: sur ? 'O' : 'smile', brow: .6, emote: sur ? '!' : null, emoteK: popk(t, KPOOF + .1, 6), emoteAge: g });
      if (!him) monk(t, { eyes: 'happy', mouth: 'grin', handL: [-3.6, -19.2], handR: [3.6, -19.2], bendL: -1, bendR: -1, sq: .1 * seg(t, K0, KPOOF) });
      else { const tk = take(t, KPOOF + .05, .6); hanuman(hx, PY, hu, { ...HN, eyes: 'happy', mouth: 'grin', blush: .5, sq: tk.sq, dy: tk.dy, walk: g > .5 ? t * 1.8 : undefined, tailSway: t * 2.4, handL: g > .9 ? [-5.4, -13.6] : undefined, handR: g > .9 ? [5.4, -13.6] : undefined, bendL: -.5, bendR: -.5, lookX: -.6 }); }
    } else {
      const a = clamp((t - LIFT) / .45), sq = t > LEAP - .35 && t < LEAP ? .14 * seg(t, LEAP - .35, LEAP) : 0, y = PY - 2300 * go;
      if (a < 1) {   // up they go
        const sy = PY - SHY * 25, e = ease(a), arc = 150 * Math.sin(a * Math.PI);
        hanuman(560, PY, 25, { ...HN, eyes: 'happy', mouth: 'grin', handL: [-5.4, -15.6], handR: [5.4, -15.6], bendL: -.6, bendR: -.6, tailSway: t * 2.4 });
        vanLakshman(lerp(LX, 560 + SHX * 25, e), lerp(PY - 10, sy, e) - arc, lerp(LU, 25 * SHB, e), { ...LK, noShadow: true, eyes: 'wide', mouth: 'O', handL: [-4.4, -20], handR: [4.4, -20], rot: -.5 * Math.sin(a * Math.PI) });
        vanRam(lerp(RX, 560 - SHX * 25, e), lerp(PY, sy, e) - arc, lerp(RU, 25 * SHB, e), { ...RM, noShadow: true, eyes: 'wide', mouth: 'smile', rot: .3 * Math.sin(a * Math.PI) });
      } else {
        const tk = take(t, LIFT + .45, .5);
        carry(560 + 260 * go, y, 25, t, { sq: tk.sq + sq, dy: tk.dy, tailSway: t * (2.4 + 8 * go), noShadow: go > 0, rot: .12 * go, lookY: -.6 * seg(t, LEAP - .5, LEAP) },
          { eyes: t < LIFT + 1.1 ? 'wide' : 'happy', mouth: 'smile' }, { eyes: t < LIFT + 1.1 ? 'wide' : 'happy', mouth: t < LIFT + 1.1 ? 'O' : 'grin', handL: go > 0 ? [-4.4, -20] : undefined, handR: go > 0 ? [4.4, -20] : undefined });
        if (go > 0) { h3Lines(560 + 260 * go, y - 200, Math.PI / 2 - .12, 260, 8, 'leaplines'); poof(560, PY - 20, 300, (t - LEAP) / .6, 'leapdust', ['#FFFFFF', '#DCEBC8']); }
      }
    }
    poof(MX, PY - 330, 400, g / .55, 'pfK');
    if (him) sparkleBurst(MX, PY - 380, 360, g * .8, 'kburst', 12, ['#FFFFFF', GOLDC]);
    camEnd();
    if (him && g < .14) flash((1 - g / .14) * .8, '#FFF6D8');
    caps(t);
    wipeIn(lt, LAKEW);
    wipeOut(lt, dur, DUSKW);
  }

  // ================= L · across the hills at dusk: "that day, he found Hanuman" (4.9–14, 4.35) =================
  function shotFound(t, lt, dur) {
    const g = t - L0, k = ease(seg(t, L0, L0 + 2.6));
    camBegin(540, lerp(1180, 1150, k), lerp(.96, 1.1, k));
    h3Dusk(t, 1);
    const X = 560 + 14 * Math.sin(t * 1.3), Y = 1660 + 26 * Math.sin(t * 2.2), u = 25;
    h3Lines(X + 120, Y - 380, -.14, 300, 9, 'flylines', '#FFF6E0');
    push(); translate(X, Y); rotate(-.2 + .03 * Math.sin(t * 2.2));
    carry(0, 0, u, t, { noShadow: true, walk: t * 1.1, tailSway: t * 5, blush: .6, eyes: g > 2.4 ? 'closed' : 'happy', mouth: g > 2.4 ? 'smile' : 'grin', lookX: -.6 },
      { eyes: g > 1.6 ? 'closed' : 'happy', mouth: 'smile', handR: [6.6, -18.6], bendR: .6, hx: .4, bow: .2, blush: .3 },
      { eyes: 'happy', mouth: 'grin', handL: [-4.4, -20 + .5 * Math.sin(t * 9)], handR: [4.4, -20 - .5 * Math.sin(t * 9)] });
    pop();
    hearts(X + 250, Y - 560, t, L0 + 2.6, 'foundhearts');
    camEnd();
    caps(t);
    wipeIn(lt, DUSKW);
    wipeOut(lt, dur, PEACH);
  }

  // ================= the ask =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1010, 1.0 + .01 * lt);
    warmBack(t, 'wbA', 540, 1150);
    const g = t - ASK0;
    hanuman(540, 1690, 28, { ...HN, pray: 1, bow: .12 + .06 * Math.sin(g * 2.4), eyes: blinkAt(t, ASK0 + 2.6) ? 'closed' : g > .8 ? 'happy' : 'normal', mouth: g > .8 ? 'grin' : 'smile', blush: .6, tailSway: t * 1.8, dy: hop(g - .8, .3, 8, 1.4) });
    hearts(540, 890, t, ASK0 + 1.2, 'askhearts'); hearts(540, 890, t, ASK0 + 2.9, 'askhearts2');
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, NIGHTW);
  }
  // ================= next: the night he almost gave up =================
  function shotNext(t, lt, dur) {
    camBegin(540, 1010, 1.0 + .012 * lt);
    h3Night(t);
    const g = t - NEXT0;
    hanuman(540, 1570, 27, { ...HN, sit: 1, eyes: g > 1.6 ? 'closed' : 'sad', mouth: 'frown', bow: .5, lookY: 1, tail: 'droop', tailSway: t * .6, gloom: .5, handL: [-3.2, -10.6], handR: [3.2, -10.6] });
    boilSeed('nextcloud'); emote('cloud', 720, 990, 40, popk(t, NEXT0 + .6, 5), g);
    camEnd();
    caps(t);
    wipeIn(lt, NIGHTW);
  }
  function shotCard(t, lt, dur) { hsCard(t, CARDC); }

  shots([[0, shotHook], [B0, shotHide], [C0, shotPanic], [D0, shotOrder], [E0, shotChange], [F0, shotBow], [G1, shotKings], [G2, shotArms], [G3, shotWhy], [H1, shotTell], [H2, shotFriend],
    [I1, shotVedas], [I2, shotWord], [I3, shotMelt], [J0, shotTwist], [K0, shotCarry], [L0, shotFound], [ASK0, shotAsk], [NEXT0, shotNext], [CARD, shotCard]]);
})();
