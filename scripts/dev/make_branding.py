#!/usr/bin/env python3
"""Generates every Lokum branding asset from the SVG sources.

Outputs (committed to the repository so builds need no graphics tools):
  branding/generated/icons/lokum-{16..512}.png
  branding/generated/lokum.ico            (Windows application icon)
  branding/generated/lokum-document.ico   (HTML document icon)
  branding/generated/firefox-branding/*   (files replacing Firefox's chrome://branding/content)
  branding/generated/visual-elements/*    (Windows Start menu tiles)
  branding/generated/installer/*.bmp      (NSIS wizard artwork)
  docs/images/*                           (README artwork)

Requirements (development only): rsvg-convert, ImageMagick `convert`,
Python fontTools, and the Fredoka font (OFL) passed with --font.
"""
import argparse
import os
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, "..", ".."))
SRC = os.path.join(ROOT, "branding", "source")
GEN = os.path.join(ROOT, "branding", "generated")
DOCS = os.path.join(ROOT, "docs", "images")

sys.path.insert(0, HERE)
import make_logo  # noqa: E402


def run(*cmd):
    subprocess.run(cmd, check=True)


def rsvg(svg_path, png_path, w, h=None):
    run("rsvg-convert", "-w", str(w), "-h", str(h or w), "-a", svg_path, "-o", png_path)


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


# --------------------------------------------------------------- wordmark

def wordmark_paths(font_path, text="Lokum", weight=600):
    from fontTools.ttLib import TTFont
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    from fontTools.varLib import instancer

    font = TTFont(font_path)
    if "fvar" in font:
        axes = {a.axisTag: a.defaultValue for a in font["fvar"].axes}
        axes["wght"] = weight
        font = instancer.instantiateVariableFont(font, axes)
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    ascent = font["hhea"].ascent
    x = 0
    paths = []
    for ch in text:
        name = cmap[ord(ch)]
        pen = SVGPathPen(glyph_set)
        # Flip Y (font units are y-up) and move to the baseline.
        tpen = TransformPen(pen, (1, 0, 0, -1, x, ascent))
        glyph_set[name].draw(tpen)
        paths.append(pen.getCommands())
        x += glyph_set[name].width - upm * 0.01
    height = ascent - font["hhea"].descent
    return " ".join(paths), x, ascent, height


def wordmark_svg(font_path, fill="context-fill", gradient=False):
    d, width, ascent, height = wordmark_paths(font_path)
    # Crop to the cap height area.
    pad = 20
    vb_h = ascent * 1.02
    defs = ""
    if gradient:
        defs = ('<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0.3">'
                '<stop offset="0" stop-color="#e0588f"/><stop offset="0.55" stop-color="#d23c78"/>'
                '<stop offset="1" stop-color="#a92a60"/></linearGradient></defs>')
        fill = "url(#g)"
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad} {-pad} {width + 2 * pad:.0f} {vb_h + 2 * pad:.0f}">'
            f'{defs}<path fill="{fill}" d="{d}"/></svg>\n')


# ---------------------------------------------------------------- artwork

def cube_group(x, y, s, palette, rot=0, opacity=1.0):
    """A small isometric cube drawn with three rhombi, for artwork."""
    import math
    t1, t2, l, r = palette
    w = s * math.cos(math.pi / 6)
    top = [(0, -s), (w, -s / 2), (0, 0), (-w, -s / 2)]
    left = [(-w, -s / 2), (0, 0), (0, s), (-w, s / 2)]
    right = [(0, 0), (w, -s / 2), (w, s / 2), (0, s)]
    pts = lambda poly: " ".join(f"{px:.1f},{py:.1f}" for px, py in poly)
    j = f'stroke-linejoin="round" stroke-width="{s * 0.16:.1f}"'
    return (f'<g transform="translate({x},{y}) rotate({rot})" opacity="{opacity}">'
            f'<polygon points="{pts(left)}" fill="{l}" stroke="{l}" {j}/>'
            f'<polygon points="{pts(right)}" fill="{r}" stroke="{r}" {j}/>'
            f'<polygon points="{pts(top)}" fill="{t1}" stroke="{t1}" {j}/>'
            f'<circle cx="{-w * 0.3:.1f}" cy="{-s * 0.55:.1f}" r="{s * 0.06:.1f}" fill="#fff" opacity=".85"/>'
            f'<circle cx="{w * 0.25:.1f}" cy="{-s * 0.45:.1f}" r="{s * 0.05:.1f}" fill="#fff" opacity=".8"/>'
            f'<circle cx="{0:.1f}" cy="{-s * 0.75:.1f}" r="{s * 0.045:.1f}" fill="#fff" opacity=".7"/>'
            f'</g>')


FLAVOR_CUBES = [
    ("#ffd3e4", "#ffb0cf", "#e0588f", "#b82c66"),  # gul
    ("#e3f2cf", "#cfe8b0", "#8cbf5a", "#5d8f2c"),  # fistik
    ("#fff6c9", "#ffe98f", "#f2c93c", "#c79a10"),  # limon
    ("#ffd9dd", "#f7a5ae", "#e04d62", "#ad1f3a"),  # nar
    ("#ffe8d2", "#ffc896", "#f5934a", "#cf5b15"),  # portakal
    ("#dcf5ec", "#b3e6d5", "#4fc39f", "#1b8766"),  # nane
    ("#ece4ff", "#d6c6ff", "#9a7cf0", "#6a46d8"),  # lavanta
]


def sugar_dots(w, h, n, seed, rmin=0.8, rmax=2.2, opacity=(0.35, 0.9)):
    import random
    rng = random.Random(seed)
    return "".join(
        f'<circle cx="{rng.uniform(0, w):.1f}" cy="{rng.uniform(0, h):.1f}" r="{rng.uniform(rmin, rmax):.2f}" '
        f'fill="#fff" opacity="{rng.uniform(*opacity):.2f}"/>'
        for _ in range(n))


def installer_wizard_svg(wordmark_d_svg):
    # 164x314 NSIS welcome/finish image (rendered at 2x then downscaled).
    cubes = "".join([
        cube_group(52, 84, 26, FLAVOR_CUBES[0][:1] + FLAVOR_CUBES[0][1:], -6),
        cube_group(116, 132, 20, FLAVOR_CUBES[1], 8),
        cube_group(46, 178, 16, FLAVOR_CUBES[2], -10),
        cube_group(112, 226, 22, FLAVOR_CUBES[6], 4),
        cube_group(60, 262, 14, FLAVOR_CUBES[4], -4),
    ])
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="164" height="314" viewBox="0 0 164 314">
<defs><linearGradient id="bg" x1="0" y1="0" x2="0.4" y2="1">
<stop offset="0" stop-color="#ffe4ee"/><stop offset="0.55" stop-color="#fac6da"/><stop offset="1" stop-color="#f1a2c2"/></linearGradient>
<radialGradient id="glow" cx="0.3" cy="0.15" r="0.6"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
<rect width="164" height="314" fill="url(#bg)"/><rect width="164" height="314" fill="url(#glow)"/>
{sugar_dots(164, 314, 70, 3, 0.4, 1.3)}
{cubes}
<g transform="translate(24,262)">{wordmark_d_svg}</g>
</svg>'''


def installer_header_svg():
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="150" height="57" viewBox="0 0 150 57">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="0.3">
<stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="#ffe4ee"/><stop offset="1" stop-color="#f7b8d0"/></linearGradient></defs>
<rect width="150" height="57" fill="url(#bg)"/>
{sugar_dots(150, 57, 18, 5, 0.4, 1.1)}
{cube_group(118, 30, 15, FLAVOR_CUBES[0], -6)}
{cube_group(88, 38, 9, FLAVOR_CUBES[1], 8, 0.9)}
</svg>'''


def banner_svg(wordmark_inner, width=1280, height=400):
    cubes = []
    positions = [(120, 120, 46, -8), (230, 290, 30, 10), (1060, 110, 40, 6), (1170, 270, 52, -10),
                 (960, 320, 24, 12), (330, 80, 20, 4), (880, 70, 18, -6)]
    for i, (x, y, s, rot) in enumerate(positions):
        cubes.append(cube_group(x, y, s, FLAVOR_CUBES[i % len(FLAVOR_CUBES)], rot))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe4ee"/><stop offset="0.5" stop-color="#fac6da"/><stop offset="1" stop-color="#f1a2c2"/></linearGradient>
<radialGradient id="glow" cx="0.5" cy="0.35" r="0.55"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<clipPath id="r"><rect width="{width}" height="{height}" rx="28"/></clipPath>
</defs>
<g clip-path="url(#r)">
<rect width="{width}" height="{height}" fill="url(#bg)"/><rect width="{width}" height="{height}" fill="url(#glow)"/>
{sugar_dots(width, height, 220, 9, 0.6, 2.4)}
{''.join(cubes)}
<g transform="translate({width / 2 - 260},{height / 2 - 125})">{wordmark_inner}</g>
<text x="{width / 2}" y="{height / 2 + 105}" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="30" font-weight="600" fill="#8b5271">A sweeter way to browse · Firefox-based · Arc-style</text>
</g></svg>'''


# ------------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--font", required=True, help="Fredoka variable TTF")
    args = ap.parse_args()

    for tool in ("rsvg-convert", "convert"):
        if not shutil.which(tool):
            sys.exit(f"missing tool: {tool}")

    make_logo.main()
    logo = os.path.join(SRC, "lokum-logo.svg")
    flat = os.path.join(SRC, "lokum-logo-flat.svg")

    # Wordmarks
    wm_context = wordmark_svg(args.font)
    wm_color = wordmark_svg(args.font, gradient=True)
    write(os.path.join(SRC, "lokum-wordmark.svg"), wm_color)
    write(os.path.join(SRC, "lokum-wordmark-context.svg"), wm_context)

    icons = os.path.join(GEN, "icons")
    os.makedirs(icons, exist_ok=True)
    for size in (16, 20, 24, 32, 40, 48, 64, 96, 128, 192, 256, 384, 512):
        src = flat if size <= 48 else logo
        rsvg(src, os.path.join(icons, f"lokum-{size}.png"), size)

    ico_sizes = [16, 20, 24, 32, 40, 48, 64, 96, 128, 256]
    run("convert", *[os.path.join(icons, f"lokum-{s}.png") for s in ico_sizes], os.path.join(GEN, "lokum.ico"))

    # Document icon: page with a small cube.
    doc_svg = os.path.join(SRC, "lokum-document.svg")
    with open(flat, encoding="utf-8") as f:
        inner = f.read().split(">", 1)[1].rsplit("</svg>", 1)[0]
    write(doc_svg, f'''<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
<path d="M52 16h104l52 52v164a8 8 0 0 1-8 8H52a8 8 0 0 1-8-8V24a8 8 0 0 1 8-8z" fill="#fff" stroke="#e0588f" stroke-width="6"/>
<path d="M156 16v44a8 8 0 0 0 8 8h44" fill="#ffe4ee" stroke="#e0588f" stroke-width="6" stroke-linejoin="round"/>
<g transform="translate(64,92) scale(0.5)">{inner}</g></svg>\n''')
    with tempfile.TemporaryDirectory() as tmp:
        pngs = []
        for s in ico_sizes:
            p = os.path.join(tmp, f"d{s}.png")
            rsvg(doc_svg, p, s)
            pngs.append(p)
        run("convert", *pngs, os.path.join(GEN, "lokum-document.ico"))

    # Replacement for chrome://branding/content/
    fb = os.path.join(GEN, "firefox-branding")
    os.makedirs(fb, exist_ok=True)
    for name, size in (("about-logo.png", 192), ("about-logo@2x.png", 384),
                       ("about-logo-private.png", 192), ("about-logo-private@2x.png", 384),
                       ("icon16.png", 16), ("icon32.png", 32), ("icon48.png", 48),
                       ("icon64.png", 64), ("icon128.png", 128)):
        rsvg(flat if size <= 48 else logo, os.path.join(fb, name), size)
    shutil.copy(logo, os.path.join(fb, "about-logo.svg"))
    write(os.path.join(fb, "about-wordmark.svg"), wm_context)
    write(os.path.join(fb, "firefox-wordmark.svg"), wm_context)
    run("convert", "-size", "300x236", "xc:none", "(", os.path.join(icons, "lokum-192.png"), ")",
        "-gravity", "center", "-composite", os.path.join(fb, "about.png"))
    shutil.copy(os.path.join(GEN, "lokum-document.ico"), os.path.join(fb, "document.ico"))
    write(os.path.join(fb, "document_pdf.svg"), open(doc_svg, encoding="utf-8").read())

    # Windows Start menu tiles
    ve = os.path.join(GEN, "visual-elements")
    os.makedirs(ve, exist_ok=True)
    rsvg(flat, os.path.join(ve, "VisualElements_150.png"), 300)
    rsvg(flat, os.path.join(ve, "VisualElements_70.png"), 142)

    # NSIS artwork
    inst = os.path.join(GEN, "installer")
    os.makedirs(inst, exist_ok=True)
    wm_inner = wm_color.split(">", 1)[1].rsplit("</svg>", 1)[0]
    wm_viewbox = wm_color.split('viewBox="', 1)[1].split('"', 1)[0]

    def nested(width, height):
        return (f'<svg viewBox="{wm_viewbox}" width="{width}" height="{height}" '
                f'preserveAspectRatio="xMidYMid meet">{wm_inner}</svg>')
    with tempfile.TemporaryDirectory() as tmp:
        wiz = os.path.join(tmp, "wizard.svg")
        write(wiz, installer_wizard_svg(nested(116, 40)))
        run("rsvg-convert", "-w", "328", "-h", "628", wiz, "-o", os.path.join(tmp, "wizard.png"))
        run("convert", os.path.join(tmp, "wizard.png"), "-resize", "164x314!", "-background", "white",
            "-flatten", "-type", "TrueColor", "BMP3:" + os.path.join(inst, "wizard.bmp"))
        hdr = os.path.join(tmp, "header.svg")
        write(hdr, installer_header_svg())
        run("rsvg-convert", "-w", "300", "-h", "114", hdr, "-o", os.path.join(tmp, "header.png"))
        run("convert", os.path.join(tmp, "header.png"), "-resize", "150x57!", "-background", "white",
            "-flatten", "-type", "TrueColor", "BMP3:" + os.path.join(inst, "header.bmp"))

    # README artwork
    os.makedirs(DOCS, exist_ok=True)
    shutil.copy(logo, os.path.join(DOCS, "lokum-logo.svg"))
    rsvg(logo, os.path.join(DOCS, "lokum-logo-256.png"), 256)
    banner = banner_svg(nested(520, 180))
    write(os.path.join(DOCS, "banner.svg"), banner)
    run("rsvg-convert", "-w", "1280", "-h", "400", os.path.join(DOCS, "banner.svg"), "-o", os.path.join(DOCS, "banner.png"))
    print("branding generated")


if __name__ == "__main__":
    main()
