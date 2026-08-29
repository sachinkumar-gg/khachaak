import os
import sys
from PIL import Image, ImageOps, ImageFilter, ImageDraw

try:
    from rembg import remove
    REMBG_AVAILABLE = True
except Exception as e:
    REMBG_AVAILABLE = False

PEOPLE = [
    {"name": "arnav", "file": "arnav.JPG", "out": "assets/team/arnav.webp"},
    {"name": "nishant", "file": "nishant.jpeg", "out": "assets/team/nishant.webp"},
    {"name": "sachin", "file": "sachin.JPG", "out": "assets/team/sachin.webp"},
    {"name": "yash", "file": "yash.jpeg", "out": "assets/team/yash.webp"},
]

CARD_W = 600
CARD_H = 750
TARGET_SUBJECT_H = 630

def create_cool_background(width, height):
    # Dark luxury metallic studio gradient with subtle bronze highlight
    bg = Image.new("RGBA", (width, height), (12, 12, 15, 255))
    
    # Radial ambient spotlight behind subject
    center_x, center_y = width // 2, int(height * 0.45)
    max_r = int(max(width, height) * 0.70)
    
    spotlight = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(spotlight)
    
    for r in range(max_r, 0, -6):
        alpha = int((1 - (r / max_r) ** 1.6) * 55)
        # Gold/bronze tint (#c79a76)
        color = (199, 154, 118, alpha)
        s_draw.ellipse([center_x - r, center_y - r, center_x + r, center_y + r], fill=color)
        
    spotlight = spotlight.filter(ImageFilter.GaussianBlur(30))
    bg = Image.alpha_composite(bg, spotlight)
    
    # Fine border highlight
    b_draw = ImageDraw.Draw(bg)
    b_draw.rectangle([0, 0, width-1, height-1], outline=(199, 154, 118, 50), width=1)
    
    return bg

def process_person(item):
    inp_path = item["file"]
    out_path = item["out"]
    
    if not os.path.exists(inp_path):
        print(f"File not found: {inp_path}")
        return
        
    print(f"Processing {inp_path} -> {out_path}...")
    img = Image.open(inp_path)
    img = ImageOps.exif_transpose(img)
    img = img.convert("RGBA")
    
    # Background Removal if rembg is present
    if REMBG_AVAILABLE:
        try:
            subject = remove(img)
        except Exception as e:
            print(f"rembg notice: {e}, using composite frame")
            subject = img
    else:
        subject = img
        
    bbox = subject.getbbox()
    if bbox:
        subject_cropped = subject.crop(bbox)
    else:
        subject_cropped = subject
        
    sw, sh = subject_cropped.size
    
    # Scale subject so height matches TARGET_SUBJECT_H uniformly across all team cards
    scale = TARGET_SUBJECT_H / float(sh)
    new_w = int(sw * scale)
    new_h = int(sh * scale)
    
    if new_w > CARD_W:
        scale = CARD_W / float(sw)
        new_w = int(sw * scale)
        new_h = int(sh * scale)
        
    subject_resized = subject_cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create background canvas
    card_bg = create_cool_background(CARD_W, CARD_H)
    
    # Center horizontally, position at bottom
    pos_x = (CARD_W - new_w) // 2
    pos_y = CARD_H - new_h
    
    # Soft drop shadow
    if subject_resized.mode == "RGBA":
        shadow = Image.new("RGBA", (new_w, new_h), (0, 0, 0, 0))
        mask = subject_resized.split()[3]
        shadow.paste((0, 0, 0, 160), mask=mask)
        shadow = shadow.filter(ImageFilter.GaussianBlur(16))
        card_bg.paste(shadow, (pos_x, pos_y + 10), shadow)
        card_bg.paste(subject_resized, (pos_x, pos_y), subject_resized)
    else:
        card_bg.paste(subject_resized, (pos_x, pos_y))
        
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    card_bg.convert("RGB").save(out_path, "WEBP", quality=92)
    print(f"Saved {out_path}")

if __name__ == "__main__":
    for item in PEOPLE:
        process_person(item)
