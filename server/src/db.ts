import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Performance & Integrity settings
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  // 1. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'USER',
      is_active INTEGER NOT NULL DEFAULT 1,
      email_verified INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Refresh Tokens Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      is_revoked INTEGER NOT NULL DEFAULT 0,
      user_agent TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 3. Password Resets Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      is_used INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 4. Audit Logs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      event TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 5. Quizzes Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 6. Questions Table (Soru Numarası, Soru Metni, Çözüm Açıklaması, Konu Anlatımı)
  db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      question_number INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      explanation TEXT,
      topic_summary TEXT,
      points INTEGER DEFAULT 10,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    )
  `);

  // Automatic Migration for existing DB instances (Add topic_summary column if missing)
  try {
    db.exec(`ALTER TABLE questions ADD COLUMN topic_summary TEXT;`);
    console.log('🔄 Migration: Added topic_summary column to questions table.');
  } catch (e) {
    // Column already exists, safe to ignore
  }

  // 7. Question Options Table (A, B, C, D, E Şıkları & Doğru Cevap)
  db.exec(`
    CREATE TABLE IF NOT EXISTS question_options (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL,
      option_key TEXT NOT NULL, -- 'A', 'B', 'C', 'D', 'E'
      option_text TEXT NOT NULL,
      is_correct INTEGER NOT NULL DEFAULT 0, -- 1: Doğru Cevap, 0: Yanlış
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    )
  `);

  // 8. User Quiz Attempts Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_quiz_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      quiz_id TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      total_questions INTEGER NOT NULL,
      correct_count INTEGER NOT NULL DEFAULT 0,
      wrong_count INTEGER NOT NULL DEFAULT 0,
      duration_seconds INTEGER DEFAULT 0,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    )
  `);

  // 9. User Individual Answers Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_answers (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      selected_option TEXT NOT NULL,
      is_correct INTEGER NOT NULL DEFAULT 0,
      answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (attempt_id) REFERENCES user_quiz_attempts(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    )
  `);

  // Seed default admin and user if users table is empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  
  if (userCount.count === 0) {
    console.log('🌱 Seeding initial demo users...');
    const salt = bcrypt.genSaltSync(10);
    
    // Demo Admin: admin@example.com / Admin123!
    const adminPasswordHash = bcrypt.hashSync('Admin123!', salt);
    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, role, is_active, email_verified)
      VALUES (?, ?, ?, ?, ?, 1, 1)
    `).run('user-admin-01', 'admin@example.com', adminPasswordHash, 'Sistem Yöneticisi', 'ADMIN');

    // Demo User: user@example.com / User123!
    const userPasswordHash = bcrypt.hashSync('User123!', salt);
    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, role, is_active, email_verified)
      VALUES (?, ?, ?, ?, ?, 1, 1)
    `).run('user-demo-01', 'user@example.com', userPasswordHash, 'Ahmet Yılmaz', 'USER');

    console.log('✅ Demo users seeded successfully!');
  }

  // Seed default Quizzes and Questions if empty
  const quizCount = db.prepare('SELECT COUNT(*) as count FROM quizzes').get() as { count: number };
  if (quizCount.count === 0) {
    console.log('🌱 Seeding initial Question Bank & Quizzes with Explanation & Topic Summary...');

    // Quiz 1: Matematik & Logaritma Testi
    const quiz1Id = 'quiz-math-01';
    db.prepare(`
      INSERT INTO quizzes (id, title, category, description)
      VALUES (?, ?, ?, ?)
    `).run(quiz1Id, 'YKS Matematik & Logaritma Soru Bankası', 'Matematik', 'Logaritma özellikleri, denklem çözümleri ve üstel fonksiyonlar konularında soru bankası.');

    // Soru 1
    const q1Id = 'q-math-1';
    db.prepare(`
      INSERT INTO questions (id, quiz_id, question_number, question_text, explanation, topic_summary, points)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      q1Id,
      quiz1Id,
      1,
      '\\(\\log_2(x - 3) = 4\\) denklemini sağlayan x değeri kaçtır?',
      'Logaritma tanımına göre: \\(x - 3 = 2^4 = 16\\), dolayısıyla \\(x = 16 + 3 = 19\\) bulunur.',
      '📌 LOGARİTMA KONU ÖZETİ & TEORİSİ:\nLogaritma, üstel fonksiyonun tersidir. \\(\\log_b(a) = c \\iff b^c = a\\) kuralı geçerlidir. Tanım kümesi gereği taban \\(b > 0\\), \\(b \\neq 1\\) ve içerideki sayı \\(a > 0\\) olmalıdır.',
      10
    );

    db.prepare(`INSERT INTO question_options (id, question_id, option_key, option_text, is_correct) VALUES (?, ?, ?, ?, ?)`).run('opt-1-a', q1Id, 'A', '11', 0);
    db.prepare(`INSERT INTO question_options (id, question_id, option_key, option_text, is_correct) VALUES (?, ?, ?, ?, ?)`).run('opt-1-b', q1Id, 'B', '15', 0);
    db.prepare(`INSERT INTO question_options (id, question_id, option_key, option_text, is_correct) VALUES (?, ?, ?, ?, ?)`).run('opt-1-c', q1Id, 'C', '19', 1);
    db.prepare(`INSERT INTO question_options (id, question_id, option_key, option_text, is_correct) VALUES (?, ?, ?, ?, ?)`).run('opt-1-d', q1Id, 'D', '21', 0);
    db.prepare(`INSERT INTO question_options (id, question_id, option_key, option_text, is_correct) VALUES (?, ?, ?, ?, ?)`).run('opt-1-e', q1Id, 'E', '24', 0);

    // Soru 2
    const q2Id = 'q-math-2';
    db.prepare(`
      INSERT INTO questions (id, quiz_id, question_number, question_text, explanation, topic_summary, points)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      q2Id,
      quiz1Id,
      2,
      '\\(\\log_3(81) + \\log_5(\\sqrt{5})\\) ifadesinin değeri kaçtır?',
      '\\(\\log_3(81) = \\log_3(3^4) = 4\\) ve \\(\\log_5(5^{1/2}) = 1/2\\). Toplam: \\(4 + 0.5 = 4.5\\) (yani 9/2).',
      '📌 ÜS VE LOGARİTMA ÖZELLİKLERİ:\n1. \\(\\log_b(b^k) = k\\)\n2. \\(\\sqrt[n]{a^m} = a^{m/n}\\)\n3. Tabanları aynı olan logaritmalarda katsayılar derece olarak üsse taşınabilir.',
      10
    );

    db.prepare(`INSERT INTO question_options (id, question_id, option_key, option_text, is_correct) VALUES (?, ?, ?, ?, ?)`).run('opt-2-a', q2Id, 'A', '3', 0);
    db.prepare(`INSERT INTO question_options (id, question_id, option_key, option_text, is_correct) VALUES (?, ?, ?, ?, ?)`).run('opt-2-b', q2Id, 'B', '7/2', 0);
    db.prepare(`INSERT INTO question_options (id, question_id, option_key, option_text, is_correct) VALUES (?, ?, ?, ?, ?)`).run('opt-2-c', q2Id, 'C', '4', 0);
    db.prepare(`INSERT INTO question_options (id, question_id, option_key, option_text, is_correct) VALUES (?, ?, ?, ?, ?)`).run('opt-2-d', q2Id, 'D', '9/2', 1);
    db.prepare(`INSERT INTO question_options (id, question_id, option_key, option_text, is_correct) VALUES (?, ?, ?, ?, ?)`).run('opt-2-e', q2Id, 'E', '5', 0);

    // Quiz 2: Yazılım Mimarisi & Siber Güvenlik Testi
    const quiz2Id = 'quiz-cs-01';
    db.prepare(`
      INSERT INTO quizzes (id, title, category, description)
      VALUES (?, ?, ?, ?)
    `).run(quiz2Id, 'Yazılım Mimarisi & Güvenli Kodlama Testi', 'Yazılım Mimarisi', 'REST API, JWT kimlik doğrulama, OWASP ve veritabanı sorgu güvenliği konuları.');

    // Soru 1 (Yazılım)
    const q3Id = 'q-cs-1';
    db.prepare(`
      INSERT INTO questions (id, quiz_id, question_number, question_text, explanation, topic_summary, points)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      q3Id,
      quiz2Id,
      1,
      'JWT (JSON Web Token) mimarisinde Access Token XSS saldırılarından korunmak için nerede tutulmalıdır?',
      'Access Token istemci tarafında LocalStorage veya SessionStorage yerine bellek (React Memory State) içinde tutulmalıdır. Refresh Token ise HttpOnly cookie olarak saklanır.',
      '📌 GÜVENLİ JETON (TOKEN) SAKLAMA PRENSİPLERİ:\nLocalStorage veya SessionStorage üzerindeki verilere XSS (Cross-Site Scripting) zafiyetleri ile JavaScript kodları erişebilir. Access token bellek (state) üzerinde, refresh token ise JS tarafından okunamayan HttpOnly, Secure, SameSite çerezinde saklanmalıdır.',
      10
    );

    db.prepare(`INSERT INTO question_options (id, question_id, option_key, option_text, is_correct) VALUES (?, ?, ?, ?, ?)`).run('opt-3-a', q3Id, 'A', 'localStorage alanında', 0);
    db.prepare(`INSERT INTO question_options (id, question_id, option_key, option_text, is_correct) VALUES (?, ?, ?, ?, ?)`).run('opt-3-b', q3Id, 'B', 'İstemci Belleğinde (Memory State)', 1);
    db.prepare(`INSERT INTO question_options (id, question_id, option_key, option_text, is_correct) VALUES (?, ?, ?, ?, ?)`).run('opt-3-c', q3Id, 'C', 'HTML Meta etiketi içinde', 0);
    db.prepare(`INSERT INTO question_options (id, question_id, option_key, option_text, is_correct) VALUES (?, ?, ?, ?, ?)`).run('opt-3-d', q3Id, 'D', 'URL sorgu parametresinde (?token=...)', 0);
    db.prepare(`INSERT INTO question_options (id, question_id, option_key, option_text, is_correct) VALUES (?, ?, ?, ?, ?)`).run('opt-3-e', q3Id, 'E', 'SessionStorage deposunda', 0);

    console.log('✅ Initial Question Bank & Quizzes seeded successfully!');
  }

  // Ensure 100 Logarithm questions are seeded into database
  try {
    const { seed100LogarithmQuestions } = require('./seedLog100.js');
    seed100LogarithmQuestions();
  } catch (e) {
    // If tsx module resolution differs
  }
}

export default db;
