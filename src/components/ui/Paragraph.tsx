import React from 'react';
import './Paragraph.css';

interface ParagraphProps {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    color?: 'default' | 'muted' | 'light' | 'white';
    dataAos?: string;
    dataAosDelay?: string;
}

const Paragraph: React.FC<ParagraphProps> = ({
    children,
    className = '',
    size = 'md',
    color = 'default',
    dataAos,
    dataAosDelay
}) => {
    const combinedClassName = `
        paragraph 
        paragraph-${size} 
        paragraph-${color} 
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <p
            className={combinedClassName}
            data-aos={dataAos}
            data-aos-delay={dataAosDelay}
        >
            {children}
        </p>
    );
};

export default Paragraph;
