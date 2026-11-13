// breathe.js: "Breathe with Bal Hanuman", a seamless box-breathing loop in the Scribble style. Two rounds of
// 4 s in (पूरक, puraka), 4 s held (कुम्भक, kumbhaka), 4 s out (रेचक, rechaka), 4 s held. Bal Hanuman sits on a
// boulder in the Himalaya with his eyes closed; his chest fills and his head lifts as he breathes in, and settles as he
// breathes out. The word rises and grows on the in-breath, waits, and sinks and shrinks on the out-breath.
const BOX = 16, PHASES = [['Inhale', 'पूरक'], ['Hold', 'कुम्भक'], ['Exhale', 'रेचक'], ['Hold', 'कुम्भक']];
function breathAt(t) {
  const p = ((t % BOX) + BOX) % BOX, k = Math.floor(p / 4), u = (p - k * 4) / 4;
  const b = k === 0 ? .5 - .5 * Math.cos(Math.PI * u) : k === 1 ? 1 : k === 2 ? .5 + .5 * Math.cos(Math.PI * u) : 0;
  return { p, k, u, b };
}
const BH_PARTS = () => window._bh || (window._bh = scHanuman());

SHOTS.push({
  a: 0, b: DUR + 1, draw(c, u, t) {
    const { k, u: pu, b } = breathAt(t), H_ = BH_PARTS(), still = Math.sin(t * TAU / 4) * .15;   // a whisper of motion in the holds
    scHimalaya(c);
    scRock(c);
    // contact shadow on the rock
    c.save(); const sg = c.createRadialGradient(SCH.x, SCH.ground, 10, SCH.x, SCH.ground, 300);
    sg.addColorStop(0, 'rgba(30,24,18,.55)'); sg.addColorStop(1, 'rgba(30,24,18,0)'); c.fillStyle = sg;
    c.translate(SCH.x, SCH.ground); c.scale(1, .16); c.translate(-SCH.x, -SCH.ground); c.fillRect(SCH.x - 320, SCH.ground - 320, 640, 640); c.restore();
    const lift = 22 * b + still;
    scDraw(c, H_.tail, t, { ax: SCH.tailRoot[0], ay: SCH.tailRoot[1], rot: -.035 * b, dy: -lift * .3 });
    scDraw(c, H_.legs, t);
    scDraw(c, H_.torso, t, { ax: SCH.lap[0], ay: SCH.lap[1], sx: 1 + .03 * b, sy: 1 + .062 * b });
    scDraw(c, H_.head, t, { ax: SCH.neck[0], ay: SCH.neck[1], dy: -lift - 5 * b, rot: .012 * Math.sin(t * TAU / BOX) });
    // prana: motes of air that gather in toward him as he breathes in and drift back out as he breathes out
    for (let i = 0; i < 46; i++) {
      const a0 = hash(i * 3.1) * TAU, r0 = 300 + hash(i * 5.7) * 260, rr = r0 * (1 - .32 * b) + 6 * Math.sin(t * TAU / 8 + i);
      const mx = 540 + Math.cos(a0) * rr * .9, my = 1180 + Math.sin(a0) * rr * .75, tw = .5 + .5 * Math.sin(t * TAU / 4 + i * 1.7);
      glow(c, mx, my, 7 + hash(i) * 9, '#FFF4D6', (.28 + .3 * tw) * (my < 1640 ? 1 : 0), 'screen');
    }
    // the word: rises and grows breathing in, waits, sinks and shrinks breathing out
    const s = k === 0 ? lerp(.82, 1.12, b) : k === 1 ? 1.12 : k === 2 ? lerp(.82, 1.12, b) : .82;
    const y = lerp(560, 480, (s - .82) / .3);
    const p = ((t % BOX) + BOX) % BOX, toNext = 4 - (p - k * 4);
    const fade = clamp(toNext / .35);   // the word fades out in its last third of a second; the next is up at once
    const pop = clamp(pu * 4 / .22);
    const [en, sa] = PHASES[k];
    if (window.COVER) return;
    c.save(); c.globalAlpha = fade;
    text(c, en, 540, y, `400 ${Math.round(118 * s)}px Kalam`, '#FFFFFF', { glow: ['rgba(30,60,80,.35)', 18], pop: k === 0 && t < .05 ? null : lerp(.6, 1, pop) });
    text(c, sa, 540, y + 92 * s, `400 ${Math.round(46 * s)}px Kalam`, 'rgba(255,255,255,.82)', { glow: ['rgba(30,60,80,.35)', 12] });
    c.restore();
  }
});
LOOK.bloom = .1; LOOK.vignette = .28; LOOK.grain = .05;
