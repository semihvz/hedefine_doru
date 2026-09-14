import React, { useState } from 'react';
import type { Quiz } from '../types/quiz';
import { useAuth } from '../context/AuthContext';
import { X, PlusCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { apiUrl } from '../utils/api';

interface QuestionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizzes: Quiz[];
  onQuestionAdded: () => void;
}

export const QuestionManagerModal: React.FC<QuestionManagerModalProps> = ({
  isOpen,
  onClose,
  quizzes,
  onQuestionAdded
}) => {
  const { accessToken, addToast } = useAuth();

  const [selectedQuizId, setSelectedQuizId] = useState<string>(quizzes[0]?.id || '');
  const [questionNumber, setQuestionNumber] = useState<number | string>(1);
  const [questionText, setQuestionText] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [topicSummary, setTopicSummary] = useState<string>('');
  const [points, setPoints] = useState<number | string>(10);

  // Options A, B, C, D, E
  const [optionA, setOptionA] = useState<string>('');
  const [optionB, setOptionB] = useState<string>('');
  const [optionC, setOptionC] = useState<string>('');
  const [optionD, setOptionD] = useState<string>('');
  const [optionE, setOptionE] = useState<string>('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');

  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedQuizId) {
      addToast('Lütfen soru eklenecek bir test seçin.', 'error');
      return;
    }

    if (!questionText.trim()) {
      addToast('Soru metni boş olamaz.', 'error');
      return;
    }

    if (!optionA || !optionB || !optionC || !optionD || !optionE) {
      addToast('Lütfen A, B, C, D ve E şıklarının tamamını doldurun.', 'error');
      return;
    }

    const optionsPayload = [
      { option_key: 'A', option_text: optionA, is_correct: correctOption === 'A' ? 1 : 0 },
      { option_key: 'B', option_text: optionB, is_correct: correctOption === 'B' ? 1 : 0 },
      { option_key: 'C', option_text: optionC, is_correct: correctOption === 'C' ? 1 : 0 },
      { option_key: 'D', option_text: optionD, is_correct: correctOption === 'D' ? 1 : 0 },
      { option_key: 'E', option_text: optionE, is_correct: correctOption === 'E' ? 1 : 0 }
    ];

    setSubmitting(true);

    try {
      const res = await fetch(apiUrl('/api/quizzes/admin/questions'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          quiz_id: selectedQuizId,
          question_number: Number(questionNumber),
          question_text: questionText,
          explanation: explanation,
          topic_summary: topicSummary,
          points: Number(points),
          options: optionsPayload
        })
      });

      const data = await res.json();
      setSubmitting(false);

      if (data.success) {
        addToast(`Soru #${questionNumber} başarıyla eklendi!`, 'success');
        setQuestionText('');
        setExplanation('');
        setTopicSummary('');
        setOptionA('');
        setOptionB('');
        setOptionC('');
        setOptionD('');
        setOptionE('');
        setQuestionNumber((prev) => Number(prev) + 1);
        onQuestionAdded();
        onClose();
      } else {
        addToast(data.error || 'Soru ekleme başarısız.', 'error');
      }
    } catch (err) {
      setSubmitting(false);
      addToast('Sunucu hatası.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900/95 border border-amber-500/30 shadow-2xl shadow-amber-500/10 p-6 space-y-6">
        
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Yeni Soru & Şık Ekle (Admin)</h3>
              <p className="text-xs text-slate-400">Veritabanına soru numarası, metni, A-E şıkları ve doğru cevabı kaydedin.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Test Seçin</label>
              <select
                value={selectedQuizId}
                onChange={(e) => setSelectedQuizId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              >
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title} ({q.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Soru Numarası</label>
              <input
                type="number"
                required
                min={1}
                value={questionNumber}
                onChange={(e) => setQuestionNumber(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Soru Puanı</label>
              <input
                type="number"
                required
                min={1}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Soru Metni (Markdown / KaTeX)</label>
            <textarea
              required
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Örn: \log_2(x - 3) = 4 denklemini sağlayan x değeri kaçtır?"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Çözüm / Açıklama Metni (İsteğe Bağlı)</label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Sorunun adım adım çözümü ve detaylı açıklaması..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Konu Anlatımı & Özeti (İsteğe Bağlı)</label>
            <textarea
              rows={3}
              value={topicSummary}
              onChange={(e) => setTopicSummary(e.target.value)}
              placeholder="Sorunun ait olduğu konuyla ilgili kurallar, formüller ve özet bilgi..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Options (A, B, C, D, E) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">Şıklar (A, B, C, D, E) ve Doğru Cevap:</label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Şık A</label>
                <input
                  type="text"
                  required
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  placeholder="A Şıkkı Metni"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Şık B</label>
                <input
                  type="text"
                  required
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  placeholder="B Şıkkı Metni"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Şık C</label>
                <input
                  type="text"
                  required
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  placeholder="C Şıkkı Metni"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Şık D</label>
                <input
                  type="text"
                  required
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  placeholder="D Şıkkı Metni"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Şık E</label>
                <input
                  type="text"
                  required
                  value={optionE}
                  onChange={(e) => setOptionE(e.target.value)}
                  placeholder="E Şıkkı Metni"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Doğru Şık Hangisi?</label>
              <div className="flex gap-2">
                {(['A', 'B', 'C', 'D', 'E'] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCorrectOption(key)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      correctOption === key
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Şık {key}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white font-semibold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            <span>Soruyu Veritabanına Kaydet</span>
          </button>

        </form>

      </div>
    </div>
  );
};
