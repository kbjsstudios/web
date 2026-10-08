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

style.css             Design system: tokens, layout, components, responsive
app.js                All interactive behaviour (21 guarded modules)
galaxy/               WebGL galaxy engine (11 ES modules, no dependencies)
firebase-config.js    Firebase config + optional Discord contact webhook

logos/                Brand marks, WebP variants, OG image
  webp/               WebP variants of the PNG logos
thumbnails/           Portfolio images
  webp/               WebP variants
fonts/                Inter (variable, latin) + Minecraft accent face
```

## The space background

`galaxy/` is a WebGL point-cloud galaxy that sits behind every page. It was
ported from `adityakhawase.github.io/AK` and adapted for this site.

The whole 3D engine is hand-written with **zero dependencies** — no Three.js.
`math.js` carries a small mat4 projection/look-at and a seeded RNG, which is
all a point-cloud renderer needs, so the entire thing is **31 KB gzipped**.

### How it stays cheap

Each particle layer is packed into vertex buffers and drawn as **one
`gl.POINTS` call**:

| Layer | Particles (high) | Blend | Role |
|---|---|---|---|
| deep field | 11,000 | additive | distant stars + 7 far-off galaxies |
| nebula | 420 | additive | large, very faint clouds (opacity 0.08) |
| core glow | 130 | additive | stacked soft sprites forming the nucleus |
| stars | 58,000 | additive | 4 spiral arms + flattened core bulge |
| dust | 7,000 | **multiply** | real occluding lanes |

That is 5 draw calls per frame whether there are 13,000 particles or 76,000.
All motion — differential rotation, twinkle, drift, the click shockwave — is
computed in the vertex shader from a single `uTime` uniform, so nothing is
written back to a buffer per frame.

Dust is drawn with `blendFunc(ZERO, SRC_COLOR)`, i.e. multiply. Additive
blending can only brighten a pixel, so it cannot represent a dust lane *hiding*
stars behind it. The dust shader instead outputs a tint the framebuffer is
multiplied by, which is what makes the lanes read as real occlusion.

### Quality tiers

Chosen from `pointer: coarse`, viewport width, `hardwareConcurrency` and
`deviceMemory`, then confirmed at runtime:

| Tier | Stars | Pixel ratio | Bloom |
|---|---|---|---|
| high | 58,000 | 1.75 | yes |
| medium | 30,000 | 1.5 | yes |
| low | 13,000 | 1.25 | no |

Two more safeguards sit on top:

- **Adaptive ladder** — samples real frame time for 2s and steps down once if
  the device can't hold ~40fps: first drops bloom and render scale, then drops
  the fill-rate-heavy nebula and core-glow sprites.
- **Per-page ceiling** — pages dense with body copy, FAQ text or legal prose
  declare `<body data-galaxy-max="medium">`. Detection may only go *lower*, so a
  fast desktop still never puts 58,000 stars behind a paragraph.

### Readability

This is a text-heavy site, so the sky is never left to fight the copy:

- a fixed `.galaxy-vignette` darkens the frame edges
- hero and page-hero headings carry a text shadow
- `.legal-container` and `.faq-list` get their own soft backing plate
- the camera dollies back and the field dims as the hero scrolls away
  (`fade` is damped, so it eases rather than snaps)

### Degradation

| Condition | Behaviour |
|---|---|
| No WebGL | 2D starfield fallback (`fallback.js`) |
| Context lost | catches `webglcontextlost`, swaps to the fallback |
| Shader compile fails | caught, warns, continues without bloom |
| `prefers-reduced-motion` | one static frame, no loop, no input |
| Tab hidden | render loop stopped |
| Reduced-motion toggled live | re-renders one frame / resumes |

Meteors and foreground motes are optional canvas overlays (`meteors.js`,
`motes.js`); both are skipped under reduced motion.

### Controls

The canvas is `pointer-events: none` — orbiting is bound to `window` and
blocked over links, buttons and fields, so dragging never steals a click. Mouse
move always applies parallax, whether or not a drag is in progress. Touch gets
two-finger pinch-to-zoom. A drag past 6px sets `html.galaxy-dragging`, which
suppresses text selection for the duration.

A small widget (top-right, under the navbar) pauses the scene and cycles render
quality, persisted to `localStorage`. It is hidden under 900px — phones already
run the low tier and gain nothing from a control cluster over the content.

The module self-boots and publishes `window.__galaxy`; `app.js` reads that
handle on `pagehide` to stop the loop and remove the widget.

## Materials

The surface language borrows one idea from macOS: **vibrancy belongs to chrome,
not to every list row.** Backdrop blur is expensive, and this site already runs a
WebGL galaxy behind the content, so blur is spent only where a surface genuinely
floats over something.

| Depth | Where | Mechanism |
|---|---|---|
| content | cards, panels, stat tiles | translucent fill, hairline, specular edge — **no** `backdrop-filter` |
| chrome | navbar, sheets, drawers, popovers, floating controls | `--mat-*` + real `blur() saturate()` |
| thick | sidebars, modals, toast, cookie banner | `--mat-ultra` + `blur(30px)` |

Every surface carries the same three cues so they read as one family:
a translucent fill, a 1px hairline, and a **specular top edge**
(`inset 0 1px 0 rgba(255,255,255,.10)`) — that hairline highlight is the single
strongest "this is glass" signal, cheaper than any amount of blur.

Content cards stay glassy because their fill is alpha, not because of blur — the
galaxy still shows through, at zero paint cost. This is why nine service cards
on the homepage no longer cost nine composited blur layers.

Result: body text sits at **10:1** contrast on cards (up from ~7:1 under the
old blur-only treatment), because the card fill is more opaque.

## Motion

Four curves, used consistently across the whole site:

- `--ease` — settling, for opacity
- `--ease-out` — decelerating, for entrances
- `--ease-in` — accelerating, for exits
- `--spring` / `--spring-soft` — a hair of overshoot, for anything that moves a surface

One rule for interactive surfaces: **lift on hover, compress on press, return
with slight overshoot.** Only `transform`, `opacity`, `shadow` and `filter`
animate — never layout — so nothing reflows mid-gesture. Scroll reveal adds a
6px blur that resolves as the element arrives.

`prefers-reduced-motion: reduce` removes *every* hover lift, press compress and
entrance animation, not just the timed ones, so nothing shifts at all.

## Theming

Dark is the default; light is a deliberately designed second theme, not an
inversion. Tokens live at the top of `style.css`; `body.light-theme` overrides
the surface, ink and shadow ramps.

An inline script in each page's `<head>` applies the stored preference before
first paint, so there is no flash of the wrong theme. `app.js` then owns
toggling and persists to `localStorage` under `kbjs_theme`.

## Editing pages

All pages are generated from one shared shell so navigation, footer and schema
stay consistent. The generator lives in `/tmp/opencode/gen/`:

- `common.py` — head, nav, drawer, footer, schema graph, page assembly
- `build_home.py` — home page
- `build_services.py` — minecraft, discord, thumbnails, video
- `build_company.py` — about, contact
- `build_resources.py` — free assets, resource packs, plugins, yt-stuff
- `build_games.py` — mini-games hub + the 5 game pages
- `build_legal.py` — privacy, terms, 404

Re-run them to regenerate:

```bash
cd /tmp/opencode/gen
for f in build_*.py; do python3 "$f"; done
```

The mini-games are the exception: their canvas game logic is preserved
**in place** inside each generated page rather than abstracted away, because it
is genuinely per-game code.

**The generator is not committed** — it lives outside the web root on purpose.
If you need it long-term, move it into a `tools/` directory. Until then, edit
the HTML directly; nothing overwrites it at deploy time.

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

- Self-hosted Inter variable font, latin subset, 47 KB, `font-display: swap`.
- Images ship as WebP with the original as `<picture>` fallback. One deliberate
  exception: the Discord emoji SVGs are **not** given WebP sources, because the
  animation lives in the SVG and a static WebP would win the `<source>` and kill
  the motion.
- `app.js` and `galaxy.js` are `defer`red; `firebase-config.js` is deferred
  too (it is only read at runtime).
- The custom cursor only hides the native cursor **after** JavaScript confirms
  it created one, so a JS failure can never leave the site cursorless.
- The galaxy loads as `<script type="module">`, which is deferred by default, so
  it never blocks parsing. It boots after the DOM is ready and hands its
  lifecycle to `app.js`.

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