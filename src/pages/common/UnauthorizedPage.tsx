import './NotFoundPage.css';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="not-found-icon">🔒</div>
                <h1 className="not-found-title">Access Denied</h1>
                <p className="not-found-message">
                    You don't have permission to access this page.
                </p>
                <p className="not-found-submessage">
                    This area is restricted to administrators only.
                </p>
                <div className="not-found-actions">
                    <Link to="/" className="btn btn-primary">
                        Go to Home
                    </Link>
                    <Link to="/login" className="btn btn-ghost">
                        Login as Admin
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
