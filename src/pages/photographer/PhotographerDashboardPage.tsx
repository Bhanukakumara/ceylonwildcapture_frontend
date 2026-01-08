import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authApi, photographerStatsApi } from '../../services/api';
import type { PhotographerStats } from '../../services/api';
import '../dashboard/Dashboard.css';
import './PhotographerDashboardPage.css';
import {
    DashboardPageHeader,
    StatsGrid,
    StatCard,
    DashboardSection
} from '../../components/dashboard';

const PhotographerDashboardPage = () => {
    const [stats, setStats] = useState<PhotographerStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);

                const user = authApi.getCurrentUser();
                if (user && user.id) {
                    const data = await photographerStatsApi.getStats(user.id);
                    setStats(data);
                }
            } catch (err: any) {
                console.error('Failed to fetch stats:', err);
                setError(err.response?.data?.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Mock data for recent sales - replace with actual API call
    const recentSales = [
        { id: 1, photoTitle: 'Elephant at Sunset', buyer: 'John Doe', amount: 29.99, date: '2 hours ago', licenseType: 'Standard' },
        { id: 2, photoTitle: 'Leopard in Tree', buyer: 'Jane Smith', amount: 49.99, date: '5 hours ago', licenseType: 'Commercial' },
        { id: 3, photoTitle: 'Bird in Flight', buyer: 'Mike Johnson', amount: 19.99, date: '1 day ago', licenseType: 'Standard' },
    ];

    // Mock data for top performing photos - replace with actual API call
    const topPhotos = [
        { id: 1, title: 'Elephant at Sunset', views: 1234, downloads: 45, earnings: 449.55, thumbnail: '/placeholder.jpg' },
        { id: 2, title: 'Leopard in Tree', views: 987, downloads: 32, earnings: 319.68, thumbnail: '/placeholder.jpg' },
        { id: 3, title: 'Bird in Flight', views: 756, downloads: 28, earnings: 279.72, thumbnail: '/placeholder.jpg' },
    ];

    const quickActions = [
        { icon: '📸', label: 'Upload Photo', link: '/photographer/upload' },
        { icon: '🖼️', label: 'My Portfolio', link: '/photographer/portfolio' },
        { icon: '💰', label: 'Earnings', link: '/photographer/earnings' },
        { icon: '📊', label: 'Sales Report', link: '/photographer/sales' },
    ];

    return (
        <div className="photographer-dashboard">
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

            {!loading && !error && (
                <>
                    <DashboardPageHeader
                        title="Photographer Dashboard"
                        subtitle="Track your sales, uploads, and earnings"
                    >
                        <select className="date-range-select">
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                            <option value="all">All Time</option>
                        </select>
                    </DashboardPageHeader>

                    {/* Main Statistics Grid */}
                    <StatsGrid columns={4}>
                        <StatCard
                            icon="📸"
                            value={stats?.totalPhotos?.toString() || '0'}
                            label="Total Photos"
                            className="photographer-stat-card"
                        />
                        <StatCard
                            icon="💰"
                            value={formatCurrency(stats?.totalEarnings || 0)}
                            label="Total Earnings"
                            className="photographer-stat-card"
                        />
                        <StatCard
                            icon="📊"
                            value={stats?.totalSales?.toString() || '0'}
                            label="Total Sales"
                            className="photographer-stat-card"
                        />
                        <StatCard
                            icon="⭐"
                            value={stats?.averageRating?.toFixed(1) || '0.0'}
                            label="Average Rating"
                            className="photographer-stat-card"
                        />
                    </StatsGrid>

                    {/* Content Grid */}
                    <div className="dashboard-content-grid">
                        {/* Recent Sales */}
                        <DashboardSection
                            title="Recent Sales"
                            action={<Link to="/photographer/sales" className="card-link">View All →</Link>}
                            className="photographer-card"
                        >
                            <div className="sales-list">
                                {recentSales.map((sale) => (
                                    <div key={sale.id} className="sale-item">
                                        <div className="sale-info">
                                            <div className="sale-title">{sale.photoTitle}</div>
                                            <div className="sale-meta">
                                                {sale.buyer} • {sale.licenseType} • {sale.date}
                                            </div>
                                        </div>
                                        <div className="sale-amount">{formatCurrency(sale.amount)}</div>
                                    </div>
                                ))}
                            </div>
                        </DashboardSection>

                        {/* Top Performing Photos */}
                        <DashboardSection
                            title="Top Performing Photos"
                            action={<Link to="/photographer/portfolio" className="card-link">View All →</Link>}
                            className="photographer-card"
                        >
                            <div className="top-photos-list">
                                {topPhotos.map((photo) => (
                                    <div key={photo.id} className="top-photo-item">
                                        <div className="photo-info">
                                            <div className="photo-title">{photo.title}</div>
                                            <div className="photo-stats">
                                                👁️ {photo.views} • ⬇️ {photo.downloads}
                                            </div>
                                        </div>
                                        <div className="photo-earnings">{formatCurrency(photo.earnings)}</div>
                                    </div>
                                ))}
                            </div>
                        </DashboardSection>
                    </div>

                    {/* Quick Actions */}
                    <DashboardSection title="Quick Actions" className="photographer-card">
                        <div className="quick-actions-grid">
                            {quickActions.map((action, index) => (
                                <Link key={index} to={action.link} className="quick-action-btn">
                                    <span className="action-icon">{action.icon}</span>
                                    <span>{action.label}</span>
                                </Link>
                            ))}
                        </div>
                    </DashboardSection>
                </>
            )}
        </div>
    );
};

export default PhotographerDashboardPage;
