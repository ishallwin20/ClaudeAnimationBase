// beebreath_cover.js: the cover for "Bee breath with Bal Ganesha": him mid-hum with the title in the sky, inside the
// 3:4 grid crop (y 240–1680). cover.html sets window.COVER (the breath words hide); render at t = 6.
POST.push((c, t) => {
  const sh = { glow: ['rgba(20,60,70,.65)', 22] };
  text(c, 'Bee breath', 540, 380, '700 138px Kalam', '#FFFFFF', sh);
  text(c, 'with Bal Ganesha', 540, 500, '400 82px Kalam', '#FFFFFF', sh);
  text(c, '4 in  ·  8 hmmmm', 540, 610, '400 50px Kalam', 'rgba(255,255,255,.94)', sh);
});
