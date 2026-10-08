#!/usr/bin/env python3
import sys
sys.path.insert(0, "/tmp/opencode/gen")
from common import *   # noqa
from build_home import crumbs_nav, page_hero, faq_block, cta_block

# ═══════════════ ABOUT ═══════════════
ab = f"""{crumbs_nav([("Home","index.html"),("About",None)])}
{page_hero("About", 'Two creators, <span class="gradient-text">one studio</span>',
  "We help gamers, YouTubers and online communities grow with thumbnails, servers and video.")}
<section class="section"><div class="container">
  <div class="section-head"><p class="section-subtitle">Who we help</p>
  <h2>Built for <span class="gradient-text">creators and gamers</span></h2>
  <p class="lead">KBJS Studios serves gaming channels, server owners and community managers with
  <a href="thumbnails.html">thumbnail design</a>, <a href="minecraft.html">Minecraft server development</a>
  and <a href="minecraft-plugins.html">custom plugins</a>, <a href="discord.html">Discord setup</a> and
  <a href="video.html">YouTube Shorts editing</a>.</p></div>
  <div class="grid grid-3">
    <div class="workflow-step"><h3>Our expertise</h3>
      <p>Thumbnails that survive the mobile feed, Paper and Spigot plugins, Discord automation, and Shorts built for retention.</p></div>
    <div class="workflow-step"><h3>Our workflow</h3>
      <p>Share your goal via <a href="contact.html">contact</a> — we scope, build, revise and hand over with documentation.</p></div>
    <div class="workflow-step"><h3>Our work</h3>
      <p>From Outdoor SMP seasons to Discord hubs and Shorts. See <a href="minecraft.html">server builds</a> and
      <a href="thumbnails.html">thumbnails</a>.</p></div>
  </div>
</div></section>
<section class="section"><div class="container">
  <div class="section-head center"><p class="section-subtitle">Our story</p>
  <h2>From two channels <span class="gradient-text">to a full studio</span></h2>
  <p class="lead">KBJS Studios started as two gaming channels and one shared frustration: most creators
  can build great content but lack the design skills, server infrastructure or community tooling to compete with
  studios that have all three.</p></div>
  <div class="grid grid-3">
    <div class="why-card"><p class="why-number">01</p><h3 class="why-title">Creators first</h3>
      <p>Every decision is judged by whether it helps a channel grow, not by whether it looks busy.</p></div>
    <div class="why-card"><p class="why-number">02</p><h3 class="why-title">Custom over template</h3>
      <p>We build to your gamemode and audience. Reused templates are the fastest way to look generic.</p></div>
    <div class="why-card"><p class="why-number">03</p><h3 class="why-title">Shipped properly</h3>
      <p>Plugins get tested, permissions get checked and you get documentation — not a handover and silence.</p></div>
  </div>
</div></section>
<section class="section"><div class="container">
  <div class="section-head center"><p class="section-subtitle">Our channels</p>
  <h2>We are <span class="gradient-text">creators too</span></h2>
  <p class="lead">We run our own channels, so the advice comes from channels we actually have to grow.</p></div>
  <div class="channels-grid">
    <a class="channel-card" href="{YT_SLAYER}" rel="noopener" target="_blank">
      <img class="channel-avatar" width="72" height="72" loading="lazy" decoding="async"
           src="https://unavatar.io/youtube/@justslayer0" alt="JustSlayer YouTube channel avatar">
      <div class="channel-icon"><picture><source srcset="logos/webp/justslayer.webp" type="image/webp">
      <img width="34" height="34" loading="lazy" decoding="async" src="logos/justslayer.png" alt="" aria-hidden="true"></picture></div>
      <h3>JustSlayer</h3><span>@justslayer0</span></a>
    <a class="channel-card" href="{YT_KNOCK}" rel="noopener" target="_blank">
      <img class="channel-avatar" width="72" height="72" loading="lazy" decoding="async"
           src="https://unavatar.io/youtube/@knockbackkk" alt="Knockbackkk YouTube channel avatar">
      <div class="channel-icon"><picture><source srcset="logos/webp/knockbackkk.webp" type="image/webp">
      <img width="34" height="34" loading="lazy" decoding="async" src="logos/knockbackkk.png" alt="" aria-hidden="true"></picture></div>
      <h3>Knockbackkk</h3><span>@knockbackkk</span></a>
    <a class="channel-card" href="{DISCORD}" rel="noopener" target="_blank">
      <div class="channel-icon"><picture><source srcset="logos/webp/discordlogo.webp" type="image/webp">
      <img width="40" height="40" loading="lazy" decoding="async" src="logos/discordlogo.png" alt="" aria-hidden="true"></picture></div>
      <h3>Join our Discord</h3><span>Community and support</span></a>
  </div>
</div></section>
{cta_block("Have a project in mind?", "Use the configurator-style brief on our contact page, or just message us on Discord.")}
"""
print("about.html", page("about.html",
  "About KBJS Studios — Creators, Editors &amp; Developers",
  "KBJS Studios is a two-person creative studio building Minecraft servers, Discord communities, gaming thumbnails and video for creators.",
  ab, [{"@context":"https://schema.org","@type":"AboutPage","name":"About KBJS Studios","url":SITE+"/about.html","mainEntity":{"@id":SITE+"/#organization"}},
       crumbs([("Home","index.html"),("About",None)])]))

# ═══════════════ CONTACT ═══════════════
CT_FAQ = [
    ("How fast do you reply?",
     "Within 24 hours on business days. Messages sent at the weekend are answered the next working day."),
    ("What should I include in a brief?",
     "Your service, the game or platform, the goal, and any deadline or budget range. Reference links help a lot."),
    ("Do you take small jobs?",
     "Yes. A single thumbnail or a short-form edit is a perfectly normal request."),
    ("Can I get a quote before committing?",
     "Absolutely. You get scope and pricing before any work starts, agreed in writing."),
]
ct = f"""{crumbs_nav([("Home","index.html"),("Contact",None)])}
{page_hero("Contact", 'Get in <span class="gradient-text">touch</span>',
  "Tell us the service and the goal. We reply within 24 hours on business days.")}
<section class="section"><div class="container">
  <div class="contact-grid">
    <div>
      <h2>Send a brief</h2>
      <form class="form-grid" id="contact-form" novalidate>
        <div class="field">
          <label for="contact-name">Your name</label>
          <input class="form-input" id="contact-name" name="name" type="text" maxlength="80" autocomplete="name" required>
        </div>
        <div class="field">
          <label for="contact-email">Email</label>
          <input class="form-input" id="contact-email" name="email" type="email" maxlength="160" autocomplete="email" required>
        </div>
        <div class="field">
          <label for="contact-message">What do you need?</label>
          <textarea class="form-input" id="contact-message" name="message" maxlength="2000" required></textarea>
          <p class="form-note">Mention the game or platform, your goal and any deadline.</p>
        </div>
        <button class="btn btn-primary" type="submit">Send message</button>
      </form>
    </div>
    <div>
      <h2>Other ways to reach us</h2>
      <ul class="feature-list" style="margin-bottom:var(--sp-6)">
        <li><a href="mailto:{EMAIL}">{EMAIL}</a></li>
        <li>Reply within 24 hours on business days</li>
        <li><a href="{DISCORD}" rel="noopener" target="_blank">Discord</a> for a faster reply</li>
      </ul>
      <h3>Profiles</h3>
      <div class="grid grid-2" style="margin-top:var(--sp-4)">
        <article class="profile-card"><h3>Knockbackkk</h3><p>Content creator and gaming enthusiast.</p>
          <div>
            <a class="profile-btn" href="{YT_KNOCK}" rel="noopener" target="_blank" aria-label="Knockbackkk on YouTube">
              <picture><source srcset="logos/webp/knockbackkk.webp" type="image/webp">
              <img width="22" height="22" loading="lazy" decoding="async" src="logos/knockbackkk.png" alt="" aria-hidden="true"></picture></a>
            <a class="profile-btn" href="{DISCORD}" rel="noopener" target="_blank" aria-label="Knockbackkk on Discord">
              <picture><source srcset="logos/webp/discordlogo.webp" type="image/webp">
              <img width="22" height="22" loading="lazy" decoding="async" src="logos/discordlogo.png" alt="" aria-hidden="true"></picture></a>
            <a class="profile-btn" href="{IG_KNOCK}" rel="noopener" target="_blank" aria-label="Knockbackkk on Instagram">
              <span aria-hidden="true" style="font-size:0.7rem;font-weight:700">IG</span></a>
          </div></article>
        <article class="profile-card"><h3>JustSlayer</h3><p>Creative designer and video editor.</p>
          <div>
            <a class="profile-btn" href="{YT_SLAYER}" rel="noopener" target="_blank" aria-label="JustSlayer on YouTube">
              <picture><source srcset="logos/webp/justslayer.webp" type="image/webp">
              <img width="22" height="22" loading="lazy" decoding="async" src="logos/justslayer.png" alt="" aria-hidden="true"></picture></a>
            <a class="profile-btn" href="{DISCORD}" rel="noopener" target="_blank" aria-label="JustSlayer on Discord">
              <picture><source srcset="logos/webp/discordlogo.webp" type="image/webp">
              <img width="22" height="22" loading="lazy" decoding="async" src="logos/discordlogo.png" alt="" aria-hidden="true"></picture></a>
            <a class="profile-btn" href="{IG_SLAYER}" rel="noopener" target="_blank" aria-label="JustSlayer on Instagram">
              <span aria-hidden="true" style="font-size:0.7rem;font-weight:700">IG</span></a>
          </div></article>
      </div>
    </div>
  </div>
</div></section>
<section class="section section-tight"><div class="container">
  <div class="section-head center"><p class="section-subtitle">What to include</p>
  <h2>How to <span class="gradient-text">brief us</span></h2>
  <p class="lead">More context means a faster, more accurate quote. Include the service, the platform, the goal and any deadline.</p></div>
  <div class="grid grid-4">
    <div class="workflow-step"><h3>Thumbnails</h3><p>Game, video title, references, channel link. See <a href="thumbnails.html">thumbnail design</a>.</p></div>
    <div class="workflow-step"><h3>Minecraft</h3><p>Gamemode, expected players, hosting, plugins you want. See <a href="minecraft.html">server development</a>.</p></div>
    <div class="workflow-step"><h3>Discord</h3><p>Community size, existing link, bots you need. See <a href="discord.html">Discord setup</a>.</p></div>
    <div class="workflow-step"><h3>Video</h3><p>Footage length, target format, thumbnail needed? See <a href="video.html">video editing</a>.</p></div>
  </div>
</div></section>
{faq_block("faq", "Contact FAQs", CT_FAQ)}
"""
print("contact.html", page("contact.html",
  "Contact KBJS Studios — Start Your Project",
  "Contact KBJS Studios for Minecraft servers, Discord setup, gaming thumbnails or YouTube Shorts editing. We reply within 24 hours on business days.",
  ct, [{"@context":"https://schema.org","@type":"ContactPage","name":"Contact KBJS Studios","url":SITE+"/contact.html","mainEntity":{"@id":SITE+"/#organization"}},
       crumbs([("Home","index.html"),("Contact",None)]), faq_schema(CT_FAQ)]))