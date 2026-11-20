// tvidhi.js: "TULSI VIVAH is on SATURDAY. SAVE this: the whole wedding, step by step." (ad 105), in the 3D style.
// A home courtyard at godhuli. Frame 0: the finished wedding (the tulsi dressed as a bride under her sugarcane mandap,
// the Shaligram beside her, the lamps lit). When: Kartik Shukla Dwadashi, at dusk, many fast till evening. Then twelve
// numbered steps: clean the chaura and draw a rangoli (leaves picked the day before); the mandap of four sugarcane
// stalks and marigolds; dress the bride (chunari, bangles, bindi; gently, she is a living plant); the groom, the
// Shaligram, bathed, in a yellow dhoti, a sandal tilak, seated beside her (or a Vishnu or Krishna murti); sit facing
// north, Ganesha first, the sankalp; worship both (the upacharas, their mantras); the kanyadaan with water; the thread
// that ties them; Mangalashtak and the rice-and-kumkum shower on "savdhan"; the pheras, seven in many homes; sindoor
// and the camphor aarti; bhog of the season and prasad. Then: Tulsi's wedding opens the wedding season. The ask: how many
// rounds in YOUR home? Card. STORYBOARD.md has the plan and the sources; the timeline (from the voice) is tvidhi_tl.js,
// the set tvidhi_sets.js (COURT).
LOOK.bloom = .12;   // matte (owner, 30 Oct): cine.js's own bloom low, no fx bloom
const CAPY = 1330;
const capBand = (c, a = .5) => band(c, 1200, 1490, a);
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? CAPY, size: 50 }));

const C_ = COURT;
const lens = (focus, ap = 3, o = {}) => ({ dof: { focus, aperture: ap, max: 10, nearK: .6 }, grade: { contrast: o.contrast ?? 1.06, sat: o.sat ?? 1.04, temp: o.temp ?? .02, lift: 0, gamma: 1, gain: 1 } });
const dist = (p) => CAM3.position.distanceTo(V3(...p));
const at3 = (k, a, b) => a.map((v, i) => lerp(v, b[i], k));
const court = (t, o = {}) => { env3(C_.S, 'dawn', { k: o.envK ?? .35, rot: 2 }); C_.set(t, o); };
const shoot = (c, f, ap = 3, o = {}) => render3(c, C_.S, CAM3, { exposure: o.exposure ?? 1.0, fx: lens(dist(f), ap, o) });
const flashK = (c, t, at, col = '255,220,160', k = .4, rate = 5) => { const f = t > at ? Math.exp(-(t - at) * rate) : 0; if (f > .01) { c.save(); c.fillStyle = `rgba(${col},${k * f})`; c.fillRect(0, 0, W, H); c.restore(); } };
const GOLD = '#F4C46A', CREAM = '#FFF3DC';
// the light through the reel: golden at the start, blue hour by the end
const LT = (t) => lerp(.12, .85, seg(t, TL.WHEN0, TL.CLOSE0));
// where things are
const BRIDE = [0, 1.05, .05], GROOM = C_.groom, TH0 = C_.thali, GAN = C_.gan;
const COUPLE = [.22, .9, .1];
// states
const PREP = { rangoli: 0, cane: 0, strings: 0, chunari: 0, bangles: 0, neck: 0, bindi: 0, sindoor: 0, groom: 0, dhoti: 0, tilak: 0, gmala: 0, thread: 0, diyas: 0, niche: 0, thali: 0, incense: 0, bhog: false, door: .15 };
const DONE = { bhog: { cane: 1, amla: 1, ber: 1, potato: 1, kheer: 1 } };
const ST = (base, o) => ({ ...base, ...o });

// a step's number and name in the top band
function stepTitle(c, t, at, out, n, name, o = {}) {
  const a = seg(t, at, at + .3) * (1 - seg(t, out - .3, out)); if (a <= 0) return;
  band(c, o.y0 ?? 380, o.y1 ?? 640, .55 * a);
  text(c, 'STEP ' + n, 540, o.y ?? 462, '700 80px Cinzel', GOLD, { pop: t - at, alpha: a, spacing: 8, glow: ['rgba(244,170,60,.4)', 26] });
  if (name) text(c, name, 540, (o.y ?? 462) + 82, 'italic 46px Marcellus', CREAM, { pop: t - at - .15, alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 920 });
}
// a big word over the top band
function topTitle(c, t, at, out, big, small, o = {}) {
  const a = seg(t, at, at + .3) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  band(c, o.y0 ?? 380, o.y1 ?? 640, .6 * a);
  text(c, big, 540, o.y ?? 480, o.font || '700 96px Cinzel', o.col || GOLD, { pop: t - at, alpha: a, spacing: o.spacing ?? 6, glow: ['rgba(244,170,60,.4)', 28], maxW: 940 });
  if (small) text(c, small, 540, (o.y ?? 480) + (o.dy ?? 82), o.sfont || 'italic 42px Marcellus', CREAM, { pop: t - at - .2, alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 920 });
}
// a mantra: Devanagari over its Roman reading
function mantra(c, t, at, out, dev, rom, y = 760) {
  const a = seg(t, at, at + .3) * (1 - seg(t, out - .25, out)); if (a <= 0) return;
  band(c, y - 70, y + 90, .6 * a);
  text(c, dev, 540, y - 6, '46px "Tiro Devanagari Sanskrit"', '#FFE9C0', { alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 940 });
  text(c, rom, 540, y + 52, 'italic 34px Marcellus', GOLD, { alpha: a, glow: ['rgba(6,5,10,.95)', 14], maxW: 940 });
}
// a word pinned beside a thing in the world
const pin = (c, s, p, t, at, out, o = {}) => pinLabel(c, s, p, t, at, { out, size: o.size ?? 38, up: o.up ?? 110, dx: o.dx ?? 0, sub: o.sub });

// ================= the hook: the finished wedding at dusk, frame 0 =================
SHOTS.push({ a: 0, b: TL.WHEN0 + .25, draw(c, u, t) {
  court(t, ST(DONE, { light: .55, door: .5 }));
  const k = easeIO(seg(t, 0, TL.WHEN0 + .25));
  cam3({ pos: at3(k, [0, .95, 3.5], [0, 1.0, 3.0]), at: [0, 1.0, 0], fov: 46 });
  shoot(c, [0, .9, 0], 2.4);
  band(c, 380, 640, .55);
  text(c, 'THE WHOLE VIDHI', 540, 440, 'italic 46px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 16] });
  text(c, '12 STEPS', 540, 540, '700 110px Cinzel', GOLD, { pop: t > TL.STEP ? t - TL.STEP : null, spacing: 8, glow: ['rgba(244,170,60,.4)', 30] });
  capBand(c);
} });

// ================= when: Dwadashi, at dusk (godhuli), a fast till evening =================
SHOTS.push({ a: TL.WHEN0, b: TL.S10 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.WHEN0, TL.S10 + .3));
  court(t, ST(DONE, { light: lerp(0, .15, k), door: .5, diyas: seg(t, TL.FAST - .3, TL.EVENING + .5), niche: seg(t, TL.FAST, TL.EVENING), thali: 1 }));
  // from the sky down to the courtyard
  cam3({ pos: at3(k, [.6, 1.2, 5.2], [.3, 1.1, 4.0]), at: at3(easeIO(seg(t, TL.WHEN0, TL.GODHULI + .8)), [0, 3.4, -4], [0, 1.0, 0]), fov: 50 });
  shoot(c, [0, 1, 0], 2);
  topTitle(c, t, TL.DWADASHI - .2, TL.DUSK - .2, 'DWADASHI', 'Kartik Shukla · the 12th day', { font: '700 96px Cinzel' });
  tag(c, 'SAT 21 NOV 2026 · CHECK YOUR PANCHANG', 540, 690, t, TL.DWADASHI, { out: TL.DUSK - .2, size: 24 });
  topTitle(c, t, TL.GODHULI - .1, TL.FAST - .2, 'GODHULI', 'dusk, the hour of cow-dust', { font: '700 96px Cinzel' });
  topTitle(c, t, TL.FAST - .1, TL.S10, 'A FAST', 'until the evening · many homes', { font: '700 90px Cinzel' });
  capBand(c);
} });

// ================= step 1 · clean the chaura, draw the rangoli; the leaves picked the day before =================
SHOTS.push({ a: TL.S10, b: TL.PICK - .1, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S10, TL.PICK));
  const sh = seg(t, TL.CLEAN, TL.CHAURA + .6);
  court(t, ST(PREP, { light: LT(t), rangoli: seg(t, TL.RANGOLI - .3, TL.RANGOLI + .9), glint: [lerp(-.3, .3, sh), lerp(.2, .7, sh), .27, .8 * Math.sin(sh * Math.PI), .5], door: .15 }));
  cam3({ pos: at3(k, [.3, 1.9, 2.4], [0, 2.3, 1.7]), at: [0, .4, 0], fov: 46 });
  shoot(c, [0, .5, 0], 2);
  stepTitle(c, t, TL.S10 + .2, TL.PICK - .1, 1, 'The chaura and a rangoli');
  capBand(c);
} });
SHOTS.push({ a: TL.PICK - .1, b: TL.S20 + .3, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.PICK - .1, TL.S20 + .3));
  court(t, ST(PREP, { light: LT(t), rangoli: 1, thali: 1, incense: 0, leaves: 1 }));
  const bw = [TH0[0] - .09, .05, TH0[2] + .06];
  cam3({ pos: at3(k, [bw[0] + .12, .48, bw[2] + .62], [bw[0] + .06, .4, bw[2] + .5]), at: bw, fov: 34 });
  shoot(c, bw, 3);
  stepTitle(c, t, -1, TL.S20 + .3, 1, 'The chaura and a rangoli');
  topTitle(c, t, TL.BEFORE - .3, TL.S20, 'TULSI LEAVES', 'picked the day before', { y: 760, y0: 680, y1: 880, font: '700 70px Cinzel' });
  capBand(c);
} });

// ================= step 2 · the mandap: four sugarcane stalks tied over her, marigolds =================
SHOTS.push({ a: TL.S20, b: TL.S30 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S20, TL.S30 + .3));
  court(t, ST(PREP, { light: LT(t), rangoli: 1, cane: seg(t, TL.FOUR - .2, TL.TIED + .2), strings: seg(t, TL.TORAN - .3, TL.MARIGOLDS + .3), toran: seg(t, TL.TORAN - .3, TL.MARIGOLDS + .4) }));
  cam3({ pos: at3(k, [-.4, .55, 2.9], [0, .8, 2.6]), at: at3(k, [0, 1.1, 0], [0, 1.15, 0]), fov: 50 });
  shoot(c, [0, 1, 0], 2);
  stepTitle(c, t, TL.S20 + .2, TL.S30 + .3, 2, 'The mandap');
  const n = Math.min(4, Math.floor(seg(t, TL.FOUR - .2, TL.TIED + .2) * 4 + .02));
  if (n > 0 && t < TL.TORAN) text(c, n + ' / 4', 540, 760, '700 76px Cinzel', GOLD, { glow: ['rgba(6,5,10,.95)', 18], alpha: 1 - seg(t, TL.TORAN - .4, TL.TORAN) });
  capBand(c);
} });

// ================= step 3 · dress the bride: chunari, bangles, bindi; gently, she is alive =================
SHOTS.push({ a: TL.S30, b: TL.S40 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S30, TL.S40 + .3));
  court(t, ST(DONE, { light: LT(t), groom: 0, thread: 0, sindoor: 0, gmala: 0, hideFront: true, chunari: seg(t, TL.CHUNARI - .4, TL.CHUNARI + .4), bangles: seg(t, TL.BANGLES - .2, TL.BANGLES + .3), neck: seg(t, TL.BANGLES, TL.BINDI), bindi: seg(t, TL.BINDI - .1, TL.BINDI + .3),
    diyas: 0, niche: 0, thali: 0, incense: 0, bhog: false }));
  cam3({ pos: at3(k, [.12, 1.2, 2.0], [.05, 1.12, 1.55]), at: at3(k, [0, 1.12, 0], [0, 1.05, .05]), fov: lerp(40, 36, k) });
  shoot(c, BRIDE, 3);
  stepTitle(c, t, TL.S30 + .2, TL.GENTLY - .1, 3, 'Dress the bride');
  pin(c, 'CHUNARI', [0, C_.tulTop + .02, .05], t, TL.CHUNARI, TL.GENTLY, { up: 80 });
  pin(c, 'BANGLES', [.11, 1.08, .2], t, TL.BANGLES, TL.GENTLY, { dx: 160, up: 90 });
  pin(c, 'BINDI', [0, .62, .25], t, TL.BINDI, TL.GENTLY, { dx: -170, up: 60 });
  topTitle(c, t, TL.GENTLY - .1, TL.S40, 'GENTLY', 'she is a living plant', { font: '700 96px Cinzel' });
  capBand(c);
} });

// ================= step 4 · the groom: the Shaligram, bathed, a yellow dhoti, sandal tilak, seated =================
SHOTS.push({ a: TL.S40, b: TL.NOSHALI - .2, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S40, TL.NOSHALI));
  court(t, ST(DONE, { light: LT(t), thread: 0, sindoor: 0, groom: seg(t, TL.SHALI - .5, TL.SHALI + .1), bath: seg(t, TL.BATHE - .4, TL.YELLOW - .3) * (1 - seg(t, TL.YELLOW - .4, TL.YELLOW)),
    dhoti: seg(t, TL.YELLOW - .1, TL.YELLOW + .4), tilak: seg(t, TL.TILAK - .1, TL.TILAK + .2), gmala: seg(t, TL.SEAT, TL.BESIDE), diyas: 0, niche: 0, thali: 0, incense: 0, bhog: false }));
  const g = GROOM, wide = seg(t, TL.SEAT - .2, TL.BESIDE + .6);
  cam3({ pos: at3(easeIO(wide), [g[0] + .06, g[1] + .2, g[2] + .66 - k * .08], [g[0] - .1, g[1] + .4, g[2] + 1.5]), at: at3(easeIO(wide), [g[0], g[1] + .03, g[2]], [g[0] - .25, g[1] + .25, g[2]]), fov: lerp(32, 40, wide) });
  shoot(c, at3(wide, [g[0], g[1], g[2]], [g[0] - .2, g[1] + .1, g[2]]), 3);
  stepTitle(c, t, TL.S40 + .2, TL.NOSHALI, 4, 'The groom');
  topTitle(c, t, TL.SHALI - .1, TL.BATHE - .2, 'SHALIGRAM', 'Vishnu himself', { font: '700 96px Cinzel', y: 760, y0: 680, y1: 900 });
  pin(c, 'A BATH', [g[0], g[1] + .09, g[2]], t, TL.BATHE, TL.YELLOW - .2, { dx: -200, up: 140 });
  pin(c, 'YELLOW DHOTI', [g[0] - .05, g[1] + .0, g[2] + .03], t, TL.YELLOW, TL.SEAT, { dx: -220, up: 60 });
  pin(c, 'SANDAL TILAK', [g[0], g[1] + .07, g[2] + .04], t, TL.TILAK, TL.SEAT, { dx: 200, up: 160 });
  capBand(c);
} });
SHOTS.push({ a: TL.NOSHALI - .2, b: TL.S50 + .3, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.NOSHALI - .2, TL.S50 + .3));
  court(t, ST(DONE, { light: LT(t), thread: 0, sindoor: 0, diyas: 0, niche: 0, thali: 0, incense: 0, bhog: false }));
  cam3({ pos: at3(k, [.5, 1.05, 2.0], [.42, 1.0, 1.8]), at: [.22, .85, 0], fov: 40 });
  shoot(c, [.25, .8, .1], 3);
  topTitle(c, t, TL.NOSHALI - .1, TL.S50, 'NO SHALIGRAM?', 'a Vishnu or Krishna murti', { font: '700 84px Cinzel' });
  capBand(c);
} });

// ================= step 5 · sit facing north; Ganesha first; the sankalp =================
SHOTS.push({ a: TL.S50, b: TL.GANESHA - .25, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S50, TL.GANESHA));
  court(t, ST(DONE, { light: LT(t), thread: 0, sindoor: 0, diyas: .6, niche: 1, thali: 1, incense: 0, bhog: false }));
  // the devotee's eyes, sitting down: the camera sinks from standing to seated height, facing north
  cam3({ pos: [0, lerp(1.55, .85, easeIO(seg(t, TL.SIT - .3, TL.SIT + .9))), 2.3 - k * .2], at: [0, lerp(.9, .8, k), 0], fov: 48 });
  shoot(c, [0, .8, 0], 2);
  stepTitle(c, t, TL.S50 + .2, TL.GANESHA - .25, 5, 'Sit, Ganesha, sankalp');
  // the compass: N straight ahead
  const a = seg(t, TL.NORTH - .3, TL.NORTH) * (1 - seg(t, TL.GANESHA - .5, TL.GANESHA - .25));
  if (a > 0) { c.save(); c.globalAlpha = a; c.translate(540, 820); c.strokeStyle = GOLD; c.lineWidth = 5; c.beginPath(); c.arc(0, 0, 70, 0, TAU); c.stroke();
    c.fillStyle = GOLD; c.beginPath(); c.moveTo(0, -62); c.lineTo(18, 10); c.lineTo(0, -4); c.lineTo(-18, 10); c.closePath(); c.fill(); c.restore();
    text(c, 'N', 540, 712, '700 64px Cinzel', GOLD, { pop: t - TL.NORTH, alpha: a, glow: ['rgba(6,5,10,.95)', 18] }); }
  capBand(c);
} });
SHOTS.push({ a: TL.GANESHA - .25, b: TL.SANKALP - .2, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.GANESHA - .25, TL.SANKALP));
  court(t, ST(DONE, { light: LT(t), thread: 0, sindoor: 0, diyas: .6, niche: 1, thali: 1, incense: 1, bhog: false, halo: [GAN[0], GAN[1] + .12, GAN[2] - .05, .14 * seg(t, TL.GANESHA, TL.GANESHA + .4), .5] }));
  const g = GAN;
  cam3({ pos: at3(k, [g[0] + .3, g[1] + .28, g[2] + .95], [g[0] + .18, g[1] + .22, g[2] + .78]), at: [g[0] + .08, g[1] + .2, g[2]], fov: 32 });
  shoot(c, [g[0], g[1] + .12, g[2]], 3);
  stepTitle(c, t, -1, TL.SANKALP - .2, 5, 'Sit, Ganesha, sankalp');
  topTitle(c, t, TL.GANESHA - .05, TL.SANKALP - .2, 'GANESHA FIRST', 'ॐ गं गणपतये नमः', { font: '700 84px Cinzel', y: 760, y0: 680, y1: 900, sfont: '46px "Tiro Devanagari Sanskrit"' });
  flashK(c, t, TL.GANESHA, '255,215,140', .12);
  capBand(c);
} });
SHOTS.push({ a: TL.SANKALP - .2, b: TL.S60 + .3, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.SANKALP - .2, TL.S60 + .3));
  court(t, ST(DONE, { light: LT(t), thread: 0, sindoor: 0, diyas: .8, niche: 1, thali: 1, bhog: false }));
  cam3({ pos: at3(k, [.05, .8, TH0[2] + .72], [0, .72, TH0[2] + .6]), at: [TH0[0], .04, TH0[2]], fov: 38 });
  shoot(c, [TH0[0], .05, TH0[2]], 3);
  stepTitle(c, t, -1, TL.S60 + .3, 5, 'Sit, Ganesha, sankalp');
  topTitle(c, t, TL.SANKALP - .05, TL.S60, 'SANKALP', 'your name · the day · your prayer', { font: '700 96px Cinzel' });
  capBand(c);
} });

// ================= step 6 · worship them both: the upacharas, and their mantras =================
SHOTS.push({ a: TL.S60, b: TL.S70 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S60, TL.S70 + .3));
  court(t, ST(DONE, { light: LT(t), thread: 0, sindoor: 0, diyas: 1, niche: 1, thali: 1, bhog: false, gmala: 1,
    halo: [COUPLE[0], COUPLE[1], COUPLE[2], .25 * seg(t, TL.BOTH - .2, TL.BOTH + .4) * (1 - seg(t, TL.FLOWERS, TL.FLOWERS + 1)), 1.2] }));
  cam3({ pos: at3(k, [.32, 1.05, 2.1], [.26, 1.0, 1.75]), at: [.18, .86, 0], fov: 44 });
  shoot(c, [.2, .8, .05], 2.5);
  stepTitle(c, t, TL.S60 + .2, TL.S70 + .3, 6, 'Worship them both');
  const W_ = [['FLOWERS', TL.FLOWERS], ['SANDAL', TL.SANDAL], ['KUMKUM', TL.KUMKUM], ['AKSHAT', TL.AKSHAT], ['INCENSE', TL.INCENSE], ['A LAMP', TL.LAMP]];
  W_.forEach(([s, at], i) => { if (t < at - .05) return; const a = 1 - seg(t, TL.S70 - .2, TL.S70 + .1);
    text(c, s, i % 2 ? 760 : 320, 720 + Math.floor(i / 2) * 70, '700 50px Cinzel', i === 5 ? GOLD : CREAM, { pop: t - at, alpha: a, spacing: 3, glow: ['rgba(6,5,10,.95)', 18] }); });
  mantra(c, t, TL.LAMP + .2, TL.S70 + .3, 'ॐ तुलस्यै नमः · ॐ नमो भगवते वासुदेवाय', 'oṁ tulasyai namaḥ · oṁ namo bhagavate vāsudevāya', 1000);
  capBand(c);
} });

// ================= step 7 · the kanyadaan: water poured =================
SHOTS.push({ a: TL.S70, b: TL.S80 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S70, TL.S80 + .3));
  court(t, ST(DONE, { light: LT(t), thread: 0, sindoor: 0, diyas: 1, niche: 1, thali: 1, bhog: false, kanya: seg(t, TL.GIVE - .3, TL.WATER + .6) * (1 - seg(t, TL.COUPLES + .3, TL.COUPLES + .8)) }));
  cam3({ pos: at3(k, [.78, 1.12, 1.95], [.62, 1.06, 1.65]), at: [.18, .86, .15], fov: 40 });
  shoot(c, [.15, .85, .25], 3);
  stepTitle(c, t, TL.S70 + .2, TL.KANYA - .1, 7, '');
  topTitle(c, t, TL.KANYA - .1, TL.S80, 'KANYADAAN', 'कन्यादान', { font: '700 96px Cinzel', sfont: '50px "Tiro Devanagari Sanskrit"' });
  tag(c, 'OFTEN A COUPLE WITH NO DAUGHTER', 540, 720, t, TL.COUPLES, { out: TL.S80, size: 26 });
  capBand(c);
} });

// ================= step 8 · tie them together: the thread from groom to bride =================
SHOTS.push({ a: TL.S80, b: TL.S90 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S80, TL.S90 + .3)), th = seg(t, TL.TIE - .2, TL.EDGE + .3);
  court(t, ST(DONE, { light: LT(t), sindoor: 0, diyas: 1, niche: 1, thali: 1, bhog: false, thread: th, hideFront: true }));
  cam3({ pos: at3(k, [.72, 1.12, 1.35], [.55, 1.05, 1.15]), at: at3(k, [.3, .72, .1], [.2, .76, .08]), fov: 36 });
  shoot(c, [.25, .75, .1], 3);
  stepTitle(c, t, TL.S80 + .2, TL.TOGETHER, 8, 'Tie them together');
  topTitle(c, t, TL.TOGETHER - .05, TL.S90, 'GATHBANDHAN', 'the knot', { font: '700 90px Cinzel' });
  capBand(c);
} });

// ================= step 9 · Mangalashtak; on "savdhan!" rice and kumkum shower down =================
SHOTS.push({ a: TL.S90, b: TL.S100 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S90, TL.S100 + .3));
  court(t, ST(DONE, { light: LT(t), sindoor: 0, diyas: 1, niche: 1, thali: 1, bhog: false, shower: t > TL.SAVDHAN - .2 ? t - TL.SAVDHAN + .2 : null }));
  cam3({ pos: at3(k, [0, 1.15, 2.4], [0, 1.25, 1.9]), at: [.1, 1.0, 0], fov: 48 });
  shoot(c, [.1, .95, 0], 2.4);
  stepTitle(c, t, TL.S90 + .2, TL.MANGAL - .1, 9, 'The wedding verses');
  topTitle(c, t, TL.MANGAL - .1, TL.SAVDHAN - .2, 'MANGALASHTAK', 'मंगलाष्टक', { font: '700 84px Cinzel', sfont: '50px "Tiro Devanagari Sanskrit"' });
  topTitle(c, t, TL.SAVDHAN - .05, TL.S100, 'शुभ मंगल सावधान', 'shubh mangal savdhan!', { font: '80px "Tiro Devanagari Sanskrit"' });
  flashK(c, t, TL.SAVDHAN, '255,230,190', .3);
  capBand(c);
} });

// ================= step 10 · the pheras: the Shaligram carried round her, seven times =================
SHOTS.push({ a: TL.S100, b: TL.S110 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S100, TL.S110 + .3)), ph = 7 * easeIO(seg(t, TL.CARRY - .3, TL.MANY + .4));
  court(t, ST(DONE, { light: LT(t), sindoor: 0, diyas: 1, niche: 1, thali: 1, bhog: false, thread: 0, phera: ph }));
  const ang = lerp(.25, -.35, k);
  cam3({ pos: [Math.sin(ang) * 2.3, 2.0 - k * .2, Math.cos(ang) * 2.3], at: [0, .8, 0], fov: 46 });
  shoot(c, [0, .8, 0], 2);
  stepTitle(c, t, TL.S100 + .2, TL.PHERAS - .1, 10, '');
  topTitle(c, t, TL.PHERAS - .1, TL.S110, 'PHERAS', 'फेरे', { font: '700 96px Cinzel', sfont: '50px "Tiro Devanagari Sanskrit"' });
  const n = Math.min(7, Math.floor(ph + .02));
  if (t > TL.CARRY && n > 0) text(c, String(n), 540, 820, '700 130px Cinzel', GOLD, { pop: (ph % 1) * 1.2, alpha: 1 - seg(t, TL.S110 - .2, TL.S110 + .1), glow: ['rgba(244,170,60,.5)', 30] });
  tag(c, 'SEVEN IN MANY HOMES · SOME DO FEWER', 540, 950, t, TL.SEVEN, { out: TL.S110, size: 24 });
  capBand(c);
} });

// ================= step 11 · sindoor for the bride, then the camphor aarti =================
const aartiPath = (s, c0 = [.22, .95, .48], r = .2) => { const a = s * TAU - Math.PI / 2; return [c0[0] + Math.cos(a) * r, c0[1] - Math.sin(a) * r, c0[2]]; };
SHOTS.push({ a: TL.S110, b: TL.S120 + .3, xf: .4, draw(c, u, t) {
  const aon = seg(t, TL.AARTI - .3, TL.AARTI);
  const s = (t - TL.AARTI + .3) / 1.6, trail = []; for (let i = 0; i < 50; i++) { const q = s - i * .012; if (q > 0) trail.push(aartiPath(q)); }
  court(t, ST(DONE, { light: LT(t), diyas: 1, niche: 1, thali: 1, bhog: false, cane: t < TL.AARTI - .3 ? 0 : 1, sindoor: seg(t, TL.SINDOOR, TL.SINDOOR + .4), sindoorDust: t > TL.SINDOOR - .3 ? t - TL.SINDOOR + .3 : null,
    aarti: aon > 0 ? { p: aartiPath(Math.max(0, s)), on: aon, trail } : null }));
  const w = easeIO(seg(t, TL.AARTI - .4, TL.AARTI + .2));
  cam3({ pos: at3(w, [.06, C_.tulTop + .12, .95], [.2, 1.05, 1.85]), at: at3(w, [0, C_.tulTop - .06, 0], [.15, .92, 0]), fov: lerp(34, 46, w) });
  shoot(c, at3(w, [0, C_.tulTop, 0], [.15, .9, .2]), 2.6);
  stepTitle(c, t, TL.S110 + .2, TL.SINDOOR - .1, 11, '');
  topTitle(c, t, TL.SINDOOR - .05, TL.AARTI - .2, 'SINDOOR', 'for the bride', { font: '700 96px Cinzel' });
  topTitle(c, t, TL.AARTI - .05, TL.S120, 'AARTI', 'with camphor', { font: '700 96px Cinzel' });
  capBand(c);
} });

// ================= step 12 · bhog from the season; share the prasad =================
SHOTS.push({ a: TL.S120, b: TL.CLOSE0 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S120, TL.CLOSE0 + .3));
  const bh = { cane: seg(t, TL.CANE2 - .2, TL.CANE2 + .3), amla: seg(t, TL.AMLA - .2, TL.AMLA + .3), ber: seg(t, TL.BER - .2, TL.BER + .3), potato: seg(t, TL.POTATO - .3, TL.POTATO + .2), kheer: seg(t, TL.SEASON - .3, TL.SEASON + .2) };
  court(t, ST(DONE, { light: LT(t), diyas: 1, niche: 1, thali: 1, bhog: bh }));
  const b = [.5, .02, 1.25], wide = easeIO(seg(t, TL.PRASAD - .6, TL.CLOSE0 + .3));
  cam3({ pos: at3(wide, [b[0] - .2, .62 - k * .04, b[2] + .78 - k * .08], [.3, .9, 2.2]), at: at3(wide, b, [.15, .55, 0]), fov: lerp(38, 46, wide) });
  shoot(c, at3(wide, b, [.2, .5, .3]), 3);
  stepTitle(c, t, TL.S120 + .2, TL.PRASAD - .2, 12, 'Bhog of the season');
  topTitle(c, t, TL.PRASAD - .1, TL.CLOSE0, 'PRASAD', 'share it with everyone', { font: '700 96px Cinzel' });
  capBand(c);
} });

// ================= close: the wedding season opens (the courtyard at blue hour, everything lit) =================
SHOTS.push({ a: TL.CLOSE0, b: TL.ASK0 + .3, xf: .5, draw(c, u, t) {
  const k = easeIO(seg(t, TL.CLOSE0, TL.ASK0 + .3));
  court(t, ST(DONE, { light: .9, door: .7 }));
  cam3({ pos: at3(k, [0, 1.0, 2.6], [0, 1.15, 3.6]), at: [0, 1.05, 0], fov: 46 });
  shoot(c, [0, 1, 0], 2);
  topTitle(c, t, TL.OPENS - .1, TL.ASK0, 'THE WEDDING', 'season begins', { font: '700 96px Cinzel' });
  capBand(c);
} });

// ================= the ask: how many rounds in YOUR home? save this =================
SHOTS.push({ a: TL.ASK0, b: TL.CARD, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.ASK0, TL.CARD)), ph = 7 * ((t - TL.ASK0) / 4 % 1);
  court(t, ST(DONE, { light: .92, door: .7, phera: ph }));
  cam3({ pos: [Math.sin(k * .5) * 3.0, 1.6, Math.cos(k * .5) * 3.0], at: [0, .9, 0], fov: 46 });
  shoot(c, [0, .9, 0], 2);
  topTitle(c, t, TL.ROUNDS - .2, TL.CARD + 1, 'HOW MANY ROUNDS?', 'in your home', { font: '700 76px Cinzel' });
  if (t > TL.SAVE2 - .1) text(c, 'SAVE THIS', 540, 1110, '700 60px Cinzel', '#FFFFFF', { pop: t - TL.SAVE2, spacing: 6, glow: ['rgba(244,170,60,.6)', 26] });
  capBand(c);
} });

// ================= the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'The Navadurga Set is out now', note: 'Link in bio' });
} });
