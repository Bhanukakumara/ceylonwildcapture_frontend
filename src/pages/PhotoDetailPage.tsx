import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { photoApi, type Photo } from '../services/api';
import { useCart } from '../contexts/CartContext';
import './PhotoDetailPage.css';

interface LicenseOption {
    type: 'personal' | 'commercial' | 'extended';
    name: string;
    price: number;
    description: string;
    features: string[];
}

const PhotoDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [photo, setPhoto] = useState<Photo | null>(null);
    const [relatedPhotos, setRelatedPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLicense, setSelectedLicense] = useState<'personal' | 'commercial' | 'extended'>('personal');
    const [isZoomed, setIsZoomed] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Load photo data on mount
    useEffect(() => {
        if (id) {
            loadPhotoData(parseInt(id));
        }
    }, [id]);

    const loadPhotoData = async (photoId: number) => {
        try {
            setLoading(true);
            setError(null);

            // Fetch photo with photographer details
            const photoData = await photoApi.getPhotoWithPhotographer(photoId);
            setPhoto(photoData);

            // Fetch related photos from same category
            if (photoData.categories && photoData.categories.length > 0) {
                const categorySlug = photoData.categories[0].slug;
                const relatedResponse = await photoApi.getPhotosByCategory(categorySlug, 0, 4);
                // Filter out current photo from related
                const filtered = relatedResponse.content.filter(p => p.id !== photoId);
                setRelatedPhotos(filtered.slice(0, 4));
            } else {
                // If no category, get recent photos
                const recentResponse = await photoApi.getRecentlyUploaded(0, 4);
                const filtered = recentResponse.content.filter(p => p.id !== photoId);
                setRelatedPhotos(filtered.slice(0, 4));
            }
        } catch (err) {
            console.error('Failed to load photo:', err);
            setError('Failed to load photo details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const licenseOptions: LicenseOption[] = [
        {
            type: 'personal',
            name: 'Personal Use',
            price: 49.99,
            description: 'For personal projects and non-commercial use',
            features: [
                'High resolution download',
                'Personal website use',
                'Social media sharing',
                'Print for personal use',
                'Lifetime access',
            ],
        },
        {
            type: 'commercial',
            name: 'Commercial Use',
            price: 99.99,
            description: 'For business and commercial projects',
            features: [
                'All personal features',
                'Commercial website use',
                'Marketing materials',
                'Product packaging',
                'Up to 500,000 impressions',
            ],
        },
        {
            type: 'extended',
            name: 'Extended License',
            price: 249.99,
            description: 'Unlimited commercial rights',
            features: [
                'All commercial features',
                'Unlimited impressions',
                'Merchandise for resale',
                'Digital templates',
                'Priority support',
            ],
        },
    ];

    const selectedOption = licenseOptions.find(opt => opt.type === selectedLicense)!;

    const handleAddToCart = async () => {
        if (!photo) return;

        try {
            // Convert license type to uppercase for backend
            const backendLicenseType = selectedLicense.toUpperCase() as 'PERSONAL' | 'COMMERCIAL' | 'EXTENDED';

            await addToCart(
                photo.id,
                photo.title,
                photo.thumbnailUrl || photo.imageUrl,
                photo.photographer?.username || 'Unknown',
                backendLicenseType,
                selectedOption.price
            );

            // Show success message
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (error) {
            // Error is already handled in CartContext
            console.error('Failed to add to cart:', error);
        }
    };

    if (loading) {
        return (
            <div className="photo-detail-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading photo details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !photo) {
        return (
            <div className="photo-detail-page">
                <div className="container">
                    <div className="error-container">
                        <p className="error-message">{error || 'Photo not found'}</p>
                        <button className="btn btn-primary" onClick={() => navigate('/explore')}>
                            Back to Explore
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Helper to format EXIF data
    const formatExifData = () => {
        const parts = [];
        if (photo.aperture) parts.push(`f/${photo.aperture}`);
        if (photo.shutterSpeed) parts.push(photo.shutterSpeed);
        if (photo.iso) parts.push(`ISO ${photo.iso}`);
        return parts.join(', ') || 'N/A';
    };

    return (
        <div className="photo-detail-page">
            <div className="container">
                {/* Back Button */}
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                </button>

                <div className="photo-detail-layout">
                    {/* Main Image Section */}
                    <div className="photo-main-section">
                        <div className={`photo-viewer ${isZoomed ? 'zoomed' : ''}`} onClick={() => setIsZoomed(!isZoomed)}>
                            <img src={photo.imageUrl} alt={photo.title} />
                            {!isZoomed && (
                                <div className="zoom-hint">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                                        <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    Click to zoom
                                </div>
                            )}
                        </div>

                        {/* Photo Info */}
                        <div className="photo-info glass">
                            <div className="info-row">
                                <div className="info-item">
                                    <span className="info-label">Resolution</span>
                                    <span className="info-value">{photo.width}x{photo.height}px</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">File Size</span>
                                    <span className="info-value">{(photo.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Category</span>
                                    <span className="info-value">{photo.categories?.[0]?.name || 'Uncategorized'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="photo-sidebar">
                        {/* Title & Stats */}
                        <div className="photo-header">
                            <h1>{photo.title}</h1>
                            <div className="photo-stats">
                                <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" /></svg> {photo.viewCount}</span>
                                <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" fill="currentColor" /></svg> {photo.likeCount}</span>
                                <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> {photo.downloadCount}</span>
                            </div>
                        </div>

                        {/* Photographer */}
                        {photo.photographer && (
                            <Link to={`/photographer/${photo.photographer.id}`} className="photographer-card glass">
                                <div className="photographer-avatar">
                                    {photo.photographer.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="photographer-info">
                                    <h3>{photo.photographer.username}</h3>
                                    <p>{photo.photographer.firstName} {photo.photographer.lastName}</p>
                                </div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="arrow-icon">
                                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        )}

                        {/* License Selection */}
                        <div className="license-section glass">
                            <h2>Choose License</h2>
                            <div className="license-options">
                                {licenseOptions.map((option) => (
                                    <div
                                        key={option.type}
                                        className={`license-option ${selectedLicense === option.type ? 'selected' : ''}`}
                                        onClick={() => setSelectedLicense(option.type)}
                                    >
                                        <div className="license-header">
                                            <div>
                                                <h4>{option.name}</h4>
                                                <p className="license-desc">{option.description}</p>
                                            </div>
                                            <span className="license-price">${option.price}</span>
                                        </div>
                                        <ul className="license-features">
                                            {option.features.map((feature, idx) => (
                                                <li key={idx}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-primary add-to-cart-btn" onClick={handleAddToCart}>
                                Add to Cart - ${selectedOption.price}
                            </button>

                            {showSuccessMessage && (
                                <div className="success-message">
                                    ✓ Added to cart! <Link to="/cart" className="view-cart-link">View Cart</Link>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="photo-description glass">
                            <h3>About this photo</h3>
                            <p>{photo.description || 'No description available.'}</p>

                            <div className="photo-metadata">
                                {photo.location && (
                                    <div className="metadata-item">
                                        <span className="metadata-label">Location</span>
                                        <span className="metadata-value">{photo.location}</span>
                                    </div>
                                )}
                                {photo.captureDate && (
                                    <div className="metadata-item">
                                        <span className="metadata-label">Date</span>
                                        <span className="metadata-value">{new Date(photo.captureDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {photo.cameraModel && (
                                    <div className="metadata-item">
                                        <span className="metadata-label">Camera</span>
                                        <span className="metadata-value">{photo.cameraModel}</span>
                                    </div>
                                )}
                                {photo.lens && (
                                    <div className="metadata-item">
                                        <span className="metadata-label">Lens</span>
                                        <span className="metadata-value">{photo.lens}</span>
                                    </div>
                                )}
                                <div className="metadata-item">
                                    <span className="metadata-label">Settings</span>
                                    <span className="metadata-value">{formatExifData()}</span>
                                </div>
                            </div>

                            {photo.tags && photo.tags.length > 0 && (
                                <div className="photo-tags">
                                    {photo.tags.map((tag) => (
                                        <span key={tag.id} className="tag">{tag.name}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Photos */}
                {relatedPhotos.length > 0 && (
                    <div className="related-section">
                        <h2>Related Photos</h2>
                        <div className="related-grid">
                            {relatedPhotos.map((relatedPhoto) => (
                                <Link key={relatedPhoto.id} to={`/photo/${relatedPhoto.id}`} className="related-card">
                                    <img src={relatedPhoto.thumbnailUrl || relatedPhoto.imageUrl} alt={relatedPhoto.title} />
                                    <div className="related-overlay">
                                        <h4>{relatedPhoto.title}</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhotoDetailPage;
