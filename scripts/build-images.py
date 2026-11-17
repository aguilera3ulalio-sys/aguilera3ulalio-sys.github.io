#!/usr/bin/env python3
"""
Turns my original photos in Photos/ into the web versions the site loads.

For every photo I make several WebP copies at different widths. The browser
then picks the smallest one that is still sharp on that screen, so a phone
downloads a small file and a big monitor gets the full-size one. Quality stays
high (WebP at 86), and I never enlarge a photo beyond its original size.

Run it from the project root whenever I add or replace a photo:
    python3 scripts/build-images.py

It needs Pillow (pip install pillow) and macOS's built-in `sips`, which I use
to read the HEIC photos from my iPhone.
"""
import json
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images"
MANIFEST = ROOT / "src" / "data" / "images.json"

# The widths I generate. A photo only gets the ones that are not larger than itself.
WIDTHS = [480, 800, 1200, 1600, 2200]
QUALITY = 86

# Original file -> name used on the site. To add a photo, add a line here.
PHOTOS = {
    "Baketball/48b15ed6-2709-47a5-ab91-ab5953aaf673.jpg": "basketball/state-team",
    "Baketball/6ab987fd-68c9-47b4-8008-3ad26a129920.jpg": "basketball/cup-with-coach",
    "Baketball/IMG_1360.jpeg": "basketball/early-trophy",
    "Baketball/IMG_2714.jpeg": "basketball/first-court",
    "Baketball/IMG_6978.jpeg": "basketball/two-trophies",
    "Baketball/bca0b511-b423-4e9c-b39f-8db4822f8383.jpg": "basketball/champions-banner",
    "Carrer/0ce016a9-0ed5-41fe-b20e-dfb816386f1c.JPG": "career/at-work",
    "Carrer/90D3C155-2C5F-4333-85CB-B6A3A57322DC.PNG": "career/storecheck",
    "Carrer/IMG_2685.HEIC": "career/service",
    "Carrer/IMG_2958.heic": "career/inteva",
    "Education/5e718a6a-d56e-4303-8d18-2ad1502531e9_Original.jpg": "education/friends",
    "Education/FE09BADF-B0EC-4886-B2FE-04DF54E7C972.JPG": "education/competition-hall",
    "Education/IMG_1132_Original.HEIC": "education/school-days",
    "Education/my college.JPG": "education/campus",
    "Education/b3b5d6ea-abf1-4d99-81e7-5bfd4e001666.jpg": "education/graduation",
    "Education/bea654c3-c325-43a6-9c3f-27d3b4bd319b.jpg": "education/robotics",
}


def load(path: Path) -> Image.Image:
    """Opens a photo the right way up. HEIC goes through sips first because Pillow cannot read it."""
    if path.suffix.lower() == ".heic":
        with tempfile.TemporaryDirectory() as tmp:
            png = Path(tmp) / "photo.png"
            subprocess.run(
                ["sips", "-s", "format", "png", str(path), "--out", str(png)],
                check=True,
                capture_output=True,
            )
            image = Image.open(png)
            image.load()
    else:
        image = Image.open(path)
    # Phone photos store their rotation as a note; this applies it for real.
    return ImageOps.exif_transpose(image).convert("RGB")


def main() -> None:
    manifest = {}
    for original, name in PHOTOS.items():
        image = load(ROOT / "Photos" / original)
        width, height = image.size
        # Keep every standard width that fits, plus the photo's own width if it is
        # smaller than my largest size, so the full original detail is always available.
        widths = sorted({w for w in WIDTHS if w < width} | {min(width, WIDTHS[-1])})
        target = OUT / f"{name}"
        target.parent.mkdir(parents=True, exist_ok=True)
        for w in widths:
            resized = image if w == width else image.resize((w, round(height * w / width)), Image.LANCZOS)
            resized.save(f"{target}-{w}.webp", "WEBP", quality=QUALITY, method=6)
        manifest[name] = {"width": width, "height": height, "widths": widths}
        print(f"{name}: {widths}")
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")


if __name__ == "__main__":
    main()
