// sanj.js: "Why did Hanuman bring the WHOLE MOUNTAIN?" (ad 32, ~63 s, Painted, an English voiceover with captions in
// Bangers, SFX), told as Valmiki tells it. Ravana's spear, made by Maya and hung with eight bells, strikes Lakshman
// (Yuddha 100); Ram pulls it out and breaks it, and weeps; Sushena finds him alive and sends Hanuman for four herbs;
// on the mountain Hanuman can't tell them apart, so he shakes the peak three times and brings it all; Lakshman breathes
// the herbs and rises (Yuddha 101). The twist: it was his second mountain: the first time the herbs hid from him, he
// took that one too and carried it back afterwards (Yuddha 74). The ask, the 15K Family Deal card.
// STORYBOARD.md has the plan and the sources; sets, props and Sushena are in sanj_props.js. Every time comes from the
// voice (src/scenes/sanj_vo.js, written by tools/sarvam_tts.mjs from tools/sanj_vo.json); tools/sanj_sfx.mjs reads
// the same file and recomputes these times.
(() => {
  // ---- times from the voice
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const B0 = mid('hook', 'spear'), C0 = mid('spear', 'fall'), D0 = mid('fall', 'ram'), F0 = mid('sush', 'herbs');
  const G0 = mid('herbs', 'same'), I0 = mid('lift', 'wake'), J0 = mid('wake', 'twist'), K0 = mid('twist', 'hid'), L0 = mid('hid', 'ask'), CARD = LN.ask.end + 1.4;
  const RAVW = Wd('spear', 0, 3), MAYA = Wd('spear', 1, 2), BELLS = Wd('spear', 1, 5), THROW = LN.spear.end - .25;
  const STRIKE = Wd('fall', 0, 1), FALLS = Wd('fall', 0, 7);
  const PULL = Wd('ram', 0, 1), BREAK = Wd('ram', 0, 5), WEEP = Wd('ram', 0, 8), SUMI = Wd('ram', 0, 13);
  const SUSH = LN.sush.a, CLOSER = Wd('sush', 0, 3), FACE = Wd('sush', 0, 6), ALIVE = Wd('sush', 0, 9);
  const FOUR = Wd('herbs', 0, 1), MAHO = Wd('herbs', 0, 4), GO = Wd('herbs', 0, 6);
  const UP = LN.same.a, CANT = Wd('same', 0, 4), ONE = Wd('same', 0, 6);
  const SHAKE = Wd('lift', 0, 2), THREE = Wd('lift', 0, 5), BRINGS = Wd('lift', 0, 8), WHOLE = Wd('lift', 0, 10);
  const CRUSH = Wd('wake', 0, 1), BREATH = Wd('wake', 0, 5), RISES = Wd('wake', 0, 8);
  const SECOND = Wd('twist', 0, 8), FIRST = LN.hid.a, HID = Wd('hid', 0, 5), TOOK = Wd('hid', 1, 2), BACK = Wd('hid', 1, 8);
  const TWICE = Wd('ask', 0, 6), YES = Wd('ask', 1, 1);
  const CAP_T = CARD + .1, CARDC = { cap: CAP_T, covers: CARD + .4, price: CARD + 1.2, strike: CARD + 1.7, dead: CARD + 2.2, pill: CARD + 2.7, sub: CARD + 3.2, follow: CARD + 3.7, logo: CAP_T - .1 };
  window.SANJ_T = { B0, C0, D0, F0, G0, I0, J0, K0, L0, CARD, RAVW, MAYA, BELLS, THROW, STRIKE, FALLS, PULL, BREAK, WEEP, SUMI, SUSH, CLOSER, FACE, ALIVE, FOUR, MAHO, GO, UP, CANT, ONE, SHAKE, THREE, BRINGS, WHOLE, CRUSH, BREATH, RISES, SECOND, FIRST, HID, TOOK, BACK, TWICE, YES };

  const GOLDC = '#F5C542';
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const blinkAt = (t, t0) => t > t0 && t < t0 + .14 ? 'closed' : null;
  const DUSK = [SJ.duskHi, SJ.duskLo], NIGHT = [SJ.nightHi, SJ.nightLo], SKY = [SJ.skyHi, SJ.cloud], SEPIA = ['#A88A64', SJ.sepia];
  // Hanuman flying to screen right, the peak held up overhead in his left hand: fo(t) his options, peakAt the hand
  const flyO = (t, extra = {}) => ({ boilKey: 'hfly', rot: 1.1, handL: [-7.4, -19.6], bendL: -.6, tail: 'droop', tailSway: t * 3, gada: 0, eyes: 'normal', mouth: 'grin', ...extra });

  // ---- the captions are the voice's chunks: line by line, the line with *starred* words in gold
  function caps(t) {
    for (const k of VO.caps) {
      const a = k.id === 'hook' ? -1 : k.a, b = k.id === 'ask' && k.text.startsWith('Comment') ? CARD - .05 : k.b;
      if (t < a || t > b) continue;
      const lines = k.text.split('|').map(s => s.trim()), y0 = 470;
      lines.forEach((l, i) => {
        const gold = l.includes('*');
        caption(l.replace(/\*/g, '').toUpperCase(), y0 + i * 104, t - a - i * .12, { life: b - a - i * .12, size: gold ? 92 : 76, color: gold ? GOLDC : undefined });
      });
    }
  }

  // ================= A · the hook: Hanuman flying with the whole mountain =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1060 - lt * 10, 1 + lt * .01);
    flySky(t, 1, 'a');
    const x = 150 + Math.sin(t * 1.3) * 10, y = 1760 + Math.sin(t * 2.1) * 14, o = flyO(t);
    const [hx, hy] = naradaHand(x, y, 27, o, -1);
    herbPeak(hx + 40, hy + 40, 540, t, { key: 'apeak', root: 1, glow: .8 });
    hanuman(x, y, 27, o);
    camEnd();
    caps(t);
    wipeOut(lt, dur, DUSK);
  }

  // ================= B · Ravana raises the spear of eight bells, and hurls it =================
  function shotRavana(t, lt, dur) {
    const tip = ease(seg(t, MAYA - .3, MAYA + .5)) * (1 - ease(seg(t, THROW - .5, THROW)));
    const sh = shakeXY(t, t > THROW ? 8 * Math.exp(-(t - THROW) * 4) : 0);
    const wind = ease(seg(t, THROW - .45, THROW - .1)), thrown = t > THROW;
    const hand0 = ravanaHand(560, 1920, 32, { arm: (a, s, k, def) => a === 19 ? { ...def, hand: [7.2, -24], shape: 'fist', front: true } : def }, 19), a0 = -2.75;
    const bellC = [hand0[0] + Math.cos(a0) * 140, hand0[1] + Math.sin(a0) * 140];
    camBegin(lerp(540, bellC[0], tip) + sh[0], lerp(1180, bellC[1] + 60, tip) + sh[1], lerp(.92, 1.9, tip));
    battlefield(t, 0, 'b');
    const o = { boilKey: 'rv', all: { eyes: t > RAVW - .2 ? 'angry' : 'normal', brows: -.7, mouth: thrown ? 'teeth' : 'grin' }, heads: { 4: { eyes: 'angry', mouth: thrown ? 'open' : 'smirk' } },
      arm: (a, s, k, def) => a === 19 ? { ...def, hand: thrown ? [9.5, -16] : [lerp(7.2, 8.6, wind), lerp(-24, -26.5, wind)], shape: 'fist', front: true } : def };
    ravana(560, 1920, 32, o);
    if (!thrown) {
      const [px, py] = ravanaHand(560, 1920, 32, o, 19), a = lerp(-2.75, -2.95, wind);
      bellSpear(px - Math.cos(a) * 260, py - Math.sin(a) * 260, 620, a, { key: 'bsp', ring: t > BELLS - .1 ? t - (BELLS - .1) : null, glow: ease(seg(t, MAYA - .2, MAYA + .4)) * (1 - seg(t, BELLS + .5, BELLS + 1)) });
    } else {
      const k = easeIn(seg(t, THROW, THROW + .25));
      bellSpear(lerp(400, -900, k), lerp(560, 880, k), 620, Math.PI - .2, { key: 'bsp', ring: t - THROW });
    }
    camEnd();
    caps(t);
  }

  // ================= C · it strikes Lakshman; he falls =================
  function shotFall(t, lt, dur) {
    const hit = STRIKE + .1, sh = shakeXY(t, t > hit ? 14 * Math.exp(-(t - hit) * 5) : 0);
    camBegin(540 + sh[0], 1150 + sh[1], 1);
    battlefield(t, .15, 'c');
    const fall = easeIn(seg(t, FALLS - .2, FALLS + .35)), bump = t > FALLS + .35 ? spring(t, FALLS + .35, 8, 20) * .05 : 0;
    const o = { boilKey: 'lk', rot: -fall * Math.PI / 2 + bump, eyes: t < hit ? 'normal' : t < FALLS ? 'wide' : 'closed', mouth: t < hit ? 'flat' : 'O', brow: t > hit ? .8 : 0 };
    lakshman(860, 1720, 27, o);
    const chest = naradaLocal(860, 1720, 27, o, .6, -14.8);
    if (t < hit) { const k = easeIn(seg(t, D0 - 2.6, hit)); bellSpear(lerp(1500, chest[0] + 20, k), lerp(980, chest[1] - 60, k), 620, Math.PI + .2, { key: 'csp' }); }
    else {
      const R = o.rot, a = Math.PI + .2 + R, len = 620;
      bellSpear(chest[0] - Math.cos(a) * (len - 60), chest[1] - Math.sin(a) * (len - 60), len, a, { key: 'csp', ring: t - hit });
      if (t < hit + .3) { boilSeed('impact'); paint(starPts(chest[0], chest[1], 120 * backOut(seg(t, hit, hit + .12)) * (1 - seg(t, hit + .15, hit + .3)), .45, 9), { wash: '#FFF2C0', ink: SJ.ink, sw: 1 }); }
      if (t > FALLS + .3 && t < FALLS + 1.2) { boilSeed('dust'); const k = seg(t, FALLS + .3, FALLS + 1.2); for (let i = 0; i < 5; i++) paint(ellPts(300 + i * 130, 1700 - k * 60, 50 + k * 40, 30 + k * 20, 12), { wash: SJ.earthDk, washOp: 160 * (1 - k), ink: null }); }
    }
    camEnd();
    caps(t);
    wipeOut(lt, dur, DUSK);
  }

  // ================= D–F · the camp: Ram weeps; Sushena finds him alive; "Go, Hanuman!" =================
  function shotCamp(t, lt, dur) {
    // the camera: close on Ram and Lakshman, opens up for Sushena, swings right to Hanuman for "Go"
    const c = kf(t, [[D0, [520, 1180, 1.1]], [SUSH - .3, [520, 1180, 1.1]], [SUSH + .5, [520, 1150, 1.0]], [MAHO - .3, [540, 1150, 1.0]], [GO - .2, [600, 1120, .95]]], ease);
    camBegin(c[0], c[1], c[2]);
    battlefield(t, .45, 'd');
    // Ram sits behind his brother: grips the spear, pulls, breaks it, weeps; brightens when Sushena says he's alive
    const pulled = ease(seg(t, PULL - .05, PULL + .3)), broke = t > BREAK, alive = t > ALIVE;
    const lo = { boilKey: 'lk2', rot: -Math.PI / 2, eyes: 'closed', mouth: 'flat' };
    const ro = { boilKey: 'rm', sit: 1, kodanda: true, hx: .4, lookX: .6, lookY: .5,
      eyes: alive ? 'happy' : t > WEEP ? 'cry' : t > PULL ? 'wide' : 'sad', brow: alive ? .4 : .9, mouth: alive ? 'grin' : t > WEEP ? 'wobble' : 'O',
      handR: t < BREAK + .4 ? [lerp(4.6, 6.4, pulled), lerp(-12.8, -17.5, pulled)] : alive ? [3.4, -11] : [1.6, -19.2], bendR: .6,
      handL: t < BREAK + .4 && t > BREAK - .4 ? [lerp(-2, 3.8, ease(seg(t, BREAK - .4, BREAK))), -16.8] : alive ? [-3.4, -11] : [-1.4, -19.2], bendL: .6 };
    if (t > ALIVE) Object.assign(ro, { emote: '!', emoteK: clamp((t - ALIVE) * 4), emoteAge: t - ALIVE });
    ram(400, 1560, 25, ro);
    lakshman(900, 1700, 25, lo);
    const chest = naradaLocal(900, 1700, 25, lo, .6, -14.8);
    // the spear: in his chest, then pulled up out, then snapped in two and tossed away
    if (!broke) {
      const k = pulled, a = Math.PI / 2 + .2 - k * .25, len = 620, hx = chest[0] + k * 40, hy = chest[1] - k * 300;
      bellSpear(hx - Math.cos(a) * (len - 60 + k * 60), hy - Math.sin(a) * (len - 60 + k * 60), len, a, { key: 'dsp', ring: t - (PULL - .05) });
    } else {
      const k = ease(seg(t, BREAK, BREAK + .6)), [rx, ry] = naradaHand(400, 1560, 25, ro, 1);
      bellSpear(rx - 300 * k - 280, ry - 120 + 300 * k, 600, -.2 - k * 1.2, { key: 'dspa', part: 'tail' });
      bellSpear(rx + 260 * k - 300, ry - 140 + 360 * k, 600, -.2 + k * 1.6, { key: 'dspb', part: 'head', ring: t - BREAK });
      if (t < BREAK + .2) { boilSeed('snap'); paint(starPts(rx + 10, ry - 140, 70 * backOut(seg(t, BREAK, BREAK + .08)), .4, 7), { wash: '#FFF2C0', ink: SJ.ink, sw: 1 }); }
    }
    // Sushena hops in from the left, leans close to Lakshman's face; the face glows ("not darkened"); a heartbeat
    if (t > SUSH - .4) {
      const hop = jump(t, SUSH - .4, SUSH + .15, 2.2), x = lerp(-150, 210, easeOut(seg(t, SUSH - .4, SUSH + .15)));
      const close = ease(seg(t, CLOSER - .1, CLOSER + .4)) * (1 - ease(seg(t, MAHO - .4, MAHO)));
      const so = { boilKey: 'su', dy: hop.dy, sq: hop.sq, lean: close * 2.6, bow: close * .35, eyes: t > ALIVE ? 'happy' : close > .5 ? 'look' : 'normal', lookX: t > FOUR - .2 ? .8 : .3, lookY: .6,
        mouth: t > ALIVE ? 'grin' : 'flat', brow: close * .6, handR: t > FOUR - .2 && t < GO + .6 ? [5.4, -24.5] : [4.4, -12.6], bendR: .5 };
      if (t > MAHO - .2 && t < GO + .7) { const [bx, by] = naradaHead(x, 1700, 22, so); thought(bx + 120, by - 330, 400, 270, bx + 40, by - 110, t - (FOUR - .2), 'bub'); for (let i = 0; i < 4; i++) herb(bx + 120 + (i - 1.5) * 85, by - 280, 70, i, t, { glow: 1, key: 'bh' + i }); }
      sushena(x, 1700, 22, so);
    }
    const face = naradaLocal(900, 1700, 25, lo, 0, -20.6);
    if (t > FACE - .2) glow(face[0], face[1], 160, '#FFE6A0', .5 * seg(t, FACE - .2, FACE + .3) * (1 - seg(t, MAHO, MAHO + .5)));
    if (t > ALIVE - .6 && t < MAHO) { boilSeed('beat'); const q = Math.exp(-frac((t - ALIVE + .6) * 1.5) * 5), k = backOut(seg(t, ALIVE - .6, ALIVE - .3)); paint(heartPts(chest[0] + 20, chest[1] - 90, (34 + 16 * q) * k), { wash: '#E2476E', fill: PAL.rose, fillOp: 90, ink: SJ.ink, sw: 1 }); }
    // Hanuman waits on the right, then crouches and launches up on "Go"
    if (t > FOUR - .6) {
      const enter = easeOut(seg(t, FOUR - .6, FOUR)), launch = jump(t, GO - .1, GO + .7, 30), gone = t > GO + .45;
      if (!gone) hanuman(lerp(1300, 1010, enter), 1660, 24, { boilKey: 'hc', dy: launch.dy, sq: launch.sq, eyes: t > GO - .2 ? 'wide' : 'normal', mouth: t > GO - .2 ? 'grin' : 'smile', lookX: -.6, gada: 1 });
      if (t > GO + .25 && t < GO + .9) { boilSeed('lift'); const k = seg(t, GO + .25, GO + .9); for (let i = 0; i < 5; i++) paint(ellPts(900 + i * 60, 1680 - k * 40, 40 + k * 40, 22 + k * 10, 10), { wash: SJ.earthNDk, washOp: 160 * (1 - k), ink: null }); }
    }
    camEnd();
    caps(t);
  }

  // ================= G–H · the mountain: he can't tell the herbs apart; shakes the peak; takes it all =================
  function shotPeak(t, lt, dur) {
    const shakes = [THREE - .45, THREE - .05, THREE + .35], sk = shakes.reduce((s, s0) => s + Math.max(0, Math.sin(seg(t, s0, s0 + .3) * Math.PI)) * Math.sin((t - s0) * 40), 0);
    const rip = ease(seg(t, BRINGS - .1, BRINGS + .3)), rise = easeIn(seg(t, BRINGS + .2, WHOLE + .4)), fly = easeIn(seg(t, WHOLE + .1, I0));
    const sh = shakeXY(t, t > BRINGS - .1 && t < BRINGS + .4 ? 10 : Math.abs(sk) * 4);
    camBegin(540 + sh[0], 1150 + sh[1] - rise * 200, lerp(1, .8, rise));
    himalaya(t, 0, 'g');
    boilSeed('gledge');
    paint([[-400, 1700], [120, 1560], [420, 1590], [900, 1540], [1480, 1640], [1480, 2600], [-400, 2600]], { wash: SJ.rock, fill: SJ.rockDk, fillOp: 70, tex: .5, ink: SJ.ink, sw: 1.1, curv: .4 });
    // Hanuman drops in, looks left, right, scratches his head; then grips the peak
    const land = jump(t, G0 - .2, G0 + .5, 0), dropY = lerp(-500, 0, easeIn(seg(t, G0 - .2, G0 + .25)));
    const look = t < CANT ? 0 : t < ONE ? -.8 : t < ONE + .8 ? .8 : 0, grip = t > SHAKE - .4;
    const peak = [560 + sk * 14, 1580 - rise * 1400 - fly * 300];
    const hx = 250, hyD = -rise * 1300 - fly * 300;
    const ho = { boilKey: 'hg', dy: (dropY + hyD) / 24, sq: land.sq, hx: grip ? .3 : look, lookX: grip ? .5 : look, eyes: grip ? (t > BRINGS ? 'happy' : 'angry') : t > CANT ? 'wide' : 'normal',
      mouth: grip ? (t > BRINGS ? 'grin' : 'flat') : t > ONE ? 'O' : 'smile', brow: grip ? -.5 : t > CANT ? .8 : 0, gada: 0, tail: 'curl',
      handL: grip ? (rise > 0 ? [-6.6, -27] : [6.2, -14.5]) : t > ONE + .2 ? [-1.4, -24.5] : undefined, handR: grip ? (rise > 0 ? [6.6, -27] : [6.8, -18.5]) : undefined, bendL: .4, bendR: .4,
      emote: !grip && t > CANT ? '?' : undefined, emoteK: clamp((t - CANT) * 4), emoteAge: t - CANT, sweat: t > ONE && !grip, rot: fly * .9 };
    const hX = lerp(hx, hx + 400, fly);
    if (rise > 0) { const [ax, ay] = naradaHand(hX, 1760, 24, ho, -1), [bx, by] = naradaHand(hX, 1760, 24, ho, 1); peak[0] = (ax + bx) / 2; peak[1] = Math.min(peak[1], (ay + by) / 2 - 10); }
    herbPeak(peak[0], peak[1], 560, t, { key: 'gpeak', root: rip, glow: 1 });
    for (let i = 0; i < 9; i++) herb(-20 + i * 130 + 30 * hash(i * 3.3), 1640 + 90 * hash(i * 7.1), 60, i % 4, t, { glow: 1, key: 'lh' + i });
    if (rip > 0 && rip < 1) { boilSeed('crumbs'); for (let i = 0; i < 7; i++) paint(ellPts(peak[0] - 200 + i * 66, peak[1] + 40 + rip * 120 * hash(i), 12, 10, 8), { wash: SJ.rockDk, ink: SJ.ink, sw: .5 }); }
    hanuman(hX, 1760, 24, ho);
    camEnd();
    caps(t);
    wipeOut(lt, dur, NIGHT);
  }

  // ================= I · back at the camp: the herbs crushed, breathed in; Lakshman rises =================
  function shotWake(t, lt, dur) {
    camBegin(540, 1300, 1.02);
    battlefield(t, 1, 'i');
    herbPeak(860, 1420, 420, t, { key: 'ipeak', root: 1, glow: 1 });
    const rise = backOut(seg(t, RISES - .15, RISES + .45)), sniff = t > BREATH && t < RISES;
    const lo = { boilKey: 'lk3', rot: -Math.PI / 2 * (1 - rise), eyes: t > RISES - .3 ? 'wide' : sniff ? 'closed' : 'closed', mouth: t > RISES ? 'grin' : 'flat', brow: t > RISES ? .5 : 0 };
    const ro = { boilKey: 'rm3', kodanda: true, eyes: t > RISES ? 'happy' : 'sad', mouth: t > RISES ? 'grin' : 'flat', lookX: .5, handR: t > RISES + .3 ? [6, -18] : undefined, handL: t > RISES + .3 ? [-6, -18] : undefined };
    ram(250, 1720, 24, ro);
    const grind = t < BREATH - .3 ? (t - I0) * 1.6 : 0, toNose = ease(seg(t, BREATH - .5, BREATH));
    const nose = naradaLocal(820, 1740, 25, lo, 0, -19.3);
    const so = { boilKey: 'su3', bow: .3, lean: 1.5 + toNose, lookX: .7, lookY: .5, eyes: t > RISES ? 'happy' : 'look', mouth: t > RISES ? 'grin' : 'flat',
      handR: toNose > 0 ? [lerp(5, 9, toNose), lerp(-12, -14, toNose)] : [2.8, -11.4], bendR: .4 };
    sushena(470, 1760, 22, so);
    if (t < BREATH) mortar(600, 1790, 140, grind, 'imortar');
    if (toNose > 0 && t < RISES) { const [hx2, hy2] = naradaHand(470, 1760, 22, so, 1); herb(hx2 + 10, hy2, 60, 1, t, { glow: 1, key: 'nh' }); }
    lakshman(820, 1740, 25, lo);
    if (sniff) { boilSeed('sniff'); for (let i = 0; i < 3; i++) { const q = frac(t * 1.5 + i / 3); inkLine([[nose[0] + 120 - q * 100, nose[1] - 30 + i * 20], [nose[0] + 60 - q * 60, nose[1] - 10 + i * 10]], 2.4, '#C8FFD0', 'ink', .5); } }
    if (t > RISES) { const k = seg(t, RISES, RISES + 1.2); boilSeed('rays'); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; inkLine([[820 + Math.cos(a) * (180 + k * 200), 1450 + Math.sin(a) * (180 + k * 200)], [820 + Math.cos(a) * (240 + k * 220), 1450 + Math.sin(a) * (240 + k * 220)]], 3, GOLDC, 'ink', 0); } }
    camEnd();
    caps(t);
    wipeIn(lt, NIGHT);
    wipeOut(lt, dur, SKY);
  }

  // ================= J · the twist: his SECOND mountain =================
  function shotTwist(t, lt, dur) {
    camBegin(540, 1180, 1.0 + lt * .012);
    flySky(t, 0, 'j');
    const two = backOut(seg(t, SECOND - .1, SECOND + .3));
    const ho = { boilKey: 'hj', handL: [-7.4, -17.5], bendL: -.5, handR: two > 0 ? [7.4, -17.5] : [3.6, -11], bendR: .5, gada: 0, tail: 'curl', eyes: t > SECOND ? 'happy' : 'normal', mouth: t > SECOND ? 'sheepish' : 'smile', lookX: t > SECOND ? 0 : -.3 };
    const [lx, ly] = naradaHand(540, 1940, 27, ho, -1), [rx, ry] = naradaHand(540, 1940, 27, ho, 1);
    herbPeak(lx - 60, ly + 20, 330, t, { key: 'jp1', root: 1, glow: 1 });
    if (two > .02) herbPeak(rx + 60, ry + 20, 330 * two, t, { key: 'jp2', root: 1, glow: 1, sepia: .8 });
    hanuman(540, 1940, 27, ho);
    camEnd();
    caps(t);
    wipeIn(lt, SKY);
    wipeOut(lt, dur, SEPIA);
  }

  // ================= K · the first time (Yuddha 74): the herbs hide; he takes the mountain; later carries it back =================
  function shotFlashback(t, lt, dur) {
    const take = ease(seg(t, TOOK - .2, TOOK + .5)), back = t > BACK - .5, down = easeOut(seg(t, BACK - .5, BACK + .1));
    const lift = back ? 700 * (1 - down) : 700 * take;
    camBegin(540, 1220 - lift * .5, lerp(1.1, .85, Math.min(1, lift / 700)));
    himalaya(t, 1, 'k');
    boilSeed('kledge');
    paint([[-400, 1700], [120, 1560], [420, 1590], [900, 1540], [1480, 1640], [1480, 2600], [-400, 2600]], { wash: mixCol(SJ.rock, SJ.sepia, .7), ink: SJ.ink, sw: 1.1, curv: .4 });
    // the herbs see him coming and duck into the ground
    const hide = i => ease(seg(t, HID - .5 + i * .05, HID + .1 + i * .05));
    herbPeak(560, 1580 - lift, 560, t, { key: 'kpeak', sepia: 1, hide, eyes: t < HID + .2 ? 1 : 0, root: back ? 1 - seg(t, BACK + .05, BACK + .3) : take, glow: .6 });
    if (back && t > BACK + .05 && t < BACK + .6) { boilSeed('thud'); const k = seg(t, BACK + .05, BACK + .6); for (let i = 0; i < 6; i++) paint(ellPts(400 + i * 120, 1600 - k * 50, 40 + k * 40, 22 + k * 14, 10), { wash: SJ.sepia, washOp: 170 * (1 - k), ink: null }); }
    const land = jump(t, K0 - .2, K0 + .4, 0), dropY = lerp(-500, 0, easeIn(seg(t, K0 - .2, K0 + .2)));
    const angry = t > HID + .1 && t < TOOK - .1, grip = t > TOOK - .5 && t < BACK + .2, dust = t > BACK + .3;
    const ho = { boilKey: 'hk', dy: (dropY - lift) / 24, sq: land.sq, tint: SJ.sepia, tintK: .35, gada: 0, tail: 'curl',
      eyes: angry ? 'angry' : dust ? 'happy' : grip ? 'happy' : t > HID - .3 ? 'wide' : 'normal', mouth: angry ? 'frown' : dust ? 'smug' : grip ? 'grin' : 'O', brow: angry ? -.8 : 0, puff: angry ? 1 : 0,
      emote: angry ? 'steam' : dust ? 'spark' : t > HID - .3 && t < HID + .1 ? '!' : undefined, emoteK: 1, emoteAge: t - HID,
      handL: grip ? [6.2, -14.5] : dust ? [-1.6, -12 + Math.sin(t * 20) * .6] : undefined, handR: grip ? [6.8, -18.5] : dust ? [1.6, -12 - Math.sin(t * 20) * .6] : undefined, bendL: .4, bendR: .4 };
    hanuman(250, 1780, 24, ho);
    camEnd();
    caps(t);
    wipeIn(lt, SEPIA);
    wipeOut(lt, dur, SKY);
  }

  // ================= L · the ask: Hanuman sits on top of the mountain, two fingers up =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1230, 1);
    flySky(t, 0, 'l');
    herbPeak(540, 2150, 800, t, { key: 'lpeak', glow: 1 });
    const two = t > TWICE - .1;
    hanuman(540, 1330, 19, { boilKey: 'hl', sit: 1, gada: 0, tail: 'curl', eyes: two ? 'happy' : 'normal', mouth: two ? 'grin' : 'smile',
      handR: two ? [5.2, -25.5] : undefined, bendR: .5, emote: t > YES ? '?' : undefined, emoteK: clamp((t - YES) * 4), emoteAge: t - YES });
    camEnd();
    caps(t);
    wipeIn(lt, SKY);
    wipeOut(lt, dur, [TK.peach, TK.marigold]);
  }

  // ================= M · the card =================
  function shotCard(t, lt) {
    dealCard(t, CARDC);
    dealStrike(t, CARDC);
    wipeIn(lt, [TK.peach, TK.marigold]);
  }

  shots([[0, shotHook], [B0, shotRavana], [C0, shotFall], [D0, shotCamp], [G0, shotPeak], [I0, shotWake], [J0, shotTwist], [K0, shotFlashback], [L0, shotAsk], [CARD, shotCard]]);
})();
