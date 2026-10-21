// shani_forms.js: ad 28, "Everyone FEARS Shani Dev. A devotee painted the 8 faces he shows those who love him." A
// collab with @gaurav_boii: his eight paintings of Shani Dev, one every 6 s (two bars of the 80 BPM score), from the
// feared (the punisher, the judge, the shadow's son) to the loved (the child, the warrior, the gentle one, the king).
// Each painting floats over its own blurred colours, pushes in slowly on the face, a gold sheen crosses it and a shadow
// sweeps it away; its name above, two captions below with one sourced fact or belief (STORYBOARD.md, Facts used).
// Then all eight in a spread, the ask, and the 15K Family Deal card.

const TL = { HOOK: 0, ASK: 54, CARD: 60, END: 66 };
const ORDER = ['danda', 'nyaya', 'chhaya', 'tapasvi', 'bal', 'yoddha', 'saumya', 'raj'];
const F0 = 6, FD = 6, XF = .7;   // the first form at 6 s, one every 6 s, crossfaded over .7 s
const fStart = i => F0 + i * FD;
const BOX = [960, 880], BY = 990;   // a painting fitted in 960 × 880, centred at (540, 990): y 550–1430
LOOK.bloom = .2;

// a form's shot: the painting over its own blurred colours, stars, dust; the title above
function formShot(c, key, u, t, o = {}) {
  const F = FORMS[key], img = PICS[F.pic], [w, h] = fitBox(img, ...BOX), dark = o.dark || 0;
  c.fillStyle = '#05040B'; c.fillRect(0, 0, W, H);
  blurBack(c, img, { a: .55 * (1 - dark * .6), drift: u / 7 });
  c.fillStyle = rgba('#05040B', .35 + .4 * dark); c.fillRect(0, 0, W, H);
  stars(c, 60, 11 + key.length, t, .5);
  const z = o.z ?? 1 + .1 * easeIO(u / (FD + XF));
  painting(c, img, 540, BY, w, h, { z, f: F.f, glow: F.col, sheen: seg(o.su ?? u, .5, 2.1), dark });
  if (o.halo) {   // Dandadhikari's gold halo still burning while he is sunk in the dark (the hook)
    const [hx, hy] = o.halo, px = (F.f[0] - .5) * w, py = (F.f[1] - .5) * h;
    const sx = 540 + px + ((hx - .5) * w - px) * z, sy = BY + py + ((hy - .5) * h - py) * z;
    glow(c, sx, sy, 330, '#FFC860', .55 * dark); glow(c, sx, sy, 120, '#FFF0C0', .5 * dark);
  }
  motes(c, { n: 34, seed: 7 + key.length, box: [-50, 300, W + 50, 1700], r: 3, col: F.col, a: .55, vx: 8, vy: -22, t });
  // a dark band under the captions, over the painting's foot
  const g = c.createLinearGradient(0, 1300, 0, 1540); g.addColorStop(0, 'rgba(5,4,11,0)'); g.addColorStop(.5, 'rgba(5,4,11,.78)'); g.addColorStop(1, 'rgba(5,4,11,.55)');
  c.fillStyle = g; c.fillRect(0, 1300, W, 260);
  if (o.title !== false) {
    const tg = c.createLinearGradient(0, 400, 0, 560); tg.addColorStop(0, 'rgba(5,4,11,0)'); tg.addColorStop(.45, 'rgba(5,4,11,.7)'); tg.addColorStop(1, 'rgba(5,4,11,0)');
    c.fillStyle = tg; c.fillRect(0, 400, W, 160);
    text(c, F.title, 520, 458, '700 66px Cinzel', '#F4C46A', { alpha: 1 - seg(o.su ?? u, FD - .6, FD - .15), pop: (o.su ?? u) - .4, glow: ['rgba(160,90,10,.9)', 26], spacing: 3, maxW: 860 });
  }
}

// ---------- 0–12.7: the hook (Dandadhikari sunk in the dark, his halo burning) becomes the first form ----------
const DARK0 = t => kf(t, [[0, 1], [2.7, 1], [3.7, .62], [5.5, .62], [6.4, 0]]);
SHOTS.push({ a: 0, b: fStart(1) + XF, draw(c, u, t) {
  formShot(c, 'danda', t, t, { dark: DARK0(t), halo: [.53, .15], title: t > F0, su: t - F0, z: 1 + .1 * easeIO(t / (F0 + FD + XF)) });
} });
// ---------- 6–54: the other seven, one every 6 s ----------
ORDER.slice(1).forEach((key, j) => {
  const a = fStart(j + 1);
  SHOTS.push({ a: a - .01, b: a + FD + XF, xf: XF, draw(c, u, t) { formShot(c, key, u, t); } });
});

// ---------- 54–60: all eight in a spread (two rows of four cards cropped on the figure) ----------
function cardCrop(c, key, x, y, w, h, o = {}) {
  const F = FORMS[key], img = PICS[F.pic], iw = img.naturalWidth, ih = img.naturalHeight;
  let sh = Math.min(ih, iw * h / w) * (o.cz ?? .8), sw = sh * w / h; if (sw > iw) { sw = iw; sh = sw * h / w; }
  const sx = clamp(F.f[0] * iw - sw / 2, 0, iw - sw), sy = clamp(F.f[1] * ih - sh * .28, 0, ih - sh);
  const k = popK(o.pop); if (k <= .01) return;
  c.save(); c.translate(x, y); c.scale(k, k); c.globalAlpha *= clamp(k);
  c.save(); c.shadowColor = 'rgba(0,0,0,.7)'; c.shadowBlur = 30; c.fillStyle = '#000'; c.fillRect(-w / 2, -h / 2, w, h); c.restore();
  c.drawImage(img, sx, sy, sw, sh, -w / 2, -h / 2, w, h);
  c.strokeStyle = rgba('#F4C46A', .7); c.lineWidth = 3; c.strokeRect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8);
  c.restore();
}
function spread(c, u, t) {
  c.fillStyle = '#05040B'; c.fillRect(0, 0, W, H);
  blurBack(c, PICS.sh_raj, { a: .4, drift: u / 7 });
  c.fillStyle = 'rgba(5,4,11,.5)'; c.fillRect(0, 0, W, H);
  glow(c, 540, 900, 900, '#F4C46A', .25, 'screen');
  stars(c, 80, 3, t, .55);
  const cw = 238, ch = 336, gap = 14, z = 1 + .04 * easeIO(u / 6.6);
  c.save(); c.translate(540, 905); c.scale(z, z); c.translate(-540, -905);
  ORDER.forEach((key, i) => {
    const col = i % 4, row = Math.floor(i / 4), x = 540 + (col - 1.5) * (cw + gap), y = 730 + row * (ch + gap);
    cardCrop(c, key, x, y, cw, ch, { pop: u - .1 - i * .08 });
  });
  c.restore();
  motes(c, { n: 50, seed: 21, box: [-50, 300, W + 50, 1700], r: 3, col: '#F4C46A', a: .6, vx: 6, vy: -24, t });
}
SHOTS.push({ a: TL.ASK - .01, b: TL.CARD + .4, xf: XF, draw(c, u, t) {
  spread(c, u, t);
  text(c, 'Paintings by @gaurav_boii', 520, 470, '700 44px Poppins', '#FBE0CF', { pop: u - .3, glow: ['rgba(0,0,0,.8)', 18], maxW: 860 });
  text(c, 'ॐ शं शनैश्चराय नमः', 520, 1290, '50px "Tiro Devanagari Sanskrit"', '#FFE2A0', { alpha: ease(seg(u, 1, 2)), glow: ['rgba(255,170,60,.9)', 24], maxW: 860 });
  const g = c.createLinearGradient(0, 1340, 0, 1520); g.addColorStop(0, 'rgba(5,4,11,0)'); g.addColorStop(.5, 'rgba(5,4,11,.75)'); g.addColorStop(1, 'rgba(5,4,11,0)');
  c.fillStyle = g; c.fillRect(0, 1340, W, 180);
} });

// ---------- 60–66: the card, held to the end ----------
SHOTS.push({ a: TL.CARD, b: TL.END + 1, xf: .4, draw(c, u, t) { dealCardCine(c, u, t); } });

// the painter's credit under each title, through the forms
POST.push((c, t) => {
  const a = Math.min(seg(t, 3, 3.6), 1 - seg(t, TL.ASK - .2, TL.ASK + .3));
  if (a > 0) text(c, 'painting · @gaurav_boii', 520, 516, '500 28px Poppins', '#FBE0CF', { alpha: .85 * a, glow: ['rgba(0,0,0,.9)', 12] });
});
// the shadow that sweeps each painting away (Chhaya's son: a shadow follows), and a soft gold lift as the next appears
POST.push((c, t) => {
  for (let i = 1; i <= ORDER.length; i++) {
    const t0 = i < ORDER.length ? fStart(i) : TL.ASK, k = seg(t, t0 - .6, t0 + .5);
    if (k > 0 && k < 1) {
      const x = lerp(-700, W + 700, easeIO(k)), g = c.createLinearGradient(x - 650, 0, x + 650, 0);
      g.addColorStop(0, 'rgba(3,2,8,0)'); g.addColorStop(.5, rgba('#030208', .8 * Math.sin(k * Math.PI))); g.addColorStop(1, 'rgba(3,2,8,0)');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
    }
    flash(c, Math.exp(-Math.max(0, t - t0) * 4) * (t >= t0 ? .1 : 0), '#FFE2A8');
  }
});

// ---------- captions: two to a painting, under it ----------
const CY = 1425;
say(-.35, 2.7, 'Everyone FEARS | *SHANI DEV*.', { y: CY, size: 72, at: Array(4).fill(-.35) });
say(2.7, 6.0, 'But a devotee painted | the *8 faces* he shows | those who LOVE him.', { y: CY - 10 });
const CAPS = {
  danda:   ['*Shanaishchara*: | the SLOW one.', 'His *Sade Sati*: | 7½ years of trials.'],
  nyaya:   ['*Karmaphal Data*: | giver of karma\'s fruit.', 'No bribe. No favourite. | Only your deeds.'],
  chhaya:  ['His mother *Chhaya* | was made of a SHADOW.', 'Like a shadow, | karma follows you.'],
  tapasvi: ['So lost in prayer | to *Krishna*…', '…he ignored his wife. | She cursed his GAZE.'],
  bal:     ['He gave his word | to sage *Pippalada*:', 'no child under 16 | will suffer by him.'],
  yoddha:  ['Bow, arrow, *trishul*: | a warrior god.', 'He fights for those | who walk straight.'],
  saumya:  ['King *Dasharatha* | sang his praise.', 'He blessed him, | and all who sing it.'],
  raj:     ['Strong in your chart, | he makes a KING:', '*Shasha Yoga*, | a fortune built to last.'],
};
ORDER.forEach((key, i) => {
  const a = fStart(i), [c1, c2] = CAPS[key];
  say(a + .15, a + 3, c1, { y: CY });
  say(a + 3, a + FD, c2, { y: CY });
});
say(TL.ASK + .1, TL.ASK + 3, '8 faces. | ONE *Shani Dev*.', { y: CY, size: 64 });
say(TL.ASK + 3, TL.CARD + .1, 'Comment | *JAI SHANI DEV*', { y: CY, size: 66 });

// cover.html: the spread of all eight under the title, inside the 3:4 grid crop (y 240–1680)
if (window.COVER) {
  CAPTIONS.length = 0; SHOTS.length = 0; POST.length = 0;
  SHOTS.push({ a: 0, b: 99, draw(c, u, t) {
    spread(c, 3, 57);
    const g = c.createLinearGradient(0, 0, 0, 560); g.addColorStop(0, 'rgba(5,4,11,.8)'); g.addColorStop(1, 'rgba(5,4,11,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 560);
    text(c, '8 FACES OF', 540, 340, '700 70px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 24], spacing: 6 });
    text(c, 'SHANI DEV', 540, 452, '700 118px Cinzel', '#F4C46A', { glow: ['rgba(140,70,0,.9)', 30], spacing: 4, maxW: 980 });
    const b = c.createLinearGradient(0, 1300, 0, 1920); b.addColorStop(0, 'rgba(5,4,11,0)'); b.addColorStop(.3, 'rgba(5,4,11,.8)'); b.addColorStop(1, 'rgba(5,4,11,.9)'); c.fillStyle = b; c.fillRect(0, 1300, W, 620);
    text(c, 'Which one do YOU need?', 540, 1450, '700 58px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 20], maxW: 960 });
    text(c, 'paintings · @gaurav_boii', 540, 1540, '500 34px Poppins', '#FBE0CF', { glow: ['rgba(0,0,0,.9)', 12] });
  } });
}
