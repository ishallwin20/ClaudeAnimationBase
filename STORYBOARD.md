# Bappa can't wait 3 seconds. His mother waited 3,000 years.

A 53.6-second vertical reel (1080×1920, 24 fps, bpm 90) for Rishi Katha's Navadurga picture books: why Parvati is called
Aparna, and how her tapasya made her Maa Brahmacharini (Navratri Day 2, Book 2). Starring Bappa, Parvati,
Brahmacharini (new shared character), a hooded stranger and Shiva. Scene: [src/scenes/aparna.js](src/scenes/aparna.js),
sets and props: [src/scenes/aparna_props.js](src/scenes/aparna_props.js), characters: [src/bappa.js](src/bappa.js),
[src/parvati.js](src/parvati.js), [src/brahmacharini.js](src/brahmacharini.js), [src/shiva.js](src/shiva.js), brand images:
`src/scenes/rk_images.js` (`picture()`), sound effects: [tools/aparna_sfx.mjs](tools/aparna_sfx.mjs) →
`assets/aparna_sfx.wav`. No voiceover: captions carry it.

```
Logline: Bappa can't wait three seconds for a modak, yet his mother lived on dry leaves for 3,000 years. Why? Princess
         Parvati wanted to marry Shiva, but the great yogi wouldn't open his eyes, so she left her crown and silks for a
         saffron robe, a rudraksha mala and a water pot. Fruits for 1,000 years, leafy greens for 100, dry bilva leaves for
         3,000, then not even a leaf: the gods named her APARNA. A stranger came to mock Shiva; she would not hear one
         word, and the stranger was Shiva himself, testing her. "From today, I am yours, won by your tapasya." Bappa,
         moved, gives his last modak to his mother. She is Maa Brahmacharini, Navratri Day 2, Book 2.
Hook:    frame 0 is Bappa (one subject, plain warm ground) with a modak at his mouth and "Bappa can't wait / 3 SECONDS /
         for a modak…" already up. He wolfs it in three chomps; at 1.6 the caption flips to "His mother lived on / DRY
         LEAVES / for 3,000 YEARS." and Bappa freezes mid-chew in a huge take.
World:   warm peach (Bappa) → pale snow-blue Kailash (the yogi who won't look) → saffron (the change) → four seasons round
         one clearing: gold summer → teal-grey rains → pale-blue winter → indigo night where she is the only light →
         gold dawn (APARNA) → dusky lilac (the stranger) → rose-gold with falling petals (I am yours) → peach (Bappa) →
         the brand card.
Motif:   FOOD THAT DISAPPEARS. Bappa's modak vanishes in 3 chomps (greed, comedy); her plate empties over 4,100 years
         (devotion) while her golden aura GROWS as the plate empties. One last bilva leaf lifts off the plate, flies past
         her and becomes the name APARNA ("not even a leaf"). The ending rhymes: same Bappa framing, his last modak, and
         this time he gives it away (on a bilva leaf).
Comment: three levers, an experiment (see "Comments" below): the guess beat "The gods gave her a new name. Can you
         guess it?" before APARNA; two hidden clues on the stranger (a snake tail, a crescent moon) for a pinned
         "spot both clues" comment; and an easy personal question over Bappa's gift: "What could YOU give up for one day?"
Text:    every caption sits inside Instagram's safe band (y 420–1500, left of x 930). Story reads (the plate, the clues,
         faces) also sit inside the band.
Arcs:    Bappa:        greedy bliss (chomp chomp) → the take (!!, cheeks full) → (insert) hugs his modak plate, sweating →
                       moved, teary → offers his last modak → shares it, happy
         Parvati:      hopeful, holding a garland → waves at Shiva, nothing → sad → DETERMINED → (her jewels fly off) →
                       becomes Brahmacharini → (end) as Mom: touched, breaks the modak in half
         Brahmacharini: serene (eyes closed) all through the penance; her gold aura grows as the plate empties → opens
                       her eyes for the stranger, polite → ANGRY for the only time in the film → turns away → surprised →
                       delight, blush, joins her palms
         Stranger:     smug, mocking → caught (clues) → POOF
         Shiva:        serene with eyes shut (won't look) → (revealed) eyes open, warm smile, hand raised in blessing
```

## Costumes (get these right)

- **Parvati the princess** (B, and as Mom in G): the shared `parvati()` as is: red silk saree with a gold border, green
  blouse, a gold mukut, jhumkas, a nath, green-and-gold bangles, sindoor. This is what she gives up.
- **Brahmacharini the tapasvini** (C to F, new shared character `src/brahmacharini.js`, built on Parvati the way
  `shailputri.js` is). Matches the Book 2 pages (saffron robe, rudraksha) and her Navadurga form:
  - a plain **saffron** cotton saree (bhagwa, `#E8873A`-ish, darker `#C5652A` folds), no gold border: only a thin darker
    saffron edge. Pallu over her left shoulder. A plain blouse in a deeper saffron.
  - **no jewellery at all**: no mukut, no jhumkas, no nath, no bangles, no anklets. In their place, rudraksha:
    a long **rudraksha mala** round her neck (brown beads, as on the cover), small **rudraksha bead earrings**, and a
    **rudraksha string wound round her topknot**.
  - **hair up in a high topknot** (a jata-style bun on top of the head, as on the cover and the tree-pose spread), a
    couple of loose strands. No braid.
  - a red bindi; no sindoor (she is not married yet).
  - **right hand (screen-left): a japa mala**, a loop of rudraksha beads hanging from her fingers, with a tassel.
    **Left hand (screen-right): a kamandalu**, a round copper-brass water pot with a spout and a loop handle.
  - **barefoot** (the feet peek under the hem when she walks).
  - `aura` 0..1: a warm gold halo of light behind her (`glow()`, plus a soft ring), growing with the penance.
  - `pray: 1`: both palms joined above her head (the tree-pose spread); the props are hidden then (mala over a wrist
    is fine). `oneFoot: 1`: standing on one foot: the drape kinks out at the knee to screen-right, one foot down.
- **The stranger** (F, a scene prop in `aparna_props.js`): a young wandering brahmachari, about Parvati's height, wrapped
  head to foot in a dusty ash-ochre shawl (`#A89778`, darker `#7E6F58`) with the hood up, a bamboo staff with a little
  cloth bundle. Fair, ordinary skin (`PRV.skin`), NOT blue: the disguise. Bushy brows, a smug grin. Two hidden clues:
  the **tip of a teal snake tail** (Vasuki's colours from shiva.js) curls out under the hem and flicks back, and a
  **small crescent moon glints** under the rim of the hood. Each is small and on screen ~1 s: findable on a rewatch.
- **Shiva** (B and the reveal in F): the shared `shiva()`, Vasuki and the moon visible.
- **Bappa** (A, D2, G): the shared `bappa()` with `modak()`.

## Time constants (shared by the scene and the SFX, in seconds of video time)

```js
// A hook (Bappa)
A0 = 0, CHOMP1 = .30, CHOMP2 = .70, CHOMP3 = 1.10, GULP = 1.38, HOOK2 = 1.60, TAKE = 1.72, A_OUT = 3.55, B0 = 4.0
// B princess and yogi
B_CAP1 = 4.15, P_STOP = 5.2, GARLAND = 5.4, WAVE0 = 5.85, WAVE1 = 6.45, FLAKE = 6.55, B_CAP2 = 6.35, P_SAD = 7.1,
P_DET = 8.0, B_CAP3 = 8.1, TAPASYA = 8.35, WIPE1 = 9.2, C0 = 9.6
// C the change
C_CAP1 = 9.85, CROWN = 10.0, EARRINGS = 10.5, BANGLES = 11.0, SWIRL0 = 11.5, SWIRL_FULL = 11.9, REVEAL = 12.0,
C_CAP2 = 12.25, PULLBACK = 13.85, D0 = 14.2
// D1 the seasons (each phase: card, then the food vanishes one item at a time on beats)
SUMMER = 14.2, YR1 = 14.4, FRUIT_GONE = [16.0, 16.45, 16.9, 17.3],
RAINS = 17.5, YR2 = 17.6, GREENS_GONE = [19.3, 19.75, 20.2],
WINTER = 20.5, YR3 = 20.6, BILVA_GONE = [22.6, 23.1],          // three leaves → one left
D2 = 23.8                                                        // Bappa insert
BAPPA_HUG = 24.05, BAPPA_CAP = 24.1, D3 = 25.2
// D3 night
NIGHT_CAP1 = 25.4, LEAF_LIFT = 26.2, AURA_BLOOM = 26.6, NIGHT_CAP2 = 27.2, NIGHT_CAP3 = 27.6, LEAF_CAM = 29.0, E0 = 29.4
// E the name
NAME_CAP1 = 29.6, GUESS = 30.1, APARNA = 31.5, APARNA_SUB = 31.8, F0 = 33.6
// F the test
STRANGER_IN = 33.65, F_CAP1 = 33.75, STRANGER_STOP = 34.9, P_EYES = 35.0, MOCK = 35.3, TAIL0 = 36.2, TAIL1 = 37.3,
MOON_GLINT = 36.8, ANGRY = 37.9, TURN_AWAY = 38.6, POOF = 39.4, SHIVA_REVEAL = 39.8, SHIVA_CAP = 39.85,
P_TURN_BACK = 40.0, P_DELIGHT = 40.7, YOURS = 41.3, PETALS = 41.3, G0 = 43.6
// G Bappa rhyme
G_CAP1 = 43.9, OFFER = 44.0, MOM_IN = 44.3, TAKE_MODAK = 44.9, BREAK = 45.3, HALF_BACK = 45.6, SHARE_CHOMP = 46.0,
QUESTION = 45.9, QUESTION_SUB = 46.3, HEART_IRIS = 47.4, CARD = 47.8
// Card
CARD_CAP = 48.0, COVER = 48.1, FAN = 48.5, LOGO = 49.1, SERIES = 49.4, PRICE = 49.8, PILL = 50.2, FOLLOW = 50.8, END = 53.6
```

## Shots

```
  A  0–4.0     [no transition in]  the hook
     Bappa medium close-up, front, plain warm peach ground (#F6D8C0 → a soft lighter spot behind him, nothing else).
     u ≈ 44, feet at y ≈ 1640 (off the bottom band), so his face sits at y ≈ 1050–1150, under the captions.
     reads: 0 (already up) "Bappa can't wait" (62) / "3 SECONDS" (118, gold) / "for a modak…" (60), y 470–700 ·
            the modak is at his mouth in his right hand, eyes greedy-happy ·
            .30, .70, 1.10 CHOMP ×3: the modak shrinks 100 → 65 → 30 → gone, crumbs spray, cheeks puff, a squash each ·
            1.38 GULP, a blissful squeeze ·
            1.60 the caption flips: "His mother lived on" (60) / "DRY LEAVES" (118, leaf gold-green #B9C46A) /
                 "for 3,000 YEARS." (76) (life to 3.9) ·
            1.72 TAKE: !!, he freezes mid-chew, cheeks still stuffed, eyes 'wide', a crumb falls from his lip (1.8–2.3) ·
            2.4–3.4 hold; slowly his eyes slide to the camera, 'O' mouth, a sweat drop ·
            3.55–4.0 a thought cloud swells above his head and grows to fill the frame (irisShape with a cloud outline,
            pale snow-blue inside): the cloud IS the transition into B
  B  4.0–9.6   [out of the thought cloud]  the princess and the yogi
     Kailash in pale snow-blue: a few soft snowy peaks low behind, a flat rock at right with Shiva sitting on it,
     serene, eyes CLOSED (u ≈ 26). Parvati (u ≈ 30) walks in from screen-left in her royal look with a marigold garland.
     reads: 4.15 "Princess Parvati wanted / to marry SHIVA." (life 2.0) · 4.2–5.2 she walks in, hopeful ·
            5.4 she holds the garland out to him, smiling · 5.85–6.45 she waves her hand in front of his face: nothing ·
            6.35 "But the great yogi wouldn't / even open his eyes." (life 1.65) · 6.55 one snowflake lands on his
            nose: he doesn't flinch (comedy beat) · 7.1 her face falls (sad), the garland droops ·
            8.0 DETERMINED: she clenches a fist, chin up · 8.1 "So she chose HIS path:" (60) / 8.35 "TAPASYA" (120 gold)
            (life to 9.5) · 9.2–9.6 a saffron brush wipe (brushWipe with saffron and gold) covers the frame
  C  9.6–14.2  [the wipe drags off]  the change
     Parvati big (u ≈ 50, framed knee-up), plain warm ground with a soft forest edge far behind.
     reads: 9.85 "She gave up her crown, / her silks, her palace…" (life 1.95) ·
            10.0 her mukut lifts off and arcs away out of frame (clink, sparkle) · 10.5 the jhumkas and nath fly off ·
            11.0 the bangles slide off her wrists · (each piece leaves on an arc, never pops; she keeps her eyes closed,
            calm) · 11.5–11.9 a saffron cloth ribbon spirals up round her (brush strokes, one ribbon) until it covers
            her · 12.0 under full cover she swaps to Brahmacharini · 12.0–12.3 the ribbon unwinds upward and off:
            saffron robe, topknot, rudraksha, mala, kamandalu; sparkles · 12.25 "…for a saffron robe, a rudraksha /
            mala and a water pot." (life 1.75) · she breathes, serene · 13.85–14.2 the camera pulls back fast (zoom
            1.6 → 1) and carries into D
  D1 14.2–23.8 [the camera carries]  four thousand years in one clearing
     A forest clearing. Brahmacharini (u ≈ 27) stands centre-right in the tree pose from Book 2: oneFoot, pray (palms
     above her head), eyes closed, her aura on. A small stone Shiva lingam at screen-left mid-ground. Foreground lower-
     left: a flat rock with a big leaf plate (a round patravali of stitched leaves) at y ≈ 1300, large enough to read
     every item. The year cards are captions, y 470–620. Only the sky, the light and the weather change per season
     (cross-fade the sky, 0.3 s).
     reads: SUMMER (gold sky, a big soft sun, heat shimmer):
              14.4 "1,000 YEARS" (130, gold) rolls up from 0 in .7 s (digits change each frame) / "only fruits and
              flowers" (56) (life to 17.4) · the plate: a mango, a banana, a pomegranate, a marigold ·
              16.0, 16.45, 16.9, 17.3 they vanish one by one (a puff, a pop)
            RAINS (teal-grey sky, rain streaks, a puddle shimmer):
              17.6 "100 YEARS" / "only leafy greens" (life to 20.3) · the plate: three green leaves (amaranth, spinach)
              · 19.3, 19.75, 20.2 they vanish
            WINTER (pale-blue sky, snow falling, snow settling on her shoulders and the lingam):
              20.6 "3,000 YEARS" / "only dry, fallen BILVA leaves" (life to 23.6) · the plate: three dry, brown,
              three-lobed bilva leaves · 22.6, 23.1 two vanish: ONE is left
            her aura steps up each season (.25 → .45 → .65); she never looks starved, she looks brighter.
            23.6–23.8 a fast whip pan right (streaks) into D2
  D2 23.8–25.2 [whip in]  insert: Bappa
     The hook framing again (same ground, u ≈ 44). Bappa has a PLATE PILED with modaks.
     reads: 24.05 he hugs the plate tight to his belly, eyes 'scared', sweat ×2, a shiver · 24.1 "3,000 YEARS?!" (110,
            gold) (life 1.0) · 24.9–25.2 a whip pan back (streaks) into D3
  D3 25.2–29.4 [whip in]  night: not even a leaf
     The same clearing at night (deep indigo, a few stars). The plate with ONE dry bilva leaf. She is the only light.
     reads: 25.4 "Then she gave up / even THOSE." (life 1.7) · 26.2 a breeze: the last leaf lifts off the plate,
            flutters up past her in a slow S-curve (eye-lead: everyone watches the leaf) · 26.6 her aura blooms wide
            (aura → 1, gold light pushes back the night) · 27.2 "No food. No water." (60) / 27.6 "Only “Om Namah
            Shivaya.”" (64, gold) (life to 29.2) · 29.0–29.4 the leaf turns and flies AT the camera until it fills the
            frame (match cut)
  E  29.4–33.6 [the leaf leaves frame]  the name
     Gold dawn. Close-up: Brahmacharini's head and shoulders (u ≈ 70), eyes closed, a soft smile, aura behind, the
     bilva leaf drifting slowly across in front of her (not over the face).
     reads: 29.6 "The gods gave her a new name." (58) / 30.1 "Can you guess it?" (84, gold) (life to 31.35) ·
            [this is the GUESS beat: hold it, nothing else happens, the leaf drifts] ·
            31.5 "APARNA" (150, Marcellus, gold, a pop with sparkles) / 31.8 "“she who gave up even a leaf”" (52)
            (life to 33.4) · the leaf drifts out of frame as the name lands · 33.3–33.6 a slow dissolve to dusk
            (a brush wipe in lilac and gold)
  F  33.6–43.6 [the wipe finishes]  the test
     The clearing at dusk (lilac). Brahmacharini (u ≈ 30) at centre-left, standing, mala and kamandalu in hand, eyes
     closed. The stranger (same height) walks in from screen-right in side view with his staff.
     reads: 33.75 "Then a stranger came…" (life 1.3) · 33.65–34.9 he walks in, stops, plants the staff ·
            35.0 she opens her eyes, polite, a small bow · 35.3 his words: "“Why waste your life on SHIVA? / He lives
            in graveyards, / wears snakes and ash!”" (54) (life 2.45) · he is smug, jabs a thumb back over his shoulder,
            laughs · 36.2–37.3 CLUE 1: a teal snake tail curls out under his hem, wiggles, whips back in ·
            36.8 CLUE 2: a crescent moon glints under the rim of his hood (0.5 s glow) ·
            37.9 ANGRY (the only time): her brows down, she raises a palm, "“Not one more word / against him!”" (72,
            #FF8A70) (life 1.45) · 38.6 she turns away (flip) and takes two steps left ·
            39.4 POOF: ash-grey smoke bursts over him (39.4–39.85), the shawl flies up and out of frame ·
            39.8 SHIVA sits on a rock where the stranger stood: eyes OPEN, a warm smile, Vasuki up, the moon bright ·
            39.85 "It was SHIVA!" (112, gold) / 40.15 "He was testing her." (56) (life to 41.2) · 40.0 she turns back:
            surprised · 40.7 delight, blush · 41.3 Shiva raises his hand in blessing: "“From today, I am yours, /
            won by your tapasya.”" (66) (life 2.15) · petals start falling, the sky warms to rose-gold, hearts rise
            from her · 41.9 she joins her palms · 43.3–43.6 a petal brush wipe (rose and gold)
  G  43.6–47.8 [the wipe drags off]  the rhyme: Bappa
     The hook framing exactly (same ground, same u, same spot). Bappa holds his LAST modak on a bilva leaf.
     reads: 43.9 "Bappa: “Maa, this one / is for you.”" (60) (life 1.85) · 44.0 eyes teary, moved; he lifts the leaf with
            the modak toward screen-left · 44.3 Parvati (Mom, royal look again, u ≈ 34, partly in frame from the left
            edge) leans in · 44.9 she takes it, touched · 45.3 she breaks it in half (crumb puff) · 45.6 gives half
            back · 46.0 they both eat, happy, hearts · 45.9 "What could YOU give up / for one day?" (78, gold) /
            46.3 "Tell us in the comments!" (50) (life to 47.6) · 47.4–47.8 a heart-shaped iris opens from Bappa's
            heart onto the card's peach
  Card 47.8–53.6 [the heart iris is the card; no fade out]
     Model on assets/last_slide_sample.png and the snake reel's card (git show ad/4-shiva-snake:src/scenes/snake.js).
     reads: 48.0 "Navratri Day 2: Maa Brahmacharini" (Marcellus, teal) / "Her story of never giving up is Book 2!"
            (Poppins) · 48.1 the Book 2 cover pops (big, centre) · 48.5 Books 1 and 3 fan out behind it ·
            49.1 the RK logo · 49.4 "The Navadurga Series" · 49.8 "Picture books · Ages 4–8 · Set of 3 for ₹600" ·
            50.2 the pill: rishikatha.com (orange) · 50.8 "Follow @therishikatha for more Navratri stories" ·
            hold to 53.6
  [no fade out: the last frame is the whole card]
```

Render: `node tools/aparna_sfx.mjs`, then `node render.mjs --frames --workers=4` and
`node render.mjs --encode --out=out/aparna.mp4` (picks up `PROJECT.audio`);
`--encode --audio=none --out=out/aparna_silent.mp4` for a copy to add music to on Instagram.

## Comments: the experiment

Our reels get views but few comments. This one tries four things at once (so next time we can keep what works):

1. **A guess beat inside the video** (E, 29.6–31.4): "Can you guess it?" held for 1.3 s before APARNA. People who know
   want to show it; people who don't comment their guess. It also raises retention (they wait for the answer).
2. **Hidden clues** on the stranger (a snake tail, a moon), on screen about a second each. Pin this comment from
   @therishikatha as soon as the reel goes up: "Did you spot the TWO clues that the stranger was Shiva? 👀 Tell us
   the timestamps!" It drives rewatches (watch time) and comments.
3. **An easy, personal question** at the end, tied to the story (Bappa gives up his modak): "What could YOU give up
   for one day?" Anyone can answer in one word (chai, my phone, sugar), and the answers are fun to read.
4. **Reply to every comment in the first hour**, with a question back where you can. Replies count as comments and
   tell Instagram the post is a conversation.

Optional: a comment-to-DM keyword ("Comment APARNA and we'll DM you the book link") works well for sales, but it needs
an auto-DM tool (e.g. ManyChat) or replying by hand, so it's in the caption only as a variant below.

## Instagram caption

Why is Maa Parvati called Aparna? 🌿 She lived on dry leaves for 3,000 years, then gave up even those.

Princess Parvati wanted to marry Shiva, but the great yogi wouldn't even open his eyes. So she left her crown and silks
for a saffron robe, a rudraksha mala and a water pot, and began her tapasya. For 1,000 years she ate only fruits and
flowers, for 100 years only leafy greens, for 3,000 years only fallen bilva leaves. Then she gave up even those, and
the gods named her Aparna: she who gave up even a leaf.

One day a stranger came to mock Shiva. She wouldn't hear a word. The stranger was Shiva himself, testing her: "From
today, I am yours, won by your tapasya."

This is Maa Brahmacharini, worshipped on Day 2 of Navratri. Her story of never giving up is Book 2 of our Navadurga
picture-book series (ages 4–8). Get the set of 3 for ₹600 at rishikatha.com (link in bio).

💬 Bappa gave up his modak. What could YOU give up for one day? Tell us below.
👀 Did you spot the two clues that the stranger was Shiva?
📌 Save this for Navratri Day 2, and share it with someone who never gives up.

#brahmacharini #maabrahmacharini #navratri #navratriday2 #navadurga #aparna #parvati #shivparvati #ganesha
#hindumythology #indianmythology #mythologyforkids #picturebooks #kidsbooks #rishikatha

Keyword variant (only with an auto-DM tool): replace the 💬 line with "💬 Comment APARNA and we'll DM you the link to
the books."
