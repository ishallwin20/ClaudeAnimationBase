// kojagari.js: "Tonight at MIDNIGHT, Maa Lakshmi asks ONE question" (ad 51, Sharad Purnima / Kojagari Purnima): the
// full moon of sixteen kalas, kheer kept in the moonlight, Lakshmi coming down at midnight asking "ko jagarti?" (who is
// awake?), the town asleep but for one boy on his phone, who sees her and prays; then she turns to the viewer: you're
// awake. Storyboard: STORYBOARD.md. Sets and props: kojagari_props.js. All times are video time (t); the SFX
// (tools/kojagari_sfx.mjs) uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/kojagari_sfx.mjs)
  const TILT0 = 3.3, TILT1 = 4.6, KALA = 4.6, KALA0 = 4.9, KHEER = 8.0, MID = 11.3, DESC0 = 11.9, LAND = 13.6, ASKQ = 14.6, WIPE1 = 17.9;
  const SLEEP = 18.1, SPIN1 = 19.6, SHAKE = 20.2, PAN = 21.2, PERCH = 22.0, EXCEPT = 22.1, REVEAL = 23.0, FOUND = 23.7,
    LKIN = 24.9, SHADES = 25.3, NOTICE = 25.7, GASP = 26.1, PRAY = 26.8, COINS = 28.8, TURN = 32.2, YOU = 32.6, AWAKE = 35.1,
    ASK = 38.0, WIPE = 41.6;
  const CARD = 41.9, CARD_CAP = 42.0, COVERS = 42.2, PRICE = 43.0, LOGO = 43.3, PILL = 43.6, FOLLOW = 44.0;

  const GOLDC = '#F5C542';
  const inW = (t, a, b) => t >= a && t < b;
  // a face timeline: the latest key wins, with a quick squint across every change so nothing snaps
  function acts(t, keys) {
    let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
    let sq = 0; for (const [k] of keys) sq = Math.max(sq, 1 - Math.abs(t - k) / .07);
    return { ...keys[i][1], squint: Math.max(keys[i][1].squint || 0, sq * .9) };
  }
  const camAt = (t, K) => {
    let i = 0; while (i + 1 < K.length && t >= K[i + 1][0]) i++;
    if (i + 1 >= K.length) return K[i][1];
    const [t0, a] = K[i], [t1, b] = K[i + 1], k = ease(seg(t, t0, t1));
    return a.map((v, j) => lerp(v, b[j], k));
  };

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['Tonight at MIDNIGHT,', 560, -1, TILT0 + 1, 96, GOLDC], ['Maa Lakshmi asks', 675, -1, TILT0 + 1, 76], ['ONE question.', 790, -1, TILT0 + 1, 96, GOLDC],
    ['Sharad Purnima:', 1230, KALA, KHEER - KALA - .05, 70, GOLDC], ['the moon is said to shine', 1320, KALA + .15, KHEER - KALA - .2, 60], ['with all 16 KALAS.', 1410, KALA + .3, KHEER - KALA - .35, 74, GOLDC],
    ['So tonight, we keep KHEER', 600, KHEER + .1, MID - KHEER - .15, 64], ['out in the MOONLIGHT.', 700, KHEER + .3, MID - KHEER - .35, 74, GOLDC],
    ['At MIDNIGHT,', 470, MID + .2, ASKQ - MID - .3, 84, GOLDC], ['Maa LAKSHMI comes down…', 575, MID + .4, ASKQ - MID - .5, 64],
    ['"Who is AWAKE?"', 1390, ASKQ + .8, WIPE1 - .35 - ASKQ - .8, 76],
    ['Everyone is…', 540, SLEEP, PAN - SLEEP, 72], ['ASLEEP.', 650, SLEEP + .5, PAN - SLEEP - .5, 116, GOLDC],
    ['Except ONE.', 560, EXCEPT, LKIN - .4 - EXCEPT, 116, GOLDC],
    ['Whoever stays AWAKE', 500, COINS, TURN - COINS - .1, 66], ['and prays to her,', 590, COINS + .15, TURN - COINS - .25, 66], ['she BLESSES.', 695, COINS + .3, TURN - COINS - .4, 96, GOLDC],
    ['And right now,', 470, YOU, AWAKE - YOU - .05, 64], ['YOU are watching this…', 565, YOU + .2, AWAKE - YOU - .25, 72],
    ['So YOU are AWAKE.', 520, AWAKE, ASK - AWAKE - .05, 100, GOLDC],
    ['Answer her. Comment:', 470, ASK, WIPE - ASK, 62], ['JAI MAA LAKSHMI', 575, ASK + .2, WIPE - ASK - .2, 104, GOLDC],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };
  // a shout in screen space: pops, wobbles, fades at the end of its life
  function shout(txt, x, y, size, age, life, o = {}) {
    if (age < 0 || age > life) return;
    letter(txt, x, y, size, o.col || GOLDC, { screen: true, pop: age * 5, rot: (o.rot ?? -.05) + Math.sin(age * 18) * .025 * clamp(1 - age), alpha: 1 - seg(age, life - .2, life), stroke: KJ.ink, sw: .2, ink: false, maxW: 900, ...(o.font ? { font: o.font } : {}) });
  }

  // ================= shot 1: the moon, the roofs, the descent =================
  const MX = 700, MY = 260, MR = 200;                 // the moon
  const PY = 1620;                                    // the near terrace's parapet top
  const LX = 640, LY = 1700, LU = 20;                 // Lakshmi on the terrace (her feet, behind the parapet)
  const OWX = 820, OWY = PY - 26, OWU = 14;           // the owl perched on the parapet
  const CAM1 = [
    [0, [650, 60, 1.25]], [TILT0, [650, 60, 1.3]], [TILT1, [600, 560, 1.0]],
    [KHEER, [600, 560, 1.0]], [KHEER + .9, [330, 1575, 2.6]],
    [MID, [330, 1575, 2.6]], [MID + .7, [600, 460, 1.0]],
    [DESC0 + .5, [600, 460, 1.0]], [LAND + .2, [580, 1200, 1.0]],
    [ASKQ - .2, [580, 1200, 1.0]], [ASKQ + .3, [600, 1330, 1.35]],
  ];
  function lkDesc(t) {   // her feet and size on the way down
    const k = easeOut(seg(t, DESC0, LAND)), bob = t > LAND ? -spring(t, LAND, 8, .5) * .25 : 0;
    return { x: lerp(MX, LX, k), y: lerp(MY + 210, LY, k), u: lerp(5, LU, k * k * .4 + k * .6), dy: bob, k };
  }
  function owlFly(t) {   // the owl, beside her on the way down, then perched
    const k = easeOut(seg(t, DESC0 + .15, LAND + .35));
    const flying = t < LAND + .35, flap = Math.sin(t * 15);
    const o = { x: lerp(MX - 330, OWX, k), y: lerp(MY + 420, OWY, k) - (flying ? 40 * Math.sin(k * Math.PI) : 0), u: lerp(4, OWU, k), flying, flap };
    return o;
  }
  function owlWings(flap) { return { wingL: [-5.6, -9.5 + flap * 3.2], wingR: [5.6, -9.5 + flap * 3.2], wingShapeL: 'open', wingShapeR: 'open' }; }

  function shotSky(t, lt) {
    const [cx, cy, z] = camAt(t, CAM1);
    camBegin(cx, cy, z);
    kjSky(t, { avoid: [MX, MY, MR * 1.5] });
    const flare = seg(t, MID + .1, MID + .6) * (1 - seg(t, LAND, LAND + 1.2));
    kjMoon(MX, MY, MR, t, { kalas: (t - KALA0) / .1, flare });
    rooftops(t, { shine: seg(t, KHEER + .4, KHEER + 1.4), py: PY });
    // the beam of moonlight she comes down
    moonBeam(MX, MY + MR * .6, LX, PY - 40, 120, ease(seg(t, MID + .3, DESC0 + .3)) * (1 - seg(t, LAND + .5, LAND + 1.5)), 'beam');
    moonDust(t, KHEER + .5, [400, 1260], [330, 1590], 10, 'kheerdust');
    // Lakshmi, from the moon down to the terrace
    if (t > DESC0 - .05) {
      const d = lkDesc(t);
      const f = acts(t, [
        [-9, { eyes: 'closed', mouth: 'smile' }], [LAND - .4, { eyes: 'normal', mouth: 'smile', lookY: .3 }],
        [ASKQ - .1, { eyes: 'normal', mouth: 'O', lookX: .6, lookY: .2 }], [ASKQ + 1.6, { eyes: 'normal', mouth: 'smile', lookY: .5, lookX: -.4 }],
      ]);
      const callK = ease(seg(t, ASKQ - .3, ASKQ)) * (1 - ease(seg(t, ASKQ + 1.8, ASKQ + 2.2)));
      const handR = [lerp(3.5, 4.9, callK), lerp(-12.6, -17.6, callK)];
      lakshmi(d.x, d.y, d.u, { ...f, dy: d.dy, hx: callK * .35, htilt: callK * -.06 + (t > ASKQ + 1.6 ? .05 : 0), handR, coins: 0, glowK: .55 + .3 * flare, boilKey: 'lk1', seed: 6 });
      // the call: rings out of her mouth
      if (inW(t, ASKQ, ASKQ + 1.4)) {
        boilSeed('call rings');
        const m = [d.x + .25 * d.u, d.y - 18.9 * d.u];
        for (let i = 0; i < 3; i++) {
          const a = (t - ASKQ - i * .25); if (a < 0 || a > .9) continue;
          const r = 30 + a * 260, al = 1 - a / .9;
          inkLine(Array.from({ length: 9 }, (_, j) => { const q = -.7 + j / 8 * 1.4; return [m[0] + Math.cos(q) * r, m[1] + Math.sin(q) * r]; }), 3 * al + .5, GOLDC, 'ink', .6);
        }
      }
    }
    // the owl
    if (t > DESC0 + .1) {
      const w = owlFly(t);
      const of = acts(t, [[-9, { eyes: 'normal', mouth: 'flat' }], [ASKQ, { eyes: 'wide', mouth: 'flat', lookX: -1 }], [ASKQ + .9, { eyes: 'normal', mouth: 'smile', lookX: -.6, lookY: .6 }]]);
      owl(w.x, w.y, w.u, { ...of, ...(w.flying ? owlWings(w.flap) : {}), hx: t > LAND ? -.5 : 0, nod: inW(t, ASKQ + 1, ASKQ + 1.8) ? .3 * Math.abs(Math.sin((t - ASKQ) * 8)) : 0, boilKey: 'owl1', seed: 2, noShadow: w.flying });
    }
    nearParapet(t, { py: PY, shine: seg(t, KHEER + .4, KHEER + 1.4) });
    camEnd();
    // the question, in Sanskrit and in English
    shout('को जागर्ति?', 540, 470, 76, t - ASKQ, WIPE1 - .35 - ASKQ, { font: '76px "Tiro Devanagari Sanskrit"', rot: -.03 });
    shout('KO JAGARTI?', 540, 590, 124, t - (ASKQ + .25), WIPE1 - .35 - ASKQ - .25);
    caps(t);
    if (t > WIPE1 - .3) { flushLetters(); brushWipe((t - (WIPE1 - .3)) / .6, ['#2C3C7E', '#8C9AC8']); }
  }

  // ================= shot 2: house to house =================
  const W1 = KJW.xs[0], W2 = KJW.xs[1], SILL = KJW.sill;
  const O1X = 290, O2X = 1345, OHU = 24;                     // the owl on window 1's sill, then window 2's
  const AX = 1600, AY = 1320, AU = 17;                       // Aarav in bed, seen through window 2
  const KX0 = 760, KX = 1075, KY = 1790, KU = 26;            // Lakshmi walks in to stand left of window 2
  const CAM2 = [
    [WIPE1, [540, 1030, 1.2]], [PAN, [540, 1030, 1.26]], [PERCH, [1530, 1050, 1.25]],
    [LKIN - .3, [1530, 1050, 1.25]], [LKIN + .6, [1380, 1230, 1.1]],
    [TURN, [1380, 1230, 1.1]], [TURN + 1.0, [1140, 1330, 1.45]], [ASK, [1140, 1330, 1.45]], [WIPE, [1140, 1310, 1.52]],
  ];
  function owlPos(t) {   // [x, y, u, flying, flap]
    if (t < PAN) return [O1X, SILL, OHU, false, 0];
    if (t < PERCH) { const k = ease(seg(t, PAN, PERCH)), p = arcPt([O1X, SILL], [O2X, SILL], 260, k); return [p[0], p[1], OHU, true, Math.sin(t * 16)]; }
    if (t < TURN) return [O2X, SILL, OHU, false, 0];
    const k = ease(seg(t, TURN, TURN + .9)), p = arcPt([O2X, SILL], [1320, 1540], 180, k);
    return [p[0], p[1] + (k >= 1 ? 14 * Math.sin(t * 3) : 0), lerp(OHU, 17, k), true, Math.sin(t * (k < 1 ? 16 : 9))];
  }
  function owl2(t) {
    const [x, y, u, flying, flap] = owlPos(t);
    const f = acts(t, [
      [-9, { eyes: 'normal', mouth: 'flat' }],
      [SPIN1 + .3, { eyes: 'tired', mouth: 'flat' }],
      [PAN, { eyes: 'normal', mouth: 'flat' }],
      [PERCH + .2, { eyes: 'side', mouth: 'flat', lookX: 1 }],
      [REVEAL + .25, { eyes: 'wide', mouth: 'O', lookX: 1 }],
      [FOUND, { eyes: 'happy', mouth: 'grin' }],
      [LKIN + .1, { eyes: 'wide', mouth: 'O', lookX: -1 }],
      [SHADES + .3, { eyes: 'normal', mouth: 'smile', lookX: -1 }],
      [PRAY + .3, { eyes: 'normal', mouth: 'grin', lookX: -1 }],
      [TURN + .2, { eyes: 'normal', mouth: 'smile' }],
      [AWAKE + .7, { eyes: 'normal', mouth: 'grin' }],
    ]);
    const o = { ...f, boilKey: 'owl2', seed: 2, noShadow: flying };
    // the head: back to us at window 1 (looking in), spun round to us; a "no" shake; turned to window 2
    if (t < SPIN1) o.hturn = .5;
    else if (t < SPIN1 + .4) { o.hturn = lerp(.5, 1, easeOut(seg(t, SPIN1, SPIN1 + .4))); o.spin = 1 - seg(t, SPIN1 + .2, SPIN1 + .4); }
    else if (t < PAN) o.hx = inW(t, SHAKE, SHAKE + .8) ? .55 * Math.sin((t - SHAKE) * 16) * (1 - seg(t, SHAKE + .4, SHAKE + .8)) : 0;
    else if (t < FOUND) o.hx = t > PERCH ? .75 : 0;
    else if (t < LKIN) o.hx = 0;
    else if (t < TURN) o.hx = -.6;
    else if (inW(t, AWAKE, AWAKE + .6)) { o.hturn = easeOut(seg(t, AWAKE, AWAKE + .6)); o.spin = 1 - seg(t, AWAKE + .4, AWAKE + .6); }
    if (flying) Object.assign(o, owlWings(flap));
    else if (inW(t, FOUND, LKIN)) { o.wingR = [5.4, -8.6]; o.wingShapeR = 'point'; }   // "this one!"
    o.lean = t < SPIN1 ? .5 * ease(seg(t, WIPE1, WIPE1 + .8)) : 0;
    o.shades = ease(seg(t, SHADES, SHADES + .35));
    const tk = take(t, REVEAL + .25, .9), tl = take(t, LKIN + .1, .7);
    o.sq = tk.sq + tl.sq; o.dy = tk.dy + tl.dy;
    if (t > PERCH && t < PERCH + .4) { const s = spring(t, PERCH, 9, .6); o.sq += s * .15; }
    owl(x, y, u, o);
  }
  // Aarav's state at t
  function aarav2(t) {
    const f = acts(t, [
      [-9, { eyes: 'normal', mouth: 'grin', lookY: .5 }],
      [REVEAL + .7, { eyes: 'happy', mouth: 'open', lookY: .5 }],
      [NOTICE, { eyes: 'normal', mouth: 'flat', lookX: -1, lookY: -.2 }],
      [GASP, { eyes: 'wide', mouth: 'O', lookX: -1, lookY: -.2 }],
      [PRAY, { eyes: 'closed', mouth: 'open', lookX: -.5 }],
      [PRAY + 1.4, { eyes: 'closed', mouth: 'smile', lookX: -.5 }],
      [COINS + .3, { eyes: 'shine', mouth: 'grin', lookX: -.6, lookY: .1 }],
    ]);
    const o = { pose: 'sleep', ...f, htilt: t < NOTICE ? -.12 : -.04, boilKey: 'aarav', seed: 3 };
    if (t < GASP) { o.handL = [-1.0, -12.5]; o.handR = [1.0, -12.5]; o.handShapeL = o.handShapeR = 'hold'; o.held = (u, sw) => { push(); translate(0, 5.8 * u); phone(u, sw, 1); pop(); }; }
    else if (t < PRAY) { const k = easeOut(seg(t, GASP, GASP + .2)); o.handL = [lerp(-1, -2.9, k), lerp(-12.5, -14.6, k)]; o.handR = [lerp(1, 2.9, k), lerp(-12.5, -14.6, k)]; o.handShapeL = o.handShapeR = 'open'; }
    else { const k = ease(seg(t, PRAY, PRAY + .35)); o.handL = [lerp(-2.9, -.3, k), lerp(-14.6, -11.5, k)]; o.handR = [lerp(2.9, .3, k), lerp(-14.6, -11.5, k)]; o.handShapeL = o.handShapeR = 'open'; o.handAL = o.handAR = -Math.PI / 2; }
    const tk = take(t, GASP, 1.0); o.sq = tk.sq; o.dy = tk.dy;
    if (t < NOTICE && t > REVEAL + .7) o.dy = (o.dy || 0) - .15 * Math.abs(Math.sin(t * 14));   // giggling at the phone
    return o;
  }
  function room2(t) {
    return (x0, y0, w, h) => {
      boilSeed('aarav room');
      paint(rrPts(x0 + 40, y0 + 330, w - 80, 120, 20), { wash: KJ.woodDk, ink: KJ.ink, sw: 1 });   // the headboard
      paint(ellPts(AX, AY - 175, 150, 62, 20), { wash: KJ.pillow, fill: KJ.pillowDk, fillOp: 50, tex: .3, ink: KJ.ink, sw: 1 });
      if (t > REVEAL - .05) aarav(AX, AY, AU, aarav2(t));
      // the razai: over his head (a glowing lump) until it slides down to his chest
      const k = ease(seg(t, REVEAL, REVEAL + .35)), top = lerp(AY - 245, AY - 95, k), hump = lerp(70, 0, k);
      boilSeed('aarav razai');
      paint([[x0 - 10, y0 + h + 30], [x0 - 10, top + 40], [AX - 150, top + 10], [AX - 70, top - hump], [AX + 70, top - hump], [AX + 150, top + 10], [x0 + w + 10, top + 40], [x0 + w + 10, y0 + h + 30]], { wash: KJ.blanket3, fill: '#2E6A66', fillOp: 60, tex: .5, ink: KJ.ink, sw: 1.2, curv: .35 });
      for (let i = 0; i < 4; i++) paint(rrPts(x0 + 30 + i * (w - 60) / 4, top + 70 + (i % 2) * 40, (w - 60) / 4 - 24, 44, 8), { wash: i % 2 ? KJ.blanket2 : KJ.blanket, washOp: 200, ink: null });
      if (t < REVEAL + .2) { boilSeed('lump glow'); glow(AX, top + 30, 170, KJ.screen, (.6 + .15 * Math.sin(t * 9)) * (1 - k)); }
      // the dropped phone, on the razai
      if (t > GASP) { const kd = easeIn(seg(t, GASP, GASP + .3)); boilSeed('dropped phone'); push(); translate(lerp(AX, AX + 60, kd), lerp(AY - 100, AY - 50, kd)); rotate(kd * 1.2); paint(rrPts(-18, -28, 36, 56, 6), { wash: KJ.phone, ink: KJ.ink, sw: .8 }); pop(); }
      // her blessing, piling up on the razai
      const n = Math.min(9, Math.floor(Math.max(0, t - COINS - .6) * 3));
      for (let i = 0; i < n; i++) lakshmiCoin(AX - 110 + hash(i * 3.1) * 220, AY - 70 + hash(i * 5.7) * 40, 16, .3 + hash(i) * 1.2, 'pile' + i);
      if (t > LKIN) { boilSeed('warm room'); glow(x0 + 60, y0 + 300, 300, KJ.warm, .3 * seg(t, LKIN, LKIN + .8)); }
    };
  }
  function lk2(t) {
    const wk = seg(t, LKIN, LKIN + .9), x = lerp(KX0, KX, ease(wk)), walking = wk > 0 && wk < 1;
    const f = acts(t, [
      [-9, { eyes: 'normal', mouth: 'smile', lookX: .8 }],
      [GASP + .3, { eyes: 'happy', mouth: 'smile', lookX: .8, blush: .3 }],
      [PRAY + .2, { eyes: 'closed', mouth: 'smile' }],
      [COINS - .2, { eyes: 'normal', mouth: 'smile', lookX: .8, lookY: .2 }],
      [TURN + .2, { eyes: 'normal', mouth: 'smile' }],
      [AWAKE + .5, { eyes: 'wink', mouth: 'smile' }], [AWAKE + .85, { eyes: 'happy', mouth: 'smile', blush: .3 }],
      [ASK, { eyes: 'normal', mouth: 'smile' }],
    ]);
    const give = ease(seg(t, COINS - .3, COINS + .1)) * (1 - ease(seg(t, TURN - .4, TURN)));
    const hxT = t < TURN ? .55 : lerp(.55, 0, ease(seg(t, TURN, TURN + .5)));
    const o = { ...f, walk: walking ? t * 1.3 : undefined, hx: hxT, htilt: inW(t, PRAY, COINS) ? .08 : 0, lean: inW(t, AWAKE, ASK) ? .35 * ease(seg(t, AWAKE, AWAKE + .5)) : 0,
      handR: [lerp(3.5, 5.6, give), lerp(-12.6, -15.2, give)], coins: t > ASK ? .7 : 0, coinsTo: KY, coinT: t, glowK: .7, boilKey: 'lk2', seed: 6 };
    return { x, o };
  }

  function shotHouse(t, lt) {
    const [cx, cy, z] = camAt(t, CAM2);
    camBegin(cx, cy, z);
    houseFront(t, {
      room1: (x0, y0, w, h) => familyBed(x0, w, y0 + 450, t, t < PAN + .5),
      room2: room2(t),
      light: [0, seg(t, LKIN, LKIN + .8)],
    });
    // Lakshmi
    if (t > LKIN - .05) {
      const { x, o } = lk2(t);
      lakshmi(x, KY, KU, o);
      // the blessing: coins on arcs from her palm into the window, onto his razai
      if (inW(t, COINS, TURN)) {
        const p = lakshmiPalm(x, KY, KU, o);
        for (let i = 0; i < 10; i++) {
          const ph = (t - COINS) * .9 - i * .14; if (ph < 0 || ph > 1 + (t > TURN - .8 ? 0 : 9)) continue;
          const q = frac(ph), to = [AX - 110 + hash(i * 3.1) * 220, AY - 60];
          const c = arcPt(p, to, 150 + 60 * hash(i), easeIn(q) * .3 + q * .7);
          lakshmiCoin(c[0], c[1], 18, t * 7 + i, 'arc' + i);
        }
        sparkleBurst(p[0], p[1], 50, t - COINS, 'palm');
      }
    }
    owl2(t);
    camEnd();
    // his prayer, out loud
    shout('JAI MAA LAKSHMI!', 600, 620, 96, t - (PRAY + .1), COINS - .1 - PRAY - .1, { rot: -.06 });
    if (t > AWAKE) lakshmiCoinRain(t, AWAKE + .1, { n: 14, key: 'you', x0: 60, x1: 900 });
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, ['#2C3C7E', '#8C9AC8']); }
    if (t > WIPE) { flushLetters(); brushWipe((t - WIPE) / .6, [TK.marigold, TK.peach]); }
  }

  // ================= the card =================
  function shotCard(t, lt) {
    kjCard(t, { cap: CARD_CAP, covers: COVERS, price: PRICE, logo: LOGO, pill: PILL, follow: FOLLOW });
    const k = frac((t - FOLLOW) / 1.6);
    if (t > FOLLOW) { flushLetters(); boilSeed('sparkle'); paint(starPts(lerp(240, 700, k), lerp(1000, 760, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [TK.marigold, TK.peach]); }
  }

  shots([[0, shotSky], [WIPE1, shotHouse], [CARD, shotCard]]);
})();
