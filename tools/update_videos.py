#!/usr/bin/env python3
"""Fetch the latest YouTube uploads + live status for both KBJS channels.

Sources need no API key:
- uploads: the channel's public RSS feed
  (https://www.youtube.com/feeds/videos.xml?channel_id=...)
- live: the channel's /live page. When a stream is live its canonical
  URL is the watch page (…/watch?v=ID); otherwise it canonicalises to
  a channel URL. hqdefault_live.jpg thumbnails back the verdict up.

Writes tools/videos.json, which build_resources.py bakes into
yt-stuff.html. Re-run any time for fresh uploads:

    python3 tools/update_videos.py && python3 tools/build_resources.py
"""
import json
import pathlib
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import date

HERE = pathlib.Path(__file__).resolve().parent
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"}

CHANNELS = {
    "knockback": {"handle": "@knockbackkk", "channel_id": "UCSZGrX0QLXun7z6gCHRxjsg"},
    "justslayer": {"handle": "@justslayer0", "channel_id": "UCyUBY0aoXccMRbkJVl_Wluw"},
}


def fetch(url, timeout=40):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def uploads(channel_id, limit=6):
    root = ET.fromstring(fetch(f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"))
    ns = {"a": "http://www.w3.org/2005/Atom", "y": "http://www.youtube.com/xml/schemas/2015"}
    out = []
    for e in root.findall("a:entry", ns)[:limit]:
        out.append({
            "id": e.find("y:videoId", ns).text,
            "title": e.find("a:title", ns).text,
            "published": e.find("a:published", ns).text[:10],
        })
    return out


def live_stream(handle):
    """(video_id, title) of the current live stream, or (None, None)."""
    html = fetch(f"https://www.youtube.com/{handle}/live")
    m = re.search(r'<link rel="canonical" href="https://www\.youtube\.com/watch\?v=([A-Za-z0-9_-]{11})', html)
    if not (m and "hqdefault_live" in html):
        return None, None
    t = re.search(r'<meta property="og:title" content="([^"]*)"', html)
    return m.group(1), (t.group(1) if t else "Live now")


def main():
    data = {"checked_at": date.today().isoformat(), "channels": {}}
    for key, ch in CHANNELS.items():
        try:
            videos = uploads(ch["channel_id"])
        except Exception as e:
            print(f"  ! uploads failed for {ch['handle']}: {e}")
            videos = []
        try:
            live, live_title = live_stream(ch["handle"])
        except Exception as e:
            print(f"  ! live check failed for {ch['handle']}: {e}")
            live, live_title = None, None
        # A live stream is not an "upload" — keep it out of the grid so it
        # never appears twice (it gets its own LIVE card).
        videos = [v for v in videos if v["id"] != live]
        data["channels"][key] = {
            "handle": ch["handle"],
            "channel_id": ch["channel_id"],
            "live_video_id": live,
            "live_title": live_title,
            "videos": videos,
        }
        print(f"  {ch['handle']}: {len(videos)} videos" + (f" + LIVE {live}" if live else ""))
    (HERE / "videos.json").write_text(json.dumps(data, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print("wrote tools/videos.json")


if __name__ == "__main__":
    main()
