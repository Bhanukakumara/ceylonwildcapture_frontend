import React from 'react';
import './Button.css';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    type = 'button',
    disabled = false,
    icon,
    iconPosition = 'left'
}) => {
    const combinedClassName = `
        btn 
        btn-${variant} 
        btn-${size} 
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <button
            type={type}
            className={combinedClassName}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
            <span className="btn-text">{children}</span>
            {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
        </button>
    );
};

export default Button;
