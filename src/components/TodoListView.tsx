import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  AlertCircle,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface TodoTask {
  id: string;
  title: string;
  subject: 'Matematik' | 'Türkçe' | 'Fen Bilimleri' | 'Sosyal Bilgiler' | 'YDT / İngilizce' | 'Genel YKS';
  priority: 'yuksek' | 'orta' | 'dusuk';
  durationMinutes: number;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: number;
  createdAt: number;
}

const TODOS_STORAGE_KEY = 'hedefine_doru_todos';

const INITIAL_TODOS: TodoTask[] = [
  {
    id: 'todo_def_1',
    title: 'Matematik Logaritma Konusundan 30 Soru Çöz',
    subject: 'Matematik',
    priority: 'yuksek',
    durationMinutes: 45,
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    createdAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'todo_def_2',
    title: 'Günlük 20 Paragraf Sorusu & Analizi',
    subject: 'Türkçe',
    priority: 'yuksek',
    durationMinutes: 30,
    dueDate: new Date().toISOString().split('T')[0],
    completed: true,
    completedAt: Date.now() - 3600000,
    createdAt: Date.now() - 3600000 * 8,
  },
  {
    id: 'todo_def_3',
    title: 'Fizik Hareket Yasaları Formül Tekrarı',
    subject: 'Fen Bilimleri',
    priority: 'orta',
    durationMinutes: 25,
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'todo_def_4',
    title: 'Tarih İlk Çağ Uygarlıkları Özet Çıkarımı',
    subject: 'Sosyal Bilgiler',
    priority: 'dusuk',
    durationMinutes: 40,
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    completed: false,
    createdAt: Date.now() - 3600000 * 1,
  }
];

export const TodoListView: React.FC = () => {
  const [todos, setTodos] = useState<TodoTask[]>([]);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'yuksek' | 'orta' | 'dusuk'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  // New task form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubject, setNewSubject] = useState<TodoTask['subject']>('Matematik');
  const [newPriority, setNewPriority] = useState<TodoTask['priority']>('yuksek');
  const [newDuration, setNewDuration] = useState<number>(30);
  const [newDueDate, setNewDueDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const raw = localStorage.getItem(TODOS_STORAGE_KEY);
    if (raw) {
      try {
        setTodos(JSON.parse(raw));
      } catch (e) {
        setTodos(INITIAL_TODOS);
      }
    } else {
      setTodos(INITIAL_TODOS);
      localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(INITIAL_TODOS));
    }
  }, []);

  const saveTodos = (updated: TodoTask[]) => {
    setTodos(updated);
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleToggleTask = (id: string) => {
    const updated = todos.map(todo => {
      if (todo.id !== id) return todo;
      const isNowCompleted = !todo.completed;

      if (isNowCompleted) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 }
        });
      }

      return {
        ...todo,
        completed: isNowCompleted,
        completedAt: isNowCompleted ? Date.now() : undefined,
      };
    });

    saveTodos(updated);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TodoTask = {
      id: `todo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: newTitle.trim(),
      subject: newSubject,
      priority: newPriority,
      durationMinutes: Number(newDuration) || 30,
      dueDate: newDueDate,
      completed: false,
      createdAt: Date.now(),
    };

    const updated = [newTask, ...todos];
    saveTodos(updated);
    
    // Reset Form
    setNewTitle('');
    setShowAddForm(false);
  };

  const handleDeleteTask = (id: string) => {
    const updated = todos.filter(t => t.id !== id);
    saveTodos(updated);
  };

  const handleClearCompleted = () => {
    if (window.confirm('Tamamlanan tüm görevleri silmek istediğinize emin misiniz?')) {
      const updated = todos.filter(t => !t.completed);
      saveTodos(updated);
    }
  };

  // Filtered Todos
  const filteredTodos = todos.filter(todo => {
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = todo.title.toLowerCase().includes(q);
      const matchSubject = todo.subject.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject) return false;
    }

    // Status match
    if (statusFilter === 'pending' && todo.completed) return false;
    if (statusFilter === 'completed' && !todo.completed) return false;

    // Priority match
    if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;

    // Subject match
    if (subjectFilter !== 'all' && todo.subject !== subjectFilter) return false;

    return true;
  });

  // Calculate statistics
  const totalCount = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const highPriorityPendingCount = todos.filter(t => !t.completed && t.priority === 'yuksek').length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getPriorityBadge = (p: TodoTask['priority']) => {
    switch (p) {
      case 'yuksek': return { label: 'Yüksek Öncelik', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold' };
      case 'orta': return { label: 'Orta Öncelik', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      default: return { label: 'Düşük Öncelik', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    }
  };

  const getSubjectBadgeColor = (sub: TodoTask['subject']) => {
    switch (sub) {
      case 'Matematik': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'Türkçe': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Fen Bilimleri': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Sosyal Bilgiler': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'YDT / İngilizce': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 border border-slate-800/80 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                YKS Görev & Çalışma Planlayıcı
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Yapılacaklar Listesi (Todo List) 📝
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Günlük ders hedeflerinizi planlayın, soru çözümlerini takvime ekleyin ve tamamlanan görevlerle sınav maratonunu adım adım fethedin!
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Görev Ekle</span>
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tamamlanma Oranı</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white flex items-baseline gap-1">
              <span>%{completionPercent}</span>
              <span className="text-xs text-slate-400 font-normal">({completedCount}/{totalCount})</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Bekleyen Görevler</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-300">
              {pendingCount} <span className="text-xs text-slate-400 font-normal">Görev</span>
            </div>
            <p className="text-[10px] text-amber-400/80 mt-1">Bugün bitirilmeli</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Yüksek Öncelikli</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-400">
              {highPriorityPendingCount} <span className="text-xs text-slate-400 font-normal">Acil</span>
            </div>
            <p className="text-[10px] text-rose-400/80 mt-1">Öncelikli çalışma hedefi</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Tamamlanan</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-purple-300">
              {completedCount} <span className="text-xs text-slate-400 font-normal">Başarılı</span>
            </div>
            <p className="text-[10px] text-purple-400/80 mt-1">Harika performans!</p>
          </div>
        </div>
      </div>

      {/* Quick Add Input Bar */}
      <form onSubmit={handleCreateTask} className="p-2 sm:p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 shadow-lg">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Hızlı yeni görev yazın (örn: Trigonometri 30 soru çöz)..."
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 disabled:opacity-40 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Hızlı Ekle</span>
        </button>
      </form>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Görevlerde ara..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Status Tabs & Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tümü ({todos.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'pending' ? 'bg-amber-950/60 border border-amber-500/30 text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bekleyen ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'completed' ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tamamlanan ({completedCount})
            </button>
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">Tüm Öncelikler</option>
            <option value="yuksek">🔴 Yüksek Öncelik</option>
            <option value="orta">🟡 Orta Öncelik</option>
            <option value="dusuk">🟢 Düşük Öncelik</option>
          </select>

          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">Tüm Dersler</option>
            <option value="Matematik">Matematik</option>
            <option value="Türkçe">Türkçe</option>
            <option value="Fen Bilimleri">Fen Bilimleri</option>
            <option value="Sosyal Bilgiler">Sosyal Bilgiler</option>
            <option value="YDT / İngilizce">YDT / İngilizce</option>
            <option value="Genel YKS">Genel YKS</option>
          </select>

          {completedCount > 0 && (
            <button
              onClick={handleClearCompleted}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/50 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Tamamlananları temizle"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Temizle</span>
            </button>
          )}

        </div>
      </div>

      {/* Task List Section */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
            <CheckSquare className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-300">Henüz Görev Bulunmuyor</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Seçilen filtrelere uygun görev bulunamadı. Yukarıdaki form ile yeni YKS çalışma görevi ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const priorityBadge = getPriorityBadge(todo.priority);
            const subjectBadgeColor = getSubjectBadgeColor(todo.subject);
            const isToday = todo.dueDate === todayStr;

            return (
              <div
                key={todo.id}
                className={`p-4 sm:p-5 rounded-2xl bg-slate-900/90 border transition-all duration-200 flex items-start justify-between gap-4 group ${
                  todo.completed
                    ? 'border-slate-800/80 bg-slate-950/60 opacity-75'
                    : todo.priority === 'yuksek'
                    ? 'border-rose-500/30 hover:border-rose-500/50 shadow-md shadow-rose-500/5'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Left Toggle Checkbox */}
                <button
                  onClick={() => handleToggleTask(todo.id)}
                  className="mt-0.5 shrink-0 hover:scale-110 active:scale-95 transition-transform"
                >
                  {todo.completed ? (
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-700 group-hover:border-indigo-500 flex items-center justify-center transition-colors">
                      <Square className="w-4 h-4 text-slate-600 group-hover:text-indigo-400" />
                    </div>
                  )}
                </button>

                {/* Task Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Subject Badge */}
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${subjectBadgeColor}`}>
                      {todo.subject}
                    </span>
                    {/* Priority Badge */}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityBadge.color}`}>
                      {priorityBadge.label}
                    </span>
                    {/* Target Duration */}
                    <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{todo.durationMinutes} dk</span>
                    </span>
                    {/* Due Date Badge */}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                      isToday ? 'bg-amber-950/60 border-amber-500/30 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}>
                      <Calendar className="w-3 h-3" />
                      <span>{isToday ? 'Bugün' : todo.dueDate}</span>
                    </span>
                  </div>

                  <p className={`text-sm sm:text-base font-semibold leading-relaxed ${
                    todo.completed ? 'text-slate-400 line-through' : 'text-slate-100'
                  }`}>
                    {todo.title}
                  </p>
                </div>

                {/* Right Action Menu */}
                <button
                  onClick={() => handleDeleteTask(todo.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors opacity-80 group-hover:opacity-100"
                  title="Görevi Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Detailed Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Yeni Görev Planla</span>
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Görev Tanımı
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: AYT Fizik Vektörler 40 Soru Çözümü..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Ders / Alan
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Matematik">Matematik</option>
                    <option value="Türkçe">Türkçe</option>
                    <option value="Fen Bilimleri">Fen Bilimleri</option>
                    <option value="Sosyal Bilgiler">Sosyal Bilgiler</option>
                    <option value="YDT / İngilizce">YDT / İngilizce</option>
                    <option value="Genel YKS">Genel YKS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Öncelik Derecesi
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="yuksek">🔴 Yüksek Öncelik</option>
                    <option value="orta">🟡 Orta Öncelik</option>
                    <option value="dusuk">🟢 Düşük Öncelik</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Tahmini Süre (Dakika)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Hedef Tarih
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
                >
                  Görevi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
