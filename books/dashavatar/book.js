// book.js: the words of the Dashavatar book and where they sit on each page (tools/book.mjs reads it). Positions are
// in mm from the top-left of the page's TRIM (a page is 216 × 216 mm, 8.5″ square; the art has 3 mm of bleed outside
// it). The indigo border takes the outer 13 mm of every page: keep text 16 mm inside the trim and 12 mm off the fold.
// The art: book_dasha_pages.html (src/scenes/dasha_book.js), one slot per spread: slot 0 = inside cover | p. 1,
// slot n = pp. 2n | 2n + 1. The words, their changes and sources: books/dashavatar/INTRO.md.
//
//   node tools/book.mjs --book=books/dashavatar --pages=1,2,3,4,5,6,7,8,9,10,11 --render=all --page=book_dasha_pages.html --art=out/book_dashavatar/art_pages --out=out/books/dashavatar_out/intro --jpg
//
// A page:  text: [{ x, y, w, lines: ['…', …] (one paragraph each; *words* in the emphasis colour), size (pt), align,
//                   color, em, font ('story' Andika | 'title' Marcellus | 'deva' Tiro Devanagari Sanskrit), italic,
//                   lh, gap, ls, glow, mid (y is the block's middle) }]
const INK = '#3A1F22', CREAM = '#FFF3E0', GOLD = '#F2CF78', RUST = '#A0402A', INDIGO = '#1C2150';
// ready-made blocks
const T = (x, y, w, txt, o = {}) => ({ x, y, w, font: 'title', size: 24, lines: [txt], color: o.dark ? GOLD : '#7A2A22', lh: 1.1, ...o });
const P = (x, y, w, lines, o = {}) => ({ x, y, w, size: 14, lines, lh: 1.34, gap: .5, ...(o.dark ? { color: CREAM, em: GOLD, glow: 'rgba(16,18,44,.55)' } : { color: INK, em: RUST }), ...o });
const DEVA = (x, y, w, lines, o = {}) => ({ x, y, w, font: 'deva', size: 15, lh: 1.42, gap: 0, align: 'center', lines, ...o });
const IAST = (x, y, w, lines, o = {}) => ({ x, y, w, font: 'deva', italic: true, size: 10.5, lh: 1.3, gap: 0, align: 'center', lines, ...o });
const BOOK = {
  slug: 'dashavatar',
  title: 'Dashavatar',
  subtitle: 'The Ten Descents of Lord Vishnu',
  series: 'Rishi Katha',
  publisher: 'Rishi Katha',
  lang: 'en',
  ages: '6–10',
  trim: { w: 216, h: 216 }, bleed: 3,
  size: 14, ink: INK, accent: RUST, em: RUST,
  pages: {
    // ---------- p. 1: the title ----------
    1: { text: [
      { x: 16, y: 33, w: 184, font: 'title', size: 50, ls: .08, align: 'center', color: GOLD, lh: 1, glow: 'rgba(10,12,40,.9)', lines: ['DASHAVATAR'] },
      { x: 16, y: 55, w: 184, font: 'title', size: 17, align: 'center', color: CREAM, lh: 1.1, glow: 'rgba(10,12,40,.9)', lines: ['The Ten Descents of Lord Vishnu'] },
      DEVA(16, 171, 184, ['ॐ नमो भगवते वासुदेवाय'], { size: 21, color: INDIGO }),
      IAST(16, 183, 184, ['Om Namo Bhagavate Vāsudevāya'], { size: 12, color: '#4A4270' }),
    ] },

    // ---------- pp. 2–3: the Silent Ocean (one picture across the spread) ----------
    2: { text: [
      T(18, 17, 180, 'The Silent Ocean', { dark: true }),
      P(18, 30, 180, ['Long, long ago, before the first sunrise and before the first star, there was only a silent, shining ocean.',
        'It was not cold or dark. It glowed softly, like moonlight on pearl. On its gentle waves floated the great serpent *Shesha*, his thousand hoods spread wide like a canopy. And on his coils, calm as a sleeping lake, rested *Lord Vishnu*, the Preserver of the world.'], { dark: true }),
      { x: 30, y: 114.5, w: 156, size: 10, align: 'center', color: '#7A5A2A', italic: false, lines: ['A verse sung to Vishnu before worship'] },
      DEVA(26, 121, 164, ['शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं', 'विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम् ।', 'लक्ष्मीकान्तं कमलनयनं योगिहृद्ध्यानगम्यं', 'वन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम् ॥'], { color: '#5A1E1E' }),
      IAST(26, 155, 164, ['Shāntākāram bhujaga-shayanam padmanābham suresham', 'vishvādhāram gagana-sadrisham megha-varnam shubhāngam', 'Lakshmī-kāntam kamala-nayanam yogi-hrid-dhyāna-gamyam', 'vande Vishnum bhava-bhaya-haram sarva-lokaika-nātham'], { color: '#6A4A3A' }),
      { x: 28, y: 177, w: 160, size: 10, lh: 1.3, align: 'center', color: INK, lines: ['“I bow to Vishnu, peaceful in form, resting on the serpent, with the lotus in his navel, Lord of the gods. He is the support of the universe, vast as the sky, dark as a rain cloud, beautiful in every limb, beloved of Lakshmi, lotus-eyed. Yogis reach him through deep meditation. He takes away the fear of this world, the one Lord of all worlds.”'] },
    ] },
    3: { text: [
      P(18, 17, 180, ['*Goddess Lakshmi* sat beside him, smiling. From Vishnu’s navel rose a golden lotus, and on the lotus sat *Brahma*, the Creator, ready to begin the work of making the world.',
        'Soon there would be mountains and rivers, forests and animals, and people. And Vishnu, calm and watchful, would hold it all in his care.'], { dark: true }),
    ] },

    // ---------- p. 4: the One who is everywhere ----------
    4: { text: [
      T(18, 17, 180, 'The One Who Is Everywhere'),
      P(18, 29, 166, ['The wise sages gave him a name: *Vishnu*. It means *the One who is everywhere*. They said he lives in the wind that cools your face and the rain that fills the rivers. He is in the seed asleep beneath the soil, and in the kindness of a stranger who shares his bread.',
        'In his four hands, Vishnu carries four treasures. Each one teaches something.'], { size: 13.5 }),
      P(36, 75, 44, ['The conch, *Shankha*, sings the sound of the beginning, Om.'], { size: 11, lh: 1.25 }),
      P(36, 113, 44, ['The discus, *Chakra*, turns like time itself, and brings justice.'], { size: 11, lh: 1.25 }),
      P(136, 75, 44, ['The mace, *Gada*, is strength, used only to protect.'], { size: 11, lh: 1.25, align: 'right' }),
      P(136, 113, 44, ['The lotus, *Padma*, is purity, blooming even in muddy water.'], { size: 11, lh: 1.25, align: 'right' }),
      P(22, 186, 172, ['Wherever life must be protected, Vishnu protects. Wherever the world must be held, he holds it.'], { size: 13, align: 'center', color: '#1E2A4A', em: RUST }),
    ] },

    // ---------- p. 5: what is dharma? ----------
    5: { text: [
      T(18, 17, 86, 'What Is Dharma?'),
      P(18, 29, 82, ['The sages had another word, older than any city: *Dharma*.',
        'It comes from the word *dhri*, which means *to hold*. Dharma is what holds the world together, the way a river holds its banks and the sky holds the stars.',
        'But dharma is not only prayers or rules. It is a way of living. It is telling the truth when the truth is hard. It is keeping a promise when no one is watching. It is looking after someone weaker than you, and listening to your elders with respect. It is doing your duty with a brave and kind heart.',
        'Even the sun has a dharma: to shine. The river has one: to flow. A teacher’s is to teach, and a farmer’s is to feed.',
        'And yours? *To grow up into someone good.*'], { size: 12.5, lh: 1.3, gap: .42 }),
      { x: 30, y: 166, w: 156, font: 'title', size: 11.5, align: 'center', color: '#7A2A22', lines: ['Dharma Wisdom'] },
      DEVA(22, 172, 172, ['धारणाद्धर्ममित्याहुर्धर्मो धारयते प्रजाः । यत्स्याद्धारणसंयुक्तं स धर्म इति निश्चयः ॥'], { size: 12, color: '#5A1E1E' }),
      IAST(22, 179.5, 172, ['Dhāraṇād dharmam ity āhur dharmo dhārayate prajāḥ, yat syād dhāraṇa-saṃyuktaṃ sa dharma iti niścayaḥ'], { size: 9, color: '#6A4A3A' }),
      { x: 24, y: 185, w: 168, size: 9.5, lh: 1.25, align: 'center', color: INK, lines: ['“It is called dharma because it holds. Dharma holds all beings together. Whatever holds the world together, that is surely dharma.” (Mahabharata, Karna Parva)'] },
    ] },

    // ---------- p. 6: when the world grew heavy ----------
    6: { text: [
      T(18, 17, 180, 'When the World Grew Heavy', { dark: true }),
      P(18, 29, 180, ['But in the long story of the world, shadows sometimes creep in.',
        'Pride grew louder than kindness. Greed grew bigger than sharing. Lies grew bolder than truth. Powerful kings forgot that a ruler’s duty is to protect, and the good and gentle grew afraid.',
        'The Earth herself, *Bhumi Devi*, felt the weight of it all. She could bear mountains and oceans, but she could not bear so much sorrow. With tears in her eyes, she took the form of a gentle cow and went to *Lord Brahma*, the Creator, to ask for help.',
        'Brahma listened, and his heart was moved. “Come,” he said. “We will go to the One who holds the world.”'], { dark: true, size: 13.5 }),
    ] },

    // ---------- p. 7: the Ocean of Milk ----------
    7: { text: [
      T(18, 17, 180, 'The Ocean of Milk', { dark: true }),
      P(18, 29, 180, ['So *Brahma*, with *Bhumi Devi*, *Lord Shiva* and all the gods, travelled far across the sky to the shore of *Kshir Sagar*, the Ocean of Milk, where Vishnu rests. There they stood quietly, bowed their heads, and sang an ancient prayer, the *Purusha Sukta*, for the gods knew that the Lord hears those who ask with a sincere heart.',
        'For a while there was only the sound of the waves.',
        'Then Brahma closed his eyes, and he heard something no one else could hear. A deep, gentle voice, like thunder far away and as warm as the sun, was speaking inside his mind.',
        'Brahma opened his eyes. A smile spread slowly across his four faces.'], { dark: true, size: 13.5 }),
    ] },

    // ---------- pp. 8–9: the Promise (one picture across the spread) ----------
    8: { text: [
      T(18, 17, 180, 'The Promise', { dark: true }),
      P(18, 29, 180, ['“Do not be afraid,” said Brahma to the gods and to Bhumi Devi. “The Lord has heard us. He will come himself, born on Earth in a form this world can touch and see, to take away the weight from her.”',
        'And so he did: he was born as *Krishna*. It was not the first time the Lord had come, and it would not be the last.',
        'As Krishna, he later spoke this promise aloud to a young prince named *Arjuna*, on a great battlefield, in the sacred song called the *Bhagavad Gita*. Here are the words, as they were sung.'], { dark: true, size: 13.5 }),
      DEVA(18, 102, 180, ['यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।', 'अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥', 'परित्राणाय साधूनां विनाशाय च दुष्कृताम् ।', 'धर्मसंस्थापनार्थाय सम्भवामि युगे युगे ॥'], { size: 17, color: GOLD, glow: 'rgba(16,14,40,.8)' }),
      IAST(18, 143, 180, ['Yadā yadā hi dharmasya glānir bhavati Bhārata', 'abhyutthānam adharmasya tadātmānaṃ sṛjāmy aham', 'paritrāṇāya sādhūnāṃ vināśāya ca duṣkṛtām', 'dharma-saṃsthāpanārthāya sambhavāmi yuge yuge'], { size: 11, color: CREAM, glow: 'rgba(16,14,40,.8)' }),
    ] },
    9: { text: [
      P(26, 176, 164, ['“Whenever goodness grows weak and wrong grows strong, I come. To protect the good, to stop those who do harm, and to set dharma firmly in place again, I appear, age after age.”'], { size: 13, align: 'center', color: '#3A2440', em: RUST, glow: 'rgba(255,248,236,.9)' }),
      { x: 26, y: 199, w: 164, size: 9.5, align: 'center', color: '#6A4A5A', lines: ['Bhagavad Gita 4.7–8'] },
    ] },

    // ---------- pp. 10–11: ten times he came ----------
    10: { text: [
      T(18, 17, 180, 'Ten Times He Came', { dark: true }),
      P(18, 29, 180, ['This is the promise he keeps, age after age, each time in the form the world needs most.'], { dark: true, size: 13.5 }),
      ...[
        'When a great flood rose, he came as a *Fish*.',
        'When a mountain began to sink, he became a *Tortoise*.',
        'When the Earth was lost beneath the waters, he came as a *Boar*.',
        'When a child’s faith was in danger, he appeared as the *Man-Lion*.',
        'When a king grew too proud, he came as a little *Dwarf*.',
      ].map((l, i) => P(52, 55 + i * 26, 136, [l], { size: 12.5, lh: 1.22, mid: true })),
    ] },
    11: { text: [
      ...[
        'When rulers forgot their duty, he came as *Parashurama*, the sage with the axe.',
        'He came as *Rama*, the prince who never broke his word.',
        'He came as *Krishna*, who danced, taught and guided.',
        'When the world needed gentleness and compassion, he came as the *Buddha*.',
        'And one day, when the world needs him again, he will come as *Kalki*, riding a white horse of light.',
      ].map((l, i) => P(28, 30 + i * 25, 136, [l], { size: 12.5, lh: 1.22, mid: true })),
      P(18, 160, 112, ['Turn the page, and let the first story begin.'], { dark: true, size: 14, italic: false }),
    ] },
  },
};
