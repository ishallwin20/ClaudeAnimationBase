# Instagram Stories: Book 1 and the Books 1–3 set (Cinematic, 13 s and 14 s)

Two short Story ads made after the Ravana reel (ad 15) went viral. Prices: **₹200 a book, ₹500 for the set of three**.
Each ends on a held card with an empty, labelled slot ("TAP THE LINK" and a chevron, y ~1470–1610) where the owner
puts the link sticker. Stories cover the top ~220 px and the bottom ~280 px, so everything sits in y 220–1640.

| story | time | shot | caption |
|---|---|---|---|
| Book 1 | 0–4.6 | Kailash at night; Shiva and Parvati on the summit (a callback to the reel) | Before she was *Parvati*, / the wife of *Shiva*… |
| | 4.0–8.6 | Dawn: Shailputri from behind with trishul and lotus, Nandi lying | she was born a princess / of the Himalaya: / *SHAILPUTRI*. |
| | 8.0–13 | Card: logo, the Book 1 cover, BOOK 1 · SHAILPUTRI, **₹200**, the link slot | |
| Set | 0–2.9 | Night, three unlit diyas | Three goddesses. / Three stories. |
| | 2.4, 4.4, 6.4 | A diya lights and its cover rises: 1 · SHAILPUTRI, 2 · BRAHMACHARINI, 3 · CHANDRAGHANTA, with the cover's subtitle | |
| | 8.4–14 | Card: THE NAVADURGA SET, the three covers fanned, **₹500 for all 3**, "₹600 if bought one by one", the link slot | |

Files: `story_book1.html`, `story_set.html` (Cinematic pages with their own PROJECT), `src/scenes/story_common.js` (diya,
the card ground, the price and link slot), `src/scenes/story_book1.js`, `src/scenes/story_set.js`, `tools/story_sfx.mjs`.

```sh
node tools/story_sfx.mjs
node render.mjs --page=story_book1.html --clip --out=out/story_book1.mp4
node render.mjs --page=story_set.html --clip --out=out/story_set.mp4
ffmpeg -i out/story_book1.mp4 -map 0:v -c:v copy out/story_book1_silent.mp4   # and the same for the set
```
