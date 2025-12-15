import { useState } from 'react';
import '../dashboard/Dashboard.css';
import './AdminDashboard.css';
import './UsersPage.css';

interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role: 'ADMIN' | 'PHOTOGRAPHER' | 'BUYER';
    isActive: boolean;
    emailVerified: boolean;
    profileImageUrl?: string;
    createdAt: string;
    lastLogin?: string;
}

const UsersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('ALL');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Mock data - replace with API calls
    const mockUsers: User[] = [
        {
            id: 1,
            username: 'johndoe',
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '+94771234567',
            role: 'PHOTOGRAPHER',
            isActive: true,
            emailVerified: true,
            createdAt: '2024-01-15T10:30:00',
            lastLogin: '2024-12-15T08:45:00'
        },
        {
            id: 2,
            username: 'janesmith',
            email: 'jane.smith@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            phoneNumber: '+94772345678',
            role: 'BUYER',
            isActive: true,
            emailVerified: true,
            createdAt: '2024-02-20T14:15:00',
            lastLogin: '2024-12-14T16:20:00'
        },
        {
            id: 3,
            username: 'mikejohnson',
            email: 'mike.johnson@example.com',
            firstName: 'Mike',
            lastName: 'Johnson',
            phoneNumber: '+94773456789',
            role: 'PHOTOGRAPHER',
            isActive: true,
            emailVerified: false,
            createdAt: '2024-03-10T09:00:00',
            lastLogin: '2024-12-13T12:30:00'
        },
        {
            id: 4,
            username: 'sarahwilliams',
            email: 'sarah.williams@example.com',
            firstName: 'Sarah',
            lastName: 'Williams',
            role: 'BUYER',
            isActive: false,
            emailVerified: true,
            createdAt: '2024-01-05T11:45:00'
        },
        {
            id: 5,
            username: 'admin',
            email: 'admin@ceylonwildcapture.com',
            firstName: 'System',
            lastName: 'Administrator',
            phoneNumber: '+94770000000',
            role: 'ADMIN',
            isActive: true,
            emailVerified: true,
            createdAt: '2024-01-01T00:00:00',
            lastLogin: '2024-12-15T09:00:00'
        }
    ];

    const stats = {
        totalUsers: 1248,
        activeUsers: 1156,
        photographers: 342,
        buyers: 901,
        admins: 5,
        suspended: 92,
        unverified: 45
    };

    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = searchTerm === '' ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'ALL' ||
            (statusFilter === 'ACTIVE' && user.isActive) ||
            (statusFilter === 'INACTIVE' && !user.isActive) ||
            (statusFilter === 'VERIFIED' && user.emailVerified) ||
            (statusFilter === 'UNVERIFIED' && !user.emailVerified);

        return matchesSearch && matchesRole && matchesStatus;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleViewDetails = (user: User) => {
        setSelectedUser(user);
        setShowDetailsModal(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleDeleteUser = (user: User) => {
        if (confirm(`Are you sure you want to deactivate ${user.username}?`)) {
            console.log('Deactivate user:', user.id);
            // API call would go here
        }
    };

    const handleActivateUser = (userId: number) => {
        console.log('Activate user:', userId);
        // API call would go here
    };

    const handleVerifyEmail = (userId: number) => {
        console.log('Verify email for user:', userId);
        // API call would go here
    };

    return (
        <div className="users-page">
            <div className="page-header">
                <div>
                    <h2>User Management</h2>
                    <p className="page-subtitle">Manage all registered users on the platform</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Create User
                </button>
            </div>

            {/* Statistics Grid */}
            <div className="stats-grid">
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.activeUsers.toLocaleString()}</div>
                        <div className="stat-label">Active Users</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.photographers}</div>
                        <div className="stat-label">Photographers</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.buyers}</div>
                        <div className="stat-label">Buyers</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.suspended}</div>
                        <div className="stat-label">Suspended</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.unverified}</div>
                        <div className="stat-label">Unverified</div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="admin-card">
                <div className="admin-table-header">
                    <input
                        type="text"
                        placeholder="Search by username, email, or name..."
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="admin-filter-select"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="ALL">All Roles</option>
                        <option value="ADMIN">Admins</option>
                        <option value="PHOTOGRAPHER">Photographers</option>
                        <option value="BUYER">Buyers</option>
                    </select>
                    <select
                        className="admin-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="VERIFIED">Email Verified</option>
                        <option value="UNVERIFIED">Email Unverified</option>
                    </select>
                </div>

                {/* Users Table */}
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Email Verified</th>
                                <th>Last Login</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-small">
                                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                            </div>
                                            <div className="user-info-cell">
                                                <div className="user-name">{user.firstName} {user.lastName}</div>
                                                <div className="user-username">@{user.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="email-cell">{user.email}</td>
                                    <td>{user.phoneNumber || '-'}</td>
                                    <td>
                                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${user.isActive ? 'active' : 'suspended'}`}>
                                            {user.isActive ? 'Active' : 'Suspended'}
                                        </span>
                                    </td>
                                    <td>
                                        {user.emailVerified ? (
                                            <span className="verified-badge">✓ Verified</span>
                                        ) : (
                                            <span className="unverified-badge">✗ Unverified</span>
                                        )}
                                    </td>
                                    <td className="date-cell">{formatDateTime(user.lastLogin)}</td>
                                    <td className="date-cell">{formatDate(user.createdAt)}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                className="action-btn"
                                                title="View Details"
                                                onClick={() => handleViewDetails(user)}
                                            >
                                                👁️
                                            </button>
                                            <button
                                                className="action-btn"
                                                title="Edit User"
                                                onClick={() => handleEditUser(user)}
                                            >
                                                ✏️
                                            </button>
                                            {!user.emailVerified && (
                                                <button
                                                    className="action-btn"
                                                    title="Verify Email"
                                                    onClick={() => handleVerifyEmail(user.id)}
                                                >
                                                    ✉️
                                                </button>
                                            )}
                                            {user.isActive ? (
                                                <button
                                                    className="action-btn danger"
                                                    title="Deactivate"
                                                    onClick={() => handleDeleteUser(user)}
                                                >
                                                    🚫
                                                </button>
                                            ) : (
                                                <button
                                                    className="action-btn success"
                                                    title="Activate"
                                                    onClick={() => handleActivateUser(user.id)}
                                                >
                                                    ✓
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="table-pagination">
                    <div className="pagination-info">
                        Showing {filteredUsers.length} of {mockUsers.length} users
                    </div>
                    <div className="pagination-controls">
                        <button className="btn btn-ghost btn-sm">Previous</button>
                        <button className="btn btn-ghost btn-sm active">1</button>
                        <button className="btn btn-ghost btn-sm">2</button>
                        <button className="btn btn-ghost btn-sm">3</button>
                        <button className="btn btn-ghost btn-sm">Next</button>
                    </div>
                </div>
            </div>

            {/* User Details Modal */}
            {showDetailsModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>User Details</h3>
                            <button className="modal-close" onClick={() => setShowDetailsModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="user-details-grid">
                                <div className="detail-item">
                                    <label>User ID</label>
                                    <span>{selectedUser.id}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Username</label>
                                    <span>@{selectedUser.username}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Full Name</label>
                                    <span>{selectedUser.firstName} {selectedUser.lastName}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Email</label>
                                    <span>{selectedUser.email}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Phone Number</label>
                                    <span>{selectedUser.phoneNumber || 'Not provided'}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Role</label>
                                    <span className={`role-badge ${selectedUser.role.toLowerCase()}`}>
                                        {selectedUser.role}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <label>Account Status</label>
                                    <span className={`status-badge ${selectedUser.isActive ? 'active' : 'suspended'}`}>
                                        {selectedUser.isActive ? 'Active' : 'Suspended'}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <label>Email Verified</label>
                                    <span>{selectedUser.emailVerified ? '✓ Yes' : '✗ No'}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Joined Date</label>
                                    <span>{formatDateTime(selectedUser.createdAt)}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Last Login</label>
                                    <span>{formatDateTime(selectedUser.lastLogin)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowDetailsModal(false)}>
                                Close
                            </button>
                            <button className="btn btn-primary" onClick={() => {
                                setShowDetailsModal(false);
                                handleEditUser(selectedUser);
                            }}>
                                Edit User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit User Modal Placeholder */}
            {(showCreateModal || showEditModal) && (
                <div className="modal-overlay" onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                }}>
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{showCreateModal ? 'Create New User' : 'Edit User'}</h3>
                            <button className="modal-close" onClick={() => {
                                setShowCreateModal(false);
                                setShowEditModal(false);
                            }}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Username *</label>
                                    <input type="text" className="form-input" placeholder="johndoe" />
                                </div>
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input type="email" className="form-input" placeholder="john@example.com" />
                                </div>
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input type="text" className="form-input" placeholder="John" />
                                </div>
                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input type="text" className="form-input" placeholder="Doe" />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" className="form-input" placeholder="+94771234567" />
                                </div>
                                <div className="form-group">
                                    <label>Role *</label>
                                    <select className="form-input">
                                        <option value="BUYER">Buyer</option>
                                        <option value="PHOTOGRAPHER">Photographer</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                                {showCreateModal && (
                                    <div className="form-group full-width">
                                        <label>Password *</label>
                                        <input type="password" className="form-input" placeholder="Min 8 characters" />
                                    </div>
                                )}
                                <div className="form-group full-width">
                                    <label className="checkbox-label">
                                        <input type="checkbox" />
                                        <span>Email Verified</span>
                                    </label>
                                    <label className="checkbox-label">
                                        <input type="checkbox" defaultChecked />
                                        <span>Active Account</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => {
                                setShowCreateModal(false);
                                setShowEditModal(false);
                            }}>
                                Cancel
                            </button>
                            <button className="btn btn-primary">
                                {showCreateModal ? 'Create User' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
