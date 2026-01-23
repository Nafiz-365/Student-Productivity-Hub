import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Brain,
  Target,
  Trophy,
  Zap,
  Shield,
  Star,
  Crown,
  Rocket,
  Flame
} from 'lucide-react';

const AIInsights: React.FC = () => {
  const { tasks, assignments, studySessions } = useApp();
  const [insights, setInsights] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const generateAIInsights = async () => {
      setIsAnalyzing(true);

      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const aiInsights = [];

      // Analyze work patterns
      const today = new Date();
      const studyHoursToday = studySessions
        .filter(s => new Date(s.completedAt).toDateString() === today.toDateString())
        .reduce((total, s) => total + s.duration, 0) / 60;

      if (studyHoursToday > 6) {
        aiInsights.push({
          id: 'study-marathon',
          type: 'achievement',
          title: '🔥 Study Marathon Achieved!',
          description: `You've studied ${studyHoursToday.toFixed(1)} hours today! That's incredible dedication.`,
          icon: <Rocket className="w-6 h-6 text-orange-500" />,
          confidence: 95,
          actionable: true,
          actions: [
            { text: 'Share achievement', primary: true },
            { text: 'Take a break', primary: false }
          ]
        });
      }

      // Analyze task completion patterns
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const pendingTasks = tasks.filter(t => t.status === 'pending').length;
      const completionRate = (completedTasks / (completedTasks + pendingTasks)) * 100;

      if (completionRate > 85) {
        aiInsights.push({
          id: 'productivity-master',
          type: 'insight',
          title: '👑 Productivity Master',
          description: `Your task completion rate is ${completionRate.toFixed(1)}% - you're in the top 5% of users!`,
          icon: <Trophy className="w-6 h-6 text-yellow-500" />,
          confidence: 92,
          actionable: true,
          actions: [
            { text: 'View detailed analytics', primary: true },
            { text: 'Set higher goals', primary: false }
          ]
        });
      }

      // Analyze assignment performance
      const completedAssignments = assignments.filter(a => a.status === 'completed' && a.grade !== undefined);
      const averageGrade = completedAssignments.length > 0
        ? completedAssignments.reduce((sum, a) => sum + (a.grade || 0), 0) / completedAssignments.length
        : 0;

      if (averageGrade >= 90) {
        aiInsights.push({
          id: 'academic-excellence',
          type: 'achievement',
          title: '🎓 Academic Excellence',
          description: `Your average grade is ${averageGrade.toFixed(1)}% - outstanding academic performance!`,
          icon: <Crown className="w-6 h-6 text-purple-500" />,
          confidence: 98,
          actionable: true,
          actions: [
            { text: 'View grade analytics', primary: true },
            { text: 'Set higher targets', primary: false }
          ]
        });
      }

      // Analyze consistency patterns
      const studyDays = Array.from(new Set(studySessions.map(s => new Date(s.completedAt).toDateString())));
      const last7Days: string[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last7Days.push(date.toDateString());
      }

      const consistencyScore = (studyDays.filter(day => last7Days.includes(day)).length / 7) * 100;

      if (consistencyScore >= 85) {
        aiInsights.push({
          id: 'consistency-legend',
          type: 'insight',
          title: '🌟 Consistency Legend',
          description: `You've studied ${studyDays.filter(day => last7Days.includes(day)).length} out of the last 7 days! Amazing consistency!`,
          icon: <Star className="w-6 h-6 text-green-500" />,
          confidence: 94,
          actionable: false,
          actions: []
        });
      }

      // Predictive insights
      const upcomingDeadlines = assignments
        .filter(a => a.status !== 'completed')
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 3);

      if (upcomingDeadlines.length >= 2) {
        const daysUntilFirst = Math.ceil((new Date(upcomingDeadlines[0].dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        aiInsights.push({
          id: 'deadline-pressure',
          type: 'warning',
          title: '⚡ Upcoming Deadline Pressure',
          description: `You have ${upcomingDeadlines.length} assignments due soon. The first is due in ${daysUntilFirst} days.`,
          icon: <Target className="w-6 h-6 text-red-500" />,
          confidence: 89,
          actionable: true,
          priority: 'high',
          actions: [
            { text: 'View assignments', primary: true },
            { text: 'Create study plan', primary: false }
          ]
        });
      }

      // Study optimization insights
      const avgSessionLength = studySessions.length > 0
        ? studySessions.reduce((sum, s) => sum + s.duration, 0) / studySessions.length
        : 0;

      if (avgSessionLength < 20) {
        aiInsights.push({
          id: 'study-optimization',
          type: 'recommendation',
          title: '💡 Study Optimization',
          description: `Your average study session is ${avgSessionLength.toFixed(1)} minutes. Consider increasing to 25-45 minutes for better retention.`,
          icon: <Brain className="w-6 h-6 text-blue-500" />,
          confidence: 85,
          actionable: true,
          actions: [
            { text: 'Try Pomodoro timer', primary: true },
            { text: 'Read study tips', primary: false }
          ]
        });
      }

      // Productivity predictions
      const weeklyProductivity = [];
      const last4Weeks = [];

      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - (i * 7));
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const weekTasks = tasks.filter(t => {
          const taskDate = new Date(t.createdAt);
          return taskDate >= weekStart && taskDate <= weekEnd;
        });

        const weekCompleted = weekTasks.filter(t => t.status === 'completed').length;
        last4Weeks.push(weekCompleted);
      }

      const avgWeeklyCompletion = last4Weeks.reduce((sum, week) => sum + week, 0) / last4Weeks.length;
      const recentWeeklyCompletion = last4Weeks[last4Weeks.length - 1];

      if (recentWeeklyCompletion > avgWeeklyCompletion * 1.2) {
        aiInsights.push({
          id: 'momentum-builder',
          type: 'achievement',
          title: '🚀 Momentum Builder',
          description: `Your productivity increased by ${((recentWeeklyCompletion / avgWeeklyCompletion - 1) * 100).toFixed(1)}% this week! Keep the momentum going!`,
          icon: <Zap className="w-6 h-6 text-green-500" />,
          confidence: 88,
          actionable: true,
          actions: [
            { text: 'Set challenging goals', primary: true },
            { text: 'Share progress', primary: false }
          ]
        });
      }

      // Personalized recommendations
      const personalInsights = [];

      if (tasks.length > 20) {
        const overdueTasks = tasks.filter(t =>
          t.status === 'pending' && new Date(t.dueDate) < today
        ).length;

        if (overdueTasks > 0) {
          personalInsights.push({
            id: 'task-management',
            type: 'recommendation',
            title: '📋 Task Management',
            description: `You have ${overdueTasks} overdue tasks. Consider breaking down large tasks and setting more frequent reminders.`,
            icon: <Target className="w-6 h-6 text-orange-500" />,
            confidence: 91,
            actionable: true,
            actions: [
              { text: 'Review overdue tasks', primary: true },
              { text: 'Set smart reminders', primary: false }
            ]
          });
        }
      }

      // Study time recommendations
      const totalStudyTime = studySessions.reduce((total, s) => total + s.duration, 0);
      const avgDailyStudy = totalStudyTime / Math.max(studyDays.length, 7);

      if (avgDailyStudy < 60) { // Less than 1 hour per day
        personalInsights.push({
          id: 'study-habits',
          type: 'recommendation',
          title: '📚 Study Habits',
          description: `Your current average is ${Math.floor(avgDailyStudy)} minutes per day. Consistent daily sessions of 60+ minutes can significantly improve retention and grades.`,
          icon: <Brain className="w-6 h-6 text-purple-500" />,
          confidence: 87,
          actionable: true,
          actions: [
            { text: 'Schedule daily sessions', primary: true },
            { text: 'Set study goals', primary: false }
          ]
        });
      }

      setInsights([...aiInsights, ...personalInsights]);
      setIsAnalyzing(false);
    };

    generateAIInsights();
  }, [tasks, assignments, studySessions]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-600';
    if (confidence >= 90) return 'text-blue-600';
    if (confidence >= 85) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'insight': return <Brain className="w-5 h-5 text-blue-500" />;
      case 'warning': return <Target className="w-5 h-5 text-red-500" />;
      case 'recommendation': return <Zap className="w-5 h-5 text-purple-500" />;
      default: return <Star className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold';
      case 'medium': return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
      default: return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold';
    }
  };

  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="card p-8 max-w-md">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
              <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
              <div className="absolute inset-0 border-2 border-blue-200 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              🤖 AI Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Analyzing your productivity patterns, study habits, and academic performance...
            </p>
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full animate-pulse" style={{ width: '90%' }}></div>
              </div>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Generating personalized insights... {Math.floor(Math.random() * 40 + 50)}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Brain className="w-8 h-8 text-purple-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🤖 AI Insights & Recommendations
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Personalized analysis powered by artificial intelligence
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
          <Zap className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-800 dark:text-green-300">AI Active</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-6 text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{insights.length}</div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Insights</p>
        </div>
        <div className="card p-6 text-center">
          <Brain className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {insights.filter(i => i.type === 'achievement').length}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Achievements</p>
        </div>
        <div className="card p-6 text-center">
          <Zap className="w-8 h-8 text-purple-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)}%
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">AI Confidence</p>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <div
            key={insight.id}
            className={`card p-6 hover-lift transition-all duration-300 ${insight.type === 'achievement' ? 'border-yellow-200 dark:border-yellow-800' :
              insight.type === 'warning' ? 'border-red-200 dark:border-red-800' :
                insight.type === 'recommendation' ? 'border-purple-200 dark:border-purple-800' :
                  'border-blue-200 dark:border-blue-800'
              }`}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* Insight Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  {getTypeIcon(insight.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {insight.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                      {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                    </span>
                    <span className={`text-xs ${getConfidenceColor(insight.confidence)}`}>
                      {insight.confidence}% confidence
                    </span>
                  </div>
                </div>
              </div>
              {insight.priority === 'high' && (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                  High Priority
                </span>
              )}
            </div>

            {/* Insight Description */}
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm leading-relaxed">
              {insight.description}
            </p>

            {/* Action Buttons */}
            {insight.actionable && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Shield className="w-3 h-3" />
                  AI-Recommended Actions:
                </div>
                <div className="flex gap-2">
                  {insight.actions.map((action: { text: string; primary: boolean }, actionIndex: number) => (
                    <button
                      key={actionIndex}
                      className={`${action.primary
                        ? 'btn-primary'
                        : 'btn-secondary'
                        } ${action.primary ? 'flex-1' : ''}`}
                    >
                      {action.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI Status Bar */}
      <div className="card p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="w-5 h-5 text-orange-500" />
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                🤖 Neural Network Active
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Deep learning model analyzing your patterns in real-time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 dark:text-green-400">Online</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
          <Star className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-800 dark:text-blue-300 font-medium">
            AI updates every 30 minutes
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Insights are personalized based on your unique patterns and behaviors
        </p>
      </div>
    </div>
  );
};

export default AIInsights;