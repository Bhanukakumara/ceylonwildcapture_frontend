import { useState, useEffect } from 'react';
import adminApi, { type AuditLogDto } from '../../services/admin-api';
import '../dashboard/Dashboard.css';
import './AdminDashboard.css';
import './AuditLogsPage.css';

type FilterType = 'ALL' | 'LOGINS' | 'FAILED_LOGINS' | 'DOWNLOADS' | 'EVENT_TYPE' | 'ENTITY_TYPE' | 'ACTION' | 'SEARCH';

const AuditLogsPage = () => {
    const [filterType, setFilterType] = useState<FilterType>('ALL');
    const [filterValue, setFilterValue] = useState('');
    const [selectedLog, setSelectedLog] = useState<AuditLogDto | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Data states
    const [auditLogs, setAuditLogs] = useState<AuditLogDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        fetchAuditLogs();
    }, [currentPage, filterType, filterValue]);

    const fetchAuditLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            let data;
            const pageSize = 20;

            switch (filterType) {
                case 'ALL':
                    data = await adminApi.getAllAuditLogs(currentPage, pageSize);
                    break;
                case 'LOGINS':
                    data = await adminApi.getLoginAuditLogs(currentPage, pageSize);
                    break;
                case 'FAILED_LOGINS':
                    data = await adminApi.getFailedLoginAttempts(currentPage, pageSize);
                    break;
                case 'DOWNLOADS':
                    data = await adminApi.getDownloadAuditLogs(currentPage, pageSize);
                    break;
                case 'EVENT_TYPE':
                    if (filterValue) {
                        data = await adminApi.getAuditLogsByEventType(filterValue, currentPage, pageSize);
                    } else {
                        data = await adminApi.getAllAuditLogs(currentPage, pageSize);
                    }
                    break;
                case 'ENTITY_TYPE':
                    if (filterValue) {
                        data = await adminApi.getAuditLogsByEntityType(filterValue, currentPage, pageSize);
                    } else {
                        data = await adminApi.getAllAuditLogs(currentPage, pageSize);
                    }
                    break;
                case 'ACTION':
                    if (filterValue) {
                        data = await adminApi.getAuditLogsByAction(filterValue, currentPage, pageSize);
                    } else {
                        data = await adminApi.getAllAuditLogs(currentPage, pageSize);
                    }
                    break;
                case 'SEARCH':
                    if (filterValue.trim()) {
                        data = await adminApi.searchAuditLogs(filterValue.trim(), currentPage, pageSize);
                    } else {
                        data = await adminApi.getAllAuditLogs(currentPage, pageSize);
                    }
                    break;
                default:
                    data = await adminApi.getAllAuditLogs(currentPage, pageSize);
            }

            setAuditLogs(data.content);
            setTotalElements(data.totalElements);
            setTotalPages(data.totalPages);
        } catch (error: any) {
            console.error('Error fetching audit logs:', error);
            setError(error.response?.data?.message || 'Failed to fetch audit logs');
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

    const getEventTypeColor = (type: string) => {
        const colors: { [key: string]: string } = {
            LOGIN: 'login',
            LOGOUT: 'default',
            PHOTO_UPLOAD: 'activity',
            PHOTO_DOWNLOAD: 'download',
            PHOTO_DELETE: 'failed',
            MODERATION: 'admin',
            USER_BAN: 'failed',
            PAYMENT_EVENT: 'payment',
            PAYOUT_ACTION: 'payment',
            ORDER_CREATE: 'activity',
            ORDER_UPDATE: 'activity',
        };
        return colors[type] || 'default';
    };

    const getEventTypeLabel = (type: string) => {
        return type?.replace(/_/g, ' ') || 'Unknown';
    };

    const handleViewDetails = (log: AuditLogDto) => {
        setSelectedLog(log);
        setShowDetailsModal(true);
    };

    const handleFilterTypeChange = (newFilterType: FilterType) => {
        setFilterType(newFilterType);
        setFilterValue('');
        setCurrentPage(0);
    };

    const handleFilterValueChange = (value: string) => {
        setFilterValue(value);
        setCurrentPage(0);
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

            {/* Filters */}
            <div className="admin-card">
                <div className="admin-table-header">
                    <div className="filter-row">
                        <select
                            className="admin-filter-select"
                            value={filterType}
                            onChange={(e) => handleFilterTypeChange(e.target.value as FilterType)}
                        >
                            <option value="ALL">All Logs</option>
                            <option value="LOGINS">Logins</option>
                            <option value="FAILED_LOGINS">Failed Logins</option>
                            <option value="DOWNLOADS">Downloads</option>
                            <option value="EVENT_TYPE">By Event Type</option>
                            <option value="ENTITY_TYPE">By Entity Type</option>
                            <option value="ACTION">By Action</option>
                            <option value="SEARCH">Search</option>
                        </select>

                        {/* Secondary filter input based on filter type */}
                        {filterType === 'EVENT_TYPE' && (
                            <input
                                type="text"
                                placeholder="Enter event type (e.g., LOGIN, PHOTO_UPLOAD)"
                                className="admin-search-input"
                                value={filterValue}
                                onChange={(e) => handleFilterValueChange(e.target.value)}
                            />
                        )}
                        {filterType === 'ENTITY_TYPE' && (
                            <input
                                type="text"
                                placeholder="Enter entity type (e.g., USER, PHOTO, ORDER)"
                                className="admin-search-input"
                                value={filterValue}
                                onChange={(e) => handleFilterValueChange(e.target.value)}
                            />
                        )}
                        {filterType === 'ACTION' && (
                            <input
                                type="text"
                                placeholder="Enter action (e.g., CREATE, UPDATE, DELETE)"
                                className="admin-search-input"
                                value={filterValue}
                                onChange={(e) => handleFilterValueChange(e.target.value)}
                            />
                        )}
                        {filterType === 'SEARCH' && (
                            <input
                                type="text"
                                placeholder="Search descriptions, actions, event types..."
                                className="admin-search-input"
                                value={filterValue}
                                onChange={(e) => handleFilterValueChange(e.target.value)}
                            />
                        )}
                    </div>
                </div>

                {/* Audit Logs Table */}
                <div className="admin-table-container">
                    {error && (
                        <div className="error-message" style={{ padding: '1rem', color: '#ef4444', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Event Type</th>
                                <th>Action</th>
                                <th>User</th>
                                <th>Entity</th>
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
                                            <span className={`audit-type-badge ${getEventTypeColor(log.eventType)}`}>
                                                {getEventTypeLabel(log.eventType)}
                                            </span>
                                        </td>
                                        <td className="action-cell">{log.action?.replace(/_/g, ' ')}</td>
                                        <td>
                                            <div className="user-cell">
                                                {log.username || `User ${log.userId || 'N/A'}`}
                                            </div>
                                        </td>
                                        <td className="entity-cell">
                                            {log.entityType && log.entityId ? (
                                                <span>{log.entityType} #{log.entityId}</span>
                                            ) : (
                                                <span className="text-muted">-</span>
                                            )}
                                        </td>
                                        <td className="ip-cell">{log.ipAddress || '-'}</td>
                                        <td className="date-cell">{formatDate(log.timestamp)}</td>
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
                            disabled={currentPage === 0 || loading}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage + 1} of {Math.max(1, totalPages)}</span>
                        <button
                            className="btn btn-ghost btn-sm"
                            disabled={currentPage >= totalPages - 1 || loading}
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
                                        <div><strong>Event Type:</strong> <span className={`audit-type-badge ${getEventTypeColor(selectedLog.eventType)}`}>{getEventTypeLabel(selectedLog.eventType)}</span></div>
                                        <div><strong>Action:</strong> {selectedLog.action}</div>
                                        <div><strong>Timestamp:</strong> {formatDate(selectedLog.timestamp)}</div>
                                    </div>
                                </div>

                                <div className="audit-info-section">
                                    <h4>User Information</h4>
                                    <div className="detail-grid">
                                        <div><strong>Username:</strong> {selectedLog.username || 'N/A'}</div>
                                        <div><strong>User ID:</strong> {selectedLog.userId || 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="audit-info-section">
                                    <h4>Entity Information</h4>
                                    <div className="detail-grid">
                                        <div><strong>Entity Type:</strong> {selectedLog.entityType || 'N/A'}</div>
                                        <div><strong>Entity ID:</strong> {selectedLog.entityId || 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="audit-info-section">
                                    <h4>Technical Details</h4>
                                    <div className="detail-grid">
                                        <div><strong>IP Address:</strong> {selectedLog.ipAddress || 'N/A'}</div>
                                        <div><strong>User Agent:</strong> {selectedLog.userAgent || 'N/A'}</div>
                                    </div>
                                </div>

                                {selectedLog.description && (
                                    <div className="audit-info-section full-width">
                                        <h4>Description</h4>
                                        <p>{selectedLog.description}</p>
                                    </div>
                                )}

                                {selectedLog.metadata && (
                                    <div className="audit-info-section full-width">
                                        <h4>Metadata</h4>
                                        <pre>{selectedLog.metadata}</pre>
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
