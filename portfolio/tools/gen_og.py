"""Generate og.png (1200x630) for link previews — Engineer's Blueprint style.

Usage: python tools/gen_og.py   (from the portfolio/ directory)
"""
from PIL import Image, ImageDraw, ImageFont
import os

BG = (244, 241, 234)      # cream
INK = (22, 21, 15)        # ink
MUTED = (110, 107, 96)    # muted gray
ACCENT = (65, 1, 245)     # electric violet

W, H = 1200, 630
FONTS = r"C:\Windows\Fonts"

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

title = ImageFont.truetype(os.path.join(FONTS, "segoeuib.ttf"), 96)
sub = ImageFont.truetype(os.path.join(FONTS, "segoeui.ttf"), 40)
mono = ImageFont.truetype(os.path.join(FONTS, "consola.ttf"), 28)

# accent square mark
d.rectangle([80, 100, 124, 144], fill=ACCENT)

# name + one-liner
d.text((80, 180), "ADITYA SINGH", font=title, fill=INK)
d.text((84, 316), "Agentic AI systems — guardrails · RAG · orchestration", font=sub, fill=MUTED)

# mono footer line
d.text((84, 520), "PORTFOLIO 2026 · GITHUB.COM/ADITYA0SI", font=mono, fill=MUTED)

# agent-graph motif, right side: nodes + edges + one accent token
nodes = [(940, 200), (1070, 260), (1000, 400), (880, 330), (1090, 470)]
edges = [(0, 1), (1, 2), (2, 3), (2, 4), (0, 3)]
for a, b in edges:
    d.line([nodes[a], nodes[b]], fill=(22, 21, 15, 40), width=2)
for i, (x, y) in enumerate(nodes):
    size = 12 if i != 1 else 16
    color = ACCENT if i == 1 else INK
    d.rectangle([x - size // 2, y - size // 2, x + size // 2, y + size // 2], fill=color)

out = os.path.join(os.path.dirname(__file__), "..", "og.png")
img.save(os.path.normpath(out), "PNG")
print("wrote", os.path.normpath(out))
