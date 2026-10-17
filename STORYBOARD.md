# "We hit 15,000. So the cast threw a PARTY." (the 15K thank-you reel · 15K Family Deal, Books 1–3 for ₹350)

A ~70 s captioned Painted reel: no voiceover, synthesized SFX only (music added on Instagram). @therishikatha passed
15,000 followers on 17 Oct 2026. The whole cast of the reels people loved throws a party, and each one wrecks it with a
callback to their own hit reel. The party is a disaster, the family is together, THANK YOU, and the gift is the 15K
Family Deal: Books 1–3 for ₹350 (₹150 off ₹500) till 21 Oct midnight. CTA: "Comment FAMILY" (we DM the deal) + link in bio.

A pure comedy premise: no plot facts are retold. The callbacks point at earlier reels, and the only numbers are true
(the Ravana–Kailash reel passed 1M views; the follower count is 15K).

```
Logline: The cast throws a 15K party; Sher carries the cake, Maa Kali cuts it with ONE swing, Bal Hanuman
         eats the lamp, Shumbha proposes in the dark, a goat poses as Nandi, Ravana lifts the whole table and Shiva
         answers with ONE TOE. The cake is ruined; the family isn't. Thank you, and here's our gift.
Hook:    Frame 0: the three-tier cake with a gold "15K" topper on a plain peach wall, wobbling on a tray held by two
         paws, sweat dripping. Caption already up: "We just hit" / "15,000" (huge, gold) / "followers!"
World:   one party hall in the brand colours: peach walls, a teal dado, marigold swags, bunting, string lights, a big
         round paper lantern over a long table. Warm → DARK (the lamp is eaten; candlelight) → a red flash (one look) →
         warm again → the frosting-splattered wide shot → a camera flash (the group photo) → the peach card.
Motifs:  the CAKE (pristine → sliced → splatted; its "15K" topper survives and lands upright), ONE (one swing, one look, one toe),
         the callbacks (each guest's hit reel).
Rhyme:   opens on the perfect cake; ends on the ruined cake with the 15K topper standing in it, then the gift.
```

## Callbacks (each guest's reel)
| guest | gag | reel |
|---|---|---|
| Sher in his red union headband | carries the giant cake in alone, sweating | Vahana Union (ad 10: "the one who does ALL the work") |
| Maa Kali | asked to cut the cake: ONE swing of her khadga, a beat, perfect slices, a wink | Kali's khadga (ads 8, 12) |
| Bal Hanuman | thinks the round glowing lamp is a mango and swallows it; the hall goes dark, his cheeks glow | Baby Hanuman ate the sun |
| Shumbha | proposes to Durga with a ring box, in the candlelight. AGAIN. Her third eye: one look | the Durga proposal (ad 14, 115K views) |
| "Nandi" | a goat in Nandi's cloth; the real (redrawn) Nandi butts it out | a viewer said our Nandi "looks like a goat" (ad 15) |
| Ravana | ten heads want the WHOLE cake; twenty arms lift the whole table; ONE TOE | Ravana lifts Kailash (ad 15, 1M+ views) |
| Bal Bappa + Mooshak | the host's thank-you; Mooshak takes the group photo (Shiva sits in it, in lotus pose) | the first reels |

## Things to notice (rewatch layer)
1. SLEEPY (Ravana's head 0) sleeps through the whole table lift.
2. Kali's eyes are calmly shut through the whole swing; she opens one to wink.
3. Hanuman's cheeks glow in the dark like the lamp.
4. The 15K topper survives the splat and lands upright.
5. Mooshak is in the group photo, mid-run from the self-timer.

## Time constants (video s; shared by `src/scenes/k15.js` and `tools/k15_sfx.mjs`)
Owner, 17 Oct: "keep the text for a little longer". Every caption now holds at least 3 s (big lines 3.5–4.5 s); the reel
went from 61 s to 72 s. Then (owner: the first frame lingered) the hook was cut to 2.0 s, the pull-back starting at 0.6 s: 70.4 s. The Kali frosting gag and Shiva lying on the floor were cut (owner: might backfire / doesn't look
good); Kali now cuts the cake with one swing, and Shiva only appears seated and as the ONE TOE.
```js
UP = 0.6, B0 = 2, SET = 3.7, PHEW = 4.7, B2 = 5, C0 = 8
RAISE = 8.9, SWING = 10, BEAT = 10.2, SPLIT = 10.9, WINK = 12.2, D0 = 14.8
EYE = 15.1, DROOL = 15.8, WIG = 17.2, LEAP = 17.7, GULP = 18.3, DARK = 18.45, E0 = 22.6
RING = 23, KNEEL = 23.4, LOOK = 26, EYE3 = 26.3, FLEE = 27.2, F0 = 29.8
GOAT = 29.9, NANDI = 32.4, BUTT = 33.2, LISTEN = 33.3, G0 = 36.4
MINE = 36.8, GRAB = 39.4, LIFT = 39.8, TOE = 42.8, SPLAT = 43.4, MILLION = 44.4, H0 = 46.8
TOPPER = 47, HOST = 50.2, TIMER = 52.2, FLASH = 53.6, I0 = 58.4
GIFT = 58.6, OPEN = 59.8, FLY = 60.6, CARD = 62.8
CAP_T = 62.9, COVERS = 63.2, PRICE = 64, STRIKE = 64.5, DEAD = 65, PILL = 65.5, SUB = 66, FOLLOW = 66.5, END = 70.4
```

## Shots and reads
```
A  0–3.6    hook: the cake close (frame 0 finished, caption up). Paws wobble the tray, sweat drips. 3-line caption 3.6 s.
B  3.6–9.6  Sher in the union headband carries it alone; sets it on the table (SET), slumps (PHEW).
            caps 3.6–6.5 "So the whole cast / threw a PARTY." · 6.6–9.5 "SHER carried the cake. / (He does ALL the work.)"
C  9.6–16.4 Maa Kali behind the table smiles at the cake, raises her khadga (RAISE), eyes shut: ONE swing (SWING), a
            gleam through the cake; nothing happens (BEAT); the cake shows perfect slices (SPLIT); she winks (WINK).
            caps 9.6–12.6 "Maa KALI was asked / to cut the cake." · 12.7–16.3 "ONE swing. / Perfect slices."
D  16.4–24.2 Bal Hanuman, the lamp, the drool, AAM; DARK. caps 16.4–20.1 "Bal HANUMAN saw the lamp… / …and thought it
            was a MANGO." · 20.15–24.1 "NOT AGAIN, / HANUMAN!"
E  24.2–31.4 Shumbha's ring box in the candlelight; Durga's third eye (EYE3); he flees. caps 24.2–27.5 · 27.6–31.3
F  31.4–38.0 the goat; Nandi butts it (BUTT). caps 31.4–34.8 · 34.9–37.9 "We LISTENED."
G  38.0–48.4 Ravana: MINE, the lift, ONE TOE, SPLAT. caps 38.0–41.1 · 41.2–44.3 (low) · 44.4–48.3 (low) + MILLION 46.0
H  48.4–60.0 the wreck, the topper, the host (Shiva seated in lotus pose), the self-timer, FLASH; caps 48.6–51.7 ·
            51.8–55.1 · 55.45–59.9 "THANK YOU"
I  60.0–64.4 the gift, the books fly. cap 60.0–64.3
J  64.4–72.0 the card (7.6 s). No fade out.
```

## Instagram caption
In `out/k15_out/captions.txt` (and below once rendered).

```
(the caption as posted is out/k15_out/captions.txt: the keyword question first, the thank-you, the 15K Family Deal,
"Comment FAMILY" + link in bio, a save/share prompt, 15 hashtags, then the pinned comment)
```
