// book.js: the words of the Dashavatar book's style test (Vamana, pp. 2–5), and where they sit on each page
// (tools/book.mjs reads it). Positions are in mm from the top-left of the page's TRIM (a page is 216 × 216 mm, 8.5″
// square; the art has 3 mm of bleed outside it). Keep text 10 mm inside the trim and 12 mm off the fold.
// The story and its sources: books/dashavatar/STORY.md. The same words go over both test arts:
//   Storybook: --page=book_storybook.html (src/scenes/dasha_book_sb.js)
//   Painterly: --page=book_painterly.html --variant=painterly (src/scenes/dasha_book_pt.js): cream text on the night
//              sky, bubbles placed for that art.
// A page:  text:    [{ x, y, w, lines: ['…', …] (one paragraph each), size (pt, default BOOK.size), align, color, font }]
//          bubbles: [{ x, y, w, text, tail: [x, y] (the point it speaks from), size }]
//          boxes:   [{ x, y, w, kind: 'fact' ("Did you know?") | 'find' ("Can you find…?"), text, size }]
// Art: page n is half of slot ⌊n/2⌋ (even pages the left half, odd the right).
const CREAM = '#FFF3E0';
const BOOK = {
  slug: 'dashavatar',
  title: 'Dashavatar',
  subtitle: 'The Ten Times Vishnu Came',
  series: 'Rishi Katha',
  publisher: 'Rishi Katha',
  lang: 'en',
  ages: '3–12',
  trim: { w: 216, h: 216 }, bleed: 3,
  size: 18, ink: '#3A1F22', accent: '#E0501C',
  pages: {
    2: { text: [{ x: 12, y: 12, w: 150, lines: ['King Bali was kind and generous. But he had taken the heavens from the devas.', 'At his great yagna he promised: “Ask, and I will give!”'] }] },
    3: { text: [{ x: 14, y: 12, w: 180, lines: ['Then in walked a little boy, with an umbrella and a water pot.'] }],
         bubbles: [{ x: 106, y: 112, w: 70, text: 'Just three steps of land, please. Measured by my own small feet!', tail: [94, 158] }],
         boxes: [{ x: 120, y: 176, w: 86, kind: 'fact', text: 'Vamana means “the small one”. He is Vishnu’s fifth avatar, born to Aditi, the mother of the devas.' }] },
    4: { text: [{ x: 12, y: 12, w: 140, lines: ['“That boy is Vishnu!” warned Bali’s guru, Shukracharya.', 'But Bali had made a promise, and he kept it.'] }],
         bubbles: [{ x: 74, y: 102, w: 66, text: 'Place your third step on my head.', tail: [116, 140] }] },
    5: { text: [{ x: 108, y: 12, w: 98, lines: ['The little boy grew… and grew… and grew!', 'With one step he covered the earth. With the second, the whole sky.'] }],
         boxes: [{ x: 112, y: 172, w: 94, kind: 'fact', text: 'Trivikrama means “he who took three steps”. Pleased with Bali, Vishnu made him king of Sutala, and guarded his door himself.' }] },
  },
  variants: {
    painterly: { pages: {
      3: { bubbles: [{ x: 104, y: 108, w: 70, text: 'Just three steps of land, please. Measured by my own small feet!', tail: [96, 150] }] },
      4: { text: [{ x: 12, y: 12, w: 140, color: CREAM, lines: ['“That boy is Vishnu!” warned Bali’s guru, Shukracharya.', 'But Bali had made a promise, and he kept it.'] }],
           bubbles: [{ x: 74, y: 104, w: 66, text: 'Place your third step on my head.', tail: [116, 150] }] },
      5: { text: [{ x: 108, y: 12, w: 98, color: CREAM, lines: ['The little boy grew… and grew… and grew!', 'With one step he covered the earth. With the second, the whole sky.'] }] },
    } },
  },
};
