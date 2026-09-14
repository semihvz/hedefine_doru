import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { AuthGuardWall } from './components/AuthGuardWall';
import { SessionsView } from './components/SessionsView';
import { AdminPanel } from './components/AdminPanel';
import { QuestionBankView } from './components/QuestionBankView';
import { DerslerView } from './components/DerslerView';
import { DenemelerView } from './components/DenemelerView';
import { HabitsTrackerView } from './components/HabitsTrackerView';
import { TodoListView } from './components/TodoListView';
import { ToastContainer } from './components/ToastContainer';
import { AskAiSelectionTooltip } from './components/AskAiSelectionTooltip';

const MainContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('quiz');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-20 md:pb-8">
        {!user ? (
          <AuthGuardWall
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onLoginSuccess={() => window.location.reload()}
          />
        ) : (
          <>
            {activeTab === 'quiz' && (
              <QuestionBankView onOpenAuthModal={() => setIsAuthModalOpen(true)} />
            )}
            {activeTab === 'denemeler' && (
              <DenemelerView
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />
            )}
            {activeTab === 'dersler' && (
              <DerslerView
                onNavigateToQuiz={(_category) => setActiveTab('quiz')}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />
            )}
            {activeTab === 'aliskanliklar' && <HabitsTrackerView />}
            {activeTab === 'todolist' && <TodoListView />}
            {activeTab === 'sessions' && <SessionsView />}
            {activeTab === 'admin' && <AdminPanel />}
          </>
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>Hedefine Doğru • YKS Deneme Sınavları & Güvenli Akıllı Öğrenme Platformu © 2026</p>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ToastContainer />
      <AskAiSelectionTooltip />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
