// sc_demo.js: the Scribble style's demo (scribble.html): Bal Hanuman on his boulder in the blurred Himalaya, breathing
// one round of box breathing (4 s in, 4 s held, 4 s out, 4 s held; a seamless 16 s loop) while his hair-strokes boil.
// The reference reel, reel/breathe-hanuman, adds the words, the prana motes and the sound.
const SC_BOX = 16;
function scBreath(t) {   // 0 (empty) → 1 (full): eased in over 4 s, held, eased out, held
  const p = ((t % SC_BOX) + SC_BOX) % SC_BOX, k = Math.floor(p / 4), u = (p - k * 4) / 4;
  return k === 0 ? .5 - .5 * Math.cos(Math.PI * u) : k === 1 ? 1 : k === 2 ? .5 + .5 * Math.cos(Math.PI * u) : 0;
}
SHOTS.push({
  a: 0, b: DUR + 1, draw(c, u, t) {
    const b = scBreath(t), P = window._scBh || (window._scBh = scHanuman()), lift = 22 * b + Math.sin(t * TAU / 4) * .15;
    scHimalaya(c);
    scRock(c);
    c.save(); const sg = c.createRadialGradient(SCH.x, SCH.ground, 10, SCH.x, SCH.ground, 300);   // contact shadow
    sg.addColorStop(0, 'rgba(30,24,18,.55)'); sg.addColorStop(1, 'rgba(30,24,18,0)'); c.fillStyle = sg;
    c.translate(SCH.x, SCH.ground); c.scale(1, .16); c.translate(-SCH.x, -SCH.ground); c.fillRect(SCH.x - 320, SCH.ground - 320, 640, 640); c.restore();
    scDraw(c, P.tail, t, { ax: SCH.tailRoot[0], ay: SCH.tailRoot[1], rot: -.035 * b, dy: -lift * .3 });
    scDraw(c, P.legs, t);
    scDraw(c, P.torso, t, { ax: SCH.lap[0], ay: SCH.lap[1], sx: 1 + .03 * b, sy: 1 + .062 * b });
    scDraw(c, P.head, t, { ax: SCH.neck[0], ay: SCH.neck[1], dy: -lift - 5 * b, rot: .012 * Math.sin(t * TAU / SC_BOX) });
  }
});
LOOK.bloom = .1; LOOK.vignette = .28; LOOK.grain = .05;
