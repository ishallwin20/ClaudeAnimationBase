// asuras.js: the other asuras of the Devi Mahatmya, drawn on Mahishasura's rig (mahishasura.js) with their own colours,
// horns, hair and headgear:
//   shumbha    the demon king who stole heaven (ch. 5): violet, short horns, a tall gold crown with a ruby
//   nishumbha  his younger brother: teal, short horns, a smaller gold crown, a thin moustache
//   chanda     one of his two spies and generals: red-orange, ONE horn, a spiky mane
//   munda      the other: mustard, a shaved head with a topknot ("munda": shaven), no horns
//   dhumra     Dhumralochana ("smoke-eyed"), the general turned to ash by her "HUM" (ch. 6): ash-grey, smoke rising
//              from his eyes
//   messenger  the little messenger who carries the proposal: pale green, a white turban with a peacock feather, no
//              tusks, no sword or shield
// None of them has Mahishasura's gold nose ring (his sign in every form).
// Load after mahishasura.js.
//
// asura(x, y, u, o): o.kind picks one of the above (default 'shumbha'); every mahishasura() option works and wins over
// the preset (pal is merged). The preset's sword / shield: shumbha, nishumbha, messenger have none; the generals have
// both. Helpers: asuraHead / asuraMouth / asuraHand(x, y, u, o, s) → world [x, y] (as mahishasura's);
// asuraCrown(u, sw, o) draws a crown in head space (o.tall, o.gem, o.ink).
const ASURAS = {
  shumbha: { pal: { skin: '#8A6CC8', skinDk: '#654A9E', skinLt: '#B29AE6', hair: '#2A1E3A', hairLt: '#4E3E66', sash: '#E8A33A', sashDk: '#B67D1C', dhoti: '#8E1E44', dhotiDk: '#62122E', ink: '#2A1E36' },
    horns: 'short', ring: false, sword: false, shield: false, crown: { tall: 1, gem: '#E2303E' } },
  nishumbha: { pal: { skin: '#4FA39A', skinDk: '#357A72', skinLt: '#7CC8BE', hair: '#1E2A30', hairLt: '#3E4E56', sash: '#7A3E9A', sashDk: '#552A6E', dhoti: '#3A2E6A', dhotiDk: '#28204C', ink: '#1E2A2E' },
    horns: 'short', stache: 'thin', ring: false, sword: false, shield: false, crown: { tall: .6, gem: '#3A8AE0' } },
  chanda: { pal: { skin: '#E0703E', skinDk: '#B04E28', skinLt: '#F49A68', hair: '#2E1A1A', sash: '#3E6A3A', sashDk: '#284A26', dhoti: '#5A3A7A', dhotiDk: '#3E2856', ink: '#2E1A1A' },
    horns: 'one', stache: 'thin', ring: false },
  munda: { pal: { skin: '#D9B24A', skinDk: '#AC8A2E', skinLt: '#EED07A', hair: '#2A2220', sash: '#3A5A9A', sashDk: '#283E6E', dhoti: '#8A2E2E', dhotiDk: '#62201E', ink: '#2A2220' },
    horns: 'none', hair: 'topknot', ring: false },
  dhumra: { pal: { skin: '#8E8C9A', skinDk: '#66647A', skinLt: '#B4B2C0', hair: '#34323E', hairLt: '#55525F', eye: '#E8E6F0', sash: '#4A4858', sashDk: '#34323E', dhoti: '#3E3A4A', dhotiDk: '#2A2834', ink: '#262430' },
    horns: 'short', hair: 'bald', ring: false, smoke: 1 },
  messenger: { pal: { skin: '#9CC48A', skinDk: '#74A062', skinLt: '#C2E0B2', hair: '#2A3A26', sash: '#E8A33A', sashDk: '#B67D1C', dhoti: '#C0505A', dhotiDk: '#8E3440', ink: '#24321E' },
    horns: 'none', hair: 'bald', stache: 'thin', tusks: false, ring: false, sword: false, shield: false, turban: 1 },
};

// a crown in head space (mahishasura's head: centre (0, -18.4), r 3): a gold band with five points and a gem
function asuraCrown(u, sw, o = {}) {
  const tall = o.tall ?? 1, INK = o.ink || MHS.ink, top = -21.0 - 2.6 * tall;
  const P = [[-2.7, -20.2], [-2.9, -21.0 - 1.2 * tall], [-1.9, -20.9 - .4 * tall], [-1.2, top + .6], [-.55, -20.9 - .5 * tall], [0, top], [.55, -20.9 - .5 * tall], [1.2, top + .6], [1.9, -20.9 - .4 * tall], [2.9, -21.0 - 1.2 * tall], [2.7, -20.2], [0, -20.0]];
  paint(U(P, u), { wash: MHS.gold, fill: MHS.goldDk, fillOp: 60, tex: .4, ink: INK, sw: sw * .8, curv: .1 });
  inkLine(U([[-2.75, -20.55], [0, -20.35], [2.75, -20.55]], u), sw * 1.4, MHS.goldDk, 'ink', .5);
  for (const x of [-1.2, 1.2]) paint(ellPts(x * u, (top + .9) * u, .22 * u, .22 * u, 8), { wash: MHS.goldLt, ink: INK, sw: sw * .35 });
  paint(ellPts(0, (-20.8 - .6 * tall) * u, .42 * u, .5 * u, 12), { wash: o.gem || '#E2303E', ink: INK, sw: sw * .5 });
  paint(ellPts(-.12 * u, (-20.95 - .6 * tall) * u, .13 * u, .15 * u, 6), { wash: '#FFF4E8', ink: null });
}
// the messenger's white turban with a peacock feather (head space)
function asuraTurban(u, sw, INK) {
  paint(ellPts(0, -20.6 * u, 3.2 * u, 1.55 * u, 22), { wash: '#FFF4E2', fill: '#E8D8C0', fillOp: 70, tex: .4, ink: INK, sw: sw * .8 });
  for (const k of [-1, 0, 1]) inkLine(U([[-2.8, -20.4 + k * .5 + .2], [0, -21.0 + k * .5], [2.8, -20.6 + k * .5 - .1]], u), sw * .5, '#D8C4A6', 'inkfine', .5);
  paint(ellPts(0, -21.2 * u, .45 * u, .45 * u, 10), { wash: '#E2303E', ink: INK, sw: sw * .4 });
  const f = Math.sin(T * 4) * .25;
  paint(U(ribbon([[.2, -21.6], [.6 + f * .3, -23.0], [1.3 + f, -24.2]], .25, .5), u), { wash: '#3E8A6A', ink: INK, sw: sw * .4 });
  paint(ellPts((1.35 + f) * u, -24.3 * u, .55 * u, .45 * u, 12), { wash: '#2E9AA8', ink: INK, sw: sw * .4 });
  paint(ellPts((1.35 + f) * u, -24.3 * u, .22 * u, .2 * u, 8), { wash: '#1E2E6A', ink: null });
}
// smoke curling up from Dhumralochana's eyes (head space)
function asuraSmoke(u, sw, k = 1) {
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) {
    const a = frac(T * .7 + i / 4 + (s > 0 ? .13 : 0)), y = -19.9 - a * 6.5, x = s * (1.15 + a * 1.4) + Math.sin(a * 6 + i + s) * .6 * a, r = (.3 + a * .9) * k;
    paint(ellPts(x * u, y * u, r * u, r * .85 * u, 10), { wash: i % 2 ? '#DAD6E4' : '#B8B4C6', washOp: 230 * (1 - a * a), ink: '#6A6680', sw: sw * .3 * (1 - a) });
  }
}

function asuraOpts(o = {}) {
  const P = ASURAS[o.kind || 'shumbha'], INK = { ...MHS, ...P.pal, ...(o.pal || {}) }.ink;
  const q = { ...P, ...o, pal: { ...P.pal, ...(o.pal || {}) } };
  const hat = o.hat;
  q.hat = (u, sw) => {
    if (P.smoke && o.smoke !== 0) asuraSmoke(u, sw, o.smoke ?? 1);
    if (P.crown && o.crown !== false) asuraCrown(u, sw, { ...P.crown, ink: INK });
    if (P.turban) asuraTurban(u, sw, INK);
    if (hat) hat(u, sw);
  };
  return q;
}
function asura(x, y, u, o = {}) { mahishasura(x, y, u, asuraOpts(o)); }
function asuraHead(x, y, u, o = {}) { return mahishHead(x, y, u, o); }
function asuraMouth(x, y, u, o = {}) { return mahishMouth(x, y, u, o); }
function asuraHand(x, y, u, o = {}, s = 1) { return mahishHand(x, y, u, asuraOpts(o), s); }

// Model sheet: studio.html?loop=asuras, or node render.mjs --loop=asuras --sheet=0.5,2.5 --cols=2 --w=540
(() => {
  LOOPS.asuras = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#E4DCCF', ink: null });
    const u = 15, c = t % 4;
    asura(270, 600, u, { kind: 'shumbha', eyes: c < 2 ? 'heart' : 'normal', mouth: c < 2 ? 'smile' : 'smirk', blush: c < 2 ? .8 : 0, handL: [-3.6, -17.5], handR: [3.6, -17.5], boilKey: 's1' });
    asura(810, 600, u, { kind: 'nishumbha', eyes: 'happy', mouth: 'laugh', mouthK: .6 + .4 * Math.abs(Math.sin(t * 9)), boilKey: 's2' });
    asura(270, 1080, u, { kind: 'chanda', eyes: 'angry', mouth: 'roar', handR: [6.0, -19.5], swordA: -.3, boilKey: 's3' });
    asura(810, 1080, u, { kind: 'munda', eyes: c < 2 ? 'wide' : 'swirl', mouth: 'O', boilKey: 's4', hx: -.3 });
    asura(270, 1560, u, { kind: 'dhumra', eyes: 'normal', mouth: 'smirk', brows: -.6, handR: [5.5, -18], boilKey: 's5' });
    asura(810, 1560, u * .8, { kind: 'messenger', eyes: 'wide', mouth: 'wobble', sweat: frac(t), shake: 1, boilKey: 's6' });
  };
  LOOPS.asuras.len = 4;
})();
