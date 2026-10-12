// ravana_kailash_sfx.mjs: the sound effects for ad 15 (src/scenes/ravana_kailash.js), under the Lyria score. Times
// match TL in the scene. Then it mixes the score (assets/ravana_kailash_score.mp3, cut to fit) under the effects.
//   The hook: storm, thunder, the mountain groaning, Ravana straining. The Pushpak: wind, a jolt and a clang when it
//   stops. Nandi: a low bell, the laugh (ten voices), the curse (a drum and the glare). The lift: stone tearing, a
//   rockfall, thunder. The toe: silence, then one deep boom. The slam: an impact and rubble. The roar: ten voices and
//   shock thuds. The song: a damru and an Om. Dawn: a chime for the sword. Lanka: fire and a whoosh. The card: a chime.
//   node tools/ravana_kailash_sfx.mjs   → assets/ravana_kailash_sfx.wav and assets/ravana_kailash_mix.wav
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { track, tone, noise, bell, mixb, whoosh, crackle, env, note, seed, rnd, lerp, thunder, damru, wind, drum, fire, om, conch, laughter, chime, chirp, clang, roar, rockfall } from './sfx.mjs';

const TL = { hook: 0, pushpak: 5.0, stop: 8.6, nandi: 9.8, laugh: 14.2, curse: 17.2, glare: 18.1, lift: 20.0, grip: 21.6, rise: 22.4,
  risen: 24.6, top: 25.0, toe: 29.4, press: 31.6, slam: 33.4, hit: 33.65, roar: 37.4, name: 40.3, song: 43.0, reveal: 45.9,
  dawn: 50.4, lanka: 54.2, ask: 57.6, card: 61.2, end: 65.4 };
const T = track(TL.end);
seed(15);
const roll = (t0, dur, rate, f, amp) => { for (let i = 0; i < dur * rate; i++) T.at(t0 + i / rate + (rnd() - .5) * .008, damru(f * (i % 2 ? 1.12 : 1), amp * (.7 + .3 * Math.sin(i * .9))), 1, (i % 2 ? .25 : -.25)); };
const groan = (dur, amp) => noise(dur, { brown: true, lp: t => 90 + 60 * Math.sin(t * 1.3), e: env.swell(.6, .6), amp });

// ---------- the hook (0–5.0): the storm, the mountain held up ----------
T.at(0, mixb(drum(38, 1, 1.6), noise(.6, { brown: true, lp: 200, e: env.pluck(4), amp: 1.2 })), .7);   // frame 0 lands hard
T.at(0, groan(TL.pushpak + .4, 1.3), .4);
T.at(0, roar(2.2, 95, 10, .6), .16);                     // ten heads straining
T.at(1.15, thunder(2.6, .7), .55, -.5); T.at(3.55, thunder(2.4, .9), .55, .5);
T.at(2.55, drum(44, 1, 1.2), .5);                        // "Shiva's answer?"
T.at(4.3, bell(note(57), 3, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .9 }), .35);   // "ONE TOE"
T.at(.3, rockfall(3, .5), .3, -.3);

// ---------- the Pushpak (5.0–9.8) ----------
T.at(TL.pushpak - .2, wind(TL.nandi - TL.pushpak + .6, 0, .6), .25, -.5); T.at(TL.pushpak - .2, wind(TL.nandi - TL.pushpak + .6, 2, .6), .25, .5);
T.at(TL.pushpak, whoosh(3.6, 300, 1200, 1), .18, -.3);
for (let i = 0; i < 6; i++) T.at(TL.pushpak + .3 + i * .6, chime(note(84 + [0, 2, 4, 7, 9, 7][i]), .5, 1), .05, .3);   // its little bells
T.at(TL.stop, mixb(clang(420, 1), drum(50, 1, .8), noise(.3, { hp: 800, lp: 5000, e: env.pluck(12), amp: .6 })), .55, .2);
T.at(TL.stop + .02, tone(1.6, t => 900 + 300 * Math.sin(t * 9), { e: env.ad(.01, 1.2), amp: 1 }), .05, .4);   // the invisible wall rings

// ---------- Nandi (9.8–20.0) ----------
T.at(TL.nandi, om(TL.lift - TL.nandi, 73, 1), .22);
T.at(TL.nandi + .3, bell(note(45), 3.5, { partials: [[1, 1], [2.1, .5], [3.3, .25]], k: .8 }), .3);   // his bell
T.at(TL.laugh, roar(.4, 150, 10, .3), .12);
T.at(TL.laugh + .1, laughter(3, 1), .32, -.3); T.at(TL.laugh + .2, laughter(2.9, 1), .3, .3);
for (let i = 0; i < 5; i++) T.at(TL.laugh + .15 + i * .62, tone(.25, t => 130 - t * 80, { type: 'tri', e: env.pluck(10), amp: 1 }), .14, (i % 2 ? .3 : -.3));   // low "HA"s
T.at(TL.curse, drum(46, 1, 1.4), .55);
T.at(TL.glare - .1, whoosh(.6, 200, 2500, 1), .3);
T.at(TL.glare + .1, mixb(drum(40, 1, 2), thunder(2.6, .6)), .6);
T.at(TL.glare + .1, tone(2.6, note(38), { type: 'saw', e: env.swell(.05, 1.5), amp: .6 }), .08);

// ---------- the lift (20.0–25.0) ----------
T.at(TL.lift, groan(TL.top - TL.lift + 1, 1.5), .45);
T.at(TL.lift + .3, wind(TL.top - TL.lift, 4, .6), .2, -.5); T.at(TL.lift + .3, wind(TL.top - TL.lift, 6, .6), .2, .5);
T.at(TL.grip - .2, mixb(drum(44, 1, 1), rockfall(1, .7)), .45);
T.at(TL.rise - .4, roar(TL.risen - TL.rise + .6, 100, 10, 1), .28);   // the heave
T.at(TL.rise, noise(TL.risen - TL.rise, { brown: true, lp: t => 120 + 500 * t / 2.2, e: env.swell(1.2, .05), amp: 1.6 }), .45);
T.at(TL.rise + .3, rockfall(2.2, 1), .4, -.4); T.at(TL.rise + .9, rockfall(2, 1), .35, .4);
T.at(21.1, thunder(2.4, .7), .45, -.5); T.at(23.6, thunder(2.6, 1), .55, .5);
T.at(TL.risen, mixb(drum(36, 1, 2.2), thunder(3, 1)), .8);

// ---------- the summit (25.0–29.4) ----------
T.at(TL.top, groan(TL.toe - TL.top, 1.2), .35);
T.at(TL.top, wind(TL.toe - TL.top + .2, 8, .5), .3, -.5); T.at(TL.top, wind(TL.toe - TL.top + .2, 9, .5), .3, .5);
T.at(26.3, thunder(2.4, .9), .55, -.4); T.at(28.6, thunder(2.4, 1), .55, .4);
T.at(TL.top + .4, noise(3.5, { hp: 2500, lp: 8000, e: env.swell(.5, 1), amp: 1 }), .06);   // snow hissing off the slopes
T.at(27.45, om(2.2, 110, 1), .2);                          // Shiva, calm

// ---------- the toe (29.4–33.4): almost silence, a held breath, then one boom ----------
T.at(TL.toe, tone(TL.press - TL.toe, t => note(45) + .3 * Math.sin(t * 2), { e: env.swell(.4, .1), amp: 1 }), .12);
T.at(TL.toe + .2, noise(TL.press - TL.toe, { hp: 3000, lp: 9000, e: env.swell(1.2, .05), amp: 1 }), .04);
T.at(TL.press - .9, tone(.9, t => 60 + 40 * t, { e: env.swell(.8, .02), amp: 1 }), .25);   // the press, rising
T.at(TL.press, mixb(drum(32, 1, 3), tone(2.4, t => 48 * Math.exp(-t * .6) + 22, { e: env.ad(.005, 1.6), amp: 1 }), noise(1.2, { brown: true, lp: 180, e: env.pluck(2.5), amp: 1.4 })), 1);
T.at(TL.press, bell(note(81), 3, { partials: [[1, 1], [2.76, .4], [5.4, .2]], k: 1.2 }), .25);
T.at(TL.press + .35, drum(38, 1, 1.5), .45);

// ---------- the slam (33.4–37.4) ----------
T.at(TL.slam, whoosh(.3, 2000, 200, 1), .5);
T.at(TL.hit, mixb(drum(30, 1, 3), thunder(3.2, 1), noise(2, { brown: true, lp: 220, e: env.pluck(1.6), amp: 1.6 })), 1);
T.at(TL.hit + .05, rockfall(3, 1), .55, -.3); T.at(TL.hit + .2, rockfall(2.6, 1), .5, .3);
T.at(TL.hit + .1, roar(.8, 170, 10, 1), .3);
T.at(35.2, thunder(2, .7), .45);
T.at(TL.hit + 1, tone(2.2, 2093, { e: env.ad(.02, 1), amp: 1 }), .04);   // ears ringing

// ---------- the roar that named him (37.4–43.0) ----------
T.at(TL.roar, roar(2.8, 130, 10, 1), .6);
T.at(TL.roar + 2.6, roar(2.4, 115, 10, 1), .45);
for (const t0 of [37.6, 38.3, 39.0, 39.7, 40.4, 41.1]) T.at(t0, mixb(drum(40, 1, .9), noise(.4, { brown: true, lp: 160, e: env.pluck(6), amp: 1 })), .45);   // the shock rings
for (let i = 0; i < 8; i++) T.at(TL.roar + rnd() * 5, whoosh(.8, 2400, 500, .7), .1, rnd() * 1.6 - .8);   // stars falling
T.at(TL.name, mixb(drum(42, 1, 1.6), bell(note(50), 3, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: 1 })), .55);   // RAVANA

// ---------- the song (43.0–50.4) ----------
T.at(TL.song, om(TL.dawn - TL.song + .6, 73, 1), .3); T.at(TL.song + .5, om(TL.dawn - TL.song, 110, 1), .12, .2);
T.at(TL.song, wind(TL.dawn - TL.song, 3, 1), .15, -.4);
roll(TL.reveal - .1, 1.4, 15, 230, .3);                   // "the SHIV TANDAV STOTRAM"
for (let i = 0; i < 4; i++) T.at(TL.song + .4 + i * 1.6, chime(note(74 + [0, 3, 7, 10][i]), .8, 2.5), .12, (i % 2 ? .3 : -.3));   // each line of verse
T.at(48.5, chime(note(86), 1, 3), .14);

// ---------- dawn: forgiven, Chandrahas (50.4–54.2) ----------
for (let i = 0; i < 7; i++) T.at(TL.dawn + .4 + i * .45 + rnd() * .2, chirp(1), .05 + rnd() * .03, rnd() * 1.4 - .7);
T.at(TL.dawn + .3, whoosh(2.3, 3000, 600, 1), .12);
T.at(TL.dawn + 2.6, bell(note(76), 3.5, { partials: [[1, 1], [2.76, .5], [5.4, .25], [8.9, .1]], k: 1 }), .35);   // the sword lands
T.at(TL.dawn + 2.6, chime(note(88), 1, 2.5), .15);

// ---------- Lanka burns (54.2–57.6) ----------
T.at(TL.lanka, fire(TL.ask - TL.lanka + .4, .4, 1), .4);
T.at(TL.lanka + .2, whoosh(3, 200, 2600, 1), .3, -.6); T.at(TL.lanka + 1.6, whoosh(1.6, 2600, 400, 1), .25, .6);
T.at(TL.lanka + .5, conch(2.6, 294, 1), .25);             // Hanuman
T.at(TL.lanka + .4, crackle(3, 1), .12);

// ---------- the ask and the card (57.6–65.4) ----------
T.at(TL.ask, om(TL.end - TL.ask, 98, 1), .2);
T.at(TL.ask + .2, bell(note(62), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .7 }), .3);
T.at(TL.card + .3, chime(note(84), 1, 3), .2, -.2); T.at(TL.card + .55, chime(note(88), 1, 3), .18, .2); T.at(TL.card + 1.7, chime(note(91), 1, 3), .16);

T.write('assets/ravana_kailash_sfx.wav');

// ---------- the score under it: 0–57 s of the Lyria take, then its fade-out (81.5 s on) for the ask and the card ----------
const SCORE = 'assets/ravana_kailash_score.mp3';
if (existsSync(SCORE)) {
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', SCORE, '-i', 'assets/ravana_kailash_sfx.wav', '-filter_complex', [
    '[0:a]aresample=48000,asplit[s1][s2]',
    '[s1]atrim=0:57.6,asetpts=PTS-STARTPTS[a]',
    '[s2]atrim=81.0:92,asetpts=PTS-STARTPTS[b]',
    '[a][b]acrossfade=d=1.4:c1=tri:c2=tri,volume=0.38,afade=t=out:st=63.6:d=1.8[m]',
    '[m][1:a]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=14,aresample=48000[o]'].join(';'),
    '-map', '[o]', '-t', String(TL.end), '-ar', '48000', '-ac', '2', 'assets/ravana_kailash_mix.wav'], { stdio: 'inherit' });
  console.log('wrote assets/ravana_kailash_mix.wav');
}
