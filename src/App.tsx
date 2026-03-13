import React, { useState, useEffect } from 'react';
import {
  Folder,
  ListTodo,
  Clock,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Calendar as CalendarIcon,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Bell
} from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, addMonths, subMonths, startOfMonth, endOfMonth, isSameMonth, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';

// --- Initial Data ---
const INITIAL_PROJECTS = [
  {
    id: '1',
    title: 'Тестовый проект',
    description: 'Описание тестового проекта',
    status: 'Активный',
    progress: 0,
    taskCount: 2,
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'ипп',
    description: 'Нет описания',
    status: 'Активный',
    progress: 0,
    taskCount: 0,
    color: 'bg-blue-500'
  }
];

const INITIAL_TASKS = [
  {
    id: '1',
    projectId: '2',
    projectName: 'ипп',
    projectColor: 'bg-blue-500',
    title: 'ипп',
    priority: 'Высокий',
    status: 'В процессе',
    dueDate: new Date(),
    assignee: null,
    notified: false
  }
];

const PROJECT_COLORS = [
  { name: 'Синий', value: 'bg-blue-500' },
  { name: 'Индиго', value: 'bg-indigo-500' },
  { name: 'Фиолетовый', value: 'bg-purple-500' },
  { name: 'Розовый', value: 'bg-pink-500' },
  { name: 'Красный', value: 'bg-red-500' },
  { name: 'Оранжевый', value: 'bg-orange-500' },
  { name: 'Желтый', value: 'bg-amber-500' },
  { name: 'Зеленый', value: 'bg-emerald-500' },
  { name: 'Бирюзовый', value: 'bg-teal-500' },
  { name: 'Серый', value: 'bg-gray-500' },
];

const getEventColor = (bgClass: string) => {
  const map: Record<string, string> = {
    'bg-blue-500': 'bg-blue-100 text-blue-700',
    'bg-indigo-500': 'bg-indigo-100 text-indigo-700',
    'bg-purple-500': 'bg-purple-100 text-purple-700',
    'bg-pink-500': 'bg-pink-100 text-pink-700',
    'bg-red-500': 'bg-red-100 text-red-700',
    'bg-orange-500': 'bg-orange-100 text-orange-700',
    'bg-amber-500': 'bg-amber-100 text-amber-700',
    'bg-emerald-500': 'bg-emerald-100 text-emerald-700',
    'bg-teal-500': 'bg-teal-100 text-teal-700',
    'bg-gray-500': 'bg-gray-100 text-gray-700',
  };
  return map[bgClass] || 'bg-gray-100 text-gray-700';
};

// --- Components ---

const StatCard = ({ icon: Icon, title, value, iconBg, iconColor }: any) => (
  <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 flex items-center gap-3 shadow-sm">
    <div className={`p-2 sm:p-2.5 rounded-lg ${iconBg}`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div>
      <p className="text-xs sm:text-sm text-gray-500 font-medium leading-tight">{title}</p>
      <p className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{value}</p>
    </div>
  </div>
);

const ProjectCard = ({ project, tasks, onDelete, onAddTask, onToggleComplete, onDeleteTask }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${project.color}`} />
          <h3 className="font-semibold text-gray-900">{project.title}</h3>
        </div>
        <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-md">
          {project.status}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-4">{project.description}</p>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Прогресс</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <span>{project.taskCount} задач</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onAddTask(project.id); }} 
            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded" 
            title="Добавить задачу"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()} 
            className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
            title="Редактировать"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(project.id); }} 
            className="p-1 text-red-500 hover:bg-red-50 rounded" 
            title="Удалить"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && tasks && tasks.length > 0 && (
        <div 
          className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {tasks.map((task: any) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDelete={onDeleteTask} 
              onToggleComplete={onToggleComplete} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TaskCard = ({ task, onDelete, onToggleComplete }: any) => {
  const priorityColors: Record<string, string> = {
    'Высокий': 'bg-red-100 text-red-700',
    'Средний': 'bg-amber-100 text-amber-700',
    'Низкий': 'bg-green-100 text-green-700',
  };
  
  const statusColors: Record<string, string> = {
    'К выполнению': 'bg-gray-100 text-gray-700',
    'В процессе': 'bg-blue-100 text-blue-700',
    'Готово': 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
      {task.priority === 'Высокий' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400" />}
      {task.priority === 'Средний' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />}
      {task.priority === 'Низкий' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-400" />}
      
      <div className="flex justify-between items-start mb-3 pl-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${task.projectColor}`} />
          <span className="text-sm text-gray-600 font-medium">{task.projectName}</span>
        </div>
        <div className="flex gap-2">
          <span className={`px-2 py-0.5 text-xs font-medium rounded ${priorityColors[task.priority] || 'bg-gray-100 text-gray-700'}`}>
            {task.priority}
          </span>
          <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusColors[task.status] || 'bg-gray-100 text-gray-700'}`}>
            {task.status}
          </span>
        </div>
      </div>
      
      <div className="flex items-start gap-3 mb-3 pl-2">
        <input 
          type="checkbox" 
          checked={task.status === 'Готово'}
          onChange={() => onToggleComplete(task.id)}
          className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
        />
        <h4 className={`font-semibold text-gray-900 ${task.status === 'Готово' ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </h4>
      </div>
      
      <div className="flex justify-between items-end pl-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4" />
            <span>{format(task.dueDate, 'd MMM HH:mm', { locale: ru })}</span>
          </div>
          {task.reminder && task.reminder !== 'Нет' && (
            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
              <span>🔔 {task.reminder}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <User className="w-4 h-4" />
          <span>{task.assignee || 'Не назначен'}</span>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-50">
        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Редактировать">
          <Edit2 className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(task.id)} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Удалить">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const Calendar = ({ events, onAddEvent }: { events: any[], onAddEvent: (date: Date) => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 12));
  const [view, setView] = useState<'Неделя' | 'Месяц'>('Неделя');

  const handlePrev = () => {
    setCurrentDate(prev => view === 'Неделя' ? subWeeks(prev, 1) : subMonths(prev, 1));
  };

  const handleNext = () => {
    setCurrentDate(prev => view === 'Неделя' ? addWeeks(prev, 1) : addMonths(prev, 1));
  };

  const getDays = () => {
    if (view === 'Неделя') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
      return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    } else {
      const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
      const end = endOfMonth(currentDate);
      const days = [];
      let day = start;
      while (day <= end || days.length % 7 !== 0) {
        days.push(day);
        day = addDays(day, 1);
      }
      return days;
    }
  };

  const days = getDays();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900 capitalize">
          {view === 'Месяц' ? format(currentDate, 'LLLL yyyy', { locale: ru }) : 'Календарь'}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button onClick={handlePrev} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={handleNext} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${view === 'Неделя' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setView('Неделя')}
            >
              Неделя
            </button>
            <button 
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${view === 'Месяц' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setView('Месяц')}
            >
              Месяц
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 border-b border-gray-100">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, i) => (
          <div key={i} className="p-2 sm:p-3 text-center border-r last:border-r-0 border-gray-100">
            <div className="text-[10px] sm:text-sm font-medium text-gray-500">{day}</div>
          </div>
        ))}
      </div>
      
      <div className={`grid grid-cols-7 ${view === 'Неделя' ? 'min-h-[120px]' : ''}`}>
        {days.map((day, i) => {
          const dayEvents = events.filter(e => isSameDay(e.date, day));
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <div 
              key={i} 
              onClick={() => onAddEvent(day)}
              className={`p-1 sm:p-2 border-r border-b last:border-r-0 border-gray-100 min-h-[80px] sm:min-h-[100px] cursor-pointer hover:bg-blue-50/50 transition-colors group ${!isCurrentMonth && view === 'Месяц' ? 'bg-gray-50/50' : ''}`}
            >
              <div className="flex justify-between items-start mb-1 sm:mb-2">
                <div className={`text-[10px] sm:text-sm leading-tight ${!isCurrentMonth && view === 'Месяц' ? 'text-gray-400' : 'text-gray-900'}`}>
                  {format(day, 'd MMM', { locale: ru })}
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-0.5 text-blue-600 hover:bg-blue-100 rounded transition-opacity hidden sm:block" title="Добавить задачу">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {dayEvents.map(event => (
                <div 
                  key={event.id} 
                  className={`text-[9px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1.5 rounded mb-1 truncate leading-tight ${event.color}`}
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const audioCtx = new AudioContext();
    
    const playBeep = (time: number) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, time);
      osc.frequency.exponentialRampToValueAtTime(440, time + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(time);
      osc.stop(time + 0.1);
    };

    playBeep(audioCtx.currentTime);
    playBeep(audioCtx.currentTime + 0.15);
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};

export default function App() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [toasts, setToasts] = useState<{id: string, message: string}[]>([]);

  useEffect(() => {
    // Request permission on mount, but it might be blocked if not user-initiated
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(console.error);
    }

    const checkReminders = () => {
      const now = new Date().getTime();
      let hasUpdates = false;
      
      setTasks(currentTasks => {
        const updatedTasks = currentTasks.map(task => {
          if (task.status === 'Выполнено' || task.status === 'Готово' || task.notified || !task.reminder || task.reminder === 'Нет') {
            return task;
          }

          const due = new Date(task.dueDate).getTime();
          let reminderTime = due;

          switch (task.reminder) {
            case 'В момент выполнения': reminderTime = due; break;
            case 'За 30 минут': reminderTime = due - 30 * 60 * 1000; break;
            case 'За час': reminderTime = due - 60 * 60 * 1000; break;
            case 'За 2 часа': reminderTime = due - 2 * 60 * 60 * 1000; break;
            case 'За 1 день': reminderTime = due - 24 * 60 * 60 * 1000; break;
            case 'За 2 дня': reminderTime = due - 2 * 24 * 60 * 60 * 1000; break;
            case 'За неделю': reminderTime = due - 7 * 24 * 60 * 60 * 1000; break;
          }

          if (now >= reminderTime && now - reminderTime < 5 * 60 * 1000) {
            // Try system notification
            if ('Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification('Напоминание о задаче', {
                  body: `Задача "${task.title}" требует вашего внимания.`,
                });
              } catch (e) {
                console.error('System notification failed', e);
              }
            }
            
            // Always show in-app toast
            setToasts(prev => [...prev, { id: Date.now().toString(), message: `Напоминание: ${task.title}` }]);
            
            // Auto-remove toast after 5 seconds
            setTimeout(() => {
              setToasts(prev => prev.slice(1));
            }, 5000);

            playNotificationSound();
            hasUpdates = true;
            return { ...task, notified: true };
          }
          return task;
        });

        return hasUpdates ? updatedTasks : currentTasks;
      });
    };

    const interval = setInterval(checkReminders, 10000); // Check more frequently (every 10s)
    checkReminders();
    
    return () => clearInterval(interval);
  }, []);

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  // Form states
  const [newProject, setNewProject] = useState({ title: '', description: '', color: 'bg-blue-500' });
  const [newTask, setNewTask] = useState({ 
    title: '', 
    projectId: '', 
    priority: 'Средний', 
    status: 'К выполнению',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    dueTime: '12:00',
    reminder: 'Нет'
  });

  // Filters
  const [filterProject, setFilterProject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Handlers
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    
    const project = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description || 'Нет описания',
      status: 'Активный',
      progress: 0,
      taskCount: 0,
      color: newProject.color
    };
    
    setProjects([...projects, project]);
    setNewProject({ title: '', description: '', color: 'bg-blue-500' });
    setIsProjectModalOpen(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.projectId) return;
    
    const project = projects.find(p => p.id === newTask.projectId);
    if (!project) return;

    const [year, month, day] = newTask.dueDate.split('-').map(Number);
    const [hours, minutes] = newTask.dueTime.split(':').map(Number);
    const taskDate = new Date(year, month - 1, day, hours, minutes);

    const task = {
      id: Date.now().toString(),
      projectId: project.id,
      projectName: project.title,
      projectColor: project.color,
      title: newTask.title,
      priority: newTask.priority,
      status: newTask.status,
      dueDate: taskDate,
      reminder: newTask.reminder,
      assignee: null,
      notified: false
    };
    
    setTasks([...tasks, task]);
    
    // Update project task count
    setProjects(projects.map(p => 
      p.id === project.id ? { ...p, taskCount: p.taskCount + 1 } : p
    ));
    
    setNewTask({ 
      title: '', 
      projectId: '', 
      priority: 'Средний', 
      status: 'К выполнению',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      dueTime: '12:00',
      reminder: 'Нет'
    });
    setIsTaskModalOpen(false);
  };

  const handleAddTaskToProject = (projectId: string) => {
    setNewTask(prev => ({
      ...prev,
      projectId: projectId,
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      dueTime: '12:00',
    }));
    setIsTaskModalOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setTasks(tasks.filter(t => t.projectId !== id));
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setProjects(projects.map(p => 
        p.id === task.projectId ? { ...p, taskCount: Math.max(0, p.taskCount - 1) } : p
      ));
    }
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'Готово' ? 'К выполнению' : 'Готово' };
      }
      return t;
    }));
  };

  const handleCalendarDateClick = (date: Date) => {
    setNewTask(prev => ({
      ...prev,
      dueDate: format(date, 'yyyy-MM-dd')
    }));
    setIsTaskModalOpen(true);
  };

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    if (showArchive) {
      if (task.status !== 'Готово') return false;
    } else {
      if (task.status === 'Готово') return false;
    }

    if (filterProject !== 'all' && task.projectId !== filterProject) return false;
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  // Stats
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(t => t.status === 'В процессе').length;
  const overdueTasks = tasks.filter(t => t.dueDate < new Date() && t.status !== 'Готово').length;

  const calendarEvents = tasks.map(task => ({
    id: task.id,
    date: task.dueDate,
    title: task.title,
    color: getEventColor(task.projectColor)
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">LINK Project</h1>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsProjectModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Новый проект
            </button>
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <ListTodo className="w-4 h-4" />
              Новая задача
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
          <StatCard 
            icon={Folder} 
            title="Всего проектов" 
            value={totalProjects} 
            iconBg="bg-blue-50" 
            iconColor="text-blue-500" 
          />
          <StatCard 
            icon={ListTodo} 
            title="Всего задач" 
            value={totalTasks} 
            iconBg="bg-emerald-50" 
            iconColor="text-emerald-500" 
          />
          <StatCard 
            icon={Clock} 
            title="В процессе" 
            value={inProgressTasks} 
            iconBg="bg-amber-50" 
            iconColor="text-amber-500" 
          />
          <StatCard 
            icon={AlertTriangle} 
            title="Просрочено" 
            value={overdueTasks} 
            iconBg="bg-red-50" 
            iconColor="text-red-500" 
          />
        </div>

        {/* Main Content Grid */}
        <div className="mb-8">
          {/* Projects Column */}
          <section>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Проекты</h2>
                <span className="text-sm text-gray-500">{projects.length} активных</span>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[800px] overflow-y-auto bg-gray-50/50">
                {projects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 col-span-full">Нет проектов. Создайте первый проект!</div>
                ) : (
                  projects.map(project => {
                    const projectTasks = tasks.filter(t => t.projectId === project.id);
                    const completedTasks = projectTasks.filter(t => t.status === 'Готово');
                    const progress = projectTasks.length > 0 
                      ? Math.round((completedTasks.length / projectTasks.length) * 100) 
                      : 0;
                    
                    return (
                      <ProjectCard 
                        key={project.id} 
                        project={{...project, progress, taskCount: projectTasks.length}} 
                        tasks={projectTasks}
                        onDelete={handleDeleteProject}
                        onAddTask={handleAddTaskToProject}
                        onToggleComplete={handleToggleComplete}
                        onDeleteTask={handleDeleteTask}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Calendar Section */}
        <section>
          <Calendar events={calendarEvents} onAddEvent={handleCalendarDateClick} />
        </section>
      </main>

      {/* Modals */}
      <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="Новый проект">
        <form onSubmit={handleAddProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название проекта</label>
            <input 
              type="text" 
              required
              value={newProject.title}
              onChange={e => setNewProject({...newProject, title: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Введите название"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea 
              value={newProject.description}
              onChange={e => setNewProject({...newProject, description: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Добавьте описание проекта"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Цвет проекта</label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setNewProject({...newProject, color: color.value})}
                  className={`w-8 h-8 rounded-full ${color.value} flex items-center justify-center transition-transform hover:scale-110 focus:outline-none ${newProject.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setIsProjectModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              Отмена
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Создать проект
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Новая задача">
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название задачи</label>
            <input 
              type="text" 
              required
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Что нужно сделать?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Проект</label>
            <select 
              required
              value={newTask.projectId}
              onChange={e => setNewTask({...newTask, projectId: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Выберите проект</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Приоритет</label>
              <select 
                value={newTask.priority}
                onChange={e => setNewTask({...newTask, priority: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Высокий">Высокий</option>
                <option value="Средний">Средний</option>
                <option value="Низкий">Низкий</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
              <select 
                value={newTask.status}
                onChange={e => setNewTask({...newTask, status: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="К выполнению">К выполнению</option>
                <option value="В процессе">В процессе</option>
                <option value="Готово">Готово</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
              <input 
                type="date" 
                required
                value={newTask.dueDate}
                onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Время</label>
              <input 
                type="time" 
                required
                value={newTask.dueTime}
                onChange={e => setNewTask({...newTask, dueTime: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Напоминание</label>
            <select 
              value={newTask.reminder}
              onChange={e => setNewTask({...newTask, reminder: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Нет">Нет</option>
              <option value="В момент выполнения">В момент выполнения</option>
              <option value="За неделю">За неделю</option>
              <option value="За 2 дня">За 2 дня</option>
              <option value="За 1 день">За 1 день</option>
              <option value="За 2 часа">За 2 часа</option>
              <option value="За час">За час</option>
              <option value="За 30 минут">За 30 минут</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setIsTaskModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              Отмена
            </button>
            <button 
              type="submit"
              disabled={!newTask.projectId}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Создать задачу
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className="bg-white border border-gray-200 shadow-lg rounded-lg p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300"
          >
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <Bell size={20} />
            </div>
            <p className="text-sm font-medium text-gray-800">{toast.message}</p>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
