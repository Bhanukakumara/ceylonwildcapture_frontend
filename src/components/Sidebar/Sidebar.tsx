import { NavLink, Link } from 'react-router-dom';
import '../../layouts/DashboardLayout.css';

export interface SidebarItem {
    path: string;
    label: string;
    icon: string;
}

interface SidebarProps {
    items: SidebarItem[];
    isOpen: boolean;
    onToggle: () => void;
    brandName: string;
    variant?: 'default' | 'admin';
    logoLink?: string;
}

const Sidebar = ({
    items,
    isOpen,
    onToggle,
    brandName,
    variant = 'default',
    logoLink = '/'
}: SidebarProps) => {
    // Helper to close sidebar on mobile after clicking an item or backdrop
    const handleCloseMobile = () => {
        if (window.innerWidth <= 968 && isOpen) {
            onToggle();
        }
    };

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={`sidebar-backdrop ${isOpen ? 'show' : ''}`}
                onClick={handleCloseMobile}
            />

            <aside className={`sidebar ${variant} ${isOpen ? 'open' : 'closed'}`}>
                <Link to={logoLink} className="sidebar-header" onClick={handleCloseMobile}>
                    <svg className="sidebar-logo" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
                        <path d="M20 10 L28 20 L20 30 L12 20 Z" fill="currentColor" />
                    </svg>
                    {isOpen && (
                        <div className="sidebar-brand-text">
                            <span className="sidebar-brand-name">{brandName}</span>
                        </div>
                    )}
                </Link>

                <nav className="sidebar-nav">
                    {items.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'active' : ''}`
                            }
                            end={item.path === '/dashboard' || item.path === '/photographer/dashboard' || item.path === '/admin/dashboard'}
                            onClick={handleCloseMobile}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {isOpen && <span className="sidebar-label">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <button
                    className="sidebar-toggle"
                    onClick={onToggle}
                    aria-label="Toggle sidebar"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                            d={isOpen ? "M15 5L5 15M5 5l10 10" : "M3 10h14M3 5h14M3 15h14"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            </aside>
        </>
    );
};

export default Sidebar;
