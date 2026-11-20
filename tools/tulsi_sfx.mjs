// tulsi_sfx.mjs: the sound of "Why do we marry TULSI to a STONE?" (src/scenes/tulsi.js) → assets/tulsi_sfx.wav, then the
// mix with the voice (assets/tulsi_vo.wav, tools/tulsi_vo.json) → assets/tulsi_mix.wav. Times come from the scene's TL
// (built from the voice), so the sound follows the picture. Quiet, under the voice: a soft drone bed through the story;
// crickets and lamps in the courtyard; the ocean and a conch as Vishnu wakes; the river at night, time rushing, a
// shimmer for the wish and for Brahma's lotus; war drums and fire; the lamp snuffed in silence, then the trishul's
// whoosh and the hit; a bell on the curse; the river of light and the tulsi growing; a chime as the leaf lands; temple
// bells for the wedding; the card. Music is added on Instagram.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, noise, bell, mixb, env, whoosh, shimmer, note, seed, chime, drum, wind, chirp, thunder, rumble, heart, rnd, drone, conch, fire, crackle } from './sfx.mjs';

const DUR = +readFileSync('src/config.js', 'utf8').match(/duration:\s*([\d.]+)/)[1];
const vo = readFileSync('src/scenes/tulsi_vo.js', 'utf8'), sc = readFileSync('src/scenes/tulsi.js', 'utf8');
const TL = runInNewContext(vo + '\n' + sc.match(/const TL = \(\(\) => \{[\s\S]*?\n\}\)\(\);/)[0] + '\n;TL', { DUR });
const T = track(DUR);
seed(104);
const templeBell = (f = 62, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const water = (dur, amp = 1) => noise(dur, { lp: t => 600 + 220 * Math.sin(t * .8), hp: 120, e: env.swell(1, 1), amp });
const crickets = (t0, t1, amp = .008) => { for (let t = t0; t < t1; t += .25 + rnd() * .4) T.at(t, chirp(.5), amp, rnd() - .5); };
const sea = (dur, amp = 1) => noise(dur, { lp: t => 420 + 260 * Math.abs(Math.sin(t * .4)), hp: 40, e: env.swell(1, 1), amp, brown: true });

// ---- the bed: a soft drone on Sa and Pa through the story (out for the war; back for the wedding)
const bed = (a, b, amp = .022) => { if (b > a) T.at(a, drone(b - a, note(48), 1), amp, 0); };
bed(0, TL.AS0 + .2); bed(TL.CU0, TL.CARD - .3, .02);
// ---- 1. the courtyard: crickets, a temple bell on frame 0, a glint on "stone"
crickets(0, TL.WAKE0); T.at(.05, templeBell(62, .8), .08, 0);
T.at(TL.STONE0 - .05, chime(note(93), .7, 2.5), .07, .2);
// ---- 2. the ocean of milk; on "he wakes" a conch and a rising shimmer; a bell on "his"
T.at(TL.WAKE0 - .3, sea(TL.WHO0 - TL.WAKE0 + 1, 1), .06, 0);
T.at(TL.WAKES - .5, noise(1.2, { lp: t => 300 + 3000 * t / 1.2, hp: 100, e: env.swell(1, .1), amp: 1 }), .04, 0);
T.at(TL.WAKES - .05, conch(3.2, 311, 1), .07, 0);
T.at(TL.WAKES + .1, shimmer(2.6, [note(81), note(86), note(88), note(93), note(98)], .6, .12), .05, 0);
T.at(TL.HIS - .05, templeBell(67, .7), .07, 0);
// ---- 3–5. the riverbank at night: water, crickets; time rushing; the wish; Brahma's lotus
T.at(TL.WHO0 - .2, water(TL.AS0 - TL.WHO0 + .5, 1), .03, 0); crickets(TL.WHO0, TL.AS0);
T.at(TL.KARTIK - .1, shimmer(2, [note(86), note(90), note(93)], .5, .15), .04, 0);
T.at(TL.LAKH - .3, whoosh(2.4, 200, 4000), .05, 0); T.at(TL.LAKH, wind(TL.WISH - TL.LAKH, 0, .6), .03, 0);
T.at(TL.NARAYANA - .2, shimmer(2.4, [note(81), note(85), note(88), note(93)], .6, .2), .05, 0);
T.at(TL.BR0 - .2, shimmer(3, [note(74), note(79), note(83), note(86), note(91)], .7, .1), .06, 0); T.at(TL.BR0, templeBell(50, .9), .07, 0);
T.at(TL.NARAYANA2 - .2, chime(note(93), .6, 2.4), .05, .3);
// ---- 6. Shankhachuda: war drums, fire, a low rumble; the vow's lamp; the shield ringing; heaven burning
T.at(TL.AS0 - .2, rumble(TL.VOW - TL.AS0 + .5, 1), .08, 0);
[0, .5, 1.0, 1.25, 1.5, 2.0].forEach(d => T.at(TL.AS0 + d, drum(55, 1, 1.2), .14, 0));
T.at(TL.AS0, fire(TL.VOW - TL.AS0 + .4, .4, .8), .04, 0);
T.at(TL.VOW, chime(note(86), .5, 2.2), .05, 0);
T.at(TL.DEATH - .1, rumble(TL.SHIVA - TL.DEATH + .3, 1), .07, 0);
T.at(TL.DEATH + .05, shimmer(1.6, [note(93), note(98), note(105)], .6, .05), .06, 0);
for (let i = 0; i < 5; i++) T.at(TL.DEATH + .3 + i * .18, chime(note(98 + (i % 2) * 3), .5, .8), .05, rnd() - .5);
T.at(TL.HEAVEN, fire(TL.SHIVA - TL.HEAVEN + .3, .6, 1), .07, 0); T.at(TL.HEAVEN + .1, drum(45, 1, 1.6), .16, 0);
// ---- 7. Shiva: thunder on the bolt, a damru-ish roll; the palace: the night, a soft eerie swell as he comes
T.at(TL.SHIVA + .45, thunder(2.4, .9), .14, -.3); T.at(TL.SHIVA, rumble(1.6, 1), .07, 0);
crickets(TL.VISHNU2, TL.BR1, .006);
T.at(TL.VISHNU2 + .2, noise(2.4, { lp: t => 300 + 900 * t / 2.4, hp: 80, e: env.swell(1.2, 1), amp: 1 }), .03, 0);
T.at(TL.HUSBAND - .1, shimmer(1.8, [note(74), note(77), note(81)], .5, .2), .035, -.4);
// ---- 8. the lamp goes out (a soft puff, then near silence); the trishul whooshes in, the hit, the fall
T.at(TL.BROKEN - .05, noise(.5, { lp: 1200, hp: 200, e: env.swell(.02, .4), amp: 1 }), .06, 0);
T.at(TL.TRISHUL - .35, whoosh(.7, 400, 6000), .14, -.4);
T.at(TL.STRUCK, mixb(drum(38, 1, 1.6), noise(.5, { hp: 1500, lp: 9000, e: env.pluck(14), amp: .6 })), .26, 0);
T.at(TL.STRUCK + .02, thunder(3, 1), .14, 0); T.at(TL.STRUCK + .3, rumble(2.2, 1), .1, 0);
T.at(TL.STRUCK + .4, crackle(1.6, 1), .04, 0);
// ---- 9. she sees: a cold shimmer as the disguise melts; the curse: a heartbeat, then a deep bell on "become"
T.at(TL.REALLY - .5, shimmer(2.2, [note(86), note(89), note(93), note(98)], .6, .15), .05, -.3);
[0, .9].forEach((d, i) => T.at(TL.HEART - .3 + d, heart(1 - i * .2), .12, 0));
T.at(TL.BECOME - .05, templeBell(43, 1), .16, 0); T.at(TL.BECOME, rumble(2.4, 1), .08, 0);
// ---- 10. the light gathers into a stone: a falling shimmer, a soft knock; his answer: a warm chime
T.at(TL.AC0 + .2, shimmer(2.2, [note(98), note(93), note(88), note(86), note(81)], .5, .25), .05, -.3);
T.at(TL.SAID - .45, drum(70, .6, .4), .06, -.3);
T.at(TL.FOREVER - .1, shimmer(2.4, [note(81), note(86), note(90), note(93)], .5, .12), .05, 0);
// ---- 11–12. the river of light, the tulsi growing, the stones; the leaf lands
T.at(TL.BO0 - .2, water(TL.WH0 - TL.BO0 + .4, 1), .045, 0); crickets(TL.BO0, TL.WH0, .006);
T.at(TL.GANDAKI - .6, whoosh(2.2, 300, 3000), .05, 0); T.at(TL.GANDAKI - .2, shimmer(3, [note(81), note(86), note(88), note(93), note(98), note(100)], .5, .18), .05, 0);
T.at(TL.TULSI2 - .4, shimmer(2, [note(88), note(93), note(95), note(100)], .5, .14), .045, .2);
T.at(TL.SHALIGRAM - .05, templeBell(55, .8), .08, 0);
T.at(TL.TOGETHER, chime(note(93), .8, 3.4), .09, 0); T.at(TL.TOGETHER + .05, chime(note(100), .5, 3), .05, .2);
// ---- 13–15. the courtyard wedding: crickets, bells, a conch on "marry", the rounds, petals
crickets(TL.WH0, TL.CARD, .007);
T.at(TL.WITHOUT, chime(note(98), .6, 2.2), .07, 0);
T.at(TL.EVERY, templeBell(62, .7), .07, -.2);
T.at(TL.MARRY - .05, conch(2.8, 311, 1), .06, 0); T.at(TL.MARRY, shimmer(2.4, [note(86), note(90), note(93), note(98)], .6, .1), .05, 0);
for (let t = TL.RI0; t < TL.ASK0; t += 1.0) T.at(t, templeBell(t % 2 < 1 ? 67 : 69, .4), .035, rnd() - .5);
T.at(TL.KANYA - .1, shimmer(2.4, [note(81), note(86), note(88), note(93)], .6, .1), .05, 0);
T.at(TL.YOU - .1, templeBell(62, .8), .08, 0);
// ---- 16. the card
T.at(TL.CARD - .2, whoosh(.8, 400, 3000), .08, 0);
T.at(TL.CARD + .4, chime(note(86), .7, 3), .08, 0);

T.write('assets/tulsi_sfx.wav');
console.log('assets/tulsi_sfx.wav', DUR.toFixed(2), 's');
// the mix: the voice on top, the SFX under it; -14 LUFS
const D = DUR.toFixed(3);
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/tulsi_vo.wav', '-i', 'assets/tulsi_sfx.wav', '-filter_complex',
  `[0:a]aresample=48000[v];[1:a]aresample=48000,volume=${process.env.SFX ?? .55}[s];[v][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11:linear=true[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/tulsi_mix.wav']);
console.log('assets/tulsi_mix.wav');
