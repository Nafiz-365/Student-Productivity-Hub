import React, { useState, useEffect } from 'react';
import { Trophy, Target, Clock, Brain, Award, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AchievementSystem: React.FC = () => {
  const { tasks, assignments, studySessions } = useApp();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements = [];

      // Task achievements
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      if (completedTasks >= 1) {
        newAchievements.push({
          id: 'first-task',
          title: 'First Step',
          description: 'Complete your first task',
          icon: <Target className="w-6 h-6" />,
          color: 'bg-blue-500',
          unlocked: true
        });
      }
      if (completedTasks >= 10) {
        newAchievements.push({
          id: 'task-master',
          title: 'Task Master',
          description: 'Complete 10 tasks',
          icon: <Trophy className="w-6 h-6" />,
          color: 'bg-green-500',
          unlocked: true
        });
      }
      if (completedTasks >= 50) {
        newAchievements.push({
          id: 'task-champion',
          title: 'Task Champion',
          description: 'Complete 50 tasks',
          icon: <Award className="w-6 h-6" />,
          color: 'bg-purple-500',
          unlocked: true
        });
      }

      // Assignment achievements
      const completedAssignments = assignments.filter(a => a.status === 'completed').length;
      if (completedAssignments >= 1) {
        newAchievements.push({
          id: 'first-assignment',
          title: 'Assignment Complete',
          description: 'Complete your first assignment',
          icon: <Target className="w-6 h-6" />,
          color: 'bg-orange-500',
          unlocked: true
        });
      }

      // Study achievements
      const totalStudyTime = studySessions.reduce((total, session) => total + session.duration, 0);
      if (totalStudyTime >= 25) { // 25 minutes
        newAchievements.push({
          id: 'first-pomodoro',
          title: 'Pomodoro Pro',
          description: 'Complete your first Pomodoro session',
          icon: <Clock className="w-6 h-6" />,
          color: 'bg-red-500',
          unlocked: true
        });
      }
      if (totalStudyTime >= 150) { // 2.5 hours
        newAchievements.push({
          id: 'study-warrior',
          title: 'Study Warrior',
          description: 'Study for 2.5 hours total',
          icon: <Brain className="w-6 h-6" />,
          color: 'bg-indigo-500',
          unlocked: true
        });
      }
      if (totalStudyTime >= 600) { // 10 hours
        newAchievements.push({
          id: 'study-master',
          title: 'Study Master',
          description: 'Study for 10 hours total',
          icon: <Trophy className="w-6 h-6" />,
          color: 'bg-yellow-500',
          unlocked: true
        });
      }

      // Streak achievements
      const today = new Date().toDateString();
      const todayTasks = tasks.filter(t =>
        t.status === 'completed' &&
        new Date(t.createdAt).toDateString() === today
      ).length;

      if (todayTasks >= 5) {
        newAchievements.push({
          id: 'productive-day',
          title: 'Productive Day',
          description: 'Complete 5 tasks in one day',
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'bg-teal-500',
          unlocked: true
        });
      }

      // Check for new achievements
      const existingIds = achievements.map(a => a.id);
      const newUnlocked = newAchievements.filter(a =>
        a.unlocked && !existingIds.includes(a.id)
      );

      if (newUnlocked.length > 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }

      setAchievements(newAchievements);
    };

    checkAchievements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, assignments, studySessions]);

  const allAchievements = [
    {
      id: 'first-task',
      title: 'First Step',
      description: 'Complete your first task',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-blue-500',
      unlocked: false
    },
    {
      id: 'task-master',
      title: 'Task Master',
      description: 'Complete 10 tasks',
      icon: <Trophy className="w-6 h-6" />,
      color: 'bg-green-500',
      unlocked: false
    },
    {
      id: 'task-champion',
      title: 'Task Champion',
      description: 'Complete 50 tasks',
      icon: <Award className="w-6 h-6" />,
      color: 'bg-purple-500',
      unlocked: false
    },
    {
      id: 'first-assignment',
      title: 'Assignment Complete',
      description: 'Complete your first assignment',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-orange-500',
      unlocked: false
    },
    {
      id: 'first-pomodoro',
      title: 'Pomodoro Pro',
      description: 'Complete your first Pomodoro session',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-red-500',
      unlocked: false
    },
    {
      id: 'study-warrior',
      title: 'Study Warrior',
      description: 'Study for 2.5 hours total',
      icon: <Brain className="w-6 h-6" />,
      color: 'bg-indigo-500',
      unlocked: false
    },
    {
      id: 'study-master',
      title: 'Study Master',
      description: 'Study for 10 hours total',
      icon: <Trophy className="w-6 h-6" />,
      color: 'bg-yellow-500',
      unlocked: false
    },
    {
      id: 'productive-day',
      title: 'Productive Day',
      description: 'Complete 5 tasks in one day',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-teal-500',
      unlocked: false
    }
  ];

  const unlockedAchievements = allAchievements.filter(a =>
    achievements.find(ua => ua.id === a.id)?.unlocked
  );

  const lockedAchievements = allAchievements.filter(a =>
    !achievements.find(ua => ua.id === a.id)?.unlocked
  );

  return (
    <>
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card p-8 text-center max-w-md slide-up">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Achievement Unlocked! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Keep up the great work!
            </p>
          </div>
        </div>
      )}

      {/* Achievement Display */}
      <div className="space-y-6">
        {/* Stats */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Achievements
            </h3>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {unlockedAchievements.length}/{allAchievements.length}
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedAchievements.length / allAchievements.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="card p-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
              Unlocked
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unlockedAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className={`p-2 rounded-lg ${achievement.color} text-white`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {achievement.description}
                    </p>
                  </div>
                  <Trophy className="w-4 h-4 text-yellow-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div className="card p-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
              Locked
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lockedAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg opacity-60"
                >
                  <div className="p-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-500">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-500 dark:text-gray-400">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {achievement.description}
                    </p>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AchievementSystem;