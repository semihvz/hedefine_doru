import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db from './db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-access-token-key-2026';
export const REFRESH_SECRET = process.env.REFRESH_SECRET || 'super-secret-refresh-token-key-2026';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(password, salt);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export function logAuditEvent(userId: string | null, event: string, details?: string, ipAddress?: string, userAgent?: string) {
  const id = 'audit-' + crypto.randomUUID();
  try {
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, event, details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, userId, event, details || null, ipAddress || null, userAgent || null);
  } catch (error) {
    console.error('Audit log write error:', error);
  }
}
