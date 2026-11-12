// hanu2.js: "The day baby HANUMAN got 8 SUPERPOWERS" (ad 86, Hanuman series Part 2, ~92 s, Bangers captions, retro
// SFX, no voice). Valmiki Ramayana, Uttara Kanda 35.21–36.36 (Agastya to Ram; verse numbers as in the Tirupati text at
// heritage.iitk.ac.in): hungry, the baby leaps at the rising sun for a fruit; Indra's vajra strikes him down and
// breaks his jaw; Vayu, angry, takes his son into a cave and stops moving in all beings; Brahma comes with the gods,
// strokes the child and he lives; the wind blows again; Brahma: "this child will do your work: give him boons"; the
// eight boons in order (Indra, Surya, Varuna, Yama, Kubera, Shiva, Brahma, Vishvakarma); "he will be unconquerable";
// he troubles the rishis' ashrams and they make him forget his strength until he is reminded. STORYBOARD.md has the
// plan and the sources; sets are in hanu2_props.js; the series kit is src/hanuman_series.js. All times are video time
// (t); tools/hanu2_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/hanu2_sfx.mjs)
  const LOOK = 1.2, FLEX = 2.4, L0 = 4.4, J0 = 8.0, THROW = 9.2, HIT = 9.7;
  const V0 = 11.6, VIN = 12.0, ANGRY = 13.2, TOCAVE = 14.5, S0 = 15.8;
  const F0 = 20.2, BRAHMA = 20.5, TOUCH = 23.0, WAKE = 23.7, EYES = 24.4, BREATH = 25.0, G0 = 26.2, SLOTS = 28.0;
  const BN = [30.2, 38.0, 42.8, 46.8, 50.8, 54.6, 58.4, 62.6], NAME0 = 34.2, ALL0 = 66.4;
  const GIVE = .9, LAND = 1.7, GAG = 2.2;                    // inside each boon: the light leaves the god, lands, the gag
  const K0 = 70.4, CRACK = 71.6, K2 = 74.6, CURSE = 75.6, DRAIN = 76.4, ASK0 = 79.4, NEXT0 = 84.0, CARD = 87.6;
  const CARDC = hsCardTimes(CARD);
  const BEND = [NAME0, 42.8, 46.8, 50.8, 54.6, 58.4, 62.6, ALL0];   // where each boon's shot ends

  const GOLDC = '#F5C542';
  const popk = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const talk = (t, a, b, rest = 'smile', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const shake = (t, t0, d, a) => (t > t0 && t < t0 + d) ? shakeXY(t, a * (1 - (t - t0) / d)) : [0, 0];
  const kick = (t, t0) => t > t0 ? .05 * Math.exp(-(t - t0) * 6) * Math.cos((t - t0) * 20) : 0;
  const hop = (g, a = .3, f = 8, d = 1.6) => g > 0 ? -a * Math.abs(Math.sin(g * f)) * Math.exp(-g * d) : 0;
  const hearts = (x, y, t, t0, key, n = 3) => { if (t < t0) return; boilSeed(key); for (let i = 0; i < n; i++) { const a = t - t0 - i * .22; if (a < 0 || a > 1.6) continue; const px = x + (i - 1) * 46 + Math.sin(a * 5 + i) * 14, py = y - a * 150, s = 22 * backOut(clamp(a * 4)) * (1 - clamp((a - 1.1) / .5)); paint(heartPts(px, py, s), { wash: '#F2557A', ink: HSK.ink, sw: .8 }); } };
  const glowBehind = (x, y, r, k, col = '#FFE08A') => { if (k > 0) { glow(x, y, r, col, .7 * k); glow(x, y, r * 1.8, col, .3 * k); } };
  const SKYW = ['#8EC4EE', '#FFE9BE'], STORMW = ['#3E4668', '#7E86A6'], ROCKW = ['#C2B6A8', '#9A8E84'], GREYW = ['#B4BAC4', '#D8DBE0'], CAVEW = ['#3A2E3E', '#5E4A52'], GOLDW = [GOLDC, '#F39A2E'], LEAFW = [P1.leaf, P1.leafDk], PEACH = [HSK.marigold, HSK.petal];

  // ---- every caption: [text, y, t0, life, size, colour]
  const NAMES = ['INDRA', 'SURYA', 'VARUNA', 'YAMA', 'KUBERA', 'LORD SHIVA', 'BRAHMA', 'VISHVAKARMA'];
  const BOONS = [
    ['"MY THUNDERBOLT WILL', 'NEVER HURT HIM AGAIN."'],
    ['"A SPARK OF MY OWN LIGHT.', 'AND I WILL BE HIS TEACHER."'],
    ['"WATER WILL NEVER', 'HARM HIM."'],
    ['"HE WILL NEVER', 'FALL SICK."'],
    ['"MY MACE WILL NEVER', 'HURT HIM."'],
    ['"NOR WILL ANY', 'WEAPON OF MINE."'],
    ['"NO BRAHMA-WEAPON.', 'AND A LONG, LONG LIFE."'],
    ['"NO WEAPON I EVER MADE', 'CAN HURT HIM."'],
  ];
  const CAPS = [
    ['THE DAY BABY HANUMAN', 480, -1, 5.25, 82], ['GOT 8 SUPERPOWERS', 606, -1, 5.25, 116, GOLDC],
    ['HUNGRY, HE LEAPT AT THE SUN,', 470, L0 + .1, 3.4, 66], ['THINKING IT WAS A FRUIT!', 572, L0 + .35, 3.15, 74, GOLDC],
    ["INDRA'S THUNDERBOLT", 470, J0 + .1, 3.4, 84, GOLDC], ['STRUCK HIM DOWN.', 580, J0 + .35, 3.15, 92],
    ['VAYU, HIS FATHER, WAS FURIOUS.', 470, V0 + .1, 4.0, 64, GOLDC], ['HE TOOK HIS SON INTO A CAVE…', 568, V0 + .4, 3.7, 64],
    ['…AND THE WIND STOPPED.', 470, S0 + .1, 4.2, 80, GOLDC], ['NO ONE COULD BREATHE.', 578, S0 + .5, 3.8, 82],
    ['BRAHMA CAME TO THE CAVE', 470, F0 + .1, 3.3, 72], ['AND TOUCHED THE CHILD…', 572, F0 + .35, 3.05, 76, GOLDC],
    ['…AND HE WOKE UP!', 520, WAKE, 2.4, 110, GOLDC],
    ['"THIS CHILD WILL DO GREAT THINGS.', 470, G0 + .1, 3.9, 60], ['GODS, GIVE HIM YOUR BLESSINGS!"', 566, G0 + .4, 3.6, 64, GOLDC],
    ['"MY VAJRA BROKE HIS JAW, HIS HANU.', 470, NAME0 + .1, 3.6, 58], ['SO CALL HIM HANUMAN!"', 572, NAME0 + .4, 3.3, 88, GOLDC],
    ['8 GODS. 8 SUPERPOWERS.', 470, ALL0 + .1, 3.8, 86, GOLDC], ['"NO ONE CAN DEFEAT HIM," SAID BRAHMA.', 574, ALL0 + .5, 3.4, 56],
    ['BUT THEN HE WENT WILD', 470, K0 + .1, 4.0, 78], ["IN THE RISHIS' ASHRAM…", 574, K0 + .35, 3.75, 80, GOLDC],
    ['SO THE RISHIS MADE HIM', 462, K2 + .1, 4.6, 72], ['FORGET HIS POWERS…', 562, K2 + .35, 4.35, 90, GOLDC], ['UNTIL SOMEONE REMINDED HIM.', 660, K2 + 1.5, 3.2, 62],
    ['WHICH POWER WOULD', 470, ASK0 + .1, 4.4, 84], ['YOU PICK?', 588, ASK0 + .35, 4.15, 120, GOLDC], ['COMMENT 1 TO 8!', 706, ASK0 + .9, 3.6, 78],
    ['NEXT: HANUMAN MEETS RAM…', 470, NEXT0 + .1, 3.4, 70], ['IN DISGUISE!', 584, NEXT0 + .35, 3.15, 116, GOLDC],
  ];
  BN.forEach((b, i) => {
    const life = BEND[i] - b - .15, three = i === 1 || i === 6;
    CAPS.push([(i + 1) + ' · ' + NAMES[i], 462, b + .05, life, i === 7 ? 84 : 100, GOLDC]);
    CAPS.push([BOONS[i][0], 566, b + .35, life - .3, three ? 60 : 68], [BOONS[i][1], 566 + (three ? 74 : 82), b + .5, life - .45, three ? 60 : 68]);
  });
  // the series marks: the part pill and the source line show in the opening only, then fade out (owner, 11 Nov)
  const MARKS = V0 - .2, SRC = [['VALMIKI RAMAYAN · UTTARA KANDA', L0 + .3, MARKS]];
  const caps = t => {
    for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color });
    if (t < MARKS) { hsPill(2, 1 - seg(t, MARKS - .3, MARKS)); for (const [txt, a, b] of SRC) hsSource(txt, t - a, b - a); }
  };
  // the row of slots: boon i fills when its light lands; the curse greys them left to right; the ask hops them in turn
  const slots = (t) => {
    if (t < SLOTS || t >= NEXT0) return;
    const a = clamp((t - SLOTS) * 3);
    boonSlots(t, i => {
      if (t < SLOTS + .1 * i) return null;
      const t0 = BN[i] + LAND; if (t < t0) return null;
      const s = { k: (t - t0) * 4, grey: clamp((t - DRAIN - i * .12) * 4), hop: 0 };
      if (t >= ALL0 && t < K0) s.hop = 16 * Math.max(0, Math.sin((t - ALL0) * 6 - i * .7));
      if (t >= ASK0) { s.grey = 0; s.hop = 20 * Math.max(0, Math.sin((t - ASK0 - .9) * 3.2 - i * .55)) * clamp(t - ASK0 - .8); }
      return s;
    }, a);
  };

  // ================= A · the hook: the baby and eight lights =================
  const orbit = (t, c, g, front) => {
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * TAU + g * 1.3 + .8; if ((Math.sin(a) >= 0) !== front) continue;
      const x = c[0] + Math.cos(a) * 380, y = c[1] - 70 + Math.sin(a) * 150 + 8 * Math.sin(t * 3 + i), s = 1 + .16 * Math.sin(a);
      glow(x, y, 120, BOON_COL[i], .55);
      boilSeed('hk' + i); paint(ellPts(x, y, 50 * s, 50 * s, 20), { wash: '#FFF5E2', ink: HSK.ink, sw: 1.2 });
      boonIcon(i, x, y, 30 * s);
    }
  };
  function shotHook(t, lt, dur) {
    camBegin(540, 1010 - lt * 5, 1.0 + .012 * lt);
    warmBack(t, 'wbA', 540, 1150);
    const X = 540, Y = 1560, u = 44, g = t + 2;
    const o = { pose: 'stand', boilKey: 'baby', seed: 3, eyes: 'sparkle', mouth: 'grin', glowK: .35, tailSway: t * 1.8, lookY: -.3,
      handL: [-3.4, -6.2], handR: [3.4, -6.2], handShapeL: 'open', handShapeR: 'open', bendL: 1, bendR: 1 };
    if (blinkAt(t, .8)) o.eyes = 'closed';
    if (t > LOOK && t < FLEX) { o.eyes = 'wide'; o.mouth = 'O'; o.lookX = Math.sin((t - LOOK) * 5.2); o.lookY = -.6; o.hx = o.lookX * .5; }
    if (t >= FLEX) { const f = t - FLEX; Object.assign(o, { eyes: blinkAt(t, 3.6) ? 'closed' : 'happy', mouth: 'grin', blush: .7, handL: [-3.6, -10.8], handR: [3.6, -10.8], handShapeL: 'fist', handShapeR: 'fist', bendL: -1, bendR: -1, dy: hop(f, .35, 8, 1.2), glowK: .6 }); }
    const c = bhBelly(X, Y, u, o);
    orbit(t, c, g, false);
    balHanuman(X, Y, u, o);
    orbit(t, c, g, true);
    if (t >= FLEX) sparkleBurst(c[0], c[1] - 150, 420, (t - FLEX) * .8, 'hkburst', 12, ['#FFFFFF', GOLDC]);
    camEnd();
    caps(t);
    wipeOut(lt, dur, SKYW);
  }

  // ================= B1 · he leaps at the sun =================
  function shotLeap(t, lt, dur) {
    const k = easeOut(lt / dur);
    camBegin(540, 1020, 1.0 + .03 * k);
    h2Sky(t, 1100);
    h2Sun(800, 930, 180 + 30 * k, t, { eyes: lt > 1.6 ? 'wide' : 'open', mouth: lt > 1.6 ? 'O' : 'smile', lookX: -1, lookY: 1, sweat: lt > 1.9 });
    const x = lerp(170, 520, k) + 12 * Math.sin(t * 3), y = lerp(1760, 1270, k) + 14 * Math.sin(t * 2.4), u = 34;
    boilSeed('leapsp'); for (let i = 0; i < 6; i++) { const sx = x - 150 - 60 * hash(i * 2.1), sy = y + 150 + (hash(i * 3.3) - .5) * 220; inkLine([[sx, sy], [sx - 170 - 120 * hash(i), sy + 150 + 90 * hash(i)]], 2.6, '#FFFFFF', 'inkfine', 0); }
    balHanuman(x, y, u, { pose: 'fly', rot: .5 + .05 * Math.sin(t * 2.2), boilKey: 'baby', seed: 3, eyes: lt > 2.2 ? 'sparkle' : 'happy', mouth: lt > 2.2 ? 'aam' : 'open', mouthK: .8, drool: lt > 1 ? .8 : 0, tail: 'stream', tailSway: t * 2.4, kick: t * 2.6,
      handL: [-.6, -13.2], handR: [2.8, -12.6], handShapeL: 'open', handShapeR: 'open', lookX: 1, lookY: -.6 });
    camEnd();
    caps(t);
    wipeIn(lt, SKYW);
  }

  // ================= B2 · Indra's vajra strikes him down =================
  function shotVajra(t, lt, dur) {
    const hit = t >= HIT, fall = seg(t, HIT, HIT + 1.3), sh = shake(t, HIT, .45, 20);
    camBegin(540 + sh[0], 1080 + sh[1], 1.06 + .02 * lt);
    h2Storm(t, 0);
    if (!hit && Math.sin(t * 9) * Math.sin(t * 3.7) > .55) { const bx0 = 180 + hash(Math.floor(t * 5)) * 420; h2Bolt(bx0, 640, 300, 'skybolt' + Math.floor(t * 5), '#FFF0A0'); glow(bx0, 640, 300, '#FFF0A0', .5); }
    const ax = 760, ay = lerp(1900, 1640, easeOut(seg(t, J0, J0 + .7))) + 8 * Math.sin(t * 1.8), au = 31;
    cloudPuff(ax, ay + 30, 250, 'icl', 255, '#8E96B6', '#5A6284');
    const wind = ease(seg(t, THROW - .7, THROW - .1)), thr = seg(t, THROW - .1, THROW + .08);
    const io = { boilKey: 'indra', eyes: hit ? 'wide' : t > THROW - .7 ? 'angry' : 'normal', mouth: hit ? 'O' : t > THROW - .7 ? 'shout' : 'flat', lookX: -1, sweat: hit && t > HIT + .5,
      handR: t < THROW - .1 ? [lerp(2.6, 1.6, wind), lerp(-6.8, -9.2, wind)] : [lerp(1.6, 3.4, thr), lerp(-9.2, -3.6, thr)], vajra: t < THROW ? 1 : 0, vajraA: lerp(-.3, -.9, wind) + 2.1 * thr, handL: [-2.0, -1.0] };
    const ao = { boilKey: 'airav', trunk: hit ? 'limp' : 'up', earOut: hit ? .2 : .8, eyes: 'wide', lookX: -1, indra: io, ear: t * 2 };
    airavata(ax, ay, au, ao);
    // the baby, after the big white "fruit"
    const jk = easeOut(seg(t, J0, HIT)), p0 = [150, 1500], p1 = [390, 1180];
    let bx = lerp(p0[0], p1[0], jk), by = lerp(p0[1], p1[1], jk) + 10 * Math.sin(t * 2.4);
    if (hit) { bx = p1[0] - 110 * fall; by = p1[1] - 150 * Math.sin(fall * 1.6) + 1400 * fall * fall; }
    const u = 30, o = { pose: 'fly', boilKey: 'baby', seed: 3, rot: hit ? .5 - fall * 7 : .5, eyes: hit ? 'swirl' : 'sparkle', mouth: hit ? 'O' : 'open', mouthK: .7, tail: 'stream', tailSway: t * 2, kick: t * 2.4, lookX: 1,
      handL: hit ? [-3.2, -12] : [-.4, -13], handR: hit ? [3.2, -12] : [3.2, -12.2], handShapeL: 'open', handShapeR: 'open', jaw: hit ? 1 : 0 };
    balHanuman(bx, by, u, o);
    const seat = airavataSeat(ax, ay, au, ao), hand = indraHand(seat[0], seat[1], au * .95, io, 1), chin = bhMouth(bx, by, u, o);
    if (t > THROW && t < HIT + .04) {
      const k = seg(t, THROW, HIT), v = arcPt(hand, [chin[0] + 20, chin[1] + 30], 70, k);
      glow(v[0], v[1], 150, '#FFF0A0', .9);
      boilSeed('vjtrail'); for (let i = 1; i < 5; i++) { const q = arcPt(hand, [chin[0] + 20, chin[1] + 30], 70, clamp(k - i * .06)); paint(ellPts(q[0], q[1], 12 - i * 2, 12 - i * 2, 8), { wash: '#FFF6C8', washOp: 230 - i * 40, ink: null }); }
      push(); translate(v[0], v[1]); rotate(k * 9); boilSeed('vjf'); indraVajra(au * .9, 1.1); pop();
    }
    if (hit) { sparkleBurst(p1[0] + 30, p1[1] - 150, 300, t - HIT, 'hitburst', 14, ['#FFFFFF', '#FFF0A0']); if (t < HIT + .9) { boilSeed('hitbang'); emote('!!', ax - 190, ay - 620, 44, popk(t, HIT + .15, 6), t - HIT); } }
    camEnd();
    if (hit && t < HIT + .16) flash((1 - (t - HIT) / .16) * .95, '#FFFDF0');
    caps(t);
    wipeOut(lt, dur, ROCKW);
  }

  // ================= C · Vayu finds him; furious; into the cave =================
  const limp = (o = {}) => ({ pose: 'sit', boilKey: 'baby', seed: 3, eyes: 'closed', mouth: 'flat', jaw: 1, tail: 'droop', tailSway: 0, nod: .5, htilt: -.3, handL: [-3.1, -3.3], handR: [3.1, -3.3], ...o });
  function shotVayu(t, lt, dur) {
    const ang = t > ANGRY, cave = easeIn(seg(t, TOCAVE, V0 + 4.0));
    camBegin(lerp(520, 600, ease(seg(t, TOCAVE - .2, S0))), 1280, 1.04 + .02 * lt + kick(t, ANGRY));
    h2Peak(t, 0);
    const BX = 400, BY = 1722, bu = 31;
    const inK = easeOut(seg(t, VIN, VIN + .6)), held = t > ANGRY + .5;
    const vx = lerp(-260, 300, inK) + lerp(0, 500, cave), vy = lerp(620, 1500, inK) + lerp(0, 70, cave), vs = lerp(1, .42, cave);
    const tk = take(t, VIN + .6, .5);
    const vo = { pack: false, boilKey: 'vayu', seed: 12, speed: inK < 1 ? .8 : cave > 0 ? .8 : 0, tail: t * 1.6, lookX: .6, lookY: .8, sq: tk.sq,
      eyes: t < VIN + .6 ? 'wide' : !ang ? 'teary' : 'angry', mouth: t < VIN + .6 ? 'O' : !ang ? 'wobble' : cave > 0 ? 'frown' : 'shout', aL: held ? -.05 : -.5, aR: held ? .05 : -.4 + .3 * Math.sin(t * 9) * (ang ? 1 : 0),
      dy: -.2 * Math.sin(t * 2), dx: ang && !held ? .1 * Math.sin(t * 44) : 0 };
    if (ang && cave === 0) { vo.emote = 'anger'; vo.emoteK = popk(t, ANGRY + .05); vo.emoteAge = t - ANGRY; vo.tint = '#E0503A'; vo.tintK = .14 * clamp((t - ANGRY) * 3); }
    if (!held) balHanuman(BX, BY, bu, limp());
    if (cave < 1) {
      vayu(vx, vy, 40 * vs, vo);
      if (held) balHanuman(vx + 44 * vs, vy + 26 * vs, bu * .8 * vs, limp({ noShadow: true, htilt: -.35 }));
    }
    if (ang && t < ANGRY + .5) sparkleBurst(vx + 60, vy - 330, 200, t - ANGRY, 'angburst', 8, ['#FFFFFF', '#FF9A7A']);
    if (cave > 0) { boilSeed('gust'); for (let i = 0; i < 8; i++) { const y = 1300 + hash(i * 3) * 380, x = lerp(200, 820, cave) - hash(i * 5) * 260; inkLine([[x, y], [x - 220, y + 20 - 40 * hash(i)]], 2.6 * (1 - cave), '#FFFFFF', 'inkfine', .3); } }
    camEnd();
    caps(t);
    wipeIn(lt, ROCKW);
    wipeOut(lt, dur, GREYW);
  }

  // ================= D · the wind stops: nothing can breathe =================
  function shotStill(t, lt, dur) {
    const b = ease(seg(t, S0 + .4, S0 + 3.6)), tr = .05 * Math.sin(t * 46) * b;
    camBegin(540, 1330, 1.08 - .012 * lt);
    h2Grey(t);
    // a leaf and a bird, stuck in mid-air
    h2Leaf(230, 1090, 34, .5, 'stillleaf', mixCol(H2.leaf, '#B8BCC4', .4));
    h2Bird(800, 1160, 34, 0, 'stillbird', '#8E8478');
    boilSeed('birdsweat'); emote('sweat', 860, 1100, 26, popk(t, S0 + 1.2, 5), t - S0);
    // Surya, a hand at his throat
    surya(820, 1800, 19, { boilKey: 'surya', seed: 41, lotus: false, eyes: 'wide', mouth: 'flat', tint: '#6A8AD8', tintK: .15 + .5 * b, halo: 1, haloGlow: .25 * (1 - b), handL: [-1.2, -17.2], handR: [1.2, -17.2], bendL: 1, bendR: 1, dx: tr, noShadow: true });
    // Indra on Airavata, both holding their breath, turning blue
    airavata(360, 1810, 31, { boilKey: 'airav', trunk: 'limp', eyes: 'wide', puff: 1, tint: '#6A8AD8', tintK: .15 + .6 * b, earOut: 0, sweat: 1, dx: tr,
      indra: { boilKey: 'indra', eyes: 'wide', mouth: 'puff', puff: 1, tint: '#6A8AD8', tintK: .15 + .6 * b, vajra: 0, handL: [-1.4, -4.2], handR: [1.4, -4.2], sweat: 1 } });
    camEnd();
    caps(t);
    wipeIn(lt, GREYW);
    wipeOut(lt, dur, CAVEW);
  }

  // ================= F · Brahma comes to the cave, touches the child; he wakes; the wind blows again =================
  function shotCave(t, lt, dur) {
    const lit = ease(seg(t, BRAHMA, BRAHMA + .9)), woke = t >= WAKE, eyes = t >= EYES, wind = clamp((t - BREATH) * 2.5);
    const push_ = ease(seg(t, TOUCH - .6, WAKE));
    camBegin(lerp(540, 480, push_), lerp(1240, 1170, push_), lerp(1.0, 1.12, push_) + .008 * lt + kick(t, WAKE));
    h2CaveIn(t, lit, 780, 1050);
    // Brahma comes down on his lotus, upper right
    const BRX = 790, BRY = 1500, bru = 17, bk = popk(t, BRAHMA, 2.6);
    const bless = ease(seg(t, TOUCH - .7, TOUCH - .2)) * (1 - ease(seg(t, EYES, EYES + .5)));
    if (t > BRAHMA) {
      const bo = { boilKey: 'brahma', seed: 50, flip: true, bless, eyes: woke ? 'happy' : t > TOUCH - .7 ? 'normal' : 'closed', mouth: 'smile', lookX: .8, lookY: .5, lotusGlow: 1 };
      brahma(BRX, BRY - (1 - bk) * 500, bru * (.6 + .4 * bk), bo);
    }
    // Vayu, sulking with his son in his arms; then overjoyed
    const VX = 250, VY = 1500, vu = 40, joy = t - EYES;
    const lift = eyes ? ease(seg(t, EYES + .1, EYES + .7)) : 0;
    const vo = { pack: false, boilKey: 'vayu', seed: 12, speed: 0, tail: t * (1 + wind), aL: -.05 + lift * .9, aR: .05 + lift * .9, lookX: .7, lookY: lift > 0 ? -.7 : .6,
      eyes: eyes ? 'happy' : t > BRAHMA + .5 ? 'teary' : 'angry', mouth: eyes ? 'grin' : t > BRAHMA + .5 ? 'wobble' : 'frown', dy: -.2 * Math.sin(t * 2) + hop(joy, .5, 8, 1.4), blush: eyes ? .5 : 0 };
    vayu(VX, VY, vu, vo);
    const bx = VX + 46 + lift * 30, by = VY + 28 - lift * 110, bu = 25 + lift * 4;
    let o = limp({ noShadow: true, htilt: -.35 });
    if (woke && !eyes) o = { ...o, mouth: 'yawn', eyes: 'squeeze', nod: 0, htilt: .1, jaw: .7, handR: [2.4, -9.8], handShapeR: 'fist', tail: 'curl', tailSway: t * 1.4 };
    if (eyes) { const tk = take(t, EYES, .4); o = { pose: 'sit', boilKey: 'baby', seed: 3, noShadow: true, jaw: .6, plaster: true, eyes: t < EYES + .6 ? 'wide' : 'sparkle', mouth: t < EYES + .6 ? 'O' : 'grin', sq: tk.sq, blush: .6, tailSway: t * 1.6, glowK: .25,
      handL: [-3.5, -8.8], handR: [3.5, -8.8 + .4 * Math.sin(t * 9)], handShapeL: 'open', handShapeR: 'open', dy: hop(joy, .3, 9, 1.6) }; }
    balHanuman(bx, by, bu, o);
    // Brahma's touch: a spark from his hand to the child
    if (t > TOUCH - .2 && t < WAKE) {
      const from = [BRX - 4.4 * bru, BRY - 17 * bru * .5 - 60], to = bhHead(bx, by, bu, o), k = seg(t, TOUCH - .2, TOUCH + .25);
      if (k < 1) { const p = arcPt(from, to, 120, ease(k)); orb(p[0], p[1], 30, '#FFE9A0', t, 'touch'); }
      else sparkleBurst(to[0], to[1], 220, t - TOUCH - .25, 'touchburst', 12, ['#FFFFFF', '#FFE9A0']);
    }
    if (woke) sparkleBurst(bx, by - 8 * bu, 300, (t - WAKE) * .8, 'wakeburst', 12, ['#FFFFFF', GOLDC]);
    if (eyes) hearts(VX + 40, VY - 460, t, EYES + .5, 'vhearts');
    h2WindLines(t, wind * (1 - seg(t, G0 - .5, G0)), 760, 1700, 'cavewind');
    camEnd();
    if (lt < .1) flash(1 - lt / .1, '#FFF2C8');
    caps(t);
    wipeIn(lt, CAVEW);
  }

  // ================= G · Brahma: "give him your blessings" =================
  function shotBless(t, lt, dur) {
    camBegin(540, 1180, 1.06 + .012 * lt);
    h2Stage(t, '#FFD98A', 'sgG');
    const say = t > G0 + .2 && t < G0 + 3.4;
    brahma(600, 1420, 23, { boilKey: 'brahma', seed: 50, bless: .5 + .5 * Math.sin((t - G0) * 2.2) ** 2, eyes: blinkAt(t, G0 + 1.8) ? 'closed' : 'normal', mouth: say ? talk(t, 0, 99, 'smile', 'open') : 'smile', lookX: -.5, lookY: .6, hx: -.3 });
    const g = t - G0;
    balHanuman(190, 1440, 24, { pose: 'sit', boilKey: 'baby', seed: 3, jaw: .6, plaster: true, eyes: blinkAt(t, G0 + 2.6) ? 'closed' : 'wide', mouth: 'cat', lookX: 1, lookY: -.8, hx: .6, tailSway: t * 1.6, noShadow: true, dy: -.08 * Math.abs(Math.sin(g * 4)) });
    camEnd();
    slots(t);
    caps(t);
    wipeOut(lt, dur, GOLDW);
  }

  // ================= the eight boons =================
  const GX = 742, GY = 1392, BX = 285, BY = 1400, BU = 31;
  // each god: draw(b, t) and the point his light leaves from
  const GODS = [
    { from: [GX - 150, GY - 330], draw(b, t) {   // Indra, sheepish: no vajra in sight, his lotus garland lifted (36.10)
        const ok = b > LAND, io = { boilKey: 'indra', vajra: 0, eyes: ok ? 'happy' : 'sad', mouth: ok ? 'smile' : 'sheepish', bow: .7 * (1 - ease(seg(b, .7, 1.3))), lookX: -1, sweat: b < 1.2,
          handL: [-3.6, -5.6 - .3 * Math.sin(b * 5)], handR: [2.0, -1.0] };
        cloudPuff(GX, GY - 60, 250, 'godcloud0', 255, '#FFFFFF', '#E6DCF2');
        indra(GX, GY - 110, 46, io);
        const h = indraHand(GX, GY - 110, 46, io, -1); h2Garland(h[0], h[1] + 6, 62, t, 'indragarland');
      } },
    { from: [GX, GY - 420], draw(b, t) {   // Surya
        cloudPuff(GX, GY + 10, 220, 'godcloud1', 255, '#FFFFFF', '#F6DCC0');
        surya(GX, GY, 18.5, { boilKey: 'surya', seed: 41, eyes: b > LAND ? 'happy' : 'normal', mouth: 'smile', lookX: -.8, lookY: .6, hx: -.4, haloGlow: .7 + .3 * Math.sin(t * 4), lotusOpen: 1, noShadow: true, dy: hop(b - GIVE, .2, 8, 2) });
      } },
    { from: [GX - 105, GY - 370], draw(b, t) {   // Varuna, the noose in his hand
        cloudPuff(GX, GY + 10, 220, 'godcloud2', 255, '#FFFFFF', '#CFE4F6');
        varuna(GX, GY, 18.5, { boilKey: 'varuna', seed: 42, flip: true, eyes: b > LAND ? 'happy' : 'normal', mouth: 'smile', lookX: .8, lookY: .6, hx: .4, handR: [5.4, -19.6 + .3 * Math.sin(b * 5)], bendR: 1, noShadow: true, dy: hop(b - GIVE, .2, 8, 2) });
      } },
    { from: [GX - 105, GY - 370], draw(b, t) {   // Yama: stern, then he smiles
        const soft = b > 1.1;
        cloudPuff(GX, GY + 10, 220, 'godcloud3', 255, '#F2EEF6', '#C8C0D6');
        yama(GX, GY, 18.5, { boilKey: 'yama', seed: 43, pasha: false, eyes: soft ? 'happy' : 'normal', brow: soft ? .6 : -1, mouth: soft ? 'smile' : 'flat', glow: soft ? 0 : .7, lookX: -.8, lookY: .6, hx: -.4, handL: [-5.4, -19.6 + .3 * Math.sin(b * 5)], bendL: 1, noShadow: true, dy: hop(b - GIVE, .2, 8, 2) });
      } },
    { from: [GX - 105, GY - 370], draw(b, t) {   // Kubera, his mace and a purse
        cloudPuff(GX, GY + 10, 220, 'godcloud4', 255, '#FFFFFF', '#F2E2B0');
        kubera(GX, GY, 18.5, { boilKey: 'kubera', seed: 44, eyes: 'happy', mouth: 'smile', lookX: -.8, lookY: .6, hx: -.4, noShadow: true, dy: hop(b - GIVE, .2, 8, 2) });
      } },
    { from: [GX - 110, GY - 250], draw(b, t) {   // Shiva
        glowBehind(GX, GY - 230, 250, .5, '#D9C8FF');
        cloudPuff(GX, GY + 10, 240, 'godcloud5', 255, '#FFFFFF', '#DCD2F2');
        shiva(GX, GY, 21, { boilKey: 'shiva', seed: 20, flip: true, eyes: b > .8 ? 'happy' : 'closed', mouth: 'smile', ganga: 1, snakeEyes: b > LAND ? 'happy' : 'open', snakeUp: .5, handR: [5.2, -11.5], bendR: 1.2, mudra: true, noShadow: true, dy: hop(b - GIVE, .15, 8, 2) });
      } },
    { from: [GX - 90, GY - 330], draw(b, t) {   // Brahma
        brahma(GX, GY, 19, { boilKey: 'brahma', seed: 50, flip: true, bless: 1, eyes: 'happy', mouth: b > .3 && b < 2.4 ? talk(t, 0, 99, 'smile', 'open') : 'smile', lookX: .7, lookY: .5 });
      } },
    { from: [GX - 105, GY - 370], draw(b, t) {   // Vishvakarma, the gods' builder, with his hammer
        cloudPuff(GX, GY + 10, 220, 'godcloud7', 255, '#FFFFFF', '#DCE2EC');
        vishvakarma(GX, GY, 18.5, { boilKey: 'vishva', seed: 47, eyes: 'happy', mouth: 'smile', lookX: -.8, lookY: .6, hx: -.4, handL: [-5.4, -19.6 + .3 * Math.sin(b * 5)], bendL: 1, noShadow: true, dy: hop(b - GIVE, .2, 8, 2) });
      } },
  ];
  // the baby through the boons: he watches the god, then the light lands and he shows the power off
  const boonBaby = (i, b, t) => {
    const g = b - GAG, landed = b > LAND;
    const o = { pose: 'sit', boilKey: 'baby', seed: 3, noShadow: true, eyes: 'wide', mouth: 'cat', lookX: 1, lookY: -.7, hx: .6, tailSway: t * 1.6, jaw: i === 0 ? .6 : 0, plaster: i === 0, glowK: .12 + .05 * i };
    if (blinkAt(b, .6)) o.eyes = 'closed';
    if (landed) { const tk = take(b, LAND, .5); Object.assign(o, { eyes: 'sparkle', mouth: 'grin', sq: tk.sq, dy: tk.dy, blush: .6, hx: 0, lookX: 0, lookY: 0, glowK: o.glowK + .5 * Math.exp(-(b - LAND) * 2) }); }
    if (g > 0) {
      if (i === 0) Object.assign(o, { eyes: g < .5 ? 'squeeze' : 'happy', mouth: g < .5 ? 'O' : 'grin', dy: hop(g - .35, .3, 9, 2) });                       // the little bolt bounces off
      if (i === 1) Object.assign(o, { glowK: .9, eyes: 'sparkle', handL: [-2.2, -6.6], handR: [2.2, -6.6], handShapeL: 'hold', handShapeR: 'hold', lookY: .6 });   // a glow, and a book
      if (i === 2) Object.assign(o, { dy: -1.6 * Math.sin(clamp(g / 1.3) * Math.PI) + hop(g - 1.3, .2, 9, 2), eyes: 'happy', mouth: 'grin', handL: [-4.2, -9.6], handR: [4.2, -9.6], handShapeL: 'open', handShapeR: 'open' });   // he bobs on the wave
      if (i === 3) Object.assign(o, { eyes: 'happy', handL: [-3.6, -10.8], handR: [3.6, -10.8], handShapeL: 'fist', handShapeR: 'fist', bendL: -1, bendR: -1, blush: 1, dy: hop(g, .3, 8, 1.4) });   // strong and rosy
      if (i === 4) Object.assign(o, { eyes: g < .45 ? 'squeeze' : 'happy', mouth: g < .45 ? 'O' : 'grin', dy: hop(g - .3, .3, 9, 2), sq: g > .28 && g < .45 ? .12 : 0 });   // the mace bonks and bounces
      if (i === 5) Object.assign(o, { pray: 1, eyes: 'closed', mouth: 'smile', handL: [-.5, -7.6], handR: [.5, -7.6], handShapeL: 'open', handShapeR: 'open', nod: .25 });   // he bows to Shiva
      if (i === 6) Object.assign(o, { eyes: 'happy', mouth: 'grin', htilt: .12 * Math.sin(g * 4), handL: [-3.5, -9.2], handR: [3.5, -9.2 + .4 * Math.sin(t * 9)], handShapeL: 'open', handShapeR: 'open' });
      if (i === 7) Object.assign(o, { eyes: g < 1.1 ? 'closed' : 'happy', mouth: g < 1.1 ? 'smile' : 'grin', handL: [-3.6, -4.2], handR: [3.6, -4.2], dy: hop(g - 1.1, .3, 9, 2) });   // calm as the weapons buckle
    }
    return o;
  };
  // what each power does, drawn over him (in front) after the light lands
  const boonGag = (i, b, t, o) => {
    const g = b - GAG; if (g <= 0) return;
    const head = bhHead(BX, BY, BU, o), belly = bhBelly(BX, BY, BU, o);
    if (i === 0) {
      const k = clamp(g / .3), back = clamp((g - .3) / .6);
      const y = back > 0 ? head[1] - 190 - 420 * easeOut(back) : lerp(head[1] - 700, head[1] - 190, easeIn(k)), x = head[0] + (back > 0 ? 260 * easeOut(back) : 0);
      if (back < 1) { push(); translate(x, y); rotate(back * 5); h2Bolt(0, 0, 170, 'gagbolt'); pop(); glow(x, y, 120, '#FFF0A0', .6); }
      if (g > .3) sparkleBurst(head[0], head[1] - 150, 170, g - .3, 'boltbounce', 8, ['#FFFFFF', '#FFE27A']);
    }
    if (i === 1) { const k = popk(b, GAG + .5, 4); if (k > 0) h2Book(belly[0], belly[1] - 18, 62 * k, -.08, 'gagbook'); }
    if (i === 2) h2Wave(BX, BY + 40, 330, 250, clamp(g / 1.3), t, 'gagwave');
    if (i === 3) hearts(head[0], head[1] - 150, t, BN[3] + GAG + .1, 'yamahearts');
    if (i === 4) {
      const k = clamp(g / .3), back = clamp((g - .3) / .7), a = back > 0 ? -1.1 - 1.4 * easeOut(back) : lerp(-1.9, -1.1, easeIn(k));
      const px = head[0] + 250, py = head[1] + 60;
      if (back < 1) { push(); translate(px, py - back * 80); rotate(a); boilSeed('gagmace'); gada(26, 1.2, 0); pop(); }
      if (g > .3) sparkleBurst(head[0] + 60, head[1] - 130, 170, g - .3, 'macebounce', 8, ['#FFFFFF', '#FFE27A']);
    }
    if (i === 5) sparkleBurst(belly[0], belly[1] - 100, 300, g * .7, 'shivaburst', 10, ['#FFFFFF', '#D9C8FF']);
    if (i === 6) { for (let k = 0; k < 5; k++) { const a = g * 1.6 + k * TAU / 5, r = 215; boilSeed('petal' + k); push(); translate(belly[0] + Math.cos(a) * r, belly[1] - 60 + Math.sin(a) * r * .5); rotate(a * 2); paint([[-20, 0], [0, -10], [20, 0], [0, 10]], { wash: k % 2 ? '#F28AC8' : '#FFC8E0', washOp: 255 * clamp(g * 3), ink: HSK.ink, sw: .6, curv: .5 }); pop(); } }
    if (i === 7) {
      for (let k = 0; k < 3; k++) {
        const a = g - k * .28; if (a < 0 || a > 1.3) continue;
        const inK = clamp(a / .3), out = clamp((a - .3) / .9), tx = belly[0] + 150, ty = belly[1] - 150 + k * 110;
        const x = out > 0 ? tx + 260 * easeOut(out) : lerp(1150, tx, easeIn(inK)), y = ty + (out > 0 ? -120 * Math.sin(out * Math.PI) + 300 * out * out : 0);
        h2Blade(x, y, 78, Math.PI + (out > 0 ? out * 4 : 0), out > 0 ? 1 : 0, k, 'gagblade' + k);
        if (out > 0 && out < .5) sparkleBurst(tx - 30, ty, 110, out, 'bladebounce' + k, 6, ['#FFFFFF', '#DCE2EC']);
      }
    }
  };
  const boonShot = i => (t, lt, dur) => {
    const b = t - BN[i], col = BOON_COL[i], G = GODS[i];
    camBegin(540, 1140 - lt * 3, 1.0 + .01 * lt + kick(t, BN[i] + LAND));
    h2Stage(t, col, 'sgB');
    // the god arrives
    const gk = popk(t, BN[i] + .02, 3.2);
    push(); translate(GX, GY); scale(.55 + .45 * gk); translate(-GX, -GY + (1 - gk) * 140);
    G.draw(b, t);
    pop();
    poof(GX, GY - 250, 330, b / .6, 'godpoof' + i, ['#FFFFFF', mixCol('#FFFFFF', col, .5)]);
    const o = boonBaby(i, b, t);
    cloudPuff(BX, BY + 16, 190, 'babycloud', 255, '#FFFFFF', '#F0DCC8');
    balHanuman(BX, BY, BU, o);
    boonGag(i, b, t, o);
    // the boon: a light from the god to the child
    const to = bhBelly(BX, BY, BU, o);
    if (b > GIVE - .5 && b < LAND) {
      const k = seg(b, GIVE, LAND), p = arcPt(G.from, to, 200, ease(k)), s = 40 * backOut(clamp((b - GIVE + .5) * 3));
      orb(p[0], p[1] + 8 * Math.sin(t * 9), s, col, t, 'boonorb', true);
      if (k > 0) { boilSeed('boontrail'); for (let j = 1; j < 6; j++) { const q = arcPt(G.from, to, 200, ease(clamp(k - j * .04))); paint(ellPts(q[0], q[1], 11 - j * 1.5, 11 - j * 1.5, 8), { wash: mixCol('#FFFFFF', col, .5), washOp: 230 - j * 36, ink: null }); } }
    }
    if (b > LAND) sparkleBurst(to[0], to[1] - 40, 260, b - LAND, 'boonland', 12, ['#FFFFFF', col]);
    camEnd();
    if (lt < .1) flash((1 - lt / .1) * .7, mixCol('#FFFFFF', col, .4));
    slots(t);
    caps(t);
    if (i === 0) wipeIn(lt, GOLDW);
  };

  // ================= the name: Hanuman (36.11) =================
  function shotName(t, lt, dur) {
    const g = t - NAME0, k = ease(seg(t, NAME0, NAME0 + .5));
    camBegin(lerp(540, 430, k), lerp(1140, 1160, k), lerp(1.0, 1.32, k) + .01 * lt);
    h2Stage(t, BOON_COL[0], 'sgB');
    push(); cloudPuff(GX, GY - 60, 250, 'godcloud0', 255, '#FFFFFF', '#E6DCF2');
    indra(GX, GY - 110, 46, { boilKey: 'indra', vajra: 0, eyes: 'happy', mouth: g > .2 && g < 3 ? talk(t, 0, 99, 'smile', 'open') : 'smile', lookX: -1, handL: [-3.8, -4.4 + .3 * Math.sin(t * 6)], handR: [2.0, -1.0] });
    pop();
    cloudPuff(BX, BY + 16, 190, 'babycloud', 255, '#FFFFFF', '#F0DCC8');
    const touch = g > .8 && g < 2.0;
    const o = { pose: 'sit', boilKey: 'baby', seed: 3, noShadow: true, jaw: 1, plaster: true, tailSway: t * 1.6, glowK: .15,
      eyes: g < .8 ? 'wide' : touch ? ['squeeze', 'wide'] : 'happy', mouth: g < .8 ? 'cat' : touch ? 'pout' : 'grin', htilt: touch ? .12 : 0, blush: g > 2 ? .7 : 0,
      handR: touch ? [2.6, -10.4] : g > 2 ? [3.6, -10.6] : undefined, handShapeR: touch ? 'point' : 'fist', handL: g > 2 ? [-3.6, -10.6] : undefined, handShapeL: 'fist', bendL: -1, bendR: touch ? 1 : -1, dy: hop(g - 2, .3, 8, 1.4) };
    balHanuman(BX, BY, BU, o);
    const jw = bhJaw(BX, BY, BU, o);
    if (g > .9) { const a = popk(t, NAME0 + .9, 5); letter('HANU = JAW', jw[0] + 150, jw[1] + 96, 56, GOLDC, { stroke: HSK.ink, sw: .22, ink: false, rot: -.04, pop: (t - NAME0 - .9) * 5, maxW: 330 }); }
    if (g > 2) sparkleBurst(BX, BY - 300, 300, (g - 2) * .8, 'nameburst', 12, ['#FFFFFF', GOLDC]);
    camEnd();
    slots(t);
    caps(t);
  }

  // ================= all eight: "no one can defeat him" (36.23) =================
  function shotAll(t, lt, dur) {
    const g = t - ALL0;
    camBegin(540, 1180, 1.0 + .012 * lt + kick(t, ALL0));
    h2Stage(t, '#FFD24A', 'sgA');
    brahma(200, 1330, 13.5, { boilKey: 'brahma', seed: 50, bless: 1, eyes: 'happy', mouth: g > .5 && g < 3.2 ? talk(t, 0, 99, 'smile', 'open') : 'smile', lookX: .7, lookY: .4 });
    vayu(880, 1160, 20, { flip: true, pack: false, boilKey: 'vayu', seed: 12, eyes: 'happy', mouth: 'grin', lookX: .8, lookY: .7, speed: 0, tail: t * 1.4, aL: 1.0, aR: 1.0 + .3 * Math.sin(t * 12), dy: -.25 * Math.sin(t * 1.8) + hop(g, .4, 8, 1.4), blush: .5 });
    const X = 540, Y = 1420, u = 37;
    const o = { pose: 'stand', boilKey: 'baby', seed: 3, noShadow: true, eyes: blinkAt(t, ALL0 + 2.2) ? 'closed' : 'sparkle', mouth: 'grin', blush: .7, glowK: .8 + .2 * Math.sin(t * 5), tailSway: t * 2,
      handL: [-3.6, -10.8], handR: [3.6, -10.8 + .3 * Math.sin(t * 8)], handShapeL: 'fist', handShapeR: 'fist', bendL: -1, bendR: -1, dy: hop(g, .5, 7, .8) };
    const c = bhBelly(X, Y, u, o);
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + g * 1.6; glow(c[0] + Math.cos(a) * 250, c[1] - 60 + Math.sin(a) * 190, 110, BOON_COL[i], .6 * clamp(g * 2)); }
    cloudPuff(X, Y + 16, 210, 'babycloud', 255, '#FFFFFF', '#F0DCC8');
    balHanuman(X, Y, u, o);
    sparkleBurst(c[0], c[1] - 100, 480, g * .7, 'allburst', 16, ['#FFFFFF', GOLDC]);
    camEnd();
    if (lt < .12) flash((1 - lt / .12) * .8, '#FFF2C8');
    slots(t);
    caps(t);
    wipeOut(lt, dur, LEAFW);
  }

  // ================= K1 · he goes wild in the rishis' ashram (36.29–30) =================
  const RX = [800, 930], RY = 1800;
  function shotAshram(t, lt, dur) {
    const g = t - CRACK, sh = shake(t, CRACK, .35, 12);
    camBegin(540 + sh[0], 1480 + sh[1], 1.0 + .012 * lt);
    ashram(t, 'as2');
    // two rishis: one at his fire, one behind
    const gasp = g > .05;
    rishi(RX[1], RY - 20, 15.5, 1, { boilKey: 'rishi1', seed: 31, flip: true, eyes: gasp ? 'wide' : 'closed', mouth: gasp ? 'O' : 'smile', hx: .5, lookX: 1, pray: gasp ? 0 : 1, sweat: g > .8 });
    const tk = take(t, CRACK + .05, .6);
    rishi(RX[0], RY, 17, 0, { boilKey: 'rishi0', seed: 30, flip: true, eyes: gasp ? 'wide' : 'normal', mouth: gasp ? 'O' : 'smile', hx: .6, lookX: 1, sq: tk.sq, dy: tk.dy, handR: gasp ? [4.4, -22] : [3.6, -13], handL: gasp ? [-4.4, -22] : undefined, bendR: .6, bendL: .6,
      emote: gasp ? '!' : null, emoteK: popk(t, CRACK + .1, 6), emoteAge: g });
    // the pots
    const split = clamp(g * 5);
    h2Pot(560, 1830, 110, g > 0 ? split : 0, 'pot0'); h2Pot(660, 1850, 90, g > .25 ? clamp((g - .25) * 5) : 0, 'pot1');
    // the baby: bouncing in with the ladle, down on the pots, then away with a snapped ladle
    const inK = easeOut(seg(t, K0 + .2, CRACK)), outK = easeOut(seg(t, CRACK + .2, CRACK + 1.4));
    let bx = lerp(-120, 520, inK), by = 1800 - 330 * Math.sin(inK * Math.PI) * (inK < 1 ? 1 : 0);
    if (g > .2) { bx = lerp(520, 260, outK); by = 1800 - 260 * Math.sin(outK * Math.PI); }
    const o = { pose: g > 1.4 || t < K0 + .2 ? 'stand' : 'fly', boilKey: 'baby', seed: 3, eyes: g > 1.4 ? 'happy' : 'sparkle', mouth: 'grin', glowK: .5, tailSway: t * 3, kick: t * 3, rot: g > 1.4 ? 0 : inK < 1 ? .3 : -.3 * (1 - outK),
      handR: [3.4, -11.6], handShapeR: 'hold', handL: [-3.4, -11.2], handShapeL: 'hold', blush: .5, dy: g > 1.4 ? hop(g - 1.4, .35, 8, 1) : 0 };
    const py = o.pose === 'fly' ? by - 5.6 * 30 : by;
    balHanuman(bx, py, 30, o);
    const hr = bhHand(bx, py, 30, o, 1), hl = bhHand(bx, py, 30, o, -1);
    if (g < 0) h2Ladle(hr[0] - 20, hr[1] + 10, 190, -1.1, 1, 'ladleA');
    else { h2Ladle(hr[0] - 8, hr[1] + 8, 190, -1.2, .5, 'ladleB'); h2Ladle(hl[0] + 8, hl[1] + 8, 150, -1.9, .45, 'ladleC'); }
    if (g > 0) { sparkleBurst(600, 1760, 300, g, 'crackburst', 12, ['#FFFFFF', '#F2D060']); if (g < .9) { boilSeed('crackpieces'); for (let i = 0; i < 6; i++) { const a = -Math.PI * hash(i * 2.3), d = 420 * easeOut(g / .9); push(); translate(600 + Math.cos(a) * d, 1780 + Math.sin(a) * d + 600 * g * g); rotate(g * 9 + i); paint([[-16, -10], [14, -14], [18, 10], [-10, 14]], { wash: H2.clay, ink: H2.ink, sw: .8 }); pop(); } } }
    if (g > 1.5) hearts(bx, by - 540, t, CRACK + 1.6, 'wildhearts', 2);
    camEnd();
    slots(t);
    caps(t);
    wipeIn(lt, LEAFW);
  }

  // ================= K2 · the rishis' curse: he forgets his strength (36.34–36) =================
  function shotCurse(t, lt, dur) {
    const g = t - CURSE, dr = clamp((t - DRAIN) / 1.2);
    camBegin(540, 1480, 1.04 + .01 * lt);
    ashram(t, 'as2');
    boilSeed('cursedim'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#4A4E96', washOp: 70 * clamp((t - K2) * 2), ink: null });
    h2Pot(560, 1830, 110, 1, 'pot0'); h2Pot(660, 1850, 90, 1, 'pot1');
    const up = ease(seg(t, CURSE - .5, CURSE));
    for (let i = 0; i < 2; i++) rishi(RX[i] - 20, RY - i * 20, i ? 15.5 : 17, i, { boilKey: 'rishi' + i, seed: 30 + i, flip: true, eyes: 'normal', brow: -.6, mouth: g > 0 && g < 1.6 ? talk(t, 0, 99, 'flat', 'open') : 'flat', hx: .6, lookX: 1,
      handR: [lerp(3.6, 5.2, up), lerp(-13, -22.5, up) + .3 * Math.sin(t * 7 + i)], bendR: .5 });
    const BXc = 300, BYc = 1810, u = 31;
    const o = { pose: 'sit', boilKey: 'baby', seed: 3, eyes: 'wide', mouth: 'O', lookX: 1, lookY: -.4, hx: .5, glowK: .5 * (1 - dr), tailSway: t * 1.6 * (1 - dr), tail: dr > .6 ? 'droop' : 'curl',
      handL: [-3.0, -4.6], handR: [3.0, -4.6] };
    if (t < CURSE) { o.eyes = 'happy'; o.mouth = 'grin'; o.hx = 0; o.lookX = 0; }
    if (dr > .5) Object.assign(o, { eyes: dr > .95 ? 'normal' : 'closed', mouth: 'pout', hx: 0, lookX: 0, lookY: 0, htilt: .14, emote: dr > .95 ? '?' : null, emoteK: popk(t, DRAIN + 1.2, 6), emoteAge: t - DRAIN - 1.2 });
    balHanuman(BXc, BYc, u, o);
    // the curse: pale sparks from the rishis' hands settle on him; his glow rises out of him and fades
    if (g > 0 && g < 2.2) { boilSeed('cursesp'); for (let i = 0; i < 9; i++) { const a = frac(g * .6 + i / 9), p = arcPt([RX[0] - 110, RY - 400], [BXc, BYc - 300], 220, a); paint(starPts(p[0] + 20 * Math.sin(i * 3 + t * 4), p[1], 12 * Math.sin(a * Math.PI), .35, 4, t * 3 + i), { wash: '#E8E0FF', ink: null }); } }
    if (dr > 0 && dr < 1) { for (let i = 0; i < 8; i++) { const a = clamp(dr * 1.4 - i * .05); if (a <= 0 || a >= 1) continue; glow(BXc + (i - 3.5) * 46, BYc - 250 - a * 420, 70 * (1 - a), BOON_COL[i], .8 * (1 - a)); } }
    camEnd();
    slots(t);
    caps(t);
    wipeOut(lt, dur, PEACH);
  }

  // ================= the ask =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1010, 1.0 + .01 * lt);
    warmBack(t, 'wbA', 540, 1150);
    const g = t - ASK0, X = 540, Y = 1325, u = 34;
    const o = { pose: 'sit', boilKey: 'baby', seed: 3, eyes: blinkAt(t, ASK0 + 2.4) ? 'closed' : g > 1.2 ? 'happy' : 'normal', mouth: g > 1.2 ? 'grin' : 'cat', blush: .6, htilt: .1 * Math.sin(g * 1.6), tailSway: t * 1.5,
      lookY: g > .9 && g < 2.2 ? .9 : 0, handL: [-3.6, -6.4], handR: [3.6, -6.4 + .5 * Math.sin(g * 6)], handShapeL: 'open', handShapeR: 'open', bendL: 1, bendR: 1, dy: -.1 * Math.abs(Math.sin(g * 5)) };
    balHanuman(X, Y, u, o);
    camEnd();
    slots(t);
    caps(t);
    wipeIn(lt, PEACH);
  }
  // ================= next: he meets Ram in disguise =================
  function shotNext(t, lt, dur) {
    camBegin(540, 1010, 1.0 + .012 * lt);
    warmBack(t, 'wbJ', 540, 1150);
    const g = t - NEXT0, k = popk(t, NEXT0, 3);
    hanuman(540, 1640, 30 * (.7 + .3 * k), { boilKey: 'hanu', seed: 60, crown: false, gada: 0, eyes: g > 1.2 ? ['closed', 'normal'] : 'normal', mouth: 'smile', handR: [1.0, -18.6], bendR: 1, hx: .2 * Math.sin(g * 2), tailSway: t * 1.6, dy: hop(g, .3, 8, 1.6), blush: .4 });
    boilSeed('nextq'); emote('?', 840, 880 + 8 * Math.sin(t * 3), 46, popk(t, NEXT0 + .5, 6), g);
    camEnd();
    caps(t);
  }
  function shotCard(t, lt, dur) { hsCard(t, CARDC); }

  shots([[0, shotHook], [L0, shotLeap], [J0, shotVajra], [V0, shotVayu], [S0, shotStill], [F0, shotCave], [G0, shotBless],
    ...BN.map((b, i) => [b, boonShot(i)]), [NAME0, shotName], [ALL0, shotAll], [K0, shotAshram], [K2, shotCurse], [ASK0, shotAsk], [NEXT0, shotNext], [CARD, shotCard]]);
})();
