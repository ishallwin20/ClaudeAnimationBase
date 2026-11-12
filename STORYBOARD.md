# Ad 86: "The day baby HANUMAN got 8 SUPERPOWERS" (Hanuman series, Part 2)

A 91.6 s Painted reel with Bangers captions, no voiceover, retro cartoon SFX and music only as mild beds (a plucked
vamp under the boons, a music box under the ask). Part 2 of the 10-part Hanuman Ji series (`HANUMAN_SERIES.md` on
`main`); it stands alone, and ends on the no-price Navadurga card.

```
Logline: Everyone knows baby Hanuman leapt at the sun and Indra's thunderbolt struck him down. Few know what came
         next: his father, the Wind, stopped blowing, nothing in the three worlds could breathe, and to make peace
         eight gods each gave the child a boon. Counted 1 to 8.
Why it should travel: a number in the hook that has to be paid off (viewers stay to count), a power bar that fills
         on screen, a "which would you pick, 1 to 8" comment, and one nugget to share: Hanuman means "the one with
         the (broken) jaw".
Hook:    Frame 0: Bal Hanuman standing on plain warm gold, the eight boon icons circling him (Part 1's tease shot,
         now with icons). Caption up: "THE DAY BABY HANUMAN" / "GOT 8 SUPERPOWERS" (gold).
World:   warm gold (hook) → morning sky → storm → the mountain and its cave → a grey, still sky → the cave, filling
         with Brahma's gold → a stage of light tinted by each god in turn → the forest ashram → warm gold → the card.
Motif:   THE POWER BAR. Eight numbered slots at the bottom of the safe band; each boon's icon pops into its slot as
         its light lands (the same fanfare a step higher each time); all eight go grey, left to right, at the
         rishis' curse; they are lit again and hop in turn for the ask.
Arc:     thrilled → greedy for the "fruit" → knocked out → (Vayu) shocked, weeping, furious → the world choking →
         tender (Brahma's touch) → the baby delighted eight times over → far too pleased with himself → puzzled.
Cinema:  the wind stops into four seconds of near silence (one slow heartbeat), then Brahma's om; the wind comes
         back as one big rush on the cut to joy.
Ending rhyme: the ask is the baby on frame 0's warm gold with the eight icons, now numbered, in their slots.
```

## Characters
- **Bal Hanuman** (shared, `src/bal_hanuman.js`): stand, sit, fly; `jaw` + `plaster` from the vajra until the name.
- **Indra on Airavata**, **Indra** alone (shared `src/indra.js`), **Surya** (`src/surya.js`), **Yama** (`src/yama.js`),
  **Shiva** (`src/shiva.js`), **Brahma** (four-faced, `src/ramayan.js`), **Vayu** (`src/vayu.js`, no pack).
- **Varuna, Kubera, Vishvakarma** (NEW, series kit `src/hanuman_series.js` on `main`): Shani's rig through `yama()`:
  Varuna in sea colours with his noose, Kubera in gold and emerald with his mace and a purse, Vishvakarma
  white-bearded with a hammer.
- **Two rishis** (`rishi()`), **Hanuman grown up** (`hanuman()`, the tease).

## Time constants (video s; shared by `src/scenes/hanu2.js` and `tools/hanu2_sfx.mjs`)
```js
LOOK = 1.2, FLEX = 2.4, L0 = 4.4, J0 = 8.0, THROW = 9.2, HIT = 9.7
V0 = 11.6, VIN = 12.0, ANGRY = 13.2, TOCAVE = 14.5, S0 = 15.8
F0 = 20.2, BRAHMA = 20.5, TOUCH = 23.0, WAKE = 23.7, EYES = 24.4, BREATH = 25.0, G0 = 26.2, SLOTS = 28.0
BN = [30.2, 38.0, 42.8, 46.8, 50.8, 54.6, 58.4, 62.6], NAME0 = 34.2, ALL0 = 66.4
GIVE = .9, LAND = 1.7, GAG = 2.2            // inside each boon: the light leaves the god, lands, the gag
K0 = 70.4, CRACK = 71.6, K2 = 74.6, CURSE = 75.6, DRAIN = 76.4, ASK0 = 79.4, NEXT0 = 84.0
CARD = 87.6, END = 91.6
```

## Shots and reads (captions inside y 420–1500, left of x 930; 2-liners ≥ 3.5 s, 3-liners ≥ 4.5 s)
The "HANUMAN · PART 2" pill sits bottom left of the safe band for the opening only (0–11.4 s), the source line
("VALMIKI RAMAYAN · UTTARA KANDA") beside it from 4.7 s; both fade out before the mountain (owner's rule, 11 Nov).

- **A 0–4.4 · the hook.** The baby and the eight icons circling; "THE DAY BABY HANUMAN" / "GOT 8 SUPERPOWERS" up
  from frame 0 to 4.25. 1.2 he looks round at them; 2.4 fists up, a hop, a giggle. [out: sky wipe]
- **B1 4.4–8.0 · the leap.** He flies up at a sun with a face (it notices him at 6.0 and gasps). 4.5–7.9 "HUNGRY, HE
  LEAPT AT THE SUN," / "THINKING IT WAS A FRUIT!"
- **B2 8.0–11.6 · the vajra.** Storm; Indra on Airavata rises on the right; the baby makes for the big white
  "fruit"; 9.2 the throw, 9.7 the hit (flash, shake); he spins away and falls; Indra: "oh." 8.1–11.5 "INDRA'S
  THUNDERBOLT" / "STRUCK HIM DOWN." [out: rock wipe]
- **C 11.6–15.8 · Vayu.** The mountain and its cave; the baby lies still, his jaw swollen. 12.0 Vayu swoops in, 12.6
  weeps, 13.2 is furious, 13.7 gathers him up, 14.5 carries him into the cave. 11.7–15.7 "VAYU, HIS FATHER, WAS
  FURIOUS." / "HE TOOK HIS SON INTO A CAVE…" [out: grey wipe]
- **D 15.8–20.2 · the wind stops.** A grey, still sky: a leaf and a bird stuck in mid-air; Indra and Airavata holding
  their breath and turning blue; Surya, hands at his throat. Almost silent. 15.9–20.1 "…AND THE WIND STOPPED." / "NO
  ONE COULD BREATHE." [out: cave wipe]
- **F 20.2–26.2 · Brahma.** Inside the cave, Vayu sulking with the child in his arms. 20.5 Brahma comes down on his
  lotus and the cave fills with gold. 20.3–23.6 "BRAHMA CAME TO THE CAVE" / "AND TOUCHED THE CHILD…" 23.0 a spark
  from his hand; 23.7 a yawn: "…AND HE WOKE UP!" (to 26.1); 24.4 his eyes open, Vayu lifts him, hearts; 25.0 the wind
  rushes through again.
- **G 26.2–30.2 · the ask.** Brahma, speaking; the baby looks up. 26.3–30.2 "\"THIS CHILD WILL DO GREAT THINGS." /
  "GODS, GIVE HIM YOUR BLESSINGS!\"" 28.0 the eight empty slots tick in. [out: gold wipe]
- **The eight boons, 30.2–66.4.** One stage, tinted by the god: the god pops in on a cloud on the right, the baby
  sits on a cloud on the left. Each: 0 the stamp "N · NAME" (gold) and the boon in two lines; 0.9 a light leaves the
  god; 1.7 it lands, the slot fills; 2.2 the gag.
  1. 30.2 **Indra** (sheepish, no vajra, his lotus garland lifted): "MY THUNDERBOLT WILL NEVER HURT HIM AGAIN." A
     little bolt drops on the baby's head and bounces off.
     **34.2–38.0 the name:** push in on the baby patting his plastered jaw, a "HANU = JAW" label: "\"MY VAJRA BROKE
     HIS JAW, HIS HANU." / "SO CALL HIM HANUMAN!\""
  2. 38.0 **Surya**: "A SPARK OF MY OWN LIGHT. AND I WILL BE HIS TEACHER." He glows; a little book pops into his hands.
  3. 42.8 **Varuna**: "WATER WILL NEVER HARM HIM." A wave rolls over; he bobs up on it, laughing.
  4. 46.8 **Yama** (stern, red-eyed, then he smiles): "HE WILL NEVER FALL SICK." Rosy cheeks, a flex, hearts.
  5. 50.8 **Kubera**: "MY MACE WILL NEVER HURT HIM." A mace bonks him and bounces away.
  6. 54.6 **Lord Shiva**: "NOR WILL ANY WEAPON OF MINE." The baby joins his hands.
  7. 58.4 **Brahma**: "NO BRAHMA-WEAPON. AND A LONG, LONG LIFE." Lotus petals circle him.
  8. 62.6 **Vishvakarma**: "NO WEAPON I EVER MADE CAN HURT HIM." A sword, an arrow and a spear fly in, buckle and
     bounce off while he sits with his eyes shut.
- **66.4–70.4 · all eight.** He stands, glowing, fists up; Brahma and Vayu behind; the slots hop. "8 GODS. 8
  SUPERPOWERS." / "\"NO ONE CAN DEFEAT HIM,\" SAID BRAHMA." [out: leaf wipe]
- **K1 70.4–74.6 · the ashram.** He bounces in with a yagna ladle, 71.6 lands on the pots (they split, the ladle
  snaps), bounces off grinning; two rishis gasp. 70.5–74.5 "BUT THEN HE WENT WILD" / "IN THE RISHIS' ASHRAM…"
- **K2 74.6–79.4 · the curse.** The light cools; the rishis raise their hands; 75.6 pale sparks settle on him; 76.4
  his glow lifts out of him and the eight slots go grey one by one; 77.6 a "?". 74.7–79.3 "SO THE RISHIS MADE HIM" /
  "FORGET HIS POWERS…" / "UNTIL SOMEONE REMINDED HIM." [out: peach wipe]
- **79.4–84.0 · the ask.** The baby on warm gold over the lit, numbered slots, hopping in turn. "WHICH POWER WOULD"
  / "YOU PICK?" / "COMMENT 1 TO 8!"
- **84.0–87.6 · next.** Hanuman grown up, a finger to his lips, a wink, a "?". "NEXT: HANUMAN MEETS RAM…" / "IN
  DISGUISE!"
- **card 87.6–91.6.** `hsCard()` (the no-price Navadurga card). It ends on the full card.

## Sound (tools/hanu2_sfx.mjs → assets/hanu2_sfx.wav → assets/hanu2_mix.wav at −16 LUFS)
Eight chimes for the eight lights, the leap's rising slide, thunder and a low drone, the vajra's zap and a drum, the
fall; Vayu's whoosh, a sob, an angry buzz; the air going out, then near silence with one slowing heartbeat; Brahma's
om and a shimmer, the touch, the yawn, the wind rushing back with birds; ticks for the slots; per boon a drum and a
three-note call (a pentatonic step higher each time), the god's buzzy voice, the light's slide, a chime up the scale,
and its own gag (a small zap and a boing, a shimmer, a splash, hearts, a bonk, an om, a harp run, three boings); a
fanfare chord for all eight; scampering pizzicato, the crash of pots, the rishis' gasp; a cool pad and the eight
chimes back down the scale as the slots go grey; a music box under the ask and the tease; card pops.
`ffmpeg -af loudnorm=I=-16:TP=-1.5:LRA=11` makes the mix.

## Facts used
**Valmiki Ramayana, Uttara Kanda 35–36** (Agastya to Ram; read in Sanskrit, verse numbers as in the Rashtriya
Sanskrit Vidyapeetha, Tirupati text at heritage.iitk.ac.in/VRAM/7.35.N and 7.36.N):
- 35.21–24: Anjana had gone for fruit; the baby, hungry, saw the rising sun, red as japa flowers, and leapt at it
  "out of greed for a fruit".
- 35.31–46: Rahu complains to Indra; Indra comes on Airavata; the child runs at Airavata too, taking him for a fruit;
  Indra, "not very angry", strikes him with the vajra. (Rahu is left out: the sun reel told it.)
- 35.47: he fell on a mountain and his left jaw (hanu) broke.
- 35.48–49: Vayu was angry with Indra; he drew in his movement and went into a cave, taking his child.
- 35.51–52, 60–62: all beings were left without breath, stiff as wood; "the wind is breath, the wind is joy".
- 35.53–65: the gods and all creatures ran to Brahma; he went with them to where Vayu sat with his son.
- 36.2–4: Vayu fell at Brahma's feet; Brahma raised him and stroked the child, who came back to life "like a crop
  given water".
- 36.5–6: seeing him alive, the wind moved in all beings again, and they were glad.
- 36.7–9: Brahma to the gods: "this child will have work of yours to do: give him boons, to please the Wind."
- 36.10–12, **Indra**, lifting a garland of lotuses: "because his jaw (hanu) was broken by my vajra, he shall be
  called Hanuman"; "from today my vajra cannot kill him".
- 36.13–15a, **Surya**: "I give him a hundredth part of my light; when he can study, I will give him the shastras,
  and he will be eloquent; none will equal him in them." (On screen: "a spark of my own light".)
- 36.15, **Varuna**: no death for him from my noose or from water, even in a million years.
- 36.16, **Yama**: safe from my staff, free of illness always, and never downcast in battle. (On screen: the second.)
- 36.17, **Kubera**: "this mace of mine will not kill him in battle."
- 36.18, **Shiva**: he cannot be killed by me or by my weapons.
- 36.19, **Brahma**: he cannot be killed by any Brahma-weapon; long-lived and great-souled.
- 36.20–21, **Vishvakarma**: he cannot be killed by the divine weapons I have made; he will live long.
  (The order on screen is the text's: Brahma is seventh, Vishvakarma eighth.)
- 36.23–25: Brahma to Vayu: "a terror to enemies, safe for friends, your son will be unconquerable (ajeya)"; able to
  take any form and go anywhere; he will do deeds for Ravana's fall and Ram's joy.
- 36.28–33: full of his new strength he troubled the rishis' ashrams: ladles and vessels broken, the fire, the bark
  cloth torn; his fathers forbade him and he went on.
- 36.34–36: the rishis of Bhrigu's and Angiras's lines, "not very angry", cursed him: "the strength you trouble us
  with you will not know for a long time; when your fame is recalled to you, it will grow." He then went gently.
- The tease (Part 3): Kishkindha 2–4.
- Not said, because the text does not: that the gods were sorry (Indra's sheepish face is performance); that Indra
  put the garland on him (he only lifts it); any boon beyond these eight.
- Performance only (no plot claims): the sun's face, the baby's gags after each boon (the bolt, the book, the wave,
  the flex, the mace, the joined hands, the petals, the buckled weapons illustrate the boon just spoken), Yama's
  smile, the power bar, Hanuman's wink in the tease.

## Cover, caption, pinned comment
`src/scenes/hanu2_cover.js` (`cover.html`): the baby standing, glowing, the eight icons round him, the orange PART 2
pill over "BABY HANUMAN GOT" / "8 SUPERPOWERS" (gold). The Instagram caption and the pinned comment are in
`out/hanu2_out/captions.txt`.
