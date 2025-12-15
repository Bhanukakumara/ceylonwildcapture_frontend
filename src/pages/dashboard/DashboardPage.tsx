import './Dashboard.css';

const DashboardPage = () => {
    return (
        <div className="dashboard-overview">
            <h2>Dashboard Overview</h2>
            <p className="page-subtitle">Welcome back! Here's what's happening with your account.</p>

            <div className="stats-grid">
                <div className="stat-card glass">
                    <div className="stat-icon">🛍️</div>
                    <div className="stat-content">
                        <div className="stat-value">12</div>
                        <div className="stat-label">Total Purchases</div>
                    </div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-icon">❤️</div>
                    <div className="stat-content">
                        <div className="stat-value">45</div>
                        <div className="stat-label">Favorites</div>
                    </div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <div className="stat-value">$1,248</div>
                        <div className="stat-label">Total Spent</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-section">
                <h3>Recent Purchases</h3>
                <div className="recent-items">
                    <p className="empty-state">No recent purchases</p>
                </div>
            </div>

            <div className="dashboard-section">
                <h3>Recommended for You</h3>
                <div className="recent-items">
                    <p className="empty-state">Check out our explore page for amazing photos</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
