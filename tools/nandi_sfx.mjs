// nandi_sfx.mjs: the sound effects for the Nandi reel (src/scenes/nandi.js), under the Lyria score. Times match TL in
// the scene. Then it mixes the score (assets/nandi_score.mp3, its first 65.6 s) under the effects. The score carries
// this reel, so the effects stay sparse: temple bells and lamps, the plough's thud and the light rising, the heartbeat
// and the doom hit on "EIGHT", the river at night, Shiva's om and the white-out, the bull's bell, the whisper and the
// chimes of the wish travelling, Lanka's fire, the gate's light, a chime on the card.
// v2 (the owner's note: the score sounded cheerful under "He will die at EIGHT"): the score fades out from 16 s, the
// doom is carried by the heartbeat, a low drone and the hit in near-silence, and the score comes back at 21 s on
// "Little NANDI didn't cry" (dread → silence → hope).
//   node tools/nandi_sfx.mjs   → assets/nandi_sfx_v2.wav and assets/nandi_mix_v2.wav
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { track, tone, noise, bell, mixb, whoosh, crackle, env, note, seed, rnd, thunder, damru, wind, drum, fire, om, conch, chime, heart, drone } from './sfx.mjs';

const TL = { hook: 0, eye: 2.6, shilada: 5.0, field: 8.0, glow: 9.6, child: 10.4, boy: 13.0, sages: 15.6, doom: 18.4,
  river: 20.9, shiva: 26.0, appear: 26.6, bless: 28.8, bull: 30.0, kailash: 34.0, whisper: 39.4, thread: 42.2, faces: 44.8,
  ravana: 49.6, twist: 52.6, move: 54.6, ask: 58.4, card: 61.6, end: 65.6 };
const T = track(TL.end);
seed(16);
const templeBell = (m, dur = 4, k = .8) => bell(note(m), dur, { partials: [[1, 1], [2.4, .5], [3.9, .3], [6.1, .12]], k });
const water = (dur, amp = 1) => noise(dur, { hp: 300, lp: t => 1400 + 500 * Math.sin(t * 1.7) + 300 * Math.sin(t * 4.3), e: env.swell(1, 1), amp });
const breath = (dur, amp = 1) => noise(dur, { hp: 1800, lp: 6000, e: env.hann(), amp });   // a whisper

// ---------- the hook (0–5.0): the temple at night, a bell, the whisper ----------
T.at(0, templeBell(50, 5, .7), .45);
T.at(0, fire(TL.shilada + .4, .15, .2), .08);                       // the lamps
for (let i = 0; i < 5; i++) T.at(.5 + i * .45 + rnd() * .1, breath(.35 + rnd() * .2, 1), .05, .3);   // her whisper
T.at(1.3, tone(.25, t => 600 + 300 * t, { e: env.hann(), amp: 1 }), .03, .2);   // the ear flicks
T.at(TL.eye, drum(44, 1, 1.2), .3);

// ---------- Shilada's prayer (5.0–8.0) ----------
T.at(TL.shilada, fire(3.4, .2, .3), .15, -.3);
T.at(TL.shilada, om(3.4, 98, 1), .14);

// ---------- the field (8.0–13.0) ----------
for (let i = 0; i < 3; i++) T.at(TL.field + .4 + i * .55, mixb(drum(60, .6, .3), noise(.2, { brown: true, lp: 300, e: env.pluck(14), amp: .8 })), .14);   // the plough
T.at(TL.glow - .1, mixb(drum(48, 1, 1), noise(.4, { brown: true, lp: 250, e: env.pluck(8), amp: 1 })), .4);   // it strikes
T.at(TL.glow, noise(2.2, { hp: 2500, lp: 9000, e: env.swell(.8, 1), amp: 1 }), .06);
for (let i = 0; i < 6; i++) T.at(TL.glow + .3 + i * .22, chime(note(81 + [0, 2, 4, 7, 9, 12][i]), 1, 2), .07, (i % 2 ? .3 : -.3));   // the light rising
T.at(TL.child + .4, templeBell(69, 3, 1.4), .12);

// ---------- the boy, the sages, the doom (13.0–20.9) ----------
for (let i = 0; i < 4; i++) T.at(TL.boy + .3 + i * .7, tone(.05, 3000 + rnd() * 1500, { e: env.hann(), amp: 1 }), .02, rnd() - .5);   // birds
T.at(TL.sages, wind(TL.river - TL.sages, 1, 1), .12, -.4);
for (let t0 = TL.sages + .8, i = 0; t0 < TL.doom; t0 += .95 - i * .04, i++) T.at(t0, heart(1), .26 + i * .04);   // the heartbeat, quickening
T.at(TL.sages + .4, drone(TL.river - TL.sages + .4, note(38), 1), .16);                               // a low dark drone under it (D2)
T.at(TL.sages + 1.2, tone(TL.river - TL.sages - .4, t => note(39) + .4 * Math.sin(t * 1.3), { e: env.swell(1.6, 1.2), amp: 1 }), .05);   // a minor second rubbing against it
for (let i = 0; i < 3; i++) T.at(TL.doom + 1.1 + i * 1.05, heart(.7), .2 - i * .05);                   // after the words, the heart, slowing
T.at(TL.doom, mixb(drum(34, 1, 2.6), thunder(2.6, .5)), .7);   // "He will die at EIGHT"
T.at(TL.doom, tone(2.4, note(38), { type: 'saw', e: env.swell(.02, 1.6), amp: .6 }), .06);

// ---------- the river at night (20.9–26.0) ----------
T.at(TL.river, water(TL.shiva - TL.river + .6, 1), .1, -.2);
T.at(TL.river, wind(TL.shiva - TL.river, 3, 1), .07, .4);
for (let i = 0; i < 6; i++) T.at(TL.river + .5 + i * .8 + rnd() * .3, tone(.12, 4200 + rnd() * 800, { e: env.hann(), amp: 1 }), .015, rnd() - .5);   // crickets

// ---------- Shiva appears (26.0–30.0) ----------
T.at(TL.appear - .3, whoosh(1, 300, 4000, 1), .25);
T.at(TL.appear, om(TL.bull - TL.appear + .6, 73, 1), .3);
T.at(TL.appear + .05, mixb(drum(38, 1, 1.8), noise(1.2, { hp: 3000, lp: 10000, e: env.pluck(2), amp: 1 })), .4);
T.at(TL.appear + .1, conch(2.4, 294, 1), .18);
for (let i = 0; i < 14; i++) T.at(TL.bless - .2 + i * .085, damru(250, .8), .14, (i % 2 ? .25 : -.25));   // the blessing
T.at(TL.bull - .5, noise(.5, { hp: 2000, lp: 12000, e: env.swell(.45, .02), amp: 1 }), .25);   // into the white-out

// ---------- the bull (30.0–34.0) ----------
T.at(TL.bull, mixb(drum(30, 1, 3), thunder(3, .8)), .7);
T.at(TL.bull + .4, templeBell(45, 4, .7), .35);   // his bell
T.at(TL.bull + .6, tone(1.4, t => 110 - 30 * t, { type: 'saw', e: env.swell(.15, .8), amp: .5 }), .05);   // a low bellow

// ---------- Kailash (34.0–39.4) ----------
T.at(TL.kailash, wind(TL.whisper - TL.kailash + .5, 5, 1), .14, -.5); T.at(TL.kailash, wind(TL.whisper - TL.kailash + .5, 7, 1), .14, .5);
T.at(TL.kailash + .3, om(TL.whisper - TL.kailash, 110, 1), .12);
T.at(36.8, templeBell(45, 3, .9), .2);

// ---------- the whisper (39.4–44.8) ----------
T.at(TL.whisper, fire(TL.faces - TL.whisper + 5, .15, .2), .07);
for (let i = 0; i < 6; i++) T.at(TL.whisper + .8 + i * .4 + rnd() * .1, breath(.3 + rnd() * .2, 1), .05, .3);
for (let i = 0; i < 8; i++) T.at(TL.thread + i * .18, chime(note(84 + [0, 2, 4, 7, 9, 12, 14, 16][i]), 1, 2), .06, lerpPan(i / 7));   // the wish travels
T.at(TL.thread + 1.5, templeBell(57, 4, .7), .3);   // and reaches Shiva
function lerpPan(k) { return .5 - k; }

// ---------- every Nandi faces Shiva (44.8–49.6) ----------
T.at(TL.faces + .3, templeBell(50, 4, .7), .2);

// ---------- Lanka (49.6–52.6) ----------
T.at(TL.ravana, fire(TL.twist - TL.ravana + .3, .5, 1), .3);
T.at(TL.ravana + .5, whoosh(2.2, 200, 2600, 1), .25, -.6);
T.at(TL.ravana + .9, mixb(drum(40, 1, 1.4), thunder(1.6, .5)), .45);   // his eyes flare
T.at(TL.ravana + .2, crackle(2.6, 1), .1);

// ---------- Thirupunkur (52.6–58.4) ----------
T.at(TL.twist, wind(TL.ask - TL.twist, 2, 1), .08);
T.at(TL.move, mixb(noise(1.4, { brown: true, lp: 160, e: env.swell(.4, .6), amp: 1.2 }), tone(1.4, t => 50 + 6 * Math.sin(t * 5), { e: env.swell(.4, .6), amp: .8 })), .3);   // the stone bull shifting
T.at(TL.move + .8, noise(2.2, { hp: 2500, lp: 10000, e: env.swell(.8, 1.2), amp: 1 }), .07);   // the light pours out
T.at(TL.move + 1, templeBell(62, 4, .8), .25);
for (let i = 0; i < 5; i++) T.at(TL.move + 1.2 + i * .25, chime(note(86 + [0, 3, 5, 7, 10][i]), 1, 2.5), .05, (i % 2 ? .3 : -.3));

// ---------- the ask and the card (58.4–65.6) ----------
T.at(TL.ask, fire(TL.card - TL.ask + .5, .15, .2), .06);
T.at(TL.ask + .1, templeBell(50, 4, .7), .25);
T.at(TL.card + .3, chime(note(84), 1, 3), .14, -.2); T.at(TL.card + .6, chime(note(88), 1, 3), .12, .2); T.at(TL.card + 1.4, chime(note(91), 1, 3), .1);

T.write('assets/nandi_sfx_v2.wav');

// ---------- the score under it: the Lyria take's first 65.6 s (it then goes silent, then plays a separate tail) ----------
const SCORE = 'assets/nandi_score.mp3';
if (existsSync(SCORE)) {
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', SCORE, '-i', 'assets/nandi_sfx.wav', '-filter_complex', [
    // the score: down from 16 s to near-silence by the doom (18.4), back from 21 s ("Little NANDI didn't cry") by 22.6
    `[0:a]aresample=48000,atrim=0:${TL.end},asetpts=PTS-STARTPTS,volume='0.5*if(lt(t,16),1,if(lt(t,18.4),1-0.95*(t-16)/2.4,if(lt(t,21),0.05,if(lt(t,22.6),0.05+0.95*(t-21)/1.6,1))))':eval=frame,afade=t=out:st=${TL.end - 1.2}:d=1.2[m]`,
    '[m][1:a]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=14,aresample=48000[o]'].join(';'),
    '-map', '[o]', '-t', String(TL.end), '-ar', '48000', '-ac', '2', 'assets/nandi_mix_v2.wav'], { stdio: 'inherit' });
  console.log('wrote assets/nandi_mix_v2.wav');
}
