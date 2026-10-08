#!/usr/bin/env python3
import sys, json, pathlib
sys.path.insert(0, "/tmp/opencode/gen")
from common import *   # noqa
import build_home as H

GAMES = json.loads(pathlib.Path("/tmp/opencode/gen/games.json").read_text())

def gi_modal(title, desc, controls):
    return f"""<div class="gi-btn" id="gi-btn" role="button" tabindex="0" aria-label="How to play">?</div>
<div class="gi-modal" id="gi-modal" role="dialog" aria-modal="true" aria-labelledby="gi-modal-title">
  <div class="gi-modal-content">
    <button class="gi-modal-close" id="gi-modal-close" type="button" aria-label="Close">&times;</button>
    <p id="gi-modal-title" class="gi-modal-title">{title}</p>
    <p class="gi-desc">{desc}</p>
    <p class="gi-section-title">How to play</p>
    <div class="gi-controls">{controls}</div>
  </div>
</div>"""

def hud(stats):
    cells = "".join(f'<div class="{c}"><div class="{k}">{lab}</div><div id="{i}" class="{v}">{d}</div></div>'
                    for c, k, lab, i, v, d in stats)
    return f'<div class="gi-hud">{cells}</div>'

# ── per-game definitions ──────────────────────────────────────────
DEFS = {
 "aim-trainer.html": dict(
   slug="aim-trainer", icon="logos/icons/target.svg", icon_alt="Aim Trainer mini game icon",
   title="Aim <span class=\"gradient-text\">Trainer</span>",
   kicker="Mini Game",
   meta_desc="Test your aim with the free KBJS Aim Trainer — click as many targets as possible in 30 seconds. Free browser game, no download needed.",
   lead="Flick, click and track. Hit as many targets as you can before the clock runs out.",
   how="""<p>The <strong>Aim Trainer</strong> measures the two things that decide a shooter match:
   how fast you acquire a target and how accurately you click it. Targets spawn in random positions and
   every miss is counted, so you cannot inflate a score by spraying.</p>
   <p>Your report shows total hits plus accuracy and a grade — Sharpshooter at 25+ hits, Good aim at 15+,
   Not bad at 8+, otherwise Keep practicing. Aim at the centre of each target and let your flicks,
   not your clicks, do the work.</p>""",
   tips=["Move your eyes to the target before your hand arrives.",
         "Keep the mouse near the next spawn area instead of parked in a corner.",
         "Short daily sessions beat one long session — aim degrades with fatigue.",
         "Train both hands if you play with keyboard and mouse."],
   faq=[("What counts as a good Aim Trainer score?","25+ hits in 30 seconds with high accuracy is strong. Consistency matters more than one high score."),
        ("Why is my accuracy low?","You are probably clicking before the target fully renders. Wait for it to appear, then flick and click in one motion."),
        ("Is Aim Trainer free?","Yes — free, no download and no account needed."),
        ("Does it help in FPS games?","Yes. Click speed and target acquisition transfer directly to Valorant, Fortnite and CS."),
        ("How often should I use it?","Ten minutes a day, most days. Aim is a trainable skill.")],
   related=[("target-rush.html","Target Rush"),("reaction-shot.html","Reaction Shot"),("precision-range.html","Precision Range")],
   modal=gi_modal("Aim Trainer","Click targets as fast as you can for 30 seconds.",
     "<span>Click the target</span> as soon as it appears<br>Misses are counted against accuracy<br><span>30 seconds</span> on the clock<br>Best score is saved on your device"),
   markup=hud([("gi-stat","gi-stat-label","Hits","at-hits","gi-stat-value","0"),
               ("gi-stat","gi-stat-label","Misses","at-misses","gi-stat-value","0"),
               ("gi-stat","gi-stat-label","Time","at-time","gi-stat-value","30")]) + """
<div class="gi-stage" id="at-area">
  <div id="at-target" class="gi-target" hidden></div>
  <div id="at-start-overlay" class="gi-overlay"><button class="btn btn-primary" id="at-start-btn" type="button">Start test</button></div>
</div>
<p class="gi-result" id="at-result" aria-live="polite"></p>
<button class="btn btn-secondary" id="at-reset" type="button" hidden>Reset</button>"""),

 "target-rush.html": dict(
   slug="target-rush", icon="logos/icons/target-rush.svg", icon_alt="Target Rush mini game icon",
   title="Target <span class=\"gradient-text\">Rush</span>",
   kicker="Mini Game",
   meta_desc="Play Target Rush — click targets as fast as they appear in this fast-paced free browser aim trainer from KBJS Studios.",
   lead="Click as many targets as you can. Moving targets and combos add the pressure.",
   how="""<p><strong>Target Rush</strong> adds pressure to classic aim practice. Targets appear faster the
   longer you survive, and chaining hits without a miss builds a combo multiplier that lifts your score.
   It is the closest of our games to real arena pressure, where hesitation costs you.</p>
   <p>Grades run from S (95+) down to D. Because the spawn rate accelerates, the first seconds are easy and
   the last five are the real test. Learn where targets tend to spawn and your score climbs quickly.</p>""",
   tips=["Do not chase every target — clear the nearest one first to protect your combo.",
         "Build the combo early; a broken streak costs more than a single miss.",
         "Keep your crosshair where targets most often appear.",
         "Stop after a few rough runs — fatigue tanks accuracy fast."],
   faq=[("What is a good Target Rush score?","95+ earns an S. Above 60 is a solid result for casual players."),
        ("How does the combo work?","Consecutive hits build a multiplier. A miss resets it, so protecting the streak matters more than raw speed."),
        ("Is it harder than Aim Trainer?","Yes — the spawn rate accelerates, so it trains speed under pressure rather than pure accuracy."),
        ("Is it free?","Yes, free in your browser with no sign-up."),
        ("Does it work on mobile?","Yes, though a mouse gives more accurate results.")],
   related=[("aim-trainer.html","Aim Trainer"),("reaction-shot.html","Reaction Shot"),("tracking-trial.html","Tracking Trial")],
   modal=gi_modal("Target Rush","Survive as long as you can and keep your combo alive.",
     "<span>Click targets</span> as they appear<br>Hits without a miss build a <span>combo</span><br>Speed increases over time<br>Score decides your grade"),
   markup=hud([("gi-stat","gi-stat-label","Score","tr-score","gi-stat-value","0"),
               ("gi-stat","gi-stat-label","Accuracy","tr-acc","gi-stat-value","100%"),
               ("gi-stat","gi-stat-label","Time","tr-time","gi-stat-value","30")]) + """
<div class="gi-stage">
  <canvas id="tr-canvas" width="500" height="400" aria-label="Target Rush game area"></canvas>
</div>
<p class="gi-result" id="tr-result" aria-live="polite"></p>
<button class="btn btn-primary" id="tr-start" type="button">Start</button>"""),

 "reaction-shot.html": dict(
   slug="reaction-shot", icon="logos/icons/reaction-shot.svg", icon_alt="Reaction Shot mini game icon",
   title="Reaction <span class=\"gradient-text\">Shot</span>",
   kicker="Mini Game",
   meta_desc="Test your reaction time with Reaction Shot — click the target the instant it appears. Free browser mini game by KBJS Studios.",
   lead="Nothing moves until the target appears, then your clock starts.",
   how="""<p><strong>Reaction Shot</strong> isolates one variable: how fast you respond to an unexpected
   visual cue. No aiming and no target hunting — just your brain-to-mouse wiring.</p>
   <p>Average human reaction time sits near 250ms. Consistent scores under 200ms are strong, and sub-150ms
   usually means you are anticipating the spawn rather than reacting to it. Play a few rounds to find your
   real number and use it as a baseline.</p>""",
   tips=["Sit comfortably and keep your eyes on the centre of the play area.",
         "Do not anticipate — wait for the visual cue, or your score is inflated.",
         "Close background tabs; a distraction costs 30–50ms.",
         "Play rested — fatigue has the biggest effect on reaction time."],
   faq=[("What is a good reaction time?","Under 250ms is average for most people. Under 200ms is strong and under 150ms is excellent."),
        ("Why are my scores inconsistent?","Usually anticipation or distraction. Keep your eyes centred and close other tabs."),
        ("Does it help in games?","Yes. Reaction time underpins peeking, dodging and close-range fights."),
        ("Is it free?","Yes — free, no download, no account."),
        ("How many rounds should I play?","Three to five is enough to see your true average.")],
   related=[("aim-trainer.html","Aim Trainer"),("target-rush.html","Target Rush"),("tracking-trial.html","Tracking Trial")],
   modal=gi_modal("Reaction Shot","Wait for the target, then click as fast as you can.",
     "Nothing moves until the target appears<br><span>Click immediately</span> when it appears<br>Three rounds averaged for your score<br>Best time is saved on your device"),
   markup=hud([("gi-stat","gi-stat-label","Reaction","rs-reaction","gi-stat-value","—"),
               ("gi-stat","gi-stat-label","Shots","rs-shots","gi-stat-value","0"),
               ("gi-stat","gi-stat-label","Best","rs-best","gi-stat-value","—")]) + """
<div class="gi-stage">
  <canvas id="rs-canvas" width="500" height="400" aria-label="Reaction Shot game area"></canvas>
</div>
<p class="gi-result" id="rs-result" aria-live="polite"></p>
<button class="btn btn-primary" id="rs-start" type="button">Start</button>"""),

 "precision-range.html": dict(
   slug="precision-range", icon="logos/icons/precision-range.svg", icon_alt="Precision Range mini game icon",
   title="Precision <span class=\"gradient-text\">Range</span>",
   kicker="Mini Game",
   meta_desc="Test your precision with Precision Range — hit tiny targets in this free browser aim game from KBJS Studios.",
   lead="Small targets, strict accuracy. The drill that fixes shaky mouse control.",
   how="""<p><strong>Precision Range</strong> tests the skill most players overlook: fine mouse control.
   Targets are small and every stray click counts against accuracy. Unlike a speed test, you are rewarded
   for placing the click exactly where you intend.</p>
   <p>Small-target work matters most in games with headshots, quick-peek fights and sniper mechanics. If your
   aim feels fast but inaccurate, this is the drill for it — slow down until every click lands cleanly, then
   increase pace.</p>""",
   tips=["Slow down first; speed with poor accuracy scores worse than controlled speed.",
         "Breathe out before each click — tension shakes the wrist.",
         "Keep your forearm supported on the desk.",
         "Lower your sensitivity if you cannot land clean clicks at all."],
   faq=[("What is a good Precision Range score?","High hit counts with 85%+ accuracy. Accuracy is the number that matters here."),
        ("Why do I miss small targets constantly?","Usually sensitivity that is too high for your setup. Lower it gradually and retest."),
        ("Does it help with headshots?","Yes. Precision work directly improves small-target accuracy."),
        ("Is it free?","Yes, free in your browser with no account needed."),
        ("How is this different from Aim Trainer?","Aim Trainer rewards speed; Precision Range rewards accuracy on small targets.")],
   related=[("aim-trainer.html","Aim Trainer"),("tracking-trial.html","Tracking Trial"),("target-rush.html","Target Rush")],
   modal=gi_modal("Precision Range","Hit small targets. Accuracy beats speed here.",
     "<span>Click each small target</span><br>Stray clicks reduce your accuracy<br>Smaller targets over time<br>Best round is saved on your device"),
   markup=hud([("gi-stat","gi-stat-label","Score","pr-score","gi-stat-value","0"),
               ("gi-stat","gi-stat-label","Accuracy","pr-avg","gi-stat-value","100%"),
               ("gi-stat","gi-stat-label","Round","pr-result","gi-stat-value","—")]) + """
<div class="gi-stage" id="pr-target-wrap">
  <canvas id="pr-canvas" width="500" height="400" aria-label="Precision Range game area"></canvas>
</div>
<p class="gi-result" id="pr-reset-slot" aria-live="polite"></p>
<button class="btn btn-primary" id="pr-start" type="button">Start</button>
<button class="btn btn-secondary" id="pr-reset" type="button" hidden>Reset</button>
<span id="pr-target" hidden></span>"""),

 "tracking-trial.html": dict(
   slug="tracking-trial", icon="logos/icons/tracking-trial.svg", icon_alt="Tracking Trial mini game icon",
   title="Tracking <span class=\"gradient-text\">Trial</span>",
   kicker="Mini Game",
   meta_desc="Track moving targets with your mouse in Tracking Trial — a free precision tracking test in your browser from KBJS Studios.",
   lead="Keep your cursor on the moving target for 20 seconds.",
   how="""<p><strong>Tracking Trial</strong> measures the ability to keep your crosshair on a moving target
   without losing it — the core skill behind following a strafing opponent. The target is driven by physics,
   so its path stays learnable, and the test is about how long you hold focus before losing it.</p>
   <p>Your tracking percentage updates live and grades run from S (95%+) down to D. This is the test most
   directly tied to third-person and tactical shooters, where whole fights are spent tracking rather than flicking.</p>""",
   tips=["Start the movement and follow with your eyes before your hand.",
         "Use small, smooth corrections instead of large swings.",
         "Keep your elbow anchored to the desk for stability.",
         "Accept a lower percentage first — consistency is the goal."],
   faq=[("What is a good Tracking Trial score?","85%+ earns an A. 95%+ is elite control."),
        ("Why do I lose the target immediately?","You are reacting to movement instead of anticipating it. Look slightly ahead."),
        ("Does tracking help in shooters?","Yes — tracking is the primary aim skill in third-person and tactical shooters."),
        ("Is it free?","Yes, free in your browser with no sign-up."),
        ("How long is the test?","20 seconds, with target speed increasing the longer you hold on.")],
   related=[("aim-trainer.html","Aim Trainer"),("precision-range.html","Precision Range"),("reaction-shot.html","Reaction Shot")],
   modal=gi_modal("Tracking Trial","Hold your cursor on the moving target for 20 seconds.",
     "<span>Move your mouse</span> to follow the target<br>Keep the cursor <span>inside the green circle</span><br>Tracking % updates live<br>Target speed increases over time"),
   markup=hud([("gi-stat","gi-stat-label","Tracking","tt-track","gi-stat-value","0%"),
               ("gi-stat","gi-stat-label","Time","tt-time","gi-stat-value","20"),
               ("gi-stat","gi-stat-label","Best","tt-best","gi-stat-value","—")]) + """
<div class="gi-stage">
  <canvas id="tt-canvas" width="500" height="400" aria-label="Tracking Trial game area"></canvas>
</div>
<p class="gi-result" id="tt-result" aria-live="polite"></p>
<button class="btn btn-primary" id="tt-start" type="button">Start test</button>"""),
}

GAME_CSS = """
/* ===== mini-game chrome ===== */
.gi-wrap { position: relative; max-width: 720px; margin-inline: auto; }
.gi-hud { display: flex; justify-content: center; gap: 14px; margin-bottom: 14px; flex-wrap: wrap; }
.gi-stat { padding: 10px 18px; border: 1px solid var(--hairline); border-radius: var(--r-md); background: var(--mat-reg); box-shadow: var(--specular-soft); text-align: center; min-width: 92px; }
.gi-stat-label { font-size: var(--fs-micro); letter-spacing: .12em; text-transform: uppercase; color: var(--ink-4); }
.gi-stat-value { font-size: 1.3rem; font-weight: 700; color: var(--ink); font-variant-numeric: tabular-nums; }
.gi-stage { position: relative; display: grid; place-items: center; }
.gi-stage canvas { border: 1px solid var(--hairline); border-radius: var(--r-lg); background: #05060d; max-width: 100%; height: auto; }
.gi-target { position: absolute; width: 46px; height: 46px; border-radius: 50%; background: var(--rose); box-shadow: 0 0 18px rgba(255,122,156,.5); }
.gi-overlay { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(5,6,13,.72); border-radius: var(--r-lg); }
.gi-result { min-height: 1.6em; margin-top: var(--sp-4); text-align: center; font-weight: 600; color: var(--ink); }
.gi-btn { position: absolute; top: 8px; right: 8px; z-index: 5; width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--hairline); background: var(--surface-2); color: var(--ink-2); display: grid; place-items: center; font-weight: 700; }
.gi-btn:hover { border-color: var(--gold-line); color: var(--ink); }
.gi-modal { position: fixed; inset: 0; z-index: 26000; display: none; place-items: center; padding: var(--gutter); background: rgba(5,6,13,.72); backdrop-filter: blur(6px); }
.gi-modal.open { display: grid; }
.gi-modal-content { position: relative; width: min(460px,100%); padding: 28px 30px; border: 1px solid var(--hairline-strong); border-radius: var(--r-xl); background: var(--mat-ultra); box-shadow: var(--sh-3), var(--specular); animation: sheetIn var(--t-slow) var(--spring) both; }
.gi-modal-close { position: absolute; top: 10px; right: 14px; border: 0; background: none; color: var(--ink-3); font-size: 1.5rem; line-height: 1; }
.gi-modal-title { margin: 0 0 6px; font-size: 1.1rem; }
.gi-desc { font-size: var(--fs-sm); color: var(--ink-3); margin-bottom: 16px; }
.gi-section-title { font-size: var(--fs-micro); letter-spacing: .12em; text-transform: uppercase; color: var(--ink-4); margin-bottom: 6px; }
.gi-controls { font-size: var(--fs-sm); color: var(--ink-3); line-height: 1.8; padding: 12px 14px; border: 1px solid var(--hairline); border-radius: var(--r-md); background: var(--surface); }
.gi-controls span { color: var(--gold); font-weight: 600; }
"""

def build(fname, d):
    tips = "".join(f"<li>{t}</li>" for t in d['tips'])
    rel = " · ".join(f'<a href="{h}">{n}</a>' for h, n in d['related'])
    scripts = "\n".join(GAMES[fname]['scripts'])
    styles = "".join(f"<style>{s}</style>" for s in GAMES[fname]['styles'] if 'gi-modal' not in s)

    body = f"""{H.crumbs_nav([("Home","index.html"),("Resources",None),("Mini Games",None),(d['title'].split('<')[0].strip(),None)])}
{H.page_hero(d['kicker'], d['title'], d['lead'])}
<section class="section"><div class="container">
  <div class="gi-wrap">
    {d['modal']}
    {d['markup']}
  </div>
</div></section>
<section class="section section-tight"><div class="container">
  <div class="section-head center"><p class="section-subtitle">About this test</p>
  <h2>How {d['title'].split('<')[0].strip()} <span class="gradient-text">works</span></h2></div>
  <div class="seo-intro">{d['how']}</div>
  <div class="grid grid-3" style="margin-top:var(--sp-6)">
    <div class="workflow-step"><h3>What it measures</h3><p>{d['lead']} Graded A&ndash;D so you can compare runs over time.</p></div>
    <div class="workflow-step"><h3>How to improve</h3><ul class="feature-list">{tips}</ul></div>
    <div class="workflow-step"><h3>Keep training</h3><p>Related tests: {rel}. Also try <a href="thumbnails.html">gaming thumbnails</a> and <a href="minecraft.html">Minecraft server development</a>.</p></div>
  </div>
</div></section>
{H.faq_block("faq", d['title'].split('<')[0].strip() + " FAQs", d['faq'])}
"""
    # inject the game's own scripts + its bespoke styles before </body>
    extra = f"\n<style>{GAME_CSS}</style>\n{styles}\n<script>\n{scripts}\n</script>\n"
    content = page(fname,
        f"{d['title'].split('<')[0].strip()} — Free Browser Aim Game | KBJS Studios",
        d['meta_desc'],
        body,
        [crumbs([("Home","index.html"),("Resources",None),("Mini Games","mini-games.html"),(d['title'].split('<')[0].strip(),None)]),
         faq_schema(d['faq'])],
        extra_class=f"game-page")
    p = BASE/fname
    t = p.read_text()
    t = t.replace("</body>", extra + "</body>", 1)
    p.write_text(t, encoding="utf-8")
    return len(t)

for fname, d in DEFS.items():
    print(fname, build(fname, d))

# ── mini-games hub ────────────────────────────────────────────────
GAMES_LIST = [
    ("aim-trainer.html","logos/icons/target.svg","Aim Trainer","Flick, click and track. Hit as many targets as you can before time runs out."),
    ("target-rush.html","logos/icons/target-rush.svg","Target Rush","Click as many targets as you can. Moving targets and combos for extra challenge."),
    ("reaction-shot.html","logos/icons/reaction-shot.svg","Reaction Shot","Test your reflexes. Click targets as fast as they appear and measure your reaction time."),
    ("precision-range.html","logos/icons/precision-range.svg","Precision Range","Hit the bullseye. Score points based on how close to centre you click."),
    ("tracking-trial.html","logos/icons/tracking-trial.svg","Tracking Trial","Keep your cursor on the moving target. Precision tracking test."),
]
cards = "".join(f"""<a class="download-card" href="{h}">
<div class="download-icon"><img width="48" height="48" loading="lazy" decoding="async" src="{ic}" alt="{n} mini game icon"></div>
<h3>{n}</h3><p class="card-desc">{d}</p>
<span class="card-version">Aim &middot; 1 player</span>
<span class="btn btn-secondary">Play now</span></a>""" for h, ic, n, d in GAMES_LIST)

MG_FAQ = [
    ("Are these mini games really free?","Yes — completely free, with no sign-up. They run entirely in your browser."),
    ("Do I need to install anything?","No. Open the page and play; everything runs client-side on canvas."),
    ("How are scores saved?","Your personal best is stored on your device and submitted to a global leaderboard when you save a name."),
    ("Do they work on mobile?","They work on touch devices, though a mouse gives more accurate results in the precision tests."),
]
mg = f"""{H.crumbs_nav([("Home","index.html"),("Resources",None),("Mini Games",None)])}
{H.page_hero("Resources", 'Free <span class="gradient-text">Mini Games</span>',
  "Five free browser games from KBJS Studios — aim trainers, reaction tests and precision challenges. No download, no account.")}
<section class="section"><div class="container">
  <div class="section-head"><p class="section-subtitle">Our games</p>
  <h2>Play <span class="gradient-text">now</span></h2>
  <p class="lead">Pick a test and it opens straight away. Every game scores you, grades you and keeps your best run.</p></div>
  <div class="downloads-grid">{cards}</div>
</div></section>
<section class="section section-tight"><div class="container">
  <div class="section-head center"><p class="section-subtitle">Choosing</p>
  <h2>Which game tests <span class="gradient-text">what?</span></h2>
  <p class="lead">Aim Trainer measures click speed, Target Rush adds combo pressure, Reaction Shot isolates
  reflexes, Precision Range punishes sloppy mouse control, and Tracking Trial measures focus on a moving
  target — the skill that matters most in tactical shooters. Play two or three a week and the difference shows within a month.</p></div>
</div></section>
{H.faq_block("faq", "Mini game FAQs", MG_FAQ)}
"""
print("mini-games.html", page("mini-games.html",
  "Free Browser Mini Games — Aim Trainers | KBJS Studios",
  "Play free browser mini games by KBJS Studios — aim trainer, target rush, reaction shot, precision range and tracking trial. No download needed.",
  mg, [crumbs([("Home","index.html"),("Resources",None),("Mini Games",None)]), faq_schema(MG_FAQ)]))