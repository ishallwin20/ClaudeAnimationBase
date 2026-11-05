# Ad 77: "VISHNU has arrived 9 times. The 10th is yet to ARRIVE." (Dashavatar)

A 108.5 s Painted reel with Bangers captions, no voiceover and SFX, built to win new followers and hold the existing
ones. It stands alone (no series), and ends on the Navadurga card (no price), with "Follow" as its loudest line.

**Why it should travel:**
- Every Indian viewer knows the ten names. Almost nobody knows *why* each form: why a fish, why a turtle, why half a
  lion. That is the explainer hook ("Why are Hindu gods BLUE?"), on a numbered list (the 3D count reels' retention).
- Three of the ten are loophole stories: Narasimha beats every clause of a boon, Vamana's 3 steps, Ram born a man
  because Ravana forgot humans. Those three get the most time.
- A name call-out ask ("WHICH AVATAR IS YOUR FAVOURITE?"), the format that gets the most comments. The 9th is the
  Buddha only (owner, 5 Nov: "Make 9th avatar Buddha only"), as in the Agni Purana; the pinned comment notes the
  Balarama lists.
- A cliff for the whole reel: frame 0 says the 10th "is still coming", paid off at 10 (Kalki).

**Pacing:** owner, 5 Nov: "a bit slower overall": every slot got 1–2 s more hold and wider caption staggers
(101.8 → 108.5 s, with the 9th now one slot). A one-frame cold open (owner: "trim cold open but strong hook"), then ~12 caption groups a minute). Each avatar is one numbered slot with a
gold badge (number + name, up the whole slot, not counted as a caption group) and one or two story captions under it.
Two-liners stay up ≥ 3.5 s, three-liners and quotes ≥ 4.5 s.

```
Logline: Vishnu comes down ten times, each time in the one shape the trouble needed: a fish for a flood, a turtle for a
         sinking mountain, a boar for a drowned earth, a man-lion for a boon with no gaps, a boy for a king who never
         says no, an axe for cruel kings, a man for a demon who forgot men, Krishna who says why, the disputed 9th, and
         the 10th, yet to arrive.
Words:   never "come" / "came" / "coming" on screen (owner, 5 Nov: reads as an innuendo); ARRIVED, APPEARED.
Hook:    Frame 0: Vishnu on Shesha on the dark-blue ocean, the chakra turning.
         "VISHNU HAS ARRIVED 9 TIMES." (VISHNU big gold) / "THE 10TH IS YET TO ARRIVE."
         2.4 s: lightning behind him shows a white horse rearing in the clouds, a rider's sword up.
World:   one cosmic ocean, deep blue, as the home base (open, descent, ask). Each avatar gets its own world and colour:
         storm teal (Matsya), milk-white ocean (Kurma), black depths → dawn (Varaha), dusk orange (Narasimha), gold
         sacrificial ground → sky blue (Vamana), blood-maroon (Parshurama), Lanka night → day (Ram), Kurukshetra gold
         (Krishna), split warm/cool (9th), a storm with lightning (Kalki). Then back to the blue ocean.
Motif:   THE DESCENT: avatar means "descent". Every slot opens with a blue-gold light falling from the top of the frame
         and landing as that form (a whoosh down, a chime), and the badge counts up 1 → 10. The ending rhymes with
         frame 0: Vishnu on Shesha again, now ringed by the nine he has been and the dark 10th.
```

## Characters (shared cast on `main`; new ones go to `src/dashavatar.js` on main)
- **Vishnu** `vishnu()` four-armed on `shesha()`. **Parshurama** `parshurama()`. **Ram** `ram()`. **Ravana** `ravana()`
  (the ten personalities). **Krishna** `krishna()`. **Prahlad** a child on `kartikeya()`'s `pal` rig. **Hiranyakashipu**
  `asura()` (a gold crown). **Devas / asuras** at the churning: `deva()`, `asura()`.
- **New in `src/dashavatar.js`:**
  - `matsya()`: a golden fish with one horn, a little kirita and the Vaishnava tilak; tiny or huge.
  - `kurma()`: the Fable tortoise recoloured, with kirita and tilak.
  - `varaha()`: a dark-blue boar, standing, the earth balanced on his tusks.
  - `narasimha()`: Narad's rig with a lion face and mane (Jambavan's `face` hook).
  - `vamana()`: a little blue brahmin boy on Kartikeya's rig, with a parasol, kamandalu and topknot; `trivikramaFoot()`
    for the giant step.
  - `bali()`: a generous king on Dasharatha's rig.
  - `balarama()`: Krishna's rig made fair, in blue, with a plough.
  - `buddha()`: Narad's rig seated, with an ushnisha, long ears and an ochre robe.
  - `kalki()`: a rider in silhouette on `suryaHorse()` coloured white, sword raised.
  - Props: the boat, Mandara with Vasuki, the pillar.

## Time constants (video s; shared by `src/scenes/dasha.js` and `tools/dasha_sfx.mjs`)
```js
FLASH0 = 2.4
M0 = 4.4, MGROW = 9.0                                              // 1 Matsya
K0 = 14.0, KRISE = 16.6                                            // 2 Kurma
V0 = 22.4, VBURST = 25.8                                           // 3 Varaha
N0 = 31.4, STRIKE = 36.6, PILLAR = 37.2, FEAR = 39.6, ROAR2 = 41.0 // 4 Narasimha
W0 = 43.4, WGROW = 49.0, STEP1 = 49.8, STEP2 = 51.1, HEAD = 52.3   // 5 Vamana
P0 = 55.3, PAXE = 58.5, PFLEE = 61.1                               // 6 Parshurama
R0 = 63.3, RAM = 68.1, REV = 70.7                                  // 7 Ram
G0 = 72.7                                                          // 8 Krishna
B9 = 82.7                                                          // 9 Buddha
X0 = 90.2, YET = 95.0                                              // 10 Kalki
ASK = 99.0, CARD = 104.5, END = 108.5
```

## Shots and reads (captions inside y 420–1500, left of x 930; badge at y ≈ 470, captions from y ≈ 580)
**Cold open (one frame)**
- **A 0–4.4 · the hook.** Vishnu on Shesha, close, on the deep-blue ocean; the chakra turns; he opens his eyes and
  smiles at us. "VISHNU HAS ARRIVED 9 TIMES." / "THE 10TH IS YET TO ARRIVE." 2.4 lightning: a white horse rears in the
  clouds behind him, a rider's sword up; thunder. The falling light leaves him: cut to 1.

**The ten (each opens with the falling light and the badge)**
- **1 MATSYA, THE FISH · 4.4–14.0.** King Manu at the river, a tiny fish in his cupped palms looking up at him (badge
  "1 · MATSYA"). "A TINY FISH ASKED KING MANU" / "TO SAVE IT." 9.0 the storm: the fish is now huge, golden, horned,
  towing Manu's boat through the flood by a rope on its horn (Vasuki). "THEN IT GREW HUGE" / "AND TOWED HIS BOAT THROUGH
  THE FLOOD."
- **2 KURMA, THE TURTLE · 14.0–22.4.** The milk ocean: Mandara, wrapped in Vasuki, devas pulling on one side and asuras
  on the other, starts to sink, tilting. 16.6 the turtle rises under it and lifts it, the churning starts again.
  "THE CHURNING MOUNTAIN WAS SINKING." / "SO HE BECAME A TURTLE" / "AND HELD IT UP."
- **3 VARAHA, THE BOAR · 22.4–31.4.** The earth sinks into black water; Hiranyaksha laughs in the dark. 25.8 the boar
  bursts up through the surface into dawn, the earth balanced on his tusks. "A DEMON SANK THE EARTH IN THE OCEAN." / "HE
  DIVED AS A BOAR" / "AND LIFTED IT ON HIS TUSKS."
- **4 NARASIMHA, THE MAN-LION · 31.4–43.4.** Hiranyakashipu laughs on his throne, ticking off his boon on his fingers.
  "HIS BOON: NO MAN, NO BEAST," / "NOT DAY, NOT NIGHT," / "NOT INSIDE, NOT OUTSIDE." (≥ 4.5 s). Little Prahlad stands calm by
  the pillar; 36.6 the demon punches it with his fist (7.8.15); 37.2 it bursts, Narasimha roars out of it in the dusk light, on
  the doorstep. "SO HE APPEARED HALF-MAN, HALF-LION," / "AT DUSK, ON THE DOORSTEP." Cut on the roar: no killing shown.
- **5 VAMANA, THE DWARF · 43.4–55.3.** King Bali at his yagna, pouring gifts; a little boy with a parasol holds up three
  fingers. "KING BALI HAD WON ALL 3 WORLDS." / "A LITTLE BOY ASKED HIM FOR 3 STEPS OF LAND." 49.0 the boy grows past the
  frame; 49.8 a giant foot covers the earth, 51.1 the second crosses the sky; 52.3 Bali kneels and bows his head; the
  foot rests on it, gently. "2 STEPS COVERED EVERYTHING." / "BALI OFFERED HIS HEAD FOR THE 3RD."
- **6 PARSHURAMA, THE WARRIOR SAGE · 55.3–63.3.** Arrogant crowned kings swagger; Parshurama's axe rises glowing and
  they scatter. "KINGS GREW ARROGANT AND CRUEL." / "HE ARRIVED WITH SHIVA'S AXE." (Our series' framing: arrogant kings,
  never a caste.)
- **7 RAM, THE PRINCE · 63.3–72.7.** Ravana's ten heads laugh, counting the ones who can't kill him (god, demon,
  gandharva…). "RAVANA'S BOON: NO GOD OR DEMON COULD KILL HIM." / "HE DIDN'T BOTHER WITH HUMANS." 68.1 cut: Ram draws
  the Kodanda; the ten heads gulp. "SO VISHNU WAS BORN A MAN: RAM."
- **8 KRISHNA · 72.7–82.7.** Kurukshetra: Krishna on the chariot, Arjuna kneeling; a gold light grows behind Krishna;
  the Devanagari line appears in gold (rkVerse): "यदा यदा हि धर्मस्य". "KRISHNA TOLD US WHY:" / "\"WHENEVER DHARMA
  FALLS," / "I APPEAR, AGE AFTER AGE.\"" (≥ 4.5 s). The emotional peak; a long hold.
- **9 BUDDHA · 82.7–90.2.** The cool grove: the light lands under the bodhi tree and becomes the Buddha in
  meditation; a goat walks free from a sacrificial post and settles beside him (a heart). "HE SPOKE AGAINST" /
  "ANIMAL SACRIFICE," / "OUT OF COMPASSION."
- **10 KALKI · 90.2–99.0.** The storm from frame 0's flash: the white horse gallops across the frame, the rider raises a
  shining sword. "AT THE END OF KALI YUGA," / "HE WILL ARRIVE ON A WHITE HORSE." 95.0 the horse rears into silhouette,
  a lightning flash. "HE HASN'T ARRIVED YET."

**Close**
- **ASK 99.0–104.5.** Vishnu on Shesha as in frame 0, now ringed by medallions of his forms (fish, turtle, boar,
  lion, parasol, axe, bow, flute and feather, bodhi leaf, a dark "?"). "WHICH AVATAR" / "IS YOUR FAVOURITE?" / "COMMENT!"
- **CARD 104.5–108.5.** `navCard()`: covers, logo, "The Navadurga Set is out now", "Link in bio", "Follow
  @therishikatha".

## Facts used
**The list of ten:**
- Agni Purana, chapters 2–16, tells them in order: Matsya (2), Kurma (3), Varaha, Narasimha, Vamana, Parashurama (4),
  Rama (5–11), Krishna (12–15), Buddha and Kalki (16).
- The 9th really differs between texts:
  - Agni Purana 16 and the Matsya Purana list name Buddha.
  - Jayadeva's Gita Govinda (Dashavatara stotra, 12th c.) names Balarama as 8th and Buddha as 9th, leaving out Krishna
    because Krishna is the source.
  - Many South and West Indian lists name Balarama; Agni Purana 49 (iconography) also lists Balarama.
  - Bhagavata 1.3 counts 22 avatars and has both.
  - On screen: the Buddha only (owner's choice), following Agni Purana 16. His line is the Gita Govinda's (1, the
    Dashavatara verse: *nindasi yajña-vidher ahaha śruti-jātam, sadaya-hṛdaya darśita-paśu-ghātam*: you condemned
    the sacrifices that kill animals, out of compassion). The pinned comment names the Balarama lists.

| Beat | Source |
|---|---|
| A tiny fish in Manu (Satyavrata)'s palms asks protection; it grows; at the flood a golden horned fish; the boat tied to its horn with Vasuki | Bhagavata 8.24.12-46; Matsya Purana 1-2; Agni 2 |
| Mandara sinks while churning; Vishnu as a tortoise holds it on his back | Bhagavata 8.7.8-10; Agni 3 |
| Hiranyaksha; the earth sunk in the waters; Varaha lifts it on his tusks | Bhagavata 3.13, 3.18-19; Agni 4 |
| Hiranyakashipu's boon: not by man or beast, not day or night, not inside or outside (also: not on earth or in sky, no weapon) | Bhagavata 7.3.35-38 |
| Prahlad: the Lord is everywhere; the demon strikes the pillar with his fist; Narasimha emerges; at dusk, on the threshold | Bhagavata 7.8.12-29 |
| Bali rules the three worlds; Vamana asks for three steps; grows; two steps cover all; Bali offers his head | Bhagavata 8.15, 8.19.16-21, 8.20.21-34, 8.22.2 |
| Parshurama and the arrogant kings (series framing) | MBh 3.115-117, 12.49; Bhagavata 9.15-16 |
| Ravana's boon excludes humans because he scorned them; so Vishnu is born a man | Valmiki Bala 16.5-7 (and 15) |
| "Whenever dharma declines… I manifest myself, age after age" | Bhagavad Gita 4.7-8 |
| Kalki: at the end of Kali Yuga, born to Vishnuyasha in Shambhala, on the swift horse Devadatta, sword in hand | Bhagavata 12.2.16-20; Agni 16 |

**On screen, honestly:**
- "A TINY FISH ASKED KING MANU TO SAVE IT" is 8.24.13-14.
- "TOWED HIS BOAT" is 8.24.45-46.
- "HE DIDN'T BOTHER WITH HUMANS" is our voice for Bala 16's "he slighted humans".
- "AT DUSK, ON THE DOORSTEP" is 7.8.29.
- "THE WHITE HORSE": Bhagavata says a swift horse, Devadatta; the white colour is the common tradition (Kalki
  Purana). Say "a white horse" only if the owner is happy with the tradition label in the pinned comment.

**Not claimed:**
- the fish's crown and the turtle's tilak (marks that he is Vishnu);
- Hiranyaksha's look;
- the expressions;
- the reverse shot of the demon's fear (he asks "is he in this pillar?" and strikes it, 7.8.12-15);
- Kalki's look (his face stays in silhouette).

**Left out:**
- the killings (Hiranyakashipu's death is off screen; we cut on the roar);
- the evolution reading of the ten (modern, not scripture);
- Matsya's recovery of the Vedas (other tellings).

**Pinned comment:** the Agni Purana order; the Buddha in the Garuda Purana and Gita Govinda; the Balarama lists and
the Bhagavata's 22; Kalki's horse; "which avatar's story next?".

## Cover
`src/scenes/dasha_cover.js` (`cover.html`): Vishnu on Shesha, the ten medallions in an arc; the orange "WHY A FISH?"
pill over "VISHNU'S" / "10 AVATARS" (gold) / "AND WHY EACH ONE".

## Out
`out/dasha_out/` (dasha.mp4, cover.png, captions.txt).
