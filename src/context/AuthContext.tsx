import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Session, AuditLog, AuthResponse } from '../types/auth';
import { apiUrl } from '../utils/api';
import { loadActiveUser, logoutUserAccount } from '../services/storageService';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (email: string, pass: string, name: string, role?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  updateProfile: (fullName: string, currentPass?: string, newPass?: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<string | null>;
  resetPassword: (token: string, newPass: string) => Promise<boolean>;
  sessions: Session[];
  fetchSessions: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<boolean>;
  // Admin Features
  adminUsers: User[];
  adminAuditLogs: AuditLog[];
  fetchAdminUsers: () => Promise<void>;
  fetchAdminAuditLogs: () => Promise<void>;
  toggleUserActive: (userId: string) => Promise<boolean>;
  adminRevokeUserSessions: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [adminAuditLogs, setAdminAuditLogs] = useState<AuditLog[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // API helper with Authorization header
  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const res = await fetch(apiUrl(url), { ...options, headers, credentials: 'include' });
      return res;
    },
    [accessToken]
  );

  // Initial user check & silent refresh on app boot
  const initAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try refresh token to get a new access token
      const res = await fetch(apiUrl('/api/auth/refresh-token'), { method: 'POST', credentials: 'include' });
      const data: AuthResponse = await res.json();

      if (data.success && data.accessToken) {
        setAccessToken(data.accessToken);

        // Fetch user profile with new access token
        const meRes = await fetch(apiUrl('/api/auth/me'), {
          headers: { Authorization: `Bearer ${data.accessToken}` },
          credentials: 'include',
        });
        const meData = await meRes.json();
        if (meData.success && meData.user) {
          setUser(meData.user);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('Silent refresh failed or no active session');
    }

    // Check local active user session (demo / client login)
    const localUser = loadActiveUser();
    if (localUser) {
      setUser({
        id: localUser.id || 'usr_demo',
        email: localUser.email || 'kullanici@hedefine.ai',
        full_name: localUser.name || 'Öğrenci Kullanıcı',
        role: 'USER',
        is_active: 1,
        created_at: new Date().toISOString()
      });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // LOGIN
  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password: pass }),
      });
      const data: AuthResponse = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.error || 'Giriş yapılamadı.', 'error');
        return false;
      }

      setAccessToken(data.accessToken || null);
      setUser(data.user || null);
      addToast(data.message || 'Giriş başarılı!', 'success');
      return true;
    } catch (err) {
      addToast('Sunucu ile iletişim kurulamadı.', 'error');
      return false;
    }
  };

  // REGISTER
  const register = async (email: string, pass: string, name: string, role = 'USER'): Promise<boolean> => {
    try {
      const res = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password: pass, full_name: name, role }),
      });
      const data: AuthResponse = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.error || 'Kayıt başarısız.', 'error');
        return false;
      }

      setAccessToken(data.accessToken || null);
      setUser(data.user || null);
      addToast(data.message || 'Kayıt başarıyla tamamlandı!', 'success');
      return true;
    } catch (err) {
      addToast('Kayıt sırasında bir hata oluştu.', 'error');
      return false;
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await authFetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    } finally {
      logoutUserAccount();
      setUser(null);
      setAccessToken(null);
      addToast('Oturum kapatıldı.', 'info');
    }
  };

  // MANUAL REFRESH SESSION
  const refreshSession = async (): Promise<boolean> => {
    try {
      const res = await fetch(apiUrl('/api/auth/refresh-token'), { method: 'POST', credentials: 'include' });
      const data: AuthResponse = await res.json();

      if (data.success && data.accessToken) {
        setAccessToken(data.accessToken);
        addToast('Erişim jetonu (Access Token) yenilendi!', 'success');
        return true;
      } else {
        addToast(data.error || 'Yenileme jetonunun süresi dolmuş.', 'error');
        logout();
        return false;
      }
    } catch (e) {
      addToast('Token yenileme başarısız.', 'error');
      return false;
    }
  };

  // UPDATE PROFILE
  const updateProfile = async (fullName: string, currentPass?: string, newPass?: string): Promise<boolean> => {
    try {
      const res = await authFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ full_name: fullName, current_password: currentPass, new_password: newPass }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.error || 'Profil güncellenemedi.', 'error');
        return false;
      }

      if (data.user) {
        setUser((prev) => (prev ? { ...prev, full_name: data.user.full_name } : null));
      }
      addToast(data.message || 'Profil güncellendi.', 'success');
      return true;
    } catch (e) {
      addToast('Güncelleme sırasında hata oluştu.', 'error');
      return false;
    }
  };

  // FORGOT PASSWORD
  const forgotPassword = async (email: string): Promise<string | null> => {
    try {
      const res = await fetch(apiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data: AuthResponse = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.error || 'Talep başarısız.', 'error');
        return null;
      }

      addToast(data.message || 'Sıfırlama talebi alındı.', 'success');
      return data.demoResetToken || 'DEMO_RESET_TOKEN_GENERATED';
    } catch (e) {
      addToast('Sunucu hatası.', 'error');
      return null;
    }
  };

  // RESET PASSWORD
  const resetPassword = async (token: string, newPass: string): Promise<boolean> => {
    try {
      const res = await fetch(apiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPass }),
      });
      const data: AuthResponse = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.error || 'Şifre sıfırlama başarısız.', 'error');
        return false;
      }

      addToast(data.message || 'Şifreniz sıfırlandı!', 'success');
      return true;
    } catch (e) {
      addToast('Sunucu hatası.', 'error');
      return false;
    }
  };

  // FETCH ACTIVE SESSIONS
  const fetchSessions = async () => {
    if (!user) return;
    try {
      const res = await authFetch('/api/auth/sessions');
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // REVOKE SINGLE SESSION
  const revokeSession = async (sessionId: string): Promise<boolean> => {
    try {
      const res = await authFetch('/api/auth/revoke-session', {
        method: 'POST',
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();

      if (data.success) {
        addToast('Oturum kapatıldı.', 'success');
        fetchSessions();
        return true;
      } else {
        addToast(data.error || 'İşlem başarısız.', 'error');
        return false;
      }
    } catch (e) {
      addToast('Oturum kapatılırken hata oluştu.', 'error');
      return false;
    }
  };

  // ADMIN: FETCH USERS
  const fetchAdminUsers = async () => {
    if (!user || user.role !== 'ADMIN') return;
    try {
      const res = await authFetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setAdminUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ADMIN: FETCH AUDIT LOGS
  const fetchAdminAuditLogs = async () => {
    if (!user || user.role !== 'ADMIN') return;
    try {
      const res = await authFetch('/api/admin/audit-logs');
      const data = await res.json();
      if (data.success) {
        setAdminAuditLogs(data.logs || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ADMIN: TOGGLE USER ACTIVE STATUS
  const toggleUserActive = async (userId: string): Promise<boolean> => {
    try {
      const res = await authFetch(`/api/admin/users/${userId}/toggle-active`, { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        addToast(data.message, 'success');
        fetchAdminUsers();
        return true;
      } else {
        addToast(data.error || 'İşlem başarısız.', 'error');
        return false;
      }
    } catch (e) {
      addToast('Sunucu hatası.', 'error');
      return false;
    }
  };

  // ADMIN: REVOKE USER SESSIONS
  const adminRevokeUserSessions = async (userId: string): Promise<boolean> => {
    try {
      const res = await authFetch(`/api/admin/users/${userId}/revoke`, { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        addToast(data.message, 'success');
        fetchAdminUsers();
        return true;
      } else {
        addToast(data.error || 'İşlem başarısız.', 'error');
        return false;
      }
    } catch (e) {
      addToast('Sunucu hatası.', 'error');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        toasts,
        addToast,
        removeToast,
        login,
        register,
        logout,
        refreshSession,
        updateProfile,
        forgotPassword,
        resetPassword,
        sessions,
        fetchSessions,
        revokeSession,
        adminUsers,
        adminAuditLogs,
        fetchAdminUsers,
        fetchAdminAuditLogs,
        toggleUserActive,
        adminRevokeUserSessions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
