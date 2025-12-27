import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import type { SidebarItem } from '../components/Sidebar/Sidebar';
import DashboardHeader from '../components/DashboardHeader/DashboardHeader';
import './DashboardLayout.css';

interface DashboardLayoutProps {
    userType?: 'buyer' | 'photographer';
}

const DashboardLayout = ({ userType = 'buyer' }: DashboardLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

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
                        name: 'John Doe',
                        role: userType === 'photographer' ? 'Photographer' : 'Member'
                    }}
                    variant={userType === 'photographer' ? 'admin' : 'default'}
                />

                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
