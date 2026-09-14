import React from 'react';
import { Lock, KeyRound, Zap, ShieldCheck, Sparkles, BookOpen, Target, Flame } from 'lucide-react';
import { quickDemoLogin } from '../services/storageService';
import type { UserProfile } from '../types/quiz';

interface AuthGuardWallProps {
  onOpenAuthModal: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthGuardWall: React.FC<AuthGuardWallProps> = ({ onOpenAuthModal, onLoginSuccess }) => {
  const handleDemoLogin = () => {
    const demoUser = quickDemoLogin();
    onLoginSuccess(demoUser);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden text-center space-y-8">
        
        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl -mt-24 pointer-events-none" />

        {/* Lock Shield Icon */}
        <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-indigo-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <Lock className="w-10 h-10 text-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Header Title & Subtitle */}
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Korumalı İçerik & Güvenli Erişim</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Erişim Sağlamak İçin Giriş Yapın 🔒
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Hedefine Doğru YKS platformundaki <strong className="text-slate-200">260+ ÖSYM Soru Bankası</strong>, 
            <strong className="text-slate-200"> Deneme Sınavları</strong>, <strong className="text-slate-200">Ders Kataloğu</strong>, 
            <strong className="text-slate-200"> Alışkanlık Takibi</strong> ve <strong className="text-slate-200">AI Yapay Zeka Desteğine</strong> 
            erişebilmek için lütfen hesabınıza giriş yapın.
          </p>
        </div>

        {/* Feature Grid Preview */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shrink-0">
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">260+ ÖSYM Soru Bankası</h4>
              <p className="text-[11px] text-slate-400">Detaylı çözümler, KaTeX formüller ve sınav soruları</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
              <Target className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Mock Deneme Sınavları</h4>
              <p className="text-[11px] text-slate-400">Gerçek süreli YKS sınav simülasyonları ve net hesabı</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 shrink-0">
              <Flame className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Alışkanlık & Zinciri Kırma</h4>
              <p className="text-[11px] text-slate-400">Günlük soru çözümü ve rutinlerinizi takip edin</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Metin Seçip AI'ya Sorma</h4>
              <p className="text-[11px] text-slate-400">Yapay zeka ile anında ders açıklaması alın</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenAuthModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all"
          >
            <KeyRound className="w-4 h-4" />
            <span>Giriş Yap / Kayıt Ol</span>
          </button>

          <button
            onClick={handleDemoLogin}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm hover:scale-105 active:scale-95 transition-all"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>⚡ Hızlı Demo Girişi Yap</span>
          </button>
        </div>

      </div>
    </div>
  );
};
