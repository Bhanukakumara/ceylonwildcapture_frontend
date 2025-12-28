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

            console.log('Login successful:', response);

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
                    <p>{error}</p>
                    {isUnverified && (
                        <button
                            onClick={handleResendVerification}
                            className="btn btn-link"
                            style={{ padding: 0, marginTop: '0.5rem', textDecoration: 'underline' }}
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
                    <label htmlFor="email">Email Address or Username</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com or username"
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
                        <span>Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="link">
                        Forgot password?
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
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 0C4.477 0 0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10c0-5.523-4.477-10-10-10z" />
                    </svg>
                    Continue with Facebook
                </button>
                <button className="btn btn-ghost btn-full" disabled={isLoading}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.2 0C4.7 0 .2 4.5.2 10s4.5 10 10 10c5.5 0 10-4.5 10-10S15.7 0 10.2 0zm4.5 14.5c-.2.3-.5.4-.8.4-.2 0-.4 0-.5-.1-1.4-.8-3.1-1-4.7-.6-.5.1-1-.2-1.1-.7-.1-.5.2-1 .7-1.1 1.9-.5 4-.3 5.7.7.5.2.6.8.7 1.4zm1.1-2.5c-.3.4-.7.5-1.1.3-1.6-1-4-1.3-5.9-.7-.6.2-1.2-.1-1.4-.7-.2-.6.1-1.2.7-1.4 2.2-.7 4.8-.4 6.7.8.5.3.6 1 .5 1.7zm.1-2.6c-1.9-1.1-5-1.4-6.8-.8-.7.2-1.4-.2-1.6-.9-.2-.7.2-1.4.9-1.6 2.1-.7 5.6-.4 7.8.9.6.4.8 1.2.4 1.8-.4.6-1.1.8-1.7.6z" />
                    </svg>
                    Continue with Spotify
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
