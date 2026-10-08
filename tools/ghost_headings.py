#!/usr/bin/env python3
"""Attach data-ghost values to selected headings.

Rule: only headings that are the visual anchor of a section get a ghost.
Every h2 would be repetitive, so these are chosen deliberately.
Ghost text is also skipped where the heading is short and the
eyebrow already says the same thing.
"""
import pathlib, re, html

BASE = pathlib.Path("/home/adityakhawase/Downloads/web-main")

# page -> list of exact plain-text headings that get a ghost
GHOSTS = {
    "index.html": [
        "Four services, one studio",
        "Things we have shipped",
        "A process that does not waste your time",
        "Small studio, direct access",
    ],
    "minecraft.html": [
        "Servers we have built",
        "From idea to launch",
    ],
    "discord.html": [
        "Server features",
        "An emoji pack that matches your server",
        "Our workflow",
    ],
    "thumbnails.html": [
        "How we design thumbnails",
    ],
    "video.html": [
        "Shorts & long-form",
        "Why Shorts first",
    ],
    "about.html": [
        "Who we help",
        "From two channels to a full studio",
        "We are creators too",
    ],
    "mini-games.html": [
        "Play now",
        "Which game tests what?",
    ],
    "minecraft-plugins.html": [
        "How to install a plugin",
    ],
    "resource-packs.html": [
        "How to install a pack",
    ],
    "free-assets.html": [
        "How to use these",
    ],
    "contact.html": [
        "How to brief us",
    ],
}


def plain(markup):
    txt = re.sub(r"<[^>]+>", "", markup)
    return html.unescape(txt).strip()


def ghost_size(text):
    """Font size (vw) that lets a nowrap ghost fit the viewport.

    An uppercase grotesque averages roughly 0.58em per character, so a
    string of N characters needs about N*0.58em of width. Solving for
    that against a ~90vw target and clamping gives a size that stays
    dramatic on short headings and stays honest on long ones.
    """
    n = max(1, len(text))
    vw = 90 / (0.58 * n)
    return round(max(3.6, min(vw, 11.5)), 2)


changed = 0
for fname, wanted in GHOSTS.items():
    p = BASE / fname
    txt = p.read_text(encoding="utf-8-sig")
    orig = txt

    def add_attr(m):
        head_open, inner = m.group(1), m.group(2)
        text = plain(inner)
        if text not in wanted or "data-ghost" in head_open:
            return m.group(0)
        return (f'{head_open} data-ghost="{text}" '
                f'style="--ghost-size:{ghost_size(text)}vw">{inner}</h2>')

    txt = re.sub(r"(<h2 class=\"section-title\")>(.*?)</h2>", add_attr, txt, flags=re.S)

    if txt != orig:
        p.write_text(txt, encoding="utf-8")
        n = txt.count("data-ghost")
        changed += 1
        print(f"  {fname:24} {n} ghost heading(s)")
    else:
        print(f"  {fname:24} no change")

print(f"\n{changed} pages updated")