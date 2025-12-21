import '../dashboard/Dashboard.css';

const PhotographerDashboardPage = () => {
    return (
        <div className="dashboard-overview">
            <h2>Photographer Dashboard</h2>
            <p className="page-subtitle">Track your sales, uploads, and earnings</p>

            <div className="stats-grid">
                <div className="stat-card glass">
                    <div className="stat-icon">📸</div>
                    <div className="stat-content">
                        <div className="stat-value">156</div>
                        <div className="stat-label">Total Photos</div>
                    </div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <div className="stat-value">$4,520</div>
                        <div className="stat-label">Total Earnings</div>
                    </div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <div className="stat-value">342</div>
                        <div className="stat-label">Total Sales</div>
                    </div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                        <div className="stat-value">4.8</div>
                        <div className="stat-label">Average Rating</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-section">
                <h3>Recent Sales</h3>
                <div className="recent-items">
                    <p className="empty-state">No recent sales</p>
                </div>
            </div>

            <div className="dashboard-section">
                <h3>Top Performing Photos</h3>
                <div className="recent-items">
                    <p className="empty-state">Upload photos to see performance</p>
                </div>
            </div>
        </div>
    );
};

export default PhotographerDashboardPage;
