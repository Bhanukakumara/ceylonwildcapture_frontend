import { useState, useEffect } from 'react';
import adminApi from '../../services/admin-api';
import '../dashboard/Dashboard.css';
import './AdminDashboard.css';
import './CategoriesPage.css';

interface Category {
    id: number;
    name: string;
    description?: string;
    slug: string;
    imageUrl?: string;
    isActive: boolean;
    displayOrder?: number;
    createdAt: string;
    updatedAt: string;
}

interface Tag {
    id: number;
    name: string;
    description?: string;
    usageCount: number;
    createdAt: string;
    updatedAt: string;
}

const CategoriesPage = () => {
    // Tab state
    const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');

    // Category state
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showCategoryDeleteModal, setShowCategoryDeleteModal] = useState(false);
    const [showCategoryMergeModal, setShowCategoryMergeModal] = useState(false);
    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
        description: '',
        slug: '',
        imageUrl: '',
        isActive: true,
        displayOrder: 0
    });

    // Tag state
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
    const [showTagModal, setShowTagModal] = useState(false);
    const [showTagDeleteModal, setShowTagDeleteModal] = useState(false);
    const [showTagMergeModal, setShowTagMergeModal] = useState(false);
    const [tagFormData, setTagFormData] = useState({
        name: '',
        description: ''
    });

    // Merge state
    const [mergeTargetId, setMergeTargetId] = useState<number | null>(null);

    // Image upload state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // General state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (activeTab === 'categories') {
            loadCategories();
        } else {
            loadTags();
        }
    }, [activeTab, currentPage]);

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await adminApi.getAllCategories(currentPage, 20);
            setCategories(data.content);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const loadTags = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await adminApi.getAllTags(currentPage, 20);
            setTags(data.content);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load tags');
        } finally {
            setLoading(false);
        }
    };

    // Image upload handler
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (): Promise<string | null> => {
        if (!selectedFile) return null;
        try {
            setUploading(true);
            const imageUrl = await adminApi.uploadCategoryImage(selectedFile);
            return imageUrl;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload image');
            return null;
        } finally {
            setUploading(false);
        }
    };

    // Category handlers
    const handleCreateCategory = async () => {
        try {
            // Upload image first if selected
            let imageUrl = categoryFormData.imageUrl;
            if (selectedFile) {
                const uploadedUrl = await uploadImage();
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                } else {
                    return; // Upload failed, don't create category
                }
            }

            await adminApi.createCategory({ ...categoryFormData, imageUrl });
            setSuccessMessage(`Category "${categoryFormData.name}" created successfully`);
            setShowCategoryModal(false);
            resetCategoryForm();
            loadCategories();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create category');
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleUpdateCategory = async () => {
        if (!selectedCategory) return;
        try {
            // Upload image first if selected
            let imageUrl = categoryFormData.imageUrl;
            if (selectedFile) {
                const uploadedUrl = await uploadImage();
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                } else {
                    return; // Upload failed, don't update category
                }
            }

            await adminApi.updateCategory(selectedCategory.id, { ...categoryFormData, imageUrl });
            setSuccessMessage(`Category "${categoryFormData.name}" updated successfully`);
            setShowCategoryModal(false);
            resetCategoryForm();
            loadCategories();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update category');
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;
        try {
            await adminApi.deleteCategory(selectedCategory.id);
            setSuccessMessage(`Category "${selectedCategory.name}" deleted successfully`);
            setShowCategoryDeleteModal(false);
            setSelectedCategory(null);
            loadCategories();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete category');
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleMergeCategories = async () => {
        if (!selectedCategory || !mergeTargetId) return;
        try {
            await adminApi.mergeCategories(selectedCategory.id, mergeTargetId);
            setSuccessMessage(`Category merged successfully`);
            setShowCategoryMergeModal(false);
            setSelectedCategory(null);
            setMergeTargetId(null);
            loadCategories();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to merge categories');
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleDeleteUnusedCategories = async () => {
        if (!confirm('Are you sure you want to delete all unused categories?')) return;
        try {
            const count = await adminApi.deleteUnusedCategories();
            setSuccessMessage(`Deleted ${count} unused categories`);
            loadCategories();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete unused categories');
            setTimeout(() => setError(null), 5000);
        }
    };

    // Tag handlers
    const handleCreateTag = async () => {
        try {
            await adminApi.createTag(tagFormData);
            setSuccessMessage(`Tag "${tagFormData.name}" created successfully`);
            setShowTagModal(false);
            resetTagForm();
            loadTags();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create tag');
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleUpdateTag = async () => {
        if (!selectedTag) return;
        try {
            await adminApi.updateTag(selectedTag.id, tagFormData);
            setSuccessMessage(`Tag "${tagFormData.name}" updated successfully`);
            setShowTagModal(false);
            resetTagForm();
            loadTags();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update tag');
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleDeleteTag = async () => {
        if (!selectedTag) return;
        try {
            await adminApi.deleteTag(selectedTag.id);
            setSuccessMessage(`Tag "${selectedTag.name}" deleted successfully`);
            setShowTagDeleteModal(false);
            setSelectedTag(null);
            loadTags();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete tag');
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleMergeTags = async () => {
        if (!selectedTag || !mergeTargetId) return;
        try {
            await adminApi.mergeTags(selectedTag.id, mergeTargetId);
            setSuccessMessage(`Tag merged successfully`);
            setShowTagMergeModal(false);
            setSelectedTag(null);
            setMergeTargetId(null);
            loadTags();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to merge tags');
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleDeleteUnusedTags = async () => {
        if (!confirm('Are you sure you want to delete all unused tags?')) return;
        try {
            const count = await adminApi.deleteUnusedTags();
            setSuccessMessage(`Deleted ${count} unused tags`);
            loadTags();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete unused tags');
            setTimeout(() => setError(null), 5000);
        }
    };

    // UI helpers
    const openCategoryEditModal = (category: Category) => {
        setSelectedCategory(category);
        setCategoryFormData({
            name: category.name,
            description: category.description || '',
            slug: category.slug,
            imageUrl: category.imageUrl || '',
            isActive: category.isActive,
            displayOrder: category.displayOrder || 0
        });
        setShowCategoryModal(true);
    };

    const openTagEditModal = (tag: Tag) => {
        setSelectedTag(tag);
        setTagFormData({
            name: tag.name,
            description: tag.description || ''
        });
        setShowTagModal(true);
    };

    const resetCategoryForm = () => {
        setCategoryFormData({
            name: '',
            description: '',
            slug: '',
            imageUrl: '',
            isActive: true,
            displayOrder: 0
        });
        setSelectedCategory(null);
        setSelectedFile(null);
        setImagePreview(null);
    };

    const resetTagForm = () => {
        setTagFormData({
            name: '',
            description: ''
        });
        setSelectedTag(null);
    };

    return (
        <div className="categories-page">
            <div className="page-header">
                <div>
                    <h2>Categories & Tags Management</h2>
                    <p className="page-subtitle">Manage photo categories and tags</p>
                </div>
                <div className="header-actions">
                    {activeTab === 'categories' && (
                        <>
                            <button className="btn btn-ghost" onClick={handleDeleteUnusedCategories}>
                                🗑️ Delete Unused
                            </button>
                            <button className="btn btn-primary" onClick={() => setShowCategoryModal(true)}>
                                + Create Category
                            </button>
                        </>
                    )}
                    {activeTab === 'tags' && (
                        <>
                            <button className="btn btn-ghost" onClick={handleDeleteUnusedTags}>
                                🗑️ Delete Unused
                            </button>
                            <button className="btn btn-primary" onClick={() => setShowTagModal(true)}>
                                + Create Tag
                            </button>
                        </>
                    )}
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

            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('categories'); setCurrentPage(0); }}
                >
                    Categories
                </button>
                <button
                    className={`admin-tab ${activeTab === 'tags' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('tags'); setCurrentPage(0); }}
                >
                    Tags
                </button>
            </div>

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <div className="admin-card">
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
                                                        onClick={() => openCategoryEditModal(category)}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="action-btn"
                                                        title="Merge"
                                                        onClick={() => { setSelectedCategory(category); setShowCategoryMergeModal(true); }}
                                                    >
                                                        🔀
                                                    </button>
                                                    <button
                                                        className="action-btn danger"
                                                        title="Delete"
                                                        onClick={() => { setSelectedCategory(category); setShowCategoryDeleteModal(true); }}
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

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="table-pagination">
                            <div className="pagination-info">
                                Page {currentPage + 1} of {totalPages}
                            </div>
                            <div className="pagination-controls">
                                <button
                                    className="btn btn-ghost btn-sm"
                                    disabled={currentPage === 0}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    Previous
                                </button>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    disabled={currentPage >= totalPages - 1}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Tags Tab */}
            {activeTab === 'tags' && (
                <div className="admin-card">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading tags...</p>
                        </div>
                    ) : tags.length === 0 ? (
                        <div className="empty-state">
                            <p>No tags found</p>
                        </div>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Usage Count</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tags.map((tag) => (
                                        <tr key={tag.id}>
                                            <td className="tag-name">{tag.name}</td>
                                            <td className="tag-description">{tag.description || '-'}</td>
                                            <td className="tag-usage">{tag.usageCount}</td>
                                            <td className="date-cell">{new Date(tag.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        className="action-btn"
                                                        title="Edit"
                                                        onClick={() => openTagEditModal(tag)}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="action-btn"
                                                        title="Merge"
                                                        onClick={() => { setSelectedTag(tag); setShowTagMergeModal(true); }}
                                                    >
                                                        🔀
                                                    </button>
                                                    <button
                                                        className="action-btn danger"
                                                        title="Delete"
                                                        onClick={() => { setSelectedTag(tag); setShowTagDeleteModal(true); }}
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

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="table-pagination">
                            <div className="pagination-info">
                                Page {currentPage + 1} of {totalPages}
                            </div>
                            <div className="pagination-controls">
                                <button
                                    className="btn btn-ghost btn-sm"
                                    disabled={currentPage === 0}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    Previous
                                </button>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    disabled={currentPage >= totalPages - 1}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Category Create/Edit Modal */}
            {showCategoryModal && (
                <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedCategory ? 'Edit Category' : 'Create New Category'}</h3>
                            <button className="modal-close" onClick={() => setShowCategoryModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={categoryFormData.name}
                                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                                    placeholder="e.g., Wildlife"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    value={categoryFormData.description}
                                    onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                                    placeholder="Category description..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Slug (optional)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={categoryFormData.slug}
                                    onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                                    placeholder="Auto-generated if empty"
                                />
                            </div>
                            <div className="form-group">
                                <label>Category Image</label>
                                <input
                                    type="file"
                                    className="form-input"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    disabled={uploading}
                                />
                                {uploading && <p className="upload-status">Uploading image...</p>}
                                {imagePreview && (
                                    <div className="image-preview-container">
                                        <img src={imagePreview} alt="Preview" className="image-preview" />
                                    </div>
                                )}
                                {categoryFormData.imageUrl && !imagePreview && (
                                    <div className="image-preview-container">
                                        <img src={categoryFormData.imageUrl} alt="Current" className="image-preview" />
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Or Enter Image URL (optional)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={categoryFormData.imageUrl}
                                    onChange={(e) => setCategoryFormData({ ...categoryFormData, imageUrl: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    disabled={!!selectedFile}
                                />
                                <small style={{ color: '#888', fontSize: '12px' }}>If you selected a file above, it will be used instead of this URL</small>
                            </div>
                            <div className="form-group">
                                <label>Display Order</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={categoryFormData.displayOrder}
                                    onChange={(e) => setCategoryFormData({ ...categoryFormData, displayOrder: parseInt(e.target.value) || 0 })}
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={categoryFormData.isActive}
                                        onChange={(e) => setCategoryFormData({ ...categoryFormData, isActive: e.target.checked })}
                                    />
                                    <span>Active</span>
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => { setShowCategoryModal(false); resetCategoryForm(); }}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={selectedCategory ? handleUpdateCategory : handleCreateCategory}
                                disabled={!categoryFormData.name}
                            >
                                {selectedCategory ? 'Update' : 'Create'} Category
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Delete Modal */}
            {showCategoryDeleteModal && selectedCategory && (
                <div className="modal-overlay" onClick={() => setShowCategoryDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Delete Category</h3>
                            <button className="modal-close" onClick={() => setShowCategoryDeleteModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete the category <strong>"{selectedCategory.name}"</strong>?</p>
                            <p className="warning-text">This action cannot be undone. Categories with associated photos cannot be deleted.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => { setShowCategoryDeleteModal(false); setSelectedCategory(null); }}>
                                Cancel
                            </button>
                            <button className="btn btn-danger" onClick={handleDeleteCategory}>
                                Delete Category
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Merge Modal */}
            {showCategoryMergeModal && selectedCategory && (
                <div className="modal-overlay" onClick={() => setShowCategoryMergeModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Merge Category</h3>
                            <button className="modal-close" onClick={() => setShowCategoryMergeModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Merge <strong>"{selectedCategory.name}"</strong> into:</p>
                            <div className="form-group">
                                <label>Target Category</label>
                                <select
                                    className="form-input"
                                    value={mergeTargetId || ''}
                                    onChange={(e) => setMergeTargetId(parseInt(e.target.value))}
                                >
                                    <option value="">Select target category...</option>
                                    {categories.filter(c => c.id !== selectedCategory.id).map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="warning-text">All photos from "{selectedCategory.name}" will be moved to the target category, and "{selectedCategory.name}" will be deleted.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => { setShowCategoryMergeModal(false); setMergeTargetId(null); }}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleMergeCategories}
                                disabled={!mergeTargetId}
                            >
                                Merge Categories
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tag Create/Edit Modal */}
            {showTagModal && (
                <div className="modal-overlay" onClick={() => setShowTagModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedTag ? 'Edit Tag' : 'Create New Tag'}</h3>
                            <button className="modal-close" onClick={() => setShowTagModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={tagFormData.name}
                                    onChange={(e) => setTagFormData({ ...tagFormData, name: e.target.value })}
                                    placeholder="e.g., elephant"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    value={tagFormData.description}
                                    onChange={(e) => setTagFormData({ ...tagFormData, description: e.target.value })}
                                    placeholder="Tag description..."
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => { setShowTagModal(false); resetTagForm(); }}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={selectedTag ? handleUpdateTag : handleCreateTag}
                                disabled={!tagFormData.name}
                            >
                                {selectedTag ? 'Update' : 'Create'} Tag
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tag Delete Modal */}
            {showTagDeleteModal && selectedTag && (
                <div className="modal-overlay" onClick={() => setShowTagDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Delete Tag</h3>
                            <button className="modal-close" onClick={() => setShowTagDeleteModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete the tag <strong>"{selectedTag.name}"</strong>?</p>
                            <p className="warning-text">This action cannot be undone. Tags with photos cannot be deleted.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => { setShowTagDeleteModal(false); setSelectedTag(null); }}>
                                Cancel
                            </button>
                            <button className="btn btn-danger" onClick={handleDeleteTag}>
                                Delete Tag
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tag Merge Modal */}
            {showTagMergeModal && selectedTag && (
                <div className="modal-overlay" onClick={() => setShowTagMergeModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Merge Tag</h3>
                            <button className="modal-close" onClick={() => setShowTagMergeModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Merge <strong>"{selectedTag.name}"</strong> into:</p>
                            <div className="form-group">
                                <label>Target Tag</label>
                                <select
                                    className="form-input"
                                    value={mergeTargetId || ''}
                                    onChange={(e) => setMergeTargetId(parseInt(e.target.value))}
                                >
                                    <option value="">Select target tag...</option>
                                    {tags.filter(t => t.id !== selectedTag.id).map(tag => (
                                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="warning-text">All photos tagged with "{selectedTag.name}" will be re-tagged with the target tag, and "{selectedTag.name}" will be deleted.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => { setShowTagMergeModal(false); setMergeTargetId(null); }}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleMergeTags}
                                disabled={!mergeTargetId}
                            >
                                Merge Tags
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;
