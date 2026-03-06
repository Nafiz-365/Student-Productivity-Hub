import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  BookOpen,
  Clock,
  Calendar,
  Plus,
  ArrowRight,
  Zap,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ElementType;
  gradient: string;
  description?: string;
  trend?: string;
}

interface TodayTask {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

interface UpcomingAssignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  daysLeft: number;
}

const Dashboard: React.FC = () => {
  const { user, tasks, assignments, classSchedule } = useApp();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [todayTasks, setTodayTasks] = useState<TodayTask[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<UpcomingAssignment[]>([]);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Calculate stats
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const todayTasksList = tasks.filter(task =>
      task.dueDate.split('T')[0] === todayStr && task.status === 'pending'
    );

    const completedTasksToday = tasks.filter(task =>
      task.status === 'completed' && new Date(task.createdAt).toDateString() === today.toDateString()
    ).length;

    const upcomingAssignmentsList = assignments
      .filter(assignment =>
        assignment.status !== 'completed' &&
        new Date(assignment.dueDate) >= today
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const todayClassesList = classSchedule.filter(cls => {
      const dayOfWeek = today.getDay();
      return cls.dayOfWeek === dayOfWeek;
    });

    // Mock data for study time
    const studyTimeToday = 45; // minutes

    const newStats: StatCard[] = [
      {
        title: 'Tasks Today',
        value: todayTasksList.length,
        icon: CheckSquare,
        gradient: 'from-blue-500 to-cyan-500',
        description: `${completedTasksToday} completed`,
        trend: '+2 from yesterday'
      },
      {
        title: 'Assignments',
        value: assignments.filter(a => a.status !== 'completed').length,
        icon: BookOpen,
        gradient: 'from-emerald-500 to-teal-500',
        description: `${upcomingAssignmentsList.length} due soon`
      },
      {
        title: 'Study Time',
        value: `${studyTimeToday}m`,
        icon: Clock,
        gradient: 'from-violet-500 to-purple-500',
        description: 'Tracked today'
      },
      {
        title: 'Focus Score',
        value: '85%',
        icon: Zap,
        gradient: 'from-amber-500 to-orange-500',
        description: 'Productivity peaking'
      }
    ];

    setStats(newStats);
    setTodayTasks(todayTasksList.slice(0, 5).map(task => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate
    })));
    setUpcomingAssignments(upcomingAssignmentsList.slice(0, 3).map(assignment => {
      const daysLeft = Math.ceil((new Date(assignment.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return {
        id: assignment.id,
        title: assignment.title,
        subject: assignment.subject,
        dueDate: assignment.dueDate,
        daysLeft
      };
    }));
    setTodayClasses(todayClassesList);
  }, [user, tasks, assignments, classSchedule]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getDaysLeftColor = (daysLeft: number) => {
    if (daysLeft <= 1) return 'text-red-600 dark:text-red-400 font-semibold';
    if (daysLeft <= 3) return 'text-amber-600 dark:text-amber-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Ready to conquer your goals today? You have <span className="font-semibold text-white">{todayTasks.length} pending tasks</span> waiting for you.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-20"></div>
        <div className="absolute right-10 bottom-[-20px] text-white/10">
          <Target size={120} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6 border-0 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {stat.trend && (
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                      {stat.trend}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  {stat.description && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      {stat.description}
                    </p>
                  )}
                </div>
              </div>
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-110`}></div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="card p-6 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Today's Focus
              </h2>
            </div>
            <Link
              to="/tasks"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {todayTasks.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-full inline-flex mb-3 shadow-sm">
                <CheckSquare className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">All caught up!</p>
              <p className="text-xs text-gray-400 mt-1 mb-4">No pending tasks for today</p>
              <Link to="/tasks" className="btn-primary py-2 px-4 text-xs">
                <Plus className="w-3 h-3 mr-1.5" /> New Task
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks.map(task => (
                <div key={task.id} className="group flex items-center justify-between p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-md transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-800">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Assignments */}
        <div className="card p-6 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Upcoming
              </h2>
            </div>
            <Link
              to="/assignments"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {upcomingAssignments.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700">
              <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No upcoming deadlines</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAssignments.map(assignment => (
                <div key={assignment.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 border-l-4 border-emerald-500 rounded-r-xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {assignment.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {assignment.subject}
                      </p>
                    </div>
                    <div className="ml-3 flex flex-col items-end">
                      <span className={`text-xs font-bold ${getDaysLeftColor(assignment.daysLeft)}`}>
                        {assignment.daysLeft === 0 ? 'Today' :
                          assignment.daysLeft === 1 ? 'Tmrrw' :
                            `${assignment.daysLeft}d`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Classes */}
        <div className="card p-6 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                <Calendar className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Schedule
              </h2>
            </div>
            <Link
              to="/schedule"
              className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              Full Schedule <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {todayClasses.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-full inline-flex mb-3 shadow-sm">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Free day!</p>
              <p className="text-xs text-gray-400 mt-1">No classes scheduled</p>
            </div>
          ) : (
            <div className="relative pl-4 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200 dark:before:bg-gray-700">
              {todayClasses
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((cls, idx) => (
                  <div key={cls.id} className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 bg-violet-500 shadow-sm z-10"></div>
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 mb-1">
                        {cls.startTime} - {cls.endTime}
                      </span>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {cls.subject}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        Room {cls.room}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-8 border-0">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500 fill-current" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/tasks"
            className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 border border-blue-200 dark:border-blue-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block text-center"
          >
            <div className="bg-white dark:bg-blue-900/50 p-3 rounded-full inline-flex mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Add Task</h3>
            <p className="text-xs text-blue-600/80 dark:text-blue-300/80">Planning something?</p>
          </Link>

          <Link
            to="/assignments"
            className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/40 border border-emerald-200 dark:border-emerald-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block text-center"
          >
            <div className="bg-white dark:bg-emerald-900/50 p-3 rounded-full inline-flex mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Assignment</h3>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-300/80">New deadline?</p>
          </Link>

          <Link
            to="/timer"
            className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 border border-purple-200 dark:border-purple-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block text-center"
          >
            <div className="bg-white dark:bg-purple-900/50 p-3 rounded-full inline-flex mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Focus Timer</h3>
            <p className="text-xs text-purple-600/80 dark:text-purple-300/80">Start studying</p>
          </Link>

          <Link
            to="/schedule"
            className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/40 dark:to-orange-800/40 border border-orange-200 dark:border-orange-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block text-center"
          >
            <div className="bg-white dark:bg-orange-900/50 p-3 rounded-full inline-flex mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Schedule</h3>
            <p className="text-xs text-orange-600/80 dark:text-orange-300/80">Check classes</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;