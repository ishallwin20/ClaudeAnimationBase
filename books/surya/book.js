// book.js: the words of Navagraha Book 1, Surya, and where they sit on each page (tools/book.mjs reads it).
// Positions are in mm from the top-left of the page's TRIM (a page is 140 × 220 mm; the art has 3 mm of bleed outside it).
// Keep text 10 mm inside the trim and 12 mm off the fold. The story and its sources: books/surya/STORY.md.
//
// A page:  text:    [{ x, y, w, lines: ['…', …] (one paragraph each), size (pt, default BOOK.size), align, color, font }]
//          bubbles: [{ x, y, w, text, tail: [x, y] (the point it speaks from), size }]
// Page keys: 1 … 16 (interior), 'ifc' / 'ibc' (inside front / back cover), 'front' / 'back'.
// Art: page n is half of slot ⌊n/2⌋ (even pages the left half, odd the right); p1 is slot 0's right, p16 slot 8's left,
// the inside covers slot 0's left and slot 8's right, the outside cover slot 9 (back | front).
const BOOK = {
  slug: 'surya',
  title: 'Surya',
  subtitle: 'The Sun Who Shines for All',
  series: 'Navagraha Series · Book 1',
  publisher: 'Rishi Katha',
  lang: 'en',
  ages: '3–10',
  trim: { w: 140, h: 220 }, bleed: 3,
  size: 16, ink: '#3A1F22',
  pages: {
    1: { text: [{ x: 10, y: 120, w: 120, lines: ['Surya'], size: 54, align: 'center', font: 'title' },
                { x: 10, y: 146, w: 120, lines: ['The Sun Who Shines for All'], size: 20, align: 'center', font: 'title' },
                { x: 10, y: 186, w: 120, lines: ['Navagraha Series · Book 1', 'Rishi Katha'], size: 12, align: 'center' }] },
    2: { text: [{ x: 12, y: 12, w: 116, lines: ['Long, long ago, the asuras chased the devas out of the sky.', 'The world grew cold and dark.'] }] },
    3: { text: [{ x: 12, y: 12, w: 116, lines: ['Aditi, the mother of the devas, closed her eyes and prayed to the Light of the world.', 'And far away, the Light heard her.'] }],
         bubbles: [{ x: 14, y: 60, w: 60, text: 'Please, be born as my son, and help us!', tail: [40, 100] }] },
    4: { text: [{ x: 12, y: 12, w: 116, lines: ['Soon Aditi held a tiny glowing egg.', 'She fasted and prayed for it, day after day.'] }],
         bubbles: [{ x: 14, y: 60, w: 60, text: 'Aditi! Won’t all this fasting harm the egg?', tail: [40, 100] }] },
    5: { text: [{ x: 12, y: 12, w: 116, lines: ['WHOOSH! Out burst a light brighter than a thousand lamps!', 'A voice from the sky named him Martanda.', 'The asuras could not bear his light, and ran away.'] }] },
    6: { text: [{ x: 12, y: 12, w: 116, lines: ['Every day, Surya rides a golden chariot with just one wheel.', 'Seven horses pull it across the sky.'] }],
         bubbles: [{ x: 8, y: 44, w: 50, text: 'Good morning, everyone! Time to wake up!', tail: [44, 84] }] },
    7: { text: [{ x: 14, y: 12, w: 114, lines: ['Aruna, the dawn, holds the reins.', 'That’s why the sky turns pink just before the Sun comes up!'] }] },
    8: { text: [{ x: 12, y: 12, w: 116, lines: ['Surya married Sanjna, the daughter of Vishwakarma, the builder of the gods.', 'But Surya shone so brightly that Sanjna could hardly look at him.'] }] },
    9: { text: [{ x: 12, y: 12, w: 116, lines: ['So Surya let Vishwakarma trim away a little of his shine.', 'From the sparkly shavings, Vishwakarma made Vishnu’s Sudarshan chakra and Shiva’s trishul!'] }],
         bubbles: [{ x: 14, y: 70, w: 56, text: 'For you, I will shine a little softer.', tail: [40, 110] }] },
    10: { text: [{ x: 12, y: 12, w: 116, lines: ['One morning, baby Hanuman saw the red rising Sun.', '“A big, juicy fruit!” he thought, and leapt into the sky.'] }],
          bubbles: [{ x: 70, y: 70, w: 30, text: 'Yum!', tail: [80, 100] }] },
    11: { text: [{ x: 12, y: 12, w: 116, lines: ['Indra’s vajra bumped his chin, and down he tumbled.', 'Then the gods gave him gifts. Surya gave him a part of his own shine.'] }],
          bubbles: [{ x: 14, y: 70, w: 60, text: 'And when you are ready, I will be your teacher.', tail: [40, 110] }] },
    12: { text: [{ x: 12, y: 12, w: 116, lines: ['When Hanuman grew up, he went to Surya to learn.', 'But Surya never stops, not even for a moment!'] }] },
    13: { text: [{ x: 12, y: 12, w: 116, lines: ['So Hanuman flew in front of his teacher, facing him, from the eastern hills to the western hills.', 'That is how he learned grammar, the rules of words. Learning takes effort, and Hanuman never gave up.'] }] },
    14: { text: [{ x: 12, y: 12, w: 116, lines: ['Long after, Rama stood on the battlefield, tired and worried.', 'Mighty Ravana was coming to fight once more.'] }],
          bubbles: [{ x: 14, y: 70, w: 56, text: 'Pray to the Sun, my child, and you will win.', tail: [40, 110] }] },
    15: { text: [{ x: 12, y: 12, w: 116, lines: ['Sage Agastya taught him a prayer to the Sun, the Aditya Hridayam.', 'Rama prayed, and his strength came back. When we feel tired, we can turn to the light.'] }] },
    16: { text: [{ x: 12, y: 12, w: 116, lines: ['Meet Surya'], size: 26, font: 'title' },
                 { x: 12, y: 30, w: 116, size: 13, lines: [
                   '• His day: Sunday, Ravivar. (Ravi is another name for Surya.)',
                   '• His colours: red and gold. He holds two lotuses.',
                   '• His family: mother Aditi, father Kashyapa. His children include Yama, Yamuna and Shani.',
                   '• Did you know? The Sun is a star! Its light takes about 8 minutes to reach us, and without it, nothing could grow.',
                   'Be like Surya: shine on everyone, big or small.'] },
                 { x: 12, y: 198, w: 116, lines: ['Next in the series: Chandra, the Moon'], size: 12, align: 'center' }] },
    ifc: { text: [{ x: 20, y: 96, w: 100, lines: ['This book belongs to', '____________________'], size: 18, align: 'center' }] },
    ibc: { text: [{ x: 12, y: 16, w: 116, lines: ['The Navagraha Series'], size: 22, align: 'center', font: 'title' },
                  { x: 12, y: 36, w: 116, size: 13, align: 'center', lines: ['Surya · Sunday', 'Chandra · Monday', 'Mangala · Tuesday', 'Budha · Wednesday', 'Brihaspati · Thursday', 'Shukra · Friday', 'Shani · Saturday', 'Rahu · Ketu'] },
                  { x: 12, y: 196, w: 116, lines: ['rishikatha.com'], size: 14, align: 'center' }] },
    front: { text: [{ x: 10, y: 14, w: 120, lines: ['Surya'], size: 60, align: 'center', font: 'title' },
                    { x: 10, y: 42, w: 120, lines: ['The Sun Who Shines for All'], size: 20, align: 'center', font: 'title' },
                    { x: 10, y: 200, w: 120, lines: ['Navagraha Series · Book 1'], size: 12, align: 'center' }] },
    back: { text: [{ x: 14, y: 30, w: 112, size: 15, lines: ['Why does the sky turn pink before sunrise? Who taught Hanuman? Why does the Sun ride a chariot with just one wheel?', 'Meet Surya, the Sun who shines for all, in the first book of the Navagraha Series. Every story comes from the Puranas and the Ramayana.'] },
                   { x: 14, y: 190, w: 112, lines: ['Ages 3–10 · rishikatha.com'], size: 12, align: 'center' }] },
  },
};
if (typeof module !== 'undefined') module.exports = BOOK;
