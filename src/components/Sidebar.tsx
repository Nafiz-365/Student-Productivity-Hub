import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    Home,
    CheckSquare,
    BookOpen,
    Calendar,
    Clock,
    TrendingUp,
    User,
    LogOut,
    Sun,
    Moon,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';

const Sidebar: React.FC = () => {
    const { logout, darkMode, toggleDarkMode } = useApp();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const navigate = useNavigate();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/tasks', label: 'Tasks', icon: CheckSquare },
        { path: '/assignments', label: 'Assignments', icon: BookOpen },
        { path: '/schedule', label: 'Schedule', icon: Calendar },
        { path: '/timer', label: 'Focus Timer', icon: Clock },
        { path: '/analytics', label: 'Analytics', icon: TrendingUp },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavItem = ({ item, isMobile = false }: { item: any, isMobile?: boolean }) => (
        <NavLink
            to={item.path}
            onClick={() => isMobile && setIsMobileOpen(false)}
            className={({ isActive }) => `
        group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mx-3 mb-1
        ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400'
                }
      `}
        >
            {({ isActive }) => (
                <>
                    <item.icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
                </>
            )}
        </NavLink>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">S</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">StudyHub</span>
                </div>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    {isMobileOpen ? <X className="w-6 h-6 text-gray-600 dark:text-gray-300" /> : <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />}
                </button>
            </div>

            {/* Sidebar Content */}
            <div className={`
        fixed top-0 left-0 h-full z-40 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-white/5 shadow-2xl transition-transform duration-300 lg:translate-x-0 w-72 flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Header */}
                <div className="p-6 hidden lg:flex items-center gap-3 mb-2">
                    <div className="relative group cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
                            <span className="text-xl font-bold text-white">S</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            StudyHub
                        </h1>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Pro Student</p>
                    </div>
                </div>

                {/* Mobile Header Spacer */}
                <div className="h-20 lg:hidden"></div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <div className="px-6 mb-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Menu
                    </div>
                    {navItems.map((item) => (
                        <NavItem key={item.path} item={item} isMobile={isMobileOpen} />
                    ))}

                    <div className="mt-8 px-6 mb-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Settings
                    </div>
                    <NavLink
                        to="/profile"
                        onClick={() => isMobileOpen && setIsMobileOpen(false)}
                        className={({ isActive }) => `
              group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mx-3 mb-1
              ${isActive
                                ? 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                            }
            `}
                    >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Profile</span>
                    </NavLink>
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20">
                    <div className="flex items-center justify-between gap-2 mb-4 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${darkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-amber-100 text-amber-500'}`}>
                                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold text-gray-900 dark:text-white">{darkMode ? 'Dark Mode' : 'Light Mode'}</p>
                                <p className="text-xs text-gray-400">{darkMode ? 'On' : 'Off'}</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors bg-gray-200 dark:bg-indigo-600 focus:outline-none"
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium text-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Backdrop for Mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden animate-in fade-in"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
