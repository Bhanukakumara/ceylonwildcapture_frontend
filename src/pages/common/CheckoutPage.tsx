import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext.tsx';
import { authApi } from '../../services/api.ts';
import { orderApi, type BillingInfo, type OrderItemRequest } from '../../services/order-api.ts';
import { paymentApi } from '../../services/payment-api.ts';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, getTotalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);

    const [billingInfo, setBillingInfo] = useState<BillingInfo>({
        billingName: '',
        billingEmail: '',
        billingAddress: '',
        billingCity: '',
        billingState: '',
        billingCountry: 'Sri Lanka',
        billingZip: ''
    });

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        if (!currentUser) {
            navigate('/login?redirect=/checkout');
            return;
        }
        setBillingInfo(prev => ({
            ...prev,
            billingName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
            billingEmail: currentUser.email
        }));

        if (items.length === 0 && !orderSuccess) {
            navigate('/cart');
        }
    }, [navigate, items.length, orderSuccess]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBillingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Prepare order items
            const orderItems: OrderItemRequest[] = items.map(item => ({
                photoId: item.photoId,
                price: item.price
            }));

            // 2. Create Order
            const orderResponse = await orderApi.createOrder({
                items: orderItems,
                billingInfo: billingInfo
            });

            // 3. Create Payment Intent
            const paymentResponse = await paymentApi.createPaymentIntent({
                orderId: orderResponse.id,
                amount: orderResponse.totalAmount,
                currency: 'USD',
                provider: 'STRIPE',
                returnUrl: `${window.location.origin}/orders`,
                cancelUrl: `${window.location.origin}/checkout`
            });

            // 4. Redirect to Stripe
            if (paymentResponse.redirectUrl) {
                window.location.href = paymentResponse.redirectUrl;
            } else {
                setOrderNumber(orderResponse.orderNumber);
                setOrderSuccess(true);
                clearCart();
            }

        } catch (err: any) {
            setError(err.message || 'Failed to process order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="checkout-page">
                <div className="container mini-container">
                    <div className="success-card glass">
                        <div className="success-icon">✓</div>
                        <h1>Order Successful!</h1>
                        <p>Thank you for your purchase. Your order <strong>{orderNumber}</strong> has been placed successfully.</p>
                        <p>A confirmation email has been sent to <strong>{billingInfo.billingEmail}</strong> with details on how to download your photos.</p>
                        <div className="success-actions">
                            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                            <Link to="/explore" className="btn btn-ghost">Continue Exploring</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const subtotal = getTotalPrice();
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <div className="checkout-page">
            <div className="container">
                <div className="checkout-header">
                    <h1>Checkout</h1>
                    <p className="checkout-subtitle">Securely complete your purchase</p>
                </div>

                <form onSubmit={handleSubmit} className="checkout-layout">
                    <div className="checkout-main">
                        <div className="checkout-section glass">
                            <h2>Billing Information</h2>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label htmlFor="billingName">Full Name</label>
                                    <input
                                        type="text"
                                        id="billingName"
                                        name="billingName"
                                        value={billingInfo.billingName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label htmlFor="billingEmail">Email Address</label>
                                    <input
                                        type="email"
                                        id="billingEmail"
                                        name="billingEmail"
                                        value={billingInfo.billingEmail}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label htmlFor="billingAddress">Street Address</label>
                                    <input
                                        type="text"
                                        id="billingAddress"
                                        name="billingAddress"
                                        value={billingInfo.billingAddress}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="123 Wild Street"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="billingCity">City</label>
                                    <input
                                        type="text"
                                        id="billingCity"
                                        name="billingCity"
                                        value={billingInfo.billingCity}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Colombo"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="billingZip">ZIP / Postal Code</label>
                                    <input
                                        type="text"
                                        id="billingZip"
                                        name="billingZip"
                                        value={billingInfo.billingZip}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="00100"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="billingState">State / Province</label>
                                    <input
                                        type="text"
                                        id="billingState"
                                        name="billingState"
                                        value={billingInfo.billingState}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Western"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="billingCountry">Country</label>
                                    <select
                                        id="billingCountry"
                                        name="billingCountry"
                                        value={billingInfo.billingCountry}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="Sri Lanka">Sri Lanka</option>
                                        <option value="United States">United States</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Australia">Australia</option>
                                        <option value="India">India</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="checkout-section glass">
                            <h2>Payment Method</h2>
                            <p className="payment-notice">This is a secure 256-bit SSL encrypted payment.</p>
                            <div className="payment-options">
                                <label className="payment-option active">
                                    <input type="radio" name="payment" defaultChecked />
                                    <div className="payment-option-content">
                                        <span className="payment-option-icon">💳</span>
                                        <div className="payment-option-text">
                                            <span className="payment-option-title">Credit / Debit Card</span>
                                            <span className="payment-option-subtitle">Stripe Secure Payment</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="checkout-sidebar">
                        <div className="order-summary glass">
                            <h2>Order Summary</h2>
                            <div className="summary-items">
                                {items.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <div className="summary-item-image">
                                            <img src={item.photoImageUrl} alt={item.photoTitle} />
                                        </div>
                                        <div className="summary-item-details">
                                            <h3>{item.photoTitle}</h3>
                                            <p>Standard License</p>
                                            <span className="summary-item-price">${item.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-totals">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tax (10%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <button
                                type="submit"
                                className="btn btn-primary complete-purchase-btn"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                            </button>

                            <p className="terms-notice">
                                By completing your purchase, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/license">License Agreement</Link>.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
