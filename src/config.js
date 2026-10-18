// config.js: Navagraha Book 1, Surya. Not a video: each 1-second slot is one spread of the picture book (see
// src/scenes/surya_book.js), rendered as a still at t = slot + .5.
//   w, h: the spread at 300 dpi with 3 mm bleed all round: (2 × 140 + 6) × (220 + 6) mm = 3378 × 2668 px.
//   vignette: false, so the page corners aren't darkened.
const PROJECT = { duration: 10, bpm: 90, offset: 0, w: 3378, h: 2668, vignette: false };
