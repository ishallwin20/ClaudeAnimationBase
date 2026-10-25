// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
//   w, h:     canvas size in pixels (default 1920×1080). This project is a 9:16 Instagram reel.
//   letterFont: the caption face (Bangers from the Shani reels on).
// "How many KRISHNAS?": an 8 s loop (12 beats at 90 bpm), every motion's period divides 8 s.
const PROJECT = { duration: 8, bpm: 90, offset: 0, w: 1080, h: 1920, audio: 'assets/kanha_puzzle_sfx.wav', letterFont: 'Bangers' };
