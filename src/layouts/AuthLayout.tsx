import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

const AuthLayout = () => {
    return (
        <div className="auth-layout">
            <div className="auth-container">
                <div className="auth-brand">
                    <div className="auth-brand-content">
                        <svg className="auth-logo" viewBox="0 0 40 40" fill="none">
                            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
                            <path d="M20 10 L28 20 L20 30 L12 20 Z" fill="currentColor" />
                        </svg>
                        <h1 className="auth-brand-name">Ceylon Wild Capture</h1>
                        <p className="auth-brand-tagline">
                            Discover and share the wild beauty of Sri Lanka
                        </p>
                    </div>
                    <div className="auth-decoration"></div>
                </div>

                <div className="auth-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
