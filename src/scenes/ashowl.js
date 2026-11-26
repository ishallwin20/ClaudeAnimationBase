// ashowl.js: "An OWL gave him the darkest idea in the Mahabharata" (ad 118, the first CHIRANJEEVI comic reel; Painted,
// Bangers captions, synth SFX, no voice, ~52 s). The Painted story runs from the banyan to the Pandava camp's gate
// (Sauptika Parva 10.1), then the painting turns to ink and the comic's own pages take over: the gate's guardian (p20),
// Shiva (p23), the camp (p24), a locked page, the cover. The marketing is the story's ending: "The reel stops here.
// The comic doesn't." STORYBOARD.md has the plan and the sources; sets and props are in ashowl_props.js. All times are
// video time (t); tools/ashowl_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/ashowl_sfx.mjs)
  const BLINK = .8, LOOKUP = 1.3, EYESOFF = 2.5;
  const B0 = 3, LIT = [3.8, 4.4, 5];
  const C0 = 7.6, ZZ = 8.4, HISS = 9.8, FLARE = 10.6, UP = 11.4;
  const D0 = 12.2, EYES = 15;
  const E0 = 16.8, STRIKES = [18, 18.9, 19.7], WAVE0 = 19.9, WAVE1 = 20.7, PERCH = 21.1;
  const F0 = 22.4, PULL = 23.4, SMILE = 25, GFLARE = 25.4;
  const G0 = 27.4, TURN = 27.7, GRIP = 28.4, WALK0 = 29, PUSH = 30.2, RISE = 30.7;
  const H0 = 31.8, INKED = 32.3, SLOT = 33.4;
  const I0 = 36.4, SW1 = 36.4, SW2 = 38.7, SW3 = 40.8, LOCK = 41.2;
  const J0 = 44.2, END = 50.4;

  const GOLDC = '#F5C542', INKW = ['#16121C', '#2C2438'];
  const PAGE = { x: 540, y: 1062, w: 680, h: 850 };   // a comic page's slot on screen (4:5), under a two-line caption
  const pk = (t, t0) => Math.max(0, t - t0) * 5;
  const blinkAt = (t, t0, d = .14) => t > t0 && t < t0 + d;
  const kick = (t, t0) => t > t0 ? .05 * Math.exp(-(t - t0) * 6) * Math.cos((t - t0) * 20) : 0;

  // ---- the cast
  const AX = 540, AU = 34;
  const ASIT = { boilKey: 'ash', seed: 71, sit: 1, mudra: 0, handL: [-4.5, -9.5], handR: [4.4, -9.6], bendL: .6, bendR: .6 };
  function ash(x, y, u, o) {
    ashwatthama(x, y, u, o);
    const [gx, gy] = ashGem(x, y, u, o), g = o.gemK ?? 1;   // the gem's light on the night (extra, over the rig's own)
    if (g > 0) { boilSeed('gemglow'); glow(gx, gy, u * 4.5 * (.9 + .1 * Math.sin(T * 3)), '#5CC8E8', 60 * g); }
  }

  // ---- every caption: [text, y, t0, life, size, colour]
  const two = (a, b, t0, life, sa = 72, sb = 76, gold = 1) => [[a, 470, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 470 + (sa + sb) * .68, t0 + .35, life - .35, sb, gold === 1 ? GOLDC : undefined]];
  const CAPS = [
    ['AN OWL GAVE HIM', 476, -1, B0 - .1 + 1, 70], ['THE DARKEST IDEA', 574, -1, B0 - .1 + 1, 104, GOLDC], ['IN THE MAHABHARATA', 672, -1, B0 - .1 + 1, 70],
    ...two('THE KAURAVAS HAD LOST THE WAR.', 'THREE SURVIVORS HID UNDER A BANYAN.', B0, C0 - B0 - .2, 66, 60, -1),
    ['TWO OF THEM SLEPT. ONE COULDN\'T:', 470, C0 + .2, D0 - C0 - .4, 62], ['ASHWATTHAMA', 572, C0 + .6, D0 - C0 - .8, 108, GOLDC],
    ...two('ABOVE HIM, THOUSANDS OF CROWS', 'SLEPT SAFE IN THE BANYAN.', D0, 4.2, 66, 74, -1),
    ...two('THEN AN OWL CAME…', 'AND KILLED THEM IN THEIR SLEEP.', E0, 4.4, 84, 66, 0),
    ...two('"THIS BIRD HAS JUST TAUGHT ME', 'HOW TO FIGHT."', F0 + .3, 4.6, 70, 96),
    ...two('ACROSS THE FIELD,', 'THE PANDAVA CAMP WAS ASLEEP.', G0 + .1, 4.1, 74, 70, -1),
    ...two('AT THE GATE,', 'SOMETHING WAS WAITING.', H0 + .9, I0 - H0 - 1.1, 74, 84),
    ...two('WHAT HAPPENED THAT NIGHT', 'IS TOO DARK FOR A REEL.', SW1 + .2, SW3 - SW1 - .4, 70, 76),
    ...two('SO WE DREW IT AS A COMIC.', '48 PAGES. ALL FROM THE MAHABHARATA.', SW3 + .1, J0 - SW3 - .2, 72, 54, 0),
    ...two('THE REEL STOPS HERE.', 'THE COMIC DOESN\'T.', J0 + .2, END - J0 + 1, 78, 90),
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };
  // the series mark (opening only): "FROM THE COMIC · CHIRANJEEVI #1"
  function seriesPill(t) {
    const a = 1 - seg(t, 6.4, 7.0); if (a <= 0) return;
    boilSeed('pill');
    paint(rrPts(64, 1438, 470, 56, 28), { wash: '#F15A24', washOp: 255 * a, ink: a < 1 ? null : AO.ink, sw: 1 });
    letter('FROM THE COMIC · CHIRANJEEVI #1', 299, 1467, 32, AO.cream, { screen: true, ink: false, rot: 0, alpha: a, maxW: 430 });
  }
  function source(txt, age, life) {
    if (age < 0 || age > life) return;
    const a = clamp(age * 4) * (1 - seg(age, life - .25, life));
    letter(txt, 470, 1468, 30, AO.cream, { screen: true, ink: false, rot: 0, alpha: a, stroke: AO.ink, sw: .2, maxW: 760 });
  }

  // ================= the banyan world (A–E): one set, one camera per shot =================
  // strikes: crows taken one by one, then the rest in a wave
  const TARGETS = [9, 2, 16];
  const deadAt = i => { const s = TARGETS.indexOf(i); if (s >= 0) return STRIKES[s]; return lerp(WAVE0, WAVE1, hash(i * 7.31)); };
  function banyanWorld(t, o = {}) {
    aoSky('b', 1120, -680, 130);
    aoBanyan('b', t, { dead: o.dead ? deadAt : () => -1 });
    aoGround('b', t);
  }
  function sleepers(t) {
    aoSleeper(40, AO_GY, 17, 'kripa', t, -1);
    aoSleeper(1040, AO_GY, 17, 'krita', t, 1);
  }

  // ================= A · the hook: Ashwatthama awake, the owl's eyes on him =================
  function shotA(t, lt, dur) {
    const z = 1.12 + .07 * lt, eo = -lt * 8;
    camBegin(560, 1070 + eo, z);
    banyanWorld(t);
    const ek = t < EYESOFF ? (blinkAt(t, BLINK, .22) ? .1 : 1) : 1 - clamp((t - EYESOFF) / .25);
    aoOwlShadow(860, 905, 44, 1, 'hook');
    aoEyes(860, 900, 32, ek, 'hook');
    const look = clamp((t - LOOKUP) / .4);
    ash(AX, AO_GY, AU, { ...ASIT, eyes: blinkAt(t, 3.6) ? 'closed' : 'angry', brow: -.7, mouth: 'frown', lookX: .8 * ease(look), lookY: -.3 * ease(look), hx: .15 * ease(look), puff: .1 + .08 * Math.sin(t * 2.4) });
    camEnd();
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, INKW); }
  }
  // ================= B · the three under the banyan (wide) =================
  function shotB(t, lt, dur) {
    const z = .8 - .06 * ease(lt / dur);
    camBegin(540, 1080 - lt * 8, z);
    banyanWorld(t);
    sleepers(t);
    LIT.forEach((t0, i) => {   // the moon picks out the three, one by one
      const k = clamp((t - t0) / .3) * (1 - .5 * clamp((t - t0 - .9) / .6)), x = [40, 1040, 540][i];
      if (k > 0) { boilSeed('lit' + i); glow(x, AO_GY - 120, 260, '#AFC4FF', 50 * k); }
    });
    ash(AX, AO_GY, AU, { ...ASIT, eyes: 'angry', brow: -.6, mouth: 'frown', puff: .1 });
    emote('zzz', 1040 + 13 * 17 * .9, AO_GY - 80, 30, 1, t);
    camEnd();
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, INKW); }
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, INKW); }
  }
  // ================= C · he can't sleep (close) =================
  function shotC(t, lt, dur) {
    const [hx, hy] = naradaHead(AX, AO_GY, AU, ASIT);
    const z = 2.0 + .25 * ease(lt / dur) + (t > UP ? .1 * ease(clamp((t - UP) / .6)) : 0);
    const up = t > UP ? ease(clamp((t - UP) / .8)) : 0;
    camBegin(hx + 30, hy - 10 - up * 160, z, -.01);
    banyanWorld(t);
    const zz = clamp((t - ZZ) / .4);
    if (zz > 0) emote('zzz', hx - 240 + (t - ZZ) * 60, hy + 40 - (t - ZZ) * 30, 34, 1, t - ZZ + .5);
    const hiss = t > HISS ? Math.exp(-(t - HISS) * 2.2) : 0, rage = t > FLARE ? ease(clamp((t - FLARE) / .4)) : 0;
    ash(AX, AO_GY, AU, { ...ASIT, eyes: blinkAt(t, 11.2) ? 'closed' : 'angry', brow: -.6 - .4 * rage, mouth: hiss > .3 ? 'scream' : 'frown',
      lookX: t < ZZ + .5 ? 0 : t < HISS ? -.6 : 0, lookY: -1 * up, htilt: -.04 * up, puff: .15 + .5 * hiss + .1 * Math.sin(t * 3), gem: .8 + .2 * rage, gemK: 1 + 1.5 * rage * (.8 + .2 * Math.sin(t * 9)), sq: kick(t, HISS) });
    if (hiss > .05) { boilSeed('hissbreath'); const [mx, my] = naradaMouth(AX, AO_GY, AU, ASIT); for (let i = 0; i < 3; i++) { const a = t - HISS - i * .12; if (a > 0 && a < .9) paint(ellPts(mx + (i - 1) * 18 + a * 60 * (i - 1), my + 20 + a * 40, 16 + a * 40, 8 + a * 16, 10), { fill: '#C8D4F0', fillOp: 90 * (1 - a / .9), bleed: .3, tex: .3, ink: null }); } }
    camEnd();
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, INKW); }
  }
  // ================= D · above him, the crows asleep; two eyes open =================
  function shotD(t, lt, dur) {
    const k = ease(clamp(lt / 1.6)), pe = ease(clamp((t - EYES - .3) / 1.5));
    const cx = lerp(560, 600, k) + 200 * pe, cy = lerp(980, 250, k) - 380 * pe, z = lerp(1.2, .95, k) + .45 * pe;
    camBegin(cx, cy, z);
    banyanWorld(t);
    ash(AX, AO_GY, AU, { ...ASIT, eyes: 'angry', mouth: 'frown', lookY: -1, htilt: -.04 });
    const ek = t > EYES ? (blinkAt(t, EYES + 1.0, .2) ? .1 : clamp((t - EYES) / .35)) : 0;
    aoEyes(1010, -260, 32, ek, 'd');
    camEnd();
  }
  // ================= E · the owl takes the crows =================
  // the owl's flight: keys [t, x, y, rot]; (x, y) is the ground point under the owl's feet
  const crowPt = i => { const [b, k, s] = AO_CROWS[i]; const [x, y] = aoBranchPt(b, k); return [x, y - s * 1.2]; };
  const P1 = crowPt(TARGETS[0]), P2 = crowPt(TARGETS[1]), P3 = crowPt(TARGETS[2]);
  const OWLK = [[E0, 1500, -900, -.5], [STRIKES[0], P1[0], P1[1], .2], [STRIKES[0] + .25, P1[0] - 60, P1[1] - 140, -.2], [STRIKES[1], P2[0], P2[1], -.25],
    [STRIKES[1] + .25, P2[0] + 80, P2[1] - 130, .2], [STRIKES[2], P3[0], P3[1], .25], [WAVE0, P3[0] + 120, P3[1] - 160, -.1], [WAVE0 + .4, -100, -300, -.4],
    [WAVE0 + .8, 560, -560, .3], [WAVE1, 1150, -250, .1], [PERCH, ...(() => { const p = aoBranchPt(4, .98); return [p[0], p[1] + 4]; })(), 0]];
  const owlAt = t => {
    const ks = OWLK; if (t <= ks[0][0]) return ks[0].slice(1); if (t >= ks[ks.length - 1][0]) return ks[ks.length - 1].slice(1);
    let j = 0; while (ks[j + 1][0] < t) j++; const [a, b] = [ks[j], ks[j + 1]], q = ease(clamp((t - a[0]) / (b[0] - a[0])));
    return [lerp(a[1], b[1], q), lerp(a[2], b[2], q) - Math.sin(q * Math.PI) * 60, lerp(a[3], b[3], q)];
  };
  function shotE(t, lt, dur) {
    const [ox, oy, orot] = owlAt(t), wide = ease(clamp((t - WAVE1 + .2) / .8));
    let cx = lerp(560, ox, .45), cy = lerp(-60, oy - 150, .45), z = .9;
    for (const s of STRIKES) { const q = Math.exp(-Math.abs(t - s) * 3); z += .25 * q; }
    cx = lerp(cx, 560, wide); cy = lerp(cy, -180, wide); z = lerp(z, .62, wide);
    let sh = [0, 0]; for (const s of STRIKES) if (t > s && t < s + .4) { const d = shakeXY(t, 14 * (1 - (t - s) / .4)); sh = [sh[0] + d[0], sh[1] + d[1]]; }
    camBegin(cx + sh[0], cy + sh[1], z);
    banyanWorld(t, { dead: 1 });
    STRIKES.forEach((s, j) => { const p = [P1, P2, P3][j], a = t - s; aoFeathers(p[0], p[1] - 20, a, 'strike' + j, 14, 1.3); if (a > 0 && a < .35) { boilSeed('hit' + j); glow(p[0], p[1] - 20, 140, '#DDE6FF', 160 * (1 - a / .35)); } });
    AO_CROWS.forEach((c, i) => { if (TARGETS.includes(i)) return; const td = deadAt(i), p = crowPt(i); aoFeathers(p[0], p[1] - 10, t - td, 'wave' + i, 5, .8); });
    const perched = t >= PERCH, fl = perched ? 0 : Math.sin(t * 22);
    const wing = perched ? {} : { wingL: [-9.6, -9 + 3.5 * fl], wingR: [9.6, -9 + 3.5 * fl], wingShapeL: 'open', wingShapeR: 'open', bendL: 1, bendR: 1 };
    aoOwl(ox, oy, 21, { boilKey: 'owl', seed: 90, rot: perched ? 0 : orot, ...wing, eyeGlow: 1, puff: perched ? .3 : 0, hx: perched ? Math.sin(t * .8) * .3 : 0, sq: perched ? kick(t, PERCH) * 2 : 0 });
    camEnd();
    if (wide > 0) { boilSeed('feather rain'); for (let i = 0; i < 26; i++) { const a = (t - WAVE1 + i * .17) % 2.6, x = hash(i * 9.1) * W, y = 380 + a * 520 + hash(i) * 200, r = Math.sin(t * 3 + i); push(); translate(x + Math.sin(t * 2 + i) * 30, y); rotate(r); paint([[-14, 0], [-4, -5], [14, 0], [-4, 5]], { wash: AO.feather, washOp: 230 * wide, ink: AO.featherLt, sw: .5, curv: .5 }); pop(); } }
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, INKW); }
  }

  // ================= F · his eye; the lesson =================
  const FIX = { ...ASIT };
  function shotF(t, lt, dur) {
    const [ex, ey] = naradaEye(AX, AO_GY, AU, FIX, 1), [hx, hy] = naradaHead(AX, AO_GY, AU, FIX);
    const p = ease(clamp((t - PULL) / 1.6)), z = lerp(6.5, 2.1, p), cx = lerp(ex, hx + 20, p), cy = lerp(ey, hy + 150, p);
    camBegin(cx, cy, z);
    banyanWorld(t, { dead: 1 });
    const sm = t > SMILE ? ease(clamp((t - SMILE) / .5)) : 0, gf = t > GFLARE ? Math.exp(-(t - GFLARE) * 1.2) : 0;
    ash(AX, AO_GY, AU, { ...FIX, eyes: sm > .5 ? 'angry' : 'wide', brow: sm > .5 ? -.8 : 0, mouth: sm > .5 ? 'smug' : 'flat', swMul: lerp(.28, 1, p), gem: 1, gemK: 1 + 3 * gf });
    if (p < .9) {   // the owl, small, in his eye
      boilSeed('reflect'); const a = 1 - clamp(p / .9), s = 7;
      glow(ex + 2, ey - 1, s * 2.4, '#AFC4FF', 60 * a);
      paint(ellPts(ex + 2, ey + 1, s * .8, s, 12), { wash: '#C8B08A', washOp: 200 * a, ink: null });
      paint(ellPts(ex + 2, ey - s * .8, s * .75, s * .6, 12), { wash: '#C8B08A', washOp: 200 * a, ink: null });
      for (const sx of [-1, 1]) { paint([[ex + 2 + sx * s * .4, ey - s * 1.1], [ex + 2 + sx * s * .7, ey - s * 1.8], [ex + 2 + sx * s * .8, ey - s * 1]], { wash: '#C8B08A', washOp: 200 * a, ink: null }); paint(ellPts(ex + 2 + sx * s * .3, ey - s * .8, s * .2, s * .2, 6), { wash: '#FFE36A', washOp: 255 * a, ink: null }); }
    }
    camEnd();
    source('MAHABHARATA · SAUPTIKA PARVA 10.1.44', t - F0 - .8, dur - 1);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, INKW); }
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, INKW); }
  }

  // ================= G · to the Pandava camp; something rises at the gate =================
  const GX0 = 250, GX1 = 520, GU = 27, GATE = [760, 1180];
  function shotG(t, lt, dur) {
    const tt = Math.min(t, H0);   // the freeze: H holds this frame
    const wk = clamp((tt - WALK0) / (PUSH + 1.2 - WALK0)), x = lerp(GX0, GX1, ease(wk)), push2 = ease(clamp((tt - PUSH) / 1.6));
    camBegin(lerp(560, GATE[0], push2 * .8), lerp(1150, GATE[1] - 60, push2 * .8), 1 + 1.1 * push2);
    aoSky('g', 980, 560, 90);
    aoCamp('g', tt, { hz: 1180, cx: 820, gx: GATE[0] });
    aoGuardian(GATE[0], GATE[1] + 40, 640, ease(clamp((tt - RISE) / 1.1)), 'g');
    const turn = ease(clamp((tt - TURN) / .5)), grip = clamp((tt - GRIP) / .3);
    ash(x, 1760, GU, { boilKey: 'ashg', seed: 72, dhanush: 1, eyes: 'angry', brow: -.5 - .5 * grip, mouth: 'frown', hx: .7 * turn, lookX: .9 * turn,
      walk: wk > 0 && wk < 1 ? (tt - WALK0) * 1.6 : 0, wind: .3, sq: kick(tt, GRIP) });
    camEnd();
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, INKW); }
  }
  // ================= H · the painting turns to ink: the comic's page =================
  function pageBg(t, key) {
    boilSeed('pagebg ' + key);
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#16121C', ink: null });
    glow(540, 1060, 620, '#FF7A2A', 40 + 10 * Math.sin(t * 2));
    for (let i = 0; i < 18; i++) {   // embers drifting up
      const a = (t * (.25 + hash(i) * .2) + hash(i * 3.3)) % 1, x = 80 + hash(i * 5.7) * 920 + Math.sin(t + i) * 30, y = 1650 - a * 1400;
      glow(x, y, 10, '#FFB060', 120 * Math.sin(a * Math.PI));
    }
  }
  function page(img, x, y, s, o = {}) { picture(img, x, y, PAGE.w * s, PAGE.h * s, { r: 10, shadow: 34, ...o }); }
  function shotH(t, lt, dur) {
    if (t < INKED) {   // the frozen painting, ink spreading over it
      shotG(H0, H0 - G0, 0);
      flushLetters(); brushWipe(clamp((t - H0) / (INKED - H0)) * .5, INKW);
      return;
    }
    pageBg(t, 'h');
    const q = ease(clamp((t - INKED) / (SLOT - INKED))), full = 1920 / PAGE.h;   // the page fills the frame, then settles into its slot
    page(PICS.ashwatthama_p20, lerp(540, PAGE.x, q), lerp(960, PAGE.y, q), lerp(full, 1, q), { r: lerp(0, 10, q), shadow: 34 * q });
  }
  // ================= I · the pages swipe; the night is locked =================
  function shotI(t, lt, dur) {
    pageBg(t, 'i');
    const pages = [[PICS.ashwatthama_p20, -1], [PICS.ashwatthama_p23, SW1], [PICS.ashwatthama_p24, SW2], [PICS.ashwatthama_p29_blur, SW3]];
    let cur = 0; pages.forEach((p, i) => { if (t >= p[1] + .5 && i > 0) cur = i; });
    pages.forEach(([img, t0], i) => {
      const inK = t0 < 0 ? 1 : ease(clamp((t - t0) / .5)), nxt = pages[i + 1], outK = nxt ? ease(clamp((t - nxt[1]) / .5)) : 0;
      if (inK <= 0 || outK >= 1) return;
      const x = PAGE.x + (1 - inK) * 900 - outK * 900, rot = (1 - inK) * .08 - outK * .08;
      page(img, x, PAGE.y, 1, { rot });
      if (i === 3) {
        const lk = clamp((t - LOCK) * 4);
        if (lk > 0) {
          picture(PICS.ashwatthama_lock, x, PAGE.y - 40, 150, 180, { pop: pk(t, LOCK) });
          letter('PAGE 29 OF 48', x, PAGE.y + 110, 52, AO.cream, { screen: true, ink: false, rot: 0, stroke: AO.ink, sw: .2, pop: pk(t, LOCK + .15) });
          letter('ONLY IN THE COMIC', x, PAGE.y + 172, 40, GOLDC, { screen: true, ink: false, rot: 0, stroke: AO.ink, sw: .2, pop: pk(t, LOCK + .3) });
        }
      }
    });
  }
  // ================= J · the cover: the reel stops, the comic doesn't =================
  function shotJ(t, lt, dur) {
    pageBg(t, 'j');
    const out = ease(clamp(lt / .5)), q = ease(clamp((lt - .2) / .6));
    if (out < 1) { page(PICS.ashwatthama_p29_blur, PAGE.x - out * 900, PAGE.y, 1, { rot: -out * .08 }); picture(PICS.ashwatthama_lock, PAGE.x - out * 900, PAGE.y - 40, 150, 180); }
    if (q > 0) {
      const br = 1 + .012 * Math.sin(t * 1.5);
      picture(PICS.ashwatthama_p01, 540, lerp(1500, 958, q), 520 * br, 650 * br, { r: 10, shadow: 40, rot: lerp(.1, -.015, q) });
    }
    const C = { line: J0 + .9, pill: J0 + 1.3, bio: J0 + 1.6 };
    if (t > C.line) letter('CHIRANJEEVI · ISSUE 1 · OUT NOW', 540, 1322, 40, AO.cream, { screen: true, font: '700 52px Poppins', ink: false, maxW: 860, pop: pk(t, C.line) });
    if (t > C.pill) {
      const k = backOut(clamp(pk(t, C.pill))) * (1 + .03 * pulse(t, 4));
      boilSeed('pill j');
      push(); translate(540, 1400); scale(k); paint(rrPts(-210, -40, 420, 80, 40), { wash: '#F15A24', ink: null }); pop();
      letter('rishikatha.com', 540, 1402, 46, AO.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(t, C.pill) });
    }
    if (t > C.bio) letter('Link in bio · Follow @therishikatha', 540, 1474, 32, '#D9CFE6', { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(t, C.bio) });
  }

  // the timeline: shots, then the captions and the series pill over everything
  const SHOTS = [[0, shotA], [B0, shotB], [C0, shotC], [D0, shotD], [E0, shotE], [F0, shotF], [G0, shotG], [H0, shotH], [I0, shotI], [J0, shotJ]];
  shots(SHOTS.map(([t0, fn]) => [t0, (t, lt, dur) => { fn(t, lt, dur); seriesPill(t); caps(t); }]));
})();
