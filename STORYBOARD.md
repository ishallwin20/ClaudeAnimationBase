# Ad 70: "His father ordered PARSHURAMA to KILL HIS MOTHER" (Parshurama series, Part 3)

An ~87 s Painted reel with Bangers captions, no voiceover, and dark, spare SFX (not cartoon foley this time). It stands
on its own and ends on the Navadurga card (no price).

**Pacing (owner, 1 Nov 2026): "the starting few seconds fast enough (like in Part 1), the latter ones the same pace as
Part 2."** So there are two speeds:
- **The cold open (0–10.2 s)** cuts like Part 1: the hook (3.4 s), the father's order (1.4 s), four refusals in four
  whip-pans (0.7 s each), "ONE DIDN'T." (2.6 s). Three short, one-line caption groups after the hook.
- **The story (10.2–83.4 s)** keeps Part 2's pace: 13 caption groups in ~73 s, two-line captions up ≥ 3.5 s, quotes
  ≥ 4.2 s, picture alone between them, shots ≥ 4 s, apart from the deliberate shot / reverse on the order.

**Intensity (owner: "if it's intense, make it really intense"):** this part is the darkest in the series, so it plays as
a thriller, not a cartoon. Blood-maroon grounds, burning eyes, a sub drone and a heartbeat, silence before every hit.
The killing is NEVER shown: a silhouette lifts the axe against the sun, the heartbeat slows, half a second of silence, then
cut to the ashram's lamp as its flame goes out, and black. "HE OBEYED." in the dark.

```
Logline: Jamadagni orders his sons to kill their mother Renuka. Four refuse and his curse takes their minds. Rama, the
         youngest, obeys. Pleased, the sage offers boons, and Rama spends them undoing it all: his mother alive, with no
         memory of it, and his brothers healed.
Why it should travel: the most shocking episode in Parshurama's life, told straight from the Mahabharata, with a twist
         almost nobody knows (he used the boons to bring her back, and she never knew). It ends on a real debate:
         "4 SONS REFUSED. 1 OBEYED. WHO WAS RIGHT?" — a question with no easy answer drives comments.
Hook:    Frame 0: young Parshurama close on a blood-maroon ground, the axe trembling in his hand, eyes wide, a sweat drop.
         Caption up: "HIS FATHER ORDERED" / "PARSHURAMA" (gold) / "TO KILL HIS MOTHER." (red).
World:   blood-maroon (the cold open) → the ashram by day → the river at noon (bright, lush) → a bokeh close → the ashram
         at dusk (cold blue) → blood-maroon (DHIK!) → dusk, then violet (the curse) → the sunset ridge → blood-maroon (the
         order) → the sun (the silhouette) → black (the lamp) → night → night lit gold by the lamp (the boons) → dawn →
         blood-maroon (the ask) → the card.
Motif:   THE LAMP. It goes out at the killing and lights again at the first boon; its gold light brings her back.
         Second motif: THE EYES. The father's burning eyes (red with anger, violet with the curse), the brothers' blank
         eyes, Rama's wide then teary eyes, Renuka's starlit eyes at the river and her happy, closed eyes at the end.
Arc:     dread (frame 0) → shock (the order, the refusals) → calm (the family) → longing (the river) → guilt (home) →
         fury ("DHIK!") → terror (the curse) → heartbreak (the order to Rama) → silence (the lamp) → mercy (the boons) →
         tears and relief (she never knew) → debate (the ask).
```

## Characters
- **Rama (young Parshurama)**: shared `parshurama()`, `beard: false`, `flip: 1` (the axe in his right hand), as at the end
  of Part 2: he has Shiva's axe. Against the sun in L his palette is all one dark (`silPal(PSR)`).
- **Jamadagni**: `valmiki()` with a long dark-grey beard and an ochre dhoti (`jamadagni()` in parshu3_props.js); his
  eyes blaze (`eyeBlaze`) red in anger, violet as he curses.
- **Renuka**: `parvati()` with no crown, a rose saree and a turmeric blouse (`renuka()`); a clay water pot on her hip at
  the river and coming home; `eyeStars` as she gazes at the king; water drips as she comes home.
- **The four elder brothers** (`brother(i)`, BROS): Parshurama's rig without axe, quiver, hide or aura, bearded, each
  in his own cloth: Rumanvan (ochre), Sushena (rust), Vasu (olive), Vishvavasu (undyed). Name tags as they're ordered.
  Cursed: `dazed()` (blank white eyes, a violet fog, slow stars), slumped.
- **King Chitraratha and his wife**: `dasharatha()` (young, black beard, sky-blue and gold) with a pink lotus garland,
  and `kaikeyi()` in sea-green; waist-deep in the river, splashing, far off.

## Time constants (video s; shared by `src/scenes/parshu3.js` and `tools/parshu3_sfx.mjs`)
```js
B0 = 3.4, C0 = 4.8, D0 = 7.6
E0 = 10.2, WALK = 13.6
F0 = 15.2, G0 = 20.6
H0 = 25.6, OPEN = 27.4, DHIK = 30.4
I0 = 34.0, J0 = 39.4, CURSE = 40.6
K0 = 45.0, FATHER = 47.2, REACT = 49.6
L0 = 51.6, LAMP = 55.1, M0 = 59.0
N0 = 64.2, B1 = 65.0, B2 = 67.6, B3 = 70.2
O0 = 73.8, P0 = 79.0, CARD = 83.4, END = 87.4
```

## Shots and reads (captions inside y 420–1500, left of x 930)
**The cold open (fast)**
- **A 0–3.4 · the hook.** Rama close on blood-maroon, the axe trembling, a slow push. "HIS FATHER ORDERED" /
  "PARSHURAMA" / "TO KILL HIS MOTHER." up from frame 0 (4.4 s of read with the offset). Sub drone, heartbeat. [white flash]
- **B 3.4–4.8 · the order.** Jamadagni close, eyes blazing red, his arm thrust out to the side, pointing. Thunder, a boom,
  a low "Kill her." No caption (the hook said it).
- **C 4.8–7.6 · four refuse.** Four whip-pans, one brother each, eyes shut, shaking his head. "4 SONS REFUSED." A drum and
  a "mm-mm" on each cut.
- **D 7.6–10.2 · one didn't.** Rama close: eyes open, hard; the axe's glow pulses with a heartbeat. "ONE DIDN'T." (gold)
  [iris to black]

**The story (Part 2's pace)**
- **E 10.2–15.2 · the family.** The ashram by day: Jamadagni in tapas, Renuka, the five sons in a row, the youngest
  glowing, tagged RAMA. 13.6 they set off to gather fruit. "SAGE JAMADAGNI AND RENUKA" / "HAD 5 SONS. RAMA WAS THE
  YOUNGEST." · 4.6 s
- **F 15.2–20.6 · the river.** Renuka on the near bank with her water pot, looking across: a king and his queen
  waist-deep, splashing and laughing, a lotus garland, his gold catching the sun. "ONE DAY AT THE RIVER, SHE SAW" / "A KING
  PLAYING IN THE WATER." · 4.8 s
- **G 20.6–25.6 · her heart wandered.** Renuka close over bokeh: a slow smile, a blush, starlight in her eyes. "FOR ONE
  MOMENT," / "HER HEART WANDERED." (gold) · 4.4 s. A low, wrong swell as the frame cools to dusk.
- **H 25.6–30.4 · home.** The ashram at dusk: she walks in with the pot, head down, dripping, trembling; her soft glow
  fades; Jamadagni's eyes open (27.4). "SHE CAME HOME, SHAKING." / "THE SAGE SAW IT IN HER FACE." · 4.2 s. A riser, then
  0.2 s of silence.
- **H2 30.4–34.0 · "DHIK!"** Smash to Jamadagni close, roaring, eyes blazing, a shock ring, a hard shake, a red flash.
  "\"DHIK!\"" (red, huge) / "(SHAME!)" · 3.6 s. A taiko, thunder, a ring after.
- **I 34.0–40.6 · the order.** Dusk: Jamadagni on the left, pointing; the four brothers in a row, frozen, wide-eyed,
  sweating; their name tags pop in (RUMANVAN, SUSHENA, VASU, VISHVAVASU). "HE ORDERED EACH SON:" / "\"KILL YOUR
  MOTHER.\"" (red) · 4.7 s. A heartbeat quickening.
- **J 40.6–45.0 · the curse.** His eyes go violet, a curse wave rolls over them, a violet flash; one by one they slump,
  blank-eyed, dazed. "THEY STOOD SILENT." / "HIS CURSE TOOK THEIR MINDS." (violet) · 5.0 s
- **K 45.0–51.6 · Rama comes home; the order.** 45.0 the sunset ridge: Rama walks in, the axe on his shoulder, and stops
  at his dazed brothers (picture alone). 47.2 Jamadagni close, red: "\"KILL YOUR MOTHER, SON." / "AND DO NOT GRIEVE.\""
  (4.2 s, across the cut) · 49.6 the reverse: Rama close, the sun behind him; his face falls; tears.
- **L 51.6–59.0 · he obeyed.** A silhouette against the sun slowly lifting the axe; the heartbeat slows; the frame
  sinks to black; silence. 55.1 the ashram's lamp, close: the flame goes out, a curl of smoke. "HE OBEYED." in the dark
  · 3.0 s. A ringing tone, one deep bell.
- **M 59.0–64.2 · the boon.** Night; Jamadagni, calm now, a hand raised in blessing; Rama kneeling, head bowed.
  "\"WHAT YOU DID WAS HARD, SON." / "ASK FOR ANY BOON.\"" (gold) · 4.6 s
- **N 64.2–73.8 · the boons.** "RAMA ASKED:" then the list builds: 65.0 "1. BRING MY MOTHER BACK." (the lamp catches,
  its gold light spreads, and Renuka forms out of the light, eyes closed, in sparkles: a harp glissando and a choir pad);
  67.6 "2. LET HER NEVER REMEMBER IT."; 70.2 "3. HEAL MY BROTHERS." (the violet fog lifts, their eyes come back). All up
  to 73.6: 9.1 s for the first line, 3.4 s for the last.
- **O 73.8–79.0 · she never knew.** Dawn: Renuka, smiling, lays her hand on Rama's head; he weeps and smiles. "SHE WOKE UP
  SMILING…" / "SHE NEVER KNEW." (gold) · 4.6 s
- **P 79.0–83.4 · the ask.** Blood-maroon: the four brothers on the left, VS, Rama on the right with the axe and a warm
  aura. "4 SONS REFUSED. 1 OBEYED." / "WHO WAS RIGHT?" (gold) / "COMMENT BELOW" · 4.2 s
- **Q 83.4–87.4 · the card.** `navCard()` (from Part 2): the Navadurga Set, OUT NOW, rishikatha.com, link in bio, follow.

## Sound
`tools/parshu3_sfx.mjs` → assets/parshu3_sfx.wav; assets/parshu3_mix.wav is it +16 dB through a limiter (−1.9 dBFS
ceiling): −16.3 LUFS integrated, true peak −1.7 dB. Both kept out of git. The soft stretches (morning, river, boons,
waking) are lifted in the script (LIFT) so they carry on a phone. Never cartoon: no boings or squeaks in this part.

## Facts used
All from the **Mahabharata, Vana Parva 3.116** (Akritavrana tells Yudhishthira the story at Mahendra mountain), verses
quoted from the Sanskrit text (enjoylearningsanskrit.com, ch. 116; Ganguli's Vana Parva section CXVI is the same).

| Beat | Source |
|---|---|
| Jamadagni, of great austerities; he married Renuka, King Prasenajit's daughter | MBh 3.116.1–3 |
| Five sons, Rama the fifth and youngest | 3.116.4 (*kumārāś catvāro jajñire rāmapañcamāḥ … rāma āsīj jaghanyajaḥ*) |
| The sons had gone out for fruit; Renuka went to bathe | 3.116.5 (*phalāhāreṣu sarveṣu gateṣv atha suteṣu*) |
| She saw King Chitraratha of Martikavata playing in the water with his wife, wearing a lotus garland | 3.116.6–7 (*krīḍantaṃ salile … sabhāryaṃ padmamālinam*) |
| She longed for him ("her heart wandered" is our gentle wording for *spṛhayāmāsa*) | 3.116.7 |
| She came home wet and shaken; her husband knew | 3.116.8 (*klinnāmbhasi … praviveśāśramaṃ trastā tāṃ vai bhartānvabudhyata*) |
| He saw her fallen from steadiness, her radiance gone, and cried "Dhik!" (shame) | 3.116.9 (*dhik-śabdena garhayāmāsa*) |
| The four sons came: Rumanvan the eldest, Sushena, Vasu, Vishvavasu | 3.116.10 |
| He ordered each in turn to kill their mother; dumbstruck, they said nothing | 3.116.11 |
| He cursed them; they lost their minds and became like beasts and birds | 3.116.12 (*cetanāṃ jahuḥ, mṛgapakṣisadharmāṇaḥ*) |
| Rama came last; Jamadagni: "Kill this mother of yours, and do not grieve, son" | 3.116.13–14 (*jahīmāṃ mātaraṃ … mā ca putra vyathāṃ kṛthāḥ*); the caption drops the word *pāpām* (sinful) |
| Rama took the axe and did it (never shown) | 3.116.14 (*tata ādāya paraśuṃ rāmo …*) |
| His anger left him; "You did a hard thing at my word: choose your wishes" | 3.116.15–16 (*kṛtaṃ te karma duṣkaram, vṛṇīṣva kāmān*) |
| Rama asked: his mother raised up, no memory of the killing, the sin not to touch him, his brothers restored, no equal in battle, a long life; all granted | 3.116.17–18 |

**Version:** the Mahabharata's. The Bhagavata (9.16.1–8) sets it after the Kartavirya war, at the Ganga with the Gandharva
king Chitraratha, and has Rama kill his brothers too, "knowing his father's power"; we don't use it on screen (the series
order follows the Mahabharata, where Renuka comes before Kartavirya, 3.116.19 on). It goes in the pinned comment as the
answer to "why did he obey?", labelled as the Bhagavata's.

**On screen, honestly:** the captions list three of the boons ("1. BRING MY MOTHER BACK. 2. LET HER NEVER REMEMBER IT.
3. HEAL MY BROTHERS.") and never say "only"; the others (no sin on him, no equal in battle, a long life) are in the
pinned comment. "SHE WOKE UP SMILING" is the picture of *mātur utthānam* (his mother's rising) with no memory. The water
pot, the lamp, the light she rises from and her hand on his head are staging, not claims. Renuka is never called sinful
on screen: she is worshipped as a goddess (Renuka Devi, Yellamma) by millions.

**No gags this time.** The comedy rule is "the performance carries it"; this part is played straight.

## Cover
The series template, `src/scenes/parshu3_cover.js` (`cover.html`): Rama close on blood-maroon with the axe, eyes wide; the
orange PART 3 pill over "HIS FATHER ORDERED" / "PARSHURAMA" (gold) / "TO KILL HIS MOTHER" (red), inside the 3:4 crop.

## Build notes
- Silhouette: `silPal(PSR)` maps every colour to one dark and `col/dk/lt` do the skin; `tilak: false`.
- `dazed()` paints blank eyes over narada-rig eyes via `naradaEye()` (the rig's own eye kinds don't include 'blank').
- `whipStreaks()` is drawn before the captions so a cut never wipes a read.
- Out: `out/parshu3_out/` (parshu3.mp4, cover.png, captions.txt).
