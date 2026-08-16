import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow';
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon: Icon,
    color = 'blue',
    description,
    trend,
    className = '',
}) => {
    const colorClasses = {
        blue: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            text: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-500',
        },
        green: {
            bg: 'bg-green-50 dark:bg-green-900/20',
            text: 'text-green-600 dark:text-green-400',
            iconBg: 'bg-green-500',
        },
        purple: {
            bg: 'bg-purple-50 dark:bg-purple-900/20',
            text: 'text-purple-600 dark:text-purple-400',
            iconBg: 'bg-purple-500',
        },
        orange: {
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            text: 'text-orange-600 dark:text-orange-400',
            iconBg: 'bg-orange-500',
        },
        red: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            text: 'text-red-600 dark:text-red-400',
            iconBg: 'bg-red-500',
        },
        yellow: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            text: 'text-yellow-600 dark:text-yellow-400',
            iconBg: 'bg-yellow-500',
        },
    };

    const colors = colorClasses[color];

    return (
        <div className={`card p-6 hover-lift ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        {value}
                    </p>

                    {description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {description}
                        </p>
                    )}

                    {trend && (
                        <div className="flex items-center mt-2">
                            <svg
                                className={`w-4 h-4 mr-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={
                                        trend.isPositive
                                            ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                                            : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'
                                    }
                                />
                            </svg>
                            <span
                                className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {trend.isPositive ? '+' : '-'}
                                {trend.value}%
                            </span>
                        </div>
                    )}
                </div>

                <div className={`p-3 rounded-full ${colors.iconBg}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
