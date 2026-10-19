# Reel: "Every mom says OPEN YOUR MOUTH. Only ONE saw the UNIVERSE." (Little Kanha, Part 1)

A ~57.6 s captioned Painted reel for followers (ends on a Follow card teasing Part 2). Baby Krishna eats mud in the
courtyard at Gokul. Big brother Balarama and the boys tell Maa. Yashoda grabs his hand: "Did you eat mud?" "No Maa,
they're all lying! Look in my mouth!" He opens it, and she sees the whole universe: stars, the sun and moon, oceans,
mountains, the earth, Gokul, and HERSELF looking in. She bows to the Lord inside her own baby. Then he makes her
forget, so she can just be his Maa again, and she scoops him up.

```
Logline: a mom checks her toddler's mouth for mud and finds the universe; then he lets her forget, out of love.
Why it should travel: every Indian mom has said "open your mouth" (relatable, tag-your-mom), Bal Krishna is the cutest
         subject there is, the cosmos-in-the-mouth is a money shot, and "she saw HERSELF in there" is a mind-blow most
         people never knew. The ending is warm, not preachy.
Hook:    Frame 0: baby Kanha sits in the courtyard, a mud ball at his mouth, caption already up:
         "Every mom says \"OPEN your MOUTH!\"" / "Only ONE saw" / "the UNIVERSE inside." (gold)
World:   a Gokul courtyard in warm afternoon light (mud walls, a thatch eave, a tulsi chaura, hanging matkis) → the
         cosmos (indigo, violet nebulae, gold sun) → the blue earth → Gokul by the Yamuna → the same courtyard, tiny →
         Yashoda's face lit by starlight → the courtyard at golden dusk, the hug → the peach card.
Motif:   the open mouth: mud → "aaaa" → the cosmos → closed, a giggle, a wink.
Arc:     Kanha: blissful chewing → caught (guilty grin) → scared → innocent ("who, ME?") → "aaaa" → mischievous giggle →
         loved, the wink. Yashoda: cross → suspicious → awe → devotion → forgetting → pure love.
Ending rhyme: frame 0, Kanha looks at us with mud on his face → the end, he looks at us over Maa's shoulder and winks.
Comment lever (not a name call-out this time): "What did YOUR mom catch YOU eating? Comment it!"
```

## Characters
- **Bal Krishna** (new, shared: `src/bal_krishna.js`): blue skin, peacock feather in a topknot, kajal eyes, tilak,
  pitambar, flute at the waist; `mud`, `cosmos` (the night inside the 'aam' mouth), eyes 'innocent' / 'scared'.
- **Yashoda** (shared rig: `parvati()` with `YSD_PAL`, `crown: false`, `veil: 1`, `eyeStars`).
- **Balarama** (`kartikeya()` recoloured: fair, blue dhoti), two **gopa boys** (`kartikeya()` recoloured).

## Time constants (video s; shared by `src/scenes/kanha.js` and `tools/kanha_sfx.mjs`)
```js
EAT = .5, CAUGHT = 2.7, B0 = 3.6, LICK = 4.4, GIGGLE = 5.4
C0 = 6.4, PEEK = 6.8, RUN = 7.6, TELL = 8.9
D0 = 11.2, STORM = 11.3, GRAB = 12.5, WAG = 13.6
E0 = 16.2, SHAKE = 16.4, POINT = 19.2
F0 = 22.6, HANDIN = 22.8, OPEN = 23.8, GLOWIN = 24.4, DIVE = 24.7
G0 = 25.6, PLANETS = 26.0, EARTH = 29.0, GOKUL = 32.2, SELF = 35.0
H0 = 38.0, DREAM = 38.1, BOW = 40.8
I0 = 43.6, CLOSE = 43.8, MAYA = 44.2, FORGET = 45.4, SCOOP = 46.4, HUG = 47.3
J0 = 50.2, WINK = 51.0, WIPE = 53.5
CARD = 53.8, FOLLOW = 54.4, PILL = 54.9, END = 57.6
```

## Shots and reads (captions inside y 420–1500, left of x 930; ≥ 2 s each, three-liners ≥ 3.2 s)
**A 0–3.6 · the mud.** Up at frame 0: the three-line hook. Kanha sits facing us, big; .5 he pops a mud ball in, chews
in bliss (cheeks puffed, eyes happy), 2.7 he notices US: freeze, a guilty grin, "!".

**B 3.6–6.4 · the name.** "Baby KRISHNA" (gold, big) / "was eating MUD." He licks a finger, 5.4 giggles at us.

**C 6.4–11.2 · the snitch.** Whip pan right: Balarama and two boys behind the tulsi chaura, 6.8 a gasp; 7.6 they run
right to Maa at the doorway and point back. "His big brother BALARAMA" / "ran to tell Maa:" → "\"Maa! Kanha ate MUD!\""

**D 11.2–16.2 · caught.** Yashoda storms over (pan back left); 12.5 she grabs his hand and he stands; 13.6 the finger
wags. His eyes dart, scared (BhP 10.8.33). "Maa YASHODA grabbed his hand." → "\"Did you eat MUD?!\""

**E 16.2–22.6 · "who, ME?"** Push in on Kanha: innocent puppy eyes, the head shakes no. "\"No Maa! I didn't!" /
"They're all LYING!\"" → 19.2 he points at his mouth: "\"Don't believe me?" / "LOOK in my mouth!\"" (BhP 10.8.35)

**F 22.6–25.6 · OPEN.** Maa's POV: his face fills the frame; her hand comes in and lifts his chin. "So Maa said:
\"OPEN!\"" 23.8 "aaaa"; 24.4 a violet light inside; 24.7 the camera dives into his mouth, into the dark.

**G 25.6–38.0 · the universe** (one continuous journey, BhP 10.8.37–39). Stars, a spiral galaxy, the sun, the moon,
the planets: "STARS. The SUN. The MOON." → 29.0 the blue earth rises, and we fall toward it: "OCEANS. MOUNTAINS." /
"The whole EARTH." → 32.2 Gokul by the Yamuna, huts and cows: "…and in it, GOKUL." → 35.0 their own courtyard, tiny:
Yashoda bent over little Kanha's open mouth: "…and HERSELF, looking in!" (gold). Push in on tiny Yashoda's face.

**H 38.0–43.6 · awe.** Match cut to Yashoda's face, huge, starlight in her eyes, violet light on her face, trembling:
"\"Is this a DREAM?\"" → 40.8 she joins her hands and bows: "She bowed to the LORD" / "inside her own baby." (BhP 10.8.40–42)

**I 43.6–50.2 · she forgets.** Two-shot: 43.8 Kanha shuts his mouth and giggles; 44.2 a pink-gold shimmer drifts from
him over her; 45.4 she blinks, the stars leave her eyes, she smiles; 46.4 she scoops him up; 47.3 the hug, cheek to
cheek, hearts. "Then Krishna made her FORGET it…" → "…so she could just be" / "his MAA again." (BhP 10.8.43–44)

**J 50.2–53.8 · the ask.** Push in on the hug; 51.0 Kanha looks at us over her shoulder and winks. "What did YOUR mom"
/ "catch YOU eating?" (gold) / "Comment it!" (3.5 s). 53.5 brush wipe.

**K 53.8–57.6 · the card.** The follow card: the RK logo, "Stories of our gods, for little ones", Kanha waving,
"Part 2: the rope that was ALWAYS too short", "Follow @therishikatha", the rishikatha.com pill.

## Facts used
- Bhagavata Purana 10.8.32: one day Balarama and the other cowherd boys told Yashoda, "Krishna has eaten mud."
- 10.8.33: Yashoda took his hand to scold him; his eyes were wide with fear.
- 10.8.34–35: "Mother, I have not eaten mud. They are all lying. If you think they speak the truth, look in my mouth yourself."
- 10.8.36: "Then open your mouth," she said, and he opened it.
- 10.8.37–39: in his mouth she saw the whole universe: the moving and unmoving, space, the directions, the earth with
  its mountains, islands and oceans, wind, fire, the moon and the stars, and Vraja (Gokul), and herself.
- 10.8.40–42: she wondered if it was a dream or a divine illusion, and took refuge in / bowed to the Lord.
- 10.8.43–44: the Lord spread his maya of a mother's love over her; she forgot what she had seen, took her son on her
  lap, and her heart filled with love as before.
- Appearance (dark-blue skin, peacock feather, pitambar, flute): the standard iconography of Bal Krishna.
- Comedy that claims no plot fact: the guilty grin at the camera, the puppy eyes, the boys' gasp, the final wink.
