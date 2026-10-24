# tools/lockscreen.py: a transparent lock-screen overlay (the date and clock, the two buttons, the home bar), to bake the
# time into a wallpaper's preview.  python3 tools/lockscreen.py ios|android <out.png> [date] [time]
#   ios      1290×2796, the iPhone lock screen: San Francisco (SFNS), the date over a big bold clock, the flashlight and
#            camera buttons, the home bar
#   android  1080×2400, Samsung's One UI: a big light clock with the date under it, the phone and camera shortcuts
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

kind, out = sys.argv[1], sys.argv[2]
date = sys.argv[3] if len(sys.argv) > 3 else 'Saturday 24 October'
clock = sys.argv[4] if len(sys.argv) > 4 else '9:41'
W, H = (1290, 2796) if kind == 'ios' else (1080, 2400)

def sf(size, weight):
    f = ImageFont.truetype('/System/Library/Fonts/SFNS.ttf', size)
    f.set_variation_by_axes([100, 96 if size > 120 else 28, 400, weight])   # width, optical size, grade, weight
    return f

img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
for layer, col in ((shadow, (0, 0, 0, 70)), (img, (255, 255, 255, 240))):
    d = ImageDraw.Draw(layer)
    if kind == 'ios':
        d.text((W / 2, 300), date, font=sf(56, 590), fill=col, anchor='mm')
        d.text((W / 2, 520), clock, font=sf(300, 700), fill=col, anchor='mm')
    else:
        d.text((W / 2, 470), clock, font=sf(250, 300), fill=col, anchor='mm')
        d.text((W / 2, 660), date, font=sf(50, 500), fill=col, anchor='mm')
shadow = shadow.filter(ImageFilter.GaussianBlur(10))
img = Image.alpha_composite(shadow, img)
d = ImageDraw.Draw(img)
if kind == 'ios':
    for x in (179, 1111):   # the flashlight and camera buttons
        y, r = 2597, 75
        d.ellipse((x - r, y - r, x + r, y + r), fill=(30, 30, 40, 130))
    d.rounded_rectangle((179 - 14, 2597 - 34, 179 + 14, 2597 + 34), 8, outline=(255, 255, 255, 235), width=5)
    d.rounded_rectangle((1111 - 34, 2597 - 22, 1111 + 34, 2597 + 26), 8, outline=(255, 255, 255, 235), width=5)
    d.ellipse((1111 - 12, 2600 - 12, 1111 + 12, 2600 + 12), outline=(255, 255, 255, 235), width=5)
    d.rounded_rectangle((W / 2 - 165, 2732, W / 2 + 165, 2746), 7, fill=(255, 255, 255, 220))
else:
    for x in (110, 970):    # the phone and camera shortcuts
        d.ellipse((x - 26, 2240 - 26, x + 26, 2240 + 26), outline=(255, 255, 255, 220), width=5)
    d.text((W / 2, 2240), 'Swipe to unlock', font=sf(36, 500), fill=(255, 255, 255, 200), anchor='mm')
img.save(out)
