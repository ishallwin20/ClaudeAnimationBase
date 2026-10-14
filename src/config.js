// config.js: project settings.
//   duration: the video's length in seconds (TL.end in src/scenes/surya_tl.js).
//   w, h:     canvas size in pixels. This project is a 9:16 Instagram reel, drawn with the cinematic engine (src/cine.js).
//   audio:    the mix (Sarvam voice + SFX + Lyria score); render the other copies with --audio=.
const PROJECT = { duration: 60.72, w: 1080, h: 1920, fonts: ['700 56px Cinzel', '42px Marcellus', '700 54px Poppins', '500 36px Poppins', '700 44px Poppins', '700 30px Poppins', '500 34px Poppins', '700 66px Cinzel'], audio: 'assets/surya_mix.wav' };
