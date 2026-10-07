# Ad 10 — "Maa Durga's LION just went ON STRIKE." (the Navratri Vahana Union · Books 1–3)

A 51 s captioned reel for Navratri (11–19 Oct 2026). Pure comedy up front, the nine nights' vahanas as the lesson, Books
1–3 (Nights 1–3) on the card. Reuses Nandi, Kalaratri's donkey (a callback to the ad 8 reel) and Brahmacharini; the lion
(Sher) and the tigress are the new shared `src/lion.js`.

```
Logline: Right before Navratri, Maa Durga's lion calls a strike: "HAMARI MAANGEIN… POORI KARO!" Each vahana of the
         Navratri union airs a grievance, and every grievance fills one night of the duty roster (the lesson). Night 2 is
         empty: Brahmacharini WALKS, barefoot. Then she walks in. Placards hide, the donkey eats his. She tells each of
         them the virtue Maa chose them for; the lion offers her a lift; "Some journeys you WALK yourself." The placards
         flip: JAI MATA DI. Strike off, Navratri on.
Why it should travel: an Indian union dharna (megaphone, red headbands, "Hamari maangein poori karo") with gods'
         animals: instantly familiar and absurd. Each grievance is a joke AND a fact, so the whole Navadurga roster is
         learned by laughing; the finished roster is a screenshot / save; "Tag the LION of your house" gets tags.
Hook:    Frame 0: ONE subject, the lion close up, red headband, megaphone at his mouth, chest puffed, furious, on a plain
         saffron tent cloth. "Maa Durga's LION" / "just went ON STRIKE." already up. 1.0 s: he yells into the megaphone.
World:   a night dharna under a striped Navratri shamiana: saffron cloth, marigold strings, fairy bulbs, a striped durrie.
         Warm throughout; it gets warmer and golden when Brahmacharini comes (her aura), petals at the flip, brand peach card.
Motifs:  THE ROSTER STRIP (nine tiles; each grievance stamps an icon in; tile 2 stays empty until "she WALKS"; it grows
         into the saveable 3×3 board). THE PLACARDS (protest → hidden → flipped to JAI MATA DI). THE MEGAPHONE (yell →
         put down → hidden behind his back). THE TOE BEANS (he counts four nights on his paw's four beans).
Ending rhyme: frame 0, the lion yelling demands into a megaphone → the lion leading "JAI MATA DI!" with the same paw.
Arcs:    Lion: furious union boss → exasperated (four nights) → smug (Night 2 reveal) → caught (she walks in), hides the
               megaphone → proud (COURAGE) → sheepish, offers a lift → moved → flips his placard, cheering
         Tigress: sulky, slumped, back pain → proud (POWER) → cheering
         Nandi: deadpan, long-suffering → proud (PATIENCE) → a happy nod
         Donkey: late to the chant → proud of Night 7 → eye-twitch ("why a DONKEY?") → eats his placard → proud
                 (HUMILITY) → happy bray
         Brahmacharini: serene, amused, warm
```

## Time constants (video s; shared by `src/scenes/union.js` and `tools/union_sfx.mjs`)
```js
// A hook
YELL = 1.0, PULL = 2.3, CHANT = 2.95, LATE = 3.75, GLANCE = 3.95, B0 = 5.2
// B the roster: each grievance stamps its nights
ROSTER = 5.2, LION0 = 7.9, BEANS = [8.5, 8.85, 9.2, 9.55], NAMES = 10.3, TIG0 = 12.3, STAMP3 = 12.7, ARMS = 14.4,
NAN0 = 16.6, STAMP18 = [17.0, 17.35], SHIVA = 18.6, DNK0 = 20.8, STAMP7 = 21.2, WHY = 22.8, TWITCH = 23.4,
N2 = 25.2, WALKS = 27.1, FEET = 27.5, GASP = 27.6
// C she walks in
ENTER = 29.3, NOTICE = 29.8, HIDE = 30.1, EAT = 30.4, VIRTUE = 31.8, TAGS = [32.4, 32.9, 33.4, 33.9], LIFT = 35.6,
WALK = 37.4, EXIT = 38.2, FLIP = 39.8, FLIPS = [40.0, 40.25, 40.45], BOARD = 42.3, ASK = 43.0, WIPE = 45.9
// card
CARD = 46.2, CARD_CAP = 46.3, COVERS = 46.5, PRICE = 47.3, LOGO = 47.6, PILL = 47.9, FOLLOW = 48.3, END = 51.0
```

## Shots and reads (one set, one camera; every caption inside y 420–1500, left of x 930)
**A 0–5.2 hook.** Close on the lion (zoom 2): the hook caption up from frame 0 (0–2.4). 0–1.0 his chest swells. 1.0
"HAMARI MAANGEIN…" bursts out of the megaphone (shake, his mane blows back) to 2.4. 2.3 the camera pulls back to the wide:
the union under the shamiana, banner NAVRATRI VAHANA UNION, Nandi (NO RIDES), the tigress (BACK PAIN!), the donkey
(RESPECT, in his mouth). 2.95 all placards up: "…POORI KARO!!". 3.75 the donkey, late and alone: "…karo." 3.95 everyone
glances at him.

**B 5.2–29.3 the roster.** 5.2 the nine-tile strip drops into the top band. "Navratri: 9 nights, 9 forms of Maa." / "And
SOMEONE has to carry her." Each grievance: the camera moves to the speaker (zoom 1.5), their mouth talks, their tiles
stamp.
- 7.9 lion: "I carry Maa on FOUR nights!" (the megaphone is down; his paw comes up and the four toe beans light one by
  one with tiles 4, 5, 6, 9) → 10.3 "Kushmanda · Skandamata / Katyayani · Siddhidatri" (an anger mark).
- 12.3 tigress: "Night 3: me. Chandraghanta." (tile 3) → 14.4 "She has TEN arms." / "Know how HEAVY that is?" (she slumps,
  a paw on her back).
- 16.6 Nandi: "Nights 1 and 8: me." / "Shailputri · Mahagauri" (tiles 1, 8) → 18.6 "And the REST of the year?" / "SHIVA."
  (a slow blink, a long snort).
- 20.8 donkey: "Night 7: Kalaratri. ME!" (tile 7, a proud grin) → 22.8 "And EVERY year someone asks…" / "WHY a DONKEY?!"
  (23.4 the eye twitch, ears pinned).
- 25.2 wide: "And Night 2?" (tile 2 pulses, empty, everyone looks up) → 27.1 "Brahmacharini WALKS." / "BAREFOOT."
  (footprints stamp tile 2; 27.6 everyone gasps).

**C 29.3–42.3 she walks in.** 29.3 Brahmacharini walks in from the left, barefoot, mala clicking: "…and then SHE walked
in." 29.8 everyone freezes; 30.1 placards behind backs, the megaphone behind the lion; 30.4 the donkey eats his
placard. 31.8 "Maa chose each of you" / "for a VIRTUE." Tags pop over each, and each puffs up: COURAGE (lion), POWER
(tigress), PATIENCE (Nandi), HUMILITY (donkey). 35.6 the lion, blushing, thumbs at his back: "Need a lift, Maa?" 37.4
she smiles, shakes her head: "Some journeys" / "you WALK yourself." 38.2 she walks on, out to the right. 39.8 the lion
looks at his placard and flips it: JAI MATA DI; the others flip theirs (40.25, 40.45); marigold petals; "Strike OFF." /
"NAVRATRI ON!"

**D 42.3–46.2 save + comment.** The strip grows into a 3×3 board, "NAVRATRI DUTY ROSTER", each tile its night, goddess and
vahana. 43.0–46.0 "Tag the LION of your house" / "(the one who does ALL the work)". 45.9 a marigold brush wipe.

**Card 46.2–51.0.** "Nights 1–3, as picture books" · Books 1–3 in a row (Night 1 / 2 / 3 under them) · "Books 1–3 · Set
of 3 for ₹500" · the logo · the rishikatha.com pill · "Follow @therishikatha for all 9 nights". Ends on the full card.

## Facts used (Navadurga vahanas, as commonly given; some texts differ, e.g. Kushmanda on a tigress)
1 Shailputri: bull · 2 Brahmacharini: none, walks barefoot · 3 Chandraghanta: tigress · 4 Kushmanda: lion ·
5 Skandamata: lion · 6 Katyayani: lion · 7 Kalaratri: donkey · 8 Mahagauri: bull · 9 Siddhidatri: lion (seated on a lotus)
