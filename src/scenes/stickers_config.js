// stickers_config.js: the sticker page's project settings (stickers.html loads this instead of src/config.js).
// Each sticker is one 1-second slot of the page, painted at t = slot + .5 on a 2700 × 2700 canvas: 9 × 9 in at 300 dpi.
// The art is drawn in a half-size design space (900 × 900, under camBegin(…, W / 900)), so the reel rigs' u ranges apply.
const PROJECT = { duration: 60, bpm: 96, offset: 0, w: 2700, h: 2700, vignette: false, letterFont: 'Bangers',
  fonts: ['50px Marcellus', '700 50px Poppins'] };
