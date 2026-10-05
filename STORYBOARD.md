# Why does the SCARIEST goddess ride a DONKEY?

A 54-second vertical reel (1080×1920, 24 fps, bpm 100) for Rishi Katha's Navadurga picture books: Maa Kalaratri,
the scariest form of Durga, rides a fluffy little donkey, and here is why. Navratri Day 7 (Saptami, Sat Oct 17 2026),
Book 7 ("The Fierce Dark Knight", coming soon). The card sells Books 1–3, a set of 3 for ₹500.
Scene: `src/scenes/kalaratri.js`, sets and props: `src/scenes/kalaratri_props.js`. Characters: the shared
`src/kalaratri.js`, `src/donkey.js`, `src/boy.js`, `src/nandi.js`, `src/bappa.js` (Mooshak). Brand images:
`src/scenes/rk_images.js` (`picture()`). Sound effects: `tools/kalaratri_sfx.mjs` → `assets/kalaratri_sfx.wav`.
No voiceover: the captions carry the story.

```
Logline: The scariest form of Maa Durga (night-dark skin, a third eye, fire breath, lightning round her neck and
         a garland of skulls) rides… a fluffy little donkey. She was made for the worst demon: every drop of his
         blood that touched the ground became another him. So Durga became the NIGHT, and not one drop landed.
         Her ride? A horse runs from a wolf. A donkey doesn't. The goddess who kills fear rides the one who won't
         run, and the humblest one. Her other name is SHUBHANKARI: scary to demons, gentle to her children.
Hook:    Frame 0 is ONE subject: a close-up of her face on a starry indigo night. The third eye glows and the
         lightning crackles. "The SCARIEST form of / MAA DURGA…" is already up. At .45 she snorts fire. At .9
         the camera pulls back fast: she is sitting side-saddle on a small grinning donkey. HEE-HAW. The caption
         adds "…rides a DONKEY?!"
World:   An indigo night with stars and her pale moon-halo → a maroon war night (Raktabija) → ink-black (she
         becomes the night) → a violet stage (the vahanas) → a moonlit blue pasture (the wolf) → a lamp-lit bedroom
         (Shubhankari) → the brand's peach (the card).
Motifs:  THE DROP: one red drop falls in slow motion (C), and later lightning zaps every drop before it lands.
         THE BRAY: the joke (A), the shock (D's lineup), the war-cry at the wolf. HER NECKLACE: the lightning that
         zaps (C) is the boy's soft night-light (E). THE ENDING RHYMES: frame 0 is her fierce face, and the
         crescent iris closes on her smiling face.
Comment: "Is your name KALI, KALIKA, SHYAMA or SHUBHA? / Comment your NAME below (or tag one!)" (3.3 s). This
         repeats the Aparna name effect. Pinned comment: "Shubhankari = the one who brings only good 🙏 Know a
         Shubha? Tag her!"
Text:    every caption and story read sits in Instagram's safe band: y 420–1500, left of x 930.
Arcs:    Kalaratri: fierce (A, B) → golden Durga, eyes shut → the night drains over her → fierce (C) → fond of
                    the donkey (D) → a warm smile for the boy (E, F)
         Donkey:    grinning idiot → an innocent blink and an ear flop → proud entrance → plants, brays, KICKS → proud →
                    bliss under her ear-scratch → licks the boy
         Raktabija: smug → delighted with his clones → panic as the drops zap → alone, gulp, "?" → poof
         Boy:       scared stiff under the blanket → startled → giggling → waving
```

## Time constants (shared by the scene and the SFX, video seconds)

```js
// A
CRACK0 = .15, FIRE0 = .45, PULL0 = .9, PULL1 = 1.5, GRIN = 1.55, BRAY_A = 1.65, LOOKDOWN = 2.4, BLINK = 2.8, WHIP_A = 3.9, B0 = 4.2
// B
NAME = 4.4, KAAL = 6.6, RATRI = 7.3, LABELS = [8.9, 9.5, 10.1, 10.7], WIPE_B = 11.6, C0 = 11.8
// C
WHY = 12.0, TWIRL = 13.2, ARROW = 14.0, DROP_LAND = 14.9, POPS = [15.4, 15.8, 16.2, 16.5, 16.8], BONK = 16.4,
DURGA = 17.0, INK0 = 17.4, EYE3 = 18.6, BOLT = 18.8, SLASH = 19.4, ZAPS = [19.6, 19.8, 20.0, 20.2, 20.4, 20.6],
ALONE = 21.0, FLASH = 21.4, D0 = 22.0
// D
LINEUP = [22.3, 22.7, 23.1, 23.5, 23.9], DONKEY_IN = 24.4, BRAY_D = 24.65, JAW = 24.9, PASTURE = 26.6, EYES = 27.0,
HORSE = 27.2, PLANT = 28.0, BRAY_W = 28.2, CREEP = 28.6, SPIN = 28.95, KICK = 29.1, TWINKLE = 29.8, FARMERS = 30.2,
RIDE_IN = 32.2, SCRATCH = 34.4, E0 = 36.6
// E
SCARY = 36.8, WINDOW = 37.4, SOFT = 37.9, SHUBH = 39.9, LICK = 40.8, DARK_LINE = 42.2, F0 = 44.4
// F + card
COMMENT = 44.5, WAVES = [44.9, 45.1, 45.3], IRIS = 47.8, CARD = 48.3, CARD_CAP = 48.5, COVER7 = 48.7, ROW13 = 49.4,
PRICE = 49.8, LOGO = 50.3, PILL = 50.6, FOLLOW = 51.1, END = 54.1
```

## Shots

```
A  0–4.2     [no transition in: frame 0 is a finished picture]  the hook
   reads: 0 (already up) "The SCARIEST form of" (64) / "MAA DURGA…" (120, gold) at y 470–575 · a close-up of her
          face (zoom 2.2, face at y ≈ 1150): the third eye glows, the lightning crackles (CRACK at .15) ·
          .45 a SNORT: fire jets from her nostrils and fireballs roll off · .9–1.5 a fast eased pull-back: she
          is side-saddle on the donkey · 1.55 he grins at us · 1.65 HEE-HAW (bray, ears flop) + "…rides a
          DONKEY?!" (100, coral) (all lines to 4.0) · 2.4 she looks down at him, deadpan · 2.8 he blinks up
          at her, innocent, one ear flops, "?" · 3.9 a whip pan right
B  4.2–11.8  [whip in]  who she is (on the donkey, medium, under the moon-halo)
   reads: 4.4 "Navratri Day 7:" (56) / "MAA KALARATRI" (118, gold) (to 6.6) · 6.6 "KAAL = dark" / 7.3 "RATRI =
          night" (90, gold) (to 8.8): the sky darkens, then the stars come out · 8.8 the camera pushes in to
          her upper body: four labels pop with leader lines and a TING each, and stay up together: 8.9 THIRD EYE
          (it flares) · 9.5 BREATH OF FIRE (a snort) · 10.1 LIGHTNING NECKLACE (it crackles) · 10.7 A GARLAND OF
          SKULLS (they rattle) · 11.6 a red brush wipe
C  11.8–22.0 [the wipe drags off]  why so scary: Raktabija
   reads: 12.0 "Why so scary?" (78) / "Because of ONE demon." (64) (to 14.0) · Raktabija struts in, smug ·
          13.2 he twirls his moustache · 14.0 an arrow pings off his arm and ONE bright drop falls in slow
          motion · "Every drop that touched the ground…" (60) (to 17.0) · 14.9 POP: a second him · "…became
          ANOTHER him." (78, gold) · 15.4–16.8 POP-POP-POP, 2→4→8→16 to the frame edges (one is tiny; two bonk
          heads at 16.4) · 17.0 cut: golden Durga, eyes shut, on the red night · "So Durga became" (60) /
          "the NIGHT." (120, gold) (to 19.4) · 17.4–18.8 ink drains down the sky and over her: the skin darkens,
          the hair goes wild, the arms fan out, 18.6 the third eye opens, 18.8 CRACK: the lightning and the skulls ·
          19.4 she slashes; drops spray off the clones and the lightning zaps every drop mid-air (ZAP ×6); the
          clones POOF · "Not ONE drop" (84) / "touched the ground." (64) (to 21.6) · 21.0 the original alone:
          a gulp, "?" · 21.4 a white flash and he's gone; his moustache floats down · 21.7 a white flash cut
D  22.0–36.6 [white flash]  the donkey
   reads: 22.2 a violet stage of gold pedestals; the camera trucks along the gods' rides with a harp TING each:
          Nandi, Mooshak, a swan, a peacock, a lion · "Gods ride LIONS," / "PEACOCKS, SWANS…" (60) (to 24.4) ·
          24.4 the donkey trots onto the last pedestal, HEE-HAW · "She picked a DONKEY." (100, gold) (to 26.6)
          · 24.9 the lion's jaw drops, the peacock's tail droops (a sad trombone) · 26.6 cut: a moonlit pasture,
          sheep huddled, the horse and the donkey · 27.0 two glowing eyes in the bush (a howl) · 27.2 the horse
          rears and BOLTS · "A HORSE runs from a wolf." (64) (to 30.1) · 28.0 "A DONKEY doesn't." (96, gold) ·
          he plants his feet, ears pinned, BRAY · 28.6 the wolf creeps out · 28.95 the donkey spins round ·
          29.1 KICK, THWACK: the wolf tumbles off over the hills · 29.8 a twinkle · 30.2 the sheep nuzzle him,
          hearts · "Farmers still keep donkeys" / "to guard their sheep." (56) (to 32.2) · 32.2 she rides in on
          him; he plants, proud · "The goddess who kills FEAR" (64) / "rides the one who won't RUN." (72, gold)
          (to 34.4) · 34.4 she scratches his ear, he leans in, bliss, a heart · "The FIERCEST goddess" (64) / "on
          the HUMBLEST ride." (84, gold) (to 36.4) · 36.4 a warm brush wipe
E  36.6–44.4 [the wipe drags off]  Shubhankari
   reads: a dim bedroom at night. The boy sits up in bed, the blanket to his nose, trembling; a coat on a hook
          throws a monster shadow on the wall · 36.8 "Scary to demons…" (64) (to 39.9) · 37.4 the window
          lights up: she leans in, the donkey's head beside her; the boy startles · 37.9 she smiles; her
          lightning softens to a warm night-light, the room glows and the monster shadow melts into a bunny ·
          "…GENTLE to her children." (84, gold) (to 39.9) · 39.9 "Her other name:" (56) / "SHUBHANKARI" (110,
          gold) / "the one who brings only GOOD." (56) (to 42.2) · 40.8 the donkey licks the boy's face; he
          giggles · 42.2 "The dark isn't scary" (70) / "when SHE is in it." (84, gold) (to 44.3)
F  44.4–48.3 [the camera eases back]  the comment beat
   reads: 44.5 "Is your name" (60) / "KALI, KALIKA," / "SHYAMA or SHUBHA?" (92, gold) / "Comment your NAME
          below (or tag one!)" (50) (to 47.8) · the three of them wave in turn · 47.8 a crescent-moon iris closes on
          her smiling face and opens on peach
Card 48.3–54.1 [the iris is the card; no fade out]
   reads: 48.5 "Navratri Day 7: Maa Kalaratri" (Marcellus, teal) / "The Fierce Dark Knight is Book 7!" · 48.7 the
          Book 7 cover pops, with an orange COMING SOON ribbon · 49.4 Books 1–3 pop in a row below it ·
          49.8 "OUT NOW: Books 1–3 · Set of 3 for ₹500" · 50.3 the RK logo · 50.6 the pill: rishikatha.com ·
          51.1 "Follow @therishikatha so you don't miss Book 7" · hold to 54.1
```

Render: `node tools/kalaratri_sfx.mjs`, then `node render.mjs --frames --workers=4`, then
`node render.mjs --encode --out=out/kalaratri.mp4` and `node render.mjs --encode --audio=none --out=out/kalaratri_noaudio.mp4`.
