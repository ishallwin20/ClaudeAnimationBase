# Ad 77: "VISHNU has come 9 times. The 10th is still COMING." (Dashavatar)

A ~102 s Painted reel with Bangers captions, no voiceover and SFX, built to win new followers and hold the existing
ones. It stands alone (no series), and ends on the Navadurga card (no price), with "Follow" as its loudest line.

**Why it should travel:**
- Every Indian viewer knows the ten names. Almost nobody knows *why* each form: why a fish, why a turtle, why half a
  lion. That is the explainer hook ("Why are Hindu gods BLUE?"), on a numbered list (the 3D count reels' retention).
- Three of the ten are loophole stories: Narasimha beats every clause of a boon, Vamana's 3 steps, Ram born a man
  because Ravana forgot humans. Those three get the most time.
- A built-in debate (owner, 5 Nov: "use both, tell reasons and make people debate"): the 9th avatar really differs
  between the texts. Both get a turn with the reason each side gives and who lists him, no verdict, and the ask is
  "SO WHO IS NUMBER 9? BALARAMA OR BUDDHA?".
- A cliff for the whole reel: frame 0 says the 10th "is still coming", paid off at 10 (Kalki).

**Pacing:** a one-frame cold open (owner: "trim cold open but strong hook"), then ~12 caption groups a minute). Each avatar is one numbered slot with a
gold badge (number + name, up the whole slot, not counted as a caption group) and one or two story captions under it.
Two-liners stay up ≥ 3.5 s, three-liners and quotes ≥ 4.5 s.

```
Logline: Vishnu comes down ten times, each time in the one shape the trouble needed: a fish for a flood, a turtle for a
         sinking mountain, a boar for a drowned earth, a man-lion for a boon with no gaps, a boy for a king who never
         says no, an axe for cruel kings, a man for a demon who forgot men, Krishna who says why, the disputed 9th, and
         the 10th, still coming. And the 9th: the texts don't agree.
Hook:    Frame 0: Vishnu on Shesha on the dark-blue ocean, the chakra turning.
         "VISHNU HAS COME 9 TIMES." (VISHNU big gold) / "THE 10TH IS STILL COMING."
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
M0 = 4.0, MGROW = 7.6                         // 1 Matsya
K0 = 12.4, KRISE = 14.6                       // 2 Kurma
V0 = 19.4, VBURST = 22.2                      // 3 Varaha
N0 = 26.8, STRIKE = 31.2, PILLAR = 31.8       // 4 Narasimha
W0 = 36.8, WGROW = 41.6, STEP1 = 42.4, STEP2 = 43.4, HEAD = 44.8   // 5 Vamana
P0 = 46.8                                     // 6 Parshurama
R0 = 53.3, RAM = 57.2                         // 7 Ram
G0 = 61.3                                     // 8 Krishna
B9 = 70.3, BAL = 74.0, BUD = 79.0             // 9 Balarama or Buddha
X0 = 84.3, YET = 88.6                         // 10 Kalki
ASK = 92.3, CARD = 97.8, END = 101.8
```

## Shots and reads (captions inside y 420–1500, left of x 930; badge at y ≈ 470, captions from y ≈ 580)
**Cold open (one frame)**
- **A 0–4.0 · the hook.** Vishnu on Shesha, close, on the deep-blue ocean; the chakra turns; he opens his eyes and
  smiles at us. "VISHNU HAS COME 9 TIMES." / "THE 10TH IS STILL COMING." 2.4 lightning: a white horse rears in the
  clouds behind him, a rider's sword up; thunder. The falling light leaves him: cut to 1.

**The ten (each opens with the falling light and the badge)**
- **1 MATSYA, THE FISH · 4.0–12.4.** King Manu at the river, a tiny fish in his cupped palms looking up at him (badge
  "1 · MATSYA"). "A TINY FISH ASKED KING MANU" / "TO SAVE IT." 7.6 the storm: the fish is now huge, golden, horned,
  towing Manu's boat through the flood by a rope on its horn (Vasuki). "THEN IT GREW HUGE" / "AND TOWED HIS BOAT THROUGH
  THE FLOOD."
- **2 KURMA, THE TURTLE · 12.4–19.4.** The milk ocean: Mandara, wrapped in Vasuki, devas pulling on one side and asuras
  on the other, starts to sink, tilting. 14.6 the turtle rises under it and lifts it, the churning starts again.
  "THE CHURNING MOUNTAIN WAS SINKING." / "SO HE BECAME A TURTLE" / "AND HELD IT UP."
- **3 VARAHA, THE BOAR · 19.4–26.8.** The earth sinks into black water; Hiranyaksha laughs in the dark. 22.2 the boar
  bursts up through the surface into dawn, the earth balanced on his tusks. "A DEMON SANK THE EARTH IN THE OCEAN." / "HE
  DIVED AS A BOAR" / "AND LIFTED IT ON HIS TUSKS."
- **4 NARASIMHA, THE MAN-LION · 26.8–36.8.** Hiranyakashipu laughs on his throne, ticking off his boon on his fingers.
  "HIS BOON: NO MAN, NO BEAST," / "NOT DAY, NOT NIGHT," / "NOT INSIDE, NOT OUTSIDE." (≥ 4.5 s). Little Prahlad stands calm by
  the pillar; 31.2 the demon punches it with his fist (7.8.15); 31.8 it bursts, Narasimha roars out of it in the dusk light, on
  the doorstep. "SO HE CAME HALF-MAN, HALF-LION," / "AT DUSK, ON THE DOORSTEP." Cut on the roar: no killing shown.
- **5 VAMANA, THE DWARF · 36.8–46.8.** King Bali at his yagna, pouring gifts; a little boy with a parasol holds up three
  fingers. "KING BALI HAD WON ALL 3 WORLDS." / "A LITTLE BOY ASKED HIM FOR 3 STEPS OF LAND." 41.6 the boy grows past the
  frame; 42.4 a giant foot covers the earth, 43.4 the second crosses the sky; 44.8 Bali kneels and bows his head; the
  foot rests on it, gently. "2 STEPS COVERED EVERYTHING." / "BALI OFFERED HIS HEAD FOR THE 3RD."
- **6 PARSHURAMA, THE WARRIOR SAGE · 46.8–53.3.** Arrogant crowned kings swagger; Parshurama's axe rises glowing and
  they scatter. "KINGS GREW ARROGANT AND CRUEL." / "HE CAME WITH SHIVA'S AXE." (Our series' framing: arrogant kings,
  never a caste.)
- **7 RAM, THE PRINCE · 53.3–61.3.** Ravana's ten heads laugh, counting the ones who can't kill him (god, demon,
  gandharva…). "RAVANA'S BOON: NO GOD OR DEMON COULD KILL HIM." / "HE DIDN'T BOTHER WITH HUMANS." 57.2 cut: Ram draws
  the Kodanda; the ten heads gulp. "SO VISHNU WAS BORN A MAN: RAM."
- **8 KRISHNA · 61.3–70.3.** Kurukshetra: Krishna on the chariot, Arjuna kneeling; a gold light grows behind Krishna;
  the Devanagari line appears in gold (rkVerse): "यदा यदा हि धर्मस्य". "KRISHNA TOLD US WHY:" / "\"WHENEVER DHARMA
  FALLS," / "I COME, AGE AFTER AGE.\"" (≥ 4.5 s). The emotional peak; a long hold.
- **9 BALARAMA OR BUDDHA? · 70.3–84.3.** The light falls and SPLITS in two. Split frame: Balarama with his plough
  (warm) | the Buddha in meditation (cool), a gold "?" pulsing between (badge "9 · ?"). "NUMBER 9?" / "THE SCRIPTURES
  DON'T AGREE." 74.0 Balarama full frame: he hooks the Yamuna with his plough and drags its course toward him.
  "TEAM BALARAMA: KRISHNA'S ELDER BROTHER," / "WHO DRAGGED THE YAMUNA WITH HIS PLOUGH." / "(SOUTH INDIA'S SRI VAISHNAVA
  LISTS)" 79.0 the Buddha full frame under the tree; a goat walks free from a sacrificial post and settles beside him.
  "TEAM BUDDHA: HE STOPPED ANIMAL SACRIFICE" / "OUT OF COMPASSION." / "(AGNI & GARUDA PURANA, GITA GOVINDA)"
- **10 KALKI · 84.3–92.3.** The storm from frame 0's flash: the white horse gallops across the frame, the rider raises a
  shining sword. "AT THE END OF KALI YUGA," / "HE WILL COME ON A WHITE HORSE." 88.6 the horse rears into silhouette,
  a lightning flash. "HE HASN'T COME YET."

**Close**
- **ASK 92.3–97.8.** Vishnu on Shesha as in frame 0, now ringed by medallions of his forms, the 10th dark; the 9th
  medallion flips between Balarama and Buddha. "SO WHO IS NUMBER 9?" / "BALARAMA OR BUDDHA?" / "COMMENT!"
- **CARD 97.8–101.8.** `navCard()`: covers, logo, "The Navadurga Set is out now", "Link in bio", "Follow
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
  - On screen: both sides, each with what he did and who lists him, and no verdict. Team Balarama = the Sri Vaishnava
    lists (Balarama 8th, Krishna 9th, no Buddha). Team Buddha = Agni Purana (16, 49), Garuda Purana, the Gita Govinda.
  - Balarama drags the Yamuna with his plough: Bhagavata 10.65.24-30; Gita Govinda 1 (the Dashavatara verse,
    *halahati-bhīti-milita-yamunābham*).
  - The Buddha condemned sacrifice that killed animals, out of compassion: Gita Govinda 1 (*nindasi yajña-vidher
    ahaha śruti-jātam, sadaya-hṛdaya darśita-paśu-ghātam*).

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

**Pinned comment:** the sources; the 9th-avatar split (which text names whom); Bhagavata's 22 avatars; "our Parshurama
series is on the page".

## Cover
`src/scenes/dasha_cover.js` (`cover.html`): Vishnu on Shesha, centre, the ten forms in a ring; "VISHNU'S" / "10 AVATARS"
(gold) / "AND WHY EACH ONE".

## Out
`out/dasha_out/` (dasha.mp4, cover.png, captions.txt).
