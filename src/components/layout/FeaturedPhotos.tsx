import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { photoApi, type Photo } from '../../services/api.ts';
import { Title, Paragraph, Button, Text } from '../ui';
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
                        <Title level={2} className="section-title">
                            Featured Photos
                        </Title>
                        <Paragraph className="section-subtitle">
                            Loading...
                        </Paragraph>
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
                        <Title level={2} className="section-title">
                            Featured Photos
                        </Title>
                        <Paragraph className="section-subtitle" style={{ color: 'red' }}>
                            {error}
                        </Paragraph>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="featured-photos section-sm" id="featured">
            <div className="container">
                <div className="section-header">
                    <Title level={2} className="section-title">
                        Featured Photos
                    </Title>
                    <Paragraph className="section-subtitle">
                        Discover stunning wildlife photography from Sri Lanka's most talented photographers
                    </Paragraph>
                </div>

                <div className="photos-grid">
                    {photos.length === 0 ? (
                        <Paragraph style={{ textAlign: 'center', padding: '40px' }}>
                            No photos available
                        </Paragraph>
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
                                            <Button
                                                variant="primary"
                                                className="btn-icon"
                                                aria-label="View details"
                                                icon={
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <path d="M10 3C5 3 1 10 1 10s4 7 9 7 9-7 9-7-4-7-9-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                                                    </svg>
                                                }
                                            >
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="photo-info">
                                    <div className="photo-header">
                                        <div>
                                            <Title level={3} className="photo-title">
                                                {photo.title}
                                            </Title>
                                            <Text as="p" className="photo-photographer" size="sm" color="muted">
                                                by {photo.photographerName || 'Unknown'}
                                            </Text>
                                        </div>
                                        <Text as="div" className="photo-price" weight="bold" size="lg">
                                            $ {photo.basePrice?.toFixed(2)}
                                        </Text>
                                    </div>

                                    <div className="photo-footer">
                                        <Text as="span" className="photo-category" size="sm">
                                            {Array.isArray(photo.categories)
                                                ? photo.categories.map(cat => cat.name).join(', ')
                                                : photo.categories || 'Uncategorized'}
                                        </Text>
                                        <button className="btn-link">
                                            <Text as="span" size="sm" weight="medium">
                                                View Details
                                            </Text>
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
                    <Link to="/explore">
                        <Button
                            variant="secondary"
                            size="lg"
                            icon={
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            }
                            iconPosition="right"
                        >
                            Explore All Photos
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedPhotos;
