# Page generators

These scripts are the source of truth for all 20 HTML pages. Editing the
generated HTML directly works, but the next regeneration will overwrite it —
so if you want a durable change, make it here.

## Regenerate everything

```bash
python3 tools/build_home.py        # home
python3 tools/build_services.py    # minecraft, discord, thumbnails, video
python3 tools/build_company.py     # about, contact
python3 tools/build_resources.py   # free assets, resource packs, plugins, yt-stuff
python3 tools/build_games.py       # mini-games hub + the 5 games
python3 tools/build_legal.py       # privacy, terms, 404
python3 tools/ghost_headings.py    # attach data-ghost to selected headings
```

They must run in that order — each imports `common.py` and some import
`build_home.py`, so the first import re-runs it. Running them twice is
harmless (output is idempotent).

## Files

| File | Role |
|---|---|
| `common.py` | head, nav, drawer, footer, schema graph, page assembly |
| `build_*.py` | per-section content |
| `ghost_headings.py` | post-pass that adds `data-ghost` + auto-fit size |
| `data.json` | resource-pack + plugin listings extracted from the old markup |
| `games.json` | canvas game logic + inline styles lifted out of the old pages |

`games.json` matters: each mini game's canvas code lives inside its generated
page rather than in this toolchain, because it is genuinely per-game code.
`games.json` is the backup of that logic.

## Why the mini-game logic is not abstracted

Five games, five genuinely different state machines. Forcing them behind one
interface would mean an abstraction that fits none of them well. The logic
stays where it is, readable and editable in place; `games.json` exists so it can
be recovered if a page is ever lost.
