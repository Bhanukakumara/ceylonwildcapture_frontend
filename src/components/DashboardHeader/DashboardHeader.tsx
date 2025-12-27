import React from 'react';
import '../../layouts/DashboardLayout.css';

export interface UserInfo {
    name: string;
    role: string;
    avatar?: string;
}

export interface UserMenuItem {
    label: string;
    icon: string;
    onClick: () => void;
    className?: string;
}

interface DashboardHeaderProps {
    title: string;
    onMenuToggle: () => void;
    notifications?: number;
    userInfo: UserInfo;
    variant?: 'default' | 'admin';
    userMenuOpen?: boolean;
    onUserMenuToggle?: () => void;
    userMenuItems?: UserMenuItem[];
}

const DashboardHeader = ({
    title,
    onMenuToggle,
    notifications = 0,
    userInfo,
    variant = 'default',
    userMenuOpen = false,
    onUserMenuToggle,
    userMenuItems = []
}: DashboardHeaderProps) => {
    return (
        <header className={`dashboard-header ${variant}`}>
            <div className="header-left">
                <button
                    className="mobile-menu-btn"
                    onClick={onMenuToggle}
                    aria-label="Open menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                <h1 className="header-title">{title}</h1>
            </div>

            <div className="header-right">
                <button className="header-icon-btn" aria-label="Notifications">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2a6 6 0 016 6v3.586l1.707 1.707A1 1 0 0117 15H3a1 1 0 01-.707-1.707L4 11.586V8a6 6 0 016-6z" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 15v1a2 2 0 004 0v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {notifications > 0 && <span className="notification-badge">{notifications}</span>}
                </button>

                <div
                    className={`user-menu ${onUserMenuToggle ? 'clickable' : ''}`}
                    onClick={onUserMenuToggle}
                >
                    <div className="user-avatar">
                        {userInfo.avatar ? (
                            <img src={userInfo.avatar} alt={userInfo.name} />
                        ) : (
                            <span>{userInfo.name.split(' ').map(n => n[0]).join('')}</span>
                        )}
                    </div>
                    <div className="user-info">
                        <div className="user-name">{userInfo.name}</div>
                        <div className="user-role">{userInfo.role}</div>
                    </div>
                    {onUserMenuToggle && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`dropdown-icon ${userMenuOpen ? 'open' : ''}`}>
                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}

                    {userMenuOpen && userMenuItems.length > 0 && (
                        <div className="user-dropdown">
                            {userMenuItems.map((item, index) => (
                                <React.Fragment key={index}>
                                    {item.className === 'divider' ? (
                                        <div className="dropdown-divider" />
                                    ) : (
                                        <button
                                            className={`dropdown-item ${item.className || ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                item.onClick();
                                            }}
                                        >
                                            <span>{item.icon}</span>
                                            <span>{item.label}</span>
                                        </button>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
