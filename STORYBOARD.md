# Ad 12 — "Why is Maa Kali's TONGUE out?" (Raktabija, Part 3 of Sher · Books 1–3, Book 7 coming soon)

A ~61.6 s captioned reel, the third with Sher (ad 10 Vahana Union → ad 11 Durga vs Mahishasura → this). It answers the
most-asked question about the most famous picture of Kali with TWO reasons, one epic and one hilarious: (1) Raktabija,
the demon whose every drop of blood that touched the ground became another him (Devi Mahatmya ch. 8): she spread her
tongue so not one drop landed; (2) after the win she danced so wildly the world shook, Shiva lay down in her path, she
stepped on him, and bit her tongue: in Bengal that means "OOPS!".

**Kept apart from ad 8 and ad 11 on purpose.** Ad 8 (Kalaratri) used Raktabija for ~10 s: a maroon demon with a
moustache, one slow drop, POP 2→4→8→16, lightning zaps the drops. Ad 11 was a dusk fight with a cold-open rewind. Here:
a question hook with a two-reason promise (no rewind); a moonlit indigo night (no dusk orange); Raktabija redrawn as a
**blood-SEED** (a cherry-red bean with a sprout on his head) whose drops **sprout out of the ground like seedlings**;
Sher's slaps make it WORSE (comedy, not a fight); a crowd to the horizon with spot-the-gag clones; Kali's tongue as a
**red carpet**; and a whole second reason (Shiva) that no reel has done.

```
Logline: "Why is Maa Kali's tongue out? TWO reasons. One is EPIC. One is HILARIOUS." Reason 1: Raktabija sprouts from a
         drop of his own blood; every drop that touches the ground becomes another him ("Rakta = blood, Bija = seed").
         Durga and Sher attack; every hit makes MORE (Sher NOT helping), until there are THOUSANDS. Durga gets so angry
         that MAA KALI bursts out of her forehead. She rolls out her tongue like a red carpet: not one drop touches
         the ground, the clones pop like bubbles, the original deflates. Reason 2: she dances so hard the world shakes,
         Shiva lies down in her path, she steps on him… "Wait… is that my HUSBAND?" She bites her tongue: OOPS.
Why it should travel: the most recognisable Kali image + a "never knew that" answer; a list promise ("TWO reasons",
         "one is HILARIOUS") that holds people to the end; a famous-name payoff (SHIVA) as a husband joke everyone gets;
         small gags to spot and comment on; Sher, whom people now follow.
Hook:    Frame 0: ONE subject, Maa Kali's face close on plain indigo, tongue out, the caption already up: "Why is Maa
         KALI's" / "TONGUE out?" (gold). 1.0 a little blep: the tongue wags, the eyes dart left-right.
World:   plain indigo (hook) → a moonlit battlefield: deep blue sky, a huge cream moon, indigo hills, blue-grey ground;
         crimson clones and ruby drops pop against it; Kali's blue and the tongue's red → the same night, shaking (the
         dance) → brand peach (card).
Motifs:  THE DROP (ruby; every drop that lands sprouts, until the tongue catches them all). THE SPROUT (on every clone's
         head: you can always tell a Raktabija). THE TONGUE (the hook's blep → the red carpet → the oops bite). SHER'S
         HEADBAND (Part 1's red band, now on a clone sitting on his head).
Ending rhyme: frame 0's tongue-out face (a question) → the same face biting her tongue, foot on Shiva (the answer):
         the classic Kali picture, explained.
Gags to spot (pinned comment): the SELFIE clone (it gets a last selfie with the tongue), the two clones POINTING at
         each other (which one is the original?), the clone on Sher's head wearing his union headband, the clone
         stuck upside down, the baby clone hugging Sher's tail, Durga's FACEPALM, the clone log-rolling on the carpet,
         Shiva's thumbs-up, Sher's blep.
Arcs:    Kali: blep (cute) → bursts out ROARING → tongue carpet (focused) → gulp, satisfied → dancing, joyful → stomp →
               "wait…" → bites her tongue, blushing → a shy smile
         Raktabija: sprouts, grins → flexes → "ow" → meets his clone, high-five → smug → spun by Sher, grinning →
               the crowd laughs → GULP at Kali → alone, sweating → deflated
         Sher: roaring → slap → looks at his paw → slaps again → a clone on his head → sheepish → bounced by the dance →
               blep
         Durga: determined → facepalm → chakra → angry, darkening, third eye → (Kali) → laughing behind her hand
         Shiva: glides in serene → lies down, hands behind his head → stepped on → one eye opens, thumbs-up
```

## Time constants (video s; shared by `src/scenes/rakt.js` and `tools/rakt_sfx.mjs`)
```js
// A hook
BLEP = 1.0, TWO = 2.7, FALL = 4.15, B0 = 4.6
// B Raktabija
LAND = 4.75, SPROUT = 5.0, POP0 = 5.45, MEET = 6.9, BOON = 9.3, POKE = 9.6, DRIP = 9.8, LAND2 = 10.4, POP2 = 11.6,
HI5 = 12.6, SMUG = 13.2, C0 = 14.4
// C the fight makes it worse
ROAR = 14.6, SLAP1 = 16.0, POPS1 = 16.5, MORE = 16.7, SLAP2 = 17.7, POPS2 = 18.2, FACEPALM = 18.3, CHAKRA = 19.0,
COUNT = [19.2, 19.7, 20.2], THOUS = 20.7, GAGS = 22.6, D0 = 24.6
// D Durga's anger → Kali
ANGRY = 24.7, EYE3 = 25.8, BURST = 26.8, KLAND = 27.3, KALI = 28.6, GULP = 29.0, CARPET = 30.6
// E the tongue
UNROLL = 31.0, UNROLLED = 32.2, NOTONE = 33.0, HITS = 33.2 … 35.6, NODROPS = 35.6, SELFIE = 36.0, FLASH = 36.5,
BOOP = 36.9, ORIG = 37.8, FINGER = 38.4, SLAP3 = 39.0, DEFLATE = 39.1, TWINK = 39.95, SLURP = 40.0, F0 = 40.4
// F reason 2
R2 = 40.4, DANCE = 41.0, SHOOK = 42.4, SHIVA = 44.8, LIE = 45.6, HOPON = 46.6, STEP = 47.0, WAIT = 47.2,
HUSB = 47.9, BITE = 49.2, OOPS = 49.3, THUMB = 49.8, BLEP2 = 50.4
// G recap, the ask
RECAP = 51.6, ASK = 53.9, WIPE = 56.8
// card
CARD = 57.1, CARD_CAP = 57.2, COVER = 57.4, ROW = 58.0, PRICE = 58.4, LOGO = 58.7, PILL = 59.0, FOLLOW = 59.4, END = 61.6
```

## Shots and reads (every caption inside y 420–1500, left of x 930; ≥ 2 s each, the ask 2.9 s)
**A 0–4.6 hook** (plain indigo). Kali's face close, tongue out. 0–2.6 "Why is Maa KALI's" / "TONGUE out?" (gold, big),
up from frame 0. 1.0–1.9 the blep: the tongue wags, the eyes dart left, right. 2.7–4.5 "There are TWO reasons." / "One
is EPIC." / "One is HILARIOUS." (staggered). 4.15 a ruby drop falls past her face; the camera whips down after it.

**B 4.6–14.4 Raktabija** (the moonlit battlefield, empty). 4.75 the drop lands: plip, a ripple; 5.0 a seedling pokes
up; 5.45 POP: Raktabija springs out of the ground, stretches, grins at us. 4.8–6.8 "REASON #1" / "(the EPIC one)".
6.9–9.2 "Meet RAKTABIJA:" (gold) / "the demon who MULTIPLIES." He twirls his mace, laughing. 9.3–11.5 "Every drop of his
blood" / "that touched the ground…" 9.6 he pokes his finger on his own mace spike: OW; 9.8 one drop falls; 10.4 it lands;
10.6 a seedling. 11.6–14.3 "…became ANOTHER HIM." (gold) POP; the two look at each other; 12.6 HIGH-FIVE; 12.3–14.3
"(Rakta = BLOOD. Bija = SEED.)"; 13.2 both smirk at us. 14.0 a roar off-screen; whip right.

**C 14.4–24.6 the fight makes it worse.** Durga (standing, ten arms) and Sher (sitting) at left; the two clones at
right. 14.5–16.6 "So Maa Durga and Sher" / "attacked." 14.6 Sher roars. 16.0 SLAP: the clone spins like a top; three
drops arc out; 16.5 POP POP POP. 16.7–18.9 "But every hit made MORE." Sher stares at his paw… 17.7 slaps again: six
more, one of them sprouting on SHER'S HEAD; 18.3 Durga facepalms. 19.0 her chakra boomerangs through them: drops
everywhere; the camera pulls back over a crowd sprouting to the horizon: 19.2 "4…" 19.7 "16…" 20.2 "300…" 20.7–22.5
"THOUSANDS." (huge gold). 22.6 push in on Sher: the clone on his head wears his red headband; the selfie clone (flash),
two clones pointing at each other, one stuck upside down, a baby hugging Sher's tail. 22.6–24.5 "Sher was NOT helping."

**D 24.6–30.6 Kali.** 24.6 Durga close; the clones laugh behind her. 24.7–26.7 "Maa Durga got SO angry…" Her face
darkens; 25.8 the third eye opens, glowing. 26.8 it BLAZES: a streak of night-blue lightning bursts out of her
forehead. 26.9–28.5 "…out of her FOREHEAD came". 27.3 wide: Kali lands in front, huge, crouched; the ground cracks;
she rises, roaring, tongue out. 28.6–30.5 "MAA KALI." (huge gold). 29.0 every clone GULPS at once; one faints.

**E 30.6–40.4 the tongue.** 30.6–32.9 "She rolled out her TONGUE…" / "like a RED CARPET." 31.0–32.2 it unrolls from
her mouth along the ground to the edge of the world (a clone caught on the roll runs on top like a log-roller and is
flung into the sky). 33.0–35.5 "Now NOT ONE drop" / "touched the ground." (gold) Every hit's drop arcs onto the tongue
(plip, plip); the clones POP like bubbles, wave after wave. 35.6–37.7 "No drops = no clones." 36.0 the selfie clone
takes one last selfie with the tongue (36.5 flash); 36.9 Kali boops him: POP. 37.8 the original alone by Sher,
sweating; 37.9–40.3 "The original?" 38.4 he raises one finger ("one sec…"), tiptoes; 39.0 Sher SLAPS him; his last
drop lands on the tongue; 39.1 "DEFLATED." (gold) he whizzes round like a let-go balloon into the moon; 39.95 twinkle.
40.0 SLURP: the tongue zips back in.

**F 40.4–51.6 reason 2.** 40.4–42.3 "REASON #2" / "(the HILARIOUS one)". 41.0 Kali dances: a stomp on every beat;
the camera shakes, the hills and the moon bounce, Sher bounces in the air, Durga holds her mukut. 42.4–44.7 "She was SO
happy, she danced…" / "…and the WORLD shook." 44.8–46.9 "So SHIVA" (huge gold) / "lay down in her path." He glides in
from the left, serene, and lies down in front of her, hands behind his head. 46.6 her next hop… 47.0 STOMP: onto his
chest. Freeze. 47.2–49.1 "Wait…" / "…is that my HUSBAND?" Her eyes go down, then wide. 49.2 she bites her tongue,
blushing, hands to her cheeks. 49.3–51.5 "In Bengal, biting your tongue" / "means: OOPS!" (gold). 49.8 Shiva opens one
eye: thumbs-up. 50.4 Sher bleps.

**G 51.6–56.8 recap and the ask.** 51.6–53.8 "#1: she caught EVERY drop." / "#2: she stepped on her HUSBAND." (gold).
53.9–56.7 "Did you know BOTH?" (gold) / "Comment JAI MAA KALI". 56.8 a crimson-and-marigold brush wipe.

**Card 57.1–61.6.** The RK logo · "Maa's 9 forms, as picture books" · Book 7 cover with a COMING SOON ribbon ·
"Book 7 · Maa Kalaratri, her darkest form" · Books 1–3 in a row · "OUT NOW: Books 1–3 · Set of 3 for ₹500" ·
the rishikatha.com pill · "Follow @therishikatha for more Sher!". Ends on the full card.

## Facts used (Devi Mahatmya / Durga Saptashati, and the popular Bengal tradition)
- Raktabija ("rakta" blood + "bija" seed): a general of Shumbha and Nishumbha with a boon that every drop of his blood
  that fell to the earth rose as another asura as strong as him. Every wound in battle multiplied him until the
  battlefield was full of Raktabijas (ch. 8).
- Kali (Chamunda) had sprung from the forehead of the angry Devi (ch. 7). Chandika asked her to open her mouth wide and
  drink the blood so no drop reached the ground; she spread her mouth and tongue over the field, the clones fell, and
  Raktabija, drained, was slain (ch. 8). (Retold here for kids: the clones pop, he "deflates".)
- The popular tradition (especially Bengal and Odisha): after the victory her dance shook the worlds; Shiva lay down
  in her path to calm her; when her foot touched him she stopped and bit her tongue in embarrassment, the gesture that
  means "oops / shame on me" in eastern India. Both reasons are commonly told for her tongue.
