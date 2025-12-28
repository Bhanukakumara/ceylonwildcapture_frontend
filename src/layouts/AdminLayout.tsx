import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { logout, authApi } from '../services/api';
import Sidebar from '../components/Sidebar/Sidebar';
import type { SidebarItem } from '../components/Sidebar/Sidebar';
import DashboardHeader from '../components/DashboardHeader/DashboardHeader';
import type { UserMenuItem } from '../components/DashboardHeader/DashboardHeader';
import './DashboardLayout.css';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 968);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        setUser(currentUser);

        const handleResize = () => {
            if (window.innerWidth <= 968) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (userMenuOpen && !target.closest('.user-menu')) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [userMenuOpen]);

    const adminMenuItems: SidebarItem[] = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/users', label: 'Users', icon: '👥' },
        { path: '/admin/photographers', label: 'Photographers', icon: '👨‍🎨' },
        { path: '/admin/photos', label: 'Photos', icon: '🖼️' },
        { path: '/admin/categories', label: 'Categories', icon: '📁' },
        { path: '/admin/orders', label: 'Orders', icon: '🛒' },
        { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
        { path: '/admin/reports', label: 'Reports', icon: '📄' },
        { path: '/admin/audit-logs', label: 'Audit Logs', icon: '📋' },
        { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ];

    const handleLogout = () => {
        // Call logout service to clear all authentication data
        logout();
        // Redirect to login page
        navigate('/login');
    };

    const userMenuItems: UserMenuItem[] = [
        {
            label: 'Settings',
            icon: '⚙️',
            onClick: () => { navigate('/admin/settings'); setUserMenuOpen(false); }
        },
        {
            label: 'Profile',
            icon: '👤',
            onClick: () => { navigate('/admin/dashboard'); setUserMenuOpen(false); }
        },
        { label: '', icon: '', onClick: () => { }, className: 'divider' },
        {
            label: 'Logout',
            icon: '🚪',
            onClick: handleLogout,
            className: 'logout'
        }
    ];

    return (
        <div className="dashboard-layout">
            <Sidebar
                items={adminMenuItems}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                brandName="Ceylon Wild"
                variant="admin"
            />

            <div className="dashboard-main">
                <DashboardHeader
                    title="Admin Panel"
                    onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
                    notifications={5}
                    userInfo={{
                        name: user ? `${user.firstName} ${user.lastName}` : 'Admin',
                        role: user?.role || 'Administrator'
                    }}
                    variant="admin"
                    userMenuOpen={userMenuOpen}
                    onUserMenuToggle={() => setUserMenuOpen(!userMenuOpen)}
                    userMenuItems={userMenuItems}
                />

                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
