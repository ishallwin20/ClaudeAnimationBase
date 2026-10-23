// rp3_sfx.mjs: the sound effects for Ramayan Part 3 (src/scenes/rp3.js) → assets/rp3_sfx.wav, then the mix with the
// voice → assets/rp3_mix.wav. Times come from the voice (src/scenes/rp1_vo.js), computed as the scene does.
// Beds: the tanpura, the crowd at the gate, the dusk, the night palace, the rain and the river, the forest hut, the
// forest by day. Hits: the bow and the arrow, the ident, the chariot and the king's cry, the empty return, the bubble,
// the listening, the sound at the water, the shot and the cry, the pot, the death, the curse's thunder, the cradle,
// the lamp going out, the crow and the grass, the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, drone, squeak, note, seed, chime, wind, drum, heart, om, conch, chirp, screech, wingbeat, crackle, thunder, gurgle, SR } from './sfx.mjs';

const VO = runInNewContext(readFileSync('src/scenes/rp3_vo.js', 'utf8') + '\n;VO');
const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
const B0 = mid('hook', 'intro'), C0 = mid('intro', 'leave'), D0 = mid('leave', 'back'), E0 = mid('back', 'night'), F0 = mid('night', 'young'), F1 = mid('young', 'river');
const G0 = mid('ask', 'parents'), H0 = mid('curse', 'twist'), I0 = mid('twist', 'died'), J0 = mid('died', 'next'), K0 = mid('next', 'follow'), END = LN.follow.end + 2.5;
const KILLED = Wd('hook', 0, 2), HIM = Wd('hook', 0, 11), WEPT = Wd('leave', 1, 2), RAN = Wd('leave', 1, 7), ALONE = Wd('back', 0, 6);
const SECRET = Wd('night', 0, 7), SKILL = Wd('young', 0, 7), BYSOUND = Wd('young', 0, 11);
const SARAYU = Wd('river', 0, 5), SOUND = Wd('river', 0, 9), ELEPH = Wd('river', 0, 12), SHOT = Wd('shot', 0, 1), BOY = Wd('shot', 0, 4);
const ASCETIC = Wd('pot', 0, 2), BLIND = Wd('pot', 0, 8), TAKE = Wd('ask', 0, 0), DIED = Wd('ask', 0, 7);
const QUIET = Wd('parents', 0, 6), TRUTH = Wd('parents', 1, 7), CURSED = Wd('curse', 0, 2), GRIEV = Wd('curse', 0, 8);
const NOSON = Wd('twist', 0, 4), CRYING = Wd('died', 0, 1), VERY = Wd('died', 0, 7), CROW = Wd('next', 0, 7), GRASS = Wd('next', 1, 5);
const CARD = { head: K0 + .1, title: K0 + .5, pill: LN.follow.a + .2, ask: Wd('follow', 1, 1), books: Wd('follow', 1, 2) + .6 };

const T = track(END);
seed(43);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => { const b = bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }); const s = Math.round(i * .05 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j]; }); return o; };
// a tanpura-ish drone: Pa, Sa, Sa, low Sa plucked in turn over a held tone (D as Sa)
const SA = 50;
const tanpura = (dur, amp = 1) => {
  const o = mixb(tone(dur, note(SA - 12), { type: 'tri', e: env.swell(1.2, 1.2), amp: .25 * amp }), tone(dur, note(SA - 5), { type: 'sine', e: env.swell(1.2, 1.2), amp: .12 * amp }));
  const pl = [SA - 5, SA, SA, SA - 12];
  for (let k = 0; k * .55 < dur - 1.5; k++) { const b = bell(note(pl[k % 4]), 2.2, { partials: [[1, 1], [2, .5], [3, .3], [4, .2]], k: 1.1, amp: .22 * amp }); const s = Math.round(k * .55 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * Math.min(1, (dur - k * .55) / 1.5); }
  return o;
};
const veena = (m, amp = 1) => mixb(bell(note(m), 1.2, { partials: [[1, 1], [2, .6], [3, .35], [5, .12]], k: 3, amp }), noise(.02, { hp: 2000, lp: 6000, e: env.pluck(80), amp: amp * .3 }));
const craneCall = (amp = 1, f = 1) => mixb(tone(.32, t => f * (900 + 500 * Math.sin(t * 30) * Math.exp(-t * 4)), { type: 'tri', e: env.ad(.02, .14), amp }), tone(.32, t => f * 1800, { e: env.ad(.02, .08), amp: amp * .25 }));

const boonHit = () => mixb(shimmer(.8, [note(90), note(93), note(98)], .7, .06), chime(note(86), .7, 1.2));
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
// ---- A: the hook
T.at(0, mixb(drone(B0 + .3, note(SA - 24), .7), noise(B0 + .3, { brown: true, lp: 250, e: env.swell(.1, .4), amp: .5 })), .14, 0);
T.at(.1, slide(KILLED - .2, 200, 600, .5), .14, -.3);   // the bow drawn
T.at(KILLED, whoosh(.4, 1200, 4500), .4, -.6);
T.at(HIM - .1, mixb(drum(44, 1, 1.4), chord([57, 60, 64], 2, .7)), .3, 0);
T.at(B0 - .3, whoosh(.6, 500, 3000), .25, 0);
// ---- B: the ident
T.at(B0, mixb(conch(1.8, 311, .8), chord([62, 69, 74, 78], 2.4, .9)), .22, 0);
T.at(B0 + .35, pop(.8), .25, 0); T.at(B0 + .7, pop(.6, 1.2), .2, 0);
T.at(C0 - .3, whoosh(.6, 400, 2600), .22, 0);
// ---- C: the leaving
T.at(C0, noise(D0 - C0, { lp: 1200, hp: 150, e: env.swell(.5, .5), amp: .4 }), .08, 0);   // the weeping crowd
T.at(C0, pad(D0 - C0 + .3, [57, 60, 64], .9), .1, 0);
for (let k = 0; k * .3 < D0 - C0 - .5; k++) T.at(C0 + .5 + k * .3, thud(.3), .07, -.2 + k * .04);   // hooves
T.at(C0 + .6, mixb(noise(D0 - C0 - .6, { lp: 400, hp: 60, e: env.swell(.4, .4), amp: .5 })), .08, .3);   // the wheels
T.at(RAN - .1, slide(1.4, 620, 480, .4), .1, -.2);   // the king's cry
T.at(D0 - .6, thud(.6), .2, 0);
// ---- D: the return
T.at(D0 - .3, whoosh(.6, 2600, 500), .2, 0);
T.at(D0, wind(E0 - D0, 2, .6), .1, 0);
for (let k = 0; k * .45 < ALONE - D0; k++) T.at(D0 + .2 + k * .45, thud(.3), .07, .4 - k * .06);
T.at(ALONE, mixb(chord([57, 60, 64], 2.2, .7)), .2, 0);
// ---- E: the night
T.at(E0, mixb(drone(F0 - E0, note(SA - 24), .7)), .1, 0);
T.at(E0, tanpura(F0 - E0, .6), .08, 0);
T.at(SECRET - .3, mixb(pop(.7), shimmer(.9, [note(76), note(79), note(84)], .5, .1)), .2, -.2);
// ---- F: the flashback
T.at(F0 - .3, whoosh(.8, 3000, 400), .2, 0);
T.at(F0, noise(G0 - F0, { hp: 1500, lp: 7000, e: env.swell(.6, .6), amp: .5 }), .12, 0);   // the rain
T.at(F0, noise(G0 - F0, { lp: 1600, hp: 200, e: env.swell(.6, .6), amp: .4 }), .08, 0);    // the river
for (let k = 0; k < 3; k++) T.at(F0 + 2 + k * 4, thunder(2, .5), .1, (k - 1) * .5);
T.at(BYSOUND - .2, mixb(shimmer(1.2, [note(84), note(88), note(91)], .5, .1)), .14, -.4);   // listening
for (let k = 0; k < 4; k++) T.at(SOUND - .2 + k * .4, gurgle(.35, .7), .2, .5);            // the pot filling
T.at(ELEPH - .1, mixb(conch(.9, 180, .5)), .08, .5);                                        // what he thinks he hears
T.at(SHOT - .5, slide(.4, 200, 600, .5), .16, -.4);
T.at(SHOT, whoosh(.38, 1200, 4500), .4, 0);
T.at(SHOT + .36, thud(.7), .3, .5);
T.at(BOY - .1, slide(.7, 900, 600, .6), .2, .5);   // the boy's cry
T.at(ASCETIC - .4, mixb(thud(.5), whoosh(.5, 500, 1500)), .2, .3);   // the prince runs to him
T.at(DIED, mixb(chord([57, 60, 64], 2.6, .6), slide(1.4, 480, 380, .3)), .16, 0);
// ---- G: the parents
T.at(G0 - .3, whoosh(.6, 2400, 500), .2, 0);
T.at(G0, noise(H0 - G0, { hp: 1500, lp: 7000, e: env.swell(.5, .5), amp: .4 }), .08, 0);
for (let k = 0; k < 4; k++) T.at(G0 + .2 + k * .35, thud(.3), .1, .6 - k * .1);
T.at(TRUTH, pad(CURSED - TRUTH + .5, [57, 60, 64], .8), .12, 0);
T.at(CURSED - .2, mixb(thunder(2.4, 1)), .26, 0);
T.at(GRIEV - .1, mixb(drum(40, 1, 1.4), noise(1.4, { brown: true, lp: 400, e: env.pluck(3), amp: .8 })), .32, 0);
// ---- H: no son at all
T.at(H0 - .3, whoosh(.6, 400, 2600), .2, 0);
for (let k = 0; k < 4; k++) T.at(H0 + .4 + k * .7, squeak(300, 260, .3, .5), .06, .3);   // the empty cradle rocking
T.at(NOSON, plink(note(81), .8), .22, 0);
// ---- I: the king dies
T.at(I0 - .3, whoosh(.6, 2600, 500), .18, 0);
T.at(I0, mixb(drone(J0 - I0, note(SA - 24), .7)), .1, 0);
T.at(CRYING, mixb(shimmer(1.2, [note(84), note(88), note(91)], .5, .1)), .14, -.2);
T.at(VERY - .2, mixb(noise(.6, { hp: 1000, lp: 4000, e: env.hann(), amp: .6 })), .16, -.6);   // the lamp blown out
T.at(VERY + .2, mixb(chord([50, 57, 62], 3, .7)), .18, 0);
// ---- J: the tease
T.at(J0 - .3, whoosh(.6, 400, 2600), .2, 0);
T.at(J0, tanpura(K0 - J0, .6), .08, 0);
for (let k = 0; k < 4; k++) T.at(J0 + .3 + k * 1.1, chirp(.5), .06, -.5);
T.at(CROW - .6, mixb(wingbeat(1), whoosh(.6, 600, 2400)), .26, .5);
T.at(CROW, mixb(tone(.3, t => 600 - 300 * t, { type: 'saw', e: env.ad(.01, .1), amp: .5 }), tone(.3, t => 640 - 300 * t, { type: 'saw', e: env.ad(.01, .1), amp: .4 })), .16, .3);   // caw
T.at(GRASS - .1, mixb(shimmer(1.2, [note(86), note(90), note(93), note(98)], .7, .07), drum(52, .8, 1)), .26, .2);
// ---- K: the card
T.at(K0 - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(CARD.head, mixb(conch(1.6, 311, .7), chord([62, 69, 74, 78], 2.4, .8)), .22, 0);
T.at(CARD.title, pop(.9), .28, 0); T.at(CARD.title + .2, pop(.7, 1.2), .22, 0);
T.at(CARD.pill, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .3, 0);
T.at(CARD.ask, plink(note(93)), .22, 0);
for (let k = 0; k < 3; k++) T.at(CARD.books + k * .12, pop(.6, 1 + k * .15), .2, (k - 1) * .4);
T.at(K0, tanpura(END - K0, .6), .08, 0);

T.write('assets/rp3_sfx.wav');
console.log('assets/rp3_sfx.wav', END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS (apad needs whole_dur, or it never ends)
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rp3_vo.wav', '-i', 'assets/rp3_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${END.toFixed(3)},atrim=0:${END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/rp3_mix.wav']);
console.log('assets/rp3_mix.wav');
