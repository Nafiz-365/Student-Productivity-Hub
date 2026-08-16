import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    CheckSquare,
    BookOpen,
    User,
    Flame,
    Moon,
    Sun,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavItem {
    path: string;
    label: string;
    icon: React.ReactNode;
}

const SimpleNavbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode, toggleDarkMode } = useApp();

    const navItems: NavItem[] = [
        {
            path: '/dashboard',
            label: 'Dashboard',
            icon: <Home className="w-4 h-4" />,
        },
        {
            path: '/tasks',
            label: 'Tasks',
            icon: <CheckSquare className="w-4 h-4" />,
        },
        {
            path: '/assignments',
            label: 'Assignments',
            icon: <BookOpen className="w-4 h-4" />,
        },
    ];

    const isActivePath = (path: string) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 group"
                    >
                        <div className="relative">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
                                <span className="text-xl font-bold text-white">
                                    S
                                </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                            StudyHub
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center p-1 space-x-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                        {navItems.map((item) => {
                            const isActive = isActivePath(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                        isActive
                                            ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700/50'
                                    }`}
                                >
                                    <span
                                        className={`relative z-10 ${isActive ? 'scale-110' : ''} transition-transform duration-300`}
                                    >
                                        {item.icon}
                                    </span>
                                    <span className="relative z-10">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side - User Menu */}
                    <div className="flex items-center space-x-3">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title={
                                darkMode
                                    ? 'Switch to Light Mode'
                                    : 'Switch to Dark Mode'
                            }
                        >
                            {darkMode ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium border border-orange-100 dark:border-orange-900/30">
                            <Flame className="w-3.5 h-3.5 fill-current" />
                            <span>3 Day Streak</span>
                        </div>

                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-[2px]">
                                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default SimpleNavbar;
