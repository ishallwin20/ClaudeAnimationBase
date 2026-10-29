# Ad 60: "Baby HANUMAN was SO naughty, the rishis CURSED him!" (Bal Hanuman, Part 2)

A ~70 s Painted reel with Bangers captions, no voiceover, retro cartoon SFX, and music only where it helps: a gentle
lullaby when he turns gentle, and a heroic swell when he remembers. It's the sequel to the Bal Hanuman sun reel
(reel/bal-hanuman-sun), and it ends on the Books 1–3 card (ad 59's).

```
Logline: After the gods' boons, baby Hanuman is unstoppable and the ashram pays for it, until the rishis make him forget
         his strength "for a long, long time". Years later, at the ocean, old Jambavan reminds him who he is.
Why it should travel: everyone knows Hanuman forgot his powers and Jambavan reminded him, but almost nobody knows WHY.
         The answer is the cutest thing in Valmiki: he was a naughty baby. A chubby baby wrecking an ashram while
         patient rishis twitch, a soft redemption, then an epic rise. "Known yet unknown."
Hook:    Frame 0: Bal Hanuman sits in a sunny ashram clearing, big innocent eyes at us, tail curled behind him, a broken
         yagna ladle peeking out from behind his back. Caption up: "BABY HANUMAN WAS SO NAUGHTY," / "THE RISHIS CURSED
         HIM!" (gold).
World:   a sunny forest ashram (the Ramayan kit's ashram, morning gold) → the same ashram, mischief bright → a cooler
         stern light for the curse → a warm honey glow when he turns gentle → a day-night time-lapse → the ocean shore at
         dusk (Lanka a speck of gold on the horizon) → gold light pouring out of him as he rises → the ashram again → the
         peach card.
Motif:   THE GRIN. His mischievous grin at us in frame 0 comes back on grown Hanuman as he towers over the sea, right
         before the leap: the naughty baby is still in there. The broken ladle opens and closes the reel.
Arc:     sheepish → proud (boons) → mischief, gleeful (the pranks) → angelic (to his parents) → mischief again → stunned
         (the curse), deflated → gentle, loving → (grown) quiet, lost → wonder (the memory) → mighty → the grin.
Ending rhyme: frame 0's ashram, the sheepish baby with the broken ladle, is the ask shot; the grin rhymes in the rise.
```

## Characters
- **Bal Hanuman** (shared, `src/bal_hanuman.js`): sit, stand, swinging upside down from his tail (rot = π, hung from
  the tail tip), `glowK` for the boons, `tail: 'droop'` after the curse.
- **Hanuman grown up** (shared, `hanuman()`): sitting on a rock (`sit: 1`, no gada), standing, growing, leaping.
- **Jambavan** (NEW, shared on main: `src/jambavan.js`): the old king of the bears on Narad's rig with a bear's face:
  dark brown fur, round ears, a cream muzzle, white bushy brows and a white beard (he's the eldest), a maroon dhoti, a
  rudraksha mala, a knobbly staff. narada.js gets a `face(u, sw, J, INK, hx, o)` hook (drawn instead of the head, the
  way the monkey face is) so other animal elders can use the rig.
- **The rishis**: `valmiki()` recoloured: three meditating sages (sit), two of them the cursing elders (Bhrigu's and
  Angiras's lines).
- **Maa Anjana** (`parvati()` + a forest-green saree palette, `crown: false`, `veil`), **Papa Kesari** (`hanuman()`
  recoloured a deeper bronze, no mukut, no gada), **Vayu Dev** (shared `vayu()`, on his cloud tail).

## Time constants (video s; shared by `src/scenes/curse.js` and `tools/curse_sfx.mjs`)
```js
BLINK = .8, SIDE = 1.5, SNAP = 2.1, GRIN = 2.5, B0 = 3.6
SPARK = 3.8, FLEX = 5.6, ROCK = 6.2, BONK = 7.0, GIGGLE = 7.4, C0 = 8.2
BARK0 = 10.6, SWING = 11.0, RIP = 11.6, RISHI1 = 12.7, YAG0 = 14.2, GRAB = 14.9, DRUM = 15.4, CRACK = 16.4,
WHOOMPH = 16.9, FORG0 = 18.4, D0 = 22.6
NO1 = 22.9, NO2 = 23.5, NO3 = 24.1, NOD = 26.0, ZIP = 26.9, CRASH = 27.5, E0 = 28.4
OPEN = 28.6, RED = 29.2, CALM = 30.5, CURSE = 32.5, SPRINKLE = 33.0, DRAIN = 33.6, LIFT = 35.7, PLOP = 36.7, F0 = 37.4
OFFER = 39.6, PAT = 40.3, YEARS = 41.0, G0 = 43.4
PUSHG = 46.9, H0 = 49.6
JSIT = 51.4, REFL = 52.6, WIDE = 54.2, I0 = 55.6
THUMP = 55.7, STAND = 56.4, GROW = 56.8, ROAR = 58.2, TURN = 59.4, WINK = 59.8, CROUCH = 60.2, LEAP = 60.6, J0 = 62.4
CARD = 66.2, END = 70.2
```

## Shots and reads (captions inside y 420–1500, left of x 930; ≥ 2 s each, 3-liners ≥ 3.2 s)
**A 0–3.6 · the hook.** Medium-close on the baby sitting in the clearing; slow push. Caption up from frame 0 to 3.5.
0.8 a blink. 1.5 his eyes slide to the side (guilty). 2.1 SNAP: the ladle behind him breaks, a piece drops; he flinches.
2.5 a sheepish grin, a blush, the tail tucks the pieces away. [out: gold brush wipe]

**B 3.6–8.2 · the boons.** He stands in the clearing. 3.7–6.0 "REMEMBER? EVERY GOD" / "GAVE HIM A BOON." Five little
lights (gold, blue, red, white, violet) swoop in one by one and pop into him; he glows. 5.6 he flexes. 6.1–8.1 "NOTHING
COULD HURT HIM!" (gold). 6.2 a big boulder; 7.0 BONK: he headbutts it, it splits in two, a shake; 7.4 he giggles, not a
scratch. [out: whip up to the sky]

**C 8.2–22.6 · the ashram (the montage; the cuts speed up).**
- 8.2–10.6 the crane: from the canopy, where he hangs upside down by his tail, grinning, the camera sinks to reveal the
  ashram: huts, the yagna, three rishis meditating. 8.3–10.5 "SO OFF HE WENT" / "TO THE RISHIS' ASHRAM…".
- 10.6–14.2 the bark clothes: a drying line of bark cloth between two trees; 11.0 he swings on it like a swing; 11.6 RIP
  RIP RIP, the strips flutter down; 12.7 a rishi pops out of his hut holding a tattered strip, jaw on the floor.
  10.7–14.1 "HE TORE THEIR" / "BARK CLOTHES…".
- 14.2–18.4 the yagna: a rishi chants at the fire with his ladle; 14.9 the baby snatches the ladles; 15.4 he drums on the
  clay pots (four beats, a punch-in on each); 16.4 CRACK, the pots split, ghee spills; 16.9 WHOOMPH, a smoke puff into
  the rishi's face: sooty, he blinks. 14.3–18.3 "…BROKE THEIR" / "YAGNA LADLES & POTS…".
- 18.4–22.6 the forgiving: three sooty, tattered rishis in a row with forced calm smiles, eyes twitching (19.5, 20.5,
  21.5), sweat; the baby swings by his tail between them. 18.5–22.5 "BRAHMA'S BOON PROTECTED HIM," / "SO THE RISHIS
  FORGAVE HIM." / "AGAIN. AND AGAIN." [out: cut on a finger wag]

**D 22.6–28.4 · "NO!"** Low angle on his parents: Maa Anjana, Papa Kesari and, above them on his cloud, Vayu Dev, each
wagging a finger in turn (22.9, 23.5, 24.1). 22.7–25.9 "MAA ANJANA, PAPA KESARI," / "EVEN VAYU DEV SAID: NO!". Reverse:
26.0 the baby nods like an angel, hands folded, sparkles. 26.9 ZIP, he's gone in a puff; 27.5 CRASH off screen; the
parents facepalm. 26.0–28.3 "HE DID NOT LISTEN." [out: smash cut]

**E 28.4–37.4 · the curse.** Close on two elder rishis. 28.6 their eyes open. 29.2 one turns red, steam from his ears;
30.5 the other pats his arm and he cools to a little pout. 28.5–30.4 "THEN THE RISHIS GOT ANGRY…" 30.5–32.4 "…BUT ONLY A
LITTLE." (gold; Valmiki: "not too angrily"). 32.5–35.9 "YOU WILL FORGET YOUR STRENGTH" / "FOR A LONG, LONG TIME."
33.0 they flick water from a kamandalu, sparkling drops arc to the baby; 33.6 his gold glow lifts off him like sparks
and fades, his tail droops. 35.7 he tries to lift a pebble: it won't budge; 36.7 he plops on his bottom and blinks.
No caption from 35.9: the face acts. [out: soft iris]

**F 37.4–43.4 · gentle.** Warm light. He walks carefully, carrying a kamandalu in both hands, to a rishi; 39.6 he offers
it with a flower; 40.3 the rishi pats his head, hearts. 37.5–40.9 "AND THE NAUGHTIEST BABY" / "BECAME THE GENTLEST."
41.0 the camera tilts up into the sky: suns and moons race across, the clouds stream. 41.1–43.3 "YEARS PASSED…"
[out: the tilt comes down on the ocean]

**G 43.4–49.6 · the shore.** Wide, dusk: the ocean, Lanka a tiny gold speck on the horizon, grown Hanuman alone on a
rock, chin down. 43.5–46.8 "NOBODY COULD LEAP THE OCEAN" / "TO FIND MAA SITA." 46.9 a slow push-in. 46.9–49.5 "HANUMAN
SAT QUIET." / "HE HAD FORGOTTEN." (gold)

**H 49.6–55.6 · Jambavan.** Old Jambavan hobbles in from the left on his staff, 51.4 sits down beside him, a paw on his
shoulder. 49.7–52.5 "THEN OLD JAMBAVAN SAID:" / "\"REMEMBER WHO YOU ARE!\"" 52.6 cut down to the water under the rock:
the ripples clear and the reflection is BABY Hanuman flying at the sun (Part 1). 54.2 reverse close-up: his eyes go
wide, the gold comes into them. 52.7–55.5 "\"YOU ONCE LEAPT" / "FOR THE SUN!\"" [out: a heartbeat]

**I 55.6–62.4 · he remembers (the music).** 55.7 THUMP, a heartbeat; light leaks from his chest. 56.4 he stands; 56.8 he
GROWS: a low angle, he rises past the clouds until he fills the frame; 58.2 a mighty roar, a shockwave over the sea.
56.8–59.3 "AND HE REMEMBERED." (huge gold). 59.4 he looks down at us and gives THE GRIN from frame 0; 59.8 a wink.
60.2 crouch, 60.6 LEAP: he shoots up and away, the camera pulls back to the whole sea and his gold streak arcs toward
Lanka. 60.7–62.3 "JAI BAJRANGBALI!" (gold). [out: gold brush wipe]

**J 62.4–66.2 · the ask.** Back in the ashram: the baby, sheepish, with the broken ladle (frame 0's pose); he hides it,
grins. 62.5–66.1 "WHAT'S THE NAUGHTIEST THING" / "YOU DID AS A KID?" / "COMMENT BELOW!" (gold).

**Card 66.2–70.2.** ad 59's Books 1–3 card (`pcCard`): the covers, set of 3 for ₹500, the RK logo, the rishikatha.com
pill, "Follow @therishikatha". It ends on the full card.

## Sound (tools/curse_sfx.mjs → assets/curse_sfx.wav)
Retro synth cartoon foley carries it: the snap, boon twinkles, the bonk and the boulder crack, a whistle down the crane,
rips, pot drums (a tabla-ish thump), the crack and whoomph, cartoon coughs, eye-twitch boings, the three NO buzzers, an
angelic chime, the zip and the crash, a kettle whistle for the steam, water sparkles, the deflate (a balloon slide), the
womp-womp, the plop. Music only twice: a soft music-box lullaby with tanpura under F (37.4–43.4), and a heroic swell
(drums, brass-like saws, a rising conch) from the heartbeat to the leap (55.6–62.4). Ocean waves and wind under G–H.
Nothing loud: -16 LUFS-ish, beds low.

## Facts used
- Valmiki Ramayana, Uttara Kanda 36 (Agastya tells Rama), verses 27–34: after the boons, the young monkey, full of
  strength, fearlessly wronged the great rishis in their ashrams (28); he broke, tore and scattered their sacrificial
  ladles and vessels, their agnihotra things and their piles of bark garments (29); the rishis knew Brahma had made him
  safe from every brahmin's curse-staff, so they put up with him every time (30); though Kesari, Vayu and Anjana forbade
  him, he still crossed every line (31); then the great rishis of the Bhrigu and Angiras lines, angry, cursed him, "not
  too angrily" (32): "Since you trouble us relying on your strength, deluded by our curse you will not know it for a long
  time" (33); his might taken away by their words, he went about the ashrams gently (34).
- Same sarga, 39–40: because of the curse he didn't know his own strength, even when Vali was hounding Sugriva (used in
  the pinned comment, not the reel).
- The "until someone reminds you" condition is the popular telling (and some printed editions of the sarga); the reel
  only shows what Valmiki shows: Jambavan reminded him and his strength came back.
- Kishkindha Kanda 65–67: no vanara could cross the hundred yojanas to Lanka; Hanuman sat apart, silent; Jambavan, the
  eldest, came to him and told him who he was: Anjana's son by Vayu, how as a baby he leapt at the rising sun taking it
  for a fruit, the vajra, the boons, his strength like Garuda's; Hanuman grew huge, roared and declared he'd leap.
- The sun leap: Kishkindha 66 and Uttara 35 (Part 1). Look: Hanuman Chalisa 4–5.
- Performance only (no plot claims): drumming on the pots, the soot puff, swinging on the bark-cloth line, eye twitches,
  the red-faced rishi being calmed, the water flick of the curse, the pebble, the kamandalu and flower, the reflection
  showing his memory, the grin and the wink.

## Instagram caption, pinned comment
In `out/curse_out/captions.txt` once the reel is done.
