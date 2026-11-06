// orn.js: "Why does SHIVA wear such SCARY ornaments?" (ad 78), in the 3D style. A follower's question ("make a reel on
// Shiva's malas"), answered with what the texts say: the story behind each of his strange ornaments. A cobra rears in a
// dark jewel studio (the king of serpents is his necklace: nāgendra-hārāya, Panchakshara Stotram); the ocean of milk
// darkens as the halahal spreads (Bhagavata 8.7.18–19) and Shiva drinks it, the blue mark on his throat accepted as his
// ornament (8.7.42–43); the moon he wore for relief from that poison (Skanda Purana, Prabhasa 1.18); Varaha's tusk that killed Hiranyaksha falls and Shiva takes it up to wear (Linga Purana 1.94);
// the trishul strikes, Gajasura falls and asks Shiva to wear his hide: Krittivasa (Shiva Purana, Yuddha Khanda 57);
// Ganga's fall that the earth couldn't bear, held in his jata (Valmiki, Bala Kanda 42–43); the skulls of thousands of
// past Brahmas and Vishnus (Skanda Purana); rudraksha, from his own tears (Shiva Purana,
// Vidyeshvara 25.5–7); crystal, karungali and the red thread are what his devotees wear; the board; the ask; the card.
// STORYBOARD.md has the plan and the sources; the timeline (from the voice) is orn_tl.js, the sets orn_sets.js.
LOOK.bloom = .1;   // matte (owner, 30 Oct): cine.js's own bloom kept low, no fx bloom
const ST = studio3(), OC = ocean3();
const COB = cobra3(ST.S), TUSK = tusk3(ST.S), SK = skulls3(ST.S), HD = hide3(ST.S), TRI = trishul3(ST.S), JT = jata3(ST.S), GA = ganga3(JT);
const MALA = mala3(ST.S, { r: .22, sz: .0065 }), DEV = malas3(ST.S);
const tuskHalo = glow3(ST.S, [0, 0, 0], .9, '#FFC870', 0), tear = glow3(ST.S, [0, 0, 0], .08, '#CFE6FF', 0), tearCore = glow3(ST.S, [0, 0, 0], .025, '#FFFFFF', 0);
const dust = [...Array(30)].map(() => glow3(ST.S, [0, 0, 0], .05, '#C8B8A0', 0)), sparks = [...Array(40)].map(() => glow3(ST.S, [0, 0, 0], .03, '#FFB050', 0));
const EMB3 = motes3(ST.S, { n: 120, box: [-1.5, 0, -1.5, 1.5, 2.2, 1], size: .002, col: '#FF8A3A', drift: [.01, .12, 0], seed: 4 });
const CAPY = 1320;
const capBand = (c, a = .5) => band(c, 1200, 1490, a);
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? (k.id === 'ask' ? 1400 : CAPY) }));

// the lens: depth of field, a gentle grade (no bloom)
const lens = (focus, ap = 7, o = {}) => ({ dof: { focus, aperture: ap, max: 14, nearK: .6 }, grade: { contrast: o.contrast ?? 1.06, sat: o.sat ?? 1.02, temp: o.temp ?? .02, lift: 0, gamma: 1, gain: 1 }, ...o.fx });
const dist = (p) => CAM3.position.distanceTo(V3(...p));
const clip = (near, far) => { CAM3.near = near; CAM3.far = far; };
const at3 = (k, a, b) => a.map((v, i) => lerp(v, b[i], k));
// a camera on a sphere round `at`: d, elevation, azimuth (0 = from +z)
const orbit = (d, el, az, at, fov = 30, o = {}) => cam3({ pos: [at[0] + d * Math.cos(el) * Math.sin(az), at[1] + d * Math.sin(el), at[2] + d * Math.cos(el) * Math.cos(az)], at, fov, ...o });

// a label to the right of a world point: a short gold line, the name and a small gloss
function sideLabel(c, name, sub, p, t, at, col) {
  if (t < at) return; const [x, y] = toScreen3(p), a = clamp((t - at) * 4), x1 = 640;
  c.save(); c.globalAlpha *= a; c.strokeStyle = 'rgba(244,196,106,.8)'; c.lineWidth = 3; c.beginPath(); c.moveTo(x + 10, y); c.lineTo(x1 - 20, y); c.stroke(); c.restore();
  const f = '700 44px Cinzel'; c.save(); c.font = f; c.letterSpacing = '2px'; const w = c.measureText(name).width; c.restore();
  text(c, name, x1 + w / 2, y - 16, f, col, { pop: t - at, glow: ['rgba(8,6,12,.95)', 18], spacing: 2 });
  c.save(); c.font = 'italic 32px Marcellus'; const w2 = c.measureText(sub).width; c.restore();
  text(c, sub, x1 + w2 / 2, y + 28, 'italic 32px Marcellus', '#FFF3DC', { alpha: a, glow: ['rgba(8,6,12,.95)', 14] });
}
// everything the studio shots share, reset at the top of each (objects persist between frames)
const LAYOUT = { cob: [0, 0, .45], tusk: [.36, 0, -.35], sk: [-.3, 0, -.45], mala: [.12, 0, -.95] };
function studio(o = {}) {
  [COB, TUSK, SK, HD, TRI, JT, MALA, DEV.G].forEach(g => { g.visible = false; g.position.set(0, 0, 0); g.rotation.set(0, 0, 0); g.scale.setScalar(1); });
  HD.set(1, 0); TRI.heat(0); GA.set(0, {}); MALA.set(0); tuskHalo.material.opacity = 0; tear.material.opacity = tearCore.material.opacity = 0;
  dust.forEach(d => d.material.opacity = 0); sparks.forEach(s => s.material.opacity = 0); EMB3.set(0, 0); ST.motes.set(o.t ?? 0, o.motes ?? .6);
  ST.look(o.look || 'warm', o);
  return o.exposure ?? 1.05;
}
// the whole set laid out (the reveal, the ask)
function layout(t) {
  COB.visible = true; COB.position.set(...LAYOUT.cob); COB.set(t, { rise: 1, hood: 1 });
  TUSK.visible = true; TUSK.position.set(LAYOUT.tusk[0], .036, LAYOUT.tusk[2]); TUSK.rotation.set(-Math.PI / 2, 0, .6);
  SK.visible = true; SK.position.set(...LAYOUT.sk); SK.scale.setScalar(.75); SK.pose('ring');
  MALA.visible = true; MALA.position.set(...LAYOUT.mala);
}

// ================= A · the hook: the cobra reared in the dark, its hood spreading =================
SHOTS.push({ a: 0, b: TL.C0 + .4, draw(c, u, t) {
  const ex = studio({ t, key: [1.4, 2.4, 2.6], keyAt: [0, .45, 0], cone: .42, spot: 70 });
  COB.visible = true;
  const flare = easeOut(seg(t, TL.SCARY - .25, TL.SCARY + .25));
  COB.set(t, { rise: 1, hood: .62 + .38 * flare, tongue: 1.3 });
  COB.position.z = .05 * flare * Math.exp(-Math.max(0, t - TL.SCARY) * 3) * Math.sin(Math.max(0, t - TL.SCARY) * 12);
  clip(.02, 60);
  const cam = orbit(lerp(1.8, 1.6, easeIO(u / 3)), .1, .18, [.02, .36, .1], 30);
  render3(c, ST.S, cam, { exposure: ex, fx: lens(dist([.03, .6, .2]), 9) });
  capBand(c);
} });

// ================= C · a snake: one bite can kill; the king of serpents is his necklace =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .4, xf: .35, draw(c, u, t) {
  const ex = studio({ t, key: [-1.2, 2.2, 2.4], keyAt: [0, .5, 0], cone: .4, spot: 80, rim: 2.4 });
  COB.visible = true;
  const hiss = Math.exp(-Math.max(0, t - TL.BITE) * 4) * (t > TL.BITE ? 1 : 0);
  COB.set(t, { rise: 1, hood: 1, tongue: 1.6, look: [-.2 * Math.sin(t * .5), 0] });
  COB.position.z = .04 * hiss * Math.sin((t - TL.BITE) * 14);
  clip(.02, 60);
  const k = easeIO(u / (TL.D0 + .4 - TL.C0));
  const cam = orbit(lerp(1.5, 1.3, k), lerp(.06, .14, k), lerp(-.35, .3, k), [.02, .5, .12], 30);
  render3(c, ST.S, cam, { exposure: ex, fx: lens(dist([.02, .5, .15]), 10) });
  capBand(c);
  text(c, 'नागेन्द्रहाराय', 540, 455, '64px "Tiro Devanagari Sanskrit"', '#FFE2A0', { pop: t - TL.KING, glow: ['rgba(10,6,4,.95)', 24] });
  text(c, '“to him whose necklace is the king of serpents”', 540, 530, 'italic 34px Marcellus', '#FFF3DC', { pop: t - TL.KING - .3, glow: ['rgba(10,6,4,.95)', 16], maxW: 900 });
  tag(c, 'SHIVA PANCHAKSHARA STOTRAM', 470, 1462, t, TL.KING + .2);
} });

// ================= D · the halahal rises from the churned ocean and spreads in all directions =================
SHOTS.push({ a: TL.D0, b: TL.E0 + .4, xf: .4, draw(c, u, t) {
  clip(1, 2600);
  const sp = easeIO(seg(t, TL.HALAHAL - .6, TL.ALL + 1));
  OC.set(t, { spread: sp, churn: 1.4 });
  const k = easeIO(u / (TL.E0 + .4 - TL.D0));
  cam3({ pos: at3(k, [160, 70, 230], [230, 120, 320]), at: at3(k, [0, 18, 0], [-20, 10, -20]), fov: 46 });
  render3(c, OC.S, CAM3, { exposure: .95, fx: lens(dist([0, 30, 0]), 2, { sat: .9 }) });
  capBand(c, .6);
  title(c, 'HALAHAL', 600, t, TL.HALAHAL, { size: 110, col: '#D2B4FF', glowCol: 'rgba(20,6,30,.95)' });
  tag(c, 'BHAGAVATA PURANA 8.7.18–19', 470, 1462, t, TL.HALAHAL + .3);
} });

// ================= E · Shiva drank it; it turned his throat blue; that mark became his ornament =================
const VIS = { x: 540, y: 712, k: 3.0, R: 760 };
const visY = t => VIS.y - (t - TL.E0) * 3;
// the sky over the poisoned ocean, behind the vision
function visionSky(c, t) {
  clip(1, 2600);
  OC.set(t, { spread: 1, churn: .6, dark: 1 - .4 * seg(t, TL.BLUE, TL.ORNAMENT) });
  cam3({ pos: [150, 12, 320], at: [-130, 70, -160], fov: 48 });
  render3(c, OC.S, CAM3, { exposure: .9, fx: lens(400, 2, { sat: .9 }) });
  c.fillStyle = 'rgba(4,2,8,.35)'; c.fillRect(0, 0, W, H);
}
SHOTS.push({ a: TL.E0, b: TL.M0 + .4, xf: .4, draw(c, u, t) {
  visionSky(c, t);
  const a = seg(t, TL.E0 + .1, TL.E0 + 1.2), mouth = [VIS.x, visY(t) + (-768 + 815) * VIS.k];
  const blue = easeOut(seg(t, TL.THROAT - .1, TL.BLUE + .5));
  shivaVision(c, t, { ...VIS, y: visY(t), a, eyes: .2 * (1 - seg(t, TL.DRANK, TL.DRANK + .5)) + .55 * seg(t, TL.BLUE + .2, TL.MARK), blue, moon: 0 });
  poisonRise(c, t, [560, 1700], mouth, easeIn(seg(t, TL.DRANK - .7, TL.DRANK + .5)), easeIn(seg(t, TL.DRANK + .4, TL.THROAT + .1)));
  capBand(c, .6);
  title(c, 'NEELKANTHA', 1090, t, TL.MARK, { size: 68, sub: 'the blue-throated one', col: '#9CC0FF', glowCol: 'rgba(4,8,30,.95)' });
  tag(c, 'BHAGAVATA PURANA 8.7.43', 470, 1462, t, TL.ORNAMENT - .1);
} });

// ================= M · and the moon on his head? He wore it for relief from that poison (Skanda, Prabhasa 1.18.16–17) =================
// the crescent comes down out of the sky and settles in his locks; at RELIEF its cool light runs down to the throat
SHOTS.push({ a: TL.M0, b: TL.F0 + .4, xf: .3, draw(c, u, t) {
  visionSky(c, t);
  const LAND = TL.MOON + 1.0, land = easeOut(seg(t, TL.MOON - .35, LAND)), y0 = visY(t), k = VIS.k;
  shivaVision(c, t, { ...VIS, y: y0, a: 1, eyes: .55, blue: 1, moon: t >= LAND ? 1 : 0 });
  // the crescent in head units, falling from far above to (34, -948)
  const mx = 34 + 120 * (1 - land), my = -948 - 520 * (1 - land), rot = -.6 * (1 - land);
  const sx = VIS.x + mx * k, sy = y0 + (my + 815) * k;
  if (t > TL.MOON - .35) {
    glow(c, sx, sy, (60 + 40 * (1 - land)) * k * .5, '#DCE8FF', .5 + .3 * Math.sin(t * 3));
    if (t < LAND) {
      c.save(); c.translate(VIS.x, y0); c.scale(k, k); c.translate(0, 815); c.translate(mx, my); c.rotate(rot); c.translate(-34, 948);
      c.fillStyle = '#F6EED6'; c.shadowColor = 'rgba(220,232,255,.9)'; c.shadowBlur = 12;
      c.beginPath(); c.arc(34, -948, 15, -1.1, 2.3); c.arc(39.5, -953, 12.5, 2.15, -1.0, true); c.closePath(); c.fill(); c.restore();
      // a faint trail of light above it
      for (let i = 1; i < 6; i++) glow(c, sx + i * 14 * (1 - land), sy - i * 40 * (1 - land) * k / 3, 26 * k / 3, '#DCE8FF', .12 * (1 - i / 6));
    }
  }
  // relief: cool light runs down from the crescent to the throat, and the throat's glow softens
  const r = seg(t, TL.RELIEF - .2, TL.RELIEF + 1.2), ty = y0 + (-726 + 815) * k;
  if (r > 0) for (let i = 0; i < 8; i++) { const q = (r * 1.4 - i * .08); if (q <= 0 || q >= 1) continue; glow(c, lerp(sx, VIS.x, q), lerp(sy, ty, q), 40, '#CFE4FF', .45 * Math.sin(q * Math.PI)); }
  if (r > .6) glow(c, VIS.x, ty, 120, '#BFE0FF', .25 * seg(t, TL.RELIEF + .5, TL.RELIEF + 1.3));
  capBand(c, .6);
  title(c, 'SHASHIBHUSHANA', 1090, t, TL.RELIEF + .5, { size: 64, sub: 'adorned with the moon', col: '#DCE8FF', glowCol: 'rgba(4,8,30,.95)' });
  tag(c, 'SKANDA PURANA · PRABHASA KHANDA 1.18', 470, 1462, t, TL.MOON + .2);
} });

// ================= F · Varaha's tusk: it killed Hiranyaksha; it fell; Shiva took it up to wear =================
// the tusk's path: floating and turning; falling flat to the floor; rising again, upright like a crescent, lit gold
function tuskPose(t) {
  const fall = seg(t, TL.FELL - .25, TL.FELL + .25), land = TL.FELL + .25, rise = easeIO(seg(t, TL.PICKED - .1, TL.WORE + .2));
  let y, rx, ry, rz;
  if (t < TL.FELL - .25) { y = .45 + .02 * Math.sin(t * 1.6); rx = 0; ry = -.6 + (t - TL.F0) * .35; rz = .2 * Math.sin(t * .7); }
  else if (t < land) { const f = easeIn(fall); y = lerp(.45, .03, f); rx = lerp(0, -Math.PI / 2, f); ry = -.6 + (TL.FELL - .25 - TL.F0) * .35; rz = .3 * f; }
  else { const b = Math.exp(-(t - land) * 6) * Math.abs(Math.sin((t - land) * 18)) * .03; y = lerp(.03 + b, .45, rise); rx = lerp(-Math.PI / 2, 0, rise); ry = lerp(-.6 + (TL.FELL - .25 - TL.F0) * .35, 0, rise); rz = lerp(.3, 0, rise); }
  TUSK.position.set(0, y + .006, 0); TUSK.rotation.set(rx, ry, rz);
  return { land, rise };
}
SHOTS.push({ a: TL.F0, b: TL.G0 + .4, xf: .4, draw(c, u, t) {
  const ex = studio({ t, look: 'warm', key: [1.2, 2.6, 2.2], keyAt: [0, .25, 0], cone: .4, spot: 55, exposure: .95 });
  TUSK.visible = true;
  const { land, rise } = tuskPose(t);
  // the dust where it lands
  const dk = seg(t, land, land + 1.2); dust.forEach((d, i) => { const a = i / dust.length * TAU, r = .05 + dk * (.25 + .1 * Math.sin(i * 3)); d.position.set(Math.cos(a) * r, .02 + dk * .06 * (1 + Math.sin(i)), Math.sin(a) * r * .6); d.material.opacity = dk > 0 ? .5 * (1 - dk) : 0; d.scale.setScalar(.04 + .12 * dk); });
  tuskHalo.position.set(0, .47, -.25); tuskHalo.material.opacity = .55 * rise; tuskHalo.scale.setScalar(.9 + .1 * Math.sin(t * 2));
  ST.warm.intensity = 1.5 + 6 * rise; ST.warm.color.set('#FFC060'); ST.warm.position.set(.3, .6, .5);
  clip(.02, 60);
  const k = easeIO(u / (TL.G0 + .4 - TL.F0));
  const down = easeIO(seg(t, TL.FELL - .3, TL.FELL + .3)) * (1 - rise);
  const at = [0, lerp(.45, .05, down), 0];
  const cam = orbit(lerp(1.75, 1.5, k), lerp(.08, .55, down), lerp(.25, -.15, k), at, 30);
  render3(c, ST.S, cam, { exposure: ex, fx: lens(dist([.05, TUSK.position.y + .15, 0]), 9) });
  capBand(c);
  title(c, 'VARAHA', 560, t, TL.VARAHA, { size: 104, sub: 'Vishnu as the boar', out: TL.FELL - .2 });
  tag(c, 'LINGA PURANA 1.94', 470, 1462, t, TL.VARAHA + .2);
} });

// ================= G · Gajasura fell; dying, he asked Shiva to wear his skin: KRITTIVASA =================
SHOTS.push({ a: TL.G0, b: TL.H0 + .4, xf: .4, draw(c, u, t) {
  const ex = studio({ t, look: 'ember', key: [1.2, 3.6, 1.6], keyAt: [0, 0, -.4], cone: .62, spot: 140, rim: 2.2 });
  HD.visible = true; TRI.visible = true;
  // the trishul comes down out of the dark and strikes the floor at the head of where the skin will lie
  const strike = TL.FELL2 - .05, s = easeIn(seg(t, strike - .45, strike)), TP = [.05, 0, -1.15];
  TRI.scale.setScalar(1.3); TRI.position.set(TP[0], lerp(4.4, 0, s), TP[2]); TRI.rotation.set(lerp(-.2, -.06, s), -.3, lerp(-.2, -.04, s));
  const hit = t > strike ? Math.exp(-(t - strike) * 1.5) : 0;
  TRI.heat(clamp(hit * 1.2 + .3 * seg(t, strike, strike + .2)));
  sparks.forEach((p, i) => { const a = i / sparks.length * TAU + i, v = .6 + (i % 5) * .25, k = t - strike; if (k < 0 || k > 1) { p.material.opacity = 0; return; } p.position.set(TP[0] + Math.cos(a) * v * k * .5, .05 + v * k * 1.2 - 2.4 * k * k, TP[2] + Math.sin(a) * v * k * .5); p.material.opacity = .9 * (1 - k); });
  EMB3.set(t, .5 * seg(t, strike, strike + .5));
  // the skin falls and settles, spread on the floor before it
  HD.set(seg(t, TL.WEAR - .35, TL.WEAR + 1.5), t);
  ST.warm.intensity = 2 + 10 * hit; ST.warm.position.set(TP[0], .5, TP[2] + .3);
  clip(.03, 60);
  const shake = .012 * hit * Math.sin(t * 60), CUT = TL.DYING - .25;
  if (t < CUT) {
    // close on the trishul's prongs as it comes down and strikes
    const k = easeIO(seg(t, TL.G0, CUT));
    cam3({ pos: [TP[0] + lerp(1.3, 1.1, k), lerp(1.5, 1.4, k) + shake, TP[2] + lerp(3.0, 2.6, k)], at: [TP[0], lerp(1.55, 1.35, k), TP[2]], fov: 38 });
    render3(c, ST.S, CAM3, { exposure: ex, fx: lens(dist([TP[0], 1.5, TP[2]]), 6) });
  } else {
    // from above: the skin falls and spreads before the trishul, an elephant's outline
    const k = easeIO(seg(t, CUT, TL.H0 + .4));
    TRI.visible = false; ST.key.intensity = 260; ST.key.color.set('#FFE8D0'); ST.key.position.set(.8, 3.8, 1.2); ST.key.target.position.set(0, 0, -.3);
    cam3({ pos: [lerp(.1, .03, k), lerp(3.6, 3.3, k) + shake, lerp(.9, .6, k)], at: [0, 0, lerp(-.3, -.28, k)], fov: 42 });
    render3(c, ST.S, CAM3, { exposure: ex, fx: lens(dist([0, 0, -.3]), 3) });
  }
  if (hit > 0) { c.fillStyle = `rgba(255,190,120,${.35 * Math.exp(-(t - strike) * 8)})`; c.fillRect(0, 0, W, H); }
  capBand(c);
  title(c, 'GAJASURA', 600, t, TL.GAJASURA, { size: 100, col: '#FFB08A', out: TL.DYING - .35 });
  title(c, 'KRITTIVASA', 560, t, TL.KRITTIVASA, { size: 100, sub: '“clad in the elephant’s hide”' });
  tag(c, 'SHIVA PURANA · RUDRA SAMHITA 5.57', 470, 1462, t, TL.SKIN);
} });

// ================= H · the earth could not bear Ganga's fall; he held her in his jata =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .4, xf: .4, draw(c, u, t) {
  const ex = studio({ t, look: 'night', key: [1.4, 3.6, 2.2], keyAt: [0, 1.2, 0], cone: .5, spot: 60, rim: 2.6, floor: false, motes: 0, exposure: 1.1 });
  JT.visible = true; JT.position.set(0, .9, 0); JT.rotation.y = .3 + t * .05;
  const fall = easeIn(seg(t, TL.H0 + .2, TL.EARTH + .8)), hit = seg(t, TL.EARTH + .6, TL.EARTH + .9) * (1 - seg(t, TL.HELD - .4, TL.HELD + .3));
  const lift = easeIn(seg(t, TL.HELD - .2, TL.HELD + 1)), wind = easeOut(seg(t, TL.HELD - .3, TL.JATA + .5)), out = seg(t, TL.JATA, TL.JATA + 1.4);
  GA.set(t, { fall, hit: hit * (1 + .3 * Math.sin(t * 20)), lift, wind, out });
  clip(.03, 80);
  const k = easeIO(u / (TL.I0 + .4 - TL.H0)), shake = .02 * hit * Math.sin(t * 47);
  cam3({ pos: [lerp(.3, -.2, k) + shake, lerp(1.1, 1.5, k), lerp(3.4, 2.7, k)], at: [0, lerp(2.2, 1.55, easeIO(seg(t, TL.SWEEP, TL.HELD + .5))) + shake, 0], fov: 40 });
  render3(c, ST.S, CAM3, { exposure: ex, fx: lens(dist([0, 1.5, 0]), 6, { temp: -.02 }) });
  capBand(c);
  title(c, 'GANGA', 560, t, TL.GANGA, { size: 110, col: '#CFE6FF', glowCol: 'rgba(2,8,24,.95)', out: TL.HELD - .3 });
  title(c, 'JATA', 560, t, TL.JATA, { size: 110, sub: 'his matted locks' });
  tag(c, 'VALMIKI RAMAYANA · BALA KANDA 42–43', 470, 1462, t, TL.EARTH + .3);
} });

// ================= I · the skulls: of thousands of past Brahmas and Vishnus =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .4, xf: .4, draw(c, u, t) {
  const ex = studio({ t, key: [.8, 2.4, 2.4], keyAt: [0, .5, 0], cone: .36, spot: 60, rim: 2.2, exposure: 1.1 });
  SK.visible = true; SK.position.set(0, .72, 0); SK.pose('hang', t);
  clip(.02, 60);
  const k = easeIO(u / (TL.J0 + .4 - TL.I0));
  const cam = orbit(lerp(1.85, 1.5, k), .04, lerp(-.2, .15, k), [0, .3, 0], 34);
  render3(c, ST.S, cam, { exposure: ex, fx: lens(dist([0, .3, .05]), 8) });
  capBand(c);
  verse(c, [['“This garland of mine… has been made out of', 'italic 36px Marcellus', '#FFF3DC'], ['skulls of thousands of Nārāyaṇas', 'italic 36px Marcellus', '#FFF3DC'],
    ['and ten thousand Brahmās.”', 'italic 36px Marcellus', '#FFF3DC'], ['— Skanda Purana (Shiva speaking)', '28px Marcellus', '#CFC2B0']], 470, t, TL.BRAHMAS - .3, { dy: 50 });
} });

// ================= J · and RUDRAKSHA grew from Shiva's own tears =================
SHOTS.push({ a: TL.J0, b: TL.K0 + .4, xf: .4, draw(c, u, t) {
  const ex = studio({ t, look: 'gold', key: [.9, 1.6, 1.4], keyAt: [0, 0, 0], cone: .5, spot: 40, exposure: 1.1 });
  MALA.visible = true;
  // the tear: a drop of light falling onto a bead; a ring of gold runs round the mala from it
  const T0 = TL.TEARS - .8, land = TL.TEARS + .1, hitIdx = 27, sz = MALA.sz;
  const p0 = MALA.loop(((hitIdx) % 108) / 111 + 1.5 / 111);
  const f = seg(t, T0, land);
  if (t < land + .05 && t > T0) { const y = lerp(.6, sz * 2, easeIn(f)); tear.position.set(p0[0], y, p0[2]); tearCore.position.copy(tear.position); tear.material.opacity = .9; tearCore.material.opacity = 1; tear.scale.setScalar(.05); }
  const ring = t - land;
  MALA.set(0, i => { if (ring < 0) return .25 * seg(t, TL.RUDRAKSHA, TL.RUDRAKSHA + .5) * (.5 + .5 * Math.sin(t * 3 + i * .4)); const d = Math.min(Math.abs(i - hitIdx), 108 - Math.abs(i - hitIdx)); return clamp(1 - Math.abs(ring * 40 - d) / 6) + .3 * clamp(ring * 2 - d / 30); });
  clip(.01, 60);
  const k = easeIO(u / (TL.K0 + .4 - TL.J0));
  // macro on the bead the tear hits, the ring receding into bokeh
  const HP = [p0[0], sz, p0[2]], cam = orbit(lerp(.5, .36, k), lerp(.5, .38, k), Math.atan2(HP[0], HP[2]) + lerp(.5, .2, k), [HP[0] * .7, sz, HP[2] * .7], 30);
  render3(c, ST.S, cam, { exposure: ex, fx: lens(dist(HP), 12) });
  capBand(c);
  title(c, 'RUDRAKSHA', 560, t, TL.RUDRAKSHA, { size: 100 });
  tag(c, 'SHIVA PURANA · VIDYESHVARA SAMHITA 25', 470, 1462, t, TL.TEARS);
} });

// ================= K · crystal, karungali, red thread: what his devotees wear =================
SHOTS.push({ a: TL.K0, b: TL.L0 + .4, xf: .4, draw(c, u, t) {
  const ex = studio({ t, key: [.6, 2.4, 1.8], keyAt: [0, 0, -.1], cone: .5, spot: 70 });
  DEV.G.visible = true;
  DEV.crystal.position.set(-.1, 0, -.3); DEV.ebony.position.set(-.06, 0, -.02); DEV.thread.position.set(-.1, 0, .24);
  DEV.crystal.rotation.y = .3; DEV.ebony.rotation.y = -.4;
  clip(.02, 60);
  const k = easeIO(u / (TL.L0 + .4 - TL.K0));
  const cam = cam3({ pos: [lerp(.02, 0, k), lerp(2.3, 2.15, k), lerp(1.0, .9, k)], at: [0, 0, .14], fov: 34 });
  render3(c, ST.S, cam, { exposure: ex, fx: lens(dist([0, 0, -.06]), 4) });
  capBand(c);
  sideLabel(c, 'CRYSTAL', 'sphatika', [.06, .01, -.3], t, TL.CRYSTAL, '#E8F2FF');
  sideLabel(c, 'KARUNGALI', 'ebony wood', [.1, .01, -.02], t, TL.KARUNGALI, '#FFE2A0');
  sideLabel(c, 'RED THREAD', 'kalava', [.06, .01, .24], t, TL.RED, '#FFB0A0');
} });

// ================= L · save this: the board over the cobra; the ask =================
SHOTS.push({ a: TL.L0, b: TL.CARD, xf: .4, draw(c, u, t) {
  const ex = studio({ t, key: [1.6, 4.5, 2.6], keyAt: [0, 0, -.6], cone: .62, spot: 160 });
  layout(t);
  clip(.05, 60);
  const cam = cam3({ pos: [.1, 2.6 - u * .03, 2.2 - u * .04], at: [0, .1, -.75], fov: 34 });
  render3(c, ST.S, cam, { exposure: ex, fx: lens(dist([0, .2, -.4]), 14) });
  c.fillStyle = `rgba(6,5,10,${.45 * seg(t, TL.L0, TL.L0 + .5)})`; c.fillRect(0, 0, W, H);
  board(c, t, TL.L0 + .1, { y0: 488 });
  capBand(c, .55);
} });

// ================= the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'The Navadurga Set is out now', note: 'Link in bio' });
} });
