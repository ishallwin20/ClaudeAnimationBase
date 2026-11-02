# "Do your aarti WITH this reel" — the Diwali aarti-along (ad 73 · Books 1–3 · 3D)

A **31 s seamless loop** in the **3D** style, #4 of the five-reel push (plan of 30 Oct 2026), built 2 Nov 2026 to post
before Diwali (Sun 8 Nov 2026; re-share to Story that evening, at the hour families do aarti). Ads 65, 66, 69 and 71
promised it ("Next: do your Diwali aarti WITH our reel"). It's a tool rather than an explainer: a family plays it on Diwali
night and moves the lamp along with ours. **No voice and no song**: there's no singing synth, Instagram's music can't sync
to the picture, and families sing different aartis, so the reel only sets the count. It carries the hand bell, a chime
for each circle and a temple bell for each part, and any aarti can be sung over it. When Instagram replays it, the next
round of the aarti begins.
**No end card** (a card would break the loop; as with the Krishna count-puzzle loop, which the owner let skip the CTA):
the follow line and the book offer are in the Instagram caption. Matte (owner, 30 Oct): bronze at metalness .6 /
roughness .44, no fx bloom, a little depth of field.

## Facts used
| claim in the reel | source |
|---|---|
| The temple way: four circles at the feet, two at the navel, three at the face, seven round the whole body | as ad 54: ISKCON's temple worship manuals, *Pancaratra Pradipa* (GBC Deity Worship Ministry: "four circles to the Lord's lotus feet, two circles to His navel, three to His face, and seven to His whole body", quoted in *Back to Godhead*, "Offering Arati") and *Arcana Paddhati* (1978) part I §9, both crediting the Brahma Vaivarta Purana as quoted by Sanatana Gosvami (a verse we did not find ourselves, so the reel says "the temple way", not "the scriptures") |
| (pinned comment) Many homes circle the face once; the aarti completes a puja even with steps missing | Hindi puja sites give feet 4, navel 2, face **1**, body 7 (ad 54's sources); Hari Bhakti Vilasa 8.302, quoting the Skanda Purana (Shiva to Uma): *mantrahīnaṁ kriyāhīnaṁ … sarvaṁ sampūrṇatām eti kṛte nīrājane* |
| The flame: five wicks (an odd number) of ghee | Hari Bhakti Vilasa 8.298 (ghee or camphor, an odd number of wicks), as ad 54 |

Performance only (no claim): the murti (a generic standing four-armed Lakshmi in panchaloha bronze: lotuses in the raised
hands, gold coins pouring from the lower right, a kalash of coins in the lower left, as in her common images; a red silk
saree, a marigold garland), the circles' clockwise direction and pace (1.4 s a small circle, 2 s a body circle), the
whole-body circles starting from the face, the hand bell, the diyas and torans, the sanctum.

## The loop (src/scenes/along.js: TL, D_S, D_W, LOOP; tools/along_sfx.mjs mirrors them)
| time | the lamp | on screen |
|---|---|---|
| 0–5.6 | four circles at her feet (1.4 s each), a chime climbing per circle; a temple bell at 0 | hook (up at frame 0): **SAVE this for DIWALI night. / Do your AARTI with this reel.** |
| 5.6–6.5 | glides up to the navel | |
| 6.5–9.3 | two at the navel | Follow the **GOLD** lamp. / Count each circle **OUT LOUD.** |
| 9.3–10.2 | glides up to the face | |
| 10.2–14.4 | three at the face | |
| 14.4–15.4 | rises over the crown | The **TEMPLE** way: / **4 · 2 · 3 · 7** |
| 15.4–29.4 | seven round the whole body (2 s each), from the top, a lower temple bell | It **LOOPS.** Keep going / till your aarti ends. |
| 29.4–31 | drops back to her feet as every ring fades, a falling sparkle | the hook again from 29.6 (frame 31 = frame 0) |
All the time: a gold ring stays where each circle went (the part on bright, those done dimmer); the circle number pops
by the lamp (FEET / NAVEL / FACE / BODY under it); on the right a column FEET 4 · NAVEL 2 · FACE 3 · BODY 7 lights the
part on and a dot per circle; coins pour from her palm; the camera breathes on a 31 s cycle.
Captions sit on top (y 480, above her crown); the column is at x 862, left of the 930 line. Frame 0 = one subject, the
hook up, the lamp at her feet.

## Files
`src/scenes/along.js` (the loop), `along_props.js` (sanctum, Lakshmi, coins, lamp, rings, tracker), `along_cover.js`
(the cover); `tools/along_sfx.mjs` → `assets/along_sfx.wav` and `assets/along_mix.wav` (-16 LUFS, a measured linear gain
plus a latency-compensated limiter, so the seam stays clean: every tail wraps round, the drone's pitches repeat a whole
number of times in 31 s). `rm -rf out/frames && node render.mjs --frames --workers=2 && node render.mjs --encode
--out=out/along_out/along.mp4` (~20 ms a frame); cover: `node render.mjs --page=cover.html --stills=0
--out=out/along_out` then rename `t0_00.png` to `cover.png`.
