import { useState } from 'react';
import '../dashboard/Dashboard.css';
import './AdminDashboard.css';
import './PhotosPage.css';

interface Photo {
    id: number;
    title: string;
    description?: string;
    imageUrl: string;
    thumbnailUrl: string;
    watermarkedUrl?: string;
    photographer: {
        id: number;
        firstName: string;
        lastName: string;
        username: string;
    };
    fileSize: number;
    width: number;
    height: number;
    format: string;
    basePrice: number;
    commercialPrice?: number;
    editorialPrice?: number;
    extendedPrice?: number;
    isApproved: boolean;
    isFeatured: boolean;
    isActive: boolean;
    viewCount: number;
    downloadCount: number;
    likeCount: number;
    location?: string;
    cameraModel?: string;
    lens?: string;
    focalLength?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: string;
    captureDate?: string;
    createdAt: string;
    tags: string[];
    categories: string[];
}

const PhotosPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Mock data - replace with API calls
    const mockPhotos: Photo[] = [
        {
            id: 1,
            title: 'Sri Lankan Leopard in Yala',
            description: 'A magnificent leopard spotted in Yala National Park during early morning safari',
            imageUrl: '/api/placeholder/1920/1080',
            thumbnailUrl: '/api/placeholder/400/300',
            watermarkedUrl: '/api/placeholder/1920/1080',
            photographer: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                username: 'johndoe'
            },
            fileSize: 5242880,
            width: 1920,
            height: 1080,
            format: 'jpg',
            basePrice: 50.00,
            commercialPrice: 150.00,
            editorialPrice: 100.00,
            extendedPrice: 250.00,
            isApproved: false,
            isFeatured: false,
            isActive: true,
            viewCount: 245,
            downloadCount: 12,
            likeCount: 34,
            location: 'Yala National Park, Sri Lanka',
            cameraModel: 'Canon EOS R5',
            lens: 'RF 100-500mm f/4.5-7.1L IS USM',
            focalLength: '400mm',
            aperture: 'f/5.6',
            shutterSpeed: '1/1000',
            iso: '800',
            captureDate: '2024-11-30T08:30:00',
            createdAt: '2024-12-01T10:00:00',
            tags: ['leopard', 'wildlife', 'mammal', 'yala'],
            categories: ['Wildlife', 'Mammals']
        },
        {
            id: 2,
            title: 'Asian Elephant Herd',
            description: 'Family of elephants crossing the road in Udawalawe',
            imageUrl: '/api/placeholder/1920/1080',
            thumbnailUrl: '/api/placeholder/400/300',
            photographer: {
                id: 2,
                firstName: 'Jane',
                lastName: 'Smith',
                username: 'janesmith'
            },
            fileSize: 6291456,
            width: 2400,
            height: 1600,
            format: 'jpg',
            basePrice: 45.00,
            commercialPrice: 135.00,
            isApproved: true,
            isFeatured: true,
            isActive: true,
            viewCount: 892,
            downloadCount: 45,
            likeCount: 156,
            location: 'Udawalawe National Park',
            cameraModel: 'Sony A7R V',
            createdAt: '2024-11-28T14:20:00',
            tags: ['elephant', 'wildlife', 'mammal'],
            categories: ['Wildlife', 'Mammals']
        },
        {
            id: 3,
            title: 'Blue Whale Breach',
            description: 'Rare blue whale breaching off the coast of Mirissa',
            imageUrl: '/api/placeholder/1920/1080',
            thumbnailUrl: '/api/placeholder/400/300',
            photographer: {
                id: 3,
                firstName: 'Mike',
                lastName: 'Johnson',
                username: 'mikejohnson'
            },
            fileSize: 7340032,
            width: 3000,
            height: 2000,
            format: 'jpg',
            basePrice: 75.00,
            commercialPrice: 225.00,
            editorialPrice: 150.00,
            isApproved: true,
            isFeatured: false,
            isActive: true,
            viewCount: 1523,
            downloadCount: 67,
            likeCount: 289,
            location: 'Mirissa, Sri Lanka',
            createdAt: '2024-11-25T09:15:00',
            tags: ['whale', 'marine', 'ocean'],
            categories: ['Wildlife', 'Marine Life']
        },
        {
            id: 4,
            title: 'Peacock Display',
            description: 'Male peacock displaying vibrant plumage',
            imageUrl: '/api/placeholder/1920/1080',
            thumbnailUrl: '/api/placeholder/400/300',
            photographer: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                username: 'johndoe'
            },
            fileSize: 4194304,
            width: 1800,
            height: 1200,
            format: 'jpg',
            basePrice: 35.00,
            isApproved: false,
            isFeatured: false,
            isActive: true,
            viewCount: 67,
            downloadCount: 3,
            likeCount: 12,
            location: 'Sinharaja Forest Reserve',
            createdAt: '2024-12-10T11:30:00',
            tags: ['peacock', 'bird', 'colorful'],
            categories: ['Wildlife', 'Birds']
        }
    ];

    const stats = {
        totalPhotos: 12456,
        pendingApproval: 23,
        approved: 11234,
        rejected: 189,
        featured: 156,
        totalViews: 1234567,
        totalDownloads: 45678
    };

    const filteredPhotos = mockPhotos.filter(photo => {
        const matchesSearch = searchTerm === '' ||
            photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            photo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            photo.photographer.username.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' ||
            (statusFilter === 'PENDING' && !photo.isApproved) ||
            (statusFilter === 'APPROVED' && photo.isApproved) ||
            (statusFilter === 'FEATURED' && photo.isFeatured) ||
            (statusFilter === 'INACTIVE' && !photo.isActive);

        const matchesCategory = categoryFilter === 'ALL' ||
            photo.categories.includes(categoryFilter);

        return matchesSearch && matchesStatus && matchesCategory;
    });

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

    const handleApprove = (photo: Photo) => {
        console.log('Approve photo:', photo.id);
        // API call: PATCH /api/v1/photos/{id}/approve
    };

    const handleReject = (photo: Photo) => {
        setSelectedPhoto(photo);
        setShowApprovalModal(true);
    };

    const confirmReject = () => {
        if (selectedPhoto && rejectionReason) {
            console.log('Reject photo:', selectedPhoto.id, 'Reason:', rejectionReason);
            // API call: PATCH /api/v1/photos/{id}/reject?reason={reason}
            setShowApprovalModal(false);
            setRejectionReason('');
        }
    };

    const handleToggleFeatured = (photo: Photo) => {
        console.log('Toggle featured:', photo.id, !photo.isFeatured);
        // API call: PATCH /api/v1/photos/{id}/featured?featured={boolean}
    };

    const handleToggleActive = (photo: Photo) => {
        console.log('Toggle active:', photo.id, !photo.isActive);
        // API call: PATCH /api/v1/photos/{id}/activate or /deactivate
    };

    const handleDelete = (photo: Photo) => {
        if (confirm(`Are you sure you want to delete "${photo.title}"?`)) {
            console.log('Delete photo:', photo.id);
            // API call: DELETE /api/v1/photos/{id}
        }
    };

    return (
        <div className="photos-page">
            <div className="page-header">
                <div>
                    <h2>Photo Management</h2>
                    <p className="page-subtitle">Review and manage all photos on the platform</p>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Grid View"
                        >
                            ⊞
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="List View"
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </div>

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
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="admin-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
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
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="ALL">All Categories</option>
                        <option value="Wildlife">Wildlife</option>
                        <option value="Mammals">Mammals</option>
                        <option value="Birds">Birds</option>
                        <option value="Marine Life">Marine Life</option>
                    </select>
                </div>

                {/* Photo Grid/List */}
                {viewMode === 'grid' ? (
                    <div className="photo-grid">
                        {filteredPhotos.map((photo) => (
                            <div key={photo.id} className="photo-card">
                                <div className="photo-image-container">
                                    <img src={photo.thumbnailUrl} alt={photo.title} className="photo-image" />
                                    <div className="photo-overlay">
                                        <div className="photo-stats">
                                            <span title="Views">👁️ {photo.viewCount}</span>
                                            <span title="Downloads">⬇️ {photo.downloadCount}</span>
                                            <span title="Likes">❤️ {photo.likeCount}</span>
                                        </div>
                                        <div className="photo-actions">
                                            <button
                                                className="action-btn-overlay"
                                                title="View Details"
                                                onClick={() => handleViewDetails(photo)}
                                            >
                                                👁️
                                            </button>
                                            {!photo.isApproved && (
                                                <>
                                                    <button
                                                        className="action-btn-overlay success"
                                                        title="Approve"
                                                        onClick={() => handleApprove(photo)}
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        className="action-btn-overlay danger"
                                                        title="Reject"
                                                        onClick={() => handleReject(photo)}
                                                    >
                                                        ✗
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                className={`action-btn-overlay ${photo.isFeatured ? 'featured' : ''}`}
                                                title={photo.isFeatured ? 'Unfeature' : 'Feature'}
                                                onClick={() => handleToggleFeatured(photo)}
                                            >
                                                ⭐
                                            </button>
                                        </div>
                                    </div>
                                    <div className="photo-badges">
                                        {!photo.isApproved && <span className="badge pending">Pending</span>}
                                        {photo.isApproved && <span className="badge approved">Approved</span>}
                                        {photo.isFeatured && <span className="badge featured">Featured</span>}
                                        {!photo.isActive && <span className="badge inactive">Inactive</span>}
                                    </div>
                                </div>
                                <div className="photo-info">
                                    <h4 className="photo-title">{photo.title}</h4>
                                    <p className="photo-photographer">by @{photo.photographer.username}</p>
                                    <div className="photo-meta">
                                        <span>{photo.width}×{photo.height}</span>
                                        <span>{formatFileSize(photo.fileSize)}</span>
                                        <span>${photo.basePrice}</span>
                                    </div>
                                    <div className="photo-tags">
                                        {photo.tags.slice(0, 3).map((tag, idx) => (
                                            <span key={idx} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
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
                                {filteredPhotos.map((photo) => (
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
                                        <td>@{photo.photographer.username}</td>
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
                <div className="table-pagination">
                    <div className="pagination-info">
                        Showing {filteredPhotos.length} of {mockPhotos.length} photos
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
                                        <p>@{selectedPhoto.photographer.username} ({selectedPhoto.photographer.firstName} {selectedPhoto.photographer.lastName})</p>
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
                                            {selectedPhoto.tags.map((tag, idx) => (
                                                <span key={idx} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Categories</h4>
                                        <div className="tags-list">
                                            {selectedPhoto.categories.map((cat, idx) => (
                                                <span key={idx} className="category-tag">{cat}</span>
                                            ))}
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
