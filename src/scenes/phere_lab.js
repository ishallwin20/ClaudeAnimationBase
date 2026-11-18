// phere_lab.js: framing tests for the mandap (lab.html), one candidate a second. Not in the reel.
LOOK.bloom = .1;
const lens = (focus, ap = 4) => ({ dof: { focus, aperture: ap, max: 12, nearK: .6 }, grade: { contrast: 1.06, sat: 1.05, temp: .02, tint: 0, lift: 0, gamma: 1, gain: 1 } });
const LAB = [
  // 0 hook: seven rings, high from the south
  [{ pos: [0, 3.6, 4.3], at: [0, .2, -.4], fov: 46 }, { seven: 1 }],
  // 1 the same, lower and closer
  [{ pos: [0, 2.2, 3.6], at: [0, .35, -.3], fov: 46 }, { seven: 1, sevenKeep: 3 }],
  // 2 rounds mid-walk, top view from south-east
  [{ pos: [2.6, 4.2, 3.4], at: [0, 0, -.2], fov: 46 }, { rounds: [1, .55, 0] }],
  // 3 the stone close
  [{ pos: [.6, .9, .1], at: [.2, .05, -1.08], fov: 40 }, { stone: .3 }],
  // 4 laja into the fire
  [{ pos: [0, 1.4, 2.2], at: [0, .6, 0], fov: 44 }, { laja: { from: [0, 2.6, 0], to: [0, .3, 0], on: 1 }, flare: .5 }],
  // 5 steps: from behind (south) low, looking north
  [{ pos: [0, 1.7, -.6], at: [0, 0, -4], fov: 46 }, { rounds: [1, 1, 1], steps: 7, trail: .2 }],
  // 6 steps from above
  [{ pos: [0, 6.5, -2.4], at: [0, 0, -3.2], fov: 46 }, { rounds: [1, 1, 1], steps: 7, seventh: 1 }],
  // 7 pole star: tilt up from the steps
  [{ pos: [0, 1.4, -1.2], at: [0, 2.6, -8], fov: 50 }, { rounds: [1, 1, 1], steps: 7, seventh: 1, polar: 1 }],
];
LAB.forEach(([cam, o], i) => SHOTS.push({ a: i, b: i + 1, draw(c, u, t) {
  const ex = SET.set(t, o); cam3(cam);
  render3(c, SET.S, CAM3, { exposure: ex, fx: lens(CAM3.position.distanceTo(V3(...cam.at)), 3) });
  text(c, 'LAB ' + i, 540, 300, '700 50px Cinzel', '#fff');
} }));
