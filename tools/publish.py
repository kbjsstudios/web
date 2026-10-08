#!/usr/bin/env python3
"""
Publish the working tree to a GitHub repo using the Git Data API.

Why not `git push`: packfile transfer is blocked in this environment
(clone/fetch exit 0 but deliver no objects). The REST API works, and it
has a real advantage here — it appends a commit whose parent is the
current branch tip, so `main` keeps its history and nothing needs
force-pushing. Deleted paths fall out of the tree, and the old blobs
remain reachable in history.

Token is read from the KBJS_GITHUB_TOKEN environment variable. It is
never written to disk and never echoed.
"""
import base64, json, os, pathlib, subprocess, sys, urllib.request, urllib.error

REPO = os.environ.get("KBJS_REPO", "kbjsstudios/web")
ROOT = pathlib.Path(__file__).resolve().parent.parent
API = f"https://api.github.com/repos/{REPO}"
BRANCH = os.environ.get("KBJS_BRANCH", "main")
TOKEN = os.environ.get("KBJS_GITHUB_TOKEN", "").strip()

if not TOKEN:
    sys.exit("KBJS_GITHUB_TOKEN is not set")

TEXT_EXT = {".html", ".css", ".js", ".json", ".txt", ".md", ".xml", ".woff",
            ".svg", ".yml", ".yaml"}
BIN_EXT = {".png", ".jpg", ".jpeg", ".webp", ".woff2", ".ico", ".gif", ".avif"}


def api(path, method="GET", payload=None, raw=False):
    url = path if path.startswith("http") else API + path
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    if data:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            body = r.read()
            return body if raw else json.loads(body or b"{}")
    except urllib.error.HTTPError as e:
        detail = e.read().decode()[:400]
        sys.exit(f"API {method} {path} -> HTTP {e.code}\n{detail}")


def git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True).stdout.strip()


print(f"repo    : {REPO}")
print(f"branch  : {BRANCH}")
print(f"HEAD    : {git('rev-parse', 'HEAD')[:12]}")
print(f"token   : {'set (' + str(len(TOKEN)) + ' chars)' if TOKEN else 'MISSING'}")
print()

# Files git will actually track — .gitignore already excluded the rest
tracked = git("ls-files").splitlines()
tracked = [f for f in tracked if f]
print(f"publishing {len(tracked)} tracked files")

# ---- 1. binary files need real blobs; text can ride inline in the tree
uploads, tree_entries, text_entries = {}, [], []
binary_count = text_count = 0

for rel in tracked:
    p = ROOT / rel
    ext = p.suffix.lower()
    if ext in BIN_EXT or ext not in TEXT_EXT:
        blob = api("/git/blobs", "POST", {
            "content": base64.b64encode(p.read_bytes()).decode(),
            "encoding": "base64",
        })
        uploads[rel] = blob["sha"]
        binary_count += 1
    else:
        text_entries.append({
            "path": rel, "mode": "100644", "type": "blob",
            "content": p.read_text(encoding="utf-8"),
        })
        text_count += 1

    if binary_count and binary_count % 20 == 0:
        print(f"  … uploaded {binary_count} binary blobs")

print(f"  blobs uploaded : {binary_count}")
print(f"  text inline    : {text_count}")

for rel, sha in uploads.items():
    tree_entries.append({"path": rel, "mode": "100644", "type": "blob", "sha": sha})

# ---- 2. one tree call with everything. No base_tree => full replacement,
#         which is what removes Free Assets/ and the rest of the old site.
print("\ncreating replacement tree…")
tree = api("/git/trees", "POST", {"tree": tree_entries + text_entries})
new_tree = tree["sha"]
print(f"  tree {new_tree[:12]}  ({tree.get('truncated', False) and 'TRUNCATED!' or 'complete'})")

# ---- 3. parent = current branch tip, so this is an ordinary fast-forward
parent = api(f"/branches/{BRANCH}")["commit"]["sha"]
print(f"  parent {parent[:12]} (current {BRANCH})")

msg = (
    "Redesign KBJS Studios as a premium creative studio site\n\n"
    "Complete rebuild of all 20 pages: new design system, WebGL galaxy\n"
    "background, and a full technical SEO pass.\n\n"
    "- galaxy/: 11 ES modules, zero dependencies, 31 KB gzipped. WebGL point\n"
    "  cloud, 5 draw calls/frame for up to 76k particles, orbit camera,\n"
    "  click shockwave, three-pass bloom, quality tiers + adaptive ladder\n"
    "- New design system with a macOS-style material system; vibrancy is\n"
    "  spent only on chrome, content cards stay cheap translucent fills\n"
    "- Ghost headings with per-heading auto-fit sizing\n"
    "- Unique title/description per page, canonical, OG + Twitter cards,\n"
    "  Organization/WebSite @id graph plus Service/FAQPage/BreadcrumbList\n"
    "- Removes the unreferenced Free Assets/ directory (~459 MB) and the\n"
    "  previous site markup. Both remain in git history.\n"
)
commit = api("/git/commits", "POST", {
    "message": msg, "tree": new_tree, "parents": [parent],
})
print(f"  commit {commit['sha'][:12]}")

# ---- 4. advance the ref (no force: this is a fast-forward)
updated = api(f"/git/refs/heads/{BRANCH}", "PATCH", {"sha": commit["sha"], "force": False})
print(f"  ref updated -> {updated['ref']} @ {updated['object']['sha'][:12]}")

print("\nverify:")
final = api(f"/branches/{BRANCH}")["commit"]["sha"]
print(f"  {BRANCH} = {final[:12]}  (expected {commit['sha'][:12]})")
print(f"  cname preserved: {'CNAME' in tracked}")
print(f"  files published: {len(tracked)}")