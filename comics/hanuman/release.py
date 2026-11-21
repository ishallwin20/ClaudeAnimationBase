# release.py: builds the distribution folder of CHIRANJEEVI Issue 2 (out/comics/hanuman_out/release/) from the comic tool's ink output: run python3 comics/hanuman/release.py from the repo root after node tools/comic.mjs --comic=comics/hanuman --look=ink
import json, shutil, subprocess, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import pypdf

INK = 'out/comics/hanuman_out/ink'
REL = 'out/comics/hanuman_out/release'
PRE = f'{REL}/preview'
NAME = 'CHIRANJEEVI-2-Hanuman'
os.makedirs(PRE, exist_ok=True)
C = json.loads(subprocess.check_output(['node', '-e', "const vm=require('vm'),fs=require('fs');const C=vm.runInNewContext(fs.readFileSync('comics/hanuman/comic.js','utf8')+';COMIC');process.stdout.write(JSON.stringify(C))"]))
META = {
    '/Title': 'CHIRANJEEVI 2: Hanuman · He could die any day he chose',
    '/Author': 'Rishi Katha',
    '/Subject': C['description'],
    '/Keywords': 'Hanuman, Bal Hanuman, Ramayana, Valmiki, Chiranjeevi, comic, graphic novel, Hindu mythology, Rishi Katha',
    '/Creator': 'Rishi Katha (rishikatha.com)',
    '/Producer': 'Rishi Katha',
}

def with_meta(src, dst, pages=None, extra=None):
    r = pypdf.PdfReader(src); w = pypdf.PdfWriter()
    for i in (pages if pages is not None else range(len(r.pages))): w.add_page(r.pages[i])
    for p in (extra or []): w.add_page(p)
    w.add_metadata(META)
    w.page_mode = '/UseNone'
    with open(dst, 'wb') as f: w.write(f)

# ---- the preview-end page (2160 × 2700, like the lettered pages)
PW, PH = 2160, 2700
F = 'assets/fonts/'
marc = lambda s: ImageFont.truetype(F + 'Marcellus-Regular.ttf', s)
kal = lambda s: ImageFont.truetype(F + 'Kalam-Bold.ttf', s)
img = Image.new('RGB', (PW, PH), '#0E0A12')
d = ImageDraw.Draw(img)
# a warm glow behind the title
glow = Image.new('L', (PW, PH), 0); gd = ImageDraw.Draw(glow); gd.ellipse((PW / 2 - 1100, -500, PW / 2 + 1100, 1100), fill=90)
glow = glow.filter(ImageFilter.GaussianBlur(220))
img = Image.composite(Image.new('RGB', (PW, PH), '#7A3A1E'), img, glow); d = ImageDraw.Draw(img)
d.rectangle((48, 48, PW - 48, PH - 48), outline='#E9DCC0', width=6)

def ctext(y, s, font, fill):
    w = d.textlength(s, font=font); d.text(((PW - w) / 2, y), s, font=font, fill=fill)

ctext(150, 'END OF THE FREE PREVIEW', marc(112), '#FFE7A6')
# the cliffhanger in a caption box, in the comic's own lettering
box = (170, 330, PW - 170, 700)
d.rectangle((box[0] + 14, box[1] + 14, box[2] + 14, box[3] + 14), fill='#000000')
d.rectangle(box, fill='#F1E7D2', outline='#1A1410', width=6)
lines = ['A baby lies broken on a mountain. The Wind has taken him',
         'into a cave, and taken his wind with him. Gods, demons and',
         'humans are choking. What happens to the three worlds?']
for i, l in enumerate(lines): d.text((box[0] + 60, box[1] + 50 + i * 96), l, font=kal(62), fill='#1A1410')

# four locked panels from the paid pages
def panel(n, i):
    x, y, w, h = C['pages'][str(n)]['panels'][i]['r']
    return Image.open(f'out/comic_hanuman/art_ink/t{n}_50.png').crop((x * 2, y * 2, (x + w) * 2, (y + h) * 2)).convert('RGB')
LOCK = [((14, 1), 'The eight gifts of the gods'), ((22, 1), 'Jambavan remembers'),
        ((40, 0), 'The tail on fire'), ((53, 3), 'Bhima meets an old monkey')]
TW, TH, GX, GY, X0, Y0 = 880, 640, 80, 160, 160, 790
for k, ((n, i), label) in enumerate(LOCK):
    im = panel(n, i); s = max(TW / im.width, TH / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    im = im.crop(((im.width - TW) // 2, (im.height - TH) // 2, (im.width - TW) // 2 + TW, (im.height - TH) // 2 + TH))
    im = im.filter(ImageFilter.GaussianBlur(18))
    im = Image.blend(im, Image.new('RGB', im.size, '#0E0A12'), .35)
    x = X0 + (k % 2) * (TW + GX); y = Y0 + (k // 2) * (TH + GY)
    d.rectangle((x - 12, y - 12, x + TW + 12, y + TH + 12), fill='#0B0810')
    img.paste(im, (x, y)); d = ImageDraw.Draw(img)
    d.rectangle((x - 12, y - 12, x + TW + 12, y + TH + 12), outline='#E9DCC0', width=5)
    # the padlock
    cx, cy = x + TW // 2, y + TH // 2 - 20
    d.rounded_rectangle((cx - 95, cy - 20, cx + 95, cy + 140), radius=22, fill='#F4C46A', outline='#1A1410', width=8)
    d.arc((cx - 66, cy - 130, cx + 66, cy + 10), 180, 360, fill='#1A1410', width=30)
    d.arc((cx - 66, cy - 130, cx + 66, cy + 10), 180, 360, fill='#F4C46A', width=16)
    d.line((cx - 66, cy - 60, cx - 66, cy - 20), fill='#1A1410', width=30); d.line((cx + 66, cy - 60, cx + 66, cy - 20), fill='#1A1410', width=30)
    d.line((cx - 66, cy - 60, cx - 66, cy - 22), fill='#F4C46A', width=16); d.line((cx + 66, cy - 60, cx + 66, cy - 22), fill='#F4C46A', width=16)
    d.ellipse((cx - 20, cy + 30, cx + 20, cy + 70), fill='#1A1410'); d.rectangle((cx - 8, cy + 60, cx + 8, cy + 105), fill='#1A1410')
    lw = d.textlength(label, font=kal(54)); d.text((x + (TW - lw) / 2, y + TH + 28), label, font=kal(54), fill='#FBE0CF')
ctext(2470, 'Read all 58 pages · rishikatha.com', marc(80), '#FFE7A6')
ctext(2580, '@therishikatha', kal(50), '#CFC3B0')
img.save(f'{PRE}/p09_preview_end.png'); img.convert('RGB').resize((1080, 1350), Image.LANCZOS).save(f'{PRE}/p09_preview_end.jpg', quality=92)

# ---- the preview pages as images (1080 × 1350, what the site shows) and the preview PDF
for n in range(1, 9): shutil.copy(f'{INK}/ig/p{n:02d}.jpg', f'{PRE}/p{n:02d}.jpg')
endpdf = f'{PRE}/_end.pdf'
img.convert('RGB').save(endpdf, resolution=192.0)   # 2160 px at 192 dpi = 810 pt wide, the comic's page width
endpage = pypdf.PdfReader(endpdf).pages[0]
endpage.scale_to(810, 1013.04)
with_meta(f'{INK}/hanuman_reader.pdf', f'{PRE}/{NAME}-preview.pdf', pages=range(8), extra=[endpage])
os.remove(endpdf)

# ---- the full issue
with_meta(f'{INK}/hanuman_reader.pdf', f'{REL}/{NAME}.pdf')
with_meta(f'{INK}/hanuman.pdf', f'{REL}/{NAME}-print-hires.pdf')
shutil.copy(f'{INK}/hanuman.epub', f'{REL}/{NAME}.epub')
shutil.copy(f'{INK}/hanuman.cbz', f'{REL}/{NAME}.cbz')
# store covers: 1600 × 2000 JPEG (Play Books / site), and the full 2160 × 2700 PNG
cov = Image.open(f'{INK}/pages/p01.png').convert('RGB')
cov.resize((1600, 2000), Image.LANCZOS).save(f'{REL}/cover_1600x2000.jpg', quality=92)
cov.save(f'{REL}/cover_2160x2700.png')
for f in sorted(os.listdir(REL)) + ['preview/' + f for f in sorted(os.listdir(PRE))]:
    p = f'{REL}/{f}'
    if os.path.isfile(p): print(f'{os.path.getsize(p) / 1e6:7.1f} MB  {f}')
