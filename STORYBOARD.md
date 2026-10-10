# Reel: "Baby HANUMAN once tried to EAT the SUN." (Bal Hanuman · the mango sun)

A ~58 s captioned reel for followers, not a book ad (it ends on a Follow card). Baby Hanuman wakes up hungry and sees
the rising sun as a big ripe mango. He flies up, Surya doesn't burn him, and he swallows it, which the Hanuman Chalisa
itself says. He goes for Rahu too, then for Indra's white elephant. Indra's vajra hits his jaw. Papa Vayu stops all
the air in the world, Brahma brings him back, every god gives a boon, and Indra names him HANUMAN, for his *hanu*
(jaw). It ends where it began, with a real mango this time.

```
Logline: A hungry baby thinks the sun is a mango, and the whole sky pays for it; that's how he got his NAME.
Why it should travel: everyone knows Hanuman; almost everyone recites "leelyo tahi madhur phal janu" without picturing
         it. Cute (a chubby baby, puffed glowing cheeks), funny (everything looks like food), a never-knew-that payoff
         (hanu = jaw), and a devotional comment ask.
Hook:    Frame 0: Baby Hanuman sits in a dawn forest clearing, big eyes at us, caption already up:
         "Baby HANUMAN once tried" / "to EAT the SUN." (gold).
World:   a soft dawn forest clearing (lilac → peach sky, a far hill) → open sky (clouds, birds) → the blazing sun, gold
         → a sudden starry night (the sun is in his cheeks) → storm-blue sky with Indra → a rocky mountain peak →
         Vayu's cave (blue dark) → a frozen grey sky (no air) → Brahma's gold light → the clearing again, golden
         morning → the brand peach card.
Motif:   FOOD EYES: everything round becomes food to him (the sun = a mango, Rahu = a jamun, Airavata = a giant white
         fruit), shown as painted thought bubbles. The sun: mango → swallowed (glowing cheeks) → popped out → the sun
         that winks at him at the end, beside a real mango.
Arc:     sleepy-hungry → starstruck → determined (the leap) → bliss (cheeks full) → greedy (Rahu, Airavata) → BONK
         (dizzy) → limp (Vayu's arms) → waking, delighted → proud (the name) → happy, a real mango.
Ending rhyme: frame 0's clearing, hungry, looking at the sun → the same clearing, a basket of mangoes, the sun winks.
```

## Characters
- **Bal Hanuman** (new, shared: `src/bal_hanuman.js`). The Chalisa's look: *kanchan baran* (golden fur), *kanan kundal
  kunchit kesa* (gold ear rings, a curly tuft), a red langot with a gold waistband, the *janeu* thread, a sindoor
  tilak and a kajal nazar dot (a baby). A peach monkey face mask, big glossy eyes, a long curling tail. Poses `sit`,
  `stand`, `fly`. Cheeks `puff` + `cheekGlow` (the sun inside), the mouth `aam` (wide open), `jaw` (the bump on his
  left jaw after the vajra), `garland` (Indra's gold lotuses).
- **Indra on Airavata** (new, shared: `src/indra.js`). The white elephant with four tusks and a red-gold caparison,
  front view; Indra, gold crown and the vajra, rides his head.
- **Vayu** (shared, `vayu()`, no pack, no shades): Hanuman's father.
- **Surya**, **Rahu** (a head only, as in the myth), **Brahma** (ad 13's): drawn in `src/scenes/sun_props.js`.

## Time constants (video s; shared by `src/scenes/sun.js` and `tools/sun_sfx.mjs`)
```js
GRUMBLE = 1.6, B0 = 3.0, LOOK = 3.3, RISE = 4.0, SEE = 5.2, MANGO = 5.8, DROOL = 6.8, C0 = 8.0
WIGGLE = 8.0, LEAP = 8.9, D0 = 12.0
NOTICE = 12.3, SOFT = 13.3, AAM = 14.9, GULP = 15.5, E0 = 17.6
CHALISA = 17.7, F0 = 22.0
RAHU = 22.1, SPOT = 23.2, LUNGE = 24.5, FLEE = 24.9, G0 = 26.4
INDRA = 26.5, FRUIT = 28.6, JUMP = 29.4, WIND = 29.9, THROW = 30.5, HIT = 30.8, H0 = 31.0
FALL = 31.0, LAND = 32.4, I0 = 35.0
VAYU = 35.1, ANGRY = 36.5, STOP = 37.7, J0 = 40.4
BRAHMA = 40.5, TOUCH = 41.3, WAKE = 41.8, PHEW = 42.3, BOONS = 42.9, GARLAND = 44.3, K0 = 46.0
HANU = 46.1, NAME = 48.4, L0 = 50.4
BASKET = 50.6, GRAB = 51.3, WINK = 52.2, CHOMP = 52.8, ASK = 50.6, WIPE = 54.1
CARD = 54.4, FOLLOW = 55.0, PILL = 55.5, END = 58.4
```

## Shots and reads (captions inside y 420–1500, left of x 930; ≥ 2 s each, the ask 3 s+)
**A 0–3.0 · the clearing.** Up from frame 0: "Baby HANUMAN once tried" / "to EAT the SUN." Baby sits facing us,
blinks, tail curling. 1.6 his tummy GRUMBLES (belly wobble, rumble marks), he pats it, a pout.

**B 3.0–8.0 · hungry.** 3.0–5.1 "Maa had gone to pick fruit." / "He woke up HUNGRY." 3.3 he looks left (an empty
leaf plate), then right; 4.0 behind him the sun starts to rise, red-orange. 5.2 he turns to it: sparkle eyes.
5.2–8.0 "Then he saw a big, ripe…" / "MANGO." (gold). 5.8 the sun grows a stalk and a leaf (his eyes), 6.8 drool.

**C 8.0–12.0 · the leap.** 8.0–8.8 the butt-wiggle (a cat about to pounce), 8.9 LEAP (cut on action). 8.1–11.9
"Son of VAYU, the wind god…" / "…so up he FLEW!" He flies up through clouds, past two startled birds, arms out
for the sun, tail streaming.

**D 12.0–17.6 · the sun.** The sun fills the frame, a big gentle face. 12.3 Surya sees the baby coming: "?!".
12.3–14.7 "Surya Dev didn't burn him." 13.3 Surya's rays soften, he smiles: a sweet baby. 14.9 AAM: the baby's mouth
opens HUGE; 15.5 GULP: the sun slides into his mouth, the sky snaps to night, his cheeks puff and glow.
15.5–17.5 "He SWALLOWED it!" (gold).

**E 17.6–22.0 · the Chalisa.** Night, stars, the baby floats munching, cheeks glowing, light leaking from his lips.
"Even the Hanuman Chalisa says:" / "Leelyo tahi MADHUR PHAL janu" (gold) / "(he swallowed it, thinking: a sweet fruit)".

**F 22.0–26.4 · Rahu.** 22.1–24.3 "It was an ECLIPSE day." / "RAHU came to eat the sun…" Rahu, only a head, floats
in licking his lips and finds no sun; 23.2 he spots the glowing cheeks: "?!". A thought bubble over the baby: a
jamun. 24.4–26.3 "…and Baby went for HIM too!" 24.5 LUNGE; 24.9 Rahu shrieks and flees, crying.

**G 26.4–31.0 · Indra.** 26.5–28.5 "Then came INDRA," / "on his white elephant." Storm clouds; Indra on Airavata,
vajra in hand. The baby's thought bubble: a giant white fruit; hearts. 28.6–30.9 "…an even BIGGER fruit!" (gold).
29.4 he leaps at Airavata (who panics, trunk up); 29.9 Indra winds up; 30.5 throws; 30.8 HIT on the chin: a flash,
BONK, the sun pops out of his mouth and day comes back.

**H 31.0–35.0 · the fall.** 31.0 he tumbles down, spinning; 32.4 THUD on a mountain peak. 31.1–33.0 "Indra threw his
VAJRA…" 33.1–34.9 "…right on his JAW." He lies dazed: swirl eyes, stars circling, a bump on his left jaw.

**I 35.0–40.4 · Vayu.** 35.1 Vayu swoops down, scoops him up, worried → furious. 35.1–37.6 "Papa VAYU got SO angry…"
37.7 he wraps him close in a cave and the air STOPS: 37.7–40.3 "he STOPPED all the air!" (gold). A cut to the sky:
Indra, Airavata, Surya and Rahu on a cloud, cheeks puffed and turning blue, holding their breath; a leaf hangs in
mid-air.

**J 40.4–46.0 · Brahma.** 40.5 Brahma in gold light. 40.5–42.8 "BRAHMA woke him up," 41.3 a touch, 41.8 the baby
yawns awake, 42.3 the air rushes back (PHEW). 42.9–45.9 "and every god gave him a BOON." Sparkles fly into him one
by one (Surya's light, Varuna, Yama, Brahma); 44.3 Indra's gold lotus garland lands on his neck. He flexes.

**K 46.0–50.4 · the name.** Indra and the baby. 46.1–48.3 "Indra said: my vajra hit his HANU (jaw)…" 48.4–50.3
"So his name is:" / "HANUMAN." (huge gold). The baby pats his jaw, beaming.

**L 50.4–54.4 · the mango (the rhyme).** The clearing, golden morning, Surya smiling up in the sky. 50.6 a basket of
mangoes slides in (Maa is back); 51.3 he grabs one, holds it up beside the sun, 52.2 the sun WINKS, 52.8 CHOMP, bliss.
50.6–54.1 "Did you know this story?" / "Comment JAI BAJRANGBALI" (gold). 54.1 a saffron brush wipe.

**Card 54.4–58.4.** Peach; the RK logo; "Stories of our gods, for little ones"; baby Hanuman waving with his mango;
"Follow @therishikatha" (big); the rishikatha.com pill. Ends on the full card.

## Facts used
- Valmiki Ramayana, Kishkindha Kanda 66 (Jambavan to Hanuman) and Uttara Kanda 35–36 (Agastya to Rama): Anjana's son
  by Vayu. Hungry while his mother was out gathering fruit, the newborn saw the rising sun, red like a hibiscus, took it
  for a fruit and leapt up for it. Surya didn't burn him (a child, with a great task ahead). That day Rahu came to seize
  the sun; Hanuman went for him and Rahu fled to Indra. Indra came on Airavata; Hanuman took Airavata for a great fruit
  and rushed at it; Indra struck him with the vajra and he fell on a mountain, his left jaw (hanu) broken. Vayu took
  him into a cave and withdrew the air, and all beings choked. Brahma revived him with a touch, the gods gave boons
  (Indra a garland of lotuses and immunity from the vajra, Surya a share of his light and his teaching, Varuna, Yama,
  Kubera, Brahma…), and Indra said that since his hanu was struck by the vajra he would be called Hanuman.
- "Yug sahastra yojan par bhanu, leelyo tahi madhur phal janu" (Hanuman Chalisa, verse 18): he swallowed the sun,
  thousands of yojanas away, taking it for a sweet fruit. Popular tellings say a mango.
- Look: Hanuman Chalisa verses 4–5 (golden colour, earrings, curly hair, the munja thread).
