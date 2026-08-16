import React from 'react';
import { useApp } from '../context/AppContext';
import {
    Download,
    Upload,
    Trash2,
    RefreshCw,
    FileText,
    Database,
} from 'lucide-react';

const DataManagement: React.FC = () => {
    const { user, tasks, assignments, classSchedule, studySessions } = useApp();

    const exportData = () => {
        const exportData = {
            user,
            tasks,
            assignments,
            classSchedule,
            studySessions,
            exportedAt: new Date().toISOString(),
            version: '1.0.0',
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri =
            'data:application/json;charset=utf-8,' +
            encodeURIComponent(dataStr);

        const exportFileDefaultName = `student-productivity-hub-backup-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string);

                // Validate data structure
                if (importedData.tasks && importedData.assignments) {
                    // Clear existing data
                    localStorage.clear();

                    // Import new data
                    Object.keys(importedData).forEach((key) => {
                        if (key !== 'exportedAt' && key !== 'version') {
                            localStorage.setItem(
                                `sph_${key}`,
                                JSON.stringify(importedData[key]),
                            );
                        }
                    });

                    // Reload page to apply changes
                    window.location.reload();
                } else {
                    alert('Invalid backup file format');
                }
            } catch (error) {
                alert('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    };

    const clearAllData = () => {
        if (
            window.confirm(
                'Are you sure you want to clear all data? This action cannot be undone.',
            )
        ) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const getDataStats = () => {
        return {
            tasks: tasks.length,
            assignments: assignments.length,
            classes: classSchedule.length,
            sessions: studySessions.length,
            totalSize: JSON.stringify({
                tasks,
                assignments,
                classSchedule,
                studySessions,
            }).length,
        };
    };

    const stats = getDataStats();

    return (
        <div className="space-y-6">
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Data Management
                </h3>

                {/* Data Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {stats.tasks}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Tasks
                        </p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <FileText className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {stats.assignments}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Assignments
                        </p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Database className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {stats.classes}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Classes
                        </p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <Database className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {stats.sessions}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Sessions
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <div className="flex gap-3">
                        <button
                            onClick={exportData}
                            className="btn-primary flex-1"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export Data
                        </button>
                        <label className="btn-secondary flex-1 cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Import Data
                            <input
                                type="file"
                                accept=".json"
                                onChange={importData}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-secondary flex-1"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh App
                        </button>
                        <button
                            onClick={clearAllData}
                            className="btn-secondary flex-1 text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear All Data
                        </button>
                    </div>
                </div>

                {/* Storage Info */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Storage Information
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Data stored locally in browser
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                ~{(stats.totalSize / 1024).toFixed(1)} KB
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Used space
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataManagement;
