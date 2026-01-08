import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Title, Paragraph, Button } from '../../components/ui';
import { DashboardPageHeader, DashboardSection, EmptyState } from '../../components/dashboard';
import { photoApi, authApi } from '../../services/api';
import '../dashboard/Dashboard.css';
import './PhotographerPortfolioPage.css';

interface Photo {
    id: number;
    title: string;
    imageUrl: string;
    price: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    views: number;
    likes: number;
    sales: number;
    uploadedAt: string;
}

const PhotographerPortfolioPage = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
    const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'sales'>('recent');

    useEffect(() => {
        fetchPhotos();
    }, [filter, sortBy]);

    const fetchPhotos = async () => {
        try {
            setLoading(true);
            const user = authApi.getCurrentUser();
            if (user?.id) {
                const data = await photoApi.getPhotographerPhotos(user.id, { status: filter, sortBy });
                setPhotos(data);
            }
        } catch (error) {
            console.error('Failed to fetch photos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (photoId: number) => {
        if (!confirm('Are you sure you want to delete this photo?')) return;

        try {
            await photoApi.deletePhoto(photoId);
            setPhotos(photos.filter(p => p.id !== photoId));
        } catch (error) {
            console.error('Failed to delete photo:', error);
            alert('Failed to delete photo');
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            APPROVED: { class: 'status-approved', text: 'Approved' },
            PENDING: { class: 'status-pending', text: 'Pending' },
            REJECTED: { class: 'status-rejected', text: 'Rejected' }
        };
        return badges[status as keyof typeof badges] || badges.PENDING;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const stats = {
        total: photos.length,
        approved: photos.filter(p => p.status === 'APPROVED').length,
        pending: photos.filter(p => p.status === 'PENDING').length,
        rejected: photos.filter(p => p.status === 'REJECTED').length,
    };

    return (
        <div className="photographer-portfolio-page">
            <DashboardPageHeader
                title="My Portfolio"
                subtitle="Manage your uploaded photos"
            >
                <Link to="/photographer/upload">
                    <Button variant="primary">
                        <span>📤</span> Upload New Photo
                    </Button>
                </Link>
            </DashboardPageHeader>

            {/* Portfolio Stats */}
            <div className="portfolio-stats">
                <div className="stat-item">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Photos</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{stats.approved}</div>
                    <div className="stat-label">Approved</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{stats.pending}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{stats.rejected}</div>
                    <div className="stat-label">Rejected</div>
                </div>
            </div>

            {/* Filters and Sort */}
            <DashboardSection>
                <div className="portfolio-controls">
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All Photos
                        </button>
                        <button
                            className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
                            onClick={() => setFilter('approved')}
                        >
                            Approved
                        </button>
                        <button
                            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
                            onClick={() => setFilter('pending')}
                        >
                            Pending
                        </button>
                        <button
                            className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
                            onClick={() => setFilter('rejected')}
                        >
                            Rejected
                        </button>
                    </div>

                    <select
                        className="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                    >
                        <option value="recent">Most Recent</option>
                        <option value="popular">Most Popular</option>
                        <option value="sales">Best Selling</option>
                    </select>
                </div>
            </DashboardSection>

            {/* Photos Grid */}
            <DashboardSection>
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <Paragraph>Loading your portfolio...</Paragraph>
                    </div>
                ) : photos.length === 0 ? (
                    <EmptyState
                        message={filter === 'all' ? 'No photos uploaded yet' : `No ${filter} photos`}
                        action={
                            <Link to="/photographer/upload">
                                <Button variant="primary">Upload Your First Photo</Button>
                            </Link>
                        }
                    />
                ) : (
                    <div className="portfolio-grid">
                        {photos.map((photo) => (
                            <div key={photo.id} className="portfolio-card">
                                <div className="photo-image-container">
                                    <img src={photo.imageUrl} alt={photo.title} className="photo-image" />
                                    <div className={`photo-status ${getStatusBadge(photo.status).class}`}>
                                        {getStatusBadge(photo.status).text}
                                    </div>
                                </div>

                                <div className="photo-details">
                                    <Title level={4} className="photo-title">{photo.title}</Title>
                                    <div className="photo-price">{formatCurrency(photo.price)}</div>

                                    <div className="photo-stats">
                                        <div className="photo-stat">
                                            <span className="stat-icon">👁️</span>
                                            <span>{photo.views}</span>
                                        </div>
                                        <div className="photo-stat">
                                            <span className="stat-icon">❤️</span>
                                            <span>{photo.likes}</span>
                                        </div>
                                        <div className="photo-stat">
                                            <span className="stat-icon">🛒</span>
                                            <span>{photo.sales}</span>
                                        </div>
                                    </div>

                                    <div className="photo-actions">
                                        <button className="action-btn edit-btn">
                                            <span>✏️</span> Edit
                                        </button>
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => handleDelete(photo.id)}
                                        >
                                            <span>🗑️</span> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </DashboardSection>
        </div>
    );
};

export default PhotographerPortfolioPage;
