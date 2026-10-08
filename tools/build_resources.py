#!/usr/bin/env python3
import sys, json, pathlib
sys.path.insert(0, "/tmp/opencode/gen")
from common import *   # noqa
import build_home as H   # reuse page_hero/crumbs_nav/faq_block/cta_block

DATA = json.loads(pathlib.Path("/tmp/opencode/gen/data.json").read_text())

# ═══════════════ FREE ASSETS ═══════════════
FA_FAQ = [
    ("Are these assets really free?",
     "Yes. Everything listed is free to download and use for your own channels and projects."),
    ("Can I use them commercially?",
     "Yes — these are royalty-free, so monetised channels and client work are both fine."),
    ("Do I need to credit KBJS Studios?",
     "Credit is appreciated but not required. A link back helps us keep them free."),
    ("Why are some items marked coming soon?",
     "We publish assets once they are finished and quality-checked rather than shipping placeholders."),
]
fa_cards = "".join(f"""<article class="download-card">
<div class="download-icon"><img width="48" height="48" loading="lazy" decoding="async" src="{a['icon']}" alt="" aria-hidden="true"></div>
<h3>{a['name']}</h3><p class="card-desc">{a['desc']}</p>
<span class="card-version">{a['ver']}</span>
<span class="btn btn-secondary" style="opacity:.55;pointer-events:none" aria-disabled="true">Coming soon</span>
</article>""" for a in [
    {"icon":"logos/icons/palette.svg","name":"Thumbnail Templates","desc":"Ready-to-use Photoshop and Canva templates for gaming thumbnails. Easy to customise.","ver":"In progress"},
    {"icon":"logos/icons/speaker.svg","name":"Sound Effects Pack","desc":"Royalty-free sound effects for your videos &mdash; alerts, transitions and ambient beds.","ver":"In progress"},
    {"icon":"logos/icons/picture.svg","name":"Overlay &amp; Stream Assets","desc":"Stream overlays, alerts and panels for OBS and Streamlabs.","ver":"In progress"},
])
fa = f"""{H.crumbs_nav([("Home","index.html"),("Resources",None),("Free Assets",None)])}
{H.page_hero("Resources", 'Free <span class="gradient-text">Assets</span>',
  "Free, royalty-free design assets so you can spend time making content instead of hunting for files.")}
<section class="section"><div class="container">
  <div class="section-head"><p class="section-subtitle">Downloads</p>
  <h2>What is <span class="gradient-text">available</span></h2>
  <p class="lead">Every download is ours or cleared for redistribution, so there is no attribution
  trap and no copyright strike risk on your channel.</p></div>
  <div class="downloads-grid">{fa_cards}</div>
</div></section>
<section class="section section-tight"><div class="container">
  <div class="section-head center"><p class="section-subtitle">Using them</p>
  <h2>How to <span class="gradient-text">use these</span></h2></div>
  <div class="grid grid-3">
    <div class="workflow-step"><h3>Thumbnail templates</h3>
      <p>Drop in your screenshot, swap the accent colours, export. Need something unique?
      See <a href="thumbnails.html">custom thumbnail design</a>.</p></div>
    <div class="workflow-step"><h3>Sound effects</h3>
      <p>Royalty-free alerts, transitions and ambient beds for <a href="video.html">Shorts editing</a>.</p></div>
    <div class="workflow-step"><h3>Stream overlays</h3>
      <p>OBS and Streamlabs ready panels and alerts in the KBJS gold-on-dark look.</p></div>
  </div>
</div></section>
{H.faq_block("faq", "Free asset FAQs", FA_FAQ)}
"""
print("free-assets.html", page("free-assets.html",
  "Free Design Assets &amp; Templates | KBJS Studios",
  "Free royalty-free design assets from KBJS Studios — thumbnail templates, sound effects and OBS/Streamlabs overlays for creators.",
  fa, [crumbs([("Home","index.html"),("Resources",None),("Free Assets",None)]), faq_schema(FA_FAQ)]))

# ═══════════════ RESOURCE PACKS ═══════════════
RP_FAQ = [
    ("Which Minecraft versions are supported?",
     "Most packs target current Java Edition and several support Bedrock. Check each listing before downloading."),
    ("How do I install a resource pack?",
     "Download the file, open Minecraft, go to Options &rarr; Resource Packs, enable Global Resources, then activate your pack."),
    ("Can I redistribute these packs?",
     "We list our own packs and clearly credited community packs. Follow each listing's licence terms."),
    ("Will a high-resolution pack slow my game down?",
     "Lower-resolution packs are designed to keep performance intact; higher-resolution packs may need more video memory."),
]
rp_cards = ""
for p in DATA["resource_packs"]:
    img = p["img"]
    webp = None
    if img:
        webp = img.replace("_96.webp", "_160.webp").replace("_96.png", "_160.png")
    src = f'<img width="96" height="96" loading="lazy" decoding="async" src="{img}" alt="{p["name"]} Minecraft resource pack icon">' if img else ""
    rp_cards += f"""<article class="download-card" data-cats="community">
{src}
<h3>{p['name']}</h3><p class="card-desc">{p['desc']}</p>
<span class="card-version">{p['ver']}</span>
<a class="btn btn-secondary" href="{p['link']}" rel="noopener" target="_blank" download>Download</a>
</article>"""
rp = f"""{H.crumbs_nav([("Home","index.html"),("Resources",None),("Resource Packs",None)])}
{H.page_hero("Resources", 'Minecraft <span class="gradient-text">Resource Packs</span>',
  "Curated Minecraft resource packs, free to download. A resource pack changes textures and visuals only, so it is safe on vanilla and modded servers.")}
<section class="section"><div class="container">
  <div class="section-head"><p class="section-subtitle">Downloads</p>
  <h2>Browse <span class="gradient-text">packs</span></h2></div>
  <div class="filter-bar" role="tablist" aria-label="Filter packs" data-target=".download-card">
    <button class="category-tab active" type="button" data-filter="all" aria-selected="true">All</button>
    <button class="category-tab" type="button" data-filter="community" aria-selected="false">Community picks</button>
  </div>
  <div class="downloads-grid">{rp_cards}</div>
</div></section>
<section class="section section-tight"><div class="container">
  <div class="section-head center"><p class="section-subtitle">Getting started</p>
  <h2>How to <span class="gradient-text">install a pack</span></h2></div>
  <div class="grid grid-3">
    <div class="workflow-step"><span class="step-num">01</span><h3>Download</h3>
      <p>Grab the .zip from a listing above. Nothing is installed on your PC beyond the file.</p></div>
    <div class="workflow-step"><span class="step-num">02</span><h3>Open Options</h3>
      <p>In Minecraft go to Options &rarr; Resource Packs &rarr; Open Resource Pack Folder.</p></div>
    <div class="workflow-step"><span class="step-num">03</span><h3>Activate</h3>
      <p>Drop the zip in, select it in-game, then set it to Global Resources so it applies on servers too.</p></div>
  </div>
  <p class="seo-intro" style="margin-top:var(--sp-6)">Running a server? Global Resources also applies
  your pack to the world hosted through our <a href="minecraft.html">Minecraft server development</a>.</p>
</div></section>
{H.faq_block("faq", "Resource pack FAQs", RP_FAQ)}
"""
print("resource-packs.html", page("resource-packs.html",
  "Custom Minecraft Resource Packs | KBJS Studios",
  "Free Minecraft resource packs curated by KBJS Studios — PvP, SMP and HD texture packs for Java and Bedrock players and servers.",
  rp, [crumbs([("Home","index.html"),("Resources",None),("Resource Packs",None)]), faq_schema(RP_FAQ)]))

# ═══════════════ MINECRAFT PLUGINS ═══════════════
MP_FAQ = [
    ("Which server software do the plugins support?",
     "Paper and Spigot, which covers nearly all modern Minecraft servers."),
    ("How do I install a plugin?",
     "Drop the .jar into your server's plugins folder, restart, then configure it in the generated config file."),
    ("Can you modify an existing plugin?",
     "Yes. We add features, fix bugs and adjust permissions in plugins you already run."),
    ("Do you write plugins from scratch?",
     "Yes. Bespoke Paper and Spigot plugins built to your gamemode and player base as part of our "
     "<a href=\"minecraft.html\">Minecraft server development</a>."),
]
mp_cards = "".join(f"""<article class="download-card">
<div class="download-icon"><img width="48" height="48" loading="lazy" decoding="async" src="{p['icon']}" alt="" aria-hidden="true"></div>
<h3>{p['name']}</h3><p class="card-desc">{p['desc']}</p>
<span class="card-version">{p['ver']}</span>
<span class="btn btn-secondary" style="opacity:.55;pointer-events:none" aria-disabled="true">Coming soon</span>
</article>""" for p in DATA["plugins"])
mp = f"""{H.crumbs_nav([("Home","index.html"),("Resources",None),("Minecraft Plugins",None)])}
{H.page_hero("Resources", 'Minecraft <span class="gradient-text">Plugins</span>',
  "Free plugins for Paper and Spigot servers, plus bespoke plugin development. Everything installs with a single file drop.")}
<section class="section"><div class="container">
  <div class="section-head"><p class="section-subtitle">Downloads</p>
  <h2>Available <span class="gradient-text">plugins</span></h2>
  <p class="lead">Tested on modern server software. Release dates appear here as each plugin is finished.</p></div>
  <div class="downloads-grid">{mp_cards}</div>
</div></section>
<section class="section section-tight"><div class="container">
  <div class="section-head center"><p class="section-subtitle">Getting started</p>
  <h2>How to <span class="gradient-text">install a plugin</span></h2></div>
  <div class="grid grid-3">
    <div class="workflow-step"><span class="step-num">01</span><h3>Download the .jar</h3>
      <p>No installers and no obfuscated downloads.</p></div>
    <div class="workflow-step"><span class="step-num">02</span><h3>Drop it in</h3>
      <p>Place the file in your server's plugins folder and restart.</p></div>
    <div class="workflow-step"><span class="step-num">03</span><h3>Configure</h3>
      <p>Open the generated config.yml and set permissions, messages and gameplay values.</p></div>
  </div>
  <p class="seo-intro" style="margin-top:var(--sp-6)">Need something these do not cover? We write
  bespoke plugins from scratch as part of <a href="minecraft.html">full server development</a>.</p>
</div></section>
{H.faq_block("faq", "Minecraft plugin FAQs", MP_FAQ)}
"""
print("minecraft-plugins.html", page("minecraft-plugins.html",
  "Custom Minecraft Plugins (Paper &amp; Spigot) | KBJS Studios",
  "Free Minecraft plugins for Paper and Spigot servers from KBJS Studios, plus bespoke custom plugin development for your gamemode.",
  mp, [crumbs([("Home","index.html"),("Resources",None),("Minecraft Plugins",None)]), faq_schema(MP_FAQ)]))

# ═══════════════ YT STUFF ═══════════════
YS_FAQ = [
    ("Where are your videos hosted?",
     "On YouTube &mdash; <a href=\"" + YT_KNOCK + "\">Knockbackkk</a> and <a href=\"" + YT_SLAYER + "\">JustSlayer</a>."),
    ("What do you usually upload?",
     "Gaming edits and Shorts, Minecraft server showcases, thumbnail breakdowns and behind-the-scenes of client projects."),
    ("Can I request a topic?",
     "Yes &mdash; comment on a video or message us via the <a href=\"contact.html\">contact page</a>."),
    ("Can you help with my channel's thumbnails?",
     "Absolutely. <a href=\"thumbnails.html\">Gaming thumbnail design</a> is one of our core services."),
]
ys_videos = "".join(f"""<a class="yt-video-item" href="{YT_KNOCK}" rel="noopener" target="_blank">
<span class="yt-video-thumb"><img width="26" height="26" loading="lazy" decoding="async" src="logos/icons/play.svg" alt="" aria-hidden="true"></span>
<span class="yt-video-info"><span class="yt-video-title">KBJS Studios &mdash; latest uploads</span>
<span class="yt-video-meta">Gaming, Minecraft and editing</span></span></a>""" for _ in range(1))
ys = f"""{H.crumbs_nav([("Home","index.html"),("Resources",None),("YT Stuff",None)])}
{H.page_hero("Resources", 'YT Stuff <span class="gradient-text">&amp; More</span>',
  "Latest videos, Shorts and behind-the-scenes from the KBJS Studios team.")}
<section class="section"><div class="container">
  <div class="section-head center"><p class="section-subtitle">YouTube</p>
  <h2>Latest <span class="gradient-text">videos</span></h2></div>
  <div style="max-width:820px;margin-inline:auto">
    <div class="yt-video-list">{ys_videos}</div>
  </div>
</div></section>
<section class="section section-tight"><div class="container">
  <div class="section-head center"><p class="section-subtitle">Content</p>
  <h2>What we <span class="gradient-text">cover</span></h2></div>
  <div class="grid grid-3">
    <div class="workflow-step"><h3>Server showcases</h3>
      <p>Walkthroughs of <a href="minecraft.html">Minecraft servers we built</a>, from Outdoor SMP seasons to Lifesteal and Skyblock.</p></div>
    <div class="workflow-step"><h3>Editing breakdowns</h3>
      <p>How we cut, caption and sound-design <a href="video.html">YouTube Shorts</a> so you can apply it yourself.</p></div>
    <div class="workflow-step"><h3>Thumbnail teardowns</h3>
      <p>Why certain gaming thumbnails click, and how colour, contrast and text placement drive click-through.</p></div>
  </div>
</div></section>
<section class="section section-tight"><div class="container">
  <div class="section-head center"><p class="section-subtitle">Downloads</p>
  <h2>More from <span class="gradient-text">KBJS</span></h2></div>
  <div class="grid grid-4">
    <a class="service-card" href="resource-packs.html"><h3 class="service-title">Resource Packs</h3><p class="service-desc">Minecraft texture packs, free.</p></a>
    <a class="service-card" href="free-assets.html"><h3 class="service-title">Free Assets</h3><p class="service-desc">Templates and creator tools.</p></a>
    <a class="service-card" href="minecraft-plugins.html"><h3 class="service-title">Minecraft Plugins</h3><p class="service-desc">Paper and Spigot downloads.</p></a>
    <a class="service-card" href="mini-games.html"><h3 class="service-title">Mini Games</h3><p class="service-desc">Free browser aim trainers.</p></a>
  </div>
</div></section>
{H.faq_block("faq", "YouTube FAQs", YS_FAQ)}
"""
print("yt-stuff.html", page("yt-stuff.html",
  "YouTube Videos &amp; Creator Updates | KBJS Studios",
  "Latest YouTube videos, Shorts, Minecraft server showcases and thumbnail breakdowns from the KBJS Studios team.",
  ys, [crumbs([("Home","index.html"),("Resources",None),("YT Stuff",None)]), faq_schema(YS_FAQ)]))