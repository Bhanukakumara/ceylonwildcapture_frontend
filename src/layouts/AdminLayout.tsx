import { Outlet, NavLink } from 'react-router-dom';
import { useState } from 'react';
import './AdminLayout.css';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const adminMenuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/users', label: 'Users', icon: '👥' },
        { path: '/admin/photographers', label: 'Photographers', icon: '👨‍🎨' },
        { path: '/admin/photos', label: 'Photos', icon: '🖼️' },
        { path: '/admin/categories', label: 'Categories', icon: '📁' },
        { path: '/admin/sales', label: 'Sales', icon: '💰' },
        { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
        { path: '/admin/audit-logs', label: 'Audit Logs', icon: '📋' },
        { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className="admin-layout">
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="admin-sidebar-header">
                    <svg className="admin-logo" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
                        <path d="M20 10 L28 20 L20 30 L12 20 Z" fill="currentColor" />
                    </svg>
                    {sidebarOpen && (
                        <div className="admin-brand-text">
                            <span className="admin-brand-name">Ceylon Wild</span>
                            <span className="admin-badge">Admin</span>
                        </div>
                    )}
                </div>

                <nav className="admin-nav">
                    {adminMenuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `admin-nav-link ${isActive ? 'active' : ''}`
                            }
                            end={item.path === '/admin/dashboard'}
                        >
                            <span className="admin-nav-icon">{item.icon}</span>
                            {sidebarOpen && <span className="admin-nav-label">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <button
                    className="admin-sidebar-toggle"
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

            <div className="admin-main">
                <header className="admin-header">
                    <div className="admin-header-left">
                        <button
                            className="admin-mobile-menu-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        <h1 className="admin-title">Admin Panel</h1>
                    </div>

                    <div className="admin-header-right">
                        <button className="admin-header-btn" aria-label="Notifications">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 2a6 6 0 016 6v3.586l1.707 1.707A1 1 0 0117 15H3a1 1 0 01-.707-1.707L4 11.586V8a6 6 0 016-6z" stroke="currentColor" strokeWidth="2" />
                                <path d="M8 15v1a2 2 0 004 0v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span className="admin-notification-badge">5</span>
                        </button>

                        <div className="admin-user-menu">
                            <div className="admin-user-avatar">
                                <span>AD</span>
                            </div>
                            <div className="admin-user-info">
                                <div className="admin-user-name">Admin User</div>
                                <div className="admin-user-role">Administrator</div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
