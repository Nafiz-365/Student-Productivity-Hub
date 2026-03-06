import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  Filter,
  CheckCircle2,
  MoreVertical,
  X
} from 'lucide-react';

const Tasks: React.FC = () => {
  const { user, tasks, addTask, updateTask } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const handleToggleTask = (taskId: string, currentStatus: string) => {
    updateTask(taskId, {
      status: currentStatus === 'completed' ? 'pending' : 'completed'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'medium': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      case 'low': return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Task Manager</h1>
            <p className="text-violet-100 text-lg">
              Stay organized and focused. You have <span className="font-bold text-white">{tasks.filter(t => t.status === 'pending').length}</span> pending tasks.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white text-violet-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Add New Task
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-20"></div>
        <div className="absolute -bottom-10 -right-10 text-white/10 rotate-12">
          <CheckSquare size={150} />
        </div>
      </div>

      {/* Filters & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar / Filters */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-4 glass-panel sticky top-24">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </h3>
            <div className="space-y-2">
              {[
                { id: 'all', label: 'All Tasks', count: tasks.length },
                { id: 'pending', label: 'Pending', count: tasks.filter(t => t.status === 'pending').length },
                { id: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setFilter(option.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${filter === option.id
                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                >
                  <span>{option.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${filter === option.id
                    ? 'bg-violet-200 dark:bg-violet-800'
                    : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="lg:col-span-3">
          {filteredTasks.length === 0 ? (
            <div className="card p-12 text-center border-dashed border-2 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-10 h-10 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No tasks found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {filter === 'all'
                  ? "You haven't created any tasks yet. Start by adding one!"
                  : `No ${filter} tasks found.`}
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" /> CREATE FIRST TASK
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={`group relative card p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg border-l-4 ${task.status === 'completed'
                    ? 'border-l-green-500 opacity-75'
                    : 'border-l-violet-500'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleTask(task.id, task.status)}
                      className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${task.status === 'completed'
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 text-transparent hover:border-violet-500'
                        }`}
                    >
                      <CheckCircle2 className="w-4 h-4 fill-current" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`text-lg font-semibold text-gray-900 dark:text-white transition-all ${task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-500' : ''
                            }`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <div className="relative">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        {task.dueDate.includes('T') && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="card w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-violet-500" />
                Create New Task
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setNewTaskTitle('');
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTaskTitle.trim()) return;

                // Simple form just for title for now, matches existing state
                // Use a default due date of tomorrow for quick add
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);

                addTask({
                  title: newTaskTitle,
                  description: '',
                  status: 'pending',
                  priority: 'medium',
                  dueDate: tomorrow.toISOString(),
                });

                setNewTaskTitle('');
                setIsModalOpen(false);
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="input w-full"
                  placeholder="What needs to be done?"
                />
              </div>

              {/* Simplified Quick Add - Can be expanded later */}
              <p className="text-xs text-gray-500 italic">
                * Quick add mode. Details can be edited after creation.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2.5"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;