# The SCARIEST baraat in history

A 51.2-second vertical reel (1080×1920, 24 fps, bpm 100) for Rishi Katha's Navadurga picture books: Shiva's baraat
scares the bride's mother into a faint, and the bride becomes Maa Chandraghanta (Navratri Day 3, Tue Oct 13 2026,
Book 3). Starring a dhol-wala ghost, Queen Menavati, Shiva on Nandi, four ganas, Parvati and Chandraghanta.
Scene: `src/scenes/baraat.js`, sets and props: `src/scenes/baraat_props.js`. Characters: `src/shiva.js`, `src/nandi.js`,
`src/parvati.js`, plus two new shared ones, `src/menavati.js` and `src/chandraghanta.js`. Brand images:
`src/scenes/rk_images.js` (`picture()`). Sound effects: `tools/baraat_sfx.mjs` → `assets/baraat_sfx.wav`. No voiceover:
the captions carry the story.

```
Logline: The scariest baraat in history: Shiva came to his wedding in ash, with snakes for garlands and ghosts for guests,
         and the bride's mother fainted. Everyone was scared, except the bride. She became Maa Chandraghanta: ten
         arms and a moon-bell on her forehead. Her bell silenced every fear, and with ONE look she gave the groom a glow-up.
         Mom fainted again, this time from love.
Hook:    frame 0 is ONE cute-spooky ghost caught mid-dance with a skull-faced dhol, on a plain dusky-violet ground, with
         "The SCARIEST / BARAAT / in history" already up. DHAM, DHAM: by 1.9 s the queen at the door has fainted
         flat, and at 2.05 the caption reads "Her mother FAINTED. / It was SHIVA'S baraat."
World:   dusky violet night, lit only by diyas and torches (the baraat; fear) → a burst of GOLD (her courage) → rose-gold
         with falling petals (the wedding) → the brand's peach (the card).
Motifs:  NOISE vs THE BELL. The baraat is the dhol's DHAM (it opens the film); her bell's GHANTAAA is the climax, and
         it stops the dhol-wala's sticks mid-hit. THE FAINT: the queen faints from fear (A) and again from love (E).
         The dhol ghost from frame 0 is baraati #2, and he is the first to bow.
Comment: "Which baraati are YOU? Comment 1, 2, 3 or 4": a one-digit comment that says something about the viewer, and
         the four were numbered as they were introduced in B. Pinned comment: "I'm #3, the food one 😅 which are you?"
Text:    every caption sits inside Instagram's safe band (y 420–1500, left of x 930). Story reads (the faint, the
         baraatis, her forehead) also sit inside the band.
Arcs:    Ghost #2:   blissful dancing → peeks at the fainted queen "?" → (B) proud drumming → (D) sticks freeze → bows
         Menavati:  proud, smiling with the aarti thali → SCARED take → faints flat → dizzy, sits up → ANGRY, arms
                    crossed, turns away → (E) sees the groom: heart eyes → faints again, blissfully
         Shiva:     serene on Nandi, ash puffs off him → (D) a soft smile at her → (E) one raised eyebrow from her: '?',
                    a sweat drop, a gulp → POOF → the jewelled groom, a proud little nod
         Parvati:   calm → looks at her mother (sad) → looks at the baraat: DETERMINED → eyes closed → Chandraghanta:
                    fierce-serene → rings the bell → (E) raises ONE eyebrow at Shiva → (F) back to the bride: bliss
```

## Costumes and cast (get these right)

- **Chandraghanta** (D, E; new shared character `src/chandraghanta.js`, built on Shailputri the way brahmacharini.js is).
  Match the Book 3 cover (`assets/rk/book3.jpg`, "The Fierce Protector"):
  - a coral-rust saree with a cream-and-sky-blue pallu across the chest and a gold border.
  - a tall gold mukut with a gold halo ring behind the head.
  - an orange marigold mala, gold bangles stacked up each forearm, a gold necklace.
  - long dark hair down her back.
  - THE MOON-BELL: a gold half-moon shaped like a bell (a ghanta silhouette: a dome, a lip, a small clapper) at the
    base of the mukut, centred over her forehead, with its own glow. It must read at u ≈ 30.
  - TEN ARMS: two front arms plus four pairs fanned behind her shoulders like a halo of arms.
    - The front right hand (screen-left) holds a **ghanta bell**, and the front left (screen-right) is raised in
      abhaya (palm out).
    - The fan carries, top to bottom: trishul and lotus · gada and bow · sword and arrow · kamandalu and japa mala.
    - `arms` 0..1 fans them out pair by pair (each pair swings out from behind her on an arc with a backOut settle).
    - `ring` (the swing of the front bell) and `browL` / `browR` (-1..1, so ONE eyebrow can rise).
    - `aura` 0..1 gold light, drawn first, as in brahmacharini.js.
  - No tiger. The cover has none, and the ten arms and the bell are the spectacle.
- **Queen Menavati** (A, C, E; new shared character `src/menavati.js`, built on Parvati). Parvati's mother, a queen:
  - a deep plum saree (`#6B2F5E`, folds `#4E2045`) with a wide gold border and a gold pallu.
  - a wider queen's crown, hair in a low bun with **two silver-grey streaks** at the temples, kohl, big jhumkas, a nath,
    and red sindoor. Same chibi proportions as Parvati, a touch rounder in the cheeks.
  - `thali` (default true): a brass aarti thali held in both hands at the waist, with a diya flame (glow), marigold
    heads and a little kumkum bowl.
  - `faint` 0..1: she goes stiff as a plank and tips over backward to screen-left, pivoting at her feet (0 = upright,
    1 = flat on the floor). In between, she is propped on an elbow. `crossed` 0..1 crosses her arms (and drops the thali).
- **Shiva** (B, D, E, F): the shared `shiva()` in lotus pose, sitting on Nandi's back (at `nandiSeat`). New options in
  shiva.js:
  - `ash` 0..1: pale ash smears on the arms, chest and cheeks, and a dusting on the jata.
  - `groom` 0..1: the glow-up. A gold crown round the bun (the moon stays), a jewelled gold necklace over Vasuki, gold
    armbands, a thick marigold-and-rose garland, and a yellow silk shawl over both shoulders. It cross-fades under the
    POOF.
- **Nandi** (B, D, E): the shared `nandi()` with his garland, walking in B.
- **Parvati the bride** (C, F): the shared `parvati()` (red saree, gold border: already bridal).
- **The ganas** (scene props in `baraat_props.js`): flat-painted, rounded, kid-friendly and cute, never gory. Each is one
  outline where possible, with Clawd's eyes and mouths through `eyes()` / `mouth()` so `emotions()` can drive them.
  - **#1 the nagin dancer**: a squat sea-green imp with stubby horn nubs, a pot belly and a tiny dhoti. Both hands are
    joined over his head as a hood, his body swaying, and a real cobra beside him rears and sways in sync.
  - **#2 the dhol-wala** (the hook ghost): a pale lilac-blue sheet ghost (`#B9B6E8`, shade `#8E89C9`) with a wavy tail
    instead of legs, big happy eyes and blush, and a red bandhani pagdi on top. A barrel dhol on a strap has a painted
    cartoon-skull face on its drumhead (round eyes, a grin: cute, not gory), and he holds two curved sticks.
  - **#3 the foodie**: a round plum-purple bhoot with an ENORMOUS mouth. A gold laddoo tower on a plate goes in, whole.
  - **#4 the selfie bhoot**: a tall, thin, sage-grey ghost holding up a phone. FLASH. The phone screen shows the
    procession behind him, but he isn't in it, and he does a confused "?" take.

## Time constants (shared by the scene and the SFX, in seconds of video time)

```js
// A hook
DHAM1 = .35, DHAM2 = .75, WHIP_A = 1.05, MENA_IN = 1.25, GHOST_POP = 1.45, MENA_TAKE = 1.6, FAINT0 = 1.85,
FLOOR = 2.15, THALI_LAND = 2.6, CAP_A2 = 2.05, PEEK = 2.75, CAP_A3 = 3.3, A_OUT = 4.0, B0 = 4.4
// B the baraat roll call (the camera trucks left along the procession; each stop is a beat)
SHIVA_CAP = 4.6, HOOF = [4.8, 5.4, 6.0, 6.6], STOP1 = 7.0, NAGIN = 7.15, BADGE1 = 7.2,
STOP2 = 9.2, BADGE2 = 9.4, DHOL_HITS = [9.5, 9.9, 10.3, 10.55, 10.8],
STOP3 = 11.4, BADGE3 = 11.6, GULP = 12.5, BURP = 13.1,
STOP4 = 13.6, BADGE4 = 13.8, SNAP = 14.4, CHECK = 14.6, Q4 = 14.9, B_OUT = 15.4, C0 = 15.8
// C the refusal
SIT_UP = 16.0, MENA_SEES = 16.4, REFUSE = 16.7, TURN_AWAY = 17.6, BRIDE_IN = 18.2, CAP_C2 = 18.6, BRIDE_LOOK = 19.0,
CAP_C3 = 19.4, BRIDE_DET = 19.6, EYES_SHUT = 20.4, D0 = 21.0
// D the bride
MOON0 = 21.3, BURST = 22.0, REVEAL = 22.35, ARMS = [22.45, 22.65, 22.85, 23.05, 23.25], NAME_CAP = 22.5,
D2 = 24.7, RING = 24.9, RINGS = [24.9, 25.2, 25.5], STICKS_FREEZE = 25.0, CAP_D2 = 25.0, CAP_D3 = 25.7, BOW = 25.9,
D3 = 27.0, CHANDRA = 27.2, GHANTA = 28.6, D_OUT = 29.6, E0 = 30.0
// E the glow-up
CAP_E1 = 30.2, BROW = 30.5, SHIVA_Q = 30.95, GULP_S = 31.3, POOF = 31.6, GROOM = 32.1, CAP_E2 = 32.3, NOD = 32.8,
WHIP_E = 33.5, MENA_HEART = 33.8, FAINT2 = 34.25, CAP_E3 = 34.1, E_OUT = 35.3, F0 = 35.6
// F the wedding + the comment beat
GARLAND = 35.9, PETALS = 36.2, CAP_F1 = 36.1, LINEUP = 37.7, CAP_F2 = 37.8, WAVES = [38.0, 38.15, 38.3, 38.45],
BELL_IRIS = 39.3, CARD = 39.8
// Card
CARD_CAP = 40.0, COVER = 40.1, FAN = 40.5, LOGO = 41.1, SERIES = 41.4, PRICE = 41.8, PILL = 42.2, FOLLOW = 42.8,
END = 45.6
```

## Shots

```
  A  0–4.4     [no transition in: frame 0 is a finished picture]  the hook
     A1 (0–1.05): the dhol ghost, medium close (≈ 560 px wide), centred, its pagdi top at y ≈ 900 and its tail at
     y ≈ 1480, on a plain dusky-violet ground (#4A3F78 → a soft lighter spot #6A5C9A behind him). Nothing else.
     reads: 0 (already up, age offset) "The SCARIEST" (78) / "BARAAT" (150, gold #FFC94A, Marcellus) / "in history"
            (64), y 480–720 · the ghost is caught mid-bounce, eyes shut in bliss, sticks raised ·
            .35 DHAM (a squash on the hit, a ring of painted "sound" arcs off the drum) · .75 DHAM (bigger) ·
            1.05 a whip pan RIGHT (.2 s smear streaks)
     A2 (1.05–4.4): the palace door at night: a carved arch in warm sandstone at screen-left, a marigold toran, two diyas
     (glow). Menavati (u ≈ 34) stands in the doorway, centre-left, holding the aarti thali, proud and smiling.
     reads: 1.25 she is smiling, the thali diya flickering · 1.45 the ghost pops up from the bottom-right edge
            beside her (a backOut rise) with a DHAM, eyes wide and friendly ("Hi!") · 1.6 TAKE: her eyes go 'wide', !!,
            hair streaks stand up · 1.85–2.15 she goes stiff and tips straight back like a plank to screen-left:
            THUD, a dust puff · 1.9–2.6 the thali flies up, spins on an arc and lands flat on her tummy, CLANG, and
            the diya stays lit (a gag) · 2.05 the caption flips: "Her mother FAINTED." (76) / 2.35 "It was SHIVA'S
            baraat." (64, "SHIVA'S" gold) (life to 3.2) · 2.75 the ghost leans over her: "?" · 3.3 "Wait till you
            see what" (56) / "the BRIDE did…" (84, gold) (life to 4.9) · 4.0–4.4 the camera pulls back and pans
            right, past the ghost, onto the road (it carries into B)
  B  4.4–15.8  [the camera carries]  meet the baraatis
     The road to the palace at dusk: violet sky, a few torches (glow) along the back, a flat dusty road at y ≈ 1350.
     The camera trucks LEFT along the procession and stops at each baraati (an eased move, with a small overshoot at
     each stop). Each baraati is introduced with a round gold badge (#1…#4, a painted number, a pop) and a caption.
     reads: 4.4–7.0 Shiva on Nandi walks in from screen-right (Nandi u ≈ 24, Shiva seated on his back): serene,
            ash on, Vasuki waving, a puff of ash at every hoof-fall · 4.6 "The groom came in ASH," (60) / 5.3 "with
            SNAKES for garlands" (60) / 6.0 "and GHOSTS for guests." (66, gold) (life to 6.9) ·
            7.0 STOP 1: "1 · the NAGIN DANCER" (badge + 64) (life to 9.0) · the imp sways into the nagin dance, the
            cobra beside him mirrors it, and they glance at each other, delighted ·
            9.2 STOP 2: "2 · the DHOL-WALA" (life to 11.2) · our hook ghost, drumming like mad on 5 beats, eyes shut ·
            11.4 STOP 3: "3 · came only for the FOOD" (life to 13.4) · the bhoot eyes the laddoo tower (12.0), opens
            his huge mouth, GULP: the whole tower is gone (12.5), the cheeks bulge, then a little BURP puff (13.1) ·
            13.6 STOP 4: "4 · not in his own SELFIE" (life to 15.6) · phone up, a duck face, FLASH (14.4) · he
            checks the screen: just the road and torches, no him (the screen is big and readable: ≈ 220×380 px) ·
            "?" and a scratch of the head (14.9) · 15.4–15.8 a whip pan LEFT, on toward the palace, to the door (streaks)
  C  15.8–21.0 [whip in]  the refusal
     The door again (the A2 set), now with some baraatis peeking in at the right edge.
     reads: 16.0 Menavati sits up, propped on an elbow (faint 1 → .6), swirl eyes, the thali still on her tummy ·
            16.4 she sees them (lookX right): her face drops · 16.7 ANGRY, she's up (faint → 0), arms crossed, a huff:
            "“I will NOT give my daughter" (60) / "to HIM!”" (90, #FF8A70) (life to 18.4) · 17.6 she turns away (flip),
            chin up · 18.2 Parvati, the bride (u ≈ 34), walks in from the door at screen-left and stops centre ·
            18.6 "Everyone was scared." (60) (life to 20.6) · 19.0 she looks at her mother: sad · 19.4 "Except the
            BRIDE." (90, gold) · 19.6 she turns to look at the baraat: DETERMINED, chin up · 20.4 she shuts her eyes,
            serene · 20.4–21.0 the camera pushes in on her face (the zoom carries into D)
  D  21.0–30.0 [the push carries]  Maa Chandraghanta
     D1 (21.0–24.7) the transformation. A medium-close shot of her (u ≈ 40, framed from the knees up). The violet night
     behind her goes GOLD.
     reads: 21.3 a glint on her forehead: the half-moon bell draws itself in gold, glowing (eye-lead: the only bright
            thing) · 22.0 BURST: a gold flash with a swirl of marigold petals spiralling up round her (one ribbon, as
            in Aparna's change) until it covers her · 22.35 under full cover she swaps to Chandraghanta; the petals
            fly off · 22.45–23.25 her arms fan out pair by pair (5 clinks, a glint on each weapon), backOut ·
            22.5 "MAA" (70) / "CHANDRAGHANTA" (118, gold, Marcellus) (life to 24.5) · her eyes open: fierce-serene ·
            the aura blooms
     D2 (24.7–27.0) [a cut on action: she raises the bell]  the bell. Wide: she stands on a step at screen-left, gold;
     the baraat at screen-right (Shiva on Nandi at the back, ganas at the front, #2 nearest, sticks up).
     reads: 24.9 she rings the bell: GHANTAAA, and gold rings sweep across the frame (3 rings) · 25.0 #2's sticks
            freeze mid-hit, a DHAM that never comes (the silence is the gag) · 25.0 "Her bell rang out…" (60) /
            25.7 "and every FEAR went silent." (78, gold) (life to 26.9) · 25.9 the ganas bow low, one after another
            (offset, never in sync); Shiva smiles softly
     D3 (27.0–30.0) [a push in to her forehead]  the name. Close-up (u ≈ 80): her face and the moon-bell.
     reads: 27.2 "CHANDRA" (110, gold) / "= the moon" (56) · the bell's crescent glows (the moon part) ·
            28.6 "GHANTA" (110, gold) / "= the bell" (56) · the moon-bell rings once (life to 29.5); both are captioned low,
            y 1330–1430, under her chin · 29.6–30.0 a
            whip pan right (streaks) to Shiva
  E  30.0–35.6 [whip in]  the glow-up
     A two-shot: Chandraghanta at screen-left (u ≈ 30, half in frame), Shiva on Nandi at centre-right (Nandi u ≈ 26).
     reads: 30.2 "Then she gave the groom" (60) / "ONE look." (100, gold) (life to 31.5) · 30.5 she raises ONE
            eyebrow, slowly, and her eyes slide down his outfit and up again · 30.95 Shiva: "?" → a sweat drop, a gulp
            (31.3) · 31.6 POOF: an ash cloud bursts over him and Nandi (a big round cloud, sparkles) · 32.1 the cloud
            clears: Shiva the GROOM (crown, jewels, garland, silk), sparkles · 32.3 "GLOW-UP." (110, gold) / "The most
            handsome groom ever." (56) (life to 33.4) · 32.8 he gives a proud little nod · 33.5 a whip pan LEFT to the
            door: Menavati, mid-huff, peeks back over her shoulder · 33.8 heart eyes, a rosy flush, hearts pop ·
            34.1 "Mom fainted AGAIN." (78) / "(happily)" (52) (life to 35.3) · 34.25 she swoons back (faint → 1), a
            soft landing, eyes happy · 35.3–35.6 a petal brush wipe (rose and gold)
  F  35.6–39.8 [the wipe drags off]  the wedding and the comment beat
     Rose-gold dawn, falling petals. Shiva (the groom, seated on a low decorated platform, not on Nandi) at centre-right;
     Parvati the bride at centre-left.
     reads: 35.9 she leans in and lays the garland round his neck (it touches); he smiles, eyes closed · 36.1
            "Navratri Day 3:" (56) / "Maa Chandraghanta" (90, gold) / "who turns fear into COURAGE." (56) (life to
            37.5) · 37.7 the four baraatis pop up in a row in the foreground (u small, ≈ 200 px tall each), badges 1–4
            · 37.8 "Which baraati are YOU?" (84, gold) / "Comment 1, 2, 3 or 4" (64) (life to 39.3) · each waves in
            turn (offset) · 39.3–39.8 a bell-shaped iris (the ghanta silhouette) closes on the couple and opens on
            the card's peach
  Card 39.8–45.6 [the bell iris is the card; no fade out]
     Model on assets/last_slide_sample.png and the Aparna card (git show ad/5-book2-aparna:src/scenes/aparna.js).
     reads: 40.0 "Navratri Day 3: Maa Chandraghanta" (Marcellus, teal) / "The Fierce Protector is Book 3!" (Poppins) ·
            40.1 the Book 3 cover pops (big, centre) · 40.5 Books 1 and 2 fan out behind it · 41.1 the RK logo ·
            41.4 "The Navadurga Series · Book 3 of 9" · 41.8 "Picture books · Ages 4–8 · Books 1–3 for ₹600" ·
            42.2 the pill: rishikatha.com (orange) · 42.8 "Follow @therishikatha for all 9 forms" · hold to 45.6
  [no fade out: the last frame is the whole card]
```

## Sound (tools/baraat_sfx.mjs)
Dense in the hook. Two dhol DHAMs (a low thud + a slap), the whip whoosh, a boing pop for the ghost, the take squeak, a
plank thud, the thali spin (a metallic whirr) and CLANG, and the "?" plink. In B: a hoof clop + ash puff on each
HOOF, a been-like wah for the nagin dance, the DHOL_HITS, a huge GULP and a small burp, a shutter click + flash. In C: a
dizzy wobble and a huff. In D: a rising shimmer, a gold burst, 5 clinks, then the big bell GHANTAAA (`bell()`, long
tail, sitting over a sudden drop of everything else), the missing DHAM (silence), and soft thumps as the ganas bow.
In E: a squeak for the eyebrow, a gulp, a POOF, a sparkle chord, then heart pops and a happy swoon slide. In F: petals
shimmer, a bell iris ding, and a card ding.

Render: `node tools/rk_images.mjs` (if needed) and `node tools/baraat_sfx.mjs`, then `node render.mjs --frames
--workers=4` and `node render.mjs --encode --out=out/baraat.mp4`; also `--encode --audio=none --out=out/baraat_silent.mp4`.

## As built (notes from review)
- The hook caption leaves at the whip (1.1 s): the faint reads with no text on top of it.
- No tiger (the Book 3 cover has none). The C → D1 push lands on her face; the swap to Chandraghanta happens under a
  petal swirl and a gold flash at 22.35.
- The procession goes LEFT throughout B (toward the palace), so the whip out of B continues left.

## Instagram caption

Why does Maa Chandraghanta have a bell on her forehead? 🔔 It all began with the scariest baraat in history.

When Shiva came to marry Parvati, he arrived smeared in ash, with snakes for garlands and ghosts, ganas and bhoot-pret
for guests. Her mother, Queen Menavati, took one look and fainted. "I will NOT give my daughter to him!"

Everyone was scared, except the bride. Parvati became Maa Chandraghanta: ten arms, a fearless heart, and a half-moon
shaped like a bell (chandra + ghanta) on her forehead. The sound of her bell silenced every fear. Then, with one look,
she asked her groom to come as a groom should, and Shiva appeared as Chandrashekhara, the most handsome groom the
world had seen. (Mom fainted again. Happily.)

Maa Chandraghanta is worshipped on Day 3 of Navratri: the goddess who turns fear into courage. Her story is Book 3 of
our Navadurga picture-book series for ages 4–8. Get the set of 3 for ₹600 at rishikatha.com (link in bio).

💬 Which baraati are YOU? 1, 2, 3 or 4? Tell us below (and tag your #2 😄)
📌 Save this for Navratri Day 3, and share it with the friend who'd be in this baraat.

#chandraghanta #maachandraghanta #navratri #navratriday3 #navadurga #shivparvati #shivavivah #mahadev #parvati
#hindumythology #indianmythology #mythologyforkids #picturebooks #kidsbooks #rishikatha

Pinned comment (from @therishikatha, right after posting): "I'm #3, the food one 😅 which baraati are you?"
Reply to every comment in the first hour, with a question back where you can.

## Revision 1 (owner's notes)
Four reads felt fast, so the scene now runs on its own clock with holds (`WARPS` in baraat.js, mirrored in
baraat_sfx.mjs): scene 2.85–3.25 plays over +1.8 s ("Her mother FAINTED. / It was SHIVA'S baraat."), 3.6–4.0 over
+1.0 s ("Wait till you see what the BRIDE did…"), 6.4–6.7 over +1.3 s ("and GHOSTS for guests."), 38.5–39.3 over +1.5 s
("Which baraati are YOU?"). The film is now 51.2 s; the time constants above are scene time. Shiva's name has its own
big gold line in the hook ("SHIVA'S") and in the roll call ("SHIVA / came in ASH,"), and he and Nandi ride bigger and
closer in B (Nandi u 36, Shiva u 22).
