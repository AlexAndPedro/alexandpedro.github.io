from pathlib import Path
import json
from PIL import Image


# ============================================================
# Settings
# ============================================================

EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp"
}

THUMBNAIL_HEIGHT = 200
THUMBNAIL_QUALITY = 85


# ============================================================
# Paths
# ============================================================

# Location of this Python script:
# my-website/py/generate_gallery_json.py
SCRIPT_DIR = Path(__file__).resolve().parent

# Website root:
# my-website/
SITE_DIR = SCRIPT_DIR.parent

# Artwork directory:
# my-website/images/artwork/
ARTWORK_DIR = SITE_DIR / "images" / "artwork"

# JSON directory:
# my-website/json/
JSON_DIR = SITE_DIR / "json"

# JSON file:
# my-website/json/artwork.json
OUTPUT_FILE = JSON_DIR / "artwork.json"


# ============================================================
# Create thumbnail
# ============================================================

def create_thumbnail(image_path):

    thumbnail_dir = image_path.parent / "thumbnail"
    thumbnail_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    thumbnail_path = thumbnail_dir / image_path.name

    try:

        with Image.open(image_path) as img:

            img.thumbnail(
                (99999, THUMBNAIL_HEIGHT),
                Image.Resampling.LANCZOS
            )

            # JPEG
            if image_path.suffix.lower() in {".jpg", ".jpeg"}:

                # JPEG does not support transparency
                img = img.convert("RGB")

                img.save(
                    thumbnail_path,
                    quality=THUMBNAIL_QUALITY,
                    optimize=True
                )

            # PNG / WebP / GIF
            else:

                img.save(
                    thumbnail_path,
                    optimize=True
                )

        print(f"  Thumbnail created: {thumbnail_path}")

    except Exception as error:

        print(f"Could not create thumbnail: {image_path}")
        print(f"  Error: {error}")


# ============================================================
# Read existing JSON
# ============================================================

if OUTPUT_FILE.exists():

    try:

        artwork = json.loads(
            OUTPUT_FILE.read_text(
                encoding="utf-8"
            )
        )

        print(
            f"Loaded existing artwork.json "
            f"({len(artwork)} entries)"
        )

    except json.JSONDecodeError:

        print("WARNING: artwork.json is invalid.")
        print("Starting with an empty artwork list.")

        artwork = []

else:

    print("artwork.json does not exist.")
    print("Creating a new one.")

    artwork = []


# ============================================================
# Migrate old JSON format
#
# Old:
#     "year": "2013"
#
# New:
#     "collection": "2013"
# ============================================================

for art in artwork:

    if "collection" not in art and "year" in art:

        art["collection"] = art.pop("year")


# ============================================================
# Create lookup table for existing artwork
# ============================================================

existing = {
    (art["collection"], art["filename"]): art
    for art in artwork
    if "collection" in art and "filename" in art
}


# ============================================================
# Scan artwork directories
# ============================================================

found_files = set()


if not ARTWORK_DIR.exists():

    print()
    print(f"ERROR: Artwork directory does not exist:")
    print(f"  {ARTWORK_DIR}")
    raise SystemExit(1)


for collection_dir in sorted(ARTWORK_DIR.iterdir()):

    # Ignore old/special thumbnail folders
    if collection_dir.name.lower() in {
        "thumbnail",
        "year thumbnail"
    }:
        continue

    collection = collection_dir.name

    print()
    print(f"Scanning collection: {collection}")


    # --------------------------------------------------------
    # Scan images inside collection
    # --------------------------------------------------------

    for image in sorted(collection_dir.iterdir()):

        # Ignore directories
        if not image.is_file():
            continue

        # Ignore unsupported file types
        if image.suffix.lower() not in EXTENSIONS:
            continue


        # ----------------------------------------------------
        # Identify artwork
        # ----------------------------------------------------

        key = (
            collection,
            image.name
        )

        found_files.add(key)


        # ----------------------------------------------------
        # Create/update thumbnail
        # ----------------------------------------------------

        thumbnail_path = (
            image.parent
            / "thumbnail"
            / image.name
        )

        if (
            not thumbnail_path.exists()
            or image.stat().st_mtime
            > thumbnail_path.stat().st_mtime
        ):

            create_thumbnail(image)


        # ----------------------------------------------------
        # Existing artwork
        # ----------------------------------------------------

        if key in existing:

            art = existing[key]

            try:

                with Image.open(image) as img:

                    art["width"], art["height"] = img.size

            except Exception as error:

                print(f"Could not read: {image}")
                print(f"  Error: {error}")

            continue


        # ----------------------------------------------------
        # New artwork
        # ----------------------------------------------------

        print(
            f"New artwork: "
            f"{collection}/{image.name}"
        )


        # ----------------------------------------------------
        # Create title from filename
        # ----------------------------------------------------

        title = image.stem


        # ----------------------------------------------------
        # Get image dimensions
        # ----------------------------------------------------

        try:

            with Image.open(image) as img:

                width, height = img.size

        except Exception as error:

            print(f"Could not read: {image}")
            print(f"  Error: {error}")

            continue


        # ----------------------------------------------------
        # Add new artwork
        # ----------------------------------------------------

        new_artwork = {

            "collection": collection,

            "filename": image.name,

            "title": title,

            "description": "",

            "width": width,

            "height": height
        }


        artwork.append(new_artwork)

        existing[key] = new_artwork


# ============================================================
# Remove artwork that no longer exists
# ============================================================

artwork = [

    art

    for art in artwork

    if (
        art.get("collection"),
        art.get("filename")
    ) in found_files

]


# ============================================================
# Sort artwork
# ============================================================

artwork.sort(

    key=lambda art: (

        art["collection"].lower(),

        art["filename"].lower()

    )

)


# ============================================================
# Create JSON directory
# ============================================================

JSON_DIR.mkdir(

    parents=True,

    exist_ok=True

)


# ============================================================
# Write JSON
# ============================================================

OUTPUT_FILE.write_text(

    json.dumps(

        artwork,

        indent=2,

        ensure_ascii=False

    ),

    encoding="utf-8"

)


# ============================================================
# Done
# ============================================================

print()
print(f"Generated: {OUTPUT_FILE}")
print(f"Total artwork: {len(artwork)}")