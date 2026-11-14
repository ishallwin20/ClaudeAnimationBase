// kumbhabreath_cover.js: the cover for "Breathe with Kumbhakarna", inside the 3:4 grid crop (y 240–1680).
// cover.html sets window.COVER (the breath words hide); render at t = 2.5 (mouth wide on the snore in).
POST.push((c, t) => {
  const sh = { glow: ['rgba(10,6,20,.7)', 22] };
  text(c, 'Breathe with', 540, 380, '400 82px Kalam', '#FFFFFF', sh);
  text(c, 'Kumbhakarna', 540, 505, '700 138px Kalam', '#FFFFFF', sh);
  text(c, '(the expert)', 540, 615, '400 54px Kalam', 'rgba(255,255,255,.94)', sh);
});
