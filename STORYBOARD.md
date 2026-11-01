# Karpur Gauram: a Painterly cinemagraph loop

Shiva in meditation on a rock ledge below Kailash at night, white as camphor, his throat blue, Vasuki's hood beside his
face, the Ganga springing from his jata, a dhuni burning in front of him, the trishul with the damru at his right.
15 s seamless loop, 1080×1920, no audio (the owner adds the music in Edits). Painterly style (PAINTERLY_GUIDE.md):
designs in `src/scenes/shiva_cast.js`, the scene in `src/scenes/shiva_loop.js`, the cover in
`src/scenes/shiva_cover.js` (`cover.html`). The figure is ptHanuman's seated body (pt_cast.js) redrawn as Shiva with a
human head, scaled 1.1. Shiva is white with a blue throat (not all blue) to match ad 30 ("Why are Hindu gods BLUE?").

## What moves (all periodic over 15 s)
- Vasuki sways his hood (12 poses, 3 sways) and flicks his tongue 5 times.
- The Ganga runs from his knot (light beads along the stream, spray falling off its end).
- The dhuni's flames step through 12 painted poses at 8 a second, never the same twice running; sparks rise; the
  firelight on his right side flickers with them.
- The damru's red cloth stirs (10 poses, 10 flutters). The halo, the crescent and the closed third eye breathe.
  ॐ नमः शिवाय turns slightly in two rings round him. Stars twinkle, motes drift, sparkles run along his rim.

## Text
कर्पूरगौरं करुणावतारं / संसारसारं भुजगेन्द्रहारम्, at y 450 and 510 in the night sky above him (inside the safe band).

## Facts used
- The verse: "Karpura Gauram Karunavataram", sung at the end of aarti: white as camphor, compassion incarnate, the
  essence of the world, wearing the king of serpents as a garland ([shlokam.org](https://shlokam.org/shloka/karpura-gauram.htm)).
- Only his throat is blue, from the Halahala he held there: Bhagavata Purana 8.7.43.
- The Ganga caught in his locks: Valmiki Ramayana, Bala Kanda 43.
- The serpent round his neck (named Vasuki in popular tradition), the crescent moon (Chandrashekhara), the tiger skin,
  ash, rudraksha, trishul and damru, Kailash as his home: standard iconography (Shiva Purana). The dhuni and the
  rings of the mantra are devotional imagery and claim no story.

## Render
    node render.mjs --stills=0 --out=out/check
    node render.mjs --clip --fps=30 --audio=none --out=out/karpur_gauram_loop_out/karpur_gauram_loop.mp4
    node render.mjs --page=cover.html --stills=0 --out=out/karpur_gauram_loop_out   (rename t0_00.png to cover.png)
