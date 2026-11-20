// tulsi.js: "Why do we marry TULSI to a STONE?" (ad 104, Painterly + Girish VO; STORYBOARD.md). Devi Bhagavatam 9.17–9.25:
// Tulasi's tapas for Narayana, Brahma's word, Shankhachuda, the broken vow, the curse, the Gandaki, the tulsi and the
// Shaligram; then the Tulsi Vivah in a courtyard. Designs in tulsi_cast.js; the timeline comes from the voice (tulsi_vo.js).
const ZK = 2, HK = 3;   // bake resolutions: bodies, and heads (close-ups come near them)

// ---------- the timeline, from the voice ----------
VO.caps[0].a = -.5;     // frame 0: the first caption is already up
const TL = (() => {
  const LN = VO.lines, norm = s => s.replace(/[*“”"'’.,:?!]/g, '').toLowerCase();
  const Wd = (id, word, n = 0) => {
    const hits = [];
    VO.caps.filter(c => c.id === id).forEach(c => c.text.split(/\s+/).filter(w => w && w !== '|').forEach((w, i) => { if (norm(w) === norm(word)) hits.push(c.at[i]); }));
    if (hits[n] == null) throw new Error(`no "${word}" in ${id}`); return hits[n];
  };
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const T = {
    GROOM: Wd('hook', 'groom'), STONE0: Wd('hook', 'stone'),
    WAKE0: mid('hook', 'wake'), WAKES: Wd('wake', 'wakes'), FIRST: Wd('wake', 'first'), HIS: Wd('wake', 'his'),
    WHO0: mid('wake', 'who'), DEVI: Wd('who', 'devi'), TULASI: Wd('who', 'tulasi'), KARTIK: Wd('who', 'kartik'),
    TAP0: mid('who', 'tapas'), LAKH: Wd('tapas', 'lakh'), WISH: Wd('tapas', 'wish'), NARAYANA: Wd('tapas', 'narayana'),
    BR0: mid('tapas', 'brahma'), ANOTHER: Wd('brahma', 'another'), NARAYANA2: Wd('brahma', 'narayana'),
    AS0: mid('brahma', 'asura'), VOW: Wd('asura', 'while'), DEATH: Wd('asura', 'death'), HEAVEN: Wd('asura', 'he'),
    SHIVA: mid('asura', 'deceive'), VISHNU2: Wd('deceive', 'and'), HUSBAND: Wd('deceive', "husband's"),
    BR1: mid('deceive', 'broke'), BROKEN: Wd('broke', 'broken'), BATTLE: Wd('broke', 'on'), TRISHUL: Wd('broke', 'trishul'), STRUCK: Wd('broke', 'struck'),
    CU0: mid('broke', 'curse'), REALLY: Wd('curse', 'really'), HEART: Wd('curse', 'your'), STONE2: Wd('curse', 'stone'), BECOME: Wd('curse', 'become'),
    AC0: mid('curse', 'accept'), SAID: Wd('accept', 'he'), FOREVER: Wd('accept', 'forever'),
    BO0: mid('accept', 'boon'), GANDAKI: Wd('boon', 'gandaki'), HAIR: Wd('boon', 'hair'), TULSI2: Wd('boon', 'tulsi'), LIE: Wd('boon', 'and'), SHALIGRAM: Wd('boon', 'shaligram'),
    TW0: mid('boon', 'twist'), TOGETHER: Wd('twist', 'together'),
    WH0: mid('twist', 'why'), WITHOUT: Wd('why', 'without'), EVERY: Wd('why', 'and'), MARRY: Wd('why', 'marry'),
    RI0: mid('why', 'ritual'), CHUNARI: Wd('ritual', 'a', 1), FAMILIES: Wd('ritual', 'families'), KANYA: Wd('ritual', 'kanyadaan'),
    ASK0: mid('ritual', 'ask'), YOU: Wd('ask', 'you'), VRINDA2: Wd('ask', 'vrinda', 1), TULSI3: Wd('ask', 'tulsi'),
  };
  T.CARD = LN.ask.end + 1.1; T.END = DUR;
  return T;
})();

// ---------- layers ----------
const L = {
  court: () => ptLayer('court', [0, 0, W, H], tvCourt, { seed: 5 }),
  front: () => ptLayer('courtFront', [0, 380, W, 1540], tvCourtFront({}), { alpha: true, seed: 7, brushes: PT_BRUSHES.slice(1), k: ZK }),
  stone: (glow = false) => ptLayer('stone' + +glow, [TV_STONE[0] - 170, TV_STONE[1] - 110, 340, 190], c => tvStone(c, ...TV_STONE, 1.15, { plate: true, tilak: true, glow }), { alpha: true, seed: 9, brushes: PT_BRUSHES.slice(2), k: HK }),
  ocean: () => ptLayer('ocean', [0, 0, W, H], tvOcean, { seed: 5 }),
  vishnu: e => ptLayer('vishnuB' + e, VS_BOX, tvVishnu({ eyes: e }), { alpha: true, seed: 17, brushes: PT_BRUSHES.slice(1), k: HK, fine: [[...VS_FACE, 70]], keep: [[...VS_FACE, 60, .7]] }),
  bank: (seat = true) => ptLayer('bank' + +seat, [0, 0, W, H], c => tvBank(c, { seat }), { seed: 6 }),
  body: () => ptLayer('tbody', TR_BODY_BOX, trBody({}), { alpha: true, seed: 17, brushes: PT_BRUSHES.slice(1), k: ZK }),
  head: (o = {}) => ptLayer('thead:' + [o.eyes || 'front', o.mouth || 'soft', +!!o.tear, o.brow || '', +(o.sindoor !== false)].join(':'), TR_HEAD_BOX, trHead(o),
    { alpha: true, seed: 19, brushes: PT_BRUSHES.slice(2), k: HK, fine: [[...TR_FACE, 150]], keep: [[TR_FACE[0], TR_FACE[1] + 4, 130, .7]] }),
  palace: () => ptLayer('palace', [0, 0, W, H], tvPalace, { seed: 7 }),
  war: tone => ptLayer('war' + tone, [0, 0, W, H], c => tvWar(c, { tone }), { seed: 8 }),
  asura: () => ptLayer('asuraB', [0, 300, W, 1400], tvAsura(560, 1560, 1100), { alpha: true, seed: 9, brushes: PT_BRUSHES.slice(1) }),
  guest: () => ptLayer('guestB', [0, 520, 400, 860], tvAsura(TV_DOOR[0], TV_DOOR[1], 640, '#0A0A12'), { alpha: true, seed: 11, brushes: PT_BRUSHES.slice(2) }),
  shiva: () => ptLayer('shivaS', [0, 100, W, 1520], tvShivaSil(620, 1600, 1000), { alpha: true, seed: 9, brushes: PT_BRUSHES.slice(1) }),
  bush: (i, s) => ptLayer('bush' + i, [540 - 340 * s, 1720 - 640 * s, 680 * s, 700 * s], c => tvTulsi(c, 540, 1720, s, { seed: 30 + i }), { alpha: true, seed: 12 + i, brushes: PT_BRUSHES.slice(2) }),
  rstone: (glow = false) => ptLayer('rstone' + +glow, [380, 1720, 320, 180], c => tvStone(c, 540, 1820, 1.3, { glow }), { alpha: true, seed: 13, brushes: PT_BRUSHES.slice(2), k: HK }),
};
// Tulasi seated: body and head (o: the head's options; o.blink shuts the eyes)
function tulasi(c, o = {}, a = 1) { ptDraw(c, L.body(), a); ptDraw(c, L.head(o.blink ? { ...o, eyes: 'shut' } : o), a); }
const blinkAt = (t, ts) => ts.some(b => t > b && t < b + .14);
// the camera: stage point (sx, sy) to the frame's middle (or fx, fy), zoom z, kept inside the stage
function cam(c, sx, sy, z, fx = W / 2, fy = H / 2, shake = 0) {
  const j = shake ? [vnoise(T * 31, 1) * shake, vnoise(T * 29, 5) * shake] : [0, 0];
  z = Math.max(z, 1) * (shake ? 1 + (shake + 2) / 500 : 1);
  sx = clamp(sx, fx / z, W - (W - fx) / z); sy = clamp(sy, fy / z, H - (H - fy) / z);
  c.translate(fx + j[0], fy + j[1]); c.scale(z, z); c.translate(-sx, -sy);
}

// ---------- live light ----------
function flame(c, x, y, t, s = 1, i = 0, a = 1) {
  if (a <= 0) return;
  const f = .8 + .2 * Math.sin(t * 13 + i * 2.3) + .1 * Math.sin(t * 29 + i), lean = Math.sin(t * 7 + i * 1.7) * 3;
  c.save(); c.globalAlpha = a;
  glow(c, x, y - 14 * s, 90 * s, '#FF9A3A', .3 * f, 'lighter');
  c.translate(x, y - 6 * s); c.scale(s, s * f);
  ptShape(c, `M -6 0 C -8 -10 -2 -20 ${lean} -30 C 3 -20 8 -10 6 0 C 4 4 -4 4 -6 0 Z`, ptLin(c, 0, 0, 0, -30, [[0, '#FFF2B0'], [.5, '#FFB040'], [1, 'rgba(255,90,20,.6)']]));
  c.restore();
  glow(c, x, y - 10 * s, 18 * s, '#FFF6D0', .6 * a, 'lighter');
}
function petals(c, t, t0, n = 16, a = 1, cols = ['#F28A12', '#FFB21E', '#E8402E']) {
  if (t < t0) return;
  for (let i = 0; i < n; i++) {
    const u = frac((t - t0) * (.08 + hash(i) * .05) + hash(i + 3)), x = 80 + hash(i * 2.7) * 920 + Math.sin((t - t0) * 1.3 + i) * 40, y = -40 + u * 2000;
    c.save(); c.translate(x, y); c.rotate(t * (1 + hash(i)) + i); c.globalAlpha = a * Math.min(1, (t - t0) * 2);
    ellipse(c, 0, 0, 12, 7, cols[i % cols.length]); ellipse(c, -3, -2, 5, 3, 'rgba(255,230,170,.6)'); c.restore();
  }
}
function fireflies(c, t, n = 14, box = [60, 900, 1020, 1700], a = 1) {
  for (let i = 0; i < n; i++) {
    const x = box[0] + hash(i * 3.1) * (box[2] - box[0]) + Math.sin(t * .4 + i) * 40, y = box[1] + hash(i * 7.3) * (box[3] - box[1]) + Math.cos(t * .33 + i * 2) * 30;
    const k = .5 + .5 * Math.sin(t * (1 + hash(i) * 1.5) + i * 4);
    glow(c, x, y, 16, '#E8FF9A', .5 * k * a, 'lighter'); ellipse(c, x, y, 2.2, 2.2, rgba('#F6FFD0', .9 * k * a));
  }
}
function stars(c, t, a = 1, y1 = 900) { for (let i = 0; i < 60; i++) { const x = hash(i * 1.7) * W, y = hash(i * 3.9) * y1, k = .4 + .6 * Math.pow(.5 + .5 * Math.sin(t * (1 + hash(i) * 2) + i), 3); twinkle(c, x, y, 5 + hash(i + 2) * 7, k * a * .8, '#EEF2FF'); } }
// a tulsi leaf drifting down to (x1, y1), landing at t1
function leafFall(c, t, t1, x1, y1, s = 1) {
  const u = seg(t, t1 - 2.2, t1); if (u <= 0) return;
  const e = easeOut(u), x = x1 + Math.sin(u * 7) * 60 * (1 - u), y = lerp(y1 - 520, y1, e);
  c.save(); c.translate(x, y); c.rotate(Math.sin(u * 9) * .8 * (1 - u) + .4); c.scale(s, s);
  ptShape(c, 'M 0 0 C 12 -8 13 -28 0 -40 C -13 -28 -12 -8 0 0 Z', ptLin(c, -12, 0, 12, 0, [[0, '#2C7438'], [.5, '#57A852'], [1, '#2C7438']]));
  limb(c, [[0, -3], [0, -34]], [1.4, .6], 'rgba(200,240,170,.6)', false); c.restore();
  if (t > t1) glow(c, x1, y1, 120, '#FFE6A0', .5 * Math.exp(-(t - t1) * 1.5), 'lighter');
}
// a layer laid down as pure light of colour col (a figure becoming light)
function asLight(c, Lr, col, a, blur = 6) {
  if (a <= 0) return;
  const l = scratch('light'); l.setTransform(c.getTransform()); l.clearRect(-W * 2, -H * 2, W * 6, H * 6);
  ptDraw(l, Lr); l.globalCompositeOperation = 'source-in'; l.fillStyle = col; l.fillRect(-W * 2, -H * 2, W * 6, H * 6); l.globalCompositeOperation = 'source-over';
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = a; c.globalCompositeOperation = 'lighter'; c.filter = `blur(${blur}px)`; c.drawImage(l.canvas, 0, 0); c.filter = 'none'; c.drawImage(l.canvas, 0, 0); c.restore();
}
// the courtyard: the set, the stone (unless it's out on its rounds), the vrindavan and the bride, the lamps
function court(c, t, o = {}) {
  ptDraw(c, L.court());
  TV_CLAMPS.forEach(([x, y], i) => flame(c, x, y - 8, t, 1.1, i));
  if (o.orbit != null) orbit(c, t, o.orbit, 'back');
  ptDraw(c, L.front());
  flame(c, TV_NICHE[0], TV_NICHE[1] + 30, t, 1, 7);
  if (o.orbit != null) orbit(c, t, o.orbit, 'front');
  else ptDraw(c, L.stone(!!o.glow));
  glow(c, TV_CX, 1150, 520, '#FFB070', .12 + .03 * Math.sin(t * 1.3), 'screen');
}
// the Shaligram's rounds round the vrindavan: p in rounds; on the far side the plate passes behind her
function orbit(c, t, p, half) {
  const a = Math.PI / 2 + p * TAU, x = TV_CX + Math.cos(a) * 300, y = 1630 + Math.sin(a) * 140, behind = Math.sin(a) < -.05;
  if ((half === 'back') !== behind) return;
  const s = lerp(.72, 1, (Math.sin(a) + 1) / 2);
  c.save(); c.translate(x, y); c.scale(s, s); c.translate(-TV_STONE[0], -TV_STONE[1]); ptDraw(c, L.stone(true)); c.restore();
  glow(c, x, y - 30 * s, 90 * s, '#FFE0A0', .35, 'lighter');
}

// ================= 1. the hook: the bride in the courtyard; her groom, a stone =================
SHOTS.push({ a: 0, b: TL.WAKE0 + .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.GROOM - .3, TL.STONE0 + .1));
  cam(c, 540, lerp(1000, TV_STONE[1] - 60, k), lerp(lerp(1.42, 1.34, seg(t, 0, TL.GROOM)), 2.1, k));
  court(c, t);
  const g = seg(t, TL.STONE0 - .1, TL.STONE0 + .4);
  if (g > 0) { glow(c, TV_STONE[0] + 6, TV_STONE[1] - 26, 160, '#FFD890', .45 * g, 'lighter'); for (let i = 0; i < 8; i++) twinkle(c, TV_STONE[0] - 70 + hash(i) * 140, TV_STONE[1] - 80 + hash(i + 4) * 70, 10 + hash(i + 1) * 8, g * Math.pow(.5 + .5 * Math.sin(t * 5 + i * 2), 4), '#FFF4D0'); }
  petals(c, t, -3, 8, .7);
} });
POST.push((c, t) => {   // the hook title, up from frame 0
  const a = 1 - seg(t, TL.WAKE0 - .5, TL.WAKE0 + .1); if (a <= 0) return;
  glow(c, 540, 560, 480, '#000000', .55 * a, 'source-over');
  const line = (y, parts, size) => {
    c.save(); c.font = `700 ${size}px Cinzel`; c.textBaseline = 'middle'; const tw = parts.reduce((s, [w]) => s + c.measureText(w).width, 0); let x = 540 - tw / 2;
    for (const [w, gold] of parts) { c.globalAlpha = a; c.shadowColor = 'rgba(5,4,12,.95)'; c.shadowBlur = 24; c.fillStyle = gold ? '#F4C46A' : '#FFF3DC'; c.fillText(w, x, y); x += c.measureText(w).width; }
    c.restore();
  };
  line(500, [['Why do we ', 0], ['MARRY', 1]], 66);
  line(596, [['TULSI', 1], [' to a ', 0], ['STONE', 1], ['?', 0]], 78);
});

// ================= 2. Vishnu asleep on Shesha; on Dev Uthani he wakes =================
SHOTS.push({ a: TL.WAKE0, b: TL.WHO0 + .3, xf: .5, draw(c, u, t) {
  const pre = seg(t, TL.WAKE0, TL.WAKES - .35), close = t > TL.WAKES - .35, back = easeIO(seg(t, TL.FIRST - .2, TL.HIS + .4));
  if (!close) cam(c, lerp(560, 470, easeIO(pre)), lerp(1250, 1200, pre), lerp(1.12, 1.5, easeIO(pre)));
  else cam(c, lerp(VS_FACE[0] + 20, 520, back), lerp(VS_FACE[1] - 30, 1180, back), lerp(3.1, 1.25, back));
  ptDraw(c, L.ocean()); stars(c, t, 1, 1000);
  const wake = seg(t, TL.WAKES - .1, TL.WAKES + .6);
  glow(c, VS_FACE[0], VS_FACE[1], 500, '#FFD890', .35 * wake + .08, 'screen');
  ptDraw(c, L.vishnu(t > TL.WAKES ? 'front' : 'shut'));
  if (wake > 0) {   // gold light spreads over the ocean as he wakes
    glow(c, VS_FACE[0], VS_FACE[1] - 40, 200 + 600 * easeOut(wake), '#FFE6A0', .3 * Math.sin(Math.PI * seg(t, TL.WAKES - .1, TL.WAKES + 2.5)), 'lighter');
    c.save(); c.translate(560, 1180); c.scale(1, .18); glow(c, 0, 0, 900, '#FFC870', .3 * seg(t, TL.WAKES, TL.FIRST + 1), 'lighter'); c.restore();
  }
  const h = strikes(t, [TL.HIS]); if (h > .02) glow(c, 540, 1100, 900, '#FFE0A0', .25 * Math.min(1, h), 'lighter');
  for (let i = 0; i < 18; i++) { const s = frac(t * .12 + hash(i)), x = 120 + hash(i * 3) * 860, y = 1500 - s * 900; twinkle(c, x, y, 8 + hash(i) * 6, Math.sin(s * Math.PI) * .6 * (.3 + wake), '#FFF0C8'); }
} });

// ================= 3. who is she? Tulasi by the river under the Kartik full moon =================
SHOTS.push({ a: TL.WHO0, b: TL.TAP0 + .3, xf: .5, draw(c, u, t) {
  const k = easeIO(seg(t, TL.TULASI - .2, TL.KARTIK + .4));
  cam(c, 540, lerp(TR_FACE[1] + 40, 1000, k), lerp(lerp(2.0, 1.8, seg(t, TL.WHO0, TL.TULASI)), 1.0, k));
  ptDraw(c, L.bank());
  const m = seg(t, TL.KARTIK - .2, TL.KARTIK + 1);
  glow(c, ...TV_BMOON, 200 + 140 * m, '#E8EEFF', .18 + .3 * m, 'screen');
  for (let i = 0; i < 26; i++) { const y = 1090 + hash(i) * 320, x = TV_BMOON[0] + (hash(i + 4) - .5) * (30 + (y - 1080) * .35), kk = Math.pow(Math.max(0, Math.sin(t * (1.2 + hash(i + 2) * 2) + i * 2.1)), 8); twinkle(c, x, y, 8 + hash(i + 7) * 8, kk * .8, '#EEF2FF'); }
  tulasi(c, { eyes: 'front', mouth: 'soft', sindoor: false, blink: blinkAt(t, [18.4, 21.2]) });
  fireflies(c, t, 10, [60, 1300, 1020, 1800], .7);
} });
POST.push((c, t) => {   // the source tag
  const a = seg(t, TL.DEVI - .2, TL.DEVI + .4) * (1 - seg(t, TL.KARTIK - .4, TL.KARTIK)); if (a <= 0) return;
  text(c, 'Devi Bhagavatam 9.17', 540, 560, 'italic 44px Marcellus', '#F2E2C0', { alpha: a, glow: ['rgba(0,0,0,.9)', 18] });
});

// ================= 4. her tapas: a lakh divine years; one wish =================
SHOTS.push({ a: TL.TAP0, b: TL.BR0 + .3, xf: .4, draw(c, u, t) {
  const k = seg(t, TL.TAP0, TL.BR0);
  cam(c, 540, lerp(1240, 1180, k), lerp(1.3, 1.2, k));
  ptDraw(c, L.bank());
  // time running: the sky flickers, star trails wheel round the pole star, seasons pass
  const run = seg(t, TL.LAKH - .3, TL.LAKH + .3) * (1 - seg(t, TL.WISH - .4, TL.WISH + .2));
  if (run > 0) {
    flash(c, run * .25 * (.5 + .5 * Math.sin(t * 22)), '#9AB0E8');
    c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
    for (let i = 0; i < 40; i++) { const r = 80 + hash(i) * 900, a0 = hash(i + 3) * TAU + t * 1.6; c.strokeStyle = `rgba(220,230,255,${.25 * run})`; c.lineWidth = 2; c.beginPath(); c.arc(860, 120, r, a0, a0 + .5 * run); c.stroke(); }
    c.restore();
    for (let i = 0; i < 40; i++) { const s = frac(t * .5 + hash(i)), x = hash(i * 3) * W + Math.sin(s * 6 + i) * 30, y = s * H; ellipse(c, x, y, 4, 4, rgba(t < TL.LAKH + 1.2 ? '#F2F6FF' : '#C8782A', .7 * run)); }
  }
  tulasi(c, { eyes: 'shut', mouth: 'soft', sindoor: false });
  flame(c, 540, 1830, t, 1.2, 2);
  const n = seg(t, TL.NARAYANA - .3, TL.NARAYANA + .8);   // the wish: a blue light in the sky
  if (n > 0) { glow(c, 540, 560, 260, '#6A90E8', .4 * n, 'screen'); glow(c, 540, 560, 90, '#CFE0FF', .6 * n, 'lighter'); for (let i = 0; i < 10; i++) { const g = t * 1.2 + i * TAU / 10; twinkle(c, 540 + Math.cos(g) * 140, 560 + Math.sin(g) * 60, 12, n * (.5 + .5 * Math.sin(t * 4 + i)), '#E8F0FF'); } }
} });

// Brahma's lotus, of light: petals opening in two rings, rays behind
function lotusLight(c, t, x, y, b) {
  if (b <= 0) return;
  rays(c, x, y - 40, { n: 16, dir: -Math.PI / 2, spread: 2.6, len: 700, w: 120, col: '#FFE6A0', a: .18 * b, t, seed: 3 });
  c.save(); c.translate(x, y); c.globalCompositeOperation = 'lighter';
  for (const [n, len, w, sp, al] of [[9, 170, 54, 1.5, .4], [7, 130, 46, 1.0, .55], [5, 90, 36, .55, .7]]) for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / (n - 1) - .5) * sp * 2 * easeOut(b);
    c.save(); c.rotate(a + Math.PI / 2); c.globalAlpha = al * b;
    ptShape(c, `M 0 0 C ${w} ${-len * .3} ${w * .7} ${-len * .8} 0 ${-len} C ${-w * .7} ${-len * .8} ${-w} ${-len * .3} 0 0 Z`, ptLin(c, 0, 0, 0, -len, [[0, 'rgba(255,220,150,.9)'], [1, 'rgba(255,170,70,.3)']]));
    c.restore();
  }
  c.restore();
  glow(c, x, y - 40, 120, '#FFF2C8', .6 * b, 'lighter');
}

// ================= 5. Brahma's word: first another; afterwards Narayana =================
SHOTS.push({ a: TL.BR0, b: TL.AS0 + .3, xf: .4, draw(c, u, t) {
  const k = seg(t, TL.BR0, TL.AS0);
  cam(c, 540, lerp(1000, 960, k), lerp(1.05, 1.0, k));
  ptDraw(c, L.bank());
  const b = easeOut(seg(t, TL.BR0 - .2, TL.BR0 + 1.2));
  glow(c, 540, 520, 420, '#FFC870', .35 * b, 'screen');
  lotusLight(c, t, 540, 600, b);
  for (let i = 0; i < 14; i++) { const g = t * .8 + i * TAU / 14; twinkle(c, 540 + Math.cos(g) * 280, 520 + Math.sin(g) * 90, 12, b * (.5 + .5 * Math.sin(t * 3 + i)), '#FFF0C8'); }
  const n2 = seg(t, TL.NARAYANA2 - .3, TL.NARAYANA2 + .6);
  if (n2 > 0) { glow(c, 820, 420, 200, '#6A90E8', .4 * n2, 'screen'); glow(c, 820, 420, 70, '#CFE0FF', .6 * n2, 'lighter'); }
  tulasi(c, { eyes: t > TL.BR0 + .5 ? 'front' : 'shut', mouth: 'soft', sindoor: false });
  flame(c, 540, 1830, t, 1.2, 2);
} });

// ================= 6. Shankhachuda; her vow keeps him alive; he takes heaven =================
function shield(c, t, a) {   // her vow's light round him: a gold shell, shimmering
  if (a <= 0) return;
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 3; k++) { c.strokeStyle = `rgba(255,214,120,${(.35 - k * .1) * a})`; c.lineWidth = 10 - k * 3; c.shadowColor = '#FFD890'; c.shadowBlur = 30; c.beginPath(); c.ellipse(560, 1000, 400 + k * 16 + Math.sin(t * 3 + k) * 6, 680 + k * 16, 0, 0, TAU); c.stroke(); }
  c.restore();
  glow(c, 560, 1000, 600, '#FFC870', .12 * a, 'screen');
  for (let i = 0; i < 16; i++) { const g = i / 16 * TAU + t * .3; twinkle(c, 560 + Math.cos(g) * 410, 1000 + Math.sin(g) * 690, 12, a * Math.pow(.5 + .5 * Math.sin(t * 4 + i * 1.7), 4), '#FFF4D0'); }
}
function asuraShot(c, t, o = {}) {
  ptDraw(c, L.war('red'));
  for (let i = 0; i < 30; i++) { const s = frac(t * .15 + hash(i)), x = hash(i * 7) * W, y = 1250 - s * 900; ellipse(c, x + Math.sin(s * 5 + i) * 20, y, 3, 3, rgba('#FFB060', .8 * Math.sin(s * Math.PI))); }
  if (o.gods) for (let i = 0; i < 9; i++) { const s = seg(t, o.gods + i * .12, o.gods + 1.6 + i * .12), x = 120 + i * 100, y = 1200 - easeIn(s) * 1100; if (s > 0 && s < 1) glow(c, x + Math.sin(s * 4 + i) * 30, y, 26, '#FFE6A0', .8 * (1 - s), 'lighter'); }
  c.save(); if (o.fall) { c.translate(560, 1560); c.rotate(.5 * easeIn(o.fall)); c.translate(-560, -1560 - 300 * easeIn(o.fall)); c.globalAlpha = 1 - o.fall; }
  const A = L.asura(); ptDraw(c, A, 1 - (o.fall || 0));
  ptDraw(c, ptRim(A, { dx: 0, dy: 6, col: '#FF8A3A', blur: 5, key: 'asura' }), .9 * (1 - (o.fall || 0)), 'screen');
  c.restore();
  if (o.fall) for (let i = 0; i < 40; i++) { const s = o.fall, x = 560 + (hash(i) - .5) * 600 * (.3 + s), y = 1000 + (hash(i + 3) - .5) * 1100 - s * 300 * hash(i + 5); glow(c, x, y, 14, '#FF9A40', (1 - s) * .8 * Math.min(1, s * 4), 'lighter'); }
}
SHOTS.push({ a: TL.AS0, b: TL.VOW + .2, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.AS0, TL.VOW));
  cam(c, 560, lerp(1300, 1000, k), lerp(1.35, 1.1, k));
  asuraShot(c, t);
} });
SHOTS.push({ a: TL.VOW, b: TL.DEATH + .2, xf: .25, draw(c, u, t) {   // her vow: a lamp that never goes out
  cam(c, 540, lerp(1380, 1330, seg(t, TL.VOW, TL.DEATH)), 1.3);
  ptDraw(c, L.palace());
  tulasi(c, { eyes: 'down', mouth: 'smile' });
  glow(c, 540, 1810, 260, '#FFC870', .35 + .05 * Math.sin(t * 3), 'screen');
  trDiya(c, 540, 1856); flame(c, 540, 1846, t, 1.6, 4);
} });
SHOTS.push({ a: TL.DEATH, b: TL.HEAVEN + .2, xf: .25, draw(c, u, t) {
  cam(c, 560, 1050, lerp(1.15, 1.2, seg(t, TL.DEATH, TL.HEAVEN)));
  asuraShot(c, t);
  shield(c, t, seg(t, TL.DEATH, TL.DEATH + .4));
  for (let i = 0; i < 5; i++) { const s = seg(t, TL.DEATH + .3 + i * .18, TL.DEATH + .5 + i * .18); if (s > 0 && s < 1) { const g = -2.4 + i * .3; glow(c, 560 + Math.cos(g) * 410, 1000 + Math.sin(g) * 690, 70 * (1 - s), '#FFF2C0', 1 - s, 'lighter'); } }
} });
SHOTS.push({ a: TL.HEAVEN, b: TL.SHIVA + .2, xf: .3, draw(c, u, t) {
  cam(c, 560, 1000, lerp(1.0, 1.06, seg(t, TL.HEAVEN, TL.SHIVA)));
  asuraShot(c, t, { gods: TL.HEAVEN + .2 });
} });

// ================= 7. Shiva goes to war; Vishnu goes to her palace in her husband's form =================
SHOTS.push({ a: TL.SHIVA, b: TL.VISHNU2 - .1, xf: .25, draw(c, u, t) {
  const st = [TL.SHIVA + .5];
  cam(c, 600, lerp(1100, 950, seg(t, TL.SHIVA, TL.VISHNU2)), 1.1, W / 2, H / 2, 3 * strikes(t, st));
  ptDraw(c, L.war('blue'));
  const S = L.shiva(); ptDraw(c, S); ptDraw(c, ptRim(S, { dx: 0, dy: -5, col: '#BFD4FF', blur: 5, key: 'shiva' }), .9, 'screen');
  st.forEach((b, i) => { const a = strikes(t, [b]); if (a > .02) bolt(c, 140, 0, 330, 520, 4 + i, Math.min(1, a)); });
  glow(c, 340, 160, 200, '#BFD4FF', .3 + .1 * Math.sin(t * 6), 'lighter');
  flash(c, .3 * strikes(t, st));
} });
SHOTS.push({ a: TL.VISHNU2 - .1, b: TL.BR1 + .2, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.HUSBAND - .4, TL.BR1));
  cam(c, lerp(480, 300, k), lerp(1100, 1000, k), lerp(1.0, 1.35, k));
  ptDraw(c, L.palace());
  const g = easeOut(seg(t, TL.VISHNU2 + .3, TL.VISHNU2 + 1.6));   // he comes out of the blue night, in Shankhachuda's shape
  glow(c, TV_DOOR[0], 1000, 260, '#5A7AD8', .25 * g, 'screen');
  ptDraw(c, L.guest(), g);
  asLight(c, L.guest(), 'rgba(110,150,255,1)', .12 * g * (.7 + .3 * Math.sin(t * 2)), 10);   // the tell: a blue edge
  tulasi(c, { eyes: 'front', mouth: 'smile' });
  glow(c, 540, 1810, 240, '#FFC870', .3, 'screen'); trDiya(c, 540, 1856); flame(c, 540, 1846, t, 1.6, 4);
} });

// ================= 8. her vow breaks (the lamp goes out); Shiva's trishul strikes =================
SHOTS.push({ a: TL.BR1, b: TL.BATTLE - .15, draw(c, u, t) {
  cam(c, 540, 1760, 2.6);
  ptDraw(c, L.palace()); tulasi(c, { eyes: 'down', mouth: 'soft' });
  const out = seg(t, TL.BROKEN - .15, TL.BROKEN + .25);
  glow(c, 540, 1810, 240, '#FFC870', .3 * (1 - out), 'screen');
  trDiya(c, 540, 1856); flame(c, 540, 1846, t, 1.6 * (1 - out * .6), 4, 1 - out);
  if (out > 0) for (let i = 0; i < 12; i++) { const s = frac((t - TL.BROKEN) * .5 + i / 12), x = 540 + Math.sin(s * 8 + i) * 16 * s, y = 1830 - s * 220; glow(c, x, y, 14 + s * 20, '#8A8A9A', .3 * Math.sin(s * Math.PI) * out, 'source-over'); }
  flash(c, .4 * out, '#05040A', 'source-over');
} });
SHOTS.push({ a: TL.BATTLE - .15, b: TL.CU0 + .2, xf: .15, draw(c, u, t) {
  const hit = TL.STRUCK, sh = strikes(t, [hit]);
  cam(c, 560, 1050, 1.12, W / 2, H / 2, 10 * sh);
  asuraShot(c, t, { fall: seg(t, hit + .3, hit + 1.6) });
  shield(c, t, 1 - seg(t, hit - .05, hit + .1));
  // the trishul, a streak of white-blue light, down from the left onto him
  const f = seg(t, TL.TRISHUL - .3, hit);
  if (f > 0 && t < hit + .1) {
    const x = lerp(-120, 520, easeIn(f)), y = lerp(80, 860, easeIn(f));
    c.save(); c.translate(x, y); c.rotate(Math.atan2(780, 640)); c.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 6; k++) glow(c, -k * 60, 0, 60 - k * 8, '#BFD4FF', .5 - k * .07, 'lighter');
    c.strokeStyle = '#F2F6FF'; c.lineWidth = 8; c.lineCap = 'round'; c.shadowColor = '#BFD4FF'; c.shadowBlur = 30;
    c.beginPath(); c.moveTo(-260, 0); c.lineTo(110, 0); c.moveTo(40, 0); c.quadraticCurveTo(80, -40, 100, -50); c.moveTo(40, 0); c.quadraticCurveTo(80, 40, 100, 50); c.stroke();
    c.restore();
  }
  if (t > hit) { const r = (t - hit) * 1600; c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = `rgba(220,230,255,${Math.max(0, .6 - (t - hit))})`; c.lineWidth = 14; c.beginPath(); c.ellipse(560, 900, r, r * .4, 0, 0, TAU); c.stroke(); c.restore(); }
  flash(c, .8 * sh, '#F2F6FF');
} });

// ================= 9. she sees who he really is; the curse =================
SHOTS.push({ a: TL.CU0, b: TL.HEART - .1, xf: .2, draw(c, u, t) {
  cam(c, 300, 1000, lerp(1.3, 1.5, seg(t, TL.CU0, TL.HEART)));
  ptDraw(c, L.palace());
  const r = easeIO(seg(t, TL.REALLY - .5, TL.REALLY + .6));   // the disguise melts; a figure of blue light stands there
  ptDraw(c, L.guest(), 1 - r);
  asLight(c, L.guest(), 'rgba(120,160,255,1)', .15 + .7 * r, 8);
  glow(c, TV_DOOR[0], 1000, 300, '#6A8AE8', .4 * r, 'screen');
  tulasi(c, { eyes: 'front', mouth: 'sad' });
} });
SHOTS.push({ a: TL.HEART - .1, b: TL.AC0 + .2, draw(c, u, t) {
  const bc = strikes(t, [TL.BECOME]);
  cam(c, TR_FACE[0], TR_FACE[1] + 30, lerp(2.3, 2.6, seg(t, TL.HEART, TL.AC0)), W / 2, H / 2 - 120, 6 * bc);
  ptDraw(c, L.palace());
  glow(c, TV_DOOR[0], 1000, 300, '#6A8AE8', .4, 'screen');
  const ang = t > TL.STONE2 - .15;
  tulasi(c, ang ? { eyes: 'front', mouth: 'firm', brow: 'angry', tear: true } : { eyes: 'front', mouth: 'sad', tear: true });
  if (bc > .02) { glow(c, TR_FACE[0], TR_FACE[1] - 10, 400, '#FFB070', .4 * Math.min(1, bc), 'lighter'); flash(c, .35 * Math.min(1, bc), '#FFE8C8'); }
} });

// ================= 10. Vishnu accepts: the light becomes a stone; he answers her =================
SHOTS.push({ a: TL.AC0, b: TL.SAID - .1, xf: .2, draw(c, u, t) {
  cam(c, 300, 1200, 1.4);
  ptDraw(c, L.palace());
  const s = easeIO(seg(t, TL.AC0 + .2, TL.SAID - .5));   // the light bows down and gathers into a stone on the floor
  c.save(); c.translate(TV_DOOR[0], TV_DOOR[1]); c.scale(1 - s * .85, 1 - s * .95); c.translate(-TV_DOOR[0], -TV_DOOR[1]);
  asLight(c, L.guest(), 'rgba(120,160,255,1)', .85 * (1 - s * .6), 8); c.restore();
  const st = seg(t, TL.SAID - 1.2, TL.SAID - .4);
  if (st > 0) { c.save(); c.globalAlpha = st; c.translate(TV_DOOR[0], TV_DOOR[1] + 30); c.scale(.9, .9); c.translate(-TV_STONE[0], -TV_STONE[1]); ptDraw(c, L.stone(true)); c.restore(); glow(c, TV_DOOR[0], TV_DOOR[1] - 10, 160, '#8AB0FF', .5 * st, 'lighter'); }
  tulasi(c, { eyes: 'front', mouth: 'sad', tear: true });
} });
SHOTS.push({ a: TL.SAID - .1, b: TL.BO0 + .2, xf: .3, draw(c, u, t) {
  cam(c, TR_FACE[0], TR_FACE[1] + 60, lerp(2.0, 2.2, seg(t, TL.SAID, TL.BO0)), W / 2, H / 2 - 80);
  ptDraw(c, L.palace());
  glow(c, 320, 900, 600, '#6A8AE8', .25 + .05 * Math.sin(t * 2), 'screen');
  tulasi(c, { eyes: t > TL.FOREVER - .1 ? 'front' : 'down', mouth: 'soft', tear: true });
  const f = seg(t, TL.FOREVER - .2, TL.FOREVER + .8); if (f > 0) for (let i = 0; i < 16; i++) twinkle(c, TR_FACE[0] + (hash(i) - .5) * 500, TR_FACE[1] + (hash(i + 5) - .5) * 500, 10 + hash(i + 1) * 10, f * Math.pow(.5 + .5 * Math.sin(t * 3 + i * 2.2), 6), '#DDE8FF');
} });

// ================= 11. her body flows as the Gandaki; her hair grows as tulsi; he lies on her bank, a stone =================
const BUSHES = [[0, .62, 540, 1720], [1, .42, 250, 1650], [2, .46, 840, 1660]];
function riverEnd(c, t, grow, stone, glowing = 0) {
  BUSHES.forEach(([i, s, x, y], j) => { const g = easeOut(seg(grow, j * .2, .6 + j * .2)); if (g <= 0) return; c.save(); c.translate(x, y); c.scale(g, g); c.translate(-540, -1720); ptDraw(c, L.bush(i, s)); c.restore(); });
  if (stone > 0) { c.save(); c.globalAlpha = stone; ptDraw(c, L.rstone()); c.restore(); glow(c, 546, 1800, 160, '#FFD890', .3 * stone, 'lighter'); }
  if (glowing > 0) ptDraw(c, L.rstone(true), glowing);
}
SHOTS.push({ a: TL.BO0, b: TL.TW0 + .3, xf: .4, draw(c, u, t) {
  const push = easeIO(seg(t, TL.SHALIGRAM - .6, TL.TW0 + .3));
  cam(c, 540, lerp(1200, 1660, push), lerp(1.05, 1.9, push));
  ptDraw(c, L.bank(false));
  const d = seg(t, TL.BO0 + .4, TL.HAIR - .3);   // she becomes light and flows into the river
  if (d < 1) tulasi(c, { eyes: 'shut', mouth: 'smile' }, 1 - easeIn(d));
  if (d > 0) asLight(c, L.body(), 'rgba(170,200,255,1)', .28 * Math.sin(Math.PI * d), 14);
  const fl = seg(t, TL.GANDAKI - .6, TL.GANDAKI + .6);
  if (fl > 0) {   // the river lit: strands of silver light running along it, motes flowing down from where she sat
    c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
    for (let i = 0; i < 26; i++) { const y = 1100 + hash(i) * 330, l = 120 + hash(i + 2) * 260, x = frac(hash(i + 4) + t * (.08 + hash(i) * .06)) * (W + l * 2) - l; c.strokeStyle = `rgba(220,232,255,${.35 * fl})`; c.lineWidth = 2 + hash(i + 7) * 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x + l, y + 3); c.stroke(); }
    c.restore();
    if (d > .2) for (let i = 0; i < 30; i++) { const s = frac(t * .4 + hash(i)), x = 540 + (hash(i * 2) - .5) * 400 * (1 - s); twinkle(c, lerp(540, x, s), lerp(1400, 1180, s), 10, Math.sin(s * Math.PI) * .7 * fl, '#E8F0FF'); }
  }
  riverEnd(c, t, seg(t, TL.TULSI2 - .6, TL.LIE + .2), seg(t, TL.LIE + .4, TL.SHALIGRAM - .2));
  fireflies(c, t, 10, [60, 1300, 1020, 1800], .6);
} });

// ================= 12. her curse and her prayer, together =================
SHOTS.push({ a: TL.TW0, b: TL.WH0 + .3, xf: .5, draw(c, u, t) {
  cam(c, 540, lerp(1660, 1700, seg(t, TL.TW0, TL.WH0)), lerp(1.9, 2.1, seg(t, TL.TW0, TL.WH0)));
  ptDraw(c, L.bank(false));
  riverEnd(c, t, 1, 1, .7 * seg(t, TL.TOGETHER, TL.TOGETHER + .6));
  glow(c, ...TV_BMOON, 300, '#E8EEFF', .2, 'screen');
  leafFall(c, t, TL.TOGETHER, 560, 1772, 1.2);
} });

// ================= 13. why: never without tulsi; every Kartik we marry them =================
SHOTS.push({ a: TL.WH0, b: TL.EVERY - .1, xf: .5, draw(c, u, t) {
  cam(c, 540, TV_STONE[1] - 40, lerp(2.4, 2.2, seg(t, TL.WH0, TL.EVERY)));
  court(c, t, { glow: t > TL.WITHOUT });
  leafFall(c, t, TL.WITHOUT, TV_STONE[0] + 4, TV_STONE[1] - 66, 1);
} });
SHOTS.push({ a: TL.EVERY - .1, b: TL.RI0 + .2, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.EVERY - .1, TL.MARRY));
  cam(c, 540, lerp(1500, 1060, k), lerp(1.7, 1.0, k));
  court(c, t, { glow: true });
  const m = seg(t, TL.MARRY - .1, TL.MARRY + .6);
  if (m > 0) { glow(c, 540, 850, 600, '#FFD890', .25 * Math.sin(Math.PI * seg(t, TL.MARRY - .1, TL.MARRY + 1.6)), 'lighter'); for (let i = 0; i < 22; i++) twinkle(c, 220 + hash(i) * 640, 500 + hash(i + 3) * 900, 12 + hash(i + 1) * 10, m * Math.pow(.5 + .5 * Math.sin(t * 4 + i * 2), 5), '#FFF2C8'); }
  petals(c, t, TL.MARRY - .3, 14, .9);
} });

// ================= 14. the ritual: the mandap, the chunari, the rounds, the kanyadaan =================
SHOTS.push({ a: TL.RI0, b: TL.CHUNARI - .1, xf: .3, draw(c, u, t) {   // up the sugarcane to the knot at the top
  const k = easeIO(seg(t, TL.RI0, TL.CHUNARI));
  cam(c, 540, lerp(1300, 760, k), 1.4);
  court(c, t); petals(c, t, TL.RI0 - 4, 10, .8);
} });
SHOTS.push({ a: TL.CHUNARI - .1, b: TL.FAMILIES - .1, xf: .3, draw(c, u, t) {   // the bride's veil and mukut
  cam(c, 540, lerp(900, 940, seg(t, TL.CHUNARI, TL.FAMILIES)), lerp(1.9, 2.05, seg(t, TL.CHUNARI, TL.FAMILIES)));
  court(c, t);
  for (let i = 0; i < 14; i++) twinkle(c, 400 + hash(i) * 280, 790 + hash(i + 3) * 230, 10 + hash(i + 1) * 8, Math.pow(.5 + .5 * Math.sin(t * 3 + i * 2.2), 6), '#FFE8B0');
  petals(c, t, TL.RI0 - 4, 10, .8);
} });
SHOTS.push({ a: TL.FAMILIES - .1, b: TL.ASK0 + .3, xf: .3, draw(c, u, t) {   // the rounds; she is given away
  cam(c, 540, lerp(1240, 1150, seg(t, TL.FAMILIES, TL.ASK0)), lerp(1.12, 1.05, seg(t, TL.FAMILIES, TL.ASK0)));
  const p = easeIO(seg(t, TL.FAMILIES + .1, TL.KANYA + .6)) * 2;   // two rounds in the time we have (the count varies by family)
  court(c, t, { orbit: p });
  const kd = seg(t, TL.KANYA - .3, TL.KANYA + .6);
  if (kd > 0) glow(c, 540, 900, 500, '#FFD890', .3 * kd, 'lighter');
  petals(c, t, TL.FAMILIES, 18, .9);
} });

// ================= 15. the ask: Vrinda or Tulsi? =================
SHOTS.push({ a: TL.ASK0, b: TL.CARD + .2, xf: .5, draw(c, u, t) {
  cam(c, 540, lerp(1150, 1060, seg(t, TL.ASK0, TL.CARD)), lerp(1.0, 1.08, seg(t, TL.ASK0, TL.CARD)));
  court(c, t, { glow: true });
  glow(c, ...TV_CMOON, 160, '#E8EEFF', .25, 'screen');
  petals(c, t, TL.ASK0 - 3, 12, .8);
} });
POST.push((c, t) => {
  const a = seg(t, TL.YOU - .2, TL.YOU + .3) * (1 - seg(t, TL.CARD - .2, TL.CARD + .1)); if (a <= 0) return;
  glow(c, 540, 560, 460, '#000000', .55 * a, 'source-over');
  text(c, 'VRINDA', 540, 470, '700 92px Cinzel', '#F4C46A', { alpha: a, pop: t - TL.YOU, glow: ['rgba(255,190,90,.9)', 24] });
  text(c, 'or', 540, 560, 'italic 50px Marcellus', '#FFF3DC', { alpha: a, glow: ['rgba(0,0,0,.9)', 16] });
  text(c, 'TULSI?', 540, 650, '700 92px Cinzel', '#F4C46A', { alpha: a, pop: t - TL.YOU - .25, glow: ['rgba(255,190,90,.9)', 24] });
});

// ================= 16. the card =================
SHOTS.push({ a: TL.CARD, b: TL.END, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'The Navadurga Set is out now', note: 'Link in bio' });
} });

// ---------- captions: karaoke from the voice ----------
Object.assign(CAP, { font: 'Poppins', weight: 600, size: 50, y: 1440, maxW: 900, lit: '#FFF6E6', gold: '#F4C46A', dim: .4 });
// the Shaligram close-up sits low in the frame: its captions go up to the top of the safe band
VO.caps.forEach(k => say(k.a, Math.min(k.b, TL.CARD - .1), k.text, { at: k.at, y: k.id === 'why' && k.a < TL.EVERY - .2 ? 620 : (k.y ?? 1440), size: k.size }));
POST.push((c, t) => {   // a soft dark scrim under each caption
  for (const k of CAPTIONS) {
    const a = Math.min(seg(t, k.a, k.a + .2), 1 - seg(t, k.b - .2, k.b)); if (a <= 0 || t < k.a || t > k.b) continue;
    c.save(); c.translate(540, k.y); c.scale(1, .22); glow(c, 0, 0, 580, '#000000', .6 * a, 'source-over'); c.restore();
  }
});

LOOK.bloom = .22; LOOK.vignette = .5; LOOK.grain = .045;
