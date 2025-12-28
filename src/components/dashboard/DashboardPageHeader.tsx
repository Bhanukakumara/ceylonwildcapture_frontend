import React from 'react';

interface DashboardPageHeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    className?: string;
}

const DashboardPageHeader: React.FC<DashboardPageHeaderProps> = ({
    title,
    subtitle,
    children,
    className = ''
}) => {
    return (
        <div className={`dashboard-page-header ${className}`}>
            <div>
                <h2>{title}</h2>
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
            {children && <div className="header-actions">{children}</div>}
        </div>
    );
};

export default DashboardPageHeader;
