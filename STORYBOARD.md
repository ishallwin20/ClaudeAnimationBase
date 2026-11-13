# Breathe with Bal Hanuman (Scribble style, 32 s seamless loop)

From the owner's Instagram example (a scribbled tortoise doing box breathing over a blurred photo of mountains, 13 Nov
2026), made ours: Bal Hanuman, Pavanputra, breathes in the Himalaya. Made only in code: no AI images, no photo.

## The loop
- Two rounds of box breathing, 4 s each: Inhale (पूरक) · Hold (कुम्भक) · Exhale (रेचक) · Hold (कुम्भक). Frame 0 shows
  "Inhale" already up, and the last frame is the end of the second hold, so Instagram's replay has no seam.
- Bal Hanuman sits on a sharp granite boulder in front of a Himalayan valley thrown far out of focus. His eyes are closed
  and his hands rest on his knees in gyan mudra. Breathing in, his chest fills (torso +6 % tall), his head lifts 27 px and
  his tail rises; in the holds he barely moves; breathing out he settles.
- Prana: 46 faint motes of air gather in toward him as he breathes in and drift back out as he breathes out.
- The word rises and grows on the in-breath, waits up high, then sinks and shrinks on the out-breath (as in the
  example). Kalam, white, in the sky (y 480–560), with the Sanskrit term under it.
- Sound (`tools/breathe_sfx.mjs` → `assets/breathe_sfx.wav`): a synthesized tanpura (Pa, Sa, Sa, low Sa, every 4 s),
  soft air rising and falling with the breath, a singing bowl at each in and out, a small bell at each hold. The tail
  folds back onto the start, so the audio loops too.

## Facts used
- Hanuman is the son of Vayu: Valmiki Ramayana, Kishkindha Kanda 66 (Jambavan tells Hanuman of his birth).
- "Vayu became prana and entered the nostrils": Aitareya Upanishad 1.2.4 (vāyuḥ prāṇo bhūtvā nāsike prāviśat).
- Puraka (inhalation), kumbhaka (retention), rechaka (exhalation): the terms of pranayama, e.g. Hatha Yoga Pradipika
  ch. 2. Box breathing (equal counts) is a modern practice: the caption doesn't claim it's ancient.
- No medical claims: "a simple way to calm down", with the advice to skip the holds if they're uncomfortable.

## Deliverables
`out/breathe_out/`: `breathe.mp4` (32 s, 24 fps, with the SFX), `cover.png` (`cover.html` at t = 6), `captions.txt`.
