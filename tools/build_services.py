#!/usr/bin/env python3
import sys
sys.path.insert(0, "/tmp/opencode/gen")
from common import *   # noqa
from build_home import crumbs_nav, page_hero, faq_block, cta_block, card_grid  # reuse

# ═══════════════ MINECRAFT ═══════════════
MC_FAQ = [
    ("Do you build complete Minecraft servers?",
     "Yes. Complete builds covering spawns and arenas, worlds, bespoke plugins, MOTDs, bots, hosting configuration and handover documentation."),
    ("Do you make custom plugins, and do you support Paper?",
     "Yes. Bespoke Paper and Spigot plugins written from scratch, plus modifications and permission fixes on plugins you already run. "
     "Ready-made plugins are listed on the <a href=\"minecraft-plugins.html\">Minecraft plugins page</a>."),
    ("Do you handle hosting and configuration?",
     "We configure the server and help you set up hosting. Ongoing management and updates are available as ongoing work."),
    ("What does a build include?",
     "It depends on the project, but typically: world and spawn design, plugin configuration, MOTD, bot setup, permissions, performance tuning and documentation."),
    ("How long does a server take?",
     "Scoped in writing before work starts. A focused single-gamemode server and a long-running season server are very different timelines."),
]
mc_features = "".join(f"""<article class="service-card"><h3 class="service-title">{t}</h3>
<p class="service-desc">{d}</p></article>""" for t, d in MINECRAFT_FEATURES)
mc_servers = "".join(f"""<article class="service-card"><h3 class="service-title">{n}</h3>
<p class="service-desc">{d}</p></article>""" for n, d in SERVERS)

mc = f"""{crumbs_nav([("Home","index.html"),("Services","index.html#services"),("Minecraft Servers",None)])}
{page_hero("Service", 'Minecraft <span class="gradient-text">Servers</span>',
  "Full Minecraft server development — custom plugins, spawns and arenas, MOTDs, hosting configuration and ongoing management.")}
<section class="section"><div class="container">
  <div class="section-head"><p class="section-subtitle">What we offer</p>
  <h2>Server <span class="gradient-text">features</span></h2></div>
  <div class="grid grid-3">{mc_features}</div>
</div></section>
<section class="section"><div class="container">
  <div class="section-head"><p class="section-subtitle">Our builds</p>
  <h2>Servers we have <span class="gradient-text">built</span></h2>
  <p class="lead">{len(SERVERS)} servers across survival, PVP, skyblock and lifesteal formats.</p></div>
  <div class="grid grid-3">{mc_servers}</div>
</div></section>
<section class="section"><div class="container">
  <div class="section-head center"><p class="section-subtitle">How it works</p>
  <h2>From idea to <span class="gradient-text">launch</span></h2></div>
  <div class="grid grid-3">
    <div class="workflow-step"><span class="step-num">01</span><h3>Scope</h3>
      <p>Tell us the gamemode — SMP, Lifesteal, Skyblock or custom — plus expected players and whether you have hosting.</p></div>
    <div class="workflow-step"><span class="step-num">02</span><h3>Build</h3>
      <p>Bespoke <a href="minecraft-plugins.html">Paper plugins</a>, spawns and arenas, MOTD, and a linked <a href="discord.html">Discord server</a>.</p></div>
    <div class="workflow-step"><span class="step-num">03</span><h3>Launch</h3>
      <p>Configuration, testing, documentation and handover. Updates and management available after.</p></div>
  </div>
</div></section>
{faq_block("faq", "Minecraft FAQs", MC_FAQ)}
{cta_block("Ready to launch your server?", "Tell us the gamemode and the player count you are targeting. We reply within 24 hours on business days.")}
"""

# ═══════════════ DISCORD ═══════════════
DC_FAQ = [
    ("Do you set up bots and moderation?",
     "Yes. Music, ticket, welcomer, YouTube notifier and moderation bots, with permissions tuned to your server rather than left at defaults."),
    ("Can you revamp my existing server?",
     "Yes. Full overhauls of layout, roles and automation, keeping your members, messages and history intact."),
    ("Do you build custom emoji packs?",
     "Yes. Community builds ship with a bespoke animated emoji set in your colours. You can see the KBJS pack on this page."),
    ("How do I start?",
     "Send us your community size, what it is for, and anything you already have set up via the <a href=\"contact.html\">contact page</a> or Discord."),
]
EMOJI_MAP = {"tv.svg":"kbjs-live.svg","ticket.svg":"kbjs-ticket.svg","music.svg":"kbjs-music.svg",
             "owl.svg":"kbjs-hype.svg","label.svg":"kbjs-w.svg","folder.svg":"kbjs-grind.svg",
             "folder-open.svg":"kbjs-clip.svg","wave.svg":"kbjs-welcome.svg","lock.svg":"kbjs-mod.svg",
             "shield.svg":"kbjs-gg.svg"}
def emoji_src(icon):
    return f"logos/emojis/{EMOJI_MAP.get(icon, icon)}"

dc_cards = "".join(f"""<article class="service-card">
<div class="service-icon"><img width="30" height="30" loading="lazy" decoding="async" src="{emoji_src(icon)}" alt="" aria-hidden="true"></div>
<h3 class="service-title">{t}</h3><p class="service-desc">{d}</p></article>"""
    for t, d, icon in DISCORD_FEATURES)

emoji_cards = "".join(
    f'<button type="button" class="emoji-card" data-emoji=":{code}:" aria-label="Copy :{code}: emoji">'
    f'<img width="56" height="56" loading="lazy" decoding="async" src="logos/emojis/{slug}.svg" '
    f'alt="KBJS Studios custom {label} emoji">'
    f'<span class="emoji-code">:{code}:</span><span class="emoji-label">{label}</span></button>'
    for slug, code, label in EMOJIS)

dc = f"""{crumbs_nav([("Home","index.html"),("Services","index.html#services"),("Discord Servers",None)])}
{page_hero("Service", 'Discord <span class="gradient-text">Servers</span>',
  "Discord server creation, community design, bot setup and infrastructure for creators and gaming communities.")}
<section class="section"><div class="container">
  <div class="section-head"><p class="section-subtitle">What we offer</p>
  <h2>Server <span class="gradient-text">features</span></h2></div>
  <div class="grid grid-3">{dc_cards}</div>
</div></section>
<section class="section" id="emojis"><div class="container">
  <div class="section-head center"><p class="section-subtitle">Custom emojis</p>
  <h2>An emoji pack that <span class="gradient-text">matches your server</span></h2>
  <p class="lead">Every community build ships with a bespoke emoji set. Below is the KBJS pack —
  click any emoji to copy its name, then upload the files under Server Settings &rarr; Emoji.</p></div>
  <div class="emoji-grid">{emoji_cards}</div>
  <p class="seo-intro" style="margin-top:var(--sp-6)"><span id="emoji-copy-hint">
  Want one in your own colours or theme? <a href="contact.html">Ask about custom Discord emojis</a> when you order a build.</span></p>
</div></section>
<section class="section"><div class="container">
  <div class="section-head center"><p class="section-subtitle">Process</p>
  <h2>Our <span class="gradient-text">workflow</span></h2></div>
  <div class="grid grid-3">
    <div class="workflow-step"><span class="step-num">01</span><h3>Plan</h3>
      <p>Tell us what the community is for — gaming, a YouTube audience, or a creator hub — and we map roles, channels and bots.</p></div>
    <div class="workflow-step"><span class="step-num">02</span><h3>Build</h3>
      <p>Categories, permissions, welcomers, tickets, notifiers and music configured and tested. Pair with a
      <a href="minecraft.html">Minecraft server</a> for a complete gaming hub.</p></div>
    <div class="workflow-step"><span class="step-num">03</span><h3>Support</h3>
      <p>Mod onboarding, documentation and handover. Ongoing community management available.</p></div>
  </div>
</div></section>
{faq_block("faq", "Discord FAQs", DC_FAQ)}
{cta_block("Ready to build your community?",
  "Whether you are starting fresh or revamping, we will build a Discord server your members want to stay in.")}
"""

# ═══════════════ THUMBNAILS ═══════════════
TH_FAQ = [
    ("What games do you design thumbnails for?",
     "Minecraft, Valorant, Fortnite, Roblox and more — any gaming niche. Browse the portfolio above or <a href=\"contact.html\">ask for your game</a>."),
    ("What size and format do I get?",
     "YouTube-ready 1280&times;720 exports, checked at thumbnail scale so the design still reads in a mobile feed."),
    ("How do I order?",
     "Send your game, video title and reference thumbnails via the <a href=\"contact.html\">contact page</a>. We reply within 24 hours on business days."),
]
thumbs = [("thumbnails/Valorant1.png","Valorant1"),("thumbnails/Valorant2.png","Valorant2"),
          ("thumbnails/Valorant3.png","Valorant3"),("thumbnails/Valorant4.png","Valorant4"),
          ("thumbnails/Valorant5.png","Valorant5"),("thumbnails/Valorant6.png","Valorant6"),
          ("thumbnails/Minecraft1.png","Minecraft1"),("thumbnails/Minecraft2.png","Minecraft2"),
          ("thumbnails/Minecraft3.png","Minecraft3"),("thumbnails/Minecraft4.png","Minecraft4"),
          ("thumbnails/Minecraft5.jpg","Minecraft5"),("thumbnails/Minecraft6.png","Minecraft6"),
          ("thumbnails/Misc1.png","Misc1")]
def th_cat(p):
    n = p.split('/')[-1]
    if n.startswith('Valorant'): return 'valorant'
    if n.startswith('Minecraft'): return 'minecraft'
    return 'misc'
gallery = "".join(f"""<figure class="gallery-item" data-cats="{th_cat(p)}">
<div class="gallery-thumb"><picture><source srcset="thumbnails/webp/{s.split('.')[0]}.webp" type="image/webp">
<img width="1280" height="720" loading="lazy" decoding="async" src="{p}"
 alt="{'Valorant' if s.startswith('Valorant') else ('Minecraft survival' if s.startswith('Minecraft') else 'Gaming')} YouTube thumbnail designed by KBJS Studios"></picture></div>
<figcaption class="gallery-body"><h3>{s.split('.')[0]} thumbnail</h3>
<p class="card-desc">Designed by KBJS Studios</p></figcaption></figure>""" for p, s in thumbs)

th = f"""{crumbs_nav([("Home","index.html"),("Services","index.html#services"),("Thumbnails",None)])}
{page_hero("Service", 'Gaming <span class="gradient-text">Thumbnails</span>',
  "Custom gaming YouTube thumbnail design for Minecraft, Valorant, Fortnite and Roblox creators.")}
<section class="section"><div class="container">
  <div class="section-head"><p class="section-subtitle">Portfolio</p>
  <h2>Recent <span class="gradient-text">work</span></h2></div>
  <div class="filter-bar" role="tablist" aria-label="Filter portfolio" data-target=".gallery-item">
    <button class="category-tab active" type="button" data-filter="all" aria-selected="true">All</button>
    <button class="category-tab" type="button" data-filter="valorant" aria-selected="false">Valorant / Fortnite</button>
    <button class="category-tab" type="button" data-filter="minecraft" aria-selected="false">Minecraft</button>
    <button class="category-tab" type="button" data-filter="misc" aria-selected="false">Miscellaneous</button>
  </div>
  <div class="gallery-grid">{gallery}</div>
</div></section>
<section class="section"><div class="container">
  <div class="section-head center"><p class="section-subtitle">The process</p>
  <h2>How we design <span class="gradient-text">thumbnails</span></h2>
  <p class="lead">YouTube decides most of a video&rsquo;s reach before anyone presses play. A good
  thumbnail has a fraction of a second to earn the click, so every choice is deliberate: one focal
  point, high contrast that survives being shrunk on a phone, and three words or fewer.</p></div>
  <div class="grid grid-3">
    <div class="workflow-step"><h3>Concept first</h3>
      <p>We start from your video&rsquo;s hook rather than a stock layout. Background, pose and mood match what the video delivers.</p></div>
    <div class="workflow-step"><h3>Built for mobile</h3>
      <p>Most impressions happen on a phone feed, so every design is checked at thumbnail scale before delivery.</p></div>
    <div class="workflow-step"><h3>Revised with you</h3>
      <p>You review the first concept and we revise against your feedback before final files.</p></div>
  </div>
  <p class="seo-intro" style="margin-top:var(--sp-6)">Thumbnails are often commissioned alongside
  <a href="video.html">YouTube Shorts editing</a> so the artwork and the edit agree. A standalone
  thumbnail is a normal order too. New to this? Try our <a href="free-assets.html">free design assets</a> first.</p>
</div></section>
{faq_block("faq", "Thumbnail FAQs", TH_FAQ)}
{cta_block("Want a custom thumbnail?", "Send us the game, the video title and two or three thumbnails you admire. We reply within 24 hours on business days.")}
"""

# ═══════════════ VIDEO ═══════════════
VI_FAQ = [
    ("Is long-form editing available?",
     "Not yet. <a href=\"contact.html\">YouTube Shorts editing</a> is available now with hooks, captions and sound design; long-form is in preparation and you can join the waitlist."),
    ("What do you need from me?",
     "Raw clips and your goal. We handle cuts, captions, sound design and delivery."),
    ("Do you make thumbnails too?",
     "Yes. Every Shorts edit can ship with a matching <a href=\"thumbnails.html\">gaming thumbnail</a>."),
]
vi = f"""{crumbs_nav([("Home","index.html"),("Services","index.html#services"),("Video Editing",None)])}
{page_hero("Service", 'Video <span class="gradient-text">Editing</span>',
  "YouTube Shorts editing available now — hook-first cuts, dynamic captions, trends and sound design.")}
<section class="section"><div class="container">
  <div class="section-head"><p class="section-subtitle">Our work</p>
  <h2>Shorts &amp; <span class="gradient-text">long-form</span></h2></div>
  <div class="split-content">
    <article class="split-block">
      <h3>YouTube Shorts</h3>
      <p>Fast-paced, hook-driven short-form content. Trends, transitions, captions and sound design, cut so the first two seconds land.</p>
      <ul class="feature-list">
        <li>Hook-first cutting</li><li>Dynamic captions</li>
        <li>Trend-aware editing</li><li>Sound design and SFX</li>
        <li>Matching thumbnail available</li>
      </ul>
    </article>
    <article class="split-block coming-soon">
      <h3>Long-form <span class="soon-badge">Coming soon</span></h3>
      <p>Full-length editing with pacing, storytelling and colour grading is not bookable yet. Join the waitlist and you will be first to know.</p>
      <ul class="feature-list">
        <li>Story-driven structure</li><li>Colour grading and LUTs</li>
        <li>Motion graphics</li><li>Audio cleanup and mixing</li>
      </ul>
    </article>
  </div>
</div></section>
<section class="section"><div class="container">
  <div class="section-head center"><p class="section-subtitle">Our focus</p>
  <h2>Why <span class="gradient-text">Shorts first</span></h2>
  <p class="lead">Shorts is where gaming channels are growing fastest, so it is where we focused.
  A Short lives or dies on its first two seconds — if the hook does not land, the viewer has already swiped.</p></div>
  <div class="grid grid-3">
    <div class="workflow-step"><h3>Hook-first</h3>
      <p>We find the strongest moment in your footage and build the Short around it instead of starting at the beginning.</p></div>
    <div class="workflow-step"><h3>Captions and sound</h3>
      <p>Dynamic captions, trend-aware music and layered SFX — usually the difference between scrolled past and rewatched.</p></div>
    <div class="workflow-step"><h3>Thumbnail included</h3>
      <p>A thumbnail matched to the Short&rsquo;s final frame, so the feed entry point and the video agree.</p></div>
  </div>
</div></section>
{faq_block("faq", "Video FAQs", VI_FAQ)}
{cta_block("Send us your footage", "Raw clips and your goal are all we need. We will come back with scope and pricing within 24 hours on business days.")}
"""

print("minecraft.html", page("minecraft.html",
  "Minecraft Server Development &amp; Plugins | KBJS Studios",
  "Custom Minecraft server development and Paper/Spigot plugin writing by KBJS Studios — builds, MOTDs, hosting setup and management.",
  mc, [crumbs([("Home","index.html"),("Services","index.html#services"),("Minecraft Servers",None)]),
       service_schema("Minecraft Server Development", "Full Minecraft server development including custom plugins, builds, MOTDs and hosting setup.", "minecraft.html"),
       faq_schema(MC_FAQ)]))

print("discord.html", page("discord.html",
  "Discord Server Setup &amp; Community Development | KBJS",
  "Discord server creation, community design, bot setup and infrastructure by KBJS Studios — roles, channels, tickets, music and custom emoji packs.",
  dc, [crumbs([("Home","index.html"),("Services","index.html#services"),("Discord Servers",None)]),
       service_schema("Discord Server Setup", "Custom Discord server development including bots, moderation, roles and community management.", "discord.html"),
       faq_schema(DC_FAQ)]))

print("thumbnails.html", page("thumbnails.html",
  "Gaming YouTube Thumbnail Design | KBJS Studios",
  "Custom gaming YouTube thumbnails for Minecraft, Valorant, Fortnite and Roblox creators — 1280x720 designs built to be read in a mobile feed.",
  th, [crumbs([("Home","index.html"),("Services","index.html#services"),("Thumbnails",None)]),
       service_schema("Gaming YouTube Thumbnail Design", "Custom gaming thumbnail design for gaming YouTube channels.", "thumbnails.html"),
       faq_schema(TH_FAQ)]))

print("video.html", page("video.html",
  "YouTube Shorts Video Editing | KBJS Studios",
  "YouTube Shorts editing by KBJS Studios — hook-first cuts, dynamic captions, trends and sound design. Long-form editing coming soon.",
  vi, [crumbs([("Home","index.html"),("Services","index.html#services"),("Video Editing",None)]),
       service_schema("Short-form Video Editing", "YouTube Shorts editing with hook-first cuts, captions and sound design.", "video.html"),
       faq_schema(VI_FAQ)]))