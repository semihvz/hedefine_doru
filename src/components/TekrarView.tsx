import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  BrainCircuit, 
  Check, 
  X, 
  Plus, 
  Clock, 
  Layers, 
  BookmarkCheck,
  Trash2
} from 'lucide-react';
import { FormattedMathText } from './FormattedMathText';

export interface ReviewCard {
  id: string;
  subject: string;
  title: string;
  questionOrFront: string;
  answerOrBack: string;
  box: 1 | 2 | 3 | 4; // Leitner Box level (1: 1 day, 2: 3 days, 3: 7 days, 4: 30 days)
  lastReviewedAt: string;
  nextReviewDate: string; // YYYY-MM-DD
  historyCount: number;
}

const INITIAL_REVIEW_CARDS: ReviewCard[] = [
  {
    id: 'rev-1',
    subject: 'Matematik',
    title: 'Logaritma Taban Değiştirme Kuralı',
    questionOrFront: '$\\log_a b$ ifadesi $c$ tabanında nasıl yazılır ve $\\log_a b \\cdot \\log_b a$ çarpımı kaça eşittir?',
    answerOrBack: 'Taban Değiştirme: $\\log_a b = \\frac{\\log_c b}{\\log_c a}$\n\nÇarpım Kuralı: $\\log_a b \\cdot \\log_b a = 1$',
    box: 1,
    lastReviewedAt: new Date().toISOString(),
    nextReviewDate: new Date().toISOString().split('T')[0],
    historyCount: 2
  },
  {
    id: 'rev-2',
    subject: 'Fizik',
    title: 'Eğik Atış Maksimum Yükseklik Formülü',
    questionOrFront: 'Düşeyle $\\theta$ açısı yaparak $v_0$ hızıyla atılan cismin çıkabileceği maksimum yükseklik $h_{\\max}$ nedir?',
    answerOrBack: '$h_{\\max} = \\frac{(v_0 \\cdot \\sin\\theta)^2}{2g}$\n\nNot: Tepe noktasında düşey hız $v_y = 0$ olur, sadece yatay hız $v_x = v_0 \\cos\\theta$ kalır.',
    box: 2,
    lastReviewedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    nextReviewDate: new Date().toISOString().split('T')[0],
    historyCount: 4
  },
  {
    id: 'rev-3',
    subject: 'Kimya',
    title: 'İdeal Gaz Denklemi ve Dalton Kısmi Basınç',
    questionOrFront: 'Dalton Kısmi Basınçlar Yasasına göre $P_A$ kısmi basıncı toplam basınç $P_T$ cinsinden nasıl yazılır?',
    answerOrBack: '$P_A = P_T \\cdot X_A$  (Burada $X_A = \\frac{n_A}{n_T}$ mol kesridir)\n\nİdeal Gaz Denklemi: $P \\cdot V = n \\cdot R \\cdot T$',
    box: 3,
    lastReviewedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    nextReviewDate: new Date().toISOString().split('T')[0],
    historyCount: 6
  },
  {
    id: 'rev-4',
    subject: 'Türkçe',
    title: 'Yazımı Sık Karıştırılan Sözcükler',
    questionOrFront: '"Rastgele", "Şey", "Unvan" sözcüklerinin doğru yazılışları nasıldır?',
    answerOrBack: '• Rastgele (Bitişik)\n• Her şey / Hiçbir şey (Şey daima AYRI)\n• Unvan ("Ünvan" değil, "Unvan" DOĞRU)',
    box: 1,
    lastReviewedAt: new Date().toISOString(),
    nextReviewDate: new Date().toISOString().split('T')[0],
    historyCount: 1
  },
  {
    id: 'rev-5',
    subject: 'Biyoloji',
    title: 'Fotosentez Işığa Bağımlı Reaksiyonlar',
    questionOrFront: 'Fotosentezin ışığa bağımlı evresinde üretime katılan ve son e- alıcısı olan molekül nedir?',
    answerOrBack: 'Son elektron alıcısı: $\\text{NADP}^+$\n\nÜretilenler: $\\text{ATP}$, $\\text{NADPH}$ ve $O_2$ (Suyun fotolizi sonucu açığa çıkar).',
    box: 4,
    lastReviewedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    nextReviewDate: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0],
    historyCount: 10
  }
];

export const TekrarView: React.FC = () => {
  const [cards, setCards] = useState<ReviewCard[]>(() => {
    const saved = localStorage.getItem('yks_spaced_repetition_cards_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_REVIEW_CARDS; }
    }
    return INITIAL_REVIEW_CARDS;
  });

  const [activeTab, setActiveTab] = useState<'today' | 'boxes' | 'add'>('today');
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterSubject, setFilterSubject] = useState<string>('all');

  // Form State for Adding New Card
  const [newSubject, setNewSubject] = useState('Matematik');
  const [newTitle, setNewTitle] = useState('');
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newInitialBox, setNewInitialBox] = useState<1 | 2>(1);

  useEffect(() => {
    localStorage.setItem('yks_spaced_repetition_cards_v1', JSON.stringify(cards));
  }, [cards]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Cards due for review today
  const dueCards = cards.filter((c) => {
    const matchesSubject = filterSubject === 'all' || c.subject === filterSubject;
    return matchesSubject && c.nextReviewDate <= todayStr;
  });

  const activeCard = dueCards[currentReviewIndex];

  // Rating action (Leitner Box System)
  const handleRating = (performance: 'easy' | 'medium' | 'hard') => {
    if (!activeCard) return;

    let nextBox = activeCard.box;
    let daysToAdd = 1;

    if (performance === 'easy') {
      nextBox = Math.min(4, activeCard.box + 1) as 1 | 2 | 3 | 4;
    } else if (performance === 'hard') {
      nextBox = 1;
    }

    // Interval mapping
    if (nextBox === 1) daysToAdd = 1;
    else if (nextBox === 2) daysToAdd = 3;
    else if (nextBox === 3) daysToAdd = 7;
    else if (nextBox === 4) daysToAdd = 30;

    const nextDate = new Date(Date.now() + daysToAdd * 86400000).toISOString().split('T')[0];

    setCards((prev) =>
      prev.map((c) =>
        c.id === activeCard.id
          ? {
              ...c,
              box: nextBox,
              lastReviewedAt: new Date().toISOString(),
              nextReviewDate: nextDate,
              historyCount: c.historyCount + 1,
            }
          : c
      )
    );

    setIsFlipped(false);
    if (currentReviewIndex >= dueCards.length - 1) {
      setCurrentReviewIndex(0);
    }
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFront.trim() || !newBack.trim()) return;

    const newCard: ReviewCard = {
      id: `rev-${Date.now()}`,
      subject: newSubject,
      title: newTitle.trim(),
      questionOrFront: newFront.trim(),
      answerOrBack: newBack.trim(),
      box: newInitialBox,
      lastReviewedAt: new Date().toISOString(),
      nextReviewDate: todayStr,
      historyCount: 0,
    };

    setCards((prev) => [newCard, ...prev]);
    setNewTitle('');
    setNewFront('');
    setNewBack('');
    setActiveTab('today');
  };

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  // Metrics
  const box1Count = cards.filter((c) => c.box === 1).length;
  const box2Count = cards.filter((c) => c.box === 2).length;
  const box3Count = cards.filter((c) => c.box === 3).length;
  const box4Count = cards.filter((c) => c.box === 4).length;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Welcome & System Header */}
      <div className="bg-[#111115] border border-zinc-800 rounded-sm p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-mono font-bold tracking-widest text-zinc-400 uppercase block mb-1">
              YKS AKILLI TEKRAR & SPACING HUB (SPACED REPETITION)
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>Tekrar & Aktif Hatırlama Alanı</span>
              <BrainCircuit className="w-5 h-5 text-zinc-400" />
            </h1>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Ebbinghaus unutma eğrisini yenmek için tasarlanmış Leitner kutu algoritması. Yanlış soruları, formülleri ve kritik kilit bilgileri aralıklı zaman dilimlerinde (1, 3, 7, 30 gün) otomatik tekrar edin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('add')}
              className="px-4 py-2.5 rounded-sm bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Tekrar Kartı Ekle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 rounded-sm bg-[#111115] border border-zinc-800 text-center font-mono">
          <span className="text-[10px] text-zinc-400 font-bold uppercase block">Bugün Bekleyen</span>
          <span className="text-2xl font-bold text-amber-300 mt-1 block">{dueCards.length} Kart</span>
        </div>

        <div className="p-4 rounded-sm bg-[#111115] border border-zinc-800 text-center font-mono">
          <span className="text-[10px] text-zinc-400 font-bold uppercase block">1. Kutu (Günlük)</span>
          <span className="text-2xl font-bold text-rose-400 mt-1 block">{box1Count} Kart</span>
        </div>

        <div className="p-4 rounded-sm bg-[#111115] border border-zinc-800 text-center font-mono">
          <span className="text-[10px] text-zinc-400 font-bold uppercase block">2. Kutu (3 Günlük)</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block">{box2Count} Kart</span>
        </div>

        <div className="p-4 rounded-sm bg-[#111115] border border-zinc-800 text-center font-mono">
          <span className="text-[10px] text-zinc-400 font-bold uppercase block">3. Kutu (Haftalık)</span>
          <span className="text-2xl font-bold text-zinc-200 mt-1 block">{box3Count} Kart</span>
        </div>

        <div className="p-4 rounded-sm bg-[#111115] border border-zinc-700 text-center col-span-2 md:col-span-1 font-mono">
          <span className="text-[10px] text-zinc-300 font-bold uppercase block">4. Kutu (Aylık/Pekiştirilmiş)</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">{box4Count} Kart</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="inline-flex p-1 rounded-sm bg-[#111115] border border-zinc-800">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === 'today' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Bugünün Tekrarları ({dueCards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('boxes')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === 'boxes' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-4 h-4 text-zinc-300" />
            <span>Kutu Matrisi ({cards.length} Toplam Kart)</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === 'add' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Plus className="w-4 h-4 text-zinc-300" />
            <span>Yeni Kart Ekle</span>
          </button>
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 uppercase">Ders Filtresi:</span>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-1.5 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono focus:outline-none focus:border-zinc-500"
          >
            <option value="all">Tüm Dersler</option>
            <option value="Matematik">Matematik</option>
            <option value="Fizik">Fizik</option>
            <option value="Kimya">Kimya</option>
            <option value="Biyoloji">Biyoloji</option>
            <option value="Türkçe">Türkçe</option>
            <option value="Tarih">Tarih</option>
            <option value="Coğrafya">Coğrafya</option>
          </select>
        </div>
      </div>

      {/* TAB 1: BUGÜNÜN TEKRARLARI (ACTIVE RECALL CARDS) */}
      {activeTab === 'today' && (
        <div className="space-y-6">
          {dueCards.length === 0 ? (
            <div className="p-12 text-center rounded-sm bg-[#111115] border border-zinc-800 space-y-4 max-w-xl mx-auto">
              <BookmarkCheck className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Bugün İçin Tekrar Kalmadı!</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tebrikler! Bugünün aralıklı tekrar listesindeki tüm kartları ve konuları tamamladınız. Zihniniz bilgileri hafızaya aktardı.
              </p>
              <button
                onClick={() => setActiveTab('boxes')}
                className="px-5 py-2.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-mono font-bold uppercase hover:bg-zinc-800 transition-all"
              >
                Tüm Kutu Kartlarını İncele →
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Kart {currentReviewIndex + 1} / {dueCards.length}</span>
                <span className="px-2.5 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold uppercase">
                  {activeCard.subject}
                </span>
              </div>

              {/* Flashcard Component */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="relative min-h-[300px] p-8 rounded-sm bg-[#111115] border border-zinc-800 shadow-2xl flex flex-col justify-between cursor-pointer group transition-all hover:border-zinc-700"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                      {isFlipped ? '💡 ÇÖZÜM & AÇIKLAMA (ARKA YÜZ)' : '❓ TEKRAR SORUSU / BAĞINTI (ÖN YÜZ)'}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-zinc-950 px-2 py-0.5 rounded-sm border border-zinc-800 uppercase">
                      {activeCard.box}. Kutu
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">{activeCard.title}</h3>

                  <div className="text-sm text-zinc-200 font-medium leading-relaxed pt-2">
                    {isFlipped ? (
                      <div className="whitespace-pre-line text-emerald-300 font-mono">
                        <FormattedMathText text={activeCard.answerOrBack} />
                      </div>
                    ) : (
                      <FormattedMathText text={activeCard.questionOrFront} />
                    )}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>Cevabı görmek için karta tıklayın 🔄</span>
                  <span className="text-zinc-400 uppercase font-bold">{isFlipped ? 'Geri Çevir ↑' : 'Cevabı Aç ↓'}</span>
                </div>
              </div>

              {/* Rating Action Buttons */}
              {isFlipped && (
                <div className="p-4 rounded-sm bg-[#111115] border border-zinc-800 space-y-3 animate-fade-in">
                  <span className="text-xs font-mono font-bold uppercase text-zinc-400 block text-center">
                    Bu Bilgiyi Hatırlamakta Ne Kadar Zorlandınız?
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleRating('hard')}
                      className="p-3 rounded-sm bg-rose-950/40 hover:bg-rose-900/40 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold uppercase transition-all flex flex-col items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      <span>Hatırlayamadım (Zor)</span>
                      <span className="text-[9px] text-rose-400/80">Kutu 1'e Düşer (Yarın)</span>
                    </button>

                    <button
                      onClick={() => handleRating('medium')}
                      className="p-3 rounded-sm bg-amber-950/40 hover:bg-amber-900/40 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase transition-all flex flex-col items-center gap-1"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Orta / Biraz Zor</span>
                      <span className="text-[9px] text-amber-400/80">Kutuda Kalır</span>
                    </button>

                    <button
                      onClick={() => handleRating('easy')}
                      className="p-3 rounded-sm bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold uppercase transition-all flex flex-col items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Çok Kolay (Biliyorum)</span>
                      <span className="text-[9px] text-emerald-400/80">Sonraki Kutuya Geçer</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* TAB 2: KUTU MATRİSİ (LEITNER BOX MATRIX) */}
      {activeTab === 'boxes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((boxNum) => {
              const boxCards = cards.filter((c) => c.box === boxNum);
              const intervalText = boxNum === 1 ? '1 Günlük' : boxNum === 2 ? '3 Günlük' : boxNum === 3 ? '7 Günlük' : '30 Günlük';

              return (
                <div key={boxNum} className="p-6 rounded-sm bg-[#111115] border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-sm bg-zinc-900 border border-zinc-700 text-white">
                        {boxNum}. KUTU ({intervalText})
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">({boxCards.length} Kart)</span>
                    </div>
                  </div>

                  {boxCards.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic py-4">Bu kutuda henüz kart bulunmuyor.</p>
                  ) : (
                    <div className="space-y-3">
                      {boxCards.map((card) => (
                        <div key={card.id} className="p-4 rounded-sm bg-zinc-950 border border-zinc-800 flex items-start justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300">
                                {card.subject}
                              </span>
                              <h4 className="text-xs font-bold text-white">{card.title}</h4>
                            </div>
                            <p className="text-[11px] text-zinc-400 line-clamp-2">
                              <FormattedMathText text={card.questionOrFront} />
                            </p>
                            <span className="text-[9px] text-zinc-500 font-mono block">
                              Sonraki Tekrar: {card.nextReviewDate}
                            </span>
                          </div>

                          <button
                            onClick={() => handleDeleteCard(card.id)}
                            className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                            title="Kartı Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: YENİ KART EKLE */}
      {activeTab === 'add' && (
        <div className="max-w-2xl mx-auto p-8 rounded-sm bg-[#111115] border border-zinc-800 shadow-2xl space-y-6">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-base font-bold text-white uppercase tracking-tight">Yeni Akıllı Tekrar Kartı Ekle</h3>
            <p className="text-xs text-zinc-400">Unuttuğunuz veya karıştırma ihtimaliniz olan bağıntıları buraya ekleyin.</p>
          </div>

          <form onSubmit={handleAddCard} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Ders Seçin</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 font-mono"
                >
                  <option value="Matematik">Matematik</option>
                  <option value="Fizik">Fizik</option>
                  <option value="Kimya">Kimya</option>
                  <option value="Biyoloji">Biyoloji</option>
                  <option value="Türkçe">Türkçe</option>
                  <option value="Tarih">Tarih</option>
                  <option value="Coğrafya">Coğrafya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Başlangıç Kutusu</label>
                <select
                  value={newInitialBox}
                  onChange={(e) => setNewInitialBox(Number(e.target.value) as 1 | 2)}
                  className="w-full px-3 py-2 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 font-mono"
                >
                  <option value={1}>1. Kutu (Hemen Yarın Tekrar Et)</option>
                  <option value={2}>2. Kutu (3 Gün Sonra Tekrar Et)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Kart Başlığı / Konu</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Örn: Logaritma Taban Değiştirme Kuralı"
                className="w-full px-3 py-2 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Ön Yüz (Soru / Tanım / KaTeX Formül)</label>
              <textarea
                required
                rows={3}
                value={newFront}
                onChange={(e) => setNewFront(e.target.value)}
                placeholder="Örn: $\log_a b$ ifadesinin $c$ tabanında yazılışı nasıldır?"
                className="w-full px-3 py-2 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Arka Yüz (Çözüm / Formül / Cevap)</label>
              <textarea
                required
                rows={3}
                value={newBack}
                onChange={(e) => setNewBack(e.target.value)}
                placeholder="Örn: $\log_a b = \frac{\log_c b}{\log_c a}$"
                className="w-full px-3 py-2 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-sm bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Kartı Akıllı Tekrar Sistemine Kaydet</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default TekrarView;
