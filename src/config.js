// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
//   w, h:     canvas size in pixels (default 1920×1080). This project is a 9:16 Instagram reel.
//   letterFont: the caption face (Bangers from the Shani reels on).
const PROJECT = { duration: 37.5, bpm: 96, offset: 0, w: 1080, h: 1920, letterFont: 'Bangers', audio: 'assets/phone_mix.wav',
  fonts: ['700 50px Poppins', '500 36px Poppins', '700 36px Poppins', '500 32px Poppins', '400 44px "Tiro Devanagari Sanskrit"', '700 120px Poppins', '700 84px Poppins', '500 58px Poppins', '500 34px Poppins'] };
