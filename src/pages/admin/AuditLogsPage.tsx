import { useState } from 'react';
import '../dashboard/Dashboard.css';
import './AdminDashboard.css';
import './AuditLogsPage.css';

type AuditType = 'ALL' | 'LOGIN_AUDIT' | 'DOWNLOAD_AUDIT' | 'ADMIN_ACTION_AUDIT' | 'PAYMENT_AUDIT' | 'USER_ACTIVITY_AUDIT';
type ActionResult = 'ALL' | 'SUCCESS' | 'FAILURE';

interface AuditLog {
    id: number;
    auditType: string;
    userId?: number;
    userName?: string;
    adminId?: number;
    adminName?: string;
    action: string;
    actionResult: 'SUCCESS' | 'FAILURE';
    ipAddress: string;
    device?: string;
    browser?: string;
    country?: string;
    city?: string;
    entityType?: string;
    entityId?: number;
    reason?: string;
    errorMessage?: string;
    createdAt: string;
}

const AuditLogsPage = () => {
    const [auditTypeFilter, setAuditTypeFilter] = useState<AuditType>('ALL');
    const [resultFilter, setResultFilter] = useState<ActionResult>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [dateRange, setDateRange] = useState('today');

    // Mock data - replace with API calls
    const mockAuditLogs: AuditLog[] = [
        {
            id: 1,
            auditType: 'LOGIN_AUDIT',
            userId: 5,
            userName: 'john.doe@example.com',
            action: 'LOGIN_ATTEMPT',
            actionResult: 'SUCCESS',
            ipAddress: '192.168.1.100',
            device: 'Desktop',
            browser: 'Chrome 120.0',
            country: 'Sri Lanka',
            city: 'Colombo',
            createdAt: '2024-12-15T10:30:00'
        },
        {
            id: 2,
            auditType: 'LOGIN_AUDIT',
            userName: 'unknown@example.com',
            action: 'LOGIN_ATTEMPT',
            actionResult: 'FAILURE',
            ipAddress: '192.168.1.101',
            device: 'Mobile',
            browser: 'Safari 17.0',
            country: 'Sri Lanka',
            city: 'Kandy',
            errorMessage: 'Invalid credentials',
            createdAt: '2024-12-15T10:25:00'
        },
        {
            id: 3,
            auditType: 'ADMIN_ACTION_AUDIT',
            adminId: 1,
            adminName: 'Admin User',
            action: 'APPROVE_PHOTO',
            actionResult: 'SUCCESS',
            entityType: 'PHOTO',
            entityId: 456,
            reason: 'High quality wildlife photography',
            ipAddress: '192.168.1.50',
            createdAt: '2024-12-15T09:15:00'
        },
        {
            id: 4,
            auditType: 'DOWNLOAD_AUDIT',
            userId: 8,
            userName: 'jane.smith@example.com',
            action: 'PHOTO_DOWNLOADED',
            actionResult: 'SUCCESS',
            ipAddress: '192.168.1.105',
            device: 'Desktop',
            browser: 'Firefox 121.0',
            country: 'Sri Lanka',
            city: 'Galle',
            createdAt: '2024-12-15T08:45:00'
        },
        {
            id: 5,
            auditType: 'PAYMENT_AUDIT',
            userId: 12,
            userName: 'mike.johnson@example.com',
            action: 'PAYMENT_COMPLETED',
            actionResult: 'SUCCESS',
            ipAddress: '192.168.1.110',
            createdAt: '2024-12-15T08:30:00'
        },
        {
            id: 6,
            auditType: 'ADMIN_ACTION_AUDIT',
            adminId: 1,
            adminName: 'Admin User',
            action: 'DEACTIVATE_USER',
            actionResult: 'SUCCESS',
            entityType: 'USER',
            entityId: 789,
            reason: 'Terms of service violation',
            ipAddress: '192.168.1.50',
            createdAt: '2024-12-15T07:20:00'
        },
        {
            id: 7,
            auditType: 'USER_ACTIVITY_AUDIT',
            userId: 15,
            userName: 'sarah.williams@example.com',
            action: 'PROFILE_UPDATED',
            actionResult: 'SUCCESS',
            ipAddress: '192.168.1.115',
            device: 'Mobile',
            browser: 'Chrome Mobile 120.0',
            createdAt: '2024-12-15T06:50:00'
        },
        {
            id: 8,
            auditType: 'DOWNLOAD_AUDIT',
            userId: 8,
            userName: 'jane.smith@example.com',
            action: 'PHOTO_DOWNLOADED',
            actionResult: 'FAILURE',
            ipAddress: '192.168.1.105',
            errorMessage: 'License expired',
            createdAt: '2024-12-15T06:30:00'
        }
    ];

    const stats = {
        totalLogs: 15847,
        todayLogs: 234,
        failedActions: 45,
        adminActions: 89,
        loginAttempts: 1234,
        downloads: 567
    };

    const filteredLogs = mockAuditLogs.filter(log => {
        const matchesType = auditTypeFilter === 'ALL' || log.auditType === auditTypeFilter;
        const matchesResult = resultFilter === 'ALL' || log.actionResult === resultFilter;
        const matchesSearch = searchTerm === '' ||
            log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.adminName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.ipAddress.includes(searchTerm);

        return matchesType && matchesResult && matchesSearch;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getAuditTypeColor = (type: string) => {
        const colors: { [key: string]: string } = {
            LOGIN_AUDIT: 'login',
            DOWNLOAD_AUDIT: 'download',
            ADMIN_ACTION_AUDIT: 'admin',
            PAYMENT_AUDIT: 'payment',
            USER_ACTIVITY_AUDIT: 'activity'
        };
        return colors[type] || 'default';
    };

    const getAuditTypeLabel = (type: string) => {
        const labels: { [key: string]: string } = {
            LOGIN_AUDIT: 'Login',
            DOWNLOAD_AUDIT: 'Download',
            ADMIN_ACTION_AUDIT: 'Admin Action',
            PAYMENT_AUDIT: 'Payment',
            USER_ACTIVITY_AUDIT: 'User Activity'
        };
        return labels[type] || type;
    };

    const handleViewDetails = (log: AuditLog) => {
        setSelectedLog(log);
        setShowDetailsModal(true);
    };

    return (
        <div className="audit-logs-page">
            <div className="page-header">
                <div>
                    <h2>Audit Logs</h2>
                    <p className="page-subtitle">Track all system activities and admin actions</p>
                </div>
                <div className="header-actions">
                    <select
                        className="date-range-select"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                        <option value="custom">Custom Range</option>
                    </select>
                    <button className="btn btn-primary">Export Logs</button>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="stats-grid stats-grid-6">
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.totalLogs.toLocaleString()}</div>
                        <div className="stat-label">Total Logs</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.todayLogs}</div>
                        <div className="stat-label">Today's Logs</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card pending">
                    <div className="stat-content">
                        <div className="stat-value">{stats.failedActions}</div>
                        <div className="stat-label">Failed Actions</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.adminActions}</div>
                        <div className="stat-label">Admin Actions</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.loginAttempts.toLocaleString()}</div>
                        <div className="stat-label">Login Attempts</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.downloads}</div>
                        <div className="stat-label">Downloads</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-card">
                <div className="admin-table-header">
                    <input
                        type="text"
                        placeholder="Search by user, action, or IP address..."
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="admin-filter-select"
                        value={auditTypeFilter}
                        onChange={(e) => setAuditTypeFilter(e.target.value as AuditType)}
                    >
                        <option value="ALL">All Types</option>
                        <option value="LOGIN_AUDIT">Login Audit</option>
                        <option value="DOWNLOAD_AUDIT">Download Audit</option>
                        <option value="ADMIN_ACTION_AUDIT">Admin Actions</option>
                        <option value="PAYMENT_AUDIT">Payment Audit</option>
                        <option value="USER_ACTIVITY_AUDIT">User Activity</option>
                    </select>
                    <select
                        className="admin-filter-select"
                        value={resultFilter}
                        onChange={(e) => setResultFilter(e.target.value as ActionResult)}
                    >
                        <option value="ALL">All Results</option>
                        <option value="SUCCESS">Success</option>
                        <option value="FAILURE">Failure</option>
                    </select>
                </div>

                {/* Audit Logs Table */}
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>User/Admin</th>
                                <th>Action</th>
                                <th>Result</th>
                                <th>Location</th>
                                <th>Device</th>
                                <th>IP Address</th>
                                <th>Timestamp</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map((log) => (
                                <tr key={log.id}>
                                    <td>
                                        <span className={`audit-type-badge ${getAuditTypeColor(log.auditType)}`}>
                                            {getAuditTypeLabel(log.auditType)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="user-cell">
                                            {log.userName || log.adminName || 'Unknown'}
                                            {log.adminName && <span className="admin-indicator">Admin</span>}
                                        </div>
                                    </td>
                                    <td className="action-cell">{log.action.replace(/_/g, ' ')}</td>
                                    <td>
                                        <span className={`status-badge ${log.actionResult.toLowerCase()}`}>
                                            {log.actionResult}
                                        </span>
                                    </td>
                                    <td className="location-cell">
                                        {log.city && log.country ? `${log.city}, ${log.country}` : '-'}
                                    </td>
                                    <td className="device-cell">
                                        {log.device ? (
                                            <div>
                                                <div>{log.device}</div>
                                                {log.browser && <div className="browser-info">{log.browser}</div>}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="ip-cell">{log.ipAddress}</td>
                                    <td className="date-cell">{formatDate(log.createdAt)}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                className="action-btn"
                                                title="View Details"
                                                onClick={() => handleViewDetails(log)}
                                            >
                                                👁️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="table-pagination">
                    <div className="pagination-info">
                        Showing {filteredLogs.length} of {mockAuditLogs.length} logs
                    </div>
                    <div className="pagination-controls">
                        <button className="btn btn-ghost btn-sm">Previous</button>
                        <button className="btn btn-ghost btn-sm active">1</button>
                        <button className="btn btn-ghost btn-sm">2</button>
                        <button className="btn btn-ghost btn-sm">3</button>
                        <button className="btn btn-ghost btn-sm">Next</button>
                    </div>
                </div>
            </div>

            {/* Audit Log Details Modal */}
            {showDetailsModal && selectedLog && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-content large audit-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Audit Log Details</h3>
                            <button className="modal-close" onClick={() => setShowDetailsModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="audit-details-layout">
                                <div className="audit-info-section">
                                    <h4>Event Information</h4>
                                    <div className="detail-grid">
                                        <div><strong>Log ID:</strong> #{selectedLog.id}</div>
                                        <div><strong>Type:</strong> <span className={`audit-type-badge ${getAuditTypeColor(selectedLog.auditType)}`}>{getAuditTypeLabel(selectedLog.auditType)}</span></div>
                                        <div><strong>Action:</strong> {selectedLog.action.replace(/_/g, ' ')}</div>
                                        <div><strong>Result:</strong> <span className={`status-badge ${selectedLog.actionResult.toLowerCase()}`}>{selectedLog.actionResult}</span></div>
                                        <div><strong>Timestamp:</strong> {formatDate(selectedLog.createdAt)}</div>
                                    </div>
                                </div>

                                {(selectedLog.userName || selectedLog.adminName) && (
                                    <div className="audit-info-section">
                                        <h4>User Information</h4>
                                        <div className="detail-grid">
                                            {selectedLog.userName && <div><strong>User:</strong> {selectedLog.userName}</div>}
                                            {selectedLog.userId && <div><strong>User ID:</strong> {selectedLog.userId}</div>}
                                            {selectedLog.adminName && <div><strong>Admin:</strong> {selectedLog.adminName}</div>}
                                            {selectedLog.adminId && <div><strong>Admin ID:</strong> {selectedLog.adminId}</div>}
                                        </div>
                                    </div>
                                )}

                                <div className="audit-info-section">
                                    <h4>Technical Details</h4>
                                    <div className="detail-grid">
                                        <div><strong>IP Address:</strong> {selectedLog.ipAddress}</div>
                                        {selectedLog.device && <div><strong>Device:</strong> {selectedLog.device}</div>}
                                        {selectedLog.browser && <div><strong>Browser:</strong> {selectedLog.browser}</div>}
                                        {selectedLog.country && <div><strong>Country:</strong> {selectedLog.country}</div>}
                                        {selectedLog.city && <div><strong>City:</strong> {selectedLog.city}</div>}
                                    </div>
                                </div>

                                {(selectedLog.entityType || selectedLog.entityId) && (
                                    <div className="audit-info-section">
                                        <h4>Entity Information</h4>
                                        <div className="detail-grid">
                                            {selectedLog.entityType && <div><strong>Entity Type:</strong> {selectedLog.entityType}</div>}
                                            {selectedLog.entityId && <div><strong>Entity ID:</strong> {selectedLog.entityId}</div>}
                                        </div>
                                    </div>
                                )}

                                {(selectedLog.reason || selectedLog.errorMessage) && (
                                    <div className="audit-info-section full-width">
                                        <h4>Additional Information</h4>
                                        {selectedLog.reason && (
                                            <div className="info-block">
                                                <strong>Reason:</strong>
                                                <p>{selectedLog.reason}</p>
                                            </div>
                                        )}
                                        {selectedLog.errorMessage && (
                                            <div className="info-block error">
                                                <strong>Error Message:</strong>
                                                <p>{selectedLog.errorMessage}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowDetailsModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditLogsPage;
