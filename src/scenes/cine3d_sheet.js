// cine3d_sheet.js: the 3D style's demo on main (cine3d.html): the shrine set in its three moods. 0–4 s dusk, the
// camera circling the shrine as its lamps light; 4–8 s inside the sanctum, the pot dripping on the linga; 8–12 s day,
// the sun crossing from east to west over the shikhara, its shadow swinging round.
//   node render.mjs --page=cine3d.html --sheet=1,3.5,5,7.5,9,11.5 --cols=6 --w=300 --out=docs/cine3d_set.jpg
const W3 = world3(), T3 = shrine3(W3.scene);

SHOTS.push({ a: 0, b: 4.4, draw(c, u, t) {
  const ex = W3.mood('dusk'), a = lerp(.1, .9, easeIO(u / 4.4)), r = 16;
  T3.set(t, { lamps: i => seg(u, .2 + i * .06, .6 + i * .06), water: 1 });
  render3(c, W3.scene, cam3({ pos: [Math.cos(a) * r, 4.4, Math.sin(a) * r], at: [0, 3.7, 0], fov: 46 }), { exposure: ex });
} });
SHOTS.push({ a: 4, b: 8.4, xf: .4, draw(c, u, t) {
  const ex = W3.mood('night');
  T3.set(t, { water: clamp(u / 2) });
  render3(c, W3.scene, cam3({ pos: kf(u, [[0, [3.4, 1.7, .5]], [4.4, [2.2, 1.45, -.2]]], easeIO), at: [0, 1.25, -.25], fov: 42 }), { exposure: ex });
} });
SHOTS.push({ a: 8, b: 12, xf: .4, draw(c, u, t) {
  const k = easeIO(u / 4), sa = lerp(.15, Math.PI - .15, k);
  const ex = W3.mood('day', { sunAt: [Math.cos(sa) * 10, 6 + Math.sin(sa) * 8, 7] });
  T3.set(t, { lamps: 0, water: 1 });
  render3(c, W3.scene, cam3({ pos: [-3, 17, -15], at: [0, 1.5, 0], fov: 44 }), { exposure: ex });
} });
say(.2, 3.8, 'The shrine at *DUSK*', { y: 1380 });
say(4.4, 7.8, 'Inside the *SANCTUM*', { y: 1380 });
say(8.4, 11.6, 'The *SUN* crosses it', { y: 1380 });
