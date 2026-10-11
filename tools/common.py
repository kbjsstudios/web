#!/usr/bin/env python3
"""
KBJS STUDIOS — page generator
Single source of truth for all markup. Preserves real business content,
services, links and the SEO work already done.
"""
import pathlib, json, html, re

BASE = pathlib.Path("/home/adityakhawase/Downloads/web-main")
SITE = "https://kbjsstudios.qzz.io"

# ── real business data (sourced from the existing site) ──────────────
EMAIL = "kbjsstudios@gmail.com"
YT_KNOCK = "https://youtube.com/@knockbackkk"
YT_SLAYER = "https://youtube.com/@justslayer0"
DISCORD = "https://discord.gg/2QPMk6jvpV"
IG_KNOCK = "https://www.instagram.com/knockback.gg"
IG_SLAYER = "https://www.instagram.com/justslayer0"

SERVERS = [
    ("Outdoor SMP S1", "Season 1 of the outdoor survival multiplayer experience."),
    ("Outdoor SMP S2", "Season 2 — expanded world, new builds, bigger community."),
    ("Outdoor SMP S3", "Season 3 with revamped terrain and fresh gameplay."),
    ("Outdoor SMP S4", "Season 4 — the latest season of the Outdoor SMP series."),
    ("Oneblock Server", "Classic oneblock challenge with custom progression."),
    ("Blood Bound Citadel S1", "First season of the Blood Bound Citadel saga."),
    ("Blood Bound Citadel S2", "Season 2 — darker, harder, more action."),
    ("Knock SMP", "The original Knock SMP experience."),
    ("Kitten Kraft S1", "Season 1 of the cozy Kitten Kraft server."),
    ("Kitten Kraft S2", "Season 2 — more cats, more crafts, more fun."),
    ("Slaughter SMP", "High-stakes PVP survival at its finest."),
    ("Danger PVP", "Arena-based PVP server with custom kits and maps."),
    ("Skyblock", "Classic skyblock with custom challenges and upgrades."),
    ("Lifesteal SMPs", "Multiple lifesteal seasons with unique twists."),
    ("Hardcore Server", "Permadeath hardcore survival with custom rules."),
]

DISCORD_FEATURES = [
    ("YT Notifier", "Auto-posts YouTube uploads to your server the moment a video goes live.", "tv.svg"),
    ("Ticket Tool", "Private support tickets with custom categories, transcripts, and staff assignments.", "ticket.svg"),
    ("Music Bot", "High-quality music playback from YouTube, Spotify, and more with queue controls.", "music.svg"),
    ("OwO Bot", "Fun economy, battle, hunting, and levelling commands to boost engagement.", "owl.svg"),
    ("Custom Roles", "Personalised role sets with custom colours, hierarchies, and permission presets.", "label.svg"),
    ("Channel Management", "Structured channel layouts — text, voice, stage, forum, and announcement channels.", "folder.svg"),
    ("Category Management", "Organised category grouping with permission syncing and clean separation.", "folder-open.svg"),
    ("Welcomer Bot", "Custom join/leave messages, auto-roles, and onboarding for new members.", "wave.svg"),
    ("Permission Management", "Fine-grained permission setups for roles, channels, and servers.", "lock.svg"),
    ("Custom Discord Server", "Complete bespoke server builds — branding, bots, layout, and automation included.", "shield.svg"),
]

MINECRAFT_FEATURES = [
    ("Server Builds", "Custom spawns, lobbies, arenas, and worlds designed to impress your players."),
    ("Custom Plugins", "Bespoke plugins built from scratch for your server's unique needs."),
    ("Best MOTDs", "Eye-catching server MOTDs with animated text, gradients, and custom designs."),
    ("Best Designs", "Top-tier visual designs — spawns, lobbies, and server branding that stand out."),
    ("24/7 Bot Setup", "Always-on bots for moderation, utilities, and automation — hosted and maintained."),
]

EMOJIS = [
    ("kbjs-gg", "kbjs_gg", "GG — celebrate a win"),
    ("kbjs-w", "kbjs_w", "W — take the dub"),
    ("kbjs-l", "kbjs_l", "L — playful roast"),
    ("kbjs-ez", "kbjs_ez", "EZ — easy clutch"),
    ("kbjs-hype", "kbjs_hype", "HYPE — start the party"),
    ("kbjs-live", "kbjs_live", "LIVE — stream is on"),
    ("kbjs-welcome", "kbjs_welcome", "Welcome new members"),
    ("kbjs-ticket", "kbjs_ticket", "Support tickets"),
    ("kbjs-music", "kbjs_music", "Music queue"),
    ("kbjs-mod", "kbjs_mod", "Mod approved"),
    ("kbjs-clip", "kbjs_clip", "Clip it"),
    ("kbjs-grind", "kbjs_grind", "Grind mode"),
]

NAV = [
    ("index.html", "Home"),
    ("thumbnails.html", "Thumbnails"),
    ("discord.html", "Discord"),
    ("minecraft.html", "Minecraft"),
    ("video.html", "Video"),
    ("about.html", "About"),
]

# ── schema graph ───────────────────────────────────────────────────
ORG = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": SITE + "/#organization",
    "name": "KBJS Studios",
    "url": SITE + "/",
    "logo": {"@type": "ImageObject", "url": SITE + "/logos/kbjslogo.png", "width": 1254, "height": 1254},
    "description": "Creative digital studio building gaming thumbnails, Minecraft servers, Discord communities and video editing for creators.",
    "email": EMAIL,
    "founder": [
        {"@type": "Person", "name": "Knockbackkk", "url": YT_KNOCK},
        {"@type": "Person", "name": "JustSlayer", "url": YT_SLAYER},
    ],
    "sameAs": [YT_KNOCK, YT_SLAYER, DISCORD],
    "knowsAbout": ["Minecraft server development", "Custom Minecraft plugins",
                   "Discord server setup", "YouTube thumbnail design",
                   "Short-form video editing"],
}
WEBSITE = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE + "/#website",
    "name": "KBJS Studios",
    "url": SITE + "/",
    "publisher": {"@id": SITE + "/#organization"},
    "inLanguage": "en-US",
}

def crumbs(items):
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i, "name": n,
             "item": SITE + "/" if href == "index.html" else (SITE + "/" + href if href else SITE + "/")}
            for i, (n, href) in enumerate(items, 1)
        ],
    }

def faq_schema(pairs):
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q,
             "acceptedAnswer": {"@type": "Answer", "text": strip_tags(a)}}
            for q, a in pairs
        ],
    }

def service_schema(name, desc, url):
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": name,
        "description": desc,
        "url": SITE + "/" + url,
        "provider": {"@id": SITE + "/#organization"},
        "areaServed": "Worldwide",
        "serviceType": name,
    }

def strip_tags(s):
    import re
    return re.sub(r"<[^>]+>", "", s).replace("&amp;", "&").replace("&nbsp;", " ")

# ── shell pieces ───────────────────────────────────────────────────
def head(title, desc, url, schemas, og_type="website", og_image=None):
    img = og_image or f"{SITE}/logos/og-image.jpg"
    s = "\n".join(f'<script type="application/ld+json">{json.dumps(x)}</script>' for x in schemas)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{SITE}/{url}">
<meta name="theme-color" content="#F6F8FC">
<meta name="theme-color" content="#0b0d12" media="(prefers-color-scheme: dark)">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="color-scheme" content="light dark">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="KBJS Studios">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{SITE}/{url}">
<meta property="og:image" content="{img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="KBJS Studios — Minecraft servers, Discord communities, thumbnails and Shorts">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image:alt" content="KBJS Studios — Minecraft servers, Discord communities, thumbnails and Shorts">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{img}">
<link rel="icon" type="image/png" href="logos/kbjslogo.png">
<link rel="apple-touch-icon" href="logos/kbjslogo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="preload" href="logos/webp/kbjslogo.webp" as="image" type="image/webp">
<link rel="stylesheet" href="styles.css">
{s}
</head>
"""

ICON_MENU = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg>'
ICON_CHEV = '<span class="mega-chev" aria-hidden="true">&#9662;</span>'

RESOURCES = [
    ("Downloads", "Resource packs, assets, and tools.",
     [("resource-packs.html", "Resource Packs"), ("free-assets.html", "Free Assets"),
      ("minecraft-plugins.html", "Minecraft Plugins")]),
    ("Mini Games", "Mini Games, Aim Trainer, Target Rush, Reaction Shot, Precision Range, Tracking Trial.",
     [("mini-games.html", "Mini Games"), ("aim-trainer.html", "Aim Trainer"),
      ("target-rush.html", "Target Rush"), ("reaction-shot.html", "Reaction Shot"),
      ("precision-range.html", "Precision Range"), ("tracking-trial.html", "Tracking Trial")]),
    ("Company", "YT Stuff, About KBJS, Contact Us, Privacy Policy, Terms of Service.",
     [("yt-stuff.html", "YT Stuff"), ("about.html", "About KBJS"),
      ("contact.html", "Contact Us"), ("privacy.html", "Privacy Policy"),
      ("terms.html", "Terms of Service")]),
]

def mega_menu():
    groups = "\n".join(
        f'<div class="mega-group"><p class="mega-group-title">{title}</p>'
        f'<p class="mega-group-desc">{desc}</p><div class="mega-group-links">'
        + "".join(f'<a href="{h}" class="mega-link">{t}</a>' for h, t in links)
        + '</div></div>'
        for title, desc, links in RESOURCES)
    return f"""
<div class="mega-wrap">
  <button class="mega-btn" id="mega-btn" type="button"
          aria-expanded="false" aria-controls="mega-panel" aria-haspopup="true">More{ICON_CHEV}</button>
  <div class="mega-panel" id="mega-panel" role="menu" aria-label="More pages">{groups}</div>
</div>
"""

def drawer_groups():
    return "\n".join(
        f'<div class="mega-group"><p class="mega-group-title">{title}</p><div class="mega-group-links">'
        + "".join(f'<a href="{h}" class="mega-link">{t}</a>' for h, t in links)
        + '</div></div>'
        for title, _desc, links in RESOURCES)

def nav(active):
    links = "\n".join(
        f'<li><a class="nav-link" href="{h}">{t}</a></li>'
        for h, t in NAV)
    links += f'\n<li class="mega-wrap">{mega_menu()}</li>'
    drawer = "\n".join(
        f'<li><a href="{h}"{" aria-current=\"page\"" if h == active else ""}>{t}</a></li>'
        for h, t in NAV)
    return f"""
<a class="skip-link" href="#main">Skip to content</a>

<header class="site-header">
<div class="nav-shell" data-scrolled="false">
  <nav class="navbar" aria-label="Primary">
    <a class="nav-logo" href="index.html">
      <picture><source srcset="logos/webp/kbjslogo.webp" type="image/webp">
      <img width="34" height="34" loading="eager" fetchpriority="high" decoding="async" src="logos/kbjslogo.png" alt="" aria-hidden="true"></picture>
      <span>KBJS Studios</span>
    </a>
    <ul class="nav-links">{links}</ul>
    <div class="nav-actions">
      <a class="btn btn-primary" href="contact.html">Get Started</a>
      <button class="icon-btn mobile-toggle" id="mobile-toggle" type="button"
              aria-label="Open menu" aria-expanded="false" aria-controls="nav-drawer">{ICON_MENU}</button>
    </div>
  </nav>
</div>

<div class="nav-drawer" id="nav-drawer" aria-hidden="true">
  <button class="nav-drawer-close" id="nav-drawer-close" type="button" aria-label="Close menu">&times;</button>
  <ul class="nav-drawer-list">{drawer}</ul>
  <div class="nav-drawer-groups">{drawer_groups()}</div>
  <a class="btn btn-primary" href="contact.html">Get Started</a>
</div>
</header>
"""

def footer():
    cols = [
        ("Services", [("thumbnails.html", "Gaming Thumbnails"), ("discord.html", "Discord Servers"),
                      ("minecraft.html", "Minecraft Servers"), ("video.html", "Video Editing")]),
        ("Resources", [("yt-stuff.html", "YT Stuff"), ("resource-packs.html", "Resource Packs"),
                       ("free-assets.html", "Free Assets"), ("minecraft-plugins.html", "Minecraft Plugins"),
                       ("mini-games.html", "Mini Games")]),
        ("Company", [("about.html", "About Us"), ("contact.html", "Contact"),
                     ("yt-stuff.html", "YouTube"), ("discord.html", "Discord")]),
        ("Legal", [("privacy.html", "Privacy Policy"), ("terms.html", "Terms of Service"),
                   ("contact.html", "Get in Touch")]),
    ]
    col_html = "\n".join(
        f'<div class="footer-col"><h2 class="footer-heading">{t}</h2><ul class="footer-links">'
        + "".join(f'<li><a href="{h}">{n}</a></li>' for h, n in links)
        + '</ul></div>'
        for t, links in cols)
    return f"""
<footer class="site-footer">
  <div class="footer-grid">
    <div class="footer-col footer-brand">
      <a class="nav-logo" href="index.html">
        <picture><source srcset="logos/webp/kbjslogo.webp" type="image/webp">
        <img width="34" height="34" loading="lazy" decoding="async" src="logos/kbjslogo.png" alt="" aria-hidden="true"></picture>
        <span>KBJS Studios</span>
      </a>
      <p>Creative digital studio building Minecraft servers, Discord communities, gaming thumbnails and video for creators.</p>
      <ul class="social-links">
        <li><a class="social-icon-btn" href="{YT_KNOCK}" rel="noopener" target="_blank" aria-label="KBJS Studios on YouTube">
          <picture><source srcset="logos/webp/knockbackkk.webp" type="image/webp">
          <img width="20" height="20" loading="lazy" decoding="async" src="logos/knockbackkk.png" alt="" aria-hidden="true"></picture></a></li>
        <li><a class="social-icon-btn" href="{DISCORD}" rel="noopener" target="_blank" aria-label="KBJS Studios on Discord">
          <picture><source srcset="logos/webp/discordlogo.webp" type="image/webp">
          <img width="20" height="20" loading="lazy" decoding="async" src="logos/discordlogo.png" alt="" aria-hidden="true"></picture></a></li>
        <li><a class="social-icon-btn" href="{YT_SLAYER}" rel="noopener" target="_blank" aria-label="JustSlayer on YouTube">
          <picture><source srcset="logos/webp/justslayer.webp" type="image/webp">
          <img width="20" height="20" loading="lazy" decoding="async" src="logos/justslayer.png" alt="" aria-hidden="true"></picture></a></li>
      </ul>
    </div>
{col_html}
  </div>
  <div class="footer-bottom">
    <span>&copy; 2026 KBJS Studios. All rights reserved.</span>
    <span>Independent creative studio &middot; <a href="mailto:{EMAIL}">{EMAIL}</a></span>
  </div>
</footer>
<div class="toast-container" id="toast-container"></div>
"""

def page(fname, title, desc, body, schemas, active=None, extra_class=""):
    content = head(title, desc, fname, [ORG, WEBSITE] + schemas)
    content += (f'<body{(" class=\"" + extra_class + "\"") if extra_class else ""}>')
    content += nav(active or fname)

    content += f'\n<main id="main">\n{body}\n</main>\n'
    content += footer()

    # Bare <h2> elements are section titles everywhere except the CTA
    # band, which keeps its own sizing inside the gradient panel.
    content = content.replace('<h2>', '<h2 class="section-title">')
    content = content.replace('<div class="cta-section"><h2 class="section-title">',
                              '<div class="cta-section"><h2>')
    content += f"""
<script src="firebase-config.js" defer></script>
<script src="script.js" defer></script>
</body>
</html>
"""
    (BASE / fname).write_text(content, encoding="utf-8")
    return len(content)