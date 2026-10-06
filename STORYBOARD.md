# Aarav had ONE job: ROAR.

A 55.9-second vertical reel (1080×1920, 24 fps, bpm 100) for Rishi Katha's Navadurga picture books. It's the first
**book doorway** episode: Aarav, the series kid, has a real kid problem, opens a Rishi Katha book, and the goddess on
the cover steps out to help. This one is Book 3, Maa Chandraghanta ("The Fierce Protector"). The card sells Books 1–3,
a set of 3 for ₹500.
Scene: `src/scenes/lion.js`, sets and props: `src/scenes/lion_props.js`. Characters: the shared `src/aarav.js` (Aarav
and, re-coloured, the demon kid) and `src/chandraghanta.js`. Brand images: `src/scenes/rk_images.js` (`picture()`).
Sound effects: `tools/lion_sfx.mjs` → `assets/lion_sfx.wav`. No voiceover: the captions carry the story, and music is
added on Instagram.

Staging notes (world = screen at zoom 1):
- C: the beam from the book streams down-left and Chandraghanta forms on the rug at the left. Aarav topples back on
  the bed, and the open book lands on the bed beside him, where she goes back into it at the end of D.
- D: a two-shot in front of the bed. Her back hands stretch (cartoon noodle arms) to coach him; her abhaya hand does
  the facepalm, since her back arms draw behind her head.
- The tiny bell flies from her ghanta to his tail on sparkles: the tail hangs on his screen-left side, toward her.
- D→E: the book's two covers slam shut toward the centre, and E opens on the stage curtains parting from the centre.

## The story
```
Logline: Aarav has ONE job in the school play: he's Durga Maa's lion, and he has to ROAR. Every time, out comes "mew".
         The night before, Book 3 on his shelf goes TING, and Maa Chandraghanta steps out of it. "So YOU are playing
         MY lion?" Her bell teaches him that fear can't stand noise. She leaves a tiny bell on his tail. On stage he
         squeaks again, rings the bell, sees her in the wings, and ROARS so hard the demon's horns fall off.
Why it should travel: every parent has filmed a kid freezing on stage (relatable, and it gets sent to the spouse); a
         laugh in the first 1.5 s ("…mew."); a famous name at 11 s; a line worth saving ("You ROAR… and THEN you're
         brave"); a cry-laugh payoff; one easy comment ("Tree? King? Lion?").
Hook:    Frame 0: ONE subject, Aarav in a crooked paper lion mane, claws up, chest swelling, alone in a spotlight on a
         plum curtain. "Aarav had ONE job in the play:" / "ROAR." are already up. At 1.15 s: "mew." A paper petal
         drops off his mane.
World:   cold plum stage (fear) → dim blue bedroom → the book's GOLD floods it (her) → the stage again, now warm gold →
         a warm lamp-lit bedtime → the brand's peach (card).
Motifs:  MEW → ROAR (three mews: A, D, E, and then the roar). THE BELL: her big ghanta's GHANNN · the tiny bell on his
         tail, whose "ting" is answered by a GHANNN. TEN HANDS: they coach him (D) and clap for him (E). THE BOOK: it
         opens the doorway (B), its closing matches the stage curtains opening (D→E), and he falls asleep hugging it (F).
Ending rhyme: frame 0, a lone kid frozen in a spotlight → the last picture, the same kid asleep and proud with the
         book, the mane on the bedpost.
Arcs:    Aarav: hopeful wind-up → squeak, crushed → sad (B) → curious (TING) → terrified (she rises) → shy, star-struck →
                tries, fails, embarrassed → coached → amazed at his own roar → (E) frozen, trembling → finds the bell →
                determined → ROAR → overjoyed → asleep, smiling
         Chandraghanta: radiant entrance → one brow raised, amused → fierce teacher (bell) → a facepalm (comic) →
                warm (the lesson) → a wink → (E) cheering from the wings, ten hands
         Demon kid: smug smirk → horns pop off → flat on his bottom, dazed
```

## Time constants (video s; shared by the scene and the SFX; mirrored in STORYBOARD.md)
```js
// A stage rehearsal
MEW_A = 1.15, PETAL_A = 1.3, GIGGLE_A = 1.75, DROOP = 2.3, TOMORROW = 2.6, IRIS_A = 3.9, B0 = 4.4
// B bedroom: the doorway opens
SIGH = 4.8, PETAL_B = 5.2, TING_B = 5.9, FLY = 6.6, CATCH = 7.3, OPEN = 8.5, BEAM = 8.8, C0 = 9.4
// C she steps out
TOPPLE = 9.9, RISE1 = 10.6, FAN = 10.8, NAME = 11.0, MANE_UP = 13.2, BROW = 13.5, MEW_C = 15.0, D0 = 15.6
// D training
NOISE = 15.7, RING = 16.2, TURN = 17.6, INHALE1 = 18.8, MEW_D = 19.4, PALM = 19.6, COACH = [20.4, 21.3, 22.2],
INHALE2 = 23.8, ROAR_D = 24.4, WONDER = 25.0, LESSON = 25.6, TIE = 28.8, BELL_TIE = 29.6, EXIT = 30.4, SHUT = 30.9, E0 = 31.0
// E the play
CUE = 31.7, INHALE3 = 33.6, MEW_E = 34.2, GIGGLE_E = 34.5, DROOP_E = 35.0, BELL_E = 35.6, TING_E = 36.0, WINGS = 36.4,
ECHO = 36.6, BACK = 37.6, INHALE4 = 37.8, ROAR_E = 38.5, HUSH = 40.0, CHEER = 40.4, CLAP10 = 42.4, F0 = 44.5
// F bedtime + card
STORY = 45.0, GLINT = 45.8, COMMENT = 47.4, IRIS = 50.2, CARD = 50.7, CARD_CAP = 50.9, COVER3 = 51.1, ROW13 = 51.8,
PRICE = 52.2, LOGO = 52.7, PILL = 53.0, FOLLOW = 53.5, END = 55.9
```

## Shots and reads
Every caption sits in y 420–1500, left of x 930. Every caption is ≥ 2 s except one-word beats; big names and the key words are gold.

**A 0–4.4 · rehearsal** [frame 0 is a finished picture] Medium-close on Aarav standing in the spotlight (plum curtain, nothing else).
- 0–1.15: the hook text is up (`caption(…, t + 1)`): "Aarav had ONE job in the play:" (58) / "ROAR." (150, gold). He winds up: chest swells, cheeks puff, claws rise, the mane bristles. The viewer expects a roar.
- 1.15: a tiny "mew" (an O mouth) + "…mew." (90, coral) to 2.5. 1.3: a paper petal falls off the mane and seesaws down.
- 1.75: off-screen giggles. He blushes, his eyes dart sideways. 2.3: the mane droops and his shoulders sag.
- 2.6–4.3: "The play was TOMORROW." (64). The spotlight shrinks to a circle on his face (iris), and it opens again as the
  circle of his bedside lamp (a match iris).

**B 4.4–9.4 · bedroom, night** Aarav sits on the edge of his bed, legs dangling, the mane in his lap, a book shelf on the wall.
- 4.8: a sigh. 5.2: another petal drops into his lap.
- 5.9: one book on the shelf glows at the edges and goes TING; his eyes go to it, then his head turns. Caption "That night, a book on his shelf…" (58) / "…went TING." (84, gold) 5.9–7.9.
- 6.6–7.3: the book slides out by itself and floats to him on an arc; he catches it with a startle.
- 7.3–8.5: he holds it up, and the **real Book 3 cover** (`picture(PICS.book3)`) faces us, big, as the read (no caption).
- 8.5: he lays it open in his lap. 8.8: a gold beam BLASTS up out of the pages (GHANNN), his face lit from below, his hair and the petals blowing up. The camera tilts up with the beam.

**C 9.4–15.6 · she steps out** (same room, gold light)
- 9.4–10.6: Maa Chandraghanta rises out of the beam, growing from tiny to full size, with marigold petals spiralling round her.
- 9.9: Aarav topples backwards onto the bed (legs kick up, then he sits back up, wide-eyed).
- 10.8–11.7: her four back pairs of arms fan out one pair at a time (`arms` 0→1), with a TING each. The moon-bell glows.
- 11.0–13.4: "Out stepped" (58) / "MAA CHANDRAGHANTA" (104, gold).
- 13.2: the fallen mane floats up into one of her back hands. 13.5–15.6: she looks at it, then at him, one brow up (`browL`): "So YOU are playing" (58) / "MY LION?" (110, gold).
- 15.0: he nods fast and squeaks a tiny "mew" (sound only).

**D 15.6–31.0 · training** A two-shot: she's on the left, Aarav stands on the right, the bed behind them.
- 15.7–17.6: "Fear can't stand NOISE." (72). 16.2: she rings the ghanta. GHANNN: a camera shake, the lamp sways, the curtains flap, Aarav's hair blows back.
- 17.6–18.8: she sets the mane on his head: "Your turn." (84).
- 18.8: he winds up. 19.4: "mew." (caption 19.45–20.4). 19.6: one of her back hands facepalms (the laugh beat).
- 20.4–23.7: TEN-ARM COACHING, one beat per line, all held to 23.7: 20.4 a hand lifts his chin, "Chin UP." · 21.3 two
  hands roll his shoulders back, "Chest OUT." · 22.2 a finger taps his belly, "Roar from your BELLY." (each 62, the key word gold).
- 23.8: a big wind-up. 24.4: she rings the bell as he roars: a real ROAR. The mane flares to full, the window bangs open, the lamp flickers.
- 25.0: he stares at his own hands, amazed.
- 25.6–28.8 (the line people will save): "You don't roar because you're brave." (56) / 26.1 "You ROAR…" (96, gold) / 26.7 "…and THEN you're brave." (72, gold). She leans down and taps his nose.
- 28.8–30.8: "For when you forget." (64). Sparkles pinch a tiny gold bell off her ghanta. 29.6: she ties it to his cardboard tail, TING.
- 30.4: a wink, and she whooshes back into the book (a shrinking gold spiral). 30.9: the book claps shut, and its two covers fill the frame.

**E 31.0–44.5 · the play** [a match cut: the closed book's two halves become the stage curtains parting]
- The set: Aarav centre stage in the mane. Beside him the demon kid (a second, smaller kid design: buffalo-horn headband, a cardboard sword). In the foreground at the bottom, silhouetted audience heads with glowing phones, and Mum front row holding hers up.
- 31.7–33.6: "Next day. His cue:" (58) / "ROAR." (130, gold).
- 33.6: a wind-up. 34.2: "…mew." (34.25–35.5). 34.5: the audience giggles (heads bob) and the demon kid smirks. 35.0: Aarav trembles, the mane droops.
- 35.6: the camera pushes down to his tail, where the tiny bell glints. 36.0: he flicks it: *ting*.
- 36.4: a GHANNN answers. A whip pan left to the wings: Chandraghanta peeks round the curtain, all ten arms rising in a "big breath" gesture. "You ROAR…" (96, gold) 36.6–37.8.
- 37.6: a whip pan back. 37.8–38.5: his BIG wind-up (the camera pushes in, the mane bristles, chest out, eyes squeeze shut).
- 38.5: **ROAR**. A huge golden lion spirit roars behind him, and shockwave rings spread out. The demon kid's horns pop off and he sits down hard. The front row's hair blows back and Mum's phone wobbles. "ROAAAR!" (painted gold lettering) 38.5–39.9 and a screen shake.
- 40.0: a 0.4 s hush, everyone frozen. 40.4: the hall erupts: arms go up, and Mum wipes a tear while still filming. "The LOUDEST roar" / "in school history." 40.4–42.3.
- 42.4–44.4: in the wings, she claps with ALL TEN hands (five pairs, out of sync), winks, and breaks into gold sparkles. "…and ONE fan clapping" / "with TEN hands." (gold).

**F 44.5–50.7 · bedtime** [a match: her sparkles drift up and become the stars in his window]
- Aarav asleep in bed, smiling, hugging Book 3 (the real cover, small and tilted), the mane hanging on the bedpost, the tiny bell on his wrist.
- 45.0–47.3: "Every child has a ROAR inside." (64) / "Some just need the right STORY." (72, gold). 45.8: the book glints TING.
- 47.4–50.6 (3.2 s): "What was YOUR role" / "in the school play?" (64) / "Tree? King? Lion?" (90, gold) / "Tell us below!" (52).
- 50.2: a crescent-moon iris (her moon-bell's shape) closes on the book and opens on the peach card.

**Card 50.7–55.9** (adapted from `kalaCard` on `ad/8`): the Book 3 cover big (the hero, no ribbon), with "Book 3 · The
Fierce Protector" under it · Books 1–3 in a row · "Books 1–3 · Set of 3 for ₹500" · the RK logo · the `rishikatha.com`
pill · "Follow @therishikatha for Aarav's next adventure". It ends on the full card, with no fade.

