import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Monitor, Smartphone, Trash2, RefreshCw } from 'lucide-react';

export const SessionsView: React.FC = () => {
  const { user, sessions, fetchSessions, revokeSession } = useAuth();

  useEffect(() => {
    fetchSessions();
  }, []);

  if (!user) return null;

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone className="w-5 h-5 text-purple-400" />;
    }
    return <Monitor className="w-5 h-5 text-indigo-400" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Monitor className="w-6 h-6 text-indigo-400" />
            <span>Aktif Oturumlarım ve Cihaz Yönetimi</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hesabınıza erişimi olan aktif cihazların listesi. Tanımadığınız bir oturumu tek tıkla sonlandırabilirsiniz.
          </p>
        </div>
        <button
          onClick={fetchSessions}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Yenile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.length === 0 ? (
          <div className="col-span-2 p-8 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400">
            Aktif oturum kaydı bulunamadı.
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/30 shadow-lg transition-all flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  {getDeviceIcon(session.user_agent)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200 font-mono">
                      {session.ip_address}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      Aktif Cihaz
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 max-w-xs" title={session.user_agent}>
                    {session.user_agent}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Başlatılma: {new Date(session.created_at).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => revokeSession(session.id)}
                title="Oturumu Sonlandır"
                className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 hover:text-rose-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
