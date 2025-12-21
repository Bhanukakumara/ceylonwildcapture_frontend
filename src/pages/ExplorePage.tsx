import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { photoApi, categoryApi, type Photo, type Category } from '../services/api';
import { useCart } from '../contexts/CartContext';
import './ExplorePage.css';

const ExplorePage = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    // Filters
    const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('newest');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Cart functionality
    const { addToCart } = useCart();
    const [addingToCart, setAddingToCart] = useState<{ [key: number]: boolean }>({});
    const [addedToCart, setAddedToCart] = useState<{ [key: number]: boolean }>({});

    const pageSize = 12;

    // Load categories on mount
    useEffect(() => {
        loadCategories();
    }, []);

    // Sync search query from URL
    useEffect(() => {
        const queryParam = searchParams.get('search');
        if (queryParam !== null) {
            setSearchQuery(queryParam);
            setCurrentPage(0);
        }
    }, [searchParams]);

    // Load photos when filters change (with debounce for search)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadPhotos();
        }, searchQuery ? 500 : 0); // Debounce search by 500ms

        return () => clearTimeout(timeoutId);
    }, [selectedCategory, sortBy, currentPage, searchQuery]);

    const loadCategories = async () => {
        try {
            const categoriesData = await categoryApi.getAllCategories();
            setCategories(categoriesData);
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };

    const loadPhotos = async () => {
        try {
            setLoading(true);
            setError(null);

            let response;

            // Determine sort parameter
            if (sortBy === 'popular') {
            } else if (sortBy === 'price-low') {
            } else if (sortBy === 'price-high') {
            }

            // Fetch photos based on search or filters
            if (searchQuery.trim()) {
                // Search photos by title or description
                response = await photoApi.searchPhotos(searchQuery, currentPage, pageSize);
            } else if (selectedCategory) {
                response = await photoApi.getPhotosByCategory(selectedCategory, currentPage, pageSize);
            } else {
                // Get approved and active photos only
                response = await photoApi.getApprovedAndActive(currentPage, pageSize);
            }

            setPhotos(response.content);
            setTotalPages(response.totalPages);
        } catch (err) {
            console.error('Failed to load photos:', err);
            setError('Failed to load photos. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0); // Reset to first page
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setSearchQuery(''); // Clear search when changing category
        setCurrentPage(0); // Reset to first page
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
        setCurrentPage(0); // Reset to first page
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddToCart = async (photo: Photo, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to photo detail
        e.stopPropagation();

        try {
            setAddingToCart(prev => ({ ...prev, [photo.id]: true }));

            await addToCart(
                photo.id,
                photo.title,
                photo.thumbnailUrl || photo.imageUrl,
                photo.photographer?.username || 'Unknown',
                'PERSONAL', // Default license type
                photo.basePrice
            );

            // Show success feedback
            setAddedToCart(prev => ({ ...prev, [photo.id]: true }));

            // Reset success feedback after 2 seconds
            setTimeout(() => {
                setAddedToCart(prev => ({ ...prev, [photo.id]: false }));
            }, 2000);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setAddingToCart(prev => ({ ...prev, [photo.id]: false }));
        }
    };

    return (
        <div className="explore-page">
            <div className="container">
                <div className="explore-header">
                    <h1 data-aos="fade-up">Explore Wildlife Photography</h1>
                    <p data-aos="fade-up" data-aos-delay="100">Browse through our collection of stunning wildlife photos from Sri Lanka</p>
                </div>

                {/* Search Bar */}
                <div className="search-container">
                    <div className="search-input-wrapper">
                        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search photos by title, description, or tags..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        {searchQuery && (
                            <button
                                className="clear-search-btn"
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="explore-filters">
                    <div className="filter-group">
                        <label>Category</label>
                        <select
                            className="filter-select"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.slug}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Sort By</label>
                        <select
                            className="filter-select"
                            value={sortBy}
                            onChange={handleSortChange}
                        >
                            <option value="newest">Newest</option>
                            <option value="popular">Popular</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading photos...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p className="error-message">{error}</p>
                    </div>
                ) : photos.length === 0 ? (
                    <div className="empty-state">
                        <p>No photos found</p>
                    </div>
                ) : (
                    <>
                        <div className="explore-grid">
                            {photos.map((photo, index) => (
                                <Link
                                    key={photo.id}
                                    to={`/photo/${photo.id}`}
                                    className="explore-card glass hover-lift"
                                    data-aos="fade-up"
                                    data-aos-delay={Math.min(index * 50, 300)}
                                >
                                    <div className="explore-image-wrapper">
                                        <img
                                            src={photo.thumbnailUrl || photo.imageUrl}
                                            alt={photo.title}
                                            className="explore-image"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="explore-info">
                                        <h3>{photo.title}</h3>
                                        <p className="explore-photographer">
                                            by {photo.photographer?.username || 'Unknown'}
                                        </p>
                                        <div className="explore-footer">
                                            <span className="explore-price">${photo.basePrice.toFixed(2)}</span>
                                            <div className="explore-actions">
                                                <button
                                                    className={`btn btn-sm ${addedToCart[photo.id]
                                                        ? 'btn-success'
                                                        : 'btn-primary'
                                                        }`}
                                                    onClick={(e) => handleAddToCart(photo, e)}
                                                    disabled={addingToCart[photo.id]}
                                                >
                                                    {addingToCart[photo.id] ? (
                                                        <>
                                                            <svg className="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                                                                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                                            </svg>
                                                        </>
                                                    ) : addedToCart[photo.id] ? (
                                                        '✓ Added'
                                                    ) : (
                                                        <>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: '4px' }}>
                                                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.6 4.4M17 13l1.6 4.4M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                            Add to Cart
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="explore-pagination">
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                >
                                    Previous
                                </button>
                                <div className="pagination-numbers">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i;
                                        } else if (currentPage < 3) {
                                            pageNum = i;
                                        } else if (currentPage > totalPages - 3) {
                                            pageNum = totalPages - 5 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                                                onClick={() => handlePageChange(pageNum)}
                                            >
                                                {pageNum + 1}
                                            </button>
                                        );
                                    })}
                                    {totalPages > 5 && currentPage < totalPages - 3 && (
                                        <>
                                            <span>...</span>
                                            <button
                                                className="page-btn"
                                                onClick={() => handlePageChange(totalPages - 1)}
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                </div>
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ExplorePage;
