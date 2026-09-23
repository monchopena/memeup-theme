#!/usr/bin/env python3

"""
Download the top 50 meme templates from imgflip into ./meme_templates.
Then add them to the meme maker with scripts/add-meme.
Standard library only (no pip installs).
"""
import json
import os
import re
import urllib.request

OUTPUT_DIR = "meme_templates"
HEADERS = {"User-Agent": "memeup-meme-get/1.0"}


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=30) as r:
        return r.read()
API_URL = "https://api.imgflip.com/get_memes"

os.makedirs(OUTPUT_DIR, exist_ok=True)


def safe_filename(name):
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    name = re.sub(r'\s+', '_', name)
    return name.strip('_')


data = json.loads(get(API_URL))

if not data.get("success"):
    raise RuntimeError("Imgflip API returned an error")

memes = data["data"]["memes"][:50]

print(f"Downloading {len(memes)} meme templates...\n")

for i, meme in enumerate(memes, 1):
    name = safe_filename(meme["name"])
    url = meme["url"]

    extension = os.path.splitext(url.split("?")[0])[1] or ".jpg"
    filename = f"{i:02d}_{name}{extension}"
    filepath = os.path.join(OUTPUT_DIR, filename)

    print(f"[{i:02d}/50] {meme['name']}")

    try:
        content = get(url)

        with open(filepath, "wb") as f:
            f.write(content)

        print(f"       -> {filepath}")

    except OSError as e:
        print(f"       ERROR: {e}")

print("\nDone!")
