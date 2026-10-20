// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
//   w, h:     canvas size in pixels (default 1920×1080). This project is a 9:16 Instagram reel.
const PROJECT = { duration: 60.0, bpm: 96, offset: 0, w: 1080, h: 1920, audio: 'assets/savitri_sfx.wav', letterFont: 'Bangers',
  fonts: ['64px Marcellus', '74px Marcellus', '700 64px Poppins', '700 52px Poppins', '700 40px Poppins', '500 34px Poppins', '700 31px Poppins', '500 31px Poppins'] };
