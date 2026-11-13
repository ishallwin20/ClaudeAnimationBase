// hanu4.js: "The night HANUMAN almost GAVE UP" (ad 89, Hanuman series Part 4, 90 s, Bangers captions, retro SFX, no
// voice). Valmiki Ramayana, Sundara Kanda 10–15 and Yuddha Kanda 1 (verse numbers as at valmikiramayan.net): in
// Ravana's palace he sees Ravana asleep and backs away as from a hissing snake (10.11–12); he sees a beautiful queen
// asleep on a couch apart, Mandodari (10.50–51), takes her for Sita (10.53), kisses his tail, sings, climbs the pillars
// and drops to the floor (10.54); then knows Sita would not sleep, eat or adorn herself away from Ram (11.1–3). He
// searches every house: no Sita (12.1–6); "not losing heart is the root of all good" (12.10–11); he searches again,
// not a finger's width left (12.14–19); still nothing (12.23–25). "If I go back and say she isn't found, Ram will not
// live; then Lakshman, Bharat, Shatrughna, the mothers, Sugriva, Ruma, Tara, Angada, the vanaras" (13.23–37); "I will
// not go back; I'll live here as a hermit, or give up my life" (13.38–43); "there are many evils in dying; one who
// lives sees good things" (13.47); the Ashoka garden, not yet searched (13.55); from a shimshapa tree he sees Sita below it (14.40–52, 15.18–30, 17.18). Back home
// Ram: "I can do him no fitting kindness" (Yuddha 1.12); "this embrace, all I have, I give him" (1.13), and holds him
// (1.14).
// STORYBOARD.md has the plan and the sources; sets are in hanu4_props.js; the series kit is src/hanuman_series.js.
// All times are video time (t); tools/hanu4_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/hanu4_sfx.mjs)
  const TEAR = 1.2, SIGH = 2.4;
  const B0 = 4.4, SNORT = 6.4, C0 = 8.8, SEEQ = 9.5, D0 = 13.2, KISS1 = 14.0, CLIMB = 14.8, TOP = 15.9, BUMP = 16.6;
  const E0 = 17.6, F0 = 22.0, FACE = 22.5, TIPTOE = 24.2;
  const G0 = 26.4, DOOR = .95, SLUMP = 29.4, H0 = 30.8, VERSE = 31.3, RISE = 33.6;
  const I0 = 35.8, WELL = 36.1, POT = 37.3, STILL = 38.6, J0 = 40.4, K0 = 45.0, FALL0 = 45.8, FSTEP = .24;
  const L0 = 49.8, M0 = 54.6, FLARE = 55.2, UP = 56.6, N0 = 59.4, GARDEN = 60.4, LEAP = 62.9;
  const O0 = 64.0, P0 = 68.6, Q0 = 73.4, HUG = 73.8, R0 = 78.4, S0 = 82.8, CARD = 86.2;
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
  const NIGHTW = [H4.night, H4.nightLo], HALLW = [H4.hall, H4.hallLo], LANEW = [H4.houseDk, H4.night], GROVEW = [H4.grove, H4.ashokaDk], HOMEW = [H4.homeHi, H4.grass], PEACH = [HSK.marigold, HSK.petal];

  // ---- the cast's fixed options
  const HN = { boilKey: 'hanu', seed: 60, crown: false, gada: 0 };
  const RM = { boilKey: 'ram', seed: 62 };
  const sita = (x, y, u, o) => parvati(x, y, u, { boilKey: 'sita', crown: false, pal: SITA_PAL, ...SITA_SKIN, ...o });
  const WY = 1640;   // the wall's top

  // ---- every caption: [text, y, t0, life, size, colour]
  const two = (a, b, t0, life, sa = 72, sb = 76, gold = 1) => [[a, 470, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 470 + (sa + sb) * .68, t0 + .35, life - .35, sb, gold === 1 ? GOLDC : undefined]];
  const CAPS = [
    ['THE NIGHT HANUMAN', 480, -1, B0 + .85, 96], ['ALMOST GAVE UP', 616, -1, B0 + .85, 128, GOLDC],
    ...two('IN LANKA, HANUMAN SEARCHED', 'RAVANA\'S PALACE FOR SITA.', B0, 4.3, 68, 66, -1),
    ...two('THEN HE SAW A QUEEN ASLEEP…', '"SITA! I FOUND HER!"', C0, 4.3, 70, 92),
    ...two('HE KISSED HIS OWN TAIL, SANG,', 'AND CLIMBED THE PILLARS!', D0, 4.3, 66, 74, -1),
    ...two('"WAIT. SITA WOULD NOT SLEEP, EAT', 'OR WEAR JEWELS WITHOUT RAM."', E0, 4.3, 60, 64, -1),
    ...two('IT WASN\'T SITA AT ALL.', 'IT WAS MANDODARI, RAVANA\'S QUEEN!', F0, 4.3, 74, 58),
    ...two('HE SEARCHED EVERY HALL AND HOUSE.', 'NO SITA.', G0, 4.3, 58, 112),
    ['HE TOLD HIMSELF:', 462, H0 + .1, 4.9, 60], ['"NOT LOSING HEART', 548, H0 + .4, 4.6, 84, GOLDC], ['IS THE ROOT OF ALL GOOD."', 650, H0 + .6, 4.4, 72, GOLDC],
    ...two('SO HE SEARCHED AGAIN, EVERY INCH.', 'STILL NO SITA.', I0, 4.5, 60, 104),
    ...two('"IF I GO HOME AND SAY NOT FOUND,', 'RAM WILL NOT SURVIVE IT."', J0, 4.5, 58, 74),
    ...two('"THEN LAKSHMAN. BHARAT. THE MOTHERS.', 'SUGRIVA. EVERY VANARA…"', K0, 4.7, 54, 74, -1),
    ...two('"I WILL NEVER GO BACK.', 'I\'LL STAY HERE… OR GIVE UP MY LIFE."', L0, 4.7, 80, 56, -1),
    ...two('"NO. ONE WHO STAYS ALIVE', 'SEES GOOD THINGS."', M0, 4.7, 74, 96),
    ...two('ONE PLACE WAS LEFT:', 'A GARDEN HE HAD NOT SEARCHED.', N0, 4.5, 80, 62),
    ...two('AND THERE, UNDER A TREE…', 'SITA.', O0, 4.5, 74, 140),
    ...two('BACK HOME, RAM SAID:', '"I HAVE NOTHING WORTHY TO GIVE HIM…"', P0, 4.7, 70, 54, -1),
    ...two('"SO LET THIS HUG BE HIS.', 'IT IS ALL I HAVE."', Q0, 4.9, 74, 104),
    ...two('WHAT KEPT YOU FROM GIVING UP?', 'COMMENT IT IN ONE WORD.', R0, 4.3, 64, 70),
    ['NEXT: HANUMAN OFFERED', 466, S0 + .1, 3.3, 66], ['TO CARRY SITA HOME.', 552, S0 + .25, 3.15, 66], ['SHE SAID NO.', 666, S0 + .5, 2.9, 112, GOLDC],
  ];
  // the series marks: the part pill and the source line show in the opening only, then fade out (owner, 11 Nov)
  const MARKS = C0 - .2;
  const caps = t => {
    for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color });
    if (t < MARKS && t > B0) { hsPill(4, (1 - seg(t, MARKS - .3, MARKS)) * clamp((t - B0) * 4)); hsSource('VALMIKI RAMAYAN · SUNDARA KANDA', t - B0 - .3, MARKS - B0 - .3); }
  };
  // the little lamp of hope beside him on the wall
  const lamp = (x, y, s, lit, key) => {
    diya(x, y, s, Math.min(lit, 1), key);
    if (lit <= 1) return;
    const e = lit - 1, fx = x + s * .95, fy = y - s * .8, h = s * (1.2 + 2.4 * e) * (1 + .06 * Math.sin(T * 17)), w = s * (.42 + .3 * e);
    glow(fx, fy - h * .4, s * (3 + 9 * e), '#FFD27A', .6);
    boilSeed('flare ' + key);
    paint([[fx - w, fy], [fx - w * .7, fy - h * .5], [fx + Math.sin(T * 11) * w * .3, fy - h], [fx + w * .7, fy - h * .5], [fx + w, fy], [fx, fy + w * .4]], { wash: HSK.flame, ink: null, curv: .6 });
    paint(ellPts(fx, fy - h * .3, w * .45, h * .3, 10), { wash: HSK.flameIn, ink: null });
  };

  // ================= A · the hook: alone on Lanka's wall, a rain cloud over him =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1150 - lt * 4, 1.0 + .012 * lt);
    h4Wall(t, 'wA');
    const sigh = Math.sin(clamp((t - SIGH) / 1.2) * Math.PI);
    const o = { ...HN, sit: 1, bow: .45 + .1 * sigh, eyes: t > SIGH + .3 && t < SIGH + 1 ? 'closed' : 'sad', mouth: 'frown', lookY: 1, lookX: -.2, tail: 'droop', tailSway: t * .5, gloom: .5, handL: [-3.0, -10.8], handR: [3.0, -10.8], dy: -.12 * sigh };
    hanuman(540, WY, 30, o);
    const hd = naradaHead(540, WY, 30, { sit: 1, ...o });
    if (t > TEAR) tears(hd[0] - 34, hd[1] + 14, (t - TEAR) * .7, 'hkTear', 1.2);
    boilSeed('hkcloud'); emote('cloud', 560, 990, 46, 1, t + 3);
    lamp(790, WY, 34, .55 + .1 * Math.sin(t * 7), 'hk');
    camEnd();
    caps(t);
    wipeOut(lt, dur, HALLW);
  }

  // ================= B · Ravana's palace: Ravana asleep; tiny Hanuman tiptoes in, backs off (10.11–12) =================
  const ravanaAsleep = (t, x, y, u, snort = -9) => {
    h4Bed(x, y + 20, u * 36, 'rbed');
    const g = t - snort, sn = g > 0 && g < .7;
    const heads = {}; for (let i = 0; i < 10; i++) heads[i] = { bubble: .45 + .45 * Math.sin(t * 1.6 + i * 1.3), mouth: i % 3 ? 'flat' : 'O' };
    if (sn) heads[0] = { bubble: 0, eyes: 'wide', mouth: 'open' };
    ravana(x, y, u, { boilKey: 'rv', sit: true, noShadow: true, all: { eyes: 'closed', mouth: 'flat', sweat: 0 }, heads, dy: .15 * Math.sin(t * 1.6), sq: sn ? .05 * Math.sin(g * 30) * (1 - g / .7) : 0,
      handL: [-4.6, -5.2], handR: [4.6, -5.2],
      between: () => { boilSeed('rvquilt'); paint(rrPts(x - u * 7.4, y - u * 5.6, u * 14.8, u * 5.6, u * 2), { wash: '#6A3A8A', fill: '#4A2A6A', fillOp: 50, tex: .4, ink: H4.ink, sw: 1 }); inkLine([[x - u * 6.8, y - u * 4.2], [x + u * 6.8, y - u * 4.2]], 1.6, H4.pillar, 'ink', .2); } });
    boilSeed('rvzzz'); emote('zzz', x + u * 3, y - u * 27, 30, 1, t);
  };
  function shotRavana(t, lt, dur) {
    camBegin(540, 1210 - lt * 4, 1.0 + .008 * lt + kick(t, SNORT));
    h4Palace(t, 'pB');
    ravanaAsleep(t, 610, 1640, 20, SNORT);
    // Hanuman, cat-sized, on tiptoe; the snort sends him scuttling back
    const g = t - SNORT, back = g > 0;
    const x = back ? lerp(lerp(30, 190, seg(SNORT, B0, SNORT)), 50, easeOut(seg(t, SNORT + .1, SNORT + .8))) : lerp(30, 190, seg(t, B0, SNORT));
    const tk = take(t, SNORT + .05, .7);
    hanuman(x, 1660, 12.5, { ...HN, boilKey: 'hb', walk: back ? (g < .8 ? t * 4 : undefined) : t * 1.4, dy: back ? tk.dy + hop(g, .4, 10, 3) : -.25 * Math.abs(Math.sin(t * 7)), sq: tk.sq,
      eyes: back ? 'wide' : 'look', lookX: .9, hx: .4, mouth: back ? 'scream' : 'flat', handL: back ? [-4.4, -20] : [-1.2, -18.8], handR: back ? [4.4, -20] : [2.2, -14], bendL: .5, bendR: .5, lean: back ? -1 : 0,
      tailSway: t * (back ? 9 : 2), sweat: back, emote: back ? '!' : null, emoteK: popk(t, SNORT + .05, 6), emoteAge: g });
    camEnd();
    caps(t);
    wipeIn(lt, HALLW);
  }

  // ================= C · a queen asleep, apart: "Sita! I found her!" (10.50–53) =================
  const QX = 640, QY = 1594, QU = 16, HU4 = 12.5;
  function shotQueen(t, lt, dur) {
    const g = t - SEEQ, seen = g > 0, love = t > C0 + 2.1;
    camBegin(470, 1268, 1.2 + .01 * lt);
    h4Palace(t, 'pC');
    h4Queen(QX, QY, QU, { key: 'cq', emote: 'zzz', emoteK: 1, emoteAge: t });
    const peek = ease(seg(t, C0 + .2, SEEQ)), x = lerp(120, 220, peek), tk = take(t, SEEQ, .6);
    hanuman(x, 1660, HU4, { ...HN, boilKey: 'hc', lean: seen ? 0 : 1.2, lookX: .9, hx: .45, sq: tk.sq, dy: tk.dy + (love ? hop(t - C0 - 2.1, .3, 9, 1.2) : 0),
      eyes: love ? 'heart' : seen ? 'shine' : 'look', mouth: love ? 'grin' : seen ? 'O' : 'flat', blush: love ? .8 : 0,
      handL: love ? [-1.8, -19.6] : seen ? [-2.2, -19] : undefined, handR: love ? [1.8, -19.6] : seen ? [2.2, -19] : undefined, bendL: 1, bendR: 1, tailSway: t * (love ? 6 : 2),
      emote: seen && !love ? '!!' : null, emoteK: popk(t, SEEQ + .05, 6), emoteAge: g });
    if (love) hearts(x + 40, 1280, t, C0 + 2.2, 'cqhearts');
    camEnd();
    caps(t);
  }

  // ================= D · he kisses his tail, sings, climbs the pillars, drops to the floor (10.54) =================
  function shotJoy(t, lt, dur) {
    const g = t - D0, kiss = t < KISS1, sing = t >= KISS1 && t < CLIMB, climb = t >= CLIMB && t < TOP, top = t >= TOP && t < BUMP, down = t >= BUMP;
    camBegin(470, 1268, 1.2 + kick(t, BUMP));
    h4Palace(t, 'pC');
    h4Queen(QX, QY, QU, { key: 'cq', emote: 'zzz', emoteK: 1, emoteAge: t });
    const PX = 130, u = HU4;
    let x = 220, dy = 0, o = { ...HN, boilKey: 'hd', lookX: .5, hx: .3, tailSway: t * 4 };
    if (kiss) {
      o = { ...o, tail: false, eyes: 'closed', mouth: 'o', hx: .9, blush: .9, emote: 'heart', emoteK: popk(t, D0 + .2, 6), emoteAge: g, handL: [2.2, -16.4], handR: [4.2, -15.4], bendL: 1, bendR: 1 };
    } else if (sing) {
      const d = Math.sin((t - KISS1) * 11);
      x = 220 - 20 * seg(t, KISS1, CLIMB); o = { ...o, eyes: 'happy', mouth: 'open', rot: .1 * d, dy: -.5 * Math.abs(d), handL: [-6, -21 + 2 * d], handR: [6, -21 - 2 * d], bendL: .4, bendR: .4, emote: 'music', emoteK: 1, emoteAge: t - KISS1 };
    } else if (climb || top) {
      const k = climb ? easeOut(seg(t, CLIMB, TOP)) : 1, sh = Math.sin(t * 16);
      x = lerp(200, PX + 6 * u * .9, ease(seg(t, CLIMB, CLIMB + .3)));
      dy = -k * 30 + (climb ? .5 * Math.abs(sh) : 0);
      o = { ...o, hx: -.5, lookX: top ? .9 : -.6, lookY: top ? .5 : -.8, eyes: top ? 'happy' : 'determined', mouth: top ? 'grin' : 'flat', handL: [-6.2, -22 + (climb ? 1.4 * sh : 0)], handR: [-5.6, -15 - (climb ? 1.4 * sh : 0)], bendL: -.3, bendR: -.3, tailSway: t * 7, dy,
        emote: top ? 'music' : null, emoteK: 1, emoteAge: t - TOP };
      if (top) { const fall = easeIn(seg(t, TOP + .3, BUMP)); o.dy = -30 * (1 - fall); o.rot = fall * 2.6; o.eyes = fall > .1 ? 'wide' : 'happy'; o.mouth = fall > .1 ? 'scream' : 'grin'; o.handL = [-5.6, -21]; o.handR = [5.6, -21]; }
    } else if (down) {
      const tk = take(t, BUMP, .7);
      x = PX + 6 * u * .9; o = { ...o, sit: 1, sq: tk.sq, dy: tk.dy, eyes: 'swirl', mouth: 'wobble', hx: 0, emote: 'stars', emoteK: popk(t, BUMP + .05, 6), emoteAge: t - BUMP, handL: [-2.4, -18.6], handR: [3.4, -14.4], bendL: 1 };
    }
    hanuman(x, 1660, u, o);
    // the kiss: he brings his tail round to his lips (rp9)
    if (kiss) { const [mx, my] = naradaMouth(x, 1660, u, { hx: .9 }); boilSeed('hkt'); paint(ribbon([[x + u, 1660 - 7.4 * u], [x + 6 * u, 1660 - 10 * u], [x + 5 * u, my - u], [mx + 1.2 * u, my]], u * .7, u * .45), { wash: HNM.fur, ink: HNM.ink, sw: .7 }); }
    if (sing || top) notes(x + 50, 1660 + (dy - 20) * u, t, 'dnotes', GOLDC, 3);
    if (down) poof(x, 1650, 120, (t - BUMP) / .5, 'bumpdust', ['#6A3A5A', '#8A4A6A']);
    camEnd();
    caps(t);
  }

  // ================= E · "wait: Sita would not sleep, eat or wear jewels without Ram" (11.1–3) =================
  function shotWait(t, lt, dur) {
    const g = t - E0;
    camBegin(470, 1268, 1.2 + .008 * lt);
    h4Palace(t, 'pC');
    h4Queen(QX, QY, QU, { key: 'cq', emote: 'zzz', emoteK: 1, emoteAge: t });
    const think = g > .5;
    hanuman(200, 1660, HU4, { ...HN, boilKey: 'he', eyes: think ? (g > 3 ? 'look' : 'closed') : 'look', lookX: g > 3 ? .9 : .3, lookY: -.4, mouth: think ? 'flat' : 'sheepish', hx: g > 3 ? .5 : .1,
      handR: [1.4, -17.8], bendR: 1, handL: [-3.4, -13.2], tailSway: t * 1.4, emote: think && g < 3 ? 'dots' : g >= 3 ? '?' : null, emoteK: popk(t, g >= 3 ? E0 + 3 : E0 + .5, 6), emoteAge: g });
    // what Sita is like without Ram: no sleep, no jewels, only tears
    const bk = popk(t, E0 + .8, 5);
    h4Bubble(370, 1150, 100, 108, 250, 1300, bk, 'bbE');
    if (bk > .9) { sita(370, 1240, 5.6, { boilKey: 'sitaE', noShadow: true, eyes: 'teary', mouth: 'frown', pray: 1, lookY: .5 }); }
    camEnd();
    caps(t);
  }

  // ================= F · it wasn't Sita: it was Mandodari, Ravana's queen (10.51; 11.3) =================
  function shotOops(t, lt, dur) {
    const g = t - FACE, go = t > TIPTOE;
    camBegin(470, 1268, 1.2 + .006 * lt);
    h4Palace(t, 'pC');
    h4Queen(QX, QY, QU, { key: 'cq', emote: 'zzz', emoteK: 1, emoteAge: t, mouth: 'smile' });
    if (t > F0 + .6) { boilSeed('mandoSpark'); paint(starPts(QX - 190, QY - 150, 22 * popk(t, F0 + .6, 5) * (1 + .15 * Math.sin(t * 9)), .3, 4), { wash: GOLDC, ink: null }); }
    const x = go ? lerp(200, -20, ease(seg(t, TIPTOE, TIPTOE + 1.8))) : 200;
    hanuman(x, 1660, HU4, { ...HN, boilKey: 'hf', eyes: g > 0 && !go ? 'squeeze' : 'look', lookX: go ? .9 : .3, mouth: 'sheepish', blush: 1, sweat: true, hx: go ? .5 : 0,
      handR: g > 0 && !go ? [.6, -20.4] : [1.4, -17.8], bendR: 1, handL: go ? [-1.6, -18.6] : [-3.4, -13.2], walk: go ? t * 1.2 : undefined, dy: go ? -.3 * Math.abs(Math.sin(t * 6)) : 0, lean: go ? -.6 : 0, tailSway: t * 1.4,
      emote: g > 0 ? 'sweat' : null, emoteK: popk(t, FACE + .1, 6), emoteAge: g });
    camEnd();
    caps(t);
    wipeOut(lt, dur, LANEW);
  }

  // ================= G · every hall and house: no Sita (12.1–6) =================
  function shotDoors(t, lt, dur) {
    camBegin(540, 1250, 1.0 + .006 * lt);
    const open = [0, 1, 2].map(i => { const t0 = G0 + .35 + i * DOOR; return clamp((t - t0) / .15) * (1 - clamp((t - t0 - .75) / .15)); });
    h4Lane(t, open, 'lG');
    for (let i = 0; i < 3; i++) {
      const t0 = G0 + .35 + i * DOOR, a = t - t0, x = 200 + i * 340;
      if (a > .1 && a < .8) hanuman(x, 1700, 8.6, { ...HN, boilKey: 'hg' + i, noShadow: true, eyes: 'look', lookX: Math.sin(a * 14), hx: Math.sin(a * 14) * .5, mouth: 'flat', handL: [-4.6, -16 + Math.sin(a * 20)], bendL: .5, dy: hop(a - .1, .2, 12, 3) });
      h4Cross(x, 1380, 110, clamp((a - .55) * 5), 'xg' + i);
    }
    if (t > SLUMP) {
      const tk = take(t, SLUMP, .6);
      hanuman(540, 1830, 13, { ...HN, boilKey: 'hgs', sq: tk.sq, dy: tk.dy, eyes: 'sad', mouth: 'frown', bow: .3, tail: 'droop', handL: [-3.2, -10], handR: [3.2, -10], gloom: .4, emote: 'sweat', emoteK: popk(t, SLUMP + .2, 6), emoteAge: t - SLUMP });
    }
    camEnd();
    caps(t);
    wipeIn(lt, LANEW);
  }

  // ================= H · "not losing heart is the root of all good" (12.10–11) =================
  function shotHeart(t, lt, dur) {
    const g = t - H0, up = t >= RISE, look = g > .6;
    camBegin(540, 1300, 1.1 + .006 * lt + kick(t, RISE));
    h4Lane(t, [0, 0, 0], 'lG');
    const tk = take(t, RISE, .7);
    const o = up ? { ...HN, boilKey: 'hh', sq: tk.sq, dy: tk.dy + hop(t - RISE, .3, 8, 1.4), eyes: 'determined', mouth: 'grin', puff: .6, handL: [-4.4, -21.6], handR: [3.4, -12.6], bendL: -1, bendR: 1, tailSway: t * 3 }
      : { ...HN, boilKey: 'hh', sit: 1, bow: look ? .1 : .5, eyes: look ? (g > 1.6 ? 'shine' : 'sad') : 'closed', mouth: look ? 'flat' : 'frown', lookY: look ? -.6 : .8, gloom: .4 * (1 - seg(t, H0 + .6, H0 + 2)), tail: 'droop', handL: [-3, -10.6], handR: [3, -10.6] };
    hanuman(540, 1700, 19, o);
    if (up) sparkleBurst(540, 1340, 300, (t - RISE) * .8, 'hhburst', 10, ['#FFFFFF', GOLDC]);
    camEnd();
    // the verse, in gold, as he says it to himself (Sundara 12.10)
    const va = 1 - seg(t, RISE - .3, RISE);
    if (va > 0) rkVerse(['अनिर्वेदः श्रियो मूलम्'], 470, 800, 66, t - VERSE, { alpha: va, color: GOLDC });
    caps(t);
  }

  // ================= I · he searches again: a well, a pot… still no Sita (12.14–25) =================
  function shotAgain(t, lt, dur) {
    camBegin(540, 1360, 1.0 + .006 * lt);
    h4Lane(t, [0, 0, 0], 'lG');
    // the well: legs kicking over the rim
    const w = t - WELL, inWell = w > 0 && w < 1.0;
    h4Well(540, 1760, 250, 0, 'wellI');
    if (inWell) { hanuman(540 + 6 * Math.sin(w * 13), 1650 - 30 * hop(w, 1, 6, 4), 12, { ...HN, boilKey: 'hiw', noShadow: true, rot: Math.PI, tailSway: t * 9, walk: t * 5 }); }
    h4Well(540, 1760, 250, 1, 'wellI', 1.0);
    if (inWell) poof(540, 1745, 140, (w - .05) / .5, 'wellsplash', ['#9ED0F0', '#FFFFFF']);
    h4Cross(540, 1580, 110, clamp((w - .9) * 5) * (1 - seg(t, POT + .9, POT + 1.1)), 'xwell');
    // the pot: the lid pops; his head pops out
    const p = t - POT, lid = clamp(p / .5);
    if (p > 0 && p < 1.2) hanuman(860, 2010 - 124 * easeOut(clamp(p * 4)), 10, { ...HN, boilKey: 'hip', noShadow: true, eyes: 'look', lookX: Math.sin(p * 12), hx: Math.sin(p * 12) * .4, mouth: 'O', tail: false });
    h4Pot(860, 1990, 300, lid * (p < 1.2 ? 1 : 0), 'potI', p < 1.2 ? false : true);
    h4Cross(860, 1600, 110, clamp((p - .8) * 5), 'xpot');
    if (t > STILL) {
      const tk = take(t, STILL, .6);
      hanuman(240, 1900, 14, { ...HN, boilKey: 'his', sq: tk.sq, dy: tk.dy, eyes: 'sad', mouth: 'frown', bow: .35, tail: 'droop', gloom: .6, handL: [-3.2, -10], handR: [3.2, -10], emote: 'cloud', emoteK: popk(t, STILL + .3, 5), emoteAge: t - STILL });
    }
    camEnd();
    caps(t);
    wipeOut(lt, dur, NIGHTW);
  }

  // ================= J · "if I go home and say 'not found', Ram will not survive it" (13.23–24) =================
  function shotRamGrief(t, lt, dur) {
    const g = t - J0;
    camBegin(540, 1080 - lt * 3, 1.0 + .01 * lt);
    h4Wall(t, 'wA');
    hanuman(320, WY, 24, { ...HN, sit: 1, bow: .2, eyes: g > 2.2 ? 'teary' : 'sad', mouth: 'wobble', lookX: .8, lookY: -.3, hx: .4, tail: 'droop', gloom: .4, handL: [-3, -10.6], handR: [3, -10.6] });
    const bk = popk(t, J0 + .6, 5);
    h4Bubble(730, 1170, 170, 160, 520, 1330, bk, 'bbJ');
    if (bk > .9) {
      const sink = ease(seg(t, J0 + 2.4, J0 + 3.4));
      vanRam(730, 1320, 7.6, { ...RM, boilKey: 'ramJ', noShadow: true, eyes: sink > .5 ? 'closed' : 'teary', mouth: 'frown', bow: .45 * sink, lookY: .6, handR: [.8, -15.2], bendR: 1, handL: [-3.4, -11 + sink * 2], dy: sink * 1.2 });
      if (sink > .1) tears(722, 1150, t - J0 - 2.4, 'ramJt', .7);
    }
    lamp(560, WY, 22, .45 + .1 * Math.sin(t * 7), 'hk');
    camEnd();
    caps(t);
  }

  // ================= K · one grief after another: the dominoes (13.25–37) =================
  const TILES = [
    { skin: VSN.skin, band: '#1E1B2E', mark: '#E2452B' }, { skin: '#F2C49A', band: '#1E1B2E', mark: '#E2452B' }, { skin: '#5E88C4', band: '#1E1B2E', mark: '#E2452B' }, { skin: '#F0C098', band: '#1E1B2E' },
    { skin: '#F2BE98', band: '#D8D2CC', mark: '#D2283A' }, { skin: '#EDB48A', band: '#D8D2CC', mark: '#D2283A' }, { skin: '#F6C8A4', band: '#D8D2CC', mark: '#D2283A' },
    { skin: '#C8904E', band: '#F2C230' }, { skin: '#D9A06A', band: '#2A2030', mark: '#D2283A' }, { skin: '#D2985E', band: '#2A2030', mark: '#D2283A' }, { skin: '#C8904E', band: '#F2C230' }, { skin: '#B8803E', band: '#8A5A2A' },
  ];
  function shotDominoes(t, lt, dur) {
    camBegin(540, 1080, 1.0 + .008 * lt);
    h4Wall(t, 'wA');
    const g = t - K0;
    hanuman(540, WY, 17, { ...HN, boilKey: 'hk2', sit: 1, eyes: 'teary', mouth: 'wobble', lookY: -.8, tail: 'droop', handL: [-1.6, -19], handR: [1.6, -19], bendL: 1, bendR: 1, sweat: true, gloom: .3 });
    const bk = popk(t, K0 + .2, 5);
    h4Bubble(500, 1170, 440, 200, 540, 1380, bk, 'bbK', '#F4EEE6');
    if (bk > .9) {
      const n = TILES.length, step = 64, w = 50, h = 118, x0 = 150, y0 = 1250;
      for (let i = n - 1; i >= 0; i--) {
        const a = t - FALL0 - i * FSTEP, k = easeIn(clamp(a / .3)), rest = i === n - 1 ? 1.5 : 1.0;
        h4Tile(x0 + i * step, y0, w, h, k * rest, TILES[i], 'tile' + i, 1, k > .6 ? 1 : 0);
      }
    }
    lamp(780, WY, 22, .35 + .1 * Math.sin(t * 7), 'hk');
    camEnd();
    caps(t);
  }

  // ================= L · "I will never go back; I'll stay here… or give up my life" (13.38–43) =================
  function shotLow(t, lt, dur) {
    const g = t - L0, low = 1 - .72 * ease(seg(t, L0 + .6, L0 + 3.4));
    camBegin(560, 1230 - lt * 4, 1.22 + .012 * lt);
    h4Wall(t, 'wA');
    hanuman(540, WY, 26, { ...HN, sit: 1, bow: .65, eyes: 'closed', mouth: 'frown', lookY: 1, tail: 'droop', tailSway: t * .4, gloom: .8, handL: [-1.4, -11.4], handR: [1.4, -11.4], bendL: 1, bendR: 1, dy: -.1 * Math.sin(t * 1.6) });
    boilSeed('lcloud'); emote('cloud', 560, 1040, 46, popk(t, L0 + .4, 4), g);
    lamp(770, WY, 42, low * (.95 + .08 * Math.sin(t * 9)), 'hk');
    camEnd();
    caps(t);
  }

  // ================= M · "No. One who stays alive sees good things." (13.47): the lamp flares =================
  function shotLive(t, lt, dur) {
    const g = t - M0, f = ease(seg(t, FLARE, FLARE + .8)), up = t >= UP;
    camBegin(560, lerp(1230, 1170, ease(seg(t, M0, UP))), 1.22 + kick(t, FLARE) + kick(t, UP) - .1 * ease(seg(t, UP, UP + 1.2)));
    h4Wall(t, 'wA');
    if (f > 0) glow(800, WY - 60, 700 * f, '#FFD27A', .35 * f);
    const tk = take(t, UP, .7);
    const o = up ? { ...HN, sq: tk.sq, dy: tk.dy + hop(t - UP, .3, 8, 1.4), eyes: 'determined', mouth: 'grin', puff: .5, handL: [-4.6, -13], handR: [4.6, -13], bendL: -1, bendR: -1, tailSway: t * 3 }
      : { ...HN, sit: 1, bow: .65 * (1 - f), eyes: f > .2 ? 'shine' : 'closed', mouth: f > .5 ? 'smile' : 'frown', lookX: .5 * f, lookY: f > .2 ? .2 : 1, tail: f > .5 ? 'curl' : 'droop', gloom: .8 * (1 - f), handL: [-1.4, -11.4], handR: [1.4, -11.4], bendL: 1, bendR: 1 };
    hanuman(540, WY, 26, o);
    boilSeed('lcloud'); emote('cloud', 560, 1040, 46, 1 - seg(t, FLARE, FLARE + .3), g + 5);
    if (f > 0) sparkleBurst(810, WY - 90, 200, (t - FLARE) * .6, 'mburst', 10, ['#FFFFFF', '#FFD27A']);
    lamp(770, WY, 42, lerp(.28, 1.6, f) * (.95 + .08 * Math.sin(t * 9)), 'hk');
    camEnd();
    caps(t);
    wipeOut(lt, dur, NIGHTW);
  }

  // ================= N · one place left: the Ashoka garden (13.55–60) =================
  function shotGarden(t, lt, dur) {
    const g = t - GARDEN, seen = g > 0, go = easeIn(seg(t, LEAP, LEAP + .5));
    camBegin(540, 1100, 1.0 + .008 * lt);
    h4Sky(t, 'wN');
    // below, to the left: a dark garden with red blossoms and a soft light over it
    boilSeed('nsea'); paint(rectPts(-300, 1300, W + 600, 300), { wash: H4.sea, ink: null });
    const gk = clamp(g * 1.5);
    glow(250, 1480, 420, '#FFC8A0', .1 + .35 * gk);
    for (let i = 0; i < 5; i++) tree(40 + i * 110, 1610, 220 + 60 * hash(i * 3.1), 'ntr' + i, Math.sin(t * .8 + i) * .15, ['#2E4A3A', '#1E3428', H4.ashoka]);
    boilSeed('ncity'); for (let i = 0; i < 4; i++) { const x = 640 + i * 160, h = 120 + 120 * hash(i * 4.7); paint([[x - 44, 1600], [x - 44, 1600 - h], [x, 1530 - h], [x + 44, 1600 - h], [x + 44, 1600]], { wash: H4.city, fill: H4.cityDk, fillOp: 50, tex: .3, ink: H4.ink, sw: .7, curv: .1 }); paint(rectPts(x - 9, 1600 - h * .5, 18, 24), { wash: H4.win, ink: null }); }
    h4WallTop('wN');
    const tk = take(t, GARDEN, .6);
    hanuman(lerp(620, -200, go), WY - 900 * go * (1 - go) * 1.6 + 300 * go * go, 24, { ...HN, sq: tk.sq, dy: tk.dy, rot: -.5 * go, noShadow: go > 0, hx: seen ? -.5 : 0, lookX: seen ? -1 : 0, lookY: seen ? .6 : 0,
      eyes: seen ? 'wide' : 'determined', mouth: seen ? 'O' : 'flat', handL: seen ? [-8.2, -16.6] : [-4.6, -13], bendL: -.2, handR: [4.6, -13], bendR: -1, tailSway: t * 3,
      emote: seen && go === 0 ? 'bulb' : null, emoteK: popk(t, GARDEN + .1, 6), emoteAge: g });
    camEnd();
    caps(t);
    wipeIn(lt, NIGHTW);
    wipeOut(lt, dur, GROVEW);
  }

  // ================= O · under a tree… Sita (14–15) =================
  function shotSita(t, lt, dur) {
    const g = t - O0, k = ease(seg(t, O0, O0 + 3));
    camBegin(lerp(520, 560, k), lerp(1340, 1380, k), lerp(1.0, 1.08, k));
    h4Grove(t, 'gO', 300, 700);
    sita(680, 2060, 24, { eyes: 'sad', mouth: 'frown', lookY: .5, lookX: -.2, hx: -.1, handL: [-1.6, -13.6], handR: [1.6, -13.6] });
    boilSeed('orise'); paint([[200, 2400], [200, 1790], [420, 1745], [700, 1730], [980, 1748], [1300, 1790], [1300, 2400]], { wash: '#1E2A3A', fill: '#162030', fillOp: 50, tex: .4, ink: null, curv: .4 });
    inkLine([[330, 1762], [560, 1736], [820, 1736], [1060, 1756]], 1.1, '#3E5A4A', 'ink', .5);
    for (let i = 0; i < 7; i++) inkLine([[400 + i * 95, 1752 - 8 * Math.sin(i)], [392 + i * 95, 1716 - 8 * Math.sin(i)]], 1.6, '#3E6A4A', 'inkfine', .4);
    const seen = g > 1.4;
    hanuman(230, 1330, 11, { ...HN, boilKey: 'ho', sit: 1, noShadow: true, eyes: seen ? 'teary' : 'look', lookX: .9, lookY: .5, hx: .4, mouth: seen ? 'wobble' : 'O', pray: seen ? 1 : 0, blush: .5, tailSway: t * 2,
      handL: seen ? undefined : [-1.8, -19.6], handR: seen ? undefined : [1.8, -19.6], bendL: 1, bendR: 1 });
    if (seen) hearts(270, 1080, t, O0 + 1.6, 'ohearts');
    camEnd();
    caps(t);
    wipeIn(lt, GROVEW);
    wipeOut(lt, dur, HOMEW);
  }

  // ================= P · back home: "I have nothing worthy to give him" (Yuddha 1.12) =================
  const RX = 380, HX = 700, HU = 22;
  function shotNothing(t, lt, dur) {
    const g = t - P0;
    camBegin(540, 1330, 1.0 + .008 * lt);
    h4Home(t, 'hmP');
    vanRam(RX, 1700, HU, { ...RM, lookX: g > 2.6 ? .8 : .2, lookY: g > 2.6 ? 0 : .9, hx: g > 2.6 ? .3 : 0, eyes: blinkAt(t, P0 + 1.8) ? 'closed' : 'normal', mouth: talk(t, P0 + .3, P0 + 3.8, 'wobble', 'open'), brow: .6,
      handL: [-2.6, -12.2], handR: [2.6, -12.2], bendL: 1, bendR: 1 });
    hanuman(HX, 1700, HU, { ...HN, pray: 1, bow: .18, eyes: 'happy', mouth: 'smile', lookX: -.8, hx: -.3, blush: .5, tailSway: t * 2 });
    // his empty hands: a little "nothing" puff
    if (g > .9 && g < 2.6) { boilSeed('pdots'); emote('dots', RX + 10, 1700 - 13.4 * HU, 22, popk(t, P0 + .9, 6), g); }
    camEnd();
    caps(t);
    wipeIn(lt, HOMEW);
  }
  // ================= Q · the hug: "it is all I have" (1.13–14) =================
  function shotHug(t, lt, dur) {
    const g = t - HUG, k = ease(seg(t, Q0, HUG + .3)), held = g > 0;
    const zk = ease(seg(t, HUG, HUG + 3));
    camBegin(lerp(540, 575, zk), lerp(1330, 1230, zk), lerp(1.0, 1.28, zk) + kick(t, HUG + .2));
    h4Home(t, 'hmP');
    if (held) { glow(580, 1700 - 16 * HU, 520, '#FFE2A0', .55 * clamp(g * 2)); }
    const hx = lerp(HX, 650, k), rx = lerp(RX, 500, k);
    hanuman(hx, 1700, HU, { ...HN, eyes: held ? (g > 1.2 ? 'teary' : 'closed') : 'wide', mouth: held ? 'wobble' : 'O', lookX: -.8, hx: -.4, htilt: held ? -.12 : 0, blush: .8, tailSway: t * 3,
      handL: held ? [-6.8, -16] : [-2.2, -16.6], handR: held ? [-2.6, -14.6] : [2.2, -16.6], bendL: -.5, bendR: 1 });
    vanRam(rx, 1700, HU, { ...RM, eyes: held ? 'closed' : 'happy', mouth: held ? 'smile' : 'grin', lookX: .8, hx: .4, htilt: held ? .14 : 0, lean: held ? .8 : .3 * k,
      handR: held ? [7.4, -16.4] : [5.0, -15.6], handL: held ? [5.2, -12.8] : [-2.6, -12.2], bendR: -1.2, bendL: .6 });
    if (held) { hearts(580, 1700 - 26 * HU, t, HUG + .6, 'qh1'); hearts(580, 1700 - 26 * HU, t, HUG + 2.2, 'qh2'); sparkleBurst(580, 1700 - 18 * HU, 300, g * .7, 'qburst', 12, ['#FFFFFF', GOLDC]); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, PEACH);
  }

  // ================= R · the ask: his lamp lit =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1010, 1.0 + .01 * lt);
    warmBack(t, 'wbA', 540, 1150);
    const g = t - R0;
    hanuman(540, 1680, 27, { ...HN, sit: 1, pray: 1, bow: .1 + .05 * Math.sin(g * 2.4), eyes: blinkAt(t, R0 + 2.6) ? 'closed' : g > .8 ? 'happy' : 'normal', mouth: g > .8 ? 'grin' : 'smile', blush: .6, tailSway: t * 1.8 });
    lamp(470, 1720, 44, 1.3 * (.95 + .08 * Math.sin(t * 9)), 'ask');
    hearts(540, 900, t, R0 + 1.2, 'askhearts');
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, GROVEW);
  }
  // ================= S · next: Sita said no =================
  function shotNext(t, lt, dur) {
    camBegin(540, 1340, 1.0 + .012 * lt);
    h4Grove(t, 'gS', 160, 640);
    const g = t - S0, no = g > 1.1;
    sita(380, 2000, 21, { boilKey: 'sitaS', eyes: 'normal', mouth: no ? 'flat' : 'smile', lookX: .8, hx: no ? .5 * Math.sin((g - 1.1) * 12) * (1 - seg(t, S0 + 2, S0 + 2.4)) + .2 : .3, handR: no ? [4.2, -18.6] : undefined, bendR: -.5 });
    hanuman(760, 1760, 20, { ...HN, eyes: no ? 'wide' : 'happy', mouth: no ? 'O' : 'grin', lookX: -.8, hx: -.3, handR: no ? [5.4, -13] : [1.2, -17.4], bendR: 1, handL: no ? [-5.4, -13] : undefined, tailSway: t * 2,
      emote: no ? '?' : null, emoteK: popk(t, S0 + 1.3, 6), emoteAge: g - 1.3 });
    camEnd();
    caps(t);
    wipeIn(lt, GROVEW);
  }
  function shotCard(t, lt, dur) { hsCard(t, CARDC); }

  shots([[0, shotHook], [B0, shotRavana], [C0, shotQueen], [D0, shotJoy], [E0, shotWait], [F0, shotOops], [G0, shotDoors], [H0, shotHeart], [I0, shotAgain],
    [J0, shotRamGrief], [K0, shotDominoes], [L0, shotLow], [M0, shotLive], [N0, shotGarden], [O0, shotSita], [P0, shotNothing], [Q0, shotHug], [R0, shotAsk], [S0, shotNext], [CARD, shotCard]]);
})();
