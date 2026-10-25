// rp12.js: Ramayan Part 12, "The Last Arrow", the series finale (60.0 s, Painted, no voice: captions in Bangers, retro
// cartoon SFX, a soft tanpura under the hymn and the homecoming). Told from the Valmiki Ramayana, Yuddha Kanda: Ravana
// fights from his chariot and Ram on foot, so Indra sends his own chariot with Matali (102); the sage Agastya teaches
// Ram the Aditya Hridayam, which he recites three times and feels new strength (105); Ram cuts off Ravana's heads but
// they grow back, a hundred times (107); Matali tells him to use the Brahma weapon; it strikes Ravana's heart, Ravana
// falls, and the arrow returns to Ram's quiver (108); the gods shower flowers (108); Ram, Sita and Lakshman fly home to
// Ayodhya on the Pushpaka and Ram is crowned (123–128). The end, and the finale card (start from Part 1).
// STORYBOARD.md has the plan and the sources; sets and cast in rp12_props.js, src/ramayan_sets.js, src/ramayan.js.
// Every time comes from src/scenes/rp12_tl.js (TL), which tools/rp12_sfx.mjs reads too.
(() => {
  const { GROWS, CUT, B0, C0, FOOT, D0, E0, F0, G0, H0, I0, J0, K0, INDRA, MATALI, AGASTYA, THRICE, STRONG, CUTS, HUNDRED, CHANT, DRAW, LOOSE, FLY, RV, HEART, TOPPLE, FELL, BACK, KING, CROWN, CARD } = TL;
  window.RP12_T = TL;
  const talk = (t, a, b, rest, open = 'open') => t > a && t < b && Math.sin((t - a) * 15) > -.2 ? open : rest;

  const GOLDC = P12.gold;
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const CARDC = [RMY.maroon, RMY.saffron], DUSKC = [P12.duskHi, P12.earth], SKYC = [P12.skyHi, '#FFF6EC'], HALLC = [P1.hall, P1.pillar];

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
  const bowPose = (draw, o = {}) => ({ flip: true, handL: [-7.6, -18], bendL: .3, handR: [lerp(-2.6, -.4, draw), lerp(-14.4, -18.6, draw)], bendR: .9, kodanda: false, armL: heldBow(draw), ...o });
  const sita = (x, y, u, o) => parvati(x, y, u, { pal: SITA_PAL, ...SITA_SKIN, ...o });
  // Ravana facing Ram (flipped), (x, y) the ground under him, u his size; cut: for each head i, the time it was cut (it
  // regrows over .5 s). The hook has him standing (RVX, RVY, RVU); the battle has him in his chariot (rvRide)
  const RVX = 760, RVY = 1840, RVU = 14;
  function ravanaCut(t, cuts, o = {}, x = RVX, y = RVY, u = RVU) {
    const heads = {};
    for (let i = 0; i < 10; i++) {
      const c = cuts[i]; if (c == null || t < c) continue;
      const g = t - c;
      heads[i] = g < .3 ? { hide: true } : { s: backOut(clamp((g - .3) / .4, .05, 1)), eyes: 'happy', mouth: 'grin', emote: g < 1.2 ? 'spark' : undefined, emoteK: 1, emoteAge: g - .3 };
    }
    ravana(x, y, u, { boilKey: 'rv', flip: true, all: { eyes: 'narrow', mouth: 'smirk', ...(o.all || {}) }, ...o, heads: { ...heads, ...(o.heads || {}) } });
    // the cut heads tumbling away (up and right) for .9 s
    for (let i = 0; i < 10; i++) { const c = cuts[i]; if (c == null || t < c || t > c + .9) continue; const [hx, hy, hr] = rvHeadPos({}, i), q = (t - c) / .9, k = u / RVU; ravanaLoneHead(x - hx * u + q * 260 * k, y + hy * u - Math.sin(q * Math.PI) * 220 * k + q * 120 * k, hr * u * (1 - q * .3), i, { eyes: 'swirl', mouth: 'O', tilt: q * 6 }, { boilKey: 'rvc' + i }); }
  }
  // the war chariots, each a giant's: Ravana's (facing left, donkeys) with him standing in it, u his size; Indra's (facing
  // right, white horses) with Ram, u his size, the front wall hiding him below the waist, and Matali at the reins.
  // rider(seat) draws the rider; each returns the seat (the rider's feet)
  const rvRide = (x, gy, u, t, rider, o = {}) => { const s = 18 * u; warChariot(x, gy, s, t, { key: o.key || 'rvr', team: 'donkeys', flip: true, run: o.run ?? 0, riders: rider }); return [x + .05 * s, gy - .74 * s]; };
  const ramRide = (x, gy, u, t, rider, o = {}) => { const s = 26 * u; warChariot(x, gy, s, t, { key: o.key || 'rmr', team: 'horses', run: o.run ?? .15, riders: rider }); return [x - .05 * s, gy - .74 * s]; };
  // Ram's quiver on his back (he faces right): a leather tube over his left shoulder, feathered arrows; drawn before him
  function quiver(x, y, u, key) {
    boilSeed(key);
    push(); translate(x - 2.2 * u, y - 15 * u); rotate(-.45);
    paint(rrPts(-1.1 * u, -7 * u, 2.2 * u, 9 * u, .8 * u), { wash: '#8A4E2A', fill: '#5E3418', fillOp: 60, tex: .4, ink: P12.ink, sw: .8 });
    for (let i = 0; i < 4; i++) { const ax = (-.6 + i * .4) * u; inkLine([[ax, -7 * u], [ax, -9.4 * u]], 1.2, '#6A4A2A', 'ink', 0); paint([[ax - .35 * u, -9.2 * u], [ax, -10.4 * u], [ax + .35 * u, -9.2 * u]], { wash: i % 2 ? '#FFFFFF' : '#D2283A', ink: P12.ink, sw: .4 }); }
    pop();
  }
  // dust kicked up on the field: n puffs around (x, y), k 0..1 how thick, spread s
  function dust(x, y, s, k, key, n = 5) { if (k <= 0) return; for (let i = 0; i < n; i++) cloudPuff(x + (hash(i * 3.3) - .5) * s * 1.6, y - hash(i * 5.7) * s * .5, s * (.35 + .3 * hash(i * 1.9)), key + i, 230 * k, '#E2C49A', '#B89068'); }
  // the darkening sky of the Brahmastra: a violet dusk over the set, k 0..1
  const dusk = k => { if (k > .01) paint(rectPts(-3000, -3000, W + 6000, H + 6000), { wash: '#2A1838', washOp: 128 * clamp(k), ink: null }); };
  // the Brahmastra: a blazing arrow at (x, y) flying right (len its length), a long trail of fire behind
  function brahmastra(x, y, len, t, key, trail = 1) {
    glow(x, y, len * 1.5, '#FFB040', .8); glow(x, y, len * .7, '#FFF2C0', .9);
    boilSeed(key);
    const w = len / 150;
    for (let k = 3; k >= 0; k--) paint(ribbon([[x, y], [x - len * (1 + trail * (1 + k * .5)) * .5, y + Math.sin(t * 30 + k) * 8 * w], [x - len * (1 + trail * (1.4 + k * .6)), y + Math.sin(t * 40 + k) * 14 * w]], (30 - k * 5) * w, 2), { wash: ['#FFF6D0', '#FFE070', '#FFB040', '#F07A22'][k], washOp: 230, ink: null });
    paint([[x - len * .9, y - 3 * w], [x - len * .1, y - 3 * w], [x - len * .1, y + 3 * w], [x - len * .9, y + 3 * w]], { wash: '#F2C24A', ink: null });
    paint([[x - len * .15, y - 14 * w], [x + len * .3, y], [x - len * .15, y + 14 * w]], { wash: '#FFE070', ink: '#E8A030', sw: .8 });
    glow(x + len * .1, y, len * .6, '#FFFFFF', .7);
    for (let i = 0; i < 8; i++) { const q = frac(t * 3 + i / 8), sx = x - len * (.4 + q * 2.6 * trail), sy = y + (hash(i * 4.1) - .5) * 70 * q; paint(starPts(sx, sy, 12 * (1 - q), .4, 4), { wash: '#FFE070', ink: null }); }
  }

  // ================= A · the hook: an arrow cuts off a head; it grows back =================
  function shotHook(t, lt, dur) {
    camBegin(720, 1580 - lt * 6, 1.55 + lt * .02);
    battlefield(t, 'ha');
    ravanaCut(t, { 4: CUT });
    if (t < CUT) { const q = seg(t, 0, CUT); arrowAt(lerp(380, 740, q), lerp(1580, 1540, q), -.1, 150, 'haar'); }
    if (t > GROWS) emote('?', 920, 1300, 60, 1, t);
    camEnd();
    caps(t);
    wipeOut(lt, dur, CARDC);
  }

  // ================= B · the ident =================
  function shotIdent(t, lt, dur) { ramayanIdent(t, lt, 12, 'THE LAST ARROW'); wipeIn(lt, CARDC); wipeOut(lt, dur, DUSKC); }

  // ================= C · each in its own frame: Ravana's chariot rolls in; Ram on foot; Indra's chariot comes down =================
  function shotChariot(t, lt, dur) {
    const roll = easeOut(seg(t, C0, C0 + 1.5)), cx = lerp(1500, 700, roll), laugh = t > C0 + 1.5;
    camBegin(560, 1220 - lt * 10, 1.0 + lt * .02);
    battlefield(t, 'c');
    rvRide(cx, 1880, 21, t, ([sx, sy]) => ravana(sx, sy, 21, { boilKey: 'crr', flip: true, noShadow: true, all: { eyes: 'narrow', mouth: laugh ? talk(t, C0 + 1.5, FOOT, 'smirk', 'grin') : 'smirk', lookX: -1 } }), { key: 'crc', run: roll < 1 ? 1 : .1 });
    dust(cx + 230, 1860, 160, 1 - roll * .7, 'cdu');
    camEnd();
    caps(t);
    wipeIn(lt, DUSKC);
  }
  function shotFoot(t, lt, dur) {
    camBegin(540, 1300 - lt * 12, 1.05 + lt * .03);
    battlefield(t, 'cf');
    // the chariot's long shadow reaching in from the right
    boilSeed('cfsh'); paint(ellPts(1150, 1900, 520, 70, 20), { fill: P12.ink, fillOp: 70, bleed: .3, tex: .3, ink: null });
    ram(470, 1880, 26, { boilKey: 'cfr', eyes: 'determined', brow: -.4, mouth: 'flat', lookX: 1, hx: .3 });
    for (let i = 0; i < 4; i++) { const q = frac(t * .7 + i / 4); cloudPuff(-150 + q * 1400, 1820 - i * 30, 40 + 20 * hash(i), 'cfd' + i, 200 * Math.sin(q * Math.PI), '#E2C49A', '#B89068'); }
    camEnd();
    caps(t);
  }
  function shotIndra(t, lt, dur) {
    // the camera starts up in the clouds with the chariot and follows it down; it lands right of Ram, horses toward him
    const land = ease(seg(t, INDRA, INDRA + 1.5)), cam = ease(seg(t, INDRA, INDRA + 1.7));
    const sh = shakeXY(t, t > INDRA + 1.5 && t < INDRA + 1.8 ? 10 : 0);
    camBegin(lerp(1000, 540, cam) + sh[0], lerp(700, 1380, cam) + sh[1], lerp(1.1, .95, cam));
    battlefield(t, 'ci');
    boilSeed('cisky'); paint(rectPts(-600, -1400, W + 1200, 1000), { wash: P12.duskHi, ink: null });
    glow(900, 200, 700, '#FFF0B0', .5 * (1 - land * .5));
    for (let i = 0; i < 4; i++) cloudPuff(lerp(760 + (i - 1.5) * 260, 760 + (i - 1.5) * 560, land), 260 + i * 40 - land * 200, 170, 'cic' + i, 230, '#FFE4C8', '#E8B89A');
    const ix = lerp(1250, 790, land), iy = lerp(560, 1890, land);
    glow(ix, iy - 260, 320, '#FFF0B0', .45);
    warChariot(ix, iy, 340, t, { key: 'cic', team: 'horses', flip: true, run: land < 1 ? 1 : .15, riders: ([sx, sy]) => matali(sx, sy, 10, { boilKey: 'cim', eyes: 'happy', mouth: talk(t, MATALI, D0 - .3, 'smile'), lookX: -1 }) });
    if (land >= 1) dust(ix - 60, 1880, 150, 1 - seg(t, INDRA + 1.5, INDRA + 2.6), 'cid');
    const look = t > INDRA + .3;
    ram(200, 1880, 19, { boilKey: 'cir', eyes: look ? 'wide' : 'determined', mouth: look && land < 1 ? 'O' : look ? 'smile' : 'flat', lookX: 1, lookY: land < .7 ? -.8 : 0, hx: .3, emote: look && t < INDRA + 1.8 ? '!' : undefined, emoteK: 1, emoteAge: t - INDRA - .3 });
    camEnd();
    caps(t);
    wipeOut(lt, dur, ['#FFC860', '#F7C08E']);
  }

  // ================= D · Agastya teaches the Aditya Hridayam; three times; new strength =================
  function shotHymn(t, lt, dur) {
    camBegin(540, 1400, 1.08);
    battlefield(t, 'd');
    const sk = ease(seg(t, D0 + 1.4, THRICE)), strong = t > STRONG;
    bigSun(560, 1020, 120 + 30 * sk, t, .3 + .7 * sk, 'dsun');
    // Agastya walks in, small and bright-eyed, and talks; Ram listens, palms joined, then chants three times
    const ain = easeOut(seg(t, D0, AGASTYA + .6));
    agastya(lerp(-120, 220, ain), 1850, 13, { boilKey: 'da', walk: ain < 1 ? t * 2.5 : undefined, eyes: 'happy', mouth: talk(t, AGASTYA + .6, THRICE - .3, 'smile'), lookX: .8, hx: .3, handR: t > AGASTYA + .6 && t < THRICE ? [6, -19] : undefined, bendR: .2 });
    const chant = t > THRICE && t < STRONG;
    ram(560, 1860, 19, { boilKey: 'dr', pray: strong ? 0 : 1, eyes: chant ? 'closed' : strong ? 'determined' : 'normal', mouth: chant ? talk(t, THRICE, STRONG, 'smile') : strong ? 'grin' : 'smile', lookX: -.8, hx: -.3,
      handR: strong ? [6.4, -20] : undefined, bendR: .2, puff: strong ? .5 : 0, emote: strong ? 'spark' : undefined, emoteK: 1, emoteAge: t - STRONG });
    if (chant) for (let k = 0; k < 3; k++) { const q = clamp((t - THRICE - k * .45) / 1.2); if (q > 0 && q < 1) { boilSeed('dch' + k); paint(starPts(560 + (k - 1) * 60, 1380 - q * 360, 18 * Math.sin(q * Math.PI), .4, 4), { wash: '#FFE070', ink: null }); } }
    if (strong) glow(560, 1500, 300, '#FFE070', .4 * clamp((t - STRONG) * 3));
    camEnd();
    caps(t);
    wipeOut(lt, dur, DUSKC);
  }

  // ================= E · the heads grow back (Ravana alone, the arrows from off frame), then the quickening intercut =================
  const HORD = [4, 2, 7, 0];
  // the head cuts by time t: the four slow ones, then after HUNDRED every head pops every 2 s, staggered .2 s
  function headCuts(t) {
    const cuts = {};
    CUTS.forEach((c, k) => { if (t > c) cuts[HORD[k]] = c; });
    if (t > HUNDRED) for (let i = 0; i < 10; i++) { const o = HUNDRED + .1 + ((i * 3) % 10) * .2, c = o + Math.floor((t - o) / 2) * 2; if (t > c) cuts[i] = Math.max(cuts[i] ?? -9, c); }
    return cuts;
  }
  function headsRv(t, lt) {
    const fast = t > HUNDRED;
    camBegin(600, 1180, fast ? 1.12 : 1.0 + lt * .02);
    battlefield(t, 'e');
    const RX = 720, RG = 1900, RU = 21, cuts = headCuts(t);
    const [sx, sy] = rvRide(RX, RG, RU, t, ([x, y]) => ravanaCut(t, cuts, { boilKey: 'ev', noShadow: true, all: { eyes: 'narrow', mouth: 'smirk', emote: fast ? 'stars' : undefined } }, x, y, RU), { key: 'erc' });
    // the arrows fly in from off frame (left) at each head .2 s before its cut
    const hit = [...CUTS.map((c, k) => [c, HORD[k]])];
    if (fast) for (let i = 0; i < 10; i++) { const o = HUNDRED + .1 + ((i * 3) % 10) * .2; for (let n = 0; n < 2; n++) hit.push([o + n * 2, i]); }
    for (const [c, i] of hit) if (t > c - .2 && t < c) { const [hx, hy] = rvHeadPos({}, i), q = seg(t, c - .2, c), tx = sx - hx * RU, ty = sy + hy * RU; arrowAt(lerp(-100, tx, q), lerp(ty + 60, ty, q), -.1, 150, 'ear' + i + c); }
    camEnd();
  }
  function headsRam(t, lt, tired) {
    camBegin(400, 943 + 240 / 1.3, 1.3);
    battlefield(t, 'e2');
    const draw = tired ? .3 + .1 * Math.sin(t * 5) : .5 + .5 * Math.sin(t * 14);
    ramRide(380, 1900, 20, t, ([x, y]) => { quiver(x, y, 20, 'eq'); ram(x, y, 20, { boilKey: 'er', noShadow: true, eyes: 'wide', brow: tired ? .4 : -.6, mouth: tired ? talk(t, 0, 99, 'O', 'open') : 'flat', hx: .5, lookX: 1, sweat: true, ...bowPose(draw) }); }, { key: 'erm' });
    if (!tired) for (let k = 0; k < 3; k++) { const q = frac(t * 4 + k / 3); arrowAt(lerp(560, 1300, q), lerp(1140, 1100, q) + k * 20, -.05, 140, 'era' + k); }
    camEnd();
  }
  function shotHeads(t, lt, dur) {
    if (t < HUNDRED) headsRv(t, lt);
    else { let cur = 'rv', at = HUNDRED; for (const [a, w] of TL.MIX) if (t >= HUNDRED + a) { cur = w; at = HUNDRED + a; } cur === 'rv' ? headsRv(t, t - at) : headsRam(t, t - at, at === HUNDRED + TL.MIX[TL.MIX.length - 1][0]); }
    caps(t);
    if (t < HUNDRED) wipeIn(lt, DUSKC);
  }

  // ================= F · Matali, at the reins of Indra's chariot, turns to Ram: "use the Brahmastra!" =================
  const RRX = 380, RRG = 1900, RRU = 20;   // Indra's chariot with Ram in it (F, G, the return)
  const matali2 = (t, x, y, o) => matali(x + 13 * RRU, y - .5 * RRU, 18, { boilKey: 'fm', noShadow: true, flip: true, ...o });
  function shotMatali(t, lt, dur) {
    camBegin(560, 943 + 240 / 1.12, 1.12);
    battlefield(t, 'f');
    ramRide(RRX, RRG, RRU, t, ([x, y]) => {
      quiver(x, y, RRU, 'fq');
      ram(x, y, RRU, { boilKey: 'fr', noShadow: true, eyes: t > F0 + 1.2 ? 'determined' : 'wide', mouth: 'flat', lookX: 1, hx: .3, kodanda: true, emote: t > F0 + 1.2 ? 'bulb' : undefined, emoteK: 1, emoteAge: t - F0 - 1.2 });
      matali2(t, x, y, { eyes: 'normal', mouth: talk(t, F0 + .3, G0 - .4, 'smile'), lookX: -1, handR: [6, -20], bendR: .2 });
    }, { key: 'fic' });
    camEnd();
    caps(t);
    wipeIn(lt, DUSKC);
  }

  // ================= G · the Brahmastra =================
  // G1 Ram, close, in the chariot: he chants with his eyes shut, the sky darkens, sparks spiral into the arrow; he draws;
  // LOOSE: a flash, the recoil, the arrow streaks off frame right
  function shotCharge(t, lt, dur) {
    const loosed = t > LOOSE, kick = loosed ? Math.exp(-(t - LOOSE) * 5) : 0, sh = shakeXY(t, 16 * kick);
    const gz = lerp(1.45, 1.75, ease(seg(t, G0, LOOSE))) - .25 * (loosed ? 1 - kick : 0) + .08 * kick;
    camBegin(430 + sh[0], 943 + 250 / gz + sh[1], gz);
    battlefield(t, 'g1');
    const dk = ease(seg(t, G0 + .2, DRAW)); dusk(dk);
    const draw = loosed ? 0 : ease(seg(t, DRAW, LOOSE - .15)), chant = t > CHANT && t < DRAW;
    const pose = bowPose(draw);
    let tip = null;
    ramRide(RRX, RRG, RRU, t, ([x, y]) => {
      quiver(x, y, RRU, 'gq');
      ram(x, y, RRU, { boilKey: 'gr', noShadow: true, eyes: chant ? 'closed' : 'determined', brow: chant ? 0 : -.7, mouth: chant ? talk(t, CHANT, DRAW, 'flat') : 'flat', lookX: 1, hx: .5, ...pose });
      const [hx, hy] = naradaHand(x, y, RRU, pose, -1); tip = [hx + 40, hy - 10];
    }, { key: 'gic' });
    // the arrow charging: sparks spiral in, the glow grows with the draw
    const ch = clamp(seg(t, CHANT, LOOSE)), [ax, ay] = tip;
    if (!loosed) {
      for (let i = 0; i < 14; i++) { const q = frac(t * .9 + i / 14), a = i * 2.4 + q * 5, r = 420 * (1 - q); if (hash(i * 1.7) < ch + .2) { boilSeed('gsp' + i); paint(starPts(ax + Math.cos(a) * r, ay + Math.sin(a) * r * .8, 16 * (1 - q * .5), .4, 4), { wash: '#FFE070', ink: null }); } }
      glow(ax, ay, 120 + 260 * ch + 20 * Math.sin(t * 14), '#FFC040', .4 + .5 * ch);
      glow(ax, ay, 50 + 90 * ch, '#FFFFFF', .3 + .6 * ch);
    } else {
      const q = clamp((t - LOOSE) / .3);
      if (q < 1) brahmastra(lerp(ax, ax + 900, easeIn(q)), ay, 150, t, 'g1a');
      flash(.8 * kick, '#FFF6D0');
      for (let k = 0; k < 6; k++) { boilSeed('gsl' + k); const y = ay - 200 + k * 80; inkLine([[ax + 100, y], [ax + 900, y + (k - 2.5) * 6]], 3, '#FFF2C0', 'ink', 0); }
    }
    camEnd();
    caps(t);
  }
  // G2 the arrow in flight over the darkened field: clouds and the ground race past, a comet blazing like the Sun
  function shotFly(t, lt, dur) {
    const sh = shakeXY(t, 5);
    camBegin(540 + sh[0], 960 + sh[1], 1);
    boilSeed('gfsky');
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: '#4A2A44', ink: null });
    paint(ellPts(540, 1480, 1200, 520, 26), { fill: '#B4523A', fillOp: 200, bleed: .3, tex: .4, ink: null });
    boilSeed('gfgr');
    paint(rectPts(-100, 1560, W + 200, 600), { wash: '#7A5A44', fill: '#5A3E30', fillOp: 60, tex: .5, ink: null });
    for (let i = 0; i < 9; i++) { const x = 1300 - frac(hash(i * 3.3) + t * 2.2) * 1700, y = 1600 + hash(i * 7.1) * 260; inkLine([[x, y], [x + 30, y - 50]], 2.4, '#3A2420', 'ink', 0); }
    for (let i = 0; i < 6; i++) { const x = 1500 - frac(hash(i * 5.3) + t * (1.1 + .5 * hash(i))) * 2100, y = 300 + hash(i * 2.9) * 1000; cloudPuff(x, y, 110 + 80 * hash(i * 1.3), 'gfc' + i, 200, '#C88A8A', '#8A5A6A'); }
    for (let i = 0; i < 10; i++) { const x = 1300 - frac(hash(i * 8.1) + t * 3.5) * 1800, y = 560 + hash(i * 6.7) * 900; boilSeed('gfs' + i); inkLine([[x, y], [x + 260, y]], 2, '#FFE8C0', 'ink', 0); }
    const q = seg(t, RV - .3, RV), ax = 600 + easeIn(q) * 1000, ay = 1000 + Math.sin(t * 20) * 6;
    glow(ax, ay, 1000, '#FFB050', .45);
    brahmastra(ax, ay, 300, t, 'gfa');
    camEnd();
    caps(t);
  }
  // G3 Ravana in his chariot, huge and alone, smug, as the light grows from the left; one by one his ten faces see it
  // coming (the boss first, the sleepy one and the stubborn one last); HEART: the strike, a flash and a shockwave
  const VX = 640, VG = 1960, VU = 30, SEEN = [4, 3, 5, 2, 6, 1, 7, 9, 0, 8];
  function shotRavana(t, lt, dur) {
    const s = t - RV, hit = t > HEART, hk = hit ? Math.exp(-(t - HEART) * 4) : 0, sh = shakeXY(t, hit ? 26 * hk : 2 * clamp(s - 1.8));
    const pz = ease(seg(t, RV, HEART));
    const vz = lerp(1.0, 1.3, pz) - (hit ? .15 * (1 - hk) : 0);
    camBegin(lerp(600, 660, pz) + sh[0], 765 + 280 / vz + sh[1], vz);
    battlefield(t, 'g3');
    dusk(1);
    const heads = {};
    SEEN.forEach((i, k) => {
      const a = .8 + k * .16, see = s > a, scared = s > a + .7;
      heads[i] = hit ? { eyes: 'swirl', mouth: 'O', brows: .8 } : see ? { eyes: 'wide', lookX: 1, brows: .7, mouth: scared ? 'wobble' : 'flat', sweat: scared, s: scared ? .94 : 1 } : { mouth: 'smirk' };
    });
    const opts = { boilKey: 'gv', flip: true, noShadow: true, shake: hit ? .8 : clamp(s - 1.9) * .4, heads };
    let chest = null;
    rvRide(VX, VG, VU, t, ([x, y]) => { ravana(x, y, VU, opts); chest = ravanaChest(x, y, VU, opts); }, { key: 'gvc' });
    // the light: from off frame left, growing; the arrow streaks in for the last .15 s
    const lk = easeIn(clamp(s / (HEART - RV)));
    glow(-200, 950, 800 + 1200 * lk, '#FFB040', .6 + .4 * lk); glow(-100, 950, 400 + 700 * lk, '#FFF4C0', .4 + .6 * lk);
    if (chest) glow(chest[0] - 150, chest[1] - 300, 500, '#FFE0A0', .45 * lk);
    if (!hit && t > HEART - .15) brahmastra(lerp(-200, chest[0], seg(t, HEART - .15, HEART)), chest[1], 200, t, 'g3a');
    if (!hit && t > TL.HUSH) flash(.35 * seg(t, TL.HUSH, HEART), '#FFF6D0');
    if (hit) {
      const q = clamp((t - HEART) / .7);
      glow(chest[0], chest[1], 900 * hk + 200, '#FFB040', .9);
      boilSeed('ghit'); paint(starPts(chest[0], chest[1], 460 * backOut(seg(t, HEART, HEART + .12)) * (.6 + .4 * hk), .42, 10, t * 3), { wash: '#FFF2C0', ink: P12.ink, sw: 1.2 });
      for (let k = 0; k < 3; k++) { const r = 200 + (q + k * .18) * 1400; if (q + k * .18 < 1) { boilSeed('gring' + k); paint(ellPts(chest[0], chest[1], r, r * .8, 40), { ink: '#FFF2C0', sw: 3 * (1 - q) }); } }
      for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r = 120 + q * 900; boilSeed('gdb' + i); paint(starPts(chest[0] + Math.cos(a) * r, chest[1] + Math.sin(a) * r * .8, 22 * (1 - q), .4, 4), { wash: '#FFE070', ink: null }); }
      flash(hk, '#FFFDF2');
    }
    camEnd();
    caps(t);
  }
  // G4 the zoom out: Ravana sways in his chariot and falls backward out of it to the ground; crowns tumble; dust
  function shotFall(t, lt, dur) {
    const z = ease(seg(t, TOPPLE, TOPPLE + .8)), land = t > FELL, lk = land ? Math.exp(-(t - FELL) * 4) : 0, sh = shakeXY(t, 18 * lk);
    camBegin(lerp(470, 560, z) + sh[0], lerp(1200, 1300, z) + sh[1], lerp(1.7, .92, z));
    battlefield(t, 'g4');
    dusk(1 - seg(t, FELL, BACK + .5));
    const CX = 420, CG = 1880, CU = 20, fall = easeIn(seg(t, TOPPLE + .7, FELL));
    const hs = {}; for (let i = 0; i < 10; i++) hs[i] = fall > .3 ? { hat: 'none' } : {};
    const o = { boilKey: 'gf', flip: true, noShadow: true, rot: fall * 1.5, spread: lerp(1, .5, fall), all: { eyes: fall > .5 ? 'closed' : 'swirl', mouth: 'O', brows: .6 }, heads: hs };
    // he sways in the chariot, then goes over its back (drawn behind it) and lands beyond it
    const seat = [CX + .05 * 18 * CU, CG - .74 * 18 * CU];
    if (fall >= .2) ravana(seat[0] + fall * 230, lerp(seat[1], CG, fall * fall), CU, o);
    rvRide(CX, CG, CU, t, ([x, y]) => { if (fall < .2) ravana(x + Math.sin(t * 5) * 6, y, CU, { ...o, rot: fall * 1.5 + Math.sin(t * 4) * .04 }); }, { key: 'gfc' });
    // smoke from the wound while he stands
    if (fall < .2) for (let k = 0; k < 3; k++) { const q = frac(t * .8 + k / 3); cloudPuff(seat[0] - 10 + q * 40, seat[1] - 12.5 * CU - q * 200, 30 + q * 40, 'gsm' + k, 160 * (1 - q), '#B8A8B8', '#8A7A8A'); }
    if (fall > .3) for (let i = 0; i < 4; i++) { const q = clamp((t - FELL + .6) / 1.2); if (q < 1) { boilSeed('gcr' + i); push(); translate(seat[0] - 60 + i * 110 + q * 80 * (i - 1.5), seat[1] - 480 - Math.sin(q * Math.PI) * 260 + q * 560); rotate(q * 6 + i); paint([[-26, 12], [-30, -16], [-12, -5], [0, -26], [12, -5], [30, -16], [26, 12]], { wash: '#F2C24A', ink: P12.ink, sw: .8 }); pop(); } }
    if (land) { dust(seat[0] + 400, CG + 20, 380, Math.min(1, (t - FELL) * 6) * (1 - .4 * seg(t, FELL + .8, BACK)), 'gfd', 9); dust(seat[0] + 300, CG + 80, 260, Math.min(1, (t - FELL) * 4), 'gfe', 5); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, ['#FFD45A', '#FFF2C0']);
  }
  // G5 the arrow comes home: a streak of light curving back into Ram's quiver; the sky clears; Ram lowers his bow
  function shotReturn(t, lt, dur) {
    camBegin(470, 943 + 240 / 1.25, 1.25);
    battlefield(t, 'g5');
    const q = ease(seg(t, BACK + .2, BACK + 1.0)), home = t > BACK + 1.0;
    glow(800, 1000, 600, '#FFE8A0', .3 * clamp(t - BACK));
    let qv = null;
    ramRide(RRX, RRG, RRU, t, ([x, y]) => {
      qv = [x - 4.6 * RRU, y - 24 * RRU];
      quiver(x, y, RRU, 'rq');
      ram(x, y, RRU, { boilKey: 'rr', noShadow: true, eyes: home ? 'closed' : 'normal', mouth: home ? 'smile' : 'flat', lookX: home ? 0 : 1, hx: home ? 0 : .3, ...bowPose(0, { handL: [-6.6, -12], bendL: .2 }) });
      matali2(t, x, y, { eyes: 'happy', mouth: 'smile', lookX: -1 });
    }, { key: 'ric' });
    if (q > 0 && q < 1) { const x = lerp(1200, qv[0], q), y = lerp(900, qv[1], q) - Math.sin(q * Math.PI) * 260; glow(x, y, 140, '#FFE070', .8); boilSeed('rbk'); inkLine([[x, y], [x + 180, y + 40 * Math.cos(q * Math.PI)]], 8, '#FFF2B0', 'ink', .3); }
    if (home) { glow(qv[0], qv[1], 120, '#FFF0B0', .6 * Math.exp(-(t - BACK - 1) * 3)); emote('spark', qv[0] - 40, qv[1] - 40, 60, 1, t - BACK - 1); }
    camEnd();
    caps(t);
    wipeIn(lt, ['#FFD45A', '#FFF2C0']);
    wipeOut(lt, dur, ['#FFD45A', '#F4A6B8']);
  }

  // ================= H · the gods shower flowers; the army cheers =================
  function shotFlowers(t, lt, dur) {
    camBegin(540, 1420, 1.0);
    battlefield(t, 'h');
    glow(540, 600, 600, '#FFF0C0', .35);
    const hop = i => Math.abs(Math.sin(t * 6 + i)) * 1.2;
    vanara(80, 1880, 13, 2, { boilKey: 'hv1', eyes: 'happy', mouth: 'grin', dy: -hop(1), handL: [-6, -24], handR: [6, -24], bendL: .2, bendR: .2 });
    lakshman(230, 1870, 16, { boilKey: 'hl', eyes: 'happy', mouth: 'grin', lookX: .5, handR: [6, -21], bendR: .2 });
    ram(450, 1860, 19, { boilKey: 'hr', eyes: 'happy', mouth: 'smile', lookY: -.6, pray: 1, kodanda: true });
    hanuman(700, 1870, 17, { crown: false, gada: 1, boilKey: 'hh', eyes: 'happy', mouth: 'grin', dy: -hop(2), handL: [-6, -24], bendL: .2, tail: 'curl', emote: 'hearts', emoteK: 1, emoteAge: t - H0 });
    vanaraKing(900, 1880, 15, { boilKey: 'hs', eyes: 'happy', mouth: 'grin', dy: -hop(3), handL: [-6, -24], handR: [6, -24], bendL: .2, bendR: .2 });
    petals(t, clamp((t - H0) * 1.5), 'hpt', 46);
    camEnd();
    caps(t);
    wipeIn(lt, ['#FFD45A', '#F4A6B8']);
    wipeOut(lt, dur, SKYC);
  }

  // ================= I · home on the Pushpaka; then the coronation =================
  function shotHome(t, lt, dur) {
    camBegin(540, 1300, 1.0);
    skyRoute(t, 'i');
    const bob = Math.sin(t * 1.8) * 16;
    pushpaka(540, 1520 + bob, 760, t, { key: 'ipk', riders: ([x, y]) => {
      lakshman(x - 200, y - 50, 11, { boilKey: 'il', eyes: 'happy', mouth: 'smile', lookX: 1, noShadow: true });
      ram(x - 40, y - 50, 12, { boilKey: 'ir', eyes: 'happy', mouth: 'smile', lookX: .5, noShadow: true, handR: [6, -21 + Math.sin(t * 6)], bendR: .2 });
      sita(x + 100, y - 50, 11.5, { boilKey: 'is', eyes: 'happy', mouth: 'smile', lookX: -.5, noShadow: true });
      hanuman(x + 230, y - 50, 10.5, { crown: false, gada: 0, boilKey: 'ih', eyes: 'happy', mouth: 'grin', tail: 'curl', noShadow: true, pray: 1 });
    } });
    camEnd();
    caps(t);
    wipeIn(lt, SKYC);
    wipeOut(lt, dur, HALLC);
  }
  function shotKing(t, lt, dur) {
    camBegin(540, 1450, 1.15 + lt * .015);
    court(t, 'k');
    glow(540, 1350, 460, '#FFD070', .4);
    throne(540, 1560, 420, 'kth');
    ram(540, 1640, 15, { boilKey: 'kr', sit: 1, eyes: 'happy', mouth: 'smile', kodanda: false, mudra: 1, lookY: .2 });
    sita(760, 1720, 15, { boilKey: 'ks', eyes: 'happy', mouth: 'smile', lookX: -.6 });
    lakshman(320, 1720, 15, { boilKey: 'kl', eyes: 'happy', mouth: 'smile', lookX: .6 });
    hanuman(540, 1840, 12, { crown: false, gada: 0, boilKey: 'kh', eyes: 'closed', mouth: 'smile', pray: 1, bow: .4, tail: 'curl', emote: 'hearts', emoteK: 1, emoteAge: t - KING });
    if (t > CROWN) { glow(540, 1350, 200, '#FFF0B0', .5 * clamp((t - CROWN) * 3)); emote('spark', 640, 1150, 70, 1, t); }
    petals(t, clamp((t - KING - .4) * 1.2), 'kpt', 30);
    camEnd();
    caps(t);
    wipeIn(lt, HALLC);
    wipeOut(lt, dur, CARDC);
  }

  // ================= J · the end: Jai Shri Ram =================
  function shotEnd(t, lt, dur) {
    camBegin(540, 1300 - lt * 6, 1.0 + lt * .015);
    sunburst(t, 'j', 1250);
    lakshman(250, 1880, 18, { boilKey: 'jl', eyes: 'happy', mouth: 'smile', lookX: .4 });
    ram(470, 1860, 21, { boilKey: 'jr', eyes: 'happy', mouth: 'smile', handR: [6.2, -19.6], bendR: .3, kodanda: true });
    sita(690, 1870, 19.5, { boilKey: 'js', eyes: 'happy', mouth: 'smile', lookX: -.4 });
    hanuman(880, 1890, 16, { crown: false, gada: 0, boilKey: 'jh', eyes: 'happy', mouth: 'grin', pray: 1, tail: 'curl', emote: 'hearts', emoteK: 1, emoteAge: t - J0 });
    camEnd();
    caps(t);
    wipeIn(lt, CARDC);
    wipeOut(lt, dur, CARDC);
  }

  // ================= K · the finale card =================
  function shotCard(t, lt) { followCard(t, lt, { finale: true, at: CARD, ask: 'Comment JAI SHRI RAM 🙏' }); wipeIn(lt, CARDC); }

  shots([[0, shotHook], [B0, shotIdent], [C0, shotChariot], [FOOT, shotFoot], [INDRA, shotIndra], [D0, shotHymn], [E0, shotHeads], [F0, shotMatali], [G0, shotCharge], [FLY, shotFly], [RV, shotRavana], [TOPPLE, shotFall], [BACK, shotReturn], [H0, shotFlowers], [I0, shotHome], [KING, shotKing], [J0, shotEnd], [K0, shotCard]]);
})();
