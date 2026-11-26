# Ad 118 · "An OWL gave him the DARKEST IDEA in the Mahabharata"

The first **comic reel** (series plan: [COMIC_REELS.md](COMIC_REELS.md)). Painted, Bangers captions, synth SFX, no
voice, 52.6 s. It sells **CHIRANJEEVI · Issue 1: Ashwatthama** (the 48-page comic) from inside the story: the Painted
reel tells the night up to the gate of the Pandava camp, then the painting turns to ink and the comic's own pages take
over. A locked page, then the cover: *"The reel stops here. The comic doesn't."* No price anywhere (confirm with the
owner before adding one).

**Why this works as marketing.** Issue 1's site preview sold almost nothing (6 of 140, owner 20 Nov) because its first
pages were mood. This reel is the preview done right: a question in the first second, an event in every shot, and it
stops at the worst moment. The product is the only way to see what happens next. The pill "FROM THE COMIC ·
CHIRANJEEVI #1" is on screen for the first 9 s, so the viewer knows from the start that this is a comic.

Logline: a beaten warrior can't sleep; an owl kills a tree full of sleeping crows in front of him, and he knows what
he will do to the sleeping camp. We stop him at the gate.
World: night, indigo and black; the gem ice-blue; the owl's eyes yellow; the camp's fires orange; then the comic's own
colours. Colour arc: cold blue → fire orange at the gate → the comic.
Motif: eyes in the dark (the owl's in the hook, again over the crows, the owl in his eye, the thousand eyes at the gate).

## Shots (t in seconds; constants in `src/scenes/ashowl.js` and `tools/ashowl_sfx.mjs`)

| Shot | Time | What happens | Caption |
|---|---|---|---|
| A | 0–5.2 | HOOK, frame 0 finished: Ashwatthama sits awake under the banyan, the gem lit; two yellow eyes and an owl's shadow watch him from the dark. The eyes blink (1.7); his eyes slide to them (2.4); they go out (4.4). Ink wipe. | AN OWL GAVE HIM / **THE DARKEST IDEA** / IN THE MAHABHARATA (3 lines, 5.1 s) + pill |
| B | 5.2–9.8 | Wide: the banyan, the three men; Kripa and Kritavarma asleep on the bare ground. Moonlight finds each of the three (6.0, 6.6, 7.2). | THE KAURAVAS HAD LOST THE WAR. / THREE SURVIVORS HID UNDER A BANYAN. |
| C | 9.8–14.4 | Close: a snore drifts past; he hisses (12.0), the gem flares with rage (12.8), his eyes go up (13.6). | TWO OF THEM SLEPT. ONE COULDN'T: / **ASHWATTHAMA** |
| D | 14.4–19.0 | Cut on his look: tilt up into the canopy, crows asleep on every branch; two yellow eyes open in the dark (17.2); push in. | ABOVE HIM, THOUSANDS OF CROWS / SLEPT SAFE IN THE BANYAN. |
| E | 19.0–24.6 | The owl swoops; three strikes (20.2, 21.1, 21.9: flash, crow gone, feathers), then the rest in a wave (22.1–22.9); wide: feathers falling, the owl alone on top (23.3). | **THEN AN OWL CAME…** / AND KILLED THEM IN THEIR SLEEP. |
| F | 24.6–29.6 | Extreme close-up of his eye, the owl small in it; pull back; a slow cold smile (27.2), the gem flares (27.6). Source line. | "THIS BIRD HAS JUST TAUGHT ME / **HOW TO FIGHT."** |
| G | 29.6–34.0 | The field at night, the Pandava camp's fires far off. He turns to it (29.9), grips the bow (30.6), walks (31.2); the camera pushes to the gate (32.4) and something vast rises there with burning eyes (32.9). | ACROSS THE FIELD, / THE PANDAVA CAMP WAS ASLEEP. |
| H | 34.0–38.6 | Freeze. Ink spreads over the painting; **half a second of total silence**, then a boom (34.45) and the comic's p20 (the guardian at the gate) fills the frame, then settles into a page. | AT THE GATE, / **SOMETHING WAS WAITING.** |
| I | 38.6–46.4 | The pages swipe like a phone: p23 (Shiva: "Time has overtaken them"), p24 (he enters the camp), then a blurred page with a padlock: PAGE 29 OF 48 · ONLY IN THE COMIC (43.4). | WHAT HAPPENED THAT NIGHT / **IS TOO DARK FOR A REEL.** → **SO WE DREW IT AS A COMIC.** / 48 PAGES. ALL FROM THE MAHABHARATA. |
| J | 46.4–52.6 | The locked page swipes off; the comic's cover rises; "CHIRANJEEVI · ISSUE 1 · OUT NOW", the rishikatha.com pill, "Link in bio · Follow @therishikatha". A warm chord to the end. | THE REEL STOPS HERE. / **THE COMIC DOESN'T.** |

11 caption groups in 52.6 s; every two-line caption is up ≥ 3.5 s, the hook and the quote ≥ 4.5 s.

## Facts used (Mahabharata, critical edition, GRETIL; the comic's SCRIPT.md has the same verses)

| Beat | Source |
|---|---|
| The war lost; three survivors (Ashwatthama, Kripa, Kritavarma) ride into a forest | Shalya 9.64.38–40; Sauptika 10.1.1–6 |
| They lie down under a great banyan; the other two sleep on the bare ground | Sauptika 10.1.18–31 |
| Drona's son can't sleep, hissing like a snake, burning with rage | 10.1.32–33 |
| Thousands of crows asleep in the banyan, each on its own perch | 10.1.34–35 |
| A huge, terrible owl comes and kills the sleeping crows | 10.1.36–41 |
| "This bird has taught me how to fight" (the lesson: attack them asleep) | 10.1.44–52 |
| The Pandava camp asleep that night (the five brothers themselves were away with Krishna; the caption says "camp") | Sauptika 10.1.53–55, 10.8; Shalya ch. 61 (the brothers spend that night outside the camp) |
| At the camp's gate a vast being guards it (shown as a shadow; the comic's p20 shows it) | 10.6.1–9 |
| Shiva: "time has overtaken them" (comic p23) | 10.7.59–63 |
| He enters where there is no gate (comic p24) | 10.7.64–66, 10.8.9–10 |
| The gem on his forehead, born with him | 10.11.20, 10.15.28 |

The owl's look (tawny, ear tufts, yellow eyes) is a drawing choice; the text says huge, terrible to look at, fast
as Garuda (10.1.37). Nothing in the reel shows a death: crows vanish in feathers.

## Build
- `src/ashwatthama.js` (shared, for `main`): Ashwatthama in Painted on Narad's rig, matching the comic: cap, topknot,
  beard, hoops, kavacha, the glowing gem (`gem`, `gone`), bow, quiver; `ashGem()`; `?loop=ashwatthama`.
- `src/scenes/ashowl_props.js`: the night sky, the banyan with branch perches and the sleeping crows (`AO_CROWS`), the
  horned owl (`aoOwl`, the Lakshmi owl's rig recoloured with ear tufts), `aoEyes`, `aoOwlShadow`, `aoFeathers`,
  the sleepers, the camp and `aoGuardian`.
- `src/scenes/ashowl.js`: the scene. `src/scenes/ashwatthama_pages.js`: the comic pages as data URIs, made by
  `node tools/comic_pages.mjs ashwatthama 01,17,20,23,24 29` (a shared tool, for `main`).
- `tools/ashowl_sfx.mjs` → `assets/ashowl_sfx.wav`, loudnorm → `assets/ashowl_mix.wav`.
- Cover: `node render.mjs --page=cover.html --stills=0 --out=out/ashowl_cover` (`src/scenes/ashowl_cover.js`).
- Deliverables: `out/ashowl_out/` (ashowl.mp4, cover.png, captions.txt).
