// chhath_lab.js: a framing page (lab.html), not in the reel: one candidate view a second.
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
const LABV = [
  [{ mood: ['dusk'], sunEl: 3, hero: 0, fill: 2, crowd: false }, { pos: [.9, .7, -4.2], at: [0, .45, -2.5], fov: 30 }],      // hero, front 3/4
  [{ mood: ['dusk'], sunEl: 3, hero: 1, fill: 2, crowd: false }, { pos: [1.6, .7, -2.6], at: [0, .5, -2.5], fov: 30 }],       // hero, side, raised
  [{ mood: ['dawn'], sunEl: 6, hero: .3, crowd: false }, { pos: [.6, 1.0, -.6], at: [0, .45, -2.4], fov: 30 }],               // hero, back 3/4
  [{ mood: ['dawn'], sunEl: 6, hero: 0, fill: 1.5 }, { pos: [.35, .75, -2.2], at: [0, .38, -2.72], fov: 34 }],              // the soop, close
  [{ mood: ['dawn'], sunEl: 8 }, { pos: [-6, 3, 8], at: [1, .3, -2], fov: 40 }],                                           // the ghat, wide
  [{ mood: ['night', 'predawn', .7], sunEl: -5, pools: 1, mist: 1 }, { pos: [-3, 1, 2.4], at: [0, .5, -2.4], fov: 34 }],    // before dawn
  [{ mood: ['dusk'], sunEl: 2 }, { pos: [-5, 1.3, 2.2], at: [3, .4, -3], fov: 40 }],                                       // along the line
];
LABV.forEach(([o, cam], i) => SHOTS.push({ a: i, b: i + 1, draw(c, u, t) { ghat(c, t, o, cam, lens(dist(cam.at), 3)); } }));
SHOTS.push({ a: 7, b: 8, draw(c, u, t) { home(c, t, { day: 1 }, { pos: [.25, .78, 1.08], at: [0, .02, -.02], fov: 40 }, lens(1.2, 3)); } });
SHOTS.push({ a: 8, b: 9, draw(c, u, t) { home(c, t, { day: 2, fire: 1 }, { pos: [.5, .72, 1.25], at: [.02, .2, -.1], fov: 40 }, lens(1.4, 3)); } });
SHOTS.push({ a: 9, b: 10, draw(c, u, t) { home(c, t, { day: 2, fire: .12 }, { pos: [.1, .34, .95], at: [-.1, .12, -.2], fov: 40 }, lens(1, 4)); } });
