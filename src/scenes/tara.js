// tara.js: "Maa Tara and Shiva" (Painterly; STORYBOARD.md). A collab: @shagunshrotriyaparashar_'s Hindi voiceover, our
// picture. Night sets (tara_cast.js), seated Shiva (src/pt_shiva.js), the Devi rig (tara_cast.js over dhan_cast.js's parts).
// Shots are cut on the voice (TL: word times from whisper); subtitles are the VO in Roman Hindi.
const ZK = 2, HK = 3;   // bake resolutions: bodies, heads and the child (close-ups come near them)
const TL = {
  river: 6.3, sea: 14.6, drink: 18.0, gale: 20.4, spread: 23.3, parvati: 25.9, change: 28.4, tara: 30.0, lap: 31.9, shishu: 41.2,
  close: 43.1, milk: 48.2, kaata: 53.2, sheetal: 55.5, wide: 57.0, dev: 62.3, maa: 71.9, door: 76.2, karuna: 79.0, wide2: 82.6,
  mahadev: 89.5, shiv: 91.4, darshan: 92.6, jai: 106.6, card: 108.4, end: 112.5,
};

// ---------- layers ----------
const L = {
  river: (seat = true) => ptLayer('river' + +seat, [0, 0, W, H], c => trRiver(c, { seat }), { seed: 5 }),
  sea: () => ptLayer('sea', [0, 0, W, H], trSea, { seed: 6 }),
  shore: () => ptLayer('shore', [0, 0, W, H], trShore, { seed: 7 }),
  body: T => ptLayer('body' + +T, TR_BODY_BOX, trBody({ tara: T }), { alpha: true, seed: 17, brushes: PT_BRUSHES.slice(1), k: ZK }),
  head: (T, eyes = 'front', mouth = 'soft', tear = false, third = 1) => ptLayer(['head', +T, eyes, mouth, +tear, third].join(':'), TR_HEAD_BOX, trHead({ tara: T, eyes, mouth, tear, third }),
    { alpha: true, seed: 19, brushes: PT_BRUSHES.slice(2), k: HK, fine: [[...TR_FACE, 150]], keep: [[TR_FACE[0], TR_FACE[1] + 4, 130, .7]] }),
  front: () => ptLayer('front', TR_BODY_BOX, trFront({}), { alpha: true, seed: 21, brushes: PT_BRUSHES.slice(1), k: ZK }),
  baby: f => ptLayer('baby' + f, TR_BABY_BOX, trBaby(f), { alpha: true, seed: 23, brushes: PT_BRUSHES.slice(2), k: HK, fine: [[...TR_BABY, 60]], keep: [[...TR_BABY, 50, .6]] }),
  shiva: () => ptLayer('sv_shiva', SV_BOX, (c2) => { svPlace(c2); svShiva(c2); }, { alpha: true, seed: 17, brushes: PT_BRUSHES.slice(1), fine: SV_FINE, keep: SV_KEEP }),
  dev: () => ptLayer('dev', [150, 1200, 800, 440], trDevotees, { alpha: true, seed: 25, brushes: PT_BRUSHES.slice(2) }),
};
// the Devi: body, the child (or not), her cradling arms, her head. o: tara, baby ('pain' | 'calm' | 0), eyes, mouth, tear,
// third (the third eye: 1 open, 0 shut), blink (draw the eyes shut instead)
function devi(c, o = {}) {
  const T = o.tara !== false;
  ptDraw(c, L.body(T));
  if (T && o.baby) { ptDraw(c, L.baby(o.baby)); if (o.baby2) ptDraw(c, L.baby(o.baby2), o.mix); }
  if (T) ptDraw(c, L.front());
  ptDraw(c, L.head(T, o.blink ? 'shut' : o.eyes, o.mouth, !!o.tear, o.third ?? 1));
}
const blinkAt = (t, ts) => ts.some(b => t > b && t < b + .14);
// the camera: stage point (sx, sy) to the frame point (fx, fy), zoom z, kept inside the stage
function cam(c, sx, sy, z, fx = W / 2, fy = H / 2, shake = 0) {
  const j = shake ? [vnoise(T * 31, 1) * shake, vnoise(T * 29, 5) * shake] : [0, 0];
  z = Math.max(z, 1) * (shake ? 1 + (shake + 2) / 500 : 1);
  sx = clamp(sx, fx / z, W - (W - fx) / z); sy = clamp(sy, fy / z, H - (H - fy) / z);
  c.translate(fx + j[0], fy + j[1]); c.scale(z, z); c.translate(-sx, -sy);
}

// ---------- live light ----------
function flame(c, x, y, t, s = 1, i = 0) {
  const f = .8 + .2 * Math.sin(t * 13 + i * 2.3) + .1 * Math.sin(t * 29 + i), lean = Math.sin(t * 7 + i * 1.7) * 3;
  glow(c, x, y - 14 * s, 90 * s, '#FF9A3A', .3 * f, 'lighter');
  c.save(); c.translate(x, y - 6 * s); c.scale(s, s * f);
  ptShape(c, `M -6 0 C -8 -10 -2 -20 ${lean} -30 C 3 -20 8 -10 6 0 C 4 4 -4 4 -6 0 Z`, ptLin(c, 0, 0, 0, -30, [[0, '#FFF2B0'], [.5, '#FFB040'], [1, 'rgba(255,90,20,.6)']]));
  c.restore();
  glow(c, x, y - 10 * s, 18 * s, '#FFF6D0', .6, 'lighter');
}
function lamps(c, t) { TR_LAMPS.forEach(([x, y], i) => flame(c, x, y - 8, t, 1.1, i)); }
function moonlight(c, t, a = 1) {
  glow(c, ...TR_MOON, 160, '#DDE6FF', .22 * a, 'screen');
  for (let i = 0; i < 26; i++) { const y = 1090 + hash(i) * 320, x = TR_MOON[0] + (hash(i + 4) - .5) * (30 + (y - 1080) * .35), k = Math.pow(Math.max(0, Math.sin(t * (1.2 + hash(i + 2) * 2) + i * 2.1)), 8); twinkle(c, x, y, 8 + hash(i + 7) * 8, k * .8 * a, '#EEF2FF'); }
}
function fireflies(c, t, n = 18, box = [60, 900, 1020, 1700], a = 1) {
  for (let i = 0; i < n; i++) {
    const x = box[0] + hash(i * 3.1) * (box[2] - box[0]) + Math.sin(t * .4 + i) * 40, y = box[1] + hash(i * 7.3) * (box[3] - box[1]) + Math.cos(t * .33 + i * 2) * 30;
    const k = .5 + .5 * Math.sin(t * (1 + hash(i) * 1.5) + i * 4);
    glow(c, x, y, 16, '#E8FF9A', .5 * k * a, 'lighter'); ellipse(c, x, y, 2.2, 2.2, rgba('#F6FFD0', .9 * k * a));
  }
}
// petals drifting down through the frame
function petals(c, t, t0, n = 16, a = 1) {
  if (t < t0) return;
  for (let i = 0; i < n; i++) {
    const u = frac((t - t0) * (.08 + hash(i) * .05) + hash(i + 3)), x = 80 + hash(i * 2.7) * 920 + Math.sin((t - t0) * 1.3 + i) * 40, y = -40 + u * 2000;
    c.save(); c.translate(x, y); c.rotate(t * (1 + hash(i)) + i); c.globalAlpha = a * Math.min(1, (t - t0) * 2);
    ellipse(c, 0, 0, 12, 7, i % 3 ? '#C8102A' : '#E8402E'); ellipse(c, -3, -2, 5, 3, 'rgba(255,170,160,.6)'); c.restore();
  }
}
// dark smoke rising from (x, y): the halahala, or the pain of a devotee; k: strength; green: the poison's glow at its edges
function smoke(c, t, x, y, o = {}) {
  const n = o.n || 16, rise = o.rise || 500, r0 = o.r || 40, k = o.k ?? 1;
  for (let i = 0; i < n; i++) {
    const u = frac(t * (o.rate || .25) + hash(i + (o.seed || 0))), px = x + (hash(i * 3 + 1) - .5) * (o.w || 80) + Math.sin(u * 4 + i) * 30 * u, py = y - u * rise;
    const r = r0 * (.6 + u * 1.6), a = Math.sin(u * Math.PI) * k;
    glow(c, px, py, r, o.col || '#06120C', .55 * a, 'source-over');
    if (o.green !== false) glow(c, px, py, r * .7, '#4AC070', .22 * a, 'lighter');
  }
}
// the poison stream: dark-green beads along a curve from (x0, y0) into (x1, y1)
function stream(c, t, P, k = 1) {
  const C = through(P, 14), n = C.length;
  for (let i = 0; i < 40; i++) {
    const s = frac(i / 40 + t * .45), p = s * (n - 1), j = Math.min(n - 2, p | 0), f = p - j;
    const x = lerp(C[j][0], C[j + 1][0], f) + Math.sin(i * 1.7 + t * 3) * 10 * (1 - s), y = lerp(C[j][1], C[j + 1][1], f);
    glow(c, x, y, 40 * (1 - s * .6), '#081A10', .5 * k, 'source-over'); glow(c, x, y, 26 * (1 - s * .5), '#5AE08A', .5 * k, 'lighter'); glow(c, x, y, 8, '#D8FFE0', .5 * k, 'lighter');
  }
}
// veins of poison spreading down from the throat over his chest: a fixed branching tree grown to length g (0..1)
const VEINS = (() => {
  const R = lcg(5), out = [];
  const grow = (x, y, a, len, d) => { if (d > 4) return; const n = 4 + (R() * 3 | 0), P = [[x, y]]; for (let i = 0; i < n; i++) { a += (R() - .5) * .7; x += Math.cos(a) * len / n; y += Math.sin(a) * len / n; P.push([x, y]); } out.push({ P, d }); const b = 1 + (R() < .6 ? 1 : 0); for (let k = 0; k < b; k++) grow(x, y, a + (R() - .5) * 1.4, len * .7, d + 1); };
  for (const a of [Math.PI * .3, Math.PI * .5, Math.PI * .7, Math.PI * .15, Math.PI * .85]) grow(540, 1046, a, 110, 0);
  return out;
})();
function veins(c, g, t) {
  for (const { P, d } of VEINS) {
    const k = clamp(g * 5 - d), m = Math.max(2, Math.round(P.length * k)); if (k <= 0) continue;
    const Q = P.slice(0, m), pul = .7 + .3 * Math.sin(t * 6 - d);
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .75 * pul; limb(c, Q, Q.map((_, i) => Math.max(1.5, (9 - d * 1.5) * (1 - i / Q.length * .5))), '#9A5AF0', false); c.restore();
    c.save(); c.globalAlpha = .7; limb(c, Q, Q.map((_, i) => Math.max(.8, (3 - d * .5) * (1 - i / Q.length * .5))), '#3A1660', false); c.restore();
  }
}
// a form of light: Mahadev as a jyoti, an orb of cool light with motes circling it
function lightForm(c, t, cx, cy, r, a) {
  if (a <= 0) return;
  const p = 1 + .06 * Math.sin(t * 5);
  glow(c, cx, cy, r * 4 * p, '#7FA2E6', .35 * a, 'screen');
  glow(c, cx, cy, r * 2 * p, '#BFD4FF', .6 * a, 'lighter');
  glow(c, cx, cy, r * p, '#FFFFFF', .8 * a, 'lighter');
  for (let i = 0; i < 10; i++) { const g = t * (1.2 + hash(i) * .8) + i * TAU / 10, rr = r * (1.6 + hash(i + 3) * .8); twinkle(c, cx + Math.cos(g) * rr, cy + Math.sin(g) * rr * .45, 12 + hash(i) * 8, a * (.5 + .5 * Math.sin(t * 4 + i)), '#F2F6FF'); }
}
// her halo: a soft disc and a thin gold ring behind her head
function halo(c, t, a = 1, x = TR_FACE[0], y = TR_FACE[1] - 30) {
  const br = .5 + .5 * Math.sin(t * 1.2);
  glow(c, x, y, 520, '#7FA2E6', (.22 + .05 * br) * a, 'screen');
  glow(c, x, y, 250, '#FFE2A0', (.3 + .06 * br) * a, 'screen');
  c.save(); c.globalCompositeOperation = 'screen'; c.strokeStyle = `rgba(255,220,150,${(.35 + .1 * br) * a})`; c.lineWidth = 4; c.shadowColor = 'rgba(255,210,140,.9)'; c.shadowBlur = 18;
  c.beginPath(); c.arc(x, y, 236, 0, TAU); c.stroke(); c.restore();
}
// the riverbank with her (or not) and everything alive in it
function bank(c, t, o = {}) {
  ptDraw(c, L.river(o.seat !== false));
  moonlight(c, t, o.moon ?? 1);
  if (o.devi) { halo(c, t, o.halo ?? 1); devi(c, o.devi); }
  lamps(c, t);
  fireflies(c, t, 14, [60, 900, 1020, 1700], o.ff ?? 1);
}

// ---------- 1. the hook: her face ----------
SHOTS.push({ a: 0, b: TL.river + .5, draw(c, u, t) {
  const z = lerp(2.1, 1.95, t / TL.river);
  cam(c, TR_FACE[0], TR_FACE[1] - 150 / z, z);
  ptDraw(c, L.river(false)); halo(c, t, .8);
  devi(c, { eyes: 'front', mouth: 'soft', blink: blinkAt(t, [3.1]) });
} });

// ---------- 2. the riverbank, waiting ----------
SHOTS.push({ a: TL.river, b: TL.sea + .4, xf: .5, draw(c, u, t) {
  const k = easeIO(seg(t, TL.river, TL.sea));
  cam(c, 540, lerp(700, 1340, k), 1.12);
  bank(c, t);
  petals(c, t, TL.river - 2, 8, .8);
} });

// ---------- 3. the churning ----------
const BOLTS3 = [TL.sea + .5, TL.sea + 2.2];
SHOTS.push({ a: TL.sea, b: TL.drink + .3, xf: .4, draw(c, u, t) {
  cam(c, 540, 1000, 1 + u * .03, W / 2, H / 2, 4 * strikes(t, BOLTS3));
  ptDraw(c, L.sea());
  smoke(c, t, 540, 1340, { n: 26, rise: 900, r: 70, w: 420, rate: .2 });
  glow(c, 540, 1330, 300, '#4AC070', .25 + .1 * Math.sin(t * 3), 'lighter');
  BOLTS3.forEach((b, i) => { const a = strikes(t, [b]); if (a > .02) bolt(c, 180 + i * 640, 0, 360 + i * 300, 640, 7 + i, Math.min(1, a)); });
  flash(c, .35 * strikes(t, BOLTS3));
} });

// ---------- 4. Shiva draws the poison in ----------
const MOUTH = [540, 975], THROAT = [540, 1038];
SHOTS.push({ a: TL.drink, b: TL.spread, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.drink, TL.spread));
  cam(c, 540, lerp(1000, 1060, k), lerp(1, 1.45, k));
  ptDraw(c, L.shore());
  smoke(c, t, 900, 1150, { n: 14, rise: 600, r: 40, w: 140, rate: .25 });
  // the poison cloud overhead, pouring down into him
  smoke(c, t + 3, 820, 520, { n: 14, rise: 120, r: 120, w: 300, rate: .15, seed: 4 });
  const s1 = 1 - seg(t, TL.gale + 1.6, TL.spread - .2);
  ptDraw(c, L.shiva());
  stream(c, t, [[860, 500], [780, 640], [640, 780], [560, 900], MOUTH], s1);
  const g = seg(t, TL.gale - .4, TL.gale + .6), p = .7 + .3 * Math.sin(t * 7);
  glow(c, ...THROAT, 110, '#7A4AE0', .6 * g * p, 'lighter'); glow(c, ...THROAT, 40, '#C8A8FF', .5 * g * p, 'lighter');
} });

// ---------- 5. it spreads; he sways and slumps ----------
SHOTS.push({ a: TL.spread, b: TL.parvati + .2, draw(c, u, t) {
  const k = seg(t, TL.spread, TL.parvati), sl = easeIn(seg(t, TL.spread + 1.2, TL.parvati));
  cam(c, 540, lerp(1120, 1150, k), lerp(1.9, 1.75, k));
  ptDraw(c, L.shore());
  c.save(); c.translate(540, 1500); c.rotate(-.12 * sl + Math.sin(t * 2.2) * .02 * (1 - sl)); c.translate(-540, -1500 - 40 * sl);
  ptDraw(c, L.shiva());
  const p = .7 + .3 * Math.sin(t * 7);
  glow(c, ...THROAT, 120, '#7A4AE0', .65 * p, 'lighter');
  veins(c, easeOut(seg(t, TL.spread, TL.parvati - .4)), t);
  c.restore();
  flash(c, .25 * sl, '#05030A', 'source-over');
} });

// ---------- 6–7. Parvati can't bear it; she becomes Tara ----------
const WIPE = [TL.tara - .1, TL.tara + .9], FLASH7 = TL.tara + .75;
SHOTS.push({ a: TL.parvati, b: TL.lap + .4, xf: .2, draw(c, u, t) {
  const back = easeIO(seg(t, FLASH7, TL.lap + .3));
  cam(c, TR_FACE[0], lerp(TR_FACE[1] + 70, TR_FACE[1] + 300, back), lerp(2.9, 1.6, back) - seg(t, TL.parvati, TL.tara) * .15);
  ptDraw(c, L.river(false));
  const w = easeIn(seg(t, ...WIPE));
  if (w < 1) { glow(c, TR_FACE[0], TR_FACE[1] - 30, 380, '#FFC890', .2, 'screen'); devi(c, { tara: false, eyes: 'front', mouth: 'sad', tear: true }); }
  if (w > 0) {
    // Tara, revealed in a widening circle from the brow
    const l = scratch('wipe'); l.setTransform(c.getTransform()); l.clearRect(-W, -H, W * 4, H * 4);
    halo(l, t, seg(t, FLASH7, FLASH7 + 1)); devi(l, { eyes: 'front', mouth: 'soft', third: t > TL.tara + 1.2 ? 1 : 0 });
    l.globalCompositeOperation = 'destination-in'; const r = w * 1400;
    const g = l.createRadialGradient(TR_THIRD[0], TR_THIRD[1], Math.max(0, r - 60), TR_THIRD[0], TR_THIRD[1], r + 1); g.addColorStop(0, '#000'); g.addColorStop(1, 'rgba(0,0,0,0)');
    l.fillStyle = g; l.fillRect(-W, -H, W * 4, H * 4); l.globalCompositeOperation = 'source-over';
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(l.canvas, 0, 0); c.restore();
    c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = `rgba(160,190,255,${.8 * (1 - w)})`; c.lineWidth = 10; c.shadowColor = '#AFC8FF'; c.shadowBlur = 30; c.beginPath(); c.arc(...TR_THIRD, r, 0, TAU); c.stroke(); c.restore();
  }
  // the third eye's light
  const te = seg(t, TL.tara + 1.1, TL.tara + 1.6) * (1 - seg(t, TL.lap - .3, TL.lap + .3) * .6);
  glow(c, ...TR_THIRD, 60, '#FF9A6A', .7 * te, 'lighter');
  if (t > WIPE[0] - .3) glow(c, ...TR_THIRD, 40 + 200 * w, '#BFD4FF', .5 * Math.sin(Math.PI * clamp(seg(t, WIPE[0] - .3, WIPE[1] + .3))), 'lighter');
  const st = strikes(t, [FLASH7]);
  flash(c, .55 * st, '#DDE8FF');
} });

// ---------- 8–9. a form of light settles in her arms; on "shishu" it becomes a child ----------
const SHRINK = [TL.shishu - .1, TL.shishu + .7];
SHOTS.push({ a: TL.lap, b: TL.close + .5, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.lap + 2.5, TL.close + .5));
  cam(c, lerp(540, TR_BABY[0] - 40, k), lerp(1140, TR_BABY[1] + 10, k), lerp(1.15, 2.0, k));
  const sh = easeIO(seg(t, ...SHRINK)), baby = seg(t, SHRINK[0] + .5, SHRINK[1] + .6);
  bank(c, t, { devi: { eyes: 'down', mouth: 'soft', baby: baby > 0 ? 'pain' : 0 } });
  const d = easeIO(seg(t, TL.lap + .2, TL.lap + 3.8)), ap = seg(t, TL.lap, TL.lap + .8);
  const lx = lerp(560, TR_BABY[0] - 10, d), ly = lerp(560, TR_BABY[1] + 20, d) - Math.sin(t * 1.6) * 8 * d;
  lightForm(c, t, lx, ly, lerp(70, 40, d) * lerp(1, .4, sh), ap * (1 - baby));
  if (t > SHRINK[0]) glow(c, ...TR_BABY, 260, '#E8F0FF', .7 * Math.sin(Math.PI * seg(t, SHRINK[0], SHRINK[1] + .8)), 'lighter');
} });

// ---------- 10–11. mother and child; the milk as light; the poison clears ----------
const CALM = [TL.kaata - .2, TL.kaata + .6];
SHOTS.push({ a: TL.close, b: TL.wide + .5, xf: .5, draw(c, u, t) {
  const k = easeIO(seg(t, TL.close, TL.wide));
  cam(c, lerp(TR_BABY[0] - 50, TR_X + 20, k), lerp(TR_BABY[1] - 60, TR_BABY[1] - 120, k), lerp(2.25, 1.85, k));
  const m = easeIO(seg(t, ...CALM));
  bank(c, t, { devi: { eyes: 'down', mouth: t > TL.kaata + .8 ? 'smile' : 'soft', baby: 'pain', baby2: 'calm', mix: m, blink: blinkAt(t, [45.6, 51.4]) } });
  // the poison at his throat, fading as the light works
  const pz = 1 - seg(t, TL.milk + 2.2, TL.kaata + .3), p = .7 + .3 * Math.sin(t * 6);
  glow(c, ...TR_THROAT, 50, '#7A4AE0', .7 * pz * p, 'lighter');
  // the milk: a soft white light round him, beads of it drawn into his throat
  const lw = seg(t, TL.close + 3.2, TL.milk + .5) * (1 - seg(t, TL.wide - .5, TL.wide + .5) * .6);
  glow(c, TR_BABY[0] - 20, TR_BABY[1] + 40, 220, '#F4F8FF', .35 * lw, 'lighter');
  if (t > TL.milk - .5 && t < TL.kaata + 1) for (let i = 0; i < 18; i++) {
    const s = frac(i / 18 + t * .5), a = i * 2.4 + t * .3, r = (1 - s) * 120;
    glow(c, TR_THROAT[0] + Math.cos(a) * r, TR_THROAT[1] + Math.sin(a) * r * .6, 10, '#FFFFFF', .7 * Math.sin(s * Math.PI) * lw, 'lighter');
  }
  // sheetal: the moonlight cools everything; frost sparkles round them
  const sc = seg(t, TL.sheetal - .3, TL.sheetal + 1.2);
  if (sc > 0) { glow(c, TR_BABY[0], TR_BABY[1], 520, '#BFD4FF', .25 * sc, 'screen'); for (let i = 0; i < 24; i++) twinkle(c, TR_BABY[0] + (hash(i) - .5) * 480, TR_BABY[1] + (hash(i + 5) - .5) * 420, 10 + hash(i + 1) * 10, sc * Math.pow(.5 + .5 * Math.sin(t * 3 + i * 2.2), 6), '#EEF4FF'); }
} });

// ---------- 12. wide: mother and child by the river ----------
SHOTS.push({ a: TL.wide, b: TL.dev + .5, xf: .5, draw(c, u, t) {
  cam(c, 540, 1150, lerp(1.2, 1.08, seg(t, TL.wide, TL.dev)));
  bank(c, t, { devi: { eyes: 'down', mouth: 'smile', baby: 'calm', blink: blinkAt(t, [59.5]) } });
  glow(c, TR_BABY[0] - 20, TR_BABY[1] + 40, 180, '#F4F8FF', .15, 'lighter');
  petals(c, t, TL.wide, 10, .8);
} });

// ---------- 13. her devotees on the ghat; her face over the river; their pain lifted ----------
function devotees(c, t, sky) {
  ptDraw(c, L.river(false)); moonlight(c, t);
  if (sky > 0) {   // her face in the sky over the river
    c.save(); c.globalAlpha = sky * .32; c.globalCompositeOperation = 'screen'; c.filter = 'blur(2px)';
    c.translate(540, 560); c.scale(2.3, 2.3); c.translate(-TR_FACE[0], -TR_FACE[1]);
    ptDraw(c, L.head(true, 'down', 'smile')); c.restore();
    glow(c, 540, 560, 600, '#9AB4F0', .15 * sky, 'screen');
  }
  ptDraw(c, L.dev()); lamps(c, t);
  const pain = seg(t, TL.dev + 4, TL.dev + 7) * (1 - seg(t, TL.door - .3, TL.door + 1.2)), lift = seg(t, TL.door - .2, TL.door + .6);
  [[300, 1300], [560, 1390], [790, 1310]].forEach(([x, y], i) => {
    if (pain > 0) smoke(c, t, x, y, { n: 10, rise: 360, r: 34, w: 60, rate: .3, seed: i * 5, k: pain, green: false, col: '#020104' });
    if (lift > 0) for (let j = 0; j < 14; j++) { const s = frac(j / 14 + (t - TL.door) * .25), px = x + (hash(j + i * 9) - .5) * 80 + Math.sin(s * 5 + j) * 20, py = y - s * 700; glow(c, px, py, 14, '#FFF2C8', .8 * Math.sin(s * Math.PI) * lift, 'lighter'); }
  });
  petals(c, t, TL.karuna - .5, 18, .9);
  fireflies(c, t, 10, [60, 1000, 1020, 1500], .7);
}
SHOTS.push({ a: TL.dev, b: TL.maa + .4, xf: .5, draw(c, u, t) {
  cam(c, 540, lerp(1420, 1380, seg(t, TL.dev, TL.maa)), lerp(1.45, 1.35, seg(t, TL.dev, TL.maa)));
  devotees(c, t, 0);
} });
SHOTS.push({ a: TL.maa, b: TL.wide2 + .5, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.maa, TL.door + 1));
  cam(c, 540, lerp(1150, 980, k), lerp(1.1, 1, k));
  devotees(c, t, easeOut(seg(t, TL.maa + .3, TL.maa + 2.5)));
} });

// ---------- 14. to her, even Mahadev is a child ----------
SHOTS.push({ a: TL.wide2, b: TL.darshan + .5, xf: .5, draw(c, u, t) {
  const push = easeIO(seg(t, TL.shiv - .2, TL.darshan + .4));
  cam(c, lerp(540, TR_BABY[0] - 30, push), lerp(1080, TR_BABY[1] - 20, push), lerp(1, 1.9, push));
  ptDraw(c, L.river()); moonlight(c, t);
  const g = easeOut(seg(t, TL.mahadev - .6, TL.mahadev + .6)) * (1 - seg(t, TL.shiv, TL.shiv + 1));
  if (g > 0) {   // vast Mahadev rising behind her in the sky
    c.save(); c.globalAlpha = g * .42; c.globalCompositeOperation = 'screen';
    c.translate(540, 1500 - g * 140); c.scale(1.9, 1.9); c.translate(-540, -1420); ptDraw(c, L.shiva()); c.restore();
    glow(c, 540, 700, 700, '#9AB4F0', .2 * g, 'screen');
  }
  halo(c, t); devi(c, { eyes: 'down', mouth: 'smile', baby: 'calm', blink: blinkAt(t, [85.2]) });
  lamps(c, t); fireflies(c, t, 14);
  if (t > TL.shiv) glow(c, ...TR_BABY, 160, '#F4F8FF', .35 * Math.sin(Math.PI * seg(t, TL.shiv, TL.darshan + .5)), 'lighter');
} });

// ---------- 15–16. darshan: Tara and the child, जय माँ तारा round them ----------
SHOTS.push({ a: TL.darshan, b: TL.card + .5, xf: .6, draw(c, u, t) {
  const k = easeIO(seg(t, TL.darshan, TL.jai));
  cam(c, 540, lerp(1150, 1120, k), lerp(1.05, 1.18, k));
  bank(c, t, { devi: { eyes: t > 97 ? 'front' : 'down', mouth: 'smile', baby: 'calm', blink: blinkAt(t, [101.3]) } });
  const ring = easeOut(seg(t, TL.darshan + 1, TL.darshan + 4));
  [[300, 300, .6, 30], [380, 370, .45, 28]].forEach(([rx, ry, a, size], i) =>
    nameRing(c, TR_FACE[0], TR_FACE[1] + 120, rx * lerp(.6, 1, ring), ry * lerp(.6, 1, ring), -Math.PI * 1.1, Math.PI * .1, 'जय माँ तारा', { size, a: a * ring, gap: 46, rot: (i % 2 ? -1 : 1) * .05 * t, ph: t * 2, seed: i * 3, shimmer: .45, glow: 'rgba(255,220,160,.85)', col: '#FFF6E2' }));
  petals(c, t, TL.darshan, 14, .9);
} });
POST.push((c, t) => {   // "Jai Maa Tara"
  const a = seg(t, TL.jai - .1, TL.jai + .5) * (1 - seg(t, TL.card, TL.card + .4)); if (a <= 0) return;
  glow(c, 540, 560, 420, '#000000', .55 * a, 'source-over');
  text(c, 'जय माँ तारा', 540, 500, '64px "Tiro Devanagari Sanskrit"', '#FFF0D0', { alpha: a, glow: ['rgba(255,200,120,.8)', 20] });
  text(c, 'Jai Maa Tara', 540, 600, '700 88px Cinzel', '#F4C46A', { pop: t - TL.jai, glow: ['rgba(255,190,90,.9)', 26] });
});

// ---------- 17. the card: follow both ----------
SHOTS.push({ a: TL.card, b: TL.end, xf: .5, draw(c, u, t) {
  c.save(); c.filter = 'blur(6px) brightness(.45)'; cam(c, 540, 1250, 1.1); bank(c, t, { devi: { eyes: 'front', mouth: 'smile', baby: 'calm' } }); c.restore();
  c.fillStyle = 'rgba(6,8,20,.45)'; c.fillRect(0, 0, W, H);
  const p = s => t - TL.card - s;
  text(c, 'जय माँ तारा', 540, 520, '52px "Tiro Devanagari Sanskrit"', '#F4C46A', { pop: p(.1) });
  text(c, 'Follow both', 540, 640, '700 76px Cinzel', '#FFF3DC', { pop: p(.3), glow: ['rgba(255,200,120,.6)', 18] });
  const card = (y, role, handle, s) => {
    const k = popK(p(s)); if (k <= .01) return;
    c.save(); c.translate(540, y); c.scale(k, k);
    c.fillStyle = 'rgba(255,246,226,.1)'; c.strokeStyle = 'rgba(244,196,106,.75)'; c.lineWidth = 3; c.beginPath(); c.roundRect(-430, -95, 860, 190, 36); c.fill(); c.stroke();
    c.restore();
    text(c, role, 540, y - 38, '500 36px Poppins', '#E8D8B8', { pop: p(s) });
    text(c, handle, 540, y + 28, '700 50px Poppins', '#FFFFFF', { pop: p(s), maxW: 800 });
  };
  card(860, 'Voice & story', '@shagunshrotriyaparashar_', .6);
  card(1110, 'Art & animation', '@therishikatha', .85);
  text(c, 'Save it · Share it with your Maa', 540, 1330, '500 38px Poppins', '#F4C46A', { pop: p(1.2) });
} });

// ---------- the hook line and the Tarapith tag ----------
POST.push((c, t) => {
  const a = 1 - seg(t, 5.5, 6.2); if (a <= 0) return;
  glow(c, 540, 560, 460, '#000000', .5 * a, 'source-over');
  const line = (y, parts, size) => {
    c.save(); c.font = `700 ${size}px Cinzel`; c.textBaseline = 'middle'; const tw = parts.reduce((s, [w]) => s + c.measureText(w).width, 0); let x = 540 - tw / 2;
    for (const [w, gold] of parts) { c.globalAlpha = a; c.shadowColor = 'rgba(5,4,12,.95)'; c.shadowBlur = 24; c.fillStyle = gold ? '#F4C46A' : '#FFF3DC'; c.fillText(w, x, y); x += c.measureText(w).width; }
    c.restore();
  };
  line(520, [['When ', 0], ['SHIVA', 1], [' drank the poison,', 0]], 54);
  line(604, [['who saved ', 0], ['HIM', 1], ['?', 0]], 72);
});
POST.push((c, t) => {
  const a = seg(t, TL.river + .8, TL.river + 1.6) * (1 - seg(t, TL.sea - 1, TL.sea - .2)); if (a <= 0) return;
  text(c, 'As worshipped at Tarapith, Bengal', 540, 560, 'italic 42px Marcellus', '#F2E2C0', { alpha: a, glow: ['rgba(0,0,0,.9)', 18] });
});

// ---------- subtitles: the VO in Roman Hindi ----------
Object.assign(CAP, { font: 'Poppins', weight: 600, size: 50, y: 1440, maxW: 900, lit: '#FFF6E6', gold: '#F4C46A', dim: .4 });
const LO = 1440, HI = 540;
[
  [-.4, 2.55, 'Ye kahani hai *Maa Tara* ki.'],
  [2.6, 6.3, 'Ye kahani hai *karuna* ki, | *vatsalya* ki,'],
  [6.3, 11.9, 'ki kaise jab ek Maa | apne shishu ki peeda dekhti hai,'],
  [11.9, 14.6, 'to apni karuna se | usko sheetal kar deti hai.'],
  [14.7, 18.0, '*Bhagwan Shiv* ne jab | jan-kalyan ke liye'],
  [18.0, 20.05, '*halahal* vish ko | dharan kiya,'],
  [20.05, 23.25, 'to vish unke gale mein | jalan paida karne laga.'],
  [23.25, 25.9, 'Dheere dheere unke poore | shareer mein failne laga.'],
  [25.9, 28.35, '*Maa Bhagwati* se | ye na dekha gaya.'],
  [28.35, 31.85, '*Maa Bhagwati* ne | *Maa Tara* ka roop dharan kiya,'],
  [31.85, 36.25, 'aur *Maa Tara* ne | *Bhagwan Shiv* ko | apni god mein bithaya,', HI],
  [36.25, 40.35, 'aur unko devon ke dev | na maante hue,'],
  [40.35, 43.1, 'unko ek *shishu* maana, | ek *baalak* maana,'],
  [43.1, 48.2, 'aur apne shishu ko | apni god mein bitha ke | apna stanpaan karaya.'],
  [48.2, 50.95, 'Us stanpaan mein jo | doodh upalabdh hua,'],
  [50.95, 53.65, 'usne *Bhagwan Shiv* ke | vish ko kaata,'],
  [53.65, 57.0, 'usne *Bhagwan Shiv* ko | *sheetalta* pradaan kari.'],
  [57.0, 58.75, 'To ye Maa ki *karuna* hai,', HI],
  [58.75, 62.3, 'ye *Maa Tara* ka apne | shishu ke liye prem hai,', HI],
  [62.3, 65.8, 'ki jab bhi mera | koi bhi shishu,', HI],
  [65.8, 67.75, 'mera koi bhi baalak,', HI],
  [67.75, 71.85, 'mera koi bhi sevak | kasht mein hoga,', HI],
  [71.85, 77.6, 'to main Maa samaan hi | uske saare kashton ko | door karungi.'],
  [77.6, 80.7, 'Mere sevak ko jo | *karuna* pahunchegi,'],
  [80.7, 82.55, 'vo hi unka | jan-kalyan karegi.'],
  [82.55, 87.45, 'To Maa jab Maa roop | mein hoti hai, to vo | ye bhed nahi karti', HI],
  [87.45, 90.55, 'ki saamne devon ke dev | *Mahadev* hain,', HI],
  [90.55, 92.6, 'ki saamne *Shiv* hain.', HI],
  [92.6, 95.55, 'Woh unki *karuna* aur | unka *vatsalya*,', HI],
  [95.55, 99.65, 'apne har ek shishya ko, | apne har ek sevak ko,', HI],
  [99.65, 102.55, 'apne har ek baalak ko | aisa hi dikhati hai', HI],
  [102.55, 104.2, 'ki ye mera *shishu* hai,', HI],
  [104.2, 106.5, 'aur mujhe iske saare | kashton ko har lena hai.', HI],
].forEach(([a, b, txt, y]) => say(a, b, txt, { y: y ?? LO, lead: .1 }));
// a soft dark scrim under each subtitle
POST.push((c, t) => {
  for (const k of CAPTIONS) {
    const a = Math.min(seg(t, k.a, k.a + .2), 1 - seg(t, k.b - .2, k.b)); if (a <= 0 || t < k.a || t > k.b) continue;
    c.save(); c.translate(540, k.y); c.scale(1, .2); glow(c, 0, 0, 560, '#000000', .55 * a, 'source-over'); c.restore();
  }
});

LOOK.bloom = .22; LOOK.vignette = .5; LOOK.grain = .045;
