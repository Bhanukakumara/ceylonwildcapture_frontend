import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const { items, removeFromCart, getTotalPrice, getItemCount } = useCart();

    const subtotal = getTotalPrice();
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const handleCheckout = () => {
        if (items.length > 0) {
            navigate('/checkout');
        }
    };

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="empty-cart-icon">
                            <path d="M3 3h2l3.6 12h8.8l3.6-8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="10" cy="20" r="1.5" fill="currentColor" />
                            <circle cx="17" cy="20" r="1.5" fill="currentColor" />
                        </svg>
                        <h2>Your cart is empty</h2>
                        <p>Discover amazing wildlife photography and add them to your cart</p>
                        <Link to="/explore" className="btn btn-primary">
                            Explore Photos
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <p className="cart-count">{getItemCount()} {getItemCount() === 1 ? 'item' : 'items'}</p>
                </div>

                <div className="cart-layout">
                    <div className="cart-items">
                        {items.map((item) => (
                            <div key={item.id} className="cart-item glass">
                                <div className="cart-item-image">
                                    <img src={item.photoImageUrl} alt={item.photoTitle} />
                                </div>
                                <div className="cart-item-details">
                                    <div className="cart-item-info">
                                        <h3>{item.photoTitle}</h3>
                                        <p className="photographer-name">by {item.photographerName}</p>
                                        <p className="license-type">
                                            <span className="license-badge">
                                                {item.license === 'PERSONAL' && '📄 Personal Use'}
                                                {item.license === 'COMMERCIAL' && '💼 Commercial Use'}
                                                {item.license === 'EXTENDED' && '⭐ Extended License'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="cart-item-actions">
                                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFromCart(item.id)}
                                        aria-label="Remove item"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary glass">
                        <h2>Order Summary</h2>
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
                        <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                        <Link to="/explore" className="continue-shopping">
                            Continue Shopping
                        </Link>

                        <div className="payment-methods">
                            <p className="payment-label">We accept:</p>
                            <div className="payment-icons">
                                <div className="payment-icon">💳</div>
                                <div className="payment-icon">🏦</div>
                                <div className="payment-icon">📱</div>
                            </div>
                        </div>

                        <div className="security-badge">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2" />
                            </svg>
                            <span>Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
