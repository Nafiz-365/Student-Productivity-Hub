import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Task, Assignment, ClassSchedule, StudySession, AppContextType } from '../types';

// Initial state
const initialState = {
  user: null,
  tasks: [],
  assignments: [],
  classSchedule: [],
  studySessions: [],
  darkMode: false,
};

// Action types
type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; task: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_ASSIGNMENTS'; payload: Assignment[] }
  | { type: 'ADD_ASSIGNMENT'; payload: Assignment }
  | { type: 'UPDATE_ASSIGNMENT'; payload: { id: string; assignment: Partial<Assignment> } }
  | { type: 'DELETE_ASSIGNMENT'; payload: string }
  | { type: 'SET_CLASS_SCHEDULE'; payload: ClassSchedule[] }
  | { type: 'ADD_CLASS_SCHEDULE'; payload: ClassSchedule }
  | { type: 'UPDATE_CLASS_SCHEDULE'; payload: { id: string; schedule: Partial<ClassSchedule> } }
  | { type: 'DELETE_CLASS_SCHEDULE'; payload: string }
  | { type: 'SET_STUDY_SESSIONS'; payload: StudySession[] }
  | { type: 'ADD_STUDY_SESSION'; payload: StudySession }
  | { type: 'TOGGLE_DARK_MODE' };

// Reducer
const appReducer = (state: any, action: Action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task: Task) =>
          task.id === action.payload.id ? { ...task, ...action.payload.task } : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task: Task) => task.id !== action.payload),
      };
    case 'SET_ASSIGNMENTS':
      return { ...state, assignments: action.payload };
    case 'ADD_ASSIGNMENT':
      return { ...state, assignments: [...state.assignments, action.payload] };
    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map((assignment: Assignment) =>
          assignment.id === action.payload.id ? { ...assignment, ...action.payload.assignment } : assignment
        ),
      };
    case 'DELETE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.filter((assignment: Assignment) => assignment.id !== action.payload),
      };
    case 'SET_CLASS_SCHEDULE':
      return { ...state, classSchedule: action.payload };
    case 'ADD_CLASS_SCHEDULE':
      return { ...state, classSchedule: [...state.classSchedule, action.payload] };
    case 'UPDATE_CLASS_SCHEDULE':
      return {
        ...state,
        classSchedule: state.classSchedule.map((schedule: ClassSchedule) =>
          schedule.id === action.payload.id ? { ...schedule, ...action.payload.schedule } : schedule
        ),
      };
    case 'DELETE_CLASS_SCHEDULE':
      return {
        ...state,
        classSchedule: state.classSchedule.filter((schedule: ClassSchedule) => schedule.id !== action.payload),
      };
    case 'SET_STUDY_SESSIONS':
      return { ...state, studySessions: action.payload };
    case 'ADD_STUDY_SESSION':
      return { ...state, studySessions: [...state.studySessions, action.payload] };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
};

// LocalStorage keys
const STORAGE_KEYS = {
  USER: 'sph_user',
  TASKS: 'sph_tasks',
  ASSIGNMENTS: 'sph_assignments',
  CLASS_SCHEDULE: 'sph_class_schedule',
  STUDY_SESSIONS: 'sph_study_sessions',
  DARK_MODE: 'sph_dark_mode',
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const user = localStorage.getItem(STORAGE_KEYS.USER);
        const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
        const assignments = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
        const classSchedule = localStorage.getItem(STORAGE_KEYS.CLASS_SCHEDULE);
        const studySessions = localStorage.getItem(STORAGE_KEYS.STUDY_SESSIONS);
        const darkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);

        if (user) dispatch({ type: 'SET_USER', payload: JSON.parse(user) });
        if (tasks) dispatch({ type: 'SET_TASKS', payload: JSON.parse(tasks) });
        if (assignments) dispatch({ type: 'SET_ASSIGNMENTS', payload: JSON.parse(assignments) });
        if (classSchedule) dispatch({ type: 'SET_CLASS_SCHEDULE', payload: JSON.parse(classSchedule) });
        if (studySessions) dispatch({ type: 'SET_STUDY_SESSIONS', payload: JSON.parse(studySessions) });
        if (darkMode === 'true') dispatch({ type: 'TOGGLE_DARK_MODE' });
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(state.tasks));
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(state.assignments));
      localStorage.setItem(STORAGE_KEYS.CLASS_SCHEDULE, JSON.stringify(state.classSchedule));
      localStorage.setItem(STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify(state.studySessions));
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(state.darkMode));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [state]);

  // Apply dark mode class to body
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Helper functions
  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Auth functions
  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in a real app, this would call an API
    const mockUser: User = {
      id: generateId(),
      name: email.split('@')[0],
      email,
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=3b82f6&color=fff`,
    };
    dispatch({ type: 'SET_USER', payload: mockUser });
    return true;
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock signup - in a real app, this would call an API
    const mockUser: User = {
      id: generateId(),
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=3b82f6&color=fff`,
    };
    dispatch({ type: 'SET_USER', payload: mockUser });
    return true;
  };

  // Task functions
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
      userId: state.user?.id || '',
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (id: string, task: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, task } });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  // Assignment functions
  const addAssignment = (assignment: Omit<Assignment, 'id' | 'userId'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: generateId(),
      userId: state.user?.id || '',
    };
    dispatch({ type: 'ADD_ASSIGNMENT', payload: newAssignment });
  };

  const updateAssignment = (id: string, assignment: Partial<Assignment>) => {
    dispatch({ type: 'UPDATE_ASSIGNMENT', payload: { id, assignment } });
  };

  const deleteAssignment = (id: string) => {
    dispatch({ type: 'DELETE_ASSIGNMENT', payload: id });
  };

  // Class Schedule functions
  const addClassSchedule = (schedule: Omit<ClassSchedule, 'id' | 'userId'>) => {
    const newSchedule: ClassSchedule = {
      ...schedule,
      id: generateId(),
      userId: state.user?.id || '',
    };
    dispatch({ type: 'ADD_CLASS_SCHEDULE', payload: newSchedule });
  };

  const updateClassSchedule = (id: string, schedule: Partial<ClassSchedule>) => {
    dispatch({ type: 'UPDATE_CLASS_SCHEDULE', payload: { id, schedule } });
  };

  const deleteClassSchedule = (id: string) => {
    dispatch({ type: 'DELETE_CLASS_SCHEDULE', payload: id });
  };

  // Study Session functions
  const addStudySession = (session: Omit<StudySession, 'id' | 'completedAt' | 'userId'>) => {
    const newSession: StudySession = {
      ...session,
      id: generateId(),
      completedAt: new Date().toISOString(),
      userId: state.user?.id || '',
    };
    dispatch({ type: 'ADD_STUDY_SESSION', payload: newSession });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const contextValue: AppContextType = {
    user: state.user,
    tasks: state.tasks,
    assignments: state.assignments,
    classSchedule: state.classSchedule,
    studySessions: state.studySessions,
    darkMode: state.darkMode,
    login,
    logout,
    signup,
    addTask,
    updateTask,
    deleteTask,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    addClassSchedule,
    updateClassSchedule,
    deleteClassSchedule,
    addStudySession,
    toggleDarkMode,
    updateUserProfile: (data: Partial<User>) => {
      if (state.user) {
        dispatch({ type: 'SET_USER', payload: { ...state.user, ...data } });
      }
    },
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// Hook to use context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};