import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Plus,
  Calendar,
  Clock,
  AlertCircle,
  Edit2,
  Trash2,
  Filter,
  Search,
  X,
  Check,
  Award,
  TrendingUp,
  MoreVertical,
  ArrowUpRight
} from 'lucide-react';

interface AssignmentFormData {
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  dueTime: string;
  grade?: number;
}

const Assignments: React.FC = () => {
  const { user, assignments, addAssignment, updateAssignment, deleteAssignment, darkMode } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: '',
    subject: '',
    description: '',
    dueDate: '',
    dueTime: '',
    grade: undefined
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Get unique subjects for filter
  const subjects = Array.from(new Set(assignments.map(a => a.subject)));

  // Filter and search assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assignment.description && assignment.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesSubject = filterSubject === 'all' || assignment.subject === filterSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  }).sort((a, b) => {
    // Sort by due date, then by status
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    if (dateA !== dateB) return dateA - dateB;

    const statusOrder = { pending: 0, 'in-progress': 1, completed: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      description: '',
      dueDate: '',
      dueTime: '',
      grade: undefined
    });
    setEditingAssignment(null);
  };

  const openModal = (assignment?: any) => {
    if (assignment) {
      setEditingAssignment(assignment.id);
      const dueDate = new Date(assignment.dueDate);
      setFormData({
        title: assignment.title,
        subject: assignment.subject,
        description: assignment.description || '',
        dueDate: dueDate.toISOString().split('T')[0],
        dueTime: dueDate.toTimeString().slice(0, 5),
        grade: assignment.grade
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.subject.trim()) return;

    const dueDateTime = formData.dueDate && formData.dueTime
      ? new Date(`${formData.dueDate}T${formData.dueTime}`)
      : new Date();

    const assignmentData = {
      title: formData.title.trim(),
      subject: formData.subject.trim(),
      description: formData.description.trim(),
      dueDate: dueDateTime.toISOString(),
      status: 'pending' as const,
      grade: formData.grade
    };

    if (editingAssignment) {
      updateAssignment(editingAssignment, assignmentData);
    } else {
      addAssignment(assignmentData);
    }

    closeModal();
  };

  const updateAssignmentStatus = (assignmentId: string, status: 'pending' | 'in-progress' | 'completed') => {
    updateAssignment(assignmentId, { status });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getGradeColor = (grade?: number) => {
    if (!grade) return 'text-gray-500';
    if (grade >= 90) return 'text-emerald-600 dark:text-emerald-400 font-bold';
    if (grade >= 80) return 'text-blue-600 dark:text-blue-400 font-bold';
    if (grade >= 70) return 'text-amber-600 dark:text-amber-400 font-bold';
    return 'text-red-600 dark:text-red-400 font-bold';
  };

  const getDaysLeft = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getDaysLeftColor = (daysLeft: number) => {
    if (daysLeft < 0) return 'text-red-600 dark:text-red-400 font-semibold';
    if (daysLeft === 0) return 'text-orange-600 dark:text-orange-400 font-semibold';
    if (daysLeft === 1) return 'text-amber-600 dark:text-amber-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) +
        ` at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  // Calculate statistics
  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    inProgress: assignments.filter(a => a.status === 'in-progress').length,
    completed: assignments.filter(a => a.status === 'completed').length,
    overdue: assignments.filter(a => a.status !== 'completed' && new Date(a.dueDate) < new Date()).length,
    averageGrade: assignments.filter(a => a.grade !== undefined).length > 0
      ? Math.round(assignments.filter(a => a.grade !== undefined).reduce((sum, a) => sum + (a.grade || 0), 0) / assignments.filter(a => a.grade !== undefined).length)
      : null
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Assignments</h1>
            <p className="text-emerald-100 text-lg">
              Manage your coursework. You have <span className="font-bold text-white">{stats.pending} pending</span> assignments.
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            New Assignment
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-20"></div>
        <div className="absolute -bottom-6 -right-6 text-white/10 rotate-12">
          <BookOpen size={140} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: BookOpen, color: 'blue' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'amber' },
          { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'indigo' },
          { label: 'Completed', value: stats.completed, icon: Check, color: 'green' },
          { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'red' },
          { label: 'Avg Grade', value: stats.averageGrade !== null ? `${stats.averageGrade}%` : '--', icon: Award, color: 'purple' },
        ].map((stat, idx) => (
          <div key={idx} className="card p-4 flex flex-col justify-between glass-panel hover:-translate-y-1 transition-transform duration-300">
            <div className={`p-2 w-fit rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400 mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="card p-5 glass-panel">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="input pl-10 pr-8 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="input pl-10 pr-8 appearance-none"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="card p-12 text-center border-dashed border-2 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No assignments found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || filterStatus !== 'all' || filterSubject !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Create your first assignment to get started'}
            </p>
            {!searchTerm && filterStatus === 'all' && filterSubject === 'all' && (
              <button
                onClick={() => openModal()}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Assignment
              </button>
            )}
          </div>
        ) : (
          filteredAssignments.map(assignment => {
            const daysLeft = getDaysLeft(assignment.dueDate);
            const isOverdue = daysLeft < 0 && assignment.status !== 'completed';

            return (
              <div
                key={assignment.id}
                className={`group card p-5 flex flex-col md:flex-row items-start gap-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] border-l-4 ${assignment.status === 'completed' ? 'border-l-green-500 opacity-80' :
                    assignment.status === 'in-progress' ? 'border-l-blue-500' :
                      isOverdue ? 'border-l-red-500' : 'border-l-amber-500'
                  }`}
              >
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                          {assignment.subject}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(assignment.status)}`}>
                          {assignment.status.replace('-', ' ')}
                        </span>
                      </div>

                      <h3 className={`text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors ${assignment.status === 'completed' ? 'line-through text-gray-500' : ''
                        }`}>
                        {assignment.title}
                      </h3>

                      {assignment.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
                          {assignment.description}
                        </p>
                      )}
                    </div>

                    {assignment.grade !== undefined && (
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400">Grade</span>
                        <span className={`text-xl font-bold ${getGradeColor(assignment.grade)}`}>
                          {assignment.grade}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      <span className={getDaysLeftColor(daysLeft)}>
                        {daysLeft === 0 ? 'Due today' :
                          daysLeft === 1 ? 'Due tomorrow' :
                            daysLeft < 0 ? `Overdue by ${Math.abs(daysLeft)} days` :
                              `Due in ${daysLeft} days`}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {formatDueDate(assignment.dueDate)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-3 md:pt-0 md:pl-5 mt-2 md:mt-0 justify-end">
                  {/* Status Update Buttons */}
                  {assignment.status !== 'completed' && (
                    <div className="flex gap-1 mr-2">
                      {assignment.status === 'pending' && (
                        <button
                          onClick={() => updateAssignmentStatus(assignment.id, 'in-progress')}
                          className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          title="Mark In Progress"
                        >
                          <TrendingUp className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => updateAssignmentStatus(assignment.id, 'completed')}
                        className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                        title="Mark Completed"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-1">
                    <button
                      onClick={() => openModal(assignment)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAssignment(assignment.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="card w-full max-w-lg shadow-2xl scale-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {editingAssignment ? <Edit2 className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-emerald-500" />}
                {editingAssignment ? 'Edit Assignment' : 'New Assignment'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Assignment Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input w-full"
                  placeholder="e.g. Calculus Midterm"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Subject / Course <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input w-full"
                  placeholder="e.g. Mathematics"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input w-full resize-none min-h-[80px]"
                  placeholder="Additional details..."
                />
              </div>

              {/* Due Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Due Time
                  </label>
                  <input
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                    className="input w-full"
                  />
                </div>
              </div>

              {/* Grade */}
              {editingAssignment && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Grade (0-100)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.grade || ''}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="input w-32"
                      placeholder="--"
                    />
                    <span className="text-sm text-gray-500">Only if graded</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary flex-1 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2.5"
                >
                  {editingAssignment ? 'Save Changes' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;