import { useState, useEffect } from 'react';
import { Title, Paragraph, Button } from '../../components/ui';
import { DashboardPageHeader, DashboardSection, StatsGrid, StatCard } from '../../components/dashboard';
import { photographerStatsApi, authApi, type EarningsData, type Payout, type PayoutResponse } from '../../services/api';
import '../dashboard/Dashboard.css';
import './PhotographerEarningsPage.css';

const PhotographerEarningsPage = () => {
    const [earnings, setEarnings] = useState<EarningsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');

    useEffect(() => {
        fetchEarnings();
    }, []);

    const fetchEarnings = async () => {
        try {
            setLoading(true);
            const user = authApi.getCurrentUser();
            if (user?.id) {
                // Fetch earnings summary
                const earningsData = await photographerStatsApi.getEarnings(user.id);

                // Fetch payout history to get recent payouts
                const payoutHistory = await photographerStatsApi.getPayoutHistory(user.id, 0, 5);

                // Transform payout data to match the expected format
                const recentPayouts: Payout[] = payoutHistory.content.map((payout: PayoutResponse) => ({
                    id: payout.id,
                    amount: payout.amount,
                    date: payout.requestedAt,
                    status: payout.status === 'COMPLETED' ? 'COMPLETED' :
                        payout.status === 'PROCESSING' || payout.status === 'APPROVED' ? 'PROCESSING' :
                            payout.status === 'REJECTED' || payout.status === 'CANCELLED' ? 'FAILED' : 'PENDING',
                    method: payout.payoutMethod || 'Bank Transfer'
                }));

                // Calculate available for withdrawal (total - pending - paid)
                const availableForWithdrawal = earningsData.totalEarnings - earningsData.pendingEarnings - earningsData.paidEarnings;

                // For now, create empty monthly earnings (will need backend endpoint for this)
                const monthlyEarnings: { month: string; amount: number }[] = [];

                setEarnings({
                    ...earningsData,
                    availableForWithdrawal: Math.max(0, availableForWithdrawal),
                    monthlyEarnings,
                    recentPayouts
                });
            }
        } catch (error) {
            console.error('Failed to fetch earnings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        const amount = parseFloat(withdrawAmount);
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (earnings && amount > earnings.availableForWithdrawal) {
            alert('Insufficient balance');
            return;
        }

        try {
            // Call withdrawal API
            await photographerStatsApi.requestWithdrawal(amount);
            alert('Withdrawal request submitted successfully');
            setShowWithdrawModal(false);
            setWithdrawAmount('');
            fetchEarnings();
        } catch (error) {
            console.error('Withdrawal failed:', error);
            alert('Failed to process withdrawal');
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
            PROCESSING: { class: 'status-processing', text: 'Processing' },
            PENDING: { class: 'status-pending', text: 'Pending' },
            FAILED: { class: 'status-failed', text: 'Failed' }
        };
        return badges[status as keyof typeof badges] || badges.PENDING;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <Paragraph>Loading earnings data...</Paragraph>
            </div>
        );
    }

    return (
        <div className="photographer-earnings-page">
            <DashboardPageHeader
                title="Earnings"
                subtitle="Track your earnings and request payouts"
            >
                <Button
                    variant="primary"
                    onClick={() => setShowWithdrawModal(true)}
                    disabled={!earnings || earnings.availableForWithdrawal <= 0}
                >
                    💰 Request Withdrawal
                </Button>
            </DashboardPageHeader>

            {/* Earnings Stats */}
            <StatsGrid columns={4}>
                <StatCard
                    icon="💰"
                    value={formatCurrency(earnings?.totalEarnings || 0)}
                    label="Total Earnings"
                    variant="glass"
                />
                <StatCard
                    icon="⏳"
                    value={formatCurrency(earnings?.pendingEarnings || 0)}
                    label="Pending Earnings"
                    variant="glass"
                />
                <StatCard
                    icon="✅"
                    value={formatCurrency(earnings?.paidEarnings || 0)}
                    label="Paid Out"
                    variant="glass"
                />
                <StatCard
                    icon="💵"
                    value={formatCurrency(earnings?.availableForWithdrawal || 0)}
                    label="Available"
                    variant="glass"
                    className="available-balance"
                />
            </StatsGrid>

            {/* Monthly Earnings Chart */}
            <DashboardSection title="Monthly Earnings">
                <div className="earnings-chart">
                    {earnings?.monthlyEarnings && earnings.monthlyEarnings.length > 0 ? (
                        <div className="bar-chart">
                            {earnings.monthlyEarnings.map((month, index) => (
                                <div key={index} className="bar-item">
                                    <div className="bar-container">
                                        <div
                                            className="bar-fill"
                                            style={{
                                                height: `${(month.amount / Math.max(...earnings.monthlyEarnings.map(m => m.amount))) * 100}%`
                                            }}
                                        >
                                            <span className="bar-value">{formatCurrency(month.amount)}</span>
                                        </div>
                                    </div>
                                    <div className="bar-label">{month.month}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="chart-placeholder">
                            <Paragraph color="muted">No earnings data available yet</Paragraph>
                        </div>
                    )}
                </div>
            </DashboardSection>

            {/* Recent Payouts */}
            <DashboardSection title="Recent Payouts">
                {earnings?.recentPayouts && earnings.recentPayouts.length > 0 ? (
                    <div className="payouts-table-container">
                        <table className="payouts-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {earnings.recentPayouts.map((payout) => (
                                    <tr key={payout.id}>
                                        <td>{formatDate(payout.date)}</td>
                                        <td className="amount">{formatCurrency(payout.amount)}</td>
                                        <td>{payout.method}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusBadge(payout.status).class}`}>
                                                {getStatusBadge(payout.status).text}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <Paragraph color="muted">No payouts yet</Paragraph>
                    </div>
                )}
            </DashboardSection>

            {/* Withdrawal Modal */}
            {showWithdrawModal && (
                <div className="modal-overlay" onClick={() => setShowWithdrawModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <Title level={3}>Request Withdrawal</Title>
                            <button className="modal-close" onClick={() => setShowWithdrawModal(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="balance-info">
                                <Paragraph size="sm" color="muted">Available Balance</Paragraph>
                                <Title level={2} className="balance-amount">
                                    {formatCurrency(earnings?.availableForWithdrawal || 0)}
                                </Title>
                            </div>

                            <div className="form-group">
                                <label htmlFor="withdraw-amount" className="form-label">Withdrawal Amount</label>
                                <div className="amount-input-wrapper">
                                    <span className="currency-symbol">$</span>
                                    <input
                                        type="number"
                                        id="withdraw-amount"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        max={earnings?.availableForWithdrawal || 0}
                                        className="amount-input"
                                    />
                                </div>
                            </div>

                            <div className="withdrawal-info">
                                <Paragraph size="sm" color="muted">
                                    • Minimum withdrawal: $50.00<br />
                                    • Processing time: 3-5 business days<br />
                                    • No fees for withdrawals
                                </Paragraph>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <Button variant="ghost" onClick={() => setShowWithdrawModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleWithdraw}>
                                Request Withdrawal
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotographerEarningsPage;
