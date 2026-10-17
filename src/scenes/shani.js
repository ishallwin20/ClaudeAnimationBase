// shani.js: "Shani Dev LOOKED at baby Ganesha. His head FLEW OFF." (Shani series Part 1, ad 21, ~85 s, captions in
// Bangers, SFX, no voiceover). The Brahma Vaivarta Purana's telling: Shani's wife curses his gaze, he keeps his eyes on
// his feet, Parvati insists he look at her newborn, the head flies to the heavens, Vishnu brings an elephant's head on
// Garuda, and Parvati's curse (limbless, softened to a limp). STORYBOARD.md has the plan and the sources; the sets and
// props are in shani_props.js. All times are video time (t); tools/shani_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/shani_sfx.mjs)
  const GL0 = 1.3, GLINT = 2.1, B0 = 3.6, POP = 4.1, C0 = 7.4;
  const SHRUG = 8.2, POINT = 10.7, D0 = 14.2;
  const D1 = 17.6, WIFE = 16.3, ARRIVE = 17.6, WAVE = 18.2, TAP = 19.3, D2 = 21.0, ANGRY = 20.3, CURSE = 21.3, OPEN = 21.8, WILT = 23.4, E0 = 25.6;
  const BONK = 27.7, CROW = 28.7, F0 = 31.0;
  const SHANI_IN = 32.6, ASK = 34.6, EXPLAIN = 38.0, G0 = 41.6;
  const GLANCE = 43.3, GLINT2 = 44.0, GC = 44.9, POP2 = 45.3, FAINT = 46.3, H0 = 48.8;
  const BACK = 52.3, HC = 55.5, JOIN = 55.9, TOOT = 56.9, I0 = 59.0;
  const CURSE2 = 60.9, PLEAD = 62.5, I2 = 65.9, LIMP = 66.2, J0 = 69.4, K0 = 73.0, CARD = 77.0;
  const CAP_T = 77.1, COVERS = 77.4, PRICE = 78.2, STRIKE = 78.7, DEAD = 79.2, PILL = 79.7, SUB = 80.2, FOLLOW = 80.7;
  const CARDC = { cap: CAP_T, covers: COVERS, price: PRICE, strike: STRIKE, dead: DEAD, pill: PILL, sub: SUB, follow: FOLLOW, logo: CAP_T - .1 };

  const GOLDC = '#F5C542';
  const WIFE_PAL = { saree: '#2FA39B', sareeDk: '#1E716C', sareeLt: '#7FCDC3', blouse: '#E8698A', blouseDk: '#B94566', bangle: '#E8698A', gold: '#F2C230', goldDk: '#B88A1C' };
  // emotions() for the cast: drops the body colours it cross-fades (they're Clawd's) and adds the current key's name
  const act = (t, keys, o) => { const k = emotions(t, keys, o); let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++; delete k.col; delete k.dk; delete k.lt; k.name = keys[i][1]; return k; };
  const camK = (t, keys, sh = [0, 0]) => { const c = kf(t, keys); camBegin(c[0] + sh[0], c[1] + sh[1], c[2]); return c; };
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const VIOLET = [SP.duskDk, SP.dusk], WARM = [SP.marigold, SP.orange], SNOW = [SP.evePurple, SP.eve];

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['SHANI DEV LOOKED AT', 470, -1, B0 + 1 - .1, 76], ['BABY GANESHA...', 585, -1, B0 + 1 - .1, 108, GOLDC],
    ['...AND HIS HEAD', 470, B0 + .1, C0 - B0 - .2, 82], ['FLEW OFF!', 610, B0 + .35, C0 - B0 - .45, 176, GOLDC],
    ["WAIT. WASN'T IT", 470, C0 + .1, POINT - C0 - .2, 78], ['SHIVA WHO DID THAT?', 575, C0 + .4, POINT - C0 - .5, 90, GOLDC],
    ['IN THE BRAHMA VAIVARTA PURANA,', 470, POINT, D0 - POINT - .1, 58], ['IT WAS SHANI.', 590, POINT + .4, D0 - POINT - .5, 128, GOLDC],
    ['LONG AGO, SHANI WAS LOST', 460, D0 + .1, D1 - D0 - .2, 66], ['IN PRAYER TO KRISHNA.', 555, D0 + .4, D1 - D0 - .5, 78, GOLDC],
    ['HIS WIFE CAME TO HIM.', 460, D1, D2 - D1 - .1, 70], ['HE NEVER LOOKED UP.', 560, D1 + .4, D2 - D1 - .5, 86, GOLDC],
    ['SO SHE CURSED HIM:', 450, D2, E0 - D2 - .1, 66], ['"WHOEVER YOU LOOK AT', 545, D2 + .4, E0 - D2 - .5, 76], ['WILL BE DESTROYED!"', 645, D2 + .8, E0 - D2 - .9, 90, GOLDC],
    ['SINCE THAT DAY, SHANI KEPT', 470, E0 + .1, F0 - E0 - .2, 64], ['HIS EYES ON HIS FEET.', 565, E0 + .5, F0 - E0 - .6, 88, GOLDC],
    ['THEN BABY GANESHA WAS BORN.', 460, F0 + .1, ASK - F0 - .2, 62, GOLDC], ['ALL THE GODS CAME TO SEE HIM.', 550, F0 + .5, ASK - F0 - .6, 58],
    ['PARVATI ASKED: "WHY WON\'T', 460, ASK, EXPLAIN - ASK - .1, 66], ['YOU LOOK AT MY SON?"', 555, ASK + .4, EXPLAIN - ASK - .5, 84, GOLDC],
    ['HE TOLD HER ABOUT THE CURSE.', 460, EXPLAIN, G0 - EXPLAIN - .1, 60], ['SHE SAID: "JUST ONE LOOK!"', 550, EXPLAIN + .9, G0 - EXPLAIN - 1, 76, GOLDC],
    ['SO HE LOOKED, FROM THE CORNER', 470, G0 + .1, GC - G0 - .2, 60], ['OF HIS LEFT EYE...', 565, G0 + .4, GC - G0 - .5, 90, GOLDC],
    ['AND THE HEAD FLEW OFF', 470, GC, H0 - GC - .1, 76], ['TO THE HEAVENS.', 580, GC + .4, H0 - GC - .5, 104, GOLDC],
    ['VISHNU FLEW NORTH', 470, H0 + .1, BACK - H0 - .2, 86, GOLDC], ['ON GARUDA...', 580, H0 + .5, BACK - H0 - .6, 84],
    ['...AND BROUGHT BACK', 470, BACK, HC - BACK - .1, 76], ["AN ELEPHANT'S HEAD.", 575, BACK + .4, HC - BACK - .5, 96, GOLDC],
    ["THAT'S HOW BAPPA GOT", 470, HC, I0 - HC - .1, 76], ['HIS ELEPHANT HEAD.', 575, HC + .4, I0 - HC - .5, 98, GOLDC],
    ['THEN PARVATI CURSED SHANI', 460, I0 + .1, PLEAD - I0 - .2, 66], ['TO LOSE HIS LIMBS!', 565, I0 + .6, PLEAD - I0 - .7, 100, GOLDC],
    ['THE GODS BEGGED FOR HIM.', 460, PLEAD, I2 - PLEAD - .1, 70], ['SO SHE SOFTENED IT...', 560, PLEAD + .5, I2 - PLEAD - .6, 80, GOLDC],
    ['...TO A LIMP.', 480, I2, J0 - I2 - .1, 124, GOLDC], ['FOREVER.', 615, I2 + .6, J0 - I2 - .7, 90],
    ["THAT'S WHY SHANI'S GAZE", 460, J0 + .1, K0 - J0 - .2, 72], ['IS FEARED... AND WHY HE LIMPS.', 560, J0 + .6, K0 - J0 - .7, 66, GOLDC],
    ['IS YOUR NAME GANESH,', 470, K0 + .1, CARD - K0 - .2, 78], ['VINAYAK OR GAJANAN?', 575, K0 + .4, CARD - K0 - .5, 92, GOLDC], ['COMMENT IT!', 685, K0 + .8, CARD - K0 - .9, 72],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // the close-up of Shani's face (the hook, and its rhyme in G): eyes on his feet, then the side glance and the glint
  function faceClose(t, gl0, glint, bg) {
    camBegin(540, 960, 1 + .012 * Math.max(0, t - gl0 + 1.3));
    bg(t);
    const look = ease(seg(t, gl0, gl0 + .4)), gk = seg(t, glint - .1, glint + .15) * (1 - .5 * seg(t, glint + .5, glint + 1.2));
    const o = { boilKey: 'face', down: 1 - look, lookX: look, lookY: .1 * look, brow: -.6 * look, mouth: 'flat', glow: .9 * gk, seed: 2 };
    shani(540, 2420, 58, o);
    const e = shaniEye(540, 2420, 58, o, 1);
    sparkleBurst(e[0] + 18, e[1] - 6, 70, t - glint, 'glint', 6, ['#FFFFFF', SP.curse]);
    camEnd();
  }

  // ================= A · the hook: Shani's face, eyes on his feet; they slide sideways; a violet glint =================
  function shotHook(t, lt, dur) {
    faceClose(t, GL0, GLINT, nightSet);
    caps(t);
    if (lt > dur - .25) whipH(seg(lt, dur - .25, dur), 1, t, ['#FFF5E2', SP.curse]);
  }

  // the cradle close: the baby (human-faced) grins over the rim; at pop the head flies up out of frame
  const BX = 560, BY = 1560, BS = 1.05, BU = 15;
  function cradleClose(t, pop, o = {}) {
    const [bx, by] = cradleBaby(BX, BY, BS, BU), rim = cradleRim(BX, BY, BS), rock = .03 * Math.sin(t * 2.2);
    cradle(BX, BY, BS, { part: 'back', rock });
    if (o.elephant) {   // Bappa rises into the cradle with his elephant head
      const up = backOut(clamp((t - o.elephant) / .45));
      const mood = act(t, [[0, 'sleepy'], [o.elephant + .35, 'surprised'], [o.elephant + .9, 'happy']]);
      balBappa(bx, by + (1 - up) * 8 * BU - 2.4 * BU * up, BU, { ...mood, boilKey: 'baby', noShadow: true, trunk: t > o.toot ? 'up' : 'rest', ear: t > o.toot ? .7 * (1 - seg(t, o.toot + .8, o.toot + 1.4)) : 0, aL: .9 * pulse2(t, 2), aR: .9 });
    } else if (t < pop) balBappa(bx, by, BU, { ...feel(t > pop - .35 ? 'surprised' : 'happy', t), human: 1, boilKey: 'baby', noShadow: true, take: 0 });
    cradle(BX, BY, BS, { part: 'front', rock });
    if (!o.elephant && t >= pop) {
      // the head pops up out of the puff, hangs there a beat (blinking), then shoots up out of frame
      const k = t - pop, fly = Math.max(0, k - .55), path = f => [bx + f * 80, by - 5.5 * BU * backOut(clamp(k / .3)) - (f * 320 + f * f * 2000)];
      vanishPuff(BX, rim - 20, 170, k, 'pop');
      for (let i = 1; i < 6; i++) { const f = fly - i * .06; if (f > 0) { const q = path(f); sparkleBurst(q[0], q[1] - 8 * BU, 26, .3 + i * .08, 'trail' + i, 4); } }
      const [hx, hy] = path(fly);
      glow(hx, hy - 9 * BU, 170, '#FFE9A8', .55);
      balBappa(hx, hy, BU, { ...feel(fly > 0 ? 'starstruck' : 'surprised', t), human: 1, part: 'head', boilKey: 'head', rot: fly * 1.8 + .12 * Math.sin(k * 14) * (fly > 0 ? 0 : 1), noShadow: true });
    }
    if (o.elephant) { vanishPuff(BX, rim - 30, 190, t - o.elephant, 'join', ['#FFF3D6', '#FFD27A']); sparkleBurst(BX, rim - 120, 110, t - o.toot, 'toot', 8); }
  }

  // ================= B · the payoff of the hook: POP =================
  function shotPop(t, lt, dur) {
    camBegin(560, 1250, 1.42 + .02 * lt);
    pavilion(t);
    cradleClose(t, POP);
    camEnd();
    caps(t);
    if (lt < .25) whipH(1 - lt / .25, 1, t, ['#FFF5E2', SP.curse]);
    wipeOut(lt, dur, WARM);
  }

  // ================= C · the aside: "wasn't it Shiva?" =================
  function shotAside(t, lt, dur) {
    camBegin(540, 1223, 1.4 + .006 * lt);
    paperStudio(t);
    const sh = ease(seg(t, SHRUG, SHRUG + .3)) * (1 - ease(seg(t, POINT - .7, POINT - .35))), pt = ease(seg(t, POINT, POINT + .25));
    const mood = act(t, [[0, 'neutral'], [SHRUG, 'confused'], [POINT, 'relieved']]);
    const so = { ...mood, rot: 0, boilKey: 'shiva', eyes: t > POINT ? 'closed' : t > SHRUG ? 'normal' : 'closed', mouth: t > POINT ? 'smile' : t > SHRUG ? 'wobble' : 'smile', emote: t > POINT ? 'sweat' : mood.emote };
    if (sh > .01) { so.handL = [lerp(-5.6, -8.4, sh), lerp(-3.55, -11.5, sh)]; so.handR = [lerp(5.6, 8.4, sh), lerp(-3.55, -11.5, sh)]; }
    if (pt > .01) { so.handR = [lerp(5.6, 10.5, pt), lerp(-3.55, -10, pt)]; so.bendR = .3; }
    shiva(285, 1540, 16, so);
    const sk = clamp((t - POINT - .15) / .2);
    const eo = { boilKey: 'shaniC', down: 1 - sk * .4, lookX: -.8 * sk, mouth: sk > .5 ? 'sheepish' : 'flat', sweat: sk > .5, hx: -.3 * sk, handL: [-3.45, -10.8 - 2 * pulse(t, 2) * sk], seed: 4 };
    shani(800, 1545, 16.5, { ...eo, dy: -.4 * take(t, POINT + .2, .5).dy });
    if (t > POINT + .2) emote('!', 920, 1545 - 31 * 16.5, 20, clamp((t - POINT - .2) * 5), t);
    camEnd();
    caps(t);
    wipeIn(lt, WARM);
    wipeOut(lt, dur, VIOLET);
  }

  // ================= D · the flashback: the wife's curse =================
  function shotCurse(t, lt, dur) {
    camK(t, [[D0, [520, 1125, 1.4]], [CURSE, [505, 1112, 1.46]], [E0, [495, 1112, 1.5]]], shakeXY(t, 8 * (1 - seg(t, CURSE, CURSE + .5)) * (t > CURSE ? 1 : 0)));
    ashram(t);
    const SXp = 430, SYp = 1490, SU = 18.5;
    lotusPot(250, 1500, .9, ease(seg(t, WILT, WILT + .9)));
    // Shani: praying, eyes shut, serene; the bolt; the eyes open glowing; he looks at the lotus; squeezes shut and bows
    const open = t > OPEN, lookLotus = ease(seg(t, WILT - .5, WILT - .2)) * (1 - ease(seg(t, WILT + 1.1, WILT + 1.4)));
    const so = { boilKey: 'shaniD', pray: 1 - ease(seg(t, OPEN, OPEN + .25)) + ease(seg(t, WILT + 1.4, WILT + 1.8)), seed: 3,
      eyes: !open ? 'closed' : t > WILT + 1.2 ? 'squeeze' : 'wide', mouth: !open ? 'smile' : t > WILT + 1.2 ? 'frown' : 'O',
      glow: open ? .9 * (1 - seg(t, WILT + 1.1, WILT + 1.3)) : 0, lookX: -lookLotus, lookY: lookLotus, bow: ease(seg(t, WILT + 1.4, WILT + 2)),
      sq: take(t, CURSE + .1, .5).sq, dy: take(t, CURSE + .1, .5).dy, handL: open && t < WILT + 1.4 ? [-4.5, -12.5] : undefined, handR: open && t < WILT + 1.4 ? [4.5, -12.5] : undefined };
    shani(SXp, SYp, SU, so);
    krishnaThought(240, 985, .62, seg(t, D0 + .2, D0 + .8) * (1 - seg(t, CURSE - .1, CURSE + .2)));
    // the wife: walks in from the right, waves a hand at his face, taps her foot, gets angry, points: the curse
    const wx = lerp(1260, 715, ease(seg(t, WIFE, ARRIVE))), walking = t > WIFE && t < ARRIVE;
    const wave = t > WAVE && t < TAP ? Math.sin((t - WAVE) * 14) * .9 : 0, pointK = ease(seg(t, CURSE - .25, CURSE));
    const wm = act(t, [[0, 'happy'], [WAVE + .2, 'confused'], [TAP, 'bored'], [ANGRY, 'angry'], [CURSE, 'furious']], { take: .6 });
    const wo = { ...wm, rot: 0, boilKey: 'wife', pal: WIFE_PAL, mouth: t > ANGRY && t < OPEN + .6 ? 'open' : t > TAP && t < ANGRY ? 'flat' : wm.mouth, walk: walking ? (t - WIFE) * 1.6 : undefined, lookX: -1, hx: -.3,
      dy: (t > TAP && t < ANGRY ? -.25 * Math.max(0, Math.sin((t - TAP) * 16)) : 0) + wm.dy, eyes: ['angry', 'furious'].includes(wm.name) ? 'normal' : wm.eyes };
    if (t > WAVE && t < TAP + .2) wo.handL = [-6.6 + wave, -19.5];
    else if (t > TAP && t < ANGRY) { wo.handL = [-1.4, -12.8]; wo.handR = [1.4, -12.8]; }   // arms folded-ish on her hips
    if (pointK > 0) { wo.handL = [lerp(-3.3, -7.6, pointK), lerp(-11.2, -18.4, pointK)]; wo.bendL = .2; }
    parvati(wx, 1495, 18.5, wo);
    if (t > CURSE - .05) {
      const hand = parvatiHand(wx, 1495, 18.5, wo, -1), e = shaniEye(SXp, SYp, SU, so, 0);
      bolt(hand, [e[0] + 20, e[1]], (t - CURSE) / 1.0, SP.curse, 'curse');
    }
    if (open && t < WILT + 1.2) { const e = shaniEye(SXp, SYp, SU, so, -1); glow(lerp(e[0], 250, .5), lerp(e[1], 1400, .5), 160, SP.curse, .35 * lookLotus); }
    camEnd();
    caps(t);
    wipeIn(lt, VIOLET);
    wipeOut(lt, dur, [SP.leafDk, SP.leaf]);
  }

  // ================= E · eyes on his feet: BONK =================
  function shotBonk(t, lt, dur) {
    camBegin(470 + 10 * Math.sin(lt * .5), 1225, 1.35);
    forest(t, 0);
    const back = t > BONK ? -1.2 * Math.exp(-(t - BONK) * 3) * Math.sin(Math.min(Math.PI / 2, (t - BONK) * 9)) : 0;
    const x = lerp(120, 470, clamp((t - E0) / (BONK - E0))) + back * 40, walking = t < BONK;
    const tk = take(t, BONK, 1), dazed = t > BONK && t < CROW + .6;
    const so = { boilKey: 'shaniE', walk: walking ? (t - E0) * 1.5 : undefined, down: 1, mouth: dazed ? 'O' : 'flat', seed: 5,
      eyes: dazed && t < BONK + 1 ? 'squeeze' : 'normal', sq: tk.sq, dy: tk.dy, rot: t > BONK ? .08 * Math.sin((t - BONK) * 6) * Math.exp(-(t - BONK) * 1.5) : 0 };
    shani(x, 1555, 17, so);
    if (t > BONK && t < CROW + .3) emote('stars', x, 1555 - 30 * 17, 22, clamp((t - BONK) * 4), t);
    // the tree he walks into (in front of him)
    boilSeed('bonktree');
    paint(rectPts(700 + 12 * Math.sin(Math.max(0, t - BONK) * 20) * Math.exp(-Math.max(0, t - BONK) * 4), 380, 120, 1200), { wash: SP.bark, fill: SP.barkDk, fillOp: 60, tex: .5, ink: SP.ink, sw: 1 });
    sparkleBurst(690, 1555 - 21 * 17, 70, t - BONK, 'bonk', 8, ['#FFF4DC', '#FFD27A']);
    // the crow flies in and lands on his crown, then points the way with a wing
    if (t > CROW - .8) {
      const k = ease(clamp((t - CROW + .8) / .8)), crown = shaniLocal(x, 1555, 17, so, 0, _shnH(-27.6));
      const cx = lerp(1150, crown[0], k), cy = lerp(500, crown[1] - 40, k) - Math.sin(k * Math.PI) * 120, landed = k >= 1;
      shaniCrow(cx, cy, 11, { flip: !landed, fly: !landed, flap: landed ? (t > CROW + .5 ? .9 + .1 * Math.sin(t * 6) : 0) : Math.sin(t * 22), caw: t > CROW + .4 && t < CROW + .9 ? 1 : 0, look: 1 });
    }
    camEnd();
    caps(t);
    wipeIn(lt, [SP.leafDk, SP.leaf]);
    if (lt > dur - .25) whipH(seg(lt, dur - .25, dur), 1, t);
  }

  // the pavilion's cast (F and I): Shiva and Indra as guests, the cradle, Parvati beside it
  const PX = 880, PY = 1500, PU = 17, CXb = 625, CYb = 1490, CSb = .85, CUb = 12, SXf = 220, SYf = 1515, SUf = 16, PXi = 820, SXi = 200;
  function guests(t, o = {}) {
    shiva(392, 1335, 9.5, { ...feel(o.shivaMood || 'serene', t), boilKey: 'gshiva', ...(o.shiva || {}) });
    boilSeed('indracloud');
    for (const [dx, r] of [[-70, 60], [0, 75], [70, 60]]) paint(ellPts(635 + dx * .8, 1120, r * .8, r * .5, 14, 2), { wash: SP.cloud, fill: SP.cloudDk, fillOp: 40, tex: .3, ink: SP.ink, sw: .6 });
    indra(635, 1098 + 6 * Math.sin(t * 1.3), 12, { boilKey: 'gindra', vajra: 1, ...(o.indra || {}) });
  }

  // ================= F · Kailash: the gods come; Parvati asks; "just one look" =================
  function shotParty(t, lt, dur) {
    camK(t, [[F0, [540, 1235, 1.25]], [ASK, [555, 1240, 1.3]], [G0 - .35, [520, 1245, 1.33]], [G0, [200, 1080, 2.2]]]);
    pavilion(t);
    guests(t);
    const [bx, by] = cradleBaby(CXb, CYb, CSb, CUb);
    cradle(CXb, CYb, CSb, { part: 'back', rock: .03 * Math.sin(t * 2.2) });
    balBappa(bx, by, CUb, { ...feel('happy', t), human: 1, boilKey: 'baby', noShadow: true });
    cradle(CXb, CYb, CSb, { part: 'front', rock: .03 * Math.sin(t * 2.2) });
    // Parvati: rocks the cradle, turns to Shani (hands on her hips), laughs, raises one finger: "just one look"
    const pm = act(t, [[0, 'love'], [ASK, 'confused'], [EXPLAIN + .5, 'surprised'], [EXPLAIN + 1, 'laugh'], [EXPLAIN + 2, 'playful']], { take: .6 });
    const turn = ease(seg(t, ASK - .3, ASK));
    const po = { ...pm, rot: 0, boilKey: 'parvati', hx: -.5 * turn, lookX: -turn, eyes: pm.name === 'love' || pm.name === 'laugh' ? 'closed' : pm.name === 'playful' ? 'wink' : 'normal', mouth: pm.name === 'confused' ? 'O' : 'smile' };
    if (t < ASK - .3) po.handL = [-5.5, -12 + .3 * Math.sin(t * 2.2)];
    else if (t < EXPLAIN + 1.8) { po.handL = [-3, -11.8]; po.handR = [3, -11.8]; po.bendL = 1.6; po.bendR = 1.6; }
    else { po.handR = [3.8, -19.5]; po.bendR = .6; }
    parvati(PX, PY, PU, po);
    // Shani: walks in from the left, eyes down, palms joined; asked, he waves his hands no, sweating
    const sx = lerp(-180, SXf, ease(seg(t, SHANI_IN, SHANI_IN + 1.4))), ex = t > EXPLAIN && t < G0 - .4;
    const so = { boilKey: 'shaniF', walk: t > SHANI_IN && t < SHANI_IN + 1.4 ? (t - SHANI_IN) * 1.6 : undefined, down: 1, seed: 6,
      pray: ex ? 0 : 1, mouth: ex ? 'open' : 'flat', sweat: ex || t > ASK + .3, hx: ex ? .2 * Math.sin(t * 9) : 0 };
    if (ex) { const w = Math.sin((t - EXPLAIN) * 11); so.handL = [-3.2 + w * .7, -16]; so.handR = [3.2 - w * .7, -16]; }
    if (t > SHANI_IN - .1) shani(sx, SYf, SUf, so);
    if (t > ASK + .2 && t < EXPLAIN) emote('?', PX - 6 * PU, PY - 27 * PU, 20, clamp((t - ASK - .2) * 5), t);
    camEnd();
    caps(t);
    if (lt < .25) whipH(1 - lt / .25, 1, t);
  }

  // ================= G · the glance (the hook's rhyme), the POP, Parvati faints =================
  function shotGlance(t, lt, dur) {
    if (t < GC) {
      faceClose(t, GLANCE, GLINT2, pavilion);
      caps(t);
      if (t > GC - .2) whipH(seg(t, GC - .2, GC), 1, t, ['#FFF5E2', SP.curse]);
      return;
    }
    camK(t, [[GC, [560, 1210, 1.2]], [FAINT, [530, 1230, 1.15]], [FAINT + .7, [340, 1300, 1.0]], [H0, [330, 1300, 1.0]]], shakeXY(t, 10 * (t > POP2 && t < POP2 + .4 ? 1 : 0)));
    pavilion(t);
    cradleClose(t, POP2);
    // Parvati faints like a plank, backwards
    const f = easeIn(seg(t, FAINT, FAINT + .55)), bounce = t > FAINT + .55 ? .06 * Math.exp(-(t - FAINT - .55) * 5) * Math.sin((t - FAINT - .55) * 20) : 0;
    const pm = act(t, [[0, 'happy'], [POP2 + .1, 'scared'], [FAINT - .3, 'dizzy']]);
    parvati(260, 1560, 15, { ...pm, rot: -1.45 * f + bounce, boilKey: 'parvatiG', eyes: t > FAINT - .3 ? 'swirl' : pm.eyes, mouth: t > POP2 ? 'O' : 'smile' });
    camEnd();
    caps(t);
    if (t < GC + .2) whipH(1 - (t - GC) / .2, 1, t, ['#FFF5E2', SP.curse]);
    if (lt > dur - .25) whipV(seg(lt, dur - .25, dur), -1, t, ['#FFF5E2', SP.skyDk]);
  }

  // ================= H · Vishnu on Garuda: north, and back with the elephant head; the head joins =================
  function shotVishnu(t, lt, dur) {
    if (t >= HC) {   // the cradle: a flash, and Bappa rises with his elephant head; he trumpets
      camBegin(560, 1250, 1.42 + .02 * (t - HC));
      pavilion(t);
      cradleClose(t, 0, { elephant: JOIN, toot: TOOT });
      camEnd();
      flash(1 - seg(t, HC, HC + .3), '#FFF6DC');
      caps(t);
      wipeOut(lt, dur, WARM);
      return;
    }
    camBegin(540, 1080, 1.0);
    skySet(t, (t - H0) * 900);
    const out = t < BACK, s = 40, VU = 33;
    let gx, gy, flip, carry = 0;
    if (out) { const k = clamp((t - H0 - .1) / 3); gx = lerp(-420, 1520, k); gy = 1200 - 200 * k; flip = false; }
    else { const k = ease(clamp((t - BACK) / 1.3)), k2 = easeIn(seg(t, HC - 1, HC)); gx = lerp(1450, 560, k) - 1500 * k2; gy = lerp(820, 1060, k) - 40 * Math.sin(t * 2); flip = true; carry = 1; }
    const fly = { flap: Math.sin(t * (out ? 13 : 8)), fly: true, pal: GARUDA_PAL, ring: false, hat: garudaCrown, brow: true, flip, boilKey: 'garuda' };
    // speed lines behind him on the way out
    if (out) { boilSeed('speed'); for (let i = 0; i < 5; i++) inkLine([[gx - 380 - i * 30, gy - 80 + i * 45], [gx - 680 - i * 60, gy - 80 + i * 45]], 6, '#FFFFFF', 'ink', 0); }
    kamaParrot(gx, gy, s, { ...fly, only: 'body' });
    const seat = parrotSeat(gx, gy, s, fly), vo = { boilKey: 'vishnu', flip, lookX: out ? 1 : 0, mouth: carry ? 'smile' : 'flat', brows: out ? -.5 : 0, eyes: carry ? 'happy' : 'normal' };
    if (carry) { vo.handL = [-.9, -2.6]; vo.handR = [.9, -2.6]; vo.lotus = false; }
    vishnu(seat[0], seat[1], VU, vo);
    if (carry) {   // the elephant head, asleep, glowing gold between his front hands
      const hx = (vishnuHand(seat[0], seat[1], VU, vo, -1)[0] + vishnuHand(seat[0], seat[1], VU, vo, 1)[0]) / 2, hy = vishnuHand(seat[0], seat[1], VU, vo, 1)[1];
      glow(hx, hy - 60, 170, '#FFE08A', .6);
      balBappa(hx, hy + 6.2 * 12, 12, { part: 'head', eyes: 'closed', mouth: 'smile', boilKey: 'ehead', noShadow: true, trunk: 'curl' });
    }
    kamaParrot(gx, gy, s, { ...fly, only: 'wing' });
    camEnd();
    caps(t);
    if (lt < .25) whipV(1 - lt / .25, -1, t, ['#FFF5E2', SP.skyDk]);
  }

  // ================= I · Parvati's curse, the gods plead, the limp =================
  function shotLimp(t, lt, dur) {
    camK(t, [[I0, [520, 1240, 1.22]], [CURSE2, [510, 1250, 1.25]], [I2, [510, 1260, 1.28]], [J0, [510, 1265, 1.3]]], shakeXY(t, 9 * (t > CURSE2 && t < CURSE2 + .5 ? 1 : 0)));
    pavilion(t);
    // Bappa sits at Parvati's feet; Vishnu flies in on Garuda when the gods plead, palms joined
    balBappa(640, 1505, 10.5, { ...feel(t > CURSE2 && t < I2 ? 'scared' : 'happy', t), boilKey: 'bappaI', trunk: t > CURSE2 && t < I2 ? 'palm' : 'rest' });
    const pl = ease(seg(t, PLEAD - .2, PLEAD + .3)), gin = ease(clamp((t - PLEAD + .9) / .9));
    if (gin > 0) {
      const gx = lerp(1300, 450, gin), gy = lerp(700, 1205, gin) + 8 * Math.sin(t * 1.6);
      const gp = { flap: gin < 1 ? Math.sin(t * 12) : .35 * Math.sin(t * 5), fly: true, pal: GARUDA_PAL, ring: false, hat: garudaCrown, brow: true, flip: true, boilKey: 'garudaI' };
      kamaParrot(gx, gy, 17, { ...gp, only: 'body' });
      vishnu(...parrotSeat(gx, gy, 17, gp), 13, { boilKey: 'vishnuI', flip: true, joined: pl, eyes: pl > .5 ? 'sad' : 'normal', mouth: pl > .5 ? 'frown' : 'flat', brows: pl * .8, lotus: pl < .5 });
      kamaParrot(gx, gy, 17, { ...gp, only: 'wing' });
    }
    // Parvati: glares, points the curse, hears the gods, sighs, points at his leg
    const pm = act(t, [[0, 'angry'], [CURSE2 - .4, 'furious'], [PLEAD + .6, 'thinking'], [I2 - .2, 'determined']], { take: .5 });
    const pk = ease(seg(t, CURSE2 - .25, CURSE2)) * (1 - ease(seg(t, PLEAD + .4, PLEAD + .8))), lk = ease(seg(t, I2 - .1, I2 + .25));
    const po = { ...pm, rot: 0, boilKey: 'parvatiI', hx: -.5, lookX: -1, eyes: 'normal', mouth: pm.name === 'thinking' ? 'flat' : pm.name === 'furious' ? 'open' : 'frown' };
    if (pk > .01) { po.handL = [lerp(-3.3, -7.8, pk), lerp(-11.2, -17.5, pk)]; po.bendL = .2; }
    else if (lk > .01) { po.handL = [lerp(-3.3, -7.4, lk), lerp(-11.2, -9.5, lk)]; po.bendL = .3; }
    else { po.handL = [-3, -11.8]; po.handR = [3, -11.8]; po.bendL = 1.6; po.bendR = 1.6; }
    if (t > PLEAD && t < PLEAD + .8) po.hx = .4;   // she looks up at the gods
    parvati(PXi, PY, PU, po);
    // Shani: takes the curse, trembling red; then a limp, and he bows with joined palms
    const hit = t > CURSE2 && t < PLEAD, tk = take(t, CURSE2 + .1, .8), lk2 = t > LIMP ? Math.exp(-(t - LIMP) * 2.5) : 0;
    const so = { boilKey: 'shaniI', down: 1, seed: 7, eyes: hit ? 'squeeze' : 'normal', mouth: hit ? 'frown' : t > LIMP + .8 ? 'sheepish' : 'flat',
      tint: hit ? '#FF7A6A' : undefined, tintK: hit ? .45 + .25 * Math.sin(t * 30) : 0, sq: tk.sq, dy: tk.dy + .35 * lk2 * Math.abs(Math.sin((t - LIMP) * 9)),
      rot: -.12 * lk2 * Math.sin((t - LIMP) * 6), dx: hit ? .12 * Math.sin(t * 40) : 0, pray: ease(seg(t, LIMP + .9, LIMP + 1.3)), bow: ease(seg(t, LIMP + 1.2, LIMP + 1.7)) };
    shani(SXi, SYf, SUf, so);
    if (t > CURSE2 - .05) bolt(parvatiHand(PXi, PY, PU, po, -1), shaniLocal(SXi, SYf, SUf, so, 0, -14), (t - CURSE2) / 1.1, SP.curseRed, 'curse2');
    if (t > LIMP) { sparkleBurst(SXi - 1.35 * SUf, SYf - 10, 40, t - LIMP, 'limp', 6, ['#FFFFFF', SP.curseRed]); }
    if (hit) emote('!!', SXi + 5 * SUf, SYf - 28 * SUf, 20, clamp((t - CURSE2) * 5), t);
    camEnd();
    caps(t);
    wipeIn(lt, WARM);
    wipeOut(lt, dur, SNOW);
  }

  // ================= J · he limps away into the snow, his crow on his shoulder =================
  function shotAway(t, lt, dur) {
    camBegin(560 - 30 * lt, 1200, 1.3);
    snowSlope(t);
    const x = lerp(780, 330, clamp(lt / 3.4)), gy = 1480 + .08 * x, back = ease(seg(t, J0 + 1.6, J0 + 2)) * (1 - ease(seg(t, J0 + 3.1, J0 + 3.4)));
    const so = { boilKey: 'shaniJ', flip: true, walk: lt * 1.1, limp: 1, down: 1 - back, eyes: back > .5 ? 'closed' : 'normal', mouth: back > .5 ? 'sheepish' : 'flat', hx: .6 * back, seed: 8 };
    shani(x, gy, 17, so);
    const sh = shaniLocal(x, gy, 17, so, 2.9, -17.2);
    shaniCrow(sh[0], sh[1] - 26, 10, { flip: true, eyes: back > .5 ? 'closed' : 'normal', look: -1 });
    camEnd();
    caps(t);
    wipeIn(lt, SNOW);
    wipeOut(lt, dur, [TK.marigold, TK.petal]);
  }

  // ================= K · the ask: Bappa waves; Shani peeks with his hands over his eyes =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1180, 1.05);
    boilSeed('askbg');
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: TK.peach, fill: '#F2C9B0', fillOp: 50, bleed: .2, tex: .5, ink: null });
    paint(ellPts(470, 1510, 300, 60, 20, 3), { fill: '#C8925A', fillOp: 70, bleed: .2, tex: .4, ink: null });
    const tw = Math.sin(t * 5);
    balBappa(470, 1500, 26, { ...feel('happy', t), boilKey: 'bappaK', stand: 1, trunk: 'up', trunkSway: 1.2 * tw, aL: .9, aR: 1.1 + .25 * tw, blush: .4 });
    const peek = ease(seg(t, K0 + .6, K0 + 1.1));
    shani(1130 - 130 * peek, 1560, 15, { boilKey: 'shaniK', cover: 1, mouth: 'sheepish', hx: -.3, rot: -.12 * peek, seed: 9 });
    camEnd();
    caps(t);
    wipeIn(lt, [TK.marigold, TK.petal]);
    wipeOut(lt, dur, [TK.marigold, TK.rkOrange]);
  }

  // ================= L · the card =================
  function shotCard(t, lt) {
    shaniCard(t, CARDC);
    flushLetters();
    shaniStrike(t, CARDC);
    if (lt < .3) brushWipe(.5 + lt / .6, [TK.marigold, TK.rkOrange]);
  }

  shots([[0, shotHook], [B0, shotPop], [C0, shotAside], [D0, shotCurse], [E0, shotBonk], [F0, shotParty], [G0, shotGlance], [H0, shotVishnu], [I0, shotLimp], [J0, shotAway], [K0, shotAsk], [CARD, shotCard]]);
})();
