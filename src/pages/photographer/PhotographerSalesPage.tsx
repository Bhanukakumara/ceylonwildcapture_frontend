import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Title, Paragraph } from '../../components/ui';
import { DashboardPageHeader, DashboardSection, StatsGrid, StatCard, EmptyState } from '../../components/dashboard';
import { photographerStatsApi, authApi } from '../../services/api';
import '../dashboard/Dashboard.css';
import './PhotographerSalesPage.css';

interface Sale {
    id: number;
    photoTitle: string;
    photoThumbnail: string;
    buyerName: string;
    saleDate: string;
    amount: number;
    commission: number;
    earnings: number;
    status: 'COMPLETED' | 'PENDING' | 'REFUNDED';
}

const PhotographerSalesPage = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('month');
    const [stats, setStats] = useState({
        totalSales: 0,
        totalRevenue: 0,
        totalEarnings: 0,
        avgSalePrice: 0
    });

    useEffect(() => {
        fetchSales();
    }, [timeRange]);

    const fetchSales = async () => {
        try {
            setLoading(true);
            const user = authApi.getCurrentUser();
            if (user?.id) {
                const data = await photographerStatsApi.getSales(user.id, timeRange);
                setSales(data.sales);
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch sales:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            COMPLETED: { class: 'status-completed', text: 'Completed' },
            PENDING: { class: 'status-pending', text: 'Pending' },
            REFUNDED: { class: 'status-refunded', text: 'Refunded' }
        };
        return badges[status as keyof typeof badges] || badges.PENDING;
    };

    return (
        <div className="photographer-sales-page">
            <DashboardPageHeader
                title="Sales"
                subtitle="Track your photo sales and revenue"
            >
                <select
                    className="time-range-select"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="all">All Time</option>
                </select>
            </DashboardPageHeader>

            {/* Sales Stats */}
            <StatsGrid columns={4}>
                <StatCard
                    icon="🛒"
                    value={stats.totalSales.toString()}
                    label="Total Sales"
                    variant="glass"
                />
                <StatCard
                    icon="💵"
                    value={formatCurrency(stats.totalRevenue)}
                    label="Total Revenue"
                    variant="glass"
                />
                <StatCard
                    icon="💰"
                    value={formatCurrency(stats.totalEarnings)}
                    label="Your Earnings"
                    variant="glass"
                />
                <StatCard
                    icon="📊"
                    value={formatCurrency(stats.avgSalePrice)}
                    label="Avg Sale Price"
                    variant="glass"
                />
            </StatsGrid>

            {/* Sales Table */}
            <DashboardSection title="Recent Sales">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <Paragraph>Loading sales data...</Paragraph>
                    </div>
                ) : sales.length === 0 ? (
                    <EmptyState
                        message="No sales yet"
                        action={
                            <Link to="/photographer/upload">
                                <button className="btn btn-primary">Upload Photos to Start Selling</button>
                            </Link>
                        }
                    />
                ) : (
                    <div className="sales-table-container">
                        <table className="sales-table">
                            <thead>
                                <tr>
                                    <th>Photo</th>
                                    <th>Buyer</th>
                                    <th>Date</th>
                                    <th>Sale Amount</th>
                                    <th>Commission</th>
                                    <th>Your Earnings</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map((sale) => (
                                    <tr key={sale.id}>
                                        <td>
                                            <div className="photo-cell">
                                                <img src={sale.photoThumbnail} alt={sale.photoTitle} className="photo-thumb" />
                                                <span className="photo-title">{sale.photoTitle}</span>
                                            </div>
                                        </td>
                                        <td>{sale.buyerName}</td>
                                        <td>{formatDate(sale.saleDate)}</td>
                                        <td className="amount">{formatCurrency(sale.amount)}</td>
                                        <td className="commission">-{formatCurrency(sale.commission)}</td>
                                        <td className="earnings">{formatCurrency(sale.earnings)}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusBadge(sale.status).class}`}>
                                                {getStatusBadge(sale.status).text}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </DashboardSection>

            {/* Sales Chart Placeholder */}
            <div className="sales-chart-grid">
                <DashboardSection title="Sales Trend" className="chart-section">
                    <div className="chart-placeholder">
                        <Paragraph color="muted">Sales chart coming soon</Paragraph>
                    </div>
                </DashboardSection>

                <DashboardSection title="Top Selling Photos" className="chart-section">
                    <div className="chart-placeholder">
                        <Paragraph color="muted">Top photos chart coming soon</Paragraph>
                    </div>
                </DashboardSection>
            </div>
        </div>
    );
};

export default PhotographerSalesPage;
