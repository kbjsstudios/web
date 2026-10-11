# KBJS Studios

A static site for **KBJS Studios** — Minecraft server development and custom
Paper/Spigot plugin work, Discord server setup, gaming YouTube thumbnail design
and YouTube Shorts editing.

Live at **https://kbjsstudios.qzz.io/** (GitHub Pages, custom domain in `CNAME`).

---

## Why it is built this way

There is **no build step and no framework**. Everything ships as plain HTML, CSS
and JavaScript that you can open, read and edit directly. That was a deliberate
trade-off:

- No bundler means nothing to install, nothing to break, and a deploy that is
  just "push to main".
- No framework means no runtime cost — the whole JS budget for a page is under
  60 KB before gzip.
- The trade-off is that shared markup is generated rather than hand-edited (see
  *Editing pages* below).

## Structure

```
index.html            Home
minecraft.html        Minecraft server development
minecraft-plugins.html Custom Paper/Spigot plugins
discord.html          Discord server setup + emoji pack
thumbnails.html       Thumbnail design + portfolio
video.html            YouTube Shorts editing
mini-games.html       Hub for the free browser games
aim-trainer.html      …and the 5 games themselves
resource-packs.html   Curated resource packs
free-assets.html      Free design assets
yt-stuff.html         YouTube / creator content
about.html  contact.html  privacy.html  terms.html  404.html

styles.css            Design system: tokens, layout, components, responsive
script.js             All interactive behaviour (guarded modules)
firebase-config.js    Firebase config + optional Discord contact webhook

logos/                Brand marks, WebP variants, OG image
  webp/               WebP variants of the PNG logos
thumbnails/           Portfolio images
  webp/               WebP variants
tools/                Page generators (common shell + per-section builders)
```

## Task tickets

Reusable task tickets for handing work to coding agents live in
[`docs/ai-tickets/`](docs/ai-tickets/README.md) — a master template, a quick
template for small fixes, and a filled-in example.

## The design

Light, airy, Antigravity-style: a soft `#F6F8FC` canvas, oversized
Plus Jakarta Sans headlines, hairline cards with soft layered shadows,
pill buttons, and 120px+ of air between sections. One vibrant accent
gradient (blue → violet → pink) is spent only on highlighted words,
primary buttons and small details. Dark mode follows the OS via
`prefers-color-scheme` — no toggle, no stored preference.

The hero carries a lightweight 2D canvas of drifting gradient cubes
(a Minecraft-block nod) with mouse parallax. It pauses off-screen, on
tab hide, and entirely under `prefers-reduced-motion`. No libraries,
no framework, no render loop anywhere else.

## Materials

The surface language is quiet on purpose: **white cards, hairlines,
generous radius, soft shadows.**

| Depth | Where | Mechanism |
|---|---|---|
| content | cards, panels, stat tiles | white fill + hairline + layered shadow, **no** `backdrop-filter` |
| chrome | navbar (scrolled), drawers, floating controls | translucent fill + real `blur()` |
| thick | modals, toast, cookie banner | near-opaque fill + `blur(10–12px)` |

Backdrop blur is spent only on chrome that floats over page content —
never per-card.

## Motion

One curve (`--ease`, ease-out) used consistently across the whole site.
Headlines enter line by line, sections fade up on scroll
(IntersectionObserver), cards lift on hover; only `transform`,
`opacity` and `border-color` animate — never layout — so nothing
reflows mid-gesture.

`prefers-reduced-motion: reduce` zeroes every duration, forces revealed
content visible, and hides the custom cursor, hero cubes and blobs, so
nothing moves at all.

## Theming

Light by default; dark follows the OS through a single
`prefers-color-scheme` block that repoints the tokens. There is no
toggle and nothing is stored. `theme-color` is `#F6F8FC` with a dark
variant for OS-dark browsers.

## Editing pages

All pages are generated from one shared shell so navigation, footer and schema
stay consistent. The generator lives in `tools/` and is committed:

- `common.py` — head, nav, drawer, footer, schema graph, page assembly
- `build_home.py` — home page
- `build_services.py` — minecraft, discord, thumbnails, video
- `build_company.py` — about, contact
- `build_resources.py` — free assets, resource packs, plugins, yt-stuff
- `build_games.py` — mini-games hub + the 5 game pages
- `build_legal.py` — privacy, terms, 404

Re-run them to regenerate (in this order — later scripts import earlier ones):

```bash
cd tools
for f in build_home.py build_services.py build_company.py build_resources.py build_games.py build_legal.py; do python3 "$f"; done
```

If you want a durable change, make it in the generator and regenerate —
editing the HTML directly works but the next regeneration overwrites it.

The mini-games are the exception: their canvas game logic is preserved
**in place** inside each generated page rather than abstracted away, because it
is genuinely per-game code.

## Search Console / sitemap

- `sitemap.xml` lists the 19 indexable pages. `404.html` is deliberately absent
  and marked `noindex, follow`.
- `robots.txt` allows crawling, points at the sitemap, and disallows the
  internal audit PDF.
- Structured data: `Organization` and `WebSite` with a shared `@id` graph on
  every page, plus `Service`, `FAQPage`, `BreadcrumbList`, `AboutPage`,
  `ContactPage`, `WebPage` where each genuinely applies. No invented reviews,
  ratings or prices.

Submit the sitemap at `https://kbjsstudios.qzz.io/sitemap.xml` after each
content-bearing deploy.

## Performance notes

- Plus Jakarta Sans from Google Fonts (`display=swap`), system-ui fallback.
- Images ship as WebP with the original as `<picture>` fallback. One deliberate
  exception: the Discord emoji SVGs are **not** given WebP sources, because the
  animation lives in the SVG and a static WebP would win the `<source>` and kill
  the motion.
- `script.js` is `defer`red; `firebase-config.js` is deferred
  too (it is only read at runtime).
- The custom cursor only hides the native cursor **after** JavaScript confirms
  it created one, so a JS failure can never leave the site cursorless.
- No render loop, no canvas, no per-frame work anywhere: after load the
  only scripts that run are event-driven UI modules.

## Security notes

GitHub Pages cannot set HTTP response headers. For `Content-Security-Policy`,
`HSTS`, `X-Frame-Options` and `Permissions-Policy`, put the site behind
Cloudflare (free tier is enough) and configure them there.

`.html` URLs are retained deliberately — GitHub Pages does not rewrite paths, so
"cleaner" URLs would 404.

`firebase-config.js` holds a web config key. Firebase web keys are designed to
be public, but you must still lock down Realtime Database rules and restrict the
API key to your domain in the Firebase console. Treat any score submitted to the
leaderboard as untrusted input — the client sanitises it, but server-side rules
are what actually protect the data.

## Contact

- Email: kbjsstudios@gmail.com
- Discord: https://discord.gg/2QPMk6jvpV
- YouTube: [@knockbackkk](https://youtube.com/@knockbackkk) · [@justslayer0](https://youtube.com/@justslayer0)