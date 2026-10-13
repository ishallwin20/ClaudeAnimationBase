// story_book1.js: the Book 1 Story ad (story_book1.html, 13 s). Before she was Parvati, wife of Shiva (Kailash at
// night, the two of them on the summit), she was born to the Himalaya: Shailputri (dawn, trishul, lotus, Nandi). Then
// the Book 1 cover, ₹200, and a slot for the link sticker. SFX: tools/story_sfx.mjs (same times).
const TL = { night: 0, dawn: 4.0, card: 8.0, end: 13 };

SHOTS.push({ a: TL.night, b: TL.dawn + .6, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.12, easeIO(u / 4.6)), fx: 560, fy: 1250 };
  plane(c, cam, 0, (c) => sky(c, [[0, '#060A15'], [700, '#111A30'], [1300, '#283350'], [1650, '#47516E']]));
  plane(c, cam, .05, (c) => { stars(c, 120, 3, t, .7); glow(c, 820, 520, 520, '#7F97CC', .4); ellipse(c, 820, 520, 46, 46, '#E6ECF6'); rays(c, 820, 520, { n: 9, dir: 2.2, spread: .8, len: 1500, w: 280, col: '#A9BCE6', a: .12, t }); });
  plane(c, cam, .15, (c) => clouds(c, [[0, 760, 820, 1, 9], [600, 980, 700, 2, 12, true]], t, PALETTES.nightFar, .85));
  plane(c, cam, .5, (c) => { kailash(c, 560, 1260, 760); haze(c, 1700, 300, '#6C7898', .4); });
  plane(c, cam, 1, (c) => {
    glow(c, 560, 1120, 320, '#9FC0FF', .35);
    figure(c, (f) => { f.translate(520, 1272); f.scale(.42, .42); shivaSeated(f, { t }); f.translate(270, 0); parvatiCling(f, { t }); }, LIGHTS.moonSilhouette);
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 70, seed: 3, box: [-100, 200, W + 100, 1900], r: 3.2, col: '#DCE6FF', a: .5, vx: 50, vy: 90, t }));
} });

SHOTS.push({ a: TL.dawn, b: TL.card + .6, xf: .6, draw(c, u, t) {
  const cam = { z: lerp(1.1, 1.0, easeOut(u / 4.4)), fx: 540, fy: 1250 };
  plane(c, cam, 0, (c) => sky(c, [[0, '#24183A'], [560, '#5E2E4E'], [1000, '#C9663D'], [1380, '#FFCF86'], [1600, '#FFE2A8']]));
  plane(c, cam, .05, (c) => { glow(c, 540, 1190, 900, '#FFB45A', .55); ellipse(c, 540, 1190, 235, 235, '#FFE9B8'); rays(c, 540, 1190, { n: 18, dir: -Math.PI / 2, spread: Math.PI * 1.5, len: 1500, w: 240, col: '#FFD58A', a: .22, t, seed: 4 }); });
  plane(c, cam, .1, (c) => clouds(c, [[0, 300, 900, 31, 10], [520, 560, 760, 32, 14, true]], t, PALETTES.dawn, .9));
  plane(c, cam, .4, (c) => ridge(c, 1520, 90, 62, '#2E1828'));
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -100 1720 C 120 1680 260 1650 380 1648 C 560 1640 760 1660 900 1700 L 1180 1800 L 1180 2100 L -100 2100 Z', '#1C111B');
    figure(c, (f) => { f.translate(730, 1676); f.scale(.5, .5); nandiLying(f, { t }); }, { edge: { col: '#FFD9A0', w: 2.2, a: .8 }, rim: { col: '#FFF0C8', dx: 4, dy: -3, a: .8 } });
    figure(c, (f) => { f.translate(430, 1652); f.scale(.62, .62); sati(f, { t, wind: .7, trishul: true, lotus: true }); }, LIGHTS.dawnBack);
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 60, seed: 17, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFD9A0', a: .7, vx: 10, vy: -45, t }));
} });

SHOTS.push({ a: TL.card, b: TL.end + 1, xf: .6, draw(c, u, t) {
  storyGround(c, t);
  picture(c, PICS.logo, 540, 300, 110, 110, { pop: u - .1, r: 55 });
  const s = 1 + .02 * Math.sin(t * 1.3);
  picture(c, PICS.book1, 540, 760, 680 * s, 680 * s, { pop: u - .25, r: 14, shadow: 40, glow: ['rgba(255,196,120,.45)', 60] });
  text(c, 'BOOK 1 · SHAILPUTRI', 540, 1175, '700 58px Cinzel', '#F4C46A', { pop: u - .7, glow: ['rgba(244,196,106,.5)', 22], spacing: 3, maxW: 940 });
  storyCTA(c, u - 1.0, t, '₹200', 'The Navadurga Series · rishikatha.com');
} });

say(-.35, 3.9, 'Before she was *Parvati*, | the wife of *Shiva*…', { y: 720, size: 60, at: Array(7).fill(-.35) });
say(4.3, 7.9, 'she was born a princess | of the Himalaya: | *SHAILPUTRI*.', { y: 560, size: 60 });
