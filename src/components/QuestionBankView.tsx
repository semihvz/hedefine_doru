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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 sm:p-8 rounded-sm bg-[#111115] border border-zinc-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-sm bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase block mb-1">
              SINAV VE SORU MODÜLÜ
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Soru Bankası & Test Çözücü
            </h2>
            <p className="text-xs text-zinc-400 mt-1">ÖSYM formatındaki sınav soruları ve detaylı çözümler.</p>
          </div>
        </div>

        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setIsAddQuestionModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-sm bg-zinc-100 hover:bg-white text-black text-xs font-bold uppercase tracking-wider transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yeni Soru Ekle</span>
          </button>
        )}
      </div>

      {/* VIEW 1: SELECT A QUIZ */}
      {!selectedQuiz && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <span>Mevcut Soru Bankaları</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-6 rounded-sm bg-[#111115] border border-zinc-800 hover:border-zinc-600 shadow-xl transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-bold tracking-wider uppercase bg-zinc-900 border border-zinc-700 text-zinc-300">
                      {quiz.category || 'ÖSYM'}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {quiz.question_count ? `${quiz.question_count} Soru` : 'ÖSYM Soru Bankası'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors">
                    {quiz.title}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    {quiz.description || 'TYT / AYT hazırlığı için özel hazırlanmış sınav soruları.'}
                  </p>
                </div>

                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full py-2.5 rounded-sm bg-zinc-100 hover:bg-white text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Testi Başlat</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* MY PAST ATTEMPTS */}
          {user && myAttempts.length > 0 && (
            <div className="mt-12 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                <Award className="w-4 h-4 text-zinc-300" />
                <span>Geçmiş Test Başarı Geçmişim</span>
              </h3>

              <div className="overflow-x-auto rounded-sm border border-zinc-800 bg-[#111115]">
                <table className="w-full text-left border-collapse text-xs text-zinc-300 font-mono">
                  <thead>
                    <tr className="bg-zinc-900 text-zinc-400 uppercase border-b border-zinc-800 text-[10px]">
                      <th className="p-4">Test Adı</th>
                      <th className="p-4">Tarih</th>
                      <th className="p-4">Skor</th>
                      <th className="p-4">Doğru / Yanlış</th>
                      <th className="p-4">Süre</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {myAttempts.map((att) => (
                      <tr key={att.id} className="hover:bg-zinc-900/50">
                        <td className="p-4 font-semibold text-zinc-100 font-sans">{att.quiz_title}</td>
                        <td className="p-4 text-zinc-500 font-mono text-[11px]">{new Date(att.completed_at).toLocaleString('tr-TR')}</td>
                        <td className="p-4 font-mono font-bold text-emerald-400">{att.score} Puan</td>
                        <td className="p-4 font-mono">
                          <span className="text-emerald-400 font-bold">{att.correct_count} D</span> / <span className="text-rose-400 font-bold">{att.wrong_count} Y</span>
                        </td>
                        <td className="p-4 font-mono text-zinc-400">{formatTimer(att.duration_seconds)}</td>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-sm bg-[#111115] border border-zinc-800 shadow-lg">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedQuiz(null)}
                className="p-2 rounded-sm bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-sm font-bold text-white">{selectedQuiz.title}</h3>
                <span className="text-xs font-mono text-zinc-400">Soru {currentQuestionIndex + 1} / {questions.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              {/* Instant Feedback Toggle */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-zinc-950 border border-zinc-800 text-xs font-mono font-bold">
                <Zap className="w-3.5 h-3.5 text-zinc-300" />
                <span className="text-zinc-300">Anında Cevap Göster:</span>
                <button
                  type="button"
                  onClick={() => setInstantFeedbackMode(!instantFeedbackMode)}
                  className={`w-9 h-5 rounded-none p-0.5 transition-all ${
                    instantFeedbackMode ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                  title="İşaretlendiğinde doğru/yanlış ve sorunun cevabını anında gösterir"
                >
                  <div
                    className={`w-4 h-4 rounded-none bg-black transition-transform ${
                      instantFeedbackMode ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-zinc-950 border border-zinc-800 text-xs font-mono font-bold text-zinc-200">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="px-5 py-2 rounded-sm bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Testi Bitir ve Gönder</span>
              </button>
            </div>
          </div>

          {/* QUESTION CARD */}
          <div className="p-8 rounded-sm bg-[#111115] border border-zinc-800 shadow-2xl space-y-6">
            
            {/* Question Header, Navigation & Action Bar (ÜST ALAN) */}
            <div className="space-y-4 pb-4 border-b border-zinc-800">
              
              {/* Top Bar: Question Badge, Instant Feedback Badge & Navigation Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-sm bg-zinc-900 border border-zinc-700 text-white font-mono font-bold text-xs">
                    Soru #{currentQuestion.question_number || currentQuestionIndex + 1} / {questions.length}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
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
                    className="flex items-center gap-2 px-4 py-2 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs font-mono font-bold uppercase disabled:opacity-40 transition-all"
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
                    className="flex items-center gap-2 px-4 py-2 rounded-sm bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-mono font-bold uppercase disabled:opacity-40 transition-all"
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
                        className="flex items-center gap-2 px-3.5 py-2 rounded-sm bg-zinc-950 border border-zinc-800 text-xs font-mono font-bold uppercase text-zinc-300 hover:bg-zinc-900 transition-all"
                      >
                        <HelpIcon className="w-4 h-4 text-zinc-400" />
                        <span>{showExplanation ? '💡 Çözüm Açıklamasını Gizle' : '💡 Çözüm Açıklamasını Göster'}</span>
                      </button>
                    )}

                    {currentQuestion.topic_summary && (
                      <button
                        type="button"
                        onClick={() => setShowTopicSummary(!showTopicSummary)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-sm bg-zinc-950 border border-zinc-800 text-xs font-mono font-bold uppercase text-zinc-300 hover:bg-zinc-900 transition-all"
                      >
                        <BookOpen className="w-4 h-4 text-zinc-400" />
                        <span>{showTopicSummary ? '📖 Konu Anlatımını Gizle' : '📖 Konu Anlatımı & Özeti Göster'}</span>
                      </button>
                    )}

                    {instantFeedbackMode && userAnswers[currentQuestion.id] && (
                      <span className="px-3 py-1.5 rounded-sm text-xs font-mono font-bold uppercase bg-amber-950/80 border border-amber-500/40 text-amber-300 flex items-center gap-1.5 ml-auto">
                        <Zap className="w-3.5 h-3.5" /> Anında Çözüm Gösteriliyor
                      </span>
                    )}
                  </div>

                  {/* 💡 Çözüm Açıklaması Box */}
                  {showExplanation && currentQuestion.explanation && (
                    <div className="p-4 rounded-sm bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 leading-relaxed animate-fade-in space-y-1.5 shadow-lg">
                      <div className="flex items-center gap-2 font-mono font-bold text-zinc-200 text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-zinc-400" />
                        <span>Soru Çözüm Açıklaması</span>
                      </div>
                      <div className="whitespace-pre-line text-zinc-300 font-mono leading-relaxed">
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
                      <div className="p-5 rounded-sm bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 leading-relaxed animate-fade-in space-y-4 shadow-xl">
                        {/* Paginated Header Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                          <div className="flex items-center gap-2 font-mono font-bold text-zinc-200 text-xs uppercase tracking-wider">
                            <BookOpen className="w-4 h-4 text-zinc-400" />
                            <span>Konu Anlatımı & Özeti</span>
                            <span className="px-2.5 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[11px] font-semibold">
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
                                className="px-3 py-1 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs font-mono font-bold uppercase disabled:opacity-30 transition-all flex items-center gap-1"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Önceki Konu</span>
                              </button>

                              <button
                                type="button"
                                disabled={topicPage >= totalPages - 1}
                                onClick={() => setTopicPage((prev) => Math.min(totalPages - 1, prev + 1))}
                                className="px-3 py-1 rounded-sm bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-mono font-bold uppercase shadow-md disabled:opacity-30 transition-all flex items-center gap-1"
                              >
                                <span>Sonraki Konu</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Active Slide Content with KaTeX Math Rendering */}
                        <div className="min-h-[90px] font-sans text-zinc-200 whitespace-pre-line leading-relaxed text-sm">
                          <FormattedMathText text={currentPageContent} />
                        </div>

                        {/* Page Dots & Navigation Bar */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 font-mono">
                            <div className="flex items-center gap-1.5">
                              {Array.from({ length: totalPages }).map((_, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setTopicPage(idx)}
                                  className={`h-2 rounded-none transition-all ${
                                    topicPage === idx ? 'w-6 bg-zinc-100' : 'w-2 bg-zinc-800 hover:bg-zinc-700'
                                  }`}
                                  title={`Sayfa ${idx + 1}`}
                                />
                              ))}
                            </div>
                            <span className="font-mono text-zinc-400 font-semibold uppercase">
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
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">Şıklar:</span>
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((opt, idx) => {
                  const optKey = opt.option_key || opt.key || String.fromCharCode(65 + idx);
                  const optText = opt.option_text || opt.text || '';
                  const userSelected = userAnswers[currentQuestion.id] === optKey;
                  const isAnswered = !!userAnswers[currentQuestion.id];
                  const isCorrectOption = opt.is_correct === 1 || opt.isCorrect === true || opt.isCorrect === 1;

                  // Card styling states
                  let cardStyle = 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-950';
                  let badgeStyle = 'bg-zinc-900 border-zinc-800 text-zinc-400';
                  let statusIcon = null;

                  if (instantFeedbackMode && isAnswered) {
                    if (userSelected && isCorrectOption) {
                      cardStyle = 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium';
                      badgeStyle = 'bg-emerald-600 text-white border-emerald-500';
                      statusIcon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
                    } else if (userSelected && !isCorrectOption) {
                      cardStyle = 'bg-rose-950/30 border-rose-500/50 text-rose-200 font-medium';
                      badgeStyle = 'bg-rose-600 text-white border-rose-500';
                      statusIcon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
                    } else if (!userSelected && isCorrectOption) {
                      cardStyle = 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200';
                      badgeStyle = 'bg-emerald-900 border-emerald-500 text-emerald-200';
                      statusIcon = <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded-sm bg-emerald-950 border border-emerald-800">Doğru Cevap</span>;
                    }
                  } else if (userSelected) {
                    cardStyle = 'bg-zinc-900 border-zinc-500 text-white shadow-md';
                    badgeStyle = 'bg-zinc-100 text-zinc-950 font-bold';
                  }

                  return (
                    <button
                      key={opt.id || idx}
                      onClick={() => handleSelectOption(currentQuestion.id, optKey)}
                      className={`flex items-center justify-between p-4 rounded-sm border text-left transition-all duration-200 ${cardStyle}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-sm font-mono font-bold text-xs flex items-center justify-center shrink-0 border ${badgeStyle}`}>
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
            <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => {
                  setCurrentQuestionIndex((prev) => prev - 1);
                  setShowExplanation(false);
                  setShowTopicSummary(false);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs font-mono font-bold uppercase disabled:opacity-40 transition-all"
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-mono font-bold uppercase disabled:opacity-40 transition-all"
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
        <div className="p-8 rounded-sm bg-[#111115] border border-zinc-800 shadow-2xl space-y-6 text-center animate-fade-in max-w-2xl mx-auto">
          <div className="w-20 h-20 mx-auto rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200 shadow-xl">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-white">{quizResult.quiz_title}</h3>
            <p className="text-xs font-mono text-zinc-400 mt-1 uppercase">Test Başarıyla Tamamlandı!</p>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 rounded-sm bg-zinc-950 border border-zinc-800 font-mono">
            <div>
              <span className="text-zinc-400 text-xs block uppercase">Toplam Skor</span>
              <span className="text-2xl font-bold text-emerald-400">{quizResult.score} Puan</span>
            </div>
            <div>
              <span className="text-zinc-400 text-xs block uppercase">Doğru / Yanlış</span>
              <span className="text-xl font-bold text-zinc-200">{quizResult.correct_count}D / {quizResult.wrong_count}Y</span>
            </div>
            <div>
              <span className="text-zinc-400 text-xs block uppercase">Geçen Süre</span>
              <span className="text-xl font-bold text-zinc-300">{formatTimer(quizResult.duration_seconds)}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedQuiz(null);
              setQuizResult(null);
            }}
            className="px-8 py-3 rounded-sm bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
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
