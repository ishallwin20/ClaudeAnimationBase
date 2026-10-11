# Styles

Every reel is made in a named style. Say which one when asking for a reel ("make it **Cinematic**"); with no style
named, ask, or use Painted for comedy and the kid series and Cinematic for epic, devotional and dramatic stories.

| style | the look | best for | read | engine and page | characters | reference reels |
|---|---|---|---|---|---|---|
| **Painted** | a hand-painted cartoon: p5.brush watercolour and ink that boils, chibi characters, paper grain, comic timing | comedy, gags, the kid series (Aarav), Bappa, Clawd | [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md) | `src/core.js` + `src/timeline.js` (p5 + p5.brush), `studio.html` | `src/clawd.js`, `bappa.js`, `shiva.js`, `durga.js`, `lion.js`, `ravana.js` … (see CLAUDE.md) | `ad/10-books123-vahana-union`, `ad/11-books123-mahishasura`, `ad/13-books123-ravana-heads` |
| **Cinematic** | a cinematic motion comic: flat vector figures with real proportions, lit like film (rim light, god rays, haze, bloom, grain), slow camera moves, crossfades, karaoke captions | epic and devotional stories, dramatic explainers, "known yet unknown" mythology | [CINEMATIC_GUIDE.md](CINEMATIC_GUIDE.md) | `src/cine.js` (Canvas 2D), `cine.html` | `src/cine_shiva.js`, `src/cine_cast.js`, sets in `src/cine_sets.js`; see [docs/cine_cast.jpg](docs/cine_cast.jpg) | `reel/shiva-cinematic` |

The two engines don't mix in one page: a reel is one style. A character can exist in both (Shiva, Sati/Shailputri,
Nandi): the Painted one is chibi and brushed, the Cinematic one realistic and lit. Enrich a style's characters in
place on `main` when a reel needs more of them (a new pose, an option), so the next reel gets them too.

## Adding a style

A new style gets a name, its own guide (`<NAME>_GUIDE.md`: the look, the files, how to start a reel, the API, how to
build characters, what worked), its engine and studio page (keeping `window.ready`, `renderAt` and `renderSheet`, so
`render.mjs --page=` drives it unchanged), a reference sheet in `docs/`, a row in the table above, and a line in
CLAUDE.md.
