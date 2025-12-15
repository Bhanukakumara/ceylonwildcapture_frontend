import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <nav className="nav">
                    <div className="nav-brand">
                        <svg className="logo-icon" viewBox="0 0 40 40" fill="none">
                            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
                            <path d="M20 10 L28 20 L20 30 L12 20 Z" fill="currentColor" />
                        </svg>
                        <span className="brand-name">Ceylon Wild Capture</span>
                    </div>

                    <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                        <li><Link to="/" className="nav-link">Home</Link></li>
                        <li><Link to="/explore" className="nav-link">Explore</Link></li>
                        <li><Link to="/category/all" className="nav-link">Categories</Link></li>
                        <li><Link to="/photographer/featured" className="nav-link">Photographers</Link></li>
                        <li><Link to="/about" className="nav-link">About</Link></li>
                        <li><Link to="/admin/dashboard" className="nav-link admin-link">Admin</Link></li>
                    </ul>

                    <div className="nav-actions">
                        <button className="icon-btn" aria-label="Search">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                                <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        <button className="icon-btn cart-btn" aria-label="Cart">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M2 2h2l3.6 12h8.8l3.6-8H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="9" cy="18" r="1" fill="currentColor" />
                                <circle cx="16" cy="18" r="1" fill="currentColor" />
                            </svg>
                            <span className="cart-badge">3</span>
                        </button>
                        <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>

                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
