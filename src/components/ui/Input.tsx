import React from 'react';
import './Input.css';

interface InputProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    disabled?: boolean;
    required?: boolean;
    name?: string;
    id?: string;
}

const Input: React.FC<InputProps> = ({
    type = 'text',
    placeholder,
    value,
    onChange,
    className = '',
    icon,
    iconPosition = 'left',
    disabled = false,
    required = false,
    name,
    id
}) => {
    const hasIcon = !!icon;
    const wrapperClassName = `
        input-wrapper 
        ${hasIcon ? `input-with-icon icon-${iconPosition}` : ''} 
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <div className={wrapperClassName}>
            {icon && iconPosition === 'left' && (
                <span className="input-icon input-icon-left">{icon}</span>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="form-input"
                disabled={disabled}
                required={required}
                name={name}
                id={id}
            />
            {icon && iconPosition === 'right' && (
                <span className="input-icon input-icon-right">{icon}</span>
            )}
        </div>
    );
};

export default Input;
