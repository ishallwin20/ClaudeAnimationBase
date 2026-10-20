// markandeya_sfx.mjs: the sound effects for the Markandeya reel (src/scenes/markandeya.js), under the Lyria score.
// Times match TL. Then it mixes the score (assets/markandeya_score.mp3, Lyria take 2 of 3 from tools/markandeya_score.txt)
// under the effects.
//   The hook: a boom, a low drone and a clock ticking; a rising whoosh into the cut. The boon: night crickets, a temple
//   bell, a shimmer as Shiva's light appears. The lamps: each flame catches; the dim one is snuffed, the bright one
//   roars up. Markandeya: an om drone and the lamps; a cold gust. The messengers: a heartbeat, growls, the linga's flare
//   (a boom and a shimmer), their howl as they reel back. Death rides in: thunder, hooves, his buffalo's bell, a snort.
//   The hug: a racing heart and breath. The noose: its whir and whoosh, the loop's snap; then silence but one high note;
//   the stone cracking; a rising rush into the drop: the burst (boom, thunder, rockfall, shimmer). Shiva's fury: a damru
//   roll. The kick: a whoosh, the impact, the crown and the mace clanging down. Death dead: wind and one bell. The Earth:
//   a groaning rumble, cracks, a murmuring crowd. The gods: Vishnu's chakra whirring, a conch. Yama wakes: a shimmer, a
//   heartbeat. Dawn: birds. The ask: a conch and an om. The card's chimes.
//   node tools/markandeya_sfx.mjs   → assets/markandeya_sfx.wav and assets/markandeya_mix.wav
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { clamp, track, tone, noise, bell, mixb, whoosh, crackle, crunch, clang, shimmer, env, note, seed, rnd, thunder, wind, drum, fire, om, conch, chime, chirp, roar, rockfall, heart, laughter, thud, rumble, whir, damru, drone } from './sfx.mjs';

const TL = { hook: 0, nobody: 2.9, boon: 5.75, ask: 8.3, wise: 10.9, chose: 13.5, mark: 16.0, day: 18.6, duta: 21.25,
  flare: 24.1, yama: 26.75, hug: 29.6, throw: 32.5, loop: 34.0, crack: 35.9, drop: 37.1, fury: 39.9, kick: 42.75,
  dead: 45.4, earth: 48.0, gods: 50.6, revive: 53.2, forever: 55.8, ask2: 58.6, card: 61.6, end: 66.5 };
const T = track(TL.end);
seed(25);
const pent = [0, 2, 4, 7, 9];
const boom = (f = 32, amp = 1, len = 2.2) => mixb(drum(f, amp, len), noise(.8, { brown: true, lp: 220, e: env.pluck(3), amp: 1.3 * amp }));
const tick = (amp = 1) => mixb(noise(.03, { hp: 2500, lp: 9000, e: env.pluck(160), amp }), tone(.04, 2100, { e: env.pluck(120), amp: amp * .3 }));
const cricket = (dur, f = 4600) => tone(dur, t => f, { e: (t, D) => clamp(t / .3) * clamp((D - t) / .3) * (Math.sin(t * 2 * Math.PI * 28) > .2 ? 1 : 0), amp: 1 });
const flame = (amp = 1, dur = .7) => noise(dur, { brown: true, lp: t => 300 + 1600 * Math.exp(-t * 4), e: env.swell(.02, .5), amp });
const breath = (dur, rate = 1.3) => noise(dur, { hp: 300, lp: t => 900 + 500 * Math.sin(t * 2 * Math.PI / rate), e: (t, D) => (.5 + .5 * Math.sin(t * Math.PI * 2 / rate)) * clamp(t / .3) * clamp((D - t) / .3), amp: 1 });
const hoof = (amp = 1) => mixb(drum(90, .6 * amp, .2), noise(.06, { hp: 300, lp: 2400, e: env.pluck(50), amp: .3 * amp }));
const cowbell = (amp = 1) => bell(note(70), 1.4, { partials: [[1, 1], [1.5, .6], [2.4, .4], [3.6, .2]], k: 3, amp });
const murmur = (dur, amp = 1) => { const b = noise(dur, { hp: 250, lp: 1300, e: env.swell(.6, .8), amp }); for (let i = 0; i < b.length; i++) { const t = i / 48000; b[i] *= .5 + .5 * Math.abs(Math.sin(t * 7.3) * Math.sin(t * 3.1 + 1)); } return b; };

// ---------- the hook (0–5.75) ----------
T.at(0, boom(28, 1, 3), .7);
T.at(0, drone(TL.boon, 55, 1), .1);
T.at(0, wind(TL.boon, 1, 1), .1, -.4); T.at(0, wind(TL.boon, 4, 1), .08, .4);
for (let i = 0; i < 8; i++) T.at(.67 * (i + 1), tick(1), .05, i % 2 ? .25 : -.25);
T.at(4.9, whoosh(.85, 200, 3200, 1), .4);
T.at(TL.boon, mixb(boom(36, .8, 1.6), bell(note(62), 3.4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .9 })), .45);

// ---------- the boon: the forest shrine (5.75–8.3) ----------
for (let i = 0; i < 4; i++) T.at(TL.boon + .3 + i * .6, cricket(.45, 4400 + i * 120), .025, rnd() - .5);
T.at(TL.boon + .9, shimmer(2.2, [0, 2, 4, 7, 9, 12].map(i => note(79 + i)), 1, .14), .12);
T.at(TL.boon + 1.1, om(2.6, 98, 1), .1);

// ---------- the lamps (8.3–16.0) ----------
T.at(TL.ask + .1, flame(.6, .6), .25, -.4);
T.at(TL.ask + .4, fire(TL.chose + .3 - TL.ask, .2, .3), .08, -.4);
T.at(TL.wise + .1, flame(1, .9), .4, .35);
T.at(TL.wise + .3, fire(TL.mark - TL.wise, .5, 1), .16, .35);
T.at(TL.chose + .2, noise(.5, { hp: 400, lp: 2600, e: env.swell(.01, .4), amp: 1 }), .22, -.4);   // the dim one snuffed
T.at(TL.chose + .1, flame(1.4, 1.2), .5, .35);
T.at(TL.chose + .1, bell(note(67), 3, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .9 }), .2);

// ---------- Markandeya at prayer (16.0–21.25) ----------
T.at(TL.mark, om(TL.duta - TL.mark, 110, 1), .16);
T.at(TL.mark, fire(TL.duta - TL.mark, .2, .3), .07);
for (let i = 0; i < 3; i++) T.at(TL.mark + .4 + i * 1.6, chime(note(84 + pent[i * 2]), .6, 2), .05, i % 2 ? .3 : -.3);
T.at(20.0, whoosh(1.3, 300, 1400, 1), .3); T.at(20.0, wind(1.4, 9, .4), .2);

// ---------- the messengers (21.25–26.75) ----------
for (const d of [.2, 1.0, 1.75, 2.45]) T.at(TL.duta + d, heart(1), .36);
T.at(TL.duta + .3, roar(2.4, 70, 4, .7), .12, -.5); T.at(TL.duta + 1.0, roar(2, 80, 4, .7), .12, .5);
T.at(TL.flare, mixb(boom(34, 1, 2), shimmer(1.6, [0, 4, 7, 12, 16].map(i => note(76 + i)), 1, .05)), .55);
T.at(TL.flare + .15, roar(1.4, 140, 6, 1), .2);
T.at(TL.flare + .2, whoosh(1.2, 2400, 300, 1), .25);

// ---------- Death rides in (26.75–29.6) ----------
T.at(TL.yama, mixb(thunder(3, 1), boom(26, 1, 3)), .7);
T.at(TL.yama + 1.6, thunder(2.4, .7), .35, .4);
for (let i = 0; i < 5; i++) { T.at(TL.yama + .3 + i * .55, hoof(1), .3, -.2); T.at(TL.yama + .55 + i * .55, hoof(.8), .24, -.1); }
for (let i = 0; i < 3; i++) T.at(TL.yama + .4 + i * 1.1, cowbell(1), .12, -.1);
T.at(TL.yama + 1.2, roar(1.0, 60, 3, 1), .16);   // the buffalo's snort
T.at(TL.yama, wind(TL.hug - TL.yama + .3, 11, .5), .18);

// ---------- the hug (29.6–32.5) ----------
for (let i = 0; i < 7; i++) T.at(TL.hug + .1 + i * .42, heart(1), .3 + i * .02);
T.at(TL.hug, breath(2.9, .7), .14);

// ---------- the noose (32.5–34.0) ----------
T.at(TL.throw, whir(1.2, 1), .14);
T.at(TL.throw + .3, whoosh(1.2, 300, 2600, 1), .4, .3);
T.at(TL.loop - .2, whoosh(.4, 2400, 600, 1), .3);
T.at(TL.loop + .5, mixb(thud(1), crunch(.8), drum(50, .7, .6)), .5);

// ---------- the hush, the crack, the drop (34.6–37.1) ----------
T.at(TL.loop + .6, tone(2.8, note(93), { e: env.swell(.6, .3), amp: 1 }), .03);
T.at(TL.crack, crackle(1.2, 1), .14);
T.at(TL.crack, rumble(1.2), .3);
T.at(TL.drop - 1.0, whoosh(1.0, 150, 5000, 1), .5);
T.at(TL.drop, mixb(boom(24, 1, 3.4), thunder(3.4, 1), rockfall(2.4, 1)), .95);
T.at(TL.drop + .05, shimmer(2.4, [0, 4, 7, 12, 16, 19, 24].map(i => note(72 + i)), 1, .07), .2);
T.at(TL.drop + .2, roar(2.4, 90, 8, 1), .16);

// ---------- Shiva's fury (39.9–42.75) ----------
for (let i = 0; i < 22; i++) T.at(TL.fury + .2 + i * .11, damru(240 + (i % 2) * 30, .7 + i * .015), .2, i % 2 ? .3 : -.3);
T.at(TL.fury, fire(2.8, .6, 1), .14);

// ---------- the kick (42.75–45.4) ----------
T.at(TL.kick - .3, whoosh(.32, 600, 4200, 1), .6);
T.at(TL.kick, mixb(boom(22, 1, 3.6), thunder(3, 1), crunch(1), drum(40, 1, 1.2)), 1.0);
T.at(TL.kick + .1, roar(1.2, 110, 6, 1), .22, .4);
T.at(TL.kick + .2, whoosh(1.4, 2400, 200, 1), .3, .5);
T.at(TL.kick + .9, clang(note(76), .8), .2, .5); T.at(TL.kick + 1.3, clang(note(81), .6), .14, .6);
T.at(TL.kick + 1.5, mixb(thud(1), clang(note(64), .9)), .3, .7);

// ---------- Death lies dead (45.4–48.0) ----------
T.at(TL.dead, wind(2.8, 15, 1), .14);
T.at(TL.dead + .3, bell(note(57), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .7 }), .26);
T.at(TL.dead + .2, om(2.6, 82, 1), .12);

// ---------- the Earth groans (48.0–50.6) ----------
T.at(TL.earth, rumble(2.8), .45);
T.at(TL.earth, murmur(2.8, 1), .18);
T.at(TL.earth + .6, crackle(1.8, 1), .12);
T.at(TL.earth + 1.2, rockfall(1.4, .6), .3);

// ---------- the gods beg (50.6–53.2) ----------
T.at(TL.gods + .1, whir(2.4, .8), .06, -.4);
T.at(TL.gods + .3, conch(2.4, 311, 1), .14);
T.at(TL.gods, om(2.8, 98, 1), .1);

// ---------- Yama wakes (53.2–55.8) ----------
T.at(TL.revive + .6, shimmer(2, [0, 2, 4, 7, 9, 12].map(i => note(84 + i)), 1, .1), .14);
T.at(TL.revive + 1.0, heart(1), .3); T.at(TL.revive + 1.9, heart(.8), .22);

// ---------- dawn: sixteen forever (55.8–58.6) ----------
for (let i = 0; i < 8; i++) T.at(TL.forever + .3 + rnd() * 2.4, chirp(1), .05, rnd() * 1.4 - .7);
T.at(TL.forever, chime(note(88), 1, 3), .1);

// ---------- the ask (58.6–61.6) ----------
T.at(TL.ask2 + .1, conch(2.6, 311, 1), .18);
T.at(TL.ask2, om(3, 98, 1), .14);

// ---------- the card (61.6–66.5) ----------
T.at(TL.card, chime(note(84), 1, 3), .2, -.2); T.at(TL.card + .25, chime(note(88), 1, 3), .18, .2); T.at(TL.card + 1.3, chime(note(91), 1, 3), .16);
T.at(TL.card + .2, om(TL.end - TL.card - .2, 98, 1), .1);

T.write('assets/markandeya_sfx.wav');

// ---------- the score under it, on a level curve: full, lowered to half under the aftermath (Death dead, the Earth
// groaning) so the bell and the rumble read, back up for the gods; it fades out on its own by 64 s ----------
const SCORE = 'assets/markandeya_score.mp3';   // Lyria take 2 of 3 (its sections: 5.75, 16.0, 21.25, 26.75; its hush 34.0–36.6; the drop 37.1; a hit 42.75)
if (existsSync(SCORE)) {
  const d0 = TL.dead + .3, d1 = TL.gods;
  const lv = `if(lt(t,${d0}),1,if(lt(t,${d0 + .6}),1-(t-${d0})/0.6*0.5,if(lt(t,${d1}),0.5,if(lt(t,${d1 + .6}),0.5+(t-${d1})/0.6*0.5,1))))`;
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', SCORE, '-i', 'assets/markandeya_sfx.wav', '-filter_complex', [
    `[0:a]aresample=48000,atrim=0:${TL.end},asetpts=PTS-STARTPTS,volume='${lv}':eval=frame,volume=0.5[m]`,
    '[1:a]volume=1.4[s]', '[m][s]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=14,aresample=48000[o]'].join(';'),
    '-map', '[o]', '-t', String(TL.end), '-ar', '48000', '-ac', '2', 'assets/markandeya_mix.wav'], { stdio: 'inherit' });
  console.log('wrote assets/markandeya_mix.wav');
}
