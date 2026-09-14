import Database from 'better-sqlite3';
import path from 'path';
import { LOGARITHM_100_QUESTIONS } from '../../src/services/logarithm100QuestionsData';

export function seed100LogarithmQuestions() {
  const dbPath = path.resolve(process.cwd(), 'database.sqlite');
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  console.log('🔄 Seeding 100 Logarithm Questions into database...');

  // Ensure main quiz exists
  const quizId = 'quiz-log-100';
  const existingQuiz = db.prepare('SELECT id FROM quizzes WHERE id = ?').get(quizId);
  
  if (!existingQuiz) {
    db.prepare(`
      INSERT INTO quizzes (id, title, category, description)
      VALUES (?, ?, ?, ?)
    `).run(
      quizId,
      'YKS AYT Matematik - 100 Özel Logaritma Soru Bankası',
      'Matematik',
      'YKS 100 Soru Bankasının Tamamı! Tüm sorular için adım adım detaylı çözümler ve kapsamlı logaritma konu anlatımı & özetleri.'
    );
  }

  // Clear existing questions for quiz-log-100 to re-seed cleanly
  db.prepare('DELETE FROM questions WHERE quiz_id = ?').run(quizId);

  const insertQuestionStmt = db.prepare(`
    INSERT INTO questions (id, quiz_id, question_number, question_text, explanation, topic_summary, points)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOptionStmt = db.prepare(`
    INSERT INTO question_options (id, question_id, option_key, option_text, is_correct)
    VALUES (?, ?, ?, ?, ?)
  `);

  let count = 0;

  for (let i = 0; i < LOGARITHM_100_QUESTIONS.length; i++) {
    const q = LOGARITHM_100_QUESTIONS[i];
    const qId = `q-log100-${i + 1}`;
    const qNum = i + 1;

    // Format step-by-step stage solution explanation (Aşama 1, Aşama 2, Aşama 3)
    let rawSolution = '';
    let keyTakeaway = '';

    if (typeof q.explanation === 'string') {
      rawSolution = q.explanation;
    } else if (q.explanation && typeof q.explanation === 'object') {
      rawSolution = q.explanation.whyCorrect || '';
      keyTakeaway = q.explanation.keyTakeaway || '';
    }

    let correctOptText = '';
    if (q.options && Array.isArray(q.options)) {
      const correctOpt = q.options.find((o: any) => o.isCorrect === true || o.is_correct === 1 || o.id === q.correctOptionId);
      if (correctOpt) {
        const key = (correctOpt.id || correctOpt.option_key || '').toUpperCase();
        const txt = correctOpt.text || correctOpt.option_text || '';
        correctOptText = ` (${key} şıkkı: "${txt}")`;
      }
    }

    const explanationText = `💡 ADIM ADIM AŞAMALI ÇÖZÜM:\n\n` +
      `📌 AŞAMA 1 (Verilen İfadeyi ve Logaritma Kuralını Analiz Etme):\n` +
      `Sorudaki verilen matematiksel ifade incelenir ve ilgili logaritma tanımı / kuralı (taban kuralı, üs kuralı veya faktöriyel bağıntısı) belirlenir.\n\n` +
      `📌 AŞAMA 2 (Matematiksel İşlem ve Denklem Adımları):\n` +
      `${rawSolution}\n\n` +
      `📌 AŞAMA 3 (Sonucun Elde Edilmesi ve Doğru Şıkkın Tespiti):\n` +
      `Yapılan işlem adımları sonucunda doğru cevaba ulaşılır${correctOptText}.` +
      (keyTakeaway ? `\n\n🔑 ÖNEMLİ İPUCU & ÇÖZÜM STRATEJİSİ: ${keyTakeaway}` : '');

    // Format full master topic summary & theory explanation handbook
    let topicSummaryText = '';
    const specificSummary = (q.explanation && typeof q.explanation === 'object' && q.explanation.topicSummary)
      ? q.explanation.topicSummary
      : 'Logaritma fonksiyonu, üslü fonksiyonların tersidir.';

    topicSummaryText = `📖 SORU ÖZEL KONU NOTU:\n${specificSummary}\n\n` +
      `📚 TÜM AYT LOGARİTMA KONU ANLATIMI VE TEORİ REHBERİ:\n\n` +
      `1️⃣ LOGARİTMA TANIMI VE ÜSTEL FONKSİYON İLİŞKİSİ:\n` +
      `• Üstel fonksiyon f(x) = a^x (a > 0, a ≠ 1) birebir ve örten olduğundan ters fonksiyonu vardır.\n` +
      `• Üstel fonksiyonun tersine LOGARİTMA FONKSİYONU denir: y = a^x ⟺ x = log_a(y)\n` +
      `• log_a(1) = 0 ve log_a(a) = 1 kuralı geçerlidir.\n\n` +
      `2️⃣ LOGARİTMA FONKSİYONUNUN TANIM KÜMESİ:\n` +
      `log_g(x) [f(x)] ifadesinin tanımlı olabilmesi için 3 şart aynı anda sağlanmalıdır:\n` +
      `  1) f(x) > 0  (İçerideki sayı pozitif olmalı)\n` +
      `  2) g(x) > 0  (Taban pozitif olmalı)\n` +
      `  3) g(x) ≠ 1  (Taban 1'e eşit olamaz)\n\n` +
      `3️⃣ LOGARİTMA KURALLARI VE CEBİRSEL ÖZELLİKLER:\n` +
      `• Çarpım Kuralı: log_a(x · y) = log_a(x) + log_a(y)\n` +
      `• Bölüm Kuralı: log_a(x / y) = log_a(x) - log_a(y)\n` +
      `• Üs Kuralı: log_(a^m)(x^n) = (n / m) · log_a(x)\n` +
      `• Bayağı Logaritma (Taban 10): log_10(x) = log(x)\n` +
      `• Doğal Logaritma (Taban e ≈ 2.718): log_e(x) = ln(x)\n\n` +
      `4️⃣ TABAN DEĞİŞTİRME KURALLARI:\n` +
      `• log_a(b) = log_c(b) / log_c(a) (İstenen c tabanında yazma)\n` +
      `• log_a(b) = 1 / log_b(a) (Taban ile sayının yer değiştirmesi)\n` +
      `• Zincir Kuralı: log_a(b) · log_b(c) · log_c(d) = log_a(d)\n\n` +
      `5️⃣ TABAN VE ÜS YER DEĞİŞTİRME ÖZELLİĞİ:\n` +
      `• a^(log_b c) = c^(log_b a)\n` +
      `• Özel Hal: a^(log_a b) = b\n\n` +
      `6️⃣ LOGARİTMİK DENKLEM VE EŞİTSİZLİKLER:\n` +
      `• log_a f(x) = log_a g(x) ⟺ f(x) = g(x) (Bulunan kökler tanım kümesini sağlamalıdır!)\n` +
      `• log_a f(x) > log_a g(x) eşitsizliğinde:\n` +
      `  - Eğer a > 1 ise yön değişmez: f(x) > g(x) > 0\n` +
      `  - Eğer 0 < a < 1 ise eşitsizlik yön değiştirir: 0 < f(x) < g(x)\n\n` +
      `7️⃣ BASAMAK SAYISI VE GRAFİK:\n` +
      `• log_10(x) değerinin tam kısmı k ise, x sayısı (k + 1) basamaklıdır.\n` +
      `• a > 1 ise log_a(x) artan grafiğe, 0 < a < 1 ise azalan grafiğe sahiptir.`;

    insertQuestionStmt.run(
      qId,
      quizId,
      qNum,
      q.questionText || (q as any).question || '',
      explanationText,
      topicSummaryText,
      10
    );

    // Insert options A, B, C, D, E
    if (q.options && Array.isArray(q.options)) {
      for (const opt of q.options) {
        const optKey = (opt.id || opt.option_key || 'A').toUpperCase();
        const optText = opt.text || opt.option_text || '';
        const isCorrect = opt.isCorrect === true || opt.is_correct === 1 || q.correctOptionId === opt.id ? 1 : 0;
        
        insertOptionStmt.run(
          `opt-log100-${i + 1}-${optKey}`,
          qId,
          optKey,
          optText,
          isCorrect
        );
      }
    }

    count++;
  }

  console.log(`✅ ${count} Logarithm questions seeded into database successfully under ${quizId}!`);
}

// Run seeder directly if executed as standalone script
if (process.argv[1] && process.argv[1].endsWith('seedLog100.ts')) {
  seed100LogarithmQuestions();
}
