import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Shield, CheckCircle, KeyRound, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, forgotPassword, resetPassword } = useAuth();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [resetToken, setResetToken] = useState('');
  const [demoTokenGenerated, setDemoTokenGenerated] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  // Password strength logic
  const checkPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordScore = checkPasswordStrength(password);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await register(email, password, fullName, role);
    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = await forgotPassword(email);
    setSubmitting(false);
    if (token) {
      setDemoTokenGenerated(token);
      setResetToken(token);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await resetPassword(resetToken, password);
    setSubmitting(false);
    if (success) {
      setTab('login');
      setDemoTokenGenerated(null);
    }
  };

  const fillDemoAccount = (demoRole: 'USER' | 'ADMIN') => {
    if (demoRole === 'ADMIN') {
      setEmail('admin@example.com');
      setPassword('Admin123!');
    } else {
      setEmail('user@example.com');
      setPassword('User123!');
    }
    setTab('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-indigo-500/10">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">
              {tab === 'login' && 'Giriş Yap'}
              {tab === 'register' && 'Yeni Hesap Oluştur'}
              {tab === 'forgot' && 'Şifremi Unuttum'}
              {tab === 'reset' && 'Şifreyi Sıfırla'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex p-2 gap-1 bg-slate-950/60 border-b border-slate-800/50">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              tab === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              tab === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kayıt Ol
          </button>
          <button
            onClick={() => setTab('forgot')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              tab === 'forgot' || tab === 'reset' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sıfırla
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          
          {/* Quick Demo Fill Buttons */}
          {(tab === 'login' || tab === 'register') && (
            <div className="mb-6 p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20">
              <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hızlı Test Hesapları (Tek Tıkla Giriş)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('USER')}
                  className="py-1.5 px-3 rounded-xl bg-indigo-900/40 hover:bg-indigo-900/80 border border-indigo-500/30 text-indigo-200 text-xs font-medium transition-all"
                >
                  👤 Kullanıcı Demosu
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('ADMIN')}
                  className="py-1.5 px-3 rounded-xl bg-amber-900/40 hover:bg-amber-900/80 border border-amber-500/30 text-amber-200 text-xs font-medium transition-all"
                >
                  👑 Admin Demosu
                </button>
              </div>
            </div>
          )}

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">E-Posta Adresi</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Şifre</label>
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    Şifremi Unuttum?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>Giriş Yap</span>
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ad Soyad</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ahmet Yılmaz"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">E-Posta Adresi</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Şifre (Min 8 Karakter)</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Password strength meter */}
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-slate-800">
                      <div className={`h-full transition-all duration-300 ${
                        passwordScore === 1 ? 'w-1/4 bg-rose-500' :
                        passwordScore === 2 ? 'w-2/4 bg-amber-500' :
                        passwordScore === 3 ? 'w-3/4 bg-indigo-500' :
                        passwordScore === 4 ? 'w-full bg-emerald-500' : 'w-0'
                      }`} />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Güvenlik: {
                        passwordScore <= 1 ? 'Zayıf' :
                        passwordScore === 2 ? 'Orta' :
                        passwordScore === 3 ? 'İyi' : 'Çok Güçlü 🔒'
                      }
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kullanıcı Rolü</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('USER')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      role === 'USER'
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    👤 Standart Kullanıcı
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('ADMIN')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      role === 'ADMIN'
                        ? 'bg-amber-600/30 border-amber-500 text-amber-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    👑 Admin Yöneticisi
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                <span>Hesabı Oluştur</span>
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Kayıtlı e-posta adresinizi girin. Güvenli sıfırlama jetonu oluşturularak şifrenizi yenilemenize olanak sağlanacaktır.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">E-Posta Adresi</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {demoTokenGenerated && (
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                  <p className="font-semibold">✅ Demo Sıfırlama Jetonu Oluşturuldu:</p>
                  <p className="font-mono bg-slate-950 p-2 rounded-xl break-all text-[11px] select-all border border-emerald-900">{demoTokenGenerated}</p>
                  <button
                    type="button"
                    onClick={() => setTab('reset')}
                    className="w-full py-1.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs transition-colors hover:bg-emerald-500"
                  >
                    Şifre Sıfırlama Adımına Git →
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                <span>Sıfırlama Bağlantısı Gönder</span>
              </button>
            </form>
          )}

          {/* RESET PASSWORD FORM */}
          {tab === 'reset' && (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Sıfırlama Jetonu (Reset Token)</label>
                <div className="relative">
                  <Shield className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Sıfırlama Jetonu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Yeni Şifre</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                <span>Yeni Şifreyi Kaydet</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
