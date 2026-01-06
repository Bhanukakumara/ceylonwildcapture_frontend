import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { photoApi, type Photo } from '../services/api';
import './FeaturedPhotos.css';

const FeaturedPhotos = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecentPhotos = async () => {
            try {
                setLoading(true);
                const response = await photoApi.getRecentlyUploaded(0, 6);
                setPhotos(response.content || []);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch recent photos:', err);
                setError('Failed to load photos');
            } finally {
                setLoading(false);
            }
        };

        fetchRecentPhotos();
    }, []);

    if (loading) {
        return (
            <section className="featured-photos section-sm" id="featured">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Photos</h2>
                        <p className="section-subtitle">Loading...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="featured-photos section-sm" id="featured">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Photos</h2>
                        <p className="section-subtitle" style={{ color: 'red' }}>{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="featured-photos section-sm" id="featured">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Featured Photos</h2>
                    <p className="section-subtitle">
                        Discover stunning wildlife photography from Sri Lanka's most talented photographers
                    </p>
                </div>

                <div className="photos-grid">
                    {photos.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '40px' }}>No photos available</p>
                    ) : (
                        photos.map((photo) => (
                            <Link
                                key={photo.id}
                                to={`/photo/${photo.id}`}
                                className="photo-card"
                            >
                                <div className="photo-image-wrapper">
                                    <img
                                        src={photo.watermarkedUrl || photo.imageUrl}
                                        alt={photo.title}
                                        className="photo-image"
                                        loading="lazy"
                                    />
                                    <div className="photo-overlay">
                                        <div className="photo-actions">
                                            <button className="btn btn-primary btn-icon" aria-label="View details">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <path d="M10 3C5 3 1 10 1 10s4 7 9 7 9-7 9-7-4-7-9-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="photo-info">
                                    <div className="photo-header">
                                        <div>
                                            <h3 className="photo-title">{photo.title}</h3>
                                            <p className="photo-photographer">
                                                by {photo.photographerName || 'Unknown'}
                                            </p>
                                        </div>
                                        <div className="photo-price">
                                            $ {photo.basePrice?.toFixed(2)}
                                        </div>
                                    </div>

                                    <div className="photo-footer">
                                        <span className="photo-category">
                                            {Array.isArray(photo.categories)
                                                ? photo.categories.map(cat => cat.name).join(', ')
                                                : photo.categories || 'Uncategorized'}
                                        </span>
                                        <button className="btn-link">
                                            View Details
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                <div className="section-cta">
                    <Link to="/explore" className="btn btn-secondary btn-lg">
                        Explore All Photos
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedPhotos;
