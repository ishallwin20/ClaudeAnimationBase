// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
//   w, h:     canvas size in pixels (default 1920×1080). This project is a 9:16 Instagram reel.
const PROJECT = { duration: 59.6, bpm: 104, offset: 0, w: 1080, h: 1920, audio: 'assets/diwali_sfx.wav', letterFont: 'Bangers',
  fonts: ['56px Marcellus', '50px Marcellus', '700 56px Poppins', '700 52px Poppins', '700 50px Poppins', '700 46px Poppins', '700 34px Poppins', '700 30px Poppins', '700 22px Poppins', '500 38px Poppins', '500 28px Poppins'] };
