// hanuman_trailer.js: the trailer reels and Instagram story frames of CHIRANJEEVI Issue 2 (Hanuman). Each shot is a
// panel of the finished issue (its Inked art, without the lettering), moved like a camera, under a Cinematic karaoke
// caption; then the end card. The page that loads this sets CUT:
//   'A'  "The baby who leapt at the Sun": all Bal Hanuman, the hunger, the leap, the Sun, the bigger fruit, the vajra,
//        the Wind leaving, the eight gifts, the curse (Uttara 7.35.19–7.36.34)
//   'B'  "He forgot his strength": the naughty boy, the curse, the years, Jambavan, he grows, the leap, Lanka burns
//        (7.36.28–34; Kishkindha 4.65–66; Sundara 5.1, 5.52)
// Every caption is a beat of the issue (comics/hanuman/SCRIPT.md has the verses). Past the reel's end are stills:
// 50.5 the reel cover; 60.5–64.5 the five story frames (the same in both cuts).
LOOK.bloom = .14; LOOK.grain = .05;
const ART_DIR = 'out/comic_hanuman/art_ink/', PAGE_DIR = 'out/comics/hanuman_out/ink/pages/';
const TR = {};
for (const n of [1, 3, 4, 5, 6, 7, 8, 14, 15, 16, 20, 22, 23, 25, 42]) TR[n] = Object.assign(new Image(), { src: `${ART_DIR}t${n}_50.png` });
for (const n of [1, 3, 4, 7]) PICS['pg' + n] = Object.assign(new Image(), { src: `${PAGE_DIR}p${String(n).padStart(2, '0')}.png` });
PICS.cover = PICS.pg1;
// a panel of page n as a source rectangle in its art (the art is 2× the page's 1080 × 1350)
const pan = (n, i) => { const [x, y, w, h] = COMIC.pages[n].panels[i].r; return { img: TR[n], sx: x * 2, sy: y * 2, sw: w * 2, sh: h * 2 }; };
function coverDraw(c, s, bx, by, bw, bh, k, fx, fy) {
  if (!s.img.naturalWidth) return;
  const sc = Math.max(bw / s.sw, bh / s.sh) * k, dw = s.sw * sc, dh = s.sh * sc;
  const x = clamp(bx + bw / 2 - fx * dw, bx + bw - dw, bx), y = clamp(by + bh / 2 - fy * dh, by + bh - dh, by);
  c.drawImage(s.img, s.sx, s.sy, s.sw, s.sh, x, y, dw, dh);
}
// full bleed: the panel fills the frame, pushing in from z0 to z1 over the shot
const bleed = (n, i, o) => (c, u) => { const d = o.d || 4; coverDraw(c, pan(n, i), 0, 0, W, H, lerp(o.z0 ?? 1, o.z1 ?? 1.1, easeIO(u / d)), lerp(o.fx[0], o.fx[1] ?? o.fx[0], u / d), lerp(o.fy[0], o.fy[1] ?? o.fy[0], u / d)); };
// framed: the panel as a comic panel (ink border) across the frame at y cy, a dark blurred copy of it behind
const framed = (n, i, o) => (c, u) => {
  const s = pan(n, i), d = o.d || 4, pw = o.w || 1000, ph = o.h || Math.min(o.maxH || 1100, pw * s.sh / s.sw), x = (W - pw) / 2, y = o.cy - ph / 2;
  c.save(); c.filter = 'blur(28px) brightness(.32) saturate(1.2)'; coverDraw(c, s, -60, -60, W + 120, H + 120, 1.05, .5, .5); c.restore();
  const sh = (o.shake || 0) * Math.exp(-u * 5) * 14, sx = Math.sin(u * 60) * sh, sy = Math.cos(u * 47) * sh;
  c.save(); c.translate(sx, sy);
  c.fillStyle = '#0B0810'; c.fillRect(x - 10, y - 10, pw + 20, ph + 20);
  c.beginPath(); c.rect(x, y, pw, ph); c.clip();
  coverDraw(c, s, x, y, pw, ph, lerp(o.z0 ?? 1, o.z1 ?? 1.1, easeIO(u / d)), lerp(o.fx[0], o.fx[1] ?? o.fx[0], u / d), lerp(o.fy[0], o.fy[1] ?? o.fy[0], u / d));
  c.restore();
  c.save(); c.translate(sx, sy); c.strokeStyle = 'rgba(241,231,210,.85)'; c.lineWidth = 3; c.strokeRect(x - 10, y - 10, pw + 20, ph + 20); c.restore();
};
function shade(c, y0, y1, a = .78) { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(3,3,8,0)'); g.addColorStop(.35, `rgba(3,3,8,${a})`); g.addColorStop(.65, `rgba(3,3,8,${a})`); g.addColorStop(1, 'rgba(3,3,8,0)'); c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); }
const allLit = (txt) => ({ at: txt.split(/\s+/).filter(w => w && w !== '|').map(() => -1) });

// ---------- the cuts ----------
const B = [0, 4.4, 8.2, 12, 15.8, 19.6, 23.4, 27.2, 31, 37];
const CUTS = {
  A: {
    shots: [
      framed(3, 1, { d: 4.4, cy: 1060, fx: [.5], fy: [.45, .4], z0: 1.0, z1: 1.12 }),
      (c, u) => { bleed(4, 0, { d: 3.8, z0: 1.0, z1: 1.12, fx: [.5, .55], fy: [.36, .3] })(c, u); shade(c, 1180, 1620); },
      framed(5, 0, { d: 3.8, cy: 1000, h: 640, fx: [.55, .62], fy: [.5], z0: 1.0, z1: 1.12 }),
      framed(6, 1, { d: 3.8, cy: 1010, fx: [.35, .45], fy: [.5], z0: 1.05, z1: 1.2 }),
      framed(7, 0, { d: 3.8, cy: 1020, fx: [.5], fy: [.5], z0: 1.0, z1: 1.2, shake: 1.3 }),
      framed(8, 0, { d: 3.8, cy: 1090, w: 860, h: 940, fx: [.5], fy: [.55, .6], z1: 1.12 }),
      framed(14, 1, { d: 3.8, cy: 1010, fx: [.75, .7], fy: [.4], z0: 1.15, z1: 1.3 }),
      framed(16, 1, { d: 3.8, cy: 1080, h: 860, fx: [.55], fy: [.5], z0: 1.0, z1: 1.12 }),
    ],
    flashes: [B[4]],
    caps: [
      [-1, B[1], 'Baby *HANUMAN* woke up | *hungry.*', { y: 480, first: true }],
      [B[1], B[2], 'He saw the rising *Sun*… | and thought it was a *fruit.*', { y: 1400 }],
      [B[2], B[3], 'The *Sun* didn\'t burn him. | *"He\'s just a child."*', { y: 520 }],
      [B[3], B[4], 'Then he saw an even | *BIGGER* fruit…', { y: 520 }],
      [B[4], B[5], '*Indra* threw his *vajra.*', { y: 500, size: 66 }],
      [B[5], B[6], 'The Wind took his son… | and his *wind* with him.', { y: 480 }],
      [B[6], B[7], 'Then *8 gods* gave him | *8 gifts.*', { y: 500 }],
      [B[7], B[8], 'One *curse* made him | *forget* it all.', { y: 480 }],
    ],
    cover: { pan: [4, 0], fx: .5, fy: .32, top: ['THE BABY WHO', 'LEAPT AT THE SUN'] },
  },
  B: {
    shots: [
      (c, u) => { bleed(15, 1, { d: 4.4, z0: 1.05, z1: 1.18, fx: [.45], fy: [.45, .5] })(c, u); shade(c, 1240, 1640, .6); },
      framed(16, 0, { d: 3.8, cy: 1080, h: 820, fx: [.3, .4], fy: [.5], z0: 1.0, z1: 1.1 }),
      framed(16, 1, { d: 3.8, cy: 1080, h: 860, fx: [.55], fy: [.5], z0: 1.0, z1: 1.12 }),
      framed(20, 2, { d: 3.8, cy: 1010, h: 760, fx: [.6, .72], fy: [.55], z0: 1.0, z1: 1.12 }),
      (c, u) => { bleed(22, 1, { d: 3.8, z0: 1.0, z1: 1.1, fx: [.45], fy: [.55, .6] })(c, u); shade(c, 1240, 1640, .6); },
      (c, u) => { bleed(23, 0, { d: 3.8, z0: 1.25, z1: 1.0, fx: [.5], fy: [.4] })(c, u); shade(c, 1240, 1640, .55); },
      (c, u) => { bleed(25, 0, { d: 3.8, z0: 1.0, z1: 1.14, fx: [.6, .5], fy: [.3, .25] })(c, u); shade(c, 1240, 1640); },
      (c, u) => { bleed(42, 0, { d: 3.8, z0: 1.0, z1: 1.12, fx: [.5], fy: [.45, .35] })(c, u); shade(c, 1240, 1640, .7); },
    ],
    flashes: [B[5], B[7]],
    caps: [
      [-1, B[1], 'Baby *HANUMAN* was | *so* naughty…', { y: 1440, first: true }],
      [B[1], B[2], '…the rishis cursed him | to *forget* his strength.', { y: 480 }],
      [B[2], B[3], 'And he *forgot.* | For years.', { y: 480 }],
      [B[3], B[4], 'Then one day, at the edge | of the *ocean*…', { y: 520 }],
      [B[4], B[5], 'an old bear, *JAMBAVAN*, | reminded him.', { y: 1430 }],
      [B[5], B[6], '*He remembered.*', { y: 1440, size: 74 }],
      [B[6], B[7], 'One leap | across the *sea.*', { y: 1430 }],
      [B[7], B[8], 'And *LANKA* burned.', { y: 1430, size: 70 }],
    ],
    cover: { pan: [15, 1], fx: .45, fy: .5, z: 1.05, top: ['HE FORGOT', 'HIS STRENGTH'] },
  },
};
const CURRENT = CUTS[typeof CUT === 'string' ? CUT : 'A'];
CURRENT.shots.forEach((draw, i) => SHOTS.push({ a: B[i], b: B[i + 1] + .3, xf: i && !CURRENT.flashes.includes(B[i]) ? .3 : 0, draw }));
SHOTS.push(
  { a: B[8], b: B[9] + 1, draw: (c, u, t) => endCard(c, u, t) },
  { a: 50, b: 51, draw: (c, u, t) => reelCover(c, t) },
  { a: 60, b: 61, draw: (c, u, t) => story1(c, t) },
  { a: 61, b: 62, draw: (c, u, t) => story2(c, t) },
  { a: 62, b: 63, draw: (c, u, t) => story3(c, t) },
  { a: 63, b: 64, draw: (c, u, t) => story4(c, t) },
  { a: 64, b: 65, draw: (c, u, t) => story5(c, t) },
);
POST.push((c, t) => { for (const a of CURRENT.flashes) flash(c, Math.max(0, 1 - (t - a) / .18) * (t >= a ? .9 : 0), '#FFF4E0'); });
for (const [a, b, txt, o] of CURRENT.caps) say(a, b, txt, o.first ? { ...o, ...allLit(txt) } : o);

// ---------- the end card ----------
function comicCover(c, x, y, w, pop, t) {
  const h = w * 1.25;
  glow(c, x, y, w * .9, '#FFB347', .26 + .05 * Math.sin(t * 2));
  picture(c, PICS.cover, x, y, w, h, { pop, r: 10, shadow: 34, rot: Math.sin(t * 1.1) * .006 });
}
function pill(c, txt, x, y, pop, t, w = 460) {
  const k = popK(pop) * (1 + .03 * Math.max(0, Math.sin(t * 5))); if (k <= .01) return;
  c.save(); c.translate(x, y); c.scale(k, k); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 44); c.fill(); c.restore();
  text(c, txt, x, y + 3, '700 48px Poppins', '#FFFFFF', { pop });
}
function cardBg(c, t) {
  sky(c, [[0, '#120814'], [900, '#3A1A2A'], [1920, '#0B0608']]);
  glow(c, 540, 900, 760, '#C8642A', .45, 'screen');
  motes(c, { n: 50, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#FFD27A', a: .5, vx: 4, vy: -22, t });
}
function endCard(c, u, t) {
  const pk = d => u - d, X = 540;
  cardBg(c, t);
  text(c, 'A COMIC FROM', X, 455, '500 34px Poppins', '#F3DCC8', { pop: pk(.1), spacing: 4 });
  picture(c, PICS.logo, X - 175, 515, 74, 74, { pop: pk(.2), r: 37 });
  text(c, 'RISHI KATHA', X + 40, 518, '42px Marcellus', '#FBE0CF', { pop: pk(.2), spacing: 3 });
  comicCover(c, X, 900, 500, pk(.35), t);
  text(c, 'CHIRANJEEVI · ISSUE 2', X, 1255, '700 50px Cinzel', '#F4C46A', { pop: pk(.8), glow: ['rgba(244,196,106,.5)', 22], spacing: 2, maxW: 900 });
  text(c, '58 pages · every scene from the Ramayana', X, 1318, '500 33px Poppins', '#FFFFFF', { pop: pk(1.0), maxW: 920 });
  pill(c, 'rishikatha.com', X, 1405, pk(1.3), t);
  text(c, 'First 8 pages free · link in bio', X, 1490, '500 32px Poppins', '#F3DCC8', { pop: pk(1.6), maxW: 940 });
}

// ---------- the reel cover (title inside the 3:4 crop, y 240–1680) ----------
function reelCover(c, t) {
  const cv = CURRENT.cover;
  coverDraw(c, pan(...cv.pan), 0, 0, W, H, cv.z || 1.08, cv.fx, cv.fy);
  c.save(); const g = c.createLinearGradient(0, 1100, 0, 1700); g.addColorStop(0, 'rgba(8,4,10,0)'); g.addColorStop(1, 'rgba(8,4,10,.92)'); c.fillStyle = g; c.fillRect(0, 1100, W, 820); c.restore();
  c.save(); const g2 = c.createLinearGradient(0, 240, 0, 600); g2.addColorStop(0, 'rgba(8,4,10,.85)'); g2.addColorStop(1, 'rgba(8,4,10,0)'); c.fillStyle = g2; c.fillRect(0, 0, W, 600); c.restore();
  text(c, cv.top[0], 540, 330, '700 64px Cinzel', '#FBE0CF', { spacing: 4, glow: ['rgba(0,0,0,.9)', 20] });
  text(c, cv.top[1], 540, 425, '700 84px Cinzel', '#F4C46A', { spacing: 4, glow: ['rgba(0,0,0,.9)', 24], maxW: 1000 });
  text(c, 'HANUMAN', 540, 1440, '700 100px Cinzel', '#FFE7A6', { spacing: 6, glow: ['rgba(0,0,0,.9)', 24], maxW: 960 });
  text(c, 'A comic · CHIRANJEEVI 2', 540, 1530, '500 40px Poppins', '#FFFFFF', { glow: ['rgba(0,0,0,.9)', 16] });
}

// ---------- the Instagram stories (key words between y 270 and 1580: the app covers the rest) ----------
const glowTxt = ['rgba(0,0,0,.9)', 18];
function bottomShade(c, y0) { c.save(); const g = c.createLinearGradient(0, y0, 0, y0 + 520); g.addColorStop(0, 'rgba(8,4,10,0)'); g.addColorStop(1, 'rgba(8,4,10,.95)'); c.fillStyle = g; c.fillRect(0, y0, W, H - y0); c.restore(); }
// 1: the hungry baby's face, close
function story1(c, t) {
  c.save(); c.filter = 'blur(28px) brightness(.45)'; coverDraw(c, pan(3, 3), -60, -60, W + 120, H + 120, 1.0, .5, .5); c.restore();
  c.save(); c.beginPath(); c.rect(0, 180, W, 1000); c.clip(); coverDraw(c, pan(3, 3), 0, 180, W, 1000, 1.0, .5, .5); c.restore();
  bottomShade(c, 1080);
  text(c, 'He woke up hungry.', 540, 1290, '700 58px Cinzel', '#FBE0CF', { glow: glowTxt });
  text(c, 'Then he saw the Sun.', 540, 1380, '700 58px Cinzel', '#F4C46A', { glow: glowTxt, maxW: 980 });
  text(c, 'CHIRANJEEVI 2 · HANUMAN', 540, 1480, '500 36px Poppins', '#FFFFFF', { glow: glowTxt, spacing: 2 });
}
// 2: the leap, full
function story2(c, t) {
  coverDraw(c, pan(4, 0), 0, 0, W, H, 1.0, .5, .3);
  c.save(); const g = c.createLinearGradient(0, 200, 0, 640); g.addColorStop(0, 'rgba(8,4,10,.8)'); g.addColorStop(1, 'rgba(8,4,10,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 640); c.restore();
  bottomShade(c, 1160);
  text(c, 'Baby Hanuman thought', 540, 330, '700 56px Cinzel', '#FBE0CF', { glow: glowTxt });
  text(c, 'the SUN was a fruit.', 540, 415, '700 64px Cinzel', '#F4C46A', { glow: glowTxt, maxW: 1000 });
  text(c, 'So he jumped at it.', 540, 1400, '700 60px Cinzel', '#FFFFFF', { glow: glowTxt });
  text(c, 'Valmiki Ramayana, Uttara Kanda 35', 540, 1480, '500 32px Poppins', '#F3DCC8', { glow: glowTxt });
}
// 3: a poll frame: the bigger fruit (Airavata, 7.35.44–45); the poll sticker goes in the empty band at y ~1250
function story3(c, t) {
  cardBg(c, 0);
  const s = pan(6, 1), pw = 980, ph = pw * s.sh / s.sw, x = (W - pw) / 2, y = 470;
  c.fillStyle = '#0B0810'; c.fillRect(x - 10, y - 10, pw + 20, ph + 20);
  c.save(); c.beginPath(); c.rect(x, y, pw, ph); c.clip(); coverDraw(c, s, x, y, pw, ph, 1.0, .5, .5); c.restore();
  c.strokeStyle = 'rgba(241,231,210,.85)'; c.lineWidth = 3; c.strokeRect(x - 10, y - 10, pw + 20, ph + 20);
  text(c, 'After the Sun, baby Hanuman', 540, 300, '700 50px Cinzel', '#FBE0CF', { maxW: 1000 });
  text(c, 'tried to eat a BIGGER fruit.', 540, 375, '700 54px Cinzel', '#F4C46A', { maxW: 1000 });
  text(c, 'What was it?', 540, y + ph + 110, '700 62px Cinzel', '#FFFFFF');
}
// 4: the cover and the link
function story4(c, t) {
  cardBg(c, 0);
  c.save(); c.translate(540, 330); c.rotate(-.04); c.fillStyle = '#F15A24'; c.beginPath(); c.roundRect(-190, -40, 380, 80, 40); c.fill(); c.restore();
  text(c, 'NEW · A COMIC', 540, 333, '700 40px Poppins', '#FFFFFF', { spacing: 2 });
  comicCover(c, 540, 820, 560, null, 0);
  text(c, 'CHIRANJEEVI · ISSUE 2', 540, 1210, '700 50px Cinzel', '#F4C46A', { glow: ['rgba(244,196,106,.5)', 22], spacing: 2, maxW: 900 });
  text(c, '58 pages. Every scene from the Ramayana,', 540, 1280, '500 33px Poppins', '#FFFFFF', { maxW: 940 });
  text(c, 'with the verse numbers at the back.', 540, 1325, '500 33px Poppins', '#FFFFFF', { maxW: 940 });
  pill(c, 'Read it · link in bio', 540, 1440, null, 0, 500);
  text(c, 'rishikatha.com', 540, 1530, '500 34px Poppins', '#F3DCC8');
}
// 5: the free preview, three pages fanned
function story5(c, t) {
  cardBg(c, 0);
  text(c, 'Read the first', 540, 330, '700 56px Cinzel', '#FBE0CF');
  text(c, '8 PAGES FREE', 540, 420, '700 86px Cinzel', '#F4C46A', { glow: ['rgba(244,196,106,.5)', 22], spacing: 3 });
  const fan = [[PICS.pg3, 300, 880, -.12], [PICS.pg7, 780, 880, .12], [PICS.pg4, 540, 840, 0]];
  for (const [img, x, y, r] of fan) picture(c, img, x, y, 470, 588, { r: 8, shadow: 30, rot: r });
  text(c, 'Baby Hanuman, the Sun, Indra\'s vajra…', 540, 1260, '500 36px Poppins', '#FFFFFF', { maxW: 960 });
  text(c, 'and the day the world stopped breathing.', 540, 1310, '500 36px Poppins', '#FFFFFF', { maxW: 960 });
  pill(c, 'Read free · link in bio', 540, 1430, null, 0, 520);
  text(c, 'rishikatha.com', 540, 1530, '500 34px Poppins', '#F3DCC8');
}
