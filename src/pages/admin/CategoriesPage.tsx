import { useState, useEffect } from 'react';
import { categoryApi, type Category, type CategoryStats, type CategoryCreateDto, type CategoryUpdateDto, handleApiError } from '../../services/api';
import '../dashboard/Dashboard.css';
import './AdminDashboard.css';
import './CategoriesPage.css';

const CategoriesPage = () => {
    // State management
    const [categories, setCategories] = useState<Category[]>([]);
    const [stats, setStats] = useState<CategoryStats>({
        totalCategories: 0,
        activeCategories: 0,
        inactiveCategories: 0,
        emptyCategories: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Search and filter
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Form state
    const [formData, setFormData] = useState<CategoryCreateDto>({
        name: '',
        description: '',
        slug: '',
        imageUrl: '',
        isActive: true,
        displayOrder: 0
    });

    // Load data on mount and when search changes
    useEffect(() => {
        loadCategories();
        loadStats();
    }, [searchTerm]);

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            let response;
            if (searchTerm) {
                response = await categoryApi.searchCategories(searchTerm, 0, 100);
                setCategories(response.content);
            } else {
                const allCategories = await categoryApi.getOrderedCategories();
                setCategories(allCategories);
            }
        } catch (err) {
            const apiError = handleApiError(err);
            setError(apiError.message);
            console.error('Failed to load categories:', apiError);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await categoryApi.getCategoryStats();
            setStats(statsData);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    };

    const handleCreateCategory = async () => {
        try {
            await categoryApi.createCategory(formData);
            setSuccessMessage(`Category "${formData.name}" created successfully`);
            setShowCreateModal(false);
            resetForm();
            loadCategories();
            loadStats();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            const apiError = handleApiError(err);
            setError(apiError.message);
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleUpdateCategory = async () => {
        if (!selectedCategory) return;

        try {
            const updateData: CategoryUpdateDto = {
                name: formData.name,
                description: formData.description,
                imageUrl: formData.imageUrl,
                isActive: formData.isActive,
                displayOrder: formData.displayOrder
            };
            await categoryApi.updateCategory(selectedCategory.id, updateData);
            setSuccessMessage(`Category "${formData.name}" updated successfully`);
            setShowEditModal(false);
            resetForm();
            loadCategories();
            loadStats();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            const apiError = handleApiError(err);
            setError(apiError.message);
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;

        try {
            await categoryApi.deleteCategory(selectedCategory.id);
            setSuccessMessage(`Category "${selectedCategory.name}" deleted successfully`);
            setShowDeleteModal(false);
            setSelectedCategory(null);
            loadCategories();
            loadStats();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            const apiError = handleApiError(err);
            setError(apiError.message);
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleToggleActive = async (category: Category) => {
        try {
            if (category.isActive) {
                await categoryApi.deactivateCategory(category.id);
            } else {
                await categoryApi.activateCategory(category.id);
            }
            setSuccessMessage(`Category ${category.isActive ? 'deactivated' : 'activated'}`);
            loadCategories();
            loadStats();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            const apiError = handleApiError(err);
            setError(apiError.message);
            setTimeout(() => setError(null), 5000);
        }
    };

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            slug: category.slug,
            imageUrl: category.imageUrl || '',
            isActive: category.isActive,
            displayOrder: category.displayOrder || 0
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (category: Category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            slug: '',
            imageUrl: '',
            isActive: true,
            displayOrder: 0
        });
        setSelectedCategory(null);
    };

    return (
        <div className="categories-page">
            <div className="page-header">
                <div>
                    <h2>Category Management</h2>
                    <p className="page-subtitle">Manage photo categories and organization</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                        + Create Category
                    </button>
                </div>
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
                        <div className="stat-value">{stats.totalCategories}</div>
                        <div className="stat-label">Total Categories</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.activeCategories}</div>
                        <div className="stat-label">Active Categories</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.inactiveCategories}</div>
                        <div className="stat-label">Inactive Categories</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.emptyCategories}</div>
                        <div className="stat-label">Empty Categories</div>
                    </div>
                </div>
            </div>

            {/* Search and Table */}
            <div className="admin-card">
                <div className="admin-table-header">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading categories...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="empty-state">
                        <p>No categories found</p>
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Slug</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td className="order-cell">{category.displayOrder}</td>
                                        <td>
                                            {category.imageUrl ? (
                                                <img src={category.imageUrl} alt={category.name} className="category-thumb" />
                                            ) : (
                                                <div className="category-thumb-placeholder">No Image</div>
                                            )}
                                        </td>
                                        <td className="category-name">{category.name}</td>
                                        <td className="category-slug">{category.slug}</td>
                                        <td className="category-description">{category.description || '-'}</td>
                                        <td>
                                            <span className={`status-badge ${category.isActive ? 'active' : 'inactive'}`}>
                                                {category.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="action-btn"
                                                    title="Edit"
                                                    onClick={() => openEditModal(category)}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className={`action-btn ${category.isActive ? 'warning' : 'success'}`}
                                                    title={category.isActive ? 'Deactivate' : 'Activate'}
                                                    onClick={() => handleToggleActive(category)}
                                                >
                                                    {category.isActive ? '⏸️' : '▶️'}
                                                </button>
                                                <button
                                                    className="action-btn danger"
                                                    title="Delete"
                                                    onClick={() => openDeleteModal(category)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Category Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Create New Category</h3>
                            <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Wildlife"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Category description..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Slug (optional)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="Auto-generated if empty"
                                />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div className="form-group">
                                <label>Display Order</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.displayOrder}
                                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <span>Active</span>
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => { setShowCreateModal(false); resetForm(); }}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleCreateCategory}
                                disabled={!formData.name}
                            >
                                Create Category
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Category Modal */}
            {showEditModal && selectedCategory && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Category</h3>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Display Order</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.displayOrder}
                                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <span>Active</span>
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => { setShowEditModal(false); resetForm(); }}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleUpdateCategory}
                                disabled={!formData.name}
                            >
                                Update Category
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedCategory && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Delete Category</h3>
                            <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete the category <strong>"{selectedCategory.name}"</strong>?</p>
                            <p className="warning-text">This action cannot be undone. Categories with associated photos cannot be deleted.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => { setShowDeleteModal(false); setSelectedCategory(null); }}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDeleteCategory}
                            >
                                Delete Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;
