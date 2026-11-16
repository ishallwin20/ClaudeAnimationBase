// hanu10.js: "HANUMAN is still alive. This is what he does ALL DAY." (ad 99, Hanuman series Part 10, the finale, 77.4 s,
// Bangers captions, retro SFX, no voice). Read on 16 Nov 2026:
//   Valmiki, Uttara 40.16     "as long as Ram's story moves over the earth, my breath will stay in my body" (the recap of
//                             Part 8); 40.17–18 "let apsaras make me hear it; hearing it I will scatter that longing as the
//                             wind a streak of cloud"; 108.33–36 Ram, leaving: "you set your mind on living: stay, and be
//                             glad, as long as my story is told" (IITK edition, Sanskrit)
//   Mahabharata, Vana 146.42  a plantain grove many yojanas wide on Gandhamadana's slopes; .59–60, .64 he lies asleep in
//                             the middle of it, on a broad stone slab; .73 he opens his eyes a little
//                Vana 147.37  "I asked: as long as Ram's story lasts in the worlds, may I live. He said: so be it";
//                             .38 Ram ruled and went to heaven; .39 "so here apsarases and gandharvas always delight me,
//                             singing that hero's deeds" (BORI critical edition, GRETIL)
//   Bhagavata 5.19.1–2        in Kimpurusha-varsha Hanuman, with the people of that land, worships Ram with unbroken
//                             devotion; with Arshtishena he listens as gandharvas sing his lord's story, and himself sings:
//             5.19.7          "not high birth, not good looks, not speech, not wit, not form is what pleases him: for even
//                             us forest-dwellers, who have none of these, Lakshman's elder brother made his friends"
//             5.19.8          "god or demon, monkey or man: let each worship Ram with his whole self" (vedabase.io)
//   A traditional verse       "yatra yatra raghunatha-kirtanam…": wherever Ram's praise is sung, there is Maruti, hands
//                             joined at his head, eyes brimming with tears. Its source text could not be traced: the reel
//                             quotes it as "an old prayer", not as scripture.
// STORYBOARD.md has the plan and the sources; props are in hanu10_props.js (and hanu4/5/7/8/9_props.js); the kit is
// src/hanuman_series.js. Times are video time (t); tools/hanu10_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/hanu10_sfx.mjs)
  const HEAR = 1.5, LOVE = 2.8;
  const B0 = 4.4, C0 = 9.4, GONE = 10.8, WHERE = 12.0, D0 = 13.6, SEE = 15.1, PEEK = 17.0, E0 = 18.4, F0 = 23.4, G0 = 28.6, ONE = 30.1;
  const H0 = 32.8, H2 = 34.9, I0 = 37.0, REACH = 40.4, J0 = 42.4, RISE = 43.0, SING = 44.2, K0 = 46.0, HUG = 48.5, L0 = 51.8, M0 = 55.6, SEEN = 57.3;
  const N0 = 61.2, PEEKN = 62.2, O0 = 65.6, P0 = 70.2, CARD = 73.8;
  const CARDC = hsCardTimes(CARD);

  const GOLDC = '#F5C542';
  const popk = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const talk = (t, a, b, rest = 'smile', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const sing = (t, ph = 0) => Math.sin(t * 7 + ph) > -.1 ? 'open' : 'smile';
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const kick = (t, t0, a = .05) => t > t0 ? a * Math.exp(-(t - t0) * 6) * Math.cos((t - t0) * 20) : 0;
  const hop = (g, a = .3, f = 8, d = 1.6) => g > 0 ? -a * Math.abs(Math.sin(g * f)) * Math.exp(-g * d) : 0;
  const hearts = (x, y, t, t0, key, n = 3, s = 22) => { if (t < t0) return; boilSeed(key); for (let i = 0; i < n; i++) { const a = t - t0 - i * .22; if (a < 0 || a > 1.6) continue; const px = x + (i - 1) * s * 2.1 + Math.sin(a * 5 + i) * s * .6, py = y - a * s * 7, r = s * backOut(clamp(a * 4)) * (1 - clamp((a - 1.1) / .5)); paint(heartPts(px, py, r), { wash: '#F2557A', ink: HSK.ink, sw: .8 }); } };
  const tearsOf = (x, y, u, o, t, key, s = .8) => { const [ex, ey] = naradaHead(x, y, u, o); tears(ex + (o.flip ? -12 : 12), ey + 30, t, key, s); };
  const HALLW = [P1.hall, P1.hallDk], LATEW = [H8.lateHi, H8.lateLo], GROVEW = ['#B4D084', '#FBE3B8'], VARW = [H10.sky, H10.skyLo], PEACH = [HSK.marigold, HSK.petal], NIGHTW = [H10.wall, H10.wallLo];

  // ---- the cast's fixed options
  const HN = { boilKey: 'hanu', seed: 60, gada: 0 };
  const RM = { boilKey: 'ram', seed: 12, kodanda: false };
  const BH_ = { boilKey: 'bhim', seed: 44 };

  // ---- every caption: [text, y, t0, life, size, colour]
  const fit = (txt, max) => Math.min(max, Math.floor(1960 / txt.length));
  const two = (a, b, t0, life, sa = 72, sb = 76, gold = 1) => { sa = fit(a, sa); sb = fit(b, sb); return [[a, 470, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 470 + (sa + sb) * .68, t0 + .35, life - .35, sb, gold === 1 ? GOLDC : undefined]]; };
  const three = (a, b, c, t0, life, sa = 60, sb = 60, sc = 70, gold = 2) => { sa = fit(a, sa); sb = fit(b, sb); sc = fit(c, sc); return [[a, 466, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 466 + (sa + sb) * .68, t0 + .4, life - .4, sb, gold === 1 ? GOLDC : undefined], [c, 466 + (sa + sb) * .68 + (sb + sc) * .68, t0 + 1.2, life - 1.2, sc, gold === 2 ? GOLDC : undefined]]; };
  const at = (rows, i, t0, t1, col) => rows.map((c, j) => j === i ? [c[0], c[1], t0, t1 - t0 - .1, c[4], col ?? c[5]] : c);
  const small = (txt, rows, size = 30) => { const l = rows[rows.length - 1]; return [txt, l[1] + l[4] * .62 + size * .9, l[2] + .3, l[3] - .3, size]; };
  const R_I = three('HE HAD TOLD RAM:', '"WHEN I MISS YOU, YOUR STORY', 'WILL BLOW MY LONGING AWAY."', I0, 5.3, 64, 62, 66);
  const R_J = two('AND THEN HANUMAN SINGS TOO.', 'A VERSE OF HIS OWN:', J0, 3.5, 66, 76);
  const R_O = two('HE IS LISTENING RIGHT NOW.', 'COMMENT JAI SHRI RAM', O0, 4.5, 68, 88);
  const CAPS = [
    ['HANUMAN IS', 470, -1, B0 + .85, 76], ['STILL ALIVE.', 592, -1, B0 + .85, 146, GOLDC], ['THIS IS WHAT HE DOES ALL DAY.', 712, -1, B0 + .85, 62],
    ...three('LONG AGO, HE ASKED RAM FOR ONE THING:', '"AS LONG AS YOUR STORY IS TOLD,', 'LET ME STAY ALIVE."', B0, 4.9, 52, 60, 92),
    ...at(two('ONE DAY, RAM LEFT THE EARTH.', 'HANUMAN STAYED. SO WHERE IS HE NOW?', C0, 4.1, 66, 56), 1, GONE + .2, D0),
    ...three('THE MAHABHARATA: AN AGE LATER,', 'BHIMA FOUND HIM FAST ASLEEP', 'IN A HIMALAYAN BANANA GROVE.', D0, 4.7, 62, 66, 68),
    ...three('"RAM WENT TO HEAVEN. BUT HERE,', 'GANDHARVAS AND APSARAS', 'SING HIS STORY TO ME."', E0, 4.9, 62, 70, 84),
    ...three('THE BHAGAVATA NAMES ANOTHER LAND,', 'KIMPURUSHA-VARSHA. AND THERE TOO,', 'HE LISTENS AS GANDHARVAS SING OF RAM.', F0, 5.1, 56, 56, 52),
    ...at(two('TWO BOOKS. TWO ADDRESSES.', 'ONE ANSWER: HE LISTENS TO RAM\'S STORY.', G0, 4.1, 74, 54), 1, ONE, H0),
    ...two('HE LIVED HALF OF THIS STORY HIMSELF.', 'HE STILL LISTENS TO EVERY WORD.', H0, 4.1, 54, 62),
    ...R_I, small('VALMIKI RAMAYAN · UTTARA 40.18', R_I),
    ...R_J, small('BHAGAVATA PURANA 5.19.7', R_J),
    ...at(three('"NOT BIRTH. NOT BEAUTY. NOT BRAINS.', 'WE WERE ONLY FOREST MONKEYS.', 'AND RAM STILL MADE US HIS FRIENDS."', K0, 5.7, 56, 66, 58), 2, HUG, L0),
    ...two('"GOD OR DEMON, MONKEY OR HUMAN,', 'LET EVERYONE LOVE RAM."', L0, 3.7, 60, 86),
    ...at(three('AND AN OLD PRAYER SAYS:', 'WHEREVER RAM\'S STORY IS TOLD,', 'HANUMAN IS THERE, EYES FULL OF TEARS.', M0, 5.5, 64, 62, 52), 2, SEEN, N0),
    ...at(two('YOU JUST HEARD 10 PARTS OF IT.', 'GUESS WHO WAS LISTENING WITH YOU.', N0, 4.3, 64, 58), 1, PEEKN + .2, O0),
    ...R_O, small('SEND THIS TO SOMEONE WHO LOVES HANUMAN JI', R_O, 40),
    ...two('THAT WAS HANUMAN\'S STORY, IN 10 PARTS.', 'NEW HERE? START FROM PART 1.', P0, 3.5, 50, 68),
  ];
  // the series marks: the part pill and the source line show in the opening only, then fade out (owner, 11 Nov)
  const MARKS = D0 - .2;
  const caps = t => {
    for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color });
    if (t < MARKS && t > B0) { hsPill(10, (1 - seg(t, MARKS - .3, MARKS)) * clamp((t - B0) * 4)); hsSource('VALMIKI · MAHABHARATA · BHAGAVATA', t - B0 - .3, MARKS - B0 - .3); }
  };

  // he cups a hand behind his ear (hand targets are in standing coordinates, sitting or not)
  const EAR = { handR: [4.5, -20.7], bendR: -1 };
  // Ram's story: a palm-leaf pothi over the earth, and him on it (Part 8's motif)
  const storyWorld = (x, y, t, k, key) => {
    if (k <= .05) return;
    glow(x, y, 190 * k, H8.goldLt, .5 * k);
    h8Earth(x, y + 34, 78 * k, t, key + 'er');
    if (k > .9) { h8Pothi(x, y - 84 + 5 * Math.sin(t * 2.4), 128, t, key + 'pt', 1); hanuman(x + 4, y - 38, 2.6, { ...HN, boilKey: key + 'h', sit: 1, noShadow: true, tail: false, eyes: 'happy', mouth: 'smile', lookY: -1 }); }
  };

  // ================= A · the hook: he sits, he hears something, he lights up =================
  function shotHook(t, lt, dur) {
    const h = t - HEAR, l = t - LOVE;
    camBegin(540, 1180, 1.0 + .006 * lt);
    warmBack(t, 'wbA', 540, 1330);
    glow(540, 1440, 400, '#FFE9A8', .5);
    h10Stream(1240, 1250, 730, 1390, t, HEAR - .5, 'ntA', 4, .5, 16);
    const ho = { ...HN, boilKey: 'hA', sit: 1, eyes: l > 0 ? 'heart' : h > 0 ? 'wide' : 'happy', mouth: l > 0 ? 'grin' : h > 0 ? 'O' : 'smile', blush: .5, hx: h > 0 ? .3 : 0, lookX: h > 0 ? .8 : 0,
      htilt: .06 * Math.sin(t * 2.4) + (h > 0 ? .1 * ease(clamp(h / .3)) : 0), tailSway: t * (l > 0 ? 6 : 3), dy: hop(l, .5, 8, 1.6), ...(h > 0 ? EAR : {}) };
    hanuman(540, 1815, 31, ho);
    hearts(540, 1080, t, LOVE + .2, 'hA', 3, 24);
    if (l > 0) sparkleBurst(540, 1420, 300, l * .6, 'spkA', 10, ['#FFFFFF', GOLDC]);
    camEnd();
    caps(t);
    wipeOut(lt, dur, HALLW);
  }

  // ================= B · the promise: "as long as your story is told, let me stay alive" (Uttara 40.16) =================
  function shotPromise(t, lt, dur) {
    const g = t - B0;
    camBegin(520, 1330 - lt * 3, 1.5 + .005 * lt);
    h8Hall(t, 'hlB', 250, 1650);
    ram(250, 1650, 12, { ...RM, boilKey: 'rmB', sit: 1, hx: .4, lookX: .8, eyes: g > 3.2 ? 'happy' : 'normal', mouth: 'smile' });
    hanuman(660, 1720, 12.5, { ...HN, boilKey: 'hB', sit: 1, pray: 1, hx: -.45, lookX: -.8, lookY: -.6, eyes: 'happy', mouth: talk(t, B0 + .6, B0 + 4.2, 'smile', 'open'), blush: .5, tailSway: t * 2.5 });
    storyWorld(465, 1300, t, popk(t, B0 + 1.3, 4), 'swB');
    hearts(250, 1260, t, B0 + 3.4, 'hB', 3, 16);
    camEnd();
    caps(t);
    wipeIn(lt, HALLW);
    wipeOut(lt, dur, LATEW);
  }

  // ================= C · Ram leaves the earth; Hanuman stays (Uttara 108.33–36). So where is he now? =================
  function shotLeft(t, lt, dur) {
    const g = t - C0, v = t - GONE, gone = v >= 0, w = t - WHERE, up = easeIn(seg(t, C0 + .5, GONE));
    camBegin(540, 1410 - lt * 3, 1.32 + .005 * lt);
    h8Dusk(t, 'dkC', 1730, 1, 540);
    if (!gone) {
      glow(330, 1500 - up * 160, 300 + 220 * up, '#FFF2C0', .45 + .45 * up);
      ram(330, 1790 - up * 130, 13, { ...RM, boilKey: 'rmC', noShadow: up > .05, hx: .45, lookX: .8, lookY: .3, eyes: 'happy', mouth: 'smile', handR: [5.4, -19.4 + .6 * Math.sin(t * 5)], bendR: -1 });
    } else {
      poof(330, 1330, 300, v / .6, 'pfC', ['#FFFFFF', '#FFF2C8']);
      sparkleBurst(330, 1330, 320, v * .6, 'spkC', 12, ['#FFFFFF', GOLDC]);
      for (let i = 0; i < 6; i++) { const q = clamp(v / 1.8 - i * .05); if (q <= 0 || q >= 1) continue; boilSeed('upC' + i); paint(starPts(210 + i * 48 + Math.sin(q * 5 + i) * 20, 1330 - q * 460, 10 * (1 - q) + 2, .4, 4), { wash: i % 2 ? '#FFFFFF' : GOLDC, ink: null }); }
    }
    const ho = { ...HN, boilKey: 'hC', hx: w > 0 ? 0 : -.45, lookX: w > 0 ? 0 : -.8, lookY: w > 0 ? 0 : gone ? -1 : -.3 - .5 * up, pray: gone ? 0 : 1, bow: gone ? 0 : .1,
      eyes: w > 0 ? 'normal' : gone ? 'teary' : 'happy', mouth: 'smile', blush: .4, tailSway: t * 2.5, tail: gone && w < 0 ? 'droop' : 'curl',
      handL: gone && w < 0 ? [-4.6, -20 + .7 * Math.sin(t * 6)] : undefined, bendL: 1 };
    hanuman(740, 1790, 13, ho); h8Neck(740, 1790, 13, ho, 'nkC', .5 + .2 * Math.sin(t * 4));
    if (gone && w < 0) tearsOf(740, 1790, 13, ho, t, 'trC', .7);
    if (w > 0) emote('?', 600, 1400, 30, popk(t, WHERE, 6), w);
    camEnd();
    if (gone && v < .12) flash((1 - v / .12) * .4, '#FFF6D8');
    caps(t);
    wipeIn(lt, LATEW);
    wipeOut(lt, dur, GROVEW);
  }

  // ================= D · the Mahabharata: an age later Bhima finds him asleep in a plantain grove (Vana 146.42–73) =================
  const gcam = (lt, z = 1.45, cx = 540, cy = 1380) => camBegin(cx, cy - lt * 3, z + .005 * lt);
  const SX = 800, SY = 1716, SU = 12.5;   // where he sits on the slab
  function shotGrove(t, lt, dur) {
    const g = t - D0, in_ = easeOut(seg(t, D0 + .2, D0 + 1.3)), s = t - SEE, pk = t - PEEK, sn = .5 + .5 * Math.sin(g * 3.4);
    gcam(lt);
    h9Grove(t, 'gv');
    h10Slab(790, 1758, 340, 'slD');
    const ho = { ...HN, boilKey: 'hD', sit: 1, tail: 'droop', hx: -.15, htilt: .2 + .03 * sn, lookX: -.9, eyes: pk > 0 ? ['normal', 'closed'] : 'closed', mouth: pk > 0 ? 'smile' : sn > .5 ? 'O' : 'flat', blush: .3 };
    hanuman(SX, SY, SU, ho);
    h10Bananas(SX - 14, SY - 70, 74, 'bnD', -.35);
    if (pk < 0) {
      const [hx_, hy_] = naradaHead(SX, SY, SU, ho);
      boilSeed('snD'); paint(ellPts(hx_ - 34, hy_ + 26, 7 + 15 * sn, 7 + 15 * sn, 12), { wash: '#DDF2FA', washOp: 210, ink: HSK.ink, sw: .5 });
      for (let i = 0; i < 3; i++) { const q = frac(g * .6 + i / 3); letter('z', hx_ + 70 + q * 70, hy_ - 60 - q * 110, 30 + 26 * q, '#FFFFFF', { stroke: HSK.ink, sw: .2, ink: false, alpha: Math.sin(q * Math.PI) }); }
    } else emote('!', SX + 110, SY - 330, 22, popk(t, PEEK, 6), pk);
    const lean = s > 1.0 ? ease(clamp((s - 1.0) / .4)) : 0;
    bhima(lerp(-90, 250, in_), 1745, 13.5, { ...BH_, walk: in_ < 1 ? t * 3 : undefined, hx: .4, lookX: .8, eyes: s > 0 ? 'wide' : 'normal', mouth: s > 0 ? 'O' : 'flat', brow: s > 0 ? 1 : 0, lean: .9 * lean,
      emote: s > 0 && s < 1.5 ? '!' : null, emoteK: popk(t, SEE, 6), emoteAge: s, handR: lean > 0 ? [5.4, -16.6] : undefined, bendR: -1, dy: hop(s, .5, 10, 3) });
    camEnd();
    caps(t);
    wipeIn(lt, GROVEW);
  }

  // ================= E · "Ram went to heaven; here gandharvas and apsaras sing his story to me" (Vana 147.38–39) =================
  function shotSing(t, lt, dur) {
    const g = t - E0, up = ease(seg(t, E0 + 1.6, E0 + 2.2));
    camBegin(540, 1302 - lt * 2, 1.22 + .004 * lt);
    h9Grove(t, 'gv');
    h10Slab(790, 1758, 340, 'slD');
    // the singers come down on their clouds
    const d0 = 1 - easeOut(seg(t, E0 + .9, E0 + 1.8)), d1 = 1 - easeOut(seg(t, E0 + 1.2, E0 + 2.1));
    const gy0 = 1400 - d0 * 620 + 8 * Math.sin(t * 2.2), gy1 = 1392 - d1 * 620 + 8 * Math.sin(t * 2.2 + 1.3);
    glow(185, gy0 - 130, 200, '#E6F8FF', .5); glow(895, gy1 - 120, 200, '#E6F8FF', .5);
    gandharva(185, gy0, 8.5, 0, { boilKey: 'gnE', cloud: 1, strum: 1, hx: .3, lookX: .6, eyes: 'happy', mouth: sing(t) });
    cloudPuff(895, gy1 + 6, 62, 'cpE', 255, '#FFFFFF', '#D6E2F2');
    apsara(895, gy1, 8.5, { boilKey: 'apE', flip: true, hx: -.3, lookX: -.6, eyes: 'happy', mouth: sing(t, 1.3), blush: .4, handR: [4.6, -17 + Math.sin(t * 3)], bendR: -1 });
    if (d0 < .1) { h10Stream(270, gy0 - 150, 690, 1520, t, E0 + 1.9, 'ntE0', 4, .55, 13); h10Stream(820, gy1 - 60, 840, 1480, t, E0 + 2.2, 'ntE1', 2, .7, 11); }
    bhima(350, 1745, 13.5, { ...BH_, hx: up > .5 ? .1 : .4, lookX: up > .5 ? .3 : .8, lookY: up > .5 ? -1 : 0, eyes: up > .5 ? 'wide' : 'normal', mouth: up > .5 ? 'O' : 'smile', pray: g > 3.2 ? 1 : 0 });
    hanuman(SX, SY, SU, { ...HN, boilKey: 'hD', sit: 1, hx: -.3, lookX: -.6, eyes: g > 2.6 ? 'heart' : 'happy', mouth: talk(t, E0 + .3, E0 + 2.4, 'smile', 'open'), blush: .5, htilt: g > 2.4 ? .1 * Math.sin(t * 2.4) : 0, tailSway: t * 4,
      handL: g > .5 && g < 2.4 ? [-4.6, -23 + .5 * Math.sin(t * 6)] : undefined, bendL: 1 });
    h10Bananas(SX + 132, SY - 34, 70, 'bnD', .5);
    hearts(SX, SY - 400, t, E0 + 2.9, 'hE', 3, 18);
    camEnd();
    caps(t);
    wipeOut(lt, dur, VARW);
  }

  // ================= F · the Bhagavata: in Kimpurusha-varsha he listens as gandharvas sing of Ram (5.19.1–2) =================
  const VX = 540, VY = 1765, VU = 16.5;
  const choir = (t, hush = 0, look = 0) => {
    const o = (ph, fl) => ({ strum: 1 - hush, hx: (fl ? -1 : 1) * .35, lookX: (fl ? -1 : 1) * .7, lookY: look ? -.2 : 0, eyes: hush ? 'wide' : 'happy', mouth: hush ? 'smile' : sing(t, ph), flip: fl });
    gandharva(375, 1625, 8.5, 2, { boilKey: 'g2', ...o(2.2, false) });
    gandharva(225, 1745, 11, 0, { boilKey: 'g0', ...o(0, false) });
    gandharva(855, 1745, 11, 1, { boilKey: 'g1', ...o(1.3, true) });
    if (!hush) { notes(300, 1380, t, 'ntF0', GOLDC, 3); notes(740, 1370, t + .5, 'ntF1', '#FFFFFF', 3); }
  };
  function shotVarsha(t, lt, dur) {
    const g = t - F0;
    camBegin(540, 1347 - lt * 2, 1.3 + .005 * lt);
    h10Varsha(t, 'kv');
    choir(t);
    glow(VX, 1500, 300, '#FFF2C0', .5);
    hanuman(VX, VY, VU, { ...HN, boilKey: 'hF', sit: 1, eyes: g > 3.2 ? 'closed' : 'happy', mouth: 'smile', blush: .5, htilt: .1 * Math.sin(t * 2.4), tailSway: t * 3, pray: g > 3.2 ? 1 : 0, ...(g <= 3.2 ? EAR : {}) });
    hearts(VX, 1400, t, F0 + 3.6, 'hF', 3, 18);
    camEnd();
    caps(t);
    wipeIn(lt, VARW);
    wipeOut(lt, dur, PEACH);
  }

  // ================= G · two books, two addresses, one answer: he listens to Ram's story =================
  const vign = (x, y, r, k, kind, t) => {
    if (k <= 0) return;
    push(); translate(x, y); scale(k); translate(-x, -y);
    boilSeed('vg' + kind);
    paint(ellPts(x, y, r, r, 30), { wash: kind ? H10.sky : '#FBE3B8', ink: HSK.ink, sw: 1.6 });
    if (kind) { paint([[x - r * .8, y + r * .2], [x - r * .3, y - r * .5], [x, y - r * .1], [x + r * .35, y - r * .62], [x + r * .82, y + r * .2]], { wash: H10.snow, fill: H10.snowDk, fillOp: 50, ink: null, curv: .1 }); paint(ellPts(x, y + r * .55, r * .8, r * .34, 20), { wash: H10.meadow, ink: null }); }
    else { h9Plantain(x - r * .5, y + r * .5, r * .9, t, 'vgp0'); h9Plantain(x + r * .52, y + r * .46, r * .8, t, 'vgp1'); paint(ellPts(x, y + r * .58, r * .78, r * .3, 20), { wash: '#B4D084', ink: null }); }
    hanuman(x, y + r * .62, r / 26, { ...HN, boilKey: 'vgh' + kind, sit: 1, noShadow: true, eyes: 'happy', mouth: 'smile', htilt: .1 * Math.sin(t * 2.4 + kind), ...EAR });
    pop();
  };
  function shotOne(t, lt, dur) {
    const g = t - G0, o = t - ONE;
    camBegin(540, 1180, 1.0 + .006 * lt);
    warmBack(t, 'wbG', 540, 1330);
    vign(285, 1130, 190, popk(t, G0 + .2, 5), 0, t); vign(795, 1130, 190, popk(t, G0 + .8, 5), 1, t);
    if (g > .5) letter('MAHABHARATA', 285, 1372, 54, HSK.cream, { stroke: HSK.ink, sw: .2, ink: false, rot: -.02, pop: (g - .5) * 5 });
    if (g > 1.1) letter('BHAGAVATA', 795, 1372, 54, HSK.cream, { stroke: HSK.ink, sw: .2, ink: false, rot: -.02, pop: (g - 1.1) * 5 });
    h10Stream(300, 1420, 440, 1590, t, ONE - .2, 'ntG0', 3, .5, 12); h10Stream(790, 1420, 670, 1590, t, ONE, 'ntG1', 3, .5, 12);
    glow(540, 1640, 300, '#FFE9A8', .5 * clamp(o * 3));
    hanuman(540, 1860, 21, { ...HN, boilKey: 'hG', sit: 1, eyes: o > .3 ? 'heart' : 'happy', mouth: o > .3 ? 'grin' : 'smile', blush: .6, htilt: .08 * Math.sin(t * 2.4), tailSway: t * 4, dy: hop(o - .3, .4, 8, 1.8), ...EAR });
    hearts(540, 1440, t, ONE + .5, 'hG', 3, 18);
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, VARW);
  }

  // ================= H · he lived half of this story himself; he still listens to every word =================
  const BX = 400, BY = 1350, BRX = 262, BRY = 150, LX = 730, LY = 1840, LU = 19;
  const listenSet = (t, key) => {
    h10Varsha(t, key);
    gandharva(190, 1815, 10.5, 0, { boilKey: 'gH', strum: 1, hx: .2, lookX: .4, lookY: -.6, eyes: 'happy', mouth: sing(t) });
    h10Stream(290, 1600, BX - 60, BY + BRY - 10, t, 0, 'ntHs', 3, .6, 11);
  };
  const lcam = lt => camBegin(540, 1357, 1.18 + .005 * lt);
  function shotLived(t, lt, dur) {
    const b = t - H2, fire = b >= 0, q = fire ? clamp(b / 1.9) : clamp((t - H0 - .3) / 1.7);
    lcam(lt);
    listenSet(t, 'kvH');
    h10Song(BX, BY, BRX, BRY, popk(t, H0 + .1, 5), 'sgH');
    if (t > H0 + .35) {
      if (!fire) {   // the leap over the sea
        h5Lanka(BX + 165, BY + 62, 120, 'lkH');
        boilSeed('seaH'); paint(ellPts(BX - 30, BY + 90, 200, 30, 20), { wash: '#7EC4E0', ink: null });
        for (let i = 0; i < 4; i++) inkLine([[BX - 190 + i * 86 + Math.sin(t * 3 + i) * 8, BY + 88 + (i % 2) * 12], [BX - 164 + i * 86 + Math.sin(t * 3 + i) * 8, BY + 82 + (i % 2) * 12], [BX - 138 + i * 86 + Math.sin(t * 3 + i) * 8, BY + 88 + (i % 2) * 12]], 1.4, '#FFFFFF', 'inkfine', .5);
        const e = ease(q), fx = lerp(BX - 190, BX + 100, e), fy = BY + 40 - Math.sin(e * Math.PI) * 105;
        hanuman(fx, fy, 4.4, { ...HN, boilKey: 'mnH', noShadow: true, rot: 1.0, eyes: 'determined', mouth: 'smile', handL: [3.6, -24], handR: [5.4, -22], bendL: 1, bendR: -1, tailSway: t * 9 });
        boilSeed('spH'); for (let i = 0; i < 3; i++) inkLine([[fx - 90 - i * 10, fy - 50 + i * 16], [fx - 40, fy - 50 + i * 16]], 1.4, '#C8B48A', 'inkfine', 0);
      } else {   // the tail on fire over Lanka
        h5Lanka(BX, BY + 96, 230, 'lkH2');
        const rx = lerp(BX - 150, BX + 110, q), ry = BY + 4 - 46 * Math.abs(Math.sin(q * 9.4)), ro = { ...HN, boilKey: 'mnH2', noShadow: true, walk: t * 7, hx: .4, eyes: 'determined', mouth: 'grin', tailSway: t * 9 };
        h7Flames(BX - 84, BY + 12, 60, 56, t, 'flH0', 3); if (q > .45) h7Flames(BX, BY - 44, 60, 60, t + 1, 'flH1', 3); if (q > .8) h7Flames(BX + 84, BY + 2, 56, 52, t + 2, 'flH3', 3);
        hanuman(rx, ry, 4.2, ro);
        const [tx, ty] = hanumanTail(rx, ry, 4.2, ro); h7Flames(tx, ty + 4, 30, 38, t + .4, 'flHt', 2);
      }
    }
    // he listens: cheers himself over the sea, then checks his own tail
    const ho = fire
      ? { ...HN, boilKey: 'hH', sit: 1, hx: .55, lookX: 1, lookY: -.2, eyes: 'wide', mouth: 'O', brow: 1, sweat: 1, blush: .4, tailSway: t * 9, htilt: .06, dy: hop(b, .5, 10, 3) }
      : { ...HN, boilKey: 'hH', sit: 1, hx: -.35, lookX: -.7, lookY: -.8, eyes: q > .25 ? 'happy' : 'wide', mouth: q > .25 ? 'grin' : 'O', blush: .5, tailSway: t * 6, handL: [-4.8, -23 + 1.1 * Math.sin(t * 14)], handR: [4.8, -23 - 1.1 * Math.sin(t * 14)], bendL: -1, bendR: -1, dy: -.3 * Math.abs(Math.sin(t * 7)) };
    hanuman(LX, LY, LU, ho);
    if (fire) {
      const [tx, ty] = hanumanTail(LX, LY, LU, ho), [mx, my] = naradaMouth(LX, LY, LU, ho);
      for (let i = 0; i < 2; i++) { const k = frac(b * 1.4 + i / 2); cloudPuff(tx + 6, ty - 20 - k * 60, 22 + 16 * k, 'smH' + i, 200 * (1 - k), '#D8D4DC', '#B4B0BC'); }
      boilSeed('blH'); for (let i = 0; i < 3; i++) { const k = frac(b * 2.4 + i / 3); inkLine([[lerp(mx + 20, tx - 30, k), lerp(my, ty, k) + (i - 1) * 9], [lerp(mx + 20, tx - 30, k) + 22, lerp(my, ty, k) + (i - 1) * 9]], 1.6, '#FFFFFF', 'inkfine', 0); }
      emote('!', LX - 30, LY - 470, 24, popk(t, H2 + .1, 6), b - .1);
    }
    camEnd();
    caps(t);
    wipeIn(lt, VARW);
  }

  // ================= I · the song comes to Ram's embrace; "your story will blow my longing away" (Uttara 40.17–18) =================
  function shotLonging(t, lt, dur) {
    const g = t - I0, r = t - REACH, hk = ease(clamp((g - .6) / .4));
    lcam(lt);
    listenSet(t, 'kvH');
    h10Song(BX, BY, BRX, BRY, 1, 'sgH');
    glow(BX, BY, 200, '#FFE9A8', .35 + .15 * Math.sin(t * 3));
    ram(BX - 40, BY + 106, 5.7, { ...RM, boilKey: 'mnR', noShadow: true, hx: .4, lookX: .8, lean: 1.5 * hk, eyes: hk > .5 ? 'closed' : 'happy', mouth: 'smile', handR: hk > .5 ? [7, -15.4] : [5.4, -16], handL: hk > .5 ? [3.8, -12.2] : undefined, bendR: -1, bendL: -1 });
    hanuman(BX + 40, BY + 106, 5.7, { ...HN, boilKey: 'mnI', noShadow: true, hx: -.45, lookX: -.8, lean: -1.4 * hk, eyes: hk > .5 ? 'closed' : 'happy', mouth: 'smile', blush: .6, handL: hk > .5 ? [-5.6, -14] : undefined, handR: hk > .5 ? [-2.4, -12.4] : undefined, bendL: -1, bendR: 1, tailSway: t * 5 });
    if (hk > .9) hearts(BX, BY - 66, t, I0 + 1.1, 'hI0', 3, 10);
    // he goes still; his eyes fill; then he reaches up to it
    const ho = { ...HN, boilKey: 'hH', sit: 1, hx: -.35, lookX: -.7, lookY: -.8, eyes: r > 0 ? 'happy' : g > 1.0 ? 'teary' : 'wide', mouth: 'smile', blush: .7, htilt: .05 * Math.sin(t * 1.6), tailSway: t * 1.5,
      handR: g > 1.0 ? [.9, -14.6] : undefined, bendR: 1, handL: r > 0 ? [-6.2, -22.6 + .4 * Math.sin(t * 5)] : undefined, bendL: 1 };
    hanuman(LX, LY, LU, ho);
    if (g > 1.2) tearsOf(LX, LY, LU, ho, t, 'trI', .9);
    hearts(LX - 40, LY - 440, t, REACH + .2, 'hI', 3, 20);
    camEnd();
    caps(t);
    wipeOut(lt, dur, VARW);
  }

  // ================= J · and then he sings too: a verse of his own (Bhagavata 5.19.2) =================
  function shotOwn(t, lt, dur) {
    const g = t - J0, up = t >= RISE, s = t - SING, sg = s >= 0;
    camBegin(540, 1347 - lt * 2, 1.3 + .005 * lt + kick(t, SING, .03));
    h10Varsha(t, 'kv');
    choir(t, up ? 1 : 0, 1);
    glow(VX, 1440, 340, '#FFF2C0', .5 + .2 * clamp(s));
    const ahem = up && !sg;
    hanuman(VX, VY, VU, { ...HN, boilKey: 'hF', sit: up ? 0 : 1, eyes: sg ? 'closed' : ahem ? 'closed' : 'happy', mouth: sg ? sing(t, .7) : ahem ? 'flat' : 'smile', blush: .6, tailSway: t * (sg ? 5 : 3), dy: hop(t - RISE, .5, 9, 3),
      handR: sg ? [5.6, -15.4 + .5 * Math.sin(t * 4)] : ahem ? [1.3, -18.3] : undefined, bendR: sg ? -1 : 1, handL: sg ? [-5.6, -15.0 - .5 * Math.sin(t * 4)] : undefined, bendL: 1, puff: sg ? .4 : 0, htilt: sg ? .06 * Math.sin(t * 2.4) : 0 });
    if (sg) { notes(VX - 150, 1330, s, 'ntJ0', GOLDC, 3); notes(VX + 110, 1320, s + .4, 'ntJ1', GOLDC, 3); sparkleBurst(VX, 1380, 170, s * .6, 'spkJ', 8, ['#FFFFFF', GOLDC]); }
    camEnd();
    if (sg && s < .1) flash((1 - s / .1) * .3, '#FFF6D8');
    caps(t);
    wipeIn(lt, VARW);
    wipeOut(lt, dur, GROVEW);
  }

  // ================= K · "not birth, not beauty, not brains: only forest monkeys, and Ram made us his friends" (5.19.7) =================
  function shotFriends(t, lt, dur) {
    const g = t - K0, h = t - HUG, hug = h >= 0, hk = ease(clamp(h / .4));
    camBegin(540, 1392 - lt * 2, 1.3 + .005 * lt + .05 * hk);
    boilSeed('bgK'); paint(rectPts(-300, -600, W + 600, 3400), { wash: '#FBE3B8', ink: null });
    paint(ellPts(540, 1320, 800, 620, 26), { fill: '#FFF6DC', fillOp: 220, bleed: .3, tex: .4, ink: null });
    tree(120, 1740, 520, 'trK0', .15 * Math.sin(t * 1.2)); tree(960, 1740, 560, 'trK1', .15 * Math.sin(t * 1.2 + 1));
    paint(rectPts(-300, 1700, W + 600, 1400), { wash: '#B4D084', fill: '#86AE5E', fillOp: 60, tex: .5, ink: null });
    glow(540, 1420, 380, '#FFF2C0', .4 + .4 * hk);
    const shy = { eyes: 'sad', mouth: 'flat', lookY: .8 }, glad = { eyes: 'closed', mouth: 'smile', blush: .7 };
    // the forest folk: Sugriva, Hanuman, two small vanaras with leaves in their fur
    const so = { boilKey: 'sgK', seed: 21, hx: .4, lookX: .8, lean: 1.2 * hk, ...(hug ? glad : shy), bow: hug ? 0 : .12, tailSway: t * (hug ? 6 : 2), handR: hug ? [5.6, -14] : undefined, bendR: -1 };
    const ho = { ...HN, boilKey: 'hK', crown: false, hx: -.4, lookX: -.8, lean: -1.2 * hk, ...(hug ? glad : shy), bow: hug ? 0 : .12, tailSway: t * (hug ? 6 : 2), handL: hug ? [-5.6, -14] : undefined, bendL: 1 };
    sugriva(lerp(330, 375, hk), 1800, 12.3, so);
    hanuman(lerp(750, 705, hk), 1800, 12.3, ho);
    ram(540, 1795, 13.2, { ...RM, boilKey: 'rmK', eyes: hug ? 'closed' : 'happy', mouth: 'smile', blush: hug ? .5 : 0, handL: hug ? [-6.6, -15.2] : [-4.2, -12.6 + .3 * Math.sin(t * 3)], handR: hug ? [6.6, -15.2] : [4.2, -12.6 - .3 * Math.sin(t * 3)], bendL: 1, bendR: -1 });
    for (const [i, x0, x1, ph] of [[1, 185, 440, 0], [3, 895, 640, 1.2]]) {
      const x = lerp(x0, x1, hk), fl = x0 > 540;
      h8Vanara(x, 1850, 8, i, { boilKey: 'vnK' + i, seed: 5 + i, flip: fl, hx: fl ? -.4 : .4, lookX: fl ? -.8 : .8, lookY: hug ? -.6 : .6, eyes: hug ? 'happy' : i === 1 ? 'swirl' : 'sad', mouth: hug ? 'grin' : i === 1 ? 'O' : 'frown',
        handR: !hug && i === 1 ? [2.6, -23.4 + .5 * Math.sin(t * 9)] : hug ? [4.6, -15] : undefined, bendR: -1, tailSway: t * (hug ? 7 : 3) + ph, dy: hop(h - .1 * i, .5, 9, 2) });
    }
    if (hug) { sparkleBurst(540, 1470, 300, h * .6, 'spkK', 12, ['#FFFFFF', GOLDC]); hearts(540, 1300, t, HUG + .3, 'hK1', 3, 22); hearts(540, 1300, t, HUG + 1.5, 'hK2', 3, 22); }
    camEnd();
    if (hug && h < .12) flash((1 - h / .12) * .45, '#FFF6D8');
    caps(t);
    wipeIn(lt, GROVEW);
    wipeOut(lt, dur, PEACH);
  }

  // ================= L · "god or demon, monkey or human: let everyone love Ram" (5.19.8) =================
  function shotAll(t, lt, dur) {
    const g = t - L0;
    camBegin(540, 1250, 1.0 + .006 * lt);
    warmBack(t, 'wbL', 540, 1380);
    glow(540, 1120, 420, '#FFF2C0', .5);
    const up = { lookY: -.8, eyes: g > 2.2 ? 'happy' : 'normal', mouth: 'smile', blush: g > 2.2 ? .6 : .2 };
    const row = [
      [150, k => varuna(150, 1790, 14.5, { boilKey: 'dvL', pasha: false, ...up, dy: k })],
      [395, k => vibhishana(395, 1790, 15.5, { boilKey: 'vbL', ...up, dy: k })],
      [650, k => h8Vanara(650, 1790, 15, 0, { boilKey: 'vnL', seed: 9, ...up, tailSway: t * 4, dy: k })],
      [905, k => aarav(905, 1790, 14.5, { boilKey: 'aaL', pose: 'stand', ...up, mouth: g > 2.2 ? 'grin' : 'smile', dy: k })],
    ];
    row.forEach(([x, draw], i) => { const t0 = L0 + .25 + i * .32; if (t < t0) return; const a = t - t0; draw(-1.6 * (1 - easeOut(clamp(a / .25))) + hop(g - 2.2 - i * .1, .4, 8, 1.8)); if (a < .5) poof(x, 1560, 190, a / .5, 'pfL' + i); });
    row.forEach(([x], i) => hearts(x + 44, 1300 + (i === 3 ? 120 : i === 1 ? 60 : 0), t, L0 + 2.2 + i * .12, 'hL' + i, 1, 24));
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, NIGHTW);
  }

  // ================= M · an old prayer: wherever Ram's story is told, Hanuman is there, hands joined, eyes full of tears =================
  function shotHome(t, lt, dur) {
    const g = t - M0, s = t - SEEN, k = ease(clamp(s / .7));
    camBegin(540, 1345 - lt * 2, 1.2 + .005 * lt);
    h10Room(t, 'rmM');
    // the lamp on the shelf
    boilSeed('shM'); paint(rectPts(90, 1250, 190, 16), { wash: H10.wood, ink: H10.ink, sw: 1 }); diya(170, 1250, 20, 1, 'dyM');
    h10Bed(590, 1640, 430, 'bdM');
    // dadi tells the story; the child listens
    const dout = { boilKey: 'ddM', hx: .35, lookX: .7, eyes: blinkAt(t, M0 + 2.1) ? 'closed' : 'normal', mouth: talk(t, M0 + .2, M0 + 5.3, 'smile', 'open'), handR: [4.2, -13.6], handL: [1.2, -13.2], bendR: -1, bendL: 1 };
    dadi(250, 1800, 13, dout);
    h10Book(250 + 2.7 * 13, 1800 - 14.4 * 13, 50, 'bkM');
    aarav(540, 1640, 13, { boilKey: 'aaM', pose: 'sit', hx: -.4, lookX: -.8, eyes: g > 2.4 && g < 3.4 ? 'wide' : 'happy', mouth: g > 2.4 && g < 3.4 ? 'O' : 'smile', kick: Math.sin(t * 3), handL: [-1.6, -8.6], handR: [1.6, -8.6], blush: .3 });
    // and beside the bed, unseen: the one with joined hands
    if (k > .01) {
      glow(865, 1560, 320 * k, '#FFE9A8', .7 * k);
      if (k > .5) { const ho = { ...HN, boilKey: 'hM', sit: 1, pray: 1, hx: -.35, lookX: -.7, eyes: 'closed', mouth: 'smile', blush: .7, htilt: .05 * Math.sin(t * 2), tailSway: t * 2 }; hanuman(850, 1835, 12.5, ho); tearsOf(850, 1835, 12.5, ho, t, 'trM', .7); }
      if (s < .9) sparkleBurst(865, 1600, 240, s * .7, 'spkM', 10, ['#FFFFFF', GOLDC]);
      hearts(865, 1440, t, SEEN + 1.6, 'hM', 3, 16);
    }
    camEnd();
    caps(t);
    wipeIn(lt, NIGHTW);
    wipeOut(lt, dur, NIGHTW);
  }

  // ================= N · you just heard ten parts of it: guess who was listening with you =================
  function shotYou(t, lt, dur) {
    const g = t - N0, p = t - PEEKN, up = backOut(clamp(p / .45)), PX = 540, PT = 1170, PW = 400, PH = 640, u = 19;
    camBegin(540, 1180, 1.0 + .006 * lt);
    boilSeed('bgN'); paint(rectPts(-300, -600, W + 600, 3400), { wash: H10.wall, ink: null });
    paint(ellPts(540, 1400, 700, 700, 26), { fill: H10.wallLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
    glow(540, 1420, 520, '#FFD9A0', .35);
    // he comes up from behind the phone
    const HY = PT + 17.3 * u + (1 - up) * 12 * u;
    const ho = { ...HN, boilKey: 'hN', noShadow: true, tail: false, eyes: p > 1.2 ? 'heart' : p > .5 ? 'happy' : 'wide', mouth: p > .5 ? 'grin' : 'smile', blush: .7, htilt: .08 * Math.sin(t * 3),
      handR: p > .9 ? [6.4, -24.5 + .9 * Math.sin(t * 9)] : [5.6, -17.2], bendR: -1, handL: [-5.6, -17.2], bendL: 1 };
    if (p > 0) { glow(PX, PT - 60, 300, '#FFE9A8', .55 * clamp(p * 2)); hanuman(PX, HY, u, ho); }
    h10Phone(PX, PT, PW, PH, 'phN');
    // on the screen: this reel
    boilSeed('scN'); paint(rrPts(PX - 96, PT + 76, 192, 46, 23), { wash: HSK.orange, ink: null });
    letter('PART 10', PX, PT + 100, 34, HSK.cream, { ink: false, rot: 0 });
    for (const [yy, ww, c] of [[166, 250, '#8A7A8E'], [204, 300, GOLDC], [242, 210, '#8A7A8E']]) paint(rrPts(PX - ww / 2, PT + yy, ww, 20, 10), { wash: c, ink: null });
    hanuman(PX, PT + 560, 9.5, { ...HN, boilKey: 'hNs', sit: 1, noShadow: true, eyes: 'happy', mouth: 'smile', htilt: .06 * Math.sin(t * 2.4), ...EAR });
    // the hands holding it, and his fingers over its top edge
    for (const sd of [-1, 1]) { boilSeed('thN' + sd); paint(ellPts(PX + sd * (PW / 2 + 4), PT + PH - 130, 44, 78, 16, 0, sd * .25), { wash: '#C98B5F', fill: '#A0663F', fillOp: 40, ink: HSK.ink, sw: 1.2 }); }
    if (p > .15) for (const sd of p > .9 ? [-1] : [-1, 1]) { boilSeed('fgN' + sd); for (let i = 0; i < 3; i++) paint(ellPts(PX + sd * (118 + i * 24), PT + 8, 13, 22, 10), { wash: HNM.fur, ink: HSK.ink, sw: .8 }); }
    hearts(PX - 250, PT - 150, t, PEEKN + 1.4, 'hN', 3, 22);
    camEnd();
    caps(t);
    wipeIn(lt, NIGHTW);
    wipeOut(lt, dur, PEACH);
  }

  // ================= O · the ask: he is listening right now =================
  function shotAsk(t, lt, dur) {
    const g = t - O0;
    camBegin(540, 1180, 1.0 + .006 * lt);
    warmBack(t, 'wbO', 540, 1330);
    glow(540, 1440, 400, '#FFE9A8', .5);
    // little "Jai Shri Ram"s fly in to his ear: chips with a heart
    for (let i = 0; i < 4; i++) {
      if (g < .6 + ((1 - i / 4) % 1) * 2.4) continue;   // not sent yet
      const q = frac((g - .6) / 2.4 + i / 4);
      const x = lerp(1200, 760, q), y = 1400 - 150 * Math.sin(q * 2.4) + i * 26 - 40, a = Math.sin(q * Math.PI);
      boilSeed('chO' + i); paint(rrPts(x - 46 * a, y - 26 * a, 92 * a, 52 * a, 24 * a), { wash: '#FFFDF2', ink: HSK.ink, sw: 1 }); if (a > .4) paint(heartPts(x, y, 15 * a), { wash: '#F2557A', ink: null });
    }
    const beat = frac((g - .6) / .6);
    hanuman(540, 1815, 31, { ...HN, boilKey: 'hO', sit: 1, hx: .3, lookX: .8, eyes: g > 1.4 ? 'heart' : 'happy', mouth: 'grin', blush: .7, htilt: .1 + .05 * Math.sin(t * 2.4), tailSway: t * 5, dy: g > .9 ? -.25 * Math.exp(-beat * 5) : 0, ...EAR });
    hearts(300, 1180, t, O0 + 1.6, 'hO1', 3, 24); hearts(300, 1180, t, O0 + 3.2, 'hO2', 3, 24);
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, PEACH);
  }

  // ================= P · that was his story, in ten parts =================
  function shotTen(t, lt, dur) {
    const g = t - P0;
    camBegin(540, 1180, 1.0 + .006 * lt);
    warmBack(t, 'wbP', 540, 1330);
    for (let i = 0; i < 10; i++) { const k = clamp((g - .2 - i * .08) * 5), ang = Math.PI * .96 + (i + .5) / 10 * Math.PI * 1.08; h5Badge(520 + Math.cos(ang) * 400, 1390 + Math.sin(ang) * 400, 84, i + 1, k, 'bgP' + i); }
    balHanuman(350, 1820, 27, { boilKey: 'bhP', pose: 'stand', eyes: 'happy', mouth: 'grin', blush: .6, handR: [4.4, -11.5 + .8 * Math.sin(t * 9)], bendR: -1, tailSway: t * 1.4, dy: hop(g - .4, .5, 8, 1.4) });
    hanuman(700, 1820, 19.5, { ...HN, boilKey: 'hP', eyes: 'happy', mouth: 'grin', blush: .5, pray: g > 1.6 ? 1 : 0, handL: g <= 1.6 ? [-5, -22 + .8 * Math.sin(t * 9 + 1)] : undefined, bendL: 1, tailSway: t * 4, bow: g > 1.6 ? .12 : 0 });
    hearts(520, 1180, t, P0 + 1.2, 'hP', 3, 22);
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, PEACH);
  }
  function shotCard(t, lt, dur) { hsCard(t, CARDC); }

  shots([[0, shotHook], [B0, shotPromise], [C0, shotLeft], [D0, shotGrove], [E0, shotSing], [F0, shotVarsha], [G0, shotOne], [H0, shotLived], [I0, shotLonging], [J0, shotOwn], [K0, shotFriends],
    [L0, shotAll], [M0, shotHome], [N0, shotYou], [O0, shotAsk], [P0, shotTen], [CARD, shotCard]]);
})();
