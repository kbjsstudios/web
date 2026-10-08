#!/usr/bin/env python3
import sys
sys.path.insert(0, "/tmp/opencode/gen")
from common import *   # noqa
import build_home as H

# ═══════════════ PRIVACY ═══════════════
privacy = f"""{H.crumbs_nav([("Home","index.html"),("Privacy Policy",None)])}
{H.page_hero("Legal", 'Privacy <span class="gradient-text">Policy</span>',
  "How we collect, use and protect your data across this website and our services.")}
<section class="section"><div class="container legal-container">
<p>Last updated: 8 October 2026. This policy explains what KBJS Studios collects when you use
our website, our Minecraft servers, our Discord community and our free browser mini games.</p>

<h2>What we collect</h2>
<h3>Information you give us</h3>
<p>If you use the contact form we receive the name, email address and message you submit. This is
used only to reply to your enquiry.</p>
<h3>Information collected automatically</h3>
<p>The site stores a small amount of data in your browser's local storage so features work between
visits. This includes your light or dark theme preference, your cookie consent choice, whether you
liked the site, and your best score and display name for the mini games.</p>
<h3>Aggregate analytics</h3>
<p>Where you have accepted cookies, we use privacy-conscious analytics to count page views. No
advertising or cross-site tracking is used.</p>

<h2>How we use it</h2>
<ul>
<li>To reply to enquiries and deliver commissioned work.</li>
<li>To operate the site — scores, leaderboards and preferences.</li>
<li>To understand which pages are useful so we can improve them.</li>
</ul>

<h2>What we do not do</h2>
<ul>
<li>We do not sell or rent your data to anyone.</li>
<li>We do not use advertising trackers or third-party marketing cookies.</li>
<li>We do not collect payment details — projects are invoiced directly.</li>
</ul>

<h2>Data sharing</h2>
<p>We share your information only where it is necessary to deliver a service you have asked for. For
example, if you commission a Discord server, your project contact details are visible to the
collaborators working on that server. We do not share data with advertisers.</p>

<h2>Data retention</h2>
<p>Enquiry details are kept only as long as needed to respond and to maintain a record of work
completed. Browser-stored data stays on your device until you clear it.</p>

<h2>Your rights</h2>
<p>You can ask us what information we hold about you, request a correction, or ask us to delete it.
You can also clear everything this site has stored by clearing site data in your browser settings.</p>

<h2>Security</h2>
<p>The site is served over HTTPS. We keep data shared with us to a minimum and never request
passwords, full payment card numbers or government identification.</p>

<h2>Cookies</h2>
<p>The site uses a single first-party preference stored in local storage to remember your cookie
choice, and loads analytics only after you accept. Declining still leaves every feature working.</p>

<h2>Children</h2>
<p>This site is not directed at children under 13 and we do not knowingly collect their data.</p>

<h2>Changes</h2>
<p>We will update this page and revise the date above when the policy changes.</p>

<h2>Contact</h2>
<p>Questions about this policy? Email <a href="mailto:{EMAIL}">{EMAIL}</a> or message us on
<a href="{DISCORD}" rel="noopener" target="_blank">Discord</a>.</p>
</div></section>
"""

# ═══════════════ TERMS ═══════════════
terms = f"""{H.crumbs_nav([("Home","index.html"),("Terms of Service",None)])}
{H.page_hero("Legal", 'Terms of <span class="gradient-text">Service</span>',
  "The rules for using this website and commissioning work from KBJS Studios.")}
<section class="section"><div class="container legal-container">
<p>Last updated: 8 October 2026. By using this website or commissioning work from KBJS Studios you
agree to these terms. If you do not agree, please do not use the services.</p>

<h2>About KBJS Studios</h2>
<p>KBJS Studios is an independent creative studio offering Minecraft server development and plugin
writing, Discord server setup, gaming thumbnail design and short-form video editing. Contact details
are on our <a href="contact.html">contact page</a>.</p>

<h2>Use of this website</h2>
<ul>
<li>You may use the free materials on this site for your own projects, subject to any licence noted.</li>
<li>You may not resell our free assets as your own product.</li>
<li>You may not attempt to disrupt the site, overload our servers, or gain unauthorised access to anything.</li>
<li>Mini games are provided for personal, non-commercial play.</li>
</ul>

<h2>Commissioned work</h2>
<h3>Scope and pricing</h3>
<p>Every project is scoped and priced in writing before work begins. Anything outside that written
scope is quoted separately before it is started.</p>
<h3>Payment</h3>
<p>Payment terms are agreed per project. Work may require a deposit for larger builds.</p>
<h3>Revisions</h3>
<p>The number of revision rounds included is set out in your quote. Additional revisions are billed
at the agreed rate.</p>
<h3>Delivery</h3>
<p>We aim to deliver on the date given at the point of agreement. If something outside our control
affects a timeline, we will tell you as early as we can.</p>

<h2>Ownership</h2>
<p>On full payment you own the commissioned work — plugins, designs, server configurations and edits.
We keep the right to show it in a portfolio unless you ask us not to. Third-party assets and
community resources keep their own licences.</p>

<h2>Minecraft servers and plugins</h2>
<p>We build to the specification agreed with you. We cannot guarantee a specific player count,
monetisation outcome or third-party service uptime. You are responsible for your own server hosting
and for complying with the Minecraft EULA and Mojang's terms.</p>

<h2>No guaranteed results</h2>
<p>We design and build to be effective, but we do not promise particular views, subscribers, player
counts or revenue. Thumbnail and editing work can improve your odds; it cannot guarantee an outcome.</p>

<h2>Refunds</h2>
<p>If we cannot deliver an agreed project, we will refund payments reasonably attributable to the
undelivered work. Work already completed and approved is generally non-refundable.</p>

<h2>Limitation of liability</h2>
<p>To the extent permitted by law, KBJS Studios is not liable for indirect or consequential losses,
including lost profits, lost data or lost players. Our total liability is limited to the amount you
paid for the relevant project.</p>

<h2>Third-party links</h2>
<p>This site links to YouTube, Discord, Instagram and Modrinth. We are not responsible for their
content or their terms.</p>

<h2>Changes to these terms</h2>
<p>We may update these terms. Continued use of the site after a change means you accept the revised
version.</p>

<h2>Contact</h2>
<p>Questions about these terms? Email <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
</div></section>
"""

print("privacy.html", page("privacy.html",
  "Privacy Policy — How We Handle Your Data | KBJS Studios",
  "Privacy Policy for KBJS Studios — what we collect, how we use it, what we never do with it, and how to have your data deleted.",
  privacy, [{"@context":"https://schema.org","@type":"WebPage","name":"Privacy Policy","url":SITE+"/privacy.html","inLanguage":"en-US","isPartOf":{"@id":SITE+"/#website"}},
            crumbs([("Home","index.html"),("Privacy Policy",None)])]))

print("terms.html", page("terms.html",
  "Terms of Service — Rules for Using KBJS Studios",
  "Terms of Service for KBJS Studios — how to use this website, how commissioned work is scoped and delivered, and your rights.",
  terms, [{"@context":"https://schema.org","@type":"WebPage","name":"Terms of Service","url":SITE+"/terms.html","inLanguage":"en-US","isPartOf":{"@id":SITE+"/#website"}},
          crumbs([("Home","index.html"),("Terms of Service",None)])]))

# ═══════════════ 404 ═══════════════
err = f"""
<section class="page-hero">
  <div class="container">
    <div class="page-hero-content">
      <p class="section-subtitle">Error 404</p>
      <h1 class="page-hero-title">Lost in <span class="gradient-text">space</span>.</h1>
      <p class="page-hero-desc">That page does not exist or has moved. Here is the way back.</p>
      <div class="hero-cta">
        <a class="btn btn-primary" href="index.html">Back home</a>
        <a class="btn btn-secondary" href="mini-games.html">Play a game</a>
      </div>
    </div>
  </div>
</section>
<section class="section section-tight"><div class="container">
  <div class="section-head center"><p class="section-subtitle">Try one of these</p>
  <h2>Popular <span class="gradient-text">pages</span></h2></div>
  <div class="grid grid-3">
    <a class="service-card" href="thumbnails.html"><h3 class="service-title">Gaming Thumbnails</h3><p class="service-desc">Design for Minecraft, Valorant, Fortnite and Roblox channels.</p></a>
    <a class="service-card" href="minecraft.html"><h3 class="service-title">Minecraft Servers</h3><p class="service-desc">Builds, plugins and hosting configuration.</p></a>
    <a class="service-card" href="discord.html"><h3 class="service-title">Discord Setup</h3><p class="service-desc">Servers, bots, roles and custom emoji packs.</p></a>
    <a class="service-card" href="video.html"><h3 class="service-title">Video Editing</h3><p class="service-desc">YouTube Shorts, available now.</p></a>
    <a class="service-card" href="free-assets.html"><h3 class="service-title">Free Assets</h3><p class="service-desc">Templates, SFX and stream overlays.</p></a>
    <a class="service-card" href="mini-games.html"><h3 class="service-title">Mini Games</h3><p class="service-desc">Five free browser aim trainers.</p></a>
  </div>
</div></section>
"""

# 404: noindex, absolute paths (served for any missing URL)
import re as _re
c = head("Page Not Found (404) — Lost in Space | KBJS Studios",
         "That page could not be found. Head back to KBJS Studios for Minecraft servers, Discord setup, gaming thumbnails and video editing.",
         "404.html", [ORG, WEBSITE])
c = c.replace('href="fonts/', 'href="/fonts/').replace('href="logos/', 'href="/logos/')
c = c.replace('href="style.css"', 'href="/style.css"')
c = c.replace('</head>', '<meta name="robots" content="noindex, follow">\n</head>', 1)
c += '<body class="dark-theme" data-galaxy-max="medium" data-galaxy="pending">'
c += nav("404.html") + resources_drawer()
c += f'\n<main id="main">\n{err}\n</main>\n' + footer()
c += """
<script src="/firebase-config.js" defer></script>
<script type="module" src="/galaxy/index.js"></script>
<script src="/app.js" defer></script>
</body>
</html>
"""
(BASE/"404.html").write_text(c, encoding="utf-8")
print("404.html", len(c))