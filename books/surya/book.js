// book.js: the words of Navagraha Book 1, Surya, and where they sit on each page (tools/book.mjs reads it).
// Positions are in mm from the top-left of the page's TRIM (a page is 140 × 220 mm; the art has 3 mm of bleed outside it).
// Keep text 10 mm inside the trim and 12 mm off the fold. The story and its sources: books/surya/STORY.md.
//
// A page:  text:    [{ x, y, w, lines: ['…', …] (one paragraph each), size (pt, default BOOK.size), align, color, font }]
//          bubbles: [{ x, y, w, text, tail: [x, y] (the point it speaks from), size }]
//          boxes:   [{ x, y, w, kind: 'fact' ("Did you know?") | 'find' ("Can you find…?"), text, size }]
//          images:  [{ x, y, w, src }] (a picture file, e.g. the Rishi Katha logo)
// Page keys: 1 … 16 (interior), 'ifc' / 'ibc' (inside front / back cover), 'front' / 'back'.
// Art: page n is half of slot ⌊n/2⌋ (even pages the left half, odd the right); p1 is slot 0's right, p16 slot 8's left,
// the inside covers slot 0's left and slot 8's right, the outside cover slot 9 (back | front).
// Every "Did you know?" is a true fact (STORY.md lists them with the story's sources); every "Can you find…?" names
// something painted into that spread.
const CREAM = '#FFF3E0', LOGO = 'assets/rk/logo.png';
const BOOK = {
  slug: 'surya',
  title: 'Surya',
  subtitle: 'The Sun Who Shines for All',
  series: 'Navagraha Series · Book 1',
  publisher: 'Rishi Katha',
  lang: 'en',
  ages: '3–10',
  trim: { w: 140, h: 220 }, bleed: 3,
  size: 16, ink: '#3A1F22', accent: '#E0501C',
  pages: {
    1: { text: [{ x: 10, y: 124, w: 120, lines: ['Surya'], size: 54, align: 'center', font: 'title' },
                { x: 10, y: 150, w: 120, lines: ['The Sun Who Shines for All'], size: 20, align: 'center', font: 'title' },
                { x: 10, y: 166, w: 120, lines: ['Navagraha Series · Book 1'], size: 12, align: 'center' }],
         images: [{ x: 58, y: 182, w: 24, src: LOGO }] },
    2: { text: [{ x: 12, y: 12, w: 116, color: CREAM, lines: ['Long, long ago, the asuras chased the devas out of the sky.', 'The world grew cold and dark.'] }],
         boxes: [{ x: 10, y: 186, w: 76, kind: 'fact', text: 'Aditi means “without limits”. She is the mother of the twelve Adityas, and Surya is one of them.' }] },
    3: { text: [{ x: 14, y: 12, w: 114, color: CREAM, lines: ['Aditi, the mother of the devas, closed her eyes and prayed to the Light of the world.', 'And far away, the Light heard her.'] }],
         bubbles: [{ x: 12, y: 56, w: 50, text: 'Please, be born as my son, and help us!', tail: [42, 86] }],
         boxes: [{ x: 10, y: 188, w: 84, kind: 'find', text: 'The owl who loves the dark, Aditi’s little lamp, and a deva peeking out from a cloud.' }] },
    4: { text: [{ x: 12, y: 12, w: 116, color: CREAM, lines: ['Soon Aditi held a tiny glowing egg.', 'She fasted and prayed for it, day after day.'] }],
         bubbles: [{ x: 8, y: 50, w: 56, text: 'Aditi! Won’t all this fasting harm the egg?', tail: [34, 96] }],
         boxes: [{ x: 10, y: 190, w: 80, kind: 'fact', text: 'The Martand Sun Temple in Kashmir, built about 1,300 years ago, is named after Martanda.' }] },
    5: { text: [{ x: 14, y: 12, w: 114, color: CREAM, lines: ['WHOOSH! Out burst a light brighter than a thousand lamps!', 'A voice from the sky named him Martanda.', 'The asuras could not bear his light, and ran away.'] }],
         boxes: [{ x: 8, y: 190, w: 66, kind: 'find', text: 'Count the pieces of eggshell! Can you find the asuras running away?' }] },
    6: { text: [{ x: 12, y: 12, w: 116, lines: ['Every day, Surya rides a golden chariot with just one wheel.', 'Seven horses pull it across the sky.'] }],
         bubbles: [{ x: 8, y: 44, w: 50, text: 'Good morning, everyone! Time to wake up!', tail: [44, 84] }] },
    7: { text: [{ x: 14, y: 12, w: 114, lines: ['Aruna, the dawn, holds the reins.', 'That’s why the sky turns pink just before the Sun comes up!'] }],
         boxes: [{ x: 6, y: 46, w: 58, kind: 'fact', text: 'The Konark Sun Temple in Odisha is built like Surya’s chariot, with 24 stone wheels and 7 horses.' },
                 { x: 68, y: 46, w: 60, kind: 'find', text: 'The rooster crowing, the lotuses opening for the Sun, and a man offering water to Surya. Count the horses!' }] },
    8: { text: [{ x: 12, y: 12, w: 116, lines: ['Surya married Sanjna, the daughter of Vishwakarma, the builder of the gods.', 'But Surya shone so brightly that Sanjna could hardly look at him.'] }],
         bubbles: [{ x: 8, y: 54, w: 48, text: 'For you, I will shine a little softer.', tail: [62, 90] }],
         boxes: [{ x: 8, y: 192, w: 80, kind: 'fact', text: 'Vishwakarma is the gods’ architect. On Vishwakarma Puja, workers thank their tools and machines.' }] },
    9: { text: [{ x: 14, y: 12, w: 114, lines: ['So Surya let Vishwakarma trim away a little of his shine.', 'From the sparkly shavings, Vishwakarma made Vishnu’s Sudarshan chakra and Shiva’s trishul!'] }],
         boxes: [{ x: 8, y: 192, w: 72, kind: 'find', text: 'The chakra and the trishul made of sunshine, and Vishwakarma’s hammer. Count the sparkles!' }] },
    10: { text: [{ x: 12, y: 12, w: 116, lines: ['One morning, baby Hanuman saw the red rising Sun.', '“A big, juicy fruit!” he thought, and leapt into the sky.'] }],
          bubbles: [{ x: 18, y: 66, w: 24, text: 'Yum!', tail: [50, 96] }],
          boxes: [{ x: 8, y: 190, w: 76, kind: 'fact', text: '“Hanu” means “jaw” in Sanskrit. Hanuman got his name from the bump on his chin!' }] },
    11: { text: [{ x: 12, y: 12, w: 80, lines: ['Indra’s vajra bumped his chin, and down he tumbled.', 'Then the gods gave him gifts. Surya gave him a part of his own shine.'] }],
          bubbles: [{ x: 44, y: 62, w: 44, text: 'And when you are ready, I will be your teacher.', tail: [100, 74] }],
          boxes: [{ x: 6, y: 192, w: 60, kind: 'find', text: 'Indra’s vajra. How many tusks does Airavata have?' }] },
    12: { text: [{ x: 12, y: 12, w: 116, lines: ['When Hanuman grew up, he went to Surya to learn.', 'But Surya never stops, not even for a moment!'] }],
          boxes: [{ x: 8, y: 186, w: 76, kind: 'fact', text: 'The Sun rises in the east and sets in the west. (Really, it is the Earth turning!)' }] },
    13: { text: [{ x: 14, y: 12, w: 114, lines: ['So Hanuman flew in front of his teacher, facing him, from the eastern hills to the western hills.', 'That is how he learned grammar, the rules of words. Learning takes effort, and Hanuman never gave up.'] }],
          boxes: [{ x: 40, y: 186, w: 86, kind: 'find', text: 'The parrot who is learning too, and Hanuman’s palm-leaf book. Where does the Sun rise, and where does it set?' }] },
    14: { text: [{ x: 12, y: 12, w: 116, lines: ['Long after, Rama stood on the battlefield, tired and worried.', 'Mighty Ravana was coming to fight once more.'] }],
          bubbles: [{ x: 6, y: 66, w: 50, text: 'Pray to the Sun, my child, and you will win.', tail: [22, 108] }] },
    15: { text: [{ x: 14, y: 12, w: 114, lines: ['Sage Agastya taught him a prayer to the Sun, the Aditya Hridayam.', 'Rama prayed, and his strength came back. When we feel tired, we can turn to the light.'] }],
          boxes: [{ x: 6, y: 186, w: 60, kind: 'fact', text: 'Even today, many people chant the Aditya Hridayam facing the rising Sun.' },
                  { x: 70, y: 186, w: 58, kind: 'find', text: 'Ravana far away: count his heads! And who is peeking from behind the rock?' }] },
    16: { text: [{ x: 12, y: 12, w: 116, lines: ['Meet Surya'], size: 26, font: 'title' },
                 { x: 12, y: 30, w: 116, size: 12.5, lines: [
                   '• His day: Sunday, Ravivar. (Ravi is another name for Surya.)',
                   '• His colours: red and gold. He holds two lotuses. His gem is the ruby.',
                   '• His family: mother Aditi, father Kashyapa. His children include Yama, Yamuna and Shani.',
                   '• Surya Namaskar, the sun salutation, is 12 yoga poses to greet the Sun.',
                   '• Did you know? The Sun is a star! Its light takes about 8 minutes to reach us, and without it, nothing could grow.',
                   'Be like Surya: shine on everyone, big or small.'] },
                 { x: 12, y: 112, w: 116, lines: ['Answers: 5 eggshell pieces, 7 horses, 7 sparkles, 4 tusks, 10 heads.', 'Next in the series: Chandra, the Moon'], size: 11 }] },
    ifc: { text: [{ x: 20, y: 98, w: 100, lines: ['This book belongs to', '________________'], size: 18, align: 'center' }] },
    ibc: { text: [{ x: 12, y: 16, w: 116, lines: ['The Navagraha Series'], size: 22, align: 'center', font: 'title' },
                  { x: 48, y: 36, w: 80, size: 13, lines: ['Surya · Sunday', 'Chandra · Monday', 'Mangala · Tuesday', 'Budha · Wednesday', 'Brihaspati · Thursday', 'Shukra · Friday', 'Shani · Saturday', 'Rahu and Ketu'] },
                  { x: 12, y: 112, w: 116, size: 12, align: 'center', lines: ['Nine stories from the Puranas and the Ramayana, one for each graha.'] },
                  { x: 12, y: 196, w: 116, lines: ['rishikatha.com'], size: 14, align: 'center' }],
           images: [{ x: 58, y: 166, w: 24, src: LOGO }] },
    front: { text: [{ x: 10, y: 12, w: 120, lines: ['Surya'], size: 60, align: 'center', font: 'title' },
                    { x: 10, y: 38, w: 120, lines: ['The Sun Who Shines for All'], size: 20, align: 'center', font: 'title' },
                    { x: 10, y: 200, w: 120, lines: ['Navagraha Series · Book 1'], size: 12, align: 'center' }] },
    back: { text: [{ x: 14, y: 22, w: 112, size: 15, lines: ['Why does the sky turn pink before sunrise? Who taught Hanuman? Why does the Sun ride a chariot with just one wheel?', 'Meet Surya, the Sun who shines for all, in the first book of the Navagraha Series. Every story comes from the Puranas and the Ramayana.'] },
                   { x: 14, y: 102, w: 112, lines: ['Ages 3–10 · rishikatha.com'], size: 12, align: 'center' }],
            images: [{ x: 58, y: 112, w: 24, src: LOGO }] },
  },
};
if (typeof module !== 'undefined') module.exports = BOOK;
