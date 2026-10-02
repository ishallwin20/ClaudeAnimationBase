// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
//   w, h:     canvas size in pixels (default 1920×1080). This project is a 9:16 Instagram reel.
//   audio:    muxed into --clip and --encode (here: the reel's sound effects, made by tools/aparna_sfx.mjs).
//   fonts:    extra CSS fonts to wait for before the first frame (letter()'s `font` option; linked in studio.html).
const PROJECT = { duration: 53.6, bpm: 90, offset: 0, w: 1080, h: 1920, audio: 'assets/aparna_sfx.wav',
  fonts: ['78px Marcellus', '500 38px Poppins', '700 52px Poppins'] };
