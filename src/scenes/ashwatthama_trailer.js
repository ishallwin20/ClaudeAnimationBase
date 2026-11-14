// ashwatthama_trailer.js: the trailer reel of CHIRANJEEVI Issue 1. Each shot is a panel of the finished issue (its
// Inked art, without the lettering), moved like a camera, under a Cinematic karaoke caption; then the end card.
// Every caption is a beat of the issue (see comics/ashwatthama/SCRIPT.md for the verses):
//   the Chiranjeevi prayer names eight who never die, Ashwatthama first; the owl (Sauptika 10.1); the being at the
//   gate (10.6); "how can I sleep?" (10.5.26); the camp by dawn (10.8); the two weapons (10.14); Krishna's curse,
//   3,000 years with no one to talk to (10.16.10).
// Shots past the reel's end are stills: 50.5 the reel cover, 60.5 and 61.5 the two Instagram story frames.
LOOK.bloom = .16; LOOK.grain = .06;
const ART_DIR = 'out/comic_ashwatthama/art_ink/';
const TR = {};
for (const n of [1, 3, 16, 19, 20, 29, 37, 43]) PICS['tr' + n] = TR[n] = Object.assign(new Image(), { src: `${ART_DIR}t${n}_50.png` });
PICS.cover = Object.assign(new Image(), { src: 'out/comics/ashwatthama_out/ink/pages/p01.png' });
// a panel of page n as a source rectangle in its art (the art is 2× the page's 1080 × 1350)
const pan = (n, i) => { const [x, y, w, h] = COMIC.pages[n].panels[i].r; return { img: TR[n], sx: x * 2, sy: y * 2, sw: w * 2, sh: h * 2 }; };
// draw a panel to cover a box (bx, by, bw, bh), zoomed k and centred on its point (fx, fy) (fractions), kept inside
function coverDraw(c, s, bx, by, bw, bh, k, fx, fy) {
  if (!s.img.naturalWidth) return;
  const sc = Math.max(bw / s.sw, bh / s.sh) * k, dw = s.sw * sc, dh = s.sh * sc;
  const x = clamp(bx + bw / 2 - fx * dw, bx + bw - dw, bx), y = clamp(by + bh / 2 - fy * dh, by + bh - dh, by);
  c.drawImage(s.img, s.sx, s.sy, s.sw, s.sh, x, y, dw, dh);
}
// full bleed: the panel fills the frame, pushing in from z0 to z1 over the shot
const bleed = (n, i, o) => (c, u) => { const d = o.d || 4; coverDraw(c, pan(n, i), 0, 0, W, H, lerp(o.z0 ?? 1, o.z1 ?? 1.1, easeIO(u / d)), lerp(o.fx[0], o.fx[1] ?? o.fx[0], u / d), lerp(o.fy[0], o.fy[1] ?? o.fy[0], u / d)); };
// framed: the panel as a comic panel (ink border) across the frame at y cy, a dark blurred copy of it behind; the
// camera pushes in inside the border
const framed = (n, i, o) => (c, u) => {
  const s = pan(n, i), d = o.d || 4, pw = o.w || 1000, ph = Math.min(o.maxH || 1100, pw * s.sh / s.sw), x = (W - pw) / 2, y = o.cy - ph / 2;
  c.save(); c.filter = 'blur(28px) brightness(.32) saturate(1.2)'; coverDraw(c, s, -60, -60, W + 120, H + 120, 1.05, .5, .5); c.restore();
  const sh = (o.shake || 0) * Math.exp(-u * 5) * 14, sx = Math.sin(u * 60) * sh, sy = Math.cos(u * 47) * sh;
  c.save(); c.translate(sx, sy);
  c.fillStyle = '#0B0810'; c.fillRect(x - 10, y - 10, pw + 20, ph + 20);
  c.beginPath(); c.rect(x, y, pw, ph); c.clip();
  coverDraw(c, s, x, y, pw, ph, lerp(o.z0 ?? 1, o.z1 ?? 1.1, easeIO(u / d)), lerp(o.fx[0], o.fx[1] ?? o.fx[0], u / d), lerp(o.fy[0], o.fy[1] ?? o.fy[0], u / d));
  c.restore();
  c.save(); c.translate(sx, sy); c.strokeStyle = 'rgba(241,231,210,.85)'; c.lineWidth = 3; c.strokeRect(x - 10, y - 10, pw + 20, ph + 20); c.restore();
};
// a dark band behind a caption on a busy full-bleed shot
function shade(c, y0, y1) { const g = c.createLinearGradient(0, y0, 0, y1), m = (y0 + y1) / 2; g.addColorStop(0, 'rgba(3,3,8,0)'); g.addColorStop(.35, 'rgba(3,3,8,.78)'); g.addColorStop(.65, 'rgba(3,3,8,.78)'); g.addColorStop(1, 'rgba(3,3,8,0)'); c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); }
const allLit = (txt) => ({ at: txt.split(/\s+/).filter(w => w && w !== '|').map(() => -1) });

// ---------- the shots ----------
const B = [0, 7.6, 11.4, 15.2, 19, 22.8, 26.6, 30.4, 36];
SHOTS.push(
  { a: B[0], b: B[1] + .3, draw: bleed(1, 0, { d: 7.6, z0: 1.02, z1: 1.16, fx: [.5], fy: [.56, .6] }) },
  { a: B[1], b: B[2] + .3, xf: .3, draw: framed(16, 0, { d: 3.8, cy: 1010, fx: [.5, .55], fy: [.4, .5], z1: 1.14 }) },
  { a: B[2], b: B[3] + .3, xf: .3, draw: (c, u) => { bleed(20, 0, { d: 3.8, z0: 1.0, z1: 1.12, fx: [.5], fy: [.3, .42] })(c, u); shade(c, 1180, 1700); } },
  { a: B[3], b: B[4] + .3, draw: framed(19, 1, { d: 3.8, cy: 1060, w: 1000, fx: [.32, .3], fy: [.45], z0: 1.1, z1: 1.32, shake: 1 }) },
  { a: B[4], b: B[5] + .3, xf: .3, draw: framed(29, 2, { d: 3.8, cy: 1040, fx: [.4, .55], fy: [.6], z1: 1.15 }) },
  { a: B[5], b: B[6] + .3, draw: framed(37, 1, { d: 3.8, cy: 1030, fx: [.5], fy: [.45, .4], z0: 1, z1: 1.18, shake: 1.2 }) },
  { a: B[6], b: B[7] + .3, xf: .3, draw: framed(43, 1, { d: 3.8, cy: 1000, fx: [.62], fy: [.5], z0: 1.05, z1: 1.25 }) },
  { a: B[7], b: B[8] + 1, draw: (c, u, t) => endCard(c, u, t) },
  // stills: the reel cover, then the two story frames
  { a: 50, b: 51, draw: (c, u, t) => reelCover(c, t) },
  { a: 60, b: 61, draw: (c, u, t) => story1(c, t) },
  { a: 61, b: 62, draw: (c, u, t) => story2(c, t) },
);
// a white flash on the hard cuts that hit
POST.push((c, t) => { for (const a of [B[3], B[5]]) flash(c, Math.max(0, 1 - (t - a) / .18) * (t >= a ? .9 : 0), '#FFF4E0'); });

// ---------- the captions (the safe band, clear of the faces) ----------
say(-1, B[1] - 3.8, 'A Hindu prayer names | *8 people* who never die.', { y: 500, ...allLit('A Hindu prayer names | *8 people* who never die.') });
say(B[1] - 3.8, B[1], 'The first name on it | is a *killer.*', { y: 500 });
say(B[1], B[2], 'One night, an *owl* | showed him how to kill.', { y: 470 });
say(B[2], B[3], 'Something stood guard | at the gate.', { y: 1420 });
say(B[3], B[4], '*"How can I sleep?"*', { y: 520, size: 70 });
say(B[4], B[5], 'By dawn, | the camp was silent.', { y: 520 });
say(B[5], B[6], 'Two weapons that could | burn the world.', { y: 500 });
say(B[6], B[7], '*Krishna\'s* curse: | 3,000 years, alone.', { y: 1360 });

// ---------- the end card ----------
function comicCover(c, x, y, w, pop, t) {
  const h = w * 1.25;
  glow(c, x, y, w * .9, '#7FD8FF', .22 + .05 * Math.sin(t * 2));
  picture(c, PICS.cover, x, y, w, h, { pop, r: 10, shadow: 34, rot: Math.sin(t * 1.1) * .006 });
}
function pill(c, txt, x, y, pop, t) {
  const k = popK(pop) * (1 + .03 * Math.max(0, Math.sin(t * 5))); if (k <= .01) return;
  c.save(); c.translate(x, y); c.scale(k, k); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-230, -44, 460, 88, 44); c.fill(); c.restore();
  text(c, txt, x, y + 3, '700 50px Poppins', '#FFFFFF', { pop });
}
function cardBg(c, t) {
  sky(c, [[0, '#04060E'], [900, '#121C38'], [1920, '#05060B']]);
  glow(c, 540, 900, 760, '#2E4A7A', .45, 'screen');
  motes(c, { n: 50, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#9FE4FF', a: .5, vx: 4, vy: -22, t });
}
function endCard(c, u, t) {
  const pk = d => u - d, X = 540;
  cardBg(c, t);
  text(c, 'A COMIC FROM', X, 455, '500 34px Poppins', '#CFE3DF', { pop: pk(.1), spacing: 4 });
  picture(c, PICS.logo, X - 175, 515, 74, 74, { pop: pk(.2), r: 37 });
  text(c, 'RISHI KATHA', X + 40, 518, '42px Marcellus', '#FBE0CF', { pop: pk(.2), spacing: 3 });
  comicCover(c, X, 900, 500, pk(.35), t);
  text(c, 'CHIRANJEEVI · ISSUE 1', X, 1255, '700 50px Cinzel', '#F4C46A', { pop: pk(.8), glow: ['rgba(244,196,106,.5)', 22], spacing: 2, maxW: 900 });
  text(c, '48 pages · every scene from the Mahabharata', X, 1318, '500 33px Poppins', '#FFFFFF', { pop: pk(1.0), maxW: 920 });
  pill(c, 'rishikatha.com', X, 1405, pk(1.3), t);
  text(c, 'Out now · link in bio · Follow @therishikatha', X, 1490, '500 32px Poppins', '#CFE3DF', { pop: pk(1.6), maxW: 940 });
}

// ---------- the reel cover (title inside the 3:4 crop, y 240–1680) ----------
function reelCover(c, t) {
  coverDraw(c, pan(1, 0), 0, 0, W, H, 1.08, .5, .58);
  c.save(); const g = c.createLinearGradient(0, 1100, 0, 1700); g.addColorStop(0, 'rgba(4,6,14,0)'); g.addColorStop(1, 'rgba(4,6,14,.92)'); c.fillStyle = g; c.fillRect(0, 1100, W, 800); c.restore();
  c.save(); const g2 = c.createLinearGradient(0, 240, 0, 560); g2.addColorStop(0, 'rgba(4,6,14,.85)'); g2.addColorStop(1, 'rgba(4,6,14,0)'); c.fillStyle = g2; c.fillRect(0, 0, W, 560); c.restore();
  text(c, 'THE MAN WHO', 540, 330, '700 64px Cinzel', '#FBE0CF', { spacing: 4, glow: ['rgba(0,0,0,.9)', 20] });
  text(c, "CAN'T DIE", 540, 425, '700 104px Cinzel', '#F4C46A', { spacing: 6, glow: ['rgba(0,0,0,.9)', 24] });
  text(c, 'ASHWATTHAMA', 540, 1440, '700 92px Cinzel', '#FFE7A6', { spacing: 4, glow: ['rgba(0,0,0,.9)', 24], maxW: 960 });
  text(c, 'A comic · CHIRANJEEVI 1', 540, 1530, '500 40px Poppins', '#FFFFFF', { glow: ['rgba(0,0,0,.9)', 16] });
}

// ---------- the Instagram stories (key words between y 270 and 1580: the app covers the rest) ----------
function story1(c, t) {
  coverDraw(c, pan(3, 0), 0, 0, W, H, 1.0, .55, .45);
  c.save(); c.fillStyle = 'rgba(3,4,10,.35)'; c.fillRect(0, 0, W, H); c.restore();
  c.save(); const g = c.createLinearGradient(0, 1150, 0, 1700); g.addColorStop(0, 'rgba(3,4,10,0)'); g.addColorStop(1, 'rgba(3,4,10,.95)'); c.fillStyle = g; c.fillRect(0, 1150, W, 770); c.restore();
  text(c, 'A Hindu prayer names', 540, 1290, '700 54px Cinzel', '#FBE0CF', { glow: ['rgba(0,0,0,.9)', 18] });
  text(c, '8 people who never die.', 540, 1370, '700 58px Cinzel', '#F4C46A', { glow: ['rgba(0,0,0,.9)', 18], maxW: 960 });
  text(c, 'This is the first.', 540, 1470, '700 54px Cinzel', '#FFFFFF', { glow: ['rgba(0,0,0,.9)', 18] });
}
function story2(c, t) {
  cardBg(c, 0);
  const k = 1;
  c.save(); c.translate(540, 330); c.rotate(-.04); c.fillStyle = '#F15A24'; c.beginPath(); c.roundRect(-190, -40, 380, 80, 40); c.fill(); c.restore();
  text(c, 'NEW · A COMIC', 540, 333, '700 40px Poppins', '#FFFFFF', { spacing: 2 });
  comicCover(c, 540, 820, 560, null, 0);
  text(c, 'CHIRANJEEVI · ISSUE 1', 540, 1210, '700 50px Cinzel', '#F4C46A', { glow: ['rgba(244,196,106,.5)', 22], spacing: 2, maxW: 900 });
  text(c, '48 pages. Every scene from the Mahabharata,', 540, 1280, '500 33px Poppins', '#FFFFFF', { maxW: 940 });
  text(c, 'with the verse numbers at the back.', 540, 1325, '500 33px Poppins', '#FFFFFF', { maxW: 940 });
  pill(c, 'Read it · link in bio', 540, 1440, null, 0);
  text(c, 'rishikatha.com', 540, 1530, '500 34px Poppins', '#CFE3DF');
}
