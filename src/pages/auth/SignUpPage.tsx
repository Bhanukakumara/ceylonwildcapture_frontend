import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, handleApiError, type RegisterRequest } from '../../services/api';
import { Title, Paragraph, Button, Input } from '../../components/ui';
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

    const [isSignedUp, setIsSignedUp] = useState(false);
    const [emailSent, setEmailSent] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    const handleResendEmail = async () => {
        if (!emailSent || isLoading) return;
        setIsLoading(true);
        try {
            await authApi.resendVerificationEmail(emailSent);
            alert('Verification email resent successfully!');
        } catch (error) {
            alert('Failed to resend verification email. Please try again later.');
        } finally {
            setIsLoading(false);
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
            await authApi.register(registerData);

            // Registration successful
            setIsSignedUp(true);
            setEmailSent(formData.email);

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

    if (isSignedUp) {
        return (
            <div className="auth-form-container" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                <div className="success-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
                <Title level={2} className="auth-form-title">
                    Verify Your Email
                </Title>
                <Paragraph className="auth-form-subtitle" style={{ maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                    We've sent a verification email to <strong>{emailSent}</strong>.
                    Please check your inbox and click the link to activate your account.
                </Paragraph>
                <div className="auth-form-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <Button
                        onClick={() => navigate('/login')}
                        variant="primary"
                        className="btn-full"
                    >
                        Go to Login
                    </Button>
                    <button
                        onClick={handleResendEmail}
                        className="btn btn-link"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resending...' : "Didn't receive an email? Resend"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-form-container">
            <Title level={2} className="auth-form-title">
                Create Account
            </Title>
            <Paragraph className="auth-form-subtitle" color="muted">
                {step === 1 ? 'Join Ceylon Wild Capture today' : 'Secure your account'}
            </Paragraph>

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
                    <span>Info</span>
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
                        <label className="form-label">I want to</label>
                        <div className="role-selection">
                            <button
                                type="button"
                                className={`role-card ${role === 'BUYER' ? 'active' : ''}`}
                                onClick={() => setRole('BUYER')}
                            >
                                <div className="role-icon">🛒</div>
                                <div className="role-title">Buy</div>
                                <div className="role-description">Purchase photos</div>
                            </button>
                            <button
                                type="button"
                                className={`role-card ${role === 'PHOTOGRAPHER' ? 'active' : ''}`}
                                onClick={() => setRole('PHOTOGRAPHER')}
                            >
                                <div className="role-icon">📸</div>
                                <div className="role-title">Sell</div>
                                <div className="role-description">Share photos</div>
                            </button>
                        </div>
                    </div>

                    {/* Name Fields */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <Input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="John"
                                className={errors.firstName ? 'error' : ''}
                                disabled={isLoading}
                            />
                            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <Input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Doe"
                                className={errors.lastName ? 'error' : ''}
                                disabled={isLoading}
                            />
                            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                        </div>
                    </div>

                    {/* Username */}
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username</label>
                        <Input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="johndoe"
                            className={errors.username ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className={errors.email ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <Button type="submit" variant="primary" className="btn-full" disabled={isLoading}>
                        Continue →
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Phone Number */}
                    <div className="form-group">
                        <label htmlFor="phoneNumber" className="form-label">Phone (Optional)</label>
                        <Input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="+94 77 123 4567"
                            className={errors.phoneNumber ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className={errors.password ? 'error' : ''}
                            disabled={isLoading}
                            showPasswordToggle={true}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <Input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className={errors.confirmPassword ? 'error' : ''}
                            disabled={isLoading}
                            showPasswordToggle={true}
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input type="checkbox" required disabled={isLoading} />
                            <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                                I agree to the <Link to="/terms" className="link">Terms</Link> and <Link to="/privacy" className="link">Privacy</Link>
                            </span>
                        </label>
                    </div>

                    <div className="form-actions">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setStep(1)}
                            disabled={isLoading}
                        >
                            Back
                        </Button>
                        <Button type="submit" variant="primary" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Sign Up'}
                        </Button>
                    </div>
                </form>
            )}

            {step === 1 && (
                <>
                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    <div className="auth-social">
                        <Button
                            variant="ghost"
                            className="btn-full"
                            disabled={isLoading}
                            icon={
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            }
                            iconPosition="left"
                        >
                            Continue with Google
                        </Button>
                    </div>
                </>
            )}

            <Paragraph className="auth-footer">
                Already have an account?{' '}
                <Link to="/login" className="link">
                    Sign in
                </Link>
            </Paragraph>
        </div>

    );
};

export default SignUpPage;
