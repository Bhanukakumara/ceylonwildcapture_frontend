import { Link } from 'react-router-dom';
import '../dashboard/Dashboard.css';
import './AdminDashboard.css';

const AdminDashboardPage = () => {
    // Mock data - replace with API calls from /api/v1/admin/analytics/dashboard
    const dashboardStats = {
        totalUsers: 1547,
        totalPhotographers: 342,
        totalBuyers: 1200,
        totalPhotos: 15234,
        pendingPhotos: 23,
        approvedPhotos: 14890,
        totalOrders: 8765,
        pendingOrders: 23,
        completedOrders: 8500,
        totalRevenue: 125000.50,
        totalPayouts: 87500.35,
        platformCommission: 37500.15,
        pendingPayouts: 12,
        averageOrderValue: 80.85
    };

    const growthMetrics = {
        userGrowth: 12.5,
        photographerGrowth: 8.3,
        photoGrowth: 15.7,
        revenueGrowth: 22.4
    };

    const categoryPerformance = [
        { name: 'Wildlife', photos: 5234, sales: 3456, revenue: 45678.90 },
        { name: 'Mammals', photos: 3890, sales: 2567, revenue: 34567.80 },
        { name: 'Birds', photos: 2456, sales: 1890, revenue: 23456.70 },
        { name: 'Marine Life', photos: 1890, sales: 1234, revenue: 15678.60 },
        { name: 'Landscapes', photos: 1764, sales: 1089, revenue: 12345.50 }
    ];

    const recentActivity = [
        { type: 'photo', action: 'New photo uploaded', user: 'John Doe', time: '2 minutes ago' },
        { type: 'order', action: 'Order completed', user: 'Jane Smith', time: '15 minutes ago' },
        { type: 'user', action: 'New photographer registered', user: 'Mike Johnson', time: '1 hour ago' },
        { type: 'payout', action: 'Payout approved', user: 'Sarah Williams', time: '2 hours ago' },
        { type: 'photo', action: 'Photo approved', user: 'Admin', time: '3 hours ago' }
    ];

    const pendingActions = [
        { type: 'photos', count: 23, label: 'Photos pending approval', link: '/admin/photos?status=PENDING' },
        { type: 'payouts', count: 12, label: 'Payouts pending review', link: '/admin/payouts' },
        { type: 'orders', count: 5, label: 'Orders in processing', link: '/admin/sales?status=PROCESSING' },
        { type: 'photographers', count: 8, label: 'Photographers awaiting verification', link: '/admin/photographers' }
    ];

    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatGrowth = (growth: number) => {
        const sign = growth >= 0 ? '+' : '';
        return `${sign}${growth.toFixed(1)}%`;
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div>
                    <h2>Admin Dashboard</h2>
                    <p className="page-subtitle">Platform overview and analytics</p>
                </div>
                <div className="header-actions">
                    <select className="date-range-select">
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>
            </div>

            {/* Main Statistics Grid */}
            <div className="stats-grid stats-grid-4">
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <div className="stat-value">{dashboardStats.totalUsers.toLocaleString()}</div>
                        <div className="stat-label">Total Users</div>
                        <div className="stat-trend positive">{formatGrowth(growthMetrics.userGrowth)}</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-icon">📸</div>
                    <div className="stat-content">
                        <div className="stat-value">{dashboardStats.totalPhotos.toLocaleString()}</div>
                        <div className="stat-label">Total Photos</div>
                        <div className="stat-trend positive">{formatGrowth(growthMetrics.photoGrowth)}</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-content">
                        <div className="stat-value">{dashboardStats.totalOrders.toLocaleString()}</div>
                        <div className="stat-label">Total Orders</div>
                        <div className="stat-trend positive">+18.2%</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <div className="stat-value">{formatCurrency(dashboardStats.totalRevenue)}</div>
                        <div className="stat-label">Total Revenue</div>
                        <div className="stat-trend positive">{formatGrowth(growthMetrics.revenueGrowth)}</div>
                    </div>
                </div>
            </div>

            {/* Secondary Statistics */}
            <div className="stats-grid stats-grid-6">
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{dashboardStats.totalPhotographers}</div>
                        <div className="stat-label">Photographers</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{dashboardStats.totalBuyers.toLocaleString()}</div>
                        <div className="stat-label">Buyers</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card pending">
                    <div className="stat-content">
                        <div className="stat-value">{dashboardStats.pendingPhotos}</div>
                        <div className="stat-label">Pending Photos</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{formatCurrency(dashboardStats.platformCommission)}</div>
                        <div className="stat-label">Platform Commission</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{formatCurrency(dashboardStats.totalPayouts)}</div>
                        <div className="stat-label">Total Payouts</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{formatCurrency(dashboardStats.averageOrderValue)}</div>
                        <div className="stat-label">Avg Order Value</div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="dashboard-content-grid">
                {/* Category Performance */}
                <div className="admin-card">
                    <div className="card-header">
                        <h3>Category Performance</h3>
                        <Link to="/admin/categories" className="card-link">View All →</Link>
                    </div>
                    <div className="category-performance-list">
                        {categoryPerformance.map((category, index) => (
                            <div key={index} className="category-performance-item">
                                <div className="category-info">
                                    <div className="category-name">{category.name}</div>
                                    <div className="category-stats">
                                        {category.photos} photos • {category.sales} sales
                                    </div>
                                </div>
                                <div className="category-revenue">{formatCurrency(category.revenue)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="admin-card">
                    <div className="card-header">
                        <h3>Recent Activity</h3>
                    </div>
                    <div className="activity-feed">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <div className={`activity-icon ${activity.type}`}>
                                    {activity.type === 'photo' && '📸'}
                                    {activity.type === 'order' && '🛒'}
                                    {activity.type === 'user' && '👤'}
                                    {activity.type === 'payout' && '💰'}
                                </div>
                                <div className="activity-content">
                                    <div className="activity-action">{activity.action}</div>
                                    <div className="activity-meta">{activity.user} • {activity.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pending Actions */}
            <div className="admin-card">
                <div className="card-header">
                    <h3>Pending Actions</h3>
                </div>
                <div className="pending-actions-grid">
                    {pendingActions.map((action, index) => (
                        <Link key={index} to={action.link} className="pending-action-card">
                            <div className="pending-count">{action.count}</div>
                            <div className="pending-label">{action.label}</div>
                            <div className="pending-arrow">→</div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="admin-card">
                <div className="card-header">
                    <h3>Quick Actions</h3>
                </div>
                <div className="quick-actions-grid">
                    <Link to="/admin/users" className="quick-action-btn">
                        <span className="action-icon">👥</span>
                        <span>Manage Users</span>
                    </Link>
                    <Link to="/admin/photos" className="quick-action-btn">
                        <span className="action-icon">📸</span>
                        <span>Review Photos</span>
                    </Link>
                    <Link to="/admin/sales" className="quick-action-btn">
                        <span className="action-icon">🛒</span>
                        <span>View Orders</span>
                    </Link>
                    <Link to="/admin/analytics" className="quick-action-btn">
                        <span className="action-icon">📊</span>
                        <span>Analytics</span>
                    </Link>
                    <Link to="/admin/categories" className="quick-action-btn">
                        <span className="action-icon">🏷️</span>
                        <span>Categories</span>
                    </Link>
                    <Link to="/admin/settings" className="quick-action-btn">
                        <span className="action-icon">⚙️</span>
                        <span>Settings</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
