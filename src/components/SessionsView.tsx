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
      return <Smartphone className="w-4 h-4 text-zinc-300" />;
    }
    return <Monitor className="w-4 h-4 text-zinc-300" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-sm bg-[#111115] border border-zinc-800 shadow-xl">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase block mb-1">
            GÜVENLİK VE OTURUM YÖNETİMİ
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Monitor className="w-5 h-5 text-white" />
            <span>Aktif Oturumlar</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Hesabınıza erişimi olan aktif cihazların listesi.
          </p>
        </div>
        <button
          onClick={fetchSessions}
          className="flex items-center gap-2 px-4 py-2 rounded-sm bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Yenile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.length === 0 ? (
          <div className="col-span-2 p-8 text-center rounded-sm bg-[#111115] border border-zinc-800 text-zinc-400 text-xs font-medium">
            Aktif oturum kaydı bulunamadı.
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="p-5 rounded-sm bg-[#111115] border border-zinc-800 hover:border-zinc-700 shadow-lg transition-all flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-sm bg-zinc-900 border border-zinc-800">
                  {getDeviceIcon(session.user_agent)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-200 font-mono">
                      {session.ip_address}
                    </span>
                    <span className="px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-700 text-zinc-300">
                      Aktif Cihaz
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 max-w-xs" title={session.user_agent}>
                    {session.user_agent}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    Tarih: {new Date(session.created_at).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => revokeSession(session.id)}
                title="Oturumu Sonlandır"
                className="p-1.5 rounded-sm bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

