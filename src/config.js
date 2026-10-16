// config.js: project settings.
//   duration: the video's length in seconds (TL.end in src/scenes/kumbha_tl.js).
//   w, h:     canvas size in pixels. This project is a 9:16 Instagram reel, drawn with the cinematic engine (src/cine.js).
//   audio:    the mix (Sarvam voice + SFX + Lyria score); tools/kumbha_sfx.mjs writes it.
const PROJECT = { duration: 81.95, w: 1080, h: 1920, fonts: ['700 56px Cinzel', '42px Marcellus', '700 54px Poppins', '500 36px Poppins'], audio: 'assets/kumbha_mix.wav' };
