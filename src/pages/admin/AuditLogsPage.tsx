import { useState, useEffect } from 'react';
import adminApi from '../../services/admin-api';
import type { AuditEventResponse } from '../../services/admin-api';
import '../dashboard/Dashboard.css';
import './AdminDashboard.css';
import './AuditLogsPage.css';

type AuditType = 'ALL' | 'LOGIN' | 'LOGIN_FAILED' | 'DOWNLOAD' | 'ADMIN_MODERATION' | 'PAYMENT_EVENT' | 'PAYOUT_ACTION' | 'USER_UPDATE';

const AuditLogsPage = () => {
    const [auditTypeFilter, setAuditTypeFilter] = useState<AuditType>('LOGIN');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLog, setSelectedLog] = useState<AuditEventResponse | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Data states
    const [auditLogs, setAuditLogs] = useState<AuditEventResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        fetchAuditLogs();
        // Ideally fetch stats separate but for now we might leave stats as 0 or implement a stats endpoint later
    }, [currentPage, auditTypeFilter]);

    const fetchAuditLogs = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getAuditLogs(
                currentPage,
                20,
                auditTypeFilter,
                undefined // userId
            );
            setAuditLogs(data.content);
            setTotalElements(data.totalElements);
            setTotalPages(Math.ceil(data.totalElements / 20));
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

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
            LOGIN: 'login',
            LOGIN_FAILED: 'failed',
            DOWNLOAD: 'download',
            ADMIN_MODERATION: 'admin',
            PAYMENT_EVENT: 'payment',
            PAYOUT_ACTION: 'payment',
            USER_UPDATE: 'activity'
        };
        return colors[type] || 'default';
    };

    const getAuditTypeLabel = (type: string) => {
        const labels: { [key: string]: string } = {
            LOGIN: 'Login Success',
            LOGIN_FAILED: 'Login Failed',
            DOWNLOAD: 'Download',
            ADMIN_MODERATION: 'Admin Moderation',
            PAYMENT_EVENT: 'Payment Event',
            PAYOUT_ACTION: 'Payout Action',
            USER_UPDATE: 'User Update'
        };
        return labels[type] || type;
    };

    const handleViewDetails = (log: AuditEventResponse) => {
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
                    <button className="btn btn-primary" onClick={fetchAuditLogs}>Refresh Logs</button>
                </div>
            </div>

            {/* Statistics Grid - Placeholder for now as backend doesn't provide summary stats yet */}
            {/* ... keeping simplified or hidden ... */}

            {/* Filters */}
            <div className="admin-card">
                <div className="admin-table-header">
                    {/* Search is client side for now if backend ignores it */}
                    <input
                        type="text"
                        placeholder="Search functionality coming soon..."
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled
                    />
                    <select
                        className="admin-filter-select"
                        value={auditTypeFilter}
                        onChange={(e) => {
                            setAuditTypeFilter(e.target.value as AuditType);
                            setCurrentPage(0);
                        }}
                    >
                        <option value="ALL">All Types</option>
                        <option value="LOGIN">Login Success</option>
                        <option value="LOGIN_FAILED">Login Failed</option>
                        <option value="DOWNLOAD">Download</option>
                        <option value="ADMIN_MODERATION">Admin Moderation</option>
                        <option value="PAYMENT_EVENT">Payment Event</option>
                        <option value="PAYOUT_ACTION">Payout Action</option>
                        <option value="USER_UPDATE">User Update</option>
                    </select>
                </div>

                {/* Audit Logs Table */}
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Actor</th>
                                <th>Action</th>
                                <th>Result</th>
                                <th>IP Address</th>
                                <th>Timestamp</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="text-center">Loading...</td></tr>
                            ) : auditLogs.length === 0 ? (
                                <tr><td colSpan={7} className="text-center">No logs found</td></tr>
                            ) : (
                                auditLogs.map((log) => (
                                    <tr key={log.id}>
                                        <td>
                                            <span className={`audit-type-badge ${getAuditTypeColor(log.auditType)}`}>
                                                {getAuditTypeLabel(log.auditType)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="user-cell">
                                                {log.actorName || 'Unknown'}
                                                {log.actorType === 'ADMIN' && <span className="admin-indicator">Admin</span>}
                                            </div>
                                        </td>
                                        <td className="action-cell">{log.action?.replace(/_/g, ' ')}</td>
                                        <td>
                                            <span className={`status-badge ${log.actionResult?.toLowerCase()}`}>
                                                {log.actionResult}
                                            </span>
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="table-pagination">
                    <div className="pagination-info">
                        Showing {auditLogs.length} of {totalElements} logs
                    </div>
                    <div className="pagination-controls">
                        <button
                            className="btn btn-ghost btn-sm"
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage + 1} of {Math.max(1, totalPages)}</span>
                        <button
                            className="btn btn-ghost btn-sm"
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Audit Log Details Modal */}
            {showDetailsModal && selectedLog && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-content large audit-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Audit Log Details #{selectedLog.id}</h3>
                            <button className="modal-close" onClick={() => setShowDetailsModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="audit-details-layout">
                                <div className="audit-info-section">
                                    <h4>Event Information</h4>
                                    <div className="detail-grid">
                                        <div><strong>Type:</strong> <span className={`audit-type-badge ${getAuditTypeColor(selectedLog.auditType)}`}>{getAuditTypeLabel(selectedLog.auditType)}</span></div>
                                        <div><strong>Action:</strong> {selectedLog.action}</div>
                                        <div><strong>Result:</strong> {selectedLog.actionResult}</div>
                                        <div><strong>Timestamp:</strong> {formatDate(selectedLog.createdAt)}</div>
                                    </div>
                                </div>

                                <div className="audit-info-section">
                                    <h4>Actor Information</h4>
                                    <div className="detail-grid">
                                        <div><strong>Name:</strong> {selectedLog.actorName}</div>
                                        <div><strong>Type:</strong> {selectedLog.actorType}</div>
                                        {selectedLog.actorId && <div><strong>ID:</strong> {selectedLog.actorId}</div>}
                                    </div>
                                </div>

                                <div className="audit-info-section">
                                    <h4>Technical Details</h4>
                                    <div className="detail-grid">
                                        <div><strong>IP Address:</strong> {selectedLog.ipAddress}</div>
                                        {selectedLog.entityType && <div><strong>Entity Type:</strong> {selectedLog.entityType}</div>}
                                        {selectedLog.entityId && <div><strong>Entity ID:</strong> {selectedLog.entityId}</div>}
                                    </div>
                                </div>

                                {selectedLog.description && (
                                    <div className="audit-info-section full-width">
                                        <h4>Description</h4>
                                        <p>{selectedLog.description}</p>
                                    </div>
                                )}

                                {selectedLog.details && (
                                    <div className="audit-info-section full-width">
                                        <h4>Details</h4>
                                        <pre>{JSON.stringify(selectedLog.details, null, 2)}</pre>
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
