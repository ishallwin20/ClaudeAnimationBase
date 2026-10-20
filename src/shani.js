// shani.js: Shani Dev (Shanaishchara), standing: the dark sapphire-blue skin of the Matsya Purana's iconography
// (indranila), a black dhoti with a gold border, a deep-violet sash, a tall gold kirita set with a blue sapphire (neelam),
// long black hair, a thin moustache, gold kundals, and heavy-lidded eyes he keeps on his feet (his gaze is cursed).
// Plus his crow (shaniCrow). Load after bappa.js (U()), clawd.js (eyes() / mouth() / emote(), so feel() and emotions()
// drive him too) and shailputri.js (trishul(), for the trident he can hold).
// (x, y) is the ground point under him; u is the size unit (about 28u tall to the crown's tip, 8u wide at the dhoti).
//
// Body-local coordinates in u (y up is negative):
//   feet (±1.3, -.5) · legs -3.4..-.7 · dhoti -12..-3 · chest centre (0, -14.6) · shoulders (±3, -16.3)
//   head centre (0, -20.6), 3.3 × 3.15 · eyes (±1.25, -20.4) · mouth (0, -18.5) · kirita -22.8..-27.4 (the head is then
//   scaled 1.16× about the neck at (0, -18), so on screen the eyes sit at -20.8 and the kirita tops out near -28.3)
//
// Options (all optional):
//   pose:   walk (phase: the feet step), limp 0..1 (the left leg drags and the body dips and tips on its step: Parvati's
//           curse), dx, dy (in u), sq, rot, flip, hx (-1..1 head turn), htilt, lean (u: the upper body leans sideways),
//           bow 0..1 (the head bows, the eyes go to the floor)
//   arms:   handL / handR = [x, y] in u (default hanging relaxed), bendL / bendR, pray 0..1 (palms joined at the chest),
//           cover 0..1 (both hands over his eyes), armL(u, sw) / armR(u, sw) (upright hooks at the hands),
//           trishul (true: a trident in his right hand) + trishulA (radians)
//   face:   eyes ('normal' / 'look' / 'wide' / 'closed' / 'squeeze' are his own; every other kind is Clawd's), lid 0..1
//           (the heavy upper lids drop), down 0..1 (eyes on his feet: pupils down and lids half shut), lookX / lookY,
//           glow 0..1 (the cursed gaze: violet irises and a violet light at the eyes), brow (-1 stern .. 1 raised),
//           mouth ('smile' / 'flat' / 'frown' / 'O' / 'open' / 'sheepish' are his own, else Clawd's), squint, blush,
//           sweat, seed, tint + tintK
//   extras: emote + emoteK + emoteAge, boilKey, noShadow, swMul
//   others: pal (overrides SHN for one drawing: another god on his rig, Yama in yama.js), stache ('thin' (default) |
//           'curl' (a big handlebar) | 'none' | fn(u, sw) in head space)
// Helpers: shaniHand(x, y, u, o, s), shaniEye(x, y, u, o, s) (s = -1 screen-left eye, 1 screen-right), shaniHead(x, y, u, o).
const SHN = {
  skin: '#4E5A96', skinDk: '#353E70', skinLt: '#7C88C4', ink: '#1F1A2E',
  dhoti: '#34303F', dhotiDk: '#211E2B', dhotiLt: '#55506A', sash: '#5B4A9E', sashDk: '#3E3175',
  gold: '#EDB43C', goldDk: '#B67D1C', goldLt: '#FFE39A', gem: '#3F6FE0', gemLt: '#9DB8FF',
  hair: '#1C1826', hairLt: '#3C3550', white: '#F4EEF8', iris: '#1A1428', glow: '#B98CFF', lip: '#2E2440', ash: '#F4EEE4',
  crow: '#34324A', crowDk: '#1F1D2E', crowLt: '#5E5B7E', beak: '#4A4752', beakDk: '#2A2830',
};
const HS = 1.16;   // the head is drawn 1.16× about the neck (0, -18): a big chibi head like the rest of the cast
const SHN_SKIN = { col: SHN.skin, dk: SHN.skinDk, lt: SHN.skinLt };

function shaniArm(o, s) {
  const sh = [s * 3, -16.3];
  let ha = (s < 0 ? o.handL : o.handR) || [s * 3.45, -10.8];
  const pr = clamp(o.pray || 0), cv = clamp(o.cover || 0);
  if (pr > 0) ha = [lerp(ha[0], s * .42, pr), lerp(ha[1], -14.3, pr)];
  if (cv > 0) ha = [lerp(ha[0], s * 1.5, cv), lerp(ha[1], -20.9, cv)];
  const dx = ha[0] - sh[0], dy = ha[1] - sh[1], d = Math.hypot(dx, dy) || 1;
  let nx = -dy / d, ny = dx / d; if (nx * s < 0) { nx = -nx; ny = -ny; }
  const b = ((s < 0 ? o.bendL : o.bendR) ?? .55) * (1 + cv * 1.4);
  return [sh, [(sh[0] + ha[0]) / 2 + nx * b, (sh[1] + ha[1]) / 2 + ny * b], ha];
}
// the body's dip and tip on a limping step (in u and radians), shared by the drawing and the helpers
function shaniLimp(o) {
  if (o.walk == null || !o.limp) return [0, 0];
  const k = Math.max(0, Math.sin(o.walk * TAU)), l = clamp(o.limp);
  return [l * .9 * k, l * .07 * k];
}
function shaniLocal(x, y, u, o, px, py) {
  const sq = o.sq || 0, fx = o.flip ? -1 : 1, l = o.lean || 0, r = l * .035, [ld] = shaniLimp(o);
  const qx = px + l * .6, qy = py + 12, hx = qx * Math.cos(r) - qy * Math.sin(r), hy = qx * Math.sin(r) + qy * Math.cos(r) - 12;
  return [x + (o.dx || 0) * u + fx * hx * u * (1 + sq * .6), y + ((o.dy || 0) + ld) * u + hy * u * (1 - sq)];
}
function shaniHand(x, y, u, o, s) { const [, , h] = shaniArm(o, s); return shaniLocal(x, y, u, o, h[0], h[1]); }
const _shnH = v => -18 + (v + 18) * HS;   // a drawn head y → body y, through the head scale
function shaniHead(x, y, u, o = {}) { return shaniLocal(x, y, u, o, clamp(o.hx || 0, -1, 1) * .5, _shnH(-20.6) + (o.bow || 0) * .5); }
function shaniEye(x, y, u, o = {}, s = 1) { const hx = clamp(o.hx || 0, -1, 1); return shaniLocal(x, y, u, o, hx * .5 + (hx * .8 + s * 1.25) * HS, _shnH(-20.4) + (o.bow || 0) * .5); }

function shani(x, y, u, o = {}) {
  if (o.pal) {   // another god on his rig (Yama in yama.js): swap the palette in for this one drawing
    const keep = { ...SHN }; Object.assign(SHN, o.pal);
    try { shani(x, y, u, { ...o, pal: null }); } finally { Object.assign(SHN, keep); }
    return;
  }
  const id = o.boilKey ?? 'sh' + (++CLAWD_N), rs = p => boilSeed(`shani ${id} ${p}`);
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .04;
  const { col, dk, lt } = tintCols({ ...o, col: o.col || SHN.skin, dk: o.dk || SHN.skinDk, lt: o.lt || SHN.skinLt });
  const P = pts => U(pts, u), INK = SHN.ink, wk = o.walk, hx = clamp(o.hx || 0, -1, 1), lean = o.lean || 0;
  const [ldip, ltip] = shaniLimp(o), bw = clamp(o.bow || 0);

  if (!o.noShadow) { rs('shadow'); paint(ellPts(x, y + u * .1, u * 4.6 * (1 - Math.min(.5, Math.abs(o.dy || 0) * .05)), u * .9, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  const above = f => { push(); translate(0, ldip * u); rotate(ltip); f(); pop(); };   // everything above the legs rides the limp
  const upper = f => above(() => { push(); translate(0, -12 * u); rotate(lean * .035); translate(lean * .6 * u, 12 * u); f(); pop(); });
  const headT = () => { translate(hx * .5 * u, bw * .5 * u); translate(0, -18 * u); if (o.htilt) rotate(o.htilt); scale(HS); translate(0, 18 * u); };

  // ---- behind: the long hair down his back
  upper(() => {
    rs('backhair');
    push(); headT();
    paint(P([[-3.2, -21.5], [-3.6, -19], [-3.7, -16.6], [-3.1, -15.2], [-1.6, -15.9], [0, -16.2], [1.6, -15.9], [3.1, -15.2], [3.7, -16.6], [3.6, -19], [3.2, -21.5], [0, -23.2]]),
      { wash: SHN.hair, ink: INK, sw: sw * .8, curv: .4 });
    for (const s of [-1, 1]) inkLine(P([[s * 3.2, -19.5], [s * 3.35, -17.4], [s * 3, -15.8]]), sw * .45, SHN.hairLt, 'inkfine', .5);
    pop();
  });

  // ---- legs and feet below the dhoti (the left one drags on a limp)
  rs('legs');
  for (const s of [-1, 1]) {
    const bad = s < 0 && o.limp ? clamp(o.limp) : 0;
    const l = wk == null ? 0 : Math.max(0, Math.sin((wk + (s < 0 ? 0 : .5)) * TAU)) * .8 * (1 - bad * .8), cx = s * 1.35;
    paint(P([[cx - .9, -3.6], [cx + .9, -3.6], [cx + .85, -.75 - l], [cx - .85, -.75 - l]]), { wash: col, fill: dk, fillOp: 50, tex: .5, ink: INK, sw: sw * .85 });
    inkLine(P([[cx - .85, -1.5 - l], [cx + .85, -1.5 - l]]), sw * 1.1, SHN.gold, 'ink', 0);   // anklet
    paint(ellPts((cx + s * .15) * u, (-.5 - l) * u, 1.15 * u, .55 * u, 16, J), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .8 });
  }

  above(() => {
    // ---- the dhoti: black with a gold border, pleats down the front
    rs('dhoti');
    paint(P([[-2.9, -12.2], [2.9, -12.2], [3.4, -9], [3.8, -5.5], [4, -3.2], [1.4, -3], [.3, -3.6], [-.3, -3.6], [-1.4, -3], [-4, -3.2], [-3.8, -5.5], [-3.4, -9]]),
      { wash: SHN.dhoti, fill: SHN.dhotiDk, fillOp: 80, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .25 });
    for (const s of [-1, 1]) inkLine(P([[s * .35, -3.55], [s * 1.4, -3.15], [s * 3.9, -3.35]]), sw * 1.5, SHN.gold, 'ink', .4);   // gold hem
    inkLine(P([[0, -11.6], [-.25, -8], [0, -4]]), sw * 1.3, SHN.gold, 'ink', .4);   // the gold front pleat
    for (const k of [-1.6, 1.5]) inkLine(P([[k * .7, -11.2], [k, -7.5], [k * 1.2, -4]]), sw * .5, SHN.dhotiLt, 'inkfine', .5);
  });

  upper(() => {
    // ---- torso, sash, jewellery
    rs('torso');
    const chest = P([[-3, -16.9], [3, -16.9], [3.25, -14.6], [2.7, -12], [-2.7, -12], [-3.25, -14.6]]);
    paint(chest, { wash: col, ink: null, curv: .35 });
    paint(ellPts(-1.1 * u, -15.6 * u, 1.5 * u, .9 * u, 14, J * 2, -.3), { fill: lt, fillOp: 120, bleed: .2, tex: .8, border: .8, ink: null });
    paint(chest, { ink: INK, sw: sw * .9, curv: .35 });
    inkLine(P([[-.35, -13], [0, -12.8], [.35, -13]]), sw * .45, INK, 'inkfine', .5);   // navel
    paint(rrPts(-2.95 * u, -12.7 * u, 5.9 * u, .8 * u, .3 * u, J), { wash: SHN.gold, fill: SHN.goldDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });   // waistband
    rs('sash');
    paint(ribbon(P([[-2.6, -16.8], [-1, -15.2], [.9, -13.6], [2.7, -12.6]]), .95 * u, .8 * u), { wash: SHN.sash, fill: SHN.sashDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .65 });
    rs('neck');
    paint(P([[-.85, -18.4], [.85, -18.4], [.9, -16.8], [-.9, -16.8]]), { wash: col, fill: dk, fillOp: 60, tex: .5, ink: INK, sw: sw * .6 });
    inkLine(P([[-1.9, -17], [-.9, -15.9], [0, -15.6], [.9, -15.9], [1.9, -17]]), sw * 1.6, SHN.gold, 'ink', .6);   // necklace
    paint(P([[0, -15.7], [.4, -15.25], [0, -14.6], [-.4, -15.25]]), { wash: SHN.gem, ink: INK, sw: sw * .45 });      // the neelam
    paint(ellPts(-.1 * u, -15.3 * u, .1 * u, .12 * u, 6), { wash: SHN.gemLt, ink: null });

    // ---- head
    push(); headT();
    rs('ears');
    for (const s of [-1, 1]) {
      paint(ellPts(s * 3.25 * u, -20.3 * u, .55 * u, .85 * u, 12, J), { wash: col, fill: dk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
      push(); translate(s * 3.3 * u, -19.5 * u); rotate(Math.sin(T * 2.2 + s) * .1);
      paint(ellPts(0, .55 * u, .38 * u, .38 * u, 10), { wash: SHN.gold, fill: SHN.goldDk, fillOp: 50, ink: INK, sw: sw * .45 });   // kundal
      paint(ellPts(0, .55 * u, .15 * u, .15 * u, 6), { wash: SHN.gem, ink: null });
      pop();
    }
    rs('head');
    const head = ellPts(0, -20.6 * u, 3.3 * u, 3.15 * u, 30, J);
    paint(head, { wash: col, ink: null });
    paint(ellPts((-1.2 + hx) * u, -21.8 * u, 1.7 * u, .9 * u, 14, J * 2, -.2), { fill: lt, fillOp: 120, bleed: .2, tex: .85, border: .8, ink: null });
    paint(ellPts(0, -18.2 * u, 2.3 * u, .75 * u, 14, J), { fill: dk, fillOp: 60, bleed: .1, tex: .6, border: .5, ink: null });
    paint(head, { ink: INK, sw });
    rs('hairfront');
    paint(P([[-3.3, -20.3], [-3.4, -22.2], [-2.6, -23.5], [-1, -24], [0, -23.7], [1, -24], [2.6, -23.5], [3.4, -22.2], [3.3, -20.3], [2.85, -21.6], [1.6, -22.5], [0, -22.6], [-1.6, -22.5], [-2.85, -21.6]]),
      { wash: SHN.hair, ink: INK, sw: sw * .85, curv: .4 });
    // ---- the kirita: tall, tapering, gold, with a sapphire
    rs('kirita');
    paint(P([[-2.7, -22.9], [2.7, -22.9], [2.5, -24.2], [1.9, -25.1], [1.3, -26], [.6, -26.8], [0, -27.4], [-.6, -26.8], [-1.3, -26], [-1.9, -25.1], [-2.5, -24.2]]),
      { wash: SHN.gold, fill: SHN.goldDk, fillOp: 50, tex: .5, ink: INK, sw: sw * .8, curv: .15 });
    paint(ribbon(P([[-2.75, -23.1], [0, -23.45], [2.75, -23.1]]), .65 * u, .65 * u), { wash: SHN.goldLt, ink: INK, sw: sw * .5 });
    for (const k of [-1.6, 1.6]) inkLine(P([[k * .55, -24.3], [k * .3, -25.9]]), sw * .5, SHN.goldDk, 'inkfine', .3);
    paint(P([[0, -23.9], [.55, -24.75], [0, -25.75], [-.55, -24.75]]), { wash: SHN.gem, ink: INK, sw: sw * .5 });
    paint(ellPts(-.12 * u, -24.95 * u, .13 * u, .16 * u, 6), { wash: SHN.gemLt, ink: null });
    paint(ellPts(0, -27.5 * u, .28 * u, .28 * u, 8), { wash: SHN.gem, ink: INK, sw: sw * .4 });

    push(); translate(hx * .8 * u, 0);
    rs('tilak');   // a white ash tilak with a dark dot
    for (const yy of [-22.15, -21.85]) inkLine(P([[-.9, yy], [0, yy - .05], [.9, yy]]), sw * .7, SHN.ash, 'ink', .5);
    paint(ellPts(0, -21.65 * u, .16 * u, .16 * u, 8), { wash: SHN.ink, ink: null });
    if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 2.05 * u, -19.2 * u, .7 * u, .36 * u, 14), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
    // ---- eyes: heavy lids that drop, pupils that go to his feet, and the cursed violet glow
    rs('eyes');
    const kinds = Array.isArray(o.eyes) ? o.eyes : [o.eyes || 'normal', o.eyes || 'normal'];
    const down = clamp(o.down || 0) + bw * .6, gl = clamp(o.glow || 0), br = clamp(o.brow || 0, -1, 1);
    const own = k => ['normal', 'look', 'wide', 'closed', 'squeeze'].includes(k);
    if (kinds.every(own)) {
      const lx = (o.lookX || 0) * u * .2, ly = (clamp((o.lookY || 0) + down, -1, 1)) * u * .2;
      const blink = ((T * .9 + (o.seed || 0) * 1.7 + 2.2) % 3.6) < .12;
      [-1, 1].forEach((s, i) => {
        const k = (o.squint || 0) > .5 ? 'closed' : kinds[i], ex = s * 1.25 * u, ey = -20.4 * u, wide = k === 'wide';
        const by = -21.35 - (wide ? .35 : 0) - Math.max(0, br) * .3, bi = Math.min(0, br) * .35;   // brows: stern ones dip inward
        inkLine(P([[s * .55, by + .1 - bi], [s * 1.25, by - .15], [s * 1.95, by + .05]]), sw * 1.15, SHN.hair, 'ink', .4);
        if (k === 'squeeze') { inkLine([[ex - s * .55 * u, ey - .3 * u], [ex + s * .45 * u, ey], [ex - s * .55 * u, ey + .3 * u]], sw * 1.2, INK, 'ink', 0); return; }
        if (k === 'closed' || (blink && !wide && gl < .1)) {
          inkLine([[ex - .6 * u, ey], [ex, ey + .22 * u], [ex + .6 * u, ey]], sw * 1.15, INK, 'ink', .5);
          return;
        }
        const rx = (wide ? .7 : .62) * u, ry = (wide ? .62 : .46) * u;
        paint(ellPts(ex, ey, rx, ry, 16), { wash: SHN.white, ink: null });
        paint(ellPts(ex + lx, ey + ly, .33 * u, .38 * u, 12), { wash: gl > .05 ? mixCol(SHN.iris, SHN.glow, gl) : SHN.iris, ink: null });
        paint(ellPts(ex + lx - .1 * u, ey + ly - .13 * u, .1 * u, .11 * u, 8), { wash: SHN.white, ink: null });
        const lid = clamp((o.lid || 0) + down * .55 - (wide ? .3 : 0), 0, .95);   // the upper lid, in skin, then its line
        if (lid > .02) paint([[ex - rx * 1.15, ey - ry * 1.3], [ex + rx * 1.15, ey - ry * 1.3], [ex + rx * 1.15, ey - ry + lid * ry * 2], [ex - rx * 1.15, ey - ry + lid * ry * 2]], { wash: col, ink: null });
        const ly0 = ey - ry + lid * ry * 2;
        inkLine([[ex - rx * 1.05, Math.max(ey - ry * .1, ly0)], [ex - rx * .3, ly0 - ry * .05], [ex + rx * .4, ly0 - ry * .05], [ex + rx * 1.1, Math.max(ey - ry * .2, ly0)]], sw * 1.3, INK, 'ink', .5);
        inkLine([[ex - rx * .7, ey + ry * .95], [ex + rx * .6, ey + ry * .95]], sw * .45, SHN.skinDk, 'inkfine', .4);
      });
    } else { push(); translate(0, -20.4 * u); scale(.5); translate(0, 6 * u); eyes(u, o, sw / .5 * .85, [-1, 1], 0); pop(); }
    rs('nose');
    inkLine(P([[.02, -19.9], [-.12, -19.35], [.15, -19.25]]), sw * .55, SHN.skinDk, 'inkfine', .5);
    rs('mouth');
    const st = o.stache ?? 'thin';
    if (st === 'thin') for (const s of [-1, 1]) paint(ribbon(P([[s * .08, -18.95], [s * .65, -19.05], [s * 1.05, -18.8], [s * 1.12, -19.05]]), .3 * u, .07 * u), { wash: SHN.hair, ink: null });   // a thin moustache
    else if (st === 'curl') for (const s of [-1, 1]) {   // a big handlebar moustache, the tips curling up past the cheeks
      const wv = Math.sin(T * 2.4 + s) * .05;
      paint(ribbon(P([[s * .05, -19.0], [s * .8, -19.2], [s * 1.6, -18.95], [s * 2.25, -19.25 + wv], [s * 2.35, -19.85 + wv], [s * 2.0, -20.05 + wv]]), .62 * u, .1 * u), { wash: SHN.hair, ink: INK, sw: sw * .45, curv: .5 });
      inkLine(P([[s * .5, -19.15], [s * 1.4, -19.1], [s * 2.05, -19.35]]), sw * .4, SHN.hairLt, 'inkfine', .5);
    } else if (typeof st === 'function') st(u, sw);
    const m = o.mouth || 'flat', my = -18.45;
    if (m === 'smile') inkLine(P([[-.5, my], [0, my + .2], [.5, my]]), sw * .8, INK, 'ink', .6);
    else if (m === 'flat') inkLine(P([[-.42, my + .08], [.42, my + .08]]), sw * .8, INK, 'ink', 0);
    else if (m === 'frown') inkLine(P([[-.5, my + .22], [0, my], [.5, my + .22]]), sw * .8, INK, 'ink', .6);
    else if (m === 'sheepish') inkLine(P([[-.5, my + .05], [-.15, my + .17], [.2, my + .03], [.5, my - .1]]), sw * .8, INK, 'ink', .6);
    else if (m === 'O') paint(ellPts(0, (my + .2) * u, .22 * u, .28 * u, 10), { wash: SHN.lip, ink: INK, sw: sw * .5 });
    else if (m === 'open') paint(P([[-.5, my - .02], [.5, my - .02], [.35, my + .4], [0, my + .55], [-.35, my + .4]]), { wash: SHN.lip, ink: INK, sw: sw * .6, curv: .5 });
    else { push(); translate(0, my * u); scale(.4); translate(0, 4.3 * u); mouth(u, m, sw / .4 * .8); pop(); }
    if (o.sweat) { rs('sweat'); paint(P([[2.6, -23], [3, -22.1], [2.6, -21.7], [2.25, -22.1]]), { wash: '#9ED0F0', ink: INK, sw: sw * .4, curv: .6 }); }
    pop();
    pop();

    // ---- arms, last (over the face when they cover his eyes)
    const pr = clamp(o.pray || 0);
    for (const s of [-1, 1]) {
      rs('arm' + s);
      const [sh, el, ha] = shaniArm(o, s), hook = s < 0 ? o.armL : o.armR;
      if (s > 0 && o.trishul) { push(); translate(ha[0] * u, ha[1] * u); trishul(u * .95, sw, o.trishulA || 0, INK); pop(); }
      paint(ribbon(P([sh, el, ha]), 1.25 * u, .85 * u), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .85 });
      const d = Math.hypot(el[0] - sh[0], el[1] - sh[1]) || 1, nx = -(el[1] - sh[1]) / d * .6, ny = (el[0] - sh[0]) / d * .6, bx = lerp(sh[0], el[0], .55), by = lerp(sh[1], el[1], .55);
      inkLine(P([[bx - nx, by - ny], [bx + nx, by + ny]]), sw * 1.3, SHN.gold, 'ink', 0);   // armlet
      if (pr > .5 && s > 0) {   // joined palms, fingers up
        paint(P([[-.55, -13.6], [-.5, -15], [0, -16.1], [.5, -15], [.55, -13.6], [0, -13.3]]), { wash: col, ink: INK, sw: sw * .7, curv: .4 });
        inkLine(P([[0, -15.9], [0, -13.5]]), sw * .5, INK, 'inkfine', 0);
        continue;
      }
      if (pr > .5) continue;
      push(); translate(ha[0] * u, ha[1] * u);
      paint(ellPts(0, 0, .72 * u, .66 * u, 14, J), { wash: col, ink: INK, sw: sw * .75 });
      if (hook) hook(u, sw);
      pop();
    }
  });
  pop();

  if (o.glow > .05) {   // the cursed gaze lights up after everything, so the violet sits on top
    rs('glow');
    for (const s of [-1, 1]) { const [gx, gy] = shaniEye(x - (o.dx || 0) * u, y, u, o, s); glow(gx, gy, u * 2.4 * o.glow, SHN.glow, .7 * o.glow); }
  }
  if (o.emote) {
    rs('emote');
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
    emote(o.emote, top ? x : x + dir * 5.4 * u, y + dy + (top ? -30.5 : -24.5) * u * (1 - sq), u * 1.15, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// ---------------- Shani's crow ----------------
// shaniCrow(x, y, s, o): a crow in side view facing screen right (flip: left). (x, y) is the middle of its body; s is the
// size unit (the body is about 6.5s long). o: flip, flap (-1..1, the wings: + up), fly (feet tucked), caw 0..1 (the beak
// opens), eyes 'normal' | 'wide' | 'closed', look (-1..1), tail (-1..1), rot, boilKey.
function crowBeak(x, y, s, o = {}) { return [x + (o.flip ? -1 : 1) * 4.6 * s, y - 2 * s]; }
function shaniCrow(x, y, s, o = {}) {
  const id = o.boilKey ?? 'cr' + (++CLAWD_N), rs = p => boilSeed(`crow ${id} ${p}`), P = pts => U(pts, s), sw = clamp(s / 14, .35, 1.6), INK = SHN.ink;
  const fl = clamp(o.flap ?? 0, -1.2, 1.2), tl = (o.tail || 0) + Math.sin(T * 2.6) * .06;
  push(); translate(x, y); if (o.rot) rotate(o.rot); scale(o.flip ? -1 : 1, 1);
  const wing = (dark, key) => {
    rs(key);
    push(); translate(.2 * s, -.9 * s); rotate(-.3 - fl * 1);
    paint(P([[.5, -.2], [-1.4, -.9], [-3.6, -1], [-5.4, -.4], [-4.5, 0], [-5.1, .45], [-3.8, .6], [-4.2, 1], [-2.6, 1], [-.9, .8], [.4, .55]]), { wash: dark ? SHN.crowDk : SHN.crow, fill: SHN.crowDk, fillOp: 70, tex: .5, ink: INK, sw: sw * .7, curv: .3 });
    for (const k of [-2.9, -3.9]) inkLine(P([[k + 1, -.5], [k, .45]]), sw * .45, SHN.crowLt, 'inkfine', .4);
    pop();
  };
  rs('tail');
  paint(P([[-2.6, .1], [-5.4, .2 + tl], [-5.9, 1 + tl * 1.4], [-5.2, 1.5 + tl * 1.5], [-2.4, 1.2]]), { wash: SHN.crowDk, fill: SHN.crow, fillOp: 50, tex: .4, ink: INK, sw: sw * .6, curv: .2 });
  if (fl > -.2) wing(true, 'farwing');
  if (!o.fly) {
    rs('feet');
    for (const k of [-.4, .5]) { inkLine(P([[k, 1.9], [k + .1, 2.9]]), sw * 1.3, SHN.beakDk, 'ink', 0); inkLine(P([[k - .45, 3], [k + .65, 3]]), sw * 1.3, SHN.beakDk, 'ink', 0); }
  }
  rs('body');
  paint(P([[-2.9, .5], [-2.2, -1.3], [-.4, -2.1], [1.6, -2.1], [2.9, -1.2], [3.2, .2], [2.4, 1.6], [.4, 2.1], [-1.6, 1.7]]), { wash: SHN.crow, fill: SHN.crowDk, fillOp: 60, bleed: .06, tex: .6, border: .5, ink: INK, sw: sw * .9, curv: .5 });
  paint(ellPts(.6 * s, -1 * s, 1.6 * s, .6 * s, 12, 0, -.15), { fill: SHN.crowLt, fillOp: 110, bleed: .2, tex: .6, border: .6, ink: null });   // a blue sheen
  rs('head');
  const hx = 2.7, hy = -1.9, cw = clamp(o.caw || 0);
  paint(ellPts(hx * s, hy * s, 1.45 * s, 1.35 * s, 18), { wash: SHN.crow, fill: SHN.crowDk, fillOp: 40, tex: .5, ink: INK, sw: sw * .85 });
  paint(P([[hx + .9, hy + .25], [hx + 2.6, hy + .55 + cw * .6], [hx + .9, hy + .85]]), { wash: SHN.beakDk, ink: INK, sw: sw * .55 });            // lower beak
  paint(P([[hx + .85, hy - .45], [hx + 2.9, hy + .3], [hx + .9, hy + .45]]), { wash: SHN.beak, ink: INK, sw: sw * .65, curv: .2 });               // upper beak
  rs('eye');
  const ek = o.eyes || 'normal', ex = hx + .35, ey = hy - .3, lk = (o.look || 0) * .12;
  if (ek === 'closed') inkLine(P([[ex - .35, ey], [ex, ey + .2], [ex + .35, ey]]), sw * .9, PAL.cream, 'ink', .5);
  else {
    const r = ek === 'wide' ? .5 : .36;
    paint(ellPts(ex * s, ey * s, r * s, r * s, 10), { wash: SHN.white, ink: INK, sw: sw * .5 });
    paint(ellPts((ex + lk + .06) * s, ey * s, r * .55 * s, r * .6 * s, 8), { wash: SHN.iris, ink: null });
  }
  wing(false, 'nearwing');
  pop();
  boilSeed(`crow ${id} after`);
}

// Model sheet: studio.html?loop=shani, or node render.mjs --loop=shani --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.shani = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    const cells = [
      [{ down: 1, mouth: 'flat' }], [{ eyes: 'closed', pray: 1, mouth: 'smile' }], [{ lookX: -1, glow: .5 + .5 * Math.sin(t * 3), brow: -1 }],
      [{ cover: 1, mouth: 'sheepish', sweat: 1 }], [{ eyes: 'wide', mouth: 'O', trishul: true, handR: [4.6, -15] }], [{ walk: t * .9, limp: 1, down: .7, mouth: 'frown' }],
    ];
    cells.forEach(([over], i) => {
      const cx = 200 + (i % 3) * 340, gy = 860 + Math.floor(i / 3) * 860;
      shani(cx, gy, 24, { seed: i, ...over });
    });
    shaniCrow(880, 1480, 16, { flip: true, caw: .5 + .5 * Math.sin(t * 7), look: -1 });
    shaniCrow(170, 1420, 14, { fly: true, flap: Math.sin(t * 10) });
  };
  LOOPS.shani.len = 4;
})();
