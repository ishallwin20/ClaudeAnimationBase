// lakh.js: "1 LAKH of you. So the whole family came for ONE photo." The 1 lakh thank-you reel (~71.6 s, Bangers
// captions, SFX, no voice). Bal Bappa shows the 15K photo, wheels in a bigger camera, and the cast of the reels since
// then arrives one by one, each with a callback (Hanuman's sindoor, Parshurama's smile, Shani's gaze and the owl's
// shades, Kanha's butter, Ravana's ten heads, Bal Hanuman's flight, Narad's cloud, Shiva: Bappa's dad). One spot in the
// front stays empty: it's yours. Flash, thank you, the ask, the gift card. STORYBOARD.md has the plan; the set and props
// are in lakh_props.js. All times are video time (t); tools/lakh_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/lakh_sfx.mjs)
  const B0 = 4.0, C0 = 8.4, D0 = 12.4, E1 = 16.0, SIND = 18.9, E2 = 21.4, SMILE = 23.4, E3 = 25.6, LOOKUP = 26.9, CLUTCH = 27.3;
  const OWL = 28.0, PUT = 28.8, E4 = 31.2, LICK = 33.0, E5 = 35.2, PULL = 37.0, E6 = 40.6, LAND = 41.6, E7 = 43.6, SHIVA = 45.0;
  const F0 = 49.0, G0 = 54.2, MODAK = 55.0, FLASH = 56.2, H0 = 60.6, CARD = 65.4;
  const CARDC = { cap: CARD + .1, gift: CARD + .3, phone: CARD + .6, free: CARD + 1.0, pill: CARD + 1.5, grab: CARD + 1.8, sale: CARD + 2.4, covers: CARD + 2.6, follow: CARD + 3.4 };

  const GOLDC = '#F5C542', CREAMC = '#FFF5E2';
  const { T2, T1, FL, SPOT } = ST;
  let CAM = [540, 960, 1];
  const camK = (t, keys, sh = [0, 0], e = ease) => { const c = kf(t, keys, e); CAM = c; camBegin(c[0] + sh[0], c[1] + sh[1], c[2]); return c; };
  // is a figure (x centre, y from top to bottom, half width hw) in the camera's view?
  const inView = (x, top, bot, hw) => { const [cx, cy, z] = CAM, vw = W / 2 / z + 40, vh = H / 2 / z + 40; return x + hw > cx - vw && x - hw < cx + vw && bot > cy - vh && top < cy + vh; };
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const blinks = (t, seed) => { const p = (t + hash(seed) * 3.7) % 3.4; return p < .12; };
  const shake = (t, t0, d, a) => (t > t0 && t < t0 + d) ? shakeXY(t, a * (1 - (t - t0) / d)) : [0, 0];
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const WIPE = [LK.marigold, LK.orange];
  // an eased walk from x0 to x1 over [t0, t1]: { x, walk (whole cycles, so the feet land together), moving, dir }
  const walkTo = (t, t0, t1, x0, x1, u) => { const k = ease(seg(t, t0, t1)), n = Math.max(1, Math.round(Math.abs(x1 - x0) / (u * 5))); return { x: lerp(x0, x1, k), walk: n * k, moving: k > 0 && k < 1, dir: Math.sign(x1 - x0), k }; };

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['WE JUST HIT', 470, -1, B0 + .9, 74], ['1,00,000', 610, -1, B0 + .9, 200, GOLDC], ['FOLLOWERS!', 750, -1, B0 + .9, 74],
    ['AT 15K, THE WHOLE FAMILY', 470, B0 + .1, C0 - B0 - .2, 66], ['FIT IN ONE PHOTO.', 570, B0 + .45, C0 - B0 - .55, 84, GOLDC],
    ['NOW WE\'RE 1 LAKH.', 470, C0 + .1, D0 - C0 - .2, 84, GOLDC], ['WE NEED A BIGGER PHOTO.', 575, C0 + .55, D0 - C0 - .65, 70],
    ['EVERYONE,', 470, D0 + .3, E1 - D0 - .4, 84], ['FAMILY PHOTO TIME!', 580, D0 + .65, E1 - D0 - .75, 84, GOLDC],
    ['HANUMAN DRESSED UP', 470, E1 + .4, E2 - E1 - .5, 74, GOLDC], ['FOR RAM\'S PHOTO.', 570, E1 + .8, E2 - E1 - .9, 74],
    ['PARSHURAMA,', 470, E2 + .2, E3 - E2 - .3, 96, GOLDC], ['SMILE PLEASE?', 590, E2 + .9, E3 - E2 - 1.0, 84],
    ['SHANI DEV WANTED', 470, E3 + .2, E4 - E3 - .3, 74, GOLDC], ['TO LOOK AT THE CAMERA…', 565, E3 + .6, E4 - E3 - .7, 62], ['SAFETY FIRST.', 680, PUT + .1, E4 - PUT - .2, 96, GOLDC],
    ['KANHA BROUGHT', 470, E4 + .2, E5 - E4 - .3, 80, GOLDC], ['SNACKS.', 585, E4 + .6, E5 - E4 - .7, 104],
    ['RAVANA NEEDED', 470, E5 + .2, E6 - E5 - .3, 80, GOLDC], ['10 SEATS.', 590, E5 + .6, E6 - E5 - .7, 110],
    ['THEN BAPPA\'S DAD', 470, E7 + .2, F0 - E7 - .3, 84, GOLDC], ['ARRIVED.', 585, E7 + .6, F0 - E7 - .7, 96],
    ['ONE SPOT IS STILL EMPTY.', 470, F0 + .2, G0 - F0 - .3, 68], ['IT\'S YOURS.', 580, F0 + 1.4, G0 - F0 - 1.5, 110, GOLDC],
    ['SAY…', 470, G0 + .1, FLASH - G0 - .15, 84], ['MODAK!', 590, MODAK, FLASH - MODAK - .05, 130, GOLDC],
    ['THANK YOU,', 470, FLASH + .4, H0 - FLASH - .5, 110, GOLDC], ['1 LAKH FAMILY!', 600, FLASH + .8, H0 - FLASH - .9, 90],
    ['WHICH ONE OF US', 450, H0 + .1, CARD - H0 - .2, 76], ['BROUGHT YOU HERE?', 550, H0 + .45, CARD - H0 - .55, 76, GOLDC], ['COMMENT!', 1490, H0 + 1.2, CARD - H0 - 1.3, 88, GOLDC],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // ================= the close set (A–C): the same studio, close: the teal drape, swags, a strip of floor =================
  function closeSet(t, key = 'close') {
    boilSeed(key + ' drape');
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: LK.teal, ink: null });
    for (let i = 0; i < 12; i++) {
      const x = -60 + i * 110 + Math.sin(i * 2.1) * 12;
      paint([[x - 26, -100], [x + 22, -100], [x + 16 + Math.sin(i) * 8, 1440], [x - 30 + Math.sin(i) * 8, 1440]], { wash: i % 2 ? LK.tealDk : LK.tealLt, washOp: 120, ink: null });
    }
    for (let i = 0; i < 4; i++) lkSwag([-160 + i * 380, 300], [220 + i * 380, 300], 200, key + ' swag' + i, 26);
    for (let i = 0; i < 5; i++) lkString(-120 + i * 330, 300, 520 + (i % 2) * 120, key + ' str' + i, 20);
    boilSeed(key + ' floor');
    paint(rectPts(-200, 1440, W + 400, 700), { wash: LK.wood, ink: null });
    for (let i = 0; i < 5; i++) inkLine([[-200, 1500 + i * i * 30], [W + 200, 1500 + i * i * 30]], 1.6, LK.woodDk, 'inkfine', 0);
    inkLine([[-200, 1440], [W + 200, 1440]], 3.5, LK.tealDk, 'ink', 0);
  }

  // ================= A · the hook: Bappa jumps for joy, confetti =================
  function shotHook(t, lt, dur) {
    camBegin(540, 960 - lt * 6, 1.0 + .012 * lt);
    closeSet(t, 'a');
    const hop = jump(t, .9, 1.5, 2.4), hop2 = jump(t, 2.1, 2.7, 1.6);
    const mood = emotions(t, [[-1, 'excited', { eyes: 'happy', mouth: 'grin' }], [3.0, 'happy']], { take: .4 });
    const u = 32, by = 1580, bdy = (hop.dy + hop2.dy);
    balBappa(540, by, u, { ...mood, stand: 1, aL: 1.2 + .15 * Math.sin(t * 6), aR: 1.15 + .15 * Math.sin(t * 6 + 1), dy: (mood.dy || 0) + bdy, sq: (mood.sq || 0) + hop.sq + hop2.sq, trunk: 'up', ear: .6 + .3 * Math.sin(t * 5), boilKey: 'abappa' });
    const sqT = (mood.sq || 0) + hop.sq + hop2.sq;
    mooshak(540 + 10, by + ((mood.dy || 0) + bdy) * u - 17.9 * u * (1 - sqT), 11, { boilKey: 'amoo', eyes: 'happy', mouth: 'smile', dy: hop.dy * .3, rot: .1 * Math.sin(t * 5), tail: t * 2 });
    confetti(540, 300, t + .6, 'aconf', 46, 560);
    confetti(300, 200, t - 1.2, 'aconf2', 26, 420);
    camEnd();
    caps(t);
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, WIPE); }
  }

  // ================= B · the 15K photo =================
  function shotOld(t, lt, dur) {
    const pin = ease(seg(t, B0 + .4, C0 - 1.0)), flick = easeIn(seg(t, C0 - .7, C0 - .2)), z = 1.0 + .16 * pin;
    camBegin(540, 1180 + pin * 60, z);
    closeSet(t, 'b');
    const u = 30, bx = 540, by = 1720;
    const mood = emotions(t, [[B0 - 1, 'happy'], [B0 + 1.4, 'love', { eyes: 'happy' }]], { take: .3 });
    balBappa(bx, by, u, { ...mood, stand: 1, aL: .15, aR: .15 + flick * 1.2, trunk: 'curl', htilt: .08 * Math.sin(t * 1.5), lookY: .5, boilKey: 'bbappa' });
    mooshak(bx + 10, by - 18.6 * u, 10.5, { boilKey: 'bmoo', eyes: 'happy', mouth: 'smile', tail: t * 2, rot: .05 * Math.sin(t * 3) });
    // the photo, held in front of his tummy; screen space
    const [px, py] = toScreen(bx + flick * 900, by - 4.4 * u - flick * 500);
    camEnd();
    const pw = 270 * z, ph = pw * 1040 / 1012;
    boilSeed('bframe');
    if (flick < 1) {
      push(); translate(px, py); rotate(-.04 + flick * 3); paint(rectPts(-pw / 2 - 18, -ph / 2 - 18, pw + 36, ph + 56), { wash: LK.cream, ink: LK.ink, sw: 1 }); pop();
      picture(PICS.k15, px, py, pw, ph, { rot: -.04 + flick * 3 });
      flushLetters();
      if (flick === 0) for (const s of [-1, 1]) { boilSeed('bhand' + s); paint(ellPts(px + s * (pw / 2 + 4), py - ph * .1, 28 * z, 23 * z, 14), { wash: '#F4876A', ink: '#5A3520', sw: 1.1 }); }
    }
    caps(t);
    wipeIn(lt, WIPE);
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, WIPE); }
  }

  // ================= C · the bigger camera =================
  function shotCamera(t, lt, dur) {
    camBegin(540, 1040, 1.0 + .03 * lt);
    closeSet(t, 'c');
    const roll = easeOut(seg(t, C0 + .1, C0 + 1.6)), cx = lerp(-250, 690, roll);
    const duck = seg(t, D0 - 1.0, D0 - .6);
    boxCamera(cx, 1620, 2.0, t, { hood: duck >= 1 ? 1 : 0, key: 'ccam', flash: 0 });
    if (duck < 1) {
      const pat = t > C0 + 1.9 && t < C0 + 3.1 ? Math.abs(Math.sin((t - C0 - 1.9) * 9)) : 0;
      const mood = emotions(t, [[C0 - 1, 'determined'], [C0 + 1.7, 'proud', { eyes: 'happy' }]], { take: .4 });
      const bx = cx - 330 + duck * 110, w = roll < 1 ? roll * 6 : 0;
      balBappa(bx, 1620, 28, { ...mood, stand: 1, walk: w, aR: .3 + pat * .5 + duck, aL: .2 + duck, rot: duck * .12, dy: duck * 1.2, sq: duck * .25, trunk: 'curl', lookX: .8, hx: .4, boilKey: 'cbappa' });
      mooshak(bx + 10, 1620 - 17.8 * 28 + duck * 40, 9.5, { boilKey: 'cmoo', eyes: 'happy', mouth: 'smile', tail: t * 2 });
    }
    // the lens, for the iris out
    const lens = toScreen(cx + 124 * 2, 1620 - 285 * 2);
    camEnd();
    caps(t);
    if (lt > dur - .5) { flushLetters(); iris(lens[0], lens[1], lerp(1500, 0, easeIn((lt - (dur - .5)) / .5)), '#1A1418'); }
  }

  // ================= the family (D on): every member as a function of t =================
  // positions: the back row on the back riser (T2), the middle row (T1), the front row on the floor (FL)
  const POS = {
    shani: [92, T2], parsh: [216, T2], lak: [342, T2], ram: [462, T2], sita: [582, T2], hanu: [700, T2], ravana: [884, T2 - 2],
    narad: [936, 856], balH: [300, T1], shiva: [540, T1], owl: [782, T1],
    kanha: [128, FL], pot: [222, FL], moo: [272, FL], bappa: [396, FL], nandi: [890, FL],
  };
  const UB = 10, UR = 8.6, UBH = 11, USH = 12, UOW = 10, UK = 11, UBP = 11.5, UN = 9;   // sizes: the back row, Ravana, Bal Hanuman, Shiva, the owl, Kanha, Bappa, Nandi
  const KAN = { boilKey: 'kanha' };

  // the faces everyone pulls once the photo is on ("say modak")
  const say = t => t > MODAK;

  function family(t, o = {}) {
    const frozen = o.frozen, look = o.look || 0;     // look 0..1: everyone looks up (Shiva's light)
    const grin = say(t), point = t > F0 + 1.6 && t < G0 + .3;
    const upY = -look;
    // ---- Narad on his cloud (E6), top left
    if (t > E6 + 1.2) {
      const k = easeOut(seg(t, E6 + 1.4, E6 + 2.6)), x = lerp(1260, POS.narad[0], k), y = POS.narad[1] + Math.sin(t * 1.6) * 8;
      if (inView(x, y - 220, y + 40, 80)) narada(x, y, 7, { cloud: 1, strum: k < 1 || !grin ? 1 : 0, eyes: grin ? 'happy' : blinks(t, 3) ? 'closed' : 'normal', mouth: grin ? 'grin' : 'smile', lookY: upY, monkey: frozen ? 1 : 0, boilKey: 'narad' });
    }
    // ---- Ravana (E5), behind the back row's right end
    if (t > E5) {
      const w = walkTo(t, E5 + .1, E5 + 1.0, 1300, POS.ravana[0], UR), settle = t > PULL + 1.6;
      const heads = [];
      for (let i = 0; i < 10; i++) {
        const jost = !settle ? Math.sin(t * 9 + i * 1.7) : 0;
        if (i === 0) heads.push({ eyes: 'closed', mouth: 'O', bubble: .5 + .4 * Math.sin(t * 2.6), lookY: upY });
        else if (grin) heads.push({ eyes: 'happy', mouth: 'grin' });
        else if (!settle) heads.push({ eyes: i % 3 === 0 ? 'angry' : 'wide', mouth: i % 2 ? 'open' : 'teeth', tilt: jost * .18, dx: jost * .35, lookX: -.5, lookY: upY });
        else heads.push({ lookY: upY, mouth: i === 4 ? 'smirk' : undefined });
      }
      if (inView(w.x, T2 - 260, T2, 160)) ravana(w.x, POS.ravana[1], UR, { heads, step: w.moving ? Math.sin(w.walk * TAU) : 0, boilKey: 'ravana' });
    }
    // ---- the back row
    // Shani (E3): walks in limping, eyes down, his crow on his shoulder; LOOKUP: the gaze rises; PUT: the shades
    if (t > E3) {
      const w = walkTo(t, E3 + .1, E3 + 1.2, -180, POS.shani[0], UB);
      const up = ease(seg(t, LOOKUP, CLUTCH + .3)) * (t < PUT ? 1 : 1);
      const shaded = t > PUT;
      const so = { walk: w.walk, limp: w.moving ? .7 : 0, down: shaded ? 0 : 1 - up * .8, glow: shaded ? 0 : up * .8, lookY: shaded ? upY : -up * .4,
        eyes: shaded ? 'normal' : 'normal', mouth: shaded ? (grin ? 'smile' : 'smile') : 'flat', brow: shaded ? .3 : 0, boilKey: 'shani', seed: 3 };
      if (inView(w.x, T2 - 260, T2, 70)) {
        shani(w.x, T2, UB, so);
        shaniShades(w.x, T2, UB, so, shaded ? seg(t, PUT, PUT + .25) * 4 : 0);
        const [sx, sy] = shaniLocal(w.x, T2, UB, so, -3.0, -16.9);
        shaniCrow(sx - 4, sy - 6, 3.2, { flip: true, caw: t > PUT && t < PUT + .5 ? 1 : 0, look: -1, flap: w.moving ? Math.sin(t * 8) * .3 : 0, boilKey: 'crow' });
      }
    }
    // Parshurama (E2): stomps in, axe raised; SMILE: the grin; then the axe to his shoulder
    if (t > E2) {
      const w = walkTo(t, E2 + .1, E2 + 1.4, -200, POS.parsh[0], UB);
      const grinK = t > SMILE, shoulder = t > SMILE + 1.2;
      const po = { flip: 1, walk: w.walk, axe: shoulder ? 'shoulder' : 'raise', axeGlow: shoulder ? 0 : .4, handR: shoulder ? undefined : [6.4, -23], bendR: -1,
        eyes: grinK ? (shoulder ? 'happy' : 'wide') : 'angry', brow: grinK ? .8 : -1, mouth: grinK || grin ? 'grin' : 'frown', sweat: grinK && !shoulder ? 1 : 0,
        lookY: upY, beard: PSR.hair, beardLen: .5, quiver: false, boilKey: 'parsh', seed: 7, dy: grinK && !shoulder ? -spring(t, SMILE, 9, 14) * .3 : 0 };
      if (inView(w.x, T2 - 280, T2, 90)) parshurama(w.x, T2, UB, po);
    }
    // Ram, Sita, Lakshman and Hanuman (E1)
    if (t > E1) {
      const wl = walkTo(t, E1, E1 + 1.6, -200, POS.lak[0], UB);
      const wr = walkTo(t, E1, E1 + 1.6, 1250, POS.ram[0], UB);
      const ws = walkTo(t, E1 + .2, E1 + 1.75, 1340, POS.sita[0], UB);
      const wh = walkTo(t, E1 + .4, E1 + 1.9, 1430, POS.hanu[0], UB);
      const happy = t > SIND + .6;
      if (inView(wl.x, T2 - 270, T2, 60)) lakshman(wl.x, T2, UB, { walk: wl.walk, hx: wl.moving ? .5 : 0, eyes: grin ? 'happy' : happy ? 'happy' : blinks(t, 4) ? 'closed' : 'normal', mouth: grin ? 'grin' : 'smile', lookY: upY, boilKey: 'lak', seed: 4 });
      if (inView(wr.x, T2 - 280, T2, 60)) ram(wr.x, T2, UB, { walk: wr.walk, hx: wr.moving ? -.5 : happy ? .45 : 0, lookX: happy && !grin ? .8 : 0, eyes: grin ? 'happy' : happy ? 'happy' : blinks(t, 1) ? 'closed' : 'normal', mouth: grin ? 'grin' : 'smile', lookY: upY, boilKey: 'ram', seed: 1 });
      if (inView(ws.x, T2 - 270, T2, 60)) parvati(ws.x, T2, UB, { pal: SITA_PAL, ...SITA_SKIN, walk: ws.walk, eyes: grin || happy ? 'happy' : blinks(t, 5) ? 'closed' : 'normal', mouth: grin ? 'grin' : 'smile', lookY: upY, handR: happy && !grin && t < SIND + 2.2 ? [1.2, -18.4] : undefined, bendR: 1.4, boilKey: 'sita', seed: 5 });
      // Hanuman: glances at Ram, a bulb, POOF: vermilion
      if (inView(wh.x, T2 - 280, T2, 70)) {
        const glance = t > E1 + 2.1 && t < SIND, idea = t > E1 + 2.5 && t < SIND;
        const sin = t > SIND + .2 ? 1 : 0;
        hanuman(wh.x, T2, UB, { walk: wh.walk, sindoor: sin, hx: wh.moving ? -.5 : glance ? -.6 : 0, lookX: glance ? -1 : 0, lookY: upY,
          eyes: grin ? 'happy' : sin ? 'happy' : glance ? 'normal' : blinks(t, 6) ? 'closed' : 'normal', mouth: grin || sin ? 'grin' : 'smile',
          emote: idea ? 'bulb' : sin && t < SIND + 1.6 ? 'hearts' : null, emoteK: 1, emoteAge: t - E1 - 2.5, boilKey: 'hanu', seed: 6 });
        const [hx, hy] = naradaHead(wh.x, T2, UB, {});
        poof(hx, hy + 40, 150, t - SIND, 'hpoof');
      }
    }
    // ---- the middle row
    // Bal Hanuman (E6): flies in from the top right like a comet, lands sitting
    if (t > E6) {
      if (t < LAND) {
        const k = seg(t, E6 + .1, LAND), p0 = [1240, 420], p1 = [POS.balH[0], T1 - 3 * UBH], p = arcPt(p0, p1, -160, easeIn(k));
        const ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
        speedLines(p[0], p[1], ang, 260, 1, 'bhspeed');
        balHanuman(p[0], p[1], UBH, { pose: 'fly', rot: -1.0, flip: true, kick: t * 3, tail: 'stream', eyes: 'sparkle', mouth: 'open', mouthK: .6, handL: [-2.2, -11.5], handR: [2.0, -12], handShapeL: 'open', handShapeR: 'open', boilKey: 'balh' });
      } else if (inView(POS.balH[0], T1 - 160, T1, 80)) {
        const sq = spring(t, LAND, 8, 16) * .25;
        balHanuman(POS.balH[0], T1, UBH, { pose: 'sit', sq, eyes: grin ? 'happy' : t < LAND + .5 ? 'swirl' : blinks(t, 9) ? 'closed' : 'happy', mouth: grin ? 'grin' : 'grin', lookY: upY,
          handL: point ? [-1, -9] : undefined, handR: point ? [3.2, -6] : undefined, handShapeR: point ? 'point' : undefined, boilKey: 'balh' });
      }
    }
    // Shiva (E7): comes down seated in gold light to the centre
    if (t > E7 + .3) {
      const k = easeOut(seg(t, E7 + .4, SHIVA)), y = lerp(T1 - 760, T1, k);
      if (inView(POS.shiva[0], y - 290, y, 130)) {
        if (k < 1) { boilSeed('shiva glow'); glow(POS.shiva[0], y - 130, 300, '#FFE7A0', .8); }
        else { boilSeed('shiva glow'); glow(POS.shiva[0], y - 130, 240, '#FFE7A0', .45 * (1 - seg(t, SHIVA, SHIVA + 2)) + .1); }
        shiva(POS.shiva[0], y, USH, { ...SHV_SKIN, ...feel('serene', t), eyes: grin ? 'happy' : t > SHIVA + 1.2 ? 'normal' : 'closed', mouth: grin ? 'grin' : 'smile', snakeUp: grin ? .8 : t > SHIVA + .6 ? .5 : 0, snakeEyes: 'happy', noShadow: k < 1, boilKey: 'shiva' });
      }
    }
    // the owl (E3): swoops in with its sunglasses, puts them on Shani (PUT), flies to its seat on the middle riser
    if (t > OWL) {
      const sho = shaniHead(POS.shani[0], T2, UB, { down: 0 });
      let x, y, fly = true, rot = 0;
      if (t < PUT) { const k = easeOut(seg(t, OWL, PUT)); [x, y] = arcPt([760, 640], [sho[0] + 70, sho[1] + 60], -80, k); rot = -.3; }
      else if (t < PUT + 1.1) { const k = ease(seg(t, PUT + .15, PUT + 1.1)); [x, y] = arcPt([sho[0] + 70, sho[1] + 60], [POS.owl[0], T1], -260, k); rot = .2 * (1 - k); fly = k < 1; }
      else { x = POS.owl[0]; y = T1; fly = false; }
      if (inView(x, y - 140, y, 90)) {
        const flap = fly ? Math.sin(t * 22) : 0;
        owl(x, y, UOW, { rot, dy: fly ? -.8 : 0, shades: t < PUT ? 1 : 0, eyes: grin ? 'happy' : fly ? 'wide' : blinks(t, 11) ? 'closed' : 'happy', mouth: grin ? 'grin' : 'smile',
          wingL: fly ? [-5.6, -9 - flap * 2.4] : undefined, wingR: fly ? [5.6, -9 - flap * 2.4] : undefined, wingShapeL: fly ? 'open' : undefined, wingShapeR: fly ? 'open' : undefined,
          htilt: fly ? 0 : .1 * Math.sin(t * 1.3), boilKey: 'owl' });
      }
    }
    // ---- the front row
    spot(SPOT[0], SPOT[1], o.spot || 0, t);
    // Kanha (E4): tiptoes in with the butter, sets it down, licks his fingers
    if (t > E4) {
      const w = walkTo(t, E4 + .1, E4 + 1.3, -160, POS.kanha[0], UK), set = t > E4 + 1.5;
      const lick = t > LICK && t < LICK + 1.3, dip = t > LICK - .5 && t < LICK;
      if (set) butterPot(POS.pot[0], FL, 30, 'pot', { dip: t > LICK - .3 });
      if (inView(w.x, FL - 220, FL, 70)) {
        balKrishna(w.x, FL, UK, { walk: w.walk, hx: w.moving ? .5 : 0,
          eyes: grin ? 'happy' : lick ? 'happy' : w.moving ? 'innocent' : blinks(t, 12) ? 'closed' : 'normal', mouth: grin ? 'grin' : lick ? 'chew' : 'smile', lookY: upY,
          handL: set ? undefined : [-1.6, -6.2], handR: lick ? [.6, -11.2] : dip ? [3.6, -4.6] : set ? (point ? [3.4, -9.5] : undefined) : [1.6, -6.2],
          handShapeR: point ? 'point' : lick ? 'fist' : 'open', mud: 0, boilKey: 'kanha',
          held: set ? undefined : (u, sw) => butterPot(0, -2.0 * u, 2.6 * u, 'potheld') });
        if (lick) { boilSeed('kanha butter'); const [mx, my] = bkMouth(w.x, FL, UK, {}); paint(ellPts(mx + 6, my + 8, 6, 5, 8), { wash: LK.butter, ink: null }); }
      }
    }
    // Mooshak: rides Bappa's turban until he smells the butter, then hops to the pot
    const mooHop = seg(t, LICK + .4, LICK + 1.1);
    // Bappa: walks in (D), directs, watches, clutches his head at Shani's gaze, gestures to the spot, poses
    if (t > D0 + .4) {
      const w = walkTo(t, D0 + .5, D0 + 1.7, -160, POS.bappa[0], UBP);
      const keys = [[D0, 'excited', { eyes: 'happy', mouth: 'grin' }], [E1 + .5, 'happy'], [SIND + .4, 'laugh'], [E2 + .8, 'nervous'], [SMILE + .8, 'happy'],
        [CLUTCH, 'scared', { mouth: 'wail' }], [PUT + .3, 'relieved'], [E4 + 1, 'happy'], [E5 + .6, 'surprised'], [PULL + 1.4, 'happy'],
        [E7 + .6, 'love', { eyes: 'happy' }], [F0 + .3, 'thinking'], [F0 + 1.3, 'happy'], [MODAK - .2, 'excited', { eyes: 'happy', mouth: 'grin' }]];
      const mood = emotions(t, keys, { take: .5 });
      const clutch = t > CLUTCH && t < PUT + .3, wave = t > D0 + 1.8 && t < E1;
      const gest = t > F0 + 1.3 && t < G0 + .3;
      const watch = t < E2 ? -.6 : t < E4 ? -.9 : t < E5 + 2 ? .8 : t < E7 ? -.3 : t < F0 ? .2 : t < F0 + 1.3 ? .7 : 0;
      const bo = { ...mood, stand: 1, walk: w.walk, boilKey: 'bappa',
        aL: clutch ? 1.35 : wave ? 1.1 + .3 * Math.sin(t * 9) : say(t) ? 1.0 : mood.aL, aR: clutch ? 1.35 : gest ? .25 : say(t) ? 1.0 : mood.aR,
        lookX: w.moving ? .6 : clutch ? 0 : watch, hx: w.moving ? .4 : gest ? .5 : clutch ? 0 : watch * .4, lookY: t > F0 + .3 && t < F0 + 1.3 ? .7 : upY * .8,
        trunk: clutch ? 'up' : say(t) ? 'up' : 'curl', ear: clutch ? .9 : 0 };
      if (inView(w.x, FL - 260, FL, 90)) balBappa(w.x, FL, UBP, bo);
      const tx = w.x + 4, ty = FL - 18.6 * UBP + (bo.dy || 0) * UBP;
      if (mooHop <= 0) mooshak(tx, ty, 5.2, { boilKey: 'moo', eyes: clutch ? 'wide' : 'happy', mouth: 'smile', tail: t * 2, rot: clutch ? .2 * Math.sin(t * 20) : 0 });
    }
    if (mooHop > 0) {
      const p = arcPt([POS.bappa[0] + 4, FL - 18.6 * UBP], [POS.moo[0], FL], -120, ease(mooHop));
      mooshak(p[0], p[1], mooHop < 1 ? 5.2 : 6, { boilKey: 'moo', eyes: grin ? 'happy' : 'happy', mouth: 'smile', tail: t * 2, flip: mooHop >= 1, rot: mooHop < 1 ? -1.2 * Math.sin(mooHop * Math.PI) : 0 });
    }
    // Nandi (E7): walks in after Shiva lands and kneels, facing left
    if (t > SHIVA + .5) {
      const w = walkTo(t, SHIVA + .6, SHIVA + 2.0, 1340, POS.nandi[0], UN);
      if (inView(w.x, FL - 170, FL, 120)) nandi(w.x, FL, UN, { flip: true, walk: w.walk, kneel: ease(seg(t, SHIVA + 2.1, SHIVA + 2.7)), eyes: grin ? 'happy' : 'normal', boilKey: 'nandi' });
    }
  }

  // ================= D · the camera's view: the empty studio; Bappa waves everyone in =================
  function shotEmpty(t, lt, dur) {
    camK(t, [[D0, [540, 1170, 1.12]], [E1, [540, 1190, 1.2]]]);
    studioSet(t);
    family(t);
    camEnd();
    caps(t);
    if (lt < .5) { flushLetters(); iris(540, 960, lerp(0, 1500, easeOut(lt / .5)), '#1A1418'); }
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, WIPE); }
  }

  // ================= E1 · Ram's family; Hanuman's sindoor =================
  function shotRam(t, lt, dur) {
    camK(t, [[E1, [530, 1000, 1.65]], [E2, [535, 1005, 1.76]]]);
    studioSet(t);
    family(t);
    camEnd();
    caps(t);
    wipeIn(lt, WIPE);
  }

  // ================= E2 · Parshurama =================
  function shotParsh(t, lt, dur) {
    const steps = [0, 1, 2, 3].map(i => E2 + .35 + i * .3), sh = steps.reduce((a, s) => { const v = shake(t, s, .2, 9); return [a[0] + v[0], a[1] + v[1]]; }, [0, 0]);
    camK(t, [[E2, [250, 1000, 1.85]], [SMILE - .1, [240, 990, 1.95]], [SMILE + .25, [222, 880, 3.4]], [E3, [222, 875, 3.5]]], sh, easeOut);
    studioSet(t);
    family(t);
    camEnd();
    caps(t);
    if (lt < .12) flash(.4 * (1 - lt / .12), '#FFFFFF');
  }

  // ================= E3 · Shani's gaze, Bappa's head, the owl's shades =================
  function shotShani(t, lt, dur) {
    if (t < CLUTCH) camK(t, [[E3, [210, 995, 1.8]], [CLUTCH, [190, 980, 1.95]]]);
    else if (t < OWL) camK(t, [[CLUTCH, [396, 1450, 2.4]], [OWL, [396, 1455, 2.55]]], shake(t, CLUTCH, .3, 6));
    else camK(t, [[OWL, [300, 975, 1.55]], [E4, [270, 990, 1.68]]]);
    studioSet(t);
    family(t);
    camEnd();
    caps(t);
    if (t >= CLUTCH && t < CLUTCH + .1) flash(.35, '#FFFFFF');
    if (t >= OWL && t < OWL + .1) flash(.3, '#FFFFFF');
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, WIPE); }
  }

  // ================= E4 · Kanha's butter =================
  function shotKanha(t, lt, dur) {
    camK(t, [[E4, [235, 1470, 2.25]], [E5, [245, 1480, 2.4]]]);
    studioSet(t);
    family(t);
    camEnd();
    caps(t);
    wipeIn(lt, WIPE);
  }

  // ================= E5 · Ravana doesn't fit: the camera pulls all the way back =================
  function shotRavana(t, lt, dur) {
    camK(t, [[E5, [690, 1000, 2.7]], [PULL, [700, 1000, 2.65]], [PULL + 1.5, [540, 1150, 1.0]], [E6, [540, 1152, 1.0]]]);
    studioSet(t);
    family(t);
    camEnd();
    caps(t);
    wipeIn(lt, WIPE);
  }

  // ================= E6 · Bal Hanuman flies in; Narad floats in =================
  function shotFly(t, lt, dur) {
    camK(t, [[E6, [560, 1095, 1.16]], [E7, [570, 1100, 1.2]]], shake(t, LAND, .25, 8));
    studioSet(t);
    family(t);
    camEnd();
    caps(t);
    if (lt < .12) flash(.3 * (1 - lt / .12), '#FFFFFF');
  }

  // ================= E7 · Bappa's dad =================
  function shotShiva(t, lt, dur) {
    camK(t, [[E7, [540, 820, 1.3]], [SHIVA, [540, 1100, 1.1]], [F0, [540, 1145, 1.02]]]);
    const light = seg(t, E7, E7 + .6) * (1 - .6 * seg(t, SHIVA + 1, SHIVA + 3));
    studioSet(t, { light });
    family(t, { look: ease(seg(t, E7 + .3, E7 + .8)) * (1 - ease(seg(t, SHIVA + .8, SHIVA + 1.6))) });
    if (t > SHIVA && t < SHIVA + 3) confetti(540, 700, t - SHIVA, 'petals', 28, 360);
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [LK.marigoldLt, LK.gold]); }
  }

  // ================= F · one spot is still empty =================
  function shotSpot(t, lt, dur) {
    camK(t, [[F0, [540, 1145, 1.02]], [G0, [540, 1165, 1.07]]]);
    studioSet(t);
    family(t, { spot: ease(seg(t, F0 + .9, F0 + 1.6)) });
    camEnd();
    caps(t);
  }

  // ================= G + H · say modak, FLASH, the photo; the ask =================
  function shotPhoto(t0, lt, dur) {
    const t = Math.min(t0, FLASH), frz = t0 > FLASH;
    if (!frz) camK(t, [[G0, [540, 1165, 1.07]], [FLASH, [540, 1160, 1.05]]]);
    else camK(t0, [[FLASH, [540, 1160, 1.05]], [H0, [540, 1160, 1.05]], [CARD, [530, 1180, 1.13]]]);
    studioSet(t);
    family(t, { spot: 1, frozen: frz });
    camEnd();
    if (frz) {
      const a = t0 - FLASH;
      if (a < .3) flash(1 - a / .3, '#FFFFFF');
      photoBorder();
    }
    caps(t0);
    if (t0 > CARD - .3) { flushLetters(); brushWipe((t0 - (CARD - .3)) / .6, WIPE); }
  }

  // ================= I · the card =================
  function shotCard(t, lt) {
    lakhCard(t, CARDC);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, WIPE); }
  }

  window.lakhFamily = family;   // for the cover (lakh_cover.js)
  window.LAKH_T = { MODAK, FLASH };

  shots([[0, shotHook], [B0, shotOld], [C0, shotCamera], [D0, shotEmpty], [E1, shotRam], [E2, shotParsh], [E3, shotShani],
    [E4, shotKanha], [E5, shotRavana], [E6, shotFly], [E7, shotShiva], [F0, shotSpot], [G0, shotPhoto], [CARD, shotCard]]);
})();
