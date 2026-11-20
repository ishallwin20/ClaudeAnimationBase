// narayan_sfx.mjs: the sound effects for the Narayanastra reel (src/scenes/narayan.js) → assets/narayan_sfx.wav, then the
// mix with the voice → assets/narayan_mix.wav. Times come from the voice and the timeline (src/scenes/narayan_vo.js +
// narayan_tl.js, loaded with vm), so they follow the picture. SFX-led, the bed mild (owner): a low drone that darkens as
// the weapon grows; the burning arrow; a hit on "kills"; a heartbeat on the lie; a boom and a rising chord as the mandala
// ignites; an earthquake, a sea, a river turning; the swarm's whooshes and fire; bowstrings, then a growing roar;
// Krishna's conch; a red pulse on "mind"; weapons clanking down in a wave; a drum for Bhima, hoofbeats; the whole weapon
// falling, a blast; fire, running feet, a thud; the mace on the earth, then total silence, then wind and a bell; a calm
// shimmer for Narayana; hits on AGAIN, ONLY ONCE; pops for BRAVE / FOOLISH; an owl and page flips for the comic; the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, click, shimmer, note, seed, chime, rnd, fire, thunder, conch, drum, heart, rumble, clang, thud, wind, drone, roar } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/narayan_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/narayan_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(100);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const boom = (amp = 1, f = 52) => mixb(tone(2.4, t => f * Math.exp(-t * .9) + f / 2, { e: env.pluck(1.4), amp }), noise(1.2, { lp: 380, hp: 25, brown: true, e: env.pluck(3.5), amp: amp * .8 }));
const hit = (amp = 1) => mixb(boom(amp * .8, 60), noise(.4, { hp: 300, lp: 5000, e: env.pluck(14), amp: amp * .5 }), click(amp * .6));
const pad = (dur, ms, amp = 1, type = 'tri') => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type, e: env.swell(1.2, 1.2), amp: amp / ms.length })));
const twang = (amp = 1) => mixb(tone(.35, t => 160 * (1 + .25 * Math.exp(-t * 30)), { type: 'tri', e: env.pluck(10), amp }), noise(.06, { hp: 1500, lp: 7000, e: env.pluck(80), amp: amp * .3 }));
const metal = (amp = 1) => mixb(clang(900 + rnd() * 1400, amp * .5), noise(.05, { hp: 2500, lp: 9000, e: env.pluck(90), amp: amp * .4 }));
const hoof = (amp = 1) => mixb(tone(.12, t => 90 * Math.exp(-t * 18) + 50, { e: env.pluck(30), amp }), noise(.05, { lp: 900, e: env.pluck(70), amp: amp * .5 }));
const owl = (amp = 1) => mixb(tone(.45, t => 380 * (1 - .06 * t), { e: env.hann(), amp }), tone(.75, t => 360 * (1 - .05 * t), { e: (t, D) => t < .55 ? 0 : Math.sin((t - .55) / .2 * Math.PI) * (t < .75 ? 1 : 0), amp }));
const flip = (amp = 1) => noise(.18, { hp: 1200, lp: t => Math.max(600, 7000 - 20000 * t), e: env.ad(.01, .1), amp });
const sparkle = (amp = 1) => shimmer(.9, [note(88), note(91), note(95), note(100)], .7 * amp, .05);
// a swarm: n whooshes of fire passing, spread over dur
const swarmBed = (dur, n, amp = 1) => { const o = new Float32Array(Math.ceil((dur + 1.2) * 48000)); for (let i = 0; i < n; i++) { const at = rnd() * dur, d = .5 + rnd() * .8, f = 300 + rnd() * 1400, w = whoosh(d, f * 1.6, f * .5, amp * (.4 + rnd() * .6)), s = Math.round(at * 48000); for (let j = 0; j < w.length && s + j < o.length; j++) o[s + j] += w[j]; } return o; };

// ---- the bed: a low drone, darker as the weapon grows; silence after the mace; calm pads after
T.at(0, drone(TL.M0 + 1.5, 55, 1), .05, 0);
T.at(TL.D0, pad(TL.EARTH - TL.D0, [38, 45, 50], 1, 'saw'), .025, 0);
T.at(TL.EARTH + .6, pad(TL.Q0 - TL.EARTH - .3, [57, 64, 69, 76], 1), .045, 0);
T.at(TL.Q0, pad(TL.CARD - TL.Q0 + .5, [50, 57, 62], 1), .04, 0);
// ---- A: the hook
T.at(0, fire(TL.B0 + .2, .7, .9), .05, 0);
T.at(0, boom(.6, 45), .1, 0);
T.at(TL.DROPPING - .05, metal(.8), .06, .2);
T.at(TL.FIGHT - .3, whoosh(.9, 400, 2400, 1), .08, 0);
T.at(TL.FIGHT + .1, swarmBed(2.2, 14, .7), .05, 0);
T.at(TL.KILLS - .08, hit(1.1), .2, 0);
// ---- B: Drona; the lie
T.at(TL.B0, wind(TL.C0 - TL.B0 + .5, 1, .8), .04, 0);
T.at(TL.DRONA - .05, heart(1), .12, 0); T.at(TL.DRONA + .9, heart(.9), .1, 0);
T.at(TL.LIE - .05, mixb(bell(note(45), 3.5, { partials: [[1, 1], [2.02, .5], [2.76, .35]], k: 1.1, amp: 1 }), boom(.4)), .12, 0);
// ---- C: Ashwatthama; he calls the weapon
T.at(TL.C0 + .2, tone(TL.D0 - TL.C0, t => note(43) * (1 + .4 * (t / (TL.D0 - TL.C0)) ** 2), { type: 'saw', e: env.swell(1.5, .2), amp: 1 }), .03, 0);
T.at(TL.TEARS - .1, chime(note(79), .4, 2), .04, .2);
T.at(TL.CALLS - .2, whoosh(1.4, 200, 1200, 1), .05, 0);
T.at(TL.NARAYANA - .05, boom(.7, 48), .12, 0);
// ---- D: the mandala ignites
T.at(TL.D0, whoosh(1.2, 150, 3000, 1), .1, 0);
T.at(TL.NAME - .08, mixb(boom(1.2, 40), thunder(3, 1)), .22, 0);
T.at(TL.NAME, mixb(...[50, 57, 62, 69].map((m, i) => tone(3, note(m), { type: 'saw', e: env.swell(.4, 2), amp: .22 }))), .05, 0);
T.at(TL.NAME + .1, sparkle(.8), .05, 0);
T.at(TL.NAME, fire(TL.EARTH - TL.NAME, .4, .9), .05, 0);
// ---- E: the earth shook; the sea; rivers backwards
T.at(TL.SHOOK - .15, rumble(2.4, 1.2), .2, 0);
T.at(TL.SHOOK - .1, boom(.8, 38), .12, 0);
T.at(TL.SEA - .1, noise(1.6, { brown: true, lp: t => 300 + 900 * Math.sin(t * 2), e: env.swell(.3, .8), amp: 1 }), .12, 0);
T.at(TL.RIVERS - .3, noise(TL.F0 - TL.RIVERS + .6, { brown: true, lp: 600, hp: 60, e: env.swell(.3, .4), amp: 1 }), .1, 0);
T.at(TL.BACK - .4, whoosh(1.1, 3000, 200, 1), .1, 0);
// ---- F: the sky fills
T.at(TL.FILLED - .4, whoosh(1.4, 200, 2600, 1), .1, 0);
T.at(TL.FILLED, swarmBed(TL.G0 - TL.FILLED + .5, 50, 1), .07, 0);
T.at(TL.THOUSANDS - .05, hit(1), .14, 0);
T.at(TL.BALLS - .05, mixb(thud(.8), metal(.5)), .08, -.3);
T.at(TL.DISCS - .1, tone(1, t => 2400 + 300 * Math.sin(t * 60), { type: 'saw', e: env.hann(), amp: .25 }), .04, .3);
// ---- G: they fought back; stronger
for (let i = 0; i < 8; i++) T.at(TL.FOUGHT - .3 + i * .22 + rnd() * .1, twang(.8), .06, (rnd() - .5) * .8);
T.at(TL.G0, swarmBed(TL.H0 - TL.G0 + .5, 46, 1.2), .08, 0);
T.at(TL.STRIKE - .2, tone(TL.STRONGER - TL.STRIKE + .8, t => note(38) * (1 + .5 * t / (TL.STRONGER - TL.STRIKE + .8)), { type: 'saw', e: env.swell(.5, .3), amp: 1 }), .06, 0);
T.at(TL.STRONGER - .05, mixb(hit(1.2), roar(1.6, 90, 6, .6)), .18, 0);
// ---- H: Krishna; drop your weapons; even in his mind
T.at(TL.H0, swarmBed(TL.I0 - TL.H0 + .5, 50, 1), .06, 0);
T.at(TL.KRISHNA - .2, conch(3.2, 311, 1), .16, 0);
T.at(TL.DROP - .05, hit(.7), .1, 0);
T.at(TL.WHOEVER - .25, whoosh(.8, 2000, 300, 1), .06, 0);
T.at(TL.KMIND - .3, heart(1.2), .16, 0); T.at(TL.KMIND + .45, heart(1.1), .14, 0);
T.at(TL.KILL - .05, boom(1, 42), .16, 0);
// ---- I: the army lets its weapons fall
T.at(TL.I0, swarmBed(TL.J0 - TL.I0 + .5, 30, .9), .05, 0);
for (let i = 0; i < 46; i++) { const at = TL.ARMY - .1 + (i / 46) * 2.2 + rnd() * .15; T.at(at, metal(.4 + rnd() * .6), .05, (rnd() - .5) * 1.4); }
T.at(TL.FALL - .1, thud(1), .1, 0);
// ---- J: Bhima; 10,000 elephants; I will fight it
T.at(TL.BHIMA - .05, mixb(drum(60, 1.2, .9), boom(.6)), .2, 0);
T.at(TL.N10K - .05, mixb(hit(1), tone(1.2, t => 600 + 500 * Math.sin(t * 8) * Math.exp(-t * 2), { type: 'saw', e: env.swell(.05, .8), amp: .35 })), .14, 0);
T.at(TL.FIGHTIT - .3, roar(1.4, 110, 6, .8), .1, 0);
for (let i = 0; i < 14; i++) T.at(TL.WILL - .1 + i * .14, hoof(.9), .1, (i % 2 - .5) * .3);
T.at(TL.WILL, noise(TL.K0 - TL.WILL + .3, { brown: true, lp: 250, e: env.swell(.2, .3), amp: 1 }), .08, 0);
// ---- K: the whole weapon falls on him
T.at(TL.WHOLE - .4, whoosh(1.6, 4000, 150, 1.2), .16, 0);
T.at(TL.HEAD - .08, mixb(boom(1.5, 36), thunder(3, 1), noise(1, { hp: 200, lp: 6000, e: env.pluck(4), amp: .8 })), .26, 0);
T.at(TL.HEAD, fire(TL.EARTH - TL.HEAD + .1, 1, 1), .12, 0);
// ---- L: into the fire; dragged; thrown
for (let i = 0; i < 12; i++) T.at(TL.RAN - .2 + i * .2, thud(.35), .06, .3 - i * .04);
T.at(TL.DRAGGED - .1, roar(1.2, 120, 5, .7), .08, 0);
T.at(TL.THREW, whoosh(.5, 600, 200, 1), .08, 0);
T.at(TL.TOGROUND - .05, mixb(thud(1.4), boom(.5, 50)), .18, 0);
// ---- M: the mace on the earth; silence; the sky clears
T.at(TL.MOMENT - .3, whoosh(.8, 300, 1000, 1), .06, 0);
T.at(TL.EARTH - .03, mixb(clang(220, 1), thud(1.6), boom(.8, 40)), .24, 0);
T.at(TL.EARTH + .9, wind(TL.N0 - TL.EARTH + .5, 2, .8), .05, 0);
T.at(TL.SILENT - .05, bell(note(57), 4.5, { partials: [[1, 1], [2.02, .5], [2.76, .35], [4.1, .2]], k: .9, amp: 1 }), .1, 0);
// ---- N: Narayana's own weapon
T.at(TL.N0 + .1, sparkle(.6), .05, 0);
T.at(TL.STOPPED - .2, tone(3.4, t => note(74) * (1 + .006 * Math.sin(t * 30)), { e: env.swell(.4, 1.6), amp: 1 }), .04, 0);
T.at(TL.NARAYANA2 - .05, mixb(chime(note(81), .7, 3), sparkle(1)), .08, 0);
// ---- O: again; only once
T.at(TL.AGAIN - .05, hit(.9), .14, -.1);
T.at(TL.TWICE - .1, mixb(bell(note(43), 3, { partials: [[1, 1], [2.02, .5], [2.76, .35]], k: 1.2, amp: 1 }), boom(.5)), .12, 0);
T.at(TL.ME - .05, boom(.9, 40), .14, 0);
// ---- P: brave or foolish
T.at(TL.BRAVE - .1, pop(.9, 1), .12, -.3);
T.at(TL.FOOLISH - .1, pop(.9, 1.3), .12, .3);
// ---- Q: the night; the comic
T.at(TL.Q0 + .1, owl(1), .07, -.4);
T.at(TL.KILLER - .05, boom(.6, 45), .1, 0);
for (let i = 0; i < 4; i++) T.at(TL.NIGHT - .1 + i * .35, flip(1), .1, (i % 2 - .5) * .6);
T.at(TL.READ - .35, mixb(whoosh(.6, 300, 2400, 1), sparkle(.7)), .1, 0);
// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .16, 0);
T.at(TL.CARD + .35, mixb(...[62, 65, 69, 74].map((m) => bell(note(m), 2.2, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp: .7 }))), .16, 0);
for (let k = 0; k < 3; k++) T.at(TL.CARD + .8 + k * .2, pop(.8, 1 + k * .15), .16, (k - 1) * .4);
T.at(TL.CARD + 1.3, mixb(pop(1, 1.3), shimmer(.7, [note(86), note(89), note(93)], .6, .06)), .18, 0);

T.write('assets/narayan_sfx.wav');
console.log('assets/narayan_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/narayan_vo.wav', '-i', 'assets/narayan_sfx.wav', '-filter_complex',
  `[1:a]volume=0.8[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/narayan_mix.wav']);
console.log('assets/narayan_mix.wav');
