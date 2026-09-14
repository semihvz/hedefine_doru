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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#111115] border border-zinc-800 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-zinc-100 text-black flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI ASİSTANI (ALADDIN AI)</h3>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm bg-zinc-800 border border-zinc-700 text-zinc-300 uppercase">
                  GEMINI AI
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Seçili metin hakkında soru sor veya anında açıklama al</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Selected Text Preview Box */}
          <div className="p-3.5 rounded-sm bg-zinc-900 border border-zinc-800 relative">
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
              <BookmarkPlus className="w-3.5 h-3.5 text-zinc-400" />
              <span>SEÇİLEN İÇERİK</span>
            </div>
            <p className="text-xs text-zinc-200 italic line-clamp-4 leading-relaxed">
              "{selectedText}"
            </p>
          </div>

          {/* Quick Action Chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleAskAI('Bu kavramı anlaşılır ve özet bir dille açıkla.')}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-medium transition-all"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
              <span>Kavramı Açıkla</span>
            </button>
            <button
              onClick={() => handleAskAI('Bu konu YKS (TYT-AYT) sınavında nasıl sorulur ve çeldiricileri nelerdir?')}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-medium transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
              <span>YKS'de Nasıl Çıkar?</span>
            </button>
            <button
              onClick={() => handleAskAI('Bu kavramla ilgili bilmem gereken formül, kural ve altın ipuçlarını ver.')}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-medium transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-zinc-400" />
              <span>Püf Noktaları</span>
            </button>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="py-8 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
              <p className="text-xs font-medium text-zinc-400">
                Yapay zeka yanıtı hazırlanıyor...
              </p>
            </div>
          )}

          {/* AI Result View */}
          {!loading && aiResult && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Main Explanation Box */}
              <div className="p-4 rounded-sm bg-zinc-900 border border-zinc-800 space-y-3 relative">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Açıklama</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-sm bg-zinc-800 text-[11px] font-medium text-zinc-300 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>

                <div className="text-xs text-zinc-200 leading-relaxed space-y-2 whitespace-pre-line font-sans">
                  <FormattedMathText text={aiResult.explanation} />
                </div>

                {/* Key Takeaway Card */}
                {aiResult.keyTakeaway && (
                  <div className="mt-3 p-3 rounded-sm bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <div className="text-xs text-zinc-300 leading-snug">
                      <span className="font-bold text-amber-300">YKS Altın İpucu: </span>
                      <FormattedMathText text={aiResult.keyTakeaway} />
                    </div>
                  </div>
                )}

                {/* Related Concepts Chips */}
                {aiResult.relatedConcepts && aiResult.relatedConcepts.length > 0 && (
                  <div className="pt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">İlişkili Konular:</span>
                    {aiResult.relatedConcepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-300"
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
        <div className="p-3 sm:p-4 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
            placeholder="Özel sorunuzu yazın..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-sm px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
          <button
            onClick={() => handleAskAI()}
            disabled={loading}
            className="px-4 py-2 bg-zinc-100 hover:bg-white text-black font-bold text-xs uppercase tracking-wider rounded-sm disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Sor</span>
          </button>
        </div>

      </div>
    </div>
  );
};
