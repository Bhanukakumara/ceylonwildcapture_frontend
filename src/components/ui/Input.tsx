import React, { useState } from 'react';
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
    showPasswordToggle?: boolean; // New prop for password toggle
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
    id,
    showPasswordToggle = false
}) => {
    const [showPassword, setShowPassword] = useState(false);

    // Determine the actual input type
    const inputType = (type === 'password' && showPassword) ? 'text' : type;

    // Show password toggle only for password type
    const shouldShowToggle = type === 'password' && showPasswordToggle;

    const hasIcon = !!icon;
    const wrapperClassName = `
        input-wrapper 
        ${hasIcon ? `input-with-icon icon-${iconPosition}` : ''} 
        ${shouldShowToggle ? 'input-with-password-toggle' : ''}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={wrapperClassName}>
            {icon && iconPosition === 'left' && (
                <span className="input-icon input-icon-left">{icon}</span>
            )}
            <input
                type={inputType}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="form-input"
                disabled={disabled}
                required={required}
                name={name}
                id={id}
            />
            {icon && iconPosition === 'right' && !shouldShowToggle && (
                <span className="input-icon input-icon-right">{icon}</span>
            )}
            {shouldShowToggle && (
                <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
            )}
        </div>
    );
};

export default Input;

