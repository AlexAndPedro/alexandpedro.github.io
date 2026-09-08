"""
Keep the article system in sync with the Markdown sources under /articles.

Layout
------
Every article is a folder:

    articles/<year>/<slug>/
        index.md      <- front matter + body (the only file you edit)
        index.html    <- an identical copy of html/article_page.html

The <slug> folder name is the URL: /articles/<year>/<slug>/

This script does two things:

1. Writes/refreshes every articles/<year>/<slug>/index.html from the one
   template at html/article_page.html, so there is really only one page
   file to maintain.

2. Rebuilds the index that the site-wide article JavaScript reads:
       /data/json/articles_tag.json
   (js/article_archive.js, js/article_tag_cloud.js, js/tags.js,
   js/featured.js, js/site_stats.js)

The index.md front matter is the ONLY place you edit article data. This
file is a pure projection of it - every field is taken from the Markdown
(or derived from the folder path); nothing in articles_tag.json is
preserved between runs, so do not hand-edit that file. Articles whose
folder has been removed just disappear on the next run.

    Front matter          articles_tag.json
    ------------          -----------------
    (folder name)      -> slug
    (year folder)      -> year, and part of url
    headline           -> headline, and title unless `title:` is set
    title: (optional)  -> title  (a shorter archive/label title)
    author             -> author
    date               -> date
    section            -> section
    blurb: (optional)  -> blurb, else the first body paragraph
    tags: a, b, c      -> tags (comma separated)

Run:
    python py/generate_articles_json.py
or let .github/workflows/generate-articles.yml run it on every push that
touches /articles or the template.
"""

from pathlib import Path
import json
import re
import sys


# ============================================================
# Paths
# ============================================================

SCRIPT_DIR = Path(__file__).resolve().parent
SITE_DIR = SCRIPT_DIR.parent

ARTICLES_DIR = SITE_DIR / "articles"
TEMPLATE_FILE = SITE_DIR / "html" / "article_page.html"
JSON_DIR = SITE_DIR / "data" / "json"
OUTPUT_FILE = JSON_DIR / "articles_tag.json"


# ============================================================
# Front matter parsing (mirrors js/article_reader.js)
# ============================================================

def parse_front_matter(markdown):

    data = {}

    if not markdown.startswith("---"):
        return data, markdown

    end = markdown.find("\n---", 3)

    if end == -1:
        return data, markdown

    front_matter = markdown[3:end].strip()

    for line in front_matter.splitlines():

        separator = line.find(":")

        if separator == -1:
            continue

        key = line[:separator].strip()
        value = line[separator + 1:].strip()

        data[key] = value

    content = markdown[end + 4:].lstrip("-").strip()

    return data, content


# ============================================================
# Blurb extraction (first real paragraph of the body)
# ============================================================

TAG_RE = re.compile(r"<[^>]+>")
EMPHASIS_RE = re.compile(r"[*_`]+")
DATELINE_RE = re.compile(r"^[A-Z][A-Z .,'’-]+\s[—–-]\s*")


def clean_text(text):

    text = TAG_RE.sub("", text)
    text = EMPHASIS_RE.sub("", text)
    text = text.replace("&nbsp;", " ")
    text = re.sub(r"\s+", " ", text).strip()

    return text


def extract_blurb(content):

    paragraph_lines = []

    for raw_line in content.splitlines():

        line = raw_line.strip()

        if not line and paragraph_lines:
            break

        if not line:
            continue

        if line[0] in "#>-*|":
            continue

        if line.startswith("<") and TAG_RE.sub("", line).strip() == "":
            continue

        paragraph_lines.append(line)

    paragraph = clean_text(" ".join(paragraph_lines))
    paragraph = DATELINE_RE.sub("", paragraph)

    return paragraph


# ============================================================
# Load the template
# ============================================================

if not TEMPLATE_FILE.exists():
    print(f"ERROR: template not found: {TEMPLATE_FILE}")
    raise SystemExit(1)

TEMPLATE_HTML = TEMPLATE_FILE.read_text(encoding="utf-8")


def parse_tags(value):
    return [tag.strip() for tag in (value or "").split(",") if tag.strip()]


# ============================================================
# Scan articles/<year>/<slug>/index.md
# ============================================================

if not ARTICLES_DIR.exists():
    print(f"ERROR: articles directory does not exist: {ARTICLES_DIR}")
    raise SystemExit(1)


entries = []
seen_keys = set()
html_written = 0

previous_slugs = set()
if OUTPUT_FILE.exists():
    try:
        previous_slugs = {
            (e.get("slug"), str(e.get("year")))
            for e in json.loads(OUTPUT_FILE.read_text(encoding="utf-8"))
        }
    except json.JSONDecodeError:
        pass


for year_dir in sorted(ARTICLES_DIR.iterdir()):

    if not year_dir.is_dir():
        continue

    year = year_dir.name

    for article_dir in sorted(year_dir.iterdir()):

        if not article_dir.is_dir():
            continue

        md_path = article_dir / "index.md"

        if not md_path.exists():
            print(f"  Skipping {year}/{article_dir.name} (no index.md)")
            continue

        slug = article_dir.name

        # ----------------------------------------------------
        # Refresh the page copy from the template
        # ----------------------------------------------------

        html_path = article_dir / "index.html"

        if (not html_path.exists()
                or html_path.read_text(encoding="utf-8") != TEMPLATE_HTML):
            html_path.write_text(TEMPLATE_HTML, encoding="utf-8")
            html_written += 1
            print(f"  Wrote {year}/{slug}/index.html")

        # ----------------------------------------------------
        # Parse the Markdown
        # ----------------------------------------------------

        front_matter, content = parse_front_matter(
            md_path.read_text(encoding="utf-8", errors="replace")
        )

        headline = front_matter.get("headline", "").strip()

        key = (slug, str(year))

        if key in seen_keys:
            print(f"  WARNING: duplicate article {year}/{slug}; skipping")
            continue

        seen_keys.add(key)

        # Pure projection of the front matter - no merge with the old JSON.
        entry = {
            "slug": slug,
            "year": str(year),
            "url": f"/articles/{year}/{slug}/",
            "title": front_matter.get("title", "").strip() or headline or slug,
            "author": front_matter.get("author", "").strip(),
            "date": front_matter.get("date", "").strip(),
            "blurb": (front_matter.get("blurb", "").strip()
                      or extract_blurb(content)),
            "tags": parse_tags(front_matter.get("tags")),
            "section": front_matter.get("section", "").strip(),
            "headline": headline or slug,
        }

        if key not in previous_slugs:
            print(f"  New article: {year}/{slug}")

        entries.append(entry)


for key in previous_slugs:
    if key not in seen_keys:
        print(f"  Removed (folder gone): {key[1]}/{key[0]}")


# ============================================================
# Sort: newest year first, newest date first, then by title.
# Non-numeric years ("unknown_year") sort last.
# ============================================================

def _date_sort_value(date_string):
    match = re.match(r"(\d{4})-(\d{2})-(\d{2})", date_string or "")
    if not match:
        return 0
    year, month, day = (int(part) for part in match.groups())
    return -(year * 10000 + month * 100 + day)


def sort_key(entry):
    year = entry["year"]
    numeric = year.isdigit()
    return (
        0 if numeric else 1,
        -int(year) if numeric else 0,
        entry["date"] == "",
        _date_sort_value(entry["date"]),
        entry["title"].lower(),
    )


entries.sort(key=sort_key)


# ============================================================
# Write the index
# ============================================================

JSON_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_FILE.write_text(
    json.dumps(entries, indent=4, ensure_ascii=False) + "\n",
    encoding="utf-8",
)

print()
print(f"Generated: {OUTPUT_FILE}")
print(f"Total articles: {len(entries)} | index.html files written: {html_written}")

sys.exit(0)
