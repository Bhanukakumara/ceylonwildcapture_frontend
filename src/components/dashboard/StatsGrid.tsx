import React from 'react';

interface StatsGridProps {
    children: React.ReactNode;
    columns?: 3 | 4 | 6;
    className?: string;
}

const StatsGrid: React.FC<StatsGridProps> = ({
    children,
    columns = 4,
    className = ''
}) => {
    const gridClass = columns === 4 ? 'stats-grid-4' : columns === 6 ? 'stats-grid-6' : '';

    return (
        <div className={`stats-grid ${gridClass} ${className}`}>
            {children}
        </div>
    );
};

export default StatsGrid;
