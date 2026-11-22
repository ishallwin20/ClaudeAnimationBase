# Pothi style

A flat devotional illustration on laid paper, made only in code (no AI images). The owner picked this look on
20 Nov 2026 from an Instagram reference, and it suits books too (the Dashavatar book). Copy the look, never another
artist's composition: our own poses, framing and scenes.

## The look
- **Silhouettes, not outlines.** Every part is one smooth shape (`poFill` with `poPath`: Catmull-Rom through a few
  points; `[x, y, 1]` marks a corner). There is no ink line round anything.
- **Soft airbrushed form inside the shape.** `sh` is a dark band along the edge away from the light and `hi` a pale band
  toward it: `poFill(c, P, col, { sh: [dx, dy, blur, col], hi: [...] })`. Cloth folds are blurred strokes clipped
  inside (`poFold`). Light comes from the top left.
- **Muted pigments** (`PO`): Vishnu's grey-lavender blue, brick maroon, ochre silk, slate, cream, teal water,
  crimson lotus. Gold is used only for borders, beads and jewellery (`poBorder`, `poDots`).
- **Figures** are slender and naturalistic, with understated faces: one lid line, a straight nose, small lips. In
  profile (Vishnu, Hanuman) or facing us (Ardhanarishvara, Krishna): a frontal face is an oval with the shade on both
  cheeks, lowered or half-lidded eyes (a long lid line over the white), the nose as one blurred shade down its side.
  Keep heads generous (Bal Krishna about a quarter of his height) and torsos short, or the figure reads stretched. Limbs are `poLimb` outlines with a cast shadow under an arm that lies over the body, so the parts
  separate by value, never by line.
- **Ground**: plain cream laid paper (`poPaper`), a teal water band (`poWater`), botanical sprigs in the corners
  (`poSprig`), lotus pads and flowers (`poPad`, `poLotus`). Dark text (`#2A1C1A`) in Tiro Devanagari.
- Look settings: bloom about .06, vignette about .06, grain .03, a light paper overlay.

## Files
- `src/pothi.js`: the engine, on cine.js and painterly.js (`ptLin`, `ptLayer` cache the static parts).
- `src/po_cast.js`: Anantashayana (Vishnu asleep on Shesha: `poAnantaHood`, `poAnantaBed`, `poAnantaNavel`, `PO_ANANTA`).
- `src/po_hanuman.js`: Hanuman flying (`poHanumanFly`: the far arm reaching ahead, the gada under his chest, the legs
  trailing, tail, dhoti and scarf streaming), his profile head (`poHanumanHead`).
- `src/po_ardha.js`: Ardhanarishvara (`poArdha`, `poArdhaHead`): one frontal body split down the midline, Shiva
  camphor-white with jata, Ganga, crescent, serpent, trishul and damaru, tiger skin; Parvati champak-gold with a bun,
  jhumka, choli and sari, a blue lily. `arHalf`/`arMir` build a half from one side's outline.
- `src/po_kaliya.js`: Krishna on Kaliya (`poKaliya`: five frontal hoods, necks to the water, the tail to his hand;
  `poKrishnaDance`: abhaya, the tail held up, one leg lifted; `poKrishnaHead` with crown and peacock feather).
- First reel: `reel/ekadashi-loops` (Shantakaram). Wallpapers batch 7 packs 01 and 03–05 (`src/scenes/wall_ek.js`:
  `poCloud`, `poKadamba`, `poTopFade` for the clock).
