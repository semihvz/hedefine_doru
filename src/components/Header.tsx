import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Brain, 
  Flame, 
  Award, 
  Bookmark, 
  Settings, 
  Moon, 
  BarChart2, 
  Layers, 
  BookOpen, 
  LogIn, 
  LogOut, 
  BookOpenCheck, 
  CheckSquare,
  Factory,
  TrendingUp
} from 'lucide-react';
import type { UserStats, AppSettings, UserProfile } from '../types/quiz';

interface HeaderProps {
  stats: UserStats;
  settings: AppSettings;
  currentUser: UserProfile | null;
  activeMode: 'embedded-bank' | 'flashcards' | 'journal' | 'planner' | 'industrial-engineering' | 'trade';
  onSwitchMode: (mode: 'embedded-bank' | 'flashcards' | 'journal' | 'planner' | 'industrial-engineering' | 'trade') => void;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onOpenSettings: () => void;
  onOpenBookmarks: () => void;
  onOpenStats: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  settings: _settings,
  currentUser,
  activeMode,
  onSwitchMode,
  onUpdateSettings: _onUpdateSettings,
  onOpenSettings,
  onOpenBookmarks,
  onOpenStats,
  onOpenAuth,
  onLogout,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const handleNavClick = (action: () => void) => {
    action();
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Compact Top Header Bar */}
      <header className="app-header">
        <div className="header-container">
          {/* Left: Sandwich / Hamburger Menu Trigger Button */}
          <button 
            className="sandwich-menu-trigger-btn"
            onClick={() => setIsDrawerOpen(true)}
            title="Menüyü Aç (Sandviç Menü)"
          >
            <Menu className="icon-menu" />
            <span className="menu-btn-label">Menü</span>
          </button>

          {/* Center/Left: Brand Logo */}
          <div className="brand" onClick={() => handleNavClick(() => onSwitchMode('embedded-bank'))}>
            <div className="logo-icon">
              <Brain className="brain-svg" />
            </div>
            <div className="brand-text">
              <h1 className="title">LEARN<span className="ai-badge">AI</span></h1>
            </div>
          </div>

          {/* Right: Stats & Quick User Profile */}
          <div className="header-actions">
            {/* Streak Counter */}
            <div className="stat-pill streak-pill" title="Günlük Çalışma Serisi">
              <Flame className="icon flame-icon" />
              <span className="stat-val">{stats.streakDays}d</span>
            </div>

            {/* XP Counter */}
            <div className="stat-pill xp-pill" title="Toplam XP">
              <Award className="icon xp-icon" />
              <span className="stat-val">{stats.xp} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* ==========================================================================
         Left Slide-Over Sandwich Drawer Navigation (Sandviç Menü)
         ========================================================================== */}
      {isDrawerOpen && (
        <div className="sandwich-drawer-backdrop" onClick={() => setIsDrawerOpen(false)}>
          <div className="sandwich-drawer-panel" onClick={(e) => e.stopPropagation()}>
            
            {/* Drawer Header */}
            <div className="drawer-header">
              <div className="drawer-brand">
                <div className="logo-icon">
                  <Brain className="brain-svg" />
                </div>
                <span className="drawer-title">LEARN.AI</span>
              </div>
              <button 
                className="drawer-close-btn"
                onClick={() => setIsDrawerOpen(false)}
                title="Kapat"
              >
                <X />
              </button>
            </div>

            {/* User Profile Summary Box */}
            <div className="drawer-user-card">
              {currentUser ? (
                <div className="user-info-row">
                  <span className="user-avatar-lg">{currentUser.avatar || '🎓'}</span>
                  <div className="user-text-meta">
                    <span className="user-name-text">{currentUser.name}</span>
                    <span className="user-email-text">{currentUser.email}</span>
                  </div>
                  <button 
                    className="drawer-logout-btn" 
                    onClick={() => handleNavClick(onLogout)} 
                    title="Çıkış Yap"
                  >
                    <LogOut className="btn-icon-xs" />
                  </button>
                </div>
              ) : (
                <button 
                  className="drawer-login-btn" 
                  onClick={() => handleNavClick(onOpenAuth)}
                >
                  <LogIn className="btn-icon-sm" />
                  <span>Giriş Yap / Kayıt Ol</span>
                </button>
              )}
            </div>

            {/* Navigation Links Group */}
            <div className="drawer-nav-group">
              <span className="drawer-section-title">ANA UYGULAMA MENÜSÜ</span>

              <button
                className={`drawer-nav-item ${activeMode === 'embedded-bank' ? 'active' : ''}`}
                onClick={() => handleNavClick(() => onSwitchMode('embedded-bank'))}
              >
                <BookOpen className="drawer-item-icon" />
                <div className="drawer-item-meta">
                  <span className="item-title">📖 Soru Bankası</span>
                  <span className="item-sub">YKS Test & Çözümler</span>
                </div>
              </button>

              <button
                className={`drawer-nav-item ${activeMode === 'flashcards' ? 'active' : ''}`}
                onClick={() => handleNavClick(() => onSwitchMode('flashcards'))}
              >
                <Layers className="drawer-item-icon" />
                <div className="drawer-item-meta">
                  <span className="item-title">🎴 Flashcard Kütüphanesi</span>
                  <span className="item-sub">Aralıklı Tekrar Kartları</span>
                </div>
              </button>

              <button
                className={`drawer-nav-item ${activeMode === 'journal' ? 'active' : ''}`}
                onClick={() => handleNavClick(() => onSwitchMode('journal'))}
              >
                <BookOpenCheck className="drawer-item-icon" />
                <div className="drawer-item-meta">
                  <span className="item-title">📓 Günlük & Saatlik Kayıt</span>
                  <span className="item-sub">Ses, Fotoğraf & Çalışma Notu</span>
                </div>
              </button>

              <button
                className={`drawer-nav-item ${activeMode === 'planner' ? 'active' : ''}`}
                onClick={() => handleNavClick(() => onSwitchMode('planner'))}
              >
                <CheckSquare className="drawer-item-icon" />
                <div className="drawer-item-meta">
                  <span className="item-title">📋 Planlar & Yapılacaklar</span>
                  <span className="item-sub">Günlük Çalışma Hedefleri</span>
                </div>
              </button>

              <button
                className={`drawer-nav-item ${activeMode === 'industrial-engineering' ? 'active' : ''}`}
                onClick={() => handleNavClick(() => onSwitchMode('industrial-engineering'))}
              >
                <Factory className="drawer-item-icon" />
                <div className="drawer-item-meta">
                  <span className="item-title">🏗️ Endüstri Mühendisliği</span>
                  <span className="item-sub">MRP, BOM, SQL & Üretim</span>
                </div>
              </button>

              <button
                className={`drawer-nav-item ${activeMode === 'trade' ? 'active' : ''}`}
                onClick={() => handleNavClick(() => onSwitchMode('trade'))}
              >
                <TrendingUp className="drawer-item-icon" />
                <div className="drawer-item-meta">
                  <span className="item-title">📈 Trade & Finansal Piyasalar</span>
                  <span className="item-sub">Market Structure, FVG & CHoCH</span>
                </div>
              </button>
            </div>

            {/* Quick Actions & Extras */}
            <div className="drawer-nav-group margin-top-auto">
              <span className="drawer-section-title">KÜTÜPHANE VE ARAÇLAR</span>

              <button 
                className="drawer-nav-item"
                onClick={() => handleNavClick(onOpenBookmarks)}
              >
                <Bookmark className="drawer-item-icon" />
                <div className="drawer-item-meta">
                  <span className="item-title">💾 Kaydedilen Sorular</span>
                  <span className="item-sub">Yer İmleri & Favoriler</span>
                </div>
              </button>

              <button 
                className="drawer-nav-item"
                onClick={() => handleNavClick(onOpenStats)}
              >
                <BarChart2 className="drawer-item-icon" />
                <div className="drawer-item-meta">
                  <span className="item-title">📊 Başarı İstatistikleri</span>
                  <span className="item-sub">XP & Ders Analitiği</span>
                </div>
              </button>

              <button 
                className="drawer-nav-item"
                onClick={() => handleNavClick(onOpenSettings)}
              >
                <Settings className="drawer-item-icon" />
                <div className="drawer-item-meta">
                  <span className="item-title">⚙️ Ayarlar</span>
                  <span className="item-sub">Model & Ses Tercihleri</span>
                </div>
              </button>

              <div className="drawer-nav-item">
                <Moon className="drawer-item-icon text-indigo" />
                <div className="drawer-item-meta">
                  <span className="item-title">🖤 Tema: Tek Siyah (Pitch Black)</span>
                  <span className="item-sub">Sadece Koyu Siyah Tema Aktif</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="drawer-footer">
              <span>Learn.AI v2.5 • Full Screen View Mode</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
