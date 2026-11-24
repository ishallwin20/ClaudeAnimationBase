// cine_ardha.js: Ardhanarishvara and the story of how Parvati became Shiva's left half, for the cinematic engine (cine.js).
// Needs cine_shiva.js and cine_devi.js. Same units as they use: the feet at (0, 0), up is -y, the face centred at about
// (0, -815). Skanda Purana, Arunachala Mahatmya: "In one half it was as white as camphor and in the other half it is as red
// as red lead" (Uttarardha 21.21-24); Parvati "secured the left side of the body" of Shiva at Arunachala (U 4.47b-51a).
//
// ardhanari(c, o)   one body: Shiva's half on the screen LEFT (his right: the jata with the moon, the snake, the tiger
//                   skin, the trishul), Parvati's half on the screen RIGHT (her left: the mukut, the red sari, a lotus).
//                   o: t, eyes (0..1, both faces), light (1 lit from screen right), wind, look, pal (Shiva's half's
//                   colours, default ARDHA_CAMPHOR), sari / skin (hers), seam (0..1 a line of light down the join),
//                   fx: { shiva, devi } figure() options for each half (white light on his, red on hers), part (0..1:
//                   the halves drawn apart by part * 180 units, for the merge)
// ardhanariHead(c, o)  the split face alone (a close-up), at its rest position; same o
// gauriHands(c, o)  Parvati's hands closing over Shiva's three eyes from behind, in shivaHead's units (draw after
//                   shivaHead): o.k (0 off at the sides .. 1 covering), o.lift (0..1 the hands lifting off again), o.skin
const ARDHA_CAMPHOR = { skin: '#E4E1DC', skinSh: '#B9B8BC', skinDk: '#8C8A94', throat: '#5D7BB0', palm: '#F2EEE8', lip: '#A0707A', lipLo: '#BC8890', hairLt: '#3A3A50' };

function ardhaHalf(c, side, part, draw) {
  // side -1: keep x < 0 (Shiva's half), +1: keep x > 0 (Parvati's); part pushes the half outward
  c.save(); c.translate(side * part * 180, 0);
  c.beginPath(); if (side < 0) c.rect(-2000, -2000, 2000.6, 4000); else c.rect(-.6, -2000, 2000.6, 4000); c.clip();
  draw(c); c.restore();
}
function ardhanari(c, o = {}) {
  const t = o.t || 0, part = o.part || 0, fx = o.fx || {}, eyes = o.eyes ?? .55, seam = o.seam || 0;
  // Parvati's half first (her loose hair falls behind his), then Shiva's
  figure(c, (f) => ardhaHalf(f, 1, part, (g) => devi(g, { t, arms: 2, front: ['abhaya', 'lotus'], eyes, look: o.look, light: o.light ?? 1, wind: o.wind ?? .25, sari: o.sari, skin: o.skin })), fx.devi || {});
  figure(c, (f) => ardhaHalf(f, -1, part, (g) => shiva(g, { t, eyes, look: o.look, light: o.light ?? 1, wind: o.wind ?? .25, arm: 'down', pal: o.pal || ARDHA_CAMPHOR, third: o.third ?? .15 })), fx.shiva || {});
  if (seam > 0) {
    c.save(); c.globalCompositeOperation = 'lighter';
    const g = c.createLinearGradient(-30, 0, 30, 0); g.addColorStop(0, 'rgba(255,240,220,0)'); g.addColorStop(.5, `rgba(255,236,200,${.85 * seam})`); g.addColorStop(1, 'rgba(255,240,220,0)');
    c.fillStyle = g; c.fillRect(-30, -1060, 60, 1070);
    const g2 = c.createLinearGradient(-120, 0, 120, 0); g2.addColorStop(0, 'rgba(255,200,150,0)'); g2.addColorStop(.5, `rgba(255,190,140,${.25 * seam})`); g2.addColorStop(1, 'rgba(255,200,150,0)');
    c.fillStyle = g2; c.fillRect(-120, -1100, 240, 1110); c.restore();
  }
}
function ardhanariHead(c, o = {}) {
  const fx = o.fx || {}, eyes = o.eyes ?? .55;
  figure(c, (f) => ardhaHalf(f, 1, 0, (g) => deviHead(g, { t: o.t, eyes, look: o.look, light: o.light ?? 1, tears: o.tears, skin: o.skin })), fx.devi || {});
  figure(c, (f) => ardhaHalf(f, -1, 0, (g) => shivaHead(g, { t: o.t, eyes, look: o.look, light: o.light ?? 1, pal: o.pal || ARDHA_CAMPHOR, third: o.third ?? .15 })), fx.shiva || {});
}

// Parvati's hands over his eyes. Seen from the front we see the backs of her hands: the fingers reach in from his temples
// toward the bridge of his nose, the top fingers over the third eye; gold and red glass bangles at the wrists; alta-red
// nails; her forearms go back past his ears into the dark behind his head.
function gauriHands(c, o = {}) {
  const k = clamp(o.k ?? 1), lift = clamp(o.lift || 0), S = { skin: '#9A5E3E', skinSh: '#6E3F2A', nail: '#A8343E', gold: '#E2AE45', goldSh: '#9A6E25', glass: '#B3162E', ...(o.pal || {}) };
  if (k <= 0) return;
  const out = (1 - easeOut(k)) * 150 + easeIO(lift) * 60, up = easeIO(lift) * -50;
  for (const s of [1, -1]) {   // the screen-right hand first, the left one over it where the fingertips meet
    const wx = s * (84 + out), wy = -826 + up;
    c.save(); c.translate(wx, wy); c.scale(-s, 1);   // local +x points from the wrist toward the middle of his face
    c.rotate(.05);
    // forearm, back past the ear
    limb(c, [[-6, 4], [-60, 12], [-150, 30]], [40, 44, 48], S.skin);
    fillPath(c, 'M -10 -20 L -150 -6 L -150 10 L -10 -2 Z', rgba(S.skinSh, .55));
    // bangles
    for (let i = 0; i < 5; i++) { const x = -14 - i * 7; ellipse(c, x, 4, 4.2, 23, i % 2 ? S.glass : S.gold); ellipse(c, x - 1.2, -6, 1.6, 8, rgba('#FFE9B0', i % 2 ? .35 : .6)); }
    // the back of the hand
    const BACK = 'M 0 -20 C 14 -26 34 -30 50 -29 C 56 -18 57 6 52 20 C 36 26 16 26 0 22 C -4 8 -4 -8 0 -20 Z';
    fillPath(c, BACK, S.skin);
    inside(c, BACK, () => { fillPath(c, 'M -10 8 C 14 14 36 16 60 12 L 60 30 L -10 30 Z', rgba(S.skinSh, .55)); for (let i = 0; i < 4; i++) strokePath(c, `M 12 ${-14 + i * 11} L 46 ${-20 + i * 12}`, rgba(S.skinSh, .45), 2); });
    // four fingers: index on top (over the brow and the third eye) to the little finger
    const F = [[-24, 38, 11], [-12, 43, 11.5], [1, 41, 11], [13, 33, 9.5]];
    F.forEach(([y, len, w], i) => {
      const y0 = y + 2, x0 = 48 + (i === 3 ? -3 : 0), a = (i - 1.5) * .05;
      const x1 = x0 + Math.cos(a) * len * .52, y1 = y0 + Math.sin(a) * len * .52 + 1, x2 = x0 + Math.cos(a) * len, y2 = y0 + Math.sin(a) * len + 3;
      limb(c, [[x0, y0], [x1, y1], [x2, y2]], [w, w * .94, w * .8], S.skin);
      strokePath(c, `M ${x0 + 4} ${y0 + w * .45} L ${x2 - 3} ${y2 + w * .4}`, rgba(S.skinSh, .7), 1.6);
      ellipse(c, x1, y1 - .5, 1.8, w * .3, rgba(S.skinSh, .5));   // the knuckle crease
      ellipse(c, x2 - 3.5, y2 - .4, 3.6, w * .3, S.nail);           // alta on the nail
      ellipse(c, x2 - 5, y2 - 1.6, 2, 1, rgba('#FFC4C8', .7));
    });
    ellipse(c, 50, -22, 5, 4, rgba(S.skinSh, .4)); ellipse(c, 51, -9, 5, 4, rgba(S.skinSh, .4));   // knuckles
    c.restore();
  }
}
