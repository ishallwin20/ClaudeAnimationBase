# Ad 85: "HANUMAN JI has THREE fathers" (Hanuman series, Part 1)

An 89.4 s Painted reel with Bangers captions, no voiceover, retro cartoon SFX and music only as mild beds (a harp in
heaven, an om on Kailash, a music-box lullaby from the birth on). Part 1 of the 10-part Hanuman Ji series
(`HANUMAN_SERIES.md` on `main`); it stands alone, and ends on the no-price Navadurga card.

```
Logline: Everyone calls Hanuman Ji Kesari Nandan, Pavan Putra and Shankar Suvan, but few know the story behind each
         name: a cursed apsara who married a vanara king, a promise from the Wind god on a mountain top, and Shiva's
         own energy carried on a leaf by seven sages. So which father is the real one? All three.
Why it should travel: a "wait, what?" hook about the most loved god, an answer everybody half knows (the Chalisa line
         they have sung all their lives), and a family name to comment.
Hook:    Frame 0: Bal Hanuman sitting on a plain warm ground, looking at us. Caption up: "HANUMAN JI HAS" /
         "THREE FATHERS" (gold). Three question marks pop over him, he shrugs and grins.
World:   warm gold (hook) → rose-gold heaven → violet curse → forest green (Anjana's home) → slate rain on the
         mountain → indigo Kailash and snow → a dawn ridge → forest → the cave at night, filling with gold → the forest
         by day (the family) → warm gold again (ask, tease) → the peach card.
Motif:   THREE. Three question marks in frame 0; three "FATHER NO." stamps, each with the same little fanfare a step
         higher; three names in the Chalisa; three hearts in the ask, in the fathers' three colours.
Arc:     curious → (Anjana) frightened, puzzled by her tail, shy, happy → cross ("who dares?") → glad → ticklish, radiant
         → (the baby) sleepy, wide-eyed, delighted → puzzled between three fathers → adored by all of them.
Ending rhyme: the ask is frame 0's baby on the same warm ground, the three question marks now three hearts.
```

## Characters
- **Bal Hanuman** (shared, `src/bal_hanuman.js`): sit, stand.
- **Maa Anjana** (series kit, `src/hanuman_series.js`: Parvati's rig, a forest-green saree, a saffron odhni, and now a
  vanari's tail; `tail: false` on the mountain top, where Valmiki has her in human form), **Kesari** (the kit: Hanuman's
  rig in bronze, a gold band), **the seven sages** (`rishi()`, Valmiki's rig in bark cloth).
- **Punjikasthala** (`apsara()` in `hanu1_props.js`: Parvati's rig in rose and gold, a mukut, a halo).
- **Vayu Dev** (shared `vayu()`, no pack), **Shiva** (shared `shiva()`).

## Time constants (video s; shared by `src/scenes/hanu1.js` and `tools/hanu1_sfx.mjs`)
```js
Q = [1.6, 2.0, 2.4], SHRUG = 3.2, B0 = 4.4
C0 = 9.0, CURSE = 9.5, FALL0 = 10.6, LAND0 = 11.6, APPEAR = 11.9, TAILQ = 12.7, D0 = 14.2
KARR = 15.7, FLOWER = 16.0, HEART = 16.8, ST1 = 18.4, E0 = 20.4
PEEK = 22.0, E2 = 24.6, SWIRL = 24.8, SNAPT = 25.8, E3 = 29.0, VPOP = 29.2, CALM = 31.4, WISP = 33.6, WISPIN = 34.8, ST2 = 37.2, F0 = 39.2
F2 = 43.4, OPEN = 43.9, ORB = 44.6, ORBOFF = 46.6, F3 = 48.0, TRIP = 50.4, F4 = 53.2, POUR = 54.5, LIT = 55.5, ST3 = 57.4, G0 = 59.6
BORN = 60.9, YAWN = 61.6, EYES = 62.7, H0 = 64.6, LOOKS = [65.2, 66.0, 66.8], ALL = 68.3, CH0 = 71.3, NAMES = [72.4, 73.6, 74.8], I0 = 77.3, J0 = 81.8
CARD = 85.4, END = 89.4
```

## Shots and reads (captions inside y 420–1500, left of x 930; 2-liners ≥ 3.5 s, the stamps ~1.9 s)
The small "HANUMAN · PART 1" pill sits bottom left of the safe band for the opening only (0–8.8 s), the source line
("VALMIKI RAMAYAN · SHIVA PURANA") beside it from 4.7 s; both fade out before the curse (owner, 11 Nov). After that the
captions name the texts ("THE SHIVA PURANA TELLS ONE MORE SECRET…", "YOU SING IT IN THE CHALISA").

- **A 0–4.4 · the hook.** The baby on warm gold; "HANUMAN JI HAS" / "THREE FATHERS" up from frame 0 to 4.25. 1.6, 2.0,
  2.4: three question marks pop, he looks at each. 3.2 he shrugs and grins. [out: rose wipe]
- **B 4.4–9.0 · heaven.** The apsara dances on a cloud, sparkles. 4.5–8.8 "HIS MOTHER WAS AN APSARA" / "NAMED
  PUNJIKASTHALA."
- **C 9.0–14.2 · the curse.** 9.5 the sky clouds over violet, a crackle round her, she freezes. 10.6 she falls
  through the day sky. 11.6 POOF on a forest hill; 11.9 she stands up as Anjana, in green, with a tail. 12.7 she
  looks back at it ("?"), 13.7 smiles. 9.15–13.95 "A CURSE SENT HER TO EARTH" / "AS A VANARI: ANJANA." [out: leaf wipe]
- **D 14.2–20.4 · Kesari.** He walks in, 16.0 offers a flower, 16.8 she blushes, hearts. 14.3–18.2 "SHE MARRIED
  KESARI," / "A VANARA KING." **18.4 stamp:** the camera punches in on Kesari, chest out: "FATHER NO. 1" / "KESARI".
  [out: slate wipe]
- **E1 20.4–24.6 · the mountain top.** Rain clouds, far peaks; Anjana in human form (no tail), a flower in her hand,
  walks along the top. 22.0 Vayu peeks over a cloud; 22.5 he is struck ("!"). 20.5–24.4 "ONE DAY, ON A MOUNTAIN TOP,"
  / "THE WIND GOD SAW HER."
- **E2 24.6–29.0 · the wind.** 24.8 a swirl of wind and leaves wraps round her; she looks about. 24.7–28.8 "SHE FELT
  THE WIND HOLD HER." 25.8 she snaps, a finger up: "\"WHO DARES? I AM MARRIED!\"" (to 28.8).
- **E3 29.0–39.2 · the promise.** 29.2 Vayu appears out of the swirl, palms open. 29.2–33.0 "\"DO NOT FEAR," SAID
  VAYU." / "\"I WILL NOT HARM YOU.\"" 31.4 she calms. 33.1–37.0 "\"YOU WILL HAVE A SON" / "WHO LEAPS LIKE THE WIND!\""
  33.6 a blue wisp leaves his brow (the text: "by my mind") and floats to her; 34.8 she lights up, glad. **37.2
  stamp:** punch in on Vayu: "FATHER NO. 2" / "VAYU DEV". [out: night wipe]
- **F1 39.2–43.4 · Kailash.** Shiva in meditation, snow falling. 39.3–43.3 "BUT THE SHIVA PURANA" / "TELLS ONE MORE
  SECRET…".
- **F2 43.4–48.0 · the energy.** 43.9 his eyes open, 44.6 a golden light forms between his hands, 46.6 it floats away.
  43.5–47.8 "LORD SHIVA SENT HIS OWN ENERGY" / "TO HELP SHRI RAM." [out: dawn wipe]
- **F3 48.0–53.2 · the seven sages.** Seven little rishis march along a dawn ridge holding one long leaf over their
  heads, the light riding on it. 50.4 the fourth trips, the light hops, everyone gasps, it lands safe. 48.1–53.0 "SEVEN
  SAGES CARRIED IT" / "ON A LEAF…" [out: leaf wipe]
- **F4 53.2–57.4 · the ear.** Anjana in prayer, eyes closed; a sage tips the leaf at her ear; 54.5 the light trickles
  in (it tickles: one eye opens); 55.5 she glows; the sages beam. 53.3–57.3 "…AND POURED IT" / "INTO ANJANA'S EAR."
- **57.4–59.6 stamp.** Shiva, smiling, a hand raised: "FATHER NO. 3" / "LORD SHIVA". [out: night wipe]
- **G 59.6–64.6 · the birth.** A cave at night, its mouth filling with gold light on a heartbeat. 59.7–64.3 "AND IN A
  CAVE," then 60.9 a burst and the baby is there: "HANUMAN WAS BORN." 61.6 a yawn; 62.7 his eyes open; he grins,
  hearts. The lullaby starts. [out: gold wipe]
- **H1 64.6–68.3 · the question.** The family picture: the baby in the middle, Maa Anjana and Kesari beside him, Vayu
  above on the right, Shiva above on the left in a soft light. He looks at Kesari (65.2), at Vayu (66.0), at Shiva
  (66.8), then at us, puzzled. 64.7–68.2 "SO WHICH FATHER" / "IS THE REAL ONE?"
- **H2 68.3–71.3.** "ALL THREE." (huge, gold): everyone cheers, hearts.
- **H3 71.3–77.3 · the Chalisa.** "YOU SING IT IN THE CHALISA:" then, one by one with a chime, each father lighting
  up as his name lands: 72.4 "SHANKAR SUVAN" (Shiva), 73.6 "KESARI NANDAN" (Kesari), 74.8 "PAVAN SUT" (Vayu). All
  three hold to 77.2. [out: peach wipe]
- **I 77.3–81.8 · the ask.** Frame 0's baby, three hearts for the three question marks. 77.4–81.7 "WHICH NAME DOES" /
  "YOUR FAMILY USE?" / "COMMENT IT!"
- **J 81.8–85.4 · next.** He stands, eight coloured lights circling him. 81.9–85.3 "NEXT: THE DAY HE GOT" / "8
  SUPERPOWERS!"
- **card 85.4–89.4.** `hsCard()` (the no-price Navadurga card): the three covers, "The Navadurga Set · OUT NOW", the
  logo, the rishikatha.com pill, "Check the link in bio", "Follow @therishikatha". It ends on the full card.

## Sound (tools/hanu1_sfx.mjs → assets/hanu1_sfx.wav → assets/hanu1_mix.wav at −16 LUFS)
Pops for the question marks, a harp bed and anklets in heaven, the curse zap, a falling whistle, the poof, footsteps,
the three "father" fanfares (the same call, a step higher each time), wind, rain and one far thunder on the mountain,
swirls, buzzy cartoon voices, the wisp, an om and a still pad on Kailash, the sages' pizzicato march and the trip,
chimes trickling into her ear, a heartbeat into the birth, the yawn and the giggle, a music-box lullaby under the
family picture and the Chalisa names, card pops. `ffmpeg -af loudnorm=I=-16:TP=-1.5:LRA=11` makes the mix.

## Facts used
- **Valmiki Ramayana, Kishkindha Kanda 66** (Jambavan to Hanuman; verse numbers as at valmikiramayan.net):
  - 8: the apsara Punjikasthala, known as Anjana, the wife of the vanara Kesari.
  - 9: famed for her beauty in the three worlds; by a curse (abhiśāpāt; the text does not say whose) born on earth
    among the vanaras; able to take any form at will (kāmarūpiṇī).
  - 10–11: daughter of the vanara chief Kunjara; once, in a human form, in garlands, ornaments and silk, she walked
    on a mountain top that looked like a rain cloud.
  - 12–15: the Wind god gently drew at her garment, saw her, was taken with her and, unseen, held her in his arms.
    (The reel shows this as a swirl of wind round her; nothing more.)
  - 16: Anjana, a woman of one husband: "who wishes to break my vow as a faithful wife?"
  - 17: Vayu: "I do you no harm; do not fear."
  - 18–19: "I have come to you by my mind (manasā); you will bear a son, strong and wise, … my equal in leaping and
    jumping."
  - 20: she was glad, and gave birth to him in a cave.
  - 29b–30: "you are Kesari's son (kesariṇaḥ putraḥ, kṣetraja) … and the Wind's own son (mārutasya aurasaḥ putraḥ),
    his equal in energy": Valmiki names both fathers in one breath (used in the Instagram caption and pinned comment).
- **Shiva Purana, Shatarudra Samhita 20** ("The incarnation of Hanumat", J. L. Shastri's translation):
  - 4: Shiva let his energy fall "for Rama's work". (Verse 3 gives the occasion, Vishnu's Mohini form, and verse 4 says
    semen; the reel says "his own energy" and leaves the occasion out: a kids' page.)
  - 5: the seven sages, urged by Shiva, placed it on a leaf.
  - 6: for Rama's work they poured it through the ear into Anjani (this text calls her Gautama's daughter; Valmiki
    says Kunjara's: neither is on screen).
  - 7: in time Shiva was born from it as Hanuman, in a monkey's body, of great strength.
  - 9, 37: "he was the incarnation of Shiva".
- **Hanuman Chalisa** (Tulsidas): chaupai 2 "Anjani putra Pavan sut nama", chaupai 6 "Shankar suvan Kesari nandan".
- Not said, because the texts do not say it: who cursed Punjikasthala or why; that the three accounts are one story
  (the reel says "the Shiva Purana tells one more secret" and names each source on screen).
- Performance only (no plot claims): the question marks, her puzzling at her tail, Kesari's flower and the hearts,
  Vayu peeking from a cloud, the wisp as the picture of "by my mind", the light forming between Shiva's hands, the sage
  who trips, the tickle, the yawn, the baby looking from one father to the next. The tease (8 boons) is Uttara 35–36.

## Cover, caption, pinned comment
`src/scenes/hanu1_cover.js` (`cover.html`): the baby in the middle with the three fathers round him, the orange
PART 1 pill over "HANUMAN JI HAS" / "3 FATHERS" (gold). The Instagram caption and the pinned comment are in
`out/hanu1_out/captions.txt`.
