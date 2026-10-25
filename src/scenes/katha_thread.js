// katha_thread.js: "The gold thread" (ad/52-books123-katha-thread), a life drawn as threads of light, on the Cinematic
// engine (src/cine.js), no voice. Every person is a glowing thread rising up the age axis (Me's age); the "now" line sits
// at NOW_Y and the past scrolls down below it. Nani's thread has a gold core: the stories. Each story she tells is a gold
// arc from her thread to Me's, with its name on it, and Me's thread takes the gold. When a thread ends, its light rises
// into the sky as a star. Me tells the stories to the little one, then to the grandkid; Me becomes a star; the stars join
// into a constellation and the gold goes on in the threads still rising. Then the comment ask and the book card.
// No plot claims: it is an everyday family, and the stories are only named.
// Times in TL; tools/katha_thread_sfx.mjs uses the same TL.
const TL = { hook: 0, born: 3.6, nani: 6.5, names: 9.4, dadu: 13.8, naniEnd: 20.4, stay: 23.1, partner: 28.4, little: 32.7,
  tell: 35.5, back: 40.2, fast: 42.5, grand: 46.8, me: 56.0, leave: 57.6, ask: 60.6, card: 64.0, end: 70 };

const NOW_Y = 1060, PXY = 52, AXIS_X = 64, CAP_Y = 1330;
// Me's age over the reel: piecewise linear keys, smoothed (a moving average) so time eases between speeds
const AGEK = [[0, -3], [3, 0], [6.5, 3], [12, 8.2], [15.5, 10], [20.5, 15], [25.5, 19], [30, 26], [32.5, 30], [38.5, 36],
  [42, 48], [44.5, 58], [46, 61], [50, 68], [53, 80], [56, 84], [60, 86], [70, 90]];
const ageLin = t => kf(t, AGEK, x => x);
const AGE = t => { let s = 0; for (let i = -4; i <= 4; i++) s += ageLin(t + i * .14); return s / 9; };
function tOfAge(a) { let lo = 0, hi = 70; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; AGE(m) < a ? lo = m : hi = m; } return (lo + hi) / 2; }

// ---------- the people ----------
// xs: [[age, x]] the thread's lane over Me's ages (eased between); born/died in Me's ages; gold: [age, strength] the
// story core from that age; star: where its light settles; line: a passing crowd (a straight diagonal, no star).
const P = {
  nani:    { label: 'Nani', col: '#B8A4F2', born: -90, died: 15, xs: [[-90, 160], [15, 160]], gold: -90, star: [205, 520], seed: 1 },
  dadu:    { label: 'Dadu', col: '#D2E2FF', born: -90, died: 9, xs: [[-90, 860], [9, 860]], star: [800, 465], seed: 2 },
  mummy:   { label: 'Mummy', col: '#FF8C8C', born: -90, died: 58, xs: [[-90, 320], [15, 320], [18.5, 170], [90, 170]], star: [235, 715], seed: 3 },
  papa:    { label: 'Papa', col: '#72A2FF', born: -90, died: 54, xs: [[-90, 665], [9, 665], [12, 790], [90, 790]], star: [770, 640], seed: 4 },
  me:      { label: 'Me', col: '#FFE4B0', born: 0, died: 84, xs: [[0, 320], [2.6, 480], [90, 480]], gold: 3, star: [540, 875], seed: 5, me: true },
  bestie:  { label: 'Bestie', col: '#5FE3A8', born: 5, died: 74, xs: [[5, 1170], [7.5, 572], [11, 572], [13, 640], [18, 640], [21.5, 1190], [40.5, 1190], [43, 884], [90, 884]], star: [875, 790], seed: 6, starLabelLeft: true },
  partner: { label: 'Life partner', col: '#FF9FD2', born: 22, died: 81, xs: [[22, -130], [24.6, 330], [90, 330]], star: [360, 830], seed: 7, starLabelLeft: true },
  little:  { label: 'Little one', col: '#70E6F2', born: 30, died: 999, xs: [[30, 405], [33, 610], [99, 610]], gold: 32.5, seed: 8 },
  grand:   { label: 'Grandkid', col: '#FFB27A', born: 60, died: 999, xs: [[60, 610], [62.6, 765], [99, 765]], gold: 63, seed: 9 },
  school:  { label: 'School friends', col: '#C9D2E6', born: 6, died: 14.5, xs: [[6, -90], [14.5, 1170]], line: true, seed: 10 },
  college: { label: 'College gang', col: '#C9D2E6', born: 18.4, died: 24.2, xs: [[18.4, 1170], [24.2, -90]], line: true, seed: 11 },
  work:    { label: 'Office friends', col: '#C9D2E6', born: 26, died: 41, xs: [[26, -90], [41, 1170]], line: true, seed: 12 },
};
const PEOPLE = Object.values(P);
for (const p of PEOPLE) if (!p.line && p.died < 900) p.tDie = tOfAge(p.died);
// the stories: a gold arc from the teller's thread to the listener's at Me's age `at`, with the story's name on it
const STORIES = [
  ...[[3.3, 'Ganesha'], [4.3, 'Hanuman'], [5.3, 'Little Krishna'], [6.3, 'Prahlad'], [7.3, 'Dhruva']].map(([at, word]) => ({ from: 'nani', to: 'me', at, word })),
  ...[[32.6, 'Shiva'], [33.4, 'Durga'], [34.2, 'Ganesha'], [35.0, 'Ram'], [35.8, 'Hanuman']].map(([at, word]) => ({ from: 'me', to: 'little', at, word })),
  ...[[63.2, 'Hanuman'], [64.6, 'Hanuman'], [66, 'Prahlad'], [67.4, 'Hanuman!']].map(([at, word]) => ({ from: 'me', to: 'grand', at, word })),
  ...[[85, 'Ganesha'], [86, 'Krishna'], [87, 'Durga']].map(([at, word]) => ({ from: 'little', to: 'grand', at, word })),
];
for (const s of STORIES) s.t = tOfAge(s.at);
// how much gold a thread carries at an age (Me's grows with every story Nani tells)
function goldAt(p, age) {
  if (p.gold == null || age < p.gold) return 0;
  if (p === P.me) return .25 + .75 * clamp((age - 3) / 4.5);
  if (p === P.little || p === P.grand) return .3 + .7 * clamp((age - p.gold) / 4);
  return 1;
}
const yAt = (A, age) => NOW_Y + (A - age) * PXY;
function xAt(p, age) {
  const x = kf(age, p.xs, p.line ? (k => k) : easeIO);
  return p.line ? x : x + Math.sin(age * 1.25 + p.seed * 2.1) * 7 + Math.sin(age * .43 + p.seed * 5.3) * 6;
}
// the visible stretch of a thread: from 21 years back to now (or to its end)
function span(p, A) { const a0 = Math.max(p.born, A - 21), a1 = Math.min(A, p.died); return a1 > a0 ? [a0, a1] : null; }
function trace(c, p, A, a0, a1, step = .1) {
  c.beginPath();
  for (let a = a0, i = 0; ; a = Math.min(a1, a + step), i++) { const x = xAt(p, a), y = yAt(A, a); i ? c.lineTo(x, y) : c.moveTo(x, y); if (a >= a1) break; }
}
const fadeDown = (c, col, a) => { const g = c.createLinearGradient(0, NOW_Y, 0, NOW_Y + 19 * PXY); g.addColorStop(0, rgba(col, a)); g.addColorStop(.55, rgba(col, a * .5)); g.addColorStop(1, rgba(col, 0)); return g; };

// a four-point star (the lights in the sky): a dot, a soft glow and a thin cross
function sparkle(c, x, y, r, col, a = 1, flare = 0) {
  if (a <= 0) return;
  glow(c, x, y, r * 7 + flare * 260, col, .55 * a + flare * .5);
  c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = a;
  const L = r * 4.2 + flare * 150;
  for (const [dx, dy] of [[1, 0], [0, 1]]) {
    const g = c.createLinearGradient(x - dx * L, y - dy * L, x + dx * L, y + dy * L);
    g.addColorStop(0, rgba(col, 0)); g.addColorStop(.5, rgba('#FFFFFF', .9)); g.addColorStop(1, rgba(col, 0));
    c.strokeStyle = g; c.lineWidth = 1.6 + flare * 2; c.beginPath(); c.moveTo(x - dx * L, y - dy * L); c.lineTo(x + dx * L, y + dy * L); c.stroke();
  }
  ellipse(c, x, y, r, r, '#FFFFFF'); c.restore();
}
function label(c, txt, x, y, col, a, size = 30, weight = 600) {
  if (a <= 0) return;
  c.save(); c.globalAlpha = a; c.font = `${weight} ${size}px Poppins`; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.shadowColor = 'rgba(2,4,14,.95)'; c.shadowBlur = 14; c.fillStyle = col; c.fillText(txt, x, y); c.restore();
}

// ---------- the sky ----------
const FIELD = (() => { const r = lcg(52), s = []; for (let i = 0; i < 230; i++) s.push([r() * W, r() * H, .5 + r() * 1.4, r() * 6, r()]); return s; })();
function nightSky(c, t) {
  sky(c, [[0, '#060A1C'], [700, '#0B1430'], [1300, '#0A1028'], [1920, '#04060F']]);
  glow(c, 300, 560, 620, '#3A2C6E', .32, 'screen'); glow(c, 820, 900, 560, '#123A5A', .3, 'screen'); glow(c, 520, 300, 500, '#28306A', .25, 'screen');
  c.save(); c.globalCompositeOperation = 'lighter';
  for (const [x, y, r, ph, b] of FIELD) { c.globalAlpha = (.18 + .5 * b) * (.6 + .4 * Math.sin(t * (.8 + b) + ph)); ellipse(c, x, y, r, r, '#DCE4FF'); }
  c.restore();
}

// ---------- the age axis (Me's age) ----------
function axis(c, A) {
  c.save(); c.globalAlpha = .16; c.strokeStyle = '#C8D4F0'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(AXIS_X, 400); c.lineTo(AXIS_X, 1880); c.stroke(); c.restore();
  label(c, 'age', AXIS_X, 380, '#AEB9D6', .45, 24, 500);
  for (let a = 0; a <= 100; a += 5) {
    const y = yAt(A, a); if (y < 400 || y > 1880 || Math.abs(y - NOW_Y) < 30) continue;
    const k = y > NOW_Y ? clamp(1 - (y - NOW_Y) / 800) : clamp(1 - (NOW_Y - y) / 640);
    label(c, String(a), AXIS_X, y, '#AEB9D6', .4 * k, 22, 500);
  }
  if (A >= -.2) {
    const a = Math.max(0, Math.floor(A + .0001));
    c.save(); c.globalAlpha = .9; c.fillStyle = '#F4C46A'; c.beginPath(); c.arc(AXIS_X + 26, NOW_Y, 4, 0, TAU); c.fill(); c.restore();
    label(c, String(a), AXIS_X - 4, NOW_Y, '#F4C46A', clamp((A + .2) * 3), 32, 700);
  }
}

// ---------- the threads ----------
function threads(c, t, A) {
  const live = PEOPLE.map(p => [p, span(p, A)]).filter(([, s]) => s);
  // the glow under them all, soft and small
  soft(c, 3, (s) => {
    s.globalCompositeOperation = 'lighter'; s.lineCap = 'round'; s.lineJoin = 'round';
    for (const [p, [a0, a1]] of live) {
      s.strokeStyle = fadeDown(s, p.col, p.line ? .14 : .32); s.lineWidth = p.line ? 8 : 16; trace(s, p, A, a0, a1, .25); s.stroke();
      if (p.gold != null && a1 > p.gold) { const g0 = Math.max(a0, p.gold); s.strokeStyle = fadeDown(s, '#F4C46A', .5 * goldAt(p, a1)); s.lineWidth = 22; trace(s, p, A, g0, a1, .25); s.stroke(); }
    }
  }, { blur: 3, op: 'lighter' });
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  for (const [p, [a0, a1]] of live) {
    c.strokeStyle = fadeDown(c, p.col, p.line ? .5 : .95); c.lineWidth = p.line ? 2 : 3.4; trace(c, p, A, a0, a1); c.stroke();
    // the gold core, and gold specks along it
    if (p.gold != null && a1 > p.gold) {
      const g0 = Math.max(a0, p.gold);
      for (let a = g0; a < a1; a += .3) {
        const k = goldAt(p, a); if (k <= 0) continue;
        const y = yAt(A, a); if (y > NOW_Y + 19 * PXY) continue;
        const x = xAt(p, a), h = hash(Math.floor(a * 10) + p.seed * 100), fk = clamp(1 - (y - NOW_Y) / (19 * PXY));
        c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = k * fk * (.4 + .6 * (.5 + .5 * Math.sin(t * 3 + h * 30)));
        ellipse(c, x + (h - .5) * 9, y, 1.6 + h * 1.6, 1.6 + h * 1.6, '#FFE3A0'); c.restore();
      }
      c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = fadeDown(c, '#F4C46A', .9); c.lineWidth = 1.6;
      for (let a = g0; a < a1; a += .5) { const b = Math.min(a1, a + .5), k = goldAt(p, b); c.globalAlpha = k; trace(c, p, A, a, b, .1); c.stroke(); }
      c.restore();
    }
  }
  c.restore();
}
// the heads at the now line, and their names
function heads(c, t, A) {
  for (const p of PEOPLE) {
    if (A < p.born || A > p.died) continue;
    const x = xAt(p, A); if (x < -40 || x > W + 40) continue;
    const k = clamp((A - p.born) / .5), g = goldAt(p, A);
    if (p.line) { glow(c, x, NOW_Y, 40, p.col, .35 * k); ellipse(c, x, NOW_Y, 4.5, 4.5, rgba('#FFFFFF', .8 * k)); }
    else {
      glow(c, x, NOW_Y, p.me ? 120 : 80, p.col, .55 * k); if (g) glow(c, x, NOW_Y, 110, '#F4C46A', .5 * g * k);
      ellipse(c, x, NOW_Y, p.me ? 9 : 7, p.me ? 9 : 7, '#FFFFFF');
    }
    const lx = clamp(x, 70, 900), lk = k * clamp((p.died - A) / .3) * (p.line ? clamp(1 - Math.abs(x - 540) / 520) * .65 : 1) * clamp(1 - (x - 960) / 60);
    label(c, p.label, lx, NOW_Y + (p.me ? -40 : p.line ? 40 : -36), p.line ? '#DCE3F2' : p.col, lk, p.me ? 36 : p.line ? 26 : 28, p.me ? 700 : p.line ? 500 : 600);
  }
}
// the stories: gold arcs, a spark running along each, the story's name over it
function stories(c, t, A) {
  for (const s of STORIES) {
    const u = A - s.at; if (u < 0 || u > 22) continue;
    const pf = P[s.from], pt = P[s.to]; if (s.at > pf.died || s.at < pt.born) continue;
    const p = easeOut(clamp(u / .7)), x0 = xAt(pf, s.at), x1 = xAt(pt, s.at), y = yAt(A, s.at), hgt = 46 + Math.abs(x1 - x0) * .18;
    const pt2 = k => { const m = 1 - k; return [m * m * x0 + 2 * m * k * (x0 + x1) / 2 + k * k * x1, m * m * y + 2 * m * k * (y - hgt) + k * k * y]; };
    const fk = clamp(1 - (y - NOW_Y) / (17 * PXY)), a = fk * lerp(1, .45, clamp((u - .8) / 1.2));
    c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
    c.strokeStyle = rgba('#F4C46A', .32 * a); c.lineWidth = 9; c.beginPath(); for (let i = 0; i <= 24; i++) { const [x, yy] = pt2(p * i / 24); i ? c.lineTo(x, yy) : c.moveTo(x, yy); } c.stroke();
    c.strokeStyle = rgba('#FFE3A0', .9 * a); c.lineWidth = 2.2; c.stroke(); c.restore();
    if (p < 1) { const [hx, hy] = pt2(p); glow(c, hx, hy, 60, '#FFD27A', .9); ellipse(c, hx, hy, 5, 5, '#FFFFFF'); }
    if (u > .7 && u < 1.2) glow(c, x1, y, 90, '#F4C46A', .7 * (1 - (u - .7) / .5));
    const v = t - s.t, wk = clamp((v - .1) / .35) * clamp((1.55 - v) / .4);
    if (wk > 0) {
      c.save(); c.globalAlpha = wk; c.font = '36px Marcellus'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.shadowColor = 'rgba(2,4,14,.95)'; c.shadowBlur = 16; c.fillStyle = '#F7D58C'; c.fillText(s.word, (x0 + x1) / 2, y - hgt - 30 - v * 8); c.restore();
    }
  }
}
// the ones who have gone: their light rises from the now line into the sky
function starsOf(c, t, A) {
  for (const p of PEOPLE) {
    if (p.tDie == null || t < p.tDie) continue;
    const u = (t - p.tDie) / 2.0, k = easeIO(u), [sx, sy] = p.star, x0 = xAt(p, p.died);
    const x = lerp(x0, sx, k), y = lerp(NOW_Y, sy, k) - Math.sin(Math.PI * clamp(u)) * 60, arrive = clamp(1 - Math.abs(u - 1) / .25);
    const big = p.me ? 1.5 : 1, flare = p.me ? Math.exp(-Math.max(0, t - p.tDie - .1) * 1.3) * .9 : 0;
    // a faint trail while it rises
    if (u < 1.2) for (let i = 1; i <= 8; i++) { const kk = easeIO(clamp(u - i * .03)); glow(c, lerp(x0, sx, kk), lerp(NOW_Y, sy, kk) - Math.sin(Math.PI * clamp(u - i * .03)) * 60, 26, p.col, .22 * (1 - i / 9) * clamp(1.2 - u)); }
    sparkle(c, x, y, 4.2 * big, p.col, 1, flare + arrive * .35);
    if (p.me) glow(c, x, y, 160, '#F4C46A', .55 * clamp(u));
    const la = clamp(u - .7) * (p.me ? 1 : .85);
    label(c, p.label, p.starLabelLeft ? x - 28 - p.label.length * 8 : x + 30 + p.label.length * 8.5, y + (p.me ? 36 : 0), p.me ? '#FFE4B0' : p.col, la, p.me ? 32 : 26, p.me ? 700 : 500);
  }
}
// the constellation: once Me's light has settled, the stars join; the gold line runs Nani → Me → the little one's thread
const LINKS = [['nani', 'mummy', 0], ['dadu', 'papa', 0], ['mummy', 'me', 0], ['papa', 'me', 0], ['partner', 'me', 0], ['bestie', 'me', 0], ['nani', 'me', 1], ['me', 'little', 1]];
function constellation(c, t, A) {
  const t0 = P.me.tDie + 2.0;
  LINKS.forEach(([a, b, gold], i) => {
    const k = easeIO(seg(t, t0 + i * .32, t0 + i * .32 + .9)); if (k <= 0) return;
    const [x0, y0] = P[a].star, [x1, y1] = P[b].star || [xAt(P[b], A), NOW_Y];
    const x = lerp(x0, x1, k), y = lerp(y0, y1, k);
    c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
    if (gold) { c.strokeStyle = rgba('#F4C46A', .35); c.lineWidth = 8; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x, y); c.stroke(); }
    c.strokeStyle = gold ? rgba('#FFE3A0', .9) : rgba('#C8D4F0', .38); c.lineWidth = gold ? 2.4 : 1.4; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x, y); c.stroke();
    c.restore();
  });
}

// ---------- the shots ----------
// one long take over the night sky, the camera breathing in on the intimate beats; then the card
const CAM = [[0, 1], [6, 1], [9.5, 1.05], [13, 1], [20, 1], [22.5, 1.05], [26, 1], [34.5, 1], [37, 1.05], [40, 1], [55.6, 1], [56.4, 1.05], [60, .98], [64, 1]];
SHOTS.push({ a: 0, b: TL.card + 1, draw(c, u, t) {
  const A = AGE(t), cam = { z: kf(t, CAM, easeIO), fx: 520, fy: 980 };
  plane(c, cam, 0, (c) => nightSky(c, t));
  plane(c, cam, .2, (c) => motes(c, { n: 40, seed: 52, box: [-50, 0, W + 50, H], r: 2.2, col: '#B9C6FF', a: .35, vx: 4, vy: -10, t }));
  plane(c, cam, 1, (c) => { axis(c, A); threads(c, t, A); stories(c, t, A); heads(c, t, A); constellation(c, t, A); starsOf(c, t, A); });
} });
SHOTS.push({ a: TL.card, b: TL.end + 1, xf: .8, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'Pass the stories on', line: 'Picture books for your little ones', price: 'Books 1–3 · Set of 3 · ₹500' });
} });
// a dark band behind each caption, so the threads under it don't fight the words
POST.push((c, t) => {
  for (const k of CAPTIONS) {
    if (t < k.a || t > k.b || k.y < 1000) continue;
    const v = Math.min(seg(t, k.a, k.a + .3), 1 - seg(t, k.b - .3, k.b)), g = c.createLinearGradient(0, k.y - 190, 0, k.y + 190);
    g.addColorStop(0, 'rgba(3,5,14,0)'); g.addColorStop(.5, `rgba(3,5,14,${.62 * v})`); g.addColorStop(1, 'rgba(3,5,14,0)');
    c.fillStyle = g; c.fillRect(0, k.y - 190, W, 380);
  }
});

// ---------- captions ----------
Object.assign(CAP, { font: 'Marcellus', weight: 400, size: 60, y: CAP_Y, maxW: 860, x: 520 });
LOOK.vignette = .55; LOOK.bloom = .38; LOOK.grain = .06;
say(-.35, 3.4, 'Your life, as a thread. | Watch the *gold* one.', { y: 640, size: 66, at: [-1, -1, -1, -1, -1, -1, -1, -1, -1] });
say(TL.born, 6.3, 'Some threads were there | before yours.');
say(TL.nani, 9.3, '*Nani* told you a story | every night.');
say(TL.names, 12.2, '*Ganesha.* *Hanuman.* | Little *Krishna.*');
say(TL.dadu, 16.4, 'Some threads end.');
say(TL.naniEnd, 23.0, 'One day, *Nani*’s | thread ended too…');
say(TL.stay, 25.9, '…but her stories | didn’t.', { size: 66 });
say(TL.partner, 31.0, 'Someone came, | and stayed.');
say(TL.little, 35.4, 'A little thread | began beside yours.');
say(TL.tell, 38.4, 'And one night, | *you* told the stories.');
say(TL.back, 42.4, 'Some friends | come back.');
say(TL.fast, 45.0, 'Then time | ran faster.');
say(TL.grand, 49.8, 'Your grandkid asked | for *Hanuman* again.');
say(TL.leave, 60.4, 'People leave. | Their stories stay.', { size: 66 });
say(TL.ask, TL.card, 'Who told *you* | your first story? | Comment their name.', { size: 62 });
