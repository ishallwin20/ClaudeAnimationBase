// hanu5.js: "HANUMAN offered to carry SITA home. She said NO." (ad 93, Hanuman series Part 5, 87.6 s, Bangers
// captions, retro SFX, no voice). Valmiki Ramayana, Sundara Kanda 36–38 (verse numbers as at valmikiramayan.net): he
// gives her Ram's ring and she is glad, as if she had found her husband (36.2–4); "climb on my back, I will take you to
// Ram" (37.19, 24); "I can carry Lanka itself, with Ravana" (37.20); "how will you carry me so far, with that small
// body? This is your monkey nature" (37.29–30); he takes it as the first insult (37.31) and grows like Meru and
// Mandara, blazing like fire, red-faced, teeth and nails like vajra (37.34–36); "I know your strength" (37.40); her
// reasons: your speed may bewilder me and I may fall into the sea (37.43–45); the demons will surround you, how can you
// fight while guarding me (37.46–50); I will not by choice touch any man's body but Ram's; Ravana touched me by force,
// I was helpless (37.60–61); Ram should come, kill Ravana and take me back: that is proper for him (37.55, 57, 62, 66).
// He is pleased: "what you said is befitting" (38.1–3). "I will hold my life one month" (38.67); she gives him her hair
// jewel (38.69); his arm would not go through it, so he put it on his finger (38.70).
// STORYBOARD.md has the plan and the sources; props are in hanu5_props.js (and Part 4's hanu4_props.js); the series
// kit is src/hanuman_series.js. All times are video time (t); tools/hanu5_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/hanu5_sfx.mjs)
  const NOPE = 2.5;
  const B0 = 4.4, RING = 5.2, HOLD = 6.2, C0 = 8.8, PAT = 9.5, D0 = 13.2, LIFT = 13.9, E0 = 17.6, HURT = 19.7;
  const F0 = 22.0, GROW0 = 22.6, GROW1 = 25.4, G0 = 26.4, H0 = 30.8, SHRINK = 31.0;
  const I0 = 35.2, SLIP = 36.6, SPLASH = 37.5, J0 = 39.8, K0 = 44.4, L0 = 48.9, M0 = 53.4, N0 = 58.4;
  const O0 = 62.8, P0 = 67.4, GIVE = 68.6, Q0 = 71.8, TRY = 72.5, FIT = 74.2, R0 = 76.2, S0 = 80.6, CARD = 84.0;
  const CARDC = hsCardTimes(CARD);

  const GOLDC = '#F5C542';
  const popk = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const talk = (t, a, b, rest = 'smile', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const kick = (t, t0) => t > t0 ? .05 * Math.exp(-(t - t0) * 6) * Math.cos((t - t0) * 20) : 0;
  const hop = (g, a = .3, f = 8, d = 1.6) => g > 0 ? -a * Math.abs(Math.sin(g * f)) * Math.exp(-g * d) : 0;
  const hearts = (x, y, t, t0, key, n = 3, s = 22) => { if (t < t0) return; boilSeed(key); for (let i = 0; i < n; i++) { const a = t - t0 - i * .22; if (a < 0 || a > 1.6) continue; const px = x + (i - 1) * s * 2.1 + Math.sin(a * 5 + i) * s * .6, py = y - a * s * 7, r = s * backOut(clamp(a * 4)) * (1 - clamp((a - 1.1) / .5)); paint(heartPts(px, py, r), { wash: '#F2557A', ink: HSK.ink, sw: .8 }); } };
  const speedLines = (x, y, len, key, n = 4, gap = 14) => { boilSeed(key); for (let i = 0; i < n; i++) inkLine([[x - len * (1 + .3 * hash(i)), y + (i - (n - 1) / 2) * gap], [x - len * .2, y + (i - (n - 1) / 2) * gap]], 1.2, '#FFFFFF', 'inkfine', 0); };
  const GROVEW = [H4.grove, H4.ashokaDk], NIGHTW = [H4.night, H4.nightLo], PEACH = [HSK.marigold, HSK.petal], DUSKW = [H5.dusk, H5.duskLo];

  // ---- the cast's fixed options
  const HN = { boilKey: 'hanu', seed: 60, crown: false, gada: 0 };
  const sita = (x, y, u, o) => parvati(x, y, u, { boilKey: 'sita', crown: false, pal: SITA_PAL, ...SITA_SKIN, ...o });
  // the grove two-shot: Sita sits under the Ashoka tree behind the rise (screen right); small Hanuman stands on it
  const SX = 740, SY = 2050, SU = 30, HX = 310, HY = 1752, HU = 15;
  const SHEAD = [SX, SY - 20.1 * SU], HHEAD = [HX, HY - 21 * HU];
  const grove = (t, key) => h5Grove(t, key, 930, 900);
  const seat = (t, key, so = {}) => { grove(t, key); sita(SX, SY, SU, { noShadow: true, lookX: -.7, hx: -.25, ...so }); h5Rise(key + 'rise'); };
  // the reasons' bubble: from Sita, between the captions and the heads; its numbered badge top left
  const BX = 540, BY = 1170, BRX = 310, BRY = 175;
  const reasonBubble = (t, t0, n, key, col) => {
    const bk = popk(t, t0 + .2, 5);
    h4Bubble(BX, BY, BRX, BRY, SHEAD[0] - 20, SHEAD[1] - 70, bk, key, col);
    h5Badge(BX - BRX + 40, BY - BRY + 30, 92, n, clamp((t - t0 - .45) * 4), key + 'badge');
    return bk > .9;
  };

  // ---- every caption: [text, y, t0, life, size, colour]
  const two = (a, b, t0, life, sa = 72, sb = 76, gold = 1) => [[a, 470, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 470 + (sa + sb) * .68, t0 + .35, life - .35, sb, gold === 1 ? GOLDC : undefined]];
  const CAPS = [
    ['HANUMAN OFFERED TO CARRY', 480, -1, B0 + .85, 82], ['SITA HOME.', 584, -1, B0 + .85, 82], ['SHE SAID NO.', 712, -1, B0 + .85, 128, GOLDC],
    ...two('IN LANKA, HANUMAN GAVE SITA', 'RAM\'S RING.', B0, 4.3, 64, 100),
    ...two('"CLIMB ON MY BACK!', 'I\'LL TAKE YOU TO RAM."', C0, 4.3, 84, 76),
    ...two('"I COULD CARRY ALL OF LANKA,', 'WITH RAVANA IN IT!"', D0, 4.3, 64, 84),
    ...two('"YOU? WITH THAT SMALL BODY?', 'THAT\'S JUST MONKEY TALK!"', E0, 4.3, 64, 70, -1),
    ...two('HANUMAN FELT INSULTED…', 'SO HE GREW. AND GREW.', F0, 4.3, 74, 84),
    ...two('TILL HE STOOD LIKE MOUNT MERU,', 'BLAZING LIKE FIRE!', G0, 4.3, 60, 100),
    ...two('"I KNOW YOUR STRENGTH, HANUMAN.', 'BUT I WILL NOT COME."', H0, 4.3, 58, 82),
    ...two('"YOU FLY AS FAST AS THE WIND.', 'I COULD FAINT AND FALL IN THE SEA."', I0, 4.5, 62, 56, -1),
    ...two('"DEMONS WILL CHASE YOU.', 'HOW WILL YOU FIGHT AND GUARD ME?"', J0, 4.5, 78, 58, -1),
    ...two('"BY MY OWN CHOICE, I WILL NOT', 'TOUCH ANY MAN BUT RAM."', K0, 4.4, 62, 76),
    ...two('"RAVANA SEIZED ME BY FORCE.', 'I WAS ALONE AND HELPLESS."', L0, 4.4, 64, 66, -1),
    ['"RAM MUST COME HERE HIMSELF,', 466, M0 + .1, 4.9, 62], ['DEFEAT RAVANA, AND TAKE ME HOME.', 552, M0 + .35, 4.65, 58], ['THAT IS WORTHY OF HIM."', 656, M0 + .6, 4.4, 80, GOLDC],
    ...two('HANUMAN WAS DELIGHTED:', '"EVERY WORD IS RIGHT, DEVI."', N0, 4.3, 76, 70),
    ...two('"TELL RAM: I CAN HOLD ON', 'FOR ONE MORE MONTH. NO MORE."', O0, 4.5, 74, 62, -1),
    ...two('THEN, FOR RAM, SHE GAVE HIM', 'HER HAIR JEWEL.', P0, 4.3, 66, 100),
    ...two('IT WAS TOO SMALL FOR HIS ARM…', 'SO HE WORE IT ON HIS FINGER!', Q0, 4.3, 64, 66),
    ...two('IN SITA\'S PLACE, WOULD YOU', 'HAVE SAID YES, OR NO?', R0, 4.3, 74, 86),
    ...two('NEXT: RAVANA COULD LIFT MOUNTAINS.', 'HE COULDN\'T LIFT LAKSHMAN.', S0, 3.3, 54, 70),
  ];
  // the series marks: the part pill and the source line show in the opening only, then fade out (owner, 11 Nov)
  const MARKS = C0 - .2;
  const caps = t => {
    for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color });
    if (t < MARKS && t > B0) { hsPill(5, (1 - seg(t, MARKS - .3, MARKS)) * clamp((t - B0) * 4)); hsSource('VALMIKI RAMAYAN · SUNDARA KANDA', t - B0 - .3, MARKS - B0 - .3); }
  };

  // ================= A · the hook: Hanuman offers his back, grinning… and hears "no" =================
  function shotHook(t, lt, dur) {
    const no = t > NOPE, g = t - NOPE;
    camBegin(540, 1180 - lt * 4, 1.0 + .012 * lt + kick(t, NOPE));
    grove(t, 'gA');
    h5Rise('gArise');
    const tk = take(t, NOPE, .5);
    hanuman(540, 1752, 30, { ...HN, lean: no ? 0 : .5, bow: no ? 0 : .12, hx: no ? -.2 : .45, lookX: no ? -.6 : .5, sq: tk.sq, dy: tk.dy,
      eyes: no ? 'wide' : (blinkAt(t, 1.4) ? 'closed' : 'happy'), mouth: no ? 'O' : 'grin', blush: .4,
      handR: no ? [3.2, -13.6] : [5.6, -17.2], bendR: no ? 1 : -1, handL: no ? [-3.2, -13.6] : [-1.6, -14.8], bendL: 1,
      tailSway: t * (no ? 1 : 4), emote: no ? '?' : null, emoteK: popk(t, NOPE + .1, 6), emoteAge: g });
    if (!no) { boilSeed('hkpat'); emote('spark', 690, 1180, 24, popk(t, .6, 4), t); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, GROVEW);
  }

  // ================= B · the ring: she holds it to her heart, glad as if she had found Ram (36.2–4) =================
  function shotRing(t, lt, dur) {
    const g = t - RING, got = g > 0, held = t > HOLD;
    camBegin(560, 1330, 1.12 + .008 * lt);
    seat(t, 'gB', { eyes: held ? 'closed' : got ? 'shine' : 'sad', mouth: held ? 'smile' : got ? 'O' : 'frown', lookY: got ? .2 : .5,
      handL: held ? [-.6, -15.0] : got ? [-4.2, -15.6] : undefined, handR: held ? [.6, -14.6] : undefined, bendL: 1, bendR: 1, blush: held ? .7 : 0 });
    // the ring: in his hand, then it floats over to hers, then held to her heart
    const k = ease(seg(t, RING - .7, RING));
    const from = [HX + 4.6 * HU, HY - 19 * HU], to = held ? [SX, SY - 15 * SU] : [SX - 4.2 * SU, SY - 15.6 * SU];
    const rx = lerp(from[0], to[0], k), ry = lerp(from[1], to[1], k) - Math.sin(k * Math.PI) * 90;
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hB', eyes: got ? 'happy' : 'normal', mouth: 'smile', lookX: .9, hx: .4, blush: .5, tailSway: t * 2,
      handR: got ? [2.2, -16.6] : [4.6, -19], bendR: -1, handL: got ? [-2.2, -16.6] : undefined, bendL: 1, pray: held ? 1 : 0 });
    h5Ring(rx, ry, 46, 1, 'ringB');
    if (held) { tears(SHEAD[0] - 26, SHEAD[1] + 10, (t - HOLD) * .8, 'ringtear', 1); hearts(SX - 20, SHEAD[1] - 60, t, HOLD + .3, 'ringhearts'); }
    camEnd();
    caps(t);
    wipeIn(lt, GROVEW);
  }

  // ================= C · "climb on my back! I'll take you to Ram" (37.19–24) =================
  function shotOffer(t, lt, dur) {
    const g = t - PAT, pat = g > 0;
    camBegin(540, 1250, 1.0 + .006 * lt);
    seat(t, 'gC', { eyes: 'look', mouth: 'smile', lookX: -.8 });
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hC', lean: pat ? .4 : 0, hx: .5, lookX: .9, eyes: blinkAt(t, C0 + 2.6) ? 'closed' : 'happy', mouth: talk(t, C0 + .2, C0 + 3.4, 'grin', 'open'), blush: .4,
      handR: pat ? [4.4, -19.8 + .6 * Math.sin(g * 18) * (g < 1.2 ? 1 : 0)] : [2.4, -14], bendR: -1.4, handL: [-3.4, -13], tailSway: t * 4, dy: hop(g, .25, 9, 2) });
    if (pat) { boilSeed('pat'); emote('spark', HX + 70, HHEAD[1] - 10, 18, popk(t, PAT, 6), g); }
    camEnd();
    caps(t);
  }

  // ================= D · "I could carry all of Lanka, with Ravana in it!" (37.20) =================
  function shotLanka(t, lt, dur) {
    const g = t - LIFT;
    camBegin(540, 1250, 1.0 + .006 * lt);
    seat(t, 'gC', { eyes: 'look', mouth: 'smile', lookX: -.8, lookY: -.3 });
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hC', puff: .6, hx: .3, lookX: .4, lookY: -.5, eyes: 'happy', mouth: talk(t, D0 + .2, D0 + 2.4, 'grin', 'open'),
      handR: [3.4, -12.4], handL: [-3.4, -12.4], bendL: -1, bendR: -1, tailSway: t * 4 });
    const bk = popk(t, D0 + .2, 5);
    h4Bubble(BX, BY, BRX, BRY, HHEAD[0] + 30, HHEAD[1] - 70, bk, 'bbD');
    if (bk > .9) {
      // inside: Hanuman holds Lanka over his head; Ravana stamps and shakes his fists on top
      const up = easeOut(seg(t, LIFT, LIFT + .6)), wob = Math.sin(t * 3) * .03 * up;
      hanuman(BX - 10, BY + 150, 6.0, { ...HN, boilKey: 'hDin', noShadow: true, eyes: 'happy', mouth: 'grin', handL: [-2.2, -26 + 2 * (1 - up)], handR: [2.2, -26 + 2 * (1 - up)], bendL: -1, bendR: -1, puff: .5, tailSway: t * 4, dy: hop(g, .3, 8, 2) });
      push(); translate(BX - 10, BY + 150 - 6.0 * (27 - 2 * (1 - up))); rotate(wob); translate(-(BX - 10), -(BY + 150 - 6.0 * (27 - 2 * (1 - up))));
      const ly = BY + 150 - 6.0 * (27 - 2 * (1 - up)) - 12;
      h5Lanka(BX - 10, ly, 230, 'lankaD');
      ravana(BX + 46, ly - 44, 2.0, { boilKey: 'rvD', noShadow: true, all: { eyes: 'angry', mouth: 'open', brows: -1 }, shake: .5, handL: [-5, -20], handR: [5, -20] });
      pop();
      if (g > 0) { boilSeed('lkanger'); emote('anger', BX + 110, ly - 120, 18, popk(t, LIFT + .4, 6), g); }
    }
    camEnd();
    caps(t);
  }

  // ================= E · "You? With that small body? That's just monkey talk!" (37.29–31) =================
  function shotSmall(t, lt, dur) {
    const g = t - HURT, hurt = g > 0;
    camBegin(560, 1330, 1.12 + .008 * lt);
    seat(t, 'gB', { eyes: 'happy', mouth: talk(t, E0 + .2, E0 + 2.0, 'smile', 'open'), lookX: -.8, hx: -.3, htilt: .06 * Math.sin(t * 9) * (t < E0 + 2 ? 1 : 0), handL: [-2.8, -16.6], bendL: 1 });
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hE', hx: .4, lookX: .9, eyes: hurt ? 'angry' : 'wide', mouth: hurt ? 'pout' : 'O', blush: hurt ? .9 : .3, puff: hurt ? .3 : 0,
      handL: hurt ? [-2.2, -13.6] : [-3.4, -13], handR: hurt ? [2.2, -13.6] : [3.4, -13], bendL: hurt ? -1 : 1, bendR: hurt ? -1 : 1, tailSway: t * (hurt ? 6 : 2),
      emote: hurt ? 'anger' : '!', emoteK: hurt ? popk(t, HURT + .1, 6) : popk(t, E0 + .5, 6), emoteAge: hurt ? g : t - E0 });
    // her measuring fingers: "this small!"
    if (t > E0 + .4 && t < HURT) { boilSeed('pinch'); inkLine([[SX - 4.4 * SU, SY - 17.4 * SU], [SX - 4.4 * SU, SY - 16.6 * SU]], 3, H4.ink, 'ink', 0); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, NIGHTW);
  }

  // ================= F · so he grew… and grew… (37.34) =================
  function shotGrow(t, lt, dur) {
    const k = easeIn(seg(t, GROW0, GROW1)), u = lerp(HU, 36, k), z = lerp(1.0, .78, ease(seg(t, GROW0, GROW1 + .3)));
    camBegin(540, 1250, z + .015 * Math.sin(t * 30) * k * (1 - seg(t, GROW1, GROW1 + .4)));
    seat(t, 'gF', { eyes: k > .2 ? 'wide' : 'look', mouth: k > .2 ? 'O' : 'smile', lookX: -.6, lookY: lerp(.2, -.9, k), hx: -.2 });
    if (k > 0) glow(HX, HY - 14 * u, 22 * u, '#FF9A4A', .35 * k);
    hanuman(HX, HY, u, { ...HN, boilKey: 'hF', eyes: 'determined', mouth: 'flat', puff: .5 * k, hx: .2, lookX: .5, lookY: .4, handL: [-4.4, -13], handR: [4.4, -13], bendL: -1, bendR: -1, tailSway: t * 3,
      pal: { mask: mixCol(HNM.mask, '#F0805A', k), maskDk: mixCol(HNM.maskDk, '#C8503A', k) } });
    if (k > 0 && k < 1) sparkleBurst(HX, HY - 12 * u, 140 + 260 * k, frac(t * 1.3), 'growspk', 8, ['#FFFFFF', '#FFC870']);
    camEnd();
    caps(t);
    wipeIn(lt, NIGHTW);
    wipeOut(lt, dur, ['#FF8A3A', '#C8401E']);
  }

  // ================= G · like Mount Meru, blazing like fire (37.35–36) =================
  function shotMeru(t, lt, dur) {
    const g = t - G0;
    camBegin(540, 1210 + lt * 4, 1.0 - .01 * lt);
    h4Sky(t, 'gG', 860, 640);
    boilSeed('gGgr'); paint(rectPts(-300, 1700, W + 600, 900), { wash: '#1E2A3A', ink: null });
    for (let i = 0; i < 9; i++) tree(-60 + i * 150, 1712, 110 + 50 * hash(i * 2.7), 'gGt' + i, Math.sin(t * .8 + i) * .1, ['#2E4A3A', '#1E3428', H4.ashoka]);
    // the fire round him
    glow(440, 1250, 760, '#FF7A2A', .45 + .05 * Math.sin(t * 7));
    glow(440, 1100, 420, '#FFD27A', .35);
    boilSeed('gGfire');
    for (let i = 0; i < 14; i++) { const a = frac(t * .9 + hash(i * 3.3)), x = 440 + (hash(i * 7.1) - .5) * 560, y = 1650 - a * 900, s = 22 * Math.sin(a * Math.PI); paint(starPts(x, y, s, .35, 4), { wash: i % 2 ? '#FFD27A' : '#FF8A3A', ink: null }); }
    hanuman(440, 1712, 33, { ...HN, boilKey: 'hG', eyes: 'determined', mouth: 'grin', puff: .8, hx: .15, lookX: .3, lookY: .3, handL: [-4.6, -13], handR: [4.6, -13], bendL: -1, bendR: -1, tailSway: t * 2,
      pal: { mask: '#F0805A', maskDk: '#C8503A' } });
    // clouds round his knees: he is taller than the trees, taller than the clouds
    for (let i = 0; i < 3; i++) cloudPuff(170 + i * 270 + 20 * Math.sin(t * .6 + i), 1500 + 40 * hash(i), 90, 'gGc' + i, 210, '#E8E0F0', '#A8A0C8');
    // tiny Sita, staring up
    sita(880, 1712, 4.2, { boilKey: 'sitaG', noShadow: true, eyes: 'wide', mouth: 'O', lookX: -.6, lookY: -1, hx: -.3 });
    if (g > .6) { boilSeed('gGs'); emote('!', 880, 1580, 12, popk(t, G0 + .6, 6), g); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, GROVEW);
  }

  // ================= H · "I know your strength. But I will not come." (37.40–41); he shrinks back =================
  function shotStill(t, lt, dur) {
    const g = t - SHRINK, k = easeOut(seg(t, SHRINK, SHRINK + .5));
    camBegin(540, 1250, 1.0 + .006 * lt);
    seat(t, 'gC', { eyes: blinkAt(t, H0 + 2.8) ? 'closed' : 'normal', mouth: talk(t, H0 + .8, H0 + 3.6, 'smile', 'open'), lookX: -.8, lookY: -.2 });
    if (k < 1) glow(HX, HY - 10 * HU, 300 * (1 - k), '#FF9A4A', .4 * (1 - k));
    const u = lerp(24, HU, k);
    hanuman(HX, HY, u, { ...HN, boilKey: 'hH', hx: .4, lookX: .9, eyes: g > 2.2 ? 'look' : 'happy', mouth: g > 2.2 ? 'O' : 'grin', blush: .3, handL: [-3.4, -13], handR: [3.4, -13], tailSway: t * 2,
      emote: g > 2.2 ? '?' : null, emoteK: popk(t, SHRINK + 2.3, 6), emoteAge: g - 2.3 });
    if (g > 0) poof(HX, HY - 8 * HU, 220, g / .5, 'shrinkpoof', ['#FFE2B8', '#FFB070']);
    camEnd();
    caps(t);
    wipeIn(lt, GROVEW);
  }

  // ================= I · reason 1: you fly as fast as the wind; I could faint and fall in the sea (37.43–45) =================
  function shotFall(t, lt, dur) {
    camBegin(540, 1250, 1.0 + .006 * lt);
    seat(t, 'gC', { eyes: 'sad', mouth: talk(t, I0 + .3, I0 + 3.6, 'frown', 'open'), lookX: -.5, lookY: -.6, hx: -.3 });
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hI', hx: .3, lookX: .6, lookY: -.6, eyes: 'look', mouth: 'flat', handL: [-1.8, -18.6], bendL: 1, handR: [3.2, -13], tailSway: t * 2 });
    if (reasonBubble(t, I0, 1, 'bbI', '#EEF6FF')) {
      h5Sea(BX, BY, BRX, BRY, BY + 70, t, 'seaI');
      // the flight: he whooshes across; she slips off and drops toward the waves
      const fx = lerp(BX - 150, BX + 330, seg(t, I0 + .5, I0 + 3.0)), fy = BY - 40 + 8 * Math.sin(t * 9);
      if (fx < BX + 280) {
        speedLines(fx - 80, fy, clamp(fx - BX + 150, 20, 110), 'spI', 5, 16);
        if (t < SLIP) sita(fx - 10, fy + 30, 4.0, { boilKey: 'sitaI', noShadow: true, eyes: t > SLIP - .5 ? 'swirl' : 'wide', mouth: 'O', lookX: -.3, handL: [-4, -20], handR: [4, -20] });
        hanuman(fx - 80, fy + 6, 4.6, { ...HN, boilKey: 'hIf', noShadow: true, rot: 1.45, eyes: 'determined', mouth: 'grin', handL: [-1.4, -26], handR: [1.4, -26], bendL: 0, bendR: 0, tail: 'droop' });
      }
      const sx0 = lerp(BX - 150, BX + 330, seg(SLIP, I0 + .5, I0 + 3.0)) - 10;
      if (t >= SLIP && t < SPLASH + .1) {
        const f = seg(t, SLIP, SPLASH), sx = lerp(sx0, sx0 - 40, f), sy = lerp(fy + 30, BY + 150, easeIn(f));
        sita(sx, sy, 4.0, { boilKey: 'sitaIf', noShadow: true, rot: -f * 2.6, eyes: 'swirl', mouth: 'O', handL: [-4.4, -21], handR: [4.4, -21] });
      }
      if (t > SPLASH) poof(sx0 - 40, BY + 96, 130, (t - SPLASH) / .5, 'splI', ['#9ED0F0', '#FFFFFF']);
      // the fish, mouths open
      const fk = popk(t, SPLASH + .2, 4);
      if (fk > .05) { h5Fish(BX - 150, BY + 104 - 16 * fk, 44 * fk, .5 + .5 * Math.sin(t * 10), 1, 'fishI1'); h5Fish(BX + 80, BY + 110 - 16 * fk, 40 * fk, .5 + .5 * Math.sin(t * 11 + 1), -1, 'fishI2'); h5Fish(BX + 190, BY + 118 - 10 * fk, 30 * fk, .5 + .5 * Math.sin(t * 9 + 2), -1, 'fishI3'); }
    }
    camEnd();
    caps(t);
  }

  // ================= J · reason 2: demons will chase you; how will you fight and guard me? (37.46–50) =================
  function shotChase(t, lt, dur) {
    const g = t - J0;
    camBegin(540, 1250, 1.0 + .006 * lt);
    seat(t, 'gC', { eyes: 'sad', mouth: talk(t, J0 + .3, J0 + 3.6, 'frown', 'open'), lookX: -.5, lookY: -.6, hx: -.3 });
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hJ', hx: .3, lookX: .6, lookY: -.6, eyes: 'look', mouth: 'flat', handL: [-1.8, -18.6], bendL: 1, handR: [3.2, -13], tailSway: t * 2 });
    if (reasonBubble(t, J0, 2, 'bbJ', '#F6EEF6')) {
      h5Sea(BX, BY, BRX, BRY, BY + 100, t, 'seaJ');
      const cx = BX + 10 + 30 * Math.sin(t * 2.2), cy = BY - 10 + 10 * Math.sin(t * 3.1);
      // three guards closing in from the sides, swords up
      [[-1, 0], [1, 0], [1, 1]].forEach(([s, k], i) => {
        const gx = cx + s * lerp(260, 190 + k * 20, ease(seg(t, J0 + .5 + i * .3, J0 + 1.6 + i * .3))), gy = cy + (k ? 70 : -30) + 6 * Math.sin(t * 6 + i);
        guard(gx, gy, 3.6, { boilKey: 'grdJ' + i, noShadow: true, flip: s > 0, eyes: 'angry', mouth: 'teeth', sword: true });
      });
      // arrows whizzing by
      for (let i = 0; i < 3; i++) { const a = frac((t - J0) * .9 + i / 3), ax = lerp(BX - 280, BX + 280, a), ay = BY - 120 + i * 40; if (t > J0 + 1) arrowAt(ax, ay, 0, 60, 'arJ' + i); }
      sita(cx - 6, cy + 30, 4.0, { boilKey: 'sitaJ', noShadow: true, eyes: 'scared', mouth: 'O', lookX: .4, handL: [-3.6, -19], handR: [3.6, -19] });
      hanuman(cx - 76, cy + 6, 4.6, { ...HN, boilKey: 'hJf', noShadow: true, rot: 1.45, eyes: 'wide', mouth: 'scream', handL: [-3.4, -24], handR: [3.4, -22 + 2 * Math.sin(t * 14)], bendL: 0, bendR: 0, tail: 'droop', sweat: true });
      if (g > 1.6) { boilSeed('jswt'); emote('sweat', cx - 10, cy - 100, 14, popk(t, J0 + 1.6, 6), g); }
    }
    camEnd();
    caps(t);
    wipeOut(lt, dur, GROVEW);
  }

  // ================= K · reason 3: by my own choice I will not touch any man but Ram (37.60) =================
  function shotTouch(t, lt, dur) {
    const g = t - K0;
    camBegin(600, 1500 - lt * 4, 1.3 + .01 * lt);
    seat(t, 'gK', { eyes: g > 2.8 ? 'closed' : 'normal', mouth: talk(t, K0 + .3, K0 + 3.4, 'smile', 'open'), lookX: -.4, hx: -.15, pray: 1 });
    glow(SX, SHEAD[1], 260, '#FFE6B0', .3);
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hK', hx: .4, lookX: .9, eyes: g > 1.6 ? 'shine' : 'look', mouth: 'smile', pray: g > 1.6 ? 1 : 0, handL: [-3.2, -13], handR: [3.2, -13], tailSway: t * 1.4 });
    h5Badge(SX - 4.6 * SU, SHEAD[1] - 130, 70, 3, clamp((t - K0 - .45) * 4), 'bdK');
    camEnd();
    caps(t);
    wipeIn(lt, GROVEW);
  }

  // ================= L · "Ravana seized me by force. I was alone and helpless." (37.61) =================
  function shotForce(t, lt, dur) {
    const g = t - L0;
    camBegin(620, 1480 - lt * 3, 1.42 + .01 * lt);
    seat(t, 'gK', { eyes: 'teary', mouth: talk(t, L0 + .3, L0 + 3.2, 'wobble', 'open'), lookX: -.2, lookY: .6, hx: -.1, handL: [-1.4, -14.8], handR: [1.4, -14.8], bendL: 1, bendR: 1 });
    tears(SHEAD[0] - 26, SHEAD[1] + 10, g * .7, 'lTear', 1.1); tears(SHEAD[0] + 24, SHEAD[1] + 10, g * .7 - .4, 'lTear2', 1);
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hL', hx: .4, lookX: .9, lookY: .3, eyes: g > 1.4 ? 'teary' : 'sad', mouth: 'wobble', pray: 1, tailSway: t * 1, tail: 'droop' });
    if (g > 1.6) tears(HHEAD[0] + 10, HHEAD[1] + 8, (g - 1.6) * .7, 'lTearH', .6);
    camEnd();
    caps(t);
    wipeOut(lt, dur, GROVEW);
  }

  // ================= M · the twist: Ram must come himself and take her home; that is worthy of him (37.55–66) =================
  function shotRam(t, lt, dur) {
    const g = t - M0, sun = ease(seg(t, M0 + .6, M0 + 2.6));
    camBegin(540, 1215, 1.0 + .006 * lt);
    seat(t, 'gC', { eyes: g > 1.4 ? 'shine' : 'normal', mouth: talk(t, M0 + .3, M0 + 4.2, 'smile', 'open'), lookX: -.4, lookY: -.7, hx: -.2, blush: .5 });
    glow(BX, BY, 520 * sun, '#FFD27A', .35 * sun);
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hM', hx: .3, lookX: .6, lookY: -.6, eyes: g > 2.4 ? 'shine' : 'look', mouth: g > 2.4 ? 'smile' : 'O', handL: [-1.8, -18.6], bendL: 1, handR: [3.2, -13], tailSway: t * 2 });
    const BYM = BY + 30, BRYM = 160;
    const bk = popk(t, M0 + .2, 5);
    h4Bubble(BX, BYM, BRX, BRYM, SHEAD[0] - 20, SHEAD[1] - 70, bk, 'bbM', mixCol('#FFFDF6', '#FFEBC0', sun));
    h5Badge(BX - BRX + 30, BYM - BRYM + 40, 86, 4, clamp((t - M0 - .45) * 4), 'bbMbadge');
    if (bk > .9) {
      // a sunrise; Ram walks in with his bow, Lakshman behind him
      boilSeed('sunM'); glow(BX + 120, BYM + 90, 240, '#FFC870', .6 * sun);
      paint(ellPts(BX + 130, BYM + 110 - 50 * sun, 62, 62, 20), { wash: '#FFD27A', ink: null });
      boilSeed('grM'); paint([[BX - 240, BYM + 96], [BX, BYM + 84], [BX + 240, BYM + 96], [BX + 150, BYM + 140], [BX - 150, BYM + 140]], { wash: '#C89A5A', ink: null, curv: .4 });
      const wx = lerp(BX - 230, BX - 30, ease(seg(t, M0 + .4, M0 + 3.4)));
      vanLakshman(wx - 90, BYM + 104, 5.6, { boilKey: 'lkM', noShadow: true, walk: t * 4, eyes: 'determined', mouth: 'flat', lookX: .8, hx: .3 });
      vanRam(wx, BYM + 104, 6.0, { boilKey: 'ramM', noShadow: true, walk: t * 4, eyes: 'determined', mouth: 'smile', lookX: .8, hx: .3 });
      if (g > 2.6) sparkleBurst(wx, BYM - 20, 220, (g - 2.6) * .7, 'ramspk', 8, ['#FFFFFF', GOLDC]);
    }
    camEnd();
    caps(t);
  }

  // ================= N · he is delighted: "every word is right, devi" (38.1–3) =================
  function shotRight(t, lt, dur) {
    const g = t - N0;
    camBegin(540, 1250, 1.0 + .008 * lt);
    seat(t, 'gC', { eyes: 'happy', mouth: 'smile', lookX: -.8, blush: .5 });
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hN', hx: .4, lookX: .9, eyes: g > .4 ? 'heart' : 'shine', mouth: talk(t, N0 + 1.6, N0 + 3.6, 'grin', 'open'), blush: .9, pray: 1, tailSway: t * 5, dy: hop(g - .3, .35, 9, 1.2) });
    hearts(HHEAD[0], HHEAD[1] - 60, t, N0 + .5, 'nh1', 3, 18); hearts(HHEAD[0], HHEAD[1] - 60, t, N0 + 2.0, 'nh2', 3, 18);
    camEnd();
    caps(t);
    wipeOut(lt, dur, NIGHTW);
  }

  // ================= O · "tell Ram: I can hold on one more month, no more" (38.67) =================
  function shotMonth(t, lt, dur) {
    const g = t - O0;
    camBegin(560, 1300 - lt * 4, 1.08 + .01 * lt);
    seat(t, 'gO', { eyes: g > 2.4 ? 'teary' : 'sad', mouth: talk(t, O0 + .3, O0 + 3.6, 'frown', 'open'), lookX: -.6, lookY: -.5, hx: -.2, handL: [-1.4, -14.8], handR: [1.4, -14.8], bendL: 1, bendR: 1 });
    h5Moon(520, 1120, 120 * popk(t, O0 + .5, 3), 'moonO');
    if (g > 2.4) tears(SHEAD[0] - 26, SHEAD[1] + 10, (g - 2.4) * .8, 'oTear', 1);
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hO', hx: .4, lookX: .9, lookY: -.3, eyes: 'sad', mouth: 'frown', pray: 1, tailSway: t * 1, tail: 'droop' });
    camEnd();
    caps(t);
    wipeIn(lt, NIGHTW);
  }

  // ================= P · the hair jewel, for Ram (38.69) =================
  function shotJewel(t, lt, dur) {
    const g = t - GIVE, out = t > P0 + .5;
    camBegin(540, 1290, 1.06 + .008 * lt);
    seat(t, 'gP', { eyes: 'normal', mouth: 'smile', lookX: -.8, hx: -.3, lean: out ? -1 : 0, handL: out ? [-4.6, -15.4] : [-.8, -14.6], bendL: out ? -.4 : 1 });
    const from = [SX - 4.9 * SU, SY - 15.6 * SU], to = [HX + 1, HY - 14.6 * HU];
    const k = ease(seg(t, GIVE, GIVE + 1.0)), jx = lerp(from[0], to[0], k), jy = lerp(from[1], to[1], k) - Math.sin(k * Math.PI) * 120;
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hP', hx: .4, lookX: .9, lookY: k > .9 ? .3 : -.2, eyes: k > .9 ? 'shine' : 'wide', mouth: k > .9 ? 'smile' : 'O', blush: .5,
      handL: k > .9 ? [-.5, -14.4] : [-2.6, -16.4], handR: k > .9 ? [.5, -14.4] : [2.6, -16.4], bendL: 1, bendR: 1, tailSway: t * 2 });
    if (out) h5Jewel(jx, jy, 40 * popk(t, P0 + .5, 4), 1, 'jewelP');
    if (k >= 1) sparkleBurst(to[0], to[1], 180, (t - GIVE - 1) * .8, 'jpspk', 8, ['#FFFFFF', '#FFB0A0']);
    camEnd();
    caps(t);
    wipeOut(lt, dur, GROVEW);
  }

  // ================= Q · too small for his arm, so it went on his finger (38.70) =================
  function shotFinger(t, lt, dur) {
    const g = t - TRY, tr = g > 0 && t < FIT, fit = t >= FIT, f = t - FIT;
    camBegin(540, 1300, 1.0 + .01 * lt + kick(t, FIT));
    grove(t, 'gQ');
    h5Rise('gQrise');
    const wig = tr ? Math.sin(g * 22) * .5 : 0;
    const o = { ...HN, boilKey: 'hQ', hx: 0, lookY: -.4,
      eyes: fit ? (f > .6 ? 'happy' : 'shine') : tr ? 'squeeze' : 'look', mouth: fit ? 'grin' : tr ? 'sheepish' : 'O', blush: .6, sweat: tr, tailSway: t * (fit ? 5 : 2),
      handR: [2.8, -15.0], bendR: 1, handL: fit ? [-3.6, -22.4] : tr ? [1.6 + wig * .3, -14.8 + wig] : [-3.2, -13], bendL: fit ? -1 : 1,
      emote: fit ? 'hearts' : tr && g > 1 ? 'sweat' : null, emoteK: fit ? popk(t, FIT + .3, 6) : popk(t, TRY + 1, 6), emoteAge: fit ? f : g - 1, dy: fit ? hop(f, .3, 9, 1.6) : 0 };
    hanuman(540, 1752, 26, o);
    // the jewel: in his right hand; his left hand tries to squeeze through it; then it sits on a finger, held up high
    const [lx, ly] = naradaHand(540, 1752, 26, o, -1), [rx, ry] = naradaHand(540, 1752, 26, o, 1);
    if (!fit) h5Jewel(tr ? rx - 18 : rx, ry - 8, 74, .6, 'jewelQ');
    else { h5Jewel(lx, ly - 26, 56, 1, 'jewelQ'); sparkleBurst(lx, ly - 26, 240, f * .7, 'fitspk', 10, ['#FFFFFF', GOLDC]); }
    if (fit && f < .6) { boilSeed('fitbang'); emote('!', lx + 60, ly - 120, 22, popk(t, FIT, 7), f); }
    camEnd();
    caps(t);
    wipeIn(lt, GROVEW);
    wipeOut(lt, dur, PEACH);
  }

  // ================= R · the ask: in Sita's place, yes or no? =================
  function shotAsk(t, lt, dur) {
    const g = t - R0;
    camBegin(540, 1010, 1.0 + .01 * lt);
    warmBack(t, 'wbA', 540, 1150);
    const o = { ...HN, boilKey: 'hR', sit: 1, pray: 1, bow: .1 + .05 * Math.sin(g * 2.4), eyes: blinkAt(t, R0 + 2.6) ? 'closed' : 'happy', mouth: 'smile', blush: .6, tailSway: t * 1.8 };
    hanuman(540, 1680, 27, o);
    const [px, py] = naradaHand(540, 1680, 27, o, -1);
    h5Jewel(px, py - 30, 44, 1, 'jewelR');
    // YES and NO, waiting for you
    for (const [i, word, col, x] of [[0, 'YES', '#3E9E5A', 300], [1, 'NO', '#D2283A', 780]]) {
      const k = popk(t, R0 + 1.0 + i * .35, 5); if (k <= .02) continue;
      const bob = 8 * Math.sin(t * 3 + i * 2);
      boilSeed('pill' + i); paint(rrPts(x - 110 * k, 1180 + bob - 52 * k, 220 * k, 104 * k, 50 * k), { wash: col, fill: mixCol(col, '#000000', .3), fillOp: 40, tex: .3, ink: H5.ink, sw: 1.4 });
      letter(word, x, 1182 + bob, 74 * k, '#FFFFFF', { rot: -.05 });
    }
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, DUSKW);
  }

  // ================= S · next: Ravana couldn't lift Lakshman =================
  function shotNext(t, lt, dur) {
    const g = t - S0;
    camBegin(540, 1280, 1.0 + .012 * lt);
    h5Field(t, 'fS');
    ravana(560, 1700, 13, { boilKey: 'rvS', shake: .8, all: { eyes: 'squeeze', mouth: 'teeth', sweat: 1, brows: -1 }, handL: [-3.4, -7.2], handR: [3.4, -7.2], dy: -.2 * Math.abs(Math.sin(t * 12)) });
    lakshman(770, 1700 - 4 * 13, 13, { boilKey: 'lkS', rot: -Math.PI / 2, eyes: 'closed', mouth: 'flat', noShadow: true, kodanda: false });
    if (g > .8) { boilSeed('nxS'); emote('!?', 560, 1700 - 30 * 13, 26, popk(t, S0 + .8, 6), g - .8); }
    camEnd();
    caps(t);
    wipeIn(lt, DUSKW);
  }
  function shotCard(t, lt, dur) { hsCard(t, CARDC); }

  shots([[0, shotHook], [B0, shotRing], [C0, shotOffer], [D0, shotLanka], [E0, shotSmall], [F0, shotGrow], [G0, shotMeru], [H0, shotStill], [I0, shotFall],
    [J0, shotChase], [K0, shotTouch], [L0, shotForce], [M0, shotRam], [N0, shotRight], [O0, shotMonth], [P0, shotJewel], [Q0, shotFinger], [R0, shotAsk], [S0, shotNext], [CARD, shotCard]]);
})();
