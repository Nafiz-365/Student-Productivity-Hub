import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import QuickShortcuts from './components/QuickShortcuts';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Assignments from './pages/Assignments';
import Schedule from './pages/Schedule';
import Timer from './pages/Timer';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './index.css';

// Component to conditionally wrap routes with Layout
const AppLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <Layout>
      {children}
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <QuickShortcuts>
        <Router>
          <AppLayoutWrapper>
            <Routes>
              {/* Public Routes - Layout handling is done by AppLayoutWrapper */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/timer" element={<Timer />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AppLayoutWrapper>
        </Router>
      </QuickShortcuts>
    </AppProvider>
  );
}

export default App;