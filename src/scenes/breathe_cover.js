// breathe_cover.js: the cover for "Breathe with Bal Hanuman": him mid-breath with the title in the sky, inside the
// 3:4 grid crop (y 240–1680). cover.html sets window.COVER (the breath words hide); render at t = 6 (lungs full).
POST.push((c, t) => {
  const sh = { glow: ['rgba(20,50,75,.45)', 22] };
  text(c, 'Breathe with', 540, 360, '400 78px Kalam', '#FFFFFF', sh);
  text(c, 'Bal Hanuman', 540, 480, '700 138px Kalam', '#FFFFFF', sh);
  text(c, '4 in  ·  4 hold  ·  4 out  ·  4 hold', 540, 600, '400 46px Kalam', 'rgba(255,255,255,.92)', sh);
});
