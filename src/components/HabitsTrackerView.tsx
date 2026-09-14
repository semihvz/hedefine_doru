import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Sparkles, 
  Trophy, 
  Calendar, 
  Target, 
  Zap,
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
    color: 'from-indigo-600 to-purple-600',
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
    color: 'from-amber-500 to-orange-600',
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
    color: 'from-emerald-500 to-teal-600',
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
    color: 'from-purple-600 to-pink-600',
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
        // Remove today
        newDates = habit.completedDates.filter(d => d !== todayStr);
        newStreak = Math.max(0, habit.streak - 1);
      } else {
        // Add today
        newDates = [...habit.completedDates, todayStr];
        newStreak = habit.streak + 1;

        // Trigger celebratory confetti
        confetti({
          particleCount: 50,
          spread: 60,
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
      color: 'from-indigo-600 to-purple-600',
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

  // Stats calculation
  const totalHabits = habits.length;
  const completedTodayCount = habits.filter(h => h.completedDates.includes(todayStr)).length;
  const completionRate = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  // Generate last 7 days strings
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - 86400000 * (6 - i));
    return d.toISOString().split('T')[0];
  });

  const getCategoryBadge = (cat: HabitItem['category']) => {
    switch (cat) {
      case 'soru': return { label: 'Soru Hedefi', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'paragraf': return { label: 'Paragraf / Problem', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'tekrar': return { label: 'Ders Tekrarı', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'odak': return { label: 'Odak & Disiplin', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'saglik': return { label: 'Sağlık & Yaşam', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      default: return { label: 'Özel Alışkanlık', bg: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Banner & Statistics */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-slate-800/80 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                YKS Alışkanlık Takibi
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Günlük Disiplin & Zinciri Kırma 🚀
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Düzenli soru çözümü, günlük paragraf pratikleri ve rutinlerinizi takip edin. Zinciri kırmayarak dereceye bir adım daha yaklaşın!
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Alışkanlık Ekle</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Bugünkü İlerleme</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white flex items-baseline gap-1">
              <span>%{completionRate}</span>
              <span className="text-xs text-slate-400 font-normal">({completedTodayCount}/{totalHabits})</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>En Yüksek Seri</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-300">
              {maxStreak} <span className="text-xs text-slate-400 font-normal">Gün</span>
            </div>
            <p className="text-[10px] text-amber-400/80 mt-1">Zinciri kırmadan devam!</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span>Aktif Rutinler</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-purple-300">
              {totalHabits} <span className="text-xs text-slate-400 font-normal">Alışkanlık</span>
            </div>
            <p className="text-[10px] text-purple-400/80 mt-1">Her gün düzenli takip</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Motivasyon Seviyesi</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">
              {completionRate >= 80 ? 'Süper 🚀' : completionRate >= 50 ? 'İyi 👍' : 'Hadi Başla 💪'}
            </div>
            <p className="text-[10px] text-emerald-400/80 mt-1">Sınav maratonuna odaklan</p>
          </div>
        </div>
      </div>

      {/* Habits List Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-400" />
          <span>Alışkanlık Listem</span>
        </h3>
        <span className="text-xs text-slate-400">Bugünün Tarihi: {new Date().toLocaleDateString('tr-TR')}</span>
      </div>

      {/* Habits Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map((habit) => {
          const isCompletedToday = habit.completedDates.includes(todayStr);
          const badge = getCategoryBadge(habit.category);

          return (
            <div
              key={habit.id}
              className={`p-5 rounded-3xl bg-slate-900/90 border transition-all duration-300 ${
                isCompletedToday
                  ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <h4 className={`text-base font-bold mt-2 ${isCompletedToday ? 'text-slate-100 line-through opacity-80' : 'text-white'}`}>
                    {habit.title}
                  </h4>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Alışkanlığı Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Action Checkbox & Streak Badge */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                {/* Streak Tag */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
                  <Flame className={`w-4 h-4 ${habit.streak > 0 ? 'text-amber-400 fill-amber-400 animate-bounce-short' : 'text-slate-600'}`} />
                  <span className="text-xs font-bold text-amber-300">{habit.streak} Gün Seri</span>
                </div>

                {/* Main Toggle Button */}
                <button
                  onClick={() => handleToggleHabitToday(habit.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isCompletedToday
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-md shadow-emerald-500/10'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isCompletedToday ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Tamamlandı</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-white/80" />
                      <span>Bugün Yap</span>
                    </>
                  )}
                </button>
              </div>

              {/* Last 7 Days Visual Progress */}
              <div className="mt-4 pt-3 border-t border-slate-800/40 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-semibold">Son 7 Gün:</span>
                <div className="flex items-center gap-1.5">
                  {last7Days.map((dateStr, idx) => {
                    const done = habit.completedDates.includes(dateStr);
                    const isToday = dateStr === todayStr;

                    return (
                      <div
                        key={idx}
                        title={`${dateStr}: ${done ? 'Tamamlandı' : 'Tamamlanmadı'}`}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold transition-transform ${
                          done
                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                            : 'bg-slate-950 border border-slate-800 text-slate-600'
                        } ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
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

      {/* Add New Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Yeni Alışkanlık Oluştur</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Alışkanlık Başlığı
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: Günde 100 Soru Çözümü..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Kategori
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as HabitItem['category'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="soru">Soru Hedefi</option>
                  <option value="paragraf">Paragraf / Problem</option>
                  <option value="tekrar">Ders Tekrarı</option>
                  <option value="odak">Odak & Disiplin</option>
                  <option value="saglik">Sağlık & Yaşam</option>
                  <option value="diger">Diğer / Özel</option>
                </select>
              </div>

              {/* Quick Template Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Hızlı Şablonlar:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Günde 100 TYT Sorusu',
                    '2 Saat Odaklı Etüt',
                    'Matematik Formül Tekrarı',
                    'Kelime & YDT Ezberi'
                  ].map((temp, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setNewTitle(temp)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-indigo-300 hover:bg-slate-700 transition-colors"
                    >
                      + {temp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all"
                >
                  Ekle & Başla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
