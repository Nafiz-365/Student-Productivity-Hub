import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

const NotificationCenter: React.FC = () => {
  const { tasks, assignments, classSchedule } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Check for upcoming deadlines and classes
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const today = now.toDateString();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

      const newNotifications: Notification[] = [];

      // Check for overdue tasks
      const overdueTasks = tasks.filter(task =>
        task.status === 'pending' &&
        new Date(task.dueDate) < now
      );

      if (overdueTasks.length > 0) {
        newNotifications.push({
          id: `overdue-tasks-${Date.now()}`,
          type: 'warning',
          title: 'Overdue Tasks',
          message: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`,
          duration: 5000,
          timestamp: Date.now()
        });
      }

      // Check for assignments due tomorrow
      const tomorrowAssignments = assignments.filter(assignment =>
        assignment.status !== 'completed' &&
        new Date(assignment.dueDate).toDateString() === tomorrow
      );

      if (tomorrowAssignments.length > 0) {
        newNotifications.push({
          id: `assignments-tomorrow-${Date.now()}`,
          type: 'info',
          title: 'Assignments Due Tomorrow',
          message: `${tomorrowAssignments.length} assignment${tomorrowAssignments.length > 1 ? 's' : ''} due tomorrow`,
          duration: 5000,
          timestamp: Date.now()
        });
      }

      // Check for classes starting soon (within 15 minutes)
      const currentDay = now.getDay();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const upcomingClasses = classSchedule.filter(cls => {
        if (cls.dayOfWeek !== currentDay) return false;

        const classStart = parseInt(cls.startTime.split(':')[0]) * 60 +
          parseInt(cls.startTime.split(':')[1]);
        const timeDiff = classStart - currentTime;

        return timeDiff > 0 && timeDiff <= 15;
      });

      if (upcomingClasses.length > 0) {
        newNotifications.push({
          id: `class-soon-${Date.now()}`,
          type: 'info',
          title: 'Class Starting Soon',
          message: `${upcomingClasses[0].subject} starts in ${15 - (currentTime - (parseInt(upcomingClasses[0].startTime.split(':')[0]) * 60 + parseInt(upcomingClasses[0].startTime.split(':')[1])))} minutes`,
          duration: 5000,
          timestamp: Date.now()
        });
      }

      // Add new notifications if they don't already exist
      newNotifications.forEach(notification => {
        setNotifications(prev => {
          const exists = prev.some(n => n.id === notification.id);
          if (!exists) {
            return [...prev, notification];
          }
          return prev;
        });
      });
    };

    // Check immediately
    checkNotifications();

    // Check every minute
    const interval = setInterval(checkNotifications, 60000);

    return () => clearInterval(interval);
  }, [tasks, assignments, classSchedule]);

  // Auto-remove notifications after duration
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev =>
        prev.filter(notification => {
          if (notification.duration) {
            return Date.now() - notification.timestamp < notification.duration;
          }
          return true;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300';
      case 'error': return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300';
      default: return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-300';
    }
  };

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Notification Panel */}
      {isVisible && createPortal(
        <>
          <div className="fixed inset-0 z-[99] bg-transparent" onClick={() => setIsVisible(false)} />
          <div className="fixed top-16 right-4 w-80 max-h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[100] overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 pointer-events-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No notifications</p>
                </div>
              ) : (
                <div className="p-2">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-3 mb-2 rounded-lg border ${getNotificationColor(notification.type)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">
                            {notification.title}
                          </p>
                          <p className="text-xs mt-1 opacity-75">
                            {notification.message}
                          </p>
                        </div>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="flex-shrink-0 p-1 opacity-50 hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Toast Notifications */}
      {createPortal(
        <div className="fixed top-20 right-4 space-y-2 z-[100] pointer-events-none">
          {notifications.slice(-3).map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border shadow-lg max-w-sm pointer-events-auto ${getNotificationColor(notification.type)} fade-in animate-in slide-in-from-right-5 duration-300`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {notification.title}
                  </p>
                  <p className="text-xs mt-1 opacity-75">
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="flex-shrink-0 p-1 opacity-50 hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

export default NotificationCenter;