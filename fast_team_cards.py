import os
from PIL import Image, ImageOps, ImageFilter, ImageDraw

PEOPLE = [
    {"name": "arnav", "file": "arnav.JPG", "out": "assets/team/arnav.webp", "top_ratio": 0.0},
    {"name": "nishant", "file": "nishant.jpeg", "out": "assets/team/nishant.webp", "top_ratio": 0.0},
    {"name": "sachin", "file": "sachin.JPG", "out": "assets/team/sachin.webp", "top_ratio": 0.0},
    {"name": "yash", "file": "yash.jpeg", "out": "assets/team/yash.webp", "top_ratio": 0.0},
]

CARD_W = 600
CARD_H = 750 # 4:5 aspect ratio

def create_studio_card(img_path, out_path, top_ratio=0.0):
    if not os.path.exists(img_path):
        print(f"File missing: {img_path}")
        return

    img = Image.open(img_path)
    img = ImageOps.exif_transpose(img)
    img = img.convert("RGBA")
    
    iw, ih = img.size
    
    # Target 4:5 aspect ratio (0.8)
    target_aspect = CARD_W / float(CARD_H) # 0.8
    
    if iw / float(ih) > target_aspect:
        # Image is wider than 4:5
        crop_h = ih
        crop_w = int(ih * target_aspect)
        left = (iw - crop_w) // 2
        top = 0
    else:
        # Image is taller than 4:5
        crop_w = iw
        crop_h = int(iw / target_aspect)
        left = 0
        # Position top crop window starting from top_ratio to prevent cutting off heads!
        max_top = ih - crop_h
        top = int(max_top * top_ratio)
        
    crop_box = (left, top, left + crop_w, top + crop_h)
    cropped = img.crop(crop_box)
    
    # Resize to exactly CARD_W x CARD_H (matching uniform height across all team cards!)
    resized = cropped.resize((CARD_W, CARD_H), Image.Resampling.LANCZOS)
    
    # Apply warm luxury color grade & dark cinematic vignette overlay
    vignette = Image.new("RGBA", (CARD_W, CARD_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(vignette)
    
    center_x, center_y = CARD_W // 2, int(CARD_H * 0.45)
    max_r = int(max(CARD_W, CARD_H) * 0.72)
    
    for r in range(max_r, 0, -8):
        v_alpha = int((1 - (r / max_r) ** 0.85) * 105)
        draw.ellipse([center_x - r, center_y - r, center_x + r, center_y + r], fill=(5, 5, 8, v_alpha))
        
    vignette = vignette.filter(ImageFilter.GaussianBlur(35))
    
    # Composite vignette over resized subject portrait
    final_card = Image.alpha_composite(resized, vignette)
    
    # Add subtle metallic gold/bronze border stroke (#c79a76)
    border_draw = ImageDraw.Draw(final_card)
    border_draw.rectangle([0, 0, CARD_W-1, CARD_H-1], outline=(199, 154, 118, 140), width=3)
    
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    final_card.convert("RGB").save(out_path, "WEBP", quality=93)
    print(f"Created studio team portrait (full headroom): {out_path} ({CARD_W}x{CARD_H})")

if __name__ == "__main__":
    for item in PEOPLE:
        create_studio_card(item["file"], item["out"], item["top_ratio"])
