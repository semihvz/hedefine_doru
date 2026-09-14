import React, { useState, useEffect } from 'react';
import type { Quiz, Question, QuizAttempt } from '../types/quiz';
import { useAuth } from '../context/AuthContext';
import { Award, Clock, ArrowRight, ArrowLeft, RefreshCw, BookOpen, PlusCircle, Check, HelpCircle as HelpIcon, Sparkles, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { QuestionManagerModal } from './QuestionManagerModal';
import { audioService } from '../services/audioService';
import { FormattedMathText } from './FormattedMathText';
import { apiUrl } from '../utils/api';

export const QuestionBankView: React.FC<{ onOpenAuthModal: () => void }> = ({ onOpenAuthModal }) => {
  const { user, accessToken, addToast } = useAuth();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  
  // State for user answers: { [questionId: string]: 'A'|'B'|'C'|'D'|'E' }
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showTopicSummary, setShowTopicSummary] = useState<boolean>(false);
  const [topicPage, setTopicPage] = useState<number>(0);
  const [instantFeedbackMode, setInstantFeedbackMode] = useState<boolean>(true);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Helper to split topic summary into page-by-page slides
  const parseTopicPages = (summaryText?: string): string[] => {
    if (!summaryText) return [];
    const splitSections = summaryText.split(/(?=\n\n(?:\d+️⃣|📌|📖|📚|\d+\.))/).map((s) => s.trim()).filter(Boolean);
    if (splitSections.length > 1) {
      return splitSections;
    }
    const paragraphs = summaryText.split(/\n\n+/).map((s) => s.trim()).filter(Boolean);
    if (paragraphs.length > 1) {
      return paragraphs;
    }
    return [summaryText];
  };

  // Result state
  const [quizResult, setQuizResult] = useState<QuizAttempt | null>(null);
  const [myAttempts, setMyAttempts] = useState<QuizAttempt[]>([]);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState<boolean>(false);

  // Fetch available quizzes
  const fetchQuizzes = async () => {
    try {
      const res = await fetch(apiUrl('/api/quizzes'));
      const data = await res.json();
      if (data.success) {
        setQuizzes(data.quizzes || []);
      }
    } catch (e) {
      console.error('Quiz list fetch error:', e);
    }
  };

  // Fetch my attempts
  const fetchMyAttempts = async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(apiUrl('/api/quizzes/attempts/my'), {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setMyAttempts(data.attempts || []);
      }
    } catch (e) {
      console.error('Fetch my attempts error:', e);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    if (user) {
      fetchMyAttempts();
    }
  }, [user, accessToken]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Start solving a quiz
  const handleStartQuiz = async (quiz: Quiz) => {
    try {
      const res = await fetch(apiUrl(`/api/quizzes/${quiz.id}/questions`));
      const data = await res.json();
      if (data.success && data.questions && data.questions.length > 0) {
        setSelectedQuiz(quiz);
        setQuestions(data.questions);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setQuizResult(null);
        setShowExplanation(false);
        setShowTopicSummary(false);
        setTopicPage(0);
        setTimerSeconds(0);
        setIsTimerRunning(true);
      } else {
        addToast('Bu test içerisinde henüz soru bulunmuyor.', 'info');
      }
    } catch (e) {
      addToast('Sorular yüklenirken hata oluştu.', 'error');
    }
  };

  // Select an option (A, B, C, D, E)
  const handleSelectOption = (questionId: string, optionKey: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey
    }));

    if (currentQuestion) {
      const selectedOpt = currentQuestion.options.find(
        (o) => (o.option_key || o.key || o.id) === optionKey
      );
      const isCorrect = selectedOpt && (selectedOpt.is_correct === 1 || selectedOpt.isCorrect === true || selectedOpt.isCorrect === 1);

      if (isCorrect) {
        audioService.playCorrectSound(true);
        audioService.triggerHaptic('success');
      } else {
        audioService.playIncorrectSound(true);
        audioService.triggerHaptic('warning');
      }
    }

    if (instantFeedbackMode) {
      setShowExplanation(true);
    }
  };

  // Submit test to backend
  const handleSubmitQuiz = async () => {
    if (!user) {
      addToast('Testi tamamlamak ve skorunuzu kaydetmek için lütfen giriş yapın.', 'info');
      onOpenAuthModal();
      return;
    }

    if (!selectedQuiz) return;

    setSubmitting(true);
    setIsTimerRunning(false);

    try {
      const res = await fetch(apiUrl(`/api/quizzes/${selectedQuiz.id}/submit`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          answers: userAnswers,
          duration_seconds: timerSeconds
        })
      });

      const data = await res.json();
      setSubmitting(false);

      if (data.success && data.attempt) {
        setQuizResult(data.attempt);
        addToast(`Test Tamamlandı! Skorunuz: ${data.attempt.score} Puan`, 'success');
        fetchMyAttempts();
      } else {
        addToast(data.error || 'Test gönderimi başarısız.', 'error');
      }
    } catch (e) {
      setSubmitting(false);
      addToast('Sunucu hatası.', 'error');
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-300">
              <BookOpen className="w-7 h-7" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Interaktif Soru Bankası & Test Çözücü</h2>
            <p className="text-xs text-slate-400 mt-1">Soru numarası, metni, A-E şıkları ve detaylı çözümleri ile veritabanı destekli sınav modülü.</p>
          </div>
        </div>

        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setIsAddQuestionModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white text-xs font-semibold shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yeni Soru Ekle (Admin)</span>
          </button>
        )}
      </div>

      {/* VIEW 1: SELECT A QUIZ */}
      {!selectedQuiz && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>Mevcut Soru Bankaları ve Testler</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 shadow-xl transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-950 border border-indigo-500/30 text-indigo-300">
                      {quiz.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {quiz.question_count || 0} Soru
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {quiz.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>

                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Testi Çözmeye Başla</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* MY PAST ATTEMPTS */}
          {user && myAttempts.length > 0 && (
            <div className="mt-12 space-y-4">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Geçmiş Test Başarı Geçmişim</span>
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
                <table className="w-full text-left border-collapse text-xs text-slate-300">
                  <thead>
                    <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                      <th className="p-4">Test Adı</th>
                      <th className="p-4">Tarih</th>
                      <th className="p-4">Skor</th>
                      <th className="p-4">Doğru / Yanlış</th>
                      <th className="p-4">Süre</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {myAttempts.map((att) => (
                      <tr key={att.id} className="hover:bg-slate-800/30">
                        <td className="p-4 font-semibold text-slate-100">{att.quiz_title}</td>
                        <td className="p-4 text-slate-400 font-mono">{new Date(att.completed_at).toLocaleString('tr-TR')}</td>
                        <td className="p-4 font-mono font-bold text-emerald-400">{att.score} Puan</td>
                        <td className="p-4 font-mono">
                          <span className="text-emerald-400 font-bold">{att.correct_count} D</span> / <span className="text-rose-400 font-bold">{att.wrong_count} Y</span>
                        </td>
                        <td className="p-4 font-mono text-slate-400">{formatTimer(att.duration_seconds)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: ACTIVE QUIZ SOLVER */}
      {selectedQuiz && !quizResult && currentQuestion && (
        <div className="space-y-6">
          
          {/* Quiz Status Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedQuiz(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-sm font-bold text-slate-100">{selectedQuiz.title}</h3>
                <span className="text-[11px] text-slate-400">Soru {currentQuestionIndex + 1} / {questions.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              {/* Instant Feedback Toggle */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-300">Anında Cevap Göster:</span>
                <button
                  type="button"
                  onClick={() => setInstantFeedbackMode(!instantFeedbackMode)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-all ${
                    instantFeedbackMode ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-slate-700'
                  }`}
                  title="İşaretlendiğinde doğru/yanlış ve sorunun cevabını anında gösterir"
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      instantFeedbackMode ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Testi Bitir ve Gönder</span>
              </button>
            </div>
          </div>

          {/* QUESTION CARD */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-2xl space-y-6">
            
            {/* Question Header, Navigation & Action Bar (ÜST ALAN) */}
            <div className="space-y-4 pb-4 border-b border-slate-800/60">
              
              {/* Top Bar: Question Badge, Instant Feedback Badge & Navigation Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md">
                    Soru #{currentQuestion.question_number || currentQuestionIndex + 1} / {questions.length}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {currentQuestion.points || 10} Puan
                  </span>
                </div>

                {/* TOP NAVIGATION BUTTONS (Önceki Soru / Sonraki Soru) */}
                <div className="flex items-center gap-3">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => {
                      setCurrentQuestionIndex((prev) => prev - 1);
                      setShowExplanation(false);
                      setShowTopicSummary(false);
                      setTopicPage(0);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-semibold disabled:opacity-40 transition-all shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Önceki Soru</span>
                  </button>

                  <button
                    disabled={currentQuestionIndex === questions.length - 1}
                    onClick={() => {
                      setCurrentQuestionIndex((prev) => prev + 1);
                      setShowExplanation(false);
                      setShowTopicSummary(false);
                      setTopicPage(0);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 disabled:opacity-40 transition-all"
                  >
                    <span>Sonraki Soru</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* TOP ACTION TOGGLE BUTTONS (Çözüm Açıklaması & Konu Anlatımı & Özeti) */}
              {(currentQuestion.explanation || currentQuestion.topic_summary) && (
                <div className="pt-2 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {currentQuestion.explanation && (
                      <button
                        type="button"
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-950/70 border border-indigo-500/30 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/60 transition-all"
                      >
                        <HelpIcon className="w-4 h-4 text-indigo-400" />
                        <span>{showExplanation ? '💡 Çözüm Açıklamasını Gizle' : '💡 Çözüm Açıklamasını Göster'}</span>
                      </button>
                    )}

                    {currentQuestion.topic_summary && (
                      <button
                        type="button"
                        onClick={() => setShowTopicSummary(!showTopicSummary)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-950/70 border border-purple-500/30 text-xs font-semibold text-purple-300 hover:bg-purple-900/60 transition-all"
                      >
                        <BookOpen className="w-4 h-4 text-purple-400" />
                        <span>{showTopicSummary ? '📖 Konu Anlatımını Gizle' : '📖 Konu Anlatımı & Özeti Göster'}</span>
                      </button>
                    )}

                    {instantFeedbackMode && userAnswers[currentQuestion.id] && (
                      <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-950/80 border border-amber-500/40 text-amber-300 flex items-center gap-1.5 ml-auto">
                        <Zap className="w-3.5 h-3.5" /> Anında Çözüm Gösteriliyor
                      </span>
                    )}
                  </div>

                  {/* 💡 Çözüm Açıklaması Box */}
                  {showExplanation && currentQuestion.explanation && (
                    <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 text-xs text-indigo-100 leading-relaxed animate-fade-in space-y-1.5 shadow-lg">
                      <div className="flex items-center gap-2 font-bold text-indigo-300 text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span>Soru Çözüm Açıklaması</span>
                      </div>
                      <div className="whitespace-pre-line text-indigo-200 font-mono leading-relaxed">
                        <FormattedMathText text={
                          typeof currentQuestion.explanation === 'string'
                            ? currentQuestion.explanation
                            : currentQuestion.explanation?.whyCorrect || JSON.stringify(currentQuestion.explanation)
                        } />
                      </div>
                    </div>
                  )}

                  {/* 📖 Konu Anlatımı Paginated Slide Box */}
                  {showTopicSummary && currentQuestion.topic_summary && (() => {
                    const topicPages = parseTopicPages(currentQuestion.topic_summary);
                    const totalPages = topicPages.length;
                    const currentPageContent = topicPages[Math.min(topicPage, totalPages - 1)] || currentQuestion.topic_summary;

                    return (
                      <div className="p-5 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-xs text-purple-100 leading-relaxed animate-fade-in space-y-4 shadow-xl">
                        {/* Paginated Header Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-purple-500/30">
                          <div className="flex items-center gap-2 font-bold text-purple-300 text-xs uppercase tracking-wider">
                            <BookOpen className="w-4 h-4 text-purple-400" />
                            <span>Konu Anlatımı & Özeti</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-900/90 border border-purple-500/40 text-purple-200 font-mono text-[11px] font-semibold">
                              Sayfa {topicPage + 1} / {totalPages}
                            </span>
                          </div>

                          {/* Page Navigation Buttons */}
                          {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={topicPage === 0}
                                onClick={() => setTopicPage((prev) => Math.max(0, prev - 1))}
                                className="px-3 py-1 rounded-xl bg-purple-900/70 border border-purple-500/30 text-purple-200 hover:bg-purple-800/60 text-xs font-semibold disabled:opacity-30 transition-all flex items-center gap-1"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Önceki Konu</span>
                              </button>

                              <button
                                type="button"
                                disabled={topicPage >= totalPages - 1}
                                onClick={() => setTopicPage((prev) => Math.min(totalPages - 1, prev + 1))}
                                className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md disabled:opacity-30 transition-all flex items-center gap-1"
                              >
                                <span>Sonraki Konu</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Active Slide Content with KaTeX Math Rendering */}
                        <div className="min-h-[90px] font-sans text-purple-100 whitespace-pre-line leading-relaxed text-sm">
                          <FormattedMathText text={currentPageContent} />
                        </div>

                        {/* Page Dots & Navigation Bar */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between pt-3 border-t border-purple-500/20 text-[11px] text-purple-300">
                            <div className="flex items-center gap-1.5">
                              {Array.from({ length: totalPages }).map((_, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setTopicPage(idx)}
                                  className={`h-2 rounded-full transition-all ${
                                    topicPage === idx ? 'w-6 bg-purple-400' : 'w-2 bg-purple-800/80 hover:bg-purple-700'
                                  }`}
                                  title={`Sayfa ${idx + 1}`}
                                />
                              ))}
                            </div>
                            <span className="font-mono text-purple-300/80 font-semibold">
                              {topicPage === 0 ? '📌 Soruya Özel Not' : `📚 Konu Başlığı #${topicPage}`}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>

            {/* Question Text with KaTeX Math Rendering */}
            <div className="text-lg font-medium text-slate-100 leading-relaxed font-sans select-text">
              <FormattedMathText text={currentQuestion.question_text || currentQuestion.question || ''} />
            </div>

            {/* Options List (A, B, C, D, E) */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Şıklar:</span>
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((opt, idx) => {
                  const optKey = opt.option_key || opt.key || String.fromCharCode(65 + idx);
                  const optText = opt.option_text || opt.text || '';
                  const userSelected = userAnswers[currentQuestion.id] === optKey;
                  const isAnswered = !!userAnswers[currentQuestion.id];
                  const isCorrectOption = opt.is_correct === 1 || opt.isCorrect === true || opt.isCorrect === 1;

                  // Card styling states
                  let cardStyle = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950';
                  let badgeStyle = 'bg-slate-900 border-slate-800 text-slate-400';
                  let statusIcon = null;

                  if (instantFeedbackMode && isAnswered) {
                    if (userSelected && isCorrectOption) {
                      cardStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-100 shadow-lg shadow-emerald-500/10 scale-[1.01]';
                      badgeStyle = 'bg-emerald-600 border-emerald-400 text-white';
                      statusIcon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
                    } else if (userSelected && !isCorrectOption) {
                      cardStyle = 'bg-rose-950/90 border-rose-500 text-rose-100 shadow-lg shadow-rose-500/10 scale-[1.01]';
                      badgeStyle = 'bg-rose-600 border-rose-400 text-white';
                      statusIcon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
                    } else if (!userSelected && isCorrectOption) {
                      cardStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200';
                      badgeStyle = 'bg-emerald-900 border-emerald-500 text-emerald-200';
                      statusIcon = <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">Doğru Cevap</span>;
                    }
                  } else if (userSelected) {
                    cardStyle = 'bg-indigo-950/80 border-indigo-500 text-indigo-100 shadow-lg shadow-indigo-500/10 scale-[1.01]';
                    badgeStyle = 'bg-indigo-600 border-indigo-400 text-white';
                  }

                  return (
                    <button
                      key={opt.id || idx}
                      onClick={() => handleSelectOption(currentQuestion.id, optKey)}
                      className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-200 ${cardStyle}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 border ${badgeStyle}`}>
                          {optKey}
                        </div>
                        <span className="text-sm font-medium leading-relaxed">
                          <FormattedMathText text={optText} />
                        </span>
                      </div>
                      {statusIcon}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Navigation Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => {
                  setCurrentQuestionIndex((prev) => prev - 1);
                  setShowExplanation(false);
                  setShowTopicSummary(false);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-semibold disabled:opacity-40 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Önceki Soru</span>
              </button>

              <button
                disabled={currentQuestionIndex === questions.length - 1}
                onClick={() => {
                  setCurrentQuestionIndex((prev) => prev + 1);
                  setShowExplanation(false);
                  setShowTopicSummary(false);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md disabled:opacity-40 transition-all"
              >
                <span>Sonraki Soru</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* VIEW 3: QUIZ RESULT SUMMARY */}
      {quizResult && (
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 text-center animate-fade-in max-w-2xl mx-auto">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-slate-100">{quizResult.quiz_title}</h3>
            <p className="text-xs text-slate-400 mt-1">Test Başarıyla Tamamlandı!</p>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono">
            <div>
              <span className="text-slate-400 text-xs block">Toplam Skor</span>
              <span className="text-2xl font-bold text-emerald-400">{quizResult.score} Puan</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">Doğru / Yanlış</span>
              <span className="text-xl font-bold text-slate-200">{quizResult.correct_count}D / {quizResult.wrong_count}Y</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">Geçen Süre</span>
              <span className="text-xl font-bold text-indigo-400">{formatTimer(quizResult.duration_seconds)}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedQuiz(null);
              setQuizResult(null);
            }}
            className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition-all"
          >
            Soru Bankasına Dön
          </button>
        </div>
      )}

      {/* ADMIN ADD QUESTION MODAL */}
      <QuestionManagerModal
        isOpen={isAddQuestionModalOpen}
        onClose={() => setIsAddQuestionModalOpen(false)}
        quizzes={quizzes}
        onQuestionAdded={fetchQuizzes}
      />

    </div>
  );
};
