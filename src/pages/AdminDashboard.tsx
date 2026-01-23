import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, Activity, BarChart3, Settings, Key, Database, Zap, Lock } from 'lucide-react';
import SystemMetrics from '../components/SystemMetrics';
import Security from '../components/Security';

const AdminDashboard: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  // Check if user is admin (in real app, this would be server-side)
  const isAdmin = user?.email?.endsWith('@admin.studyhub.com') || user?.email === 'admin@studyhub.demo';

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="card p-8 text-center max-w-md glass-panel">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You don't have permission to access this area.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Admin Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-gray-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold">Admin Command Center</h1>
            </div>
            <p className="text-gray-300 text-lg">
              System monitoring, security, and configuration.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl backdrop-blur-md">
            <Key className="w-5 h-5 text-yellow-400" />
            <span className="font-mono text-sm font-bold text-yellow-400">ADMIN ACCESS GRANTED</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
      </div>

      {/* Quick Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="card p-6 text-left hover-lift group glass-panel">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
              <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Security Scan</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Audit system integrity</p>
            </div>
          </div>
        </button>

        <button className="card p-6 text-left hover-lift group glass-panel">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Health Check</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Monitor vitals</p>
            </div>
          </div>
        </button>

        <button className="card p-6 text-left hover-lift group glass-panel">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
              <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Analytics</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">View user stats</p>
            </div>
          </div>
        </button>

        <button className="card p-6 text-left hover-lift group glass-panel">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
              <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Configs</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">System settings</p>
            </div>
          </div>
        </button>
      </div>

      {/* Security Component */}
      <Security>
        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Overview */}
            <div className="card p-6 glass-panel">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-500" /> System Overview
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Version</span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">v2.1.0</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Environment</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full text-xs font-bold uppercase">Production</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Uptime</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">99.98%</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Database</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Connected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Statistics */}
            <div className="card p-6 glass-panel">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> User Impact
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Users</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,247</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-blue-500 rounded-full"></div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-600 dark:text-gray-400">Active Today</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">523</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-green-500 rounded-full"></div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-600 dark:text-gray-400">New This Week</span>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">89</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-purple-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Security>

      {/* System Metrics Component */}
      <SystemMetrics>
        <div className="mt-8 card p-6 glass-panel border-t-4 border-t-amber-500">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" /> Performance Metrics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="text-3xl font-black text-green-500 mb-1">98.5</div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Score</p>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="text-3xl font-black text-blue-500 mb-1">847ms</div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Latency</p>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="text-3xl font-black text-purple-500 mb-1">99.9%</div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Availability</p>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="text-3xl font-black text-orange-500 mb-1">A+</div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Quality</p>
            </div>
          </div>
        </div>
      </SystemMetrics>

      {/* Advanced Features and Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 glass-panel">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-500" /> Feature Flags
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
              <span className="font-medium text-gray-900 dark:text-white">Dark Mode</span>
              <div className="w-10 h-5 bg-green-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
              <span className="font-medium text-gray-900 dark:text-white">Beta Features</span>
              <div className="w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full relative">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 glass-panel">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-500" /> Secured Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 font-medium text-sm transition-colors">
              Clear Cache
            </button>
            <button className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 font-medium text-sm transition-colors">
              Audit Logs
            </button>
            <button className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 font-medium text-sm transition-colors">
              Backup DB
            </button>
            <button className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 font-medium text-sm transition-colors">
              Emergency Stop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;