// cine_devi.js: the Devi for the cinematic engine (cine.js), front view, in colour, lit by figure(). First drawn as
// Bhramari, the goddess of black bees (reel/bhramari-bees); the same figure is the base for a Cinematic Durga.
// Same units as cine_shiva.js: the feet stand at (0, 0), up is -y, the face is centred about (0, -815) as Shiva's, the
// crown's tip is about -1020. A close-up is the same drawing scaled up: translate, scale(k), translate(0, 815).
//
// devi(c, o): the whole figure. o (all optional):
//   t (seconds), light (1 lit from screen right, -1 from the left), wind (-1..1, + blows to screen right)
//   eyes (0 closed .. 1 open), fire (0..1 the irises burn gold), look ([x, y] irises)
//   arms: 4 (two raised behind, holding orbs of bees; the front right in abhaya, the front left on the trishul)
//   upper ('bees' | 'open'): the raised hands, cupping a swarm or open; bees (0..1): how many bees swirl in them and
//   stream from her hair (needs cine_sets.js: beeCloud, beeStream)
//   durga (true): Durga with eight arms and the gods' gifts: four more arms fanned behind (Kala's sword, Vayu's bow,
//   the Ocean's lotus, Indra's vajra) and the raised hands holding Vishnu's chakra (spinning) and Varuna's conch
//   tears (0..1): wet lids and tear tracks, drops running down the cheeks (Shatakshi weeping; ad 19)
//   skin, sari: colour overrides; armFx: figure() options for each arm (its own edge light: costly, colour shots only)
// deviHead(c, o): the head alone (neck, hair, crown, jewellery, face) at its rest position; same options, and pal
//   (colours over DEVI's) and crown (false: no mukut; Sita in cine_sita.js uses it so).
const DEVI = {
  skin: '#8C5538', skinSh: '#6A3B27', skinDk: '#4D291B', palm: '#A86E50', lip: '#7E1E26', lipLo: '#A02C34',
  hair: '#120C12', hairLt: '#2E2230', eyeW: '#EEE6DA', iris: '#24140E', kohl: '#0C0708', brow: '#140C0E',
  sari: '#9E1A28', sariSh: '#66101C', sariLt: '#C23A3E', border: '#E3A93B', borderSh: '#A6731F', blouse: '#7A1222',
  gold: '#E2AE45', goldSh: '#9A6E25', goldLt: '#FFE29A', ruby: '#C81E3A', emerald: '#1E8A5A', pearl: '#F3EBD8',
  steel: '#C3CAD3', steelSh: '#7E8794', bindi: '#D2142C',
};

// ---------- the head ----------
const DV_FACE = 'M 0 -749 C 8 -749 15 -751 21 -756 C 30 -763 37 -775 41 -789 C 44 -801 45.5 -813 45.5 -826 C 46 -846 43 -862 35 -872 C 26 -882 -26 -882 -35 -872 C -43 -862 -46 -846 -45.5 -826 C -45.5 -813 -44 -801 -41 -789 C -37 -775 -30 -763 -21 -756 C -15 -751 -8 -749 0 -749 Z';
const DV_NECK = 'M -25 -700 C -23 -726 -25 -752 -29 -790 L 29 -790 C 25 -752 23 -726 25 -700 Z';
function deviHead(c, o = {}) {
  const t = o.t || 0, eyes = o.eyes ?? 1, L = o.light ?? 1, g = o.wind ?? 0, S = { ...DEVI, ...(o.pal || {}), ...(o.skin ? { skin: o.skin } : {}) };
  // neck, the jaw's shadow
  fillPath(c, DV_NECK, S.skin);
  inside(c, DV_NECK, () => {
    c.save(); c.scale(L, 1); fillPath(c, 'M -34 -800 L -14 -800 C -12 -760 -14 -730 -18 -700 L -34 -700 Z', rgba(S.skinSh, .9)); c.restore();
    fillPath(c, 'M -40 -800 C -28 -768 -12 -756 0 -756 C 12 -756 28 -768 40 -800 L 40 -772 C 26 -746 -26 -746 -40 -772 Z', rgba(S.skinDk, .7));
  });
  // hair framing the face (behind the ears): a few wavy locks, lifted by the wind
  for (const s of [-1, 1]) {
    const w = g * s;
    for (let k = 0; k < 3; k++) {
      const x0 = s * (38 + k * 7), ph = t * 1.5 + k * 1.3 + s;
      limb(c, [[x0, -862 + k * 6], [s * (50 + k * 8) + Math.sin(ph) * 2, -820], [s * (54 + k * 9 + w * 4), -780], [s * (60 + k * 10 + w * 10) + Math.sin(ph + 1) * 3, -738 + k * 8], [s * (66 + k * 10 + w * 16), -700 + k * 12]], [16, 18, 16, 12, 3], k === 1 ? mixCol(S.hair, S.hairLt, .5) : S.hair, false);
    }
  }
  // ears and jhumkas (bell earrings with pearls)
  for (const s of [-1, 1]) {
    fillPath(c, `M ${s * 43} -834 C ${s * 53} -838 ${s * 56} -823 ${s * 54} -811 C ${s * 53} -802 ${s * 48} -797 ${s * 43} -799 Z`, s === -L ? S.skinSh : S.skin);
    const sw = Math.sin(t * 1.4 + s) * 1.2, ex = s * 49 + sw;
    ellipse(c, ex, -797, 4, 4, S.gold);
    fillPath(c, `M ${ex - 10} -770 C ${ex - 10} -784 ${ex - 5} -792 ${ex} -792 C ${ex + 5} -792 ${ex + 10} -784 ${ex + 10} -770 Z`, S.gold);
    fillPath(c, `M ${ex - 10} -770 C ${ex - 4} -768 ${ex + 4} -768 ${ex + 10} -770 L ${ex + 10} -773 C ${ex + 4} -771 ${ex - 4} -771 ${ex - 10} -773 Z`, S.goldSh);
    for (let i = 0; i < 5; i++) ellipse(c, ex - 8 + i * 4, -765.5, 1.8, 1.8, S.pearl);
    ellipse(c, ex, -782, 2.4, 2.4, S.ruby);
  }
  // face
  fillPath(c, DV_FACE, S.skin);
  inside(c, DV_FACE, () => {
    c.save(); c.scale(L, 1);
    fillPath(c, 'M -60 -900 L -31 -884 C -37 -862 -37 -840 -35 -822 C -34 -806 -31 -791 -26 -778 C -20 -766 -12 -757 -4 -750 L -60 -740 Z', S.skinSh);
    fillPath(c, 'M -2 -828 C -4.5 -814 -7 -802 -9.5 -793 C -7 -789.5 -4 -789 -1 -790 C -2 -801 -2 -814 -2 -828 Z', S.skinSh);
    strokePath(c, 'M 2.5 -824 C 3.3 -811 4 -801 3.6 -795', rgba('#D69C78', .5), 2.2);
    c.restore();
    for (const s of [-1, 1]) ellipse(c, s * 24, -796, 11, 7, rgba('#C0503E', .14));   // a flush on the cheeks
    ellipse(c, 0, -785, 6, 2, rgba(S.skinDk, .55));
    ellipse(c, 0, -761, 7, 2.6, rgba(S.skinSh, .9));
  });
  // eyes: large, almond, lined with kohl that sweeps out into a wing
  for (const s of [-1, 1]) {
    const ex = s * 18.5, ey = -821, op = clamp(eyes), up = lerp(4, -8.5, op), lw = 13;
    const shape = `M ${ex - lw} ${ey + 1} Q ${ex - 2 * s} ${ey + up * 1.3} ${ex + lw} ${ey - 1} Q ${ex} ${ey + 7} ${ex - lw} ${ey + 1} Z`;
    if (op > .04) {
      fillPath(c, shape, S.eyeW);
      inside(c, shape, () => {
        const lx = (o.look ? o.look[0] : 0) * 4, ly = (o.look ? o.look[1] : 0) * 2, f = o.fire || 0;
        ellipse(c, ex + lx, ey + .5 + ly, 5.8, 6.4, mixCol(S.iris, '#F2B33A', f));
        ellipse(c, ex + lx, ey + .5 + ly, 2.6, 3, mixCol('#0D0907', '#FFF3C0', f));
        ellipse(c, ex + lx + 1.8, ey - 1.6 + ly, 1.4, 1.4, '#FFF8EC');
        ellipse(c, ex, ey + up * .9, lw + 2, 5, rgba(S.skinDk, .4));
      });
      if (o.fire) glow(c, ex, ey, 26, '#FFB43A', .55 * o.fire);
    }
    // the upper lid in kohl, the wing, the lower line
    const lidW = 3.2;
    strokePath(c, `M ${ex - lw - 1} ${ey + 1.5} Q ${ex - 2 * s} ${ey + up * 1.3} ${ex + lw + 1} ${ey - .5}`, S.kohl, lidW);
    const wx = s > 0 ? ex + lw : ex - lw;
    fillPath(c, `M ${wx} ${ey - 2.2} L ${wx + s * 9} ${ey - 6.5} L ${wx - s * 1} ${ey + 1.2} Z`, S.kohl);
    if (op > .04) strokePath(c, `M ${ex - lw + 2} ${ey + 2.5} Q ${ex} ${ey + 7.5} ${ex + lw - 1} ${ey + 1.5}`, rgba(S.kohl, .7), 1.4);
    if (op < .3) for (let i = 0; i < 5; i++) { const u = (i + 1) / 6, x = lerp(ex - lw, ex + lw, u), y = ey + 1.5 + (up * 1.3 - 1) * 2 * u * (1 - u) * 1.2; strokePath(c, `M ${x} ${y} l ${(u - .5) * 2} 2.6`, S.kohl, 1.1); }
    // a fine arched brow
    fillPath(c, `M ${s * 6} -834 C ${s * 14} -842.5 ${s * 26} -844 ${s * 36} -837 C ${s * 26} -839.5 ${s * 15} -838.5 ${s * 7} -831.5 Z`, S.brow);
  }
  // tears: the lower lids wet, a glistening track down each cheek, drops welling and running down it
  if (o.tears > 0) {
    const k = clamp(o.tears);
    for (const s of [-1, 1]) {
      const ex = s * 18.5, ey = -821, x0 = ex - s * 5, len = 62 * k;
      strokePath(c, `M ${ex - 11} ${ey + 3} Q ${ex} ${ey + 8} ${ex + 11} ${ey + 2.5}`, rgba('#D8ECFF', .35 * k), 1.2);
      const track = `M ${x0} ${ey + 6} C ${x0 - s * 1.5} ${ey + 6 + len * .35} ${x0 + s * 1} ${ey + 6 + len * .7} ${x0 + s * 3} ${ey + 6 + len}`;
      strokePath(c, track, rgba('#BFD8F2', .22 * k), 2.2); strokePath(c, track, rgba('#FFFFFF', .3 * k), .7);
      for (let i = 0; i < 2; i++) {
        const u = frac(t * .55 + i * .5 + (s > 0 ? .27 : 0)), y = ey + 6 + len * u, a = k * Math.sin(Math.PI * u);
        ellipse(c, x0 + s * 3 * u, y, 2.4, 3.2, rgba('#E8F4FF', .9 * a)); ellipse(c, x0 + s * 3 * u - .8, y - 1, .9, .9, rgba('#FFFFFF', a));
        glow(c, x0 + s * 3 * u, y, 10, '#BFE0FF', .35 * a);
      }
    }
  }
  // nose tip, the nath (a gold ring through the left nostril, screen right), lips
  strokePath(c, 'M -7 -791.5 C -4 -788 4 -788 7 -791.5', S.skinDk, 1.8);
  c.strokeStyle = S.gold; c.lineWidth = 2.2; c.beginPath(); c.arc(9, -783, 9, -1.9, 2.6); c.stroke();
  ellipse(c, 13, -775, 2.2, 2.2, S.pearl); ellipse(c, 5.5, -774.5, 1.8, 1.8, S.ruby);
  fillPath(c, 'M -12.5 -771.5 C -6.5 -775.5 -2 -773.6 0 -774.6 C 2 -773.6 6.5 -775.5 12.5 -771.5 C 6 -770 -6 -770 -12.5 -771.5 Z', S.lip);
  fillPath(c, 'M -11 -771 C -6 -762.5 6 -762.5 11 -771 C 5 -770 -5 -770 -11 -771 Z', S.lipLo);
  strokePath(c, 'M -13 -771.5 C -6 -770 6 -770 13 -771.5', S.skinDk, 1.4);
  ellipse(c, 3, -766.5, 3.5, 1.2, rgba('#FFC8B0', .35));
  // bindi and sindoor
  ellipse(c, 0, -848, 4.6, 5.4, S.bindi);
  // hair cap, parted in the middle under the crown
  const CAP = 'M -48 -804 C -57 -848 -48 -892 0 -898 C 48 -892 57 -848 48 -804 C 48 -826 44 -850 36 -862 C 28 -874 10 -880 2 -872 L 0 -869 L -2 -872 C -10 -880 -28 -874 -36 -862 C -44 -850 -48 -826 -48 -804 Z';
  fillPath(c, CAP, S.hair);
  inside(c, CAP, () => { for (const s of [-1, 1]) for (let k = 0; k < 3; k++) strokePath(c, `M ${s * (4 + k * 3)} ${-884 + k * 3} C ${s * (24 + k * 3)} ${-884 + k * 4} ${s * (40 + k * 2)} ${-868 + k * 4} ${s * (47 - k)} ${-836 + k * 8}`, rgba(S.hairLt, .9), 1.5); });
  strokePath(c, 'M 0 -872 L 0 -852', '#C8142A', 2.6);                    // sindoor in the parting
  // the maang tikka: a chain down the parting to a pendant on the forehead
  strokePath(c, 'M 0 -900 L 0 -872', S.gold, 1.6); ellipse(c, 0, -866, 4.4, 5.2, S.gold); ellipse(c, 0, -866, 2.2, 2.8, S.ruby);
  if (o.crown !== false) deviCrown(c, t);
}
// the mukut: a jewelled band and a tall tiered crown with a finial, flared wings at the sides
function deviCrown(c, t) {
  const S = DEVI;
  // side wings, fanned
  for (const s of [-1, 1]) {
    fillPath(c, `M ${s * 36} -884 C ${s * 62} -896 ${s * 80} -918 ${s * 84} -948 C ${s * 70} -934 ${s * 56} -926 ${s * 42} -922 Z`, S.goldSh);
    fillPath(c, `M ${s * 38} -888 C ${s * 58} -898 ${s * 72} -916 ${s * 76} -938 C ${s * 64} -928 ${s * 52} -922 ${s * 40} -918 Z`, S.gold);
    ellipse(c, s * 62, -912, 3.4, 3.4, S.ruby);
  }
  // the tiers: three bands narrowing upward, each scalloped
  const tiers = [[-884, -926, 50, 42], [-926, -962, 40, 30], [-962, -992, 28, 18]];
  tiers.forEach(([y0, y1, w0, w1], i) => {
    const d = `M ${-w0} ${y0} C ${-w0} ${y0 - 14} ${-w1 - 4} ${y1 + 10} ${-w1} ${y1} L ${w1} ${y1} C ${w1 + 4} ${y1 + 10} ${w0} ${y0 - 14} ${w0} ${y0} Z`;
    fillPath(c, d, S.gold);
    inside(c, d, () => {
      fillPath(c, `M ${-w0 - 4} ${y0} L ${-w0 - 4} ${y1} L ${-w1 * .2} ${y1} C ${-w0 * .5} ${(y0 + y1) / 2} ${-w0 * .5} ${y0} ${-w0 * .3} ${y0} Z`, rgba(S.goldSh, .55));
      strokePath(c, `M ${-w0} ${y0 - 5} Q 0 ${y0 - 9} ${w0} ${y0 - 5}`, S.goldSh, 2);
      for (let k = -2; k <= 2; k++) { const x = k * w0 * .36, y = (y0 + y1) / 2 + 2; fillPath(c, `M ${x} ${y - 9} L ${x + 5} ${y} L ${x} ${y + 7} L ${x - 5} ${y} Z`, k ? S.goldLt : S.ruby); }
    });
    // scallops on top of each tier
    for (let k = -2; k <= 2; k++) { const x = k * w1 * .45; fillPath(c, `M ${x - 7} ${y1 + 1} C ${x - 6} ${y1 - 12} ${x + 6} ${y1 - 12} ${x + 7} ${y1 + 1} Z`, S.gold); }
  });
  // the finial: a lotus bud and a jewel
  fillPath(c, 'M 0 -1024 C 10 -1012 14 -1000 12 -990 L -12 -990 C -14 -1000 -10 -1012 0 -1024 Z', S.gold);
  fillPath(c, 'M 0 -1024 C 10 -1012 14 -1000 12 -990 L 0 -990 Z', S.goldSh);
  ellipse(c, 0, -1003, 3.6, 4.6, S.emerald);
  // the band over the brow, set with rubies and pearls
  fillPath(c, 'M -50 -876 C -30 -890 30 -890 50 -876 L 50 -886 C 30 -900 -30 -900 -50 -886 Z', S.gold);
  for (let k = -4; k <= 4; k++) ellipse(c, k * 10.5, -884 - (1 - (k / 4) ** 2) * 4.5, 2.6, 2.6, k % 2 ? S.pearl : S.ruby);
  glow(c, 0, -960, 90, '#FFD27A', .16 + .04 * Math.sin(t * 1.7));
}

// ---------- the body ----------
function devi(c, o = {}) {
  const t = o.t || 0, L = o.light ?? 1, wind = o.wind ?? .35, S = { ...DEVI, ...(o.skin ? { skin: o.skin } : {}), ...(o.sari ? { sari: o.sari } : {}) };
  const br = Math.sin(t * 1.5) * 1, gust = wind * (1 + .35 * Math.sin(t * 2.3) + .2 * Math.sin(t * 5.1)), bees = o.bees ?? 0;
  // long hair behind, a dark fall to the waist, its ends lifting in the wind
  fillPath(c, 'M -46 -880 C -84 -856 -110 -790 -116 -700 C -122 -620 -118 -540 -104 -470 L 104 -470 C 118 -540 122 -620 116 -700 C 110 -790 84 -856 46 -880 Z', S.hair);
  const tips = [];
  for (const s of [-1, 1]) for (let i = 0; i < 5; i++) {
    const x0 = s * (60 + i * 12), y0 = -820 + i * 40, ph = t * 1.6 + i * 1.2 + s, len = 300 - i * 30;
    const P = [[x0, y0], [s * (98 + i * 8) + gust * 10, y0 + len * .4 + Math.sin(ph) * 4], [s * (112 + i * 10) + gust * 26, y0 + len * .75 + Math.sin(ph + 1) * 8], [s * (124 + i * 12) + gust * 44, y0 + len + Math.sin(ph + 2) * 12]];
    limb(c, P, [34, 32, 22, 4], i % 2 ? S.hair : mixCol(S.hair, S.hairLt, .35), false);
    tips.push(P[3]);
  }
  // the raised back arms (behind everything else on the body)
  const upper = (s) => {
    const sh = [s * 104, -676], el = [s * 214, -748], wr = [s * 252, -884];
    limb(c, [sh, [s * 160, -716], el], [50, 46, 42], S.skin);
    limb(c, [el, [s * 236, -820], wr], [42, 38, 30], S.skin);
    if (s === -L) limb(c, [[s * 108, -690], [s * 166, -726], [s * 220, -756], [s * 242, -826], [s * 258, -880]], [20, 18, 16, 14, 10], rgba(S.skinSh, .85));
    ellipse(c, s * 160, -716, 26, 7, S.gold, s * -.5);                 // armlet
    ellipse(c, s * 248, -868, 17, 5.5, S.gold, s * .15);              // bracelet
    // the hand, palm up and open, fingers curled round what it holds
    const hx = wr[0], hy = wr[1] - 10;
    fillPath(c, `M ${hx - 22} ${hy + 8} C ${hx - 26} ${hy - 6} ${hx - 22} ${hy - 18} ${hx - 14} ${hy - 22} L ${hx + 16} ${hy - 22} C ${hx + 24} ${hy - 16} ${hx + 26} ${hy - 4} ${hx + 22} ${hy + 8} C ${hx + 10} ${hy + 16} ${hx - 10} ${hy + 16} ${hx - 22} ${hy + 8} Z`, S.skin);
    for (let k = 0; k < 4; k++) { const fx = hx - 15 + k * 10; limb(c, [[fx, hy - 18], [fx + (k - 1.5) * 2, hy - 34 - (k === 1 || k === 2 ? 4 : 0)]], [9.5, 8], S.skin); }
    limb(c, [[hx - s * 18, hy], [hx - s * 32, hy - 12], [hx - s * 36, hy - 26]], [13, 10, 8], S.skin);
    ellipse(c, hx, hy - 6, 13, 6, rgba(S.palm, .8));
    return [hx, hy - 52];
  };
  // Durga: four more arms fanned behind the shoulders (out and up, out and down), holding the gods' gifts
  if (o.durga) for (const s of [-1, 1]) {
    const sw = Math.sin(t * 1.1 + s) * 4;
    const A = [[s * 100, -672], [s * 220, -712], [s * 318, -812 + sw]], B = [[s * 100, -640], [s * 214, -596], [s * 318, -512 - sw]];
    for (const P of [A, B]) {
      limb(c, P, [46, 40, 32], S.skin);
      if (s === -L) limb(c, P.map(([x, y]) => [x - s * 4, y + 9]), [16, 14, 10], rgba(S.skinSh, .8));
      ellipse(c, (P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2, 20, 6, S.gold, Math.atan2(P[1][1] - P[0][1], P[1][0] - P[0][0]) + Math.PI / 2);
      ellipse(c, P[2][0] - s * 14, P[2][1] + (P === A ? 8 : -8), 15, 5, S.gold, s * .8);
    }
    const [ax, ay] = A[2], [bx, by] = B[2];
    if (s < 0) {
      // Kala's sword, raised; Vayu's bow, held upright
      fillPath(c, `M ${ax - 7} ${ay - 22} L ${ax - 14} ${ay - 250} L ${ax} ${ay - 290} L ${ax + 11} ${ay - 250} L ${ax + 7} ${ay - 22} Z`, S.steel);
      fillPath(c, `M ${ax} ${ay - 22} L ${ax} ${ay - 290} L ${ax + 11} ${ay - 250} L ${ax + 7} ${ay - 22} Z`, S.steelSh);
      fillPath(c, `M ${ax - 26} ${ay - 18} L ${ax + 26} ${ay - 18} L ${ax + 22} ${ay - 28} L ${ax - 22} ${ay - 28} Z`, S.gold);
      strokePath(c, `M ${bx - 4} ${by - 190} Q ${bx - 74} ${by} ${bx - 4} ${by + 190}`, S.goldSh, 9); strokePath(c, `M ${bx - 4} ${by - 190} Q ${bx - 74} ${by} ${bx - 4} ${by + 190}`, S.gold, 4);
      strokePath(c, `M ${bx - 4} ${by - 190} L ${bx - 4} ${by + 190}`, rgba('#F3EBD8', .8), 1.6);
    } else {
      // the lotus (the Ocean's gift), on a stem; Indra's vajra, held down
      limb(c, [[ax, ay - 14], [ax + 6, ay - 80], [ax + 2, ay - 130]], [7, 6, 5], '#3E7A3A', false);
      for (const r of [-.8, -.4, 0, .4, .8]) { c.save(); c.translate(ax + 2, ay - 130); c.rotate(r); fillPath(c, 'M 0 0 C -16 -14 -14 -40 0 -54 C 14 -40 16 -14 0 0 Z', r ? '#F2A2B8' : '#F7C2D0'); c.restore(); }
      ellipse(c, ax + 2, ay - 134, 8, 5, '#FFD86A');
      c.save(); c.translate(bx + 4, by); c.rotate(-s * .25);
      fillPath(c, 'M -9 -44 L 9 -44 L 9 44 L -9 44 Z', S.goldSh);
      for (const e of [-1, 1]) {   // a vajra: a grip and, at each end, prongs curling into a point
        ellipse(c, 0, e * 50, 14, 9, S.gold);
        for (const q of [-1, 0, 1]) fillPath(c, `M ${q * 6} ${e * 56} C ${q * 26} ${e * 76} ${q * 24} ${e * 104} ${q * 4} ${e * 124} C ${q * 12} ${e * 102} ${q * 10} ${e * 80} ${q * 2} ${e * 60} Z`, q ? S.gold : S.goldLt);
      }
      c.restore();
    }
    for (const [x, y] of [A[2], B[2]]) { ellipse(c, x, y, 21, 23, S.skin); ellipse(c, x + s * 6, y - 4, 9, 11, rgba(S.skinSh, .7)); }
  }
  const orbs = [upper(-1), upper(1)];
  // Durga's raised hands: Vishnu's chakra spinning on one, Varuna's conch in the other
  if (o.durga) {
    const [cx, cy] = orbs[0], [sx, sy] = orbs[1];
    glow(c, cx, cy + 10, 90, '#FFC86A', .4);
    c.save(); c.translate(cx, cy + 14); c.rotate(t * 3);
    c.strokeStyle = S.gold; c.lineWidth = 9; c.beginPath(); c.arc(0, 0, 34, 0, TAU); c.stroke();
    for (let k = 0; k < 12; k++) { c.rotate(TAU / 12); fillPath(c, 'M -5 -38 L 0 -54 L 5 -38 Z', S.goldLt); strokePath(c, 'M 0 -8 L 0 -30', S.goldSh, 3); }
    ellipse(c, 0, 0, 9, 9, S.ruby); c.restore();
    c.save(); c.translate(sx, sy + 22); c.rotate(.3);
    fillPath(c, 'M -30 10 C -40 -14 -24 -40 0 -44 C 26 -44 38 -24 34 -4 C 30 12 14 24 -6 26 C -18 26 -26 20 -30 10 Z', S.pearl);
    for (let k = 0; k < 4; k++) strokePath(c, `M ${-24 + k * 12} ${16 - k * 4} C ${-18 + k * 12} ${-6 - k * 4} ${-8 + k * 12} ${-24 - k * 2} ${4 + k * 10} ${-34 + k * 4}`, rgba('#B8A88A', .8), 2);
    fillPath(c, 'M -30 10 C -42 18 -50 28 -48 34 C -38 32 -26 24 -20 20 Z', '#E6DCC4'); c.restore();
  }
  // the trishul, held by the front left hand (screen right), behind that hand
  const X = 222;
  fillPath(c, `M ${X - 4.5} 10 L ${X - 4.5} -1100 L ${X + 4.5} -1100 L ${X + 4.5} 10 Z`, S.steelSh);
  fillPath(c, `M ${X - 1} 10 L ${X - 1} -1100 L ${X + 4} -1100 L ${X + 4} 10 Z`, S.steel);
  fillPath(c, `M ${X - 42} -1108 C ${X - 48} -1138 ${X - 44} -1170 ${X - 31} -1192 C ${X - 35} -1166 ${X - 33} -1138 ${X - 20} -1116 Z M ${X + 42} -1108 C ${X + 48} -1138 ${X + 44} -1170 ${X + 31} -1192 C ${X + 35} -1166 ${X + 33} -1138 ${X + 20} -1116 Z`, S.steel);
  fillPath(c, `M ${X - 44} -1098 C ${X - 28} -1120 ${X + 28} -1120 ${X + 44} -1098 L ${X + 36} -1092 C ${X + 18} -1108 ${X - 18} -1108 ${X - 36} -1092 Z`, S.steelSh);
  fillPath(c, `M ${X} -1232 C ${X + 13} -1206 ${X + 11} -1150 ${X + 5} -1110 L ${X - 5} -1110 C ${X - 11} -1150 ${X - 13} -1206 ${X} -1232 Z`, S.steel);
  fillPath(c, `M ${X} -1232 C ${X + 13} -1206 ${X + 11} -1150 ${X + 5} -1110 L ${X} -1110 Z`, S.steelSh);
  fillPath(c, `M ${X - 9} -1090 L ${X + 9} -1090 L ${X + 9} -1074 L ${X - 9} -1074 Z`, S.gold);
  limb(c, [[X, -1082], [X + 18 + gust * 20, -1070 + Math.sin(t * 6) * 6], [X + 40 + gust * 44, -1066 + Math.sin(t * 6 - 1) * 10], [X + 58 + gust * 66, -1052 + Math.sin(t * 6 - 2) * 14]], [12, 14, 10, 2], S.sariLt, false);
  // feet peeping out under the hem, with anklets and alta
  for (const s of [-1, 1]) {
    const foot = 'M 18 -26 C 16 -12 14 -4 18 0 L 70 0 C 74 -7 66 -13 56 -17 C 48 -20 44 -24 42 -28 Z';
    fillPath(c, s > 0 ? foot : mirrorX(foot), s === -L ? S.skinSh : S.skin);
    fillPath(c, s > 0 ? 'M 16 -2 L 72 -2 L 72 1 L 16 1 Z' : mirrorX('M 16 -2 L 72 -2 L 72 1 L 16 1 Z'), '#B0182A');
    for (let i = 0; i < 5; i++) ellipse(c, s * (24 + i * 4.5), -26 + Math.abs(i - 2) * .6, 2.2, 2.2, S.gold);
  }
  // the sari: a pleated skirt to the ground, its gold border at the hem, the front pleats fanned
  const SKIRT = 'M -68 -500 C -82 -330 -102 -160 -116 -14 L 116 -14 C 102 -160 82 -330 68 -500 Z';
  fillPath(c, SKIRT, S.sari);
  inside(c, SKIRT, () => {
    c.save(); c.scale(L, 1); fillPath(c, 'M -130 -520 L -40 -520 C -48 -360 -60 -180 -66 0 L -130 0 Z', rgba(S.sariSh, .75)); c.restore();
    // the pleats: a fan of folds from the navel to the hem, each with a lit edge
    for (let i = -4; i <= 4; i++) { const x0 = 6 + i * 4, x1 = 10 + i * 13; strokePath(c, `M ${x0} -486 C ${x0 + i * 1.5} -330 ${x1 - i * 2} -160 ${x1} -10`, rgba(S.sariSh, .85), 3); strokePath(c, `M ${x0 + 2} -480 C ${x0 + 2 + i * 1.5} -330 ${x1 + 2 - i * 2} -160 ${x1 + 3} -12`, rgba(S.sariLt, .35), 1.6); }
    // the pleats' gold border running down their front edge, and the hem
    strokePath(c, 'M 44 -486 C 50 -330 60 -160 66 -10', S.border, 7); strokePath(c, 'M 52 -486 C 58 -330 68 -160 74 -10', S.borderSh, 2);
    fillPath(c, 'M -130 -46 L 130 -46 L 130 0 L -130 0 Z', S.border);
    fillPath(c, 'M -130 -52 L 130 -52 L 130 -47 L -130 -47 Z', S.borderSh);
    for (let k = -12; k <= 12; k++) fillPath(c, `M ${k * 10} -40 L ${k * 10 + 4} -30 L ${k * 10} -20 L ${k * 10 - 4} -30 Z`, S.borderSh);
    // a scatter of gold buttis
    const rnd = lcg(17); for (let i = 0; i < 26; i++) { const x = -96 + rnd() * 192, y = -440 + rnd() * 360; ellipse(c, x, y, 2.4, 2.4, rgba(S.border, .8)); }
  });
  // the bare midriff, the navel
  const WAIST = 'M -60 -566 C -62 -546 -64 -524 -66 -496 L 66 -496 C 64 -524 62 -546 60 -566 Z';
  fillPath(c, WAIST, S.skin);
  inside(c, WAIST, () => { c.save(); c.scale(L, 1); fillPath(c, 'M -70 -570 L -40 -570 C -44 -546 -46 -524 -46 -494 L -70 -494 Z', S.skinSh); c.restore(); ellipse(c, 0, -522, 2.4, 3.6, S.skinDk); });
  fillPath(c, 'M -68 -506 Q 0 -496 68 -506 L 68 -494 Q 0 -484 -68 -494 Z', S.gold);                 // the waist chain
  for (let k = -6; k <= 6; k++) { const x = k * 10, y = -489 + (k / 6) ** 2 * -6; limb(c, [[x, y], [x, y + 9]], [2, 1.2], S.goldSh, false); ellipse(c, x, y + 11, 2, 2.4, S.gold); }
  // the blouse and the chest
  const TORSO = `M -60 -562 C -66 -600 -84 -640 -98 -668 C -104 -680 -110 -690 -118 -696 C -88 -716 -52 ${-720 + br} -24 -724 L 24 -724 C 52 ${-720 + br} 88 -716 118 -696 C 110 -690 104 -680 98 -668 C 84 -640 66 -600 60 -562 Z`;
  fillPath(c, TORSO, S.skin);
  inside(c, TORSO, () => {
    const CHOLI = `M -64 -572 C -82 -602 -96 -636 -104 -664 L 104 -664 C 96 -636 82 -602 64 -572 C 40 -566 -40 -566 -64 -572 Z`;
    fillPath(c, CHOLI, S.blouse);
    for (const s of [-1, 1]) strokePath(c, `M ${s * 92} -650 C ${s * 70} ${-604 + br} ${s * 30} ${-596 + br} ${s * 4} ${-612 + br}`, rgba('#4A0A14', .8), 3);
    strokePath(c, 'M -66 -574 C -40 -568 40 -568 66 -574', S.border, 3.5);
    c.save(); c.scale(L, 1); fillPath(c, 'M -130 -720 C -100 -690 -76 -650 -66 -600 C -62 -580 -60 -566 -60 -540 L -130 -540 Z', rgba(S.skinSh, .7)); c.restore();
  });
  // the pallu: from the right hip (screen left) across the chest and over the left shoulder (screen right), its border
  // on both edges; the end falls behind and flies in the wind
  const PALLU = `M -70 -520 C -40 -560 10 -620 60 -676 C 80 -698 98 -712 116 -712 C 128 -704 132 -690 128 -676 C 92 -650 50 -600 18 -560 C -6 -530 -30 -506 -48 -494 Z`;
  fillPath(c, PALLU, S.sari);
  inside(c, PALLU, () => {
    for (let i = 0; i < 4; i++) strokePath(c, `M ${-60 + i * 8} ${-512 + i * 4} C ${-20 + i * 8} ${-570 + i * 4} ${40 + i * 6} ${-640 + i * 4} ${104 + i * 4} ${-700 + i * 6}`, rgba(S.sariSh, .8), 2.6);
    c.save(); c.scale(L, 1); fillPath(c, 'M -100 -480 L 0 -480 L -60 -560 Z', rgba(S.sariSh, .5)); c.restore();
  });
  strokePath(c, 'M -70 -520 C -40 -560 10 -620 60 -676 C 80 -698 98 -712 116 -712', S.border, 6);
  strokePath(c, 'M -48 -494 C -30 -506 -6 -530 18 -560 C 50 -600 92 -650 128 -676', S.border, 6);
  limb(c, [[118, -706], [146 + gust * 10, -660 + Math.sin(t * 2.4) * 6], [168 + gust * 30, -590 + Math.sin(t * 2.4 + 1) * 10], [186 + gust * 54, -520 + Math.sin(t * 2.4 + 2) * 14]], [34, 40, 40, 30], S.sari, false);
  limb(c, [[130, -700], [158 + gust * 10, -650 + Math.sin(t * 2.4) * 6], [182 + gust * 30, -580 + Math.sin(t * 2.4 + 1) * 10], [202 + gust * 54, -512 + Math.sin(t * 2.4 + 2) * 14]], [5, 6, 6, 5], S.border, false);
  deviHead(c, { ...o, skin: S.skin });
  // necklaces: a choker set with rubies, a long rani-haar of gold coins
  fillPath(c, 'M -28 -722 C -20 -706 20 -706 28 -722 L 28 -712 C 20 -696 -20 -696 -28 -712 Z', S.gold);
  for (let k = -3; k <= 3; k++) ellipse(c, k * 7, -706 + Math.abs(k) * -1.6, 2.4, 2.8, S.ruby);
  for (let i = 0; i <= 18; i++) { const u = i / 18, x = lerp(-40, 40, u), y = -716 + Math.pow(Math.sin(u * Math.PI), .9) * 92 + br; ellipse(c, x, y, 4.4, 4.4, S.gold); ellipse(c, x - 1, y - 1.2, 1.5, 1.2, S.goldLt); }
  fillPath(c, `M 0 ${-630 + br} C 9 ${-622 + br} 9 ${-610 + br} 0 ${-602 + br} C -9 ${-610 + br} -9 ${-622 + br} 0 ${-630 + br} Z`, S.gold); ellipse(c, 0, -616 + br, 3.6, 4.6, S.emerald);
  // the front arms, each lit on its own
  const front = (s, mode) => figure(c, (a) => {
    ellipse(a, s * 108, -680, 26, 36, S.skin, s * -.2);
    if (mode === 'trishul') {
      limb(a, [[s * 108, -688], [s * 128, -620], [s * 150, -560]], [52, 46, 40], S.skin);
      limb(a, [[s * 150, -560], [s * 176, -516], [s * 202, -486]], [40, 36, 30], S.skin);
      if (s === -L) limb(a, [[s * 110, -690], [s * 134, -620], [s * 156, -560], [s * 182, -516], [s * 206, -486]], [22, 20, 18, 16, 12], rgba(S.skinSh, .9));
      fillPath(a, `M ${X - 22} -500 C ${X - 26} -480 ${X - 22} -458 ${X - 12} -450 L ${X + 16} -452 C ${X + 22} -468 ${X + 22} -486 ${X + 16} -500 Z`, S.skin);
      for (let i = 0; i < 3; i++) strokePath(a, `M ${X - 16} ${-490 + i * 11} L ${X + 12} ${-490 + i * 11}`, S.skinSh, 1.8);
      ellipse(a, s * 190, -496, 16, 5.5, S.gold, s * .5);
    } else {
      limb(a, [[s * 108, -688], [s * 138, -616], [s * 168, -556]], [52, 46, 40], S.skin);
      limb(a, [[s * 168, -556], [s * 174, -604], [s * 176, -650]], [40, 36, 30], S.skin);
      if (s === -L) limb(a, [[s * 112, -690], [s * 146, -614], [s * 176, -556]], [22, 18, 15], rgba(S.skinSh, .9));
      const hx = s * 176, hy = -652;
      const PALM = `M ${hx - 17} ${hy} C ${hx - 19} ${hy - 16} ${hx - 19} ${hy - 32} ${hx - 17} ${hy - 42} L ${hx + 17} ${hy - 42} C ${hx + 19} ${hy - 32} ${hx + 18} ${hy - 16} ${hx + 16} ${hy} Z`;
      [[-12, 27], [-4, 32], [4, 30], [12, 23]].forEach(([fx, len]) => limb(a, [[hx - s * fx, hy - 38], [hx - s * fx * 1.06, hy - 38 - len]], [9, 7.6], S.skin));
      fillPath(a, PALM, S.skin);
      inside(a, PALM, () => { ellipse(a, hx, hy - 20, 11, 13, rgba(S.palm, .85)); ellipse(a, hx, hy - 20, 4.5, 4.5, '#B0182A'); });   // alta on the palm
      limb(a, [[hx - s * 13, hy - 8], [hx - s * 23, hy - 20], [hx - s * 28, hy - 34]], [13, 10, 8], S.skin);
      ellipse(a, s * 138, -616, 24, 6, S.gold, s * .35); ellipse(a, hx, hy + 4, 16, 5.5, S.gold);
    }
  }, o.armFx || {});
  front(-1, 'abhaya');
  front(1, 'trishul');
  // bees: an orb swirling in each raised hand, streams curling off the ends of her hair
  if (bees > 0 && typeof beeCloud === 'function') {
    for (const [x, y] of orbs) beeCloud(c, x, y, 46, t, { n: Math.round(60 * bees), seed: x, k: 1.1 });
    tips.forEach(([x, y], i) => beeStream(c, [[x, y], [x + Math.sign(x) * 60 + gust * 40, y + 40], [x + Math.sign(x) * 130 + gust * 90, y + 20]], t, { n: Math.round(18 * bees), seed: i * 7 + 3, k: .9, spread: 22 }));
  }
}
