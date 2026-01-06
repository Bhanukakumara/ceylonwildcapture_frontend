import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, handleApiError } from '../../services/api';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isUnverified, setIsUnverified] = useState(false);
    const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setError('');
        setIsLoading(true);

        try {
            // Call login API
            const response = await authApi.login({
                usernameOrEmail: email,
                password: password,
                rememberMe: rememberMe,
            });

            // Redirect based on user role
            const userRole = response.user.role;

            switch (userRole) {
                case 'ADMIN':
                    navigate('/admin/dashboard');
                    break;
                case 'PHOTOGRAPHER':
                    navigate('/photographer/dashboard');
                    break;
                case 'BUYER':
                    navigate('/');
                    break;
                default:
                    navigate('/');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            const apiError = handleApiError(err);

            // Handle specific error cases
            if (apiError.message?.toLowerCase().includes('not verified')) {
                setIsUnverified(true);
                setError(apiError.message);
            } else if (apiError.status === 401) {
                setError('Invalid email or password. Please try again.');
            } else if (apiError.status === 0) {
                setError('Cannot connect to server. Please check your connection.');
            } else {
                setError(apiError.message || 'An error occurred during login.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!email) return;
        setResendStatus('sending');
        try {
            await authApi.resendVerificationEmail(email);
            setResendStatus('sent');
            setIsUnverified(false); // Clear the block once resent
        } catch (err: any) {
            console.error('Resend error:', err);
            setResendStatus('error');
            const apiError = handleApiError(err);
            setError(apiError.message || 'Failed to resend verification email.');
        }
    };

    return (
        <div className="auth-form-container">
            <h2 className="auth-form-title">Welcome Back</h2>
            <p className="auth-form-subtitle">Sign in to your account to continue</p>

            {/* Error Alert */}
            {error && (
                <div className={`alert alert-error ${isUnverified ? 'alert-warning' : ''}`}>
                    <p style={{ margin: 0 }}>{error}</p>
                    {isUnverified && (
                        <button
                            onClick={handleResendVerification}
                            className="btn-link"
                            disabled={resendStatus === 'sending'}
                        >
                            {resendStatus === 'sending' ? 'Sending...' : 'Resend verification email'}
                        </button>
                    )}
                </div>
            )}

            {/* Resend Success */}
            {resendStatus === 'sent' && (
                <div className="alert alert-success">
                    Verification email resent! Please check your inbox.
                </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="email">Email or Username</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="form-input"
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="form-input"
                        disabled={isLoading}
                    />
                </div>

                <div className="form-options">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={isLoading}
                        />
                        <span>Remember</span>
                    </label>
                    <Link to="/forgot-password" className="link">
                        Forgot?
                    </Link>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <div className="auth-divider">
                <span>or</span>
            </div>

            <div className="auth-social">
                <button className="btn btn-ghost btn-full" disabled={isLoading}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>
            </div>

            <p className="auth-footer">
                Don't have an account?{' '}
                <Link to="/signup" className="link">
                    Sign up
                </Link>
            </p>
        </div>

    );
};

export default LoginPage;
