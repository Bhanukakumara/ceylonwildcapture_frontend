import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, handleApiError, type RegisterRequest } from '../../services/api';
import './LoginPage.css';

type UserRole = 'BUYER' | 'PHOTOGRAPHER';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [role, setRole] = useState<UserRole>('BUYER');
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string>('');

    // Form fields
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        // Clear API error
        if (apiError) {
            setApiError('');
        }
    };

    const validateStep1 = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';

        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: { [key: string]: string } = {};

        if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Invalid phone number format';
        }

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number';
        }

        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep2()) {
            return;
        }

        setIsLoading(true);
        setApiError('');

        try {
            // Prepare registration data
            const registerData: RegisterRequest = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber || undefined,
                role: role,
            };

            // Call registration API
            const response = await authApi.register(registerData);

            // Registration successful - user is automatically logged in
            console.log('Registration successful:', response);

            // Redirect based on role
            if (role === 'PHOTOGRAPHER') {
                navigate('/photographer/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            const apiErrorData = handleApiError(error);

            // Handle specific error cases
            if (apiErrorData.errors) {
                // Field-specific errors
                setErrors(apiErrorData.errors);
            } else {
                // General error
                setApiError(apiErrorData.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <h2 className="auth-form-title">Create Your Account</h2>
            <p className="auth-form-subtitle">
                {step === 1 ? 'Choose your role and enter your details' : 'Complete your registration'}
            </p>

            {/* API Error Alert */}
            {apiError && (
                <div className="alert alert-error">
                    {apiError}
                </div>
            )}

            {/* Progress Indicator */}
            <div className="signup-progress">
                <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                    <div className="progress-circle">1</div>
                    <span>Account Info</span>
                </div>
                <div className="progress-line"></div>
                <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                    <div className="progress-circle">2</div>
                    <span>Security</span>
                </div>
            </div>

            {step === 1 ? (
                <form onSubmit={handleNext} className="auth-form">
                    {/* Role Selection */}
                    <div className="form-group">
                        <label>I want to</label>
                        <div className="role-selection">
                            <button
                                type="button"
                                className={`role-card ${role === 'BUYER' ? 'active' : ''}`}
                                onClick={() => setRole('BUYER')}
                            >
                                <div className="role-icon">🛒</div>
                                <div className="role-title">Buy Photos</div>
                                <div className="role-description">Purchase wildlife photography</div>
                            </button>
                            <button
                                type="button"
                                className={`role-card ${role === 'PHOTOGRAPHER' ? 'active' : ''}`}
                                onClick={() => setRole('PHOTOGRAPHER')}
                            >
                                <div className="role-icon">📸</div>
                                <div className="role-title">Sell Photos</div>
                                <div className="role-description">Share your wildlife photography</div>
                            </button>
                        </div>
                    </div>

                    {/* Name Fields */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name *</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="John"
                                className={`form-input ${errors.firstName ? 'error' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name *</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Doe"
                                className={`form-input ${errors.lastName ? 'error' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                        </div>
                    </div>

                    {/* Username */}
                    <div className="form-group">
                        <label htmlFor="username">Username *</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="johndoe"
                            className={`form-input ${errors.username ? 'error' : ''}`}
                            disabled={isLoading}
                        />
                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john.doe@example.com"
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            disabled={isLoading}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
                        Continue →
                    </button>
                </form>
            ) : (
                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Phone Number */}
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number (Optional)</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="+94 77 123 4567"
                            className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                            disabled={isLoading}
                        />
                        {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label htmlFor="password">Password *</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                        <div className="password-requirements">
                            <small>Must be at least 8 characters with uppercase, lowercase, and number</small>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password *</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input type="checkbox" required disabled={isLoading} />
                            <span>
                                I agree to the{' '}
                                <Link to="/terms" className="link" target="_blank">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="link" target="_blank">
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => setStep(1)}
                            disabled={isLoading}
                        >
                            ← Back
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            )}

            {step === 1 && (
                <>
                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    <div className="auth-social">
                        <button className="btn btn-ghost btn-full" disabled={isLoading}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.2 0C4.7 0 .2 4.5.2 10s4.5 10 10 10 10-4.5 10-10S15.7 0 10.2 0zm4.8 7.4h-2.3c-.2 0-.4.2-.4.4v1.7h2.7l-.4 2.7h-2.3v6.7h-2.8v-6.7H7.8v-2.7h1.7V7.1c0-1.4 1-2.6 2.4-2.6h2.3v2.9z" />
                            </svg>
                            Sign up with Google
                        </button>
                        <button className="btn btn-ghost btn-full" disabled={isLoading}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 0C4.477 0 0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10c0-5.523-4.477-10-10-10z" />
                            </svg>
                            Sign up with Facebook
                        </button>
                    </div>
                </>
            )}

            <p className="auth-footer">
                Already have an account?{' '}
                <Link to="/login" className="link">
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default SignUpPage;
