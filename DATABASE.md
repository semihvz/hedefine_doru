# AuthCore & Quiz System — Veritabanı Şeması ve Veri Mimarisi Dokümanı

Bu doküman, sistemde kullanılan **SQLite** veritabanının yapısını, veritabanı ayarlarını, tablo şemalarını, ilişkilerini (ER Diyagramı) ve örnek SQL sorgularını detaylı olarak açıklamaktadır.

---

## 🗄️ 1. Veritabanı Motoru ve Genel Ayarlar

* **Veritabanı Motoru**: SQLite 3 (`better-sqlite3` Node.js sürücüsü)
* **Veritabanı Dosyası**: `database.sqlite` (Proje kök dizini)
* **Günlükleme Modu (Journal Mode)**: `WAL` (Write-Ahead Logging) — Yüksek eşzamanlı okuma/yazma performansı sağlar.
* **İlişkisel Bütünlük (Foreign Keys)**: `PRAGMA foreign_keys = ON;` — İlişkili tablolar arasında bütünlüğü korur (`ON DELETE CASCADE`).

---

## 📐 2. Veritabanı Varlık-İlişki Diyagramı (ER Diagram)

```mermaid
erDiagram
    users ||--o{ refresh_tokens : "sahiptir (1:N)"
    users ||--o{ password_resets : "talep eder (1:N)"
    users ||--o{ audit_logs : "üretir (1:N)"
    users ||--o{ user_quiz_attempts : "çözer (1:N)"
    
    quizzes ||--o{ questions : "içerir (1:N)"
    quizzes ||--o{ user_quiz_attempts : "ait (1:N)"
    
    questions ||--o{ question_options : "şıklara sahiptir (1:N)"
    
    user_quiz_attempts ||--o{ user_answers : "detaylandırır (1:N)"
    questions ||--o{ user_answers : "yanıtlanır (1:N)"

    users {
        string id PK "UUID"
        string email UK "Benzersiz E-posta"
        string password_hash "Bcrypt Salted Hash"
        string full_name "Ad Soyad"
        string role "ADMIN | USER"
        integer is_active "1: Aktif, 0: Pasif"
        integer email_verified "1: Doğrulandı, 0: Değil"
        datetime created_at
        datetime updated_at
    }

    refresh_tokens {
        string id PK
        string user_id FK
        string token_hash "JWT Refresh Token"
        datetime expires_at "Geçerlilik (7 gün)"
        integer is_revoked "1: İptal edildi"
        string user_agent
        string ip_address
        datetime created_at
    }

    password_resets {
        string id PK
        string user_id FK
        string token_hash
        datetime expires_at "Geçerlilik (15 dk)"
        integer is_used
        datetime created_at
    }

    audit_logs {
        string id PK
        string user_id FK
        string event "Eylem İsmi"
        string details
        string ip_address
        string user_agent
        datetime created_at
    }

    quizzes {
        string id PK
        string title "Test / Kategori Adı"
        string category "Kategori (Matematik, Yazılım vb.)"
        string description
        datetime created_at
    }

    questions {
        string id PK
        string quiz_id FK
        integer question_number "Soru Numarası (1, 2, 3...)"
        string question_text "Soru Metni (Markdown / KaTeX)"
        string explanation "Adım Adım Çözüm Açıklaması"
        string topic_summary "Konu Anlatımı & Teorik Özet"
        integer points "Soru Puanı (Ör. 10)"
        datetime created_at
    }

    question_options {
        string id PK
        string question_id FK
        string option_key "Şık Anahtarı ('A', 'B', 'C', 'D', 'E')"
        string option_text "Şık Metni"
        integer is_correct "1: Doğru Cevap, 0: Yanlış Şık"
    }

    user_quiz_attempts {
        string id PK
        string user_id FK
        string quiz_id FK
        integer score "Kazanılan Toplam Puan"
        integer total_questions "Toplam Soru Sayısı"
        integer correct_count "Doğru Sayısı"
        integer wrong_count "Yanlış Sayısı"
        integer duration_seconds "Geçen Süre (Saniye)"
        datetime completed_at
    }

    user_answers {
        string id PK
        string attempt_id FK
        string user_id FK
        string question_id FK
        string selected_option "Seçilen Şık ('A'-'E')"
        integer is_correct "1: Doğru, 0: Yanlış"
        datetime answered_at
    }
```

---

## 📋 3. Tablo Şemaları ve Veri Tipleri (Table Specifications)

### 1. `users` (Kullanıcı Hesapları)
| Sütun | Veri Tipi | Kısıtlama | Açıklama |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Benzersiz Kullanıcı Kimliği |
| `email` | `TEXT` | `UNIQUE NOT NULL` | E-Posta Adresi |
| `password_hash` | `TEXT` | `NOT NULL` | Bcrypt ile Hashlenmiş Parola |
| `full_name` | `TEXT` | `NOT NULL` | Kullanıcı Adı Soyadı |
| `role` | `TEXT` | `DEFAULT 'USER'` | Kullanıcı Rolü (`ADMIN` / `USER`) |
| `is_active` | `INTEGER` | `DEFAULT 1` | Hesap Durumu (`1`: Aktif, `0`: Dondurulmuş) |
| `email_verified`| `INTEGER` | `DEFAULT 0` | E-posta Doğrulama Durumu |
| `created_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Hesap Oluşturulma Zamanı |
| `updated_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Son Güncellenme Zamanı |

### 2. `refresh_tokens` (Aktif Cihaz & JWT Oturumları)
| Sütun | Veri Tipi | Kısıtlama | Açıklama |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Jeton Kayıt ID |
| `user_id` | `TEXT` | `FOREIGN KEY (users.id) ON DELETE CASCADE` | İlgili Kullanıcı |
| `token_hash` | `TEXT` | `NOT NULL` | JWT Refresh Token Değeri |
| `expires_at` | `DATETIME` | `NOT NULL` | Son Geçerlilik Zamanı (7 Gün) |
| `is_revoked` | `INTEGER` | `DEFAULT 0` | Oturum İptal Durumu (`1`: Sonlandırıldı) |
| `user_agent` | `TEXT` | | Tarayıcı ve Cihaz Bilgisi |
| `ip_address` | `TEXT` | | İstemci IP Adresi |

### 3. `quizzes` (Soru Bankası Kategorileri)
| Sütun | Veri Tipi | Kısıtlama | Açıklama |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Test ID |
| `title` | `TEXT` | `NOT NULL` | Test Başlığı (Örn: Logaritma Soru Bankası) |
| `category` | `TEXT` | `NOT NULL` | Kategori (Örn: Matematik, Yazılım) |
| `description` | `TEXT` | | Test Açıklaması |

### 4. `questions` (Sorular, Soru Numaraları, Çözümler ve Konu Anlatımı)
| Sütun | Veri Tipi | Kısıtlama | Açıklama |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Soru ID |
| `quiz_id` | `TEXT` | `FOREIGN KEY (quizzes.id) ON DELETE CASCADE` | Bağlı Olduğu Test |
| `question_number`| `INTEGER`| `NOT NULL` | **Soru Numarası (1, 2, 3...)** |
| `question_text` | `TEXT` | `NOT NULL` | **Soru Metni (KaTeX / Markdown)** |
| `explanation` | `TEXT` | | **Soru Çözüm ve Adım Adım Açıklaması** |
| `topic_summary` | `TEXT` | | **Konu Anlatımı, Formüller ve Teorik Özet** |
| `points` | `INTEGER`| `DEFAULT 10` | Soru Puan Değeri |

### 5. `question_options` (Soru Şıkları: A, B, C, D, E)
| Sütun | Veri Tipi | Kısıtlama | Açıklama |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Şık ID |
| `question_id` | `TEXT` | `FOREIGN KEY (questions.id) ON DELETE CASCADE` | İlgili Soru ID |
| `option_key` | `TEXT` | `NOT NULL` | **Şık Anahtarı (`'A'`, `'B'`, `'C'`, `'D'`, `'E'`)** |
| `option_text` | `TEXT` | `NOT NULL` | **Şık Metni** |
| `is_correct` | `INTEGER` | `DEFAULT 0` | **`1`: Doğru Cevap, `0`: Yanlış Şık** |

### 6. `user_quiz_attempts` (Test Çözme Performans Kayıtları)
| Sütun | Veri Tipi | Kısıtlama | Açıklama |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Deneme Kayıt ID |
| `user_id` | `TEXT` | `FOREIGN KEY (users.id) ON DELETE CASCADE` | Çözen Kullanıcı |
| `quiz_id` | `TEXT` | `FOREIGN KEY (quizzes.id) ON DELETE CASCADE` | Çözülen Test |
| `score` | `INTEGER` | `NOT NULL DEFAULT 0` | Kazanılan Toplam Puan |
| `total_questions`| `INTEGER`| `NOT NULL` | Toplam Soru Sayısı |
| `correct_count` | `INTEGER` | `DEFAULT 0` | Doğru Sayısı |
| `wrong_count` | `INTEGER` | `DEFAULT 0` | Yanlış Sayısı |
| `duration_seconds`|`INTEGER`| `DEFAULT 0` | Testte Harcanan Süre (Saniye) |
| `completed_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Tamamlanma Zamanı |

---

## 🔍 4. Örnek SQL Sorguları (Sample Queries)

### 1. Bir Testin Sorularını, Soru Numarasını ve A-E Şıklarını Getirme
```sql
SELECT 
    q.id AS question_id,
    q.question_number,
    q.question_text,
    q.explanation,
    qo.option_key,
    qo.option_text,
    qo.is_correct
FROM questions q
JOIN question_options qo ON q.id = qo.question_id
WHERE q.quiz_id = 'quiz-math-01'
ORDER BY q.question_number ASC, qo.option_key ASC;
```

### 2. Bir Kullanıcının Çözdüğü Testlerin Skor ve Başarı Geçmişi
```sql
SELECT 
    a.id AS attempt_id,
    qz.title AS quiz_title,
    a.score,
    a.correct_count,
    a.wrong_count,
    a.duration_seconds,
    a.completed_at
FROM user_quiz_attempts a
JOIN quizzes qz ON a.quiz_id = qz.id
WHERE a.user_id = 'user-demo-01'
ORDER BY a.completed_at DESC;
```

---

## 🛡️ 5. Güvenlik ve Veri Bütünlüğü Kriterleri

1. **SQL Injection Koruması**: Tüm veritabanı işlemlerinde `better-sqlite3` hazırlıklı sorguları (Prepared Statements) kullanılarak parametreler ayrıştırılır.
2. **Cascading Delete (Otomatik Temizleme)**: Bir test veya soru silindiğinde ona ait tüm şıklar (`question_options`) ve yanıtlar veritabanı seviyesinde otomatik olarak temizlenir.
