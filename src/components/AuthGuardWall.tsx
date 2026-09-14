import React from 'react';
import { Lock, LogIn, Zap, ShieldCheck, Sparkles, BookOpen, Layers } from 'lucide-react';
import { quickDemoLogin } from '../services/storageService';
import type { UserProfile } from '../types/quiz';

interface AuthGuardWallProps {
  onOpenAuth: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthGuardWall: React.FC<AuthGuardWallProps> = ({ onOpenAuth, onLoginSuccess }) => {
  const handleDemoLogin = () => {
    const user = quickDemoLogin();
    onLoginSuccess(user);
  };

  return (
    <div className="auth-guard-wall">
      <div className="guard-card">
        {/* Lock Shield Icon */}
        <div className="guard-icon-box">
          <Lock className="guard-lock-icon" />
        </div>

        <h2>🔒 Log In to Access Content</h2>
        <p className="guard-desc">
          You need to sign in to access the <strong>260+ Embedded Question Bank</strong> (Mathematics, Oxford English & Advanced SQL), 3D Flashcards, and Daily Journal in LEARN.
        </p>

        {/* Feature Highlights Grid */}
        <div className="guard-features-grid">
          <div className="guard-feature-item">
            <BookOpen className="feat-icon text-indigo" />
            <div>
              <strong>260+ Embedded Questions</strong>
              <span>Mathematics, Oxford & SQL Tests</span>
            </div>
          </div>
          <div className="guard-feature-item">
            <Sparkles className="feat-icon text-purple" />
            <div>
              <strong>KaTeX & Formulas</strong>
              <span>Advanced mathematical equation support</span>
            </div>
          </div>
          <div className="guard-feature-item">
            <Layers className="feat-icon text-amber" />
            <div>
              <strong>3D Flashcards</strong>
              <span>Visual formulas & quick reviews</span>
            </div>
          </div>
          <div className="guard-feature-item">
            <ShieldCheck className="feat-icon text-green" />
            <div>
              <strong>Personal Progress</strong>
              <span>XP points, streaks & saved items</span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="guard-actions">
          <button className="guard-primary-btn" onClick={onOpenAuth}>
            <LogIn className="btn-icon" />
            <span>Log In / Sign Up</span>
          </button>

          <button className="guard-demo-btn" onClick={handleDemoLogin}>
            <Zap className="btn-icon" />
            <span>⚡ Quick Demo Login (Try in Seconds)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
