// Issue 2's cast: first pass, the existing rigs as they are (baseline for the cast test).
const DAY = (dx = 5, dy = -4) => KLIGHT(dx, dy);
function skyDawn(c, P, top = '#F6B26B', bot = '#FBE3B0') { const g = c.createLinearGradient(0, 0, 0, P.h); g.addColorStop(0, top); g.addColorStop(1, bot); c.fillStyle = g; c.fillRect(0, 0, P.w, P.h); }
const HAN_PAL = { fur: '#D99A3A', furSh: '#A8701E', furDk: '#6E4210', furLt: '#F2C46A', chest: '#E8B870', face: '#EBC59A', faceSh: '#C29A6C', muzzle: '#F2D6B0', dhoti: '#D8322E', dhotiSh: '#A21E1E' };
ART.tBalSit = (c, P) => { skyDawn(c, P); c.translate(P.w / 2, P.h * .42); c.scale(1.15, 1.15); figure(c, () => balHanuman(c, { pose: 'wail', expr: 'wail', t: P.t }), lit(DAY())); };
ART.tBalWonder = (c, P) => { skyDawn(c, P, '#E8704A', '#F8C890'); glow(c, P.w * .5, -40, 300, '#FF6A3A', .5); c.translate(P.w / 2, P.h * .56); c.scale(2.1, 2.1); figure(c, () => balHead(c, { expr: 'hungry', look: [0, -1], red: .8, t: P.t }), lit(DAY(0, -6))); };
ART.tBalLeap = (c, P) => { skyDawn(c, P, '#5A9AD8', '#CFE6F6'); c.translate(P.w * .5, P.h * .42); c.rotate(.5); figure(c, () => balHanuman(c, { pose: 'leap', expr: 'grin', look: [.6, -.6], t: P.t }), lit(DAY())); };
ART.tBalFall = (c, P) => { skyDawn(c, P, '#3A3048', '#7A6A80'); c.translate(P.w / 2, P.h * .5); c.rotate(-1.4); figure(c, () => balHanuman(c, { pose: 'limp', expr: 'hurt', bruise: 1, t: P.t }), lit(DAY())); };
const EXPRS = ['calm', 'wonder', 'hungry', 'wail', 'grin', 'giggle', 'fierce', 'hurt', 'pout'];
ART.tBalExpr = (c, P) => { skyDawn(c, P, '#F8D8A0', '#FBEED0'); c.translate(P.w / 2, P.h * .5); c.scale(1.25, 1.25); const i = P.i; figure(c, () => balHead(c, { expr: EXPRS[i], turn: [0, -.5, .4, 0, .5, 0, -.4, 0, .3][i], t: P.t }), lit(DAY())); };
ART.tHanHead = (c, P) => { skyDawn(c, P, '#2A2440', '#8A5A50'); c.translate(P.w / 2, P.h * .5); c.scale(3, 3); c.translate(0, 815); figure(c, () => vanaraHead(c, { pal: HAN_PAL, expr: 'calm', t: P.t }), lit(LIGHTS.fire, { k: 1.3 })); };
ART.tHanStand = (c, P) => { skyDawn(c, P, '#2A2440', '#8A5A50'); c.translate(P.w / 2, P.h * .97); c.scale(.62, .62); figure(c, () => vanara(c, { pal: HAN_PAL, pose: 'plant', arms: 'hips', expr: 'smirk', t: P.t }), lit(LIGHTS.fire)); };
ART.tHanRoar = (c, P) => { skyDawn(c, P, '#401010', '#C04020'); c.translate(P.w / 2, P.h * .5); c.scale(2.4, 2.4); c.translate(0, 815); figure(c, () => vanaraHead(c, { pal: HAN_PAL, expr: 'fierce', open: 1, t: P.t }), lit(LIGHTS.fire, { k: 1.3 })); };
