import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import adminApi, { type DashboardStats, type CategoryPerformance, type RecentActivity } from '../../services/admin-api';
import '../dashboard/Dashboard.css';
import './AdminDashboard.css';

const AdminDashboardPage = () => {
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([]);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all data in parallel
                const [stats, categories, activities] = await Promise.all([
                    adminApi.getDashboardStats(),
                    adminApi.getCategoryPerformance(5),
                    adminApi.getRecentActivity(5)
                ]);

                setDashboardStats(stats);
                setCategoryPerformance(categories);
                setRecentActivity(activities);
            } catch (err: any) {
                console.error('Failed to fetch dashboard data:', err);
                setError(err.response?.data?.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const growthMetrics = {
        userGrowth: 12.5,
        photographerGrowth: 8.3,
        photoGrowth: 15.7,
        revenueGrowth: 22.4
    };



    const pendingActions = [
        { type: 'photos', count: 23, label: 'Photos pending approval', link: '/admin/photos?status=PENDING' },
        { type: 'payouts', count: 12, label: 'Payouts pending review', link: '/admin/payouts' },
        { type: 'orders', count: 5, label: 'Orders in processing', link: '/admin/orders?status=PROCESSING' },
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
            {loading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard statistics...</p>
                </div>
            )}

            {error && (
                <div className="error-container">
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {!loading && !error && dashboardStats && (
                <>
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
                                <div className="stat-value">{dashboardStats.totalCustomers.toLocaleString()}</div>
                                <div className="stat-label">Buyers</div>
                            </div>
                        </div>
                        <div className="stat-card glass admin-stat-card pending">
                            <div className="stat-content">
                                <div className="stat-value">{dashboardStats.pendingPhotos}</div>
                                <div className="stat-label">Pending Photos</div>
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
                                            <div className="category-name">{category.categoryName}</div>
                                            <div className="category-stats">
                                                {category.photoCount} photos • {category.salesCount} orders
                                            </div>
                                        </div>
                                        <div className="category-revenue">{formatCurrency(category.totalRevenue)}</div>
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
                                            <div className="activity-meta">{activity.userName} • {activity.timeAgo}</div>
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
                            <Link to="/admin/orders" className="quick-action-btn">
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
                </>
            )}
        </div>
    );
};

export default AdminDashboardPage;
