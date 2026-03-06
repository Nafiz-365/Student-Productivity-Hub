import React, { useState, useEffect } from 'react';
import { Search, Clock, Calendar, Target, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface QuickSearchProps {
  onClose: () => void;
}

const QuickSearch: React.FC<QuickSearchProps> = ({ onClose }) => {
  const { tasks, assignments, classSchedule } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          window.location.href = results[selectedIndex].url;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [results, selectedIndex, onClose]);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const searchResults: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      priority?: string;
      dueDate?: string;
      status?: string;
      grade?: number;
      url: string;
      icon: React.ReactNode;
    }> = [];

    // Search tasks
    tasks.forEach(task => {
      if (task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))) {
        searchResults.push({
          id: task.id,
          type: 'task',
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          dueDate: task.dueDate,
          status: task.status,
          url: '/tasks',
          icon: <Target className="w-4 h-4" />
        });
      }
    });

    // Search assignments
    assignments.forEach(assignment => {
      if (assignment.title.toLowerCase().includes(searchLower) ||
        assignment.subject.toLowerCase().includes(searchLower) ||
        (assignment.description && assignment.description.toLowerCase().includes(searchLower))) {
        searchResults.push({
          id: assignment.id,
          type: 'assignment',
          title: assignment.title,
          description: assignment.subject,
          priority: assignment.status,
          dueDate: assignment.dueDate,
          status: assignment.status,
          grade: assignment.grade,
          url: '/assignments',
          icon: <Calendar className="w-4 h-4" />
        });
      }
    });

    // Search classes
    classSchedule.forEach(cls => {
      if (cls.subject.toLowerCase().includes(searchLower) ||
        cls.room.toLowerCase().includes(searchLower)) {
        searchResults.push({
          id: cls.id,
          type: 'class',
          title: cls.subject,
          description: `${cls.startTime} - ${cls.endTime} • Room ${cls.room}`,
          priority: 'medium',
          url: '/schedule',
          icon: <Clock className="w-4 h-4" />
        });
      }
    });

    setResults(searchResults.slice(0, 10));
    setSelectedIndex(0);
  }, [searchTerm, tasks, assignments, classSchedule]);

  const getStatusColor = (status: string, type: string) => {
    if (type === 'task') {
      if (status === 'completed') return 'text-green-600';
      if (status === 'in-progress') return 'text-blue-600';
      return 'text-yellow-600';
    }
    return 'text-gray-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50 p-4">
      <div className="card w-full max-w-2xl shadow-2xl slide-up">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks, assignments, classes..."
              className="input pl-10 text-lg w-full"
              autoFocus
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">↑</kbd>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">↓</kbd> to navigate •
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Enter</kbd> to select •
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Esc</kbd> to close
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No results found' : 'Type to search...'}
              </p>
            </div>
          ) : (
            <div className="p-2">
              {results.map((result, index) => (
                <a
                  key={result.id}
                  href={result.url}
                  className={`block p-3 rounded-lg cursor-pointer transition-colors ${index === selectedIndex
                    ? 'bg-primary-100 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-transparent'
                    } border`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = result.url;
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${result.type === 'task' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      result.type === 'assignment' ? 'bg-green-100 dark:bg-green-900/30' :
                        'bg-purple-100 dark:bg-purple-900/30'
                      }`}>
                      {result.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {result.title}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${result.type === 'task' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          result.type === 'assignment' ? 'bg-green-100 text-green-800 border-green-200' :
                            'bg-purple-100 text-purple-800 border-purple-200'
                          }`}>
                          {result.type}
                        </span>
                        {result.priority && (
                          <span className={`text-xs font-medium ${getStatusColor(result.status, result.type)}`}>
                            {result.status}
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {result.description}
                      </div>

                      {result.dueDate && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDate(result.dueDate)}
                        </div>
                      )}

                      {result.grade && (
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                          Grade: {result.grade}%
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;