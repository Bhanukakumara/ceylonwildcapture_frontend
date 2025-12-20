import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi, type OrderSummaryDto, type OrderItem } from '../services/order-api';
import './OrdersPage.css';

const OrdersPage = () => {
    const [orders, setOrders] = useState<OrderSummaryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});
    const [orderPhotos, setOrderPhotos] = useState<Record<number, OrderItem[]>>({});
    const [fetchingPhotos, setFetchingPhotos] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await orderApi.getMyOrders();
                setOrders(response.content);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const togglePhotos = async (orderId: number) => {
        if (expandedOrders[orderId]) {
            setExpandedOrders(prev => ({ ...prev, [orderId]: false }));
            return;
        }

        setExpandedOrders(prev => ({ ...prev, [orderId]: true }));

        if (!orderPhotos[orderId] && !fetchingPhotos[orderId]) {
            try {
                setFetchingPhotos(prev => ({ ...prev, [orderId]: true }));
                const response = await orderApi.getOrderById(orderId);
                setOrderPhotos(prev => ({ ...prev, [orderId]: response.items }));
            } catch (err) {
                console.error('Failed to fetch order photos:', err);
            } finally {
                setFetchingPhotos(prev => ({ ...prev, [orderId]: false }));
            }
        }
    };

    const getStatusClass = (status: string) => {
        switch (status.toUpperCase()) {
            case 'COMPLETED': return 'status-completed';
            case 'PENDING': return 'status-pending';
            case 'PROCESSING': return 'status-processing';
            case 'CANCELLED': return 'status-cancelled';
            case 'REFUNDED': return 'status-refunded';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="orders-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading your orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-page">
                <div className="container">
                    <div className="error-container">
                        <p className="error-message">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="orders-page">
                <div className="container">
                    <div className="orders-header">
                        <h1>My Orders</h1>
                        <p>Track and manage your photo purchases</p>
                    </div>
                    <div className="empty-state">
                        <p>No orders found. Start exploring our amazing wildlife photography collection!</p>
                        <Link to="/explore" className="btn btn-primary">
                            Explore Photos
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="container">
                <div className="orders-header">
                    <h1>My Orders</h1>
                    <p>Track and manage your photo purchases</p>
                </div>

                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-item-wrapper">
                            <div className="order-card-row">
                                <div className="order-main-info">
                                    <div className="order-primary-details">
                                        <div className="order-id-group">
                                            <h3>Order #{order.orderNumber}</h3>
                                            <span className="order-date">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="order-secondary-details">
                                        <div className="order-items-summary">
                                            <span className="item-count">
                                                📦 {order.itemCount} {order.itemCount === 1 ? 'Item' : 'Items'}
                                            </span>
                                            {order.itemCount > 1 && (
                                                <button
                                                    className="view-photos-toggle"
                                                    onClick={() => togglePhotos(order.id)}
                                                >
                                                    {expandedOrders[order.id] ? 'Hide photos' : 'View all photos'}
                                                </button>
                                            )}
                                        </div>
                                        <span className="order-price">${order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="order-thumbnail-preview">
                                    {order.firstPhotoThumbnail ? (
                                        <img
                                            src={order.firstPhotoThumbnail}
                                            alt={`Order ${order.orderNumber}`}
                                            className="row-thumbnail"
                                        />
                                    ) : (
                                        <div className="row-thumbnail-placeholder">📦</div>
                                    )}
                                </div>

                                <div className="order-row-actions">
                                    <Link to={`/orders/${order.id}`} className="btn btn-ghost btn-sm">
                                        View Details
                                    </Link>
                                    {order.status.toUpperCase() === 'COMPLETED' && (
                                        <button className="btn btn-primary btn-sm">
                                            Download
                                        </button>
                                    )}
                                </div>
                            </div>

                            {expandedOrders[order.id] && (
                                <div className="order-expanded-photos glass">
                                    {fetchingPhotos[order.id] ? (
                                        <div className="mini-loader">
                                            <div className="spinner-sm"></div>
                                            <span>Fetching photos...</span>
                                        </div>
                                    ) : (
                                        <div className="photos-strip">
                                            {orderPhotos[order.id]?.map((item) => (
                                                <div key={item.id} className="photo-item">
                                                    <img src={item.photoThumbnailUrl} alt={item.photoTitle} />
                                                    <span className="photo-title">{item.photoTitle}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
