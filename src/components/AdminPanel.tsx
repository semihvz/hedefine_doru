import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, FileText, RefreshCw, Search, Lock } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { user, adminUsers, adminAuditLogs, fetchAdminUsers, fetchAdminAuditLogs, toggleUserActive, adminRevokeUserSessions } = useAuth();
  
  const [tab, setTab] = useState<'users' | 'audit'>('users');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminUsers();
    fetchAdminAuditLogs();
  }, []);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center rounded-sm bg-[#111115] border border-rose-900/40 text-rose-300">
        <Lock className="w-12 h-12 mx-auto mb-3 text-rose-400" />
        <h3 className="text-xl font-bold uppercase tracking-tight">Yetkisiz Erişim</h3>
        <p className="text-sm mt-1 text-zinc-400">Yönetici paneline yalnızca ADMIN rolündeki kullanıcılar erişebilir.</p>
      </div>
    );
  }

  const filteredUsers = adminUsers.filter((u) =>
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-sm bg-[#111115] border border-zinc-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-sm bg-zinc-900 text-zinc-200 border border-zinc-800">
            <ShieldAlert className="w-5 h-5 text-zinc-200" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold tracking-widest text-zinc-400 uppercase block mb-1">
              YÖNETİM VE DENETİM PORTALI
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Yönetici Paneli (Admin Console)</h2>
            <p className="text-xs text-zinc-400">Sistemdeki kullanıcıları, yetkileri ve güvenlik denetim kayıtlarını yönetin.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchAdminUsers();
              fetchAdminAuditLogs();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-sm bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Yenile</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setTab('users')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-xs font-mono font-bold uppercase tracking-wider transition-all ${
            tab === 'users'
              ? 'border-white text-white bg-zinc-900/40'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kullanıcı Yönetimi ({adminUsers.length})</span>
        </button>

        <button
          onClick={() => setTab('audit')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-xs font-mono font-bold uppercase tracking-wider transition-all ${
            tab === 'audit'
              ? 'border-white text-white bg-zinc-900/40'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Güvenlik Denetim Günlüğü (Audit Logs)</span>
        </button>
      </div>

      {/* USERS TAB CONTENT */}
      {tab === 'users' && (
        <div className="space-y-4">
          
          {/* Search filter */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="İsim veya e-posta ile ara..."
              className="w-full pl-10 pr-4 py-2 rounded-sm bg-[#111115] border border-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-zinc-500 placeholder-zinc-500"
            />
          </div>

          <div className="overflow-x-auto rounded-sm border border-zinc-800 bg-[#111115]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900 text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                  <th className="p-4">Kullanıcı</th>
                  <th className="p-4">E-Posta</th>
                  <th className="p-4">Rol</th>
                  <th className="p-4">Durum</th>
                  <th className="p-4">Aktif Oturum</th>
                  <th className="p-4 text-right">Eylemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs text-zinc-300">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="p-4 font-semibold text-zinc-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-zinc-800 flex items-center justify-center font-mono font-bold text-zinc-200 border border-zinc-700">
                        {u.full_name.charAt(0)}
                      </div>
                      <span>{u.full_name}</span>
                    </td>
                    <td className="p-4 font-mono text-zinc-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider border ${
                        u.role === 'ADMIN'
                          ? 'bg-zinc-900 border-zinc-600 text-white'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider border ${
                        u.is_active
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                          : 'bg-rose-950/40 border-rose-500/40 text-rose-400'
                      }`}>
                        {u.is_active ? 'AKTİF' : 'DONDURULMUŞ'}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-zinc-300">
                      {u.active_sessions_count || 0} Oturum
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => adminRevokeUserSessions(u.id)}
                        title="Oturumları Kapat"
                        className="px-3 py-1.5 rounded-sm bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors text-[11px] font-mono font-bold uppercase"
                      >
                        Oturumları Kapat
                      </button>

                      {u.id !== user.id && (
                        <button
                          onClick={() => toggleUserActive(u.id)}
                          className={`px-3 py-1.5 rounded-sm border text-[11px] font-mono font-bold uppercase transition-colors ${
                            u.is_active
                              ? 'bg-rose-950/60 hover:bg-rose-900/60 border-rose-500/40 text-rose-300'
                              : 'bg-emerald-950/60 hover:bg-emerald-900/60 border-emerald-500/40 text-emerald-300'
                          }`}
                        >
                          {u.is_active ? 'Dondur' : 'Aktif Et'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* AUDIT LOGS TAB CONTENT */}
      {tab === 'audit' && (
        <div className="overflow-x-auto rounded-sm border border-zinc-800 bg-[#111115]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900 text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                <th className="p-4">Tarih</th>
                <th className="p-4">Kullanıcı</th>
                <th className="p-4">Olay (Event)</th>
                <th className="p-4">Detay</th>
                <th className="p-4">IP & User Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs text-zinc-300">
              {adminAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="p-4 text-zinc-500 whitespace-nowrap font-mono text-[11px]">
                    {new Date(log.created_at).toLocaleString('tr-TR')}
                  </td>
                  <td className="p-4 font-medium text-zinc-200">
                    {log.user_email || log.user_id || 'Public / Anonim'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold border font-mono uppercase tracking-wider ${
                      log.event.includes('SUCCESS') ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' :
                      log.event.includes('FAILED') || log.event.includes('REVOKE') ? 'bg-rose-950/40 border-rose-500/40 text-rose-400' :
                      'bg-zinc-900 border-zinc-700 text-zinc-300'
                    }`}>
                      {log.event}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-300">{log.details || '-'}</td>
                  <td className="p-4 font-mono text-[11px] text-zinc-500 max-w-xs truncate" title={log.user_agent || ''}>
                    {log.ip_address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

