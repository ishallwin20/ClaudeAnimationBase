# Styles

Every reel is made in a named style. Say which one when asking for a reel ("make it **Cinematic**"); with no style
named, ask, or use Painted for comedy and the kid series and Cinematic for epic, devotional and dramatic stories.

| style | the look | best for | read | engine and page | characters | reference reels |
|---|---|---|---|---|---|---|
| **Painted** | a hand-painted cartoon: p5.brush watercolour and ink that boils, chibi characters, paper grain, comic timing | comedy, gags, the kid series (Aarav), Bappa, Clawd | [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md) | `src/core.js` + `src/timeline.js` (p5 + p5.brush), `studio.html` | `src/clawd.js`, `bappa.js`, `shiva.js`, `durga.js`, `lion.js`, `ravana.js` … (see CLAUDE.md) | `ad/10-books123-vahana-union`, `ad/11-books123-mahishasura`, `ad/13-books123-ravana-heads` |
| **Cinematic** | a cinematic motion comic: flat vector figures with real proportions, lit like film (rim light, god rays, haze, bloom, grain), slow camera moves, crossfades, karaoke captions | epic and devotional stories, dramatic explainers, "known yet unknown" mythology | [CINEMATIC_GUIDE.md](CINEMATIC_GUIDE.md) | `src/cine.js` (Canvas 2D), `cine.html` | `src/cine_shiva.js`, `src/cine_cast.js`, sets in `src/cine_sets.js`; see [docs/cine_cast.jpg](docs/cine_cast.jpg) | `reel/shiva-cinematic` |
| **3D** | a lit 3D world in three.js under the Cinematic 2D layer: stone, brass, lamp light and real shadows, a moving sun, flowing water; the camera walks, orbits and looks straight down; karaoke captions, bloom, grain | explainers about places and objects (temples, rituals, architecture), "Why do Hindus…?"; no characters yet (the camera is the devotee) | [3D_GUIDE.md](3D_GUIDE.md) | `src/cine3d.js` over `src/cine.js` (three.js in `src/vendor/three.min.js`), `cine3d.html` | sets: `src/cine3d_temple.js` (a Shiva shrine); see [docs/cine3d_set.jpg](docs/cine3d_set.jpg) | `ad/31-books123-pradakshina` |
| **Storybook** | a flat picture book: flat shapes with uneven edges and no outlines, gouache mottling, dry-brush fur and feathers, dot eyes and blush, bouncy brush lettering, paper grain; edges boil 10× a second | riddles, jokes, guessing games, sweet one- or two-character moments, wallpapers, the kids' picture books | [STORYBOOK_GUIDE.md](STORYBOOK_GUIDE.md) | `src/storybook.js` over `src/cine.js`, `storybook.html` | `src/sb_cast.js` (Mooshak, the owl, the donkey, Bal Bappa, Lakshmi, Kalaratri); see [docs/sb_cast.jpg](docs/sb_cast.jpg) | `ad/53-books123-guess-ride` |
| **Painterly** | a digital-painting cinemagraph made only in code (no AI images): a design repainted in curved brush strokes, coarse to fine, baked once; a god in a sunlit forest, with only a tail, राम rings, light, dust and sparkles moving; seamless loops | devotional loops set to a bhajan, quiet darshans, live wallpapers | [PAINTERLY_GUIDE.md](PAINTERLY_GUIDE.md) | `src/painterly.js` over `src/cine.js`, `painterly.html` | `src/pt_cast.js` (the forest clearing, Hanuman in meditation, his tail and gada); see [docs/painterly_sheet.jpg](docs/painterly_sheet.jpg) | `reel/hanuman-ram-loop` |

The Painted and Cinematic engines don't mix in one page: a reel is one style (the 3D style is cine.js with a three.js world under it; Storybook is cine.js with its own shapes, lettering and paper on top; Painterly is cine.js with its paintings under the light). A character can exist in both (Shiva, Sati/Shailputri,
Nandi): the Painted one is chibi and brushed, the Cinematic one realistic and lit. Enrich a style's characters in
place on `main` when a reel needs more of them (a new pose, an option), so the next reel gets them too.

## Adding a style

A new style gets a name, its own guide (`<NAME>_GUIDE.md`: the look, the files, how to start a reel, the API, how to
build characters, what worked), its engine and studio page (keeping `window.ready`, `renderAt` and `renderSheet`, so
`render.mjs --page=` drives it unchanged), a reference sheet in `docs/`, a row in the table above, and a line in
CLAUDE.md.
