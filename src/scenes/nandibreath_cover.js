// nandibreath_cover.js: the cover for "Breathe with Nandi", inside the 3:4 grid crop (y 240–1680). cover.html sets
// window.COVER (the breath words hide); render at t = 4.5 (lungs nearly full).
POST.push((c, t) => {
  const sh = { glow: ['rgba(30,15,50,.55)', 22] };
  text(c, 'Breathe with', 540, 380, '400 82px Kalam', '#FFFFFF', sh);
  text(c, 'Nandi', 540, 510, '700 160px Kalam', '#FFFFFF', sh);
  text(c, '5 in  ·  5 out', 540, 630, '400 50px Kalam', 'rgba(255,255,255,.94)', sh);
});
