#!/usr/bin/env python3
import sys, pathlib
sys.path.insert(0, "/tmp/opencode/gen")
from common import *   # noqa

# ── shared blocks ──────────────────────────────────────────────────
def crumbs_nav(items):
    lis = []
    for i, (n, h) in enumerate(items):
        lis.append(f'<li><a href="{h}">{n}</a></li>' if h else f'<li aria-current="page">{n}</li>')
        if i < len(items) - 1:
            lis.append('<li aria-hidden="true">&rsaquo;</li>')
    return f'<nav aria-label="Breadcrumb" class="breadcrumbs"><ol>{"".join(lis)}</ol></nav>'

def page_hero(kicker, title_html, desc):
    return f"""
<section class="page-hero">
  <div class="container">
    <div class="page-hero-content">
      <p class="section-subtitle">{kicker}</p>
      <h1 class="page-hero-title">{title_html}</h1>
      <p class="page-hero-desc">{desc}</p>
    </div>
  </div>
</section>
"""

def faq_block(fid, title, pairs):
    items = "".join(
        f'<div class="faq-item"><h3 class="faq-question"><span>{q}</span>'
        f'<span class="faq-arrow" aria-hidden="true">&#9662;</span></h3>'
        f'<div class="faq-answer"><p>{a}</p></div></div>'
        for q, a in pairs)
    return f"""
<section class="section section-tight" id="{fid}">
  <div class="container">
    <div class="section-head center">
      <p class="section-subtitle">FAQ</p>
      <h2>{title}</h2>
    </div>
    <div class="faq-list">{items}</div>
  </div>
</section>
"""

def cta_block(title, copy, primary="Start a project", secondary=None):
    sec = f'<a class="btn btn-secondary" href="{secondary[1]}">{secondary[0]}</a>' if secondary else ""
    return f"""
<section class="section section-tight">
  <div class="container">
    <div class="cta-section">
      <h2>{title}</h2>
      <p>{copy}</p>
      <div class="hero-cta" style="justify-content:center;margin-bottom:0">
        <a class="btn btn-primary" href="contact.html">{primary}</a>
        {sec}
      </div>
    </div>
  </div>
</section>
"""

def card_grid(cards, cols=3):
    out = []
    for c in cards:
        icon = ""
        if c.get("icon"):
            icon = (f'<div class="service-icon">'
                    f'<picture><source srcset="{c["icon_webp"]}" type="image/webp">'
                    f'<img width="30" height="30" src="{c["icon"]}" alt="" aria-hidden="true"></picture></div>')
        out.append(f"""<article class="service-card">
  {icon}
  <h3 class="service-title">{c['title']}</h3>
  <p class="service-desc">{c['desc']}</p>
  {'<span class="service-arrow" aria-hidden="true">&rarr;</span>' if c.get('link') else ''}
</article>""")
    return f'<div class="grid grid-{cols}">{"".join(out)}</div>'

# ══════════════════════════════════════════════════════════════════
# HOME
# ══════════════════════════════════════════════════════════════════
HOME_FAQ = [
    ("What services does KBJS Studios offer?",
     "Gaming YouTube thumbnail design, Minecraft server development with custom plugins, "
     "Discord server setup and community development, and short-form video editing focused on YouTube Shorts."),
    ("How do I start a project?",
     "Use our <a href=\"contact.html\">contact page</a> and tell us your service and goal. "
     "We reply within 24 hours on business days with scope and pricing."),
    ("Do you build complete Minecraft servers?",
     "Yes. Full builds including spawns and arenas, bespoke Paper and Spigot plugins, MOTDs, "
     "bots, hosting setup and handover documentation. See <a href=\"minecraft.html\">Minecraft server development</a>."),
    ("Can you set up or revamp my Discord?",
     "Yes. From brand-new setups to full overhauls with roles, channels, permissions and automation, "
     "keeping your members and history intact. See <a href=\"discord.html\">Discord server setup</a>."),
    ("Is long-form video editing available?",
     "Not yet. <a href=\"video.html\">YouTube Shorts editing</a> is available now with hooks, captions "
     "and sound design. Join the waitlist for long-form."),
]

WORK = [
    ("thumbnails/Valorant1.png", "thumbnails/webp/Valorant1.webp", "Thumbnails",
     "Valorant thumbnail set", "Six-part thumbnail series built for a competitive FPS channel."),
    ("thumbnails/Minecraft2.png", "thumbnails/webp/Minecraft2.webp", "Thumbnails",
     "Minecraft survival thumbnails", "High-contrast survival edits tuned for the mobile feed."),
    ("thumbnails/Misc1.png", "thumbnails/webp/Misc1.webp", "Thumbnails",
     "Mixed-niche design work", "Cross-genre thumbnails that keep one channel identity."),
]

home_body = f"""
<section class="hero">
  <div class="container hero-inner">
    <div class="enter">
      <p class="section-subtitle">Content &middot; Code &middot; Community</p>
      <h1 class="hero-title">Build worlds.<br><span class="gradient-text">Earn attention.</span></h1>
      <p class="hero-lead">KBJS Studios designs gaming thumbnails, develops Minecraft servers and custom
      plugins, builds Discord communities, and edits short-form video for creators who need the
      technical side handled properly.</p>
      <div class="hero-cta">
        <a class="btn btn-primary" href="contact.html">Start a project</a>
        <a class="btn btn-secondary" href="#services">See what we do</a>
      </div>
      <ul class="hero-trust" role="list">
        <li class="trust-item"><span class="trust-value">Paper &amp; Spigot</span><span class="trust-label">Plugin expertise</span></li>
        <li class="trust-item"><span class="trust-value">24h</span><span class="trust-label">Reply on business days</span></li>
        <li class="trust-item"><span class="trust-value">Bespoke</span><span class="trust-label">No templates</span></li>
        <li class="trust-item"><span class="trust-value">5</span><span class="trust-label">Free browser games</span></li>
      </ul>
    </div>
    <div class="console-card" aria-hidden="true">
      <div class="console-head">
        <span class="console-dots"><span class="console-dot red"></span><span class="console-dot yellow"></span><span class="console-dot green"></span></span>
        <span class="console-title">kbjs@studio</span>
      </div>
      <div class="console-body" id="console-body"></div>
    </div>
  </div>
</section>

<section class="section" id="services">
  <div class="container">
    <div class="section-head center">
      <p class="section-subtitle">What we do</p>
      <h2>Four services, <span class="gradient-text">one studio</span></h2>
      <p class="lead">Everything is commissioned directly to the two people who will do the work.</p>
    </div>

    <div class="service-group">
      <p class="service-group-label">Minecraft</p>
      <div class="grid grid-3">
        <a class="service-card" href="minecraft.html">
          <h3 class="service-title">Server development</h3>
          <p class="service-desc">Full server builds — spawns, arenas, worlds, hosting setup and ongoing management.</p>
          <span class="service-arrow" aria-hidden="true">&rarr;</span>
        </a>
        <a class="service-card" href="minecraft-plugins.html">
          <h3 class="service-title">Custom plugins</h3>
          <p class="service-desc">Bespoke Paper and Spigot plugins written from scratch, plus modifications to existing ones.</p>
          <span class="service-arrow" aria-hidden="true">&rarr;</span>
        </a>
        <a class="service-card" href="minecraft.html">
          <h3 class="service-title">Design &amp; MOTDs</h3>
          <p class="service-desc">Spawns, lobbies and animated server MOTDs that make a server look established on day one.</p>
          <span class="service-arrow" aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>

    <div class="service-group">
      <p class="service-group-label">Discord</p>
      <div class="grid grid-3">
        <a class="service-card" href="discord.html">
          <h3 class="service-title">Server creation</h3>
          <p class="service-desc">Fresh setups and full overhauls with categories, channels and clean permissions.</p>
          <span class="service-arrow" aria-hidden="true">&rarr;</span>
        </a>
        <a class="service-card" href="discord.html">
          <h3 class="service-title">Bot setup</h3>
          <p class="service-desc">Music, tickets, welcomers and YouTube notifiers — configured and tested.</p>
          <span class="service-arrow" aria-hidden="true">&rarr;</span>
        </a>
        <a class="service-card" href="discord.html">
          <h3 class="service-title">Community infrastructure</h3>
          <p class="service-desc">Roles, hierarchies and moderation tooling that survives a growing member count.</p>
          <span class="service-arrow" aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>

    <div class="service-group">
      <p class="service-group-label">Visual content</p>
      <div class="grid grid-3">
        <a class="service-card" href="thumbnails.html">
          <h3 class="service-title">Thumbnail design</h3>
          <p class="service-desc">Gaming thumbnails for Minecraft, Valorant, Fortnite and Roblox channels, built for the mobile feed.</p>
          <span class="service-arrow" aria-hidden="true">&rarr;</span>
        </a>
        <a class="service-card" href="video.html">
          <h3 class="service-title">Short-form editing</h3>
          <p class="service-desc">YouTube Shorts with hook-first cuts, dynamic captions and layered sound design.</p>
          <span class="service-arrow" aria-hidden="true">&rarr;</span>
        </a>
        <a class="service-card" href="free-assets.html">
          <h3 class="service-title">Creator assets</h3>
          <p class="service-desc">Free resource packs, templates and tools to speed up your own workflow.</p>
          <span class="service-arrow" aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  </div>
</section>

<section class="section" id="work">
  <div class="container">
    <div class="section-head center">
      <p class="section-subtitle">Selected work</p>
      <h2>Things we have <span class="gradient-text">shipped</span></h2>
      <p class="lead">Real projects, not mockups. More case studies land here as we finish them.</p>
    </div>
    <div class="grid grid-3">
      {"".join(f'''<a class="work-card" href="thumbnails.html">
        <div class="work-thumb"><picture><source srcset="{w}" type="image/webp">
        <img width="1280" height="720" loading="lazy" decoding="async" src="{s}" alt="{alt}"></picture></div>
        <div class="work-body"><span class="work-tag">{tag}</span>
        <h3 class="work-title">{title}</h3><p class="work-meta">{desc}</p></div>
      </a>''' for s, w, tag, title, desc, alt in [
        (WORK[0][0], WORK[0][1], WORK[0][2], WORK[0][3], WORK[0][4],
         "Valorant gaming YouTube thumbnail designed by KBJS Studios"),
        (WORK[1][0], WORK[1][1], WORK[1][2], WORK[1][3], WORK[1][4],
         "Minecraft survival YouTube thumbnail designed by KBJS Studios"),
        (WORK[2][0], WORK[2][1], WORK[2][2], WORK[2][3], WORK[2][4],
         "Custom gaming YouTube thumbnail designed by KBJS Studios"),
      ])}
    </div>
    <div class="grid grid-2" style="margin-top:var(--sp-6)">
      <a class="service-card" href="minecraft.html">
        <h3 class="service-title">{len(SERVERS)} Minecraft servers built</h3>
        <p class="service-desc">Outdoor SMP, Blood Bound Citadel, Kitten Kraft, Lifesteal, Skyblock, Knock SMP and more.</p>
        <span class="service-arrow" aria-hidden="true">&rarr;</span>
      </a>
      <a class="service-card" href="discord.html">
        <h3 class="service-title">Custom Discord emoji packs</h3>
        <p class="service-desc">A bespoke animated emoji set ships with community builds — see the pack below.</p>
        <span class="service-arrow" aria-hidden="true">&rarr;</span>
      </a>
    </div>
  </div>
</section>

<section class="section" id="process">
  <div class="container">
    <div class="section-head center">
      <p class="section-subtitle">How it works</p>
      <h2>A process that <span class="gradient-text">does not waste your time</span></h2>
    </div>
    <div class="grid grid-4">
      <div class="workflow-step"><span class="step-num">01</span><h3>Discuss</h3><p>Tell us the goal and the constraint. We reply within 24 hours on business days.</p></div>
      <div class="workflow-step"><span class="step-num">02</span><h3>Plan</h3><p>Scope, price and timeline agreed in writing before anything starts.</p></div>
      <div class="workflow-step"><span class="step-num">03</span><h3>Design</h3><p>Concepts built around your actual content, not a template with your logo dropped in.</p></div>
      <div class="workflow-step"><span class="step-num">04</span><h3>Build</h3><p>Servers, plugins and communities configured, tested and documented.</p></div>
      <div class="workflow-step"><span class="step-num">05</span><h3>Deliver</h3><p>Handover with files, docs and support. You own everything we make.</p></div>
    </div>
  </div>
</section>

<section class="section" id="why">
  <div class="container">
    <div class="section-head center">
      <p class="section-subtitle">Why KBJS</p>
      <h2>Small studio, <span class="gradient-text">direct access</span></h2>
    </div>
    <div class="grid grid-3">
      <div class="why-card"><p class="why-number">01</p><h3 class="why-title">You talk to the builder</h3><p>No account managers and no handoffs. The person who writes your plugin or designs your thumbnail is the person you reply to.</p></div>
      <div class="why-card"><p class="why-number">02</p><h3 class="why-title">We run our own channels</h3><p>Knockbackkk and JustSlayer are live gaming channels, so thumbnail and editing decisions get tested on real audiences.</p></div>
      <div class="why-card"><p class="why-number">03</p><h3 class="why-title">Minecraft is a speciality</h3><p>Paper and Spigot plugins, gamemode design and MOTDs are the core of what we do — not a side offering.</p></div>
      <div class="why-card"><p class="why-number">04</p><h3 class="why-title">Built to be handed over</h3><p>Plugins tested, permissions documented, configs explained. You are not left guessing what a setting does.</p></div>
      <div class="why-card"><p class="why-number">05</p><h3 class="why-title">Ships on the timeline</h3><p>Scope is agreed up front and delivered on the date you were given.</p></div>
      <div class="why-card"><p class="why-number">06</p><h3 class="why-title">Community-first thinking</h3><p>A server or Discord is judged on whether people stay in it. Design decisions start from that.</p></div>
    </div>
  </div>
</section>

{faq_block("faq", "Questions people actually ask", HOME_FAQ)}
{cta_block("Have an idea? Let&rsquo;s build it.",
           "Tell us the service, the game and the goal. You will get scope and pricing back within 24 hours on business days.",
           "Get started", ("See our work", "#work"))}
"""

print("index.html", page(
    "index.html",
    "KBJS Studios — Minecraft, Discord &amp; Thumbnail Design",
    "KBJS Studios builds Minecraft servers and custom Paper plugins, sets up Discord communities, designs gaming YouTube thumbnails and edits YouTube Shorts.",
    home_body,
    [faq_schema(HOME_FAQ)],
    active="index.html"))