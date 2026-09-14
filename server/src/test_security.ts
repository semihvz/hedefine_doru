import db, { initDatabase } from './db.js';
import { hashPassword, verifyPassword, generateAccessToken, verifyAccessToken } from './auth.js';

async function runSecurityTests() {
  console.log('🧪 Güvenlik ve Yetkilendirme Doğrulama Testleri Başlatılıyor...\n');
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ [BAŞARILI] ${testName}`);
      passedCount++;
    } else {
      console.log(`  ❌ [BAŞARISIZ] ${testName}`);
      failedCount++;
    }
  }

  // Veritabanı başlat
  initDatabase();

  // Test 1: Şifre Hashleme ve Doğrulama Kontrolü (bcrypt)
  console.log('1. Şifreleme ve Hash Güvenliği Testleri:');
  const rawPassword = 'SecurePassword123!';
  const hashedPassword = hashPassword(rawPassword);
  
  assert(hashedPassword !== rawPassword, 'Şifre düz metin olarak saklanmıyor (bcrypt hashli)');
  assert(verifyPassword(rawPassword, hashedPassword), 'Geçerli şifre doğru doğrulanıyor');
  assert(!verifyPassword('WrongPassword123!', hashedPassword), 'Hatalı şifre reddediliyor');

  // Test 2: JWT Access Token Üretimi ve Süre/İmza Doğrulaması
  console.log('\n2. JWT Jeton İmzalaması ve Yetkilendirme Testleri:');
  const payload = { userId: 'user-test-01', email: 'test@example.com', role: 'USER' };
  const token = generateAccessToken(payload);
  const decoded = verifyAccessToken(token);

  assert(decoded !== null, 'Üretilen JWT token başarıyla doğrulanıyor');
  assert(decoded?.userId === payload.userId, 'JWT payload verileri doğru okunuyor');
  
  const fakeToken = token.substring(0, token.length - 5) + 'xxxxx';
  assert(verifyAccessToken(fakeToken) === null, 'İmzası değiştirilmiş/sahte JWT token reddediliyor');

  // Test 3: Veritabanı Parametreli Sorgu Koruması (SQL Injection Önleme)
  console.log('\n3. Veritabanı SQL Injection Koruması Testi:');
  const maliciousInput = "' OR '1'='1";
  const userResult = db.prepare('SELECT * FROM users WHERE email = ?').get(maliciousInput);
  assert(userResult === undefined, 'SQL Injection girdisi parametreli sorgu tarafından etkisizleştirildi');

  // Test 4: Kullanıcı Rolü ve İzolasyon Kontrolü
  console.log('\n4. Veritabanı Kullanıcı Rolleri Kontrolü:');
  const adminUser = db.prepare('SELECT role FROM users WHERE email = ?').get('admin@example.com') as any;
  const normalUser = db.prepare('SELECT role FROM users WHERE email = ?').get('user@example.com') as any;

  assert(adminUser?.role === 'ADMIN', 'Admin kullanıcısı ADMIN rolüne sahip');
  assert(normalUser?.role === 'USER', 'Standart kullanıcı USER rolüne sahip');

  // Özet Rapor
  console.log('\n==================================================');
  console.log(`📊 TEST SONUÇLARI: ${passedCount} Başarılı | ${failedCount} Başarısız`);
  console.log('==================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runSecurityTests().catch((err) => {
  console.error('Test sırasında hata oluştu:', err);
  process.exit(1);
});
