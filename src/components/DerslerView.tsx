import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Search, 
  Sparkles, 
  Clock, 
  Award, 
  Zap, 
  Calculator, 
  Atom, 
  FlaskConical, 
  Dna, 
  Compass, 
  Feather, 
  X,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  FileText,
  BarChart3,
  Check,
  Target
} from 'lucide-react';
import { FormattedMathText } from './FormattedMathText';

interface DerslerViewProps {
  onNavigateToQuiz: (category?: string) => void;
  onOpenAuthModal?: () => void;
}

export interface SubjectTopic {
  id: string;
  title: string;
  importance: 'High' | 'Medium' | 'Essential';
  questionCountEstimate: string;
  summary: string;
  formulas?: string[];
  tips?: string[];
}

export interface SubjectData {
  id: string;
  name: string;
  type: 'TYT' | 'AYT';
  category: string;
  iconName: string;
  colorGradient: string;
  badgeColor: string;
  examWeight: string;
  description: string;
  topics: SubjectTopic[];
  keyFormulas?: { title: string; math: string; note?: string }[];
}

const ALL_SUBJECTS: SubjectData[] = [
  // ==================== TYT DERSLERİ ====================
  {
    id: 'tyt-matematik',
    name: 'TYT Matematik',
    type: 'TYT',
    category: 'Matematik',
    iconName: 'Calculator',
    colorGradient: 'from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/30',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    examWeight: '30-40 Soru (~%33 Puan)',
    description: 'Temel kavramlar, problemler, fonksiyonlar, mantık ve temel cebir konuları.',
    keyFormulas: [
      { title: 'Üslü Sayı Özelliği', math: 'a^m \\cdot a^n = a^{m+n}', note: 'Tabanlar aynıysa üsler toplanır.' },
      { title: 'Köklü Sayı Dönüşümü', math: '\\sqrt[n]{a^m} = a^{\\frac{m}{n}}', note: 'Kök derecesi paydaya yazılır.' },
      { title: 'Ebob - Ekok Bağıntısı', math: 'EBOB(a,b) \\cdot EKOK(a,b) = a \\cdot b', note: 'İki pozitif tam sayı için geçerlidir.' },
      { title: 'Aritmetik Ortalama', math: 'A.O. = \\frac{\\sum x_i}{n}', note: 'Toplam değerlerin eleman sayısına bölümü.' },
      { title: 'Kümelerde Birleşim Eleman Sayısı', math: 's(A \\cup B) = s(A) + s(B) - s(A \\cap B)', note: 'Kesişim kümesi iki kez sayılmamalıdır.' }
    ],
    topics: [
      {
        id: 'tyt-mat-1',
        title: 'Temel Kavramlar & Sayı Basamakları',
        importance: 'Essential',
        questionCountEstimate: '2-4 Soru',
        summary: 'Rasyonel, irrasyonel, asal ve tam sayılar. Tek-çift sayılar ve pozitif-negatiflik kuralları. Basamak analizi: $ab = 10a + b$.',
        formulas: ['ab = 10a + b', 'abc = 100a + 10b + c', 'n! = 1 \\cdot 2 \\cdot 3 \\dots n'],
        tips: ['Tek/Çift sayı sorularında çarpımın tek olması için tüm çarpanların tek olması gerektiğini unutmayın.']
      },
      {
        id: 'tyt-mat-2',
        title: 'Bölme, Bölünebilme & Ebob-Ekok',
        importance: 'High',
        questionCountEstimate: '2 Soru',
        summary: '2, 3, 4, 5, 8, 9, 11 ile bölünebilme kuralları. Periyodik problem durumları ve ortak kat/bölen hesapları.',
        formulas: ['A = B \\cdot Q + K \\quad (0 \\le K < B)', 'EBOB(a,b) \\cdot EKOK(a,b) = a \\cdot b'],
        tips: ['Kalan bölenden her zaman küçük olmak zorundadır!']
      },
      {
        id: 'tyt-mat-3',
        title: 'Rasyonel & Ondalık Sayılar',
        importance: 'Essential',
        questionCountEstimate: '1-2 Soru',
        summary: 'Kesir türleri (Basit, Bileşik, Tam Sayılı), devirli ondalık açılımlar ve kesirlerde sıralama.',
        formulas: ['0.\\overline{ab} = \\frac{ab}{99}', '0.a\\overline{bc} = \\frac{abc - a}{990}'],
        tips: ['Devirli ondalık sayılarda devreden kadar 9, devretmeyen kadar 0 yazılır.']
      },
      {
        id: 'tyt-mat-4',
        title: 'Mutlak Değer & Basit Eşitsizlikler',
        importance: 'High',
        questionCountEstimate: '2-3 Soru',
        summary: 'Mutlak değer içi negatif ise eksi ile çarpılarak çıkar. Yön değiştiren eşitsizlik koşulları (Negatif sayı ile çarpma/bölme).',
        formulas: ['|x| = a \\implies x = a \\text{ veya } x = -a', '|x| < a \\implies -a < x < a'],
        tips: ['Eşitsizliği negatif sayı ile çarpar veya bölerseniz eşitsizlik yön değiştirir!']
      },
      {
        id: 'tyt-mat-5',
        title: 'TYT Problemler (Yaş, İşçi, Hız, Kar-Zarar, Karışım)',
        importance: 'Essential',
        questionCountEstimate: '10-13 Soru',
        summary: 'Sınavın en belirleyici bölümüdür. Denklem kurma, oran-orantı mantığı, yüzde hesapları ve bağıl hız ($x = v \\cdot t$).',
        formulas: ['x = v \\cdot t', '\\text{Kar Yüzdesi} = \\frac{\\text{Kar}}{\\text{Maliyet}} \\cdot 100', 'V_{ort} = \\frac{\\text{Toplam Yol}}{\\text{Toplam Zaman}}'],
        tips: ['Soruyu okurken verileri anında değişkenlere ($x, y$) dökün, tüm metni tek seferde çözmeye çalışmayın.']
      },
      {
        id: 'tyt-mat-6',
        title: 'Fonksiyonlar & Grafikler',
        importance: 'High',
        questionCountEstimate: '2 Soru',
        summary: 'Birebir, örten, içine, sabit, birim fonksiyonlar. Bileşke ($f \\circ g(x)$) ve ters fonksiyon ($f^{-1}(x)$) bulma.',
        formulas: ['f(x) = ax + b \\implies f^{-1}(x) = \\frac{x - b}{a}', '(f \\circ g)(x) = f(g(x))'],
        tips: ['Grafik sorularında eksenleri kestiği noktaları $(x, 0)$ ve $(0, y)$ olarak doğru okuyun.']
      },
      {
        id: 'tyt-mat-7',
        title: 'Permütasyon, Kombinasyon & Olasılık',
        importance: 'High',
        questionCountEstimate: '2-3 Soru',
        summary: 'Sıralama (Permütasyon) ve seçme (Kombinasyon). İstenen durum / Tüm durum olasılık hesabı.',
        formulas: ['P(n,r) = \\frac{n!}{(n-r)!}', 'C(n,r) = \\frac{n!}{r!(n-r)!}', 'P(A) = \\frac{s(A)}{s(E)}'],
        tips: ['"Veya" birleşim (toplama), "ve" kesişim (çarpma) anlamına gelir.']
      }
    ]
  },
  {
    id: 'tyt-geometri',
    name: 'TYT Geometri',
    type: 'TYT',
    category: 'Geometri',
    iconName: 'Compass',
    colorGradient: 'from-indigo-500/20 via-blue-500/10 to-transparent border-indigo-500/30',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    examWeight: '9-10 Soru',
    description: 'Üçgenler, özel üçgenler, çokgenler, dörtgenler, çember ve katı cisimler.',
    keyFormulas: [
      { title: 'Pisagor Teoremi', math: 'a^2 + b^2 = c^2', note: 'Dik üçgende hipotenüs karesi dik kenarların kareleri toplamıdır.' },
      { title: 'Öklit Teoremi', math: 'h^2 = p \\cdot k', note: 'Dik açıdan inilen dikmenin karesi ayırdığı parçaların çarpımıdır.' },
      { title: 'Üçgende Alan (Sinüs)', math: 'Alan = \\frac{1}{2} a b \\sin(\\alpha)', note: 'İki kenar ve aradaki açı bilindiğinde kullanılır.' },
      { title: 'Çokgen İç Açılar Toplamı', math: 'S = (n-2) \\cdot 180^\\circ', note: 'n kenarlı konveks çokgen için geçerlidir.' }
    ],
    topics: [
      {
        id: 'tyt-geo-1',
        title: 'Üçgende Açılar & Özel Üçgenler',
        importance: 'Essential',
        questionCountEstimate: '2 Soru',
        summary: 'İkizkenar, eşkenar, 30-60-90 ve 45-45-90 dik üçgen özellikleri. Muhteşem üçlü ve diklik merkezi.',
        formulas: ['30^\\circ \\to a, 60^\\circ \\to a\\sqrt{3}, 90^\\circ \\to 2a', '45^\\circ \\to a, 45^\\circ \\to a, 90^\\circ \\to a\\sqrt{2}'],
        tips: ['Dik açıdan kenarortay iniyorsa Muhteşem Üçlü vardır!']
      },
      {
        id: 'tyt-geo-2',
        title: 'Üçgende Benzerlik & Alan',
        importance: 'Essential',
        questionCountEstimate: '2 Soru',
        summary: 'A.A.A benzerliği, Thales teoremi, temel orantı teoremi. Benzerlik oranının karesi alanlar oranına eşittir.',
        formulas: ['k = \\frac{a_1}{a_2} \\implies \\frac{\\text{Alan}_1}{\\text{Alan}_2} = k^2'],
        tips: ['Yükseklikleri eşit üçgenlerin alanları tabanları ile orantılıdır.']
      },
      {
        id: 'tyt-geo-3',
        title: 'Çokgenler & Dörtgenler (Kare, Dikdörtgen, Paralelkenar)',
        importance: 'High',
        questionCountEstimate: '3 Soru',
        summary: 'Düzgün altıgen, kare, dikdörtgen, deltoid ve yamuk özellikleri. Köşegen kesim noktaları ve simetri eksenleri.',
        formulas: ['\\text{Kare Alanı} = a^2', '\\text{Yamuk Alanı} = \\frac{a+c}{2} \\cdot h'],
        tips: ['Karede köşegenler dik kesişir ve açıortaydır!']
      },
      {
        id: 'tyt-geo-4',
        title: 'Çember & Daire',
        importance: 'High',
        questionCountEstimate: '1-2 Soru',
        summary: 'Merkez açı, çevre açı, teğet-kiriş açı. Dairenin çevresi ($2\\pi r$) ve alanı ($\\pi r^2$).',
        formulas: ['Ç = 2\\pi r', 'A = \\pi r^2', 'A_{dilim} = \\frac{\\pi r^2 \\alpha}{360^\\circ}'],
        tips: ['Çembere dışındaki bir noktadan çizilen teğet parçalarının uzunlukları eşittir.']
      },
      {
        id: 'tyt-geo-5',
        title: 'Katı Cisimler (Prizma, Piramit, Silindir, Koni, Küre)',
        importance: 'Essential',
        questionCountEstimate: '2 Soru',
        summary: 'Uzayda alan ve hacim hesaplamaları. Silindir ($V = \\pi r^2 h$), Koni ($V = \\frac{1}{3}\\pi r^2 h$), Küre ($V = \\frac{4}{3}\\pi r^3$).',
        formulas: ['V_{silindir} = \\pi r^2 h', 'V_{koni} = \\frac{1}{3}\\pi r^2 h', 'V_{kure} = \\frac{4}{3}\\pi r^3'],
        tips: ['Piramit ve konilerde hacim kat sayısı $1/3$ tür.']
      }
    ]
  },
  {
    id: 'tyt-turkce',
    name: 'TYT Türkçe',
    type: 'TYT',
    category: 'Türkçe',
    iconName: 'Feather',
    colorGradient: 'from-purple-500/20 via-pink-500/10 to-transparent border-purple-500/30',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    examWeight: '40 Soru (~%33 Puan)',
    description: 'Paragraf okuma anlama, dil bilgisi, yazım kuralları ve noktalama işaretleri.',
    topics: [
      {
        id: 'tyt-tr-1',
        title: 'Paragrafta Anlam & Ana Fikir',
        importance: 'Essential',
        questionCountEstimate: '22-26 Soru',
        summary: 'Paragraf tamamlama, akışı bozan cümle, ana düşünce, yardımcı düşünceler, anlatım teknikleri ve düşünceyi geliştirme yolları.',
        tips: ['Soruyu okumadan önce soru kökünü mutlaka okuyun! Olumsuz soru köklerinin (değinilmemiştir, çıkarılamaz) altını çizin.']
      },
      {
        id: 'tyt-tr-2',
        title: 'Sözcükte ve Cümlede Anlam',
        importance: 'Essential',
        questionCountEstimate: '5-6 Soru',
        summary: 'Gerçek, mecaz, yan anlam. Öznel-nesnel anlatım, neden-sonuç, amaç-sonuç, koşul-sonuç ilişkileri.',
        tips: ['Sözcüğün cümle içindeki kullanım bağlamına dikkat edin.']
      },
      {
        id: 'tyt-tr-3',
        title: 'Yazım Kuralları & Noktalama İşaretleri',
        importance: 'High',
        questionCountEstimate: '4 Soru',
        summary: 'Bitişik ve ayrı yazılan kelimeler, büyük harflerin kullanımı, kesme işareti, virgül, noktalı virgül, iki nokta kuralları.',
        tips: ['Virgül zarf-fiil eklerinden (-edip, -erek) ve bağlaçlardan sonra kullanılmaz!']
      },
      {
        id: 'tyt-tr-4',
        title: 'Dil Bilgisi (Ses Bilgisi, Sözcük Türleri, Cümlenin Ögeleri)',
        importance: 'High',
        questionCountEstimate: '5-7 Soru',
        summary: 'Ünlü düşmesi, türemesi, benzeşmesi. İsim, sıfat, zamir, zarf, edat, bağlaç, fiilimsiler ve öge dizilimi.',
        tips: ['Yüklemi bulduktan sonra ilk olarak özneyi tespit edin, ardından nesne ve tümleçleri arayın.']
      }
    ]
  },
  {
    id: 'tyt-fizik',
    name: 'TYT Fizik',
    type: 'TYT',
    category: 'Fizik',
    iconName: 'Atom',
    colorGradient: 'from-cyan-500/20 via-blue-500/10 to-transparent border-cyan-500/30',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    examWeight: '7 Soru',
    description: 'Vektörler, madde, kuvvet, hareket, iş-enerji, ısı-sıcaklık, elektrik ve optik.',
    keyFormulas: [
      { title: 'Newton 2. Yasası', math: 'F_{net} = m \\cdot a', note: 'Net kuvvet ivmeyi belirler.' },
      { title: 'Kinetik Enerji', math: 'E_k = \\frac{1}{2} m v^2', note: 'Hızın karesi ile orantılıdır.' },
      { title: 'Ohm Yasası', math: 'V = I \\cdot R', note: 'Gerilim = Akım x Direnç' },
      { title: 'Isı Transferi', math: 'Q = m c \\Delta T', note: 'Sıcaklık değişimiyle alınan/verilen ısı.' }
    ],
    topics: [
      {
        id: 'tyt-fiz-1',
        title: 'Fizik Bilimine Giriş & Madde Özellikleri',
        importance: 'Medium',
        questionCountEstimate: '1 Soru',
        summary: 'Temel ve türetilmiş büyüklükler, skaler-vektörel ayrımı. Özkütle ($d = m/V$), adezyon, kohezyon ve yüzey gerilimi.',
        formulas: ['d = \\frac{m}{V}'],
        tips: ['Özkütle sabit sıcaklık ve basınç altında maddeler için ayırt edici özelliktir.']
      },
      {
        id: 'tyt-fiz-2',
        title: 'Kuvvet, Hareket & Newton Yasaları',
        importance: 'High',
        questionCountEstimate: '1 Soru',
        summary: 'Düzgün doğrusal hareket, ivmeli hareket, eylemsizlik, etki-tepki ve net kuvvet kavramı.',
        formulas: ['F_{net} = m \\cdot a', 'v = v_0 + a t'],
        tips: ['Etki ve tepki kuvvetleri farklı cisimler üzerindedir, birbirini sıfırlamaz!']
      },
      {
        id: 'tyt-fiz-3',
        title: 'Basınç & Kaldırma Kuvveti',
        importance: 'High',
        questionCountEstimate: '1 Soru',
        summary: 'Katı, sıvı ve gaz basıncı. Archimedes prensibi: Yüzen ve askıda kalan cisimlerde $F_k = G_{cisim}$.',
        formulas: ['P_{katı} = \\frac{F}{S}', 'P_{sıvı} = h \\cdot d \\cdot g', 'F_k = V_{batan} \\cdot d_{sıvı} \\cdot g'],
        tips: ['Batan cisimlerde kaldırma kuvveti cismin ağırlığından küçüktür.']
      },
      {
        id: 'tyt-fiz-4',
        title: 'Isı, Sıcaklık & Genleşme',
        importance: 'High',
        questionCountEstimate: '1 Soru',
        summary: 'İç enerji, ısı, sıcaklık farkı, hal değişimi ($Q = m L$), öz ısı ve ısı sığası kavramları.',
        formulas: ['Q = m c \\Delta T', 'Q = m L_f'],
        tips: ['Sıcaklık bir enerji değildir, maddeler arası alınan/verilen enerji ısıdır.']
      },
      {
        id: 'tyt-fiz-5',
        title: 'Elektrik & Mıknatıslık',
        importance: 'Essential',
        questionCountEstimate: '1 Soru',
        summary: 'Ohm yasası, seri ve paralel bağlama, elektriksel güç ($P = V \\cdot I$) ve magnetik alan çizgileri.',
        formulas: ['V = I R', 'P = V I = I^2 R', 'R_{es\_paralel} = \\frac{R_1 R_2}{R_1 + R_2}'],
        tips: ['Paralel bağlı dirençlerde gerilimler eşittir, eşdeğer direnç en küçük dirençten bile küçüktür.']
      },
      {
        id: 'tyt-fiz-6',
        title: 'Optik (Yansıma, Kırılma, Mercekler, Renk)',
        importance: 'Essential',
        questionCountEstimate: '1-2 Soru',
        summary: 'Düzlem ayna, küresel aynalar, Snell yasası ($n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2$), tam yansıma ve mercek odak noktaları.',
        formulas: ['n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)'],
        tips: ['Işık az yoğundan çok yoğuna geçerken normale yaklaşarak kırılır.']
      }
    ]
  },
  {
    id: 'tyt-kimya',
    name: 'TYT Kimya',
    type: 'TYT',
    category: 'Kimya',
    iconName: 'FlaskConical',
    colorGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-500/30',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    examWeight: '7 Soru',
    description: 'Atom modeli, periyodik sistem, kimyasal bağlar, mol kavramı, çözeltiler ve asit-bazlar.',
    keyFormulas: [
      { title: 'Mol Sayısı Formülü', math: 'n = \\frac{m}{M_a} = \\frac{N}{N_A} = \\frac{V}{22{,}4}', note: 'NK (0°C, 1 atm) için gaz hacmi.' },
      { title: 'Kütlece Yüzde Derişim', math: '% = \\frac{m_{çözünen}}{m_{çözelti}} \\cdot 100', note: 'Çözelti kütlesi çözücü + çözünen kütlesidir.' },
      { title: 'pH Skalası Dengesi', math: 'pH + pOH = 14', note: '25°C sulu çözeltiler için sabittir.' }
    ],
    topics: [
      {
        id: 'tyt-kim-1',
        title: 'Atom & Periyodik Sistem',
        importance: 'Essential',
        questionCountEstimate: '1-2 Soru',
        summary: 'Dalton, Thomson, Rutherford, Bohr atom modelleri. İzotop, izobar, izoton. Periyodik cetvelde grup ve periyot değişimi.',
        tips: ['Soldan sağa gidildikçe elektronegatiflik ve iyonlaşma enerjisi genelde artar, atom yarıçapı küçülür.']
      },
      {
        id: 'tyt-kim-2',
        title: 'Kimyasal Türler Arası Etkileşimler',
        importance: 'High',
        questionCountEstimate: '1 Soru',
        summary: 'Güçlü etkileşimler (İyonik, Kovalent, Metalik bağ). Zayıf etkileşimler (Dipol-dipol, Hidrojen bağı, London kuvvetleri).',
        tips: ['F, O, N atomlarına doğrudan bağlı H atomu varsa Hidrojen Bağı oluşur!']
      },
      {
        id: 'tyt-kim-3',
        title: 'Mol Kavramı & Kimyasal Hesaplamalar',
        importance: 'Essential',
        questionCountEstimate: '1 Soru',
        summary: 'Avogadro sayısı ($6{,}02 \\times 10^{23}$), Mol-Kütle-Hacim ilişkileri ve sınırlayıcı bileşen tepkimeleri.',
        formulas: ['n = \\frac{m}{M_a}', 'n = \\frac{V_{NK}}{22{,}4}'],
        tips: ['Tepkime denkleminde kat sayılar mol sayıları oranını verir.']
      },
      {
        id: 'tyt-kim-4',
        title: 'Karışımlar & Derişim',
        importance: 'High',
        questionCountEstimate: '1 Soru',
        summary: 'Homojen (Çözelti) ve heterojen karışımlar (Süspansiyon, Emülsiyon, Kolloit). Kütlece ve hacimce yüzde hesapları.',
        formulas: ['%_{kütle} = \\frac{m_{çözünen}}{m_{çözelti}} \\cdot 100'],
        tips: ['Çözelti kütlesi = Çözücü kütlesi + Çözünen kütlesi']
      },
      {
        id: 'tyt-kim-5',
        title: 'Asitler, Bazlar & Tuzlar',
        importance: 'High',
        questionCountEstimate: '1 Soru',
        summary: '$pH$ kavramı, turnusol kağıdı, nötralleşme tepkimeleri ($H^+ + OH^- \\to H_2O$) ve günlük hayattaki tuzlar.',
        formulas: ['pH < 7 \\implies \\text{Asit}', 'pH > 7 \\implies \\text{Baz}'],
        tips: ['Soy metaller (Cu, Hg, Ag, Pt, Au) hidrojenden pasiftir, tek başlarına HCl ile tepkime vermez.']
      }
    ]
  },
  {
    id: 'tyt-biyoloji',
    name: 'TYT Biyoloji',
    type: 'TYT',
    category: 'Biyoloji',
    iconName: 'Dna',
    colorGradient: 'from-rose-500/20 via-pink-500/10 to-transparent border-rose-500/30',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    examWeight: '6 Soru',
    description: 'Hücre yapısı, organeller, canlıların sınıflandırılması, hücre bölünmeleri ve kalıtım.',
    topics: [
      {
        id: 'tyt-biyo-1',
        title: 'Canlıların Temel Bileşenleri & Hücre',
        importance: 'Essential',
        questionCountEstimate: '1-2 Soru',
        summary: 'Karbonhidrat, yağ, protein, enzimler, ATP, DNA, RNA. Prokaryot-Ökaryot farkı, zarlı ve zarsız organeller.',
        tips: ['Ribozom ve sentrozom zarsız organellerdir. Mitokondri ve kloroplast çift zarlıdır.']
      },
      {
        id: 'tyt-biyo-2',
        title: 'Canlıların Sınıflandırılması & Alemler',
        importance: 'High',
        questionCountEstimate: '1 Soru',
        summary: 'Sınıflandırma basamakları (Tür, Cins, Aile, Takım, Sınıf, Şube, Alem). Bakteriler, Arkeler, Protistalar, Mantarlar, Bitkiler, Hayvanlar.',
        tips: ['Türden Aleme gidildikçe çeşitlilik artar, akrabalık ve benzerlik azalır.']
      },
      {
        id: 'tyt-biyo-3',
        title: 'Hücre Bölünmeleri (Mitoz & Mayoz)',
        importance: 'Essential',
        questionCountEstimate: '1 Soru',
        summary: 'İnterfaz, profaz, metafaz, anafaz, telofaz. Krossing-over, homolog kromozom ayrılması ve kalıtsal çeşitlilik.',
        tips: ['Mayoz-1 anafaz-1 aşamasında homolog kromozom ayrılması çeşitliliğin temelidir.']
      },
      {
        id: 'tyt-biyo-4',
        title: 'Kalıtım & Mendel Genetiği',
        importance: 'Essential',
        questionCountEstimate: '1 Soru',
        summary: 'Monohibrit, dihibrit çaprazlama. Eş baskınlık, çok alellilik, X ve Y kromozomuna bağlı kalıtım (Renk körlüğü, Hemofili).',
        tips: ['Renk körlüğü X kromozomunda çekinik taşınır. Hasta kız çocuğunun babası kesinlikle hastadır!']
      },
      {
        id: 'tyt-biyo-5',
        title: 'Ekosistem Ekolojisi & Çevre',
        importance: 'High',
        questionCountEstimate: '1 Soru',
        summary: 'Besin piramidi, üretici-tüketici-ayrıştırıcılar, biyobirikim, küresel ısınma ve ötrofıkasyon.',
        tips: ['Besin piramidinde yukarı çıkıldıkça aktarılan enerji azalır, zehirli madde birikimi (biyobirikim) artar!']
      }
    ]
  },

  // ==================== AYT DERSLERİ ====================
  {
    id: 'ayt-matematik',
    name: 'AYT Matematik',
    type: 'AYT',
    category: 'Matematik',
    iconName: 'TrendingUp',
    colorGradient: 'from-amber-500/25 via-red-500/15 to-transparent border-amber-500/40',
    badgeColor: 'bg-amber-500/30 text-amber-200 border-amber-500/40',
    examWeight: '30 Soru (~%37,5 Puan)',
    description: 'Trigonometri, Logaritma, Diziler, Limit, Türev, İntegral ve İleri Cebir.',
    keyFormulas: [
      { title: 'Trigonometrik Özdeşlik', math: '\\sin^2(x) + \\cos^2(x) = 1', note: 'Her x reel sayısı için geçerlidir.' },
      { title: 'Logaritma Taban Değiştirme', math: '\\log_a(b) = \\frac{\\log_c(b)}{\\log_c(a)}', note: 'Taban dönüştürme kuralı.' },
      { title: 'Türev Tanımı (Limit)', math: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}', note: 'Anlık değişim oranı.' },
      { title: 'İntegral Temel Teoremi', math: '\\int_a^b f(x) dx = F(b) - F(a)', note: 'Eğri altında kalan alan.' }
    ],
    topics: [
      {
        id: 'ayt-mat-1',
        title: 'Polinomlar, İkinci Dereceden Denklemler & Parabol',
        importance: 'Essential',
        questionCountEstimate: '3-4 Soru',
        summary: 'Polinom kalan teoremi ($P(k)$). Kök-katsayı bağıntıları ($x_1 + x_2 = -b/a, x_1 x_2 = c/a$). Tepe noktası $r = -b/(2a), k = f(r)$.',
        formulas: ['x_1 + x_2 = -\\frac{b}{a}', 'x_1 \\cdot x_2 = \\frac{c}{a}', 'T(r,k) \\implies r = -\\frac{b}{2a}'],
        tips: ['Delta $\\Delta = b^2 - 4ac > 0$ ise parabol x-eksenini iki farklı noktada keser.']
      },
      {
        id: 'ayt-mat-2',
        title: 'Trigonometri (Toplam-Fark, Yarım Açı, Denklemler)',
        importance: 'Essential',
        questionCountEstimate: '4-5 Soru',
        summary: 'Birim çember, sinüs ve kosinüs teoremleri. Toplam-fark formülleri $\\sin(a+b)$, yarım açı $\\sin(2x) = 2\\sin x \\cos x$.',
        formulas: ['\\sin(a+b) = \\sin a \\cos b + \\cos a \\sin b', '\\sin(2x) = 2 \\sin x \\cos x', '\\cos(2x) = \\cos^2 x - \\sin^2 x'],
        tips: ['$\\cos(2x) = 2\\cos^2 x - 1 = 1 - 2\\sin^2 x$ dönüşümlerini adınız gibi bilin!']
      },
      {
        id: 'ayt-mat-3',
        title: 'Logaritma & Diziler',
        importance: 'Essential',
        questionCountEstimate: '3-4 Soru',
        summary: 'Üstel fonksiyon, logaritma özellikleri ($\\log_a(xy) = \\log_a x + \\log_a y$). Aritmetik ve geometrik diziler ($a_n = a_1 \\cdot r^{n-1}$).',
        formulas: ['\\log_a(x \\cdot y) = \\log_a x + \\log_a y', 'a_n = a_1 + (n-1)d', 'a_n = a_1 \\cdot r^{n-1}'],
        tips: ['Aritmetik dizide $a_n = \\frac{a_{n-1} + a_{n+1}}{2}$ eşitliği vardır.']
      },
      {
        id: 'ayt-mat-4',
        title: 'Limit & Süreklilik',
        importance: 'High',
        questionCountEstimate: '2-3 Soru',
        summary: 'Sağdan-soldan limit kavramı, belirsizlik durumları ($0/0$), çarpanlara ayırma ve bir noktada süreklilik şartı.',
        formulas: ['\\lim_{x \\to a^+} f(x) = \\lim_{x \\to a^-} f(x) = f(a) \\implies \\text{Sürekli}'],
        tips: ['Bir fonksiyon sürekli ise limiti vardır, ancak limiti olması sürekli olduğunu garanti etmez.']
      },
      {
        id: 'ayt-mat-5',
        title: 'Türev & Fiziksel / Geometrik Uygulamaları',
        importance: 'Essential',
        questionCountEstimate: '5-6 Soru',
        summary: 'Türev alma kuralları, teğet doğrusunun eğimi ($m = f\'(x_0)$), artan-azalan aralıklar, ekstremum (maksimum-minimum) problemleri.',
        formulas: ['f\'(x_0) = m_{teget}', '(u \\cdot v)\' = u\'v + uv\'', '\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}'],
        tips: ['Ekstremum noktalarında türev sıfırdır ($f\'(x_0) = 0$).']
      },
      {
        id: 'ayt-mat-6',
        title: 'İntegral & Eğri Altında Kalan Alan',
        importance: 'Essential',
        questionCountEstimate: '4-5 Soru',
        summary: 'Belirsiz integral, değişken değiştirme metodu ($u$ dönüşümü), belirli integral ve iki eğri arasında kalan alan hesabı.',
        formulas: ['\\int x^n dx = \\frac{x^{n+1}}{n+1} + C', '\\text{Alan} = \\int_a^b (f(x) - g(x)) dx'],
        tips: ['x-ekseninin altında kalan alan değeri belirli integralde negatif çıkar, alan sorulduğunda mutlak değeri alınmalıdır.']
      }
    ]
  },
  {
    id: 'ayt-fizik',
    name: 'AYT Fizik',
    type: 'AYT',
    category: 'Fizik',
    iconName: 'Atom',
    colorGradient: 'from-blue-500/25 via-cyan-500/15 to-transparent border-blue-500/40',
    badgeColor: 'bg-blue-500/30 text-blue-200 border-blue-500/40',
    examWeight: '14 Soru',
    description: 'Vektörler, momentum, tork, elektrik alan, indüksiyon, çembersel hareket, harmonik hareket ve modern fizik.',
    keyFormulas: [
      { title: 'Çizgisel Momentum', math: 'P = m \\cdot v', note: 'Vektörel büyüklüktür, dış kuvvet yoksa korunur.' },
      { title: 'İtme & Momentum Değişimi', math: 'I = F \\cdot \\Delta t = \\Delta P', note: 'İtme momentum değişimine eşittir.' },
      { title: 'Merkezcil Kuvvet', math: 'F_m = \\frac{m v^2}{r} = m \\omega^2 r', note: 'Yarıçap doğrultusunda merkeze doğrudur.' },
      { title: 'Fotoelektrik Denklem', math: 'E_{foto} = E_{bağlanma} + E_{k\_maks}', note: 'Einstein fotoelektrik eşitliği.' }
    ],
    topics: [
      {
        id: 'ayt-fiz-1',
        title: 'Vektörler, Bağıl Hareket & Newton Kanunları',
        importance: 'High',
        questionCountEstimate: '1-2 Soru',
        summary: 'İki ve üç boyutlu vektör bileşenleri. $\\vec{v}_{bağıl} = \\vec{v}_{gözlenen} - \\vec{v}_{gözlemci}$. Eğik düzlem ve sürtünmeli sistemler.',
        formulas: ['\\vec{v}_{bağıl} = \\vec{v}_{K} - \\vec{v}_{L}'],
        tips: ['Gözlemcinin hızının yönü ters çevrilip gözlenene eklenir.']
      },
      {
        id: 'ayt-fiz-2',
        title: 'İtme, Momentum & Atışlar',
        importance: 'Essential',
        questionCountEstimate: '2 Soru',
        summary: 'Esnek ve esnek olmayan çarpışmalar. Momentum korunumu ($\\sum P_i = \\sum P_f$). Yatay ve eğik atış hareketleri.',
        formulas: ['I = F \\cdot \\Delta t = \\Delta P', 'm_1 v_1 + m_2 v_2 = (m_1 + m_2) V_{ort}'],
        tips: ['Dışarıdan net bir kuvvet etki etmiyorsa toplam momentum daima korunur.']
      },
      {
        id: 'ayt-fiz-3',
        title: 'Tork, Denge & Basit Makineler',
        importance: 'High',
        questionCountEstimate: '1-2 Soru',
        summary: 'Tork kavramı ($\\tau = F \\cdot d \\cdot \\sin\\theta$). Kütle ve ağırlık merkezi. Kaldıraç, palanga, vida, kasnak sistemleri.',
        formulas: ['\\vec{\\tau} = \\vec{r} \\times \\vec{F}', '\\sum F = 0 \\quad \\text{ve} \\quad \\sum \\tau = 0'],
        tips: ['Denge için hem toplam net kuvvet hem de istenen noktaya göre toplam tork 0 olmalıdır.']
      },
      {
        id: 'ayt-fiz-4',
        title: 'Elektriksel Alan, Potansiyel & Kondansatörler',
        importance: 'Essential',
        questionCountEstimate: '2-3 Soru',
        summary: 'Coulomb yasası ($F = k q_1 q_2 / r^2$), Elektrik alan ($E = k q / r^2$), Potansiyel ve Sığaç depolanan enerji ($E = \\frac{1}{2} C V^2$).',
        formulas: ['F = k \\frac{q_1 q_2}{r^2}', 'V = k \\frac{q}{r}', 'C = \\varepsilon \\frac{A}{d}'],
        tips: ['Elektrik alan vektörel, elektriksel potansiyel skaler büyüklüktür.']
      },
      {
        id: 'ayt-fiz-5',
        title: 'Manyetizma & Elektromanyetik İndüksiyon',
        importance: 'Essential',
        questionCountEstimate: '2 Soru',
        summary: 'Akım geçen telin magnetik alanı, Lorentz kuvveti ($F = q v B \\sin\\theta$), Faraday ve Lenz kanunu ($\\varepsilon = -\\Delta \\Phi / \\Delta t$).',
        formulas: ['F = B I L \\sin(\\theta)', '\\varepsilon = - \\frac{\\Delta \\Phi}{\\Delta t}'],
        tips: ['Lenz kanunu: İndüksiyon akımı kendini oluşturan nedene karşı koyacak yöndedir.']
      },
      {
        id: 'ayt-fiz-6',
        title: 'Çembersel & Harmonik Hareket',
        importance: 'Essential',
        questionCountEstimate: '2-3 Soru',
        summary: 'Açısal hız ($\\omega = 2\\pi / T$), merkezcil ivme ($a_m = \\omega^2 r$), eylemsizlik momenti ($I$), yaylı ve basit sarkaç periyodu.',
        formulas: ['T_{yay} = 2\\pi \\sqrt{\\frac{m}{k}}', 'T_{sarkaç} = 2\\pi \\sqrt{\\frac{L}{g}}'],
        tips: ['Basit sarkacın periyodu cismin kütlesine bağlı değildir!']
      },
      {
        id: 'ayt-fiz-7',
        title: 'Modern Fizik & Fotoelektrik Olay',
        importance: 'High',
        questionCountEstimate: '2 Soru',
        summary: 'Fotoelektrik etki, Compton saçılması, de Broglie dalga boyu ($\\lambda = h / P$), Özel görelilik ve radyoaktivite.',
        formulas: ['E = h f = \\frac{h c}{\\lambda}', 'E_{foto} = E_b + E_k'],
        tips: ['Gelen ışığın frekansı artarsa sökülen elektronların maksimum kinetik enerjisi artar, elektron sayısı değişmez.']
      }
    ]
  },
  {
    id: 'ayt-kimya',
    name: 'AYT Kimya',
    type: 'AYT',
    category: 'Kimya',
    iconName: 'FlaskConical',
    colorGradient: 'from-emerald-500/25 via-green-500/15 to-transparent border-emerald-500/40',
    badgeColor: 'bg-emerald-500/30 text-emerald-200 border-emerald-500/40',
    examWeight: '13 Soru',
    description: 'Kuantum atom modeli, gaz kanunları, çözeltiler, termodinamik, kimyasal denge, elektrokimya ve organik kimya.',
    keyFormulas: [
      { title: 'İdeal Gaz Denklemi', math: 'P \\cdot V = n \\cdot R \\cdot T', note: 'Paranoyak Eşek Rıfat kuralı.' },
      { title: 'Molarite Hesaplama', math: 'M = \\frac{n}{V_{litre}}', note: 'Litre cinsinden hacme bölüm.' },
      { title: 'Denge Sabiti (Kc)', math: 'K_c = \\frac{[Ürünler]}{[Girenler]}', note: 'Sadece gaz ve sulu çözeltiler yazılır.' },
      { title: 'Nernst Denklemi', math: 'E_{pil} = E^0_{pil} - \\frac{0{,}0592}{n} \\log Q', note: 'Standart olmayan şartlarda pil potansiyeli.' }
    ],
    topics: [
      {
        id: 'ayt-kim-1',
        title: 'Modern Atom Teorisi & Kuantum Sayıları',
        importance: 'High',
        questionCountEstimate: '1-2 Soru',
        summary: 'Baş ($n$), açısal momentum ($l$), manyetik ($m_l$) kuantum sayıları. Elektron dizilimi (Aufbau, Hund, Pauli prensipleri).',
        formulas: ['l=0(s), l=1(p), l=2(d), l=3(f)'],
        tips: ['Küresel simetri dizilimi ($s^1, s^2, p^3, p^6, d^5, d^{10}$) atoma kararlılık katar.']
      },
      {
        id: 'ayt-kim-2',
        title: 'Gazlar & Gaz Yasaları',
        importance: 'Essential',
        questionCountEstimate: '1-2 Soru',
        summary: 'Boyle, Charles, Gay-Lussac, Avogadro kanunları. İdeal gaz denklemi ($P V = n R T$), Graham difüzyon yasası.',
        formulas: ['P V = n R T', '\\frac{v_1}{v_2} = \\sqrt{\\frac{M_{a2}}{M_{a1}}}'],
        tips: ['Sıcaklık artarsa gaz moleküllerinin hızı kütlelerinin karekökü ile ters orantılı olarak değişir.']
      },
      {
        id: 'ayt-kim-3',
        title: 'Sıvı Çözeltiler & Koligatif Özellikler',
        importance: 'High',
        questionCountEstimate: '1-2 Soru',
        summary: 'Molarite ($M = n/V$), Molalite ($m = n/kg$), Kaynama noktası yükselmesi (Ebüliyoskopi) ve Donma noktası alçalması.',
        formulas: ['M = \\frac{n}{V_{litre}}', '\\Delta T_k = K_k \\cdot m \\cdot i'],
        tips: ['Tanecik sayısı ($i$) toplam iyon derişimine göre hesaplanır (Örn: $NaCl \\to 2$).']
      },
      {
        id: 'ayt-kim-4',
        title: 'Kimyasal Tepkimelerde Enerji, Hız & Denge',
        importance: 'Essential',
        questionCountEstimate: '3 Soru',
        summary: 'Entalpi ($\\Delta H = H_{\\ürün} - H_{\\giren}$), Hess yasası, tepkime hızı ve Le Chatelier ilkesi (Sıcaklık, Basınç, Derişim etkisi).',
        formulas: ['\\Delta H = \\sum \\Delta H_f^{\\circ}(\\text{Ürün}) - \\sum \\Delta H_f^{\\circ}(\\text{Giren})', 'K_p = K_c (R T)^{\\Delta n}'],
        tips: ['Denge sabitini ($K_c$) değiştiren TEK faktör sıcaklıktır!']
      },
      {
        id: 'ayt-kim-5',
        title: 'Asit-Baz Dengesi & Çözünürlük Dengesi (Kç)',
        importance: 'Essential',
        questionCountEstimate: '2 Soru',
        summary: 'Zayıf asit ve bazlarda $K_a, K_b$ dengesi, tampon çözeltiler, titrasyon ve az çözünen tuzlarda $K_{\\ccedil}$ hesabı.',
        formulas: ['K_{\\ccedil} = [A^{m+}]^n [B^{n-}]^m', 'pH = -\\log[H^+]'],
        tips: ['Ortak iyon çözünürlüğü azaltır.']
      },
      {
        id: 'ayt-kim-6',
        title: 'Kimya ve Elektrik (Elektrokimya & Elektroliz)',
        importance: 'Essential',
        questionCountEstimate: '2-3 Soru',
        summary: 'Galvanik piller, Anot (Oksitlenme), Katot (Indirgenme), Nernst denklemi ve Faraday elektroliz kanunları.',
        formulas: ['E_{pil}^0 = E_{katot}^0 - E_{anot}^0', 'm = \\frac{Q \\cdot M_a}{n \\cdot 96500}'],
        tips: ['Anotta daima Oksitlenme (A-O), Katotta daima İndirgenme (K-İ) gerçekleşir. (KİMYA)']
      },
      {
        id: 'ayt-kim-7',
        title: 'Organik Kimyaya Giriş & Organik Bileşikler',
        importance: 'Essential',
        questionCountEstimate: '3-4 Soru',
        summary: 'Hibritleşme ($sp, sp^2, sp^3$), Alkan, Alken, Alkin, Alkol, Eter, Aldehit, Keton, Karboksilli Asit ve Ester fonksiyonel grupları.',
        formulas: ['\\text{Alkan: } C_n H_{2n+2}', '\\text{Alken: } C_n H_{2n}', '\\text{Alkin: } C_n H_{2n-2}'],
        tips: ['Markovnikov kuralı: Katılma tepkimesinde hidrojen, hidrojeni çok olan karbona bağlanır.']
      }
    ]
  },
  {
    id: 'ayt-biyoloji',
    name: 'AYT Biyoloji',
    type: 'AYT',
    category: 'Biyoloji',
    iconName: 'Dna',
    colorGradient: 'from-pink-500/25 via-rose-500/15 to-transparent border-pink-500/40',
    badgeColor: 'bg-pink-500/30 text-pink-200 border-pink-500/40',
    examWeight: '13 Soru',
    description: 'İnsan fizyolojisi (sistemler), komünite ekolojisi, nükleik asitler, protein sentezi, hücresel solunum ve bitki biyolojisi.',
    topics: [
      {
        id: 'ayt-biyo-1',
        title: 'İnsan Fizyolojisi / İnsan Sistemleri',
        importance: 'Essential',
        questionCountEstimate: '6-7 Soru',
        summary: 'Sinir sistemi (İmpuls iletimi), Endokrin (Hormonlar), Duyu organları, Destek-Hareket (Kas kayan iplikler hipotezi), Dolaşım-Bağışıklık, Solunum (O2/CO2 taşınması) ve Boşaltım (Nefron).',
        tips: ['Kanda $CO_2$ en çok bikarbonat iyonu ($HCO_3^-$) şeklinde taşınır.']
      },
      {
        id: 'ayt-biyo-2',
        title: 'Komünite & Popülasyon Ekolojisi',
        importance: 'High',
        questionCountEstimate: '1-2 Soru',
        summary: 'Rekabet, av-avcı, simbiyotik ilişkiler (Mutualizm, Kommensalizm, Parazitizm) ve popülasyon büyüme eğrileri (S ve J tipi).',
        tips: ['Mutualizmde her iki tür de yarar sağlar (+,+).']
      },
      {
        id: 'ayt-biyo-3',
        title: 'Genden Proteine (DNA, RNA & Protein Sentezi)',
        importance: 'Essential',
        questionCountEstimate: '2 Soru',
        summary: 'Replikasyon (Helikaz, DNA Polimeraz), Transkripsiyon (mRNA sentezi), Translasyon (Ribozomda okuma) ve Genetik kod (Kodon/Antikodon).',
        tips: ['Başlama kodonu daima AUG (Metiyonin) dir. Durdurma kodonları (UAA, UAG, UGA) amino asit şifrelemez.']
      },
      {
        id: 'ayt-biyo-4',
        title: 'Canlılarda Enerji Dönüşümleri (Fotosentez, Kemosentez & Solunum)',
        importance: 'Essential',
        questionCountEstimate: '2 Soru',
        summary: 'Işığa bağımlı ve bağımsız tepkimeler (Calvin döngüsü), Glikoliz, Krebs döngüsü ve Oksidatif Fosforilasyon (ETS).',
        tips: ['Glikoliz evresi tüm canlılarda ortaktır ve sitoplazmada gerçekleşir.']
      },
      {
        id: 'ayt-biyo-5',
        title: 'Bitki Biyolojisi',
        importance: 'High',
        questionCountEstimate: '2 Soru',
        summary: 'Bitkisel dokular (Meristem, Parankima), Ksilam-Floem ile madde taşınması, Stoma hareketleri, Bitkisel hormonlar (Oksin, Giberellin, Sitokinin, İletim, Tropizma).',
        tips: ['Oksin hormonu büyüme ve yönelmeyi (fototropizma) sağlar, ışık görmeyen tarafta birikir.']
      }
    ]
  },
  {
    id: 'ayt-edebiyat',
    name: 'AYT Türk Dili ve Edebiyatı',
    type: 'AYT',
    category: 'Edebiyat',
    iconName: 'BookOpen',
    colorGradient: 'from-amber-600/25 via-yellow-500/15 to-transparent border-amber-600/40',
    badgeColor: 'bg-amber-600/30 text-amber-200 border-amber-600/40',
    examWeight: '24 Soru',
    description: 'Şiir bilgisi, İslamiyet öncesi, Divan edebiyatı, Tanzimat, Servet-i Fünun, Milli Edebiyat ve Cumhuriyet dönemi.',
    topics: [
      {
        id: 'ayt-edeb-1',
        title: 'Metinlerin Sınıflandırılması & Şiir Bilgisi',
        importance: 'Essential',
        questionCountEstimate: '3-4 Soru',
        summary: 'Nazım birimi, kafiye ve redif bulma, edebi sanatlar (Teşbih, İstiare, Teşhis, İntak, Tenasüp, İlliyet), şiir türleri.',
        tips: ['Ek halindeki redif ile dize sonundaki yazılışları aynı anlamları farklı olan kafiyeleri karıştırmayın.']
      },
      {
        id: 'ayt-edeb-2',
        title: 'İslamiyet Öncesi & Halk Edebiyatı',
        importance: 'High',
        questionCountEstimate: '2-3 Soru',
        summary: 'Koşuk, Sagu, Destanlar. Anonim, Aşık ve Tekke-Tasavvuf edebiyatı (Koşma, Semai, Varsağı, İlahi, Nefes).',
        tips: ['Karacaoğlan ve Aşık Veysel hece ölçüsüyle yazmış, hiç aruz kullanmamıştır.']
      },
      {
        id: 'ayt-edeb-3',
        title: 'Divan Edebiyatı (Şairler & Eserler)',
        importance: 'Essential',
        questionCountEstimate: '4-5 Soru',
        summary: 'Gazel, Kaside, Mesnevi, Rubai, Şarkı. Fuzuli, Baki, Nedim, Şeyhi, Nabi, Şeyh Galip ve önemli mesneviler.',
        tips: ['Nedim mahallileşme akımının, Şeyh Galip ise Sebk-i Hindi akımının en büyük temsilcisidir.']
      },
      {
        id: 'ayt-edeb-4',
        title: 'Tanzimat, Servet-i Fünun & Fecr-i Ati Edebiyatı',
        importance: 'Essential',
        questionCountEstimate: '4-5 Soru',
        summary: 'Şinasi, Namık Kemal, Ziya Paşa, Recaizade Mahmut Ekrem. Tevfik Fikret, Cenap Şahabettin, Halit Ziya Uşaklıgil. Ahmet Haşim.',
        tips: ['Halit Ziya Uşaklıgil (Mai ve Siyah, Aşk-ı Memnu) Türk romanının batılı anlamda ilk olgun örneklerini vermiştir.']
      },
      {
        id: 'ayt-edeb-5',
        title: 'Milli Edebiyat & Cumhuriyet Dönemi Türk Edebiyatı',
        importance: 'Essential',
        questionCountEstimate: '7-9 Soru',
        summary: 'Ömer Seyfettin, Ziya Gökalp, Yakup Kadri, Halide Edip, Reşat Nuri. Beş Hececiler, Yedi Meşaleciler, Garipçiler, İkinci Yeni ve Toplumcu Gerçekçiler.',
        tips: ['Milli Edebiyat anlayışını başlatan bildiri 1911 Genç Kalemler dergisindeki Yeni Lisan makalesidir.']
      }
    ]
  }
];

export const DerslerView: React.FC<DerslerViewProps> = ({ onNavigateToQuiz }) => {
  const [activeTab, setActiveTab] = useState<'TYT' | 'AYT'>('TYT');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<SubjectData | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'mufredat' | 'formuller' | 'analiz'>('mufredat');
  const [importanceFilter, setImportanceFilter] = useState<'all' | 'Essential' | 'High'>('all');

  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mindpulse_completed_topics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleTopicCompletion = (topicId: string) => {
    setCompletedTopicIds((prev) => {
      const next = prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId];
      try {
        localStorage.setItem('mindpulse_completed_topics', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Filter subjects based on active tab and search query
  const filteredSubjects = useMemo(() => {
    return ALL_SUBJECTS.filter((subj) => {
      const matchesTab = subj.type === activeTab;
      if (!matchesTab) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchName = subj.name.toLowerCase().includes(q);
      const matchDesc = subj.description.toLowerCase().includes(q);
      const matchTopic = subj.topics.some(
        (t) => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q)
      );

      return matchName || matchDesc || matchTopic;
    });
  }, [activeTab, searchQuery]);

  // Overall Statistics for TYT & AYT
  const stats = useMemo(() => {
    const tytSubjs = ALL_SUBJECTS.filter((s) => s.type === 'TYT');
    const aytSubjs = ALL_SUBJECTS.filter((s) => s.type === 'AYT');

    const tytTopicsCount = tytSubjs.reduce((acc, s) => acc + s.topics.length, 0);
    const aytTopicsCount = aytSubjs.reduce((acc, s) => acc + s.topics.length, 0);

    const tytDone = tytSubjs.reduce(
      (acc, s) => acc + s.topics.filter((t) => completedTopicIds.includes(t.id)).length,
      0
    );
    const aytDone = aytSubjs.reduce(
      (acc, s) => acc + s.topics.filter((t) => completedTopicIds.includes(t.id)).length,
      0
    );

    return {
      tytTopicsCount,
      aytTopicsCount,
      tytPercent: tytTopicsCount > 0 ? Math.round((tytDone / tytTopicsCount) * 100) : 0,
      aytPercent: aytTopicsCount > 0 ? Math.round((aytDone / aytTopicsCount) * 100) : 0,
      totalCompleted: completedTopicIds.length
    };
  }, [completedTopicIds]);

  const renderSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <Calculator className="w-6 h-6" />;
      case 'Compass': return <Compass className="w-6 h-6" />;
      case 'Feather': return <Feather className="w-6 h-6" />;
      case 'Atom': return <Atom className="w-6 h-6" />;
      case 'FlaskConical': return <FlaskConical className="w-6 h-6" />;
      case 'Dna': return <Dna className="w-6 h-6" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6" />;
      default: return <GraduationCap className="w-6 h-6" />;
    }
  };

  // ==================== DEDICATED FULL PAGE SUBJECT VIEW ====================
  if (selectedSubject) {
    const completedCount = selectedSubject.topics.filter((t) => completedTopicIds.includes(t.id)).length;
    const progressPercent = Math.round((completedCount / selectedSubject.topics.length) * 100);

    const filteredTopics = selectedSubject.topics.filter((t) => {
      if (importanceFilter === 'all') return true;
      return t.importance === importanceFilter;
    });

    return (
      <div className="space-y-8 animate-fade-in pb-16">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <button
            onClick={() => setSelectedSubject(null)}
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-sm bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono font-bold uppercase transition-all w-fit shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
            <span>← Tüm Derslere Dön</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Dersler</span>
            <span>/</span>
            <span className="font-semibold text-zinc-300">{selectedSubject.type}</span>
            <span>/</span>
            <span className="font-bold text-white">{selectedSubject.name}</span>
          </div>

          <button
            onClick={() => onNavigateToQuiz(selectedSubject.category)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider transition-all w-fit"
          >
            <Target className="w-4 h-4" />
            <span>{selectedSubject.name} Sorularını Çöz</span>
          </button>
        </div>

        {/* Hero Banner for Selected Subject */}
        <div className="relative overflow-hidden rounded-sm bg-[#111115] border border-zinc-800 p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="p-3.5 rounded-sm border border-zinc-800 bg-zinc-900 text-white">
                  {renderSubjectIcon(selectedSubject.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm border border-zinc-700 bg-zinc-900 text-zinc-300">
                      {selectedSubject.type} MÜFREDATI
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">Soru Ağırlığı: {selectedSubject.examWeight}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                    {selectedSubject.name}
                  </h1>
                </div>
              </div>

              <p className="text-zinc-400 text-xs leading-relaxed">
                {selectedSubject.description} Tüm konu anlatım özetleri, ÖSYM soru kalıpları analizi ve matematiksel formüller bu sayfada derlenmiştir.
              </p>
            </div>

            {/* Subject Live Progress Box */}
            <div className="p-6 rounded-sm bg-zinc-900 border border-zinc-800 text-center min-w-[220px]">
              <span className="text-[11px] font-mono font-bold uppercase text-zinc-400 block">Ders Öğrenme İlerlemeniz</span>
              <span className="text-3xl font-mono font-bold text-white mt-1 block">%{progressPercent}</span>
              <span className="text-xs font-mono text-zinc-400 mt-0.5 block">{completedCount} / {selectedSubject.topics.length} Konu Tamamlandı</span>
              
              <div className="w-full bg-zinc-950 h-2 rounded-none mt-3 overflow-hidden border border-zinc-800">
                <div 
                  className="bg-white h-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Full-Page Inner Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="inline-flex p-1 rounded-sm bg-[#111115] border border-zinc-800">
            <button
              onClick={() => setActiveDetailTab('mufredat')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeDetailTab === 'mufredat'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>📖 Müfredat & Konu Özetleri ({selectedSubject.topics.length})</span>
            </button>

            {selectedSubject.keyFormulas && selectedSubject.keyFormulas.length > 0 && (
              <button
                onClick={() => setActiveDetailTab('formuller')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                  activeDetailTab === 'formuller'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Zap className="w-4 h-4 text-zinc-300" />
                <span>⚡ Formül Kütüphanesi ({selectedSubject.keyFormulas.length})</span>
              </button>
            )}

            <button
              onClick={() => setActiveDetailTab('analiz')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeDetailTab === 'analiz'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>📊 Ders Analiz Raporu</span>
            </button>
          </div>

          {/* Importance Filter */}
          {activeDetailTab === 'mufredat' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono">Önem Filtresi:</span>
              <button
                onClick={() => setImportanceFilter('all')}
                className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold uppercase transition-all ${
                  importanceFilter === 'all' ? 'bg-zinc-800 text-white' : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setImportanceFilter('Essential')}
                className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold uppercase transition-all ${
                  importanceFilter === 'Essential' ? 'bg-rose-950 border border-rose-500/40 text-rose-300' : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                Kesin Çıkanlar
              </button>
              <button
                onClick={() => setImportanceFilter('High')}
                className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold uppercase transition-all ${
                  importanceFilter === 'High' ? 'bg-amber-950 border border-amber-500/40 text-amber-300' : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                Yüksek Önem
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: MÜFREDAT & KONU ÖZETLERİ */}
        {activeDetailTab === 'mufredat' && (
          <div className="space-y-4">
            {filteredTopics.map((t, idx) => {
              const isDone = completedTopicIds.includes(t.id);
              return (
                <div
                  key={t.id}
                  className={`rounded-sm border p-6 transition-all duration-300 ${
                    isDone 
                      ? 'bg-emerald-950/20 border-emerald-500/30' 
                      : 'bg-[#111115] border-zinc-800 hover:border-zinc-700 shadow-xl'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <button
                        onClick={() => toggleTopicCompletion(t.id)}
                        className={`mt-1 p-2 rounded-sm border transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-lg'
                            : 'bg-zinc-950 border-zinc-700 text-zinc-500 hover:border-zinc-500'
                        }`}
                        title={isDone ? 'Tamamlandı' : 'Tamamlandı olarak işaretle'}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs font-mono font-bold text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded-sm border border-zinc-800">
                            Konu #{idx + 1}
                          </span>
                          <h3 className={`text-base font-bold ${isDone ? 'text-emerald-400 line-through' : 'text-zinc-100'}`}>
                            {t.title}
                          </h3>
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm border ${
                            t.importance === 'Essential' 
                              ? 'bg-rose-950/80 text-rose-300 border-rose-500/40' 
                              : t.importance === 'High'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                              : 'bg-zinc-900 text-zinc-300 border-zinc-700'
                          }`}>
                            {t.importance === 'Essential' ? '🔥 Kesin Soru Çıkar' : t.importance === 'High' ? '⚡ Yüksek Önem' : '📌 Standart'}
                          </span>
                        </div>

                        <div className="p-4 rounded-sm bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed">
                          <FormattedMathText text={t.summary} />
                        </div>

                        {/* Math Formulas */}
                        {t.formulas && t.formulas.length > 0 && (
                          <div className="space-y-2 pt-1">
                            <span className="text-xs font-mono font-bold text-zinc-400 block uppercase">Kritik Bağıntılar:</span>
                            <div className="flex items-center gap-2 flex-wrap">
                              {t.formulas.map((form, fIdx) => (
                                <div key={fIdx} className="px-3.5 py-2 rounded-sm bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200">
                                  <FormattedMathText text={`$${form}$`} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tips */}
                        {t.tips && t.tips.length > 0 && (
                          <div className="p-3.5 rounded-sm bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-zinc-300 mt-0.5 flex-shrink-0" />
                            <div>
                              <strong className="text-zinc-200 font-mono font-bold uppercase block mb-0.5">Sınav Tüyosu & Sık Yapılan Hata:</strong>
                              {t.tips.join(' ')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right whitespace-nowrap bg-zinc-950 p-3 rounded-sm border border-zinc-800 font-mono">
                      <span className="text-[10px] text-zinc-500 uppercase block">ÖSYM Soru Tahmini</span>
                      <span className="text-xs font-bold text-zinc-200">{t.questionCountEstimate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: FORMÜLLER & KİLİT BİLGİLER */}
        {activeDetailTab === 'formuller' && selectedSubject.keyFormulas && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedSubject.keyFormulas.map((f, idx) => (
              <div key={idx} className="p-6 rounded-sm bg-[#111115] border border-zinc-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-300 bg-zinc-900 px-3 py-1 rounded-sm border border-zinc-700 uppercase">
                    Formül #{idx + 1}
                  </span>
                  <Zap className="w-4 h-4 text-zinc-400" />
                </div>

                <h4 className="text-sm font-bold text-white">{f.title}</h4>

                <div className="p-4 rounded-sm bg-zinc-950 border border-zinc-800 text-center">
                  <FormattedMathText text={`$${f.math}$`} className="text-lg font-mono font-semibold text-white" />
                </div>

                {f.note && (
                  <p className="text-xs font-mono text-zinc-400 italic bg-zinc-950 p-3 rounded-sm border border-zinc-800">
                    💡 <strong>Not:</strong> {f.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: DERS ANALİZ RAPORU */}
        {activeDetailTab === 'analiz' && (
          <div className="p-8 rounded-sm bg-[#111115] border border-zinc-800 space-y-6">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">Ders Performans Analizi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
              <div className="p-5 rounded-sm bg-zinc-950 border border-zinc-800">
                <span className="text-xs text-zinc-400 block font-medium uppercase">Toplam Konu Sayısı</span>
                <span className="text-2xl font-bold text-white mt-1 block">{selectedSubject.topics.length} Konu</span>
              </div>
              <div className="p-5 rounded-sm bg-zinc-950 border border-zinc-800">
                <span className="text-xs text-zinc-400 block font-medium uppercase">Tamamlanan Konu</span>
                <span className="text-2xl font-bold text-emerald-400 mt-1 block">{completedCount} Konu</span>
              </div>
              <div className="p-5 rounded-sm bg-zinc-950 border border-zinc-800">
                <span className="text-xs text-zinc-400 block font-medium uppercase">Kalan Konu</span>
                <span className="text-2xl font-bold text-amber-400 mt-1 block">{selectedSubject.topics.length - completedCount} Konu</span>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ==================== MAIN DERSLER CATALOGUE GRID VIEW ====================
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Top Welcome Banner */}
      <div className="bg-[#111115] border border-zinc-800 rounded-sm p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] font-mono font-bold tracking-widest text-zinc-400 uppercase block mb-1">
              YKS MÜFREDATI & KONU ANLATIM KATALOĞU
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              TYT & AYT Ders Müfredatı
            </h1>
            <p className="text-zinc-400 text-xs leading-relaxed">
              ÖSYM sınav formatına tam uyumlu konu özetleri, formül kartları ve çıkabilecek soru tipleri analizi ile ders çalışmanızı planlayın.
            </p>
          </div>

          {/* Quick Progress Cards */}
          <div className="flex items-center gap-4 w-full md:w-auto font-mono">
            <div className="flex-1 md:flex-none p-4 rounded-sm bg-zinc-900 border border-zinc-800 text-center min-w-[120px]">
              <span className="text-[10px] text-zinc-400 block uppercase font-bold">TYT İlerlemesi</span>
              <span className="text-xl font-bold text-white mt-1 block">%{stats.tytPercent}</span>
              <div className="w-full bg-zinc-950 h-1.5 rounded-none mt-2 overflow-hidden border border-zinc-800">
                <div className="bg-white h-full transition-all duration-500" style={{ width: `${stats.tytPercent}%` }} />
              </div>
            </div>

            <div className="flex-1 md:flex-none p-4 rounded-sm bg-zinc-900 border border-zinc-800 text-center min-w-[120px]">
              <span className="text-[10px] text-zinc-400 block uppercase font-bold">AYT İlerlemesi</span>
              <span className="text-xl font-bold text-white mt-1 block">%{stats.aytPercent}</span>
              <div className="w-full bg-zinc-950 h-1.5 rounded-none mt-2 overflow-hidden border border-zinc-800">
                <div className="bg-white h-full transition-all duration-500" style={{ width: `${stats.aytPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* TYT / AYT Selector */}
        <div className="inline-flex p-1 bg-[#111115] border border-zinc-800 rounded-sm">
          <button
            onClick={() => setActiveTab('TYT')}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-sm text-xs font-mono font-bold uppercase transition-all duration-200 ${
              activeTab === 'TYT'
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>TYT (Temel Yeterlilik)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-300">
              {ALL_SUBJECTS.filter((s) => s.type === 'TYT').length} Ders
            </span>
          </button>

          <button
            onClick={() => setActiveTab('AYT')}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-sm text-xs font-mono font-bold uppercase transition-all duration-200 ${
              activeTab === 'AYT'
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>AYT (Alan Yeterlilik)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-300">
              {ALL_SUBJECTS.filter((s) => s.type === 'AYT').length} Ders
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Ders veya konu ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-[#111115] border border-zinc-800 text-zinc-200 text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-all font-mono"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((subj) => {
          const completedInSubj = subj.topics.filter((t) => completedTopicIds.includes(t.id)).length;
          const subjPercent = Math.round((completedInSubj / subj.topics.length) * 100);

          return (
            <div
              key={subj.id}
              onClick={() => setSelectedSubject(subj)}
              className="group relative rounded-sm bg-[#111115] border border-zinc-800 hover:border-zinc-700 p-6 flex flex-col justify-between transition-all cursor-pointer space-y-4 shadow-xl"
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-sm border border-zinc-800 bg-zinc-900 text-white">
                      {renderSubjectIcon(subj.iconName)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-zinc-300 transition-colors flex items-center gap-1.5">
                        <span>{subj.name}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-zinc-400" />
                      </h3>
                      <span className="text-xs font-mono text-zinc-400 block mt-0.5">
                        {subj.topics.length} Konu Başlığı
                      </span>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-sm border border-zinc-700 bg-zinc-900 text-zinc-300 uppercase">
                    {subj.type}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {subj.description}
                </p>

                {/* Exam Weight Badge */}
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-950 p-2.5 rounded-sm border border-zinc-800">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Soru Ağırlığı: <strong className="text-zinc-200">{subj.examWeight}</strong></span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1 font-mono text-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Tamamlanan Konu</span>
                    <span>{completedInSubj}/{subj.topics.length} (%{subjPercent})</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-1.5 rounded-none overflow-hidden border border-zinc-800">
                    <div
                      className="bg-white h-full transition-all duration-300"
                      style={{ width: `${subjPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-zinc-800/80">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSubject(subj);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-mono font-bold uppercase transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Dersi Aç & İncele</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToQuiz(subj.category);
                  }}
                  className="flex items-center justify-center p-2.5 rounded-sm bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-all"
                  title="Bu Dersin Testini Çöz"
                >
                  <Target className="w-4 h-4 text-zinc-300" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-16 rounded-sm bg-[#111115] border border-zinc-800">
          <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-300 uppercase tracking-tight">Aramanıza Uygun Ders Bulunamadı</h3>
          <p className="text-xs text-zinc-500 mt-1">Lütfen arama teriminizi değiştirin veya sıfırlayın.</p>
        </div>
      )}

    </div>
  );
};

export default DerslerView;
