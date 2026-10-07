// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
//   w, h:     canvas size in pixels (default 1920×1080). This project is a 9:16 Instagram reel.
const PROJECT = { duration: 51.6, bpm: 104, offset: 0, w: 1080, h: 1920, audio: 'assets/union_sfx.wav',
  fonts: ['50px Marcellus', '500 38px Poppins', '700 52px Poppins'] };
