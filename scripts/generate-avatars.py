#!/usr/bin/env python3
"""Generate guru avatar portraits using Google Gemini image generation."""

import os
import sys
from google import genai
from google.genai import types

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    print("Error: GOOGLE_API_KEY environment variable not set")
    sys.exit(1)

client = genai.Client(api_key=GOOGLE_API_KEY)

OUTPUT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "frontend", "public", "avatars"
)
os.makedirs(OUTPUT_DIR, exist_ok=True)

STYLE = (
    "Minimalist golden line-art portrait illustration on a pure white background. "
    "Single-color warm gold (#C4A96A) strokes only, no fills, no shading, no gradients. "
    "Clean thin outlines. Character shown from chest up, centered in frame. "
    "Simple, elegant, icon-style illustration suitable for a small avatar. "
    "No circle border around the portrait."
)

AVATARS = [
    {
        "id": "sage",
        "prompt": f"Portrait of an ancient Chinese wise man (like Lao Tzu) with a long flowing beard, traditional topknot bun hairstyle, wise serene expression, wearing simple robes. {STYLE}"
    },
    {
        "id": "grandmother",
        "prompt": f"Portrait of a warm elderly East Asian grandmother with a neat hair bun, kind smiling face with laugh lines, wearing traditional robes. {STYLE}"
    },
    {
        "id": "samurai",
        "prompt": f"Portrait of a Japanese samurai warrior wearing a classic kabuto helmet with a crescent moon crest (maedate), fierce determined expression, traditional armor (yoroi) visible at shoulders, facing straight forward. {STYLE}"
    },
    {
        "id": "stoic",
        "prompt": f"Portrait of an ancient Greek/Roman Stoic philosopher man with short curly hair and a short beard, wearing a draped toga, calm thoughtful expression. {STYLE}"
    },
    {
        "id": "muse",
        "prompt": f"Portrait of a classical Greek woman with elegant wavy hair parted in the center, wearing a draped toga/chiton, serene graceful expression. {STYLE}"
    },
    {
        "id": "elder",
        "prompt": f"Portrait of a warm elderly woman with long flowing gray hair, kind wrinkled face with a gentle warm smile, wearing simple robes. {STYLE}"
    },
    {
        "id": "priestess",
        "prompt": f"Portrait of a young East Asian woman with a neat elegant bun hairstyle, calm serene expression, wearing a simple traditional robe/hanfu. {STYLE}"
    },
    {
        "id": "monk",
        "prompt": f"Portrait of a young Buddhist monk with a shaved/bald head, peaceful calm expression, wearing simple monk robes. {STYLE}"
    },
    {
        "id": "novice",
        "prompt": f"Portrait of a young man with very short hair, gentle humble expression, wearing simple traditional robes, facing straight forward looking directly at the viewer. {STYLE}"
    },
    {
        "id": "philosopher",
        "prompt": f"Portrait of a Renaissance-era scholar or philosopher with a neat trimmed beard, wearing a scholarly cap and high-collared robe, wise contemplative expression, holding a quill or book, facing straight forward. {STYLE}"
    },
]

def generate_avatar(avatar):
    avatar_id = avatar["id"]
    output_path = os.path.join(OUTPUT_DIR, f"{avatar_id}.png")

    if os.path.exists(output_path):
        print(f"  [skip] {avatar_id}.png already exists")
        return True

    print(f"  [gen] Generating {avatar_id}...")
    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-image-preview",
            contents=[avatar["prompt"]],
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
            ),
        )

        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                image = part.as_image()
                image.save(output_path)
                print(f"  [ok] Saved {avatar_id}.png")
                return True

        print(f"  [err] No image returned for {avatar_id}")
        return False
    except Exception as e:
        print(f"  [err] Failed {avatar_id}: {e}")
        return False


if __name__ == "__main__":
    print(f"Generating {len(AVATARS)} guru avatars...")
    print(f"Output: {OUTPUT_DIR}\n")

    success = 0
    for avatar in AVATARS:
        if generate_avatar(avatar):
            success += 1

    print(f"\nDone: {success}/{len(AVATARS)} avatars generated")
