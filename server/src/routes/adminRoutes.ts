import { Router, Response } from 'express';
import db from '../db.js';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware.js';
import { logAuditEvent } from '../auth.js';

const router = Router();

// Apply auth + ADMIN role check to all endpoints in this router
router.use(authenticateToken, requireRole(['ADMIN']));

// 1. LIST ALL USERS WITH SESSION STATS
router.get('/users', (req: AuthenticatedRequest, res: Response) => {
  const users = db.prepare(`
    SELECT u.id, u.email, u.full_name, u.role, u.is_active, u.email_verified, u.created_at, u.updated_at,
           COUNT(rt.id) as active_sessions_count
    FROM users u
    LEFT JOIN refresh_tokens rt ON u.id = rt.user_id AND rt.is_revoked = 0 AND datetime(rt.expires_at) > datetime('now')
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `).all();

  return res.json({ success: true, users });
});

// 2. REVOKE ALL SESSIONS OF A USER
router.post('/users/:id/revoke', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  db.prepare('UPDATE refresh_tokens SET is_revoked = 1 WHERE user_id = ?').run(id);
  logAuditEvent(req.user!.userId, 'ADMIN_REVOKE_SESSIONS', `Admin, kullanıcı (${id}) oturumlarını kapattı`, req.ip, req.get('User-Agent'));

  return res.json({ success: true, message: 'Kullanıcının tüm aktif oturumları sonlandırıldı.' });
});

// 3. TOGGLE USER ACTIVE / INACTIVE STATUS
router.post('/users/:id/toggle-active', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const user = db.prepare('SELECT id, is_active, role FROM users WHERE id = ?').get(id) as any;
  if (!user) {
    return res.status(404).json({ success: false, error: 'Kullanıcı bulunamadı.' });
  }

  // Prevent admin from deactivating themselves
  if (user.id === req.user!.userId) {
    return res.status(400).json({ success: false, error: 'Kendi admin hesabınızı donduramazsınız.' });
  }

  const newStatus = user.is_active ? 0 : 1;
  db.prepare('UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus, id);

  if (newStatus === 0) {
    // Revoke sessions when deactivated
    db.prepare('UPDATE refresh_tokens SET is_revoked = 1 WHERE user_id = ?').run(id);
  }

  logAuditEvent(req.user!.userId, 'ADMIN_TOGGLE_ACTIVE', `Admin, kullanıcı (${id}) durumunu ${newStatus ? 'AKTİF' : 'DONDURULMUŞ'} yaptı`, req.ip, req.get('User-Agent'));

  return res.json({
    success: true,
    message: `Kullanıcı hesabı ${newStatus ? 'aktifleştirildi' : 'donduruldu'}.`,
    is_active: newStatus
  });
});

// 4. GET SYSTEM AUDIT LOGS
router.get('/audit-logs', (req: AuthenticatedRequest, res: Response) => {
  const logs = db.prepare(`
    SELECT a.id, a.user_id, u.email as user_email, u.full_name, a.event, a.details, a.ip_address, a.user_agent, a.created_at
    FROM audit_logs a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
    LIMIT 100
  `).all();

  return res.json({ success: true, logs });
});

export default router;
