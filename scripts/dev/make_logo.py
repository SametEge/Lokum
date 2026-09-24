#!/usr/bin/env python3
"""Draws the Lokum logo: a rounded isometric Turkish-delight cube dusted
with powdered sugar. Writes branding/source/lokum-logo.svg (and variants)."""
import math, os, random

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
OUT = os.path.join(ROOT, "branding", "source")

C = (128, 134)          # cube center
R = 92                  # half-height of the hexagon
W = R * math.cos(math.pi / 6)
T = (C[0], C[1] - R)
UR = (C[0] + W, C[1] - R / 2)
LR = (C[0] + W, C[1] + R / 2)
B = (C[0], C[1] + R)
LL = (C[0] - W, C[1] + R / 2)
UL = (C[0] - W, C[1] - R / 2)

def shrink(poly, amount):
    cx = sum(p[0] for p in poly) / len(poly)
    cy = sum(p[1] for p in poly) / len(poly)
    out = []
    for x, y in poly:
        dx, dy = x - cx, y - cy
        d = math.hypot(dx, dy)
        out.append((x - dx / d * amount, y - dy / d * amount))
    return out

def rounded(poly, r):
    """Path with rounded corners (radius r) for a convex polygon."""
    n = len(poly)
    parts = []
    for i in range(n):
        p0, p1, p2 = poly[i - 1], poly[i], poly[(i + 1) % n]
        v1 = (p0[0] - p1[0], p0[1] - p1[1]); l1 = math.hypot(*v1)
        v2 = (p2[0] - p1[0], p2[1] - p1[1]); l2 = math.hypot(*v2)
        a = (p1[0] + v1[0] / l1 * r, p1[1] + v1[1] / l1 * r)
        b = (p1[0] + v2[0] / l2 * r, p1[1] + v2[1] / l2 * r)
        parts.append((a, p1, b))
    d = f"M{parts[0][2][0]:.2f},{parts[0][2][1]:.2f} "
    for i in range(1, n + 1):
        a, p, b = parts[i % n]
        d += f"L{a[0]:.2f},{a[1]:.2f} Q{p[0]:.2f},{p[1]:.2f} {b[0]:.2f},{b[1]:.2f} "
    return d + "Z"

def point_in(poly, x, y):
    inside = False
    n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]; x2, y2 = poly[(i + 1) % n]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            inside = not inside
    return inside

def sugar(poly, count, rng, rmin, rmax, squash=1.0, margin=10):
    inner = shrink(poly, margin)
    xs = [p[0] for p in inner]; ys = [p[1] for p in inner]
    dots = []
    tries = 0
    while len(dots) < count and tries < 5000:
        tries += 1
        x = rng.uniform(min(xs), max(xs)); y = rng.uniform(min(ys), max(ys))
        if not point_in(inner, x, y):
            continue
        if any(math.hypot(x - a, y - b) < 9 for a, b, _ in dots):
            continue
        dots.append((x, y, rng.uniform(rmin, rmax)))
    return "".join(
        f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{r:.2f}" ry="{r * squash:.2f}" fill="#fff" fill-opacity="{0.55 + rng.random() * 0.4:.2f}"/>'
        for x, y, r in dots)

PALETTES = {
    "gul": ("#ffd3e4", "#ffb0cf", "#f27aa9", "#e0588f", "#d23c78", "#a92a60"),
}

def svg(palette="gul", shadow=True, sparkle=True, size=256):
    t1, t2, l1, l2, r1, r2 = PALETTES[palette]
    rng = random.Random(7)
    top = shrink([T, UR, C, UL], 3.2)
    left = shrink([UL, C, B, LL], 3.2)
    right = shrink([C, UR, LR, B], 3.2)
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 256 256">',
             '<defs>',
             f'<linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{t1}"/><stop offset="1" stop-color="{t2}"/></linearGradient>',
             f'<linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{l1}"/><stop offset="1" stop-color="{l2}"/></linearGradient>',
             f'<linearGradient id="r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{r1}"/><stop offset="1" stop-color="{r2}"/></linearGradient>',
             '<radialGradient id="shine" cx="0.35" cy="0.25" r="0.7"><stop offset="0" stop-color="#fff" stop-opacity="0.65"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>',
             '<radialGradient id="shadow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#7a1f47" stop-opacity="0.35"/><stop offset="1" stop-color="#7a1f47" stop-opacity="0"/></radialGradient>',
             '</defs>']
    if shadow:
        parts.append('<ellipse cx="128" cy="236" rx="78" ry="12" fill="url(#shadow)"/>')
    parts.append(f'<path d="{rounded(left, 14)}" fill="url(#l)"/>')
    parts.append(f'<path d="{rounded(right, 14)}" fill="url(#r)"/>')
    parts.append(f'<path d="{rounded(top, 14)}" fill="url(#t)"/>')
    parts.append(f'<path d="{rounded(top, 14)}" fill="url(#shine)"/>')
    # highlight rim along the top edges of the side faces
    parts.append(f'<path d="M{UL[0]+8:.1f},{UL[1]+8:.1f} L{C[0]:.1f},{C[1]+5:.1f} L{UR[0]-8:.1f},{UR[1]+8:.1f}" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="3" stroke-linecap="round"/>')
    parts.append(sugar(top, 16, rng, 2.2, 4.2, squash=0.6, margin=14))
    parts.append(sugar(left, 8, rng, 1.6, 3.0, margin=14))
    parts.append(sugar(right, 7, rng, 1.6, 3.0, margin=14))
    if sparkle:
        sx, sy, s = 212, 40, 16
        parts.append(f'<path d="M{sx},{sy-s} C{sx+2},{sy-3} {sx+3},{sy-2} {sx+s},{sy} C{sx+3},{sy+2} {sx+2},{sy+3} {sx},{sy+s} C{sx-2},{sy+3} {sx-3},{sy+2} {sx-s},{sy} C{sx-3},{sy-2} {sx-2},{sy-3} {sx},{sy-s}Z" fill="#fff" stroke="#f27aa9" stroke-width="2.5" stroke-linejoin="round"/>')
        parts.append(f'<circle cx="{sx-26}" cy="{sy+4}" r="4" fill="#fff" stroke="#f27aa9" stroke-width="2"/>')
    parts.append('</svg>')
    return "\n".join(parts) + "\n"

def main():
    os.makedirs(OUT, exist_ok=True)
    open(os.path.join(OUT, "lokum-logo.svg"), "w").write(svg())
    open(os.path.join(OUT, "lokum-logo-flat.svg"), "w").write(svg(shadow=False, sparkle=False))
    print("logo written")

if __name__ == "__main__":
    main()
