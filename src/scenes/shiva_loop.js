// shiva_loop.js: "Karpur Gauram", a Painterly cinemagraph: Shiva in meditation on a rock ledge below Kailash at night,
// white as camphor, his throat blue. The paintings are static; Vasuki sways his hood and flicks his tongue, the Ganga
// runs from his jata, the dhuni's flames flicker (stepped poses, like hand animation) and throw sparks, the damru's red
// cloth stirs, his halo, the crescent and the closed third eye breathe, ॐ नमः शिवाय turns round him in rings, stars
// twinkle (svScene in shiva_cast.js). Over it, the verse sung after every aarti: कर्पूरगौरं करुणावतारं, संसारसारं
// भुजगेन्द्रहारम्. No music: the owner adds it. Everything that moves repeats exactly over DUR, so the reel loops without a seam.
const LINES = ['कर्पूरगौरं करुणावतारं', 'संसारसारं भुजगेन्द्रहारम्'];

SHOTS.push({
  a: 0, b: DUR, draw(c, u, t) {
    svScene(c, t, { len: DUR });
    // the verse, in the night sky above him (inside the safe band)
    LINES.forEach((ln, i) => text(c, ln, 540, 450 + i * 60, '46px "Tiro Devanagari Sanskrit"', '#FFF4DC', { glow: ['rgba(6,8,24,.95)', 18], maxW: 860 }));
  }
});
LOOK.bloom = .24; LOOK.vignette = .5; LOOK.grain = .045;
