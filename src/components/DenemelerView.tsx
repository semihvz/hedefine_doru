import React, { useState, useEffect, useMemo } from 'react';
import { 
  Target, 
  Clock, 
  CheckCircle2, 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  FileSpreadsheet,
  Check,
  X,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { FormattedMathText } from './FormattedMathText';

interface DenemelerViewProps {
  onOpenAuthModal?: () => void;
}

export interface DenemeQuestionOption {
  key: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
}

export interface DenemeQuestion {
  id: string;
  number: number;
  subject: string; // e.g. "Türkçe", "Matematik", "Fizik", "Tarih"
  questionText: string;
  options: DenemeQuestionOption[];
  correctOption: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
}

export interface DenemeExam {
  id: string;
  title: string;
  type: 'TYT Genel' | 'AYT Sayısal' | 'AYT Eşit Ağırlık' | 'Branş Denemesi';
  durationMinutes: number;
  totalQuestions: number;
  badgeColor: string;
  colorGradient: string;
  description: string;
  sections: { name: string; questionCount: number; color: string }[];
  questions: DenemeQuestion[];
}

// Sample Comprehensive Mock Exams Data
const SAMPLE_DENEMELER: DenemeExam[] = [
  {
    id: 'tyt-genel-deneme-1',
    title: 'TYT Genel Deneme Sınavı #1 (ÖSYM Konsepti)',
    type: 'TYT Genel',
    durationMinutes: 165,
    totalQuestions: 10,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    colorGradient: 'from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/30',
    description: 'Türkçe, Sosyal, Matematik ve Fen sorularından oluşan tam kapsamlı ÖSYM konsepti TYT provası.',
    sections: [
      { name: 'Türkçe', questionCount: 3, color: 'text-purple-400' },
      { name: 'Matematik', questionCount: 4, color: 'text-amber-400' },
      { name: 'Fizik', questionCount: 2, color: 'text-cyan-400' },
      { name: 'Kimya', questionCount: 1, color: 'text-emerald-400' }
    ],
    questions: [
      {
        id: 'd1-q1',
        number: 1,
        subject: 'Türkçe',
        questionText: 'Aşağıdaki cümlelerin hangisinde altı çizili sözcük mecaz anlamıyla kullanılmıştır?',
        options: [
          { key: 'A', text: 'Rüzgardan dolayı odanın kapısı sertçe kapandı.' },
          { key: 'B', text: 'Toplantıdaki sert sözleri salonda soğuk bir hava estirdi.' },
          { key: 'C', text: 'Fırından çıkan taze ekmekler çok lezzetli görünüyordu.' },
          { key: 'D', text: 'Masanın üzerindeki bardak yere düşüp kırıldı.' },
          { key: 'E', text: 'Çocuklar bahçede neşeyle koşuşturuyorlardı.' }
        ],
        correctOption: 'B',
        explanation: 'B seçeneğinde geçen "sert sözler" ve "soğuk hava" ifadeleri mecaz anlamda (kırıcı söz, gergin ortam) kullanılmıştır.'
      },
      {
        id: 'd1-q2',
        number: 2,
        subject: 'Türkçe',
        questionText: 'Aşağıdaki cümlelerin hangisinde yazım yanlışı vardır?',
        options: [
          { key: 'A', text: 'TDK\'nin yeni sözlüğü yayımlandı.' },
          { key: 'B', text: 'Herşey yolunda giderse yarın yola çıkacağız.' },
          { key: 'C', text: 'Onun da bizimle gelmesini istiyoruz.' },
          { key: 'D', text: '29 Ekim 1923\'te Cumhuriyet ilan edildi.' },
          { key: 'E', text: 'Bunu yapabileceğimi hiç sanmıyorum.' }
        ],
        correctOption: 'B',
        explanation: '"Her şey" kelimesi daima ayrı yazılır. "Herşey" şeklindeki bitişik yazım yanlıştır.'
      },
      {
        id: 'd1-q3',
        number: 3,
        subject: 'Türkçe',
        questionText: 'Paragrafta akışı bozan cümleyi bulunuz:\n(I) Kitap okumak zihni dinlendiren en etkili eylemdir. (II) Düzenli okuyan bireylerin kelime dağarcığı zenginleşir. (III) Türkiye\'de kitap fiyatları son yıllarda artış gösterdi. (IV) Ayrıca okuma alışkanlığı odaklanma süresini de uzatır. (V) Bu nedenle her gün en az yarım saat okumak önerilir.',
        options: [
          { key: 'A', text: 'I' },
          { key: 'B', text: 'II' },
          { key: 'C', text: 'III' },
          { key: 'D', text: 'IV' },
          { key: 'E', text: 'V' }
        ],
        correctOption: 'C',
        explanation: 'Paragraf okumanın bireysel faydalarından bahsetmektedir. III. cümle ise kitap fiyatlarından bahsederek düşüngenin akışını bozmuştur.'
      },
      {
        id: 'd1-q4',
        number: 4,
        subject: 'Matematik',
        questionText: '$x$ ve $y$ birer pozitif tam sayıdır. $3x + 5y = 42$ olduğuna göre $x$\'in alabileceği en büyük değer kaçtır?',
        options: [
          { key: 'A', text: '9' },
          { key: 'B', text: '11' },
          { key: 'C', text: '12' },
          { key: 'D', text: '14' },
          { key: 'E', text: '15' }
        ],
        correctOption: 'B',
        explanation: '$x$\'in en büyük olması için $y$\'ye verilebilecek en küçük pozitif tam sayı değerini veririz. $y=3$ seçilirse: $3x + 5(3) = 42 \\implies 3x + 15 = 42 \\implies 3x = 27 \\implies x = 9$. $y=6 \\implies 3x+30=42 \\implies 3x=12 \\implies x=4$. $y=0$ pozitif tam sayı değildir. Ancak $y=3 \\implies x=9$ iken, $y=0$ verilemeyeceğinden $y=3$ en küçük seçenektir, $3x = 42 - 5y$. Eğer $y=3$ ise $3x=27 \\implies x=9$. $3x = 42 - 5y \\implies 5y = 42 - 3x$. $3x = 42 - 5(3) = 27 \\implies x=9$. Fakat $x$ için $3x+5y=42$ ifadesinde $y=3$ için $x=9$. En büyük $x$ için $y=3 \\implies x=9$. Cevap A veya $y=3$ ise $x=9$. Soruda $3(9)+5(3)=42$.'
      },
      {
        id: 'd1-q5',
        number: 5,
        subject: 'Matematik',
        questionText: '$f(x) = 2x + 5$ ve $g(x) = x^2 - 1$ olduğuna göre $(f \\circ g)(3)$ değeri kaçtır?',
        options: [
          { key: 'A', text: '17' },
          { key: 'B', text: '21' },
          { key: 'C', text: '23' },
          { key: 'D', text: '25' },
          { key: 'E', text: '29' }
        ],
        correctOption: 'B',
        explanation: '$(f \\circ g)(3) = f(g(3))$. Önce $g(3) = 3^2 - 1 = 9 - 1 = 8$. Şimdi $f(8) = 2(8) + 5 = 16 + 5 = 21$.'
      },
      {
        id: 'd1-q6',
        number: 6,
        subject: 'Matematik',
        questionText: 'Bir sınıftaki kız öğrencilerin sayısının erkek öğrencilerin sayısına oranı $\\frac{3}{4}$\'tür. Sınıfta toplam 35 öğrenci olduğuna göre erkek öğrenci sayısı kaçtır?',
        options: [
          { key: 'A', text: '15' },
          { key: 'B', text: '18' },
          { key: 'C', text: '20' },
          { key: 'D', text: '22' },
          { key: 'E', text: '24' }
        ],
        correctOption: 'C',
        explanation: 'Kız sayısı = $3k$, Erkek sayısı = $4k$. Toplam = $7k = 35 \\implies k = 5$. Erkek sayısı = $4 \\times 5 = 20$.'
      },
      {
        id: 'd1-q7',
        number: 7,
        subject: 'Matematik',
        questionText: '$\\log_2(x - 3) = 4$ denklemini sağlayan $x$ değeri kaçtır?',
        options: [
          { key: 'A', text: '11' },
          { key: 'B', text: '13' },
          { key: 'C', text: '15' },
          { key: 'D', text: '19' },
          { key: 'E', text: '21' }
        ],
        correctOption: 'D',
        explanation: 'Logaritma tanımından: $x - 3 = 2^4 = 16 \\implies x = 16 + 3 = 19$.'
      },
      {
        id: 'd1-q8',
        number: 8,
        subject: 'Fizik',
        questionText: 'Kütlesi $m = 4\\text{ kg}$ olan bir cisme $F = 20\\text{ N}$\'luk net kuvvet uygulandığında cismin ivmesi kaç $\\text{m/s}^2$ olur?',
        options: [
          { key: 'A', text: '2' },
          { key: 'B', text: '4' },
          { key: 'C', text: '5' },
          { key: 'D', text: '8' },
          { key: 'E', text: '10' }
        ],
        correctOption: 'C',
        explanation: 'Newton 2. Yasası: $F_{net} = m \\cdot a \\implies 20 = 4 \\cdot a \\implies a = 5\\text{ m/s}^2$.'
      },
      {
        id: 'd1-q9',
        number: 9,
        subject: 'Fizik',
        questionText: 'Direnci $R = 10\\ \\Omega$ olan bir iletkenin uçları arasındaki potansiyel farkı $V = 30\\text{ Volt}$ olduğuna göre iletkenden geçen akım $I$ kaç Amperdir?',
        options: [
          { key: 'A', text: '2' },
          { key: 'B', text: '3' },
          { key: 'C', text: '4' },
          { key: 'D', text: '5' },
          { key: 'E', text: '6' }
        ],
        correctOption: 'B',
        explanation: 'Ohm Yasası: $V = I \\cdot R \\implies 30 = I \\cdot 10 \\implies I = 3\\text{ Amper}$.'
      },
      {
        id: 'd1-q10',
        number: 10,
        subject: 'Kimya',
        questionText: 'Kütlesi $m = 36\\text{ gram}$ olan $H_2O$ (Su) kaç moldür? ($H=1\\text{ g/mol}, O=16\\text{ g/mol}$)',
        options: [
          { key: 'A', text: '1' },
          { key: 'B', text: '1.5' },
          { key: 'C', text: '2' },
          { key: 'D', text: '2.5' },
          { key: 'E', text: '3' }
        ],
        correctOption: 'C',
        explanation: '$H_2O$ mol kütlesi $M_a = 2(1) + 16 = 18\\text{ g/mol}$. Mol sayısı $n = \\frac{m}{M_a} = \\frac{36}{18} = 2\\text{ mol}$.'
      }
    ]
  },
  {
    id: 'ayt-sayisal-deneme-1',
    title: 'AYT Sayısal Prova Deneme Sınavı #1',
    type: 'AYT Sayısal',
    durationMinutes: 180,
    totalQuestions: 10,
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    colorGradient: 'from-purple-500/20 via-pink-500/10 to-transparent border-purple-500/30',
    description: 'İleri derece Matematik, Fizik, Kimya ve Biyoloji sorularından oluşan AYT Sayısal sınavı.',
    sections: [
      { name: 'Matematik', questionCount: 5, color: 'text-amber-400' },
      { name: 'Fizik', questionCount: 2, color: 'text-cyan-400' },
      { name: 'Kimya', questionCount: 2, color: 'text-emerald-400' },
      { name: 'Biyoloji', questionCount: 1, color: 'text-rose-400' }
    ],
    questions: [
      {
        id: 'd2-q1',
        number: 1,
        subject: 'Matematik',
        questionText: '$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$ limitinin değeri kaçtır?',
        options: [
          { key: 'A', text: '0' },
          { key: 'B', text: '2' },
          { key: 'C', text: '4' },
          { key: 'D', text: '6' },
          { key: 'E', text: 'Tanımsız' }
        ],
        correctOption: 'C',
        explanation: '$x=2$ koyduğumuzda $0/0$ belirsizliği çıkar. Çarpanlara ayıralım: $\\frac{(x-2)(x+2)}{x-2} = x + 2$. $x \\to 2 \\implies 2 + 2 = 4$.'
      },
      {
        id: 'd2-q2',
        number: 2,
        subject: 'Matematik',
        questionText: '$f(x) = x^3 - 3x^2 + 5$ fonksiyonunun türevi $f\'(x)$ nedir?',
        options: [
          { key: 'A', text: '$3x^2 - 6x$' },
          { key: 'B', text: '$3x^2 - 3$' },
          { key: 'C', text: '$x^2 - 6x + 5$' },
          { key: 'D', text: '$3x^2 - 6x + 5$' },
          { key: 'E', text: '$6x - 6$' }
        ],
        correctOption: 'A',
        explanation: 'Üs başa geçer ve üs 1 azaltılır: $(x^3)\' = 3x^2$, $(-3x^2)\' = -6x$, $(5)\' = 0$. Sonuç: $3x^2 - 6x$.'
      },
      {
        id: 'd2-q3',
        number: 3,
        subject: 'Matematik',
        questionText: '$\\int (3x^2 + 2x) dx$ belirsiz integralinin sonucu nedir?',
        options: [
          { key: 'A', text: '$x^3 + x^2 + C$' },
          { key: 'B', text: '$6x + 2 + C$' },
          { key: 'C', text: '$3x^3 + 2x^2 + C$' },
          { key: 'D', text: '$x^3 + 2x + C$' },
          { key: 'E', text: '$\\frac{x^3}{3} + x^2 + C$' }
        ],
        correctOption: 'A',
        explanation: '$\\int 3x^2 dx = 3 \\frac{x^3}{3} = x^3$, $\\int 2x dx = 2 \\frac{x^2}{2} = x^2$. Sonuç: $x^3 + x^2 + C$.'
      },
      {
        id: 'd2-q4',
        number: 4,
        subject: 'Matematik',
        questionText: '$\\sin(30^\\circ) + \\cos(60^\\circ)$ işleminin sonucu kaçtır?',
        options: [
          { key: 'A', text: '0' },
          { key: 'B', text: '1/2' },
          { key: 'C', text: '1' },
          { key: 'D', text: '$\\sqrt{3}$' },
          { key: 'E', text: '2' }
        ],
        correctOption: 'C',
        explanation: '$\\sin(30^\\circ) = 1/2$ ve $\\cos(60^\\circ) = 1/2$. Toplam = $1/2 + 1/2 = 1$.'
      },
      {
        id: 'd2-q5',
        number: 5,
        subject: 'Matematik',
        questionText: 'Karmaşık sayı $z = 3 + 4i$ olduğuna göre $|z|$ karmaşık sayısının modülü (mutlak değeri) kaçtır?',
        options: [
          { key: 'A', text: '3' },
          { key: 'B', text: '4' },
          { key: 'C', text: '5' },
          { key: 'D', text: '7' },
          { key: 'E', text: '25' }
        ],
        correctOption: 'C',
        explanation: 'Modül formülü: $|z| = \\sqrt{a^2 + b^2} = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.'
      },
      {
        id: 'd2-q6',
        number: 6,
        subject: 'Fizik',
        questionText: 'Fotoelektrik olayda katot yüzeyine düşürülen ışığın frekansı artırılırsa sökülen fotoelektronların kinetik enerjisi nasıl değişir?',
        options: [
          { key: 'A', text: 'Azalır' },
          { key: 'B', text: 'Değişmez' },
          { key: 'C', text: 'Artar' },
          { key: 'D', text: 'Önce artar sonra azalır' },
          { key: 'E', text: 'Sıfır olur' }
        ],
        correctOption: 'C',
        explanation: 'Einstein fotoelektrik denklemi: $h f = E_b + E_k \\implies E_k = h f - E_b$. Frekans $f$ artarsa kinetik enerji $E_k$ artar.'
      },
      {
        id: 'd2-q7',
        number: 7,
        subject: 'Fizik',
        questionText: 'Yay sabiti $k = 100\\text{ N/m}$ olan bir yaya $m = 1\\text{ kg}$ kütleli cisim asılarak basit harmonik hareket yaptırılıyor. Periyodu $T$ kaç saniyedir? ($\\pi = 3$ alınız)',
        options: [
          { key: 'A', text: '0.3' },
          { key: 'B', text: '0.6' },
          { key: 'C', text: '1.2' },
          { key: 'D', text: '2' },
          { key: 'E', text: '3' }
        ],
        correctOption: 'B',
        explanation: '$T = 2\\pi \\sqrt{\\frac{m}{k}} = 2(3) \\sqrt{\\frac{1}{100}} = 6 \\cdot \\frac{1}{10} = 0{,}6\\text{ saniye}$.'
      },
      {
        id: 'd2-q8',
        number: 8,
        subject: 'Kimya',
        questionText: '$P \\cdot V = n \\cdot R \\cdot T$ ideal gaz denkleminde sabit sıcaklık ve mol sayısında gazın basıncı 2 katına çıkarılırsa hacmi nasıl değişir?',
        options: [
          { key: 'A', text: '2 katına çıkar' },
          { key: 'B', text: 'Yarıya iner (1/2)' },
          { key: 'C', text: 'Değişmez' },
          { key: 'D', text: '4 katına çıkar' },
          { key: 'E', text: '1/4 üne iner' }
        ],
        correctOption: 'B',
        explanation: 'Boyle kanununa göre sabit $n$ ve $T$ durumunda basınç ile hacim ters orantılıdır ($P_1 V_1 = P_2 V_2$). Basınç 2 katına çıkarsa hacim yarıya iner.'
      },
      {
        id: 'd2-q9',
        number: 9,
        subject: 'Kimya',
        questionText: '$pH = 3$ olan bir sulu çözeltide hidrojen iyonu derişimi $[H^+]$ kaç $\\text{M}$\'dir?',
        options: [
          { key: 'A', text: '$10^{-3}$' },
          { key: 'B', text: '$10^{-7}$' },
          { key: 'C', text: '$10^{-11}$' },
          { key: 'D', text: '$3$' },
          { key: 'E', text: '$10^3$' }
        ],
        correctOption: 'A',
        explanation: '$pH = -\\log[H^+] \\implies 3 = -\\log[H^+] \\implies [H^+] = 10^{-3}\\text{ M}$.'
      },
      {
        id: 'd2-q10',
        number: 10,
        subject: 'Biyoloji',
        questionText: 'Ökaryot bir hücrede protein sentezinin gerçekleştiği organel hangisidir?',
        options: [
          { key: 'A', text: 'Mitokondri' },
          { key: 'B', text: 'Ribozom' },
          { key: 'C', text: 'Golgi aygıtı' },
          { key: 'D', text: 'Lizozom' },
          { key: 'E', text: 'Sentrozom' }
        ],
        correctOption: 'B',
        explanation: 'Protein sentezinin hücresel fabrikası ribozom organelidir.'
      }
    ]
  }
];

export const DenemelerView: React.FC<DenemelerViewProps> = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'TYT Genel' | 'AYT Sayısal' | 'Branş Denemesi'>('all');
  const [activeExam, setActiveExam] = useState<DenemeExam | null>(null);
  
  // Active Exam Runner State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isExamFinished, setIsExamFinished] = useState<boolean>(false);
  const [examResult, setExamResult] = useState<{
    correctCount: number;
    wrongCount: number;
    emptyCount: number;
    netScore: number;
    scoreEstimate: number;
  } | null>(null);

  // History state saved in LocalStorage
  const [examHistory, setExamHistory] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mindpulse_deneme_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Countdown timer effect
  useEffect(() => {
    if (!activeExam || isExamFinished) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExam, isExamFinished]);

  // Start exam handler
  const handleStartExam = (exam: DenemeExam) => {
    setActiveExam(exam);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setRemainingSeconds(exam.durationMinutes * 60);
    setIsExamFinished(false);
    setExamResult(null);
  };

  // Finish exam handler
  const handleFinishExam = () => {
    if (!activeExam) return;

    let correct = 0;
    let wrong = 0;
    let empty = 0;

    activeExam.questions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (!ans) {
        empty++;
      } else if (ans === q.correctOption) {
        correct++;
      } else {
        wrong++;
      }
    });

    const net = Number((correct - wrong / 4).toFixed(2));
    const scoreEst = Math.round(100 + net * 15);

    const result = {
      correctCount: correct,
      wrongCount: wrong,
      emptyCount: empty,
      netScore: net,
      scoreEstimate: scoreEst
    };

    setExamResult(result);
    setIsExamFinished(true);

    // Save to history
    const historyItem = {
      id: Math.random().toString(36).substring(2, 9),
      examTitle: activeExam.title,
      type: activeExam.type,
      date: new Date().toLocaleDateString('tr-TR'),
      netScore: net,
      correct,
      wrong,
      empty,
      scoreEstimate: scoreEst
    };

    setExamHistory((prev) => {
      const next = [historyItem, ...prev];
      try {
        localStorage.setItem('mindpulse_deneme_history', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Format seconds to mm:ss or hh:mm:ss
  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const filteredExams = useMemo(() => {
    if (activeTab === 'all') return SAMPLE_DENEMELER;
    return SAMPLE_DENEMELER.filter((e) => e.type === activeTab);
  }, [activeTab]);

  // ==================== ACTIVE EXAM INTERFACE (SINAV RUNNER) ====================
  if (activeExam && !isExamFinished) {
    const currentQ = activeExam.questions[currentQuestionIdx];

    return (
      <div className="space-y-6 animate-fade-in pb-16">
        
        {/* Exam Runner Top Bar */}
        <div className="sticky top-20 z-30 p-4 rounded-2xl bg-slate-900/95 border border-slate-800 backdrop-blur-md flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${activeExam.badgeColor}`}>
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">{activeExam.title}</h2>
              <span className="text-xs text-slate-400">Soru {currentQuestionIdx + 1} / {activeExam.totalQuestions}</span>
            </div>
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-sm ${
              remainingSeconds < 300 
                ? 'bg-rose-950/80 border-rose-500/40 text-rose-300 animate-pulse' 
                : 'bg-slate-950 border-slate-800 text-amber-300'
            }`}>
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{formatTimer(remainingSeconds)}</span>
            </div>

            <button
              onClick={handleFinishExam}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
            >
              Denemeyi Bitir & Optiği Teslim Et
            </button>
          </div>
        </div>

        {/* Exam Split View: Question Area & Optic Form */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Question Viewer (Left 3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
              
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-indigo-600 text-white px-3 py-1 rounded-lg">
                    Soru #{currentQ.number}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                    {currentQ.subject}
                  </span>
                </div>

                <button
                  onClick={() => setFlaggedQuestions(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    flaggedQuestions[currentQ.id]
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{flaggedQuestions[currentQ.id] ? 'Şüpheli / İşaretlendi' : 'Boş Bırak / İşaretle'}</span>
                </button>
              </div>

              {/* Question Text */}
              <div className="text-base text-slate-100 font-medium leading-relaxed">
                <FormattedMathText text={currentQ.questionText} />
              </div>

              {/* Options list */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt) => {
                  const isSelected = userAnswers[currentQ.id] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setUserAnswers(prev => ({ ...prev, [currentQ.id]: opt.key }))}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-4 transition-all duration-200 ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}>
                        {opt.key}
                      </span>
                      <div className="text-sm pt-1 flex-1">
                        <FormattedMathText text={opt.text} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Önceki Soru</span>
                </button>

                <button
                  onClick={() => {
                    setUserAnswers(prev => {
                      const next = { ...prev };
                      delete next[currentQ.id];
                      return next;
                    });
                  }}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Yanıtı Temizle
                </button>

                <button
                  disabled={currentQuestionIdx === activeExam.questions.length - 1}
                  onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold transition-all"
                >
                  <span>Sonraki Soru</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Optic Form & Question Map (Right 1 Col) */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>Optik Form & Soru Haritası</span>
              </h3>

              <div className="grid grid-cols-5 gap-2">
                {activeExam.questions.map((q, idx) => {
                  const isSelected = currentQuestionIdx === idx;
                  const isAnswered = !!userAnswers[q.id];
                  const isFlagged = !!flaggedQuestions[q.id];

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`h-11 rounded-xl font-bold text-xs flex flex-col items-center justify-center border transition-all ${
                        isSelected
                          ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950 font-black'
                          : ''
                      } ${
                        isAnswered
                          ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
                          : isFlagged
                          ? 'bg-amber-600/20 border-amber-500/40 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{q.number}</span>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {userAnswers[q.id] || '-'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-2 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md bg-emerald-600/30 border border-emerald-500/40" />
                  <span>İşaretlendi ({Object.keys(userAnswers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md bg-slate-950 border border-slate-800" />
                  <span>Boş ({activeExam.questions.length - Object.keys(userAnswers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md bg-amber-600/30 border border-amber-500/40" />
                  <span>Şüpheli / İşaretli ({Object.keys(flaggedQuestions).filter(k => flaggedQuestions[k]).length})</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==================== EXAM RESULT SCORECARD (DENEME KARNESİ) ====================
  if (activeExam && isExamFinished && examResult) {
    return (
      <div className="space-y-8 animate-fade-in pb-16">
        
        {/* Result Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-indigo-500/20 p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Deneme Sınavı Tamamlandı!</span>
              </span>
              <h1 className="text-3xl font-extrabold text-white">{activeExam.title}</h1>
              <p className="text-xs text-slate-400">Sonuçlarınız hesaplandı ve başarı analizinize eklendi.</p>
            </div>

            <button
              onClick={() => {
                setActiveExam(null);
                setIsExamFinished(false);
              }}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
            >
              ← Denemeler Listesine Dön
            </button>
          </div>
        </div>

        {/* Score Breakdown Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-medium block">Toplam Net</span>
            <span className="text-3xl font-black text-amber-400 mt-1 block">{examResult.netScore} Net</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-medium block">Doğru Sayısı</span>
            <span className="text-3xl font-black text-emerald-400 mt-1 block">{examResult.correctCount}</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-medium block">Yanlış Sayısı</span>
            <span className="text-3xl font-black text-rose-400 mt-1 block">{examResult.wrongCount}</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-medium block">Boş Sayısı</span>
            <span className="text-3xl font-black text-slate-400 mt-1 block">{examResult.emptyCount}</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/30 text-center col-span-2 md:col-span-1">
            <span className="text-xs text-indigo-300 font-medium block">Tahmini YKS Puanı</span>
            <span className="text-3xl font-black text-indigo-400 mt-1 block">{examResult.scoreEstimate} P.</span>
          </div>
        </div>

        {/* Question Review Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            <span>Soru Detaylı Çözüm İncelemesi</span>
          </h3>

          <div className="space-y-4">
            {activeExam.questions.map((q) => {
              const userAns = userAnswers[q.id];
              const isCorrect = userAns === q.correctOption;
              const isEmpty = !userAns;

              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-3xl border space-y-4 transition-all ${
                    isCorrect
                      ? 'bg-emerald-950/10 border-emerald-500/30'
                      : isEmpty
                      ? 'bg-slate-900/80 border-slate-800'
                      : 'bg-rose-950/10 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-slate-950 px-3 py-1 rounded-lg text-slate-300 border border-slate-800">
                        Soru #{q.number} ({q.subject})
                      </span>
                      {isCorrect && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Doğru
                        </span>
                      )}
                      {!isCorrect && !isEmpty && (
                        <span className="text-xs font-bold text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-500/40 flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> Yanlış
                        </span>
                      )}
                      {isEmpty && (
                        <span className="text-xs font-bold text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800">
                          Boş Bırakıldı
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-semibold text-slate-400">
                      Cevabınız: <strong className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{userAns || 'Boş'}</strong> | Doğru: <strong className="text-emerald-400">{q.correctOption}</strong>
                    </span>
                  </div>

                  <div className="text-sm text-slate-200">
                    <FormattedMathText text={q.questionText} />
                  </div>

                  {/* Explanation Note */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                    <strong className="text-indigo-300 font-bold block">💡 Çözüm & Açıklama:</strong>
                    <FormattedMathText text={q.explanation} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    );
  }

  // ==================== MAIN DENEMELER LIST VIEW ====================
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950 to-purple-950 border border-amber-500/20 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Target className="w-3.5 h-3.5" />
              <span>YKS 2026 Deneme Sınavları & Prova Merkezi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-indigo-200">
              Hedefine Doğru Denemeler
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              ÖSYM sınav süresi ve kurallarına tam uyumlu TYT, AYT ve Branş Deneme Sınavları. Gerçek zamanlı optik form ve anlık net analizi.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-center min-w-[140px] shadow-xl">
              <span className="text-xs text-slate-400 block font-medium">Son Deneme Neti</span>
              <span className="text-2xl font-black text-amber-400 mt-1 block">
                {examHistory[0] ? `${examHistory[0].netScore} Net` : 'Henüz Yok'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {examHistory[0] ? examHistory[0].date : 'İlk denemenizi çözün'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 backdrop-blur-md">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Tüm Denemeler ({SAMPLE_DENEMELER.length})
        </button>

        <button
          onClick={() => setActiveTab('TYT Genel')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'TYT Genel' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          TYT Genel Denemeleri
        </button>

        <button
          onClick={() => setActiveTab('AYT Sayısal')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'AYT Sayısal' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          AYT Sayısal Denemeleri
        </button>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className={`rounded-3xl bg-slate-900/90 border p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl ${exam.colorGradient}`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${exam.badgeColor}`}>
                    {exam.type}
                  </span>
                  <h3 className="text-xl font-bold text-white pt-1">{exam.title}</h3>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 font-mono font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{exam.durationMinutes} Dk</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {exam.description}
              </p>

              {/* Sections Breakdown Pills */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {exam.sections.map((sec, idx) => (
                  <span key={idx} className="text-[11px] font-semibold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800/80 text-slate-300">
                    <strong className={sec.color}>{sec.name}:</strong> {sec.questionCount} Soru
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 font-medium">
                Toplam <strong className="text-slate-200">{exam.totalQuestions} Soru</strong>
              </span>

              <button
                onClick={() => handleStartExam(exam)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Denemeyi Başlat</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* History Table if any */}
      {examHistory.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Geçmiş Deneme Sonuçlarınız</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Tarih</th>
                  <th className="p-3">Deneme Adı</th>
                  <th className="p-3 text-center">Doğru</th>
                  <th className="p-3 text-center">Yanlış</th>
                  <th className="p-3 text-center">Boş</th>
                  <th className="p-3 text-center">Net</th>
                  <th className="p-3 text-right">Tahmini Puan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {examHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-850/50">
                    <td className="p-3 text-slate-400">{h.date}</td>
                    <td className="p-3 font-semibold text-slate-200">{h.examTitle}</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">{h.correct}</td>
                    <td className="p-3 text-center text-rose-400 font-bold">{h.wrong}</td>
                    <td className="p-3 text-center text-slate-500">{h.empty}</td>
                    <td className="p-3 text-center font-black text-amber-400">{h.netScore} Net</td>
                    <td className="p-3 text-right font-bold text-indigo-400">{h.scoreEstimate} P.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default DenemelerView;
