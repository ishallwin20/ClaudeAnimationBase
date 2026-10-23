// config.js: project settings.
//   duration: one wallpaper loop, in seconds (WL in src/scenes/wall_kit.js).
//   bpm:      80, so the 6 s loop is 8 beats (two bars): feel()'s beat-locked idles repeat exactly.
//   w, h:     1290×2796, an iPhone Pro Max screen (19.5:9). The scenes draw in a 1080×2340 design space (wallBegin()).
const PROJECT = { duration: 6, bpm: 80, offset: 0, w: 1290, h: 2796, letterFont: 'Bangers',
  fonts: ['700 300px Poppins', '500 60px Poppins'] };
