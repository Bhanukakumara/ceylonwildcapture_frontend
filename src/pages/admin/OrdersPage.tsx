import { useState, useEffect } from 'react';
import adminApi from '../../services/admin-api';
import type { OrderStats, OrderSummary } from '../../services/admin-api';
import '../dashboard/Dashboard.css';
import './AdminDashboard.css';
import './OrdersPage.css';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
type LicenseType = 'BASE' | 'COMMERCIAL' | 'EDITORIAL' | 'EXTENDED';

interface OrderItem {
    id: number;
    photoId: number;
    photoTitle: string;
    photoThumbnail: string;
    licenseType: LicenseType;
    price: number;
    discount: number;
    finalPrice: number;
    photographerName: string;
}

interface Order {
    id: number;
    orderNumber: string;
    buyerId: number;
    buyerName: string;
    buyerEmail: string;
    totalAmount: number;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    couponCode?: string;
    status: OrderStatus;
    paymentMethod?: string;
    paymentId?: string;
    transactionId?: string;
    billingName: string;
    billingEmail: string;
    billingInfo?: {
        billingName: string;
        billingEmail: string;
        billingAddress?: string;
        billingCity?: string;
        billingState?: string;
        billingCountry?: string;
        billingZip?: string;
    };
    itemCount: number;
    items?: OrderItem[];
    createdAt: string;
    completedAt?: string;
    cancelledAt?: string;
    refundedAt?: string;
}

const OrdersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState<OrderStatus>('PROCESSING');
    const [statusNotes, setStatusNotes] = useState('');

    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        fetchStats();
        fetchOrders();
    }, [currentPage, statusFilter]);

    const fetchStats = async () => {
        try {
            const data = await adminApi.getOrderStats();
            setOrderStats(data);
        } catch (error) {
            console.error('Error fetching order stats:', error);
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getOrders(currentPage, 10);
            setOrders(data.content);
            setTotalPages(Math.ceil(data.totalElements / 10)); // Backend might return totalPages too
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)}`;
    };

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            PENDING: 'pending',
            PROCESSING: 'processing',
            COMPLETED: 'completed',
            CANCELLED: 'cancelled',
            REFUNDED: 'refunded'
        };
        return colors[status] || 'pending';
    };

    const getLicenseTypeLabel = (type: LicenseType) => {
        const labels = {
            BASE: 'Base License',
            COMMERCIAL: 'Commercial License',
            EDITORIAL: 'Editorial License',
            EXTENDED: 'Extended License'
        };
        return labels[type];
    };

    const handleViewDetails = async (orderId: number) => {
        try {
            const data = await adminApi.getOrderDetails(orderId);
            setSelectedOrder(data);
            setShowDetailsModal(true);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const handleUpdateStatus = (order: any) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setShowStatusModal(true);
    };

    const confirmUpdateStatus = async () => {
        if (selectedOrder) {
            try {
                await adminApi.updateOrderStatus(selectedOrder.id, newStatus, statusNotes);
                setShowStatusModal(false);
                setStatusNotes('');
                fetchOrders();
                fetchStats();
            } catch (error) {
                console.error('Error updating status:', error);
            }
        }
    };

    const handleCancelOrder = async (order: any) => {
        if (confirm(`Are you sure you want to cancel order ${order.orderNumber}?`)) {
            try {
                await adminApi.updateOrderStatus(order.id, 'CANCELLED');
                fetchOrders();
                fetchStats();
            } catch (error) {
                console.error('Error cancelling order:', error);
            }
        }
    };

    return (
        <div className="orders-page">
            <div className="page-header">
                <div>
                    <h2>Order Management</h2>
                    <p className="page-subtitle">Manage all orders and transactions</p>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="stats-grid">
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{orderStats?.totalOrders.toLocaleString() || 0}</div>
                        <div className="stat-label">Total Orders</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card pending">
                    <div className="stat-content">
                        <div className="stat-value">{orderStats?.pendingOrders || 0}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card processing">
                    <div className="stat-content">
                        <div className="stat-value">{orderStats?.processingOrders || 0}</div>
                        <div className="stat-label">Processing</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{orderStats?.completedOrders.toLocaleString() || 0}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{formatCurrency(orderStats?.totalRevenue || 0)}</div>
                        <div className="stat-label">Total Revenue</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-card">
                <div className="admin-table-header">
                    <input
                        type="text"
                        placeholder="Search by order number, buyer name, or email..."
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="admin-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="REFUNDED">Refunded</option>
                    </select>
                </div>

                {/* Orders Table */}
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order Number</th>
                                <th>Buyer</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div className="loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <div className="loading-spinner"></div>
                                            <p>Loading orders...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-light-gray)' }}>
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>
                                            <div className="order-number-cell">
                                                <span className="order-number">{order.orderNumber}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="buyer-cell">
                                                <div className="buyer-name">{order.buyerName}</div>
                                                <div className="buyer-email">{order.buyerEmail}</div>
                                            </div>
                                        </td>
                                        <td className="items-cell">{order.itemCount} item{order.itemCount > 1 ? 's' : ''}</td>
                                        <td className="amount-cell">
                                            <div className="amount-main">{formatCurrency(order.totalAmount)}</div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            {order.paymentMethod ? (
                                                <div className="payment-cell">
                                                    <div>{order.paymentMethod}</div>
                                                    {order.transactionId && (
                                                        <div className="transaction-id">{order.transactionId}</div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="no-payment">Not paid</span>
                                            )}
                                        </td>
                                        <td className="date-cell">{formatDate(order.createdAt)}</td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="action-btn"
                                                    title="View Details"
                                                    onClick={() => handleViewDetails(order.id)}
                                                >
                                                    👁️
                                                </button>
                                                <button
                                                    className="action-btn"
                                                    title="Update Status"
                                                    onClick={() => handleUpdateStatus(order)}
                                                >
                                                    🔄
                                                </button>
                                                {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                                                    <button
                                                        className="action-btn danger"
                                                        title="Cancel Order"
                                                        onClick={() => handleCancelOrder(order)}
                                                    >
                                                        ✗
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="table-pagination">
                    <div className="pagination-info">
                        Showing {orders.length} of {totalElements} orders
                    </div>
                    <div className="pagination-controls">
                        <button
                            className="btn btn-ghost btn-sm"
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            Previous
                        </button>
                        {[...Array(Math.max(0, totalPages || 0))].map((_, i) => (
                            <button
                                key={i}
                                className={`btn btn-ghost btn-sm ${currentPage === i ? 'active' : ''}`}
                                onClick={() => setCurrentPage(i)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="btn btn-ghost btn-sm"
                            disabled={currentPage === totalPages - 1 || totalPages === 0}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {showDetailsModal && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-content large order-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Order Details - {selectedOrder.orderNumber}</h3>
                            <button className="modal-close" onClick={() => setShowDetailsModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="order-details-layout">
                                <div className="order-info-section">
                                    <h4>Order Information</h4>
                                    <div className="detail-grid">
                                        <div><strong>Order Number:</strong> {selectedOrder.orderNumber}</div>
                                        <div><strong>Status:</strong> <span className={`status-badge ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></div>
                                        <div><strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}</div>
                                        {selectedOrder.completedAt && <div><strong>Completed:</strong> {formatDate(selectedOrder.completedAt)}</div>}
                                        {selectedOrder.cancelledAt && <div><strong>Cancelled:</strong> {formatDate(selectedOrder.cancelledAt)}</div>}
                                    </div>
                                </div>

                                <div className="order-info-section">
                                    <h4>Buyer Information</h4>
                                    <div className="detail-grid">
                                        <div><strong>Name:</strong> {selectedOrder.buyerName}</div>
                                        <div><strong>Email:</strong> {selectedOrder.buyerEmail}</div>
                                    </div>
                                </div>

                                <div className="order-info-section">
                                    <h4>Billing Information</h4>
                                    <div className="detail-grid">
                                        <div><strong>Name:</strong> {selectedOrder.billingInfo?.billingName}</div>
                                        <div><strong>Email:</strong> {selectedOrder.billingInfo?.billingEmail}</div>
                                        {selectedOrder.billingInfo?.billingAddress && <div><strong>Address:</strong> {selectedOrder.billingInfo.billingAddress}</div>}
                                        {selectedOrder.billingInfo?.billingCity && <div><strong>City:</strong> {selectedOrder.billingInfo.billingCity}</div>}
                                        {selectedOrder.billingInfo?.billingCountry && <div><strong>Country:</strong> {selectedOrder.billingInfo.billingCountry}</div>}
                                    </div>
                                </div>

                                {selectedOrder.paymentMethod && (
                                    <div className="order-info-section">
                                        <h4>Payment Information</h4>
                                        <div className="detail-grid">
                                            <div><strong>Method:</strong> {selectedOrder.paymentMethod}</div>
                                            {selectedOrder.paymentId && <div><strong>Payment ID:</strong> {selectedOrder.paymentId}</div>}
                                            {selectedOrder.transactionId && <div><strong>Transaction ID:</strong> {selectedOrder.transactionId}</div>}
                                        </div>
                                    </div>
                                )}

                                <div className="order-info-section">
                                    <h4>Order Summary</h4>
                                    <div className="order-summary">
                                        <div className="summary-row">
                                            <span>Subtotal:</span>
                                            <span>{formatCurrency(selectedOrder.subtotal)}</span>
                                        </div>
                                        {selectedOrder.discountAmount > 0 && (
                                            <div className="summary-row discount">
                                                <span>Discount {selectedOrder.couponCode && `(${selectedOrder.couponCode})`}:</span>
                                                <span>-{formatCurrency(selectedOrder.discountAmount)}</span>
                                            </div>
                                        )}
                                        {selectedOrder.taxAmount > 0 && (
                                            <div className="summary-row">
                                                <span>Tax:</span>
                                                <span>{formatCurrency(selectedOrder.taxAmount)}</span>
                                            </div>
                                        )}
                                        <div className="summary-row total">
                                            <span>Total:</span>
                                            <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>

                                {selectedOrder.items && selectedOrder.items.length > 0 && (
                                    <div className="order-info-section full-width">
                                        <h4>Order Items ({selectedOrder.itemCount})</h4>
                                        <div className="order-items-list">
                                            {selectedOrder.items.map((item: any) => (
                                                <div key={item.id} className="order-item-card">
                                                    <img src={item.photoThumbnailUrl} alt={item.photoTitle} className="item-thumbnail" />
                                                    <div className="item-details">
                                                        <div className="item-title">{item.photoTitle}</div>
                                                        <div className="item-meta">by {item.photographerName}</div>
                                                        <div className="item-license">{getLicenseTypeLabel(item.licenseType)}</div>
                                                    </div>
                                                    <div className="item-price">
                                                        {item.discount > 0 && (
                                                            <div className="item-original-price">{formatCurrency(item.price)}</div>
                                                        )}
                                                        <div className="item-final-price">{formatCurrency(item.finalPrice)}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowDetailsModal(false)}>
                                Close
                            </button>
                            <button className="btn btn-primary" onClick={() => {
                                setShowDetailsModal(false);
                                handleUpdateStatus(selectedOrder);
                            }}>
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Status Modal */}
            {showStatusModal && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Update Order Status</h3>
                            <button className="modal-close" onClick={() => setShowStatusModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Update status for order: <strong>{selectedOrder.orderNumber}</strong></p>
                            <div className="form-group">
                                <label>New Status *</label>
                                <select
                                    className="form-input"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="PROCESSING">Processing</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="REFUNDED">Refunded</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Notes (Optional)</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    placeholder="Add notes about this status change..."
                                    value={statusNotes}
                                    onChange={(e) => setStatusNotes(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => {
                                setShowStatusModal(false);
                                setStatusNotes('');
                            }}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={confirmUpdateStatus}>
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
