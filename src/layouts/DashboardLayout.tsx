import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import type { SidebarItem } from '../components/Sidebar/Sidebar';
import DashboardHeader from '../components/DashboardHeader/DashboardHeader';
import type { UserMenuItem } from '../components/DashboardHeader/DashboardHeader';
import { authApi, logout } from '../services/api';
import './DashboardLayout.css';

interface DashboardLayoutProps {
    userType?: 'buyer' | 'photographer';
}

const DashboardLayout = ({ userType = 'buyer' }: DashboardLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        setUser(currentUser);
    }, []);

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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userMenuItems: UserMenuItem[] = [
        {
            label: 'Settings',
            icon: '⚙️',
            onClick: () => {
                navigate(userType === 'photographer' ? '/photographer/settings' : '/dashboard/settings');
                setUserMenuOpen(false);
            }
        },
        {
            label: 'Profile',
            icon: '👤',
            onClick: () => {
                navigate(userType === 'photographer' ? '/photographer/dashboard' : '/dashboard');
                setUserMenuOpen(false);
            }
        },
        { label: '', icon: '', onClick: () => { }, className: 'divider' },
        {
            label: 'Logout',
            icon: '🚪',
            onClick: handleLogout,
            className: 'logout'
        }
    ];

    const buyerMenuItems: SidebarItem[] = [
        { path: '/dashboard', label: 'Overview', icon: '📊' },
        { path: '/dashboard/purchases', label: 'My Purchases', icon: '🛍️' },
        { path: '/dashboard/favorites', label: 'Favorites', icon: '❤️' },
        { path: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
    ];

    const photographerMenuItems: SidebarItem[] = [
        { path: '/photographer/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/photographer/upload', label: 'Upload Photo', icon: '📤' },
        { path: '/photographer/portfolio', label: 'My Portfolio', icon: '🖼️' },
        { path: '/photographer/sales', label: 'Sales', icon: '📈' },
        { path: '/photographer/earnings', label: 'Earnings', icon: '💰' },
    ];

    const menuItems = userType === 'photographer' ? photographerMenuItems : buyerMenuItems;

    return (
        <div className="dashboard-layout">
            <Sidebar
                items={menuItems}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                brandName="Ceylon Wild"
                variant={userType === 'photographer' ? 'admin' : 'default'}
            />

            <div className="dashboard-main">
                <DashboardHeader
                    title={userType === 'photographer' ? 'Photographer Panel' : 'My Dashboard'}
                    onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
                    notifications={3}
                    userInfo={{
                        name: user ? `${user.firstName} ${user.lastName}` : 'User',
                        role: user?.role || (userType === 'photographer' ? 'Photographer' : 'Member')
                    }}
                    variant={userType === 'photographer' ? 'admin' : 'default'}
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

export default DashboardLayout;
