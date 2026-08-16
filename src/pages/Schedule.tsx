import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    Calendar,
    Plus,
    Clock,
    MapPin,
    Edit2,
    X,
    ChevronLeft,
    ChevronRight,
    Bell,
    BookOpen,
} from 'lucide-react';

interface ScheduleFormData {
    subject: string;
    room: string;
    startTime: string;
    endTime: string;
    dayOfWeek: number;
}

const Schedule: React.FC = () => {
    const { user, classSchedule, addClassSchedule, updateClassSchedule } =
        useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<string | null>(null);
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [formData, setFormData] = useState<ScheduleFormData>({
        subject: '',
        room: '',
        startTime: '',
        endTime: '',
        dayOfWeek: 1, // Monday
    });

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const weekDays = [
        { name: 'Sunday', short: 'Sun', value: 0 },
        { name: 'Monday', short: 'Mon', value: 1 },
        { name: 'Tuesday', short: 'Tue', value: 2 },
        { name: 'Wednesday', short: 'Wed', value: 3 },
        { name: 'Thursday', short: 'Thu', value: 4 },
        { name: 'Friday', short: 'Fri', value: 5 },
        { name: 'Saturday', short: 'Sat', value: 6 },
    ];

    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        const time = hour.toString().padStart(2, '0') + ':00';
        return { hour, time };
    });

    // Get classes for each day
    const getClassesForDay = (dayOfWeek: number) => {
        return classSchedule
            .filter((cls) => cls.dayOfWeek === dayOfWeek)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    // Check if current time is within class time
    const isCurrentClass = (startTime: string, endTime: string) => {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const start =
            parseInt(startTime.split(':')[0]) * 60 +
            parseInt(startTime.split(':')[1]);
        const end =
            parseInt(endTime.split(':')[0]) * 60 +
            parseInt(endTime.split(':')[1]);
        return currentTime >= start && currentTime <= end;
    };

    // Get current day
    const getCurrentDay = () => {
        return new Date().getDay();
    };

    const resetForm = () => {
        setFormData({
            subject: '',
            room: '',
            startTime: '',
            endTime: '',
            dayOfWeek: 1,
        });
        setEditingClass(null);
    };

    const openModal = (cls?: any) => {
        if (cls) {
            setEditingClass(cls.id);
            setFormData({
                subject: cls.subject,
                room: cls.room,
                startTime: cls.startTime,
                endTime: cls.endTime,
                dayOfWeek: cls.dayOfWeek,
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.subject.trim() ||
            !formData.room.trim() ||
            !formData.startTime ||
            !formData.endTime
        ) {
            return;
        }

        // Validate time
        if (formData.startTime >= formData.endTime) {
            alert('End time must be after start time');
            return;
        }

        const scheduleData = {
            subject: formData.subject.trim(),
            room: formData.room.trim(),
            startTime: formData.startTime,
            endTime: formData.endTime,
            dayOfWeek: formData.dayOfWeek,
        };

        if (editingClass) {
            updateClassSchedule(editingClass, scheduleData);
        } else {
            addClassSchedule(scheduleData);
        }

        closeModal();
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newWeek = new Date(currentWeek);
        if (direction === 'prev') {
            newWeek.setDate(newWeek.getDate() - 7);
        } else {
            newWeek.setDate(newWeek.getDate() + 7);
        }
        setCurrentWeek(newWeek);
    };

    const goToToday = () => {
        setCurrentWeek(new Date());
    };

    const getWeekDates = () => {
        const dates = [];
        const startOfWeek = new Date(currentWeek);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day;
        startOfWeek.setDate(diff);

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const weekDates = getWeekDates();
    const currentDay = getCurrentDay();

    // Calculate statistics
    const stats = {
        totalClasses: classSchedule.length,
        todayClasses: getClassesForDay(currentDay).length,
        weekClasses: classSchedule.length,
        currentClass: classSchedule.filter(
            (cls) =>
                cls.dayOfWeek === currentDay &&
                isCurrentClass(cls.startTime, cls.endTime),
        ).length,
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 p-8 text-white shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Class Schedule
                        </h1>
                        <p className="text-cyan-100 text-lg">
                            {stats.currentClass > 0 ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>{' '}
                                    Class currently in progress!
                                </span>
                            ) : (
                                `You have ${stats.todayClasses} classes today.`
                            )}
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-white text-cyan-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                        <Plus className="w-5 h-5" />
                        Add Class
                    </button>
                </div>

                {/* Decorative elements */}
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-20"></div>
                <div className="absolute -bottom-6 -right-6 text-white/10 rotate-12">
                    <Calendar size={140} />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-4 glass-panel border-l-4 border-l-blue-500 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-2">
                        <span className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                            <BookOpen className="w-5 h-5" />
                        </span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats.totalClasses}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                        Total Classes
                    </p>
                </div>
                <div className="card p-4 glass-panel border-l-4 border-l-green-500 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-2">
                        <span className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                            <Clock className="w-5 h-5" />
                        </span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats.todayClasses}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                        Classes Today
                    </p>
                </div>
                <div className="card p-4 glass-panel border-l-4 border-l-purple-500 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-2">
                        <span className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                            <Calendar className="w-5 h-5" />
                        </span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats.weekClasses}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                        Weekly Total
                    </p>
                </div>
                <div className="card p-4 glass-panel border-l-4 border-l-orange-500 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-2">
                        <span className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                            <Bell className="w-5 h-5" />
                        </span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats.currentClass}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                        Happening Now
                    </p>
                </div>
            </div>

            {/* Week Navigation */}
            <div className="card p-4 glass-panel flex items-center justify-between">
                <button
                    onClick={navigateWeek.bind(null, 'prev')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>

                <div className="text-center">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        {weekDates[0].toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                        })}{' '}
                        -{' '}
                        {weekDates[6].toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </h2>
                    <button
                        onClick={goToToday}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-500 uppercase tracking-wider mt-1"
                    >
                        Jump to Today
                    </button>
                </div>

                <button
                    onClick={navigateWeek.bind(null, 'next')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
            </div>

            {/* Weekly Schedule Grid */}
            <div className="card overflow-hidden glass-panel shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        {/* Header */}
                        <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                            <div className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center border-r border-gray-200/50">
                                Time
                            </div>
                            {weekDays.map((day, index) => {
                                const date = weekDates[index];
                                const isToday =
                                    date.toDateString() ===
                                    new Date().toDateString();
                                const classesCount = getClassesForDay(
                                    day.value,
                                ).length;

                                return (
                                    <div
                                        key={day.value}
                                        className={`p-3 text-center border-l border-gray-200 dark:border-gray-700 relative group transition-colors ${
                                            isToday
                                                ? 'bg-blue-50/50 dark:bg-blue-900/10'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                                        }`}
                                    >
                                        {isToday && (
                                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                                        )}
                                        <div
                                            className={`text-sm font-bold ${
                                                isToday
                                                    ? 'text-blue-700 dark:text-blue-300'
                                                    : 'text-gray-700 dark:text-gray-300'
                                            }`}
                                        >
                                            {day.short}
                                        </div>
                                        <div
                                            className={`text-2xl font-light mb-1 ${
                                                isToday
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-400 dark:text-gray-500'
                                            }`}
                                        >
                                            {date.getDate()}
                                        </div>
                                        {classesCount > 0 && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                                {classesCount} class
                                                {classesCount !== 1 ? 'es' : ''}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Time Slots */}
                        {timeSlots.map((slot) => (
                            <div
                                key={slot.hour}
                                className="grid grid-cols-8 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/30 dark:hover:bg-gray-800/20 transition-colors"
                            >
                                {/* Time Label */}
                                <div className="p-3 text-xs font-medium text-gray-400 border-r border-gray-200 dark:border-gray-700 text-center relative -top-3">
                                    {slot.time}
                                </div>

                                {/* Days */}
                                {weekDays.map((day) => {
                                    const dayClasses = getClassesForDay(
                                        day.value,
                                    );
                                    const currentClass = dayClasses.find(
                                        (cls) =>
                                            isCurrentClass(
                                                cls.startTime,
                                                cls.endTime,
                                            ),
                                    );

                                    return (
                                        <div
                                            key={`${day.value}-${slot.hour}`}
                                            className={`p-1 border-l border-gray-200 dark:border-gray-700 min-h-[60px] relative ${
                                                currentClass
                                                    ? 'bg-orange-50/30 dark:bg-orange-900/10'
                                                    : ''
                                            }`}
                                        >
                                            {dayClasses
                                                .filter((cls) => {
                                                    const startHour = parseInt(
                                                        cls.startTime.split(
                                                            ':',
                                                        )[0],
                                                    );
                                                    const endHour = parseInt(
                                                        cls.endTime.split(
                                                            ':',
                                                        )[0],
                                                    );
                                                    return (
                                                        slot.hour >=
                                                            startHour &&
                                                        slot.hour < endHour
                                                    );
                                                })
                                                .map((cls) => {
                                                    const startHour = parseInt(
                                                        cls.startTime.split(
                                                            ':',
                                                        )[0],
                                                    );
                                                    const isStart =
                                                        slot.hour === startHour;

                                                    if (!isStart) return null;

                                                    const duration =
                                                        parseInt(
                                                            cls.endTime.split(
                                                                ':',
                                                            )[0],
                                                        ) - startHour;

                                                    return (
                                                        <div
                                                            key={cls.id}
                                                            className={`absolute inset-x-1 top-1 z-10 p-2 rounded-lg cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border group ${
                                                                currentClass
                                                                    ? 'bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 border-orange-200 dark:border-orange-700'
                                                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'
                                                            }`}
                                                            style={{
                                                                height: `${duration * 60 - 8}px`,
                                                            }}
                                                            onClick={() =>
                                                                openModal(cls)
                                                            }
                                                        >
                                                            <div className="flex border-l-2 border-primary-500 pl-2 h-full flex-col justify-center">
                                                                <div className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                                                    {
                                                                        cls.subject
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                                                                    <Clock className="w-3 h-3" />
                                                                    {
                                                                        cls.startTime
                                                                    }{' '}
                                                                    -{' '}
                                                                    {
                                                                        cls.endTime
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                                                                    <MapPin className="w-3 h-3" />
                                                                    {cls.room}
                                                                </div>
                                                            </div>
                                                            {currentClass && (
                                                                <div className="absolute top-2 right-2">
                                                                    <span className="relative flex h-2 w-2">
                                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Today's Schedule (Mobile View) */}
            <div className="lg:hidden card p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Today's Classes
                </h3>
                <div className="space-y-3">
                    {getClassesForDay(currentDay).length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Calendar className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">
                                No classes today
                            </p>
                        </div>
                    ) : (
                        getClassesForDay(currentDay).map((cls) => {
                            const isCurrent = isCurrentClass(
                                cls.startTime,
                                cls.endTime,
                            );

                            return (
                                <div
                                    key={cls.id}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                                        isCurrent
                                            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                                    }`}
                                    onClick={() => openModal(cls)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                                {cls.subject}
                                            </h4>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                    <Clock className="w-4 h-4 mr-1.5 text-blue-500" />
                                                    {cls.startTime} -{' '}
                                                    {cls.endTime}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                    <MapPin className="w-4 h-4 mr-1.5 text-red-500" />
                                                    {cls.room}
                                                </div>
                                            </div>
                                            {isCurrent && (
                                                <div className="flex items-center text-orange-600 dark:text-orange-400 mt-2 text-sm font-medium">
                                                    <Bell className="w-4 h-4 mr-1.5" />
                                                    Happening Now
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openModal(cls);
                                            }}
                                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Add/Edit Class Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="card w-full max-w-lg shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {editingClass ? (
                                    <Edit2 className="w-5 h-5 text-blue-500" />
                                ) : (
                                    <Plus className="w-5 h-5 text-green-500" />
                                )}
                                {editingClass ? 'Edit Class' : 'Add New Class'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Subject{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            subject: e.target.value,
                                        })
                                    }
                                    className="input w-full"
                                    placeholder="e.g. Computer Science 101"
                                />
                            </div>

                            {/* Room */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Room / Location{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.room}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            room: e.target.value,
                                        })
                                    }
                                    className="input w-full"
                                    placeholder="e.g. Building A, Room 304"
                                />
                            </div>

                            {/* Day of Week */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Day of Week{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {weekDays.map((day) => (
                                        <button
                                            key={day.value}
                                            type="button"
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    dayOfWeek: day.value,
                                                })
                                            }
                                            className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                                                formData.dayOfWeek === day.value
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            {day.short}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Start Time{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.startTime}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                startTime: e.target.value,
                                            })
                                        }
                                        className="input w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        End Time{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.endTime}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                endTime: e.target.value,
                                            })
                                        }
                                        className="input w-full"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn-secondary flex-1 py-2.5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary flex-1 py-2.5"
                                >
                                    {editingClass
                                        ? 'Save Changes'
                                        : 'Add to Schedule'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;
