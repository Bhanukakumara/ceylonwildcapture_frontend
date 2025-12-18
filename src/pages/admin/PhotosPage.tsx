import { useState, useEffect } from 'react';
import { photoApi, categoryApi, type Photo, type PhotoStats, type Category, handleApiError } from '../../services/api';
import '../dashboard/Dashboard.css';
import './AdminDashboard.css';
import './PhotosPage.css';

const PhotosPage = () => {
    // State management
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [stats, setStats] = useState<PhotoStats>({
        totalPhotos: 0,
        pendingApproval: 0,
        approved: 0,
        rejected: 0,
        featured: 0,
        totalViews: 0,
        totalDownloads: 0
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Filter and search state
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

    // Modal state
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    // View and pagination state

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 20;

    // Load data on mount and when filters change
    useEffect(() => {
        loadPhotos();
        loadStats();
    }, [currentPage, statusFilter, categoryFilter, searchTerm]);

    // Load categories on mount
    useEffect(() => {
        loadCategories();
    }, []);

    const loadPhotos = async () => {
        try {
            setLoading(true);
            setError(null);

            let response;

            // Apply filters
            if (searchTerm) {
                response = await photoApi.searchPhotos(searchTerm, currentPage, pageSize);
            } else if (statusFilter === 'PENDING') {
                response = await photoApi.getPendingApproval(currentPage, pageSize);
            } else if (statusFilter === 'FEATURED') {
                response = await photoApi.getFeaturedPhotos(currentPage, pageSize);
            } else if (statusFilter === 'APPROVED') {
                response = await photoApi.getApprovedAndActive(currentPage, pageSize);
            } else if (categoryFilter !== 'ALL') {
                const category = categories.find(c => c.name === categoryFilter);
                if (category) {
                    response = await photoApi.getPhotosByCategory(category.slug, currentPage, pageSize);
                } else {
                    response = await photoApi.getAllPhotos(currentPage, pageSize);
                }
            } else {
                response = await photoApi.getAllPhotos(currentPage, pageSize);
            }

            setPhotos(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (err) {
            const apiError = handleApiError(err);
            setError(apiError.message);
            console.error('Failed to load photos:', apiError);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await photoApi.getPhotoStats();
            setStats(statsData);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    };

    const loadCategories = async () => {
        try {
            const categoriesData = await categoryApi.getAllCategories();
            setCategories(categoriesData);
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleViewDetails = (photo: Photo) => {
        setSelectedPhoto(photo);
        setShowDetailsModal(true);
    };

    const handleApprove = async (photo: Photo) => {
        try {
            await photoApi.approvePhoto(photo.id);
            setSuccessMessage(`Photo "${photo.title}" has been approved`);
            loadPhotos();
            loadStats();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            const apiError = handleApiError(err);
            setError(apiError.message);
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleReject = (photo: Photo) => {
        setSelectedPhoto(photo);
        setShowApprovalModal(true);
    };

    const confirmReject = async () => {
        if (selectedPhoto && rejectionReason) {
            try {
                await photoApi.rejectPhoto(selectedPhoto.id, rejectionReason);
                setSuccessMessage(`Photo "${selectedPhoto.title}" has been rejected`);
                setShowApprovalModal(false);
                setRejectionReason('');
                loadPhotos();
                loadStats();
                setTimeout(() => setSuccessMessage(null), 3000);
            } catch (err) {
                const apiError = handleApiError(err);
                setError(apiError.message);
                setTimeout(() => setError(null), 5000);
            }
        }
    };

    const handleToggleFeatured = async (photo: Photo) => {
        try {
            await photoApi.setFeatured(photo.id, !photo.isFeatured);
            setSuccessMessage(`Photo ${photo.isFeatured ? 'removed from' : 'added to'} featured`);
            loadPhotos();
            loadStats();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            const apiError = handleApiError(err);
            setError(apiError.message);
            setTimeout(() => setError(null), 5000);
        }
    };


    const handleDelete = async (photo: Photo) => {
        if (confirm(`Are you sure you want to delete "${photo.title}"?`)) {
            try {
                await photoApi.deletePhoto(photo.id);
                setSuccessMessage(`Photo "${photo.title}" has been deleted`);
                loadPhotos();
                loadStats();
                setTimeout(() => setSuccessMessage(null), 3000);
            } catch (err) {
                const apiError = handleApiError(err);
                setError(apiError.message);
                setTimeout(() => setError(null), 5000);
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="photos-page">
            <div className="page-header">
                <div>
                    <h2>Photo Management</h2>
                    <p className="page-subtitle">Review and manage all photos on the platform</p>
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
                        <div className="stat-value">{stats.totalPhotos.toLocaleString()}</div>
                        <div className="stat-label">Total Photos</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card pending">
                    <div className="stat-content">
                        <div className="stat-value">{stats.pendingApproval}</div>
                        <div className="stat-label">Pending Approval</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.approved.toLocaleString()}</div>
                        <div className="stat-label">Approved</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.featured}</div>
                        <div className="stat-label">Featured</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{(stats.totalViews / 1000).toFixed(1)}K</div>
                        <div className="stat-label">Total Views</div>
                    </div>
                </div>
                <div className="stat-card glass admin-stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{(stats.totalDownloads / 1000).toFixed(1)}K</div>
                        <div className="stat-label">Total Downloads</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-card">
                <div className="admin-table-header">
                    <input
                        type="text"
                        placeholder="Search by title, description, or photographer..."
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(0);
                        }}
                    />
                    <select
                        className="admin-filter-select"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(0);
                        }}
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending Approval</option>
                        <option value="APPROVED">Approved</option>
                        <option value="FEATURED">Featured</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                    <select
                        className="admin-filter-select"
                        value={categoryFilter}
                        onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setCurrentPage(0);
                        }}
                    >
                        <option value="ALL">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Photo Grid/List */}
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading photos...</p>
                    </div>
                ) : photos.length === 0 ? (
                    <div className="empty-state">
                        <p>No photos found</p>
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Photo</th>
                                    <th>Photographer</th>
                                    <th>Dimensions</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Engagement</th>
                                    <th>Uploaded</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {photos.map((photo) => (
                                    <tr key={photo.id}>
                                        <td>
                                            <div className="photo-cell">
                                                <img src={photo.thumbnailUrl} alt={photo.title} className="photo-thumb" />
                                                <div className="photo-cell-info">
                                                    <div className="photo-cell-title">{photo.title}</div>
                                                    <div className="photo-cell-meta">{formatFileSize(photo.fileSize)} • {photo.format.toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>@{photo.photographer?.username || 'Unknown'}</td>
                                        <td>{photo.width}×{photo.height}</td>
                                        <td className="price-cell">${photo.basePrice}</td>
                                        <td>
                                            <div className="status-badges">
                                                {!photo.isApproved && <span className="status-badge pending">Pending</span>}
                                                {photo.isApproved && <span className="status-badge active">Approved</span>}
                                                {photo.isFeatured && <span className="status-badge featured">⭐ Featured</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="engagement-cell">
                                                <span title="Views">👁️ {photo.viewCount}</span>
                                                <span title="Downloads">⬇️ {photo.downloadCount}</span>
                                                <span title="Likes">❤️ {photo.likeCount}</span>
                                            </div>
                                        </td>
                                        <td className="date-cell">{formatDate(photo.createdAt)}</td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="action-btn"
                                                    title="View Details"
                                                    onClick={() => handleViewDetails(photo)}
                                                >
                                                    👁️
                                                </button>
                                                {!photo.isApproved && (
                                                    <>
                                                        <button
                                                            className="action-btn success"
                                                            title="Approve"
                                                            onClick={() => handleApprove(photo)}
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            className="action-btn danger"
                                                            title="Reject"
                                                            onClick={() => handleReject(photo)}
                                                        >
                                                            ✗
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    className="action-btn"
                                                    title="Delete"
                                                    onClick={() => handleDelete(photo)}
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
                {!loading && photos.length > 0 && (
                    <div className="table-pagination">
                        <div className="pagination-info">
                            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} photos
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
                )}
            </div>

            {/* Photo Details Modal */}
            {showDetailsModal && selectedPhoto && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-content large photo-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Photo Details</h3>
                            <button className="modal-close" onClick={() => setShowDetailsModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="photo-details-layout">
                                <div className="photo-preview">
                                    <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} />
                                </div>
                                <div className="photo-details-info">
                                    <h3>{selectedPhoto.title}</h3>
                                    <p className="photo-description">{selectedPhoto.description}</p>

                                    <div className="detail-section">
                                        <h4>Photographer</h4>
                                        <p>@{selectedPhoto.photographer?.username || 'Unknown'} ({selectedPhoto.photographer?.firstName || ''} {selectedPhoto.photographer?.lastName || ''})</p>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Image Details</h4>
                                        <div className="detail-grid">
                                            <div><strong>Dimensions:</strong> {selectedPhoto.width}×{selectedPhoto.height}</div>
                                            <div><strong>Format:</strong> {selectedPhoto.format.toUpperCase()}</div>
                                            <div><strong>File Size:</strong> {formatFileSize(selectedPhoto.fileSize)}</div>
                                            <div><strong>Location:</strong> {selectedPhoto.location || 'Not specified'}</div>
                                        </div>
                                    </div>

                                    {selectedPhoto.cameraModel && (
                                        <div className="detail-section">
                                            <h4>EXIF Data</h4>
                                            <div className="detail-grid">
                                                <div><strong>Camera:</strong> {selectedPhoto.cameraModel}</div>
                                                <div><strong>Lens:</strong> {selectedPhoto.lens || 'N/A'}</div>
                                                <div><strong>Focal Length:</strong> {selectedPhoto.focalLength || 'N/A'}</div>
                                                <div><strong>Aperture:</strong> {selectedPhoto.aperture || 'N/A'}</div>
                                                <div><strong>Shutter Speed:</strong> {selectedPhoto.shutterSpeed || 'N/A'}</div>
                                                <div><strong>ISO:</strong> {selectedPhoto.iso || 'N/A'}</div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="detail-section">
                                        <h4>Pricing</h4>
                                        <div className="pricing-grid">
                                            <div><strong>Base:</strong> ${selectedPhoto.basePrice}</div>
                                            {selectedPhoto.commercialPrice && <div><strong>Commercial:</strong> ${selectedPhoto.commercialPrice}</div>}
                                            {selectedPhoto.editorialPrice && <div><strong>Editorial:</strong> ${selectedPhoto.editorialPrice}</div>}
                                            {selectedPhoto.extendedPrice && <div><strong>Extended:</strong> ${selectedPhoto.extendedPrice}</div>}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Engagement</h4>
                                        <div className="engagement-stats">
                                            <div className="stat-item">
                                                <span className="stat-icon">👁️</span>
                                                <span className="stat-number">{selectedPhoto.viewCount}</span>
                                                <span className="stat-label">Views</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-icon">⬇️</span>
                                                <span className="stat-number">{selectedPhoto.downloadCount}</span>
                                                <span className="stat-label">Downloads</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-icon">❤️</span>
                                                <span className="stat-number">{selectedPhoto.likeCount}</span>
                                                <span className="stat-label">Likes</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Tags</h4>
                                        <div className="tags-list">
                                            {selectedPhoto.tags?.map((tag) => (
                                                <span key={tag.id} className="tag">{tag.name}</span>
                                            )) || <span>No tags</span>}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Categories</h4>
                                        <div className="tags-list">
                                            {selectedPhoto.categories?.map((cat) => (
                                                <span key={cat.id} className="category-tag">{cat.name}</span>
                                            )) || <span>No categories</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowDetailsModal(false)}>
                                Close
                            </button>
                            {!selectedPhoto.isApproved && (
                                <>
                                    <button className="btn btn-success" onClick={() => {
                                        handleApprove(selectedPhoto);
                                        setShowDetailsModal(false);
                                    }}>
                                        Approve Photo
                                    </button>
                                    <button className="btn btn-danger" onClick={() => {
                                        setShowDetailsModal(false);
                                        handleReject(selectedPhoto);
                                    }}>
                                        Reject Photo
                                    </button>
                                </>
                            )}
                            <button
                                className={`btn ${selectedPhoto.isFeatured ? 'btn-ghost' : 'btn-primary'}`}
                                onClick={() => {
                                    handleToggleFeatured(selectedPhoto);
                                    setShowDetailsModal(false);
                                }}
                            >
                                {selectedPhoto.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {showApprovalModal && selectedPhoto && (
                <div className="modal-overlay" onClick={() => setShowApprovalModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Reject Photo</h3>
                            <button className="modal-close" onClick={() => setShowApprovalModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>You are about to reject: <strong>{selectedPhoto.title}</strong></p>
                            <div className="form-group">
                                <label>Rejection Reason *</label>
                                <textarea
                                    className="form-input"
                                    rows={4}
                                    placeholder="Please provide a reason for rejection..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => {
                                setShowApprovalModal(false);
                                setRejectionReason('');
                            }}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={confirmReject}
                                disabled={!rejectionReason}
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotosPage;
