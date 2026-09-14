import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Key, ShieldCheck, RefreshCw, Clock, Edit3, Lock, Cpu, Check, Copy } from 'lucide-react';

export const DashboardView: React.FC<{ onOpenAuthModal: () => void }> = ({ onOpenAuthModal }) => {
  const { user, accessToken, refreshSession, updateProfile } = useAuth();
  
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // JWT Token expiration countdown calculation
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setTimeRemaining(null);
      return;
    }

    try {
      const payloadBase64 = accessToken.split('.')[1];
      const decodedJson = JSON.parse(atob(payloadBase64));
      if (decodedJson.exp) {
        const updateTimer = () => {
          const nowSeconds = Math.floor(Date.now() / 1000);
          const diff = decodedJson.exp - nowSeconds;
          setTimeRemaining(diff > 0 ? diff : 0);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
      }
    } catch (e) {
      console.error('JWT Parse error', e);
    }
  }, [accessToken]);

  const handleCopyToken = () => {
    if (accessToken) {
      navigator.clipboard.writeText(accessToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await updateProfile(fullName, currentPass || undefined, newPass || undefined);
    setIsSubmitting(false);
    if (success) {
      setIsEditing(false);
      setCurrentPass('');
      setNewPass('');
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 px-4">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Key className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-100 mb-3">Kullanıcı Girişi Yapılmadı</h2>
        <p className="text-slate-400 max-w-lg mx-auto mb-8 text-sm leading-relaxed">
          Kullanıcı profilinizi görmek, aktif JWT token durumunu izlemek ve güvenli API işlemlerini test etmek için hemen giriş yapın veya demo hesabı kullanın.
        </p>
        <button
          onClick={onOpenAuthModal}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          Giriş Yap / Demo Hesabı Aç
        </button>
      </div>
    );
  }

  const minutes = timeRemaining !== null ? Math.floor(timeRemaining / 60) : 0;
  const seconds = timeRemaining !== null ? timeRemaining % 60 : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/40 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-xl shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-300 font-bold text-2xl">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-slate-100">Hoş Geldiniz, {user.full_name}!</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  user.role === 'ADMIN'
                    ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                    : 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300'
                }`}>
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-slate-400">{user.email} • Hesap Oluşturulma: {user.created_at || 'Bugün'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700 transition-all text-sm font-medium"
            >
              <Edit3 className="w-4 h-4 text-indigo-400" />
              <span>{isEditing ? 'İptal Et' : 'Profili Düzenle'}</span>
            </button>
            <button
              onClick={refreshSession}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/20 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Token Yenile</span>
            </button>
          </div>

        </div>
      </div>

      {/* Edit Profile Section */}
      {isEditing && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-xl space-y-4 animate-fade-in">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-400" />
            <span>Kullanıcı Profil ve Şifre Güncelleme</span>
          </h3>

          <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ad Soyad</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mevcut Şifre (Değişim için)</label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Yeni Şifre (Min 8 kark.)</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all"
              >
                {isSubmitting ? 'Güncelleniyor...' : 'Profil Değişikliklerini Kaydet'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security & Token Live Inspection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: JWT Access Token Status */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Access Token Süresi
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                AKTİF (15 Dk)
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-4xl font-extrabold text-slate-100 font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-400">kaldı</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              JWT Access Token tarayıcı memory veya HTTP Header'larında saklanır. Süre dolduğunda sessiz token rotasyonu gerçekleşir.
            </p>
          </div>

          <button
            onClick={refreshSession}
            className="w-full py-2.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Manüel Token Yenile (Silent Refresh)</span>
          </button>
        </div>

        {/* Card 2: Security Credentials & Storage */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Güvenlik Mimarisi
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-950 border border-purple-500/40 text-purple-300">
              HttpOnly Cookie
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span>Şifre Hash Algoritması:</span>
              <span className="font-mono text-purple-300 font-bold">bcrypt (Cost 12)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span>Refresh Token:</span>
              <span className="font-mono text-emerald-400 font-bold">SameSite=Lax (7 Gün)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span>CSRF Koruması:</span>
              <span className="font-mono text-indigo-300 font-bold">Aktif</span>
            </div>
          </div>
        </div>

        {/* Card 3: Role & Permissions */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Lock className="w-4 h-4" /> Rol & Erişim (RBAC)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 border border-amber-500/40 text-amber-300">
              {user.role}
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Profil Görüntüleme & Güncelleme</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Kendi Oturumlarını Yönetme</span>
            </div>
            <div className="flex items-center gap-2">
              {user.role === 'ADMIN' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <span className="w-4 h-4 text-rose-500 font-bold">✕</span>
              )}
              <span className={user.role === 'ADMIN' ? 'text-emerald-300 font-semibold' : 'text-slate-500'}>
                Tüm Kullanıcıları Yönetme (Admin Özel)
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Raw JWT Token Inspector Box */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Raw Access Token Inspection (Bearer JWT)</span>
          </h3>
          <button
            onClick={handleCopyToken}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedToken ? 'Kopyalandı!' : 'Token Kopyala'}</span>
          </button>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 font-mono text-[11px] text-slate-400 break-all border border-slate-800/80 max-h-24 overflow-y-auto selection:bg-indigo-500 selection:text-white">
          {accessToken || 'Access Token yüklenemedi...'}
        </div>
      </div>

    </div>
  );
};
