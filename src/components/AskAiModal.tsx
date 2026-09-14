import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, X, Send, Copy, Check, Lightbulb, HelpCircle, Compass, RefreshCw, BookmarkPlus } from 'lucide-react';
import { askGeminiAboutText } from '../services/aiService';
import { loadSettings } from '../services/storageService';
import { FormattedMathText } from './FormattedMathText';

interface AskAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
}

export const AskAiModal: React.FC<AskAiModalProps> = ({ isOpen, onClose, selectedText }) => {
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<{
    explanation: string;
    keyTakeaway?: string;
    relatedConcepts?: string[];
  } | null>(null);

  const settings = loadSettings();

  useEffect(() => {
    if (isOpen && selectedText) {
      // Automatically trigger initial explanation when opened with selected text
      handleAskAI();
    } else if (!isOpen) {
      setAiResult(null);
      setUserQuestion('');
    }
  }, [isOpen, selectedText]);

  const handleAskAI = async (customPrompt?: string) => {
    if (!selectedText) return;
    setLoading(true);
    setCopied(false);
    
    try {
      const q = customPrompt || userQuestion;
      const res = await askGeminiAboutText(
        selectedText,
        q,
        settings.apiKey,
        settings.selectedModel || 'gemini-2.5-flash'
      );
      setAiResult(res);
    } catch (err) {
      console.error('Ask AI error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!aiResult) return;
    const textToCopy = `${aiResult.explanation}\n\n${aiResult.keyTakeaway ? `Püf Noktası: ${aiResult.keyTakeaway}` : ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">YKS Yapay Zeka Asistanı</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Gemini AI
                </span>
              </div>
              <p className="text-xs text-slate-400">Seçili metin hakkında soru sor veya anında açıklama al</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Selected Text Preview Box */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/90 border border-indigo-500/30 relative group">
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1 flex items-center gap-1.5">
              <BookmarkPlus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Seçilen İçerik</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 italic font-medium line-clamp-4 leading-relaxed">
              "{selectedText}"
            </p>
          </div>

          {/* Quick Action Chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleAskAI('Bu kavramı anlaşılır ve özet bir dille açıkla.')}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-indigo-900/40 border border-slate-700/60 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-300 text-xs font-semibold transition-all"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Kavramı Açıkla</span>
            </button>
            <button
              onClick={() => handleAskAI('Bu konu YKS (TYT-AYT) sınavında nasıl sorulur ve çeldiricileri nelerdir?')}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-purple-900/40 border border-slate-700/60 hover:border-purple-500/50 text-slate-300 hover:text-purple-300 text-xs font-semibold transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>YKS'de Nasıl Çıkar?</span>
            </button>
            <button
              onClick={() => handleAskAI('Bu kavramla ilgili bilmem gereken formül, kural ve altın ipuçlarını ver.')}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-emerald-900/40 border border-slate-700/60 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 text-xs font-semibold transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Püf Noktaları</span>
            </button>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="py-8 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <p className="text-xs font-medium text-slate-400 animate-pulse">
                Yapay zeka yanıtı hazırlıyor...
              </p>
            </div>
          )}

          {/* AI Result View */}
          {!loading && aiResult && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Main Explanation Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-300">Öğretmen Açıklaması</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>

                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2 whitespace-pre-line font-sans">
                  <FormattedMathText text={aiResult.explanation} />
                </div>

                {/* Key Takeaway Card */}
                {aiResult.keyTakeaway && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-200 leading-snug">
                      <span className="font-bold text-amber-300">YKS Altın İpucu: </span>
                      <FormattedMathText text={aiResult.keyTakeaway} />
                    </div>
                  </div>
                )}

                {/* Related Concepts Chips */}
                {aiResult.relatedConcepts && aiResult.relatedConcepts.length > 0 && (
                  <div className="pt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400">İlişkili Konular:</span>
                    {aiResult.relatedConcepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-indigo-300"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
            placeholder="Seçili metin hakkında özel sorunuzu yazın..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={() => handleAskAI()}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Sor</span>
          </button>
        </div>

      </div>
    </div>
  );
};
