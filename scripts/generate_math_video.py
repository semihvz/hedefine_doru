import os
import sys
import sqlite3
import argparse
import subprocess
from pathlib import Path
from gtts import gTTS
from PIL import Image, ImageDraw, ImageFont

# Set up paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PUBLIC_VIDEOS_DIR = PROJECT_DIR / "public" / "videos"
PUBLIC_VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = PROJECT_DIR / "database.sqlite"

# Font configurations
FONT_BOLD_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_gradient_background(width, height):
    """Creates a high-end dark slate/navy gradient canvas"""
    base = Image.new("RGB", (width, height), (15, 23, 42)) # Slate 900
    draw = ImageDraw.Draw(base)
    
    # Draw radial/linear gradient glow in upper area
    for y in range(height):
        r = int(15 + (30 - 15) * (y / height))
        g = int(23 + (40 - 23) * (y / height))
        b = int(42 + (70 - 42) * (y / height))
        draw.line([(0, y), (width, y)], fill=(r, g, b))
        
    # Top header subtle cyan accent line
    draw.rectangle([0, 0, width, 6], fill=(14, 165, 233))
    return base

def clean_math_text(text):
    """Strips raw LaTeX markers for clean Turkish display"""
    if not text:
        return ""
    cleaned = text.replace(r'\(', '').replace(r'\)', '').replace(r'\log', 'log')
    return cleaned

def generate_narration_audio(question_id, title, q_text, exp_text):
    """Generates Turkish speech audio files for 3 stages of the video"""
    temp_dir = PROJECT_DIR / "scratch" / f"audio_{question_id}"
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    p1_text = (
        f"Merhaba! {title} testindeki matematik sorumuzu adım adım çözüyoruz. "
        f"Sorumuzda: {clean_math_text(q_text)} veriliyor."
    )
    
    p2_text = (
        "Adım 1: Logaritmanın temel tanımını hatırlayalım. "
        "log b tabanında a eşittir c ise, b üzeri c eşittir a olmalıdır. "
        "Burada tabanımız 2, sonucumuz 4'tür. "
        "Dolayısıyla içerideki x eksi 3 ifadesi, 2 üzeri 4 yani 16'ya eşit olur."
    )
    
    p3_text = (
        "Adım 2: x eksi 3 eşittir 16 denkleminde, eksi 3'ü karşı tarafa artı olarak atıyoruz. "
        "x eşittir 16 artı 3'ten 19 sonucuna ulaşıyoruz. "
        "Böylece doğru cevabımız C şıkkıdır! Tebrikler!"
    )

    audio_files = []
    texts = [p1_text, p2_text, p3_text]
    
    for idx, txt in enumerate(texts, 1):
        audio_path = temp_dir / f"part_{idx}.mp3"
        tts = gTTS(text=txt, lang='tr', slow=False)
        tts.save(str(audio_path))
        audio_files.append(audio_path)
        
    return audio_files, temp_dir

def get_audio_duration(file_path):
    """Gets exact duration of an audio file using ffprobe"""
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(file_path)
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    return float(res.stdout.strip())

def create_video(question_data):
    q_id = question_data['id']
    q_num = question_data.get('question_number', 1)
    q_text = clean_math_text(question_data['question_text'])
    options = question_data.get('options', [])
    
    print(f"🎬 Creating solution video for question [{q_id}]...")
    
    # 1. Generate audio files
    audio_files, temp_dir = generate_narration_audio(
        q_id, 
        question_data.get('title', 'Logaritma'),
        q_text,
        question_data.get('explanation', '')
    )
    
    durations = [get_audio_duration(f) for f in audio_files]
    total_audio_duration = sum(durations) + 1.5 # small pause at end
    print(f"🔊 Audio parts generated. Durations: {[round(d, 2) for d in durations]}s (Total: {round(total_audio_duration, 2)}s)")
    
    # Concatenate audio using ffmpeg
    concat_list_path = temp_dir / "concat.txt"
    with open(concat_list_path, "w", encoding="utf-8") as f:
        for audio in audio_files:
            f.write(f"file '{audio.name}'\n")
            
    full_audio_path = temp_dir / "full_narration.mp3"
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_list_path), "-c", "copy", str(full_audio_path)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # 2. Render frames (1920x1080 at 30fps)
    FPS = 30
    W, H = 1920, 1080
    total_frames = int(total_audio_duration * FPS)
    frames_dir = temp_dir / "frames"
    frames_dir.mkdir(exist_ok=True)
    
    f1_end = int(durations[0] * FPS)
    f2_end = f1_end + int(durations[1] * FPS)
    
    font_title = get_font(FONT_BOLD_PATH, 36)
    font_badge = get_font(FONT_BOLD_PATH, 24)
    font_q = get_font(FONT_BOLD_PATH, 42)
    font_opt = get_font(FONT_BOLD_PATH, 32)
    font_step_title = get_font(FONT_BOLD_PATH, 34)
    font_step_body = get_font(FONT_REG_PATH, 30)
    font_code = get_font(FONT_BOLD_PATH, 38)
    
    print(f"🖼️ Rendering {total_frames} frames...")
    
    for frame_idx in range(total_frames):
        current_time = frame_idx / FPS
        bg = draw_gradient_background(W, H)
        draw = ImageDraw.Draw(bg)
        
        # --- TOP HEADER BAR ---
        # Logo / Subject Badge
        draw.rounded_rectangle([60, 40, 520, 95], radius=12, fill=(30, 41, 59), outline=(56, 189, 248), width=2)
        draw.text((80, 52), "📐 YKS AYT MATEMATİK", font=font_badge, fill=(56, 189, 248))
        
        # Video Title
        draw.text((550, 50), f"Soru #{q_num} • Videolu Adım Adım Çözüm", font=font_title, fill=(248, 250, 252))
        
        # HD Badge
        draw.rounded_rectangle([W - 180, 42, W - 60, 92], radius=8, fill=(16, 185, 129))
        draw.text((W - 160, 52), "1080p HD", font=font_badge, fill=(255, 255, 255))
        
        # Header Divider
        draw.line([(60, 120), (W - 60, 120)], fill=(51, 65, 85), width=2)
        
        # --- QUESTION CARD (LEFT / TOP PORTION) ---
        draw.rounded_rectangle([60, 150, W - 60, 310], radius=16, fill=(30, 41, 59, 230), outline=(71, 85, 105), width=2)
        
        # Question Icon & Text
        draw.rounded_rectangle([85, 175, 145, 235], radius=10, fill=(14, 165, 233))
        draw.text((103, 185), "?", font=font_q, fill=(255, 255, 255))
        
        draw.text((170, 185), f"Soru {q_num}:  {q_text}", font=font_q, fill=(255, 255, 255))
        
        # --- OPTIONS GRID (5 SHIK) ---
        opts = [
            ("A", "11"), ("B", "16"), ("C", "19"), ("D", "20"), ("E", "35")
        ]
        
        opt_width = 330
        gap = 35
        start_x = 60
        opt_y = 335
        
        active_phase = 1 if frame_idx < f1_end else (2 if frame_idx < f2_end else 3)
        
        for idx, (key, val) in enumerate(opts):
            ox = start_x + idx * (opt_width + gap)
            is_correct_opt = (key == "C")
            
            if active_phase == 3 and is_correct_opt:
                # Highlight option C in Phase 3
                fill_color = (6, 78, 59) # Emerald dark
                border_color = (16, 185, 129) # Emerald bright
                text_color = (52, 211, 153)
                badge_bg = (16, 185, 129)
            else:
                fill_color = (30, 41, 59)
                border_color = (51, 65, 85)
                text_color = (226, 232, 240)
                badge_bg = (51, 65, 85)
                
            draw.rounded_rectangle([ox, opt_y, ox + opt_width, opt_y + 85], radius=12, fill=fill_color, outline=border_color, width=2)
            draw.rounded_rectangle([ox + 12, opt_y + 15, ox + 65, opt_y + 70], radius=8, fill=badge_bg)
            draw.text((ox + 27, opt_y + 24), key, font=font_opt, fill=(255, 255, 255))
            draw.text((ox + 90, opt_y + 24), val, font=font_opt, fill=text_color)
            
            if active_phase == 3 and is_correct_opt:
                draw.text((ox + opt_width - 55, opt_y + 20), "✓", font=font_q, fill=(16, 185, 129))

        # --- STEP-BY-STEP SOLUTION CONTAINER ---
        solution_y = 460
        draw.rounded_rectangle([60, solution_y, W - 60, 960], radius=20, fill=(15, 23, 42), outline=(30, 41, 59), width=2)

        # Step 1 Box
        s1_alpha = min(1.0, frame_idx / (FPS * 0.5))
        s1_border = (56, 189, 248) if active_phase == 1 else (71, 85, 105)
        s1_bg = (30, 41, 59) if active_phase == 1 else (20, 29, 47)
        
        draw.rounded_rectangle([90, solution_y + 30, W - 90, solution_y + 175], radius=14, fill=s1_bg, outline=s1_border, width=2)
        draw.text((120, solution_y + 45), "📌 AŞAMA 1: Logaritma Tanımı ve Kuralları Analizi", font=font_step_title, fill=(56, 189, 248))
        draw.text((120, solution_y + 95), "Logaritma kuralı:  log_b(a) = c  ⟺  b^c = a", font=font_code, fill=(253, 224, 71))

        # Step 2 Box (Revealed in Phase 2 & 3)
        if active_phase >= 2:
            s2_border = (56, 189, 248) if active_phase == 2 else (71, 85, 105)
            s2_bg = (30, 41, 59) if active_phase == 2 else (20, 29, 47)
            
            draw.rounded_rectangle([90, solution_y + 200, W - 90, solution_y + 345], radius=14, fill=s2_bg, outline=s2_border, width=2)
            draw.text((120, solution_y + 215), "📌 AŞAMA 2: Matematiksel Denklem ve İfade Düzenleme", font=font_step_title, fill=(168, 85, 247))
            draw.text((120, solution_y + 265), "log₂(x - 3) = 4  ⟹  x - 3 = 2⁴  = 16", font=font_code, fill=(255, 255, 255))

        # Step 3 Box (Revealed in Phase 3)
        if active_phase >= 3:
            draw.rounded_rectangle([90, solution_y + 370, W - 90, solution_y + 470], radius=14, fill=(6, 78, 59), outline=(16, 185, 129), width=3)
            draw.text((120, solution_y + 385), "🎉 AŞAMA 3: Sonucun Hesaplanması ve Doğru Şık", font=font_step_title, fill=(52, 211, 153))
            draw.text((120, solution_y + 425), "x - 3 = 16  ⟹  x = 16 + 3 = 19  (C Şıkkı Doğrudur)", font=font_code, fill=(253, 224, 71))

        # --- PROGRESS BAR AT BOTTOM ---
        progress_pct = (frame_idx + 1) / total_frames
        draw.rectangle([0, H - 14, W, H], fill=(30, 41, 59))
        draw.rectangle([0, H - 14, int(W * progress_pct), H], fill=(14, 165, 233))

        # Save frame image
        frame_filename = frames_dir / f"frame_{frame_idx:05d}.png"
        bg.save(frame_filename)
        
        if (frame_idx + 1) % 150 == 0 or frame_idx == total_frames - 1:
            print(f"  Frame {frame_idx + 1}/{total_frames} rendered ({int(progress_pct * 100)}%)")

    # 3. Assemble video using ffmpeg
    output_video_path = PUBLIC_VIDEOS_DIR / f"{q_id}_solution.mp4"
    print(f"🎥 Stitching video frames & audio into MP4: {output_video_path}")
    
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", str(frames_dir / "frame_%05d.png"),
        "-i", str(full_audio_path),
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "22",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        str(output_video_path)
    ]
    
    subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"✅ Video created successfully: {output_video_path}")
    
    # 4. Clean up temp files
    # shutil.rmtree(temp_dir)
    return f"/videos/{q_id}_solution.mp4"

def update_question_video_url(question_id, video_url):
    """Updates SQLite DB questions table with video_url"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Ensure column exists
    try:
        cursor.execute("ALTER TABLE questions ADD COLUMN video_url TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass # column already exists
        
    cursor.execute("UPDATE questions SET video_url = ? WHERE id = ?", (video_url, question_id))
    conn.commit()
    conn.close()
    print(f"💾 Updated SQLite question record [{question_id}] with video_url = '{video_url}'")

def main():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Fetch q-math-1 question
    cursor.execute("""
        SELECT q.id, q.question_number, q.question_text, q.explanation, qz.title 
        FROM questions q
        LEFT JOIN quizzes qz ON q.quiz_id = qz.id
        WHERE q.id = 'q-math-1'
    """)
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        print("❌ Question q-math-1 not found in database!")
        sys.exit(1)
        
    q_data = dict(row)
    video_url = create_video(q_data)
    update_question_video_url(q_data['id'], video_url)
    print("🎉 All steps complete!")

if __name__ == "__main__":
    main()
