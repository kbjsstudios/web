#!/usr/bin/env python3
import pathlib
BASE = pathlib.Path("/home/adityakhase/Downloads/web-main") if False else pathlib.Path("/home/adityakhawase/Downloads/web-main")
SITE = "https://kbjsstudios.qzz.io"
TODAY = "2026-10-08"

PAGES = [
    ("/", 1.0, "weekly"),
    ("/thumbnails.html", 0.9, "monthly"),
    ("/discord.html", 0.9, "monthly"),
    ("/minecraft.html", 0.9, "monthly"),
    ("/minecraft-plugins.html", 0.8, "monthly"),
    ("/video.html", 0.8, "monthly"),
    ("/about.html", 0.7, "monthly"),
    ("/contact.html", 0.7, "monthly"),
    ("/mini-games.html", 0.7, "monthly"),
    ("/aim-trainer.html", 0.6, "monthly"),
    ("/target-rush.html", 0.6, "monthly"),
    ("/reaction-shot.html", 0.6, "monthly"),
    ("/precision-range.html", 0.6, "monthly"),
    ("/tracking-trial.html", 0.6, "monthly"),
    ("/resource-packs.html", 0.6, "monthly"),
    ("/free-assets.html", 0.6, "monthly"),
    ("/yt-stuff.html", 0.6, "weekly"),
    ("/privacy.html", 0.3, "yearly"),
    ("/terms.html", 0.3, "yearly"),
]

out = ['<?xml version="1.0" encoding="UTF-8"?>',
       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
       '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">']
for loc, prio, freq in PAGES:
    out.append("  <url>")
    out.append(f"    <loc>{SITE}{loc}</loc>")
    out.append(f"    <lastmod>{TODAY}</lastmod>")
    out.append(f"    <changefreq>{freq}</changefreq>")
    out.append(f"    <priority>{prio:.1f}</priority>")
    out.append("  </url>")
out.append("</urlset>")
(BASE / "sitemap.xml").write_text("\n".join(out) + "\n", encoding="utf-8")

(BASE / "robots.txt").write_text(f"""User-agent: *
Allow: /
Disallow: /KBJS_Studios_SEO_Audit_Report.pdf

# Crawl-delay keeps the static host comfortable under crawler bursts
Crawl-delay: 1

Sitemap: {SITE}/sitemap.xml
""", encoding="utf-8")

print("sitemap:", len(PAGES), "urls | robots written")