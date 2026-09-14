import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Search, 
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
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'yuksek' | 'orta' | 'dusuk'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubject, setNewSubject] = useState<TodoTask['subject']>('Matematik');
  const [newPriority, setNewPriority] = useState<TodoTask['priority']>('yuksek');
  const [newDuration] = useState<number>(30);
  const [newDueDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

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
          particleCount: 30,
          spread: 40,
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

  const filteredTodos = todos.filter(todo => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = todo.title.toLowerCase().includes(q);
      const matchSubject = todo.subject.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject) return false;
    }

    if (statusFilter === 'pending' && todo.completed) return false;
    if (statusFilter === 'completed' && !todo.completed) return false;
    if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;
    if (subjectFilter !== 'all' && todo.subject !== subjectFilter) return false;

    return true;
  });

  const totalCount = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const highPriorityPendingCount = todos.filter(t => !t.completed && t.priority === 'yuksek').length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getPriorityBadge = (p: TodoTask['priority']) => {
    switch (p) {
      case 'yuksek': return { label: 'ACİL', color: 'text-rose-400 border-rose-900/60 bg-rose-950/20' };
      case 'orta': return { label: 'ORTA', color: 'text-amber-300 border-amber-900/60 bg-amber-950/20' };
      default: return { label: 'DÜŞÜK', color: 'text-zinc-400 border-zinc-800 bg-zinc-900' };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* BlackRock Minimal Header Banner */}
      <div className="bg-[#111115] border border-zinc-800 rounded-sm p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase block mb-1">
              HEDEF VE ETÜT PLANLAYICI
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              YKS Çalışma & Görev Yönetimi
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
              Günlük ders hedeflerinizi organize edin ve öncelik sırasına göre tamamlayın.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-zinc-100 hover:bg-white text-black font-bold text-xs tracking-wider uppercase rounded-sm transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Görev Planla</span>
          </button>
        </div>

        {/* Minimal Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-800/80">
          <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-sm">
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase block mb-1">
              TAMAMLANMA ORANI
            </span>
            <div className="text-lg font-bold text-white flex items-baseline gap-1">
              <span>%{completionPercent}</span>
              <span className="text-[11px] text-zinc-500 font-normal">({completedCount}/{totalCount})</span>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-sm">
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase block mb-1">
              BEKLEYEN GÖREVLER
            </span>
            <div className="text-lg font-bold text-amber-300">
              {pendingCount} <span className="text-xs font-normal text-zinc-400">ADET</span>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-sm">
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase block mb-1">
              YÜKSEK ÖNCELİKLİ
            </span>
            <div className="text-lg font-bold text-rose-400">
              {highPriorityPendingCount} <span className="text-xs font-normal text-zinc-400">ACİL</span>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-sm">
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase block mb-1">
              TAMAMLANAN
            </span>
            <div className="text-lg font-bold text-zinc-200">
              {completedCount} <span className="text-xs font-normal text-zinc-400">ADET</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Bar */}
      <form onSubmit={handleCreateTask} className="p-2 bg-[#111115] border border-zinc-800 rounded-sm flex items-center gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Hızlı görev ekleyin..."
          className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-black font-bold text-xs uppercase tracking-wider rounded-sm disabled:opacity-40 transition-all flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ekle</span>
        </button>
      </form>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#111115] border border-zinc-800 rounded-sm">
        <div className="relative flex-1 max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Görevlerde ara..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-sm pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-800 rounded-sm px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none"
          >
            <option value="all">Tüm Durumlar ({todos.length})</option>
            <option value="pending">Bekleyen ({pendingCount})</option>
            <option value="completed">Tamamlanan ({completedCount})</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-800 rounded-sm px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none"
          >
            <option value="all">Tüm Öncelikler</option>
            <option value="yuksek">Acil / Yüksek</option>
            <option value="orta">Orta</option>
            <option value="dusuk">Düşük</option>
          </select>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-sm px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none"
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
              className="p-1.5 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-sm"
              title="Tamamlananları Temizle"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Task Rows */}
      <div className="space-y-2">
        {filteredTodos.length === 0 ? (
          <div className="p-8 text-center bg-[#111115] border border-zinc-800 rounded-sm space-y-2">
            <CheckSquare className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400 font-medium">Kriterlere uygun görev bulunamadı.</p>
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const priorityBadge = getPriorityBadge(todo.priority);

            return (
              <div
                key={todo.id}
                className={`p-4 bg-[#111115] border rounded-sm flex items-center justify-between gap-4 transition-all ${
                  todo.completed
                    ? 'border-zinc-800/60 opacity-60'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleTask(todo.id)}
                    className="shrink-0"
                  >
                    {todo.completed ? (
                      <div className="w-5 h-5 bg-zinc-100 text-black rounded-sm flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 border border-zinc-700 hover:border-zinc-400 rounded-sm" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-sm uppercase">
                        {todo.subject}
                      </span>
                      <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 border rounded-sm uppercase ${priorityBadge.color}`}>
                        {priorityBadge.label}
                      </span>
                      <span className="text-[9px] text-zinc-500">
                        {todo.durationMinutes} dk
                      </span>
                    </div>

                    <p className={`text-xs font-medium ${todo.completed ? 'text-zinc-500 line-through' : 'text-zinc-100'}`}>
                      {todo.title}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTask(todo.id)}
                  className="p-1 text-zinc-500 hover:text-white transition-colors"
                  title="Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#111115] border border-zinc-800 rounded-sm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Yeni Görev Planla
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Görev Tanımı
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: Fizik Vektörler 40 Soru Çözümü"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-sm px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Ders
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-sm px-2.5 py-2 text-xs text-white focus:outline-none"
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
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Öncelik
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-sm px-2.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="yuksek">Acil / Yüksek</option>
                    <option value="orta">Orta</option>
                    <option value="dusuk">Düşük</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
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

