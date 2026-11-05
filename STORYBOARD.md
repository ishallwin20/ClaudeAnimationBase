# Ad 76: "PARSHURAMA broke GANESHA'S TUSK" (Parshurama series, Part 7)

An 88.2 s Painted reel with Bangers captions, no voiceover and SFX: a temple bell and a low brass for the cold open, wind
and a tanpura on Kailash, comic foley for the door fight (boing, scuffle, trunk whoosh), a whirl through the worlds
(choir, flute and cowbells, a deep drone below, a splash), a slowed-down spinning axe, silence, then the CLANG, a thud
and a rumble; a harp for Krishna, a soft flute for the forgiveness. It stands on its own and ends on the Navadurga card
(no price).

**Pacing:** Part 6's shape (owner, 5 Nov: "pacing is good now"). A fast cold open (0–10.2 s: the hook 3.8 s, "WITH THE AXE
SHIVA GAVE HIM." 3.6 s, "AND GANESHA LET IT STRIKE." 2.8 s), then 15 caption groups in ~74 s, two-line captions up
≥ 3.5 s, three-liners and quotes ≥ 4.5 s.

```
Logline: After his wars Parshurama climbs Kailash to see his guru, Shiva. At the door stands Ganesha: "Wait, my parents
         are resting." "I'll just bow and come back." "No." A shove, a tug, Kartikeya pulls them apart; Parshurama raises
         his axe, and Ganesha picks him up and carries him through every world, drops him in the waters and puts him
         back where he stood. Dizzy and soaked, Parshurama throws the axe. Ganesha knows it: his father gave it. He won't
         let his father's gift go in vain, so he takes it on his tusk. The tusk falls; the earth shakes. Parvati is
         furious; Shiva says nothing and calls Krishna, who names the boy EKADANTA. Parvati forgives Parshurama.
Why it should travel: two of the most loved names in the hook (Parshurama, Ganesha), the "why does Ganesha have one
         tusk?" question every Indian kid has asked, a cute-vs-mighty fight (a little Ganesha lifts the warrior who beat
         21 armies), and a twist of character: Ganesha CHOSE to take the blow, out of respect for his father. The ask is a
         name call-out ("HOW MANY OTHER NAMES OF GANESHA DO YOU KNOW?"), the format that gets the most comments.
Hook:    Frame 0: Ganesha on the crimson sunburst, one tusk broken, the other in his hand.
         "PARSHURAMA" (gold) / "BROKE GANESHA'S TUSK."
World:   sunburst → blood-maroon → sunburst → Kailash by day → the palace door (snow, white stone, gold) → the worlds
         (gold heavens, Vaikuntha's blue, Goloka's green, the violet underworlds, the waters) → the door, the sky
         reddening → the slowed void (gold) → the door, dust → Parvati's red anger → Krishna's blue-gold light → warm
         dusk → sunburst → card.
Motif:   THE AXE (Shiva's gift in Part 2: it comes back to Shiva's door, and his son honours it), THE TUSK (whole in the
         story, broken in the hook and the ask: the ending rhymes with frame 0).
```

## Characters
- **Rama (Parshurama)**: `parshurama()`, `flip: 1`, bearded (since the 21 wars, Part 5); the axe; `quiver: false`.
- **Ganesha**: `balBappa()`, `stand: 1`, `tusks: 1.5`; `broken: 1` from the strike on; his left tusk (screen right) is the
  one that breaks (Brahmanda 3.42.3). He lifts Parshurama with his trunk (`balTrunkTip()`).
- **Kartikeya** `kartikeya()` (vel and shield), **Parvati** `parvati()`, **Shiva** `shiva()` seated, **Krishna**
  `krishna()`, **Radha** `radha7()` (Parvati's rig, a peacock-blue odhni), the devas on clouds `deva()` (Part 2).

## Time constants (video s; shared by `src/scenes/parshu7.js` and `tools/parshu7_sfx.mjs`)
```js
B0 = 3.8, C0 = 7.4
D0 = 10.2, E0 = 15.0, F0 = 19.6, REV = 22.4
G0 = 24.6, SPLIT = 26.8, H0 = 29.2, LIFT = 31.4
I0 = 34.0, DOWN = 36.4, SPLASH = 38.3, BACK = 39.8
J0 = 40.6, WIND = 43.6, THROW = 44.5
K0 = 45.2, KNOW = 46.8, L0 = 50.2, HIT = 54.2
M0 = 55.0, LAND = 56.1, N0 = 59.6, O0 = 64.6, ARRIVE = 66.4
Q0 = 69.2, NAME = 70.6, R0 = 74.2, S0 = 79.2, CARD = 84.2, END = 88.2
```

## Shots and reads (captions inside y 420–1500, left of x 930)
**The cold open (fast)**
- **A 0–3.8 · the hook.** Ganesha on the crimson sunburst, his tusk in his hand, the stump showing; he looks at the tusk,
  then at us, calm. "PARSHURAMA" / "BROKE GANESHA'S TUSK."
- **B 3.8–7.4 · the axe.** Parshurama on blood-maroon, the axe raised overhead and glowing. "WITH THE AXE" / "SHIVA GAVE
  HIM."
- **C 7.4–10.2 · he lets it.** Ganesha close; the axe's light grows on his face; he closes his eyes and smiles. "AND
  GANESHA" / "LET IT STRIKE." Iris out.

**The story (Part 6's pace)**
- **D 10.2–15.0 · Kailash.** Parshurama climbs the snowy path toward the palace on the peak. "AFTER HIS WARS," /
  "PARSHURAMA CLIMBED KAILASH" / "TO SEE HIS GURU, SHIVA."
- **E 15.0–19.6 · the door.** The palace door, Kartikeya and Ganesha on its steps; Parshurama bows to them and steps to
  the door; Ganesha hops in front of it, palm up. "GANESHA STOPPED HIM:" / "\"WAIT! MY PARENTS ARE RESTING.\""
- **F 19.6–24.6 · "No."** Low angle: Parshurama, hand on heart. "\"I'LL JUST BOW TO THEM" / "AND COME RIGHT BACK.\"" 22.4
  cut to Ganesha close: arms folded, head shaking. "\"NO.\""
- **G 24.6–29.2 · the tug.** Parshurama strides in; Ganesha plants his feet and shoves at his belly; they push back and
  forth; 26.8 Kartikeya jumps between and shoves them apart. "HE PUSHED IN. GANESHA PUSHED BACK." / "KARTIKEYA PULLED
  THEM APART."
- **H 29.2–34.0 · picked up.** Parshurama raises his axe, aura flaring; 31.4 Ganesha's trunk whips round his waist and
  lifts him off his feet, legs kicking. "PARSHURAMA RAISED HIS AXE." / "GANESHA PICKED HIM UP."
- **I 34.0–40.6 · the worlds.** Ganesha flies up with him dangling from his trunk: the heavens' gold isles, Vaikuntha's
  blue, Goloka's cows; 36.4 down through the violet underworlds; 38.3 he drops him: a splash in the waters; 39.8 the
  trunk fishes him out, whoosh. "AND CARRIED HIM THROUGH" / "EVERY WORLD, UP AND DOWN," / "THEN DROPPED HIM IN THE
  WATERS."
- **J 40.6–45.2 · the throw.** The door again: Parshurama soaked and dizzy (stars round his head, drips); Ganesha
  unmoved, arms folded; Parshurama shakes it off, his anger flares; 43.6 the wind-up; 44.5 he throws. "BACK WHERE HE
  STOOD, SOAKED AND DIZZY," / "PARSHURAMA THREW HIS AXE."
- **K 45.2–50.2 · he knows it.** Slow motion: the axe turning through gold air; Ganesha's face in its light; 46.8 his
  eyes widen; a memory cloud: Shiva handing young Rama the axe (Part 2). "GANESHA KNEW THAT AXE." / "HIS FATHER, SHIVA,
  HAD GIVEN IT."
- **L 50.2–55.0 · the choice.** Ganesha closes his eyes, smiles and turns his left tusk to the light. "HE WOULDN'T LET
  HIS FATHER'S GIFT" / "GO IN VAIN." / "SO HE TOOK IT ON HIS TUSK." Silence, then 54.2 the CLANG: a white flash.
- **M 55.0–59.6 · the tusk falls.** The tusk spins down and lands in the snow (56.1): the ground shakes, snow slides off
  the peak, the devas on their clouds cry out. "THE TUSK FELL." / "THE EARTH SHOOK."
- **N 59.6–64.6 · Parvati.** Parvati sweeps out, Shiva behind her; she sees her son with one tusk and turns on Shiva,
  pointing at Parshurama. "\"YOUR OWN DISCIPLE BROKE OUR SON'S TUSK" / "WITH THE AXE YOU GAVE HIM!\""
- **O 64.6–69.2 · Krishna.** Shiva closes his eyes, silent; 66.4 a blue-gold light: Krishna and Radha arrive. "SHIVA
  SAID NOTHING." / "HE CALLED KRISHNA."
- **Q 69.2–74.2 · the name.** Krishna, a hand on Ganesha's turban, to Parvati: "\"TODAY YOUR SON BECAME" / "EKADANTA:"
  (huge gold) / "THE ONE-TUSKED.\""
- **R 74.2–79.2 · forgiven.** Radha touches Ganesha's cheek (a sparkle); Parshurama kneels, palms joined; Parvati lays
  her hand on his head. "PARVATI FORGAVE PARSHURAMA" / "AND BLESSED HIM."
- **S 79.2–84.2 · the ask.** Ganesha on the sunburst with his tusk, as in frame 0, smiling. "EKADANTA IS ONE OF HIS
  NAMES." / "HOW MANY OTHERS" / "DO YOU KNOW? COMMENT!"
- **card 84.2–88.2.** `navCard()`.

## Facts used
One version: **Brahmanda Purana**, Upodghata-pada (Part 2, section 3) chapters 41–43, checked against G.V. Tagare's
translation (Motilal Banarsidass, AITM; on wisdomlib.org). The same story is told at more length in the Brahma Vaivarta
Purana, Ganapati Khanda 40–44; the reel follows the Brahmanda.

| Beat | Source |
|---|---|
| After slaying the kings, he worships Shiva and sets out for Kailasa to see Shiva and Uma, his guru's consort, Skanda and Vinayaka | 3.41.15-17 |
| He enters past the ganas with Nandi's leave; Kartikeya and Vinayaka sit at the palace's eastern door; he bows to both | 3.41.26-33 |
| Vinayaka: "wait; Mahadeva is sleeping with Uma; I will go in first and ask" | 3.41.34-37, 42-43 |
| Parshurama: "I will go in, bow to Parvati and Shankara and come back quickly"; "they are the parents of the worlds" | 3.41.37-40, 49-50 |
| He tries to go in; Vinayaka gets up and restrains him; it becomes a tug of war | 3.41.51-52 |
| Skanda seizes both and pushes them apart; Parshurama raises his axe | 3.41.52-53 |
| Ganesha lifts him and carries him through Bhur, Bhuvar, Svar, Mahar, Jana, Tapas and Satya lokas, Vaikuntha and Goloka, then the seven netherworlds; hurls him into the waters; he is frightened; Ganesha puts him back where he had stood | 3.41.54-55 |
| Shaken, he sees Ganesha standing there and hurls his axe | 3.42.1-2 |
| Ganesha recognises the axe as his father's gift and, not wanting it to go in vain, receives it on his left tusk | 3.42.3 |
| The tusk falls, bloody; the earth shakes; the devas watching cry out | 3.42.4-6 |
| Parvati and Shiva come out; Skanda tells her; she is angry | 3.42.7-10 |
| Parvati to Shiva: your disciple, who got his armour from you and killed Kartavirya, has cut off your son's tusk with his axe | 3.42.11-13 |
| Shiva says nothing and calls Krishna in his mind; Krishna comes with Radha (and Shridaman) | 3.42.17-23 |
| Parshurama falls at Parvati's feet; Krishna asks her to bless him | 3.42.24-29 |
| "Today he has been made Ekadanta" (Krishna explains Ganesha's names) | 3.42.33-41 (Ekadanta 39) |
| Radha heals Ganesha's cheek with her touch; Parvati is appeased, takes Rama on her lap and blesses him | 3.42.52-56 |
| Krishna makes Ganesha friendly to Rama | 3.43.18-19 |
| The axe was Shiva's gift | MBh 13.18.10-11 (Part 2); 3.42.3 ("a gift from his father") |

**On screen, honestly:** "MY PARENTS ARE RESTING" is our gentle wording of 41.35 (Shiva "sleeping in the company of
Uma"). "I'LL JUST BOW TO THEM AND COME RIGHT BACK" is 41.38-40. "NO." condenses Vinayaka's reply (41.42-46). "GANESHA
PUSHED BACK" is 41.51's restraint and 41.52's tug of war. "PICKED HIM UP": Tagare has "by means of his hand"; for an
elephant-faced god the Sanskrit *kara* also means trunk, and the reel draws the trunk. "THEN DROPPED HIM IN THE WATERS"
is 41.55. "SOAKED AND DIZZY" is ours for 42.1 ("whirled around", overwhelmed). "HIS FATHER, SHIVA, HAD GIVEN IT" and
"WOULDN'T LET HIS FATHER'S GIFT GO IN VAIN" are 42.3. "THE EARTH SHOOK" is 42.5. Parvati's line condenses 42.11-13.
"HE CALLED KRISHNA" is 42.18 (mentally). "TODAY YOUR SON BECAME EKADANTA" is 42.39. "FORGAVE AND BLESSED HIM" is 42.53-56
(the reel draws a hand on his head, not the lap). Not claimed: Ganesha's age and look (the series' Bal Bappa), flying
(the text says carried), the route drawn through the worlds, the cows of Goloka, the snow sliding off the peak. Left
out: the blood (42.4), Parvati's threat to leave for her father's house (42.15-17), Radha's speech on Shiva and Vishnu
being one (42.47-51), the boons of 43.
**The memory cloud** shows Part 2's gift (Shiva handing young Rama the axe: MBh 13.18).

**The pinned comment:** the source, and the other well-known version: Ganesha as Vyasa's scribe for the Mahabharata
(the vulgate's opening, Adi 1; the tusk-as-pen is later tradition, not in that text), plus the names Krishna explains in
42.33-41 (Ganesha, Lambodara, Gajanana, Bhalachandra, Shurpakarna, Vighnanashaka, Ekadanta, Vakratunda) as the answer
key for the ask.

## Cover
`src/scenes/parshu7_cover.js` (`cover.html`): Parshurama (axe raised, glowing) left, Ganesha right, calm, the tusk in
his hand; the orange PART 7 pill over "PARSHURAMA" (gold) / "BROKE" / "GANESHA'S TUSK" (gold).

## Out
`out/parshu7_out/` (parshu7.mp4, cover.png, captions.txt).
