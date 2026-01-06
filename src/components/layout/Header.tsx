import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { authApi, type User } from '../../services/api.ts';
import { useCart } from '../../contexts/CartContext.tsx';
import { Button, Text } from '../../components/ui';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Get cart item count
    const { getItemCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(globalThis.scrollY > 50);
        };

        globalThis.addEventListener('scroll', handleScroll);
        return () => globalThis.removeEventListener('scroll', handleScroll);
    }, []);

    // Check authentication status on component mount
    useEffect(() => {
        const checkAuth = () => {
            const authenticated = authApi.isAuthenticated();
            const currentUser = authApi.getCurrentUser();
            setIsAuthenticated(authenticated);
            setUser(currentUser);
        };

        checkAuth();

        // Listen for storage changes (for cross-tab synchronization)
        globalThis.addEventListener('storage', checkAuth);
        return () => globalThis.removeEventListener('storage', checkAuth);
    }, []);

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
        };

        if (profileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileMenuOpen]);

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchOpen(false);
            }
        };

        if (searchOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchOpen]);

    // Focus search input when opened
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    const handleLogout = () => {
        authApi.logout();
        setIsAuthenticated(false);
        setUser(null);
        setProfileMenuOpen(false);
        navigate('/');
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const toggleSearch = () => {
        setSearchOpen(!searchOpen);
        if (searchOpen) {
            setSearchQuery('');
        }
    };

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <nav className="nav">
                    <Link to="/" className="nav-brand">
                        <svg className="logo-icon" viewBox="0 0 40 40" fill="none">
                            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
                            <path d="M20 10 L28 20 L20 30 L12 20 Z" fill="currentColor" />
                        </svg>
                        <Text as="span" className="brand-name" weight="semibold">
                            Ceylon Wild Capture
                        </Text>
                    </Link>

                    <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                        <li><Link to="/" className="nav-link">Home</Link></li>
                        <li><Link to="/explore" className="nav-link">Explore</Link></li>
                        <li><Link to="/about" className="nav-link">About</Link></li>
                        <li><Link to="/contact" className="nav-link">Contact Us</Link></li>
                    </ul>

                    <div className="nav-actions">
                        <div className="search-wrapper" ref={searchRef}>
                            <button
                                className="icon-btn search-btn"
                                onClick={toggleSearch}
                                aria-label="Search"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                {searchOpen && <span className="active-dot"></span>}
                            </button>

                            {searchOpen && (
                                <form className="search-dropdown" onSubmit={handleSearchSubmit}>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        className="search-input"
                                        placeholder="Search breathtaking moments..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                    />
                                    <button type="submit" className="search-submit-btn">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                    </button>
                                </form>
                            )}
                        </div>

                        {isAuthenticated && (
                            <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M2 2h2l3.6 12h8.8l3.6-8H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="9" cy="18" r="1" fill="currentColor" />
                                    <circle cx="16" cy="18" r="1" fill="currentColor" />
                                </svg>
                                {getItemCount() > 0 && (
                                    <Text as="span" className="cart-badge" size="xs" weight="bold">
                                        {getItemCount()}
                                    </Text>
                                )}
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <div className="profile-menu-wrapper" ref={profileMenuRef}>
                                <button
                                    className="icon-btn profile-btn"
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    aria-label="Profile menu"
                                >
                                    {user?.profileImageUrl ? (
                                        <img
                                            src={user.profileImageUrl}
                                            alt={user.firstName}
                                            className="profile-image"
                                        />
                                    ) : (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                                            <path d="M5 20c0-4 3-7 7-7s7 3 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    )}
                                </button>

                                {profileMenuOpen && (
                                    <div className="profile-dropdown">
                                        <div className="profile-dropdown-header">
                                            <Text as="p" className="profile-name" weight="semibold" color="white">
                                                {user?.firstName} {user?.lastName}
                                            </Text>
                                            <Text as="p" className="profile-email" size="sm" color="muted">
                                                {user?.email}
                                            </Text>
                                        </div>
                                        <div className="profile-dropdown-divider"></div>
                                        <Link
                                            to="/orders"
                                            className="profile-dropdown-item"
                                            onClick={() => setProfileMenuOpen(false)}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M9 2L7 6H3L8 10L6 14L11 10L16 14L14 10L19 6H15L13 2H9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M6 18h12v4H6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span>My Orders</span>
                                        </Link>
                                        {user?.role === 'ADMIN' && (
                                            <Link
                                                to="/admin/dashboard"
                                                className="profile-dropdown-item"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                    <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        )}
                                        {user?.role === 'PHOTOGRAPHER' && (
                                            <Link
                                                to="/photographer/dashboard"
                                                className="profile-dropdown-item"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                    <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                                                    <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2" />
                                                    <path d="M7 6L9 2h6l2 4" stroke="currentColor" strokeWidth="2" />
                                                </svg>
                                                <span>Photographer Dashboard</span>
                                            </Link>
                                        )}
                                        <Link
                                            to="/settings"
                                            className="profile-dropdown-item"
                                            onClick={() => setProfileMenuOpen(false)}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                                <path d="M12 1v6m0 6v6M1 12h6m6 0h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                <path d="M4.22 4.22l4.24 4.24m7.08 0l4.24-4.24M4.22 19.78l4.24-4.24m7.08 0l4.24 4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            <span>Settings</span>
                                        </Link>
                                        <div className="profile-dropdown-divider"></div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="profile-dropdown-item logout-btn"
                                            onClick={handleLogout}
                                            icon={
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            }
                                        >
                                            Log Out
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login">
                                <Button variant="primary" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                        )}

                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                            )}
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
