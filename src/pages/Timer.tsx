import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    Timer,
    Play,
    Pause,
    RotateCcw,
    Settings,
    Target,
    TrendingUp,
    Coffee,
    Brain,
    X,
} from 'lucide-react';

interface TimerSettings {
    workDuration: number;
    breakDuration: number;
    longBreakDuration: number;
    sessionsUntilLongBreak: number;
}

const TimerPage: React.FC = () => {
    const { user, studySessions, addStudySession } = useApp();
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
    const [currentSession, setCurrentSession] = useState<
        'work' | 'break' | 'long-break'
    >('work');
    const [sessionCount, setSessionCount] = useState(0);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSessionComplete, setIsSessionComplete] = useState(false);
    const [sessionNote, setSessionNote] = useState('');
    const [sessionSubject, setSessionSubject] = useState('');

    const [settings, setSettings] = useState<TimerSettings>({
        workDuration: 25,
        breakDuration: 5,
        longBreakDuration: 15,
        sessionsUntilLongBreak: 4,
    });

    const audioRef = useRef<HTMLAudioElement>(null);

    // Load settings from localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem('timerSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    // Save settings to localStorage
    useEffect(() => {
        localStorage.setItem('timerSettings', JSON.stringify(settings));
    }, [settings]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && !isPaused) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning, isPaused]);

    const handleSessionComplete = React.useCallback(() => {
        setIsRunning(false);
        setIsPaused(false);
        setIsSessionComplete(true);

        // Play notification sound
        if (audioRef.current) {
            audioRef.current.play();
        }

        // Log the session
        const sessionDuration =
            currentSession === 'work'
                ? settings.workDuration
                : currentSession === 'break'
                  ? settings.breakDuration
                  : settings.longBreakDuration;

        if (currentSession === 'work') {
            addStudySession({
                duration: sessionDuration,
                subject: sessionSubject || 'Self Study',
                notes: sessionNote,
            });
        }

        // Auto-transition to next session logic prepared but waits for user
    }, [
        currentSession,
        settings,
        sessionSubject,
        sessionNote,
        addStudySession,
    ]);

    useEffect(() => {
        if (timeLeft === 0 && isRunning) {
            handleSessionComplete();
        }
    }, [timeLeft, isRunning, handleSessionComplete]);

    const continueToNextSession = () => {
        if (currentSession === 'work') {
            const newCount = sessionCount + 1;
            setSessionCount(newCount);

            if (newCount % settings.sessionsUntilLongBreak === 0) {
                setCurrentSession('long-break');
                setTimeLeft(settings.longBreakDuration * 60);
            } else {
                setCurrentSession('break');
                setTimeLeft(settings.breakDuration * 60);
            }
        } else {
            setCurrentSession('work');
            setTimeLeft(settings.workDuration * 60);
        }

        setIsSessionComplete(false);
        setSessionNote('');
        setSessionSubject('');
    };

    const startTimer = () => {
        setIsRunning(true);
        setIsPaused(false);
    };

    const pauseTimer = () => {
        setIsPaused(true);
    };

    const resumeTimer = () => {
        setIsPaused(false);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setIsPaused(false);

        if (currentSession === 'work') setTimeLeft(settings.workDuration * 60);
        else if (currentSession === 'break')
            setTimeLeft(settings.breakDuration * 60);
        else setTimeLeft(settings.longBreakDuration * 60);
    };

    const skipSession = () => {
        setIsRunning(false);
        setIsPaused(false);

        if (currentSession === 'work') {
            const newCount = sessionCount + 1;
            setSessionCount(newCount);

            if (newCount % settings.sessionsUntilLongBreak === 0) {
                setCurrentSession('long-break');
                setTimeLeft(settings.longBreakDuration * 60);
            } else {
                setCurrentSession('break');
                setTimeLeft(settings.breakDuration * 60);
            }
        } else {
            setCurrentSession('work');
            setTimeLeft(settings.workDuration * 60);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getSessionTitle = () => {
        switch (currentSession) {
            case 'work':
                return 'Deep Focus';
            case 'break':
                return 'Short Break';
            case 'long-break':
                return 'Long Break';
            default:
                return 'Timer';
        }
    };

    const getSessionIcon = () => {
        switch (currentSession) {
            case 'work':
                return <Brain className="w-8 h-8" />;
            case 'break':
                return <Coffee className="w-8 h-8" />;
            case 'long-break':
                return <Coffee className="w-8 h-8" />;
            default:
                return <Timer className="w-8 h-8" />;
        }
    };

    const getSessionColor = () => {
        switch (currentSession) {
            case 'work':
                return 'text-violet-600 dark:text-violet-400';
            case 'break':
                return 'text-emerald-600 dark:text-emerald-400';
            case 'long-break':
                return 'text-blue-600 dark:text-blue-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    const getThemeClass = () => {
        switch (currentSession) {
            case 'work':
                return 'from-violet-500 to-fuchsia-500';
            case 'break':
                return 'from-emerald-400 to-teal-500';
            case 'long-break':
                return 'from-blue-400 to-indigo-500';
            default:
                return 'from-gray-500 to-slate-500';
        }
    };

    // Calculate statistics
    const todaySessions = studySessions.filter(
        (session) =>
            new Date(session.completedAt).toDateString() ===
            new Date().toDateString(),
    ).length;

    const totalFocusMinutes = studySessions.reduce(
        (acc, curr) => acc + curr.duration,
        0,
    );

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Audio for notifications - Clear beep sound */}
            <audio ref={audioRef} preload="auto">
                <source
                    src="data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWgAAAA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAABtlbMvYAAACkyGZoAAAGkF1Wew8AAEJkM99gAAA5AAABJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
                    type="audio/mpeg"
                />
            </audio>

            {/* Header Banner */}
            <div
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${getThemeClass()} p-8 text-white shadow-xl transition-colors duration-1000`}
            >
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <Timer className="w-8 h-8" /> Focus Timer
                        </h1>
                        <p className="text-white/90 text-lg">
                            Stay in the flow. {todaySessions} sessions completed
                            today.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-all duration-300"
                    >
                        <Settings className="w-5 h-5" />
                        Settings
                    </button>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Timer Display */}
                <div className="lg:col-span-2">
                    <div className="card p-12 flex flex-col items-center justify-center min-h-[500px] glass-panel relative overflow-hidden">
                        {/* Progress Circles (SVG) */}
                        <div className="relative mb-12">
                            <div className="w-80 h-80 relative flex items-center justify-center">
                                {/* Background Circle */}
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                    <circle
                                        cx="160"
                                        cy="160"
                                        r="140"
                                        className="text-gray-100 dark:text-gray-800"
                                        strokeWidth="12"
                                        stroke="currentColor"
                                        fill="transparent"
                                    />
                                    {/* Progress Circle */}
                                    <circle
                                        cx="160"
                                        cy="160"
                                        r="140"
                                        className={`${getSessionColor()} transition-all duration-1000 ease-linear`}
                                        strokeWidth="12"
                                        strokeDasharray={2 * Math.PI * 140}
                                        strokeDashoffset={
                                            2 *
                                            Math.PI *
                                            140 *
                                            (1 -
                                                timeLeft /
                                                    (currentSession === 'work'
                                                        ? settings.workDuration *
                                                          60
                                                        : currentSession ===
                                                            'break'
                                                          ? settings.breakDuration *
                                                            60
                                                          : settings.longBreakDuration *
                                                            60))
                                        }
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                    />
                                </svg>

                                {/* Timer Text */}
                                <div className="text-center z-10 flex flex-col items-center">
                                    <div
                                        className={`text-6xl sm:text-8xl font-black tracking-tighter tabular-nums ${getSessionColor()} transition-colors duration-500`}
                                    >
                                        {formatTime(timeLeft)}
                                    </div>
                                    <div
                                        className={`text-xl font-medium mt-2 flex items-center justify-center gap-2 ${getSessionColor()}`}
                                    >
                                        {getSessionIcon()} {getSessionTitle()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-wrap justify-center gap-6">
                            {!isRunning ? (
                                <button
                                    onClick={startTimer}
                                    className={`group relative flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r ${getThemeClass()} text-white font-bold text-xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300`}
                                >
                                    <Play className="w-6 h-6 fill-current" />
                                    Start Focus
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={
                                            isPaused ? resumeTimer : pauseTimer
                                        }
                                        className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        {isPaused ? (
                                            <Play className="w-5 h-5" />
                                        ) : (
                                            <Pause className="w-5 h-5" />
                                        )}
                                        {isPaused ? 'Resume' : 'Pause'}
                                    </button>
                                    <button
                                        onClick={resetTimer}
                                        className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Skip */}
                        <button
                            onClick={skipSession}
                            className="mt-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-semibold uppercase tracking-widest transition-colors"
                        >
                            Skip to next
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Current Task Input */}
                    <div className="card p-6 glass-panel">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-red-500" /> Current
                            Objective
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={sessionSubject}
                                    onChange={(e) =>
                                        setSessionSubject(e.target.value)
                                    }
                                    placeholder="e.g. Physics Revision"
                                    className="input w-full mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Session Notes
                                </label>
                                <textarea
                                    value={sessionNote}
                                    onChange={(e) =>
                                        setSessionNote(e.target.value)
                                    }
                                    placeholder="What are you working on?"
                                    className="input w-full mt-1 resize-none h-24"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="card p-6 glass-panel">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />{' '}
                            Daily Progress
                        </h3>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-400">
                                Sessions
                            </span>
                            <span className="font-bold text-gray-900 dark:text-white">
                                {todaySessions}
                            </span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-600 dark:text-gray-400">
                                Time Focused
                            </span>
                            <span className="font-bold text-gray-900 dark:text-white">
                                {Math.floor(totalFocusMinutes / 60)}h{' '}
                                {totalFocusMinutes % 60}m
                            </span>
                        </div>

                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-green-500 h-2.5 rounded-full"
                                style={{
                                    width: `${Math.min((todaySessions / 8) * 100, 100)}%`,
                                }}
                            ></div>
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-2">
                            Daily Goal: 8 Sessions
                        </p>
                    </div>
                </div>
            </div>

            {/* Completion Modal */}
            {isSessionComplete && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                    <div className="card p-8 max-w-sm w-full text-center relative overflow-hidden">
                        <div
                            className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${getThemeClass()}`}
                        ></div>

                        <div
                            className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gray-50 dark:bg-gray-800`}
                        >
                            <div className={getSessionColor()}>
                                {getSessionIcon()}
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {currentSession === 'work'
                                ? 'Focus Complete!'
                                : 'Break Over!'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            {currentSession === 'work'
                                ? 'Great job maintaining focus. Take a well-deserved break.'
                                : "Hope you're refreshed. Ready to get back to work?"}
                        </p>

                        <button
                            onClick={continueToNextSession}
                            className={`w-full py-4 rounded-xl bg-gradient-to-r ${getThemeClass()} text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all`}
                        >
                            {currentSession === 'work'
                                ? 'Start Break'
                                : 'Start Focus'}
                        </button>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
                    <div className="card w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Settings className="w-5 h-5 text-gray-500" />{' '}
                                Timer Settings
                            </h2>
                            <button onClick={() => setIsSettingsOpen(false)}>
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="flex justify-between text-sm font-semibold mb-2">
                                        <span>Focus Duration</span>
                                        <span className="text-violet-600">
                                            {settings.workDuration} min
                                        </span>
                                    </label>
                                    <input
                                        type="range"
                                        min="5"
                                        max="60"
                                        step="5"
                                        value={settings.workDuration}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                workDuration: parseInt(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-violet-600"
                                    />
                                </div>
                                <div>
                                    <label className="flex justify-between text-sm font-semibold mb-2">
                                        <span>Short Break</span>
                                        <span className="text-emerald-600">
                                            {settings.breakDuration} min
                                        </span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="15"
                                        value={settings.breakDuration}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                breakDuration: parseInt(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
                                    />
                                </div>
                                <div>
                                    <label className="flex justify-between text-sm font-semibold mb-2">
                                        <span>Long Break</span>
                                        <span className="text-blue-600">
                                            {settings.longBreakDuration} min
                                        </span>
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="45"
                                        step="5"
                                        value={settings.longBreakDuration}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                longBreakDuration: parseInt(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => setIsSettingsOpen(false)}
                                className="btn-primary w-full py-3"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimerPage;
