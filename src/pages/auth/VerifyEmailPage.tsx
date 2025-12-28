import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../services/api';
import './VerifyEmailPage.css';

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const token = searchParams.get('token');

    const hasRun = useRef(false);

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token || hasRun.current) {
                return;
            }

            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link. Token is missing.');
                return;
            }

            hasRun.current = true;

            try {
                await authApi.verifyEmail(token);
                setStatus('success');
                setMessage('Your email has been successfully verified! You can now log in to your account.');
            } catch (error: any) {
                console.error('Verification error:', error);
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. The link may be expired or invalid.');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="verify-email-container">
            <div className="auth-form-container" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                {status === 'loading' && (
                    <div className="verify-loading">
                        <div className="spinner"></div>
                        <h2 className="auth-form-title">Verifying...</h2>
                        <p className="auth-form-subtitle">Please wait while we verify your email address.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="verify-success">
                        <div className="success-icon" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
                        <h2 className="auth-form-title">Verified!</h2>
                        <p className="auth-form-subtitle" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
                            {message}
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn btn-primary btn-full"
                        >
                            Back to Login
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="verify-error">
                        <div className="error-icon" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>❌</div>
                        <h2 className="auth-form-title">Verification Failed</h2>
                        <p className="auth-form-subtitle" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
                            {message}
                        </p>
                        <div className="auth-form-actions" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Link to="/signup" className="btn btn-primary btn-full">
                                Back to Signup
                            </Link>
                            <Link to="/login" className="btn btn-link">
                                Try to Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
