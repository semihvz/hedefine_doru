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

def insert_paragraph_question_to_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    quiz_id = "quiz-turkce-paragraf"
    q_id = "q-tr-para-1"
    
    # Ensure Quiz exists
    cursor.execute("SELECT id FROM quizzes WHERE id = ?", (quiz_id,))
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO quizzes (id, title, category, description)
            VALUES (?, ?, ?, ?)
        """, (
            quiz_id,
            "YKS Türkçe - Paragrafta Yardımcı Düşünce Soru Bankası",
            "Türkçe",
            "Paragrafta yardımcı düşünceler, ana fikir ve olumsuz soru kökleri (bulunamaz, ulaşılamaz, çıkarılamaz) özel soru bankası."
        ))
        
    # Delete existing q-tr-para-1 to re-seed cleanly
    cursor.execute("DELETE FROM questions WHERE id = ?", (q_id,))
    cursor.execute("DELETE FROM question_options WHERE question_id = ?", (q_id,))
    
    q_text = (
        "\"Kitap okumak, bireye yalnızca yeni bilgiler kazandırmakla kalmaz; aynı zamanda zihinsel sınırları genişleterek eleştirel düşünme becerisini geliştirir. "
        "Düzenli okuma alışkanlığı edinen bireyler, karşılaştıkları karmaşık problemleri farklı açılardan değerlendirme yeteneği kazanırlar. "
        "Ayrıca edebî eserler, insanın duygusal zekasını besleyerek empati kurma gücünü artırır.\"\n\n"
        "Bu parçadan kitap okuma alışkanlığı ile ilgili aşağıdakilerden hangisi **bulunamaz**?"
    )
    
    explanation_text = (
        "💡 DETAYLI PARAGRAF VE ŞIK ANALİZİ:\n\n"
        "• A Şıkkı: \"Zihinsel sınırları genişleterek eleştirel düşünmeyi geliştirir\" ifadesinden A bulunur.\n"
        "• B Şıkkı: \"Karmaşık problemleri farklı açılardan değerlendirme yeteneği\" ifadesinden B bulunur.\n"
        "• C Şıkkı: \"Duygusal zekasını besleyerek empati kurma gücünü artırır\" ifadesinden C bulunur.\n"
        "• E Şıkkı: \"Yalnızca yeni bilgiler kazandırmakla kalmaz\" ifadesinden E bulunur.\n\n"
        "📌 D ŞIKKI ANALİZİ (Doğru Cevap):\n"
        "Metinde okuma alışkanlığının 'yalnızca genç yaşlarda kazanıldığında kalıcı etki bıraktığına' dair hiçbir yaş sınırlaması veya şart yer almamaktadır. Dolayısıyla D şıkkı parçada bulunamaz."
    )
    
    topic_summary = "Paragrafta olumsuz soru köklerinde (bulunamaz, ulaşılamaz) metinde doğrudan geçen yargılar elenir, metinde değinilmeyen veya yorum eklenen şık doğru cevaptır."
    
    cursor.execute("""
        INSERT INTO questions (id, quiz_id, question_number, question_text, explanation, topic_summary, video_url, points)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        q_id, quiz_id, 1, q_text, explanation_text, topic_summary, "/videos/q-tr-para-1_solution.mp4", 15
    ))
    
    options_data = [
        ("opt-tr-1", q_id, "A", "Zihinsel ufku ve düşünme kapasitesini genişlettiği", 0),
        ("opt-tr-2", q_id, "B", "Karmaşık durumlarda çok yönlü bakış açısı sağladığı", 0),
        ("opt-tr-3", q_id, "C", "Duygusal zekayı ve başkalarını anlama yetisini desteklediği", 0),
        ("opt-tr-4", q_id, "D", "Yalnızca genç yaşlarda kazanıldığında kalıcı etkiler bıraktığı", 1),
        ("opt-tr-5", q_id, "E", "Bireye yeni bilgiler ve deneyimler sunduğu", 0)
    ]
    
    for opt in options_data:
        cursor.execute("""
            INSERT INTO question_options (id, question_id, option_key, option_text, is_correct)
            VALUES (?, ?, ?, ?, ?)
        """, opt)
        
    conn.commit()
    conn.close()
    print("💾 Inserted Turkish paragraph question [q-tr-para-1] into SQLite database.")

async def generate_speech_narration(temp_dir):
    """Generates direct Turkish speech for paragraph question using edge-tts (tr-TR-AhmetNeural)"""
    parts = [
        (
            "p1",
            "Bu parçadan kitap okuma alışkanlığı ile ilgili aşağıdakilerden hangisi bulunamaz? "
            "Parçamızı inceleyelim: Kitap okumak bireye yeni bilgiler kazandırır, zihinsel sınırları genişletir ve karmaşık problemleri farklı açılardan değerlendirmemizi sağlar. "
            "Ayrıca duygusal zekayı besleyerek empati gücünü artırır."
        ),
        (
            "p2",
            "Şıkları tek tek inceleyelim: "
            "A şıkkındaki zihinsel ufkunu genişlettiği, B şıkkındaki karmaşık durumlarda çok yönlü bakış açısı sağladığı, "
            "C şıkkındaki duygusal zekayı ve empatiyi desteklediği ve E şıkkındaki yeni bilgiler sunduğu ifadeleri metinde açıkça bulunmaktadır."
        ),
        (
            "p3",
            "Ancak D şıkkındaki 'yalnızca genç yaşlarda kazanıldığında kalıcı etkiler bıraktığı' yargısına parçada hiç değinilmemiştir. "
            "Metinde herhangi bir yaş sınırlaması bulunmamaktadır. Dolayısıyla doğru cevabımız D seçeneğidir."
        )
    ]
    
    audio_paths = []
    voice = "tr-TR-AhmetNeural"
    
    for pid, text in parts:
        out_path = temp_dir / f"{pid}_paragraph.mp3"
        comm = edge_tts.Communicate(text, voice, rate="+2%")
        await comm.save(str(out_path))
        audio_paths.append(out_path)
        
    return audio_paths

def render_paragraph_video_frames(temp_dir, audio_files):
    durations = [get_audio_duration(af) for af in audio_files]
    total_audio_duration = sum(durations) + 1.0
    
    FPS = 30
    W, H = 1920, 1080
    total_frames = int(total_audio_duration * FPS)
    
    f1_end = int(durations[0] * FPS)
    f2_end = f1_end + int(durations[1] * FPS)
    
    frames_dir = temp_dir / "para_frames"
    frames_dir.mkdir(exist_ok=True)
    
    font_header = get_font(FONT_BOLD_PATH, 34)
    font_badge = get_font(FONT_BOLD_PATH, 24)
    font_para = get_font(FONT_REG_PATH, 26)
    font_prompt = get_font(FONT_BOLD_PATH, 28)
    font_opt = get_font(FONT_BOLD_PATH, 25)
    font_analysis_title = get_font(FONT_BOLD_PATH, 28)
    font_analysis_body = get_font(FONT_REG_PATH, 25)

    para_text = (
        "\"Kitap okumak, bireye yalnızca yeni bilgiler kazandırmakla kalmaz; aynı zamanda zihinsel sınırları "
        "genişleterek eleştirel düşünme becerisini geliştirir. Düzenli okuma alışkanlığı edinen bireyler, "
        "karşılaştıkları karmaşık problemleri farklı açılardan değerlendirme yeteneği kazanırlar. Ayrıca edebî "
        "eserler, insanın duygusal zekasını besleyerek empati kurma gücünü artırır.\""
    )
    
    question_prompt = "Bu parçadan kitap okuma alışkanlığı ile ilgili aşağıdakilerden hangisi BULUNAMAZ?"
    
    options = [
        ("A", "Zihinsel ufku ve düşünme kapasitesini genişlettiği"),
        ("B", "Karmaşık durumlarda çok yönlü bakış açısı sağladığı"),
        ("C", "Duygusal zekayı ve başkalarını anlama yetisini desteklediği"),
        ("D", "Yalnızca genç yaşlarda kazanıldığında kalıcı etkiler bıraktığı"),
        ("E", "Bireye yeni bilgiler ve deneyimler sunduğu")
    ]
    
    print(f"🎨 Rendering {total_frames} frames for Turkish Paragraph Solution...")
    
    for frame_idx in range(total_frames):
        bg = Image.new("RGB", (W, H), (15, 23, 42)) # Slate 900
        draw = ImageDraw.Draw(bg)
        
        # --- HEADER ---
        draw.rectangle([0, 0, W, 90], fill=(30, 41, 59))
        draw.line([(0, 90), (W, 90)], fill=(236, 72, 153), width=3) # Pink accent for Türkçe
        
        draw.rounded_rectangle([40, 18, 380, 72], radius=10, fill=(236, 72, 153))
        draw.text((60, 32), "📖 YKS TÜRKÇE • PARAGRAF", font=font_badge, fill=(255, 255, 255))
        draw.text((410, 28), "Paragrafta Yardımcı Düşünce (Bulunamaz)", font=font_header, fill=(248, 250, 252))
        
        draw.rounded_rectangle([W - 180, 20, W - 40, 70], radius=8, fill=(16, 185, 129))
        draw.text((W - 160, 32), "1080p HD", font=font_badge, fill=(255, 255, 255))

        # --- PARAGRAPH TEXT BOX (LEFT PANEL) ---
        draw.rounded_rectangle([40, 115, 1020, 480], radius=16, fill=(20, 30, 48), outline=(51, 65, 85), width=2)
        
        # Split paragraph into lines for clean reading
        lines = [
            "\"Kitap okumak, bireye yalnızca yeni bilgiler kazandırmakla kalmaz; aynı zamanda",
            "zihinsel sınırları genişleterek eleştirel düşünme becerisini geliştirir. Düzenli okuma",
            "alışkanlığı edinen bireyler, karşılaştıkları karmaşık problemleri farklı açılardan",
            "değerlendirme yeteneği kazanırlar. Ayrıca edebî eserler, insanın duygusal zekasını",
            "besleyerek empati kurma gücünü artırır.\""
        ]
        
        for idx, line in enumerate(lines):
            draw.text((65, 135 + idx * 36), line, font=font_para, fill=(226, 232, 240))
            
        # Question Prompt Box (Highlighted in Rose/Pink)
        draw.rounded_rectangle([40, 360, 1020, 460], radius=12, fill=(136, 19, 55), outline=(244, 63, 94), width=2)
        draw.text((60, 385), question_prompt, font=font_prompt, fill=(255, 255, 255))

        # Determine active phase
        if frame_idx < f1_end:
            phase = 1
        elif frame_idx < f2_end:
            phase = 2
        else:
            phase = 3

        # --- OPTIONS LIST (RIGHT PANEL) ---
        start_y = 115
        opt_h = 65
        gap = 12
        
        for idx, (key, text) in enumerate(options):
            oy = start_y + idx * (opt_h + gap)
            is_target = (key == "D")
            
            if phase >= 2 and not is_target:
                # Marked as Found in text
                fill_col = (20, 30, 48)
                border_col = (16, 185, 129) # Green check border
                text_col = (148, 163, 184)
                badge_bg = (16, 185, 129)
                badge_label = "✓ Bulunur"
            elif phase == 3 and is_target:
                # Correct Answer D (NOT Found in text)
                fill_col = (153, 27, 27) # Dark red/rose
                border_col = (239, 68, 68) # Bright red border
                text_col = (255, 255, 255)
                badge_bg = (239, 68, 68)
                badge_label = "❌ Bulunamaz"
            else:
                fill_col = (30, 41, 59)
                border_col = (51, 65, 85)
                text_col = (226, 232, 240)
                badge_bg = (51, 65, 85)
                badge_label = key
                
            draw.rounded_rectangle([1050, oy, W - 40, oy + opt_h], radius=12, fill=fill_col, outline=border_col, width=2)
            draw.rounded_rectangle([1062, oy + 10, 1115, oy + 55], radius=8, fill=badge_bg)
            draw.text((1075, oy + 18), key, font=font_opt, fill=(255, 255, 255))
            draw.text((1130, oy + 18), text, font=font_opt, fill=text_col)
            
            if phase >= 2:
                draw.text((W - 180, oy + 18), badge_label, font=font_badge, fill=(255, 255, 255) if is_target else (52, 211, 153))

        # --- STEP-BY-STEP ANALYSIS CONTAINER (BOTTOM PANEL) ---
        analysis_y = 500
        draw.rounded_rectangle([40, analysis_y, W - 40, 1030], radius=18, fill=(30, 41, 59), outline=(51, 65, 85), width=2)
        
        if phase == 1:
            draw.text((70, analysis_y + 30), "📌 PARAGRAF ANALİZİ:", font=font_analysis_title, fill=(56, 189, 248))
            draw.text((70, analysis_y + 80), "Metinde geçen anahtar yargıları şıklar ile eşleştirerek eliyoruz.", font=font_analysis_body, fill=(226, 232, 240))
        elif phase == 2:
            draw.text((70, analysis_y + 30), "🔎 ŞIKLARIN METİN İLE EŞLEŞTİRİLMESİ:", font=font_analysis_title, fill=(52, 211, 153))
            draw.text((70, analysis_y + 75), "• A Şıkkı: \"zihinsel sınırları genişleterek...\" ➔ Metinde var ✓", font=font_analysis_body, fill=(52, 211, 153))
            draw.text((70, analysis_y + 115), "• B Şıkkı: \"karmaşık problemleri farklı açılardan değerlendirme...\" ➔ Metinde var ✓", font=font_analysis_body, fill=(52, 211, 153))
            draw.text((70, analysis_y + 155), "• C & E Şıkları: \"duygusal zekayı besleme & yeni bilgiler sunma\" ➔ Metinde var ✓", font=font_analysis_body, fill=(52, 211, 153))
        else: # phase 3
            draw.rounded_rectangle([60, analysis_y + 20, W - 60, analysis_y + 490], radius=14, fill=(153, 27, 27), outline=(239, 68, 68), width=2)
            draw.text((90, analysis_y + 40), "🎉 DOĞRU CEVAP: D ŞIKKI (Bulunamaz)", font=font_analysis_title, fill=(255, 255, 255))
            draw.text((90, analysis_y + 90), "Gerekçe: Metinde okuma alışkanlığının 'yalnızca genç yaşlarda kazanıldığında kalıcı etki bıraktığına'", font=font_analysis_body, fill=(254, 202, 202))
            draw.text((90, analysis_y + 130), "dair hiçbir yaş sınırlaması yer almamaktadır. Dolayısıyla D seçeneği parçadan çıkarılamaz.", font=font_analysis_body, fill=(254, 202, 202))

        # --- PROGRESS BAR AT BOTTOM ---
        prog_pct = (frame_idx + 1) / total_frames
        draw.rectangle([0, H - 12, W, H], fill=(30, 41, 59))
        draw.rectangle([0, H - 12, int(W * prog_pct), H], fill=(236, 72, 153))
        
        frame_filename = frames_dir / f"frame_{frame_idx:05d}.png"
        bg.save(frame_filename)
        
        if (frame_idx + 1) % 150 == 0 or frame_idx == total_frames - 1:
            print(f"  Frame {frame_idx + 1}/{total_frames} ({int(prog_pct * 100)}%) rendered")

    # Concatenate Audio
    concat_txt = temp_dir / "concat_para.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for af in audio_files:
            f.write(f"file '{af.name}'\n")
            
    full_audio = temp_dir / "full_para.mp3"
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_txt), "-c", "copy", str(full_audio)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Output MP4
    output_mp4 = PUBLIC_VIDEOS_DIR / "q-tr-para-1_solution.mp4"
    print(f"🎬 Stitching Turkish paragraph video into MP4: {output_mp4}")
    
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
    
    print(f"✅ Turkish paragraph solution video created at: {output_mp4}")

async def main():
    insert_paragraph_question_to_db()
    
    q_id = "q-tr-para-1"
    temp_dir = PROJECT_DIR / "scratch" / f"para_{q_id}"
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    print("🎙️ Generating Turkish speech for paragraph question...")
    audio_files = await generate_speech_narration(temp_dir)
    render_paragraph_video_frames(temp_dir, audio_files)
    print("🎉 Turkish paragraph video complete!")

if __name__ == "__main__":
    asyncio.run(main())
