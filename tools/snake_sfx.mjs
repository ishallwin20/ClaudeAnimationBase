// snake_sfx.mjs: the sound-effects cue list for "Why would a god wear a deadly snake around his neck?"
// (src/scenes/snake.js), built with tools/sfx.mjs. The times are the scene's constants. The hook is dense and tense
// (sub drone, rising hiss, damaru roll, heartbeats, tongue tsks, hood fwump, then the strike), then a hard silence,
// then the calm temple bell and Om at the reveal. After the hook it stays sparse: Instagram's music goes on top. The
// silent beat before the eruption (STILL) holds one bubble and nothing else.
//   node tools/snake_sfx.mjs [--out=assets/snake_sfx.wav]
import { track, SR, env, tone, noise, bell, mixb, note, lerp, whoosh, rumble, gurgle, plink, squeak, click, thud, crackle, shimmer, drone, slide } from './sfx.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const TAU = Math.PI * 2;
const { at, write, L, R } = track(48.8);

// the scene's times (the same block as src/scenes/snake.js)
const A2 = 1.78, B0 = 3.6, C0 = 9.2, D0 = 18.2, E0 = 26.2, F0 = 29.8, G0 = 37.4, H0 = 42.0, CARD0 = 43.3; // DUR 48.8
// A hook
const TONGUE = [.35, .95], FLARE = 1.15, STRIKE = 1.5, GULLET = 1.72, NECK_CAP = 1.95, HAND = [2.1, 2.45], MELT = 2.5;
// B wired to fear
const PULL = [3.6, 4.6], WIRED_CAP = 3.85, MOUSE_IN = [4.15, 4.8], VAS_PEEK = 4.85, SPOT = 4.95, TAKE = 5.15, FLEE = [5.55, 6.0];
const SLEEP_CAP = 6.05, YAWN = 6.5, PUSH_B = [6.0, 8.2], POISON_CAP = 7.9, WHIP = [8.85, 9.2];
// C the churning
const CHURN_CAP = 9.45, ROPE_CAP = 11.75, PUSH_C = [11.8, 13.0], WINCE = 12.45, STILL = 14.1, ERUPT = 14.5, HALA_CAP = 14.75;
const SKY_POISON = [14.5, 15.6], RUN = 16.9, RAN_CAP = 16.9, EXCEPT_CAP = 17.5, INTO_CLOUD = [17.8, 18.2];
// D Neelkanth
const CLEAR = [18.2, 18.6], HANDS_UP = [18.3, 18.7], POUR = [18.55, 19.75], DRANK_CAP = 18.6, SIP = [19.75, 20.1], GULP = 20.15;
const PARVATI_IN = [20.3, 21.1], HELD_CAP = 20.65, TOUCH = 21.3, SINK = [21.5, 22.9], BLUE = [23.1, 23.7], SKY_CLEAR = [23.1, 24.3];
const STAYED_CAP = 23.15, NEEL_CAP = 24.55, NEEL_SUB = 24.85;
// E Vasuki's place
const PUSH_E = [26.2, 29.8], VAS_UP = [26.3, 26.7], VAS_CAP = 26.35, HONOUR_CAP = 28.0, STROKE = [27.95, 28.4], NUZZLE = 28.45;
// F the meaning
const MEANS_CAP = 29.85, FEAR = 30.2, DEATH = 31.05, TIME = 31.9, THESIS1 = 33.3, THESIS2 = 33.95, PEEK = 35.3, COMMENT = 35.4, COMMENT_SUB = 35.8, WIPE_OUT = 37.1;
// G Chandraghanta
const P_AFRAID_CAP = 37.6, FLICKER = [37.6, 39.3], SHIVA_HAND = 39.4, P_TAUGHT_CAP = 39.45, CALM = 39.7, CHANDRA_CAP = 40.5, BELL = 40.6, FLASH_G = [41.85, 42.0];
// H the rhyme
const RISE = [42.0, 42.2], FEINT = [42.2, 42.45], BLEP = 42.5, WINK = 42.65, RING = [42.85, 43.3];
const CARD = { book: 43.5, fan: 43.9, logo: 44.5, series: 44.85, sub: 45.25, pill: 45.65, follow: 46.25 };
const BEAT = 60 / 90;

// ---------- sounds of this film ----------
// small helper: drop buffer b into buffer o at time t (s), scaled by g
const blank = d => new Float32Array(Math.max(1, Math.round(d * SR)));
const stamp = (o, b, t, g = 1) => { const s = Math.round(t * SR); for (let i = 0; i < b.length && s + i < o.length; i++) o[s + i] += b[i] * g; };
const lowpass = (b, fc) => { const a = 1 - Math.exp(-TAU * fc / SR); let l = 0; for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };

// from ad 3: heartbeat thump, a double beat, a long creak, a roar, a big boom
const heart = (amp = 1) => mixb(tone(.22, t => 62 * Math.exp(-t * 4) + 38, { e: env.pluck(14), amp }), noise(.08, { lp: 220, e: env.pluck(30), amp: amp * .5 }));
const beat = (t0, g = .5, A = at) => { A(t0, heart(), g, 0); A(t0 + .22, heart(.7), g, 0); };
const creak = (dur) => tone(dur, t => 180 + 140 * t / dur, { type: 'saw', e: env.swell(.1, .1), fm: t => .02 * Math.sin(t * 90), amp: .25 });
const roar = (dur, amp = 1) => mixb(noise(dur, { lp: t => 900 + 500 * Math.sin(t * 7), hp: 60, brown: true, e: env.swell(.05, dur * .6), amp }), noise(dur, { lp: 3000, hp: 800, e: env.swell(.05, dur * .5), amp: amp * .25 }));
const boom = () => mixb(thud(1), tone(1.6, t => 55 * Math.exp(-t * .8) + 30, { e: env.ad(.005, .6), amp: .9 }));
const sboom = () => mixb(thud(1), tone(.5, t => 70 * Math.exp(-t * 3) + 32, { e: env.ad(.004, .18), amp: .9 }));   // the same hit, but short enough to end before the silence

// new for this film
// hiss: high-passed noise with a fast AM wobble (a snake). e shapes it (default: a soft swell)
const hiss = (dur, amp = 1, e = env.swell(dur * .3, dur * .4)) => { const n = noise(dur, { hp: 3500, lp: 11000, e, amp }); for (let i = 0; i < n.length; i++) n[i] *= .72 + .28 * Math.sin(i / SR * TAU * 14); return n; };
// tsk: a tongue flick, two clicks .04 s apart
const tsk = (amp = 1) => { const o = blank(.12); stamp(o, click(amp), 0); stamp(o, click(amp * .7), .04); return o; };
// fwump: a hood flaring open: a quick air sweep plus low puff
const fwump = (amp = 1) => mixb(whoosh(.35, 1200, 200, amp), noise(.3, { brown: true, lp: 300, e: env.ad(.01, .1), amp: amp * .8 }));
// damaru: a hand drum rattling, taps alternating 180 and 260 Hz, accelerating from r0 to r1 taps a second
const damaru = (dur, r0, r1, amp = 1) => {
  const o = blank(dur + .2); let t = 0, k = 0;
  while (t < dur) {
    const hi = k++ % 2;
    stamp(o, mixb(tone(.12, hi ? 260 : 180, { e: env.pluck(28), amp }), noise(.04, { lp: 2500, hp: 600, e: env.pluck(120), amp: amp * .35 })), t, .8 + .2 * hi);
    t += 1 / lerp(r0, r1, t / dur);
  }
  return o;
};
// stinger: a dissonant bell cluster (minor seconds) for the jump scare
const stinger = (amp = 1) => mixb(...[78, 79, 84, 85, 90].map((m, i) => bell(note(m), 1.1, { partials: [[1, 1], [2.76, .5], [5.4, .3]], k: 5 + i * .6, amp: amp * .5 })));
// scamper: a mouse's tiny running feet with the odd squeak
const scamper = (dur, amp = 1) => { const o = blank(dur + .1); for (let t = 0, i = 0; t < dur; t += 1 / 16, i++) { stamp(o, mixb(tone(.025, 1900 + (i % 3) * 300, { e: env.pluck(150) }), noise(.02, { hp: 2500, e: env.pluck(200), amp: .5 })), t + (i % 2) * .008, .6 * amp); if (i % 5 === 3) stamp(o, squeak(2200, 3000, .05, 1), t + .02, .3 * amp); } return o; };
// conch: a long shell horn, a saw at note 50 with vibrato, filtered
const conch = (dur, amp = 1) => lowpass(tone(dur, t => note(50) * (1 + .004 * Math.sin(t * TAU * 5)), { type: 'saw', e: env.swell(.15, .3), amp: amp * 2 }), 900);
// waves: slow surf, brown noise swelling and ebbing
const waves = (dur, amp = 1) => noise(dur, { brown: true, lp: 700, hp: 60, e: (t, D) => env.swell(.5, .5)(t, D) * (.55 + .45 * Math.sin(t * TAU * .22)), amp: amp * 1.4 });
// bubble: a bloop rising
const bubble = (amp = 1) => tone(.14, t => 320 + 700 * t / .14, { e: env.pluck(22), amp });
// choir: detuned saw drones, a dark vowel (notes in MIDI)
const choir = (dur, amp = 1, notes = [37, 38, 44], atk = .4, rel = .3) => {
  const o = blank(dur);
  for (const m of notes) for (const d of [-.007, 0, .007]) stamp(o, tone(dur, note(m) * (1 + d), { type: 'saw', e: env.swell(atk, rel), amp: .3 }), 0);
  return lowpass(lowpass(o, 650), 900).map(x => x * amp * 1.6);
};
// gulp: a swallow, a quick falling glug then a small second
const gulp = (amp = 1) => { const o = blank(.4); stamp(o, tone(.14, t => 230 * Math.exp(-t * 6) + 80, { e: env.pluck(20), amp }), 0); stamp(o, tone(.1, t => 160 * Math.exp(-t * 6) + 70, { e: env.pluck(28), amp: amp * .6 }), .17); stamp(o, noise(.05, { lp: 800, e: env.pluck(60), amp: amp * .5 }), 0); return o; };
// tick: a dry clock tick, for time
const tick = (amp = 1) => mixb(tone(.05, 1300, { e: env.pluck(90), amp }), noise(.02, { hp: 2000, e: env.pluck(200), amp: amp * .5 }));
// ghanta: a bright temple bell (brighter than anything else in the reel) plus a shimmer
const ghanta = (amp = 1) => mixb(bell(note(88), 2.6, { partials: [[1, 1], [2.4, .6], [3.1, .45], [5.2, .3], [7.9, .15]], k: 2.2, amp }), shimmer(1.2, [96, 100, 103].map(note), amp * .35, .05));
// a gong: two bells, notes 43 and 50
const gong = (amp = 1, dur = 3) => mixb(bell(note(43), dur, { k: 1.4, amp }), bell(note(50), dur, { k: 1.6, amp: amp * .8 }));

// ---------- A · the hook (dense, tense) ----------
// built on its own timeline so it can be cut dead at GULLET: nothing from before the strike rings into the silence
const H = track(48.8);
const hat = H.at;
hat(0, mixb(tone(1.8, note(33), { e: env.swell(.02, .1), amp: 1 }), tone(1.8, note(45), { type: 'tri', e: env.swell(.02, .1), amp: .3 })), .35, 0);   // sub drone
hat(0, hiss(.6, 1, env.swell(.25, .15)), .1, -.2); hat(.45, hiss(.6, 1, env.swell(.25, .15)), .17, 0); hat(.9, hiss(.6, 1, env.swell(.3, .1)), .26, .2);   // rising hiss, drifting across
hat(1.2, hiss(.3, 1, env.swell(.2, .02)), .32, .2);
hat(0, damaru(1.1, 7, 26, 1), .26, .3);   // damaru roll, quiet and accelerating
beat(.2, .5, hat); beat(.85, .55, hat);   // heartbeats
hat(TONGUE[0], tsk(1), .5, -.1); hat(TONGUE[1], tsk(1), .5, .1);   // tongue flicks
hat(FLARE, fwump(1), .45, 0); hat(FLARE + .02, hiss(.35, 1, env.swell(.2, .1)), .3, 0);   // hood flare
hat(STRIKE - .06, whoosh(.2, 400, 3800, 1), .5, 0);   // the lunge
hat(STRIKE, sboom(), .75, 0);   // bass hit
hat(STRIKE, noise(.2, { hp: 2500, lp: 11000, e: env.ad(.004, .06), amp: 1 }), .4, 0);   // hiss snap
hat(STRIKE + .01, stinger(1), .4, 0);   // dissonant bells
hat(STRIKE + .03, thud(.8), .3, 0);
// hard cut: fade the last 20 ms, then true silence until 1.85
{
  const s0 = Math.round((GULLET - .02) * SR), s1 = Math.round(GULLET * SR);
  for (const ch of [H.L, H.R]) { for (let i = s0; i < s1; i++) ch[i] *= 1 - (i - s0) / (s1 - s0); ch.fill(0, s1); }
  for (let i = 0; i < L.length; i++) { L[i] += H.L[i]; R[i] += H.R[i]; }
}

// ---------- A2 · the reveal: calm ----------
at(1.85, bell(note(62), 3.2, { k: 2.2 }), .32, -.1);   // temple bell
at(1.85, mixb(drone(2.2, note(43), .8), choir(2.2, .5, [43, 50], .3, .6)), .2, 0);   // low Om
at(NECK_CAP, tone(.4, t => 75 * Math.exp(-t * 3) + 38, { e: env.ad(.01, .12), amp: 1 }), .28, 0);   // soft dhum
at(HAND[0], shimmer(.5, [84, 88, 91].map(note), .5, .07), .16, -.3);
at(MELT, squeak(1900, 900, .22, 1), .26, -.35); at(MELT + .05, plink(note(84)), .12, -.3);   // cute falling squeak

// ---------- B · wired to fear ----------
at(B0, noise(5.6, { lp: 700, hp: 150, e: env.swell(1, 1.5), amp: 1 }), .17, -.2);   // night wind
at(PULL[0], whoosh(.8, 300, 1100, .6), .1, 0);
at(MOUSE_IN[0], scamper(MOUSE_IN[1] - MOUSE_IN[0]), .42, -.8);   // Mooshak scampers in from the left
at(VAS_PEEK, hiss(.35, 1, env.swell(.15, .15)), .12, -.2);
at(SPOT, squeak(1500, 2000, .06, 1), .1, -.55);
at(TAKE, squeak(900, 2200, .18, 1), .42, -.6); at(TAKE, slide(.35, 450, 1700, .6), .2, -.6);   // big take
at(FLEE[0], whoosh(.2, 400, 2600, .8), .32, -.7); at(FLEE[0] + .02, scamper(.5), .32, -.85);   // zip, then off left
at(YAWN, slide(.35, 220, 430, 1), .2, -.2); at(YAWN + .35, slide(.4, 430, 170, 1), .2, -.2);   // yawn
at(POISON_CAP - .2, choir(1.5, .6, [40, 46], .9, .2), .22, 0);   // low dissonant swell
at(WHIP[0], whoosh(.4, 300, 3600, 1), .4, 0);   // whip up

// ---------- C · the churning ----------
at(C0, whoosh(.35, 3000, 300, 1), .3, 0);
at(9.3, conch(1.1), .2, .35);   // conch blast
at(9.3, waves(4.8, 1), .15, 0);   // waves under it, until the stillness
for (let i = 0; i * BEAT + 9.4 < 14.0; i++) {   // every tug: devas (left) then asuras (right)
  const t = 9.4 + i * BEAT, p = i % 2 ? .6 : -.6;
  at(t, creak(.4), .16, p);
  at(t + .05, mixb(noise(.1, { lp: 900, hp: 120, e: env.ad(.008, .03), amp: 1 }), tone(.1, t2 => 150 - 60 * t2 / .1, { type: 'saw', e: env.ad(.008, .035), amp: .25 })), .28, p);   // "hup"
}
at(WINCE, squeak(1800, 2600, .15, 1), .25, .5);
// STILL: nothing at all for a beat, except one bubble
at(STILL + .1, bubble(1), .35, .1);
at(ERUPT, boom(), .6, 0);   // the eruption
at(ERUPT, rumble(1.5, 1), .28, 0); at(ERUPT, roar(1.4, 1), .38, 0); at(ERUPT + .1, gurgle(1.2, 1), .3, 0);
at(ERUPT + .05, hiss(1.1, 1, env.swell(.1, .5)), .12, 0);
at(ERUPT + .1, choir(RUN - ERUPT - .1, 1, [37, 38, 44], 1.6, .3), .3, 0);   // choir swells until everyone runs
at(RUN, scamper(.7), .3, -.8); at(RUN + .05, scamper(.7), .3, .8); at(RUN + .2, scamper(.5), .26, -.5);
at(RUN, whoosh(.35, 500, 2400, 1), .28, -.7); at(RUN + .05, whoosh(.35, 500, 2400, 1), .28, .7);
at(EXCEPT_CAP, bell(note(96), 2, { k: 3 }), .2, 0);   // thin high bell
at(INTO_CLOUD[0], whoosh(.4, 300, 1500, 1), .25, 0);   // pushes into the cloud

// ---------- D · Neelkanth ----------
at(CLEAR[0], whoosh(.4, 1500, 400, 1), .14, 0);
at(CLEAR[0] + .2, drone(4.9, note(36), .8), .13, 0);   // a cold hum under the violet
at(HANDS_UP[0], plink(note(91)), .1, -.2);
at(POUR[0], whoosh(POUR[1] - POUR[0], 300, 1800, 1), .22, .1);   // swirling poison
at(POUR[0], gurgle(POUR[1] - POUR[0], .5), .14, -.1);
at(SIP[0], slide(.3, 350, 600, .6), .1, -.2);
at(GULP, gulp(1), .55, -.2); at(GULP, thud(.4), .2, -.2);
for (let i = 0; i < 8; i++) at(PARVATI_IN[0] + i * .1, plink(note(i % 2 ? 100 : 96), .5), .13, lerp(.8, .3, i / 7));   // anklet bells
at(TOUCH, thud(.4), .22, 0);
at(SINK[0], slide(SINK[1] - SINK[0], 900, 200, 1), .12, -.15);
at(BLUE[0], shimmer(.8, [88, 91, 95, 100].map(note), .6, .09), .2, -.2); at(BLUE[0], bell(note(45), 2.6, { k: 2 }), .26, -.2);   // cool glow + low bell
at(NEEL_CAP, gong(1, 3), .3, 0);

// ---------- E · Vasuki's place ----------
at(VAS_UP[0], slide(.5, 500, 250, 1), .2, -.3);   // tired
at(E0, drone(3.4, note(43), .6), .13, 0);
at(STROKE[0], shimmer(.5, [79, 84, 88].map(note), .5, .08), .18, -.3);
at(NUZZLE, plink(note(88)), .22, -.25); at(NUZZLE + .1, plink(note(95), .8), .18, -.25);   // heart plink

// ---------- F · the meaning ----------
beat(MEANS_CAP, .35);   // a heartbeat under the caption
at(MEANS_CAP + .05, drone(7.2, note(41), .7), .12, 0);   // a dark hum under the slams
at(THESIS1, whoosh(.5, 300, 900, .6), .14, 0);
at(FEAR, thud(1), .55, 0); at(FEAR, hiss(.5, 1, env.swell(.05, .3)), .32, 0);   // FEAR
at(DEATH, boom(), .5, 0); at(DEATH, choir(.6, 1, [37, 38, 44], .03, .3), .3, 0);   // DEATH
at(TIME, damaru(.5, 14, 14, 1), .35, 0);   // TIME: a damaru hit and four ticks
for (let i = 0; i < 4; i++) at(TIME + .1 + i * .25, tick(1), .35, i % 2 ? .15 : -.15);
at(THESIS2, tone(1, t => 55 * Math.exp(-t * .5) + 25, { e: env.ad(.01, .35), amp: 1 }), .42, 0); at(THESIS2, gong(1, 3), .22, 0);   // deep dhum + gong
at(PEEK, mixb(squeak(900, 1500, .1), click(.5)), .3, 0);
at(PEEK + .3, plink(note(79)), .2, 0); at(PEEK + .45, plink(note(84)), .2, 0);
at(WIPE_OUT, whoosh(.5, 400, 3500, 1), .3, 0);

// ---------- G · Chandraghanta ----------
at(G0 + .1, drone(4.5, note(48), .7), .17, 0);   // warm
at(FLICKER[0], crackle(FLICKER[1] - FLICKER[0], 1), .09, .45);   // her aura flickers
at(SHIVA_HAND, bell(note(67), 2, { k: 2.8 }), .2, -.4);
at(BELL, ghanta(1), .5, .45);   // the brightest bell in the reel
at(FLASH_G[0] - .05, whoosh(.3, 600, 4000, 1), .3, 0);

// ---------- H · the rhyme ----------
at(RISE[0], hiss(.3, 1, env.swell(.1, .1)), .14, 0);
at(FEINT[0], whoosh(.3, 400, 2400, 1), .3, 0);
at(FEINT[1] - .05, slide(.2, 600, 300, .6), .12, 0);   // stops short
at(BLEP, mixb(plink(note(91)), squeak(1200, 1800, .08, .5)), .25, 0);
at(WINK, mixb(click(.8), plink(note(96))), .28, 0);
at(RING[0], whoosh(RING[1] - RING[0] + .05, 300, 3500, 1), .4, 0);

// ---------- Card ----------
at(CARD.book, mixb(thud(.5), plink(note(72))), .35, 0);
at(CARD.fan, whoosh(.25, 900, 2400, .6), .2, -.4); at(CARD.fan + .05, whoosh(.25, 900, 2400, .6), .2, .4);
at(CARD.logo, bell(note(84), 1.4), .25, 0);
at(CARD.series, plink(note(76)), .22, 0); at(CARD.sub, plink(note(79)), .22, 0);
at(CARD.pill, shimmer(1.2, [76, 79, 84, 88].map(note), .7, .06), .32, 0);
at(CARD.follow, plink(note(84)), .2, 0);
at(47.4, bell(note(88), 1.3), .1, 0);

write(args.out || 'assets/snake_sfx.wav');
