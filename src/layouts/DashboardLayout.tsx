import { Outlet, NavLink } from 'react-router-dom';
import { useState } from 'react';
import './DashboardLayout.css';

interface DashboardLayoutProps {
    userType?: 'buyer' | 'photographer';
}

const DashboardLayout = ({ userType = 'buyer' }: DashboardLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const buyerMenuItems = [
        { path: '/dashboard', label: 'Overview', icon: '📊' },
        { path: '/dashboard/purchases', label: 'My Purchases', icon: '🛍️' },
        { path: '/dashboard/favorites', label: 'Favorites', icon: '❤️' },
        { path: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
    ];

    const photographerMenuItems = [
        { path: '/photographer/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/photographer/upload', label: 'Upload Photo', icon: '📤' },
        { path: '/photographer/portfolio', label: 'My Portfolio', icon: '🖼️' },
        { path: '/photographer/sales', label: 'Sales', icon: '📈' },
        { path: '/photographer/earnings', label: 'Earnings', icon: '💰' },
    ];

    const menuItems = userType === 'photographer' ? photographerMenuItems : buyerMenuItems;

    return (
        <div className="dashboard-layout">
            <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <svg className="sidebar-logo" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
                        <path d="M20 10 L28 20 L20 30 L12 20 Z" fill="currentColor" />
                    </svg>
                    {sidebarOpen && <span className="sidebar-brand">Ceylon Wild</span>}
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'active' : ''}`
                            }
                            end={item.path === '/dashboard' || item.path === '/photographer/dashboard'}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {sidebarOpen && <span className="sidebar-label">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <button
                    className="sidebar-toggle"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle sidebar"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                            d={sidebarOpen ? "M15 5L5 15M5 5l10 10" : "M3 10h14M3 5h14M3 15h14"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            </aside>

            <div className="dashboard-main">
                <header className="dashboard-header">
                    <div className="dashboard-header-left">
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        <h1 className="dashboard-title">
                            {userType === 'photographer' ? 'Photographer Dashboard' : 'My Dashboard'}
                        </h1>
                    </div>

                    <div className="dashboard-header-right">
                        <button className="header-icon-btn" aria-label="Notifications">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 2a6 6 0 016 6v3.586l1.707 1.707A1 1 0 0117 15H3a1 1 0 01-.707-1.707L4 11.586V8a6 6 0 016-6z" stroke="currentColor" strokeWidth="2" />
                                <path d="M8 15v1a2 2 0 004 0v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span className="notification-badge">3</span>
                        </button>

                        <div className="user-menu">
                            <div className="user-avatar">
                                <span>JD</span>
                            </div>
                            <div className="user-info">
                                <div className="user-name">John Doe</div>
                                <div className="user-role">{userType === 'photographer' ? 'Photographer' : 'Member'}</div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
