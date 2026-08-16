export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'completed';
    dueDate: string;
    createdAt: string;
    userId: string;
}

export interface Assignment {
    id: string;
    title: string;
    subject: string;
    description?: string;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'completed';
    grade?: number;
    userId: string;
}

export interface ClassSchedule {
    id: string;
    subject: string;
    room: string;
    startTime: string;
    endTime: string;
    dayOfWeek: number; // 0-6 (Sunday to Saturday)
    userId: string;
}

export interface StudySession {
    id: string;
    duration: number; // in minutes
    subject?: string;
    notes?: string;
    completedAt: string;
    userId: string;
}

export interface ProductivityStats {
    tasksCompleted: number;
    totalTasks: number;
    studyTimeToday: number; // in minutes
    studyTimeWeek: number; // in minutes
    upcomingDeadlines: Assignment[];
    todayClasses: ClassSchedule[];
}

export interface Theme {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        surface: string;
        text: string;
    };
}

export interface AppContextType {
    user: User | null;
    tasks: Task[];
    assignments: Assignment[];
    classSchedule: ClassSchedule[];
    studySessions: StudySession[];
    darkMode: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => void;
    updateTask: (id: string, task: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    addAssignment: (assignment: Omit<Assignment, 'id' | 'userId'>) => void;
    updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
    deleteAssignment: (id: string) => void;
    addClassSchedule: (schedule: Omit<ClassSchedule, 'id' | 'userId'>) => void;
    updateClassSchedule: (id: string, schedule: Partial<ClassSchedule>) => void;
    deleteClassSchedule: (id: string) => void;
    addStudySession: (
        session: Omit<StudySession, 'id' | 'completedAt' | 'userId'>,
    ) => void;
    toggleDarkMode: () => void;
    updateUserProfile: (data: Partial<User>) => void;
}
