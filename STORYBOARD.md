# Ad 72: "PARSHURAMA vs the KING with 1000 ARMS" (Parshurama series, Part 4)

An 87.4 s Painted reel with Bangers captions, no voiceover and SFX: Part 2's retro cartoon foley for the king and Ravana,
Part 3's dark hits for the theft and the axe. It stands on its own and ends on the Navadurga card (no price).

**Pacing:** Part 3's shape. A fast cold open (0–9.8 s: the hook 3.6 s, the theft 3.6 s, "BIG MISTAKE." 2.6 s), then
Part 2's pace: 15 caption groups in ~74 s, two-line captions up ≥ 3.5 s, three-liners and the quote ≥ 4.5 s.

```
Logline: Kartavirya Arjuna, the king with a thousand arms who once caught Ravana like a monkey, is fed with his whole
         army by Sage Jamadagni's wish-cow, wants her, and has her dragged away crying with her calf. Rama comes home,
         goes after him alone, through 17 armies and 500 bows, and his axe ends it. He brings the cow home, and his
         father says: "We are brahmins, son. Our strength is forgiveness."
Why it should travel: a power ladder everybody knows one end of (RAVANA lost to this king; this king lost to
         PARSHURAMA), a cow taken from a sage (a gut punch for this audience), a hero's rampage, then a twist: the
         father isn't proud. The ask continues the ladder: "WHO HUMBLED PARSHURAMA?" (Ram, Bhishma, comment fights).
Hook:    Frame 0: the king on a crimson sunburst, his thousand arms fanned behind him, Ravana tied up and dangling from
         one fist, ten grumpy faces. "THIS KING HAD 1000 ARMS" / "AND CAPTURED" / "RAVANA." (gold)
World:   crimson sunburst → the ashram at sunset (the theft) → blood-maroon → the court → the Narmada at noon → Ravana's
         camp → blood-maroon → the river bank → the ashram by day → sunset → the dusk plain (the chase, the armies,
         the bows, the hill) → the sun → the dust at dusk (the crown) → the ashram by day → dusk → the sunburst → card.
Motif:   THE ARMS: a fan that sprouts ring by ring, holds back a river, holds Ravana up, holds 500 bows and a hill; after
         the axe there is only a crown rolling in the dust. And THE COW: glowing at the feast, crying when taken,
         nuzzling Rama at home.
```

## Characters
- **Kartavirya Arjuna** (`kartavirya()` in parshu4_props.js): Dasharatha's rig, young, a short black beard, the gold
  kirita, a crimson dhoti, a gold uttariya; `armFan()` behind him: 66 arms in three rings with gold bangles (`fan` 0..1
  sprouts them, `fanRange` aims them, `fanHeld: 'bow' | 'grip'`, `fanSil`). `kartReach()` is one long arm out to a fist
  (holding Ravana).
- **Ravana**: the shared chibi `ravana()`; `ravanaTied()` folds his arms away and ropes him; `spread: .62` narrows the
  head row when he dangles.
- **Kamadhenu** (`kamadhenu()`): cow.js in pure white with a gold light; her calf is `cow({ calf: 1, coat: 'dhavala' })`.
- **Rama (young Parshurama)**: `parshurama()`, `flip: 1`, clean-shaven, as in Parts 2–3. **Jamadagni**: `jamadagni()`
  (Part 3). **The queens**: `queen4()` on Kaikeyi's rig. **Haihaya soldiers**: `soldier()` on Narad's rig, iron helmet,
  spear.

## Time constants (video s; shared by `src/scenes/parshu4.js` and `tools/parshu4_sfx.mjs`)
```js
B0 = 3.6, C0 = 7.2
D0 = 9.8, SPROUT = 11.0
E0 = 15.2, F0 = 20.2, WAVE = 21.4
G0 = 25.0, CAUGHT = 26.6
H0 = 30.0, I0 = 35.0, J0 = 39.6
K0 = 44.6, SEE = 46.4, L0 = 48.6
M0 = 53.0, N0 = 58.4, LOOSE = 59.8, N1 = 60.6
O0 = 63.4, LEAP = 64.5, AXE = 65.0
P0 = 68.0, Q0 = 72.6, R0 = 78.4, CARD = 83.4, END = 87.4
```

## Shots and reads (captions inside y 420–1500, left of x 930)
**The cold open (fast)**
- **A 0–3.6 · the hook.** The king, the fan, Ravana dangling. "THIS KING HAD 1000 ARMS" / "AND CAPTURED" / "RAVANA."
- **B 3.6–7.2 · the theft.** Sunset ashram: soldiers drag the white cow by a rope, tears. "THEN HE STOLE A COW" / "FROM
  PARSHURAMA'S FATHER."
- **C 7.2–9.8 · big mistake.** Rama close on blood-maroon; his eyes open and blaze; the axe pulses. "BIG MISTAKE."

**The story (Part 2's pace)**
- **D 9.8–15.2 · the boon.** The court, a column of light; he prays; the arms sprout ring by ring (pops). "KING
  KARTAVIRYA ARJUNA" / "PRAYED TO DATTATREYA" / "AND GOT 1000 ARMS."
- **E 15.2–20.2 · the Narmada.** Waist-deep, arms wide, the river heaped up behind him, two queens splashing. "IN THE
  NARMADA, HE STOPPED" / "THE RIVER WITH HIS ARMS."
- **F 20.2–25.0 · the flood.** Ravana munching outside his tent; a wave sweeps in; ten wet faces, a nightcap floats off.
  "THE RIVER FLOWED BACK" / "AND FLOODED RAVANA'S CAMP."
- **G 25.0–30.0 · caught.** Ravana storms in, dripping (blood-maroon); smash to the bank: the king holds him up by the
  crown, tied, swinging; the queens laugh. "RAVANA PICKED A FIGHT." / "THE KING CAUGHT HIM" / "LIKE A MONKEY!"
- **H 30.0–35.0 · the feast.** The ashram: Jamadagni, the glowing cow, soldiers whose leaf plates fill with sparkles, the
  king staring. "SAGE JAMADAGNI FED HIS ARMY" / "FROM HIS WISH-COW, KAMADHENU."
- **I 35.0–39.6 · greed.** The king close, a gold glint in his eyes, the cow behind. "A SAGE RICHER THAN A KING?" / "THE
  KING WANTED HER."
- **J 39.6–44.6 · taken.** Sunset: soldiers drag her off, both crying, the calf following; the sage sits, eyes shut.
  "HIS MEN DRAGGED HER AWAY," / "CRYING, WITH HER CALF."
- **K 44.6–48.6 · home.** Rama walks in smiling; the empty stake, a snapped rope; his face falls, then burns (push-in).
  "RAMA CAME HOME." / "THE COW WAS GONE."
- **L 48.6–53.0 · the chase.** The dusk plain, running, axe and bow, dust, a war drum. "HE TOOK HIS AXE AND BOW" / "AND
  WENT AFTER THE KING."
- **M 53.0–58.4 · 17 armies.** Ranks to the horizon; a brawl cloud; soldiers flung out swirl-eyed; Rama pops up, axe
  high. "THE KING SENT 17 ARMIES." / "RAMA FOUGHT THEM ALONE."
- **N 58.4–63.4 · 500 bows.** The fan holding a bow in every hand; the volley (59.8). 60.6 Rama with one bow, their
  arrows breaking on his. "HE SHOT 500 BOWS AT ONCE." / "RAMA HAD ONE."
- **O 63.4–68.0 · the axe.** The king lifts a hill with its trees; 64.5 Rama leaps against the sun, the axe blazing;
  65.0 white flash; a gold crown rolls through the dust and falls still. "ONE AXE." / "1000 ARMS."
- **P 68.0–72.6 · home.** The cow nuzzles Rama, the calf hops, a heart. "HE BROUGHT HER HOME," / "AND HER CALF."
- **Q 72.6–78.4 · the father.** Jamadagni close, calm, a teaching hand. "BUT HIS FATHER SAID:" / "\"WE ARE BRAHMINS,
  SON." / "OUR STRENGTH IS FORGIVENESS.\""
- **R 78.4–83.4 · the ask.** A podium: RAVANA (tied) < KARTAVIRYA < PARSHURAMA < a glowing "?". "WHO HUMBLED" /
  "PARSHURAMA?" / "COMMENT BELOW"
- **S 83.4–87.4 · the card.** `navCard()`.

## Sound
`tools/parshu4_sfx.mjs` → assets/parshu4_sfx.wav; assets/parshu4_mix.wav is it +17 dB through a limiter (0.8 ceiling):
−16.6 LUFS integrated, true peak −1.5 dB. Both kept out of git.

## Facts used
One version: the **Bhagavata Purana, Skandha 9, chapter 15** (verse numbers as in the BBT edition, vedabase.io).

| Beat | Source |
|---|---|
| Kartavirya Arjuna, king of the Haihayas, worshipped Dattatreya and got a thousand arms, invincibility | Bhagavata 9.15.17–19 |
| Sporting in the Narmada with women, he stopped the river with his arms | 9.15.20 |
| The water flowed back and flooded Ravana's camp; Ravana couldn't bear his power | 9.15.21 |
| Ravana offended him before the women; he seized him effortlessly, held him at Mahishmati and let him go, "like a monkey" (*kapir yathā*) | 9.15.22 |
| Out hunting, he came to Jamadagni's ashram | 9.15.23 |
| The sage received the king, his ministers and army, providing everything through the kamadhenu | 9.15.24 |
| Seeing the sage's wealth surpass his own, he (and the Haihayas) wanted the cow | 9.15.25 |
| He had his men take the cow, crying (*krandatīm*), with her calf, to Mahishmati | 9.15.26 |
| Rama came back, heard, and was furious | 9.15.27 |
| He took up his axe, shield, bow and quiver and went after the king | 9.15.28 |
| The king sent 17 akshauhinis; Rama destroyed them alone | 9.15.30–32 |
| The king fixed arrows on 500 bows at once with his thousand arms; Rama cut them with one bow | 9.15.33 |
| The king tore up hills and trees; Rama cut off his arms with the axe | 9.15.34 |
| ... and his head (never shown: the crown in the dust); the king's sons fled | 9.15.35 |
| Rama brought the cow and calf home to his father | 9.15.36 |
| Jamadagni: "Killing a king is a sin; we brahmins are worshipped for forgiveness" | 9.15.38–40 (39: *vayaṁ hi brāhmaṇās tāta kṣamayārhaṇatāṁ gatāḥ*) |
| Atone at the holy places; Rama did, for a year | 9.15.41, 9.16.1 |

**Other versions:** the Mahabharata (Vana Parva 3.116.19–25) tells it briefly: the king takes the homa cow's calf, Rama
cuts his thousand arms with arrows from a bow, and his sons then kill Jamadagni (Part 5's story). Ravana's capture is
also in Valmiki's Uttara Kanda (Ravana fights Arjuna at the Narmada and is taken to Mahishmati; Pulastya has him
released): it backs "RAVANA PICKED A FIGHT."

**On screen, honestly:** "PRAYED TO" is our gentle word for *ārādhya* (worshipped). The captions name the axe and the bow
(he also took a shield and quiver). "17 ARMIES" is 17 akshauhinis. "OUR STRENGTH IS FORGIVENESS" is our wording of
9.15.39. Not claimed: Ravana munching in his camp, the nightcap, the queens' laughter, his fist on Ravana's crown, the
plates filling with sparkles, the stake and rope, the hill's two trees, the crown rolling, the podium. The order in the
Bhagavata (Kartavirya, then the pilgrimage, then Renuka) differs from the Mahabharata's (Renuka first) that Part 3
followed; this part says nothing about order.

## Cover
`src/scenes/parshu4_cover.js` (`cover.html`): Rama close with the axe, the king's fan of arms behind him on the
sunburst; the orange PART 4 pill over "PARSHURAMA" (gold) / "VS THE KING" / "WITH 1000 ARMS" (red).

## Out
`out/parshu4_out/` (parshu4.mp4, cover.png, captions.txt; the pinned comment answers the follower who asked for
Vishvamitra vs Vasishtha: another king who wanted a sage's wish-cow).
