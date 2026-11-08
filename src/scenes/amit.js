// amit.js: "Amit roop pragate": Ram comes home and meets every one of Ayodhya at once (Painted, ~71 s; STORYBOARD.md).
// A collab: @lame_batman's (Suryakant Sharma) Hindi voiceover, our picture. Ramcharitmanas, Uttar Kanda 5–6.
// Shots are cut on the voice (TL: word times from whisper on the cleaned VO); subtitles are the VO in Roman Hindi.
// Most shots share one world, the meadow outside Ayodhya's gate (square()): the crowd, the boy at the back, the forms.
(() => {
const easeInOut = ease;
const TL = {
  pushpak: 7.9, sita: 9.45, laksh: 9.95, vanar: 10.75,
  city: 12.05, spot: 13.45,
  tulsi: 14.72,
  land: 16.45, touch: 18.1,
  faces: 21.85, pop1: 24.65, pop2: 25.15, pop3: 25.6,
  wide: 26.4, crowd: 29.25, boySad: 32.4,
  eyes: 33.75, find: 35.3, smile: 36.35, glow: 37.9, many: 40.3, mile: 42.55,
  tulsi2: 43.55,
  verse2: 44.55, k2: 46.55, k3: 48.35,
  boy: 50.15, kneel: 50.7, hug: 52.4,
  rise: 54.35,
  royal: 59.65, out: 62.9, poori: 63.3,
  jai: 64.65,
  card: 66.95, end: 71.6,
};
const GOLD = '#F5C542';

// ---------- subtitles: the VO in Roman Hindi (Bangers), *names* in gold, | breaks a line ----------
const SUBS = [
  [1.3, 3.55, 'Chaudah varshon ka | *vanvaas* poora hua.'],
  [3.55, 5.45, '*Raavan* par vijay ke baad'],
  [5.45, 7.85, 'ab *Prabhu Shri Ram* | wapas *Ayodhya* laut rahe hain,'],
  [7.9, 9.4, '*Pushpak* viman mein,'],
  [9.4, 12.0, '*Mata Sita*, *Lakshman* | aur *vanar sena* ke saath.'],
  [12.05, 14.7, 'Poori *Ayodhya* ko | bas isi din ka intezaar tha.'],
  [14.72, 16.4, '*Baba Tulsi* likhte hain:'],
  [16.45, 19.15, '"Prabhu biloki | harashe purabasi,"', 'verse'],
  [19.15, 21.8, '"Janit biyog | bipati sab naasi."', 'verse'],
  [21.85, 24.2, '*Prabhu* ko dekhte hi'],
  [24.2, 26.35, 'logon ke saare dukh | jaise mit gaye.'],
  [26.4, 29.2, 'Lekin yahan ek aur | *advitiya* ghatna hoti hai.'],
  [29.25, 31.3, '*Ayodhya* ke bacche, | nar-nari,'],
  [31.3, 33.7, 'sab apne *Isht* se | milne ke liye aatur the.'],
  [33.75, 35.25, 'Aur kya aap jaante hain?'],
  [35.25, 37.4, '*Bhagwan* ne kisi ko | niraash nahi kiya.'],
  [37.45, 39.75, 'Ve *sarvavyapi* | *parmatma*'],
  [39.75, 42.35, 'apne *anginat roopon* mein | prakat hue'],
  [42.35, 43.5, 'aur sabse mile.'],
  [43.55, 44.5, '*Baba* ne likha:'],
  [44.55, 47.25, '"Amit roop pragate | tehi kaala,"', 'verse'],
  [47.25, 50.1, '"Jatha jog mile | sabahi kripala."', 'verse'],
  [50.15, 51.95, 'Yaani us din | har kisi ko'],
  [51.95, 54.3, 'apne *Ram* se milne ka | avsar mila.'],
  [54.35, 57.1, 'Aur mere liye is prasang ki | sabse khoobsurat baat'],
  [57.1, 59.6, 'yahi hai, ye baat | siddh karti hai ki'],
  [59.65, 62.9, 'us din *Ram Bhagwan* | sirf royal family ke | nahi the,'],
  [62.9, 64.6, 'poori *Ayodhya* ke *Ram* the.'],
];
const _mc = document.createElement('canvas').getContext('2d');
function subLine(line, y, size, age, color = PAL.cream, verse = false) {
  // split into runs: *gold* or plain; measure with the caption face, lay the runs out centred, one letter() per run
  const runs = []; line.split(/(\*[^*]+\*)/).forEach(r => { if (r) runs.push(r.startsWith('*') ? [r.slice(1, -1), GOLD] : [r, verse ? GOLD : color]); });
  _mc.font = `${size}px ${LETTER_FONT}`;
  const ws = runs.map(([s]) => _mc.measureText(s.toUpperCase()).width), tw = ws.reduce((a, b) => a + b, 0), k = Math.min(1, 880 / tw);
  let x = 500 - tw * k / 2;
  runs.forEach(([s, c], i) => {
    const w = ws[i] * k;
    letter(s.toUpperCase(), x + w / 2, y, size * k, c, { screen: true, pop: age * 5, rot: 0, stroke: PAL.ink, sw: .2, ink: false });
    x += w;
  });
}
function subs(t, o = {}) {
  for (const [a, b, txt, kind] of SUBS) {
    if (t < a - .02 || t > b) continue;
    const lines = txt.split('|').map(s => s.trim()), size = kind === 'verse' ? 70 : 62, lh = size * 1.12, y = (o.y ?? 1395) - (lines.length - 1) * lh / 2;
    lines.forEach((l, i) => subLine(l, y + i * lh, size, Math.max(0, t - a - i * .08), PAL.cream, kind === 'verse'));
  }
}
const pk = (t, d) => Math.max(0, t - d) * 4;
function hook(t) {
  const a = 1 - seg(t, 4.6, 5.0); if (a <= 0) return;
  letter('HOW DID RAM MEET', 500, 500, 82, PAL.cream, { screen: true, stroke: PAL.ink, sw: .2, ink: false, pop: t + 1, alpha: a, rot: -.02, maxW: 860 });
  letter('ALL OF AYODHYA', 500, 600, 104, GOLD, { screen: true, stroke: PAL.ink, sw: .2, ink: false, pop: t + 1, alpha: a, rot: -.02, maxW: 880 });
  letter('AT ONCE?', 500, 700, 82, PAL.cream, { screen: true, stroke: PAL.ink, sw: .2, ink: false, pop: t + 1, alpha: a, rot: -.02, maxW: 860 });
}
const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
const blink = (t, seed = 0) => frac(t * .23 + hash(seed * 3.1)) < .035 ? 'closed' : null;
const SKYC = [AM.skyHi, AM.cloud], GRASS = [AM.meadow, AM.wall], WARM = ['#F2C48E', '#FFE2B0'];

// ================= the meadow outside the gate: one world for most shots =================
// the people: kind, colourway, ground point, size, and the form of Ram that comes to them (side: which side he appears,
// act: 'hug' | 'lift' | 'bless' | 'namaste'); d = the ripple delay from the centre
const SQ = { rx: 540, ry: 1660, ru: 15, h: 880 };
const PEOPLE = [
  // front left trio (E, K)
  { id: 'girl', k: 'girl', v: 0, x: 92, y: 1800, u: 13, side: 1, act: 'lift' },
  { id: 'dadi', k: 'dadi', v: 0, x: 222, y: 1730, u: 13, side: 1, act: 'bless' },
  { id: 'man', k: 'man', v: 0, x: 372, y: 1790, u: 13, side: -1, act: 'hug' },
  // front right
  { id: 'elder', k: 'elder', v: 0, x: 790, y: 1770, u: 13, side: 1, act: 'namaste' },
  { id: 'mom', k: 'mother', v: 0, x: 960, y: 1710, u: 13, side: -1, act: 'hug' },
  // the middle rows behind the centre
  { id: 'm1', k: 'mother', v: 1, x: 118, y: 1330, u: 9.5, side: 1, act: 'namaste' },
  { id: 'bigman', k: 'man', v: 1, x: 362, y: 1350, u: 10.5, side: -1, act: 'hug' },
  { id: 'boy', k: 'boy', v: 0, x: 252, y: 1290, u: 9.5, side: 1, act: 'hug' },
  { id: 'm2', k: 'man', v: 2, x: 726, y: 1330, u: 9.5, side: 1, act: 'hug' },
  { id: 'g2', k: 'girl', v: 1, x: 860, y: 1360, u: 9.5, side: -1, act: 'lift' },
  { id: 'm3', k: 'mother', v: 2, x: 980, y: 1320, u: 9.5, side: -1, act: 'namaste' },
  { id: 'b2', k: 'boy', v: 1, x: 520, y: 1300, u: 9.5, side: -1, act: 'lift' },
];
PEOPLE.forEach(p => { p.d = Math.hypot(p.x - SQ.rx, (p.y - SQ.ry) * 1.6) / 1400 * 1.2; });
PEOPLE.find(p => p.id === 'boy').d = TL.kneel - TL.many;   // the boy at the back gets his own Ram last (L)
// the back rows: cheap figures, every third gets a far Ram when the forms appear
const BACK = [];
for (let r = 0; r < 4; r++) for (let i = 0; i < 13; i++) {
  const x = -60 + i * 100 + (r % 2) * 50 + 20 * hash(i + r * 13), y = SQ.h + 120 + r * 70;
  BACK.push({ x, y, s: 9 + r * 2.4, i: i + r * 13, ram: (i + r) % 3 === 0, d: .25 + Math.abs(x - SQ.rx) / 1400 + (3 - r) * .12 });
}
// the royal family behind Ram: Sita, Lakshman, two queens
const ROYAL = [
  { id: 'sita', x: 420, y: 1500, u: 11 }, { id: 'laksh', x: 664, y: 1505, u: 11 },
  { id: 'q1', x: 470, y: 1440, u: 10 }, { id: 'q2', x: 610, y: 1440, u: 10 },
];
// how far each person's form has come (0..1) at time t
const formK = (t, d) => clamp((t - TL.many - d) / .35);
// where a person's form of Ram stands
const formAt = p => { const ru = p.u * (p.k === 'girl' || p.k === 'boy' ? 1.12 : 1.02); return [p.x - p.side * (p.k === 'girl' || p.k === 'boy' ? 5.6 : 6.8) * p.u, p.y + 2, ru]; };

function poof(x, y, s, age, key) {
  if (age < 0 || age > .6) return;
  const k = age / .6;
  glow(x, y, s * (1 + k), '#FFF0B0', .7 * (1 - k));
  for (let i = 0; i < 7; i++) { const a = i / 7 * TAU, r = s * (.3 + .7 * easeOut(k)); cloudPuff(x + Math.cos(a) * r, y + Math.sin(a) * r * .6, s * .32 * (1 - k * .7), key + i, '#FFF8EA', 255 * (1 - k)); }
  boilSeed(key + 'st');
  for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + .4, r = s * (.6 + .9 * k); paint(starPts(x + Math.cos(a) * r, y + Math.sin(a) * r, s * .14 * (1 - k), .4, 4), { wash: '#FFE27A', ink: null }); }
}

// options for one person at time t: eager before the forms, then the take and the joy
function personO(p, t, o) {
  const toward = Math.sign(SQ.rx - p.x) || 1, fk = formK(t, p.d), tp = TL.many + p.d, kid = p.k === 'girl' || p.k === 'boy';
  const q = { boilKey: 'p' + p.id, seed: p.x };
  if (o.cheer) {   // N / O: hands up, cheering
    const c = o.cheer;
    if (p.k === 'girl' || p.k === 'boy') Object.assign(q, { aL: lerp(-1.3, 1.1, c), aR: lerp(-1.3, 1.2, c), eyes: 'happy', mouth: 'grin', dy: -Math.abs(Math.sin(t * 7 + p.x)) * 1.4 * c });
    else Object.assign(q, { handL: [lerp(-3.2, -4.6, c), lerp(-9, -24, c)], handR: [lerp(3.2, 4.6, c), lerp(-9, -24, c)], eyes: 'happy', mouth: 'grin' });
    return q;
  }
  if (fk <= 0) {
    const eager = clamp((t - TL.wide) / 1.2);
    q.hx = toward * .55; q.lookX = toward * .8; q.eyes = blink(t, p.x) || (p.k === 'dadi' ? 'normal' : 'wide'); q.mouth = eager > .3 ? (kid ? 'O' : 'smile') : 'smile';
    if (kid) q.dy = -Math.max(0, Math.sin((t + p.x * .01) * 7)) * 1.6 * eager;
    if (p.id === 'boy') {   // at the back, behind the big man: hops, can't see, gives up
      const sad = clamp((t - TL.boySad) / .5);
      q.dy = -Math.max(0, Math.sin(t * 6.5)) * 2.2 * (1 - sad) * eager; q.eyes = sad > .5 ? 'sad' : 'wide'; q.mouth = sad > .5 ? 'wobble' : 'O'; q.lookY = -.4 * (1 - sad);
      if (t > TL.find) { q.eyes = 'sad'; q.mouth = 'wobble'; q.dy = 0; }
    }
    if (!kid && p.k !== 'dadi' && eager > .5) q[toward > 0 ? 'handR' : 'handL'] = [toward * 4.4, -17 - 4 * Math.max(0, Math.sin(t * 3 + p.x))];
    if (p.k === 'dadi' || p.k === 'mother') q.pray = eager * .9;
    return q;
  }
  // the form has come: a take, then love
  const age = t - tp;
  q.hx = -p.side * .6; q.lookX = -p.side;
  if (age < .5) { q.eyes = 'wide'; q.mouth = 'O'; q.sq = -.12 * Math.sin(age / .5 * Math.PI); }
  else { q.eyes = p.k === 'dadi' ? 'closed' : 'happy'; q.mouth = 'grin'; q.blush = .7; q.emote = 'hearts'; q.emoteK = clamp((age - .5) * 3); q.emoteAge = age; }
  const lean = clamp((age - .4) / .5);
  if (!kid) q.lean = -p.side * 1.6 * lean;
  if (p.act === 'namaste') q.pray = 1;
  if (p.act === 'lift') { const up = clamp((age - .5) / .6); q.dy = -easeOut(up) * 7; q.aL = 1.2 * up - 1.3 * (1 - up); q.aR = 1.2 * up - 1.3 * (1 - up); }
  if (p.act === 'bless' && age > .7) q.handR = [-p.side * -5.2 * 0 + 5.4 * -p.side, -21.5 + Math.sin(t * 3) * .3];
  if (kid && p.act === 'hug') { q.aL = -.2; q.aR = -.2; }
  return q;
}
function drawPerson(p, t, o) { folk(p.x, p.y, p.u, p.k, { v: p.v, ...personO(p, t, o) }); }
// a person's form of Ram
function drawForm(p, t, o) {
  const k = formK(t, p.d); if (k <= 0 && !o.cheer) return;
  const [x, y, ru] = formAt(p), age = t - TL.many - p.d, kid = p.k === 'girl' || p.k === 'boy';
  const s = p.side, q = { boilKey: 'f' + p.id, seed: x + 3, kodanda: false, mouth: 'smile', eyes: blink(t, x) || 'happy', hx: s * .5, lookX: s };
  const toP = (wx, wy) => [(wx - x) / ru, (wy - y) / ru];
  if (p.act === 'hug' && !kid) { const l = clamp((age - .3) / .5); q.lean = s * 1.8 * l; q[s > 0 ? 'handR' : 'handL'] = toP(p.x - s * 2.4 * p.u, p.y - 16.5 * p.u); q.eyes = 'closed'; }
  if (p.act === 'hug' && kid) { q.bow = .45; q[s > 0 ? 'handR' : 'handL'] = toP(p.x - s * 1.6 * p.u * .82, p.y - 8.6 * p.u * .82); q[s > 0 ? 'handL' : 'handR'] = [s * 1.2, -13]; q.eyes = 'closed'; }
  if (p.act === 'lift') { const up = easeOut(clamp((age - .5) / .6)); q.handL = toP(p.x - 2.2 * p.u * .82, p.y - 6.6 * p.u * .82 - up * 7 * p.u * .82); q.handR = toP(p.x + 2.2 * p.u * .82, p.y - 6.6 * p.u * .82 - up * 7 * p.u * .82); q.mouth = 'grin'; }
  if (p.act === 'namaste') q.pray = 1;
  if (p.act === 'bless') { q.bow = clamp((age - .4) / .5) * .5; q.pray = 1; q.eyes = 'closed'; }
  if (o.cheer) { q.pray = 0; q.handL = undefined; q.handR = [s * 4.4, -22]; q.lean = 0; q.bow = 0; q.eyes = 'happy'; }
  const sc = .55 + .45 * backOut(k);
  push(); translate(x, y); scale(sc); translate(-x, -y);
  glow(x, y - 14 * ru, 16 * ru, '#FFE08A', .35 * k);
  ram(x, y, ru, q);
  pop();
  poof(x, y - 13 * ru, 7 * ru, age, 'pf' + p.id);
}
// o: { cx, z (the camera, for culling), rams (draw the forms), centre (draw the centre Ram), ram (his options), royal,
//      cheer 0..1, glows 0..1 (lights in the city), pushpak: { y, k } (D), noPeople }
function square(t, o = {}) {
  const vx0 = (o.cx ?? 540) - 600 / (o.z ?? 1), vx1 = (o.cx ?? 540) + 600 / (o.z ?? 1), vy0 = (o.cy ?? 960) - 1050 / (o.z ?? 1);
  ayodhyaSet(t, 'sq', { h: SQ.h, warm: o.warm ?? 0 });
  if (o.glows) for (let i = 0; i < 9; i++) { const gx = -80 + i * 150 + 40 * hash(i * 2.7), k = clamp((o.glows - i * .06) * 3); if (k > 0) { glow(gx, SQ.h - 330 + 80 * hash(i), 120 * k, '#FFE08A', .55 * k); } }
  // the back rows
  for (const b of BACK) {
    if (b.x < vx0 - 40 || b.x > vx1 + 40) continue;
    const fk = o.rams ? clamp((t - TL.many - b.d) / .35) : 0;
    farFolk(b.x, b.y, b.s, b.i, { cheer: o.cheer ?? (fk > 0 ? .6 : .25 * (Math.sin(t * 3 + b.i) > .6)), bob: 1, key: 'bk' });
    if (b.ram && fk > 0) { miniRam(b.x + b.s * 1.9, b.y + 1, b.s, { k: fk, i: b.i, key: 'bk', arms: .6 }); poof(b.x + b.s * 1.9, b.y - b.s * 3, b.s * 3, t - TL.many - b.d, 'bp' + b.i); }
  }
  // the centre Ram's light
  if (o.centre !== false) glow(SQ.rx, SQ.ry - 15 * SQ.ru, (o.ramGlow ?? .3) * 900, '#FFE08A', .35 + .4 * (o.ramGlow ?? 0));
  // everyone, sorted by ground y
  const items = [];
  if (!o.noPeople) for (const p of PEOPLE) {
    if (p.y < vy0 - 50) continue;
    const [fx] = formAt(p), lo = Math.min(p.x, fx) - 8 * p.u, hi = Math.max(p.x, fx) + 8 * p.u;
    if (hi < vx0 || lo > vx1) continue;
    items.push([p.y, () => drawPerson(p, t, o)]);
    if (o.rams) items.push([p.y + (p.act === 'lift' ? -1 : 1), () => drawForm(p, t, o)]);
  }
  if (o.royal) for (const r of ROYAL) {
    if (r.x + 6 * r.u < vx0 || r.x - 6 * r.u > vx1) continue;
    const q = { boilKey: 'r' + r.id, seed: r.x, eyes: blink(t, r.x) || 'happy', mouth: 'smile', hx: Math.sign(SQ.rx - r.x) * .4, lookX: Math.sign(SQ.rx - r.x) * .6, ...(o.cheer ? { mouth: 'grin' } : {}) };
    items.push([r.y, () => {
      if (r.id === 'sita') parvati(r.x, r.y, r.u * 29 / 25.5 * .95, { pal: SITA_PAL, ...SITA_SKIN, ...q });
      else if (r.id === 'laksh') lakshman(r.x, r.y, r.u, { ...q, kodanda: true });
      else folk(r.x, r.y, r.u, 'queen', { v: r.id === 'q1' ? 0 : 1, ...q, eyes: q.eyes === 'happy' ? 'closed' : q.eyes });
    }]);
  }
  if (o.centre !== false && !o.pushpak) items.push([SQ.ry, () => ram(SQ.rx, SQ.ry, SQ.ru, { boilKey: 'cram', kodanda: true, ...(o.ram || {}) })]);
  items.sort((a, b) => a[0] - b[0]).forEach(([, f]) => f());
  if (o.pushpak) {   // D: the vimana coming down at the centre, the four inside
    const { y, k } = o.pushpak, s = 25, ru = s * .42, x = SQ.rx;
    pushpak(x, y, s, { part: 'back', key: 'dpp' });
    hanuman(x - 6 * s, y, ru, { boilKey: 'dh', gada: 0, eyes: 'happy', mouth: 'grin', handR: [4.4, -24], tail: 'curl' });
    parvati(x - 2.6 * s, y, ru * 29 / 25.5 * .95, { boilKey: 'ds', pal: SITA_PAL, ...SITA_SKIN, eyes: 'happy', mouth: 'smile' });
    ram(x + .6 * s, y, ru, { boilKey: 'dr', kodanda: false, pray: 1, eyes: k > .9 ? 'happy' : 'normal', mouth: 'smile' });
    lakshman(x + 4.4 * s, y, ru, { boilKey: 'dl', eyes: 'happy', mouth: 'grin', handR: [4.6, -22] });
    pushpak(x, y, s, { part: 'front', key: 'dpp', glow: 1 });
  }
}

// ================= A · on the Pushpak: close on Ram, pulling back to the whole vimana =================
const VAN = { skin: '#B8864A', skinDk: '#8A5E2E', skinLt: '#D8A86A', fur: '#B8864A', furDk: '#8A5E2E', furLt: '#D8A86A', dhoti: '#2E6A5A', dhotiDk: '#1E4A3E', dhotiLt: '#4E8A7A' };
function vanara(x, y, u, o = {}) { return hanuman(x, y, u, { gada: 0, crown: false, tail: 'curl', ...o, pal: { ...HNM, ...VAN, ...(o.pal || {}) } }); }
function shotSky(t, lt, dur) {
  // the camera: close on Ram's face (frame 0), easing back to the whole vimana by the names
  const s = 30, X = 540, Y = 1180 + Math.sin(t * 1.4) * 10, ru = s * .42;
  const pull = easeInOut(seg(t, 3.2, TL.pushpak + .9));
  const z = lerp(3.1, 1.22, pull), cy = lerp(Y - 23.2 * ru, Y - 8.6 * s, pull), cx = lerp(X + .6 * s, X + 1.2 * s, pull);
  camBegin(cx, cy, z);
  dawnSky(t, 'a', { drift: 90, cloudY: 700, sunX: 820, sunY: 900 });
  pushpak(X, Y, s, { part: 'back', key: 'app', bob: Math.sin(t * 2) });
  // the riders: Hanuman, Sita, Ram, Lakshman (names pop their reactions)
  const sitaK = t > TL.sita + .1, lakK = t > TL.laksh + .1, vanK = t > TL.vanar;
  hanuman(X - 6 * s, Y, ru, { boilKey: 'ah', gada: 0, tail: 'curl', eyes: vanK ? 'happy' : 'normal', mouth: vanK ? 'grin' : 'smile', hx: .3, handR: vanK ? [4.6, -24 - 2 * Math.sin(t * 9)] : undefined });
  parvati(X - 2.6 * s, Y, ru * 29 / 25.5 * .95, { boilKey: 'as', pal: SITA_PAL, ...SITA_SKIN, ...emotions(t, [[0, 'neutral'], [TL.sita + .1, 'love']], { take: .5 }), eyes: sitaK ? 'happy' : blink(t, 2) || 'normal', mouth: 'smile', col: SITA_SKIN.col, dk: SITA_SKIN.dk, lt: SITA_SKIN.lt, emote: sitaK ? 'heart' : undefined, emoteK: clamp((t - TL.sita - .1) * 3), emoteAge: t - TL.sita });
  // Ram: wind in his face, looking ahead; on "Ayodhya" his eyes fill, a smile
  const home = clamp((t - 6.6) / .5), fill = t > 6.6 && t < TL.pushpak + .6;
  ram(X + .6 * s, Y, ru, { boilKey: 'ar', kodanda: true, eyes: home > .5 ? (fill ? 'teary' : 'happy') : blink(t, 1) || 'normal', lookX: .6 * (1 - home), lookY: -.1, mouth: home > .5 ? 'grin' : 'smile', hx: .25 * (1 - home), htilt: Math.sin(t * 1.3) * .03, pray: home, blush: .4 * home });
  lakshman(X + 4.4 * s, Y, ru, { boilKey: 'al', eyes: lakK ? 'happy' : blink(t, 3) || 'normal', mouth: lakK ? 'grin' : 'smile', handR: lakK ? [4.6, -22 - 1.5 * Math.sin(t * 8)] : undefined, hx: -.2 });
  pushpak(X, Y, s, { part: 'front', key: 'app', bob: Math.sin(t * 2) });
  // the vanara host: pop up on the roof and the swan's neck on "vanar sena"
  if (vanK) {
    const v = d => backOut(clamp((t - TL.vanar - d) / .35));
    const v1 = v(0), v2 = v(.18), v3 = v(.32);
    if (v1 > 0) vanara(X - 7.2 * s, Y - 19.3 * s + (1 - v1) * 2 * s, ru * .8, { boilKey: 'v1', eyes: 'happy', mouth: 'grin', handL: [-4.6, -24 - Math.sin(t * 8)], handR: [4.6, -24 + Math.sin(t * 8)], noShadow: true });
    if (v2 > 0) vanara(X + 7.2 * s, Y - 19.3 * s + (1 - v2) * 2 * s, ru * .75, { boilKey: 'v2', eyes: 'happy', mouth: 'grin', handR: [4.6, -24], noShadow: true, pal: { dhoti: '#C8323A', dhotiDk: '#962338', dhotiLt: '#E8697A' } });
    if (v3 > 0) vanara(X + 12.6 * s, Y - 9 * s + (1 - v3) * 1.5 * s, ru * .7, { boilKey: 'v3', eyes: 'happy', mouth: 'grin', handL: [-4.4, -20], noShadow: true, pal: { dhoti: '#6E3E9E', dhotiDk: '#4E2A78', dhotiLt: '#9A6AC8' } });
  }
  camEnd();
  hook(t); subs(t);
  wipeOut(lt, dur, SKYC);
}

// ================= B · Ayodhya waits: the walls, people looking at the sky; a girl spots the vimana =================
function shotCity(t, lt, dur) {
  const tilt = easeInOut(seg(t, TL.spot + .35, TL.tulsi - .15));
  camBegin(540, lerp(1390, 820, tilt), 1.5 + lt * .01);
  ayodhyaSet(t, 'b', { h: 1250 });
  // the vimana: a gold glint high in the sky (top right), growing
  const gk = clamp((t - TL.city - .3) / 1.2);
  if (gk > 0) { const gx = 760 - 30 * gk, gy = 600 + 20 * gk; glow(gx, gy, 90 + 40 * gk, '#FFE6A0', .6 * gk); pushpak(gx, gy, 3.2 + gk * 1.2, { key: 'bpp', glow: 0, clouds: false }); }
  // people on the wall (far) and on the meadow
  for (let i = 0; i < 12; i++) farFolk(40 + i * 90, 1250 - 232, 8, i + 40, { cheer: t > TL.spot + .4 ? .8 : 0, key: 'bw' });
  for (let i = 0; i < 11; i++) farFolk(10 + i * 105 + 30 * hash(i), 1400 + 40 * hash(i * 2.2), 14, i + 60, { cheer: t > TL.spot + .5 ? .9 : 0, bob: t > TL.spot + .5 ? 1 : 0, key: 'bm' });
  const spot = t > TL.spot, look = clamp((t - TL.spot - .2) / .5);
  const crowdO = (i, x) => ({ boilKey: 'bc' + i, seed: x, hx: .5 * look, lookX: .6 * look, lookY: -.8 * look, eyes: look > .5 ? 'wide' : blink(t, x) || 'normal', mouth: look > .5 ? 'O' : 'smile' });
  folk(250, 1790, 13, 'mother', { v: 2, ...crowdO(1, 250) });
  folk(800, 1780, 13, 'elder', { ...crowdO(2, 800) });
  // the girl on her father's shoulders: points up on "isi din"
  const fx = 470, fy = 1820;
  const g = { boilKey: 'bg', seed: 9, sq: spot ? take(t, TL.spot, .8).sq : 0, eyes: spot ? 'wide' : blink(t, 5) || 'normal', mouth: spot ? 'O' : 'smile', aR: spot ? 1.0 + .1 * Math.sin(t * 9) : -1.1, aL: -1.0, lookX: spot ? .8 : 0, lookY: spot ? -.8 : 0, emote: spot ? '!' : undefined, emoteK: clamp((t - TL.spot) * 4), emoteAge: t - TL.spot, noShadow: true };
  folk(fx, fy - 24.2 * 14, 14, 'girl', { v: 1, ...g });
  folk(fx, fy, 14, 'man', { v: 1, ...crowdO(3, fx), handL: [-2.6, -25.5], handR: [2.6, -25.5], hx: .2 * look });
  camEnd();
  subs(t);
  wipeIn(lt, SKYC); wipeOut(lt, dur, WARM);
}

// ================= C / J · Tulsidas writes by a lamp =================
function tulsiRoom(t, lt, dur, which) {
  camBegin(570, 1470, 2.25 + lt * .04);
  boilSeed('trwall');
  paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#5E3442', ink: null });
  paint(ellPts(560, 1350, 600, 560, 30), { fill: '#B0644A', fillOp: 210, bleed: .3, tex: .4, border: .3, ink: null });
  glow(740, 1200, 520, '#FFC070', .55);
  boilSeed('trfloor'); paint(rectPts(-200, 1560, W + 400, 800), { wash: '#6A3E2E', fill: '#4A2A20', fillOp: 50, tex: .5, ink: P1.ink, sw: .9 });
  // the lamp
  boilSeed('trlamp'); paint([[700, 1560], [720, 1500], [780, 1500], [800, 1560]], { wash: '#C88A3A', ink: P1.ink, sw: .8 });
  paint(ellPts(750, 1500, 46, 12, 14), { wash: '#B8762A', ink: P1.ink, sw: .8 });
  const fl = 1 + .1 * Math.sin(t * 13); glow(750, 1470, 140 * fl, '#FFC870', .7);
  paint([[750, 1494], [741, 1474], [750, 1436 - 6 * fl], [759, 1474]], { wash: '#FFE29A', ink: null, curv: .6 });
  const smile = which === 2 || lt > .9;
  tulsidas(470, 1640, 17, { boilKey: 'tds', sit: 1, leaf: 1, eyes: which === 2 ? 'closed' : (lt < .5 ? 'normal' : 'closed'), mouth: smile ? 'smile' : 'flat', lookY: .5, bow: .1 });
  // the written line glows on the leaf and floats up
  const gk = clamp((lt - .5) / .6);
  if (gk > 0) { glow(470, 1440, 160 * gk, '#FFE08A', .6 * gk); for (let i = 0; i < 6; i++) { const a = frac(lt * .5 + i / 6), px = 420 + i * 22 + Math.sin(t * 2 + i) * 14, py = 1430 - a * 260; boilSeed('trsp' + i); paint(starPts(px, py, 7 * (1 - a), .4, 4), { wash: '#FFE27A', ink: null }); } }
  camEnd();
  subs(t);
  if (which === 1) { wipeIn(lt, WARM); wipeOut(lt, dur, SKYC); }
  else { wipeIn(lt, WARM); wipeOut(lt, dur, GRASS); }
}

// ================= D · the Pushpak comes down on the meadow; verse 1 =================
function shotLand(t, lt, dur) {
  const k = easeOut(clamp((t - TL.land) / (TL.touch - TL.land))), bump = t > TL.touch ? spring(t, TL.touch, 6, 9) * 10 : 0;
  const y = lerp(1000, 1560, k) + bump;
  const cheer = clamp((t - TL.touch - .2) / .5);
  camBegin(540, 1270 + shakeXY(t, t > TL.touch && t < TL.touch + .3 ? 6 : 0)[1], 1.12);
  square(t, { pushpak: { y, k }, cheer: cheer > 0 ? cheer : undefined, centre: false, z: 1.12, cy: 1270 });
  if (t > TL.touch) amPetals(t, 'dpet', 18, { k: cheer });
  camEnd();
  rkVerse(['प्रभु बिलोकि हरषे पुरबासी।', 'जनित बियोग बिपति सब नासी॥'], 500, 480, 62, t - TL.land - .3, { stagger: 2.6 });
  subs(t);
  wipeIn(lt, SKYC); wipeOut(lt, dur, GRASS);
}

// ================= E · three faces under sorrow clouds; the clouds pop =================
function shotFaces(t, lt, dur) {
  const pan = easeInOut(seg(t, TL.faces, TL.pop3 + .4));
  camBegin(lerp(200, 250, pan), 1560, 2.15 + lt * .015);
  // their sorrow first: no joy until the cloud goes
  const popT = { girl: TL.pop1, dadi: TL.pop2, man: TL.pop3 };
  square(t, { z: 2.15, cx: 225, cy: 1560, centre: false, rams: false, sorrow: popT });
  for (const p of PEOPLE.slice(0, 3)) {
    const tp = popT[p.id], k = clamp((t - tp + .05) / .7), kid = p.k === 'girl';
    rainCloud(p.x + (kid ? 0 : 10), p.y - (kid ? 17 : 30.5) * p.u, 3.6 * p.u, k, 'rc' + p.id);
  }
  camEnd();
  subs(t);
  wipeIn(lt, GRASS); wipeOut(lt, dur, GRASS);
}

// ================= F + G · the crowd presses in; the boy at the back can't see =================
function shotCrowd(t, lt, dur) {
  // F: high and wide on one Ram and everyone; G: down into the crowd, then over to the boy behind the big man
  const a = easeInOut(seg(t, TL.crowd - .3, TL.crowd + 1.2)), b = easeInOut(seg(t, 31.0, TL.boySad - .2));
  const z = lerp(lerp(.98, 1.35, a), 2.6, b), cx = lerp(lerp(540, 560, a), 280, b), cy = lerp(lerp(1300, 1420, a), 1175, b);
  camBegin(cx, cy, z);
  square(t, { z, cx, cy, ram: { eyes: blink(t, 7) || 'happy', mouth: 'smile', pray: 1 }, royal: true });
  camEnd();
  subs(t);
  wipeIn(lt, GRASS); wipeOut(lt, dur, GRASS);
}

// ================= H + I · Ram's eyes find the boy; then the forms =================
function shotForms(t, lt, dur) {
  // H: close on his face; his eyes travel over the crowd to the boy (screen left, up), a smile. I: pull back as he
  // glows and the forms ripple out across the meadow
  const back = easeInOut(seg(t, TL.glow - .2, TL.many + 1.4));
  const z = lerp(4.0, 1.0, back), cx = lerp(SQ.rx, 540, back), cy = lerp(SQ.ry - 22.4 * SQ.ru, 1330, back);
  camBegin(cx, cy, z);
  const look = clamp((t - TL.find) / .5), sm = clamp((t - TL.smile) / .4);
  const ram = { eyes: blink(t, 11) || (sm > .5 ? 'happy' : 'normal'), lookX: -.9 * look, lookY: -.6 * look, hx: -.35 * look, mouth: sm > .5 ? 'grin' : 'smile', pray: 1 - clamp((t - TL.glow) / .6), blush: .3 * sm,
    emote: sm > 0 && t < TL.glow ? 'spark' : undefined, emoteK: sm, emoteAge: t - TL.smile };
  if (t > TL.glow) Object.assign(ram, { handL: [-4.6, -18.5], handR: [4.6, -18.5], eyes: 'happy', lookX: 0, lookY: 0, hx: 0 });
  const gk = clamp((t - TL.glow) / 2.4);
  square(t, { z, cx, cy, ram, royal: true, rams: true, ramGlow: gk });
  // the burst on "anginat"
  if (t > TL.many - .4 && t < TL.many + .8) { const f = seg(t, TL.many - .4, TL.many) * (1 - seg(t, TL.many, TL.many + .8)); glow(SQ.rx, SQ.ry - 15 * SQ.ru, 1400 * f, '#FFF2C0', .8 * f); }
  camEnd();
  if (t > TL.many - .1 && t < TL.many + .35) flash(.35 * (1 - seg(t, TL.many - .1, TL.many + .35)), '#FFF6DA');
  subs(t);
  wipeIn(lt, GRASS); wipeOut(lt, dur, WARM);
}

// ================= K · verse 2: along the front row (the lift, the blessing, the hug) =================
function shotVerse2(t, lt, dur) {
  const p1 = easeInOut(seg(t, TL.k2 - .5, TL.k2 + .3)), p2 = easeInOut(seg(t, TL.k3 - .5, TL.k3 + .3));
  const cx = lerp(lerp(40, 190, p1), 330, p2), cy = lerp(lerp(1430, 1410, p1), 1420, p2);
  camBegin(cx, cy, 2.05 + lt * .01);
  square(t, { z: 2.05, cx, cy, rams: true, royal: false, centre: false });
  camEnd();
  rkVerse(['अमित रूप प्रगटे तेहि काला।', 'जथा जोग मिले सबहि कृपाला॥'], 500, 480, 62, t - TL.verse2 - .2, { stagger: 2.7 });
  subs(t);
  wipeIn(lt, WARM); wipeOut(lt, dur, GRASS);
}

// ================= L · the boy at the back: his own Ram =================
function shotBoy(t, lt, dur) {
  // the boy and his form, close; he's sad for a beat (the form arrives here, not at TL.many: this is his story)
  const p = PEOPLE.find(q => q.id === 'boy'), [fx] = formAt(p);
  const cx = (p.x + fx) / 2 + 6, cy = p.y - 11.6 * p.u;
  camBegin(cx, cy + Math.sin(lt * .5) * 6, 3.3 - lt * .05);
  // draw the meadow with every form already there, then this pair on top with their own timing
  square(t, { z: 3.3, cx, cy, rams: true, centre: false, skip: 'boy' });
  camEnd();
  subs(t);
  wipeIn(lt, GRASS);
}

// ================= M · rise over the meadow and the walls: a light for every meeting =================
function shotRise(t, lt, dur) {
  const up = easeInOut(seg(t, TL.rise, TL.rise + 3.6));
  const z = lerp(3.09, .96, up), cx = lerp(230.5, 540, up), cy = lerp(1180, 1180, up);
  camBegin(cx, cy, z);
  square(t, { z, cx, cy, rams: true, royal: true, glows: clamp((t - TL.rise - 1.2) / 2.4), warm: .4 * up, ram: { eyes: 'happy', mouth: 'smile', handL: [-4.6, -18.5], handR: [4.6, -18.5] }, ramGlow: 1 });
  amPetals(t, 'mpet', 12, { k: up });
  camEnd();
  subs(t);
  wipeOut(lt, dur, WARM);
}

// ================= N + O · not only the royal family's: everyone's Ram; Jai Shri Ram =================
function shotAll(t, lt, dur) {
  const out = easeInOut(seg(t, TL.out - .3, TL.out + 1.6));
  const z = lerp(2.0, 1.0, out), cx = 540, cy = lerp(SQ.ry - 15 * SQ.ru, 1290, out);
  camBegin(cx, cy, z);
  const cheer = clamp((t - TL.poori) / .6);
  square(t, { z, cx, cy, rams: true, royal: true, cheer: cheer > 0 ? cheer : undefined, warm: .4, glows: 1, ramGlow: 1,
    ram: { eyes: 'happy', mouth: 'grin', handR: [4.6, -24], handL: [-4.4, -16], blush: .3 } });
  amPetals(t, 'npet', 22, { k: .4 + .6 * clamp((t - TL.jai) / .5) });
  camEnd();
  subs(t);
  if (t > TL.jai) {
    const a = 1 - seg(t, TL.card - .25, TL.card);
    letter('JAI SHRI RAM!', 500, 1250, 140, GOLD, { screen: true, stroke: PAL.ink, sw: .2, ink: false, pop: pk(t, TL.jai), rot: -.03, alpha: a, maxW: 900 });
  }
  wipeIn(lt, WARM); wipeOut(lt, dur, ['#9E2A44', '#E8742A']);
}

// ================= P · the card =================
function shotCard(t, lt, dur) {
  followBoth(t, lt, { voice: '@lame_batman', voiceName: 'Suryakant Sharma', at: { head: TL.card + .15, a: TL.card + .5, b: TL.card + 1.1, ask: TL.card + 1.8 } });
  wipeIn(lt, ['#9E2A44', '#E8742A']);
}

// the sorrow faces need square() to hold back the joy until each cloud pops: wrap personO for E
const _personO = personO;
personO = function (p, t, o) {
  if (o.sorrow && o.sorrow[p.id] != null) {
    const tp = o.sorrow[p.id], q = { boilKey: 'p' + p.id, seed: p.x, hx: .35, lookX: .9, lookY: -.2 };
    if (t < tp + .1) return { ...q, eyes: p.k === 'girl' ? 'sad' : 'teary', mouth: 'wobble', tint: 'blue', tintK: .4, pray: p.k === 'dadi' ? .8 : 0 };
    const age = t - tp;
    return { ...q, eyes: age < .35 ? 'wide' : 'happy', mouth: age < .35 ? 'O' : 'grin', blush: .6, pray: p.k === 'dadi' ? 1 : 0, emote: age > .35 ? 'spark' : undefined, emoteK: clamp((age - .35) * 3), emoteAge: age };
  }
  if (o.skip && p.id === o.skip) return boyO(p, t);
  return _personO(p, t, o);
};
// L: the boy's own beat: sad, his Ram bends to him, the take, the hug
function boyO(p, t) {
  const q = { boilKey: 'p' + p.id, seed: p.x }, k = t - TL.kneel;
  if (t < TL.kneel + .3) return { ...q, eyes: 'sad', mouth: 'wobble', lookY: .3 };
  if (t < TL.hug) return { ...q, eyes: k < .9 ? 'wide' : 'spark', mouth: 'O', hx: p.side * -.5, lookX: -p.side, sq: -.1 * Math.sin(clamp((k - .3) / .5) * Math.PI) };
  const h = t - TL.hug;
  return { ...q, eyes: 'happy', mouth: 'grin', blush: .8, hx: -p.side * .5, aL: .2, aR: .2, emote: 'hearts', emoteK: clamp(h * 3), emoteAge: h };
}
// in L the boy's form arrives on its own timing: shift his delay so it appears at TL.kneel
const _drawForm = drawForm;
drawForm = function (p, t, o) {
  if (o.skip === p.id) {
    const k = clamp((t - TL.kneel) / .35); if (k <= 0) return;
    const [x, y, ru] = formAt(p), age = t - TL.kneel, s = p.side, toP = (wx, wy) => [(wx - x) / ru, (wy - y) / ru];
    const hug = clamp((t - TL.hug) / .5), kid = .82 * p.u;
    const q = { boilKey: 'fboy', seed: 4, kodanda: false, bow: .25 + .25 * hug, hx: s * .6, lookX: s, lookY: .5, eyes: hug > .5 ? 'closed' : 'happy', mouth: 'smile', blush: .3 };
    q[s > 0 ? 'handR' : 'handL'] = hug > 0 ? toP(p.x - s * 1.4 * kid, p.y - 8.8 * kid) : [s * 4.2, -15];
    q[s > 0 ? 'handL' : 'handR'] = [s * 1, -13.5];
    push(); translate(x, y); scale(.55 + .45 * backOut(k)); translate(-x, -y);
    glow(x, y - 14 * ru, 16 * ru, '#FFE08A', .4 * k);
    ram(x, y, ru, q);
    pop();
    poof(x, y - 13 * ru, 7 * ru, age, 'pfboyL');
    return;
  }
  return _drawForm(p, t, o);
};

shots([
  [0, shotSky],
  [TL.city, shotCity],
  [TL.tulsi, (t, lt, dur) => tulsiRoom(t, lt, dur, 1)],
  [TL.land, shotLand],
  [TL.faces, shotFaces],
  [TL.wide, shotCrowd],
  [TL.eyes, shotForms],
  [TL.tulsi2, (t, lt, dur) => tulsiRoom(t, lt, dur, 2)],
  [TL.verse2, shotVerse2],
  [TL.boy, shotBoy],
  [TL.rise, shotRise],
  [TL.royal, shotAll],
  [TL.card, shotCard],
]);
window.AMIT = { TL, square, SQ };
})();
