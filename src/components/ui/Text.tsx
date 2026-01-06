import React from 'react';
import './Text.css';

interface TextProps {
    children: React.ReactNode;
    as?: 'span' | 'div' | 'label' | 'p';
    className?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
    color?: 'default' | 'muted' | 'light' | 'white' | 'primary' | 'gradient';
    align?: 'left' | 'center' | 'right';
}

const Text: React.FC<TextProps> = ({
    children,
    as = 'span',
    className = '',
    size = 'md',
    weight = 'normal',
    color = 'default',
    align = 'left'
}) => {
    const Tag = as;

    const combinedClassName = `
        text 
        text-${size} 
        text-weight-${weight} 
        text-${color} 
        text-align-${align} 
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <Tag className={combinedClassName}>
            {children}
        </Tag>
    );
};

export default Text;
