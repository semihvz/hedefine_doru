import { Router, Response } from 'express';
import crypto from 'crypto';
import db from '../db.js';
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  logAuditEvent
} from '../auth.js';
import { authenticateToken, AuthenticatedRequest, rateLimiter } from '../middleware.js';

const router = Router();

// 1. REGISTER
router.post('/register', rateLimiter(15), (req, res) => {
  const { email, password, full_name, role } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({ success: false, error: 'Lütfen e-posta, ad soyad ve şifre alanlarını doldurun.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, error: 'Şifreniz en az 8 karakter olmalıdır.' });
  }

  // Check email uniqueness
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existingUser) {
    return res.status(400).json({ success: false, error: 'Bu e-posta adresi ile zaten kayıtlı bir hesap var.' });
  }

  const userId = 'user-' + crypto.randomUUID();
  const passwordHash = hashPassword(password);
  const assignedRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

  db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, is_active, email_verified)
    VALUES (?, ?, ?, ?, ?, 1, 1)
  `).run(userId, email.toLowerCase().trim(), passwordHash, full_name.trim(), assignedRole);

  logAuditEvent(userId, 'REGISTER_SUCCESS', `Yeni kayıt: ${email} (${assignedRole})`, req.ip, req.get('User-Agent'));

  // Auto login payload
  const tokenPayload = { userId, email: email.toLowerCase().trim(), role: assignedRole };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Store refresh token in DB
  const tokenId = 'rt-' + crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare(`
    INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, user_agent, ip_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(tokenId, userId, refreshToken, expiresAt, req.get('User-Agent') || 'Unknown', req.ip || 'Unknown');

  // Set HTTP-Only Cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.status(201).json({
    success: true,
    message: 'Kayıt başarıyla oluşturuldu!',
    accessToken,
    user: {
      id: userId,
      email: email.toLowerCase().trim(),
      full_name: full_name.trim(),
      role: assignedRole
    }
  });
});

// 2. LOGIN
router.post('/login', rateLimiter(10), (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'E-posta ve şifre zorunludur.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim()) as any;

  if (!user) {
    logAuditEvent(null, 'LOGIN_FAILED', `Bilinmeyen e-posta denemesi: ${email}`, req.ip, req.get('User-Agent'));
    return res.status(401).json({ success: false, error: 'E-posta adresi veya şifre hatalı.' });
  }

  if (!user.is_active) {
    logAuditEvent(user.id, 'LOGIN_BLOCKED', 'Pasif hesapla giriş denemesi', req.ip, req.get('User-Agent'));
    return res.status(403).json({ success: false, error: 'Hesabınız dondurulmuştur. Lütfen sistem yöneticisi ile iletişime geçin.' });
  }

  const isPasswordValid = verifyPassword(password, user.password_hash);
  if (!isPasswordValid) {
    logAuditEvent(user.id, 'LOGIN_FAILED', 'Hatalı şifre denemesi', req.ip, req.get('User-Agent'));
    return res.status(401).json({ success: false, error: 'E-posta adresi veya şifre hatalı.' });
  }

  // Create JWTs
  const tokenPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Save Refresh Token to DB
  const tokenId = 'rt-' + crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare(`
    INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, user_agent, ip_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(tokenId, user.id, refreshToken, expiresAt, req.get('User-Agent') || 'Unknown', req.ip || 'Unknown');

  logAuditEvent(user.id, 'LOGIN_SUCCESS', 'Başarılı kullanıcı girişi', req.ip, req.get('User-Agent'));

  // Cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.json({
    success: true,
    message: 'Giriş başarılı!',
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      created_at: user.created_at
    }
  });
});

// 3. LOGOUT
router.post('/logout', (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (refreshToken) {
    try {
      db.prepare('UPDATE refresh_tokens SET is_revoked = 1 WHERE token_hash = ?').run(refreshToken);
    } catch (e) {
      console.error('Logout revocation error:', e);
    }
  }

  res.clearCookie('refreshToken');
  return res.json({ success: true, message: 'Oturum kapatıldı.' });
});

// 4. REFRESH TOKEN
router.post('/refresh-token', (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ success: false, error: 'Refresh token bulunamadı.' });
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return res.status(403).json({ success: false, error: 'Yenileme jetonunun süresi dolmuş.' });
  }

  // Check DB for revocation
  const dbToken = db.prepare(`
    SELECT * FROM refresh_tokens 
    WHERE token_hash = ? AND is_revoked = 0 AND datetime(expires_at) > datetime('now')
  `).get(refreshToken) as any;

  if (!dbToken) {
    return res.status(403).json({ success: false, error: 'Oturum iptal edilmiş veya süresi geçmiş.' });
  }

  // Generate new Access Token
  const newPayload = { userId: payload.userId, email: payload.email, role: payload.role };
  const newAccessToken = generateAccessToken(newPayload);

  return res.json({
    success: true,
    accessToken: newAccessToken
  });
});

// 5. GET CURRENT USER (ME)
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = db.prepare('SELECT id, email, full_name, role, is_active, created_at FROM users WHERE id = ?').get(req.user!.userId) as any;

  if (!user) {
    return res.status(404).json({ success: false, error: 'Kullanıcı bulunamadı.' });
  }

  return res.json({ success: true, user });
});

// 6. UPDATE PROFILE & PASSWORD
router.put('/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { full_name, current_password, new_password } = req.body;
  const userId = req.user!.userId;

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
  if (!user) {
    return res.status(404).json({ success: false, error: 'Kullanıcı bulunamadı.' });
  }

  let updatedName = user.full_name;
  if (full_name && full_name.trim().length > 0) {
    updatedName = full_name.trim();
  }

  if (new_password) {
    if (!current_password || !verifyPassword(current_password, user.password_hash)) {
      return res.status(400).json({ success: false, error: 'Mevcut şifrenizi yanlış girdiniz.' });
    }
    if (new_password.length < 8) {
      return res.status(400).json({ success: false, error: 'Yeni şifreniz en az 8 karakter olmalıdır.' });
    }

    const newHash = hashPassword(new_password);
    db.prepare('UPDATE users SET full_name = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(updatedName, newHash, userId);
    logAuditEvent(userId, 'PASSWORD_CHANGE', 'Şifre başarıyla değiştirildi', req.ip, req.get('User-Agent'));
  } else {
    db.prepare('UPDATE users SET full_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(updatedName, userId);
    logAuditEvent(userId, 'PROFILE_UPDATE', `Ad Soyad güncellendi: ${updatedName}`, req.ip, req.get('User-Agent'));
  }

  return res.json({
    success: true,
    message: 'Profiliniz başarıyla güncellendi.',
    user: {
      id: user.id,
      email: user.email,
      full_name: updatedName,
      role: user.role
    }
  });
});

// 7. FORGOT PASSWORD (Generate Reset Token)
router.post('/forgot-password', rateLimiter(5), (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Lütfen e-posta adresinizi girin.' });
  }

  const user = db.prepare('SELECT id, email FROM users WHERE email = ?').get(email.toLowerCase().trim()) as any;

  if (!user) {
    // For security reasons, don't leak user existence
    return res.json({
      success: true,
      message: 'Eğer e-posta adresi kayıtlı ise, şifre sıfırlama bağlantısı / jetonu oluşturuldu.'
    });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetId = 'reset-' + crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

  db.prepare(`
    INSERT INTO password_resets (id, user_id, token_hash, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(resetId, user.id, resetToken, expiresAt);

  logAuditEvent(user.id, 'FORGOT_PASSWORD_REQUEST', 'Şifre sıfırlama talebi gönderildi', req.ip, req.get('User-Agent'));

  return res.json({
    success: true,
    message: 'Şifre sıfırlama jetonu üretildi.',
    demoResetToken: resetToken // Returned for testing purposes in demo environment!
  });
});

// 8. RESET PASSWORD
router.post('/reset-password', rateLimiter(5), (req, res) => {
  const { token, new_password } = req.body;

  if (!token || !new_password) {
    return res.status(400).json({ success: false, error: 'Sıfırlama jetonu ve yeni şifre gereklidir.' });
  }

  if (new_password.length < 8) {
    return res.status(400).json({ success: false, error: 'Yeni şifreniz en az 8 karakter olmalıdır.' });
  }

  const resetRecord = db.prepare(`
    SELECT * FROM password_resets 
    WHERE token_hash = ? AND is_used = 0 AND datetime(expires_at) > datetime('now')
  `).get(token) as any;

  if (!resetRecord) {
    return res.status(400).json({ success: false, error: 'Şifre sıfırlama jetonu geçersiz veya süresi dolmuş.' });
  }

  const newHash = hashPassword(new_password);

  // Update password & mark token as used
  db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newHash, resetRecord.user_id);
  db.prepare('UPDATE password_resets SET is_used = 1 WHERE id = ?').run(resetRecord.id);

  // Revoke all existing refresh tokens for security
  db.prepare('UPDATE refresh_tokens SET is_revoked = 1 WHERE user_id = ?').run(resetRecord.user_id);

  logAuditEvent(resetRecord.user_id, 'PASSWORD_RESET_SUCCESS', 'Şifre jeton ile başarıyla sıfırlandı', req.ip, req.get('User-Agent'));

  return res.json({
    success: true,
    message: 'Şifreniz başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz.'
  });
});

// 9. ACTIVE SESSIONS LIST FOR CURRENT USER
router.get('/sessions', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const sessions = db.prepare(`
    SELECT id, user_agent, ip_address, created_at, expires_at, is_revoked
    FROM refresh_tokens
    WHERE user_id = ? AND is_revoked = 0 AND datetime(expires_at) > datetime('now')
    ORDER BY created_at DESC
  `).all(userId);

  return res.json({ success: true, sessions });
});

// 10. REVOKE SPECIFIC SESSION
router.post('/revoke-session', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { sessionId } = req.body;
  const userId = req.user!.userId;

  if (!sessionId) {
    return res.status(400).json({ success: false, error: 'Oturum kimliği gereklidir.' });
  }

  db.prepare('UPDATE refresh_tokens SET is_revoked = 1 WHERE id = ? AND user_id = ?').run(sessionId, userId);
  logAuditEvent(userId, 'SESSION_REVOKED', `Oturum sonlandırıldı (${sessionId})`, req.ip, req.get('User-Agent'));

  return res.json({ success: true, message: 'Oturum sonlandırıldı.' });
});

export default router;
