import os
import sys
import sqlite3
import asyncio
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import edge_tts

# Set up paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PUBLIC_VIDEOS_DIR = PROJECT_DIR / "public" / "videos"
PUBLIC_VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = PROJECT_DIR / "database.sqlite"

# Font paths
FONT_BOLD_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def get_audio_duration(file_path):
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(file_path)
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    return float(res.stdout.strip())

def create_slate_canvas(width, height):
    """Creates a sleek, high-contrast dark board canvas"""
    base = Image.new("RGB", (width, height), (15, 23, 42)) # Slate 900
    draw = ImageDraw.Draw(base)
    
    # Top Accent bar
    draw.rectangle([0, 0, width, 100], fill=(30, 41, 59))
    draw.line([(0, 100), (width, 100)], fill=(14, 165, 233), width=3)
    
    return base

async def generate_direct_speech(temp_dir):
    """Generates direct-to-question natural speech using edge-tts (tr-TR-AhmetNeural)"""
    parts = [
        (
            "p1",
            "logaritma 2 tabanında x eksi 3 eşittir 4 denklemini sağlayan x değerini bulalım."
        ),
        (
            "p2",
            "Logaritmanın temel tanımına göre: log b tabanında a eşittir c ise, b üzeri c eşittir a olmalıdır. "
            "Burada tabanımız 2, sonucumuz 4'tür. İfadeyi düzenlersek x eksi 3 eşittir 2 üzeri 4 elde ederiz. "
            "2 üzeri 4 eşittir 16'dır."
        ),
        (
            "p3",
            "x eksi 3 eşittir 16 denkleminden, eksi 3'ü karşıya atarsak x eşittir 16 artı 3'ten 19 bulunur. "
            "Doğru cevabımız C şıkkıdır."
        )
    ]
    
    audio_paths = []
    voice = "tr-TR-AhmetNeural"
    
    for pid, text in parts:
        out_path = temp_dir / f"{pid}_direct.mp3"
        comm = edge_tts.Communicate(text, voice, rate="+3%")
        await comm.save(str(out_path))
        audio_paths.append(out_path)
        
    return audio_paths

def render_direct_video_frames(temp_dir, audio_files):
    durations = [get_audio_duration(af) for af in audio_files]
    total_audio_duration = sum(durations) + 1.0
    
    FPS = 30
    W, H = 1920, 1080
    total_frames = int(total_audio_duration * FPS)
    
    f1_end = int(durations[0] * FPS)
    f2_end = f1_end + int(durations[1] * FPS)
    
    frames_dir = temp_dir / "direct_frames"
    frames_dir.mkdir(exist_ok=True)
    
    font_header = get_font(FONT_BOLD_PATH, 34)
    font_badge = get_font(FONT_BOLD_PATH, 24)
    font_question = get_font(FONT_BOLD_PATH, 38)
    font_step_title = get_font(FONT_BOLD_PATH, 32)
    font_math = get_font(FONT_BOLD_PATH, 42)
    font_opt = get_font(FONT_BOLD_PATH, 32)

    q_title = "YKS AYT MATEMATİK • LOGARİTMA VİDEOLU ÇÖZÜM"
    q_text = "log₂(x - 3) = 4  denklemini sağlayan x değeri kaçtır?"
    options = [("A", "11"), ("B", "16"), ("C", "19"), ("D", "20"), ("E", "35")]
    
    print(f"🎨 Rendering {total_frames} clean frames (Direct to question)...")
    
    for frame_idx in range(total_frames):
        canvas = create_slate_canvas(W, H)
        draw = ImageDraw.Draw(canvas)
        
        # --- HEADER ---
        draw.rounded_rectangle([50, 20, 360, 80], radius=10, fill=(14, 165, 233))
        draw.text((70, 35), "📐 VİDEOLU ÇÖZÜM", font=font_badge, fill=(255, 255, 255))
        draw.text((390, 32), q_title, font=font_header, fill=(248, 250, 252))
        
        draw.rounded_rectangle([W - 200, 25, W - 50, 75], radius=8, fill=(16, 185, 129))
        draw.text((W - 180, 37), "1080p HD", font=font_badge, fill=(255, 255, 255))

        # --- QUESTION CARD ---
        draw.rounded_rectangle([50, 125, W - 50, 250], radius=16, fill=(30, 41, 59), outline=(71, 85, 105), width=2)
        draw.rounded_rectangle([75, 150, 140, 210], radius=10, fill=(14, 165, 233))
        draw.text((95, 160), "S1", font=font_badge, fill=(255, 255, 255))
        draw.text((160, 162), q_text, font=font_question, fill=(255, 255, 255))
        
        # Determine active phase
        if frame_idx < f1_end:
            phase = 1
        elif frame_idx < f2_end:
            phase = 2
        else:
            phase = 3
            
        # --- OPTIONS GRID ---
        opt_width = 330
        gap = 35
        start_x = 50
        opt_y = 270
        
        for idx, (key, val) in enumerate(options):
            ox = start_x + idx * (opt_width + gap)
            is_correct_opt = (key == "C")
            
            if phase == 3 and is_correct_opt:
                fill_col = (6, 78, 59)
                border_col = (16, 185, 129)
                txt_col = (52, 211, 153)
                badge_bg = (16, 185, 129)
            else:
                fill_col = (30, 41, 59)
                border_col = (51, 65, 85)
                txt_col = (226, 232, 240)
                badge_bg = (51, 65, 85)
                
            draw.rounded_rectangle([ox, opt_y, ox + opt_width, opt_y + 75], radius=12, fill=fill_col, outline=border_col, width=2)
            draw.rounded_rectangle([ox + 10, opt_y + 12, ox + 60, opt_y + 62], radius=8, fill=badge_bg)
            draw.text((ox + 24, opt_y + 20), key, font=font_opt, fill=(255, 255, 255))
            draw.text((ox + 85, opt_y + 20), val, font=font_opt, fill=txt_col)
            
            if phase == 3 and is_correct_opt:
                draw.text((ox + opt_width - 45, opt_y + 15), "✓", font=font_math, fill=(16, 185, 129))

        # --- STEP BY STEP SOLUTION CONTAINERS ---
        board_y = 375
        
        # Step 1: Logarithm Definition Box
        s1_border = (56, 189, 248) if phase == 1 else (71, 85, 105)
        s1_bg = (30, 41, 59) if phase == 1 else (20, 29, 47)
        draw.rounded_rectangle([50, board_y, W - 50, board_y + 170], radius=16, fill=s1_bg, outline=s1_border, width=2)
        draw.text((80, board_y + 25), "📌 AŞAMA 1: Logaritma Tanımı ve Kurallar", font=font_step_title, fill=(56, 189, 248))
        draw.text((80, board_y + 80), "Kural:  log_b (a) = c   ⟺   b^c = a", font=font_math, fill=(253, 224, 71))

        # Step 2: Algebraic Equation Setup (Revealed in Phase 2 & 3)
        if phase >= 2:
            s2_border = (56, 189, 248) if phase == 2 else (71, 85, 105)
            s2_bg = (30, 41, 59) if phase == 2 else (20, 29, 47)
            draw.rounded_rectangle([50, board_y + 190, W - 50, board_y + 360], radius=16, fill=s2_bg, outline=s2_border, width=2)
            draw.text((80, board_y + 215), "📌 AŞAMA 2: Denklem Kurma ve Hesaplama", font=font_step_title, fill=(168, 85, 247))
            draw.text((80, board_y + 270), "log₂(x - 3) = 4   ⟹   x - 3 = 2⁴ = 16", font=font_math, fill=(255, 255, 255))

        # Step 3: Result & Correct Option (Revealed in Phase 3)
        if phase >= 3:
            draw.rounded_rectangle([50, board_y + 380, W - 50, board_y + 550], radius=16, fill=(6, 78, 59), outline=(16, 185, 129), width=3)
            draw.text((80, board_y + 405), "🎉 AŞAMA 3: Sonucun Elde Edilmesi", font=font_step_title, fill=(52, 211, 153))
            draw.text((80, board_y + 460), "x - 3 = 16   ⟹   x = 16 + 3 = 19   (C Şıkkı)", font=font_math, fill=(253, 224, 71))

        # --- PROGRESS BAR AT BOTTOM ---
        prog_pct = (frame_idx + 1) / total_frames
        draw.rectangle([0, H - 12, W, H], fill=(30, 41, 59))
        draw.rectangle([0, H - 12, int(W * prog_pct), H], fill=(14, 165, 233))
        
        # Save frame
        frame_filename = frames_dir / f"frame_{frame_idx:05d}.png"
        canvas.save(frame_filename)

    # Concatenate Audio
    concat_txt = temp_dir / "concat_direct.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for af in audio_files:
            f.write(f"file '{af.name}'\n")
            
    full_audio = temp_dir / "full_direct.mp3"
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_txt), "-c", "copy", str(full_audio)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Output MP4
    output_mp4 = PUBLIC_VIDEOS_DIR / "q-math-1_solution.mp4"
    print(f"🎬 Stitching clean direct video into MP4: {output_mp4}")
    
    subprocess.run([
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", str(frames_dir / "frame_%05d.png"),
        "-i", str(full_audio),
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        str(output_mp4)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    print(f"✅ Clean direct math solution video created at: {output_mp4}")

def update_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("UPDATE questions SET video_url = '/videos/q-math-1_solution.mp4' WHERE id = 'q-math-1'")
    conn.commit()
    conn.close()

async def main():
    q_id = "q-math-1"
    temp_dir = PROJECT_DIR / "scratch" / f"direct_{q_id}"
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    print("🎙️ Generating direct speech narration...")
    audio_files = await generate_direct_speech(temp_dir)
    render_direct_video_frames(temp_dir, audio_files)
    update_db()
    print("🎉 Direct video complete!")

if __name__ == "__main__":
    asyncio.run(main())
