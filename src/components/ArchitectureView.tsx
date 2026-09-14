import React from 'react';
import { Cpu, Database, ShieldCheck, Layers } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Uçtan Uca Sistem Mimarisi & Şema Tasarımı</h2>
            <p className="text-sm text-slate-400">Production-grade güvenlik standartlarında tasarlanmış full-stack auth & DB mimarisi.</p>
          </div>
        </div>
      </div>

      {/* Layer Architecture Diagram */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>3 Katmanlı Sistem Mimarisi (3-Tier Architecture)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* Layer 1: Client */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-400 text-sm">1. Frontend Layer</span>
              <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono">React + Vite</span>
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>• Access Token (JWT) in Memory</li>
              <li>• Automatic Silent Refresh Interceptor</li>
              <li>• Responsive Glassmorphism Theme</li>
              <li>• Interactive Auth Context</li>
            </ul>
          </div>

          {/* Layer 2: API & Auth Middleware */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-400 text-sm">2. Express API & Auth</span>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono">Node.js API</span>
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>• Rate Limiter (Brute-Force Guard)</li>
              <li>• bcrypt Password Hashing (Cost 12)</li>
              <li>• JWT Sign & Verification Engine</li>
              <li>• RBAC Middleware (User/Admin)</li>
            </ul>
          </div>

          {/* Layer 3: Database */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 text-sm">3. Persistence DB</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">SQLite (WAL)</span>
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>• Users & Credentials Table</li>
              <li>• Refresh Tokens & Session Table</li>
              <li>• Security Audit Logs Table</li>
              <li>• Password Resets Token Table</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Database Schema Specification */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-400" />
          <span>Veritabanı Şeması (Relational ER Specs)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Table: Users */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-indigo-400 font-bold border-b border-slate-800 pb-2">
              <span>TABLE users</span>
              <span className="text-[10px] text-slate-500">PRIMARY KEY (id)</span>
            </div>
            <div className="text-slate-300 space-y-1 text-[11px]">
              <p><span className="text-purple-400">id</span> TEXT PRIMARY KEY</p>
              <p><span className="text-purple-400">email</span> TEXT UNIQUE NOT NULL</p>
              <p><span className="text-purple-400">password_hash</span> TEXT NOT NULL</p>
              <p><span className="text-purple-400">full_name</span> TEXT NOT NULL</p>
              <p><span className="text-purple-400">role</span> TEXT ('USER' | 'ADMIN')</p>
              <p><span className="text-purple-400">is_active</span> INTEGER DEFAULT 1</p>
              <p><span className="text-purple-400">created_at</span> DATETIME DEFAULT CURRENT_TIMESTAMP</p>
            </div>
          </div>

          {/* Table: Refresh Tokens */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-slate-800 pb-2">
              <span>TABLE refresh_tokens</span>
              <span className="text-[10px] text-slate-500">FOREIGN KEY (user_id)</span>
            </div>
            <div className="text-slate-300 space-y-1 text-[11px]">
              <p><span className="text-purple-400">id</span> TEXT PRIMARY KEY</p>
              <p><span className="text-purple-400">user_id</span> TEXT FK users(id)</p>
              <p><span className="text-purple-400">token_hash</span> TEXT NOT NULL</p>
              <p><span className="text-purple-400">expires_at</span> DATETIME NOT NULL</p>
              <p><span className="text-purple-400">is_revoked</span> INTEGER DEFAULT 0</p>
              <p><span className="text-purple-400">user_agent / ip_address</span> TEXT</p>
            </div>
          </div>

        </div>
      </div>

      {/* Security Policies List */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>Uygulanan Güvenlik Politikaları & Önlemler</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <span className="text-emerald-400 font-bold">✓</span>
            <div>
              <p className="font-bold text-slate-200">Dual-Token (JWT + Cookie) Pattern</p>
              <p className="text-slate-400 text-[11px]">Short-lived 15-min Access Token memory'de tutulur, 7-günlük Refresh Token HttpOnly Cookie olarak saklanır.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <span className="text-emerald-400 font-bold">✓</span>
            <div>
              <p className="font-bold text-slate-200">Brute-Force & Rate Limiting</p>
              <p className="text-slate-400 text-[11px]">Hatalı giriş denemelerinde IP tabanlı kısıtlama uygulanır (15 dakikada maks 10 deneme).</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <span className="text-emerald-400 font-bold">✓</span>
            <div>
              <p className="font-bold text-slate-200">Session Revocation (Oturum İptali)</p>
              <p className="text-slate-400 text-[11px]">Veritabanı üzerinde aktif oturum takibi yapılarak istenildiği an cihaz oturumu iptal edilebilir.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <span className="text-emerald-400 font-bold">✓</span>
            <div>
              <p className="font-bold text-slate-200">Security Audit Trail (Denetim İzi)</p>
              <p className="text-slate-400 text-[11px]">Tüm login, kayıt, şifre sıfırlama ve yetkili eylemleri veritabanında denetim günlüğüne kaydedilir.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
