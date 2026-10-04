// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
//   w, h:     canvas size in pixels (default 1920×1080). This project is a 9:16 Instagram reel.
//   This branch renders only the 0–9 s picture of ad-maker's ad 001 (217 frames, t = 0 … 9.0): see STORYBOARD.md.
const PROJECT = { duration: 217 / 24, bpm: 100, offset: 0, w: 1080, h: 1920 };
