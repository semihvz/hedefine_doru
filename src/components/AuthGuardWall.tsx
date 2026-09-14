import React from 'react';
import { Lock, KeyRound, Zap, BookOpen, Target, Flame, Sparkles } from 'lucide-react';
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
    <div className="min-h-[70vh] flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-[#111115] border border-zinc-800 rounded-sm p-8 sm:p-10 shadow-2xl space-y-8 text-center">
        
        {/* Minimal Shield Badge */}
        <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 border border-zinc-700 text-white rounded-sm mx-auto">
          <Lock className="w-5 h-5 text-white" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
            ERİŞİM KONTROLÜ | GÜVENLİ PLATFORM PORTALI
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Kullanıcı Doğrulaması Gereklidir
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            Hedefine Doğru platformundaki ÖSYM soru bankaları, deneme sınavı analizleri ve AI öğrenme asistanına erişmek için giriş yapınız.
          </p>
        </div>

        {/* Feature List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left border-t border-b border-zinc-800/80 py-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="text-xs text-zinc-300 font-medium">260+ ÖSYM Soru Bankası</span>
          </div>
          <div className="flex items-center gap-3">
            <Target className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="text-xs text-zinc-300 font-medium">YKS Mock Denemeler</span>
          </div>
          <div className="flex items-center gap-3">
            <Flame className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="text-xs text-zinc-300 font-medium">Alışkanlık & Rutin Takibi</span>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="text-xs text-zinc-300 font-medium">Seçili Metin AI Asistanı</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenAuthModal}
            className="w-full sm:w-auto px-6 py-2.5 bg-zinc-100 hover:bg-white text-black font-bold text-xs tracking-wider uppercase rounded-sm transition-all flex items-center justify-center gap-2"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Giriş Yap / Kayıt Ol</span>
          </button>

          <button
            onClick={handleDemoLogin}
            className="w-full sm:w-auto px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-medium text-xs tracking-wider uppercase rounded-sm transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Hızlı Demo Girişi</span>
          </button>
        </div>

      </div>
    </div>
  );
};

