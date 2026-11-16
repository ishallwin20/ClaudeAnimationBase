// hanu9.js: "The moment HANUMAN left, ARJUNA's chariot turned to ASH." (ad 98, Hanuman series Part 9, 95.8 s, Bangers
// captions, retro SFX, no voice). Mahabharata, read on 16 Nov 2026 in the BORI critical edition (Sanskrit, GRETIL) beside
// Ganguli's translation (Project Gutenberg):
//   Vana 3.146–147  Bhima cannot move the old monkey's tail (the recap; ad 57 told it in full)
//   Vana 3.150.1–3  Hanuman embraces him, his eyes full of tears; .7–9 "choose a boon as a brother: shall I go and kill
//                   Dhritarashtra's sons, or grind their city with a rock?"; .11–12 Bhima: "it is as good as done; with
//                   you as our protector we will win"; .13–15 "when you roar like a lion in battle I will swell your
//                   roar with mine; seated on Arjuna's banner I will let out terrible roars", and he vanished
//   Bhishma 6.23.20 (Gita 1.20)  Arjuna is kapi-dhvaja, "he whose banner bears the ape"
//   Karna 8.37.7–9  Susharma's arrow hits the banner; the great ape roars and the army stands frozen in fear
//   Karna 8.63.66–69 before Arjuna and Karna fight, the ape leaps at Karna's banner (an elephant's girth rope) and
//                   strikes it with nails and teeth, "as Garuda does a snake"
//   Shalya 9.61.7–19 at the camp Krishna says: "take down the Gandiva and the two quivers and get down; I will get down
//                   after you; this is for your good" (.9–10); Krishna lets go of the reins and gets down (.11); the
//                   divine ape on the banner vanishes (.12); the chariot, burnt long before by Drona's and Karna's
//                   weapons, blazes up and falls to the ground as ash (.13–14); Arjuna, hands joined, asks why (.16–17);
//                   "it was burnt before by many weapons; it did not fall apart in battle because I sat on it; now your
//                   work is done and I have let it go: burnt by the brahmastra" (.18–19)
// The text's order is Krishna down, the ape gone, the fire; the reason Krishna gives is that HE sat on it. The reel
// keeps both: Hanuman's part is the promise he kept to the last moment. 9.61.14 burns the horses with it: they are
// kept out of frame in the camp shots. STORYBOARD.md has the plan and the sources; props are in hanu9_props.js (and
// hanu4/7/8_props.js); the kit is src/hanuman_series.js. Times are video time (t); tools/hanu9_sfx.mjs uses the same.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/hanu9_sfx.mjs)
  const VAN0 = 2.4, IGN0 = 2.9;
  const C0 = 4.6, D0 = 8.8, HUG = 10.1, E0 = 13.0, F0 = 17.8, G0 = 21.6, GONE = 26.1, H0 = 26.8, I0 = 31.4, ARW = 32.3, ROAR = 33.0, FRZ = 34.4;
  const J0 = 36.4, LEAP = 37.8, BITE = 38.3, K0 = 41.4, L0 = 45.4, M0 = 50.4, HOP = 50.9, REINS = 52.4, DOWN = 53.0;
  const N0 = 54.8, VAN = 57.2, B0 = 59.0, IGN = 59.5, O0 = 64.6, P0 = 68.8, HIT1 = 70.2, HIT2 = 71.2, Q0 = 74.0, LET = 77.4;
  const R0 = 79.2, S0 = 84.8, T0 = 89.4, CARD = 92.2;
  const CARDC = hsCardTimes(CARD);

  const GOLDC = '#F5C542';
  const popk = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const talk = (t, a, b, rest = 'smile', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const kick = (t, t0, a = .05) => t > t0 ? a * Math.exp(-(t - t0) * 6) * Math.cos((t - t0) * 20) : 0;
  const hop = (g, a = .3, f = 8, d = 1.6) => g > 0 ? -a * Math.abs(Math.sin(g * f)) * Math.exp(-g * d) : 0;
  const hearts = (x, y, t, t0, key, n = 3, s = 22) => { if (t < t0) return; boilSeed(key); for (let i = 0; i < n; i++) { const a = t - t0 - i * .22; if (a < 0 || a > 1.6) continue; const px = x + (i - 1) * s * 2.1 + Math.sin(a * 5 + i) * s * .6, py = y - a * s * 7, r = s * backOut(clamp(a * 4)) * (1 - clamp((a - 1.1) / .5)); paint(heartPts(px, py, r), { wash: '#F2557A', ink: HSK.ink, sw: .8 }); } };
  const tearsOf = (x, y, u, o, t, key, s = .8) => { const [ex, ey] = naradaHead(x, y, u, o); tears(ex + (o.flip ? -12 : 12), ey + 30, t, key, s); };
  const dark = a => { if (a > 1) paint(rectPts(-300, -600, W + 600, 3400), { wash: '#1A1020', washOp: a, ink: null }); };
  const GROVEW = ['#B4D084', '#FBE3B8'], DAYW = [H9.dayHi, H9.day], DUSKW = [H9.dusk, H9.duskLo], PEACH = [HSK.marigold, HSK.petal], ASHW = [H9.ash, H9.ashLt];

  // ---- the cast's fixed options
  const HN = { boilKey: 'hanu', seed: 60, gada: 0 };
  const BH = { boilKey: 'bhim', seed: 44 };
  const AJ = { boilKey: 'arj', seed: 71 };
  const KR = { boilKey: 'krs', seed: 15 };

  // the chariot with its riders and the ape on its banner; returns the perch
  const rath = (x, gy, s, t, o = {}) => {
    const ru = s / 26, u = s / 14;
    h9Chariot(x, gy, s, t, { key: o.key || 'rth', run: o.run ?? 0, horses: o.horses, badge: o.badge ?? 1, cracks: o.cracks, still: o.still,
      riders: ([sx, sy], cu) => {
        if (o.aj) arjuna(sx - 2.3 * cu, sy, ru, { ...AJ, kodanda: true, hx: .3, lookX: .6, eyes: 'determined', mouth: 'flat', ...o.aj });
        if (o.kr) {
          const ko = { ...KR, hx: .3, lookX: .6, eyes: 'normal', mouth: 'smile', handR: [5.2, -13.6], bendR: -1, handL: [3.4, -12.8], bendL: -1, ...o.kr };
          if (o.reins !== false) { boilSeed('reins'); for (const sd of [-1, 1]) { const [hx, hy] = naradaHand(sx + 2.5 * cu, sy, ru, ko, sd); inkLine([[hx, hy], [lerp(hx, x + 11 * u, .5), hy + 1.2 * u], [x + 11 * u, gy - 9.6 * u]], 1.6, '#5A3A2A', 'ink', .5); } }
          krishna(sx + 2.5 * cu, sy, ru, ko);
        }
      } });
    return h9Perch(x, gy, s);
  };
  const ape = (px, py, hu, t, o = {}) => hanuman(px, py, hu, { ...HN, boilKey: 'ape', sit: 1, noShadow: true, eyes: 'determined', mouth: 'smile', tailSway: t * 3, ...o });

  // ---- every caption: [text, y, t0, life, size, colour]
  const fit = (txt, max) => Math.min(max, Math.floor(1960 / txt.length));
  const two = (a, b, t0, life, sa = 72, sb = 76, gold = 1) => { sa = fit(a, sa); sb = fit(b, sb); return [[a, 470, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 470 + (sa + sb) * .68, t0 + .35, life - .35, sb, gold === 1 ? GOLDC : undefined]]; };
  const three = (a, b, c, t0, life, sa = 60, sb = 60, sc = 70, gold = 2) => { sa = fit(a, sa); sb = fit(b, sb); sc = fit(c, sc); return [[a, 466, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 466 + (sa + sb) * .68, t0 + .4, life - .4, sb, gold === 1 ? GOLDC : undefined], [c, 466 + (sa + sb) * .68 + (sb + sc) * .68, t0 + 1.2, life - 1.2, sc, gold === 2 ? GOLDC : undefined]]; };
  const at = (rows, i, t0, t1, col) => rows.map((c, j) => j === i ? [c[0], c[1], t0, t1 - t0 - .1, c[4], col ?? c[5]] : c);
  const CAPS = [
    ['THE MOMENT', 470, -1, C0 + .85, 76], ['HANUMAN LEFT,', 586, -1, C0 + .85, 132, GOLDC], ['ARJUNA\'S CHARIOT TURNED TO ASH.', 702, -1, C0 + .85, 62],
    ...two('YEARS BEFORE THE WAR, BHIMA COULD NOT', 'LIFT AN OLD MONKEY\'S TAIL.', C0, 4.1, 56, 76),
    ...two('IT WAS HANUMAN, HIS ELDER BROTHER.', 'HE HUGGED BHIMA WITH TEARS IN HIS EYES.', D0, 4.1, 58, 52, 0),
    ...three('"ASK ME FOR A BOON, BROTHER.', 'SHALL I GO AND CRUSH', 'YOUR ENEMIES\' CITY WITH A ROCK?"', E0, 4.7, 62, 70, 60, -1),
    ...two('BHIMA: "WITH YOU PROTECTING US,', 'WE WILL WIN."', F0, 3.7, 62, 100),
    ...three('"THEN WHEN YOU ROAR IN BATTLE,', 'I WILL ROAR WITH YOU.', 'I WILL SIT ON ARJUNA\'S FLAG."', G0, 5.1, 60, 76, 68),
    ...two('KURUKSHETRA. KRISHNA HELD THE REINS.', 'AND ON THE FLAG SAT HANUMAN.', H0, 4.5, 54, 70),
    ['THE GITA CALLS ARJUNA "KAPI-DHVAJA": APE ON HIS FLAG (1.20)', 664, H0 + 1.4, 3.0, 32],
    ...at(two('AN ARROW HIT THE FLAG. HANUMAN ROARED.', 'A WHOLE ARMY FROZE IN FEAR.', I0, 4.9, 52, 72), 1, FRZ, J0),
    ...three('WHEN ARJUNA FACED KARNA,', 'HANUMAN LEAPT AT KARNA\'S FLAG', 'WITH TEETH AND NAILS!', J0, 4.9, 62, 62, 84),
    ...two('DAY 18. THE WAR WAS WON.', 'THE CHARIOT ROLLED BACK TO CAMP.', K0, 3.9, 80, 60, 0),
    ...three('"ARJUNA, TAKE YOUR BOW', 'AND QUIVERS AND GET DOWN FIRST.', 'IT IS FOR YOUR OWN GOOD."', L0, 4.9, 70, 62, 72, 0),
    ...two('ARJUNA OBEYED. THEN KRISHNA', 'DROPPED THE REINS AND STEPPED DOWN.', M0, 4.3, 68, 56, -1),
    ...at(two('THE MOMENT KRISHNA STEPPED OFF,', 'HANUMAN VANISHED FROM THE FLAG.', N0, 4.1, 62, 62), 1, VAN + .1, B0),
    ...two('THE CHARIOT BURST INTO FLAMES.', 'IN MOMENTS, IT WAS ASH.', IGN + 1.5, O0 - IGN - 1.6, 64, 84),
    ...two('"KRISHNA… WHY DID', 'MY CHARIOT BURN?"', O0 + .5, 3.6, 84, 84, -1),
    ...three('"IT BURNED LONG AGO, ARJUNA.', 'DRONA AND KARNA HIT IT', 'WITH THE BRAHMASTRA."', P0, 5.1, 64, 70, 84),
    ...three('"IT DID NOT FALL APART', 'ONLY BECAUSE I SAT ON IT.', 'YOUR WORK IS DONE. I LET IT GO."', Q0, 5.1, 70, 76, 60, 1),
    ...three('ARJUNA WON THE WAR ON A CHARIOT OF ASH.', 'KRISHNA HELD IT TOGETHER. AND HANUMAN', 'KEPT HIS PROMISE TILL THE LAST MOMENT.', R0, 5.5, 50, 50, 52),
    ...two('WHO IS HOLDING YOUR CHARIOT TOGETHER?', 'COMMENT JAI BAJRANGBALI', S0, 4.5, 54, 82),
    ...two('NEXT, THE FINALE:', 'WHERE IS HANUMAN RIGHT NOW?', T0, 2.7, 70, 70),
  ];
  // the series marks: the part pill and the source line show in the opening only, then fade out (owner, 11 Nov)
  const MARKS = F0 - .2;
  const caps = t => {
    for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color });
    if (t < MARKS && t > C0) { hsPill(9, (1 - seg(t, MARKS - .3, MARKS)) * clamp((t - C0) * 4)); hsSource('MAHABHARATA · VANA 150 · SHALYA 61', t - C0 - .3, MARKS - C0 - .3); }
  };

  // the burn: flames over the chariot at (x, gy), then the heap; a = seconds since it caught
  const burn = (x, gy, s, t, a, key) => {
    if (a < 0) return;
    const up = easeOut(clamp(a / .35)), down = 1 - clamp((a - 1.0) / 1.5);
    if (down > 0) { const fh = s * 2.3 * up * (.25 + .75 * down); h7Flames(x, gy + 4, s * 1.9, fh * .8, t + 1.7, key + 'f0', 3); h7Flames(x + s * .1, gy + 4, s * 1.6, fh, t, key + 'fl', 4); h7Flames(x - s * .08, gy + 6, s * 1.2, fh * .55, t + .6, key + 'f2', 3); }
    h9Ash(x, gy + 10, s * 1.7, t, key + 'as', clamp((a - .7) / .8));
  };

  // ================= A · the hook: he is on the flag; he is gone; the chariot is ash =================
  function shotHook(t, lt, dur) {
    const v = t - VAN0, a = t - IGN0, x = 430, gy = 1640, s = 320;
    const [qx, qy] = a > 0 ? shakeXY(t, 14 * Math.exp(-a * 3)) : [0, 0];
    camBegin(540 + qx, 1015 + qy, .97 + .004 * lt);
    h9Field(t, 'kA', { mode: 'dusk', army: 0, sx: 860, tents: [[90, 70], [960, 60]] });
    dark(110 * clamp(a / .2) * (1 - clamp((a - 1.2) / 1)));
    if (a < .7) {
      const [px, py] = rath(x, gy, s, t, { key: 'rA', horses: false, badge: 1 - clamp(v / .4) });
      if (v < 0) { glow(px, py - 70, 150, '#FFE9A8', .5); ape(px, py, s / 27, t, { eyes: blinkAt(t, 1.2) ? 'closed' : 'happy', mouth: 'smile', blush: .4, handR: [4.6, -13.4 + .8 * Math.sin(t * 7)], bendR: -1 }); }
      else poof(px, py - 70, 150, v / .5, 'pfA', ['#FFF2C8', '#F2D890']);
    }
    burn(x, gy, s, t, a, 'bA');
    if (a > .3) emote('!?', x + 330, gy - 330, 30, popk(t, IGN0 + .3, 6), a - .3);
    camEnd();
    if (a > 0 && a < .12) flash((1 - a / .12) * .6, '#FFE0A0');
    caps(t);
    wipeOut(lt, dur, GROVEW);
  }

  // ================= C · the recap: Bhima cannot lift the old monkey's tail (Vana 146–147) =================
  const gcam = (lt, z = 1.45, cx = 540, cy = 1380) => camBegin(cx, cy - lt * 3, z + .005 * lt);
  function shotTail(t, lt, dur) {
    const g = t - C0, pull = .5 + .5 * Math.sin(g * 5), jit = Math.sin(t * 43) * .12 * pull;
    gcam(lt);
    h9Grove(t, 'gv');
    // the tail across the path
    boilSeed('tailC');
    const TP = [[790, 1730], [640, 1748], [480, 1740], [360 + jit * 12, 1728 - 14 * pull], [300, 1700 - 26 * pull], [318, 1668 - 26 * pull]];
    paint(ribbon(TP, 30, 20), { wash: HNM.fur || '#D9762E', fill: HNM.furDk || '#A8521A', fillOp: 50, tex: .4, ink: HSK.ink, sw: 1 });
    const bo = { ...BH, hx: .35, lookX: .5, lookY: .8, bow: .32, lean: -.6 + jit, dx: jit, eyes: pull > .5 ? 'closed' : 'angry', mouth: pull > .5 ? 'scream' : 'frown', brow: -1, sweat: 1, handR: [5.6, -7.6 - 1.6 * pull], handL: [3.4, -7 - 1.6 * pull], bendR: -1, bendL: -1 };
    bhima(240, 1745, 13.5, bo);
    hanuman(800, 1745, 12.5, { ...HN, boilKey: 'hC', sit: 1, tail: false, hx: -.4, lookX: -.8, eyes: blinkAt(t, C0 + 2.4, .5) ? 'closed' : 'smug', mouth: g > 2.2 && g < 3.2 ? 'O' : 'smug', htilt: .06 * Math.sin(t * 2), handR: g > 2.2 && g < 3.2 ? [1.4, -9.6] : undefined, bendR: 1 });
    if (g > 2.2 && g < 3.4) letter('z', 890 + (g - 2.2) * 30, 1420 - (g - 2.2) * 50, 46, '#FFFFFF', { stroke: HSK.ink, sw: .2, ink: false });
    for (let i = 0; i < 3; i++) { const q = frac(g * 1.3 + i / 3); boilSeed('swC' + i); paint(ellPts(150 + i * 40, 1400 - q * 60, 9 * (1 - q) + 3, 13 * (1 - q) + 4, 8), { wash: '#BFE6F2', washOp: 220 * (1 - q), ink: null }); }
    camEnd();
    caps(t);
    wipeIn(lt, GROVEW);
  }

  // ================= D · it was Hanuman, his elder brother: the embrace, tears in his eyes (150.1–3) =================
  function shotHugB(t, lt, dur) {
    const g = t - D0, h = t - HUG, hug = h >= 0, hk = ease(clamp(h / .35));
    gcam(lt, 1.5 + .06 * hk);
    h9Grove(t, 'gv');
    const bo = { ...BH, hx: .4, lookX: .8, pray: hug ? 0 : 1, bow: hug ? 0 : .22 * ease(seg(t, D0 + .2, D0 + .8)), lean: 1.4 * hk, eyes: hug ? 'closed' : 'wide', mouth: hug ? 'smile' : 'O', blush: hug ? .5 : 0, handR: hug ? [6.8, -15.4] : undefined, handL: hug ? [3.8, -12.2] : undefined, bendR: -1, bendL: -1 };
    bhima(430, 1745, 13.5, bo);
    const ho = { ...HN, boilKey: 'hD', hx: -.45, lookX: -.8, lean: -1.4 * hk, eyes: hug ? 'closed' : 'happy', mouth: 'smile', blush: hug ? .7 : .3, handL: hug ? [-5.6, -14] : undefined, handR: hug ? [-2.4, -12.4] : undefined, bendL: -1, bendR: 1, tailSway: t * (hug ? 6 : 3) };
    if (!hug) glow(690, 1480, 260, '#FFE9A8', .45 * clamp(g * 3));
    hanuman(lerp(690, 645, hk), 1745, 12.5, ho);
    if (hug) { tearsOf(645, 1745, 12.5, ho, t, 'trD', .7); sparkleBurst(540, 1440, 240, h * .7, 'spkD', 10, ['#FFFFFF', GOLDC]); hearts(540, 1310, t, HUG + .4, 'hD1', 3, 20); hearts(540, 1310, t, HUG + 1.6, 'hD2', 3, 20); }
    camEnd();
    if (hug && h < .12) flash((1 - h / .12) * .4, '#FFF6D8');
    caps(t);
  }

  // ================= E · "ask a boon: shall I crush your enemies' city with a rock?" (150.7–9) =================
  const rock = (x, y, r, key) => { boilSeed(key); paint([[x - r, y + r * .3], [x - r * .8, y - r * .5], [x - r * .2, y - r * .9], [x + r * .6, y - r * .7], [x + r, y], [x + r * .7, y + r * .7], [x - r * .4, y + r * .8]], { wash: '#9A968E', fill: '#6E6A66', fillOp: 60, tex: .6, ink: HSK.ink, sw: 1, curv: .3 }); inkLine([[x - r * .3, y - r * .3], [x, y], [x + r * .3, y - r * .1]], 1, '#5A5652', 'inkfine', .4); };
  const city = (x, y, s, key, squash = 0) => { boilSeed(key); for (let i = 0; i < 4; i++) { const tx = x + (i - 1.5) * s * .42, h = s * (.5 + .3 * hash(i * 2.3)) * (1 - .8 * squash); paint([[tx - s * .16, y], [tx - s * .16, y - h], [tx, y - h - s * .22 * (1 - squash)], [tx + s * .16, y - h], [tx + s * .16, y]], { wash: '#E8C27A', fill: '#B88A4A', fillOp: 50, ink: HSK.ink, sw: .7, curv: .08 }); } };
  function shotBoon(t, lt, dur) {
    const g = t - E0, rk = popk(t, E0 + 1.5, 5), bk = popk(t, E0 + 1.9, 5), drop = easeIn(seg(t, E0 + 2.9, E0 + 3.3));
    gcam(lt);
    h9Grove(t, 'gv');
    bhima(250, 1745, 13.5, { ...BH, hx: .4, lookX: .8, lookY: g > 2 ? -.5 : 0, eyes: g > 2 ? 'wide' : 'happy', mouth: g > 2 ? 'O' : 'smile', sweat: g > 3.3 ? 1 : 0, dy: hop(g - 3.3, .3, 9, 3) });
    const ho = { ...HN, boilKey: 'hE', hx: -.4, lookX: -.8, eyes: g > 1.5 ? 'happy' : 'normal', mouth: talk(t, E0 + .3, E0 + 4.2, 'smile', 'open'), blush: .3, tailSway: t * 4, handL: rk > .1 ? [-4.4, -23.6] : [-4.6, -14], bendL: 1 };
    hanuman(810, 1745, 12.5, ho);
    if (rk > .1) { const [hx, hy] = naradaHand(810, 1745, 12.5, ho, -1); rock(hx - 4, hy - 46 * rk, 56 * rk, 'rkE'); }
    h4Bubble(500, 1330, 112, 98, 700, 1420, bk, 'bbE', '#FFFDF2');
    if (bk > .9) { city(500, 1392, 104, 'ctE', drop); rock(500, lerp(1272, 1352, drop), 30, 'rkE2'); if (drop >= 1) { sparkleBurst(500, 1380, 120, (t - E0 - 3.3) * .9, 'spkE', 6, ['#FFFFFF', '#F2D890']); } letter('?', 592, 1290, 54, HSK.orange, { stroke: HSK.ink, sw: .2, ink: false, rot: .1 * Math.sin(t * 4) }); }
    camEnd();
    caps(t);
  }

  // ================= F · Bhima: "with you protecting us, we will win" (150.11–12) =================
  function shotReply(t, lt, dur) {
    const g = t - F0;
    gcam(lt, 1.5);
    h9Grove(t, 'gv');
    bhima(300, 1745, 13.5, { ...BH, hx: .4, lookX: .8, pray: 1, bow: .08, eyes: g > 2.2 ? 'closed' : 'happy', mouth: talk(t, F0 + .3, F0 + 3.0, 'smile', 'open'), blush: .4 });
    hanuman(770, 1745, 12.5, { ...HN, boilKey: 'hE', hx: -.4, lookX: -.8, eyes: g > 1.6 ? 'heart' : 'wide', mouth: g > 1.6 ? 'grin' : 'O', blush: .6, tailSway: t * 5, dy: hop(g - 1.6, .4, 8, 1.8) });
    hearts(540, 1330, t, F0 + 1.7, 'hF', 3, 20);
    camEnd();
    caps(t);
  }

  // ================= G · "when you roar I will roar with you; I will sit on Arjuna's flag", and he vanishes (150.13–15) =================
  function shotPromise(t, lt, dur) {
    const g = t - G0, bk = popk(t, G0 + 1.3, 5), gone = t >= GONE;
    gcam(lt);
    h9Grove(t, 'gv');
    bhima(250, 1745, 13.5, { ...BH, hx: .4, lookX: .8, lookY: gone ? -.3 : 0, eyes: gone ? 'wide' : g > 2.4 ? 'heart' : 'happy', mouth: gone ? 'O' : 'grin', blush: .4, emote: gone ? '!' : null, emoteK: popk(t, GONE, 6), emoteAge: t - GONE, dy: hop(g - 2.4, .4, 8, 1.8) });
    if (!gone) hanuman(810, 1745, 12.5, { ...HN, boilKey: 'hE', hx: -.4, lookX: -.8, eyes: 'determined', mouth: talk(t, G0 + .3, G0 + 4.3, 'smile', 'open'), tailSway: t * 4, handR: [3.6, -21.4], bendR: -1, puff: .4 });
    else poof(810, 1500, 240, (t - GONE) / .5, 'pfG', ['#FFF2C8', '#F2D890']);
    h4Bubble(520, 1325, 118, 104, 700, 1420, bk * (gone ? 1 - clamp((t - GONE) * 4) : 1), 'bbG', '#FFFDF2');
    if (bk > .9 && !gone) {
      const [px, py] = h9Banner(520, 1424, 104, t, 'bnG', { w: 56, ch: 56 });
      ape(px, py, 4, t, { boilKey: 'apG', mouth: 'scream', eyes: 'angry', handL: [-4.4, -16], handR: [4.4, -16], bendL: -1, bendR: -1, tail: false });
      h9Rings(px, py - 44, 80, frac((t - G0 - 1.6) / .9) * .9, 'rgG', 2, HSK.orange);
    }
    camEnd();
    caps(t);
    wipeOut(lt, dur, DAYW);
  }

  // ================= H · Kurukshetra: Krishna at the reins, Arjuna, and on the flag, Hanuman (Gita 1.20) =================
  function shotField(t, lt, dur) {
    const g = t - H0, x = 300 + g * 8, gy = 1640, s = 320;
    camBegin(540, 1012, 1.0 + .012 * lt);
    h9Field(t, 'kH', { mode: 'day', sx: 880, sy: 1180 });
    const [px, py] = rath(x, gy, s, t, { key: 'rH', run: .15, aj: { eyes: blinkAt(t, H0 + 2) ? 'closed' : 'determined' }, kr: { eyes: 'happy' } });
    glow(px, py - 70, 170, '#FFE9A8', .55 * clamp((g - 1.2) * 2));
    ape(px, py, s / 33, t, { eyes: g > 2 ? 'happy' : 'determined', mouth: 'smile', handR: g > 2 ? [4.6, -13.4 + .8 * Math.sin(t * 7)] : undefined, bendR: -1 });
    if (g > 1.4) sparkleBurst(px, py - 70, 170, (g - 1.4) * .7, 'spkH', 8, ['#FFFFFF', GOLDC]);
    camEnd();
    caps(t);
    wipeIn(lt, DAYW);
  }

  // ================= I · an arrow hits the flag; he roars; an army stands frozen (Karna 37.7–9) =================
  const flagTop = (t, key, o = {}) => h9Banner(o.x ?? 540, 2100, 900, t, key, { w: 250, ch: 330, ...o });
  const skyOnly = (t, key, mode) => h9Field(t, key, { mode, hy: 2500, army: 0, sun: false });
  function shotRoar(t, lt, dur) {
    const g = t - I0, hit = t - ARW, r = t - ROAR, roar = r >= 0 && t < FRZ;
    if (t < FRZ) {
      const [qx, qy] = roar ? shakeXY(t, 10 * Math.exp(-r * 1.2)) : [0, 0];
      camBegin(540 + qx, 1190 + qy, 1.0 + .01 * lt + kick(t, ARW, .03) + (roar ? .06 * easeOut(clamp(r / .3)) : 0));
      skyOnly(t, 'kI', 'day');
      const [px, py] = flagTop(t, 'bnI');
      if (hit < 0 && hit > -.35) h9Arrow(lerp(1300, 630, (hit + .35) / .35), lerp(1300, 1392, (hit + .35) / .35), Math.PI - .14, 190, 'arI');
      if (hit >= 0) h9Arrow(628 + 3 * Math.sin(hit * 40) * Math.exp(-hit * 6), 1392, Math.PI - .14, 190, 'arI');
      const ho = roar ? { eyes: 'angry', mouth: 'scream', brow: -1, handL: [-5, -15.6], handR: [5, -15.6], bendL: -1, bendR: -1, puff: .6, dy: -.3 * Math.abs(Math.sin(r * 14)) * Math.exp(-r) }
        : hit >= 0 ? { eyes: 'wide', mouth: 'O', lookY: .8, lookX: .4, emote: '!', emoteK: popk(t, ARW, 6), emoteAge: hit, dy: hop(hit, .5, 10, 3) }
        : { eyes: blinkAt(t, I0 + .5) ? 'closed' : 'determined', mouth: 'smile', lookX: Math.sin(t * 2) };
      ape(px, py, 13, t, { boilKey: 'apI', tailSway: t * (roar ? 9 : 3), ...ho });
      if (roar) { const [mx, my] = naradaHead(px, py, 13, { sit: 1 }); h9Rings(mx, my + 30, 520, r, 'rgI', 4, '#FFFFFF'); h9Rings(mx, my + 30, 520, r - .7, 'rgI2', 4, '#FFF2C0'); }
      camEnd();
      if (hit >= 0 && hit < .1) flash((1 - hit / .1) * .35, '#FFFFFF');
      if (roar && r < .14) flash((1 - r / .14) * .5, '#FFF2C0');
    } else {
      const f = t - FRZ, sh = 1.2 * Math.sin(t * 46);
      camBegin(540, 1370, 1.42 + .01 * f);
      h9Field(t, 'kI2', { mode: 'day', hy: 1560, sun: false, army: 0 });
      for (const [x, y, u, i, ph] of [[230, 1720, 11, 0, 0], [830, 1715, 11, 1, 1.3], [540, 1760, 12.5, 2, .6]]) {
        const so = { boilKey: 'sol' + i, hx: -.2, lookX: -.6, lookY: -.7, eyes: 'wide', mouth: i === 2 ? 'scream' : 'O', brow: 1, sweat: 1, dx: Math.sin(t * 46 + ph) * .1, handR: [4.4, -13.5 + .25 * Math.sin(t * 46 + ph)] };
        h9Soldier(x, y, u, i, so);
      }
      h9Rings(120, 1250, 900, frac(f / 1.1) * .9, 'rgI3', 3, '#FFFFFF');
      emote('!', 700, 1340, 26, popk(t, FRZ + .2, 6), f - .2);
      for (let i = 0; i < 3; i++) { boilSeed('icI' + i); const x = [230, 830, 540][i], y = [1420, 1415, 1415][i]; paint(starPts(x + 90, y + sh, 12, .4, 4), { wash: '#DFF4FF', ink: null }); }
      camEnd();
      if (f < .1) flash((1 - f / .1) * .3, '#FFFFFF');
    }
    caps(t);
  }

  // ================= J · he leaps at Karna's banner and strikes it with nails and teeth (Karna 63.66–69) =================
  function shotBanners(t, lt, dur) {
    const g = t - J0, lp = clamp((t - LEAP) / (BITE - LEAP)), b = t - BITE, bite = b >= 0, AX = 250, KX = 800;
    const [qx, qy] = bite ? shakeXY(t, 5 * Math.exp(-b * .8)) : [0, 0];
    camBegin(540 + qx, 1190 + qy, 1.0 + .008 * lt + kick(t, BITE, .04));
    skyOnly(t, 'kJ', 'day');
    const [px, py] = flagTop(t, 'bnJa', { x: AX, badge: lp > 0 ? .25 : 1 });
    const wob = bite ? Math.sin(t * 31) * 16 * Math.exp(-b * .5) : 0;
    const [kx, ky] = flagTop(t, 'bnJk', { x: KX + wob * .3, kind: 'rope', col: '#C8322E', dk: '#8E1E1E', ph: 2 });
    if (lp <= 0) ape(px, py, 13, t, { boilKey: 'apJ', hx: .5, lookX: 1, eyes: 'angry', mouth: g > .7 ? 'grin' : 'flat', brow: -1, tailSway: t * 7, lean: .6 * clamp((g - .9) * 2), handR: g > .9 ? [5, -12 + Math.sin(t * 14)] : undefined, bendR: -1 });
    else if (!bite) { const x = lerp(px, kx - 20, lp), y = lerp(py + 40, ky + 190, lp) - Math.sin(lp * Math.PI) * 50; hanuman(x, y, 13, { ...HN, boilKey: 'apJ', noShadow: true, rot: .5 + lp * .5, hx: .5, eyes: 'angry', mouth: 'scream', handL: [3.6, -24], handR: [5.4, -22], bendL: 1, bendR: -1, tailSway: t * 12 }); boilSeed('slJ'); for (let i = 0; i < 4; i++) inkLine([[x - 150 - i * 12, y - 150 + i * 30], [x - 60, y - 150 + i * 30]], 2, '#FFFFFF', 'inkfine', 0); }
    else {
      const x = kx - 14 + wob, y = ky + 330 + Math.abs(wob) * .6;
      hanuman(x, y, 13, { ...HN, boilKey: 'apJ', noShadow: true, rot: .1 * Math.sin(t * 23), hx: .2, eyes: Math.sin(t * 9) > 0 ? 'angry' : 'closed', mouth: Math.sin(t * 17) > 0 ? 'grin' : 'scream', brow: -1, handL: [-3.6, -17 + 1.6 * Math.sin(t * 26)], handR: [3.6, -17 - 1.6 * Math.sin(t * 26)], bendL: -1, bendR: -1, tailSway: t * 14 });
      for (let i = 0; i < 3; i++) { const q = frac(b * 1.6 + i / 3); cloudPuff(x + Math.cos(i * 2.1 + b * 3) * 150, ky + 140 + Math.sin(i * 2.1 + b * 3) * 110, 60 + 40 * q, 'cpJ' + i, 220 * (1 - q), '#FFF6EC', '#E8D6CC'); }
      for (let i = 0; i < 5; i++) { const q = frac(b * 2.2 + i / 5); boilSeed('stJ' + i); paint(starPts(x + Math.cos(i * 1.3) * (90 + q * 150), ky + 150 + Math.sin(i * 1.3) * (70 + q * 120), 16 * (1 - q) + 4, .4, 4), { wash: i % 2 ? '#FFFFFF' : GOLDC, ink: null }); }
      for (let i = 0; i < 3; i++) { const q = frac(b * 1.4 + i / 3); boilSeed('blJ' + i); paint(ellPts(kx + 90 + q * 130 + i * 20, ky + 300 + q * q * 260, 9, 10, 8), { wash: H9.goldLt, ink: H9.ink, sw: .5 }); }   // the rope's little bells fly off
    }
    camEnd();
    if (bite && b < .12) flash((1 - b / .12) * .45, '#FFFFFF');
    caps(t);
    wipeOut(lt, dur, DUSKW);
  }

  // ================= K · day 18: the war is won; the chariot rolls back to camp (Shalya 61.1–7) =================
  const CAMP = [[120, 78], [300, 56], [930, 70]];
  function shotCamp(t, lt, dur) {
    const g = t - K0, x = 230 + g * 30, gy = 1640, s = 320;
    camBegin(540, 1040, 1.0 + .01 * lt);
    h9Field(t, 'kK', { mode: 'dusk', army: 0, sx: 820, sy: 1300, tents: CAMP });
    const [px, py] = rath(x, gy, s, t, { key: 'rK', run: .3, aj: { eyes: 'happy', mouth: 'smile' }, kr: { eyes: 'happy' } });
    ape(px, py, s / 33, t, { eyes: g > 1.6 && g < 2.6 ? 'closed' : 'happy', mouth: g > 1.6 && g < 2.6 ? 'O' : 'smile', handR: g > 1.6 && g < 2.6 ? [1.4, -9.8] : undefined, bendR: 1 });
    boilSeed('dustK'); for (let i = 0; i < 3; i++) { const q = frac(g * 1.2 + i / 3); paint(ellPts(x - 250 - q * 90, gy - 10 - q * 30, 30 + 30 * q, 20 + 20 * q, 10), { wash: '#E8CDA0', washOp: 170 * (1 - q), ink: null }); }
    camEnd();
    caps(t);
    wipeIn(lt, DUSKW);
  }

  // ================= L · "take your bow and quivers and get down first; it is for your good" (61.9–10) =================
  function shotOrder(t, lt, dur) {
    const g = t - L0, x = 540, gy = 1700, s = 330, cu = s / 10;
    camBegin(x - .5 * cu, gy - 505 - lt * 2, 1.6 + .006 * lt);
    h9Field(t, 'kL', { mode: 'dusk', army: 0, sx: 900, sy: 1250, tents: [[170, 80], [960, 70]] });
    rath(x, gy, s, t, { key: 'rL', horses: false, reins: false,
      aj: { hx: .4, lookX: .8, eyes: g > 2.6 ? 'wide' : 'normal', mouth: g > 2.6 ? 'O' : 'smile', brow: g > 2.6 ? 1 : 0 },
      kr: { hx: -.45, lookX: -.8, eyes: 'normal', mouth: talk(t, L0 + .3, L0 + 4.3, 'smile', 'open'), handR: [5.2, -13.6], handL: g > 1.4 ? [-4.6, -11 + .5 * Math.sin(t * 6)] : [3.4, -12.8], bendL: g > 1.4 ? 1 : -1 } });
    camEnd();
    caps(t);
  }

  // ================= M · Arjuna obeys; then Krishna lets go of the reins and steps down (61.10–11) =================
  const CX = 660, CGY = 1640, CS = 300;
  const campSet = (t, key) => h9Field(t, key, { mode: 'dusk', army: 0, sx: 900, sy: 1300, tents: [[110, 76], [290, 54]] });
  const groundAJ = (t, o = {}) => arjuna(210, 1700, 12.5, { ...AJ, boilKey: 'arjG', kodanda: false, hx: .4, lookX: .8, armL: h7Bow(0, false), handL: [-4.6, -12], bendL: 1, ...o });
  const groundKR = (t, o = {}) => krishna(420, 1705, 12.5, { ...KR, boilKey: 'krsG', hx: .2, lookX: .5, eyes: 'normal', mouth: 'smile', ...o });
  function shotDown(t, lt, dur) {
    const g = t - M0, hopk = clamp((t - HOP) / .45), dk = clamp((t - DOWN) / .45), down = t >= DOWN + .45;
    camBegin(540, 1052, .97 + .006 * lt + kick(t, DOWN + .45, .03));
    campSet(t, 'kM');
    const [px, py] = rath(CX, CGY, CS, t, { key: 'rM', horses: false, reins: t < REINS,
      aj: hopk <= 0 ? { hx: -.3, lookX: -.6 } : null, kr: dk <= 0 ? { eyes: t > REINS ? 'happy' : 'normal', handR: t > REINS ? [3, -9] : [5.2, -13.6], handL: t > REINS ? [-3, -9] : [3.4, -12.8], bendR: t > REINS ? 1 : -1, hx: t > REINS ? -.3 : .3 } : null });
    if (t >= REINS && t < REINS + .8) { boilSeed('rnM'); const q = (t - REINS) / .8; for (const sd of [0, 1]) inkLine([[CX + 60 + sd * 20, CGY - 330 + q * q * 200], [CX + 190, CGY - 300 + q * q * 230], [CX + 330, CGY - 290 + q * 40]], 1.6, '#5A3A2A', 'ink', .5); }
    ape(px, py, CS / 33, t, { lookX: -.6, lookY: 1, hx: -.3, eyes: down ? 'happy' : 'normal', mouth: 'smile' });
    if (hopk > 0) { const y = hopk < 1 ? lerp(CGY - 230, 1700, hopk) - Math.sin(hopk * Math.PI) * 90 : 1700, x = hopk < 1 ? lerp(CX - 90, 210, hopk) : 210; arjuna(x, y, 12.5, { ...AJ, boilKey: 'arjG', kodanda: false, hx: hopk < 1 ? -.3 : .4, lookX: hopk < 1 ? -.6 : .8, eyes: hopk < 1 ? 'wide' : 'normal', mouth: 'flat', armL: h7Bow(0, false), handL: [-4.6, -12], bendL: 1, sq: hopk >= 1 ? -.08 * Math.exp(-(t - HOP - .45) * 8) : 0 }); }
    if (dk > 0) { const y = dk < 1 ? lerp(CGY - 230, 1705, dk) - Math.sin(dk * Math.PI) * 80 : 1705, x = dk < 1 ? lerp(CX + 30, 420, dk) : 420; krishna(x, y, 12.5, { ...KR, boilKey: 'krsG', hx: dk < 1 ? -.3 : .2, lookX: dk < 1 ? -.6 : .5, eyes: 'normal', mouth: 'smile', sq: dk >= 1 ? -.08 * Math.exp(-(t - DOWN - .45) * 8) : 0 }); }
    camEnd();
    caps(t);
  }

  // ================= N · the moment Krishna steps off, the ape on the banner vanishes (61.12) =================
  function shotVanish(t, lt, dur) {
    const g = t - N0, v = t - VAN, gone = v >= 0;
    camBegin(540, 1190, 1.0 + .012 * lt);
    skyOnly(t, 'kN', 'dusk');
    const [px, py] = flagTop(t, 'bnN', { badge: 1 - clamp(v / .6), still: gone });
    if (!gone) {
      glow(px, py - 120, 260, '#FFE9A8', .4 + .3 * seg(t, VAN - .8, VAN));
      ape(px, py, 13, t, { boilKey: 'apN', lookY: g < 1.2 ? 1 : 0, lookX: g < 1.2 ? -.5 : 0, hx: g < 1.2 ? -.3 : 0, eyes: g > 1.5 ? 'closed' : 'happy', mouth: 'smile', blush: .5, pray: g > 1.0 ? 1 : 0, bow: .16 * ease(seg(t, N0 + 1.5, N0 + 2.0)), tailSway: t * 2 });
    } else {
      poof(px, py - 120, 300, v / .6, 'pfN', ['#FFF2C8', '#F2D890']);
      sparkleBurst(px, py - 120, 320, v * .6, 'spkN', 12, ['#FFFFFF', GOLDC]);
      for (let i = 0; i < 6; i++) { const q = clamp(v / 1.6 - i * .05); if (q <= 0 || q >= 1) continue; boilSeed('upN' + i); paint(starPts(px - 120 + i * 48 + Math.sin(q * 5 + i) * 20, py - 120 - q * 420, 10 * (1 - q) + 2, .4, 4), { wash: i % 2 ? '#FFFFFF' : GOLDC, ink: null }); }
    }
    camEnd();
    if (gone && v < .12) flash((1 - v / .12) * .4, '#FFF6D8');
    caps(t);
  }

  // ================= B · silence; the chariot blazes up and falls to the ground as ash (61.13–15) =================
  function shotBurn(t, lt, dur) {
    const a = t - IGN, lit = a >= 0;
    const [qx, qy] = lit ? shakeXY(t, 18 * Math.exp(-a * 2.2)) : [0, 0];
    camBegin(540 + qx, 1052 + qy, .97 + .004 * lt + (lit ? .05 * easeOut(clamp(a / .2)) * Math.exp(-a * .8) : 0));
    campSet(t, 'kM');
    dark(lit ? 130 * clamp(a / .15) * (1 - clamp((a - 1.6) / 1.4)) : 40 * clamp((t - B0) * 3));
    if (a < .7) { rath(CX, CGY, CS, t, { key: 'rM', horses: false, reins: false, badge: 0, still: true, cracks: lit ? 1 : .5 * clamp((t - B0) * 3) }); }
    burn(CX, CGY, CS, t, a, 'bB');
    if (lit && a < 2.6) glow(CX, CGY - 250, 620, H9.fire, .35 * (1 - a / 2.6));
    groundAJ(t, lit ? { hx: .4, lookX: .9, lookY: a < 1.6 ? -.4 : .5, eyes: 'wide', mouth: a < 2 ? 'scream' : 'O', brow: 1, dy: hop(a, 1.2, 9, 2.4), dx: -1.2 * easeOut(clamp(a / .3)), emote: a > .3 && a < 2.4 ? '!' : null, emoteK: popk(t, IGN + .3, 6), emoteAge: a - .3 } : { eyes: blinkAt(t, B0 + .2) ? 'closed' : 'normal', mouth: 'smile' });
    groundKR(t, lit ? { hx: .3, lookX: .8, eyes: a > 1.4 ? 'happy' : 'normal', mouth: 'smile' } : {});
    camEnd();
    if (lit && a < .14) flash((1 - a / .14) * .75, '#FFE0A0');
    caps(t);
  }

  // ================= O · Arjuna, hands joined: "why did my chariot burn?" (61.16–17) =================
  const TA = 370, TK = 700, TY = 1745, TU = 12.5;
  const heapBehind = (t, key) => h9Ash(940, 1660, 300, t, key, 1);
  function shotWhy(t, lt, dur) {
    const g = t - O0;
    gcam(lt, 1.45, 540, 1385);
    h9Field(t, 'kO', { mode: 'dusk', hy: 1560, army: 0, sun: false });
    heapBehind(t, 'asO');
    arjuna(TA, TY, TU, { ...AJ, boilKey: 'arjO', kodanda: false, hx: .4, lookX: .8, pray: g > .5 ? 1 : 0, bow: .12 * ease(seg(t, O0 + .5, O0 + 1.0)), eyes: g < .5 ? 'wide' : 'normal', brow: 1, mouth: g < .5 ? 'O' : talk(t, O0 + .7, O0 + 3.6, 'frown', 'open') });
    krishna(TK, TY, TU, { ...KR, boilKey: 'krsO', hx: -.4, lookX: -.8, eyes: g > 2.6 ? 'happy' : 'normal', mouth: 'smile' });
    emote('?', 540, 1330, 30, popk(t, O0 + 1.2, 6), g - 1.2);
    camEnd();
    caps(t);
    wipeOut(lt, dur, DAYW);
  }

  // ================= P · long before: Drona's and Karna's weapons burn it; it stands (61.13, .18–19, .27) =================
  function shotLongAgo(t, lt, dur) {
    const g = t - P0, h1 = t - HIT1, h2 = t - HIT2, x = 640, gy = 1640, s = 300, ck = clamp(h1 / .3) * .5 + clamp(h2 / .3) * .5;
    const amt = (h1 > 0 ? 12 * Math.exp(-h1 * 4) : 0) + (h2 > 0 ? 16 * Math.exp(-h2 * 4) : 0), [qx, qy] = shakeXY(t, amt);
    camBegin(540 + qx, 1052 + qy, .97 + .006 * lt);
    h9Field(t, 'kP', { mode: 'day', sx: 880, sy: 1130 });
    dark(60 + 60 * ck);
    // the two archers
    drona(100, 1700, 11.5, { boilKey: 'drP', hx: .4, lookX: .9, eyes: 'angry', brow: -1, mouth: 'flat', armR: h7Bow(h2 < 0 ? .8 : 0, h2 < -.3), handR: [5.4, -15], bendR: -1, handL: [1.6, -14.6] });
    karna(270, 1715, 12, { boilKey: 'knP', kodanda: false, hx: .4, lookX: .9, eyes: 'angry', brow: -1, mouth: 'flat', armR: h7Bow(h1 < 0 ? .8 : 0, h1 < -.3), handR: [5.4, -15], bendR: -1, handL: [1.6, -14.6] });
    const [px, py] = rath(x, gy, s, t, { key: 'rP', cracks: ck, aj: { eyes: 'angry', mouth: 'flat', dy: -.2 * amt / 16 }, kr: { eyes: h1 > 0 ? 'closed' : 'normal', mouth: 'smile' } });
    if (h1 > 0) glow(x, gy - 330, 330, '#BFE6FF', .3 + .1 * Math.sin(t * 5));   // it holds
    ape(px, py, s / 33, t, { eyes: 'determined', mouth: 'flat', handL: [-1.6, -11], handR: [1.6, -11], bendL: 1, bendR: -1 });
    for (const [hh, y0, k] of [[h1, 1330, 'a'], [h2, 1290, 'b']]) {
      if (hh > -.45 && hh < 0) { const q = (hh + .45) / .45; h9Arrow(lerp(380, x - 150, q), lerp(y0, gy - 300, q), .06, 200, 'asP' + k, 1); }
      if (hh >= 0 && hh < .9) { h6Impact(x - 150, gy - 300, 260, hh / .5, 'imP' + k, '#FFD9A0'); h9Rings(x - 150, gy - 300, 300, hh, 'rgP' + k, 3, '#FFE0A0'); }
    }
    camEnd();
    for (const hh of [h1, h2]) if (hh >= 0 && hh < .12) flash((1 - hh / .12) * .6, '#FFE0A0');
    caps(t);
    wipeIn(lt, DAYW);
    wipeOut(lt, dur, DUSKW);
  }

  // ================= Q · "it did not fall apart only because I sat on it; your work is done; I let it go" (61.18–19) =================
  function shotBecause(t, lt, dur) {
    const g = t - Q0, bk = popk(t, Q0 + .7, 5), l = t - LET, let_ = l >= 0;
    gcam(lt, 1.45, 540, 1385);
    h9Field(t, 'kO', { mode: 'dusk', hy: 1560, army: 0, sun: false });
    heapBehind(t, 'asO');
    arjuna(TA - 60, TY, TU, { ...AJ, boilKey: 'arjO', kodanda: false, hx: .4, lookX: .8, lookY: -.3, pray: 1, eyes: let_ ? 'closed' : 'wide', mouth: let_ ? 'smile' : 'O', bow: let_ ? .2 * ease(clamp(l / .5)) : .06, blush: let_ ? .4 : 0 });
    krishna(TK + 60, TY, TU, { ...KR, boilKey: 'krsO', hx: -.4, lookX: -.8, eyes: 'happy', mouth: talk(t, Q0 + .3, Q0 + 4.4, 'smile', 'open'), handR: [-1.2, -15], bendR: 1, handL: [-5.4, -19.6], bendL: 1 });
    h4Bubble(535, 1318, 124, 108, 660, 1420, bk, 'bbQ', '#FFFDF2');
    if (bk > .9) {
      if (!let_ || l < .35) { glow(535, 1318, 120, '#9ED0FF', let_ ? .6 * (1 - l / .35) : .5 + .15 * Math.sin(t * 4)); h9Chariot(530, 1392, 100, t, { key: 'rQ', horses: false, cracks: 1, banner: false }); krishna(528, 1392 - 74, 3.4, { ...KR, boilKey: 'krsQ', noShadow: true, eyes: 'happy', mouth: 'smile' }); }
      if (let_) { h9Ash(535, 1392, 150, t, 'asQ', clamp(l / .5)); if (l < .5) sparkleBurst(535, 1340, 150, l, 'spkQ', 8, [H9.fire, H9.fireLt]); }
    }
    camEnd();
    if (let_ && l < .1) flash((1 - l / .1) * .3, '#FFE0A0');
    caps(t);
  }

  // ================= R · a chariot of ash; Krishna held it; Hanuman kept his promise to the last moment =================
  function shotMoral(t, lt, dur) {
    const g = t - R0, hk = ease(seg(t, R0 + 1.6, R0 + 2.6));
    camBegin(540, 1052 - lt * 2, .97 + .006 * lt);
    h9Field(t, 'kR', { mode: 'night', army: 0, sun: false, tents: [[110, 76], [290, 54]] });
    h9Ash(700, 1650, 380, t, 'asR', 1);
    arjuna(250, 1700, 12.5, { ...AJ, boilKey: 'arjG', kodanda: false, hx: .4, lookX: .8, pray: 1, bow: .22, eyes: 'closed', mouth: 'smile' });
    groundKR(t, { hx: -.3, lookX: -.6, eyes: 'happy', handR: [-1.4, -15.4], bendR: 1 });
    // in the sky over the heap: the one who sat on the flag
    if (hk > .02) {
      glow(770, 1050, 300 * hk, '#FFE9A8', .55 * hk);
      cloudPuff(770, 1150, 190, 'cpR', 230 * hk, '#FFF6EC', '#F2D2B0');
      if (hk > .6) hanuman(770, 1140 + 6 * Math.sin(t * 2), 10.5, { ...HN, boilKey: 'hR', sit: 1, noShadow: true, eyes: 'happy', mouth: 'smile', blush: .5, pray: g < 3.6 ? 1 : 0, handR: g >= 3.6 ? [4.6, -13.4 + .8 * Math.sin(t * 7)] : undefined, bendR: -1, tailSway: t * 3 });
      hearts(770, 900, t, R0 + 3.4, 'hR', 3, 18);
    }
    camEnd();
    caps(t);
    wipeIn(lt, DUSKW);
    wipeOut(lt, dur, PEACH);
  }

  // ================= S · the ask =================
  function shotAsk(t, lt, dur) {
    const g = t - S0;
    camBegin(540, 1180, 1.0 + .006 * lt);
    warmBack(t, 'wbS', 540, 1300);
    const ho = { ...HN, boilKey: 'hS', sit: 1, eyes: 'heart', mouth: 'smile', blush: .7, handL: [-3.4, -11.6], handR: [3.4, -11.6], bendL: 1, bendR: -1, tailSway: t * 4, htilt: .06 * Math.sin(t * 3) };
    hanuman(540, 1700, 21, ho);
    glow(540, 1600, 190, '#FFE9A8', .5); h9Chariot(535, 1700, 120, t, { key: 'rS', horses: false, banner: false });
    const bk = popk(t, S0 + 1.4, 5);
    h4Bubble(840, 1130, 92, 86, 720, 1280, bk, 'bbS', '#FFFDF2');
    if (bk > .9) letter('?', 840, 1136, 120 + 8 * Math.sin(t * 6), HSK.orange, { stroke: HSK.ink, sw: .2, ink: false, rot: .06 * Math.sin(t * 3) });
    hearts(300, 1300, t, S0 + 2.2, 'hS', 3, 22);
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, PEACH);
  }

  // ================= T · next, the finale: where is Hanuman right now? =================
  function shotNext(t, lt, dur) {
    const g = t - T0;
    camBegin(540, 1180, 1.0 + .01 * lt);
    warmBack(t, 'wbT', 540, 1300);
    glow(540, 1420, 420, H8.goldLt, .4);
    h8Earth(540, 1460, 250, t, 'erT');
    const k = popk(t, T0 + .5, 5);
    letter('?', 540, 1040, 230 * k + 12 * Math.sin(t * 6), GOLDC, { stroke: HSK.ink, sw: .2, ink: false, rot: .06 * Math.sin(t * 3) });
    sparkleBurst(540, 1420, 420, g * .6, 'spkT', 10, ['#FFFFFF', GOLDC]);
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
  }
  function shotCard(t, lt, dur) { hsCard(t, CARDC); }

  shots([[0, shotHook], [C0, shotTail], [D0, shotHugB], [E0, shotBoon], [F0, shotReply], [G0, shotPromise], [H0, shotField], [I0, shotRoar], [J0, shotBanners], [K0, shotCamp], [L0, shotOrder],
    [M0, shotDown], [N0, shotVanish], [B0, shotBurn], [O0, shotWhy], [P0, shotLongAgo], [Q0, shotBecause], [R0, shotMoral], [S0, shotAsk], [T0, shotNext], [CARD, shotCard]]);
})();
