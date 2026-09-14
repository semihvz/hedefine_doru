import { GoogleGenAI } from '@google/genai';
import type { Question, Difficulty, Flashcard } from '../types/quiz';
import { YDT_PRELOADED_QUESTIONS } from './ydtQuestionsData';
import { LOGARITHM_100_QUESTIONS } from './logarithm100QuestionsData';

// Dynamic Random Option Shuffling Engine (Fisher-Yates)
export function shuffleQuestionOptions(question: Question): Question {
  const optsCopy = question.options.map(o => ({ ...o }));

  // Fisher-Yates Shuffle
  for (let i = optsCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optsCopy[i], optsCopy[j]] = [optsCopy[j], optsCopy[i]];
  }

  const labels = ['A', 'B', 'C', 'D', 'E'];
  let newCorrectId = 'A';

  const newOptionsList = optsCopy.map((opt, idx) => {
    const label = labels[idx];
    if (opt.isCorrect || opt.id === question.correctOptionId) {
      newCorrectId = label;
      return { ...opt, id: label, isCorrect: true };
    }
    return { ...opt, id: label, isCorrect: false };
  });

  return {
    ...question,
    difficulty: 'advanced',
    options: newOptionsList,
    correctOptionId: newCorrectId,
  };
}

// Helper to fetch all embedded preloaded questions
export function getPreloadedQuestions(): Question[] {
  const all: Question[] = [];
  if (LOGARITHM_100_QUESTIONS && Array.isArray(LOGARITHM_100_QUESTIONS)) {
    all.push(...LOGARITHM_100_QUESTIONS);
  }
  Object.values(FALLBACK_TOPICS_DATABASE).forEach(list => {
    all.push(...list);
  });
  if (YDT_PRELOADED_QUESTIONS && Array.isArray(YDT_PRELOADED_QUESTIONS)) {
    all.push(...YDT_PRELOADED_QUESTIONS);
  }
  return all;
}

const FALLBACK_TOPICS_DATABASE: Record<string, Question[]> = {
  'Matematik': [
    {
      id: 'q_math_1',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: '\\frac{\\log(3!) - \\log(M)}{\\log(2!)} = 1 eşitliğini sağlayan M gerçel sayısı kaçtır?',
      options: [
        { id: 'A', text: '3', isCorrect: true },
        { id: 'B', text: '4', isCorrect: false },
        { id: 'C', text: '5', isCorrect: false },
        { id: 'D', text: '6', isCorrect: false },
        { id: 'E', text: '7', isCorrect: false },
      ],
      correctOptionId: 'A',
      explanation: {
        whyCorrect: '\\log(3!) - \\log(M) = 1 \\cdot \\log(2!) \\Rightarrow \\log(6/M) = \\log(2) \\Rightarrow 6/M = 2 \\Rightarrow M = 3.',
        whyOthersIncorrect: {
          B: 'M = 4 için log(6/4) = log(1.5) ≠ log(2) olur.',
          C: 'M = 5 için log(6/5) = log(1.2) ≠ log(2) olur.',
          D: 'M = 6 için log(6/6) = log(1) = 0 ≠ log(2) olur.',
          E: 'M = 7 için log(6/7) ≠ log(2) olur.'
        },
        topicSummary: 'Logaritma Özellikleri: \\log(a) - \\log(b) = \\log(a/b) ve k \\cdot \\log(a) = \\log(a^k).',
        keyTakeaway: 'Faktöriyel değerlerini açıp logaritma fark kuralını uygulayarak sonuca ulaşılır.'
      },
      createdAt: 1710000000101
    },
    {
      id: 'q_math_2',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: '\\frac{\\log(4!) - \\log(M)}{\\log(3!)} = 1 eşitliğini sağlayan M gerçel sayısı kaçtır?',
      options: [
        { id: 'A', text: '3', isCorrect: false },
        { id: 'B', text: '4', isCorrect: true },
        { id: 'C', text: '5', isCorrect: false },
        { id: 'D', text: '6', isCorrect: false },
        { id: 'E', text: '7', isCorrect: false },
      ],
      correctOptionId: 'B',
      explanation: {
        whyCorrect: '\\log(4!) - \\log(M) = \\log(3!) \\Rightarrow \\log(24/M) = \\log(6) \\Rightarrow 24/M = 6 \\Rightarrow M = 4.',
        whyOthersIncorrect: {
          A: 'M = 3 için 24/3 = 8 ≠ 6 olur.',
          C: 'M = 5 için 24/5 = 4.8 ≠ 6 olur.',
          D: 'M = 6 için 24/6 = 4 ≠ 6 olur.',
          E: 'M = 7 için 24/7 ≠ 6 olur.'
        },
        topicSummary: 'Logaritma Çıkarma Kuralı ve Faktöriyel Bölümü (n! / (n-1)! = n).',
        keyTakeaway: '4! / 3! = 4 olduğu için M = 4 bulunur.'
      },
      createdAt: 1710000000102
    },
    {
      id: 'q_math_3',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: '\\frac{\\log(5!) - \\log(M)}{\\log(4!)} = 1 eşitliğini sağlayan M gerçel sayısı kaçtır?',
      options: [
        { id: 'A', text: '3', isCorrect: false },
        { id: 'B', text: '4', isCorrect: false },
        { id: 'C', text: '5', isCorrect: true },
        { id: 'D', text: '6', isCorrect: false },
        { id: 'E', text: '7', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: '\\log(120/M) = \\log(24) \\Rightarrow 120/M = 24 \\Rightarrow M = 5.',
        whyOthersIncorrect: {
          A: 'M = 3 için 120/3 = 40 ≠ 24.',
          B: 'M = 4 için 120/4 = 30 ≠ 24.',
          D: 'M = 6 için 120/6 = 20 ≠ 24.',
          E: 'M = 7 için 120/7 ≠ 24.'
        },
        topicSummary: 'n! = n \\times (n-1)! eşitliğinden 5! / 4! = 5 elde edilir.',
        keyTakeaway: 'Logaritmik denklemde log(5!/M) = log(4!) ise M = 5’tir.'
      },
      createdAt: 1710000000103
    },
    {
      id: 'q_math_4',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: '\\frac{\\log(6!) - \\log(M)}{\\log(5!)} = 1 eşitliğini sağlayan M gerçel sayısı kaçtır?',
      options: [
        { id: 'A', text: '3', isCorrect: false },
        { id: 'B', text: '4', isCorrect: false },
        { id: 'C', text: '5', isCorrect: false },
        { id: 'D', text: '6', isCorrect: true },
        { id: 'E', text: '7', isCorrect: false },
      ],
      correctOptionId: 'D',
      explanation: {
        whyCorrect: '\\log(6!/M) = \\log(5!) \\Rightarrow 6!/M = 5! \\Rightarrow M = 6!/5! = 6.',
        whyOthersIncorrect: {
          A: 'M = 3 yanlış seçenektir.',
          B: 'M = 4 yanlış seçenektir.',
          C: 'M = 5 yanlış seçenektir.',
          E: 'M = 7 yanlış seçenektir.'
        },
        topicSummary: 'Arka arkaya faktöriyel oranları n! / (n-1)! = n kuralını verir.',
        keyTakeaway: '6! / 5! = 6 olduğundan M = 6 değerini alır.'
      },
      createdAt: 1710000000104
    },
    {
      id: 'q_math_5',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: '\\frac{\\log(7!) - \\log(M)}{\\log(6!)} = 1 eşitliğini sağlayan M gerçel sayısı kaçtır?',
      options: [
        { id: 'A', text: '3', isCorrect: false },
        { id: 'B', text: '4', isCorrect: false },
        { id: 'C', text: '5', isCorrect: false },
        { id: 'D', text: '6', isCorrect: false },
        { id: 'E', text: '7', isCorrect: true },
      ],
      correctOptionId: 'E',
      explanation: {
        whyCorrect: '\\log(7!/M) = \\log(6!) \\Rightarrow 7!/M = 6! \\Rightarrow M = 7!/6! = 7.',
        whyOthersIncorrect: {
          A: 'M = 3 yanlış seçenektir.',
          B: 'M = 4 yanlış seçenektir.',
          C: 'M = 5 yanlış seçenektir.',
          D: 'M = 6 yanlış seçenektir.'
        },
        topicSummary: 'Faktöriyel ve Logaritma Eşitlikleri.',
        keyTakeaway: '7! = 7 \\cdot 6! olduğu için M = 7 çıkar.'
      },
      createdAt: 1710000000105
    },
    {
      id: 'q_math_6',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: '\\frac{\\log(5!) - \\log(M)}{\\log(2!)} = 3 eşitliğini sağlayan M gerçel sayısı kaçtır?',
      options: [
        { id: 'A', text: '13', isCorrect: false },
        { id: 'B', text: '14', isCorrect: false },
        { id: 'C', text: '15', isCorrect: true },
        { id: 'D', text: '16', isCorrect: false },
        { id: 'E', text: '17', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: '\\log(5!) - \\log(M) = 3 \\cdot \\log(2!) = \\log(2^3) = \\log(8). Buradan 120/M = 8 \\Rightarrow M = 120/8 = 15.',
        whyOthersIncorrect: {
          A: '120/13 ≈ 9.23 ≠ 8.',
          B: '120/14 ≈ 8.57 ≠ 8.',
          D: '120/16 = 7.5 ≠ 8.',
          E: '120/17 ≈ 7.05 ≠ 8.'
        },
        topicSummary: 'Logaritmada k üs olarak içeri girer: k \\cdot \\log(x) = \\log(x^k). 2! = 2 ve 2^3 = 8’dir.',
        keyTakeaway: '120 / M = 8 denkleminden M = 15 bulunur.'
      },
      createdAt: 1710000000106
    },
    {
      id: 'q_math_7',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: '\\frac{\\log(6!) - \\log(M)}{\\log(2!)} = 3 eşitliğini sağlayan M gerçel sayısı kaçtır?',
      options: [
        { id: 'A', text: '88', isCorrect: false },
        { id: 'B', text: '89', isCorrect: false },
        { id: 'C', text: '90', isCorrect: true },
        { id: 'D', text: '91', isCorrect: false },
        { id: 'E', text: '92', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: '6! = 720 ve 3 \\cdot \\log(2!) = \\log(8). \\log(720/M) = \\log(8) \\Rightarrow 720/M = 8 \\Rightarrow M = 720/8 = 90.',
        whyOthersIncorrect: {
          A: '720 / 88 ≈ 8.18 ≠ 8.',
          B: '720 / 89 ≈ 8.089 ≠ 8.',
          D: '720 / 91 ≈ 7.91 ≠ 8.',
          E: '720 / 92 ≈ 7.82 ≠ 8.'
        },
        topicSummary: '720 / 8 = 90 faktöriyel bölme işlemi.',
        keyTakeaway: 'Logaritma ve faktöriyel işlemlerinde üs kuralı 3 \\log(2) = \\log(8) uygulanır.'
      },
      createdAt: 1710000000107
    },
    {
      id: 'q_math_8',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: '\\frac{\\log(8!) - \\log(M)}{\\log(4!)} = 2 eşitliğini sağlayan M gerçel sayısı kaçtır?',
      options: [
        { id: 'A', text: '68', isCorrect: false },
        { id: 'B', text: '69', isCorrect: false },
        { id: 'C', text: '70', isCorrect: true },
        { id: 'D', text: '71', isCorrect: false },
        { id: 'E', text: '72', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: '4! = 24. 2 \\cdot \\log(24) = \\log(24^2) = \\log(576). 8! = 40320. 40320 / M = 576 \\Rightarrow M = 40320 / 576 = 70.',
        whyOthersIncorrect: {
          A: '576 \\times 68 = 39168 ≠ 8!.',
          B: '576 \\times 69 = 39744 ≠ 8!.',
          D: '576 \\times 71 = 40896 ≠ 8!.',
          E: '576 \\times 72 = 41472 ≠ 8!.'
        },
        topicSummary: '8! / (4!)^2 = (8 \\cdot 7 \\cdot 6 \\cdot 5) / 24 = 1680 / 24 = 70.',
        keyTakeaway: 'M = 8! / (4!)^2 sadeleştirmesiyle 70 sonucunu verir.'
      },
      createdAt: 1710000000108
    },
    {
      id: 'q_math_9',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: '\\frac{\\log(9!) - \\log(M)}{\\log(3!)} = 3 eşitliğini sağlayan M gerçel sayısı kaçtır?',
      options: [
        { id: 'A', text: '1678', isCorrect: false },
        { id: 'B', text: '1679', isCorrect: false },
        { id: 'C', text: '1680', isCorrect: true },
        { id: 'D', text: '1681', isCorrect: false },
        { id: 'E', text: '1682', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: '3! = 6 ve 3 \\cdot \\log(6) = \\log(6^3) = \\log(216). 9! = 362880. 362880 / M = 216 \\Rightarrow M = 362880 / 216 = 1680.',
        whyOthersIncorrect: {
          A: '216 \\times 1678 = 362448 ≠ 9!.',
          B: '216 \\times 1679 = 362664 ≠ 9!.',
          D: '216 \\times 1681 = 363096 ≠ 9!.',
          E: '216 \\times 1682 = 363312 ≠ 9!.'
        },
        topicSummary: '9! / 6^3 = 362880 / 216 = 1680 faktöriyel bölmesi.',
        keyTakeaway: 'Logaritmik denklemde M = 9! / (3!)^3 = 1680 hesaplanır.'
      },
      createdAt: 1710000000109
    },
    {
      id: 'q_math_10',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: '\\frac{\\log(10!) - \\log(M)}{\\log(5!)} = 2 eşitliğini sağlayan M gerçel sayısı kaçtır?',
      options: [
        { id: 'A', text: '250', isCorrect: false },
        { id: 'B', text: '251', isCorrect: false },
        { id: 'C', text: '252', isCorrect: true },
        { id: 'D', text: '253', isCorrect: false },
        { id: 'E', text: '254', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: '5! = 120 ve 2 \\cdot \\log(120) = \\log(120^2) = \\log(14400). 10! / M = 14400 \\Rightarrow M = 10! / (5!)^2 = C(10, 5) = 252.',
        whyOthersIncorrect: {
          A: '14400 \\times 250 = 3600000 ≠ 10!.',
          B: '14400 \\times 251 = 3614400 ≠ 10!.',
          D: '14400 \\times 253 = 3643200 ≠ 10!.',
          E: '14400 \\times 254 = 3657600 ≠ 10!.'
        },
        topicSummary: '10! / (5! \\cdot 5!) ifadesi kombinasyon formülü olan C(10, 5) = 252’dir.',
        keyTakeaway: '10! / (5!)^2 oranı kombinasyon hesabı C(10, 5) = 252’ye eşittir.'
      },
      createdAt: 1710000000110
    },
    {
      id: 'q_math_11',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = 2x + 50\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(20)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '225', isCorrect: false },
        { id: 'B', text: '235', isCorrect: false },
        { id: 'C', text: '230', isCorrect: true },
        { id: 'D', text: '240', isCorrect: false },
        { id: 'E', text: '220', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: 'Önce içteki f(20) hesaplanır: f(20) = 2(20) + 50 = 40 + 50 = 90. Sonra çıkan değer dıştaki fonksiyona yazılır: (f \\circ f)(20) = f(90) = 2(90) + 50 = 180 + 50 = 230.',
        whyOthersIncorrect: {
          A: 'İçteki veya dıştaki işlemde toplama hatası yapılmıştır.',
          B: 'İşlem önceliği veya çarpma hatası yapılmıştır.',
          D: 'f(20) = 90 yerine 95 gibi yanlış bir adım alınmıştır.',
          E: 'İkinci adımda 50 yerine 40 eklenmiş olabilir.'
        },
        topicSummary: 'Bileşke Fonksiyon Kuralı: (f \\circ g)(x) = f(g(x)). İşleme en içteki fonksiyondan başlanır.',
        keyTakeaway: '(f \\circ f)(20) için önce f(20) bulunur, elde edilen sonuç tekrar f fonksiyonunda yerine konur.'
      },
      createdAt: 1710000000111
    },
    {
      id: 'q_math_12',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = 4x - 30\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(15)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '95', isCorrect: false },
        { id: 'B', text: '80', isCorrect: false },
        { id: 'C', text: '100', isCorrect: false },
        { id: 'D', text: '90', isCorrect: true },
        { id: 'E', text: '85', isCorrect: false },
      ],
      correctOptionId: 'D',
      explanation: {
        whyCorrect: 'f(15) = 4(15) - 30 = 60 - 30 = 30. Ardından f(30) = 4(30) - 30 = 120 - 30 = 90.',
        whyOthersIncorrect: {
          A: 'Çıkarma hatası yapılmıştır.',
          B: '30 yerine 20 yazılırsa 80 çıkar.',
          C: '120 - 20 = 100 hatası yapılmıştır.',
          E: 'Yanlış işlem takibi.'
        },
        topicSummary: 'Doğrusal fonksiyonların bileşkesinde adım adım değer hesabı.',
        keyTakeaway: 'f(15) = 30 ve f(30) = 90 olarak bulunur.'
      },
      createdAt: 1710000000112
    },
    {
      id: 'q_math_13',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = 5x + 10\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(5)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '185', isCorrect: true },
        { id: 'B', text: '190', isCorrect: false },
        { id: 'C', text: '175', isCorrect: false },
        { id: 'D', text: '195', isCorrect: false },
        { id: 'E', text: '180', isCorrect: false },
      ],
      correctOptionId: 'A',
      explanation: {
        whyCorrect: 'f(5) = 5(5) + 10 = 25 + 10 = 35. Buradan f(35) = 5(35) + 10 = 175 + 10 = 185.',
        whyOthersIncorrect: {
          B: '175 + 15 hatası.',
          C: 'Son adımdaki +10 unutulursa 175 bulunur.',
          D: '5 x 35 hesabı yanlış yapılmıştır.',
          E: 'Toplama hatası.'
        },
        topicSummary: 'Bileşke fonksiyon değer hesabı.',
        keyTakeaway: 'f(5) = 35 ve f(35) = 185 sonucunu verir.'
      },
      createdAt: 1710000000113
    },
    {
      id: 'q_math_14',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = 2x - 40\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(30)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '10', isCorrect: false },
        { id: 'B', text: '-10', isCorrect: false },
        { id: 'C', text: '20', isCorrect: false },
        { id: 'D', text: '30', isCorrect: false },
        { id: 'E', text: '0', isCorrect: true },
      ],
      correctOptionId: 'E',
      explanation: {
        whyCorrect: 'f(30) = 2(30) - 40 = 60 - 40 = 20. Ardından f(20) = 2(20) - 40 = 40 - 40 = 0.',
        whyOthersIncorrect: {
          A: 'Çıkarma hatası.',
          B: 'İşaret hatası.',
          C: 'İlk adım f(30) = 20 sonucudur.',
          D: 'Başlangıçtaki x değeri çeldiricidir.'
        },
        topicSummary: 'Sıfır sonucunu veren bileşke fonksiyon örneği.',
        keyTakeaway: 'f(30) = 20 ve f(20) = 0 elde edilir.'
      },
      createdAt: 1710000000114
    },
    {
      id: 'q_math_15',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = 3x + 45\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(10)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '275', isCorrect: false },
        { id: 'B', text: '260', isCorrect: false },
        { id: 'C', text: '270', isCorrect: true },
        { id: 'D', text: '280', isCorrect: false },
        { id: 'E', text: '265', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: 'f(10) = 3(10) + 45 = 30 + 45 = 75. f(75) = 3(75) + 45 = 225 + 45 = 270.',
        whyOthersIncorrect: {
          A: '225 + 50 hatası.',
          B: '225 + 35 hatası.',
          D: 'Toplama hatası.',
          E: 'İşlem hatası.'
        },
        topicSummary: 'Lineer fonksiyon bileşkesi.',
        keyTakeaway: 'f(10) = 75 ve f(75) = 270.'
      },
      createdAt: 1710000000115
    },
    {
      id: 'q_math_16',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = -2x + 100\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(40)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '70', isCorrect: false },
        { id: 'B', text: '40', isCorrect: false },
        { id: 'C', text: '80', isCorrect: false },
        { id: 'D', text: '60', isCorrect: true },
        { id: 'E', text: '50', isCorrect: false },
      ],
      correctOptionId: 'D',
      explanation: {
        whyCorrect: 'f(40) = -2(40) + 100 = -80 + 100 = 20. f(20) = -2(20) + 100 = -40 + 100 = 60.',
        whyOthersIncorrect: {
          A: '-40 + 110 hatası.',
          B: 'İlk adımdaki x değeri.',
          C: '-20 + 100 hatası.',
          E: '-50 + 100 hatası.'
        },
        topicSummary: 'Negatif eğimli doğrusal fonksiyon bileşkesi.',
        keyTakeaway: 'f(40) = 20 ve f(20) = 60.'
      },
      createdAt: 1710000000116
    },
    {
      id: 'q_math_17',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = 4x + 20\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(10)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '250', isCorrect: false },
        { id: 'B', text: '270', isCorrect: false },
        { id: 'C', text: '260', isCorrect: true },
        { id: 'D', text: '240', isCorrect: false },
        { id: 'E', text: '280', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: 'f(10) = 4(10) + 20 = 40 + 20 = 60. f(60) = 4(60) + 20 = 240 + 20 = 260.',
        whyOthersIncorrect: {
          A: '240 + 10 hatası.',
          B: '240 + 30 hatası.',
          D: 'Son adımdaki +20 unutulursa 240 olur.',
          E: 'Toplama hatası.'
        },
        topicSummary: 'Adım adım değer bulma.',
        keyTakeaway: 'f(10) = 60 ve f(60) = 260.'
      },
      createdAt: 1710000000117
    },
    {
      id: 'q_math_18',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = 6x - 150\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(30)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '30', isCorrect: true },
        { id: 'B', text: '35', isCorrect: false },
        { id: 'C', text: '20', isCorrect: false },
        { id: 'D', text: '40', isCorrect: false },
        { id: 'E', text: '25', isCorrect: false },
      ],
      correctOptionId: 'A',
      explanation: {
        whyCorrect: 'f(30) = 6(30) - 150 = 180 - 150 = 30. Tekrar f(30) = 6(30) - 150 = 30 çıkar. Bu nokta sabittir (f(30) = 30).',
        whyOthersIncorrect: {
          B: 'İşlem hatası.',
          C: 'Yanlış çıkarma.',
          D: 'Çarpmada hata.',
          E: 'Yanlış hesaplama.'
        },
        topicSummary: 'Sabit Nokta (Fixed Point): f(x) = x durumunda bileşke fonksiyonlar aynı değeri üretir.',
        keyTakeaway: 'f(30) = 30 olduğu için (f \\circ f)(30) = 30 olarak kalır.'
      },
      createdAt: 1710000000118
    },
    {
      id: 'q_math_19',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = x + 100\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(50)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '240', isCorrect: false },
        { id: 'B', text: '260', isCorrect: false },
        { id: 'C', text: '250', isCorrect: true },
        { id: 'D', text: '230', isCorrect: false },
        { id: 'E', text: '270', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: 'f(50) = 50 + 100 = 150. f(150) = 150 + 100 = 250.',
        whyOthersIncorrect: {
          A: 'Toplama hatası.',
          B: 'Toplama hatası.',
          D: 'Toplama hatası.',
          E: 'Toplama hatası.'
        },
        topicSummary: 'Öteleme fonksiyonunda bileşke alma: (f \\circ f)(x) = x + 100 + 100 = x + 200.',
        keyTakeaway: '(f \\circ f)(50) = 50 + 200 = 250.'
      },
      createdAt: 1710000000119
    },
    {
      id: 'q_math_20',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = 3x - 100\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(40)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '-30', isCorrect: false },
        { id: 'B', text: '-50', isCorrect: false },
        { id: 'C', text: '-20', isCorrect: false },
        { id: 'D', text: '-40', isCorrect: true },
        { id: 'E', text: '-10', isCorrect: false },
      ],
      correctOptionId: 'D',
      explanation: {
        whyCorrect: 'f(40) = 3(40) - 100 = 120 - 100 = 20. f(20) = 3(20) - 100 = 60 - 100 = -40.',
        whyOthersIncorrect: {
          A: '60 - 90 hatası.',
          B: 'İşlem hatası.',
          C: '60 - 80 hatası.',
        E: '60 - 70 hatası.'
        },
        topicSummary: 'Sonucu negatif çıkan fonksiyon bileşkesi.',
        keyTakeaway: 'f(40) = 20 ve f(20) = -40.'
      },
      createdAt: 1710000000150
    },
    {
      id: 'q_math_51',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Dik koordinat düzleminde \\(y = x^2\\) ve \\(y = 3x\\) fonksiyonlarının grafikleri aşağıda verilmiştir. Şekildeki kırmızı, mavi ve sarı boyalı bölgelerin alanları sırasıyla K, M ve S olduğuna göre aşağıdaki sıralamalardan hangisi doğrudur?',
      svgDiagram: `<svg viewBox="0 0 380 220" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" style="background:rgba(15, 23, 42, 0.6); border-radius:12px; padding:10px;">
        <defs>
          <linearGradient id="gradK1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.5"/><stop offset="100%" stop-color="#ef4444" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradM1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradS1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eab308" stop-opacity="0.5"/><stop offset="100%" stop-color="#eab308" stop-opacity="0.15"/></linearGradient>
        </defs>
        <line x1="50" y1="180" x2="340" y2="180" stroke="#64748b" stroke-width="2"/>
        <line x1="60" y1="190" x2="60" y2="20" stroke="#64748b" stroke-width="2"/>
        <text x="345" y="184" fill="#94a3b8" font-size="12">x</text>
        <text x="55" y="15" fill="#94a3b8" font-size="12">y</text>
        <path d="M 60 180 Q 100 176 140 150 L 140 180 Z" fill="url(#gradS1)"/>
        <path d="M 60 180 L 140 80 L 140 150 Q 100 176 60 180 Z" fill="url(#gradM1)"/>
        <path d="M 140 80 L 300 20 Q 220 50 140 150 L 140 80 Z" fill="url(#gradK1)"/>
        <path d="M 60 180 Q 180 160 300 20" stroke="#a855f7" stroke-width="2.5" fill="none"/>
        <line x1="60" y1="180" x2="300" y2="20" stroke="#38bdf8" stroke-width="2.5"/>
        <line x1="140" y1="20" x2="140" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <line x1="300" y1="20" x2="300" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <text x="140" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=1</text>
        <text x="300" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=3</text>
        <text x="100" y="172" fill="#facc15" font-size="13" font-weight="bold">S</text>
        <text x="115" y="125" fill="#60a5fa" font-size="13" font-weight="bold">M</text>
        <text x="210" y="80" fill="#f87171" font-size="14" font-weight="bold">K</text>
        <text x="270" y="40" fill="#38bdf8" font-size="11">y=3x</text>
        <text x="250" y="140" fill="#a855f7" font-size="11">y=x²</text>
      </svg>`,
      options: [
        { id: 'A', text: 'K < S < M', isCorrect: false },
        { id: 'B', text: 'M < K < S', isCorrect: false },
        { id: 'C', text: 'M < S < K', isCorrect: false },
        { id: 'D', text: 'S < K < M', isCorrect: false },
        { id: 'E', text: 'S < M < K', isCorrect: true },
      ],
      correctOptionId: 'E',
      explanation: {
        whyCorrect: 'Kesişim: x^2 = 3x \\Rightarrow x=0, 3. S = \\int_0^1 x^2 dx = 1/3 \\approx 0.33, M = \\int_0^1 (3x - x^2) dx = 7/6 \\approx 1.17, K = \\int_1^3 (3x - x^2) dx = 10/3 \\approx 3.33. S < M < K.',
        whyOthersIncorrect: { A: 'Alan sıralaması terstir.', B: 'S en küçük alandır.', C: '7/6 > 1/3 olduğu için M > S olmalıdır.', D: '10/3 > 7/6 olduğundan K > M olmalıdır.' },
        topicSummary: 'İki Eğri Arasında Kalan Alan Hesabı: Belirli integral ile alan karşılaştırması.',
        keyTakeaway: 'S = 1/3, M = 7/6, K = 10/3 \\Rightarrow S < M < K.'
      },
      createdAt: 1710000000151
    },
    {
      id: 'q_math_52',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Dik koordinat düzleminde \\(y = x^3\\) ve \\(y = 4x\\) fonksiyonlarının grafikleri aşağıda verilmiştir. Şekildeki kırmızı, mavi ve sarı boyalı bölgelerin alanları sırasıyla K, M ve S olduğuna göre aşağıdaki sıralamalardan hangisi doğrudur?',
      svgDiagram: `<svg viewBox="0 0 380 220" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" style="background:rgba(15, 23, 42, 0.6); border-radius:12px; padding:10px;">
        <defs>
          <linearGradient id="gradK2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.5"/><stop offset="100%" stop-color="#ef4444" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradM2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradS2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eab308" stop-opacity="0.5"/><stop offset="100%" stop-color="#eab308" stop-opacity="0.15"/></linearGradient>
        </defs>
        <line x1="50" y1="180" x2="340" y2="180" stroke="#64748b" stroke-width="2"/>
        <line x1="60" y1="190" x2="60" y2="20" stroke="#64748b" stroke-width="2"/>
        <text x="345" y="184" fill="#94a3b8" font-size="12">x</text>
        <text x="55" y="15" fill="#94a3b8" font-size="12">y</text>
        <path d="M 60 180 Q 110 178 140 160 L 140 180 Z" fill="url(#gradS2)"/>
        <path d="M 60 180 L 140 70 L 140 160 Q 110 178 60 180 Z" fill="url(#gradM2)"/>
        <path d="M 140 70 L 280 20 Q 200 40 140 160 L 140 70 Z" fill="url(#gradK2)"/>
        <path d="M 60 180 Q 160 170 280 20" stroke="#a855f7" stroke-width="2.5" fill="none"/>
        <line x1="60" y1="180" x2="280" y2="20" stroke="#38bdf8" stroke-width="2.5"/>
        <line x1="140" y1="20" x2="140" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <line x1="280" y1="20" x2="280" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <text x="140" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=1</text>
        <text x="280" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=2</text>
        <text x="100" y="174" fill="#facc15" font-size="13" font-weight="bold">S</text>
        <text x="115" y="120" fill="#60a5fa" font-size="13" font-weight="bold">M</text>
        <text x="200" y="80" fill="#f87171" font-size="14" font-weight="bold">K</text>
        <text x="250" y="35" fill="#38bdf8" font-size="11">y=4x</text>
        <text x="230" y="140" fill="#a855f7" font-size="11">y=x³</text>
      </svg>`,
      options: [
        { id: 'A', text: 'K < S < M', isCorrect: false },
        { id: 'B', text: 'S < M < K', isCorrect: true },
        { id: 'C', text: 'M < S < K', isCorrect: false },
        { id: 'D', text: 'S < K < M', isCorrect: false },
        { id: 'E', text: 'M < K < S', isCorrect: false },
      ],
      correctOptionId: 'B',
      explanation: {
        whyCorrect: 'Kesişim: x^3 = 4x \\Rightarrow x=0, 2. S = \\int_0^1 x^3 dx = 1/4 = 0.25, M = \\int_0^1 (4x - x^3) dx = 7/4 = 1.75, K = \\int_1^2 (4x - x^3) dx = 9/4 = 2.25. Buradan S < M < K bulunur.',
        whyOthersIncorrect: { A: 'Yanlış sıralama.', C: 'M > S olmalıdır.', D: 'K > M olmalıdır (2.25 > 1.75).', E: 'M < K < S sıralaması yanlıştır.' },
        topicSummary: 'Kübik fonksiyon ve doğru arasındaki alan hesabı.',
        keyTakeaway: 'S = 0.25, M = 1.75, K = 2.25 \\Rightarrow S < M < K.'
      },
      createdAt: 1710000000152
    },
    {
      id: 'q_math_53',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Dik koordinat düzleminde \\(y = x^2\\) ve \\(y = x+1\\) fonksiyonlarının grafikleri aşağıda verilmiştir. Şekildeki kırmızı, mavi ve sarı boyalı bölgelerin alanları sırasıyla K, M ve S olduğuna göre aşağıdaki sıralamalardan hangisi doğrudur?',
      svgDiagram: `<svg viewBox="0 0 380 220" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" style="background:rgba(15, 23, 42, 0.6); border-radius:12px; padding:10px;">
        <defs>
          <linearGradient id="gradK3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.5"/><stop offset="100%" stop-color="#ef4444" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradM3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradS3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eab308" stop-opacity="0.5"/><stop offset="100%" stop-color="#eab308" stop-opacity="0.15"/></linearGradient>
        </defs>
        <line x1="50" y1="180" x2="340" y2="180" stroke="#64748b" stroke-width="2"/>
        <line x1="60" y1="190" x2="60" y2="20" stroke="#64748b" stroke-width="2"/>
        <text x="345" y="184" fill="#94a3b8" font-size="12">x</text>
        <text x="55" y="15" fill="#94a3b8" font-size="12">y</text>
        <path d="M 60 180 Q 110 176 150 140 L 150 180 Z" fill="url(#gradS3)"/>
        <path d="M 60 140 L 150 90 L 150 140 Q 110 176 60 180 Z" fill="url(#gradM3)"/>
        <path d="M 150 90 L 240 50 Q 195 95 150 140 L 150 90 Z" fill="url(#gradK3)"/>
        <path d="M 60 180 Q 150 140 240 50" stroke="#a855f7" stroke-width="2.5" fill="none"/>
        <line x1="60" y1="140" x2="240" y2="50" stroke="#38bdf8" stroke-width="2.5"/>
        <line x1="150" y1="20" x2="150" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <line x1="240" y1="20" x2="240" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <text x="150" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=1</text>
        <text x="240" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=a</text>
        <text x="100" y="172" fill="#facc15" font-size="13" font-weight="bold">S</text>
        <text x="115" y="130" fill="#60a5fa" font-size="13" font-weight="bold">M</text>
        <text x="185" y="95" fill="#f87171" font-size="14" font-weight="bold">K</text>
        <text x="220" y="40" fill="#38bdf8" font-size="11">y=x+1</text>
        <text x="210" y="110" fill="#a855f7" font-size="11">y=x²</text>
      </svg>`,
      options: [
        { id: 'A', text: 'K < S < M', isCorrect: false },
        { id: 'B', text: 'M < K < S', isCorrect: false },
        { id: 'C', text: 'S < M < K', isCorrect: false },
        { id: 'D', text: 'S < K < M', isCorrect: true },
        { id: 'E', text: 'M < S < K', isCorrect: false },
      ],
      correctOptionId: 'D',
      explanation: {
        whyCorrect: 'Kesişim a = (1+\\sqrt{5})/2 \\approx 1.618. S = \\int_0^1 x^2 dx = 1/3 \\approx 0.333, K = \\int_1^a (x+1-x^2) dx \\approx 0.348, M = \\int_0^1 (x+1-x^2) dx = 7/6 \\approx 1.167. S < K < M.',
        whyOthersIncorrect: { A: 'K > S olduğu için yanlıştır (0.348 > 0.333).', B: 'M en büyük alandır.', C: 'K < M olduğu için yanlıştır.', E: 'M > S olmalıdır.' },
        topicSummary: 'Parabol ile doğru kesişim alanı.',
        keyTakeaway: 'S = 0.333 < K = 0.348 < M = 1.167.'
      },
      createdAt: 1710000000153
    },
    {
      id: 'q_math_54',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Dik koordinat düzleminde \\(y = x\\sqrt{x}\\) ve \\(y = 2\\sqrt{x}\\) fonksiyonlarının grafikleri aşağıda verilmiştir. Şekildeki kırmızı, mavi ve sarı boyalı bölgelerin alanları sırasıyla K, M ve S olduğuna göre aşağıdaki sıralamalardan hangisi doğrudur?',
      svgDiagram: `<svg viewBox="0 0 380 220" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" style="background:rgba(15, 23, 42, 0.6); border-radius:12px; padding:10px;">
        <defs>
          <linearGradient id="gradK4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.5"/><stop offset="100%" stop-color="#ef4444" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradM4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradS4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eab308" stop-opacity="0.5"/><stop offset="100%" stop-color="#eab308" stop-opacity="0.15"/></linearGradient>
        </defs>
        <line x1="50" y1="180" x2="340" y2="180" stroke="#64748b" stroke-width="2"/>
        <line x1="60" y1="190" x2="60" y2="20" stroke="#64748b" stroke-width="2"/>
        <text x="345" y="184" fill="#94a3b8" font-size="12">x</text>
        <text x="55" y="15" fill="#94a3b8" font-size="12">y</text>
        <path d="M 60 180 Q 110 178 150 155 L 150 180 Z" fill="url(#gradS4)"/>
        <path d="M 60 180 Q 100 130 150 90 L 150 155 Q 110 178 60 180 Z" fill="url(#gradM4)"/>
        <path d="M 150 90 Q 210 50 270 30 Q 210 80 150 155 L 150 90 Z" fill="url(#gradK4)"/>
        <path d="M 60 180 Q 160 160 270 30" stroke="#a855f7" stroke-width="2.5" fill="none"/>
        <path d="M 60 180 Q 120 80 270 30" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
        <line x1="150" y1="20" x2="150" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <line x1="270" y1="20" x2="270" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <text x="150" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=1</text>
        <text x="270" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=2</text>
        <text x="100" y="174" fill="#facc15" font-size="13" font-weight="bold">S</text>
        <text x="115" y="125" fill="#60a5fa" font-size="13" font-weight="bold">M</text>
        <text x="195" y="90" fill="#f87171" font-size="14" font-weight="bold">K</text>
        <text x="240" y="25" fill="#38bdf8" font-size="11">y=2√x</text>
        <text x="230" y="110" fill="#a855f7" font-size="11">y=x√x</text>
      </svg>`,
      options: [
        { id: 'A', text: 'S < M < K', isCorrect: false },
        { id: 'B', text: 'S < K < M', isCorrect: true },
        { id: 'C', text: 'K < S < M', isCorrect: false },
        { id: 'D', text: 'M < K < S', isCorrect: false },
        { id: 'E', text: 'M < S < K', isCorrect: false },
      ],
      correctOptionId: 'B',
      explanation: {
        whyCorrect: 'Kesişim: x\\sqrt{x} = 2\\sqrt{x} \\Rightarrow x=0, 2. S = \\int_0^1 x^{3/2} dx = 2/5 = 0.4, M = \\int_0^1 (2\\sqrt{x} - x\\sqrt{x}) dx = 14/15 \\approx 0.933, K = \\int_1^2 (2\\sqrt{x} - x\\sqrt{x}) dx \\approx 0.575. S < K < M.',
        whyOthersIncorrect: { A: 'M > K olduğu için yanlıştır (0.933 > 0.575).', C: 'S < K olmalıdır.', D: 'M en büyük alandır.', E: 'M > S olmalıdır.' },
        topicSummary: 'Köklü fonksiyonların belirli integrali.',
        keyTakeaway: 'S = 0.400 < K = 0.575 < M = 0.933.'
      },
      createdAt: 1710000000154
    },
    {
      id: 'q_math_55',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Dik koordinat düzleminde \\(y = \\sqrt{x}\\) ve \\(y = \\frac{x}{2}\\) fonksiyonlarının grafikleri aşağıda verilmiştir. Şekildeki kırmızı, mavi ve sarı boyalı bölgelerin alanları sırasıyla K, M ve S olduğuna göre aşağıdaki sıralamalardan hangisi doğrudur?',
      svgDiagram: `<svg viewBox="0 0 380 220" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" style="background:rgba(15, 23, 42, 0.6); border-radius:12px; padding:10px;">
        <defs>
          <linearGradient id="gradK5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.5"/><stop offset="100%" stop-color="#ef4444" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradM5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradS5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eab308" stop-opacity="0.5"/><stop offset="100%" stop-color="#eab308" stop-opacity="0.15"/></linearGradient>
        </defs>
        <line x1="50" y1="180" x2="340" y2="180" stroke="#64748b" stroke-width="2"/>
        <line x1="60" y1="190" x2="60" y2="20" stroke="#64748b" stroke-width="2"/>
        <text x="345" y="184" fill="#94a3b8" font-size="12">x</text>
        <text x="55" y="15" fill="#94a3b8" font-size="12">y</text>
        <path d="M 60 180 L 110 160 L 110 180 Z" fill="url(#gradS5)"/>
        <path d="M 60 180 Q 90 130 110 120 L 110 160 Z" fill="url(#gradM5)"/>
        <path d="M 110 120 Q 200 40 300 20 L 110 160 Z" fill="url(#gradK5)"/>
        <path d="M 60 180 Q 150 60 300 20" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
        <line x1="60" y1="180" x2="300" y2="20" stroke="#a855f7" stroke-width="2.5"/>
        <line x1="110" y1="20" x2="110" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <line x1="300" y1="20" x2="300" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <text x="110" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=1</text>
        <text x="300" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=4</text>
        <text x="85" y="174" fill="#facc15" font-size="13" font-weight="bold">S</text>
        <text x="95" y="140" fill="#60a5fa" font-size="13" font-weight="bold">M</text>
        <text x="200" y="80" fill="#f87171" font-size="14" font-weight="bold">K</text>
        <text x="240" y="30" fill="#38bdf8" font-size="11">y=√x</text>
        <text x="250" y="100" fill="#a855f7" font-size="11">y=x/2</text>
      </svg>`,
      options: [
        { id: 'A', text: 'K < S < M', isCorrect: false },
        { id: 'B', text: 'S < K < M', isCorrect: false },
        { id: 'C', text: 'M < S < K', isCorrect: false },
        { id: 'D', text: 'S < M < K', isCorrect: true },
        { id: 'E', text: 'M < K < S', isCorrect: false },
      ],
      correctOptionId: 'D',
      explanation: {
        whyCorrect: 'Kesişim: \\sqrt{x} = x/2 \\Rightarrow x=0, 4. S = \\int_0^1 (x/2) dx = 1/4 = 0.25, M = \\int_0^1 (\\sqrt{x} - x/2) dx = 5/12 \\approx 0.417, K = \\int_1^4 (\\sqrt{x} - x/2) dx = 11/12 \\approx 0.917. S < M < K.',
        whyOthersIncorrect: { A: 'K en büyük alandır.', B: 'K > M olmalıdır (0.917 > 0.417).', C: 'S < M olmalıdır (0.25 < 0.417).', E: 'S en küçük alandır.' },
        topicSummary: 'Doğru ve karekök fonksiyonu kesişim alanı.',
        keyTakeaway: 'S = 0.25 < M = 0.417 < K = 0.917.'
      },
      createdAt: 1710000000155
    },
    {
      id: 'q_math_56',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Dik koordinat düzleminde \\(y = x^2\\) ve \\(y = 4x\\) fonksiyonlarının grafikleri aşağıda verilmiştir. Şekildeki kırmızı, mavi ve sarı boyalı bölgelerin alanları sırasıyla K, M ve S olduğuna göre aşağıdaki sıralamalardan hangisi doğrudur?',
      svgDiagram: `<svg viewBox="0 0 380 220" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" style="background:rgba(15, 23, 42, 0.6); border-radius:12px; padding:10px;">
        <defs>
          <linearGradient id="gradK6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.5"/><stop offset="100%" stop-color="#ef4444" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradM6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradS6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eab308" stop-opacity="0.5"/><stop offset="100%" stop-color="#eab308" stop-opacity="0.15"/></linearGradient>
        </defs>
        <line x1="50" y1="180" x2="340" y2="180" stroke="#64748b" stroke-width="2"/>
        <line x1="60" y1="190" x2="60" y2="20" stroke="#64748b" stroke-width="2"/>
        <text x="345" y="184" fill="#94a3b8" font-size="12">x</text>
        <text x="55" y="15" fill="#94a3b8" font-size="12">y</text>
        <path d="M 60 180 Q 90 178 110 160 L 110 180 Z" fill="url(#gradS6)"/>
        <path d="M 60 180 L 110 120 L 110 160 Q 90 178 60 180 Z" fill="url(#gradM6)"/>
        <path d="M 110 120 L 300 20 Q 200 40 110 160 L 110 120 Z" fill="url(#gradK6)"/>
        <path d="M 60 180 Q 180 160 300 20" stroke="#a855f7" stroke-width="2.5" fill="none"/>
        <line x1="60" y1="180" x2="300" y2="20" stroke="#38bdf8" stroke-width="2.5"/>
        <line x1="110" y1="20" x2="110" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <line x1="300" y1="20" x2="300" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <text x="110" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=1</text>
        <text x="300" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=4</text>
        <text x="85" y="174" fill="#facc15" font-size="13" font-weight="bold">S</text>
        <text x="95" y="140" fill="#60a5fa" font-size="13" font-weight="bold">M</text>
        <text x="200" y="80" fill="#f87171" font-size="14" font-weight="bold">K</text>
        <text x="270" y="40" fill="#38bdf8" font-size="11">y=4x</text>
        <text x="250" y="140" fill="#a855f7" font-size="11">y=x²</text>
      </svg>`,
      options: [
        { id: 'A', text: 'S < M < K', isCorrect: true },
        { id: 'B', text: 'K < S < M', isCorrect: false },
        { id: 'C', text: 'M < S < K', isCorrect: false },
        { id: 'D', text: 'S < K < M', isCorrect: false },
        { id: 'E', text: 'M < K < S', isCorrect: false },
      ],
      correctOptionId: 'A',
      explanation: {
        whyCorrect: 'Kesişim: x^2 = 4x \\Rightarrow x=0, 4. S = \\int_0^1 x^2 dx = 1/3 \\approx 0.33, M = \\int_0^1 (4x - x^2) dx = 5/3 \\approx 1.67, K = \\int_1^4 (4x - x^2) dx = 9. Buradan S < M < K bulunur.',
        whyOthersIncorrect: { B: 'K en büyük alandır.', C: '5/3 > 1/3 olduğu için M > S olmalıdır.', D: 'K > M olmalıdır (9 > 1.67).', E: 'S en küçük alandır.' },
        topicSummary: 'Parabol ve doğru ile oluşturulan bölgelerin alan hesabı.',
        keyTakeaway: 'S = 0.333 < M = 1.667 < K = 9.'
      },
      createdAt: 1710000000156
    },
    {
      id: 'q_math_57',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Dik koordinat düzleminde \\(y = x\\sqrt{x}\\) ve \\(y = 3\\sqrt{x}\\) fonksiyonlarının grafikleri aşağıda verilmiştir. Şekildeki kırmızı, mavi ve sarı boyalı bölgelerin alanları sırasıyla K, M ve S olduğuna göre aşağıdaki sıralamalardan hangisi doğrudur?',
      svgDiagram: `<svg viewBox="0 0 380 220" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" style="background:rgba(15, 23, 42, 0.6); border-radius:12px; padding:10px;">
        <defs>
          <linearGradient id="gradK7" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.5"/><stop offset="100%" stop-color="#ef4444" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradM7" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradS7" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eab308" stop-opacity="0.5"/><stop offset="100%" stop-color="#eab308" stop-opacity="0.15"/></linearGradient>
        </defs>
        <line x1="50" y1="180" x2="340" y2="180" stroke="#64748b" stroke-width="2"/>
        <line x1="60" y1="190" x2="60" y2="20" stroke="#64748b" stroke-width="2"/>
        <text x="345" y="184" fill="#94a3b8" font-size="12">x</text>
        <text x="55" y="15" fill="#94a3b8" font-size="12">y</text>
        <path d="M 60 180 Q 100 178 130 160 L 130 180 Z" fill="url(#gradS7)"/>
        <path d="M 60 180 Q 90 120 130 100 L 130 160 Z" fill="url(#gradM7)"/>
        <path d="M 130 100 Q 210 40 300 20 Q 210 80 130 160 L 130 100 Z" fill="url(#gradK7)"/>
        <path d="M 60 180 Q 160 160 300 20" stroke="#a855f7" stroke-width="2.5" fill="none"/>
        <path d="M 60 180 Q 120 60 300 20" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
        <line x1="130" y1="20" x2="130" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <line x1="300" y1="20" x2="300" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <text x="130" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=1</text>
        <text x="300" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=3</text>
        <text x="95" y="174" fill="#facc15" font-size="13" font-weight="bold">S</text>
        <text x="105" y="130" fill="#60a5fa" font-size="13" font-weight="bold">M</text>
        <text x="200" y="80" fill="#f87171" font-size="14" font-weight="bold">K</text>
        <text x="250" y="25" fill="#38bdf8" font-size="11">y=3√x</text>
        <text x="240" y="110" fill="#a855f7" font-size="11">y=x√x</text>
      </svg>`,
      options: [
        { id: 'A', text: 'S < M < K', isCorrect: true },
        { id: 'B', text: 'K < S < M', isCorrect: false },
        { id: 'C', text: 'M < S < K', isCorrect: false },
        { id: 'D', text: 'S < K < M', isCorrect: false },
        { id: 'E', text: 'M < K < S', isCorrect: false },
      ],
      correctOptionId: 'A',
      explanation: {
        whyCorrect: 'Kesişim: x\\sqrt{x} = 3\\sqrt{x} \\Rightarrow x=0, 3. S = \\int_0^1 x^{3/2} dx = 0.4, M = \\int_0^1 (3\\sqrt{x} - x\\sqrt{x}) dx = 1.6, K = \\int_1^3 (3\\sqrt{x} - x\\sqrt{x}) dx \\approx 2.557. S < M < K.',
        whyOthersIncorrect: { B: 'S en küçük alandır.', C: '1.6 > 0.4 olduğu için M > S olmalıdır.', D: 'K > M olmalıdır (2.557 > 1.6).', E: 'Sıralama terstir.' },
        topicSummary: 'Köklü ifade belirli integrali ve alan sıralaması.',
        keyTakeaway: 'S = 0.4 < M = 1.6 < K = 2.557.'
      },
      createdAt: 1710000000157
    },
    {
      id: 'q_math_58',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Dik koordinat düzleminde \\(y = x^3\\) ve \\(y = 2x^2\\) fonksiyonlarının grafikleri aşağıda verilmiştir. Şekildeki kırmızı, mavi ve sarı boyalı bölgelerin alanları sırasıyla K, M ve S olduğuna göre aşağıdaki sıralamalardan hangisi doğrudur?',
      svgDiagram: `<svg viewBox="0 0 380 220" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" style="background:rgba(15, 23, 42, 0.6); border-radius:12px; padding:10px;">
        <defs>
          <linearGradient id="gradK8" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.5"/><stop offset="100%" stop-color="#ef4444" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradM8" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradS8" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eab308" stop-opacity="0.5"/><stop offset="100%" stop-color="#eab308" stop-opacity="0.15"/></linearGradient>
        </defs>
        <line x1="50" y1="180" x2="340" y2="180" stroke="#64748b" stroke-width="2"/>
        <line x1="60" y1="190" x2="60" y2="20" stroke="#64748b" stroke-width="2"/>
        <text x="345" y="184" fill="#94a3b8" font-size="12">x</text>
        <text x="55" y="15" fill="#94a3b8" font-size="12">y</text>
        <path d="M 60 180 Q 110 178 140 160 L 140 180 Z" fill="url(#gradS8)"/>
        <path d="M 60 180 Q 110 150 140 120 L 140 160 Z" fill="url(#gradM8)"/>
        <path d="M 140 120 Q 210 50 280 20 Q 200 60 140 160 L 140 120 Z" fill="url(#gradK8)"/>
        <path d="M 60 180 Q 160 170 280 20" stroke="#a855f7" stroke-width="2.5" fill="none"/>
        <path d="M 60 180 Q 140 110 280 20" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
        <line x1="140" y1="20" x2="140" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <line x1="280" y1="20" x2="280" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <text x="140" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=1</text>
        <text x="280" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=2</text>
        <text x="100" y="174" fill="#facc15" font-size="13" font-weight="bold">S</text>
        <text x="115" y="140" fill="#60a5fa" font-size="13" font-weight="bold">M</text>
        <text x="195" y="80" fill="#f87171" font-size="14" font-weight="bold">K</text>
        <text x="240" y="30" fill="#38bdf8" font-size="11">y=2x²</text>
        <text x="230" y="120" fill="#a855f7" font-size="11">y=x³</text>
      </svg>`,
      options: [
        { id: 'A', text: 'M < S < K', isCorrect: false },
        { id: 'B', text: 'S < K < M', isCorrect: false },
        { id: 'C', text: 'S < M < K', isCorrect: true },
        { id: 'D', text: 'K < S < M', isCorrect: false },
        { id: 'E', text: 'M < K < S', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: 'Kesişim: x^3 = 2x^2 \\Rightarrow x=0, 2. S = \\int_0^1 x^3 dx = 1/4 = 0.25, M = \\int_0^1 (2x^2 - x^3) dx = 5/12 \\approx 0.417, K = \\int_1^2 (2x^2 - x^3) dx = 11/12 \\approx 0.917. S < M < K.',
        whyOthersIncorrect: { A: 'S < M olmalıdır.', B: 'M < K olmalıdır.', D: 'K en büyük alandır.', E: 'Sıralama terstir.' },
        topicSummary: 'Kübik fonksiyon ile parabol kesişim alanı.',
        keyTakeaway: 'S = 0.25 < M = 0.417 < K = 0.917.'
      },
      createdAt: 1710000000158
    },
    {
      id: 'q_math_59',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Dik koordinat düzleminde \\(y = x^4\\) ve \\(y = 2x\\) fonksiyonlarının grafikleri aşağıda verilmiştir. Şekildeki kırmızı, mavi ve sarı boyalı bölgelerin alanları sırasıyla K, M ve S olduğuna göre aşağıdaki sıralamalardan hangisi doğrudur?',
      svgDiagram: `<svg viewBox="0 0 380 220" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" style="background:rgba(15, 23, 42, 0.6); border-radius:12px; padding:10px;">
        <defs>
          <linearGradient id="gradK9" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.5"/><stop offset="100%" stop-color="#ef4444" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradM9" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradS9" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eab308" stop-opacity="0.5"/><stop offset="100%" stop-color="#eab308" stop-opacity="0.15"/></linearGradient>
        </defs>
        <line x1="50" y1="180" x2="340" y2="180" stroke="#64748b" stroke-width="2"/>
        <line x1="60" y1="190" x2="60" y2="20" stroke="#64748b" stroke-width="2"/>
        <text x="345" y="184" fill="#94a3b8" font-size="12">x</text>
        <text x="55" y="15" fill="#94a3b8" font-size="12">y</text>
        <path d="M 60 180 Q 140 179 170 165 L 170 180 Z" fill="url(#gradS9)"/>
        <path d="M 60 180 L 170 80 L 170 165 Q 140 179 60 180 Z" fill="url(#gradM9)"/>
        <path d="M 170 80 L 220 30 Q 195 50 170 165 L 170 80 Z" fill="url(#gradK9)"/>
        <path d="M 60 180 Q 180 175 220 30" stroke="#a855f7" stroke-width="2.5" fill="none"/>
        <line x1="60" y1="180" x2="220" y2="30" stroke="#38bdf8" stroke-width="2.5"/>
        <line x1="170" y1="20" x2="170" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <line x1="220" y1="20" x2="220" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <text x="170" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=1</text>
        <text x="220" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=a</text>
        <text x="120" y="174" fill="#facc15" font-size="13" font-weight="bold">S</text>
        <text x="135" y="130" fill="#60a5fa" font-size="13" font-weight="bold">M</text>
        <text x="185" y="90" fill="#f87171" font-size="14" font-weight="bold">K</text>
        <text x="210" y="20" fill="#38bdf8" font-size="11">y=2x</text>
        <text x="200" y="110" fill="#a855f7" font-size="11">y=x⁴</text>
      </svg>`,
      options: [
        { id: 'A', text: 'K < S < M', isCorrect: true },
        { id: 'B', text: 'S < M < K', isCorrect: false },
        { id: 'C', text: 'M < K < S', isCorrect: false },
        { id: 'D', text: 'S < K < M', isCorrect: false },
        { id: 'E', text: 'M < S < K', isCorrect: false },
      ],
      correctOptionId: 'A',
      explanation: {
        whyCorrect: 'Kesişim a = \\sqrt[3]{2} \\approx 1.26. S = \\int_0^1 x^4 dx = 1/5 = 0.2, M = \\int_0^1 (2x - x^4) dx = 4/5 = 0.8, K = \\int_1^a (2x - x^4) dx \\approx 0.152. K < S < M.',
        whyOthersIncorrect: { B: 'K en küçük alandır (0.152 < 0.2).', C: 'M en büyük alandır (0.8).', D: 'K < S olmalıdır.', E: 'Sıralama yanlıştır.' },
        topicSummary: 'Dar aralıkta kalan kesişim alanı hesabı.',
        keyTakeaway: 'K = 0.152 < S = 0.200 < M = 0.800.'
      },
      createdAt: 1710000000159
    },
    {
      id: 'q_math_60',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Dik koordinat düzleminde \\(y = x^2\\) ve \\(y = x+2\\) fonksiyonlarının grafikleri aşağıda verilmiştir. Şekildeki kırmızı, mavi ve sarı boyalı bölgelerin alanları sırasıyla K, M ve S olduğuna göre aşağıdaki sıralamalardan hangisi doğrudur?',
      svgDiagram: `<svg viewBox="0 0 380 220" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" style="background:rgba(15, 23, 42, 0.6); border-radius:12px; padding:10px;">
        <defs>
          <linearGradient id="gradK10" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.5"/><stop offset="100%" stop-color="#ef4444" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradM10" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0.15"/></linearGradient>
          <linearGradient id="gradS10" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eab308" stop-opacity="0.5"/><stop offset="100%" stop-color="#eab308" stop-opacity="0.15"/></linearGradient>
        </defs>
        <line x1="50" y1="180" x2="340" y2="180" stroke="#64748b" stroke-width="2"/>
        <line x1="60" y1="190" x2="60" y2="20" stroke="#64748b" stroke-width="2"/>
        <text x="345" y="184" fill="#94a3b8" font-size="12">x</text>
        <text x="55" y="15" fill="#94a3b8" font-size="12">y</text>
        <path d="M 60 180 Q 110 176 150 140 L 150 180 Z" fill="url(#gradS10)"/>
        <path d="M 60 120 L 150 75 L 150 140 Q 110 176 60 180 Z" fill="url(#gradM10)"/>
        <path d="M 150 75 L 240 30 Q 195 75 150 140 L 150 75 Z" fill="url(#gradK10)"/>
        <path d="M 60 180 Q 150 140 240 30" stroke="#a855f7" stroke-width="2.5" fill="none"/>
        <line x1="60" y1="120" x2="240" y2="30" stroke="#38bdf8" stroke-width="2.5"/>
        <line x1="150" y1="20" x2="150" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <line x1="240" y1="20" x2="240" y2="180" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
        <text x="150" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=1</text>
        <text x="240" y="196" fill="#cbd5e1" font-size="12" text-anchor="middle">x=2</text>
        <text x="100" y="172" fill="#facc15" font-size="13" font-weight="bold">S</text>
        <text x="115" y="125" fill="#60a5fa" font-size="13" font-weight="bold">M</text>
        <text x="185" y="80" fill="#f87171" font-size="14" font-weight="bold">K</text>
        <text x="220" y="25" fill="#38bdf8" font-size="11">y=x+2</text>
        <text x="210" y="100" fill="#a855f7" font-size="11">y=x²</text>
      </svg>`,
      options: [
        { id: 'A', text: 'S < M < K', isCorrect: false },
        { id: 'B', text: 'K < S < M', isCorrect: false },
        { id: 'C', text: 'S < K < M', isCorrect: true },
        { id: 'D', text: 'M < K < S', isCorrect: false },
        { id: 'E', text: 'M < S < K', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: 'Kesişim: x^2 = x+2 \\Rightarrow x=2. S = \\int_0^1 x^2 dx = 1/3 \\approx 0.333, K = \\int_1^2 (x+2 - x^2) dx = 7/6 \\approx 1.167, M = \\int_0^1 (x+2 - x^2) dx = 13/6 \\approx 2.167. S < K < M.',
        whyOthersIncorrect: { A: 'M > K olduğu için yanlıştır (2.167 > 1.167).', B: 'S < K olmalıdır.', D: 'M en büyük alandır.', E: 'Sıralama terstir.' },
        topicSummary: 'Parabol ile doğru parçaları arasındaki alan hesabı.',
        keyTakeaway: 'S = 0.333 < K = 1.167 < M = 2.167.'
      },
      createdAt: 1710000000160
    },
    {
      id: 'q_math_21',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = 2x + 30\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(25)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '200', isCorrect: false },
        { id: 'B', text: '190', isCorrect: true },
        { id: 'C', text: '180', isCorrect: false },
        { id: 'D', text: '210', isCorrect: false },
        { id: 'E', text: '170', isCorrect: false },
      ],
      correctOptionId: 'B',
      explanation: {
        whyCorrect: 'f(25) = 2(25) + 30 = 50 + 30 = 80. f(80) = 2(80) + 30 = 160 + 30 = 190.',
        whyOthersIncorrect: {
          A: '160 + 40 hatası.',
          C: '160 + 20 hatası.',
          D: 'Toplama hatası.',
          E: 'İşlem hatası.'
        },
        topicSummary: 'Lineer fonksiyon adımları.',
        keyTakeaway: 'f(25) = 80 ve f(80) = 190.'
      },
      createdAt: 1710000000121
    },
    {
      id: 'q_math_22',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = 5x - 60\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(15)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '20', isCorrect: false },
        { id: 'B', text: '10', isCorrect: false },
        { id: 'C', text: '25', isCorrect: false },
        { id: 'D', text: '15', isCorrect: true },
        { id: 'E', text: '5', isCorrect: false },
      ],
      correctOptionId: 'D',
      explanation: {
        whyCorrect: 'f(15) = 5(15) - 60 = 75 - 60 = 15. f(15) = 15.',
        whyOthersIncorrect: {
          A: 'Çıkarma hatası.',
          B: 'İşlem hatası.',
          C: '75 - 50 hatası.',
          E: 'İşlem hatası.'
        },
        topicSummary: 'Sabit nokta durumu.',
        keyTakeaway: 'f(15) = 15 olduğu için sonuç 15 kalır.'
      },
      createdAt: 1710000000122
    },
    {
      id: 'q_math_23',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = -3x + 80\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(20)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '15', isCorrect: false },
        { id: 'B', text: '30', isCorrect: false },
        { id: 'C', text: '20', isCorrect: true },
        { id: 'D', text: '25', isCorrect: false },
        { id: 'E', text: '10', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: 'f(20) = -3(20) + 80 = -60 + 80 = 20. f(20) = 20.',
        whyOthersIncorrect: {
          A: 'Çıkarma hatası.',
          B: 'İşlem hatası.',
          D: 'Toplama hatası.',
          E: 'Yanlış hesaplama.'
        },
        topicSummary: 'Negatif eğimli fonksiyonda f(20) = 20 sabit noktası.',
        keyTakeaway: 'f(20) = 20.'
      },
      createdAt: 1710000000123
    },
    {
      id: 'q_math_24',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = 4x - 10\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(5)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '35', isCorrect: false },
        { id: 'B', text: '20', isCorrect: false },
        { id: 'C', text: '40', isCorrect: false },
        { id: 'D', text: '30', isCorrect: true },
        { id: 'E', text: '25', isCorrect: false },
      ],
      correctOptionId: 'D',
      explanation: {
        whyCorrect: 'f(5) = 4(5) - 10 = 20 - 10 = 10. f(10) = 4(10) - 10 = 40 - 10 = 30.',
        whyOthersIncorrect: {
          A: '40 - 5 hatası.',
          B: 'İlk adımdaki f(5) = 10 ile karıştırılmıştır.',
          C: 'Son adımdaki -10 yapılmazsa 40 olur.',
          E: 'İşlem hatası.'
        },
        topicSummary: 'Doğrusal fonksiyon bileşkesi.',
        keyTakeaway: 'f(5) = 10 ve f(10) = 30.'
      },
      createdAt: 1710000000124
    },
    {
      id: 'q_math_25',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = 2x + 70\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(15)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '280', isCorrect: false },
        { id: 'B', text: '250', isCorrect: false },
        { id: 'C', text: '290', isCorrect: false },
        { id: 'D', text: '270', isCorrect: true },
        { id: 'E', text: '260', isCorrect: false },
      ],
      correctOptionId: 'D',
      explanation: {
        whyCorrect: 'f(15) = 2(15) + 70 = 30 + 70 = 100. f(100) = 2(100) + 70 = 200 + 70 = 270.',
        whyOthersIncorrect: {
          A: '200 + 80 hatası.',
          B: '200 + 50 hatası.',
          C: '200 + 90 hatası.',
          E: '200 + 60 hatası.'
        },
        topicSummary: 'Adımları doğru takip etme.',
        keyTakeaway: 'f(15) = 100 ve f(100) = 270.'
      },
      createdAt: 1710000000125
    },
    {
      id: 'q_math_26',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = 7x - 200\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(30)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '-140', isCorrect: false },
        { id: 'B', text: '-120', isCorrect: false },
        { id: 'C', text: '-130', isCorrect: true },
        { id: 'D', text: '-150', isCorrect: false },
        { id: 'E', text: '-110', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: 'f(30) = 7(30) - 200 = 210 - 200 = 10. f(10) = 7(10) - 200 = 70 - 200 = -130.',
        whyOthersIncorrect: {
          A: '70 - 210 hatası.',
          B: '70 - 190 hatası.',
          D: '70 - 220 hatası.',
          E: '70 - 180 hatası.'
        },
        topicSummary: 'Bileşke fonksiyonda negatif değer.',
        keyTakeaway: 'f(30) = 10 ve f(10) = -130.'
      },
      createdAt: 1710000000126
    },
    {
      id: 'q_math_27',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = 3x + 25\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(10)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '180', isCorrect: false },
        { id: 'B', text: '210', isCorrect: false },
        { id: 'C', text: '190', isCorrect: true },
        { id: 'D', text: '200', isCorrect: false },
        { id: 'E', text: '170', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: 'f(10) = 3(10) + 25 = 30 + 25 = 55. f(55) = 3(55) + 25 = 165 + 25 = 190.',
        whyOthersIncorrect: {
          A: '165 + 15 hatası.',
          B: '165 + 45 hatası.',
          D: '165 + 35 hatası.',
          E: '165 + 5 hatası.'
        },
        topicSummary: 'Fonksiyon bileşke hesabı.',
        keyTakeaway: 'f(10) = 55 ve f(55) = 190.'
      },
      createdAt: 1710000000127
    },
    {
      id: 'q_math_28',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = -x + 50\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(20)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '30', isCorrect: false },
        { id: 'B', text: '10', isCorrect: false },
        { id: 'C', text: '25', isCorrect: false },
        { id: 'D', text: '20', isCorrect: true },
        { id: 'E', text: '15', isCorrect: false },
      ],
      correctOptionId: 'D',
      explanation: {
        whyCorrect: 'f(20) = -20 + 50 = 30. f(30) = -30 + 50 = 20. f(x) = -x + 50 fonksiyonunda (f \\circ f)(x) = -(-x + 50) + 50 = x yani Birim Fonksiyondur!',
        whyOthersIncorrect: {
          A: 'İlk adım f(20) = 30 sonucudur.',
          B: 'Çıkarma hatası.',
          C: 'Yanlış değer.',
          E: 'İşlem hatası.'
        },
        topicSummary: 'Özdeşlik/Birim Fonksiyon Özelliği: Kendi tersine eşit olan fonksiyonların bileşkesi birim fonksiyon (I(x) = x) olur.',
        keyTakeaway: 'f(x) = -x + c fonksiyonunun bileşkesi kendisini (başlangıçtaki x değerini) verir: (f \\circ f)(20) = 20.'
      },
      createdAt: 1710000000128
    },
    {
      id: 'q_math_29',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = 5x + 35\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(5)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '325', isCorrect: false },
        { id: 'B', text: '345', isCorrect: false },
        { id: 'C', text: '335', isCorrect: true },
        { id: 'D', text: '355', isCorrect: false },
        { id: 'E', text: '315', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: 'f(5) = 5(5) + 35 = 25 + 35 = 60. f(60) = 5(60) + 35 = 300 + 35 = 335.',
        whyOthersIncorrect: {
          A: '300 + 25 hatası.',
          B: '300 + 45 hatası.',
          D: '300 + 55 hatası.',
          E: '300 + 15 hatası.'
        },
        topicSummary: 'Lineer bileşke fonksiyonu.',
        keyTakeaway: 'f(5) = 60 ve f(60) = 335.'
      },
      createdAt: 1710000000129
    },
    {
      id: 'q_math_30',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'Gerçel sayılar kümesi üzerinde tanımlı bir f fonksiyonu için \\(f(x) = 2x - 100\\) eşitliği sağlanıyor. Buna göre \\((f \\circ f)(60)\\) değeri kaçtır?',
      options: [
        { id: 'A', text: '-50', isCorrect: false },
        { id: 'B', text: '-70', isCorrect: false },
        { id: 'C', text: '-80', isCorrect: false },
        { id: 'D', text: '-60', isCorrect: true },
        { id: 'E', text: '-40', isCorrect: false },
      ],
      correctOptionId: 'D',
      explanation: {
        whyCorrect: 'f(60) = 2(60) - 100 = 120 - 100 = 20. f(20) = 2(20) - 100 = 40 - 100 = -60.',
        whyOthersIncorrect: {
          A: '40 - 90 hatası.',
          B: '40 - 110 hatası.',
          C: '40 - 120 hatası.',
          E: '40 - 80 hatası.'
        },
        topicSummary: 'Negatif sonuçlu bileşke hesabı.',
        keyTakeaway: 'f(60) = 20 ve f(20) = -60.'
      },
      createdAt: 1710000000130
    },
    {
      id: 'q_math_31',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^3 + \\frac{a}{x}\\right)^{10}\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^2 - \\frac{a}{x^2}\\right)^{10}\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '2', isCorrect: true },
        { id: 'B', text: '3', isCorrect: false },
        { id: 'C', text: '4', isCorrect: false },
        { id: 'D', text: '5', isCorrect: false },
        { id: 'E', text: '6', isCorrect: false },
      ],
      correctOptionId: 'A',
      explanation: {
        whyCorrect: 'Binom açılımı sabit terim hesabında x’li terimlerin üsleri 0’a eşitlenir. İki açılımdan elde edilen sabit terimler toplamı 0’a eşitlendiğinde a = 2 elde edilir.',
        whyOthersIncorrect: { A: 'Doğru şıktır.', B: 'Yanlış katsayı.', C: 'Üs hatası.', D: 'İşlem hatası.', E: 'İşaret hatası.' },
        topicSummary: 'Binom Açılımında Sabit Terim: Genel terim T_{r+1} = \\binom{n}{r} A^{n-r} B^r yazılıp x^0 kuralı uygulanır.',
        keyTakeaway: 'Sabit terimde değişkenin üssü 0 yapılıp denklem çözülür.'
      },
      createdAt: 1710000000131
    },
    {
      id: 'q_math_32',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^2 + \\frac{a}{x}\\right)^8\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^4 - \\frac{a}{x^2}\\right)^8\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '1', isCorrect: false },
        { id: 'B', text: '2', isCorrect: true },
        { id: 'C', text: '3', isCorrect: false },
        { id: 'D', text: '4', isCorrect: false },
        { id: 'E', text: '5', isCorrect: false },
      ],
      correctOptionId: 'B',
      explanation: {
        whyCorrect: 'Binom sabit terim eşitliğinden a = 2 sonucu bulunur.',
        whyOthersIncorrect: { A: 'İşlem hatası.', B: 'Doğru şıktır.', C: 'Katsayı hatası.', D: 'Kombinasyon hatası.', E: 'İşaret hatası.' },
        topicSummary: 'Binom Katsayıları ve Sabit Terim Hesabı.',
        keyTakeaway: 'İki binom açılımındaki sabit terimler toplamı 0 ise a = 2 elde edilir.'
      },
      createdAt: 1710000000132
    },
    {
      id: 'q_math_33',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^4 + \\frac{a}{x^2}\\right)^9\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^3 - \\frac{a}{x^3}\\right)^9\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '\\frac{1}{2}', isCorrect: true },
        { id: 'B', text: '\\frac{3}{2}', isCorrect: false },
        { id: 'C', text: '\\frac{5}{2}', isCorrect: false },
        { id: 'D', text: '\\frac{7}{2}', isCorrect: false },
        { id: 'E', text: '\\frac{9}{2}', isCorrect: false },
      ],
      correctOptionId: 'A',
      explanation: {
        whyCorrect: 'Sabit terimlerin toplamı 0 eşitlemesinden a = 1/2 bulunur.',
        whyOthersIncorrect: { A: 'Doğru şıktır.', B: 'İşlem hatası.', C: 'Payda hatası.', D: 'Katsayı hatası.', E: 'İşaret hatası.' },
        topicSummary: 'Kesirli katsayılı binom açılım sabit terimi.',
        keyTakeaway: 'a = 1/2.'
      },
      createdAt: 1710000000133
    },
    {
      id: 'q_math_34',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^5 + \\frac{a}{x}\\right)^7\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^2 - \\frac{a}{x^3}\\right)^7\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '\\frac{4}{3}', isCorrect: false },
        { id: 'B', text: '\\frac{5}{3}', isCorrect: true },
        { id: 'C', text: '\\frac{7}{3}', isCorrect: false },
        { id: 'D', text: '\\frac{8}{3}', isCorrect: false },
        { id: 'E', text: '\\frac{10}{3}', isCorrect: false },
      ],
      correctOptionId: 'B',
      explanation: {
        whyCorrect: 'Sabit terim denkleminden a = 5/3 olarak elde edilir.',
        whyOthersIncorrect: { A: 'Toplama hatası.', B: 'Doğru şıktır.', C: 'İşaret hatası.', D: 'Çarpmada hata.', E: 'Yanlış katsayı.' },
        topicSummary: 'Rasyonel katsayılı sabit terim.',
        keyTakeaway: 'a = 5/3.'
      },
      createdAt: 1710000000134
    },
    {
      id: 'q_math_35',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^2 + \\frac{a}{x^3}\\right)^6\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^3 - \\frac{a}{x^2}\\right)^6\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '1', isCorrect: false },
        { id: 'B', text: '2', isCorrect: false },
        { id: 'C', text: '3', isCorrect: true },
        { id: 'D', text: '4', isCorrect: false },
        { id: 'E', text: '5', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: 'Her iki açılımın sabit terim toplamı sıfıra eşitlendiğinde a = 3 çıkar.',
        whyOthersIncorrect: { A: 'İşlem hatası.', B: 'Yanlış a değeri.', C: 'Doğru şıktır.', D: 'Kombinasyon hatası.', E: 'İşaret hatası.' },
        topicSummary: 'Binom sabit terim denklem çözümü.',
        keyTakeaway: 'a = 3.'
      },
      createdAt: 1710000000135
    },
    {
      id: 'q_math_36',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^3 + \\frac{a}{x^2}\\right)^8\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^4 - \\frac{a}{x}\\right)^8\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '\\frac{3}{2}', isCorrect: true },
        { id: 'B', text: '\\frac{5}{2}', isCorrect: false },
        { id: 'C', text: '\\frac{7}{2}', isCorrect: false },
        { id: 'D', text: '\\frac{9}{2}', isCorrect: false },
        { id: 'E', text: '\\frac{11}{2}', isCorrect: false },
      ],
      correctOptionId: 'A',
      explanation: {
        whyCorrect: 'Sabit terimlerin toplamı 0 ise a = 3/2.',
        whyOthersIncorrect: { A: 'Doğru şıktır.', B: 'Yanlış pay.', C: 'Katsayı hatası.', D: 'Üs hatası.', E: 'İşaret hatası.' },
        topicSummary: 'Binom katsayı eşitlikleri.',
        keyTakeaway: 'a = 3/2.'
      },
      createdAt: 1710000000136
    },
    {
      id: 'q_math_37',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^4 + \\frac{a}{x}\\right)^5\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^2 - \\frac{a}{x^3}\\right)^5\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '2', isCorrect: false },
        { id: 'B', text: '3', isCorrect: false },
        { id: 'C', text: '4', isCorrect: false },
        { id: 'D', text: '5', isCorrect: true },
        { id: 'E', text: '6', isCorrect: false },
      ],
      correctOptionId: 'D',
      explanation: {
        whyCorrect: 'Sabit terimler toplamı 0 denkleminden a = 5 elde edilir.',
        whyOthersIncorrect: { A: 'İşlem hatası.', B: 'Yanlış değer.', C: 'Kombinasyon hatası.', D: 'Doğru şıktır.', E: 'İşaret hatası.' },
        topicSummary: 'Derecesi 5 olan binom açılımlarında sabit terim hesabı.',
        keyTakeaway: 'a = 5.'
      },
      createdAt: 1710000000137
    },
    {
      id: 'q_math_38',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^2 + \\frac{a}{x^2}\\right)^6\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^3 - \\frac{a}{x^3}\\right)^6\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '\\frac{1}{3}', isCorrect: false },
        { id: 'B', text: '\\frac{2}{3}', isCorrect: false },
        { id: 'C', text: '1', isCorrect: true },
        { id: 'D', text: '\\frac{4}{3}', isCorrect: false },
        { id: 'E', text: '\\frac{5}{3}', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: 'Sabit terim eşitlemesinden a = 1 bulunur.',
        whyOthersIncorrect: { A: 'Kesir hatası.', B: 'Katsayı hatası.', C: 'Doğru şıktır.', D: 'İşlem hatası.', E: 'İşaret hatası.' },
        topicSummary: 'Simetrik dereceli binom sabit terimleri.',
        keyTakeaway: 'a = 1.'
      },
      createdAt: 1710000000138
    },
    {
      id: 'q_math_39',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^5 + \\frac{a}{x^2}\\right)^7\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^3 - \\frac{a}{x^4}\\right)^7\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '\\frac{7}{3}', isCorrect: false },
        { id: 'B', text: '\\frac{8}{3}', isCorrect: true },
        { id: 'C', text: '\\frac{10}{3}', isCorrect: false },
        { id: 'D', text: '\\frac{11}{3}', isCorrect: false },
        { id: 'E', text: '\\frac{13}{3}', isCorrect: false },
      ],
      correctOptionId: 'B',
      explanation: {
        whyCorrect: 'Sabit terimler toplamı 0 denkleminden a = 8/3.',
        whyOthersIncorrect: { A: 'Toplama hatası.', B: 'Doğru şıktır.', C: 'Yanlış pay.', D: 'Katsayı hatası.', E: 'İşaret hatası.' },
        topicSummary: 'İleri seviye binom sabit terim denklem çözümü.',
        keyTakeaway: 'a = 8/3.'
      },
      createdAt: 1710000000139
    },
    {
      id: 'q_math_40',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^3 + \\frac{a}{x}\\right)^9\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^2 - \\frac{a}{x^4}\\right)^9\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '\\frac{3}{2}', isCorrect: false },
        { id: 'B', text: '\\frac{5}{2}', isCorrect: false },
        { id: 'C', text: '\\frac{7}{2}', isCorrect: true },
        { id: 'D', text: '\\frac{9}{2}', isCorrect: false },
        { id: 'E', text: '\\frac{11}{2}', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: 'Sabit terim toplamından a = 7/2 elde edilir.',
        whyOthersIncorrect: { A: 'Yanlış pay.', B: 'Katsayı hatası.', C: 'Doğru şıktır.', D: 'Toplama hatası.', E: 'İşaret hatası.' },
        topicSummary: '9. derece binom açılımında sabit terim hesabı.',
        keyTakeaway: 'a = 7/2.'
      },
      createdAt: 1710000000140
    },
    {
      id: 'q_math_41',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^4 + \\frac{a}{x^3}\\right)^6\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^5 - \\frac{a}{x^2}\\right)^6\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '1', isCorrect: false },
        { id: 'B', text: '2', isCorrect: true },
        { id: 'C', text: '3', isCorrect: false },
        { id: 'D', text: '4', isCorrect: false },
        { id: 'E', text: '5', isCorrect: false },
      ],
      correctOptionId: 'B',
      explanation: {
        whyCorrect: 'Sabit terim denkleminden a = 2 elde edilir.',
        whyOthersIncorrect: { A: 'İşlem hatası.', B: 'Doğru şıktır.', C: 'Katsayı hatası.', D: 'Yanlış değer.', E: 'İşaret hatası.' },
        topicSummary: '6. derece binom açılımı sabit terimleri.',
        keyTakeaway: 'a = 2.'
      },
      createdAt: 1710000000141
    },
    {
      id: 'q_math_42',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^2 + \\frac{a}{x^4}\\right)^8\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^4 - \\frac{a}{x^2}\\right)^8\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '\\frac{1}{2}', isCorrect: true },
        { id: 'B', text: '\\frac{3}{2}', isCorrect: false },
        { id: 'C', text: '\\frac{5}{2}', isCorrect: false },
        { id: 'D', text: '\\frac{7}{2}', isCorrect: false },
        { id: 'E', text: '\\frac{9}{2}', isCorrect: false },
      ],
      correctOptionId: 'A',
      explanation: {
        whyCorrect: 'Sabit terim toplamından a = 1/2.',
        whyOthersIncorrect: { A: 'Doğru şıktır.', B: 'Yanlış pay.', C: 'Katsayı hatası.', D: 'İşlem hatası.', E: 'İşaret hatası.' },
        topicSummary: 'Binom katsayı sadeleştirmesi.',
        keyTakeaway: 'a = 1/2.'
      },
      createdAt: 1710000000142
    },
    {
      id: 'q_math_43',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^3 + \\frac{a}{x^2}\\right)^7\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^2 - \\frac{a}{x^3}\\right)^7\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '\\frac{4}{3}', isCorrect: false },
        { id: 'B', text: '\\frac{5}{3}', isCorrect: false },
        { id: 'C', text: '2', isCorrect: true },
        { id: 'D', text: '\\frac{7}{3}', isCorrect: false },
        { id: 'E', text: '\\frac{8}{3}', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: 'Sabit terim eşitlemesinden a = 2 bulunur.',
        whyOthersIncorrect: { A: 'Kesir hatası.', B: 'Katsayı hatası.', C: 'Doğru şıktır.', D: 'Toplama hatası.', E: 'İşaret hatası.' },
        topicSummary: 'Tek kuvvetli binom açılımları.',
        keyTakeaway: 'a = 2.'
      },
      createdAt: 1710000000143
    },
    {
      id: 'q_math_44',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^5 + \\frac{a}{x}\\right)^6\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^3 - \\frac{a}{x^3}\\right)^6\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '1', isCorrect: false },
        { id: 'B', text: '2', isCorrect: false },
        { id: 'C', text: '3', isCorrect: false },
        { id: 'D', text: '4', isCorrect: false },
        { id: 'E', text: '5', isCorrect: true },
      ],
      correctOptionId: 'E',
      explanation: {
        whyCorrect: 'Sabit terim toplamından a = 5 elde edilir.',
        whyOthersIncorrect: { A: 'İşlem hatası.', B: 'Yanlış katsayı.', C: 'Kombinasyon hatası.', D: 'İşaret hatası.', E: 'Doğru şıktır.' },
        topicSummary: 'Sabit terim bulma kuralı.',
        keyTakeaway: 'a = 5.'
      },
      createdAt: 1710000000144
    },
    {
      id: 'q_math_45',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^2 + \\frac{a}{x^3}\\right)^9\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^4 - \\frac{a}{x^2}\\right)^9\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '\\frac{3}{2}', isCorrect: false },
        { id: 'B', text: '\\frac{5}{2}', isCorrect: false },
        { id: 'C', text: '\\frac{7}{2}', isCorrect: false },
        { id: 'D', text: '\\frac{9}{2}', isCorrect: true },
        { id: 'E', text: '\\frac{11}{2}', isCorrect: false },
      ],
      correctOptionId: 'D',
      explanation: {
        whyCorrect: 'Sabit terimler toplamı 0 denkleminden a = 9/2.',
        whyOthersIncorrect: { A: 'Yanlış pay.', B: 'Katsayı hatası.', C: 'Toplama hatası.', D: 'Doğru şıktır.', E: 'İşaret hatası.' },
        topicSummary: 'Binom açılım sabit terimleri.',
        keyTakeaway: 'a = 9/2.'
      },
      createdAt: 1710000000145
    },
    {
      id: 'q_math_46',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^4 + \\frac{a}{x}\\right)^7\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^3 - \\frac{a}{x^4}\\right)^7\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '\\frac{8}{5}', isCorrect: false },
        { id: 'B', text: '\\frac{9}{5}', isCorrect: false },
        { id: 'C', text: '2', isCorrect: true },
        { id: 'D', text: '\\frac{11}{5}', isCorrect: false },
        { id: 'E', text: '\\frac{12}{5}', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: 'Sabit terim eşitlemesinden a = 2 elde edilir.',
        whyOthersIncorrect: { A: 'Kesir hatası.', B: 'Yanlış katsayı.', C: 'Doğru şıktır.', D: 'Toplama hatası.', E: 'İşaret hatası.' },
        topicSummary: 'Sabit terim eşitlik denklem çözümü.',
        keyTakeaway: 'a = 2.'
      },
      createdAt: 1710000000146
    },
    {
      id: 'q_math_47',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^3 + \\frac{a}{x^4}\\right)^8\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^5 - \\frac{a}{x^2}\\right)^8\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '\\frac{1}{2}', isCorrect: false },
        { id: 'B', text: '\\frac{3}{2}', isCorrect: true },
        { id: 'C', text: '\\frac{5}{2}', isCorrect: false },
        { id: 'D', text: '\\frac{7}{2}', isCorrect: false },
        { id: 'E', text: '\\frac{9}{2}', isCorrect: false },
      ],
      correctOptionId: 'B',
      explanation: {
        whyCorrect: 'Sabit terimler toplamı 0 denkleminden a = 3/2.',
        whyOthersIncorrect: { A: 'Yanlış pay.', B: 'Doğru şıktır.', C: 'Katsayı hatası.', D: 'Toplama hatası.', E: 'İşaret hatası.' },
        topicSummary: 'Kombinasyonda sabit terim.',
        keyTakeaway: 'a = 3/2.'
      },
      createdAt: 1710000000147
    },
    {
      id: 'q_math_48',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^2 + \\frac{a}{x^2}\\right)^5\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^4 - \\frac{a}{x}\\right)^5\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '1', isCorrect: false },
        { id: 'B', text: '2', isCorrect: false },
        { id: 'C', text: '3', isCorrect: false },
        { id: 'D', text: '4', isCorrect: true },
        { id: 'E', text: '5', isCorrect: false },
      ],
      correctOptionId: 'D',
      explanation: {
        whyCorrect: 'Sabit terim denkleminden a = 4 bulunur.',
        whyOthersIncorrect: { A: 'İşlem hatası.', B: 'Yanlış katsayı.', C: 'Kombinasyon hatası.', D: 'Doğru şıktır.', E: 'İşaret hatası.' },
        topicSummary: 'Binom kuralı sabit terim.',
        keyTakeaway: 'a = 4.'
      },
      createdAt: 1710000000148
    },
    {
      id: 'q_math_49',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^5 + \\frac{a}{x^3}\\right)^6\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^2 - \\frac{a}{x^4}\\right)^6\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '\\frac{3}{2}', isCorrect: false },
        { id: 'B', text: '\\frac{5}{2}', isCorrect: false },
        { id: 'C', text: '\\frac{7}{2}', isCorrect: false },
        { id: 'D', text: '\\frac{9}{2}', isCorrect: false },
        { id: 'E', text: '\\frac{11}{2}', isCorrect: true },
      ],
      correctOptionId: 'E',
      explanation: {
        whyCorrect: 'Sabit terim toplamından a = 11/2.',
        whyOthersIncorrect: { A: 'Yanlış pay.', B: 'Katsayı hatası.', C: 'Toplama hatası.', D: 'İşaret hatası.', E: 'Doğru şıktır.' },
        topicSummary: 'Rasyonel sabit terim.',
        keyTakeaway: 'a = 11/2.'
      },
      createdAt: 1710000000149
    },
    {
      id: 'q_math_50',
      topic: 'Matematik',
      difficulty: 'advanced',
      questionText: 'a sıfırdan farklı bir gerçel sayı olmak üzere \\[\\left(x^3 + \\frac{a}{x}\\right)^{12}\\] ifadesinin açılımındaki sabit terim ile \\[\\left(x^4 - \\frac{a}{x^2}\\right)^{12}\\] ifadesinin açılımındaki sabit terimin toplamı 0\'dır. Buna göre a kaçtır?',
      options: [
        { id: 'A', text: '\\frac{4}{3}', isCorrect: false },
        { id: 'B', text: '\\frac{5}{3}', isCorrect: false },
        { id: 'C', text: '2', isCorrect: true },
        { id: 'D', text: '\\frac{7}{3}', isCorrect: false },
        { id: 'E', text: '\\frac{8}{3}', isCorrect: false },
      ],
      correctOptionId: 'C',
      explanation: {
        whyCorrect: 'Sabit terimler toplamı 0 eşitlemesinden a = 2 elde edilir.',
        whyOthersIncorrect: { A: 'Kesir hatası.', B: 'Yanlış katsayı.', C: 'Doğru şıktır.', D: 'Toplama hatası.', E: 'İşaret hatası.' },
        topicSummary: '12. derece binom sabit terimleri.',
        keyTakeaway: 'a = 2.'
      },
      createdAt: 1710000000150
    }
  ],
  'SQL Database': [
    {
        "id": "q_sql_1",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Aşağıdaki SQL sorgusunda maas sütununa göre sıralama yapılmaktadır. maas değerleri 5000, 5000, 4000 olan 3 çalışan için DENSE_RANK() ve RANK() fonksiyonlarının üreteceği sıra numaraları sırasıyla hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "1, 1, 2 ve 1, 1, 3",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "1, 1, 2 ve 1, 2, 3",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "1, 1, 3 ve 1, 2, 3",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "1, 2, 3 ve 1, 1, 2",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "DENSE_RANK() eşit değerlere aynı sırayı verir ve ardışık numaralandırmaya devam eder (1, 1, 2). RANK() ise eşit değerler sonrasında atlama yapar (1, 1, 3).",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Window Functions - DENSE_RANK vs RANK",
            "keyTakeaway": "SQL İleri Seviye Soru #1 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000001
    },
    {
        "id": "q_sql_2",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Bir şirketin aylık satış tablosunda, bir önceki ayın satış miktarını mevcut satıra getirmek için aşağıdaki window fonksiyonlarından hangisi kullanılmalıdır?",
        "options": [
            {
                "id": "A",
                "text": "LEAD(satis_miktari, 1) OVER (ORDER BY ay)",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "NTH_VALUE(satis_miktari, 1) OVER (ORDER BY ay)",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "FIRST_VALUE(satis_miktari) OVER (ORDER BY ay)",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "LAG(satis_miktari, 1) OVER (ORDER BY ay)",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "LAG() fonksiyonu sıralı veri kümesinde mevcut satırdan önceki (offset) satırların değerini döndürmek için kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Window Functions - LAG & LEAD",
            "keyTakeaway": "SQL İleri Seviye Soru #2 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000002
    },
    {
        "id": "q_sql_3",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "SUM(satis) OVER (ORDER BY tarih ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) ifadesi neyi hesaplar?",
        "options": [
            {
                "id": "A",
                "text": "Mevcut satırdan sonraki tüm satırların toplamını",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tablonun en başından mevcut satıra kadar olan kümülatif (yürüyen) toplamı",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Tüm tablonun genel toplamını sabit olarak",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Sadece bir önceki satır ile mevcut satırın toplamını",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "UNBOUNDED PRECEDING en ilk satırdan başlar, CURRENT ROW ise mevcut satıra kadar olan satırları kapsayarak kümülatif toplam (running total) hesaplar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Window Functions - Frame Specification",
            "keyTakeaway": "SQL İleri Seviye Soru #3 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000003
    },
    {
        "id": "q_sql_4",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Hiyerarşik (organizasyon şeması, kategori ağacı vb.) verileri sorgulamak için kullanılan CTE yapısında özyinelemeyi sonlandıran veya birleştiren temel operatör hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "INTERSECT",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "EXCEPT",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "UNION ALL",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "CROSS JOIN",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Recursive CTE yapısında Anchor Member (kök sorgu) ile Recursive Member (özyinelemeli sorgu) birbirine UNION ALL operatörü ile bağlanır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Recursive CTE - Özyinelemeli Sorgular",
            "keyTakeaway": "SQL İleri Seviye Soru #4 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000004
    },
    {
        "id": "q_sql_5",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "SQL motorunun bir SELECT sorgusunu işleme sırası aşağıdakilerden hangisinde doğru verilmiştir?",
        "options": [
            {
                "id": "A",
                "text": "FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "FROM -> GROUP BY -> WHERE -> HAVING -> SELECT -> ORDER BY",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "WHERE -> FROM -> GROUP BY -> SELECT -> HAVING -> ORDER BY",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "SQL mantıksal sorgu işleme sırası: 1. FROM/JOIN, 2. WHERE, 3. GROUP BY, 4. HAVING, 5. SELECT, 6. ORDER BY, 7. LIMIT/OFFSET.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SQL Execution Order - Sorgu Çalışma Sırası",
            "keyTakeaway": "SQL İleri Seviye Soru #5 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000005
    },
    {
        "id": "q_sql_6",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Bir transaction bir aralıktaki satırları okurken, başka bir transaction bu aralığa yeni bir satır INSERT edip COMMIT ettiğinde ilk transaction'ın aynı sorguda farklı satır sayısı görmesi durumuna ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Phantom Read (Hayalet Okuma)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Dirty Read (Kirli Okuma)",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Non-Repeatable Read (Tekrarlanamayan Okuma)",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Lost Update (Kayıp Güncelleme)",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Phantom Read, bir transaction çalışırken başka bir transaction tarafından yeni satır eklenmesi (INSERT) veya silinmesi sonucu oluşan tutarsızlıktır.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction Isolation Levels - Phantom Read",
            "keyTakeaway": "SQL İleri Seviye Soru #6 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000006
    },
    {
        "id": "q_sql_7",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Phantom Read (Hayalet Okuma) sorununu tamamen engelleyen en yüksek SQL işlem izolasyon seviyesi (Transaction Isolation Level) hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "REPEATABLE READ",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "READ UNCOMMITTED",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "SERIALIZABLE",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "READ COMMITTED",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "SERIALIZABLE en yüksek izolasyon seviyesidir; kilitler ve aralık kilitleri (range locks) kullanarak Phantom Read dahil tüm tutarsızlıkları önler.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction Isolation Levels - SERIALIZABLE",
            "keyTakeaway": "SQL İleri Seviye Soru #7 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000007
    },
    {
        "id": "q_sql_8",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "GROUP BY GROUPING SETS ((bolum_id, unvan), (bolum_id), ()) ifadesinin ürettiği özet çıktısı aşağıdakilerden hangisine eşdeğerdir?",
        "options": [
            {
                "id": "A",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "GROUP BY ROLLUP(bolum_id, unvan)",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "GROUP BY CUBE(bolum_id, unvan)",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "GROUP BY UNION ALL",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "GROUP BY bolum_id, unvan WITH CUBE",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "ROLLUP(A, B) ifadesi sırasıyla (A, B), (A) ve () hiyerarşik gruplamalarını üretir. Bu da belirtilen GROUPING SETS ile birebir aynıdır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: GROUPING SETS - Çoklu Gruplama",
            "keyTakeaway": "SQL İleri Seviye Soru #8 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000008
    },
    {
        "id": "q_sql_9",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "WHERE ve HAVING tümceleri arasındaki en temel fark aşağıdakilerden hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "WHERE gruplamadan önce satırları filtreler, HAVING ise GROUP BY sonrasında gruplanmış özet verileri filtreler.",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "HAVING agregasyon fonksiyonları içeremez, WHERE içerebilir.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "WHERE sadece sayısal alanlarda kullanılır, HAVING metinsel alanlarda kullanılır.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "WHERE sorguyu hızlandırmaz, HAVING performansı artırır.",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "WHERE satır bazlı filtreleme yapar ve GROUP BY öncesi çalışır. HAVING ise gruplanmış sonuçlar üzerinde (SUM, AVG vb. içeren) filtreleme yapar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: HAVING vs WHERE Farkı",
            "keyTakeaway": "SQL İleri Seviye Soru #9 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000009
    },
    {
        "id": "q_sql_10",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "COALESCE(NULL, NULL, 'Python', 'SQL') ve NULLIF(10, 10) ifadelerinin sonuçları sırasıyla nedir?",
        "options": [
            {
                "id": "A",
                "text": "NULL ve 0",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "'SQL' ve 10",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "'Python' ve 10",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "'Python' ve NULL",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "COALESCE verilen listedeki İLK NULL OLMAYAN değeri döndürür ('Python'). NULLIF(a, b) ise iki parametre eşitse NULL döndürür (10 = 10 olduğu için NULL).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: COALESCE vs NULLIF",
            "keyTakeaway": "SQL İleri Seviye Soru #10 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000010
    },
    {
        "id": "q_sql_11",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "İçteki sorgunun dıştaki sorgunun her bir satırı için tekrar tekrar çalıştırıldığı sorgu türü hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "Scalar Subquery",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Inline View",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "CTE",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Correlated Subquery (İlişkili Alt Sorgu)",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Correlated Subquery dış sorgudaki tablonun takma adına (alias) bağımlıdır ve dış sorgunun her satırı için yürütülür.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Correlated Subquery",
            "keyTakeaway": "SQL İleri Seviye Soru #11 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000011
    },
    {
        "id": "q_sql_12",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "A ve B tabloları LEFT JOIN ile birleştirildiğinde, sadece A tablosunda olup B tablosunda eşleşmeyen satırları bulmak için hangi WHERE koşulu eklenmelidir?",
        "options": [
            {
                "id": "A",
                "text": "WHERE B.id IS NOT NULL",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "WHERE B.id = 0",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "WHERE B.id IS NULL",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "WHERE A.id = B.id",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "LEFT JOIN eşleşmeyen B satırlarına NULL atar. WHERE B.id IS NULL filtresiyle sadece B'de karşılığı olmayan (fark) satırlar elde edilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: LEFT JOIN & NULL Check",
            "keyTakeaway": "SQL İleri Seviye Soru #12 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000012
    },
    {
        "id": "q_sql_13",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "UNION ile UNION ALL arasındaki temel performans ve işlev farkı nedir?",
        "options": [
            {
                "id": "A",
                "text": "UNION mükerrer (duplicate) satırları eler ve sıralama yapar; UNION ALL elenmeden tüm satırları birleştirir ve daha hızlıdır.",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "UNION ALL bellek kullanmaz, UNION bellek kullanır.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "UNION iki tabloyu yan yana birleştirir, UNION ALL alt alta birleştirir.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "UNION ALL mükerrer satırları eler, UNION elemez.",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "UNION tekil satırları bulmak için dahili DISTINCT (sort/hash) işlemi yapar. UNION ALL mükerrerleri elemediği için çok daha hızlıdır.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: UNION vs UNION ALL",
            "keyTakeaway": "SQL İleri Seviye Soru #13 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000013
    },
    {
        "id": "q_sql_14",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "B-Tree indeks yapısında bir sütuna B-Tree indeksi oluşturulduğunda aşağıdaki sorgu türlerinden hangisi bu indeksi verimli KULLANAMAZ?",
        "options": [
            {
                "id": "A",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "WHERE ad LIKE 'Ahmet%'",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "WHERE maas BETWEEN 3000 AND 5000",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "WHERE ad = 'Ahmet'",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "WHERE UPPER(ad) = 'AHMET'",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "İndeksli sütun bir fonksiyona (UPPER, LOWER, TO_CHAR vb.) sarıldığında klasik B-Tree indeksi pasif kalır (Full Table Scan yapılır). İndeksli alan saf tutulmalıdır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: B-Tree Indexing",
            "keyTakeaway": "SQL İleri Seviye Soru #14 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000014
    },
    {
        "id": "q_sql_15",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Veritabanı yürütme planında (Execution Plan) 'Index Seek' ile 'Index Scan' arasındaki temel fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "Index Scan sadece hafızada çalışır.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Index Seek sadece Clustered indekslerde çalışır.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Index Seek ağaçta doğrudan aranan noktaya gider (hızlı); Index Scan tüm indeks yapısını baştan sona tarar.",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Index Scan tek bir satır okur, Index Seek tüm tabloyu okur.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Index Seek nokta atışı (bipartite/tree navigation) arama yapar. Index Scan ise indeks yapısının tamamını okur.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index Seek vs Index Scan",
            "keyTakeaway": "SQL İleri Seviye Soru #15 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000015
    },
    {
        "id": "q_sql_16",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Bir ilişkisel veritabanı tablosunda neden en fazla 1 adet Clustered Index (Kümeli İndeks) bulunabilir?",
        "options": [
            {
                "id": "A",
                "text": "Çünkü Clustered Index sadece birincil anahtar (Primary Key) üzerinde tanımlanabilir.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Çünkü Clustered Index tablodaki verilerin fiziksel olarak diskteki dizilim sırasını belirler.",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Çünkü bellekte birden fazla indeks saklanamaz.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Çünkü veritabanı yazılımları lisans gereği tek indekse izin verir.",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Bir verinin disk üzerinde sadece TEK BİR fiziksel sıralaması olabileceği için bir tabloda yalnızca 1 adet Clustered Index bulunabilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Clustered vs Non-Clustered Index",
            "keyTakeaway": "SQL İleri Seviye Soru #16 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000016
    },
    {
        "id": "q_sql_17",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Veritabanı ACID ilkelerinden 'Atomicity' (Bütünlük/Bölünemezlik) ne anlama gelir?",
        "options": [
            {
                "id": "A",
                "text": "Eşzamanlı işlemler birbirini etkilemez.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "İşlem ya tamamen başarılı olur ya da hiç gerçekleşmemiş gibi tamamen geri alınır (All or Nothing).",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Veritabanı her zaman bir tutarlı durumdan diğer tutarlı duruma geçer.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Tamamlanan işlemler kalıcıdır.",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Atomicity (Hep ya da Hiç): Bir transaction içerisindeki tüm adımlar ya hep birlikte başarılı olur (COMMIT) ya da bir hata durumunda tüm adımlar geri alınır (ROLLBACK).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: ACID - Atomicity",
            "keyTakeaway": "SQL İleri Seviye Soru #17 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000017
    },
    {
        "id": "q_sql_18",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "ACID ilkelerinden 'Isolation' (Yalıtım) kavramı neyi güvence altına alır?",
        "options": [
            {
                "id": "A",
                "text": "Verinin diske fiziksel olarak yazılmasını sağlar.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Veritabanı kısıtlamalarının (CHECK, FK) ihlal edilmemesini sağlar.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Veritabanının yedeklenmesini garanti eder.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Eşzamanlı çalışan birden fazla transaction'ın birbirlerinin henüz tamamlanmamış verilerini görmesini ve etkilemesini kontrol eder.",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Yalıtım (Isolation), aynı anda yürütülen işlemlerin birbirinden bağımsız ve izole olmasını sağlar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: ACID - Isolation",
            "keyTakeaway": "SQL İleri Seviye Soru #18 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000018
    },
    {
        "id": "q_sql_19",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Bir Recursive CTE sorgusunun sonsuz döngüye (infinite loop) girmesini engellemek için ne yapılmalıdır?",
        "options": [
            {
                "id": "A",
                "text": "GROUP BY eklenmelidir.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "ORDER BY eklenmelidir.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Recursive tümcede durdurma koşulu (WHERE adım < N veya parent_id IS NOT NULL) bulunmalıdır.",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "UNION ALL yerine UNION kullanılmalıdır.",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Recursive kısımda özyinelemeyi sonlandıracak mantıksal bir WHERE sınır koşulu veya MAXRECURSION seçeneği kullanılmalıdır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Recursive CTE Terminating Condition",
            "keyTakeaway": "SQL İleri Seviye Soru #19 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000019
    },
    {
        "id": "q_sql_20",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Alt sorguda NULL değerler bulunabileceğinde ve performans kritik olduğunda EXISTS mi IN mi tercih edilmelidir?",
        "options": [
            {
                "id": "A",
                "text": "IN tercih edilmelidir; çünkü IN NULL değerleri otomatik olarak sıfıra çevirir.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "İkisi de tamamen aynı çalışır ve hiçbir performans farkı yoktur.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "IN sadece sayısal verilerde çalışır.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "EXISTS tercih edilmelidir; çünkü EXISTS NULL değerlerden etkilenmez ve ilk eşleşmede durur (Short-circuit).",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "NOT IN kullanımı alt sorgudaki tek bir NULL değer yüzünden tüm sonucu boş döndürebilir (Three-valued logic). EXISTS ise Boolean kontrol yapar ve ilk TRUE'da durur.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: EXISTS vs IN",
            "keyTakeaway": "SQL İleri Seviye Soru #20 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000020
    },
    {
        "id": "q_sql_21",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "A tablosunda 50 satır, B tablosunda 100 satır bulunmaktadır. SELECT * FROM A CROSS JOIN B sorgusu kaç satır sonuç döndürür?",
        "options": [
            {
                "id": "A",
                "text": "5000",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "100",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "150",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "50",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "CROSS JOIN kartezyen çarpım üretir. Sonuç satır sayısı A_satır × B_satır = 50 × 100 = 5000 olur.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: CROSS JOIN & Kartezyen Çarpım",
            "keyTakeaway": "SQL İleri Seviye Soru #21 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000021
    },
    {
        "id": "q_sql_22",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Bir tablonun kendisiyle birleştirilmesi (SELF JOIN) en çok hangi durumlarda kullanılır?",
        "options": [
            {
                "id": "A",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tablodaki mükerrer sütunları silmek için.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Tablonun yedeğini başka bir veritabanına aktarmak için.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Veritabanı indekslerini yeniden yapılandırmak için.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Aynı tabloda yer alan çalışan-yönetici ilişkisi gibi hiyerarşik veya birbiriyle ilişkili satırları kıyaslamak için.",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "SELF JOIN bir tablonun kendi satırları arasındaki ilişkileri (örneğin personel tablosundaki müdür_id ile personel_id ilişkisi) sorgulamak için kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SELF JOIN Kullanım Amacı",
            "keyTakeaway": "SQL İleri Seviye Soru #22 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000022
    },
    {
        "id": "q_sql_23",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "100 satırlık bir veri kümesinde NTILE(4) OVER (ORDER BY puan DESC) fonksiyonu ne yapar?",
        "options": [
            {
                "id": "A",
                "text": "İlk 4 satırı döndürür.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Puanı 4'e böler.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Her 4 satırda bir toplam alır.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Verileri puan sırasına göre 4 eşit gruba (çeyreklik/quartile) böler ve her satıra 1, 2, 3 veya 4 değerini atar.",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "NTILE(n) sıralı veri kümesini belirtilen n adet eşit kovaya (bucket/quartile) bölerek her satıra kova numarasını verir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Window Function - NTILE(4)",
            "keyTakeaway": "SQL İleri Seviye Soru #23 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000023
    },
    {
        "id": "q_sql_24",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "FOREIGN KEY kısıtlamasında ON DELETE CASCADE seçeneği tanımlandığında ne gerçekleşir?",
        "options": [
            {
                "id": "A",
                "text": "Silinen satırlar çöp kutusuna taşınır.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Ana tablodan satır silinmesi engellenir.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Ana (Parent) tablodan bir satır silindiğinde, ona bağlı tüm alt (Child) tablodaki satırlar da otomatik olarak silinir.",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Alt tablodaki ilgili alanlara NULL değeri atanır.",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "ON DELETE CASCADE ilkesi ana tablodaki silme işlemini ilişkili tüm detay satırlarına otomatik olarak yayarak siler.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: FOREIGN KEY CASCADE",
            "keyTakeaway": "SQL İleri Seviye Soru #24 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000024
    },
    {
        "id": "q_sql_25",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Bir sorgunun ihtiyaç duyduğu tüm sütunların doğrudan indeks yapısının (leaf node) içinde bulunması durumuna ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Bitmap Index",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Clustered Index",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Filtered Index",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Covering Index (Kapsayan İndeks)",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Eğer bir sorgudaki SELECT, WHERE, JOIN ve ORDER BY sütunlarının tamamı indekste varsa buna Covering Index denir ve tabloya gitmeden (Index-Only Scan) yanıt döner.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index - Covering Index",
            "keyTakeaway": "SQL İleri Seviye Soru #25 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000025
    },
    {
        "id": "q_sql_26",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Materialized View (Maddi Görünüm) ile Standart View arasındaki en önemli fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "Materialized View sadece PostgreSQL'de vardır.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Normal View indekslenemez ancak Materialized View da indekslenemez.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Materialized View sorgu sonucunu fiziksel olarak diskte saklar ve yenilenmesi gerekir; Normal View ise sadece saklanmış bir SQL sorgusudur.",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Normal View diskte yer kaplar, Materialized View kaplamaz.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Materialized View sorgunun çıktısını tablo gibi diskte tutar (fiziksel saklama). Bu sayede karmaşık sorgularda çok hızlıdır ancak REFRESH edilmelidir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Materialized View vs Normal View",
            "keyTakeaway": "SQL İleri Seviye Soru #26 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000026
    },
    {
        "id": "q_sql_27",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "SQL'de `WHERE sutun = NULL` ifadesi neden hiçbir zaman TRUE dönmez?",
        "options": [
            {
                "id": "A",
                "text": "Çünkü SQL üç değerli mantık (Three-valued logic) kullanır ve NULL bilinmeyen bir değer olduğu için eşitlik IS NULL ile kontrol edilmelidir.",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Çünkü NULL terimi SQL standartlarında kaldırılmıştır.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Çünkü WHERE tümcesi metinsel alanlarda çalışmaz.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Çünkü NULL sadece 0 sayısal değerine eşittir.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "SQL'de NULL ile yapılan tüm mantıksal karşılaştırmalar (`=`, `<>`, `<`) UNKNOWN döner. Bir değerin NULL olup olmadığını test etmek için `IS NULL` veya `IS NOT NULL` kullanılmalıdır.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: NULL Değer Karşılaştırması",
            "keyTakeaway": "SQL İleri Seviye Soru #27 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000027
    },
    {
        "id": "q_sql_28",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Veritabanında bir satır varsa UPDATE, yoksa INSERT yapma işlemine ne ad verilir ve standart SQL'de hangi komutla yapılır?",
        "options": [
            {
                "id": "A",
                "text": "UPSERT mantığı - MERGE INTO komutu",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "TRUNCATE TABLE komutu",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "BULK INSERT komutu",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "ALTER TABLE komutu",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Var olan satırı güncelleme, yoksa ekleme mantığına UPSERT denir. ANSI SQL standardında bu işlem MERGE INTO komutu ile sağlanır (PostgreSQL'de ON CONFLICT).",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: UPSERT (MERGE / ON CONFLICT)",
            "keyTakeaway": "SQL İleri Seviye Soru #28 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000028
    },
    {
        "id": "q_sql_29",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "GROUP BY CUBE(A, B, C) ifadesi kaç farklı gruplama kombinasyonu (grouping set) üretir?",
        "options": [
            {
                "id": "A",
                "text": "3",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "8 (2^3)",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "9",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "6",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "CUBE n adet sütun için 2^n kombinasyon üretir. 3 sütun için 2^3 = 8 farklı gruplama seti oluşturur: (A,B,C), (A,B), (A,C), (B,C), (A), (B), (C), ().",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: GROUP BY - CUBE",
            "keyTakeaway": "SQL İleri Seviye Soru #29 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000029
    },
    {
        "id": "q_sql_30",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "LAST_VALUE() window fonksiyonu kullanılırken 'ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING' çerçevesi eklenmezse neden beklenen son satırı vermez?",
        "options": [
            {
                "id": "A",
                "text": "Çünkü LAST_VALUE sadece alfabetik sıralamada çalışır.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Çünkü tablonun sıralaması bozuktur.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Çünkü varsayılan pencere çerçevesi (frame) CURRENT ROW'a kadardır ve her satırda kendisini son satır görür.",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Çünkü LAST_VALUE fonksiyonu NULL değerleri otomatik siler.",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Varsayılan pencere çerçevesi `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` olduğundan, pencere o anki satırda biter ve LAST_VALUE hep o anki satırı döndürür.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Window Functions - FIRST_VALUE & LAST_VALUE",
            "keyTakeaway": "SQL İleri Seviye Soru #30 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000030
    },
    {
        "id": "q_sql_31",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(31) [Index - Partial / Filtered Index] Sadece belirli bir koşulu sağlayan satırlar için oluşturulan indekse (Örn: WHERE silindi = FALSE) ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Filtered Index (Kısmi / Filtrelenmiş İndeks)",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Bitmap Index",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Global Index",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Clustered Index",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Filtered Index (Partial Index), tablonun tamamı yerine sadece WHERE koşuluna uyan satırları indeksleyerek disk alanı ve bakım maliyetinden tasarruf sağlar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index - Partial / Filtered Index",
            "keyTakeaway": "SQL İleri Seviye Soru #31 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000031
    },
    {
        "id": "q_sql_32",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(32) [Transaction - Deadlock (Kilitlenme)] İki farklı transaction'ın birbirinin kilitlediği kaynakları karşılıklı olarak beklemesi sonucu oluşan kilitlenmeye ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Latch",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Livelock",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Starvation",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Deadlock (Ölümcül Kilitlenme)",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Deadlock, Transaction A'nın Kaynak 1'i kilitleyip Kaynak 2'yi beklemesi, Transaction B'nin ise Kaynak 2'yi kilitleyip Kaynak 1'i beklemesi durumudur. VTYS birini kurban (victim) seçerek çözer.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction - Deadlock (Kilitlenme)",
            "keyTakeaway": "SQL İleri Seviye Soru #32 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000032
    },
    {
        "id": "q_sql_33",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(33) [SQL Security - SQL Injection] SQL Injection (SQL Enjeksiyonu) saldırılarını veritabanı uygulama seviyesinde tamamen engellemenin en etkili ve standart yöntemi nedir?",
        "options": [
            {
                "id": "A",
                "text": "Girdileri tırnak işaretlerinden arındırmak",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Parametreli Sorgular (Prepared Statements / Parameterized Queries) kullanmak",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Tüm sorguları büyük harfe çevirmek",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Sadece GET istekleri kullanmak",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Prepared Statements (Parametreli Sorgular), kullanıcı girdisini SQL komut kodundan ayırarak veri olarak işler ve SQL Injection'ı %100 engeller.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SQL Security - SQL Injection",
            "keyTakeaway": "SQL İleri Seviye Soru #33 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000033
    },
    {
        "id": "q_sql_34",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(34) [Database Normalization - 3NF] Üçüncü Normal Form (3NF) şartı aşağıdakilerden hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda tekrarlayan sütunların olmaması",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Foreign key bulunmaması",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Tüm alanların atomik olması",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tablonun 2NF'de olması ve birincil anahtara geçişli (transitive) bağımlılığın olmaması",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "3NF kuralı: Tablo 2NF olmalı ve birincil anahtar olmayan bir alan, başka bir birincil anahtar olmayan alana bağımlı olmamalıdır (No Transitive Dependency).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - 3NF",
            "keyTakeaway": "SQL İleri Seviye Soru #34 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000034
    },
    {
        "id": "q_sql_35",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(35) [Database Normalization - BCNF] Boyce-Codd Normal Form (BCNF), 3NF'den farklı olarak hangi ekstra kuralı zorunlu kılar?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda hiç NULL değer bulunmaması kuralı",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Her determinantın (belirleyicinin) mutlaka bir aday anahtar (candidate key) olması kuralı",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "En fazla 5 sütun bulunabilmesi kuralı",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Tüm sütunların sayısal olması kuralı",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "BCNF, 3NF'nin daha katı bir halidir. Her X -> Y bağımlılığında X'in mutlaka bir Super Key / Candidate Key olmasını şart koşar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - BCNF",
            "keyTakeaway": "SQL İleri Seviye Soru #35 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000035
    },
    {
        "id": "q_sql_36",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(36) [Constraint - CHECK Constraint] Bir tablodaki `yas` sütununa sadece 18 ve üzeri değerlerin girilebilmesini sağlayan kısıtlama (constraint) hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "FOREIGN KEY (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "CHECK (yas >= 18)",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "DEFAULT (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "UNIQUE (yas >= 18)",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "CHECK kısıtlaması bir sütuna girilebilecek verilerin belirli bir mantıksal koşula (Boolean expression) uymasını zorunlu kılar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Constraint - CHECK Constraint",
            "keyTakeaway": "SQL İleri Seviye Soru #36 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000036
    },
    {
        "id": "q_sql_37",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(37) [Storage - CTE vs Temporary Table] Common Table Expression (CTE) ile Geçici Tablo (Temporary Table) arasındaki temel fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "CTE sadece PostgreSQL'de vardır.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "CTE diskte yer kaplar, Temporary Table kaplamaz.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "CTE hafızada sadece ilgili sorgu süresince var olan mantıksal bir görünümdür; Temporary Table ise tempdb/oturum içinde fiziksel olarak oluşturulur ve indekslenebilir.",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Temporary Table silinemez.",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "CTE tek bir sorgunun çalışma anı (scope) boyunca geçerli mantıksal yapıdır. Temporary Table ise oturum kapanana kadar tempdb'de fiziksel yaşar ve indekslenebilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Storage - CTE vs Temporary Table",
            "keyTakeaway": "SQL İleri Seviye Soru #37 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000037
    },
    {
        "id": "q_sql_38",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(38) [Query Optimization - SARGABLE Queries] SARGABLE (Search Argument Able) sorgu ifadesi ne anlama gelir?",
        "options": [
            {
                "id": "A",
                "text": "Sorgunun otomatik olarak paralelleştirilmesi",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sorgunun sonucunun bellekte saklanması",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Sorgudaki WHERE koşulunun indeksleri etkin bir şekilde kullanabilecek biçimde yazılmış olması",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Sorguda grafik çizilmesi",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "SARGABLE sorgular, indeksli sütunların üzerinde fonksiyon veya tip dönüşümü yapılmadan yazıldığı için VTYS'nin Index Seek yapabilmesine olanak tanır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Query Optimization - SARGABLE Queries",
            "keyTakeaway": "SQL İleri Seviye Soru #38 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000038
    },
    {
        "id": "q_sql_39",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(39) [Subquery - Scalar Subquery] Scalar Subquery (Skaler Alt Sorgu) ne tür bir sonuç döndürür?",
        "options": [
            {
                "id": "A",
                "text": "Tam olarak 1 satır ve 1 sütundan oluşan tek bir değer",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sadece Boolean (TRUE/FALSE) değer",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Bir tablo dolusu satır ve sütun",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Sadece dizi (Array) verisi",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Scalar subquery tek bir hücre (1 satır × 1 sütun) değer döndüren sorgudur. Bu yüzden SELECT listesinde veya matematiksel ifadelerde kullanılabilir.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Subquery - Scalar Subquery",
            "keyTakeaway": "SQL İleri Seviye Soru #39 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000039
    },
    {
        "id": "q_sql_40",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(40) [JSON Data in SQL - JSON_EXTRACT / ->>] Modern ilişkisel veritabanlarında (PostgreSQL, MySQL vb.) saklanan JSON verisinden bir alanı metin (text) olarak çekmek için hangi operatör/fonksiyon kullanılır?",
        "options": [
            {
                "id": "A",
                "text": "STRING_SPLIT()",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "PostgreSQL'de ->> operatörü / JSON_EXTRACT_TEXT",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "GROUP_CONCAT()",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "SUM()",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "JSON alanlarından metin değeri çekmek için PostgreSQL'de `->>` operatörü, MySQL/SQLite'ta `JSON_EXTRACT()` veya `->>` kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: JSON Data in SQL - JSON_EXTRACT / ->>",
            "keyTakeaway": "SQL İleri Seviye Soru #40 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000040
    },
    {
        "id": "q_sql_41",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(41) [Index - Partial / Filtered Index] Sadece belirli bir koşulu sağlayan satırlar için oluşturulan indekse (Örn: WHERE silindi = FALSE) ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Filtered Index (Kısmi / Filtrelenmiş İndeks)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Clustered Index",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Bitmap Index",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Global Index",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Filtered Index (Partial Index), tablonun tamamı yerine sadece WHERE koşuluna uyan satırları indeksleyerek disk alanı ve bakım maliyetinden tasarruf sağlar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index - Partial / Filtered Index",
            "keyTakeaway": "SQL İleri Seviye Soru #41 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000041
    },
    {
        "id": "q_sql_42",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(42) [Transaction - Deadlock (Kilitlenme)] İki farklı transaction'ın birbirinin kilitlediği kaynakları karşılıklı olarak beklemesi sonucu oluşan kilitlenmeye ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Starvation",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Deadlock (Ölümcül Kilitlenme)",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Livelock",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Latch",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Deadlock, Transaction A'nın Kaynak 1'i kilitleyip Kaynak 2'yi beklemesi, Transaction B'nin ise Kaynak 2'yi kilitleyip Kaynak 1'i beklemesi durumudur. VTYS birini kurban (victim) seçerek çözer.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction - Deadlock (Kilitlenme)",
            "keyTakeaway": "SQL İleri Seviye Soru #42 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000042
    },
    {
        "id": "q_sql_43",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(43) [SQL Security - SQL Injection] SQL Injection (SQL Enjeksiyonu) saldırılarını veritabanı uygulama seviyesinde tamamen engellemenin en etkili ve standart yöntemi nedir?",
        "options": [
            {
                "id": "A",
                "text": "Tüm sorguları büyük harfe çevirmek",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sadece GET istekleri kullanmak",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Parametreli Sorgular (Prepared Statements / Parameterized Queries) kullanmak",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Girdileri tırnak işaretlerinden arındırmak",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Prepared Statements (Parametreli Sorgular), kullanıcı girdisini SQL komut kodundan ayırarak veri olarak işler ve SQL Injection'ı %100 engeller.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SQL Security - SQL Injection",
            "keyTakeaway": "SQL İleri Seviye Soru #43 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000043
    },
    {
        "id": "q_sql_44",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(44) [Database Normalization - 3NF] Üçüncü Normal Form (3NF) şartı aşağıdakilerden hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tablonun 2NF'de olması ve birincil anahtara geçişli (transitive) bağımlılığın olmaması",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Foreign key bulunmaması",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tabloda tekrarlayan sütunların olmaması",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Tüm alanların atomik olması",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "3NF kuralı: Tablo 2NF olmalı ve birincil anahtar olmayan bir alan, başka bir birincil anahtar olmayan alana bağımlı olmamalıdır (No Transitive Dependency).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - 3NF",
            "keyTakeaway": "SQL İleri Seviye Soru #44 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000044
    },
    {
        "id": "q_sql_45",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(45) [Database Normalization - BCNF] Boyce-Codd Normal Form (BCNF), 3NF'den farklı olarak hangi ekstra kuralı zorunlu kılar?",
        "options": [
            {
                "id": "A",
                "text": "Tüm sütunların sayısal olması kuralı",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "En fazla 5 sütun bulunabilmesi kuralı",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Her determinantın (belirleyicinin) mutlaka bir aday anahtar (candidate key) olması kuralı",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Tabloda hiç NULL değer bulunmaması kuralı",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "BCNF, 3NF'nin daha katı bir halidir. Her X -> Y bağımlılığında X'in mutlaka bir Super Key / Candidate Key olmasını şart koşar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - BCNF",
            "keyTakeaway": "SQL İleri Seviye Soru #45 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000045
    },
    {
        "id": "q_sql_46",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(46) [Constraint - CHECK Constraint] Bir tablodaki `yas` sütununa sadece 18 ve üzeri değerlerin girilebilmesini sağlayan kısıtlama (constraint) hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "UNIQUE (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "DEFAULT (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "CHECK (yas >= 18)",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "FOREIGN KEY (yas >= 18)",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "CHECK kısıtlaması bir sütuna girilebilecek verilerin belirli bir mantıksal koşula (Boolean expression) uymasını zorunlu kılar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Constraint - CHECK Constraint",
            "keyTakeaway": "SQL İleri Seviye Soru #46 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000046
    },
    {
        "id": "q_sql_47",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(47) [Storage - CTE vs Temporary Table] Common Table Expression (CTE) ile Geçici Tablo (Temporary Table) arasındaki temel fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "CTE diskte yer kaplar, Temporary Table kaplamaz.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "CTE hafızada sadece ilgili sorgu süresince var olan mantıksal bir görünümdür; Temporary Table ise tempdb/oturum içinde fiziksel olarak oluşturulur ve indekslenebilir.",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "CTE sadece PostgreSQL'de vardır.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Temporary Table silinemez.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "CTE tek bir sorgunun çalışma anı (scope) boyunca geçerli mantıksal yapıdır. Temporary Table ise oturum kapanana kadar tempdb'de fiziksel yaşar ve indekslenebilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Storage - CTE vs Temporary Table",
            "keyTakeaway": "SQL İleri Seviye Soru #47 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000047
    },
    {
        "id": "q_sql_48",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(48) [Query Optimization - SARGABLE Queries] SARGABLE (Search Argument Able) sorgu ifadesi ne anlama gelir?",
        "options": [
            {
                "id": "A",
                "text": "Sorgudaki WHERE koşulunun indeksleri etkin bir şekilde kullanabilecek biçimde yazılmış olması",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Sorgunun sonucunun bellekte saklanması",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sorgunun otomatik olarak paralelleştirilmesi",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Sorguda grafik çizilmesi",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "SARGABLE sorgular, indeksli sütunların üzerinde fonksiyon veya tip dönüşümü yapılmadan yazıldığı için VTYS'nin Index Seek yapabilmesine olanak tanır.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Query Optimization - SARGABLE Queries",
            "keyTakeaway": "SQL İleri Seviye Soru #48 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000048
    },
    {
        "id": "q_sql_49",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(49) [Subquery - Scalar Subquery] Scalar Subquery (Skaler Alt Sorgu) ne tür bir sonuç döndürür?",
        "options": [
            {
                "id": "A",
                "text": "Tam olarak 1 satır ve 1 sütundan oluşan tek bir değer",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Sadece Boolean (TRUE/FALSE) değer",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sadece dizi (Array) verisi",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Bir tablo dolusu satır ve sütun",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Scalar subquery tek bir hücre (1 satır × 1 sütun) değer döndüren sorgudur. Bu yüzden SELECT listesinde veya matematiksel ifadelerde kullanılabilir.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Subquery - Scalar Subquery",
            "keyTakeaway": "SQL İleri Seviye Soru #49 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000049
    },
    {
        "id": "q_sql_50",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(50) [JSON Data in SQL - JSON_EXTRACT / ->>] Modern ilişkisel veritabanlarında (PostgreSQL, MySQL vb.) saklanan JSON verisinden bir alanı metin (text) olarak çekmek için hangi operatör/fonksiyon kullanılır?",
        "options": [
            {
                "id": "A",
                "text": "SUM()",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "STRING_SPLIT()",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "GROUP_CONCAT()",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "PostgreSQL'de ->> operatörü / JSON_EXTRACT_TEXT",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "JSON alanlarından metin değeri çekmek için PostgreSQL'de `->>` operatörü, MySQL/SQLite'ta `JSON_EXTRACT()` veya `->>` kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: JSON Data in SQL - JSON_EXTRACT / ->>",
            "keyTakeaway": "SQL İleri Seviye Soru #50 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000050
    },
    {
        "id": "q_sql_51",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(51) [Index - Partial / Filtered Index] Sadece belirli bir koşulu sağlayan satırlar için oluşturulan indekse (Örn: WHERE silindi = FALSE) ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Bitmap Index",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Global Index",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Clustered Index",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Filtered Index (Kısmi / Filtrelenmiş İndeks)",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Filtered Index (Partial Index), tablonun tamamı yerine sadece WHERE koşuluna uyan satırları indeksleyerek disk alanı ve bakım maliyetinden tasarruf sağlar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index - Partial / Filtered Index",
            "keyTakeaway": "SQL İleri Seviye Soru #51 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000051
    },
    {
        "id": "q_sql_52",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(52) [Transaction - Deadlock (Kilitlenme)] İki farklı transaction'ın birbirinin kilitlediği kaynakları karşılıklı olarak beklemesi sonucu oluşan kilitlenmeye ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Livelock",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Latch",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Deadlock (Ölümcül Kilitlenme)",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Starvation",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Deadlock, Transaction A'nın Kaynak 1'i kilitleyip Kaynak 2'yi beklemesi, Transaction B'nin ise Kaynak 2'yi kilitleyip Kaynak 1'i beklemesi durumudur. VTYS birini kurban (victim) seçerek çözer.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction - Deadlock (Kilitlenme)",
            "keyTakeaway": "SQL İleri Seviye Soru #52 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000052
    },
    {
        "id": "q_sql_53",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(53) [SQL Security - SQL Injection] SQL Injection (SQL Enjeksiyonu) saldırılarını veritabanı uygulama seviyesinde tamamen engellemenin en etkili ve standart yöntemi nedir?",
        "options": [
            {
                "id": "A",
                "text": "Tüm sorguları büyük harfe çevirmek",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Parametreli Sorgular (Prepared Statements / Parameterized Queries) kullanmak",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Girdileri tırnak işaretlerinden arındırmak",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Sadece GET istekleri kullanmak",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Prepared Statements (Parametreli Sorgular), kullanıcı girdisini SQL komut kodundan ayırarak veri olarak işler ve SQL Injection'ı %100 engeller.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SQL Security - SQL Injection",
            "keyTakeaway": "SQL İleri Seviye Soru #53 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000053
    },
    {
        "id": "q_sql_54",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(54) [Database Normalization - 3NF] Üçüncü Normal Form (3NF) şartı aşağıdakilerden hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tüm alanların atomik olması",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Foreign key bulunmaması",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tabloda tekrarlayan sütunların olmaması",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Tablonun 2NF'de olması ve birincil anahtara geçişli (transitive) bağımlılığın olmaması",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "3NF kuralı: Tablo 2NF olmalı ve birincil anahtar olmayan bir alan, başka bir birincil anahtar olmayan alana bağımlı olmamalıdır (No Transitive Dependency).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - 3NF",
            "keyTakeaway": "SQL İleri Seviye Soru #54 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000054
    },
    {
        "id": "q_sql_55",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(55) [Database Normalization - BCNF] Boyce-Codd Normal Form (BCNF), 3NF'den farklı olarak hangi ekstra kuralı zorunlu kılar?",
        "options": [
            {
                "id": "A",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Her determinantın (belirleyicinin) mutlaka bir aday anahtar (candidate key) olması kuralı",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "En fazla 5 sütun bulunabilmesi kuralı",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tüm sütunların sayısal olması kuralı",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Tabloda hiç NULL değer bulunmaması kuralı",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "BCNF, 3NF'nin daha katı bir halidir. Her X -> Y bağımlılığında X'in mutlaka bir Super Key / Candidate Key olmasını şart koşar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - BCNF",
            "keyTakeaway": "SQL İleri Seviye Soru #55 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000055
    },
    {
        "id": "q_sql_56",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(56) [Constraint - CHECK Constraint] Bir tablodaki `yas` sütununa sadece 18 ve üzeri değerlerin girilebilmesini sağlayan kısıtlama (constraint) hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "FOREIGN KEY (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "DEFAULT (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "UNIQUE (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "CHECK (yas >= 18)",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "CHECK kısıtlaması bir sütuna girilebilecek verilerin belirli bir mantıksal koşula (Boolean expression) uymasını zorunlu kılar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Constraint - CHECK Constraint",
            "keyTakeaway": "SQL İleri Seviye Soru #56 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000056
    },
    {
        "id": "q_sql_57",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(57) [Storage - CTE vs Temporary Table] Common Table Expression (CTE) ile Geçici Tablo (Temporary Table) arasındaki temel fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "CTE hafızada sadece ilgili sorgu süresince var olan mantıksal bir görünümdür; Temporary Table ise tempdb/oturum içinde fiziksel olarak oluşturulur ve indekslenebilir.",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Temporary Table silinemez.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "CTE diskte yer kaplar, Temporary Table kaplamaz.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "CTE sadece PostgreSQL'de vardır.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "CTE tek bir sorgunun çalışma anı (scope) boyunca geçerli mantıksal yapıdır. Temporary Table ise oturum kapanana kadar tempdb'de fiziksel yaşar ve indekslenebilir.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Storage - CTE vs Temporary Table",
            "keyTakeaway": "SQL İleri Seviye Soru #57 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000057
    },
    {
        "id": "q_sql_58",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(58) [Query Optimization - SARGABLE Queries] SARGABLE (Search Argument Able) sorgu ifadesi ne anlama gelir?",
        "options": [
            {
                "id": "A",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sorgudaki WHERE koşulunun indeksleri etkin bir şekilde kullanabilecek biçimde yazılmış olması",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Sorgunun sonucunun bellekte saklanması",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Sorguda grafik çizilmesi",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Sorgunun otomatik olarak paralelleştirilmesi",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "SARGABLE sorgular, indeksli sütunların üzerinde fonksiyon veya tip dönüşümü yapılmadan yazıldığı için VTYS'nin Index Seek yapabilmesine olanak tanır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Query Optimization - SARGABLE Queries",
            "keyTakeaway": "SQL İleri Seviye Soru #58 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000058
    },
    {
        "id": "q_sql_59",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(59) [Subquery - Scalar Subquery] Scalar Subquery (Skaler Alt Sorgu) ne tür bir sonuç döndürür?",
        "options": [
            {
                "id": "A",
                "text": "Tam olarak 1 satır ve 1 sütundan oluşan tek bir değer",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sadece Boolean (TRUE/FALSE) değer",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Sadece dizi (Array) verisi",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Bir tablo dolusu satır ve sütun",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Scalar subquery tek bir hücre (1 satır × 1 sütun) değer döndüren sorgudur. Bu yüzden SELECT listesinde veya matematiksel ifadelerde kullanılabilir.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Subquery - Scalar Subquery",
            "keyTakeaway": "SQL İleri Seviye Soru #59 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000059
    },
    {
        "id": "q_sql_60",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(60) [JSON Data in SQL - JSON_EXTRACT / ->>] Modern ilişkisel veritabanlarında (PostgreSQL, MySQL vb.) saklanan JSON verisinden bir alanı metin (text) olarak çekmek için hangi operatör/fonksiyon kullanılır?",
        "options": [
            {
                "id": "A",
                "text": "GROUP_CONCAT()",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "SUM()",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "PostgreSQL'de ->> operatörü / JSON_EXTRACT_TEXT",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "STRING_SPLIT()",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "JSON alanlarından metin değeri çekmek için PostgreSQL'de `->>` operatörü, MySQL/SQLite'ta `JSON_EXTRACT()` veya `->>` kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: JSON Data in SQL - JSON_EXTRACT / ->>",
            "keyTakeaway": "SQL İleri Seviye Soru #60 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000060
    },
    {
        "id": "q_sql_61",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(61) [Index - Partial / Filtered Index] Sadece belirli bir koşulu sağlayan satırlar için oluşturulan indekse (Örn: WHERE silindi = FALSE) ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Filtered Index (Kısmi / Filtrelenmiş İndeks)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Bitmap Index",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Clustered Index",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Global Index",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Filtered Index (Partial Index), tablonun tamamı yerine sadece WHERE koşuluna uyan satırları indeksleyerek disk alanı ve bakım maliyetinden tasarruf sağlar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index - Partial / Filtered Index",
            "keyTakeaway": "SQL İleri Seviye Soru #61 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000061
    },
    {
        "id": "q_sql_62",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(62) [Transaction - Deadlock (Kilitlenme)] İki farklı transaction'ın birbirinin kilitlediği kaynakları karşılıklı olarak beklemesi sonucu oluşan kilitlenmeye ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Livelock",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Starvation",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Latch",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Deadlock (Ölümcül Kilitlenme)",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Deadlock, Transaction A'nın Kaynak 1'i kilitleyip Kaynak 2'yi beklemesi, Transaction B'nin ise Kaynak 2'yi kilitleyip Kaynak 1'i beklemesi durumudur. VTYS birini kurban (victim) seçerek çözer.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction - Deadlock (Kilitlenme)",
            "keyTakeaway": "SQL İleri Seviye Soru #62 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000062
    },
    {
        "id": "q_sql_63",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(63) [SQL Security - SQL Injection] SQL Injection (SQL Enjeksiyonu) saldırılarını veritabanı uygulama seviyesinde tamamen engellemenin en etkili ve standart yöntemi nedir?",
        "options": [
            {
                "id": "A",
                "text": "Sadece GET istekleri kullanmak",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Girdileri tırnak işaretlerinden arındırmak",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Parametreli Sorgular (Prepared Statements / Parameterized Queries) kullanmak",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Tüm sorguları büyük harfe çevirmek",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Prepared Statements (Parametreli Sorgular), kullanıcı girdisini SQL komut kodundan ayırarak veri olarak işler ve SQL Injection'ı %100 engeller.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SQL Security - SQL Injection",
            "keyTakeaway": "SQL İleri Seviye Soru #63 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000063
    },
    {
        "id": "q_sql_64",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(64) [Database Normalization - 3NF] Üçüncü Normal Form (3NF) şartı aşağıdakilerden hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "Tüm alanların atomik olması",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tabloda tekrarlayan sütunların olmaması",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Foreign key bulunmaması",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tablonun 2NF'de olması ve birincil anahtara geçişli (transitive) bağımlılığın olmaması",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "3NF kuralı: Tablo 2NF olmalı ve birincil anahtar olmayan bir alan, başka bir birincil anahtar olmayan alana bağımlı olmamalıdır (No Transitive Dependency).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - 3NF",
            "keyTakeaway": "SQL İleri Seviye Soru #64 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000064
    },
    {
        "id": "q_sql_65",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(65) [Database Normalization - BCNF] Boyce-Codd Normal Form (BCNF), 3NF'den farklı olarak hangi ekstra kuralı zorunlu kılar?",
        "options": [
            {
                "id": "A",
                "text": "En fazla 5 sütun bulunabilmesi kuralı",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Her determinantın (belirleyicinin) mutlaka bir aday anahtar (candidate key) olması kuralı",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Tabloda hiç NULL değer bulunmaması kuralı",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Tüm sütunların sayısal olması kuralı",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "BCNF, 3NF'nin daha katı bir halidir. Her X -> Y bağımlılığında X'in mutlaka bir Super Key / Candidate Key olmasını şart koşar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - BCNF",
            "keyTakeaway": "SQL İleri Seviye Soru #65 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000065
    },
    {
        "id": "q_sql_66",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(66) [Constraint - CHECK Constraint] Bir tablodaki `yas` sütununa sadece 18 ve üzeri değerlerin girilebilmesini sağlayan kısıtlama (constraint) hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "FOREIGN KEY (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "DEFAULT (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "UNIQUE (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "CHECK (yas >= 18)",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "CHECK kısıtlaması bir sütuna girilebilecek verilerin belirli bir mantıksal koşula (Boolean expression) uymasını zorunlu kılar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Constraint - CHECK Constraint",
            "keyTakeaway": "SQL İleri Seviye Soru #66 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000066
    },
    {
        "id": "q_sql_67",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(67) [Storage - CTE vs Temporary Table] Common Table Expression (CTE) ile Geçici Tablo (Temporary Table) arasındaki temel fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "CTE hafızada sadece ilgili sorgu süresince var olan mantıksal bir görünümdür; Temporary Table ise tempdb/oturum içinde fiziksel olarak oluşturulur ve indekslenebilir.",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Temporary Table silinemez.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "CTE sadece PostgreSQL'de vardır.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "CTE diskte yer kaplar, Temporary Table kaplamaz.",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "CTE tek bir sorgunun çalışma anı (scope) boyunca geçerli mantıksal yapıdır. Temporary Table ise oturum kapanana kadar tempdb'de fiziksel yaşar ve indekslenebilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Storage - CTE vs Temporary Table",
            "keyTakeaway": "SQL İleri Seviye Soru #67 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000067
    },
    {
        "id": "q_sql_68",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(68) [Query Optimization - SARGABLE Queries] SARGABLE (Search Argument Able) sorgu ifadesi ne anlama gelir?",
        "options": [
            {
                "id": "A",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sorgunun sonucunun bellekte saklanması",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sorguda grafik çizilmesi",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Sorgunun otomatik olarak paralelleştirilmesi",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Sorgudaki WHERE koşulunun indeksleri etkin bir şekilde kullanabilecek biçimde yazılmış olması",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "SARGABLE sorgular, indeksli sütunların üzerinde fonksiyon veya tip dönüşümü yapılmadan yazıldığı için VTYS'nin Index Seek yapabilmesine olanak tanır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Query Optimization - SARGABLE Queries",
            "keyTakeaway": "SQL İleri Seviye Soru #68 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000068
    },
    {
        "id": "q_sql_69",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(69) [Subquery - Scalar Subquery] Scalar Subquery (Skaler Alt Sorgu) ne tür bir sonuç döndürür?",
        "options": [
            {
                "id": "A",
                "text": "Sadece dizi (Array) verisi",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tam olarak 1 satır ve 1 sütundan oluşan tek bir değer",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Bir tablo dolusu satır ve sütun",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Sadece Boolean (TRUE/FALSE) değer",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Scalar subquery tek bir hücre (1 satır × 1 sütun) değer döndüren sorgudur. Bu yüzden SELECT listesinde veya matematiksel ifadelerde kullanılabilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Subquery - Scalar Subquery",
            "keyTakeaway": "SQL İleri Seviye Soru #69 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000069
    },
    {
        "id": "q_sql_70",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(70) [JSON Data in SQL - JSON_EXTRACT / ->>] Modern ilişkisel veritabanlarında (PostgreSQL, MySQL vb.) saklanan JSON verisinden bir alanı metin (text) olarak çekmek için hangi operatör/fonksiyon kullanılır?",
        "options": [
            {
                "id": "A",
                "text": "PostgreSQL'de ->> operatörü / JSON_EXTRACT_TEXT",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "SUM()",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "STRING_SPLIT()",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "GROUP_CONCAT()",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "JSON alanlarından metin değeri çekmek için PostgreSQL'de `->>` operatörü, MySQL/SQLite'ta `JSON_EXTRACT()` veya `->>` kullanılır.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: JSON Data in SQL - JSON_EXTRACT / ->>",
            "keyTakeaway": "SQL İleri Seviye Soru #70 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000070
    },
    {
        "id": "q_sql_71",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(71) [Index - Partial / Filtered Index] Sadece belirli bir koşulu sağlayan satırlar için oluşturulan indekse (Örn: WHERE silindi = FALSE) ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Clustered Index",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Bitmap Index",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Filtered Index (Kısmi / Filtrelenmiş İndeks)",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Global Index",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Filtered Index (Partial Index), tablonun tamamı yerine sadece WHERE koşuluna uyan satırları indeksleyerek disk alanı ve bakım maliyetinden tasarruf sağlar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index - Partial / Filtered Index",
            "keyTakeaway": "SQL İleri Seviye Soru #71 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000071
    },
    {
        "id": "q_sql_72",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(72) [Transaction - Deadlock (Kilitlenme)] İki farklı transaction'ın birbirinin kilitlediği kaynakları karşılıklı olarak beklemesi sonucu oluşan kilitlenmeye ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Deadlock (Ölümcül Kilitlenme)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Starvation",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Livelock",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Latch",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Deadlock, Transaction A'nın Kaynak 1'i kilitleyip Kaynak 2'yi beklemesi, Transaction B'nin ise Kaynak 2'yi kilitleyip Kaynak 1'i beklemesi durumudur. VTYS birini kurban (victim) seçerek çözer.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction - Deadlock (Kilitlenme)",
            "keyTakeaway": "SQL İleri Seviye Soru #72 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000072
    },
    {
        "id": "q_sql_73",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(73) [SQL Security - SQL Injection] SQL Injection (SQL Enjeksiyonu) saldırılarını veritabanı uygulama seviyesinde tamamen engellemenin en etkili ve standart yöntemi nedir?",
        "options": [
            {
                "id": "A",
                "text": "Tüm sorguları büyük harfe çevirmek",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Parametreli Sorgular (Prepared Statements / Parameterized Queries) kullanmak",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Girdileri tırnak işaretlerinden arındırmak",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Sadece GET istekleri kullanmak",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Prepared Statements (Parametreli Sorgular), kullanıcı girdisini SQL komut kodundan ayırarak veri olarak işler ve SQL Injection'ı %100 engeller.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SQL Security - SQL Injection",
            "keyTakeaway": "SQL İleri Seviye Soru #73 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000073
    },
    {
        "id": "q_sql_74",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(74) [Database Normalization - 3NF] Üçüncü Normal Form (3NF) şartı aşağıdakilerden hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "Tablonun 2NF'de olması ve birincil anahtara geçişli (transitive) bağımlılığın olmaması",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Foreign key bulunmaması",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tüm alanların atomik olması",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Tabloda tekrarlayan sütunların olmaması",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "3NF kuralı: Tablo 2NF olmalı ve birincil anahtar olmayan bir alan, başka bir birincil anahtar olmayan alana bağımlı olmamalıdır (No Transitive Dependency).",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - 3NF",
            "keyTakeaway": "SQL İleri Seviye Soru #74 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000074
    },
    {
        "id": "q_sql_75",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(75) [Database Normalization - BCNF] Boyce-Codd Normal Form (BCNF), 3NF'den farklı olarak hangi ekstra kuralı zorunlu kılar?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda hiç NULL değer bulunmaması kuralı",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "En fazla 5 sütun bulunabilmesi kuralı",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tüm sütunların sayısal olması kuralı",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Her determinantın (belirleyicinin) mutlaka bir aday anahtar (candidate key) olması kuralı",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "BCNF, 3NF'nin daha katı bir halidir. Her X -> Y bağımlılığında X'in mutlaka bir Super Key / Candidate Key olmasını şart koşar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - BCNF",
            "keyTakeaway": "SQL İleri Seviye Soru #75 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000075
    },
    {
        "id": "q_sql_76",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(76) [Constraint - CHECK Constraint] Bir tablodaki `yas` sütununa sadece 18 ve üzeri değerlerin girilebilmesini sağlayan kısıtlama (constraint) hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "FOREIGN KEY (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "UNIQUE (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "CHECK (yas >= 18)",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "DEFAULT (yas >= 18)",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "CHECK kısıtlaması bir sütuna girilebilecek verilerin belirli bir mantıksal koşula (Boolean expression) uymasını zorunlu kılar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Constraint - CHECK Constraint",
            "keyTakeaway": "SQL İleri Seviye Soru #76 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000076
    },
    {
        "id": "q_sql_77",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(77) [Storage - CTE vs Temporary Table] Common Table Expression (CTE) ile Geçici Tablo (Temporary Table) arasındaki temel fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "CTE diskte yer kaplar, Temporary Table kaplamaz.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "CTE sadece PostgreSQL'de vardır.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Temporary Table silinemez.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "CTE hafızada sadece ilgili sorgu süresince var olan mantıksal bir görünümdür; Temporary Table ise tempdb/oturum içinde fiziksel olarak oluşturulur ve indekslenebilir.",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "CTE tek bir sorgunun çalışma anı (scope) boyunca geçerli mantıksal yapıdır. Temporary Table ise oturum kapanana kadar tempdb'de fiziksel yaşar ve indekslenebilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Storage - CTE vs Temporary Table",
            "keyTakeaway": "SQL İleri Seviye Soru #77 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000077
    },
    {
        "id": "q_sql_78",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(78) [Query Optimization - SARGABLE Queries] SARGABLE (Search Argument Able) sorgu ifadesi ne anlama gelir?",
        "options": [
            {
                "id": "A",
                "text": "Sorguda grafik çizilmesi",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sorgudaki WHERE koşulunun indeksleri etkin bir şekilde kullanabilecek biçimde yazılmış olması",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Sorgunun sonucunun bellekte saklanması",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Sorgunun otomatik olarak paralelleştirilmesi",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "SARGABLE sorgular, indeksli sütunların üzerinde fonksiyon veya tip dönüşümü yapılmadan yazıldığı için VTYS'nin Index Seek yapabilmesine olanak tanır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Query Optimization - SARGABLE Queries",
            "keyTakeaway": "SQL İleri Seviye Soru #78 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000078
    },
    {
        "id": "q_sql_79",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(79) [Subquery - Scalar Subquery] Scalar Subquery (Skaler Alt Sorgu) ne tür bir sonuç döndürür?",
        "options": [
            {
                "id": "A",
                "text": "Sadece Boolean (TRUE/FALSE) değer",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tam olarak 1 satır ve 1 sütundan oluşan tek bir değer",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Bir tablo dolusu satır ve sütun",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Sadece dizi (Array) verisi",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Scalar subquery tek bir hücre (1 satır × 1 sütun) değer döndüren sorgudur. Bu yüzden SELECT listesinde veya matematiksel ifadelerde kullanılabilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Subquery - Scalar Subquery",
            "keyTakeaway": "SQL İleri Seviye Soru #79 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000079
    },
    {
        "id": "q_sql_80",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(80) [JSON Data in SQL - JSON_EXTRACT / ->>] Modern ilişkisel veritabanlarında (PostgreSQL, MySQL vb.) saklanan JSON verisinden bir alanı metin (text) olarak çekmek için hangi operatör/fonksiyon kullanılır?",
        "options": [
            {
                "id": "A",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "PostgreSQL'de ->> operatörü / JSON_EXTRACT_TEXT",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "GROUP_CONCAT()",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "STRING_SPLIT()",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "SUM()",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "JSON alanlarından metin değeri çekmek için PostgreSQL'de `->>` operatörü, MySQL/SQLite'ta `JSON_EXTRACT()` veya `->>` kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: JSON Data in SQL - JSON_EXTRACT / ->>",
            "keyTakeaway": "SQL İleri Seviye Soru #80 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000080
    },
    {
        "id": "q_sql_81",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(81) [Index - Partial / Filtered Index] Sadece belirli bir koşulu sağlayan satırlar için oluşturulan indekse (Örn: WHERE silindi = FALSE) ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Bitmap Index",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Filtered Index (Kısmi / Filtrelenmiş İndeks)",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Global Index",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Clustered Index",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Filtered Index (Partial Index), tablonun tamamı yerine sadece WHERE koşuluna uyan satırları indeksleyerek disk alanı ve bakım maliyetinden tasarruf sağlar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index - Partial / Filtered Index",
            "keyTakeaway": "SQL İleri Seviye Soru #81 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000081
    },
    {
        "id": "q_sql_82",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(82) [Transaction - Deadlock (Kilitlenme)] İki farklı transaction'ın birbirinin kilitlediği kaynakları karşılıklı olarak beklemesi sonucu oluşan kilitlenmeye ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Livelock",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Deadlock (Ölümcül Kilitlenme)",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Latch",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Starvation",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Deadlock, Transaction A'nın Kaynak 1'i kilitleyip Kaynak 2'yi beklemesi, Transaction B'nin ise Kaynak 2'yi kilitleyip Kaynak 1'i beklemesi durumudur. VTYS birini kurban (victim) seçerek çözer.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction - Deadlock (Kilitlenme)",
            "keyTakeaway": "SQL İleri Seviye Soru #82 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000082
    },
    {
        "id": "q_sql_83",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(83) [SQL Security - SQL Injection] SQL Injection (SQL Enjeksiyonu) saldırılarını veritabanı uygulama seviyesinde tamamen engellemenin en etkili ve standart yöntemi nedir?",
        "options": [
            {
                "id": "A",
                "text": "Parametreli Sorgular (Prepared Statements / Parameterized Queries) kullanmak",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Tüm sorguları büyük harfe çevirmek",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sadece GET istekleri kullanmak",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Girdileri tırnak işaretlerinden arındırmak",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Prepared Statements (Parametreli Sorgular), kullanıcı girdisini SQL komut kodundan ayırarak veri olarak işler ve SQL Injection'ı %100 engeller.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SQL Security - SQL Injection",
            "keyTakeaway": "SQL İleri Seviye Soru #83 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000083
    },
    {
        "id": "q_sql_84",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(84) [Database Normalization - 3NF] Üçüncü Normal Form (3NF) şartı aşağıdakilerden hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tabloda tekrarlayan sütunların olmaması",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Tablonun 2NF'de olması ve birincil anahtara geçişli (transitive) bağımlılığın olmaması",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Foreign key bulunmaması",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Tüm alanların atomik olması",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "3NF kuralı: Tablo 2NF olmalı ve birincil anahtar olmayan bir alan, başka bir birincil anahtar olmayan alana bağımlı olmamalıdır (No Transitive Dependency).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - 3NF",
            "keyTakeaway": "SQL İleri Seviye Soru #84 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000084
    },
    {
        "id": "q_sql_85",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(85) [Database Normalization - BCNF] Boyce-Codd Normal Form (BCNF), 3NF'den farklı olarak hangi ekstra kuralı zorunlu kılar?",
        "options": [
            {
                "id": "A",
                "text": "Her determinantın (belirleyicinin) mutlaka bir aday anahtar (candidate key) olması kuralı",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "En fazla 5 sütun bulunabilmesi kuralı",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Tüm sütunların sayısal olması kuralı",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tabloda hiç NULL değer bulunmaması kuralı",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "BCNF, 3NF'nin daha katı bir halidir. Her X -> Y bağımlılığında X'in mutlaka bir Super Key / Candidate Key olmasını şart koşar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - BCNF",
            "keyTakeaway": "SQL İleri Seviye Soru #85 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000085
    },
    {
        "id": "q_sql_86",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(86) [Constraint - CHECK Constraint] Bir tablodaki `yas` sütununa sadece 18 ve üzeri değerlerin girilebilmesini sağlayan kısıtlama (constraint) hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "UNIQUE (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "FOREIGN KEY (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "DEFAULT (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "CHECK (yas >= 18)",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "CHECK kısıtlaması bir sütuna girilebilecek verilerin belirli bir mantıksal koşula (Boolean expression) uymasını zorunlu kılar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Constraint - CHECK Constraint",
            "keyTakeaway": "SQL İleri Seviye Soru #86 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000086
    },
    {
        "id": "q_sql_87",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(87) [Storage - CTE vs Temporary Table] Common Table Expression (CTE) ile Geçici Tablo (Temporary Table) arasındaki temel fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "CTE diskte yer kaplar, Temporary Table kaplamaz.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "CTE sadece PostgreSQL'de vardır.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "CTE hafızada sadece ilgili sorgu süresince var olan mantıksal bir görünümdür; Temporary Table ise tempdb/oturum içinde fiziksel olarak oluşturulur ve indekslenebilir.",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Temporary Table silinemez.",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "CTE tek bir sorgunun çalışma anı (scope) boyunca geçerli mantıksal yapıdır. Temporary Table ise oturum kapanana kadar tempdb'de fiziksel yaşar ve indekslenebilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Storage - CTE vs Temporary Table",
            "keyTakeaway": "SQL İleri Seviye Soru #87 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000087
    },
    {
        "id": "q_sql_88",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(88) [Query Optimization - SARGABLE Queries] SARGABLE (Search Argument Able) sorgu ifadesi ne anlama gelir?",
        "options": [
            {
                "id": "A",
                "text": "Sorguda grafik çizilmesi",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sorgunun sonucunun bellekte saklanması",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Sorgunun otomatik olarak paralelleştirilmesi",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Sorgudaki WHERE koşulunun indeksleri etkin bir şekilde kullanabilecek biçimde yazılmış olması",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "SARGABLE sorgular, indeksli sütunların üzerinde fonksiyon veya tip dönüşümü yapılmadan yazıldığı için VTYS'nin Index Seek yapabilmesine olanak tanır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Query Optimization - SARGABLE Queries",
            "keyTakeaway": "SQL İleri Seviye Soru #88 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000088
    },
    {
        "id": "q_sql_89",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(89) [Subquery - Scalar Subquery] Scalar Subquery (Skaler Alt Sorgu) ne tür bir sonuç döndürür?",
        "options": [
            {
                "id": "A",
                "text": "Bir tablo dolusu satır ve sütun",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tam olarak 1 satır ve 1 sütundan oluşan tek bir değer",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Sadece dizi (Array) verisi",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Sadece Boolean (TRUE/FALSE) değer",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Scalar subquery tek bir hücre (1 satır × 1 sütun) değer döndüren sorgudur. Bu yüzden SELECT listesinde veya matematiksel ifadelerde kullanılabilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Subquery - Scalar Subquery",
            "keyTakeaway": "SQL İleri Seviye Soru #89 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000089
    },
    {
        "id": "q_sql_90",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(90) [JSON Data in SQL - JSON_EXTRACT / ->>] Modern ilişkisel veritabanlarında (PostgreSQL, MySQL vb.) saklanan JSON verisinden bir alanı metin (text) olarak çekmek için hangi operatör/fonksiyon kullanılır?",
        "options": [
            {
                "id": "A",
                "text": "SUM()",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "STRING_SPLIT()",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "GROUP_CONCAT()",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "PostgreSQL'de ->> operatörü / JSON_EXTRACT_TEXT",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "JSON alanlarından metin değeri çekmek için PostgreSQL'de `->>` operatörü, MySQL/SQLite'ta `JSON_EXTRACT()` veya `->>` kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: JSON Data in SQL - JSON_EXTRACT / ->>",
            "keyTakeaway": "SQL İleri Seviye Soru #90 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000090
    },
    {
        "id": "q_sql_91",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(91) [Index - Partial / Filtered Index] Sadece belirli bir koşulu sağlayan satırlar için oluşturulan indekse (Örn: WHERE silindi = FALSE) ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Bitmap Index",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Clustered Index",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Filtered Index (Kısmi / Filtrelenmiş İndeks)",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Global Index",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Filtered Index (Partial Index), tablonun tamamı yerine sadece WHERE koşuluna uyan satırları indeksleyerek disk alanı ve bakım maliyetinden tasarruf sağlar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index - Partial / Filtered Index",
            "keyTakeaway": "SQL İleri Seviye Soru #91 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000091
    },
    {
        "id": "q_sql_92",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(92) [Transaction - Deadlock (Kilitlenme)] İki farklı transaction'ın birbirinin kilitlediği kaynakları karşılıklı olarak beklemesi sonucu oluşan kilitlenmeye ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Starvation",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Latch",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Livelock",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Deadlock (Ölümcül Kilitlenme)",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Deadlock, Transaction A'nın Kaynak 1'i kilitleyip Kaynak 2'yi beklemesi, Transaction B'nin ise Kaynak 2'yi kilitleyip Kaynak 1'i beklemesi durumudur. VTYS birini kurban (victim) seçerek çözer.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction - Deadlock (Kilitlenme)",
            "keyTakeaway": "SQL İleri Seviye Soru #92 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000092
    },
    {
        "id": "q_sql_93",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(93) [SQL Security - SQL Injection] SQL Injection (SQL Enjeksiyonu) saldırılarını veritabanı uygulama seviyesinde tamamen engellemenin en etkili ve standart yöntemi nedir?",
        "options": [
            {
                "id": "A",
                "text": "Parametreli Sorgular (Prepared Statements / Parameterized Queries) kullanmak",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Sadece GET istekleri kullanmak",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Girdileri tırnak işaretlerinden arındırmak",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tüm sorguları büyük harfe çevirmek",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Prepared Statements (Parametreli Sorgular), kullanıcı girdisini SQL komut kodundan ayırarak veri olarak işler ve SQL Injection'ı %100 engeller.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SQL Security - SQL Injection",
            "keyTakeaway": "SQL İleri Seviye Soru #93 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000093
    },
    {
        "id": "q_sql_94",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(94) [Database Normalization - 3NF] Üçüncü Normal Form (3NF) şartı aşağıdakilerden hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "Tablonun 2NF'de olması ve birincil anahtara geçişli (transitive) bağımlılığın olmaması",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Tüm alanların atomik olması",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Foreign key bulunmaması",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Tabloda tekrarlayan sütunların olmaması",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "3NF kuralı: Tablo 2NF olmalı ve birincil anahtar olmayan bir alan, başka bir birincil anahtar olmayan alana bağımlı olmamalıdır (No Transitive Dependency).",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - 3NF",
            "keyTakeaway": "SQL İleri Seviye Soru #94 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000094
    },
    {
        "id": "q_sql_95",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(95) [Database Normalization - BCNF] Boyce-Codd Normal Form (BCNF), 3NF'den farklı olarak hangi ekstra kuralı zorunlu kılar?",
        "options": [
            {
                "id": "A",
                "text": "Tüm sütunların sayısal olması kuralı",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "En fazla 5 sütun bulunabilmesi kuralı",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tabloda hiç NULL değer bulunmaması kuralı",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Her determinantın (belirleyicinin) mutlaka bir aday anahtar (candidate key) olması kuralı",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "BCNF, 3NF'nin daha katı bir halidir. Her X -> Y bağımlılığında X'in mutlaka bir Super Key / Candidate Key olmasını şart koşar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - BCNF",
            "keyTakeaway": "SQL İleri Seviye Soru #95 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000095
    },
    {
        "id": "q_sql_96",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(96) [Constraint - CHECK Constraint] Bir tablodaki `yas` sütununa sadece 18 ve üzeri değerlerin girilebilmesini sağlayan kısıtlama (constraint) hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "UNIQUE (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "FOREIGN KEY (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "CHECK (yas >= 18)",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "DEFAULT (yas >= 18)",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "CHECK kısıtlaması bir sütuna girilebilecek verilerin belirli bir mantıksal koşula (Boolean expression) uymasını zorunlu kılar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Constraint - CHECK Constraint",
            "keyTakeaway": "SQL İleri Seviye Soru #96 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000096
    },
    {
        "id": "q_sql_97",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(97) [Storage - CTE vs Temporary Table] Common Table Expression (CTE) ile Geçici Tablo (Temporary Table) arasındaki temel fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "Temporary Table silinemez.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "CTE diskte yer kaplar, Temporary Table kaplamaz.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "CTE hafızada sadece ilgili sorgu süresince var olan mantıksal bir görünümdür; Temporary Table ise tempdb/oturum içinde fiziksel olarak oluşturulur ve indekslenebilir.",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "CTE sadece PostgreSQL'de vardır.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "CTE tek bir sorgunun çalışma anı (scope) boyunca geçerli mantıksal yapıdır. Temporary Table ise oturum kapanana kadar tempdb'de fiziksel yaşar ve indekslenebilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Storage - CTE vs Temporary Table",
            "keyTakeaway": "SQL İleri Seviye Soru #97 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000097
    },
    {
        "id": "q_sql_98",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(98) [Query Optimization - SARGABLE Queries] SARGABLE (Search Argument Able) sorgu ifadesi ne anlama gelir?",
        "options": [
            {
                "id": "A",
                "text": "Sorguda grafik çizilmesi",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sorgunun sonucunun bellekte saklanması",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Sorgudaki WHERE koşulunun indeksleri etkin bir şekilde kullanabilecek biçimde yazılmış olması",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Sorgunun otomatik olarak paralelleştirilmesi",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "SARGABLE sorgular, indeksli sütunların üzerinde fonksiyon veya tip dönüşümü yapılmadan yazıldığı için VTYS'nin Index Seek yapabilmesine olanak tanır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Query Optimization - SARGABLE Queries",
            "keyTakeaway": "SQL İleri Seviye Soru #98 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000098
    },
    {
        "id": "q_sql_99",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(99) [Subquery - Scalar Subquery] Scalar Subquery (Skaler Alt Sorgu) ne tür bir sonuç döndürür?",
        "options": [
            {
                "id": "A",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sadece dizi (Array) verisi",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sadece Boolean (TRUE/FALSE) değer",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Bir tablo dolusu satır ve sütun",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Tam olarak 1 satır ve 1 sütundan oluşan tek bir değer",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Scalar subquery tek bir hücre (1 satır × 1 sütun) değer döndüren sorgudur. Bu yüzden SELECT listesinde veya matematiksel ifadelerde kullanılabilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Subquery - Scalar Subquery",
            "keyTakeaway": "SQL İleri Seviye Soru #99 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000099
    },
    {
        "id": "q_sql_100",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(100) [JSON Data in SQL - JSON_EXTRACT / ->>] Modern ilişkisel veritabanlarında (PostgreSQL, MySQL vb.) saklanan JSON verisinden bir alanı metin (text) olarak çekmek için hangi operatör/fonksiyon kullanılır?",
        "options": [
            {
                "id": "A",
                "text": "SUM()",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "GROUP_CONCAT()",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "PostgreSQL'de ->> operatörü / JSON_EXTRACT_TEXT",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "STRING_SPLIT()",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "JSON alanlarından metin değeri çekmek için PostgreSQL'de `->>` operatörü, MySQL/SQLite'ta `JSON_EXTRACT()` veya `->>` kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: JSON Data in SQL - JSON_EXTRACT / ->>",
            "keyTakeaway": "SQL İleri Seviye Soru #100 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000100
    }
],
  'İngilizce Grammar': [
    {
        "id": "q_oxford_1",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(1) We gave _____ a meal.",
        "options": [
            {
                "id": "A",
                "text": "the visitors",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "to the visitors",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "for the visitors",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "at the visitors",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Give fiili dolaylı nesne aldığında çift nesneli yapı (give someone something) kullanılır.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Words and sentences - Give + indirect object",
            "keyTakeaway": "Oxford Grammar Test Soru #1 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000001
    },
    {
        "id": "q_oxford_2",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(2) I'm busy at the moment. _____ on the computer.",
        "options": [
            {
                "id": "A",
                "text": "I'm work",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "I'm working",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "I working",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "I work",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Şu anda gerçekleşmekte olan eylemler için Present Continuous (am/is/are + V-ing) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Present Continuous",
            "keyTakeaway": "Oxford Grammar Test Soru #2 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000002
    },
    {
        "id": "q_oxford_3",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(3) My friend _____ the answer to the question.",
        "options": [
            {
                "id": "A",
                "text": "knowing",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "knows",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "is know",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "know",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Know (bilmek) bir durum fiilidir (stative verb) ve -ing takısı almaz; 3. tekil şahısta Simple Present (knows) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Stative Verbs",
            "keyTakeaway": "Oxford Grammar Test Soru #3 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000003
    },
    {
        "id": "q_oxford_4",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(4) I think I'll buy these shoes. _____ really well.",
        "options": [
            {
                "id": "A",
                "text": "They're fitting",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "They have fit",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "They were fitting",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "They fit",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Fit (tam gelmek) genel durum bildirdiği için Present Simple (They fit) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Stative & Present Simple",
            "keyTakeaway": "Oxford Grammar Test Soru #4 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000004
    },
    {
        "id": "q_oxford_5",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(5) Where _____ the car?",
        "options": [
            {
                "id": "A",
                "text": "did you parked",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "you parked",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "did you park",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "parked you",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Simple Past soru yapısında 'did + özne + V1' kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Simple Past Question",
            "keyTakeaway": "Oxford Grammar Test Soru #5 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000005
    },
    {
        "id": "q_oxford_6",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(6) At nine o'clock yesterday morning we _____ for the bus.",
        "options": [
            {
                "id": "A",
                "text": "was waiting",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "were waiting",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "wait",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "waiting",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Geçmişte belirli bir anda devam eden eylemler için Past Continuous (were waiting) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Past Continuous",
            "keyTakeaway": "Oxford Grammar Test Soru #6 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000006
    },
    {
        "id": "q_oxford_7",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(7) When I looked round the door, the baby _____ quietly.",
        "options": [
            {
                "id": "A",
                "text": "were sleeping",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "was sleeping",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "slept",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "is sleeping",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Geçmişte bir eylem gerçekleştiğinde devam etmekte olan eylem Past Continuous (was sleeping) ile anlatılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Past Continuous vs Simple Past",
            "keyTakeaway": "Oxford Grammar Test Soru #7 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000007
    },
    {
        "id": "q_oxford_8",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(8) Here's my report. _____ it at last.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "I finish",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "I finished",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "I'm finished",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "I've finished",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Eylem geçmişte tamamlanmış ve sonucu şu an elde ise Present Perfect (I've finished) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Present Perfect Result",
            "keyTakeaway": "Oxford Grammar Test Soru #8 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000008
    },
    {
        "id": "q_oxford_9",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(9) I've _____ made some coffee. It's in the kitchen.",
        "options": [
            {
                "id": "A",
                "text": "yet",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "never",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "ever",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "just",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Az önce/henüz yapılmış eylemler için Present Perfect kalıbında 'just' kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Present Perfect with Just",
            "keyTakeaway": "Oxford Grammar Test Soru #9 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000009
    },
    {
        "id": "q_oxford_10",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(10) We _____ to Ireland for our holidays last year.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "goes",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "going",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "went",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "have gone",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "'Last year' gibi geçmişte zamanı belirli net ifadelerle Simple Past (went) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Past Simple Time Adverb",
            "keyTakeaway": "Oxford Grammar Test Soru #10 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000010
    },
    {
        "id": "q_oxford_11",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(11) Rob _____ ill for three weeks. He's still in hospital.",
        "options": [
            {
                "id": "A",
                "text": "was",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "has been",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "is",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "had been",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Geçmişten başlayıp şu ana kadar devam eden ve hala süren durumlar için Present Perfect (has been) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Present Perfect Continuous State",
            "keyTakeaway": "Oxford Grammar Test Soru #11 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000011
    },
    {
        "id": "q_oxford_12",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(12) My arms are aching now because _____ since two o'clock.",
        "options": [
            {
                "id": "A",
                "text": "I'm swimming",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "I swim",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "I swam",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "I've been swimming",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Geçmişte başlayıp şu ana kadar süren ve fiziksel etkisi devam eden eylemlerde Present Perfect Continuous kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Present Perfect Continuous Activity",
            "keyTakeaway": "Oxford Grammar Test Soru #12 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000012
    },
    {
        "id": "q_oxford_13",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(13) I'm very tired. _____ over 400 miles today.",
        "options": [
            {
                "id": "A",
                "text": "I've been driving",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "I drive",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "I'm driving",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "I've driven",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Bugün tamamlanan miktar/mesafe (400 miles) belirtildiğinde Present Perfect (I've driven) tercih edilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Present Perfect Quantity",
            "keyTakeaway": "Oxford Grammar Test Soru #13 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000013
    },
    {
        "id": "q_oxford_14",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(14) When Martin _____ the car, he took it out for a drive.",
        "options": [
            {
                "id": "A",
                "text": "repaired",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "had repaired",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "has repaired",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "was repairing",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Geçmişteki iki eylemden önce gerçekleşen eylem için Past Perfect (had repaired) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Past Perfect Sequence",
            "keyTakeaway": "Oxford Grammar Test Soru #14 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000014
    },
    {
        "id": "q_oxford_15",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(15) Jessica was out of breath because _____.",
        "options": [
            {
                "id": "A",
                "text": "she's run",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "she's been running",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "she'd been running",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "she did run",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Geçmişteki bir durumun (was out of breath) öncesindeki fiziksel sebebini anlatırken Past Perfect Continuous (she'd been running) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Past Perfect Continuous Reason",
            "keyTakeaway": "Oxford Grammar Test Soru #15 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000015
    },
    {
        "id": "q_oxford_16",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(16) Don't worry. I _____ be here to help you.",
        "options": [
            {
                "id": "A",
                "text": "shall",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "not",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "willn't",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "won't",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Birinci tekil şahısta (I) söz verme ve teklif için 'shall' (veya will) kullanılır.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Future Intent / Promise",
            "keyTakeaway": "Oxford Grammar Test Soru #16 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000016
    },
    {
        "id": "q_oxford_17",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(17) Our friends _____ meet us at the airport tonight.",
        "options": [
            {
                "id": "A",
                "text": "are going to",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "will be to",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "are",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "go to",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Önceden planlanmış ve kararlaştırılmış gelecek eylemleri için 'be going to' kullanılır.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Future Intention / Plan",
            "keyTakeaway": "Oxford Grammar Test Soru #17 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000017
    },
    {
        "id": "q_oxford_18",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(18) _____ a party next Saturday. We've sent out the invitations.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "We're having",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "We had",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "We'll have",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "We have",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Davetiyeler gönderildiği için kesinleşmiş organizasyonlarda Present Continuous (We're having) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Present Continuous for Future Arrangement",
            "keyTakeaway": "Oxford Grammar Test Soru #18 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000018
    },
    {
        "id": "q_oxford_19",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(19) I'll tell Anna all the news when _____ her.",
        "options": [
            {
                "id": "A",
                "text": "I'll see",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "I'm going to see",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "I shall see",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "I see",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "When, as soon as, before gibi zaman bağlaçlarının bulunduğu yan cümlede future tense yerine Present Simple (I see) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Time Clauses",
            "keyTakeaway": "Oxford Grammar Test Soru #19 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000019
    },
    {
        "id": "q_oxford_20",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(20) At this time tomorrow _____ over the Atlantic.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "we to fly",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "we flying",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "we'll be flying",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "we'll fly",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Gelecekte belirli bir anda (At this time tomorrow) devam ediyor olacak eylemler için Future Continuous (we'll be flying) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Future Continuous",
            "keyTakeaway": "Oxford Grammar Test Soru #20 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000020
    },
    {
        "id": "q_oxford_21",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(21) Where's Rob? _____ a shower?",
        "options": [
            {
                "id": "A",
                "text": "Does he have",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Is he having",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Has he",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Has he got",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Şu an duş almakta olup olmadığını sormak için Present Continuous (Is he having a shower?) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Temporary Action in Progress",
            "keyTakeaway": "Oxford Grammar Test Soru #21 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000021
    },
    {
        "id": "q_oxford_22",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(22) I _____ like that coat. It's really nice.",
        "options": [
            {
                "id": "A",
                "text": "yes",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "am",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "very",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "do",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Olumlu cümlede duyguyu ve beğeniyi vurgulamak için fiilin önüne 'do' getirilir (I do like...).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Emphatic Do",
            "keyTakeaway": "Oxford Grammar Test Soru #22 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000022
    },
    {
        "id": "q_oxford_23",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(23) What's the weather like in Canada? How often _____ there?",
        "options": [
            {
                "id": "A",
                "text": "snow it",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "snows it",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "does it snow",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "does it snows",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Geniş zaman sorularında 'does + özne + V1' kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Questions - Present Simple Question",
            "keyTakeaway": "Oxford Grammar Test Soru #23 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000023
    },
    {
        "id": "q_oxford_24",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(24) Which team _____ the game?",
        "options": [
            {
                "id": "A",
                "text": "won",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "won it",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "did it win",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "did they win",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Soru kelimesi (Which team) cümlenin öznesi olduğunda 'did' yardımcı fiili kullanılmaz, direkt fiil (won) gelir.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Questions - Subject Questions",
            "keyTakeaway": "Oxford Grammar Test Soru #24 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000024
    },
    {
        "id": "q_oxford_25",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(25) What did you leave the meeting early _____ ? ~ I didn't feel very well.",
        "options": [
            {
                "id": "A",
                "text": "because",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "for",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "away",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "like",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "'What ... for?' kalıbı 'Ne için / Neden?' (Why?) sorusunun dengidir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Questions - Preposition at the End",
            "keyTakeaway": "Oxford Grammar Test Soru #25 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000025
    },
    {
        "id": "q_oxford_26",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(26) Unfortunately the driver _____ the red light.",
        "options": [
            {
                "id": "A",
                "text": "no saw",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "didn't see",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "didn't saw",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "saw not",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Simple Past olumsuz cümlelerde 'didn't + V1' kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Negatives - Simple Past Negative",
            "keyTakeaway": "Oxford Grammar Test Soru #26 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000026
    },
    {
        "id": "q_oxford_27",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(27) You haven't eaten your pudding. _____ it?",
        "options": [
            {
                "id": "A",
                "text": "Do you no want",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Are you no want",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Don't want you",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Don't you want",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Olumsuz soru cümlelerinde 'Don't + özne + V1' (Don't you want...?) kalıbı kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Questions - Negative Questions",
            "keyTakeaway": "Oxford Grammar Test Soru #27 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000027
    },
    {
        "id": "q_oxford_28",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(28) I really enjoyed the party. It was great, _____ ?",
        "options": [
            {
                "id": "A",
                "text": "isn't it",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "was it",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "is it",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "wasn't it",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Ana cümle olumlu Past Simple (It was) ise, onaylama sorusu (Tag Question) olumsuz Past Simple (wasn't it?) olur.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Questions - Tag Questions",
            "keyTakeaway": "Oxford Grammar Test Soru #28 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000028
    },
    {
        "id": "q_oxford_29",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(29) Are we going the right way? ~ I think _____.",
        "options": [
            {
                "id": "A",
                "text": "it",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "indeed",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "so",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "yes",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Bir soruya 'Öyle sanıyorum / Sanırım öyle' demek için 'I think so' kalıbı kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Answers - So after Think",
            "keyTakeaway": "Oxford Grammar Test Soru #29 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000029
    },
    {
        "id": "q_oxford_30",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(30) The chemist's was open, so luckily I _____ buy some aspirin.",
        "options": [
            {
                "id": "A",
                "text": "can",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "was able to",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "did can",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "can't",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Geçmişte belirli bir anda başarmak/yapa bilmek için 'was/were able to' kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Modal verbs - Past Ability Specific Event",
            "keyTakeaway": "Oxford Grammar Test Soru #30 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000030
    },
    {
        "id": "q_oxford_31",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(31) Lucy has to work very hard. I _____ do her job, I'm sure.",
        "options": [
            {
                "id": "A",
                "text": "don't",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "couldn't",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "can't",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "shouldn't",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Varsayımsal olarak 'ben onun işini yapamazdım' derken 'couldn't' kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Modal verbs - Hypothesis / Impossibility",
            "keyTakeaway": "Oxford Grammar Test Soru #31 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000031
    },
    {
        "id": "q_oxford_32",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(32) We had a party last night. _____ spend all morning clearing up the mess.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "I've had to",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "I must have",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "I've been to",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "I've must",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Geçmişteki eylemden dolayı şu an zorunda kalma durumu 'I've had to' ile ifade edilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Modal verbs - Present Result of Past Obligation",
            "keyTakeaway": "Oxford Grammar Test Soru #32 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000032
    },
    {
        "id": "q_oxford_33",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(33) There was no one else at the box office. I _____ in a queue.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "didn't need to wait",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "mustn't wait",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "needn't have waited",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "needn't wait",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Geçmişte bir zorunluluk olmadığını ve bu yüzden yapılmadığını belirtmek için 'didn't need to wait' kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Modal verbs - Past Absence of Obligation",
            "keyTakeaway": "Oxford Grammar Test Soru #33 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000033
    },
    {
        "id": "q_oxford_34",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(34) _____ I carry that bag for you? ~ Oh, thank you.",
        "options": [
            {
                "id": "A",
                "text": "Would",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Will",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Do",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Shall",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Birinci şahısta (I) yardım teklif ederken 'Shall I ...?' kalıbı kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Modal verbs - Offers",
            "keyTakeaway": "Oxford Grammar Test Soru #34 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000034
    },
    {
        "id": "q_oxford_35",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(35) I've lost the key. I ought _____ it in a safe place.",
        "options": [
            {
                "id": "A",
                "text": "to be putting",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "that I put",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "to have put",
                "isCorrect": true
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Geçmişte yapılması gerekip de yapılmayan eylemler için 'ought to have + V3' kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Modal verbs - Past Unfulfilled Expectation",
            "keyTakeaway": "Oxford Grammar Test Soru #35 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000035
    },
    {
        "id": "q_oxford_36",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(36) We can't go along here because the road is _____.",
        "options": [
            {
                "id": "A",
                "text": "repair",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "being repaired",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "repaired",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "been repaired",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Şu an tamir edilmekte olduğunu anlatmak için Present Continuous Passive (is being repaired) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Passive - Present Continuous Passive",
            "keyTakeaway": "Oxford Grammar Test Soru #36 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000036
    },
    {
        "id": "q_oxford_37",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(37) The story I've just read _____ a friend of mine.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "was written by",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "was written from",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "was written",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "wrote",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Edilgen cümlelerde eylemi yapan kişi 'by' edatı ile belirtilir (was written by).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Passive - Agent with By",
            "keyTakeaway": "Oxford Grammar Test Soru #37 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000037
    },
    {
        "id": "q_oxford_38",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(38) Some film stars _____ be difficult to work with.",
        "options": [
            {
                "id": "A",
                "text": "say",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "are said to",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "are said",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "say to",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Söylenti ve genel görüş belirtirken 'Subject + are said + to-infinitive' kalıbı kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Passive - Personal Structure",
            "keyTakeaway": "Oxford Grammar Test Soru #38 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000038
    },
    {
        "id": "q_oxford_39",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(39) I'm going to go out and _____.",
        "options": [
            {
                "id": "A",
                "text": "let my hair cut",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "my hair be cut",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "have my hair cut",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "have cut my hair",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Bir işi başkasına yaptırma (ettirgen) kalıbı 'have + nesne + V3' (have my hair cut) şeklindedir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Passive - Causative Have Something Done",
            "keyTakeaway": "Oxford Grammar Test Soru #39 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000039
    },
    {
        "id": "q_oxford_40",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(40) The driver was arrested for failing _____ an accident.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "of report",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "report",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "reporting",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "to report",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Fail fiili arkasından her zaman to-infinitive (fail to do something) alır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive - Verb + To-Infinitive",
            "keyTakeaway": "Oxford Grammar Test Soru #40 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000040
    },
    {
        "id": "q_oxford_41",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(41) Someone suggested _____ for a walk.",
        "options": [
            {
                "id": "A",
                "text": "of going",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "go",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "to go",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "going",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Suggest fiilinden sonra nesne/cümle gelmiyorsa doğrudan Gerund (-ing) kullanılır (suggest going).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive and -ing - Suggest + Gerund",
            "keyTakeaway": "Oxford Grammar Test Soru #41 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000041
    },
    {
        "id": "q_oxford_42",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(42) I can remember _____ voices in the middle of the night.",
        "options": [
            {
                "id": "A",
                "text": "to hear",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "heard",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "hearing",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "hear",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Geçmişte yaşanmış bir anıyı hatırlarken 'remember + V-ing' (hearing) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive and -ing - Remember + Gerund",
            "keyTakeaway": "Oxford Grammar Test Soru #42 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000042
    },
    {
        "id": "q_oxford_43",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(43) The police want _____ anything suspicious.",
        "options": [
            {
                "id": "A",
                "text": "us to report",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "that we report",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "us reporting",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "we report",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Want fiili 'want + someone + to V1' yapısını alır (want us to report).",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive and -ing - Want + Object + To-Infinitive",
            "keyTakeaway": "Oxford Grammar Test Soru #43 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000043
    },
    {
        "id": "q_oxford_44",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(44) We weren't sure _____ or just walk in.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "should knock",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "to knock",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "whether knock",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "whether to knock",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Emin olamama durumlarında 'whether + to-infinitive' (whether to knock) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive - Question Word + To-Infinitive",
            "keyTakeaway": "Oxford Grammar Test Soru #44 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000044
    },
    {
        "id": "q_oxford_45",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(45) It was too cold _____ outside.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "that the guests eat",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "that the guests should eat",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "the guests eating",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "for the guests to eat",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "'Too + sıfat + for someone + to V1' kalıbı kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive - Too + Adjective + For + Object + To-Infinitive",
            "keyTakeaway": "Oxford Grammar Test Soru #45 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000045
    },
    {
        "id": "q_oxford_46",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(46) Did you congratulate Tessa _____ her exam?",
        "options": [
            {
                "id": "A",
                "text": "of passing",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "to pass",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "passing",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "on passing",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Congratulate fiili 'congratulate someone ON doing something' yapısını alır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive and -ing - Preposition + Gerund",
            "keyTakeaway": "Oxford Grammar Test Soru #46 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000046
    },
    {
        "id": "q_oxford_47",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(47) I didn't like it in the city at first. But now _____ here.",
        "options": [
            {
                "id": "A",
                "text": "I'm used to living",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "I got used to living",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "I used to live",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "I used to living",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Alışkın olma durumunu anlatırken 'be used to + V-ing' (I'm used to living) kullanılır.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive and -ing - Be Used To",
            "keyTakeaway": "Oxford Grammar Test Soru #47 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000047
    },
    {
        "id": "q_oxford_48",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(48) They raised the money simply _____ for it. It was easy.",
        "options": [
            {
                "id": "A",
                "text": "with asking",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "asking",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "of asking",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "by asking",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Bir şeyin nasıl yapıldığını/yöntemini anlatırken 'by + V-ing' (by asking) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive and -ing - By + V-ing (Means)",
            "keyTakeaway": "Oxford Grammar Test Soru #48 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000048
    },
    {
        "id": "q_oxford_49",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(49) As we walked past, we saw Dan _____ his car.",
        "options": [
            {
                "id": "A",
                "text": "wash",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "washing",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "in washing",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "to wash",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Görsel veya işitsel algı fiillerinden (see, hear, watch) sonra eylemin bir kısmına tanık olunduysa V-ing (washing) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive and -ing - Sense Verbs",
            "keyTakeaway": "Oxford Grammar Test Soru #49 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000049
    },
    {
        "id": "q_oxford_50",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(50) I need to buy _____.",
        "options": [
            {
                "id": "A",
                "text": "a loaf of bread",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "breads",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "a loaf bread",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "a bread",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Bread sayılamayan bir isimdir; birim belirtmek için 'a loaf of bread' denir.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Uncountable Nouns",
            "keyTakeaway": "Oxford Grammar Test Soru #50 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000050
    },
    {
        "id": "q_oxford_51",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(51) My father is not only the town mayor, he runs _____ , too.",
        "options": [
            {
                "id": "A",
                "text": "business",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "a piece of business",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "a business",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "some business",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Ticari işletme/şirket anlamındaki 'business' sayılabilir (a business).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Countable vs Uncountable Business",
            "keyTakeaway": "Oxford Grammar Test Soru #51 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000051
    },
    {
        "id": "q_oxford_52",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(52) The _____ produced at our factory in Scotland.",
        "options": [
            {
                "id": "A",
                "text": "good are",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "good is",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "goods are",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "goods is",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "'Goods' (mallar/ürünler) her zaman çoğuldur ve çoğul fiil alarak 'goods are' şeklinde kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Plural Nouns",
            "keyTakeaway": "Oxford Grammar Test Soru #52 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000052
    },
    {
        "id": "q_oxford_53",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(53) I'm looking for _____ to cut this string.",
        "options": [
            {
                "id": "A",
                "text": "a scissors",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "some scissors",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "a scissor",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "a pair scissors",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Scissors çift parçalı çoğul isimdir; 'some scissors' veya 'a pair of scissors' denir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Pair Nouns",
            "keyTakeaway": "Oxford Grammar Test Soru #53 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000053
    },
    {
        "id": "q_oxford_54",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(54) I was watching TV at home when suddenly _____ rang.",
        "options": [
            {
                "id": "A",
                "text": "a doorbell",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "the doorbell",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "an doorbell",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "doorbell",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Evdeki bilinen zil olduğu için belirli nesne 'the doorbell' kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Definite Article The",
            "keyTakeaway": "Oxford Grammar Test Soru #54 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000054
    },
    {
        "id": "q_oxford_55",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(55) I've always liked _____.",
        "options": [
            {
                "id": "A",
                "text": "food of China",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "the Chinese food",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Chinese food",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "some food of China",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Genel olarak mutfak veya yemek türlerinden bahsederken artikel kullanılmaz (Chinese food).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Generalizations",
            "keyTakeaway": "Oxford Grammar Test Soru #55 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000055
    },
    {
        "id": "q_oxford_56",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(56) In England most children go _____ at the age of five.",
        "options": [
            {
                "id": "A",
                "text": "to some schools",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "to the school",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "school",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "to school",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Okul, hastane, hapishane gibi kurumlara esas amacı için gidildiğinde artikel kullanılmaz (go to school).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Institutions without Article",
            "keyTakeaway": "Oxford Grammar Test Soru #56 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000056
    },
    {
        "id": "q_oxford_57",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(57) We haven't had a holiday for _____ time.",
        "options": [
            {
                "id": "A",
                "text": "such long",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "a so long",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "so a long",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "such a long",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "'Such + a/an + sıfat + tekil sayılabilir isim' (such a long time) kalıbı kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Such a + Adjective + Noun",
            "keyTakeaway": "Oxford Grammar Test Soru #57 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000057
    },
    {
        "id": "q_oxford_58",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(58) Our friends have a house in _____.",
        "options": [
            {
                "id": "A",
                "text": "the West London",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "a West London",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "West of London",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "West London",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Şehir bölgesi isimlerinden önce (West London) artikel kullanılmaz.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Geographical Names",
            "keyTakeaway": "Oxford Grammar Test Soru #58 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000058
    },
    {
        "id": "q_oxford_59",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(59) It's so boring here. Nothing ever happens in _____ place.",
        "options": [
            {
                "id": "A",
                "text": "these",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "those",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "that",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "this",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Konuşulan bulunulan yer 'here' olduğu için işaret zamiri 'this' (this place) olur.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: This, my, some, all - Demonstratives",
            "keyTakeaway": "Oxford Grammar Test Soru #59 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000059
    },
    {
        "id": "q_oxford_60",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(60) Is that my key, or is it _____ ?",
        "options": [
            {
                "id": "A",
                "text": "yours",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "the yours",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "your",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "the your's",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "İsimsiz iyelik zamiri 'yours' (seninki) şeklindedir.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: This, my, some, all - Possessive Pronouns",
            "keyTakeaway": "Oxford Grammar Test Soru #60 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000060
    },
    {
        "id": "q_oxford_61",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(61) Adrian takes no interest in clothes. He'll wear _____.",
        "options": [
            {
                "id": "A",
                "text": "a thing",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "thing",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "anything",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "something",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Fark etmez/herhangi bir şey anlamında olumlu cümlede 'anything' kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: This, my, some, all - Indefinite Pronouns",
            "keyTakeaway": "Oxford Grammar Test Soru #61 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000061
    },
    {
        "id": "q_oxford_62",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(62) There's _____ use in complaining. They probably won't do anything about it.",
        "options": [
            {
                "id": "A",
                "text": "a few",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "little",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "few",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "a little",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Sayılamayan 'use' ismi ile 'hiç yok kadar az / faydasız' anlamında olumsuz 'little' (little use) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: This, my, some, all - Little vs A Little",
            "keyTakeaway": "Oxford Grammar Test Soru #62 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000062
    },
    {
        "id": "q_oxford_63",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(63) I don't want to buy any of these books. I've got _____.",
        "options": [
            {
                "id": "A",
                "text": "them all",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "everything",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "all",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "all them",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Zamirle kullanımda 'them all' veya 'all of them' kalıbı geçerlidir.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: This, my, some, all - Pronoun + All",
            "keyTakeaway": "Oxford Grammar Test Soru #63 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000063
    },
    {
        "id": "q_oxford_64",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(64) Let's stop and have a coffee. _____ a café over there, look.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "It's",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "There's",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "There",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Is",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Var olduğunu bildirmek için 'There's a café' kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Pronouns - There is / There are",
            "keyTakeaway": "Oxford Grammar Test Soru #64 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000064
    },
    {
        "id": "q_oxford_65",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(65) Everyone in the group shook hands with _____.",
        "options": [
            {
                "id": "A",
                "text": "one the other",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "themselves",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "each other",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "one other",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Karşılıklı tokalaşma eyleminde 'each other' (birbiriyle) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Pronouns - Reciprocal Pronouns",
            "keyTakeaway": "Oxford Grammar Test Soru #65 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000065
    },
    {
        "id": "q_oxford_66",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(66) The washing machine has broken down again. I think we should get _____.",
        "options": [
            {
                "id": "A",
                "text": "new one",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "a new one",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "new",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "a new",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Tekil bir ismin (washing machine) tekrarını önlemek için 'a new one' kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Pronouns - One / Ones",
            "keyTakeaway": "Oxford Grammar Test Soru #66 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000066
    },
    {
        "id": "q_oxford_67",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(67) All the guests were dancing. _____ having a good time.",
        "options": [
            {
                "id": "A",
                "text": "Someone were",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Everyone was",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "All were",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Every was",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Herkes anlamındaki 'Everyone' tekil fiil alır (Everyone was).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Pronouns - Everyone + Singular Verb",
            "keyTakeaway": "Oxford Grammar Test Soru #67 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000067
    },
    {
        "id": "q_oxford_68",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(68) The house was _____ building.",
        "options": [
            {
                "id": "A",
                "text": "an old nice stone",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "a nice stone old",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "a stone old nice",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "a nice old stone",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Sıfat sıralaması: Opinion (nice) + Age (old) + Material (stone) -> a nice old stone building.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - Order of Adjectives",
            "keyTakeaway": "Oxford Grammar Test Soru #68 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000068
    },
    {
        "id": "q_oxford_69",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(69) The government is doing nothing to help _____.",
        "options": [
            {
                "id": "A",
                "text": "poor",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "the poors",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "the poor ones",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "the poor",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Belirli bir insan grubunu anlatmak için 'The + Sıfat' (the poor = yoksullar) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - The + Adjective for Groups",
            "keyTakeaway": "Oxford Grammar Test Soru #69 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000069
    },
    {
        "id": "q_oxford_70",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(70) The young man seems very _____.",
        "options": [
            {
                "id": "A",
                "text": "sensibly",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "sensible",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "sensiblely",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "sensibley",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Seem (görünmek) bağlama fiilinden (linking verb) sonra zarf değil sıfat (sensible) gelir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - Linking Verbs",
            "keyTakeaway": "Oxford Grammar Test Soru #70 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000070
    },
    {
        "id": "q_oxford_71",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(71) I _____ missed the bus. I was only just in time to catch it.",
        "options": [
            {
                "id": "A",
                "text": "nearly",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "mostly",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "nearest",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "near",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Neredeyse/az kalsın anlamında 'nearly' zarfı kullanılır.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - Nearly",
            "keyTakeaway": "Oxford Grammar Test Soru #71 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000071
    },
    {
        "id": "q_oxford_72",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(72) This detailed map is _____ the atlas.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "usefuller than",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "usefuller as",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "more useful as",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "more useful than",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Uzun sıfatların karşılaştırmasında 'more + sıfat + THAN' (more useful than) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - Comparative Tense",
            "keyTakeaway": "Oxford Grammar Test Soru #72 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000072
    },
    {
        "id": "q_oxford_73",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(73) This place gets _____ crowded with tourists every summer.",
        "options": [
            {
                "id": "A",
                "text": "from more to more",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "always more",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "more and more",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "crowded and more",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Giderek/gittikçe artan durumlar için 'more and more + sıfat' kalıbı kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - Gradual Increase",
            "keyTakeaway": "Oxford Grammar Test Soru #73 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000073
    },
    {
        "id": "q_oxford_74",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(74) Yes, I have got the report. _____ it.",
        "options": [
            {
                "id": "A",
                "text": "Just I'm reading",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "I'm reading just",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "I just am reading",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "I'm just reading",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Just zarfı yardımcı fiil ile ana fiil arasında yer alır (I'm just reading).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - Adverb Position",
            "keyTakeaway": "Oxford Grammar Test Soru #74 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000074
    },
    {
        "id": "q_oxford_75",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(75) I've read this paragraph three times, and I _____ understand it.",
        "options": [
            {
                "id": "A",
                "text": "still can't",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "yet can't",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "can't still",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "can't yet",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Still zarfı olumsuz modal/yardımcı fiillerden ÖNCE gelir (still can't).",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - Position of Still",
            "keyTakeaway": "Oxford Grammar Test Soru #75 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000075
    },
    {
        "id": "q_oxford_76",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(76) We're really sorry. We regret what happened _____.",
        "options": [
            {
                "id": "A",
                "text": "much",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "a bit",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "very much",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "very",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Fiilleri kuvvetlendirmek için olumlu cümle sonunda 'very much' kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - Very much with verbs",
            "keyTakeaway": "Oxford Grammar Test Soru #76 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000076
    },
    {
        "id": "q_oxford_77",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(77) The village is _____ Sheffield. It's only six miles away.",
        "options": [
            {
                "id": "A",
                "text": "by",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "near",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "along",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "next",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Bir yere yakınlığı ifade etmek için 'near' edatı kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Prepositions - Near",
            "keyTakeaway": "Oxford Grammar Test Soru #77 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000077
    },
    {
        "id": "q_oxford_78",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(78) You can see the details _____ the screen.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "on",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "by",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "in",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "at",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Ekran üzerindeki görüntüler için 'ON the screen' edatı kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Prepositions - On the screen",
            "keyTakeaway": "Oxford Grammar Test Soru #78 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000078
    },
    {
        "id": "q_oxford_79",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(79) I've got a meeting _____ Thursday afternoon.",
        "options": [
            {
                "id": "A",
                "text": "on",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "in",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "at",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "to",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Günler ve günlerin bölümleri (Thursday afternoon) için 'ON' edatı kullanılır.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Prepositions - Days of the week",
            "keyTakeaway": "Oxford Grammar Test Soru #79 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000079
    },
    {
        "id": "q_oxford_80",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(80) We've lived in this flat _____ five years.",
        "options": [
            {
                "id": "A",
                "text": "already",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "since",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "for",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "ago",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Süreç ve zaman aralığı (five years) belirten durumlarda 'FOR' edatı kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Prepositions - For + Period of time",
            "keyTakeaway": "Oxford Grammar Test Soru #80 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000080
    },
    {
        "id": "q_oxford_81",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(81) This car is _____ , if you're interested in buying it.",
        "options": [
            {
                "id": "A",
                "text": "at sale",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "to sell",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "for sale",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "in sale",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Satılık anlamındaki sabit edat öbeği 'FOR sale'dir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Prepositions - For sale",
            "keyTakeaway": "Oxford Grammar Test Soru #81 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000081
    },
    {
        "id": "q_oxford_82",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(82) Polly wants to cycle round the world. She's really keen _____ the idea.",
        "options": [
            {
                "id": "A",
                "text": "with",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "for",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "on",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "about",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Keen sıfatı her zaman 'ON' edatı alır (keen on something = bir şeye meraklı/hevesli).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Prepositions - Keen on",
            "keyTakeaway": "Oxford Grammar Test Soru #82 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000082
    },
    {
        "id": "q_oxford_83",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(83) I prefer dogs _____ cats. I hate cats.",
        "options": [
            {
                "id": "A",
                "text": "over",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "than",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "from",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "to",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Prefer fiili iki şey arasında tercih yaparken 'prefer A TO B' kalıbını alır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs with prepositions - Prefer to",
            "keyTakeaway": "Oxford Grammar Test Soru #83 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000083
    },
    {
        "id": "q_oxford_84",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(84) My father used the money he won to set _____ his own company.",
        "options": [
            {
                "id": "A",
                "text": "out",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "up",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "forward",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "on",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Şirket/iş kurmak anlamındaki deyimsel fiil (phrasal verb) 'set UP'tır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs with prepositions - Set up",
            "keyTakeaway": "Oxford Grammar Test Soru #84 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000084
    },
    {
        "id": "q_oxford_85",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(85) Don't go too fast. I can't keep _____ you.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "up to",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "up with",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "on with",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "on to",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Birinin hızına yetişmek/ayak uydurmak 'keep UP WITH someone' phrasal verb'üdür.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs with prepositions - Keep up with",
            "keyTakeaway": "Oxford Grammar Test Soru #85 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000085
    },
    {
        "id": "q_oxford_86",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(86) Someone _____ the tickets are free.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "said me",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "said me that",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "told me",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "told to me",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Tell fiili doğrudan şahıs nesnesi alır (told me). Say fiili şahıs nesnesi alırken 'said TO me' ister.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Reported speech - Say vs Tell",
            "keyTakeaway": "Oxford Grammar Test Soru #86 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000086
    },
    {
        "id": "q_oxford_87",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(87) Last week Justin said 'I'll do it tomorrow.' He said he would do it _____.",
        "options": [
            {
                "id": "A",
                "text": "yesterday",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "tomorrow",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "the following day",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "the previous day",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Dolaylı anlatımda (Reported Speech) 'tomorrow' kelimesi 'the following day' veya 'the next day'e dönüşür.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Reported speech - Time Shifts",
            "keyTakeaway": "Oxford Grammar Test Soru #87 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000087
    },
    {
        "id": "q_oxford_88",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(88) I don't know why Isabelle didn't go to the meeting. She said she _____ definitely going.",
        "options": [
            {
                "id": "A",
                "text": "was",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "is",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "would",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "be",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Aktaran fiil geçmiş zaman (said) olduğunda am/is/are kalıbı geçmişe (was/were) kayar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Reported speech - Tense Backshift",
            "keyTakeaway": "Oxford Grammar Test Soru #88 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000088
    },
    {
        "id": "q_oxford_89",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(89) The librarian asked us _____ so much noise.",
        "options": [
            {
                "id": "A",
                "text": "not make",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "don't make",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "not to make",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "not making",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Dolaylı emir ve ricalarda olumsuz yapı 'ask + someone + NOT TO + V1' (not to make) şeklindedir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Reported speech - Reported Imperatives",
            "keyTakeaway": "Oxford Grammar Test Soru #89 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000089
    },
    {
        "id": "q_oxford_90",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(90) What's the name of the man _____ gave us a lift?",
        "options": [
            {
                "id": "A",
                "text": "who",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "what",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "he",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "which",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "İnsanları niteleyen özne konumundaki ilgi zamiri 'WHO'dur.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Relative clauses - Relative Pronoun for Persons",
            "keyTakeaway": "Oxford Grammar Test Soru #90 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000090
    },
    {
        "id": "q_oxford_91",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(91) What was that notice _____ ?",
        "options": [
            {
                "id": "A",
                "text": "you were looking at it",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "which you were looking",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "you were looking at",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "at that you were looking",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Preposition cümlenin sonunda kalabilir ve ilgi zamiri (that/which) düşürülebilir (you were looking at).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Relative clauses - Preposition Placement & Omission",
            "keyTakeaway": "Oxford Grammar Test Soru #91 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000091
    },
    {
        "id": "q_oxford_92",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(92) Lucy is the woman _____ husband is in hospital.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "whose",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "her",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "hers the",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "whose the",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Aitlik/sahiplik niteleyen ilgi zamiri 'WHOSE'dur (whose husband).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Relative clauses - Whose for Possession",
            "keyTakeaway": "Oxford Grammar Test Soru #92 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000092
    },
    {
        "id": "q_oxford_93",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(93) York, _____ last year, is a nice old city.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "which I visited",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "that I visited",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "whom I visited",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "I visited",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Virgülle ayrılan Non-defining Relative Clause yapısında nesneler için 'WHICH' kullanılır ('that' virgüllü yapıda kullanılamaz).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Relative clauses - Non-defining Relative Clauses",
            "keyTakeaway": "Oxford Grammar Test Soru #93 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000093
    },
    {
        "id": "q_oxford_94",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(94) The accident was seen by some people _____ at a bus stop.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "waited",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "who waiting",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "were waiting",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "waiting",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Etken sıfat cümlesi kısaltmasında (who were waiting -> waiting) Present Participle kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Relative clauses - Reduced Relative Clause",
            "keyTakeaway": "Oxford Grammar Test Soru #94 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000094
    },
    {
        "id": "q_oxford_95",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(95) If _____ my passport, I'll be in trouble.",
        "options": [
            {
                "id": "A",
                "text": "I lose",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "I lost",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "I'll lose",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "I would lose",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Type 1 Koşul cümlesinde If yan cümlesinde Present Simple (I lose), ana cümlede Future (will) kullanılır.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Conditionals - Type 1 Conditional",
            "keyTakeaway": "Oxford Grammar Test Soru #95 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000095
    },
    {
        "id": "q_oxford_96",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(96) I haven't got a ticket. If _____ one, I could get in.",
        "options": [
            {
                "id": "A",
                "text": "I've got",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "I had",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "I have",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "I'd have",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Şu anki gerçek dışı durumu (Unreal Present) ifade eden Type 2 koşulda If kısmında Past Simple (I had) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Conditionals - Type 2 Conditional",
            "keyTakeaway": "Oxford Grammar Test Soru #96 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000096
    },
    {
        "id": "q_oxford_97",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(97) If the bus to the airport hadn't been so late, we _____ the plane.",
        "options": [
            {
                "id": "A",
                "text": "caught",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "would catch",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "would have caught",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "had caught",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Geçmişteki pişmanlık/gerçek dışı durumu ifade eden Type 3 koşulda ana cümlede 'would have + V3' (would have caught) kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Conditionals - Type 3 Conditional",
            "keyTakeaway": "Oxford Grammar Test Soru #97 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000097
    },
    {
        "id": "q_oxford_98",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(98) If only people _____ keep sending me bills!",
        "options": [
            {
                "id": "A",
                "text": "wouldn't",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "weren't",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "don't",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "shouldn't",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Başkalarının rahatsız edici davranışlarının değişmesi isteğinde 'If only / I wish + WOULDN'T + V1' kullanılır.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Conditionals - Wish / If Only for Annoyance",
            "keyTakeaway": "Oxford Grammar Test Soru #98 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000098
    },
    {
        "id": "q_oxford_99",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(99) I just had to take the dog out _____ of the awful weather.",
        "options": [
            {
                "id": "A",
                "text": "although",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "in spite of",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "even though",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "despite",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Arkasından 'of' edatı alan zıtlık bağlacı 'IN SPITE OF'tur.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Linking words - In Spite Of",
            "keyTakeaway": "Oxford Grammar Test Soru #99 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000099
    },
    {
        "id": "q_oxford_100",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(100) Anna put the electric fire on _____ warm.",
        "options": [
            {
                "id": "A",
                "text": "None of the above",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "for getting",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "so she gets",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "in order get",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "to get",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Amaç bildirmek için fiilin yalın haliyle 'to + V1' (to get) veya 'in order to + V1' kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Linking words - Infinitive of Purpose",
            "keyTakeaway": "Oxford Grammar Test Soru #100 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000100
    }
]
};

// Procedural question templates generator for fallback mode
const QUESTION_ANGLES = [
  'temel tanımı ve en kritik özelliği',
  'uygulama alanları ve pratik kullanımı',
  'tarihsel gelişimi ve ortaya çıkış nedeni',
  'benzer kavramlarla karşılaştırıldığında en belirgin farkı',
  'alt bileşenleri ve çalışma mekanizması',
  'karşılaşılan en yaygın hata veya çeldirici durum',
  'geleceğe yönelik potansiyeli ve getirdiği yenilik'
];

export async function askGeminiAboutText(
  selectedText: string,
  userQuestion?: string,
  apiKey?: string,
  modelName: string = 'gemini-2.5-flash'
): Promise<{
  explanation: string;
  keyTakeaway?: string;
  relatedConcepts?: string[];
}> {
  const promptText = userQuestion && userQuestion.trim()
    ? `Kullanıcının Seçtiği Metin: "${selectedText}"\nKullanıcının Özel Sorusu: "${userQuestion}"`
    : `Kullanıcının Seçtiği Metin: "${selectedText}"`;

  if (apiKey && apiKey.trim().length > 5) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Sen YKS (TYT-AYT) ve ÖSYM sınav mütalaalarında uzman, Türkiye'nin önde gelen yapay zeka ders öğretmenisin.
Kullanıcı sitede ders veya soru çalışırken şu metni seçti ve senin açıklamana ihtiyaç duyuyor:

${promptText}

Lütfen bu metin/kavram/soru hakkında:
1. Kısa ve çok net bir öz anlatım yap (akademik ve anlaşılır dil).
2. YKS sınavı açısından en kritik püf noktasını (altın ipucu) vurgula.
3. Varsa matematiksel/fiziksel formülleri KaTeX LaTeX formatında \\( ... \\) veya \\[ ... \\] olarak yaz.

Yanıtı SADECE aşağıdaki JSON formatında ver, markdown backtick ekleme:
{
  "explanation": "Detaylı anlaşılır ders açıklaması...",
  "keyTakeaway": "YKS Altın İpucu / Püf Noktası",
  "relatedConcepts": ["İlişkili Konu 1", "İlişkili Konu 2"]
}
`;

      const response = await ai.models.generateContent({
        model: modelName || 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        explanation: parsed.explanation || responseText,
        keyTakeaway: parsed.keyTakeaway,
        relatedConcepts: parsed.relatedConcepts,
      };
    } catch (err) {
      console.warn('Gemini AI error for selected text, using smart educational fallback:', err);
    }
  }

  // Fallback AI explanation generator
  return {
    explanation: `"${selectedText}" kavramı YKS (TYT-AYT) müfredatında önemli bir konudur.\n\n` +
      `**Konu Analizi ve Açıklaması:**\n` +
      `Seçtiğiniz bu ifade, temel ders prensipleri ve sınav soru tipleri açısından kritik bir yere sahiptir. ` +
      `ÖSYM sorularında bu kavram doğrudan tanım olarak veya çeldirici şıklarda soru kökü olarak sıkça karşımıza çıkar.\n\n` +
      `**Örnek Yaklaşım Stratejisi:**\n` +
      `Sorularda bu kavramı gördüğünüzde öncelikle tanımın kapsadığı sınırları belirleyin ve temel formül/mantık bağıntısı ile ilişkilendirin.`,
    keyTakeaway: `Püf Noktası: "${selectedText.slice(0, 30)}..." konusu sorularında temel tanım mantığını unutmayın ve çeldirici şıklara dikkat edin.`,
    relatedConcepts: ['YKS Müfredat Mantığı', 'ÖSYM Soru Tipleri', 'Sorularda Püf Noktaları']
  };
}

export async function generateQuestionFromAI(
  topic: string,
  _difficulty: Difficulty = 'advanced',
  apiKey?: string,
  modelName: string = 'gemini-2.5-flash'
): Promise<Question> {
  const randomSeed = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Check if embedded reference questions exist for this topic
  const matchingTopicKey = Object.keys(FALLBACK_TOPICS_DATABASE).find(
    t => t.toLowerCase() === topic.toLowerCase() || topic.toLowerCase().includes(t.toLowerCase())
  );
  const refQuestions = matchingTopicKey ? FALLBACK_TOPICS_DATABASE[matchingTopicKey] : null;
  const refSamplePrompt = refQuestions && refQuestions.length > 0 
    ? `\nÖNEMLİ FORMAT VE DİL KURALI:\nBu konuyla ilgili veritabanımızda aşağıdaki gömülü orijinal örnek sorular bulunmaktadır:\n${JSON.stringify(refQuestions.slice(0, 3).map(q => ({ questionText: q.questionText, options: q.options })))} \nLÜTFEN ÜRETECEĞİN YENİ SORUYU YUKARIDAKİ ÖRNEK GÖMÜLÜ SORULARIN TAM OLARAK FORMATINDA, DİLİNDE, ZORLUĞUNDA VE AKADEMİK TARZINDA ÜRET!\n`
    : '';

  // If API key is available, attempt real Gemini call
  if (apiKey && apiKey.trim().length > 5) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Sen Türkiye ÖSYM ve Uluslararası Oxford sınav formatlarına tam hakim uzman bir eğitimci ve öğretmensin.
Bana "${topic}" konusu hakkında "advanced" (İLERİ SEVİYE) derecesinde 1 adet çoktan seçmeli, ÖĞRETİCİ, ANALİTİK DÜŞÜNDÜREN ve YEPYENİ bir soru hazırla.
${refSamplePrompt}
ÇOK ÖNEMLİ UNIQNESS VE ÇEŞİTLİLİK KURALLARI:
- Rastgele Tohum (Seed): ${randomSeed}
- Zorluk Derecesi: Kesinlikle İLERİ SEVİYE (Advanced).
- Soru tam olarak 5 adet şıktan (A, B, C, D, E) oluşmalıdır.
- Yanıtı SADECE geçerli bir JSON formatında döndür. Markdown backtick ekleme.

İstenen JSON Yapısı:
{
  "questionText": "Soru metni buraya",
  "svgDiagram": "<svg ...></svg>", // Opsiyonel SVG görseli
  "options": [
    { "id": "A", "text": "Şık A metni", "isCorrect": false },
    { "id": "B", "text": "Şık B metni", "isCorrect": true },
    { "id": "C", "text": "Şık C metni", "isCorrect": false },
    { "id": "D", "text": "Şık D metni", "isCorrect": false },
    { "id": "E", "text": "Şık E metni", "isCorrect": false }
  ],
  "correctOptionId": "B",
  "explanation": {
    "whyCorrect": "Doğru cevabın detaylı öğretici açıklaması...",
    "whyOthersIncorrect": {
      "A": "A şıkkının neden yanlış olduğunun açıklaması",
      "C": "C şıkkının neden yanlış olduğunun açıklaması",
      "D": "D şıkkının neden yanlış olduğunun açıklaması",
      "E": "E şıkkının neden yanlış olduğunun açıklaması"
    },
    "topicSummary": "Bu konu hakkında öğrenilmesi gereken kısa ve özet ders notu...",
    "keyTakeaway": "Aklıda kalması gereken altın kural veya özet."
  }
}
`;

      const response = await ai.models.generateContent({
        model: modelName || 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const q: Question = {
        id: `q_gemini_${randomSeed}`,
        topic,
        difficulty: 'advanced',
        questionText: parsed.questionText,
        svgDiagram: parsed.svgDiagram,
        options: parsed.options,
        correctOptionId: parsed.correctOptionId,
        explanation: parsed.explanation,
        createdAt: Date.now(),
      };
      return shuffleQuestionOptions(q);
    } catch (err) {
      console.warn('Gemini API call error, falling back to smart dynamic generator:', err);
    }
  }

  // Fallback / Demo Smart Dynamic Question Generator
  const rawQ = generateDynamicFallbackQuestion(topic, 'advanced');
  return shuffleQuestionOptions(rawQ);
}

function generateDynamicFallbackQuestion(topic: string, _difficulty: Difficulty = 'advanced'): Question {
  // Check predefined database first
  const matchingTopicKey = Object.keys(FALLBACK_TOPICS_DATABASE).find(
    t => t.toLowerCase() === topic.toLowerCase() || topic.toLowerCase().includes(t.toLowerCase())
  );

  if (matchingTopicKey && FALLBACK_TOPICS_DATABASE[matchingTopicKey].length > 0) {
    const list = FALLBACK_TOPICS_DATABASE[matchingTopicKey];
    const item = list[Math.floor(Math.random() * list.length)];
    return {
      ...item,
      id: `q_fallback_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      topic,
      difficulty: 'advanced',
    };
  }

  const randomSeed = Math.random().toString(36).substring(2, 7);
  const angle = QUESTION_ANGLES[Math.floor(Math.random() * QUESTION_ANGLES.length)];
  
  const optionLabels = ['A', 'B', 'C', 'D', 'E'];
  const correctIdx = Math.floor(Math.random() * 5);
  const correctLabel = optionLabels[correctIdx];

  const optionTexts: Record<string, string> = {
    'A': `${topic} alanında ${angle} bakımından en kapsayıcı ve ileri seviye bilimsel kural`,
    'B': `${topic} ile ilişkili kabul edilen ancak kısıtlı ikincil teori`,
    'C': `Klasik teoriden kalma çeldirici varsayım`,
    'D': `${topic} konusunun pratikte yapılan yanlış uygulaması`,
    'E': `Popüler kültürde ${topic} sanılan fakat farklı disipline ait tanım`
  };

  const correctText = optionTexts['A'];
  const incorrectTexts = [optionTexts['B'], optionTexts['C'], optionTexts['D'], optionTexts['E']];

  let incIdx = 0;
  const options = optionLabels.map((label) => {
    const isCorrect = label === correctLabel;
    const text = isCorrect ? correctText : incorrectTexts[incIdx++];
    return {
      id: label,
      text: `${text} (Varyasyon #${randomSeed})`,
      isCorrect,
    };
  });

  const whyOthers: Record<string, string> = {};
  optionLabels.forEach(l => {
    if (l !== correctLabel) {
      whyOthers[l] = `${l} şıkkı, ${topic} konusunda "${angle}" açısından çeldirici seçenektir.`;
    }
  });

  return {
    id: `q_dyn_${Date.now()}_${randomSeed}`,
    topic,
    difficulty: 'advanced',
    questionText: `"${topic}" konusu ele alındığında, ${angle} açısından aşağıdakilerden hangisi İLERİ SEVİYE teorik olarak DOĞRUDUR? (Soru #${randomSeed})`,
    options,
    correctOptionId: correctLabel,
    explanation: {
      whyCorrect: `${correctLabel} seçeneği, ${topic} alanında "${angle}" konusunun özünü tam olarak açıklar.`,
      whyOthersIncorrect: whyOthers,
      topicSummary: `"${topic}", ileri seviye analiz gerektiren kritik bir alandır.`,
      keyTakeaway: `${topic} konusunda temel ilke ${correctLabel} seçeneğinde verilmiştir.`,
    },
    createdAt: Date.now(),
  };
}

// EMBEDDED FLASHCARDS PROVIDER
export function getPreloadedFlashcards(
  topic: string,
  count: number = 5
): Flashcard[] {
  return generateDynamicFallbackFlashcards(topic, count);
}

function generateDynamicFallbackFlashcards(topic: string, count: number): Flashcard[] {
  const seed = Math.random().toString(36).substring(2, 6);

  if (topic.toLowerCase().includes('matematik') || topic.toLowerCase().includes('tyt')) {
    return [
      {
        id: `fc_tyt_math_${seed}_1`,
        topic,
        frontTitle: 'Fonksiyonlarda Bileşke & Ters',
        frontCategory: 'Fonksiyonlar',
        backExplanation: '(f o g)(x) = f(g(x)) demektir. f(x) fonksiyonunun tersini bulmak için y = f(x) yazılıp x yalnız bırakılır.',
        backExample: 'f(x) = 2x + 3 ise tersi f⁻¹(x) = (x - 3) / 2 olur.',
        backKeyPoint: '(f o f⁻¹)(x) = x (Bileşke ve ters birbirini nötürler).'
      },
      {
        id: `fc_tyt_math_${seed}_2`,
        topic,
        frontTitle: 'Mutlak Değerli Eşitsizlikler',
        frontCategory: 'Eşitsizlikler',
        backExplanation: '|x| ≤ a ise -a ≤ x ≤ a şeklinde açılır. |x| ≥ a ise x ≥ a veya x ≤ -a şeklinde iki ayrı durum incelenir.',
        backExample: '|x - 3| ≤ 5 => -5 ≤ x - 3 ≤ 5 => -2 ≤ x ≤ 8.',
        backKeyPoint: 'Mutlak değerli bir ifadenin sonucu asla negatif olamaz (|x| ≥ 0).'
      },
      {
        id: `fc_tyt_math_${seed}_3`,
        topic,
        frontTitle: 'Dairesel Permütasyon',
        frontCategory: 'Sayma & Olasılık',
        backExplanation: 'n elemanın yuvarlak bir masa etrafına farklı dizilim sayısı (n - 1)! tanedir. 1 eleman sabitleme görevi görür.',
        backExample: '5 kişi yuvarlak masaya (5 - 1)! = 4! = 24 farklı şekilde oturur.',
        backKeyPoint: 'Düz sıraya dizilimde n!, dairesel dizilimde (n - 1)! kullanılır.'
      },
      {
        id: `fc_tyt_math_${seed}_4`,
        topic,
        frontTitle: 'Üslü ve Köklü İfadeler Kuralları',
        frontCategory: 'Temel Matematik',
        backExplanation: 'a^(m/n) = n. dereceden kök içinde (a^m). Çift dereceli köklerin içi negatif olamaz.',
        backExample: '√(x²) = |x| (Çift kök mutlak değer olarak çıkar).',
        backKeyPoint: 'Tabanlar aynıysa çarpımda üsler toplanır, bölmede çıkarılır.'
      },
      {
        id: `fc_tyt_math_${seed}_5`,
        topic,
        frontTitle: 'Problem Çözme Stratejisi (Oran-Orantı)',
        frontCategory: 'Problemler',
        backExplanation: 'Doğru orantıda çapraz çarpım (a/b = c/d => a·d = b·c), ters orantıda karşılıklı çarpım (a·b = c·d) eşitliği kullanılır.',
        backExample: 'İşçi problemlerinde birim zamanda yapılan iş miktarı üzerinden denklem kurulur.',
        backKeyPoint: 'Soruda verilen bağıntıyı tek bir bilinmeyen cinsinden yazmak çözümü kolaylaştırır.'
      }
    ];
  }

  const flashcards: Flashcard[] = [];
  const concepts = [
    {
      title: `${topic} Temel Mimarisi`,
      category: 'Kavramsal Altyapı',
      explain: `${topic} alanının üzerine inşa edildiği temel yapı taşları ve modüler bileşenlerdir. Sistem karmaşıklığını yönetmeyi sağlar.`,
      example: `${topic} sistemlerinde ilk adım verinin modüler olarak ayrıştırılmasıdır.`,
      key: 'Kavramsal mimariyi iyi bilmek problem çözümünü 3 kat hızlandırır.'
    },
    {
      title: `${topic} İleri Seviye Optimizasyonu`,
      category: 'Performans & Pratik',
      explain: `${topic} kullanılırken kaynak kullanımını minimize etme ve çalışma verimliliğini maksimuma çıkarma stratejisidir.`,
      example: `Gereksiz yükleri kaldırarak işleme süresini %40 oranında düşürebilirsiniz.`,
      key: 'Erken optimizasyondan kaçının; önce çalışan, sonra hızlı yapıyı kurun.'
    },
    {
      title: `${topic} Sık Yapılan Hatalar`,
      category: 'Kritik Dikkat Noktası',
      explain: `${topic} öğrenilirken ve uygulanırken en çok karşılaşılan kavram yanılgıları ve mantık hatalarıdır.`,
      example: `Yüzeysel tanımlarla yetinip alt mekanizmayı göz ardı etmek en yaygın hatadır.`,
      key: 'Varsayımlara dayanmak yerine her zaman kaynak dokümantasyonu kontrol edin.'
    },
    {
      title: `${topic} Pratik Kullanım Senaryosu`,
      category: 'Gerçek Dünya Uygulaması',
      explain: `${topic} kavramının endüstride ve günlük projelerde nasıl katma değer yarattığının canlı gösterimidir.`,
      example: `Büyük ölçekli sistemlerde güvenilirlik ve ölçeklenebilirlik sağlamak için kullanılır.`,
      key: 'Teori pratikle birleştiğinde kalıcı öğrenme gerçekleşir.'
    },
    {
      title: `${topic} Altın Kuralı & Geleceği`,
      category: 'Gelecek & Strateji',
      explain: `${topic} disiplininde başarılı olmak için asla unutulmaması gereken vizyonel özet.`,
      example: `Teknolojik gelişmelere uyum sağlarken temel prensipleri koruma yaklaşımı.`,
      key: 'Temel kavramlara hakim olan, gelecekteki tüm değişimlere kolayca adapte olur.'
    }
  ];

  for (let i = 0; i < Math.min(count, concepts.length); i++) {
    const item = concepts[i];
    flashcards.push({
      id: `fc_dyn_${Date.now()}_${seed}_${i}`,
      topic,
      frontTitle: item.title,
      frontCategory: item.category,
      backExplanation: item.explain,
      backExample: item.example,
      backKeyPoint: item.key,
      isLearned: false,
    });
  }

  return flashcards;
}
