import { useState, useEffect } from 'react';
import '../dashboard/Dashboard.css';
import {
    DashboardPageHeader,
    StatsGrid,
    StatCard,
    DashboardSection,
    EmptyState
} from '../../components/dashboard';
import { authApi, photographerStatsApi } from '../../services/api';
import type { PhotographerStats } from '../../services/api';

const PhotographerDashboardPage = () => {
    const [stats, setStats] = useState<PhotographerStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const user = authApi.getCurrentUser();
            if (user && user.id) {
                try {
                    const data = await photographerStatsApi.getStats(user.id);
                    setStats(data);
                } catch (error) {
                    console.error('Failed to fetch stats:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="dashboard-overview">
            <DashboardPageHeader
                title="Photographer Dashboard"
                subtitle="Track your sales, uploads, and earnings"
            />

            <StatsGrid>
                <StatCard
                    icon="📸"
                    value={loading ? '...' : stats?.totalPhotos?.toString() || '0'}
                    label="Total Photos"
                />

                <StatCard
                    icon="💰"
                    value={loading ? '...' : formatCurrency(stats?.totalEarnings || 0)}
                    label="Total Earnings"
                />

                <StatCard
                    icon="📊"
                    value={loading ? '...' : stats?.totalSales?.toString() || '0'}
                    label="Total Sales"
                />

                <StatCard
                    icon="⭐"
                    value={loading ? '...' : stats?.averageRating?.toFixed(1) || '0.0'}
                    label="Average Rating"
                />
            </StatsGrid>

            <DashboardSection title="Recent Sales">
                <EmptyState message="No recent sales" />
            </DashboardSection>

            <DashboardSection title="Top Performing Photos">
                <EmptyState message="Upload photos to see performance" />
            </DashboardSection>
        </div>
    );
};

export default PhotographerDashboardPage;
