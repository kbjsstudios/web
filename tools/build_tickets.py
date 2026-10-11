#!/usr/bin/env python3
"""Generate new-ticket.html — internal task-ticket composer.

Not linked in the navbar and excluded from the sitemap/robots (internal tool).
Form fields mirror the parameters shown in the Discord ticket embed.
"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from common import *   # noqa
from build_home import crumbs_nav, page_hero

TYPES = ["Feature", "Bug Fix", "UI-UX", "Optimization", "SEO", "Refactoring", "Documentation"]
PRIORITIES = ["Critical", "High", "Medium", "Low"]
STATUSES = ["Open", "In Progress", "Blocked", "Completed"]
AGENTS = ["Claude Code", "OpenCode", "Cursor", "GitHub Copilot", "Other"]

DEFAULT_UIUX = """Follow the existing KBJS Studios design language.
Maintain a clean, modern, professional appearance.
Ensure responsive behavior on mobile, tablet, and desktop where relevant.
Preserve existing navigation, theme behavior, and working features unless explicitly instructed otherwise."""

DEFAULT_TECH = """Follow the existing project architecture and coding conventions.
Reuse existing components and dependencies where practical.
Avoid unrelated code changes.
Protect API keys, credentials, and environment variables."""


def opts(items):
    return "".join(f'<option value="{v}">{v}</option>' for v in items)


def field(fid, label, control, hint=None, span=False):
    note = f'<p class="form-note">{hint}</p>' if hint else ''
    cls = 'field span-2' if span else 'field'
    return f'''<div class="{cls}">
        <label for="{fid}">{label}</label>
        {control}
        {note}
      </div>'''


def text_input(fid, placeholder="", value="", extra=""):
    v = f' value="{value}"' if value else ''
    p = f' placeholder="{placeholder}"' if placeholder else ''
    return f'<input class="form-input" id="{fid}" name="{fid}" type="text"{v}{p}{extra}>'


def select(fid, items):
    return f'<select class="form-input" id="{fid}" name="{fid}">{opts(items)}</select>'


def textarea(fid, placeholder="", value="", rows=3):
    p = f' placeholder="{placeholder}"' if placeholder else ''
    v = value.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;') if value else ''
    inner = f'\n{v}\n      ' if v else ''
    return f'<textarea class="form-input ticket-area" id="{fid}" name="{fid}" rows="{rows}"{p}>{inner}</textarea>'


tk = f"""{crumbs_nav([("Home","index.html"),("New Ticket",None)])}
{page_hero("Internal tool", 'New <span class="gradient-text">task ticket</span>',
  "Fill the fields once. Send a summary ticket to Discord and copy the full Markdown for your coding agent.")}
<section class="section"><div class="container">
  <form class="form-grid ticket-grid" id="ticket-form" novalidate>
    {field("t-id", "Ticket ID", text_input("t-id", "KBJS-001", extra=" required"), "Required")}
    {field("t-title", "Task title", text_input("t-title", "Short, clear task name", extra=" required"), "Required")}
    {field("t-type", "Task type", select("t-type", TYPES))}
    {field("t-priority", "Priority", select("t-priority", PRIORITIES))}
    {field("t-status", "Status", select("t-status", STATUSES))}
    {field("t-agent", "Assigned agent", select("t-agent", AGENTS))}
    {field("t-branch", "Working branch", text_input("t-branch", "main", value="main"))}
    {field("t-what", "What needs to be done?", textarea("t-what", "Describe the task clearly.", rows=3), "Required — shown as the Discord embed summary.", True)}
    {field("t-why", "Why is this needed?", textarea("t-why", "Explain the problem or purpose.", rows=2), span=True)}
    {field("t-outcome", "Expected outcome", textarea("t-outcome", "What the finished result should look like or do.", rows=2), span=True)}
    {field("t-current", "Current behavior", textarea("t-current", "What happens now?", rows=2), span=True)}
    {field("t-problem", "Problem", textarea("t-problem", "What is broken or missing?", rows=2), span=True)}
    {field("t-affected", "Affected pages / components", text_input("t-affected", "e.g. contact.html, styles.css, tools/common.py"))}
    {field("t-refs", "Reference links / screenshots", text_input("t-refs", "e.g. https://... or a screenshot link"))}
    {field("t-reqs", "Functional requirements", textarea("t-reqs", "One requirement per line.", rows=3), "One per line — becomes a checkbox list.", True)}
    {field("t-uiux", "UI/UX requirements", textarea("t-uiux", "", DEFAULT_UIUX, rows=5), "One per line — edit or delete as needed.", True)}
    {field("t-tech", "Technical requirements", textarea("t-tech", "", DEFAULT_TECH, rows=5), "One per line — edit or delete as needed.", True)}
    {field("t-ac", "Acceptance criteria", textarea("t-ac", "One checkable condition per line.", rows=3), "One per line — becomes a checkbox list.", True)}
    {field("t-scope-in", "Scope — included", textarea("t-scope-in", "Exactly what the agent should change.", rows=2), span=True)}
    {field("t-scope-out", "Scope — excluded", textarea("t-scope-out", "What must not be changed.", rows=2), span=True)}
    {field("t-deps", "Dependencies or restrictions", textarea("t-deps", "Required libraries, compatibility needs, or other constraints.", rows=2), span=True)}
    <div class="field span-2 form-actions">
      <button class="btn btn-secondary" type="button" id="ticket-copy">Copy ticket (Markdown)</button>
      <button class="btn btn-primary" type="submit" id="ticket-send">Send to Discord</button>
      <p class="form-note">Discord receives a compact summary ticket. Use Copy ticket for the full text to paste into your coding agent.</p>
    </div>
  </form>
</div></section>
"""

print("new-ticket.html", page("new-ticket.html",
  "New Task Ticket — KBJS Studios",
  "Internal tool: compose a task ticket, post it to Discord and copy the Markdown.",
  tk, [crumbs([("Home","index.html"),("New Ticket", None)])]))
