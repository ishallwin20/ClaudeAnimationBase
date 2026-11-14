// kanhasleep_cover.js: the cover for "Fall asleep with Kanha", inside the 3:4 grid crop (y 240–1680). cover.html sets
// window.COVER (the breath words hide); render at t = 4.
POST.push((c, t) => {
  const sh = { glow: ['rgba(5,10,30,.65)', 22] };
  text(c, 'Fall asleep', 540, 380, '700 130px Kalam', '#FFFFFF', sh);
  text(c, 'with Kanha', 540, 500, '400 90px Kalam', '#FFFFFF', sh);
  text(c, '4 in  ·  6 out', 540, 610, '400 50px Kalam', 'rgba(255,255,255,.94)', sh);
});
