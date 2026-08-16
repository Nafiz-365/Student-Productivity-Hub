import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    User,
    Mail,
    Settings,
    LogOut,
    Camera,
    Moon,
    Sun,
    Bell,
    Shield,
    Key,
} from 'lucide-react';
import DataManagement from '../components/DataManagement';

const Profile: React.FC = () => {
    const { user, logout, darkMode, toggleDarkMode, updateUserProfile } =
        useApp();
    const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'data'>(
        'profile',
    );
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full border-4 border-white/30 p-1">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover bg-white"
                            />
                        </div>
                        <button className="absolute bottom-1 right-1 p-2 bg-blue-500 rounded-full hover:bg-blue-400 transition-colors shadow-lg">
                            <Camera className="w-4 h-4 text-white" />
                        </button>
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        <p className="text-violet-100">{user.email}</p>
                        <div className="flex gap-2 justify-center md:justify-start mt-3">
                            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium backdrop-blur-sm border border-white/20">
                                Student
                            </span>
                            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium backdrop-blur-sm border border-white/20">
                                Pro Member
                            </span>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="card p-2 glass-panel">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            <User className="w-5 h-5" /> Profile Details
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            <Settings className="w-5 h-5" /> Preferences
                        </button>
                        <button
                            onClick={() => setActiveTab('data')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'data' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            <Shield className="w-5 h-5" /> Data & Privacy
                        </button>

                        <div className="my-2 border-t border-gray-100 dark:border-gray-800"></div>

                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium"
                        >
                            <LogOut className="w-5 h-5" /> Sign Out
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {activeTab === 'profile' && (
                        <div className="card p-6 glass-panel animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Personal Information
                                </h2>
                                {!isEditing ? (
                                    <button
                                        onClick={() => {
                                            setEditName(user.name);
                                            setEditEmail(user.email);
                                            setIsEditing(true);
                                        }}
                                        className="btn-secondary text-xs py-2 px-4"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                updateUserProfile({
                                                    name: editName,
                                                    email: editEmail,
                                                });
                                                setIsEditing(false);
                                            }}
                                            className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Full Name
                                    </label>
                                    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                        <User className="w-5 h-5 text-gray-400" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) =>
                                                    setEditName(e.target.value)
                                                }
                                                className="bg-transparent border-none focus:ring-0 w-full text-gray-900 dark:text-white p-0 h-auto"
                                            />
                                        ) : (
                                            <span className="text-gray-900 dark:text-white font-medium">
                                                {user.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Email Address
                                    </label>
                                    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editEmail}
                                                onChange={(e) =>
                                                    setEditEmail(e.target.value)
                                                }
                                                className="bg-transparent border-none focus:ring-0 w-full text-gray-900 dark:text-white p-0 h-auto"
                                            />
                                        ) : (
                                            <span className="text-gray-900 dark:text-white font-medium">
                                                {user.email}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Password & Security
                                </h3>
                                <button className="btn-secondary">
                                    <Key className="w-4 h-4 mr-2" /> Change
                                    Password
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="card p-6 glass-panel animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                App Preferences
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`p-3 rounded-full ${darkMode ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}
                                        >
                                            {darkMode ? (
                                                <Moon className="w-6 h-6" />
                                            ) : (
                                                <Sun className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">
                                                Appearance
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {darkMode
                                                    ? 'Dark Mode'
                                                    : 'Light Mode'}{' '}
                                                is currently active
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggleDarkMode}
                                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-200 dark:bg-blue-600"
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600">
                                            <Bell className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">
                                                Notifications
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Manage alerts and reminders
                                            </p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            defaultChecked
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'data' && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <DataManagement />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
