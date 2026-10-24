// rp9.js: Ramayan Part 9, "Hanuman's Leap" (77.0 s, Painted, no voice: captions in Bangers, retro cartoon SFX, a soft
// tanpura under Sita in the grove). Told from the Valmiki Ramayana: to find Sita, Hanuman makes himself huge and pushes
// off Mount Mahendra, which shakes under him (Kishkindha 67, Sundara 1); the Ocean raises the golden mountain Mainaka for
// him to rest on, and he touches it and flies on (Sundara 1); the gods send Surasa, mother of snakes, in a monster's
// form to test him: he grows, she opens wider, then he shrinks to a thumb's size, goes in and out, and she blesses him
// (Sundara 1); Simhika catches him by his shadow, he goes into her mouth and out, and she falls into the sea (Sundara 1);
// he sees Lanka, a city of gold, and at night shrinks to a cat's size (Sundara 2); in Ravana's palace he takes a queen
// asleep for Sita, kisses his tail and dances, then knows Sita would never sleep happy there (Sundara 10–11); in the
// Ashoka grove he finds Sita under a tree, softly tells Ram's story and gives her Ram's ring (Sundara 15, 31, 36). The
// Part 10 tease (Lanka burns) and the follow card.
// STORYBOARD.md has the plan and the sources; sets and cast in rp9_props.js, src/ramayan_sets.js, src/ramayan.js. Every
// time comes from src/scenes/rp9_tl.js (TL), which tools/rp9_sfx.mjs reads too.
(() => {
  const { GULP, B0, C0, D0, E0, F0, G0, H0, I0, J0, K0, BIG, PRESS, LEAP, RISE, MAIN, THANKS, PAT, SURA, GROW, GROW1, GROW2, TINY, ZIPIN, ZIPOUT, BLESS,
    GRAB, SIMH, THRU, SANK, LAND, CAT, SHRINK, QUEEN, JOY, DOUBT, SHAKE, SING, LOOK, RING, TAKE, CARD } = TL;
  window.RP9_T = TL;
  // a mouth that flaps while a character speaks a caption's line (a..b), else the resting one
  const talk = (t, a, b, rest, open = 'open') => t > a && t < b && Math.sin((t - a) * 15) > -.2 ? open : rest;

  const GOLDC = P9.gold;
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const CARDC = [RMY.maroon, RMY.saffron], SEAC = [P9.sea, P9.skyHi], DUSKC = [P9.duskHi, P9.sea], NIGHTC = [P9.hall, P9.nightHi], GROVEC = [P9.grove, P9.ashokaDk];

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
  // Hanuman on the mission: no mukut, no gada (as in Part 8's tease)
  const HN = { crown: false, gada: 0 };
  // flying to screen right, one fist forward: (x, y) is his ground point, so rot tips him about his feet
  const flyO = (t, extra = {}) => ({ ...HN, rot: 1.2, handR: [2.4, -24.5], bendR: .15, handL: [-4.6, -11], bendL: -.3, tail: 'droop', tailSway: t * 4, eyes: 'determined', mouth: 'grin', lookX: 1, hx: .4, ...extra });
  // speed lines streaming behind a flyer at (x, y)
  const speedLines = (x, y, len, key, t, n = 5) => { boilSeed(key); for (let i = 0; i < n; i++) { const q = frac(t * 2.4 + i / n), yy = y + (i - (n - 1) / 2) * 34; inkLine([[x - 60 - q * len, yy], [x - 60 - q * len - len * .5, yy]], 2, '#FFFFFF', 'inkfine', 0); } };
  // a tiny Hanuman: a gold speck with a glow and a comet tail, for the thumb-sized zips
  const speck = (x, y, key, dir = 1, t = T) => {
    glow(x, y, 120, '#FFE070', .8); boilSeed(key);
    for (let i = 1; i <= 4; i++) paint(starPts(x - dir * i * 34, y + 8 * Math.sin(t * 20 + i), 14 - i * 2.4, .4, 4), { wash: '#FFF6C8', ink: null });
    paint(ellPts(x, y, 22, 22, 12), { wash: HNM.fur, ink: '#FFF6DA', sw: 2.2 }); paint(ellPts(x + dir * 4, y - 3, 10, 8, 8), { wash: HNM.mask, ink: null });
  };

  // ================= A · the hook: tiny Hanuman flies into Surasa's open mouth; gulp =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1250 - lt * 8, 1 + lt * .012);
    openSea(t, 'ha', { hy: 1760 });
    const shut = t > GULP, sk = shut ? spring(t, GULP, 7, 18) : 0;
    surasa(600, 1190, 520, { key: 'has', open: shut ? 0 : 1.05 + .05 * Math.sin(t * 3), eyes: shut ? 'wide' : 'normal', look: shut ? 0 : -.7, blush: shut ? .6 : 0, sway: t, flick: shut ? 0 : undefined });
    frontSea(t, 1760, 'hafs');
    if (shut) { emote('?', 900, 940, 90 * backOut(clamp((t - GULP - .1) * 3)), 1, t); }
    // he zooms down at her mouth from the upper left
    const k = easeIn(seg(t, 0, GULP)), mx = 600, my = 1190 + 520 * .2 + 520 * .4 * .55;
    if (!shut) {
      const x = lerp(150, mx, k), y = lerp(1100, my, k), u = lerp(11, 4, k);
      glow(x, y - 10 * u, 90, '#FFE070', .4);
      speedLines(x, y - 12 * u, 120, 'hasl', t, 3);
      hanuman(x, y, u, flyO(t, { boilKey: 'hah', rot: .95, eyes: 'happy', mouth: 'grin', noShadow: true }));
    }
    camEnd();
    caps(t);
    wipeOut(lt, dur, CARDC);
  }

  // ================= B · the ident =================
  function shotIdent(t, lt, dur) { ramayanIdent(t, lt, 9, "HANUMAN'S LEAP"); wipeIn(lt, CARDC); wipeOut(lt, dur, SEAC); }

  // ================= C · Mount Mahendra: he grows huge, presses down, the mountain shakes; he leaps =================
  function shotMahendra(t, lt, dur) {
    const z = easeOut(seg(t, BIG - .2, BIG + 1.2)), sh = shakeXY(t, t > PRESS && t < LEAP - .3 ? 7 : 0);
    camBegin(540 + sh[0], lerp(1380, 900, z) + sh[1], lerp(1.25, .8, z));
    const pin = easeOut(seg(t, PRESS, PRESS + .5)), spr = t > LEAP ? -.12 * Math.exp(-(t - LEAP) * 4) * Math.cos((t - LEAP) * 14) : 0;
    const press = t < LEAP ? pin * (1 + .08 * Math.sin(t * 22)) : spr, top = 1500 + 1300 * .14 * Math.max(0, press);
    mahendra(t, 540, 1500, 1300, press, 'cm');
    // springs squirt from its sides, birds burst off the trees, a snake pops out of a hole: "?"
    if (t > PRESS + .2 && t < LEAP + .4) {
      const q = clamp((t - PRESS - .2) * 2), f = t > LEAP ? 1 - (t - LEAP) / .4 : 1;
      boilSeed('cmjet');
      for (const [sx, d] of [[200, -1], [880, 1], [330, -1], [760, 1]]) { const by = top + 260 + Math.abs(sx - 540) * .5, h = 260 * q * f * (1 + .1 * Math.sin(t * 20 + sx)); paint(ribbon([[sx, by], [sx + d * h * .4, by - h * .8], [sx + d * h * .9, by - h * .5]], 26, 8), { wash: P9.seaLt, washOp: 220, ink: null }); }
      for (let i = 0; i < 6; i++) { const bq = clamp((t - PRESS - .3 - i * .12) * .9), bx = 300 + i * 90 + bq * (i % 2 ? 400 : -400), by = top + 200 - bq * 700 - i * 30; if (bq > 0) { const fl = Math.sin(t * 24 + i) * 12; inkLine([[bx - 18, by - fl], [bx, by], [bx + 18, by - fl]], 2.4, P9.ink, 'ink', .3); } }
      const sn = backOut(clamp((t - PRESS - .6) * 3)); if (sn > 0) { const sx = 640, sy = top + 330; boilSeed('cmsn'); paint(ribbon([[sx, sy + 20], [sx + 8, sy - 30 * sn], [sx, sy - 60 * sn]], 22, 18), { wash: P9.snake, ink: P9.ink, sw: .8 }); paint(ellPts(sx, sy - 66 * sn, 20, 15, 12), { wash: P9.snake, ink: P9.ink, sw: .8 }); emote('?', sx + 40, sy - 130 * sn, 50 * sn, 1, t); }
    }
    // Hanuman on the top: grows (an elastic stretch), squats to press, crouches and launches up out of frame
    const g = t < BIG - .3 ? 0 : clamp(elasticOut(seg(t, BIG - .3, BIG + .9))), u = lerp(9, 30, g);
    const crouch = ease(seg(t, LEAP - .5, LEAP)), up = easeIn(seg(t, LEAP, LEAP + .5));
    const sq = t < LEAP ? .1 * pin + .2 * crouch : -.25 * (1 - up), dy = -up * 70;
    hanuman(540, top + 6, u, { ...HN, boilKey: 'cmh', eyes: t > PRESS ? 'determined' : g > .1 ? 'happy' : 'normal', mouth: t > PRESS ? 'grin' : g > .1 ? 'grin' : 'smile', lookX: .6, hx: .3,
      sq, dy, handL: t > PRESS - .2 ? [-5.5, -12] : undefined, handR: t > PRESS - .2 ? [5.5, -12] : undefined, bendL: .4, bendR: .4, tail: 'curl', noShadow: up > 0,
      emote: t > BIG + .4 && t < PRESS ? 'spark' : undefined, emoteK: 1, emoteAge: t - BIG });
    if (t > LEAP && t < LEAP + .6) poof(540, top + 10, 160, (t - LEAP) / .6, 'cmpf', ['#E8D8C0', '#D2C0A0']);
    camEnd();
    caps(t);
    wipeOut(lt, dur, SEAC);
  }

  // ================= D · over the sea: Mainaka rises, "rest on me!"; he touches it and flies on =================
  function shotMainaka(t, lt, dur) {
    camBegin(540, 1250, 1.0);
    const dist = t * 900, hy = 1580;
    openSea(t, 'd', { hy, dist });
    // Mainaka rises ahead (it rides the sea's drift a little once up)
    const rise = easeOut(seg(t, RISE, RISE + .9)), mx = 880 - Math.max(0, t - THANKS - .6) * 260;
    if (t > RISE - .1) { mainaka(mx, hy, 430, rise, { key: 'dmk', mouth: t > MAIN && t < THANKS - .3 ? talk(t, MAIN, THANKS - .4, 'smile') : t > PAT ? 'grin' : 'smile', eyes: t > PAT ? 'closed' : 'happy' }); frontSea(t, hy, 'dfs', dist); splash(mx, hy, 520, (t - RISE) / 1.1, 'dspl'); }
    // Hanuman flies right; at the pat he dips to touch the peak with his fist, then zooms off to the right
    const u = 17, bob = Math.sin(t * 2.2) * 14;
    const pk = [mx + 430 * .9 * .1, hy - 430 ], dip = ease(seg(t, THANKS - .3, PAT)) * (1 - ease(seg(t, PAT + .5, PAT + 1))), off = easeIn(seg(t, PAT + .9, E0));
    const o = flyO(t, { boilKey: 'dh', eyes: t > MAIN + .2 && t < THANKS ? 'wide' : 'happy', mouth: t > PAT && t < PAT + 1 ? talk(t, PAT, PAT + .6, 'grin') : t > MAIN + .2 && t < THANKS ? 'O' : 'grin',
      emote: t > MAIN + .3 && t < THANKS ? '!' : t > PAT && t < PAT + 1.2 ? 'heart' : undefined, emoteK: 1, emoteAge: t - (t > PAT ? PAT : MAIN), noShadow: true });
    const hand = naradaHand(0, 0, u, o, 1), cruise = [90, 1420 + bob], touch = [pk[0] - hand[0], pk[1] - 10 - hand[1]];
    const hx = lerp(lerp(cruise[0], touch[0], dip), 1500, off), hyy = lerp(cruise[1], touch[1], dip);
    speedLines(hx - 60, hyy - 200, 160, 'dsl', t);
    hanuman(hx, hyy, u, o);
    if (t > PAT - .05 && t < PAT + .4) { boilSeed('dpat'); for (let i = 0; i < 5; i++) { const a = -Math.PI * (.1 + .8 * i / 4), r = 30 + (t - PAT) * 200; paint(starPts(pk[0] + Math.cos(a) * r, pk[1] - 10 + Math.sin(a) * r, 10, .4, 4), { wash: '#FFF6DA', ink: null }); } }
    camEnd();
    caps(t);
    wipeIn(lt, SEAC);
  }

  // ================= E · Surasa: "into my mouth!"; bigger / wider; tiny as a thumb; in and out; she blesses him =================
  function shotSurasa(t, lt, dur) {
    const zb = ease(seg(t, GROW1, GROW2 + .6));
    camBegin(540, lerp(1250, 1200, zb), lerp(1.0, .92, zb));
    openSea(t, 'e', { hy: 1700, dist: t * 60 });
    // she rises out of the sea on the right
    const up = easeOut(seg(t, SURA, SURA + .8)), sx = 740, sy = lerp(2000, 1150, up), S = 380;
    const op = t < GROW - .3 ? (t > E0 + .5 && Math.sin((t - E0) * 13) > 0 && t < GROW - .8 ? .45 : t > GROW - .8 ? lerp(.45, 1.0, ease(seg(t, GROW - .8, GROW - .4))) : 0)
      : t < BLESS ? lerp(1.0, lerp(1.3, 1.65, ease(seg(t, GROW2 + .4, GROW2 + .8))), ease(seg(t, GROW1 + .4, GROW1 + .8))) * (t > ZIPIN + .35 && t < ZIPOUT ? .25 : 1)
      : lerp(1.65, 0, ease(seg(t, BLESS, BLESS + .4)));
    const se = t > BLESS ? 'happy' : t > ZIPIN + .35 && t < ZIPOUT + .3 ? 'wide' : t > TINY ? 'wide' : 'normal';
    surasa(sx, sy, S, { key: 'es', open: op, eyes: se, look: -.8, blush: t > BLESS ? .9 : 0, sway: t, flick: op > 0 ? 0 : undefined });
    frontSea(t, 1700, 'efs', t * 60);
    if (t > ZIPIN + .35 && t < ZIPOUT) emote('?', sx + 170, sy - 260, 80, 1, t);
    if (t > BLESS + .3) { glow(250, 1250, 260, '#FFE070', .4 * clamp((t - BLESS - .3) * 2)); emote('hearts', sx + 200, sy - 240, 80, clamp((t - BLESS - .3) * 3), t - BLESS); }
    // Hanuman hovers on the left; grows twice; shrinks to a speck, zips in and out; full size again; bows
    const g1 = clamp(elasticOut(seg(t, GROW1, GROW1 + .7))), g2 = clamp(elasticOut(seg(t, GROW2, GROW2 + .7))), back = backOut(clamp((t - ZIPOUT - .1) * 3));
    const tiny = t > TINY + .1 && t < ZIPOUT + .1;
    const mouthAt = [sx, sy + S * .2 + S * (.04 + .36 * 1.65) * .55];
    if (t > TINY - .1 && t < TINY + .5) poof(250, 1250, 140, (t - TINY + .1) / .6, 'epf');
    if (tiny) {
      const zin = easeIn(seg(t, ZIPIN, ZIPIN + .35)), zout = easeOut(seg(t, ZIPOUT - .1, ZIPOUT + .2));
      if (t < ZIPIN + .35) speck(lerp(250, mouthAt[0], zin) + Math.sin(t * 9) * (1 - zin) * 20, lerp(1250, mouthAt[1], zin) - Math.sin(zin * Math.PI) * 160, 'esp', 1, t);
      else if (t > ZIPOUT - .1) speck(lerp(mouthAt[0], 250, zout), lerp(mouthAt[1], 1250, zout) - Math.sin(zout * Math.PI) * 200, 'esp', -1, t);
    } else {
      const u = t > ZIPOUT ? 12 * back : 12 + 6 * g1 + 6 * g2, bow = t > BLESS + .4;
      hanuman(250, 1560 + Math.sin(t * 2.4) * 10, u, { ...HN, boilKey: 'eh', rot: .18, tail: 'droop', tailSway: t * 3, noShadow: true, lookX: .8, hx: .3,
        eyes: t > BLESS ? 'happy' : t > GROW1 && t < TINY ? 'determined' : 'normal', mouth: t > BLESS ? 'smile' : t > GROW1 ? 'grin' : 'O', pray: bow ? 1 : 0, bow: bow ? .3 : 0, sq: t > GROW1 && t < TINY ? -.06 * Math.sin((t - GROW1) * 12) : 0,
        emote: t > ZIPOUT + .1 && t < BLESS ? '!' : undefined, emoteK: 1, emoteAge: t - ZIPOUT });
      glow(250, 1560 - u * 14, u * 10, '#FFE070', .15);
    }
    camEnd();
    caps(t);
    wipeOut(lt, dur, SEAC);
  }

  // ================= F · Simhika grabs his shadow; he shoots in and out; she sinks =================
  function shotSimhika(t, lt, dur) {
    const sh = shakeXY(t, t > THRU + .3 && t < THRU + .6 ? 9 : 0);
    camBegin(540 + sh[0], 1220 + sh[1], 1.0);
    const stop = Math.min(t, GRAB) - F0, dist = 900 * stop + (t > SANK + .4 ? 900 * (t - SANK - .4) : 0), hy = 1420;
    openSea(t, 'f', { hy, dist });
    const held = t > GRAB && t < THRU, pedal = held ? t * 9 : undefined;
    const hxN = 200, hyN = 1300 + Math.sin(t * 2.2) * 12, u = 15;
    const shx = hxN + 240, shy = hy + 170;
    const hold = held ? Math.min(1, (t - GRAB) * 2) : 0;
    // her head rises, mouth open; after he shoots through, she sinks (the sea drawn over her)
    const rise = easeOut(seg(t, SIMH - .2, SIMH + .5)), sink = easeIn(seg(t, SANK, SANK + 1.0));
    if (t > SIMH - .3) simhika(860, lerp(1800, 1200, rise), 340, { key: 'fsh', open: t < THRU + .2 ? ease(seg(t, SIMH + .3, SIMH + .8)) : 0, eyes: t > SANK ? 'swirl' : t > THRU + .2 ? 'cross' : 'angry', sink });
    frontSea(t, hy, 'ffs', dist);
    // his shadow on the water (it lags and stretches while it's held); her hand comes up and grabs it
    if (t < THRU) waterShadow(shx - 40 * hold, shy, 300 + 80 * hold, 'fws', 235);
    if (held) inkLine([[hxN + 40, hyN - 60], [shx - 40, shy]], 12 + 4 * Math.sin(t * 20), '#1E3A5A', 'ink', .5);   // the stretched shadow-band
    const hk = t < THRU ? easeOut(seg(t, GRAB - .4, GRAB)) : 1 - easeIn(seg(t, THRU, THRU + .5));
    if (hk > 0) simhikaHand(shx - 40 * hold, shy + 20, 190, ease(seg(t, GRAB - .1, GRAB + .1)), { key: 'fhd', reach: 1.1 * hk });
    if (t > SANK) { boilSeed('fbub'); for (let i = 0; i < 6; i++) { const q = frac((t - SANK) * .9 + i / 6); paint(ellPts(860 + Math.sin(i * 2.1 + t * 3) * 60, hy + 40 - q * 140, 12 * (1 - q) + 4, 12 * (1 - q) + 4, 10), { wash: P9.foam, washOp: 200, ink: P9.ink, sw: .5 }); } }
    if (t > THRU + .3 && t < THRU + .7) emote('stars', 860, 930, 90, 1, t);
    // Hanuman: flying, then yanked to a stop (pedalling, sweat, "!?"); shrinks, shoots into her mouth and out; flies on
    const mouthAt = [860, 1200 + 340 * .2 + 340 * .05];
    if (t > THRU - .15 && t < THRU + .35) poof(hxN + 260, hyN - 160, 120, (t - THRU + .15) / .5, 'fpf');
    if (t > THRU && t < THRU + .7) {
      const zin = easeIn(seg(t, THRU, THRU + .3)), zout = easeOut(seg(t, THRU + .4, THRU + .7));
      if (t < THRU + .3) speck(lerp(hxN + 260, mouthAt[0], zin), lerp(hyN - 160, mouthAt[1], zin), 'fsp', 1, t);
      else if (t > THRU + .4) speck(lerp(mouthAt[0], 340, zout), lerp(mouthAt[1], 1100, zout) - Math.sin(zout * Math.PI) * 200, 'fsp', -1, t);
    } else {
      const after = t > THRU + .7, k = after ? backOut(clamp((t - THRU - .7) * 3)) : 1, ax = after ? lerp(90, hxN, ease(seg(t, THRU + .7, SANK + .6))) : hxN, ay = after ? lerp(1180, hyN, ease(seg(t, THRU + .7, SANK + .6))) : hyN;
      if (!held) speedLines(ax - 60, ay - 200, 160, 'fsl', t);
      hanuman(ax, ay, u * k, flyO(t, { boilKey: 'fh', rot: held ? .7 + .1 * Math.sin(t * 9) : 1.2, walk: pedal, eyes: held ? 'wide' : after && t > SANK ? 'happy' : 'determined', mouth: held ? 'scream' : 'grin', sweat: held, noShadow: true,
        lookX: held ? -.6 : 1, emote: held && t < SIMH + .4 ? '!?' : undefined, emoteK: 1, emoteAge: t - GRAB }));
    }
    camEnd();
    caps(t);
    wipeOut(lt, dur, DUSKC);
  }

  // ================= G · Lanka at dusk; at night he shrinks to a cat's size and tiptoes in =================
  function shotLanka(t, lt, dur) {
    camBegin(540, 1300, 1.0 + lt * .01);
    const night = ease(seg(t, CAT - .6, CAT + .9));
    lankaView(t, night, 'g');
    if (t > LAND + .6 && t < CAT) { boilSeed('gsp'); for (let i = 0; i < 6; i++) { const q = frac(t * .8 + i / 6); paint(starPts(260 + hash(i * 3.1) * 600, 980 + hash(i * 5.3) * 220, 14 * Math.sin(q * Math.PI), .35, 4), { wash: '#FFF6DA', ink: null }); } }
    // the hill he lands on: a rocky ledge in the foreground (a rectangle with a drawn edge)
    boilSeed('ghill'); paint(rectPts(-300, 1600, 1700, 1300), { wash: mixCol('#6A5040', '#2A2236', night), fill: mixCol('#4A3A30', '#1A1626', night), fillOp: 60, tex: .5, ink: null });
    inkLine([[-300, 1606], [200, 1592], [700, 1604], [1300, 1598]], 1, P9.ink, 'ink', .4);
    const drop = easeIn(seg(t, G0, LAND)), land = t > LAND ? spring(t, LAND, 6, 14) : 0;
    const small = t > SHRINK, u = small ? 7 * backOut(clamp((t - SHRINK) * 3)) : 17;
    const walk = small ? ease(seg(t, SHRINK + .4, H0)) : 0, x = small ? lerp(260, 640, walk) : 260;
    if (t > SHRINK - .15 && t < SHRINK + .45) poof(260, 1450, 150, (t - SHRINK + .15) / .6, 'gpf');
    hanuman(x, 1600 - (1 - drop) * 900 * (t < LAND ? 1 : 0), u, { ...HN, boilKey: 'gh', sq: .25 * land, tail: 'curl', lookX: 1, hx: .5,
      eyes: small ? 'wide' : t > LAND + .4 ? 'shine' : 'normal', mouth: small ? 'O' : t > LAND + .4 ? 'O' : 'smile', walk: small && walk > 0 && walk < 1 ? t * 2.2 : undefined, dy: small ? -Math.abs(Math.sin(t * 6.6)) * .6 : 0,
      emote: t > LAND + .4 && t < CAT ? '!' : undefined, emoteK: 1, emoteAge: t - LAND - .4, lean: small ? .6 : 0 });
    camEnd();
    caps(t);
    wipeOut(lt, dur, NIGHTC);
  }

  // ================= H · the palace: a queen asleep; "is that Sita?!"; he kisses his tail and dances; "no" =================
  function shotPalace(t, lt, dur) {
    camBegin(540, 1560, 1.45);
    palace(t, 'h');
    queenAsleep(720, 1560, 13, { key: 'hq', emote: 'zzz', emoteK: 1, emoteAge: t });
    // tiny Hanuman by the left pillar: peeks, gasps; jumps, kisses his tail, dances; stops, thinks, shakes his head
    const seen = t > QUEEN, joy = t > JOY && t < DOUBT, doubt = t > DOUBT;
    const hop = joy ? jump(t, JOY, JOY + .6, 2.5) : { dy: 0, sq: 0 }, dance = joy && t > JOY + .9 ? Math.sin((t - JOY) * 9) : 0;
    const kiss = joy && t > JOY + .6 && t < JOY + 1.2;
    const shake = doubt && t > SHAKE ? Math.sin((t - SHAKE) * 16) * .8 * (1 - seg(t, SHAKE + .9, SHAKE + 1.2)) : 0;
    const peek = ease(seg(t, H0 + .3, QUEEN));
    const hX = lerp(250, 340, peek);
    hanuman(hX, 1660, 8, { ...HN, boilKey: 'hh', tail: kiss ? false : 'curl', tailSway: kiss ? 0 : t * 2, lookX: kiss ? .2 : .8, hx: kiss ? .9 : doubt ? shake : .4,
      eyes: doubt ? (t > SHAKE ? 'closed' : 'look') : kiss ? 'closed' : joy ? 'happy' : seen ? 'shine' : 'look', mouth: doubt ? (t > SHAKE ? 'frown' : 'flat') : kiss ? 'o' : joy ? 'grin' : seen ? 'O' : 'smile',
      dy: hop.dy + Math.abs(dance) * -.8, sq: hop.sq, rot: dance * .12, lean: !seen ? 1 : 0,
      handL: joy && !kiss ? [-6, -21 + dance * 2] : seen && !joy && !doubt ? [-2.2, -19] : doubt && t < SHAKE ? [-1.2, -18.6] : undefined, handR: joy && !kiss ? [6, -21 - dance * 2] : seen && !joy && !doubt ? [2.2, -19] : undefined, bendL: .4, bendR: .4,
      emote: kiss ? 'heart' : joy ? 'music' : doubt && t < SHAKE ? '?' : seen && !joy ? '!!' : undefined, emoteK: 1, emoteAge: t - (doubt ? DOUBT : joy ? JOY : QUEEN), blush: kiss ? .8 : 0 });
    if (joy && t > JOY + 1) notes(400, 1400, t, 'hnotes', GOLDC, 3);
    // the kiss: he brings his tail round to his lips
    if (kiss) { const [mx, my] = naradaMouth(hX, 1660, 8, { hx: .9, dy: hop.dy }), u = 8; boilSeed('hkt'); paint(ribbon([[hX + u, 1660 - 7.4 * u + hop.dy * u], [hX + 6 * u, 1660 - 10 * u], [hX + 5 * u, my - u], [mx + 1.2 * u, my]], u * .7, u * .45), { wash: HNM.fur, ink: HNM.ink, sw: .7 }); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, GROVEC);
  }

  // ================= I · the Ashoka grove: Sita; he tells Ram's story from the branches; the ring =================
  const sita = (x, y, u, o) => parvati(x, y, u, { pal: SITA_PAL, ...SITA_SKIN, ...o });
  function shotGrove(t, lt, dur) {
    const c = kf(t, [[I0, [540, 1360, 1.0]], [RING, [540, 1360, 1.0]], [TAKE, [640, 1420, 1.2]]], ease);
    camBegin(c[0], c[1], c[2]);
    ashokaGrove(t, 'i', 300, 700);
    const look = t > LOOK, took = t > TAKE + .2;
    // Sita sits under the tree (the mound hides her legs)
    sita(660, 2000, 21, { boilKey: 'is', eyes: took ? 'cry' : look ? 'wide' : 'sad', mouth: took ? 'smile' : look ? 'O' : 'frown', lookX: look && t < RING + .4 ? -.7 : -.3, lookY: look && t < RING + .4 ? -.8 : .4, hx: look ? -.3 : -.1,
      handR: took ? [1.2, -15.4] : undefined, handL: took ? [-1.6, -15] : undefined, bendR: .5 });
    if (took) { const [rx, ry] = parvatiHand(660, 2000, 21, { handR: [1.2, -15.4], bendR: .5 }, 1); ramRing(rx, ry - 10, 46, 1, 'irr', t); tears(660 - 1.4 * 21, 2000 - 20.1 * 21, t, 'ist', .6); }
    else if (t < LOOK) tears(660 - 1.2 * 21, 2000 - 20.1 * 21, t, 'ist', .4);
    mound(660, 1850, 600, 'imd');
    boilSeed('ignd'); paint(rectPts(-300, 1846, 1700, 900), { wash: '#1E2A3A', ink: null });   // the ground in front hides her feet
    // Hanuman: on a branch, telling the story (notes drifting down); hops down beside her and offers the ring
    const hop = ease(seg(t, RING - .2, RING + .5)), offer = t > RING + .4 && t < TAKE + .2;
    const p = arcPt([440, 1200], [430, 1760], 160, hop);
    if (t > SING && t < RING) notes(500, 1230, t, 'inotes', GOLDC, 3);
    hanuman(p[0], p[1], 9, { ...HN, boilKey: 'ih', sit: hop < .05 ? 1 : 0, tail: 'droop', tailSway: t * 2, lookX: .8, hx: .4,
      eyes: took ? 'happy' : 'normal', mouth: talk(t, SING + .1, RING - .3, took ? 'grin' : 'smile'), noShadow: hop < .95,
      handR: offer ? [6.5, -15] : undefined, bendR: .3, pray: took ? 1 : 0, emote: took ? 'hearts' : undefined, emoteK: 1, emoteAge: t - TAKE });
    if (offer) { const [rx, ry] = naradaHand(p[0], p[1], 9, { ...HN, handR: [6.5, -15], bendR: .3 }, 1); ramRing(rx, ry - 14, 40, clamp((t - RING - .4) * 3), 'irr', t); }
    camEnd();
    caps(t);
    wipeIn(lt, GROVEC);
    wipeOut(lt, dur, NIGHTC);
  }

  // ================= J · the tease: Hanuman grins over Lanka at night, his tail tip glowing =================
  function shotTease(t, lt, dur) {
    camBegin(540, 1180, 1.0 + lt * .02);
    lankaView(t, 1, 'j');
    boilSeed('jwall'); paint(rectPts(-300, 1640, 1700, 1300), { wash: '#4A2E3A', fill: '#2E1C26', fillOp: 60, tex: .5, ink: null });
    for (let i = 0; i < 8; i++) paint(rectPts(-60 + i * 160, 1590, 90, 60), { wash: '#5A3A46', ink: P9.ink, sw: .8 });
    inkLine([[-300, 1646], [1400, 1646]], 1, P9.ink, 'ink', 0);
    const o = { ...HN, boilKey: 'jh', tail: 'curl', tailSway: t * 2, eyes: 'smug', mouth: 'grin', lookX: .6, hx: .3, brow: -.5, handL: [-1.5, -13.5], handR: [1.5, -13.5], bendL: .5, bendR: .5, dy: -Math.abs(Math.sin(t * 6)) * .2 };
    hanuman(360, 1650, 20, o);
    const [tx, ty] = hanumanTail(360, 1650, 20, o), f = 1 + .15 * Math.sin(t * 13);
    glow(tx, ty, 120, '#FF9030', .7); boilSeed('jfl'); paint([[tx - 16, ty + 4], [tx - 6, ty - 46 * f], [tx + 2, ty - 24], [tx + 10, ty - 56 * f], [tx + 16, ty + 4]], { wash: '#FFB040', ink: null, curv: .5 }); paint([[tx - 8, ty + 4], [tx, ty - 26 * f], [tx + 8, ty + 4]], { wash: '#FFF0A0', ink: null, curv: .5 });
    camEnd();
    caps(t);
    wipeOut(lt, dur, CARDC);
  }

  // ================= K · the follow card =================
  function shotCard(t, lt) { followCard(t, lt, { part: 10, title: 'LANKA BURNS', at: CARD, ask: 'Comment JAI HANUMAN 🙏' }); wipeIn(lt, CARDC); }

  shots([[0, shotHook], [B0, shotIdent], [C0, shotMahendra], [D0, shotMainaka], [E0, shotSurasa], [F0, shotSimhika], [G0, shotLanka], [H0, shotPalace], [I0, shotGrove], [J0, shotTease], [K0, shotCard]]);
})();
