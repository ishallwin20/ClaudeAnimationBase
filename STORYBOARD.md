# "1 LAKH of you. So the whole family came for ONE photo." (the 1 lakh thank-you reel)

A ~71 s captioned Painted reel (Bangers, synthesized SFX, no voice). @therishikatha passed 1,00,000 followers on
9 Nov 2026. Bal Bappa shows the 15K family photo ("the whole family fit in one photo"), wheels in a bigger camera, and
the cast of the reels since then arrives one by one, each with a callback to their own reel. The photo keeps getting
wider. When everyone is in, one spot in the front is still empty, and it's for YOU. Flash, THANK YOU, the ask
("Which one of us brought you here?"), then the gift card: a free wallpaper on rishikatha.com and the 1 lakh sale on
both book sets.

A pure comedy premise, no plot retold. Each callback points at a reel and claims nothing new: Hanuman's sindoor for Ram
(ad 29), Shani's gaze (Shani Part 1, Brahma Vaivarta Purana), Kanha and the butter, Ravana's ten heads, Bal Hanuman's
flight, Narad's monkey face (ad 22, Manas Bal Kand), Shiva as Bappa's father.

```
Logline: Bappa hits 1 lakh, needs a BIGGER photo; the family arrives (each with their own gag) until one spot is left:
         yours. Flash. Thank you.
World:   one photo studio in the brand colours: a teal velvet backdrop with gold fringe, marigold swags, two durrie-
         covered risers, a wooden floor, brass diyas, a rangoli in the front centre (the empty spot). Warm all through;
         gold light for Shiva; a white flash; the cream photo border; the peach card.
Motif:   the PHOTO: the 15K photo (small, a handful) → the camera pulls wider with every arrival → the 1 lakh photo.
         The EMPTY SPOT: a rangoli with one diya in the front centre, unexplained until F.
Rhyme:   opens on Bappa holding the old photo; ends on the new photo, with a place in it for the viewer.
```

## Callbacks (rewatch layer)
| who | gag | reel |
|---|---|---|
| Hanuman | glances at Ram, a bulb, POOF: he's vermilion with sindoor for Ram's photo | ad 29 (sindoor) |
| Parshurama | stomps in, axe up; "smile please?" gets a terrifying grin | Parshurama series (8 parts) |
| Shani | about to look up at the camera: Bappa clutches his own head; the owl lends Shani its sunglasses | Shani Part 1 (Ganesha's head); ad 26 owl |
| Kanha | brings a pot of butter; Mooshak sneaks to it | Krishna series |
| Ravana | ten heads don't fit the frame: the camera pulls back; Sleepy snores | ads 13/15 |
| Bal Hanuman | flies in like a comet | Bal Hanuman reels |
| Narad | floats in on his cloud; in the final photo he has the MONKEY FACE | ad 22 |
| Shiva | "Then BAPPA'S DAD arrived": lands in gold light, Nandi with him | — |

## Time constants (video s; shared by `src/scenes/lakh.js` and `tools/lakh_sfx.mjs`)
```js
B0 = 4.0, C0 = 8.4, D0 = 12.4, E1 = 16.0, SIND = 18.9, E2 = 21.4, SMILE = 23.4, E3 = 25.6, LOOKUP = 26.9, CLUTCH = 27.3,
OWL = 28.0, PUT = 28.8, E4 = 31.2, LICK = 33.0, E5 = 35.2, PULL = 37.0, E6 = 40.6, LAND = 41.6, E7 = 43.6, SHIVA = 45.0,
F0 = 49.0, G0 = 54.2, FLASH = 56.2, H0 = 60.6, CARD = 65.4, END = 71.6
```

## Shots and reads
```
A  0–4.0    [frame 0 finished] Bal Bappa jumps for joy in front of the teal backdrop, Mooshak on his turban, confetti.
            cap 0–3.9 "WE JUST HIT / 1,00,000 / FOLLOWERS!"            · whip on his reach behind his back
B  4.0–8.4  Bappa holds up the 15K photo (the real frame of the 15K reel), pushes it at us, looks at it with love.
            cap 4.1–8.3 "AT 15K, THE WHOLE FAMILY / FIT IN ONE PHOTO."  · he flicks it away, whip
C  8.4–12.4 He wheels in a big box camera on a tripod, pats it. cap 8.5–12.3 "NOW WE'RE 1 LAKH. / WE NEED A BIGGER PHOTO."
            He ducks under the black cloth (bulge) · iris out through the lens
D  12.4–16  The camera's view: the empty studio. Bappa runs in from the bottom left, waves everyone in.
            cap 12.6–15.9 "EVERYONE, / FAMILY PHOTO TIME!"
E1 16–21.4  Ram, Sita, Lakshman and Hanuman take the back riser. Hanuman glances at Ram, bulb, POOF (SIND): vermilion.
            cap 16.4–21.3 "HANUMAN DRESSED UP / FOR RAM'S PHOTO."
E2 21.4–25.6 Parshurama stomps in, axe raised, the frame shakes. cap 21.6–25.5 "PARSHURAMA, / SMILE PLEASE?"; SMILE: the grin.
E3 25.6–31.2 Shani walks in, eyes on his feet, his crow on his shoulder. LOOKUP: his eyes start to rise (violet) → cut to
            Bappa clutching his head (CLUTCH) → the owl swoops in (OWL) and puts its shades on Shani (PUT); he looks up, cool.
            cap 25.8–31.1 "SHANI DEV WANTED / TO LOOK AT THE CAMERA…" then 28.9 "SAFETY FIRST."
E4 31.2–35.2 Kanha tiptoes in with a pot of butter, sits; Mooshak sneaks to the pot; Kanha licks his fingers (LICK).
            cap 31.4–35.1 "KANHA BROUGHT / SNACKS."
E5 35.2–40.6 Ravana's heads shove in from the right, cut off by the frame; squabble; PULL: the camera pulls all the way back.
            cap 35.4–40.5 "RAVANA NEEDED / 10 SEATS."
E6 40.6–43.6 Bal Hanuman flies in like a comet, lands on the middle riser (LAND); Narad floats in on his cloud. No caption.
E7 43.6–49  Gold light from above, everyone looks up: Shiva comes down seated to the centre (SHIVA), Nandi walks in.
            cap 43.8–48.9 "THEN BAPPA'S DAD / ARRIVED."
F  49–54.2  The whole family. Bappa looks at the gap in the front: the rangoli spot lights up; everyone points at it / us.
            cap 49.2–54.1 "ONE SPOT IS STILL EMPTY. / IT'S YOURS."
G  54.2–60.6 cap 54.3–56.1 "SAY… MODAK!" grins; FLASH; the photo freezes in a cream border (Narad's monkey face).
            cap 56.6–60.5 "THANK YOU, / 1 LAKH FAMILY!"
H  60.6–65.4 slow push across the photo. cap 60.7–65.3 "WHICH ONE OF US / BROUGHT YOU HERE? / COMMENT!"
I  65.4–71.6 the card: OUR GIFT TO YOU · a FREE WALLPAPER (phone) · Grab yours at rishikatha.com · the 1 lakh sale on
            both book sets (Books 1–3 and 4–6, no price) on rishikatha.com & Amazon · Follow @therishikatha. No fade out.
```
