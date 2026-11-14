# Chalisa Decoded: the Hanuman Chalisa in 4 quiz reels

## Context

Proposed 14 Nov 2026; the owner asked for the plan to be saved. Not yet built.

An explainer series on the Hanuman Chalisa. Almost every viewer knows the words by heart, very few know what the
lines mean, so every line is a quiz: **"Do you know what this means?"**, a beat to guess, then the meaning. The
viewer keeps score and comments it. The ask on ad 90 ("which Chalisa line do you know by heart") is free research
for which lines to pick: read its comments before Part 1.

The Chalisa has 43 verses: 2 opening dohas, 40 chaupais, 1 closing doha. About a third are pure praise (*Jai Hanuman
gyan gun sagar*, *Mahabir bikram bajrangi*) where the quiz falls flat, so each part quizzes only the ~6 lines in its
block that carry a real surprise. 4 parts, following the Chalisa's own arc, rather than 7–8 parts covering every
verse (series fatigue: Parshurama fell from 96k at Part 4 to 33k at Part 5). If Part 1 takes off, add a bonus
"the lines we skipped"; a line that blows up in the comments can get its own short spin-off reel.

## Series rules

- **Style (proposed, owner to confirm):** Painted, Bangers captions, retro SFX, no VO. Reuses the Hanuman series
  rig and props. The alternative on the table is 3D + VO (girish_en_devotional reading the meanings).
- **Shape:** frame-0 hook ("You've sung it 1,000 times. Do you know what it MEANS?") with one subject → 6 quiz beats
  → ask → card. 85–90 s.
- **The quiz beat (~10 s each):**
  1. The verse in Devanagari, Roman transliteration under it, verse number in a small pill ("CHAUPAI 19"). ≥4.5 s.
  2. "Do you know what this means?" + a 1.5 s countdown (3-2-1 ticks in the SFX).
  3. The meaning, with Hanuman acting it out. ≥4.5 s.
  Devanagari needs a font check in the Painted caption path (Bangers is Latin only; the Ramayan kit draws
  Devanagari verses already).
- **Series marks:** a "CHALISA DECODED · PART N" pill in the opening only; the cover shows PART N big; the last caption
  before the card teases the next part's theme.
- **Ask:** "How many did you know? Comment your score out of 6." This series is the one place a quiz ask is used
  (the Hanuman series rule is identity asks).
- **Card:** the no-price Navadurga card with follow; confirm the offer line before Part 1.
- **Posting:** the Hanuman series has Parts 7–10 to go. Alternate the two (series, Chalisa, series…) or start the
  Chalisa after the series ends: two Hanuman series at once may feel like too much.

## Sources and accuracy

- The text is the Chalisa itself, attributed to Tulsidas, in Awadhi. Use one standard reading (Gita Press) for every
  line and quote it exactly; where readings differ (*Sankar suvan* / *Shankar swayam*; *sat bar* / *shat bar*), say
  "readings differ" on screen rather than pick the more dramatic one.
- Meanings follow the words, with a standard commentary (Gita Press) for each line. Where a line points to a story,
  the story is cited from Valmiki or the Ramcharitmanas with verse numbers, as in the Hanuman series.
- Step 1 of every build: re-read the block's verses and write "Facts used" (verse, reading, meaning, story source)
  in the storyboard. A meaning the commentary does not support is cut before drawing.
- **Left out on purpose:**
  - *Jug sahastra jojan par bhanu* as "Tulsidas knew the distance to the sun": it brings fact-check fights. If the
    line is shown at all, give only what it says (he leapt at the sun, thinking it a sweet fruit).
  - The Akbar legend of how the Chalisa was written (the Hanuman series left it out too).
  - *Ashta siddhi nau nidhi ke data* gets one short recap at most: ad 90 already decoded it.

## The 4 parts

| Part | Verses | Theme | Lines to quiz (pick ~6 at build) |
|---|---|---|---|
| 1 | Opening dohas + 1–8 | **Who he is** | *Shri Guru charan saroj raj, nij man mukur sudhari* (the dust of the guru's feet cleans the mirror of the mind); *Buddhiheen tanu janike* (Tulsidas calls himself witless); *Kanchan baran biraj subesa* (his look, line by line); *Sankar suvan Kesari nandan* (Shiva's son? kept short: Hanuman Part 1 used it as its twist); *Vidyavan guni ati chatur*; *Prabhu charitra sunibe ko rasiya* (what he loves most is hearing Ram's story) |
| 2 | 9–19 | **What he did** (the Ramayan in 11 lines) | *Sukshma roop dhari Siyahi dikhava, bikat roop dhari Lanka jarava* (tiny for Sita, terrible for Lanka); *Laye Sanjivan Lakhan jiyaye*; *Raghupati kinhi bahut badai… tum mam priya Bharatahi sam bhai* (Ram: dear to me as Bharat); *Sahas badan tumharo jas gavai* (the thousand mouths of Shesha); *Tumharo mantra Vibhishan mana* (he took Hanuman's counsel and became king); *Prabhu mudrika meli mukh mahi* (the ring carried in his mouth across the sea) |
| 3 | 20–30 | **What he guards** | *Ram duare tum rakhvare* (the gatekeeper of Ram's door); *Sab sukh lahai tumhari sarna*; *Apan tej samharo aapai* (only he can hold his own blaze); *Bhoot pisach nikat nahi aavai*; *Sab par Ram tapasvi raja*; *Charon jug partap tumhara* (all four yugas) |
| 4 | 31–40 + closing doha | **What it gives you** (finale) | *Ram rasayan tumhare pasa* (rasayan = elixir); *Tumhare bhajan Ram ko pavai*; *Antakaal Raghubar pur jai*; *Jo sat bar path kar koi* (why 100 times? readings differ); *Jo yah padhai Hanuman Chalisa, hoy siddhi sakhi Gaurisa* (the witness is Shiva: twist); *Tulsidas sada Hari chera* (the poet signs off as Hari's servant); end on the closing doha |

## How each part is built

Branch `ad/<n>-books123-chalisa-<k>-<slug>` off `main`. Per part:

1. Re-read the block with commentary; write `STORYBOARD.md` (hook, the 6 beats with times, caption groups, "Facts
   used", ask, pinned comment).
2. Scene `src/scenes/chalisaK.js` + `chalisaK_props.js`, SFX `tools/chalisaK_sfx.mjs`, `src/config.js`, `studio.html`.
   A shared quiz-beat helper (verse card, countdown, reveal) goes to `main` with Part 1 and is reused.
3. Stills check (frame 0 first, then each verse card for the safe band y 420–1500, x < 930 and read times), then one
   render with SFX after clearing `out/frames`.
4. Cover with a big PART N, Instagram caption and pinned comment ("Score yourself: the 6 meanings" + the answers),
   all in `out/chalisaK_out/`.
5. Commit; ask the owner for the result before starting the next part.

## Status

| Part | Ad | Branch | Built | Result |
|---|---|---|---|---|
| 1 Who he is | | | | |
| 2 What he did | | | | |
| 3 What he guards | | | | |
| 4 What it gives you | | | | |
