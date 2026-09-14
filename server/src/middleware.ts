import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from './auth.js';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Erişim jetonu bulunamadı. Lütfen tekrar giriş yapın.' });
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return res.status(403).json({ success: false, error: 'Oturum süreniz doldu veya jeton geçersiz.' });
  }

  req.user = payload;
  next();
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Yetkisiz erişim.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Bu işlem için yetkiniz bulunmamaktadır.' });
    }

    next();
  };
}

// In-Memory Simple Rate Limiter for Login/Register Protection
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(maxRequests = 10, windowMs = 15 * 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: `Çok fazla başarısız deneme! Lütfen ${Math.ceil((record.resetTime - now) / 1000 / 60)} dakika sonra tekrar deneyin.`
      });
    }

    record.count += 1;
    next();
  };
}
