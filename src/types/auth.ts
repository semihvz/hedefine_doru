export type UserRole = 'ADMIN' | 'USER' | 'MANAGER';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active?: number;
  email_verified?: number;
  created_at?: string;
  updated_at?: string;
  active_sessions_count?: number;
}

export interface Session {
  id: string;
  user_agent: string;
  ip_address: string;
  created_at: string;
  expires_at: string;
  is_revoked: number;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  user_email?: string;
  full_name?: string;
  event: string;
  details: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  accessToken?: string;
  user?: User;
  demoResetToken?: string;
}
