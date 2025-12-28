import React from 'react';

interface EmptyStateProps {
    message: string;
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    message,
    className = ''
}) => {
    return (
        <div className={`recent-items ${className}`}>
            <p className="empty-state">{message}</p>
        </div>
    );
};

export default EmptyState;
