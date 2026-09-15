import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  KeyRound, 
  BookOpen, 
  GraduationCap, 
  Target,
  Flame,
  CheckSquare,
  RotateCcw,
  MonitorSmartphone,
  ShieldAlert,
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

  const navItems = [
    { id: 'quiz', label: 'Soru Bankası', icon: BookOpen },
    { id: 'denemeler', label: 'Denemeler', icon: Target },
    { id: 'tekrar', label: 'Tekrar Alanı', icon: RotateCcw },
    { id: 'dersler', label: 'Ders Kataloğu', icon: GraduationCap },
    { id: 'aliskanliklar', label: 'Alışkanlıklar', icon: Flame },
    { id: 'todolist', label: 'Görev Planlayıcı', icon: CheckSquare },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#08080a]/95 border-b border-zinc-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo - BlackRock Style Typography */}
          <div 
            onClick={() => handleNavClick('quiz')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-7 h-7 bg-zinc-100 text-black flex items-center justify-center font-black text-xs tracking-tighter rounded-sm">
              HD
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-widest text-white uppercase">
                HEDEFİNE DOĞRU
              </span>
              <span className="text-zinc-600 text-xs font-light">|</span>
              <span className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase hidden sm:inline">
                YKS 2026
              </span>
            </div>
          </div>

          {/* Desktop Navigation Items - Sleek Horizontal Minimalist Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium tracking-wide transition-all border-b-2 ${
                    isActive
                      ? 'border-white text-white font-semibold'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {user && (
              <button
                onClick={() => handleNavClick('sessions')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium tracking-wide transition-all border-b-2 ${
                  activeTab === 'sessions'
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <MonitorSmartphone className="w-3.5 h-3.5" />
                <span>Oturumlar</span>
              </button>
            )}

            {user?.role === 'ADMIN' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium tracking-wide transition-all border-b-2 ${
                  activeTab === 'admin'
                    ? 'border-amber-400 text-amber-300 font-semibold'
                    : 'border-transparent text-amber-500/70 hover:text-amber-300'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Yönetici</span>
              </button>
            )}
          </nav>

          {/* Right User Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end leading-none">
                  <span className="text-xs font-medium text-zinc-200">{user.full_name}</span>
                  <span className="text-[10px] text-zinc-500 tracking-wider uppercase mt-1">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Çıkış Yap"
                  className="px-3 py-1.5 border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-medium tracking-wide rounded-sm flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Çıkış</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-1.5 bg-zinc-100 text-black hover:bg-white transition-all text-xs font-bold tracking-wide rounded-sm flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Giriş Yap</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white md:hidden rounded-sm"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-[#08080a] p-3 space-y-1 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium tracking-wide text-left transition-all ${
                    activeTab === item.id 
                      ? 'bg-zinc-800 text-white font-semibold' 
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#08080a]/95 border-t border-zinc-800 flex items-center justify-around py-2 px-1 backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 transition-all ${
                isActive ? 'text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

