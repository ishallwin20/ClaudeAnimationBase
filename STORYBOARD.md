# Laye sajeevan: a Painterly cinemagraph loop

Hanuman flying at dusk above a sea of clouds, the Dronagiri peak on his raised right palm, its herbs shining, the gada
in his left hand. 15 s seamless loop, 1080×1920, no audio (the owner adds the music in Edits). Painterly style
(PAINTERLY_GUIDE.md): designs in `src/scenes/sanjeevani_cast.js`, the scene in `src/scenes/sanjeevani_loop.js`,
the cover in `src/scenes/sanjeevani_cover.js` (`cover.html`).

## What moves (all periodic over 15 s)
- Clouds sail left in three lanes: thin wisps high behind him and the tops of the cloud sea (one lap a loop), big near
  clouds below the words (two laps).
- His uttariya's two ends flutter (10 poses, 18 flutters a loop); his tail sways (16 poses, 6 sways).
- He rises and falls on the wind (3 a loop). The herbs breathe and twinkle; their light pulses round him; rim light
  and sparkles on his edges; stars twinkle; motes drift off the peak and through the air.

## Text
The Hanuman Chalisa: लाय सजीवन लखन जियाये / श्रीरघुबीर हरषि उर लाये, centred at y 1392 and 1462 (inside the safe band).

## Facts used
- The caption follows Tulsidas (the Chalisa's poet), Ramcharitmanas, Lanka Kand: Lakshman is struck down, Sushena
  says the Sanjeevani from the Himalaya must come before sunrise, Hanuman can't tell the herb and brings the whole
  mountain, and Lakshman revives.
- The herbs shining and lighting up the mountain (the glow in the painting): Valmiki Ramayana, Yuddha Kanda 74, where he
  also tears out the whole peak.
- The text: Tulsidas, Hanuman Chalisa: लाय सजीवन लखन जियाये, श्रीरघुबीर हरषि उर लाये.

## Render
    node render.mjs --stills=0 --out=out/check
    node render.mjs --clip --fps=30 --out=out/sanjeevani_loop_out/sanjeevani_loop.mp4
    node render.mjs --page=cover.html --stills=0 --out=out/sanjeevani_loop_out   (rename t0_00.png to cover.png)
