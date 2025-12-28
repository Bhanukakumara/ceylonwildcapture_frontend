import React from 'react';

interface StatCardProps {
    icon: string | React.ReactNode;
    value: string | number;
    label: string;
    trend?: string;
    trendType?: 'positive' | 'negative' | 'neutral';
    className?: string;
    variant?: 'glass' | 'plain';
}

const StatCard: React.FC<StatCardProps> = ({
    icon,
    value,
    label,
    trend,
    trendType = 'positive',
    className = '',
    variant = 'glass'
}) => {
    return (
        <div className={`stat-card ${variant} ${className}`}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-content">
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
                {trend && (
                    <div className={`stat-trend ${trendType}`}>
                        {trend}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
