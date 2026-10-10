# Ad 13: "Imagine waking up as RAVANA." (10 heads, 1 morning · Books 1–3)

A ~61.6 s captioned reel that tests **pure comedy** after the hits of ads 10–12 (Sher's trilogy). It is timed for
Dussehra (20 Oct 2026) but works any day. The comedy is Ravana's morning with ten heads, each a personality. A real
story most people don't know follows: he offered his heads into the sacred fire for Brahma's boon and left humans out
of it ("like GRASS to me"). Guess who was human: RAMA. The ending is the Dussehra lesson that the ten heads are ten bad
habits, which is why we burn all ten. The ask is an identity question, "Which head are YOU in the morning?", and the
card sells Books 1–3 (no Book 7).

```
Logline: Ten heads sound powerful, until you have to share one alarm, one mirror, one stomach and one door. Then: why
         TEN? He gave them away for a boon, forgot humans, and a human (Rama) ended him; on Dussehra we burn all ten.
Why it should travel: everyone knows Ravana has ten heads; nobody has seen his MORNING. It is relatable (snooze,
         brushing, breakfast, a sneeze), and every head is someone you know (the sleepy one, the hungry one, the
         angry one). Add a "never knew that" fact (the heads into the fire, "humans are like grass") and a Dussehra
         lesson to save and share.
Hook:    Frame 0: Ravana sits up in bed, all ten heads asleep on ONE long pillow (zzz), caption already up: "Imagine
         waking up as" / "RAVANA." (gold).
World:   golden Lanka at dawn (lilac wall, gold headboard, an orange quilt) → a teal-tiled bathroom (we ARE the round
         mirror) → a peach dining hall with gold arches → a gold palace doorway → long ago: a dark forest, the sacred
         fire, a time-lapse sky → a sunrise with Rama's silhouette → Dussehra night (string lights, the effigy,
         fireworks, the crowd) → the bed again (morning) → the brand peach card.
Motifs:  TEN of everything in a wave left→right (wake-ups, burps, ACHOOs, pops through the door, tags, yawns).
         SLEEPY (head 0) never wakes (snore bubble), until the BOSS's mukut lands on him. The BOSS's crown.
Ending rhyme: frame 0's ten sleeping heads → the same bed, ten yawning heads with their name tags: "Which head are YOU?"
```

## The ten heads (src/ravana.js, `RV_HEADS`; the same in every shot)
0 SLEEPY (nightcap, snore bubble) · 1 HUNGRY (puffed cheeks, crumbs) · 2 SHOW-OFF (lashes, kiss curl, sparkle) ·
3 ANGRY (red) · 4 BOSS (tall mukut, smirk) · 5 SIDE-EYE (green, jealous) · 6 MINE! (gold tooth) · 7 FIBBER (shifty,
sweat) · 8 STUBBORN (eyes shut, chin up, "NO.") · 9 PRANKSTER (sly). Dussehra tags in the same order: LAZY · GREEDY ·
SHOW-OFF · ANGRY · EGO · JEALOUS · SELFISH · LIAR · STUBBORN · MEAN.

## Time constants (video s; shared by `src/scenes/heads.js` and `tools/heads_sfx.mjs`)
```js
TEN = 2.7, PEEK = 1.4, RING = 4.4, WAKE = 4.7 /* +.13/head */, REACH = 5.1, SMASH = 6.5, NINE = 7.3, YELL = 8.4, C0 = 9.5
BRUSH = 9.6, MIRROR = 12.0, SHOVE = 12.9, FIB = 13.4, D0 = 14.6
TRAY = 14.7, GOBBLE = 15.2, MINE = 16.4, SWELL = 16.9, UGH = 17.4, BURP0 = 18.2 /* +.16 ×10 */, E0 = 20.8
SNIFF = 21.0, AH = 21.4, ACHOO = 22.8 /* +.12 ×9 */, CROWN = 24.0, CLANK = 24.8, F0 = 25.6
OPIN = 25.7, SHOUT0 = 25.9 /* +.15 */, DOOR = 28.0, SMACK1 = 28.5, SMACK2 = 29.4, SQUEEZE = 29.8, POP0 = 30.0 /* +.09 */, G0 = 31.4
CRAZY = 31.5, PEN = 33.6, OFFER0 = 34.0 /* +.26 ×9 */, BRAHMA = 36.8, RESTORE = 38.0, WISH = 39.0, GRASS = 41.4,
FLICK = 42.0, HUMAN = 43.6, RAMA = 44.2, H0 = 46.0
BAD = 46.1, TAGS = 48.4 /* +.18 */, BURN = 51.0, FW = 51.2, I0 = 53.6
ASK = 53.7, WIPE = 56.8
CARD = 57.1, CARD_CAP = 57.2, COVERS = 57.4, PRICE = 58.1, LOGO = 58.4, PILL = 58.7, FOLLOW = 59.1, END = 61.6
```

## Shots and reads (captions inside y 420–1500, left of x 930; ≥ 2 s each, the ask 3 s)
**A+B 0–9.5 · the bed.** 0–2.6 "Imagine waking up as" / "RAVANA." (up from frame 0; zzz on three heads). 1.4 the
BOSS peeks one eye at us. 2.7–5.0 "TEN heads." / "ONE alarm." 4.4 the clock RIIINGs. 4.7 a wake-up wave, left to
right (nine "hm?!"s; SLEEPY stays asleep). 5.1–7.2 "TWENTY hands grabbed it." All twenty hands reach and pile on the
clock; 6.5 SMASH, the bits fly. 7.3–9.4 "Nine heads woke up." / "One did NOT." The camera pushes in on SLEEPY snoring;
8.4 ANGRY yells "WAKE UP!!" into his ear, the snore bubble pops, and he sleeps on, smiling. A whip pan out.

**C 9.5–14.6 · the bathroom (we are the round mirror; the outer heads don't fit in it).** 9.6–11.9 "Then: brushing" /
"320 TEETH." Ten toothbrushes, foam. 12.0–14.5 "With ONE mirror." SHOW-OFF slides to the middle, bigger and kissy;
12.9 the BOSS shoves him out (bonk, dizzy). 13.4 FIBBER holds up a DRY brush: "DONE!" (the pinned-comment gag).
A foam-white brush wipe.

**D 14.6–20.8 · breakfast.** 14.7–16.8 "Ten mouths." / "ONE stomach." The camera pushes in on HUNGRY: two arms feed
him laddoos in turn while the pile shrinks and the others stare; 16.4 MINE! grabs the last one. 16.9–20.7
"HUNGRY ate 50 laddoos…" / "…NINE heads got" / "the tummy ache." The belly swells and two buttons ping off; 17.4 nine
heads turn green; 18.2 ten burps, left to right, rising in pitch (HUNGRY happy).

**E 20.8–25.6 · the sneeze.** 21.0–23.0 "One sneeze…" SIDE-EYE sniffs the pepper, then an AH… wave. 22.8 the ACHOO
wave; 23.0–25.5 "…= TEN sneezes." 24.0 SIDE-EYE's huge ACHOO blows the BOSS's mukut off; it spins across and 24.8
CLANK lands on SLEEPY, who finally wakes up, delighted. A whip pan out.

**F 25.6–31.4 · the door.** 25.7–27.9 "Ten heads." / "TEN opinions." Close on him in the room beyond the doorway:
ten shout bubbles (SLEEP! FOOD! SELFIE! FIGHT! FOLLOW ME! WHY HIM? MINE! I'M SICK! NO. HAHA!), arms pointing ten
ways. 28.0–31.3 "He couldn't even" / "fit through a DOOR." He rushes it, 28.5 SMACK (the outer heads hit the frame),
29.4 SMACK again, 29.8 the heads squeeze together like an accordion, he pops through, and the heads pop back out one
by one; STUBBORN last: "NO." A sepia brush wipe.

**G 31.4–43.6 · long ago.** 31.5–33.5 "But here's the CRAZY part:" / "he GAVE them away." Young Ravana (saffron,
no crowns) meditates by the sacred fire. 33.6–36.7 "Every 1000 years," / "ONE head into the sacred fire." The sun
and moon race over (a time-lapse); from 34.0 the heads float into the fire one by one (sparkle puffs, no gore), and a
counter runs 10 → 1. 36.8–38.9 "Before the last one…" / "BRAHMA appeared." Brahma (four heads) on a lotus in gold
light; Ravana, down to one head, counts them "1, 2, 3… 4?!"; 38.0 all nine pop back. 39.0–41.3 "His wish: NOBODY can
kill me." / "No god. No demon. No snake." (Brahma blesses). 41.4–43.5 "'Humans? Pfft.'" / "'They're like GRASS to
me.'" He plucks a blade of grass and 42.0 flicks it away; all ten laugh. A whip pan after the blade.

**G4 43.6–46.0 · the sunrise.** The blade drifts down to the feet of a silhouette with a bow against a huge sun.
43.6 "Guess who was HUMAN?" 44.2 "RAMA." (huge gold); the bow glints, rim light. A night brush wipe.

**H 46.0–53.6 · Dussehra night.** The effigy of the same ten heads on bamboo, string lights, the crowd. 46.1–48.3
"Many say the ten heads are" / "TEN bad habits." 48.4 tags pop over the heads, left to right: LAZY GREEDY SHOW-OFF
ANGRY EGO JEALOUS SELFISH LIAR STUBBORN MEAN. 51.0–53.5 "That's why on" / "DUSSEHRA" (gold) / "we burn ALL TEN."
Sparkler fountains at the base, fireworks, the crowd cheers (no flames on the faces).

**I 53.6–56.8 · the ask.** A flash to the bed in morning light; nine heads yawn in a wave (SLEEPY still asleep); name
tags pop under all ten. "Which head are YOU" / "in the MORNING?" / "Comment: SLEEPY? HUNGRY? ANGRY?" 56.8 a marigold
brush wipe.

**Card 57.1–61.6.** "Maa's 9 forms, as picture books" · Books 1–3 fanned · the RK logo · "Books 1–3 · Set of 3 for
₹500" · the rishikatha.com pill · "Follow @therishikatha for more!". Ends on the full card.

## Facts used
- Valmiki Ramayana, Uttara Kanda (ch. 10): Dashagriva ("ten-necked") did tapas for ten thousand years, offering one
  head into the fire every thousand years. When he was about to offer the tenth, Brahma appeared and restored them.
  He asked not to be slain by gods, demons, nagas, yakshas and other beings, and left out humans, whom he thought as
  worthless as straw/grass. Rama, a human, killed him.
- The ten heads as ten vices (kama, krodha, moha, lobha, mada, matsarya, and the like) is a popular Dussehra teaching
  ("Many say…"); the reel uses kid words for the tags.
