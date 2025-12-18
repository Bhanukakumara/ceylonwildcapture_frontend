import { useState, useEffect } from 'react';
import { orderApi, type OrderResponse, type OrderItem } from '../services/order-api';
import './OrdersPage.css';

const OrdersPage = () => {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await orderApi.getMyOrders();
                // Ensure we handle pagination if response is a Page object
                if ('content' in response) {
                    setOrders((response as any).content);
                } else {
                    setOrders(response as any);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusClass = (status: string) => {
        switch (status.toUpperCase()) {
            case 'COMPLETED': return 'status-completed';
            case 'PENDING': return 'status-pending';
            case 'CANCELLED': return 'status-cancelled';
            case 'REFUNDED': return 'status-refunded';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="orders-page">
                <div className="container">
                    <div className="loading-state">Loading your orders...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="container">
                <div className="orders-header">
                    <h1>My Orders</h1>
                    <p className="orders-subtitle">Track and manage your photo purchases</p>
                </div>

                {error && <div className="error-message glass">{error}</div>}

                {orders.length === 0 ? (
                    <div className="empty-orders glass">
                        <div className="empty-icon">🛍️</div>
                        <h2>No orders found</h2>
                        <p>You haven't made any purchases yet.</p>
                        <a href="/explore" className="btn btn-primary">Start Exploring</a>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-card glass">
                                <div className="order-info">
                                    <h3>Order #{order.orderNumber}</h3>
                                    <div className="order-meta">
                                        <div className="order-meta-item">
                                            <span>📅</span> {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="order-meta-item">
                                            <span>📦</span> {order.orderItems.length} {order.orderItems.length === 1 ? 'Item' : 'Items'}
                                        </div>
                                    </div>
                                    <div className="order-items-preview">
                                        {order.orderItems.map((item: OrderItem) => (
                                            <div key={item.id} className="order-item-thumb">
                                                <img src={item.photo.imageUrl} alt={item.photo.title} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="order-status-section">
                                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <div className="order-total">
                                        ${order.totalAmount.toFixed(2)}
                                    </div>
                                    {order.status.toUpperCase() === 'COMPLETED' && (
                                        <button className="btn btn-ghost btn-sm" style={{ marginTop: '1rem' }}>
                                            Download Photos
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
