import React from 'react';
import './Title.css';

interface TitleProps {
    children: React.ReactNode;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
    gradient?: boolean;
    dataAos?: string;
    dataAosDelay?: string;
}

const Title: React.FC<TitleProps> = ({
    children,
    level = 1,
    className = '',
    gradient = false,
    dataAos,
    dataAosDelay
}) => {
    const combinedClassName = `
        title 
        title-${level} 
        ${gradient ? 'gradient-text' : ''} 
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const props = {
        className: combinedClassName,
        'data-aos': dataAos,
        'data-aos-delay': dataAosDelay
    };

    switch (level) {
        case 1: return <h1 {...props}>{children}</h1>;
        case 2: return <h2 {...props}>{children}</h2>;
        case 3: return <h3 {...props}>{children}</h3>;
        case 4: return <h4 {...props}>{children}</h4>;
        case 5: return <h5 {...props}>{children}</h5>;
        case 6: return <h6 {...props}>{children}</h6>;
        default: return <h1 {...props}>{children}</h1>;
    }
};

export default Title;
