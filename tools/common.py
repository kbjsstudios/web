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
<meta name="theme-color" content="#070912" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#f6f8fc" media="(prefers-color-scheme: light)">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="color-scheme" content="dark light">
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
<link rel="preload" href="fonts/Inter-var-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="logos/webp/kbjslogo.webp" as="image" type="image/webp">
<link rel="stylesheet" href="style.css">
<script>try{{var k=localStorage.getItem('kbjs_theme');if(k==='light'||(!k&&matchMedia('(prefers-color-scheme: light)').matches))document.documentElement.classList.add('theme-light');}}catch(e){{}}</script>
{s}
</head>
"""

ICON_SUN = '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>'
ICON_MOON = '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>'
ICON_MENU = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg>'

def nav(active):
    links = "\n".join(
        f'<li><a class="nav-link" href="{h}">{t}</a></li>'
        for h, t in NAV)
    drawer = "\n".join(
        f'<li><a href="{h}"{" aria-current=\"page\"" if h == active else ""}>{t}</a></li>'
        for h, t in NAV)
    return f"""
<a class="skip-link" href="#main">Skip to content</a>
<canvas id="galaxy-canvas" aria-hidden="true"></canvas>
<div class="galaxy-vignette" aria-hidden="true"></div>

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
      <button class="icon-btn theme-toggle-btn" type="button" aria-label="Toggle colour theme" title="Toggle theme">{ICON_SUN}{ICON_MOON}</button>
      <a class="btn btn-primary" href="contact.html">Get Started</a>
      <button class="icon-btn mobile-toggle" id="mobile-toggle" type="button"
              aria-label="Open menu" aria-expanded="false" aria-controls="nav-drawer">{ICON_MENU}</button>
    </div>
  </nav>
</div>

<div class="nav-drawer" id="nav-drawer" aria-hidden="true">
  <ul class="nav-drawer-list">{drawer}</ul>
  <a class="btn btn-primary" href="contact.html">Get Started</a>
</div>
</header>
"""

RESOURCES = [
    ("Downloads", "Resource packs, assets, and tools.",
     [("resource-packs.html", "Resource Packs"), ("free-assets.html", "Free Assets"),
      ("minecraft-plugins.html", "Minecraft Plugins")]),
    ("Mini Games", "Free browser games, no download.",
     [("mini-games.html", "Mini Games"), ("aim-trainer.html", "Aim Trainer"),
      ("target-rush.html", "Target Rush"), ("reaction-shot.html", "Reaction Shot"),
      ("precision-range.html", "Precision Range"), ("tracking-trial.html", "Tracking Trial")]),
    ("More", "Company and legal.",
     [("yt-stuff.html", "YT Stuff"), ("about.html", "About KBJS"),
      ("contact.html", "Contact Us"), ("privacy.html", "Privacy Policy"),
      ("terms.html", "Terms of Service")]),
]

def resources_drawer():
    # Section labels are UI chrome for a hidden nav widget, not document
    # structure — using <p> keeps the page's heading outline clean.
    secs = "\n".join(
        f'<div class="more-sidebar-section"><p class="more-sidebar-section-title">{title}</p>'
        f'<p class="more-sidebar-desc">{desc}</p><div class="more-sidebar-links">'
        + "".join(f'<a href="{h}" class="more-sidebar-link">{t}</a>' for h, t in links)
        + '</div></div>'
        for title, desc, links in RESOURCES)
    return f"""
<div class="more-sidebar-overlay" id="more-sidebar-overlay"></div>
<aside class="more-sidebar" id="more-sidebar" aria-hidden="true" aria-label="More links">
  <div class="more-sidebar-header">
    <p class="more-sidebar-header-title">More</p>
    <button class="more-sidebar-close" id="more-sidebar-close" type="button" aria-label="Close menu">&times;</button>
  </div>
  <div class="more-sidebar-body">{secs}</div>
</aside>
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

# Pages dense with paragraphs, FAQ text or legal copy cap the galaxy
# at the medium tier. Detection may only ever go lower than this.
DENSE_PAGES = {"privacy.html", "terms.html", "contact.html", "about.html",
               "free-assets.html", "resource-packs.html", "minecraft-plugins.html",
               "yt-stuff.html", "mini-games.html", "404.html"}


def page(fname, title, desc, body, schemas, active=None, extra_class=""):
    content = head(title, desc, fname, [ORG, WEBSITE] + schemas)
    ceiling = ' data-galaxy-max="medium"' if fname in DENSE_PAGES else ""
    content += (f'<body class="dark-theme{(" " + extra_class) if extra_class else ""}"'
                f'{ceiling} data-galaxy="pending">')
    content += nav(active or fname)

    content += f'\n<main id="main">\n{body}\n</main>\n'
    content += resources_drawer()
    content += footer()

    # Section headings were emitted bare, so they fell through to the global
    # h2 rule instead of picking up .section-title — the class the stylesheet
    # actually targets, and the hook ghost text hangs off. Footer headings
    # already carry .footer-heading, so a bare <h2> is either a section title
    # or the CTA band; the CTA stays unclassed on purpose because it sits
    # inside a bordered card where an oversized ghost would overflow.
    content = content.replace('<h2>', '<h2 class="section-title">')
    content = content.replace('<div class="cta-section"><h2 class="section-title">',
                              '<div class="cta-section"><h2>')
    content += f"""
<script src="firebase-config.js" defer></script>
<script type="module" src="galaxy/index.js"></script>
<script src="app.js" defer></script>
</body>
</html>
"""
    (BASE / fname).write_text(content, encoding="utf-8")
    return len(content)