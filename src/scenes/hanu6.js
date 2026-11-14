// hanu6.js: "RAVANA could lift MOUNTAINS. He couldn't lift LAKSHMAN." (ad 94, Hanuman series Part 6, 86.7 s, Bangers
// captions, retro SFX, no voice). Valmiki Ramayana, Yuddha Kanda 59 (verse numbers as at valmikiramayan.net): Ravana
// goes to battle himself (59.5–10); Hanuman stops his chariot, right arm raised: "gods, danavas, gandharvas, yakshas,
// rakshasas cannot slay you, but from monkeys there is danger to you" (59.53–56); "remember your son Aksha, struck down
// by me" (59.59); Ravana strikes his chest with his palm; he reels, steadies and strikes back with his palm; Ravana
// shakes like a mountain in an earthquake (59.60–62); "well done, monkey, an enemy worthy of praise" (59.64); "shame on
// my strength, that you still live" (59.65). Brahma's spear fells Lakshman (59.107–110); Ravana, able to lift Himavan,
// Mandara, Meru and the three worlds with the gods, cannot lift him (59.111, 113); Lakshman remembers he is a part of
// Vishnu (59.112); Hanuman's vajra-like fist on his chest drops Ravana to his knees (59.114–115); Hanuman carries
// Lakshman to Ram in his arms (59.118): light for him through friendship and supreme devotion (59.119); Lakshman healed
// (59.122); "climb on my back, as Vishnu rides Garuda" (59.124–126).
// STORYBOARD.md has the plan and the sources; props are in hanu6_props.js (and hanu4/5_props.js, rp12_props.js); the
// series kit is src/hanuman_series.js. All times are video time (t); tools/hanu6_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/hanu6_sfx.mjs)
  const BUDGE = 2.4;
  const B0 = 4.4, C0 = 8.8, LAND = 9.0, D0 = 13.2, RED = 14.4, E0 = 17.6, SLAP1 = 18.8, F0 = 22.0, SLAP2 = 22.9;
  const G0 = 26.4, CLAP = 27.0, H0 = 30.8, I0 = 35.2, HURL = 35.9, HIT = 37.4, J0 = 39.6, GRAB = 41.4, K0 = 44.0, L0 = 48.4;
  const M0 = 52.8, GLOW = 53.6, N0 = 57.2, RUSH = 57.6, PUNCH = 59.4, O0 = 61.6, SCOOP = 62.4, P0 = 66.0, WAKE = 69.0;
  const Q0 = 71.0, MOUNT = 72.6, R0 = 75.4, S0 = 79.8, CARD = 83.1;
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
  const steam = (x, y, t, t0, key, s = 26) => { if (t < t0) return; boilSeed(key); for (let i = 0; i < 3; i++) { const q = frac((t - t0) * 1.4 + i / 3); paint(ellPts(x + (i - 1) * s * .8 + Math.sin(q * 6 + i) * 6, y - q * s * 3, s * (.4 + .5 * q), s * (.35 + .4 * q), 10), { wash: '#FFFFFF', washOp: 200 * (1 - q), ink: null }); } };
  const FIELDW = [H5.dusk, H5.duskLo], BATTLEW = [P12.duskHi, P12.earthDk], PEACH = [HSK.marigold, HSK.petal], NIGHTW = [H6.night, H6.nightLo];

  // ---- the cast's fixed options
  const HN = { boilKey: 'hanu', seed: 60, crown: false, gada: 0 };
  const LK = { boilKey: 'lk', eyes: 'closed', mouth: 'flat', noShadow: true };
  const RV = (x, y, u, o = {}) => ravana(x, y, u, { boilKey: 'rv', ...o });
  // the duel's two-shot on the dusk field: Hanuman (left, facing right), Ravana (right)
  const HX = 380, HY = 1700, HU = 13, RX = 700, RY = 1700, RU = 14;
  const duelCam = (lt, z = 1.35, sh = [0, 0]) => camBegin(585 + sh[0], 1300 + sh[1] - lt * 3, z + .006 * lt);
  // Lakshman lying on his back (head screen left), his body centred at (cx, y)
  const LU = 11.5;
  const lying = (cx, y, o = {}) => vanLakshman(cx + 14 * LU, y, LU, { ...LK, rot: -Math.PI / 2, kodanda: false, ...o });
  // a head-by-head option map: f(i) → fields for head i
  const eachHead = f => { const h = {}; for (let i = 0; i < 10; i++) h[i] = f(i); return h; };
  // the strain: every head squeezing, teeth gritted, puffed, sweating, going purple (k 0..1)
  const strainHeads = (t, k = 1) => eachHead(i => ({ eyes: 'squeeze', mouth: 'teeth', sweat: 1, puff: .5 + .3 * Math.sin(t * 9 + i), tint: '#9A3A8A', tintK: .35 * k, brows: -1, hat: i === 0 ? 'cap' : i === 4 ? 'mukut' : 'crown', tilt: .05 * Math.sin(t * 13 + i * 1.7) }));
  // Ravana gripping Lakshman (his front hands on him), straining; o adds over it
  function gripShot(t, cx, y, u, heads, o = {}, lo = {}) {
    RV(cx, y, u, { sq: .1, shake: o.shake ?? .6, heads, handL: [-4.8, -1.8], handR: [4.8, -1.8], dy: -.1 * Math.abs(Math.sin(t * 14)),
      between: () => lying(cx, y + 30, lo), ...o });
  }

  // ---- every caption: [text, y, t0, life, size, colour]
  const two = (a, b, t0, life, sa = 72, sb = 76, gold = 1) => [[a, 470, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 470 + (sa + sb) * .68, t0 + .35, life - .35, sb, gold === 1 ? GOLDC : undefined]];
  const CAPS = [
    ['RAVANA COULD LIFT MOUNTAINS.', 470, -1, B0 + .85, 66], ['HE COULDN\'T LIFT', 568, -1, B0 + .85, 84], ['LAKSHMAN.', 692, -1, B0 + .85, 132, GOLDC],
    ...two('IN THE LANKA WAR, RAVANA', 'CAME OUT TO FIGHT HIMSELF.', B0, 4.3, 70, 66, -1),
    ...two('"NO GOD OR DEMON CAN KILL YOU…', 'BUT BEWARE OF MONKEYS!"', C0, 4.3, 60, 78),
    ...two('"AND REMEMBER YOUR SON AKSHA?', 'I STRUCK HIM DOWN."', D0, 4.3, 62, 84),
    ...two('RAVANA STRUCK FIRST:', 'A SLAP ON HANUMAN\'S CHEST!', E0, 4.3, 84, 68),
    ...two('HANUMAN SLAPPED BACK.', 'RAVANA SHOOK LIKE A MOUNTAIN!', F0, 4.3, 82, 64),
    ...two('"WELL DONE, MONKEY!', 'YOU\'RE AN ENEMY WORTH PRAISING!"', G0, 4.3, 86, 60),
    ...two('"SHAME ON MY STRENGTH…', 'YOU\'RE STILL ALIVE!"', H0, 4.3, 78, 90),
    ...two('LATER, RAVANA HURLED A BLAZING SPEAR', 'GIVEN TO HIM BY BRAHMA.', I0, 4.3, 54, 76),
    ...two('LAKSHMAN FELL. RAVANA RAN', 'TO CARRY HIM AWAY.', J0, 4.3, 70, 84, -1),
    ...two('HE COULD LIFT HIMALAYA, MANDARA, MERU…', 'EVEN THE THREE WORLDS, GODS AND ALL.', K0, 4.3, 52, 54, -1),
    ...two('BUT HE COULD NOT LIFT', 'LAKSHMAN.', L0, 4.3, 82, 132),
    ...two('LAKSHMAN REMEMBERED WHO HE WAS:', 'A PART OF VISHNU HIMSELF.', M0, 4.3, 62, 76),
    ...two('HANUMAN\'S FIST HIT LIKE A THUNDERBOLT.', 'RAVANA FELL TO HIS KNEES!', N0, 4.3, 54, 76, -1),
    ...two('THEN HANUMAN LIFTED LAKSHMAN', 'AND CARRIED HIM TO RAM.', O0, 4.3, 66, 76, -1),
    ['TOO HEAVY FOR RAVANA.', 466, P0 + .1, 4.9, 76], ['LIGHT FOR HANUMAN.', 560, P0 + .5, 4.5, 76], ['VALMIKI SAYS WHY:', 660, P0 + 1.4, 3.6, 60], ['FRIENDSHIP AND DEVOTION.', 744, P0 + 1.7, 3.3, 80, GOLDC],
    ...two('"CLIMB ON MY BACK, RAM,', 'LIKE VISHNU ON GARUDA!"', Q0, 4.3, 78, 78),
    ...two('WHO CARRIES YOU WHEN YOU FALL?', 'TAG THEM.', R0, 4.3, 62, 120),
    ...two('NEXT: BHARAT SHOT HANUMAN', 'OUT OF THE SKY.', S0, 3.2, 66, 96),
  ];
  // the series marks: the part pill and the source line show in the opening only, then fade out (owner, 11 Nov)
  const MARKS = C0 - .2;
  const caps = t => {
    for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color });
    if (t < MARKS && t > B0) { hsPill(6, (1 - seg(t, MARKS - .3, MARKS)) * clamp((t - B0) * 4)); hsSource('VALMIKI RAMAYAN · YUDDHA KANDA', t - B0 - .3, MARKS - B0 - .3); }
  };

  // ================= A · the hook: Ravana strains over Lakshman; he won't budge =================
  function shotHook(t, lt, dur) {
    const g = t - BUDGE, popd = g > 0;
    camBegin(540, 1420 - lt * 3, 1.5 + .01 * lt + kick(t, BUDGE));
    h5Field(t, 'fA');
    const heads = popd ? eachHead(i => ({ eyes: 'wide', mouth: 'O', sweat: 1, tint: '#9A3A8A', tintK: .3, hat: i === 0 ? 'cap' : i === 4 ? 'mukut' : 'crown', tilt: .04 * Math.sin(t * 9 + i) }))
      : strainHeads(t, clamp(t / 2));
    gripShot(t, 560, 1700, 14, heads, { shake: popd ? .25 : .7 });
    if (popd) { boilSeed('hkpop'); const [bx, by] = ravanaHead(560, 1700, 14, {}, 4); emote('!?', bx + 50, by - 90, 26, popk(t, BUDGE + .05, 6), g); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, BATTLEW);
  }

  // ================= B · Ravana rides out himself; arrows rain on the vanaras (59.5–10, 42–44) =================
  function shotChariot(t, lt, dur) {
    const roll = easeOut(seg(t, B0, B0 + 1.4)), cx = lerp(1450, 790, roll);
    camBegin(540, 1500 - lt * 4, 1.22 + .008 * lt);
    battlefield(t, 'bB', { gy: 1920 });
    warChariot(cx, 1880, 18 * 12, t, { key: 'rcB', team: 'donkeys', flip: true, run: roll < 1 ? 1 : .15,
      riders: ([sx, sy]) => RV(sx, sy, 12, { boilKey: 'rvB', flip: true, noShadow: true, heads: { 4: { mouth: talk(t, B0 + 1.4, B0 + 3.2, 'smirk', 'grin'), lookX: -1 }, 6: { lookX: -1 }, 3: { lookX: -1 } }, handL: [-8.6, -16], bendL: -.4 }) });
    // his arrows streaming left over the field
    if (roll >= 1) for (let i = 0; i < 5; i++) { const q = frac((t - B0 - 1.4) * 1.3 + i / 5), ax = lerp(cx - 180, -120, q), ay = 1420 + i * 34 + q * 120; arrowAt(ax, ay, Math.PI + .12, 120, 'arB' + i); }
    // two vanaras running for it
    const run = seg(t, B0 + 1.6, B0 + 4.2);
    for (const [i, x0, k] of [[0, 360, 0], [2, 200, 1]]) {
      const x = x0 - run * 420, sc = run > 0;
      vanara(x, 1820 + k * 30, 10, i, { boilKey: 'vB' + i, walk: sc ? t * 4 + k : undefined, flip: true, eyes: sc ? 'wide' : 'look', mouth: sc ? (k ? 'O' : 'scream') : 'flat', lookX: .8,
        handL: sc ? [-4, -20] : undefined, handR: sc ? [4, -20] : undefined, emote: sc && run < .6 ? '!' : null, emoteK: popk(t, B0 + 1.7 + k * .2, 6), emoteAge: t - B0 - 1.7 });
    }
    camEnd();
    caps(t);
    wipeIn(lt, BATTLEW);
    wipeOut(lt, dur, FIELDW);
  }

  // ================= C · Hanuman lands in front of him, right hand raised (59.53–56) =================
  function shotStand(t, lt, dur) {
    const g = t - LAND, land = g >= 0, drop = easeIn(seg(t, LAND - .4, LAND));
    duelCam(lt, 1.35 + kick(t, LAND));
    h5Field(t, 'fC');
    const gulp = t > C0 + 2.4;
    RV(RX, RY, RU, { heads: { 4: { eyes: land ? 'wide' : 'normal', mouth: land ? 'flat' : 'smirk', lookX: -1 }, 5: { eyes: 'side', lookX: -1, sweat: gulp ? 1 : 0 }, 7: { sweat: 1, eyes: gulp ? 'wide' : 'shifty' }, 1: { mouth: gulp ? 'O' : 'smile', puff: gulp ? 0 : .7 }, 0: { eyes: land ? 'wide' : 'sleepy' } } });
    const tk = take(t, LAND, .7);
    const o = { ...HN, boilKey: 'hC', hx: .4, lookX: .9, lookY: -.3, eyes: land ? 'determined' : 'happy', mouth: talk(t, C0 + .6, C0 + 3.8, 'grin', 'open'),
      handR: g > .5 ? [3.6, -27.4] : [3.4, -13], bendR: -1, handL: [-3.4, -13], tailSway: t * 3, sq: tk.sq, dy: land ? tk.dy : -40 * (1 - drop) };
    hanuman(HX, HY, HU, o);
    if (land) poof(HX, HY - 20, 240, g / .6, 'landC', ['#E8C49A', '#C89A6A']);
    if (g > .5) { const [px, py] = naradaHand(HX, HY, HU, o, 1); sparkleBurst(px, py - 20, 90, (g - .5) * .9, 'handspk', 6, ['#FFFFFF', GOLDC]); }
    if (gulp) { boilSeed('gulpC'); const [bx, by] = ravanaHead(RX, RY, RU, {}, 7); emote('sweat', bx + 20, by - 60, 16, popk(t, C0 + 2.4, 6), t - C0 - 2.4); }
    camEnd();
    caps(t);
    wipeIn(lt, FIELDW);
  }

  // ================= D · "remember your son Aksha? I struck him down" (59.59); ten heads go red =================
  function shotAksha(t, lt, dur) {
    duelCam(lt);
    h5Field(t, 'fC');
    const heads = eachHead(i => {
      const k = seg(t, RED + Math.abs(i - 4) * .14, RED + Math.abs(i - 4) * .14 + .3);
      return k > 0 ? { eyes: 'angry', mouth: 'teeth', brows: -1, tint: RVN.angry, tintK: .55 * k, hat: i === 0 ? 'cap' : i === 4 ? 'mukut' : 'crown', lookX: -.8 } : { lookX: -.8 };
    });
    RV(RX, RY, RU, { heads, shake: .3 * seg(t, RED + .8, RED + 1.2) });
    for (const i of [2, 4, 6]) { const [bx, by, ] = ravanaHead(RX, RY, RU, {}, i); steam(bx, by - 46, t, RED + .9 + i * .05, 'stD' + i, 20); }
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hD', hx: .4, lookX: .9, eyes: 'smug', mouth: talk(t, D0 + .3, D0 + 3.0, 'smug', 'open'), blush: .3,
      handL: [-.6, -16.2], bendL: 1, handR: [3.4, -13], tailSway: t * 4, htilt: .06 * Math.sin(t * 3) });
    camEnd();
    caps(t);
  }

  // ================= E · Ravana slaps his chest; he reels again and again, then steadies (59.60–61) =================
  function shotSlap1(t, lt, dur) {
    const g = t - SLAP1, hit = g >= 0, wind = seg(t, SLAP1 - .7, SLAP1 - .1);
    duelCam(lt, 1.38 + kick(t, SLAP1) * 1.6, [Math.sin(t * 71) * shk(t, SLAP1, 14), Math.cos(t * 53) * shk(t, SLAP1, 10)]);
    h5Field(t, 'fC');
    const swing = hit ? 1 - seg(t, SLAP1 + .5, SLAP1 + 1.0) : 0;
    const handL = hit ? [lerp(-4.9, -13.6, swing), lerp(-10, -14.6, swing)] : [lerp(-4.9, -3.2, wind), lerp(-10, -22, wind)];
    RV(RX, RY, RU, { dx: hit ? -2.2 * swing : 0, heads: eachHead(i => ({ eyes: 'angry', mouth: hit && g < 1.2 ? 'grin' : 'teeth', brows: -1, tint: RVN.angry, tintK: .35, hat: i === 0 ? 'cap' : i === 4 ? 'mukut' : 'crown', lookX: -.8 })),
      handL, bendL: hit ? -.6 : .8 });
    // reeling: rocks back and forth, damped, steady by +1.8 s
    const wob = hit ? -.32 * Math.exp(-g * 1.7) * Math.cos(g * 9) : 0, back = hit ? -2.6 * Math.exp(-g * 2.2) : 0;
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hE', rot: wob, dx: back, hx: .4, lookX: .9, eyes: hit ? (g < 1.4 ? 'swirl' : 'determined') : 'wide', mouth: hit ? (g < 1.4 ? 'wobble' : 'flat') : 'O',
      handL: hit && g < 1.4 ? [-5.4, -20] : [-3.4, -13], handR: hit && g < 1.4 ? [5.4, -20] : [3.4, -13], bendL: -1, bendR: -1, tailSway: t * 5 });
    if (hit) { h6Impact(HX + 30, HY - 15 * HU, 200, g * 1.6, 'imE'); sfx('SLAP!', HX + 60, HY - 26 * HU, 96, '#FFF2A0', g, { life: 1.1, stroke: H6.ink, sw: .25, rot: -.12 }); }
    if (hit && g < 1.4) h6Dizzy(HX + back * HU, HY - 29 * HU, 50, t, 'dzE');
    camEnd();
    caps(t);
  }

  // ================= F · Hanuman slaps back; Ravana shakes like a mountain in an earthquake (59.61–63) =================
  function shotSlap2(t, lt, dur) {
    const g = t - SLAP2, hit = g >= 0, jump = seg(t, SLAP2 - .45, SLAP2), ret = seg(t, SLAP2 + .35, SLAP2 + .8);
    const sh = shk(t, SLAP2, 18, 1.2);
    duelCam(lt, 1.38 + kick(t, SLAP2) * 1.6, [Math.sin(t * 71) * sh, Math.cos(t * 53) * sh * .7]);
    h5Field(t, 'fC');
    // the cheering vanaras, far off at the left, from just after the slap (59.63)
    const ch = t > SLAP2 + .6;
    for (const [i, x, k] of [[1, 150, 0], [3, 236, 1]]) vanara(x, 1655, 6, i, { boilKey: 'vF' + i, eyes: ch ? 'happy' : 'look', mouth: ch ? 'grin' : 'flat', lookX: .6, noShadow: true,
      handL: ch ? [-4, -21 + Math.sin(t * 12 + k)] : undefined, handR: ch ? [4, -21 - Math.sin(t * 12 + k)] : undefined, dy: ch ? hop(t - SLAP2 - .6 - k * .1, .5, 10, .4) : 0 });
    h6Quake(RX, RY + 6, 340, seg(t, SLAP2, SLAP2 + .5), 'qkF');
    // Ravana: the near heads take it first, then a wobble runs down the row
    const heads = eachHead(i => {
      const d = hit ? g - (9 - Math.abs(i - 0)) * 0 - i * .05 : -1;
      const w = d > 0 ? .5 * Math.exp(-d * 2.2) * Math.sin(d * 18) : 0;
      return hit ? { eyes: g < 1.6 ? 'swirl' : 'wide', mouth: g < 1.6 ? 'wobble' : 'O', tilt: w, dx: w * .6, hat: i === 0 ? 'cap' : i === 4 ? 'mukut' : 'crown' } : { eyes: 'angry', mouth: 'smirk', lookX: -.8 };
    });
    RV(RX, RY, RU, { heads, shake: hit ? Math.exp(-g * .9) : 0, dx: hit ? .6 * Math.sin(g * 30) * Math.exp(-g * 1.5) : 0 });
    // Hanuman leaps and swings his palm across the near heads
    const up = Math.sin(Math.min(1, jump + ret * 0) * Math.PI / 2) * (1 - ret);
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hF', dx: 4.2 * up, dy: -5.4 * up, rot: .15 * up, hx: .4, lookX: .9, eyes: 'determined', mouth: hit && g < 1 ? 'grin' : 'flat',
      handR: hit && ret < 1 ? [8.6, -21] : jump > 0 ? [-1, -24] : [3.4, -13], bendR: -1, handL: [-3.4, -13], tailSway: t * 6, sq: take(t, SLAP2 + .8, .4).sq });
    if (hit) { h6Impact(RX - 11.6 * RU, RY - 20.4 * RU, 220, g * 1.6, 'imF'); sfx('SLAP!', RX - 9 * RU, RY - 26.5 * RU, 104, '#FFF2A0', g, { life: 1.1, stroke: H6.ink, sw: .25, rot: .1 }); }
    camEnd();
    caps(t);
  }

  // ================= G · "well done, monkey! an enemy worth praising" (59.64); twenty arms clap =================
  function shotPraise(t, lt, dur) {
    const g = t - CLAP, cl = g > 0;
    duelCam(lt);
    h5Field(t, 'fC');
    const c = cl ? Math.abs(Math.sin(g * 9)) : 1;   // 0: hands together
    RV(RX, RY, RU, {
      heads: eachHead(i => ({ eyes: i === 8 ? 'shut' : 'happy', mouth: i === 4 ? talk(t, G0 + .2, G0 + 3.0, 'grin', 'open') : 'grin', blush: .4, hat: i === 0 ? 'cap' : i === 4 ? 'mukut' : 'crown', tilt: .05 * Math.sin(t * 5 + i), goldTooth: i === 6 ? 1 : 0 })),
      arm: (a, s, k, d) => {
        if (!cl || k === 9) return null;
        // neighbouring fan hands meet and part: even arms rise to the odd one above them
        const gap = .9 + .9 * c, hy = d.hand[1] + (k % 2 ? -1 : 1) * gap * .5;
        return { hand: [d.hand[0], hy], shape: 'open' };
      },
      handL: cl ? [-1.4 - 2.6 * c, -17.4] : undefined, handR: cl ? [1.4 + 2.6 * c, -17.4] : undefined, bendL: 1, bendR: 1 });
    if (cl) for (let i = 0; i < 4; i++) { const q = frac(g * 2 + i / 4); boilSeed('clp' + i); paint(starPts(RX + (i - 1.5) * 150, RY - 22 * RU - q * 80, 16 * Math.sin(q * Math.PI), .4, 4), { wash: '#FFF2A0', ink: null }); }
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hG', hx: .4, lookX: .9, eyes: blinkAt(t, G0 + 2.2) ? 'closed' : 'wide', mouth: 'O', htilt: -.12, tailSway: t * 2,
      emote: g > .6 ? '?' : null, emoteK: popk(t, CLAP + .6, 6), emoteAge: g - .6 });
    camEnd();
    caps(t);
  }

  // ================= H · "shame on my strength… you're still alive!" (59.65) =================
  function shotShame(t, lt, dur) {
    const g = t - H0;
    duelCam(lt, 1.4);
    h5Field(t, 'fC');
    const off = g > 2.2;
    RV(RX, RY, RU, { heads: eachHead(i => ({ eyes: off ? (i % 3 ? 'wide' : 'angry') : 'happy', mouth: off ? (i % 2 ? 'O' : 'pout') : 'grin', brows: off ? 1 : 0, hat: i === 0 ? 'cap' : i === 4 ? 'mukut' : 'crown', lookX: -.8 })) });
    if (off) { boilSeed('offH'); const [bx, by] = ravanaHead(RX, RY, RU, {}, 4); emote('!', bx, by - 90, 22, popk(t, H0 + 2.3, 6), g - 2.3); }
    // he frowns at his own palm, then at Ravana
    const look = g > 1.8;
    hanuman(HX, HY, HU, { ...HN, boilKey: 'hH', hx: look ? .4 : .1, lookX: look ? .9 : .5, lookY: look ? 0 : .2, eyes: 'angry', mouth: talk(t, H0 + 1.8, H0 + 3.8, 'pout', 'open'), puff: .3,
      handR: [1.8, -19.4], bendR: 1, handL: [-3.4, -13], tailSway: t * 3, emote: g > .5 ? 'anger' : null, emoteK: popk(t, H0 + .5, 6), emoteAge: g - .5 });
    camEnd();
    caps(t);
    wipeOut(lt, dur, FIELDW);
  }

  // ================= I · Brahma's spear: Lakshman's arrows can't stop it; it strikes him (59.104–109) =================
  const LX = 330, LYG = 1700, LKU = 13;
  function shotSpear(t, lt, dur) {
    const hit = t >= HIT, g = t - HIT, fly = seg(t, HURL, HIT);
    camBegin(540 + Math.sin(t * 71) * shk(t, HIT, 14), 1300 - lt * 3, 1.3 + kick(t, HIT));
    h5Field(t, 'fI');
    const thrown = t >= HURL;
    RV(760, 1700, 13, { heads: eachHead(i => ({ eyes: 'angry', mouth: thrown ? 'grin' : 'teeth', brows: -1, hat: i === 0 ? 'cap' : i === 4 ? 'mukut' : 'crown', lookX: -.8 })),
      handL: thrown ? [-11, -16] : [-3.2, -24], bendL: thrown ? -.4 : .8 });
    // Lakshman: shooting at the spear, then struck and falling back
    const fall = easeIn(seg(t, HIT, HIT + .55));
    const draw = hit ? 0 : .5 + .5 * Math.abs(Math.sin((t - I0) * 5));
    vanLakshman(LX + 14 * LKU * fall, LYG + 30 * fall, LKU, { boilKey: 'lkI', flip: true, rot: -fall * Math.PI / 2, kodanda: false, eyes: hit ? 'closed' : 'determined', mouth: hit ? 'O' : 'flat', lookX: -1, hx: -.3,
      handL: hit ? undefined : [-7.6, -18], bendL: .3, handR: hit ? undefined : [lerp(-2.6, -.4, draw), lerp(-14.4, -18.6, draw)], bendR: .9, armL: hit ? undefined : heldBow(draw), noShadow: fall > 0 });
    // his arrows fly right and glance off the spear
    if (thrown && !hit) for (let i = 0; i < 3; i++) { const q = frac((t - HURL) * 2.2 + i / 3), ax = lerp(LX + 140, lerp(760, LX + 60, fly) - 40, q); arrowAt(ax, 1480 - 10 * i, -.04, 100, 'arI' + i); if (q > .85) h6Impact(ax + 30, 1480 - 10 * i, 60, (q - .85) * 4, 'pingI' + i); }
    // the spear: from Ravana's hand to Lakshman's chest
    if (thrown && !hit) h6Spear(lerp(650, LX + 40, easeIn(fly)), lerp(1470, 1500, fly), 300, Math.PI, t, 'spI');
    if (hit) { glow(LX - 6 * LKU * fall, LYG - 14 * LKU * (1 - fall) - 30 * fall, 160, H6.fire, .55); h6Impact(LX + 20, 1500, 260, g * 1.4, 'imI', '#FFE08A'); }
    camEnd();
    if (hit && g < .15) flash((1 - g / .15) * .7, '#FFF6D8');
    caps(t);
  }

  // ================= J · Lakshman lies blazing; Ravana runs up and seizes him (59.110) =================
  function shotGrab(t, lt, dur) {
    const g = t - GRAB, got = g > 0, walk = seg(t, J0 + .4, GRAB);
    camBegin(560, 1400 - lt * 3, 1.42 + .008 * lt);
    h5Field(t, 'fJ');
    const cx = 540, rx = lerp(1000, 560, easeOut(walk));
    const heads = got && g > .9 ? strainHeads(t, seg(t, GRAB + .9, GRAB + 2)) : eachHead(i => ({ eyes: 'happy', mouth: 'grin', goldTooth: i === 6 ? 1 : 0, hat: i === 0 ? 'cap' : i === 4 ? 'mukut' : 'crown', lookX: -.6, lookY: .5 }));
    if (!got) {
      glow(cx, 1720, 220, H6.fire, .4 + .1 * Math.sin(t * 6));
      lying(cx, 1730);
      RV(rx, 1700, 14, { heads, step: walk < 1 ? Math.sin(t * 9) : 0, dy: walk < 1 ? -.3 * Math.abs(Math.sin(t * 9)) : 0 });
    } else {
      glow(cx, 1720, 200, H6.fire, .3);
      gripShot(t, 560, 1700, 14, heads, { shake: g > .9 ? .6 : 0 });
      if (g > 1.5) { boilSeed('grabsw'); const [bx, by] = ravanaHead(560, 1700, 14, {}, 4); emote('sweat', bx + 60, by - 70, 18, popk(t, GRAB + 1.5, 6), g - 1.5); }
    }
    camEnd();
    caps(t);
  }

  // ================= K · he could lift Himalaya, Mandara, Meru, the three worlds (59.111) =================
  function shotMountains(t, lt, dur) {
    camBegin(540, 1300, 1.18 + .006 * lt);
    h5Field(t, 'fK');
    glow(560, 1720, 180, H6.fire, .25);
    gripShot(t, 560, 1700, 12, strainHeads(t), { shake: .5 });
    const bk = popk(t, K0 + .2, 5);
    h4Bubble(540, 1170, 380, 175, 560, 1360, bk, 'bbK');
    if (bk > .9) {
      // little Ravana, bored, juggling the lot over his head
      const bx = 540, by = 1310, q = t * 2.2;
      RV(bx, by, 2.6, { boilKey: 'rvK', noShadow: true, all: { eyes: 'sleepy', mouth: 'flat' }, handL: [-4.4, -26], handR: [4.4, -26], bendL: -1, bendR: -1 });
      const items = [['HIMALAYA', 0], ['MANDARA', 1], ['MERU', 2], [null, 3]];
      items.forEach(([n, i]) => {
        const k = popk(t, K0 + .5 + i * .45, 5); if (k < .05) return;
        const a = q + i * TAU / 4, x = bx + Math.cos(a) * 270, y = by - 170 + Math.sin(a) * 36 - 24 * Math.sin(a * 2);
        if (n) h6Peak(x, y + 50, 150 * k, n, 'pkK' + i); else h6Worlds(x, y, 140 * k, t, 'wdK');
      });
    }
    camEnd();
    caps(t);
  }

  // ================= L · …but he could not lift Lakshman (59.111, 113) =================
  function shotCannot(t, lt, dur) {
    const g = t - L0;
    camBegin(560, 1520 - lt * 4, 1.62 + .012 * lt);
    h5Field(t, 'fL');
    glow(560, 1720, 160, H6.fire, .25);
    const heads = strainHeads(t, 1);
    if (g > 2.6) for (const i of [0, 2, 7, 9]) heads[i] = { ...heads[i], eyes: i % 2 ? 'x' : 'swirl', mouth: 'wobble' };
    // his feet slip: he jerks and slides, Lakshman stays where he is
    const slip = Math.sin(t * 7) > .6 ? .5 : 0;
    gripShot(t, 560, 1700, 14, heads, { shake: .9, step: Math.sin(t * 11), dx: .3 * Math.sin(t * 23) * slip });
    for (let i = 0; i < 5; i++) { const q = frac(t * 1.6 + i / 5), [bx, by] = ravanaHead(560, 1700, 14, {}, i * 2); boilSeed('sw' + i); paint(ellPts(bx + (i % 2 ? 1 : -1) * (30 + q * 70), by - 20 + q * 60 - 80 * Math.sin(q * Math.PI), 6, 9, 8), { wash: '#BFE0F4', washOp: 255 * (1 - q), ink: null }); }
    if (g > 1.2) { boilSeed('lpL'); const [bx, by] = ravanaHead(560, 1700, 14, {}, 4); emote('!?', bx + 40, by - 90, 24, popk(t, L0 + 1.2, 6), g - 1.2); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, ['#F5C542', '#E8A030']);
  }

  // ================= M · Lakshman remembered he was a part of Vishnu (59.112) =================
  function shotVishnu(t, lt, dur) {
    const g = t - GLOW, k = ease(seg(t, GLOW, GLOW + 1.4));
    camBegin(560, 1600 - lt * 6, 1.8 + .01 * lt);
    h5Field(t, 'fM');
    // Ravana still straining behind him; the world dims as the light rises
    RV(560, 1700, 14, { sq: .1, shake: .5, heads: strainHeads(t), handL: [-4.8, -1.8], handR: [4.8, -1.8], dy: -.1 * Math.abs(Math.sin(t * 14)) });
    paint(rectPts(-300, -600, W + 600, 3400), { wash: '#2A1838', washOp: 150 * k, ink: null });
    glow(560, 1730, 380 * k, '#FFE08A', .5 * k); glow(560, 1720, 170 * k, '#FFFFFF', .5 * k);
    lying(560, 1730, { eyes: 'closed', mouth: k > .5 ? 'smile' : 'flat' });
    if (k > 0) {
      for (let i = 0; i < 8; i++) { const q = frac(t * .6 + i / 8); boilSeed('rise' + i); paint(starPts(440 + hash(i * 3.1) * 240, 1720 - q * 220, 10 * Math.sin(q * Math.PI) * k, .4, 4), { wash: '#FFF2C0', ink: null }); }
      const cy = 1560 - 14 * Math.sin(t * 1.5), a = popk(t, GLOW + .6, 3);
      glow(560, cy, 190 * a, '#FFE08A', .55 * a);
      push(); translate(490, cy + 26); scale(a); chakra(24, 1.2, t * 4); pop();
      push(); translate(630, cy + 30); scale(a); shankh(20, 1.2, .2); pop();
    }
    camEnd();
    caps(t);
    wipeIn(lt, ['#F5C542', '#E8A030']);
  }

  // ================= N · the fist like a thunderbolt; Ravana drops to his knees (59.114–115) =================
  function shotFist(t, lt, dur) {
    const g = t - PUNCH, hit = g >= 0, run = seg(t, RUSH, RUSH + .9), wind = seg(t, PUNCH - .7, PUNCH - .05);
    const sh = shk(t, PUNCH, 26, 2);
    camBegin(560 + Math.sin(t * 71) * sh, 1380 + Math.cos(t * 53) * sh * .7 - lt * 2, 1.32 + kick(t, PUNCH) * 2.4 - .04 * wind);
    h5Field(t, 'fN');
    const kneel = easeOut(seg(t, PUNCH + .1, PUNCH + .5));
    // Ravana: gripping, then knocked to his knees, dazed (he lets go)
    const RXN = 720;
    if (!hit) gripShot(t, RXN, 1700, 14, strainHeads(t), { shake: .5 });
    else {
      glow(RXN, 1720, 160, H6.fire, .2);
      lying(RXN, 1730, { eyes: 'closed', mouth: 'flat' });
      RV(RXN, 1700, 14, { dy: 4.2 * kneel, sq: .18 * kneel, dx: 1.4 * kneel, rot: .06 * kneel, knock: kneel, heads: eachHead(i => ({ eyes: 'swirl', mouth: g < .8 ? 'O' : 'wobble', hat: i === 0 ? 'cap' : i === 4 ? 'mukut' : 'crown', tilt: .2 * Math.sin(t * 4 + i) })),
        handL: [-6.4, -6], handR: [6.4, -6] });
      if (g > .4) { const [bx, by] = ravanaHead(RXN, 1700, 14, { dy: 4.2 * kneel, dx: 1.4 * kneel }, 4); h6Dizzy(bx, by - 70, 90, t, 'dzN', 4); }
    }
    // Hanuman: runs in, crouches (a held breath), and the punch
    const hxN = lerp(-160, 400, easeOut(run));
    const o = { ...HN, boilKey: 'hN', hx: .4, lookX: .9, eyes: 'angry', mouth: hit ? 'grin' : 'flat', puff: .3, tailSway: t * 7,
      walk: run > 0 && run < 1 ? t * 3 : undefined, sq: hit ? 0 : .12 * wind, dx: hit ? 3.2 * (1 - seg(t, PUNCH + .6, PUNCH + 1.2)) : -.6 * wind,
      handR: hit && g < .6 ? [10.4, -15.4] : wind > 0 ? [-.6, -14] : [3.4, -13], bendR: hit ? 0 : 1, handL: [-3.8, -14.4], bendL: 1,
      emote: run >= 1 && !hit ? 'anger' : null, emoteK: popk(t, RUSH + .9, 6), emoteAge: t - RUSH - .9 };
    if (run > 0 && run < 1) speedLines(hxN - 80, HY - 14 * HU, 160, 'spN', 5, 22);
    hanuman(hxN, 1700, 13, o);
    if (hit) { const [fx, fy] = naradaHand(hxN, 1700, 13, o, 1); h6Impact(fx + 40, fy, 360, g * 1.2, 'imN', '#FFF2A0'); sfx('BOOM!', fx + 60, fy - 210, 120, '#FFF2A0', g, { life: 1.2, stroke: H6.ink, sw: .25, rot: -.06 }); }
    camEnd();
    if (hit && g < .12) flash((1 - g / .12) * .9, '#FFFFFF');
    caps(t);
  }

  // ================= O · Hanuman lifts Lakshman with no effort at all (59.118) =================
  // Hanuman cradling Lakshman across his arms (his body over Hanuman's forearms, head screen left)
  const CRU = .8;
  const cradle = (x, y, u, t, ho = {}, lo = {}, lift = 1) => {
    const o = { ...HN, boilKey: 'hO', handL: [-3.6, -14.2], handR: [3.6, -14.2], bendL: 1, bendR: 1, ...ho };
    hanuman(x, y, u, o);
    const lu = u * CRU, ly = lerp(y + 2 * u, y - 13.6 * u + (ho.dy || 0) * u, lift);
    vanLakshman(x + 13 * lu, ly, lu, { ...LK, boilKey: 'lkO', rot: -Math.PI / 2, kodanda: false, ...lo });
  };
  function shotScoop(t, lt, dur) {
    const g = t - SCOOP, up = ease(seg(t, SCOOP, SCOOP + .6)), go = seg(t, O0 + 3.0, O0 + 4.4);
    camBegin(520, 1420 - lt * 3, 1.42 + .006 * lt);
    h5Field(t, 'fO');
    // Ravana on his knees at the right, every head gaping
    RV(860, 1700 + 4.2 * 13, 13, { sq: .18, knock: 1, heads: eachHead(i => ({ eyes: g > .6 ? 'wide' : 'swirl', mouth: 'O', hat: i === 0 ? 'cap' : i === 4 ? 'mukut' : 'crown', lookX: -1, tilt: .06 * Math.sin(t * 3 + i) })), handL: [-6, -6], handR: [6, -6] });
    if (g > .6) { boilSeed('gapeO'); const [bx, by] = ravanaHead(860, 1700 + 4.2 * 13, 13, {}, 4); emote('!?', bx - 20, by - 90, 22, popk(t, SCOOP + .6, 6), g - .6); }
    const x = 420 - go * 300;
    if (g < 0) { lying(470, 1730); hanuman(x, 1700, 13, { ...HN, boilKey: 'hO', bow: .3 * seg(t, O0, SCOOP), hx: .2, lookX: .3, lookY: .6, eyes: 'normal', mouth: 'smile', handL: [-4.2, -9], handR: [4.2, -9], tailSway: t * 2 }); }
    else cradle(x, 1700, 13, t, { eyes: 'happy', mouth: 'smile', blush: .4, tailSway: t * 4, walk: go > 0 ? t * 2.2 : undefined, dy: hop(g - .5, .18, 9, 2) }, {}, up);
    if (g > .4 && g < 1.4) sparkleBurst(x, 1700 - 16 * 13, 160, (g - .4) * .8, 'scoopspk', 8, ['#FFFFFF', GOLDC]);
    camEnd();
    caps(t);
    wipeOut(lt, dur, PEACH);
  }

  // ================= P · the twist: too heavy for Ravana, light for Hanuman: friendship and devotion (59.119) =================
  function shotTwist(t, lt, dur) {
    const g = t - WAKE, woke = g > 0;
    camBegin(540, 1180, 1.0 + .008 * lt);
    warmBack(t, 'wbP', 540, 1300);
    cradle(540, 1760, 21, t, { boilKey: 'hP', eyes: woke && g > .5 ? 'heart' : 'happy', mouth: 'smile', blush: .7, walk: t * 1.6, tailSway: t * 3, lookX: -.4, lookY: .4 },
      { boilKey: 'lkP', eyes: woke ? (g < .3 ? 'normal' : 'happy') : 'closed', mouth: woke ? 'smile' : 'flat', blush: woke ? .4 : 0 });
    hearts(540, 1760 - 30 * 21, t, P0 + 1.8, 'ph1', 3, 20); hearts(540, 1760 - 30 * 21, t, WAKE + .4, 'ph2', 3, 20);
    // a feather drifting down beside them: that's all he weighs
    boilSeed('feather'); const fq = frac((t - P0) * .25), fx = 820 + 40 * Math.sin(t * 2), fy = 1000 + fq * 600;
    if (t > P0 + .4) paint(ellPts(fx, fy, 38, 11, 12, 0, .4 * Math.sin(t * 2)), { wash: '#FFFFFF', ink: HSK.ink, sw: .6 });
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, FIELDW);
  }

  // ================= Q · "climb on my back, like Vishnu on Garuda" (59.124–126) =================
  const SHY = 15.9, SHB = .6;
  function shotGaruda(t, lt, dur) {
    const g = t - MOUNT, up = g >= 0, a = clamp(g / .5), go = easeIn(seg(t, MOUNT + 1.2, MOUNT + 2.6));
    camBegin(540 + 120 * go, 1250 - lt * 3, 1.0 + .006 * lt);
    h5Field(t, 'fQ');
    const HXQ = 380 + 380 * go, RXQ = 760, u = 17;
    const ho = { ...HN, boilKey: 'hQ', hx: .4, lookX: .9, eyes: up ? 'determined' : 'happy', mouth: up ? 'grin' : talk(t, Q0 + .2, Q0 + 1.4, 'grin', 'open'), blush: .4, tailSway: t * (up ? 7 : 3),
      bow: up ? 0 : .18, handL: up ? [-6, -15] : [-3.4, -13], handR: up ? [6, -15] : [4.8, -18.6], bendL: -1, bendR: -1, walk: go > 0 ? t * 3 : undefined };
    hanuman(HXQ, 1700, u, ho);
    const sy = 1700 - SHY * u;
    const ro = { boilKey: 'rmQ', noShadow: true, eyes: 'determined', mouth: 'flat', flip: true, kodanda: false };
    if (!up) vanRam(RXQ, 1700, 16, { ...ro, noShadow: false, kodanda: true, flip: false, eyes: 'happy', mouth: 'smile', lookX: -.8, hx: -.3 });
    else if (a < 1) { const e = ease(a), arc = 160 * Math.sin(a * Math.PI); vanRam(lerp(RXQ, HXQ, e), lerp(1700, sy, e) - arc, lerp(16, u * SHB, e), { ...ro, rot: -.4 * Math.sin(a * Math.PI) }); }
    else {
      const draw = seg(t, MOUNT + .7, MOUNT + 1.1);
      vanRam(HXQ, sy, u * SHB, { ...ro, sit: 1, handL: [-7.6, -18], bendL: .3, handR: [lerp(-2.6, -.4, draw), lerp(-14.4, -18.6, draw)], bendR: .9, armL: heldBow(draw) });
    }
    if (go > 0) { speedLines(HXQ - 120, 1700 - 12 * u, 200, 'spQ', 6, 26); poof(380, 1690, 200, (t - MOUNT - 1.2) / .6, 'dustQ', ['#E8C49A', '#C89A6A']); }
    // his bubble: Vishnu riding Garuda
    const bk = popk(t, Q0 + .3, 5) * (1 - seg(t, MOUNT + 1.0, MOUNT + 1.3));
    if (bk > .02) {
      h4Bubble(560, 1075, 250, 118, HXQ + 40, 1700 - 30 * u, bk, 'bbQ', '#FFF6DE');
      if (bk > .9) {
        const fly = { flap: Math.sin(t * 8), fly: true, pal: GARUDA_PAL, ring: false, hat: garudaCrown, brow: true }, s = 11;
        glow(560, 1070, 150, '#FFE08A', .4);
        kamaParrot(590, 1160, s, { ...fly, only: 'body' }); vishnu(...parrotSeat(590, 1160, s, fly), 10, { lookX: .5, eyes: 'happy' }); kamaParrot(590, 1160, s, { ...fly, only: 'wing' });
      }
    }
    camEnd();
    caps(t);
    wipeIn(lt, FIELDW);
    wipeOut(lt, dur, PEACH);
  }

  // ================= R · the ask: who carries you when you fall? =================
  function shotAsk(t, lt, dur) {
    const g = t - R0;
    camBegin(540, 1010, 1.0 + .01 * lt);
    warmBack(t, 'wbR', 540, 1150);
    hanuman(540, 1680, 27, { ...HN, boilKey: 'hR', sit: 1, pray: 1, bow: .1 + .05 * Math.sin(g * 2.4), eyes: blinkAt(t, R0 + 2.6) ? 'closed' : 'happy', mouth: 'smile', blush: .6, tailSway: t * 1.8 });
    hearts(540, 900, t, R0 + 1.0, 'rh1', 3, 22); hearts(540, 900, t, R0 + 2.6, 'rh2', 3, 22);
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, NIGHTW);
  }

  // ================= S · next: Bharat shot Hanuman out of the sky =================
  function shotNext(t, lt, dur) {
    const g = t - S0;
    camBegin(540, 1250, 1.0 + .012 * lt);
    h6Night(t, 'nS');
    const x = 420 + g * 60, y = 1470 + 10 * Math.sin(t * 3), u = 12;
    const o = { ...HN, boilKey: 'hS', rot: .35, eyes: g > 1.4 ? 'wide' : 'determined', mouth: g > 1.4 ? 'O' : 'grin', handL: [-2.4, -26.6], handR: [2.4, -26.6], bendL: -1, bendR: -1, tail: 'droop', noShadow: true };
    hanuman(x, y, u, o);
    const [px, py] = naradaHand(x, y, u, o, -1), [qx, qy] = naradaHand(x, y, u, o, 1);
    h6Herbs((px + qx) / 2, (py + qy) / 2 - 10, 230, t, 'hbS');
    speedLines(x - 140, y - 160, 160, 'spS', 5, 20);
    // the arrow, rising from the roofs
    const q = seg(t, S0 + .6, S0 + 2.6); if (q > 0 && q < 1) arrowAt(lerp(900, x + 60, q), lerp(1820, y - 60, q), -2.1, 130, 'arS');
    if (g > 1.4) { boilSeed('nxS'); emote('!', x + 190, y - 30 * u - 60, 24, popk(t, S0 + 1.4, 6), g - 1.4); }
    camEnd();
    caps(t);
    wipeIn(lt, NIGHTW);
  }
  function shotCard(t, lt, dur) { hsCard(t, CARDC); }

  shots([[0, shotHook], [B0, shotChariot], [C0, shotStand], [D0, shotAksha], [E0, shotSlap1], [F0, shotSlap2], [G0, shotPraise], [H0, shotShame], [I0, shotSpear],
    [J0, shotGrab], [K0, shotMountains], [L0, shotCannot], [M0, shotVishnu], [N0, shotFist], [O0, shotScoop], [P0, shotTwist], [Q0, shotGaruda], [R0, shotAsk], [S0, shotNext], [CARD, shotCard]]);
})();
