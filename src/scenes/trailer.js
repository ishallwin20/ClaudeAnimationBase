// trailer.js: the end card of the Ramayan trailer (8.4 s; trailer 39.6–48.0, after the last arrow and the score's stop).
// A white flash fades into the saffron sunburst; RAMAYAN pops on the score's hit, then THE COMPLETE SERIES and 12 PARTS
// as the voice says "The Ramayan. All twelve parts."; Lakshman, Ram, Sita and Hanuman stand together below; on "Watch
// it from Part One" the orange pill and the follow line pop. Rendered with render.mjs --clip --audio=none; the rest of
// the trailer is clips (tools/trailer_clips.mjs), put together by tools/trailer_build.mjs.
(() => {
  const sita = (x, y, u, o) => parvati(x, y, u, { pal: SITA_PAL, ...SITA_SKIN, ...o });
  const HIT = .6, PARTS = 1.5, WATCH = 4.0;
  function card(t) {
    camBegin(540, 1300 - t * 6, 1.0 + t * .012);
    boilSeed('tbg');
    paint(rectPts(-200, -200, W + 400, H + 1400), { wash: RMY.maroon, ink: null });
    paint(ellPts(540, 1150, 900, 900, 40), { fill: RMY.saffron, fillOp: 230, bleed: .25, tex: .4, border: .3, ink: null });
    glow(540, 1150, 700, '#FFB060', .55);
    boilSeed('trays');
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + t * .1, r0 = 420, r1 = 1100; paint([[540 + Math.cos(a - .05) * r0, 1150 + Math.sin(a - .05) * r0], [540 + Math.cos(a) * r1, 1150 + Math.sin(a) * r1], [540 + Math.cos(a + .05) * r0, 1150 + Math.sin(a + .05) * r0]], { wash: RMY.ray, washOp: 70, ink: null }); }
    const up = easeOut(seg(t, .2, 1.4)), dy = (1 - up) * 300;
    lakshman(230, 1980 + dy, 15, { boilKey: 'tl', eyes: 'happy', mouth: 'smile', lookX: .4 });
    sita(700, 1975 + dy, 15.5, { boilKey: 'ts', eyes: 'happy', mouth: 'smile', lookX: -.4 });
    ram(470, 1970 + dy, 17, { boilKey: 'tr', eyes: 'happy', mouth: 'smile', handR: t > WATCH ? [6.2, -19.6] : undefined, bendR: .3, kodanda: true });
    hanuman(890, 1985 + dy, 13, { crown: false, gada: 1, boilKey: 'th', eyes: 'happy', mouth: 'grin', tail: 'curl', emote: t > WATCH ? 'hearts' : undefined, emoteK: 1, emoteAge: t - WATCH });
    camEnd();
    const pk = d => Math.max(0, t - d) * 4;
    if (t > HIT) letter('RAMAYAN', 540, 540, 168, RMY.gold, { screen: true, font: '168px Marcellus', stroke: RMY.maroonDk, sw: .14, ink: false, pop: pk(HIT), maxW: 960 });
    if (t > PARTS - .5) letter('THE COMPLETE SERIES', 540, 665, 44, RMY.cream, { screen: true, font: '700 44px Poppins', ink: false, pop: pk(PARTS - .5) });
    if (t > PARTS) letter('12 PARTS', 540, 800, 130, RMY.gold, { screen: true, stroke: RMY.maroonDk, sw: .2, ink: false, pop: pk(PARTS), rot: -.02 });
    if (t > WATCH) {
      const k = backOut(clamp(pk(WATCH))) * (1 + .03 * pulse(t, 4));
      boilSeed('tpill'); push(); translate(540, 975); scale(k); paint(rrPts(-350, -60, 700, 120, 60), { wash: RMY.orange, ink: null }); pop();
      letter('WATCH FROM PART 1', 540, 978, 56, RMY.cream, { screen: true, font: '700 54px Poppins', ink: false, pop: pk(WATCH), maxW: 640 });
      letter('Follow @therishikatha', 540, 1085, 44, RMY.cream, { screen: true, font: '700 44px Poppins', ink: false, pop: pk(WATCH + .3) });
    }
    if (t < .6) flash(1 - t / .6, '#FFF8E8');
  }
  shots([[0, card]]);
})();
