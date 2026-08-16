import React from 'react';
import { Shield, Activity, BarChart3, Download } from 'lucide-react';

const AdminPanel: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        System administration and analytics
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <button className="card p-6 text-left hover-lift group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50">
                            <Activity className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                System Health
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Real-time monitoring
                            </p>
                        </div>
                    </div>
                    <div className="text-xs text-blue-600">View Details →</div>
                </button>

                <button className="card p-6 text-left hover-lift group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50">
                            <BarChart3 className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Analytics
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                User insights
                            </p>
                        </div>
                    </div>
                    <div className="text-xs text-green-600">View Reports →</div>
                </button>

                <button className="card p-6 text-left hover-lift group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50">
                            <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Security Audit
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                System security
                            </p>
                        </div>
                    </div>
                    <div className="text-xs text-purple-600">Run Scan →</div>
                </button>

                <button className="card p-6 text-left hover-lift group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50">
                            <Download className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Data Export
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Backup data
                            </p>
                        </div>
                    </div>
                    <div className="text-xs text-orange-600">Export All →</div>
                </button>
            </div>

            {/* System Status */}
            <div className="card p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    System Status Overview
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="relative inline-flex items-center justify-center w-16 h-16">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full opacity-30 animate-ping"></div>
                        </div>
                        <h4 className="text-2xl font-bold text-green-600 mt-3">
                            Online
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            System Status
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600">
                            1,247
                        </div>
                        <h4 className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                            Active Users
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            +12% from last week
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="text-4xl font-bold text-purple-600">
                            99.9%
                        </div>
                        <h4 className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                            Uptime
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Last 30 days
                        </p>
                    </div>
                </div>
            </div>

            {/* Feature Flags */}
            <div className="card p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Feature Flags & Configuration
                </h3>

                <div className="space-y-4">
                    {[
                        { name: 'Dark Mode', status: 'active', color: 'green' },
                        {
                            name: 'Achievement System',
                            status: 'active',
                            color: 'green',
                        },
                        {
                            name: 'Quick Search',
                            status: 'active',
                            color: 'green',
                        },
                        {
                            name: 'Real-time Notifications',
                            status: 'beta',
                            color: 'yellow',
                        },
                        {
                            name: 'Advanced Analytics',
                            status: 'active',
                            color: 'green',
                        },
                        {
                            name: 'API Rate Limiting',
                            status: 'enabled',
                            color: 'green',
                        },
                        {
                            name: 'Data Encryption',
                            status: 'enabled',
                            color: 'green',
                        },
                        {
                            name: 'Performance Monitoring',
                            status: 'active',
                            color: 'green',
                        },
                        {
                            name: 'Multi-language Support',
                            status: 'planned',
                            color: 'blue',
                        },
                        {
                            name: 'Mobile App',
                            status: 'development',
                            color: 'orange',
                        },
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-3 h-3 rounded-full ${
                                        feature.status === 'active'
                                            ? 'bg-green-500'
                                            : feature.status === 'beta'
                                              ? 'bg-yellow-500'
                                              : feature.status === 'enabled'
                                                ? 'bg-blue-500'
                                                : feature.status === 'planned'
                                                  ? 'bg-blue-300'
                                                  : 'bg-gray-400'
                                    }`}
                                />
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {feature.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        feature.color === 'green'
                                            ? 'bg-green-100 text-green-800'
                                            : feature.color === 'yellow'
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : feature.color === 'blue'
                                                ? 'bg-blue-100 text-blue-800'
                                                : feature.color === 'orange'
                                                  ? 'bg-orange-100 text-orange-800'
                                                  : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {feature.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent System Activity
                </h3>

                <div className="space-y-3">
                    {[
                        {
                            time: '2 minutes ago',
                            action: 'Security scan completed',
                            status: 'success',
                        },
                        {
                            time: '5 minutes ago',
                            action: 'Database backup completed',
                            status: 'success',
                        },
                        {
                            time: '12 minutes ago',
                            action: 'Performance metrics updated',
                            status: 'info',
                        },
                        {
                            time: '1 hour ago',
                            action: 'Feature flag updated: Quick Search',
                            status: 'success',
                        },
                        {
                            time: '2 hours ago',
                            action: 'User milestone: 1000 active users',
                            status: 'info',
                        },
                        {
                            time: '3 hours ago',
                            action: 'System optimization completed',
                            status: 'success',
                        },
                        {
                            time: '1 day ago',
                            action: 'New deployment: v2.1.0',
                            status: 'info',
                        },
                        {
                            time: '2 days ago',
                            action: 'Security patch applied',
                            status: 'success',
                        },
                    ].map((activity, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        activity.status === 'success'
                                            ? 'bg-green-500'
                                            : activity.status === 'info'
                                              ? 'bg-blue-500'
                                              : 'bg-gray-500'
                                    }`}
                                />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {activity.action}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
