# Ramayan · the trailer (ad 48 · the series in 48 seconds)

A trailer for the whole 12-part Ramayan series (ad/33–47), to post before or with the burst and to pin. Painted (the
parts' own frames), 48.0 s. Unlike the parts, it has a **voice** (the channel narrator, `girish_en_devotional`, pace
1.15) and a **Lyria score** (one take, cut to fit and ducked under the voice), plus SFX on the cuts. The picture is
sixteen caption-free clips re-rendered from the parts' own branches (`tools/trailer_clips.mjs`: each branch as a
worktree, its `caption()` switched off), cut end to end; the captions are the trailer's own, drawn like the series'
(`tools/trailer_caps.mjs`, a transparent PNG sequence laid over the clips); the end card is painted in the engine
(`src/scenes/trailer.js`). `tools/trailer_build.mjs` puts it together.

Arc: quiet and sacred (the first verse, the exile) → a hint of menace (the deer, Ravana) → hope (Hanuman) → a drum
montage with three punch words → the climax (the bridge, the heads, the last arrow) → a dead stop on a white flash →
the end card: RAMAYAN · THE COMPLETE SERIES · 12 PARTS · WATCH FROM PART 1 · Follow @therishikatha.

Every line is a claim the parts already source (their STORYBOARDs): the first verse (Bala 2), the exile for fourteen
years (Ayodhya 11), the golden deer (Aranya 42), Ravana takes Sita (Aranya 49), Hanuman's leap and Lanka's burning
(Sundara 1, 54), the blade of grass as the Brahmastra (Sundara 38), 14,000 demons (Aranya 20–30), the arrow from behind
the tree (Kishkindha 16), the bridge (Yuddha 22), the heads growing back and the last arrow (Yuddha 107–108).

## Cut
| trailer | clip | from | voice / caption |
|---|---|---|---|
| 0.0–3.6 | 01 Valmiki's verse rises | Part 1, 27.8 | "It began with a single verse." (up at frame 0) |
| 3.6–6.4 | 02 Ram, hands joined: "I will go" | Part 2, 52.2 | "A prince, sent to the forest |
| 6.4–8.8 | 03 the chariot leaves Ayodhya | Part 3, 7.2 | for fourteen years." |
| 8.8–11.2 | 04 the golden deer winks | Part 6, 27.4 | "A golden deer." |
| 11.2–14.0 | 05 ten heads with heart eyes | Part 7, 12.4 | "A demon king with ten heads, |
| 14.0–16.4 | 06 the chariot rises with Sita | Part 7, 19.6 | who took Sita away." |
| 16.4–18.2 | 07 Hanuman, glowing, with the bundle | Part 7, 54.8 | "Then came Hanuman." |
| 18.2–20.0 | 08 he leaps off Mahendra | Part 9, 11.4 | "He leapt across the ocean, |
| 20.0–22.0 | 09 thumb-sized, in and out of Surasa | Part 9, 29.6 | |
| 22.0–24.8 | 10 roof to roof, Lanka burning | Part 10, 46.0 | and set Lanka on fire." |
| 24.8–26.6 | 11 the blade of grass blazes | Part 4, 24.0 | A BLADE OF GRASS… (a drum) |
| 26.6–28.4 | 12 arrows like rain | Part 5, 40.0 | 14,000 DEMONS… (a drum) |
| 28.4–30.0 | 13 the arrow from behind the tree | Part 8, 36.0 | ONE ARROW… (a drum) |
| 30.0–32.8 | 14 the army marches across the bridge | Part 11, 43.0 | "A bridge across the sea." |
| 32.8–35.8 | 15 a head cut off grows back | Part 12, 0.2 | "Heads that kept growing back… |
| 35.8–39.6 | 16 the Brahmastra strikes; Ravana falls | Part 12, 30.2 | …and one last arrow." (a riser) |
| 39.6–48.0 | the end card (a white flash, the hit) | src/scenes/trailer.js | "The Ramayan. All twelve parts. Watch it from Part One." |

## Files
`tools/trailer_clips.mjs` (the clip list), `tools/trailer_vo.json` → `assets/trailer_vo.wav` + `src/scenes/trailer_vo.js`,
`tools/trailer_score.txt` → `assets/trailer_score.mp3`, `tools/trailer_caps.mjs`, `src/scenes/trailer.js` (the card) →
`out/trailer/card.mp4`, `tools/trailer_build.mjs` → `out/trailer_out/trailer.mp4`.
