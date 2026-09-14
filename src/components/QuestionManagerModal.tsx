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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm bg-[#111115] border border-zinc-800 shadow-2xl p-6 space-y-6">
        
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-sm bg-zinc-900 text-zinc-200 border border-zinc-800">
              <PlusCircle className="w-5 h-5 text-zinc-200" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-zinc-400 uppercase block">
                YÖNETİCİ MODÜLÜ
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Yeni Soru & Şık Ekle</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Test Seçin</label>
              <select
                value={selectedQuizId}
                onChange={(e) => setSelectedQuizId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500"
              >
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title} ({q.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Soru Numarası</label>
              <input
                type="number"
                required
                min={1}
                value={questionNumber}
                onChange={(e) => setQuestionNumber(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Soru Puanı</label>
              <input
                type="number"
                required
                min={1}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Soru Metni (Markdown / KaTeX)</label>
            <textarea
              required
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Örn: \log_2(x - 3) = 4 denklemini sağlayan x değeri kaçtır?"
              className="w-full px-4 py-2.5 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Çözüm / Açıklama Metni (İsteğe Bağlı)</label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Sorunun adım adım çözümü ve detaylı açıklaması..."
              className="w-full px-4 py-2.5 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Konu Anlatımı & Özeti (İsteğe Bağlı)</label>
            <textarea
              rows={3}
              value={topicSummary}
              onChange={(e) => setTopicSummary(e.target.value)}
              placeholder="Sorunun ait olduğu konuyla ilgili kurallar, formüller ve özet bilgi..."
              className="w-full px-4 py-2.5 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 font-mono"
            />
          </div>

          {/* Options (A, B, C, D, E) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">Şıklar (A, B, C, D, E) ve Doğru Cevap:</label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">Şık A</label>
                <input
                  type="text"
                  required
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  placeholder="A Şıkkı Metni"
                  className="w-full px-3 py-2 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">Şık B</label>
                <input
                  type="text"
                  required
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  placeholder="B Şıkkı Metni"
                  className="w-full px-3 py-2 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">Şık C</label>
                <input
                  type="text"
                  required
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  placeholder="C Şıkkı Metni"
                  className="w-full px-3 py-2 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">Şık D</label>
                <input
                  type="text"
                  required
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  placeholder="D Şıkkı Metni"
                  className="w-full px-3 py-2 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">Şık E</label>
                <input
                  type="text"
                  required
                  value={optionE}
                  onChange={(e) => setOptionE(e.target.value)}
                  placeholder="E Şıkkı Metni"
                  className="w-full px-3 py-2 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Doğru Şık Hangisi?</label>
              <div className="flex gap-2">
                {(['A', 'B', 'C', 'D', 'E'] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCorrectOption(key)}
                    className={`flex-1 py-2 rounded-sm text-xs font-mono font-bold border transition-all ${
                      correctOption === key
                        ? 'bg-zinc-800 border-zinc-500 text-white shadow-md'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
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
            className="w-full py-2.5 rounded-sm bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            <span>Soruyu Veritabanına Kaydet</span>
          </button>

        </form>

      </div>
    </div>
  );
};
