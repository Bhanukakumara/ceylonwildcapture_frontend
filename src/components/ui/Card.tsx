import React from 'react';
import './Card.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'feature' | 'highlight';
    hover?: boolean;
    dataAos?: string;
    dataAosDelay?: string;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default',
    hover = false,
    dataAos,
    dataAosDelay
}) => {
    const combinedClassName = `
        card 
        card-${variant}
        ${hover ? 'card-hover' : ''}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <div
            className={combinedClassName}
            data-aos={dataAos}
            data-aos-delay={dataAosDelay}
        >
            {children}
        </div>
    );
};

export default Card;
