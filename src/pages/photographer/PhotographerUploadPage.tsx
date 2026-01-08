import { useState, useEffect } from 'react';
import { photoApi, categoryApi, type Photo, type Category, handleApiError, authApi } from '../../services/api';
import AddPhotoModal from '../../components/AddPhotoModal';
import { Button, Title, Paragraph, Input } from '../../components/ui';
import '../dashboard/Dashboard.css';
import '../admin/AdminDashboard.css';
import '../admin/PhotosPage.css';

const PhotographerUploadPage = () => {
    // State management
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [stats, setStats] = useState({
        totalPhotos: 0,
        pendingApproval: 0,
        approved: 0,
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
    const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);

    // View and pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 20;

    // Get current photographer ID
    const getCurrentPhotographerId = (): number | null => {
        const user = authApi.getCurrentUser();
        return user?.id || null;
    };

    // Load data on mount and when filters change
    useEffect(() => {
        loadPhotos();
    }, [currentPage, statusFilter, categoryFilter, searchTerm]);

    // Load categories on mount
    useEffect(() => {
        loadCategories();
    }, []);

    const loadPhotos = async () => {
        try {
            setLoading(true);
            setError(null);

            const photographerId = getCurrentPhotographerId();
            if (!photographerId) {
                setError('User not logged in');
                setLoading(false);
                return;
            }

            // Get photographer's photos
            const response = await photoApi.getPhotosByPhotographer(photographerId, currentPage, pageSize);

            let filteredPhotos = response.content;

            // Apply client-side filters
            if (statusFilter === 'PENDING') {
                filteredPhotos = filteredPhotos.filter(p => !p.isApproved);
            } else if (statusFilter === 'APPROVED') {
                filteredPhotos = filteredPhotos.filter(p => p.isApproved);
            }

            if (categoryFilter !== 'ALL') {
                const category = categories.find(c => c.name === categoryFilter);
                if (category) {
                    filteredPhotos = filteredPhotos.filter(p => {
                        if (Array.isArray(p.categories)) {
                            return p.categories.some(cat => cat.id === category.id);
                        }
                        return false;
                    });
                }
            }

            if (searchTerm) {
                const lowerSearch = searchTerm.toLowerCase();
                filteredPhotos = filteredPhotos.filter(p =>
                    p.title.toLowerCase().includes(lowerSearch) ||
                    p.description?.toLowerCase().includes(lowerSearch)
                );
            }

            setPhotos(filteredPhotos);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);

            // Calculate stats
            const totalPhotos = response.totalElements;
            const pendingApproval = response.content.filter(p => !p.isApproved).length;
            const approved = response.content.filter(p => p.isApproved).length;

            setStats({ totalPhotos, pendingApproval, approved });
        } catch (err) {
            const apiError = handleApiError(err);
            setError(apiError.message);
            console.error('Failed to load photos:', apiError);
        } finally {
            setLoading(false);
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

    const handleUploadSuccess = () => {
        setSuccessMessage('Photo uploaded successfully and is pending approval');
        loadPhotos();
        setTimeout(() => setSuccessMessage(null), 3000);
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

    const handleDelete = async (photo: Photo) => {
        if (confirm(`Are you sure you want to delete "${photo.title}"?`)) {
            try {
                await photoApi.deletePhoto(photo.id);
                setSuccessMessage(`Photo "${photo.title}" has been deleted`);
                loadPhotos();
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
                    <Title level={2}>My Photos</Title>
                    <Paragraph className="page-subtitle">Manage and upload your wildlife photography</Paragraph>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setShowAddPhotoModal(true)}
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    }
                >
                    Upload Photo
                </Button>
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
            </div>

            {/* Filters */}
            <div className="admin-card">
                <div className="admin-table-header">
                    <Input
                        type="text"
                        placeholder="Search by title or description..."
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
                        <Paragraph>Loading photos...</Paragraph>
                    </div>
                ) : photos.length === 0 ? (
                    <div className="empty-state">
                        <Paragraph>No photos found. Upload your first photo to get started!</Paragraph>
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Photo</th>
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
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="action-btn"
                                                    onClick={() => handleViewDetails(photo)}
                                                >
                                                    👁️
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="action-btn"
                                                    onClick={() => handleDelete(photo)}
                                                >
                                                    🗑️
                                                </Button>
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
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                            >
                                Previous
                            </Button>
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
                                    <Button
                                        key={pageNum}
                                        variant="ghost"
                                        size="sm"
                                        className={currentPage === pageNum ? 'active' : ''}
                                        onClick={() => handlePageChange(pageNum)}
                                    >
                                        {pageNum + 1}
                                    </Button>
                                );
                            })}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages - 1}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Photo Details Modal */}
            {showDetailsModal && selectedPhoto && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-content large photo-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <Title level={3}>Photo Details</Title>
                            <Button variant="ghost" className="modal-close" onClick={() => setShowDetailsModal(false)}>×</Button>
                        </div>
                        <div className="modal-body">
                            <div className="photo-details-layout">
                                <div className="photo-preview">
                                    <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} />
                                </div>
                                <div className="photo-details-info">
                                    <Title level={3}>{selectedPhoto.title}</Title>
                                    <Paragraph className="photo-description">{selectedPhoto.description}</Paragraph>

                                    <div className="detail-section">
                                        <Title level={4}>Image Details</Title>
                                        <div className="detail-grid">
                                            <div><strong>Dimensions:</strong> {selectedPhoto.width}×{selectedPhoto.height}</div>
                                            <div><strong>Format:</strong> {selectedPhoto.format.toUpperCase()}</div>
                                            <div><strong>File Size:</strong> {formatFileSize(selectedPhoto.fileSize)}</div>
                                            <div><strong>Location:</strong> {selectedPhoto.location || 'Not specified'}</div>
                                        </div>
                                    </div>

                                    {selectedPhoto.cameraModel && (
                                        <div className="detail-section">
                                            <Title level={4}>EXIF Data</Title>
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
                                        <Title level={4}>Pricing</Title>
                                        <div className="pricing-grid">
                                            <div><strong>Base:</strong> ${selectedPhoto.basePrice}</div>
                                            {selectedPhoto.commercialPrice && <div><strong>Commercial:</strong> ${selectedPhoto.commercialPrice}</div>}
                                            {selectedPhoto.editorialPrice && <div><strong>Editorial:</strong> ${selectedPhoto.editorialPrice}</div>}
                                            {selectedPhoto.extendedPrice && <div><strong>Extended:</strong> ${selectedPhoto.extendedPrice}</div>}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <Title level={4}>Engagement</Title>
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
                                        <Title level={4}>Tags</Title>
                                        <div className="tags-list">
                                            {selectedPhoto.tags?.map((tag) => (
                                                <span key={tag.id} className="tag">{tag.name}</span>
                                            )) || <span>No tags</span>}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <Title level={4}>Categories</Title>
                                        <div className="tags-list">
                                            {Array.isArray(selectedPhoto.categories) ? (
                                                selectedPhoto.categories.map((cat) => (
                                                    <span key={cat.id} className="category-tag">{cat.name}</span>
                                                ))
                                            ) : typeof selectedPhoto.categories === 'string' ? (
                                                <span className="category-tag">{selectedPhoto.categories}</span>
                                            ) : (
                                                <span>No categories</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <Title level={4}>Status</Title>
                                        <div className="status-badges">
                                            {!selectedPhoto.isApproved && <span className="status-badge pending">⏳ Pending Approval</span>}
                                            {selectedPhoto.isApproved && <span className="status-badge active">✓ Approved</span>}
                                            {selectedPhoto.isFeatured && <span className="status-badge featured">⭐ Featured</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Button variant="ghost" onClick={() => setShowDetailsModal(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Photo Modal */}
            <AddPhotoModal
                isOpen={showAddPhotoModal}
                onClose={() => setShowAddPhotoModal(false)}
                onSuccess={handleUploadSuccess}
            />
        </div>
    );
};

export default PhotographerUploadPage;
