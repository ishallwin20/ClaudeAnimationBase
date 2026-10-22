// sanj_sfx.mjs: the sound effects for "Why did Hanuman bring the WHOLE MOUNTAIN?" (src/scenes/sanj.js) →
// assets/sanj_sfx.wav, then the mix with the voice → assets/sanj_mix.wav. Times come from the voice (src/scenes/sanj_vo.js),
// computed as the scene does.
// Beds: the wind of the flight, the war drums of Lanka at dusk, the night camp, the mountain's wind, the flashback's
// soft drone. Hits: Ravana's roar, the eight bells, Maya's shimmer, the throw and the strike, the fall, the pull and
// the snap, the heartbeat, the bubble, the launch, the landing, the shakes and the rockfall, the grinding, the sniff,
// the rise, the second mountain's pop, the herbs ducking, the steam, the thud of the mountain set back, the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, drone, squeak, crunch, note, seed, chime, wind, drum, heart, roar, rockfall, om, SR } from './sfx.mjs';

const VO = runInNewContext(readFileSync('src/scenes/sanj_vo.js', 'utf8') + '\n;VO');
const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
const B0 = mid('hook', 'spear'), C0 = mid('spear', 'fall'), D0 = mid('fall', 'ram'), G0 = mid('herbs', 'same'), I0 = mid('lift', 'wake'), J0 = mid('wake', 'twist'), K0 = mid('twist', 'hid'), L0 = mid('hid', 'ask'), CARD = LN.ask.end + 1.4, END = CARD + 7.6;
const RAVW = Wd('spear', 0, 3), MAYA = Wd('spear', 1, 2), BELLS = Wd('spear', 1, 5), THROW = LN.spear.end - .25;
const STRIKE = Wd('fall', 0, 1), FALLS = Wd('fall', 0, 7);
const PULL = Wd('ram', 0, 1), BREAK = Wd('ram', 0, 5), WEEP = Wd('ram', 0, 8);
const SUSH = LN.sush.a, ALIVE = Wd('sush', 0, 9), FOUR = Wd('herbs', 0, 1), GO = Wd('herbs', 0, 6);
const CANT = Wd('same', 0, 4), ONE = Wd('same', 0, 6), THREE = Wd('lift', 0, 5), BRINGS = Wd('lift', 0, 8), WHOLE = Wd('lift', 0, 10);
const CRUSH = Wd('wake', 0, 1), BREATH = Wd('wake', 0, 5), RISES = Wd('wake', 0, 8);
const SECOND = Wd('twist', 0, 8), HID = Wd('hid', 0, 5), TOOK = Wd('hid', 1, 2), BACK = Wd('hid', 1, 8), YES = Wd('ask', 1, 1);
const CAP_T = CARD + .1, COVERS = CARD + .4, PRICE = CARD + 1.2, STRIKEC = CARD + 1.7, DEAD = CARD + 2.2, PILL = CARD + 2.7;

const T = track(END);
seed(32);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const tinyBell = (m, amp = 1) => bell(note(m), .8, { partials: [[1, 1], [2.4, .5], [3.9, .25]], k: 4, amp });
const grind = (amp = 1) => noise(.28, { hp: 400, lp: 2600, e: env.hann(), amp });

// ---- A: the flight
T.at(0, wind(B0 + .3, 0, .4), .16, 0);
T.at(.1, chord([67, 71, 74], 1.6, .6), .14, 0);
T.at(B0 - .35, whoosh(.7, 400, 2600), .25, 0);

// ---- B: Ravana, the spear of eight bells
T.at(B0, noise(D0 - B0, { brown: true, lp: 200, e: env.swell(.5, .5), amp: .5 }), .1, 0);   // the battle's rumble
for (let k = 0; k < Math.floor((C0 - B0) / .6); k++) T.at(B0 + .2 + k * .6, drum(k % 2 ? 62 : 52, .8, .5), .14, 0);   // war drums
T.at(RAVW - .1, roar(1.3, 115, 10, .6), .2, 0);
T.at(MAYA - .2, shimmer(1.0, [note(79), note(82), note(86), note(89)], .6, .07), .14, .3);
for (let i = 0; i < 8; i++) T.at(BELLS + i * .045, tinyBell(88 + (i % 3) * 3, .7), .14, -.4 + i * .1);
T.at(THROW - .45, whoosh(.45, 300, 900), .2, .2);
T.at(THROW, whoosh(.5, 900, 4000), .35, -.6);

// ---- C: the strike, the fall
T.at(C0, whoosh(.9, 600, 3200), .25, .6);
T.at(STRIKE + .1, mixb(thud(1), clang(note(64), .6)), .35, 0);
for (let i = 0; i < 6; i++) T.at(STRIKE + .14 + i * .04, tinyBell(91, .5), .08, 0);
T.at(FALLS + .35, thud(.9), .35, -.2);
T.at(FALLS + .4, noise(.6, { lp: 1200, hp: 200, e: env.pluck(6), amp: .5 }), .15, 0);

// ---- D–F: the camp
T.at(D0, wind(G0 - D0, 1, .6), .06, 0);
T.at(D0 + .1, pad(SUSH - D0, [57, 60, 64], .9), .1, 0);   // sorrow
T.at(PULL, slide(.35, 300, 700, .4), .16, 0);
T.at(BREAK, crunch(1), .35, 0);
T.at(BREAK + .5, thud(.5), .15, -.5); T.at(BREAK + .6, thud(.4), .12, .5);
T.at(WEEP, slide(1.2, 620, 520, .3), .08, 0);
T.at(SUSH - .4, mixb(plink(note(84)), click(.5)), .2, -.6); T.at(SUSH + .15, thud(.4), .15, -.5);
for (let k = 0; k < 3; k++) T.at(ALIVE - .6 + k * .67, heart(1), .3, .1);
T.at(ALIVE, chord([72, 76, 79, 84], 1.6, .8), .22, 0);
T.at(FOUR - .2, mixb(pop(.8), shimmer(.8, [note(84), note(88), note(91), note(95)], .6, .07)), .25, -.2);   // the bubble
T.at(FOUR - .6, whoosh(.5, 500, 2000), .15, .6);                                                         // Hanuman steps in
T.at(GO - .1, slide(.3, 200, 120, .5), .2, .4);                                                         // the crouch
T.at(GO + .1, mixb(whoosh(.9, 300, 5000), thud(.6)), .4, .4);                                           // the launch

// ---- G–H: the mountain
T.at(G0, wind(I0 - G0, 2, .6), .2, 0);
T.at(G0 - .2, whoosh(.5, 4000, 600), .3, 0);
T.at(G0 + .25, thud(.9), .35, -.3);
T.at(CANT, plink(note(81), .8), .25, -.3);
T.at(ONE, plink(note(76), .8), .2, .3);
T.at(ONE + .5, squeak(700, 600, .2, .6), .1, -.3);   // the head scratch
for (const dt of [-.45, -.05, .35]) T.at(THREE + dt, mixb(rockfall(.4, .7), thud(.5)), .3, 0);
T.at(BRINGS - .1, rockfall(1.4, 1), .45, 0);
T.at(BRINGS + .2, whoosh(1.0, 200, 3000), .3, 0);
T.at(WHOLE, chord([67, 71, 74, 79], 1.8, .8), .25, 0);
T.at(WHOLE + .3, whoosh(.8, 600, 5000), .35, .5);

// ---- I: the wake
T.at(I0, mixb(wind(J0 - I0, 3, .5)), .05, 0);
T.at(I0 + .1, thud(.8), .3, .4);   // the peak lands
for (let k = 0; k < Math.floor((BREATH - .3 - I0) / .32); k++) T.at(I0 + .2 + k * .32, grind(.9), .22, .2);
T.at(BREATH, noise(.9, { hp: 900, lp: 5000, e: env.swell(.3, .3), amp: .6 }), .2, .3);   // the sniff
T.at(RISES - .1, mixb(chord([67, 71, 74, 79, 83], 2.2, .9), shimmer(1.4, [note(86), note(91), note(95), note(98)], .7, .08)), .3, 0);

// ---- J: the second mountain
T.at(J0 - .3, whoosh(.6, 400, 3000), .22, 0);
T.at(J0, pad(K0 - J0, [65, 69, 72], .8), .1, 0);
T.at(SECOND - .1, mixb(pop(1, 1.2), plink(note(91))), .3, .4);

// ---- K: the flashback
T.at(K0 - .3, whoosh(.6, 3000, 600), .2, 0);
T.at(K0, om(L0 - K0, 98, .5), .08, 0);
T.at(K0 + .2, thud(.8), .3, -.3);
for (let i = 0; i < 6; i++) T.at(HID - .5 + i * .08, squeak(900 + i * 80, 400, .14, .7), .14, .2 + i * .05);
T.at(HID + .3, noise(1.2, { hp: 1200, lp: 6000, e: env.swell(.1, .5), amp: .5 }), .16, -.3);   // the steam
T.at(TOOK - .2, rockfall(1.0, .9), .4, 0);
T.at(TOOK, whoosh(.8, 200, 2400), .25, 0);
T.at(BACK + .05, mixb(thud(1), rockfall(.6, .5)), .4, 0);
T.at(BACK + .35, mixb(plink(note(96)), chime(note(91), .5, 1)), .25, -.3);

// ---- L: the ask
T.at(L0 - .3, whoosh(.6, 400, 3000), .22, 0);
T.at(L0, pad(CARD - L0, [65, 69, 72], .9), .12, 0);
for (let k = 0; k < 4; k++) T.at(L0 + .3 + k * .8, drum(90, .6, .3), .08, 0);
T.at(YES, mixb(plink(note(96)), click(.6)), .3, 0);

// ---- M: the card
T.at(CARD - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(CAP_T, chord([67, 71, 74, 79], 2.2, .7), .25, 0);
for (let k = 0; k < 3; k++) T.at(COVERS + k * .12, pop(.8, 1 + k * .15), .3, (k - 1) * .4);
T.at(PRICE, pop(.6, .9), .2, 0);
T.at(STRIKEC, mixb(noise(.28, { lp: 4200, hp: 900, e: env.hann(), amp: .8 }), clang(note(88), .5)), .3, 0);
T.at(DEAD, plink(note(91)), .2, 0);
T.at(PILL, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .32, 0);
T.at(CARD, pad(END - CARD, [67, 71, 74], .7), .08, 0);

T.write('assets/sanj_sfx.wav');
console.log('assets/sanj_sfx.wav', END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS (apad needs whole_dur, or it never ends)
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/sanj_vo.wav', '-i', 'assets/sanj_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${END.toFixed(3)},atrim=0:${END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/sanj_mix.wav']);
console.log('assets/sanj_mix.wav');
