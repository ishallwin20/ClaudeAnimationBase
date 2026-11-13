// hanu21.js: "8 BOONS. 8 SIDDHIS. 9 NIDHIS." (ad 90, Hanuman series Part 2.1, 88 s, Bangers captions, retro SFX, no
// voice). The Chalisa's "ashta siddhi nau nidhi ke data, as bar deen Janaki mata" (chaupai 31) taken apart: the eight
// boons of Part 2 are a shield (Valmiki Uttara 36.10–21: what cannot hurt him); the eight siddhis are powers (the
// popular shloka "anima mahima caiva garima laghima tatha…"; lists vary: Bhagavata 11.15.4–5 has no garima), and Valmiki
// shows three: the size of a cat (Sundara 2.49), huge like Meru for Sita (37.33–35), huge then the size of a thumb in
// Surasa's mouth (1.160–168), a mountain sinking under his feet (56.22–33); the nine nidhis are Kubera's treasures
// (Amarakosha 1.1.71). Twist: "ke data", the giver, and Sita gave him that boon (the Chalisa).
// STORYBOARD.md has the plan and the sources; sets are in hanu21_props.js (+ Parts 2 and 4's props, copied); the series
// kit is src/hanuman_series.js. All times are video time (t); tools/hanu21_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/hanu21_sfx.mjs)
  const LOOK = 1.2, SCRATCH = 2.6;
  const B0 = 4.4, C0 = 9.0, QM = 11.4, D0 = 13.4, BOLT = 14.0, ARROW = 15.0, MACE = 16.0, E0 = 17.8;
  const F1 = 22.6, SHRINK = 23.5, F2 = 26.8, GROW = 27.6, F3 = 31.0, SG = [31.4, 32.0, 32.6], THUMB = 33.3, INTO = 33.7, OUT = 34.3;
  const F4 = 35.6, PRESS = 36.3, SINK = 36.5, LEAP = 36.7, F5 = 40.0, F6 = 44.0, F7 = 48.6, PAIR = 2.2;
  const G0 = 53.2, H0 = 57.6, I0 = 62.4, K0 = 67.0, BLESS = 68.2, L0 = 71.8, M0 = 76.4, N0 = 80.8, CARD = 84.4;
  const CARDC = hsCardTimes(CARD);
  const SFILL = [SHRINK, GROW, PRESS, F5 + .6, F6 + .5, F6 + PAIR + .9, F7 + .5, F7 + PAIR + .6];   // each siddhi's slot fills
  const NFILL = [.4, .9, 1.4, 1.9, 2.4, 2.9, 3.4, 3.8, 4.2].map(d => H0 + d);                        // each nidhi's, with its name
  const ALLS = F7 + PAIR + 1.4;

  const GOLDC = '#F5C542', VIOC = '#C8B4FF';
  const popk = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const talk = (t, a, b, rest = 'smile', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const kick = (t, t0) => t > t0 ? .05 * Math.exp(-(t - t0) * 6) * Math.cos((t - t0) * 20) : 0;
  const shake = (t, t0, d, a) => (t > t0 && t < t0 + d) ? shakeXY(t, a * (1 - (t - t0) / d)) : [0, 0];
  const hop = (g, a = .3, f = 8, d = 1.6) => g > 0 ? -a * Math.abs(Math.sin(g * f)) * Math.exp(-g * d) : 0;
  const hearts = (x, y, t, t0, key, n = 3) => { if (t < t0) return; boilSeed(key); for (let i = 0; i < n; i++) { const a = t - t0 - i * .22; if (a < 0 || a > 1.6) continue; const px = x + (i - 1) * 46 + Math.sin(a * 5 + i) * 14, py = y - a * 150, s = 22 * backOut(clamp(a * 4)) * (1 - clamp((a - 1.1) / .5)); paint(heartPts(px, py, s), { wash: '#F2557A', ink: HSK.ink, sw: .8 }); } };
  const GOLDW = [GOLDC, '#F39A2E'], VIOW = [H21.violet, H21.violetLt], NIGHTW = [H4.night, H4.nightLo], GROVEW = [H4.grove, H4.ashokaDk], SKYW = ['#8EC4EE', '#FFE9BE'], GREENW = [H21.green, H21.greenLt], PEACH = [HSK.marigold, HSK.petal];

  // ---- the cast's fixed options
  const HN = { boilKey: 'hanu', seed: 60, gada: 0 };
  const sita = (x, y, u, o) => parvati(x, y, u, { boilKey: 'sita', crown: false, pal: SITA_PAL, ...SITA_SKIN, ...o });
  const rise = (key, x0 = -100, x1 = 760, dy = 0) => { boilSeed(key); const w = x1 - x0; paint([[x0, 2400], [x0, 1790 + dy], [x0 + w * .25, 1745 + dy], [x0 + w * .55, 1730 + dy], [x0 + w * .85, 1748 + dy], [x1, 1800 + dy], [x1, 2400]], { wash: '#1E2A3A', fill: '#162030', fillOp: 50, tex: .4, ink: null, curv: .4 }); for (let i = 0; i < 6; i++) inkLine([[x0 + 120 + i * 95, 1752 + dy - 8 * Math.sin(i)], [x0 + 112 + i * 95, 1716 + dy - 8 * Math.sin(i)]], 1.6, '#3E6A4A', 'inkfine', .4); };

  // ---- every caption: [text, y, t0, life, size, colour]
  const two = (a, b, t0, life, sa = 72, sb = 76, gold = 1) => [[a, 470, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 470 + (sa + sb) * .68, t0 + .35, life - .35, sb, gold === 1 ? GOLDC : undefined]];
  const three = (a, b, c, t0, life, s = [70, 70, 70], gold = [0, 0, 1], d = [.1, .35, .6]) => { const Y = [462, 462 + (s[0] + s[1]) * .66, 462 + (s[0] + s[1]) * .66 + (s[1] + s[2]) * .66]; return [a, b, c].map((x, i) => [x, Y[i], t0 + d[i], life - d[i], s[i], gold[i] ? GOLDC : undefined]); };
  const srcLine = (txt, y, t0, life) => [txt, y, t0 + .7, life - .7, 36, '#FFFFFF'];
  const CAPS = [
    ['8 BOONS. 8 SIDDHIS. 9 NIDHIS.', 480, -1, B0 + .85, 80], ['MOST PEOPLE MIX THEM UP!', 596, -1, B0 + .85, 96, GOLDC],
    ['IN THE CHALISA WE SING:', 470, B0 + .1, 4.4, 70], ['ASHT SIDDHI NAU NIDHI KE DATA', 742, B0 + 1.2, 3.3, 60],
    ...two('AS A BABY, HE GOT 8 BOONS FROM 8 GODS.', 'ARE THOSE THE 8 SIDDHIS?', C0, 4.3, 56, 78),
    ...two('NO. THE 8 BOONS ARE A SHIELD:', 'NOTHING CAN HURT HIM.', D0, 4.3, 66, 90), srcLine('VALMIKI · UTTARA KANDA 36', 686, D0, 4.3),
    ...two('THE 8 SIDDHIS ARE POWERS', 'HE CAN USE, LIKE A YOGI.', E0, 4.7, 76, 76),
    ...two('1 · ANIMA: BECOME TINY', 'HE ENTERED LANKA THE SIZE OF A CAT!', F1, 4.1, 84, 58, 0), srcLine('VALMIKI · SUNDARA 2.49', 676, F1, 4.1),
    ...two('2 · MAHIMA: BECOME HUGE', 'FOR SITA, HE GREW LIKE MOUNT MERU!', F2, 4.1, 84, 58, 0), srcLine('VALMIKI · SUNDARA 37.35', 676, F2, 4.1),
    ...two('AGAINST SURASA HE USED BOTH:', 'HUGE… THEN THE SIZE OF A THUMB!', F3, 4.5, 64, 64), srcLine('VALMIKI · SUNDARA 1.166–168', 668, F3, 4.5),
    ...two('3 · GARIMA: BECOME HEAVY', 'A MOUNTAIN SANK UNDER HIS FEET!', F4, 4.3, 84, 62, 0), srcLine('VALMIKI · SUNDARA 56.26–33', 680, F4, 4.3),
    ...two('4 · LAGHIMA: BECOME LIGHT', 'AS LIGHT AS A FEATHER.', F5, 3.9, 84, 78, 0),
    ['5 · PRAPTI', 462, F6 + .1, 4.4, 84, GOLDC], ['REACH ANYTHING, ANYWHERE', 548, F6 + .3, 4.2, 60], ['6 · PRAKAMYA', 652, F6 + PAIR, 2.3, 84, GOLDC], ['ANY WISH COMES TRUE', 738, F6 + PAIR + .2, 2.1, 60],
    ['7 · ISHITVA', 462, F7 + .1, 4.4, 84, GOLDC], ['LORDSHIP OVER ALL', 548, F7 + .3, 4.2, 60], ['8 · VASHITVA', 652, F7 + PAIR, 2.3, 84, GOLDC], ['EVERYTHING OBEYS HIM', 738, F7 + PAIR + .2, 2.1, 60],
    ...two('THE 9 NIDHIS ARE TREASURES,', 'AND THEY BELONG TO KUBERA.', G0, 4.3, 70, 70), srcLine('AMARAKOSHA 1.1.71', 672, G0, 4.3),
    ...three('PADMA, MAHAPADMA, SHANKHA,', 'MAKARA, KACHCHHAPA, MUKUNDA,', 'KUNDA, NILA, KHARVA.', H0, 4.7, [62, 58, 70], [0, 0, 1], [.1, 1.6, 3.1]),
    ['NOW HEAR THE LINE AGAIN:', 470, I0 + .1, 4.4, 70], ['"…KE DATA": THE GIVER!', 742, I0 + 1.4, 3.1, 92, GOLDC],
    ...three('AND WHO GAVE HIM THAT BOON?', '"AS BAR DEEN JANAKI MATA."', 'SITA MATA HERSELF.', K0, 4.7, [64, 66, 84], [0, 0, 1], [.1, .5, 1.6]),
    ...three('BOONS: HIS SHIELD.', 'SIDDHIS: HIS POWERS.', 'NIDHIS: HIS GIFTS TO GIVE.', L0, 4.5, [80, 80, 72], [0, 0, 1], [.1, 1.2, 2.4]),
    ...three('WHICH CHALISA LINE DO YOU', 'KNOW BY HEART?', 'COMMENT IT!', M0, 4.3, [70, 96, 80], [0, 1, 0], [.1, .35, .9]),
    ['NEXT: HANUMAN OFFERED', 466, N0 + .1, 3.5, 66], ['TO CARRY SITA HOME.', 552, N0 + .25, 3.35, 66], ['SHE SAID NO.', 666, N0 + .5, 3.1, 112, GOLDC],
  ];
  // the series marks: the part pill and the source line show in the opening only, then fade out (owner, 11 Nov)
  const MARKS = C0 - .2;
  const caps = t => {
    for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color });
    if (t < MARKS && t > B0) { hsPill('2.1', (1 - seg(t, MARKS - .3, MARKS)) * clamp((t - B0) * 4)); hsSource('HANUMAN CHALISA', t - B0 - .3, MARKS - B0 - .3); }
  };
  // the rows: Part 2's boons (C, D), the siddhis (E–F7), the nidhis (G–H)
  const rows = t => {
    if (t >= C0 && t < E0) boonSlots(t, i => (t < C0 + .3 + i * .08 ? null : { k: (t - C0 - .3 - i * .08) * 4, hop: t > D0 ? 12 * Math.max(0, Math.sin((t - D0) * 5 - i * .6)) * (1 - seg(t, D0 + 1, D0 + 1.5)) : 0 }), clamp((t - C0) * 4) * (1 - seg(t, E0 - .3, E0)));
    if (t >= E0 + 1.0 && t < G0) slotRow(8, 1400, siddhiIcon, i => {
      if (t < SFILL[i]) return null;
      const s = { k: (t - SFILL[i]) * 4, hop: 0 };
      if (t > F3 + .3 && t < F4 && i < 2) s.hop = 16 * Math.max(0, Math.sin((t - F3) * 5 - i * 1.2));
      if (t > ALLS) s.hop = 16 * Math.max(0, Math.sin((t - ALLS) * 6 - i * .7));
      return s;
    }, clamp((t - E0 - 1.0) * 3) * (1 - seg(t, G0 - .3, G0)), { col: VIOC, ring: '#F4EEFF' });
    if (t >= G0 + 1.2 && t < I0) slotRow(9, 1420, nidhiIcon, i => (t < NFILL[i] ? null : { k: (t - NFILL[i]) * 4, hop: t > H0 + 4.6 ? 14 * Math.max(0, Math.sin((t - H0 - 4.6) * 6 - i * .6)) : 0 }), clamp((t - G0 - 1.2) * 3) * (1 - seg(t, I0 - .3, I0)), { r: 40, x0: 98, dx: 98, col: H21.greenLt, ring: '#EEFFF4' });
  };
  const after = t => { rows(t); caps(t); };

  // ================= A · the hook: Hanuman and three badges, 8 · 8 · 9 =================
  const BADGE = [[190, 1170], [890, 1050], [890, 1340]];
  function shotHook(t, lt, dur) {
    camBegin(540, 1010 - lt * 4, 1.0 + .012 * lt);
    warmBack(t, 'wbA', 540, 1150);
    const look = t < LOOK ? -1 : t < LOOK + .5 ? 0 : t < LOOK + .95 ? 1 : t < SCRATCH ? 2 : -1;
    BADGE.forEach(([x, y], i) => h21Badge(x, y + 10 * Math.sin(t * 2.2 + i * 2), 96 * (1 + (look === i ? .08 : 0)), i, 1, t, 'hkb' + i));
    const sc = t >= SCRATCH, g = t - SCRATCH;
    const lx = look === 0 ? -1 : look >= 1 ? 1 : 0, ly = look === 0 ? .1 : look === 1 ? -.5 : look === 2 ? .5 : 0;
    hanuman(540, 1700, 29, { ...HN, eyes: sc ? 'look' : look >= 0 ? 'wide' : 'happy', lookX: sc ? .3 : lx, lookY: sc ? -.7 : ly, hx: sc ? .1 : lx * .45, mouth: sc ? 'wobble' : look >= 0 ? 'O' : 'smile', blush: .3,
      handR: sc ? [3.0, -24.2 + .4 * Math.sin(t * 22)] : [3.4, -10.6], bendR: sc ? 1.3 : 1, handL: [-3.4, -10.6], bendL: 1, htilt: sc ? .1 : 0, tailSway: t * 2,
      emote: sc ? '?' : null, emoteK: popk(t, SCRATCH + .1, 6), emoteAge: g });
    camEnd();
    caps(t);
    wipeOut(lt, dur, GOLDW);
  }

  // ================= B · the Chalisa line: he sits by a diya, singing =================
  const singer = (t, t0, key) => {
    hanuman(540, 1720, 27, { ...HN, boilKey: key, sit: 1, pray: 1, bow: .05, eyes: 'closed', mouth: talk(t, t0 + .4, t0 + 99, 'smile', 'open'), blush: .4, tailSway: t * 1.4, dy: -.06 * Math.sin(t * 3) });
    diya(830, 1730, 42, 1, key + 'd');
    notes(700, 1180, (t - t0 - .4) % 2.4, key + 'n', GOLDC, 3);
  };
  function shotChalisa(t, lt, dur) {
    camBegin(540, 1060 - lt * 4, 1.0 + .01 * lt);
    warmBack(t, 'wbB', 540, 1250);
    singer(t, B0, 'hsB');
    camEnd();
    rkVerse(['अष्ट सिद्धि नौ निधि के दाता'], 470, 606, 72, t - B0 - .6, { color: GOLDC });
    caps(t);
    wipeIn(lt, GOLDW);
    wipeOut(lt, dur, GOLDW);
  }

  // ================= C · baby Hanuman's eight boons: are those the siddhis? =================
  const BX = 540, BY = 1440, BU = 38;
  const baby = (t, o) => { cloudPuff(BX, BY + 16, 230, 'babycloud', 255, '#FFFFFF', '#F0DCC8'); balHanuman(BX, BY, BU, { pose: 'sit', boilKey: 'baby', seed: 3, noShadow: true, tailSway: t * 1.6, ...o }); };
  function shotBabyQ(t, lt, dur) {
    camBegin(540, 1120 - lt * 3, 1.0 + .01 * lt);
    h2Stage(t, '#FFD98A', 'sgC');
    const q = t >= QM, g = t - QM;
    const o = { eyes: q ? 'wide' : blinkAt(t, C0 + 1.3) ? 'closed' : 'sparkle', mouth: q ? 'cat' : 'grin', blush: q ? 0 : .6, glowK: .5, lookX: q ? .4 : 0, lookY: q ? -.6 : 0, hx: q ? .3 : 0, htilt: q ? .12 : 0 };
    baby(t, o);
    if (q) { const h = bhHead(BX, BY, BU, o); boilSeed('cq'); emote('?', h[0] + 170, h[1] - 170, 50, popk(t, QM + .05, 6), g); }
    camEnd();
    after(t);
    wipeIn(lt, GOLDW);
  }
  // ================= D · the boons are a shield: a bolt, an arrow and a mace bounce off =================
  function shotShield(t, lt, dur) {
    const sh = shake(t, BOLT, .3, 10);
    camBegin(540 + sh[0], 1120 - lt * 3 + sh[1], 1.0 + .01 * lt + kick(t, BOLT) + kick(t, MACE));
    h2Stage(t, '#FFD98A', 'sgC');
    const hit = [BOLT, ARROW, MACE].map(h => t - h), near = hit.some(g => g > -.15 && g < .4);
    const o = { eyes: near ? 'squeeze' : 'happy', mouth: near ? 'O' : 'grin', blush: .6, glowK: .5, dy: hop(Math.max(...hit.filter(g => g > 0).concat([-1])) - .1, .25, 9, 2) };
    baby(t, o);
    const c = bhBelly(BX, BY, BU, o), R = 300;
    h21Shield(c[0], c[1] - 60, R, clamp((t - D0) * 3), t, 'shD');
    // the bolt, from above
    { const g = hit[0], k = clamp((g + .4) / .4), back = clamp(g / .6), x = c[0] + 260 * easeOut(back), y = back > 0 ? c[1] - 60 - R - 420 * easeOut(back) : lerp(c[1] - 900, c[1] - 60 - R, easeIn(k));
      if (g > -.4 && back < 1) { push(); translate(x, y); rotate(back * 5); h2Bolt(0, 0, 170, 'dbolt'); pop(); glow(x, y, 120, '#FFF0A0', .6); }
      if (g > 0) sparkleBurst(c[0], c[1] - 60 - R, 170, g, 'dboltb', 8, ['#FFFFFF', '#FFE27A']); }
    // the arrow, from the right
    { const g = hit[1], k = clamp((g + .35) / .35), back = clamp(g / .8), tx = c[0] + R, ty = c[1] - 100;
      const x = back > 0 ? tx + 200 * easeOut(back) : lerp(1300, tx, easeIn(k)), y = ty - (back > 0 ? 160 * Math.sin(back * Math.PI) - 200 * back * back : 0);
      if (g > -.35 && back < 1) h2Blade(x + 80, y, 80, Math.PI + back * 5, back > 0 ? 1 : 0, 1, 'darrow');
      if (g > 0) sparkleBurst(tx, ty, 140, g, 'darrowb', 8, ['#FFFFFF', '#FFE27A']); }
    // the mace, from the left
    { const g = hit[2], k = clamp((g + .35) / .35), back = clamp(g / .8), tx = c[0] - R, ty = c[1] - 40;
      const x = back > 0 ? tx - 220 * easeOut(back) : lerp(-260, tx, easeIn(k)), y = ty - (back > 0 ? 200 * Math.sin(back * Math.PI) - 260 * back * back : 0);
      if (g > -.35 && back < 1) { push(); translate(x - 30, y); rotate(-1.6 - back * 5); boilSeed('dmace'); gada(24, 1.2, 0); pop(); }
      if (g > 0) sparkleBurst(tx, ty, 160, g, 'dmaceb', 8, ['#FFFFFF', '#FFE27A']); }
    camEnd();
    after(t);
    wipeOut(lt, dur, VIOW);
  }

  // ================= E · the siddhis: powers, like a yogi's =================
  function shotYogi(t, lt, dur) {
    camBegin(540, 1180 - lt * 4, 1.0 + .012 * lt);
    h2Stage(t, H21.violet, 'sgE');
    const g = t - E0, au = .5 + .5 * clamp(g - .5);
    glow(540, 1420, 420 * au, VIOC, .5); glow(540, 1420, 700 * au, H21.violet, .25);
    boilSeed('erays'); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * .3, r0 = 300, r1 = 300 + 60 * au + 20 * Math.sin(t * 4 + i); inkLine([[540 + Math.cos(a) * r0, 1420 + Math.sin(a) * r0 * .9], [540 + Math.cos(a) * r1, 1420 + Math.sin(a) * r1 * .9]], 3, '#FFFFFF', 'inkfine', 0); }
    hanuman(540, 1740, 26, { ...HN, boilKey: 'hyE', sit: 1, mudra: 1, eyes: 'closed', mouth: 'smile', tailSway: t * 1, dy: -.1 * Math.sin(t * 2) });
    camEnd();
    rkVerse(['अणिमा महिमा चैव गरिमा लघिमा तथा ।', 'प्राप्तिः प्राकाम्यमीशित्वं वशित्वं चाष्टसिद्धयः ॥'], 470, 700, 40, t - E0 - 1.0, { color: '#FFFFFF', stagger: .4 });
    after(t);
    if (t > E0 + 1.6) letter('THE POPULAR SHLOKA · LISTS VARY', 470, 836, 30, '#FFFFFF', { screen: true, stroke: HSK.ink, sw: .2, ink: false, rot: 0, alpha: clamp((t - E0 - 1.6) * 3) * (1 - seg(t, F1 - .3, F1)) });
    wipeIn(lt, VIOW);
    wipeOut(lt, dur, NIGHTW);
  }

  // ================= F1 · anima: the size of a cat, on Lanka's wall (Sundara 2.49) =================
  const WY = 1640;
  function shotAnima(t, lt, dur) {
    camBegin(540, 1290, 1.12 + .008 * lt);
    h4Wall(t, 'wF');
    const g = t - SHRINK, small = g > 0, k = easeOut(clamp(g / .3));
    const walk = seg(t, SHRINK + 1.1, F2 - .15), x = small ? lerp(430, 1040, ease(walk)) : 430;
    const u = small ? lerp(24, 5.3, k) : 24;
    const catLook = small ? clamp((x - 700) / 200, -1, 1) : -.6;
    h21Cat(720, WY, 160, t, 'catF', catLook);
    if (small && g > .5 && g < 1.4) { boilSeed('catq'); emote('?', 760, WY - 230, 34, popk(t, SHRINK + .5, 6), g - .5); }
    hanuman(x, WY, u, { ...HN, boilKey: 'haF', eyes: small ? (walk > 0 ? 'look' : 'wide') : 'determined', mouth: small ? (walk > 0 ? 'flat' : 'O') : 'smile', lookX: small ? .8 : .3, hx: small ? .4 : .1,
      walk: walk > 0 && walk < 1 ? t * 1.6 : undefined, dy: walk > 0 && walk < 1 ? -.25 * Math.abs(Math.sin(t * 7)) : 0, handL: small ? [-1.2, -18.8] : [-4.6, -13], handR: small ? [2.2, -14] : [4.6, -13], bendL: small ? .5 : -1, bendR: small ? .5 : -1, tailSway: t * 2 });
    if (g > 0) poof(430, WY - 300 * (1 - k * .8), 260, g / .5, 'pfF');
    camEnd();
    after(t);
    wipeIn(lt, NIGHTW);
    wipeOut(lt, dur, GROVEW);
  }

  // ================= F2 · mahima: he grows like Meru for Sita (Sundara 37.33–35) =================
  function shotMahima(t, lt, dur) {
    const g = t - GROW, k = easeOut(clamp(g / 1.6)), sh = shake(t, GROW, 1.6, 6);
    camBegin(540 + sh[0], 1180 + sh[1], 1.0 + .006 * lt);
    h4Grove(t, 'gF2', 140, 720);
    if (g > 0) { glow(740, 1300, 300 + 500 * k, '#FFB050', .45 * k); glow(740, 1200, 900 * k, '#FFE08A', .25 * k); }
    sita(230, 1760, 14, { boilKey: 'sitaF2', eyes: g > .4 ? 'wide' : 'normal', mouth: g > .4 ? 'O' : 'smile', lookX: .8, lookY: g > .4 ? -.8 * k : 0, hx: .3 });
    rise('riseF2', -150, 480, -40);
    const u = lerp(5.5, 24.5, k);
    hanuman(740, 1730, u, { ...HN, boilKey: 'haF2', eyes: g > 0 ? 'happy' : 'normal', mouth: g > 0 ? 'grin' : 'smile', lookX: -.6, hx: -.3, puff: .5 * k, handL: [-5, -13], handR: [5, -13], bendL: -1, bendR: -1, tailSway: t * 2, blush: .3 });
    if (g > 0 && g < 1.6) { boilSeed('f2sp'); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + g * 2, r = 200 + 400 * k; paint(starPts(740 + Math.cos(a) * r, 1300 + Math.sin(a) * r * .7, 16, .3, 4), { wash: '#FFFFFF', washOp: 230, ink: null }); } }
    camEnd();
    after(t);
    wipeIn(lt, GROVEW);
    wipeOut(lt, dur, SKYW);
  }

  // ================= F3 · Surasa: he grows as her mouth grows, then the size of a thumb, in and out (1.160–171) =================
  function shotSurasa(t, lt, dur) {
    camBegin(540, 1170, 1.0 + .006 * lt);
    h21Sea(t, 'sF3', 1560);
    const stage = SG.reduce((n, s, i) => n + easeOut(clamp((t - s) / .3)), 0);   // her mouth: 0..3
    const hst = SG.reduce((n, s) => n + easeOut(clamp((t - s - .3) / .3)), 0);   // his size: 0..3
    const out = t > OUT, closeK = ease(seg(t, OUT + .3, OUT + .8));
    const S = 130 + 22 * stage, open = (.3 + .23 * stage) * (1 - closeK);
    const sx = 770, sy = 1760;
    h21Surasa(sx, sy, S, open, t, { smile: closeK > .9, happy: closeK > .9, look: -1, key: 'surF3' });
    // her mouth's centre, for the zip
    const hx = sx + Math.sin(t * 1.4) * S * .06, hy = sy - S * 2.2, mouthC = [hx, hy + S * .2 + S * (.15 + 1.1 * open) * .3];
    const thumb = t > THUMB, inside = t > INTO + .3 && !out;
    let x = 250, y = 1500, u = 10 + 4 * hst;
    if (thumb) {
      u = lerp(u, 2.2, easeOut(clamp((t - THUMB) / .2)));
      const z = ease(seg(t, INTO, INTO + .3)); x = lerp(250, mouthC[0], z); y = lerp(1500, mouthC[1] + 30, z);
    }
    if (out) { const z = easeOut(seg(t, OUT, OUT + .5)); x = lerp(mouthC[0], 330, z); y = lerp(hy - S * 1.3, 1210, z) - 160 * Math.sin(z * Math.PI); u = lerp(2.2, 9, easeOut(seg(t, OUT + .3, OUT + .8))); }
    if (!inside) hanuman(x, y, u, { ...HN, boilKey: 'haF3', noShadow: true, rot: thumb && !out ? .6 : .18, eyes: out ? 'happy' : thumb ? 'determined' : 'angry', mouth: out ? 'grin' : thumb ? 'flat' : 'shout',
      handL: out ? [-6.2, -24] : [-4.4, -21], handR: out ? [3.4, -12.6] : [5.4, -22], bendL: -.3, bendR: -.3, tailSway: t * 4, puff: thumb ? 0 : .5 * hst / 3 });
    for (let i = 0; i < 3; i++) { const a = t - SG[i] - .3; if (a > 0 && a < .6) sparkleBurst(250, 1500 - (10 + 4 * (i + 1)) * 14, 200 + 60 * i, a, 'f3g' + i, 8, ['#FFFFFF', GOLDC]); }
    if (thumb) poof(250, 1500 - 160, 220, (t - THUMB) / .5, 'f3pf');
    if (out) sparkleBurst(mouthC[0], hy - S * 1.3, 160, t - OUT, 'f3out', 8, ['#FFFFFF', GOLDC]);
    if (t > INTO && t < INTO + .5) { boilSeed('zipin'); for (let i = 0; i < 4; i++) inkLine([[mouthC[0] - 260 + i * 40, mouthC[1] + 30 - i * 14], [mouthC[0] - 60, mouthC[1] + 30]], 2.4, '#FFFFFF', 'inkfine', 0); }
    camEnd();
    after(t);
    wipeIn(lt, SKYW);
  }

  // ================= F4 · garima: Mount Arishta sinks into the earth under his feet (56.22–33) =================
  function shotGarima(t, lt, dur) {
    const sh = shake(t, PRESS, 2.4, 14);
    camBegin(540 + sh[0], 1150 + sh[1], 1.0 + .006 * lt + kick(t, PRESS));
    const sink = ease(seg(t, SINK, SINK + 2.0));
    const PY = 1250;
    h21Mount(t, sink, 'mF4', 540, PY);
    const crouch = ease(seg(t, F4 + .2, PRESS)), lp = t - LEAP;
    if (lp < 0) {
      const tk = take(t, PRESS, .5);
      hanuman(540, PY + 6, 11, { ...HN, boilKey: 'haF4', bow: .25 * crouch, sq: .12 * crouch + tk.sq, dy: .5 * crouch + tk.dy, eyes: 'determined', mouth: crouch > .5 ? 'flat' : 'smile', puff: .4, handL: [-5, -13], handR: [5, -13], bendL: -1, bendR: -1, tailSway: t * 3 });
    } else {
      const z = easeOut(clamp(lp / 1.4));
      hanuman(lerp(540, 1180, z), PY - 900 * z + 300 * z * z, 11 * (1 - .5 * z), { ...HN, boilKey: 'haF4', noShadow: true, rot: .5, eyes: 'happy', mouth: 'grin', handL: [-3, -24], handR: [6.6, -20], bendL: -.4, bendR: -.4, tailSway: t * 5 });
    }
    if (t > PRESS) { boilSeed('f4chips'); for (let i = 0; i < 8; i++) { const a = t - PRESS, d = a * (300 + 200 * hash(i)), an = -Math.PI / 2 + (hash(i * 3) - .5) * 2.4; if (a < 1.2) paint(rectPts(540 + Math.cos(an) * d - 10, PY + Math.sin(an) * d + 600 * a * a - 10, 20, 16), { wash: H21.rockDk, ink: H21.ink, sw: .6 }); } }
    for (let i = 0; i < 4; i++) poof(140 + i * 270, 1700, 230, (t - SINK - .2 - i * .25) / .9, 'f4dust' + i, ['#D8C8B0', '#B8A890']);
    camEnd();
    after(t);
    wipeOut(lt, dur, SKYW);
  }

  // ================= F5 · laghima: as light as a feather =================
  function shotLaghima(t, lt, dur) {
    camBegin(540, 1150, 1.0 + .01 * lt);
    h2Sky(t, 110, 'skF5');
    const fx = 540 + 40 * Math.sin(t * .9), fy = 1460 + 26 * Math.sin(t * 1.6), fr = -.08 + .06 * Math.sin(t * 1.6 + 1);
    hanuman(fx, fy - 6, 13.5, { ...HN, boilKey: 'haF5', noShadow: true, rot: fr * .6, eyes: 'closed', mouth: 'smile', blush: .4, handL: [-7.2, -15.6 + .6 * Math.sin(t * 2)], handR: [7.2, -15.6 - .6 * Math.sin(t * 2)], bendL: .2, bendR: .2, tailSway: t * 1.2 });
    h21Feather(fx, fy + 6, 190, fr, 'feF5');
    boilSeed('f5p'); for (let i = 0; i < 3; i++) { const a = (t * .5 + i / 3) % 1; h21Feather(160 + i * 380 + 30 * Math.sin(t + i), 1900 - a * 1300, 34, t + i, 'fem' + i); }
    camEnd();
    after(t);
    wipeIn(lt, SKYW);
    wipeOut(lt, dur, VIOW);
  }

  // ================= F6, F7 · prapti and prakamya; ishitva and vashitva =================
  const HX6 = 540, HY6 = 1720, HU6 = 22;
  function shotPowers(t, lt, dur) {
    const second = t >= F7, b = t - (second ? F7 : F6), p2 = b >= PAIR;
    camBegin(540, 1200, 1.0 + .006 * lt);
    h2Stage(t, H21.violet, second ? 'sgF7' : 'sgF6');
    glow(HX6, 1400, 420, VIOC, .45);
    let o = { ...HN, boilKey: 'haF6', eyes: 'happy', mouth: 'smile', tailSway: t * 2, handL: [-3.4, -10.6], handR: [3.4, -10.6], bendL: 1, bendR: 1 };
    if (!second && !p2) {   // prapti: he reaches up and a star drops into his hand
      const up = ease(seg(b, .3, .6)), got = b > .95;
      o = { ...o, eyes: got ? 'sparkle' : 'look', lookX: .4, lookY: -1, hx: .2, mouth: got ? 'grin' : 'O', handR: [lerp(3.4, 4.4, up), lerp(-10.6, -26.4, up)], bendR: lerp(1, -.2, up) };
    } else if (!second) {   // prakamya: he wishes, and a laddoo appears in his hand
      const got = b > PAIR + .9;
      o = { ...o, eyes: got ? 'heart' : 'closed', mouth: got ? 'grin' : 'smile', handR: [4.4, -15.4], bendR: 1, handL: [-3.4, -10.6], blush: got ? .8 : .3, dy: got ? hop(b - PAIR - .9, .3, 8, 1.4) : 0 };
    } else if (!p2) {   // ishitva: a crown of light
      o = { ...o, puff: ease(seg(b, .3, .8)), eyes: 'happy', mouth: 'smug', handL: [-5, -13], handR: [5, -13], bendL: -1, bendR: -1 };
    } else {   // vashitva: he points and the wind turns
      const pt = b > PAIR + .5;
      o = { ...o, eyes: pt ? 'happy' : 'look', lookX: -.8, hx: -.4, mouth: pt ? 'grin' : 'flat', handL: pt ? [-8.6, -18.6] : [-3.4, -10.6], bendL: pt ? -.2 : 1, tailSway: t * 6 };
    }
    if (second && p2) { const turn = clamp((b - PAIR - .5) / .3); h2WindLines(turn > 0 ? -t : t, 1, 900, 1700, 'wlF7', 9); }
    if (second && !p2) { const k = ease(seg(b, .3, .8)); if (k > 0) { boilSeed('crownL'); const [cx, cy] = naradaHead(HX6, HY6, HU6, o); glow(cx, cy - 80, 300 * k, '#FFE08A', .5 * k); for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * .3, r0 = 140, r1 = 140 + 110 * k * (1 + .15 * Math.sin(t * 6 + i)); inkLine([[cx + Math.cos(a) * r0, cy - 40 + Math.sin(a) * r0], [cx + Math.cos(a) * r1, cy - 40 + Math.sin(a) * r1]], 6, GOLDC, 'ink', 0); } } }
    hanuman(HX6, HY6, HU6, o);
    if (!second && !p2) {
      const hand = naradaHand(HX6, HY6, HU6, o, 1), z = easeIn(clamp((b - .3) / .65));
      if (b > .3) { boilSeed('f6star'); const sx = lerp(hand[0] + 60, hand[0], z), sy = lerp(700, hand[1] - 10, z); glow(sx, sy, 120, '#FFF0A0', .6); paint(starPts(sx, sy, 46, .45, 5, t * 3 * (1 - z)), { wash: '#FFD24A', ink: HSK.ink, sw: 1 }); }
      if (b > .95) sparkleBurst(hand[0], hand[1] - 20, 160, b - .95, 'f6sp', 8, ['#FFFFFF', GOLDC]);
    }
    if (!second && p2) {
      const hd = naradaHead(HX6, HY6, HU6, o), bk = popk(t, F6 + PAIR + .2, 5) * (1 - seg(b, PAIR + .9, PAIR + 1.1));
      h4Bubble(hd[0] + 230, hd[1] - 230, 110, 90, hd[0] + 80, hd[1] - 80, bk, 'f6bub');
      if (bk > .9) h21Laddoo(hd[0] + 230, hd[1] - 230, 54, 'f6ldb');
      if (b > PAIR + .9) { const hand = naradaHand(HX6, HY6, HU6, o, 1); h21Laddoo(hand[0] + 6, hand[1] - 44, 50 * popk(t, F6 + PAIR + .9, 5), 'f6ld'); hearts(hd[0], hd[1] - 180, t, F6 + PAIR + 1.1, 'f6h'); poof(hand[0], hand[1] - 40, 140, (b - PAIR - .9) / .5, 'f6pf'); }
    }
    camEnd();
    after(t);
    if (!second) wipeIn(lt, VIOW);
    if (second) wipeOut(lt, dur, GREENW);
  }

  // ================= G, H · the nine nidhis: Kubera's treasures (Amarakosha 1.1.71) =================
  const KX = 540, KY = 1690, KU = 21;
  const treasures = (t, front) => {
    for (let i = 0; i < 9; i++) {
      if (t > NFILL[i]) continue;
      const a = i / 9 * TAU + t * .9; if ((Math.sin(a) >= 0) !== front) continue;
      const x = KX + Math.cos(a) * 360, y = 1330 + Math.sin(a) * 130 + 8 * Math.sin(t * 3 + i), s = 1 + .16 * Math.sin(a);
      glow(x, y, 110, NID_COL[i], .5);
      boilSeed('nt' + i); paint(ellPts(x, y, 48 * s, 48 * s, 20), { wash: '#FFF5E2', ink: HSK.ink, sw: 1.2 });
      nidhiIcon(i, x, y, 28 * s);
    }
  };
  function shotKubera(t, lt, dur) {
    const names = t >= H0;
    camBegin(540, 1200 - lt * 3, 1.0 + .008 * lt);
    h2Stage(t, H21.green, 'sgG');
    glow(KX, 1350, 460, '#FFE08A', .35);
    treasures(t, false);
    kubera(KX, KY, KU, { boilKey: 'kubera', seed: 44, eyes: blinkAt(t, G0 + 2.2) ? 'closed' : 'happy', mouth: names ? talk(t, H0 + .1, H0 + 4.4, 'smile', 'open') : 'smile', lookX: 0, hx: 0 });
    treasures(t, true);
    // each treasure, as its name is read, leaves the circle with a sparkle (its slot fills below)
    for (let i = 0; i < 9; i++) { const g = t - NFILL[i]; if (g > 0 && g < .6) { const a = i / 9 * TAU + NFILL[i] * .9; sparkleBurst(KX + Math.cos(a) * 360, 1330 + Math.sin(a) * 130, 120, g, 'nsp' + i, 6, ['#FFFFFF', NID_COL[i]]); } }
    camEnd();
    after(t);
    if (!names) wipeIn(lt, GREENW);
    if (names) wipeOut(lt, dur, PEACH);
  }

  // ================= I · "…ke data": the giver =================
  function shotGiver(t, lt, dur) {
    const g = t - I0;
    camBegin(540, 1160 - lt * 3, 1.0 + .01 * lt);
    warmBack(t, 'wbI', 540, 1300);
    const o = { ...HN, boilKey: 'haI', eyes: g > 1 ? 'happy' : 'normal', mouth: 'smile', blush: .5, handL: [-1.8, -13.4], handR: [1.8, -13.4], bendL: 1, bendR: 1, bow: .08, tailSway: t * 1.6 };
    hanuman(540, 1740, 23, o);
    const hand = naradaHand(540, 1740, 23, o, 1);
    glow(540, hand[1] - 20, 200 + 40 * Math.sin(t * 4), '#FFE08A', .6 * clamp(g - .6));
    // the siddhis and the nidhis float up out of his hands and out toward us
    for (let i = 0; i < 17; i++) {
      const a = t - I0 - 1.0 - i * .17; if (a < 0 || a > 2.4) continue;
      const k = a / 2.4, an = (i % 2 ? Math.PI : 0) + (i % 2 ? 1 : -1) * (.15 + .9 * hash(i * 4.1)), d = 120 + 760 * easeIn(k), s = (.35 + 1.1 * k) * 30;
      const x = 540 + Math.cos(an) * d, y = hand[1] + 20 + Math.sin(an) * d * .7;
      boilSeed('gv' + i); glow(x, y, s * 3, i < 8 ? SID_COL[i] : NID_COL[i - 8], .5 * (1 - k));
      paint(ellPts(x, y, s * 1.6, s * 1.6, 18), { wash: '#FFF5E2', washOp: 255 * (1 - seg(k, .75, 1)), ink: HSK.ink, sw: 1 });
      if (k < .8) (i < 8 ? siddhiIcon(i, x, y, s) : nidhiIcon(i - 8, x, y, s));
    }
    camEnd();
    rkVerse(['अष्ट सिद्धि नौ निधि के दाता'], 470, 606, 72, t - I0 - .4, { color: GOLDC });
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, GROVEW);
  }

  // ================= K · "as bar deen Janaki mata": Sita's boon =================
  function shotSitaBoon(t, lt, dur) {
    const g = t - BLESS, k = clamp(g / .8);
    camBegin(540, 1240, 1.0 + .01 * lt);
    h4Grove(t, 'gK', 150, 760);
    if (g > 0) glow(700, 1500, 500 * k, '#FFE08A', .4 * k);
    sita(300, 1930, 25, { boilKey: 'sitaK', eyes: g > 0 ? 'happy' : 'normal', mouth: 'smile', lookX: .8, hx: .3, handR: g > -.6 ? [4.0, -18.4] : undefined, bendR: g > -.6 ? -.8 : 0, handL: [-1.8, -13.4], bendL: 1 });
    rise('riseK', -150, 600, -110);
    const o = { ...HN, boilKey: 'haK', sit: 1, pray: 1, bow: g > 0 ? .3 : .15, eyes: g > 0 ? 'closed' : 'happy', mouth: 'smile', lookX: -.8, hx: -.3, blush: .6, tailSway: t * 1.4 };
    hanuman(760, 1760, 20, o);
    if (g > 0 && g < 1.4) {   // the blessing: a stream of gold light from her hand to him
      const from = [480, 1300], to = naradaHead(760, 1760, 20, o), p = arcPt(from, to, 120, ease(clamp(g / .9)));
      orb(p[0], p[1], 34 * (1 - seg(g, .9, 1.3)), GOLDC, t, 'kOrb', true);
    }
    if (g > .9) { const h = naradaHead(760, 1760, 20, o); sparkleBurst(h[0], h[1] - 40, 260, g - .9, 'kburst', 12, ['#FFFFFF', GOLDC]); glow(h[0], h[1], 260, '#FFE08A', .4 * clamp(g - .9)); hearts(h[0], h[1] - 200, t, BLESS + 1.4, 'kh'); }
    camEnd();
    caps(t);
    wipeIn(lt, GROVEW);
    wipeOut(lt, dur, PEACH);
  }

  // ================= L · the summary: shield, powers, gifts =================
  function shotSummary(t, lt, dur) {
    const g = t - L0;
    camBegin(540, 1150, 1.0 + .01 * lt);
    warmBack(t, 'wbL', 540, 1250);
    const BT = [L0 + .15, L0 + 1.3, L0 + 2.5];
    [[190, 1110], [540, 1050], [890, 1110]].forEach(([x, y], i) => h21Badge(x, y + 8 * Math.sin(t * 2 + i * 2), 112, i, (t - BT[i]) * 3, t, 'smb' + i));
    hanuman(540, 1740, 16.5, { ...HN, boilKey: 'haL', eyes: blinkAt(t, L0 + 3.4) ? 'closed' : 'happy', mouth: 'grin', blush: .5, pray: g > 3.2 ? 1 : 0, handL: [-5, -13], handR: [5, -13], bendL: -1, bendR: -1, tailSway: t * 2, dy: hop(g - 3.2, .25, 8, 1.4) });
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
  }
  // ================= M · the ask: he sings by the diya =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1060 - lt * 3, 1.0 + .01 * lt);
    warmBack(t, 'wbM', 540, 1250);
    singer(t, M0, 'hsM');
    hearts(540, 1080, t, M0 + 1.4, 'askh');
    camEnd();
    caps(t);
    wipeOut(lt, dur, GROVEW);
  }
  // ================= N · next: Sita said no (Part 5) =================
  function shotNext(t, lt, dur) {
    camBegin(540, 1340, 1.0 + .012 * lt);
    h4Grove(t, 'gS', 160, 640);
    const g = t - N0, no = g > 1.1;
    sita(380, 2000, 21, { boilKey: 'sitaS', eyes: 'normal', mouth: no ? 'flat' : 'smile', lookX: .8, hx: no ? .5 * Math.sin((g - 1.1) * 12) * (1 - seg(t, N0 + 2, N0 + 2.4)) + .2 : .3, handR: no ? [4.2, -18.6] : undefined, bendR: -.5 });
    hanuman(760, 1760, 20, { ...HN, crown: false, eyes: no ? 'wide' : 'happy', mouth: no ? 'O' : 'grin', lookX: -.8, hx: -.3, handR: no ? [5.4, -13] : [1.2, -17.4], bendR: 1, handL: no ? [-5.4, -13] : undefined, tailSway: t * 2,
      emote: no ? '?' : null, emoteK: popk(t, N0 + 1.3, 6), emoteAge: g - 1.3 });
    camEnd();
    caps(t);
    wipeIn(lt, GROVEW);
  }
  function shotCard(t, lt, dur) { hsCard(t, CARDC); }

  shots([[0, shotHook], [B0, shotChalisa], [C0, shotBabyQ], [D0, shotShield], [E0, shotYogi], [F1, shotAnima], [F2, shotMahima], [F3, shotSurasa], [F4, shotGarima], [F5, shotLaghima],
    [F6, shotPowers], [F7, shotPowers], [G0, shotKubera], [H0, shotKubera], [I0, shotGiver], [K0, shotSitaBoon], [L0, shotSummary], [M0, shotAsk], [N0, shotNext], [CARD, shotCard]]);
})();
