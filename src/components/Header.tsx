import React, { useState } from 'react';
import { Search, Flame } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 transition-all z-30">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                        placeholder="Search tasks, assignments, notes..."
                    />
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4 ml-4">
                {/* Streak Counter */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full text-xs font-bold border border-orange-100 dark:border-orange-900/30 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <Flame className="w-4 h-4 fill-current animate-pulse" />
                    <span>3 Day Streak</span>
                </div>

                {/* Notifications */}
                <NotificationCenter />
            </div>
        </header>
    );
};

export default Header;
