// rp10.js: Ramayan Part 10, "Lanka Burns" (69.6 s, Painted, no voice: captions in Bangers, retro cartoon SFX, a soft
// tanpura under Sita's prayer). Told from the Valmiki Ramayana, Sundara Kanda: Sita gives Hanuman her hair jewel (38);
// he decides to test Ravana's strength and wrecks the Ashoka grove, all but Sita's tree (41–42); he defeats Ravana's
// soldiers and his son Akshaya (42–47); Indrajit binds him with the Brahmastra, and he lets it hold him to meet Ravana
// (48); in the court he tells Ravana to give Sita back; Ravana orders him killed; Vibhishana says a messenger is never
// killed (51–52); Ravana has his tail wrapped in oiled cloth and set on fire; Sita prays to Agni and the fire is cool to
// him (53); he slips his bonds, leaps from roof to roof and burns Lanka, sparing Vibhishana's house (53–54); he puts out
// his tail in the sea, panics for Sita, and finds her safe (54–56). The Part 11 tease (Ram and the ocean) and the card.
// STORYBOARD.md has the plan and the sources; sets and cast in rp10_props.js, src/ramayan_sets.js, src/ramayan.js.
// Every time comes from src/scenes/rp10_tl.js (TL), which tools/rp10_sfx.mjs reads too.
(() => {
  const { B0, C0, D0, E0, F0, G0, H0, I0, J0, K0, GEM, THINK, BULB, SMASH, ARMY, SON, ROPES, LET, WINK, RET, KILL, VIBH, LIGHT, PRAY, COOL, AHH,
    SLIP, BURN, SPARE, DIP, PANIC, SAFE, CARD } = TL;
  window.RP10_T = TL;
  const talk = (t, a, b, rest, open = 'open') => t > a && t < b && Math.sin((t - a) * 15) > -.2 ? open : rest;

  const GOLDC = P10.gold;
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const CARDC = [RMY.maroon, RMY.saffron], GROVEC = [P10.grove, P10.ashokaDk], HALLC = [P10.hall, P10.pillarDk], FIREC = [P10.fireSky, P10.flame], DAWNC = [P10.dawnHi, P10.dawnSea];

  function caps(t) {
    for (const [a, b, ...lines] of TL.CAPS) {
      if (t < a || t > b) continue;
      let y = 480, prev = 0;
      lines.forEach((l, i) => {
        const huge = l[0] === '^', gold = huge || l.includes('*'), size = huge ? 112 : gold ? 88 : 74, age = a < 0 ? t - a : t - a - i * .35;
        if (i) y += (prev + size) * .56; prev = size;
        caption(l.replace(/[*^]/g, '').toUpperCase(), y, age, { life: b - a - (a < 0 ? 0 : i * .35), size, color: gold ? GOLDC : undefined });
      });
    }
  }
  const HN = { crown: false, gada: 0 };
  const sita = (x, y, u, o) => parvati(x, y, u, { pal: SITA_PAL, ...SITA_SKIN, ...o });
  // a guard bonked off into the sky: from (x, y) on hit, spinning up and out to the right, with tweeting stars
  const bonked = (x, y, u, t, t0, key, o = {}) => {
    const q = clamp((t - t0) / 1.1); if (q >= 1) return;
    guard(x + q * 700, y - Math.sin(q * Math.PI) * 600 - q * 300, u * (1 - q * .4), { boilKey: key, eyes: 'swirl', mouth: 'open', rot: q * 7, noShadow: true, ...o });
  };
  // the near roof Hanuman stands on (a flat roof with a parapet), its top at y
  const nearRoof = (y, key, x0 = -300, w = 1700, burnt = 0) => { boilSeed(key); paint(rectPts(x0, y, w, 1400), { wash: mixCol(P10.wall, '#5A3A2A', burnt), fill: P10.wallDk, fillOp: 50, tex: .5, ink: null }); for (let i = 0; i < 9; i++) paint(rectPts(x0 + 40 + i * 190, y - 40, 100, 44), { wash: mixCol(P10.wall, '#5A3A2A', burnt), ink: P10.ink, sw: .8 }); inkLine([[x0, y + 2], [x0 + w, y + 2]], 1, P10.ink, 'ink', 0); };

  // ================= A · the hook: Hanuman on a rooftop at night, his tail ablaze =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1280 - lt * 8, 1 + lt * .012);
    roofs(t, .15, 'ha');
    nearRoof(1660, 'har');
    const o = { ...HN, boilKey: 'hah', tail: 'curl', tailSway: t * 2, eyes: 'smug', mouth: 'grin', brow: -.4, lookX: .3, hx: .2, handL: [-4.6, -11.4], handR: [4.6, -11.4], bendL: -.6, bendR: -.6, dy: -Math.abs(Math.sin(t * 5)) * .15 };
    hanuman(400, 1660, 23, o);
    tailFire(400, 1660, 23, o, t, 1, 'haf');
    camEnd();
    caps(t);
    wipeOut(lt, dur, CARDC);
  }

  // ================= B · the ident =================
  function shotIdent(t, lt, dur) { ramayanIdent(t, lt, 10, 'LANKA BURNS'); wipeIn(lt, CARDC); wipeOut(lt, dur, GROVEC); }

  // ================= C · the grove: the jewel; "let's test Ravana!"; he smashes the grove, all but Sita's tree =================
  function shotGrove(t, lt, dur) {
    const z = ease(seg(t, SMASH - .3, SMASH + .4)), sh = shakeXY(t, t > SMASH && t < D0 - .6 ? 5 : 0);
    camBegin(lerp(560, 520, z) + sh[0], lerp(1400, 1330, z) + sh[1], lerp(1.15, .95, z));
    ashokaGrove(t, 'c', null);
    // the other trees (they fall, one by one, away from Sita's)
    const falls = [[200, -1, SMASH + .3], [560, 1, SMASH + .9], [40, 1, SMASH + 1.5]];
    for (const [x, d, t0] of falls) fallenTree(x, 1660, 440, easeIn(seg(t, t0, t0 + .5)), d, 'cft' + x);
    for (const [x, d, t0] of falls) poof(x + d * 330, 1640, 120, (t - t0 - .45) / .6, 'cfp' + x, ['#8A7A6A', '#6A5A4A']);
    ashokaTree(800, 1660, 760, 'cst', t);
    if (t > SMASH + 1.9) { emote('spark', 820, 960, 70, 1, t); glow(800, 1200, 260, '#FFE070', .2); }
    // Sita under her tree gives the jewel; watches the smashing wide-eyed
    const give = t > GEM - .4 && t < GEM + .6, smash = t > SMASH;
    sita(760, 1830, 20, { boilKey: 'cs', eyes: smash ? 'wide' : 'normal', mouth: smash ? 'O' : talk(t, C0 + .3, GEM - .3, 'smile'), lookX: -.7, hx: -.3,
      handR: give ? [-6.5, -15] : undefined, bendR: .4 });
    const hx = 380, hand = t < SMASH - .2;
    if (give) chudamani(...parvatiHand(760, 1830, 20, { handR: [-6.5, -15], bendR: .4 }, 1), 34, 1, 'cgem', t);
    // Hanuman: takes it (holds it up, sparkling), then turns to us with a sly grin and a bulb; then the gada comes out
    const swing = smash ? Math.sin((t - SMASH) * 7) : 0;
    const ho = { ...HN, boilKey: 'ch', tail: 'curl', tailSway: t * 2, lookX: t > THINK ? .2 : .8, hx: t > THINK ? 0 : .4,
      eyes: t > THINK ? 'smug' : t > GEM ? 'happy' : 'normal', mouth: t > THINK ? 'grin' : t > GEM ? 'smile' : 'O', brow: t > THINK ? -.4 : 0,
      handR: t > GEM && t < THINK ? [3.2, -16.6] : undefined, bendR: .4, gada: smash ? 1 : 0, gadaA: swing * 1.2,
      emote: t > BULB && t < SMASH ? 'bulb' : undefined, emoteK: 1, emoteAge: t - BULB, dy: smash ? -Math.abs(swing) * .3 : 0 };
    hanuman(hx, 1840, 18, ho);
    if (t > GEM && t < THINK) chudamani(...naradaHand(hx, 1840, 18, ho, 1).map((v, i) => i ? v - 18 : v), 30, 1, 'chgem', t);
    camEnd();
    caps(t);
    wipeIn(lt, GROVEC);
  }

  // ================= D · the army, then Akshaya: all bonked =================
  function shotArmy(t, lt, dur) {
    const sh = shakeXY(t, 4);
    camBegin(540 + sh[0], 1360 + sh[1], 1.0);
    ashokaGrove(t, 'd', null);
    fallenTree(820, 1660, 560, 1, 1, 'dft1'); fallenTree(-40, 1660, 560, 1, -1, 'dft2');
    // guards charge in from the right one after another; each is bonked away
    const hits = [ARMY + .7, ARMY + 1.3, ARMY + 1.9], akHit = SON + 1.1;
    hits.forEach((h, i) => {
      if (t < h) { const run = clamp((t - ARMY - i * .5) / .7); if (run > 0) guard(lerp(1250, 620, run), 1840, 13, { boilKey: 'dg' + i, kind: i === 1 ? 'munda' : 'chanda', eyes: 'angry', mouth: 'roar', walk: t * 3, flip: true, swordA: -.6 }); }
      else bonked(620, 1840, 13, t, h, 'dgb' + i, { kind: i === 1 ? 'munda' : 'chanda' });
    });
    if (t > SON - .3) {
      if (t < akHit) { const run = clamp((t - SON + .3) / .9); akshaya(lerp(1250, 640, ease(run)), 1840, 15, { boilKey: 'dak', eyes: 'angry', mouth: 'roar', walk: t * 3, flip: true, swordA: -.6 }); }
      else { const q = clamp((t - akHit) / 1.2); if (q < 1) akshaya(640 + q * 700, 1840 - Math.sin(q * Math.PI) * 600 - q * 300, 15 * (1 - q * .4), { boilKey: 'dakb', eyes: 'swirl', mouth: 'open', rot: q * 7, noShadow: true }); }
    }
    for (const h of [...hits, akHit]) if (t > h && t < h + .35) { boilSeed('dhit' + h); paint(starPts(560, 1500, 110 * backOut(seg(t, h, h + .15)), .45, 8), { wash: '#FFF2C0', ink: P10.ink, sw: 1 }); }
    // Hanuman swings the gada at each arrival; ends proud, the gada on his shoulder
    const lastHit = [...hits, akHit].filter(h => t > h - .3).pop(), sw = lastHit != null && t < lastHit + .4 ? Math.sin(seg(t, lastHit - .3, lastHit + .3) * Math.PI) : 0;
    const proud = t > akHit + .5;
    hanuman(330, 1840, 19, { ...HN, boilKey: 'dh', gada: 1, gadaA: -sw * 1.6, tail: 'curl', tailSway: t * 2, lookX: proud ? 0 : 1, hx: proud ? 0 : .4,
      eyes: proud ? 'happy' : 'determined', mouth: 'grin', puff: proud ? .6 : 0, lean: sw * 1.2, emote: proud ? 'spark' : undefined, emoteK: 1, emoteAge: t - akHit });
    camEnd();
    caps(t);
    wipeOut(lt, dur, HALLC);
  }

  // ================= E · Indrajit's Brahmastra; Hanuman lets it hold him (a wink) =================
  function shotIndrajit(t, lt, dur) {
    camBegin(540, 1380, 1.0 + lt * .01);
    ashokaGrove(t, 'e', null);
    const draw = ease(seg(t, E0 + .3, ROPES - .5)), shot = t > ROPES - .5;
    indrajit(840, 1840, 17, { boilKey: 'ei', flip: true, eyes: t > ROPES + .4 ? 'happy' : 'angry', mouth: t > ROPES + .4 ? 'laugh' : 'flat', handL: [-7, -15.5], bendL: .2, handR: [lerp(-3, -1, draw), -15], armL: heldBow(shot ? 0 : draw, !shot) });
    // the astra: a streak of gold light to Hanuman
    if (t > ROPES - .5 && t < ROPES) { const q = easeIn(seg(t, ROPES - .5, ROPES)), x = lerp(700, 420, q); glow(x, 1550, 120, '#FFE070', .8); boilSeed('east'); inkLine([[x, 1550], [x + 160, 1550]], 8, '#FFF2B0', 'ink', 0); }
    const rk = ease(seg(t, ROPES, ROPES + .9)), bound = t > ROPES;
    const ho = { ...HN, boilKey: 'eh', tail: 'droop', tailSway: t, lookX: t > LET ? .1 : .8, hx: t > LET ? 0 : .3, sq: bound ? .03 * Math.sin(t * 20) * (1 - rk) : 0,
      eyes: t > WINK && t < WINK + 1.4 ? ['normal', 'closed'] : t > LET ? 'happy' : bound ? 'wide' : 'determined', mouth: t > WINK ? 'grin' : bound ? 'O' : 'flat',
      handL: bound ? [-2.6, -13] : undefined, handR: bound ? [2.6, -13] : undefined, bendL: .3, bendR: .3, emote: t > WINK ? 'spark' : bound && t < LET ? '!' : undefined, emoteK: 1, emoteAge: t - (t > WINK ? WINK : ROPES) };
    hanuman(360, 1840, 19, ho);
    ropes(360, 1840, 19, rk, t, 'erp');
    camEnd();
    caps(t);
    wipeOut(lt, dur, HALLC);
  }

  // ================= F · the court: "give Sita back!"; "kill him!"; Vibhishana =================
  function shotCourt(t, lt, dur) {
    const c = kf(t, [[F0, [560, 1390, 1.25]], [KILL - .2, [560, 1390, 1.25]], [KILL + .3, [600, 1340, 1.35]], [VIBH, [600, 1340, 1.35]], [VIBH + .5, [600, 1390, 1.25]]], ease);
    const sh = shakeXY(t, t > KILL && t < KILL + .6 ? 7 : 0);
    camBegin(c[0] + sh[0], c[1] + sh[1], c[2]);
    court(t, 'f');
    throne(660, 1530, 420, 'fth');
    const mad = t > KILL - .1, turn = t > VIBH + .3;
    ravana(660, 1580, 16, { boilKey: 'fr', sit: true, shake: mad && t < KILL + 1 ? .5 : 0,
      all: { eyes: turn ? 'side' : mad ? 'angry' : 'narrow', brows: mad ? -.9 : -.2, mouth: mad && !turn ? talk(t, KILL, KILL + 1.2, 'teeth', 'open') : turn ? 'pout' : 'flat', lookX: turn ? 1 : -1, emote: mad && !turn ? 'anger' : undefined, emoteK: 1, emoteAge: t - KILL },
      heads: { 0: { eyes: mad ? 'wide' : 'sleepy', bubble: mad ? 0 : 1 }, 1: { mouth: 'chew' }, 9: { eyes: turn ? 'side' : 'sly' } } });
    // Hanuman, bound, before the throne
    hanuman(330, 1700, 16, { ...HN, boilKey: 'fh', tail: 'droop', tailSway: t, lookX: turn ? .9 : .8, hx: .3, eyes: mad && !turn ? 'determined' : 'normal', mouth: talk(t, RET, KILL - .3, mad ? 'flat' : 'smile'),
      handL: [-2.6, -13], handR: [2.6, -13], bendL: .3, bendR: .3, emote: mad && !turn ? 'sweat' : undefined, emoteK: 1, emoteAge: t - KILL });
    ropes(330, 1700, 16, 1, t, 'frp', .5);
    // Vibhishana steps in from the right
    if (t > VIBH - .5) { const k = ease(seg(t, VIBH - .5, VIBH + .2)); vibhishana(lerp(1250, 940, k), 1720, 14, { boilKey: 'fv', flip: true, walk: k < 1 ? t * 2.5 : undefined, eyes: 'normal', mouth: talk(t, VIBH + .2, G0 - .4, 'flat'), lookX: -1, handR: [-6, -16], bendR: .3 }); }
    camEnd();
    caps(t);
    wipeIn(lt, HALLC);
    wipeOut(lt, dur, FIREC);
  }

  // ================= G · the tail is wrapped and lit =================
  function shotTail(t, lt, dur) {
    camBegin(540, 1380, 1.05);
    roofs(t, 0, 'g');
    nearRoof(1700, 'gr');
    const o = { ...HN, boilKey: 'gh', tail: 'droop', tailSway: t * .5, lookX: .9, hx: .4, eyes: t > LIGHT ? 'wide' : 'normal', mouth: t > LIGHT ? 'O' : 'flat',
      handL: [-2.6, -13], handR: [2.6, -13], bendL: .3, bendR: .3, emote: t > LIGHT + .2 ? '!!' : undefined, emoteK: 1, emoteAge: t - LIGHT };
    hanuman(330, 1700, 18, o);
    ropes(330, 1700, 18, 1, t, 'grp', .5);
    // the tail wrapped in cloth: stripes along it, then lit from the tip
    const P = _hnmTailPts(o); boilSeed('gwrap');
    for (let i = 2; i < P.length; i++) { const [a, b] = P[i]; paint(ellPts(330 + a * 18, 1700 + b * 18, 12, 14, 8), { wash: '#E8DCC0', ink: P10.ink, sw: .5 }); }
    tailFire(330, 1700, 18, o, t, ease(seg(t, LIGHT, LIGHT + 1.2)), 'gtf');
    // a guard with a torch on the right, laughing; he touches the torch to the tail's tip
    const reach = ease(seg(t, LIGHT - .8, LIGHT)) * (1 - ease(seg(t, LIGHT + .3, LIGHT + .8)));
    const go = { boilKey: 'gg', kind: 'munda', sword: false, flip: true, eyes: t > LIGHT ? 'happy' : 'normal', mouth: t > LIGHT ? 'laugh' : 'grin', handR: [lerp(-4, -8, reach), lerp(-14, -11, reach)], bendR: .3 };
    guard(760, 1700, 15, go);
    const [tx, ty] = asuraHand(760, 1700, 15, go, 1);
    boilSeed('gtorch'); inkLine([[tx, ty + 30], [tx - 20, ty - 60]], 7, '#6A4A2A', 'ink', 0); flames(tx - 22, ty - 56, 60, t, 1, 'gtfl');
    camEnd();
    caps(t);
    wipeIn(lt, FIREC);
    wipeOut(lt, dur, GROVEC);
  }

  // ================= G2 · Sita prays to Agni: "be cool for him!" =================
  function shotPray(t, lt, dur) {
    camBegin(560, 1400, 1.2 + lt * .02);
    ashokaGrove(t, 'p', 760, 760);
    const k = ease(seg(t, PRAY + .4, PRAY + 1.4));
    glow(640, 1300, 360, '#FFD070', .35 * k);
    sita(640, 1830, 21, { boilKey: 'ps', pray: 1, eyes: 'closed', mouth: talk(t, PRAY + .8, COOL - .4, 'smile'), lookY: -.3 });
    if (k > 0) { boilSeed('psp'); for (let i = 0; i < 6; i++) { const q = frac(t * .5 + i / 6); paint(starPts(640 + Math.sin(i * 2.3) * 220, 1500 - q * 700, 10 * Math.sin(q * Math.PI) * k, .4, 4), { wash: '#FFF0C0', ink: null }); } }
    camEnd();
    caps(t);
    wipeIn(lt, GROVEC);
    wipeOut(lt, dur, FIREC);
  }

  // ================= G3 · the fire feels cool: "ahh" =================
  function shotCool(t, lt, dur) {
    camBegin(480, 1380, 1.2);
    roofs(t, .1, 'q');
    nearRoof(1700, 'qr');
    const ah = t > AHH;
    const o = { ...HN, boilKey: 'qh', tail: 'curl', tailSway: t * 1.5, lookX: .2, eyes: ah ? 'closed' : 'wide', mouth: ah ? 'smile' : 'O', blush: ah ? .7 : 0,
      handL: [-2.6, -13], handR: [2.6, -13], bendL: .3, bendR: .3, emote: ah ? 'hearts' : undefined, emoteK: 1, emoteAge: t - AHH, dy: ah ? -Math.sin((t - AHH) * 4) * .15 : 0 };
    hanuman(360, 1700, 19, o);
    ropes(360, 1700, 19, 1, t, 'qrp', .5);
    tailFire(360, 1700, 19, o, t, 1, 'qtf');
    // cool sparkles (snowflake glints) round the flames
    if (ah) { const [tx, ty] = hanumanTail(360, 1700, 19, o); boilSeed('qcool'); for (let i = 0; i < 6; i++) { const q = frac(t * .9 + i / 6), a = i * 1.05; paint(starPts(tx + Math.cos(a) * 140 * q, ty + Math.sin(a) * 100 * q - 40, 14 * Math.sin(q * Math.PI), .3, 6), { wash: '#D8F0FF', ink: null }); } }
    camEnd();
    caps(t);
    wipeIn(lt, FIREC);
  }

  // ================= H · roof to roof; Lanka burns; Vibhishana's house spared =================
  function shotBurn(t, lt, dur) {
    const burn = clamp(seg(t, SLIP + .5, BURN + .4)), sh = shakeXY(t, t > BURN && t < BURN + .5 ? 5 : 0);
    camBegin(540 + sh[0], 1330 + sh[1], 1.0);
    roofs(t, burn, 'h');
    // Vibhishana's house: a small white house with a green dome and a lamp, left untouched (at SPARE it sparkles)
    boilSeed('hvib'); const vx = 170, vy = 1700;
    paint(rectPts(vx - 110, vy - 220, 220, 260), { wash: '#F2ECDC', fill: '#D2C8B0', fillOp: 50, tex: .4, ink: P10.ink, sw: .9 });
    paint(ellPts(vx, vy - 220, 96, 80, 18), { wash: '#5EA86A', ink: P10.ink, sw: .9 });
    paint(rectPts(vx - 26, vy - 120, 52, 70), { wash: '#FFE9A0', ink: P10.ink, sw: .6 });
    if (t > SPARE) { glow(vx, vy - 160, 260, '#FFF0B0', .35); emote('spark', vx + 120, vy - 330, 70, 1, t); }
    nearRoof(1720, 'hr', 300, 1400, burn);
    if (burn > .2) for (let i = 0; i < 4; i++) flames(420 + i * 190, 1690, 110, t + i, clamp(burn * 4 - i * .8), 'hnf' + i);
    // the slip: a poof, the ropes gone; then hops along the roofs, tail ablaze; at SPARE he points back at the house
    if (t > SLIP - .1 && t < SLIP + .5) poof(560, 1500, 160, (t - SLIP + .1) / .6, 'hpf');
    const hopT = seg(t, SLIP + .5, BURN), n = 4, hi = Math.min(n - 1, Math.floor(hopT * n)), hq = hopT * n - hi;
    const xs = [560, 760, 380, 620, 700], x = t < BURN ? lerp(xs[hi], xs[hi + 1], ease(hq)) : 700, y = t < BURN ? 1720 - Math.sin(hq * Math.PI) * 420 : 1720;
    const o = { ...HN, boilKey: 'hh', tail: 'curl', tailSway: t * 3, lookX: t > SPARE ? -1 : .4, hx: t > SPARE ? -.4 : .2, eyes: t > BURN ? 'happy' : 'determined', mouth: 'grin',
      sq: t < BURN && hq > .85 ? .15 : 0, noShadow: t < BURN && hq > .05 && hq < .95, handL: t > SPARE ? [-7.6, -17] : undefined, bendL: .2, dy: t > BURN && t < SPARE ? -Math.abs(Math.sin(t * 6)) * .4 : 0 };
    if (t > SLIP) { hanuman(x, y, 17, o); tailFire(x, y, 17, o, t, 1, 'htf'); }
    else { hanuman(560, 1720, 17, { ...o, tail: 'droop', handL: [-2.6, -13], handR: [2.6, -13], bendL: .3, bendR: .3, eyes: 'smug' }); ropes(560, 1720, 17, 1, t, 'hrp', .5); }
    camEnd();
    caps(t);
    wipeIn(lt, FIREC);
    wipeOut(lt, dur, [P10.sea, P10.fireSky]);
  }

  // ================= I · the sea: the tail dipped; "is Sita safe?!" =================
  function shotSea(t, lt, dur) {
    camBegin(540, 1380, 1.05);
    nightShore(t, 'i');
    const dip = ease(seg(t, DIP - .3, DIP + .2)), panic = t > PANIC;
    const o = { ...HN, boilKey: 'ih', tail: 'droop', tailSway: t * .5, lookX: panic ? 0 : .6, hx: panic ? 0 : .3, eyes: panic ? 'wide' : t > DIP + .3 ? 'happy' : 'normal', mouth: panic ? 'scream' : t > DIP + .3 ? 'smile' : 'flat',
      handL: panic ? [-2.6, -19.4] : undefined, handR: panic ? [2.6, -19.4] : undefined, bendL: .3, bendR: .3, sweat: panic, emote: panic ? '!!' : undefined, emoteK: 1, emoteAge: t - PANIC, dy: dip * .6 };
    hanuman(420, 1640, 20, o);
    if (t < DIP) tailFire(420, 1640, 20, o, t, 1, 'itf');
    // the water over his legs (he stands in the shallows)
    boilSeed('iwater'); paint(rectPts(-300, 1560, 1700, 900), { wash: P10.sea, washOp: 235, ink: null }); inkLine([[-300, 1562], [1400, 1562]], 1.2, P10.seaLt, 'inkfine', .3);
    steam(560, 1540, 120, (t - DIP) / 1.4, 'ist');
    camEnd();
    caps(t);
    wipeOut(lt, dur, GROVEC);
  }

  // ================= I2 · Sita is safe: she waves; Hanuman sighs with relief =================
  function shotSafe(t, lt, dur) {
    camBegin(560, 1400, 1.1);
    ashokaGrove(t, 's', 760, 760);
    sita(700, 1830, 20, { boilKey: 'ss', eyes: 'happy', mouth: 'smile', lookX: -.6, hx: -.3, handR: [-5, -21 + Math.sin(t * 8) * 1.2], bendR: .3 });
    const ar = easeOut(seg(t, SAFE, SAFE + .6));
    hanuman(lerp(-150, 340, ar), 1840, 17, { ...HN, boilKey: 'sh', tail: 'droop', tailSway: t * 2, lookX: .8, hx: .3, eyes: t > SAFE + .9 ? 'closed' : 'wide', mouth: t > SAFE + .9 ? 'smile' : 'O', walk: ar < 1 ? t * 3 : undefined,
      sq: t > SAFE + .9 ? .08 * Math.sin((t - SAFE - .9) * 3) : 0, emote: t > SAFE + .9 ? 'hearts' : undefined, emoteK: 1, emoteAge: t - SAFE - .9 });
    camEnd();
    caps(t);
    wipeIn(lt, GROVEC);
    wipeOut(lt, dur, DAWNC);
  }

  // ================= J · the tease: Ram at the shore, the bow drawn at the ocean =================
  const bowPose = (draw, o = {}) => ({ flip: true, handL: [-7.6, -18], bendL: .3, handR: [lerp(-2.6, -.4, draw), lerp(-14.4, -18.6, draw)], bendR: .9, kodanda: false, armL: heldBow(draw), ...o });
  function shotTease(t, lt, dur) {
    camBegin(540, 1360, 1.0 + lt * .015);
    dawnShore(t, 'j');
    const draw = ease(seg(t, J0 + .8, J0 + 2.2));
    ram(260, 1860, 24, { boilKey: 'jr', eyes: 'angry', brow: -.7, mouth: 'flat', hx: -.5, lookX: -1, ...bowPose(draw), emote: draw > .9 ? 'anger' : undefined, emoteK: 1, emoteAge: t - J0 - 2.2 });
    camEnd();
    caps(t);
    wipeIn(lt, DAWNC);
    wipeOut(lt, dur, CARDC);
  }

  // ================= K · the follow card =================
  function shotCard(t, lt) { followCard(t, lt, { part: 11, title: 'RAM VS THE OCEAN', at: CARD, ask: 'Comment JAI BAJRANGBALI 🙏' }); wipeIn(lt, CARDC); }

  shots([[0, shotHook], [B0, shotIdent], [C0, shotGrove], [D0, shotArmy], [E0, shotIndrajit], [F0, shotCourt], [G0, shotTail], [PRAY, shotPray], [COOL, shotCool],
    [H0, shotBurn], [I0, shotSea], [SAFE, shotSafe], [J0, shotTease], [K0, shotCard]]);
})();
