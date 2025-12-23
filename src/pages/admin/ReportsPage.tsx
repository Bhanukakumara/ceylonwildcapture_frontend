import { useState } from 'react';
import adminApi from '../../services/admin-api';
import '../dashboard/Dashboard.css';
import './AdminDashboard.css';
import './ReportsPage.css';

interface FinancialReport {
    startDate: string;
    endDate: string;
    totalRevenue: number;
    platformRevenue: number;
    photographerRevenue: number;
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    refundedOrders: number;
    totalPayouts: number;
    pendingPayouts: number;
    completedPayouts: number;
    totalRefunds: number;
    refundCount: number;
    revenueByCategory: { [key: string]: number };
    salesByCategory: { [key: string]: number };
    topEarningPhotographers: Array<{
        photographerId: number;
        photographerName: string;
        totalEarnings: number;
        platformFee: number;
        totalSales: number;
    }>;
    dailyRevenueData: Array<{
        date: string;
        revenue: number;
        orders: number;
    }>;
}

const ReportsPage = () => {
    const [report, setReport] = useState<FinancialReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [exporting, setExporting] = useState(false);

    // Date filters
    const [reportType, setReportType] = useState<'custom' | 'monthly' | 'yearly'>('monthly');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    const handleGenerateReport = async () => {
        try {
            setLoading(true);
            setError(null);
            let reportData;

            if (reportType === 'custom' && startDate && endDate) {
                reportData = await adminApi.generateFinancialReport(startDate, endDate);
            } else if (reportType === 'monthly') {
                reportData = await adminApi.generateMonthlyReport(selectedYear, selectedMonth);
            } else if (reportType === 'yearly') {
                reportData = await adminApi.generateYearlyReport(selectedYear);
            }

            setReport(reportData);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
        if (!report) return;

        try {
            setExporting(true);
            let blob: Blob;

            if (format === 'pdf') {
                blob = await adminApi.exportReportToPdf(report);
            } else if (format === 'excel') {
                blob = await adminApi.exportReportToExcel(report);
            } else {
                blob = await adminApi.exportReportToCsv(report);
            }

            // Download file
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `financial-report-${report.startDate}-to-${report.endDate}.${format === 'excel' ? 'xlsx' : format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to export report');
        } finally {
            setExporting(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    };

    return (
        <div className="reports-page">
            <div className="page-header">
                <div>
                    <h2>Financial Reports</h2>
                    <p className="page-subtitle">Generate and export comprehensive financial reports</p>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-card report-filters">
                <h3>Report Configuration</h3>

                <div className="filter-row">
                    <div className="form-group">
                        <label>Report Type</label>
                        <select
                            className="form-select"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value as any)}
                        >
                            <option value="monthly">Monthly Report</option>
                            <option value="yearly">Yearly Report</option>
                            <option value="custom">Custom Date Range</option>
                        </select>
                    </div>

                    {reportType === 'custom' && (
                        <>
                            <div className="form-group">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    {reportType === 'monthly' && (
                        <>
                            <div className="form-group">
                                <label>Year</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    min="2020"
                                    max="2030"
                                />
                            </div>
                            <div className="form-group">
                                <label>Month</label>
                                <select
                                    className="form-select"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                >
                                    <option value="1">January</option>
                                    <option value="2">February</option>
                                    <option value="3">March</option>
                                    <option value="4">April</option>
                                    <option value="5">May</option>
                                    <option value="6">June</option>
                                    <option value="7">July</option>
                                    <option value="8">August</option>
                                    <option value="9">September</option>
                                    <option value="10">October</option>
                                    <option value="11">November</option>
                                    <option value="12">December</option>
                                </select>
                            </div>
                        </>
                    )}

                    {reportType === 'yearly' && (
                        <div className="form-group">
                            <label>Year</label>
                            <input
                                type="number"
                                className="form-input"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                min="2020"
                                max="2030"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>&nbsp;</label>
                        <button
                            className="btn btn-primary"
                            onClick={handleGenerateReport}
                            disabled={loading || (reportType === 'custom' && (!startDate || !endDate))}
                        >
                            {loading ? 'Generating...' : 'Generate Report'}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {/* Report Results */}
            {report && (
                <>
                    {/* Export Buttons */}
                    <div className="admin-card export-section">
                        <h3>Export Report</h3>
                        <div className="export-buttons">
                            <button
                                className="btn btn-ghost"
                                onClick={() => handleExport('csv')}
                                disabled={exporting}
                            >
                                📊 Export CSV
                            </button>
                            <button
                                className="btn btn-ghost"
                                onClick={() => handleExport('pdf')}
                                disabled={exporting}
                            >
                                📄 Export PDF
                            </button>
                            <button
                                className="btn btn-ghost"
                                onClick={() => handleExport('excel')}
                                disabled={exporting}
                            >
                                📗 Export Excel
                            </button>
                        </div>
                    </div>

                    {/* Revenue Summary */}
                    <div className="admin-card">
                        <h3>Revenue Summary</h3>
                        <p className="report-period">
                            Period: {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
                        </p>
                        <div className="stats-grid">
                            <div className="stat-card glass">
                                <div className="stat-content">
                                    <div className="stat-label">Total Revenue</div>
                                    <div className="stat-value">{formatCurrency(report.totalRevenue)}</div>
                                </div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-content">
                                    <div className="stat-label">Platform Revenue (10%)</div>
                                    <div className="stat-value">{formatCurrency(report.platformRevenue)}</div>
                                </div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-content">
                                    <div className="stat-label">Photographer Revenue (90%)</div>
                                    <div className="stat-value">{formatCurrency(report.photographerRevenue)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders Summary */}
                    <div className="admin-card">
                        <h3>Orders Summary</h3>
                        <div className="stats-grid stats-grid-4">
                            <div className="stat-card glass">
                                <div className="stat-content">
                                    <div className="stat-label">Total Orders</div>
                                    <div className="stat-value">{report.totalOrders}</div>
                                </div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-content">
                                    <div className="stat-label">Completed</div>
                                    <div className="stat-value" style={{ color: '#10b981' }}>{report.completedOrders}</div>
                                </div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-content">
                                    <div className="stat-label">Cancelled</div>
                                    <div className="stat-value" style={{ color: '#f59e0b' }}>{report.cancelledOrders}</div>
                                </div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-content">
                                    <div className="stat-label">Refunded</div>
                                    <div className="stat-value" style={{ color: '#ef4444' }}>{report.refundedOrders}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payouts & Refunds */}
                    <div className="admin-card">
                        <h3>Payouts & Refunds</h3>
                        <div className="stats-grid stats-grid-4">
                            <div className="stat-card glass">
                                <div className="stat-content">
                                    <div className="stat-label">Total Payouts</div>
                                    <div className="stat-value">{formatCurrency(report.totalPayouts)}</div>
                                </div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-content">
                                    <div className="stat-label">Completed Payouts</div>
                                    <div className="stat-value">{formatCurrency(report.completedPayouts)}</div>
                                </div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-content">
                                    <div className="stat-label">Pending Payouts</div>
                                    <div className="stat-value">{formatCurrency(report.pendingPayouts)}</div>
                                </div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-content">
                                    <div className="stat-label">Total Refunds</div>
                                    <div className="stat-value">{formatCurrency(report.totalRefunds)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Revenue by Category */}
                    {report.revenueByCategory && Object.keys(report.revenueByCategory).length > 0 && (
                        <div className="admin-card">
                            <h3>Revenue by Category</h3>
                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Revenue</th>
                                            <th>Sales Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(report.revenueByCategory).map(([category, revenue]) => (
                                            <tr key={category}>
                                                <td>{category}</td>
                                                <td>{formatCurrency(revenue)}</td>
                                                <td>{report.salesByCategory[category] || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Top Photographers */}
                    {report.topEarningPhotographers && report.topEarningPhotographers.length > 0 && (
                        <div className="admin-card">
                            <h3>Top Earning Photographers</h3>
                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Photographer</th>
                                            <th>Total Earnings</th>
                                            <th>Platform Fee</th>
                                            <th>Total Sales</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.topEarningPhotographers.map((photographer) => (
                                            <tr key={photographer.photographerId}>
                                                <td>{photographer.photographerName || `ID: ${photographer.photographerId}`}</td>
                                                <td>{formatCurrency(photographer.totalEarnings)}</td>
                                                <td>{formatCurrency(photographer.platformFee)}</td>
                                                <td>{photographer.totalSales}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {!report && !loading && (
                <div className="empty-state admin-card">
                    <p>Select report parameters and click "Generate Report" to view financial data</p>
                </div>
            )}
        </div>
    );
};

export default ReportsPage;
