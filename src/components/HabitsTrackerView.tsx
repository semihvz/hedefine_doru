import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface HabitItem {
  id: string;
  title: string;
  category: 'soru' | 'paragraf' | 'tekrar' | 'odak' | 'saglik' | 'diger';
  color: string;
  streak: number;
  completedDates: string[]; // YYYY-MM-DD
  createdAt: number;
}

const HABITS_STORAGE_KEY = 'hedefine_doru_habits';

const DEFAULT_HABITS: HabitItem[] = [
  {
    id: 'h_default_1',
    title: 'Günde En Az 50 Soru Çözümü',
    category: 'soru',
    color: 'bg-zinc-800',
    streak: 3,
    completedDates: [
      new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0],
    ],
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'h_default_2',
    title: 'Günlük 20 Paragraf & Problem Çözümü',
    category: 'paragraf',
    color: 'bg-zinc-800',
    streak: 5,
    completedDates: [
      new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
      new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
      new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0],
    ],
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'h_default_3',
    title: 'Erken Uyanış & Güne Başlangıç (07:00)',
    category: 'odak',
    color: 'bg-zinc-800',
    streak: 2,
    completedDates: [
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0],
    ],
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'h_default_4',
    title: 'Günlük Yanlış Soru & Not Tekrarı',
    category: 'tekrar',
    color: 'bg-zinc-800',
    streak: 1,
    completedDates: [
      new Date().toISOString().split('T')[0],
    ],
    createdAt: Date.now() - 86400000 * 10,
  }
];

export const HabitsTrackerView: React.FC = () => {
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<HabitItem['category']>('soru');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const raw = localStorage.getItem(HABITS_STORAGE_KEY);
    if (raw) {
      try {
        setHabits(JSON.parse(raw));
      } catch (e) {
        setHabits(DEFAULT_HABITS);
      }
    } else {
      setHabits(DEFAULT_HABITS);
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(DEFAULT_HABITS));
    }
  }, []);

  const saveHabits = (updated: HabitItem[]) => {
    setHabits(updated);
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleToggleHabitToday = (id: string) => {
    const updated = habits.map(habit => {
      if (habit.id !== id) return habit;

      const isCompletedToday = habit.completedDates.includes(todayStr);
      let newDates: string[];
      let newStreak = habit.streak;

      if (isCompletedToday) {
        newDates = habit.completedDates.filter(d => d !== todayStr);
        newStreak = Math.max(0, habit.streak - 1);
      } else {
        newDates = [...habit.completedDates, todayStr];
        newStreak = habit.streak + 1;

        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 }
        });
      }

      return {
        ...habit,
        streak: newStreak,
        completedDates: newDates,
      };
    });

    saveHabits(updated);
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHabit: HabitItem = {
      id: `h_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: newTitle.trim(),
      category: newCategory,
      color: 'bg-zinc-800',
      streak: 0,
      completedDates: [],
      createdAt: Date.now(),
    };

    const updated = [newHabit, ...habits];
    saveHabits(updated);
    setNewTitle('');
    setShowAddModal(false);
  };

  const handleDeleteHabit = (id: string) => {
    if (window.confirm('Bu alışkanlığı silmek istediğinize emin misiniz?')) {
      const updated = habits.filter(h => h.id !== id);
      saveHabits(updated);
    }
  };

  const totalHabits = habits.length;
  const completedTodayCount = habits.filter(h => h.completedDates.includes(todayStr)).length;
  const completionRate = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - 86400000 * (6 - i));
    return d.toISOString().split('T')[0];
  });

  const getCategoryBadge = (cat: HabitItem['category']) => {
    switch (cat) {
      case 'soru': return { label: 'SORU HEDEFİ' };
      case 'paragraf': return { label: 'PARAGRAF / PROBLEM' };
      case 'tekrar': return { label: 'DERS TEKRARI' };
      case 'odak': return { label: 'ODAK & DİSİPLİN' };
      case 'saglik': return { label: 'SAĞLIK & YAŞAM' };
      default: return { label: 'ÖZEL RUTİN' };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* BlackRock Minimal Header Banner */}
      <div className="bg-[#111115] border border-zinc-800 rounded-sm p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase block mb-1">
              PERFORMANS VE RUTİN TAKİBİ
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Alışkanlık & Zinciri Kırma Portalı
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
              Günlük çalışma sürekliliğinizi, paragraf pratiklerinizi ve ders tekrarlarınızı izleyin.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-zinc-100 hover:bg-white text-black font-bold text-xs tracking-wider uppercase rounded-sm transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Alışkanlık</span>
          </button>
        </div>

        {/* Minimal Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-800/80">
          <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-sm">
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase block mb-1">
              BUGÜNKÜ İLERLEME
            </span>
            <div className="text-lg font-bold text-white flex items-baseline gap-1">
              <span>%{completionRate}</span>
              <span className="text-[11px] text-zinc-500 font-normal">({completedTodayCount}/{totalHabits})</span>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-sm">
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase block mb-1">
              EN YÜKSEK SERİ
            </span>
            <div className="text-lg font-bold text-amber-300">
              {maxStreak} <span className="text-xs font-normal text-zinc-400">GÜN</span>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-sm">
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase block mb-1">
              AKTİF RUTİNLER
            </span>
            <div className="text-lg font-bold text-zinc-200">
              {totalHabits} <span className="text-xs font-normal text-zinc-400">ADET</span>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-sm">
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase block mb-1">
              DURUM
            </span>
            <div className="text-lg font-bold text-white">
              {completionRate >= 80 ? 'Yüksek' : completionRate >= 50 ? 'Orta' : 'Başlangıç'}
            </div>
          </div>
        </div>
      </div>

      {/* Habits List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map((habit) => {
          const isCompletedToday = habit.completedDates.includes(todayStr);
          const badge = getCategoryBadge(habit.category);

          return (
            <div
              key={habit.id}
              className={`p-5 bg-[#111115] border rounded-sm transition-all ${
                isCompletedToday ? 'border-zinc-600 bg-zinc-900/40' : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-400 rounded-sm uppercase">
                    {badge.label}
                  </span>
                  <h4 className={`text-sm font-semibold mt-2 ${isCompletedToday ? 'text-zinc-400 line-through' : 'text-white'}`}>
                    {habit.title}
                  </h4>
                </div>

                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                  title="Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                <div className="flex items-center gap-1.5 text-xs font-medium text-amber-300">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{habit.streak} Gün Seri</span>
                </div>

                <button
                  onClick={() => handleToggleHabitToday(habit.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase rounded-sm transition-all flex items-center gap-1.5 ${
                    isCompletedToday
                      ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      : 'bg-zinc-100 hover:bg-white text-black'
                  }`}
                >
                  {isCompletedToday ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Tamamlandı</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5" />
                      <span>Tamamla</span>
                    </>
                  )}
                </button>
              </div>

              {/* 7 Days History Dot Matrix */}
              <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-medium uppercase">Son 7 Gün:</span>
                <div className="flex items-center gap-1.5">
                  {last7Days.map((dateStr, idx) => {
                    const done = habit.completedDates.includes(dateStr);
                    return (
                      <div
                        key={idx}
                        className={`w-5 h-5 rounded-sm flex items-center justify-center text-[9px] font-bold ${
                          done ? 'bg-zinc-100 text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-600'
                        }`}
                      >
                        {done ? <Check className="w-3 h-3" /> : '•'}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#111115] border border-zinc-800 rounded-sm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Yeni Alışkanlık Oluştur
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Başlık
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: Günde 50 Paragraf Çözümü"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Kategori
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as HabitItem['category'])}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-600"
                >
                  <option value="soru">Soru Hedefi</option>
                  <option value="paragraf">Paragraf / Problem</option>
                  <option value="tekrar">Ders Tekrarı</option>
                  <option value="odak">Odak & Disiplin</option>
                  <option value="saglik">Sağlık & Yaşam</option>
                  <option value="diger">Özel Rutin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-zinc-800 text-zinc-300 text-xs font-medium rounded-sm hover:bg-zinc-900"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-100 hover:bg-white text-black text-xs font-bold uppercase tracking-wider rounded-sm"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

