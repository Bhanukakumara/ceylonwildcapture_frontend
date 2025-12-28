import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import adminApi, { type DashboardStats, type CategoryPerformance, type RecentActivity } from '../../services/admin-api';
import '../dashboard/Dashboard.css';
import './AdminDashboard.css';
import {
    DashboardPageHeader,
    StatsGrid,
    StatCard,
    DashboardSection
} from '../../components/dashboard';

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




    const pendingActions = [
        { type: 'photos', count: 23, label: 'Photos pending approval', link: '/admin/photos?status=PENDING' },
        { type: 'payouts', count: 12, label: 'Payouts pending review', link: '/admin/payouts' },
        { type: 'orders', count: 5, label: 'Orders in processing', link: '/admin/orders?status=PROCESSING' },
        { type: 'photographers', count: 8, label: 'Photographers awaiting verification', link: '/admin/photographers' }
    ];

    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
                    <DashboardPageHeader
                        title="Admin Dashboard"
                        subtitle="Platform overview and analytics"
                    >
                        <select className="date-range-select">
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </DashboardPageHeader>

                    {/* Main Statistics Grid */}
                    <StatsGrid columns={4}>
                        <StatCard
                            icon="👥"
                            value={dashboardStats.totalUsers.toLocaleString()}
                            label="Total Users"
                            className="admin-stat-card"
                        />
                        <StatCard
                            icon="📸"
                            value={dashboardStats.totalPhotos.toLocaleString()}
                            label="Total Photos"
                            className="admin-stat-card"
                        />
                        <StatCard
                            icon="🛒"
                            value={dashboardStats.totalOrders.toLocaleString()}
                            label="Total Orders"
                            className="admin-stat-card"
                        />
                        <StatCard
                            icon="💰"
                            value={formatCurrency(dashboardStats.totalRevenue)}
                            label="Total Revenue"
                            className="admin-stat-card"
                        />
                    </StatsGrid>

                    {/* Secondary Statistics */}
                    <StatsGrid columns={6}>
                        <StatCard
                            value={dashboardStats.totalPhotographers}
                            label="Photographers"
                            className="admin-stat-card"
                            variant="glass"
                            icon=""
                        />
                        <StatCard
                            value={dashboardStats.totalCustomers.toLocaleString()}
                            label="Buyers"
                            className="admin-stat-card"
                            variant="glass"
                            icon=""
                        />
                        <StatCard
                            value={dashboardStats.pendingPhotos}
                            label="Pending Photos"
                            className="admin-stat-card pending"
                            variant="glass"
                            icon=""
                        />
                    </StatsGrid>

                    {/* Content Grid */}
                    <div className="dashboard-content-grid">
                        {/* Category Performance */}
                        <DashboardSection
                            title="Category Performance"
                            action={<Link to="/admin/categories" className="card-link">View All →</Link>}
                            className="admin-card"
                        >
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
                        </DashboardSection>

                        {/* Recent Activity */}
                        <DashboardSection title="Recent Activity" className="admin-card">
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
                        </DashboardSection>
                    </div>

                    {/* Pending Actions */}
                    <DashboardSection title="Pending Actions" className="admin-card">
                        <div className="pending-actions-grid">
                            {pendingActions.map((action, index) => (
                                <Link key={index} to={action.link} className="pending-action-card">
                                    <div className="pending-count">{action.count}</div>
                                    <div className="pending-label">{action.label}</div>
                                    <div className="pending-arrow">→</div>
                                </Link>
                            ))}
                        </div>
                    </DashboardSection>

                    {/* Quick Actions */}
                    <DashboardSection title="Quick Actions" className="admin-card">
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
                    </DashboardSection>
                </>
            )}
        </div>
    );
};

export default AdminDashboardPage;
