// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
//   w, h:     canvas size in pixels (default 1920×1080). This project is a 9:16 Instagram reel.
//   letterFont: the caption face (Bangers from the Shani reels on).
const PROJECT = { duration: 46.6, bpm: 90, offset: 0, w: 1080, h: 1920, audio: 'assets/kojagari_sfx.wav', letterFont: 'Bangers',
  fonts: ['50px Marcellus', '700 50px Poppins', '700 52px Poppins', '500 38px Poppins', '76px "Tiro Devanagari Sanskrit"', '80px "Tiro Devanagari Sanskrit"'] };
