// hanu7.js: "BHARAT shot HANUMAN out of the sky" (ad 95, Hanuman series Part 7, 92.8 s, Bangers captions, retro SFX,
// no voice). Ramcharitmanas, Lanka Kand (doha numbers as in the edition read on 15 Nov 2026, the Awadhi text at swargarohan.org): Meghnad's shakti
// fells Lakshman (54); Sushena, the physician of Lanka, names the mountain and the herb (55); Ravana goes to Kalanemi,
// who makes a lake, a temple and a garden on the way and sits there as a sage (56–57); "bathe in the lake and I will
// give you diksha" (57.4); a she-crocodile seizes his foot, he kills her, she rises in a divine body (doha 57): "the
// sage's curse is gone; this is no sage, a dreadful demon" (58.1); "take your guru-dakshina first": his tail round the
// demon's head, and down (58.2–3); he cannot tell the herb, uproots the mountain and flies by night over Avadh (58.4);
// Bharat sees something huge, takes it for a demon, draws to his ear and shoots an arrow with no head (doha 58); he
// falls saying "Ram, Ram" (59.1); Bharat runs, holds him, cannot wake him, and prays: "if my love for Ram's feet is
// without guile, let the monkey be free of weariness and pain" (59.2–4); he sits up: "victory to the lord of Kosala"
// (59.4); Bharat hears it all and grieves: "I was of no use to the Lord in even one task" (60.1–2); "you will be late;
// at dawn the task is lost: climb on my arrow, mountain and all" (60.3); pride rises in Hanuman: "how will an arrow
// bear my weight?", then he thinks of Ram's power and bows (60.4); he goes, praising Bharat's strength, goodness and
// boundless love for the Lord again and again (doha 60); he arrives, Lakshman sits up glad (61–62.1).
// STORYBOARD.md has the plan and the sources; props are in hanu7_props.js (and hanu4/5/6_props.js, sanj_props.js); the
// series kit is src/hanuman_series.js. All times are video time (t); tools/hanu7_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/hanu7_sfx.mjs)
  const STRIKE = 2.6;
  const B0 = 4.4, LEAP = 7.7, C0 = 9.0, POOF = 11.6, D0 = 13.4, E0 = 17.8, BITE = 18.7, BONK = 19.8, RISE = 20.4, F0 = 22.2, TRUTH = 24.4;
  const G0 = 26.6, WHAM = 28.7, I0 = 31.0, SEES = 33.2, J0 = 35.4, DRAW = 37.0, SHOOT = 38.5, K0 = 39.8, HIT = 40.4, GROUND = 42.1;
  const L0 = 44.2, KNEEL = 45.5, M0 = 48.6, LIGHT = 50.6, N0 = 53.4, WAKE = 53.9, HUG = 55.4, O0 = 57.8, P0 = 62.4, Q0 = 67.4, BOW = 70.0;
  const R0 = 72.4, S0 = 77.4, U0 = 81.0, V0 = 86.0, CARD = 89.2;
  const CARDC = hsCardTimes(CARD);

  const GOLDC = '#F5C542';
  const popk = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const talk = (t, a, b, rest = 'smile', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const kick = (t, t0) => t > t0 ? .05 * Math.exp(-(t - t0) * 6) * Math.cos((t - t0) * 20) : 0;
  const shk = (t, t0, amp, d = 3) => t > t0 ? amp * Math.exp(-(t - t0) * d) : 0;
  const hop = (g, a = .3, f = 8, d = 1.6) => g > 0 ? -a * Math.abs(Math.sin(g * f)) * Math.exp(-g * d) : 0;
  const hearts = (x, y, t, t0, key, n = 3, s = 22) => { if (t < t0) return; boilSeed(key); for (let i = 0; i < n; i++) { const a = t - t0 - i * .22; if (a < 0 || a > 1.6) continue; const px = x + (i - 1) * s * 2.1 + Math.sin(a * 5 + i) * s * .6, py = y - a * s * 7, r = s * backOut(clamp(a * 4)) * (1 - clamp((a - 1.1) / .5)); paint(heartPts(px, py, r), { wash: '#F2557A', ink: HSK.ink, sw: .8 }); } };
  const speedLines = (x, y, len, key, n = 4, gap = 14, dir = 1) => { boilSeed(key); for (let i = 0; i < n; i++) inkLine([[x - dir * len * (1 + .3 * hash(i)), y + (i - (n - 1) / 2) * gap], [x - dir * len * .2, y + (i - (n - 1) / 2) * gap]], 1.4, '#FFFFFF', 'inkfine', 0); };
  const NIGHTW = [H6.night, H6.nightLo], HALLW = ['#4A1E3A', '#2A142A'], PEACH = [HSK.marigold, HSK.petal], GOLDW = ['#F5C542', '#E8A030'];

  // ---- the cast's fixed options
  const HN = { boilKey: 'hanu', seed: 60, crown: false, gada: 0 };
  const BH = { boilKey: 'bh', seed: 31 };
  // Hanuman in flight with the mountain over his head (drawn first, so his hands sit on its torn root)
  const flyer = (x, y, u, t, o = {}, ps = 15) => {
    const ho = { ...HN, boilKey: 'hf', rot: .35, eyes: 'determined', mouth: 'grin', handL: [-2.4, -26.6], handR: [2.4, -26.6], bendL: -1, bendR: -1, tail: 'droop', noShadow: true, ...o };
    const [px, py] = naradaHand(x, y, u, ho, -1), [qx, qy] = naradaHand(x, y, u, ho, 1);
    push(); translate((px + qx) / 2, (py + qy) / 2 - u * .4); rotate((ho.rot || 0) * .6); herbPeak(0, 0, u * ps, t, { root: 1, key: (ho.boilKey || 'hf') + 'pk', herbs: 10 }); pop();
    hanuman(x, y, u, ho);
  };
  // someone lying on their back, head screen left, body centred at (cx, y)
  const LU = 11.5;
  const lyingH = (cx, y, o = {}) => hanuman(cx + 14 * LU, y, LU, { ...HN, boilKey: 'hly', eyes: 'closed', mouth: 'flat', rot: -Math.PI / 2, tail: false, noShadow: true, ...o });
  const lyingL = (cx, y, u = LU, o = {}) => vanLakshman(cx + 14 * u, y, u, { boilKey: 'lk', eyes: 'closed', mouth: 'flat', rot: -Math.PI / 2, kodanda: false, noShadow: true, ...o });
  // the mountain set down on the ground
  const parked = (x, y, t, s = 250, key = 'pkd') => { push(); translate(x, y); rotate(.08); herbPeak(0, 0, s, t, { root: .4, key, herbs: 12 }); pop(); };

  // ---- every caption: [text, y, t0, life, size, colour]
  const two = (a, b, t0, life, sa = 72, sb = 76, gold = 1) => [[a, 470, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 470 + (sa + sb) * .68, t0 + .35, life - .35, sb, gold === 1 ? GOLDC : undefined]];
  const three = (a, b, c, t0, life, sa = 60, sb = 60, sc = 70, gold = 2) => [[a, 466, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 466 + (sa + sb) * .68, t0 + .4, life - .4, sb, gold === 1 ? GOLDC : undefined], [c, 466 + (sa + sb) * .68 + (sb + sc) * .68, t0 + 1.2, life - 1.2, sc, gold === 2 ? GOLDC : undefined]];
  const CAPS = [
    ['BHARAT SHOT', 470, -1, B0 + .85, 96], ['HANUMAN', 592, -1, B0 + .85, 150, GOLDC], ['OUT OF THE SKY.', 716, -1, B0 + .85, 96],
    ...two('MEGHNAD\'S SPEAR STRUCK LAKSHMAN DOWN.', 'THE CURE: A HERB ON A FAR MOUNTAIN.', B0, 4.5, 52, 56),
    ...two('RAVANA SENT A DEMON, KALANEMI,', 'TO STOP HANUMAN ON THE WAY.', C0, 4.3, 62, 68, 0),
    ...two('DRESSED AS A SAGE, HE SAID:', '"BATHE IN MY LAKE. THEN I\'LL TEACH YOU!"', D0, 4.3, 68, 50),
    ...two('IN THE LAKE, A CROCODILE GRABBED HIS FOOT.', 'ONE BLOW… AND SHE ROSE AS AN APSARA!', E0, 4.3, 48, 54),
    ...two('"A SAGE\'S CURSE HELD ME. YOU FREED ME!', 'AND THAT IS NO SAGE. HE\'S A DEMON!"', F0, 4.3, 50, 56),
    ...two('"GURU JI, TAKE YOUR FEE FIRST!"', 'ONE SWING OF HIS TAIL. DONE.', G0, 4.3, 62, 70),
    ...two('CARRYING THE WHOLE MOUNTAIN,', 'HE FLEW OVER AYODHYA AT NIGHT.', I0, 4.3, 64, 64, 1),
    ...two('BHARAT SAW A GIANT SHAPE: "A DEMON!"', 'HE SHOT AN ARROW WITH NO TIP.', J0, 4.3, 54, 68),
    ...two('HANUMAN FELL, STILL SAYING:', '"RAM… RAM…"', K0, 4.3, 68, 136),
    ...two('BHARAT HEARD THAT NAME AND RAN.', 'HE HELD HIM. HANUMAN DID NOT WAKE.', L0, 4.3, 62, 56, -1),
    ...two('"IF MY LOVE FOR RAM IS TRUE,', 'LET HIM WAKE, FREE OF PAIN."', M0, 4.7, 68, 68),
    ...two('HANUMAN SAT UP AT ONCE:', '"VICTORY TO RAM, LORD OF KOSALA!"', N0, 4.3, 74, 58),
    ...two('HEARING IT ALL, BHARAT WEPT:', '"I COULD NOT SERVE RAM EVEN ONCE."', O0, 4.5, 66, 58),
    ...three('"YOU MUST REACH BEFORE DAWN.', 'SIT ON MY ARROW, MOUNTAIN AND ALL.', 'I\'LL SHOOT YOU TO RAM!"', P0, 4.9, 60, 54, 78),
    ...three('FOR A MOMENT, HANUMAN FELT PROUD:', '"CAN AN ARROW CARRY MY WEIGHT?"', 'THEN HE THOUGHT OF RAM, AND BOWED.', Q0, 4.9, 54, 58, 56, 1).map((c, i) => i === 2 ? [c[0], c[1], BOW, R0 - BOW - .1, c[4], '#FFFFFF'] : c),
    ...three('HE FLEW ON. AND TULSIDAS WRITES:', 'ALL THE WAY, HE KEPT PRAISING', 'BHARAT\'S LOVE FOR RAM.', R0, 4.9, 56, 62, 82),
    ...two('HE REACHED IN TIME.', 'LAKSHMAN SAT UP, SMILING.', S0, 3.5, 84, 70, -1),
    ...two('ARE YOU THE LAKSHMAN', 'OF YOUR FAMILY, OR THE BHARAT?', U0, 4.9, 84, 62, -1),
    ...two('NEXT: RAM GAVE EVERYONE JEWELS.', 'HANUMAN ASKED FOR THIS.', V0, 3.1, 58, 78),
  ];
  // the series marks: the part pill and the source line show in the opening only, then fade out (owner, 11 Nov)
  const MARKS = D0 - .2;
  const caps = t => {
    for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color });
    if (t < MARKS && t > B0) { hsPill(7, (1 - seg(t, MARKS - .3, MARKS)) * clamp((t - B0) * 4)); hsSource('RAMCHARITMANAS · LANKA KAND', t - B0 - .3, MARKS - B0 - .3); }
  };

  // ================= A · the hook: over Ayodhya at night, an arrow rises and strikes him =================
  function shotHook(t, lt, dur) {
    const g = t - STRIKE, hit = g >= 0;
    camBegin(540 + Math.sin(t * 71) * shk(t, STRIKE, 14), 1040, 1.0 + kick(t, STRIKE));
    h6Night(t, 'nA');
    const x = 400 + Math.min(t, STRIKE) * 26, drop = hit ? g * g * 60 : 0, y = 1370 + 8 * Math.sin(t * 3) + drop, u = 13.5;
    const wob = hit ? .5 * Math.exp(-g * 1.2) * Math.sin(g * 9) + .25 * clamp(g) : 0;
    if (!hit) speedLines(x - 150, y - 170, 170, 'spA', 5, 20);
    flyer(x, y, u, t, { boilKey: 'hA', rot: .35 + wob, eyes: hit ? 'swirl' : t > 1.5 ? 'wide' : 'determined', mouth: hit ? 'wobble' : t > 1.5 ? 'O' : 'grin' });
    // the tipless arrow, already on its way at frame 0
    const q = lerp(.45, 1, clamp(t / STRIKE)), tx = x + 90, ty = y - 11 * u;
    if (!hit) h7Blunt(lerp(960, tx, q), lerp(1760, ty, q), Math.atan2(ty - 1760, tx - 960), 210, 'arA');
    else { h6Impact(tx + 40, ty + 30, 210, g * 1.3, 'imA'); h6Dizzy(x + 60, y - 30 * u, 60, t, 'dzA'); }
    if (hit) { boilSeed('hkA'); emote('!?', x + 250, y - 27 * u, 26, popk(t, STRIKE + .05, 6), g); }
    camEnd();
    if (hit && g < .12) flash((1 - g / .12) * .7, '#FFFFFF');
    caps(t);
    wipeOut(lt, dur, NIGHTW);
  }

  // ================= B · Lakshman struck down; Sushena names the herb; Hanuman leaps (54–55) =================
  function shotHerb(t, lt, dur) {
    const g = t - B0, leap = t - LEAP, gone = leap > 0;
    camBegin(540, 1425 - lt * 3, 1.25 + .006 * lt);
    battlefield(t, 1, 'bfB');
    // Ram sitting by his brother, in tears
    vanRam(215, 1690, 12, { boilKey: 'rmB', sit: 1, kodanda: false, hx: .5, lookX: .6, lookY: .6, eyes: 'closed', mouth: 'frown', handR: [4.4, -11], handL: [-3.4, -10] });
    glow(420, 1740, 170, '#FFB070', .22);
    lyingL(430, 1752, 10.5);
    const [ex, ey] = naradaHead(215, 1690, 12, { sit: 1 }); tears(ex + 14, ey + 30, t, 'trB', .8);
    // the healer points at the far mountain (his bubble)
    const vo = { boilKey: 'vdB', hx: -.2, lookX: gone ? .6 : -.4, eyes: 'normal', mouth: talk(t, B0 + .8, B0 + 2.8, 'flat', 'open'), handR: [4.6, -22], bendR: -1, handL: [-3, -11] };
    vaidya(600, 1700, 11.5, vo);
    const bk = popk(t, B0 + .7, 5);
    h4Bubble(610, 1225, 180, 108, 650, 1380, bk, 'bbB', '#FFFDF2');
    if (bk > .9) { herbPeak(610, 1300, 135, t, { key: 'pkB', herbs: 9 }); for (let i = 0; i < 3; i++) paint(starPts(520 + i * 90, 1180 + (i % 2) * 22, 7 + 3 * Math.sin(t * 6 + i), .4, 4), { wash: '#F5C542', ink: null }); }
    // Hanuman: a nod, a crouch, and he is gone
    const up = gone ? easeIn(clamp(leap / .5)) : 0, cr = seg(t, LEAP - .5, LEAP);
    if (up < 1) {
      const hx = 815, hy = 1700 - up * 1500;
      if (gone) speedLines(hx - 30, hy + 60, 10, 'spB', 1, 0);
      hanuman(hx + up * 60, hy, 11.5, { ...HN, boilKey: 'hB', hx: -.4, lookX: -.8, eyes: 'determined', mouth: 'flat', sq: .16 * cr * (1 - up), pray: gone ? 0 : seg(t, B0 + 2.2, B0 + 2.6) * (1 - cr),
        handL: gone ? [-2.4, -26] : undefined, handR: gone ? [2.4, -26] : undefined, tailSway: t * 4, noShadow: gone });
    }
    if (gone) { poof(815, 1690, 220, leap / .6, 'dustB', ['#8E86A8', '#6A6288']); }
    camEnd();
    caps(t);
    wipeIn(lt, NIGHTW);
    wipeOut(lt, dur, HALLW);
  }

  // ================= C · Ravana at Kalanemi's house; the demon becomes a sage (56–57.2) =================
  const RV = (x, y, u, o = {}) => ravana(x, y, u, { boilKey: 'rv', ...o });
  const eachHead = f => { const h = {}; for (let i = 0; i < 10; i++) h[i] = f(i); return h; };
  const sageO = (t, o = {}) => ({ boilKey: 'sg', hat: h7Horns, eyes: 'happy', mouth: 'smile', ...o });
  function shotSend(t, lt, dur) {
    const g = t - POOF, sage = g > 0;
    camBegin(540, 1330 - lt * 3, 1.4 + .006 * lt);
    h4Palace(t, 'plC');
    RV(390, 1660, 9, { heads: eachHead(i => ({ eyes: sage ? 'happy' : 'angry', mouth: i === 4 ? talk(t, C0 + .2, C0 + 2.2, 'teeth', 'open') : sage ? 'grin' : 'teeth', brows: sage ? 0 : -1, lookX: .8, hat: i === 0 ? 'cap' : i === 4 ? 'mukut' : 'crown', goldTooth: i === 6 && sage ? 1 : 0 })),
      handR: [9.6, -17], bendR: .4 });
    const KX = 770, KY = 1660, KU = 12.5;
    if (!sage) {
      // "he burned your city while you watched: who can stop him?" (56.2)
      kalanemi(KX, KY, KU, { boilKey: 'klC', flip: true, eyes: 'wide', mouth: t > C0 + 1.0 ? 'open' : 'flat', sweat: 1, dx: .15 * Math.sin(t * 30) * seg(t, C0 + 1, C0 + 1.4) });
      const bk = popk(t, C0 + .9, 5) * (1 - seg(t, POOF - .3, POOF));
      h4Bubble(600, 1215, 150, 100, KX - 40, KY - 25 * KU, bk, 'bbC', '#FFF6DE');
      if (bk > .9) { h5Lanka(600, 1245, 170, 'lkC'); h7Flames(600, 1200, 180, 70, t, 'flC', 5); }
      if (t > C0 + 1.2) { boilSeed('swC'); emote('sweat', KX + 110, KY - 27 * KU, 18, popk(t, C0 + 1.2, 6), t - C0 - 1.2); }
    } else {
      rishi(KX, KY, 12, 0, sageO(t, { boilKey: 'sgC', flip: true, pray: clamp(g * 3), eyes: blinkAt(t, POOF + 1.2) ? 'closed' : 'happy' }));
      const [hx, hy] = naradaTop(KX, KY, 12, {});
      h7Halo(hx, hy - 34, 62, t, popk(t, POOF + .35, 6), 'hlC');
      if (g > .8) { boilSeed('tingC'); paint(starPts(KX + 96, KY - 21 * 12, 14 * Math.sin(clamp((g - .8) * 2) * Math.PI), .3, 4), { wash: '#FFFFFF', ink: null }); }
    }
    poof(KX, KY - 150, 300, g / .6, 'pfC', ['#D8C8F0', '#A898D0']);
    camEnd();
    caps(t);
    wipeIn(lt, HALLW);
    wipeOut(lt, dur, NIGHTW);
  }

  // ================= D · the false ashram: "bathe in my lake, then I will teach you" (57.1–4) =================
  const SX = 350, SY = 1680, SU = 12.5, AX = 640, AY = 1690, AU = 12.5;
  const ashCam = (lt, z = 1.36, sh = [0, 0]) => camBegin(520 + sh[0], 1370 + sh[1] - lt * 3, z + .006 * lt);
  function shotSage(t, lt, dur) {
    const g = t - D0, turn = g > 2.7;
    ashCam(lt);
    h7Ashram(t, 'ahD');
    // the "sage": sweet while he is watched, a fanged grin the moment Hanuman looks at the lake
    const so = sageO(t, { boilKey: 'sgD', hx: .4, lookX: .8, eyes: turn ? 'smug' : 'happy', mouth: turn ? 'grin' : talk(t, D0 + .5, D0 + 2.6, 'smile', 'open'), handR: [5.4, -15.4], bendR: -.6, handL: [-3, -11] });
    rishi(SX, SY, SU, 0, so);
    const [tx, ty] = naradaTop(SX, SY, SU, so);
    h7Halo(tx + 6, ty - 34, 62, t, 1, 'hlD');
    if (turn) { boilSeed('fangD'); const [mx, my] = naradaMouth(SX, SY, SU, so); paint([[mx + 2, my - 3], [mx + 8, my + 12], [mx + 14, my - 3]], { wash: '#FFFFFF', ink: HSK.ink, sw: .6 }); paint(starPts(mx + 26, my + 6, 12 * Math.abs(Math.sin((g - 2.7) * 5)), .3, 4), { wash: '#FFFFFF', ink: null }); }
    // Hanuman: palms joined, then a happy look at the lake
    hanuman(AX, AY, AU, { ...HN, boilKey: 'hD', hx: turn ? .5 : -.4, lookX: turn ? .9 : -.9, lookY: turn ? .5 : 0, eyes: turn ? 'happy' : 'normal', mouth: 'smile', pray: turn ? 0 : 1, bow: turn ? 0 : .12 + .05 * Math.sin(g * 3),
      handR: turn ? [5.6, -15] : undefined, bendR: -1, tailSway: t * 3, emote: turn ? 'note' : null, emoteK: popk(t, D0 + 2.8, 6), emoteAge: g - 2.8 });
    camEnd();
    caps(t);
    wipeIn(lt, NIGHTW);
  }

  // ================= E · the crocodile grabs his foot; one blow, and she rises as an apsara (doha 57) =================
  const lakeSet = (t, key) => {
    boilSeed(key + 'sky');
    paint(rectPts(-300, -600, W + 600, 2600), { wash: H6.night, ink: null });
    paint(ellPts(540, 1450, 1100, 640, 26), { fill: H6.nightLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
    glow(240, 900, 170, '#FFF4D2', .4); paint(ellPts(240, 900, 50, 50, 18), { wash: '#FFF4D2', ink: null });
    boilSeed(key + 'st'); for (let i = 0; i < 16; i++) paint(starPts(-100 + hash(i * 2.3) * 1300, 520 + hash(i * 6.7) * 800, 3 + 3 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i)), .4, 4), { wash: '#FFF6DA', ink: null });
    boilSeed(key + 'bank');
    paint([[-300, 1620], [300, 1590], [800, 1610], [1380, 1590], [1380, 2700], [-300, 2700]], { wash: H7.grass, fill: H7.grassDk, fillOp: 70, tex: .5, ink: H7.ink, sw: .9, curv: .5 });
    h7Pond(540, 1790, 640, 170, t, key + 'pd');
  };
  const water = (x, y, w, key) => { boilSeed(key); paint(ellPts(x, y, w, w * .2, 16), { wash: H7.water, washOp: 235, ink: null }); inkLine([[x - w, y - 2], [x - w * .3, y - w * .12], [x + w * .3, y - w * .12], [x + w, y - 2]], 1.4, H7.waterLt, 'inkfine', .5); };
  function shotCroc(t, lt, dur) {
    const g = t - BITE, bit = g >= 0, b = t - BONK, bonk = b >= 0, r = t - RISE, risen = r >= 0;
    const sh = shk(t, BONK, 14);
    camBegin(540 + Math.sin(t * 71) * sh, 1420 + Math.cos(t * 53) * sh * .6 - lt * 3, 1.42 + kick(t, BONK) + .004 * lt);
    lakeSet(t, 'lkE');
    const HX = 400, HY = 1790, HU = 12.5, CX = 690, CY = 1772;
    const jump = bit && !bonk ? hop(g, .9, 9, .9) : 0;
    const ho = { ...HN, boilKey: 'hE', hx: bit ? .4 : -.1, lookX: bit ? .8 : 0, lookY: bit ? .7 : -.2, dy: jump,
      eyes: risen ? 'wide' : bonk ? 'determined' : bit ? 'wide' : 'happy', mouth: risen ? 'O' : bonk ? 'flat' : bit ? 'scream' : 'smile',
      handR: bonk && b < .5 ? [8.2, -8.4] : bit && !bonk ? [5.4, -22] : [3.4, -12], handL: bit && !bonk ? [-5.4, -22] : [-3.4, -12], bendR: bonk ? 0 : -1, bendL: -1, tailSway: t * (bit ? 8 : 3),
      emote: bit && !bonk ? '!' : risen && r > .5 ? '?' : null, emoteK: popk(t, risen ? RISE + .5 : BITE + .05, 6), emoteAge: risen ? r - .5 : g };
    hanuman(HX, HY, HU, ho);
    // the crocodile, sliding in under the water, then clamped on his foot
    if (!risen) {
      const slide = easeOut(seg(t, E0 + .1, BITE)), cx = lerp(1150, CX, slide);
      h7Croc(cx, CY + (bonk ? 10 * Math.sin(b * 30) * Math.exp(-b * 5) : 0), 420, { key: 'crE', open: bonk ? .1 : bit ? .15 + .1 * Math.abs(Math.sin(g * 12)) : .75 * seg(t, BITE - .35, BITE - .05), eyes: bonk ? 'swirl' : 'normal' });
      water(cx + 150, CY + 66, 330, 'wtE2');
      if (bonk) h6Dizzy(cx, CY - 130, 50, t, 'dzE');
    }
    water(HX, HY + 4, 150, 'wtE1');
    if (bit && g < .5) { h6Impact(HX + 70, HY - 30, 150, g * 2, 'imE1', '#BCE0F4'); }
    if (bonk) { h6Impact(CX - 20, CY - 70, 260, b * 1.5, 'imE2'); sfx('BONK!', CX + 20, CY - 250, 96, '#FFF2A0', b, { life: .9, stroke: H6.ink, sw: .25, rot: .08 }); }
    // she rises in a body of light
    if (risen) {
      const up = easeOut(clamp(r / 1.0)), ay = lerp(1800, 1650, up) + 8 * Math.sin(t * 3);
      poof(CX, CY - 40, 300, r / .7, 'pfE', ['#F0FCFF', '#BCE0F4']);
      glow(CX + 10, ay - 250, 260, '#E6F8FF', .5 * up);
      apsara(CX + 10, ay, 11.5, { boilKey: 'apE', flip: true, eyes: 'happy', mouth: 'smile', blush: .5, pray: up });
      sparkleBurst(CX + 10, ay - 260, 200, r * .6, 'spkE', 9, ['#FFFFFF', '#BCE0F4']);
    }
    camEnd();
    caps(t);
  }

  // ================= F · "the sage's curse is gone… and that is no sage: a demon" (58.1) =================
  function shotTruth(t, lt, dur) {
    const g = t - F0, tr = t - TRUTH, known = tr >= 0, away = easeIn(seg(t, F0 + 3.6, F0 + 4.4));
    camBegin(540, 1400 - lt * 3, 1.34 + .004 * lt);
    lakeSet(t, 'lkE');
    const HX = 360, HY = 1790, HU = 12.5, AXp = 720, ay = 1650 + 8 * Math.sin(t * 3) - away * 1300;
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hF', hx: .4, lookX: .9, lookY: -.4, eyes: known && tr > .5 ? 'angry' : 'wide', mouth: known && tr > .5 ? 'flat' : 'O', puff: known ? .3 : 0, tailSway: t * 3,
      emote: known && tr > .5 ? 'anger' : null, emoteK: popk(t, TRUTH + .5, 6), emoteAge: tr - .5 });
    water(HX, HY + 4, 150, 'wtF');
    glow(AXp, ay - 250, 260, '#E6F8FF', .5);
    apsara(AXp, ay, 11.5, { boilKey: 'apF', flip: true, hx: -.3, lookX: -.8, eyes: 'normal', mouth: talk(t, F0 + .3, F0 + 3.4, 'smile', 'open'), blush: .4, handR: known ? [6.4, -17.4] : [3, -13.6], bendR: -1, handL: [-3, -12] });
    for (let i = 0; i < 5; i++) { const q = frac(t * .5 + i / 5); boilSeed('apsp' + i); paint(starPts(AXp - 100 + hash(i * 3.1) * 200, ay - q * 380, 9 * Math.sin(q * Math.PI), .4, 4), { wash: '#FFFFFF', ink: null }); }
    // her bubble: the sage… who is a demon
    const bk = popk(t, F0 + 1.5, 5) * (1 - away);
    h4Bubble(540, 1250, 128, 104, AXp - 70, ay - 290, bk, 'bbF', '#FFFDF2');
    if (bk > .9) {
      if (!known) { rishi(540, 1336, 5.4, 0, sageO(t, { boilKey: 'sgF', noShadow: true })); h7Halo(542, 1336 - 29 * 5.4, 26, t, 1, 'hlF'); }
      else { kalanemi(540, 1336, 5.6, { boilKey: 'klF', noShadow: true, eyes: 'angry', mouth: 'teeth' }); poof(540, 1260, 130, tr / .5, 'pfF', ['#D8C8F0', '#A898D0']); }
    }
    camEnd();
    caps(t);
    wipeOut(lt, dur, NIGHTW);
  }

  // ================= G · "take your fee first, guru ji": his tail round the demon's head, and down (58.2–3) =================
  function shotFee(t, lt, dur) {
    const g = t - WHAM, hit = g >= 0, wind = seg(t, WHAM - .55, WHAM - .05);
    const sh = shk(t, WHAM, 22, 2.4);
    ashCam(lt, 1.36 + kick(t, WHAM) * 1.8, [Math.sin(t * 71) * sh, Math.cos(t * 53) * sh * .7]);
    h7Ashram(t, 'ahD');
    const HX2 = AX - 20;
    if (!hit) {
      const so = sageO(t, { boilKey: 'sgG', hx: .4, lookX: .8, eyes: wind > .3 ? 'wide' : 'smug', mouth: wind > .3 ? 'O' : 'grin', puff: .6 * (1 - wind), handR: [5.2, -13.4], bendR: -.6, handL: [-3, -11] });
      rishi(SX, SY, SU, 0, so);
      const [tx, ty] = naradaTop(SX, SY, SU, so);
      h7Halo(tx + 6, ty - 34, 62, t, 1, 'hlG');
      // the tail, coming round
      if (wind > 0) { boilSeed('tailG'); const [hx, hy] = naradaHead(SX, SY, SU, so); const P = [[HX2 + 20, AY - 7 * AU], [HX2 + 150, AY - 12 * AU], [lerp(HX2 + 180, HX2 - 60, wind), AY - lerp(20, 31, wind) * AU], [lerp(HX2 + 120, hx + 30, wind), lerp(AY - 26 * AU, hy - 40, wind)], [lerp(HX2 + 100, hx - 50, wind), lerp(AY - 24 * AU, hy + 10, wind)]]; paint(ribbon(P, 20, 12), { wash: HNM.fur, fill: HNM.furDk, fillOp: 50, tex: .4, ink: HNM.ink, sw: 1, curv: .6 }); }
    } else {
      // the demon, himself again, flat on the ground, seeing stars; the halo rolls off
      const fall = easeOut(clamp(g / .35));
      kalanemi(SX - 60 + 13 * 12 * fall, SY + 20, 12, { boilKey: 'klG', rot: -Math.PI / 2 * fall, eyes: 'swirl', mouth: 'open', noShadow: true });
      h6Dizzy(SX - 60 - 4 * 12, SY - 70, 70, t, 'dzG', 4);
      const roll = clamp(g / 1.4); h7Halo(lerp(SX, 130, roll), lerp(SY - 300, SY + 10, easeOut(clamp(g / .5))), 50, t, 1, 'hlG', roll * 9);
      poof(SX, SY - 200, 320, g / .6, 'pfG', ['#D8C8F0', '#A898D0']);
      h6Impact(SX + 10, SY - 250, 330, g * 1.3, 'imG'); sfx('WHAM!', SX + 60, SY - 440, 110, '#FFF2A0', g, { life: 1.0, stroke: H6.ink, sw: .25, rot: -.08 });
    }
    const dust = hit && g > .7;
    hanuman(HX2, AY, AU, { ...HN, boilKey: 'hG', hx: -.4, lookX: -.9, lookY: hit ? .5 : 0, eyes: hit ? (dust ? 'smug' : 'determined') : wind > 0 ? 'determined' : 'happy', mouth: hit ? (dust ? 'smug' : 'grin') : talk(t, G0 + .3, G0 + 1.6, 'smile', 'open'),
      blush: hit ? 0 : .4, rot: -.25 * wind * (hit ? Math.exp(-g * 5) : 1), tail: wind > 0 && !hit ? false : 'curl', tailSway: t * 4,
      handL: dust ? [-1.6 + .5 * Math.sin(t * 16), -13.4] : wind > 0 ? [-4.8, -17] : [-4.6, -14], handR: dust ? [1.6 - .5 * Math.sin(t * 16), -13.2] : [3.4, -12], bendL: 1, bendR: dust ? 1 : -1 });
    if (dust) for (let i = 0; i < 3; i++) { const q = frac((g - .7) * 1.6 + i / 3); boilSeed('dstG' + i); paint(ellPts(HX2 + (i - 1) * 26, AY - 13.4 * AU - q * 50, 10 * (1 - q) + 5, 8 * (1 - q) + 4, 8), { wash: '#FFFFFF', washOp: 180 * (1 - q), ink: null }); }
    camEnd();
    if (hit && g < .1) flash((1 - g / .1) * .8, '#FFFFFF');
    caps(t);
    wipeIn(lt, NIGHTW);
    wipeOut(lt, dur, NIGHTW);
  }

  // ================= I · over Ayodhya at night with the whole mountain; Bharat sees a giant shape (58.4, doha 58) =================
  const BX = 300, BY = 1770, BU = 13.5;
  function shotOver(t, lt, dur) {
    const g = t - I0, saw = t >= SEES;
    camBegin(540, 1290 - lt * 2, 1.12 + .004 * lt);
    h7Avadh(t, 'avI', 1720, 770, 1200);
    // his shadow sweeping over the roofs and the garden
    const fx = lerp(60, 800, clamp(g / 4.4));
    boilSeed('shadI'); paint(ellPts(fx + 120, 1740, 330, 70, 18), { wash: '#0A0E2A', washOp: 120, ink: null });
    speedLines(fx - 80, 1280, 120, 'spI', 4, 16);
    flyer(fx, 1400 + 6 * Math.sin(t * 3), 8, t, { boilKey: 'hI' });
    bharat(BX, BY, BU, { ...BH, boilKey: 'bhI', hx: .3, lookX: clamp((fx - BX) / 400, -1, 1), lookY: -1, eyes: saw ? 'wide' : 'look', mouth: saw ? 'O' : 'flat', htilt: -.08,
      handL: [-5.4, -13], armL: h7Bow(0, false), bendL: .3, emote: saw ? '!' : g > .8 ? '?' : null, emoteK: popk(t, saw ? SEES : I0 + .8, 6), emoteAge: saw ? t - SEES : g - .8 });
    camEnd();
    caps(t);
    wipeIn(lt, NIGHTW);
  }

  // ================= J · "a demon!": he draws to his ear and shoots an arrow with no tip (doha 58) =================
  function shotShoot(t, lt, dur) {
    const g = t - J0, draw = ease(seg(t, DRAW, DRAW + 1.0)), shot = t >= SHOOT, s = t - SHOOT, aim = ease(seg(t, DRAW - .5, DRAW));
    camBegin(520, 1400 - lt * 3 - 30 * aim, 1.5 + .006 * lt + kick(t, SHOOT));
    h7Avadh(t, 'avI', 1720, -900);
    const X = 420, Y = 1790, U_ = 13;
    const bo = { ...BH, boilKey: 'bhJ', flip: true, rot: -.22 * aim, hx: -.3, lookX: -1, lookY: -.4 * aim, eyes: aim > .5 ? 'determined' : 'wide', mouth: aim > .5 ? 'flat' : 'O', brow: -.6 * aim,
      handL: aim > 0 ? [lerp(-5.4, -7.6, aim), lerp(-13, -18, aim)] : [-5.4, -13], bendL: .3,
      handR: aim > 0 ? [lerp(3.4, lerp(-2.6, -.2, draw * (shot ? 0 : 1)), aim), lerp(-11, lerp(-14.4, -18.8, draw * (shot ? 0 : 1)), aim)] : undefined, bendR: .9,
      armL: h7Bow(shot ? .5 * Math.exp(-s * 14) * Math.cos(s * 60) * .3 : draw, !shot && aim > .6) };
    bharat(X, Y, U_, bo);
    // what he thinks it is
    const bk = popk(t, J0 + .25, 5) * (1 - seg(t, DRAW - .1, DRAW + .2));
    h4Bubble(660, 1215, 140, 108, X + 60, Y - 29 * U_, bk, 'bbJ', '#E8E2F4');
    if (bk > .9) { kalanemi(660, 1303, 5.6, { boilKey: 'klJ', noShadow: true, eyes: 'angry', mouth: 'roar', pal: { skin: '#3A3458', skinDk: '#2A2444', skinLt: '#4E486E', dhoti: '#2A2444', dhotiDk: '#1E1A34' } }); emote('!', 760, 1150, 16, 1, g); }
    // the arrow, gone up into the dark
    if (shot && s < .6) { const q = s / .6, a = -.5 - .42; h7Blunt(lerp(X + 150, 1150, q), lerp(Y - 300, 560, q), -.86, 150, 'arJ'); speedLines(lerp(X + 150, 1150, q) - 60, lerp(Y - 300, 560, q) + 70, 60, 'spJ', 2, 14); }
    if (shot) sfx('TWANG!', X + 190, Y - 260, 78, '#FFF2A0', s, { life: .8, stroke: H6.ink, sw: .25, rot: -.1 });
    camEnd();
    caps(t);
  }

  // ================= K · he falls, still saying "Ram… Ram…" (59.1) =================
  const FX = 540, GY = 1800;
  function shotFall(t, lt, dur) {
    const g = t - HIT, hit = g >= 0, d = t - GROUND, down = d >= 0;
    const sh = shk(t, HIT, 16) + shk(t, GROUND, 22, 2.5);
    camBegin(540 + Math.sin(t * 71) * sh, 1290 + Math.cos(t * 53) * sh * .7, 1.12 + kick(t, HIT) + kick(t, GROUND));
    h7Avadh(t, 'avI', 1720, 770, 1200);
    const fall = hit ? easeIn(clamp(g / (GROUND - HIT))) : 0;
    const hx = lerp(640, FX, clamp((t - K0) / (GROUND - K0))), hy = lerp(1400, GY + 30, fall), u = lerp(8, LU, fall);
    // Bharat, far left: the bow comes down as he hears the name
    const heard = hit && g > .9;
    bharat(190, 1790, 11, { ...BH, boilKey: 'bhK', hx: .4, lookX: 1, lookY: down ? .2 : -.8, eyes: heard ? 'wide' : 'determined', mouth: heard ? 'O' : 'flat', handL: [-5.4, -13], bendL: .3, armL: h7Bow(0, false),
      emote: heard ? '!' : null, emoteK: popk(t, HIT + .95, 6), emoteAge: g - .95 });
    if (!hit) { const q = clamp((t - K0) / (HIT - K0)); h7Blunt(lerp(300, hx + 30, q), lerp(1640, hy - 100, q), -.75, 120, 'arK'); flyer(hx, hy, u, t, { boilKey: 'hK', eyes: 'wide', mouth: 'O' }); }
    else if (!down) {
      flyer(hx, hy, u, t, { boilKey: 'hK', rot: .35 + fall * 4.2, eyes: 'closed', mouth: 'open' }, 15 * (1 - .2 * fall));
      h6Impact(hx + 30, 1290, 220, g * 1.4, 'imK'); sfx('THUNK!', hx - 210, 1210, 80, '#FFF2A0', g, { life: .9, stroke: H6.ink, sw: .25, rot: .06 });
    } else {
      parked(FX + 270, GY + 10, t, 220, 'pkK');
      lyingH(FX, GY + 30, { boilKey: 'hK2', mouth: Math.sin(t * 8) > 0 ? 'open' : 'flat' });
      poof(FX, GY, 380, d / .7, 'dustK', ['#5A6A8E', '#3E4E72']);
    }
    // the name, rising from him all the way down
    if (hit) for (let i = 0; i < 4; i++) { const a = g - .25 - i * .75; if (a < 0 || a > 1.5) continue; const k = a / 1.5, y0 = lerp(1400, GY, clamp((.25 + i * .75) / (GROUND - HIT))); boilSeed('ramK' + i); letter('RAM', hx - 130 + (i % 2) * 250 + Math.sin(a * 4) * 12, y0 - 110 - k * 110, 46, GOLDC, { stroke: HSK.ink, sw: .2, ink: false, rot: (i % 2 ? .08 : -.08), alpha: clamp(a * 5) * (1 - clamp((k - .7) / .3)) }); }
    camEnd();
    if (hit && g < .12) flash((1 - g / .12) * .7, '#FFFFFF');
    caps(t);
  }

  // ================= L · Bharat runs to him, holds him; he does not wake (59.1–2) =================
  // the ground two-shot: Hanuman lying (head left) at LXc, Bharat sitting at his head, the mountain behind his feet
  const LXc = 530, LYc = 1785, KX2 = 318, KY2 = 1775, KU2 = 12;
  const groundCam = (lt, z = 1.4, cx = 560, cy = 1470) => camBegin(cx, cy - lt * 3, z + .005 * lt);
  const nightGround = (t) => { h7Avadh(t, 'avL', 1690, -900); parked(990, LYc + 30, t, 250, 'pkL'); };
  function shotRun(t, lt, dur) {
    const g = t - L0, kn = t >= KNEEL, run = easeOut(seg(t, L0, KNEEL));
    groundCam(lt);
    nightGround(t);
    glow(LXc, LYc, 200, '#FFE08A', .12);
    if (!kn) { bharat(lerp(-120, KX2, run), KY2, KU2, { ...BH, boilKey: 'bhL', walk: t * 3.4, hx: .4, lookX: .9, lookY: .4, eyes: 'wide', mouth: 'O', handL: [-4.4, -16], handR: [5.4, -16] }); speedLines(lerp(-120, KX2, run) - 60, KY2 - 15 * KU2, 130, 'spL', 4, 22); }
    else {
      const k = t - KNEEL, shake = Math.sin(t * 14) * .25 * seg(t, KNEEL + .6, KNEEL + 1.0) * (1 - seg(t, KNEEL + 2.0, KNEEL + 2.4));
      bharat(KX2, KY2, KU2, { ...BH, boilKey: 'bhL', sit: 1, hx: .5, lookX: .8, lookY: .8, eyes: k > 2.0 ? 'closed' : 'wide', mouth: k > 2.0 ? 'frown' : talk(t, KNEEL + .4, KNEEL + 2.0, 'frown', 'open'),
        handR: [6.4 + shake, -9.4], handL: [3.4 + shake, -8.2], bendR: -1, bendL: -1, dy: hop(k, .2, 9, 3) });
      if (k > 2.0) { const [ex, ey] = naradaHead(KX2, KY2, KU2, { sit: 1 }); tears(ex + 22, ey + 34, t, 'trL', .85); }
    }
    lyingH(LXc + (kn ? Math.sin(t * 14) * 3 * seg(t, KNEEL + .6, KNEEL + 1.0) * (1 - seg(t, KNEEL + 2.0, KNEEL + 2.4)) : 0), LYc + 30, { boilKey: 'hL' });
    camEnd();
    caps(t);
  }

  // ================= M · "if my love for Ram is true, let him wake, free of pain" (59.3–4) =================
  function shotPray(t, lt, dur) {
    const g = t - M0, k = ease(seg(t, LIGHT, LIGHT + 1.6));
    groundCam(lt, 1.62, 500, 1500);
    nightGround(t);
    paint(rectPts(-300, -600, W + 600, 3400), { wash: '#141838', washOp: 110 * k, ink: null });
    glow(LXc - 60, LYc - 10, 420 * k, '#FFE08A', .45 * k); glow(LXc - 60, LYc - 10, 180 * k, '#FFFFFF', .4 * k);
    bharat(KX2, KY2, KU2, { ...BH, boilKey: 'bhL', sit: 1, hx: .2, pray: 1, bow: .06 + .03 * Math.sin(g * 2), eyes: 'closed', mouth: talk(t, M0 + .3, M0 + 3.6, 'flat', 'open') });
    { const [ex, ey] = naradaHead(KX2, KY2, KU2, { sit: 1 }); tears(ex + 16, ey + 34, t, 'trM', .85); }
    lyingH(LXc, LYc + 30, { boilKey: 'hL', mouth: k > .8 ? 'smile' : 'flat' });
    if (k > 0) for (let i = 0; i < 9; i++) { const q = frac(t * .55 + i / 9); boilSeed('riseM' + i); paint(starPts(LXc - 240 + hash(i * 3.1) * 400, LYc - q * 260, 11 * Math.sin(q * Math.PI) * k, .4, 4), { wash: '#FFF2C0', ink: null }); }
    camEnd();
    caps(t);
  }

  // ================= N · he sits up: "victory to Ram, lord of Kosala!"; Bharat holds him (59.4, soratha 59) =================
  const SITX = 600, SITY = 1790;
  function shotWake(t, lt, dur) {
    const g = t - WAKE, up = g >= 0, h = t - HUG, hug = h >= 0, hk = ease(clamp(h / .4));
    groundCam(lt, 1.5 + kick(t, WAKE), 520, 1480);
    nightGround(t);
    glow(SITX, SITY - 150, 320, '#FFE08A', up ? .35 : .45);
    const bx = KX2 + 60 + hk * 62;
    bharat(bx, KY2, KU2, { ...BH, boilKey: 'bhL', sit: 1, hx: .5, lookX: .9, lean: 1.6 * hk, eyes: hug ? 'closed' : up ? 'wide' : 'closed', mouth: hug ? 'smile' : up ? 'O' : 'flat', blush: hug ? .5 : 0, pray: up ? 0 : 1,
      handR: hug ? [7.4, -15.4] : up ? [4.6, -19] : undefined, handL: hug ? [4.2, -12] : up ? [-4.6, -19] : undefined, bendR: -1, bendL: -1 });
    if (up && !hug) { const [ex, ey] = naradaHead(bx, KY2, KU2, { sit: 1 }); tears(ex + 16, ey + 34, t, 'trN', .7); }
    if (!up) lyingH(LXc, LYc + 30, { boilKey: 'hL', mouth: 'smile' });
    else hanuman(SITX - hk * 40, SITY, 12, { ...HN, boilKey: 'hN', sit: 1, hx: hug ? -.5 : 0, lean: -1.4 * hk, lookX: hug ? -.8 : 0, eyes: hug ? 'closed' : 'happy', mouth: hug ? 'smile' : talk(t, WAKE + .1, HUG, 'grin', 'open'), blush: .5, dy: hop(g, .6, 9, 2.4),
      handL: hug ? [-5.4, -13] : [-5, -24.6], handR: hug ? [-1.6, -12.4] : [5, -24.6], bendL: -1, bendR: hug ? 1 : -1, tailSway: t * 5 });
    if (up) sparkleBurst(SITX, SITY - 230, 240, g * .7, 'spkN', 10, ['#FFFFFF', GOLDC]);
    if (hug) { hearts(480, 1360, t, HUG + .3, 'hN1', 3, 18); hearts(480, 1360, t, HUG + 1.3, 'hN2', 3, 18); }
    camEnd();
    if (up && g < .12) flash((1 - g / .12) * .5, '#FFF6D8');
    caps(t);
  }

  // ================= O · he hears it all, and weeps: "I could not serve Ram even once" (60.1–2) =================
  function shotGrief(t, lt, dur) {
    const g = t - O0, sad = g > 1.8;
    groundCam(lt, 1.42, 540, 1450);
    nightGround(t);
    const bo = { ...BH, boilKey: 'bhL', sit: 1, hx: sad ? .1 : .5, lookX: sad ? 0 : .9, lookY: sad ? .8 : 0, bow: sad ? .22 : 0, eyes: sad ? 'closed' : 'wide', mouth: sad ? talk(t, O0 + 2.2, O0 + 4.2, 'frown', 'open') : 'O',
      handR: sad ? [1.6, -15.6] : undefined, handL: sad ? [-1.6, -15.6] : undefined, bendR: 1, bendL: 1 };
    bharat(KX2 + 20, KY2, KU2, bo);
    if (sad) { const [ex, ey] = naradaHead(KX2 + 20, KY2, KU2, bo); tears(ex + 10, ey + 40, t, 'trO', .9); }
    hanuman(SITX + 30, SITY, 12, { ...HN, boilKey: 'hN', sit: 1, hx: -.5, lookX: -.8, eyes: sad ? 'look' : 'normal', mouth: sad ? 'flat' : talk(t, O0 + .1, O0 + 1.8, 'flat', 'open'), brow: sad ? 1 : 0, handR: sad ? undefined : [4.6, -17], handL: sad ? [-5.6, -13] : undefined, bendL: -1, tailSway: t * 2 });
    // what he tells him: Lakshman on the ground, Ram beside him
    const bk = popk(t, O0 + .2, 5) * (1 - seg(t, O0 + 2.6, O0 + 2.9));
    h4Bubble(480, 1375, 165, 92, SITX - 10, SITY - 20 * 12, bk, 'bbO', '#FFFDF2');
    if (bk > .9) { vanRam(385, 1440, 4.6, { boilKey: 'rmO', sit: 1, kodanda: false, eyes: 'closed', mouth: 'frown', hx: .5, noShadow: true }); lyingL(520, 1452, 4.2, { boilKey: 'lkO' }); }
    camEnd();
    caps(t);
  }

  // ================= P · "sit on my arrow, mountain and all: I'll shoot you to Ram" (60.3) =================
  const PBX = 300, PHX = 760, PY = 1790, PU = 12.5;
  const standCam = (lt, z = 1.3) => camBegin(545, 1400 - lt * 3, z + .005 * lt);
  function shotOffer(t, lt, dur) {
    const g = t - P0;
    standCam(lt);
    nightGround(t);
    bharat(PBX, PY, PU, { ...BH, boilKey: 'bhP', hx: .4, lookX: .9, eyes: 'determined', mouth: talk(t, P0 + .3, P0 + 4.2, 'smile', 'open'), handL: [-5.4, -13], bendL: .3, armL: h7Bow(0, false), handR: g > 1.4 ? [5.2, -24] : [4.6, -15], bendR: -1 });
    hanuman(PHX, PY, PU, { ...HN, boilKey: 'hP', hx: -.4, lookX: -.6, lookY: -.6, eyes: g > 2.0 ? 'wide' : 'normal', mouth: g > 2.0 ? 'O' : 'flat', htilt: .08, tailSway: t * 3, emote: g > 2.4 ? '?' : null, emoteK: popk(t, P0 + 2.4, 6), emoteAge: g - 2.4 });
    // his plan, in a bubble: Hanuman and the mountain riding one arrow
    const bk = popk(t, P0 + 1.3, 5);
    h4Bubble(520, 1335, 200, 92, PBX + 70, PY - 27 * PU, bk, 'bbP', '#FFFDF2');
    if (bk > .9) {
      const ax = 500 + 14 * Math.sin(t * 5), ay = 1385 + 4 * Math.sin(t * 9);
      speedLines(ax - 150, ay, 60, 'spP', 3, 12);
      h7Blunt(ax + 160, ay, 0, 290, 'arP');
      hanuman(ax + 10, ay - 2, 2.8, { ...HN, boilKey: 'hPb', sit: 1, eyes: 'wide', mouth: 'O', noShadow: true, tail: false, handL: [-2.4, -26], handR: [2.4, -26] });
      herbPeak(ax + 10, ay - 2.8 * 19, 52, t, { root: 1, key: 'pkPb', herbs: 5 });
    }
    camEnd();
    caps(t);
  }

  // ================= Q · a moment of pride, then he thinks of Ram, and bows (60.4) =================
  function shotPride(t, lt, dur) {
    const g = t - Q0, b = t - BOW, bowed = b >= 0, bk2 = ease(clamp(b / .5));
    standCam(lt, 1.34);
    nightGround(t);
    bharat(PBX, PY, PU, { ...BH, boilKey: 'bhP', hx: .4, lookX: .9, eyes: bowed && b > .6 ? 'happy' : 'normal', mouth: 'smile', handL: [-5.4, -13], bendL: .3, armL: h7Bow(0, false), handR: bowed && b > .8 ? [5.4, -17.4] : undefined, bendR: -1 });
    hanuman(PHX, PY, PU, { ...HN, boilKey: 'hP', hx: bowed ? -.5 : .1, lookX: bowed ? -.8 : .3, lookY: bowed ? .3 : -.5, puff: bowed ? 0 : .9 * seg(t, Q0 + .2, Q0 + .8), eyes: bowed ? (b < .5 ? 'wide' : 'closed') : 'smug', mouth: bowed ? 'smile' : 'smug',
      blush: bowed ? .7 * bk2 : 0, bow: .42 * bk2 * (b > .3 ? 1 : 0), pray: bowed ? bk2 : 0, handL: bowed ? undefined : [-3.6, -11], handR: bowed ? undefined : [1.2, -19.6], bendR: 1, tailSway: t * (bowed ? 2 : 4) });
    // pride's bubble: the arrow snapping under him and his mountain
    const pk = popk(t, Q0 + .9, 5) * (1 - seg(t, BOW - .1, BOW + .15));
    h4Bubble(535, 1335, 150, 92, PHX - 60, PY - 27 * PU, pk, 'bbQ', '#FFFDF2');
    if (pk > .9) {
      const sag = 22 + 7 * Math.sin(t * 7), ax = 535, ay = 1380;
      boilSeed('snapQ');
      inkLine([[ax - 120, ay - 10], [ax - 8, ay + sag]], 2.8, H7.shaft, 'ink', 0); inkLine([[ax + 8, ay + sag], [ax + 120, ay - 10]], 2.8, H7.shaft, 'ink', 0);
      paint(starPts(ax, ay + sag + 6, 16, .45, 7, t), { wash: '#FFF2A0', ink: H7.ink, sw: .6 });
      hanuman(ax, ay + sag - 6, 2.8, { ...HN, boilKey: 'hQb', sit: 1, eyes: 'smug', mouth: 'smug', noShadow: true, tail: false, puff: 1, handL: [-2.4, -26], handR: [2.4, -26] });
      herbPeak(ax, ay + sag - 6 - 2.8 * 19, 56, t, { root: 1, key: 'pkQb', herbs: 5 });
    }
    // then: Ram, in his mind
    if (bowed) {
      const rk = popk(t, BOW + .05, 5);
      glow(535, 1335, 200 * rk, '#FFE08A', .6 * rk);
      boilSeed('ramQ'); paint(ellPts(535, 1335, 100 * rk, 100 * rk, 26), { wash: '#FFF2C4', ink: HSK.goldDk, sw: 1.2 });
      if (rk > .9) vanRam(535, 1428, 6, { boilKey: 'rmQ', noShadow: true, kodanda: false, eyes: 'happy', mouth: 'smile', handR: [3.6, -15.6], bendR: -1 });
      sparkleBurst(535, 1335, 170, b * .8, 'spkQ', 8, ['#FFFFFF', GOLDC]);
    }
    camEnd();
    caps(t);
    wipeOut(lt, dur, PEACH);
  }

  // ================= R · the twist: all the way, he kept praising Bharat's love for Ram (doha 60) =================
  function shotPraise(t, lt, dur) {
    const g = t - R0;
    camBegin(540, 1180, 1.0 + .008 * lt);
    warmBack(t, 'wbR', 540, 1300);
    for (let i = 0; i < 3; i++) cloudPuff(frac(.9 - t * .12 + i * .37) * 1500 - 200, 1560 + i * 110, 150 + i * 30, 'clR' + i, 200, '#FFF6EC', '#F2D2B0');
    speedLines(250, 1500, 200, 'spR', 5, 30);
    flyer(450, 1820 + 10 * Math.sin(t * 3), 14.5, t, { boilKey: 'hR', eyes: g > 2.2 ? 'heart' : 'happy', mouth: 'smile', blush: .7, hx: .3 }, 14);
    // Bharat, in his thoughts
    const bk = popk(t, R0 + .7, 5);
    h4Bubble(790, 1150, 132, 132, 640, 1420, bk, 'bbR', '#FFFDF2');
    if (bk > .9) { glow(790, 1150, 150, '#FFE08A', .35); bharat(790, 1262, 7, { ...BH, boilKey: 'bhR', noShadow: true, pray: 1, eyes: 'closed', mouth: 'smile', blush: .4 }); }
    hearts(790, 1000, t, R0 + 1.6, 'hR1', 3, 16); hearts(790, 1000, t, R0 + 3.2, 'hR2', 3, 16);
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, GOLDW);
  }

  // ================= S · he arrives in time; Lakshman sits up, glad (61–62.1) =================
  function shotHealed(t, lt, dur) {
    const g = t - S0, up = g > .7;
    camBegin(540, 1345 - lt * 3, 1.25 + .006 * lt);
    battlefield(t, .35, 'bfS');
    vanRam(250, 1700, 12, { boilKey: 'rmS', sit: 1, kodanda: false, hx: .5, lookX: .8, lean: up ? 1.2 : 0, eyes: up ? 'heart' : 'closed', mouth: up ? 'grin' : 'frown', blush: up ? .5 : 0, handR: up ? [6.4, -15] : [4.4, -11], bendR: -1 });
    if (!up) lyingL(470, 1752, 10.5); else vanLakshman(470, 1712, 11.5, { boilKey: 'lkS', sit: 1, kodanda: false, hx: -.3, lookX: -.5, eyes: 'happy', mouth: 'smile', blush: .5, dy: hop(g - .7, .5, 9, 2.4) });
    if (up) { sparkleBurst(470, 1500, 220, (g - .7) * .8, 'spkS', 9, ['#FFFFFF', '#C8FFD0']); hearts(360, 1330, t, S0 + 1.4, 'hS', 3, 18); }
    const ho = { ...HN, boilKey: 'hS', hx: -.4, lookX: -.8, eyes: 'happy', mouth: 'grin', blush: .4, handL: [-2.6, -26.4], handR: [2.6, -26.4], bendL: -1, bendR: -1, tailSway: t * 5, dy: hop(g, .5, 8, 1.5) };
    const [px, py] = naradaHand(800, 1700, 11.5, ho, -1), [qx, qy] = naradaHand(800, 1700, 11.5, ho, 1);
    herbPeak((px + qx) / 2, (py + qy) / 2 - 6, 190, t, { root: 1, key: 'pkS', herbs: 10 });
    hanuman(800, 1700, 11.5, ho);
    camEnd();
    caps(t);
    wipeIn(lt, GOLDW);
    wipeOut(lt, dur, PEACH);
  }

  // ================= U · the ask: the Lakshman of your family, or the Bharat? =================
  function shotAsk(t, lt, dur) {
    const g = t - U0, a1 = popk(t, U0 + .5, 5), a2 = popk(t, U0 + 1.3, 5);
    camBegin(540, 1010, 1.0 + .006 * lt);
    warmBack(t, 'wbU', 540, 1150);
    // left: the one who went along
    if (a1 > .05) {
      vanRam(350, 1420, 12.5, { boilKey: 'rmU', walk: t * 2.2, flip: true, eyes: 'happy', mouth: 'smile', hx: -.3 });
      vanLakshman(150, 1430, 12.5, { boilKey: 'lkU', walk: t * 2.2 + 1, flip: true, eyes: 'determined', mouth: 'smile', hx: -.3 });
      letter('GOES ALONG', 250, 1010, 50, '#FFFFFF', { stroke: HSK.ink, sw: .22, ink: false, rot: -.03, pop: (t - U0 - .5) * 5 });
    }
    if (g > 1.0) letter('OR', 505, 1240, 60, GOLDC, { stroke: HSK.ink, sw: .22, ink: false, rot: 0, pop: (g - 1.0) * 5 });
    // right: the one who stayed and kept the home (Ram's sandals on the seat)
    if (a2 > .05) {
      h7Paduka(850, 1420, 150, 'pkU');
      bharat(660, 1420, 12.5, { ...BH, boilKey: 'bhU', sit: 1, pray: 1, hx: .5, lookX: .8, eyes: 'happy', mouth: 'smile', blush: .4 });
      letter('KEEPS THE HOME', 745, 1075, 50, '#FFFFFF', { stroke: HSK.ink, sw: .22, ink: false, rot: .03, pop: (t - U0 - 1.3) * 5 });
    }
    hearts(505, 1130, t, U0 + 2.4, 'hU1', 3, 20);
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, PEACH);
  }

  // ================= V · next: Ram gave everyone jewels; Hanuman asked for this (Uttara 39–40: Ram offers no boon) =================
  function shotNext(t, lt, dur) {
    const g = t - V0;
    camBegin(540, 1180, 1.0 + .01 * lt);
    warmBack(t, 'wbV', 540, 1300);
    ram(350, 1760, 17, { boilKey: 'rmV', hx: .4, lookX: .8, eyes: 'happy', mouth: talk(t, V0 + .2, V0 + 1.6, 'smile', 'open'), handR: [6.4, -16], bendR: -1, kodanda: false });
    hanuman(730, 1760, 15, { ...HN, crown: undefined, boilKey: 'hV', sit: 1, pray: 1, hx: -.4, lookX: -.8, lookY: -.5, eyes: g > 1.4 ? 'happy' : 'wide', mouth: 'smile', blush: .5, tailSway: t * 2,
      emote: g > 1.6 ? '?' : null, emoteK: popk(t, V0 + 1.6, 6), emoteAge: g - 1.6 });
    sparkleBurst(540, 1420, 160, (g - .6) * .7, 'spkV', 8, ['#FFFFFF', GOLDC]);
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
  }
  function shotCard(t, lt, dur) { hsCard(t, CARDC); }

  shots([[0, shotHook], [B0, shotHerb], [C0, shotSend], [D0, shotSage], [E0, shotCroc], [F0, shotTruth], [G0, shotFee], [I0, shotOver], [J0, shotShoot], [K0, shotFall],
    [L0, shotRun], [M0, shotPray], [N0, shotWake], [O0, shotGrief], [P0, shotOffer], [Q0, shotPride], [R0, shotPraise], [S0, shotHealed], [U0, shotAsk], [V0, shotNext], [CARD, shotCard]]);
})();
