import React from 'react';

interface DashboardSectionProps {
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
    title,
    children,
    action,
    className = ''
}) => {
    return (
        <div className={`dashboard-section ${className}`}>
            <div className="section-header">
                <h3>{title}</h3>
                {action && <div className="section-action">{action}</div>}
            </div>
            {children}
        </div>
    );
};

export default DashboardSection;
