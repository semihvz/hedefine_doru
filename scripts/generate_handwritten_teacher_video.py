import os
import sys
import math
import sqlite3
import asyncio
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import edge_tts

# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PUBLIC_VIDEOS_DIR = PROJECT_DIR / "public" / "videos"
PUBLIC_VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = PROJECT_DIR / "database.sqlite"

# Fonts
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

def create_board_canvas(width, height):
    """Creates a digital tablet / blackboard background with subtle grid dots"""
    board = Image.new("RGB", (width, height), (13, 19, 33)) # Dark Slate
    draw = ImageDraw.Draw(board)
    
    # Draw subtle grid dots
    grid_spacing = 40
    for x in range(grid_spacing, width, grid_spacing):
        for y in range(grid_spacing, height, grid_spacing):
            draw.point((x, y), fill=(30, 41, 64))
            
    # Top header bar background
    draw.rectangle([0, 0, width, 110], fill=(21, 31, 50))
    draw.line([(0, 110), (width, 110)], fill=(56, 189, 248), width=3)
    
    return board

def draw_pen_cursor(draw, x, y, color=(56, 189, 248)):
    """Draws a stylized glowing digital pen tip cursor"""
    # Pen body (diagonal stylus line)
    pen_len = 35
    px, py = x + pen_len, y - pen_len
    draw.line([(x, y), (px, py)], fill=(226, 232, 240), width=4)
    draw.line([(px, py), (px + 10, py - 10)], fill=(148, 163, 184), width=6)
    
    # Glowing tip point
    draw.ellipse([x - 5, y - 5, x + 5, y + 5], fill=color, outline=(255, 255, 255), width=2)
    draw.ellipse([x - 10, y - 10, x + 10, y + 10], outline=(*color, 120), width=1)

async def generate_teacher_speech(temp_dir):
    """Generates natural teacher speech audio using edge-tts with tr-TR-AhmetNeural"""
    parts = [
        (
            "p1", 
            "Selam arkadaşlar, hoş geldiniz! Ben matematik öğretmeniniz. "
            "Bugün sizlerle ÖSYM'nin her yıl sormayı çok sevdiği logaritma denklem sorularından birini çözeceğiz. "
            "Sorumuzda: logaritma 2 tabanında x eksi 3 eşittir 4 veriliyor. Hazırsanız tahtaya yazarak başlayalım!"
        ),
        (
            "p2",
            "Şimdi logaritmanın temel tanımını hatırlayalım. Ne diyorduk derslerimizde? "
            "Taban karşıya geçer ve sonucu üs yapar! Yani log a tabanında b eşittir c ise, a üzeri c eşittir b olur. "
            "Burada tabanımız 2, sonucumuz 4. Yani 2 sayısı karşıya geçip 4'ü sırtına alacak!"
        ),
        (
            "p3",
            "Hemen yazıyorum: x eksi 3 eşittir 2 üzeri 4. "
            "2 üzeri 4 kaça eşittir? 2 kere 2 dört, dört kere 2 sekiz, sekiz kere 2 16! "
            "Demek ki x eksi 3 eşittir 16 denklemine ulaşıyoruz."
        ),
        (
            "p4",
            "Son adıma geldik arkadaşlar! Eksi 3'ü eşitliğin sağ tarafına artı 3 olarak gönderiyoruz. "
            "x eşittir 16 artı 3'ten x eşittir 19 bulunur! "
            "Şıklarımıza baktığımızda doğru cevabımız C seçeneğidir. Tebrik ediyorum, bir sonraki soruda görüşmek üzere!"
        )
    ]
    
    audio_paths = []
    voice = "tr-TR-AhmetNeural"
    
    for pid, text in parts:
        out_path = temp_dir / f"{pid}_teacher.mp3"
        comm = edge_tts.Communicate(text, voice, rate="+2%")
        await comm.save(str(out_path))
        audio_paths.append(out_path)
        
    return audio_paths

def render_video_frames(temp_dir, audio_files):
    durations = [get_audio_duration(af) for af in audio_files]
    total_audio_duration = sum(durations) + 1.5
    
    FPS = 30
    W, H = 1920, 1080
    total_frames = int(total_audio_duration * FPS)
    
    # Timing boundaries in frames
    f1_end = int(durations[0] * FPS)
    f2_end = f1_end + int(durations[1] * FPS)
    f3_end = f2_end + int(durations[2] * FPS)
    
    frames_dir = temp_dir / "handwritten_frames"
    frames_dir.mkdir(exist_ok=True)
    
    font_header = get_font(FONT_BOLD_PATH, 34)
    font_badge = get_font(FONT_BOLD_PATH, 24)
    font_question = get_font(FONT_BOLD_PATH, 36)
    font_teacher = get_font(FONT_BOLD_PATH, 44)
    font_math_large = get_font(FONT_BOLD_PATH, 46)
    font_opt = get_font(FONT_BOLD_PATH, 32)
    font_note = get_font(FONT_REG_PATH, 28)

    # Questions & Options
    q_title = "AYT MATEMATİK • LOGARİTMA DENKLEMLERİ"
    q_text = "log₂(x - 3) = 4  denklemini sağlayan x değeri kaçtır?"
    options = [("A", "11"), ("B", "16"), ("C", "19"), ("D", "20"), ("E", "35")]
    
    # Texts to write character by character in pen simulation
    text_rule_header = "📌 LOGARİTMA TEMEL TANIM KURALI:"
    text_rule_formula = "log_a (b) = c  ⟺  a^c = b"
    text_step1 = "1) Taban karşıya geçer:  x - 3 = 2⁴"
    text_step2 = "2) Üslü ifadeyi hesapla: 2⁴ = 16  ⟹  x - 3 = 16"
    text_step3 = "3) Bilinmeyeni yalnız bırak: x = 16 + 3  ⟹  x = 19  ✓"
    
    print(f"🎨 Rendering {total_frames} frames with Pen Handwriting & Teacher Narration...")
    
    for frame_idx in range(total_frames):
        board = create_board_canvas(W, H)
        draw = ImageDraw.Draw(board)
        
        # --- HEADER BAR ---
        # Teacher Avatar & Name Badge
        draw.rounded_rectangle([50, 25, 420, 85], radius=12, fill=(30, 41, 59), outline=(56, 189, 248), width=2)
        draw.text((70, 38), "👨‍🏫 CANLI ÖĞRETMEN ANLATIMI", font=font_badge, fill=(56, 189, 248))
        
        draw.text((450, 36), q_title, font=font_header, fill=(248, 250, 252))
        
        # Status / Pen mode badge
        draw.rounded_rectangle([W - 280, 28, W - 50, 82], radius=10, fill=(16, 185, 129))
        draw.text((W - 260, 42), "✍️ Dijital Kalem Modu", font=font_badge, fill=(255, 255, 255))

        # --- QUESTION BOX (TOP TABLET AREA) ---
        draw.rounded_rectangle([50, 135, W - 50, 260], radius=16, fill=(20, 30, 48), outline=(71, 85, 105), width=2)
        draw.rounded_rectangle([75, 155, 140, 215], radius=10, fill=(14, 165, 233))
        draw.text((95, 165), "S1", font=font_badge, fill=(255, 255, 255))
        draw.text((160, 170), q_text, font=font_question, fill=(255, 255, 255))
        
        # --- OPTIONS (CHOICES) ---
        opt_width = 330
        gap = 35
        start_x = 50
        opt_y = 280
        
        # Current active phase
        if frame_idx < f1_end:
            phase = 1
        elif frame_idx < f2_end:
            phase = 2
        elif frame_idx < f3_end:
            phase = 3
        else:
            phase = 4
            
        for idx, (key, val) in enumerate(options):
            ox = start_x + idx * (opt_width + gap)
            is_correct_opt = (key == "C")
            
            if phase == 4 and is_correct_opt:
                # Highlight C in phase 4 with gold/emerald pen circle
                fill_col = (6, 78, 59)
                border_col = (52, 211, 153)
                txt_col = (52, 211, 153)
                badge_bg = (16, 185, 129)
            else:
                fill_col = (20, 30, 48)
                border_col = (51, 65, 85)
                txt_col = (226, 232, 240)
                badge_bg = (51, 65, 85)
                
            draw.rounded_rectangle([ox, opt_y, ox + opt_width, opt_y + 75], radius=12, fill=fill_col, outline=border_col, width=2)
            draw.rounded_rectangle([ox + 10, opt_y + 12, ox + 60, opt_y + 62], radius=8, fill=badge_bg)
            draw.text((ox + 24, opt_y + 20), key, font=font_opt, fill=(255, 255, 255))
            draw.text((ox + 85, opt_y + 20), val, font=font_opt, fill=txt_col)
            
            # Pen circles choice C in phase 4
            if phase == 4 and is_correct_opt:
                draw.ellipse([ox - 5, opt_y - 5, ox + opt_width + 5, opt_y + 80], outline=(250, 204, 21), width=4)
                draw.text((ox + opt_width - 45, opt_y + 15), "✓", font=font_math_large, fill=(250, 204, 21))

        # --- DIGITAL WHITEBOARD WRITING AREA ---
        board_y = 385
        draw.rounded_rectangle([50, board_y, W - 50, 1030], radius=20, fill=(15, 23, 42), outline=(30, 41, 59), width=2)
        
        pen_x, pen_y = None, None
        
        # --- PHASE 2: PEN WRITES LOGARITHM RULE ---
        if phase >= 2:
            p2_frames = f2_end - f1_end
            progress_p2 = min(1.0, max(0.0, (frame_idx - f1_end) / (p2_frames * 0.7)))
            
            # Rule Title
            num_chars_title = int(len(text_rule_header) * progress_p2)
            written_title = text_rule_header[:num_chars_title]
            draw.text((90, board_y + 35), written_title, font=font_question, fill=(56, 189, 248))
            
            if phase == 2 and progress_p2 < 1.0:
                # Pen writing title
                bbox = font_question.getbbox(written_title) if written_title else (0,0,0,0)
                pen_x = 90 + bbox[2]
                pen_y = board_y + 55
                draw_pen_cursor(draw, pen_x, pen_y, color=(56, 189, 248))

            # Rule Formula Box (Cyan Pen)
            if progress_p2 > 0.3:
                prog_form = min(1.0, (progress_p2 - 0.3) / 0.7)
                num_chars_form = int(len(text_rule_formula) * prog_form)
                written_form = text_rule_formula[:num_chars_form]
                
                draw.rounded_rectangle([90, board_y + 90, W - 90, board_y + 180], radius=14, fill=(23, 37, 84), outline=(56, 189, 248), width=2)
                draw.text((120, board_y + 110), written_form, font=font_teacher, fill=(253, 224, 71))
                
                if phase == 2 and prog_form < 1.0:
                    bbox = font_teacher.getbbox(written_form) if written_form else (0,0,0,0)
                    pen_x = 120 + bbox[2]
                    pen_y = board_y + 135
                    draw_pen_cursor(draw, pen_x, pen_y, color=(253, 224, 71))

        # --- PHASE 3: PEN WRITES EQUATION STEPS (STEP 1 & STEP 2) ---
        if phase >= 3:
            p3_frames = f3_end - f2_end
            progress_p3 = min(1.0, max(0.0, (frame_idx - f2_end) / (p3_frames * 0.8)))
            
            # Step 1 Writing
            num_chars_s1 = int(len(text_step1) * min(1.0, progress_p3 * 2))
            written_s1 = text_step1[:num_chars_s1]
            
            draw.rounded_rectangle([90, board_y + 210, W - 90, board_y + 300], radius=14, fill=(30, 41, 59), outline=(168, 85, 247), width=2)
            draw.text((120, board_y + 230), written_s1, font=font_teacher, fill=(244, 114, 182))
            
            if phase == 3 and progress_p3 < 0.5:
                bbox = font_teacher.getbbox(written_s1) if written_s1 else (0,0,0,0)
                pen_x = 120 + bbox[2]
                pen_y = board_y + 255
                draw_pen_cursor(draw, pen_x, pen_y, color=(244, 114, 182))

            # Step 2 Writing
            if progress_p3 > 0.4:
                prog_s2 = min(1.0, (progress_p3 - 0.4) * 2)
                num_chars_s2 = int(len(text_step2) * prog_s2)
                written_s2 = text_step2[:num_chars_s2]
                
                draw.rounded_rectangle([90, board_y + 320, W - 90, board_y + 410], radius=14, fill=(30, 41, 59), outline=(168, 85, 247), width=2)
                draw.text((120, board_y + 340), written_s2, font=font_teacher, fill=(255, 255, 255))
                
                if phase == 3 and prog_s2 < 1.0:
                    bbox = font_teacher.getbbox(written_s2) if written_s2 else (0,0,0,0)
                    pen_x = 120 + bbox[2]
                    pen_y = board_y + 365
                    draw_pen_cursor(draw, pen_x, pen_y, color=(255, 255, 255))

        # --- PHASE 4: PEN WRITES FINAL RESULT & HIGHLIGHTS ANSWER ---
        if phase >= 4:
            p4_frames = total_frames - f3_end
            progress_p4 = min(1.0, max(0.0, (frame_idx - f3_end) / (p4_frames * 0.7)))
            
            num_chars_s3 = int(len(text_step3) * progress_p4)
            written_s3 = text_step3[:num_chars_s3]
            
            draw.rounded_rectangle([90, board_y + 430, W - 90, board_y + 540], radius=16, fill=(6, 78, 59), outline=(16, 185, 129), width=3)
            draw.text((120, board_y + 455), written_s3, font=font_math_large, fill=(250, 204, 21))
            
            if progress_p4 < 1.0:
                bbox = font_math_large.getbbox(written_s3) if written_s3 else (0,0,0,0)
                pen_x = 120 + bbox[2]
                pen_y = board_y + 485
                draw_pen_cursor(draw, pen_x, pen_y, color=(250, 204, 21))
            else:
                # Underline final answer 19 with glowing pen stroke
                draw.line([(680, board_y + 515), (1050, board_y + 515)], fill=(250, 204, 21), width=4)

        # --- PROGRESS BAR AT BOTTOM ---
        prog_pct = (frame_idx + 1) / total_frames
        draw.rectangle([0, H - 12, W, H], fill=(30, 41, 59))
        draw.rectangle([0, H - 12, int(W * prog_pct), H], fill=(56, 189, 248))
        
        # Save frame
        frame_filename = frames_dir / f"frame_{frame_idx:05d}.png"
        board.save(frame_filename)
        
        if (frame_idx + 1) % 150 == 0 or frame_idx == total_frames - 1:
            print(f"  Frame {frame_idx + 1}/{total_frames} ({int(prog_pct * 100)}%) rendered")

    # Combine Audio
    concat_txt = temp_dir / "concat_teacher.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for af in audio_files:
            f.write(f"file '{af.name}'\n")
            
    full_audio = temp_dir / "full_teacher.mp3"
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_txt), "-c", "copy", str(full_audio)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Output video file
    output_mp4 = PUBLIC_VIDEOS_DIR / "q-math-1_solution.mp4"
    print(f"🎬 Stitching teacher video into MP4: {output_mp4}")
    
    subprocess.run([
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", str(frames_dir / "frame_%05d.png"),
        "-i", str(full_audio),
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        str(output_mp4)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    print(f"✅ Teacher handwriting video created successfully at: {output_mp4}")

def update_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("UPDATE questions SET video_url = '/videos/q-math-1_solution.mp4' WHERE id = 'q-math-1'")
    conn.commit()
    conn.close()
    print("💾 Updated database record for q-math-1")

async def main():
    q_id = "q-math-1"
    temp_dir = PROJECT_DIR / "scratch" / f"teacher_handwritten_{q_id}"
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    print("🎙️ Generating natural Turkish teacher voice with edge-tts (tr-TR-AhmetNeural)...")
    audio_files = await generate_teacher_speech(temp_dir)
    render_video_frames(temp_dir, audio_files)
    update_db()
    print("🎉 All tasks completed!")

if __name__ == "__main__":
    asyncio.run(main())
