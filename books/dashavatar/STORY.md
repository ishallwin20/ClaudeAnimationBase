# Dashavatar: style test (Vamana, pp. 2–5)

A ~100-page Dashavatar picture book for ages 3–12 is planned: square 216 × 216 mm pages (8.5″), 2:1 spreads, with
narration, a little dialogue and short explainers over the art. Rama and Krishna get the biggest shares. Before
choosing the art style, the same two spreads of the Vamana chapter are drawn in **Storybook**, **Painterly** and **Cinematic** (the film-lit look: golden hour and the yagna fire, then the cosmos; cast in `src/cine_dashavatar.js`).

| spread | pages | art | words |
|---|---|---|---|
| "Three steps" | 2–3 | Bali's yagna on the Narmada: Bali holds out a gold water pot, Shukracharya watches warily, the fire burns between them; the boy Vamana walks in with his parasol and water pot | p2 narration; p3 narration, Vamana's bubble, a "Did you know?" |
| "He grew and grew" | 4–5 | Trivikrama fills the sky: one foot on the earth, the other striding past the sun, the planets and the stars; tiny Bali kneels to offer his head, Shukracharya clutches his own | p4 narration, Bali's bubble; p5 narration, a "Did you know?" |

Render and lay out (each style into its own folder):

```
node tools/book.mjs --book=books/dashavatar --pages=2,3,4,5 --render=all --page=book_storybook.html --art=out/book_dashavatar/art_sb --out=out/books/dashavatar_test_out/storybook
node tools/book.mjs --book=books/dashavatar --pages=2,3,4,5 --render=all --page=book_painterly.html --art=out/book_dashavatar/art_pt --variant=painterly --out=out/books/dashavatar_test_out/painterly
node tools/book.mjs --book=books/dashavatar --pages=2,3,4,5 --render=all --page=book_cinematic.html --art=out/book_dashavatar/art_cine --variant=cine --out=out/books/dashavatar_test_out/cinematic
```

## Facts used

All from the Bhagavata Purana, Canto 8 (chapters given; check verse numbers against a printed edition before the book goes to print).

| beat | source |
|---|---|
| Bali, the generous asura king, had conquered the heavens and driven out the devas | 8.15 |
| Vamana was born to Aditi (mother of the devas) and Kashyapa as Vishnu's avatar; at his sacred-thread ceremony he was given the sacred thread, the munja belt, a deerskin, an umbrella and a water pot (kamandalu) | 8.17–18 |
| He went to Bali's ashvamedha yagna at Bhrigukaccha, on the bank of the Narmada; Bali welcomed him and offered him whatever he wished | 8.18 |
| He asked for three steps of land, measured by his own feet; Bali said it was too little and offered more | 8.19 |
| Shukracharya warned Bali that the boy was Vishnu himself | 8.19 |
| Bali kept his word and gave the gift | 8.20 |
| The boy grew to fill the universe; with one step he covered the earth, with the second the heavens | 8.20 |
| With no room left for the third step, Bali offered his own head | 8.22.2 |
| Pleased, Vishnu made Bali king of Sutala and promised to guard his door himself | 8.22–23 |
| Vāmana = "the small one" (dwarf); Trivikrama = "of the three strides"; Vamana is the fifth of the ten avatars | the names; the standard Dashavatara order (Matsya, Kurma, Varaha, Narasimha, Vamana …) |

Art choices that claim no plot fact: the mango-leaf toran, the river at golden hour, the sun, moon and planets the
second step strides past, the colours of everyone's clothes.
