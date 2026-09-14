import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  MonitorSmartphone, 
  ShieldAlert, 
  Cpu, 
  LogOut, 
  KeyRound, 
  BookOpen, 
  GraduationCap, 
  Target,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuthModal }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-amber-300 leading-tight">
                Hedefine Doğru <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">YKS 2026</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">YKS Hazırlık & Deneme Sınavı Platformu</p>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800/50 backdrop-blur-md">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Genel Bakış</span>
            </button>

            <button
              onClick={() => handleNavClick('quiz')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'quiz'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Soru Bankası</span>
            </button>

            <button
              onClick={() => handleNavClick('denemeler')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'denemeler'
                  ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white shadow-md shadow-amber-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Target className="w-4 h-4 text-amber-400" />
              <span>Denemeler</span>
            </button>

            <button
              onClick={() => handleNavClick('dersler')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'dersler'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Dersler</span>
            </button>

            {user && (
              <button
                onClick={() => handleNavClick('sessions')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeTab === 'sessions'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <MonitorSmartphone className="w-4 h-4" />
                <span>Oturumlarım</span>
              </button>
            )}

            {user?.role === 'ADMIN' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeTab === 'admin'
                    ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md shadow-amber-500/25'
                    : 'text-amber-400 hover:text-amber-200 hover:bg-amber-950/30'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Yönetici Paneli</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('architecture')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'architecture'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Sistem Mimarisi</span>
            </button>
          </nav>

          {/* Right Action / Auth Button */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-200">{user.full_name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    user.role === 'ADMIN' 
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-300' 
                      : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Çıkış Yap"
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-900/50 hover:bg-rose-950/20 transition-all text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Çıkış</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
              >
                <KeyRound className="w-4 h-4" />
                <span>Giriş Yap</span>
              </button>
            )}

            {/* Mobile Menu Hamburger Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white md:hidden transition-colors"
              title="Menüyü Aç"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950/98 p-4 space-y-2 animate-fade-in shadow-2xl">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold text-left transition-all ${
                activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-900/80 border border-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Genel Bakış</span>
            </button>

            <button
              onClick={() => handleNavClick('quiz')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold text-left transition-all ${
                activeTab === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-900/80 border border-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Soru Bankası</span>
            </button>

            <button
              onClick={() => handleNavClick('denemeler')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold text-left transition-all ${
                activeTab === 'denemeler' ? 'bg-amber-600 text-white' : 'text-slate-300 bg-slate-900/80 border border-slate-800'
              }`}
            >
              <Target className="w-4 h-4 text-amber-400" />
              <span>Denemeler (YKS Mock Sınavlar)</span>
            </button>

            <button
              onClick={() => handleNavClick('dersler')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold text-left transition-all ${
                activeTab === 'dersler' ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-900/80 border border-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Dersler (TYT & AYT Kataloğu)</span>
            </button>

            {user && (
              <button
                onClick={() => handleNavClick('sessions')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold text-left transition-all ${
                  activeTab === 'sessions' ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-900/80 border border-slate-800'
                }`}
              >
                <MonitorSmartphone className="w-4 h-4" />
                <span>Oturumlarım</span>
              </button>
            )}

            {user?.role === 'ADMIN' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold text-left transition-all ${
                  activeTab === 'admin' ? 'bg-amber-600 text-white' : 'text-amber-300 bg-amber-950/40 border border-amber-500/30'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Yönetici Paneli</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('architecture')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold text-left transition-all ${
                activeTab === 'architecture' ? 'bg-emerald-600 text-white' : 'text-slate-300 bg-slate-900/80 border border-slate-800'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Sistem Mimarisi</span>
            </button>
          </div>
        )}
      </header>

      {/* Sticky Bottom Mobile Navigation Bar (Smartphones) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-xl flex items-center justify-around py-2 px-1 shadow-2xl">
        <button
          onClick={() => handleNavClick('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'dashboard' ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Genel</span>
        </button>

        <button
          onClick={() => handleNavClick('quiz')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'quiz' ? 'text-purple-400 font-bold' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px]">Sorular</span>
        </button>

        <button
          onClick={() => handleNavClick('denemeler')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'denemeler' ? 'text-amber-400 font-bold' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Target className="w-5 h-5" />
          <span className="text-[10px]">Deneme</span>
        </button>

        <button
          onClick={() => handleNavClick('dersler')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'dersler' ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          <span className="text-[10px]">Dersler</span>
        </button>
      </nav>
    </>
  );
};
