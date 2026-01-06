import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="not-found-icon">🦁</div>
                <h1 className="not-found-title">404</h1>
                <h2 className="not-found-subtitle">Page Not Found</h2>
                <p className="not-found-text">
                    Oops! The page you're looking for seems to have wandered off into the wild.
                </p>
                <Link to="/" className="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 10H5M5 10l4-4M5 10l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
