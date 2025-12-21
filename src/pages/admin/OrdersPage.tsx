import { useState } from 'react';
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
    buyer: {
        id: number;
        name: string;
        email: string;
        username: string;
    };
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
    billingAddress?: string;
    billingCity?: string;
    billingCountry?: string;
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

    // Mock data - replace with API calls
    const mockOrders: Order[] = [
        {
            id: 1,
            orderNumber: 'ORD-2024-001234',
            buyer: {
                id: 1,
                name: 'John Doe',
                email: 'john.doe@example.com',
                username: 'johndoe'
            },
            totalAmount: 200.00,
            subtotal: 200.00,
            taxAmount: 0.00,
            discountAmount: 0.00,
            status: 'COMPLETED',
            paymentMethod: 'Credit Card',
            paymentId: 'pi_3abc123xyz',
            transactionId: 'txn_abc123',
            billingName: 'John Doe',
            billingEmail: 'john.doe@example.com',
            billingAddress: '123 Main St',
            billingCity: 'Colombo',
            billingCountry: 'Sri Lanka',
            itemCount: 2,
            items: [
                {
                    id: 1,
                    photoId: 123,
                    photoTitle: 'Sri Lankan Leopard in Yala',
                    photoThumbnail: '/api/placeholder/100/75',
                    licenseType: 'COMMERCIAL',
                    price: 150.00,
                    discount: 0,
                    finalPrice: 150.00,
                    photographerName: 'Jane Smith'
                },
                {
                    id: 2,
                    photoId: 456,
                    photoTitle: 'Asian Elephant Herd',
                    photoThumbnail: '/api/placeholder/100/75',
                    licenseType: 'BASE',
                    price: 50.00,
                    discount: 0,
                    finalPrice: 50.00,
                    photographerName: 'Mike Johnson'
                }
            ],
            createdAt: '2024-12-01T10:30:00',
            completedAt: '2024-12-01T10:35:00'
        },
        {
            id: 2,
            orderNumber: 'ORD-2024-001235',
            buyer: {
                id: 2,
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                username: 'janesmith'
            },
            totalAmount: 150.00,
            subtotal: 150.00,
            taxAmount: 0.00,
            discountAmount: 0.00,
            status: 'PENDING',
            billingName: 'Jane Smith',
            billingEmail: 'jane.smith@example.com',
            billingCity: 'Kandy',
            billingCountry: 'Sri Lanka',
            itemCount: 1,
            createdAt: '2024-12-10T14:20:00'
        },
        {
            id: 3,
            orderNumber: 'ORD-2024-001236',
            buyer: {
                id: 3,
                name: 'Mike Johnson',
                email: 'mike.johnson@example.com',
                username: 'mikejohnson'
            },
            totalAmount: 275.00,
            subtotal: 300.00,
            taxAmount: 0.00,
            discountAmount: 25.00,
            couponCode: 'SUMMER2024',
            status: 'PROCESSING',
            paymentMethod: 'PayPal',
            billingName: 'Mike Johnson',
            billingEmail: 'mike.johnson@example.com',
            billingCity: 'Galle',
            billingCountry: 'Sri Lanka',
            itemCount: 3,
            createdAt: '2024-12-08T09:15:00'
        },
        {
            id: 4,
            orderNumber: 'ORD-2024-001237',
            buyer: {
                id: 1,
                name: 'John Doe',
                email: 'john.doe@example.com',
                username: 'johndoe'
            },
            totalAmount: 75.00,
            subtotal: 75.00,
            taxAmount: 0.00,
            discountAmount: 0.00,
            status: 'CANCELLED',
            billingName: 'John Doe',
            billingEmail: 'john.doe@example.com',
            billingCity: 'Colombo',
            billingCountry: 'Sri Lanka',
            itemCount: 1,
            createdAt: '2024-12-05T16:45:00',
            cancelledAt: '2024-12-05T17:00:00'
        }
    ];

    const stats = {
        totalOrders: 1547,
        pendingOrders: 23,
        processingOrders: 5,
        completedOrders: 1500,
        cancelledOrders: 15,
        refundedOrders: 4,
        totalRevenue: 125000.50,
        averageOrderValue: 80.85
    };

    const filteredOrders = mockOrders.filter(order => {
        const matchesSearch = searchTerm === '' ||
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.buyer.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

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

    const getStatusColor = (status: OrderStatus) => {
        const colors = {
            PENDING: 'pending',
            PROCESSING: 'processing',
            COMPLETED: 'completed',
            CANCELLED: 'cancelled',
            REFUNDED: 'refunded'
        };
        return colors[status];
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

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const handleUpdateStatus = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setShowStatusModal(true);
    };

    const confirmUpdateStatus = () => {
        if (selectedOrder) {
            console.log('Update order status:', selectedOrder.id, newStatus, statusNotes);
            // API call: PUT /api/v1/orders/{orderId}/status
            setShowStatusModal(false);
            setStatusNotes('');
        }
    };

    const handleCancelOrder = (order: Order) => {
        if (confirm(`Are you sure you want to cancel order ${order.orderNumber}?`)) {
            console.log('Cancel order:', order.id);
            // API call: POST /api/v1/orders/{orderId}/cancel
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
                        <div className="stat-value">{stats.totalOrders.toLocaleString()}</div>
                        <div className="stat-label">Total Orders</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card pending">
                    <div className="stat-content">
                        <div className="stat-value">{stats.pendingOrders}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card processing">
                    <div className="stat-content">
                        <div className="stat-value">{stats.processingOrders}</div>
                        <div className="stat-label">Processing</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.completedOrders.toLocaleString()}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
                        <div className="stat-label">Total Revenue</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{formatCurrency(stats.averageOrderValue)}</div>
                        <div className="stat-label">Avg Order Value</div>
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
                            {filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <div className="order-number-cell">
                                            <span className="order-number">{order.orderNumber}</span>
                                            {order.couponCode && (
                                                <span className="coupon-badge">🎟️ {order.couponCode}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="buyer-cell">
                                            <div className="buyer-name">{order.buyer.name}</div>
                                            <div className="buyer-email">{order.buyer.email}</div>
                                        </div>
                                    </td>
                                    <td className="items-cell">{order.itemCount} item{order.itemCount > 1 ? 's' : ''}</td>
                                    <td className="amount-cell">
                                        <div className="amount-main">{formatCurrency(order.totalAmount)}</div>
                                        {order.discountAmount > 0 && (
                                            <div className="amount-discount">-{formatCurrency(order.discountAmount)}</div>
                                        )}
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
                                                onClick={() => handleViewDetails(order)}
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="table-pagination">
                    <div className="pagination-info">
                        Showing {filteredOrders.length} of {mockOrders.length} orders
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
                                        <div><strong>Name:</strong> {selectedOrder.buyer.name}</div>
                                        <div><strong>Email:</strong> {selectedOrder.buyer.email}</div>
                                        <div><strong>Username:</strong> @{selectedOrder.buyer.username}</div>
                                    </div>
                                </div>

                                <div className="order-info-section">
                                    <h4>Billing Information</h4>
                                    <div className="detail-grid">
                                        <div><strong>Name:</strong> {selectedOrder.billingName}</div>
                                        <div><strong>Email:</strong> {selectedOrder.billingEmail}</div>
                                        {selectedOrder.billingAddress && <div><strong>Address:</strong> {selectedOrder.billingAddress}</div>}
                                        {selectedOrder.billingCity && <div><strong>City:</strong> {selectedOrder.billingCity}</div>}
                                        {selectedOrder.billingCountry && <div><strong>Country:</strong> {selectedOrder.billingCountry}</div>}
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
                                            {selectedOrder.items.map((item) => (
                                                <div key={item.id} className="order-item-card">
                                                    <img src={item.photoThumbnail} alt={item.photoTitle} className="item-thumbnail" />
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
