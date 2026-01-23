import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Award,
  BookOpen,
  CheckSquare,
  Brain,
  Filter,
  Calendar
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics: React.FC = () => {
  const { user, tasks, assignments, studySessions, darkMode } = useApp();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Calculate analytics data
  const calculateAnalytics = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const yearStart = new Date(today.getFullYear(), 0, 1);

    const getDateRange = () => {
      switch (timeRange) {
        case 'week': return { start: weekStart, end: today };
        case 'month': return { start: monthStart, end: today };
        case 'year': return { start: yearStart, end: today };
        default: return { start: weekStart, end: today };
      }
    };

    const { start, end } = getDateRange();

    // Tasks analytics
    const tasksInRange = tasks.filter(task =>
      new Date(task.createdAt) >= start && new Date(task.createdAt) <= end
    );
    const completedTasksInRange = tasksInRange.filter(task => task.status === 'completed');
    const tasksCompletionRate = tasksInRange.length > 0
      ? (completedTasksInRange.length / tasksInRange.length) * 100
      : 0;

    // Assignments analytics
    const assignmentsInRange = assignments.filter(assignment =>
      new Date(assignment.dueDate) >= start && new Date(assignment.dueDate) <= end
    );
    const completedAssignmentsInRange = assignmentsInRange.filter(a => a.status === 'completed');
    const assignmentsCompletionRate = assignmentsInRange.length > 0
      ? (completedAssignmentsInRange.length / assignmentsInRange.length) * 100
      : 0;
    const averageGrade = assignments.filter(a => a.grade !== undefined).length > 0
      ? assignments.filter(a => a.grade !== undefined).reduce((sum, a) => sum + (a.grade || 0), 0) / assignments.filter(a => a.grade !== undefined).length
      : 0;

    // Study sessions analytics
    const studySessionsInRange = studySessions.filter(session =>
      new Date(session.completedAt) >= start && new Date(session.completedAt) <= end
    );
    const totalStudyTime = studySessionsInRange.reduce((total, session) => total + session.duration, 0);
    const averageSessionLength = studySessionsInRange.length > 0
      ? totalStudyTime / studySessionsInRange.length
      : 0;

    // Daily data for charts
    const generateDailyData = () => {
      const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
      const data = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayTasks = tasks.filter(task =>
          task.createdAt.split('T')[0] === dateStr
        );
        const dayCompletedTasks = dayTasks.filter(task => task.status === 'completed');
        const dayStudyTime = studySessions
          .filter(session => session.completedAt.split('T')[0] === dateStr)
          .reduce((total, session) => total + session.duration, 0);

        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          tasks: dayTasks.length,
          completedTasks: dayCompletedTasks.length,
          studyTime: dayStudyTime
        });
      }

      return data;
    };

    return {
      tasks: {
        total: tasksInRange.length,
        completed: completedTasksInRange.length,
        completionRate: tasksCompletionRate,
        pending: tasksInRange.filter(t => t.status === 'pending').length
      },
      assignments: {
        total: assignmentsInRange.length,
        completed: completedAssignmentsInRange.length,
        completionRate: assignmentsCompletionRate,
        averageGrade: averageGrade,
        pending: assignmentsInRange.filter(a => a.status === 'pending').length
      },
      study: {
        totalSessions: studySessionsInRange.length,
        totalTime: totalStudyTime,
        averageSessionLength: averageSessionLength,
        dailyAverage: totalStudyTime / (timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365)
      },
      dailyData: generateDailyData()
    };
  };

  const analytics = calculateAnalytics();

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl shadow-sm">
              <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </span>
            Analytics Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 ml-1">
            Track your progress and study habits
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl shadow-inner">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${timeRange === range
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md scale-105'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 border-l-4 border-l-blue-500 glass-panel group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Study Time</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 group-hover:text-blue-600 transition-colors">
                {(analytics.study.totalTime / 60).toFixed(1)}h
              </h3>
            </div>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-lg w-fit font-medium">
            <TrendingUp className="w-3 h-3 mr-1" />
            +12% vs last {timeRange}
          </div>
        </div>

        <div className="card p-6 border-l-4 border-l-emerald-500 glass-panel group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks Completed</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 group-hover:text-emerald-600 transition-colors">
                {analytics.tasks.completionRate.toFixed(0)}%
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
              <CheckSquare className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            {analytics.tasks.completed} out of {analytics.tasks.total} tasks
          </p>
        </div>

        <div className="card p-6 border-l-4 border-l-violet-500 glass-panel group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Grade</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 group-hover:text-violet-600 transition-colors">
                {analytics.assignments.averageGrade > 0 ? `${analytics.assignments.averageGrade.toFixed(1)}%` : 'N/A'}
              </h3>
            </div>
            <div className="p-2.5 bg-violet-50 dark:bg-violet-900/20 rounded-xl text-violet-600 dark:text-violet-400">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            Across {analytics.assignments.total} assignments
          </p>
        </div>

        <div className="card p-6 border-l-4 border-l-amber-500 glass-panel group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Focus Duration</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 group-hover:text-amber-600 transition-colors">
                {analytics.study.averageSessionLength.toFixed(0)}m
              </h3>
            </div>
            <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400">
              <Brain className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            Avg. per study session
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Activity Chart - Spans 2 columns */}
        <div className="lg:col-span-2 card p-6 glass-panel">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" /> Study Activity
            </h3>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              Minutes / Day
            </span>
          </div>
          <div className="h-72">
            <Line
              data={{
                labels: analytics.dailyData.map(d => d.date),
                datasets: [{
                  label: 'Study Time (min)',
                  data: analytics.dailyData.map(d => d.studyTime),
                  borderColor: 'rgb(99, 102, 241)',
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  tension: 0.4,
                  fill: true,
                  borderWidth: 3,
                  pointBackgroundColor: 'rgb(255, 255, 255)',
                  pointBorderColor: 'rgb(99, 102, 241)',
                  pointBorderWidth: 2,
                  pointRadius: 4,
                  pointHoverRadius: 6
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    padding: 12,
                    titleFont: { size: 13 },
                    bodyFont: { size: 13 },
                    displayColors: false,
                    callbacks: {
                      label: (context) => `${context.parsed.y} minutes focus`
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                    border: { display: false }
                  },
                  x: {
                    grid: { display: false },
                    border: { display: false }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Task Distribution Doughnut */}
        <div className="lg:col-span-1 card p-6 glass-panel">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" /> Task Status
          </h3>
          <div className="h-64 flex justify-center relative">
            <Doughnut
              data={{
                labels: ['Completed', 'Pending'],
                datasets: [{
                  data: [
                    analytics.tasks.completed,
                    analytics.tasks.pending
                  ],
                  backgroundColor: [
                    'rgba(16, 185, 129, 0.8)', // emerald-500
                    'rgba(249, 115, 22, 0.8)', // orange-500
                  ],
                  borderWidth: 0,
                  hoverOffset: 4
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                      font: { size: 12, family: 'system-ui' }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => ` ${ctx.label}: ${ctx.parsed} tasks`
                    }
                  }
                },
                cutout: '75%'
              }}
            />
            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
              <span className="text-3xl font-bold text-gray-900 dark:text-white block">
                {tasks.length}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;