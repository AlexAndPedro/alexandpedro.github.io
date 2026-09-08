"""
Scan /music for audio files and (re)write data/json/music.json, the list
that js/music.js renders on music.html.

Each entry is:
    {
        "file": "<name>.mp3",
        "title": "<name>",
        "description": "",
        "thumbnail": "/images/music_thumbnail/<name>.png"  (or "" if none)
    }

A track's thumbnail is any image in /images/music_thumbnail with the same
base name as the audio file; if there is none the field is "" and
music.js shows a placeholder. `title` and `description` are hand-editable
and kept across runs; files that were removed are dropped.

Run:
    python py/generate_music_json.py
"""

from pathlib import Path
import json

SCRIPT_DIR = Path(__file__).resolve().parent
SITE_DIR = SCRIPT_DIR.parent

MUSIC_DIR = SITE_DIR / "music"
THUMB_DIR = SITE_DIR / "images" / "music_thumbnail"
OUTPUT_FILE = SITE_DIR / "data" / "json" / "music.json"

AUDIO_EXTENSIONS = {".mp3", ".ogg", ".wav", ".m4a"}
THUMB_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"]


def find_thumbnail(stem):
    if not THUMB_DIR.exists():
        return ""
    for ext in THUMB_EXTENSIONS:
        candidate = THUMB_DIR / (stem + ext)
        if candidate.exists():
            return "/images/music_thumbnail/" + candidate.name
    return ""


# Preserve hand-edited titles / descriptions.
existing = {}
if OUTPUT_FILE.exists():
    try:
        for entry in json.loads(OUTPUT_FILE.read_text(encoding="utf-8")):
            if entry.get("file"):
                existing[entry["file"]] = entry
    except json.JSONDecodeError:
        print("WARNING: music.json is invalid; starting fresh.")


if not MUSIC_DIR.exists():
    print(f"ERROR: music directory does not exist: {MUSIC_DIR}")
    raise SystemExit(1)


tracks = []

for path in sorted(MUSIC_DIR.iterdir(), key=lambda p: p.name.lower()):

    if not path.is_file() or path.suffix.lower() not in AUDIO_EXTENSIONS:
        continue

    prior = existing.get(path.name, {})

    tracks.append({
        "file": path.name,
        "title": prior.get("title") or path.stem,
        "description": prior.get("description", ""),
        "thumbnail": find_thumbnail(path.stem),
    })

    if path.name not in existing:
        print(f"  New track: {path.name}")


for name in existing:
    if not (MUSIC_DIR / name).exists():
        print(f"  Removed (file gone): {name}")


OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE.write_text(
    json.dumps(tracks, indent=4, ensure_ascii=False) + "\n",
    encoding="utf-8",
)

with_thumb = sum(1 for t in tracks if t["thumbnail"])

print()
print(f"Generated: {OUTPUT_FILE}")
print(f"Total tracks: {len(tracks)} ({with_thumb} with a thumbnail)")
