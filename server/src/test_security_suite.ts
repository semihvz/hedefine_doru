import express from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import db, { initDatabase } from './db.js';
import { hashPassword, verifyPassword, generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken } from './auth.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

interface TestResult {
  category: string;
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function record(category: string, name: string, passed: boolean, details?: string) {
  results.push({ category, name, passed, details });
  const icon = passed ? '✅ [PASS]' : '❌ [FAIL]';
  console.log(`  ${icon} [${category}] ${name}${details ? ` - ${details}` : ''}`);
}

async function runComprehensiveSecuritySuite() {
  console.log('================================================================');
  console.log('🛡️  AUTHCORE KAPSAMLI GÜVENLİK VE DOĞRULAMA TEST SÜİTİ');
  console.log('================================================================\n');

  // Initialize DB
  initDatabase();

  // ----------------------------------------------------------------
  // KATEGORİ 1: ŞİFRELEME VE KRİPTOGRAFİK GÜVENLİK (CRYPTOGRAPHY)
  // ----------------------------------------------------------------
  console.log('📋 [1/5] Şifreleme ve Kriptografik Güvenlik Testleri');
  
  const rawPass = 'ComplexPassword123!#';
  const hashedPass = hashPassword(rawPass);
  
  record('Cryptographic', 'Düz Metin Şifre Saklama Engeli', hashedPass !== rawPass);
  record('Cryptographic', 'bcrypt Salt & Hash Formatı ($2a/$2b)', hashedPass.startsWith('$2a$') || hashedPass.startsWith('$2b$'));
  record('Cryptographic', 'Geçerli Parola Doğrulama', verifyPassword(rawPass, hashedPass));
  record('Cryptographic', 'Hatalı Parola Reddi', !verifyPassword('WrongPass123!', hashedPass));
  record('Cryptographic', 'Büyük/Küçük Harf Duyarlılığı', !verifyPassword(rawPass.toLowerCase(), hashedPass));

  // ----------------------------------------------------------------
  // KATEGORİ 2: JWT VE OTURUM JETONU GÜVENLİĞİ (TOKEN SECURITY)
  // ----------------------------------------------------------------
  console.log('\n📋 [2/5] JWT ve Oturum Jetonu Güvenlik Testleri');

  const userPayload = { userId: 'test-user-id', email: 'user@test.local', role: 'USER' };
  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  const decodedAccess = verifyAccessToken(accessToken);
  const decodedRefresh = verifyRefreshToken(refreshToken);

  record('Token Security', 'Access Token Üretim ve İmza Doğrulanması', decodedAccess !== null && decodedAccess.userId === userPayload.userId);
  record('Token Security', 'Refresh Token Üretim ve İmza Doğrulanması', decodedRefresh !== null && decodedRefresh.userId === userPayload.userId);
  
  // Sahte imza testi
  const tamperedToken = accessToken.slice(0, -6) + 'abcdef';
  record('Token Security', 'Manipüle Edilmiş (Tampered) JWT Reddi', verifyAccessToken(tamperedToken) === null);

  // Boş / Geçersiz Token testi
  record('Token Security', 'Boş / Format Hatalı Token Reddi', verifyAccessToken('invalid.token.str') === null);

  // ----------------------------------------------------------------
  // KATEGORİ 3: VERİTABANI VE İNJEKSİYON KORUMASI (SQL INJECTION)
  // ----------------------------------------------------------------
  console.log('\n📋 [3/5] Veritabanı ve SQL Injeksiyon Koruması Testleri');

  const sqliPayloads = [
    "' OR '1'='1",
    "admin' --",
    "' UNION SELECT null, null, null --",
    "'; DROP TABLE users; --"
  ];

  let sqliProtected = true;
  for (const payload of sqliPayloads) {
    try {
      const res = db.prepare('SELECT * FROM users WHERE email = ?').get(payload);
      if (res !== undefined) {
        sqliProtected = false;
      }
    } catch (e) {
      // Prepared statement error handled safely
    }
  }
  record('SQLi Defense', 'Parametreli Sorgu SQL Injeksiyon Koruması', sqliProtected);

  // Database WAL Mode Check
  const pragmaJournal = db.prepare('PRAGMA journal_mode').get() as any;
  record('DB Integrity', 'SQLite Write-Ahead Logging (WAL) Aktifliği', pragmaJournal.journal_mode === 'wal');

  // Foreign Keys Check
  const pragmaFK = db.prepare('PRAGMA foreign_keys').get() as any;
  record('DB Integrity', 'SQLite Foreign Key Kısıtlamaları Aktifliği', pragmaFK.foreign_keys === 1);

  // ----------------------------------------------------------------
  // KATEGORİ 4: API HTTP ENTEGRASYON VE RBAC TESTLERİ (HTTP INTEGRATION)
  // ----------------------------------------------------------------
  console.log('\n📋 [4/5] API Uç Nokta ve RBAC Yetkilendirme Testleri');

  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as any;
  const baseUrl = `http://localhost:${address.port}`;

  try {
    // 4.1 Login Valid User
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', password: 'User123!' })
    });
    const loginData = await loginRes.json();
    record('HTTP API', 'Geçerli Kullanıcı Girişi (200 OK)', loginRes.status === 200 && loginData.success === true);

    const userAccessToken = loginData.accessToken;

    // 4.2 Login Invalid Password
    const badLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', password: 'WrongPassword!' })
    });
    record('HTTP API', 'Hatalı Şifre İle Giriş Engeli (401 Unauthorized)', badLoginRes.status === 401);

    // 4.3 USER Role trying to access ADMIN endpoint
    const rbacRes = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${userAccessToken}` }
    });
    record('RBAC Defense', 'USER Rolünün Admin Uç Noktasına Erişimi Engeli (403 Forbidden)', rbacRes.status === 403);

    // 4.4 Admin Login & Admin Endpoint Access
    const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'Admin123!' })
    });
    const adminLoginData = await adminLoginRes.json();
    const adminAccessToken = adminLoginData.accessToken;

    const adminUsersRes = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${adminAccessToken}` }
    });
    const adminUsersData = await adminUsersRes.json();
    record('RBAC Access', 'ADMIN Rolünün Yetkili Uç Noktaya Erişimi (200 OK)', adminUsersRes.status === 200 && adminUsersData.success === true);

    // 4.5 Audit Trail Verification
    const auditRes = await fetch(`${baseUrl}/api/admin/audit-logs`, {
      headers: { 'Authorization': `Bearer ${adminAccessToken}` }
    });
    const auditData = await auditRes.json();
    record('Audit Trail', 'Güvenlik Denetim Kayıtlarının Oluşturulması ve Listelenmesi', auditRes.status === 200 && Array.isArray(auditData.logs) && auditData.logs.length > 0);

  } finally {
    server.close();
  }

  // ----------------------------------------------------------------
  // KATEGORİ 5: BRUTE-FORCE RATE LIMITING TESTİ
  // ----------------------------------------------------------------
  console.log('\n📋 [5/5] Brute-Force ve Rate Limiting Koruması Testleri');

  const appRateLimit = express();
  appRateLimit.use(express.json());
  appRateLimit.use('/api/auth', authRoutes);

  const serverRL = http.createServer(appRateLimit);
  await new Promise<void>((resolve) => serverRL.listen(0, resolve));
  const addressRL = serverRL.address() as any;
  const baseUrlRL = `http://localhost:${addressRL.port}`;

  try {
    let rateLimited = false;
    // Attempt 16 consecutive register/login requests to trigger limit (max 10 allowed)
    for (let i = 0; i < 16; i++) {
      const res = await fetch(`${baseUrlRL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `testlimit${i}@example.com`, password: 'somepassword' })
      });
      if (res.status === 429) {
        rateLimited = true;
        break;
      }
    }
    record('Rate Limiting', 'Arka Arkaya Çok Sayıda İstekte Brute-Force Engeli (429 Too Many Requests)', rateLimited);
  } finally {
    serverRL.close();
  }

  // ----------------------------------------------------------------
  // ÖZET VE RAPORLAMA
  // ----------------------------------------------------------------
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log('\n================================================================');
  console.log(`📊 GÜVENLİK TESTİ RUPOR ÖZETİ: ${passed}/${total} BAŞARILI (%${Math.round((passed/total)*100)})`);
  console.log('================================================================');

  if (failed > 0) {
    console.log(`⚠️  ${failed} adet test başarısız oldu! Lütfen yukarıdaki detayları inceleyin.`);
    process.exit(1);
  } else {
    console.log('🎉 Tüm güvenlik, doğrulama ve yetkilendirme kontrolleri başarıyla tamamlandı!');
  }
}

runComprehensiveSecuritySuite().catch((err) => {
  console.error('Test yürütme hatası:', err);
  process.exit(1);
});
