// addicted_props.js: the evening living room and the book for ad 7 ("Addicted", animated). World coordinates are the
// 1080×1920 frame at zoom 1. The room is split into depth layers so the camera can push through it like a multiplane:
// back (wall, lamp, TV, console), mid (floor, pouf and tablet, sofa) and the rug (under the boy).
const RM = {
  wall: '#7A5A46', wallLit: '#B4865E', wallDk: '#553E31', floor: '#5A4234', floorLn: '#4A3529',
  wood: '#4E3527', woodLt: '#6E4E39', woodDk: '#3A271D', tv: '#24212A', screen: '#302E37', sheen: '#46444F', glint: '#6C6976',
  shade: '#F2D29B', shadeDk: '#D9AE6E', brass: '#A7834A', lamp: '#FFC766', win: '#3F5574', winLt: '#5C7394', curtain: '#8E4B3A',
  jute: '#A98450', juteDk: '#86673C', juteLt: '#C29C62', pouf: '#9C4E3A', poufDk: '#7A3A2B', poufLt: '#B9654E',
  tab: '#3B3A40', tabLt: '#55545B', buzz: '#CFE2FF', sofa: '#56635E', sofaDk: '#434F4A', sofaLt: '#6C7A74',
  book: '#2E5F5A', bookDk: '#1F4541', pages: '#F4E9D2', ink: '#33231C',
};
const TV = { x: 150, y: 380, w: 780, h: 440 };   // the bezel; the screen is inset 18 px

// ---- back layer
function roomBack(t, o = {}) {
  boilSeed('wall');
  paint(rectPts(-300, -300, W + 600, 1380), { wash: RM.wall, ink: null });
  paint(ellPts(150, 560, 560, 680, 30, 20), { fill: RM.wallLit, fillOp: 150, bleed: .25, tex: .4, border: .2, ink: null });
  paint(ellPts(1040, 700, 320, 700, 24, 20), { fill: RM.wallDk, fillOp: 140, bleed: .25, tex: .4, border: .2, ink: null });
  // a window at dusk, top right
  boilSeed('window');
  paint(rectPts(730, 120, 270, 220, 2), { wash: RM.win, ink: RM.ink, sw: 1 });
  paint(ellPts(800, 300, 140, 60, 18), { fill: RM.winLt, fillOp: 120, bleed: .2, tex: .3, ink: null });
  inkLine([[865, 122], [865, 338]], 1.2, RM.woodDk); inkLine([[732, 230], [998, 230]], 1.2, RM.woodDk);
  paint([[990, 90], [1060, 90], [1070, 420], [1010, 430], [985, 300]], { wash: RM.curtain, ink: RM.ink, sw: 1, curv: .4 });
  // the floor lamp, left: brass pole, a cream drum shade, its light on the wall
  boilSeed('lamp');
  const fl = 1 + .025 * Math.sin(t * 13.1) * Math.sin(t * 4.3);
  glow(125, 470, 420 * fl, RM.lamp, .55);
  inkLine([[125, 520], [128, 820], [124, 1120]], 2.2, RM.brass, 'ink', .2);
  paint(ellPts(124, 1124, 62, 14, 16), { wash: RM.brass, ink: RM.ink, sw: .9 });
  paint([[48, 520], [202, 520], [180, 400], [70, 400]], { wash: RM.shade, fill: RM.shadeDk, fillOp: 60, bleed: .1, tex: .4, ink: RM.ink, sw: 1.1 });
  glow(125, 535, 120 * fl, '#FFE0A0', .8);
  // floor and skirting
  boilSeed('floor');
  paint(rectPts(-300, 1070, W + 600, 900), { wash: RM.floor, ink: null });
  inkLine([[-50, 1072], [W + 50, 1072]], 1.4, RM.woodDk, 'ink', 0);
  for (let i = 0; i < 7; i++) inkLine([[-60 + i * 190, 1080], [-260 + i * 240, 1960]], .8, RM.floorLn, 'inkfine', 0);
  glow(150, 1150, 380 * fl, RM.lamp, .25);
  // the console under the TV
  boilSeed('console');
  paint(rectPts(100, 870, 880, 160, 2), { wash: RM.wood, ink: RM.ink, sw: 1.1 });
  paint(rectPts(100, 858, 880, 20, 1), { wash: RM.woodLt, ink: RM.ink, sw: 1 });
  for (const x of [393, 687]) inkLine([[x, 882], [x, 1022]], .9, RM.woodDk, 'inkfine', 0);
  for (const x of [246, 540, 834]) paint(ellPts(x, 950, 22, 6, 10), { wash: RM.brass, ink: null });
  paint(rectPts(130, 1030, 30, 40, 1), { wash: RM.woodDk, ink: null }); paint(rectPts(920, 1030, 30, 40, 1), { wash: RM.woodDk, ink: null });
  paint(rectPts(250, 828, 120, 30, 1), { wash: '#2A2730', ink: RM.ink, sw: .8 });   // set-top box
  // the remote, untouched on the console
  boilSeed('remote');
  push(); translate(760, 848); rotate(-.12);
  paint(rrPts(-60, -11, 120, 22, 9), { wash: '#2C2A31', ink: RM.ink, sw: .8 });
  for (let i = 0; i < 4; i++) paint(ellPts(-38 + i * 22, 0, 4, 4, 8), { wash: i ? '#57545E' : '#9B4B3E', ink: null });
  pop();
  // the TV: switched off, the lamp reflected in its glass
  boilSeed('tv');
  paint(rectPts(505, 820, 70, 40, 1), { wash: RM.tv, ink: RM.ink, sw: .8 });
  paint(rrPts(TV.x, TV.y, TV.w, TV.h, 10, 1), { wash: RM.tv, ink: RM.ink, sw: 1.3 });
  const sx = TV.x + 18, sy = TV.y + 18, sw = TV.w - 36, sh = TV.h - 36;
  paint(rectPts(sx, sy, sw, sh), { wash: RM.screen, ink: null });
  paint([[sx, sy + sh * .55], [sx + sw * .38, sy], [sx + sw * .52, sy], [sx, sy + sh * .95]], { wash: RM.sheen, washOp: 120, ink: null });
  paint(ellPts(sx + 70, sy + 110, 38, 26, 14), { wash: '#6A5A48', washOp: 200, ink: null });   // the lamp's reflection
  glow(sx + 70, sy + 110, 60, RM.lamp, .35);
  // the glint: o.glint 0..1 slides a streak of lamp light across the glass, left to right
  const g = o.glint ?? -1;
  if (g > 0 && g < 1) {
    boilSeed('glint');
    const k = ease(g), cx = sx + lerp(-120, sw + 120, k), wd = 46, sl = 150;
    const clip = x => clamp(x, sx, sx + sw), op = Math.sin(Math.PI * k);
    const quad = (w0, col, a) => { const x0 = cx - w0, x1 = cx + w0;
      paint([[clip(x0 + sl), sy], [clip(x1 + sl), sy], [clip(x1 - sl), sy + sh], [clip(x0 - sl), sy + sh]], { wash: col, washOp: 255 * a, ink: null }); };
    if (cx + wd + sl > sx && cx - wd - sl < sx + sw) { quad(wd, RM.sheen, .7 * op); quad(wd * .35, RM.glint, .85 * op); glow(clip(cx), sy + sh / 2, 140, '#FFE6C0', .22 * op); }
  }
}

// ---- mid layer: the pouf with the tablet face down on it (buzz 0..1 lights its edges and shakes it), the sofa arm
function roomMid(t, o = {}) {
  // a potted plant on the right
  boilSeed('plant');
  const sway = .03 * Math.sin(t * 1.1);
  paint([[905, 1130], [1075, 1130], [1055, 1300], [925, 1300]], { wash: '#8A5A3C', ink: RM.ink, sw: 1.1, curv: .2 });
  paint(ellPts(990, 1130, 86, 16, 16), { wash: '#6A432C', ink: RM.ink, sw: 1 });
  for (const [a, l, c] of [[-1.9, 300, '#4F6B44'], [-1.45, 380, '#5E7A4E'], [-1.1, 330, '#4F6B44'], [-2.3, 260, '#5E7A4E'], [-.8, 250, '#6B8758'], [-1.7, 230, '#6B8758']]) {
    const aa = a + sway * (1 + l / 400), tip = [990 + Math.cos(aa) * l, 1125 + Math.sin(aa) * l], mid = [990 + Math.cos(aa + .12) * l * .55, 1125 + Math.sin(aa + .12) * l * .55];
    inkLine([[990, 1125], mid, tip], 1.4, '#3C4F33', 'ink');
    const nx = -(tip[1] - mid[1]) / l, ny = (tip[0] - mid[0]) / l, m2 = [lerp(mid[0], tip[0], .45), lerp(mid[1], tip[1], .45)];
    paint([mid, [m2[0] + nx * 52, m2[1] + ny * 52], tip, [m2[0] - nx * 52, m2[1] - ny * 52]], { wash: c, ink: RM.ink, sw: .9, curv: .7 });
    inkLine([mid, tip], .6, '#3C4F33', 'inkfine');
  }
  boilSeed('pouf');
  const px = 205, py = 1215, ps = 1.25;
  push(); translate(px, py); scale(ps); translate(-px, -py);
  paint(ellPts(px, py + 110, 150, 34, 20), { fill: '#2A1B12', fillOp: 90, bleed: .25, tex: .3, ink: null });
  paint([[px - 130, py], [px - 136, py + 92], [px - 60, py + 118], [px + 60, py + 118], [px + 136, py + 92], [px + 130, py]], { wash: RM.pouf, ink: RM.ink, sw: 1.1, curv: .4 });
  for (let i = -2; i <= 2; i++) inkLine([[px + i * 52, py + 12], [px + i * 56, py + 112]], .8, RM.poufDk, 'inkfine', 0);
  paint(ellPts(px, py, 130, 40, 24), { wash: RM.poufLt, ink: RM.ink, sw: 1.1 });
  glow(px - 60, py - 10, 120, RM.lamp, .3);
  // the tablet, face down
  boilSeed('tablet');
  const b = o.buzz ?? 0, on = b > 0 && b < 1 ? Math.sin(Math.PI * clamp(b * 1.1)) : 0;
  const jx = on ? Math.sin(t * TAU * 26) * 3.5 * on : 0, jr = on ? Math.sin(t * TAU * 21) * .02 * on : 0;
  push(); translate(px + 4 + jx, py - 4); rotate(-.08 + jr);
  if (on > 0) {   // light leaks from under its edges onto the pouf
    for (const [x, y] of [[-78, -30], [0, -34], [78, -30], [-90, 0], [90, 0], [-78, 30], [0, 34], [78, 30]]) glow(x, y, 70, RM.buzz, .95 * on * (.85 + .15 * Math.sin(t * 40 + x)));
  }
  paint(rrPts(-86, -30, 172, 60, 10), { wash: RM.tab, ink: RM.ink, sw: 1 });
  paint(rrPts(-80, -26, 60, 52, 8), { wash: RM.tabLt, washOp: 120, ink: null });
  paint(ellPts(-62, -14, 6, 6, 10), { wash: '#1E1D22', ink: null });   // the camera lens
  pop();
  if (on > .15) {   // buzz marks either side
    boilSeed('buzz');
    for (const s of [-1, 1]) for (const r of [104, 122]) inkLine([[px + s * r, py - 34], [px + s * (r + 10), py - 8], [px + s * r, py + 18]], 1.4, '#F3E7CF', 'ink');
  }
  pop();
}

// ---- the round braided jute rug under the boy
function rug(cx = 540, cy = 1650, rx = 640, ry = 310) {
  boilSeed('rug');
  paint(ellPts(cx, cy, rx, ry, 40, 4), { wash: RM.jute, ink: RM.ink, sw: 1 });
  for (let i = 1; i <= 6; i++) inkLine(ellPts(cx, cy, rx * (1 - i * .13), ry * (1 - i * .13), 40, 0).concat([[cx + rx * (1 - i * .13), cy]]), .6, mixCol(RM.jute, RM.juteDk, .6), 'inkfine', .5);
  paint(ellPts(cx - rx * .35, cy - ry * .45, rx * .5, ry * .35, 20), { fill: RM.juteLt, fillOp: 90, bleed: .25, tex: .5, ink: null });
}

// ---- the book. Spread textures at three sizes, so it stays sharp when the camera dives into a page without
// shimmering when it's small. book() draws in lap space (origin = the middle of the spine).
const _spreadTex = {};
function spreadTex(name, screenW) {
  const sizes = name === 'spread1' ? [1200, 2400, 4400] : [1200];
  const w = sizes.find(s => s >= screenW) || sizes[sizes.length - 1], key = name + w;
  if (!_spreadTex[key]) {
    const g = createGraphics(w, w / 2); g.pixelDensity(1);
    const c = g.drawingContext; c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(PICS[name], 0, 0, w, w / 2);
    _spreadTex[key] = g;
  }
  return _spreadTex[key];
}
// Real art inside the paint: lands on what's painted so far, under anything painted after it (like glow()).
function art(name, screenW, dx, dy, dw, dh, sx, sy, sw, sh) {
  const g = spreadTex(name, screenW), k = g.width / 5100;   // source rect in native 5100×2550 spread pixels
  flushBrush(); image(g, dx, dy, dw, dh, sx * k, sy * k, sw * k, sh * k);
}
// pw: page width (px, lap space). flip 0..1 turns the right page over to the left: before it the book is open on
// `before`, after it on `after`. zoom = the camera's zoom (picks the texture size).
function book(pw, o = {}) {
  const ph = pw, zoom = o.zoom || 1, f = clamp(o.flip ?? 0), sw = 1.1, sw2 = pw * 2 * zoom;
  const A = o.before || 'spread2', B = o.after || 'spread1', N = 2550 / pw;   // native px per lap px
  boilSeed('book');
  paint(rrPts(-pw - 14, -ph / 2 - 12, pw * 2 + 28, ph + 26, 8), { wash: RM.book, ink: RM.ink, sw });            // the cover boards
  paint(rectPts(-pw - 6, -ph / 2 - 4, pw * 2 + 12, ph + 10), { wash: RM.pages, ink: RM.ink, sw: sw * .8 });       // the page block
  for (const s of [-1, 1]) for (let i = 1; i <= 3; i++) inkLine([[s * (pw + 1 + i * 1.6), -ph / 2 + 2], [s * (pw + 1 + i * 1.6), ph / 2 + 3]], .35, '#CDBB98', 'inkfine', 0);
  // the pages under the turning one: left = the old spread until the page lands, right = the new spread
  const left = f < 1 ? A : B, right = f > 0 ? B : A;
  art(left, sw2, -pw, -ph / 2, pw, ph, 0, 0, 2550, 2550);
  art(right, sw2, 0, -ph / 2, pw, ph, 2550, 0, 2550, 2550);
  if (f > 0 && f < 1) {
    const c = Math.cos(Math.PI * f), wd = pw * c, lift = Math.sin(Math.PI * f) * ph * .06;
    boilSeed('flipshadow');
    const shx = wd > 0 ? wd : 0;   // a soft shadow where the page will land
    paint([[shx, -ph / 2], [shx + 26 * Math.sin(Math.PI * f), -ph / 2], [shx + 26 * Math.sin(Math.PI * f), ph / 2], [shx, ph / 2]], { fill: '#2A1B12', fillOp: 70, bleed: .2, tex: .2, ink: null });
    if (wd > 0) art(A, sw2, 0, -ph / 2 - lift, Math.max(1, wd), ph, 2550, 0, 2550, 2550);
    else art(B, sw2, wd, -ph / 2 - lift, Math.max(1, -wd), ph, 0, 0, 2550, 2550);
    boilSeed('flipedge');
    paint(rectPts(Math.min(0, wd), -ph / 2 - lift, Math.max(2, Math.abs(wd)), ph), { wash: '#FFF6E2', washOp: 40 + 60 * (1 - Math.abs(c)), ink: RM.ink, sw: sw * .8 });
  }
  boilSeed('spine');
  paint(rectPts(-10, -ph / 2, 20, ph), { fill: '#3A2416', fillOp: 70, bleed: .2, tex: .2, ink: null });
  inkLine([[0, -ph / 2], [0, ph / 2]], .7, '#5A4030', 'inkfine', 0);
  paint(rectPts(-pw, -ph / 2, pw * 2, ph), { ink: RM.ink, sw: sw * .9 });
}

// ---- dust in the lamp light: a few motes drifting, pure functions of t
function motes(t, n = 9) {
  boilSeed('motes');
  for (let i = 0; i < n; i++) {
    const x = 20 + hash(i + 1) * 210 + 25 * Math.sin(t * .35 + i * 2.1), y = 560 + frac(hash(i + 7) + t * (.012 + .008 * hash(i + 3))) * 500;
    glow(x, y, 9 + 6 * hash(i + 5), '#FFE2B0', .55 + .3 * Math.sin(t * 1.3 + i));
  }
}

// ---- the reverse angle: the wall behind him, a shelf of books, the sofa; the lamp is off screen to the right
function roomFront(t) {
  boilSeed('fwall');
  paint(rectPts(-300, -300, W + 600, 1500), { wash: RM.wall, ink: null });
  paint(ellPts(1060, 560, 620, 760, 30, 20), { fill: RM.wallLit, fillOp: 150, bleed: .25, tex: .4, border: .2, ink: null });
  paint(ellPts(0, 800, 380, 800, 24, 20), { fill: RM.wallDk, fillOp: 130, bleed: .25, tex: .4, border: .2, ink: null });
  glow(1080, 560, 520 * (1 + .025 * Math.sin(t * 13.1) * Math.sin(t * 4.3)), RM.lamp, .4);
  // a shelf of picture books, left
  boilSeed('shelf');
  paint(rectPts(30, 760, 270, 18, 1), { wash: RM.woodLt, ink: RM.ink, sw: 1 });
  const spines = [['#C0543A', 120], ['#2E5F5A', 140], ['#E0A23C', 110], ['#7B5CA8', 130], ['#3A9C98', 118], ['#D97757', 136]];
  let bx = 44; for (const [c, h] of spines) { const w = 30; paint(rectPts(bx, 760 - h, w, h, 1), { wash: c, ink: RM.ink, sw: .8 }); inkLine([[bx + 6, 760 - h + 16], [bx + w - 6, 760 - h + 16]], .7, '#F3E4C4', 'inkfine', 0); bx += w + 4; }
  push(); translate(262, 742); rotate(-.32); paint(rectPts(-15, -60, 30, 120, 1), { wash: '#F15A24', ink: RM.ink, sw: .8 }); pop();
  // the sofa behind him
  boilSeed('fsofa');
  paint([[-60, 1010], [300, 960], [780, 960], [1140, 1010], [1140, 1330], [-60, 1330]], { wash: RM.sofa, ink: RM.ink, sw: 1.2, curv: .3 });
  paint(rrPts(60, 1000, 440, 230, 60), { wash: RM.sofaLt, ink: RM.ink, sw: 1 });
  paint(rrPts(580, 1000, 440, 230, 60), { wash: RM.sofaLt, ink: RM.ink, sw: 1 });
  paint(rectPts(-60, 1220, 1200, 110), { wash: RM.sofaDk, ink: RM.ink, sw: 1 });
  paint(ellPts(900, 1080, 260, 160, 20), { fill: '#8A9A92', fillOp: 70, bleed: .2, tex: .4, ink: null });
  boilSeed('ffloor');
  paint(rectPts(-300, 1330, W + 600, 900), { wash: RM.floor, ink: null });
  inkLine([[-50, 1332], [W + 50, 1332]], 1.4, RM.woodDk, 'ink', 0);
  rug(540, 1720, 660, 250);
}

// The open book as its reader holds it up, in its own space (origin = the middle, pages pw square). turn 0 shows the
// outside (the cover wrap: back cover on the viewer's left, front cover on the right); turn 1 shows the inside, open on
// `inside`. In between it spins on its vertical axis like a flipped card.
function heldBook(pw, o = {}) {
  const k = clamp(o.turn ?? 0), sx = Math.cos(Math.PI * k), ax = Math.max(.02, Math.abs(sx)), ph = pw;
  push(); scale(ax, 1);
  if (sx > 0) {
    boilSeed('heldpages');
    paint(rectPts(-pw + 14, -ph / 2 - 16, pw * 2 - 28, 24), { wash: RM.pages, ink: RM.ink, sw: .9 });          // page edges above the covers
    for (let i = 1; i <= 3; i++) inkLine([[-pw + 20, -ph / 2 - 16 + i * 5], [pw - 20, -ph / 2 - 16 + i * 5]], .35, '#CDBB98', 'inkfine', 0);
    boilSeed('heldcover');
    paint(rrPts(-pw - 6, -ph / 2 - 6, pw * 2 + 12, ph + 12, 8), { wash: RM.book, ink: RM.ink, sw: 1.1 });
    art('wrap1', 0, -pw, -ph / 2, pw * 2, ph, 0, 0, 5100, 2550);
    boilSeed('heldspine');
    paint(rectPts(-8, -ph / 2, 16, ph), { fill: '#1F4541', fillOp: 60, bleed: .2, tex: .2, ink: null });
    paint(rectPts(-pw, -ph / 2, pw * 2, ph), { ink: RM.ink, sw: 1 });
  } else book(pw, { before: o.inside || 'spread1', after: o.inside || 'spread1', flip: 1, zoom: (o.zoom || 1) * ax });
  pop();
}

// Story light: motes and a few petals rising off the top of the open book (x0..x1 at y), pure functions of t.
function bookMagic(t, x0, x1, y, a = 1) {
  if (a <= 0) return;
  boilSeed('magic');
  for (let i = 0; i < 10; i++) {
    const life = 1.6 + hash(i + 2) * .8, ph = frac(t / life + hash(i + 11)), x = lerp(x0, x1, hash(i + 4)) + 30 * Math.sin(t * 2 + i), yy = y - ph * 340;
    const f = Math.sin(Math.PI * ph) * a;
    if (i % 3) glow(x, yy, 14 + 10 * hash(i), '#FFE2A8', f);
    else { push(); translate(x, yy); rotate(t * 2 + i); paint(ellPts(0, 0, 15, 8, 10), { wash: i % 2 ? '#F2A283' : '#F7C6C0', washOp: 255 * f, ink: null }); pop(); }
  }
}
