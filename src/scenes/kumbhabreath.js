// kumbhabreath.js: "Breathe with Kumbhakarna", a seamless Scribble loop and a gentle comedy: in for 4 s (a long snore
// in, his mouth opening wide, the lamp's flame pulled toward him), hold for 4 s (everything waits; the myna riding his
// belly hops and looks round), out for 6 s (his lips purse, the moustache flutters, the flame is blown flat, little z's
// drift up). Two rounds, 28 s. Valmiki: Brahma's word made him sleep six months at a time and wake for a day (Yuddha
// Kanda 61); the joke line only says that, and "kumbhaka" (the held breath) is just a sound-alike.
const KB = 14, KB_PH = [4, 4, 6];
function kbAt(t) {
  const p = ((t % KB) + KB) % KB, k = p < 4 ? 0 : p < 8 ? 1 : 2, u = k === 0 ? p / 4 : k === 1 ? (p - 4) / 4 : (p - 8) / 6;
  const b = k === 0 ? .5 - .5 * Math.cos(Math.PI * u) : k === 1 ? 1 : .5 + .5 * Math.cos(Math.PI * u);
  const blow = k === 2 ? clamp(u * 6) * clamp((1 - u) * 5) : 0;   // lips pursed and blowing
  return { p, k, u, b, blow };
}
const KB_PARTS = () => window._kb || (window._kb = { k: scKumbha(), myna: scMyna(), diya: scDiya() });
const kbTop = X => 1742 + scFbm2(X / 140, 9, 3, 3) * 6;
function kbScene(c, t, o = {}) {
  const { k, u, b, blow } = o.breath || kbAt(t), P = KB_PARTS(), K = P.k, dy = o.dy || 0;
  scHall(c, o.set);
  scRock(c, { ...o.set, key: 'kb', y0: 1700, top: kbTop, pal: { base: [92, 80, 86], lichen: 0, shade: [.85, .6] }, near: 100 });
  c.save(); c.translate(0, dy);
  scDraw(c, K.bed, t);
  scDraw(c, K.legs, t);
  const sx = 1 + .03 * b, sy = 1 + .1 * b;
  scDraw(c, K.belly, t, { ax: SCK.belly[0], ay: SCK.belly[1], sx, sy });
  // the head: the mouth opens wide on the snore in, purses as he blows out
  const open = k === 0 ? lerp(1, 1.4, b) : k === 1 ? 1.4 : lerp(1.4, 1, clamp(u * 5));
  const purse = blow;
  scKumbhaHead(c, K, t, { dy: -6 * b, rot: .02 * b, mouth: [lerp(1, .55, purse), lerp(open, .6, purse)], tash: [1 + .07 * purse, purse * .05 * Math.sin(t * 38)] });
  // the myna, riding the belly; at the top of the hold it hops and turns round
  const bx = 600 + 120 * sx, by = SCK.belly[1] - (SCK.belly[1] - 1301) * sy;
  const hop = k === 1 ? Math.max(0, Math.sin(clamp((u - .3) / .35) * Math.PI)) : 0, face = k === 1 && u > .48 ? -1 : 1;
  c.save(); c.translate(bx, by - 46 * hop); c.scale(face, 1); scDraw(c, P.myna, t, { ax: 0, ay: 0, rot: blow * .06 * Math.sin(t * 20) }); c.restore();
  // the lamp: its flame pulled toward him breathing in, blown flat breathing out
  const lean = k === 0 ? -.55 * Math.sin(Math.PI * u) : k === 1 ? 0 : 1.3 * blow, fh = k === 0 ? 1 + .35 * Math.sin(Math.PI * u) : k === 2 ? 1 - .45 * blow : 1;
  scDiyaDraw(c, P.diya, t, 330, 1766, 1.55, lean, { h: fh, glow: fh });
  // little z's drifting up from his mouth as he breathes out
  if (k === 2) {
    const [mx, my] = scKumbhaAt(SCK.head[0], SCK.mouth[1], 0);
    for (let i = 0; i < 3; i++) {
      const v = clamp(u * 1.4 - i * .18); if (v <= 0 || v >= 1) continue;
      c.save(); c.globalAlpha = Math.sin(v * Math.PI) * .9; c.translate(mx + 40 + v * 150 + i * 20, my - 60 - v * 260); c.rotate(-.2 + i * .15);
      scWord(c, 'z', 0, 0, 40 + i * 14, { weight: 700, glow: ['rgba(20,10,30,.6)', 10] }); c.restore();
    }
  }
  c.restore();
}

SHOTS.push({
  a: 0, b: DUR + 1, draw(c, u, t) {
    const B = kbAt(t);
    kbScene(c, t, { breath: B });
    if (window.COVER) return;
    const { k, b, p } = B, start = [0, 4, 8][k], toNext = start + KB_PH[k] - p, fade = clamp(toNext / .35);
    const s = lerp(.82, 1.12, b), y = lerp(560, 480, b), pop = t < .05 ? 1 : lerp(.6, 1, clamp((p - start) / .22));
    const words = [['Inhale', 'पूरक'], ['Hold', 'कुम्भक  (not Kumbhakarna)'], ['Exhale', 'रेचक']][k];
    c.save(); c.translate(540, y); c.scale(pop, pop);
    scWord(c, words[0], 0, 0, 118 * s, { alpha: fade, glow: ['rgba(10,6,20,.6)', 18] });
    scWord(c, words[1], 0, 92 * s, 46 * s, { alpha: .85 * fade, glow: ['rgba(10,6,20,.6)', 12] });
    c.restore();
    scWord(c, 'He slept six months at a time.', 540, 860, 46, { alpha: .9, glow: ['rgba(10,6,20,.7)', 14] });
    scWord(c, "We'll just do 28 seconds.", 540, 920, 46, { alpha: .9, glow: ['rgba(10,6,20,.7)', 14] });
  }
});
LOOK.bloom = .12; LOOK.vignette = .32; LOOK.grain = .05;
