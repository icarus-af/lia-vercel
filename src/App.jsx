import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Timer, 
  BarChart3,
  Moon,
  Sun,
  LayoutDashboard,
  BrainCircuit,
  Settings
} from 'lucide-react';

// --- Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white",
    secondary: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white",
  };
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-medium transition-all active:scale-95 flex items-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const ProgressBar = ({ progress, colorClass = "bg-orange-500" }) => (
  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
    <div 
      className={`h-full transition-all duration-500 ${colorClass}`} 
      style={{ width: `${Math.min(100, progress)}%` }}
    />
  </div>
);

// --- Main App ---

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Cálculo Avançado - Cap 4', subject: 'Matemática', duration: 120, completed: false, priority: 'Alta', deadline: '2023-12-01' },
    { id: 2, title: 'Redação: Inteligência Artificial', subject: 'Português', duration: 90, completed: true, priority: 'Média', deadline: '2023-12-02' },
    { id: 3, title: 'Laboratório de Termodinâmica', subject: 'Física', duration: 180, completed: false, priority: 'Alta', deadline: '2023-11-30' },
  ]);

  const [view, setView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState(60);
  
  // Pomodoro State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // Statistics Calculation
  const totalHomeworkMinutes = tasks.reduce((acc, task) => acc + task.duration, 0);
  const completedHomeworkMinutes = tasks.filter(t => t.completed).reduce((acc, task) => acc + task.duration, 0);
  const workloadPercentage = 42; // Mock value based on the prompt (more than 40%)

  useEffect(() => {
    let interval = null;
    if (isActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timerSeconds]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const addTask = () => {
    if (!newTaskTitle) return;
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      subject: 'Geral',
      duration: parseInt(newTaskDuration),
      completed: false,
      priority: 'Média',
      deadline: new Date().toISOString().split('T')[0]
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen font-sans transition-colors duration-300`}>
      <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen flex">
        
        {/* Sidebar */}
        <nav className="w-20 md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col items-center md:items-start p-4 gap-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 dark:shadow-none">
              <BrainCircuit size={24} />
            </div>
            <h1 className="hidden md:block font-bold text-xl tracking-tight text-blue-900 dark:text-white">Nexus Study</h1>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <button onClick={() => setView('dashboard')} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
              <LayoutDashboard size={20} />
              <span className="hidden md:block font-medium">Dashboard</span>
            </button>
            <button onClick={() => setView('tasks')} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'tasks' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
              <BookOpen size={20} />
              <span className="hidden md:block font-medium">Lições</span>
            </button>
            <button onClick={() => setView('timer')} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'timer' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
              <Timer size={20} />
              <span className="hidden md:block font-medium">Foco</span>
            </button>
          </div>

          <div className="mt-auto w-full border-t border-slate-100 dark:border-slate-700 pt-4 flex flex-col gap-2">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span className="hidden md:block font-medium">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>
            <button className="flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700">
              <Settings size={20} />
              <span className="hidden md:block font-medium">Ajustes</span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Bom dia, Estudante Nexus</h2>
              <p className="text-slate-500 dark:text-slate-400">Você tem {tasks.filter(t => !t.completed).length} tarefas pendentes hoje.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <Calendar size={18} className="text-blue-500" />
              <span className="font-medium text-sm">30 de Outubro, 2023</span>
            </div>
          </header>

          {view === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Load Analysis */}
              <Card className="md:col-span-2">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <BarChart3 className="text-orange-500" /> 
                      Análise de Carga Horária
                    </h3>
                    <p className="text-sm text-slate-500">Impacto das tarefas na sua rotina semanal</p>
                  </div>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Altíssima Excelência</span>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Carga Acadêmica de Homework</span>
                      <span className="text-orange-600 font-bold">{workloadPercentage}% da carga total</span>
                    </div>
                    <ProgressBar progress={workloadPercentage} colorClass="bg-gradient-to-r from-orange-400 to-orange-600" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">Total de Horas</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{(totalHomeworkMinutes / 60).toFixed(1)}h</p>
                    </div>
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase mb-1">Concluído</p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{((completedHomeworkMinutes / totalHomeworkMinutes) * 100 || 0).toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Focus */}
              <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none shadow-blue-200 dark:shadow-none">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Timer /> Foco Profundo
                </h3>
                <div className="text-center py-6">
                  <div className="text-5xl font-mono font-bold mb-4 tabular-nums">
                    {formatTime(timerSeconds)}
                  </div>
                  <div className="flex justify-center gap-3">
                    <Button 
                      variant="primary" 
                      onClick={() => setIsActive(!isActive)}
                      className="bg-white text-blue-700 hover:bg-slate-100"
                    >
                      {isActive ? 'Pausar' : 'Iniciar'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {setTimerSeconds(25*60); setIsActive(false);}}
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-blue-100 text-center mt-4">Técnica Pomodoro recomendada para tarefas longas de exatas.</p>
              </Card>

              {/* Task Feed */}
              <div className="md:col-span-3">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                  <CheckCircle2 className="text-emerald-500" /> Lições Prioritárias
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks.slice(0, 6).map(task => (
                    <Card key={task.id} className={`hover:shadow-md transition-shadow cursor-pointer ${task.completed ? 'opacity-60 grayscale' : ''}`}>
                      <div className="flex justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${task.priority === 'Alta' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                          {task.priority}
                        </span>
                        <div className="flex gap-2">
                          <button onClick={() => toggleTask(task.id)} className="text-slate-400 hover:text-emerald-500 transition-colors">
                            <CheckCircle2 size={18} fill={task.completed ? 'currentColor' : 'none'} />
                          </button>
                          <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <h4 className={`font-bold mb-1 ${task.completed ? 'line-through' : ''}`}>{task.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><Clock size={12} /> {task.duration} min</span>
                        <span className="flex items-center gap-1"><BookOpen size={12} /> {task.subject}</span>
                      </div>
                    </Card>
                  ))}
                  <button 
                    onClick={() => setView('tasks')}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800 transition-all text-slate-400 hover:text-orange-500 group"
                  >
                    <Plus className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold">Nova Lição</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {view === 'tasks' && (
            <div className="max-w-4xl mx-auto">
              <Card className="mb-8">
                <h3 className="text-lg font-bold mb-4">Cadastrar Nova Tarefa</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <input 
                    type="text" 
                    placeholder="Ex: Exercícios de Geometria Analítica" 
                    className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                  <select 
                    className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(e.target.value)}
                  >
                    <option value="30">30 min</option>
                    <option value="60">60 min</option>
                    <option value="120">120 min</option>
                    <option value="180">180 min</option>
                  </select>
                  <Button onClick={addTask}>Adicionar</Button>
                </div>
              </Card>

              <div className="space-y-4">
                {tasks.map(task => (
                  <div key={task.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-12 rounded-full ${task.priority === 'Alta' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                      <div>
                        <h4 className={`font-bold ${task.completed ? 'line-through text-slate-400' : ''}`}>{task.title}</h4>
                        <p className="text-xs text-slate-500">{task.subject} • {task.duration} min • Prazo: {task.deadline}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <Button variant={task.completed ? "success" : "outline"} onClick={() => toggleTask(task.id)}>
                         {task.completed ? "Feito" : "Marcar Pronto"}
                       </Button>
                       <button onClick={() => deleteTask(task.id)} className="p-2 text-slate-300 hover:text-red-500">
                         <Trash2 size={20} />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'timer' && (
             <div className="max-w-2xl mx-auto text-center py-12">
                <div className="relative inline-block mb-12">
                   {/* Decorative Ring */}
                   <svg className="w-64 h-64 transform -rotate-90">
                      <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                      <circle 
                        cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 120}
                        strokeDashoffset={2 * Math.PI * 120 * (1 - timerSeconds / (25*60))}
                        strokeLinecap="round"
                        className="text-orange-500 transition-all duration-1000" 
                      />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-mono font-bold">{formatTime(timerSeconds)}</span>
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Foco Ativo</span>
                   </div>
                </div>
                
                <div className="flex justify-center gap-4 mb-8">
                   <Button variant="secondary" className="px-8 py-4 text-lg" onClick={() => setIsActive(!isActive)}>
                     {isActive ? 'Pausar' : 'Iniciar Sessão'}
                   </Button>
                   <Button variant="outline" className="px-8 py-4 text-lg" onClick={() => {setTimerSeconds(25*60); setIsActive(false)}}>
                     Resetar
                   </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-left">
                   <Card className="text-center p-4 bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800">
                      <p className="text-xs font-bold text-orange-600 mb-1 uppercase">Sessões</p>
                      <p className="text-2xl font-bold">04</p>
                   </Card>
                   <Card className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800">
                      <p className="text-xs font-bold text-blue-600 mb-1 uppercase">Minutos</p>
                      <p className="text-2xl font-bold">100</p>
                   </Card>
                   <Card className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs font-bold text-emerald-600 mb-1 uppercase">Eficácia</p>
                      <p className="text-2xl font-bold">92%</p>
                   </Card>
                </div>
             </div>
          )}

        </main>
      </div>
    </div>
  );
}