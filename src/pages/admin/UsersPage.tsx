import { useState, useEffect } from 'react';
import { adminUserApi, type User, type UserStats, type UserCreateRequest, handleApiError } from '../../services/api';
import '../dashboard/Dashboard.css';
import './AdminDashboard.css';
import './UsersPage.css';

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<UserStats>({
        totalUsers: 0,
        activeUsers: 0,
        photographers: 0,
        buyers: 0,
        admins: 0,
        suspended: 0,
        unverified: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('ALL');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    // Form state for create/edit
    const [formData, setFormData] = useState<UserCreateRequest>({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: 'BUYER',
        isActive: true,
        emailVerified: false,
    });

    // Load users on mount and when filters/pagination change
    useEffect(() => {
        loadUsers();
        loadStats();
    }, [currentPage, roleFilter, statusFilter]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const role = roleFilter !== 'ALL' ? roleFilter as 'ADMIN' | 'PHOTOGRAPHER' | 'BUYER' : undefined;
            const isActive = statusFilter === 'ACTIVE' ? true : statusFilter === 'INACTIVE' ? false : undefined;

            const response = await adminUserApi.getAllUsers(currentPage, pageSize, role, isActive);
            setUsers(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (err) {
            const apiError = handleApiError(err);
            setError(apiError.message);
            console.error('Failed to load users:', apiError);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await adminUserApi.getUserStats();
            setStats(statsData);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    };

    const filteredUsers = users.filter(user => {
        if (searchTerm === '') return true;

        const searchLower = searchTerm.toLowerCase();
        return (
            user.username.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.firstName.toLowerCase().includes(searchLower) ||
            user.lastName.toLowerCase().includes(searchLower)
        );
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
        setFormData({
            username: user.username,
            email: user.email,
            password: '', // Don't populate password
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber || '',
            role: user.role,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
        });
        setShowEditModal(true);
    };

    const handleDeleteUser = async (user: User) => {
        if (confirm(`Are you sure you want to deactivate ${user.username}?`)) {
            try {
                await adminUserApi.deactivateUser(user.id);
                setSuccessMessage(`User ${user.username} has been deactivated`);
                loadUsers();
                loadStats();
                setTimeout(() => setSuccessMessage(null), 3000);
            } catch (err) {
                const apiError = handleApiError(err);
                setError(apiError.message);
                setTimeout(() => setError(null), 5000);
            }
        }
    };

    const handleActivateUser = async (userId: number) => {
        try {
            await adminUserApi.activateUser(userId);
            setSuccessMessage('User has been activated');
            loadUsers();
            loadStats();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            const apiError = handleApiError(err);
            setError(apiError.message);
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleVerifyEmail = async (userId: number) => {
        try {
            await adminUserApi.verifyEmail(userId);
            setSuccessMessage('Email has been verified');
            loadUsers();
            loadStats();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            const apiError = handleApiError(err);
            setError(apiError.message);
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleCreateUser = async () => {
        try {
            setError(null);
            await adminUserApi.createUser(formData);
            setSuccessMessage('User created successfully');
            setShowCreateModal(false);
            loadUsers();
            loadStats();
            resetForm();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            const apiError = handleApiError(err);
            setError(apiError.message);
        }
    };

    const handleUpdateUser = async () => {
        if (!selectedUser) return;

        try {
            setError(null);
            await adminUserApi.updateUser(selectedUser.id, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                role: formData.role,
                isActive: formData.isActive,
                emailVerified: formData.emailVerified,
            });
            setSuccessMessage('User updated successfully');
            setShowEditModal(false);
            loadUsers();
            loadStats();
            resetForm();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            const apiError = handleApiError(err);
            setError(apiError.message);
        }
    };

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            role: 'BUYER',
            isActive: true,
            emailVerified: false,
        });
        setSelectedUser(null);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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

            {/* Success/Error Messages */}
            {successMessage && (
                <div className="alert alert-success">
                    {successMessage}
                </div>
            )}
            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

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
                        onChange={(e) => {
                            setRoleFilter(e.target.value);
                            setCurrentPage(0);
                        }}
                    >
                        <option value="ALL">All Roles</option>
                        <option value="ADMIN">Admins</option>
                        <option value="PHOTOGRAPHER">Photographers</option>
                        <option value="BUYER">Buyers</option>
                    </select>
                    <select
                        className="admin-filter-select"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(0);
                        }}
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="VERIFIED">Email Verified</option>
                        <option value="UNVERIFIED">Email Unverified</option>
                    </select>
                </div>

                {/* Users Table */}
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading users...</p>
                    </div>
                ) : (
                    <>
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
                                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} users
                            </div>
                            <div className="pagination-controls">
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                >
                                    Previous
                                </button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNum = i;
                                    if (totalPages > 5) {
                                        if (currentPage > 2) {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        if (pageNum >= totalPages) {
                                            pageNum = totalPages - 5 + i;
                                        }
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            className={`btn btn-ghost btn-sm ${currentPage === pageNum ? 'active' : ''}`}
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum + 1}
                                        </button>
                                    );
                                })}
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* User Details Modal */}
            {showDetailsModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)} role="dialog" aria-modal="true">
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

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)} role="dialog" aria-modal="true">
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Create New User</h3>
                            <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="create-username">Username *</label>
                                    <input
                                        id="create-username"
                                        type="text"
                                        className="form-input"
                                        placeholder="johndoe"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="create-email">Email *</label>
                                    <input
                                        id="create-email"
                                        type="email"
                                        className="form-input"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="create-firstName">First Name *</label>
                                    <input
                                        id="create-firstName"
                                        type="text"
                                        className="form-input"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="create-lastName">Last Name *</label>
                                    <input
                                        id="create-lastName"
                                        type="text"
                                        className="form-input"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="create-phoneNumber">Phone Number</label>
                                    <input
                                        id="create-phoneNumber"
                                        type="tel"
                                        className="form-input"
                                        placeholder="+94771234567"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="create-role">Role *</label>
                                    <select
                                        id="create-role"
                                        className="form-input"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'PHOTOGRAPHER' | 'BUYER' })}
                                    >
                                        <option value="BUYER">Buyer</option>
                                        <option value="PHOTOGRAPHER">Photographer</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label htmlFor="create-password">Password *</label>
                                    <input
                                        id="create-password"
                                        type="password"
                                        className="form-input"
                                        placeholder="Min 8 characters"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.emailVerified}
                                            onChange={(e) => setFormData({ ...formData, emailVerified: e.target.checked })}
                                        />
                                        <span>Email Verified</span>
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <span>Active Account</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => {
                                setShowCreateModal(false);
                                resetForm();
                            }}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleCreateUser}>
                                Create User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)} role="dialog" aria-modal="true">
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit User</h3>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="edit-firstName">First Name *</label>
                                    <input
                                        id="edit-firstName"
                                        type="text"
                                        className="form-input"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-lastName">Last Name *</label>
                                    <input
                                        id="edit-lastName"
                                        type="text"
                                        className="form-input"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-phoneNumber">Phone Number</label>
                                    <input
                                        id="edit-phoneNumber"
                                        type="tel"
                                        className="form-input"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-role">Role *</label>
                                    <select
                                        id="edit-role"
                                        className="form-input"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'PHOTOGRAPHER' | 'BUYER' })}
                                    >
                                        <option value="BUYER">Buyer</option>
                                        <option value="PHOTOGRAPHER">Photographer</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.emailVerified}
                                            onChange={(e) => setFormData({ ...formData, emailVerified: e.target.checked })}
                                        />
                                        <span>Email Verified</span>
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <span>Active Account</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => {
                                setShowEditModal(false);
                                resetForm();
                            }}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleUpdateUser}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
