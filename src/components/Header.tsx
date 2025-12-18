import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { authApi, type User } from '../services/api';

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
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
                        <div className="search-wrapper" ref={searchRef}>
                            <button
                                className="icon-btn"
                                aria-label="Search"
                                onClick={toggleSearch}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                                    <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>

                            {searchOpen && (
                                <form onSubmit={handleSearchSubmit} className="search-dropdown">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        className="search-input"
                                        placeholder="Search photos, photographers..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button type="submit" className="search-submit-btn" aria-label="Submit search">
                                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                                            <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
                                <span className="cart-badge">3</span>
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
                                            <p className="profile-name">{user?.firstName} {user?.lastName}</p>
                                            <p className="profile-email">{user?.email}</p>
                                        </div>
                                        <div className="profile-dropdown-divider"></div>
                                        <Link
                                            to="/dashboard/purchases"
                                            className="profile-dropdown-item"
                                            onClick={() => setProfileMenuOpen(false)}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M9 2L7 6H3L8 10L6 14L11 10L16 14L14 10L19 6H15L13 2H9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M6 18h12v4H6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span>My Orders</span>
                                        </Link>
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
                                        <button
                                            className="profile-dropdown-item logout-btn"
                                            onClick={handleLogout}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
                        )}

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
